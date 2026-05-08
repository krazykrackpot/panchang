#!/usr/bin/env npx tsx
/**
 * SEO Index Audit & Submission Script
 *
 * What it does:
 * 1. Fetches the live sitemap.xml and extracts all URLs
 * 2. Queries Google Search Console Search Analytics to find indexed pages
 * 3. Checks GSC sitemap processing status
 * 4. Runs URL Inspection on a priority sample (2,000/day quota)
 * 5. Submits unindexed URLs to Bing via URL Submission API
 * 6. Generates a coverage report
 *
 * Prerequisites:
 *   - GCP service account JSON key with Search Console API enabled
 *   - Service account email added as user in GSC (Settings → Users and permissions)
 *   - Bing Webmaster API key from https://www.bing.com/webmasters/apikey
 *
 * Environment variables (in .env.local):
 *   GSC_SERVICE_ACCOUNT_KEY_PATH — path to GCP service account JSON
 *   BING_WEBMASTER_API_KEY — Bing URL Submission API key
 *
 * Usage:
 *   npx tsx scripts/seo-index-audit.ts                    # full audit
 *   npx tsx scripts/seo-index-audit.ts --sitemap-only     # just parse sitemap
 *   npx tsx scripts/seo-index-audit.ts --gsc-only         # just GSC audit
 *   npx tsx scripts/seo-index-audit.ts --bing-only        # just Bing submission
 *   npx tsx scripts/seo-index-audit.ts --inspect=50       # URL Inspection on top 50 priority URLs
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SITE = 'https://dekhopanchang.com';
const GSC_PROPERTY = 'sc-domain:dekhopanchang.com'; // domain property — or use URL prefix: 'https://dekhopanchang.com/'
const SITEMAP_URL = `${SITE}/sitemap.xml`;
const BING_SUBMIT_ENDPOINT = 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch';
const REPORT_DIR = path.join(process.cwd(), 'reports');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadEnv() {
  // Load .env.local manually (script runs outside Next.js)
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

// ---------------------------------------------------------------------------
// 1. Sitemap Parser — fetch & extract all URLs
// ---------------------------------------------------------------------------
async function fetchSitemapUrls(): Promise<string[]> {
  console.log('\n━━━ 1. Fetching sitemap ━━━');
  console.log(`   URL: ${SITEMAP_URL}`);

  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);

  const xml = await res.text();

  // Check if this is a sitemap index (contains <sitemapindex>)
  const isSitemapIndex = xml.includes('<sitemapindex');

  let allUrls: string[] = [];

  if (isSitemapIndex) {
    // Extract child sitemap URLs
    const childSitemaps = [...xml.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/g)]
      .map(m => m[1].trim());
    console.log(`   Sitemap index with ${childSitemaps.length} child sitemaps`);

    for (const childUrl of childSitemaps) {
      console.log(`   Fetching: ${childUrl}`);
      const childRes = await fetch(childUrl);
      if (!childRes.ok) {
        console.warn(`   ⚠ Failed to fetch ${childUrl}: ${childRes.status}`);
        continue;
      }
      const childXml = await childRes.text();
      const urls = [...childXml.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/g)]
        .map(m => m[1].trim());
      allUrls.push(...urls);
    }
  } else {
    // Single sitemap — extract <loc> entries
    allUrls = [...xml.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/g)]
      .map(m => m[1].trim());
  }

  // Deduplicate
  allUrls = [...new Set(allUrls)];

  console.log(`   Total unique URLs in sitemap: ${allUrls.length.toLocaleString()}`);

  // Categorise by path prefix
  const categories = new Map<string, number>();
  for (const url of allUrls) {
    const path = new URL(url).pathname;
    // Extract category: /{locale}/{category}/...
    const parts = path.split('/').filter(Boolean);
    const cat = parts.length >= 2 ? parts[1] : parts[0] || 'root';
    categories.set(cat, (categories.get(cat) || 0) + 1);
  }

  console.log('\n   URL distribution:');
  const sorted = [...categories.entries()].sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sorted.slice(0, 15)) {
    console.log(`     ${cat.padEnd(25)} ${count.toLocaleString().padStart(6)}`);
  }
  if (sorted.length > 15) {
    console.log(`     ... and ${sorted.length - 15} more categories`);
  }

  return allUrls;
}

// ---------------------------------------------------------------------------
// 2. GSC Search Analytics — find pages with impressions (= indexed)
// ---------------------------------------------------------------------------
async function getGscIndexedPages(auth: any): Promise<{
  indexedUrls: Set<string>;
  analytics: Array<{ url: string; clicks: number; impressions: number; position: number }>;
}> {
  console.log('\n━━━ 2. GSC Search Analytics ━━━');
  const { google } = await import('googleapis');
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const analytics: Array<{ url: string; clicks: number; impressions: number; position: number }> = [];
  const indexedUrls = new Set<string>();

  // Search Analytics returns max 25,000 rows — paginate with startRow
  let startRow = 0;
  const rowLimit = 25000;

  // Query last 90 days for maximum coverage
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  console.log(`   Date range: ${formatDate(startDate)} to ${formatDate(endDate)}`);
  console.log(`   Property: ${GSC_PROPERTY}`);

  while (true) {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: GSC_PROPERTY,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['page'],
        rowLimit,
        startRow,
      },
    });

    const rows = res.data.rows || [];
    if (rows.length === 0) break;

    for (const row of rows) {
      const url = row.keys?.[0] || '';
      const entry = {
        url,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        position: Math.round((row.position || 0) * 10) / 10,
      };
      analytics.push(entry);
      indexedUrls.add(url);
    }

    console.log(`   Fetched ${analytics.length} pages so far...`);

    if (rows.length < rowLimit) break;
    startRow += rowLimit;
  }

  console.log(`   Total pages with impressions: ${indexedUrls.size.toLocaleString()}`);

  // Top 10 by clicks
  const topByClicks = [...analytics].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
  console.log('\n   Top 10 by clicks:');
  for (const p of topByClicks) {
    const short = p.url.replace(SITE, '');
    console.log(`     ${short.padEnd(50)} clicks=${String(p.clicks).padStart(5)}  imp=${String(p.impressions).padStart(7)}  pos=${p.position}`);
  }

  return { indexedUrls, analytics };
}

// ---------------------------------------------------------------------------
// 3. GSC Sitemaps status
// ---------------------------------------------------------------------------
async function checkGscSitemaps(auth: any): Promise<void> {
  console.log('\n━━━ 3. GSC Sitemap Status ━━━');
  const { google } = await import('googleapis');
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    const res = await searchconsole.sitemaps.list({ siteUrl: GSC_PROPERTY });
    const sitemaps = res.data.sitemap || [];

    if (sitemaps.length === 0) {
      console.log('   ⚠ No sitemaps found in GSC. Submit your sitemap:');
      console.log(`     ${SITEMAP_URL}`);
      return;
    }

    for (const sm of sitemaps) {
      console.log(`   ${sm.path}`);
      console.log(`     Last submitted: ${sm.lastSubmitted || 'unknown'}`);
      console.log(`     Last downloaded: ${sm.lastDownloaded || 'unknown'}`);
      console.log(`     Warnings: ${sm.warnings || 0}`);
      console.log(`     Errors: ${sm.errors || 0}`);
      if (sm.contents) {
        for (const c of sm.contents) {
          console.log(`     ${c.type}: submitted=${c.submitted}, indexed=${c.indexed}`);
        }
      }
    }
  } catch (err: any) {
    if (err.code === 403) {
      console.log('   ⚠ No access to sitemaps. Ensure the service account email is added');
      console.log('     in GSC → Settings → Users and permissions as Owner or Full user.');
    } else {
      throw err;
    }
  }
}

// ---------------------------------------------------------------------------
// 4. GSC URL Inspection (sample)
// ---------------------------------------------------------------------------
async function inspectUrls(
  auth: any,
  urls: string[],
  limit: number,
): Promise<Array<{ url: string; verdict: string; coverage: string; lastCrawl: string }>> {
  console.log(`\n━━━ 4. URL Inspection (${limit} URLs) ━━━`);
  const { google } = await import('googleapis');
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const results: Array<{ url: string; verdict: string; coverage: string; lastCrawl: string }> = [];
  const sample = urls.slice(0, limit);

  let inspected = 0;
  for (const url of sample) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: GSC_PROPERTY,
        },
      });

      const result = res.data.inspectionResult;
      const indexStatus = result?.indexStatusResult;
      const entry = {
        url,
        verdict: indexStatus?.verdict || 'UNKNOWN',
        coverage: indexStatus?.coverageState || 'unknown',
        lastCrawl: indexStatus?.lastCrawlTime || 'never',
      };
      results.push(entry);
      inspected++;

      // Progress every 25
      if (inspected % 25 === 0) {
        console.log(`   Inspected ${inspected}/${sample.length}...`);
      }

      // Rate limit: ~600/min limit — keep it safe at ~5/sec
      await new Promise(r => setTimeout(r, 200));
    } catch (err: any) {
      if (err.code === 429) {
        console.log(`   ⚠ Rate limited at ${inspected} URLs. Stopping inspection.`);
        break;
      }
      console.warn(`   ⚠ Inspection failed for ${url}: ${err.message}`);
    }
  }

  // Summary
  const verdictCounts = new Map<string, number>();
  for (const r of results) {
    verdictCounts.set(r.verdict, (verdictCounts.get(r.verdict) || 0) + 1);
  }
  console.log(`\n   Inspection results (${results.length} URLs):`);
  for (const [verdict, count] of verdictCounts) {
    console.log(`     ${verdict.padEnd(30)} ${count}`);
  }

  return results;
}

// ---------------------------------------------------------------------------
// 4b. Priority Tiers — not all pages should be indexed equally
// ---------------------------------------------------------------------------
/**
 * The sitemap has ~25K URLs but we deliberately don't push all of them.
 * Tier 1 (must be indexed): core pages, tools, learn, city panchang top tier
 * Tier 2 (nice to have): rashi pairs, devotional, nakshatra padas, horoscope
 * Tier 3 (long tail, let Google decide): festival×city×year programmatic SEO
 *
 * GSC audit + Bing submission focus on Tier 1+2 by default.
 */
function classifyUrlTier(url: string): 1 | 2 | 3 {
  const p = new URL(url).pathname;
  const parts = p.split('/').filter(Boolean);
  // parts[0] = locale, parts[1] = section, etc.
  const section = parts[1] || '';
  const depth = parts.length;

  // Tier 1: Core pages (must be indexed)
  const tier1Sections = [
    '', 'panchang', 'kundali', 'matching', 'about', 'learn', 'calendar',
    'festivals', 'ekadashi', 'pricing', 'videos', 'vs', 'daily',
    'sign-calculator', 'sade-sati', 'muhurta', 'muhurta-ai', 'prashna',
    'baby-names', 'shraddha', 'vedic-time', 'varshaphal', 'kp-system',
    'prashna-ashtamangala', 'devotional', 'upagraha',
  ];

  if (tier1Sections.includes(section) && depth <= 4) return 1;

  // Tier 1: City panchang pages (/{locale}/panchang/{city}) — top-level
  if (section === 'panchang' && depth === 3) return 1;

  // Tier 2: Secondary content
  // Rashi pairs, nakshatra details, horoscope per-rashi, planet-in-house, puja pages
  if (section === 'matching' && depth === 3) return 2;        // /en/matching/aries-taurus
  if (section === 'horoscope') return 2;
  if (section === 'puja') return 2;
  if (section === 'panchang' && parts[2] === 'nakshatra' && depth === 4) return 2;  // nakshatra/[id]
  if (section === 'panchang' && parts[2] === 'rashi' && depth === 4) return 2;      // rashi/[slug]
  if (section === 'learn' && parts[2] === 'planet-in-house') return 2;
  if (section === 'learn' && parts[2] === 'nakshatra-pada') return 2;
  if (section === 'learn' && parts[2] === 'transits') return 2;
  if (section === 'muhurta' && depth === 3) return 2;         // muhurta/[slug]

  // Tier 3: Long-tail programmatic SEO (festival×city×year, muhurta×activity×month×year×city)
  // Let Google discover these organically via internal links and sitemap
  return 3;
}

function partitionByTier(urls: string[]): { tier1: string[]; tier2: string[]; tier3: string[] } {
  const tier1: string[] = [];
  const tier2: string[] = [];
  const tier3: string[] = [];

  for (const url of urls) {
    const tier = classifyUrlTier(url);
    if (tier === 1) tier1.push(url);
    else if (tier === 2) tier2.push(url);
    else tier3.push(url);
  }

  return { tier1, tier2, tier3 };
}

// ---------------------------------------------------------------------------
// 5. Bing URL Submission
// ---------------------------------------------------------------------------
async function submitToBing(urls: string[], apiKey: string): Promise<void> {
  console.log('\n━━━ 5. Bing URL Submission ━━━');

  if (!apiKey) {
    console.log('   ⚠ BING_WEBMASTER_API_KEY not set — skipping Bing submission.');
    console.log('   Get your API key: https://www.bing.com/webmasters/apikey');
    return;
  }

  // Bing allows up to 10,000 URLs per batch, 500 per request
  const BATCH_SIZE = 500;
  let submitted = 0;
  let errors = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);

    try {
      const res = await fetch(`${BING_SUBMIT_ENDPOINT}?apikey=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl: SITE,
          urlList: batch,
        }),
      });

      if (res.ok) {
        submitted += batch.length;
        console.log(`   Submitted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} URLs (total: ${submitted})`);
      } else {
        const body = await res.text();
        console.error(`   ✗ Batch failed: ${res.status} — ${body}`);
        errors++;
      }

      // Small delay between batches
      if (i + BATCH_SIZE < urls.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`   ✗ Batch error:`, err);
      errors++;
    }
  }

  console.log(`\n   Bing submission complete: ${submitted.toLocaleString()} URLs submitted, ${errors} batch errors`);
}

// ---------------------------------------------------------------------------
// 6. Report Generator
// ---------------------------------------------------------------------------
function generateReport(
  sitemapUrls: string[],
  indexedUrls: Set<string>,
  analytics: Array<{ url: string; clicks: number; impressions: number; position: number }>,
  inspectionResults: Array<{ url: string; verdict: string; coverage: string; lastCrawl: string }>,
): string {
  const unindexedUrls = sitemapUrls.filter(u => !indexedUrls.has(u));

  // Normalise URL for matching — GSC may return with or without trailing slash
  const normalisedIndexed = new Set<string>();
  for (const u of indexedUrls) {
    normalisedIndexed.add(u.replace(/\/$/, ''));
    normalisedIndexed.add(u);
  }
  const strictUnindexed = sitemapUrls.filter(u => !normalisedIndexed.has(u) && !normalisedIndexed.has(u.replace(/\/$/, '')));

  const indexRate = ((sitemapUrls.length - strictUnindexed.length) / sitemapUrls.length * 100).toFixed(1);
  const totalClicks = analytics.reduce((s, a) => s + a.clicks, 0);
  const totalImpressions = analytics.reduce((s, a) => s + a.impressions, 0);

  // Categorise unindexed by path prefix
  const unindexedByCategory = new Map<string, string[]>();
  for (const url of strictUnindexed) {
    const p = new URL(url).pathname;
    const parts = p.split('/').filter(Boolean);
    const cat = parts.length >= 2 ? parts[1] : parts[0] || 'root';
    if (!unindexedByCategory.has(cat)) unindexedByCategory.set(cat, []);
    unindexedByCategory.get(cat)!.push(url);
  }

  let report = `# SEO Index Audit Report
**Generated:** ${new Date().toISOString()}
**Site:** ${SITE}

## Summary
| Metric | Value |
|--------|-------|
| Sitemap URLs | ${sitemapUrls.length.toLocaleString()} |
| Pages with impressions (GSC) | ${indexedUrls.size.toLocaleString()} |
| Estimated index rate | ${indexRate}% |
| Unindexed URLs | ${strictUnindexed.length.toLocaleString()} |
| Total clicks (90 days) | ${totalClicks.toLocaleString()} |
| Total impressions (90 days) | ${totalImpressions.toLocaleString()} |

## Unindexed URLs by Category
`;

  const sortedCats = [...unindexedByCategory.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [cat, urls] of sortedCats.slice(0, 20)) {
    report += `\n### ${cat} (${urls.length} unindexed)\n`;
    // Show first 10 per category
    for (const url of urls.slice(0, 10)) {
      report += `- ${url.replace(SITE, '')}\n`;
    }
    if (urls.length > 10) report += `- ... and ${urls.length - 10} more\n`;
  }

  // Inspection results
  if (inspectionResults.length > 0) {
    report += `\n## URL Inspection Sample (${inspectionResults.length} URLs)\n`;
    report += '| URL | Verdict | Coverage | Last Crawl |\n|-----|---------|----------|------------|\n';
    for (const r of inspectionResults) {
      const short = r.url.replace(SITE, '');
      report += `| ${short} | ${r.verdict} | ${r.coverage} | ${r.lastCrawl?.slice(0, 10) || 'never'} |\n`;
    }
  }

  // Top performing pages
  if (analytics.length > 0) {
    report += `\n## Top 25 Pages by Clicks\n`;
    report += '| URL | Clicks | Impressions | Avg Position |\n|-----|--------|-------------|-------------|\n';
    const top = [...analytics].sort((a, b) => b.clicks - a.clicks).slice(0, 25);
    for (const p of top) {
      const short = p.url.replace(SITE, '');
      report += `| ${short} | ${p.clicks} | ${p.impressions} | ${p.position} |\n`;
    }
  }

  // Zero-click pages (impressions but no clicks — need title/description work)
  const zeroClick = analytics.filter(a => a.impressions > 50 && a.clicks === 0);
  if (zeroClick.length > 0) {
    report += `\n## Zero-Click Pages (50+ impressions, 0 clicks — needs title/description improvement)\n`;
    const sorted = zeroClick.sort((a, b) => b.impressions - a.impressions).slice(0, 25);
    for (const p of sorted) {
      const short = p.url.replace(SITE, '');
      report += `- ${short} — ${p.impressions} impressions, pos ${p.position}\n`;
    }
  }

  return report;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  loadEnv();

  const args = process.argv.slice(2);
  const sitemapOnly = args.includes('--sitemap-only');
  const gscOnly = args.includes('--gsc-only');
  const bingOnly = args.includes('--bing-only');
  const inspectArg = args.find(a => a.startsWith('--inspect='));
  const inspectLimit = inspectArg ? parseInt(inspectArg.split('=')[1], 10) : 0;
  const runAll = !sitemapOnly && !gscOnly && !bingOnly;

  console.log('╔══════════════════════════════════════════╗');
  console.log('║     SEO Index Audit — dekhopanchang.com  ║');
  console.log('╚══════════════════════════════════════════╝');

  // Step 1: Always fetch sitemap
  const sitemapUrls = await fetchSitemapUrls();
  const { tier1, tier2, tier3 } = partitionByTier(sitemapUrls);

  console.log(`\n   Priority tiers:`);
  console.log(`     Tier 1 (must index):  ${tier1.length.toLocaleString()} URLs — core pages, tools, learn, city panchang`);
  console.log(`     Tier 2 (nice to have): ${tier2.length.toLocaleString()} URLs — rashi pairs, horoscope, puja, padas`);
  console.log(`     Tier 3 (long tail):   ${tier3.length.toLocaleString()} URLs — festival×city×year programmatic SEO`);

  // Focus on Tier 1+2 for active submission
  const priorityUrls = [...tier1, ...tier2];
  console.log(`     Active submission target: ${priorityUrls.length.toLocaleString()} URLs (Tier 1+2)`);

  if (sitemapOnly) {
    console.log('\n✓ Sitemap parse complete. Use --gsc-only or --bing-only for more.');
    return;
  }

  // Step 2-4: GSC (requires auth)
  let auth: any = null;
  let indexedUrls = new Set<string>();
  let analytics: Array<{ url: string; clicks: number; impressions: number; position: number }> = [];
  let inspectionResults: Array<{ url: string; verdict: string; coverage: string; lastCrawl: string }> = [];

  const keyPath = process.env.GSC_SERVICE_ACCOUNT_KEY_PATH?.trim();

  // Service account auth ONLY — no OAuth (OAuth refresh tokens conflict with YouTube OAuth)
  if ((runAll || gscOnly) && keyPath) {
    const { google } = await import('googleapis');

    const keyFile = path.resolve(keyPath);
    if (!fs.existsSync(keyFile)) {
      console.error(`\n✗ Service account key not found: ${keyFile}`);
      process.exit(1);
    }
    auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    console.log('   Auth: service account');

    const result = await getGscIndexedPages(auth);
    indexedUrls = result.indexedUrls;
    analytics = result.analytics;

    await checkGscSitemaps(auth);

    // URL Inspection if requested
    if (inspectLimit > 0) {
      // Priority: unindexed high-value pages first (home, panchang, kundali, learn)
      const priorityPrefixes = ['/en/', '/hi/', '/en/panchang', '/en/kundali', '/en/learn', '/en/matching'];
      const unindexed = sitemapUrls.filter(u => !indexedUrls.has(u));
      const priorityUnindexed = unindexed
        .filter(u => priorityPrefixes.some(p => new URL(u).pathname.startsWith(p)))
        .slice(0, inspectLimit);

      if (priorityUnindexed.length > 0) {
        inspectionResults = await inspectUrls(auth, priorityUnindexed, inspectLimit);
      } else {
        console.log('   No priority unindexed URLs to inspect.');
      }
    }
  } else if ((runAll || gscOnly) && !keyPath) {
    console.log('\n━━━ GSC: Skipped (no credentials) ━━━');
    console.log('   Set up a GCP service account (NOT OAuth — OAuth conflicts with YouTube tokens):');
    console.log('   1. Create a service account in GCP Console');
    console.log('   2. Enable "Google Search Console API"');
    console.log('   3. Download the JSON key file');
    console.log('   4. Add the SA email in GSC → Settings → Users (Full access)');
    console.log('   5. Set GSC_SERVICE_ACCOUNT_KEY_PATH=/path/to/key.json in .env.local');
  }

  // Step 5: Bing submission
  const bingKey = process.env.BING_WEBMASTER_API_KEY?.trim();

  if (runAll || bingOnly) {
    // Submit Tier 1+2 URLs to Bing — these are the pages worth indexing.
    // Tier 3 (long tail programmatic) is left for organic discovery via sitemap.
    // If we have GSC data, prioritise unindexed among Tier 1+2.
    let urlsToSubmit = priorityUrls;
    if (indexedUrls.size > 0) {
      const unindexedPriority = priorityUrls.filter(u => !indexedUrls.has(u));
      const indexedPriority = priorityUrls.filter(u => indexedUrls.has(u));
      if (unindexedPriority.length > 0) {
        console.log(`\n   Prioritising ${unindexedPriority.length} unindexed Tier 1+2 URLs for Bing`);
        urlsToSubmit = [...unindexedPriority, ...indexedPriority];
      }
    }

    // Bing daily quota: 10,000 URLs — Tier 1+2 should fit comfortably
    const bingBatch = urlsToSubmit.slice(0, 10_000);
    await submitToBing(bingBatch, bingKey || '');
  }

  // Step 6: Generate report
  if (indexedUrls.size > 0 || inspectionResults.length > 0) {
    if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

    const report = generateReport(sitemapUrls, indexedUrls, analytics, inspectionResults);
    const reportPath = path.join(REPORT_DIR, `seo-audit-${timestamp()}.md`);
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`\n━━━ Report saved ━━━`);
    console.log(`   ${reportPath}`);

    // Also save unindexed URLs list for later use
    const unindexed = sitemapUrls.filter(u => !indexedUrls.has(u));
    if (unindexed.length > 0) {
      const unindexedPath = path.join(REPORT_DIR, `unindexed-urls-${timestamp()}.txt`);
      fs.writeFileSync(unindexedPath, unindexed.join('\n'), 'utf-8');
      console.log(`   Unindexed URLs list: ${unindexedPath}`);
    }
  }

  console.log('\n✓ Audit complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

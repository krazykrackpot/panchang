#!/usr/bin/env tsx
/**
 * Thin-content audit for /learn/* pages.
 *
 * Reads every messages/learn/*.json file, sums the EN-side word count
 * across all string values (the prose body of the page), and reports:
 *
 *   <400 words   THIN risk    — Google may flag as "Crawled, not indexed"
 *   400-599      LEAN         — acceptable for reference pages, watch trend
 *   600-1499     GOOD         — comfortable; SERP grading shouldn't penalise
 *   1500+        COMPREHENSIVE
 *
 * Behaviour:
 *   - Pages listed in audit-thin-content.baseline.json are grandfathered
 *     and reported but not blocked. New THIN pages NOT in the baseline
 *     block the commit.
 *   - LEAN tier is advisory only (warning, exit 0).
 *
 * Companion to the GSC URL-Inspection truth: /festivals/{slug}/{year}
 * pages PASS (indexed), and the /year/city variants are noindex+
 * canonical-to-year. This audit covers the Learn-section blind spot.
 *
 * Usage:
 *   npx tsx scripts/audit-thin-content.ts                # check
 *   npx tsx scripts/audit-thin-content.ts --update-baseline   # rewrite baseline
 *
 * Exit codes:
 *   0   no new THIN pages
 *   1   one or more NEW THIN pages — block commit
 */

import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'src/messages/learn');
const PAGES_DIR = path.join(process.cwd(), 'src/app/[locale]/learn');
const BASELINE_PATH = path.join(process.cwd(), 'scripts/audit-thin-content.baseline.json');

const THIN_THRESHOLD = 400;
const LEAN_THRESHOLD = 600;

interface PageReport {
  slug: string;
  enWords: number;
  hiWords: number;
  tier: 'THIN' | 'LEAN' | 'GOOD' | 'COMPREHENSIVE';
  hasRoute: boolean;
}

interface Baseline {
  generated: string;
  threshold: number;
  comment: string;
  pages: Record<string, number>;
}

function countWords(text: string): number {
  return text.match(/\S+/g)?.length ?? 0;
}

function classify(words: number): PageReport['tier'] {
  if (words < THIN_THRESHOLD) return 'THIN';
  if (words < LEAN_THRESHOLD) return 'LEAN';
  if (words < 1500) return 'GOOD';
  return 'COMPREHENSIVE';
}

/**
 * Recursively collect EN + HI strings from arbitrarily-nested JSON.
 *
 * A leaf is a LocaleText-shaped object: any object with at least one
 * of `en` / `hi` set to a string. The leaf check uses presence of
 * those keys so we don't recurse INTO a LocaleText whose other locale
 * values happen to be objects (defensive — current files are flat
 * LocaleText, but the audit may run after schema changes).
 *
 * Originally only walked the top-level keys, which would silently
 * undercount any nested JSON and risk false PASS for thin pages.
 * Gemini #661 HIGH.
 */
function extractText(value: unknown, lang: 'en' | 'hi' | null = null): { en: string; hi: string } {
  let en = '';
  let hi = '';
  // A primitive string inherits its language from the closest ancestor
  // LocaleText branch (`obj.en` / `obj.hi`). Without this, arrays of
  // strings (e.g. `"en": ["para 1", "para 2"]`) would recurse in and
  // get silently skipped because the strings themselves carry no
  // en/hi marker. Gemini #662 HIGH.
  if (typeof value === 'string') {
    if (lang === 'en') en += ' ' + value;
    else if (lang === 'hi') hi += ' ' + value;
    return { en, hi };
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const r = extractText(item, lang);
      en += r.en; hi += r.hi;
    }
    return { en, hi };
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const hasLocaleText = 'en' in obj || 'hi' in obj;
    if (hasLocaleText) {
      // Treat as a LocaleText leaf — recurse into each language slot
      // with that slot's language as the inherited tag, so primitive
      // strings AND nested arrays/objects under `en` count as English
      // (and same for Hindi).
      if ('en' in obj) {
        const r = extractText(obj.en, 'en');
        en += r.en; hi += r.hi;
      }
      if ('hi' in obj) {
        const r = extractText(obj.hi, 'hi');
        en += r.en; hi += r.hi;
      }
    } else {
      for (const child of Object.values(obj)) {
        const r = extractText(child, lang);
        en += r.en; hi += r.hi;
      }
    }
  }
  return { en, hi };
}

function audit(): PageReport[] {
  const files = fs.readdirSync(MESSAGES_DIR).filter((f) => f.endsWith('.json'));
  const reports: PageReport[] = [];
  for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    const data = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, file), 'utf8')) as unknown;
    const { en: enText, hi: hiText } = extractText(data);
    const enWords = countWords(enText);
    const hiWords = countWords(hiText);
    const hasRoute = fs.existsSync(path.join(PAGES_DIR, slug, 'page.tsx'));
    reports.push({ slug, enWords, hiWords, tier: classify(enWords), hasRoute });
  }
  return reports.sort((a, b) => a.enWords - b.enWords);
}

function readBaseline(): Baseline {
  if (!fs.existsSync(BASELINE_PATH)) {
    return { generated: '', threshold: THIN_THRESHOLD, comment: '', pages: {} };
  }
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
}

function writeBaseline(reports: PageReport[]): void {
  const pages: Record<string, number> = {};
  for (const r of reports.filter((r) => r.hasRoute && r.tier === 'THIN')) {
    pages[r.slug] = r.enWords;
  }
  const out: Baseline = {
    generated: new Date().toISOString().split('T')[0],
    threshold: THIN_THRESHOLD,
    comment:
      'Pre-existing THIN /learn/* pages grandfathered at the time the audit was introduced. ' +
      'Each entry maps slug → EN word count at that moment. New thin pages NOT in this list ' +
      'block the commit; pages in this list are tolerated until expanded (when expanded above ' +
      '400, drop the entry; when shrunk further, update the value).',
    pages,
  };
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(out, null, 2) + '\n');
  console.log(`Baseline rewritten: ${Object.keys(pages).length} THIN pages grandfathered`);
}

function main(): void {
  const args = process.argv.slice(2);
  const reports = audit();

  if (args.includes('--update-baseline')) {
    writeBaseline(reports);
    process.exit(0);
  }

  const baseline = readBaseline();
  const routed = reports.filter((r) => r.hasRoute);

  console.log('Thin-content audit — /learn/* pages');
  console.log('====================================');
  console.log(`${'slug'.padEnd(36)}  ${'EN'.padStart(5)}  ${'HI'.padStart(5)}  tier            status`);
  console.log('-'.repeat(78));
  for (const r of routed) {
    const tierLabel = r.tier.padEnd(14);
    const isBaselined = r.slug in baseline.pages;
    let status = '';
    if (r.tier === 'THIN') {
      status = isBaselined ? 'baselined' : 'NEW THIN';
    } else if (r.tier === 'LEAN') {
      status = 'advisory';
    }
    console.log(
      `${r.slug.padEnd(36)}  ${String(r.enWords).padStart(5)}  ${String(r.hiWords).padStart(5)}  ${tierLabel}  ${status}`
    );
  }
  console.log('');

  const newThin = routed.filter((r) => r.tier === 'THIN' && !(r.slug in baseline.pages));
  const lean = routed.filter((r) => r.tier === 'LEAN');
  const baselined = routed.filter((r) => r.tier === 'THIN' && r.slug in baseline.pages);

  if (newThin.length > 0) {
    console.error(`BLOCKED: ${newThin.length} NEW THIN page(s) (below ${THIN_THRESHOLD} EN words, not in baseline):`);
    for (const r of newThin) console.error(`  - ${r.slug} (${r.enWords} words)`);
    console.error('');
    console.error('Fix: add prose sections, expand ReferenceBlock, or fold into a sibling page.');
    console.error('Intentional? Update baseline: `npx tsx scripts/audit-thin-content.ts --update-baseline`');
    process.exit(1);
  }

  console.log(`Summary: ${baselined.length} baselined THIN, ${lean.length} LEAN (advisory), ${routed.length - baselined.length - lean.length} GOOD+`);
  if (lean.length > 0) {
    console.warn(`Advisory: ${lean.length} page(s) in LEAN tier. OK for reference pages; expand if SERP CTR underperforms.`);
  }
  process.exit(0);
}

main();

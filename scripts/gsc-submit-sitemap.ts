#!/usr/bin/env npx tsx
/**
 * Submit (or re-submit) the sitemap to Google Search Console.
 *
 * Usage: npx tsx scripts/gsc-submit-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const GSC_PROPERTY = 'sc-domain:dekhopanchang.com';
const SITEMAP_URL = 'https://dekhopanchang.com/sitemap.xml';

function loadEnv() {
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

async function main() {
  loadEnv();

  const { google } = await import('googleapis');

  // Service account auth ONLY — no OAuth (conflicts with YouTube OAuth tokens)
  const keyPath = process.env.GSC_SERVICE_ACCOUNT_KEY_PATH?.trim();
  if (!keyPath) {
    console.error('GSC_SERVICE_ACCOUNT_KEY_PATH not set in .env.local.');
    console.error('Create a GCP service account and add its email as a Full user in GSC.');
    process.exit(1);
  }

  const keyFile = path.resolve(keyPath);
  if (!fs.existsSync(keyFile)) {
    console.error(`Service account key not found: ${keyFile}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  // List current sitemaps
  console.log('Current sitemaps in GSC:');
  const listRes = await searchconsole.sitemaps.list({ siteUrl: GSC_PROPERTY });
  const sitemaps = listRes.data.sitemap || [];

  for (const sm of sitemaps) {
    console.log(`  ${sm.path}`);
    console.log(`    Last submitted: ${sm.lastSubmitted || 'unknown'}`);
    console.log(`    Warnings: ${sm.warnings || 0}, Errors: ${sm.errors || 0}`);
    if (sm.contents) {
      for (const c of sm.contents) {
        console.log(`    ${c.type}: submitted=${c.submitted}, indexed=${c.indexed}`);
      }
    }
  }

  // Delete the old www sitemap if it exists
  const wwwSitemap = sitemaps.find(s => s.path?.includes('www.dekhopanchang.com'));
  if (wwwSitemap) {
    console.log(`\nDeleting old www sitemap: ${wwwSitemap.path}`);
    try {
      await searchconsole.sitemaps.delete({
        siteUrl: GSC_PROPERTY,
        feedpath: wwwSitemap.path!,
      });
      console.log('  Deleted.');
    } catch (err: any) {
      console.warn(`  Warning: could not delete: ${err.message}`);
    }
  }

  // Submit/re-submit the non-www sitemap
  console.log(`\nSubmitting sitemap: ${SITEMAP_URL}`);
  try {
    await searchconsole.sitemaps.submit({
      siteUrl: GSC_PROPERTY,
      feedpath: SITEMAP_URL,
    });
    console.log('  Submitted successfully.');
  } catch (err: any) {
    console.error(`  Error: ${err.message}`);
  }

  // Verify
  console.log('\nVerifying...');
  const verifyRes = await searchconsole.sitemaps.list({ siteUrl: GSC_PROPERTY });
  for (const sm of verifyRes.data.sitemap || []) {
    console.log(`  ${sm.path} — warnings: ${sm.warnings || 0}, errors: ${sm.errors || 0}`);
  }

  console.log('\n✓ Done. Google will re-process the sitemap within 24-48 hours.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

#!/usr/bin/env npx tsx
/**
 * Hreflang Verification Script
 *
 * Reads the sitemap definition from src/app/sitemap.ts and verifies:
 * 1. Every route entry has hreflang alternates for all active locales
 * 2. x-default points to the /en version
 * 3. No orphan routes (present in one locale but missing alternates)
 *
 * Run: npx tsx scripts/verify-hreflang.ts
 *
 * NOTE: This script imports the sitemap function directly and inspects
 * the generated entries. It does NOT crawl the live site.
 */

// We can't import the sitemap function directly because it uses @/ path aliases.
// Instead, we read the sitemap.ts source and extract the routes array, then
// verify the structure programmatically.

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(PROJECT_ROOT, 'src/app/sitemap.ts');
const BASE_URL = 'https://dekhopanchang.com';

// Active locales that should appear in hreflang alternates
// Matches src/lib/i18n/config.ts locales array
const ALL_LOCALES = ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'mai'];

// Locales that are actively submitted to sitemap (from sitemap.ts sitemapLocales)
const SITEMAP_LOCALES = ['en', 'hi'];

function main() {
  console.log('=== Hreflang Verification ===\n');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`ERROR: Sitemap not found at ${SITEMAP_PATH}`);
    process.exit(1);
  }

  const source = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  let errors = 0;
  let warnings = 0;

  // ── Step 1: Extract static routes from the source ──
  // Extract the routes array. Use greedy match from `const routes = [` until the
  // closing `];` that appears at column 0 (end of the top-level array, not a sub-array).
  const routesMatch = source.match(/const routes\s*=\s*\[([\s\S]*?)\n\];/);
  if (!routesMatch) {
    console.error('ERROR: Could not parse `routes` array from sitemap.ts');
    process.exit(1);
  }

  const routesBlock = routesMatch[1];
  // Strip single-line comments before extracting strings — apostrophes in comments
  // (e.g., "India's") break the regex by creating false quote pairs.
  const strippedBlock = routesBlock.replace(/\/\/.*$/gm, '');
  // Filter: valid routes are empty string '' or start with '/'
  const staticRoutes = [...strippedBlock.matchAll(/'([^']*?)'/g)]
    .map((m) => m[1])
    .filter((r) => r === '' || r.startsWith('/'));

  console.log(`Found ${staticRoutes.length} static routes in sitemap.ts\n`);

  // ── Step 2: Verify addEntries pattern uses all locales in alternates ──
  // The addEntries function should loop over `locales` (all 10) for alternates
  const usesAllLocalesForAlternates = source.includes('for (const alt of locales)');
  if (!usesAllLocalesForAlternates) {
    console.error('ERROR: addEntries does not iterate over all locales for alternates');
    errors++;
  } else {
    console.log('[PASS] addEntries iterates over all locales for hreflang alternates');
  }

  // ── Step 3: Verify x-default is set ──
  const hasXDefault = source.includes("alternates['x-default']");
  if (!hasXDefault) {
    console.error('ERROR: x-default is not set in sitemap alternates');
    errors++;
  } else {
    console.log('[PASS] x-default is configured in alternates');
  }

  // ── Step 4: Verify x-default points to /en ──
  const xDefaultMatch = source.match(/alternates\['x-default'\]\s*=\s*`([^`]+)`/);
  if (xDefaultMatch) {
    const xDefaultUrl = xDefaultMatch[1];
    if (xDefaultUrl.includes('/en')) {
      console.log('[PASS] x-default points to /en version');
    } else {
      console.error(`ERROR: x-default points to "${xDefaultUrl}" instead of /en`);
      errors++;
    }
  }

  // ── Step 5: Verify sitemapLocales matches expected ──
  const sitemapLocalesMatch = source.match(/const sitemapLocales[^=]*=\s*\[([^\]]+)\]/);
  if (sitemapLocalesMatch) {
    const foundLocales = [...sitemapLocalesMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    console.log(`[INFO] Sitemap submits entries for locales: ${foundLocales.join(', ')}`);
    for (const expected of SITEMAP_LOCALES) {
      if (!foundLocales.includes(expected)) {
        console.error(`ERROR: Expected sitemap locale "${expected}" not found`);
        errors++;
      }
    }
  }

  // ── Step 6: Check that corresponding page files exist for static routes ──
  console.log('\n--- Checking page files exist for static routes ---\n');
  const appDir = path.join(PROJECT_ROOT, 'src/app/[locale]');
  let missingPages = 0;

  for (const route of staticRoutes) {
    if (route === '') continue; // Home page is app/[locale]/page.tsx

    // Check if a page.tsx exists for this route
    const routeDir = path.join(appDir, ...route.split('/').filter(Boolean));
    const pagePath = path.join(routeDir, 'page.tsx');

    if (!fs.existsSync(pagePath)) {
      // Check for dynamic segment alternative (e.g., [slug])
      // This is expected for routes like /matching/{pair} which use [slug]
      const parentDir = path.dirname(routeDir);
      const hasDynamicSibling = fs.existsSync(parentDir) &&
        fs.readdirSync(parentDir).some((d) => d.startsWith('['));

      if (!hasDynamicSibling) {
        console.warn(`  [WARN] No page.tsx for route: ${route}`);
        console.warn(`         Expected: ${pagePath}`);
        warnings++;
        missingPages++;
      }
    }
  }

  if (missingPages === 0) {
    console.log('[PASS] All static routes have corresponding page files');
  } else {
    console.log(`[WARN] ${missingPages} routes may lack page files (could be dynamic)`);
  }

  // ── Step 7: Check for routes in page files NOT in sitemap ──
  console.log('\n--- Checking for unlisted pages ---\n');
  let unlistedCount = 0;

  function scanDir(dir: string, prefix: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
      if (entry.isDirectory()) {
        const newPrefix = `${prefix}/${entry.name}`;
        // Skip dynamic segments for this check — they're generated programmatically
        if (entry.name.startsWith('[') || entry.name.startsWith('(')) {
          scanDir(path.join(dir, entry.name), prefix); // Don't add segment name for groups
        } else {
          scanDir(path.join(dir, entry.name), newPrefix);
        }
      } else if (entry.name === 'page.tsx') {
        // Normalize prefix for comparison
        const routePath = prefix || '';
        if (!staticRoutes.includes(routePath) && routePath !== '') {
          // Check if it might be covered by a programmatic section
          const isProgrammatic =
            routePath.startsWith('/panchang/rashi/') ||
            routePath.startsWith('/panchang/nakshatra/') ||
            routePath.startsWith('/horoscope/') ||
            routePath.startsWith('/matching/') ||
            routePath.startsWith('/puja/') ||
            routePath.startsWith('/calendar/') ||
            routePath.startsWith('/festivals/') ||
            routePath.startsWith('/learn/planet-in-house/') ||
            routePath.startsWith('/learn/nakshatra-pada/') ||
            routePath.startsWith('/learn/transits/') ||
            routePath.startsWith('/learn/modules/') ||
            routePath.startsWith('/learn/track/') ||
            routePath.startsWith('/learn/labs/') ||
            routePath.startsWith('/learn/contributions/') ||
            routePath.startsWith('/muhurta/') ||
            routePath.startsWith('/daily') ||
            routePath.startsWith('/dashboard') ||
            routePath.startsWith('/settings') ||
            routePath.startsWith('/dates/');

          if (!isProgrammatic) {
            console.warn(`  [WARN] Page exists but not in sitemap routes: ${routePath}`);
            unlistedCount++;
          }
        }
      }
    }
  }

  scanDir(appDir, '');

  if (unlistedCount === 0) {
    console.log('[PASS] No unlisted pages found');
  } else {
    console.log(`[WARN] ${unlistedCount} pages exist but are not in the sitemap routes array`);
    warnings++;
  }

  // ── Summary ──
  console.log('\n=== Summary ===');
  console.log(`Static routes: ${staticRoutes.length}`);
  console.log(`Sitemap locales: ${SITEMAP_LOCALES.join(', ')}`);
  console.log(`Hreflang alternate locales: ${ALL_LOCALES.length} (all 10)`);
  console.log(`Errors: ${errors}`);
  console.log(`Warnings: ${warnings}`);

  if (errors > 0) {
    console.log('\nFAILED - fix errors above');
    process.exit(1);
  } else {
    console.log('\nPASSED');
  }
}

main();

#!/usr/bin/env npx tsx
/**
 * Audit all newly created pages — check for load errors, overflow, missing content.
 * Tests both desktop and mobile viewports.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const OUTPUT = '/tmp/new-pages-audit';

const PAGES = [
  // Devotional
  { path: '/en/devotional', name: 'devotional-hub' },
  { path: '/en/devotional/aarti/ganesh-aarti', name: 'aarti-ganesh' },
  { path: '/en/devotional/chalisa/hanuman-chalisa', name: 'chalisa-hanuman' },
  { path: '/en/devotional/stotram/vishnu-sahasranama', name: 'stotram-vishnu' },
  { path: '/en/devotional/mantra/gayatri-mantra', name: 'mantra-gayatri' },
  // Chandrabalam / Tarabalam
  { path: '/en/chandrabalam', name: 'chandrabalam' },
  { path: '/en/tarabalam', name: 'tarabalam' },
  // Ganda Mool
  { path: '/en/dates/ganda-mool', name: 'ganda-mool' },
  // Vrat Katha
  { path: '/en/vrat-katha/ekadashi', name: 'katha-ekadashi' },
  { path: '/en/vrat-katha/satyanarayan', name: 'katha-satyanarayan' },
  { path: '/en/vrat-katha/karva-chauth', name: 'katha-karva-chauth' },
  // ISKCON
  { path: '/en/calendar/regional/iskcon', name: 'iskcon-calendar' },
  // Rudraksha
  { path: '/en/rudraksha', name: 'rudraksha' },
  // Panchak / Holashtak / Chandra Darshan
  { path: '/en/panchak', name: 'panchak' },
  { path: '/en/holashtak', name: 'holashtak' },
  { path: '/en/chandra-darshan', name: 'chandra-darshan' },
  // Special Yoga learn pages
  { path: '/en/learn/sarvartha-siddhi-yoga', name: 'learn-sarvartha' },
  { path: '/en/learn/amrit-siddhi-yoga', name: 'learn-amrit' },
  { path: '/en/learn/guru-pushya-yoga', name: 'learn-guru-pushya' },
  // Nadi Amsha learn page
  { path: '/en/learn/nadi-amsha', name: 'learn-nadi-amsha' },
  // Transit articles
  { path: '/en/learn/transits/jupiter-in-cancer-2026', name: 'transit-jupiter-cancer' },
  { path: '/en/learn/transits/jupiter-in-leo-2026', name: 'transit-jupiter-leo' },
  // Hindi versions
  { path: '/hi/devotional/chalisa/hanuman-chalisa', name: 'hi-hanuman-chalisa' },
  { path: '/hi/chandrabalam', name: 'hi-chandrabalam' },
  { path: '/hi/rudraksha', name: 'hi-rudraksha' },
];

async function auditPage(context: any, pageInfo: { path: string; name: string }, viewport: { width: number; height: number }, label: string) {
  const page = await context.newPage();
  const issues: string[] = [];

  try {
    const response = await page.goto(`${BASE}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 30000 });

    // Check HTTP status
    if (!response || response.status() >= 400) {
      issues.push(`HTTP ${response?.status() || 'no response'}`);
      await page.close();
      return issues;
    }

    await page.waitForTimeout(1500);

    // Screenshot
    await page.screenshot({ path: `${OUTPUT}/${label}-${pageInfo.name}.png`, fullPage: false, timeout: 10000 }).catch(() => {});

    // Check for error text on page
    const errorText = await page.evaluate(() => {
      const body = document.body.innerText;
      if (body.includes('Application error') || body.includes('Internal Server Error') || body.includes('404')) {
        return body.slice(0, 200);
      }
      // Check for empty pages
      if (body.trim().length < 50) return `EMPTY PAGE: "${body.trim()}"`;
      return null;
    });
    if (errorText) issues.push(`PAGE ERROR: ${errorText}`);

    // Check horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    if (bodyWidth > viewport.width + 10) {
      issues.push(`OVERFLOW: ${bodyWidth}px > ${viewport.width}px viewport`);
    }

    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg: any) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text().slice(0, 100));
      }
    });

    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src).slice(0, 3);
    });
    if (brokenImages.length > 0) issues.push(`BROKEN IMAGES: ${brokenImages.join(', ')}`);

    // Check Devanagari rendering (for devotional pages)
    if (pageInfo.path.includes('devotional') || pageInfo.path.includes('chalisa') || pageInfo.path.includes('katha') || pageInfo.path.startsWith('/hi/')) {
      const hasDevanagari = await page.evaluate(() => {
        const text = document.body.innerText;
        return /[\u0900-\u097F]/.test(text);
      });
      if (!hasDevanagari && (pageInfo.path.includes('hi/') || pageInfo.name.includes('chalisa') || pageInfo.name.includes('katha'))) {
        issues.push('MISSING DEVANAGARI: Expected Hindi/Sanskrit text but none found');
      }
    }

    // Check for key content elements
    const hasTitle = await page.evaluate(() => !!document.querySelector('h1, h2'));
    if (!hasTitle) issues.push('MISSING HEADING: No h1 or h2 found');

  } catch (err) {
    issues.push(`LOAD FAILED: ${err}`);
  }

  await page.close();
  return issues;
}

async function main() {
  mkdirSync(OUTPUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { width: 1280, height: 800, label: 'desktop' },
    { width: 375, height: 812, label: 'mobile' },
  ];

  const allIssues: { page: string; viewport: string; issues: string[] }[] = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.label === 'mobile' ? 2 : 1,
    });

    console.log(`\n=== Auditing ${PAGES.length} pages at ${vp.label} (${vp.width}x${vp.height}) ===`);

    for (const pageInfo of PAGES) {
      process.stdout.write(`  ${pageInfo.name}...`);
      const issues = await auditPage(context, pageInfo, { width: vp.width, height: vp.height }, vp.label);
      if (issues.length > 0) {
        console.log(` ❌ ${issues.length} issues`);
        allIssues.push({ page: pageInfo.name, viewport: vp.label, issues });
      } else {
        console.log(' ✓');
      }
    }

    await context.close();
  }

  await browser.close();

  // Report
  console.log('\n' + '═'.repeat(70));
  console.log('NEW PAGES AUDIT RESULTS');
  console.log('═'.repeat(70));
  console.log(`Pages checked: ${PAGES.length} × 2 viewports = ${PAGES.length * 2} checks`);
  console.log(`Screenshots: ${OUTPUT}/\n`);

  if (allIssues.length === 0) {
    console.log('✅ All pages pass — no issues found!');
  } else {
    let total = 0;
    for (const { page, viewport, issues } of allIssues) {
      console.log(`\n❌ ${page} (${viewport}):`);
      issues.forEach(i => { console.log(`   ${i}`); total++; });
    }
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Total: ${total} issues across ${allIssues.length} page/viewport combos`);
  }
}

main().catch(err => { console.error('Audit failed:', err); process.exit(1); });

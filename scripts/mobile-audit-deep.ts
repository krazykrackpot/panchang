#!/usr/bin/env npx tsx
/**
 * Deep mobile UI audit — checks kundali tabs, dashboard, and content-heavy pages
 * for text overflow, clipping, and garbled content on iPhone 12 (375x812).
 *
 * Usage: npx tsx scripts/mobile-audit-deep.ts
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const OUTPUT = '/tmp/mobile-audit-deep';
const VIEWPORT = { width: 375, height: 812 };

// Pages with dense text content that's likely to garble on mobile
const PAGES = [
  { path: '/en/kundali', name: 'kundali-form' },
  { path: '/en/dashboard', name: 'dashboard' },
  { path: '/en/dashboard/family', name: 'family' },
  { path: '/en/matching', name: 'matching' },
  { path: '/en/horoscope', name: 'horoscope' },
  { path: '/en/panchang', name: 'panchang' },
  { path: '/en/sade-sati', name: 'sade-sati' },
  { path: '/en/kaal-nirnaya', name: 'kaal-nirnaya' },
  { path: '/en/rahu-kaal', name: 'rahu-kaal' },
  { path: '/en/choghadiya', name: 'choghadiya' },
  { path: '/en/hora', name: 'hora' },
  { path: '/en/dinacharya', name: 'dinacharya' },
  { path: '/en/vedic-time', name: 'vedic-time' },
  { path: '/en/transits', name: 'transits' },
  { path: '/en/eclipses', name: 'eclipses' },
  { path: '/en/retrograde', name: 'retrograde' },
  { path: '/en/calendar', name: 'calendar' },
  { path: '/en/muhurta-ai', name: 'muhurta-ai' },
  { path: '/en/prashna', name: 'prashna' },
  { path: '/en/varshaphal', name: 'varshaphal' },
  { path: '/en/kp-system', name: 'kp-system' },
  { path: '/en/sign-calculator', name: 'sign-calculator' },
  { path: '/en/baby-names', name: 'baby-names' },
  { path: '/en/annual-forecast', name: 'annual-forecast' },
  { path: '/en/medical-astrology', name: 'medical-astrology' },
];

async function main() {
  mkdirSync(OUTPUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  const allIssues: { page: string; issues: string[] }[] = [];

  for (const pageInfo of PAGES) {
    console.log(`Checking ${pageInfo.name}...`);
    const page = await context.newPage();
    const pageIssues: string[] = [];

    try {
      await page.goto(`${BASE}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      // Screenshot
      await page.screenshot({ path: `${OUTPUT}/${pageInfo.name}.png`, fullPage: true });

      // 1. Horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      if (bodyWidth > VIEWPORT.width + 5) {
        pageIssues.push(`OVERFLOW: Body width ${bodyWidth}px > viewport ${VIEWPORT.width}px`);
      }

      // 2. Text truncation/clipping — elements with overflow:hidden that clip text
      const clippedText = await page.evaluate(() => {
        const problems: string[] = [];
        document.querySelectorAll('*').forEach(el => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          // Check for text that's clipped by overflow:hidden on a small container
          if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
            if (el.scrollWidth > rect.width + 5 && el.textContent && el.textContent.trim().length > 10) {
              const text = el.textContent.trim().slice(0, 60);
              const tag = el.tagName.toLowerCase();
              const cls = (el.className?.toString() || '').slice(0, 50);
              problems.push(`CLIPPED: <${tag} class="${cls}"> scrollW=${Math.round(el.scrollWidth)} > visW=${Math.round(rect.width)}: "${text}"`);
            }
          }
        });
        return problems.slice(0, 8);
      });
      pageIssues.push(...clippedText);

      // 3. Text wrapping issues — very long words or values that don't wrap
      const noWrapText = await page.evaluate((vw) => {
        const problems: string[] = [];
        document.querySelectorAll('span, td, th, div, p, h1, h2, h3, h4, li').forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          // Element extends past viewport right edge AND has nowrap
          if (rect.right > vw + 10 && (style.whiteSpace === 'nowrap' || style.whiteSpace === 'pre')) {
            const text = el.textContent?.trim().slice(0, 60) || '';
            if (text.length > 3) {
              const tag = el.tagName.toLowerCase();
              const cls = (el.className?.toString() || '').slice(0, 50);
              problems.push(`NOWRAP: <${tag} class="${cls}"> right=${Math.round(rect.right)}px: "${text}"`);
            }
          }
        });
        return problems.slice(0, 8);
      }, VIEWPORT.width);
      pageIssues.push(...noWrapText);

      // 4. Tables that are too wide
      const wideTables = await page.evaluate((vw) => {
        const problems: string[] = [];
        document.querySelectorAll('table, [role="table"], .grid').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > vw + 10) {
            const cls = (el.className?.toString() || '').slice(0, 50);
            problems.push(`WIDE TABLE/GRID: width=${Math.round(rect.width)}px class="${cls}"`);
          }
        });
        return problems.slice(0, 5);
      }, VIEWPORT.width);
      pageIssues.push(...wideTables);

      // 5. Overlapping text — elements with negative z-index or position that overlap readable text
      const overlaps = await page.evaluate(() => {
        const problems: string[] = [];
        const textEls = Array.from(document.querySelectorAll('p, span, h1, h2, h3, h4, h5, td, th, li, a, label, button'));
        for (let i = 0; i < textEls.length && i < 200; i++) {
          const el = textEls[i];
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const text = el.textContent?.trim() || '';
          if (text.length < 3) continue;

          // Check if this element is partially off-screen left
          if (rect.left < -5 && rect.right > 0) {
            const cls = (el.className?.toString() || '').slice(0, 40);
            problems.push(`OFF-SCREEN LEFT: "${text.slice(0, 40)}" left=${Math.round(rect.left)}px`);
          }
        }
        return problems.slice(0, 5);
      });
      pageIssues.push(...overlaps);

      // 6. Font size issues — text smaller than 11px
      const tinyText = await page.evaluate(() => {
        const problems: string[] = [];
        document.querySelectorAll('p, span, div, td, th, li, a, label, button, h1, h2, h3, h4').forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          const text = el.textContent?.trim() || '';
          // Only flag if it has direct text content (not just child text)
          if (fontSize < 10 && text.length > 5 && el.childElementCount === 0) {
            problems.push(`TINY(${fontSize}px): "${text.slice(0, 50)}"`);
          }
        });
        return problems.slice(0, 5);
      });
      pageIssues.push(...tinyText);

    } catch (err) {
      pageIssues.push(`LOAD FAILED: ${err}`);
    }

    if (pageIssues.length > 0) {
      allIssues.push({ page: pageInfo.name, issues: pageIssues });
    }

    await page.close();
  }

  await browser.close();

  // Report
  console.log('\n' + '═'.repeat(70));
  console.log('DEEP MOBILE UI AUDIT — Dasha/Text/Overflow Issues');
  console.log('═'.repeat(70));
  console.log(`Pages checked: ${PAGES.length}`);
  console.log(`Screenshots: ${OUTPUT}/\n`);

  if (allIssues.length === 0) {
    console.log('✅ No issues found!');
  } else {
    let totalIssues = 0;
    for (const { page, issues } of allIssues) {
      console.log(`\n📱 ${page} (${issues.length} issues):`);
      issues.forEach(issue => {
        console.log(`  ${issue}`);
        totalIssues++;
      });
    }
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Total: ${totalIssues} issues across ${allIssues.length} pages`);
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});

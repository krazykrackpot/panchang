#!/usr/bin/env npx tsx
/**
 * Mobile UI audit — captures screenshots of key pages at iPhone 12 viewport (375x812)
 * and checks for common mobile issues.
 *
 * Usage: npx tsx scripts/mobile-audit.ts
 * Output: /tmp/mobile-audit/*.png
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const OUTPUT = '/tmp/mobile-audit';
const VIEWPORT = { width: 375, height: 812 };

const PAGES = [
  { path: '/en', name: 'home' },
  { path: '/en/panchang', name: 'panchang' },
  { path: '/en/kundali', name: 'kundali' },
  { path: '/en/matching', name: 'matching' },
  { path: '/en/transits', name: 'transits' },
  { path: '/en/calendar', name: 'calendar' },
  { path: '/en/tools', name: 'tools' },
  { path: '/en/learn', name: 'learn' },
  { path: '/en/learn/transits/jupiter-in-cancer-2026', name: 'transit-article' },
  { path: '/en/sade-sati', name: 'sade-sati' },
  { path: '/en/rahu-kaal', name: 'rahu-kaal' },
  { path: '/en/choghadiya', name: 'choghadiya' },
];

async function main() {
  mkdirSync(OUTPUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  const issues: string[] = [];

  for (const page of PAGES) {
    console.log(`Checking ${page.name} (${page.path})...`);
    const p = await context.newPage();

    try {
      await p.goto(`${BASE}${page.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await p.waitForTimeout(2000); // let animations settle

      // Full page screenshot
      await p.screenshot({ path: `${OUTPUT}/${page.name}.png`, fullPage: true });

      // Check for horizontal overflow (garbled text indicator)
      const bodyWidth = await p.evaluate(() => document.body.scrollWidth);
      if (bodyWidth > VIEWPORT.width + 5) {
        issues.push(`${page.name}: Horizontal overflow! Body width ${bodyWidth}px > viewport ${VIEWPORT.width}px — likely garbled/clipped text`);
      }

      // Check for text truncation issues — elements wider than viewport
      const overflowElements = await p.evaluate((vw) => {
        const problems: string[] = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > vw + 10 && el.textContent && el.textContent.trim().length > 5) {
            const tag = el.tagName.toLowerCase();
            const cls = el.className?.toString().slice(0, 60) || '';
            const text = el.textContent.trim().slice(0, 50);
            problems.push(`<${tag} class="${cls}"> width=${Math.round(rect.width)}px: "${text}"`);
          }
        });
        return problems.slice(0, 10); // limit to first 10
      }, VIEWPORT.width);

      if (overflowElements.length > 0) {
        issues.push(`${page.name}: ${overflowElements.length} overflowing element(s):`);
        overflowElements.forEach(el => issues.push(`  → ${el}`));
      }

      // Check for tiny text (< 12px)
      const tinyText = await p.evaluate(() => {
        const problems: string[] = [];
        document.querySelectorAll('p, span, div, td, li, a, label').forEach(el => {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize < 11 && el.textContent && el.textContent.trim().length > 3) {
            const text = el.textContent.trim().slice(0, 40);
            problems.push(`${fontSize}px: "${text}"`);
          }
        });
        return problems.slice(0, 5);
      });

      if (tinyText.length > 0) {
        issues.push(`${page.name}: ${tinyText.length} element(s) with tiny text (<11px):`);
        tinyText.forEach(t => issues.push(`  → ${t}`));
      }

      // Check for elements extending beyond right edge
      const offscreenRight = await p.evaluate((vw) => {
        const problems: string[] = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 5 && rect.width > 10 && el.textContent && el.textContent.trim().length > 0) {
            const tag = el.tagName.toLowerCase();
            const cls = (el.className?.toString() || '').slice(0, 40);
            problems.push(`<${tag} class="${cls}"> right=${Math.round(rect.right)}px`);
          }
        });
        // Deduplicate by class
        const unique = [...new Set(problems)];
        return unique.slice(0, 8);
      }, VIEWPORT.width);

      if (offscreenRight.length > 0) {
        issues.push(`${page.name}: ${offscreenRight.length} element(s) extending past right edge:`);
        offscreenRight.forEach(el => issues.push(`  → ${el}`));
      }

      // Check console errors
      const consoleErrors: string[] = [];
      p.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 100));
      });

    } catch (err) {
      issues.push(`${page.name}: FAILED TO LOAD — ${err}`);
    }

    await p.close();
  }

  await browser.close();

  // Report
  console.log('\n' + '═'.repeat(60));
  console.log('MOBILE UI AUDIT RESULTS');
  console.log('═'.repeat(60));
  console.log(`Pages checked: ${PAGES.length}`);
  console.log(`Screenshots saved to: ${OUTPUT}/`);

  if (issues.length === 0) {
    console.log('\n✅ No mobile UI issues detected!');
  } else {
    console.log(`\n⚠️ ${issues.length} issue(s) found:\n`);
    issues.forEach(issue => console.log(issue));
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});

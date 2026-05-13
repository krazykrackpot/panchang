#!/usr/bin/env npx tsx
/**
 * Mobile UI audit — generates a kundali and screenshots every tab at iPhone 12 viewport.
 * Uses the API directly to get kundali data, then navigates to the kundali page.
 *
 * Usage: npx tsx scripts/mobile-audit-kundali.ts
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const OUTPUT = '/tmp/mobile-audit-kundali';
const VIEWPORT = { width: 375, height: 812 };

// Sample birth data — Ujjain, morning birth
const BIRTH = {
  name: 'Test',
  date: '1990-04-15',
  time: '08:30',
  place: 'Ujjain',
  lat: 23.1765,
  lng: 75.7885,
  timezone: 'Asia/Kolkata',
};

async function main() {
  mkdirSync(OUTPUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  const page = await context.newPage();

  console.log('Loading kundali page...');
  await page.goto(`${BASE}/en/kundali`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Fill in the birth form
  console.log('Filling birth form...');
  await page.fill('input[name="name"], input[placeholder*="name" i], input[aria-label*="name" i]', BIRTH.name).catch(() => {});
  await page.fill('input[type="date"]', BIRTH.date).catch(() => {});
  await page.fill('input[type="time"]', BIRTH.time).catch(() => {});

  // Try to fill location via the search
  const locationInput = page.locator('input[placeholder*="city" i], input[placeholder*="place" i], input[placeholder*="location" i], input[aria-label*="place" i]').first();
  if (await locationInput.isVisible().catch(() => false)) {
    await locationInput.fill('Ujjain');
    await page.waitForTimeout(1500);
    // Click first result if dropdown appears
    await page.locator('.absolute >> text=Ujjain').first().click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // Screenshot the form
  await page.screenshot({ path: `${OUTPUT}/00-form.png`, fullPage: true });

  // Try to submit
  console.log('Submitting form...');
  const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("generate")').first();
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(5000); // wait for kundali computation
  }

  // Screenshot after generation
  await page.screenshot({ path: `${OUTPUT}/01-chart-generated.png`, fullPage: true });

  // Find and click each tab to test them
  const TABS = [
    'tippanni', 'chart', 'planets', 'dasha', 'ashtakavarga', 'varga',
    'jaimini', 'graha', 'yogas', 'shadbala', 'bhavabala', 'avasthas',
    'argala', 'sphutas', 'ayanamsha', 'transits',
  ];

  const issues: string[] = [];

  for (const tabName of TABS) {
    console.log(`Checking tab: ${tabName}...`);

    // Try clicking the tab button
    const tabBtn = page.locator(`button:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`).first();
    const tabBtnAlt = page.locator(`button`).filter({ hasText: new RegExp(tabName, 'i') }).first();

    const clicked = await tabBtn.click().catch(() => false) || await tabBtnAlt.click().catch(() => false);
    if (clicked === false) {
      // Try scrolling the tab bar and clicking
      await page.evaluate((name) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent?.toLowerCase().includes(name.toLowerCase()));
        if (btn) {
          btn.scrollIntoView({ inline: 'center' });
          btn.click();
        }
      }, tabName);
    }

    await page.waitForTimeout(1500);

    // Screenshot — viewport only (full-page can timeout on tall tabs like varga)
    await page.screenshot({ path: `${OUTPUT}/tab-${tabName}.png`, fullPage: false, timeout: 10000 }).catch(() => {
      console.log(`  (screenshot timeout for ${tabName}, skipping)`);
    });

    // Check for issues on this tab
    const tabIssues = await page.evaluate((vw) => {
      const problems: string[] = [];

      // Horizontal overflow
      if (document.body.scrollWidth > vw + 5) {
        problems.push(`OVERFLOW: body ${document.body.scrollWidth}px > ${vw}px`);
      }

      // Clipped text (not sr-only)
      document.querySelectorAll('*').forEach(el => {
        if (el.className?.toString().includes('sr-only')) return;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if ((style.overflow === 'hidden' || style.overflowX === 'hidden') &&
            el.scrollWidth > rect.width + 10 &&
            el.textContent && el.textContent.trim().length > 10 &&
            rect.width > 20) {
          const text = el.textContent.trim().slice(0, 80);
          const cls = (el.className?.toString() || '').slice(0, 50);
          problems.push(`CLIPPED: "${text}" (${Math.round(el.scrollWidth)} > ${Math.round(rect.width)}px) class="${cls}"`);
        }
      });

      // Wide tables/grids
      document.querySelectorAll('table, [role="table"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > vw + 10) {
          problems.push(`WIDE TABLE: ${Math.round(rect.width)}px`);
        }
      });

      // Nowrap text extending past viewport
      document.querySelectorAll('span, td, th, div, p').forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (rect.right > vw + 10 && style.whiteSpace === 'nowrap' && el.textContent && el.textContent.trim().length > 5) {
          const text = el.textContent.trim().slice(0, 60);
          problems.push(`NOWRAP: "${text}" right=${Math.round(rect.right)}px`);
        }
      });

      // Tiny text with actual content
      document.querySelectorAll('span, td, th, p, div, li').forEach(el => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        const text = el.textContent?.trim() || '';
        if (fontSize < 9 && text.length > 5 && el.childElementCount === 0) {
          problems.push(`TINY(${fontSize}px): "${text.slice(0, 50)}"`);
        }
      });

      return [...new Set(problems)].slice(0, 10);
    }, VIEWPORT.width);

    if (tabIssues.length > 0) {
      issues.push(`\n📱 Tab: ${tabName} (${tabIssues.length} issues):`);
      tabIssues.forEach(issue => issues.push(`  ${issue}`));
    }
  }

  await browser.close();

  // Report
  console.log('\n' + '═'.repeat(70));
  console.log('KUNDALI TABS MOBILE AUDIT');
  console.log('═'.repeat(70));
  console.log(`Tabs checked: ${TABS.length}`);
  console.log(`Screenshots: ${OUTPUT}/\n`);

  if (issues.length === 0) {
    console.log('✅ No issues found!');
  } else {
    issues.forEach(i => console.log(i));
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});

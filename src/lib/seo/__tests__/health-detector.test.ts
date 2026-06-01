import { describe, it, expect } from 'vitest';
import {
  aggregateByLocale,
  detectDrops,
  localeFromUrl,
} from '../health-detector';
import { locales, type Locale } from '@/lib/i18n/config';

function zeroByLocale(): Record<Locale, number> {
  return Object.fromEntries(locales.map((l) => [l, 0])) as Record<Locale, number>;
}

describe('localeFromUrl', () => {
  it('extracts active locales from GSC page URLs', () => {
    expect(localeFromUrl('https://dekhopanchang.com/mai/choghadiya/2026-06-01')).toBe('mai');
    expect(localeFromUrl('https://dekhopanchang.com/mr/panchang/date/2026-06-01')).toBe('mr');
    expect(localeFromUrl('https://dekhopanchang.com/en/calendar/regional/bengali')).toBe('en');
  });

  it('returns null for locale-less URLs', () => {
    expect(localeFromUrl('https://dekhopanchang.com/sitemap.xml')).toBeNull();
    expect(localeFromUrl('https://dekhopanchang.com/robots.txt')).toBeNull();
    expect(localeFromUrl('https://dekhopanchang.com/')).toBeNull();
  });

  it('returns null for non-active locale prefixes (sa retired, garbage)', () => {
    expect(localeFromUrl('https://dekhopanchang.com/sa/panchang')).toBeNull();
    expect(localeFromUrl('https://dekhopanchang.com/zz/page')).toBeNull();
  });
});

describe('aggregateByLocale', () => {
  it('sums clicks per locale across URLs', () => {
    const agg = aggregateByLocale([
      { url: 'https://dekhopanchang.com/mai/choghadiya/2026-05-31', clicks: 200 },
      { url: 'https://dekhopanchang.com/mai/choghadiya/2026-05-30', clicks: 150 },
      { url: 'https://dekhopanchang.com/hi/panchang', clicks: 100 },
    ]);
    expect(agg.mai).toBe(350);
    expect(agg.hi).toBe(100);
    expect(agg.mr).toBe(0);
  });

  it('drops rows with no locale prefix', () => {
    const agg = aggregateByLocale([
      { url: 'https://dekhopanchang.com/sitemap.xml', clicks: 99 },
      { url: 'https://dekhopanchang.com/en/foo', clicks: 5 },
    ]);
    expect(agg.en).toBe(5);
  });
});

describe('detectDrops', () => {
  const config = { dropThreshold: 0.4, minBaselineClicks: 50 };

  it('flags a locale with >threshold drop above baseline floor', () => {
    const yesterday = { ...zeroByLocale(), mai: 30 };
    const baseline = { ...zeroByLocale(), mai: 200 };
    const drops = detectDrops(yesterday, baseline, config);
    expect(drops).toHaveLength(1);
    expect(drops[0].locale).toBe('mai');
    expect(drops[0].dropFraction).toBeCloseTo(0.85, 2);
  });

  it('skips low-volume locales below the noise floor', () => {
    // baseline=20 is below minBaselineClicks=50 → never alerts even if
    // yesterday dropped to 0.
    const yesterday = { ...zeroByLocale(), gu: 0 };
    const baseline = { ...zeroByLocale(), gu: 20 };
    expect(detectDrops(yesterday, baseline, config)).toHaveLength(0);
  });

  it('does not alert when drop is below threshold', () => {
    // 30% drop, threshold 40% → no alert
    const yesterday = { ...zeroByLocale(), hi: 70 };
    const baseline = { ...zeroByLocale(), hi: 100 };
    expect(detectDrops(yesterday, baseline, config)).toHaveLength(0);
  });

  it('sorts results largest-drop-first', () => {
    const yesterday = { ...zeroByLocale(), mai: 50, mr: 20, hi: 60 };
    const baseline = { ...zeroByLocale(), mai: 200, mr: 100, hi: 200 };
    const drops = detectDrops(yesterday, baseline, config);
    expect(drops.map((d) => d.locale)).toEqual(['mr', 'mai', 'hi']);
  });

  it('reproduces the 2026-05-31 incident shape: Marathi + Maithili both flagged', () => {
    // Approximation of the actual crash signature.
    const yesterday = { ...zeroByLocale(), mai: 40, mr: 15, hi: 220, en: 60 };
    const baseline =  { ...zeroByLocale(), mai: 408, mr: 60, hi: 240, en: 65 };
    const drops = detectDrops(yesterday, baseline, config);
    // mai (-90%) and mr (-75%) clear the bar; hi (-8%) does not.
    const locs = drops.map((d) => d.locale);
    expect(locs).toContain('mai');
    expect(locs).toContain('mr');
    expect(locs).not.toContain('hi');
  });
});

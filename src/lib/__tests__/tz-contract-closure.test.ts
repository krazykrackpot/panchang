/**
 * Sprint 20 — TZ-safe contract closure for the 6 P0 consumers that
 * survived the Sprint 4 getSunTimes migration.
 *
 * Structural tests assert the deprecated Date-field accessors are gone
 * from each consumer site and the *Minutes / Date.UTC / Date.now()
 * alternatives are in place.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('TZ-1 — shadbala uses sunriseMinutes', () => {
  const src = read('src/lib/kundali/shadbala.ts');

  it('uses sunriseMinutes / sunsetMinutes (not sunrise.getHours)', () => {
    expect(src).toMatch(/sunTimes\.sunriseMinutes\s*\/\s*60/);
    expect(src).toMatch(/sunTimes\.sunsetMinutes\s*\/\s*60/);
    expect(src).not.toMatch(/sunTimes\.sunrise\.getHours/);
    expect(src).not.toMatch(/sunTimes\.sunset\.getHours/);
  });
});

describe('TZ-2 — muhurta-compute nishita uses minutes arithmetic', () => {
  const src = read('src/lib/puja/muhurta-compute.ts');

  it('nishita branch uses sunsetMinutes + tomorrowSunriseMinutes', () => {
    expect(src).toMatch(/sun\.sunsetMinutes/);
    expect(src).toMatch(/tomorrowSun\.sunriseMinutes/);
  });

  it('does NOT average .getTime() of TZ-corrupted Dates', () => {
    expect(src).not.toMatch(/sunset\.getTime\(\)\s*\+\s*tomorrowSun\.sunrise\.getTime\(\)/);
  });

  it('builds next-day Date via Date.UTC', () => {
    expect(src).toMatch(/Date\.UTC\(year, month - 1, day\)/);
  });

  it('Gemini #158: builds solarMidnight as TRUE UT Date via Date.UTC - timezoneOffset', () => {
    expect(src).toMatch(/solarMidnightUtMs/);
    expect(src).toMatch(/solarMidnightMinutes\s*-\s*timezoneOffset\s*\*\s*60/);
    // The previous local-TZ constructor for solarMidnight is gone.
    expect(src).not.toMatch(/new Date\(year, month - 1, day \+ overflowDays/);
  });
});

describe('TZ-3 — parana-compute uses true-UT sunrise + Date.UTC for nextDay', () => {
  const src = read('src/lib/puja/parana-compute.ts');

  it('builds nextDay via Date.UTC (DST-safe)', () => {
    expect(src).toMatch(/Date\.UTC\([\s\S]{0,80}getUTCFullYear/);
  });

  it('builds sunrise from sunriseMinutes + tzOffset (true UT ms)', () => {
    expect(src).toMatch(/sunriseUtMs/);
    expect(src).toMatch(/nextDaySun\.sunriseMinutes\s*-\s*timezoneOffset\s*\*\s*60/);
  });

  it('does NOT destructure { sunrise } directly from getSunTimes return', () => {
    // The destructured `sunrise` was the deprecated server-tz-corrupted
    // Date. We now build a proper UT Date ourselves.
    expect(src).not.toMatch(/const\s*\{\s*sunrise,\s*dayDurationMinutes\s*\}\s*=\s*nextDaySun/);
  });
});

describe('TZ-4 — dasha lab builds birthDateObj as UT instant', () => {
  const src = read('src/app/[locale]/learn/labs/dasha/page.tsx');

  it('uses Date.UTC with utHour, not browser-local Date constructor', () => {
    // The fix mirrors kundali-calc.ts: subtract tzOffset to get utHour
    // and construct via Date.UTC.
    expect(src).toMatch(/const birthDateObj = new Date\(Date\.UTC\(year, month - 1, day,/);
    expect(src).not.toMatch(/const birthDateObj = new Date\(year, month - 1, day, hour, minute\)/);
  });
});

describe('TZ-5 — gochar + transit-alerts use true UT JD', () => {
  it('gochar.ts builds JD from Date.now() / 86_400_000', () => {
    const src = read('src/lib/personalization/gochar.ts');
    expect(src).toMatch(/2440587\.5\s*\+\s*Date\.now\(\)\s*\/\s*86[_]?400[_]?000/);
    expect(src).not.toMatch(/now\.getFullYear[\s\S]{0,150}now\.getHours/);
  });

  it('transit-alerts.ts builds JD from Date.now() / 86_400_000', () => {
    const src = read('src/lib/personalization/transit-alerts.ts');
    expect(src).toMatch(/2440587\.5\s*\+\s*Date\.now\(\)\s*\/\s*86[_]?400[_]?000/);
    expect(src).not.toMatch(/now\.getFullYear[\s\S]{0,150}now\.getHours/);
  });
});

describe('TZ-6 — journal/snapshot extracts y/m/d in observer tz', () => {
  const src = read('src/lib/journal/snapshot.ts');

  it('uses Intl.DateTimeFormat with the timezone parameter', () => {
    expect(src).toMatch(/Intl\.DateTimeFormat\('en-CA'[\s\S]{0,150}timeZone:\s*timezone/);
    expect(src).toMatch(/formatToParts\(date\)/);
  });

  it('does NOT read y/m/d via server-local date.getFullYear()', () => {
    // The function still falls back to UTC accessors on Intl error —
    // that's the documented graceful degradation — but the primary path
    // no longer uses server-local getFullYear etc.
    expect(src).not.toMatch(/const year = date\.getFullYear\(\);[\s\S]{0,80}const month = date\.getMonth\(\)/);
  });
});

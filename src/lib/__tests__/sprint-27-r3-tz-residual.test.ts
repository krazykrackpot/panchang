/**
 * Sprint 27 — Round 3 TZ residual cluster.
 *
 * R3-TZ-1  — varshaphal/solar-return.ts jdToDateObj returns structured fields
 * R3-TZ-7  — learning-progress-store streak in user tz, not browser-local
 * R3-TZ-8  — chakra-systems + mangal-dosha age via getUTCFullYear
 * R3-TZ-10 — jaimini Chara Dasha ms math instead of setFullYear
 * R3-TZ-13 — pancha-pakshi weekday via JD, not server-local
 * R3-TZ-18 — gamification ist-day generalised to per-user tz
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  dayInTz,
  todayInTz,
  daysBetween,
  isMondayDay,
  // Deprecated aliases retained for back-compat
  istDate,
  todayIst,
} from '@/lib/gamification/ist-day';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('R3-TZ-1 — solar-return SolarReturnResult exposes structured fields', () => {
  const src = read('src/lib/varshaphal/solar-return.ts');

  it('SolarReturnResult has year/month/day/hour/minute/weekday', () => {
    expect(src).toMatch(/year: number;\s*month: number;\s*day: number;\s*hour: number;\s*minute: number;/);
    expect(src).toMatch(/weekday: number;/);
  });

  it('jdToParts helper exists and does pure-arithmetic conversion', () => {
    expect(src).toMatch(/function jdToParts\(/);
  });

  it('findSolarReturn populates the structured fields from jdToParts', () => {
    expect(src).toMatch(/const parts = jdToParts\(bestJD, birthTz\)/);
    expect(src).toMatch(/year:\s*parts\.year/);
    expect(src).toMatch(/weekday:\s*parts\.weekday/);
  });

  it('SolarReturnResult.date marked @deprecated', () => {
    expect(src).toMatch(/@deprecated Sentinel Date/);
  });

  it('varshaphal/index.ts uses solarReturn.year/month/day/hour/minute, not sentinel UTC accessors', () => {
    const indexSrc = read('src/lib/varshaphal/index.ts');
    expect(indexSrc).toMatch(/solarReturn\.year/);
    expect(indexSrc).toMatch(/solarReturn\.month/);
    expect(indexSrc).toMatch(/solarReturn\.day/);
    expect(indexSrc).toMatch(/solarReturn\.weekday/);
    // The previous srDate.getUTCFullYear / srDate.getUTCDay chain is gone.
    expect(indexSrc).not.toMatch(/srDate\.getUTCFullYear/);
    expect(indexSrc).not.toMatch(/srDate\.getUTCDay/);
  });
});

describe('R3-TZ-7 — learning-progress streak in user tz', () => {
  const src = read('src/stores/learning-progress-store.ts');

  it('getTodayStr reads tz from location store, not browser-local', () => {
    expect(src).toMatch(/function getUserTimezone\(/);
    expect(src).toMatch(/Intl\.DateTimeFormat\('en-CA'[\s\S]{0,150}timeZone: timezone/);
  });

  it('isTodayMonday uses Intl with the user tz (not new Date().getDay())', () => {
    expect(src).toMatch(/weekday: 'short'/);
    // The previous `new Date().getDay() === 1` line is gone.
    expect(src).not.toMatch(/return new Date\(\)\.getDay\(\) === 1/);
  });
});

describe('R3-TZ-8 — mangal-dosha-engine uses getUTCFullYear', () => {
  // (chakra-systems.ts was deleted as dead code — it had no production
  // consumer. The mangal-dosha invariant below still locks in the TZ fix
  // for the live engine.)

  it('mangal-dosha-engine.ts uses getUTCFullYear', () => {
    const src = read('src/lib/kundali/mangal-dosha-engine.ts');
    expect(src).toMatch(/const currentYear = new Date\(\)\.getUTCFullYear\(\)/);
    expect(src).not.toMatch(/const currentYear = new Date\(\)\.getFullYear\(\)/);
  });
});

describe('R3-TZ-10 — jaimini Chara Dasha ms math', () => {
  const src = read('src/lib/jaimini/jaimini-calc.ts');

  it('uses ms arithmetic (currentDate.getTime() + years * 365.25 * ms-per-day)', () => {
    expect(src).toMatch(/currentDate\.getTime\(\) \+ years \* 365\.25 \* 24 \* 60 \* 60 \* 1000/);
  });

  it('previous setFullYear pattern is gone', () => {
    expect(src).not.toMatch(/endDate\.setFullYear\(endDate\.getFullYear\(\) \+ years\)/);
  });
});

describe('R3-TZ-13 — pancha-pakshi weekday via JD', () => {
  const src = read('src/lib/prashna/pancha-pakshi.ts');

  it('weekday derived from JD (0=Sun Lesson O), not now.getDay()', () => {
    expect(src).toMatch(/const nowJd = 2440587\.5 \+ nowMs \/ 86_400_000/);
    expect(src).toMatch(/\(\(Math\.floor\(nowJd \+ 1\.5\) % 7\) \+ 7\) % 7/);
  });

  it('removes the previous `now.getDay()` weekday read', () => {
    expect(src).not.toMatch(/const weekday = now\.getDay\(\)/);
  });
});

describe('R3-TZ-18 — gamification ist-day generalised to per-user tz', () => {
  it('dayInTz / todayInTz / daysBetween / isMondayDay are exported', () => {
    expect(dayInTz(new Date('2026-05-24T15:30:00Z'), 'Asia/Kolkata')).toBe('2026-05-24');
    expect(dayInTz(new Date('2026-05-22T22:00:00Z'), 'Europe/Zurich')).toBe('2026-05-23'); // CEST = UTC+2
    expect(dayInTz(new Date('2026-05-22T22:00:00Z'), 'America/Los_Angeles')).toBe('2026-05-22'); // PDT = UTC-7
  });

  it('daysBetween: a < b returns positive', () => {
    expect(daysBetween('2026-05-22', '2026-05-23')).toBe(1);
    expect(daysBetween('2026-05-22', '2026-05-22')).toBe(0);
  });

  it('isMondayDay matches known Mondays', () => {
    expect(isMondayDay('2026-05-18')).toBe(true);
    expect(isMondayDay('2026-05-19')).toBe(false);
  });

  it('legacy istDate / todayIst still work via Asia/Kolkata wrapper', () => {
    expect(istDate(new Date('2026-05-22T22:00:00Z'))).toBe('2026-05-23');
    expect(typeof todayIst()).toBe('string');
  });

  it('StreakGrid uses todayInTz with user timezone from location store', () => {
    const src = read('src/components/gamification/StreakGrid.tsx');
    expect(src).toMatch(/import \{ todayInTz, daysBetween \} from '@\/lib\/gamification\/ist-day'/);
    expect(src).toMatch(/useLocationStore\(\(s\) => s\.timezone\)/);
    expect(src).toMatch(/todayInTz\(tz\)/);
    // The previous hardcoded-IST call is gone from the consumer.
    expect(src).not.toMatch(/import \{ todayIst[\s\S]{0,40}\} from '@\/lib\/gamification\/ist-day'/);
  });
});

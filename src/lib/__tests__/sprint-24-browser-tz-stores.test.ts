/**
 * Sprint 24 — Browser-TZ client pages + store errors.
 *
 * 7 client pages migrated from browser-local y/m/d to
 * todayInTimezone(locationTimezone). 2 stores now surface Supabase
 * { error } instead of silently swallowing.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('TZ-7 — client pages use todayInTimezone(locationTz)', () => {
  it('rahu-kaal/Client.tsx', () => {
    const src = read('src/app/[locale]/rahu-kaal/Client.tsx');
    expect(src).toMatch(/todayInTimezone\(selectedCity\.timezone\)/);
    // The browser-local triplet read is gone.
    expect(src).not.toMatch(/const now = new Date\(\);\s*\n\s*const year = now\.getFullYear/);
  });

  it('choghadiya/Client.tsx', () => {
    const src = read('src/app/[locale]/choghadiya/Client.tsx');
    expect(src).toMatch(/todayInTimezone\(selectedCity\.timezone\)/);
  });

  it('panchak/page.tsx', () => {
    const src = read('src/app/[locale]/panchak/page.tsx');
    expect(src).toMatch(/todayInTimezone\(selectedCity\.timezone\)/);
  });

  it('holashtak/page.tsx', () => {
    const src = read('src/app/[locale]/holashtak/page.tsx');
    expect(src).toMatch(/todayInTimezone\(selectedCity\.timezone\)/);
  });

  it('chandra-darshan/page.tsx (TZ-24)', () => {
    const src = read('src/app/[locale]/chandra-darshan/page.tsx');
    expect(src).toMatch(/todayInTimezone\(timezone\)/);
  });

  it('dinacharya/page.tsx', () => {
    const src = read('src/app/[locale]/dinacharya/page.tsx');
    expect(src).toMatch(/todayInTimezone\(ianaTimezone\)/);
  });

  it('embed/panchang/page.tsx', () => {
    const src = read('src/app/[locale]/embed/panchang/page.tsx');
    expect(src).toMatch(/todayInTimezone\(timezone\)/);
  });
});

describe('TZ-9 — hora/Client.tsx initial date + isToday use panchang tz', () => {
  const src = read('src/app/[locale]/hora/Client.tsx');

  it('selectedDate hydrates via useEffect (Lesson ZD — no render-scope clock in useState initializer)', () => {
    // PR #483 dropped the store-derived useState initializer to fix ISR
    // hydration mismatch. Initial state is `''`; the real date is set in a
    // post-mount effect via `setSelectedDate(todayInTimezone(timezone))`.
    // Accept either single- or double-quote empty string (Prettier
    // can swap quote style; the empty-string init is what we're guarding).
    expect(src).toMatch(/useState<string>\(['"]['"]\)/);
    expect(src).toMatch(/setSelectedDate\(todayInTimezone\(timezone\)\)/);
    expect(src).not.toMatch(/useState\(\(\) => todayInTimezone\(/);
  });

  it('isToday compares against todayInTimezone(timezone)', () => {
    expect(src).toMatch(/selectedDate === todayInTimezone\(timezone\)/);
  });

  it('browser-local todayStr formatter is gone', () => {
    expect(src).not.toMatch(/todayStr = `\$\{now\.getFullYear/);
  });
});

describe('TZ-14 — monthly-calendar uses todayInTimezone', () => {
  const src = read('src/lib/personalization/monthly-calendar.ts');

  it('todayStr derived from todayInTimezone(timezone)', () => {
    expect(src).toMatch(/const todayStr = todayInTimezone\(timezone\)/);
  });

  it('previous server-local construction is gone', () => {
    expect(src).not.toMatch(/today\.getFullYear[\s\S]{0,80}today\.getMonth\(\)\s*\+\s*1[\s\S]{0,80}today\.getDate/);
  });
});

describe('SF-20 — subscription-store surfaces Supabase errors', () => {
  const src = read('src/stores/subscription-store.ts');

  it('fetchSubscription destructures { error: subErr } and logs', () => {
    expect(src).toMatch(/error: subErr/);
    expect(src).toMatch(/fetchSubscription DB error/);
  });

  it('fetchUsage destructures { error: usageErr } and logs', () => {
    expect(src).toMatch(/error: usageErr/);
    expect(src).toMatch(/fetchUsage DB error/);
  });
});

describe('SF-21 — auth-store.initialize surfaces getSession error', () => {
  const src = read('src/stores/auth-store.ts');

  it('initialize destructures { error: sessionErr } and logs', () => {
    expect(src).toMatch(/error: sessionErr/);
    expect(src).toMatch(/getSession failed during initialize/);
  });
});

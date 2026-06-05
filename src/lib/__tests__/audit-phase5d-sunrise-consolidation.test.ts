/**
 * Audit 2026-06-05 Phase 5d — sunrise consolidation (#22).
 *
 * Adds `src/lib/ephem/sunrise-sunset-local.ts` as a thin local-minutes
 * shim over the canonical Swiss+Meeus pipeline in
 * `ephem/swiss-ephemeris.ts`. Migrates 4 call sites off the second
 * sunrise solver in `astronomy/sunrise.ts:getSunTimes`:
 *
 *   1. src/lib/calendar/eclipse-compute.ts          → canonical
 *   2. src/app/[locale]/festivals/[slug]/[year]/page.tsx           → canonical
 *   3. src/app/[locale]/festivals/[slug]/[year]/[city]/page.tsx    → canonical
 *   4. src/app/[locale]/festivals/[slug]/[year]/[city]/layout.tsx  → canonical
 *
 * `astronomy/sunrise.ts:getSunTimes` is retained for
 * `src/app/[locale]/vedic-time/Client.tsx` which uses dawn/dusk and
 * deprecated Date-object outputs not yet exposed by the canonical.
 * Retiring that fully is a separate phase.
 *
 * Cross-source check (scripts/verify-phase5d-sunrise.ts): OLD vs NEW
 * are byte-identical to the minute across 5 dates × 3 cities (Delhi,
 * Bern, Mumbai). Sub-minute drift is 2-4 seconds (Swiss vs Meeus
 * agree to ~5 sec for sunrise at mid-latitudes — the "1-2 min drift"
 * in the audit was generous; actual drift is below display resolution).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getSunriseSunsetLocalMinutes } from '@/lib/ephem/sunrise-sunset-local';
import { getSunTimes } from '@/lib/astronomy/sunrise';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — drift guards on migrated call sites
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5d.1 (#22): eclipse-compute routes through canonical', () => {
  const src = repoFile('src/lib/calendar/eclipse-compute.ts');

  it('imports getSunriseSunsetLocalMinutes from ephem/', () => {
    expect(src).toMatch(/import\s+\{\s*getSunriseSunsetLocalMinutes\s*\}\s+from\s+['"]@\/lib\/ephem\/sunrise-sunset-local['"]/);
  });

  it('no longer imports getSunTimes from astronomy/sunrise', () => {
    expect(src).not.toMatch(/import\s+\{[^}]*getSunTimes[^}]*\}\s+from\s+['"]@\/lib\/astronomy\/sunrise['"]/);
  });
});

describe('Audit P5d.2 (#22): festival surfaces route through canonical', () => {
  const festivalFiles = [
    'src/app/[locale]/festivals/[slug]/[year]/page.tsx',
    'src/app/[locale]/festivals/[slug]/[year]/[city]/page.tsx',
    'src/app/[locale]/festivals/[slug]/[year]/[city]/layout.tsx',
  ];

  for (const path of festivalFiles) {
    it(`${path} uses getSunriseSunsetLocalMinutes (canonical)`, () => {
      const src = repoFile(path);
      // Canonical import present.
      expect(src).toMatch(/getSunriseSunsetLocalMinutes/);
      // The legacy getSunTimes call is gone (formatMinutesHHMM is still
      // imported — it operates on the minute fields, not Date objects).
      expect(src).not.toMatch(/getSunTimes\(/);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — functional equivalence at the consumer surface
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5d.3 (#22): byte-identical to legacy at minute resolution', () => {
  // Cross-source-verified samples (scripts/verify-phase5d-sunrise.ts).
  // Sub-minute drift OLD vs NEW: ~2-4 sec. Rounded to minute: 0.
  const cases = [
    { d: '2026-02-17', lat: 28.6139, lng: 77.2090, tz: 5.5, label: 'Delhi 2026-02-17' },
    { d: '2026-06-05', lat: 28.6139, lng: 77.2090, tz: 5.5, label: 'Delhi 2026-06-05' },
    { d: '2026-07-14', lat: 28.6139, lng: 77.2090, tz: 5.5, label: 'Delhi 2026-07-14' },
    { d: '2026-06-05', lat: 46.9481, lng: 7.4474, tz: 2.0, label: 'Bern 2026-06-05' },
    { d: '2026-07-14', lat: 19.0760, lng: 72.8777, tz: 5.5, label: 'Mumbai 2026-07-14' },
  ] as const;

  for (const c of cases) {
    it(`${c.label}: NEW rounds to same minute as OLD getSunTimes`, () => {
      const [y, m, d] = c.d.split('-').map(Number);
      const old = getSunTimes(y, m, d, c.lat, c.lng, c.tz);
      const next = getSunriseSunsetLocalMinutes(y, m, d, c.lat, c.lng, c.tz);
      expect(Math.round(next.sunriseMinutes)).toBe(Math.round(old.sunriseMinutes));
      expect(Math.round(next.sunsetMinutes)).toBe(Math.round(old.sunsetMinutes));
    });
  }
});

describe('Audit P5d.4 (#22): canonical handles east/west longitude wrap', () => {
  // For east longitudes, Swiss returns UT hours close to 24 (sunrise on
  // the previous UT day from the perspective of a UT-anchored JD). The
  // helper's `% 24` wrap normalises this to 0-1440 local minutes.
  it('Delhi (east, +5.5 TZ) returns sunrise minutes in [0, 1440)', () => {
    const r = getSunriseSunsetLocalMinutes(2026, 6, 5, 28.6139, 77.2090, 5.5);
    expect(r.sunriseMinutes).toBeGreaterThanOrEqual(0);
    expect(r.sunriseMinutes).toBeLessThan(1440);
    expect(r.sunsetMinutes).toBeGreaterThanOrEqual(0);
    expect(r.sunsetMinutes).toBeLessThan(1440);
  });

  it('Honolulu (west, -10 TZ) returns sunrise minutes in [0, 1440)', () => {
    const r = getSunriseSunsetLocalMinutes(2026, 6, 5, 21.3069, -157.8583, -10.0);
    expect(r.sunriseMinutes).toBeGreaterThanOrEqual(0);
    expect(r.sunriseMinutes).toBeLessThan(1440);
    expect(r.sunsetMinutes).toBeGreaterThanOrEqual(0);
    expect(r.sunsetMinutes).toBeLessThan(1440);
  });
});

/**
 * End-time projection helpers for the tithi-grid API.
 *
 * Previously inlined in `src/app/api/tithi-grid/route.ts`. Lifted to a
 * library file so they're testable in isolation — the math is exactly the
 * class of bug CLAUDE.md Lessons L and V warn about (JD↔Date conversions,
 * fractional-day projection, tz-offset arithmetic).
 */

import {
  dateToJD, moonLongitude, sunLongitude, toSidereal, getAyanamsha, normalizeDeg,
} from '@/lib/ephem/astronomical';

/** Elongation (Moon − Sun) sidereal at a JD — drives tithi boundaries. */
export function elongationAt(jd: number): number {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  return normalizeDeg(moonSid - sunSid);
}

/** Moon sidereal longitude — drives nakshatra + rashi boundaries. */
export function moonSidAt(jd: number): number {
  return toSidereal(moonLongitude(jd), jd);
}

/** Sun+Moon sidereal sum — drives yoga boundaries. */
export function yogaAt(jd: number): number {
  const aya = getAyanamsha(jd);
  const sunSid = normalizeDeg(sunLongitude(jd) - aya);
  const moonSid = normalizeDeg(moonLongitude(jd) - aya);
  return normalizeDeg(sunSid + moonSid);
}

/**
 * Project the JD at which `valueAt(jd)` next crosses a `segmentDeg` boundary
 * using a linear extrapolation from a 24-hour sample. Accurate to ~1–2 min
 * for the Sun-Moon angular accumulators we feed in. Returns `undefined` only
 * for stationary accumulators (which the Moon-Sun system never produces).
 */
export function nextBoundary(
  jdStart: number,
  valueAt: (jd: number) => number,
  segmentDeg: number,
  year: number,
  month: number,
  day: number,
  tzOffset: number,
): { hhmm: string; nextDay: boolean } | undefined {
  const v0 = valueAt(jdStart);
  const v1 = valueAt(jdStart + 1);
  let dv = v1 - v0;
  // Genuinely stationary accumulators don't happen for the Sun-Moon angular
  // pairs we feed in, but guard so a future caller that does feed in a
  // constant gets a loud warning rather than silently producing wrong times.
  if (dv === 0) {
    console.warn('[tithi-grid-projection] stationary accumulator', { jdStart, segmentDeg, v0, v1 });
    return undefined;
  }
  // Negative dv = 360° wrap between samples (lunar elements always move
  // forward, so a negative diff means we crossed the 360→0 seam).
  if (dv < 0) dv += 360;
  const remaining = segmentDeg - (v0 % segmentDeg);
  const daysToCross = remaining / dv;
  const jdEnd = jdStart + daysToCross;
  return jdToLocalHHMM(jdEnd, year, month, day, tzOffset);
}

/**
 * Convert a JD to a local-timezone HH:MM string, flagging whether the
 * moment falls on a later civil day than (year, month, day).
 *
 * Avoids `jdToDate()` because JD↔Date conversions at transition-time
 * resolution are delicate. Works in fractional UT hours and adds the tz
 * offset, then splits into calendar components.
 */
export function jdToLocalHHMM(
  jd: number,
  year: number,
  month: number,
  day: number,
  tzOffset: number,
): { hhmm: string; nextDay: boolean } {
  const jd0 = dateToJD(year, month, day, 0);
  const hoursUT = (jd - jd0) * 24;
  const hoursLocal = hoursUT + tzOffset;
  const dayOffset = Math.floor(hoursLocal / 24);
  let h = hoursLocal - dayOffset * 24;
  if (h < 0) h += 24;
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  // mm can round to 60 — carry into hh. If the carry pushes hh past 23 we
  // also need to bump dayOffset, so the nextDay flag stays consistent.
  let finalHH = hh + Math.floor(mm / 60);
  const finalMM = mm % 60;
  let finalDayOffset = dayOffset;
  if (finalHH >= 24) {
    finalHH -= 24;
    finalDayOffset += 1;
  }
  return {
    hhmm: `${String(finalHH).padStart(2, '0')}:${String(finalMM).padStart(2, '0')}`,
    nextDay: finalDayOffset > 0,
  };
}

/** UT decimal hours → local HH:MM (used for Rahu Kaal start/end). */
export function formatLocalTimeFromUT(utDecHr: number, tzOffset: number): string {
  let local = utDecHr + tzOffset;
  // Wrap with one combined modulo so we don't iterate for absurd offsets.
  local = ((local % 24) + 24) % 24;
  const hh = Math.floor(local);
  const mm = Math.round((local - hh) * 60);
  const finalHH = (hh + Math.floor(mm / 60)) % 24;
  const finalMM = mm % 60;
  return `${String(finalHH).padStart(2, '0')}:${String(finalMM).padStart(2, '0')}`;
}

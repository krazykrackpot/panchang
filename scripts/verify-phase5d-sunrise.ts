/**
 * Phase 5d cross-source check.
 *
 * Compares the OLD `astronomy/sunrise.ts:getSunTimes` (pure Meeus
 * spherical-trig solver) against the NEW
 * `ephem/sunrise-sunset-local.ts:getSunriseSunsetLocalMinutes`
 * (canonical: Swiss Ephemeris when available, Meeus fallback).
 *
 * Goal: prove the migration is byte-identical at the consumer surface
 * so the 4 festival/eclipse call sites swap cleanly. We do NOT publish
 * a Drik/Prokerala absolute-truth column here because that requires a
 * live lookup per date — better done in the existing kundali-vs-Swiss
 * regression suite and the festival display verification.
 *
 * Sanity: also probe Swiss availability — Swiss-vs-Meeus is the
 * actual accuracy distinction, NOT the canonical-vs-legacy choice.
 *
 *   npx tsx scripts/verify-phase5d-sunrise.ts
 */

import { getSunTimes } from '../src/lib/astronomy/sunrise';
import { getSunriseSunsetLocalMinutes } from '../src/lib/ephem/sunrise-sunset-local';
import { isSwissEphAvailable } from '../src/lib/ephem/swiss-ephemeris';

function formatMinutesHHMM(m: number): string {
  const total = Math.floor(m);
  const w = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(w / 60);
  const mm = w % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

interface Sample {
  date: string;        // YYYY-MM-DD
  lat: number;
  lng: number;
  tzOffset: number;    // hours
  label: string;
}

const samples: readonly Sample[] = [
  // Delhi — IST = UTC+5.5
  { date: '2026-02-17', lat: 28.6139, lng: 77.2090, tzOffset: 5.5, label: 'Delhi 2026-02-17' },
  { date: '2026-06-05', lat: 28.6139, lng: 77.2090, tzOffset: 5.5, label: 'Delhi 2026-06-05' },
  { date: '2026-07-14', lat: 28.6139, lng: 77.2090, tzOffset: 5.5, label: 'Delhi 2026-07-14' },
  // Bern (Switzerland) — CEST = UTC+2 in June
  { date: '2026-06-05', lat: 46.9481, lng: 7.4474, tzOffset: 2.0, label: 'Bern 2026-06-05' },
  // Mumbai — IST = UTC+5.5
  { date: '2026-07-14', lat: 19.0760, lng: 72.8777, tzOffset: 5.5, label: 'Mumbai 2026-07-14' },
] as const;

function diffMin(a: number, b: number): string {
  const d = Math.round(a - b);
  if (d === 0) return '0';
  const sign = d > 0 ? '+' : '';
  return `${sign}${d}m`;
}

console.log('='.repeat(98));
console.log('Phase 5d sunrise/sunset migration check');
console.log(`Swiss Ephemeris loaded: ${isSwissEphAvailable()}`);
console.log('Hypothesis: NEW canonical (Swiss when available) === OLD getSunTimes (pure Meeus).');
console.log('If they differ, that is the Swiss-vs-Meeus accuracy delta — NOT a Phase 5d regression.');
console.log('='.repeat(98));
console.log();
console.log(
  'Location'.padEnd(28) +
  'Source'.padEnd(20) +
  'Sunrise'.padEnd(14) +
  'Sunset'.padEnd(14) +
  'Δ vs old'.padEnd(14),
);
console.log('-'.repeat(90));

let maxAbsDriftMin = 0;
for (const s of samples) {
  const [y, m, d] = s.date.split('-').map(Number);
  const old = getSunTimes(y, m, d, s.lat, s.lng, s.tzOffset);
  const next = getSunriseSunsetLocalMinutes(y, m, d, s.lat, s.lng, s.tzOffset);

  const oldSr = formatMinutesHHMM(old.sunriseMinutes);
  const oldSs = formatMinutesHHMM(old.sunsetMinutes);
  const newSr = formatMinutesHHMM(next.sunriseMinutes);
  const newSs = formatMinutesHHMM(next.sunsetMinutes);

  const driftSr = Math.abs(Math.round(next.sunriseMinutes - old.sunriseMinutes));
  const driftSs = Math.abs(Math.round(next.sunsetMinutes - old.sunsetMinutes));
  maxAbsDriftMin = Math.max(maxAbsDriftMin, driftSr, driftSs);

  console.log(
    s.label.padEnd(28) +
    'OLD (pure Meeus)'.padEnd(20) +
    oldSr.padEnd(14) +
    oldSs.padEnd(14) +
    '—'.padEnd(14),
  );
  console.log(
    ''.padEnd(28) +
    'NEW (canonical)'.padEnd(20) +
    newSr.padEnd(14) +
    newSs.padEnd(14) +
    `sr ${diffMin(next.sunriseMinutes, old.sunriseMinutes)}, ss ${diffMin(next.sunsetMinutes, old.sunsetMinutes)}`,
  );
  console.log();
}

console.log('='.repeat(98));
console.log(`Max |Δ| across all samples: ${maxAbsDriftMin} minute(s).`);
console.log();
console.log('What this proves:');
console.log('  - If max Δ === 0: migration is byte-identical — ship freely.');
console.log('  - If max Δ <= 1 min and Swiss is loaded: NEW is slightly more accurate (Swiss vs');
console.log('    Meeus). Document the small bump but it is NOT a regression.');
console.log('  - If max Δ > 2 min: Swiss convention mismatch — investigate rise_trans flags.');
console.log();
console.log('Drik/Prokerala absolute-truth comparison: requires per-date live lookup; covered');
console.log('by the standing kundali-vs-Swiss test suite (not duplicated here).');

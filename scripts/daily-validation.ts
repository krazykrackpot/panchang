#!/usr/bin/env npx tsx
/**
 * Daily Panchang Validation — run by GitHub Action at 02:00 UTC.
 *
 * Tests:
 * 1. 540-point sunrise/sunset/Rahu Kaal sanity (15 locations × 12 months × 3 years)
 * 2. Festival date spot-check against Prokerala-verified dates
 * 3. Tithi table integrity (entry count per city per year)
 *
 * Exit code 1 on failure — breaks the CI pipeline.
 */

import { computePanchang } from '../src/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '../src/lib/utils/timezone';
import { isSwissEphAvailable } from '../src/lib/ephem/swiss-ephemeris';
import { generateFestivalCalendarV2 } from '../src/lib/calendar/festival-generator';
import { buildYearlyTithiTable } from '../src/lib/calendar/tithi-table';

let exitCode = 0;

// ══════════════════════════════════════════════════════════════
// TEST 1: Sunrise/Sunset/Rahu Kaal sanity (540 points)
// ══════════════════════════════════════════════════════════════

console.log('═══ TEST 1: Sunrise/Sunset Accuracy (540 points) ═══\n');
console.log('Swiss Ephemeris:', isSwissEphAvailable());

const LOCATIONS = [
  { name: 'Corseaux', lat: 46.4627, lng: 6.8368, tz: 'Europe/Zurich' },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, tz: 'Asia/Kolkata' },
  { name: 'NewYork', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'LosAngeles', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321, tz: 'America/Los_Angeles' },
  { name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
  { name: 'SaoPaulo', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo' },
  { name: 'Reykjavik', lat: 64.1466, lng: -21.9426, tz: 'Atlantic/Reykjavik' },
  { name: 'Helsinki', lat: 60.1699, lng: 24.9384, tz: 'Europe/Helsinki' },
  { name: 'Anchorage', lat: 61.2181, lng: -149.9003, tz: 'America/Anchorage' },
];

const YEARS = [2025, 2026, 2027];
const MONTHS = [
  { m: 1, d: 15 }, { m: 2, d: 14 }, { m: 3, d: 15 }, { m: 4, d: 15 },
  { m: 5, d: 15 }, { m: 6, d: 21 }, { m: 7, d: 15 }, { m: 8, d: 15 },
  { m: 9, d: 15 }, { m: 10, d: 15 }, { m: 11, d: 15 }, { m: 12, d: 21 },
];

let total = 0, passed = 0, failed = 0;
const failures: string[] = [];

for (const year of YEARS) {
  for (const { m, d } of MONTHS) {
    for (const loc of LOCATIONS) {
      total++;
      try {
        const tzOff = getUTCOffsetForDate(year, m, d, loc.tz);
        const p = computePanchang({ year, month: m, day: d, lat: loc.lat, lng: loc.lng, tzOffset: tzOff, timezone: loc.tz, locationName: loc.name });

        const [srH, srM] = (p.sunrise || '0:0').split(':').map(Number);
        const [ssH, ssM] = (p.sunset || '0:0').split(':').map(Number);
        const srDec = srH + srM / 60;
        const ssDec = ssH + ssM / 60;

        const rkS = parseInt(p.rahuKaal?.start?.split(':')[0] || '0') + parseInt(p.rahuKaal?.start?.split(':')[1] || '0') / 60;
        const rkE = parseInt(p.rahuKaal?.end?.split(':')[0] || '0') + parseInt(p.rahuKaal?.end?.split(':')[1] || '0') / 60;

        let ok = true;
        const issues: string[] = [];

        // Polar locations (|lat| > 60°): wider thresholds for midnight sun / polar night.
        // Near summer solstice, sunrise can be 01:00-03:00 and sunset can wrap past midnight.
        // Near winter solstice, sunrise can be 10:00+ and sunset 14:00-.
        const isPolar = Math.abs(loc.lat) > 60;
        // High-latitude non-polar (50-60°): winter days can be < 8h (e.g., London 7h50m Dec 21)
        const isHighLat = Math.abs(loc.lat) > 50;

        if (isPolar) {
          // Polar: just verify sunrise is a valid time string, tithi exists, no crash
          if (!p.sunrise || p.sunrise === '--:--') { ok = false; issues.push('no sunrise'); }
          if (!p.sunset || p.sunset === '--:--') { ok = false; issues.push('no sunset'); }
        } else {
          if (srDec < 3 || srDec > 10) { ok = false; issues.push(`SR=${p.sunrise} out of 3-10`); }
          if (ssDec < 14 || ssDec > 22) { ok = false; issues.push(`SS=${p.sunset} out of 14-22`); }
          const minDay = isHighLat ? 7 : 8; // London winter = 7h50m
          if (ssDec - srDec < minDay) { ok = false; issues.push(`day=${(ssDec - srDec).toFixed(1)}h < ${minDay}h`); }
          if (ssDec <= srDec) { ok = false; issues.push('SS<=SR'); }
        }

        // Rahu Kaal sanity — for polar, just check it's not negative duration
        const rkDur = rkE - rkS;
        if (isPolar) {
          // In polar cases, Rahu Kaal might wrap past midnight — just check duration is positive
          // when accounting for wrap: if rkE < rkS, actual duration = rkE + 24 - rkS
          const adjustedDur = rkDur < 0 ? rkDur + 24 : rkDur;
          if (adjustedDur < 0.5 || adjustedDur > 4) { ok = false; issues.push(`RK dur=${adjustedDur.toFixed(1)}h`); }
        } else {
          if (rkS < srDec - 0.1 || rkE > ssDec + 0.1) { ok = false; issues.push('RK outside day'); }
          if (rkDur < 0.5 || rkDur > 3) { ok = false; issues.push(`RK dur=${rkDur.toFixed(1)}h`); }
        }

        // Pancha anga must always be present regardless of latitude
        if (!p.tithi?.name?.en || !p.tithi?.paksha) { ok = false; issues.push('no tithi'); }
        if (!p.nakshatra?.name?.en) { ok = false; issues.push('no nakshatra'); }
        if (!p.yoga?.name?.en) { ok = false; issues.push('no yoga'); }
        if (!p.karana?.name?.en) { ok = false; issues.push('no karana'); }

        if (ok) passed++;
        else { failed++; failures.push(`${year}-${m}-${d} ${loc.name}: ${issues.join(', ')}`); }
      } catch (e) {
        failed++;
        failures.push(`${year}-${m}-${d} ${loc.name}: CRASH: ${String(e).slice(0, 80)}`);
      }
    }
  }
}

console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}`);
if (failures.length) {
  console.log('\nFAILURES:');
  failures.forEach(f => console.log(`  ${f}`));
}
if (failed > 0) {
  console.error(`\n❌ ${failed} FAILURES`);
  exitCode = 1;
} else {
  console.log('\n✅ Sunrise/Sunset validation PASSED — all 540 points');
}

// ══════════════════════════════════════════════════════════════
// TEST 2: Festival date spot-check (Prokerala-verified)
// ══════════════════════════════════════════════════════════════

console.log('\n═══ TEST 2: Festival Dates (Prokerala-verified) ═══\n');

const f2026 = generateFestivalCalendarV2(2026, 28.6139, 77.2090, 'Asia/Kolkata');
const f2027 = generateFestivalCalendarV2(2027, 28.6139, 77.2090, 'Asia/Kolkata');

// Verified against Prokerala Apr 30 2026
const FESTIVAL_CHECKS: [string, string, typeof f2026][] = [
  ['diwali', '2026-11-08', f2026],
  ['holi', '2026-03-03', f2026],
  ['janmashtami', '2026-09-04', f2026],
  ['maha-shivaratri', '2026-02-15', f2026],
  ['ram-navami', '2026-03-26', f2026],
  ['vasant-panchami', '2026-01-23', f2026],
  ['diwali', '2027-10-29', f2027],
  ['holi', '2027-03-22', f2027],
  ['janmashtami', '2027-08-24', f2027],
];

let festOk = true;
for (const [slug, expected, festivals] of FESTIVAL_CHECKS) {
  const fest = festivals.find(x => x.slug === slug);
  const actual = fest?.date || 'MISSING';
  const match = actual === expected;
  if (!match) festOk = false;
  console.log(`${match ? '✓' : '✗'} ${slug}: ${actual}${match ? '' : ` (expected ${expected})`}`);
}

if (!festOk) {
  console.error('\n❌ FESTIVAL DATE MISMATCH');
  exitCode = 1;
} else {
  console.log('\n✅ Festival dates VERIFIED');
}

// ══════════════════════════════════════════════════════════════
// TEST 3: Tithi table integrity
// ══════════════════════════════════════════════════════════════

console.log('\n═══ TEST 3: Tithi Table Integrity ═══\n');

const TT_CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'NewYork', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
];

let ttOk = true;
for (const c of TT_CITIES) {
  for (const year of [2026, 2027]) {
    const table = buildYearlyTithiTable(year, c.lat, c.lng, c.tz);
    const count = table.entries.length;
    const valid = count >= 340 && count <= 400;
    if (!valid) ttOk = false;
    console.log(`${valid ? '✓' : '✗'} ${c.name} ${year}: ${count} entries`);
  }
}

if (!ttOk) {
  console.error('\n❌ TITHI TABLE ANOMALY');
  exitCode = 1;
} else {
  console.log('\n✅ Tithi tables VERIFIED');
}

// ══════════════════════════════════════════════════════════════
// FINAL RESULT
// ══════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(50));
if (exitCode === 0) {
  console.log('✅ ALL DAILY VALIDATIONS PASSED');
} else {
  console.log('❌ VALIDATION FAILURES DETECTED — SEE ABOVE');
}
process.exit(exitCode);

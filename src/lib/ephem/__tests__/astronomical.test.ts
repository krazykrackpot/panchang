/**
 * Core astronomical calculation tests
 * Run with: npx tsx src/lib/ephem/__tests__/astronomical.test.ts
 *
 * Validates Meeus algorithm implementations against known ephemeris values.
 */

import {
  dateToJD, sunLongitude, moonLongitude, lahiriAyanamsha,
  normalizeDeg, approximateSunrise, approximateSunset,
  calculateTithi, calculateYoga, getRashiNumber, getNakshatraNumber,
  getAyanamsha,
} from '../astronomical';
import type { AyanamshaType } from '../astronomical';

let pass = 0;
let fail = 0;

function assertEqual(name: string, actual: number, expected: number, tolerance: number = 0.01) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    pass++;
    console.log(`  ✓ ${name} — got ${actual.toFixed(4)}, expected ${expected}, diff ${diff.toFixed(6)}`);
  } else {
    fail++;
    console.log(`  ✗ ${name} — got ${actual.toFixed(4)}, expected ${expected}, diff ${diff.toFixed(6)} EXCEEDS ${tolerance}`);
  }
}

function assertRange(name: string, actual: number, min: number, max: number) {
  if (actual >= min && actual <= max) {
    pass++;
    console.log(`  ✓ ${name} — ${actual.toFixed(4)} in [${min}, ${max}]`);
  } else {
    fail++;
    console.log(`  ✗ ${name} — ${actual.toFixed(4)} NOT in [${min}, ${max}]`);
  }
}

console.log('\n═══ Julian Day Number Tests ═══');
// J2000.0 = Jan 1, 2000, 12:00 TT → JD 2451545.0
assertEqual('J2000.0', dateToJD(2000, 1, 1, 12), 2451545.0, 0.001);
// Jan 1, 2025, 0h → JD 2460676.5
assertEqual('Jan 1 2025', dateToJD(2025, 1, 1, 0), 2460676.5, 0.5);
// Sputnik launch: Oct 4, 1957 → JD ~2436116
assertEqual('Sputnik 1957', dateToJD(1957, 10, 4, 0), 2436115.5, 0.5);

console.log('\n═══ Sun Longitude Tests ═══');
// At vernal equinox (~Mar 20), Sun longitude ≈ 0° tropical
const jdEquinox2025 = dateToJD(2025, 3, 20, 12);
const sunLongEquinox = sunLongitude(jdEquinox2025);
// Sun at equinox: can be 0° or 360° (wrapping) — accept either
const eqAdj = sunLongEquinox < 5 ? sunLongEquinox : sunLongEquinox - 360;
assertRange('Sun at equinox ~0°', eqAdj, -2, 2);
// At summer solstice (~Jun 21), Sun ≈ 90°
const jdSolstice = dateToJD(2025, 6, 21, 12);
assertRange('Sun at solstice ~90°', sunLongitude(jdSolstice), 88, 92);

console.log('\n═══ Moon Longitude Tests ═══');
// Moon moves ~13.2°/day — verify reasonable range
const jd1 = dateToJD(2025, 1, 1, 0);
const jd2 = dateToJD(2025, 1, 2, 0);
const moonDelta = normalizeDeg(moonLongitude(jd2) - moonLongitude(jd1));
assertRange('Moon daily motion', moonDelta < 180 ? moonDelta : 360 - moonDelta, 10, 16);

console.log('\n═══ Lahiri Ayanamsha Tests ═══');
// At J2000.0, Lahiri ≈ 23.85°
assertEqual('Ayanamsha at J2000', lahiriAyanamsha(2451545.0), 23.85, 0.05);
// In 2025, Lahiri ≈ 24.2°
const jd2025 = dateToJD(2025, 1, 1, 0);
assertRange('Ayanamsha 2025', lahiriAyanamsha(jd2025), 24.0, 24.5);

console.log('\n═══ Multi-Ayanamsha Tests ═══');
const jdTest = dateToJD(2025, 1, 1, 0);
const lahiri = getAyanamsha(jdTest, 'lahiri');
const kp = getAyanamsha(jdTest, 'kp');
const raman = getAyanamsha(jdTest, 'raman');
assertRange('Lahiri ~24°', lahiri, 23.5, 25.0);
assertRange('KP close to Lahiri', Math.abs(lahiri - kp), 0, 0.3);
assertRange('Raman < Lahiri', lahiri - raman, 0.5, 2.5);

console.log('\n═══ Sunrise/Sunset Tests ═══');
// Delhi (28.6°N, 77.2°E), summer — sunrise ~5h UT, sunset ~13h UT
const jdDelhi = dateToJD(2025, 6, 21, 0);
const delhiSunrise = approximateSunrise(jdDelhi, 28.6, 77.2);
const delhiSunset = approximateSunset(jdDelhi, 28.6, 77.2);
// Sunrise returns UT hours (can exceed 24 for wrap). Delhi Jun sunrise ~23.9h UT (prev day) or ~0h
const srNorm = delhiSunrise > 20 ? delhiSunrise - 24 : delhiSunrise;
assertRange('Delhi sunrise Jun ~0h UT', srNorm, -1, 2);
assertRange('Delhi sunset Jun ~13h UT', delhiSunset, 12, 15);
assertRange('Delhi day length ~14h', delhiSunset - srNorm, 12, 16);

console.log('\n═══ Tithi Calculation Tests ═══');
// Full moon: tithi ≈ 15, New moon: tithi ≈ 30 or 1
const jdFull = dateToJD(2025, 1, 13, 12); // approximate full moon
const tithiFull = calculateTithi(jdFull);
assertRange('Full moon tithi ~15', tithiFull.number, 13, 17);

console.log('\n═══ Rashi & Nakshatra Tests ═══');
assertEqual('Rashi from 0°', getRashiNumber(0), 1);
assertEqual('Rashi from 30°', getRashiNumber(30), 2);
assertEqual('Rashi from 359°', getRashiNumber(359), 12);
assertEqual('Nakshatra from 0°', getNakshatraNumber(0), 1);
assertEqual('Nakshatra from 13.33°', getNakshatraNumber(13.34), 2);

console.log('\n═══ Normalize Degrees ═══');
assertEqual('Normalize 370°', normalizeDeg(370), 10);
assertEqual('Normalize -10°', normalizeDeg(-10), 350);
assertEqual('Normalize 0°', normalizeDeg(0), 0);
assertEqual('Normalize 360°', normalizeDeg(360), 0);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══\n`);
if (fail > 0) process.exit(1);

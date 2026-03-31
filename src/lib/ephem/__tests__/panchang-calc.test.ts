/**
 * Panchang calculation tests
 * Run with: npx tsx src/lib/ephem/__tests__/panchang-calc.test.ts
 */

import { computePanchang } from '../panchang-calc';

let pass = 0;
let fail = 0;

function assert(name: string, condition: boolean, detail?: string) {
  if (condition) {
    pass++;
    console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n═══ Panchang Computation Tests ═══');

// Test Delhi, Jan 15, 2025 (known date, Wednesday)
const p = computePanchang({ year: 2025, month: 1, day: 15, lat: 28.6139, lng: 77.209, tzOffset: 5.5, locationName: 'Delhi' });

// Basic fields exist
assert('Date correct', p.date === '2025-01-15', p.date);
assert('Tithi exists', !!p.tithi?.name?.en);
assert('Tithi number valid (1-30)', p.tithi.number >= 1 && p.tithi.number <= 30, `Tithi ${p.tithi.number}`);
assert('Tithi paksha valid', p.tithi.paksha === 'shukla' || p.tithi.paksha === 'krishna', p.tithi.paksha);
assert('Nakshatra exists', !!p.nakshatra?.name?.en);
const nakNum = (p.nakshatra as { number?: number }).number;
assert('Nakshatra has name', !!p.nakshatra.name.en, p.nakshatra.name.en);
assert('Yoga exists', !!p.yoga?.name?.en);
assert('Karana exists', !!p.karana?.name?.en);
assert('Vara exists', !!p.vara?.name?.en);
assert('Vara day 0-6', p.vara.day >= 0 && p.vara.day <= 6, `Day ${p.vara.day}`);

// Time fields
assert('Sunrise HH:MM', /^\d{2}:\d{2}$/.test(p.sunrise), p.sunrise);
assert('Sunset HH:MM', /^\d{2}:\d{2}$/.test(p.sunset), p.sunset);
assert('Moonrise HH:MM', /^\d{2}:\d{2}$/.test(p.moonrise), p.moonrise);

// Rahu Kaal
assert('Rahu Kaal start', /^\d{2}:\d{2}$/.test(p.rahuKaal.start), p.rahuKaal.start);
assert('Rahu Kaal end', /^\d{2}:\d{2}$/.test(p.rahuKaal.end), p.rahuKaal.end);

// Transition times exist
assert('Tithi transition', !!p.tithiTransition?.endTime);
assert('Nakshatra transition', !!p.nakshatraTransition?.endTime);
assert('Yoga transition', !!p.yogaTransition?.endTime);

// Muhurtas (30 per day)
assert('Muhurtas count = 30', p.muhurtas?.length === 30, `Got ${p.muhurtas?.length}`);

// Choghadiya (16 per day — 8 day + 8 night)
assert('Choghadiya count = 16', p.choghadiya?.length === 16, `Got ${p.choghadiya?.length}`);

// Hora (24)
assert('Hora count = 24', p.hora?.length === 24, `Got ${p.hora?.length}`);

// Planets (9)
assert('Planets count = 9', p.planets?.length === 9, `Got ${p.planets?.length}`);

// Enhanced fields
assert('Disha Shool exists', !!p.dishaShool?.direction?.en);
assert('Shiva Vaas exists', !!p.shivaVaas?.name?.en);
assert('Agni Vaas exists', !!p.agniVaas?.name?.en);
assert('Chandra Vaas exists', !!p.chandraVaas?.name?.en);
assert('Rahu Vaas exists', !!p.rahuVaas?.direction?.en);
assert('Kali Ahargana > 0', (p.kaliAhargana || 0) > 1800000, `${p.kaliAhargana}`);
assert('Julian Day > 2460000', (p.julianDay || 0) > 2460000, `${p.julianDay}`);
assert('Ayanamsha ~24°', (p.ayanamsha || 0) > 23 && (p.ayanamsha || 0) < 25, `${p.ayanamsha?.toFixed(2)}`);

// New fields
assert('Tamil Yoga exists', !!p.tamilYoga?.name?.en);
assert('Mantri Mandala exists', p.mantriMandala?.king?.planet !== undefined);
assert('Homahuti exists', !!p.homahuti?.direction?.en);
assert('Udaya Lagna array', Array.isArray(p.udayaLagna) && p.udayaLagna.length > 0, `${p.udayaLagna?.length} entries`);

// Udaya Lagna sanity
if (p.udayaLagna && p.udayaLagna.length > 0) {
  assert('Udaya Lagna has rashi 1-12', p.udayaLagna.every(l => l.rashi >= 1 && l.rashi <= 12));
  assert('Udaya Lagna has time strings', p.udayaLagna.every(l => /^\d{2}:\d{2}$/.test(l.start)));
}

// Trilingual support
assert('Tithi has Hindi', !!p.tithi.name.hi);
assert('Tithi has Sanskrit', !!p.tithi.name.sa);
assert('Nakshatra has Hindi', !!p.nakshatra.name.hi);

console.log(`\n═══ RESULTS: ${pass} passed, ${fail} failed ═══\n`);
if (fail > 0) process.exit(1);

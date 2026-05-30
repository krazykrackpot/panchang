/**
 * Compute Lajjitadi states for a curated set of reference charts.
 * Output is the artifact for manual cross-check against JHora (or other
 * trusted desktop Jyotish software) before merging the 2026-05-30
 * classical-alignment PR.
 *
 * Run: npx tsx scripts/lajjitadi-crosscheck.ts
 *
 * Spec: docs/superpowers/specs/2026-05-30-jyotish-classical-alignment.md
 */

import { generateKundali } from '@/lib/ephem/kundali-calc';
import { calculateAvasthas } from '@/lib/kundali/avasthas';

// Birth times verified against independent Vedic astrology references
// (Lagna360, AstroSage). All planetary positions match to sub-degree
// precision at these times. See spec §4.1 for the cross-check table.
const charts = [
  { name: 'Albert Einstein', date: '1879-03-14', time: '11:30', place: 'Ulm',        lat: 48.3974, lng: 9.9934,  timezone: 'Europe/Berlin' },
  { name: 'Charles Darwin',  date: '1809-02-12', time: '03:00', place: 'Shrewsbury', lat: 52.7077, lng: -2.7530, timezone: 'Europe/London' },
  { name: 'Mahatma Gandhi',  date: '1869-10-02', time: '08:36', place: 'Porbandar',  lat: 21.6417, lng: 69.6293, timezone: 'Asia/Kolkata' },
];

const planetName = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

for (const c of charts) {
  console.log(`\n=== ${c.name} (${c.date} ${c.time} ${c.place}) ===`);
  const k = generateKundali({
    name: c.name,
    date: c.date,
    time: c.time,
    place: c.place,
    lat: c.lat,
    lng: c.lng,
    timezone: c.timezone,
    ayanamsha: 'lahiri',
  });
  console.log(`Ascendant: sign ${k.ascendant.sign}`);
  const av = calculateAvasthas(k.planets);
  for (const planet of k.planets.filter((x) => x.planet.id < 9)) {
    const a = av.find((x) => x.planetId === planet.planet.id);
    const pos = `sign ${String(planet.sign).padStart(2)} house ${String(planet.house).padStart(2)}`;
    console.log(`  ${planetName[planet.planet.id].padEnd(8)} ${pos}  Lajjitadi: ${a?.lajjitadi.state}`);
  }
}

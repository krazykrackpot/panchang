/**
 * Eclipse Calendar Engine
 *
 * Computes eclipses from first principles:
 * 1. Find all New Moons (Amavasya, tithi #30) and Full Moons (Purnima, tithi #15)
 *    from the tithi table — exact conjunction/opposition times.
 * 2. At each lunation, compute Moon's ecliptic latitude via Swiss Ephemeris.
 * 3. Use latitude to determine if an eclipse occurs and its type.
 *
 * The Moon's latitude at conjunction/opposition is the key:
 * - At a node (Rahu/Ketu), latitude = 0° → deepest eclipse
 * - Away from node, latitude grows → shallower or no eclipse
 *
 * Eclipse limits (angular thresholds based on Sun/Moon/shadow radii):
 *
 * SOLAR ECLIPSE (at New Moon):
 *   |Moon lat| < ~0.95°  → Central eclipse (total or annular)
 *   |Moon lat| < ~1.55°  → Partial solar eclipse
 *   |Moon lat| > ~1.55°  → No eclipse
 *
 * LUNAR ECLIPSE (at Full Moon):
 *   |Moon lat| < ~0.42°  → Total lunar eclipse
 *   |Moon lat| < ~1.02°  → Partial lunar eclipse
 *   |Moon lat| < ~1.58°  → Penumbral lunar eclipse
 *   |Moon lat| > ~1.58°  → No eclipse
 *
 * These thresholds account for average Sun radius (~0.267°),
 * Moon radius (~0.259°), umbral shadow radius (~0.72°),
 * and penumbral shadow radius (~1.28°) at Moon's distance.
 */

import { getPlanetaryPositions, sunLongitude, moonLongitude, normalizeDeg } from '@/lib/ephem/astronomical';
import { buildYearlyTithiTable, lookupAllTithiByNumber, type TithiEntry } from './tithi-table';
import { getEclipsesForYear } from './eclipse-data';
import type { Trilingual } from '@/types/panchang';

export interface EclipseEvent {
  type: 'solar' | 'lunar';
  typeName: Trilingual;
  date: string;
  magnitude: 'total' | 'partial' | 'annular' | 'penumbral';
  magnitudeName: Trilingual;
  description: Trilingual;
}

const ECLIPSE_TYPE_NAMES = {
  solar: { en: 'Solar Eclipse', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्' },
  lunar: { en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्' },
};

const MAG_NAMES: Record<string, Trilingual> = {
  total: { en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' },
  partial: { en: 'Partial', hi: 'आंशिक', sa: 'आंशिकम्' },
  annular: { en: 'Annular', hi: 'वलयाकार', sa: 'वलयाकारम्' },
  penumbral: { en: 'Penumbral', hi: 'उपच्छाया', sa: 'उपच्छायाकम्' },
};

/** Convert JD to YYYY-MM-DD (UTC) */
function jdToUtcDate(jd: number): string {
  const J = Math.floor(jd + 0.5);
  let l = J + 68569;
  const n = Math.floor(4 * l / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor(4000 * (l + 1) / 1461001);
  l = l - Math.floor(1461 * i / 4) + 31;
  const j = Math.floor(80 * l / 2447);
  const day = l - Math.floor(2447 * j / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const yr = 100 * (n - 49) + i + l;
  return `${yr}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function generateEclipseCalendar(year: number): EclipseEvent[] {
  const eclipses: EclipseEvent[] = [];

  // Build tithi table — gives us every Amavasya and Purnima with exact JD
  const table = buildYearlyTithiTable(year, 0, 0, 'UTC');
  const newMoons: TithiEntry[] = lookupAllTithiByNumber(table, 30); // Amavasya
  const fullMoons: TithiEntry[] = lookupAllTithiByNumber(table, 15); // Purnima

  // ── Solar eclipses: check Moon's latitude at each New Moon ──
  for (const nm of newMoons) {
    const jd = (nm.startJd + nm.endJd) / 2; // Conjunction midpoint
    const positions = getPlanetaryPositions(jd);
    const moonPos = positions.find(p => p.id === 1); // Moon = id 1
    if (!moonPos) continue;

    const moonLat = Math.abs(moonPos.latitude);
    const moonSpeed = Math.abs(moonPos.speed);

    // Solar eclipse limits scale with Moon's apparent size (speed proxy)
    // Moon+Sun combined radius: ~0.53° average. Partial limit: ~1.55° average.
    const speedFactor = moonSpeed / 13.2;
    // Widen by 0.15° for ephemeris precision
    const solarPartialLimit = 1.25 * speedFactor + 0.26 + 0.15; // ~1.66° average — generous
    const solarCentralLimit = 0.53 * speedFactor + 0.26 + 0.10; // ~0.89° average

    if (moonLat < solarPartialLimit) {
      let magnitude: EclipseEvent['magnitude'];
      if (moonLat < solarCentralLimit) {
        // Central eclipse — total vs annular depends on Moon's apparent size vs Sun's
        // Faster Moon = closer = larger apparent size = total
        // Average speed ~13.2°/day: above → likely total, below → likely annular
        magnitude = moonSpeed > 13.0 ? 'total' : 'annular';
      } else {
        magnitude = 'partial';
      }

      const date = jdToUtcDate(jd);
      if (!date.startsWith(String(year))) continue;

      eclipses.push({
        type: 'solar',
        typeName: ECLIPSE_TYPE_NAMES.solar,
        date,
        magnitude,
        magnitudeName: MAG_NAMES[magnitude],
        description: {
          en: `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} Solar Eclipse — Sun and Moon conjoin near the Rahu-Ketu axis.`,
          hi: `${MAG_NAMES[magnitude].hi} सूर्य ग्रहण — सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट युति करते हैं।`,
          sa: `${MAG_NAMES[magnitude].sa} सूर्यग्रहणम् — सूर्यचन्द्रौ राहुकेत्वक्षसमीपे युज्येते।`,
        },
      });
    }
  }

  // ── Lunar eclipses: check Moon's latitude at each Full Moon ──
  // Eclipse limits depend on Moon's distance (affects shadow size).
  // Moon's speed is a proxy for distance: faster = closer = larger shadow.
  // Average Moon speed: ~13.2°/day. Range: ~11.8° (apogee) to ~14.5° (perigee).
  for (const fm of fullMoons) {
    const jd = (fm.startJd + fm.endJd) / 2;
    const positions = getPlanetaryPositions(jd);
    const moonPos = positions.find(p => p.id === 1);
    if (!moonPos) continue;

    const moonLat = Math.abs(moonPos.latitude);
    const moonSpeed = Math.abs(moonPos.speed);

    // Scale thresholds by Moon's speed (proxy for distance/shadow size)
    // Widen by 0.15° to account for ephemeris precision limits (~0.1° error)
    const speedFactor = moonSpeed / 13.2;
    const penLimit = 1.28 * speedFactor + 0.26 + 0.15;   // ~1.69° average — generous to never miss
    const partialLimit = 0.72 * speedFactor + 0.26 + 0.10; // ~1.08° average
    const totalLimit = 0.72 * speedFactor - 0.26 + 0.10;  // ~0.56° average

    if (moonLat < penLimit) {
      let magnitude: EclipseEvent['magnitude'];
      if (moonLat < totalLimit) {
        magnitude = 'total';
      } else if (moonLat < partialLimit) {
        magnitude = 'partial';
      } else {
        magnitude = 'penumbral';
      }

      const date = jdToUtcDate(jd);
      if (!date.startsWith(String(year))) continue;

      eclipses.push({
        type: 'lunar',
        typeName: ECLIPSE_TYPE_NAMES.lunar,
        date,
        magnitude,
        magnitudeName: MAG_NAMES[magnitude],
        description: {
          en: `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} Lunar Eclipse — Full Moon passes through Earth's shadow near the nodal axis.`,
          hi: `${MAG_NAMES[magnitude].hi} चन्द्र ग्रहण — पूर्णिमा का चन्द्रमा पृथ्वी की छाया से गुजरता है।`,
          sa: `${MAG_NAMES[magnitude].sa} चन्द्रग्रहणम् — पूर्णिमायां चन्द्रः पृथिव्याः छायायां प्रविशति।`,
        },
      });
    }
  }

  eclipses.sort((a, b) => a.date.localeCompare(b.date));

  // ── Validation against pre-computed table (2024-2035) ──
  // The engine uses generous thresholds to never miss an eclipse, which can produce
  // false positives at the margins (~0.1° ephemeris precision limit). When the
  // pre-computed table exists for this year, cross-validate:
  // - Keep engine eclipses that match a table entry (±1 day, same type)
  // - Keep engine eclipses with no table coverage (engine-only years)
  // - Remove engine eclipses that the table explicitly does NOT list (false positive)
  // Also add any table eclipses the engine missed (catches edge cases on tight thresholds).
  const tableData = getEclipsesForYear(year);
  if (tableData.length > 0) {
    const validated: EclipseEvent[] = [];

    // Keep engine eclipses that match the table
    for (const e of eclipses) {
      const match = tableData.find(t => {
        if (t.date === e.date && t.kind === e.type) return true;
        const d1 = new Date(t.date + 'T00:00:00Z').getTime();
        const d2 = new Date(e.date + 'T00:00:00Z').getTime();
        return Math.abs(d1 - d2) <= 86400000 && t.kind === e.type;
      });
      if (match) validated.push(e);
    }

    // Add any table eclipses the engine missed
    for (const t of tableData) {
      const found = validated.find(e => {
        if (e.date === t.date && e.type === t.kind) return true;
        const d1 = new Date(t.date + 'T00:00:00Z').getTime();
        const d2 = new Date(e.date + 'T00:00:00Z').getTime();
        return Math.abs(d1 - d2) <= 86400000 && e.type === t.kind;
      });
      if (!found) {
        const mag = t.type === 'hybrid' ? 'total' : t.type;
        validated.push({
          type: t.kind,
          typeName: ECLIPSE_TYPE_NAMES[t.kind],
          date: t.date,
          magnitude: mag as EclipseEvent['magnitude'],
          magnitudeName: MAG_NAMES[mag] || MAG_NAMES.partial,
          description: t.kind === 'solar' ? {
            en: `${(MAG_NAMES[mag]?.en || mag).charAt(0).toUpperCase() + (MAG_NAMES[mag]?.en || mag).slice(1)} Solar Eclipse — Sun and Moon conjoin near the Rahu-Ketu axis.`,
            hi: `${MAG_NAMES[mag]?.hi || mag} सूर्य ग्रहण — सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट युति करते हैं।`,
            sa: `${MAG_NAMES[mag]?.sa || mag} सूर्यग्रहणम् — सूर्यचन्द्रौ राहुकेत्वक्षसमीपे युज्येते।`,
          } : {
            en: `${(MAG_NAMES[mag]?.en || mag).charAt(0).toUpperCase() + (MAG_NAMES[mag]?.en || mag).slice(1)} Lunar Eclipse — Full Moon passes through Earth's shadow near the nodal axis.`,
            hi: `${MAG_NAMES[mag]?.hi || mag} चन्द्र ग्रहण — पूर्णिमा का चन्द्रमा पृथ्वी की छाया से गुजरता है।`,
            sa: `${MAG_NAMES[mag]?.sa || mag} चन्द्रग्रहणम् — पूर्णिमायां चन्द्रः पृथिव्याः छायायां प्रविशति।`,
          },
        });
      }
    }

    validated.sort((a, b) => a.date.localeCompare(b.date));
    return validated;
  }

  return eclipses;
}

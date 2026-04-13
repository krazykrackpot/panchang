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

import { getPlanetaryPositions, sunLongitude, moonLongitude, normalizeDeg, dateToJD, toSidereal } from '@/lib/ephem/astronomical';
import { buildYearlyTithiTable, lookupAllTithiByNumber, type TithiEntry } from './tithi-table';
import { getEclipsesForYear } from './eclipse-data';
import type { LocaleText,} from '@/types/panchang';

export interface EclipseEvent {
  type: 'solar' | 'lunar';
  typeName: LocaleText;
  date: string;
  magnitude: 'total' | 'partial' | 'annular' | 'penumbral';
  magnitudeName: LocaleText;
  description: LocaleText;
  node: 'rahu' | 'ketu';     // Which node the eclipse occurs at
  nodeName: LocaleText;       // Localized node name
  eclipseLongitude: number;   // Sidereal longitude of the eclipse point (Sun for solar, Moon for lunar)
}

const ECLIPSE_TYPE_NAMES = {
  solar: { en: 'Solar Eclipse', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्' },
  lunar: { en: 'Lunar Eclipse', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्' },
};

const NODE_NAMES = {
  rahu: { en: 'Rahu (☊ Ascending Node)', hi: 'राहु (☊ आरोही पात)', sa: 'राहुः (☊)' },
  ketu: { en: 'Ketu (☋ Descending Node)', hi: 'केतु (☋ अवरोही पात)', sa: 'केतुः (☋)' },
};

const MAG_NAMES: Record<string, LocaleText> = {
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
        magnitude = moonSpeed > 13.0 ? 'total' : 'annular';
      } else {
        magnitude = 'partial';
      }

      // Determine which node: compare Sun/Moon longitude to Rahu/Ketu
      const rahuPos = positions.find(p => p.id === 7);
      const rahuLon = rahuPos?.longitude ?? 0;
      const ketuLon = normalizeDeg(rahuLon + 180);
      const sunL = sunLongitude(jd);
      let distRahu = Math.abs(normalizeDeg(sunL - rahuLon));
      if (distRahu > 180) distRahu = 360 - distRahu;
      let distKetu = Math.abs(normalizeDeg(sunL - ketuLon));
      if (distKetu > 180) distKetu = 360 - distKetu;
      const node: 'rahu' | 'ketu' = distRahu < distKetu ? 'rahu' : 'ketu';
      const nodeLabel = node === 'rahu' ? 'Rahu (☊)' : 'Ketu (☋)';
      const nodeLabelHi = node === 'rahu' ? 'राहु (☊)' : 'केतु (☋)';

      const date = jdToUtcDate(jd);
      if (!date.startsWith(String(year))) continue;

      eclipses.push({
        type: 'solar',
        typeName: ECLIPSE_TYPE_NAMES.solar,
        date,
        magnitude,
        magnitudeName: MAG_NAMES[magnitude],
        node,
        nodeName: NODE_NAMES[node],
        eclipseLongitude: toSidereal(sunL, jd), // Sidereal Sun longitude at eclipse
        description: {
          en: `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} Solar Eclipse at ${nodeLabel} — Sun and Moon conjoin at the ${node === 'rahu' ? 'ascending' : 'descending'} node.`,
          hi: `${MAG_NAMES[magnitude].hi} सूर्य ग्रहण ${nodeLabelHi} पर — सूर्य और चन्द्रमा ${node === 'rahu' ? 'आरोही' : 'अवरोही'} पात पर युति करते हैं।`,
          sa: `${MAG_NAMES[magnitude].sa} सूर्यग्रहणम् — सूर्यचन्द्रौ ${node === 'rahu' ? 'राहौ' : 'केतौ'} युज्येते।`,
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

      // Determine which node: compare Moon longitude to Rahu/Ketu
      const rahuPos = positions.find(p => p.id === 7);
      const rahuLon = rahuPos?.longitude ?? 0;
      const ketuLon = normalizeDeg(rahuLon + 180);
      const moonLon = moonLongitude(jd);
      let distRahu = Math.abs(normalizeDeg(moonLon - rahuLon));
      if (distRahu > 180) distRahu = 360 - distRahu;
      let distKetu = Math.abs(normalizeDeg(moonLon - ketuLon));
      if (distKetu > 180) distKetu = 360 - distKetu;
      const node: 'rahu' | 'ketu' = distRahu < distKetu ? 'rahu' : 'ketu';
      const nodeLabel = node === 'rahu' ? 'Rahu (☊)' : 'Ketu (☋)';
      const nodeLabelHi = node === 'rahu' ? 'राहु (☊)' : 'केतु (☋)';

      const date = jdToUtcDate(jd);
      if (!date.startsWith(String(year))) continue;

      eclipses.push({
        type: 'lunar',
        typeName: ECLIPSE_TYPE_NAMES.lunar,
        date,
        magnitude,
        magnitudeName: MAG_NAMES[magnitude],
        node,
        nodeName: NODE_NAMES[node],
        eclipseLongitude: toSidereal(moonLon, jd), // Sidereal Moon longitude at eclipse
        description: {
          en: `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} Lunar Eclipse at ${nodeLabel} — Full Moon passes through Earth's shadow at the ${node === 'rahu' ? 'ascending' : 'descending'} node.`,
          hi: `${MAG_NAMES[magnitude].hi} चन्द्र ग्रहण ${nodeLabelHi} पर — पूर्णिमा का चन्द्रमा ${node === 'rahu' ? 'आरोही' : 'अवरोही'} पात पर पृथ्वी की छाया से गुजरता है।`,
          sa: `${MAG_NAMES[magnitude].sa} चन्द्रग्रहणम् — पूर्णिमायां चन्द्रः ${node === 'rahu' ? 'राहौ' : 'केतौ'} पृथिव्याः छायायां प्रविशति।`,
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
        // Compute node for table-only eclipses
        const [ty, tm, td] = t.date.split('-').map(Number);
        const tJd = dateToJD(ty, tm, td, 12);
        const tPositions = getPlanetaryPositions(tJd);
        const tRahuLon = tPositions.find(p => p.id === 7)?.longitude ?? 0;
        const tKetuLon = normalizeDeg(tRahuLon + 180);
        const tBodyLon = t.kind === 'solar' ? sunLongitude(tJd) : moonLongitude(tJd);
        let tDistR = Math.abs(normalizeDeg(tBodyLon - tRahuLon));
        if (tDistR > 180) tDistR = 360 - tDistR;
        let tDistK = Math.abs(normalizeDeg(tBodyLon - tKetuLon));
        if (tDistK > 180) tDistK = 360 - tDistK;
        const tNode: 'rahu' | 'ketu' = tDistR < tDistK ? 'rahu' : 'ketu';

        validated.push({
          type: t.kind,
          typeName: ECLIPSE_TYPE_NAMES[t.kind],
          date: t.date,
          magnitude: mag as EclipseEvent['magnitude'],
          magnitudeName: MAG_NAMES[mag] || MAG_NAMES.partial,
          node: tNode,
          nodeName: NODE_NAMES[tNode],
          eclipseLongitude: toSidereal(tBodyLon, tJd),
          description: t.kind === 'solar' ? {
            en: `${(MAG_NAMES[mag]?.en || mag).charAt(0).toUpperCase() + (MAG_NAMES[mag]?.en || mag).slice(1)} Solar Eclipse at ${tNode === 'rahu' ? 'Rahu (☊)' : 'Ketu (☋)'}.`,
            hi: `${MAG_NAMES[mag]?.hi || mag} सूर्य ग्रहण ${tNode === 'rahu' ? 'राहु (☊)' : 'केतु (☋)'} पर।`,
            sa: `${MAG_NAMES[mag]?.sa || mag} सूर्यग्रहणम् ${tNode === 'rahu' ? 'राहौ' : 'केतौ'}।`,
          } : {
            en: `${(MAG_NAMES[mag]?.en || mag).charAt(0).toUpperCase() + (MAG_NAMES[mag]?.en || mag).slice(1)} Lunar Eclipse at ${tNode === 'rahu' ? 'Rahu (☊)' : 'Ketu (☋)'}.`,
            hi: `${MAG_NAMES[mag]?.hi || mag} चन्द्र ग्रहण ${tNode === 'rahu' ? 'राहु (☊)' : 'केतु (☋)'} पर।`,
            sa: `${MAG_NAMES[mag]?.sa || mag} चन्द्रग्रहणम् ${tNode === 'rahu' ? 'राहौ' : 'केतौ'}।`,
          },
        });
      }
    }

    validated.sort((a, b) => a.date.localeCompare(b.date));
    return validated;
  }

  return eclipses;
}

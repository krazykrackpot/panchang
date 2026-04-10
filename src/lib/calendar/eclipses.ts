/**
 * Eclipse Calendar Engine
 *
 * Detects solar and lunar eclipses using the tithi table:
 * - Amavasya (tithi #30) = New Moon → solar eclipse candidate
 * - Purnima (tithi #15) = Full Moon → lunar eclipse candidate
 *
 * Then checks proximity to the Rahu-Ketu axis (lunar nodes) to confirm.
 * No separate lunation scanning needed — we already compute exact tithi times.
 */

import { dateToJD, getPlanetaryPositions, sunLongitude, moonLongitude, normalizeDeg } from '@/lib/ephem/astronomical';
import { buildYearlyTithiTable, lookupAllTithiByNumber, type TithiEntry } from './tithi-table';
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

export function generateEclipseCalendar(year: number): EclipseEvent[] {
  const eclipses: EclipseEvent[] = [];

  // Build tithi table for the year — gives us every tithi with exact JD
  // Use a reference location (0°, 0°) since we only need the JD timing, not local times
  const table = buildYearlyTithiTable(year, 0, 0, 'UTC');

  // Amavasya = tithi #30 = New Moon → solar eclipse candidates
  // Purnima = tithi #15 = Full Moon → lunar eclipse candidates
  const newMoons: TithiEntry[] = lookupAllTithiByNumber(table, 30);
  const fullMoons: TithiEntry[] = lookupAllTithiByNumber(table, 15);

  /** Convert JD to YYYY-MM-DD using UTC date */
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

  /** Minimum angular distance from either Rahu or Ketu */
  function distFromNodes(longitude: number, rahuLong: number): number {
    const ketuLong = normalizeDeg(rahuLong + 180);
    let dR = Math.abs(normalizeDeg(longitude - rahuLong));
    if (dR > 180) dR = 360 - dR;
    let dK = Math.abs(normalizeDeg(longitude - ketuLong));
    if (dK > 180) dK = 360 - dK;
    return Math.min(dR, dK);
  }

  // Check each New Moon for solar eclipse (Sun near Rahu OR Ketu)
  for (const nm of newMoons) {
    const jd = (nm.startJd + nm.endJd) / 2;
    const positions = getPlanetaryPositions(jd);
    const rahuLong = positions[7].longitude;
    const sunL = sunLongitude(jd);
    const distToNode = distFromNodes(sunL, rahuLong);

    if (distToNode < 18) {
      // Solar eclipse magnitude thresholds (calibrated against NASA data):
      // < 4° = total or annular (central eclipse)
      // 4-10° = partial (but can still be annular/total if gamma is small)
      // 10-18° = partial (small magnitude)
      const magnitude: EclipseEvent['magnitude'] =
        distToNode < 4 ? 'total' :
        distToNode < 10 ? 'annular' : 'partial';

      // Use JD-derived UTC date (not sunrise date which is location-dependent)
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

  // Check each Full Moon for lunar eclipse (Moon near Rahu OR Ketu)
  for (const fm of fullMoons) {
    const jd = (fm.startJd + fm.endJd) / 2;
    const positions = getPlanetaryPositions(jd);
    const rahuLong = positions[7].longitude;

    // Use actual Moon longitude, not Sun+180 approximation
    const moonL = moonLongitude(jd);
    const distToNode = distFromNodes(moonL, rahuLong);

    if (distToNode < 16) {
      // Lunar eclipse thresholds (widened to catch all penumbrals):
      // < 3° = total (Moon fully in umbra)
      // 3-5.5° = partial (Moon partially in umbra)
      // 5.5-16° = penumbral (Moon in penumbral shadow only)
      const magnitude: EclipseEvent['magnitude'] =
        distToNode < 3 ? 'total' :
        distToNode < 5.5 ? 'partial' : 'penumbral';

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

  // Sort by date
  eclipses.sort((a, b) => a.date.localeCompare(b.date));

  return eclipses;
}

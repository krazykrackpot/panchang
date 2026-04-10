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

import { getPlanetaryPositions, sunLongitude, normalizeDeg } from '@/lib/ephem/astronomical';
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

  // Check each New Moon for solar eclipse (Sun near Rahu OR Ketu)
  for (const nm of newMoons) {
    // Use the midpoint JD of the Amavasya tithi as the conjunction time
    const jd = (nm.startJd + nm.endJd) / 2;
    const positions = getPlanetaryPositions(jd);
    const rahuLong = positions[7].longitude; // Rahu (mean ascending node)
    const ketuLong = normalizeDeg(rahuLong + 180); // Ketu = Rahu + 180°
    const sunL = sunLongitude(jd);

    // Check distance from BOTH nodes — eclipse occurs near either
    let distToRahu = Math.abs(normalizeDeg(sunL - rahuLong));
    if (distToRahu > 180) distToRahu = 360 - distToRahu;
    let distToKetu = Math.abs(normalizeDeg(sunL - ketuLong));
    if (distToKetu > 180) distToKetu = 360 - distToKetu;
    const distToNode = Math.min(distToRahu, distToKetu);

    if (distToNode < 18) {
      // Eclipse likely — determine magnitude from node distance
      const magnitude: EclipseEvent['magnitude'] =
        distToNode < 5 ? 'total' :
        distToNode < 9 ? 'annular' : 'partial';

      eclipses.push({
        type: 'solar',
        typeName: ECLIPSE_TYPE_NAMES.solar,
        date: nm.sunriseDate, // Use the sunrise date of this Amavasya
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
    const ketuLong = normalizeDeg(rahuLong + 180);

    // Moon is opposite Sun at Full Moon
    const moonL = normalizeDeg(sunLongitude(jd) + 180);

    // Check distance from BOTH nodes
    let distToRahu = Math.abs(normalizeDeg(moonL - rahuLong));
    if (distToRahu > 180) distToRahu = 360 - distToRahu;
    let distToKetu = Math.abs(normalizeDeg(moonL - ketuLong));
    if (distToKetu > 180) distToKetu = 360 - distToKetu;
    const distToNode = Math.min(distToRahu, distToKetu);

    if (distToNode < 12) {
      const magnitude: EclipseEvent['magnitude'] =
        distToNode < 5 ? 'total' :
        distToNode < 9 ? 'partial' : 'penumbral';

      eclipses.push({
        type: 'lunar',
        typeName: ECLIPSE_TYPE_NAMES.lunar,
        date: fm.sunriseDate,
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

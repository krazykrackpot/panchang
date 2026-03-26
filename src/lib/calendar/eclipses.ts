/**
 * Eclipse Calendar Engine
 * Detects solar and lunar eclipses by checking New/Full Moon proximity to nodes
 */

import { dateToJD, getPlanetaryPositions, sunLongitude, moonLongitude, normalizeDeg } from '@/lib/ephem/astronomical';
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

function jdToDateStr(jd: number): string {
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
  const year = 100 * (n - 49) + i + l;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Find approximate New Moon and Full Moon dates in a year
 * New Moon: Sun-Moon elongation ≈ 0°
 * Full Moon: Sun-Moon elongation ≈ 180°
 */
function findLunations(year: number): Array<{ jd: number; type: 'new' | 'full' }> {
  const lunations: Array<{ jd: number; type: 'new' | 'full' }> = [];
  const startJD = dateToJD(year, 1, 1, 0);
  const endJD = dateToJD(year, 12, 31, 23);

  let prevElong = 0;
  for (let jd = startJD; jd <= endJD; jd += 0.5) {
    const sunL = sunLongitude(jd);
    const moonL = moonLongitude(jd);
    let elong = normalizeDeg(moonL - sunL);

    // Detect New Moon (elongation crosses 0/360)
    if (prevElong > 300 && elong < 60) {
      // Refine with binary search
      let lo = jd - 0.5, hi = jd;
      for (let iter = 0; iter < 20; iter++) {
        const mid = (lo + hi) / 2;
        const e = normalizeDeg(moonLongitude(mid) - sunLongitude(mid));
        if (e > 180) lo = mid; else hi = mid;
      }
      lunations.push({ jd: (lo + hi) / 2, type: 'new' });
    }

    // Detect Full Moon (elongation crosses 180)
    if (prevElong < 180 && elong >= 180 && prevElong > 90) {
      let lo = jd - 0.5, hi = jd;
      for (let iter = 0; iter < 20; iter++) {
        const mid = (lo + hi) / 2;
        const e = normalizeDeg(moonLongitude(mid) - sunLongitude(mid));
        if (e < 180) lo = mid; else hi = mid;
      }
      lunations.push({ jd: (lo + hi) / 2, type: 'full' });
    }

    prevElong = elong;
  }
  return lunations;
}

export function generateEclipseCalendar(year: number): EclipseEvent[] {
  const eclipses: EclipseEvent[] = [];
  const lunations = findLunations(year);

  for (const lun of lunations) {
    const positions = getPlanetaryPositions(lun.jd);
    const rahuLong = positions[7].longitude; // Rahu (mean node)

    if (lun.type === 'new') {
      // Solar eclipse: New Moon near node
      const sunL = sunLongitude(lun.jd);
      let distToNode = Math.abs(normalizeDeg(sunL - rahuLong));
      if (distToNode > 180) distToNode = 360 - distToNode;

      if (distToNode < 18) {
        // Eclipse likely
        const magnitude = distToNode < 9 ? (distToNode < 5 ? 'total' : 'annular') : 'partial';
        eclipses.push({
          type: 'solar',
          typeName: ECLIPSE_TYPE_NAMES.solar,
          date: jdToDateStr(lun.jd),
          magnitude,
          magnitudeName: MAG_NAMES[magnitude],
          description: {
            en: `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} Solar Eclipse — Sun and Moon conjoin near the Rahu-Ketu axis. Grahan Kaal applies; avoid auspicious activities.`,
            hi: `${MAG_NAMES[magnitude].hi} सूर्य ग्रहण — सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट युति करते हैं। ग्रहण काल लागू; शुभ कार्यों से बचें।`,
            sa: `${MAG_NAMES[magnitude].sa} सूर्यग्रहणम् — सूर्यचन्द्रौ राहुकेत्वक्षसमीपे युज्येते। ग्रहणकालः प्रवर्तते; शुभकार्याणि वर्जयेत्।`,
          },
        });
      }
    } else {
      // Lunar eclipse: Full Moon near node
      const moonL = moonLongitude(lun.jd);
      let distToNode = Math.abs(normalizeDeg(moonL - rahuLong));
      if (distToNode > 180) distToNode = 360 - distToNode;

      if (distToNode < 12) {
        const magnitude = distToNode < 5 ? 'total' : distToNode < 9 ? 'partial' : 'penumbral';
        eclipses.push({
          type: 'lunar',
          typeName: ECLIPSE_TYPE_NAMES.lunar,
          date: jdToDateStr(lun.jd),
          magnitude,
          magnitudeName: MAG_NAMES[magnitude],
          description: {
            en: `${magnitude.charAt(0).toUpperCase() + magnitude.slice(1)} Lunar Eclipse — Full Moon passes through Earth's shadow near the nodal axis. Sutak period observed.`,
            hi: `${MAG_NAMES[magnitude].hi} चन्द्र ग्रहण — पूर्णिमा का चन्द्रमा पृथ्वी की छाया से गुजरता है। सूतक काल पालनीय।`,
            sa: `${MAG_NAMES[magnitude].sa} चन्द्रग्रहणम् — पूर्णिमायां चन्द्रः पृथिव्याः छायायां प्रविशति। सूतककालः पालनीयः।`,
          },
        });
      }
    }
  }

  return eclipses;
}

/**
 * Special Lagnas — Hora, Ghati, Sree, Indu, Pranapada, Varnada
 * Reference: BPHS Ch.4-5, Jaimini Sutras
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';

export interface SpecialLagnas {
  horaLagna: number;      // sign 1-12
  ghatiLagna: number;     // sign 1-12
  sreeLagna: number;      // sign 1-12
  induLagna: number;      // sign 1-12
  pranapada: number;      // sign 1-12
  varnadaLagna: number;   // sign 1-12
}

// Sign lord mapping
const SIGN_LORD: Record<number, number> = { 1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4 };

// Indu Lagna weightages for each planet (BPHS values)
const INDU_WEIGHTS: Record<number, number> = { 0:30, 1:16, 2:6, 3:8, 4:10, 5:12, 6:1 };

/**
 * Calculate all 6 special lagnas
 * @param ascDeg - Sidereal ascendant degree (0-360)
 * @param sunDeg - Sidereal Sun longitude
 * @param moonDeg - Sidereal Moon longitude
 * @param sunriseUT - UT decimal hours of sunrise
 * @param birthTimeUT - UT decimal hours of birth
 * @param ascSign - Ascendant sign (1-12)
 */
export function calculateSpecialLagnas(
  ascDeg: number,
  sunDeg: number,
  moonDeg: number,
  sunriseUT: number,
  birthTimeUT: number,
  ascSign: number,
): SpecialLagnas {
  const hoursFromSunrise = ((birthTimeUT - sunriseUT) + 24) % 24;

  // ── Hora Lagna (HL) ──
  // Each sign rises for ~2.5 hours (based on equatorial calculation)
  // HL = Sun's degree at sunrise + (hours from sunrise * 360/24)
  const horaLagnaDeg = normalizeDeg(sunDeg + hoursFromSunrise * (360 / 24));
  const horaLagna = Math.floor(horaLagnaDeg / 30) + 1;

  // ── Ghati Lagna (GL) ──
  // GL = Sun's degree + (ghatis from sunrise * 360/60)
  // 1 ghati = 24 min, so hours * 2.5 = ghatis
  const ghatis = hoursFromSunrise * 2.5;
  const ghatiLagnaDeg = normalizeDeg(sunDeg + ghatis * (360 / 60));
  const ghatiLagna = Math.floor(ghatiLagnaDeg / 30) + 1;

  // ── Sree Lagna (SL) ──
  // SL = Moon + (Lagna - Sun), all sidereal
  const sreeLagnaDeg = normalizeDeg(moonDeg + (ascDeg - sunDeg));
  const sreeLagna = Math.floor(sreeLagnaDeg / 30) + 1;

  // ── Indu Lagna (IL) ──
  // Step 1: Find 9th lord from Lagna and 9th lord from Moon
  const lagnaSign9 = ((ascSign - 1 + 8) % 12) + 1; // 9th sign from lagna
  const moonSign = Math.floor(moonDeg / 30) + 1;
  const moonSign9 = ((moonSign - 1 + 8) % 12) + 1; // 9th sign from Moon
  const lord9Lagna = SIGN_LORD[lagnaSign9];
  const lord9Moon = SIGN_LORD[moonSign9];
  // Step 2: Sum of weights
  const induSum = (INDU_WEIGHTS[lord9Lagna] || 0) + (INDU_WEIGHTS[lord9Moon] || 0);
  // Step 3: Remainder mod 12 → count from Moon
  const induOffset = induSum % 12;
  const induLagnaSign = ((moonSign - 1 + induOffset) % 12) + 1;

  // ── Pranapada Lagna (PP) ──
  // Based on birth time in vighatis from sunrise
  // Vighatis = hours * 150 (60 ghatis * 2.5 vighatis per ghati)
  const vighatis = hoursFromSunrise * 150;
  const ppDeg = normalizeDeg(sunDeg + vighatis * (360 / 3600));
  const pranapada = Math.floor(ppDeg / 30) + 1;

  // ── Varnada Lagna (VL) ──
  // If lagna is odd sign: VL = Aries + (Lagna count - Hora Lagna count)
  // If lagna is even sign: VL = Pisces - (Lagna count - Hora Lagna count)
  const lagnaCount = ascSign;
  const horaCount = horaLagna;
  let varnadaSign: number;
  if (ascSign % 2 === 1) {
    // Odd lagna: count from Aries
    const diff = ((lagnaCount - horaCount + 12) % 12);
    varnadaSign = ((diff) % 12) + 1;
  } else {
    // Even lagna: count from Pisces in reverse
    const diff = ((lagnaCount - horaCount + 12) % 12);
    varnadaSign = ((12 - diff) % 12) + 1;
  }
  if (varnadaSign === 0) varnadaSign = 12;

  return {
    horaLagna,
    ghatiLagna,
    sreeLagna,
    induLagna: induLagnaSign,
    pranapada,
    varnadaLagna: varnadaSign,
  };
}

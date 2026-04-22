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
  // GL = Sun's sidereal degree + (ghatis from sunrise × 30°)
  //
  // BPHS Ch.4 specifies: "Ghati Lagna moves one Rashi (sign = 30°) per ghati."
  // 1 ghati = 24 minutes; 1 ghati → 1 sign = 30°.
  //
  // HISTORICAL BUG (now fixed): the formula used (360/60) = 6° per ghati,
  // which is the rate of the full zodiac completing in 60 ghatis — that is the
  // ascendant's rate for Hora Lagna, NOT Ghati Lagna.  Using 6°/ghati instead
  // of 30°/ghati produced a GL five times too slow, placing it in the wrong
  // sign in most charts.
  const ghatis = hoursFromSunrise * 2.5; // 1 hour = 2.5 ghatis
  const ghatiLagnaDeg = normalizeDeg(sunDeg + ghatis * 30);
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
  // BPHS Ch.4, v.28-29: convert birth time to vighatis, multiply by 0.1°/vighati,
  // then add offset based on Sun's sign type: movable=0°, fixed=240°, dual=120°.
  const vighatis = hoursFromSunrise * 150;
  const sunSignIdx = Math.floor(sunDeg / 30); // 0-based
  const sunSignQuality = sunSignIdx % 3; // 0=movable, 1=fixed, 2=dual
  const ppOffset = [0, 240, 120][sunSignQuality];
  const ppDeg = normalizeDeg(sunDeg + ppOffset + vighatis * (360 / 3600));
  const pranapada = Math.floor(ppDeg / 30) + 1;

  // ── Varnada Lagna (VL) ──
  // Per Jaimini Sutras / Sanjay Rath:
  // Lagna count: odd sign = sign number from Aries; even sign = (13 - sign number) from Pisces
  // Hora Lagna count: same rule based on HL's OWN sign parity
  // VL = |lagna_count - hora_count|, counted from Aries (odd lagna) or Pisces (even lagna)
  const lagnaCount = ascSign % 2 === 1 ? ascSign : (13 - ascSign);
  const horaCount = horaLagna % 2 === 1 ? horaLagna : (13 - horaLagna);
  const diff = Math.abs(lagnaCount - horaCount);
  let varnadaSign: number;
  if (ascSign % 2 === 1) {
    // Odd lagna: count forward from Aries
    varnadaSign = (diff % 12) + 1;
  } else {
    // Even lagna: count backward from Pisces
    varnadaSign = ((12 - (diff % 12)) % 12) + 1;
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

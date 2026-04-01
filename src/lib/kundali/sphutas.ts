/**
 * Sphuta Calculations — Sensitive Points
 * Computed degrees that indicate vitality, body, death timing, and benefic/malefic peaks.
 * Reference: BPHS Ch.10, Phaladeepika Ch.8
 */

import { normalizeDeg, getNakshatraNumber } from '@/lib/ephem/astronomical';

type Tri = { en: string; hi: string; sa: string };

export interface SphuataResults {
  pranaSphuta: { degree: number; sign: number; nakshatra: number; description: Tri };
  dehaSphuta: { degree: number; sign: number; nakshatra: number; description: Tri };
  mrityuSphuta: { degree: number; sign: number; nakshatra: number; description: Tri };
  triSphuta: { degree: number; sign: number; nakshatra: number; description: Tri };
  yogiPoint: { degree: number; sign: number; nakshatra: number; yogiPlanet: number; description: Tri };
  avayogiPoint: { degree: number; sign: number; nakshatra: number; avayogiPlanet: number; description: Tri };
  bijaSphuta?: { degree: number; sign: number }; // Male fertility (Sun+Venus+Jupiter)
  kshetraSphuta?: { degree: number; sign: number }; // Female fertility (Moon+Mars+Jupiter)
}

// Nakshatra lords for Yogi/Avayogi determination
const NAKSHATRA_LORDS = [
  8, 5, 0, 1, 2, 7, 4, 6, 3, // Ketu,Venus,Sun,Moon,Mars,Rahu,Jupiter,Saturn,Mercury
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  8, 5, 0, 1, 2, 7, 4, 6, 3,
];

/**
 * Calculate all Sphuta points from planetary longitudes
 * @param sunLong - Sidereal Sun longitude
 * @param moonLong - Sidereal Moon longitude
 * @param lagnaLong - Sidereal Ascendant longitude
 * @param jupiterLong - Sidereal Jupiter longitude (for Bija/Kshetra)
 * @param venusLong - Sidereal Venus longitude (for Bija)
 * @param marsLong - Sidereal Mars longitude (for Kshetra)
 */
export function calculateSphutas(
  sunLong: number,
  moonLong: number,
  lagnaLong: number,
  jupiterLong: number = 0,
  venusLong: number = 0,
  marsLong: number = 0,
): SphuataResults {
  // ── Prana Sphuta (Vitality Point) ──
  // = Lagna + Moon + Sun (all sidereal, divided to normalize)
  const pranaDeg = normalizeDeg(lagnaLong + moonLong + sunLong);
  const pranaSign = Math.floor(pranaDeg / 30) + 1;
  const pranaNak = getNakshatraNumber(pranaDeg);

  // ── Deha Sphuta (Body Point) ──
  // = (Moon × 8 + Lagna × 1) / 9 — some texts use different weights
  // Using BPHS variant: (Lagna + Sun + Moon) normalized
  const dehaDeg = normalizeDeg((moonLong * 8 + lagnaLong) / 9 * 12); // normalized
  const dehaSign = Math.floor(dehaDeg / 30) + 1;
  const dehaNak = getNakshatraNumber(dehaDeg);

  // ── Mrityu Sphuta (Death Point) ──
  // = (Moon × 8 + Lagna + Sun × 7) / 16 normalized
  const mrityuDeg = normalizeDeg((moonLong * 8 + lagnaLong + sunLong * 7) / 16 * 12);
  const mrityuSign = Math.floor(mrityuDeg / 30) + 1;
  const mrityuNak = getNakshatraNumber(mrityuDeg);

  // ── Tri Sphuta (Composite) ──
  // = (Prana + Deha + Mrityu) / 3
  const triDeg = normalizeDeg((pranaDeg + dehaDeg + mrityuDeg) / 3);
  const triSign = Math.floor(triDeg / 30) + 1;
  const triNak = getNakshatraNumber(triDeg);

  // ── Yogi Point ──
  // = Sun + Moon + 93°20' (= 93.333°)
  const yogiDeg = normalizeDeg(sunLong + moonLong + 93.333);
  const yogiSign = Math.floor(yogiDeg / 30) + 1;
  const yogiNak = getNakshatraNumber(yogiDeg);
  const yogiPlanet = NAKSHATRA_LORDS[yogiNak - 1] ?? 0;

  // ── Avayogi Point ──
  // = Yogi + 186°40' (= 186.667°)
  const avayogiDeg = normalizeDeg(yogiDeg + 186.667);
  const avayogiSign = Math.floor(avayogiDeg / 30) + 1;
  const avayogiNak = getNakshatraNumber(avayogiDeg);
  const avayogiPlanet = NAKSHATRA_LORDS[avayogiNak - 1] ?? 0;

  // ── Bija Sphuta (Male Fertility) ──
  // = Sun + Venus + Jupiter
  const bijaDeg = normalizeDeg(sunLong + venusLong + jupiterLong);
  const bijaSign = Math.floor(bijaDeg / 30) + 1;

  // ── Kshetra Sphuta (Female Fertility) ──
  // = Moon + Mars + Jupiter
  const kshetraDeg = normalizeDeg(moonLong + marsLong + jupiterLong);
  const kshetraSign = Math.floor(kshetraDeg / 30) + 1;

  return {
    pranaSphuta: {
      degree: Math.round(pranaDeg * 100) / 100,
      sign: pranaSign, nakshatra: pranaNak,
      description: { en: 'Vitality and life force indicator. Transits over this point can affect health.', hi: 'जीवन शक्ति सूचक। इस बिंदु पर गोचर स्वास्थ्य प्रभावित कर सकता है।', sa: 'प्राणशक्तिसूचकम्' },
    },
    dehaSphuta: {
      degree: Math.round(dehaDeg * 100) / 100,
      sign: dehaSign, nakshatra: dehaNak,
      description: { en: 'Physical body sensitive point. Affliction indicates health vulnerability.', hi: 'शारीरिक संवेदनशील बिंदु। पीड़ा स्वास्थ्य भेद्यता दर्शाती है।', sa: 'देहसंवेदनबिन्दुः' },
    },
    mrityuSphuta: {
      degree: Math.round(mrityuDeg * 100) / 100,
      sign: mrityuSign, nakshatra: mrityuNak,
      description: { en: 'Longevity sensitive point. Saturn/Rahu transits here can trigger health crises.', hi: 'दीर्घायु संवेदनशील बिंदु। शनि/राहु गोचर यहाँ स्वास्थ्य संकट उत्पन्न कर सकता है।', sa: 'मृत्युसंवेदनबिन्दुः' },
    },
    triSphuta: {
      degree: Math.round(triDeg * 100) / 100,
      sign: triSign, nakshatra: triNak,
      description: { en: 'Composite sensitive point (average of Prana, Deha, Mrityu). Overall vulnerability indicator.', hi: 'समग्र संवेदनशील बिंदु (प्राण, देह, मृत्यु का औसत)।', sa: 'त्रिस्फुटम्' },
    },
    yogiPoint: {
      degree: Math.round(yogiDeg * 100) / 100,
      sign: yogiSign, nakshatra: yogiNak, yogiPlanet,
      description: { en: 'Most benefic degree in the chart. The Yogi Planet (nakshatra lord of this point) brings maximum good fortune when active in dasha or transit.', hi: 'कुण्डली का सबसे शुभ अंश। योगी ग्रह दशा/गोचर में अधिकतम शुभ फल देता है।', sa: 'योगिबिन्दुः' },
    },
    avayogiPoint: {
      degree: Math.round(avayogiDeg * 100) / 100,
      sign: avayogiSign, nakshatra: avayogiNak, avayogiPlanet,
      description: { en: 'Most malefic degree. The Avayogi Planet can bring obstacles when active. Avoid starting important activities when Moon transits this degree.', hi: 'सबसे अशुभ अंश। अवयोगी ग्रह सक्रिय होने पर बाधाएं ला सकता है।', sa: 'अवयोगिबिन्दुः' },
    },
    bijaSphuta: { degree: Math.round(bijaDeg * 100) / 100, sign: bijaSign },
    kshetraSphuta: { degree: Math.round(kshetraDeg * 100) / 100, sign: kshetraSign },
  };
}

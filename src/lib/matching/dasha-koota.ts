/**
 * Dasha Koota (10-fold) Horoscope Matching Engine — South Indian System
 *
 * Computes compatibility score between two birth charts using the
 * traditional 10-point South Indian Guna Milan system.
 *
 * The 10 Kutas and their max points:
 *  1. Dina Koota       (Nakshatra compat.)   — 1.5 points
 *  2. Gana Koota       (Temperament)         — 1.5 points
 *  3. Mahendra Koota   (Prosperity)          — 1   point
 *  4. Stree Deergha    (Female longevity)    — 1   point
 *  5. Yoni Koota       (Sexual compat.)      — 1   point
 *  6. Rashi Koota      (Sign compat.)        — 1   point
 *  7. Rashiadhipati    (Sign lord friendship) — 1   point
 *  8. Vasya Koota      (Obedience/attraction) — 1   point
 *  9. Rajju Koota      (Marriage durability)  — 1   point
 * 10. Vedha Koota      (Affliction)          — 1   point
 * Total                                      — 10  points
 */

import type { LocaleText } from '@/types/panchang';

// ── Re-use tables from ashta-kuta.ts (duplicated here to avoid coupling) ──
// Gana: Deva=0, Manushya=1, Rakshasa=2 (indexed by nakshatra 1-27, array 0-26)
const NAKSHATRA_GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];

// Yoni animal for each nakshatra (1-27, indexed 0-26)
// 0=Horse, 1=Elephant, 2=Sheep, 3=Serpent, 4=Dog, 5=Cat, 6=Rat, 7=Cow, 8=Buffalo, 9=Tiger, 10=Deer, 11=Monkey, 12=Mongoose, 13=Lion
const NAKSHATRA_YONI = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];

// Yoni enemy pairs (bitter enemies)
const YONI_ENEMIES: [number, number][] = [
  [0, 8],   // Horse-Buffalo
  [1, 13],  // Elephant-Lion
  [3, 12],  // Snake-Mongoose
  [4, 10],  // Dog-Deer
  [5, 6],   // Cat-Rat
  [7, 9],   // Cow-Tiger
  [11, 2],  // Monkey-Sheep
];

// Rashi lord (planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn)
const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // Aries..Pisces

// Planetary friendship: 0=enemy, 1=neutral, 2=friend (BPHS Ch.3)
const GRAHA_MAITRI: Record<number, Record<number, number>> = {
  0: { 0: 2, 1: 2, 2: 2, 3: 1, 4: 2, 5: 0, 6: 0 }, // Sun
  1: { 0: 2, 1: 2, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1 }, // Moon
  2: { 0: 2, 1: 2, 2: 2, 3: 0, 4: 2, 5: 1, 6: 1 }, // Mars
  3: { 0: 2, 1: 0, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1 }, // Mercury
  4: { 0: 2, 1: 2, 2: 2, 3: 0, 4: 2, 5: 0, 6: 1 }, // Jupiter
  5: { 0: 0, 1: 0, 2: 1, 3: 2, 4: 1, 5: 2, 6: 2 }, // Venus
  6: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 1, 5: 2, 6: 2 }, // Saturn
};

// Vashya groups per rashi: Chatushpada(0), Manava(1), Jalachara(2), Vanachara(3), Keeta(4)
const RASHI_VASHYA = [0, 0, 1, 2, 3, 1, 1, 4, 0, 3, 1, 2]; // Aries..Pisces

// ── Rajju assignment ──
// Sira(0), Kantha(1), Udara(2) — 3-group cyclic
// Mapping: nakshatra ID → rajju group
const NAKSHATRA_RAJJU: Record<number, number> = {
  // Sira (head) — 0
  1: 0, 6: 0, 7: 0, 12: 0, 13: 0, 18: 0, 19: 0, 24: 0, 25: 0,
  // Kantha (neck) — 1
  2: 1, 5: 1, 8: 1, 11: 1, 14: 1, 17: 1, 20: 1, 23: 1, 26: 1,
  // Udara (stomach) — 2
  3: 2, 4: 2, 9: 2, 10: 2, 15: 2, 16: 2, 21: 2, 22: 2, 27: 2,
};

// ── Vedha (affliction) pairs ──
// If both partners' nakshatras form one of these pairs → vedha dosha
const VEDHA_PAIRS: [number, number][] = [
  [1, 18], [2, 17], [3, 16], [4, 15], [5, 23], [6, 22], [7, 21],
  [8, 20], [9, 19], [10, 27], [11, 26], [12, 25], [13, 24], [14, 23],
];

// ──────────────────────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────────────────────

export interface DashaKootaInput {
  moonNakshatra: number; // 1-27
  moonRashi: number;     // 1-12
}

export interface DashaKootaResult {
  name: LocaleText;
  maxPoints: number;
  scored: number;
  description: LocaleText;
}

export interface DashaKootaMatchResult {
  kutas: DashaKootaResult[];
  totalMax: number;
  totalScored: number;
  percentage: number;
  verdict: 'excellent' | 'good' | 'average' | 'below_average' | 'not_recommended';
  verdictText: LocaleText;
}

// ──────────────────────────────────────────────────────────────
// 1. Dina Koota (1.5 points) — Nakshatra compatibility
// ──────────────────────────────────────────────────────────────
// Count nakshatras from girl to boy. remainder = count % 9.
// If remainder is 2,4,6,8,0(=9) → full points. Others → 0.

function computeDina(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const count = ((boy.moonNakshatra - girl.moonNakshatra + 27) % 27) || 27;
  const remainder = count % 9;
  // remainder 2,4,6,8 or 0 (which means 9) → auspicious
  if (remainder === 2 || remainder === 4 || remainder === 6 || remainder === 8 || remainder === 0) {
    return 1.5;
  }
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 2. Gana Koota (1.5 points) — Temperament
// ──────────────────────────────────────────────────────────────
// Deva-Deva=1.5, Manushya-Manushya=1.5, Rakshasa-Rakshasa=1.5,
// Deva-Manushya=1, Manushya-Rakshasa=0.5, Deva-Rakshasa=0.

function computeGana(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const bg = NAKSHATRA_GANA[boy.moonNakshatra - 1];
  const gg = NAKSHATRA_GANA[girl.moonNakshatra - 1];

  if (bg === gg) return 1.5; // Same gana
  // Deva(0)-Manushya(1) or Manushya(1)-Deva(0)
  if ((bg === 0 && gg === 1) || (bg === 1 && gg === 0)) return 1;
  // Manushya(1)-Rakshasa(2) or Rakshasa(2)-Manushya(1)
  if ((bg === 1 && gg === 2) || (bg === 2 && gg === 1)) return 0.5;
  // Deva(0)-Rakshasa(2) or Rakshasa(2)-Deva(0)
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 3. Mahendra Koota (1 point) — Prosperity
// ──────────────────────────────────────────────────────────────
// Count boy's nakshatra from girl's. If (count-1) % 9 gives 0,2,4,6 → 1 point.

function computeMahendra(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const count = ((boy.moonNakshatra - girl.moonNakshatra + 27) % 27) || 27;
  const remainder = (count - 1) % 9;
  if (remainder === 0 || remainder === 2 || remainder === 4 || remainder === 6) {
    return 1;
  }
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 4. Stree Deergha (1 point) — Female longevity
// ──────────────────────────────────────────────────────────────
// Boy's nakshatra - girl's nakshatra >= 13 → 1 point.

function computeStreeDeergha(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const diff = ((boy.moonNakshatra - girl.moonNakshatra + 27) % 27);
  return diff >= 13 ? 1 : 0;
}

// ──────────────────────────────────────────────────────────────
// 5. Yoni Koota (1 point) — Sexual compatibility
// ──────────────────────────────────────────────────────────────
// Same yoni = 1, enemy = 0, neutral = 0.5.

function computeYoni(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const by = NAKSHATRA_YONI[boy.moonNakshatra - 1];
  const gy = NAKSHATRA_YONI[girl.moonNakshatra - 1];

  if (by === gy) return 1;

  for (const [a, b] of YONI_ENEMIES) {
    if ((by === a && gy === b) || (by === b && gy === a)) return 0;
  }

  return 0.5;
}

// ──────────────────────────────────────────────────────────────
// 6. Rashi Koota (1 point) — Sign compatibility (same as Bhakut)
// ──────────────────────────────────────────────────────────────
// 2/12, 6/8 = bad (0). 1/1 (same), 1/7, 5/9, 3/11 = good (1).

function computeRashi(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const diff = ((boy.moonRashi - girl.moonRashi + 12) % 12);
  // diff=0 → same sign, diff=6 → 1/7, diff=4 or 8 → 5/9, diff=2 or 10 → 3/11
  // Inauspicious: diff=1 or 11 → 2/12, diff=5 or 7 → 6/8
  if (diff === 1 || diff === 11 || diff === 5 || diff === 7) return 0;
  return 1;
}

// ──────────────────────────────────────────────────────────────
// 7. Rashiadhipati (1 point) — Sign lord friendship
// ──────────────────────────────────────────────────────────────
// Same as Graha Maitri: Lords friends=1, neutral=0.5, enemies=0.

function computeRashiadhipati(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const bl = RASHI_LORD[boy.moonRashi - 1];
  const gl = RASHI_LORD[girl.moonRashi - 1];

  if (bl === gl) return 1;

  const friendship = (GRAHA_MAITRI[bl]?.[gl] ?? 1) + (GRAHA_MAITRI[gl]?.[bl] ?? 1);
  // Both friends (4) = 1, friend+neutral (3) = 1, both neutral (2) = 0.5, others = 0
  if (friendship >= 3) return 1;
  if (friendship === 2) return 0.5;
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 8. Vasya Koota (1 point) — Obedience/attraction
// ──────────────────────────────────────────────────────────────

function computeVasya(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const bv = RASHI_VASHYA[boy.moonRashi - 1];
  const gv = RASHI_VASHYA[girl.moonRashi - 1];
  if (bv === gv) return 1;
  // Mutual vashya pairs
  const mutual = new Set(['0-1', '1-0', '1-2', '2-1']);
  if (mutual.has(`${bv}-${gv}`)) return 0.5;
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 9. Rajju Koota (1 point) — Durability of marriage
// ──────────────────────────────────────────────────────────────
// Same rajju → 0 (dosha), different → 1.

function computeRajju(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const br = NAKSHATRA_RAJJU[boy.moonNakshatra];
  const gr = NAKSHATRA_RAJJU[girl.moonNakshatra];
  if (br === undefined || gr === undefined) return 1; // safety fallback
  return br === gr ? 0 : 1;
}

// ──────────────────────────────────────────────────────────────
// 10. Vedha Koota (1 point) — Affliction
// ──────────────────────────────────────────────────────────────
// If both nakshatras form a vedha pair → 0. Otherwise → 1.

function computeVedha(boy: DashaKootaInput, girl: DashaKootaInput): number {
  const bn = boy.moonNakshatra;
  const gn = girl.moonNakshatra;
  for (const [a, b] of VEDHA_PAIRS) {
    if ((bn === a && gn === b) || (bn === b && gn === a)) return 0;
  }
  return 1;
}

// ──────────────────────────────────────────────────────────────
// Main Matching Function
// ──────────────────────────────────────────────────────────────

export function calculateDashaKoota(boy: DashaKootaInput, girl: DashaKootaInput): DashaKootaMatchResult {
  const kutas: DashaKootaResult[] = [
    {
      name: { en: 'Dina', hi: 'दिन' },
      maxPoints: 1.5,
      scored: computeDina(boy, girl),
      description: { en: 'Nakshatra day compatibility — health and mutual well-being', hi: 'नक्षत्र दिन अनुकूलता — स्वास्थ्य और परस्पर कल्याण' },
    },
    {
      name: { en: 'Gana', hi: 'गण' },
      maxPoints: 1.5,
      scored: computeGana(boy, girl),
      description: { en: 'Temperament and behavioral compatibility', hi: 'स्वभाव और व्यवहार अनुकूलता' },
    },
    {
      name: { en: 'Mahendra', hi: 'महेन्द्र' },
      maxPoints: 1,
      scored: computeMahendra(boy, girl),
      description: { en: 'Prosperity, wealth and progeny', hi: 'समृद्धि, धन और सन्तान' },
    },
    {
      name: { en: 'Stree Deergha', hi: 'स्त्री दीर्घ' },
      maxPoints: 1,
      scored: computeStreeDeergha(boy, girl),
      description: { en: 'Longevity and well-being of the bride', hi: 'वधू की दीर्घायु और कल्याण' },
    },
    {
      name: { en: 'Yoni', hi: 'योनि' },
      maxPoints: 1,
      scored: computeYoni(boy, girl),
      description: { en: 'Physical and intimate compatibility', hi: 'शारीरिक और अंतरंग अनुकूलता' },
    },
    {
      name: { en: 'Rashi', hi: 'राशि' },
      maxPoints: 1,
      scored: computeRashi(boy, girl),
      description: { en: 'Moon sign compatibility and overall harmony', hi: 'चन्द्र राशि अनुकूलता और समग्र सामंजस्य' },
    },
    {
      name: { en: 'Rashiadhipati', hi: 'राश्यधिपति' },
      maxPoints: 1,
      scored: computeRashiadhipati(boy, girl),
      description: { en: 'Friendship between sign lords — mental wavelength', hi: 'राशि स्वामियों की मित्रता — मानसिक तालमेल' },
    },
    {
      name: { en: 'Vasya', hi: 'वश्य' },
      maxPoints: 1,
      scored: computeVasya(boy, girl),
      description: { en: 'Mutual attraction and magnetic compatibility', hi: 'परस्पर आकर्षण और चुम्बकीय अनुकूलता' },
    },
    {
      name: { en: 'Rajju', hi: 'रज्जु' },
      maxPoints: 1,
      scored: computeRajju(boy, girl),
      description: { en: 'Durability and strength of the marriage bond', hi: 'विवाह बन्धन की स्थिरता और दृढ़ता' },
    },
    {
      name: { en: 'Vedha', hi: 'वेध' },
      maxPoints: 1,
      scored: computeVedha(boy, girl),
      description: { en: 'Absence of nakshatra affliction between partners', hi: 'साथियों के बीच नक्षत्र पीड़ा का अभाव' },
    },
  ];

  const totalMax = 10;
  const totalScored = kutas.reduce((sum, k) => sum + k.scored, 0);
  const percentage = Math.round((totalScored / totalMax) * 100);

  let verdict: DashaKootaMatchResult['verdict'];
  let verdictText: LocaleText;

  if (totalScored >= 8) {
    verdict = 'excellent';
    verdictText = { en: 'Excellent Match — Highly Recommended', hi: 'उत्तम मेल — अत्यन्त अनुशंसित' };
  } else if (totalScored >= 6) {
    verdict = 'good';
    verdictText = { en: 'Good Match — Recommended', hi: 'अच्छा मेल — अनुशंसित' };
  } else if (totalScored >= 5) {
    verdict = 'average';
    verdictText = { en: 'Average Match — Acceptable with Remedies', hi: 'सामान्य मेल — उपायों के साथ स्वीकार्य' };
  } else if (totalScored >= 3.5) {
    verdict = 'below_average';
    verdictText = { en: 'Below Average — Proceed with Caution', hi: 'औसत से कम — सावधानी से आगे बढ़ें' };
  } else {
    verdict = 'not_recommended';
    verdictText = { en: 'Not Recommended — Significant Incompatibility', hi: 'अनुशंसित नहीं — महत्वपूर्ण असंगति' };
  }

  return {
    kutas,
    totalMax,
    totalScored,
    percentage,
    verdict,
    verdictText,
  };
}

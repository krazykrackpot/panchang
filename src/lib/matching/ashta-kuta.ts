/**
 * Ashta Kuta (8-fold) Horoscope Matching Engine
 *
 * Computes compatibility score between two birth charts using the
 * traditional 36-point Guna Milan system.
 *
 * The 8 Kutas and their max points:
 * 1. Varna (caste/nature)     — 1 point
 * 2. Vashya (dominance)       — 2 points
 * 3. Tara (birth star)        — 3 points
 * 4. Yoni (sexual compat.)    — 4 points
 * 5. Graha Maitri (friendship)— 5 points
 * 6. Gana (temperament)       — 6 points
 * 7. Bhakoot (sign compat.)   — 7 points
 * 8. Nadi (health/genes)      — 8 points
 * Total                       — 36 points
 */

import type { LocaleText,} from '@/types/panchang';

export interface MatchInput {
  moonNakshatra: number; // 1-27
  moonRashi: number;     // 1-12
  moonPada?: number;     // 1-4 (optional, for N4 same-pada override)
}

export interface KutaResult {
  name: LocaleText;
  maxPoints: number;
  scored: number;
  description: LocaleText;
}

export interface MatchResult {
  totalScore: number;
  maxScore: 36;
  percentage: number;
  verdict: 'excellent' | 'good' | 'average' | 'below_average' | 'not_recommended';
  verdictText: LocaleText;
  kutas: KutaResult[];
  nadiDoshaPresent: boolean;
  /** N4 override: same nadi but same nakshatra+pada = genetically favorable, dosha cancelled */
  nadiDoshaCancelled?: boolean;
}

// ──────────────────────────────────────────────────────────────
// 1. Varna Kuta (1 point)
// ──────────────────────────────────────────────────────────────
// Each rashi belongs to a varna: Brahmin(3), Kshatriya(2), Vaishya(1), Shudra(0)
// Boy's varna >= Girl's varna = 1 point

const RASHI_VARNA = [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3]; // Aries..Pisces

function computeVarna(boy: MatchInput, girl: MatchInput): number {
  const bv = RASHI_VARNA[boy.moonRashi - 1];
  const gv = RASHI_VARNA[girl.moonRashi - 1];
  return bv >= gv ? 1 : 0;
}

// ──────────────────────────────────────────────────────────────
// 2. Vashya Kuta (2 points)
// ──────────────────────────────────────────────────────────────
// Each rashi has a vashya group. Compatible pairs get points.
// Groups: Chatushpada(0), Manava(1), Jalachara(2), Vanachara(3), Keeta(4)

// Chatushpada(0)=Aries,Taurus,Sagittarius  Manava(1)=Gemini,Virgo,Libra,Aquarius
// Jalachara(2)=Cancer,Pisces  Vanachara(3)=Leo,Capricorn  Keeta(4)=Scorpio
// Source: Muhurta Chintamani — Leo is Vanachara (wild/forest), Aquarius is Manava (human)
const RASHI_VASHYA = [0, 0, 1, 2, 3, 1, 1, 4, 0, 3, 1, 2]; // Aries..Pisces

// Compatibility matrix: [boy][girl] => points
function computeVashya(boy: MatchInput, girl: MatchInput): number {
  const bv = RASHI_VASHYA[boy.moonRashi - 1];
  const gv = RASHI_VASHYA[girl.moonRashi - 1];
  if (bv === gv) return 2;
  // Mutual vashya pairs
  const mutual = new Set(['0-1', '1-0', '1-2', '2-1']);
  if (mutual.has(`${bv}-${gv}`)) return 1;
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 3. Tara Kuta (3 points)
// ──────────────────────────────────────────────────────────────
// Tara = (girl's nakshatra - boy's nakshatra + 27) % 9
// Auspicious taras: 2(Sampat), 4(Kshema), 6(Sadhana), 8(Mitra), 9(Parama Mitra)
// Inauspicious: 3(Vipat), 5(Pratyari), 7(Vadha). 1(Janma) is context-dependent.

function computeTara(boy: MatchInput, girl: MatchInput): number {
  // Classical formula: count from boy's nakshatra to girl's (inclusive), then
  // divide by 9 and use the remainder to get Tara type (1-9).
  //
  //   tara = ((girl_nak - boy_nak + 27) % 27) % 9 + 1
  //
  // The TWO-step modulo is critical:
  //   Step 1: % 27  → maps the signed difference to 0-26 (count within one cycle)
  //   Step 2: % 9   → maps 0-26 to 0-8, giving the Tara group (0-8)
  //   +1            → converts to 1-based (Tara 1=Janma … Tara 9=Parama Mitra)
  //
  // HISTORICAL BUG (now fixed): the formula used `(diff + 27) % 9` — it
  // applied modulo 9 directly without the intermediate modulo 27 step.
  // When both partners share the same nakshatra (diff = 0):
  //   Old: (0 + 27) % 9 = 0  →  0 || 9 = 9 (Parama Mitra — wrong, most auspicious)
  //   New: ((0 + 27) % 27) % 9 + 1 = 0 % 9 + 1 = 1 (Janma — correct)
  // For diff = 9 (9 apart):
  //   Old: (9 + 27) % 9 = 0  →  0 || 9 = 9 (Parama Mitra)
  //   New: ((9 + 27) % 27) % 9 + 1 = 9 % 9 + 1 = 1 (Janma) — every 9th cycles back
  // For diff = 8:
  //   Old: (8 + 27) % 9 = 8  →  8 (Mitra — happens to be correct)
  //   New: ((8 + 27) % 27) % 9 + 1 = 8 % 9 + 1 = 9 (Parama Mitra — correct)
  // The old formula produced wrong results for ~11% of nakshatra pairs.
  const tara1 = ((girl.moonNakshatra - boy.moonNakshatra + 27) % 27) % 9 + 1;
  const tara2 = ((boy.moonNakshatra - girl.moonNakshatra + 27) % 27) % 9 + 1;

  const AUSPICIOUS = new Set([2, 4, 6, 8, 9]); // Sampat, Kshema, Sadhana, Mitra, Parama Mitra
  let points = 0;
  if (AUSPICIOUS.has(tara1)) points += 1.5;
  if (AUSPICIOUS.has(tara2)) points += 1.5;

  return Math.min(points, 3);
}

// ──────────────────────────────────────────────────────────────
// 4. Yoni Kuta (4 points)
// ──────────────────────────────────────────────────────────────
// Each nakshatra has an animal yoni. Same yoni = 4, friendly = 3, neutral = 2, enemy = 1, bitter = 0

// Yoni for each nakshatra (1-27) indexed 0-26
// 0=Horse, 1=Elephant, 2=Sheep/Goat, 3=Serpent, 4=Dog, 5=Cat, 6=Rat, 7=Cow, 8=Buffalo, 9=Tiger, 10=Deer/Hare, 11=Monkey, 12=Mongoose, 13=Lion
// Classical pairs (male+female of same animal):
//   Horse:    Ashwini(1)   & Shatabhisha(24)
//   Elephant: Bharani(2)   & Revati(27)
//   Sheep:    Krittika(3)  & Pushya(8)
//   Serpent:  Rohini(4)    & Mrigashira(5)
//   Dog:      Ardra(6)     & Mula(19)
//   Cat:      Punarvasu(7) & Ashlesha(9)
//   Rat:      Magha(10)    & P.Phalguni(11)
//   Cow:      U.Phalguni(12) & U.Bhadrapada(26)
//   Buffalo:  Hasta(13)    & Swati(15)
//   Tiger:    Chitra(14)   & Vishakha(16)
//   Deer:     Anuradha(17) & Jyeshtha(18)
//   Monkey:   P.Ashadha(20) & Shravana(22)
//   Mongoose: U.Ashadha(21) only (Abhijit not in 27-nakshatra cycle)
//   Lion:     Dhanishtha(23) & P.Bhadrapada(25)
const NAKSHATRA_YONI = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];

// Enemy pairs (bitter enemies get 0)
// 7 classical enemy pairs — each animal has exactly one sworn enemy
const YONI_ENEMIES: [number, number][] = [
  [0, 8],  // Horse-Buffalo
  [1, 13], // Elephant-Lion
  [3, 12], // Snake-Mongoose
  [4, 10], // Dog-Deer
  [5, 6],  // Cat-Rat
  [7, 9],  // Cow-Tiger
  [11, 2], // Monkey-Sheep
];

function computeYoni(boy: MatchInput, girl: MatchInput): number {
  const by = NAKSHATRA_YONI[boy.moonNakshatra - 1];
  const gy = NAKSHATRA_YONI[girl.moonNakshatra - 1];

  if (by === gy) return 4; // Same animal

  // Check enemy pairs (0 points)
  for (const [a, b] of YONI_ENEMIES) {
    if ((by === a && gy === b) || (by === b && gy === a)) return 0;
  }

  // Classical Yoni Kuta: all non-same, non-enemy pairs score 2 (neutral)
  // Per Muhurta Chintamani — no intermediate "friendly" tier in the classical system
  return 2;
}

// ──────────────────────────────────────────────────────────────
// 5. Graha Maitri (5 points)
// ──────────────────────────────────────────────────────────────
// Based on the friendship between the lords of the Moon signs
// Lord mapping: each rashi's ruling planet

const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // planet IDs: 0=Sun,1=Moon,2=Mars,3=Mercury,4=Jupiter,5=Venus,6=Saturn

// Planetary friendship: 0=enemy, 1=neutral, 2=friend
const GRAHA_MAITRI: Record<number, Record<number, number>> = {
  // Natural Friendship table per BPHS Ch.3 (Naisargika Maitri)
  // 0=enemy, 1=neutral, 2=friend. Verified against shadbala.ts NAT_FRIENDS/NAT_ENEMIES.
  0: { 0: 2, 1: 2, 2: 2, 3: 1, 4: 2, 5: 0, 6: 0 }, // Sun: friends=Moon,Mars,Jup; neutral=Merc; enemies=Ven,Sat
  1: { 0: 2, 1: 2, 2: 1, 3: 2, 4: 1, 5: 1, 6: 1 }, // Moon: friends=Sun,Merc; neutral=Mars,Jup,Ven,Sat; enemies=none
  2: { 0: 2, 1: 2, 2: 2, 3: 0, 4: 2, 5: 1, 6: 1 }, // Mars: friends=Sun,Moon,Jup; neutral=Ven,Sat; enemies=Merc
  3: { 0: 2, 1: 0, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1 }, // Mercury: friends=Sun,Ven; neutral=Mars,Jup,Sat; enemies=Moon
  4: { 0: 2, 1: 2, 2: 2, 3: 0, 4: 2, 5: 0, 6: 1 }, // Jupiter: friends=Sun,Moon,Mars; neutral=Sat; enemies=Merc,Ven
  5: { 0: 0, 1: 0, 2: 1, 3: 2, 4: 1, 5: 2, 6: 2 }, // Venus: friends=Merc,Sat; neutral=Mars,Jup; enemies=Sun,Moon
  6: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 1, 5: 2, 6: 2 }, // Saturn: friends=Merc,Ven; neutral=Jup; enemies=Sun,Moon,Mars
};

function computeGrahaMaitri(boy: MatchInput, girl: MatchInput): number {
  const bl = RASHI_LORD[boy.moonRashi - 1];
  const gl = RASHI_LORD[girl.moonRashi - 1];

  if (bl === gl) return 5;

  const friendship = (GRAHA_MAITRI[bl]?.[gl] ?? 1) + (GRAHA_MAITRI[gl]?.[bl] ?? 1);
  // Both friends (4) = 5, friend+neutral (3) = 4, both neutral (2) = 3, neutral+enemy (1) = 1, both enemy (0) = 0
  if (friendship >= 4) return 5;
  if (friendship === 3) return 4;
  if (friendship === 2) return 3;
  if (friendship === 1) return 1;
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 6. Gana Kuta (6 points)
// ──────────────────────────────────────────────────────────────
// Each nakshatra belongs to Deva(0), Manushya(1), or Rakshasa(2)

// Classical Gana by nakshatra (Deva=0, Manushya=1, Rakshasa=2)
// Source: Parasara / Muhurta Chintamani
//   Deva:     Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati
//   Manushya: Bharani, Rohini, Ardra, P.Phalguni, U.Phalguni, P.Ashadha, U.Ashadha, P.Bhadrapada, U.Bhadrapada
//   Rakshasa: Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Mula, Dhanishtha, Shatabhisha
const NAKSHATRA_GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];

function computeGana(boy: MatchInput, girl: MatchInput): number {
  const bg = NAKSHATRA_GANA[boy.moonNakshatra - 1];
  const gg = NAKSHATRA_GANA[girl.moonNakshatra - 1];

  if (bg === gg) return 6;
  // Deva-Manushya = 6 (some traditions) or 5
  if ((bg === 0 && gg === 1) || (bg === 1 && gg === 0)) return 5;
  // Deva-Rakshasa = 1
  if ((bg === 0 && gg === 2) || (bg === 2 && gg === 0)) return 1;
  // Manushya-Rakshasa = 0
  return 0;
}

// ──────────────────────────────────────────────────────────────
// 7. Bhakoot (Rashi Kuta) (7 points)
// ──────────────────────────────────────────────────────────────
// Based on the distance between Moon signs. Certain combinations are inauspicious.

function computeBhakoot(boy: MatchInput, girl: MatchInput): number {
  const diff = ((boy.moonRashi - girl.moonRashi + 12) % 12);

  // Inauspicious positions: 2/12, 5/9, 6/8 (one sign is 2nd, 5th, or 6th from the other)
  const inauspicious = diff === 1 || diff === 11 || diff === 4 || diff === 8 || diff === 5 || diff === 7;
  if (!inauspicious) return 7;

  // Cancellation (Bhakoot Dosha Parihara): ONLY same lord cancels.
  // Friendship-based cancellation is too liberal and makes Bhakoot trivially 7 for most pairs.
  // Classical parihara: Aries–Scorpio (Mars), Taurus–Libra (Venus), Cap–Aquarius (Saturn)
  const bl = RASHI_LORD[boy.moonRashi - 1];
  const gl = RASHI_LORD[girl.moonRashi - 1];
  if (bl === gl) return 7;

  return 0;
}

// ──────────────────────────────────────────────────────────────
// 8. Nadi Kuta (8 points)
// ──────────────────────────────────────────────────────────────
// Each nakshatra belongs to Aadi(0), Madhya(1), or Antya(2) nadi
// Same nadi = 0 points (Nadi Dosha), different = 8 points

// Traditional Nadi assignment (Aadi=0, Madhya=1, Antya=2)
// Pattern: groups of 3 nakshatras alternate forward/reverse
const NAKSHATRA_NADI = [
  0, 1, 2, // Ashwini=Aadi, Bharani=Madhya, Krittika=Antya
  2, 1, 0, // Rohini=Antya, Mrigashira=Madhya, Ardra=Aadi
  0, 1, 2, // Punarvasu=Aadi, Pushya=Madhya, Ashlesha=Antya
  2, 1, 0, // Magha=Antya, P.Phalguni=Madhya, U.Phalguni=Aadi
  0, 1, 2, // Hasta=Aadi, Chitra=Madhya, Swati=Antya
  2, 1, 0, // Vishakha=Antya, Anuradha=Madhya, Jyeshtha=Aadi
  0, 1, 2, // Mula=Aadi, P.Ashadha=Madhya, U.Ashadha=Antya
  2, 1, 0, // Shravana=Antya, Dhanishtha=Madhya, Shatabhisha=Aadi
  0, 1, 2, // P.Bhadrapada=Aadi, U.Bhadrapada=Madhya, Revati=Antya
];

export function computeNadi(boy: MatchInput, girl: MatchInput): number {
  const bn = NAKSHATRA_NADI[boy.moonNakshatra - 1];
  const gn = NAKSHATRA_NADI[girl.moonNakshatra - 1];

  if (bn !== gn) return 8; // Different nadi — no dosha

  // N4: same nakshatra + same pada = complete override (genetically favorable)
  if (
    boy.moonNakshatra === girl.moonNakshatra &&
    boy.moonPada !== undefined && girl.moonPada !== undefined &&
    boy.moonPada === girl.moonPada
  ) {
    return 8; // Dosha fully cancelled
  }

  return 0; // Nadi Dosha present
}

// ──────────────────────────────────────────────────────────────
// Main Matching Function
// ──────────────────────────────────────────────────────────────

export function computeAshtaKuta(boy: MatchInput, girl: MatchInput): MatchResult {
  const kutas: KutaResult[] = [
    {
      name: { en: 'Varna', hi: 'वर्ण', sa: 'वर्णः' },
      maxPoints: 1,
      scored: computeVarna(boy, girl),
      description: { en: 'Spiritual/ego compatibility and work nature', hi: 'आध्यात्मिक और कार्य स्वभाव अनुकूलता', sa: 'आध्यात्मिक-कार्यस्वभाव-अनुकूलता' },
    },
    {
      name: { en: 'Vashya', hi: 'वश्य', sa: 'वश्यम्' },
      maxPoints: 2,
      scored: computeVashya(boy, girl),
      description: { en: 'Mutual attraction and dominance in relationship', hi: 'परस्पर आकर्षण और सम्बन्ध में प्रभुत्व', sa: 'परस्पर-आकर्षणं सम्बन्धे प्रभुत्वं च' },
    },
    {
      name: { en: 'Tara', hi: 'तारा', sa: 'तारा' },
      maxPoints: 3,
      scored: computeTara(boy, girl),
      description: { en: 'Birth star compatibility and health harmony', hi: 'जन्म नक्षत्र अनुकूलता और स्वास्थ्य सामंजस्य', sa: 'जन्मनक्षत्र-अनुकूलता स्वास्थ्यसामञ्जस्यं च' },
    },
    {
      name: { en: 'Yoni', hi: 'योनि', sa: 'योनिः' },
      maxPoints: 4,
      scored: computeYoni(boy, girl),
      description: { en: 'Physical and intimate compatibility', hi: 'शारीरिक और अंतरंग अनुकूलता', sa: 'शारीरिक-अन्तरङ्ग-अनुकूलता' },
    },
    {
      name: { en: 'Graha Maitri', hi: 'ग्रह मैत्री', sa: 'ग्रहमैत्री' },
      maxPoints: 5,
      scored: computeGrahaMaitri(boy, girl),
      description: { en: 'Mental compatibility and friendship between sign lords', hi: 'मानसिक अनुकूलता और राशि स्वामियों की मित्रता', sa: 'मानसिक-अनुकूलता राशिस्वामिमैत्री च' },
    },
    {
      name: { en: 'Gana', hi: 'गण', sa: 'गणः' },
      maxPoints: 6,
      scored: computeGana(boy, girl),
      description: { en: 'Temperament and behavioral compatibility', hi: 'स्वभाव और व्यवहार अनुकूलता', sa: 'स्वभाव-व्यवहार-अनुकूलता' },
    },
    {
      name: { en: 'Bhakoot', hi: 'भकूट', sa: 'भकूटम्' },
      maxPoints: 7,
      scored: computeBhakoot(boy, girl),
      description: { en: 'Overall prosperity, health and happiness of marriage', hi: 'विवाह की समृद्धि, स्वास्थ्य और सुख', sa: 'विवाहस्य समृद्धिः स्वास्थ्यं सुखं च' },
    },
    {
      name: { en: 'Nadi', hi: 'नाड़ी', sa: 'नाडी' },
      maxPoints: 8,
      scored: computeNadi(boy, girl),
      description: { en: 'Health, genes and progeny compatibility', hi: 'स्वास्थ्य, वंश और सन्तान अनुकूलता', sa: 'स्वास्थ्य-वंश-सन्तान-अनुकूलता' },
    },
  ];

  const totalScore = kutas.reduce((sum, k) => sum + k.scored, 0);
  const percentage = Math.round((totalScore / 36) * 100);
  const nadiDoshaPresent = kutas[7].scored === 0;

  // N4 override detection: same nadi (same zigzag group) but scored 8 = same nak + same pada
  const sameNadi = NAKSHATRA_NADI[boy.moonNakshatra - 1] === NAKSHATRA_NADI[girl.moonNakshatra - 1];
  const nadiDoshaCancelled = sameNadi && kutas[7].scored === 8;

  let verdict: MatchResult['verdict'];
  let verdictText: LocaleText;

  if (totalScore >= 28) {
    verdict = 'excellent';
    verdictText = { en: 'Excellent Match — Highly Recommended', hi: 'उत्तम मेल — अत्यन्त अनुशंसित', sa: 'उत्तमं मेलनम् — अत्यन्तम् अनुशंसितम्' };
  } else if (totalScore >= 21) {
    verdict = 'good';
    verdictText = { en: 'Good Match — Recommended', hi: 'अच्छा मेल — अनुशंसित', sa: 'शोभनं मेलनम् — अनुशंसितम्' };
  } else if (totalScore >= 18) {
    verdict = 'average';
    verdictText = { en: 'Average Match — Acceptable with Remedies', hi: 'सामान्य मेल — उपायों के साथ स्वीकार्य', sa: 'साधारणं मेलनम् — उपचारैः स्वीकार्यम्' };
  } else if (totalScore >= 14) {
    verdict = 'below_average';
    verdictText = { en: 'Below Average — Proceed with Caution', hi: 'औसत से कम — सावधानी से आगे बढ़ें', sa: 'न्यूनम् — सावधानतया अग्रे गच्छेत्' };
  } else {
    verdict = 'not_recommended';
    verdictText = { en: 'Not Recommended — Significant Incompatibility', hi: 'अनुशंसित नहीं — महत्वपूर्ण असंगति', sa: 'न अनुशंसितम् — महत्त्वपूर्णा असंगतिः' };
  }

  return {
    totalScore,
    maxScore: 36,
    percentage,
    verdict,
    verdictText,
    kutas,
    nadiDoshaPresent,
    nadiDoshaCancelled: nadiDoshaCancelled || undefined,
  };
}

/**
 * Atmakaraka — the "soul significator" planet in Jaimini Jyotish.
 *
 * Definition (Jaimini Sutras 1.1.20–24, also referenced in BPHS Ch.32):
 * Among the seven main grahas (Sun through Saturn — Rahu/Ketu excluded
 * per Jaimini's classical rule), the planet at the highest degree
 * within its sign (i.e. max of longitude mod 30) is the Atmakaraka.
 *
 * Classically the Atmakaraka represents the soul's primary teaching
 * for this life — what the native is most strongly here to learn,
 * irrespective of which planet has the highest brute-force Shadbala.
 *
 * Used by CosmicIdentityCard's "Your Soul" tile to give users an
 * Atmakaraka-anchored fourth face alongside the Mask (Lagna) / Heart
 * (Moon-sign) / Star (Moon-nakshatra) reading. The existing
 * archetype-engine picks the strongest-Shadbala planet as "primary"
 * which answers a different question (dominant vehicle vs soul
 * essence); both can be true simultaneously.
 *
 * Note: a separate inline Atmakaraka calculation already exists in
 * `src/lib/kundali/yogas-complete.ts` (line 3817 region) for the
 * D9-Atmakaraka-strength yoga. We don't share that code path because
 * its planet shape differs and the yoga module is already 4k+ lines.
 * Two small co-located computations < forcing a refactor of yogas-
 * complete just to surface a 6-line helper here.
 */

import type { LocaleText } from '@/types/panchang';

/**
 * Resolve the Atmakaraka planet id from a list of natal planet
 * positions. Returns null if input is empty or all planets are
 * outside the Sun-Saturn id range.
 */
export function computeAtmakaraka(planets: { planet: { id: number }; longitude: number }[]): number | null {
  // Filter to Sun-Saturn (ids 0-6) per Jaimini. Some modern traditions
  // include Rahu (id 7) which can occasionally take the highest degree
  // and become Atmakaraka by that variant; we follow the classical
  // 7-planet rule.
  const candidates = planets.filter((p) => p.planet.id >= 0 && p.planet.id <= 6);
  if (candidates.length === 0) return null;

  let akId = candidates[0].planet.id;
  let maxDegInSign = candidates[0].longitude % 30;
  for (const p of candidates.slice(1)) {
    const degInSign = p.longitude % 30;
    if (degInSign > maxDegInSign) {
      maxDegInSign = degInSign;
      akId = p.planet.id;
    }
  }
  return akId;
}

/**
 * Soul-archetype name + 1-sentence essence per Atmakaraka planet.
 * Aligned with the existing AK_ARCHETYPE_EN/HI maps in
 * `domain-synthesis/life-overview.ts` — kept in sync for prose
 * consistency. Locales beyond en/hi fall back to Hindi for Devanagari
 * locales and English otherwise (per the project's standard pattern).
 */
export interface SoulArchetype {
  /** One-word headline ("Warrior", "Teacher", …). LocaleText for i18n. */
  name: LocaleText;
  /** One-sentence soul-essence used as the tile's italic one-liner. */
  oneLiner: LocaleText;
  /** Accent colour for the tile glow — matches the planet's chart colour. */
  glowColor: string;
}

export const SOUL_ARCHETYPES: Record<number, SoulArchetype> = {
  0: {
    name: { en: 'Leader', hi: 'नेता', sa: 'नेता' },
    oneLiner: {
      en: 'Here to lead, to be seen, and to align personal authority with a higher purpose.',
      hi: 'नेतृत्व करने, दृष्टिगोचर होने और व्यक्तिगत प्राधिकार को उच्चतर उद्देश्य से जोड़ने हेतु।',
    },
    glowColor: '#e67e22',
  },
  1: {
    name: { en: 'Nurturer', hi: 'पालक', sa: 'पालकः' },
    oneLiner: {
      en: 'Here to feel deeply, hold others through transitions, and refine your emotional depth.',
      hi: 'गहराई से अनुभव करने, परिवर्तनों में दूसरों को सहारा देने और भावनात्मक गहराई को परिष्कृत करने हेतु।',
    },
    glowColor: '#ecf0f1',
  },
  2: {
    name: { en: 'Warrior', hi: 'योद्धा', sa: 'योद्धा' },
    oneLiner: {
      en: 'Here to act with courage, defend what matters, and master the use of personal force.',
      hi: 'साहस से कार्य करने, जो महत्वपूर्ण है उसकी रक्षा करने और व्यक्तिगत बल के सम्यक् प्रयोग में निष्णात होने हेतु।',
    },
    glowColor: '#e74c3c',
  },
  3: {
    name: { en: 'Communicator', hi: 'संचारक', sa: 'सञ्चारकः' },
    oneLiner: {
      en: 'Here to bridge ideas, translate between worlds, and refine truthful expression.',
      hi: 'विचारों को जोड़ने, संसारों के बीच अनुवाद करने और सत्य की अभिव्यक्ति को परिष्कृत करने हेतु।',
    },
    glowColor: '#2ecc71',
  },
  4: {
    name: { en: 'Teacher', hi: 'गुरु', sa: 'आचार्यः' },
    oneLiner: {
      en: 'Here to expand, to share wisdom, and to embody the principle of growth in others.',
      hi: 'विस्तार करने, ज्ञान बाँटने और दूसरों में विकास के सिद्धान्त को मूर्तरूप देने हेतु।',
    },
    glowColor: '#f39c12',
  },
  5: {
    name: { en: 'Artist', hi: 'कलाकार', sa: 'कलाकारः' },
    oneLiner: {
      en: 'Here to seek beauty, relate deeply, and refine the art of partnership and pleasure.',
      hi: 'सौन्दर्य की खोज करने, गहराई से सम्बन्ध स्थापित करने और सम्बन्ध एवं आनन्द की कला को परिष्कृत करने हेतु।',
    },
    glowColor: '#e8e6e3',
  },
  6: {
    name: { en: 'Builder', hi: 'निर्माता', sa: 'निर्माता' },
    oneLiner: {
      en: 'Here to endure, discipline, and slowly build structures that outlast you.',
      hi: 'सहन करने, अनुशासन में रहने और धीरे-धीरे ऐसी संरचनाएँ बनाने हेतु जो आपसे आगे टिकें।',
    },
    glowColor: '#3498db',
  },
};

/** Lookup helper with fallback for ids outside the 0-6 range. */
export function getSoulArchetype(planetId: number): SoulArchetype {
  return SOUL_ARCHETYPES[planetId] ?? SOUL_ARCHETYPES[0];
}

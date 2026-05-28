/**
 * Per-festival astrological focus — which planet/house/karaka each festival
 * emphasises. Used by the personalized-reading engine to surface the right
 * transit lens for each festival.
 *
 * 20 entries covering TOP_FESTIVAL_SLUGS.
 *
 * Overlapping entries (festivals also referenced in PLANET_FESTIVAL_MAP at
 * src/lib/personalization/festival-relevance.ts) MUST match that map's
 * planet ID — enforced by a fixture test. Currently aligned for:
 *   - makar-sankranti     → Sun
 *   - chhath-puja         → Sun
 *   - hanuman-jayanti     → Mars
 *   - maha-shivaratri     → Saturn
 *   - guru-purnima        → Jupiter
 *   - vasant-panchami     → Venus
 *   - ganesh-chaturthi    → Ketu  (Ganesha is the "head-less" deity → Ketu's karaka)
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4A
 */

import type { FestivalAstroFocus } from './types';

export const FESTIVAL_ASTRO_FOCUS: Record<string, FestivalAstroFocus> = {
  // Lakshmi Puja → 2nd house wealth
  'diwali': {
    primaryPlanet: 5, // Venus
    primaryHouse: 2,
    karaka: 'wealth',
    karakaLabel: { en: 'wealth & abundance', hi: 'धन एवं समृद्धि' },
  },

  // Dhanvantari + Lakshmi (medicine + wealth)
  'dhanteras': {
    primaryPlanet: 5,           // Venus
    secondaryPlanet: 6,         // Saturn (Dhanvantari → longevity karaka)
    primaryHouse: 2,
    karaka: 'wealth-health',
    karakaLabel: { en: 'wealth & well-being', hi: 'धन एवं स्वास्थ्य' },
  },

  // Holika Dahan → Mars-driven release
  'holi': {
    primaryPlanet: 2, // Mars
    primaryHouse: 3,
    karaka: 'courage',
    karakaLabel: { en: 'courage & release', hi: 'साहस एवं विमुक्ति' },
  },

  // Shiva → Saturn karaka, 12th house moksha
  'maha-shivaratri': {
    primaryPlanet: 6, // Saturn
    primaryHouse: 12,
    karaka: 'moksha',
    karakaLabel: { en: 'liberation & inner work', hi: 'मोक्ष एवं आन्तरिक साधना' },
  },

  // Rama as Surya-vamsha → 9th house dharma
  'ram-navami': {
    primaryPlanet: 0, // Sun
    primaryHouse: 9,
    karaka: 'dharma',
    karakaLabel: { en: 'dharma & righteous path', hi: 'धर्म एवं सत्पथ' },
  },

  // Krishna midnight birth → Moon karaka, 5th house devotion
  'janmashtami': {
    primaryPlanet: 1, // Moon
    primaryHouse: 5,
    karaka: 'devotion',
    karakaLabel: { en: 'devotion & creativity', hi: 'भक्ति एवं सर्जनशीलता' },
  },

  // Ganesha is the "head-less" deity → Ketu's karaka. 4th house = home, hearth, foundation.
  // Aligned with PLANET_FESTIVAL_MAP in src/lib/personalization/festival-relevance.ts.
  'ganesh-chaturthi': {
    primaryPlanet: 8, // Ketu
    primaryHouse: 4,
    karaka: 'beginnings',
    karakaLabel: { en: 'beginnings & obstacles removed', hi: 'आरम्भ एवं विघ्न-निवारण' },
  },

  // Vijaya Dashami → 10th house career/victory
  'dussehra': {
    primaryPlanet: 0, // Sun
    primaryHouse: 10,
    karaka: 'victory',
    karakaLabel: { en: 'victory & public recognition', hi: 'विजय एवं सार्वजनिक मान' },
  },

  // Rakhi → 3rd house siblings
  'raksha-bandhan': {
    primaryPlanet: 4, // Jupiter (sibling karaka)
    primaryHouse: 3,
    karaka: 'siblings',
    karakaLabel: { en: 'sibling bonds & protection', hi: 'सहोदर बन्धन एवं रक्षा' },
  },

  // Pre-dawn cleansing → Saturn karaka, 8th house transformation
  'narak-chaturdashi': {
    primaryPlanet: 6, // Saturn
    primaryHouse: 8,
    karaka: 'purification',
    karakaLabel: { en: 'purification & shedding the old', hi: 'शुद्धिकरण एवं विसर्जन' },
  },

  // Krishna-Indra lore — refuge under the mountain → 4th house home
  'govardhan-puja': {
    primaryPlanet: 4, // Jupiter
    primaryHouse: 4,
    karaka: 'home',
    karakaLabel: { en: 'home & refuge', hi: 'गृह एवं आश्रय' },
  },

  // Brother-sister tika → 3rd house siblings
  'bhai-dooj': {
    primaryPlanet: 4, // Jupiter
    primaryHouse: 3,
    karaka: 'siblings',
    karakaLabel: { en: 'sibling bonds', hi: 'सहोदर बन्धन' },
  },

  // Hanuman → Mars karaka, 6th house service/strength
  'hanuman-jayanti': {
    primaryPlanet: 2, // Mars
    primaryHouse: 6,
    karaka: 'strength-service',
    karakaLabel: { en: 'strength & selfless service', hi: 'बल एवं निःस्वार्थ सेवा' },
  },

  // "Eternal prosperity" → Jupiter + Venus, 2nd house wealth/giving
  'akshaya-tritiya': {
    primaryPlanet: 4,           // Jupiter
    secondaryPlanet: 5,         // Venus
    primaryHouse: 2,
    karaka: 'eternal-wealth',
    karakaLabel: { en: 'lasting wealth & generosity', hi: 'अक्षय धन एवं दान' },
  },

  // Jupiter = Guru karaka. 9th house teacher/dharma.
  'guru-purnima': {
    primaryPlanet: 4, // Jupiter
    primaryHouse: 9,
    karaka: 'teacher',
    karakaLabel: { en: 'teacher & dharmic guidance', hi: 'गुरु एवं धार्मिक मार्गदर्शन' },
  },

  // Saraswati → Venus (arts/music) + 5th house studies.
  // Aligned with PLANET_FESTIVAL_MAP.
  'vasant-panchami': {
    primaryPlanet: 5, // Venus
    primaryHouse: 5,
    karaka: 'learning-arts',
    karakaLabel: { en: 'learning, music & the arts', hi: 'विद्या, संगीत एवं कला' },
  },

  // Bonfire → Mars purification, 12th house release of the old
  'holika-dahan': {
    primaryPlanet: 2, // Mars
    primaryHouse: 12,
    karaka: 'release',
    karakaLabel: { en: 'release & purification by fire', hi: 'अग्नि द्वारा शुद्धि एवं विमुक्ति' },
  },

  // Parvati-Shiva union → Venus karaka, 7th house marriage
  'hartalika-teej': {
    primaryPlanet: 5, // Venus
    primaryHouse: 7,
    karaka: 'marriage',
    karakaLabel: { en: 'marriage & devoted partnership', hi: 'विवाह एवं निष्ठावान साथ' },
  },

  // Surya worship → 1st house vitality
  'chhath-puja': {
    primaryPlanet: 0, // Sun
    primaryHouse: 1,
    karaka: 'vitality',
    karakaLabel: { en: 'vitality & gratitude to the source', hi: 'जीवन-शक्ति एवं स्रोत के प्रति कृतज्ञता' },
  },

  // Sun's northward turn → 10th house transition
  'makar-sankranti': {
    primaryPlanet: 0, // Sun
    primaryHouse: 10,
    karaka: 'transition',
    karakaLabel: { en: 'transition & forward momentum', hi: 'सङ्क्रमण एवं अग्रगति' },
  },
};

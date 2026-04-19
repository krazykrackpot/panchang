/**
 * Classical Vedic gemstone data for all 9 grahas (planets).
 *
 * Sources: Brihat Parashara Hora Shastra, Jataka Parijata, Phaladeepika.
 * Planet IDs follow the project convention: 0=Sun through 8=Ketu.
 *
 * LocaleText includes en/hi/sa at minimum. Other locales fall back to en
 * via the tl() helper from @/lib/utils/trilingual.ts.
 */

import type { LocaleText } from '@/types/panchang';
import type { GemstoneData, MantraData, WearingRules } from './types';

// ---------------------------------------------------------------------------
// Planet friendship table (classical Parashari)
// Key = planet id, value = { friends, enemies, neutral } as planet id arrays
// Rahu (7) treated like Saturn (6), Ketu (8) treated like Mars (2)
// ---------------------------------------------------------------------------
export const PLANET_FRIENDSHIPS: Record<number, { friends: number[]; enemies: number[]; neutral: number[] }> = {
  0: { friends: [1, 2, 4], enemies: [5, 6], neutral: [3] },         // Sun
  1: { friends: [0, 3], enemies: [], neutral: [2, 4, 5, 6] },       // Moon
  2: { friends: [0, 1, 4], enemies: [3], neutral: [5, 6] },         // Mars
  3: { friends: [0, 5], enemies: [1], neutral: [2, 4, 6] },         // Mercury
  4: { friends: [0, 1, 2], enemies: [3, 5], neutral: [6] },         // Jupiter
  5: { friends: [3, 6], enemies: [0, 1], neutral: [2, 4] },         // Venus
  6: { friends: [3, 5], enemies: [0, 1, 2], neutral: [4] },         // Saturn
  7: { friends: [3, 5], enemies: [0, 1, 2], neutral: [4] },         // Rahu (like Saturn)
  8: { friends: [0, 1, 4], enemies: [3], neutral: [5, 6] },         // Ketu (like Mars)
};

// ---------------------------------------------------------------------------
// Sign lord mapping: sign id (1-12) -> planet id (0-8)
// Used to determine sign lord for enemy-sign detection.
// ---------------------------------------------------------------------------
export const SIGN_LORD: Record<number, number> = {
  1: 2,   // Aries -> Mars
  2: 5,   // Taurus -> Venus
  3: 3,   // Gemini -> Mercury
  4: 1,   // Cancer -> Moon
  5: 0,   // Leo -> Sun
  6: 3,   // Virgo -> Mercury
  7: 5,   // Libra -> Venus
  8: 2,   // Scorpio -> Mars
  9: 4,   // Sagittarius -> Jupiter
  10: 6,  // Capricorn -> Saturn
  11: 6,  // Aquarius -> Saturn
  12: 4,  // Pisces -> Jupiter
};

// ---------------------------------------------------------------------------
// Planet name -> planet id mapping (for HouseCusp.lord which is a string)
// ---------------------------------------------------------------------------
export const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// ---------------------------------------------------------------------------
// Minimum Shadbala thresholds (in Shashtiamsas / Rupas)
// Classical standard: Sun=390, Moon=360, Mars=300, Mercury=420, Jupiter=390,
// Venus=330, Saturn=300. Rahu/Ketu don't have classical shadbala but we
// use a reasonable default.
// ---------------------------------------------------------------------------
export const SHADBALA_MINIMUMS: Record<number, number> = {
  0: 390,  // Sun
  1: 360,  // Moon
  2: 300,  // Mars
  3: 420,  // Mercury
  4: 390,  // Jupiter
  5: 330,  // Venus
  6: 300,  // Saturn
  7: 300,  // Rahu (no classical standard — use Saturn's)
  8: 300,  // Ketu (no classical standard — use Mars's)
};

// ---------------------------------------------------------------------------
// Primary gemstone data for each planet
// ---------------------------------------------------------------------------
const GEMSTONE_DATA: Record<number, {
  primary: GemstoneData;
  alternatives: GemstoneData[];
  mantra: MantraData;
  wearingRules: WearingRules;
  donation: { items: string[]; bestDay: string };
}> = {
  // Sun (0) — Ruby
  0: {
    primary: {
      name: { en: 'Ruby', hi: 'माणिक्य', sa: 'माणिक्यम्' },
      sanskritName: 'Manikya',
      color: '#e0115f',
      associatedPlanetId: 0,
      caratRange: '3-6',
    },
    alternatives: [
      { name: { en: 'Red Garnet', hi: 'लाल गार्नेट', sa: 'रक्तगोमेदः' }, sanskritName: 'Raktavarni Gomeda', color: '#c21e23', associatedPlanetId: 0, caratRange: '5-9' },
      { name: { en: 'Sunstone', hi: 'सूर्यकांत मणि', sa: 'सूर्यकान्तमणिः' }, sanskritName: 'Suryakanta Mani', color: '#e77936', associatedPlanetId: 0, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
      beejMantra: 'ॐ ह्रां',
      recitationCount: 7000,
      bestDay: 'Sunday',
    },
    wearingRules: {
      finger: { en: 'Ring finger', hi: 'अनामिका', sa: 'अनामिका' },
      hand: 'right',
      metal: { en: 'Gold', hi: 'सोना', sa: 'सुवर्णम्' },
      minimumCarat: 3,
      bestDay: 'Sunday',
      activationMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    },
    donation: {
      items: ['Wheat', 'Jaggery', 'Red cloth', 'Copper'],
      bestDay: 'Sunday',
    },
  },

  // Moon (1) — Pearl
  1: {
    primary: {
      name: { en: 'Pearl', hi: 'मोती', sa: 'मुक्ता' },
      sanskritName: 'Moti',
      color: '#fdeef4',
      associatedPlanetId: 1,
      caratRange: '4-7',
    },
    alternatives: [
      { name: { en: 'Moonstone', hi: 'चंद्रकांत मणि', sa: 'चन्द्रकान्तमणिः' }, sanskritName: 'Chandrakanta Mani', color: '#adc2d4', associatedPlanetId: 1, caratRange: '5-9' },
      { name: { en: 'White Coral', hi: 'सफेद मूंगा', sa: 'श्वेतप्रवालम्' }, sanskritName: 'Shveta Pravala', color: '#f5f5f5', associatedPlanetId: 1, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
      beejMantra: 'ॐ श्रां',
      recitationCount: 11000,
      bestDay: 'Monday',
    },
    wearingRules: {
      finger: { en: 'Little finger', hi: 'कनिष्ठिका', sa: 'कनिष्ठिका' },
      hand: 'right',
      metal: { en: 'Silver', hi: 'चाँदी', sa: 'रजतम्' },
      minimumCarat: 4,
      bestDay: 'Monday',
      activationMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
    },
    donation: {
      items: ['Rice', 'White cloth', 'Silver', 'Milk'],
      bestDay: 'Monday',
    },
  },

  // Mars (2) — Red Coral
  2: {
    primary: {
      name: { en: 'Red Coral', hi: 'मूंगा', sa: 'प्रवालम्' },
      sanskritName: 'Moonga',
      color: '#ff4040',
      associatedPlanetId: 2,
      caratRange: '5-9',
    },
    alternatives: [
      { name: { en: 'Carnelian', hi: 'कार्नेलियन', sa: 'रक्ताश्मा' }, sanskritName: 'Raktashma', color: '#b31b1b', associatedPlanetId: 2, caratRange: '5-9' },
      { name: { en: 'Red Jasper', hi: 'लाल जैस्पर', sa: 'रक्तयशबम्' }, sanskritName: 'Rakta Yashab', color: '#a52a2a', associatedPlanetId: 2, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      beejMantra: 'ॐ क्रां',
      recitationCount: 10000,
      bestDay: 'Tuesday',
    },
    wearingRules: {
      finger: { en: 'Ring finger', hi: 'अनामिका', sa: 'अनामिका' },
      hand: 'right',
      metal: { en: 'Gold or Copper', hi: 'सोना या तांबा', sa: 'सुवर्णं ताम्रं वा' },
      minimumCarat: 5,
      bestDay: 'Tuesday',
      activationMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    },
    donation: {
      items: ['Red lentils (Masoor dal)', 'Red cloth', 'Jaggery', 'Copper vessel'],
      bestDay: 'Tuesday',
    },
  },

  // Mercury (3) — Emerald
  3: {
    primary: {
      name: { en: 'Emerald', hi: 'पन्ना', sa: 'मरकतम्' },
      sanskritName: 'Panna',
      color: '#50c878',
      associatedPlanetId: 3,
      caratRange: '3-6',
    },
    alternatives: [
      { name: { en: 'Green Tourmaline', hi: 'हरा टूमलीन', sa: 'हरितवैडूर्यम्' }, sanskritName: 'Harita Vaidurya', color: '#009966', associatedPlanetId: 3, caratRange: '5-8' },
      { name: { en: 'Peridot', hi: 'पेरिडॉट', sa: 'हरितमणिः' }, sanskritName: 'Harita Mani', color: '#b4c424', associatedPlanetId: 3, caratRange: '5-8' },
    ],
    mantra: {
      vedic: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
      beejMantra: 'ॐ ब्रां',
      recitationCount: 9000,
      bestDay: 'Wednesday',
    },
    wearingRules: {
      finger: { en: 'Little finger', hi: 'कनिष्ठिका', sa: 'कनिष्ठिका' },
      hand: 'right',
      metal: { en: 'Gold', hi: 'सोना', sa: 'सुवर्णम्' },
      minimumCarat: 3,
      bestDay: 'Wednesday',
      activationMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    },
    donation: {
      items: ['Green moong dal', 'Green cloth', 'Bronze vessel'],
      bestDay: 'Wednesday',
    },
  },

  // Jupiter (4) — Yellow Sapphire
  4: {
    primary: {
      name: { en: 'Yellow Sapphire', hi: 'पुखराज', sa: 'पुष्पराजम्' },
      sanskritName: 'Pukhraj',
      color: '#fada5e',
      associatedPlanetId: 4,
      caratRange: '3-5',
    },
    alternatives: [
      { name: { en: 'Citrine', hi: 'सिट्रीन', sa: 'पीतस्फटिकम्' }, sanskritName: 'Pita Sphatika', color: '#e4d00a', associatedPlanetId: 4, caratRange: '5-9' },
      { name: { en: 'Yellow Topaz', hi: 'पीला पुखराज', sa: 'पीतपुष्पराजम्' }, sanskritName: 'Pita Pushparaja', color: '#ffc87c', associatedPlanetId: 4, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      beejMantra: 'ॐ ग्रां',
      recitationCount: 19000,
      bestDay: 'Thursday',
    },
    wearingRules: {
      finger: { en: 'Index finger', hi: 'तर्जनी', sa: 'तर्जनी' },
      hand: 'right',
      metal: { en: 'Gold', hi: 'सोना', sa: 'सुवर्णम्' },
      minimumCarat: 3,
      bestDay: 'Thursday',
      activationMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    },
    donation: {
      items: ['Turmeric', 'Yellow cloth', 'Chana dal', 'Banana'],
      bestDay: 'Thursday',
    },
  },

  // Venus (5) — Diamond
  5: {
    primary: {
      name: { en: 'Diamond', hi: 'हीरा', sa: 'वज्रम्' },
      sanskritName: 'Heera',
      color: '#b9f2ff',
      associatedPlanetId: 5,
      caratRange: '0.5-1.5',
    },
    alternatives: [
      { name: { en: 'White Sapphire', hi: 'सफेद पुखराज', sa: 'श्वेतपुष्पराजम्' }, sanskritName: 'Shveta Pushparaja', color: '#e8e8e8', associatedPlanetId: 5, caratRange: '3-6' },
      { name: { en: 'White Zircon', hi: 'सफेद जरकन', sa: 'श्वेतजर्कणम्' }, sanskritName: 'Shveta Jarkana', color: '#f0f0f0', associatedPlanetId: 5, caratRange: '3-6' },
    ],
    mantra: {
      vedic: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
      beejMantra: 'ॐ द्रां',
      recitationCount: 16000,
      bestDay: 'Friday',
    },
    wearingRules: {
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      hand: 'right',
      metal: { en: 'Platinum or Silver', hi: 'प्लैटिनम या चाँदी', sa: 'प्लाटिनं रजतं वा' },
      minimumCarat: 0.5,
      bestDay: 'Friday',
      activationMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    },
    donation: {
      items: ['White rice', 'Sugar', 'White cloth', 'Perfume', 'Ghee'],
      bestDay: 'Friday',
    },
  },

  // Saturn (6) — Blue Sapphire
  6: {
    primary: {
      name: { en: 'Blue Sapphire', hi: 'नीलम', sa: 'नीलम्' },
      sanskritName: 'Neelam',
      color: '#0f52ba',
      associatedPlanetId: 6,
      caratRange: '3-6',
    },
    alternatives: [
      { name: { en: 'Amethyst', hi: 'जामुनिया', sa: 'कटेलम्' }, sanskritName: 'Katela', color: '#9966cc', associatedPlanetId: 6, caratRange: '5-9' },
      { name: { en: 'Lapis Lazuli', hi: 'लाजवर्द', sa: 'राजवर्तम्' }, sanskritName: 'Rajavarta', color: '#26619c', associatedPlanetId: 6, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
      beejMantra: 'ॐ प्रां',
      recitationCount: 23000,
      bestDay: 'Saturday',
    },
    wearingRules: {
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      hand: 'right',
      metal: { en: 'Panchdhatu', hi: 'पंचधातु', sa: 'पञ्चधातुः' },
      minimumCarat: 3,
      bestDay: 'Saturday',
      activationMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    },
    donation: {
      items: ['Black sesame (Til)', 'Mustard oil', 'Black cloth', 'Iron'],
      bestDay: 'Saturday',
    },
  },

  // Rahu (7) — Hessonite
  7: {
    primary: {
      name: { en: 'Hessonite', hi: 'गोमेद', sa: 'गोमेदकम्' },
      sanskritName: 'Gomed',
      color: '#c68a1e',
      associatedPlanetId: 7,
      caratRange: '5-9',
    },
    alternatives: [
      { name: { en: 'Orange Zircon', hi: 'नारंगी जरकन', sa: 'नारङ्गजर्कणम्' }, sanskritName: 'Naranga Jarkana', color: '#ff8c00', associatedPlanetId: 7, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
      beejMantra: 'ॐ भ्रां',
      recitationCount: 18000,
      bestDay: 'Saturday',
    },
    wearingRules: {
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      hand: 'right',
      metal: { en: 'Panchdhatu', hi: 'पंचधातु', sa: 'पञ्चधातुः' },
      minimumCarat: 5,
      bestDay: 'Saturday',
      activationMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    },
    donation: {
      items: ['Black blanket', 'Urad dal', 'Coconut', 'Lead'],
      bestDay: 'Saturday',
    },
  },

  // Ketu (8) — Cat's Eye
  8: {
    primary: {
      name: { en: "Cat's Eye", hi: 'लहसुनिया', sa: 'वैडूर्यम्' },
      sanskritName: 'Lehsuniya',
      color: '#c9b458',
      associatedPlanetId: 8,
      caratRange: '3-7',
    },
    alternatives: [
      { name: { en: "Tiger's Eye", hi: 'टाइगर आई', sa: 'व्याघ्रनेत्रम्' }, sanskritName: 'Vyaghra Netra', color: '#e08d3c', associatedPlanetId: 8, caratRange: '5-9' },
    ],
    mantra: {
      vedic: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
      beejMantra: 'ॐ स्रां',
      recitationCount: 17000,
      bestDay: 'Tuesday',
    },
    wearingRules: {
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      hand: 'left',
      metal: { en: 'Panchdhatu', hi: 'पंचधातु', sa: 'पञ्चधातुः' },
      minimumCarat: 3,
      bestDay: 'Tuesday',
      activationMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    },
    donation: {
      items: ['Seven grains', 'Brown blanket', 'Sesame', 'Flag'],
      bestDay: 'Tuesday',
    },
  },
};

/**
 * Get gemstone data for a planet by its id (0-8).
 * Returns undefined for invalid planet ids.
 */
export function getGemstoneDataForPlanet(planetId: number) {
  return GEMSTONE_DATA[planetId];
}

/**
 * Check if a planet is in an enemy sign.
 * @param planetId 0-8
 * @param signId 1-12
 * @returns true if the sign lord is an enemy of the planet
 */
export function isEnemySign(planetId: number, signId: number): boolean {
  const signLordId = SIGN_LORD[signId];
  if (signLordId === undefined) return false;
  // A planet is not in its enemy sign if it is the lord itself
  if (signLordId === planetId) return false;
  const friendships = PLANET_FRIENDSHIPS[planetId];
  if (!friendships) return false;
  return friendships.enemies.includes(signLordId);
}

/**
 * Yoga Achievement Badges — Rarity Classification Engine
 *
 * Scans a KundaliData's yogasComplete array for present yogas, classifies
 * them by rarity, and returns badge metadata sorted legendary-first.
 *
 * Rarity tiers:
 *   - Legendary (<3%): Pancha Mahapurusha yogas, Kaal Sarpa
 *   - Rare (3-10%): Gajakesari, Budhaditya, Viparita Raja, Neechabhanga Raja
 *   - Uncommon (10-20%): Chandra-Mangala, Lakshmi, Saraswati
 */

import type { KundaliData } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface YogaBadge {
  yogaName: { en: string; hi: string };
  rarity: 'legendary' | 'rare' | 'uncommon';
  percentage: string;
  quality: { en: string; hi: string };
  description: { en: string; hi: string };
  formationRule: string;
}

// ---------------------------------------------------------------------------
// Rarity Mapping Table
// ---------------------------------------------------------------------------

interface RarityEntry {
  yogaId: string;
  rarity: 'legendary' | 'rare' | 'uncommon';
  percentage: string;
  quality: { en: string; hi: string };
  description: { en: string; hi: string };
  formationRule: string;
}

const RARITY_TABLE: RarityEntry[] = [
  // --- Legendary (<3%) ---
  {
    yogaId: 'hamsa',
    rarity: 'legendary',
    percentage: '~2% of charts',
    quality: { en: 'Spiritual Wisdom', hi: 'आध्यात्मिक ज्ञान' },
    description: {
      en: 'Jupiter in own or exalted sign in a Kendra bestows rare spiritual depth and wisdom.',
      hi: 'बृहस्पति स्वराशि या उच्च में केन्द्र में — दुर्लभ आध्यात्मिक गहराई और ज्ञान।',
    },
    formationRule: 'Jupiter in own/exalted sign in Kendra (1,4,7,10)',
  },
  {
    yogaId: 'malavya',
    rarity: 'legendary',
    percentage: '~2% of charts',
    quality: { en: 'Venusian Excellence', hi: 'शुक्र उत्कृष्टता' },
    description: {
      en: 'Venus in own or exalted sign in a Kendra grants exceptional beauty, luxury, and artistic talent.',
      hi: 'शुक्र स्वराशि या उच्च में केन्द्र में — असाधारण सौन्दर्य, वैभव और कला।',
    },
    formationRule: 'Venus in own/exalted sign in Kendra (1,4,7,10)',
  },
  {
    yogaId: 'ruchaka',
    rarity: 'legendary',
    percentage: '~2% of charts',
    quality: { en: "Warrior's Edge", hi: 'योद्धा की धार' },
    description: {
      en: 'Mars in own or exalted sign in a Kendra confers courageous leadership and commanding presence.',
      hi: 'मंगल स्वराशि या उच्च में केन्द्र में — साहसी नेतृत्व और प्रभावशाली व्यक्तित्व।',
    },
    formationRule: 'Mars in own/exalted sign in Kendra (1,4,7,10)',
  },
  {
    yogaId: 'bhadra',
    rarity: 'legendary',
    percentage: '~2% of charts',
    quality: { en: 'Mercurial Brilliance', hi: 'बुद्धि की चमक' },
    description: {
      en: 'Mercury in own or exalted sign in a Kendra bestows sharp intellect and eloquent communication.',
      hi: 'बुध स्वराशि या उच्च में केन्द्र में — तीव्र बुद्धि और वाक्पटुता।',
    },
    formationRule: 'Mercury in own/exalted sign in Kendra (1,4,7,10)',
  },
  {
    yogaId: 'shasha',
    rarity: 'legendary',
    percentage: '~2% of charts',
    quality: { en: 'Disciplined Authority', hi: 'अनुशासित अधिकार' },
    description: {
      en: 'Saturn in own or exalted sign in a Kendra confers natural authority and disciplined mastery.',
      hi: 'शनि स्वराशि या उच्च में केन्द्र में — स्वाभाविक अधिकार और अनुशासित कौशल।',
    },
    formationRule: 'Saturn in own/exalted sign in Kendra (1,4,7,10)',
  },
  {
    yogaId: 'kala_sarpa',
    rarity: 'legendary',
    percentage: '~3% of charts',
    quality: { en: 'Karmic Intensity', hi: 'कार्मिक तीव्रता' },
    description: {
      en: 'All planets hemmed between Rahu and Ketu — an intense karmic pattern driving transformation.',
      hi: 'सभी ग्रह राहु-केतु के बीच — गहन कार्मिक प्रवृत्ति जो परिवर्तन लाती है।',
    },
    formationRule: 'All 7 planets between Rahu and Ketu',
  },

  // --- Rare (3-10%) ---
  {
    yogaId: 'gajakesari',
    rarity: 'rare',
    percentage: '~8% of charts',
    quality: { en: 'Wisdom & Prosperity', hi: 'ज्ञान एवं समृद्धि' },
    description: {
      en: 'Jupiter in a Kendra from Moon — a classic marker of lasting wisdom and worldly success.',
      hi: 'चन्द्र से केन्द्र में बृहस्पति — स्थायी ज्ञान और सांसारिक सफलता का चिह्न।',
    },
    formationRule: 'Jupiter in Kendra (1,4,7,10) from Moon',
  },
  {
    yogaId: 'budhaditya',
    rarity: 'rare',
    percentage: '~7% of charts',
    quality: { en: 'Intellectual Radiance', hi: 'बौद्धिक दीप्ति' },
    description: {
      en: 'Sun-Mercury conjunction in a Kendra — brilliant analytical mind with articulate expression.',
      hi: 'सूर्य-बुध केन्द्र में — तीक्ष्ण विश्लेषणात्मक बुद्धि और स्पष्ट अभिव्यक्ति।',
    },
    formationRule: 'Sun and Mercury conjunct in a Kendra house',
  },
  {
    yogaId: 'viparita_raja',
    rarity: 'rare',
    percentage: '~5% of charts',
    quality: { en: 'Triumph Through Adversity', hi: 'विपरीत से विजय' },
    description: {
      en: 'Dusthana lords in dusthana houses — adversity itself becomes the ladder to power.',
      hi: 'दुष्ट भावों के स्वामी दुष्ट भावों में — विपरीत परिस्थितियाँ ही शक्ति का मार्ग बनती हैं।',
    },
    formationRule: 'Lords of 6th/8th/12th placed in other dusthana houses',
  },
  {
    yogaId: 'neechabhanga_raja',
    rarity: 'rare',
    percentage: '~4% of charts',
    quality: { en: 'Phoenix Rising', hi: 'नीच भंग से उत्थान' },
    description: {
      en: 'A debilitated planet with cancellation — the fall becomes the foundation of extraordinary rise.',
      hi: 'नीच ग्रह का भंग — पतन ही असाधारण उत्थान की नींव बनता है।',
    },
    formationRule: 'Debilitated planet with cancellation conditions met',
  },

  // --- Uncommon (10-20%) ---
  {
    yogaId: 'chandra_mangal',
    rarity: 'uncommon',
    percentage: '~12% of charts',
    quality: { en: 'Passionate Drive', hi: 'उत्कट प्रेरणा' },
    description: {
      en: 'Moon-Mars conjunction or mutual aspect — emotional fire fuels relentless ambition.',
      hi: 'चन्द्र-मंगल युति — भावनात्मक अग्नि अथक महत्वाकांक्षा को प्रेरित करती है।',
    },
    formationRule: 'Moon and Mars conjunct or in mutual aspect',
  },
  {
    yogaId: 'lakshmi',
    rarity: 'uncommon',
    percentage: '~10% of charts',
    quality: { en: 'Material Fortune', hi: 'भौतिक सौभाग्य' },
    description: {
      en: 'Strong 9th lord in Kendra or Trikona — the blessings of Lakshmi flow naturally.',
      hi: 'बलवान नवम भाव स्वामी केन्द्र या त्रिकोण में — लक्ष्मी की कृपा स्वाभाविक।',
    },
    formationRule: 'Lord of 9th in Kendra/Trikona in strength',
  },
  {
    yogaId: 'saraswati',
    rarity: 'uncommon',
    percentage: '~10% of charts',
    quality: { en: 'Creative Knowledge', hi: 'सृजनात्मक ज्ञान' },
    description: {
      en: 'Mercury, Venus, and Jupiter in Kendras or Trikonas — the goddess of learning blesses this chart.',
      hi: 'बुध, शुक्र और बृहस्पति केन्द्र/त्रिकोण में — विद्या की देवी की कृपा।',
    },
    formationRule: 'Mercury, Venus, Jupiter in Kendras/Trikonas',
  },
];

/** Rarity sort priority — lower number = higher priority */
const RARITY_PRIORITY: Record<string, number> = {
  legendary: 0,
  rare: 1,
  uncommon: 2,
};

// ---------------------------------------------------------------------------
// Main Detection Function
// ---------------------------------------------------------------------------

/**
 * Scan a KundaliData for rare yogas and return achievement badges.
 * Matches present yogas in `yogasComplete` against the rarity table.
 * Returns badges sorted by rarity (legendary first).
 */
export function detectRareYogas(kundali: KundaliData): YogaBadge[] {
  const yogas = kundali.yogasComplete;
  if (!yogas || yogas.length === 0) return [];

  const badges: YogaBadge[] = [];

  for (const entry of RARITY_TABLE) {
    const match = yogas.find(y => y.id === entry.yogaId && y.present);
    if (!match) continue;

    badges.push({
      yogaName: { en: match.name.en as string, hi: (match.name.hi ?? match.name.en) as string },
      rarity: entry.rarity,
      percentage: entry.percentage,
      quality: entry.quality,
      description: entry.description,
      formationRule: entry.formationRule,
    });
  }

  // Sort by rarity: legendary first, then rare, then uncommon
  badges.sort((a, b) => RARITY_PRIORITY[a.rarity] - RARITY_PRIORITY[b.rarity]);

  return badges;
}

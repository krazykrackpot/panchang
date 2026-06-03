/**
 * Yoga & dosha rarity lookup.
 *
 * Frequency percentages come from JSDoc notes in the rule files themselves
 * (src/lib/kundali/yoga-engine/rules/*.ts — see the "Expected frequency"
 * comments at the top of each file). They reflect natal-chart sampling
 * studies referenced by the engine authors, not user-population stats.
 *
 * Bands group raw percentages into five buckets so the UI can colour-code
 * without exposing false precision.
 */

export type FrequencyBand =
  | 'very-common'   // > 30%
  | 'common'        // 15 – 30%
  | 'uncommon'      // 5 – 15%
  | 'rare'          // 2 – 5%
  | 'very-rare';    // < 2%

export interface YogaFrequencyInfo {
  /** Approximate share of random natal charts in which this yoga fires. */
  pct: number;
  band: FrequencyBand;
}

function band(pct: number): FrequencyBand {
  if (pct > 30) return 'very-common';
  if (pct >= 15) return 'common';
  if (pct >= 5) return 'uncommon';
  if (pct >= 2) return 'rare';
  return 'very-rare';
}

function freq(pct: number): YogaFrequencyInfo {
  return { pct, band: band(pct) };
}

/**
 * Map of yoga/dosha id → frequency info. IDs absent from this map return
 * `null` from `getYogaFrequency()` — the badge simply won't render. Better
 * to omit than to show a guessed value.
 */
const YOGA_FREQUENCY: Record<string, YogaFrequencyInfo> = {
  // Chandra (Moon) yogas — chandra.ts
  'gajakesari': freq(25),
  'sunapha': freq(50),
  'anapha': freq(50),
  'durdhara': freq(30),
  'kemadruma': freq(5),
  'chandra-mangala': freq(8),
  'shakata': freq(17),
  'adhi-yoga': freq(2),

  // Surya (Sun) yogas — surya.ts
  'budhaditya': freq(15),
  'veshi': freq(40),
  'vasi': freq(40),
  'obhayachari': freq(20),

  // Pancha Mahapurusha — mahapurusha.ts (~5-8% each)
  'ruchaka': freq(6),
  'bhadra': freq(6),
  'hamsa': freq(6),
  'malavya': freq(6),
  'shasha': freq(6),

  // Dhana yogas — dhana.ts
  'dhana-general': freq(8),
  'lakshmi': freq(3),
  'kubera': freq(2),
  'kalanidhi': freq(2),
  'mahalakshmi': freq(2),
  'shankha': freq(3),
  'bheri': freq(2),
  'chapa': freq(1),
  'sunapha-dhana': freq(15),
  'dhana-from-5th': freq(5),

  // Raja yogas — raja.ts
  'dharma-karmadhipati': freq(8),
  'kendra-trikona-raja': freq(10),
  'viparita-raja': freq(12),
  'neechabhanga-raja': freq(8),
  'adhi-yoga-raja': freq(2),
  'amala-yoga': freq(3),
  'mahabhagya': freq(4),
  'vasumati': freq(4),
  'chatussagara': freq(3),
  'parvata': freq(4),
  'gauri': freq(2),
  'akhanda-samrajya': freq(1),
  'saraswati': freq(3),

  // Conjunction yogas — conjunction.ts (rough 1/12 to 2/12 per pair)
  'guru-mangal': freq(8),
  'guru-shukra': freq(8),
  'angarak-yoga': freq(5),
  'shukra-shani': freq(8),
  'surya-shani': freq(7),
  'surya-mangal': freq(8),
  'vish-yoga': freq(7),
  'budha-mangal': freq(8),
  'guru-chandra': freq(8),
  'budha-aditya-strong': freq(10),

  // Parivartana — parivartana.ts (lord exchange)
  'maha-parivartana': freq(6),
  'dainya-parivartana': freq(4),
  'khala-parivartana': freq(4),
  'bahu-parivartana': freq(2),

  // Navamsha (D9) yogas — navamsha.ts
  'vargottama-lagna': freq(8),
  'vargottama-planet': freq(20),
  'pushkara-navamsha': freq(15),
  'navamsha-exaltation': freq(8),
  'navamsha-debilitation': freq(8),
  'navamsha-parivartana': freq(3),
  'navamsha-neechabhanga': freq(4),
  'navamsha-rajayoga': freq(6),

  // Daridra — daridra.ts (poverty yogas — uncommon by design)
  'daridra-general': freq(4),
  'daridra-lagna-12': freq(3),
  'daridra-2nd-in-12': freq(3),
  'daridra-11th-in-6-12': freq(3),
  'daridra-malefic-axis': freq(2),
  'daridra-12th-in-1st': freq(3),

  // Doshas — dosha.ts
  // Mangal Dosha — corrected from ~87% (old loose rule) to canonical ~25%.
  'mangal-dosha': freq(25),
  'kaal-sarpa': freq(6),
  'pitru-dosha': freq(8),
  'shrapit-dosha': freq(2),
  'guru-chandal': freq(4),
  'grahan-yoga': freq(6),
  'kalathra-dosha': freq(10),
  'marana-karaka-sthana': freq(15),
  'badhaka-dosha': freq(8),
  'shubha-kartari': freq(12),
  'papa-kartari': freq(12),

  // Sannyasa — sannyasa.ts (renunciation — rare)
  'pravrajya': freq(2),
  'moksha-yoga': freq(2),
  'tapasvi': freq(3),
  'vairagyakarak': freq(3),
  'sada-sannyasa': freq(1),
  'parivraja': freq(1),

  // Arishta — arishta.ts (longevity)
  'alpayu': freq(10),
  'madhyayu': freq(40),
  'deerghayu': freq(20),
  'arishta-bhanga': freq(15),

  // Malika & Nabhasa — extremely rare full-sequence patterns
  'graha-malika': freq(1),
  'graha-sanghata': freq(1),
};

const VERY_RARE_NABHASA = new Set([
  'nabhasa-gola',
  'nabhasa-yuga',
  'nabhasa-shoola',
  'nabhasa-kedara',
  'nabhasa-pasha',
  'nabhasa-damini',
  'nabhasa-veena',
  'nabhasa-ardha-chandra',
  'nabhasa-nauka',
  'nabhasa-koota',
  'nabhasa-chhatra',
  'nabhasa-dhanush',
  'nabhasa-shakata',
  'nabhasa-shringataka',
  'nabhasa-hala',
  'nabhasa-rajju',
  'nabhasa-musala',
  'nabhasa-nala',
  'nabhasa-mala',
  'nabhasa-sarpa',
  'nabhasa-gada',
  'nabhasa-shayana',
  'nabhasa-chaamara',
  'nabhasa-yupa',
  'nabhasa-ishu',
  'nabhasa-shakti',
  'nabhasa-danda',
  'nabhasa-vajra',
]);

export function getYogaFrequency(id: string): YogaFrequencyInfo | null {
  if (YOGA_FREQUENCY[id]) return YOGA_FREQUENCY[id];
  if (VERY_RARE_NABHASA.has(id)) return freq(1);
  return null;
}

/** UI helper — short trilingual label for the band. */
export const BAND_LABEL: Record<FrequencyBand, { en: string; hi: string }> = {
  'very-common':  { en: 'Very common',  hi: 'अति सामान्य' },
  'common':       { en: 'Common',       hi: 'सामान्य' },
  'uncommon':     { en: 'Uncommon',     hi: 'असामान्य' },
  'rare':         { en: 'Rare',         hi: 'दुर्लभ' },
  'very-rare':    { en: 'Very rare',    hi: 'अति दुर्लभ' },
};

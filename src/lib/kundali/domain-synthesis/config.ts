/**
 * Domain Synthesis Configuration
 *
 * Declarative configs for all 8 Personal Pandit life domains.
 * Each entry specifies which houses, planets, divisional charts and
 * Jaimini karakas the synthesis engine should examine, along with
 * the relative scoring weights for each factor.
 *
 * All weights in each config sum to exactly 1.0.
 */

import type { DomainConfig, DomainType } from './types';

// ---------------------------------------------------------------------------
// Shared default weights (all factors equal at base)
// ---------------------------------------------------------------------------

const DEFAULT_WEIGHTS = {
  houseStrength:     0.20,
  lordPlacement:     0.20,
  occupantsAspects:  0.15,
  yogas:             0.15,
  doshas:            0.10,
  dashaActivation:   0.10,
  vargaConfirmation: 0.10,
} as const;

// ---------------------------------------------------------------------------
// Individual domain configs
// ---------------------------------------------------------------------------

const HEALTH_CONFIG: DomainConfig = {
  id: 'health',
  name: {
    en: 'Health',
    hi: 'स्वास्थ्य',
    sa: 'आरोग्य',
  },
  vedicName: {
    en: 'Ārogya',
    hi: 'आरोग्य',
    sa: 'आरोग्यम्',
  },
  icon: 'sun',
  primaryHouses: [1, 6, 8],
  secondaryHouses: [3, 11, 12],
  primaryPlanets: [0, 2, 6], // Sun, Mars, Saturn
  relevantYogaCategories: ['health', 'longevity', 'vitality'],
  relevantDoshas: ['mangal_dosha', 'shani_dosha', 'pitru_dosha'],
  divisionalCharts: ['D30'],
  jaiminiKarakas: ['GK'],
  weights: { ...DEFAULT_WEIGHTS },
};

const WEALTH_CONFIG: DomainConfig = {
  id: 'wealth',
  name: {
    en: 'Wealth',
    hi: 'धन',
    sa: 'धनम्',
  },
  vedicName: {
    en: 'Dhana',
    hi: 'धन',
    sa: 'धनम्',
  },
  icon: 'jupiter',
  primaryHouses: [2, 11],
  secondaryHouses: [1, 5, 9, 10],
  primaryPlanets: [4, 5, 3], // Jupiter, Venus, Mercury
  relevantYogaCategories: ['dhana', 'raja', 'wealth'],
  relevantDoshas: ['daridra_yoga', 'kaal_sarpa'],
  divisionalCharts: ['D2', 'D4'],
  jaiminiKarakas: [],
  weights: { ...DEFAULT_WEIGHTS },
};

const CAREER_CONFIG: DomainConfig = {
  id: 'career',
  name: {
    en: 'Career',
    hi: 'करियर',
    sa: 'व्यवसायः',
  },
  vedicName: {
    en: 'Karma',
    hi: 'कर्म',
    sa: 'कर्म',
  },
  icon: 'saturn',
  primaryHouses: [10, 6],
  secondaryHouses: [1, 2, 7, 11],
  primaryPlanets: [0, 6, 3], // Sun, Saturn, Mercury
  relevantYogaCategories: ['raja', 'career', 'authority'],
  relevantDoshas: ['shani_dosha', 'kaal_sarpa'],
  divisionalCharts: ['D10'],
  jaiminiKarakas: ['AmK'],
  weights: { ...DEFAULT_WEIGHTS },
};

const MARRIAGE_CONFIG: DomainConfig = {
  id: 'marriage',
  name: {
    en: 'Marriage',
    hi: 'विवाह',
    sa: 'विवाहः',
  },
  vedicName: {
    en: 'Vivāha',
    hi: 'विवाह',
    sa: 'विवाहः',
  },
  icon: 'venus',
  primaryHouses: [7],
  secondaryHouses: [1, 2, 5, 8, 12],
  primaryPlanets: [5, 4, 1], // Venus, Jupiter, Moon
  relevantYogaCategories: ['marriage', 'relationship', 'partnership'],
  relevantDoshas: ['mangal_dosha', 'kaal_sarpa', 'shrapit_dosha'],
  divisionalCharts: ['D9'],
  jaiminiKarakas: ['DK'],
  supportsPartnerOverlay: true,
  weights: { ...DEFAULT_WEIGHTS },
};

const CHILDREN_CONFIG: DomainConfig = {
  id: 'children',
  name: {
    en: 'Children',
    hi: 'संतान',
    sa: 'सन्तानम्',
  },
  vedicName: {
    en: 'Santāna',
    hi: 'संतान',
    sa: 'सन्तानम्',
  },
  icon: 'moon',
  primaryHouses: [5],
  secondaryHouses: [1, 2, 7, 9, 11],
  primaryPlanets: [4, 5], // Jupiter, Venus
  relevantYogaCategories: ['santana', 'children', 'progeny'],
  relevantDoshas: ['santana_dosha', 'mangal_dosha'],
  divisionalCharts: ['D7'],
  jaiminiKarakas: ['PK'],
  weights: { ...DEFAULT_WEIGHTS },
};

const FAMILY_CONFIG: DomainConfig = {
  id: 'family',
  name: {
    en: 'Family',
    hi: 'परिवार',
    sa: 'परिवारः',
  },
  vedicName: {
    en: 'Parivāra',
    hi: 'परिवार',
    sa: 'परिवारः',
  },
  icon: 'moon',
  primaryHouses: [4, 9],
  secondaryHouses: [1, 2, 5, 6, 10],
  primaryPlanets: [1, 0, 2], // Moon, Sun, Mars
  relevantYogaCategories: ['family', 'parents', 'property'],
  relevantDoshas: ['pitru_dosha', 'matru_dosha'],
  divisionalCharts: ['D12'],
  jaiminiKarakas: ['MK'],
  weights: { ...DEFAULT_WEIGHTS },
};

const SPIRITUAL_CONFIG: DomainConfig = {
  id: 'spiritual',
  name: {
    en: 'Spiritual',
    hi: 'आध्यात्मिक',
    sa: 'आध्यात्मिकम्',
  },
  vedicName: {
    en: 'Moksha',
    hi: 'मोक्ष',
    sa: 'मोक्षः',
  },
  icon: 'ketu',
  primaryHouses: [9, 12],
  secondaryHouses: [1, 4, 5, 8],
  primaryPlanets: [8, 4, 1], // Ketu, Jupiter, Moon
  relevantYogaCategories: ['moksha', 'spiritual', 'liberation', 'tapas'],
  relevantDoshas: ['pitru_dosha', 'kaal_sarpa'],
  divisionalCharts: ['D20', 'D60'],
  jaiminiKarakas: ['AK'],
  weights: { ...DEFAULT_WEIGHTS },
};

const EDUCATION_CONFIG: DomainConfig = {
  id: 'education',
  name: {
    en: 'Education',
    hi: 'शिक्षा',
    sa: 'शिक्षा',
  },
  vedicName: {
    en: 'Vidyā',
    hi: 'विद्या',
    sa: 'विद्या',
  },
  icon: 'mercury',
  primaryHouses: [4, 5],
  secondaryHouses: [1, 2, 9, 11],
  primaryPlanets: [3, 4], // Mercury, Jupiter
  relevantYogaCategories: ['vidya', 'education', 'intelligence'],
  relevantDoshas: ['budh_dosha'],
  divisionalCharts: ['D24'],
  jaiminiKarakas: [],
  weights: { ...DEFAULT_WEIGHTS },
};

// ---------------------------------------------------------------------------
// Master list
// ---------------------------------------------------------------------------

/**
 * All 8 life domain configurations in canonical display order:
 * health → wealth → career → marriage → children → family → spiritual → education
 */
export const DOMAIN_CONFIGS: DomainConfig[] = [
  HEALTH_CONFIG,
  WEALTH_CONFIG,
  CAREER_CONFIG,
  MARRIAGE_CONFIG,
  CHILDREN_CONFIG,
  FAMILY_CONFIG,
  SPIRITUAL_CONFIG,
  EDUCATION_CONFIG,
];

// ---------------------------------------------------------------------------
// Lookup helper
// ---------------------------------------------------------------------------

/**
 * Returns the `DomainConfig` for a given domain ID, or `undefined` when the
 * ID is not recognised.
 *
 * @example
 * const cfg = getDomainConfig('health');
 * if (cfg) console.log(cfg.primaryHouses); // [1, 6, 8]
 */
export function getDomainConfig(id: string): DomainConfig | undefined {
  return DOMAIN_CONFIGS.find((cfg) => cfg.id === (id as DomainType));
}

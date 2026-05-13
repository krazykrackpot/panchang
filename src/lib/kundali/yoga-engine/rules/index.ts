/**
 * Yoga Engine — All Rules Combined
 *
 * Single export aggregating all 15 rule groups.
 * Import ALL_YOGA_RULES and pass to registerYogaRules() once.
 *
 * Rule groups correspond to classical text chapters:
 * - Mahapurusha: BPHS Ch.34 — 5 great person yogas
 * - Raja: BPHS Ch.34-35 — kendra-trikona lord connections
 * - Per-Lagna Raja: BPHS Ch.34-35 — lagna-specific yogakaraka pairs (12 rules)
 * - Dhana: BPHS Ch.36 — wealth yogas
 * - Daridra: BPHS Ch.36 — poverty/obstruction yogas
 * - Chandra: Phaladeepika Ch.6 — Moon-based yogas
 * - Surya: Phaladeepika Ch.6 — Sun-based yogas
 * - Dosha: Various — classical afflictions
 * - Nabhasa: Phaladeepika Ch.7 — sky-pattern yogas
 * - Malika: Garland yogas — consecutive house chains
 * - Parivartana: Exchange yogas — mutual sign exchange
 * - Conjunction: Specific planet pair yogas
 * - Arishta: Health/longevity afflictions
 * - Sannyasa: Renunciation/spiritual yogas
 * - Navamsha: D9 divisional chart yogas
 * - Tajika: Tajika Neelakanthi — annual chart / planetary relationship yogas
 */

import type { YogaRule } from '../types';
import { MAHAPURUSHA_RULES } from './mahapurusha';
import { CHANDRA_RULES } from './chandra';
import { DOSHA_RULES } from './dosha';
import { RAJA_RULES } from './raja';
import { PER_LAGNA_RAJA_RULES } from './per-lagna-raja';
import { SURYA_RULES } from './surya';
import { DHANA_RULES } from './dhana';
import { NABHASA_RULES } from './nabhasa';
import { MALIKA_RULES } from './malika';
import { PARIVARTANA_RULES } from './parivartana';
import { ARISHTA_RULES } from './arishta';
import { SANNYASA_RULES } from './sannyasa';
import { CONJUNCTION_RULES } from './conjunction';
import { NAVAMSHA_RULES } from './navamsha';
import { DARIDRA_RULES } from './daridra';
import { TAJIKA_RULES } from './tajika';

/**
 * All yoga rules from 16 groups. Pass to registerYogaRules() once per session.
 * Order matches the recommended UI group display order.
 */
export const ALL_YOGA_RULES: YogaRule[] = [
  ...MAHAPURUSHA_RULES,
  ...RAJA_RULES,
  ...PER_LAGNA_RAJA_RULES,
  ...DHANA_RULES,
  ...DARIDRA_RULES,
  ...CHANDRA_RULES,
  ...SURYA_RULES,
  ...DOSHA_RULES,
  ...NABHASA_RULES,
  ...MALIKA_RULES,
  ...PARIVARTANA_RULES,
  ...CONJUNCTION_RULES,
  ...ARISHTA_RULES,
  ...SANNYASA_RULES,
  ...NAVAMSHA_RULES,
  ...TAJIKA_RULES,
];

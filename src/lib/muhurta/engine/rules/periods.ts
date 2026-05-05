/**
 * Period Rules — 6 day-level hard veto rules
 *
 * All rules are scope: 'day', tier: 0 (absolute), effect: 'veto'.
 * Evaluated once per day before window scanning. Cannot be cancelled.
 *
 * Each wraps an existing function from classical-checks.ts.
 *
 * Sources: Muhurta Chintamani, Dharma Sindhu, BPHS
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import {
  checkVivahCombustion,
  isAdhikaMasa,
  checkChaturmas,
  isProhibitedSolarMonth,
  isDakshinayana,
  checkShishutva,
} from '@/lib/muhurta/classical-checks';

// Shared helper to build a RuleAssessment from a rule + partial fields
function vetoAssessment(
  rule: MuhurtaRule,
  reason: { en: string; hi: string },
): RuleAssessment {
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    category: rule.category,
    source: rule.source,
    tier: 0,
    points: 0,
    maxPoints: 0,
    vetoed: true,
    severity: 'critical',
    reason: { en: reason.en, hi: reason.hi, sa: reason.en },
  };
}

// Activities for samskara vetoes (all samskaras except namakarana)
const SAMSKARA_ACTIVITIES: ExtendedActivityId[] = [
  'marriage', 'engagement', 'griha_pravesh', 'upanayana', 'mundan',
];

function isApplicable(ctx: RuleContext, activities: ExtendedActivityId[]): boolean {
  return activities.includes(ctx.activity);
}

function parseDate(dateStr: string): { y: number; m: number; d: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { y, m, d };
}

// ---------------------------------------------------------------------------
// 1. venus-jupiter-combustion
// ---------------------------------------------------------------------------
const venusJupiterCombustion: MuhurtaRule = {
  id: 'venus-jupiter-combustion',
  name: {
    en: 'Venus/Jupiter Combustion',
    hi: 'शुक्र/गुरु अस्त',
    sa: 'शुक्रगुर्वस्तम्',
  },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: SAMSKARA_ACTIVITIES,
  source: 'MC + Dharma Sindhu',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isApplicable(ctx, SAMSKARA_ACTIVITIES)) return null;

    // Use pre-computed combustion from context if available
    const combustion = ctx.combustion ?? checkVivahCombustion(ctx.jdNoon);
    if (!combustion.vetoed) return null;

    const planets = combustion.planets.join(' & ');
    return vetoAssessment(this, {
      en: `${planets} combust — samskaras forbidden`,
      hi: `${planets} अस्त — संस्कार वर्जित`,
    });
  },
};

// ---------------------------------------------------------------------------
// 2. adhika-masa
// ---------------------------------------------------------------------------
const adhikaMasa: MuhurtaRule = {
  id: 'adhika-masa',
  name: {
    en: 'Adhika Masa',
    hi: 'अधिक मास',
    sa: 'अधिकमासः',
  },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: SAMSKARA_ACTIVITIES,
  source: 'Dharma Sindhu',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isApplicable(ctx, SAMSKARA_ACTIVITIES)) return null;

    // Use pre-computed lunar masa from context if available
    if (ctx.lunarMasa) {
      if (!ctx.lunarMasa.isAdhika) return null;
    } else {
      const { y, m, d } = parseDate(ctx.date);
      if (!isAdhikaMasa(y, m, d)) return null;
    }

    return vetoAssessment(this, {
      en: 'Adhika Masa (intercalary month) — samskaras forbidden',
      hi: 'अधिक मास (मलमास) — संस्कार वर्जित',
    });
  },
};

// ---------------------------------------------------------------------------
// 3. chaturmas
// ---------------------------------------------------------------------------
const CHATURMAS_ACTIVITIES: ExtendedActivityId[] = [
  'marriage', 'engagement', 'griha_pravesh', 'upanayana',
];

const chaturmas: MuhurtaRule = {
  id: 'chaturmas',
  name: {
    en: 'Chaturmas',
    hi: 'चातुर्मास',
    sa: 'चातुर्मासम्',
  },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: CHATURMAS_ACTIVITIES,
  source: 'Dharma Sindhu',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isApplicable(ctx, CHATURMAS_ACTIVITIES)) return null;

    const { y, m, d } = parseDate(ctx.date);
    const result = checkChaturmas(y, m, d);
    // Only hard-veto on 'full' months; 'partial' is a soft penalty handled elsewhere
    if (result !== 'full') return null;

    return vetoAssessment(this, {
      en: 'Chaturmas (Harishayana period) — samskaras forbidden',
      hi: 'चातुर्मास (हरिशयन काल) — संस्कार वर्जित',
    });
  },
};

// ---------------------------------------------------------------------------
// 4. kharmas
// ---------------------------------------------------------------------------
const KHARMAS_ACTIVITIES: ExtendedActivityId[] = [
  'marriage', 'engagement', 'griha_pravesh',
];

const kharmas: MuhurtaRule = {
  id: 'kharmas',
  name: {
    en: 'Kharmas (Prohibited Solar Month)',
    hi: 'खरमास (निषिद्ध सौर मास)',
    sa: 'खरमासः',
  },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: KHARMAS_ACTIVITIES,
  source: 'Dharma Sindhu',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isApplicable(ctx, KHARMAS_ACTIVITIES)) return null;

    if (!isProhibitedSolarMonth(ctx.jdNoon)) return null;

    return vetoAssessment(this, {
      en: 'Kharmas — Sun in prohibited sign, auspicious activities forbidden',
      hi: 'खरमास — सूर्य निषिद्ध राशि में, शुभ कार्य वर्जित',
    });
  },
};

// ---------------------------------------------------------------------------
// 5. dakshinayana
// ---------------------------------------------------------------------------
const DAKSHINAYANA_ACTIVITIES: ExtendedActivityId[] = ['mundan'];

const dakshinayana: MuhurtaRule = {
  id: 'dakshinayana',
  name: {
    en: 'Dakshinayana',
    hi: 'दक्षिणायन',
    sa: 'दक्षिणायनम्',
  },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: DAKSHINAYANA_ACTIVITIES,
  source: 'MC Chudakarana Prakarana',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isApplicable(ctx, DAKSHINAYANA_ACTIVITIES)) return null;

    if (!isDakshinayana(ctx.jdNoon)) return null;

    return vetoAssessment(this, {
      en: 'Dakshinayana — Mundan requires Uttarayana (Sun\'s northern course)',
      hi: 'दक्षिणायन — मुंडन के लिए उत्तरायण आवश्यक',
    });
  },
};

// ---------------------------------------------------------------------------
// 6. shishutva
// ---------------------------------------------------------------------------
const SHISHUTVA_ACTIVITIES: ExtendedActivityId[] = [
  'marriage', 'engagement', 'griha_pravesh',
];

const shishutva: MuhurtaRule = {
  id: 'shishutva',
  name: {
    en: 'Shishutva (Infant Planet)',
    hi: 'शिशुत्व (बाल ग्रह)',
    sa: 'शिशुत्वम्',
  },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: SHISHUTVA_ACTIVITIES,
  source: 'BPHS',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isApplicable(ctx, SHISHUTVA_ACTIVITIES)) return null;

    if (!checkShishutva(ctx.jdNoon)) return null;

    return vetoAssessment(this, {
      en: 'Shishutva — Venus/Jupiter recently emerged from combustion, benefic influence too weak',
      hi: 'शिशुत्व — शुक्र/गुरु हाल ही में अस्त से उदित, शुभ प्रभाव अपर्याप्त',
    });
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const PERIOD_RULES: MuhurtaRule[] = [
  venusJupiterCombustion,
  adhikaMasa,
  chaturmas,
  kharmas,
  dakshinayana,
  shishutva,
];

/**
 * Snapshot storage codec for `evaluatedYogas`.
 *
 * Each `EvaluatedYoga` mixes ~5 chart-specific fields (id, present,
 * strength, involvedPlanets, cancellationStatus, interactions,
 * patternData) with ~10 static catalog fields (name, group, subGroup,
 * isAuspicious, classicalRef, formationRule, description,
 * affectedDomains, domainImpactWeight, domainWeights).
 *
 * The catalog fields are identical across every user — the same
 * trilingual prose, formation rules, and classical references. Until
 * 2026-06-09 we stored them denormalised into every kundali_snapshots
 * row, which made the `full_kundali` JSONB column ~420 KB per row
 * (~85% of the row's total bytes). At 1k users that's ~470 MB just
 * for redundant yoga catalog copies.
 *
 * This codec strips the catalog fields before storage and re-merges
 * them from `ALL_YOGA_RULES` at read time. The shape consumers
 * receive is byte-identical to the pre-codec era.
 *
 * Contract: anything reading `full_kundali.evaluatedYogas` from
 * `kundali_snapshots` MUST run the result through
 * `rehydrateKundali()` (or `rehydrateEvaluatedYogas()` directly)
 * before passing to a downstream consumer that reads catalog fields.
 * `getFreshSnapshot()` (server) and `useFreshSnapshot()` (client)
 * already do this.
 */
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import { ALL_YOGA_RULES } from '@/lib/kundali/yoga-engine/rules';
import type { KundaliData } from '@/types/kundali';

/**
 * Lean per-user payload for one yoga. Mirrors the chart-specific
 * subset of EvaluatedYoga — see the codec doc above for which fields
 * are catalog (omitted) vs chart-specific (kept).
 *
 * `affectedDomains` is per-user because the engine overrides
 * `rule.affectedDomains` from `detection.customData.domains` for
 * Malika and Parivartana yogas (engine.ts:231). When omitted from
 * storage, rehydration falls back to `rule.affectedDomains`.
 */
export interface StoredEvaluatedYoga {
  id: string;
  present: boolean;
  strength: EvaluatedYoga['strength'];
  involvedPlanets: number[];
  affectedDomains?: EvaluatedYoga['affectedDomains'];
  cancellationStatus?: EvaluatedYoga['cancellationStatus'];
  interactions?: EvaluatedYoga['interactions'];
  patternData?: EvaluatedYoga['patternData'];
}

const RULES_BY_ID: Map<string, (typeof ALL_YOGA_RULES)[number]> = new Map(
  ALL_YOGA_RULES.map(r => [r.id, r]),
);

/**
 * Drop static catalog fields from a full EvaluatedYoga.
 * Preserves the seven chart-specific fields the engine produces per chart.
 */
export function stripEvaluatedYoga(y: EvaluatedYoga): StoredEvaluatedYoga {
  const rule = RULES_BY_ID.get(y.id);
  // Only persist affectedDomains if the engine produced a chart-specific
  // value that differs from the catalog default. Cheap comparison via
  // JSON because both sides are small arrays / 'all'.
  const ruleDomains = rule?.affectedDomains;
  const persistDomains =
    ruleDomains !== undefined
      ? JSON.stringify(y.affectedDomains) !== JSON.stringify(ruleDomains)
      : y.affectedDomains !== undefined;
  return {
    id: y.id,
    present: y.present,
    strength: y.strength,
    involvedPlanets: y.involvedPlanets,
    ...(persistDomains && { affectedDomains: y.affectedDomains }),
    ...(y.cancellationStatus !== undefined && { cancellationStatus: y.cancellationStatus }),
    ...(y.interactions !== undefined && { interactions: y.interactions }),
    ...(y.patternData !== undefined && { patternData: y.patternData }),
  };
}

/**
 * Re-merge static catalog fields from ALL_YOGA_RULES back onto a
 * stored row. If the stored entry references an `id` no longer in
 * the catalog (yoga removed in a later release), the entry is
 * returned with sensible defaults — never dropped, so historical
 * snapshots remain consumable while ENGINE_VERSION-driven recompute
 * cleans them up on the next read.
 *
 * The reconstructed shape mirrors `evaluateYogaRule()` in
 * @/lib/kundali/yoga-engine/engine.ts:208 — Sanskrit (`sa`) falls
 * back to English, and absent yogas (`present === false`) use
 * `rule.absentDescription` when defined, otherwise `rule.description`.
 */
export function rehydrateEvaluatedYoga(stored: StoredEvaluatedYoga): EvaluatedYoga {
  const rule = RULES_BY_ID.get(stored.id);
  if (!rule) {
    return {
      ...stored,
      name: { en: stored.id, hi: stored.id, sa: stored.id },
      group: 'conjunction',
      isAuspicious: false,
      classicalRef: '',
      formationRule: { en: '', hi: '', sa: '' },
      description: { en: '', hi: '', sa: '' },
      affectedDomains: 'all',
      domainImpactWeight: 1,
    } as EvaluatedYoga;
  }
  // Engine convention: sa falls back to en. Use `?? en` so any future
  // catalog entry that adds a real `.sa` translation is preserved
  // instead of silently overwritten (Gemini PR #624 review).
  const formationRule = {
    en: rule.formationRule.en,
    hi: rule.formationRule.hi,
    sa: (rule.formationRule as { sa?: string }).sa ?? rule.formationRule.en,
  };
  // Engine convention: absent yogas prefer rule.absentDescription when defined.
  const descBase = !stored.present && rule.absentDescription ? rule.absentDescription : rule.description;
  const description = {
    en: descBase.en,
    hi: descBase.hi,
    sa: (descBase as { sa?: string }).sa ?? descBase.en,
  };
  return {
    ...stored,
    name: rule.name,
    group: rule.group,
    ...(rule.subGroup !== undefined && { subGroup: rule.subGroup }),
    isAuspicious: rule.isAuspicious,
    classicalRef: rule.classicalRef,
    formationRule,
    description,
    // Per-user override wins when present (Malika/Parivartana); else
    // falls back to the catalog default.
    affectedDomains: stored.affectedDomains ?? rule.affectedDomains,
    domainImpactWeight: rule.domainImpactWeight,
    ...(rule.domainWeights !== undefined && { domainWeights: rule.domainWeights }),
  };
}

/**
 * Strip catalog fields off every yoga in a KundaliData before storage.
 * Mutates a shallow clone — the input is not modified.
 */
export function stripKundaliForStorage(kundali: KundaliData): KundaliData {
  if (!kundali?.evaluatedYogas) return kundali;
  const stripped = kundali.evaluatedYogas.map(stripEvaluatedYoga);
  return {
    ...kundali,
    evaluatedYogas: stripped as unknown as KundaliData['evaluatedYogas'],
  };
}

/**
 * Re-merge catalog fields onto every yoga in a previously stored
 * KundaliData. Safe to call on already-rehydrated data (the spread
 * preserves whatever catalog fields are already present).
 *
 * Accepts `undefined` (callers commonly pass an absent value) but
 * always returns `KundaliData | null` — `undefined` collapses to `null`
 * at the boundary so callsites can rely on a two-state union.
 */
export function rehydrateKundali(kundali: KundaliData | null | undefined): KundaliData | null {
  if (!kundali || !kundali.evaluatedYogas) return kundali ?? null;
  const rehydrated = kundali.evaluatedYogas.map(y =>
    rehydrateEvaluatedYoga(y as unknown as StoredEvaluatedYoga),
  );
  return { ...kundali, evaluatedYogas: rehydrated };
}

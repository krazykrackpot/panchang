/**
 * Per-category Zod schemas for the `analysis` block of BrihaspatiContext.
 *
 * REVIEW_TRACKER P4: previously `analysis: Record<string, unknown>` was
 * completely unstructured. Rules #4 and #5 referenced data that may or
 * may not be inside it; if Layer-2 filled it sparsely the LLM invented
 * to fill the silence.
 *
 * The schemas below are PERMISSIVE on day 1 — they document expected
 * shape but don't reject extra fields, and every field is optional. As
 * engine output stabilises we tighten them.
 *
 * Validation strategy: `buildContext()` runs the schema with `safeParse`
 * and logs (not throws) on mismatch. The unrecognised-shape row still
 * gets answered; we just record `analysis_schema_pass: boolean` on the
 * persisted brihaspati_questions row so the training-data flywheel can
 * filter on it.
 */

import { z } from 'zod';
import type { BrihaspatiCategory } from '../types';

// ── Shared primitives ────────────────────────────────────────────────────

const DignityLevel = z.enum(['exalted', 'own', 'mooltrikona', 'friendly', 'neutral', 'enemy', 'debilitated']).or(z.string());

const PlanetReference = z
  .object({
    planet: z.string().optional(),
    sign: z.union([z.string(), z.number()]).optional(),
    house: z.number().optional(),
    dignity: DignityLevel.optional(),
    strength: z.number().optional(),
  })
  .passthrough();

const DashaWindow = z
  .object({
    lord: z.string().optional(),
    sub: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    effect: z.string().optional(),
  })
  .passthrough();

const TransitWindow = z
  .object({
    planet: z.string().optional(),
    house: z.number().optional(),
    sign: z.union([z.string(), z.number()]).optional(),
    start: z.string().optional(),
    end: z.string().optional(),
  })
  .passthrough();

// ── Per-category schemas ─────────────────────────────────────────────────

const CareerAnalysis = z
  .object({
    tenth_lord_state: z.string().optional(),
    tenth_house_state: z.string().optional(),
    dasa_affecting: z.string().optional(),
    dignity_of_significators: z.array(PlanetReference).optional(),
    yoga_summary: z.string().optional(),
  })
  .passthrough();

const MarriageAnalysis = z
  .object({
    seventh_house_state: z.string().optional(),
    seventh_lord_state: z.string().optional(),
    kuja_dosha: z.string().optional(),
    manglik: z.boolean().optional(),
    kalatra_karaka_state: z.string().optional(),
    timing_windows: z.array(DashaWindow).optional(),
  })
  .passthrough();

const HealthAnalysis = z
  .object({
    lagna_lord_strength: z.string().optional(),
    sixth_house_state: z.string().optional(),
    eighth_house_state: z.string().optional(),
    malefic_transits: z.array(TransitWindow).optional(),
  })
  .passthrough();

const FinanceAnalysis = z
  .object({
    second_house_state: z.string().optional(),
    eleventh_house_state: z.string().optional(),
    dhana_karaka_state: z.string().optional(),
    wealth_score: z.number().optional(),
    activating_dasha: DashaWindow.optional(),
  })
  .passthrough();

const ChildrenAnalysis = z
  .object({
    fifth_house_state: z.string().optional(),
    fifth_lord_state: z.string().optional(),
    putra_karaka_state: z.string().optional(),
    timing_windows: z.array(DashaWindow).optional(),
  })
  .passthrough();

const EducationAnalysis = z
  .object({
    mercury_state: z.string().optional(),
    jupiter_state: z.string().optional(),
    fourth_house_state: z.string().optional(),
    fifth_house_state: z.string().optional(),
  })
  .passthrough();

const DashaAnalysis = z
  .object({
    current_mahadasha: DashaWindow.optional(),
    current_antardasha: DashaWindow.optional(),
    upcoming: z.array(DashaWindow).optional(),
    activating_houses: z.array(z.number()).optional(),
  })
  .passthrough();

const RemediesAnalysis = z
  .object({
    weakest_planet: PlanetReference.optional(),
    flagged_doshas: z.array(z.string()).optional(),
  })
  .passthrough();

const CompatibilityAnalysis = z
  .object({
    ashta_kuta_score: z.number().optional(),
    seventh_lords: z.array(PlanetReference).optional(),
    moon_compatibility: z.string().optional(),
  })
  .passthrough();

const TimingAnalysis = z
  .object({
    candidate_windows: z.array(DashaWindow).optional(),
    chandra_bala: z.number().optional(),
    tara_bala: z.string().optional(),
  })
  .passthrough();

const TransitAnalysis = z
  .object({
    primary_transit: TransitWindow.optional(),
    activated_houses: z.array(z.number()).optional(),
    colouring_dasha: DashaWindow.optional(),
  })
  .passthrough();

const GeneralAnalysis = z
  .object({
    strongest_planet: PlanetReference.optional(),
    weakest_planet: PlanetReference.optional(),
    centre_of_gravity: z.string().optional(),
    current_dasha: DashaWindow.optional(),
  })
  .passthrough();

const SCHEMAS: Record<BrihaspatiCategory, z.ZodTypeAny> = {
  career: CareerAnalysis,
  marriage: MarriageAnalysis,
  health: HealthAnalysis,
  finance: FinanceAnalysis,
  children: ChildrenAnalysis,
  education: EducationAnalysis,
  dasha: DashaAnalysis,
  remedies: RemediesAnalysis,
  compatibility: CompatibilityAnalysis,
  timing: TimingAnalysis,
  transit: TransitAnalysis,
  general: GeneralAnalysis,
};

/**
 * Validate an analysis blob against the schema for a category. Returns
 * `{ ok: true }` on pass, `{ ok: false, errors }` on fail. Never
 * throws — caller decides what to do (typically: log + persist + still
 * answer the user via Tier 0 fallback if strict-block is on).
 */
export function validateAnalysis(
  category: BrihaspatiCategory,
  analysis: Record<string, unknown>,
): { ok: true } | { ok: false; errors: string[] } {
  const schema = SCHEMAS[category];
  const result = schema.safeParse(analysis);
  if (result.success) return { ok: true };
  return {
    ok: false,
    errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
  };
}

export { SCHEMAS as CATEGORY_ANALYSIS_SCHEMAS };

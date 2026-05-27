/**
 * Layer-2 router — given a classified category, returns the engine names
 * that must be invoked to build the LLM context, and produces a
 * shape-correct BrihaspatiContext from a kundali snapshot.
 *
 * Per validation-wall Layer 2: the LLM cannot pick which engines run —
 * the mapping below is the contract.
 *
 * Engine identifiers correspond to existing modules in src/lib/*:
 *   tippanni      → src/lib/kundali/tippanni-engine.ts
 *   dasha         → src/lib/kundali/dasha-effects-enhanced.ts
 *                   src/lib/kundali/dasha-prognosis.ts
 *   transit       → src/lib/transits/* (activation, gochar, sade-sati)
 *   domain        → src/lib/kundali/domain-synthesis.ts
 *   muhurta       → src/lib/muhurta/*
 *   ashta-kuta    → src/lib/matching/ashta-kuta.ts
 *   remedies      → src/lib/kundali/remedies-enhanced.ts
 *
 * The actual call into these modules happens at the API-route level
 * (Phase 9 backend wiring), where a real kundali snapshot is available.
 * This file only declares what is wired and produces shape-correct
 * context objects.
 */

import {
  type BrihaspatiCategory,
  type BrihaspatiContext,
  type BrihaspatiLocale,
  type BrihaspatiSubject,
} from './types';
import { filterForCategory } from './router/category-filters';
import { validateAnalysis } from './router/schemas';

/** Engine names invoked per category. Source of truth for Layer-2 wiring. */
export type EngineName =
  | 'tippanni'
  | 'dasha'
  | 'transit'
  | 'domain'
  | 'muhurta'
  | 'ashta-kuta'
  | 'remedies'
  | 'shadbala';

export const CATEGORY_ENGINES: Record<BrihaspatiCategory, readonly EngineName[]> = {
  career:        ['domain', 'dasha', 'transit', 'tippanni'],
  marriage:      ['domain', 'dasha', 'transit', 'tippanni'],
  health:        ['domain', 'tippanni', 'remedies'],
  finance:       ['domain', 'dasha', 'transit', 'muhurta'],
  children:      ['domain', 'dasha', 'transit', 'tippanni'],
  education:     ['domain', 'dasha', 'tippanni'],
  dasha:         ['dasha', 'transit'],
  remedies:      ['remedies', 'shadbala', 'tippanni'],
  compatibility: ['ashta-kuta', 'tippanni', 'domain'],
  timing:        ['muhurta', 'transit'],
  transit:       ['transit', 'tippanni'],
  general:       ['tippanni', 'dasha', 'transit'],
} as const;

/**
 * Minimal-shape kundali snapshot. The real type lives in
 * src/types/kundali.ts but we accept a loose contract here so the
 * router doesn't drag the full type system across files; concrete
 * wiring will use the real KundaliData type at the call site.
 */
export interface RouterKundali {
  engineVersion: string;
  chart: Record<string, unknown>;
  dashas?: Record<string, unknown>;
  yogas?: Record<string, unknown>[];
  doshas?: Record<string, unknown>[];
  transits?: Record<string, unknown>[];
  analysis?: Record<string, unknown>;
}

export interface BuildContextInput {
  category: BrihaspatiCategory;
  locale: BrihaspatiLocale;
  question: string;
  kundali: RouterKundali;
  subject?: BrihaspatiSubject;
  /** Carry-through for the parent-Bhava-proxy directive. See type
   *  definition on BrihaspatiContext. */
  parentBhavaProxy?: {
    bhava: number;
    relative: string;
    label: { en: string; hi: string };
  };
  /**
   * Pre-formatted health context block from `buildHealthContext()`.
   * Pass only when the question is health-related (detected via
   * `questionIsHealthRelated()`). Absent → not forwarded to the LLM.
   */
  healthContext?: string;
}

/**
 * Produce a shape-correct BrihaspatiContext for the LLM. This is the
 * authoritative "what to tell the LLM" function — Layer 3 sees only
 * what this returns.
 *
 * Empty arrays / objects are preserved rather than dropped so the LLM
 * never has to guess whether a field exists; absence is encoded as
 * length zero.
 */
export function buildContext(input: BuildContextInput): BrihaspatiContext {
  const { category, locale, question, kundali, subject, parentBhavaProxy, healthContext } = input;
  // Layer-2: filter the kundali to a category-specific slice. The LLM
  // never sees the full chart for a marriage question, only the marriage
  // significators. See `router/category-filters.ts`.
  const slice = filterForCategory(category, kundali);

  // P4: validate the analysis shape against the per-category Zod schema.
  // Log-only — schemas are permissive at launch. Strict-block (drop to
  // template tier) is a future cut-over.
  const v = validateAnalysis(category, slice.analysis);
  if (!v.ok) {
    console.error(`[brihaspati] analysis schema mismatch for ${category}:`, v.errors);
  }

  return {
    category,
    locale,
    question,
    engineVersion: kundali.engineVersion,
    focus: slice.focus,
    chart: slice.chart,
    dashas: slice.dashas,
    yogas: slice.yogas,
    doshas: slice.doshas,
    transits: slice.transits,
    analysis: slice.analysis,
    remedies: slice.remedies,
    subject: subject ?? { kind: 'self' },
    parentBhavaProxy,
    healthContext: healthContext || undefined,
  };
}

/**
 * Return the engine list for a category. Pure function; safe to call
 * client-side (no DB/network dependencies).
 */
export function enginesFor(category: BrihaspatiCategory): readonly EngineName[] {
  return CATEGORY_ENGINES[category];
}

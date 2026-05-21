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
} from './types';

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
  const { category, locale, question, kundali } = input;
  return {
    category,
    locale,
    question,
    engineVersion: kundali.engineVersion,
    chart: kundali.chart,
    dashas: kundali.dashas ?? {},
    yogas: kundali.yogas ?? [],
    doshas: kundali.doshas ?? [],
    transits: kundali.transits ?? [],
    analysis: kundali.analysis ?? {},
  };
}

/**
 * Return the engine list for a category. Pure function; safe to call
 * client-side (no DB/network dependencies).
 */
export function enginesFor(category: BrihaspatiCategory): readonly EngineName[] {
  return CATEGORY_ENGINES[category];
}

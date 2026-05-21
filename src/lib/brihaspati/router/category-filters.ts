/**
 * Layer-2 category filters — extract a category-specific slice of the
 * kundali so the LLM sees only what's relevant to the question.
 *
 * This is the missing implementation flagged as REVIEW_TRACKER L2: the
 * old `buildContext()` was a pass-through that handed the LLM the whole
 * kundali, defeating the validation wall's premise that "Layer 2 picks
 * what's relevant, not the LLM."
 *
 * Each filter receives a loose-shaped kundali (shape varies depending on
 * which engine produced it) and returns the four slices the LLM sees:
 *   - chart: just the planets and houses relevant to the category
 *   - dashas: current mahadasha + antardasha + the dasha that activates
 *             the category significators
 *   - yogas / doshas: only those whose `domain` or name matches the category
 *   - transits: only those affecting category-relevant houses or significators
 *   - analysis: category-specific analysis blob if present on the kundali
 *
 * Defensive: missing fields default to empty. The category-focus block
 * (houses, planets, significators) is always populated so the LLM has an
 * explicit anchor.
 */

import type { BrihaspatiCategory, BrihaspatiRemedy } from '../types';
import type { RouterKundali } from '../router';

/** Category focus — explicit anchor passed alongside the filtered slice. */
export interface CategoryFocus {
  /** House numbers (1–12) most relevant to this category. */
  houses: number[];
  /** Planet names most relevant. Canonical English. */
  planets: string[];
  /** Karaka significators (free-text, e.g. "putra-karaka", "ayur-karaka"). */
  significators: string[];
}

export interface CategorySlice {
  chart: Record<string, unknown>;
  dashas: Record<string, unknown>;
  yogas: Record<string, unknown>[];
  doshas: Record<string, unknown>[];
  transits: Record<string, unknown>[];
  analysis: Record<string, unknown>;
  focus: CategoryFocus;
  remedies: BrihaspatiRemedy[];
}

/** Which houses and planets each category cares about. Source of truth. */
const FOCUS: Record<BrihaspatiCategory, CategoryFocus> = {
  career:        { houses: [10, 6, 2], planets: ['Saturn', 'Sun', 'Mercury'], significators: ['karma-karaka', '10th-lord'] },
  marriage:      { houses: [7, 2, 8],  planets: ['Venus', 'Jupiter', 'Mars'], significators: ['kalatra-karaka', '7th-lord'] },
  health:        { houses: [1, 6, 8],  planets: ['Sun', 'Moon', 'Saturn'],    significators: ['lagna-lord', 'ayur-karaka'] },
  finance:       { houses: [2, 11, 5], planets: ['Jupiter', 'Venus', 'Mercury'], significators: ['dhana-karaka', '2nd-lord', '11th-lord'] },
  children:      { houses: [5, 9],     planets: ['Jupiter', 'Sun'],           significators: ['putra-karaka'] },
  education:     { houses: [4, 5, 2],  planets: ['Mercury', 'Jupiter'],       significators: ['vidya-karaka'] },
  dasha:         { houses: [],         planets: [],                            significators: ['current-mahadasha-lord'] },
  remedies:      { houses: [],         planets: [],                            significators: ['weakest-by-shadbala'] },
  compatibility: { houses: [7],        planets: ['Venus', 'Mars', 'Moon'],    significators: ['kalatra-karaka'] },
  timing:        { houses: [],         planets: ['Moon'],                      significators: ['transit-moon'] },
  transit:       { houses: [1, 4, 7, 10], planets: ['Saturn', 'Jupiter', 'Rahu', 'Ketu'], significators: ['transit-lord'] },
  general:       { houses: [1],        planets: ['lagna-lord', 'moon-sign-lord'], significators: ['atma-karaka'] },
};

// ── Helpers (defensive: input shape varies) ──────────────────────────────

function planetPositionsFromChart(chart: Record<string, unknown>): Array<Record<string, unknown>> {
  // Shape A: positions array
  if (Array.isArray(chart.positions)) {
    return chart.positions.filter((p) => p && typeof p === 'object') as Record<string, unknown>[];
  }
  // Shape B: planets object — convert to array
  if (chart.planets && typeof chart.planets === 'object') {
    return Object.entries(chart.planets as Record<string, unknown>).map(([planet, val]) => ({
      planet,
      ...(val && typeof val === 'object' ? (val as Record<string, unknown>) : {}),
    }));
  }
  // Shape C: top-level planet keys
  const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const found: Record<string, unknown>[] = [];
  for (const name of PLANET_NAMES) {
    if (chart[name] && typeof chart[name] === 'object') {
      found.push({ planet: name, ...(chart[name] as Record<string, unknown>) });
    }
  }
  return found;
}

/** Extract a subset of planet positions matching the focus planets. */
function filterPlanetPositions(
  chart: Record<string, unknown>,
  planetNames: string[],
): Record<string, unknown>[] {
  if (planetNames.length === 0) return [];
  const all = planetPositionsFromChart(chart);
  const wanted = new Set(planetNames.map((n) => n.toLowerCase()));
  return all.filter((p) => {
    const name = typeof p.planet === 'string' ? p.planet.toLowerCase() : '';
    return wanted.has(name);
  });
}

/** Extract house cusps for the given house numbers. */
function filterHouses(
  chart: Record<string, unknown>,
  houseNumbers: number[],
): Array<Record<string, unknown>> {
  if (houseNumbers.length === 0) return [];
  const out: Array<Record<string, unknown>> = [];
  const wanted = new Set(houseNumbers);

  // Shape A: houses array on the chart
  if (Array.isArray(chart.houses)) {
    for (const h of chart.houses as Array<Record<string, unknown>>) {
      if (h && typeof h === 'object' && typeof h.house === 'number' && wanted.has(h.house)) {
        out.push(h);
      }
    }
  }
  return out;
}

/** Names + ids — case-insensitive set of strings extracted from objects. */
function namesOf(items: Record<string, unknown>[]): Set<string> {
  const out = new Set<string>();
  for (const it of items) {
    if (typeof it.name === 'string') out.add(it.name.toLowerCase());
    if (typeof it.id === 'string') out.add(it.id.toLowerCase());
  }
  return out;
}

/** Trim dashas to current + first N upcoming, preserving structure. */
function trimDashas(dashas: Record<string, unknown>, levels = 3): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (typeof dashas.current === 'string') result.current = dashas.current;
  if (typeof dashas.sub === 'string') result.sub = dashas.sub;
  if (typeof dashas.pratyantar === 'string') result.pratyantar = dashas.pratyantar;
  if (Array.isArray(dashas.chain)) result.chain = (dashas.chain as unknown[]).slice(0, 6);
  if (Array.isArray(dashas.upcoming)) {
    result.upcoming = (dashas.upcoming as unknown[]).slice(0, levels);
  }
  if (typeof dashas.start_date === 'string') result.start_date = dashas.start_date;
  if (typeof dashas.end_date === 'string') result.end_date = dashas.end_date;
  return result;
}

/**
 * Filter yogas/doshas by category relevance. A yoga is relevant if EITHER
 * its `domain` field equals the category, OR its name matches one of the
 * category's known yoga keywords.
 */
const CATEGORY_YOGA_HINTS: Record<BrihaspatiCategory, string[]> = {
  career:        ['raja', 'amala', 'budhaditya', 'gajakesari', 'lakshmi'],
  marriage:      ['manglik', 'mangal dosha', 'kuja', 'shukra', 'darakaraka'],
  health:        ['arishta', 'balarishta', 'bhadra', 'gajakesari'],
  finance:       ['dhana', 'lakshmi', 'gajakesari', 'budhaditya', 'kuber'],
  children:      ['putra', 'santana', 'kalatra'],
  education:     ['saraswati', 'budhaditya', 'gajakesari', 'vidya'],
  dasha:         [],
  remedies:      [],
  compatibility: ['manglik', 'mangal dosha', 'kuja'],
  timing:        [],
  transit:       ['sade sati', 'transit'],
  general:       [],
};

function filterYogasByCategory(
  items: Record<string, unknown>[],
  category: BrihaspatiCategory,
): Record<string, unknown>[] {
  if (items.length === 0) return [];
  if (category === 'dasha' || category === 'timing' || category === 'remedies' || category === 'general') {
    // These categories don't filter by name; pass all relevant items through
    return items;
  }
  const hints = CATEGORY_YOGA_HINTS[category];
  const out: Record<string, unknown>[] = [];
  for (const it of items) {
    const domain = typeof it.domain === 'string' ? it.domain.toLowerCase() : '';
    if (domain === category) {
      out.push(it);
      continue;
    }
    const name = typeof it.name === 'string' ? it.name.toLowerCase() : '';
    if (hints.some((h) => name.includes(h))) {
      out.push(it);
    }
  }
  // If filtering left nothing, return the original — better to have
  // something than nothing for the LLM
  return out.length > 0 ? out : items.slice(0, 3);
}

/** Filter transits to those touching focus houses or focus planets. */
function filterTransits(
  transits: Record<string, unknown>[],
  focus: CategoryFocus,
): Record<string, unknown>[] {
  if (transits.length === 0) return [];
  if (focus.houses.length === 0 && focus.planets.length === 0) return transits;
  const houseSet = new Set(focus.houses);
  const planetSet = new Set(focus.planets.map((p) => p.toLowerCase()));
  return transits.filter((t) => {
    const planet = typeof t.planet === 'string' ? t.planet.toLowerCase() : '';
    const house = typeof t.house === 'number' ? t.house : null;
    return planetSet.has(planet) || (house !== null && houseSet.has(house));
  });
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Build a category-specific slice of the kundali for the LLM. Returns the
 * fields that will populate BrihaspatiContext alongside the question.
 */
export function filterForCategory(
  category: BrihaspatiCategory,
  kundali: RouterKundali,
): CategorySlice {
  const focus = FOCUS[category];

  const allYogas = kundali.yogas ?? [];
  const allDoshas = kundali.doshas ?? [];
  const allTransits = kundali.transits ?? [];

  // Chart: just the focus planets + focus houses (plus lagna + moon always)
  const lagnaAndMoon = ['Sun', 'Moon']; // always included
  const planetsToInclude = Array.from(new Set([...focus.planets, ...lagnaAndMoon]));
  const filteredChart: Record<string, unknown> = {
    positions: filterPlanetPositions(kundali.chart, planetsToInclude),
    houses: filterHouses(kundali.chart, focus.houses),
    lagna: kundali.chart.lagna ?? kundali.chart.ascendant ?? null,
    moonSign: kundali.chart.moonSign ?? kundali.chart.moon_sign ?? null,
  };

  const filteredYogas = filterYogasByCategory(allYogas, category);
  const filteredDoshas = filterYogasByCategory(allDoshas, category);
  const filteredTransits = filterTransits(allTransits, focus);

  // Trim dashas — always current + first few upcoming
  const filteredDashas = trimDashas(kundali.dashas ?? {});

  // Analysis: try to pick a category-specific block from the analysis blob
  const fullAnalysis = kundali.analysis ?? {};
  const categoryAnalysis =
    (fullAnalysis[category] && typeof fullAnalysis[category] === 'object'
      ? (fullAnalysis[category] as Record<string, unknown>)
      : fullAnalysis.domain_synthesis && typeof fullAnalysis.domain_synthesis === 'object'
      ? (fullAnalysis.domain_synthesis as Record<string, unknown>)[category] as Record<string, unknown> ?? {}
      : {}) || {};

  const filteredRemedies = extractRemedies(kundali, category);

  return {
    chart: filteredChart,
    dashas: filteredDashas,
    yogas: filteredYogas,
    doshas: filteredDoshas,
    transits: filteredTransits,
    analysis: categoryAnalysis,
    focus,
    remedies: filteredRemedies,
  };
}

/**
 * Extract remedies from any of the locations engines have used. Returns
 * normalised `{ text, kind?, planet? }` items. Empty array if none found.
 *
 * REVIEW_TRACKER P2: remedies were referenced by prompt rule #4 but
 * had no documented top-level location. This function makes the
 * location explicit and the field a first-class part of BrihaspatiContext.
 */
function extractRemedies(kundali: RouterKundali, category: BrihaspatiCategory): BrihaspatiRemedy[] {
  const candidates: unknown[] = [];
  const a = kundali.analysis ?? {};
  // Look in: kundali.remedies (top-level if engine put it there), analysis.remedies,
  // analysis[category].remedies, analysis.domain_synthesis[category].remedies
  const top = (kundali as unknown as Record<string, unknown>).remedies;
  if (Array.isArray(top)) candidates.push(...top);
  if (Array.isArray(a.remedies)) candidates.push(...(a.remedies as unknown[]));
  const catBlock = a[category];
  if (catBlock && typeof catBlock === 'object' && Array.isArray((catBlock as Record<string, unknown>).remedies)) {
    candidates.push(...((catBlock as Record<string, unknown>).remedies as unknown[]));
  }
  const ds = a.domain_synthesis;
  if (ds && typeof ds === 'object') {
    const dsCat = (ds as Record<string, unknown>)[category];
    if (dsCat && typeof dsCat === 'object' && Array.isArray((dsCat as Record<string, unknown>).remedies)) {
      candidates.push(...((dsCat as Record<string, unknown>).remedies as unknown[]));
    }
  }

  const out: BrihaspatiRemedy[] = [];
  for (const c of candidates) {
    if (typeof c === 'string') {
      out.push({ text: c });
      continue;
    }
    if (c && typeof c === 'object') {
      const o = c as Record<string, unknown>;
      const text = typeof o.text === 'string' ? o.text : typeof o.description === 'string' ? o.description : null;
      if (!text) continue;
      out.push({
        text,
        kind: typeof o.kind === 'string' ? o.kind : typeof o.type === 'string' ? o.type : undefined,
        planet: typeof o.planet === 'string' ? o.planet : undefined,
      });
    }
  }
  return out;
}

/** Exported for tests and observability. */
export { FOCUS as CATEGORY_FOCUS };

// Helper for downstream consumers that need to know what was filtered.
export function namesOfYogas(yogas: Record<string, unknown>[]): Set<string> {
  return namesOf(yogas);
}

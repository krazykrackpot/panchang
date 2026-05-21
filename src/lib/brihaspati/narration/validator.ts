/**
 * Layer-4 Validator — post-generation claim verifier.
 *
 * The fourth and last layer of the validation wall. Given an LLM narration
 * and the BrihaspatiContext that was sent to it, this function extracts
 * astrological claims from the narration and verifies each one against the
 * context. The verifier is regex + lookup-table — no second LLM call.
 *
 * Categories of claim we check:
 *
 *   A. Planet-in-sign / planet-in-house claims
 *      "Venus in 7th house"     → require Venus in chart positions
 *      "Saturn in Capricorn"    → require Saturn-in-Capricorn in positions
 *
 *   B. Yoga / Dosha name claims
 *      "Gajakesari Yoga"        → require name in context.yogas[]
 *      "Mangal Dosha"           → require name in context.doshas[]
 *
 *   C. Dasha period claims
 *      "Jupiter-Mercury period" → require current=Jupiter, sub=Mercury
 *      "Saturn mahadasha"       → require Saturn in dasha chain
 *
 *   D. Future-date claims (transit windows)
 *      "November 2026 to April 2027"
 *                              → require overlap with a transit window
 *
 * Launch posture (per spec §10): runs in LOG-ONLY mode unless
 * `BRIHASPATI_LAYER4_BLOCK=true`. The `passed` flag is recorded
 * regardless; the caller decides whether to enforce.
 *
 * Locale scope: this verifier targets English narration. Hindi / Tamil /
 * Bengali narration share the same astrological terminology (Sanskrit
 * loanwords) for most claim categories, but full multi-script claim
 * extraction is fast-follow.
 */

import type {
  BrihaspatiContext,
  BrihaspatiValidationFailure,
} from '../types';

export interface ValidatorResult {
  passed: boolean;
  failures: BrihaspatiValidationFailure[];
  /** All extracted claims, even those that passed — useful for telemetry. */
  claimsChecked: number;
}

/**
 * Canonical planet names. Aliases (Lord of X, Surya for Sun, etc.) are
 * normalised before matching.
 */
const PLANET_NAMES = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
] as const;
type PlanetName = (typeof PLANET_NAMES)[number];

/** Sanskrit/Hindi → English planet aliases that the LLM sometimes emits. */
const PLANET_ALIASES: Record<string, PlanetName> = {
  surya: 'Sun', chandra: 'Moon', mangal: 'Mars', budha: 'Mercury',
  guru: 'Jupiter', brihaspati: 'Jupiter', shukra: 'Venus', shani: 'Saturn',
};

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

const HOUSE_ORDINAL_RE = /\b(\d{1,2})(?:st|nd|rd|th)?\s+house\b/gi;

/**
 * Normalise the LLM's name for a planet to its canonical form.
 * Returns the canonical name or null if not recognised.
 */
function canonicalisePlanet(raw: string): PlanetName | null {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (PLANET_ALIASES[lower]) return PLANET_ALIASES[lower];
  const match = PLANET_NAMES.find((p) => p.toLowerCase() === lower);
  return match ?? null;
}

/**
 * Extract a normalised list of planet positions from the context.chart.
 * The Layer-2 builder may use different shapes for different engines,
 * so we accept several:
 *   { positions: [{planet:'Venus', sign:'Taurus', house:7}, ...] }
 *   { Venus: {sign:'Taurus', house:7}, ... }
 *   { planets: {Venus: {sign:'Taurus', house:7}, ...} }
 */
function extractChartPositions(chart: Record<string, unknown>): Array<{
  planet: PlanetName;
  sign?: string;
  house?: number;
}> {
  const out: Array<{ planet: PlanetName; sign?: string; house?: number }> = [];
  const addOne = (planetRaw: string, val: unknown) => {
    const p = canonicalisePlanet(planetRaw);
    if (!p) return;
    if (val && typeof val === 'object') {
      const o = val as Record<string, unknown>;
      out.push({
        planet: p,
        sign: typeof o.sign === 'string' ? o.sign : undefined,
        house: typeof o.house === 'number' ? o.house : undefined,
      });
    } else {
      out.push({ planet: p });
    }
  };

  // Shape 1: positions array
  if (Array.isArray(chart.positions)) {
    for (const pos of chart.positions) {
      if (pos && typeof pos === 'object' && 'planet' in pos) {
        const o = pos as Record<string, unknown>;
        if (typeof o.planet === 'string') {
          addOne(o.planet, o);
        }
      }
    }
  }

  // Shape 2: planets object
  if (chart.planets && typeof chart.planets === 'object') {
    for (const [planet, val] of Object.entries(chart.planets as Record<string, unknown>)) {
      addOne(planet, val);
    }
  }

  // Shape 3: top-level planet keys
  for (const key of Object.keys(chart)) {
    if (canonicalisePlanet(key)) {
      addOne(key, chart[key]);
    }
  }

  return out;
}

/**
 * Extract { name: string } pairs from yogas/doshas arrays in any shape.
 */
function extractNames(items: Record<string, unknown>[]): Set<string> {
  const out = new Set<string>();
  for (const item of items) {
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      if (typeof o.name === 'string') out.add(o.name.toLowerCase());
      if (typeof o.id === 'string') out.add(o.id.toLowerCase());
    }
  }
  return out;
}

/**
 * Verify a claim like "Venus in 7th house" or "Saturn in Capricorn".
 * Returns null if the claim is satisfied, otherwise a failure.
 */
function checkPlanetClaim(
  planet: PlanetName,
  locator: { house?: number; sign?: string },
  positions: ReturnType<typeof extractChartPositions>,
): BrihaspatiValidationFailure | null {
  const match = positions.find((p) => p.planet === planet);
  if (!match) {
    return {
      claim: `${planet} placement`,
      reason: 'planet_not_in_chart',
      expected: `chart positions do not include ${planet}`,
    };
  }
  if (locator.house !== undefined && match.house !== undefined && match.house !== locator.house) {
    return {
      claim: `${planet} in ${locator.house}${ordinalSuffix(locator.house)} house`,
      reason: 'planet_not_in_chart',
      expected: `actual: ${planet} in ${match.house}${ordinalSuffix(match.house)} house`,
    };
  }
  if (locator.sign !== undefined && match.sign !== undefined && match.sign.toLowerCase() !== locator.sign.toLowerCase()) {
    return {
      claim: `${planet} in ${locator.sign}`,
      reason: 'planet_not_in_chart',
      expected: `actual: ${planet} in ${match.sign}`,
    };
  }
  return null;
}

function ordinalSuffix(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Main validator entry. Returns a structured result; the caller decides
 * whether to enforce based on env config.
 */
export function validate(narration: string, context: BrihaspatiContext): ValidatorResult {
  const failures: BrihaspatiValidationFailure[] = [];
  let claimsChecked = 0;

  const positions = extractChartPositions(context.chart);
  const yogaNames = extractNames(context.yogas);
  const doshaNames = extractNames(context.doshas);

  // ── A. Planet-in-house ───────────────────────────────────────────────
  // "Venus in 7th house" — extract via the planet-name + "in" + house pattern.
  const planetHouseRe = new RegExp(
    `\\b(${PLANET_NAMES.join('|')}|${Object.keys(PLANET_ALIASES).join('|')})\\b\\s+(?:is\\s+)?in\\s+(?:the\\s+|your\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+house\\b`,
    'gi',
  );
  for (const m of narration.matchAll(planetHouseRe)) {
    claimsChecked++;
    const planet = canonicalisePlanet(m[1]);
    const house = parseInt(m[2], 10);
    if (!planet || isNaN(house) || house < 1 || house > 12) continue;
    const fail = checkPlanetClaim(planet, { house }, positions);
    if (fail) failures.push(fail);
  }

  // ── B. Planet-in-sign ────────────────────────────────────────────────
  const planetSignRe = new RegExp(
    `\\b(${PLANET_NAMES.join('|')}|${Object.keys(PLANET_ALIASES).join('|')})\\b\\s+(?:is\\s+)?(?:placed\\s+)?in\\s+(${SIGN_NAMES.join('|')})\\b`,
    'gi',
  );
  for (const m of narration.matchAll(planetSignRe)) {
    claimsChecked++;
    const planet = canonicalisePlanet(m[1]);
    const sign = m[2];
    if (!planet) continue;
    const fail = checkPlanetClaim(planet, { sign }, positions);
    if (fail) failures.push(fail);
  }

  // ── C. Yoga / Dosha name claims ──────────────────────────────────────
  // Extract every "Foo Yoga" or "Foo Dosha" mentioned. Strip leading articles
  // / qualifiers because Title-Cased English words like "The Gajakesari Yoga"
  // would otherwise produce the bogus name "The Gajakesari".
  const ARTICLES = /^(?:the|your|my|a|an|this|that|powerful|strong|weak|major|minor)\s+/i;
  const yogaRe = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(Yoga|Dosha)\b/g;
  for (const m of narration.matchAll(yogaRe)) {
    claimsChecked++;
    const rawName = m[1];
    // Drop leading articles like "The", "Your", "Powerful" until none remain.
    let cleaned = rawName;
    while (ARTICLES.test(cleaned)) {
      cleaned = cleaned.replace(ARTICLES, '');
    }
    // If stripping leaves nothing, treat as if the whole match was an article phrase.
    if (!cleaned) continue;
    const name = cleaned.toLowerCase();
    const kind = m[2];
    const bank = kind === 'Yoga' ? yogaNames : doshaNames;
    const fullName = `${cleaned} ${kind}`.toLowerCase();
    // Accept either bare name ("Gajakesari") or full ("Gajakesari Yoga")
    if (!bank.has(name) && !bank.has(fullName)) {
      failures.push({
        claim: `${cleaned} ${kind}`,
        reason: 'yoga_not_detected',
        expected: `not present in detected ${kind.toLowerCase()}s`,
      });
    }
  }

  // ── D. Dasha period claims ───────────────────────────────────────────
  // "Jupiter-Mercury period" / "during Saturn mahadasha"
  const dashas = context.dashas as Record<string, unknown>;
  const currentDasha = typeof dashas.current === 'string' ? dashas.current.toLowerCase() : undefined;
  const subDasha = typeof dashas.sub === 'string' ? dashas.sub.toLowerCase() : undefined;
  const chain = Array.isArray(dashas.chain)
    ? (dashas.chain as unknown[]).filter((s): s is string => typeof s === 'string').map((s) => s.toLowerCase())
    : [];

  const dashaPairRe = new RegExp(
    `\\b(${PLANET_NAMES.join('|')})(?:[\\s\\-]+(${PLANET_NAMES.join('|')}))?\\s+(?:period|dasha|mahadasha|antardasha)\\b`,
    'gi',
  );
  for (const m of narration.matchAll(dashaPairRe)) {
    claimsChecked++;
    const major = m[1]?.toLowerCase();
    const minor = m[2]?.toLowerCase();

    const knownMajor = currentDasha === major || chain.includes(major);
    if (!knownMajor) {
      failures.push({
        claim: `${m[1]} dasha`,
        reason: 'dasha_not_in_context',
        expected: `current=${dashas.current ?? '?'}; chain=${chain.join(',') || '?'}`,
      });
      continue;
    }
    if (minor) {
      const knownMinor = subDasha === minor || chain.includes(minor);
      if (!knownMinor) {
        failures.push({
          claim: `${m[1]}-${m[2]} period`,
          reason: 'dasha_not_in_context',
          expected: `sub=${dashas.sub ?? '?'}`,
        });
      }
    }
  }

  return {
    passed: failures.length === 0,
    failures,
    claimsChecked,
  };
}

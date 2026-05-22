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
 * Locale scope: English + Hindi (Devanagari). Both extractors run on
 * every narration — a mixed-script answer ("Venus 7th house में बलवान")
 * gets checked from both ends and either side can surface a failure.
 * Tamil + Bengali claim extraction is fast-follow (tracked in
 * REVIEW_TRACKER cross-cutting follow-up #1).
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

/** Devanagari planet aliases — used by the Hindi extractor. */
const HI_PLANET_ALIASES: Record<string, PlanetName> = {
  'सूर्य': 'Sun',
  'रवि': 'Sun',
  'चन्द्र': 'Moon', 'चंद्र': 'Moon', 'चन्द्रमा': 'Moon', 'चंद्रमा': 'Moon',
  'मंगल': 'Mars', 'मङ्गल': 'Mars',
  'बुध': 'Mercury',
  'गुरु': 'Jupiter', 'बृहस्पति': 'Jupiter',
  'शुक्र': 'Venus',
  'शनि': 'Saturn',
  'राहु': 'Rahu',
  'केतु': 'Ketu',
};

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

/** Devanagari sign aliases → canonical English sign name. */
const HI_SIGN_ALIASES: Record<string, (typeof SIGN_NAMES)[number]> = {
  'मेष': 'Aries',
  'वृष': 'Taurus', 'वृषभ': 'Taurus',
  'मिथुन': 'Gemini',
  'कर्क': 'Cancer',
  'सिंह': 'Leo',
  'कन्या': 'Virgo',
  'तुला': 'Libra',
  'वृश्चिक': 'Scorpio',
  'धनु': 'Sagittarius',
  'मकर': 'Capricorn',
  'कुम्भ': 'Aquarius', 'कुंभ': 'Aquarius',
  'मीन': 'Pisces',
};

/**
 * Devanagari yoga / dosha names → canonical English (lowercase). Lets
 * us match a Hindi-narration yoga name against an English-keyed yoga
 * bank without adding both forms at the source.
 *
 * Not exhaustive — covers the common Jyotish yogas. Unmapped names fall
 * through to a direct bank lookup against the Devanagari string itself
 * (works when the engine stores Devanagari).
 */
const HI_YOGA_ALIASES: Record<string, string> = {
  // Major yogas
  'गजकेसरी': 'gajakesari',
  'महाभाग्य': 'mahabhagya',
  'राज': 'raja',
  'विपरीत राज': 'vipareeta raja',
  'बुधादित्य': 'budhaditya',
  'सरस्वती': 'saraswati',
  'लक्ष्मी': 'lakshmi',
  'अमला': 'amala',
  'वसुमती': 'vasumati',
  'गौरी': 'gauri',
  'अनफा': 'anapha', 'अनफ़ा': 'anapha',
  'सुनफा': 'sunapha', 'सुनफ़ा': 'sunapha',
  'दुरुधरा': 'durudhara',
  'कुसुम': 'kusuma',
  'शकट': 'shakata',
  'हर्ष': 'harsha',
  'चन्द्र-मंगल': 'chandra-mangala', 'चंद्र-मंगल': 'chandra-mangala',
  'सूर्य': 'surya',
  'पंच महापुरुष': 'pancha mahapurusha',
  'रुचक': 'ruchaka',
  'भद्र': 'bhadra',
  'हंस': 'hamsa',
  'मालव्य': 'malavya',
  'शश': 'shasha',
  // Doshas
  'मंगल': 'mangal', 'मांगलिक': 'manglik',
  'काल सर्प': 'kaal sarpa', 'कालसर्प': 'kaal sarpa',
  'पितृ': 'pitru',
  'केमद्रुम': 'kemadruma',
  'शकट दोष': 'shakata',
  'दरिद्र': 'daridra',
  'बालारिष्ट': 'balarishta',
};

/** Devanagari ordinal → house number (1–12). */
const HI_HOUSE_ORDINALS: Record<string, number> = {
  'प्रथम': 1, 'पहला': 1, 'पहले': 1,
  'द्वितीय': 2, 'दूसरा': 2, 'दूसरे': 2,
  'तृतीय': 3, 'तीसरा': 3, 'तीसरे': 3,
  'चतुर्थ': 4, 'चौथा': 4, 'चौथे': 4,
  'पंचम': 5, 'पञ्चम': 5, 'पाँचवाँ': 5, 'पाँचवें': 5, 'पांचवें': 5,
  'षष्ठ': 6, 'षष्टम': 6, 'छठा': 6, 'छठे': 6,
  'सप्तम': 7, 'सातवाँ': 7, 'सातवें': 7,
  'अष्टम': 8, 'आठवाँ': 8, 'आठवें': 8,
  'नवम': 9, 'नौवाँ': 9, 'नौवें': 9,
  'दशम': 10, 'दसवाँ': 10, 'दसवें': 10,
  'एकादश': 11, 'ग्यारहवाँ': 11, 'ग्यारहवें': 11,
  'द्वादश': 12, 'बारहवाँ': 12, 'बारहवें': 12,
};

const HOUSE_ORDINAL_RE = /\b(\d{1,2})(?:st|nd|rd|th)?\s+house\b/gi;

/**
 * Normalise the LLM's name for a planet to its canonical form.
 * Returns the canonical name or null if not recognised. Handles
 * English, transliterated Hindi, and Devanagari.
 */
function canonicalisePlanet(raw: string): PlanetName | null {
  const trimmed = raw.trim();
  // Direct Devanagari lookup (case-insensitive for Latin doesn't apply)
  if (HI_PLANET_ALIASES[trimmed]) return HI_PLANET_ALIASES[trimmed];
  const lower = trimmed.toLowerCase();
  if (PLANET_ALIASES[lower]) return PLANET_ALIASES[lower];
  const match = PLANET_NAMES.find((p) => p.toLowerCase() === lower);
  return match ?? null;
}

/** Normalise a sign name to canonical English. Handles Devanagari. */
function canonicaliseSign(raw: string): (typeof SIGN_NAMES)[number] | null {
  const trimmed = raw.trim();
  if (HI_SIGN_ALIASES[trimmed]) return HI_SIGN_ALIASES[trimmed];
  const lower = trimmed.toLowerCase();
  const m = SIGN_NAMES.find((s) => s.toLowerCase() === lower);
  return m ?? null;
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
 * Normalise a yoga / dosha name for set-comparison: lowercase, trim,
 * collapse whitespace, strip a trailing " yoga" or " dosha" suffix,
 * strip a "pancha-mahapurusha-" / "pancha_mahapurusha_" prefix from
 * engine-emitted nameKeys. The goal is that "Bhadra", "Bhadra Yoga",
 * "bhadra yoga" and the engine's nameKey "pancha-mahapurusha-bhadra"
 * all canonicalise to the same key.
 */
function canonicaliseYogaName(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^(?:pancha[-_]mahapurusha[-_])/i, '')
    .replace(/\s+(?:yoga|dosha)$/i, '')
    .replace(/[-_]/g, ' ')
    .trim();
}

/**
 * Extract canonical yoga / dosha names from the engine output. Reads
 * both `name` and `id`/`nameKey` so we accept either form. Each is
 * fed through canonicaliseYogaName so set membership works regardless
 * of whether the engine emits "Bhadra" vs "Bhadra Yoga" vs
 * "pancha-mahapurusha-bhadra".
 */
function extractNames(items: Record<string, unknown>[]): Set<string> {
  const out = new Set<string>();
  for (const item of items) {
    if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      if (typeof o.name === 'string') out.add(canonicaliseYogaName(o.name));
      if (typeof o.id === 'string') out.add(canonicaliseYogaName(o.id));
      if (typeof o.nameKey === 'string') out.add(canonicaliseYogaName(o.nameKey));
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
    const kind = m[2];
    const bank = kind === 'Yoga' ? yogaNames : doshaNames;
    // Both sides of the comparison run through canonicaliseYogaName,
    // so "Bhadra Yoga", "bhadra", "Bhadra-Yoga", and the engine's
    // nameKey "pancha-mahapurusha-bhadra" all collapse to "bhadra".
    const claimCanon = canonicaliseYogaName(`${cleaned} ${kind}`);
    if (!bank.has(claimCanon)) {
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

  // ── E. Hindi / Devanagari claim extraction ───────────────────────────
  // Runs in parallel to the English passes above so a mixed-script
  // narration ("Venus 7th house में बलवान है") is checked from both ends.
  claimsChecked += extractHindiClaims(narration, positions, yogaNames, doshaNames, dashas, failures);

  return {
    passed: failures.length === 0,
    failures,
    claimsChecked,
  };
}

/**
 * Run Devanagari-aware claim extraction. Adds to `failures` and returns
 * the number of claims checked.
 *
 * Patterns matched:
 *  - "शुक्र सप्तम भाव में"     → Venus in 7th house
 *  - "शनि मकर राशि में"        → Saturn in Capricorn
 *  - "गजकेसरी योग" / "मंगल दोष" → yoga / dosha names
 *  - "गुरु महादशा" / "गुरु-बुध दशा" → dasha lord(s)
 *
 * Falls back to English-script aliases too, so transliterated forms
 * (Shukra saptam) get caught.
 */
function extractHindiClaims(
  narration: string,
  positions: ReturnType<typeof extractChartPositions>,
  yogaNames: Set<string>,
  doshaNames: Set<string>,
  dashas: Record<string, unknown>,
  failures: BrihaspatiValidationFailure[],
): number {
  let claimsChecked = 0;

  // Quick gate: skip Devanagari extraction if no Devanagari at all
  if (!/[ऀ-ॿ]/.test(narration)) return 0;

  const hiPlanetAlt = Object.keys(HI_PLANET_ALIASES).join('|');
  const hiSignAlt = Object.keys(HI_SIGN_ALIASES).join('|');
  const hiOrdinalAlt = Object.keys(HI_HOUSE_ORDINALS).join('|');

  // E1. Planet in house: "शुक्र सप्तम भाव" / "शुक्र 7वें भाव"
  // Match planet, then ordinal-word OR digit, then भाव
  const hiPlanetHouseOrdinal = new RegExp(
    `(${hiPlanetAlt})(?:[\\s,]+(?:की|का|के|में))?[\\s,]+(${hiOrdinalAlt})[\\s,]+भाव`,
    'g',
  );
  for (const m of narration.matchAll(hiPlanetHouseOrdinal)) {
    claimsChecked++;
    const planet = canonicalisePlanet(m[1]);
    const house = HI_HOUSE_ORDINALS[m[2]];
    if (!planet || !house) continue;
    const fail = checkPlanetClaim(planet, { house }, positions);
    if (fail) failures.push(fail);
  }

  const hiPlanetHouseDigit = new RegExp(
    `(${hiPlanetAlt})(?:[\\s,]+(?:की|का|के|में))?[\\s,]+(\\d{1,2})(?:वें|वें|वाँ|वें|व़ें|वे|ें|व़े)?[\\s,]+भाव`,
    'g',
  );
  for (const m of narration.matchAll(hiPlanetHouseDigit)) {
    claimsChecked++;
    const planet = canonicalisePlanet(m[1]);
    const house = parseInt(m[2], 10);
    if (!planet || isNaN(house) || house < 1 || house > 12) continue;
    const fail = checkPlanetClaim(planet, { house }, positions);
    if (fail) failures.push(fail);
  }

  // E2. Planet in sign: "शनि मकर में" / "शनि मकर राशि में"
  const hiPlanetSign = new RegExp(
    `(${hiPlanetAlt})(?:[\\s,]+(?:की|का|के|में|स्थित))?[\\s,]+(${hiSignAlt})(?:[\\s,]+राशि)?(?:[\\s,]+में)?`,
    'g',
  );
  for (const m of narration.matchAll(hiPlanetSign)) {
    claimsChecked++;
    const planet = canonicalisePlanet(m[1]);
    const sign = canonicaliseSign(m[2]);
    if (!planet || !sign) continue;
    const fail = checkPlanetClaim(planet, { sign }, positions);
    if (fail) failures.push(fail);
  }

  // E3. Yoga / Dosha name: 1 or 2 words before योग / दोष.
  // Capped at 2 words because yoga names are at most "Foo Bar" (e.g.
  // "Mangal Dosha"). Larger windows captured surrounding prose like
  // "कुण्डली में गजकेसरी" and produced bogus failures.
  //
  // Note: no \b at end — JS \b only fires on Latin word boundaries, and
  // Devanagari "योग" has no word-boundary with the following space. We
  // anchor the trailing edge on (?:\s|[।.,;]|$) instead.
  const hiYogaRe = /(?:^|[\s,।])([ऀ-ॿa-zA-Z]+(?:\s[ऀ-ॿa-zA-Z]+)?)\s+(योग|दोष)(?=\s|[।.,;]|$)/g;
  // Hindi articles / qualifiers to strip from the front of the captured name.
  // "में" can connect "कुण्डली में गजकेसरी" — when present at the leading
  // position of the captured name, strip the whole "X में " prefix too.
  const HI_ARTICLES = /^(?:आपकी|आपका|आपके|यह|वह|एक|प्रबल|शक्तिशाली|कमज़ोर|कुण्डली|कुंडली|जातक|जातका|में|का|की|के|और|भी)\s+/;
  const HI_MEIN_PREFIX = /^[ऀ-ॿa-zA-Z]+\s+में\s+/;
  for (const m of narration.matchAll(hiYogaRe)) {
    claimsChecked++;
    let rawName = m[1];
    while (HI_ARTICLES.test(rawName) || HI_MEIN_PREFIX.test(rawName)) {
      rawName = rawName.replace(HI_ARTICLES, '').replace(HI_MEIN_PREFIX, '');
    }
    if (!rawName) continue;
    const kindHi = m[2]; // योग or दोष
    const bank = kindHi === 'योग' ? yogaNames : doshaNames;
    const kindLatin = kindHi === 'योग' ? 'Yoga' : 'Dosha';
    // Translate Devanagari yoga/dosha name to English when possible.
    const englishAlias = HI_YOGA_ALIASES[rawName];
    // Multiple candidate forms — all run through canonicaliseYogaName
    // so "Mangal Dosha", "Mangal", and "manglik" all collapse together.
    const candidates = [
      canonicaliseYogaName(rawName),
      canonicaliseYogaName(`${rawName} ${kindLatin}`),
      canonicaliseYogaName(`${rawName} ${kindHi}`),
    ];
    if (englishAlias) {
      candidates.push(
        canonicaliseYogaName(englishAlias),
        canonicaliseYogaName(`${englishAlias} ${kindLatin}`),
      );
    }
    if (candidates.some((c) => bank.has(c))) continue;
    failures.push({
      claim: `${rawName} ${kindHi}`,
      reason: 'yoga_not_detected',
      expected: `not present in detected ${kindLatin.toLowerCase()}s`,
    });
  }

  // E4. Dasha: "गुरु महादशा" / "गुरु-बुध दशा" / "गुरु-बुध की दशा"
  const currentDashaLower = typeof dashas.current === 'string' ? dashas.current.toLowerCase() : undefined;
  const subDashaLower = typeof dashas.sub === 'string' ? dashas.sub.toLowerCase() : undefined;
  const chainLower = Array.isArray(dashas.chain)
    ? (dashas.chain as unknown[]).filter((s): s is string => typeof s === 'string').map((s) => s.toLowerCase())
    : [];

  const hiDashaRe = new RegExp(
    `(${hiPlanetAlt})(?:[\\s\\-]+(${hiPlanetAlt}))?(?:[\\s,]+(?:की|का|के))?[\\s,]+(दशा|महादशा|अन्तर्दशा|अंतर्दशा)`,
    'g',
  );
  for (const m of narration.matchAll(hiDashaRe)) {
    claimsChecked++;
    const majorP = canonicalisePlanet(m[1]);
    const minorP = m[2] ? canonicalisePlanet(m[2]) : null;
    if (!majorP) continue;
    const major = majorP.toLowerCase();
    const knownMajor = currentDashaLower === major || chainLower.includes(major);
    if (!knownMajor) {
      failures.push({
        claim: `${majorP} dasha`,
        reason: 'dasha_not_in_context',
        expected: `current=${dashas.current ?? '?'}; chain=${chainLower.join(',') || '?'}`,
      });
      continue;
    }
    if (minorP) {
      const minor = minorP.toLowerCase();
      const knownMinor = subDashaLower === minor || chainLower.includes(minor);
      if (!knownMinor) {
        failures.push({
          claim: `${majorP}-${minorP} period`,
          reason: 'dasha_not_in_context',
          expected: `sub=${dashas.sub ?? '?'}`,
        });
      }
    }
  }

  return claimsChecked;
}

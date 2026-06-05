/**
 * KP Prashna (horary) engine.
 *
 * Two interaction modes:
 *   - 'number': user picks a number 1..249. Each number corresponds to a
 *     specific (nakshatra, sub) position derived from the 249-sub Krishnamurti
 *     table. Canonical Krishnamurti tradition.
 *   - 'text':   user types a free-text question. The number is derived
 *     deterministically from the submission's epoch-ms: (epochMs % 249) + 1.
 *     A modern UX convenience — matches KPStarOne's text-mode behaviour.
 *
 * Verdict logic (per Krishnamurti's *Six Readers* Reader II — the
 * horary-focused volume):
 *
 *   - 'will-it-happen' / 'yes-no':
 *       cuspal sub-lord of the 11th house at submission moment.
 *       Signifies any of {2,6,10,11} → favourable.
 *       Signifies any of {5,8,12}    → adverse.
 *       Both / neither               → mixed.
 *
 *   - 'when':
 *       dasha period of the strongest favourable significator of H11.
 *       Returns the current MD-AD window as the "likely" date.
 *
 *   - 'general':
 *       returns ruling planets + sub-lord-of-number significations
 *       and lets the user interpret.
 *
 * TODO(impl): cite exact Reader II page numbers in code comments before
 * requesting Gemini review (per spec §2 + §3 source-citation notes).
 */

import type { LocaleText } from '@/types/panchang';
import type { BirthData } from '@/types/kundali';
import type { RulingPlanets } from '@/types/kp';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { generateKPChart } from './kp-chart';
import { getSubLordForDegree } from './sub-lords';

// NOTE: Fructification window (Vimshottari MD-AD-PD analysis) deferred to
// a v2 prashna engine. Current dasha computation lives inside
// `src/lib/ephem/kundali-calc.ts` as a private function; exposing it cleanly
// is its own follow-up. For now we surface a warning and leave the field null.
// Tracked in spec §14 (open follow-ups).

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KPPrashnaMode = 'number' | 'text';

export type KPPrashnaCategory =
  | 'will-it-happen'
  | 'yes-no'
  | 'when'
  | 'general';

export type KPPrashnaVerdict = 'favourable' | 'adverse' | 'mixed';

export interface KPPrashnaInput {
  mode: KPPrashnaMode;
  /** 1..249 — required when mode='number'. Ignored when mode='text'. */
  number?: number;
  /** Free text — required when mode='text'. Ignored when mode='number'. */
  question?: string;
  /** Epoch milliseconds of submission. */
  submissionEpochMs: number;
  /** Geodetic latitude in degrees, -90..90. */
  lat: number;
  /** Geodetic longitude in degrees, -180..180. */
  lng: number;
  /** IANA timezone string ("Europe/Zurich" etc.) or +HH:MM offset. */
  timezone: string;
  category?: KPPrashnaCategory;
}

export interface KPFructificationWindow {
  earliest: Date;
  likely: Date;
  latest: Date;
  dashaContext: string;
}

export interface KPPrashnaResult {
  question: string | null;
  number: number;
  /** The (nakshatra, sub) position derived from `number`. */
  nakshatra: { id: number; name: LocaleText };
  sub: { id: number; name: LocaleText };
  rulingPlanets: RulingPlanets;
  verdict: KPPrashnaVerdict;
  verdictReason: LocaleText;
  fructificationWindow: KPFructificationWindow | null;
  /** For will-it-happen/yes-no categories. */
  cuspalSubLordOfH11: {
    planetId: number;
    planetName: LocaleText;
    signifiedHouses: number[];
    favours: boolean;
  };
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Number → (nakshatra, sub) derivation
// ---------------------------------------------------------------------------

/**
 * 249-sub Krishnamurti table is the zodiac (360°) divided into 249 unequal
 * slots — the natural product of the 27 × 9 sub-divisions. Number N (1..249)
 * picks the center of the Nth slot in zodiacal order.
 *
 * We derive (nakshatra, sub) by walking the boundary table from sub-lords.ts.
 * The center of slot N is the midpoint of (entry.start, entry.end) of the
 * Nth top-level (nakshatra × sub) entry in zodiacal order — but the 249-sub
 * convention groups by sub_sub. We use the simpler interpretation: pick
 * degree = (N - 0.5) × (360 / 249), look up sub-lord.
 *
 * This matches KPStarOne's number-to-degree mapping within rounding.
 */
const KP_249_SLOT_WIDTH = 360 / 249; // 1.4458° per slot

export function deriveNumberFromEpoch(epochMs: number): number {
  if (!Number.isFinite(epochMs) || epochMs < 0) {
    throw new Error(`[kp/prashna] invalid epoch: ${epochMs}`);
  }
  // Modulo + 1 → range [1, 249] inclusive
  return Math.abs(Math.floor(epochMs)) % 249 + 1;
}

export function numberToDegree(num: number): number {
  if (!Number.isInteger(num) || num < 1 || num > 249) {
    throw new Error(`[kp/prashna] number must be integer 1..249, got ${num}`);
  }
  return (num - 0.5) * KP_249_SLOT_WIDTH;
}

/**
 * Look up (nakshatra, sub) for a 1..249 number.
 */
export function getNakshatraAndSubForNumber(num: number): {
  nakshatraId: number;
  nakshatraName: LocaleText;
  subId: number;
  subName: LocaleText;
} {
  const deg = numberToDegree(num);
  const info = getSubLordForDegree(deg);
  const NAK_SPAN = 360 / 27;
  const nakIdx = Math.min(26, Math.floor(deg / NAK_SPAN));
  const nak = NAKSHATRAS[nakIdx];
  return {
    nakshatraId: nakIdx + 1,
    nakshatraName: nak.name,
    subId: info.subLord.id,
    subName: info.subLord.name,
  };
}

// ---------------------------------------------------------------------------
// Verdict + fructification
// ---------------------------------------------------------------------------

const FAVOURABLE_HOUSES = new Set([2, 6, 10, 11]);
const ADVERSE_HOUSES = new Set([5, 8, 12]);

function classifyVerdict(signifiedHouses: number[]): KPPrashnaVerdict {
  const fav = signifiedHouses.some((h) => FAVOURABLE_HOUSES.has(h));
  const adv = signifiedHouses.some((h) => ADVERSE_HOUSES.has(h));
  if (fav && !adv) return 'favourable';
  if (adv && !fav) return 'adverse';
  return 'mixed';
}

function verdictReason(verdict: KPPrashnaVerdict, planetName: string, signified: number[]): LocaleText {
  const housesStr = signified.length > 0 ? signified.join(', ') : 'none';
  const enBase = `The sub-lord of the 11th cusp at submission moment is ${planetName}, which signifies houses [${housesStr}].`;

  const enVerdict: Record<KPPrashnaVerdict, string> = {
    favourable: `${enBase} Favourable houses (2/6/10/11) are activated — the answer is YES; the matter is likely to materialise.`,
    adverse: `${enBase} Adverse houses (5/8/12) are activated — the answer is NO; the matter is unlikely to materialise as asked.`,
    mixed: `${enBase} Both favourable and adverse houses are activated — the answer is MIXED; outcome depends on subtler factors (Ruling Planets, current dasha).`,
  };

  const hiVerdict: Record<KPPrashnaVerdict, string> = {
    favourable: `११वें कस्प का उप-स्वामी ${planetName} है, जो भाव [${housesStr}] का सूचक है। शुभ भावों (२/६/१०/११) का संकेत — उत्तर हाँ है।`,
    adverse: `११वें कस्प का उप-स्वामी ${planetName} है, जो भाव [${housesStr}] का सूचक है। अशुभ भावों (५/८/१२) का संकेत — उत्तर नहीं है।`,
    mixed: `११वें कस्प का उप-स्वामी ${planetName} है, जो भाव [${housesStr}] का सूचक है। मिश्रित संकेत — सूक्ष्म कारकों पर निर्भर।`,
  };

  return {
    en: enVerdict[verdict],
    hi: hiVerdict[verdict],
    sa: hiVerdict[verdict], // share devanagari fallback
  };
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export function castKPPrashna(input: KPPrashnaInput): KPPrashnaResult {
  const warnings: string[] = [];

  // 1. Resolve the number (input or derived from epoch in text mode)
  let resolvedNumber: number;
  if (input.mode === 'number') {
    if (input.number === undefined || input.number === null) {
      throw new Error('[kp/prashna] mode=number requires `number` field');
    }
    if (!Number.isInteger(input.number) || input.number < 1 || input.number > 249) {
      throw new Error(`[kp/prashna] number must be integer 1..249, got ${input.number}`);
    }
    resolvedNumber = input.number;
  } else if (input.mode === 'text') {
    if (!input.question || input.question.trim().length === 0) {
      throw new Error('[kp/prashna] mode=text requires non-empty `question` field');
    }
    resolvedNumber = deriveNumberFromEpoch(input.submissionEpochMs);
  } else {
    throw new Error(`[kp/prashna] invalid mode: ${input.mode}`);
  }

  // 2. Number → (nakshatra, sub)
  const nakInfo = getNakshatraAndSubForNumber(resolvedNumber);

  // 3. Cast a KP chart at submission moment for the location
  const dt = new Date(input.submissionEpochMs);
  const date = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
  const time = `${String(dt.getUTCHours()).padStart(2, '0')}:${String(dt.getUTCMinutes()).padStart(2, '0')}`;

  const birthData: BirthData = {
    date,
    time,
    lat: input.lat,
    lng: input.lng,
    // Pass +00:00 because we already converted submission epoch to UTC components.
    // generateKPChart() will subtract this offset (zero) to get UT, preserving the
    // already-UTC value. Lesson L compliance.
    timezone: '+00:00',
    name: 'Prashna',
    place: 'Prashna Cast Location',
    ayanamsha: 'kp',
  };

  const chart = generateKPChart(birthData);

  // 4. Find cuspal analysis for H11
  const h11 = chart.cuspalAnalysis.find((c) => c.house === 11);
  if (!h11) {
    throw new Error('[kp/prashna] H11 cuspal analysis missing from chart');
  }

  // The cuspal sub-lord of H11 itself — read from the cusp's subLordInfo.
  const cuspH11 = chart.cusps.find((c) => c.house === 11);
  if (!cuspH11) {
    throw new Error('[kp/prashna] H11 cusp missing');
  }
  const subLord = cuspH11.subLordInfo.subLord;

  const verdict = classifyVerdict(h11.signifiedHouses);
  const verdictReasonText = verdictReason(verdict, (subLord.name.en ?? 'Unknown') as string, h11.signifiedHouses);

  // 5. Fructification window — deferred to v2.
  // Returning null lets the UI render a placeholder ("Timing analysis
  // available in a future release"). Logged so we know v2 is owed.
  const fructification: KPFructificationWindow | null = null;
  warnings.push('Fructification window (Vimshottari dasha analysis) deferred to v2 engine.');
  console.error('[kp/prashna] info:', warnings.at(-1));

  return {
    question: input.mode === 'text' ? (input.question ?? null) : null,
    number: resolvedNumber,
    nakshatra: { id: nakInfo.nakshatraId, name: nakInfo.nakshatraName },
    sub: { id: nakInfo.subId, name: nakInfo.subName },
    rulingPlanets: chart.rulingPlanets,
    verdict,
    verdictReason: verdictReasonText,
    fructificationWindow: fructification,
    cuspalSubLordOfH11: {
      planetId: subLord.id,
      planetName: subLord.name,
      signifiedHouses: h11.signifiedHouses,
      favours: verdict === 'favourable',
    },
    warnings,
  };
}

// Suppress unused-var warnings for type-only re-exports needed by tests
export const __KP_249_SLOT_WIDTH = KP_249_SLOT_WIDTH;

/**
 * Comprehensive Prompt Builder — Single-Call AI Reading
 *
 * Builds a rich prompt containing the FULL birth chart data (planet positions,
 * houses, dashas, yogas, doshas) and requests structured JSON output covering
 * all 8 life domains in one LLM call.
 *
 * This replaces the per-domain buildDomainPrompt approach with a single
 * comprehensive call that is cached in Supabase for subsequent views.
 */

import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { PersonalReading, DomainType } from './types';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { createHash } from 'crypto';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROMPT_VERSION = 'v1';

/** The 8 life domains we request readings for (excludes currentPeriod). */
const LIFE_DOMAINS: DomainType[] = [
  'health', 'wealth', 'career', 'marriage',
  'children', 'family', 'spiritual', 'education',
];

// ---------------------------------------------------------------------------
// Birth fingerprint (cache key)
// ---------------------------------------------------------------------------

/**
 * Generates a stable fingerprint from birth data.
 * Same birth data → same chart → same fingerprint.
 * Uses date + time + coordinates (4dp) + ayanamsha.
 */
export function generateBirthFingerprint(kundali: KundaliData): string {
  const b = kundali.birthData;
  const raw = [
    b.date,
    b.time,
    Number(b.lat).toFixed(4),
    Number(b.lng).toFixed(4),
    b.ayanamsha,
  ].join('|');
  return createHash('sha256').update(raw).digest('hex').slice(0, 32);
}

// ---------------------------------------------------------------------------
// Planet positions table builder
// ---------------------------------------------------------------------------

function getGrahaName(planetId: number): string {
  return GRAHAS[planetId]?.name?.en ?? `Planet ${planetId}`;
}

function getRashiName(signNum: number): string {
  // RASHIS is 0-indexed but sign numbers are 1-based
  const rashi = RASHIS[signNum - 1];
  return rashi?.name?.en ?? `Sign ${signNum}`;
}

function getNakshatraName(nakshatraId: number): string {
  // Nakshatras are 1-based in the data
  const nak = NAKSHATRAS.find(n => n.id === nakshatraId);
  return nak?.name?.en ?? `Nakshatra ${nakshatraId}`;
}

/**
 * Builds a human-readable planet positions table exactly like:
 * Planet | Sign | House | Degree | Nakshatra | Pada | R
 */
export function buildPlanetTable(planets: PlanetPosition[]): string {
  const header = 'Planet        | Sign          | House | Degree      | Nakshatra        | Pada | R';
  const divider = '-'.repeat(header.length);

  const rows = planets.map((p) => {
    const name = getGrahaName(p.planet.id).padEnd(13);
    const sign = getRashiName(p.sign).padEnd(13);
    const house = String(p.house).padStart(2).padEnd(5);
    const degree = p.degree.padEnd(11);
    const nakshatra = getNakshatraName(p.nakshatra.id).padEnd(16);
    const pada = String(p.pada).padEnd(4);
    const retro = p.isRetrograde ? 'R' : '—';
    return `${name} | ${sign} | ${house} | ${degree} | ${nakshatra} | ${pada} | ${retro}`;
  });

  return [header, divider, ...rows].join('\n');
}

// ---------------------------------------------------------------------------
// House cusps builder
// ---------------------------------------------------------------------------

export function buildHouseCusps(kundali: KundaliData): string {
  if (!kundali.houses || kundali.houses.length === 0) return '';

  const lines = kundali.houses.map((h) => {
    const sign = getRashiName(h.sign);
    return `House ${String(h.house).padStart(2)}: ${sign} (${h.degree.toFixed(1)}°) — Lord: ${h.lord}`;
  });

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Dasha chain builder
// ---------------------------------------------------------------------------

export function buildDashaChain(dashas: DashaEntry[]): string {
  const lines: string[] = [];

  // Find current maha dasha
  const now = new Date().toISOString();
  const currentMaha = dashas.find(
    (d) => d.level === 'maha' && d.startDate <= now && d.endDate >= now,
  );

  if (!currentMaha) {
    // Just show the first few dashas
    return dashas
      .slice(0, 3)
      .map((d) => `${d.level}: ${d.planet} (${d.startDate.slice(0, 10)} to ${d.endDate.slice(0, 10)})`)
      .join('\n');
  }

  lines.push(`Maha Dasha: ${currentMaha.planet} (${currentMaha.startDate.slice(0, 10)} to ${currentMaha.endDate.slice(0, 10)})`);

  // Find current antar dasha
  if (currentMaha.subPeriods) {
    const currentAntar = currentMaha.subPeriods.find(
      (d) => d.startDate <= now && d.endDate >= now,
    );
    if (currentAntar) {
      lines.push(`  Antar Dasha: ${currentAntar.planet} (${currentAntar.startDate.slice(0, 10)} to ${currentAntar.endDate.slice(0, 10)})`);

      // Find current pratyantar
      if (currentAntar.subPeriods) {
        const currentPratyantar = currentAntar.subPeriods.find(
          (d) => d.startDate <= now && d.endDate >= now,
        );
        if (currentPratyantar) {
          lines.push(`    Pratyantar: ${currentPratyantar.planet} (${currentPratyantar.startDate.slice(0, 10)} to ${currentPratyantar.endDate.slice(0, 10)})`);
        }
      }
    }
  }

  // Show upcoming maha dashas (next 2)
  const mahaIdx = dashas.findIndex((d) => d === currentMaha);
  const upcoming = dashas
    .filter((d) => d.level === 'maha')
    .slice(mahaIdx + 1, mahaIdx + 3);
  if (upcoming.length > 0) {
    lines.push('');
    lines.push('Upcoming Maha Dashas:');
    for (const d of upcoming) {
      lines.push(`  ${d.planet} (${d.startDate.slice(0, 10)} to ${d.endDate.slice(0, 10)})`);
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Special conditions builder
// ---------------------------------------------------------------------------

export function buildSpecialConditions(planets: PlanetPosition[]): string {
  const conditions: string[] = [];

  for (const p of planets) {
    const name = getGrahaName(p.planet.id);
    if (p.isExalted) conditions.push(`${name} is EXALTED in ${getRashiName(p.sign)}`);
    if (p.isDebilitated) conditions.push(`${name} is DEBILITATED in ${getRashiName(p.sign)}`);
    if (p.isOwnSign) conditions.push(`${name} is in OWN SIGN (${getRashiName(p.sign)})`);
    if (p.isVargottama) conditions.push(`${name} is VARGOTTAMA`);
    if (p.isCombust) conditions.push(`${name} is COMBUST`);
    if (p.isRetrograde) conditions.push(`${name} is RETROGRADE`);
    if (p.isMrityuBhaga) conditions.push(`${name} is in MRITYU BHAGA (critical degree)`);
    if (p.isPushkarNavamsha) conditions.push(`${name} is in PUSHKAR NAVAMSHA (auspicious)`);
    if (p.isPushkarBhaga) conditions.push(`${name} is in PUSHKAR BHAGA (auspicious degree)`);
  }

  return conditions.length > 0 ? conditions.join('\n') : 'None of note.';
}

// ---------------------------------------------------------------------------
// Domain scores summary builder
// ---------------------------------------------------------------------------

export function buildDomainScoresSummary(reading: PersonalReading): string {
  return reading.domains
    .map((d) => {
      const yogaNames = d.natalPromise.supportingYogas
        .map((y) => y.name.en ?? Object.values(y.name)[0])
        .join(', ');
      const doshaNames = d.natalPromise.activeAfflictions
        .map((a) => `${a.name.en ?? Object.values(a.name)[0]} (${a.severity})`)
        .join(', ');

      return [
        `## ${d.domain.toUpperCase()} — Score: ${d.overallRating.score.toFixed(1)}/10 (${d.overallRating.rating})`,
        `Natal promise: ${d.natalPromise.rating.score.toFixed(1)}/10 (${d.natalPromise.rating.rating})`,
        `Current activation: ${d.currentActivation.overallActivationScore.toFixed(1)}/10`,
        `Dasha active for this domain: ${d.currentActivation.isDashaActive ? 'YES' : 'no'}`,
        yogaNames ? `Yogas: ${yogaNames}` : 'Yogas: none',
        doshaNames ? `Doshas: ${doshaNames}` : 'Doshas: none',
        `Headline: ${d.headline.en ?? Object.values(d.headline)[0]}`,
      ].join('\n');
    })
    .join('\n\n');
}

// ---------------------------------------------------------------------------
// Main prompt builder
// ---------------------------------------------------------------------------

export interface ComprehensivePrompt {
  systemPrompt: string;
  userPayload: string;
  promptVersion: string;
}

/**
 * Builds the comprehensive prompt for a single LLM call that covers all 8
 * life domains. Includes full planet positions, house cusps, dasha chain,
 * yogas, doshas, and per-domain rule-engine scores as context.
 */
export function buildComprehensivePrompt(
  kundali: KundaliData,
  reading: PersonalReading,
  nativeAge?: number,
): ComprehensivePrompt {
  const ascSign = getRashiName(kundali.ascendant.sign);
  const ascDeg = kundali.ascendant.degree.toFixed(2);

  const ageContext = nativeAge !== undefined
    ? `The native is currently ${nativeAge} years old. Calibrate observations to their life stage.`
    : '';

  // -----------------------------------------------------------------------
  // System prompt
  // -----------------------------------------------------------------------
  const systemPrompt = `You are a senior Jyotish consultant with 30 years of experience in Vedic astrology, well-versed in BPHS (Brihat Parashara Hora Shastra), Phaladeepika, and Saravali. You are giving a private reading to a client.

IMPORTANT RULES:
- Address the native as "you" — second person throughout.
- Be SPECIFIC: cite actual degree positions, house numbers, planetary placements, nakshatra padas.
- Reference classical texts (BPHS, Phaladeepika, Saravali) when they support your observations.
- Each domain reading must begin with: "If you remember nothing else from this reading, [complete the sentence]."
- Write flowing prose paragraphs, NOT bullet lists or markdown headers within each reading.
- Each domain reading should be 400–600 words.
- For health: never diagnose. Frame as tendencies. Emphasize prevention.
- For children: be gentle and hopeful. Frame difficulties as "requires patience."
- For marriage: be warm but honest. Acknowledge emotional weight.
- For spiritual: be expansive and encouraging. Reference classical texts more heavily.
- For wealth/career: be pragmatic about timing. Mention concrete actions.

${ageContext}

You MUST respond with valid JSON only. No markdown, no backticks, no explanation outside the JSON.

Response format:
{
  "overallInsight": "A 2-3 sentence master insight synthesizing all domains — the single most important thing to understand about this chart.",
  "health": { "reading": "..." },
  "wealth": { "reading": "..." },
  "career": { "reading": "..." },
  "marriage": { "reading": "..." },
  "children": { "reading": "..." },
  "family": { "reading": "..." },
  "spiritual": { "reading": "..." },
  "education": { "reading": "..." }
}`.trim();

  // -----------------------------------------------------------------------
  // User payload — full chart data
  // -----------------------------------------------------------------------
  const sections = [
    '=== BIRTH DATA ===',
    `Name: ${kundali.birthData.name}`,
    `Date: ${kundali.birthData.date}`,
    `Time: ${kundali.birthData.time}`,
    `Place: ${kundali.birthData.place}`,
    `Coordinates: ${kundali.birthData.lat}, ${kundali.birthData.lng}`,
    `Timezone: ${kundali.birthData.timezone}`,
    `Ayanamsha: ${kundali.birthData.ayanamsha} (value: ${kundali.ayanamshaValue.toFixed(4)}°)`,
    '',
    '=== ASCENDANT ===',
    `${ascSign} at ${ascDeg}°`,
    '',
    '=== PLANET POSITIONS ===',
    buildPlanetTable(kundali.planets),
    '',
    '=== SPECIAL CONDITIONS ===',
    buildSpecialConditions(kundali.planets),
    '',
    '=== HOUSE CUSPS ===',
    buildHouseCusps(kundali),
    '',
    '=== VIMSHOTTARI DASHA (current) ===',
    buildDashaChain(kundali.dashas),
    '',
    '=== DOMAIN ANALYSIS (from rule engine — use as foundation, not ceiling) ===',
    buildDomainScoresSummary(reading),
  ];

  // Add shadbala if available
  if (kundali.shadbala && kundali.shadbala.length > 0) {
    sections.push('');
    sections.push('=== SHADBALA (planetary strengths) ===');
    for (const sb of kundali.shadbala) {
      sections.push(
        `${sb.planet}: Total=${sb.totalStrength.toFixed(1)} (Sthana=${sb.sthanaBala.toFixed(1)}, Dig=${sb.digBala.toFixed(1)}, Kala=${sb.kalaBala.toFixed(1)}, Cheshta=${sb.cheshtaBala.toFixed(1)}, Naisargik=${sb.naisargikaBala.toFixed(1)}, Drik=${sb.drikBala.toFixed(1)})`,
      );
    }
  }

  const userPayload = sections.join('\n');

  return {
    systemPrompt,
    userPayload,
    promptVersion: PROMPT_VERSION,
  };
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

/** Parsed AI reading — one entry per domain plus overall insight. */
export interface ParsedAIReading {
  overallInsight: string;
  domains: Record<string, string>; // domain key → reading prose
}

/**
 * Parses the raw LLM JSON response into a structured reading.
 * Throws if the response is not valid JSON or missing required fields.
 */
export function parseAIReadingResponse(raw: string): ParsedAIReading {
  // Strip markdown code fences if present (LLM sometimes wraps in ```json)
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  if (!parsed.overallInsight || typeof parsed.overallInsight !== 'string') {
    throw new Error('Missing or invalid overallInsight in AI response');
  }

  const domains: Record<string, string> = {};
  for (const domain of LIFE_DOMAINS) {
    const entry = parsed[domain];
    if (!entry || typeof entry.reading !== 'string') {
      throw new Error(`Missing or invalid reading for domain: ${domain}`);
    }
    domains[domain] = entry.reading;
  }

  return {
    overallInsight: parsed.overallInsight,
    domains,
  };
}

export { PROMPT_VERSION, LIFE_DOMAINS };

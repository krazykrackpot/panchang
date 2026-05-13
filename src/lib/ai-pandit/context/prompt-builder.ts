/**
 * Prompt Builder — SAC + Query → System Prompt + User Prompt
 *
 * Constructs the two prompt strings sent to the LLM. The system prompt
 * is fixed per tradition/locale; the user prompt is built from the SAC.
 */

import type {
  StructuredAstrologicalContext,
  SACPlanet,
  SACTransit,
  PanditQuery,
  VerdictFactor,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────────────────────────────────────────

const TRADITION_SOURCES: Record<string, string> = {
  parashari: 'Brihat Parashara Hora Shastra (BPHS)',
  jaimini: 'Jaimini Sutras',
  kp: 'Krishnamurti Paddhati',
};

const HINDI_INSTRUCTION = `Respond in शुद्ध हिन्दी using proper Jyotish terminology.
Use: दशा (not dasha), गोचर (not transit), भाव (not house),
राशि (not sign), ग्रह (not planet), उच्च (not exalted),
नीच (not debilitated), वक्री (not retrograde), अस्त (not combust),
शुभ (not auspicious), अशुभ (not inauspicious).
NEVER mix English words into Hindi sentences.
Devanagari numerals are optional — Arabic numerals (1,2,3) are acceptable.`;

const ENGLISH_INSTRUCTION = `Respond in clear, accessible English. Use Jyotish terms with brief parenthetical explanations for non-obvious ones.`;

export function buildSystemPrompt(
  locale: string,
  tradition: string = 'parashari',
  verdict: string = 'MIXED',
): string {
  const traditionSource = TRADITION_SOURCES[tradition] ?? TRADITION_SOURCES.parashari;
  const langInstruction = locale === 'hi' ? HINDI_INSTRUCTION : ENGLISH_INSTRUCTION;

  return `You are a senior Jyotish consultant with 30 years of experience, following ${tradition} tradition (${traditionSource}).

ABSOLUTE RULES:
1. All planetary positions, yogas, doshas, and dashas are PROVIDED to you. You NEVER calculate or invent positions. If a planet is not listed in a house, it is NOT in that house.
2. Your verdict alignment: the overall assessment is ${verdict}. Your narrative MUST align with this assessment. Do not contradict it.
3. You NEVER claim a yoga or dosha that is not in the provided list.
4. You ALWAYS offer remedial paths for challenging periods. Never fatalistic.
5. You cite classical sources when making claims (BPHS chapter, verse).

LANGUAGE:
${langInstruction}

OUTPUT FORMAT:
Respond with ONLY valid JSON matching this schema:
{
  "narrative": "Your full narrative response (3-8 paragraphs)",
  "claims": [
    {"type": "planet_house", "data": {"planet": 6, "house": 7}},
    {"type": "yoga_mentioned", "data": {"name": "gajakesari"}},
    {"type": "dasha_reference", "data": {"major": 6, "sub": 3}},
    {"type": "sade_sati", "data": {"active": true}}
  ],
  "remedies": [
    {"type": "mantra", "name": "...", "instructions": "..."}
  ],
  "classicalCitations": [
    {"text": "BPHS Ch.26", "claim": "Saturn in 7th delays marriage"}
  ]
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// User prompt
// ─────────────────────────────────────────────────────────────────────────────

export function buildUserPrompt(
  sac: StructuredAstrologicalContext,
  query: PanditQuery,
): string {
  const sections: string[] = [];

  // Birth data
  sections.push(`=== BIRTH DATA ===
Date: ${sac.birth.date} | Time: ${sac.birth.time} | Place: ${sac.birth.place}
Coordinates: ${sac.birth.coordinates[0]}, ${sac.birth.coordinates[1]} | Timezone: ${sac.birth.timezone}`);

  // Ascendant
  sections.push(`=== ASCENDANT ===
${sac.ascendant.signName} (${sac.ascendant.degree}) | Nakshatra: ${sac.ascendant.nakshatra} Pada ${sac.ascendant.pada}`);

  // Planetary positions table
  sections.push(`=== PLANETARY POSITIONS ===
${formatPlanetTable(sac.planets)}`);

  // Dasha
  sections.push(`=== ACTIVE DASHA ===
Mahadasha: ${sac.dasha.mahadasha.lordName} (${sac.dasha.mahadasha.start} to ${sac.dasha.mahadasha.end})
Antardasha: ${sac.dasha.antardasha.lordName} (${sac.dasha.antardasha.start} to ${sac.dasha.antardasha.end})${sac.dasha.pratyantardasha ? `\nPratyantardasha: ${sac.dasha.pratyantardasha.lordName} (${sac.dasha.pratyantardasha.start} to ${sac.dasha.pratyantardasha.end})` : ''}`);

  // Yogas
  if (sac.yogas.length > 0) {
    const yogaLines = sac.yogas.map(y => {
      const planetNames = y.planets.length > 0 ? ` — planets: ${y.planets.join(', ')}` : '';
      const ref = y.classicalRef ? ` [${y.classicalRef}]` : '';
      return `- ${y.name} (${y.strength})${planetNames}${ref}`;
    });
    sections.push(`=== DETECTED YOGAS ===\n${yogaLines.join('\n')}`);
  } else {
    sections.push('=== DETECTED YOGAS ===\nNone detected.');
  }

  // Doshas
  if (sac.doshas.length > 0) {
    const doshaLines = sac.doshas.map(d => `- ${d.name} (${d.severity})`);
    sections.push(`=== DETECTED DOSHAS ===\n${doshaLines.join('\n')}`);
  } else {
    sections.push('=== DETECTED DOSHAS ===\nNone detected.');
  }

  // Transits
  if (sac.transits.length > 0) {
    sections.push(`=== CURRENT TRANSITS ===
${formatTransitTable(sac.transits)}`);
  }

  // Special conditions
  const specials: string[] = [];
  specials.push(`Sade Sati: ${sac.sadeSati.active ? `Active (${sac.sadeSati.phase} phase)` : 'Not active'}`);
  specials.push(`Kaal Sarpa: ${sac.kaalSarpa.active ? `Active (${sac.kaalSarpa.type})` : 'Not active'}`);
  sections.push(`=== SPECIAL CONDITIONS ===\n${specials.join('\n')}`);

  // Domain assessment
  sections.push(`=== DOMAIN ASSESSMENT ===
Verdict: ${sac.primaryVerdict}
Key factors:
${formatFactors(sac.primaryFactors)}`);

  // Constraints
  sections.push(`=== CONSTRAINTS ===
- Verdict is ${sac.primaryVerdict}. Your narrative MUST align.
- You may elaborate on ONLY the yogas listed above. No others.
- You may discuss ONLY the doshas listed above. No others.
- Planet positions are as shown. Do NOT claim any planet in a different house/sign.`);

  // User question — sanitised to prevent prompt injection attempts
  const sanitisedQuery = query.text.replace(/[\x00-\x1f]/g, '').slice(0, 500);
  sections.push(`=== USER QUESTION ===
${sanitisedQuery}`);

  return sections.join('\n\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Retry prompt augmentation
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationFailureSummary {
  layer: string;
  message: string;
}

export function buildRetryPrompt(
  originalUser: string,
  failures: ValidationFailureSummary[],
): string {
  const failureList = failures.map((f, i) =>
    `${i + 1}. [${f.layer}] ${f.message}`
  ).join('\n');

  return `${originalUser}

=== CORRECTION NOTICE ===
Your previous response was rejected by our verification system.

Failures:
${failureList}

Generate a new response that addresses these specific issues.
All other constraints from the original prompt still apply.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────

function formatPlanetTable(planets: SACPlanet[]): string {
  const header = '| Planet    | Sign        | House | Degree      | Nakshatra        | Pada | Dignity      | R? | Combust? |';
  const separator = '|-----------|-------------|-------|-------------|------------------|------|--------------|----|----------|';
  const rows = planets.map(p =>
    `| ${pad(p.name, 9)} | ${pad(p.signName, 11)} | ${pad(String(p.house), 5)} | ${pad(p.degree, 11)} | ${pad(p.nakshatra, 16)} | ${pad(String(p.pada), 4)} | ${pad(p.dignity, 12)} | ${p.isRetrograde ? 'Y ' : 'N '} | ${p.isCombust ? 'Y       ' : 'N       '} |`
  );
  return [header, separator, ...rows].join('\n');
}

function formatTransitTable(transits: SACTransit[]): string {
  const header = '| Planet  | Sign | From Moon | From Lagna | R? | SAV |';
  const separator = '|---------|------|-----------|------------|----|-----|';
  const rows = transits.map(t =>
    `| ${pad(t.planetName, 7)} | ${pad(String(t.sign), 4)} | ${pad(ordinal(t.houseFromMoon), 9)} | ${pad(ordinal(t.houseFromLagna), 10)} | ${t.isRetrograde ? 'Y ' : 'N '} | ${pad(String(t.savBindus), 3)} |`
  );
  return [header, separator, ...rows].join('\n');
}

function formatFactors(factors: VerdictFactor[]): string {
  if (factors.length === 0) return '- No specific factors identified.';
  return factors.map(f =>
    `- [${f.sentiment}] ${f.detail}`
  ).join('\n');
}

function pad(s: string, len: number): string {
  return s.padEnd(len).slice(0, len);
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

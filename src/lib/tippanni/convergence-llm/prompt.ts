/**
 * Prompt templates for LLM-powered tippanni synthesis.
 * The pattern engine does the astrology. Claude is the narrator.
 */

import type { ConvergenceResult, MatchedPattern, MetaInsight } from '../convergence/types';

const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter',
  5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

function planetName(id: number): string {
  return PLANET_NAMES[id] ?? `Planet-${id}`;
}

export function buildSystemPrompt(locale: 'en' | 'hi'): string {
  if (locale === 'hi') {
    return `You are a senior Vedic astrologer (ज्योतिषाचार्य) writing a personal consultation in Hindi. You speak with warmth, wisdom, and authority — like a trusted family astrologer who has studied your chart deeply.

You will receive structured chart analysis results from a pattern-matching engine. Your job is to weave these findings into a coherent, empathetic narrative.

RULES:
- Do NOT invent astrological claims — only narrate what the data shows.
- Do NOT use English words when Hindi equivalents exist.
- Use Devanagari script throughout.
- Be specific — name the planets, houses, and signs involved.
- Be empathetic but honest — don't sugarcoat difficult patterns.
- Give actionable guidance, not vague platitudes.
- Keep it under 800 words.`;
  }

  return `You are a senior Vedic astrologer writing a personal consultation. You speak with warmth, wisdom, and authority — like a trusted advisor who has studied this chart for years.

You will receive structured chart analysis results from a pattern-matching engine. Your job is to weave these findings into a coherent, deeply personal narrative.

RULES:
- Do NOT invent astrological claims — only narrate what the data shows.
- Be specific — name the planets, houses, and signs involved.
- Be empathetic but honest — don't sugarcoat difficult patterns, but frame them constructively.
- Give actionable guidance, not vague platitudes. "Strengthen Saturn through discipline and service" beats "be careful."
- Use astrological terms naturally but briefly explain them on first use.
- Write for someone who knows a little Jyotish, not a complete beginner.
- Keep it under 800 words total.
- Do NOT use bullet points or numbered lists — write in prose paragraphs.
- Bold section headers are fine. Flowing prose within each section is required.`;
}

export function buildUserPrompt(
  convergence: ConvergenceResult,
  chartSummary: {
    ascendant: string;
    moonSign: string;
    sunSign: string;
    currentDasha: string;
    currentAntardasha: string;
  }
): string {
  const { executive, patterns, transitOverlay } = convergence;

  // Format matched patterns
  const patternSummaries = patterns.map((p: MatchedPattern) =>
    `- ${p.patternId} (${p.theme}, ${p.matchCount}/${p.totalConditions} conditions, score: ${p.finalScore.toFixed(1)}${p.isFullMatch ? ', FULL MATCH' : ''}): ${p.text.en}`
  ).join('\n');

  // Format meta-insights
  const metaSummaries = executive.metaInsights.map((m: MetaInsight) =>
    `- [${m.ruleId}] ${m.text.en}`
  ).join('\n');

  // Format transit snapshot
  const transitSummaries = transitOverlay.snapshot.map(t =>
    `- ${planetName(t.planetId)} transiting house ${t.houseFromMoon} from Moon (${t.isRetrograde ? 'retrograde' : 'direct'}, ${t.ashtakavargaBindus} SAV bindus)`
  ).join('\n');

  // Format urgent flags
  const urgentSummaries = executive.urgentFlags.map(f =>
    `- [${f.icon.toUpperCase()}] ${f.message.en}`
  ).join('\n');

  return `## Chart Summary
- Ascendant: ${chartSummary.ascendant}
- Moon Sign: ${chartSummary.moonSign}
- Sun Sign: ${chartSummary.sunSign}
- Current Mahadasha: ${chartSummary.currentDasha}
- Current Antardasha: ${chartSummary.currentAntardasha}

## Overall Assessment
- Activation Level: ${executive.activation}/10
- Favorability: ${executive.favorability > 0 ? '+' : ''}${executive.favorability}/5
- Tone: ${executive.tone}

## Active Convergence Patterns (${patterns.length} detected)
${patternSummaries || '(none)'}

## Cross-Pattern Interactions
${metaSummaries || '(none)'}

## Current Transit Snapshot
${transitSummaries || '(none active)'}

## Urgent Flags
${urgentSummaries || '(none)'}

## Retrograde Status
${transitOverlay.retroStatus.map(r => `- ${planetName(r.planetId)}: ${r.effect.en}`).join('\n') || '(none retrograde)'}

## Ashtakavarga Highlights
${transitOverlay.ashtakavargaHighlights.map(a => a.text.en).join('\n') || '(none notable)'}

---

Write a personalized reading with these sections:
1. **Opening** — The single most important thing this person needs to hear right now. Lead with impact.
2. **Life Themes** — Weave the active patterns into 2-4 themed paragraphs. Don't just list them — connect them into a story.
3. **Timing** — What's peaking now, what's building, what's fading. Give temporal context.
4. **Guidance** — Actionable advice grounded in the chart findings. Be specific.`;
}

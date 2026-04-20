/**
 * LLM Prompt Builder — Domain Synthesis
 *
 * Constructs the system prompt and user payload for the Personal Pandit
 * AI reading call. Each life domain gets a tailored tone injection on top
 * of a shared Jyotish consultant persona.
 */

import type { DomainReading, DomainType } from './types';

// ---------------------------------------------------------------------------
// Per-domain tone instructions
// ---------------------------------------------------------------------------

export const DOMAIN_TONE: Record<DomainType, string> = {
  currentPeriod:
    'Be practical and time-oriented. Focus on immediate actions.',
  health:
    'Be measured and cautious. Never diagnose. Frame as tendencies. Emphasize prevention and lifestyle.',
  wealth:
    'Be pragmatic and specific about timing. Mention concrete actions. Avoid guaranteed-wealth language.',
  career:
    'Be direct and strategic. Frame in terms of leverage and timing.',
  marriage:
    'Be warm but honest. Acknowledge emotional weight. Frame challenges as growth opportunities.',
  children:
    'Be gentle and hopeful. This is deeply personal. Frame difficulties as "requires patience" not "unlikely."',
  family:
    'Be respectful of family dynamics. Acknowledge cultural weight of parental relationships.',
  spiritual:
    'Be expansive and encouraging. Use poetic language. Reference classical texts more heavily.',
  education:
    'Be analytical and encouraging. Frame in terms of intellectual gifts and optimal learning paths.',
};

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

export interface DomainPrompt {
  systemPrompt: string;
  userPayload: string;
}

/**
 * Builds the system prompt and serialised user payload for an LLM call
 * that will generate a personalised domain reading.
 *
 * @param reading   - The fully synthesised DomainReading produced by the engine.
 * @param nativeAge - Optional age of the native (years). Adds age-aware context.
 * @returns An object with `systemPrompt` and `userPayload` ready for the LLM call.
 */
export function buildDomainPrompt(
  reading: DomainReading,
  nativeAge?: number,
): DomainPrompt {
  const tone = DOMAIN_TONE[reading.domain];
  const ageContext =
    nativeAge !== undefined
      ? `The native is currently ${nativeAge} years old. Calibrate your observations accordingly — life stage matters.`
      : '';

  // -------------------------------------------------------------------------
  // System prompt
  // -------------------------------------------------------------------------
  const systemPrompt = `You are a senior Jyotish consultant with 30 years of experience in Vedic astrology. You are giving a private reading to a client. Always address the native as "you" — second person throughout.

Be specific: cite actual dates, degree positions, house numbers, and planetary placements when they are available in the data. Vague generalities are not acceptable.

Draw freely from classical texts: BPHS (Brihat Parashara Hora Shastra), Phaladeepika, and Saravali. Reference them when appropriate to give authority to your observations.

Tone for this domain (${reading.domain}): ${tone}
${ageContext}

Structure your response as flowing prose paragraphs — NOT bullet lists or headers. Write 400–600 words.

Most importantly: identify THE single most important insight for this domain. Begin your response with exactly this sentence structure: "If you remember nothing else from this reading, [complete the sentence]." This opening sets the frame for everything that follows.`.trim();

  // -------------------------------------------------------------------------
  // User payload — strip to essential data only
  // -------------------------------------------------------------------------
  const payload = {
    domain: reading.domain,
    overallRating: {
      rating: reading.overallRating.rating,
      score: reading.overallRating.score,
    },
    natalRating: {
      rating: reading.natalPromise.rating.rating,
      score: reading.natalPromise.rating.score,
    },
    currentActivationRating: {
      score: reading.currentActivation.overallActivationScore,
      isDashaActive: reading.currentActivation.isDashaActive,
      dashaActivationScore: reading.currentActivation.dashaActivationScore,
    },
    headline: reading.headline,
    houseAnalysis: {
      houseScores: reading.natalPromise.houseScores,
      lordQualities: reading.natalPromise.lordQualities,
    },
    yogas: reading.natalPromise.supportingYogas.map((y) => ({
      name: y.name,
      category: y.category,
      strength: y.strength,
    })),
    doshas: reading.natalPromise.activeAfflictions.map((a) => ({
      name: a.name,
      severity: a.severity,
    })),
    dashaContext: {
      mahaDashaLordId: reading.currentActivation.mahaDashaLordId,
      antarDashaLordId: reading.currentActivation.antarDashaLordId,
      summary: reading.currentActivation.summary,
    },
    transitOverlay: reading.currentActivation.transitInfluences.map((t) => ({
      planetId: t.planetId,
      transitHouse: t.transitHouse,
      nature: t.nature,
      intensity: t.intensity,
      description: t.description,
    })),
    topTimelineTriggers: reading.timelineTriggers
      .slice(0, 3)
      .map((t) => ({
        startDate: t.startDate,
        endDate: t.endDate,
        triggerType: t.triggerType,
        planets: t.planets,
        nature: t.nature,
        description: t.description,
      })),
    strongRemedies: reading.remedies
      .filter((r) => r.difficulty !== 'intensive')
      .slice(0, 3)
      .map((r) => ({
        type: r.type,
        name: r.name,
        instructions: r.instructions,
        targetPlanetId: r.targetPlanetId,
      })),
  };

  return {
    systemPrompt,
    userPayload: JSON.stringify(payload, null, 2),
  };
}

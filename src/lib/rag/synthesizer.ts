/**
 * Claude Synthesis Engine
 *
 * Takes retrieved classical references + kundali context
 * and produces grounded interpretations with citations.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ClassicalReference, ClassicalInsight, SynthesizedCitation } from './types';
import type { PlanetPosition } from '@/types/kundali';
import type { PlanetInsight } from '@/lib/kundali/tippanni-types';

// ============================================================
// System Prompt
// ============================================================

const SYSTEM_PROMPT = `You are a Vedic astrology scholar with deep knowledge of classical Jyotish texts including BPHS, Phaladeepika, Saravali, Brihat Jataka, Bhrigu Sutram, Jataka Parijata, and Uttara Kalamrita.

Your role is to synthesize retrieved classical verses into a concise, grounded interpretation for a specific planetary placement in a birth chart.

RULES:
1. Only cite verses that are directly relevant to the queried placement.
2. Synthesize across multiple texts when they agree, noting disagreements when they exist.
3. Be specific about what each text says — do not generalize or add unsupported claims.
4. Keep the synthesis concise (2-4 sentences).
5. For each cited verse, explain in one phrase why it is relevant.
6. If retrieved verses are not sufficiently relevant (similarity < 0.4), say so honestly.
7. Respond ONLY with valid JSON matching the schema — no markdown fences, no extra text.
8. Use the planet's dignity state (exalted/debilitated/own sign/retrograde) to contextualize the classical verses.`;

// ============================================================
// Prompt Builders
// ============================================================

function buildPlanetPrompt(
  planet: PlanetPosition,
  existingInsight: PlanetInsight,
  references: ClassicalReference[]
): string {
  const planetName = existingInsight.planetName;
  const signName = existingInsight.signName;

  let dignityContext = '';
  if (planet.isExalted) dignityContext = 'EXALTED';
  else if (planet.isDebilitated) dignityContext = 'DEBILITATED';
  else if (planet.isOwnSign) dignityContext = 'IN OWN SIGN';
  if (planet.isRetrograde) dignityContext += (dignityContext ? ' ' : '') + 'RETROGRADE';

  const refsBlock = references
    .map(
      (ref, i) =>
        `[${i + 1}] ${ref.textFullName}, Chapter ${ref.chapter ?? '?'}` +
        (ref.verseStart
          ? `, Verse ${ref.verseStart}${ref.verseEnd && ref.verseEnd !== ref.verseStart ? `-${ref.verseEnd}` : ''}`
          : '') +
        ` (similarity: ${ref.similarity.toFixed(3)})` +
        `\nCategory: ${ref.topicCategory}` +
        (ref.sanskritText ? `\nSanskrit: ${ref.sanskritText}` : '') +
        `\nTranslation: ${ref.translation}` +
        (ref.commentary ? `\nCommentary: ${ref.commentary}` : '')
    )
    .join('\n\n');

  return `PLACEMENT: ${planetName} in House ${planet.house} in ${signName} ${dignityContext ? `(${dignityContext})` : ''}

EXISTING INTERPRETATION (deterministic engine):
${existingInsight.description}

RETRIEVED CLASSICAL REFERENCES:
${refsBlock || 'No relevant references found.'}

Synthesize the classical references into a grounded insight for this specific placement.
Respond with valid JSON only:
{"summary": "2-4 sentence synthesis drawing from the classical texts", "references": [{"textName": "BPHS", "textFullName": "Brihat Parashara Hora Shastra", "chapter": 22, "verseRange": "Ch.22 Sl.3-4", "sanskritExcerpt": "brief Sanskrit or null", "translationExcerpt": "key excerpt", "relevanceNote": "why relevant"}], "confidence": "high"}`;
}

function buildGenericPrompt(
  topicName: string,
  description: string,
  references: ClassicalReference[]
): string {
  const refsBlock = references
    .map(
      (ref, i) =>
        `[${i + 1}] ${ref.textFullName}, Ch.${ref.chapter ?? '?'} V.${ref.verseStart ?? '?'}` +
        ` (sim: ${ref.similarity.toFixed(3)})` +
        `\nTranslation: ${ref.translation}` +
        (ref.commentary ? `\nCommentary: ${ref.commentary}` : '')
    )
    .join('\n\n');

  return `TOPIC: ${topicName}
EXISTING DESCRIPTION: ${description}

RETRIEVED CLASSICAL REFERENCES:
${refsBlock || 'No relevant references found.'}

Synthesize classical references for this topic. Respond with valid JSON only:
{"summary": "2-4 sentence synthesis", "references": [{"textName": "BPHS", "textFullName": "Brihat Parashara Hora Shastra", "chapter": null, "verseRange": "Ch.X Sl.Y", "sanskritExcerpt": null, "translationExcerpt": "excerpt", "relevanceNote": "why relevant"}], "confidence": "high"}`;
}

// ============================================================
// Synthesizer Class
// ============================================================

export class ClassicalSynthesizer {
  private client: Anthropic;
  private model: string;

  constructor(model?: string) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = model || 'claude-sonnet-4-20250514';
  }

  async synthesizePlanetInsight(
    planet: PlanetPosition,
    existingInsight: PlanetInsight,
    references: ClassicalReference[]
  ): Promise<ClassicalInsight | null> {
    const relevantRefs = references.filter((r) => r.similarity > 0.2);
    if (relevantRefs.length === 0) return null;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildPlanetPrompt(planet, existingInsight, relevantRefs),
          },
        ],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';
      return this.parseInsightJSON(text);
    } catch (err) {
      console.error('Planet synthesis error:', err);
      return null;
    }
  }

  async synthesizeYogaInsight(
    yogaName: string,
    yogaDescription: string,
    references: ClassicalReference[]
  ): Promise<ClassicalInsight | null> {
    const relevantRefs = references.filter((r) => r.similarity > 0.2);
    if (relevantRefs.length === 0) return null;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildGenericPrompt(
              `${yogaName} Yoga`,
              yogaDescription,
              relevantRefs
            ),
          },
        ],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';
      return this.parseInsightJSON(text);
    } catch (err) {
      console.error('Yoga synthesis error:', err);
      return null;
    }
  }

  async synthesizeDoshaInsight(
    doshaName: string,
    doshaDescription: string,
    references: ClassicalReference[]
  ): Promise<ClassicalInsight | null> {
    const relevantRefs = references.filter((r) => r.similarity > 0.2);
    if (relevantRefs.length === 0) return null;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildGenericPrompt(
              `${doshaName} Dosha`,
              doshaDescription,
              relevantRefs
            ),
          },
        ],
      });

      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';
      return this.parseInsightJSON(text);
    } catch (err) {
      console.error('Dosha synthesis error:', err);
      return null;
    }
  }

  private parseInsightJSON(text: string): ClassicalInsight | null {
    try {
      // Strip markdown code fences if present
      const cleaned = text.replace(/```(?:json)?\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Validate structure
      if (!parsed.summary || !Array.isArray(parsed.references)) {
        console.error('Invalid insight JSON structure');
        return null;
      }

      return {
        summary: parsed.summary,
        references: (parsed.references as SynthesizedCitation[]).map((r) => ({
          textName: r.textName || '',
          textFullName: r.textFullName || '',
          chapter: r.chapter ?? null,
          verseRange: r.verseRange || '',
          sanskritExcerpt: r.sanskritExcerpt || null,
          translationExcerpt: r.translationExcerpt || '',
          relevanceNote: r.relevanceNote || '',
        })),
        confidence: parsed.confidence || 'medium',
      };
    } catch (err) {
      console.error('Failed to parse synthesis JSON:', err, '\nRaw text:', text);
      return null;
    }
  }
}

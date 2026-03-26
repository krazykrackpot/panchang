/**
 * RAG Retrieval Engine
 *
 * Translates kundali context (planet placements, yogas, doshas)
 * into vector queries against the classical Jyotish text corpus.
 *
 * Dual-layer filtering: metadata pre-filter (SQL) + vector similarity ranking.
 */

import { getSupabaseClient } from './supabase';
import { createEmbeddingProvider } from './embeddings';
import type {
  EmbeddingProvider,
  ClassicalReference,
  RetrievalQuery,
  RetrievalResult,
} from './types';
import type { PlanetPosition, KundaliData } from '@/types/kundali';

// ============================================================
// Planet/Sign name mappings for query construction
// ============================================================

const PLANET_QUERY_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

const PLANET_TAG_NAMES: Record<number, string> = {
  0: 'sun', 1: 'moon', 2: 'mars', 3: 'mercury',
  4: 'jupiter', 5: 'venus', 6: 'saturn', 7: 'rahu', 8: 'ketu',
};

const SIGN_TAG_NAMES: Record<number, string> = {
  1: 'aries', 2: 'taurus', 3: 'gemini', 4: 'cancer',
  5: 'leo', 6: 'virgo', 7: 'libra', 8: 'scorpio',
  9: 'sagittarius', 10: 'capricorn', 11: 'aquarius', 12: 'pisces',
};

const SIGN_NAMES: Record<number, string> = {
  1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
  5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
  9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
  switch (n % 10) {
    case 1: return n + 'st';
    case 2: return n + 'nd';
    case 3: return n + 'rd';
    default: return n + 'th';
  }
}

// ============================================================
// Query Builders
// ============================================================

export function buildPlanetPlacementQuery(planet: PlanetPosition): RetrievalQuery {
  const planetName = PLANET_QUERY_NAMES[planet.planet.id] || 'Planet';
  const signName = SIGN_NAMES[planet.sign] || '';
  const planetTag = PLANET_TAG_NAMES[planet.planet.id];
  const signTag = SIGN_TAG_NAMES[planet.sign];

  let query = `${planetName} in the ${ordinal(planet.house)} house in ${signName}`;
  if (planet.isExalted) query += ' exalted';
  if (planet.isDebilitated) query += ' debilitated';
  if (planet.isOwnSign) query += ' in own sign';
  if (planet.isRetrograde) query += ' retrograde';
  if (planet.isCombust) query += ' combust';
  query += `. Effects and results of ${planetName} placed in house ${planet.house}.`;

  return {
    naturalLanguageQuery: query,
    topicCategory: 'graha-in-bhava',
    grahaTags: planetTag ? [planetTag] : undefined,
    bhavaTags: [planet.house],
    rashiTags: signTag ? [signTag] : undefined,
    maxResults: 5,
    threshold: 0.25,
  };
}

export function buildYogaQuery(
  yogaName: string,
  involvedPlanets: string[] = []
): RetrievalQuery {
  return {
    naturalLanguageQuery: `${yogaName} yoga formation conditions effects and results in horoscope`,
    topicCategory: 'yoga',
    yogaTags: [yogaName.toLowerCase().replace(/\s+/g, '')],
    grahaTags: involvedPlanets.length > 0 ? involvedPlanets.map((p) => p.toLowerCase()) : undefined,
    maxResults: 5,
    threshold: 0.25,
  };
}

export function buildDoshaQuery(
  doshaName: string,
  context: string
): RetrievalQuery {
  return {
    naturalLanguageQuery: `${doshaName} dosha causes effects remedies ${context}`,
    topicCategory: 'dosha',
    doshaTags: [doshaName.toLowerCase().replace(/\s+/g, '-')],
    maxResults: 5,
    threshold: 0.25,
  };
}

export function buildDashaQuery(
  mahadashaLord: string,
  antardashaLord: string
): RetrievalQuery {
  return {
    naturalLanguageQuery: `${mahadashaLord} mahadasha ${antardashaLord} antardasha effects results period`,
    topicCategory: 'dasha',
    grahaTags: [mahadashaLord.toLowerCase(), antardashaLord.toLowerCase()],
    maxResults: 4,
    threshold: 0.25,
  };
}

export function buildRemedyQuery(
  planetName: string,
  issue: string
): RetrievalQuery {
  return {
    naturalLanguageQuery: `Remedies for ${planetName} ${issue} gemstone mantra charity worship`,
    topicCategory: 'remedy',
    grahaTags: [planetName.toLowerCase()],
    maxResults: 3,
    threshold: 0.2,
  };
}

// ============================================================
// Retriever Class
// ============================================================

export class ClassicalTextRetriever {
  private embeddingProvider: EmbeddingProvider;

  constructor(embeddingProvider?: EmbeddingProvider) {
    this.embeddingProvider = embeddingProvider || createEmbeddingProvider();
  }

  async retrieve(query: RetrievalQuery): Promise<RetrievalResult> {
    const { embedding } = await this.embeddingProvider.embed(query.naturalLanguageQuery);

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.rpc('match_classical_chunks', {
      query_embedding: embedding,
      match_threshold: query.threshold ?? 0.25,
      match_count: query.maxResults ?? 5,
      filter_topic_category: query.topicCategory ?? null,
      filter_graha: query.grahaTags?.[0] ?? null,
      filter_bhava: query.bhavaTags?.[0] ?? null,
      filter_rashi: query.rashiTags?.[0] ?? null,
      filter_text_names: query.textNames ?? null,
    });

    if (error) {
      console.error('RAG retrieval error:', error);
      return { references: [], query, cached: false };
    }

    const references: ClassicalReference[] = (data || []).map(
      (row: Record<string, unknown>) => ({
        id: row.id as string,
        textName: row.text_name as string,
        textFullName: row.text_full_name as string,
        chapter: row.chapter as number | null,
        chapterTitle: row.chapter_title as string | null,
        verseStart: row.verse_start as number | null,
        verseEnd: row.verse_end as number | null,
        sanskritText: row.sanskrit_text as string | null,
        translation: row.translation as string,
        commentary: row.commentary as string | null,
        topicTags: row.topic_tags as string[],
        topicCategory: row.topic_category as string,
        similarity: row.similarity as number,
      })
    );

    return { references, query, cached: false };
  }

  async retrieveForKundali(
    kundali: KundaliData
  ): Promise<Map<string, ClassicalReference[]>> {
    const results = new Map<string, ClassicalReference[]>();

    // Build queries for all 9 planet placements
    const planetQueries = kundali.planets.map((p) => ({
      key: `planet-${p.planet.id}`,
      query: buildPlanetPlacementQuery(p),
    }));

    // Execute all planet queries in parallel
    const planetResults = await Promise.all(
      planetQueries.map(async ({ key, query }) => {
        try {
          const result = await this.retrieve(query);
          return { key, references: result.references };
        } catch (err) {
          console.error(`Retrieval failed for ${key}:`, err);
          return { key, references: [] };
        }
      })
    );

    for (const { key, references } of planetResults) {
      results.set(key, references);
    }

    return results;
  }
}

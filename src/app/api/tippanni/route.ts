import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { isSupabaseConfigured } from '@/lib/rag/supabase';
import {
  getDemoPlanetReferences,
  getDemoYogaReferences,
  getDemoDoshaReferences,
} from '@/lib/rag/demo-data';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import { buildConvergenceInput } from '@/lib/tippanni/convergence/relationship-map';
import { runConvergenceEngine } from '@/lib/tippanni/convergence/engine';

// ============================================================
// In-memory cache (1 hour TTL)
// ============================================================

const memoryCache = new Map<
  string,
  { data: TippanniContent; timestamp: number }
>();
const CACHE_TTL_MS = 1000 * 60 * 60;
const MAX_CACHE_ENTRIES = 200;

function cacheSet(key: string, data: TippanniContent) {
  memoryCache.set(key, { data, timestamp: Date.now() });
  if (memoryCache.size > MAX_CACHE_ENTRIES) {
    const entries = [...memoryCache.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < entries.length - MAX_CACHE_ENTRIES; i++) {
      memoryCache.delete(entries[i][0]);
    }
  }
}

function getCacheKey(
  kundali: KundaliData,
  locale: Locale,
  ragEnabled: boolean
): string {
  const canonical = JSON.stringify({
    asc: kundali.ascendant.sign,
    planets: kundali.planets.map((p) => ({
      id: p.planet.id,
      house: p.house,
      sign: p.sign,
      exalted: p.isExalted,
      debilitated: p.isDebilitated,
      ownSign: p.isOwnSign,
      retro: p.isRetrograde,
    })),
    locale,
    rag: ragEnabled,
  });
  return createHash('sha256').update(canonical).digest('hex');
}

// ============================================================
// Request type
// ============================================================

interface TippanniRequest {
  kundali: KundaliData;
  locale: Locale;
  ragEnabled?: boolean;
  ragSections?: string[];
}

// ============================================================
// POST handler
// ============================================================

export async function POST(request: Request) {
  try {
    const body: TippanniRequest = await request.json();
    const { kundali, locale, ragEnabled = true, ragSections } = body;

    if (!kundali || !kundali.planets || !kundali.ascendant) {
      return NextResponse.json(
        { error: 'Invalid kundali data' },
        { status: 400 }
      );
    }

    // Check in-memory cache
    const cacheKey = getCacheKey(kundali, locale, ragEnabled);
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'private, max-age=3600' },
      });
    }

    // Step 1: Generate base deterministic tippanni
    const baseTippanni = generateTippanni(kundali, locale);

    // Step 1b: Run convergence engine (non-fatal)
    let convergence: TippanniContent['convergence'] = null;
    try {
      const convergenceInput = buildConvergenceInput(kundali);
      convergence = runConvergenceEngine(convergenceInput);
    } catch (err) {
      console.error('Convergence engine failed (non-fatal):', err);
    }
    baseTippanni.convergence = convergence;

    // Step 2: Check if RAG can be enabled
    const canRAG =
      ragEnabled &&
      !!process.env.ANTHROPIC_API_KEY &&
      isSupabaseConfigured() &&
      (!!process.env.COHERE_API_KEY ||
        !!process.env.OPENAI_API_KEY ||
        process.env.EMBEDDING_PROVIDER === 'local');

    if (!canRAG) {
      // Use demo classical references so the UI works without external services
      const result = enhanceWithDemoData(kundali, baseTippanni);
      cacheSet(cacheKey, result);
      return NextResponse.json(result, {
        headers: { 'Cache-Control': 'private, max-age=3600' },
      });
    }

    // Step 3: RAG enhancement
    try {
      const enhanced = await enhanceWithRAG(kundali, baseTippanni, ragSections);
      cacheSet(cacheKey, enhanced);
      return NextResponse.json(enhanced, {
        headers: { 'Cache-Control': 'private, max-age=3600' },
      });
    } catch (ragError) {
      console.error('RAG enhancement failed, falling back:', ragError);
      const result: TippanniContent = {
        ...baseTippanni,
        ragEnabled: false,
        ragError: 'Classical reference lookup temporarily unavailable',
      };
      cacheSet(cacheKey, result);
      return NextResponse.json(result, {
        headers: { 'Cache-Control': 'private, max-age=3600' },
      });
    }
  } catch (err) {
    console.error('Tippanni API error:', err);
    return NextResponse.json(
      { error: 'Failed to generate tippanni' },
      { status: 500 }
    );
  }
}

// ============================================================
// Demo Data Enhancement (no external services needed)
// ============================================================

function enhanceWithDemoData(
  kundali: KundaliData,
  baseTippanni: TippanniContent
): TippanniContent {
  const enhancedPlanets = baseTippanni.planetInsights.map((insight) => {
    const planet = kundali.planets.find((p) => p.planet.id === insight.planetId);
    if (!planet) return insight;
    const refs = getDemoPlanetReferences(insight.planetId, planet.house);
    if (!refs) return insight;
    return { ...insight, classicalReferences: refs };
  });

  const enhancedYogas = baseTippanni.yogas.map((yoga) => {
    if (!yoga.present) return yoga;
    const refs = getDemoYogaReferences(yoga.name);
    if (!refs) return yoga;
    return { ...yoga, classicalReferences: refs };
  });

  const enhancedDoshas = baseTippanni.doshas.map((dosha) => {
    if (!dosha.present) return dosha;
    const refs = getDemoDoshaReferences(dosha.name);
    if (!refs) return dosha;
    return { ...dosha, classicalReferences: refs };
  });

  return {
    ...baseTippanni,
    planetInsights: enhancedPlanets,
    yogas: enhancedYogas,
    doshas: enhancedDoshas,
    ragEnabled: true,
    ragTimestamp: new Date().toISOString(),
  };
}

// ============================================================
// RAG Enhancement Pipeline
// ============================================================

async function enhanceWithRAG(
  kundali: KundaliData,
  baseTippanni: TippanniContent,
  sections?: string[]
): Promise<TippanniContent> {
  // Dynamic imports to avoid loading RAG modules when not needed
  const { ClassicalTextRetriever, buildYogaQuery, buildDoshaQuery } =
    await import('@/lib/rag/retriever');
  const { ClassicalSynthesizer } = await import('@/lib/rag/synthesizer');

  const retriever = new ClassicalTextRetriever();
  const synthesizer = new ClassicalSynthesizer();

  const shouldEnhance = (section: string) =>
    !sections || sections.includes(section);

  // --- Planet Insights ---
  let enhancedPlanets = baseTippanni.planetInsights;
  if (shouldEnhance('planetInsights')) {
    const planetRefs = await retriever.retrieveForKundali(kundali);

    enhancedPlanets = await Promise.all(
      baseTippanni.planetInsights.map(async (insight) => {
        const refs = planetRefs.get(`planet-${insight.planetId}`) || [];
        const planet = kundali.planets.find(
          (p) => p.planet.id === insight.planetId
        );
        if (!planet || refs.length === 0) return insight;

        const classical = await synthesizer.synthesizePlanetInsight(
          planet,
          insight,
          refs
        );
        if (!classical) return insight;

        return {
          ...insight,
          classicalReferences: {
            summary: classical.summary,
            citations: classical.references,
            confidence: classical.confidence,
          },
        };
      })
    );
  }

  // --- Yogas ---
  let enhancedYogas = baseTippanni.yogas;
  if (shouldEnhance('yogas')) {
    const presentYogas = baseTippanni.yogas.filter((y) => y.present);
    const absentYogas = baseTippanni.yogas.filter((y) => !y.present);

    const yogaResults = await Promise.all(
      presentYogas.map(async (yoga) => {
        const query = buildYogaQuery(yoga.name, []);
        const result = await retriever.retrieve(query);
        if (result.references.length === 0) return yoga;

        const classical = await synthesizer.synthesizeYogaInsight(
          yoga.name,
          yoga.description,
          result.references
        );
        if (!classical) return yoga;

        return {
          ...yoga,
          classicalReferences: {
            summary: classical.summary,
            citations: classical.references,
            confidence: classical.confidence,
          },
        };
      })
    );

    enhancedYogas = [...yogaResults, ...absentYogas];
  }

  // --- Doshas ---
  let enhancedDoshas = baseTippanni.doshas;
  if (shouldEnhance('doshas')) {
    enhancedDoshas = await Promise.all(
      baseTippanni.doshas.map(async (dosha) => {
        if (!dosha.present) return dosha;
        const query = buildDoshaQuery(dosha.name, dosha.description);
        const result = await retriever.retrieve(query);
        if (result.references.length === 0) return dosha;

        const classical = await synthesizer.synthesizeDoshaInsight(
          dosha.name,
          dosha.description,
          result.references
        );
        if (!classical) return dosha;

        return {
          ...dosha,
          classicalReferences: {
            summary: classical.summary,
            citations: classical.references,
            confidence: classical.confidence,
          },
        };
      })
    );
  }

  return {
    ...baseTippanni,
    planetInsights: enhancedPlanets,
    yogas: enhancedYogas,
    doshas: enhancedDoshas,
    ragEnabled: true,
    ragTimestamp: new Date().toISOString(),
  };
}

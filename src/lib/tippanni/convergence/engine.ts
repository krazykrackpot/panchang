// src/lib/tippanni/convergence/engine.ts

import { scorePattern } from './scoring';
import { ALL_PATTERNS, PATTERN_MAP } from './patterns/index';
import type {
  ConvergenceInput,
  ConvergenceResult,
  MatchedPattern,
  ExecutiveInsight,
  UrgentFlag,
  Tone,
} from './types';
import { TippanniSection, CONVERGENCE_VERSION } from './types';

// ─── Positive / Negative pattern IDs for favorability ────────────────────────

const POSITIVE_PATTERN_IDS = new Set([
  'career-peak',
  'public-recognition',
  'marriage-window',
  'partnership-blessing',
]);

const NEGATIVE_PATTERN_IDS = new Set([
  'authority-conflict',
  'relationship-storm',
  'divorce-separation',
  'professional-stagnation',
  'career-change',
]);

// ─── Favorability computation ─────────────────────────────────────────────────

function computeFavorability(patterns: MatchedPattern[]): number {
  let score = 0;
  for (const mp of patterns) {
    if (POSITIVE_PATTERN_IDS.has(mp.patternId)) {
      score += mp.isFullMatch ? 2 : 1;
    } else if (NEGATIVE_PATTERN_IDS.has(mp.patternId)) {
      score -= mp.isFullMatch ? 2 : 1;
    }
  }
  return Math.max(-5, Math.min(5, score));
}

// ─── Tone determination ───────────────────────────────────────────────────────

function determineTone(patterns: MatchedPattern[], favorability: number): Tone {
  if (patterns.length === 0) return 'quiet';
  if (favorability >= 3) return 'growth';
  if (favorability <= -3) return 'pressure';
  if (patterns.some((mp) => mp.finalScore > 6)) return 'transformation';
  return 'mixed';
}

// ─── Executive insights builder ───────────────────────────────────────────────

function buildExecutiveInsights(patterns: MatchedPattern[]): ExecutiveInsight[] {
  return patterns.slice(0, 5).map((mp) => {
    const patternDef = PATTERN_MAP.get(mp.patternId);
    const themeLabel = patternDef?.theme
      ? mp.theme.charAt(0).toUpperCase() + mp.theme.slice(1)
      : mp.theme;

    return {
      theme: mp.isFullMatch ? `${themeLabel} Convergence` : `${themeLabel} Signal`,
      themeIcon: mp.theme,
      summary: mp.text,
      laypersonNote: mp.laypersonNote,
      temporalFrame: mp.isFullMatch ? 'this-year' : 'multi-year',
      matchCount: `${mp.matchCount} of ${mp.totalConditions} signals`,
      relatedPatterns: [mp.patternId],
      expandedDetail: mp.text,
      advice: mp.advice,
    };
  });
}

// ─── Urgent flags builder ─────────────────────────────────────────────────────

function buildUrgentFlags(
  input: ConvergenceInput,
  patterns: MatchedPattern[],
): UrgentFlag[] {
  const flags: UrgentFlag[] = [];

  if (input.dashaTransitionWithin6Months) {
    flags.push({
      severity: 3,
      icon: 'transition',
      message: {
        en: 'A major dasha transition is approaching within 6 months. The planetary period governing your life is changing — expect a significant shift in themes, energy, and focus areas.',
        hi: 'एक प्रमुख दशा संक्रमण 6 महीनों में आ रहा है। आपके जीवन को संचालित करने वाला ग्रह काल बदल रहा है — विषयों, ऊर्जा और फ़ोकस क्षेत्रों में महत्वपूर्ण बदलाव की उम्मीद करें।',
      },
      expiresAt: '',
      relatedPatterns: patterns.map((mp) => mp.patternId),
    });
  }

  return flags.slice(0, 3);
}

// ─── Section markers builder ──────────────────────────────────────────────────

function buildSectionMarkers(
  patterns: MatchedPattern[],
): Partial<Record<TippanniSection, string[]>> {
  const markers: Partial<Record<TippanniSection, string[]>> = {};

  for (const mp of patterns) {
    for (const section of mp.relatedSections) {
      if (!markers[section]) {
        markers[section] = [];
      }
      markers[section]!.push(mp.patternId);
    }
  }

  return markers;
}

// ─── Main engine ──────────────────────────────────────────────────────────────

export function runConvergenceEngine(input: ConvergenceInput): ConvergenceResult {
  // Step 1: Score all patterns
  const allMatched: MatchedPattern[] = [];
  for (const pattern of ALL_PATTERNS) {
    const result = scorePattern(pattern, input);
    if (result !== null) {
      allMatched.push(result);
    }
  }

  // Step 2: Mutual exclusion — suppress lower-scoring patterns
  const suppressed = new Set<string>();

  for (const mp of allMatched) {
    if (suppressed.has(mp.patternId)) continue;
    const patternDef = PATTERN_MAP.get(mp.patternId);
    if (!patternDef?.mutuallyExclusive) continue;

    for (const excludedId of patternDef.mutuallyExclusive) {
      const excludedMatch = allMatched.find((m) => m.patternId === excludedId);
      if (!excludedMatch) continue;

      // Both matched — suppress the lower scorer
      if (mp.finalScore >= excludedMatch.finalScore) {
        suppressed.add(excludedId);
      } else {
        suppressed.add(mp.patternId);
        break; // this pattern is suppressed, no need to check further
      }
    }
  }

  const patterns = allMatched.filter((mp) => !suppressed.has(mp.patternId));

  // Step 3: Sort by finalScore descending
  patterns.sort((a, b) => b.finalScore - a.finalScore);

  // Step 4: Compute activation (1-10)
  const activation =
    patterns.length === 0
      ? 0
      : Math.min(10, Math.round(patterns.reduce((sum, mp) => sum + mp.finalScore, 0) / 2));

  // Step 5: Compute favorability (-5 to +5)
  const favorability = computeFavorability(patterns);

  // Step 6: Determine tone
  const tone = determineTone(patterns, favorability);

  // Step 7: Build executive insights from top 5 patterns
  const insights = buildExecutiveInsights(patterns);

  // Step 8: Build urgent flags
  const urgentFlags = buildUrgentFlags(input, patterns);

  // Step 9: Build section markers
  const sectionMarkers = buildSectionMarkers(patterns);

  // Step 10: Return full result
  return {
    version: CONVERGENCE_VERSION,
    computedAt: new Date().toISOString(),

    executive: {
      activation,
      favorability,
      tone,
      insights,
      urgentFlags,
      metaInsights: [],
    },

    patterns,
    sectionMarkers,

    // Transit overlay is Phase 2 — return empty structure
    transitOverlay: {
      snapshot: [],
      retroStatus: [],
      combustStatus: [],
      ashtakavargaHighlights: [],
    },
  };
}

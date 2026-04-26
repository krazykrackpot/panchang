/**
 * Kuta Insight Data — psychological framing for Ashta Kuta scores.
 *
 * Each of the 8 kutas gets two narrative insights: one for a full (or high)
 * score and one for a zero (or low) score. These are used on shareable
 * compatibility cards and in the matching page results.
 */

export interface KutaInsight {
  kutaName: string;
  scoreThreshold: 'full' | 'zero' | 'high' | 'low';
  maxScore: number;
  insight: string;
}

// ---------------------------------------------------------------------------
// Insight table — 16 entries, 2 per kuta
// kutaName matches the English name returned by the ashta-kuta engine
// ---------------------------------------------------------------------------

export const KUTA_INSIGHTS: KutaInsight[] = [
  // Nadi (8 pts)
  {
    kutaName: 'Nadi',
    scoreThreshold: 'full',
    maxScore: 8,
    insight: 'Complementary vital energies — strong natural bond',
  },
  {
    kutaName: 'Nadi',
    scoreThreshold: 'zero',
    maxScore: 8,
    insight: 'Your vital energies are identical — powerful but needs conscious balancing',
  },
  // Bhakoot (7 pts)
  {
    kutaName: 'Bhakoot',
    scoreThreshold: 'full',
    maxScore: 7,
    insight: 'Emotional wavelengths are naturally harmonized',
  },
  {
    kutaName: 'Bhakoot',
    scoreThreshold: 'zero',
    maxScore: 7,
    insight: 'Emotional wavelengths create productive tension — growth through difference',
  },
  // Gana (6 pts)
  {
    kutaName: 'Gana',
    scoreThreshold: 'full',
    maxScore: 6,
    insight: 'Temperamental match — you operate at the same speed',
  },
  {
    kutaName: 'Gana',
    scoreThreshold: 'zero',
    maxScore: 6,
    insight: 'Fire meets grace — passionate but requires mutual respect',
  },
  // Graha Maitri (5 pts)
  {
    kutaName: 'Graha Maitri',
    scoreThreshold: 'full',
    maxScore: 5,
    insight: 'Your ruling planets are natural allies — deep mutual understanding',
  },
  {
    kutaName: 'Graha Maitri',
    scoreThreshold: 'zero',
    maxScore: 5,
    insight: 'Different planetary rulers create complementary perspectives',
  },
  // Yoni (4 pts)
  {
    kutaName: 'Yoni',
    scoreThreshold: 'full',
    maxScore: 4,
    insight: 'Deep instinctive understanding — you read each other without words',
  },
  {
    kutaName: 'Yoni',
    scoreThreshold: 'zero',
    maxScore: 4,
    insight: "Instinctive patterns differ — learning each other's rhythm takes patience",
  },
  // Tara (3 pts)
  {
    kutaName: 'Tara',
    scoreThreshold: 'full',
    maxScore: 3,
    insight: 'Your lunar rhythms are naturally synchronized',
  },
  {
    kutaName: 'Tara',
    scoreThreshold: 'zero',
    maxScore: 3,
    insight: 'Lunar cycles create periodic friction — awareness smooths the pattern',
  },
  // Vashya (2 pts)
  {
    kutaName: 'Vashya',
    scoreThreshold: 'full',
    maxScore: 2,
    insight: 'Natural mutual attraction — magnetic compatibility',
  },
  {
    kutaName: 'Vashya',
    scoreThreshold: 'zero',
    maxScore: 2,
    insight: 'Attraction requires conscious cultivation rather than instant chemistry',
  },
  // Varna (1 pt)
  {
    kutaName: 'Varna',
    scoreThreshold: 'full',
    maxScore: 1,
    insight: 'Spiritual temperaments are aligned',
  },
  {
    kutaName: 'Varna',
    scoreThreshold: 'zero',
    maxScore: 1,
    insight: 'Different spiritual orientations — enriching if respected',
  },
];

// ---------------------------------------------------------------------------
// getKutaInsight — returns the appropriate insight string for a given kuta score
// ---------------------------------------------------------------------------

/**
 * Returns the insight string for a kuta given its name, scored value, and max.
 * Uses "full" insight when score === maxScore, "zero" insight when score === 0,
 * and picks the closer threshold for in-between scores.
 */
export function getKutaInsight(
  kutaName: string,
  score: number,
  maxScore: number
): string {
  // Normalise the name for lookup — trim and title-case for robustness
  const name = kutaName.trim();

  const fullEntry = KUTA_INSIGHTS.find(
    (k) => k.kutaName === name && k.scoreThreshold === 'full'
  );
  const zeroEntry = KUTA_INSIGHTS.find(
    (k) => k.kutaName === name && k.scoreThreshold === 'zero'
  );

  if (!fullEntry && !zeroEntry) {
    // Unknown kuta — return a generic insight
    return score >= maxScore / 2
      ? 'Strong alignment in this dimension'
      : 'This dimension invites conscious growth';
  }

  if (score === maxScore) return fullEntry?.insight ?? '';
  if (score === 0) return zeroEntry?.insight ?? '';

  // In-between: pick whichever threshold the score is closer to
  const midpoint = maxScore / 2;
  return score >= midpoint
    ? (fullEntry?.insight ?? zeroEntry?.insight ?? '')
    : (zeroEntry?.insight ?? fullEntry?.insight ?? '');
}

// ---------------------------------------------------------------------------
// selectHighlightKutas — picks the 3 most narratively interesting kutas
// ---------------------------------------------------------------------------

export interface HighlightKuta {
  name: string;
  score: number;
  maxScore: number;
  insight: string;
}

/**
 * Selects the top 3 most narratively interesting kutas for use in a
 * shareable compatibility card.
 *
 * Selection priority:
 * 1. Nadi — always first if it scored 0 or full (extreme = most dramatic)
 * 2. Bhakoot — always second if extreme
 * 3. Remaining kutas sorted by extremeness (distance from midpoint)
 *
 * If Nadi/Bhakoot are not extreme they are still considered in step 3.
 */
export function selectHighlightKutas(
  kutas: { name: string; score: number; maxScore: number }[]
): HighlightKuta[] {
  const withInsight = kutas.map((k) => ({
    ...k,
    insight: getKutaInsight(k.name, k.score, k.maxScore),
    // "extremeness" = normalised distance from the midpoint (0.0–1.0)
    extremeness: Math.abs(k.score - k.maxScore / 2) / (k.maxScore / 2),
  }));

  const selected: HighlightKuta[] = [];

  // Priority 1 — Nadi (highest stakes kuta)
  const nadiEntry = withInsight.find((k) => k.name === 'Nadi');
  if (nadiEntry && nadiEntry.extremeness >= 1.0) {
    // Only promote Nadi to slot 1 if it scored 0 or max
    selected.push({ name: nadiEntry.name, score: nadiEntry.score, maxScore: nadiEntry.maxScore, insight: nadiEntry.insight });
  }

  // Priority 2 — Bhakoot (emotional compatibility)
  const bhakootEntry = withInsight.find((k) => k.name === 'Bhakoot');
  if (bhakootEntry && selected.length < 2 && nadiEntry !== bhakootEntry) {
    if (bhakootEntry.extremeness >= 1.0) {
      selected.push({ name: bhakootEntry.name, score: bhakootEntry.score, maxScore: bhakootEntry.maxScore, insight: bhakootEntry.insight });
    }
  }

  // Priority 3 — remaining kutas sorted by extremeness (most extreme first)
  const remaining = withInsight
    .filter((k) => !selected.some((s) => s.name === k.name))
    .sort((a, b) => b.extremeness - a.extremeness);

  for (const k of remaining) {
    if (selected.length >= 3) break;
    selected.push({ name: k.name, score: k.score, maxScore: k.maxScore, insight: k.insight });
  }

  return selected.slice(0, 3);
}

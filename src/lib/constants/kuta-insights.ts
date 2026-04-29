/**
 * Kuta Insight Data — relationship-meaning framing for Ashta Kuta scores.
 *
 * Each of the 8 kutas gets narrative insights across score tiers:
 * full (max), high (>= 50%), low (< 50%), zero.
 *
 * Used on shareable compatibility cards and in the matching page results.
 */

// ---------------------------------------------------------------------------
// Per-kuta definition: what each kuta measures + tiered score interpretations
// ---------------------------------------------------------------------------

export interface KutaDefinition {
  kutaName: string;   // matches the English name from the ashta-kuta engine
  maxScore: number;
  domain: string;     // one-line: what this kuta governs
  full: string;       // score === max
  high: string;       // score > 0 and >= 50% of max (but not full)
  low: string;        // score > 0 and < 50% of max
  zero: string;       // score === 0
}

export const KUTA_DEFINITIONS: KutaDefinition[] = [
  {
    kutaName: 'Varna',
    maxScore: 1,
    domain: 'Spiritual compatibility',
    full: 'Spiritual temperaments are aligned — you support each other\'s inner growth and share a natural devotional wavelength.',
    high: 'Spiritual temperaments are broadly compatible — minor differences in practice are easily bridged.',
    low: 'Different spiritual orientations. With mutual respect this can be enriching rather than divisive.',
    zero: 'Different spiritual wavelengths — one partner\'s path may feel foreign to the other. Conscious respect for difference matters.',
  },
  {
    kutaName: 'Vashya',
    maxScore: 2,
    domain: 'Mutual attraction and influence',
    full: 'Natural magnetic pull exists between you — both partners feel heard and valued. Influence flows naturally and neither feels dominated.',
    high: 'Good mutual attraction — a healthy dynamic where both partners have natural sway over each other.',
    low: 'Attraction requires cultivation rather than instant chemistry. One partner may occasionally feel unheard; conscious communication bridges this.',
    zero: 'The natural polarity of mutual attraction is weak. One partner may feel they carry more weight in the relationship — awareness and deliberate connection are key.',
  },
  {
    kutaName: 'Tara',
    maxScore: 3,
    domain: 'Health and destiny compatibility',
    full: 'Lunar rhythms and life timings are naturally synchronized — your health cycles and life milestones reinforce rather than clash with each other.',
    high: 'Broadly supportive life rhythms. Occasional timing mismatches are minor and manageable.',
    low: 'Lunar cycles create periodic friction — health timings or life transitions may not align well. Awareness and flexibility help smooth these patterns.',
    zero: 'Significant mismatch in destinal rhythms — health timing and life milestones may pull in different directions. Regular grounding practices together are advisable.',
  },
  {
    kutaName: 'Yoni',
    maxScore: 4,
    domain: 'Physical and intimate compatibility',
    full: 'Deep natural physical harmony — you understand each other\'s intimate needs intuitively without needing words.',
    high: 'Good physical compatibility — a comfortable, warm intimate connection with room to deepen over time.',
    low: 'Different intimacy needs and rhythms. Learning each other\'s language of affection takes patience — patience that pays off richly.',
    zero: 'Physical and intimate temperaments are quite different. This dimension requires active attention, communication, and patience to build true intimacy.',
  },
  {
    kutaName: 'Graha Maitri',
    maxScore: 5,
    domain: 'Mental wavelength',
    full: 'Your ruling planets are natural allies — you think alike, understand each other intuitively, and rarely misread each other\'s intentions.',
    high: 'Good mental compatibility — mostly aligned world views with minor differences that spark healthy discussion rather than conflict.',
    low: 'Different mental frequencies — frequent misunderstandings are possible. Slowing down to explain your reasoning prevents small friction from growing.',
    zero: 'Your ruling planets are adversarial — different mental worlds and contrasting world views. Deliberate communication and curiosity about each other\'s perspective are essential.',
  },
  {
    kutaName: 'Gana',
    maxScore: 6,
    domain: 'Temperament match',
    full: 'Similar energy levels and temperament — you operate at the same pace, resolve conflict with similar styles, and rarely exhaust each other.',
    high: 'Broadly compatible temperaments — some energetic difference adds spice without creating sustained friction.',
    low: 'Noticeable temperament gap — one partner may be more intense or assertive while the other prefers gentleness. Mutual adjustment is needed.',
    zero: 'Opposing temperaments — one highly assertive, one deeply gentle. This creates productive tension but requires conscious respect for each other\'s nature to avoid exhaustion.',
  },
  {
    kutaName: 'Bhakoot',
    maxScore: 7,
    domain: 'Prosperity and family happiness',
    full: 'Emotional wavelengths are naturally harmonized — wealth, family growth, and shared happiness flow together for this couple.',
    high: 'Good emotional and prosperity alignment — shared goals for family and finances come naturally with minor adjustments.',
    low: 'Some financial or emotional friction is possible — divergent expectations around money, family, or long-term security. Explicit shared planning helps.',
    zero: 'The sign relationship indicates potential friction around finances and family happiness. Many such couples thrive through clear agreements and mutual generosity.',
  },
  {
    kutaName: 'Nadi',
    maxScore: 8,
    domain: 'Genetic and health compatibility',
    full: 'Complementary vital energies and strong natural bond — children born of this union are indicated to be healthy and fortunate.',
    high: 'Good health compatibility — vital energies are broadly complementary with a positive prognosis for family health.',
    low: 'Partial Nadi compatibility — minor health or energetic imbalances are possible; conscious attention to shared wellness practices is advisable.',
    zero: 'Nadi Dosha present — both partners share the same Nadi (vital energy type), the most serious concern in Ashta Kuta. Remedial consultation with a Jyotishi is strongly recommended before proceeding.',
  },
];

// ---------------------------------------------------------------------------
// Legacy KUTA_INSIGHTS array — preserved for backward compatibility with
// the shareable card system (selectHighlightKutas still references this).
// ---------------------------------------------------------------------------

export interface KutaInsight {
  kutaName: string;
  scoreThreshold: 'full' | 'zero' | 'high' | 'low';
  maxScore: number;
  insight: string;
}

export const KUTA_INSIGHTS: KutaInsight[] = KUTA_DEFINITIONS.flatMap((d) => [
  { kutaName: d.kutaName, scoreThreshold: 'full' as const, maxScore: d.maxScore, insight: d.full },
  { kutaName: d.kutaName, scoreThreshold: 'zero' as const, maxScore: d.maxScore, insight: d.zero },
]);

// ---------------------------------------------------------------------------
// getKutaInsight — returns the interpretation string for a given kuta score
// ---------------------------------------------------------------------------

/**
 * Returns the insight string for a kuta given its name, scored value, and max.
 * Uses four tiers: full (max), high (>= 50%), low (> 0, < 50%), zero.
 */
export function getKutaInsight(
  kutaName: string,
  score: number,
  maxScore: number
): string {
  const name = kutaName.trim();
  const def = KUTA_DEFINITIONS.find((d) => d.kutaName === name);

  if (!def) {
    // Unknown kuta — generic fallback
    return score >= maxScore / 2
      ? 'Strong alignment in this dimension'
      : 'This dimension invites conscious growth';
  }

  if (score === maxScore) return def.full;
  if (score === 0) return def.zero;
  if (score >= maxScore / 2) return def.high;
  return def.low;
}

/**
 * Returns the one-line domain description for a kuta (what it governs).
 * Falls back to the existing description if kuta is not in the table.
 */
export function getKutaDomain(kutaName: string): string {
  const def = KUTA_DEFINITIONS.find((d) => d.kutaName === kutaName.trim());
  return def?.domain ?? '';
}

// ---------------------------------------------------------------------------
// getOverallVerdict — relationship meaning for the total Ashta Kuta score
// ---------------------------------------------------------------------------

export interface OverallVerdict {
  tier: 'excellent' | 'good' | 'average' | 'caution';
  headline: string;
  body: string;
}

/**
 * Returns a relationship-level verdict paragraph for the total Ashta Kuta score.
 * Thresholds follow classical texts (Parashari / majority Jyotish tradition):
 *   30–36 Excellent — highly auspicious union
 *   24–29 Good      — natural compatibility, minor adjustments
 *   18–23 Average   — workable with understanding and effort
 *    0–17 Caution   — not recommended without remedial consultation
 */
export function getOverallVerdict(totalScore: number): OverallVerdict {
  if (totalScore >= 30) {
    return {
      tier: 'excellent',
      headline: 'Highly Auspicious Union',
      body: 'A score of ' + totalScore + '/36 is rare and indicates a deeply compatible match. Classical texts call this a svayambhu (self-formed) union — the relationship tends to flow naturally, with both partners supporting each other\'s growth across all eight dimensions of life.',
    };
  }
  if (totalScore >= 24) {
    return {
      tier: 'good',
      headline: 'Good Match — Natural Compatibility',
      body: 'A score of ' + totalScore + '/36 reflects strong natural compatibility. Most dimensions align well and the couple is well-positioned to build a happy, stable life together. Minor friction areas are easily navigated with awareness.',
    };
  }
  if (totalScore >= 18) {
    return {
      tier: 'average',
      headline: 'Workable Match — Requires Understanding',
      body: 'A score of ' + totalScore + '/36 is considered average in classical matching. Many successful marriages fall in this range — compatibility is workable but requires conscious effort, clear communication, and mutual respect across the weaker dimensions.',
    };
  }
  return {
    tier: 'caution',
    headline: 'Proceed with Guidance',
    body: 'A score of ' + totalScore + '/36 falls below the classical threshold of 18. This does not rule out a happy marriage, but it is strongly advisable to consult a qualified Jyotishi before proceeding. Focus on the stronger kuta dimensions and seek remedial guidance for the weak ones.',
  };
}

// ---------------------------------------------------------------------------
// selectHighlightKutas — picks the 3 most narratively interesting kutas
// (used for shareable compatibility cards)
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

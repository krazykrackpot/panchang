/**
 * Detect which saved chart a question is asking about.
 *
 * Strategy (v1, regex + token match — no LLM call):
 *   1. Extract every word ≥3 chars from the question.
 *   2. For each saved chart, tokenise the label into first + last name
 *      parts. Try to match each token against the question words.
 *   3. Score by token-match count. Highest score wins.
 *   4. Tie-break: prefer the LAST appearance in the question (most
 *      recent mention) and is_primary=false (family members usually
 *      come up when the asker wants info about them, not themselves).
 *
 * Limitations (deliberately accepted at v1):
 *   - Misspellings don't match
 *   - Generic terms like "my daughter" without a name don't match
 *   - Two charts with the same first name → the longer-label one wins
 *   - English-only tokenisation; Devanagari names with no Latin
 *     transliteration in the label won't auto-detect
 *
 * The panel UI provides a manual override (subject picker) for all
 * cases this misses.
 */

export interface SavedChartRef {
  id: string;
  label: string;
  is_primary: boolean;
}

export interface SubjectDetection {
  chartId: string | null;       // null = self (no saved chart matched)
  matchedTokens: string[];      // for debugging / telemetry
  reason: 'name_match' | 'no_match' | 'no_charts';
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'about', 'will', 'what', 'when', 'where',
  'how', 'why', 'who', 'whom', 'this', 'that', 'these', 'those', 'have',
  'has', 'had', 'does', 'did', 'doing', 'been', 'being', 'should',
  'could', 'would', 'shall', 'may', 'might', 'must', 'can', 'is', 'are',
  'was', 'were', 'be', 'am', 'i', 'me', 'my', 'mine', 'our', 'us', 'we',
  'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
  'they', 'them', 'their', 'theirs', 'it', 'its',
  'son', 'daughter', 'wife', 'husband', 'father', 'mother', 'brother',
  'sister', 'parent', 'child', 'children', 'family', 'partner', 'spouse',
  'kundali', 'chart',
]);

function tokenise(s: string): string[] {
  // Split on whitespace / punctuation; keep alphanumeric runs ≥3 chars
  // that aren't stop words. Lowercase for comparison.
  return s
    .toLowerCase()
    .split(/[^a-zA-ZÀ-ɏऀ-ॿ஀-௿ঀ-৿]+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

export function detectSubject(question: string, charts: SavedChartRef[]): SubjectDetection {
  if (!charts || charts.length === 0) {
    return { chartId: null, matchedTokens: [], reason: 'no_charts' };
  }

  const qTokens = tokenise(question);
  if (qTokens.length === 0) {
    return { chartId: null, matchedTokens: [], reason: 'no_match' };
  }
  const qSet = new Set(qTokens);

  let best: { chart: SavedChartRef; score: number; matched: string[]; lastPosition: number } | null = null;

  for (const chart of charts) {
    const labelTokens = tokenise(chart.label);
    if (labelTokens.length === 0) continue;

    const matched: string[] = [];
    for (const t of labelTokens) {
      if (qSet.has(t)) matched.push(t);
    }
    if (matched.length === 0) continue;

    // Position of the LAST matched token in the original question
    const lastPosition = Math.max(
      ...matched.map((t) => question.toLowerCase().lastIndexOf(t)),
    );

    if (
      !best ||
      matched.length > best.score ||
      (matched.length === best.score && lastPosition > best.lastPosition) ||
      // Tie-break: prefer non-primary (family member) over primary (self)
      (matched.length === best.score &&
        lastPosition === best.lastPosition &&
        !chart.is_primary &&
        best.chart.is_primary)
    ) {
      best = { chart, score: matched.length, matched, lastPosition };
    }
  }

  if (!best) {
    return { chartId: null, matchedTokens: [], reason: 'no_match' };
  }
  return {
    chartId: best.chart.id,
    matchedTokens: best.matched,
    reason: 'name_match',
  };
}

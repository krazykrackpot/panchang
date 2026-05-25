/**
 * Near-duplicate question detection for Brihaspati.
 *
 * Background — 2026-05-25 incident: a single user (Madhavi) paid 5 ×
 * $0.99 for what were essentially 3 questions, because she rewrote her
 * question slightly each time and re-submitted, believing she was
 * editing a single in-flight question. Each rewrite created a fresh
 * paid session. The fix: when a user submits a question that's very
 * similar to one they submitted recently, we pause and confirm before
 * creating another paid session.
 *
 * Algorithm: word-set Jaccard similarity over a normalised token set
 * (lowercased, punctuation-stripped, short stopwords removed) PLUS a
 * shared-proper-noun bonus. Pure Jaccard misses Madhavi's Abhishek
 * pair (0.16) because the two questions used very different vocabulary
 * to ask about the same person. Detecting that both mention
 * "Abhishek" lifts the score above threshold.
 *
 * Threshold tuning (calibrated against the Madhavi 2026-05-25 data,
 * see similarity.test.ts):
 *   ishaan_a/b   = 0.31 (jaccard alone)
 *   abhishek_a/b = 0.40 (jaccard 0.16 boosted by shared "Abhishek")
 *   career_a/c   = 0.50
 *   career_a/d   = 0.46
 *   career_c/d   = 0.78
 *   cross-topic  = 0.00 – 0.08
 * Threshold = 0.30 catches all in-topic pairs while leaving a
 * comfortable margin from cross-topic noise.
 *
 * NOT a content-moderation tool. NOT a security boundary. The point
 * is to gently re-confirm intent on suspect resubmissions, not to
 * block determined retries — server-side the user can still pay
 * again with `confirm_duplicate=true`.
 */

/**
 * Small English stopword list. Just the very common function words
 * that would otherwise dominate set intersections on short questions
 * ("how will my X go" vs "how will my Y go"). Conservative: only
 * stopwords whose removal materially helps the signal.
 *
 * Hindi / Sanskrit / other-script stopwords are NOT in this list.
 * For multilingual questions we rely on the length filter (skip
 * tokens < 3 chars) plus the threshold to keep false positives down.
 * Future: per-locale stopword lists if telemetry shows cross-locale
 * false positives are common.
 */
const STOPWORDS = new Set<string>([
  'the', 'and', 'but', 'for', 'are', 'was', 'were', 'has', 'had', 'have',
  'with', 'this', 'that', 'they', 'them', 'their', 'will', 'would', 'could',
  'should', 'you', 'your', 'his', 'her', 'him', 'she', 'they', 'how', 'why',
  'what', 'when', 'where', 'who', 'about', 'into', 'from', 'tell', 'know',
  'want', 'need', 'can', 'not', 'don', 'doesn', 'didn', 'shouldn', 'wouldn',
  'isn', 'aren', 'wasn', 'weren', 'won', 'still', 'just', 'only', 'also',
  'than', 'then', 'now', 'any', 'all', 'some', 'one', 'two', 'three',
]);

/**
 * Normalise + tokenise a free-text question into a Set of words.
 * Lowercased, Unicode-normalised, punctuation removed, short tokens
 * (<3 chars) and stopwords dropped.
 */
export function tokeniseQuestion(text: string): Set<string> {
  if (typeof text !== 'string') return new Set();
  const tokens = text
    .toLowerCase()
    .normalize('NFKC')
    // Replace anything that isn't a Unicode letter, mark, or digit with
    // whitespace. \p{M} keeps Devanagari/Bengali/Tamil VOWEL SIGNS
    // (matras) attached to their consonants — without it मेरा collapses
    // to मर, breaking non-Latin tokenisation entirely.
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3)
    .filter((w) => !STOPWORDS.has(w));
  return new Set(tokens);
}

/**
 * Extract probable proper nouns: 4+ char capitalised words, excluding
 * common sentence-starter words already in the stopword list. Used
 * only to boost similarity when both questions name the same subject.
 *
 * Heuristic; not a real NER. Misses lowercase names ("ishaan" if a
 * user typed it lowercase). The trade-off vs. shipping a NER model
 * is fine — false negatives just fall back to pure Jaccard, false
 * positives boost a pair that does share a real proper noun.
 */
export function extractProperNouns(text: string): Set<string> {
  if (typeof text !== 'string') return new Set();
  const out = new Set<string>();
  const matches = text.matchAll(/\b([A-Z][a-z]+)\b/g);
  for (const m of matches) {
    const w = m[1].toLowerCase();
    if (w.length >= 4 && !STOPWORDS.has(w)) out.add(w);
  }
  return out;
}

/**
 * Bonus applied when two questions share at least one proper noun.
 * Set to land comfortably above the default threshold so that
 * topic-rewords like "Why is Abhishek not progressing" vs "Abhishek
 * has never reached his potential" are caught even when their token
 * Jaccard is low.
 */
const PROPER_NOUN_BOOST = 0.40;

/**
 * Combined similarity: word-Jaccard with a proper-noun-overlap floor.
 * Range [0, 1].
 */
export function questionSimilarity(a: string, b: string): number {
  const sa = tokeniseQuestion(a);
  const sb = tokeniseQuestion(b);
  let jaccard = 0;
  if (sa.size > 0 || sb.size > 0) {
    let intersect = 0;
    for (const t of sa) if (sb.has(t)) intersect++;
    const union = sa.size + sb.size - intersect;
    jaccard = union === 0 ? 0 : intersect / union;
  }
  // Shared proper noun → floor the score so the pair surfaces.
  const pa = extractProperNouns(a);
  const pb = extractProperNouns(b);
  for (const n of pa) {
    if (pb.has(n)) return Math.max(jaccard, PROPER_NOUN_BOOST);
  }
  return jaccard;
}

/**
 * Default similarity threshold at or above which we treat two
 * questions as near-duplicates. Calibrated against the 2026-05-25
 * Madhavi episode — see similarity.test.ts for the actual data.
 */
export const NEAR_DUPLICATE_THRESHOLD = 0.30;

/**
 * Lookback window (minutes) for the duplicate check. 30 min covers
 * the typical user "let me rephrase and try again" arc without
 * blocking legitimate follow-ups hours or days later.
 */
export const DUPLICATE_LOOKBACK_MINUTES = 30;

export interface DuplicateCandidate {
  questionId: string;
  question: string;
  status: 'pending' | 'completed' | string;
  createdAt: string; // ISO
}

export interface DuplicateMatch {
  questionId: string;
  similarity: number;
  minutesAgo: number;
  status: 'pending' | 'completed' | string;
}

/**
 * Given a new question and a list of recent candidates from the same
 * user, return any whose similarity meets or exceeds the threshold,
 * sorted by similarity descending.
 */
export function findNearDuplicates(
  newQuestion: string,
  candidates: DuplicateCandidate[],
  now: Date = new Date(),
  threshold: number = NEAR_DUPLICATE_THRESHOLD,
): DuplicateMatch[] {
  const out: DuplicateMatch[] = [];
  for (const c of candidates) {
    const sim = questionSimilarity(newQuestion, c.question);
    if (sim < threshold) continue;
    const createdMs = Date.parse(c.createdAt);
    const minutesAgo = Number.isFinite(createdMs)
      ? Math.max(0, Math.floor((now.getTime() - createdMs) / 60000))
      : 0;
    out.push({
      questionId: c.questionId,
      similarity: Number(sim.toFixed(3)),
      minutesAgo,
      status: c.status,
    });
  }
  out.sort((a, b) => b.similarity - a.similarity);
  return out;
}

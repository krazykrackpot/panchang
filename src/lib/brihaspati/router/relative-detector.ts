/**
 * Detect whether a Brihaspati question is asking about a relative
 * (daughter, son, spouse, mother, father, sibling, etc.).
 *
 * Two responsibilities:
 *   1. Surface a stable `relative` key so callers can look up a saved
 *      chart by `saved_charts.relationship`.
 *   2. Return the classical Bhava (house) that traditionally describes
 *      that relative in the asker's OWN chart  –  used when no chart for
 *      the relative exists and the user opts for the parent-chart-proxy
 *      reading ("from your 5th house I see…").
 *
 * Pure regex + token match, no LLM call. Works server-side and
 * client-side (same helper drives the pre-payment warning).
 *
 * Multi-locale: EN + Devanagari (HI/MAI/MR/SA), Bengali, Tamil. Other
 * locales fall back to the EN tokens which is a known limitation; users
 * mixing English and a regional script in one question still get caught
 * via the EN side.
 */

export type Relative =
  | 'daughter'
  | 'son'
  | 'child' // generic child / kid — applies to either gender
  | 'spouse' // generic — covers wife/husband
  | 'mother'
  | 'father'
  | 'sibling' // brother/sister
  | 'parent'; // generic parent — when child can't tell which

export interface RelativeMention {
  relative: Relative;
  /** The exact matched word from the question (for telemetry / UI copy). */
  term: string;
  /** Classical Bhava in the asker's OWN chart that describes this
   *  relative. Used by the parent-chart-proxy fallback prompt. */
  bhava: number;
  /** Trilingual one-liner naming the Bhava (e.g. "5th house — Putra
   *  Bhava (children)"). Drives the modal copy. */
  bhavaLabel: { en: string; hi: string };
}

// Mapping: relative → which house of the asker describes them.
// Sources: BPHS Ch.10 (Bhava Vivekadhyaya). Daughter and son both
// resolve to the 5th (Putra Bhava). Spouse → 7th (Kalatra). Mother →
// 4th (Matru), Father → 9th (Pitru), Siblings → 3rd (Sahaja).
const BHAVA: Record<Relative, { bhava: number; labelEn: string; labelHi: string }> = {
  daughter: { bhava: 5, labelEn: '5th house — Putra Bhava (children)',     labelHi: 'पञ्चम भाव — पुत्र भाव (सन्तान)' },
  son:      { bhava: 5, labelEn: '5th house — Putra Bhava (children)',     labelHi: 'पञ्चम भाव — पुत्र भाव (सन्तान)' },
  child:    { bhava: 5, labelEn: '5th house — Putra Bhava (children)',     labelHi: 'पञ्चम भाव — पुत्र भाव (सन्तान)' },
  spouse:   { bhava: 7, labelEn: '7th house — Kalatra Bhava (partner)',    labelHi: 'सप्तम भाव — कलत्र भाव (जीवनसाथी)' },
  mother:   { bhava: 4, labelEn: '4th house — Matru Bhava (mother)',       labelHi: 'चतुर्थ भाव — मातृ भाव (माता)' },
  father:   { bhava: 9, labelEn: '9th house — Pitru Bhava (father)',       labelHi: 'नवम भाव — पितृ भाव (पिता)' },
  sibling:  { bhava: 3, labelEn: '3rd house — Sahaja Bhava (siblings)',    labelHi: 'तृतीय भाव — सहज भाव (भाई-बहन)' },
  parent:   { bhava: 4, labelEn: '4th house — Matru Bhava (parent proxy)', labelHi: 'चतुर्थ भाव — मातृ भाव (माता-पिता)' },
};

// Token tables. Each row: [token (lowercase), relative key]. Order
// matters only for cases where a word could match multiple relatives —
// we prefer the more specific entry (e.g. "daughter" beats "child").
const TOKENS: Array<[string, Relative]> = [
  // ─── English ───
  ['daughter',  'daughter'],
  ['daughters', 'daughter'],
  ['son',       'son'],
  ['sons',      'son'],
  ['kid',       'child'],
  ['kids',      'child'],
  ['child',     'child'],
  ['children',  'child'],
  ['wife',      'spouse'],
  ['husband',   'spouse'],
  ['spouse',    'spouse'],
  ['partner',   'spouse'],
  ['mother',    'mother'],
  ['mom',       'mother'],
  ['mum',       'mother'],
  ['father',    'father'],
  ['dad',       'father'],
  ['papa',      'father'],
  ['brother',   'sibling'],
  ['brothers',  'sibling'],
  ['sister',    'sibling'],
  ['sisters',   'sibling'],
  ['sibling',   'sibling'],
  ['siblings',  'sibling'],
  ['parent',    'parent'],
  ['parents',   'parent'],

  // ─── Hindi / Devanagari (also covers MAI / MR / SA spellings) ───
  ['बेटी',     'daughter'],
  ['पुत्री',   'daughter'],
  ['लड़की',    'daughter'],
  ['बेटा',     'son'],
  ['पुत्र',    'son'],
  ['लड़का',    'son'],
  ['बच्चा',    'child'],
  ['बच्ची',    'child'],
  ['बच्चे',    'child'],
  ['सन्तान',   'child'],
  ['संतान',    'child'],
  ['पत्नी',    'spouse'],
  ['पति',      'spouse'],
  ['जीवनसाथी', 'spouse'],
  ['माँ',      'mother'],
  ['माता',     'mother'],
  ['मम्मी',    'mother'],
  ['पिता',     'father'],
  ['पापा',     'father'],
  ['पिताजी',   'father'],
  ['भाई',      'sibling'],
  ['बहन',      'sibling'],

  // ─── Bengali ───
  ['মেয়ে',    'daughter'],
  ['ছেলে',     'son'],
  ['বাচ্চা',    'child'],
  ['সন্তান',    'child'],
  ['স্ত্রী',     'spouse'],
  ['স্বামী',    'spouse'],
  ['মা',        'mother'],
  ['বাবা',      'father'],
  ['ভাই',       'sibling'],
  ['বোন',       'sibling'],

  // ─── Tamil ───
  ['மகள்',     'daughter'],
  ['மகன்',     'son'],
  ['குழந்தை',  'child'],
  ['மனைவி',    'spouse'],
  ['கணவன்',    'spouse'],
  ['அம்மா',    'mother'],
  ['அப்பா',    'father'],
  ['சகோதரன்',  'sibling'],
  ['சகோதரி',   'sibling'],
];

/**
 * Scan the question for any relative mention. Returns the FIRST match
 * (we don't compose plural relatives — if you ask about "wife and
 * daughter", we surface the first one and the second can be a follow-up).
 *
 * Pronoun-only references ("she", "he", "they") are NOT considered
 * relative mentions on their own — they're too ambiguous. The user has
 * to name the relationship somewhere in the question for this to fire.
 */
export function detectRelativeMention(question: string): RelativeMention | null {
  if (!question) return null;

  // Lower-case for EN comparison; Devanagari/Bengali/Tamil are
  // case-insensitive so the lower() is a no-op for those scripts.
  const lower = question.toLowerCase();

  for (const [token, relative] of TOKENS) {
    // Word-boundary match for EN (avoids "sonata" matching "son").
    // For non-Latin scripts there's no \b concept, so we use a simple
    // contains-check — false positives there are rare because the
    // tokens are full words and the surrounding chars are typically
    // Devanagari/Bengali/Tamil punctuation or whitespace.
    const isLatin = /^[a-z]+$/.test(token);
    const found = isLatin
      ? new RegExp(`\\b${token}\\b`, 'i').test(lower)
      : lower.includes(token);

    if (found) {
      const meta = BHAVA[relative];
      return {
        relative,
        term: token,
        bhava: meta.bhava,
        bhavaLabel: { en: meta.labelEn, hi: meta.labelHi },
      };
    }
  }

  return null;
}

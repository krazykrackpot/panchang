/**
 * Layer-2 Question Classifier.
 *
 * Deterministic, keyword-based mapping from a user's free-text question to
 * one of the 12 Brihaspati categories. NEVER an LLM — Layer 2 of the
 * validation wall requires that the LLM cannot pick which rules apply.
 *
 * Algorithm
 * ─────────
 * 1. Normalise the question (lowercase, strip diacritics where safe).
 * 2. For each category, count whole-word matches against the keyword
 *    list. Phrase keywords (containing spaces) are tested with
 *    substring inclusion.
 * 3. Pick the highest-scoring category. Tie-break by the order in
 *    BRIHASPATI_CATEGORIES (more specific categories first).
 * 4. If no category scores above the floor, return 'general'.
 *
 * Keyword lists are intentionally English-heavy at launch. Hindi/Tamil/
 * Bengali keywords cover the common Sanskrit/Devanagari terms users
 * actually type (शादी, विवाह, करियर etc). Production usage will reveal
 * which phrases need adding.
 */

import {
  BRIHASPATI_CATEGORIES,
  type BrihaspatiCategory,
  type BrihaspatiClassification,
} from './types';

type KeywordList = readonly string[];

/**
 * Curated keyword lists. Design rules:
 *
 *  - Words must be category-DEFINING — they should rarely appear in another
 *    category's questions. Generic question stems like "when will" do NOT
 *    belong in `timing` because they appear in every category.
 *  - Stems are included as separate entries ("wealth" AND "wealthy",
 *    "chronic" AND "chronically") because we whole-word match.
 *  - Phrases (containing a space) are tried with substring inclusion.
 */
const KEYWORDS: Record<BrihaspatiCategory, KeywordList> = {
  marriage: [
    // English
    'marriage', 'marry', 'married', 'wedding', 'spouse', 'husband', 'wife',
    'soulmate', 'relationship', 'mangal dosha', 'manglik',
    'kundali matching', '7th house',
    // Hindi (transliterated + devanagari)
    'shaadi', 'vivah', 'pati', 'patni', 'jeevansaathi',
    'शादी', 'विवाह', 'पति', 'पत्नी', 'जीवनसाथी', 'मंगल दोष',
    // Tamil
    'திருமணம்', 'மணம்', 'கணவன்', 'மனைவி',
    // Bengali
    'বিবাহ', 'বিয়ে', 'স্বামী', 'স্ত্রী',
  ],
  career: [
    'career', 'job', 'work', 'profession', 'business', 'promotion',
    'salary', 'employment', 'startup', 'company', 'office', 'boss',
    'colleague', '10th house', 'midheaven', 'saturn job',
    'naukri', 'kaam', 'vyavasaay', 'rozgar',
    'नौकरी', 'काम', 'व्यवसाय', 'करियर', 'रोज़गार',
    'வேலை', 'தொழில்',
    'চাকরি', 'কাজ', 'ব্যবসা',
  ],
  health: [
    'health', 'healthy', 'illness', 'disease', 'sick', 'sickness', 'medical',
    'doctor', 'surgery', 'recovery', 'wellness', 'body', 'chronic',
    'chronically', '6th house', '8th house',
    'svaasthya', 'beemaari', 'rog', 'sehat',
    'स्वास्थ्य', 'बीमारी', 'रोग', 'सेहत',
    'உடல்நலம்', 'நோய்',
    'স্বাস্থ্য', 'অসুস্থ', 'রোগ',
  ],
  finance: [
    'money', 'wealth', 'wealthy', 'finance', 'financial', 'invest', 'investment',
    'investing', 'property', 'income', 'savings', 'debt', 'loan', 'rich', 'poor',
    '2nd house', '11th house', 'jupiter wealth',
    'paisa', 'dhan', 'paise', 'sampatti',
    'पैसा', 'धन', 'संपत्ति', 'निवेश',
    'பணம்', 'செல்வம்',
    'টাকা', 'অর্থ', 'সম্পত্তি',
  ],
  children: [
    'children', 'child', 'baby', 'pregnancy', 'pregnant', 'conceive',
    'son', 'daughter', 'putra', 'putrakaraka', '5th house',
    'bachcha', 'santaan',
    'बच्चा', 'संतान', 'पुत्र', 'पुत्री',
    'குழந்தை',
    'সন্তান', 'শিশু',
  ],
  education: [
    'education', 'exam', 'exams', 'study', 'studies', 'university', 'college',
    'school', 'degree', 'student', 'learning', 'mercury education',
    'padhaai', 'shiksha', 'vidya',
    'पढ़ाई', 'शिक्षा', 'विद्या', 'परीक्षा',
    'படிப்பு', 'கல்வி',
    'পড়াশোনা', 'শিক্ষা',
  ],
  dasha: [
    'dasha', 'mahadasha', 'antardasha', 'vimshottari',
    'current period', 'next period', 'sade sati end',
    'दशा', 'महादशा', 'अंतर्दशा',
    'தசை',
    'দশা',
  ],
  remedies: [
    'remedy', 'remedies', 'mantra', 'gemstone', 'ratna', 'donation',
    'fasting', 'puja', 'pooja', 'upay', 'upaya', 'yantra',
    'what should i do', 'how to improve',
    'उपाय', 'मंत्र', 'रत्न', 'पूजा', 'दान',
    'பரிகாரம்', 'மந்திரம்',
    'প্রতিকার', 'মন্ত্র', 'রত্ন',
  ],
  compatibility: [
    'compatible', 'compatibility', 'gun milan', 'guna milan',
    'ashta kuta', 'partner chart', 'compatibility with',
    'partner and i', 'we compatible',
    'मेल', 'गुण मिलान',
    'பொருத்தம்',
    'মিল',
  ],
  timing: [
    // Genuine timing/muhurta vocabulary only. Generic question stems like
    // "when will" or "should i today" were removed because they appear in
    // every category and were hijacking marriage/finance/children routing.
    'muhurta', 'muhurat', 'auspicious', 'inauspicious',
    'good time', 'best time', 'right time',
    'is today', 'is tomorrow',
    'मुहूर्त', 'शुभ समय', 'अशुभ समय',
    'முகூர்த்தம்',
    'মুহূর্ত',
  ],
  transit: [
    'transit', 'transits', 'gochar', 'saturn transit', 'jupiter transit',
    'sade sati', 'sade-sati', 'shani transit', 'rahu transit',
    'double transit', 'mars transit',
    'गोचर', 'साढ़े साती', 'शनि गोचर',
    'கோசரம்', 'சாடே சாதி',
    'গোচর', 'সাড়ে সাতি',
  ],
  // 'general' is the fallback; "my chart" / "kundali" without any other
  // category signal lands here.
  general: [
    'my chart', 'birth chart', 'kundali', 'horoscope',
    'tell me about myself', 'my personality', 'life path',
    'मेरी कुंडली', 'मेरी जन्मपत्री', 'व्यक्तित्व',
    'என் ஜாதகம்',
    'আমার কুণ্ডলী',
  ],
};

const SCORE_FLOOR = 1;

/** Diacritic-strip for Latin scripts; leaves Devanagari/Tamil/Bengali untouched. */
function normalise(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '');
}

function scoreCategory(text: string, keywords: KeywordList): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];
  for (const kw of keywords) {
    const k = normalise(kw);
    if (k.includes(' ')) {
      // multi-word phrase — substring match
      if (text.includes(k)) {
        score += 1;
        matched.push(kw);
      }
    } else {
      // whole-word match (must respect non-Latin scripts which lack word boundaries)
      const pattern = /[ऀ-ॿ஀-௿ঀ-৿]/.test(k)
        ? new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        : new RegExp(`(^|\\W)${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`);
      if (pattern.test(text)) {
        score += 1;
        matched.push(kw);
      }
    }
  }
  return { score, matched };
}

/**
 * Classify a question into one of the 12 Brihaspati categories.
 *
 * `locale` is accepted for future use (e.g. boosting matches in the user's
 * own locale) but is not yet a scoring factor — keyword lists are
 * multi-locale and all are scored.
 */
export function classify(question: string, _locale?: string): BrihaspatiClassification {
  const text = normalise(question);

  let best: BrihaspatiCategory = 'general';
  let bestScore = 0;
  let bestMatched: string[] = [];

  // BRIHASPATI_CATEGORIES order acts as the tie-break: earlier (more specific)
  // categories beat later ones at equal scores. 'general' is last by design.
  for (const cat of BRIHASPATI_CATEGORIES) {
    const { score, matched } = scoreCategory(text, KEYWORDS[cat]);
    if (score > bestScore) {
      best = cat;
      bestScore = score;
      bestMatched = matched;
    }
  }

  if (bestScore < SCORE_FLOOR) {
    return { category: 'general', confidence: 0, matchedKeywords: [] };
  }

  // Confidence is a soft normalisation: more matches => higher confidence,
  // capped at 1. The classifier consumer can use this to decide e.g.
  // whether to also fan out to a secondary engine.
  const confidence = Math.min(bestScore / 5, 1);

  return { category: best, confidence, matchedKeywords: bestMatched };
}

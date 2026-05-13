/**
 * Query Classifier — Bilingual (EN + HI + Hinglish)
 *
 * Classifies user queries by category, complexity, and routing tier.
 * All keyword-based — zero LLM calls, zero cost, deterministic.
 *
 * The primary user base queries in Hindi/Hinglish, so Hindi keyword
 * coverage is at least equal to English.
 */

import type { PanditQuery, ClassifiedQuery, QueryCategory, QueryComplexity } from '../types';
import { normaliseToCategory, buildCacheKey } from './normaliser';

// ─────────────────────────────────────────────────────────────────────────────
// Category keywords — bilingual
// ─────────────────────────────────────────────────────────────────────────────

/** All keywords are lowercase (English) or Devanagari (case-irrelevant). */
const CATEGORY_KEYWORDS: Record<Exclude<QueryCategory, 'general'>, string[]> = {
  career: [
    'career', 'job', 'work', 'profession', 'business', 'employment',
    'promotion', 'salary', 'company', 'office', 'interview', 'resign',
    'करियर', 'नौकरी', 'काम', 'व्यापार', 'रोज़गार', 'पेशा',
    'तरक्की', 'वेतन', 'कंपनी', 'दफ्तर', 'इंटरव्यू',
    'job change', 'career kaisa',
  ],
  relationship: [
    'marriage', 'married', 'partner', 'love', 'spouse', 'wife', 'husband',
    'relationship', 'compatibility', 'divorce', 'engagement',
    'विवाह', 'शादी', 'पत्नी', 'पति', 'रिश्ता', 'प्रेम',
    'साथी', 'तलाक', 'सगाई', 'वैवाहिक',
    'shaadi', 'rishta',
  ],
  health: [
    'health', 'illness', 'disease', 'body', 'medical', 'surgery',
    'hospital', 'pain', 'recovery', 'longevity', 'fitness',
    'स्वास्थ्य', 'बीमारी', 'शरीर', 'रोग', 'आरोग्य',
    'चिकित्सा', 'दवा', 'अस्पताल', 'दर्द', 'आयु',
    'health kaisa', 'tabiyat',
  ],
  wealth: [
    'money', 'wealth', 'finance', 'income', 'investment', 'property',
    'loan', 'debt', 'profit', 'loss', 'savings', 'tax',
    'धन', 'पैसा', 'आय', 'लक्ष्मी', 'संपत्ति', 'निवेश',
    'ऋण', 'कर्ज़', 'हानि', 'बचत', 'आर्थिक',
    'paisa', 'kamai',
  ],
  children: [
    'child', 'son', 'daughter', 'fertility', 'baby', 'pregnancy',
    'birth', 'offspring', 'progeny',
    'संतान', 'बच्चा', 'पुत्र', 'पुत्री', 'गर्भ',
    'बेटा', 'बेटी', 'औलाद', 'प्रजनन',
    'baccha', 'santaan',
  ],
  education: [
    'education', 'study', 'exam', 'learning', 'school', 'college',
    'university', 'degree', 'result', 'admission',
    'शिक्षा', 'पढ़ाई', 'परीक्षा', 'विद्या', 'स्कूल',
    'कॉलेज', 'विश्वविद्यालय', 'नतीजा', 'दाखिला',
    'padhai', 'exam kaisa',
  ],
  spiritual: [
    'spiritual', 'moksha', 'meditation', 'sadhana', 'karma', 'dharma',
    'temple', 'mantra', 'guru', 'enlightenment',
    'आध्यात्मिक', 'मोक्ष', 'ध्यान', 'साधना', 'कर्म', 'धर्म',
    'मंदिर', 'मंत्र', 'गुरु', 'पूजा', 'भक्ति',
    'pooja', 'bhagwan',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Complexity patterns — bilingual
// ─────────────────────────────────────────────────────────────────────────────

const FACTUAL_PATTERNS = [
  /what (dasha|mahadasha|antardasha)/i,
  /which (nakshatra|rashi|sign)/i,
  /कौन सी (दशा|राशि|नक्षत्र)/,
  /मेरी (दशा|राशि) क्या/,
  /when (does|will|is).*(start|end|begin|finish)/i,
  /कब (शुरू|खत्म|समाप्त)/,
  /what is my (moon sign|ascendant|lagna)/i,
  /मेरी (चन्द्र राशि|लग्न) क्या/,
];

const REMEDIAL_PATTERNS = [
  /what (should|can|do) i do/i,
  /how (to|can i) (fix|improve|overcome|reduce)/i,
  /remedy|remedies|upay|solution/i,
  /उपाय|क्या करें|क्या करूँ|कैसे सुधारें/,
  /gemstone|mantra|charity|donation|fasting/i,
  /रत्न|मंत्र|दान|व्रत|उपवास/,
];

const PREDICTIVE_PATTERNS = [
  /next (year|month|quarter|period)/i,
  /202[6-9]|203\d/,
  /अगले (साल|महीने|वर्ष)/,
  /when will.*(happen|come|improve|change)/i,
  /कब (होगा|आएगा|बदलेगा|सुधरेगा)/,
  /future|outlook|forecast|prediction/i,
  /भविष्य|भविष्यवाणी/,
];

const COMPARATIVE_PATTERNS = [
  /which.*(better|worse|best)/i,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b.*(or|vs|versus)/i,
  /कौन सा.*(बेहतर|अच्छा)/,
  /compare|comparison/i,
  /तुलना/,
];

// ─────────────────────────────────────────────────────────────────────────────
// Classification functions
// ─────────────────────────────────────────────────────────────────────────────

export function classifyCategory(text: string): QueryCategory {
  const lower = text.toLowerCase();
  let bestCategory: QueryCategory = 'general';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword) || text.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as QueryCategory;
    }
  }

  return bestCategory;
}

export function classifyComplexity(text: string): QueryComplexity {
  const lower = text.toLowerCase();
  // Test in priority order: factual is cheapest, comparative is most expensive
  if (FACTUAL_PATTERNS.some(p => p.test(lower) || p.test(text))) return 'factual';
  if (COMPARATIVE_PATTERNS.some(p => p.test(lower) || p.test(text))) return 'comparative';
  if (REMEDIAL_PATTERNS.some(p => p.test(lower) || p.test(text))) return 'remedial';
  if (PREDICTIVE_PATTERNS.some(p => p.test(lower) || p.test(text))) return 'predictive';
  return 'interpretive';
}

export function assignTier(complexity: QueryComplexity): 0 | 1 | 2 {
  if (complexity === 'factual') return 0;
  if (complexity === 'comparative') return 2;
  if (complexity === 'predictive') return 2;
  return 1; // interpretive, remedial
}

// ─────────────────────────────────────────────────────────────────────────────
// Main classifier
// ─────────────────────────────────────────────────────────────────────────────

export function classifyQuery(
  query: PanditQuery,
  birthFingerprint: string,
): ClassifiedQuery {
  const category = query.category ?? classifyCategory(query.text);
  const complexity = classifyComplexity(query.text);
  const tier = assignTier(complexity);
  const normalisedCategory = normaliseToCategory(query.text) ?? category;
  const cacheKey = buildCacheKey(birthFingerprint, normalisedCategory, query.locale);

  return {
    originalText: query.text,
    locale: query.locale,
    category,
    complexity,
    tier,
    cacheKey,
  };
}

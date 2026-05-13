/**
 * Query Normaliser — Synonym Dedup for Cache Keys
 *
 * Maps synonymous queries to the same category string so that
 * "career kaisa rahega?" and "how is my job?" hit the same cache entry.
 */

import { createHash } from 'crypto';
import type { QueryCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Synonym map — bilingual
// ─────────────────────────────────────────────────────────────────────────────

const SYNONYM_MAP: [string[], QueryCategory][] = [
  [['career', 'job', 'work', 'profession', 'business', 'employment', 'promotion',
    'करियर', 'नौकरी', 'काम', 'व्यापार', 'रोज़गार', 'पेशा', 'तरक्की'], 'career'],
  [['marriage', 'relationship', 'partner', 'love', 'spouse', 'wife', 'husband', 'compatibility',
    'विवाह', 'शादी', 'पत्नी', 'पति', 'रिश्ता', 'प्रेम', 'shaadi', 'rishta'], 'relationship'],
  [['health', 'illness', 'disease', 'body', 'medical', 'surgery',
    'स्वास्थ्य', 'बीमारी', 'शरीर', 'रोग', 'आरोग्य', 'tabiyat'], 'health'],
  [['money', 'wealth', 'finance', 'income', 'investment', 'property',
    'धन', 'पैसा', 'आय', 'संपत्ति', 'निवेश', 'paisa', 'kamai'], 'wealth'],
  [['child', 'son', 'daughter', 'fertility', 'baby', 'pregnancy',
    'संतान', 'बच्चा', 'पुत्र', 'पुत्री', 'गर्भ', 'baccha', 'santaan'], 'children'],
  [['education', 'study', 'exam', 'learning', 'school', 'college',
    'शिक्षा', 'पढ़ाई', 'परीक्षा', 'विद्या', 'padhai'], 'education'],
  [['spiritual', 'moksha', 'meditation', 'sadhana', 'dharma',
    'आध्यात्मिक', 'मोक्ष', 'ध्यान', 'साधना', 'पूजा', 'pooja'], 'spiritual'],
];

/**
 * Attempts to normalise a query string to a known category.
 * Returns null if no category matches (falls back to classifier result).
 */
export function normaliseToCategory(text: string): QueryCategory | null {
  const lower = text.toLowerCase();
  for (const [synonyms, category] of SYNONYM_MAP) {
    for (const syn of synonyms) {
      if (lower.includes(syn) || text.includes(syn)) {
        return category;
      }
    }
  }
  return null;
}

/**
 * Build a deterministic cache key from birth fingerprint + category + locale.
 */
export function buildCacheKey(
  birthFingerprint: string,
  category: string,
  locale: string,
): string {
  return createHash('sha256')
    .update(`${birthFingerprint}:${category}:${locale}`)
    .digest('hex')
    .slice(0, 16); // 16 hex chars = 64 bits — sufficient for cache dedup
}

/**
 * Build a birth fingerprint from birth data.
 * Deterministic: same birth data always produces the same fingerprint.
 */
export function buildBirthFingerprint(
  date: string,
  time: string,
  lat: number,
  lng: number,
): string {
  return createHash('sha256')
    .update(`${date}:${time}:${lat.toFixed(4)}:${lng.toFixed(4)}`)
    .digest('hex')
    .slice(0, 16);
}

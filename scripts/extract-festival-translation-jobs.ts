/* eslint-disable no-console */
/**
 * Extract translation jobs from FESTIVAL_DETAILS + CATEGORY_DETAILS.
 *
 * For each (slug, field, locale) where the locale value is missing /
 * empty, emit a job with the EN source text.
 *
 * Output (stdout, JSON):
 *   {
 *     total: <count>,
 *     by_locale: { ta: 370, ..., sa: 89 },
 *     jobs: {
 *       ta: [{ slug, field, en }, ...],
 *       te: [...],
 *       ...
 *     }
 *   }
 *
 * Consumed by scripts/translate-festival-details-via-gemini.py.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { FESTIVAL_DETAILS, CATEGORY_DETAILS } from '@/lib/constants/festival-details';

const ALL: Record<string, Record<string, unknown>> = {
  ...FESTIVAL_DETAILS,
  ...CATEGORY_DETAILS,
} as unknown as Record<string, Record<string, unknown>>;

const FIELDS = ['name', 'mythology', 'observance', 'significance', 'deity', 'fastNote', 'observationRule'];
const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr', 'sa'];

interface Job {
  slug: string;
  field: string;
  en: string;
}

// Load any pre-existing overlay JSONs so already-translated (slug, field)
// pairs are skipped — keeps re-runs cheap (only NET-new gaps get sent to
// Gemini). Overlay keys are `${slug}.${field}` per the convention in
// translate-festival-details-via-gemini.py and festival-details-with-overlay.ts.
const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `festival-details-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    // Malformed overlay: treat as empty, all jobs re-extracted.
    console.error(`[extract] failed to parse ${path} — treating as empty`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const [slug, entry] of Object.entries(ALL)) {
  for (const field of FIELDS) {
    const fieldVal = entry[field];
    if (!fieldVal || typeof fieldVal !== 'object') continue;
    const ft = fieldVal as Record<string, unknown>;
    const enSrc = ft['en'];
    if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
    for (const locale of LOCALES) {
      const v = ft[locale];
      if (typeof v === 'string' && v.trim()) continue;
      if (overlays[locale].has(`${slug}.${field}`)) continue;
      jobs[locale].push({ slug, field, en: enSrc });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));

console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

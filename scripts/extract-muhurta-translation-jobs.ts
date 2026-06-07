/* eslint-disable no-console */
/**
 * Extract translation jobs from MUHURTA_TYPES (muhurta-types.ts).
 *
 * Translatable fields are LocaleText shapes inside each type entry:
 *   name, subtitle, description.
 *
 * Nested fields like `guidance`, `faqs`, and `dates2026` are NOT
 * currently extracted — they hold structured content (FAQ pairs,
 * date lists) whose translation needs richer prompt context than this
 * pipeline emits. Add them here only after building a translator that
 * preserves their schema. Gemini PR #511 round-2.
 *
 * Output (stdout): { total, by_locale, jobs: { <locale>: [{ slug, field, en }] } }
 *
 * Consumed by scripts/translate-muhurta-via-gemini.py.
 */
import { MUHURTA_TYPES } from '@/lib/constants/muhurta-types';

// `sa` deliberately omitted — translate-muhurta-via-gemini.py and the
// muhurta-types-with-overlay.ts merger don't carry Sanskrit, so any
// `sa` jobs would be extracted but never written. Gemini PR #511.
const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const SIMPLE_TEXT_FIELDS = ['name', 'subtitle', 'description'];

interface Job {
  slug: string;
  field: string;
  en: string;
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const t of MUHURTA_TYPES as Array<Record<string, unknown>>) {
  const slug = String(t.slug);
  if (!slug) continue;

  for (const field of SIMPLE_TEXT_FIELDS) {
    const v = t[field];
    if (!v || typeof v !== 'object') continue;
    const ft = v as Record<string, unknown>;
    const enSrc = ft['en'];
    if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
    for (const locale of LOCALES) {
      const lv = ft[locale];
      if (typeof lv === 'string' && lv.trim()) continue;
      jobs[locale].push({ slug, field, en: enSrc });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));

console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

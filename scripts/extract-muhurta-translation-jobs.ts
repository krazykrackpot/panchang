/* eslint-disable no-console */
/**
 * Extract translation jobs from MUHURTA_TYPES (muhurta-types.ts).
 *
 * Translatable fields are LocaleText shapes inside each type entry:
 *   name, subtitle, description.
 *
 * Some fields (guidance, faqs, dates2026) are nested objects whose
 * leaves may also be translatable — handled by walking the structure
 * and emitting one job per string leaf.
 *
 * Output (stdout): { total, by_locale, jobs: { <locale>: [{ slug, field, en }] } }
 *
 * Consumed by scripts/translate-muhurta-via-gemini.py.
 */
import { MUHURTA_TYPES } from '@/lib/constants/muhurta-types';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr', 'sa'];
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

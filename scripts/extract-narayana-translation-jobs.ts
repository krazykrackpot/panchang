/* eslint-disable no-console */
/**
 * Extract translation jobs from NARAYANA_INTERPRETATIONS — 12 signs ×
 * 3 LocaleText fields (themes, focus, caution) authored en+hi only.
 *
 * Keys: `"<signId>.{themes|focus|caution}"`.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NARAYANA_INTERPRETATIONS } from '@/lib/constants/narayana-interpretations';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const FIELDS = ['themes', 'focus', 'caution'] as const;

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `narayana-interpretations-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-narayana] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const interp of NARAYANA_INTERPRETATIONS) {
  for (const field of FIELDS) {
    const ft = interp[field] as Record<string, string>;
    const en = ft.en;
    if (!en || !en.trim()) continue;
    for (const locale of LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const key = `${interp.signId}.${field}`;
      if (overlays[locale].has(key)) continue;
      jobs[locale].push({ key, en });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

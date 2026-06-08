/* eslint-disable no-console */
/**
 * Extract translation jobs from PLANET_HOUSE_VERSES (84 entries —
 * 7 classical planets × 12 houses) for the 7 visible regional locales.
 *
 * Each entry has two LocaleText fields with en + hi already authored:
 *   - verse:          classical-verse paraphrase from BPHS / Phaladeepika
 *   - interpretation: modern practical reading
 *
 * Output: { total, by_locale, jobs }, keyed by `${planetId}-${house}.{verse|interpretation}`.
 *
 * Idempotent — overlay-aware skip avoids re-sending already-translated
 * pairs to Gemini.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PLANET_HOUSE_VERSES } from '@/lib/constants/planet-in-house-verses';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

interface Job {
  key: string;
  field: 'verse' | 'interpretation';
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `planet-in-house-verses-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-piHv] malformed ${path} — treating as empty`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const entry of PLANET_HOUSE_VERSES) {
  const key = `${entry.planetId}-${entry.house}`;
  for (const field of ['verse', 'interpretation'] as const) {
    const ft = entry[field] as Record<string, string>;
    const enSrc = ft.en;
    if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
    for (const locale of LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      if (overlays[locale].has(`${key}.${field}`)) continue;
      jobs[locale].push({ key, field, en: enSrc });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

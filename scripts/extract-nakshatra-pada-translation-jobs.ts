/* eslint-disable no-console */
/**
 * Extract translation jobs from NAKSHATRA_PADA_PROFILES — 108 padas
 * (27 nakshatras × 4) × 4 LocaleText fields (personality, career,
 * relationships, health). Source corpus is en+hi only.
 *
 * Output: { total, by_locale, jobs }, keyed by
 *   `${nakshatraId}-${pada}.{personality|career|relationships|health}`
 *
 * Overlay-aware skip — re-runs only emit gaps.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NAKSHATRA_PADA_PROFILES } from '@/lib/constants/nakshatra-pada-profiles';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const FIELDS = ['personality', 'career', 'relationships', 'health'] as const;

interface Job {
  key: string;
  field: typeof FIELDS[number];
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `nakshatra-pada-profiles-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-npp] malformed ${path} — treating as empty`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const profile of NAKSHATRA_PADA_PROFILES) {
  const key = `${profile.nakshatraId}-${profile.pada}`;
  for (const field of FIELDS) {
    const ft = profile[field] as Record<string, string>;
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

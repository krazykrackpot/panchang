/* eslint-disable no-console */
/**
 * Extract translation jobs from CONTEXT_MAP in city-festival-context.ts —
 * 150 entries (10 festivals × 15 cities) of city-specific celebration
 * paragraph (en + hi). 7 visible regional locales.
 *
 * Keys: composite festival:city slug, e.g. `"diwali:delhi"`.
 *
 * The constant isn't exported individually — we walk via the public
 * `getCityFestivalContext` over the known (festival × city) grid.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getCityFestivalContext } from '@/lib/constants/city-festival-context';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

// Festival + city slugs that the corpus covers (read from the comment
// in city-festival-context.ts — 10 festivals × 15 cities = 150).
const FESTIVALS = [
  'akshaya-tritiya', 'chhath-puja', 'diwali', 'dussehra',
  'ganesh-chaturthi', 'holi', 'janmashtami', 'maha-shivaratri',
  'raksha-bandhan', 'ram-navami',
];
const CITIES = [
  'ahmedabad', 'bangalore', 'bhopal', 'chandigarh', 'chennai',
  'delhi', 'hyderabad', 'jaipur', 'kolkata', 'lucknow', 'mumbai',
  'new-york', 'patna', 'pune', 'varanasi',
];

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `city-festival-context-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-cfc] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const festival of FESTIVALS) {
  for (const city of CITIES) {
    const ctx = getCityFestivalContext(festival, city);
    if (!ctx) continue;
    const enSrc = (ctx as Record<string, string>).en;
    if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
    const key = `${festival}:${city}`;
    for (const locale of LOCALES) {
      const v = (ctx as Record<string, string>)[locale];
      if (typeof v === 'string' && v.trim()) continue;
      if (overlays[locale].has(key)) continue;
      jobs[locale].push({ key, en: enSrc });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

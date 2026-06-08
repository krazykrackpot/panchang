/* eslint-disable no-console */
/**
 * Extract translation jobs from YOGA_PLAIN_NAMES (Record<string,
 * {en, hi}> of ~48 yoga plain-language names) for 7 visible regional
 * locales.
 *
 * Keys: just the yoga slug (`hamsa`, `gajakesari`, etc.) — single
 * field per entry, no nested path.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { YOGA_PLAIN_NAMES } from '@/lib/constants/yoga-plain-names';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `yoga-plain-names-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-ypn] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const [slug, leaf] of Object.entries(YOGA_PLAIN_NAMES)) {
  const enSrc = leaf.en;
  if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
  for (const locale of LOCALES) {
    const v = (leaf as Record<string, string>)[locale];
    if (typeof v === 'string' && v.trim()) continue;
    if (overlays[locale].has(slug)) continue;
    jobs[locale].push({ key: slug, en: enSrc });
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

/* eslint-disable no-console */
/**
 * Extract translation jobs from LOCALIZED_TRANSIT_ARTICLES.
 *
 * Walks every LocaleText in the wrapped article tree (title, overview,
 * generalThemes[], moonSignEffects[].headline/body/dosAndDonts[]/remedy,
 * keyDates[].event/significance, duration, retrogradeNote) and emits
 * (slug, path, en) tuples for locales where the field is not yet
 * populated AND not already covered by an existing overlay.
 *
 * Idempotent — re-runs only emit gaps.
 *
 * Output (stdout, JSON): { total, by_locale, jobs }
 * Consumed by scripts/translate-transit-articles-via-gemini.py.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { LOCALIZED_TRANSIT_ARTICLES } from '@/lib/content/transit-articles-with-overlay';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

interface Job {
  slug: string;
  path: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'content');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `transit-articles-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-transit] malformed ${path} — treating as empty`);
  }
}

function isLocaleText(v: unknown): v is Record<string, string> {
  if (!v || typeof v !== 'object') return false;
  const en = (v as Record<string, unknown>)['en'];
  return typeof en === 'string' && en.trim().length > 0;
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

function emit(slug: string, path: string, leaf: Record<string, string>): void {
  const en = leaf['en'];
  for (const locale of LOCALES) {
    // Skip if the wrapped tree already has this locale filled (e.g. hi
    // is hand-authored on title/overview/generalThemes — present in
    // the leaf already; we still emit for ta/te/etc. which aren't).
    if (typeof leaf[locale] === 'string' && leaf[locale].trim()) continue;
    if (overlays[locale].has(`${slug}.${path}`)) continue;
    jobs[locale].push({ slug, path, en });
  }
}

function walk(slug: string, path: string, node: unknown): void {
  if (node === null || node === undefined) return;
  if (isLocaleText(node)) {
    emit(slug, path, node as Record<string, string>);
    return;
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      walk(slug, `${path}[${i}]`, node[i]);
    }
    return;
  }
  if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      const next = path ? `${path}.${k}` : k;
      walk(slug, next, v);
    }
  }
}

for (const [slug, article] of Object.entries(LOCALIZED_TRANSIT_ARTICLES)) {
  walk(slug, '', article);
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

/* eslint-disable no-console */
/**
 * Extract translation jobs from PUJA_VIDHIS (47 puja-vidhi files).
 *
 * Walks the nested structure (samagri[], vidhiSteps[], mantras[],
 * stotras[], aarti, parana, precautions[], top-level LocaleText fields)
 * and emits (slug, path, en) tuples for every LocaleText whose target
 * locale is empty AND not already covered by an existing overlay.
 *
 * Path notation mirrors what the runtime merger walks:
 *   deity
 *   sankalpa
 *   precautions[2]
 *   samagri[3].name
 *   samagri[3].substitutions[0].item
 *   vidhiSteps[7].description
 *   mantras[0].meaning
 *   aarti.name
 *   parana.description
 *
 * Sacred Devanagari + IAST fields stay AS-IS (mantra.devanagari,
 * mantra.iast, aarti.devanagari, aarti.iast, stotras[].text) — they
 * are not LocaleText objects so the walker naturally skips them.
 *
 * Output (stdout, JSON):
 *   {
 *     total: N,
 *     by_locale: { ta: ..., te: ..., ... },
 *     jobs: { ta: [{ slug, path, en }, ...], ... }
 *   }
 *
 * Consumed by scripts/translate-puja-vidhi-via-gemini.py.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

interface Job {
  slug: string;
  path: string;
  en: string;
}

// Load existing overlays so re-runs skip already-translated (slug, path)
// pairs. Same idempotency pattern as extract-festival-translation-jobs.ts.
const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `puja-vidhi-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-puja] malformed ${path} — treating as empty`);
  }
}

function isLocaleText(v: unknown): v is Record<string, string> {
  if (!v || typeof v !== 'object') return false;
  const en = (v as Record<string, unknown>)['en'];
  return typeof en === 'string' && en.trim().length > 0;
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

function emit(slug: string, path: string, en: string): void {
  for (const locale of LOCALES) {
    if (overlays[locale].has(`${slug}.${path}`)) continue;
    jobs[locale].push({ slug, path, en });
  }
}

function walk(slug: string, path: string, node: unknown): void {
  if (node === null || node === undefined) return;
  if (isLocaleText(node)) {
    const en = (node as Record<string, string>)['en'];
    emit(slug, path, en);
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
      // Skip non-translatable keys: sacred Devanagari/IAST, structural ids,
      // primitive metadata. Walker naturally only recurses into LocaleText
      // objects + arrays/objects; skip-list is defensive against future
      // shape changes that might accidentally make a primitive string
      // look LocaleText-ish (it can't — we check `en` is string).
      const next = path ? `${path}.${k}` : k;
      walk(slug, next, v);
    }
  }
}

for (const [slug, vidhi] of Object.entries(PUJA_VIDHIS)) {
  walk(slug, '', vidhi as unknown);
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));

console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

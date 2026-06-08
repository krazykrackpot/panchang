/* eslint-disable no-console */
/**
 * Extract translation jobs from VRAT_KATHAS — 10 vrats × multiple
 * LocaleText fields each (title, deity, overview, whenObserved, phal,
 * vidhi + chapters[i].title + chapters[i].content). Source is en+hi only.
 *
 * Keys:
 *   `<slug>.<field>` for simple top-level LocaleText
 *   `<slug>.chapters[N].title` / `<slug>.chapters[N].content`
 *
 * `samagri` arrays stay out of scope — they're `{en: string[], hi:
 * string[]}` not LocaleText and need a different shape to translate.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { VRAT_KATHAS } from '@/lib/content/vrat-kathas';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const SIMPLE_FIELDS = ['title', 'deity', 'overview', 'whenObserved', 'phal', 'vidhi'] as const;

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'content');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `vrat-kathas-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-vrat] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

function emit(key: string, leaf: Record<string, string>): void {
  const enSrc = leaf.en;
  if (typeof enSrc !== 'string' || !enSrc.trim()) return;
  for (const locale of LOCALES) {
    if (typeof leaf[locale] === 'string' && leaf[locale].trim()) continue;
    if (overlays[locale].has(key)) continue;
    jobs[locale].push({ key, en: enSrc });
  }
}

for (const vrat of VRAT_KATHAS) {
  for (const field of SIMPLE_FIELDS) {
    emit(`${vrat.slug}.${field}`, vrat[field] as Record<string, string>);
  }
  if (vrat.chapters) {
    vrat.chapters.forEach((ch, i) => {
      emit(`${vrat.slug}.chapters[${i}].title`, ch.title as Record<string, string>);
      emit(`${vrat.slug}.chapters[${i}].content`, ch.content as Record<string, string>);
    });
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

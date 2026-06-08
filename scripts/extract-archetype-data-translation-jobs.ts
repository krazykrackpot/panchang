/* eslint-disable no-console */
/**
 * Extract translation jobs from ARCHETYPES + YOGA_PSYCH_INSIGHTS +
 * LAGNA_MODIFIERS — all plain-string fields powering the Cosmic
 * Blueprint engine. For 7 visible regional locales (the engine path
 * currently has only EN content; this PR adds 7-locale parity).
 *
 * Keys:
 *   `archetype.<planetId>.coreDescription` / `.blindSpot` / etc.
 *   `archetype.<planetId>.traits[N]` / `.chapterThemes[N]`
 *   `yoga.<yogaId>`
 *   `lagna.<rashiId>`
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ARCHETYPES, YOGA_PSYCH_INSIGHTS, LAGNA_MODIFIERS } from '@/lib/constants/archetype-data';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const ARCH_FIELDS = ['coreDescription', 'blindSpot', 'shadowDescription', 'growthArea', 'chapterDescription'] as const;

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `archetype-data-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-arch-data] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

function emit(key: string, en: string): void {
  if (!en || !en.trim()) return;
  for (const locale of LOCALES) {
    if (overlays[locale].has(key)) continue;
    jobs[locale].push({ key, en });
  }
}

// ARCHETYPES
for (const [planetId, arch] of Object.entries(ARCHETYPES)) {
  for (const field of ARCH_FIELDS) {
    emit(`archetype.${planetId}.${field}`, arch[field]);
  }
  arch.traits.forEach((t, i) => emit(`archetype.${planetId}.traits[${i}]`, t));
  arch.chapterThemes.forEach((t, i) => emit(`archetype.${planetId}.chapterThemes[${i}]`, t));
}

// YOGA_PSYCH_INSIGHTS
for (const [yogaId, text] of Object.entries(YOGA_PSYCH_INSIGHTS)) {
  emit(`yoga.${yogaId}`, text);
}

// LAGNA_MODIFIERS
for (const [rashiId, text] of Object.entries(LAGNA_MODIFIERS)) {
  emit(`lagna.${rashiId}`, text);
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));

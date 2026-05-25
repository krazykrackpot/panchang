#!/usr/bin/env tsx
/**
 * Detect PAGE_META entries where a non-EN locale's title or description
 * looks like it was paste-pasted from a different route.
 *
 * The /eclipses regression (Gemini #172 critical) shipped horoscope copy
 * in 6 non-EN locale slots — caught only by chance. This script flags
 * suspicious entries by transliterating each non-EN title to ASCII (rough
 * IAST-ish), then computing keyword overlap with the EN title. Low overlap
 * (< 0.15 Jaccard) is the smell.
 *
 * Audit 2026-05-25 §A12.
 *
 * Usage:
 *   npx tsx scripts/audit-pageMeta-keyword-overlap.ts
 */
import { Project, SyntaxKind } from 'ts-morph';

const TARGET = 'src/lib/seo/metadata.ts';
const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

// Transliterate Devanagari/Tamil/Telugu/Bengali/Kannada/Gujarati syllables to
// ASCII consonant cores. Cheap heuristic — good enough to catch paste errors.
const TRANSLIT: Array<[RegExp, string]> = [
  // Devanagari (hi/mai/mr)
  [/[कख]/g, 'k'], [/[गघ]/g, 'g'], [/[चछ]/g, 'c'],
  [/[जझ]/g, 'j'], [/[टठ]/g, 'T'], [/[डढ]/g, 'D'],
  [/[ण]/g, 'N'], [/[तथ]/g, 't'], [/[दध]/g, 'd'],
  [/[न]/g, 'n'], [/[पफ]/g, 'p'], [/[बभ]/g, 'b'],
  [/[म]/g, 'm'], [/[य]/g, 'y'], [/[र]/g, 'r'], [/[ल]/g, 'l'],
  [/[व]/g, 'v'], [/[शषस]/g, 's'], [/[ह]/g, 'h'],
  [/[अ-औा-्ॐ-॔]/g, ''], // vowels + marks dropped
  // Tamil
  [/[க]/g, 'k'], [/[ச]/g, 'c'], [/[ட]/g, 'T'], [/[த]/g, 't'],
  [/[ப]/g, 'p'], [/[நண]/g, 'n'], [/[ம]/g, 'm'],
  [/[ய]/g, 'y'], [/[ரற]/g, 'r'], [/[லளழ]/g, 'l'],
  [/[வ]/g, 'v'], [/[ஷஸஶ]/g, 's'], [/[ஹ]/g, 'h'],
  [/[அ-ஔா-்]/g, ''],
  // Telugu
  [/[క-హఽ-్]/g, (c) => 'kkgg ccjj  TT  DDNNttdd  nn ppbbmmyyr ll vvsssh'[Math.min(c.charCodeAt(0) - 0x0C15, 47)] || ''],
  // Bengali
  [/[ক-হ়-্]/g, (c) => 'kkgg ccjj  TT  DDNNttdd  nn ppbbmmyyr ll vvsssh'[Math.min(c.charCodeAt(0) - 0x0995, 47)] || ''],
  // Gujarati
  [/[ક-હ઼-્]/g, (c) => 'kkgg ccjj  TT  DDNNttdd  nn ppbbmmyyr ll vvsssh'[Math.min(c.charCodeAt(0) - 0x0A95, 47)] || ''],
  // Kannada
  [/[ಕ-ಹ಼-್]/g, (c) => 'kkgg ccjj  TT  DDNNttdd  nn ppbbmmyyr ll vvsssh'[Math.min(c.charCodeAt(0) - 0x0C95, 47)] || ''],
];

function asciify(s: string): string {
  let out = s.toLowerCase();
  for (const [re, rep] of TRANSLIT) {
    out = typeof rep === 'string' ? out.replace(re, rep) : out.replace(re, rep as never);
  }
  // collapse non-letter/space + dedupe spaces
  return out.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function tokens(s: string): Set<string> {
  return new Set(s.split(/\s+/).filter((t) => t.length >= 3));
}

const flagged: Array<{ route: string; field: string; locale: string; jaccard: number; sample: string }> = [];
const THRESHOLD = 0.15;

for (const routeProp of pageMetaObj.getProperties()) {
  if (routeProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const r = routeProp.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const route = r.getName().replace(/^['"`]|['"`]$/g, '');
  const meta = r.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!meta) continue;

  for (const field of ['title', 'description'] as const) {
    const fieldProp = meta.getProperty(field);
    if (!fieldProp || fieldProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const fObj = fieldProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!fObj) continue;
    const enProp = fObj.getProperty('en');
    if (!enProp || enProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const enRaw = enProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerOrThrow().getText();
    if (enRaw.includes('${')) continue; // template literal — skip
    const enText = enRaw.slice(1, -1).toLowerCase();
    const enTokens = tokens(enText.replace(/[^a-z0-9 ]+/g, ' '));

    for (const p of fObj.getProperties()) {
      if (p.getKind() !== SyntaxKind.PropertyAssignment) continue;
      const pa = p.asKindOrThrow(SyntaxKind.PropertyAssignment);
      const name = pa.getName();
      if (name === 'en') continue;
      const raw = pa.getInitializerOrThrow().getText();
      if (raw.includes('${')) continue;
      const value = raw.slice(1, -1);
      // Strip the English co-text after `|` (bilingual format) — only audit the script half.
      const scriptOnly = value.includes('|') ? value.split('|')[0].trim() : value;
      const asci = asciify(scriptOnly);
      const valTokens = tokens(asci);
      const overlap = jaccard(enTokens, valTokens);
      if (overlap < THRESHOLD) {
        flagged.push({ route, field, locale: name, jaccard: overlap, sample: scriptOnly.slice(0, 70) });
      }
    }
  }
}

console.log(`Flagged ${flagged.length} entries with < ${THRESHOLD} Jaccard overlap.`);
console.log(`(Low overlap = possible paste error or script that uses entirely native vocabulary.)`);
console.log('Top 30 worst (sorted by overlap ascending):');
flagged.sort((a, b) => a.jaccard - b.jaccard);
for (const f of flagged.slice(0, 30)) {
  console.log(`  ${f.jaccard.toFixed(2)}  ${f.route}.${f.field}[${f.locale}]  "${f.sample}"`);
}

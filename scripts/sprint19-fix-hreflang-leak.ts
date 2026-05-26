#!/usr/bin/env tsx
/**
 * Sprint 19 — replace hardcoded `languages: { en, hi, sa, 'x-default' }`
 * (or similar incomplete maps) with `buildHreflangMap(route)` in 12
 * layouts/pages that still emit retired-locale hreflang signals.
 *
 * Retired locales (`sa`, `mr`) are 301-redirected by the proxy, so
 * advertising them via hreflang dilutes locale-targeting signal in
 * Google. The canonical helper `buildHreflangMap` (from
 * `src/lib/seo/hreflang.ts`) is sourced from `visibleLocales` and
 * stays in sync as locales are added/retired.
 *
 * Implementation: brace-balanced matching (not regex) — regex breaks on
 * template literals like `${BASE_URL}/...` because `}` inside the
 * template is indistinguishable from the closing `}` of the object.
 *
 * Each file is patched in-place:
 *   1. Add `import { buildHreflangMap } from '@/lib/seo/hreflang';`
 *      if not already imported.
 *   2. Replace the `languages: {...}` block with
 *      `languages: buildHreflangMap(\`<route>\`)`.
 *
 * Idempotent — re-running is a no-op once the file matches the new shape.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');

interface Patch {
  file: string;
  /** Path AFTER the locale segment, with leading slash. Template literal
   *  syntax (`${id}`) is preserved verbatim and resolved at runtime. */
  route: string;
}

const PATCHES: Patch[] = [
  { file: 'src/app/[locale]/learn/library/layout.tsx',           route: '/learn/library' },
  { file: 'src/app/[locale]/dates/[category]/layout.tsx',        route: '/dates/${category}' },
  { file: 'src/app/[locale]/privacy/page.tsx',                   route: '/privacy' },
  { file: 'src/app/[locale]/kundali/[id]/layout.tsx',            route: '/kundali/${id}' },
  { file: 'src/app/[locale]/terms/page.tsx',                     route: '/terms' },
  { file: 'src/app/[locale]/daily/page.tsx',                     route: '/daily' },
  { file: 'src/app/[locale]/daily/[date]/page.tsx',              route: '/daily/${date}' },
  { file: 'src/app/[locale]/daily/[date]/[city]/layout.tsx',     route: '/daily/${date}/${city}' },
  { file: 'src/app/[locale]/dashboard/layout.tsx',               route: '/dashboard' },
  { file: 'src/app/[locale]/panchang/rashi/[id]/layout.tsx',     route: '/panchang/rashi/${id}' },
  { file: 'src/app/[locale]/panchang/nakshatra/[id]/layout.tsx', route: '/panchang/nakshatra/${id}' },
  { file: 'src/app/[locale]/panchang/[city]/page.tsx',           route: '/panchang/${city}' },
];

const IMPORT_RE = /import\s+\{\s*buildHreflangMap\s*\}\s+from\s+'@\/lib\/seo\/hreflang';?/;
const IMPORT_LINE = "import { buildHreflangMap } from '@/lib/seo/hreflang';";

/** Find the `languages: {` object literal and return [start, endAfterCloser]
 *  (so the caller can slice it out cleanly). Skips characters inside
 *  template literals so `${...}` braces don't confuse the matcher.
 *  Returns null if no match.
 *
 *  The end index points to the character AFTER the closing `}` of the
 *  languages object — including the optional trailing comma. */
function findLanguagesBlock(text: string): { start: number; end: number } | null {
  const labelIdx = text.search(/languages:\s*\{/);
  if (labelIdx < 0) return null;
  const openBraceIdx = text.indexOf('{', labelIdx);
  let depth = 1;
  let i = openBraceIdx + 1;
  let inTemplate = false; // inside a `...` template literal
  let inString: '"' | "'" | null = null;
  while (i < text.length && depth > 0) {
    const ch = text[i];
    const prev = text[i - 1];
    if (inString) {
      if (ch === inString && prev !== '\\') inString = null;
    } else if (inTemplate) {
      // `${` opens an expression — track its braces separately.
      if (ch === '$' && text[i + 1] === '{') {
        // Walk to the matching `}` ignoring template content.
        let exprDepth = 1;
        i += 2;
        while (i < text.length && exprDepth > 0) {
          if (text[i] === '{') exprDepth++;
          else if (text[i] === '}') exprDepth--;
          i++;
        }
        continue;
      }
      if (ch === '`' && prev !== '\\') inTemplate = false;
    } else {
      if (ch === '`') inTemplate = true;
      else if (ch === '"' || ch === "'") inString = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    i++;
  }
  if (depth !== 0) return null;
  // Consume optional trailing comma (and a single trailing whitespace char).
  let end = i;
  if (text[end] === ',') end++;
  return { start: labelIdx, end };
}

let updated = 0;
let skipped = 0;
const report: string[] = [];

for (const { file, route } of PATCHES) {
  let text = readFileSync(file, 'utf8');
  const before = text;

  // 1. Add import if missing — insert after the last existing import line.
  if (!IMPORT_RE.test(text)) {
    // Find the last top-of-file import statement.
    const importRegex = /^import\s[^\n]+;?\n/gm;
    let lastImportEnd = 0;
    let m: RegExpExecArray | null;
    while ((m = importRegex.exec(text)) !== null) {
      lastImportEnd = m.index + m[0].length;
    }
    if (lastImportEnd > 0) {
      text = text.slice(0, lastImportEnd) + IMPORT_LINE + '\n' + text.slice(lastImportEnd);
    } else {
      // Prepend at start of file as a fallback.
      text = IMPORT_LINE + '\n' + text;
    }
  }

  // 2. Replace the languages block.
  const block = findLanguagesBlock(text);
  if (block) {
    text = text.slice(0, block.start) + `languages: buildHreflangMap(\`${route}\`),` + text.slice(block.end);
  }

  if (text === before) {
    report.push(`[skip] ${file} — already migrated or pattern unmatched`);
    skipped++;
    continue;
  }
  if (APPLY) writeFileSync(file, text, 'utf8');
  report.push(`[${APPLY ? 'fixed' : 'would-fix'}] ${file} — route=\`${route}\``);
  updated++;
}

if (APPLY) {
  console.log(`\nFixed ${updated} files (${skipped} skipped).`);
} else {
  console.log(`\nDRY-RUN — pass --apply. Would fix ${updated} files (${skipped} skipped).`);
}
console.log();
for (const line of report) console.log(line);

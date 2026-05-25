#!/usr/bin/env tsx
/**
 * Detect PAGE_META entries where a non-EN locale's title or description
 * was paste-pasted from a different route.
 *
 * Original approach (Jaccard transliteration overlap) had two problems:
 * 1. Transliteration mappings for South Indian scripts were misaligned
 *    with Unicode consonant blocks (Gemini #178).
 * 2. Even with correct mappings, legitimate native-only translations
 *    score 0.00 overlap with the EN title because Latin/foreign-script
 *    tokens never share characters — so the noise floor is too high.
 *
 * Pivoted to the actual signature of the regression we want to catch:
 * the /eclipses bug shipped *byte-identical* Tamil text in both /horoscope
 * and /eclipses. So we group every non-EN value by (locale, normalized-text)
 * and flag any group with > 1 distinct route. Two different routes with
 * the same Tamil/Bengali/etc. title is the paste error.
 *
 * Audit 2026-05-25 §A12 (revised after Gemini #178).
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

/**
 * Normalise a foreign-script title for cross-route comparison. We strip
 * the bilingual ` | English` suffix (added by the bilingualize codemod),
 * collapse whitespace, and lowercase. Any two routes with the same
 * normalised string in the same locale slot is the paste smell.
 */
function normaliseValue(s: string): string {
  // Strip the ` | English co-text` if present.
  const scriptOnly = s.includes('|') ? s.split('|')[0] : s;
  return scriptOnly.replace(/\s+/g, ' ').trim().toLowerCase();
}

interface Entry {
  route: string;
  field: 'title' | 'description';
  locale: string;
  value: string;
}

const entries: Entry[] = [];

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

    for (const p of fObj.getProperties()) {
      if (p.getKind() !== SyntaxKind.PropertyAssignment) continue;
      const pa = p.asKindOrThrow(SyntaxKind.PropertyAssignment);
      const locale = pa.getName();
      if (locale === 'en') continue;
      const raw = pa.getInitializerOrThrow().getText();
      // Template literals are dynamic — skip (e.g. `${new Date().getFullYear()}`).
      if (raw.includes('${')) continue;
      if (!raw.startsWith("'") && !raw.startsWith('"') && !raw.startsWith('`')) continue;
      const value = normaliseValue(raw.slice(1, -1));
      if (value.length === 0) continue;
      entries.push({ route, field, locale, value });
    }
  }
}

// Group by (field, locale, normalised value).
const groups = new Map<string, Set<string>>();
for (const e of entries) {
  const key = `${e.field}|${e.locale}|${e.value}`;
  let routes = groups.get(key);
  if (!routes) {
    routes = new Set();
    groups.set(key, routes);
  }
  routes.add(e.route);
}

const flagged = Array.from(groups.entries())
  .filter(([, routes]) => routes.size > 1)
  .map(([key, routes]) => {
    const [field, locale, value] = key.split('|');
    return { field, locale, value, routes: [...routes].sort() };
  })
  .sort((a, b) => b.routes.length - a.routes.length);

console.log(`PAGE_META cross-route duplicate audit`);
console.log(`Flagged ${flagged.length} (field, locale, value) groups that appear on > 1 route.`);
console.log(`(Each row = one foreign-script string used by multiple routes — possible paste error.)\n`);

for (const f of flagged.slice(0, 30)) {
  console.log(`  [${f.locale}] ${f.field}  "${f.value.slice(0, 60)}…"`);
  for (const r of f.routes) console.log(`     - ${r}`);
}

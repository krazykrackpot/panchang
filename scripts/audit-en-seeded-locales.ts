#!/usr/bin/env tsx
/**
 * Audit PAGE_META for routes where ta/te/bn/gu/kn title or description
 * values are byte-identical to the EN value (i.e. silent English fallback
 * shipped to non-EN locales — same shape as the Tamil-learn audit, but
 * scoped to PAGE_META rather than message JSON).
 *
 * Usage:
 *   npx tsx scripts/audit-en-seeded-locales.ts            # full report
 *   npx tsx scripts/audit-en-seeded-locales.ts --routes /panchang,/kundali
 */
import { Project, SyntaxKind } from 'ts-morph';

const args = process.argv.slice(2);
const routesIdx = args.indexOf('--routes');
const ROUTES_FILTER = routesIdx !== -1 ? args[routesIdx + 1]?.split(',') : null;

const SCRIPT_LOCALES = ['ta', 'te', 'bn', 'gu', 'kn'] as const;

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath('src/lib/seo/metadata.ts');
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

interface Row { route: string; field: 'title' | 'description'; locale: string; en: string; localeValue: string }
const rows: Row[] = [];

function getStringLiteral(node: import('ts-morph').Node | undefined): string | null {
  if (!node) return null;
  return node.asKind(SyntaxKind.StringLiteral)?.getLiteralValue()
    ?? node.asKind(SyntaxKind.NoSubstitutionTemplateLiteral)?.getLiteralValue()
    ?? null;
}

for (const prop of pageMetaObj.getProperties()) {
  if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const route = pa.getName().replace(/^['"]|['"]$/g, '');
  if (ROUTES_FILTER && !ROUTES_FILTER.includes(route)) continue;
  const init = pa.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
  const meta = init.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const fieldName of ['title', 'description'] as const) {
    const fieldProp = meta.getProperty(fieldName);
    if (!fieldProp || fieldProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const fieldObj = fieldProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!fieldObj) continue;
    const enEntry = fieldObj.getProperty('en') ?? fieldObj.getProperty("'en'") ?? fieldObj.getProperty('"en"');
    if (!enEntry || enEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const en = getStringLiteral(enEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
    if (!en) continue;

    for (const locale of SCRIPT_LOCALES) {
      const localeEntry = fieldObj.getProperty(locale) ?? fieldObj.getProperty(`'${locale}'`) ?? fieldObj.getProperty(`"${locale}"`);
      if (!localeEntry || localeEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
      const localeValue = getStringLiteral(localeEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
      if (!localeValue) continue;
      if (localeValue === en) {
        rows.push({ route, field: fieldName, locale, en, localeValue });
      }
    }
  }
}

const byRoute = new Map<string, number>();
for (const r of rows) byRoute.set(r.route, (byRoute.get(r.route) ?? 0) + 1);

console.log(`Total EN-seeded title/desc entries (ta/te/bn/gu/kn = en): ${rows.length}`);
console.log(`Routes affected: ${byRoute.size}\n`);
console.log('Top 30 routes by seeded count:');
[...byRoute.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).forEach(([r, n]) => {
  console.log(`  ${n.toString().padStart(2)} × ${r}`);
});

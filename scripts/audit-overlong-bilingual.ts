#!/usr/bin/env tsx
/**
 * Audit PAGE_META titles for overlong bilingual format (>=110 chars).
 * Flags candidates for Sprint 7 EN-side shortening.
 *
 * Usage:
 *   npx tsx scripts/audit-overlong-bilingual.ts
 *   npx tsx scripts/audit-overlong-bilingual.ts --route /calendars/tithi
 */
import { Project, SyntaxKind } from 'ts-morph';

const routeIndex = process.argv.indexOf('--route');
if (routeIndex !== -1 && routeIndex + 1 >= process.argv.length) {
  console.error('Error: --route flag requires a value, e.g. --route /charts');
  process.exit(1);
}
const FOCUS_ROUTES = routeIndex !== -1 ? [process.argv[routeIndex + 1]] : null;

const TARGET = 'src/lib/seo/metadata.ts';
const FLAG_AT = 110;

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

const rows: Array<{ route: string; locale: string; len: number; preview: string }> = [];

for (const prop of pageMetaObj.getProperties()) {
  if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const route = pa.getName().replace(/^['"]|['"]$/g, '');
  if (FOCUS_ROUTES && !FOCUS_ROUTES.includes(route)) continue;
  const init = pa.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
  const meta = init.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const titleProp = meta.getProperty('title');
  if (!titleProp || titleProp.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const titleObj = titleProp.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const titleEntry of titleObj.getProperties()) {
    if (titleEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const e = titleEntry.asKindOrThrow(SyntaxKind.PropertyAssignment);
    const locale = e.getName();
    let v: string | undefined =
      e.getInitializerIfKind(SyntaxKind.StringLiteral)?.getLiteralValue()
      ?? e.getInitializerIfKind(SyntaxKind.NoSubstitutionTemplateLiteral)?.getLiteralValue();
    if (v === undefined) {
      // TemplateExpression: collapse ${...} interpolations to a 4-char
      // placeholder ("2026" — matches the dominant runtime substitution
      // for year-bearing titles) so the length estimate is realistic.
      const tmpl = e.getInitializerIfKind(SyntaxKind.TemplateExpression);
      if (tmpl) {
        v = tmpl.getHead().getLiteralText();
        for (const span of tmpl.getTemplateSpans()) {
          v += '2026' + span.getLiteral().getLiteralText();
        }
      }
    }
    if (typeof v !== 'string') continue;
    if (v.length >= FLAG_AT) {
      rows.push({ route, locale, len: v.length, preview: v.slice(0, 90) + (v.length > 90 ? '…' : '') });
    }
  }
}

rows.sort((a, b) => b.len - a.len);

console.log(`Overlong titles (>=${FLAG_AT} chars): ${rows.length}\n`);
for (const r of rows) {
  console.log(`[${r.len}] ${r.route} (${r.locale})`);
  console.log(`     ${r.preview}`);
}

// Group by route
const byRoute = new Map<string, number>();
for (const r of rows) byRoute.set(r.route, (byRoute.get(r.route) ?? 0) + 1);
console.log('\nRoutes with most overlong locales:');
[...byRoute.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).forEach(([r, n]) => {
  console.log(`  ${n} × ${r}`);
});

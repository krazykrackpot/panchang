#!/usr/bin/env tsx
/**
 * Sprint 8 audit — find EN-side titles >65 chars and EN-side descriptions
 * >170 chars in `src/lib/seo/metadata.ts`. These are the source of every
 * bilingual title/description overlong issue, because the EN string is
 * literally suffixed onto every locale's value.
 *
 * Usage:
 *   npx tsx scripts/audit-long-en-meta.ts                 # show all
 *   npx tsx scripts/audit-long-en-meta.ts --kind title    # titles only
 *   npx tsx scripts/audit-long-en-meta.ts --kind desc     # descriptions only
 *   npx tsx scripts/audit-long-en-meta.ts --top 20        # show first 20
 */
import { Project, SyntaxKind } from 'ts-morph';

const TARGET = 'src/lib/seo/metadata.ts';
const TITLE_THRESHOLD = 65;
const DESC_THRESHOLD = 170;

const args = process.argv.slice(2);
const kindIdx = args.indexOf('--kind');
const topIdx = args.indexOf('--top');
const KIND = kindIdx !== -1 ? args[kindIdx + 1] : 'all';
const TOP = topIdx !== -1 ? parseInt(args[topIdx + 1], 10) : Infinity;

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath(TARGET);
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

interface Row { route: string; kind: 'title' | 'desc'; len: number; preview: string; full: string }
const rows: Row[] = [];

function getStringValue(node: import('ts-morph').Node | undefined): string | undefined {
  if (!node) return undefined;
  if (node.getKind() === SyntaxKind.StringLiteral) return node.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
  if (node.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral) return node.asKindOrThrow(SyntaxKind.NoSubstitutionTemplateLiteral).getLiteralValue();
  if (node.getKind() === SyntaxKind.TemplateExpression) {
    const tmpl = node.asKindOrThrow(SyntaxKind.TemplateExpression);
    let v = tmpl.getHead().getLiteralText();
    for (const span of tmpl.getTemplateSpans()) {
      v += '2026' + span.getLiteral().getLiteralText();
    }
    return v;
  }
  return undefined;
}

for (const prop of pageMetaObj.getProperties()) {
  if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const route = pa.getName().replace(/^['"]|['"]$/g, '');
  const init = pa.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
  const meta = init.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const fieldName of ['title', 'description'] as const) {
    const field = meta.getProperty(fieldName);
    if (!field || field.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const fieldObj = field.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (!fieldObj) continue;

    const enEntry = fieldObj.getProperty('en');
    if (!enEntry || enEntry.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const v = getStringValue(enEntry.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer());
    if (typeof v !== 'string') continue;
    const threshold = fieldName === 'title' ? TITLE_THRESHOLD : DESC_THRESHOLD;
    if (v.length > threshold) {
      const kind: 'title' | 'desc' = fieldName === 'title' ? 'title' : 'desc';
      if (KIND === 'all' || (KIND === 'title' && kind === 'title') || (KIND === 'desc' && kind === 'desc')) {
        rows.push({ route, kind, len: v.length, preview: v.slice(0, 120) + (v.length > 120 ? '…' : ''), full: v });
      }
    }
  }
}

rows.sort((a, b) => b.len - a.len);

const titleCount = rows.filter(r => r.kind === 'title').length;
const descCount = rows.filter(r => r.kind === 'desc').length;
console.log(`EN titles >${TITLE_THRESHOLD} chars: ${titleCount}`);
console.log(`EN descriptions >${DESC_THRESHOLD} chars: ${descCount}\n`);

for (const r of rows.slice(0, TOP)) {
  console.log(`[${r.len}] ${r.kind} ${r.route}`);
  console.log(`     ${r.preview}`);
}

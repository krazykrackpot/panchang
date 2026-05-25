#!/usr/bin/env tsx
/**
 * Dump the FULL EN description value for every route whose EN desc is
 * longer than 170 chars, as a JSON map. Used to seed Sprint 8's
 * shortening dictionary with the exact source strings.
 */
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: 'tsconfig.json', skipAddingFilesFromTsConfig: true });
const src = project.addSourceFileAtPath('src/lib/seo/metadata.ts');
const pageMetaDecl = src.getVariableDeclarationOrThrow('PAGE_META');
const pageMetaObj = pageMetaDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

const out: Record<string, string> = {};
for (const prop of pageMetaObj.getProperties()) {
  if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const pa = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
  const route = pa.getName().replace(/^['"]|['"]$/g, '');
  const init = pa.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;
  const meta = init.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const desc = meta.getProperty('description');
  if (!desc || desc.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const descObj = desc.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!descObj) continue;
  const en = descObj.getProperty('en');
  if (!en || en.getKind() !== SyntaxKind.PropertyAssignment) continue;
  const init2 = en.asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializer();
  const v = init2?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue()
    ?? init2?.asKind(SyntaxKind.NoSubstitutionTemplateLiteral)?.getLiteralValue();
  if (typeof v !== 'string') continue;
  if (v.length > 170) out[route] = v;
}

console.log(JSON.stringify(out, null, 2));

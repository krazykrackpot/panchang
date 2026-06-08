#!/usr/bin/env npx tsx
/**
 * Codemod: `locale === 'hi' ? <hi-expr> : <en-expr>` → `pickByScript(<en-expr>, <hi-expr>, locale)`.
 *
 * Why: 4 of 9 visible locales use Devanagari script (hi, sa, mr, mai).
 * The old ternary only honoured `hi`; mr/mai readers saw the English
 * fallback even though their script is identical to Hindi. Routing
 * through `pickByScript()` (canonical helper in locale-fonts.ts) maps
 * all 4 Devanagari locales to the Hindi branch and leaves the
 * 5 non-Devanagari locales on the English branch unchanged.
 *
 * Only transforms `BinaryExpression(StrictEquals, Identifier(locale), StringLiteral('hi'))`
 * as the condition. Skips:
 *  - Nested ternaries (e.g. `locale === 'hi' ? X : locale === 'sa' ? Y : Z`).
 *    These need manual review for parity intent.
 *  - Comparisons against other locales as the primary discriminator.
 *  - Files outside src/.
 *
 * Adds `import { pickByScript } from '@/lib/utils/locale-fonts'` if missing.
 * Files where the codemod hits at least 1 occurrence are written back.
 */
import { Project, SyntaxKind, type SourceFile, type ConditionalExpression } from 'ts-morph';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const project = new Project({
  tsConfigFilePath: path.join(ROOT, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: false,
});

type Stat = { file: string; rewrites: number; importAdded: boolean };
const stats: Stat[] = [];

function isLocaleEqHi(cond: ConditionalExpression): boolean {
  const condition = cond.getCondition();
  if (condition.getKind() !== SyntaxKind.BinaryExpression) return false;
  const bin = condition.asKindOrThrow(SyntaxKind.BinaryExpression);
  if (bin.getOperatorToken().getKind() !== SyntaxKind.EqualsEqualsEqualsToken) return false;
  const left = bin.getLeft();
  const right = bin.getRight();
  if (left.getKind() !== SyntaxKind.Identifier) return false;
  if (left.getText() !== 'locale') return false;
  if (right.getKind() !== SyntaxKind.StringLiteral) return false;
  return right.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue() === 'hi';
}

function isNestedLocaleTernary(node: ConditionalExpression): boolean {
  const whenFalse = node.getWhenFalse();
  if (whenFalse.getKind() !== SyntaxKind.ConditionalExpression) return false;
  return whenFalse.getText().includes("locale ===");
}

function addPickByScriptImport(sf: SourceFile): boolean {
  const existing = sf.getImportDeclarations().find(d =>
    d.getModuleSpecifierValue().endsWith('locale-fonts'),
  );
  if (existing) {
    const named = existing.getNamedImports().map(n => n.getName());
    if (named.includes('pickByScript')) return false;
    existing.addNamedImport('pickByScript');
    return true;
  }
  sf.addImportDeclaration({
    moduleSpecifier: '@/lib/utils/locale-fonts',
    namedImports: ['pickByScript'],
  });
  return true;
}

function processFile(sf: SourceFile): void {
  const filePath = sf.getFilePath();
  if (!filePath.includes('/src/')) return;
  if (filePath.includes('.test.') || filePath.includes('__tests__')) return;
  let rewrites = 0;

  // Collect conditionals first; mutating during traversal invalidates nodes.
  const targets: ConditionalExpression[] = [];
  sf.forEachDescendant(node => {
    if (node.getKind() !== SyntaxKind.ConditionalExpression) return;
    const cond = node.asKindOrThrow(SyntaxKind.ConditionalExpression);
    if (!isLocaleEqHi(cond)) return;
    if (isNestedLocaleTernary(cond)) return;
    targets.push(cond);
  });

  // Iterate parent → child first so outer rewrites don't invalidate inner.
  // ts-morph mutations on inner nodes survive outer rewrites here because
  // we rebuild outer text from child .getText() calls AFTER inner rewrites.
  // To stay safe, process children first by reversing position order.
  targets.sort((a, b) => b.getStart() - a.getStart());

  for (const cond of targets) {
    try {
      const hiExpr = cond.getWhenTrue().getText();
      const enExpr = cond.getWhenFalse().getText();
      cond.replaceWithText(`pickByScript(${enExpr}, ${hiExpr}, locale)`);
      rewrites++;
    } catch (err) {
      console.error(`  [SKIP] ${filePath}: ${(err as Error).message.slice(0, 80)}`);
    }
  }

  if (rewrites > 0) {
    const importAdded = addPickByScriptImport(sf);
    stats.push({ file: filePath.replace(ROOT + '/', ''), rewrites, importAdded });
  }
}

function main(): void {
  const sfs = project.getSourceFiles().filter(sf => {
    const p = sf.getFilePath();
    return p.includes('/src/') && (p.endsWith('.ts') || p.endsWith('.tsx'));
  });
  console.error(`Scanning ${sfs.length} source files…`);

  for (const sf of sfs) processFile(sf);

  console.error(`\nRewriting ${stats.length} files…`);
  project.saveSync();

  let totalRewrites = 0;
  for (const s of stats) {
    totalRewrites += s.rewrites;
    console.log(`  ${s.file}: ${s.rewrites} ternaries${s.importAdded ? ' (import added)' : ''}`);
  }
  console.log(`\nDONE: ${stats.length} files, ${totalRewrites} ternaries rewritten.`);
}

main();

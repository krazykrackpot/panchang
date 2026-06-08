#!/usr/bin/env npx tsx
/**
 * Codemod #2: nested `locale === 'X' ? A : locale === 'Y' ? B : ... : Z`
 * chains → `pickByLocale({ en: Z, X: A, Y: B, ... }, locale)`.
 *
 * Picks up where the first codemod (codemod-pickbyscript.ts) stopped —
 * that one skipped any conditional whose false-branch was itself another
 * `locale === ...` ternary, to avoid mishandling partial-coverage chains.
 *
 * This pass walks the whole chain, collects every `locale === '<code>' ? <expr>`
 * arm, and rewrites the entire chain into a single `pickByLocale()` call.
 * The final fallback (after all comparisons exhaust) becomes the `en` key.
 *
 * Strict invariants — chain is rewritten only if:
 *   - Every condition is `locale === '<literal>'`
 *   - Each compared locale is one of the visible-locale set
 *   - No duplicate locale comparisons
 *
 * `pickByLocale` (already canonical in src/lib/utils/locale-fonts.ts) handles
 * the Devanagari-fallback semantics (`mai`/`mr`/`sa` fall through to `hi`).
 */
import {
  Project, SyntaxKind, type SourceFile, type ConditionalExpression, type Expression,
} from 'ts-morph';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const VISIBLE_LOCALES = new Set(['en', 'hi', 'sa', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']);

const project = new Project({
  tsConfigFilePath: path.join(ROOT, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: false,
});

type Stat = { file: string; rewrites: number; importAdded: boolean };
const stats: Stat[] = [];

function localeEqArm(expr: Expression): { locale: string } | null {
  if (expr.getKind() !== SyntaxKind.BinaryExpression) return null;
  const bin = expr.asKindOrThrow(SyntaxKind.BinaryExpression);
  if (bin.getOperatorToken().getKind() !== SyntaxKind.EqualsEqualsEqualsToken) return null;
  const left = bin.getLeft();
  const right = bin.getRight();
  if (left.getKind() !== SyntaxKind.Identifier || left.getText() !== 'locale') return null;
  if (right.getKind() !== SyntaxKind.StringLiteral) return null;
  const lit = right.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
  if (!VISIBLE_LOCALES.has(lit)) return null;
  return { locale: lit };
}

interface Chain {
  arms: { locale: string; expr: Expression }[];
  fallback: Expression; // the final `: <expr>` after all comparisons exhaust
  outer: ConditionalExpression;
}

function walkChain(cond: ConditionalExpression): Chain | null {
  const arms: { locale: string; expr: Expression }[] = [];
  let node: Expression = cond;
  const outer = cond;
  while (node.getKind() === SyntaxKind.ConditionalExpression) {
    const c = node.asKindOrThrow(SyntaxKind.ConditionalExpression);
    const arm = localeEqArm(c.getCondition());
    if (!arm) return null;
    if (arms.some(a => a.locale === arm.locale)) return null; // duplicate
    arms.push({ locale: arm.locale, expr: c.getWhenTrue() });
    node = c.getWhenFalse();
  }
  if (arms.length < 2) return null; // single-arm is the previous codemod's job
  return { arms, fallback: node, outer };
}

function isInsideAnotherChain(cond: ConditionalExpression): boolean {
  const parent = cond.getParent();
  if (!parent) return false;
  if (parent.getKind() !== SyntaxKind.ConditionalExpression) return false;
  const parentCond = parent.asKindOrThrow(SyntaxKind.ConditionalExpression);
  // If we're the whenFalse of a locale-eq ternary, the outer pass owns us.
  return parentCond.getWhenFalse() === cond && localeEqArm(parentCond.getCondition()) !== null;
}

function buildRecordLiteral(chain: Chain): string {
  const entries: string[] = [`en: ${chain.fallback.getText()}`];
  for (const arm of chain.arms) {
    const text = arm.expr.getText();
    entries.push(`${arm.locale}: ${text}`);
  }
  return `{ ${entries.join(', ')} }`;
}

function addPickByLocaleImport(sf: SourceFile): boolean {
  const existing = sf.getImportDeclarations().find(d =>
    d.getModuleSpecifierValue().endsWith('locale-fonts'),
  );
  if (existing) {
    const named = existing.getNamedImports().map(n => n.getName());
    if (named.includes('pickByLocale')) return false;
    existing.addNamedImport('pickByLocale');
    return true;
  }
  sf.addImportDeclaration({
    moduleSpecifier: '@/lib/utils/locale-fonts',
    namedImports: ['pickByLocale'],
  });
  return true;
}

function processFile(sf: SourceFile): void {
  const filePath = sf.getFilePath();
  if (!filePath.includes('/src/')) return;
  if (filePath.includes('.test.') || filePath.includes('__tests__')) return;
  let rewrites = 0;

  const targets: Chain[] = [];
  sf.forEachDescendant(node => {
    if (node.getKind() !== SyntaxKind.ConditionalExpression) return;
    const cond = node.asKindOrThrow(SyntaxKind.ConditionalExpression);
    if (isInsideAnotherChain(cond)) return;
    const chain = walkChain(cond);
    if (chain) targets.push(chain);
  });

  // Rewrite bottom-up so deeper nodes resolve text first.
  targets.sort((a, b) => b.outer.getStart() - a.outer.getStart());

  for (const chain of targets) {
    try {
      const record = buildRecordLiteral(chain);
      chain.outer.replaceWithText(`pickByLocale(${record}, locale)`);
      rewrites++;
    } catch (err) {
      console.error(`  [SKIP] ${filePath}: ${(err as Error).message.slice(0, 80)}`);
    }
  }

  if (rewrites > 0) {
    const importAdded = addPickByLocaleImport(sf);
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
    console.log(`  ${s.file}: ${s.rewrites} chains${s.importAdded ? ' (import added)' : ''}`);
  }
  console.log(`\nDONE: ${stats.length} files, ${totalRewrites} nested chains rewritten.`);
}

main();

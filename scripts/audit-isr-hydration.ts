#!/usr/bin/env -S npx tsx
/**
 * Static auditor for React #418 hydration traps on ISR-cached pages.
 *
 * Why this exists:
 *   On 2026-05-28 we lost ~80% of analytics pageviews for 12+ hours
 *   because ISR-cached server pages mounted 'use client' components
 *   whose render body (or `useMemo` factory) called `new Date()` /
 *   `todayInTimezone()` / `Date.now()`. Server-baked HTML and the
 *   visitor's hydration pass disagreed → React #418 → entire React
 *   tree died → silent analytics death. See CLAUDE.md Lesson ZD.
 *
 * What this checks:
 *   1. Walk `src/app/[locale]/` for `page.tsx` files exporting
 *      `revalidate` (i.e. ISR-cached). Skip ones with
 *      `dynamic = 'force-dynamic'`.
 *   2. Resolve client component imports from each such page
 *      (sibling `./Client`, `../Client`, named clients).
 *   3. In each imported client file, flag *render-scope* calls to:
 *        - `todayInTimezone(`
 *        - `new Date()`
 *        - `Date.now()`
 *      Render scope = (a) inside `useMemo(...)`, (b) inside
 *      `useState(...)` initialiser, (c) top-of-component-body
 *      `const x = ...`, (d) IIFE expression inside JSX.
 *      Calls inside `useEffect`, `useCallback`, event handlers
 *      (`onClick`, `onChange`, etc.), or named function declarations
 *      are SAFE — they fire after mount, never at hydration.
 *
 * What this is NOT:
 *   - An AST-perfect type checker. It's a regex/line-scope heuristic
 *     tuned to the specific bug shape we've seen. It can false-flag
 *     ornate code; the runtime Playwright crawler at
 *     `e2e/isr-hydration-crawl.spec.ts` is the empirical safety net.
 *   - A replacement for that crawler. The crawler still catches
 *     novel shapes (eg deriving from a clock-reading custom hook).
 *
 * Exit codes:
 *   0 — no violations (or, in baseline mode, no NEW violations)
 *   1 — violations found (or new ones beyond the baseline)
 *
 * Usage:
 *   npx tsx scripts/audit-isr-hydration.ts                 # full audit, fail on any
 *   npx tsx scripts/audit-isr-hydration.ts --json          # machine output
 *   npx tsx scripts/audit-isr-hydration.ts --baseline      # fail only on NEW vs baseline
 *   npx tsx scripts/audit-isr-hydration.ts --update-baseline  # snapshot current as baseline
 *
 * Pre-commit hook uses --baseline. The baseline file
 * `scripts/audit-isr-hydration.baseline.json` is checked in. As
 * existing violations are fixed, regenerate the baseline so the
 * ratchet only allows shrinking.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const APP_ROOT = path.join(process.cwd(), 'src/app/[locale]');

interface Violation {
  page: string;        // ISR page that mounts the buggy client
  client: string;      // client file with the render-time clock call
  line: number;        // 1-indexed line in `client`
  scope: 'useMemo' | 'useState-init' | 'component-body' | 'jsx-iife';
  text: string;        // offending line, trimmed
}

const BUG_PATTERN = /\btodayInTimezone\s*\(|\bnew Date\s*\(\s*\)|\bDate\.now\s*\(\s*\)/;

function listISRPages(): string[] {
  if (!fs.existsSync(APP_ROOT)) return [];
  const out: string[] = [];
  function walk(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.name === 'page.tsx') {
        const src = fs.readFileSync(full, 'utf8');
        if (!/^export const\s+revalidate\s*=/m.test(src)) continue;
        if (/^export const\s+dynamic\s*=\s*['"]force-dynamic['"]/m.test(src)) continue;
        out.push(full);
      }
    }
  }
  walk(APP_ROOT);
  return out;
}

function resolveImport(fromFile: string, relPath: string): string | null {
  const dir = path.dirname(fromFile);
  const base = path.normalize(path.join(dir, relPath));
  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function findImportedClients(pageFile: string): string[] {
  const src = fs.readFileSync(pageFile, 'utf8');
  const out: string[] = [];
  // Match `import X from '<...Client...>'` — any local path containing the
  // word `Client` in the *filename* (last segment). We treat that as the
  // signal that this is a mounted client component. Module imports are
  // skipped (they don't begin with '.' / '/').
  const re = /from\s+['"]((?:\.\.?\/[^'"]*)|(?:\/[^'"]*))['"]/g;
  for (const m of src.matchAll(re)) {
    const rel = m[1];
    const fileBase = path.basename(rel);
    if (!/Client/.test(fileBase)) continue;
    const resolved = resolveImport(pageFile, rel);
    if (resolved) out.push(resolved);
  }
  return out;
}

/**
 * Scan a client file for bug patterns at *render scope*.
 *
 * Approach: tokenise into top-level constructs by matching curly-brace
 * balance starting from known render-scope openers (`useMemo(`,
 * `useState(`, `<JSX>{(() => {`). For each opener, walk forward to its
 * matching close, and within that range flag any BUG_PATTERN line.
 * Anything inside `useEffect(`, `useCallback(`, or function declarations
 * is skipped — those fire after mount, not at hydration.
 */
function scanClient(file: string): Violation[] {
  const src = fs.readFileSync(file, 'utf8');
  const violations: Violation[] = [];

  // Quick reject: if no bug pattern anywhere, no work.
  if (!BUG_PATTERN.test(src)) return [];

  const lines = src.split('\n');

  // For each opener, find its closing brace using a simple paren/brace
  // counter that respects strings, template literals, line comments, and
  // block comments. Returns the index of the closing char.
  function findClosingBrace(start: number, open: '{' | '(', close: '}' | ')'): number {
    let depth = 0;
    let inString: string | null = null;
    let inLineComment = false;
    let inBlockComment = false;
    for (let i = start; i < src.length; i++) {
      const c = src[i];
      const next = src[i + 1];
      if (inLineComment) {
        if (c === '\n') inLineComment = false;
        continue;
      }
      if (inBlockComment) {
        if (c === '*' && next === '/') { inBlockComment = false; i++; }
        continue;
      }
      if (inString) {
        if (c === '\\') { i++; continue; }
        if (c === inString) inString = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { inString = c; continue; }
      if (c === '/' && next === '/') { inLineComment = true; i++; continue; }
      if (c === '/' && next === '*') { inBlockComment = true; i++; continue; }
      if (c === open) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function offsetToLine(off: number): number {
    let line = 1;
    for (let i = 0; i < off; i++) if (src[i] === '\n') line++;
    return line;
  }

  // Find every `useMemo(`, `useState(<initialiserWithBugPattern>)`, and
  // any IIFE `(() => { ... })()` whose body contains a bug pattern.
  type OpenerKind = Violation['scope'];
  const openers: { idx: number; kind: OpenerKind }[] = [];

  for (const m of src.matchAll(/\buseMemo\s*\(/g)) {
    openers.push({ idx: m.index! + m[0].length - 1, kind: 'useMemo' });
  }
  for (const m of src.matchAll(/\buseState\s*\(/g)) {
    openers.push({ idx: m.index! + m[0].length - 1, kind: 'useState-init' });
  }
  // IIFEs in JSX: `{(() => { ... })()}`. Capture the opener of the inner block.
  for (const m of src.matchAll(/\(\(\)\s*=>\s*\{/g)) {
    openers.push({ idx: m.index! + m[0].length - 1, kind: 'jsx-iife' });
  }

  const safeRanges: Array<[number, number]> = [];
  // Mark anything inside useEffect/useCallback as SAFE — explicitly
  // excluded from violation reports even if it contains a bug pattern.
  for (const m of src.matchAll(/\b(useEffect|useCallback)\s*\(/g)) {
    const openIdx = m.index! + m[0].length - 1;
    const close = findClosingBrace(openIdx, '(', ')');
    if (close > openIdx) safeRanges.push([openIdx, close]);
  }
  function isInSafeRange(off: number): boolean {
    return safeRanges.some(([a, b]) => off >= a && off <= b);
  }

  const seen = new Set<number>(); // dedupe by line
  for (const o of openers) {
    if (isInSafeRange(o.idx)) continue;
    const close = o.kind === 'useState-init'
      ? findClosingBrace(o.idx, '(', ')')
      : findClosingBrace(o.idx, '{', '}');
    if (close < 0) continue;
    const slice = src.slice(o.idx, close + 1);
    if (!BUG_PATTERN.test(slice)) continue;
    // Find the specific line within this slice.
    for (let i = 0; i < lines.length; i++) {
      const lineStart = src.split('\n').slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
      if (lineStart < o.idx || lineStart > close) continue;
      if (!BUG_PATTERN.test(lines[i])) continue;
      if (seen.has(i)) continue;
      seen.add(i);
      violations.push({
        page: '',
        client: file,
        line: i + 1,
        scope: o.kind,
        text: lines[i].trim(),
      });
    }
  }

  // Component-body top-level: bug pattern outside any useEffect/handler.
  // Heuristic: a `const <name> = <bugPattern>` at column 0..4 (indented
  // by component body) that we haven't already attributed to a hook.
  for (let i = 0; i < lines.length; i++) {
    if (seen.has(i)) continue;
    const ln = lines[i];
    if (!BUG_PATTERN.test(ln)) continue;
    // Skip if this line is inside a useEffect/useCallback range.
    const off = src.split('\n').slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
    if (isInSafeRange(off)) continue;
    // Component-body lines are usually indented 2 spaces. Module-level
    // (no indent) is also possible. Skip 4+ spaces (inside a function/handler).
    const indent = ln.match(/^( *)/)?.[1].length ?? 0;
    if (indent > 4) continue;
    if (!/^\s*(const|let|var)\s+\w/.test(ln)) continue;
    violations.push({
      page: '',
      client: file,
      line: i + 1,
      scope: 'component-body',
      text: ln.trim(),
    });
  }

  return violations;
}

const BASELINE_PATH = path.join(process.cwd(), 'scripts/audit-isr-hydration.baseline.json');

/** Stable key that survives unrelated line-number drift in the same file. */
function violationKey(v: Violation): string {
  // page + client + scope + normalised text. Skip line number on purpose so
  // shifting unrelated code in the same file doesn't break the ratchet.
  const norm = v.text.replace(/\s+/g, ' ');
  return `${path.relative(process.cwd(), v.page)}|${path.relative(process.cwd(), v.client)}|${v.scope}|${norm}`;
}

function loadBaseline(): Set<string> {
  if (!fs.existsSync(BASELINE_PATH)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')) as { violations: Violation[] };
    return new Set(data.violations.map(violationKey));
  } catch (err) {
    console.error('[audit-isr-hydration] failed to parse baseline:', err);
    return new Set();
  }
}

function main() {
  const jsonOut = process.argv.includes('--json');
  const baselineMode = process.argv.includes('--baseline');
  const updateBaseline = process.argv.includes('--update-baseline');

  const pages = listISRPages();
  const allViolations: Violation[] = [];

  for (const page of pages) {
    const clients = findImportedClients(page);
    for (const client of clients) {
      const v = scanClient(client);
      for (const violation of v) {
        allViolations.push({ ...violation, page });
      }
    }
  }

  if (updateBaseline) {
    fs.writeFileSync(BASELINE_PATH, JSON.stringify({ violations: allViolations }, null, 2) + '\n');
    console.log(`audit-isr-hydration: wrote ${allViolations.length} violation(s) to ${path.relative(process.cwd(), BASELINE_PATH)}`);
    process.exit(0);
  }

  if (jsonOut) {
    process.stdout.write(JSON.stringify({ violations: allViolations }, null, 2) + '\n');
    process.exit(allViolations.length === 0 ? 0 : 1);
  }

  const baseline = baselineMode ? loadBaseline() : new Set<string>();
  const newViolations = baselineMode
    ? allViolations.filter((v) => !baseline.has(violationKey(v)))
    : allViolations;

  if (newViolations.length === 0) {
    if (baselineMode) {
      console.log(`audit-isr-hydration: scanned ${pages.length} ISR pages, ${allViolations.length} total violation(s) — all in baseline, no new regressions.`);
    } else {
      console.log(`audit-isr-hydration: scanned ${pages.length} ISR pages, no render-scope clock calls detected.`);
    }
    process.exit(0);
  }

  if (baselineMode) {
    console.log(`audit-isr-hydration: ${newViolations.length} NEW render-scope clock call(s) on ISR-cached routes (not in baseline):\n`);
  } else {
    console.log(`audit-isr-hydration: ${newViolations.length} render-scope clock call(s) on ISR-cached routes:\n`);
  }

  for (const v of newViolations) {
    const pageRel = path.relative(process.cwd(), v.page);
    const clientRel = path.relative(process.cwd(), v.client);
    console.log(`  ${pageRel}`);
    console.log(`    └─ mounts ${clientRel}:${v.line}`);
    console.log(`       [${v.scope}] ${v.text}`);
    console.log();
  }
  console.log('See CLAUDE.md Lesson ZD for the three acceptable fix patterns.');
  if (baselineMode) {
    console.log('To accept a violation as expected (NOT recommended), run:');
    console.log('  npx tsx scripts/audit-isr-hydration.ts --update-baseline');
  }
  process.exit(1);
}

main();

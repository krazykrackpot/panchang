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

// `\bnew Date\s*\(\s*\)` is intentionally TIGHT — only the no-argument
// constructor reads the wall clock. `new Date(y, m, d)`, `new Date(ms)`,
// `new Date(string)` all build a deterministic Date from inputs and are
// safe at render time. Gemini suggested relaxing to `\bnew\s+Date\b` for
// `new Date` without parens, but that form is vanishingly rare in real
// code and the relaxation produced many false positives on
// `new Date(year, month, day)` constructions across the codebase.
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
        const revalMatch = src.match(/^export const\s+revalidate\s*=\s*(\d+|false)/m);
        if (!revalMatch) continue;
        // `revalidate = 0` opts the route out of caching per Next.js semantics
        // — treat it as if it were `force-dynamic` (no ISR cache → no
        // server/client hydration mismatch risk). `revalidate = false` is
        // the opposite — caches forever — which is the strongest form of
        // ISR and absolutely needs the audit.
        if (revalMatch[1] === '0') continue;
        if (/^export const\s+dynamic\s*=\s*['"]force-dynamic['"]/m.test(src)) continue;
        out.push(full);
      }
    }
  }
  walk(APP_ROOT);
  return out;
}

function resolveImport(fromFile: string, relPath: string): string | null {
  // Support both relative imports (`./X`, `../X`) and the project's `@/`
  // path alias which maps to `./src/` (see tsconfig "paths"). Missing the
  // alias case was a real false-negative source — many ISR pages import
  // their client via `@/components/...` or `@/...`, not relative paths.
  let base: string;
  if (relPath.startsWith('@/')) {
    base = path.normalize(path.join(process.cwd(), 'src', relPath.slice(2)));
  } else {
    const dir = path.dirname(fromFile);
    base = path.normalize(path.join(dir, relPath));
  }
  // If the import explicitly includes the extension (`./Client.tsx`), use
  // the path verbatim rather than appending another extension and producing
  // `Client.tsx.tsx`.
  if (fs.existsSync(base) && !fs.statSync(base).isDirectory()) {
    return base;
  }
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
  // Match relative (`./X`, `../X`), root-absolute (`/X`), and `@/`-aliased
  // imports. Bare module imports (`react`, etc.) are skipped — they don't
  // mount local client components.
  const re = /from\s+['"]((?:\.\.?\/[^'"]*)|(?:\/[^'"]*)|(?:@\/[^'"]*))['"]/g;
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

  // Pre-compute line offsets so isInSafeRange + violation line lookup are
  // O(1) per probe instead of O(N) (which would be O(N²) overall on big
  // files like kundali/Client.tsx).
  const lineOffsets: number[] = [];
  {
    let acc = 0;
    for (const line of lines) {
      lineOffsets.push(acc);
      acc += line.length + 1;
    }
  }

  // Binary-search the line index containing a given char offset. Both
  // arguments and result are 0-indexed.
  function lineForOffset(off: number): number {
    let lo = 0;
    let hi = lineOffsets.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineOffsets[mid] <= off) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }

  // Find every `useMemo(`, `useState(<initialiserWithBugPattern>)`, and
  // any IIFE `(() => { ... })()` whose body contains a bug pattern.
  type OpenerKind = Violation['scope'];
  const openers: { idx: number; kind: OpenerKind }[] = [];

  // `(?:<[^>]+>)?` matches an optional generic type parameter, eg
  // `useState<Date | null>(...)` or `useMemo<string>(...)`. Without it,
  // every typed hook call was completely invisible to the scanner.
  for (const m of src.matchAll(/\buseMemo\s*(?:<[^>]+>)?\s*\(/g)) {
    openers.push({ idx: m.index! + m[0].length - 1, kind: 'useMemo' });
  }
  for (const m of src.matchAll(/\buseState\s*(?:<[^>]+>)?\s*\(/g)) {
    openers.push({ idx: m.index! + m[0].length - 1, kind: 'useState-init' });
  }
  // IIFEs in JSX: `{(() => { ... })()}`. Capture the opener of the inner block.
  for (const m of src.matchAll(/\(\(\)\s*=>\s*\{/g)) {
    openers.push({ idx: m.index! + m[0].length - 1, kind: 'jsx-iife' });
  }

  // Lines that fall inside a useEffect / useCallback body — those run
  // after mount, never at hydration, so any clock call there is safe.
  // We track LINE ranges rather than offset ranges because a single-line
  // `useEffect(() => { ... new Date() ... }, [])` has its bug-pattern
  // line start BEFORE the opener char; an offset-based test would mark
  // the line outside the safe range and falsely flag it.
  const safeLineRanges: Array<[number, number]> = [];
  for (const m of src.matchAll(/\b(useEffect|useCallback)\s*(?:<[^>]+>)?\s*\(/g)) {
    const openIdx = m.index! + m[0].length - 1;
    const close = findClosingBrace(openIdx, '(', ')');
    if (close > openIdx) safeLineRanges.push([lineForOffset(openIdx), lineForOffset(close)]);
  }
  function isSafeLine(lineIdx: number): boolean {
    return safeLineRanges.some(([a, b]) => lineIdx >= a && lineIdx <= b);
  }

  const seen = new Set<number>(); // dedupe by line
  for (const o of openers) {
    if (isSafeLine(lineForOffset(o.idx))) continue;
    // useMemo / useState / useCallback are function calls — balance their
    // parens. Without this `useMemo(() => new Date(), [])` (arrow with
    // implicit return — no `{`) returned -1 and fell through to the
    // loose component-body bucket. Now correctly bucketed as 'useMemo'.
    // IIFE openers were matched at their inner `{` so they still want
    // brace balancing.
    const close = (o.kind === 'useMemo' || o.kind === 'useState-init')
      ? findClosingBrace(o.idx, '(', ')')
      : findClosingBrace(o.idx, '{', '}');
    if (close < 0) continue;
    const slice = src.slice(o.idx, close + 1);
    if (!BUG_PATTERN.test(slice)) continue;
    // Find the line range that the opener's body spans. Inclusive of the
    // opener line itself even when the body is single-line — the previous
    // `lineStart < o.idx → skip` check excluded the same line as the
    // opener, which made single-line `useMemo(() => new Date(), [])` fall
    // through to the loose component-body bucket.
    const startLine = lineForOffset(o.idx);
    const endLine = lineForOffset(close);
    for (let i = startLine; i <= endLine; i++) {
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
    if (isSafeLine(i)) continue;
    // Component-body lines are usually indented 2 spaces. Module-level
    // (no indent) is also possible. Skip 4+ spaces (inside a function/
    // handler). This is a HEURISTIC with two known limits:
    //   - False negative on files that use 4-space indent throughout, or
    //     when the component is wrapped in `React.memo(...)` / `forwardRef`
    //     etc. which add an extra level of nesting at the body.
    //   - False positive on event handlers / helpers whose body sits at
    //     ≤4 spaces (rare but possible in flat layouts).
    // The runtime crawler at e2e/isr-hydration-crawl.spec.ts is the
    // empirical safety net for both. If false positives become noisy,
    // adjust this threshold OR switch the scanner to a proper TS AST
    // (ts-morph) — that would eliminate the heuristic entirely.
    const indent = ln.match(/^( *)/)?.[1].length ?? 0;
    if (indent > 4) continue;
    // Negative filter: skip obvious non-render sites. Comments + imports
    // shouldn't be flagged; everything else with a bug pattern at this
    // indent should. This is broader than the previous "var-decl or JSX"
    // gate — it catches direct returns (`return new Date()`),
    // multi-line assignments where the clock call lives on a continuation,
    // and bare expressions. BUG_PATTERN is the strong filter, so this
    // stays high-precision in practice.
    if (/^\s*(\/\/|\/\*|\*|import\b)/.test(ln)) continue;
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
  // page/client are already cwd-relative (see main()), no need to relativise.
  const norm = v.text.replace(/\s+/g, ' ');
  return `${v.page}|${v.client}|${v.scope}|${norm}`;
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

  // Normalise paths to cwd-relative so the baseline file is portable
  // across machines and CI. Without this, the baseline would bake
  // `/Users/<dev>/...` and fail every CI run on a fresh checkout.
  for (const page of pages) {
    const clients = findImportedClients(page);
    for (const client of clients) {
      const v = scanClient(client);
      for (const violation of v) {
        allViolations.push({
          ...violation,
          page: path.relative(process.cwd(), page),
          client: path.relative(process.cwd(), client),
        });
      }
    }
  }

  // Sort for deterministic output — fs.readdirSync order varies by
  // filesystem, so without this the baseline file would drift across
  // machines and produce noisy git diffs.
  allViolations.sort((a, b) => {
    if (a.client !== b.client) return a.client < b.client ? -1 : 1;
    if (a.line !== b.line) return a.line - b.line;
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  });

  if (updateBaseline) {
    fs.writeFileSync(BASELINE_PATH, JSON.stringify({ violations: allViolations }, null, 2) + '\n');
    console.log(`audit-isr-hydration: wrote ${allViolations.length} violation(s) to ${path.relative(process.cwd(), BASELINE_PATH)}`);
    process.exit(0);
  }

  const baseline = baselineMode ? loadBaseline() : new Set<string>();
  const newViolations = baselineMode
    ? allViolations.filter((v) => !baseline.has(violationKey(v)))
    : allViolations;

  if (jsonOut) {
    // In --baseline mode emit only NEW violations so consumers (CI bots,
    // editors) can act on the actionable set without re-filtering.
    process.stdout.write(JSON.stringify({ violations: newViolations }, null, 2) + '\n');
    process.exit(newViolations.length === 0 ? 0 : 1);
  }

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

  // page/client are already cwd-relative (see main()).
  for (const v of newViolations) {
    console.log(`  ${v.page}`);
    console.log(`    └─ mounts ${v.client}:${v.line}`);
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

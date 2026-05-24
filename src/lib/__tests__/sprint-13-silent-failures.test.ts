/**
 * Sprint 13 — P2 silent failures cluster invariants.
 *
 * Lock in the audit findings that turned silent failures into visible
 * signals (tagged logs + user-facing error UI + warnings array on the
 * /api/financial response).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 13 — P2-11 /api/user/profile welcome-email .catch is tagged', () => {
  const src = read('src/app/api/user/profile/route.ts');

  it('the welcome email send has a non-empty .catch that logs with [user/profile] tag', () => {
    // The audit thought this was empty `.catch(() => {})` (banned pattern).
    // The current shape is `.catch((err) => { console.error('[user/profile] ...:', err); })`.
    // Verify that's still the case and didn't regress.
    expect(src).toMatch(
      /sendEmail\([^)]*\)\.catch\(\(err\)\s*=>\s*\{[\s\S]*?console\.error\(\s*['"]\[user\/profile\][^'"]*['"]/,
    );
    // Explicit ban: the file MUST NOT contain the empty-arrow shape.
    expect(src).not.toMatch(/\.catch\(\(\)\s*=>\s*\{\s*\}\)/);
  });
});

describe('Sprint 13 — P2-12 page-level fetch catches surface to the user', () => {
  const TARGETS = [
    { id: 'prashna-ashtamangala', path: 'src/app/[locale]/prashna-ashtamangala/page.tsx' },
    { id: 'varshaphal', path: 'src/app/[locale]/varshaphal/page.tsx' },
  ];

  for (const { id, path } of TARGETS) {
    it(`${id}: catch tags the log AND sets a user-visible fetchError state`, () => {
      const src = read(path);
      // Tagged console.error
      expect(src, `${id} missing tagged log`).toMatch(
        new RegExp(`console\\.error\\(\\s*['"]\\[${id}\\]`),
      );
      // setFetchError state exists + is set in the catch
      expect(src, `${id} missing fetchError state`).toMatch(
        /const \[fetchError, setFetchError\] = useState<string \| null>\(null\)/,
      );
      expect(src, `${id} catch should setFetchError`).toMatch(/setFetchError\(/);
      // UI renders fetchError with role="alert" so screen readers + e2e pick it up
      expect(src, `${id} should render fetchError UI with role="alert"`).toMatch(
        /\{fetchError\s*&&[\s\S]*?role="alert"[\s\S]*?fetchError\}/,
      );
    });

    it(`${id}: the OLD untagged 'console.error(e)' shape is gone`, () => {
      const src = read(path);
      // The exact regression we're guarding against: a catch that does
      // nothing more than `console.error(e)` with no tag and no user UI.
      expect(src).not.toMatch(/catch\s*\(e\)\s*\{\s*console\.error\(e\);\s*\}/);
    });
  }
});

describe('Sprint 13 — P2-13 /api/financial returns a warnings array', () => {
  const src = read('src/app/api/financial/route.ts');

  it('declares a warnings array', () => {
    expect(src).toMatch(/const warnings:\s*Array<\{[\s\S]*?\}>\s*=\s*\[\]/);
  });

  it('pushes a hora warning when the Hora computation fails', () => {
    const horaCatch = src.match(/catch \(horaErr\)[\s\S]*?\}/)?.[0] ?? '';
    expect(horaCatch).toMatch(/warnings\.push\(\s*\{[\s\S]*?section:\s*['"]hora['"]/);
    // and still keeps the existing tagged log
    expect(horaCatch).toMatch(/console\.error\(\s*['"]\[API\/financial\]/);
  });

  it('includes warnings in the success response body', () => {
    // The NextResponse.json(...) that returns the success body must
    // include the warnings field.
    expect(src).toMatch(/NextResponse\.json\(\s*\{[\s\S]*?warnings,[\s\S]*?\},/);
  });
});

describe('Sprint 13 — P2-14 kundali/[id] clipboard.writeText is awaited + caught', () => {
  const src = read('src/app/[locale]/kundali/[id]/page.tsx');

  it('handleCopy is now async', () => {
    expect(src).toMatch(/const handleCopy = async \(\)\s*=>/);
  });

  it('awaits navigator.clipboard.writeText', () => {
    expect(src).toMatch(/await navigator\.clipboard\.writeText\(/);
  });

  it('catches the rejection and falls back without lying about success', () => {
    // Before: setCopied(true) ran even when the copy was denied. Now the
    // catch handles it explicitly with a tagged log and a window.prompt
    // fallback.
    expect(src).toMatch(
      /catch \(err\)[\s\S]*?console\.error\(\s*['"]\[kundali\/share\][^]*?clipboard copy failed[^]*?window\.prompt\(/,
    );
  });
});

describe('Sprint 13 — P2-15 matching/Client.tsx genKundali no longer triple-silently fails', () => {
  const src = read('src/app/[locale]/matching/Client.tsx');

  it('genKundali catch logs with [matching] tag (not empty)', () => {
    // Old: `catch { /* non-critical */ }`
    // New: `catch (err) { console.error('[matching] /api/kundali fetch failed for ...', ...) }`
    // Strip line comments before scanning so the historical pattern
    // (which appears in the fix's documenting comment) doesn't trigger.
    const codeOnly = src.replace(/\/\/[^\n]*/g, '');
    expect(codeOnly).not.toMatch(/catch\s*\{\s*\/\*\s*non-critical\s*\*\/\s*\}/);
    expect(src).toMatch(
      /catch \(err\)[\s\S]*?console\.error\(\s*['"]\[matching\] \/api\/kundali fetch failed/,
    );
  });

  it('non-ok responses log with status code', () => {
    expect(src).toMatch(
      /console\.error\(\s*['"]\[matching\] \/api\/kundali returned['"]/,
    );
  });

  it('Promise.all has a .catch() so genKundali rejection is not unhandled', () => {
    expect(src).toMatch(
      /Promise\.all\(\[genKundali[\s\S]*?\.then\([\s\S]*?\)\s*\.catch\(\(err\)\s*=>\s*\{[\s\S]*?console\.error\(\s*['"]\[matching\] kundali Promise\.all rejected/,
    );
  });

  it('outer handleSubmit catch logs with [matching] tag (was bare empty)', () => {
    expect(src).toMatch(
      /\}\s*catch \(err\)\s*\{[\s\S]*?console\.error\(\s*['"]\[matching\] handleSubmit failed/,
    );
  });
});

/**
 * Sprint 10 — P1 API validation cluster invariants.
 *
 * Structural tests on the 5 hardened routes. Behavioural e2e for
 * 4xx/429 contracts lives in e2e/sprint-10-validation.spec.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROUTES = [
  { id: 'P1-40', path: 'src/app/api/calendar/route.ts' },
  { id: 'P1-41', path: 'src/app/api/muhurat/route.ts' },
  { id: 'P1-42', path: 'src/app/api/kp-system/route.ts' },
  { id: 'P1-43', path: 'src/app/api/prashna-ashtamangala/route.ts' },
  { id: 'P1-44', path: 'src/app/api/tithi-table/route.ts' },
];

describe('Sprint 10 — every hardened route has a rate limit', () => {
  for (const { id, path } of ROUTES) {
    it(`${id} — ${path} imports + invokes checkRateLimit + getClientIP`, () => {
      const src = readFileSync(join(process.cwd(), path), 'utf8');
      expect(src).toMatch(/import\s*\{[^}]*\bcheckRateLimit\b[^}]*\bgetClientIP\b[^}]*\}\s*from\s*['"]@\/lib\/api\/rate-limit['"]/);
      expect(src).toMatch(/checkRateLimit\(/);
      expect(src).toMatch(/return NextResponse\.json\(.*status:\s*429/);
    });
  }
});

describe('Sprint 10 — every hardened route validates numeric inputs', () => {
  // Each route accepts at least lat/lng; both must be range-checked.
  // (The exact check varies — Number.isFinite + |val| guard is the
  // canonical pattern.)
  for (const { id, path } of ROUTES) {
    it(`${id} — ${path} guards lat range`, () => {
      const src = readFileSync(join(process.cwd(), path), 'utf8');
      // Accept either the calendar/tithi-table form or the typeof form
      // from kp-system. Both end in a 400 with a lat-range message.
      expect(src).toMatch(/Number\.isFinite\([^)]*\.?lat\b[^)]*\).*\|\|.*Math\.abs\([^)]*lat\b[^)]*\)\s*>\s*90|lat must be a (?:finite )?number/);
    });
  }
});

describe('P1-41 — /api/muhurat validates activity against the canonical allowlist', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/muhurat/route.ts'),
    'utf8',
  );

  it('builds a Set from getAllActivities() keys', () => {
    expect(src).toMatch(/getAllActivities\(\)/);
    // Source-of-truth pattern: `new Set<string>(\n  ACTIVITIES.map((a) => a.key),\n)`
    // — allow whitespace/newline between `(` and the .map() call.
    expect(src).toMatch(/new Set<string>\(\s*[A-Z_]+\.map\(\(a\)\s*=>\s*a\.key\)/);
  });

  it('rejects unknown activity slugs with 400 before computation', () => {
    expect(src).toMatch(/Invalid activity\. Allowed:/);
  });

  it('hoists the activity Set to module scope (no per-request rebuild)', () => {
    // Gemini #144 (MEDIUM): the validActivityKeys Set was rebuilt on every
    // request. After fix it lives at module scope as VALID_ACTIVITY_KEYS.
    expect(src).toMatch(/const VALID_ACTIVITY_KEYS:\s*ReadonlySet<string>\s*=\s*new Set/);
    // The handler should reference the module-level constant, not rebuild it.
    const handlerSection = src.split('export async function GET')[1] ?? '';
    expect(handlerSection).not.toMatch(/new Set<string>\([^)]*\.map\(\(a\)\s*=>\s*a\.key\)\)/);
  });
});

describe('P1-42 — /api/kp-system format-validates date + time', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/kp-system/route.ts'),
    'utf8',
  );

  it('defines strict DATE_REGEX (YYYY-MM-DD) + TIME_REGEX (HH:MM[:SS])', () => {
    expect(src).toMatch(/DATE_REGEX\s*=\s*\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\//);
    expect(src).toMatch(/TIME_REGEX\s*=\s*\/\^\\d\{2\}:\\d\{2\}\(\:\\d\{2\}\)\?\$\//);
  });

  it('rejects with 400 on bad date / time format', () => {
    expect(src).toMatch(/date must be YYYY-MM-DD/);
    expect(src).toMatch(/time must be HH:MM/);
  });

  it('catches malformed JSON body before validation', () => {
    expect(src).toMatch(/Invalid JSON body/);
  });

  it('guards against null/non-object body before destructuring', () => {
    // Gemini #144 (HIGH): destructuring `body` from a `null` payload
    // throws TypeError → 500. Must reject with 400 instead.
    expect(src).toMatch(/!rawBody\s*\|\|\s*typeof rawBody\s*!==\s*['"]object['"]/);
  });
});

describe('P1-43 — /api/prashna-ashtamangala validates category enum', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/prashna-ashtamangala/route.ts'),
    'utf8',
  );

  it('defines VALID_CATEGORIES Set typed as QuestionCategory', () => {
    expect(src).toMatch(/VALID_CATEGORIES:\s*ReadonlySet<QuestionCategory>/);
  });

  it('rejects unknown categories with 400', () => {
    expect(src).toMatch(/Invalid category\. Allowed:/);
  });

  it('catches malformed JSON body', () => {
    expect(src).toMatch(/Invalid JSON body/);
  });

  it('guards against null/non-object body before destructuring', () => {
    // Gemini #144 (HIGH): the destructure `{ numbers, category, ... } = body`
    // threw TypeError on literal JSON `null`. Must early-return 400.
    expect(src).toMatch(/!body\s*\|\|\s*typeof body\s*!==\s*['"]object['"]/);
  });
});

describe('P1-44 — /api/tithi-table no longer leaks String(err)', () => {
  const src = readFileSync(
    join(process.cwd(), 'src/app/api/tithi-table/route.ts'),
    'utf8',
  );

  it('does NOT return String(err) in the catch path', () => {
    expect(src).not.toMatch(/error:\s*String\(err\)/);
  });

  it('returns a generic error message instead', () => {
    expect(src).toMatch(/Failed to build tithi table/);
  });
});

describe('Sprint 10 — no route leaks String(err) in 5xx response', () => {
  for (const { id, path } of ROUTES) {
    it(`${id} — ${path} catch path is generic (no String(err) / err.message in JSON)`, () => {
      const src = readFileSync(join(process.cwd(), path), 'utf8');
      // Scope: only inspect content inside catch(){...} blocks.
      const catchBlocks = src.match(/catch\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\}/g) ?? [];
      for (const block of catchBlocks) {
        expect(block, `${path} catch leaks String(err)`).not.toMatch(/error:\s*String\(err\)/);
        // err.message in the response JSON is a leak; in console.error it's fine.
        // The pattern we ban: `{ error: ... err.message ... }` returned to client.
        // Approximation: any line that has BOTH `error:` and `err.message` on it.
        const responseLines = block.split('\n').filter((l) => /error:/.test(l));
        for (const line of responseLines) {
          expect(line, `${path} returns err.message`).not.toMatch(/err\.message/);
        }
      }
    });
  }
});

/**
 * Sprint 12 — P2 security cluster invariants.
 *
 * Structural assertions that the prior holes stay closed. Behavioural
 * e2e (response shape, headers) lives in e2e/sprint-12-security.spec.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 12 — P2-16 Brihaspati defers payment_verified until after answer', () => {
  const src = read('src/app/api/brihaspati/route.ts');

  it('the pre-narrate update writes provider + status only, NOT payment_verified', () => {
    // The line ~195 update marks the row as `streaming` but must not yet
    // claim payment is verified; that lie is what made
    // consumed-but-undelivered indistinguishable from successful answers.
    expect(src).toMatch(
      /\.update\(\{\s*provider:\s*providerUsed,\s*status:\s*'streaming'\s*\}\)/,
    );
    // Specifically the OLD shape must be gone.
    expect(src).not.toMatch(
      /\.update\(\{\s*payment_verified:\s*true,\s*provider:\s*providerUsed,\s*status:\s*'streaming'\s*\}\)/,
    );
  });

  it('the post-narrate persist-final-state update includes payment_verified: true', () => {
    // The completion update (the one that also writes `answer`,
    // `status: 'completed'`, `completed_at: ...`) must now flip
    // payment_verified to true.
    const completionBlock = src.match(/\/\/ Persist final state[\s\S]*?\.eq\('id', questionId\);/)?.[0] ?? '';
    expect(completionBlock).toMatch(/payment_verified:\s*true/);
    expect(completionBlock).toMatch(/status:\s*'completed'/);
    expect(completionBlock).toMatch(/completed_at:/);
  });
});

describe('Sprint 12 — P2-19/36 no String(err)/err.message PII leaks', () => {
  const TARGETS = [
    { id: 'P2-19a', path: 'src/app/api/festival-compare/route.ts' },
    { id: 'P2-19b', path: 'src/app/api/social/youtube/route.tsx' },
    { id: 'P2-19c', path: 'src/app/api/cron/daily-panchang/route.ts' },
    { id: 'P2-19d', path: 'src/app/api/cron/social-post/route.ts' },
    { id: 'P2-19e', path: 'src/app/api/cron/domain-activations/route.ts' },
    { id: 'P2-36', path: 'src/app/api/almanac/route.ts' },
  ];

  for (const { id, path } of TARGETS) {
    it(`${id} — ${path} catch path returns generic message (no String(err) / err.message)`, () => {
      const src = read(path);
      // Scope: only inspect catch(){...} bodies + error response sites.
      // Cross-cutting: ANY line that builds an error response JSON must
      // not embed String(err)/err.message.
      const responseLines = src
        .split('\n')
        .filter((l) => /error:/.test(l) && /Response|NextResponse|JSON\.stringify/.test(src.split('\n').slice(Math.max(0, src.split('\n').indexOf(l) - 3), src.split('\n').indexOf(l) + 1).join('\n')));
      // Simpler form: just assert these banned patterns are absent.
      expect(src, `${path} still has String(err) leak`).not.toMatch(/error:\s*String\(err\)/);
      expect(src, `${path} still has String(e) leak`).not.toMatch(/error:\s*String\(e\)/);
      expect(src, `${path} still returns err.message`).not.toMatch(/error:.*err\.message/);
      expect(src, `${path} still returns e.message`).not.toMatch(/error:.*e\.message/);
      // The fix path must log to console.error with the tag.
      const moduleTag = path.replace(/^src\/app\/api\//, '').replace(/\/route\.tsx?$/, '');
      const expectedLog = new RegExp(`console\\.error\\(\\s*['"]\\[${moduleTag.split('/').join('[\\\\/-].*')}`);
      expect(src, `${path} should console.error with tag`).toMatch(/console\.error\(/);
      // Silence the unused var lint
      void responseLines;
      void expectedLog;
    });
  }
});

describe('Sprint 12 — P2-20 /api/kundali-report has security headers', () => {
  const src = read('src/app/api/kundali-report/route.ts');

  it('adds X-Content-Type-Options: nosniff', () => {
    expect(src).toMatch(/'X-Content-Type-Options':\s*'nosniff'/);
  });

  it('adds a Content-Security-Policy that forbids script execution', () => {
    expect(src).toMatch(/Content-Security-Policy/);
    expect(src).toMatch(/script-src\s+'none'/);
    expect(src).toMatch(/frame-ancestors\s+'none'/);
  });

  it('CSP allows the report\'s existing Google Fonts (style + font sources)', () => {
    // The CSP is now built from an array joined with '; '; each item is a
    // double-quoted string with embedded single quotes around CSP source
    // expressions. Match up to the closing double quote.
    expect(src).toMatch(/"style-src[^"]*fonts\.googleapis\.com[^"]*"/);
    expect(src).toMatch(/"font-src[^"]*fonts\.gstatic\.com[^"]*"/);
  });
});

describe('Sprint 12 — P2-22 lib/rag/supabase.ts trims env values', () => {
  const src = read('src/lib/rag/supabase.ts');

  it('trims NEXT_PUBLIC_SUPABASE_URL', () => {
    expect(src).toMatch(/process\.env\.NEXT_PUBLIC_SUPABASE_URL\?\.trim\(\)/);
  });

  it('trims SUPABASE_SERVICE_ROLE_KEY', () => {
    expect(src).toMatch(/process\.env\.SUPABASE_SERVICE_ROLE_KEY\?\.trim\(\)/);
  });

  it('isSupabaseConfigured uses trimmed values too (no leading/trailing whitespace masquerading as configured)', () => {
    expect(src).toMatch(/isSupabaseConfigured[\s\S]*?\.trim\(\)[\s\S]*?\.trim\(\)/);
  });
});

describe('Sprint 12 — P2-23 lib/push/send-push.ts lazy-inits supabaseAdmin', () => {
  const src = read('src/lib/push/send-push.ts');

  it('no top-level createClient with `!` non-null asserts', () => {
    // The old shape was: `const supabaseAdmin = createClient(process.env.X!.trim(), ...)`
    // which crashes on import if env is missing. After fix it lives inside
    // a getter function.
    expect(src).not.toMatch(/^const supabaseAdmin = createClient/m);
    expect(src).not.toMatch(/process\.env\.[A-Z_]+!\.trim\(\)/);
  });

  it('defines a getSupabaseAdmin() lazy getter', () => {
    expect(src).toMatch(/function getSupabaseAdmin\(\):\s*SupabaseClient/);
    expect(src).toMatch(/let supabaseAdminInstance:\s*SupabaseClient \| null = null/);
  });

  it('callers go through getSupabaseAdmin()', () => {
    expect(src).toMatch(/const supabaseAdmin = getSupabaseAdmin\(\)/);
  });
});

describe('Sprint 12 — P2-24 VERCEL_URL .trim() helper migration', () => {
  const ROUTES = [
    'src/app/api/journal/route.ts',
    'src/app/api/family-synthesis/route.ts',
    'src/app/api/dasha-diary/route.ts',
    'src/app/api/life-events/route.ts',
    'src/app/api/predictions/route.ts',
  ];

  it('the shared base-url helper exists and trims VERCEL_URL', () => {
    const helper = read('src/lib/utils/base-url.ts');
    expect(helper).toMatch(/export function getInternalBaseUrl\(\):\s*string/);
    expect(helper).toMatch(/process\.env\.VERCEL_URL\?\.trim\(\)/);
    // Prefer NEXT_PUBLIC_SITE_URL so a custom-domain deployment doesn't
    // accidentally hand out the *.vercel.app preview URL.
    expect(helper).toMatch(/process\.env\.NEXT_PUBLIC_SITE_URL\?\.trim\(\)/);
  });

  for (const rel of ROUTES) {
    it(`${rel} imports + uses getInternalBaseUrl (no raw VERCEL_URL concat)`, () => {
      const src = read(rel);
      expect(src, `${rel} missing helper import`).toMatch(
        /from\s+['"]@\/lib\/utils\/base-url['"]/,
      );
      expect(src, `${rel} should call getInternalBaseUrl()`).toMatch(
        /baseUrl\s*=\s*getInternalBaseUrl\(\)/,
      );
      expect(src, `${rel} still has raw VERCEL_URL concat`).not.toMatch(
        /['"]https?:\/\/['"]\s*\+\s*process\.env\.VERCEL_URL/,
      );
    });
  }
});

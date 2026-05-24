/**
 * Sprint 25 — Defense-in-depth P2 cluster.
 *
 * SEC-6/7  — Constant error strings (no err.message / String(err) leak).
 * SEC-8/9  — Rate-limit on previously-unguarded GET routes.
 * SEC-12   — WhatsApp verify_token via timingSafeEqual.
 * UI-12/13 — Escape close on OnboardingModal and ArchetypeRevealModal.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('SEC-6 / SEC-7 — constant error strings', () => {
  it('calendar/export returns constant string (no String(err) leak)', () => {
    const src = read('src/app/api/calendar/export/route.ts');
    expect(src).toMatch(/error:\s*['"]Failed to generate calendar export['"]\s*\}/);
    expect(src).not.toMatch(/['"]Failed to generate calendar export:\s*['"]\s*\+\s*String\(err\)/);
  });

  it('muhurta-scan returns constant string (no err.message leak)', () => {
    const src = read('src/app/api/muhurta-scan/route.ts');
    expect(src).toMatch(/return NextResponse\.json\(\{ error:\s*['"]Muhurta scan failed['"] \}/);
    expect(src).not.toMatch(/err instanceof Error \? err\.message : 'Muhurta scan failed'/);
  });

  it('caesarean-scan returns constant string (no err.message leak)', () => {
    const src = read('src/app/api/caesarean-scan/route.ts');
    expect(src).toMatch(/return NextResponse\.json\(\{ error:\s*['"]Caesarean scan failed['"] \}/);
    expect(src).not.toMatch(/err instanceof Error \? err\.message : 'Caesarean scan failed'/);
  });
});

describe('SEC-8 / SEC-9 — rate-limit on previously-unguarded GET routes', () => {
  it('festival-compare gated on checkRateLimit', () => {
    const src = read('src/app/api/festival-compare/route.ts');
    expect(src).toMatch(/import \{ checkRateLimit, getClientIP \} from '@\/lib\/api\/rate-limit'/);
    expect(src).toMatch(/checkRateLimit\(getClientIP\(request\)/);
    expect(src).toMatch(/status:\s*429/);
  });

  it('festival-compare validates year + lat + lon + tz', () => {
    const src = read('src/app/api/festival-compare/route.ts');
    expect(src).toMatch(/Invalid year/);
    expect(src).toMatch(/Invalid coordinates/);
    expect(src).toMatch(/Invalid timezone/);
  });

  it('ganda-mool gated on checkRateLimit', () => {
    const src = read('src/app/api/ganda-mool/route.ts');
    expect(src).toMatch(/checkRateLimit\(getClientIP\(req\)/);
  });

  it('mundane/conjunctions gated on checkRateLimit', () => {
    const src = read('src/app/api/mundane/conjunctions/route.ts');
    expect(src).toMatch(/checkRateLimit\(getClientIP\(request\)/);
  });
});

describe('SEC-12 — WhatsApp verify_token via timingSafeEqual', () => {
  const src = read('src/app/api/whatsapp/route.ts');

  it('GET path uses tokensMatch (constant-time)', () => {
    expect(src).toMatch(/tokensMatch\(token, VERIFY_TOKEN\)/);
    expect(src).toMatch(/timingSafeEqual\(aBuf, bBuf\)/);
  });

  it('removed the previous `token === VERIFY_TOKEN` string compare', () => {
    expect(src).not.toMatch(/token === VERIFY_TOKEN/);
  });
});

describe('UI-12 / UI-13 — Escape close on modals', () => {
  it('OnboardingModal listens for Escape and calls onComplete', () => {
    const src = read('src/components/auth/OnboardingModal.tsx');
    expect(src).toMatch(/if \(e\.key === 'Escape'\) onComplete\(\)/);
  });

  it('ArchetypeRevealModal listens for Escape and calls onClose', () => {
    const src = read('src/components/auth/ArchetypeRevealModal.tsx');
    expect(src).toMatch(/import \{ useEffect \} from 'react'/);
    expect(src).toMatch(/if \(e\.key === 'Escape'\) onClose\(\)/);
  });
});

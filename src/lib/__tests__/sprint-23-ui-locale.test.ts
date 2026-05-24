/**
 * Sprint 23 — UI wiring + dead pages + chrome locale.
 *
 * Structural tests for the 7 UI/locale fixes shipped this sprint:
 *   UI-1, UI-2, UI-3, UI-4 — dead pages get redirects + footer links
 *   UI-5 — BirthForm prefill guard
 *   UI-6 — Pricing currency from coords/location, not browser TZ
 *   UI-7 — not-found.tsx renders in user's locale
 *   UI-11 — AuthModal localised across 8 locales
 *   UI-14 — Tamil string removed from EN-block in profile/page
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('UI-1 / UI-3 — Dead-page redirects in next.config.ts', () => {
  const src = read('next.config.ts');

  it('/path → /sadhaka-path (301)', () => {
    expect(src).toMatch(/source:\s*['"]\/:locale\/path['"]/);
    expect(src).toMatch(/destination:\s*['"]\/:locale\/sadhaka-path['"]/);
  });

  it('/embed-demo → /widget (301)', () => {
    expect(src).toMatch(/source:\s*['"]\/:locale\/embed-demo['"]/);
    expect(src).toMatch(/destination:\s*['"]\/:locale\/widget['"]/);
  });
});

describe('UI-2 / UI-3 / UI-4 — Footer links for orphan pages', () => {
  const src = read('src/components/layout/Footer.tsx');

  it('footer links to /vrat-calendar', () => {
    expect(src).toContain("href: '/vrat-calendar'");
  });

  it('footer links to /daily', () => {
    expect(src).toContain("href: '/daily'");
  });

  it('footer links to /widget (in bottom-bar legal/utility row)', () => {
    expect(src).toContain('href="/widget"');
  });
});

describe('UI-5 — BirthForm prefill guard strengthened', () => {
  const src = read('src/components/kundali/BirthForm.tsx');

  it('guards on relationship/date/lat in addition to name', () => {
    expect(src).toMatch(/initialData\?\.relationship/);
    expect(src).toMatch(/initialData\?\.date/);
    expect(src).toMatch(/initialData\?\.lat !== undefined/);
  });
});

describe('UI-6 — Pricing currency derived from coords, not browser TZ', () => {
  const src = read('src/app/[locale]/pricing/page.tsx');

  it('uses location store timezone + lat/lng bounds, not browser Intl', () => {
    expect(src).toMatch(/loc\.timezone/);
    expect(src).toMatch(/inIndiaBounds/);
    // The previous Intl.DateTimeFormat fallback is gone from the
    // currency-init block.
    expect(src).not.toMatch(/tz\s*=\s*useLocationStore[\s\S]{0,80}Intl\.DateTimeFormat/);
  });
});

describe('UI-7 — not-found.tsx localised', () => {
  const src = read('src/app/[locale]/not-found.tsx');

  it('uses useLocale + a COPY map for 8 locales', () => {
    expect(src).toMatch(/import \{ useLocale \} from 'next-intl'/);
    expect(src).toMatch(/const COPY: Record<Locale, NotFoundCopy>/);
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai']) {
      expect(src).toMatch(new RegExp(`^\\s*${loc}:`, 'm'));
    }
  });

  it('falls back to en on unknown locale (Lesson J)', () => {
    expect(src).toMatch(/COPY\[locale\] \?\? COPY\.en/);
  });

  it('no hardcoded English headings (only inside the COPY map)', () => {
    // Body shouldn't have a raw <h1>Page Not Found</h1> any more.
    expect(src).not.toMatch(/<h1[\s\S]{0,200}Page Not Found</);
  });
});

describe('UI-11 — AuthModal localised', () => {
  const src = read('src/components/auth/AuthModal.tsx');

  it('imports useLocale and applies COPY map', () => {
    expect(src).toMatch(/import \{ useLocale \} from 'next-intl'/);
    expect(src).toMatch(/const COPY: Record<Locale, AuthCopy>/);
  });

  it('all 8 visible locales have entries', () => {
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai']) {
      expect(src).toMatch(new RegExp(`^\\s+${loc}:\\s*\\{`, 'm'));
    }
  });

  it('no hardcoded English button labels remain', () => {
    expect(src).not.toMatch(/>\s*Continue with Google\s*</);
    expect(src).not.toMatch(/Loading\.\.\.[\s\S]{0,20}:\s*mode === 'login'/);
  });

  it('falls back to en on unknown locale (Lesson J)', () => {
    expect(src).toMatch(/COPY\[locale\] \?\? COPY\.en/);
  });
});

describe('UI-14 — Profile EN block no longer contains Tamil string', () => {
  const src = read('src/app/[locale]/profile/page.tsx');

  it('addBirthData in EN block is English', () => {
    expect(src).toMatch(/addBirthData:\s*'Add Birth Details'/);
  });
});

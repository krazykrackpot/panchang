/**
 * Sprint 29 — Round 3 UI chrome + locale residual.
 *
 * R3-UI-2  — RouteError + error.tsx localised across 8 locales
 * R3-UI-4  — 5 client pages surface Supabase errors (settings,
 *            horoscope/HubClient, sign-calculator, baby-names,
 *            dashboard/saved-charts)
 * R3-UI-7  — PanchangClient visible fetchError banner + retry
 * R3-UI-13 — UserMenu chrome localised (Sign In / My Profile /
 *            Settings / Sign Out across 8 locales)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('R3-UI-2 — error boundaries localised', () => {
  it('RouteError.tsx has a Locale union + COPY map + EN fallback', () => {
    const src = read('src/components/ui/RouteError.tsx');
    expect(src).toMatch(/type Locale =/);
    expect(src).toMatch(/const COPY: Record<Locale, ErrorCopy>/);
    expect(src).toMatch(/COPY\[locale\] \?\? COPY\.en/);
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai']) {
      expect(src).toMatch(new RegExp(`^\\s+${loc}:\\s*\\{`, 'm'));
    }
  });

  it('error.tsx has the same per-locale COPY map', () => {
    const src = read('src/app/[locale]/error.tsx');
    expect(src).toMatch(/const COPY: Record<Locale, ErrorCopy>/);
    expect(src).toMatch(/COPY\[locale\] \?\? COPY\.en/);
  });

  it('hardcoded "Something Went Wrong" English-only string is gone from error.tsx', () => {
    const src = read('src/app/[locale]/error.tsx');
    const codeOnly = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    // The literal `>Something Went Wrong<` JSX is gone (now inside COPY map only)
    expect(codeOnly).not.toMatch(/>Something Went Wrong</);
  });
});

describe('R3-UI-4 — five silent-Supabase pages capture { error }', () => {
  const targets = [
    'src/app/[locale]/settings/page.tsx',
    'src/app/[locale]/horoscope/HubClient.tsx',
    'src/app/[locale]/sign-calculator/page.tsx',
    'src/app/[locale]/baby-names/page.tsx',
    'src/app/[locale]/dashboard/saved-charts/page.tsx',
  ];
  for (const t of targets) {
    it(`${t} destructures { data, error }`, () => {
      const src = read(t);
      expect(src).toMatch(/\.then\(\(\{\s*data,\s*error\s*\}\)/);
    });
  }
});

describe('R3-UI-7 — PanchangClient visible fetch error', () => {
  const src = read('src/app/[locale]/panchang/PanchangClient.tsx');

  it('has fetchError state', () => {
    expect(src).toMatch(/const \[fetchError, setFetchError\] = useState<string \| null>/);
  });

  it('renders a banner with localised message + retry button', () => {
    expect(src).toMatch(/fetchError && !loading && \(/);
    expect(src).toMatch(/onClick=\{\(\) => fetchPanchang\(\)\}/);
    expect(src).toMatch(/Couldn't load today's panchang/);
  });
});

describe('R3-UI-13 — UserMenu localised across 8 locales', () => {
  const src = read('src/components/auth/UserMenu.tsx');

  it('imports useLocale + uses a per-locale COPY map', () => {
    expect(src).toMatch(/const COPY: Record<Locale, UserMenuCopy>/);
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai']) {
      expect(src).toMatch(new RegExp(`^\\s+${loc}:\\s*\\{`, 'm'));
    }
  });

  it('all label sites use t.signIn / t.myProfile / t.settings / t.signOut', () => {
    expect(src).toMatch(/aria-label=\{t\.signIn\}/);
    expect(src).toMatch(/\{t\.myProfile\}/);
    expect(src).toMatch(/\{t\.settings\}/);
    expect(src).toMatch(/\{t\.signOut\}/);
  });

  it('previous isDevanagariLocale ternary / tl() helper for Sign Out / My Profile is gone', () => {
    expect(src).not.toMatch(/isDevanagariLocale\(locale\) \? \(locale === 'sa'/);
    expect(src).not.toMatch(/tl\(\{ en: 'Settings', hi:/);
  });
});

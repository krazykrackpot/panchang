# 05 — Internationalization setup (multi-locale from day 1)

Use this if the app is multi-locale from day 1 — OR if there's any chance it
might be later. Retrofitting i18n onto a single-locale codebase is a
multi-week chore. Doing it Day 0 is a half-day.

---

I need to set up i18n for `<PROJECT NAME>`. Framework: Next.js App Router.
i18n library: `next-intl`. Locales on day 1: `<e.g., EN, HI, SA>`.
Locales I want to be able to add later without refactoring: `<e.g., TA, TE,
BN, KN, MR, GU, MAI, ES, FR, DE>`.

Goal: architecture is right from commit #1. Adding a new locale later is:
create folder, fill JSON files, add to locales array. Nothing else.

## Hard requirements

1. **ONE central message loader** at `src/lib/i18n/request.ts` using
   `getRequestConfig` from `next-intl/server`. Loads per-locale files:
   `src/messages/<locale>/{global,pages,components,learn}.json`.

2. **The same loader is imported by BOTH** `getRequestConfig` (server)
   AND `layout.tsx` (for `NextIntlClientProvider messages={...}`).
   Absolutely no separate flat-file loader for the client. This is the
   single most common i18n bug — two loaders drift, client shows raw key
   paths while server renders correctly.

3. **Routing prefix.** `<LOCALE>` in the URL (`/en/foo`, `/hi/foo`). Use
   `next-intl` middleware. Never infer locale from browser headers without
   also writing it to the URL.

4. **Default locale fallback.** Missing key in `<locale>/foo.json` →
   fall back to `en/foo.json`. Never render `undefined` or the key path.
   `next-intl` supports this via `onError` + `getMessageFallback` — wire
   both. Log missing keys in dev.

5. **Separation of concerns.** Message namespaces:
   - `global.json` — metadata, nav, common buttons
   - `pages.json` — per-page strings keyed by route (`pages.dashboard.title`)
   - `components.json` — reusable component strings (`components.navbar.signin`)
   - `learn.json` (or similar) — content-heavy sections
   Define the namespaces upfront, document which goes where.

6. **Runtime usage — one pattern:** `useTranslations('namespace')` in
   client components, `getTranslations({ locale, namespace })` in server
   components. **No inline `lt()` helpers, no `{ en, hi, ... }` objects in
   JSX, no `locale === 'xx' ? ... : ...` ternaries** for translatable
   strings. All of these are banned.

7. **Constants (non-UI strings)** that ARE multi-locale — planet names,
   sign names, nakshatras, etc. — use a `LocaleText` type:
   `{ en: string; hi: string; sa: string; ta?: string; ... }` with
   `en` required. Access via a `tl(obj, locale)` helper that falls back
   to `.en`. These belong in `src/lib/constants/`, not in message files.

8. **Fonts per script.** Each locale that uses a non-Latin script loads
   a matching Noto font via `next/font/google` with `display: 'swap'`.
   Expose as `--font-<script>-<role>` CSS variables so component code
   can switch via `style={{ fontFamily: 'var(--font-devanagari-body)' }}`
   without per-component string gymnastics.

9. **Locale parity is gated.** Before any commit that changes message
   files, a parity script verifies every locale has every key (with at
   minimum an English fallback value). Script lives at
   `scripts/check-locale-parity.py` (or .ts) and runs in `pre-commit`.

10. **All locales ship on every commit.** Never a partial rollout where
    EN has a new string but HI doesn't. Either add the key to every locale
    in the same commit, or gate the feature on a flag until parity.

## What NOT to do

- Don't use multiple i18n libraries. Pick one, commit.
- Don't hardcode English strings anywhere in feature code.
- Don't use a single giant `messages.json` — it will become unreviewable
  at scale. Split by concern from commit #1.
- Don't use a flat `messages/<locale>.json` as a "fallback" imported by
  the client provider. Single loader, same shape, always.
- Don't use `<h1>{locale === 'hi' ? 'हिंदी' : 'English'}</h1>`. Everything
  goes through the translator.
- Don't let untranslated regional locales silently render English. Either
  fall back via the loader (documented, logged) OR fail loudly.

## Give me back

1. Folder structure for `src/messages/` with all namespaces + all locales.
2. The single `src/lib/i18n/request.ts` loader (switch/case per locale for
   Turbopack static-import compatibility — don't use dynamic template
   strings as the argument to `import()`).
3. `src/lib/i18n/config.ts` with `locales`, `defaultLocale`, `visibleLocales`
   (the subset shown in the picker — may be narrower during rollout).
4. `src/lib/i18n/navigation.ts` wrapping `createNavigation`.
5. The middleware.
6. A `LocaleText` TypeScript type + `tl()` helper.
7. `next-intl` `onError` + `getMessageFallback` that log dev warnings for
   missing keys but fall back to English in prod without breaking the UI.
8. `scripts/check-locale-parity.ts` — reads every locale JSON, reports
   keys missing from any locale, exits non-zero if any are missing without
   fallback.
9. A pre-commit hook entry calling the parity script.
10. A one-page `docs/I18N-GUIDE.md` explaining: how to add a string, how
    to add a locale, how to test, what's banned and why.

Propose, get my signoff, then build. Don't skip step 9 — parity tooling is
what keeps this sustainable.

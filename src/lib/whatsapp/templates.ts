// WhatsApp template registry.
//
// Every template here corresponds to one approved Meta template. When you
// add a new template, you must:
//   1. Add the definition below
//   2. Submit to Meta for approval (see docs/runbooks/whatsapp-waba-setup.md)
//   3. Wait for APPROVED status before deploying code that references it
//
// Design doc: docs/specs/2026-06-15-whatsapp-daily-panchang.md §7

import type { Locale } from '@/lib/i18n/config';

export type SupportedTemplateLang =
  | 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mai' | 'mr';

export interface TemplateDef {
  // Meta template name (lower_snake, no version suffix as Meta versions
  // implicitly via the lang field)
  name: string;
  // The languages this template is approved in. Each lang is a separate Meta
  // template under the hood but shares the body shape.
  approvedLangs: SupportedTemplateLang[];
  // How many {{N}} placeholders the body has. The render functions in
  // render-daily.ts produce exactly this many.
  bodyParamCount: number;
  // Whether the template carries a URL button (and thus needs a urlButtonParam)
  hasUrlButton: boolean;
  // Meta category. Affects pricing.
  category: 'utility' | 'authentication' | 'marketing';
}

export const TEMPLATES = {
  whatsapp_otp_v1: {
    name: 'whatsapp_otp_v1',
    approvedLangs: ['en'], // OTP body is English-only; the code is the only variable
    bodyParamCount: 2,    // {{1}} = first_name, {{2}} = code
    hasUrlButton: false,
    category: 'authentication',
  },
  daily_panchang_v1: {
    name: 'daily_panchang_v1',
    approvedLangs: ['en', 'hi'], // Phase 1 ships en + hi; ta/te/bn/gu/kn/mai/mr in Phase 5+
    bodyParamCount: 10,   // see §7.2 of design doc
    hasUrlButton: true,   // single URL button → /{{locale}}/panchang
    category: 'utility',
  },
} as const satisfies Record<string, TemplateDef>;

export type TemplateKey = keyof typeof TEMPLATES;

/**
 * For locales we don't yet have a template approved in, fall back to Hindi
 * (Devanagari script handles hi/mai/mr; covers most of our non-en audience).
 * English remains the ultimate fallback.
 */
export function chooseTemplateLang(
  templateKey: TemplateKey,
  userLocale: Locale,
): SupportedTemplateLang {
  const tpl = TEMPLATES[templateKey];
  if ((tpl.approvedLangs as readonly string[]).includes(userLocale)) {
    return userLocale as SupportedTemplateLang;
  }
  // Devanagari-script locales fall back to hi if available
  const devanagariLocales: Locale[] = ['hi', 'mai', 'mr'];
  if (
    devanagariLocales.includes(userLocale) &&
    (tpl.approvedLangs as readonly string[]).includes('hi')
  ) {
    return 'hi';
  }
  return 'en';
}

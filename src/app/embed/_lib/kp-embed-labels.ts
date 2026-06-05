/**
 * KP-specific static UI labels for /embed/kp-* widgets.
 *
 * Kept in a separate file from `embed-labels.ts` to keep that file from
 * growing further; same 9-locales-directly discipline applies:
 *   - en/hi/mai/mr authored natively
 *   - ta/te/bn/gu/kn fall through to English values (per partial-locale
 *     SEO strategy from `feedback_seo_partial_locale_strategy` — the key
 *     must exist with a real value; English is acceptable until native
 *     translations are commissioned).
 *
 * Anti-fallback discipline: NO Hindi fallback for Devanagari locales — the
 * 2026-05-31 Marathi duplicate-content de-rank was triggered by that
 * fallback. The discipline established for the main `embed-labels.ts` is
 * preserved here.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §5 + §7
 */

import type { VisibleLocale } from './params';

export interface KpEmbedLabels {
  // Headings
  kpRulingTitle: string;
  kpRashiTitle: string;
  kpPrashnaTitle: string;

  // RP labels (matches the kp-system page for visual consistency)
  ascSign: string;
  ascStar: string;
  ascSub: string;
  moonSign: string;
  moonStar: string;
  moonSub: string;
  day: string;

  // Prashna widget
  enterNumber: string;
  cast: string;
  verdict: string;
  favourable: string;
  adverse: string;
  mixed: string;
  invalidNumber: string;

  // Ruling widget mode hint
  modeSunrise: string;
  modeNow: string;

  // Rashi widget
  rashiForecast: string;

  // Common
  readFullKpAnalysis: string;
}

const LABELS: Record<VisibleLocale, KpEmbedLabels> = {
  en: {
    kpRulingTitle: 'KP Ruling Planets',
    kpRashiTitle: 'KP Daily Forecast',
    kpPrashnaTitle: 'KP Prashna',
    ascSign: 'Asc Sign', ascStar: 'Asc Star', ascSub: 'Asc Sub',
    moonSign: 'Moon Sign', moonStar: 'Moon Star', moonSub: 'Moon Sub',
    day: 'Day',
    enterNumber: 'Pick 1–249', cast: 'Cast', verdict: 'Verdict',
    favourable: 'FAVOURABLE', adverse: 'ADVERSE', mixed: 'MIXED',
    invalidNumber: 'Enter 1–249',
    modeSunrise: 'At today\'s sunrise', modeNow: 'Right now',
    rashiForecast: 'KP forecast for each rashi',
    readFullKpAnalysis: 'Open full KP analysis',
  },
  hi: {
    kpRulingTitle: 'केपी शासक ग्रह',
    kpRashiTitle: 'केपी दैनिक फल',
    kpPrashnaTitle: 'केपी प्रश्न',
    ascSign: 'लग्न राशि', ascStar: 'लग्न नक्षत्र', ascSub: 'लग्न उप',
    moonSign: 'चन्द्र राशि', moonStar: 'चन्द्र नक्षत्र', moonSub: 'चन्द्र उप',
    day: 'वार',
    enterNumber: 'चुनें १–२४९', cast: 'समर्पित करें', verdict: 'निर्णय',
    favourable: 'शुभ', adverse: 'अशुभ', mixed: 'मिश्रित',
    invalidNumber: 'दर्ज करें १–२४९',
    modeSunrise: 'आज के सूर्योदय पर', modeNow: 'अभी',
    rashiForecast: 'हर राशि के लिए केपी फल',
    readFullKpAnalysis: 'पूर्ण केपी विश्लेषण देखें',
  },
  mr: {
    kpRulingTitle: 'केपी शासक ग्रह',
    kpRashiTitle: 'केपी दैनिक भाकीत',
    kpPrashnaTitle: 'केपी प्रश्न',
    ascSign: 'लग्न राशी', ascStar: 'लग्न नक्षत्र', ascSub: 'लग्न उप',
    moonSign: 'चंद्र राशी', moonStar: 'चंद्र नक्षत्र', moonSub: 'चंद्र उप',
    day: 'वार',
    enterNumber: 'निवडा १–२४९', cast: 'सादर करा', verdict: 'निकाल',
    favourable: 'शुभ', adverse: 'अशुभ', mixed: 'मिश्र',
    invalidNumber: 'टाका १–२४९',
    modeSunrise: 'आजच्या सूर्योदयाला', modeNow: 'आत्ता',
    rashiForecast: 'प्रत्येक राशीसाठी केपी भाकीत',
    readFullKpAnalysis: 'संपूर्ण केपी विश्लेषण उघडा',
  },
  mai: {
    kpRulingTitle: 'केपी शासक ग्रह',
    kpRashiTitle: 'केपी दैनिक फल',
    kpPrashnaTitle: 'केपी प्रश्न',
    ascSign: 'लग्न राशि', ascStar: 'लग्न नक्षत्र', ascSub: 'लग्न उप',
    moonSign: 'चन्द्र राशि', moonStar: 'चन्द्र नक्षत्र', moonSub: 'चन्द्र उप',
    day: 'वार',
    enterNumber: 'चुनू १–२४९', cast: 'समर्पित करू', verdict: 'निर्णय',
    favourable: 'शुभ', adverse: 'अशुभ', mixed: 'मिश्रित',
    invalidNumber: 'देल जाउ १–२४९',
    modeSunrise: 'आजुक सूर्योदय पर', modeNow: 'एखन',
    rashiForecast: 'सब राशिक लेल केपी फल',
    readFullKpAnalysis: 'पूर्ण केपी विश्लेषण देखू',
  },
  // Deferred locales — English fallback per partial-locale strategy.
  ta: {
    kpRulingTitle: 'KP Ruling Planets',
    kpRashiTitle: 'KP Daily Forecast',
    kpPrashnaTitle: 'KP Prashna',
    ascSign: 'Asc Sign', ascStar: 'Asc Star', ascSub: 'Asc Sub',
    moonSign: 'Moon Sign', moonStar: 'Moon Star', moonSub: 'Moon Sub',
    day: 'Day',
    enterNumber: 'Pick 1–249', cast: 'Cast', verdict: 'Verdict',
    favourable: 'FAVOURABLE', adverse: 'ADVERSE', mixed: 'MIXED',
    invalidNumber: 'Enter 1–249',
    modeSunrise: 'At today\'s sunrise', modeNow: 'Right now',
    rashiForecast: 'KP forecast for each rashi',
    readFullKpAnalysis: 'Open full KP analysis',
  },
  te: {
    kpRulingTitle: 'KP Ruling Planets',
    kpRashiTitle: 'KP Daily Forecast',
    kpPrashnaTitle: 'KP Prashna',
    ascSign: 'Asc Sign', ascStar: 'Asc Star', ascSub: 'Asc Sub',
    moonSign: 'Moon Sign', moonStar: 'Moon Star', moonSub: 'Moon Sub',
    day: 'Day',
    enterNumber: 'Pick 1–249', cast: 'Cast', verdict: 'Verdict',
    favourable: 'FAVOURABLE', adverse: 'ADVERSE', mixed: 'MIXED',
    invalidNumber: 'Enter 1–249',
    modeSunrise: 'At today\'s sunrise', modeNow: 'Right now',
    rashiForecast: 'KP forecast for each rashi',
    readFullKpAnalysis: 'Open full KP analysis',
  },
  bn: {
    kpRulingTitle: 'KP Ruling Planets',
    kpRashiTitle: 'KP Daily Forecast',
    kpPrashnaTitle: 'KP Prashna',
    ascSign: 'Asc Sign', ascStar: 'Asc Star', ascSub: 'Asc Sub',
    moonSign: 'Moon Sign', moonStar: 'Moon Star', moonSub: 'Moon Sub',
    day: 'Day',
    enterNumber: 'Pick 1–249', cast: 'Cast', verdict: 'Verdict',
    favourable: 'FAVOURABLE', adverse: 'ADVERSE', mixed: 'MIXED',
    invalidNumber: 'Enter 1–249',
    modeSunrise: 'At today\'s sunrise', modeNow: 'Right now',
    rashiForecast: 'KP forecast for each rashi',
    readFullKpAnalysis: 'Open full KP analysis',
  },
  gu: {
    kpRulingTitle: 'KP Ruling Planets',
    kpRashiTitle: 'KP Daily Forecast',
    kpPrashnaTitle: 'KP Prashna',
    ascSign: 'Asc Sign', ascStar: 'Asc Star', ascSub: 'Asc Sub',
    moonSign: 'Moon Sign', moonStar: 'Moon Star', moonSub: 'Moon Sub',
    day: 'Day',
    enterNumber: 'Pick 1–249', cast: 'Cast', verdict: 'Verdict',
    favourable: 'FAVOURABLE', adverse: 'ADVERSE', mixed: 'MIXED',
    invalidNumber: 'Enter 1–249',
    modeSunrise: 'At today\'s sunrise', modeNow: 'Right now',
    rashiForecast: 'KP forecast for each rashi',
    readFullKpAnalysis: 'Open full KP analysis',
  },
  kn: {
    kpRulingTitle: 'KP Ruling Planets',
    kpRashiTitle: 'KP Daily Forecast',
    kpPrashnaTitle: 'KP Prashna',
    ascSign: 'Asc Sign', ascStar: 'Asc Star', ascSub: 'Asc Sub',
    moonSign: 'Moon Sign', moonStar: 'Moon Star', moonSub: 'Moon Sub',
    day: 'Day',
    enterNumber: 'Pick 1–249', cast: 'Cast', verdict: 'Verdict',
    favourable: 'FAVOURABLE', adverse: 'ADVERSE', mixed: 'MIXED',
    invalidNumber: 'Enter 1–249',
    modeSunrise: 'At today\'s sunrise', modeNow: 'Right now',
    rashiForecast: 'KP forecast for each rashi',
    readFullKpAnalysis: 'Open full KP analysis',
  },
};

export function getKpEmbedLabels(locale: VisibleLocale): KpEmbedLabels {
  return LABELS[locale] ?? LABELS.en;
}

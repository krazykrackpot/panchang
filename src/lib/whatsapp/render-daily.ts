// Render the daily-panchang WhatsApp template body parameters.
//
// Meta templates are static-shape text with {{1}}..{{N}} placeholders. The
// approved template lives on Meta's servers; this file produces the ordered
// parameter array that gets substituted in.
//
// Template body (per §7.2 of design doc):
//
//   🕉 *{{1}}* — Dekho Panchang
//   📅 {{2}}    📍 {{3}}
//   🌅 Sunrise: {{4}}    🌇 Sunset: {{5}}
//   🌙 Tithi: {{6}}
//   ✨ Nakshatra: {{7}}
//   🎯 Yoga: {{8}}
//   {{9}}
//   🔗 Full details: dekhopanchang.com/{{10}}/panchang
//   Reply STOP to unsubscribe.
//
// URL button: dekhopanchang.com/{{1}}/panchang where {{1}} is the locale slug

import { computePanchang } from '@/lib/ephem/panchang-calc';
import type { PanchangData } from '@/types/panchang';
import type { Locale } from '@/lib/i18n/config';
import { tl } from '@/lib/utils/trilingual';
import type { SupportedTemplateLang } from '@/lib/whatsapp/templates';

export interface DailyRenderInput {
  /** Calendar date the panchang is for, in the user's timezone. */
  year: number;
  month: number;  // 1-12
  day: number;
  lat: number;
  lng: number;
  /** Hours from UTC, e.g. 5.5 for IST, already resolved for this date (handles DST). */
  tzOffset: number;
  /** IANA timezone name, e.g. "Asia/Kolkata". Passed through to computePanchang. */
  timezone?: string;
  /** City name already in the user's locale (caller is responsible for tl()-resolving). */
  cityName: string;
  templateLang: SupportedTemplateLang;
  /** User's locale for the URL button (deep-links into the locale they read). */
  userLocale: Locale;
}

export interface DailyRenderOutput {
  bodyParams: string[];    // length = TEMPLATES.daily_panchang_v1.bodyParamCount = 10
  urlButtonParam: string;  // the locale slug for the URL button
}

// Per-template-lang static labels.
const HEADER_LABEL: Record<SupportedTemplateLang, string> = {
  en: 'Today',
  hi: 'आज',
  ta: 'இன்று',
  te: 'ఈరోజు',
  bn: 'আজ',
  gu: 'આજે',
  kn: 'ಇಂದು',
  mai: 'आइ',
  mr: 'आज',
};

export function dailyHeaderLabel(lang: SupportedTemplateLang): string {
  return HEADER_LABEL[lang];
}

/**
 * Render the body parameters for the daily-panchang template.
 *
 * Idempotent: same input → same output (no Date.now() at runtime).
 *
 * The 10 parameters in order:
 *   1. Header label ("Today" / "आज" / etc.)
 *   2. Formatted date (e.g. "15 जून 2026" / "Mon 15 Jun 2026")
 *   3. City name in user's locale
 *   4. Sunrise time HH:MM (already in local time from computePanchang)
 *   5. Sunset time HH:MM
 *   6. Tithi name + end time
 *   7. Nakshatra name + end time
 *   8. Yoga name + end time
 *   9. Highlight line (festival / muhurta / rahu kaal)
 *  10. Locale slug for the URL link (en/hi/ta/...)
 */
export function renderDailyPanchang(input: DailyRenderInput): DailyRenderOutput {
  const panchang: PanchangData = computePanchang({
    year: input.year,
    month: input.month,
    day: input.day,
    lat: input.lat,
    lng: input.lng,
    tzOffset: input.tzOffset,
    timezone: input.timezone,
    locationName: input.cityName,
  });

  const lang = input.templateLang;

  // {{1}} — header label
  const header = HEADER_LABEL[lang];

  // {{2}} — formatted date (locale-aware)
  //   Build the date at noon in the user's local tz to avoid DST off-by-one,
  //   then format with Intl in the user's locale.
  const noonLocal = new Date(Date.UTC(input.year, input.month - 1, input.day, 12));
  const dateStr = formatDate(noonLocal, lang);

  // {{3}} — city name (already in user's locale)
  const cityStr = input.cityName;

  // {{4}}–{{5}} — sunrise/sunset are pre-formatted "HH:MM" strings from
  // computePanchang. Already in user's local time.
  const sunrise = panchang.sunrise;
  const sunset = panchang.sunset;

  // {{6}}–{{8}} — tithi / nakshatra / yoga with end-times.
  //   Element transitions live on tithiTransition / nakshatraTransition /
  //   yogaTransition (separate optional fields on PanchangData), each with
  //   endTime: "HH:MM". Some days don't transition (element active all day);
  //   in that case we omit the "until ..." suffix.
  const tithiStr = formatElement(
    tl(panchang.tithi.name, lang),
    panchang.tithiTransition?.endTime,
  );
  const nakshatraStr = formatElement(
    tl(panchang.nakshatra.name, lang),
    panchang.nakshatraTransition?.endTime,
  );
  const yogaStr = formatElement(
    tl(panchang.yoga.name, lang),
    panchang.yogaTransition?.endTime,
  );

  // {{9}} — highlight slot. Priority order:
  //   (a) Festival name (if today is a named festival) — Phase 3 wiring
  //   (b) Abhijit muhurta window
  //   (c) Rahu kaal window
  const highlight = buildHighlightLine(panchang, lang);

  return {
    bodyParams: [
      header,
      dateStr,
      cityStr,
      sunrise,
      sunset,
      tithiStr,
      nakshatraStr,
      yogaStr,
      highlight,
      input.userLocale, // {{10}}
    ],
    urlButtonParam: input.userLocale,
  };
}

function formatDate(d: Date, lang: SupportedTemplateLang): string {
  // Best-effort BCP-47 mapping. Falls back to Hindi script for Maithili
  // (Intl doesn't ship the mai locale data).
  const intlLocale: Record<SupportedTemplateLang, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    mai: 'hi-IN',
    mr: 'mr-IN',
  };
  return new Intl.DateTimeFormat(intlLocale[lang], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC', // we already shifted noon to the user's local day
  }).format(d);
}

function formatElement(name: string, endTimeHHMM: string | undefined): string {
  if (!endTimeHHMM) return name;
  // Use English "until" — Phase 3 will swap to a locale-aware connector if
  // Meta accepts that level of dynamism (template body has the static text).
  return `${name} (until ${endTimeHHMM})`;
}

// Highlight slot. Real implementation will check festival-defs + muhurta engine;
// Phase 1 stubs to a per-locale string the test snapshot can lock onto. Full
// wiring lands in Phase 3 with:
//   1. generateFestivalCalendarV2(year, lat, lng, tz).find(f => f.date === today)
//   2. panchang.abhijitMuhurta when (1) is null
//   3. panchang.rahuKaal as last resort
function buildHighlightLine(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _panchang: PanchangData,
  lang: SupportedTemplateLang,
): string {
  const labels: Record<SupportedTemplateLang, string> = {
    en: '✨ See full panchang for muhurta windows.',
    hi: '✨ मुहूर्त के लिए पूर्ण पंचांग देखें।',
    ta: '✨ முழு பஞ்சாங்கம் காண்க.',
    te: '✨ పూర్తి పంచాంగం చూడండి.',
    bn: '✨ সম্পূর্ণ পঞ্জিকা দেখুন।',
    gu: '✨ સંપૂર્ણ પંચાંગ જુઓ.',
    kn: '✨ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ ನೋಡಿ.',
    mai: '✨ पूरा पंचांग देखू।',
    mr: '✨ संपूर्ण पंचांग पहा.',
  };
  return labels[lang];
}

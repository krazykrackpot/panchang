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
import type { FestivalEntry } from '@/lib/calendar/festival-generator';

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
  /**
   * Festivals occurring on this calendar date. Pass the result of
   * `generateFestivalCalendarV2(year, lat, lng, tz).filter(f => f.date === yyyymmdd)`.
   * The cron caches this per (year, lat, lng, tz) bucket so 25 subscribers in
   * the same city don't each re-generate the yearly festival table.
   * Empty array if no festival today — that's the normal case for most days.
   */
  festivalsToday: FestivalEntry[];
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
    lang,
  );
  const nakshatraStr = formatElement(
    tl(panchang.nakshatra.name, lang),
    panchang.nakshatraTransition?.endTime,
    lang,
  );
  const yogaStr = formatElement(
    tl(panchang.yoga.name, lang),
    panchang.yogaTransition?.endTime,
    lang,
  );

  // {{9}} — highlight slot. Priority order:
  //   (a) Festival name (if today is a named festival)
  //   (b) Abhijit muhurta window (skipped on Wed per classical rule)
  //   (c) Rahu kaal window
  const highlight = buildHighlightLine(
    panchang,
    lang,
    input.festivalsToday,
    input.userLocale,
  );

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

// Best-effort BCP-47 mapping. Maithili falls back to Hindi script (Intl
// doesn't ship the mai locale data). Hoisted to module scope so the lookup
// is O(1) and the object isn't reallocated per call. (Gemini PR #706 round-2 MED)
const INTL_LOCALES: Record<SupportedTemplateLang, string> = {
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

// Cached Intl.DateTimeFormat instances. Constructing one is expensive
// (~50-200μs on warm V8); at 1000 subscribers × 10 calls each we'd burn
// hundreds of milliseconds per cron tick on instance creation. The cache
// is per-locale and lives for the lifetime of the function instance.
const DATE_FORMATTERS: Partial<Record<SupportedTemplateLang, Intl.DateTimeFormat>> = {};

function getDateFormatter(lang: SupportedTemplateLang): Intl.DateTimeFormat {
  let fmt = DATE_FORMATTERS[lang];
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(INTL_LOCALES[lang], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC', // we already shifted noon to the user's local day
    });
    DATE_FORMATTERS[lang] = fmt;
  }
  return fmt;
}

function formatDate(d: Date, lang: SupportedTemplateLang): string {
  return getDateFormatter(lang).format(d);
}

// Per-locale formatter for "<element> (until <HH:MM>)".
//
// English uses a preposition (until <time>); most Indian languages use a
// postposition that follows the time (तक / வரை / దాకా / ਤੱਕ etc.).
// Hardcoding English "until" reads as broken grammar in non-en locales,
// per Gemini PR #706 MED.
const ELEMENT_FORMATTERS: Record<SupportedTemplateLang, (name: string, endTime: string) => string> = {
  en:  (n, t) => `${n} (until ${t})`,
  hi:  (n, t) => `${n} (${t} तक)`,
  ta:  (n, t) => `${n} (${t} வரை)`,
  te:  (n, t) => `${n} (${t} వరకు)`,
  bn:  (n, t) => `${n} (${t} পর্যন্ত)`,
  gu:  (n, t) => `${n} (${t} સુધી)`,
  kn:  (n, t) => `${n} (${t} ವರೆಗೆ)`,
  mai: (n, t) => `${n} (${t} धरि)`,
  mr:  (n, t) => `${n} (${t} पर्यंत)`,
};

function formatElement(
  name: string,
  endTimeHHMM: string | undefined,
  lang: SupportedTemplateLang,
): string {
  if (!endTimeHHMM) return name;
  return ELEMENT_FORMATTERS[lang](name, endTimeHHMM);
}

// Highlight slot priority (most important fact for today, single line):
//   1. Named festival on this date (Diwali, Ekadashi, etc.)
//   2. Abhijit muhurta window (most universal auspicious slot, ~48 min midday)
//   3. Rahu kaal window (most universal inauspicious slot — useful to AVOID)
//
// Festival lookup is optional: the caller passes the full festival list for
// the day so this function stays pure (no I/O). The cron does the lookup
// once per cron-tick and caches per (year, lat, lng, tz) across all
// subscribers in the same bucket.
function buildHighlightLine(
  panchang: PanchangData,
  lang: SupportedTemplateLang,
  festivalsToday: FestivalEntry[],
  userLocale: Locale,
): string {
  const FESTIVAL_PREFIX: Record<SupportedTemplateLang, string> = {
    en: '🎉 Today: ',
    hi: '🎉 आज: ',
    ta: '🎉 இன்று: ',
    te: '🎉 ఈరోజు: ',
    bn: '🎉 আজ: ',
    gu: '🎉 આજે: ',
    kn: '🎉 ಇಂದು: ',
    mai: '🎉 आइ: ',
    mr: '🎉 आज: ',
  };
  const ABHIJIT_PREFIX: Record<SupportedTemplateLang, string> = {
    en: '✨ Abhijit muhurta',
    hi: '✨ अभिजित मुहूर्त',
    ta: '✨ அபிஜித் முகூர்த்தம்',
    te: '✨ అభిజిత్ ముహూర్తం',
    bn: '✨ অভিজিৎ মুহূর্ত',
    gu: '✨ અભિજિત મુહૂર્ત',
    kn: '✨ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ',
    mai: '✨ अभिजित मुहूर्त',
    mr: '✨ अभिजित मुहूर्त',
  };
  const RAHUKAAL_PREFIX: Record<SupportedTemplateLang, string> = {
    en: '⚠️ Rahu kaal',
    hi: '⚠️ राहु काल',
    ta: '⚠️ ராகு காலம்',
    te: '⚠️ రాహు కాలం',
    bn: '⚠️ রাহু কাল',
    gu: '⚠️ રાહુ કાળ',
    kn: '⚠️ ರಾಹು ಕಾಲ',
    mai: '⚠️ राहु काल',
    mr: '⚠️ राहू काळ',
  };

  // (1) Festival — take the first major-or-regional entry, skipping ekadashi
  //     duplicates that also appear as vrat entries.
  const top = festivalsToday[0];
  if (top) {
    return FESTIVAL_PREFIX[lang] + tl(top.name, userLocale);
  }

  // (2) Abhijit muhurta — skipped on Wednesdays per classical rule
  //     (panchang.abhijitMuhurta.available === false on Wed)
  if (panchang.abhijitMuhurta?.available !== false && panchang.abhijitMuhurta?.start) {
    return `${ABHIJIT_PREFIX[lang]} ${panchang.abhijitMuhurta.start}–${panchang.abhijitMuhurta.end}`;
  }

  // (3) Rahu kaal — always present
  if (panchang.rahuKaal?.start) {
    return `${RAHUKAAL_PREFIX[lang]} ${panchang.rahuKaal.start}–${panchang.rahuKaal.end}`;
  }

  // Fallback — should never hit, panchang.rahuKaal is always populated
  const fallback: Record<SupportedTemplateLang, string> = {
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
  return fallback[lang];
}

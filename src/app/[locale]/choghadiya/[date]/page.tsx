import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, getDateGenitive, isSuppressedSeoLocale, formatSeoDate } from '@/lib/utils/locale-fonts';
import { choghadiyaDateSeo } from '@/lib/seo/date-page-seo';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { tl } from '@/lib/utils/trilingual';
import { getChoghadiyaPageModel } from '@/lib/precompute/choghadiya-page-model';
import { CHOGHADIYA_NAMES } from '@/lib/constants/choghadiya';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isStale } from '@/lib/seo/staleness';
import type { Metadata } from 'next';
// ChoghadiyaClient deliberately NOT imported here — see comment above
// the `</main>` tag for why mounting it on the ISR-cached dated route
// causes hydration-mismatch React #418 / collapsed analytics.
import { TodayBadge } from '@/components/ui/TodayBadge';
import TodaySignificanceSection from '@/components/date-content/TodaySignificanceSection';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

// On-demand revalidation only. Pages cache indefinitely until the
// nightly cron's POST /api/precompute/revalidate flips them via
// revalidatePath. With PRECOMPUTE_FETCH_ENABLED=true, the page reads
// from the deterministic Blob — no time-based revalidate window means
// no scheduled regen, which is the cost line we're cutting.
//
// With PRECOMPUTE_FETCH_ENABLED unset, the reader falls back to live
// compute, the page caches the result indefinitely (same as before
// from the user's perspective), and `revalidatePath` is the only way
// to flip it. That's strictly better than the old `revalidate=86400`
// where every 24h we'd recompute and re-cache even on past-date
// pages whose content never changes.
//
// Past-date safety: deterministic by URL, so once cached forever is
// correct — there's no truth that could change.
//
// Future-date safety: gh-action precompute writes the Blob for
// new future-window dates daily, then POSTs the path list to the
// webhook. Within minutes the edge cache holds the precomputed slot
// data; user requests serve from cache.
export const revalidate = false;
export const dynamicParams = true;

import { BASE_URL } from '@/lib/seo/base-url';
// SEO_CITY now resolved per-locale via getSeoCityForLocale() inside the
// page handler. The old const-Delhi default forced every /xx/choghadiya/
// surface to render byte-identical times — Google's content-similarity
// classifier started consolidating /hi/ and /mr/ canonicals around
// 2026-05-29 (see /tmp/cluster-out.log; deferred-task #69).

// 9-locale weekday names (Sunday=0). hi/sa/mai share the canonical
// Devanagari forms; mr has मंगळवार (with retroflex ळ) for Marathi.
const WEEKDAYS_BY_LOCALE: Record<string, readonly string[]> = {
  en:  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hi:  ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  sa:  ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  mai: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  mr:  ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  ta:  ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  te:  ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'],
  kn:  ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'],
  gu:  ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'],
  bn:  ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
};

const NATURE_LABELS_BY_LOCALE: Record<string, Record<string, string>> = {
  en:  { auspicious: 'Auspicious',     inauspicious: 'Inauspicious', neutral: 'Neutral' },
  hi:  { auspicious: 'शुभ',             inauspicious: 'अशुभ',          neutral: 'सामान्य' },
  sa:  { auspicious: 'शुभम्',           inauspicious: 'अशुभम्',        neutral: 'साधारणम्' },
  mai: { auspicious: 'शुभ',             inauspicious: 'अशुभ',          neutral: 'सामान्य' },
  mr:  { auspicious: 'शुभ',             inauspicious: 'अशुभ',          neutral: 'सामान्य' },
  ta:  { auspicious: 'நல்ல நேரம்',     inauspicious: 'கெட்ட நேரம்',   neutral: 'நடுநிலை' },
  te:  { auspicious: 'శుభం',            inauspicious: 'అశుభం',          neutral: 'తటస్థం' },
  kn:  { auspicious: 'ಶುಭ',             inauspicious: 'ಅಶುಭ',           neutral: 'ತಟಸ್ಥ' },
  gu:  { auspicious: 'શુભ',             inauspicious: 'અશુભ',           neutral: 'સામાન્ય' },
  bn:  { auspicious: 'শুভ',             inauspicious: 'অশুভ',           neutral: 'সাধারণ' },
};

/** Page-chrome labels per locale for the [date] table headers, nav,
 *  badge, headline + intro templates. Closures interpolate cityName /
 *  weekday / humanDate at render time so we don't re-do template
 *  concatenation per call site. */
const LABELS: Record<string, {
  choghadiya: string; time: string; nature: string;
  previous: string; today: string; next: string; todayBadge: string;
  panchang: string; todaysChoghadiya: string; rahuKaal: string; hora: string;
  dayTitle: (humanDate: string) => string;
  nightTitle: (humanDate: string) => string;
  headline: (cityName: string, weekday: string, humanDate: string) => string;
  intro: (cityName: string, weekday: string, humanDate: string) => string;
}> = {
  en: {
    choghadiya: 'Choghadiya', time: 'Time', nature: 'Nature',
    previous: 'Previous', today: 'Today', next: 'Next', todayBadge: '📅 Today',
    panchang: 'Panchang', todaysChoghadiya: "Today's Choghadiya", rahuKaal: 'Rahu Kaal', hora: 'Hora',
    dayTitle: (d) => `Day Choghadiya (${d})`,
    nightTitle: (d) => `Night Choghadiya (${d})`,
    headline: (c, w, d) => `${c} Choghadiya — ${w}, ${d}`,
    intro: (c, w, d) => `Day and night Choghadiya for ${c} on ${w}, ${d}. Start new work during Shubh, Labh, Amrit periods.`,
  },
  hi: {
    choghadiya: 'चौघड़िया', time: 'समय', nature: 'स्वभाव',
    previous: 'पिछला दिन', today: 'आज', next: 'अगला दिन', todayBadge: '📅 आज',
    panchang: 'पंचांग', todaysChoghadiya: 'आज का चौघड़िया', rahuKaal: 'राहु काल', hora: 'होरा',
    dayTitle: (d) => `दिन के चौघड़िया (${d})`,
    nightTitle: (d) => `रात के चौघड़िया (${d})`,
    headline: (c, w, d) => `${c} चौघड़िया — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} को ${c} के लिए दिन और रात के चौघड़िया। शुभ, लाभ, अमृत काल में नए कार्य करें।`,
  },
  sa: {
    choghadiya: 'चौघड़ियम्', time: 'समयः', nature: 'स्वभावः',
    previous: 'पूर्वदिनम्', today: 'अद्य', next: 'अग्रिमदिनम्', todayBadge: '📅 अद्य',
    panchang: 'पंचांगम्', todaysChoghadiya: 'अद्यतनं चौघड़ियम्', rahuKaal: 'राहुकालः', hora: 'होरा',
    dayTitle: (d) => `दिनस्य चौघड़ियम् (${d})`,
    nightTitle: (d) => `रात्रेः चौघड़ियम् (${d})`,
    headline: (c, w, d) => `${c} चौघड़ियम् — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} दिने ${c} नगरस्य दिन-रात्रि चौघड़ियम्। शुभ, लाभ, अमृत कालेषु नवीनं कार्यं आरभस्व।`,
  },
  mai: {
    choghadiya: 'चौघड़िया', time: 'समय', nature: 'स्वभाव',
    previous: 'पिछिला दिन', today: 'आइ', next: 'अगिला दिन', todayBadge: '📅 आइ',
    panchang: 'पंचांग', todaysChoghadiya: 'आजुक चौघड़िया', rahuKaal: 'राहु काल', hora: 'होरा',
    dayTitle: (d) => `दिनक चौघड़िया (${d})`,
    nightTitle: (d) => `रातिक चौघड़िया (${d})`,
    headline: (c, w, d) => `${c} चौघड़िया — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} केँ ${c} क लेल दिन आ रातिक चौघड़िया। शुभ, लाभ, अमृत कालमे नव कार्य करू।`,
  },
  mr: {
    choghadiya: 'चोघडिया', time: 'वेळ', nature: 'स्वभाव',
    previous: 'मागील दिवस', today: 'आज', next: 'पुढील दिवस', todayBadge: '📅 आज',
    panchang: 'पंचांग', todaysChoghadiya: 'आजचे चोघडिया', rahuKaal: 'राहु काल', hora: 'होरा',
    dayTitle: (d) => `दिवसाचे चोघडिया (${d})`,
    nightTitle: (d) => `रात्रीचे चोघडिया (${d})`,
    headline: (c, w, d) => `${c} चोघडिया — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} रोजी ${c}चे दिवस आणि रात्रीचे चोघडिया. शुभ, लाभ, अमृत कालावधीत नवीन कार्ये करा.`,
  },
  ta: {
    choghadiya: 'சௌகாடியா', time: 'நேரம்', nature: 'பலன்',
    previous: 'முந்தைய நாள்', today: 'இன்று', next: 'அடுத்த நாள்', todayBadge: '📅 இன்று',
    panchang: 'பஞ்சாங்கம்', todaysChoghadiya: 'இன்றைய சௌகாடியா', rahuKaal: 'ராகு காலம்', hora: 'ஹோரை',
    dayTitle: (d) => `பகல் சௌகாடியா (${d})`,
    nightTitle: (d) => `இரவு சௌகாடியா (${d})`,
    headline: (c, w, d) => `${c} சௌகாடியா — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ${c}க்கான பகல் மற்றும் இரவு சௌகாடியா. சுபம், லாபம், அமிர்த காலங்களில் புதிய காரியங்களைத் தொடங்கவும்.`,
  },
  te: {
    choghadiya: 'చోఘడియా', time: 'సమయం', nature: 'స్వభావం',
    previous: 'మునుపటి రోజు', today: 'నేడు', next: 'తదుపరి రోజు', todayBadge: '📅 నేడు',
    panchang: 'పంచాంగం', todaysChoghadiya: 'నేటి చోఘడియా', rahuKaal: 'రాహు కాలం', hora: 'హోర',
    dayTitle: (d) => `పగటి చోఘడియా (${d})`,
    nightTitle: (d) => `రాత్రి చోఘడియా (${d})`,
    headline: (c, w, d) => `${c} చోఘడియా — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ${c}కి పగలు మరియు రాత్రి చోఘడియా. శుభ, లాభ, అమృత కాలాలలో కొత్త పనులు ప్రారంభించండి.`,
  },
  kn: {
    choghadiya: 'ಚೋಘಡಿಯಾ', time: 'ಸಮಯ', nature: 'ಸ್ವಭಾವ',
    previous: 'ಹಿಂದಿನ ದಿನ', today: 'ಇಂದು', next: 'ಮುಂದಿನ ದಿನ', todayBadge: '📅 ಇಂದು',
    panchang: 'ಪಂಚಾಂಗ', todaysChoghadiya: 'ಇಂದಿನ ಚೋಘಡಿಯಾ', rahuKaal: 'ರಾಹು ಕಾಲ', hora: 'ಹೋರ',
    dayTitle: (d) => `ಹಗಲಿನ ಚೋಘಡಿಯಾ (${d})`,
    nightTitle: (d) => `ರಾತ್ರಿಯ ಚೋಘಡಿಯಾ (${d})`,
    headline: (c, w, d) => `${c} ಚೋಘಡಿಯಾ — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ${c}ಗೆ ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯ ಚೋಘಡಿಯಾ. ಶುಭ, ಲಾಭ, ಅಮೃತ ಕಾಲಗಳಲ್ಲಿ ಹೊಸ ಕೆಲಸಗಳನ್ನು ಪ್ರಾರಂಭಿಸಿ.`,
  },
  gu: {
    choghadiya: 'ચોઘડિયા', time: 'સમય', nature: 'સ્વભાવ',
    previous: 'આગલો દિવસ', today: 'આજ', next: 'આવતો દિવસ', todayBadge: '📅 આજ',
    panchang: 'પંચાંગ', todaysChoghadiya: 'આજનું ચોઘડિયા', rahuKaal: 'રાહુ કાળ', hora: 'હોરા',
    dayTitle: (d) => `દિવસનું ચોઘડિયા (${d})`,
    nightTitle: (d) => `રાત્રિનું ચોઘડિયા (${d})`,
    headline: (c, w, d) => `${c} ચોઘડિયા — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ના રોજ ${c} માટે દિવસ અને રાત્રિનું ચોઘડિયા. શુભ, લાભ, અમૃત સમય દરમિયાન નવા કાર્ય શરૂ કરો.`,
  },
  bn: {
    choghadiya: 'চোগাড়িয়া', time: 'সময়', nature: 'স্বভাব',
    previous: 'আগের দিন', today: 'আজ', next: 'পরের দিন', todayBadge: '📅 আজ',
    panchang: 'পঞ্জিকা', todaysChoghadiya: 'আজকের চোগাড়িয়া', rahuKaal: 'রাহু কাল', hora: 'হোরা',
    dayTitle: (d) => `দিনের চোগাড়িয়া (${d})`,
    nightTitle: (d) => `রাতের চোগাড়িয়া (${d})`,
    headline: (c, w, d) => `${c} চোগাড়িয়া — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} তারিখে ${c}-এর দিন ও রাতের চোগাড়িয়া। শুভ, লাভ, অমৃত সময়ে নতুন কাজ শুরু করুন।`,
  },
};

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function natureColor(nature: string): string {
  if (nature === 'auspicious') return 'text-emerald-400';
  if (nature === 'inauspicious') return 'text-red-400';
  return 'text-amber-400';
}

interface SSRSlot {
  name: string; nameHi: string; type: string; nature: string; startTime: string; endTime: string;
}

/** Parse and validate YYYY-MM-DD date param. Returns null if invalid. */
function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, yStr, mStr, dStr] = match;
  const y = Number(yStr); const m = Number(mStr); const d = Number(dStr);
  if (y < 2020 || y > 2035 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  // Quick validity check
  const test = new Date(Date.UTC(y, m - 1, d));
  if (test.getUTCFullYear() !== y || test.getUTCMonth() + 1 !== m || test.getUTCDate() !== d) return null;
  return { year: y, month: m, day: d };
}

// formatDateHuman lived here; removed in PR #329 cycle-5 cleanup.
// Callers now use formatSeoDate from locale-fonts.ts.

// ──────────────────────────────────────────────────────────────
// Static params: pre-render next 30 days + previous 7 days
// for en, hi, and mai — the top 3 locales by GSC traffic.
// (mai's `/mai/choghadiya/<date>` page drove ~75% of daily traffic on May 21.)
// Other locales (ta, te, bn, kn, gu) fall through to ISR.
// ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const dates: string[] = [];
  const base = new Date();
  for (let i = -7; i <= 30; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return ['en', 'hi', 'mai'].flatMap(locale => dates.map(date => ({ locale, date })));
}

// ──────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string; date: string }> }): Promise<Metadata> {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) return { title: 'Choghadiya — Dekho Panchang' };
  // formatSeoDate handles Marathi correctly (ICU month names) so titles
  // like "1 मे 2026" don't read as "1 May 2026" or "1 जून 2026" by
  // accident. Gemini PR #329 MEDIUM.
  const humanDate = formatSeoDate(parsed.year, parsed.month, parsed.day, locale);
  const url = `${BASE_URL}/${locale}/choghadiya/${dateStr}`;
  // Must match the page handler's city (same getSeoCityForLocale lookup)
  // and same locale script (tl) — otherwise metadata cites City A while
  // body computes City B's times, which Google reads as low-quality
  // inconsistent content.
  const seoCity = getSeoCityForLocale(locale);
  const cityName = tl(seoCity.name, locale);

  // Per-locale title / description / keywords come from the exhaustive
  // `choghadiyaDateSeo()` helper. If a new locale is added to `Locale`,
  // the helper fails to type-check until each new `case` is handled,
  // making it structurally impossible to ship the "Hindi-fallback
  // duplicate title" bug that crashed Marathi + Maithili 2026-05-31.
  // Date-first title order matches the winning GSC query pattern where
  // users type the date BEFORE "choghadiya" (e.g. "21 may 2026 ka
  // choghadiya"). Marathi grammar (oblique `सूर्योदय-सूर्यास्तावर`,
  // no-space `दिल्लीचे`) is preserved from Gemini PR #329 cycles 8 & 9.
  const { title, description, keywords } = choghadiyaDateSeo({
    locale: locale as Locale,
    humanDate,
    cityName,
  });

  // Sanskrit (retired) — suppress from index. See locale-fonts.ts comment.
  // Rule 1 — staleness: URLs >14 days from today (past or future) noindex
  // so Google drops them. See src/lib/seo/staleness.ts. 2026-06-03.
  const noindex = isSuppressedSeoLocale(locale) || isStale({ kind: 'date-keyed', urlDate: dateStr });

  return {
    title,
    description,
    keywords,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/choghadiya/${dateStr}`])),
        'x-default': `${BASE_URL}/en/choghadiya/${dateStr}`,
      },
    },
  };
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────

export default async function ChoghadiyaDatePage({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) notFound();

  const { year, month, day } = parsed;
  const isHi = isDevanagariLocale(locale);
  // Same locale-aware formatter as the metadata — H1 and title stay aligned.
  const humanDate = formatSeoDate(year, month, day, locale);
  const city = getSeoCityForLocale(locale);
  // Locale-correct city name for rendered surfaces (H1 + description).
  // Must match the cityName passed to choghadiyaDateSeo() in metadata.
  const cityName = tl(city.name, locale);

  let daySlots: SSRSlot[] = [];
  let nightSlots: SSRSlot[] = [];
  let weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0=Sun

  // Page model routed through the precompute pipeline. When the kill
  // switch (PRECOMPUTE_FETCH_ENABLED) is off OR the Blob is missing /
  // schema-invalid / stale, getChoghadiyaPageModel falls back to live
  // compute — output is byte-identical across all branches.
  try {
    const model = await getChoghadiyaPageModel({ date: dateStr, city });
    weekday = model.weekday;
    daySlots = model.daySlots.map((s) => ({
      name: s.name.en || '',
      nameHi: s.name.hi || s.name.en || '',
      type: s.type,
      nature: s.nature,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
    nightSlots = model.nightSlots.map((s) => ({
      name: s.name.en || '',
      nameHi: s.name.hi || s.name.en || '',
      type: s.type,
      nature: s.nature,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
  } catch (err) {
    console.error('[choghadiya/date] SSR computation failed:', err);
  }

  // Tithi for the URL date — drives the "Today's Significance" section.
  // Independent of the choghadiya page-model; cheap (single panchang
  // compute) and never throws. On failure we skip rendering the section.
  let tithiNumber = 0;
  try {
    const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
    const panchang = computePanchang({
      year, month, day,
      lat: city.lat, lng: city.lng,
      tzOffset, timezone: city.timezone,
      locationName: city.name.en,
    });
    tithiNumber = panchang.tithi.number;
  } catch (err) {
    console.error('[choghadiya/date] tithi compute failed:', err);
  }

  const L = LABELS[locale] ?? LABELS.en;
  const weekdayName = (WEEKDAYS_BY_LOCALE[locale] ?? WEEKDAYS_BY_LOCALE.en)[weekday];
  const natureLabel = (n: string): string =>
    (NATURE_LABELS_BY_LOCALE[locale] ?? NATURE_LABELS_BY_LOCALE.en)[n]
    ?? NATURE_LABELS_BY_LOCALE.en[n]
    ?? n;
  // Choghadiya slot name lookup — the page-model returns en + hi only
  // today, so non-Devanagari locales fall through hi → en for now. Once
  // the precompute pipeline carries the full LocaleText this resolves
  // to the locale's script directly via slot.nameLoc (see gauri-panchang
  // for the precedent). For now we use CHOGHADIYA_NAMES via slot.type.
  const slotName = (slot: SSRSlot): string => {
    const type = slot.type as keyof typeof CHOGHADIYA_NAMES;
    const localized = CHOGHADIYA_NAMES[type] as Record<string, string | undefined>;
    return localized?.[locale]
      ?? (isHi ? slot.nameHi : slot.name)
      ?? slot.name
      ?? '';
  };

  // Adjacent date navigation
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const prevDate = new Date(dateObj); prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  const nextDate = new Date(dateObj); nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const prevStr = prevDate.toISOString().slice(0, 10);
  const nextStr = nextDate.toISOString().slice(0, 10);
  // NB: "today" comparison happens in <TodayBadge /> client-side. This
  // is an ISR page (revalidate 86400); a server-computed todayStr would
  // bake into the cached HTML and go stale on day +1.

  const renderTable = (slots: SSRSlot[], title: string) => (
    <>
      <h2 className="text-gold-light text-xl font-semibold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
      <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{L.choghadiya}</th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{L.time}</th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{L.nature}</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-4 text-text-primary font-medium">{slotName(slot)}</td>
                <td className="py-2 px-4 text-gold-light font-mono">{fmt12(slot.startTime)} – {fmt12(slot.endTime)}</td>
                <td className={`py-2 px-4 font-semibold ${natureColor(slot.nature)}`}>{natureLabel(slot.nature)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        {/* Date navigation */}
        <nav className="flex items-center justify-between mb-6 text-sm">
          <Link href={`/${locale}/choghadiya/${prevStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            ← {L.previous}
          </Link>
          <Link href={`/${locale}/choghadiya`} className="text-text-secondary hover:text-gold-light transition-colors">
            {L.today}
          </Link>
          <Link href={`/${locale}/choghadiya/${nextStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            {L.next} →
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.headline(cityName, weekdayName, humanDate)}
        </h1>

        <TodayBadge
          dateStr={dateStr}
          fallbackTimezone={city.timezone}
          label={L.todayBadge}
        />


        <p className="text-text-primary text-lg mt-4">
          {L.intro(cityName, weekdayName, humanDate)}
        </p>

        {tithiNumber > 0 ? (
          <TodaySignificanceSection
            tithiNumber={tithiNumber}
            dateStr={dateStr}
            lat={city.lat}
            lng={city.lng}
            timezone={city.timezone}
            locale={locale}
          />
        ) : null}

        {daySlots.length > 0 && renderTable(daySlots, L.dayTitle(humanDate))}
        {nightSlots.length > 0 && renderTable(nightSlots, L.nightTitle(humanDate))}

        {/* Related links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">{L.panchang}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">{L.todaysChoghadiya}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">{L.rahuKaal}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">{L.hora}</Link>
        </nav>
      </div>

      {/* ChoghadiyaClient intentionally NOT mounted on the dated route.
          The SSR tables above already render the URL date's slots in
          full. The client component would re-render today's choghadiya
          inside this ISR-cached HTML — when an ISR-cached page from
          yesterday is served to a today-clocked visitor, the slot
          times mismatch and React #418 kills the entire tree post-
          hydration. That collapsed Vercel Web Analytics page-views
          ~80% (and likely GA pageviews too) on 2026-05-28. The /choghadiya
          index (no [date]) still uses ChoghadiyaClient — it has no
          ISR window so no mismatch is possible. */}
    </main>
  );
}

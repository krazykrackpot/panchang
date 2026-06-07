import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale, isSuppressedSeoLocale } from '@/lib/utils/locale-fonts';
import { gauriPanchangDateSeo } from '@/lib/seo/date-page-seo';
import { type Locale } from '@/lib/i18n/config';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { tl } from '@/lib/utils/trilingual';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isStale } from '@/lib/seo/staleness';
import type { Metadata } from 'next';
// GauriPanchangClient deliberately NOT imported here — see comment below
// where it would have been mounted. Same React #418 hydration trap as the
// sibling Choghadiya dated route (PR #267).
import { TodayBadge } from '@/components/ui/TodayBadge';

export const revalidate = 86400;
export const dynamicParams = true;

import { BASE_URL } from '@/lib/seo/base-url';
// SEO city resolved per-locale via getSeoCityForLocale() inside the page
// handler. Fallback 'chennai' preserves the South-Indian default for
// locales not in SEO_CITY_BY_LOCALE (gauri panchangam is a South-Indian
// tradition; chennai is the most natural generic default).

// 9-locale weekday names (Sunday=0). hi/sa/mai/mr share the Devanagari
// canonical forms; ta/te/kn/gu/bn have native-script equivalents.
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
  en:  { auspicious: 'Auspicious',     inauspicious: 'Inauspicious' },
  hi:  { auspicious: 'शुभ',             inauspicious: 'अशुभ' },
  sa:  { auspicious: 'शुभम्',           inauspicious: 'अशुभम्' },
  mai: { auspicious: 'शुभ',             inauspicious: 'अशुभ' },
  mr:  { auspicious: 'शुभ',             inauspicious: 'अशुभ' },
  ta:  { auspicious: 'நல்ல நேரம்',     inauspicious: 'கெட்ட நேரம்' },
  te:  { auspicious: 'శుభం',            inauspicious: 'అశుభం' },
  kn:  { auspicious: 'ಶುಭ',             inauspicious: 'ಅಶುಭ' },
  gu:  { auspicious: 'શુભ',             inauspicious: 'અશુભ' },
  bn:  { auspicious: 'শুভ',             inauspicious: 'অশুভ' },
};

/** Page-chrome labels per locale. Used by the [date] page table headers,
 *  navigation, headline + intro templates. Keeps the same naming as the
 *  matching/horoscope LABELS pattern (en fallback for unknown locales). */
const LABELS: Record<string, {
  gauriPeriod: string; time: string; nature: string;
  previous: string; today: string; next: string; todayBadge: string;
  panchang: string; todaysGauri: string; choghadiya: string; rahuKaal: string; hora: string;
  dayTitle: (humanDate: string) => string;
  nightTitle: (humanDate: string) => string;
  headline: (cityName: string, weekday: string, humanDate: string) => string;
  intro: (cityName: string, weekday: string, humanDate: string) => string;
}> = {
  en: {
    gauriPeriod: 'Gauri Period', time: 'Time', nature: 'Nature',
    previous: 'Previous', today: 'Today', next: 'Next', todayBadge: '📅 Today',
    panchang: 'Panchang', todaysGauri: "Today's Gauri Panchang", choghadiya: 'Choghadiya', rahuKaal: 'Rahu Kaal', hora: 'Hora',
    dayTitle: (d) => `Day Gauri Panchang (${d})`,
    nightTitle: (d) => `Night Gauri Panchang (${d})`,
    headline: (c, w, d) => `${c} Gauri Panchang — ${w}, ${d}`,
    intro: (c, w, d) => `Day and night Gauri Panchang for ${c} on ${w}, ${d}. Start new work during Amritha, Siddha, Laabha, Dhanam, Sugam periods.`,
  },
  hi: {
    gauriPeriod: 'गौरी पंचांग', time: 'समय', nature: 'स्वभाव',
    previous: 'पिछला दिन', today: 'आज', next: 'अगला दिन', todayBadge: '📅 आज',
    panchang: 'पंचांग', todaysGauri: 'आज का गौरी पंचांग', choghadiya: 'चौघड़िया', rahuKaal: 'राहु काल', hora: 'होरा',
    dayTitle: (d) => `दिन का गौरी पंचांग (${d})`,
    nightTitle: (d) => `रात का गौरी पंचांग (${d})`,
    headline: (c, w, d) => `${c} गौरी पंचांग — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} को ${c} के लिए दिन और रात का गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम काल में नए कार्य करें।`,
  },
  sa: {
    gauriPeriod: 'गौरी पंचांगम्', time: 'समयः', nature: 'स्वभावः',
    previous: 'पूर्वदिनम्', today: 'अद्य', next: 'अग्रिमदिनम्', todayBadge: '📅 अद्य',
    panchang: 'पंचांगम्', todaysGauri: 'अद्यतनं गौरी पंचांगम्', choghadiya: 'चौघड़ियम्', rahuKaal: 'राहुकालः', hora: 'होरा',
    dayTitle: (d) => `दिनस्य गौरी पंचांगम् (${d})`,
    nightTitle: (d) => `रात्रेः गौरी पंचांगम् (${d})`,
    headline: (c, w, d) => `${c} गौरी पंचांगम् — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} दिने ${c} नगरस्य दिन-रात्रि गौरी पंचांगम्। अमृत, सिद्ध, लाभ, धन, सुगम कालेषु नवीनं कार्यं आरभस्व।`,
  },
  mai: {
    gauriPeriod: 'गौरी पंचांग', time: 'समय', nature: 'स्वभाव',
    previous: 'पिछिला दिन', today: 'आइ', next: 'अगिला दिन', todayBadge: '📅 आइ',
    panchang: 'पंचांग', todaysGauri: 'आजुक गौरी पंचांग', choghadiya: 'चौघड़िया', rahuKaal: 'राहु काल', hora: 'होरा',
    dayTitle: (d) => `दिनक गौरी पंचांग (${d})`,
    nightTitle: (d) => `रातिक गौरी पंचांग (${d})`,
    headline: (c, w, d) => `${c} गौरी पंचांग — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} केँ ${c} क लेल दिन आ रातिक गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम कालमे नव कार्य करू।`,
  },
  mr: {
    gauriPeriod: 'गौरी पंचांग', time: 'वेळ', nature: 'स्वभाव',
    previous: 'मागील दिवस', today: 'आज', next: 'पुढील दिवस', todayBadge: '📅 आज',
    panchang: 'पंचांग', todaysGauri: 'आजचे गौरी पंचांग', choghadiya: 'चोघडिया', rahuKaal: 'राहु काल', hora: 'होरा',
    dayTitle: (d) => `दिवसाचे गौरी पंचांग (${d})`,
    nightTitle: (d) => `रात्रीचे गौरी पंचांग (${d})`,
    headline: (c, w, d) => `${c} गौरी पंचांग — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} रोजी ${c}चे दिवस आणि रात्रीचे गौरी पंचांग. अमृत, सिद्ध, लाभ, धन, सुगम कालावधीत नवीन कार्ये करा.`,
  },
  ta: {
    gauriPeriod: 'கௌரி பஞ்சாங்கம்', time: 'நேரம்', nature: 'பலன்',
    previous: 'முந்தைய நாள்', today: 'இன்று', next: 'அடுத்த நாள்', todayBadge: '📅 இன்று',
    panchang: 'பஞ்சாங்கம்', todaysGauri: 'இன்றைய கௌரி பஞ்சாங்கம்', choghadiya: 'சௌகாடியா', rahuKaal: 'ராகு காலம்', hora: 'ஹோரை',
    dayTitle: (d) => `பகல் கௌரி பஞ்சாங்கம் (${d})`,
    nightTitle: (d) => `இரவு கௌரி பஞ்சாங்கம் (${d})`,
    headline: (c, w, d) => `${c} கௌரி பஞ்சாங்கம் — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ${c}க்கான பகல் மற்றும் இரவு கௌரி பஞ்சாங்கம். அமிர்தம், சித்தம், லாபம், தனம், சுகம் காலங்களில் புதிய காரியங்களைத் தொடங்கவும்.`,
  },
  te: {
    gauriPeriod: 'గౌరి కాలం', time: 'సమయం', nature: 'స్వభావం',
    previous: 'మునుపటి రోజు', today: 'నేడు', next: 'తదుపరి రోజు', todayBadge: '📅 నేడు',
    panchang: 'పంచాంగం', todaysGauri: 'నేటి గౌరి పంచాంగం', choghadiya: 'చోఘడియా', rahuKaal: 'రాహు కాలం', hora: 'హోర',
    dayTitle: (d) => `పగటి గౌరి పంచాంగం (${d})`,
    nightTitle: (d) => `రాత్రి గౌరి పంచాంగం (${d})`,
    headline: (c, w, d) => `${c} గౌరి పంచాంగం — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ${c}కి పగలు మరియు రాత్రి గౌరి పంచాంగం. అమృత, సిద్ధ, లాభ, ధన, సుగమ కాలాలలో కొత్త పనులు ప్రారంభించండి.`,
  },
  kn: {
    gauriPeriod: 'ಗೌರಿ ಕಾಲ', time: 'ಸಮಯ', nature: 'ಸ್ವಭಾವ',
    previous: 'ಹಿಂದಿನ ದಿನ', today: 'ಇಂದು', next: 'ಮುಂದಿನ ದಿನ', todayBadge: '📅 ಇಂದು',
    panchang: 'ಪಂಚಾಂಗ', todaysGauri: 'ಇಂದಿನ ಗೌರಿ ಪಂಚಾಂಗ', choghadiya: 'ಚೋಘಡಿಯಾ', rahuKaal: 'ರಾಹು ಕಾಲ', hora: 'ಹೋರ',
    dayTitle: (d) => `ಹಗಲಿನ ಗೌರಿ ಪಂಚಾಂಗ (${d})`,
    nightTitle: (d) => `ರಾತ್ರಿಯ ಗೌರಿ ಪಂಚಾಂಗ (${d})`,
    headline: (c, w, d) => `${c} ಗೌರಿ ಪಂಚಾಂಗ — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ${c}ಗೆ ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯ ಗೌರಿ ಪಂಚಾಂಗ. ಅಮೃತ, ಸಿದ್ಧ, ಲಾಭ, ಧನ, ಸುಗಮ ಕಾಲಗಳಲ್ಲಿ ಹೊಸ ಕೆಲಸಗಳನ್ನು ಪ್ರಾರಂಭಿಸಿ.`,
  },
  gu: {
    gauriPeriod: 'ગૌરી સમય', time: 'સમય', nature: 'સ્વભાવ',
    previous: 'આગલો દિવસ', today: 'આજ', next: 'આવતો દિવસ', todayBadge: '📅 આજ',
    panchang: 'પંચાંગ', todaysGauri: 'આજનું ગૌરી પંચાંગ', choghadiya: 'ચોઘડિયા', rahuKaal: 'રાહુ કાળ', hora: 'હોરા',
    dayTitle: (d) => `દિવસનું ગૌરી પંચાંગ (${d})`,
    nightTitle: (d) => `રાત્રિનું ગૌરી પંચાંગ (${d})`,
    headline: (c, w, d) => `${c} ગૌરી પંચાંગ — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} ના રોજ ${c} માટે દિવસ અને રાત્રિનું ગૌરી પંચાંગ. અમૃત, સિદ્ધ, લાભ, ધન, સુગમ સમય દરમિયાન નવા કાર્ય શરૂ કરો.`,
  },
  bn: {
    gauriPeriod: 'গৌরী সময়', time: 'সময়', nature: 'স্বভাব',
    previous: 'আগের দিন', today: 'আজ', next: 'পরের দিন', todayBadge: '📅 আজ',
    panchang: 'পঞ্জিকা', todaysGauri: 'আজকের গৌরী পঞ্জিকা', choghadiya: 'চোগাড়িয়া', rahuKaal: 'রাহু কাল', hora: 'হোরা',
    dayTitle: (d) => `দিনের গৌরী পঞ্জিকা (${d})`,
    nightTitle: (d) => `রাতের গৌরী পঞ্জিকা (${d})`,
    headline: (c, w, d) => `${c} গৌরী পঞ্জিকা — ${w}, ${d}`,
    intro: (c, w, d) => `${w}, ${d} তারিখে ${c}-এর দিন ও রাতের গৌরী পঞ্জিকা। অমৃত, সিদ্ধ, লাভ, ধন, সুগম সময়ে নতুন কাজ শুরু করুন।`,
  },
};

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function natureColor(nature: string): string {
  return nature === 'auspicious' ? 'text-emerald-400' : 'text-red-400';
}

interface SSRSlot {
  // Full per-locale period name map (en/hi/sa/mai/mr/ta/te/kn/gu/bn).
  // Sourced from GAURI_NAMES in src/lib/constants/gauri-panchang.ts so
  // all 9 visible locales render in-script without falling back to en/hi.
  name: string;     // en (kept for back-compat with logger / fallback)
  nameHi: string;   // hi (kept for the Devanagari-group fallback)
  nameLoc: Record<string, string | undefined>;
  type: string;
  nature: string;
  startTime: string;
  endTime: string;
}

/** Parse and validate YYYY-MM-DD date param. */
function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, yStr, mStr, dStr] = match;
  const y = Number(yStr); const m = Number(mStr); const d = Number(dStr);
  if (y < 2020 || y > 2035 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const test = new Date(Date.UTC(y, m - 1, d));
  if (test.getUTCFullYear() !== y || test.getUTCMonth() + 1 !== m || test.getUTCDate() !== d) return null;
  return { year: y, month: m, day: d };
}

function formatDateHuman(y: number, m: number, d: number): string {
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// ──────────────────────────────────────────────────────────────
// Static params: pre-render next 30 + previous 7 days for the
// top three Gauri-panchang locales (en, hi, ta). Choghadiya
// pre-renders en/hi/mai because mai is its #1 traffic driver;
// Gauri's #1 is Tamil so we swap mai → ta here. Other locales
// (te, kn, bn, gu, mai, mr) fall through to ISR.
// ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  const dates: string[] = [];
  const base = new Date();
  for (let i = -7; i <= 30; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return ['en', 'hi', 'ta'].flatMap(locale => dates.map(date => ({ locale, date })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; date: string }> }): Promise<Metadata> {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) return { title: 'Gauri Panchang — Dekho Panchang' };
  const humanDate = formatDateHuman(parsed.year, parsed.month, parsed.day);
  const route = `/gauri-panchang/${dateStr}`;

  // Per-locale title / description / keywords come from the exhaustive
  // `gauriPanchangDateSeo()` helper. The pre-refactor template branched
  // on `isTa || isHi || else-English` — same fallback shape that
  // crashed mr/mai on the panchang/choghadiya routes. GSC Coverage
  // Validation flagged 34 of these URLs (gu/kn/bn/te/mai/mr) as
  // "Duplicate, Google chose different canonical than user"; the
  // exhaustive switch closes that surface.
  // Must match the page handler's city (same getSeoCityForLocale lookup
  // with 'chennai' fallback — gauri panchangam is South-Indian) and
  // same locale script (tl). Otherwise metadata cites City A while the
  // body computes City B's times.
  const seoCity = getSeoCityForLocale(locale, 'chennai');
  const cityName = tl(seoCity.name, locale);

  const { title, description, keywords } = gauriPanchangDateSeo({
    locale: locale as Locale,
    humanDate,
    cityName,
  });

  // Three independent reasons to noindex this URL:
  //   - thin-coverage policy: bn/gu/mr/mai locales render the same
  //     en/hi content (gauri-panchang.ts has only en/hi/ta/te/kn).
  //     Covered by `!isLocaleIndexable` per the central policy in
  //     src/lib/seo/indexable-locales.ts.
  //   - Sanskrit (sa) retirement: redundant explicit check; the
  //     predicate already excludes sa for /gauri-panchang/.
  //   - Staleness: URLs >14 days from today noindex so Google drops
  //     them. See src/lib/seo/staleness.ts. 2026-06-03.
  const isIndexable = isLocaleIndexable(route, locale);
  const noindex =
    !isIndexable ||
    isSuppressedSeoLocale(locale) ||
    isStale({ kind: 'date-keyed', urlDate: dateStr });
  const url = buildCanonicalUrl(route, locale);

  return {
    title,
    description,
    keywords,
    ...(noindex && { robots: { index: false, follow: true } }),
    alternates: {
      canonical: url,
      languages: buildIndexableHreflang(route),
    },
  };
}

export default async function GauriPanchangDatePage({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) notFound();

  const { year, month, day } = parsed;
  const humanDate = formatDateHuman(year, month, day);
  const city = getSeoCityForLocale(locale, 'chennai');
  // Locale-correct city name for H1 + intro. Must match the cityName
  // passed to gauriPanchangDateSeo() in metadata above so SERP title
  // and on-page H1 stay aligned across all 9 locales.
  const cityName = tl(city.name, locale);

  let daySlots: SSRSlot[] = [];
  let nightSlots: SSRSlot[] = [];
  let weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  // city is guaranteed non-null by getSeoCityForLocale. try/catch
  // protects against engine failures only.
  try {
    const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
    const panchang = computePanchang({ year, month, day, lat: city.lat, lng: city.lng, tzOffset, timezone: city.timezone });
    weekday = panchang.vara?.day ?? weekday;

    if (panchang.gauriPanchang) {
      const toSSR = (s: typeof panchang.gauriPanchang[number]): SSRSlot => {
        // The engine's name object carries the full 10-locale map from
        // GAURI_NAMES. Pluck every locale we render into a flat record
        // so the page can resolve by locale without a re-cast at the
        // call site.
        const nm = s.name as Record<string, string | undefined>;
        return {
          name: s.name.en || '',
          nameHi: s.name.hi || s.name.en || '',
          nameLoc: {
            en: nm.en, hi: nm.hi, sa: nm.sa,
            mai: nm.mai, mr: nm.mr,
            ta: nm.ta, te: nm.te, kn: nm.kn,
            gu: nm.gu, bn: nm.bn,
          },
          type: s.type,
          nature: s.nature,
          startTime: s.startTime,
          endTime: s.endTime,
        };
      };
      daySlots = panchang.gauriPanchang.filter(s => s.period === 'day').map(toSSR);
      nightSlots = panchang.gauriPanchang.filter(s => s.period === 'night').map(toSSR);
    }
  } catch (err) {
    console.error('[gauri-panchang/date] SSR computation failed:', err);
  }

  const L = LABELS[locale] ?? LABELS.en;
  const weekdayName = (WEEKDAYS_BY_LOCALE[locale] ?? WEEKDAYS_BY_LOCALE.en)[weekday];
  const natureLabel = (n: string) => (NATURE_LABELS_BY_LOCALE[locale] ?? NATURE_LABELS_BY_LOCALE.en)[n] ?? NATURE_LABELS_BY_LOCALE.en[n];
  // Resolve a locale-aware Gauri period name from the slot's per-locale
  // map (populated from GAURI_NAMES). Falls back through hi → en if the
  // current locale isn't present on the slot.
  const slotName = (slot: SSRSlot): string =>
    slot.nameLoc[locale]
    ?? (isDevanagariLocale(locale) ? slot.nameHi || slot.name : slot.name)
    ?? slot.name
    ?? '';

  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const prevDate = new Date(dateObj); prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  const nextDate = new Date(dateObj); nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const prevStr = prevDate.toISOString().slice(0, 10);
  const nextStr = nextDate.toISOString().slice(0, 10);
  // NB: "today" comparison happens in <TodayBadge /> client-side, NOT
  // here. This is an ISR page (revalidate 86400) — a server-computed
  // todayStr gets baked into the cached HTML and goes stale on day +1.

  const renderTable = (slots: SSRSlot[], title: string) => (
    <>
      <h2 className="text-gold-light text-xl font-semibold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
      <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {L.gauriPeriod}
              </th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {L.time}
              </th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {L.nature}
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-4 text-text-primary font-medium">
                  {slotName(slot)}
                </td>
                <td className="py-2 px-4 text-gold-light font-mono">{fmt12(slot.startTime)} – {fmt12(slot.endTime)}</td>
                <td className={`py-2 px-4 font-semibold ${natureColor(slot.nature)}`}>{natureLabel(slot.nature)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const headline = L.headline(cityName, weekdayName, humanDate);
  const intro = L.intro(cityName, weekdayName, humanDate);

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        {/* Date navigation */}
        <nav className="flex items-center justify-between mb-6 text-sm">
          <Link href={`/${locale}/gauri-panchang/${prevStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            ← {L.previous}
          </Link>
          <Link href={`/${locale}/gauri-panchang`} className="text-text-secondary hover:text-gold-light transition-colors">
            {L.today}
          </Link>
          <Link href={`/${locale}/gauri-panchang/${nextStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            {L.next} →
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {headline}
        </h1>

        <TodayBadge
          dateStr={dateStr}
          fallbackTimezone={city.timezone}
          label={L.todayBadge}
        />


        <p className="text-text-primary text-lg mt-4">{intro}</p>

        {daySlots.length > 0 && renderTable(daySlots, L.dayTitle(humanDate))}

        {nightSlots.length > 0 && renderTable(nightSlots, L.nightTitle(humanDate))}

        {/* Related links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label={L.todaysGauri}>
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L.panchang}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/gauri-panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L.todaysGauri}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L.choghadiya}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L.rahuKaal}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L.hora}
          </Link>
        </nav>
      </div>

      {/* GauriPanchangClient intentionally NOT mounted on the dated route.
          The SSR tables above already render the URL date's Gauri slots
          in full. The client component would re-render today's slots
          inside this ISR-cached HTML — when an ISR-cached page from
          yesterday is served to a today-clocked visitor, the slot
          times mismatch and React #418 kills the entire tree post-
          hydration. Same trap that collapsed Vercel Web Analytics
          page-views ~80% on 2026-05-28 via the sibling Choghadiya
          route (fixed in PR #267). The /gauri-panchang index (no
          [date]) still uses GauriPanchangClient — it has no ISR
          window so no mismatch is possible. */}
    </main>
  );
}

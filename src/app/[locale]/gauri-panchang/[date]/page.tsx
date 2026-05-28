import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { locales } from '@/lib/i18n/config';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
// GauriPanchangClient deliberately NOT imported here — see comment below
// where it would have been mounted. Same React #418 hydration trap as the
// sibling Choghadiya dated route (PR #267).
import { TodayBadge } from '@/components/ui/TodayBadge';

export const revalidate = 86400;
export const dynamicParams = true;

import { BASE_URL } from '@/lib/seo/base-url';
const SEO_CITY = 'chennai'; // South-Indian default (parallel to Choghadiya's Delhi default)

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_TA = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const NATURE_LABELS_EN: Record<string, string> = { auspicious: 'Auspicious', inauspicious: 'Inauspicious' };
const NATURE_LABELS_TA: Record<string, string> = { auspicious: 'நல்ல நேரம்', inauspicious: 'கெட்ட நேரம்' };
const NATURE_LABELS_HI: Record<string, string> = { auspicious: 'शुभ', inauspicious: 'अशुभ' };

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function natureColor(nature: string): string {
  return nature === 'auspicious' ? 'text-emerald-400' : 'text-red-400';
}

interface SSRSlot {
  name: string;
  nameHi: string;
  nameTa?: string;
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
  const isTa = locale === 'ta';
  const isHi = isDevanagariLocale(locale);
  const humanDate = formatDateHuman(parsed.year, parsed.month, parsed.day);
  const url = `${BASE_URL}/${locale}/gauri-panchang/${dateStr}`;

  // Devanagari + Tamil-script spelling variants for the same intent.
  // "Gowri" / "Gauri" / "Gouri" all surface in GSC for South-Indian
  // English queries; "கௌரி" / "கௌரீ" cover Tamil-script searches.
  const taKeywords = [
    'கௌரி பஞ்சாங்கம்', 'கௌரி நல்ல நேரம்', 'gowri panchangam', 'gauri panchang',
    `கௌரி பஞ்சாங்கம் ${humanDate}`, 'நல்ல நேரம் இன்று', 'gowri nalla neram',
  ];
  const hiKeywords = [
    'गौरी पंचांग', 'गौरी नल्ल नेरम', 'गोवरी पंचांग',
    `गौरी पंचांग ${humanDate}`, 'दिन का गौरी पंचांग', 'रात का गौरी पंचांग',
  ];
  const enKeywords = [
    'gauri panchang', 'gowri panchangam', 'gowri nalla neram',
    `gauri panchang ${humanDate}`, 'south indian muhurat', 'tamil auspicious time',
    'amritha siddha laabha', 'gauri panchang today',
  ];

  const dateConnector = locale === 'mai' ? 'क' : 'का';

  return {
    title: isTa
      ? `${humanDate} கௌரி பஞ்சாங்கம் — பகல் மற்றும் இரவு நல்ல நேரம் | Dekho Panchang`
      : isHi
        ? `${humanDate} ${dateConnector} गौरी पंचांग — दिन और रात के शुभ-अशुभ काल | देखो पंचांग`
        : `${humanDate} Gauri Panchang — Day & Night Gowri Nalla Neram | Dekho Panchang`,
    description: isTa
      ? `${humanDate} சென்னைக்கான கௌரி பஞ்சாங்கம் — அமிர்தம், சித்தம், லாபம், தனம், சுகம் (நல்ல) மற்றும் மரணம், ரோகம், சோகம் (கெட்ட) நேரங்கள் சூரிய உதயம்-அஸ்தமனம் அடிப்படையில் கணக்கிடப்பட்டது.`
      : isHi
        ? (locale === 'mai'
            ? `${humanDate} के लेल चेन्नई क गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम (शुभ) आ मरण, रोग, शोक (अशुभ) — सभ 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`
            : `${humanDate} के लिए चेन्नई का गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम (शुभ) और मरण, रोग, शोक (अशुभ) — सभी 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`)
        : `Gauri Panchang for ${humanDate} in Chennai. All 16 day and night periods — Amritha, Siddha, Laabha, Dhanam, Sugam (auspicious) and Marana, Rogam, Sokam (inauspicious) — computed from sunrise and sunset.`,
    keywords: isTa ? taKeywords : isHi ? hiKeywords : enKeywords,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/gauri-panchang/${dateStr}`])),
        'x-default': `${BASE_URL}/en/gauri-panchang/${dateStr}`,
      },
    },
  };
}

export default async function GauriPanchangDatePage({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date: dateStr } = await params;
  setRequestLocale(locale);
  const parsed = parseDate(dateStr);
  if (!parsed) notFound();

  const { year, month, day } = parsed;
  const isTa = locale === 'ta';
  const isHi = isDevanagariLocale(locale);
  const humanDate = formatDateHuman(year, month, day);
  const city = CITIES.find((c: { slug: string }) => c.slug === SEO_CITY);

  let daySlots: SSRSlot[] = [];
  let nightSlots: SSRSlot[] = [];
  let weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  if (city) {
    try {
      const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
      const panchang = computePanchang({ year, month, day, lat: city.lat, lng: city.lng, tzOffset, timezone: city.timezone });
      weekday = panchang.vara?.day ?? weekday;

      if (panchang.gauriPanchang) {
        const toSSR = (s: typeof panchang.gauriPanchang[number]): SSRSlot => ({
          name: s.name.en || '',
          nameHi: s.name.hi || s.name.en || '',
          nameTa: (s.name as { ta?: string }).ta,
          type: s.type,
          nature: s.nature,
          startTime: s.startTime,
          endTime: s.endTime,
        });
        daySlots = panchang.gauriPanchang.filter(s => s.period === 'day').map(toSSR);
        nightSlots = panchang.gauriPanchang.filter(s => s.period === 'night').map(toSSR);
      }
    } catch (err) {
      console.error('[gauri-panchang/date] SSR computation failed:', err);
    }
  }

  const weekdayName = isTa ? WEEKDAYS_TA[weekday] : isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];
  const natureLabel = (n: string) => isTa ? NATURE_LABELS_TA[n] : isHi ? NATURE_LABELS_HI[n] : NATURE_LABELS_EN[n];

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
                {isTa ? 'கௌரி பஞ்சாங்கம்' : isHi ? 'गौरी पंचांग' : 'Gauri Period'}
              </th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {isTa ? 'நேரம்' : isHi ? 'समय' : 'Time'}
              </th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {isTa ? 'பலன்' : isHi ? 'स्वभाव' : 'Nature'}
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-4 text-text-primary font-medium">
                  {isTa && slot.nameTa ? slot.nameTa : isHi ? slot.nameHi : slot.name}
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

  const headline = isTa
    ? `கௌரி பஞ்சாங்கம் — ${weekdayName}, ${humanDate}`
    : isHi
      ? `गौरी पंचांग — ${weekdayName}, ${humanDate}`
      : `Gauri Panchang — ${weekdayName}, ${humanDate}`;

  const intro = isTa
    ? `${weekdayName}, ${humanDate} சென்னைக்கான பகல் மற்றும் இரவு கௌரி பஞ்சாங்கம். அமிர்தம், சித்தம், லாபம், தனம், சுகம் காலங்களில் புதிய காரியங்களைத் தொடங்கவும்.`
    : isHi
      ? `${weekdayName}, ${humanDate} को चेन्नई के लिए दिन और रात का गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम काल में नए कार्य करें।`
      : `Day and night Gauri Panchang for Chennai on ${weekdayName}, ${humanDate}. Start new work during Amritha, Siddha, Laabha, Dhanam, Sugam periods.`;

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        {/* Date navigation */}
        <nav className="flex items-center justify-between mb-6 text-sm">
          <Link href={`/${locale}/gauri-panchang/${prevStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            ← {isTa ? 'முந்தைய நாள்' : isHi ? 'पिछला दिन' : 'Previous'}
          </Link>
          <Link href={`/${locale}/gauri-panchang`} className="text-text-secondary hover:text-gold-light transition-colors">
            {isTa ? 'இன்று' : isHi ? 'आज' : 'Today'}
          </Link>
          <Link href={`/${locale}/gauri-panchang/${nextStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isTa ? 'அடுத்த நாள்' : isHi ? 'अगला दिन' : 'Next'} →
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {headline}
        </h1>

        <TodayBadge
          dateStr={dateStr}
          fallbackTimezone={city?.timezone ?? 'Asia/Kolkata'}
          label={isTa ? '📅 இன்று' : isHi ? '📅 आज' : '📅 Today'}
        />


        <p className="text-text-primary text-lg mt-4">{intro}</p>

        {daySlots.length > 0 && renderTable(
          daySlots,
          isTa
            ? `பகல் கௌரி பஞ்சாங்கம் (${humanDate})`
            : isHi
              ? `दिन का गौरी पंचांग (${humanDate})`
              : `Day Gauri Panchang (${humanDate})`,
        )}

        {nightSlots.length > 0 && renderTable(
          nightSlots,
          isTa
            ? `இரவு கௌரி பஞ்சாங்கம் (${humanDate})`
            : isHi
              ? `रात का गौरी पंचांग (${humanDate})`
              : `Night Gauri Panchang (${humanDate})`,
        )}

        {/* Related links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'பஞ்சாங்கம்' : isHi ? 'पंचांग' : 'Panchang'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/gauri-panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'இன்றைய கௌரி பஞ்சாங்கம்' : isHi ? 'आज का गौरी पंचांग' : "Today's Gauri Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'சௌகாடியா' : isHi ? 'चौघड़िया' : 'Choghadiya'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'ராகு காலம்' : isHi ? 'राहु काल' : 'Rahu Kaal'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'ஹோரை' : isHi ? 'होरा' : 'Hora'}
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

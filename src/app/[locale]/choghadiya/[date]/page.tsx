import { setRequestLocale } from 'next-intl/server';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { locales } from '@/lib/i18n/config';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ChoghadiyaClient from '../Client';

export const revalidate = 86400;
export const dynamicParams = true;

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
const SEO_CITY = 'delhi';

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const NATURE_LABELS_EN: Record<string, string> = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral' };
const NATURE_LABELS_HI: Record<string, string> = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'सामान्य' };

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

/** Human-readable date: "15 May 2026" */
function formatDateHuman(y: number, m: number, d: number): string {
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

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
  const isHi = isDevanagariLocale(locale);
  const humanDate = formatDateHuman(parsed.year, parsed.month, parsed.day);
  const url = `${BASE_URL}/${locale}/choghadiya/${dateStr}`;

  // Devanagari spelling variants surfacing in GSC for the same intent — include in
  // keywords so the page reads as relevant to "चोगडिया" / "चौगडिया" / "चोघडिया" etc.
  // These long-tail variants get impressions but lose CTR because the SERP snippet
  // doesn't highlight the user's typed variant; keywords are advisory but cheap.
  const hiKeywords = [
    'चौघड़िया', 'चोगडिया', 'चौगडिया', 'चोघडिया', 'चोगड़िया',
    `चौघड़िया ${humanDate}`, 'दिन का चौघड़िया', 'रात का चौघड़िया',
    'आज का चौघड़िया', 'शुभ मुहूर्त चौघड़िया',
  ];

  // Date-first title order — matches the winning GSC query patterns where users
  // type the date BEFORE "choghadiya" (e.g. "21 may 2026 ka choghadiya"). The
  // Devanagari connector lines up with romanised "ka chaughadiya" too. May 21
  // 2026 saw 29-33% CTR on this exact query pattern; this title order puts the
  // user's typed substring at the very start of the SERP listing.
  //
  // Locale-specific connector — Hindi/Sanskrit use का, Maithili uses क (the
  // Maithili masculine singular genitive). Both still match SERP highlighting
  // against "ka" / "का" search input.
  const dateConnector = locale === 'mai' ? 'क' : 'का';

  return {
    title: isHi
      ? `${humanDate} ${dateConnector} चौघड़िया — दिन और रात के शुभ-अशुभ समय | देखो पंचांग`
      : `${humanDate} Choghadiya — Day & Night Auspicious Timings | Dekho Panchang`,
    // Maithili uses native "के लेल" (for) + "क" (of) postpositions; Hindi keeps "के लिए" + "का".
    description: isHi
      ? (locale === 'mai'
          ? `${humanDate} के लेल दिल्ली क चौघड़िया (चोगडिया)। शुभ, लाभ, अमृत, चर, रोग, काल, उद्वेग — सभ 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`
          : `${humanDate} के लिए दिल्ली का चौघड़िया (चोगडिया)। शुभ, लाभ, अमृत, चर, रोग, काल, उद्वेग — सभी 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`)
      : `Choghadiya for ${humanDate} in Delhi. All 16 day and night slots — Shubh, Labh, Amrit, Char, Rog, Kaal, Udveg — computed from sunrise and sunset.`,
    keywords: isHi ? hiKeywords : ['choghadiya', `choghadiya ${humanDate}`, 'day choghadiya', 'night choghadiya', 'shubh muhurat'],
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
  const humanDate = formatDateHuman(year, month, day);
  const city = CITIES.find((c: { slug: string }) => c.slug === SEO_CITY);

  let daySlots: SSRSlot[] = [];
  let nightSlots: SSRSlot[] = [];
  let weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0=Sun

  if (city) {
    try {
      const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
      const panchang = computePanchang({ year, month, day, lat: city.lat, lng: city.lng, tzOffset, timezone: city.timezone });
      weekday = panchang.vara?.day ?? weekday;

      if (panchang.choghadiya) {
        daySlots = panchang.choghadiya.filter(s => s.period === 'day').map(s => ({
          name: s.name.en || '', nameHi: s.name.hi || s.name.en || '',
          type: s.type, nature: s.nature, startTime: s.startTime, endTime: s.endTime,
        }));
        nightSlots = panchang.choghadiya.filter(s => s.period === 'night').map(s => ({
          name: s.name.en || '', nameHi: s.name.hi || s.name.en || '',
          type: s.type, nature: s.nature, startTime: s.startTime, endTime: s.endTime,
        }));
      }
    } catch (err) {
      console.error('[choghadiya/date] SSR computation failed:', err);
    }
  }

  const weekdayName = isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];

  // Adjacent date navigation
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const prevDate = new Date(dateObj); prevDate.setUTCDate(prevDate.getUTCDate() - 1);
  const nextDate = new Date(dateObj); nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  const prevStr = prevDate.toISOString().slice(0, 10);
  const nextStr = nextDate.toISOString().slice(0, 10);
  const todayStr = new Date().toISOString().slice(0, 10);

  const renderTable = (slots: SSRSlot[], title: string) => (
    <>
      <h2 className="text-gold-light text-xl font-semibold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>
      <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{isHi ? 'चौघड़िया' : 'Choghadiya'}</th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{isHi ? 'समय' : 'Time'}</th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{isHi ? 'स्वभाव' : 'Nature'}</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-4 text-text-primary font-medium">{isHi ? slot.nameHi : slot.name}</td>
                <td className="py-2 px-4 text-gold-light font-mono">{fmt12(slot.startTime)} – {fmt12(slot.endTime)}</td>
                <td className={`py-2 px-4 font-semibold ${natureColor(slot.nature)}`}>{isHi ? NATURE_LABELS_HI[slot.nature] || slot.nature : NATURE_LABELS_EN[slot.nature] || slot.nature}</td>
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
            ← {isHi ? 'पिछला दिन' : 'Previous'}
          </Link>
          <Link href={`/${locale}/choghadiya`} className="text-text-secondary hover:text-gold-light transition-colors">
            {isHi ? 'आज' : 'Today'}
          </Link>
          <Link href={`/${locale}/choghadiya/${nextStr}`} className="text-gold-primary hover:text-gold-light transition-colors">
            {isHi ? 'अगला दिन' : 'Next'} →
          </Link>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? `चौघड़िया — ${weekdayName}, ${humanDate}` : `Choghadiya — ${weekdayName}, ${humanDate}`}
        </h1>

        {dateStr === todayStr && (
          <p className="text-emerald-400 text-sm font-medium mt-2">{isHi ? '📅 आज' : '📅 Today'}</p>
        )}

        <p className="text-text-primary text-lg mt-4">
          {isHi
            ? `${weekdayName}, ${humanDate} को दिल्ली के लिए दिन और रात के चौघड़िया। शुभ, लाभ, अमृत काल में नए कार्य करें।`
            : `Day and night Choghadiya for Delhi on ${weekdayName}, ${humanDate}. Start new work during Shubh, Labh, Amrit periods.`}
        </p>

        {daySlots.length > 0 && renderTable(daySlots, isHi ? `दिन के चौघड़िया (${humanDate})` : `Day Choghadiya (${humanDate})`)}
        {nightSlots.length > 0 && renderTable(nightSlots, isHi ? `रात के चौघड़िया (${humanDate})` : `Night Choghadiya (${humanDate})`)}

        {/* Related links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'पंचांग' : 'Panchang'}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'आज का चौघड़िया' : "Today's Choghadiya"}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'राहु काल' : 'Rahu Kaal'}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'होरा' : 'Hora'}</Link>
        </nav>
      </div>

      {/* Interactive client component */}
      <ChoghadiyaClient />
    </main>
  );
}

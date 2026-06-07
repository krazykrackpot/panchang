import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import Link from 'next/link';
import RahuKaalClient from './Client';
import { pickRahuLabel, formatRahuLabel, ordinalRahu } from '@/lib/content/rahu-kaal-labels';

// Dynamic rendering — no ISR cache. The page shows "today's" data which
// changes daily and depends on the server clock. Caching UTC-computed dates
// caused hydration mismatch #418 when client timezone differed from UTC.

// Top 6 cities for SEO table — highest search volume for "rahu kaal today {city}"
const SEO_CITIES = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad'];

// 9-locale weekday names (Sunday=0). hi/sa/mai share canonical
// Devanagari; mr uses मंगळवार (retroflex ळ).
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

// Locale-aware city name picker (cities carry 10-locale name maps already).
function cityName(city: { name: Record<string, string | undefined> }, locale: string): string {
  return city.name[locale] ?? city.name.en ?? '';
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

// Per-weekday segment indices for Rahu/Yama/Gulika kaal. Sunday=0.
// Values are the segment number after sunrise (1..8). Pulled from
// the BPHS-standard weekday rotation table.
const RAHU_SEGMENT  = [8, 2, 7, 5, 6, 4, 3];
const YAMA_SEGMENT  = [5, 4, 3, 6, 2, 1, 7];
const GULIKA_SEGMENT = [7, 6, 5, 4, 3, 2, 1];

export default async function RahuKaalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await headers(); // Force dynamic rendering — no ISR cache
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const L = (key: string): string => pickRahuLabel(key, locale);

  // Compute rahu kaal for each city server-side
  interface CityRow {
    name: string;
    nameLocalized: string;
    sunrise: string;
    rahuKaal: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikaKaal: { start: string; end: string };
    weekday: number;
  }
  const cityData: CityRow[] = SEO_CITIES.map(slug => {
    const city = CITIES.find((c: { slug: string }) => c.slug === slug);
    if (!city) return null;
    try {
      const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
      const panchang = computePanchang({
        year, month, day,
        lat: city.lat, lng: city.lng, tzOffset,
        timezone: city.timezone,
      });
      return {
        name: city.name.en,
        nameLocalized: cityName(city, locale),
        sunrise: panchang.sunrise,
        rahuKaal: panchang.rahuKaal,
        yamaganda: panchang.yamaganda,
        gulikaKaal: panchang.gulikaKaal,
        weekday: panchang.vara?.day ?? now.getUTCDay(),
      } satisfies CityRow;
    } catch {
      return null;
    }
  }).filter((c): c is CityRow => c !== null);

  const weekday = cityData[0]?.weekday ?? now.getUTCDay();
  const weekdayName = (WEEKDAYS_BY_LOCALE[locale] ?? WEEKDAYS_BY_LOCALE.en)[weekday];
  const delhiData = cityData.find(c => c.name === 'Delhi' || c.name === 'New Delhi');

  const rahuOrd   = ordinalRahu(RAHU_SEGMENT[weekday], locale);
  const yamaOrd   = ordinalRahu(YAMA_SEGMENT[weekday], locale);
  const gulikaOrd = ordinalRahu(GULIKA_SEGMENT[weekday], locale);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {formatRahuLabel('headline', locale, { WEEKDAY: weekdayName, DATE: dateStr })}
        </h1>

        {/* Primary answer — what Google shows in featured snippets */}
        {delhiData && (
          <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
            {formatRahuLabel('primaryAnswer', locale, {
              WEEKDAY: weekdayName,
              START: fmt12(delhiData.rahuKaal.start),
              END: fmt12(delhiData.rahuKaal.end),
            })}
          </p>
        )}

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {L('introNote')}
        </p>

        {/* ═══ City-wise Rahu Kaal Table — the content Google needs ═══ */}
        {cityData.length > 0 && (
          <div className="mt-6 rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{L('city')}</th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">{L('rahuKaal')}</th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">{L('yamaganda')}</th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">{L('gulika')}</th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden md:table-cell">{L('sunrise')}</th>
                </tr>
              </thead>
              <tbody>
                {cityData.map((city) => (
                  <tr key={city.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-2 px-4 text-text-primary font-medium">{city.nameLocalized}</td>
                    <td className="py-2 px-4 text-red-400 font-mono font-semibold">{fmt12(city.rahuKaal.start)} – {fmt12(city.rahuKaal.end)}</td>
                    <td className="py-2 px-4 text-amber-400/80 font-mono hidden sm:table-cell">{fmt12(city.yamaganda.start)} – {fmt12(city.yamaganda.end)}</td>
                    <td className="py-2 px-4 text-amber-400/60 font-mono hidden sm:table-cell">{fmt12(city.gulikaKaal.start)} – {fmt12(city.gulikaKaal.end)}</td>
                    <td className="py-2 px-4 text-text-secondary font-mono hidden md:table-cell">{fmt12(city.sunrise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Explanatory content for SEO — answers "what is rahu kaal" */}
        <div className="mt-6 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {L('edu1Heading')}
          </h2>
          <p>{L('edu1Body')}</p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {L('edu2Heading')}
          </h2>
          <p>{L('edu2Body')}</p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {formatRahuLabel('edu3HeadingTemplate', locale, { WEEKDAY: weekdayName })}
          </h2>
          <p>
            {formatRahuLabel('edu3BodyTemplate', locale, {
              WEEKDAY: weekdayName,
              RAHU: rahuOrd,
              YAMA: yamaOrd,
              GULIKA: gulikaOrd,
            })}
          </p>
        </div>

        {/* Internal links for SEO */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L('todaysPanchang')}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L('choghadiya')}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L('horaChart')}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L('auspiciousMuhurat')}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {L('festivalCalendar')}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive city selector, timeline, countdown ═══ */}
      <RahuKaalClient />
    </div>
  );
}

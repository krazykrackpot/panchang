import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';
import Link from 'next/link';
import ChoghadiyaClient from './Client';

// Dynamic rendering — no ISR cache (time-dependent content).
// SEO city resolved per-locale via getSeoCityForLocale() inside the
// handler; see cities.ts SEO_CITY_BY_LOCALE map.

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const NATURE_LABELS_EN: Record<string, string> = {
  auspicious: 'Auspicious',
  inauspicious: 'Inauspicious',
  neutral: 'Neutral',
};
const NATURE_LABELS_HI: Record<string, string> = {
  auspicious: 'शुभ',
  inauspicious: 'अशुभ',
  neutral: 'सामान्य',
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
  name: string;
  nameHi: string;
  type: string;
  nature: string;
  startTime: string;
  endTime: string;
}

export default async function ChoghadiyaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await headers(); // Force dynamic rendering
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const city = getSeoCityForLocale(locale);

  // Resolve "today" in the SSR city's timezone (Asia/Kolkata for Delhi).
  // `getUTCFullYear()` etc. would render yesterday's choghadiya for IST
  // users hitting the page between midnight and 05:30 IST.
  const todayLocalStr = todayInTimezone(city?.timezone ?? 'UTC');
  const [year, month, day] = todayLocalStr.split('-').map(Number);
  const dateStr = todayLocalStr;

  let daySlots: SSRSlot[] = [];
  let nightSlots: SSRSlot[] = [];
  let weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  if (city) {
    try {
      const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
      const panchang = computePanchang({
        year, month, day,
        lat: city.lat, lng: city.lng, tzOffset,
        timezone: city.timezone,
      });
      weekday = panchang.vara?.day ?? weekday;

      if (panchang.choghadiya) {
        daySlots = panchang.choghadiya
          .filter(s => s.period === 'day')
          .map(s => ({
            name: s.name.en || '',
            nameHi: s.name.hi || s.name.en || '',
            type: s.type,
            nature: s.nature,
            startTime: s.startTime,
            endTime: s.endTime,
          }));

        nightSlots = panchang.choghadiya
          .filter(s => s.period === 'night')
          .map(s => ({
            name: s.name.en || '',
            nameHi: s.name.hi || s.name.en || '',
            type: s.type,
            nature: s.nature,
            startTime: s.startTime,
            endTime: s.endTime,
          }));
      }
    } catch (err) {
      console.error('[choghadiya] SSR panchang computation failed:', err);
    }
  }

  const weekdayName = isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];

  const renderTable = (slots: SSRSlot[], title: string) => (
    <>
      <h2 className="text-gold-light text-xl font-semibold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h2>
      <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {isHi ? 'चौघड़िया' : 'Choghadiya'}
              </th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {isHi ? 'समय' : 'Time'}
              </th>
              <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                {isHi ? 'स्वभाव' : 'Nature'}
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="py-2 px-4 text-text-primary font-medium">{isHi ? slot.nameHi : slot.name}</td>
                <td className="py-2 px-4 text-gold-light font-mono">{fmt12(slot.startTime)} – {fmt12(slot.endTime)}</td>
                <td className={`py-2 px-4 font-semibold ${natureColor(slot.nature)}`}>
                  {isHi ? NATURE_LABELS_HI[slot.nature] || slot.nature : NATURE_LABELS_EN[slot.nature] || slot.nature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `आज का चौघड़िया — ${weekdayName}, ${dateStr}` : `Choghadiya Today — ${weekdayName}, ${dateStr}`}
        </h1>

        <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
          {isHi
            ? `आज ${weekdayName} को दिल्ली के लिए दिन और रात के चौघड़िया समय। शुभ, लाभ, अमृत काल में नए कार्य करें; रोग, काल, उद्वेग से बचें।`
            : `Today's day and night Choghadiya timings for Delhi on ${weekdayName}. Start new work during Shubh, Labh, Amrit slots; avoid Rog, Kaal, Udveg periods.`}
        </p>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'चौघड़िया सूर्योदय और सूर्यास्त के आधार पर गणना किए जाते हैं, इसलिए प्रत्येक शहर के लिए समय भिन्न होता है। नीचे इंटरैक्टिव टूल में अपना शहर चुनें।'
            : 'Choghadiya slots are computed from sunrise and sunset, so times vary by city. Use the interactive tool below to select your city for precise timings.'}
        </p>

        {/* ═══ Day Choghadiya Table ═══ */}
        {daySlots.length > 0 && renderTable(daySlots, isHi ? `दिन के चौघड़िया — दिल्ली (${dateStr})` : `Day Choghadiya — Delhi (${dateStr})`)}

        {/* ═══ Night Choghadiya Table ═══ */}
        {nightSlots.length > 0 && renderTable(nightSlots, isHi ? `रात के चौघड़िया — दिल्ली (${dateStr})` : `Night Choghadiya — Delhi (${dateStr})`)}

        {/* Explanatory content for SEO */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'चौघड़िया क्या है?' : 'What is Choghadiya?'}
          </h2>
          <p>
            {isHi
              ? 'चौघड़िया (चतुर्घटिका) एक वैदिक ज्योतिष प्रणाली है जो प्रत्येक दिन और रात को 8-8 भागों में विभाजित करती है। प्रत्येक भाग लगभग 90 मिनट का होता है (सूर्योदय से सूर्यास्त तक दिन के और सूर्यास्त से सूर्योदय तक रात के)। यह मुहूर्त शास्त्र का एक सरल और लोकप्रिय तरीका है — विशेषकर गुजरात, राजस्थान और मध्य प्रदेश में व्यापक रूप से प्रयुक्त।'
              : 'Choghadiya (Chaturghatikas) is a Vedic astrology system that divides each day and night into 8 equal parts. Each part lasts approximately 90 minutes (day slots from sunrise to sunset, night slots from sunset to next sunrise). It is one of the simplest and most popular methods of muhurta selection — widely used in Gujarat, Rajasthan, and Madhya Pradesh for choosing auspicious times.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'चौघड़िया के सात प्रकार' : 'The Seven Types of Choghadiya'}
          </h2>
          <p>
            {isHi
              ? 'अमृत (अत्यन्त शुभ) — सभी कार्यों के लिए उत्तम। शुभ — शुभ कार्य, व्यापार, यात्रा के लिए अच्छा। लाभ — लाभदायक कार्य, व्यापार, खरीद-बिक्री के लिए। चर (सामान्य) — यात्रा के लिए ठीक, अन्य कार्यों के लिए सामान्य। रोग (अशुभ) — स्वास्थ्य समस्याओं का संकेत, शुभ कार्य टालें। काल (अशुभ) — हानि और बाधाओं का संकेत। उद्वेग (अशुभ) — चिंता और तनाव का संकेत, सरकारी कार्य को छोड़कर टालें।'
              : 'Amrit (highly auspicious) — best for all activities. Shubh (auspicious) — good for ceremonies, business, travel. Labh (profitable) — ideal for financial transactions, purchases, and trade. Char (neutral) — acceptable for travel, ordinary for other tasks. Rog (inauspicious) — indicates health issues, avoid auspicious work. Kaal (inauspicious) — signifies losses and obstacles. Udveg (inauspicious) — indicates anxiety and stress, avoid except for government work.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'चौघड़िया की गणना कैसे होती है?' : 'How is Choghadiya Calculated?'}
          </h2>
          <p>
            {isHi
              ? 'दिन के चौघड़िया: सूर्योदय से सूर्यास्त तक के समय को 8 बराबर भागों में विभाजित किया जाता है। रात के चौघड़िया: सूर्यास्त से अगले दिन सूर्योदय तक 8 भागों में। प्रत्येक वार (दिन) के लिए चौघड़िया क्रम अलग होता है — यह वार के ग्रह स्वामी पर निर्भर करता है। क्योंकि सूर्योदय और सूर्यास्त का समय भौगोलिक स्थान के अनुसार बदलता है, प्रत्येक शहर के लिए चौघड़िया समय भिन्न होता है।'
              : 'Day Choghadiya: the time between sunrise and sunset is divided into 8 equal parts. Night Choghadiya: sunset to next sunrise, also 8 parts. The sequence of Choghadiya types varies by weekday — it depends on the planetary lord of the day. Because sunrise and sunset vary by geographic location, Choghadiya times differ for each city.'}
          </p>
        </div>

        {/* Internal links for SEO */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'राहु काल' : 'Rahu Kaal'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'होरा' : 'Hora Chart'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/panchang/auspicious" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'शुभ मुहूर्त' : 'Auspicious Timings'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'मुहूर्त AI' : 'Muhurat AI'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'त्योहार कैलेंडर' : 'Festival Calendar'}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive city selector, day/night slots, educational content ═══
          The Client defers ALL rendering until after hydration via an internal
          `if (!hydrated) return null` guard (CLAUDE.md Lesson ZD), so no props
          are needed — the SEO content above is already server-rendered for crawlers
          and the interactive UI mounts ~50ms after hydration. */}
      <ChoghadiyaClient />
    </div>
  );
}

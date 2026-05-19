import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import Link from 'next/link';
import RahuKaalClient from './Client';

// Dynamic rendering — no ISR cache. The page shows "today's" data which
// changes daily and depends on the server clock. Caching UTC-computed dates
// caused hydration mismatch #418 when client timezone differed from UTC.

// Top 6 cities for SEO table — highest search volume for "rahu kaal today {city}"
const SEO_CITIES = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad'];

// Weekday names for the "today" context
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

export default async function RahuKaalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await headers(); // Force dynamic rendering — no ISR cache
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Compute rahu kaal for each city server-side
  interface CityRow {
    name: string;
    nameHi: string;
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
        nameHi: city.name.hi || city.name.en,
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
  const weekdayName = isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];
  const delhiData = cityData.find(c => c.name === 'Delhi' || c.name === 'New Delhi');

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `आज का राहु काल — ${weekdayName}, ${dateStr}` : `Rahu Kaal Today — ${weekdayName}, ${dateStr}`}
        </h1>

        {/* Primary answer — what Google shows in featured snippets */}
        {delhiData && (
          <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
            {isHi
              ? `आज ${weekdayName} को राहु काल ${fmt12(delhiData.rahuKaal.start)} से ${fmt12(delhiData.rahuKaal.end)} तक है (दिल्ली)। इस अवधि में नए कार्य आरंभ न करें।`
              : `Today's Rahu Kaal on ${weekdayName} is ${fmt12(delhiData.rahuKaal.start)} to ${fmt12(delhiData.rahuKaal.end)} (Delhi). Avoid starting new ventures during this period.`}
          </p>
        )}

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'राहु काल प्रतिदिन ~90 मिनट का अशुभ काल है। यह सूर्योदय और सूर्यास्त से गणना किया जाता है, इसलिए प्रत्येक शहर के लिए समय अलग होता है।'
            : 'Rahu Kaal is a ~90-minute inauspicious period every day. It is calculated from sunrise and sunset, so times differ for each city.'}
        </p>

        {/* ═══ City-wise Rahu Kaal Table — the content Google needs ═══ */}
        {cityData.length > 0 && (
          <div className="mt-6 rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'शहर' : 'City'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'राहु काल' : 'Rahu Kaal'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'यमगण्ड' : 'Yamaganda'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'गुलिक काल' : 'Gulika Kaal'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    {isHi ? 'सूर्योदय' : 'Sunrise'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cityData.map((city) => (
                  <tr key={city.name} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-2 px-4 text-text-primary font-medium">{isHi ? city.nameHi : city.name}</td>
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
            {isHi ? 'राहु काल क्या है?' : 'What is Rahu Kaal?'}
          </h2>
          <p>
            {isHi
              ? 'राहु काल वैदिक ज्योतिष में एक अशुभ समय खण्ड है जो प्रतिदिन लगभग 90 मिनट का होता है। इसकी गणना सूर्योदय से सूर्यास्त तक के समय को 8 भागों में विभाजित करके की जाती है। प्रत्येक दिन का राहु काल अलग क्रम में आता है — रविवार को 8वाँ भाग, सोमवार को 2रा, मंगलवार को 7वाँ, बुधवार को 5वाँ, गुरुवार को 6ठा, शुक्रवार को 4था, और शनिवार को 3रा भाग राहु काल होता है।'
              : 'Rahu Kaal is an inauspicious time period in Vedic astrology that occurs daily for approximately 90 minutes. It is calculated by dividing the time between sunrise and sunset into 8 equal parts. Each day of the week has Rahu Kaal in a different segment — Sunday in the 8th part, Monday in the 2nd, Tuesday in the 7th, Wednesday in the 5th, Thursday in the 6th, Friday in the 4th, and Saturday in the 3rd part.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'राहु काल में क्या नहीं करना चाहिए?' : 'What to Avoid During Rahu Kaal?'}
          </h2>
          <p>
            {isHi
              ? 'राहु काल में नए कार्य आरंभ करना, अनुबंध पर हस्ताक्षर करना, यात्रा प्रारंभ करना, या कोई महत्वपूर्ण निर्णय लेना वर्जित माना जाता है। हालाँकि, पहले से शुरू किए गए कार्यों को जारी रखने में कोई बाधा नहीं है।'
              : 'During Rahu Kaal, it is considered inauspicious to start new ventures, sign contracts, begin travel, or make important decisions. However, continuing work that was already started before Rahu Kaal is not affected.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? `आज ${weekdayName} को राहु काल का क्रम` : `Rahu Kaal Order for ${weekdayName}`}
          </h2>
          <p>
            {isHi
              ? `${weekdayName} को राहु काल सूर्योदय से ${['8वें', '2रे', '7वें', '5वें', '6ठे', '4थे', '3रे'][weekday]} भाग में आता है। यमगण्ड ${['5वें', '4थे', '3रे', '6ठे', '2रे', '1ले', '7वें'][weekday]} भाग में, और गुलिक काल ${['7वें', '6ठे', '5वें', '4थे', '3रे', '2रे', '1ले'][weekday]} भाग में आता है।`
              : `On ${weekdayName}, Rahu Kaal falls in the ${['8th', '2nd', '7th', '5th', '6th', '4th', '3rd'][weekday]} segment after sunrise. Yamaganda falls in the ${['5th', '4th', '3rd', '6th', '2nd', '1st', '7th'][weekday]} segment, and Gulika Kaal in the ${['7th', '6th', '5th', '4th', '3rd', '2nd', '1st'][weekday]} segment.`}
          </p>
        </div>

        {/* Internal links for SEO */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'चौघड़िया' : 'Choghadiya'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'होरा' : 'Hora Chart'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'शुभ मुहूर्त' : 'Auspicious Muhurat'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'त्योहार कैलेंडर' : 'Festival Calendar'}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive city selector, timeline, countdown ═══ */}
      <RahuKaalClient />
    </div>
  );
}


import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import Link from 'next/link';
import AuspiciousClient from './Client';

export const revalidate = 86400;

const SEO_CITY = 'delhi';

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

interface TimeWindow { start: string; end: string }

interface AuspiciousRow {
  name: string;
  nameHi: string;
  time: string;
  nature: 'auspicious' | 'inauspicious';
  description: string;
  descriptionHi: string;
}

export default async function AuspiciousPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const city = CITIES.find((c: { slug: string }) => c.slug === SEO_CITY);

  let rows: AuspiciousRow[] = [];
  let weekday = now.getUTCDay();

  if (city) {
    try {
      const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
      const panchang = computePanchang({
        year, month, day,
        lat: city.lat, lng: city.lng, tzOffset,
        timezone: city.timezone,
      });
      weekday = panchang.vara?.day ?? weekday;

      const fmtWindow = (w: TimeWindow) => `${fmt12(w.start)} – ${fmt12(w.end)}`;

      // Auspicious timings
      if (panchang.brahmaMuhurta) {
        rows.push({
          name: 'Brahma Muhurta', nameHi: 'ब्रह्म मुहूर्त',
          time: fmtWindow(panchang.brahmaMuhurta), nature: 'auspicious',
          description: 'Pre-dawn sacred period (~96 min before sunrise). Ideal for meditation, study, and spiritual practice.',
          descriptionHi: 'सूर्योदय से ~96 मिनट पहले का पवित्र काल। ध्यान, अध्ययन और आध्यात्मिक साधना के लिए श्रेष्ठ।',
        });
      }

      {
        const abh = panchang.abhijitMuhurta;
        const isWed = weekday === 3;
        rows.push({
          name: 'Abhijit Muhurta', nameHi: 'अभिजित मुहूर्त',
          time: fmtWindow(abh), nature: isWed ? 'inauspicious' : 'auspicious',
          description: isWed
            ? 'Abhijit Muhurta is NOT auspicious on Wednesdays. The 8th muhurta of the day is otherwise the most powerful auspicious window.'
            : 'The 8th muhurta of the day — the most auspicious time window. Named after Nakshatra Abhijit (Vega). Ideal for all important activities.',
          descriptionHi: isWed
            ? 'बुधवार को अभिजित मुहूर्त शुभ नहीं माना जाता। अन्य दिनों में यह दिन का सबसे शक्तिशाली शुभ काल है।'
            : 'दिन का 8वाँ मुहूर्त — सबसे शुभ समय खण्ड। नक्षत्र अभिजित (वेगा) के नाम पर। सभी महत्वपूर्ण कार्यों के लिए उत्तम।',
        });
      }

      if (panchang.amritKalamAll && panchang.amritKalamAll.length > 0) {
        panchang.amritKalamAll.forEach((w: TimeWindow) => {
          rows.push({
            name: 'Amrit Kalam', nameHi: 'अमृत काल',
            time: fmtWindow(w), nature: 'auspicious',
            description: 'Nakshatra-based nectar period — the most auspicious window of the day. Perfect for new beginnings, worship, and important decisions.',
            descriptionHi: 'नक्षत्र-आधारित अमृत काल — दिन का सबसे शुभ खण्ड। नए कार्य, पूजा और महत्वपूर्ण निर्णयों के लिए उत्तम।',
          });
        });
      } else if (panchang.amritKalam) {
        rows.push({
          name: 'Amrit Kalam', nameHi: 'अमृत काल',
          time: fmtWindow(panchang.amritKalam), nature: 'auspicious',
          description: 'Nakshatra-based nectar period — the most auspicious window of the day.',
          descriptionHi: 'नक्षत्र-आधारित अमृत काल — दिन का सबसे शुभ खण्ड।',
        });
      }

      // Inauspicious timings
      rows.push({
        name: 'Rahu Kaal', nameHi: 'राहु काल',
        time: fmtWindow(panchang.rahuKaal), nature: 'inauspicious',
        description: '~90-minute inauspicious period ruled by Rahu. Avoid new ventures, travel, and important decisions.',
        descriptionHi: 'राहु द्वारा शासित ~90 मिनट की अशुभ अवधि। नए कार्य, यात्रा और महत्वपूर्ण निर्णय टालें।',
      });

      rows.push({
        name: 'Yamaganda', nameHi: 'यमगण्ड',
        time: fmtWindow(panchang.yamaganda), nature: 'inauspicious',
        description: 'Inauspicious period ruled by Yama, lord of death. Particularly unfavourable for travel.',
        descriptionHi: 'यम (मृत्यु देव) द्वारा शासित अशुभ काल। यात्रा के लिए विशेष रूप से प्रतिकूल।',
      });

      rows.push({
        name: 'Gulika Kaal', nameHi: 'गुलिक काल',
        time: fmtWindow(panchang.gulikaKaal), nature: 'inauspicious',
        description: 'Period ruled by Gulika (son of Saturn). Unfavourable for financial decisions and new beginnings.',
        descriptionHi: 'शनि-पुत्र गुलिक द्वारा शासित अवधि। वित्तीय निर्णयों और नए कार्यों के लिए प्रतिकूल।',
      });

      if (panchang.varjyamAll && panchang.varjyamAll.length > 0) {
        panchang.varjyamAll.forEach((w: TimeWindow) => {
          rows.push({
            name: 'Varjyam', nameHi: 'वर्ज्यम्',
            time: fmtWindow(w), nature: 'inauspicious',
            description: 'Nakshatra-based forbidden period. Avoid all auspicious activities during this window.',
            descriptionHi: 'नक्षत्र-आधारित अशुभ काल। इस समय शुभ कार्य टालें।',
          });
        });
      } else if (panchang.varjyam) {
        rows.push({
          name: 'Varjyam', nameHi: 'वर्ज्यम्',
          time: fmtWindow(panchang.varjyam), nature: 'inauspicious',
          description: 'Nakshatra-based forbidden period. Avoid all auspicious activities during this window.',
          descriptionHi: 'नक्षत्र-आधारित अशुभ काल। इस समय शुभ कार्य टालें।',
        });
      }

      if (panchang.durMuhurtam && panchang.durMuhurtam.length > 0) {
        panchang.durMuhurtam.forEach((w: TimeWindow) => {
          rows.push({
            name: 'Dur Muhurtam', nameHi: 'दुर्मुहूर्त',
            time: fmtWindow(w), nature: 'inauspicious',
            description: 'An inauspicious muhurta. Avoid starting any new work or important activity.',
            descriptionHi: 'अशुभ मुहूर्त। नया कार्य या महत्वपूर्ण गतिविधि आरंभ न करें।',
          });
        });
      }
    } catch (err) {
      console.error('[auspicious] SSR panchang computation failed:', err);
    }
  }

  const weekdayName = isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];
  const auspiciousRows = rows.filter(r => r.nature === 'auspicious');
  const inauspiciousRows = rows.filter(r => r.nature === 'inauspicious');

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `आज के शुभ-अशुभ मुहूर्त — ${weekdayName}, ${dateStr}` : `Auspicious & Inauspicious Timings Today — ${weekdayName}, ${dateStr}`}
        </h1>

        <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
          {isHi
            ? `आज ${weekdayName} को दिल्ली के लिए शुभ और अशुभ समय। अभिजित मुहूर्त, ब्रह्म मुहूर्त, अमृत काल, राहु काल, यमगण्ड और अन्य महत्वपूर्ण मुहूर्तों का विवरण।`
            : `Today's auspicious and inauspicious time windows for Delhi on ${weekdayName}. Includes Abhijit Muhurta, Brahma Muhurta, Amrit Kalam, Rahu Kaal, Yamaganda, and other important muhurtas.`}
        </p>

        {/* ═══ Auspicious Timings Table ═══ */}
        {auspiciousRows.length > 0 && (
          <>
            <h2 className="text-gold-light text-xl font-semibold mt-8 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {isHi ? 'शुभ मुहूर्त (दिल्ली)' : 'Auspicious Timings (Delhi)'}
            </h2>
            <div className="rounded-xl border border-emerald-500/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-500/[0.06] border-b border-emerald-500/12">
                    <th className="text-left py-2.5 px-4 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      {isHi ? 'मुहूर्त' : 'Muhurta'}
                    </th>
                    <th className="text-left py-2.5 px-4 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      {isHi ? 'समय' : 'Time'}
                    </th>
                    <th className="text-left py-2.5 px-4 text-emerald-400 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                      {isHi ? 'विवरण' : 'Description'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auspiciousRows.map((row, i) => (
                    <tr key={`a-${i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-2 px-4 text-text-primary font-medium">{isHi ? row.nameHi : row.name}</td>
                      <td className="py-2 px-4 text-emerald-400 font-mono font-semibold">{row.time}</td>
                      <td className="py-2 px-4 text-text-secondary text-xs hidden sm:table-cell">{isHi ? row.descriptionHi : row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═══ Inauspicious Timings Table ═══ */}
        {inauspiciousRows.length > 0 && (
          <>
            <h2 className="text-red-400 text-xl font-semibold mt-8 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {isHi ? 'अशुभ काल (दिल्ली)' : 'Inauspicious Periods (Delhi)'}
            </h2>
            <div className="rounded-xl border border-red-500/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-500/[0.06] border-b border-red-500/12">
                    <th className="text-left py-2.5 px-4 text-red-400 text-xs font-semibold uppercase tracking-wider">
                      {isHi ? 'काल' : 'Period'}
                    </th>
                    <th className="text-left py-2.5 px-4 text-red-400 text-xs font-semibold uppercase tracking-wider">
                      {isHi ? 'समय' : 'Time'}
                    </th>
                    <th className="text-left py-2.5 px-4 text-red-400 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                      {isHi ? 'विवरण' : 'Description'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inauspiciousRows.map((row, i) => (
                    <tr key={`i-${i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-2 px-4 text-text-primary font-medium">{isHi ? row.nameHi : row.name}</td>
                      <td className="py-2 px-4 text-red-400 font-mono font-semibold">{row.time}</td>
                      <td className="py-2 px-4 text-text-secondary text-xs hidden sm:table-cell">{isHi ? row.descriptionHi : row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Explanatory content for SEO */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'शुभ-अशुभ मुहूर्त क्या हैं?' : 'What Are Auspicious & Inauspicious Timings?'}
          </h2>
          <p>
            {isHi
              ? 'वैदिक ज्योतिष में प्रत्येक दिन कुछ समय शुभ और कुछ अशुभ माने जाते हैं। ये समय सूर्योदय, सूर्यास्त, नक्षत्र और ग्रहों की स्थिति के आधार पर गणना किए जाते हैं। शुभ मुहूर्त में नए कार्य, पूजा, और महत्वपूर्ण निर्णय लेने चाहिए। अशुभ काल में नए कार्य आरंभ करने से बचना चाहिए।'
              : 'In Vedic astrology, each day contains both auspicious and inauspicious time windows. These are calculated based on sunrise, sunset, nakshatra positions, and planetary configurations. Auspicious muhurtas like Abhijit Muhurta and Amrit Kalam are ideal for new ventures, worship, and important decisions. Inauspicious periods like Rahu Kaal, Yamaganda, and Varjyam should be avoided for initiating new activities.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'अभिजित मुहूर्त — दिन का सबसे शुभ समय' : 'Abhijit Muhurta — The Most Auspicious Time of Day'}
          </h2>
          <p>
            {isHi
              ? 'अभिजित मुहूर्त दिन का 8वाँ मुहूर्त है, जो मध्याह्न के आसपास आता है। इसका नाम 28वें नक्षत्र अभिजित (वेगा तारा) के नाम पर है। यह विजय का मुहूर्त माना जाता है और सभी शुभ कार्यों के लिए उत्तम है। ध्यान दें कि बुधवार को अभिजित मुहूर्त शुभ नहीं माना जाता।'
              : 'Abhijit Muhurta is the 8th muhurta of the day, falling around midday. Named after the 28th nakshatra Abhijit (the star Vega), it is considered the muhurta of victory and is ideal for all auspicious activities. Note that Abhijit Muhurta is NOT considered auspicious on Wednesdays.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'राहु काल, यमगण्ड और गुलिक काल' : 'Rahu Kaal, Yamaganda & Gulika Kaal'}
          </h2>
          <p>
            {isHi
              ? 'ये तीन प्रमुख अशुभ काल हैं जो सूर्योदय से सूर्यास्त तक के समय को 8 भागों में विभाजित करके निकाले जाते हैं। राहु काल सबसे अशुभ माना जाता है — इसमें नए कार्य, अनुबंध और यात्रा वर्जित हैं। यमगण्ड यम (मृत्यु देव) से संबंधित है और यात्रा के लिए विशेष रूप से प्रतिकूल है। गुलिक काल शनि-पुत्र गुलिक द्वारा शासित है।'
              : 'These three major inauspicious periods are derived by dividing the time between sunrise and sunset into 8 equal parts. Rahu Kaal is the most inauspicious — new ventures, contracts, and travel should be avoided. Yamaganda is associated with Yama (lord of death) and is particularly unfavourable for travel. Gulika Kaal is ruled by Gulika, son of Saturn. Each rotates to a different segment of the day depending on the weekday.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'वर्ज्यम् और अमृत काल' : 'Varjyam & Amrit Kalam'}
          </h2>
          <p>
            {isHi
              ? 'वर्ज्यम् और अमृत काल नक्षत्र-आधारित समय खण्ड हैं। प्रत्येक नक्षत्र में एक विशिष्ट घटी-खण्ड वर्ज्य (निषिद्ध) होता है और एक अमृत (अत्यन्त शुभ) होता है। वर्ज्यम् में शुभ कार्य वर्जित हैं, जबकि अमृत काल दिन का सबसे शुभ समय है — नए कार्य, पूजा और महत्वपूर्ण निर्णयों के लिए आदर्श।'
              : 'Varjyam and Amrit Kalam are nakshatra-based time windows. Each nakshatra has a specific ghati span that is varjya (forbidden) and one that is amrit (highly auspicious). Varjyam should be avoided for all auspicious activities, while Amrit Kalam is the most auspicious window of the day — ideal for new beginnings, worship, and important decisions.'}
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
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'चौघड़िया' : 'Choghadiya'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'होरा' : 'Hora Chart'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'शुभ मुहूर्त AI' : 'Auspicious Muhurat AI'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'त्योहार कैलेंडर' : 'Festival Calendar'}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive date/location selector, full card grid ═══ */}
      <AuspiciousClient />
    </main>
  );
}

import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import Link from 'next/link';
import HoraClient from './Client';

// Dynamic rendering — no ISR cache. See rahu-kaal/page.tsx comment.

const SEO_CITY = 'delhi';

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

// Planet nature for colour coding
const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus

interface SSRHoraSlot {
  planet: string;
  planetHi: string;
  planetId: number;
  startTime: string;
  endTime: string;
  nature: string;
}

// Activity recommendations per planet
const HORA_ACTIVITIES_EN: Record<number, string> = {
  0: 'Government work, authority matters, health',        // Sun
  1: 'Travel, public relations, creativity',               // Moon
  2: 'Property, legal disputes, surgery, courage',         // Mars
  3: 'Education, communication, writing, trade',           // Mercury
  4: 'Finance, teaching, religious activities, marriage',   // Jupiter
  5: 'Arts, entertainment, romance, luxury purchases',     // Venus
  6: 'Agriculture, iron/steel work, labour, discipline',   // Saturn
};
const HORA_ACTIVITIES_HI: Record<number, string> = {
  0: 'सरकारी कार्य, अधिकार, स्वास्थ्य',
  1: 'यात्रा, जनसंपर्क, रचनात्मकता',
  2: 'संपत्ति, कानूनी विवाद, शल्य चिकित्सा, साहस',
  3: 'शिक्षा, संचार, लेखन, व्यापार',
  4: 'वित्त, शिक्षण, धार्मिक कार्य, विवाह',
  5: 'कला, मनोरंजन, प्रेम, विलासिता की खरीद',
  6: 'कृषि, लोहा/इस्पात कार्य, श्रम, अनुशासन',
};

export default async function HoraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await headers(); // Force dynamic rendering — no ISR cache
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const city = CITIES.find((c: { slug: string }) => c.slug === SEO_CITY);

  let horaSlots: SSRHoraSlot[] = [];
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

      if (panchang.hora) {
        horaSlots = panchang.hora.map(h => ({
          planet: h.planet.en || '',
          planetHi: h.planet.hi || h.planet.en || '',
          planetId: h.planetId,
          startTime: h.startTime,
          endTime: h.endTime,
          nature: h.nature,
        }));
      }
    } catch (err) {
      console.error('[hora] SSR panchang computation failed:', err);
    }
  }

  const weekdayName = isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `होरा — ग्रह घण्टे — ${weekdayName}, ${dateStr}` : `Hora — Planetary Hours — ${weekdayName}, ${dateStr}`}
        </h1>

        <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
          {isHi
            ? `आज ${weekdayName} को दिल्ली के लिए सभी 24 ग्रह होरा। प्रत्येक घंटा एक ग्रह द्वारा शासित है — अपने कार्यों के लिए सही होरा चुनें।`
            : `Today's complete 24 planetary hora schedule for Delhi on ${weekdayName}. Each hour is ruled by a planet in the Chaldean sequence — choose the right hora for your activities.`}
        </p>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'होरा सूर्योदय और सूर्यास्त के आधार पर गणना किए जाते हैं। प्रत्येक शहर के लिए समय भिन्न होता है। नीचे इंटरैक्टिव टूल में अपना शहर चुनें।'
            : 'Hora slots are calculated from sunrise and sunset, so times vary by city. Use the interactive tool below to select your city.'}
        </p>

        {/* ═══ Hora Table — 24 slots ═══ */}
        {horaSlots.length > 0 && (
          <>
            <h2 className="text-gold-light text-xl font-semibold mt-6 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {isHi ? `आज के 24 होरा — दिल्ली (${dateStr})` : `Today's 24 Hora Slots — Delhi (${dateStr})`}
            </h2>
            <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                    <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                      {isHi ? 'ग्रह' : 'Planet'}
                    </th>
                    <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                      {isHi ? 'समय' : 'Time'}
                    </th>
                    <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                      {isHi ? 'उपयुक्त कार्य' : 'Best For'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {horaSlots.map((slot, i) => {
                    const isBenefic = BENEFIC_IDS.has(slot.planetId);
                    const planetColor = isBenefic ? 'text-emerald-400' : 'text-amber-400';
                    return (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="py-2 px-4 text-text-secondary font-mono text-xs">{i + 1}</td>
                        <td className={`py-2 px-4 font-semibold ${planetColor}`}>
                          {isHi ? slot.planetHi : slot.planet}
                        </td>
                        <td className="py-2 px-4 text-gold-light font-mono">
                          {fmt12(slot.startTime)} – {fmt12(slot.endTime)}
                        </td>
                        <td className="py-2 px-4 text-text-secondary text-xs hidden sm:table-cell">
                          {isHi
                            ? (HORA_ACTIVITIES_HI[slot.planetId] || '')
                            : (HORA_ACTIVITIES_EN[slot.planetId] || '')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Explanatory content for SEO */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'होरा क्या है?' : 'What is Hora?'}
          </h2>
          <p>
            {isHi
              ? 'होरा (Hora) वैदिक ज्योतिष में ग्रहों के घंटों की प्रणाली है। दिन और रात को 12-12 होरा में विभाजित किया जाता है, कुल 24 होरा प्रतिदिन। प्रत्येक होरा एक ग्रह (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) द्वारा शासित होता है। यह "कैल्डियन क्रम" (Chaldean order) पर आधारित है — ग्रहों को उनकी कक्षीय अवधि के अनुसार क्रमबद्ध किया गया है।'
              : 'Hora is the Vedic astrology system of planetary hours. Each day and night is divided into 12 horas each, totalling 24 horas per day. Each hora is ruled by one of the seven classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) in the "Chaldean order" — planets ordered by their orbital period from slowest to fastest.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'कौन सा होरा किस कार्य के लिए?' : 'Which Hora is Good for Which Activity?'}
          </h2>
          <p>
            {isHi
              ? 'सूर्य होरा: सरकारी कार्य, अधिकार और स्वास्थ्य। चन्द्र होरा: यात्रा, जनसंपर्क और रचनात्मकता। मंगल होरा: संपत्ति, कानूनी विवाद और साहसिक कार्य। बुध होरा: शिक्षा, संचार, लेखन और व्यापार। गुरु होरा: वित्त, धार्मिक कार्य और विवाह (सबसे शुभ)। शुक्र होरा: कला, मनोरंजन, प्रेम और विलासिता। शनि होरा: कृषि, लोहा/इस्पात कार्य और श्रम।'
              : 'Sun Hora: government work, authority, health matters. Moon Hora: travel, public relations, creative work. Mars Hora: property, legal matters, surgery, courageous acts. Mercury Hora: education, communication, writing, trade. Jupiter Hora: finance, teaching, religious ceremonies, marriage (most auspicious). Venus Hora: arts, entertainment, romance, luxury purchases. Saturn Hora: agriculture, iron/steel work, disciplined labour.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'होरा की गणना कैसे होती है?' : 'How is Hora Calculated?'}
          </h2>
          <p>
            {isHi
              ? 'दिन के 12 होरा: सूर्योदय से सूर्यास्त तक का समय 12 बराबर भागों में विभाजित। रात के 12 होरा: सूर्यास्त से अगले सूर्योदय तक 12 भागों में। पहला होरा वार के स्वामी ग्रह का होता है (रविवार = सूर्य, सोमवार = चन्द्र, आदि)। उसके बाद कैल्डियन क्रम में अगले ग्रह आते हैं: शनि → गुरु → मंगल → सूर्य → शुक्र → बुध → चन्द्र।'
              : 'Day horas: sunrise to sunset divided into 12 equal parts. Night horas: sunset to next sunrise divided into 12 parts. The first hora belongs to the weekday lord (Sunday = Sun, Monday = Moon, etc.). Subsequent horas follow the Chaldean sequence: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon, cycling repeatedly.'}
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
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'राहु काल' : 'Rahu Kaal'}
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

      {/* ═══ Client Island: interactive hora timeline, current hora, best-for table ═══ */}
      <HoraClient />
    </div>
  );
}

import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { CITIES, getSeoCityForLocale, type CityData } from '@/lib/constants/cities';
import { tl } from '@/lib/utils/trilingual';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { todayInTimezone } from '@/lib/utils/now-in-timezone';
import Link from 'next/link';
import GauriPanchangClient from './Client';
import type { GauriSlot } from '@/types/panchang';

// Mirror of Client.tsx's DEFAULT_CITY so the server can pre-compute the
// SAME initial slots the client would otherwise re-derive. Keeps server
// and client byte-identical despite cross-runtime computePanchang drift
// (see Client.tsx header comment).
const CLIENT_DEFAULT_CITY: CityData = CITIES.find(c => c.slug === 'chennai') ?? CITIES[0];

// Dynamic rendering — no ISR cache (time-dependent content).
// SEO city now resolved per-locale via getSeoCityForLocale() inside the
// page handler (see cities.ts SEO_CITY_BY_LOCALE map). Gauri Panchangam
// is the South-Indian counterpart to Choghadiya, so Chennai remains the
// fallback for locales not in the map.

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_TA = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const NATURE_LABELS_EN: Record<string, string> = {
  auspicious: 'Auspicious',
  inauspicious: 'Inauspicious',
};
const NATURE_LABELS_TA: Record<string, string> = {
  auspicious: 'நல்ல நேரம்',
  inauspicious: 'கெட்ட நேரம்',
};
const NATURE_LABELS_HI: Record<string, string> = {
  auspicious: 'शुभ',
  inauspicious: 'अशुभ',
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
  name: string;
  nameHi: string;
  nameTa?: string;
  type: string;
  nature: string;
  startTime: string;
  endTime: string;
}

export default async function GauriPanchangPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await headers(); // force dynamic
  const isTa = locale === 'ta';
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Locale-aware SEO default. Falls back to Chennai for locales not in
  // the map (gauri panchang is a South-Indian tradition; chennai is the
  // most appropriate generic default). /ta/ → chennai, /te/ → hyderabad,
  // /kn/ → bangalore via the map.
  const city = getSeoCityForLocale(locale, 'chennai');
  const cityName = tl(city.name, locale);

  // Resolve "today" in the SSR city's timezone (Asia/Kolkata for Chennai).
  // Using `getUTCFullYear` / `getUTCDay` on the server would render the
  // previous day's Gauri Panchang for users hitting the page between
  // midnight and 05:30 IST, because UTC is still "yesterday" then.
  // Falls back to UTC if the city is unresolvable.
  // city is always defined (getSeoCityForLocale never returns
  // undefined — falls back to CITIES[0]), so no optional chain.
  const todayLocalStr = todayInTimezone(city.timezone);
  const [year, month, day] = todayLocalStr.split('-').map(Number);
  const dateStr = todayLocalStr;

  let daySlots: SSRSlot[] = [];
  let nightSlots: SSRSlot[] = [];
  // Pre-computed slots for the CLIENT's default city (Chennai). These
  // travel as a prop to GauriPanchangClient and source its first paint,
  // bypassing the cross-runtime computePanchang drift documented in
  // Client.tsx's header. The list stays empty only if the Chennai
  // compute fails — the client falls back to its useMemo path.
  let clientInitialSlots: GauriSlot[] = [];
  // Weekday derived from the LOCAL date string, not from `new Date()` in
  // UTC. Same midnight-IST issue as above. `Date.UTC(...)` gives us a UTC
  // noon timestamp for that local date, from which getUTCDay() is the
  // canonical 0=Sun…6=Sat weekday for that calendar date.
  let weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  // city is guaranteed non-null by getSeoCityForLocale. try/catch
  // protects against engine failures only.
  try {
    const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
    const panchang = computePanchang({
      year, month, day,
      lat: city.lat, lng: city.lng, tzOffset,
      timezone: city.timezone,
    });
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
    console.error('[gauri-panchang] SSR panchang computation failed:', err);
  }

  // Independent compute for the CLIENT's default city. When the SEO
  // city coincides with CLIENT_DEFAULT_CITY (e.g., /ta/ → Chennai), we
  // could reuse `panchang` above, but the extra call is cheap (~ms)
  // and keeps the data flow explicit. Errors fall through to an empty
  // list; the client then runs its own useMemo path.
  try {
    const tzOffset = getUTCOffsetForDate(year, month, day, CLIENT_DEFAULT_CITY.timezone);
    const clientPanchang = computePanchang({
      year, month, day,
      lat: CLIENT_DEFAULT_CITY.lat,
      lng: CLIENT_DEFAULT_CITY.lng,
      tzOffset,
      timezone: CLIENT_DEFAULT_CITY.timezone,
    });
    clientInitialSlots = clientPanchang.gauriPanchang ?? [];
  } catch (err) {
    console.error('[gauri-panchang] SSR client-default-city compute failed:', err);
  }

  const weekdayName = isTa ? WEEKDAYS_TA[weekday] : isHi ? WEEKDAYS_HI[weekday] : WEEKDAYS_EN[weekday];
  const natureLabel = (n: string) => isTa ? NATURE_LABELS_TA[n] : isHi ? NATURE_LABELS_HI[n] : NATURE_LABELS_EN[n];

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

  // Localized headline + intro copy. The SEO surface targets three
  // big query patterns: "gauri panchang", "gowri panchangam today",
  // "gowri nalla neram", plus regional-script variants.
  const headline = isTa
    ? `${cityName} கௌரி பஞ்சாங்கம் இன்று — ${weekdayName}, ${dateStr}`
    : isHi
      ? `${cityName} गौरी पंचांग आज — ${weekdayName}, ${dateStr}`
      : `${cityName} Gauri Panchang Today — ${weekdayName}, ${dateStr}`;

  const intro = isTa
    ? `இன்று ${weekdayName} ${cityName}க்கான பகல் மற்றும் இரவு கௌரி பஞ்சாங்க நேரங்கள். அமிர்தம், சித்தம், லாபம், தனம், சுகம் (நல்ல நேரம்) – புதிய காரியங்கள் தொடங்கவும். மரணம், ரோகம், சோகம் (கெட்ட நேரம்) – தவிர்க்கவும்.`
    : isHi
      ? `आज ${weekdayName} को ${cityName} के लिए दिन और रात के गौरी पंचांग समय। अमृत, सिद्ध, लाभ, धन, सुगम (शुभ) में नए कार्य करें; मरण, रोग, शोक (अशुभ) से बचें।`
      : `Today's day and night Gauri Panchang timings for ${cityName} on ${weekdayName}. Start new work during Amritha, Siddha, Laabha, Dhanam, Sugam (auspicious); avoid Marana, Rogam, Sokam (inauspicious).`;

  const subIntro = isTa
    ? 'கௌரி பஞ்சாங்கம் சூரிய உதயம் மற்றும் சூரிய அஸ்தமனத்தின் அடிப்படையில் கணக்கிடப்படுகிறது, எனவே ஒவ்வொரு நகரத்திற்கும் நேரம் வேறுபடும். கீழே உள்ள கருவியில் உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்.'
    : isHi
      ? 'गौरी पंचांग सूर्योदय और सूर्यास्त के आधार पर गणना किया जाता है, इसलिए प्रत्येक शहर के लिए समय भिन्न होता है। नीचे इंटरैक्टिव टूल में अपना शहर चुनें।'
      : 'Gauri Panchang slots are computed from sunrise and sunset, so timings vary by city. Use the interactive tool below to select your location for precise Gowri Nalla Neram timings.';

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {headline}
        </h1>

        <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>{intro}</p>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">{subIntro}</p>

        {daySlots.length > 0 && renderTable(
          daySlots,
          isTa
            ? `பகல் கௌரி பஞ்சாங்கம் — ${cityName} (${dateStr})`
            : isHi
              ? `दिन का गौरी पंचांग — ${cityName} (${dateStr})`
              : `Day Gauri Panchang — ${cityName} (${dateStr})`,
        )}

        {nightSlots.length > 0 && renderTable(
          nightSlots,
          isTa
            ? `இரவு கௌரி பஞ்சாங்கம் — ${cityName} (${dateStr})`
            : isHi
              ? `रात का गौरी पंचांग — ${cityName} (${dateStr})`
              : `Night Gauri Panchang — ${cityName} (${dateStr})`,
        )}

        {/* Explanatory SEO content */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'கௌரி பஞ்சாங்கம் என்றால் என்ன?' : isHi ? 'गौरी पंचांग क्या है?' : 'What is Gauri Panchang?'}
          </h2>
          <p>
            {isTa
              ? 'கௌரி பஞ்சாங்கம் (கௌரி நல்ல நேரம்) தென்னிந்தியாவில் — தமிழ்நாடு, கர்நாடகா, ஆந்திரா, தெலங்கானா, கேரளா — பரவலாகப் பயன்படுத்தப்படும் வைதீக கால-பிரிவு முறையாகும். வடக்கில் பயன்படுத்தப்படும் சௌகாடியாவின் தென்னிந்திய இணை. ஒவ்வொரு பகலும் இரவும் 8 சமமான பகுதிகளாகப் பிரிக்கப்படுகின்றன, மொத்தம் 16 கால-பகுதிகள்.'
              : isHi
                ? 'गौरी पंचांग (गौरी नल्ल नेरम) दक्षिण भारत में — तमिलनाडु, कर्नाटक, आंध्र प्रदेश, तेलंगाना और केरल — व्यापक रूप से प्रयुक्त वैदिक काल-विभाजन प्रणाली है। यह उत्तरी भारत में प्रचलित चौघड़िया का दक्षिण भारतीय समकक्ष है। प्रत्येक दिन और रात को 8 बराबर भागों में बाँटा जाता है, कुल 16 काल-खण्ड।'
                : 'Gauri Panchang (Gowri Nalla Neram) is a Vedic time-division system widely used across South India — Tamil Nadu, Karnataka, Andhra Pradesh, Telangana and Kerala. It is the South-Indian counterpart of Choghadiya, which is more common in North India. Each day and night is divided into 8 equal parts, yielding 16 named periods in total.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'எட்டு கௌரி காலங்கள்' : isHi ? 'गौरी पंचांग के आठ काल' : 'The Eight Gauri Periods'}
          </h2>
          <p>
            {isTa
              ? 'அமிர்தம் (மிக சுபம் — அமுதம்), சித்தம் (சாதனை), லாபம் (லாபம்), தனம் (செல்வம்), சுகம் (சௌகர்யம்) — இவை ஐந்தும் சுப கௌரி காலங்கள். மரணம் (மரணம்), ரோகம் (நோய்), சோகம் (சோகம்) — இவை மூன்றும் கெட்ட நேரம். சௌகாடியாவில் இருப்பது போல சார் (நடுநிலை) வகை இல்லை — கௌரியில் ஒவ்வொரு காலமும் ஒன்று சுபம் அல்லது அசுபம்.'
              : isHi
                ? 'अमृत (अत्यन्त शुभ — अमृत), सिद्ध (कार्य-सिद्धि), लाभ (लाभ), धन (धन), सुगम (सुख-सुविधा) — ये पाँच शुभ गौरी काल हैं। मरण (मृत्यु-सूचक), रोग (रोग), शोक (दुःख) — ये तीन अशुभ हैं। चौघड़िया की भाँति कोई "चर" (तटस्थ) काल नहीं — गौरी में प्रत्येक काल शुभ या अशुभ।'
                : 'The eight periods are: Amritha (nectar, most auspicious), Siddha (achievement), Laabha (gain), Dhanam (wealth), Sugam (comfort) — five auspicious; and Marana (death), Rogam (disease), Sokam (sorrow) — three inauspicious. Unlike Choghadiya, Gauri has no "neutral" tier — every period is either clearly auspicious or inauspicious.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'கௌரி பஞ்சாங்கம் எவ்வாறு கணக்கிடப்படுகிறது?' : isHi ? 'गौरी पंचांग की गणना कैसे होती है?' : 'How is Gauri Panchang Calculated?'}
          </h2>
          <p>
            {isTa
              ? 'பகல் கௌரி: சூரிய உதயம் முதல் சூரிய அஸ்தமனம் வரையான நேரத்தை 8 சமமான பகுதிகளாகப் பிரிக்கின்றனர் (ஒவ்வொன்றும் சுமார் 90 நிமிடங்கள்). இரவு கௌரி: சூரிய அஸ்தமனம் முதல் மறுநாள் சூரிய உதயம் வரை, அதேபோல் 8 பகுதிகளாக. ஒவ்வொரு வாரத்திற்கும் தொடக்க கால-பெயர் வேறுபடும் — அது அந்த வாரத்தின் கிரக அதிபதியைப் பொறுத்தது.'
              : isHi
                ? 'दिन का गौरी: सूर्योदय से सूर्यास्त तक के समय को 8 बराबर भागों में बाँटा जाता है (प्रत्येक लगभग 90 मिनट)। रात का गौरी: सूर्यास्त से अगले दिन के सूर्योदय तक 8 भागों में। प्रत्येक वार के लिए प्रारम्भिक काल अलग होता है — यह उस वार के ग्रह स्वामी पर निर्भर करता है।'
                : 'Day Gauri: the time between sunrise and sunset is divided into 8 equal parts (each ~90 minutes). Night Gauri: sunset to next sunrise, also 8 parts. The starting period rotates by weekday — Sunday starts with Sokam, Monday with Amritha (the Moon\'s nectar period), and so on. Because sunrise and sunset vary by location, Gauri timings differ for each city.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTa ? 'கௌரி பஞ்சாங்கம் vs சௌகாடியா' : isHi ? 'गौरी पंचांग और चौघड़िया में अंतर' : 'Gauri Panchang vs Choghadiya'}
          </h2>
          <p>
            {isTa
              ? 'இரண்டுமே வைதீக கால-பிரிவு முறைகள், ஆனால் வேறுபாடுகள் உள்ளன: (1) கௌரியில் 8 வேறுபட்ட காலப் பெயர்கள், சௌகாடியாவில் 7 (சார் இரண்டு முறை வரும்). (2) கௌரியில் "நடுநிலை" வகை இல்லை. (3) கௌரியின் சுழற்சி வேறுபட்டது — வாரங்கள் வெவ்வேறு இடங்களில் தொடங்குகின்றன. (4) கௌரி தென்னிந்தியாவில் பாரம்பரியமானது; சௌகாடியா குஜராத், ராஜஸ்தான், மத்தியப் பிரதேசத்தில் அதிகம்.'
              : isHi
                ? 'दोनों ही वैदिक काल-विभाजन प्रणालियाँ हैं, परन्तु अंतर हैं: (1) गौरी में 8 भिन्न काल-नाम, चौघड़िया में 7 (चर दो बार)। (2) गौरी में कोई "तटस्थ" वर्ग नहीं। (3) गौरी का वार-चक्र अलग है। (4) गौरी दक्षिण भारत की पारम्परिक प्रणाली; चौघड़िया उत्तर-पश्चिम भारत में अधिक प्रचलित।'
                : 'Both are Vedic time-division systems, but they differ: (1) Gauri has 8 distinct period names; Choghadiya has 7 (Char repeats). (2) Gauri has no "neutral" category — every period is auspicious or inauspicious. (3) The weekday rotation is different — weekdays start with different periods. (4) Gauri is the traditional South-Indian system; Choghadiya is more common in Gujarat, Rajasthan, and Madhya Pradesh.'}
          </p>
        </div>

        {/* Internal links for SEO */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'சௌகாடியா' : isHi ? 'चौघड़िया' : 'Choghadiya'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'இன்றைய பஞ்சாங்கம்' : isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'ராகு காலம்' : isHi ? 'राहु काल' : 'Rahu Kaal'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'ஹோரை' : isHi ? 'होरा' : 'Hora Chart'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/panchang/auspicious" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'நல்ல நேரம்' : isHi ? 'शुभ मुहूर्त' : 'Auspicious Timings'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/learn/gauri-panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isTa ? 'விளக்கம்' : isHi ? 'विस्तृत जानकारी' : 'Learn More'}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive city selector, day/night slots, educational content ═══ */}
      {/* initialDate + initialSlots are computed server-side for the
          CLIENT's default city (Chennai) so that the SSR render and the
          client's first paint are byte-identical. See Client.tsx header
          comment for the two independent reasons this is necessary
          (Lesson ZD day-boundary race + cross-runtime computePanchang
          drift). The client's useEffect re-derives slots whenever the
          user picks a different city. */}
      <GauriPanchangClient
        initialDate={todayLocalStr}
        initialSlots={clientInitialSlots}
      />
    </div>
  );
}

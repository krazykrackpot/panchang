import { setRequestLocale } from 'next-intl/server';
import { generateEclipseCalendar, type EclipseEvent } from '@/lib/calendar/eclipses';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiNumber } from '@/lib/ephem/astronomical';
import Link from 'next/link';

export const revalidate = 86400;

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

function getDow(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function formatDate(dateStr: string, isHi: boolean): string {
  const [, m, d] = dateStr.split('-').map(Number);
  const months = isHi ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  return `${d} ${months[m - 1]}`;
}

function getRashiName(lon: number, isHi: boolean): string {
  const num = getRashiNumber(lon);
  const rashi = RASHIS.find(r => r.id === num);
  if (!rashi) return '';
  return isHi ? (rashi.name.hi || rashi.name.en) : rashi.name.en;
}

interface EclipseRow {
  date: string;
  dow: number;
  type: 'solar' | 'lunar';
  magnitude: string;
  node: 'rahu' | 'ketu';
  rashi: string;
  descriptionEn: string;
  descriptionHi: string;
}

export default async function EclipsesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Generate eclipses for 2026 and 2027
  let eclipses2026: EclipseEvent[] = [];
  let eclipses2027: EclipseEvent[] = [];
  try {
    eclipses2026 = generateEclipseCalendar(2026);
    eclipses2027 = generateEclipseCalendar(2027);
  } catch (err) {
    console.error('[eclipses] SSR eclipse generation failed:', err);
  }

  const allEclipses = [...eclipses2026, ...eclipses2027];

  const rows: EclipseRow[] = allEclipses.map(e => ({
    date: e.date,
    dow: getDow(e.date),
    type: e.type,
    magnitude: e.magnitude,
    node: e.node,
    rashi: getRashiName(e.eclipseLongitude, isHi),
    descriptionEn: e.description.en,
    descriptionHi: e.description.hi || e.description.en,
  }));

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? 'ग्रहण कैलेंडर 2026–2027 — सूर्य ग्रहण और चन्द्र ग्रहण' : 'Eclipse Calendar 2026–2027 — Solar & Lunar Eclipses'}
        </h1>

        <p className="text-text-primary text-lg mt-4">
          {isHi
            ? `2026–2027 में कुल ${rows.length} ग्रहण होंगे। प्रत्येक ग्रहण की तिथि, प्रकार, तीव्रता, राहु/केतु सम्बन्ध और राशि नीचे दी गई है।`
            : `There are ${rows.length} eclipses in 2026–2027. Each eclipse's date, type, magnitude, Rahu/Ketu association, and zodiac sign are listed below.`}
        </p>

        {/* ═══ Eclipse Table ═══ */}
        {rows.length > 0 && (
          <div className="mt-6 rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'तारीख' : 'Date'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'वार' : 'Day'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'प्रकार' : 'Type'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'तीव्रता' : 'Magnitude'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'ग्रह बिन्दु' : 'Node'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'राशि' : 'Sign'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.date}-${row.type}-${i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-2.5 px-4 text-text-primary font-medium whitespace-nowrap">
                      {formatDate(row.date, isHi)} {row.date.split('-')[0]}
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary">{isHi ? WEEKDAYS_HI[row.dow] : WEEKDAYS_EN[row.dow]}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.type === 'solar' ? 'bg-amber-500/15 text-amber-300' : 'bg-blue-500/15 text-blue-300'
                      }`}>
                        {row.type === 'solar' ? (isHi ? 'सूर्य ग्रहण' : 'Solar') : (isHi ? 'चन्द्र ग्रहण' : 'Lunar')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.magnitude === 'total' ? 'bg-red-500/15 text-red-300' :
                        row.magnitude === 'annular' ? 'bg-orange-500/15 text-orange-300' :
                        row.magnitude === 'partial' ? 'bg-yellow-500/15 text-yellow-300' :
                        'bg-gray-500/15 text-gray-300'
                      }`}>
                        {row.magnitude === 'total' ? (isHi ? 'पूर्ण' : 'Total') :
                         row.magnitude === 'annular' ? (isHi ? 'वलयाकार' : 'Annular') :
                         row.magnitude === 'partial' ? (isHi ? 'आंशिक' : 'Partial') :
                         (isHi ? 'उपच्छाया' : 'Penumbral')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary hidden sm:table-cell">
                      {row.node === 'rahu' ? (isHi ? 'राहु ☊' : 'Rahu ☊') : (isHi ? 'केतु ☋' : 'Ketu ☋')}
                    </td>
                    <td className="py-2.5 px-4 text-gold-primary hidden sm:table-cell">{row.rashi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Eclipse descriptions */}
        {rows.length > 0 && (
          <div className="mt-6 space-y-3">
            {rows.map((row, i) => (
              <div key={`desc-${i}`} className="rounded-lg border border-gold-primary/8 bg-gradient-to-br from-[#2d1b69]/15 via-[#1a1040]/20 to-[#0a0e27] p-3">
                <p className="text-text-secondary text-sm">
                  <span className="text-text-primary font-medium">{formatDate(row.date, isHi)} {row.date.split('-')[0]}:</span>{' '}
                  {isHi ? row.descriptionHi : row.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ═══ What is an Eclipse? ═══ */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'ग्रहण क्या है?' : 'What is an Eclipse?'}
          </h2>
          <p>
            {isHi
              ? 'ग्रहण तब होता है जब सूर्य, चन्द्रमा और पृथ्वी एक सीध में आ जाते हैं। सूर्य ग्रहण अमावस्या (नवचन्द्र) को होता है जब चन्द्रमा सूर्य और पृथ्वी के बीच आकर सूर्य को ढक लेता है। चन्द्र ग्रहण पूर्णिमा को होता है जब पृथ्वी सूर्य और चन्द्रमा के बीच आकर अपनी छाया चन्द्रमा पर डालती है। प्रत्येक अमावस्या या पूर्णिमा पर ग्रहण नहीं होता क्योंकि चन्द्रमा की कक्षा सूर्य की कक्षा (क्रान्तिवृत्त) से लगभग 5° झुकी है।'
              : 'An eclipse occurs when the Sun, Moon, and Earth align along the same plane. A solar eclipse happens on Amavasya (new moon) when the Moon passes between the Sun and Earth, blocking sunlight. A lunar eclipse occurs on Purnima (full moon) when Earth casts its shadow on the Moon. Eclipses do not happen at every new or full moon because the Moon\'s orbit is tilted approximately 5° from the ecliptic plane.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'सूर्य ग्रहण बनाम चन्द्र ग्रहण' : 'Solar vs Lunar Eclipses'}
          </h2>
          <p>
            {isHi
              ? 'सूर्य ग्रहण तीन प्रकार के होते हैं: पूर्ण (सूर्य पूरी तरह ढका), वलयाकार (चन्द्रमा दूर होने से अग्नि-वलय दिखे), और आंशिक (सूर्य का केवल एक भाग ढका)। चन्द्र ग्रहण भी तीन प्रकार के हैं: पूर्ण (चन्द्रमा पूरी तरह पृथ्वी की छाया में), आंशिक (एक भाग छाया में), और उपच्छाया (केवल बाहरी छाया)। सूर्य ग्रहण पृथ्वी पर सीमित क्षेत्र में दिखता है, जबकि चन्द्र ग्रहण रात्रि वाले पूरे गोलार्ध में दृश्य है।'
              : 'Solar eclipses come in three types: total (Sun fully covered), annular (Moon too far away, creating a ring of fire), and partial (only part of the Sun covered). Lunar eclipses are also three types: total (Moon fully in Earth\'s umbral shadow), partial (partially in shadow), and penumbral (only in the outer shadow). Solar eclipses are visible from a narrow strip on Earth, while lunar eclipses are visible from the entire night-side hemisphere.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'ज्योतिष में ग्रहण — राहु और केतु' : 'Eclipses in Vedic Astrology — Rahu & Ketu'}
          </h2>
          <p>
            {isHi
              ? 'वैदिक ज्योतिष में ग्रहण राहु और केतु (चन्द्रमा के आरोही और अवरोही पात) के कारण होते हैं। ये वे बिन्दु हैं जहाँ चन्द्रमा की कक्षा क्रान्तिवृत्त (सूर्य की कक्षा) को काटती है। जब सूर्य या चन्द्रमा इन बिन्दुओं के निकट हो, तभी ग्रहण होता है। पुराणों में ग्रहण को राहु द्वारा सूर्य/चन्द्रमा को निगलने के रूप में वर्णित किया गया है।'
              : 'In Vedic astrology, eclipses are caused by Rahu and Ketu -- the ascending and descending lunar nodes. These are the points where the Moon\'s orbit crosses the ecliptic (Sun\'s apparent path). Eclipses can only occur when the Sun or Moon is near one of these nodes. The Puranas mythologically describe eclipses as Rahu swallowing the Sun or Moon.'}
          </p>
          <p>
            {isHi
              ? 'ज्योतिषीय दृष्टि से ग्रहण उस राशि और भाव को प्रभावित करता है जहाँ ग्रहण होता है। ग्रहण का प्रभाव 6 माह तक माना जाता है। जिन व्यक्तियों के जन्म चन्द्रमा या लग्न पर ग्रहण हो, उन पर प्रभाव सबसे अधिक होता है। ग्रहण काल में भोजन, यात्रा और नए कार्य आरम्भ करने से बचने की परम्परा है।'
              : 'Astrologically, an eclipse affects the zodiac sign and house where it occurs. The influence of an eclipse is believed to last up to 6 months. Individuals whose birth Moon or Ascendant falls in the eclipse sign are most affected. Traditionally, eating, travelling, and starting new ventures are avoided during the eclipse period.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'ग्रहण के दौरान क्या करें' : 'What to Do During an Eclipse'}
          </h2>
          <p>
            {isHi
              ? 'वैदिक परम्परा में ग्रहण काल में मन्त्र जप, ध्यान और दान शुभ माने जाते हैं। ग्रहण के बाद स्नान और मन्दिर दर्शन की परम्परा है। गर्भवती महिलाओं को ग्रहण काल में विशेष सावधानी बरतने की सलाह दी जाती है (यह पारम्परिक मान्यता है)। ग्रहण के बाद पकाया हुआ भोजन त्याग कर नया बनाने का विधान है।'
              : 'In Vedic tradition, chanting mantras, meditation, and charity are considered auspicious during eclipses. Bathing and temple visits after the eclipse are customary. Pregnant women are traditionally advised to take special precautions during eclipses (this is a traditional belief). Cooked food from before the eclipse is discarded and fresh food prepared.'}
          </p>
        </div>

        {/* Internal links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'त्योहार कैलेंडर' : 'Festival Calendar'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/dates/amavasya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'अमावस्या तिथियाँ' : 'Amavasya Dates'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/dates/purnima" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'पूर्णिमा तिथियाँ' : 'Purnima Dates'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar/transits" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'ग्रह गोचर' : 'Planet Transits'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'राहु काल' : 'Rahu Kaal'}
          </Link>
        </nav>
      </div>
    </main>
  );
}

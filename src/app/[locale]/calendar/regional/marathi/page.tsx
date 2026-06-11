import { tl } from '@/lib/utils/trilingual';
import { setRequestLocale } from 'next-intl/server';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import { pickRegionalChrome as RC } from '@/lib/content/regional-chrome-labels';
import { engineDate as ed, nextUpcoming, todayInIst } from '@/lib/seo/regional-faq-dates';

const LABELS = {
  title: {
    en: 'Marathi Calendar (Marathi Panchang)',
    hi: 'मराठी कैलेंडर (मराठी पंचांग)',
    mr: 'मराठी कॅलेंडर (मराठी पंचांग)',
  },
  intro: {
    en: 'The Marathi Panchang is the canonical almanac of Maharashtra — anchored to the Salivahana Shaka era of 78 CE, computed in the Amanta lunar reckoning, and structured around Gudi Padwa as the year-opening festival. The 2026 Marathi year is Shaka Samvat 1948, named Parabhava in the 60-year Prabhavadi cycle. The calendar is consulted across Maharashtra for marriage muhurtas, Ganesh Chaturthi planning, Vat Purnima rites, Diwali Padwa Pujan, and the seasonal calendar of Pandharpur Wari and other pilgrimages.',
    hi: 'मराठी पंचांग महाराष्ट्र का प्रामाणिक पंचांग है — शालिवाहन शक संवत् 78 ईस्वी से, अमान्त चान्द्र-गणना में संगणित, और गुड़ी पाडवा को वर्षारम्भ पर्व मानते हुए। 2026 मराठी वर्ष शक संवत् 1948 — परावभ नाम संवत्सर। यह विवाह मुहूर्त, गणेश चतुर्थी, वट पूर्णिमा, दीवाली पाडवा पूजन एवं पंढरपूर वारीसहित प्रमुख तीर्थयात्राओं के लिए आधार है।',
    mr: 'मराठी पंचांग हे महाराष्ट्राचे अधिकृत पंचांग आहे — शालिवाहन शक संवत १९४८ (२०२६ इ.स.) मध्ये परावभ नाम संवत्सर, अमान्त चांद्र-गणना, गुडी पाडवा हे वर्षाचा प्रारंभ-सण.',
  },
} as const;

const MARATHI_MONTHS: Array<{ name: string; mr: string; gregorian: string; festival: string }> = [
  { name: 'Chaitra', mr: 'चैत्र', gregorian: 'Mar–Apr', festival: 'Gudi Padwa, Ram Navami, Hanuman Jayanti' },
  { name: 'Vaishakh', mr: 'वैशाख', gregorian: 'Apr–May', festival: 'Akshaya Tritiya, Buddha Purnima, Narasimha Jayanti' },
  { name: 'Jyeshtha', mr: 'ज्येष्ठ', gregorian: 'May–Jun', festival: 'Vat Purnima, Ganga Dussehra' },
  { name: 'Ashadha', mr: 'आषाढ', gregorian: 'Jun–Jul', festival: 'Ashadhi Ekadashi (Pandharpur Wari arrival), Guru Purnima' },
  { name: 'Shravana', mr: 'श्रावण', gregorian: 'Jul–Aug', festival: 'Nag Panchami, Narali Purnima, Raksha Bandhan, Mangala Gauri' },
  { name: 'Bhadrapada', mr: 'भाद्रपद', gregorian: 'Aug–Sep', festival: 'Ganesh Chaturthi, Anant Chaturdashi, Hartalika Teej' },
  { name: 'Ashvin', mr: 'अश्विन', gregorian: 'Sep–Oct', festival: 'Navratri, Vijayadashami (Dasara), Kojagiri Purnima' },
  { name: 'Kartik', mr: 'कार्तिक', gregorian: 'Oct–Nov', festival: 'Diwali, Bali Pratipada (Padwa Pujan), Bhau Beej, Tulsi Vivah' },
  { name: 'Margashirsha', mr: 'मार्गशीर्ष', gregorian: 'Nov–Dec', festival: 'Datta Jayanti, Champa Shashthi' },
  { name: 'Pausha', mr: 'पौष', gregorian: 'Dec–Jan', festival: 'Makar Sankranti, Tilgul exchanges' },
  { name: 'Magha', mr: 'माघ', gregorian: 'Jan–Feb', festival: 'Vasant Panchami, Magha Purnima' },
  { name: 'Phalguna', mr: 'फाल्गुन', gregorian: 'Feb–Mar', festival: 'Maha Shivaratri, Holi, Rangpanchami' },
];

interface MarathiFestival { en: string; hi: string; mr: string; engineKey: string; tithi: string }
const MARATHI_FESTIVALS: MarathiFestival[] = [
  { en: 'Gudi Padwa (Marathi New Year)', hi: 'गुड़ी पाडवा (मराठी नववर्ष)', mr: 'गुडी पाडवा (मराठी नववर्ष)', engineKey: 'Gudi Padwa', tithi: 'Chaitra Shukla Pratipada' },
  { en: 'Ram Navami', hi: 'राम नवमी', mr: 'राम नवमी', engineKey: 'Ram Navami', tithi: 'Chaitra Shukla Navami' },
  { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती', mr: 'हनुमान जयंती', engineKey: 'Hanuman Jayanti', tithi: 'Chaitra Purnima' },
  { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया', mr: 'अक्षय्य तृतीया', engineKey: 'Akshaya Tritiya', tithi: 'Vaishakh Shukla Tritiya' },
  { en: 'Vat Purnima', hi: 'वट पूर्णिमा', mr: 'वट पौर्णिमा', engineKey: 'Vat Purnima', tithi: 'Jyeshtha Purnima' },
  { en: 'Ashadhi Ekadashi', hi: 'आषाढ़ी एकादशी', mr: 'आषाढी एकादशी', engineKey: 'Ashadhi Ekadashi', tithi: 'Ashadha Shukla Ekadashi' },
  { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा', mr: 'गुरु पौर्णिमा', engineKey: 'Guru Purnima', tithi: 'Ashadha Purnima' },
  { en: 'Nag Panchami', hi: 'नाग पंचमी', mr: 'नाग पंचमी', engineKey: 'Nag Panchami', tithi: 'Shravana Shukla Panchami' },
  { en: 'Raksha Bandhan / Narali Purnima', hi: 'रक्षाबन्धन / नारळी पूर्णिमा', mr: 'रक्षाबंधन / नारळी पौर्णिमा', engineKey: 'Raksha Bandhan', tithi: 'Shravana Purnima' },
  { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', mr: 'गणेश चतुर्थी', engineKey: 'Ganesh Chaturthi', tithi: 'Bhadrapada Shukla Chaturthi' },
  { en: 'Anant Chaturdashi (Ganesh Visarjan)', hi: 'अनन्त चतुर्दशी (गणेश विसर्जन)', mr: 'अनंत चतुर्दशी (गणेश विसर्जन)', engineKey: 'Anant Chaturdashi', tithi: 'Bhadrapada Shukla Chaturdashi' },
  { en: 'Vijayadashami / Dasara', hi: 'विजयदशमी / दशहरा', mr: 'विजयादशमी / दसरा', engineKey: 'Dussehra', tithi: 'Ashvin Shukla Dashami' },
  { en: 'Diwali', hi: 'दीवाली', mr: 'दिवाळी', engineKey: 'Diwali', tithi: 'Kartik Krishna Amavasya' },
  { en: 'Bali Pratipada (Diwali Padwa)', hi: 'बलि प्रतिपदा (दीवाली पाड़वा)', mr: 'बलिप्रतिपदा (दिवाळी पाडवा)', engineKey: 'Bali Padyami', tithi: 'Kartik Shukla Pratipada' },
  { en: 'Bhau Beej', hi: 'भाई दूज', mr: 'भाऊबीज', engineKey: 'Bhai Dooj', tithi: 'Kartik Shukla Dwitiya' },
  { en: 'Tulsi Vivah', hi: 'तुलसी विवाह', mr: 'तुळशी विवाह', engineKey: 'Tulsi Vivah', tithi: 'Kartik Shukla Dwadashi' },
  { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', mr: 'मकर संक्रांत', engineKey: 'Makar Sankranti', tithi: 'Solar — Sun enters Capricorn' },
  { en: 'Maha Shivaratri', hi: 'महा शिवरात्रि', mr: 'महाशिवरात्री', engineKey: 'Maha Shivaratri', tithi: 'Phalguna Krishna Chaturdashi' },
  { en: 'Holi / Holika Dahan', hi: 'होली / होलिका दहन', mr: 'होळी / होलिका दहन', engineKey: 'Holika Dahan', tithi: 'Phalguna Purnima' },
  { en: 'Rangpanchami', hi: 'रंग पंचमी', mr: 'रंगपंचमी', engineKey: 'Rangpanchami', tithi: 'Phalguna Krishna Panchami' },
];

const GANESH_CHATURTHI_ARC: Array<{ day: string; ritual: string }> = [
  { day: 'Day 1 — Ganesh Chaturthi (Bhadrapada Shukla Chaturthi)', ritual: 'Pranapratishtha (life-installation) of the murti, abhisheka, modak offering, first aarti.' },
  { day: 'Days 2–9', ritual: 'Daily morning and evening aartis, recitation of the Atharvashirsha, devotional music, and (for sarvajanik mandals) cultural programmes — kirtans, lavani, plays, lectures.' },
  { day: 'Day 10 — Anant Chaturdashi (Bhadrapada Shukla Chaturdashi)', ritual: 'Visarjan procession. In Mumbai alone, roughly 6,500 sarvajanik Ganpati murtis and 1.75 lakh household murtis are immersed at 65 natural water bodies and 205 artificial ponds. The Lalbaugcha Raja → Girgaum Chowpatty procession, accompanied by the chant Ganpati Bappa Morya, Pudhchya Varshi Lavkar Ya, remains the largest annual urban gathering in India.' },
];

const MARATHI_SCHOLARS: Array<{ name: string; dates: string; bio: string }> = [
  { name: 'Bal Gangadhar Tilak', dates: '1856–1920', bio: 'Pune-based polymath and editor of Kesari (founded 1881). Orion, or Researches into the Antiquity of the Vedas (1893) used the precession of the equinoxes to argue for a Vedic composition date around 4500 BCE; The Arctic Home in the Vedas (1903) extended this with a controversial polar-origin hypothesis. Tilak’s astronomical chronology, though now considered outside mainstream Indology, set the template for using precession arithmetic as a calendrical argument. Tilak also publicly championed the Sarvajanik Ganesh Utsav from 1893 as a community festival bridging Brahmin and non-Brahmin households.' },
  { name: 'The Pune ephemeris circle', dates: 'late 19th–20th c.', bio: 'Tilak’s collaborators at Kesari produced and distributed annual Marathi panchang almanacs that codified the Shaka / Amanta convention for a mass readership. The convention they fixed — Chaitra as the first month, Shukla Paksha as the start of every month — remains the canonical Marathi panchang convention today.' },
  { name: 'Modern Pune almanac houses', dates: '20th–21st c.', bio: 'Twentieth-century almanac houses based in Pune (Dixit, Date, Datey lineages) computed annual tithi tables that became the reference for marriage muhurta, naming ceremonies, and the festival calendar across western Maharashtra. Their tables anchor most contemporary Maharashtrian household panchang work.' },
];

const SHAKA_TABLE: Array<{ shaka: number; samvatsara: string }> = [
  { shaka: 1947, samvatsara: 'Vishvavasu' },
  { shaka: 1948, samvatsara: 'Parabhava' },
  { shaka: 1949, samvatsara: 'Plavanga' },
  { shaka: 1950, samvatsara: 'Kilaka' },
  { shaka: 1951, samvatsara: 'Saumya' },
  { shaka: 1952, samvatsara: 'Sadharana' },
  { shaka: 1953, samvatsara: 'Virodhakrit' },
];

export default async function MarathiCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  setRequestLocale(localeParam);
  const locale = localeParam as Locale;
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => tl(LABELS[key] as LocaleText, locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
            {L('title')}
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L('intro')}
          </p>
        </div>

        {/* Month Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'The 12 Marathi Months', hi: '12 मराठी मास', mr: '१२ मराठी महिने' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            The Marathi Panchang uses the same twelve Sanskrit lunar months as the pan-Indian Hindu calendar, but reckons them in the <strong>Amanta system</strong> — each month ends at the new moon. Chaitra is the first month; the year begins at <strong>Gudi Padwa</strong> (Chaitra Shukla Pratipada).
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colMonth', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">मराठी</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colGregorian', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Principal festivals</th>
                </tr>
              </thead>
              <tbody>
                {MARATHI_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.mr}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.gregorian}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.festival}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Shalivahana Shaka era in Maharashtra */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'The Shalivahana Shaka Era in Maharashtra', hi: 'महाराष्ट्र में शालिवाहन शक संवत्', mr: 'महाराष्ट्रात शालिवाहन शक संवत' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              The Shaka era — the calendar formally adopted by the Government of India as the Indian National Calendar on 22 March 1957 — has its mythological seat in Maharashtra. According to the Kalakacharya Kathanaka, the era was inaugurated in 78 CE at Pratishthana (Paithan), and historian D. C. Sircar argues that the era’s origin is better understood as commemorating the victory of the Satavahana ruler Gautamiputra Satakarni over the Western Kshatrapa (Shaka) kings.
            </p>
            <p>
              In contrast to Gujarat and Rajasthan, where Vikram Samvat (epoch 57 BCE) dominates almost every ritual document, Maharashtra runs on a <strong>dual track</strong>: Shaka Samvat is the religious and astronomical calendar — used for tithi tables, ayanamsha calculations, marriage muhurta-finding, and all temple panchanga work. Vikram Samvat appears in literary, devotional, and some accounting contexts, and is widely understood by Marathi householders even when the daily panchang is in Shaka.
            </p>
            <p>
              A structural difference matters when reading old Marathi texts: <strong>Chaitra is the first month in Shaka Samvat but the last month in Vikram Samvat</strong>, and Shaka months begin with Shukla Paksha (new-moon → full-moon) while Vikram months begin with Krishna Paksha. Marathi panchang follows the Shaka / Amanta convention — months change on the new moon.
            </p>
            <p>
              <strong>Bal Gangadhar Tilak (1856–1920)</strong>, the Pune-based polymath who edited Kesari (founded 1881), worked extensively on calendrical reform and astronomical chronology — including arguments in <em>Orion, or Researches into the Antiquity of the Vedas</em> (1893) and <em>The Arctic Home in the Vedas</em> (1903) that the Vedic vernal equinox once stood in Orion, placing portions of the Rig Veda c. 4500 BCE.
            </p>
          </div>
        </section>

        {/* Gudi Padwa */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-amber-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Gudi Padwa — The Marathi New Year', hi: 'गुड़ी पाडवा — मराठी नववर्ष', mr: 'गुडी पाडवा — मराठी नववर्ष' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              Gudi Padwa falls on the first tithi (pratipada) of Chaitra Shukla Paksha and opens the Maharashtra Panchang year. The festival blends three independent traditions:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Cosmological</strong> — the Brahma Purana names this day as the day on which Lord Brahma created the universe; the Gudi flag is therefore called the <strong>Brahmadhwaja</strong> (Brahma’s banner).</li>
              <li><strong>Mythological</strong> — local lore commemorates King Shalivahana of Paithan’s victory over the invading Huns, which is also the conventional starting point of the Shalivahana Shaka.</li>
              <li><strong>Historical</strong> — in the seventeenth century, the festival was repurposed in Maratha households as a remembrance of Chhatrapati Shivaji Maharaj’s military victories.</li>
            </ol>
            <p>
              The Gudi itself is a long bamboo pole, capped with an inverted silver, bronze, or copper kalash, draped with a bright silk or cotton cloth, and garlanded with neem leaves, mango leaves, and marigold. It is raised at the doorway or window at sunrise. Bitter neem leaves with jaggery are eaten as a reminder that the new year will hold both sweetness and adversity.
            </p>
            <p>
              <strong>Engine date 2026:</strong> Gudi Padwa 2026 falls on <strong>{ed(2026, 'Gudi Padwa', locale)}</strong>, the first tithi of Chaitra Shukla in Shaka Samvat 1948.
            </p>
          </div>
        </section>

        {/* Ganesh Chaturthi 10-day arc */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Ganesh Chaturthi — The Ten-Day Public Festival', hi: 'गणेश चतुर्थी — दस दिवसीय सार्वजनिक उत्सव', mr: 'गणेश चतुर्थी — दहा दिवसांचा सार्वजनिक उत्सव' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Although Ganesh Chaturthi is observed across western and southern India, its modern ten-day public form is a Maharashtra invention. In 1893, Bal Gangadhar Tilak used his Pune-based newspaper Kesari to publicly praise the Sarvajanik Ganesh Utsav as a way of converting a private household rite into a community festival that could bridge the gap between Brahmins and non-Brahmins and slip past colonial restrictions on political gatherings. Within a decade, the form had spread across the Konkan, Pune, and Mumbai.
          </p>
          <div className="space-y-3">
            {GANESH_CHATURTHI_ARC.map((d) => (
              <div key={d.day} className="bg-bg-primary/40 border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1.5">{d.day}</div>
                <p className="text-text-secondary text-sm leading-relaxed">{d.ritual}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            <strong>Engine dates 2026:</strong> Ganesh Chaturthi {ed(2026, 'Ganesh Chaturthi', locale)} and Anant Chaturdashi {ed(2026, 'Anant Chaturdashi', locale)}.
          </p>
        </section>

        {/* Shaka 1947–1953 cycle table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Shaka Samvat 1947–1953 (≈ 2025–2031 CE)', hi: 'शक संवत् 1947–1953 (≈ 2025–2031 ईस्वी)', mr: 'शक संवत १९४७–१९५३ (≈ २०२५–२०३१ इ.स.)' }, locale)}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Shaka Year</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Gregorian (Chaitra Shukla 1)</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Samvatsara name</th>
                </tr>
              </thead>
              <tbody>
                {SHAKA_TABLE.map((y, i) => {
                  // Shaka year + 78 = Gregorian CE; Chaitra Shukla 1 = Gudi Padwa
                  const gregYear = y.shaka + 78;
                  const gregDate = ed(gregYear, 'Gudi Padwa', locale);
                  return (
                    <tr key={y.shaka} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                      <td className="px-4 py-2.5 text-gold-light font-semibold">{y.shaka}</td>
                      <td className="px-4 py-2.5 text-amber-400/80 text-xs">{gregDate}</td>
                      <td className="px-4 py-2.5 text-text-secondary">{y.samvatsara}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Famous Marathi calendrical scholars */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Famous Marathi Calendrical Scholars', hi: 'प्रसिद्ध मराठी पंचांग-विद्वान', mr: 'प्रसिद्ध मराठी पंचांगकार' }, locale)}
          </h2>
          <div className="space-y-3">
            {MARATHI_SCHOLARS.map((s) => (
              <div key={s.name} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                  <span className="text-gold-light font-semibold text-sm">{s.name}</span>
                  <span className="text-amber-400/70 text-xs">{s.dates}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{s.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Marathi festival dates — engine-driven */}
        {(() => {
          const nowIso = todayInIst();
          const upcoming = MARATHI_FESTIVALS
            .map((f) => {
              const hit = nextUpcoming(f.engineKey, locale, nowIso);
              return hit ? { f, iso: hit.iso, display: hit.display } : null;
            })
            .filter((x): x is { f: MarathiFestival; iso: string; display: string } => x !== null)
            .sort((a, b) => a.iso.localeCompare(b.iso));
          return (
            <section>
              <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
                {tl({ en: 'Upcoming Marathi Festival Dates — Tithi & Exact Dates', hi: 'आगामी मराठी त्योहार — तिथि एवं सटीक तिथियाँ', mr: 'आगामी मराठी सण — तिथी आणि नेमक्या तारखा' }, locale)}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                {tl({ en: 'Upcoming dates for major Marathi festivals, computed for Mumbai. Includes Gudi Padwa, Vat Purnima, Ashadhi Ekadashi, Ganesh Chaturthi, Dasara, Diwali, and Holi observances from the Marathi Panchang. Dates auto-update daily from our panchang engine — never stale.', hi: 'मुम्बई सन्दर्भ के साथ प्रमुख मराठी त्योहारों की आगामी तिथियाँ। पंचांग engine से गणित और स्वतः अद्यतित।', mr: 'मुंबई संदर्भासह प्रमुख मराठी सणांच्या आगामी तारखा. पंचांग इंजिनद्वारे मोजल्या जातात आणि दररोज स्वयं-अद्यतनित होतात.' }, locale)}
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colFestival', locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colDate', locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colTithi', locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(({ f, iso, display }, i) => (
                      <tr key={`${f.en}-${iso}`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                        <td className="px-4 py-2.5 text-text-primary font-medium">{locale === 'mr' ? f.mr : isHi ? f.hi : f.en}</td>
                        <td className="px-4 py-2.5 text-amber-400/80">{display}</td>
                        <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {RC('relatedHeading', locale)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/calendar/regional/gujarati" className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium">{tl({ en: 'Gujarati Calendar', hi: 'गुजराती कैलेंडर', mr: 'गुजराती कॅलेंडर' }, locale)}</Link>
            <Link href="/calendar/regional/kannada" className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium">{tl({ en: 'Kannada Calendar', hi: 'कन्नड़ कैलेंडर', mr: 'कन्नड कॅलेंडर' }, locale)}</Link>
            <Link href="/calendar" className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium">{tl({ en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', mr: 'सण कॅलेंडर २०२६' }, locale)}</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import VedicTimeClient from './Client';

// Dynamic rendering — no ISR cache (time-dependent content).

// Vedic time conversion constants (used for the reference table)
interface TimeUnit {
  nameEn: string;
  nameHi: string;
  durationMinutes: number;
  perDay: number;
  description: string;
  descriptionHi: string;
}

const VEDIC_UNITS: TimeUnit[] = [
  { nameEn: 'Truti', nameHi: 'त्रुटि', durationMinutes: 29.6296 / 1000000, perDay: 0, description: 'Smallest Vedic unit, ~29.6 microseconds. Mentioned in Surya Siddhanta.', descriptionHi: 'सबसे छोटी वैदिक इकाई, ~29.6 माइक्रोसेकन्ड। सूर्य सिद्धान्त में वर्णित।' },
  { nameEn: 'Tatpara', nameHi: 'तत्पर', durationMinutes: 100 * 29.6296 / 1000000, perDay: 0, description: '100 Trutis. Still sub-second precision.', descriptionHi: '100 त्रुटि। उप-सेकन्ड परिशुद्धता।' },
  { nameEn: 'Nimesha', nameHi: 'निमेष', durationMinutes: 16.0 / 60, perDay: 0, description: 'A blink of the eye (~16 seconds). 45 Tatparas.', descriptionHi: 'पलक झपकने का समय (~16 सेकन्ड)। 45 तत्पर।' },
  { nameEn: 'Kashtha', nameHi: 'काष्ठा', durationMinutes: 3.2, perDay: 0, description: '18 Nimeshas (~3.2 minutes). Base unit for practical timekeeping.', descriptionHi: '18 निमेष (~3.2 मिनट)। व्यावहारिक समय-गणना की आधार इकाई।' },
  { nameEn: 'Kala', nameHi: 'कला', durationMinutes: 3.2 * 30, perDay: 0, description: '30 Kashthas (~1.6 hours).', descriptionHi: '30 काष्ठा (~1.6 घण्टे)।' },
  { nameEn: 'Nadika (Ghati)', nameHi: 'नाडिका (घटी)', durationMinutes: 24, perDay: 60, description: '24 minutes. The primary Vedic time unit. 60 Ghatis = 1 day. Water clocks (ghati yantra) measured this.', descriptionHi: '24 मिनट। प्रमुख वैदिक समय इकाई। 60 घटी = 1 दिन। जल-घड़ी (घटी यन्त्र) से मापा जाता था।' },
  { nameEn: 'Pala (Vipala)', nameHi: 'पल (विपल)', durationMinutes: 0.4, perDay: 3600, description: '24 seconds. 60 Palas = 1 Ghati.', descriptionHi: '24 सेकन्ड। 60 पल = 1 घटी।' },
  { nameEn: 'Muhurta', nameHi: 'मुहूर्त', durationMinutes: 48, perDay: 30, description: '2 Ghatis = 48 minutes. 30 Muhurtas divide the day. Each has a ruling deity and quality.', descriptionHi: '2 घटी = 48 मिनट। दिन के 30 मुहूर्त होते हैं। प्रत्येक का अधिष्ठाता देवता और गुण होता है।' },
  { nameEn: 'Prahar (Yama)', nameHi: 'प्रहर (याम)', durationMinutes: 180, perDay: 8, description: '7.5 Ghatis = 3 hours. 8 Prahars = 1 day. 4 daytime + 4 nighttime.', descriptionHi: '7.5 घटी = 3 घण्टे। 8 प्रहर = 1 दिन। 4 दिन के + 4 रात्रि के।' },
  { nameEn: 'Ahoratra', nameHi: 'अहोरात्र', durationMinutes: 1440, perDay: 1, description: 'One full day (sunrise to sunrise). 60 Ghatis, 30 Muhurtas, 8 Prahars.', descriptionHi: 'एक पूर्ण दिन (सूर्योदय से सूर्योदय)। 60 घटी, 30 मुहूर्त, 8 प्रहर।' },
];

// The 30 Muhurtas of the day
interface MuhurtaInfo {
  number: number;
  nameEn: string;
  nameHi: string;
  quality: 'auspicious' | 'inauspicious' | 'mixed';
  deityEn: string;
  deityHi: string;
}

const MUHURTAS_30: MuhurtaInfo[] = [
  { number: 1, nameEn: 'Rudra', nameHi: 'रुद्र', quality: 'inauspicious', deityEn: 'Rudra (Shiva)', deityHi: 'रुद्र (शिव)' },
  { number: 2, nameEn: 'Ahi', nameHi: 'अहि', quality: 'inauspicious', deityEn: 'Serpent', deityHi: 'सर्प' },
  { number: 3, nameEn: 'Mitra', nameHi: 'मित्र', quality: 'auspicious', deityEn: 'Mitra', deityHi: 'मित्र' },
  { number: 4, nameEn: 'Pitru', nameHi: 'पितृ', quality: 'inauspicious', deityEn: 'Ancestors', deityHi: 'पितर' },
  { number: 5, nameEn: 'Vasu', nameHi: 'वसु', quality: 'auspicious', deityEn: 'Vasu', deityHi: 'वसु' },
  { number: 6, nameEn: 'Vara', nameHi: 'वार', quality: 'auspicious', deityEn: 'Water/Varuna', deityHi: 'जल/वरुण' },
  { number: 7, nameEn: 'Vishvedeva', nameHi: 'विश्वदेव', quality: 'auspicious', deityEn: 'Vishvedevas', deityHi: 'विश्वदेव' },
  { number: 8, nameEn: 'Vidhi', nameHi: 'विधि', quality: 'auspicious', deityEn: 'Brahma', deityHi: 'ब्रह्मा' },
  { number: 9, nameEn: 'Satamukhi', nameHi: 'सतमुखी', quality: 'auspicious', deityEn: 'Indra', deityHi: 'इन्द्र' },
  { number: 10, nameEn: 'Puruhuta', nameHi: 'पुरुहूत', quality: 'inauspicious', deityEn: 'Agni', deityHi: 'अग्नि' },
  { number: 11, nameEn: 'Vahini', nameHi: 'वाहिनी', quality: 'inauspicious', deityEn: 'Fire', deityHi: 'अग्नि' },
  { number: 12, nameEn: 'Naktanakara', nameHi: 'नक्तनकर', quality: 'inauspicious', deityEn: 'Moon', deityHi: 'चन्द्र' },
  { number: 13, nameEn: 'Varuna', nameHi: 'वरुण', quality: 'auspicious', deityEn: 'Varuna', deityHi: 'वरुण' },
  { number: 14, nameEn: 'Aryaman', nameHi: 'अर्यमन्', quality: 'auspicious', deityEn: 'Aryaman', deityHi: 'अर्यमन्' },
  { number: 15, nameEn: 'Bhaga', nameHi: 'भग', quality: 'inauspicious', deityEn: 'Bhaga', deityHi: 'भग' },
  { number: 16, nameEn: 'Girisha', nameHi: 'गिरीश', quality: 'mixed', deityEn: 'Shiva (Girisha)', deityHi: 'शिव (गिरीश)' },
  { number: 17, nameEn: 'Ajapada', nameHi: 'अजपाद', quality: 'inauspicious', deityEn: 'Aja Ekapada', deityHi: 'अज एकपाद' },
  { number: 18, nameEn: 'Ahirbudhnya', nameHi: 'अहिर्बुध्न्य', quality: 'auspicious', deityEn: 'Ahirbudhnya', deityHi: 'अहिर्बुध्न्य' },
  { number: 19, nameEn: 'Pushya', nameHi: 'पुष्य', quality: 'auspicious', deityEn: 'Jupiter', deityHi: 'बृहस्पति' },
  { number: 20, nameEn: 'Ashvini', nameHi: 'अश्विनी', quality: 'auspicious', deityEn: 'Ashvini Kumaras', deityHi: 'अश्विनी कुमार' },
  { number: 21, nameEn: 'Yama', nameHi: 'यम', quality: 'inauspicious', deityEn: 'Yama', deityHi: 'यम' },
  { number: 22, nameEn: 'Agni', nameHi: 'अग्नि', quality: 'auspicious', deityEn: 'Agni', deityHi: 'अग्नि' },
  { number: 23, nameEn: 'Vidhata', nameHi: 'विधाता', quality: 'auspicious', deityEn: 'Vidhata', deityHi: 'विधाता' },
  { number: 24, nameEn: 'Kanda', nameHi: 'कण्ड', quality: 'auspicious', deityEn: 'Kanda', deityHi: 'कण्ड' },
  { number: 25, nameEn: 'Aditi', nameHi: 'अदिति', quality: 'auspicious', deityEn: 'Aditi', deityHi: 'अदिति' },
  { number: 26, nameEn: 'Jiva (Amrita)', nameHi: 'जीव (अमृत)', quality: 'auspicious', deityEn: 'Vishnu', deityHi: 'विष्णु' },
  { number: 27, nameEn: 'Vishnu', nameHi: 'विष्णु', quality: 'auspicious', deityEn: 'Vishnu', deityHi: 'विष्णु' },
  { number: 28, nameEn: 'Yumigadyuti', nameHi: 'द्युमद्गद्युति', quality: 'auspicious', deityEn: 'Surya', deityHi: 'सूर्य' },
  { number: 29, nameEn: 'Brahma', nameHi: 'ब्रह्म', quality: 'auspicious', deityEn: 'Brahma', deityHi: 'ब्रह्मा' },
  { number: 30, nameEn: 'Samudra', nameHi: 'समुद्र', quality: 'mixed', deityEn: 'Ocean', deityHi: 'समुद्र' },
];

export default async function VedicTimePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await headers(); // Force dynamic rendering
  const today = new Date().toISOString().slice(0, 10);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `वैदिक समय — ${today}` : `Vedic Time — ${today}`}
        </h1>

        <p className="text-text-primary text-lg mt-4">
          {isHi
            ? 'प्राचीन भारतीय समय पद्धति — घटी, पल, मुहूर्त, प्रहर। वैदिक दिन सूर्योदय से प्रारम्भ होता है और 60 घटियों, 30 मुहूर्तों और 8 प्रहरों में विभाजित होता है।'
            : 'The ancient Indian time system — Ghati, Pala, Muhurta, Prahar. The Vedic day begins at sunrise and is divided into 60 Ghatis, 30 Muhurtas, and 8 Prahars.'}
        </p>

        {/* ═══ What is Vedic Time? ═══ */}
        <div className="mt-6 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'वैदिक समय क्या है?' : 'What is Vedic Time?'}
          </h2>
          <p>
            {isHi
              ? 'वैदिक समय पद्धति सूर्य सिद्धान्त और अन्य ज्योतिष ग्रन्थों में वर्णित प्राचीन भारतीय समय मापन प्रणाली है। आधुनिक 24-घण्टे की घड़ी के विपरीत, वैदिक दिन अर्धरात्रि से नहीं बल्कि सूर्योदय से प्रारम्भ होता है। इसका अर्थ है कि घटी-पल का समय प्रत्येक दिन और स्थान के अनुसार बदलता है क्योंकि सूर्योदय का समय ऋतु और अक्षांश पर निर्भर करता है।'
              : 'The Vedic time system is an ancient Indian method of time measurement described in the Surya Siddhanta and other astronomical texts. Unlike the modern 24-hour clock which starts at midnight, the Vedic day begins at sunrise. This means Ghati-Pala timings shift every day and by location, because sunrise varies with season and latitude.'}
          </p>
          <p>
            {isHi
              ? 'इस प्रणाली की मूल इकाई "घटी" (या "नाडिका") है जो 24 आधुनिक मिनटों के बराबर है। प्रत्येक घटी में 60 पल (प्रत्येक 24 सेकन्ड) होते हैं। 60 घटियाँ मिलकर एक अहोरात्र (पूर्ण दिवस-रात्रि चक्र) बनाती हैं। जल-घड़ी (घटी यन्त्र) से इन इकाइयों को मापा जाता था — तांबे के पात्र में छोटा छेद करके जल के प्रवाह से समय मापन होता था।'
              : 'The fundamental unit is the "Ghati" (or "Nadika"), equal to 24 modern minutes. Each Ghati contains 60 Palas (each 24 seconds). Sixty Ghatis make one Ahoratra (full day-night cycle). These units were measured using water clocks (Ghati Yantra) — a copper vessel with a small hole through which water flowed at a calibrated rate.'}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'घटी पद्धति' : 'The Ghati System'}
          </h2>
          <p>
            {isHi
              ? 'घटी प्रणाली का आधार षष्टि (60) है — ठीक वैसे ही जैसे आधुनिक कालगणना में 60 सेकन्ड = 1 मिनट और 60 मिनट = 1 घण्टा। 60 पल = 1 घटी, 60 घटी = 1 दिन। यह सम्भवतः सुमेरी और भारतीय सभ्यताओं के बीच प्राचीन गणितीय सम्बन्ध को दर्शाता है। मुहूर्त (2 घटी = 48 मिनट) और प्रहर (7.5 घटी = 3 घण्टे) बड़ी इकाइयाँ हैं जो दैनिक अनुष्ठानों और कर्मकाण्डों के लिए प्रयुक्त होती हैं।'
              : 'The Ghati system is sexagesimal (base-60), mirroring the modern convention of 60 seconds = 1 minute, 60 minutes = 1 hour. In the Vedic system: 60 Palas = 1 Ghati, 60 Ghatis = 1 day. This likely reflects an ancient mathematical connection between Sumerian and Indian civilisations. The Muhurta (2 Ghatis = 48 minutes) and Prahar (7.5 Ghatis = 3 hours) are larger units used for daily rituals and ceremonies.'}
          </p>
          <p>
            {isHi
              ? 'ज्योतिष शास्त्र में मुहूर्त का विशेष महत्व है। दिन के 30 मुहूर्तों में से प्रत्येक का एक अधिष्ठाता देवता और गुण (शुभ/अशुभ) है। अभिजित मुहूर्त (दिन का मध्य मुहूर्त, लगभग दोपहर 11:36 से 12:24) सभी शुभ कार्यों के लिए सर्वश्रेष्ठ माना जाता है — बुधवार को छोड़कर जब इसका प्रभाव कम होता है।'
              : 'In Jyotish, the Muhurta is of special significance. Each of the day\'s 30 Muhurtas has a presiding deity and quality (auspicious or inauspicious). The Abhijit Muhurta (the midday Muhurta, approximately 11:36 AM to 12:24 PM) is considered the best for all auspicious activities, except on Wednesdays when its potency is diminished.'}
          </p>
        </div>

        {/* ═══ Vedic Time Conversion Table ═══ */}
        <div className="mt-8">
          <h2 className="text-gold-light text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'वैदिक समय रूपान्तरण तालिका' : 'Vedic Time Conversion Table'}
          </h2>
          <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'वैदिक इकाई' : 'Vedic Unit'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'अवधि' : 'Duration'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'प्रति दिन' : 'Per Day'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    {isHi ? 'विवरण' : 'Description'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {VEDIC_UNITS.filter(u => u.durationMinutes >= 0.4).map(unit => (
                  <tr key={unit.nameEn} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-2 px-4 text-text-primary font-medium">{isHi ? unit.nameHi : unit.nameEn}</td>
                    <td className="py-2 px-4 text-gold-primary font-mono">
                      {unit.durationMinutes >= 60
                        ? `${(unit.durationMinutes / 60).toFixed(0)}h`
                        : unit.durationMinutes >= 1
                          ? `${unit.durationMinutes.toFixed(0)} min`
                          : `${(unit.durationMinutes * 60).toFixed(0)} sec`}
                    </td>
                    <td className="py-2 px-4 text-text-secondary hidden sm:table-cell">{unit.perDay > 0 ? unit.perDay : '—'}</td>
                    <td className="py-2 px-4 text-text-secondary text-xs hidden md:table-cell">{isHi ? unit.descriptionHi : unit.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ 30 Muhurtas of the Day ═══ */}
        <div className="mt-8">
          <h2 className="text-gold-light text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'दिन के 30 मुहूर्त' : '30 Muhurtas of the Day'}
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            {isHi
              ? 'प्रत्येक मुहूर्त 48 मिनट का होता है। सूर्योदय से प्रारम्भ होकर 15 दिन के और 15 रात्रि के मुहूर्त होते हैं। शुभ मुहूर्तों को हरे और अशुभ को लाल रंग से दर्शाया गया है।'
              : 'Each Muhurta spans 48 minutes. Starting from sunrise, 15 belong to the daytime and 15 to nighttime. Auspicious Muhurtas are marked green, inauspicious in red.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {MUHURTAS_30.map(m => (
              <div
                key={m.number}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm ${
                  m.quality === 'auspicious' ? 'bg-emerald-500/5' :
                  m.quality === 'inauspicious' ? 'bg-red-500/5' : 'bg-amber-500/5'
                }`}
              >
                <span className="text-text-secondary/60 text-xs w-5 text-right font-mono">{m.number}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  m.quality === 'auspicious' ? 'bg-emerald-400' :
                  m.quality === 'inauspicious' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <span className="text-text-primary font-medium">{isHi ? m.nameHi : m.nameEn}</span>
                <span className="text-text-secondary text-xs ml-auto">{isHi ? m.deityHi : m.deityEn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Key Relationships Section ═══ */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'प्रमुख सम्बन्ध' : 'Key Relationships'}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { en: '1 Ghati = 24 minutes = 60 Palas', hi: '1 घटी = 24 मिनट = 60 पल' },
              { en: '1 Muhurta = 2 Ghatis = 48 minutes', hi: '1 मुहूर्त = 2 घटी = 48 मिनट' },
              { en: '1 Prahar = 7.5 Ghatis = 3 hours', hi: '1 प्रहर = 7.5 घटी = 3 घण्टे' },
              { en: '1 Day = 60 Ghatis = 30 Muhurtas = 8 Prahars', hi: '1 दिन = 60 घटी = 30 मुहूर्त = 8 प्रहर' },
              { en: '1 Pala = 24 seconds = 60 Vipalas', hi: '1 पल = 24 सेकन्ड = 60 विपल' },
              { en: 'Abhijit Muhurta = midday (best for auspicious work)', hi: 'अभिजित मुहूर्त = मध्याह्न (शुभ कार्य के लिए सर्वोत्तम)' },
            ].map((rel, i) => (
              <div key={i} className="px-3 py-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                <span className="text-text-primary font-mono text-xs">{isHi ? rel.hi : rel.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Practical Use ═══ */}
        <div className="mt-6 space-y-3 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'व्यावहारिक उपयोग' : 'Practical Use Today'}
          </h2>
          <p>
            {isHi
              ? 'आज भी वैदिक समय का उपयोग मुहूर्त शास्त्र (शुभ समय चयन), पंचांग गणना, होरा चार्ट और ज्योतिषीय परामर्श में होता है। विवाह, गृहप्रवेश, नामकरण जैसे संस्कारों के लिए मुहूर्त निकालते समय घटी-पल में समय दिया जाता है। पंचांग में प्रत्येक तिथि, नक्षत्र और योग का प्रारम्भ और समाप्ति घटी-पल में अंकित होता है।'
              : 'Vedic time units are still used in Muhurta Shastra (electional astrology), Panchang computation, Hora charts, and astrological consultations. When selecting auspicious times for weddings, housewarming (Griha Pravesh), or naming ceremonies, timings are often given in Ghati-Pala notation. Every Panchang records tithi, nakshatra, and yoga start/end times in Ghati-Pala format.'}
          </p>
          <p>
            {isHi
              ? 'नीचे दिया गया इण्टरैक्टिव उपकरण आपके स्थान के सूर्योदय के आधार पर वर्तमान वैदिक समय (घटी, पल, विपल), चालू मुहूर्त और प्रहर दिखाता है। यह प्रत्येक सेकन्ड अपडेट होता है।'
              : 'The interactive tool below shows the current Vedic time (Ghati, Pala, Vipala), running Muhurta, and Prahar based on your location\'s sunrise. It updates every second in real time.'}
          </p>
        </div>

        {/* Internal links */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'होरा' : 'Hora Chart'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'चौघड़िया' : 'Choghadiya'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'शुभ मुहूर्त' : 'Auspicious Muhurat'}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/upagraha" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'उपग्रह' : 'Upagraha'}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: live clock, gauges, prahar/muhurta display ═══ */}
      <VedicTimeClient />
    </div>
  );
}

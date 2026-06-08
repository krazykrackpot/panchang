import { headers } from 'next/headers';
import { pickToolPageLabel as TPL } from '@/lib/content/tool-pages-labels';
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
          {TPL('theAncientIndianTime', locale)}
        </p>

        {/* ═══ What is Vedic Time? ═══ */}
        <div className="mt-6 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {TPL('whatIsVedicTime', locale)}
          </h2>
          <p>
            {TPL('theVedicTimeSystem', locale)}
          </p>
          <p>
            {TPL('theFundamentalUnitIs', locale)}
          </p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {TPL('theGhatiSystem', locale)}
          </h2>
          <p>
            {TPL('theGhatiSystemIs', locale)}
          </p>
          <p>
            {TPL('inJyotishTheMuhurta', locale)}
          </p>
        </div>

        {/* ═══ Vedic Time Conversion Table ═══ */}
        <div className="mt-8">
          <h2 className="text-gold-light text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {TPL('vedicTimeConversionTable', locale)}
          </h2>
          <div className="rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {TPL('vedicUnit', locale)}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {TPL('duration', locale)}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {TPL('perDay', locale)}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                    {TPL('description', locale)}
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
            {TPL('_30MuhurtasOfThe', locale)}
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            {TPL('eachMuhurtaSpans48', locale)}
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
            {TPL('keyRelationships', locale)}
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
            {TPL('practicalUseToday', locale)}
          </h2>
          <p>
            {TPL('vedicTimeUnitsAre', locale)}
          </p>
          <p>
            {TPL('theInteractiveToolBelow', locale)}
          </p>
        </div>

        {/* Internal links */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {isHi ? 'आज का पंचांग' : "Today's Panchang"}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {TPL('horaChart', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {TPL('choghadiya', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {TPL('auspiciousMuhurat', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/upagraha" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {TPL('upagraha', locale)}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: live clock, gauges, prahar/muhurta display ═══ */}
      <VedicTimeClient />
    </div>
  );
}

'use client';
import { lt } from '@/lib/learn/translations';
import type { LocaleText as LT } from '@/lib/learn/translations';
import MSG from '@/messages/components/patrika-tab.json';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LT>)[key], locale);


import { useRef } from 'react';
import { Download } from 'lucide-react';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import PrintButton from '@/components/ui/PrintButton';
import { generateKundaliPrintHtml } from '@/lib/pdf/kundali-pdf';
import { RASHIS } from '@/lib/constants/rashis';
import type { KundaliData, ChartStyle } from '@/types/kundali';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { Locale , LocaleText} from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

// Dosha explanations — what each dosha means and remedies (rendered below dosha cards)
const DOSHA_EXPLANATIONS: Record<string, { en: string; hi: string }> = {
  'Manglik Dosha': {
    en: 'Mars in houses 1/2/4/7/8/12 creates Manglik Dosha, primarily affecting marriage and partnerships. Severity varies by house — 7th and 8th are strongest. Remedies include Kumbh Vivah, Mangal Shanti puja, and matching with another Manglik.',
    hi: 'मंगल भाव 1/2/4/7/8/12 में मांगलिक दोष बनाता है, जो मुख्यतः विवाह को प्रभावित करता है। उपाय: कुम्भ विवाह, मंगल शान्ति पूजा, और अन्य मांगलिक से मिलान।',
  },
  'Kaal Sarp Dosha': {
    en: 'All planets between Rahu-Ketu creates a karmic pattern of intense cycles. It doesn\'t block success but makes the path non-linear. Remedies include Kaal Sarp puja at Trimbakeshwar.',
    hi: 'सभी ग्रहों का राहु-केतु के बीच होना तीव्र कार्मिक चक्रों का प्रतिरूप बनाता है। उपाय: त्र्यम्बकेश्वर में काल सर्प पूजा।',
  },
  'Ganda Mula': {
    en: 'Moon in a junction nakshatra at the fire-water sign boundary. Traditionally requires Ganda Mula Shanti within the first 27 days of life. Mula and Ashlesha are strongest.',
    hi: 'चन्द्रमा सन्धि नक्षत्र में — अग्नि-जल राशि सीमा पर। जन्म के 27 दिनों में गण्ड मूल शान्ति पूजा आवश्यक।',
  },
  'Sade Sati': {
    en: 'Saturn\'s 7.5-year transit over your Moon sign — the most transformative period. Not inherently negative — strong Saturn charts experience growth and maturity.',
    hi: 'शनि का चन्द्र राशि पर 7.5 वर्ष का गोचर — सबसे परिवर्तनकारी अवधि। मजबूत शनि वालों को विकास मिलता है।',
  },
};

interface PatrikaTabProps {
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  tip: TippanniContent | null;
  chartStyle: ChartStyle;
  retrogradeIds: Set<number>;
  combustIds: Set<number>;
}

export default function PatrikaTab({ kundali, locale, isDevanagari, headingFont, tip, chartStyle, retrogradeIds, combustIds }: PatrikaTabProps) {
  const patrikaRef = useRef<HTMLDivElement>(null);

  const bd = kundali.birthData;
  const mahaDashas = kundali.dashas.filter(d => d.level === 'maha');
  const now = new Date();

  // Detect key doshas
  const doshas: { name: LocaleText; present: boolean; detail: LocaleText }[] = [];

  // Manglik: Mars in 1,2,4,7,8,12 — with cancellation and severity analysis
  const mars = kundali.planets.find(p => p.planet.id === 2);
  const jupiter = kundali.planets.find(p => p.planet.id === 4);
  const venus = kundali.planets.find(p => p.planet.id === 5);
  const saturn = kundali.planets.find(p => p.planet.id === 6);
  const isManglik = mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;

  // Cancellation conditions (classical)
  const manglikCancellations: string[] = [];
  if (isManglik && mars) {
    if (jupiter && jupiter.house === 7) manglikCancellations.push('Jupiter aspects/occupies 7th house');
    if (venus && venus.house === 1) manglikCancellations.push('Venus in 1st house');
    if (mars.sign === 1 || mars.sign === 4 || mars.sign === 8) manglikCancellations.push(`Mars in own/exaltation sign (${mars.sign === 1 ? 'Aries' : mars.sign === 4 ? 'Scorpio' : 'Capricorn'})`);
    if (saturn && saturn.house === mars.house) manglikCancellations.push('Saturn conjunct Mars (mutual cancellation)');
    if (mars.house === 2 && (mars.sign === 2 || mars.sign === 3)) manglikCancellations.push('Mars in 2nd in Gemini/Virgo (Mercury signs reduce aggression)');
  }
  const isManglikCancelled = manglikCancellations.length > 0;
  // Severity: 7th/8th house = severe, 1st/4th = moderate, 2nd/12th = mild
  const manglikSeverity = mars ? ([7, 8].includes(mars.house) ? 'severe' : [1, 4].includes(mars.house) ? 'moderate' : 'mild') : 'none';

  const manglikDetailEn = !isManglik
    ? 'Mars not in 1/2/4/7/8/12 — no Manglik Dosha'
    : isManglikCancelled
      ? `Mars in House ${mars!.house} (${manglikSeverity} severity). CANCELLED by: ${manglikCancellations.join('; ')}. The dosha is technically present but its negative effects are significantly reduced.`
      : `Mars in House ${mars!.house} (${manglikSeverity} severity). ${manglikSeverity === 'severe' ? 'This is the strongest form — Mars directly impacts marriage and partnerships. Mangal Shanti puja and matching with another Manglik are recommended.' : manglikSeverity === 'moderate' ? 'Moderate form — affects temperament and domestic harmony more than marriage timing. Remedies help but this is not as urgent as 7th/8th house placement.' : 'Mild form — Mars here creates assertive speech or spending patterns. The weakest manifestation of Manglik Dosha.'}`;
  const manglikDetailHi = !isManglik
    ? 'मंगल 1/2/4/7/8/12 में नहीं — मांगलिक दोष नहीं'
    : isManglikCancelled
      ? `मंगल भाव ${mars!.house} में (${manglikSeverity === 'severe' ? 'गम्भीर' : manglikSeverity === 'moderate' ? 'मध्यम' : 'हल्का'})। रद्द: ${manglikCancellations.join('; ')}। दोष तकनीकी रूप से है पर नकारात्मक प्रभाव काफी कम हैं।`
      : `मंगल भाव ${mars!.house} में (${manglikSeverity === 'severe' ? 'गम्भीर' : manglikSeverity === 'moderate' ? 'मध्यम' : 'हल्का'})। ${manglikSeverity === 'severe' ? 'यह सबसे प्रबल रूप है — विवाह और साझेदारी पर सीधा प्रभाव। मंगल शान्ति पूजा और मांगलिक मिलान अनुशंसित।' : manglikSeverity === 'moderate' ? 'मध्यम रूप — स्वभाव और घरेलू सामंजस्य पर प्रभाव।' : 'हल्का रूप — वाणी या व्यय पर प्रभाव। मांगलिक दोष का सबसे कमज़ोर रूप।'}`;

  doshas.push({
    name: { en: 'Manglik Dosha', hi: 'मांगलिक दोष', sa: 'मांगलिक दोष', mai: 'मांगलिक दोष', mr: 'मांगलिक दोष', ta: 'செவ்வாய் தோஷம்', te: 'కుజ దోషం', bn: 'মাঙ্গলিক দোষ', kn: 'ಮಾಂಗಲಿಕ ದೋಷ', gu: 'માંગલિક દોષ' },
    present: isManglik && !isManglikCancelled,
    detail: { en: manglikDetailEn, hi: manglikDetailHi, sa: manglikDetailHi, mai: manglikDetailHi, mr: manglikDetailHi, ta: manglikDetailEn, te: manglikDetailEn, bn: manglikDetailEn, kn: manglikDetailEn, gu: manglikDetailEn },
  });

  // Kaal Sarp: all planets between Rahu-Ketu axis
  const rahu = kundali.planets.find(p => p.planet.id === 7);
  const ketu = kundali.planets.find(p => p.planet.id === 8);
  let isKaalSarp = false;
  if (rahu && ketu) {
    const rahuLon = rahu.longitude;
    const ketuLon = ketu.longitude;
    const others = kundali.planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
    const allOnOneSide = others.every(p => {
      const lon = p.longitude;
      if (rahuLon < ketuLon) return lon >= rahuLon && lon <= ketuLon;
      return lon >= rahuLon || lon <= ketuLon;
    });
    const allOnOtherSide = others.every(p => {
      const lon = p.longitude;
      if (ketuLon < rahuLon) return lon >= ketuLon && lon <= rahuLon;
      return lon >= ketuLon || lon <= rahuLon;
    });
    isKaalSarp = allOnOneSide || allOnOtherSide;
  }
  doshas.push({
    name: { en: 'Kaal Sarp Dosha', hi: 'काल सर्प दोष', sa: 'काल सर्प दोष', mai: 'काल सर्प दोष', mr: 'काल सर्प दोष', ta: 'கால சர்ப்ப தோஷம்', te: 'కాల సర్ప దోషం', bn: 'কাল সর্প দোষ', kn: 'ಕಾಲ ಸರ್ಪ ದೋಷ', gu: 'કાળ સર્પ દોષ' },
    present: isKaalSarp,
    detail: isKaalSarp
      ? { en: 'All planets hemmed between Rahu-Ketu axis', hi: 'सभी ग्रह राहु-केतु अक्ष के बीच', sa: 'सभी ग्रह राहु-केतु अक्ष के बीच', mai: 'सभी ग्रह राहु-केतु अक्ष के बीच', mr: 'सभी ग्रह राहु-केतु अक्ष के बीच', ta: 'எல்லா கிரகங்களும் ராகு-கேது அச்சுக்கு இடையில்', te: 'అన్ని గ్రహాలు రాహు-కేతు అక్షం మధ్యలో', bn: 'সকল গ্রহ রাহু-কেতু অক্ষের মধ্যে', kn: 'ಎಲ್ಲ ಗ್ರಹಗಳು ರಾಹು-ಕೇತು ಅಕ್ಷದ ನಡುವೆ', gu: 'બધા ગ્રહો રાહુ-કેતુ અક્ષ વચ્ચે' }
      : { en: 'Not present', hi: 'उपस्थित नहीं', sa: 'उपस्थित नहीं', mai: 'उपस्थित नहीं', mr: 'उपस्थित नहीं', ta: 'இல்லை', te: 'లేదు', bn: 'অনুপস্থিত', kn: 'ಇಲ್ಲ', gu: 'નથી' },
  });

  // Ganda Mula
  const moon = kundali.planets.find(p => p.planet.id === 1);
  const gandaMulaNakshatras = [1, 10, 19, 9, 18, 27];
  const isGandaMula = moon ? gandaMulaNakshatras.includes(moon.nakshatra.id) : false;
  doshas.push({
    name: { en: 'Ganda Mula', hi: 'गण्ड मूल', sa: 'गण्ड मूल', mai: 'गण्ड मूल', mr: 'गण्ड मूल', ta: 'கண்ட மூலம்', te: 'గండ మూల', bn: 'গণ্ড মূল', kn: 'ಗಂಡ ಮೂಲ', gu: 'ગંડ મૂળ' },
    present: isGandaMula,
    detail: isGandaMula
      ? { en: `Moon in ${moon!.nakshatra.name.en}`, hi: `चन्द्र ${moon!.nakshatra.name.hi} में`, sa: `चन्द्रः ${moon!.nakshatra.name.hi} नक्षत्रे`, mai: `चन्द्र ${moon!.nakshatra.name.hi} में`, mr: `चंद्र ${moon!.nakshatra.name.hi} नक्षत्रात`, ta: `சந்திரன் ${moon!.nakshatra.name.en}-இல்`, te: `చంద్రుడు ${moon!.nakshatra.name.en}లో`, bn: `চন্দ্র ${moon!.nakshatra.name.en}-এ`, kn: `ಚಂದ್ರ ${moon!.nakshatra.name.en}ದಲ್ಲಿ`, gu: `ચંદ્ર ${moon!.nakshatra.name.en}માં` }
      : { en: 'Moon not in Ganda Mula nakshatra', hi: 'चन्द्र गण्ड मूल नक्षत्र में नहीं', sa: 'चन्द्र गण्ड मूल नक्षत्र में नहीं', mai: 'चन्द्र गण्ड मूल नक्षत्र में नहीं', mr: 'चन्द्र गण्ड मूल नक्षत्र में नहीं', ta: 'சந்திரன் கண்ட மூல நட்சத்திரத்தில் இல்லை', te: 'చంద్రుడు గండ మూల నక్షత్రంలో లేడు', bn: 'চন্দ্র গণ্ড মূল নক্ষত্রে নেই', kn: 'ಚಂದ್ರ ಗಂಡ ಮೂಲ ನಕ್ಷತ್ರದಲ್ಲಿಲ್ಲ', gu: 'ચંદ્ર ગંડ મૂળ નક્ષત્રમાં નથી' },
  });

  // Sade Sati
  const isSadeSati = kundali.sadeSati?.isActive ?? false;
  doshas.push({
    name: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढ़े साती', mai: 'साढ़े साती', mr: 'साढ़े साती', ta: 'சாடே சாதி', te: 'సాడే సాతి', bn: 'সাড়ে সাতি', kn: 'ಸಾಡೆ ಸಾತಿ', gu: 'સાડા સાતી' },
    present: isSadeSati,
    detail: isSadeSati
      ? { en: `Currently active — ${kundali.sadeSati?.currentPhase || 'ongoing'}`, hi: `वर्तमान में सक्रिय — ${kundali.sadeSati?.currentPhase || 'चालू'}`, sa: `सम्प्रति सक्रियम् — ${kundali.sadeSati?.currentPhase || 'प्रचलितम्'}`, mai: `वर्तमान में सक्रिय — ${kundali.sadeSati?.currentPhase || 'चालू'}`, mr: `सध्या सक्रिय — ${kundali.sadeSati?.currentPhase || 'चालू'}`, ta: `தற்போது செயலில் — ${kundali.sadeSati?.currentPhase || 'நடப்பில்'}`, te: `ప్రస్తుతం సక్రియం — ${kundali.sadeSati?.currentPhase || 'కొనసాగుతోంది'}`, bn: `বর্তমানে সক্রিয় — ${kundali.sadeSati?.currentPhase || 'চলমান'}`, kn: `ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ — ${kundali.sadeSati?.currentPhase || 'ನಡೆಯುತ್ತಿದೆ'}`, gu: `હાલમાં સક્રિય — ${kundali.sadeSati?.currentPhase || 'ચાલુ'}` }
      : { en: 'Not currently active', hi: 'वर्तमान में सक्रिय नहीं', sa: 'वर्तमान में सक्रिय नहीं', mai: 'वर्तमान में सक्रिय नहीं', mr: 'वर्तमान में सक्रिय नहीं', ta: 'தற்போது செயலில் இல்லை', te: 'ప్రస్తుతం సక్రియం కాదు', bn: 'বর্তমানে সক্রিয় নয়', kn: 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯವಲ್ಲ', gu: 'હાલમાં સક્રિય નથી' },
  });

  return (
    <div className="space-y-6">
      {/* Print/PDF controls */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={async () => {
            const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
            exportKundaliPDF(kundali, locale as Locale, tip ?? undefined);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <PrintButton
          contentHtml={generateKundaliPrintHtml(kundali, locale as 'en' | 'hi' | 'sa')}
          title={`Patrika — ${bd.name}`}
          label={msg('print', locale)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
        />
      </div>

      {/* Patrika content */}
      <div ref={patrikaRef} className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 space-y-8">

        {/* Header: Swastika + Om + Name + Birth Details */}
        <div className="text-center space-y-3">
          <div className="text-5xl text-red-500" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>卐</div>
          <div className="text-orange-500 text-xl font-bold" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>ॐ श्री गणेशाय नमः॥</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
            {msg('janmaPatrika', locale)}
          </h2>

          {/* Name */}
          <p className="text-gold-primary text-xl font-bold" style={headingFont}>{bd.name || msg('native', locale)}</p>

          {/* Birth data grid */}
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
              <span className="text-gold-dark text-right">{msg('dateOfBirth', locale)}</span>
              <span className="text-text-secondary text-left font-mono">{bd.date}</span>
              <span className="text-gold-dark text-right">{msg('timeOfBirth', locale)}</span>
              <span className="text-text-secondary text-left font-mono">{bd.time}</span>
              <span className="text-gold-dark text-right">{msg('placeOfBirth', locale)}</span>
              <span className="text-text-secondary text-left">{bd.place || `${bd.lat.toFixed(2)}°N, ${bd.lng.toFixed(2)}°E`}</span>
              <span className="text-gold-dark text-right">{msg('ayanamsha', locale)}</span>
              <span className="text-text-secondary text-left font-mono">{bd.ayanamsha} ({kundali.ayanamshaValue.toFixed(4)}°)</span>
            </div>
          </div>

          <div className="border-t border-gold-primary/10 my-2" />

          {/* Vedic birth details: Lagna, Rashi, Nakshatra, Tithi, Yoga, Masa */}
          {(() => {
            const moonP = kundali.planets.find(p => p.planet.id === 1);
            const sunP = kundali.planets.find(p => p.planet.id === 0);
            const lagnaR = RASHIS[kundali.ascendant.sign - 1];
            const moonR = moonP ? RASHIS[moonP.sign - 1] : null;
            const sunR = sunP ? RASHIS[sunP.sign - 1] : null;

            // Compute tithi, yoga, masa from julianDay
            const { calculateTithi, calculateYoga, sunLongitude: sunLon, toSidereal: toSid, getMasa, MASA_NAMES } = require('@/lib/ephem/astronomical');
            const { TITHIS } = require('@/lib/constants/tithis');
            const { YOGAS } = require('@/lib/constants/yogas');
            const jd = kundali.julianDay;
            const tR = calculateTithi(jd);
            const tD = TITHIS[tR.number - 1];
            const yN = calculateYoga(jd);
            const yD = YOGAS[yN - 1];
            const sS = toSid(sunLon(jd), jd);
            const mI = getMasa(sS);
            const mD = MASA_NAMES[mI];

            return (
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs">
                   <span><span className="text-text-secondary/70">{msg('lagna', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(lagnaR?.name, locale)} ({kundali.ascendant.degree.toFixed(1)}°)</span></span>
                  <span className="text-gold-primary/15">|</span>
                   <span><span className="text-text-secondary/70">{msg('chandra', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonR?.name[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                   <span><span className="text-text-secondary/70">{msg('surya', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{sunR?.name[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                   <span><span className="text-text-secondary/70">{msg('nakshatra', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonP?.nakshatra?.name?.[locale] || '—'} ({msg('pada', locale)} {moonP?.pada || '—'})</span></span>
                  <span className="text-gold-primary/15">|</span>
                   <span><span className="text-text-secondary/70">{msg('tithi', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tD?.name?.[locale] || '—'} ({tD?.paksha === 'shukla' ? msg('shukla', locale) : msg('krishna', locale)})</span></span>
                  <span className="text-gold-primary/15">|</span>
                   <span><span className="text-text-secondary/70">{msg('yoga', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{yD?.name?.[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                   <span><span className="text-text-secondary/70">{msg('masa', locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{mD?.[locale] || '—'}</span></span>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* D1 + D9 Charts Side by Side */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                {msg('d1RashiChart', locale)}
              </h3>
              <div className="flex justify-center">
                {chartStyle === 'south' ? (
                   <ChartSouth data={kundali.chart} title={msg('d1RashiTitle', locale)} size={280} retrogradeIds={retrogradeIds} combustIds={combustIds} />
                ) : (
                   <ChartNorth data={kundali.chart} title={msg('d1RashiTitle', locale)} size={280} retrogradeIds={retrogradeIds} combustIds={combustIds} />
                )}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                {msg('d9NavamshaChart', locale)}
              </h3>
              <div className="flex justify-center">
                {chartStyle === 'south' ? (
                   <ChartSouth data={kundali.navamshaChart} title={msg('d9NavamshaTitle', locale)} size={280} />
                ) : (
                   <ChartNorth data={kundali.navamshaChart} title={msg('d9NavamshaTitle', locale)} size={280} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Planet Positions Table */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {msg('planetPositions', locale)}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                   <th className="text-gold-dark text-left py-2 px-3 font-semibold">{msg('planet', locale)}</th>
                   <th className="text-gold-dark text-left py-2 px-3 font-semibold">{msg('sign', locale)}</th>
                   <th className="text-gold-dark text-center py-2 px-3 font-semibold">{msg('house', locale)}</th>
                   <th className="text-gold-dark text-right py-2 px-3 font-semibold">{msg('degree', locale)}</th>
                   <th className="text-gold-dark text-left py-2 px-3 font-semibold">{msg('nakshatra', locale)}</th>
                   <th className="text-gold-dark text-center py-2 px-3 font-semibold">{msg('pada', locale)}</th>
                  <th className="text-gold-dark text-center py-2 px-3 font-semibold">R</th>
                </tr>
              </thead>
              <tbody>
                {kundali.planets.map((p) => (
                  <tr key={p.planet.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/[0.03]">
                    <td className="py-2 px-3 font-medium" style={{ color: PLANET_COLORS[p.planet.id] || '#d4a853' }}>
                      <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(p.planet.name, locale)}</span>
                    </td>
                    <td className="py-2 px-3 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {tl(p.signName, locale)}
                    </td>
                    <td className="py-2 px-3 text-text-secondary text-center font-mono">{p.house}</td>
                    <td className="py-2 px-3 text-text-secondary text-right font-mono">{p.degree}</td>
                    <td className="py-2 px-3 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {tl(p.nakshatra.name, locale)}
                    </td>
                    <td className="py-2 px-3 text-text-secondary text-center font-mono">{p.pada}</td>
                    <td className="py-2 px-3 text-center">
                      {p.isRetrograde ? <span className="text-red-400 font-bold">R</span> : <span className="text-text-secondary/50">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Vimshottari Dasha Summary */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {msg('vimshottariMahaDasha', locale)}
          </h3>
          <div className="space-y-2">
            {mahaDashas.map((d, i) => {
              const start = new Date(d.startDate);
              const end = new Date(d.endDate);
              const isCurrent = now >= start && now <= end;
              const isPast = now > end;
              return (
                <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${isCurrent ? 'bg-gold-primary/10 border border-gold-primary/30' : 'border border-gold-primary/5'} ${isPast ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/40'}`} />
                    <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {tl(d.planetName, locale)}
                    </span>
                     {isCurrent && <span className="text-xs text-gold-primary font-bold uppercase tracking-wider">{msg('current', locale)}</span>}
                  </div>
                  <span className="text-text-secondary text-xs font-mono">{d.startDate} → {d.endDate}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Key Doshas */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {msg('keyDoshas', locale)}
          </h3>
          {doshas.some(d => d.present) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {doshas.filter(d => d.present).map((dosha, i) => (
              <div key={i} className="rounded-xl p-4 border bg-red-500/5 border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                    {dosha.name[tl({ en: 'en', hi: 'hi', sa: 'hi', ta: 'en', te: 'en', bn: 'en', kn: 'en', gu: 'en', mai: 'hi', mr: 'hi' }, locale)]}
                  </span>
                </div>
                <p className="text-text-secondary/75 text-xs ml-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {dosha.detail[tl({ en: 'en', hi: 'hi', sa: 'hi', ta: 'en', te: 'en', bn: 'en', kn: 'en', gu: 'en', mai: 'hi', mr: 'hi' }, locale)]}
                </p>
                <p className="text-text-secondary/55 text-[11px] ml-4 mt-1.5 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {DOSHA_EXPLANATIONS[dosha.name.en]?.[isDevanagari ? 'hi' : 'en'] ?? ''}
                </p>
              </div>
            ))}
          </div>
          ) : (
          <p className="text-emerald-400/70 text-sm text-center py-2">
            {msg('nonePresent', locale)}
          </p>
          )}
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-text-secondary/55 text-xs">
            Generated by <span className="text-gold-dark/50">Dekho Panchang</span> — dekhopanchang.com
          </p>
        </div>
      </div>
    </div>
  );
}

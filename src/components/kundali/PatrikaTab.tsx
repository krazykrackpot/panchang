'use client';

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

  // Manglik: Mars in 1,2,4,7,8,12
  const mars = kundali.planets.find(p => p.planet.id === 2);
  const isManglik = mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
  doshas.push({
    name: { en: 'Manglik Dosha', hi: 'मांगलिक दोष', sa: 'मांगलिक दोष', mai: 'मांगलिक दोष', mr: 'मांगलिक दोष', ta: 'செவ்வாய் தோஷம்', te: 'కుజ దోషం', bn: 'মাঙ্গলিক দোষ', kn: 'ಮಾಂಗಲಿಕ ದೋಷ', gu: 'માંગલિક દોષ' },
    present: isManglik,
    detail: isManglik
      ? { en: `Mars in House ${mars!.house}`, hi: `मंगल भाव ${mars!.house} में`, sa: `मङ्गलः भावे ${mars!.house}`, mai: `मंगल भाव ${mars!.house} में`, mr: `मंगळ भाव ${mars!.house} मध्ये`, ta: `செவ்வாய் பாவம் ${mars!.house}-இல்`, te: `కుజుడు భావం ${mars!.house}లో`, bn: `মঙ্গল ভাব ${mars!.house}-এ`, kn: `ಕುಜ ಭಾವ ${mars!.house}ರಲ್ಲಿ`, gu: `મંગળ ભાવ ${mars!.house}માં` }
      : { en: 'Mars not in 1/2/4/7/8/12', hi: 'मंगल 1/2/4/7/8/12 में नहीं', sa: 'मङ्गलः 1/2/4/7/8/12 भावे नास्ति', mai: 'मंगल 1/2/4/7/8/12 में नहीं', mr: 'मंगळ 1/2/4/7/8/12 मध्ये नाही', ta: 'செவ்வாய் 1/2/4/7/8/12-இல் இல்லை', te: 'కుజుడు 1/2/4/7/8/12లో లేడు', bn: 'মঙ্গল 1/2/4/7/8/12-এ নেই', kn: 'ಕುಜ 1/2/4/7/8/12ರಲ್ಲಿ ಇಲ್ಲ', gu: 'મંગળ 1/2/4/7/8/12માં નથી' },
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
          label={tl({ en: 'Print', hi: 'प्रिंट', sa: 'मुद्रयतु', ta: 'அச்சிடு', te: 'ముద్రణ', bn: 'মুদ্রণ', kn: 'ಮುದ್ರಣ', gu: 'છાપો', mai: 'प्रिंट', mr: 'मुद्रण' }, locale)}
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
            {tl({ en: 'Janma Patrika', hi: 'जन्म पत्रिका', sa: 'जन्मपत्रिका', ta: 'ஜன்ம பத்திரிகை', te: 'జన్మ పత్రిక', bn: 'জন্ম পত্রিকা', kn: 'ಜನ್ಮ ಪತ್ರಿಕೆ', gu: 'જન્મ પત્રિકા', mai: 'जन्म पत्रिका', mr: 'जन्मपत्रिका' }, locale)}
          </h2>

          {/* Name */}
          <p className="text-gold-primary text-xl font-bold" style={headingFont}>{bd.name || (tl({ en: 'Native', hi: 'जातक', sa: 'जातकः', ta: 'ஜாதகர்', te: 'జాతకుడు', bn: 'জাতক', kn: 'ಜಾತಕ', gu: 'જાતક', mai: 'जातक', mr: 'जातक' }, locale))}</p>

          {/* Birth data grid */}
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
              <span className="text-gold-dark text-right">{tl({ en: 'Date of Birth', hi: 'जन्म दिनांक', sa: 'जन्मदिनाङ्कः', ta: 'பிறந்த தேதி', te: 'జన్మ తేదీ', bn: 'জন্ম তারিখ', kn: 'ಜನ್ಮ ದಿನಾಂಕ', gu: 'જન્મ તારીખ', mai: 'जन्म तिथि', mr: 'जन्म दिनांक' }, locale)}</span>
              <span className="text-text-secondary text-left font-mono">{bd.date}</span>
              <span className="text-gold-dark text-right">{tl({ en: 'Time of Birth', hi: 'जन्म समय', sa: 'जन्मसमयः', ta: 'பிறந்த நேரம்', te: 'జన్మ సమయం', bn: 'জন্মের সময়', kn: 'ಜನ್ಮ ಸಮಯ', gu: 'જન্મ સમય', mai: 'जन्म समय', mr: 'जन्म वेळ' }, locale)}</span>
              <span className="text-text-secondary text-left font-mono">{bd.time}</span>
              <span className="text-gold-dark text-right">{tl({ en: 'Place of Birth', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्', ta: 'பிறந்த இடம்', te: 'జన్మ స్థలం', bn: 'জন্মস্থান', kn: 'ಜನ್ಮಸ್ಥಳ', gu: 'જન્મ સ્થળ', mai: 'जन्म स्थान', mr: 'जन्मस्थान' }, locale)}</span>
              <span className="text-text-secondary text-left">{bd.place || `${bd.lat.toFixed(2)}°N, ${bd.lng.toFixed(2)}°E`}</span>
              <span className="text-gold-dark text-right">{tl({ en: 'Ayanamsha', hi: 'अयनांश', sa: 'अयनांशः', ta: 'அயனாம்சம்', te: 'అయనాంశం', bn: 'অয়নাংশ', kn: 'ಅಯನಾಂಶ', gu: 'અયનાંશ', mai: 'अयनांश', mr: 'अयनांश' }, locale)}</span>
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
                  <span><span className="text-text-secondary/70">{tl({ en: 'Lagna', hi: 'लग्न', sa: 'लग्नम्', ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', gu: 'લગ્ન', mai: 'लग्न', mr: 'लग्न' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(lagnaR?.name, locale)} ({kundali.ascendant.degree.toFixed(1)}°)</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{tl({ en: 'Chandra', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonR?.name[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{tl({ en: 'Surya', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mai: 'सूर्य', mr: 'सूर्य' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{sunR?.name[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्', ta: 'நட்சத்திரம்', te: 'నక్షత్రం', bn: 'নক্ষত্র', kn: 'ನಕ್ಷತ್ರ', gu: 'નક્ષત્ર', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonP?.nakshatra?.name?.[locale] || '—'} ({tl({ en: 'Pada', hi: 'पाद', sa: 'पादः', ta: 'பாதம்', te: 'పాదం', bn: 'পাদ', kn: 'ಪಾದ', gu: 'પાદ', mai: 'पाद', mr: 'पाद' }, locale)} {moonP?.pada || '—'})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{tl({ en: 'Tithi', hi: 'तिथि', sa: 'तिथिः', ta: 'திதி', te: 'తిథి', bn: 'তিথি', kn: 'ತಿಥಿ', gu: 'તિથિ', mai: 'तिथि', mr: 'तिथी' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tD?.name?.[locale] || '—'} ({tD?.paksha === 'shukla' ? (tl({ en: 'Shukla', hi: 'शुक्ल', sa: 'शुक्लः', ta: 'சுக்ல', te: 'శుక్ల', bn: 'শুক্ল', kn: 'ಶುಕ್ಲ', gu: 'શુક્લ', mai: 'शुक्ल', mr: 'शुक्ल' }, locale)) : (tl({ en: 'Krishna', hi: 'कृष्ण', sa: 'कृष्णः', ta: 'கிருஷ்ண', te: 'కృష్ణ', bn: 'কৃষ্ণ', kn: 'ಕೃಷ್ಣ', gu: 'કૃષ્ણ', mai: 'कृष्ण', mr: 'कृष्ण' }, locale))})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{tl({ en: 'Yoga', hi: 'योग', sa: 'योगः', ta: 'யோகம்', te: 'యోగం', bn: 'যোগ', kn: 'ಯೋಗ', gu: 'યોગ', mai: 'योग', mr: 'योग' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{yD?.name?.[locale] || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{tl({ en: 'Masa', hi: 'मास', sa: 'मासः', ta: 'மாதம்', te: 'మాసం', bn: 'মাস', kn: 'ಮಾಸ', gu: 'મહિનો', mai: 'मास', mr: 'मास' }, locale)}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{mD?.[locale] || '—'}</span></span>
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
                {tl({ en: 'D1 — Rashi Chart', hi: 'D1 — राशि चक्र', sa: 'D1 — राशिचक्रम्', ta: 'D1 — ராசி சக்கரம்', te: 'D1 — రాశి చక్రం', bn: 'D1 — রাশি চক্র', kn: 'D1 — ರಾಶಿ ಚಕ್ರ', gu: 'D1 — રાશિ ચક્ર', mai: 'D1 — राशि चक्र', mr: 'D1 — राशी चक्र' }, locale)}
              </h3>
              <div className="flex justify-center">
                {chartStyle === 'south' ? (
                  <ChartSouth data={kundali.chart} title={tl({ en: 'D1 Rashi', hi: 'D1 राशि', sa: 'D1 राशिः', ta: 'D1 ராசி', te: 'D1 రాశి', bn: 'D1 রাশি', kn: 'D1 ರಾಶಿ', gu: 'D1 રાશિ', mai: 'D1 राशि', mr: 'D1 राशी' }, locale)} size={280} retrogradeIds={retrogradeIds} combustIds={combustIds} />
                ) : (
                  <ChartNorth data={kundali.chart} title={tl({ en: 'D1 Rashi', hi: 'D1 राशि', sa: 'D1 राशिः', ta: 'D1 ராசி', te: 'D1 రాశి', bn: 'D1 রাশি', kn: 'D1 ರಾಶಿ', gu: 'D1 રાશિ', mai: 'D1 राशि', mr: 'D1 राशी' }, locale)} size={280} retrogradeIds={retrogradeIds} combustIds={combustIds} />
                )}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                {tl({ en: 'D9 — Navamsha Chart', hi: 'D9 — नवांश चक्र', sa: 'D9 — नवांशचक्रम्', ta: 'D9 — நவாம்ச சக்கரம்', te: 'D9 — నవాంశ చక్రం', bn: 'D9 — নবাংশ চক্র', kn: 'D9 — ನವಾಂಶ ಚಕ್ರ', gu: 'D9 — નવાંશ ચક્ર', mai: 'D9 — नवांश चक्र', mr: 'D9 — नवांश चक्र' }, locale)}
              </h3>
              <div className="flex justify-center">
                {chartStyle === 'south' ? (
                  <ChartSouth data={kundali.navamshaChart} title={tl({ en: 'D9 Navamsha', hi: 'D9 नवांश', sa: 'D9 नवांशः', ta: 'D9 நவாம்சம்', te: 'D9 నవాంశం', bn: 'D9 নবাংশ', kn: 'D9 ನವಾಂಶ', gu: 'D9 નવાંશ', mai: 'D9 नवांश', mr: 'D9 नवांश' }, locale)} size={280} />
                ) : (
                  <ChartNorth data={kundali.navamshaChart} title={tl({ en: 'D9 Navamsha', hi: 'D9 नवांश', sa: 'D9 नवांशः', ta: 'D9 நவாம்சம்', te: 'D9 నవాంశం', bn: 'D9 নবাংশ', kn: 'D9 ನವಾಂಶ', gu: 'D9 નવાંશ', mai: 'D9 नवांश', mr: 'D9 नवांश' }, locale)} size={280} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-primary/10" />

        {/* Planet Positions Table */}
        <div>
          <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
            {tl({ en: 'Planet Positions', hi: 'ग्रह स्थिति', sa: 'ग्रहस्थितयः', ta: 'கிரக நிலைகள்', te: 'గ్రహ స్థానాలు', bn: 'গ্রহ অবস্থান', kn: 'ಗ್ರಹ ಸ್ಥಾನಗಳು', gu: 'ગ્રહ સ્થિતિ', mai: 'ग्रह स्थिति', mr: 'ग्रह स्थिती' }, locale)}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-gold-dark text-left py-2 px-3 font-semibold">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः', ta: 'கிரகம்', te: 'గ్రహం', bn: 'গ্রহ', kn: 'ಗ್ರಹ', gu: 'ગ્રહ', mai: 'ग्रह', mr: 'ग्रह' }, locale)}</th>
                  <th className="text-gold-dark text-left py-2 px-3 font-semibold">{tl({ en: 'Sign', hi: 'राशि', sa: 'राशिः', ta: 'ராசி', te: 'రాశి', bn: 'রাশি', kn: 'ರಾಶಿ', gu: 'રાશિ', mai: 'राशि', mr: 'राशी' }, locale)}</th>
                  <th className="text-gold-dark text-center py-2 px-3 font-semibold">{tl({ en: 'House', hi: 'भाव', sa: 'भावः', ta: 'பாவம்', te: 'భావం', bn: 'ভাব', kn: 'ಭಾವ', gu: 'ભાવ', mai: 'भाव', mr: 'भाव' }, locale)}</th>
                  <th className="text-gold-dark text-right py-2 px-3 font-semibold">{tl({ en: 'Degree', hi: 'अंश', sa: 'अंशः', ta: 'பாகை', te: 'అంశం', bn: 'অংশ', kn: 'ಅಂಶ', gu: 'અંશ', mai: 'अंश', mr: 'अंश' }, locale)}</th>
                  <th className="text-gold-dark text-left py-2 px-3 font-semibold">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्', ta: 'நட்சத்திரம்', te: 'నక్షత్రం', bn: 'নক্ষত্র', kn: 'ನಕ್ಷತ್ರ', gu: 'નક્ષત્ર', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</th>
                  <th className="text-gold-dark text-center py-2 px-3 font-semibold">{tl({ en: 'Pada', hi: 'पाद', sa: 'पादः', ta: 'பாதம்', te: 'పాదం', bn: 'পাদ', kn: 'ಪಾದ', gu: 'પાદ', mai: 'पाद', mr: 'पाद' }, locale)}</th>
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
            {tl({ en: 'Vimshottari Maha Dasha', hi: 'विंशोत्तरी महादशा', sa: 'विंशोत्तरीमहादशा', ta: 'விம்சோத்தரி மஹாதசை', te: 'వింశోత్తరి మహాదశ', bn: 'বিংশোত্তরী মহাদশা', kn: 'ವಿಂಶೋತ್ತರಿ ಮಹಾದಶೆ', gu: 'વિંશોત્તરી મહાદશા', mai: 'विंशोत्तरी महादशा', mr: 'विंशोत्तरी महादशा' }, locale)}
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
                    {isCurrent && <span className="text-xs text-gold-primary font-bold uppercase tracking-wider">{tl({ en: 'Current', hi: 'वर्तमान', sa: 'वर्तमानः', ta: 'தற்போதைய', te: 'ప్రస్తుత', bn: 'বর্তমান', kn: 'ಪ್ರಸ್ತುತ', gu: 'વર્તમાન', mai: 'वर्तमान', mr: 'सध्याचा' }, locale)}</span>}
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
            {tl({ en: 'Key Doshas', hi: 'प्रमुख दोष', sa: 'प्रमुखदोषाः', ta: 'முக்கிய தோஷங்கள்', te: 'ముఖ్య దోషాలు', bn: 'প্রমুখ দোষ', kn: 'ಪ್ರಮುಖ ದೋಷಗಳು', gu: 'મુખ્ય દોષ', mai: 'प्रमुख दोष', mr: 'प्रमुख दोष' }, locale)}
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
              </div>
            ))}
          </div>
          ) : (
          <p className="text-emerald-400/70 text-sm text-center py-2">
            {tl({ en: 'None present', hi: 'कोई दोष नहीं', sa: 'कोऽपि दोषो नास्ति', ta: 'எதுவும் இல்லை', te: 'ఏదీ లేదు', bn: 'কোনো দোষ নেই', kn: 'ಯಾವ ದೋಷವೂ ಇಲ್ಲ', gu: 'કોઈ દોષ નથી', mai: 'कोनो दोष नहि अछि', mr: 'कोणताही दोष नाही' }, locale)}
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

'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import type { Locale , LocaleText} from '@/types/panchang';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { dateToJD, calculateTithi, moonLongitude, toSidereal, getNakshatraNumber, getRashiNumber } from '@/lib/ephem/astronomical';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const TITHI_NAMES: LocaleText[] = [
  { en: 'Pratipada (1)', hi: 'प्रतिपदा (1)', sa: 'प्रतिपदा (1)', mai: 'प्रतिपदा (1)', mr: 'प्रतिपदा (1)', ta: 'Pratipada (1)', te: 'Pratipada (1)', bn: 'Pratipada (1)', kn: 'Pratipada (1)', gu: 'Pratipada (1)' },
  { en: 'Dwitiya (2)', hi: 'द्वितीया (2)', sa: 'द्वितीया (2)', mai: 'द्वितीया (2)', mr: 'द्वितीया (2)', ta: 'Dwitiya (2)', te: 'Dwitiya (2)', bn: 'Dwitiya (2)', kn: 'Dwitiya (2)', gu: 'Dwitiya (2)' },
  { en: 'Tritiya (3)', hi: 'तृतीया (3)', sa: 'तृतीया (3)', mai: 'तृतीया (3)', mr: 'तृतीया (3)', ta: 'Tritiya (3)', te: 'Tritiya (3)', bn: 'Tritiya (3)', kn: 'Tritiya (3)', gu: 'Tritiya (3)' },
  { en: 'Chaturthi (4)', hi: 'चतुर्थी (4)', sa: 'चतुर्थी (4)', mai: 'चतुर्थी (4)', mr: 'चतुर्थी (4)', ta: 'Chaturthi (4)', te: 'Chaturthi (4)', bn: 'Chaturthi (4)', kn: 'Chaturthi (4)', gu: 'Chaturthi (4)' },
  { en: 'Panchami (5)', hi: 'पंचमी (5)', sa: 'पंचमी (5)', mai: 'पंचमी (5)', mr: 'पंचमी (5)', ta: 'Panchami (5)', te: 'Panchami (5)', bn: 'Panchami (5)', kn: 'Panchami (5)', gu: 'Panchami (5)' },
  { en: 'Shashthi (6)', hi: 'षष्ठी (6)', sa: 'षष्ठी (6)', mai: 'षष्ठी (6)', mr: 'षष्ठी (6)', ta: 'Shashthi (6)', te: 'Shashthi (6)', bn: 'Shashthi (6)', kn: 'Shashthi (6)', gu: 'Shashthi (6)' },
  { en: 'Saptami (7)', hi: 'सप्तमी (7)', sa: 'सप्तमी (7)', mai: 'सप्तमी (7)', mr: 'सप्तमी (7)', ta: 'Saptami (7)', te: 'Saptami (7)', bn: 'Saptami (7)', kn: 'Saptami (7)', gu: 'Saptami (7)' },
  { en: 'Ashtami (8)', hi: 'अष्टमी (8)', sa: 'अष्टमी (8)', mai: 'अष्टमी (8)', mr: 'अष्टमी (8)', ta: 'Ashtami (8)', te: 'Ashtami (8)', bn: 'Ashtami (8)', kn: 'Ashtami (8)', gu: 'Ashtami (8)' },
  { en: 'Navami (9)', hi: 'नवमी (9)', sa: 'नवमी (9)', mai: 'नवमी (9)', mr: 'नवमी (9)', ta: 'Navami (9)', te: 'Navami (9)', bn: 'Navami (9)', kn: 'Navami (9)', gu: 'Navami (9)' },
  { en: 'Dashami (10)', hi: 'दशमी (10)', sa: 'दशमी (10)', mai: 'दशमी (10)', mr: 'दशमी (10)', ta: 'Dashami (10)', te: 'Dashami (10)', bn: 'Dashami (10)', kn: 'Dashami (10)', gu: 'Dashami (10)' },
  { en: 'Ekadashi (11)', hi: 'एकादशी (11)', sa: 'एकादशी (11)', mai: 'एकादशी (11)', mr: 'एकादशी (11)', ta: 'Ekadashi (11)', te: 'Ekadashi (11)', bn: 'Ekadashi (11)', kn: 'Ekadashi (11)', gu: 'Ekadashi (11)' },
  { en: 'Dwadashi (12)', hi: 'द्वादशी (12)', sa: 'द्वादशी (12)', mai: 'द्वादशी (12)', mr: 'द्वादशी (12)', ta: 'Dwadashi (12)', te: 'Dwadashi (12)', bn: 'Dwadashi (12)', kn: 'Dwadashi (12)', gu: 'Dwadashi (12)' },
  { en: 'Trayodashi (13)', hi: 'त्रयोदशी (13)', sa: 'त्रयोदशी (13)', mai: 'त्रयोदशी (13)', mr: 'त्रयोदशी (13)', ta: 'Trayodashi (13)', te: 'Trayodashi (13)', bn: 'Trayodashi (13)', kn: 'Trayodashi (13)', gu: 'Trayodashi (13)' },
  { en: 'Chaturdashi (14)', hi: 'चतुर्दशी (14)', sa: 'चतुर्दशी (14)', mai: 'चतुर्दशी (14)', mr: 'चतुर्दशी (14)', ta: 'Chaturdashi (14)', te: 'Chaturdashi (14)', bn: 'Chaturdashi (14)', kn: 'Chaturdashi (14)', gu: 'Chaturdashi (14)' },
  { en: 'Purnima/Amavasya (15/30)', hi: 'पूर्णिमा/अमावस्या (15/30)', sa: 'पूर्णिमा/अमावस्या (15/30)', mai: 'पूर्णिमा/अमावस्या (15/30)', mr: 'पूर्णिमा/अमावस्या (15/30)', ta: 'Purnima/Amavasya (15/30)', te: 'Purnima/Amavasya (15/30)', bn: 'Purnima/Amavasya (15/30)', kn: 'Purnima/Amavasya (15/30)', gu: 'Purnima/Amavasya (15/30)' },
];

const PAKSHA_OPTIONS = [
  { value: 'shukla', en: 'Shukla Paksha (Bright)', hi: 'शुक्ल पक्ष' },
  { value: 'krishna', en: 'Krishna Paksha (Dark)', hi: 'कृष्ण पक्ष' },
];

const MASA_NAMES = [
  { en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्र', mai: 'चैत्र', mr: 'चैत्र', ta: 'Chaitra', te: 'Chaitra', bn: 'Chaitra', kn: 'Chaitra', gu: 'Chaitra' }, { en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाख', mai: 'वैशाख', mr: 'वैशाख', ta: 'Vaishakha', te: 'Vaishakha', bn: 'Vaishakha', kn: 'Vaishakha', gu: 'Vaishakha' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठ', mai: 'ज्येष्ठ', mr: 'ज्येष्ठ', ta: 'Jyeshtha', te: 'Jyeshtha', bn: 'Jyeshtha', kn: 'Jyeshtha', gu: 'Jyeshtha' }, { en: 'Ashadha', hi: 'आषाढ़', sa: 'आषाढ़', mai: 'आषाढ़', mr: 'आषाढ़', ta: 'Ashadha', te: 'Ashadha', bn: 'Ashadha', kn: 'Ashadha', gu: 'Ashadha' },
  { en: 'Shravana', hi: 'श्रावण', sa: 'श्रावण', mai: 'श्रावण', mr: 'श्रावण', ta: 'Shravana', te: 'Shravana', bn: 'Shravana', kn: 'Shravana', gu: 'Shravana' }, { en: 'Bhadrapada', hi: 'भाद्रपद', sa: 'भाद्रपद', mai: 'भाद्रपद', mr: 'भाद्रपद', ta: 'Bhadrapada', te: 'Bhadrapada', bn: 'Bhadrapada', kn: 'Bhadrapada', gu: 'Bhadrapada' },
  { en: 'Ashwina', hi: 'आश्विन', sa: 'आश्विन', mai: 'आश्विन', mr: 'आश्विन', ta: 'Ashwina', te: 'Ashwina', bn: 'Ashwina', kn: 'Ashwina', gu: 'Ashwina' }, { en: 'Kartika', hi: 'कार्तिक', sa: 'कार्तिक', mai: 'कार्तिक', mr: 'कार्तिक', ta: 'Kartika', te: 'Kartika', bn: 'Kartika', kn: 'Kartika', gu: 'Kartika' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष', sa: 'मार्गशीर्ष', mai: 'मार्गशीर्ष', mr: 'मार्गशीर्ष', ta: 'Margashirsha', te: 'Margashirsha', bn: 'Margashirsha', kn: 'Margashirsha', gu: 'Margashirsha' }, { en: 'Pausha', hi: 'पौष', sa: 'पौष', mai: 'पौष', mr: 'पौष', ta: 'Pausha', te: 'Pausha', bn: 'Pausha', kn: 'Pausha', gu: 'Pausha' },
  { en: 'Magha', hi: 'माघ', sa: 'माघ', mai: 'माघ', mr: 'माघ', ta: 'Magha', te: 'Magha', bn: 'Magha', kn: 'Magha', gu: 'Magha' }, { en: 'Phalguna', hi: 'फाल्गुन', sa: 'फाल्गुन', mai: 'फाल्गुन', mr: 'फाल्गुन', ta: 'Phalguna', te: 'Phalguna', bn: 'Phalguna', kn: 'Phalguna', gu: 'Phalguna' },
];

function findTithiDateInYear(tithiNum: number, paksha: 'shukla' | 'krishna', year: number): string | null {
  // Scan from July (after Pitru Paksha typically in Sep/Oct) for the matching tithi
  // during Pitru Paksha (Krishna Paksha of Bhadrapada/Ashwina)
  // For simplicity, scan the entire year and find dates where this tithi occurs in Krishna Paksha
  const results: string[] = [];

  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const tzOffset = -(new Date().getTimezoneOffset() / 60);
      const jd = dateToJD(year, month, day, 12 - tzOffset); // noon local time in UT
      const tithi = calculateTithi(jd);
      const actualTithiNum = tithi.number;

      // Shukla paksha tithis: 1-15, Krishna: 16-30
      if (paksha === 'shukla' && actualTithiNum === tithiNum) {
        results.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      } else if (paksha === 'krishna' && actualTithiNum === tithiNum + 15) {
        results.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
      }
    }
  }

  // Return dates found (Pitru Paksha is typically around Sep/Oct — prioritize those)
  const sepOctDates = results.filter(d => {
    const m = parseInt(d.split('-')[1]);
    return m >= 8 && m <= 10;
  });
  return sepOctDates[0] || results[0] || null;
}

export default function ShraddhaPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [tithiIndex, setTithiIndex] = useState(-1);
  const [paksha, setPaksha] = useState<'shukla' | 'krishna'>('krishna');
  const currentYear = new Date().getFullYear();

  const result = useMemo(() => {
    if (tithiIndex < 0) return null;
    const tithiNum = tithiIndex === 14 ? 15 : tithiIndex + 1;
    const date = findTithiDateInYear(tithiNum, paksha, currentYear);
    const nextDate = findTithiDateInYear(tithiNum, paksha, currentYear + 1);
    return { date, nextDate };
  }, [tithiIndex, paksha, currentYear]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{isTamil ? 'சிராத்தம் கணிப்பான்' : locale === 'en' ? 'Shraddha Calculator' : 'श्राद्ध गणक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Calculate the annual Shraddha date based on the death tithi'
            : 'मृत्यु तिथि के आधार पर वार्षिक श्राद्ध तिथि की गणना करें'}
        </p>
      </motion.div>

      {/* Shraddha Intro */}
      <InfoBlock
        id="shraddha-intro"
        title={!isDevanagariLocale(locale) ? 'What is Shraddha?' : 'श्राद्ध क्या है?'}
        defaultOpen={true}
      >
        {isDevanagari ? (
          <p>श्राद्ध वार्षिक अनुष्ठान है जिसमें मृत पूर्वजों को उनकी पुण्यतिथि पर — ग्रेगोरियन नहीं, हिन्दू चन्द्र तिथि के अनुसार — भोजन और प्रार्थना अर्पित की जाती है। यह सबसे महत्वपूर्ण कर्तव्यों में से एक है — माना जाता है कि इससे दिवंगत आत्मा को शांति मिलती है और परिवार को आशीर्वाद प्राप्त होता है। प्रतिवर्ष तिथि बदलती है क्योंकि यह मृत्यु की चन्द्र तिथि पर आधारित है।</p>
        ) : (
          <p>Shraddha is the annual ritual of offering food and prayers to deceased ancestors on the anniversary of their passing — by Hindu lunar calendar, not Gregorian date. It&apos;s one of the most important duties — believed to bring peace to the departed soul and blessings to the family. The date changes every year because it follows the lunar tithi of death.</p>
        )}
      </InfoBlock>

      {/* Input */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3">
              {!isDevanagariLocale(locale) ? 'Paksha (Lunar Phase)' : 'पक्ष'}
            </label>
            <div className="flex gap-3">
              {PAKSHA_OPTIONS.map(p => (
                <button key={p.value} onClick={() => setPaksha(p.value as 'shukla' | 'krishna')}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    paksha === p.value ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'bg-bg-tertiary/30 text-text-secondary border border-gold-primary/10'
                  }`}>{!isDevanagariLocale(locale) ? p.en : p.hi}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3">
              {!isDevanagariLocale(locale) ? 'Death Tithi' : 'मृत्यु तिथि'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TITHI_NAMES.map((t, i) => (
                <button key={i} onClick={() => setTithiIndex(i)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    tithiIndex === i ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'bg-bg-tertiary/30 text-text-secondary border border-gold-primary/10 hover:border-gold-primary/25'
                  }`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {!isDevanagariLocale(locale) ? t.en : t.hi}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GoldDivider />
            <div className="my-10 space-y-4">
              {result.date && (
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 to-transparent text-center">
                  <div className="text-gold-dark text-xs uppercase tracking-[0.3em] font-bold mb-2">
                    {currentYear} {!isDevanagariLocale(locale) ? 'Shraddha Date' : 'श्राद्ध तिथि'}
                  </div>
                  <div className="text-gold-light text-3xl font-bold" style={headingFont}>
                    {new Date(result.date + 'T00:00:00').toLocaleDateString(!isDevanagariLocale(locale) ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
              {result.nextDate && (
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {currentYear + 1} {!isDevanagariLocale(locale) ? 'Shraddha Date' : 'श्राद्ध तिथि'}
                  </div>
                  <div className="text-gold-light text-xl font-bold" style={headingFont}>
                    {new Date(result.nextDate + 'T00:00:00').toLocaleDateString(!isDevanagariLocale(locale) ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
              <div className="text-center text-text-secondary/75 text-xs mt-4">
                {locale === 'en'
                  ? 'The Shraddha ceremony should be performed on the matching tithi during Pitru Paksha (Krishna Paksha of Bhadrapada/Ashwina).'
                  : 'श्राद्ध कर्म पितृ पक्ष (भाद्रपद/आश्विन कृष्ण पक्ष) में संबंधित तिथि पर करना चाहिए।'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

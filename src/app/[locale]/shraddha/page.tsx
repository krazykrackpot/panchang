'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import type { Locale } from '@/types/panchang';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { dateToJD, calculateTithi, moonLongitude, toSidereal, getNakshatraNumber, getRashiNumber } from '@/lib/ephem/astronomical';

const TITHI_NAMES: { en: string; hi: string }[] = [
  { en: 'Pratipada (1)', hi: 'प्रतिपदा (1)' },
  { en: 'Dwitiya (2)', hi: 'द्वितीया (2)' },
  { en: 'Tritiya (3)', hi: 'तृतीया (3)' },
  { en: 'Chaturthi (4)', hi: 'चतुर्थी (4)' },
  { en: 'Panchami (5)', hi: 'पंचमी (5)' },
  { en: 'Shashthi (6)', hi: 'षष्ठी (6)' },
  { en: 'Saptami (7)', hi: 'सप्तमी (7)' },
  { en: 'Ashtami (8)', hi: 'अष्टमी (8)' },
  { en: 'Navami (9)', hi: 'नवमी (9)' },
  { en: 'Dashami (10)', hi: 'दशमी (10)' },
  { en: 'Ekadashi (11)', hi: 'एकादशी (11)' },
  { en: 'Dwadashi (12)', hi: 'द्वादशी (12)' },
  { en: 'Trayodashi (13)', hi: 'त्रयोदशी (13)' },
  { en: 'Chaturdashi (14)', hi: 'चतुर्दशी (14)' },
  { en: 'Purnima/Amavasya (15/30)', hi: 'पूर्णिमा/अमावस्या (15/30)' },
];

const PAKSHA_OPTIONS = [
  { value: 'shukla', en: 'Shukla Paksha (Bright)', hi: 'शुक्ल पक्ष' },
  { value: 'krishna', en: 'Krishna Paksha (Dark)', hi: 'कृष्ण पक्ष' },
];

const MASA_NAMES = [
  { en: 'Chaitra', hi: 'चैत्र' }, { en: 'Vaishakha', hi: 'वैशाख' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ' }, { en: 'Ashadha', hi: 'आषाढ़' },
  { en: 'Shravana', hi: 'श्रावण' }, { en: 'Bhadrapada', hi: 'भाद्रपद' },
  { en: 'Ashwina', hi: 'आश्विन' }, { en: 'Kartika', hi: 'कार्तिक' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष' }, { en: 'Pausha', hi: 'पौष' },
  { en: 'Magha', hi: 'माघ' }, { en: 'Phalguna', hi: 'फाल्गुन' },
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
  const isDevanagari = locale !== 'en';
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
          <span className="text-gold-gradient">{locale === 'en' ? 'Shraddha Calculator' : 'श्राद्ध गणक'}</span>
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
        title={locale === 'en' ? 'What is Shraddha?' : 'श्राद्ध क्या है?'}
        defaultOpen={true}
      >
        {locale === 'hi' ? (
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
              {locale === 'en' ? 'Paksha (Lunar Phase)' : 'पक्ष'}
            </label>
            <div className="flex gap-3">
              {PAKSHA_OPTIONS.map(p => (
                <button key={p.value} onClick={() => setPaksha(p.value as 'shukla' | 'krishna')}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    paksha === p.value ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'bg-bg-tertiary/30 text-text-secondary border border-gold-primary/10'
                  }`}>{locale === 'en' ? p.en : p.hi}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3">
              {locale === 'en' ? 'Death Tithi' : 'मृत्यु तिथि'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TITHI_NAMES.map((t, i) => (
                <button key={i} onClick={() => setTithiIndex(i)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    tithiIndex === i ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'bg-bg-tertiary/30 text-text-secondary border border-gold-primary/10 hover:border-gold-primary/25'
                  }`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {locale === 'en' ? t.en : t.hi}
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
                    {currentYear} {locale === 'en' ? 'Shraddha Date' : 'श्राद्ध तिथि'}
                  </div>
                  <div className="text-gold-light text-3xl font-bold" style={headingFont}>
                    {new Date(result.date + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
              {result.nextDate && (
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {currentYear + 1} {locale === 'en' ? 'Shraddha Date' : 'श्राद्ध तिथि'}
                  </div>
                  <div className="text-gold-light text-xl font-bold" style={headingFont}>
                    {new Date(result.nextDate + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
              <div className="text-center text-text-secondary/60 text-xs mt-4">
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

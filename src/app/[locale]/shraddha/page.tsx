'use client';

import { tl } from '@/lib/utils/trilingual';
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
  { en: 'Pratipada (1)', hi: 'प्रतिपदा (1)', sa: 'प्रतिपदा (१)', mai: 'प्रतिपदा (१)', mr: 'प्रतिपदा (१)', ta: 'பிரதிபதை (1)', te: 'ప్రతిపద (1)', bn: 'প্রতিপদ (১)', kn: 'ಪ್ರತಿಪದ (1)', gu: 'પ્રતિપદા (1)' },
  { en: 'Dwitiya (2)', hi: 'द्वितीया (2)', sa: 'द्वितीया (२)', mai: 'द्वितीया (२)', mr: 'द्वितीया (२)', ta: 'துவிதியை (2)', te: 'ద్వితీయ (2)', bn: 'দ্বিতীয়া (২)', kn: 'ದ್ವಿತೀಯ (2)', gu: 'દ્વિતીયા (2)' },
  { en: 'Tritiya (3)', hi: 'तृतीया (3)', sa: 'तृतीया (३)', mai: 'तृतीया (३)', mr: 'तृतीया (३)', ta: 'திரிதியை (3)', te: 'తృతీయ (3)', bn: 'তৃতীয়া (৩)', kn: 'ತೃತೀಯ (3)', gu: 'તૃતીયા (3)' },
  { en: 'Chaturthi (4)', hi: 'चतुर्थी (4)', sa: 'चतुर्थी (४)', mai: 'चतुर्थी (४)', mr: 'चतुर्थी (४)', ta: 'சதுர்த்தி (4)', te: 'చతుర్థి (4)', bn: 'চতুর্থী (৪)', kn: 'ಚತುರ್ಥಿ (4)', gu: 'ચતુર્થી (4)' },
  { en: 'Panchami (5)', hi: 'पंचमी (5)', sa: 'पञ्चमी (५)', mai: 'पंचमी (५)', mr: 'पंचमी (५)', ta: 'பஞ்சமி (5)', te: 'పంచమి (5)', bn: 'পঞ্চমী (৫)', kn: 'ಪಂಚಮಿ (5)', gu: 'પંચમી (5)' },
  { en: 'Shashthi (6)', hi: 'षष्ठी (6)', sa: 'षष्ठी (६)', mai: 'षष्ठी (६)', mr: 'षष्ठी (६)', ta: 'சஷ்டி (6)', te: 'షష్ఠి (6)', bn: 'ষষ্ঠী (৬)', kn: 'ಷಷ್ಠಿ (6)', gu: 'ષષ્ઠી (6)' },
  { en: 'Saptami (7)', hi: 'सप्तमी (7)', sa: 'सप्तमी (७)', mai: 'सप्तमी (७)', mr: 'सप्तमी (७)', ta: 'சப்தமி (7)', te: 'సప్తమి (7)', bn: 'সপ্তমী (৭)', kn: 'ಸಪ್ತಮಿ (7)', gu: 'સપ્તમી (7)' },
  { en: 'Ashtami (8)', hi: 'अष्टमी (8)', sa: 'अष्टमी (८)', mai: 'अष्टमी (८)', mr: 'अष्टमी (८)', ta: 'அஷ்டமி (8)', te: 'అష్టమి (8)', bn: 'অষ্টমী (৮)', kn: 'ಅಷ್ಟಮಿ (8)', gu: 'અષ્ટમી (8)' },
  { en: 'Navami (9)', hi: 'नवमी (9)', sa: 'नवमी (९)', mai: 'नवमी (९)', mr: 'नवमी (९)', ta: 'நவமி (9)', te: 'నవమి (9)', bn: 'নবমী (৯)', kn: 'ನವಮಿ (9)', gu: 'નવમી (9)' },
  { en: 'Dashami (10)', hi: 'दशमी (10)', sa: 'दशमी (१०)', mai: 'दशमी (१०)', mr: 'दशमी (१०)', ta: 'தசமி (10)', te: 'దశమి (10)', bn: 'দশমী (১০)', kn: 'ದಶಮಿ (10)', gu: 'દશમી (10)' },
  { en: 'Ekadashi (11)', hi: 'एकादशी (11)', sa: 'एकादशी (११)', mai: 'एकादशी (११)', mr: 'एकादशी (११)', ta: 'ஏகாதசி (11)', te: 'ఏకాదశి (11)', bn: 'একাদশী (১১)', kn: 'ಏಕಾದಶಿ (11)', gu: 'એકાદશી (11)' },
  { en: 'Dwadashi (12)', hi: 'द्वादशी (12)', sa: 'द्वादशी (१२)', mai: 'द्वादशी (१२)', mr: 'द्वादशी (१२)', ta: 'துவாதசி (12)', te: 'ద్వాదశి (12)', bn: 'দ্বাদশী (১২)', kn: 'ದ್ವಾದಶಿ (12)', gu: 'દ્વાદશી (12)' },
  { en: 'Trayodashi (13)', hi: 'त्रयोदशी (13)', sa: 'त्रयोदशी (१३)', mai: 'त्रयोदशी (१३)', mr: 'त्रयोदशी (१३)', ta: 'திரயோதசி (13)', te: 'త్రయోదశి (13)', bn: 'ত্রয়োদশী (১৩)', kn: 'ತ್ರಯೋದಶಿ (13)', gu: 'ત્રયોદશી (13)' },
  { en: 'Chaturdashi (14)', hi: 'चतुर्दशी (14)', sa: 'चतुर्दशी (१४)', mai: 'चतुर्दशी (१४)', mr: 'चतुर्दशी (१४)', ta: 'சதுர்த்தசி (14)', te: 'చతుర్దశి (14)', bn: 'চতুর্দশী (১৪)', kn: 'ಚತುರ್ದಶಿ (14)', gu: 'ચતુર્દશી (14)' },
  { en: 'Purnima/Amavasya (15/30)', hi: 'पूर्णिमा/अमावस्या (15/30)', sa: 'पूर्णिमा/अमावस्या (१५/३०)', mai: 'पूर्णिमा/अमावस्या (१५/३०)', mr: 'पौर्णिमा/अमावस्या (१५/३०)', ta: 'பௌர்ணமி/அமாவாசை (15/30)', te: 'పూర్ణిమ/అమావాస్య (15/30)', bn: 'পূর্ণিমা/অমাবস্যা (১৫/৩০)', kn: 'ಪೂರ್ಣಿಮ/ಅಮಾವಾಸ್ಯೆ (15/30)', gu: 'પૂર્ણિમા/અમાવસ્યા (15/30)' },
];

const PAKSHA_OPTIONS = [
  { value: 'shukla', en: 'Shukla Paksha (Bright)', hi: 'शुक्ल पक्ष' },
  { value: 'krishna', en: 'Krishna Paksha (Dark)', hi: 'कृष्ण पक्ष' },
];

const MASA_NAMES = [
  { en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्रः', mai: 'चैत', mr: 'चैत्र', ta: 'சித்திரை', te: 'చైత్రం', bn: 'চৈত্র', kn: 'ಚೈತ್ರ', gu: 'ચૈત્ર' }, { en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाखः', mai: 'वैशाख', mr: 'वैशाख', ta: 'வைகாசி', te: 'వైశాఖం', bn: 'বৈশাখ', kn: 'ವೈಶಾಖ', gu: 'વૈશાખ' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठः', mai: 'जेठ', mr: 'ज्येष्ठ', ta: 'ஆனி', te: 'జ్యేష్ఠం', bn: 'জ্যৈষ্ঠ', kn: 'ಜ್ಯೇಷ್ಠ', gu: 'જ્યેષ્ઠ' }, { en: 'Ashadha', hi: 'आषाढ़', sa: 'आषाढः', mai: 'आषाढ़', mr: 'आषाढ', ta: 'ஆடி', te: 'ఆషాఢం', bn: 'আষাঢ়', kn: 'ಆಷಾಢ', gu: 'અષાઢ' },
  { en: 'Shravana', hi: 'श्रावण', sa: 'श्रावणः', mai: 'सावन', mr: 'श्रावण', ta: 'ஆவணி', te: 'శ్రావణం', bn: 'শ্রাবণ', kn: 'ಶ್ರಾವಣ', gu: 'શ્રાવણ' }, { en: 'Bhadrapada', hi: 'भाद्रपद', sa: 'भाद्रपदः', mai: 'भादो', mr: 'भाद्रपद', ta: 'புரட்டாசி', te: 'భాద్రపదం', bn: 'ভাদ্র', kn: 'ಭಾದ್ರಪದ', gu: 'ભાદ્રપદ' },
  { en: 'Ashwina', hi: 'आश्विन', sa: 'आश्विनः', mai: 'आश्विन', mr: 'आश्विन', ta: 'ஐப்பசி', te: 'ఆశ్వయుజం', bn: 'আশ্বিন', kn: 'ಆಶ್ವಯುಜ', gu: 'આશ્વિન' }, { en: 'Kartika', hi: 'कार्तिक', sa: 'कार्तिकः', mai: 'कार्तिक', mr: 'कार्तिक', ta: 'கார்த்திகை', te: 'కార్తీకం', bn: 'কার্তিক', kn: 'ಕಾರ್ತೀಕ', gu: 'કાર્તિક' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष', sa: 'मार्गशीर्षः', mai: 'अगहन', mr: 'मार्गशीर्ष', ta: 'மார்கழி', te: 'మార్గశిరం', bn: 'অগ্রহায়ণ', kn: 'ಮಾರ್ಗಶಿರ', gu: 'માર્ગશીર્ષ' }, { en: 'Pausha', hi: 'पौष', sa: 'पौषः', mai: 'पूस', mr: 'पौष', ta: 'தை', te: 'పుష్యం', bn: 'পৌষ', kn: 'ಪುಷ್ಯ', gu: 'પોષ' },
  { en: 'Magha', hi: 'माघ', sa: 'माघः', mai: 'माघ', mr: 'माघ', ta: 'மாசி', te: 'మాఘం', bn: 'মাঘ', kn: 'ಮಾಘ', gu: 'માઘ' }, { en: 'Phalguna', hi: 'फाल्गुन', sa: 'फाल्गुनः', mai: 'फागुन', mr: 'फाल्गुन', ta: 'பங்குனி', te: 'ఫాల్గుణం', bn: 'ফাল্গুন', kn: 'ಫಾಲ್ಗುಣ', gu: 'ફાલ્ગુન' },
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
        title={tl({ en: 'What is Shraddha?', hi: 'श्राद्ध क्या है?', sa: 'श्राद्ध क्या है?' }, locale)}
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
              {tl({ en: 'Paksha (Lunar Phase)', hi: 'पक्ष', sa: 'पक्ष' }, locale)}
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
              {tl({ en: 'Death Tithi', hi: 'मृत्यु तिथि', sa: 'मृत्यु तिथि' }, locale)}
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
                    {currentYear} {tl({ en: 'Shraddha Date', hi: 'श्राद्ध तिथि', sa: 'श्राद्ध तिथि' }, locale)}
                  </div>
                  <div className="text-gold-light text-3xl font-bold" style={headingFont}>
                    {new Date(result.date + 'T00:00:00').toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'en-IN' }, locale), { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
              {result.nextDate && (
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center">
                  <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {currentYear + 1} {tl({ en: 'Shraddha Date', hi: 'श्राद्ध तिथि', sa: 'श्राद्ध तिथि' }, locale)}
                  </div>
                  <div className="text-gold-light text-xl font-bold" style={headingFont}>
                    {new Date(result.nextDate + 'T00:00:00').toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'en-IN' }, locale), { day: 'numeric', month: 'long', year: 'numeric' })}
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

'use client';


import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/calculations.json';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';


const ACCURACY_TABLE = [
  { item: { en: 'Sun longitude', hi: 'सूर्य देशान्तर', sa: 'सूर्यदेशान्तरम्' }, accuracy: '~0.01° (36 arcsec)', impact: { en: '~30 sec timing error', hi: '~30 सेकंड समय त्रुटि', sa: '~30 क्षणत्रुटिः' } },
  { item: { en: 'Moon longitude', hi: 'चन्द्र देशान्तर', sa: 'चन्द्रदेशान्तरम्' }, accuracy: '~0.003° (10 arcsec)', impact: { en: '~1-2 min tithi error', hi: '~1-2 मिनट तिथि त्रुटि', sa: '~1-2 निमेषतिथित्रुटिः' } },
  { item: { en: 'Lahiri Ayanamsha', hi: 'लहिरी अयनांश', sa: 'लहिरीअयनांशः' }, accuracy: '~1 arcsecond', impact: { en: 'Negligible', hi: 'नगण्य', sa: 'नगण्यम्' } },
  { item: { en: 'Sunrise/Sunset', hi: 'सूर्योदय/सूर्यास्त', sa: 'सूर्योदयः/सूर्यास्तः' }, accuracy: '~1-2 minutes', impact: { en: 'Affects Muhurta boundaries', hi: 'मुहूर्त सीमाओं को प्रभावित', sa: 'मुहूर्तसीमाः प्रभावयति' } },
  { item: { en: 'Transition times', hi: 'परिवर्तन समय', sa: 'परिवर्तनसमयः' }, accuracy: '~1-3 minutes', impact: { en: 'Tithi/Nakshatra change times', hi: 'तिथि/नक्षत्र परिवर्तन समय', sa: 'तिथि/नक्षत्रपरिवर्तनसमयः' } },
];

export default function LearnCalculationsPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Ganita" devanagari="गणित" transliteration="Gaṇita" meaning="Calculation / Mathematics" />
        <SanskritTermCard term="Siddhanta" devanagari="सिद्धान्त" transliteration="Siddhānta" meaning="Established conclusion / Treatise" />
        <SanskritTermCard term="Khagola" devanagari="खगोल" transliteration="Khagola" meaning="Celestial sphere" />
        <SanskritTermCard term="Spashta" devanagari="स्पष्ट" transliteration="Spaṣṭa" meaning="True / Corrected (position)" />
      </div>

      <LessonSection number={1} title={t('jdTitle')}>
        <p>{t('jdContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Julian Day Conversion (Meeus formula):', hi: 'जूलियन दिन रूपान्तरण:', sa: 'जूलियन दिन रूपान्तरण:', ta: 'Julian Day Conversion (Meeus formula):', te: 'Julian Day Conversion (Meeus formula):', bn: 'Julian Day Conversion (Meeus formula):', kn: 'Julian Day Conversion (Meeus formula):', gu: 'Julian Day Conversion (Meeus formula):', mai: 'जूलियन दिन रूपान्तरण:', mr: 'जूलियन दिन रूपान्तरण:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">A = floor(Y / 100)</p>
          <p className="text-gold-light/80 font-mono text-xs">B = 2 - A + floor(A / 4)</p>
          <p className="text-gold-light/80 font-mono text-xs">JD = floor(365.25 × (Y + 4716)) + floor(30.6001 × (M + 1)) + D + H/24 + B - 1524.5</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {tl({ en: 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0', hi: 'फिर: T = (JD - 2451545.0) / 36525.0  → J2000.0 से शताब्दियाँ', sa: 'फिर: T = (JD - 2451545.0) / 36525.0  → J2000.0 से शताब्दियाँ', ta: 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0', te: 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0', bn: 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0', kn: 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0', gu: 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0', mai: 'फिर: T = (JD - 2451545.0) / 36525.0  → J2000.0 से शताब्दियाँ', mr: 'फिर: T = (JD - 2451545.0) / 36525.0  → J2000.0 से शताब्दियाँ' }, locale)}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={2} title={t('sunTitle')}>
        <p>{t('sunContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Our Sun algorithm (Meeus Ch. 25):', hi: 'हमारा सूर्य एल्गोरिथ्म:', sa: 'हमारा सूर्य एल्गोरिथ्म:', ta: 'Our Sun algorithm (Meeus Ch. 25):', te: 'Our Sun algorithm (Meeus Ch. 25):', bn: 'Our Sun algorithm (Meeus Ch. 25):', kn: 'Our Sun algorithm (Meeus Ch. 25):', gu: 'Our Sun algorithm (Meeus Ch. 25):', mai: 'हमारा सूर्य एल्गोरिथ्म:', mr: 'हमारा सूर्य एल्गोरिथ्म:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">L0 = 280.46646 + 36000.76983 × T    <span className="text-gold-light/40">// mean longitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M  = 357.52911 + 35999.05029 × T    <span className="text-gold-light/40">// mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">C  = 1.9146 × sin(M) + 0.02 × sin(2M)  <span className="text-gold-light/40">// equation of center</span></p>
          <p className="text-gold-light/80 font-mono text-xs">Sun_true = L0 + C</p>
          <p className="text-gold-light/80 font-mono text-xs">Sun_apparent = Sun_true - 0.00569 - 0.00478 × sin(Ω)  <span className="text-gold-light/40">// nutation</span></p>
        </div>
      </LessonSection>

      <LessonSection number={3} title={t('moonTitle')}>
        <p>{t('moonContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Moon longitude — 60-term algorithm:', hi: 'चन्द्र देशान्तर — 60-पद एल्गोरिथ्म:', sa: 'चन्द्र देशान्तर — 60-पद एल्गोरिथ्म:', ta: 'Moon longitude — 60-term algorithm:', te: 'Moon longitude — 60-term algorithm:', bn: 'Moon longitude — 60-term algorithm:', kn: 'Moon longitude — 60-term algorithm:', gu: 'Moon longitude — 60-term algorithm:', mai: 'चन्द्र देशान्तर — 60-पद एल्गोरिथ्म:', mr: 'चन्द्र देशान्तर — 60-पद एल्गोरिथ्म:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">L&apos; = 218.316 + 481267.881 × T  <span className="text-gold-light/40">// Moon mean longitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs">D  = 297.850 + 445267.111 × T  <span className="text-gold-light/40">// mean elongation</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M  = 357.529 + 35999.050 × T   <span className="text-gold-light/40">// Sun mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M&apos; = 134.963 + 477198.868 × T  <span className="text-gold-light/40">// Moon mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">F  = 93.272 + 483202.018 × T   <span className="text-gold-light/40">// argument of latitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">Σl = Σ [coeff × sin(D×d + M×m + M&apos;×m&apos; + F×f)] × E^|m|</p>
          <p className="text-gold-light/80 font-mono text-xs">Moon_long = L&apos; + Σl/1000000 + A1 + A2 + A3 corrections</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Top 4 terms: 6.289° sin(M\'), 1.274° sin(2D-M\'), 0.658° sin(2D), 0.214° sin(2M\')'
              : 'शीर्ष 4 पद: 6.289° sin(M\'), 1.274° sin(2D-M\'), 0.658° sin(2D), 0.214° sin(2M\')'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {locale === 'en'
              ? 'E = eccentricity correction: 1 - 0.002516×T (applied when M appears in term)'
              : 'E = उत्केन्द्रता सुधार: 1 - 0.002516×T'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={4} title={t('ayanamshaTitle')}>
        <p>{t('ayanamshaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Lahiri Ayanamsha polynomial:', hi: 'लहिरी अयनांश बहुपद:', sa: 'लहिरी अयनांश बहुपद:', ta: 'Lahiri Ayanamsha polynomial:', te: 'Lahiri Ayanamsha polynomial:', bn: 'Lahiri Ayanamsha polynomial:', kn: 'Lahiri Ayanamsha polynomial:', gu: 'Lahiri Ayanamsha polynomial:', mai: 'लहिरी अयनांश बहुपद:', mr: 'लहिरी अयनांश बहुपद:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">Ayanamsha = 23.85306° + 1.39722° × T + 0.00018° × T²</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {tl({ en: 'where T = centuries from J2000.0', hi: 'जहाँ T = J2000.0 से शताब्दियाँ', sa: 'जहाँ T = J2000.0 से शताब्दियाँ', ta: 'where T = centuries from J2000.0', te: 'where T = centuries from J2000.0', bn: 'where T = centuries from J2000.0', kn: 'where T = centuries from J2000.0', gu: 'where T = centuries from J2000.0', mai: 'जहाँ T = J2000.0 से शताब्दियाँ', mr: 'जहाँ T = J2000.0 से शताब्दियाँ' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">Sidereal_longitude = Tropical_longitude - Ayanamsha</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'For 2026: Ayanamsha ≈ 24.22° → a planet at 50° tropical is at ~25.78° sidereal'
              : '2026 के लिए: अयनांश ≈ 24.22° → 50° उष्णकटिबन्धीय पर ग्रह ~25.78° नाक्षत्रिक पर है'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={5} title={t('tithiCalcTitle')}>
        <p>{t('tithiCalcContent')}</p>
        <div className="mt-4 space-y-2">
          {[
            { name: 'Tithi', formula: 'floor((Moon_sid - Sun_sid) / 12°) + 1', range: '1-30', note: 'Moon gains ~12° on Sun per day' },
            { name: 'Nakshatra', formula: 'floor(Moon_sid / 13°20\') + 1', range: '1-27', note: 'Moon\'s position in 27 star divisions' },
            { name: 'Yoga', formula: 'floor((Sun_sid + Moon_sid) / 13°20\') + 1', range: '1-27', note: 'Sum of Sun and Moon longitudes' },
            { name: 'Karana', formula: 'floor((Moon_sid - Sun_sid) / 6°)', range: '1-60', note: 'Half of a Tithi — 60 in a lunar month' },
            { name: 'Vara', formula: 'floor(JD + 1.5) mod 7', range: '0-6', note: 'Weekday from Julian Day Number' },
          ].map((calc, i) => (
            <motion.div
              key={calc.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-gold-primary font-semibold text-sm w-20">{calc.name}</span>
                <span className="text-gold-light/80 font-mono text-xs flex-1">{calc.formula}</span>
              </div>
              <p className="text-text-secondary/75 text-xs mt-1 ml-20">{!isDevanagariLocale(locale) ? calc.note : calc.note}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <LessonSection number={6} title={t('transitionTitle')}>
        <p>{t('transitionContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Binary Search Algorithm:', hi: 'बाइनरी खोज एल्गोरिथ्म:', sa: 'बाइनरी खोज एल्गोरिथ्म:', ta: 'Binary Search Algorithm:', te: 'Binary Search Algorithm:', bn: 'Binary Search Algorithm:', kn: 'Binary Search Algorithm:', gu: 'Binary Search Algorithm:', mai: 'बाइनरी खोज एल्गोरिथ्म:', mr: 'बाइनरी खोज एल्गोरिथ्म:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">jd_low = sunrise_JD</p>
          <p className="text-gold-light/80 font-mono text-xs">jd_high = sunrise_JD + 1.5  <span className="text-gold-light/40">// 36 hours window</span></p>
          <p className="text-gold-light/80 font-mono text-xs">while (jd_high - jd_low &gt; 0.0001):  <span className="text-gold-light/40">// ~8.6 sec precision</span></p>
          <p className="text-gold-light/80 font-mono text-xs">  mid = (jd_low + jd_high) / 2</p>
          <p className="text-gold-light/80 font-mono text-xs">  if tithi(mid) == current_tithi:</p>
          <p className="text-gold-light/80 font-mono text-xs">    jd_low = mid   <span className="text-gold-light/40">// transition is after mid</span></p>
          <p className="text-gold-light/80 font-mono text-xs">  else:</p>
          <p className="text-gold-light/80 font-mono text-xs">    jd_high = mid  <span className="text-gold-light/40">// transition is before mid</span></p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {tl({ en: 'Converges in ~20 iterations → ~40 function evaluations per element', hi: '~20 पुनरावृत्तियों में अभिसरित → प्रति तत्व ~40 फ़ंक्शन मूल्यांकन', sa: '~20 पुनरावृत्तियों में अभिसरित → प्रति तत्व ~40 फ़ंक्शन मूल्यांकन', ta: 'Converges in ~20 iterations → ~40 function evaluations per element', te: 'Converges in ~20 iterations → ~40 function evaluations per element', bn: 'Converges in ~20 iterations → ~40 function evaluations per element', kn: 'Converges in ~20 iterations → ~40 function evaluations per element', gu: 'Converges in ~20 iterations → ~40 function evaluations per element', mai: '~20 पुनरावृत्तियों में अभिसरित → प्रति तत्व ~40 फ़ंक्शन मूल्यांकन', mr: '~20 पुनरावृत्तियों में अभिसरित → प्रति तत्व ~40 फ़ंक्शन मूल्यांकन' }, locale)}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={7} title={t('sunriseTitle')}>
        <p>{t('sunriseContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Sunrise calculation:', hi: 'सूर्योदय गणना:', sa: 'सूर्योदय गणना:', ta: 'Sunrise calculation:', te: 'Sunrise calculation:', bn: 'Sunrise calculation:', kn: 'Sunrise calculation:', gu: 'Sunrise calculation:', mai: 'सूर्योदय गणना:', mr: 'सूर्योदय गणना:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">decl = asin(sin(23.44°) × sin(Sun_long))</p>
          <p className="text-gold-light/80 font-mono text-xs">cos(H) = (sin(-0.833°) - sin(lat) × sin(decl)) / (cos(lat) × cos(decl))</p>
          <p className="text-gold-light/80 font-mono text-xs">sunrise_UT = 12h - H/15 - longitude/15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? '-0.833° accounts for atmospheric refraction + solar disc semidiameter'
              : '-0.833° वायुमण्डलीय अपवर्तन + सौर तश्तरी अर्धव्यास का हिसाब'}
          </p>
        </div>
      </LessonSection>

      <LessonSection title={t('accuracyTitle')} variant="highlight">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold">{tl({ en: 'Calculation', hi: 'गणना', sa: 'गणना', ta: 'Calculation', te: 'Calculation', bn: 'Calculation', kn: 'Calculation', gu: 'Calculation', mai: 'गणना', mr: 'गणना' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold">{tl({ en: 'Accuracy', hi: 'सटीकता', sa: 'सूक्ष्मता', ta: 'துல்லியம்', te: 'ఖచ్చితత్వం', bn: 'নির্ভুলতা', kn: 'ನಿಖರತೆ', gu: 'ચોકસાઈ', mai: 'सटीकता', mr: 'अचूकता' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold">{tl({ en: 'Practical Impact', hi: 'व्यावहारिक प्रभाव', sa: 'व्यावहारिक प्रभाव', ta: 'Practical Impact', te: 'Practical Impact', bn: 'Practical Impact', kn: 'Practical Impact', gu: 'Practical Impact', mai: 'व्यावहारिक प्रभाव', mr: 'व्यावहारिक प्रभाव' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {ACCURACY_TABLE.map((row) => (
                <tr key={row.item.en} className="border-b border-gold-primary/5">
                  <td className="py-2 text-gold-light text-xs">{lt(row.item as LocaleText, locale)}</td>
                  <td className="py-2 text-gold-light/80 font-mono text-xs">{row.accuracy}</td>
                  <td className="py-2 text-text-secondary text-xs">{lt(row.impact as LocaleText, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-text-secondary/70 text-xs italic">
          {locale === 'en'
            ? 'Our engine uses pure JavaScript — no external ephemeris libraries or API calls. All 60 Moon terms and accurate ayanamsha give results comparable to professional Panchang software.'
            : 'हमारा इंजन शुद्ध JavaScript का उपयोग करता है — कोई बाहरी पञ्चाङ्ग लाइब्रेरी या API कॉल नहीं। सभी 60 चन्द्र पद और सटीक अयनांश पेशेवर पञ्चाङ्ग सॉफ़्टवेयर के तुलनीय परिणाम देते हैं।'}
        </p>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

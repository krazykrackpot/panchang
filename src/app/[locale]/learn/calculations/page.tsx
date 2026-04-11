'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'How We Calculate — The Math Behind Jyotish', hi: 'हम कैसे गणना करते हैं — ज्योतिष के पीछे का गणित', sa: 'वयं कथं गणयामः — ज्योतिषस्य गणितम्' },
  subtitle: { en: 'A deep dive into the astronomical algorithms powering this Panchang', hi: 'इस पञ्चाङ्ग को संचालित करने वाले खगोलीय एल्गोरिथ्म पर गहन दृष्टि', sa: 'एतत् पञ्चाङ्गं संचालयतां खगोलीयगणितानां गहनदृष्टिः' },
  jdTitle: { en: 'Step 1: Julian Day Numbers', hi: 'चरण 1: जूलियन दिन संख्या', sa: 'सोपानम् 1: जूलियनदिनसंख्या' },
  jdContent: {
    en: 'All astronomical calculations start with converting a calendar date to a Julian Day Number (JD) — a continuous count of days since January 1, 4713 BCE. This eliminates the complexities of calendars (leap years, varying month lengths, calendar reforms). For example, January 1, 2000 at noon = JD 2451545.0 (called J2000.0, a standard reference epoch).',
    hi: 'सभी खगोलीय गणनाएँ कैलेंडर तिथि को जूलियन दिन संख्या (JD) में बदलने से शुरू होती हैं — 1 जनवरी 4713 ईसा पूर्व से दिनों की निरन्तर गिनती। उदाहरण: 1 जनवरी 2000 दोपहर = JD 2451545.0।',
    sa: 'सर्वाणि खगोलीयगणितानि दिनाङ्कं जूलियनदिनसंख्यायां परिवर्तनेन आरभ्यन्ते।'
  },
  sunTitle: { en: 'Step 2: Sun\'s Longitude', hi: 'चरण 2: सूर्य का देशान्तर', sa: 'सोपानम् 2: सूर्यस्य देशान्तरम्' },
  sunContent: {
    en: 'The Sun\'s apparent position along the ecliptic is calculated using Jean Meeus\'s algorithms (Chapter 25 of "Astronomical Algorithms"). We compute: (1) The Sun\'s mean longitude L0, (2) The mean anomaly M (how far the Sun is in its elliptical orbit from perihelion), (3) The equation of center C (correction for elliptical orbit), and (4) Nutation and aberration corrections. This gives accuracy to ~0.01° — sufficient for all Panchang purposes.',
    hi: 'ग्रहण-पथ पर सूर्य की दृश्य स्थिति की गणना Jean Meeus के एल्गोरिथ्म से की जाती है। हम गणना करते हैं: (1) सूर्य का माध्य देशान्तर L0, (2) माध्य विसंगति M, (3) केन्द्रीय समीकरण C, और (4) अयन और विपथन सुधार।',
    sa: 'ग्रहणपथे सूर्यस्य दृश्यस्थानस्य गणना Meeus गणितैः क्रियते।'
  },
  moonTitle: { en: 'Step 3: Moon\'s Longitude (Meeus Chapter 47)', hi: 'चरण 3: चन्द्र का देशान्तर (Meeus अध्याय 47)', sa: 'सोपानम् 3: चन्द्रस्य देशान्तरम्' },
  moonContent: {
    en: 'The Moon is the most complex body to calculate because of strong gravitational perturbations from the Sun and Earth. We use the full Meeus Chapter 47 algorithm with 60 periodic terms. The five fundamental arguments are: Lp (Moon\'s mean longitude), D (mean elongation), M (Sun\'s mean anomaly), Mp (Moon\'s mean anomaly), and F (Moon\'s argument of latitude). Each term involves multiplying these arguments, taking the sine, and applying an eccentricity correction for terms involving the Sun.',
    hi: 'चन्द्रमा गणना करने में सबसे जटिल पिण्ड है क्योंकि सूर्य और पृथ्वी से मज़बूत गुरुत्वाकर्षण विक्षोभ होते हैं। हम पूर्ण Meeus अध्याय 47 एल्गोरिथ्म का उपयोग करते हैं जिसमें 60 आवर्ती पद हैं।',
    sa: 'चन्द्रमा गणनायां सर्वाधिकजटिलः पिण्डः — सूर्यपृथिव्योः प्रबलगुरुत्वाकर्षणविक्षोभात्।'
  },
  ayanamshaTitle: { en: 'Step 4: Ayanamsha — Tropical to Sidereal', hi: 'चरण 4: अयनांश — उष्णकटिबन्धीय से नाक्षत्रिक', sa: 'सोपानम् 4: अयनांशः' },
  ayanamshaContent: {
    en: 'Meeus algorithms give tropical (Western) longitudes. Vedic astrology uses sidereal (star-fixed) longitudes. The difference is the Ayanamsha — currently about 24°. We use the Lahiri (Chitrapaksha) Ayanamsha, which defines 0° sidereal Libra as the position of the star Spica. The Ayanamsha increases by about 50 arcseconds per year due to the precession of the equinoxes (Earth\'s axis wobble with a ~26,000 year cycle).',
    hi: 'Meeus एल्गोरिथ्म उष्णकटिबन्धीय (पश्चिमी) देशान्तर देते हैं। वैदिक ज्योतिष नाक्षत्रिक (तारा-स्थिर) देशान्तर का उपयोग करता है। अन्तर अयनांश है — वर्तमान में लगभग 24°।',
    sa: 'Meeus गणितानि उष्णकटिबन्धीयदेशान्तरं ददति। वैदिकज्योतिषं नाक्षत्रिकदेशान्तरं प्रयुङ्क्ते। भेदः अयनांशः।'
  },
  tithiCalcTitle: { en: 'Step 5: Tithi, Nakshatra, Yoga, Karana', hi: 'चरण 5: तिथि, नक्षत्र, योग, करण', sa: 'सोपानम् 5: तिथिः, नक्षत्रं, योगः, करणम्' },
  tithiCalcContent: {
    en: 'With accurate Sun and Moon sidereal longitudes, all five Panchang elements are straightforward arithmetic:',
    hi: 'सटीक सूर्य और चन्द्र नाक्षत्रिक देशान्तर के साथ, सभी पाँच पञ्चाङ्ग तत्व सीधी अंकगणित हैं:',
    sa: 'सूक्ष्मसूर्यचन्द्रनाक्षत्रिकदेशान्तराभ्यां, सर्वाणि पञ्चाङ्गतत्त्वानि सरलगणितानि:'
  },
  transitionTitle: { en: 'Step 6: Finding Transition Times', hi: 'चरण 6: परिवर्तन समय ज्ञात करना', sa: 'सोपानम् 6: परिवर्तनसमयस्य ज्ञानम्' },
  transitionContent: {
    en: 'The trickiest part: finding exactly WHEN a tithi or nakshatra changes. We use a binary search algorithm — starting with a wide time window (24 hours), we repeatedly check the midpoint and narrow down to the exact moment the value changes. This converges to within ~10 seconds accuracy in about 20 iterations.',
    hi: 'सबसे कठिन भाग: ठीक कब तिथि या नक्षत्र बदलता है यह ज्ञात करना। हम बाइनरी खोज एल्गोरिथ्म का उपयोग करते हैं — 24 घण्टे की विस्तृत समय सीमा से शुरू करके, हम बार-बार मध्यबिन्दु की जाँच करते हैं।',
    sa: 'सर्वाधिककठिनं — कदा तिथिः नक्षत्रं वा परिवर्तते इति ज्ञातुम्। वयं द्विभाजनखोजगणितं प्रयुञ्ज्मः।'
  },
  sunriseTitle: { en: 'Step 7: Sunrise & Sunset', hi: 'चरण 7: सूर्योदय और सूर्यास्त', sa: 'सोपानम् 7: सूर्योदयः सूर्यास्तः च' },
  sunriseContent: {
    en: 'Sunrise and sunset are calculated from the Sun\'s declination and the observer\'s geographic latitude. The Sun\'s declination (how far north/south of the equator) is derived from its ecliptic longitude and the obliquity of the ecliptic (~23.44°). The hour angle at sunrise/sunset accounts for atmospheric refraction (-0.833°), making the Sun visible slightly before/after it geometrically crosses the horizon.',
    hi: 'सूर्योदय और सूर्यास्त की गणना सूर्य के क्रान्ति और पर्यवेक्षक के भौगोलिक अक्षांश से की जाती है। सूर्य की क्रान्ति उसके ग्रहण-पथ देशान्तर और ग्रहण-पथ तिर्यकता (~23.44°) से निकाली जाती है।',
    sa: 'सूर्योदयसूर्यास्तयोः गणना सूर्यक्रान्तेः पर्यवेक्षकस्य अक्षांशात् च क्रियते।'
  },
  accuracyTitle: { en: 'Accuracy Comparison', hi: 'सटीकता तुलना', sa: 'सूक्ष्मतातुलना' },
  tryIt: { en: 'See These Calculations in Action →', hi: 'इन गणनाओं को क्रियाशील देखें →', sa: 'एतानि गणितानि क्रियाशीलानि पश्यतु →' },
};

const ACCURACY_TABLE = [
  { item: { en: 'Sun longitude', hi: 'सूर्य देशान्तर', sa: 'सूर्यदेशान्तरम्' }, accuracy: '~0.01° (36 arcsec)', impact: { en: '~30 sec timing error', hi: '~30 सेकंड समय त्रुटि', sa: '~30 क्षणत्रुटिः' } },
  { item: { en: 'Moon longitude', hi: 'चन्द्र देशान्तर', sa: 'चन्द्रदेशान्तरम्' }, accuracy: '~0.003° (10 arcsec)', impact: { en: '~1-2 min tithi error', hi: '~1-2 मिनट तिथि त्रुटि', sa: '~1-2 निमेषतिथित्रुटिः' } },
  { item: { en: 'Lahiri Ayanamsha', hi: 'लहिरी अयनांश', sa: 'लहिरीअयनांशः' }, accuracy: '~1 arcsecond', impact: { en: 'Negligible', hi: 'नगण्य', sa: 'नगण्यम्' } },
  { item: { en: 'Sunrise/Sunset', hi: 'सूर्योदय/सूर्यास्त', sa: 'सूर्योदयः/सूर्यास्तः' }, accuracy: '~1-2 minutes', impact: { en: 'Affects Muhurta boundaries', hi: 'मुहूर्त सीमाओं को प्रभावित', sa: 'मुहूर्तसीमाः प्रभावयति' } },
  { item: { en: 'Transition times', hi: 'परिवर्तन समय', sa: 'परिवर्तनसमयः' }, accuracy: '~1-3 minutes', impact: { en: 'Tithi/Nakshatra change times', hi: 'तिथि/नक्षत्र परिवर्तन समय', sa: 'तिथि/नक्षत्रपरिवर्तनसमयः' } },
];

export default function LearnCalculationsPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Ganita" devanagari="गणित" transliteration="Gaṇita" meaning="Calculation / Mathematics" />
        <SanskritTermCard term="Siddhanta" devanagari="सिद्धान्त" transliteration="Siddhānta" meaning="Established conclusion / Treatise" />
        <SanskritTermCard term="Khagola" devanagari="खगोल" transliteration="Khagola" meaning="Celestial sphere" />
        <SanskritTermCard term="Spashta" devanagari="स्पष्ट" transliteration="Spaṣṭa" meaning="True / Corrected (position)" />
      </div>

      <LessonSection number={1} title={L.jdTitle[locale]}>
        <p>{L.jdContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Julian Day Conversion (Meeus formula):' : 'जूलियन दिन रूपान्तरण:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">A = floor(Y / 100)</p>
          <p className="text-gold-light/80 font-mono text-xs">B = 2 - A + floor(A / 4)</p>
          <p className="text-gold-light/80 font-mono text-xs">JD = floor(365.25 × (Y + 4716)) + floor(30.6001 × (M + 1)) + D + H/24 + B - 1524.5</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Then: T = (JD - 2451545.0) / 36525.0  → centuries from J2000.0' : 'फिर: T = (JD - 2451545.0) / 36525.0  → J2000.0 से शताब्दियाँ'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={2} title={L.sunTitle[locale]}>
        <p>{L.sunContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Our Sun algorithm (Meeus Ch. 25):' : 'हमारा सूर्य एल्गोरिथ्म:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">L0 = 280.46646 + 36000.76983 × T    <span className="text-gold-light/40">// mean longitude</span></p>
          <p className="text-gold-light/80 font-mono text-xs">M  = 357.52911 + 35999.05029 × T    <span className="text-gold-light/40">// mean anomaly</span></p>
          <p className="text-gold-light/80 font-mono text-xs">C  = 1.9146 × sin(M) + 0.02 × sin(2M)  <span className="text-gold-light/40">// equation of center</span></p>
          <p className="text-gold-light/80 font-mono text-xs">Sun_true = L0 + C</p>
          <p className="text-gold-light/80 font-mono text-xs">Sun_apparent = Sun_true - 0.00569 - 0.00478 × sin(Ω)  <span className="text-gold-light/40">// nutation</span></p>
        </div>
      </LessonSection>

      <LessonSection number={3} title={L.moonTitle[locale]}>
        <p>{L.moonContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Moon longitude — 60-term algorithm:' : 'चन्द्र देशान्तर — 60-पद एल्गोरिथ्म:'}
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

      <LessonSection number={4} title={L.ayanamshaTitle[locale]}>
        <p>{L.ayanamshaContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Lahiri Ayanamsha polynomial:' : 'लहिरी अयनांश बहुपद:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">Ayanamsha = 23.85306° + 1.39722° × T + 0.00018° × T²</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en' || String(locale) === 'ta' ? 'where T = centuries from J2000.0' : 'जहाँ T = J2000.0 से शताब्दियाँ'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">Sidereal_longitude = Tropical_longitude - Ayanamsha</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'For 2026: Ayanamsha ≈ 24.22° → a planet at 50° tropical is at ~25.78° sidereal'
              : '2026 के लिए: अयनांश ≈ 24.22° → 50° उष्णकटिबन्धीय पर ग्रह ~25.78° नाक्षत्रिक पर है'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={5} title={L.tithiCalcTitle[locale]}>
        <p>{L.tithiCalcContent[locale]}</p>
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
              <p className="text-text-secondary/75 text-xs mt-1 ml-20">{locale === 'en' || String(locale) === 'ta' ? calc.note : calc.note}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <LessonSection number={6} title={L.transitionTitle[locale]}>
        <p>{L.transitionContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Binary Search Algorithm:' : 'बाइनरी खोज एल्गोरिथ्म:'}
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
            {locale === 'en' || String(locale) === 'ta' ? 'Converges in ~20 iterations → ~40 function evaluations per element' : '~20 पुनरावृत्तियों में अभिसरित → प्रति तत्व ~40 फ़ंक्शन मूल्यांकन'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={7} title={L.sunriseTitle[locale]}>
        <p>{L.sunriseContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Sunrise calculation:' : 'सूर्योदय गणना:'}
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

      <LessonSection title={L.accuracyTitle[locale]} variant="highlight">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold">{locale === 'en' || String(locale) === 'ta' ? 'Calculation' : 'गणना'}</th>
                <th className="text-left py-2 text-gold-primary font-semibold">{locale === 'en' || String(locale) === 'ta' ? 'Accuracy' : 'सटीकता'}</th>
                <th className="text-left py-2 text-gold-primary font-semibold">{locale === 'en' || String(locale) === 'ta' ? 'Practical Impact' : 'व्यावहारिक प्रभाव'}</th>
              </tr>
            </thead>
            <tbody>
              {ACCURACY_TABLE.map((row) => (
                <tr key={row.item.en} className="border-b border-gold-primary/5">
                  <td className="py-2 text-gold-light text-xs">{row.item[locale]}</td>
                  <td className="py-2 text-gold-light/80 font-mono text-xs">{row.accuracy}</td>
                  <td className="py-2 text-text-secondary text-xs">{row.impact[locale]}</td>
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
          {L.tryIt[locale]}
        </Link>
      </div>
    </div>
  );
}

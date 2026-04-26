'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_22_1', phase: 9, topic: 'Astronomy', moduleNumber: '22.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Julian Day Number is a continuous count of days since January 1, 4713 BCE — it eliminates the confusion of different calendar systems.',
          'Every astronomical calculation in this app starts by converting the date to JD — it is the universal time coordinate for all computations.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why Astronomers Need a Continuous Day Count', hi: 'खगोलविदों को निरन्तर दिन-गणना क्यों चाहिए', sa: 'खगोलविदों को निरन्तर दिन-गणना क्यों चाहिए' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कल्पना करें कि 15 मार्च, 44 ई.पू. (सीज़र की हत्या) और 2 अप्रैल, 2026 के बीच कितने दिन बीते, इसकी गणना करनी है। आपको जूलियन-से-ग्रेगोरियन कैलेण्डर संक्रमण (अक्टूबर 1582), विभिन्न मास-लम्बाइयों (28, 29, 30 या 31 दिन), जूलियन कैलेण्डर में प्रत्येक 4 वर्ष अधिवर्ष किन्तु ग्रेगोरियन में शताब्दी-छोड़ नियमों, और ईस्वी में शून्य वर्ष की अनुपस्थिति से जूझना होगा। इस प्रकार की तिथि गणित एक-अन्तर त्रुटियों का जाल है। खगोलविदों ने शताब्दियों पहले एक सरल, सुन्दर उपकरण से इसे हल किया: जूलियन दिवस संख्या।</> : <>Imagine computing how many days elapsed between March 15, 44 BCE (assassination of Caesar) and April 2, 2026. You would need to navigate the Julian-to-Gregorian calendar transition (October 1582), account for varying month lengths (28, 29, 30, or 31 days), leap years every 4 years in the Julian calendar but with century-skip rules in the Gregorian calendar, and the absence of a year zero in the common era. This kind of date arithmetic is a minefield of off-by-one errors. Astronomers solved this problem centuries ago with a single, elegant tool: the Julian Day number.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जूलियन दिवस (JD) एक निश्चित प्रारम्भ बिन्दु से दिनों की निरन्तर गणना है: 1 जनवरी, 4713 ई.पू., मध्याह्न यूनिवर्सल टाइम। कोई महीने नहीं, कोई वर्ष नहीं, कोई अधिवर्ष दिन की जटिलता नहीं — बस एक सतत बढ़ती संख्या। JD 0 = 1 जनवरी, 4713 ई.पू., मध्याह्न UT। JD 2,451,545.0 = 1 जनवरी, 2000, मध्याह्न UT — यह प्रसिद्ध J2000.0 युगारम्भ है जिसे आधुनिक खगोलशास्त्र मानक सन्दर्भ के रूप में उपयोग करता है। विद्यमान प्रत्येक खगोलीय गणना — नासा की कक्षा भविष्यवाणियों से लेकर हमारे पंचांग ऐप तक — एक कैलेण्डर तिथि को जूलियन दिवस संख्या में बदलने से आरम्भ होती है।</> : <>The Julian Day (JD) is a continuous count of days since a fixed starting point: January 1, 4713 BCE, at noon Universal Time. There are no months, no years, no leap day complications — just a single, ever-increasing number. JD 0 = January 1, 4713 BCE, noon UT. JD 2,451,545.0 = January 1, 2000, noon UT — this is the famous J2000.0 epoch that modern astronomy uses as its standard reference. Every astronomical calculation in existence — from NASA orbit predictions to our humble Panchang app — begins by converting a calendar date into a Julian Day number.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why 4713 BCE?', hi: '4713 ई.पू. क्यों?', sa: '4713 ई.पू. क्यों?' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>जोसेफ स्कैलिजर ने 1583 में यह तिथि इसलिए चुनी क्योंकि यह एक संयुक्त महाचक्र का आरम्भ है: 28-वर्षीय सौर चक्र (जूलियन कैलेण्डर का सप्ताह-दिन दोहराव), 19-वर्षीय मेटोनिक चक्र (चन्द्र कलाएँ उन्हीं कैलेण्डर तिथियों पर दोहराती हैं), और 15-वर्षीय रोमन इंडिक्शन (कर चक्र)। गुणनफल 28 × 19 × 15 = 7980 वर्ष। 1 ई. से पीछे गणना करने पर आरम्भ 4713 ई.पू. आता है। इससे प्रत्येक ऐतिहासिक तिथि का JD धनात्मक रहता है — ऋणात्मक दिन संख्या की आवश्यकता नहीं।</> : <>Joseph Scaliger chose this date in 1583 because it is the start of a combined super-cycle: the 28-year solar cycle (Julian calendar day-of-week repeats), the 19-year Metonic cycle (Moon phases repeat on the same calendar dates), and the 15-year Roman indiction (tax cycle). The product 28 x 19 x 15 = 7980 years. Counting backward from 1 CE places the start at 4713 BCE. This guarantees that every historical date has a positive JD — no negative day numbers needed.</>}</p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Algorithm Step by Step', hi: 'एल्गोरिदम चरणबद्ध', sa: 'एल्गोरिदम चरणबद्ध' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रेगोरियन तिथि को जूलियन दिवस संख्या में बदलना एक सटीक क्रम का पालन करता है। वर्ष Y, मास M, दिन D, और घण्टा H (UT में) वाली तिथि के लिए: चरण 1 — यदि M = 1 (जनवरी) या 2 (फरवरी) हो तो Y को Y-1 और M को M+12 से बदलें। यह जनवरी और फरवरी को पिछले वर्ष के महीने 13 और 14 मानता है — रोमन कैलेण्डर से विरासत में मिली परम्परा जहाँ मार्च प्रथम महीना था। यह सरलीकरण मास-लम्बाई अनुमान को फरवरी का विशेष प्रबन्ध किए बिना कार्य करने देता है।</> : <>Converting a Gregorian date to a Julian Day number follows a precise sequence. Given a date with year Y, month M, day D, and hour H (in UT): Step 1 — If M is 1 (January) or 2 (February), replace Y with Y-1 and M with M+12. This treats January and February as months 13 and 14 of the preceding year, a convention inherited from the Roman calendar where March was the first month. This simplification allows the month-length approximation to work without special-casing February.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चरण 2 — ग्रेगोरियन सुधार गणित करें: A = floor(Y / 100), B = 2 - A + floor(A / 4)। A पूर्ण शताब्दियों की गणना करता है। सुधार B ग्रेगोरियन सुधार में हटाए गए अधिवर्ष दिनों का लेखा-जोखा है: जूलियन कैलेण्डर प्रत्येक 4 वर्ष अधिवर्ष दिन जोड़ता है, किन्तु ग्रेगोरियन कैलेण्डर 400 से अविभाज्य शताब्दी वर्षों पर इसे छोड़ता है (जैसे 1700, 1800, 1900 अधिवर्ष नहीं थे, किन्तु 2000 था)। 15 अक्टूबर, 1582 (जूलियन कैलेण्डर) से पहले की तिथियों के लिए B = 0।</> : <>Step 2 — Compute the Gregorian correction: A = floor(Y / 100), B = 2 - A + floor(A / 4). The term A counts completed centuries. The correction B accounts for the leap days dropped in the Gregorian reform: the Julian calendar adds a leap day every 4 years, but the Gregorian calendar skips it on century years not divisible by 400 (e.g., 1700, 1800, 1900 were not leap years, but 2000 was). For dates before October 15, 1582 (Julian calendar), B = 0.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Complete Formula', hi: 'सम्पूर्ण सूत्र', sa: 'सम्पूर्ण सूत्र' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 3:</span> JD = floor(365.25 x (Y + 4716)) + floor(30.6001 x (M + 1)) + D + H/24 + B - 1524.5
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>floor(365.25 × (Y+4716)) पद युगारम्भ से अधिवर्ष-सचेत वर्षों के दिनों की गणना करता है। floor(30.6001 × (M+1)) पद बीते महीनों के संचयी दिनों का अनुमान लगाता है। 0.6001 (0.6 नहीं) फ़्लोटिंग-पॉइंट पूर्णांकन त्रुटियों से बचाता है। D + H/24 आंशिक दिन जोड़ता है। B ग्रेगोरियन सुधार है। स्थिरांक -1524.5 परिणाम को JD युगारम्भ से संरेखित करता है।</> : <>The term floor(365.25 x (Y+4716)) counts the days from leap-year-aware years since the epoch. The term floor(30.6001 x (M+1)) approximates the cumulative days of months elapsed. The 0.6001 (not 0.6) avoids floating-point rounding errors. D + H/24 adds the fractional day. B is the Gregorian correction. The constant -1524.5 aligns the result to the JD epoch.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">2 अप्रैल, 2026, 12:00 UT:</span> Y = 2026, M = 4, D = 2, H = 12। M &gt; 2 होने से कोई समायोजन नहीं। A = floor(2026/100) = 20। B = 2 - 20 + floor(20/4) = 2 - 20 + 5 = -13। JD = floor(365.25 × 6742) + floor(30.6001 × 5) + 2 + 0.5 + (-13) - 1524.5 = 2,462,979.5 + 153 + 2 + 0.5 - 13 - 1524.5 = 2,461,132.0।</> : <><span className="text-gold-light font-medium">April 2, 2026, 12:00 UT:</span> Y = 2026, M = 4, D = 2, H = 12. Since M &gt; 2, no adjustment needed. A = floor(2026/100) = 20. B = 2 - 20 + floor(20/4) = 2 - 20 + 5 = -13. JD = floor(365.25 x 6742) + floor(30.6001 x 5) + 2 + 0.5 + (-13) - 1524.5 = 2,462,979.5 + 153 + 2 + 0.5 - 13 - 1524.5 = 2,461,132.0.</>}</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Julian Centuries and the T Variable', hi: 'जूलियन शताब्दियाँ और T चर', sa: 'जूलियन शताब्दियाँ और T चर' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जूलियन दिवस संख्या प्राप्त होने पर प्रत्येक खगोलीय सूत्र का अगला चरण इसे J2000.0 युगारम्भ से जूलियन शताब्दियों (T) में बदलना है: T = (JD - 2451545.0) / 36525। हर 36525 बस 100 वर्ष गुणा 365.25 दिन प्रति जूलियन वर्ष है। यह T मान वह सार्वभौमिक समय चर है जो जीन मीयस की &quot;खगोलीय एल्गोरिदम&quot; में सभी स्थिति-खगोलविज्ञान सूत्रों को चलाता है। सूर्य भोगांश, चन्द्र अक्षांश, पृथ्वी की क्रान्तिवृत्त तिर्यकता, अयन-चलन और पुरस्सरण की प्रत्येक बहुपद अभिव्यक्ति T में घात श्रेणी के रूप में व्यक्त होती है।</> : <>Once we have a Julian Day number, the next step in every astronomical formula is converting it to Julian Centuries (T) from the J2000.0 epoch: T = (JD - 2451545.0) / 36525. The denominator 36525 is simply 100 years multiplied by 365.25 days per Julian year. This T value is the universal time variable that drives ALL positional astronomy formulas in Jean Meeus&apos;s &quot;Astronomical Algorithms.&quot; Every polynomial expression for the Sun&apos;s longitude, the Moon&apos;s latitude, Earth&apos;s obliquity, nutation, and precession is expressed as a power series in T.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>J2000.0 क्यों? यह युगारम्भ अन्तर्राष्ट्रीय खगोलीय संघ (IAU) ने अपनाया क्योंकि यह आधुनिक युग में आता है जब तारा-स्थान अत्यन्त सटीकता से ज्ञात हैं (हिपार्कोस उपग्रह सूची के कारण), पृथ्वी अभिविन्यास प्राचल सटीक रूप से मापे गए हैं, और यह एक स्पष्ट गोल संख्या है जो समकालीन तिथियों के लिए T में पूर्णांकन न्यूनतम करती है। 2 अप्रैल, 2026 के लिए: T = (2461132.0 - 2451545.0) / 36525 = 9587.0 / 36525 = 0.26246, अर्थात हम J2000.0 से लगभग 0.262 जूलियन शताब्दी (26.2 वर्ष) आगे हैं।</> : <>Why J2000.0? This epoch was adopted by the International Astronomical Union (IAU) because it falls in the modern era when star positions are known with extreme precision (thanks to the Hipparcos satellite catalog), Earth orientation parameters are precisely measured, and it serves as a clean round number that minimizes rounding in T for contemporary dates. For April 2, 2026: T = (2461132.0 - 2451545.0) / 36525 = 9587.0 / 36525 = 0.26246, meaning we are about 0.262 Julian centuries (26.2 years) past J2000.0.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'How Our App Uses JD', hi: 'हमारा ऐप JD कैसे उपयोग करता है', sa: 'हमारा ऐप JD कैसे उपयोग करता है' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>हमारे कोडबेस में dateToJD() फ़ंक्शन सभी गणना का प्रवेशद्वार है। जब उपयोगकर्ता किसी तिथि का पंचांग देखता है, सबसे पहले होता है: JD = dateToJD(year, month, day, hour)। यह JD फिर sunLongitude(jd) और moonLongitude(jd) को दिया जाता है ताकि सूर्य और चन्द्रमा की सायन स्थितियाँ मिलें। अन्तर (चन्द्र - सूर्य) तिथि देता है। चन्द्रमा की निरयन स्थिति नक्षत्र देती है। संयुक्त सूर्य-चन्द्र भोगांश योग देता है। पंचांग का प्रत्येक अंग इसी एक JD रूपान्तरण से जुड़ा है।</> : <>In our codebase, the function dateToJD() is the gateway to all computation. When a user views the Panchang for a date, the first thing that happens is: JD = dateToJD(year, month, day, hour). This JD is then passed to sunLongitude(jd) and moonLongitude(jd) to get the tropical positions of the Sun and Moon. The difference (Moon - Sun) gives the Tithi. The Moon&apos;s sidereal position gives the Nakshatra. The combined Sun-Moon longitude sum gives the Yoga. Every single element of the Panchang traces back to this one JD conversion.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;जूलियन दिवस बस भिन्न इकाइयों में यूनिक्स टाइमस्टैम्प है।&quot; दोनों निरन्तर समय गणनाएँ हैं, किन्तु यूनिक्स टाइमस्टैम्प 1 जनवरी, 1970 से आरम्भ होकर सेकण्ड गिनता है, जबकि JD 4713 ई.पू. से आरम्भ होकर दिन गिनता है। महत्त्वपूर्ण बात, JD मध्याह्न UT (मध्यरात्रि नहीं) से आरम्भ होता है, अर्थात JD .0 = मध्याह्न और JD .5 = मध्यरात्रि — अधिकांश प्रोग्रामरों की अपेक्षा के विपरीत।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Julian Day is just a Unix timestamp in different units.&quot; While both are continuous time counts, Unix timestamps start at January 1, 1970 and count seconds, while JD starts at 4713 BCE and counts days. More importantly, JD begins at noon UT (not midnight), which means JD .0 = noon and JD .5 = midnight — the opposite of what most programmers expect.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
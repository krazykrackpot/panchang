'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-4.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_22_4', phase: 9, topic: 'Astronomy', moduleNumber: '22.4',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
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
          'Sunrise calculation uses a 2-pass method: first compute approximate sunrise, then recalculate the Sun\'s position at that time for a precise answer.',
          'Atmospheric refraction bends sunlight so we see the Sun about 34 arcminutes before it geometrically clears the horizon.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Defines Sunrise?', hi: 'सूर्योदय की परिभाषा क्या है?', sa: 'सूर्योदय की परिभाषा क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय आधिकारिक रूप से वह क्षण है जब सूर्य बिम्ब का ऊपरी अंग (शीर्ष किनारा) ज्यामितीय क्षितिज को छूता है, समुद्र तल पर प्रेक्षित। किन्तु जब हम पहली बार सूर्य देखते हैं तब वह वास्तव में क्षितिज पर नहीं होता — वायुमण्डलीय अपवर्तन प्रकाश किरणों को मोड़ता है, सूर्य को तब दृश्य बनाता है जब वह अभी ज्यामितीय रूप से क्षितिज से नीचे है। क्षितिज पर मानक अपवर्तन 34 कला (0.567°) है। इसके अतिरिक्त, हम ऊपरी अंग देखना चाहते हैं, केन्द्र नहीं, अतः सूर्य का दृश्य अर्ध-व्यास 16 कला जोड़ते हैं। संयुक्त सीमा: सूर्य का ज्यामितीय केन्द्र ऊँचाई = -0.8333° (-(34&apos; + 16&apos;) = -50&apos; = -0.8333°) पर होना चाहिए।</> : <>Sunrise is officially defined as the instant when the upper limb (top edge) of the Sun&apos;s disk touches the geometric horizon, as observed at sea level. But the Sun is not actually at the horizon when we first see it — atmospheric refraction bends light rays, making the Sun visible when it is still geometrically below the horizon. The standard refraction at the horizon is 34 arcminutes (0.567°). Additionally, we want to detect the upper limb, not the center, so we add the Sun&apos;s apparent semi-diameter of 16 arcminutes. The combined threshold: the Sun&apos;s geometric center must be at altitude = -0.8333° (-(34&apos; + 16&apos;) = -50&apos; = -0.8333°).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मूलभूत समीकरण: प्रेक्षक का अक्षांश (lat) और सूर्य की क्रान्ति (decl) दिए हों, तो घण्टा कोण H₀ जिस पर सूर्य ऊँचाई h₀ = -0.8333° पर पहुँचता है: H₀ = arccos([sin(h₀) - sin(lat) × sin(decl)] / [cos(lat) × cos(decl)])। यह खगोलीय त्रिभुज पर लागू गोलीय त्रिकोणमिति का कोज्या नियम है। सूर्योदय समय तब: सूर्योदय = सौर मध्याह्न - H₀/15, जहाँ H₀ अंशों में है और 15 से विभाजन घण्टों में बदलता है (पृथ्वी प्रति घण्टा 15° घूमती है)।</> : <>The fundamental equation: given the observer&apos;s latitude (lat) and the Sun&apos;s declination (decl), the hour angle H₀ at which the Sun reaches altitude h₀ = -0.8333° is: H₀ = arccos([sin(h₀) - sin(lat) x sin(decl)] / [cos(lat) x cos(decl)]). This is the cosine rule from spherical trigonometry applied to the astronomical triangle. The sunrise time is then: Sunrise = Solar Noon - H₀/15, where H₀ is in degrees and dividing by 15 converts to hours (since the Earth rotates 15° per hour).</>}</p>
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
          {tl({ en: 'The 2-Pass Algorithm', hi: '2-पास एल्गोरिदम', sa: '2-पास एल्गोरिदम' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पास 1: मध्याह्न JD पर समय के समीकरण का उपयोग करके सौर मध्याह्न गणित करें। सौर मध्याह्न केवल 12:00 स्थानीय समय नहीं है — यह (अ) समयक्षेत्र याम्योत्तर से प्रेक्षक के देशान्तर अन्तर, और (ब) समय के समीकरण पर निर्भर करता है। EoT +14 मिनट (फरवरी) और -16 मिनट (नवम्बर) के बीच झूलता है। सौर मध्याह्न पर सूर्य की क्रान्ति गणित करें और प्रारम्भिक सूर्योदय अनुमान पाने हेतु घण्टा कोण सूत्र उपयोग करें। यह अनुमान सामान्यतः सही उत्तर से ~4 मिनट के भीतर है।</> : <>Pass 1: Compute solar noon using the Equation of Time at the noon JD. Solar noon is NOT simply 12:00 local time — it depends on (a) the observer&apos;s longitude offset from the timezone meridian, and (b) the Equation of Time. The EoT swings between +14 minutes (February) and -16 minutes (November). At solar noon, compute the Sun&apos;s declination and use the hour angle formula to get an initial sunrise estimate. This estimate is typically within ~4 minutes of the true answer.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पास 2: यहाँ निर्णायक शोधन है। मध्याह्न पर सूर्य की क्रान्ति सूर्योदय पर समान नहीं है — क्रान्ति दिन भर बदलती है, विशेषतः विषुवों के निकट जब यह 12 घण्टों में ~0.4° खिसकती है। पास 1 सूर्योदय अनुमान लें, उस जूलियन दिवस (मध्याह्न नहीं) पर सूर्य की क्रान्ति और EoT गणित करें, और घण्टा कोण व सूर्योदय समय पुनर्गणित करें। यह दूसरा पास ~4 मिनट त्रुटि दूर करता है और व्यावसायिक एफेमेरिस परिणामों से मिलान करता है। तृतीय पास की आवश्यकता नहीं क्योंकि पास 2 के बाद शेष त्रुटि 1 सेकण्ड से कम है।</> : <>Pass 2: Here is the critical refinement. The Sun&apos;s declination at noon is NOT the same as at sunrise — declination changes throughout the day, especially near the equinoxes when it shifts ~0.4° in 12 hours. Take the Pass 1 sunrise estimate, compute the Sun&apos;s declination and EoT at THAT Julian Day (not noon), and recompute the hour angle and sunrise time. This second pass eliminates the ~4 minute error and matches professional ephemeris results. There is no need for a third pass because the residual error after Pass 2 is under 1 second.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Location:</span> Corseaux, Switzerland (46.47°N, 6.80°E), April 2, 2026. Timezone: Europe/Zurich (CEST, UTC+2).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Pass 1:</span> Solar noon JD = 2461132.0. EoT at noon ≈ -3.8 min. Solar noon = 12:00 - (-3.8/60) + (15° - 6.8°)/15 = ~13:30 CEST (accounting for timezone). Declination at noon ≈ +5.1°. H₀ = arccos([sin(-0.833°) - sin(46.47°) x sin(5.1°)] / [cos(46.47°) x cos(5.1°)]) ≈ 86.9°. Sunrise estimate ≈ 13:30 - 86.9/15 ≈ 07:41 CEST.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Pass 2:</span> Recompute declination and EoT at JD corresponding to 07:41 CEST. Declination ≈ +5.0° (slightly less than noon). Refined sunrise ≈ 07:40 CEST — within 1 minute of reference sources.
        </p>
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
          {tl({ en: 'The Equation of Time Explained', hi: 'समय का समीकरण विस्तार से', sa: 'समय का समीकरण विस्तार से' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>समय का समीकरण दृश्य सौर समय (धूपघड़ी समय) और माध्य सौर समय (घड़ी समय) के बीच अन्तर है। यह दो स्वतन्त्र कारणों से उत्पन्न होता है। कारण 1 — कक्षीय उत्केन्द्रता: पृथ्वी की दीर्घवृत्तीय कक्षा सूर्य को उपसौर (जनवरी) के निकट क्रान्तिवृत्त पर तेज़ और अपसौर (जुलाई) के निकट धीमा दिखाती है। यदि यही एकमात्र प्रभाव होता, तो EoT ~365 दिन अवधि की सरल ज्या तरंग होती। कारण 2 — क्रान्तिवृत्त की तिर्यकता: क्रान्तिवृत्त विषुवत से 23.4° झुका है। यदि सूर्य क्रान्तिवृत्त पर समान रूप से चलता भी, तो विषुवत पर इसका प्रक्षेप (जो विषुवांश और इसलिए घड़ी समय निर्धारित करता है) असमान होगा।</> : <>The Equation of Time is the difference between apparent solar time (sundial time) and mean solar time (clock time). It arises from two independent causes. Cause 1 — Orbital eccentricity: Earth&apos;s elliptical orbit makes the Sun appear to move faster along the ecliptic near perihelion (January) and slower near aphelion (July). If this were the only effect, the EoT would be a simple sine wave with a ~365-day period. Cause 2 — Obliquity of the ecliptic: the ecliptic is tilted 23.4° to the equator. Even if the Sun moved uniformly along the ecliptic, its projection onto the equator (which determines right ascension and hence clock time) would be non-uniform.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोनों प्रभाव मिलकर विशिष्ट द्वि-शिखर EoT वक्र बनाते हैं: यह लगभग 12 फरवरी को +14 मिनट पर शिखर, लगभग 15 अप्रैल को शून्य, लगभग 14 मई को -4 मिनट, लगभग 13 जून को पुनः शून्य, लगभग 26 जुलाई को -6 मिनट, लगभग 1 सितम्बर को शून्य, लगभग 3 नवम्बर को -16 मिनट तक गिरता है, और लगभग 25 दिसम्बर को शून्य लौटता है। ~30 मिनट की कुल परास का अर्थ है कि सौर मध्याह्न 12:00 घड़ी समय से एक चौथाई घण्टे तक भिन्न हो सकता है।</> : <>The two effects combine to create the characteristic double-peaked EoT curve: it peaks at +14 minutes around February 12, crosses zero around April 15, reaches -4 minutes around May 14, crosses zero again around June 13, dips to -6 minutes around July 26, crosses zero around September 1, plunges to -16 minutes around November 3, and returns to zero around December 25. The total range of ~30 minutes means solar noon can differ from 12:00 clock time by up to a quarter of an hour.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why This Matters for Panchang', hi: 'पंचांग के लिए महत्त्व', sa: 'पंचांग के लिए महत्त्व' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>प्रत्येक समय-आधारित पंचांग तत्व सटीक सूर्योदय पर निर्भर है: राहु काल, यमघण्ट, गुलिक, अभिजित मुहूर्त और होरा क्रम सभी सूर्योदय को अपने प्रारम्भिक सन्दर्भ के रूप में उपयोग करते हैं। 4 मिनट की सूर्योदय त्रुटि इन सभी गणनाओं में प्रसारित होती है। EoT सुधार सहित 2-पास एल्गोरिदम सुनिश्चित करता है कि हमारा सूर्योदय विश्व भर में किसी भी स्थान पर — विषुवतीय चेन्नई से ध्रुवीय ट्रोम्सो से मध्य-अक्षांश कोर्सो तक — प्रमुख पंचांग स्रोतों से 1 मिनट के भीतर मिलान करता है।</> : <>Every time-based Panchang element depends on accurate sunrise: Rahu Kaal, Yamaghanda, Gulika, Abhijit Muhurta, and the Hora sequence all use sunrise as their starting reference. A 4-minute sunrise error cascades into all these calculations. The 2-pass algorithm with EoT correction ensures our sunrise matches reference panchang sources to within 1 minute at any location worldwide — from equatorial Chennai to polar Tromso to mid-latitude Corseaux.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सौर मध्याह्न सदैव 12:00 पर होता है।&quot; सौर मध्याह्न तीन कारकों पर निर्भर है: (1) समयक्षेत्र केन्द्रीय याम्योत्तर से आपका देशान्तर अन्तर, (2) समय का समीकरण, और (3) दिवालोक बचत समय। कोर्सो (6.8°E, 15°E पर केन्द्रित समयक्षेत्र) में सौर मध्याह्न ग्रीष्म में सामान्यतः लगभग 13:25-13:35 CEST होता है — घड़ी पर &quot;12:00&quot; से 90 मिनट से अधिक बाद।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Solar noon is always at 12:00.&quot; Solar noon depends on three factors: (1) your longitude offset from the timezone central meridian, (2) the Equation of Time, and (3) daylight saving time. In Corseaux (6.8°E, timezone centered on 15°E), solar noon is typically around 13:25-13:35 CEST in summer — over 90 minutes after &quot;12:00&quot; on the clock.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
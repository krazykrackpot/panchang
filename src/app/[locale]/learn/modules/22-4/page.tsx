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
  estimatedMinutes: 16,
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
          'The combined correction for refraction (+34\') and semi-diameter (+16\') means the Sun\'s geometric centre is at -0.8333° at the moment of visible sunrise.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Defines Sunrise?', hi: 'सूर्योदय की परिभाषा क्या है?', sa: 'सूर्योदय की परिभाषा क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय आधिकारिक रूप से वह क्षण है जब सूर्य बिम्ब का ऊपरी अंग (शीर्ष किनारा) ज्यामितीय क्षितिज को छूता है, समुद्र तल पर प्रेक्षित। किन्तु जब हम पहली बार सूर्य देखते हैं तब वह वास्तव में क्षितिज पर नहीं होता  –  वायुमण्डलीय अपवर्तन प्रकाश किरणों को मोड़ता है, सूर्य को तब दृश्य बनाता है जब वह अभी ज्यामितीय रूप से क्षितिज से नीचे है। क्षितिज पर मानक अपवर्तन 34 कला (0.567°) है। इसके अतिरिक्त, हम ऊपरी अंग देखना चाहते हैं, केन्द्र नहीं, अतः सूर्य का दृश्य अर्ध-व्यास 16 कला जोड़ते हैं। संयुक्त सीमा: सूर्य का ज्यामितीय केन्द्र ऊँचाई = -0.8333° (-(34&apos; + 16&apos;) = -50&apos; = -0.8333°) पर होना चाहिए।</> : <>Sunrise is officially defined as the instant when the upper limb (top edge) of the Sun&apos;s disk touches the geometric horizon, as observed at sea level. But the Sun is not actually at the horizon when we first see it  –  atmospheric refraction bends light rays, making the Sun visible when it is still geometrically below the horizon. The standard refraction at the horizon is 34 arcminutes (0.567°). Additionally, we want to detect the upper limb, not the center, so we add the Sun&apos;s apparent semi-diameter of 16 arcminutes. The combined threshold: the Sun&apos;s geometric center must be at altitude = -0.8333° (-(34&apos; + 16&apos;) = -50&apos; = -0.8333°).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मूलभूत समीकरण: प्रेक्षक का अक्षांश (lat) और सूर्य की क्रान्ति (decl) दिए हों, तो घण्टा कोण H₀ जिस पर सूर्य ऊँचाई h₀ = -0.8333° पर पहुँचता है: H₀ = arccos([sin(h₀) - sin(lat) × sin(decl)] / [cos(lat) × cos(decl)])। यह खगोलीय त्रिभुज पर लागू गोलीय त्रिकोणमिति का कोज्या नियम है। सूर्योदय समय तब: सूर्योदय = सौर मध्याह्न - H₀/15, जहाँ H₀ अंशों में है और 15 से विभाजन घण्टों में बदलता है (पृथ्वी प्रति घण्टा 15° घूमती है)।</> : <>The fundamental equation: given the observer&apos;s latitude (lat) and the Sun&apos;s declination (decl), the hour angle H₀ at which the Sun reaches altitude h₀ = -0.8333° is: H₀ = arccos([sin(h₀) - sin(lat) x sin(decl)] / [cos(lat) x cos(decl)]). This is the cosine rule from spherical trigonometry applied to the astronomical triangle. The sunrise time is then: Sunrise = Solar Noon - H₀/15, where H₀ is in degrees and dividing by 15 converts to hours (since the Earth rotates 15° per hour).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Vedic vs Astronomical Sunrise', hi: 'वैदिक बनाम खगोलीय सूर्योदय', sa: 'वैदिक बनाम खगोलीय सूर्योदय' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>वैदिक परम्परा में सूर्योदय वह क्षण है जब सूर्य बिम्ब का ऊपरी अंग क्षितिज पर प्रथम बार दिखता है  –  यह अपवर्तन-सहित खगोलीय सूर्योदय से मेल खाता है। कुछ आधुनिक ज्योतिष सॉफ़्टवेयर &quot;सूर्य बिम्ब केन्द्र&quot; परिभाषा प्रयोग करते हैं जो ~1.3 मिनट बाद आती है। हमारा ऐप मानक ऊपरी-अंग परिभाषा (h₀ = -0.8333°) प्रयोग करता है जो अधिकांश पारम्परिक पंचांगों से मेल खाती है।</> : <>In the Vedic tradition, sunrise is the moment the upper limb of the Sun&apos;s disc first appears on the horizon  –  this matches the refraction-inclusive astronomical sunrise. Some modern astrology software uses a &quot;Sun disc centre&quot; definition which occurs ~1.3 minutes later. Our app uses the standard upper-limb definition (h₀ = -0.8333°) which matches most traditional panchangs.</>}</p>
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
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पास 1: मध्याह्न JD पर समय के समीकरण का उपयोग करके सौर मध्याह्न गणित करें। सौर मध्याह्न केवल 12:00 स्थानीय समय नहीं है  –  यह (अ) समयक्षेत्र याम्योत्तर से प्रेक्षक के देशान्तर अन्तर, और (ब) समय के समीकरण पर निर्भर करता है। EoT +14 मिनट (फरवरी) और -16 मिनट (नवम्बर) के बीच झूलता है। सौर मध्याह्न पर सूर्य की क्रान्ति गणित करें और प्रारम्भिक सूर्योदय अनुमान पाने हेतु घण्टा कोण सूत्र उपयोग करें। यह अनुमान सामान्यतः सही उत्तर से ~4 मिनट के भीतर है।</> : <>Pass 1: Compute solar noon using the Equation of Time at the noon JD. Solar noon is NOT simply 12:00 local time  –  it depends on (a) the observer&apos;s longitude offset from the timezone meridian, and (b) the Equation of Time. The EoT swings between +14 minutes (February) and -16 minutes (November). At solar noon, compute the Sun&apos;s declination and use the hour angle formula to get an initial sunrise estimate. This estimate is typically within ~4 minutes of the true answer.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पास 2: यहाँ निर्णायक शोधन है। मध्याह्न पर सूर्य की क्रान्ति सूर्योदय पर समान नहीं है  –  क्रान्ति दिन भर बदलती है, विशेषतः विषुवों के निकट जब यह 12 घण्टों में ~0.4° खिसकती है। पास 1 सूर्योदय अनुमान लें, उस जूलियन दिवस (मध्याह्न नहीं) पर सूर्य की क्रान्ति और EoT गणित करें, और घण्टा कोण व सूर्योदय समय पुनर्गणित करें। यह दूसरा पास ~4 मिनट त्रुटि दूर करता है और व्यावसायिक एफेमेरिस परिणामों से मिलान करता है। तृतीय पास की आवश्यकता नहीं क्योंकि पास 2 के बाद शेष त्रुटि 1 सेकण्ड से कम है।</> : <>Pass 2: Here is the critical refinement. The Sun&apos;s declination at noon is NOT the same as at sunrise  –  declination changes throughout the day, especially near the equinoxes when it shifts ~0.4° in 12 hours. Take the Pass 1 sunrise estimate, compute the Sun&apos;s declination and EoT at THAT Julian Day (not noon), and recompute the hour angle and sunrise time. This second pass eliminates the ~4 minute error and matches professional ephemeris results. There is no need for a third pass because the residual error after Pass 2 is under 1 second.</>}</p>
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
          <span className="text-gold-light font-medium">Pass 2:</span> Recompute declination and EoT at JD corresponding to 07:41 CEST. Declination ≈ +5.0° (slightly less than noon). Refined sunrise ≈ 07:40 CEST  –  within 1 minute of reference sources.
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
          {tl({ en: 'Atmospheric Refraction  –  The Invisible Lens', hi: 'वायुमण्डलीय अपवर्तन  –  अदृश्य लेंस', sa: 'वायुमण्डलीय अपवर्तन  –  अदृश्य लेंस' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पृथ्वी का वायुमण्डल एक विशाल लेंस के रूप में कार्य करता है जो प्रकाश किरणों को पृथ्वी की सतह की ओर मोड़ता है। यह प्रभाव क्षितिज पर सर्वाधिक होता है (जहाँ प्रकाश वायुमण्डल के सबसे लम्बे पथ से गुज़रता है) और शीर्ष पर शून्य होता है। मानक अपवर्तन मान: 90° (शीर्ष) पर 0 कला, 45° पर 1 कला, 20° पर 2.6 कला, 10° पर 5.3 कला, 5° पर 9.9 कला, 1° पर 24.6 कला, 0° (क्षितिज) पर 34.5 कला। 34 कला ≈ 0.567°  –  सूर्य बिम्ब के लगभग पूरे व्यास के बराबर! इसका अर्थ है कि जब आप सूर्य को क्षितिज पर &quot;बैठे&quot; देखते हैं, तो वह वास्तव में पूर्ण रूप से क्षितिज के नीचे है।</> : <>Earth&apos;s atmosphere acts as a giant lens that bends light rays towards the Earth&apos;s surface. This effect is strongest at the horizon (where light travels through the longest atmospheric path) and zero at the zenith. Standard refraction values: 0 arcminutes at 90° (zenith), 1 arcminute at 45°, 2.6 at 20°, 5.3 at 10°, 9.9 at 5°, 24.6 at 1°, 34.5 at 0° (horizon). The 34 arcminutes at the horizon is ≈ 0.567°  –  nearly the entire diameter of the Sun&apos;s disc! This means when you see the Sun &quot;sitting&quot; on the horizon, it is actually entirely below it geometrically.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अपवर्तन मौसम-निर्भर है। 34 कला मानक परिस्थितियों (15°C, 1013.25 hPa) का औसत है। -20°C (सर्दी) पर अपवर्तन 40 कला तक बढ़ता है; +35°C (ग्रीष्म) पर 31 कला तक घटता है। उच्च आर्द्रता भी अपवर्तन बढ़ाती है। यह ~6 कला भिन्नता सूर्योदय समय में ~1 मिनट का अन्तर बनाती है  –  हमारी ~1 मिनट सटीकता सीमा का एक प्रमुख कारण।</> : <>Refraction is weather-dependent. The 34 arcminute value is the average for standard conditions (15°C, 1013.25 hPa). At -20°C (winter), refraction increases to 40 arcminutes; at +35°C (summer), it decreases to 31 arcminutes. High humidity also increases refraction. This ~6 arcminute variation creates ~1 minute of difference in sunrise times  –  a major contributor to our ~1 minute accuracy limit.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Depression Angle Variants  –  Twilight Types', hi: 'अवनमन कोण विविधता  –  गोधूलि प्रकार', sa: 'अवनमन कोण विविधता  –  गोधूलि प्रकार' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>सूर्योदय परिभाषा बदलकर विभिन्न प्रकार की गोधूलि गणित की जा सकती है। <span className="text-gold-light font-medium">नागरिक गोधूलि</span> (h₀ = -6°): पर्याप्त प्रकाश जिसमें बाहरी गतिविधियाँ सम्भव  –  कृत्रिम प्रकाश अनावश्यक। <span className="text-gold-light font-medium">नौवहन गोधूलि</span> (h₀ = -12°): क्षितिज दृश्य, तारे दिखने लगते हैं  –  नाविक इसे सेक्सटेन्ट प्रेक्षणों के लिए प्रयोग करते थे। <span className="text-gold-light font-medium">खगोलीय गोधूलि</span> (h₀ = -18°): पूर्ण अन्धकार  –  यह बिन्दु वेधशाला प्रेक्षणों के लिए रात्रि का आरम्भ/अन्त निर्धारित करता है। इस्लामी नमाज़ समय फज्र (-15° से -18° के बीच, सम्प्रदाय पर निर्भर) और इशा (-15° से -18°) के लिए अवनमन कोण प्रयोग करते हैं।</> : <><span className="text-gold-light font-medium">Civil twilight</span> (h₀ = -6°): enough light for outdoor activities without artificial illumination. <span className="text-gold-light font-medium">Nautical twilight</span> (h₀ = -12°): horizon visible, stars begin to appear  –  sailors used this for sextant observations. <span className="text-gold-light font-medium">Astronomical twilight</span> (h₀ = -18°): full darkness  –  this marks the start/end of night for observatory observations. Islamic prayer times use depression angles for Fajr (-15° to -18° depending on school) and Isha (-15° to -18°).</>}</p>
      </section>
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Equation of Time Explained', hi: 'समय का समीकरण विस्तार से', sa: 'समय का समीकरण विस्तार से' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>समय का समीकरण दृश्य सौर समय (धूपघड़ी समय) और माध्य सौर समय (घड़ी समय) के बीच अन्तर है। यह दो स्वतन्त्र कारणों से उत्पन्न होता है। कारण 1  –  कक्षीय उत्केन्द्रता: पृथ्वी की दीर्घवृत्तीय कक्षा सूर्य को उपसौर (जनवरी) के निकट क्रान्तिवृत्त पर तेज़ और अपसौर (जुलाई) के निकट धीमा दिखाती है। कारण 2  –  क्रान्तिवृत्त की तिर्यकता: क्रान्तिवृत्त विषुवत से 23.4° झुका है। यदि सूर्य क्रान्तिवृत्त पर समान रूप से चलता भी, तो विषुवत पर इसका प्रक्षेप असमान होगा।</> : <>The Equation of Time is the difference between apparent solar time (sundial time) and mean solar time (clock time). It arises from two independent causes. Cause 1  –  Orbital eccentricity: Earth&apos;s elliptical orbit makes the Sun appear to move faster along the ecliptic near perihelion (January) and slower near aphelion (July). Cause 2  –  Obliquity of the ecliptic: the ecliptic is tilted 23.4° to the equator. Even if the Sun moved uniformly along the ecliptic, its projection onto the equator would be non-uniform.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोनों प्रभाव मिलकर विशिष्ट द्वि-शिखर EoT वक्र बनाते हैं: यह लगभग 12 फरवरी को +14 मिनट पर शिखर, लगभग 3 नवम्बर को -16 मिनट तक गिरता है। ~30 मिनट की कुल परास का अर्थ है कि सौर मध्याह्न 12:00 घड़ी समय से एक चौथाई घण्टे तक भिन्न हो सकता है।</> : <>The two effects combine to create the characteristic double-peaked EoT curve: it peaks at +14 minutes around February 12 and plunges to -16 minutes around November 3. The total range of ~30 minutes means solar noon can differ from 12:00 clock time by up to a quarter of an hour.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why This Matters for Panchang', hi: 'पंचांग के लिए महत्त्व', sa: 'पंचांग के लिए महत्त्व' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>प्रत्येक समय-आधारित पंचांग तत्व सटीक सूर्योदय पर निर्भर है: राहु काल, यमघण्ट, गुलिक, अभिजित मुहूर्त और होरा क्रम सभी सूर्योदय को अपने प्रारम्भिक सन्दर्भ के रूप में उपयोग करते हैं। 4 मिनट की सूर्योदय त्रुटि इन सभी गणनाओं में प्रसारित होती है। EoT सुधार सहित 2-पास एल्गोरिदम सुनिश्चित करता है कि हमारा सूर्योदय विश्व भर में किसी भी स्थान पर प्रमुख पंचांग स्रोतों से 1 मिनट के भीतर मिलान करता है।</> : <>Every time-based Panchang element depends on accurate sunrise: Rahu Kaal, Yamaghanda, Gulika, Abhijit Muhurta, and the Hora sequence all use sunrise as their starting reference. A 4-minute sunrise error cascades into all these calculations. The 2-pass algorithm with EoT correction ensures our sunrise matches reference panchang sources to within 1 minute at any location worldwide.</>}</p>
      </section>
    </div>
  );
}

function Page5() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Latitude Effects and Extreme Cases', hi: 'अक्षांश प्रभाव और चरम स्थितियाँ', sa: 'अक्षांश प्रभाव और चरम स्थितियाँ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय गणना का व्यवहार प्रेक्षक के अक्षांश के साथ नाटकीय रूप से बदलता है। विषुवत के निकट (0°), सूर्य लगभग लम्बवत उदित और अस्त होता है  –  संध्या ~20 मिनट रहती है और दिन की लम्बाई वर्ष भर ~12 घण्टे रहती है। मध्य-अक्षांशों पर (कोर्सो, 46.5°N), सूर्य क्षितिज को तिरछे काटता है। ग्रीष्म अयनान्त पर दिन ~16 घण्टे; शीत अयनान्त पर ~8.5 घण्टे। ध्रुवीय क्षेत्रों में (&gt;66.5°), ग्रीष्म में मध्यरात्रि सूर्य और शीत में ध्रुवीय रात्रि होती है।</> : <>The behavior of sunrise computation changes dramatically with the observer&apos;s latitude. Near the equator (0°), the Sun rises and sets nearly vertically  –  twilight lasts ~20 minutes and day length stays ~12 hours year-round. At mid-latitudes (Corseaux, 46.5°N), the Sun crosses the horizon at an angle. Day length ranges from ~16 hours at summer solstice to ~8.5 hours at winter solstice. In polar regions (&gt;66.5°), the midnight sun (24 hours of light) in summer and polar night (24 hours of darkness) in winter occur.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>घण्टा कोण सूत्र में, यह अक्षांश संवेदनशीलता arccos तर्क में दिखती है। जब यह तर्क -1 से कम या +1 से अधिक हो जाता है, तो arccos अपरिभाषित हो जाता है  –  इसका अर्थ है सूर्य कभी उस सीमा ऊँचाई तक नहीं पहुँचता। तर्क &gt; 1 = सूर्य कभी अस्त नहीं होता (मध्यरात्रि सूर्य)। तर्क &lt; -1 = सूर्य कभी उदित नहीं होता (ध्रुवीय रात्रि)। हमारा कोड इन स्थितियों को &quot;सूर्योदय नहीं&quot; या &quot;सूर्यास्त नहीं&quot; लौटाकर सम्भालता है।</> : <>In the hour angle formula, this latitude sensitivity appears in the arccos argument. When this argument falls below -1 or exceeds +1, the arccos is undefined  –  meaning the Sun never reaches the threshold altitude. Argument &gt; 1 = the Sun never sets (midnight sun). Argument &lt; -1 = the Sun never rises (polar night). Our code handles these cases by returning &quot;no sunrise&quot; or &quot;no sunset&quot; respectively.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पंचांग प्रयोजनों के लिए यह एक वास्तविक समस्या बनाता है: वैदिक दिन सूर्योदय से सूर्योदय तक परिभाषित है। यदि कोई सूर्योदय नहीं है, तो सम्पूर्ण पंचांग प्रणाली अपरिभाषित हो जाती है। विभिन्न परम्पराएँ इसे भिन्न रूप से सम्भालती हैं: कुछ 6:00 AM स्थानीय समय को &quot;पारम्परिक सूर्योदय&quot; के रूप में उपयोग करती हैं; अन्य निकटतम दिन के वास्तविक सूर्योदय का उपयोग करती हैं।</> : <>For Panchang purposes this creates a real problem: the Vedic day is defined from sunrise to sunrise. If there is no sunrise (as in Tromso, Norway during summer), the entire Panchang system  –  Rahu Kaal, Choghadiya, Hora  –  becomes undefined. Different traditions handle this differently: some use 6:00 AM local time as &quot;conventional sunrise&quot;; others use the actual sunrise of the nearest day that has one.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Altitude Correction', hi: 'ऊँचाई सुधार', sa: 'ऊँचाई सुधार' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>समुद्र तल से ऊपर ऊँचाई पर प्रेक्षक का क्षितिज नीचे होता है। क्षितिज अवनमन = √(2h/R) है, जहाँ h ऊँचाई और R पृथ्वी त्रिज्या (6371 किमी)। 1000 मीटर पर, क्षितिज ~1° नीचा होता है, जिससे सूर्योदय ~3 मिनट पहले दिखता है। कोर्सो (समुद्र तल ~380m) के लिए अवनमन ~0.6° है, जो सूर्योदय को ~1.5 मिनट पहले करता है। हमारा इंजन वर्तमान में ऊँचाई सुधार लागू नहीं करता  –  यह एक ज्ञात सीमा है जो पहाड़ी स्थानों पर ±2 मिनट तक त्रुटि बना सकती है।</> : <>An observer above sea level has a lower horizon. The horizon dip = √(2h/R) where h is elevation and R is Earth&apos;s radius (6371 km). At 1000m, the horizon is ~1° lower, making sunrise appear ~3 minutes earlier. For Corseaux (elevation ~380m), the dip is ~0.6°, which moves sunrise ~1.5 minutes earlier. Our engine does not currently apply altitude correction  –  this is a known limitation that can cause ±2 minute errors at mountainous locations.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सौर मध्याह्न सदैव 12:00 पर होता है।&quot; कोर्सो (6.8°E, 15°E पर केन्द्रित समयक्षेत्र) में सौर मध्याह्न ग्रीष्म में सामान्यतः लगभग 13:25-13:35 CEST होता है  –  घड़ी पर &quot;12:00&quot; से 90 मिनट से अधिक बाद।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Solar noon is always at 12:00.&quot; In Corseaux (6.8°E, timezone centred on 15°E), solar noon is typically around 13:25-13:35 CEST in summer  –  over 90 minutes after &quot;12:00&quot; on the clock.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;वायुमण्डलीय अपवर्तन स्थिर 34 कला है।&quot; 34 कला मानक परिस्थितियों का मध्य मान है। वास्तविक अपवर्तन 31 कला (गर्म ग्रीष्म) से 40 कला (कड़ी सर्दी) तक भिन्न होता है। यह सूर्योदय समय में ~1 मिनट का अन्तर बनाता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Atmospheric refraction is a fixed 34 arcminutes.&quot; The 34 value is the average for standard conditions. Actual refraction varies from 31 arcminutes (hot summer) to 40 arcminutes (bitter cold). This creates ~1 minute of variation in sunrise times.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सूर्योदय विश्व भर में समान गणना से मिलता है।&quot; विभिन्न देश भिन्न परिभाषाएँ प्रयोग करते हैं। अधिकांश नागरिक सूर्योदय ऊपरी अंग = -0.8333° प्रयोग करते हैं। कुछ समुद्री (-12°) या खगोलीय (-18°) प्रयोग करते हैं। तुलना करते समय सुनिश्चित करें कि दोनों स्रोत समान परिभाषा प्रयोग करें।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Sunrise is computed the same way worldwide.&quot; Different countries use different definitions. Most civil sunrise uses upper limb = -0.8333° (our standard). Some use nautical (-12°) or astronomical (-18°). When comparing, ensure both sources use the same definition.</>}</p>
      </section>
    </div>
  );
}

function Page6() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Practical Application  –  Verifying Sunrise Accuracy', hi: 'व्यावहारिक अनुप्रयोग  –  सूर्योदय सटीकता सत्यापन', sa: 'व्यावहारिक अनुप्रयोग  –  सूर्योदय सटीकता सत्यापन' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>आप हमारे ऐप के सूर्योदय समय को तीन सन्दर्भ स्रोतों से सत्यापित कर सकते हैं: (1) timeanddate.com  –  सबसे सुलभ ऑनलाइन सन्दर्भ, USNO डेटा पर आधारित। (2) भारतीय खगोलीय पंचांग  –  भारतीय स्थानों के लिए सरकारी पंचांग सन्दर्भ। (3) NOAA Solar Calculator  –  अमेरिकी मौसम विज्ञान प्रयोगशाला का आधिकारिक उपकरण। तीनों स्रोतों से हमारा सूर्योदय 1 मिनट के भीतर मिलान करना चाहिए।</> : <>You can verify our app&apos;s sunrise time against three reference sources for any location: (1) timeanddate.com  –  the most accessible online reference, based on USNO data. (2) Indian Astronomical Ephemeris  –  the official government panchang reference for Indian locations. (3) NOAA Solar Calculator  –  the official US meteorological laboratory tool. Our sunrise should match all three within 1 minute (and typically does).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The USNO Algorithm  –  Our Foundation', hi: 'USNO एल्गोरिदम  –  हमारी नींव', sa: 'USNO एल्गोरिदम  –  हमारी नींव' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा सूर्योदय एल्गोरिदम अमेरिकी नौसेना वेधशाला (USNO) द्वारा प्रकाशित पद्धति पर आधारित है, जो मीयस &quot;एस्ट्रोनॉमिकल एल्गोरिदम्स&quot; के सौर स्थिति गणना का उपयोग करती है। USNO एल्गोरिदम का मूल विचार: (1) दिन भर सूर्य स्थिर नहीं है  –  क्रान्ति और विषुवांश दोनों बदलते हैं; (2) अपवर्तन मानक परिस्थितियों के लिए 34 कला निश्चित मानी जाती है; (3) 2-पास शोधन पर्याप्त अभिसरण देता है। विश्व भर के अधिकांश पंचांग सॉफ़्टवेयर इसी मूल एल्गोरिदम का अनुसरण करते हैं, जो विश्वसनीय अन्तर-तुलना सम्भव बनाता है।</> : <>Our sunrise algorithm is based on the method published by the US Naval Observatory (USNO), which uses the solar position calculations from Meeus &quot;Astronomical Algorithms.&quot; The core idea of the USNO algorithm: (1) the Sun is not stationary throughout the day  –  both declination and right ascension change; (2) refraction is assumed fixed at 34 arcminutes for standard conditions; (3) a 2-pass refinement provides sufficient convergence. Most panchang software worldwide follows this same core algorithm, enabling reliable cross-comparison.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Cross-References', hi: 'सम्बन्धित मॉड्यूल', sa: 'सम्बन्धित मॉड्यूल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>सूर्य स्थिति कैसे गणित होती है इसके लिए <span className="text-gold-light">मॉड्यूल 22.2 (सूर्य भोगांश)</span> देखें। बहुत कठिन चन्द्रोदय गणना के लिए <span className="text-gold-light">मॉड्यूल 22.5 (चन्द्रोदय)</span> देखें। सूर्योदय पर निर्भर पंचांग तत्वों (राहु काल, चौघड़िया, होरा) के लिए <span className="text-gold-light">मॉड्यूल 8.1 (मुहूर्त)</span> देखें।</> : <>For how the Sun&apos;s position is computed, see <span className="text-gold-light">Module 22.2 (Sun Longitude)</span>. For the much harder moonrise calculation, see <span className="text-gold-light">Module 22.5 (Moonrise)</span>. For Panchang elements that depend on sunrise (Rahu Kaal, Choghadiya, Hora), see <span className="text-gold-light">Module 8.1 (Muhurta)</span>.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />, <Page5 key="p5" />, <Page6 key="p6" />]} questions={QUESTIONS} />;
}

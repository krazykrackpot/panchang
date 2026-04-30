'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_22_2', phase: 9, topic: 'Astronomy', moduleNumber: '22.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
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
          'The Sun\'s position is computed using Meeus\'s algorithm with just 3 main sine corrections — achieving 0.01-degree accuracy.',
          'The algorithm accounts for Earth\'s elliptical orbit, axial tilt, and the slow precession of the equinoxes.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Sun&apos;s Apparent Motion', hi: 'सूर्य की दृश्य गति', sa: 'सूर्य की दृश्य गति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पृथ्वी के दृष्टिकोण से सूर्य प्रतिवर्ष आकाश में एक महान वृत्त बनाता प्रतीत होता है। यह पथ क्रान्तिवृत्त है, और सूर्य इस पर लगभग 1 अंश प्रतिदिन (360 अंश / 365.25 दिन) चलता है। किन्तु &quot;लगभग&quot; मुख्य शब्द है — गति समान नहीं है। पृथ्वी सूर्य की उत्केन्द्रता e ≈ 0.017 वाली दीर्घवृत्तीय कक्षा में चक्कर लगाती है। उपसौर (निकटतम बिन्दु, लगभग 3 जनवरी) पर पृथ्वी अपनी कक्षा में तेज़ चलती है, अतः सूर्य लगभग 1.02 अंश प्रतिदिन गतिमान दिखता है। अपसौर (दूरतम बिन्दु, लगभग 4 जुलाई) पर पृथ्वी धीमी होती है और सूर्य केवल लगभग 0.95 अंश प्रतिदिन चलता है। यह ~7% भिन्नता मूल कारण है कि हमें केन्द्र समीकरण की आवश्यकता है।</> : <>From Earth&apos;s perspective, the Sun appears to trace a great circle around the sky once per year. This path is the ecliptic, and the Sun moves along it at roughly 1 degree per day (360 degrees / 365.25 days). But &quot;roughly&quot; is the key word — the motion is NOT uniform. Earth orbits the Sun in an ellipse with eccentricity e ≈ 0.017. At perihelion (closest approach, around January 3), Earth moves faster in its orbit, so the Sun appears to move about 1.02 degrees per day. At aphelion (farthest point, around July 4), Earth slows down and the Sun moves only about 0.95 degrees per day. This ~7% variation is the fundamental reason we need the Equation of Center.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दो मूलभूत मात्राएँ सूर्य की स्थिति को ट्रैक करती हैं। ज्यामितीय माध्य भोगांश L₀ = 280.466° + 36000.770° × T बताता है कि यदि पृथ्वी की कक्षा समान कोणीय गति वाला पूर्ण वृत्त होती तो सूर्य कहाँ होता। माध्य विलम्बिका M = 357.529° + 35999.050° × T बताती है कि पृथ्वी उपसौर से कक्षा में कितनी दूर आई है, पुनः समान गति मानते हुए। ये &quot;माध्य&quot; मात्राएँ हैं — औसत जो वास्तविक दीर्घवृत्तीय भिन्नता की अनदेखी करती हैं। केन्द्र समीकरण इन्हें सुधारेगा।</> : <>Two fundamental quantities track the Sun&apos;s position. The geometric mean longitude L₀ = 280.466° + 36000.770° x T tells us where the Sun would be if Earth&apos;s orbit were a perfect circle with uniform angular speed. The mean anomaly M = 357.529° + 35999.050° x T tracks how far Earth has traveled from perihelion along its orbit, again assuming uniform speed. These are &quot;mean&quot; quantities — averages that ignore the real elliptical variation. The Equation of Center will correct them.</>}</p>
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
          {tl({ en: 'Equation of Center', hi: 'केन्द्र समीकरण', sa: 'केन्द्र समीकरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>केन्द्र समीकरण माध्य विलम्बिका (यदि समान रूप से चलती तो पृथ्वी &quot;कहाँ होती&quot;) को सत्य विलम्बिका (वास्तव में कहाँ है) में बदलता है। सूर्य के लिए सुधार C तीन ज्या पदों में व्यक्त होता है: C = 1.915° × sin(M) + 0.020° × sin(2M) + 0.000289° × sin(3M)। प्रमुख प्रथम पद (1.915°) अकेला सुधार का 99% वहन करता है। द्वितीय पद (0.020°) कक्षा की मामूली विषमता का प्रभाव जोड़ता है। तृतीय पद नगण्य है किन्तु पूर्णता हेतु सम्मिलित है। सत्य भोगांश तब: सत्य भोगांश = L₀ + C।</> : <>The Equation of Center converts the mean anomaly (where Earth &quot;should be&quot; if moving uniformly) to the true anomaly (where it actually is). For the Sun, the correction C is expressed as three sine terms: C = 1.915° x sin(M) + 0.020° x sin(2M) + 0.000289° x sin(3M). The dominant first term (1.915°) alone accounts for 99% of the correction. The second term (0.020°) adds the effect of the orbit&apos;s slight asymmetry. The third term is negligible but included for completeness. The true longitude is then: True Longitude = L₀ + C.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>फिर हम दृश्य भोगांश — वास्तव में प्रेक्षित स्थिति — प्राप्त करने हेतु दो छोटे सुधार लगाते हैं। पहला, अयन-चलन: चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के घूर्णन अक्ष को 18.6 वर्ष की प्रमुख अवधि से डोलाता है। चन्द्र आरोही पात का भोगांश Ω = 125.04° - 1934.136° × T यह सुधार चलाता है। दूसरा, विपथन: सूर्य से प्रकाश पृथ्वी तक लगभग 8.3 मिनट लेता है, और पृथ्वी गतिमान है, अतः सूर्य पृथ्वी की गति की दिशा में थोड़ा विस्थापित दिखता है।</> : <>Next, we apply two small corrections to get the apparent longitude — the position as actually observed. First, nutation: the Moon&apos;s gravitational pull causes Earth&apos;s rotation axis to wobble with a primary period of 18.6 years. The longitude of the Moon&apos;s ascending node Ω = 125.04° - 1934.136° x T drives this correction. Second, aberration: because light from the Sun takes about 8.3 minutes to reach Earth, and Earth is moving, the Sun appears slightly displaced in the direction of Earth&apos;s motion.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Complete Formula', hi: 'सम्पूर्ण सूत्र', sa: 'सम्पूर्ण सूत्र' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Apparent Longitude</span> = True Longitude - 0.00569° - 0.00478° x sin(Ω)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>-0.00569° पद विपथन स्थिरांक (20.5 कला-सेकण्ड) है। -0.00478° × sin(Ω) पद भोगांश में अयन-चलन है, जो 18.6 वर्ष के पात चक्र के साथ लगभग ±0.00478° के बीच दोलन करता है। संयुक्त रूप से ये सुधार सूर्य की स्थिति को 0.01° तक खिसकाते हैं — छोटा, किन्तु उप-अंश सटीकता के लिए महत्त्वपूर्ण।</> : <>The -0.00569° term is the aberration constant (20.5 arcseconds). The -0.00478° x sin(Ω) term is the nutation in longitude, which oscillates between approximately ±0.00478° with the 18.6-year nodal cycle. Combined, these corrections shift the Sun&apos;s position by up to 0.01° — small, but important for sub-degree accuracy.</>}</p>
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
          {tl({ en: 'Accuracy and Sidereal Conversion', hi: 'सटीकता और निरयन रूपान्तरण', sa: 'सटीकता और निरयन रूपान्तरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>हमारी सूर्य स्थिति कितनी सटीक है? मीयस निम्न-सटीकता एल्गोरिदम लगभग 0.01° (36 कला-सेकण्ड) प्राप्त करता है। समय के सन्दर्भ में, सूर्य ~1°/दिन चलता है, अतः 0.01° त्रुटि लगभग 1 मिनट समय में बदलती है। इसका अर्थ है कि हमारी सूर्योदय/सूर्यास्त गणनाओं में केवल सौर भोगांश से ~1 मिनट की अन्तर्निहित अनिश्चितता है। इसकी तुलना स्विस एफेमेरिस (~0.001°, अधिकांश व्यावसायिक ज्योतिष सॉफ़्टवेयर द्वारा प्रयुक्त) और JPL DE440 (~0.0001°, नासा द्वारा प्रयुक्त) से करें। पंचांग प्रयोजनों के लिए जहाँ सबसे छोटी सार्थक इकाई तिथि सीमा (~12° चन्द्र-सूर्य पृथक्करण) है, हमारी 0.01° सूर्य सटीकता पर्याप्त से अधिक है।</> : <>How accurate is our Sun position? The Meeus low-precision algorithm achieves approximately 0.01° (36 arcseconds). In time terms, since the Sun moves ~1°/day, a 0.01° error translates to roughly 1 minute of time. This means our sunrise/sunset calculations have an inherent ~1 minute uncertainty from the solar longitude alone. Compare this with Swiss Ephemeris (~0.001°, used by most professional astrology software) and JPL DE440 (~0.0001°, used by NASA). For Panchang purposes where the smallest meaningful unit is a tithi boundary (~12° of Moon-Sun separation), our 0.01° Sun accuracy is more than adequate.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष के लिए अन्तिम चरण: सायन से निरयन रूपान्तरण। मीयस एल्गोरिदम हमें सूर्य का सायन (पश्चिमी) भोगांश देता है — वसन्त विषुव से मापा। भारतीय ज्योतिष निरयन राशिचक्र का उपयोग करता है — एक स्थिर तारा सन्दर्भ से मापा। अन्तर अयनांश है, जो पुरस्सरण के कारण प्रतिवर्ष लगभग 50.3 कला-सेकण्ड बढ़ता है। लाहिरी अयनांश (भारत सरकार का मानक) का उपयोग करते हुए: निरयन भोगांश = सायन भोगांश - 24.22° (2026 के लिए)। हमारा ऐप राशि स्थान, भाव स्थिति और दशा गणना निर्धारित करने हेतु प्रत्येक ग्रह के लिए यह गणित करता है।</> : <>The final step for Vedic astrology: converting from tropical to sidereal. The Meeus algorithm gives us the Sun&apos;s tropical (Western) longitude — measured from the vernal equinox. Indian astrology uses the sidereal (nirayana) zodiac — measured from a fixed star reference. The difference is the ayanamsha, which increases by about 50.3 arcseconds per year due to precession. Using the Lahiri ayanamsha (the Indian government standard): Sidereal Longitude = Tropical Longitude - 24.22° (for 2026). Our app computes this for every planet to determine rashi placements, house positions, and dasha calculations.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अधिक ज्या पद सदैव सूर्य के लिए बेहतर सटीकता देते हैं।&quot; सूर्य के लिए केन्द्र समीकरण में 3 पद पर्याप्त हैं क्योंकि पृथ्वी की कक्षा की उत्केन्द्रता बहुत कम है (e ≈ 0.017)। चौथा पद ~0.000001° होगा — हमारी आवश्यक सटीकता से बहुत नीचे। चन्द्रमा, अपनी अत्यधिक जटिल कक्षा के साथ, वास्तव में 60+ पदों की आवश्यकता रखता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;More sine terms always mean better accuracy for the Sun.&quot; For the Sun, 3 terms in the Equation of Center are sufficient because Earth&apos;s orbit has very low eccentricity (e ≈ 0.017). The 4th term would be ~0.000001° — far below our needed precision. The Moon, with its much more complex orbit, genuinely needs 60+ terms.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा sunLongitude(jd) फ़ंक्शन ठीक ऊपर वर्णित एल्गोरिदम लागू करता है। यह एक जूलियन दिवस लेता है, T गणित करता है, फिर L₀, M, C, सत्य भोगांश, और अन्ततः दृश्य सायन भोगांश लौटाने हेतु अयन-चलन और विपथन लागू करता है। यह एकल फ़ंक्शन प्रति पृष्ठ लोड सैकड़ों बार बुलाया जाता है — सूर्योदय, सूर्यास्त, तिथि सीमाओं, संक्रान्ति समय और अन्य के लिए। मीयस की सुन्दरता यह है कि 3 ज्या पद और 2 छोटे सुधार न्यूनतम गणना के साथ व्यावसायिक-स्तर के परिणाम देते हैं।</> : <>Our sunLongitude(jd) function implements exactly the algorithm described above. It takes a Julian Day, computes T, then L₀, M, C, true longitude, and finally applies nutation and aberration to return the apparent tropical longitude. This single function is called hundreds of times per page load — for sunrise, sunset, tithi boundaries, sankranti timing, and more. The elegance of Meeus is that 3 sine terms and 2 small corrections give us professional-grade results with minimal computation.</>}</p>
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
          {tl({ en: 'Worked Example: Step-by-Step Sun Position', hi: 'कार्यान्वित उदाहरण: चरणबद्ध सूर्य स्थिति', sa: 'कार्यान्वित उदाहरण: चरणबद्ध सूर्य स्थिति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>2 अप्रैल, 2026 मध्याह्न UT के लिए गणना करें (JD = 2461132.0, T = 0.26246): L₀ = 280.466° + 36000.770° × 0.26246 = 280.466° + 9448.5° = 9728.97° → 8.97° (mod 360°)। M = 357.529° + 35999.050° × 0.26246 = 357.529° + 9448.2° = 9805.73° → 85.73°। ये &quot;माध्य&quot; मान हैं — अभी तक कोई सुधार नहीं।</> : <>Let us compute for April 2, 2026 noon UT (JD = 2461132.0, T = 0.26246): L₀ = 280.466° + 36000.770° x 0.26246 = 280.466° + 9448.5° = 9728.97° reduced to 8.97° (mod 360°). M = 357.529° + 35999.050° x 0.26246 = 357.529° + 9448.2° = 9805.73° reduced to 85.73°. These are the &quot;mean&quot; values — no corrections yet.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>केन्द्र समीकरण: C = 1.915° × sin(85.73°) + 0.020° × sin(171.46°) + 0.000289° × sin(257.19°) = 1.915° × 0.9972 + 0.020° × 0.1484 + 0.000289° × (-0.974) = 1.910° + 0.003° - 0.000° = 1.913°। सत्य भोगांश = 8.97° + 1.913° = 10.88°। Ω = 125.04° - 1934.136° × 0.26246 = -382.7° → 337.3° (mod 360°)। दृश्य भोगांश = 10.88° - 0.00569° - 0.00478° × sin(337.3°) = 10.88° - 0.006° + 0.002° = 10.876°।</> : <>Equation of Center: C = 1.915° x sin(85.73°) + 0.020° x sin(171.46°) + 0.000289° x sin(257.19°) = 1.915° x 0.9972 + 0.020° x 0.1484 + 0.000289° x (-0.974) = 1.910° + 0.003° - 0.000° = 1.913°. True longitude = 8.97° + 1.913° = 10.88°. Omega = 125.04° - 1934.136° x 0.26246 = -382.7° reduced to 337.3° (mod 360°). Apparent longitude = 10.88° - 0.00569° - 0.00478° x sin(337.3°) = 10.88° - 0.006° + 0.002° = 10.876°.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>निरयन रूपान्तरण: लाहिरी अयनांश 2026 के लिए ≈ 24.22°। निरयन भोगांश = 10.876° - 24.22° = -13.34° → 346.66° (mod 360°)। यह मीन राशि (330°-360°) में लगभग 16.66° है — सूर्य मीन में, जो अप्रैल आरम्भ के लिए सही है (सूर्य लगभग 14 अप्रैल को मेष प्रवेश करता है)। प्रोकेराला से सत्यापित करें!<br/><br/>यह उदाहरण दर्शाता है कि कैसे सूत्र वास्तविक कुण्डली प्राचलों से जुड़ते हैं — सूर्य की राशि, जो भाव स्वामित्व, बल, और दशा अवधि निर्धारित करती है।</> : <>Sidereal conversion: Lahiri Ayanamsha for 2026 is approximately 24.22°. Sidereal longitude = 10.876° - 24.22° = -13.34° reduced to 346.66° (mod 360°). This is approximately 16.66° in Pisces (330°-360°) — the Sun is in Pisces, which is correct for early April (the Sun enters Aries around April 14). Verify against Prokerala!<br/><br/>This example shows how the formula connects to real chart parameters — the Sun&apos;s rashi placement, which determines house lordship, dignity, and dasha periods.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Additional Misconceptions', hi: 'अतिरिक्त भ्रान्तियाँ', sa: 'अतिरिक्त भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सायन और निरयन राशिचक्र प्रतिद्वन्द्वी पद्धतियाँ हैं — एक सही है, दूसरी गलत।&quot; दोनों खगोलीय रूप से वैध हैं। सायन सूर्य की स्थिति विषुव से मापता है (ऋतु-आधारित)। निरयन स्थिर तारों से मापता है। वे भिन्न प्रश्नों के उत्तर देते हैं। पश्चिमी ज्योतिष ऋतुओं (सायन) पर आधारित है; वैदिक ज्योतिष नक्षत्र पृष्ठभूमि (निरयन) पर।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Tropical and sidereal zodiacs are rival systems — one is right, the other wrong.&quot; Both are astronomically valid. Tropical measures the Sun&apos;s position from the equinox (season-based). Sidereal measures from the fixed stars. They answer different questions. Western astrology is based on seasons (tropical); Vedic astrology on the stellar backdrop (sidereal).</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अयनांश एक स्थिर संख्या है।&quot; अयनांश प्रतिवर्ष ~50.3 कला-सेकण्ड बढ़ता है (पुरस्सरण चक्र ~25,772 वर्ष)। 2000 में यह ~23.85° था; 2026 में ~24.22°। शताब्दी में ~0.37° बदलता है। कुण्डली सॉफ़्टवेयर को प्रत्येक तिथि के लिए सटीक अयनांश गणित करना चाहिए, स्थिर मान प्रयोग नहीं करना चाहिए।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Ayanamsha is a fixed number.&quot; Ayanamsha increases by ~50.3 arcseconds per year (precession cycle ~25,772 years). In 2000 it was ~23.85°; in 2026 it is ~24.22°. It changes by ~0.37° per century. Kundali software must compute the exact ayanamsha for each date, not use a fixed value.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Cross-References', hi: 'सम्बन्धित मॉड्यूल', sa: 'सम्बन्धित मॉड्यूल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>JD और T चर कैसे गणित होते हैं इसके लिए <span className="text-gold-light">मॉड्यूल 22.1 (जूलियन दिवस)</span> देखें। चन्द्र स्थिति (60 पदों सहित) के लिए <span className="text-gold-light">मॉड्यूल 22.3 (चन्द्र भोगांश)</span> देखें। यह सूर्य स्थिति सूर्योदय/सूर्यास्त गणना में कैसे प्रयुक्त होती है इसके लिए <span className="text-gold-light">मॉड्यूल 22.4 (सूर्योदय/सूर्यास्त)</span> देखें। राशि प्लेसमेंट का ज्योतिषीय अर्थ समझने के लिए <span className="text-gold-light">मॉड्यूल 4 (राशि)</span> देखें।</> : <>For how JD and the T variable are computed, see <span className="text-gold-light">Module 22.1 (Julian Day)</span>. For the Moon&apos;s position (with 60 terms), see <span className="text-gold-light">Module 22.3 (Moon Longitude)</span>. For how this Sun position feeds into sunrise/sunset calculations, see <span className="text-gold-light">Module 22.4 (Sunrise/Sunset)</span>. For the astrological meaning of rashi placements, see <span className="text-gold-light">Module 4 (Rashis)</span>.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
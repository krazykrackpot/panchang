'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-3.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_22_3', phase: 9, topic: 'Astronomy', moduleNumber: '22.3',
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
          'The Moon\'s orbit is so irregular that it requires 60+ sine correction terms to achieve 0.5-degree accuracy — 20x more complex than the Sun.',
          'The largest correction (the "evection") reaches 1.27 degrees and was known to Ptolemy — it arises from the Sun\'s gravitational pull on the Moon\'s orbit.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why the Moon Is the Hardest Object to Track', hi: 'चन्द्रमा सबसे कठिन पिण्ड क्यों है', sa: 'चन्द्रमा सबसे कठिन पिण्ड क्यों है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्य को 0.01 अंश सटीकता के लिए केवल 3 ज्या पद चाहिए। चन्द्रमा को 60 चाहिए। इतना नाटकीय अन्तर क्यों? तीन कारक मिलकर चन्द्र गति को असाधारण रूप से जटिल बनाते हैं। पहला, निकटता: चन्द्रमा 356,000 से 407,000 किमी पर कक्षा में है — इतना निकट कि लम्बन (पृथ्वी सतह पर प्रेक्षक के स्थान से दृश्य स्थिति में खिसकाव) लगभग 1 अंश तक पहुँचता है। दूसरा, गति: चन्द्रमा ~13.2 अंश प्रतिदिन तय करता है, 27.3 दिनों में पूर्ण कक्षा पूर्ण करता है। स्थिति में छोटी प्रतिशत त्रुटि समय में बड़ी त्रुटि बनती है। तीसरा और सबसे महत्त्वपूर्ण, सूर्य का गुरुत्वाकर्षण: सूर्य चन्द्रमा को पृथ्वी के तुल्य बल से खींचता है, जिससे भारी विक्षोभ उत्पन्न होते हैं जो सूर्य की दृश्य गति में विद्यमान ही नहीं हैं।</> : <>The Sun required just 3 sine terms for 0.01-degree accuracy. The Moon needs 60. Why such a dramatic difference? Three factors conspire to make lunar motion extraordinarily complex. First, proximity: the Moon orbits at 356,000 to 407,000 km — close enough that parallax (the shift in apparent position due to the observer&apos;s location on Earth&apos;s surface) reaches nearly 1 degree. Second, speed: the Moon covers ~13.2 degrees per day, completing a full orbit in 27.3 days. A small percentage error in position means a large error in time. Third and most importantly, the Sun&apos;s gravity: the Sun pulls on the Moon with a force comparable to Earth&apos;s, creating massive perturbations that simply don&apos;t exist for the Sun&apos;s apparent motion.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पाँच मूलभूत तर्क सभी चन्द्र स्थिति गणनाओं को चलाते हैं। L&apos; (चन्द्र माध्य भोगांश) ≈ 218.32° + 481267.88° × T — ध्यान दें दर सूर्य के 36000.77° से 13.2 गुना तेज़ है। D (माध्य दीर्घीकरण) = 297.85° + 445267.11° × T चन्द्रमा और सूर्य के बीच कोणीय पृथक्करण मापता है। M (सूर्य माध्य विलम्बिका) = 357.53° + 35999.05° × T — वही M जो सौर एल्गोरिदम में प्रयुक्त है। M&apos; (चन्द्र माध्य विलम्बिका) = 134.96° + 477198.87° × T चन्द्र दीर्घवृत्तीय कक्षा में स्थिति ट्रैक करता है। F (अक्षांश तर्क) = 93.27° + 483202.02° × T चन्द्रमा की कक्षीय आरोही पात से दूरी मापता है।</> : <>Five fundamental arguments drive all Moon position calculations. L&apos; (Moon&apos;s mean longitude) ≈ 218.32° + 481267.88° x T — note the rate is 13.2x faster than the Sun&apos;s 36000.77°. D (mean elongation) = 297.85° + 445267.11° x T measures the angular separation between the Moon and Sun. M (Sun&apos;s mean anomaly) = 357.53° + 35999.05° x T — the same M used in the solar algorithm. M&apos; (Moon&apos;s mean anomaly) = 134.96° + 477198.87° x T tracks position in the Moon&apos;s elliptical orbit. F (argument of latitude) = 93.27° + 483202.02° x T measures the Moon&apos;s distance from its orbital ascending node.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ये पाँच तर्क एक-दूसरे से स्वतन्त्र नहीं हैं — वे जटिल तरीकों से संयोजित होते हैं। उदाहरण के लिए, उपवर्तन पद 2D - M&apos; का उपयोग करता है, जो दीर्घीकरण और चन्द्र विलम्बिका दोनों पर निर्भर है। यह बहुआयामी अन्तर्निर्भरता ही है जो इतने अधिक ज्या पदों की आवश्यकता बनाती है — प्रत्येक पद तर्कों के एक विशिष्ट संयोजन को दर्शाता है।</> : <>These five arguments are not independent of each other — they combine in complex ways. For example, the evection term uses 2D - M&apos;, which depends on both the elongation and the lunar anomaly. It is this multi-dimensional interdependence that necessitates so many sine terms — each term captures a specific combination of arguments that describes a distinct physical perturbation.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Historical Context', hi: 'ऐतिहासिक सन्दर्भ', sa: 'ऐतिहासिक सन्दर्भ' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>चन्द्र गति की समस्या ने शताब्दियों तक मानवता के सर्वश्रेष्ठ गणितज्ञों को चुनौती दी। हिप्पार्कोस (दूसरी शताब्दी ई.पू.) ने मुख्य असमता खोजी। टॉलेमी (दूसरी शताब्दी ई.) ने उपवर्तन जोड़ा। टाइको ब्राहे (16वीं शताब्दी) ने विचरण खोजा। न्यूटन ने स्वयं कहा कि चन्द्र गति की समस्या ही एकमात्र ऐसी समस्या थी जिसने उन्हें सिरदर्द दिया। भारत में, आर्यभट्ट (5वीं शताब्दी) ने अपने आर्यभटीय में चन्द्र विसंगतियों को महाज्या सारणियों से सुधारा, जो एक स्वतन्त्र किन्तु समान्तर दृष्टिकोण था।</> : <>The problem of lunar motion challenged humanity&apos;s best mathematicians for centuries. Hipparchus (2nd century BCE) discovered the main inequality. Ptolemy (2nd century CE) added the evection. Tycho Brahe (16th century) discovered the variation. Newton himself said the lunar motion problem was the only one that ever gave him a headache. In India, Aryabhata (5th century CE) corrected lunar anomalies using his Mahajya (great sine) tables in the Aryabhatiya, an independent but parallel approach.</>}</p>
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
          {tl({ en: 'Meeus Table 47.A — The 60 Sine Terms', hi: 'मीयस सारणी 47.A — 60 ज्या पद', sa: 'मीयस सारणी 47.A — 60 ज्या पद' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सारणी 47.A के 60 पदों में से प्रत्येक का रूप है: ΔL = गुणांक × sin(a × D + b × M + c × M&apos; + d × F), जहाँ a, b, c, d छोटे पूर्णांक (सामान्यतः -2 से +4) हैं और गुणांक कला-सेकण्ड में है। सबसे बड़े पद एक भौतिक कथा कहते हैं। प्रथम पद, +6.289° × sin(M&apos;), &quot;मुख्य असमता&quot; है — चन्द्र दीर्घवृत्तीय कक्षा का केन्द्र समीकरण। जैसे सूर्य के पास 1.915° × sin(M) है, चन्द्रमा के पास 6.289° × sin(M&apos;) है — 3.3 गुना बड़ा क्योंकि चन्द्र कक्षा उत्केन्द्रता (0.055) पृथ्वी की (0.017) से 3.2 गुना अधिक है।</> : <>Each of the 60 terms in Table 47.A has the form: ΔL = coefficient x sin(a x D + b x M + c x M&apos; + d x F), where a, b, c, d are small integers (typically -2 to +4) and the coefficient is in arc-seconds. The largest terms tell a physical story. The first term, +6.289° x sin(M&apos;), is the &quot;main inequality&quot; — the equation of center for the Moon&apos;s elliptical orbit. Just as the Sun has 1.915° x sin(M), the Moon has 6.289° x sin(M&apos;) — 3.3 times larger because the Moon&apos;s orbital eccentricity (0.055) is 3.2 times greater than Earth&apos;s (0.017).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दूसरा पद, +1.274° × sin(2D - M&apos;), &quot;उपवर्तन&quot; (इवेक्शन) है — टॉलेमी द्वारा लगभग 150 ई. में खोजा गया। यह सूर्य का गुरुत्वाकर्षण विक्षोभ है जो चन्द्र कक्षा उत्केन्द्रता को नियन्त्रित करता है। तीसरा पद, +0.658° × sin(2D), &quot;विचरण&quot; (वेरिएशन) है — टाइको ब्राहे ने 1590 में खोजा। इससे अमावस्या और पूर्णिमा पर चन्द्रमा तेज़ और अष्टमी पर धीमा चलता है। ये तीन पद अकेले लगभग 8.2° सुधार करते हैं, किन्तु शेष 57 पद संचयी रूप से ~2° और योगदान करते हैं, इसलिए उप-अंश सटीकता हेतु सभी 60 आवश्यक हैं।</> : <>The second term, +1.274° x sin(2D - M&apos;), is &quot;evection&quot; — discovered by Ptolemy around 150 CE. This is the Sun&apos;s gravitational perturbation modulating the Moon&apos;s orbital eccentricity. The third term, +0.658° x sin(2D), is the &quot;variation&quot; — discovered by Tycho Brahe in 1590. It causes the Moon to speed up at new and full moon and slow down at the quarters. These three terms alone account for about 8.2° of correction, but the remaining 57 terms contribute another ~2° cumulatively, which is why all 60 are needed for sub-degree accuracy.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Eccentricity Correction', hi: 'उत्केन्द्रता सुधार', sa: 'उत्केन्द्रता सुधार' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>एक सूक्ष्म किन्तु महत्त्वपूर्ण विवरण: सूर्य की माध्य विलम्बिका M वाले पदों को पृथ्वी की कक्षीय उत्केन्द्रता की धीमी कमी हेतु सुधारित करना चाहिए। गुणक E = 1 - 0.002516 × T - 0.0000074 × T² लागू होता है: M वाले पद E से गुणित, 2M वाले E² से। हमारे वर्तमान युगारम्भ (T ≈ 0.26) के लिए E ≈ 0.9993 — एक छोटा सुधार, किन्तु यह शताब्दियों में संचित होता है और एल्गोरिदम को ऐतिहासिक और भविष्य की तिथियों के लिए सटीक बनाए रखता है।</> : <>A subtle but important detail: terms involving the Sun&apos;s mean anomaly M must be corrected for the slow decrease in Earth&apos;s orbital eccentricity. The factor E = 1 - 0.002516 x T - 0.0000074 x T² is applied: terms with M are multiplied by E, terms with 2M by E². For our current epoch (T ≈ 0.26), E ≈ 0.9993 — a tiny correction, but it accumulates over centuries and ensures the algorithm remains accurate for historical and future dates.</>}</p>
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
          {tl({ en: 'Latitude, Distance, and Accuracy', hi: 'अक्षांश, दूरी और सटीकता', sa: 'अक्षांश, दूरी और सटीकता' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्र अक्षांश (क्रान्तिवृत्त के ऊपर या नीचे कोणीय दूरी) मीयस सारणी 47.B से उन्हीं D, M, M&apos;, F तर्कों वाले 13 ज्या पदों द्वारा गणित होता है। चन्द्र कक्षा क्रान्तिवृत्त से ~5.14° झुकी है, अतः इसका अक्षांश ±5.3° (विक्षोभ सहित) तक झूलता है। अक्षांश दो व्यावहारिक कारणों से महत्त्वपूर्ण है: यह चन्द्रोदय समय प्रभावित करता है (+5° अक्षांश पर चन्द्रमा उत्तरी अक्षांशों पर पहले उदित होता है) और यह निर्धारित करता है कि अमावस्या/पूर्णिमा ग्रहण उत्पन्न करेगी (ग्रहण तभी होते हैं जब चन्द्रमा क्रान्तिवृत्त के अत्यन्त निकट हो, अर्थात पात के निकट जहाँ F ≈ 0° या 180°)।</> : <>The Moon&apos;s latitude (angular distance above or below the ecliptic) is computed from Meeus Table 47.B using 13 sine terms with the same D, M, M&apos;, F arguments. The Moon&apos;s orbit is tilted ~5.14° to the ecliptic, so its latitude swings up to ±5.3° (including perturbations). Latitude matters for two practical reasons: it affects moonrise timing (a Moon at +5° latitude rises earlier at northern latitudes) and it determines whether a new/full moon produces an eclipse (eclipses occur only when the Moon is very close to the ecliptic, i.e., near a node where F ≈ 0° or 180°).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्र दूरी सारणी 47.A के 14 कोज्या पदों से गणित होती है। माध्य दूरी 385,001 किमी है, किन्तु यह लगभग 356,000 किमी (उपभू) से 407,000 किमी (अपभू) तक भिन्न होती है। दूरी से हम क्षैतिज लम्बन प्राप्त करते हैं: sin(HP) = 6378.14 / दूरी, जहाँ 6378.14 किमी पृथ्वी की विषुवतीय त्रिज्या है। HP लगभग 54&apos; (अपभू) से 61&apos; (उपभू) तक होता है। यह लगभग 1 अंश का लम्बन चन्द्रोदय गणनाओं के लिए अत्यन्त महत्त्वपूर्ण है — इसका अर्थ है कि सतह से चन्द्रमा की प्रेक्षित स्थिति सैद्धान्तिक भूकेन्द्रीय स्थिति से महत्त्वपूर्ण रूप से भिन्न होती है।</> : <>The Moon&apos;s distance is computed from 14 cosine terms in Table 47.A. The mean distance is 385,001 km, but it varies from about 356,000 km (perigee) to 407,000 km (apogee). From the distance we derive the horizontal parallax: sin(HP) = 6378.14 / distance, where 6378.14 km is Earth&apos;s equatorial radius. HP ranges from about 54&apos; (apogee) to 61&apos; (perigee). This nearly 1-degree parallax is critical for moonrise calculations — it means the Moon&apos;s observed position from the surface differs significantly from the theoretical geocentric position.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Accuracy Limits', hi: 'सटीकता सीमाएँ', sa: 'सटीकता सीमाएँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">हमारे इंजन की सटीकता:</span> भोगांश में ~0.3° (लगभग 10 कला)। चन्द्रमा ~13.2°/दिन चलता है, अतः 0.3° त्रुटि गोचर भविष्यवाणियों के लिए लगभग 30 मिनट समय में बदलती है। यह निर्धारित करने के लिए पर्याप्त है कि सूर्योदय पर कौन-सा नक्षत्र, तिथि या योग सक्रिय है, किन्तु इसका अर्थ है कि हमारी तिथि संक्रमण समय उच्च-सटीकता एफेमेरिस से ~30 मिनट तक भिन्न हो सकते हैं।</> : <><span className="text-gold-light font-medium">Our engine&apos;s accuracy:</span> ~0.3° in longitude (about 10 arcminutes). Since the Moon moves ~13.2°/day, a 0.3° error translates to about 30 minutes of time for transit predictions. This is sufficient for determining which Nakshatra, Tithi, or Yoga is active at sunrise, but it means our tithi transition times may be off by up to ~30 minutes from high-precision ephemerides.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा moonLongitude(jd) फ़ंक्शन सारणी 47.A के सभी 60 ज्या पद लागू करता है, उत्केन्द्रता सुधार E गणित करता है, और चन्द्रमा का भूकेन्द्रीय सायन भोगांश लौटाता है। यह प्रत्येक पंचांग तत्व के लिए बुलाया जाता है जो चन्द्रमा पर निर्भर है: तिथि (चन्द्र-सूर्य कोण), नक्षत्र (चन्द्र निरयन स्थिति), योग (सूर्य+चन्द्र योग), करण (अर्ध-तिथि), और चन्द्रोदय/चन्द्रास्त समय। 60-पद गणना आधुनिक हार्डवेयर पर माइक्रोसेकण्ड में चलती है — मीयस ने शताब्दियों के चन्द्र सिद्धान्त को कितनी कुशलता से संक्षिप्त एल्गोरिदम में संकलित किया, इसका प्रमाण।</> : <>Our moonLongitude(jd) function implements all 60 sine terms from Table 47.A, computes the eccentricity correction E, and returns the Moon&apos;s geocentric tropical longitude. This is called for every Panchang element that depends on the Moon: Tithi (Moon-Sun angle), Nakshatra (Moon&apos;s sidereal position), Yoga (Sun+Moon sum), Karana (half-tithi), and moonrise/moonset timing. The 60-term computation runs in microseconds on modern hardware — a testament to how efficiently Meeus distilled centuries of lunar theory into a compact algorithm.</>}</p>
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
          {tl({ en: 'Worked Example: Computing the Moon\'s Longitude', hi: 'कार्यान्वित उदाहरण: चन्द्र भोगांश गणना', sa: 'कार्यान्वित उदाहरण: चन्द्र भोगांश गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>2 अप्रैल, 2026, मध्याह्न UT के लिए (JD = 2461132.0, T = 0.26246): चरण 1 — पाँच तर्क गणित करें: L&apos; = 218.32 + 481267.88 × 0.26246 = 126501.6° → 261.6° (mod 360)। D = 297.85 + 445267.11 × 0.26246 → 268.3°। M = 357.53 + 35999.05 × 0.26246 → 88.3°। M&apos; = 134.96 + 477198.87 × 0.26246 → 336.0°। F = 93.27 + 483202.02 × 0.26246 → 335.8°। चरण 2 — तीन प्रमुख पद गणित करें: मुख्य असमता: +6.289° × sin(336°) = +6.289 × (-0.407) = -2.56°। उपवर्तन: +1.274° × sin(2×268.3° - 336°) = +1.274 × sin(200.6°) = -0.45°। विचरण: +0.658° × sin(2×268.3°) = +0.658 × sin(176.6°) = +0.04°।</> : <>For April 2, 2026, noon UT (JD = 2461132.0, T = 0.26246): Step 1 — Compute the five arguments: L&apos; = 218.32 + 481267.88 x 0.26246 = 126501.6° reduced to 261.6° (mod 360). D = 297.85 + 445267.11 x 0.26246 reduced to 268.3°. M = 357.53 + 35999.05 x 0.26246 reduced to 88.3°. M&apos; = 134.96 + 477198.87 x 0.26246 reduced to 336.0°. F = 93.27 + 483202.02 x 0.26246 reduced to 335.8°. Step 2 — Compute the three largest terms: Main inequality: +6.289° x sin(336°) = +6.289 x (-0.407) = -2.56°. Evection: +1.274° x sin(2 x 268.3° - 336°) = +1.274 x sin(200.6°) = -0.45°. Variation: +0.658° x sin(2 x 268.3°) = +0.658 x sin(176.6°) = +0.04°.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चरण 3 — शेष 57 पद जोड़ें (हमारा कोड सभी 60 गणित करता है, किन्तु यहाँ हम सारांश देते हैं): शेष पदों का कुल योगदान ≈ -0.38°। अन्तिम सायन भोगांश: 261.6° + (-2.56°) + (-0.45°) + 0.04° + (-0.38°) + नटेशन ≈ 258.2°। निरयन भोगांश (लाहिरी अयनांश 24.22° घटाकर): 258.2° - 24.22° = 234.0° = धनु राशि में लगभग 24°। यह चन्द्रमा को मूल नक्षत्र (240°-253.33°) के निकट रखता है — आप इसे प्रोकेराला से सत्यापित कर सकते हैं।</> : <>Step 3 — Add the remaining 57 terms (our code computes all 60, but here we summarize): the remaining terms contribute approximately -0.38° total. Final tropical longitude: 261.6° + (-2.56°) + (-0.45°) + 0.04° + (-0.38°) + nutation ≈ 258.2°. Sidereal longitude (subtracting Lahiri Ayanamsha of 24.22°): 258.2° - 24.22° = 234.0° = approximately 24° in Sagittarius. This places the Moon near Mula nakshatra (240°-253.33°) — you can verify this against Prokerala for the same date.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चन्द्रमा की कक्षा एक साधारण दीर्घवृत्त है, जैसे ग्रहों की।&quot; वास्तव में, सूर्य के विक्षोभ चन्द्र कक्षा को निरन्तर विकृत करते हैं। कक्षा का आकार, झुकाव, और अभिमुखता सभी बदलते रहते हैं। एक क्षण भी ऐसा नहीं जब चन्द्रमा &quot;सच्चे&quot; दीर्घवृत्त पर हो — यह सदैव एक अनुमान है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The Moon&apos;s orbit is a simple ellipse, like the planets.&quot; In reality, the Sun&apos;s perturbations continuously distort the lunar orbit. The shape, tilt, and orientation of the orbit all change constantly. At no instant is the Moon on a &quot;true&quot; ellipse — the ellipse is always an approximation.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span> {isHi ? <>&quot;60 पद अत्यधिक हैं — निश्चित रूप से 10-15 पर्याप्त हैं।&quot; शीर्ष 6 पद ~9° सुधारते हैं, किन्तु शेष 54 ~1.2° और जोड़ते हैं। पंचांग गणनाओं के लिए जहाँ तिथि सीमा (12°) मिनटों में बदलती है, 1.2° त्रुटि तिथि को ~2 घण्टे गलत कर देगी — अस्वीकार्य।</> : <>&quot;60 terms are overkill — surely 10-15 would suffice.&quot; The top 6 terms correct ~9°, but the remaining 54 add another ~1.2°. For Panchang calculations where tithi boundaries (12°) shift by minutes, a 1.2° error would make the tithi wrong by ~2 hours — unacceptable.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span> {isHi ? <>&quot;प्राचीन भारतीय खगोलविदों ने इन सभी सुधारों को नहीं जाना।&quot; आर्यभट्ट, ब्रह्मगुप्त और भास्कर II ने चन्द्र विसंगतियों के लिए परिष्कृत सुधार विकसित किए। भारतीय &quot;मन्दफल&quot; और &quot;शीघ्रफल&quot; सुधार मीयस के ज्या पदों के कार्यात्मक समकक्ष हैं, यद्यपि भिन्न गणितीय ढाँचे में व्यक्त।</> : <>&quot;Ancient Indian astronomers didn&apos;t know about all these corrections.&quot; Aryabhata, Brahmagupta, and Bhaskara II developed sophisticated corrections for lunar anomalies. The Indian &quot;mandaphala&quot; and &quot;shigraphala&quot; corrections are functionally equivalent to Meeus&apos;s sine terms, though expressed in a different mathematical framework.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Practical Application for Chart Interpretation', hi: 'कुण्डली व्याख्या में व्यावहारिक अनुप्रयोग', sa: 'कुण्डली व्याख्या में व्यावहारिक अनुप्रयोग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्र भोगांश की सटीकता सीधे कुण्डली व्याख्या को प्रभावित करती है। 0.5° त्रुटि नक्षत्र पाद बदल सकती है, जो बदले में विंशोत्तरी दशा प्रारम्भिक ग्रह बदलती है। जन्म नक्षत्र सीमा के निकट जन्म लेने वाले जातकों के लिए, 0.3° (हमारी सटीकता सीमा) का अर्थ है कि हम कभी-कभी गलत नक्षत्र रिपोर्ट कर सकते हैं। इसलिए हम जन्म समय में 5 मिनट का परिवर्तन करके दोनों सम्भावनाओं की जाँच करने की सलाह देते हैं। स्विस एफेमेरिस (~0.001° सटीकता) इस अनिश्चितता को दूर करती है, यही कारण है कि व्यावसायिक ज्योतिष सॉफ़्टवेयर इसे चुनता है।</> : <>The accuracy of the Moon&apos;s longitude directly impacts chart interpretation. A 0.5° error can change the nakshatra pada, which in turn changes the Vimshottari dasha starting planet. For natives born near a nakshatra boundary, our 0.3° accuracy limit means we may occasionally report the wrong nakshatra. This is why we recommend testing both possibilities by shifting birth time by 5 minutes. Swiss Ephemeris (~0.001° accuracy) eliminates this uncertainty, which is why professional astrology software prefers it.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>चन्द्र दूरी की गणना (14 कोज्या पदों से) भी ज्योतिषीय रूप से सार्थक है। उपभू पर जन्मा चन्द्रमा (&quot;सुपरमून&quot;) को कुछ परम्पराएँ अधिक शक्तिशाली मानती हैं — चन्द्रमा की भावनात्मक और मानसिक ऊर्जा तीव्र होती है। हमारा इंजन चन्द्र दूरी की गणना करता है और इसे कुण्डली परिणामों में उपलब्ध कराता है, जिससे इस सूक्ष्म व्याख्यात्मक स्तर का समर्थन होता है।</> : <>The Moon&apos;s distance calculation (from the 14 cosine terms) is also astrologically meaningful. A Moon born at perigee (&quot;supermoon&quot;) is considered more powerful in some traditions — the Moon&apos;s emotional and psychic energy is intensified. Our engine computes the lunar distance and makes it available in the Kundali results, supporting this nuanced interpretive layer.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}
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

export default function Module22_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
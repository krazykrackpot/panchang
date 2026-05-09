'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-5.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_22_5', phase: 9, topic: 'Astronomy', moduleNumber: '22.5',
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
          'Moonrise is harder than sunrise because the Moon\'s parallax is large (up to 1 degree) and it moves significantly during the calculation.',
          'A binary search algorithm is needed to find moonrise because the Moon\'s rapid motion means simple hour-angle formulas can miss by 30+ minutes.',
          'Some calendar days have no moonrise at all — because the Moon rises ~50 minutes later each day, occasionally skipping a full calendar date.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why Moonrise Is Harder Than Sunrise', hi: 'चन्द्रोदय सूर्योदय से कठिन क्यों है', sa: 'चन्द्रोदय सूर्योदय से कठिन क्यों है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय के लिए हमने एक सुन्दर घण्टा-कोण सूत्र उपयोग किया जो मानता है कि उदय घटना के दौरान सूर्य की स्थिति मूलतः स्थिर है। सूर्य प्रतिदिन केवल ~1° चलता है, अतः मध्याह्न और सूर्योदय के बीच ~6 घण्टों में इसकी क्रान्ति और विषुवांश मुश्किल से बदलते हैं। चन्द्रमा इस धारणा को तोड़ता है। ~13.2° प्रतिदिन चलने का अर्थ है कि चन्द्रमा एक घण्टे में ~0.5° खिसकता है — उन अपवर्तन और लम्बन सुधारों के तुल्य जो हम लगाने का प्रयास कर रहे हैं। एक &quot;स्नैपशॉट&quot; स्थिति से चन्द्रोदय गणित करने वाला विश्लेषणात्मक सूत्र 10-30 मिनट गलत होगा।</> : <>For sunrise, we used an elegant hour-angle formula that assumes the Sun&apos;s position is essentially fixed during the rise event. The Sun moves only ~1° per day, so its declination and right ascension barely change in the ~6 hours between noon and sunrise. The Moon shatters this assumption. Moving ~13.2° per day means the Moon shifts ~0.5° in a single hour — comparable to the refraction and parallax corrections we&apos;re trying to apply. An analytical formula that computes moonrise from a &quot;snapshot&quot; position would be off by 10-30 minutes.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>तीन कारक मिलकर चन्द्रोदय को विशेष रूप से कठिन बनाते हैं: (1) <span className="text-gold-light font-medium">तीव्र गति:</span> चन्द्रमा 27.3 दिनों में पूर्ण कक्षा पूर्ण करता है, सूर्य के 365.25 दिनों की तुलना में — 13.4 गुना तेज़। (2) <span className="text-gold-light font-medium">बड़ा लम्बन:</span> चन्द्रमा पृथ्वी से इतना निकट है कि प्रेक्षक की सतही स्थिति दृश्य चन्द्र स्थिति को ~1° तक खिसकाती है — सूर्य के 0.0025° लम्बन का 400 गुना। (3) <span className="text-gold-light font-medium">परिवर्तनशील अर्ध-व्यास:</span> चन्द्र दीर्घवृत्तीय कक्षा के कारण इसका दृश्य आकार 14.7&apos; (अपभू) से 16.7&apos; (उपभू) तक भिन्न होता है, जो उदय सीमा को भी प्रभावित करता है।</> : <>Three factors conspire to make moonrise especially difficult: (1) <span className="text-gold-light font-medium">Rapid motion:</span> the Moon completes a full orbit in 27.3 days versus the Sun&apos;s 365.25 — 13.4 times faster. (2) <span className="text-gold-light font-medium">Large parallax:</span> the Moon is close enough to Earth that the observer&apos;s surface position shifts the apparent Moon position by up to ~1° — 400 times larger than the Sun&apos;s 0.0025° parallax. (3) <span className="text-gold-light font-medium">Variable semi-diameter:</span> the Moon&apos;s elliptical orbit causes its apparent size to vary from 14.7&apos; (apogee) to 16.7&apos; (perigee), which also affects the rise threshold.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Iterative Scanning Approach', hi: 'पुनरावृत्तीय अन्वेषण दृष्टिकोण', sa: 'पुनरावृत्तीय अन्वेषण दृष्टिकोण' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>हमारा दृष्टिकोण: 24 घण्टों में प्रत्येक 5 मिनट पर क्षितिज से चन्द्र ऊँचाई गणित करें। प्रत्येक चरण पर, पूर्ण 60-पद मीयस एल्गोरिदम से चन्द्र भूकेन्द्रीय स्थिति (भोगांश, अक्षांश, दूरी) गणित करें, क्षैतिज निर्देशांकों (दिगंश और ऊँचाई) में बदलें, और फिर स्थलकेन्द्रीय लम्बन सुधार लगाएँ। जब दो क्रमागत बिन्दु मिलें जहाँ ऊँचाई ऋणात्मक से धनात्मक बदलती है, तो चन्द्रोदय 5-मिनट खिड़की में कोष्ठकित हो गई।</> : <>Our approach: compute the Moon&apos;s altitude above the horizon every 5 minutes for 24 hours. At each step, we calculate the Moon&apos;s geocentric position (longitude, latitude, distance) using the full 60-term Meeus algorithm, convert to horizontal coordinates (azimuth and altitude), and then apply the topocentric parallax correction. When we find two consecutive points where the altitude changes from negative to positive, we have bracketed the moonrise event in a 5-minute window.</>}</p>
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
          {tl({ en: 'Topocentric Correction — Why Parallax Matters', hi: 'स्थलकेन्द्रीय सुधार — लम्बन क्यों महत्त्वपूर्ण है', sa: 'स्थलकेन्द्रीय सुधार — लम्बन क्यों महत्त्वपूर्ण है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्रमा एकमात्र ऐसा आकाशीय पिण्ड है जो पृथ्वी से इतना निकट है कि लम्बन महत्त्वपूर्ण अन्तर डालता है। सूर्य का लम्बन केवल 8.8 कला-सेकण्ड (नगण्य) है। चन्द्रमा का क्षैतिज लम्बन 54&apos; से 61&apos; तक — लगभग 1 अंश! क्षितिज पर (जहाँ ऊँचाई 0° के निकट), लम्बन सुधार अधिकतम है: alt_topo = alt_geo - HP × cos(alt)। cos(0°) = 1 होने से, पूर्ण HP मान क्षितिज पर ज्यामितीय ऊँचाई से घटाया जाता है।</> : <>The Moon is the one celestial object close enough to Earth that parallax makes a significant difference. The Sun&apos;s parallax is only 8.8 arcseconds (negligible). The Moon&apos;s horizontal parallax ranges from 54&apos; to 61&apos; — nearly 1 degree! At the horizon (where altitude is close to 0°), the parallax correction is at its maximum: alt_topo = alt_geo - HP x cos(alt). Since cos(0°) = 1, the full HP value is subtracted from the geometric altitude at the horizon.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>HP स्वयं चन्द्र दूरी से गणित होता है: sin(HP) = 6378.14 / दूरी। उपभू (~356,000 किमी) पर HP ≈ 61&apos; (चन्द्रमा बड़ा दिखता है — यही &quot;सुपरमून&quot; का समय है)। अपभू (~407,000 किमी) पर HP ≈ 54&apos;। लम्बन में यह 7 कला भिन्नता उपभू और अपभू के बीच चन्द्रोदय समय को कई मिनट खिसकाती है।</> : <>The HP itself is computed from the Moon&apos;s distance: sin(HP) = 6378.14 / distance. At perigee (~356,000 km), HP ≈ 61&apos; (the Moon appears larger — &quot;supermoons&quot;). At apogee (~407,000 km), HP ≈ 54&apos;. This 7-arcminute variation in parallax shifts moonrise times by several minutes between perigee and apogee.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Rise Threshold', hi: 'उदय सीमा', sa: 'उदय सीमा' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>चन्द्रोदय सीमा h₀ ≈ -0.3°। यह सूर्य के -0.8333° से भिन्न है क्योंकि चन्द्र अर्ध-व्यास (~16&apos;) और वायुमण्डलीय अपवर्तन (~34&apos;) आंशिक रूप से एक-दूसरे को सन्तुलित करते हैं, और बड़ा लम्बन सुधार स्थलकेन्द्रीय रूपान्तरण में अलग से संभाला जाता है।</> : <>The moonrise threshold h₀ ≈ -0.3°. This differs from the Sun&apos;s -0.8333° because the Moon&apos;s semi-diameter (~16&apos;) and atmospheric refraction (~34&apos;) partially cancel, and the large parallax correction is handled separately in the topocentric conversion.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Tropical vs Sidereal Considerations', hi: 'सायन बनाम निरयन विचार', sa: 'सायन बनाम निरयन विचार' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रोदय गणना सायन (tropical) प्रणाली में की जाती है — क्योंकि क्षैतिज निर्देशांक (ऊँचाई और दिगंश) विषुवतीय प्रणाली पर आधारित हैं, न कि राशि चक्र पर। निरयन-सायन अन्तर (अयनांश ~24°) केवल तब प्रासंगिक होता है जब हम पूछते हैं &quot;चन्द्रोदय पर चन्द्रमा किस नक्षत्र में है?&quot; — मूल चन्द्रोदय समय गणना अयनांश से स्वतन्त्र है। यह भ्रान्ति का एक सामान्य स्रोत है: लोग सोचते हैं कि लाहिरी या कृष्णमूर्ति अयनांश चन्द्रोदय समय बदलता है — ऐसा नहीं है।</> : <>Moonrise calculations are performed in the tropical (sayana) system — because horizontal coordinates (altitude and azimuth) are based on the equatorial system, not the zodiac. The sidereal-tropical difference (ayanamsha ~24°) only becomes relevant when we ask &quot;which nakshatra is the Moon in at moonrise?&quot; — the core moonrise time calculation is independent of ayanamsha. This is a common source of confusion: people think Lahiri or Krishnamurti ayanamsha changes moonrise times — it does not.</>}</p>
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
          {tl({ en: 'Binary Search Refinement', hi: 'द्विआधारी खोज शोधन', sa: 'द्विआधारी खोज शोधन' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>5-मिनट अन्वेषण से कोष्ठक मिलने पर (मान लें मिनट 420 पर ऊँचाई -0.5° और मिनट 425 पर +0.3°), द्विआधारी खोज करते हैं। मध्यबिन्दु मिनट 422.5 है। उस क्षण चन्द्र स्थलकेन्द्रीय ऊँचाई गणित करते हैं। ऋणात्मक हो तो उदय 422.5 और 425 के बीच। धनात्मक हो तो 420 और 422.5 के बीच। 15 पुनरावृत्तियों के बाद, कोष्ठक चौड़ाई 5 मिनट / 2^15 = 0.009 सेकण्ड — आवश्यकता से बहुत अधिक सटीकता।</> : <>Once the 5-minute scan finds a bracket (say, at minute 420 the altitude is -0.5° and at minute 425 it is +0.3°), we perform binary search. The midpoint is minute 422.5. We compute the Moon&apos;s topocentric altitude at that instant. If negative, the rise is between 422.5 and 425. If positive, between 420 and 422.5. After 15 iterations, the bracket width is 5 minutes / 2^15 = 0.009 seconds — far more precision than needed.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>परिणाम को स्थानीय समय में बदलना: द्विआधारी खोज हमें आंशिक सटीकता वाला जूलियन दिवस देती है। UT घण्टे (JD_fractional - 0.5) × 24 के रूप में निकालते हैं, फिर प्रेक्षक के स्थान का समयक्षेत्र ऑफ़सेट जोड़ते हैं। हमारा परिणाम: अधिकांश तिथियों और स्थानों पर प्रमुख पंचांग स्रोतों से 2 मिनट के भीतर।</> : <>Converting the result to local time: the binary search gives us a Julian Day with fractional precision. We extract the UT hours as (JD_fractional - 0.5) x 24, then add the timezone offset for the observer&apos;s location. Our result: within 2 minutes of reference panchang sources for most dates and locations.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Edge Cases — No-Moonrise Days', hi: 'विशेष स्थितियाँ — चन्द्रोदय-रहित दिन', sa: 'विशेष स्थितियाँ — चन्द्रोदय-रहित दिन' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चन्द्रोदय नहीं (Skip Days):</span> चन्द्रमा प्रतिदिन ~50 मिनट देर से उदित होने से, कभी-कभी ऐसी तिथि आती है जब चन्द्रोदय एक दिन मध्यरात्रि से ठीक पहले और अगला अगले दिन मध्यरात्रि के बाद आता है। यह लगभग हर 29 दिनों में एक बार होता है — प्रत्येक चन्द्र मास में एक &quot;skip day&quot;। हमारा स्कैनर 24-घण्टे अन्वेषण में ऋणात्मक-से-धनात्मक क्रॉसिंग न मिलने पर &quot;चन्द्रोदय नहीं&quot; सही रूप से प्रतिवेदित करता है।</> : <><span className="text-gold-light font-medium">No moonrise (Skip Days):</span> Because the Moon rises ~50 minutes later each day, there are occasional dates when moonrise falls just before midnight one day and after midnight the next, leaving one calendar date with no moonrise. This happens roughly once every 29 days — one &quot;skip day&quot; per lunar month. Our scanner correctly handles this by reporting &quot;no moonrise&quot; when the 24-hour scan finds no negative-to-positive crossing.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">दो चन्द्रोदय:</span> विलोम भी सम्भव है — एक ही कैलेण्डर तिथि पर दो चन्द्रोदय (एक मध्यरात्रि के तुरन्त बाद, एक मध्यरात्रि से ठीक पहले)। हमारा स्कैनर सभी क्रॉसिंग रिकॉर्ड करता है, अतः यह दुर्लभ स्थिति भी सही ढंग से संभाली जाती है।</> : <><span className="text-gold-light font-medium">Two moonrises:</span> The converse is also possible — two moonrises on the same calendar date (one just after midnight, one just before midnight). Our scanner records all crossings, so this rare case is also handled correctly.</>}</p>
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
          {tl({ en: 'Worked Example: Moonrise in Corseaux', hi: 'कार्यान्वित उदाहरण: कोर्सो में चन्द्रोदय', sa: 'कार्यान्वित उदाहरण: कोर्सो में चन्द्रोदय' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>2 अप्रैल, 2026 को कोर्सो, स्विट्ज़रलैण्ड (46.47°N, 6.80°E) के लिए चन्द्रोदय गणित करें। चरण 1: मध्यरात्रि UT से प्रत्येक 5 मिनट पर चन्द्र स्थलकेन्द्रीय ऊँचाई गणित करें। चरण 2: मान लें मिनट 700 (11:40 UT) पर ऊँचाई = -1.2° और मिनट 705 (11:45 UT) पर +0.3°। चन्द्रोदय इस खिड़की में है। चरण 3: द्विआधारी खोज — मध्यबिन्दु 702.5 पर ऊँचाई = -0.4°, अतः उदय 702.5 और 705 के बीच। 15 पुनरावृत्तियों बाद: मिनट ≈ 703.1, अर्थात 11:43 UT = 13:43 CEST।</> : <>Compute moonrise for April 2, 2026 at Corseaux, Switzerland (46.47°N, 6.80°E). Step 1: Compute the Moon&apos;s topocentric altitude every 5 minutes from midnight UT. Step 2: Suppose at minute 700 (11:40 UT) the altitude is -1.2° and at minute 705 (11:45 UT) it is +0.3°. The moonrise is within this window. Step 3: Binary search — midpoint at 702.5 gives altitude -0.4°, so the rise is between 702.5 and 705. After 15 iterations: minute ≈ 703.1, meaning 11:43 UT = 13:43 CEST.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>इस प्रक्रिया में हमने 60-पद चन्द्र स्थिति ~303 बार गणित की। कुल: लगभग 18,000 ज्या मूल्यांकन। फिर भी आधुनिक JavaScript इंजन पर यह ~50ms में पूर्ण होता है।</> : <>In this process we computed the 60-term Moon position ~303 times. Total: approximately 18,000 sine evaluations. Yet on a modern JavaScript engine this completes in ~50ms.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चन्द्रोदय सदैव सूर्यास्त के बाद होता है।&quot; यह केवल पूर्णिमा के निकट सत्य है। अमावस्या के निकट चन्द्रोदय सूर्योदय के समय होता है। शुक्ल पक्ष में चन्द्रोदय दोपहर बाद से रात तक, कृष्ण पक्ष में मध्यरात्रि के बाद से सुबह तक। चन्द्रोदय का समय तिथि से सीधे जुड़ा है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Moonrise always occurs after sunset.&quot; This is only true near full moon. Near new moon, moonrise occurs around sunrise. During Shukla Paksha (waxing), moonrise progresses from afternoon toward night. During Krishna Paksha (waning), from after midnight toward morning.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चन्द्रोदय लम्बन सूर्य की तरह नगण्य है।&quot; चन्द्रमा का लम्बन (~57&apos;) सूर्य (8.8&quot;) से 400 गुना बड़ा है और दृश्य चन्द्रोदय समय को 3-5 मिनट खिसकाता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Moonrise parallax is negligible like the Sun&apos;s.&quot; The Moon&apos;s parallax (~57&apos;) is 400 times larger than the Sun&apos;s (8.8&quot;) and shifts the apparent moonrise time by 3-5 minutes.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;सूर्योदय सूत्र को चन्द्रोदय के लिए पुनः उपयोग किया जा सकता है।&quot; यह ~30 मिनट तक गलत परिणाम देता है क्योंकि (1) चन्द्रमा गणना के दौरान महत्त्वपूर्ण रूप से चलता है, (2) लम्बन 400 गुना बड़ा है, (3) उदय सीमा भिन्न है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The sunrise formula can be reused for moonrise.&quot; This gives results wrong by up to ~30 minutes because (1) the Moon moves significantly during the calculation, (2) parallax is 400x larger, (3) the rise threshold is different.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance — Festival Timing', hi: 'आधुनिक प्रासंगिकता — त्योहार समय', sa: 'आधुनिकी प्रासङ्गिकता — त्योहार समय' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रोदय समय पंचांग के लिए अत्यन्त महत्त्वपूर्ण है: करवा चौथ पर चन्द्रोदय समय व्रत-भंग अनुष्ठान निर्धारित करता है — लाखों महिलाएँ इस सटीक क्षण की प्रतीक्षा करती हैं। शरद पूर्णिमा पर चन्द्रोदय अनुष्ठान समय प्रभावित करता है। चन्द्र ग्रहण प्रेक्षण के लिए सटीक चन्द्रोदय जानना आवश्यक है (क्या ग्रहण चन्द्रोदय से पहले शुरू होगा?)। हमारा इंजन आधुनिक हार्डवेयर पर 100ms से कम में चलता है, जिससे यह वास्तविक-समय वेब अनुप्रयोगों के लिए व्यावहारिक है।</> : <>Moonrise timing is crucial for Panchang: the Chandrodaya (moonrise) time on Karva Chauth determines the fast-breaking ritual — millions of women wait for this precise moment. On Sharad Purnima, moonrise affects ritual scheduling. For lunar eclipse observation, knowing exact moonrise is essential (will the eclipse begin before moonrise?). Our engine runs in under 100ms on modern hardware, making it practical for real-time web applications.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Cross-References', hi: 'सम्बन्धित मॉड्यूल', sa: 'सम्बन्धित मॉड्यूल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>चन्द्र भोगांश कैसे गणित होता है इसके लिए <span className="text-gold-light">मॉड्यूल 22.3 (चन्द्र भोगांश)</span> देखें। सूर्योदय के सरल घण्टा-कोण दृष्टिकोण के लिए <span className="text-gold-light">मॉड्यूल 22.4 (सूर्योदय/सूर्यास्त)</span> देखें। त्योहारों में चन्द्रोदय के महत्त्व को समझने के लिए <span className="text-gold-light">मॉड्यूल 5 (तिथि)</span> देखें।</> : <>For how the Moon&apos;s longitude is computed, see <span className="text-gold-light">Module 22.3 (Moon Longitude)</span>. For the simpler hour-angle approach used for sunrise, see <span className="text-gold-light">Module 22.4 (Sunrise/Sunset)</span>. To understand the significance of moonrise in festivals like Karva Chauth, see <span className="text-gold-light">Module 5 (Tithi)</span>.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

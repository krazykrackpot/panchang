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
          'Moonrise is harder than sunrise because the Moon\'s parallax is large (up to 1 degree) and it moves significantly during the calculation.',
          'A binary search algorithm is needed to find moonrise because the Moon\'s rapid motion means simple hour-angle formulas can miss by 30+ minutes.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why Moonrise Is Harder Than Sunrise', hi: 'चन्द्रोदय सूर्योदय से कठिन क्यों है', sa: 'चन्द्रोदय सूर्योदय से कठिन क्यों है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय के लिए हमने एक सुन्दर घण्टा-कोण सूत्र उपयोग किया जो मानता है कि उदय घटना के दौरान सूर्य की स्थिति मूलतः स्थिर है। सूर्य प्रतिदिन केवल ~1° चलता है, अतः मध्याह्न (जब हम प्राचल गणित करते हैं) और सूर्योदय के बीच ~6 घण्टों में इसकी क्रान्ति और विषुवांश मुश्किल से बदलते हैं। चन्द्रमा इस धारणा को तोड़ता है। ~13.2° प्रतिदिन चलने का अर्थ है कि चन्द्रमा एक घण्टे में ~0.5° खिसकता है — उन अपवर्तन और लम्बन सुधारों के तुल्य जो हम लगाने का प्रयास कर रहे हैं। एक &quot;स्नैपशॉट&quot; स्थिति से चन्द्रोदय गणित करने वाला विश्लेषणात्मक सूत्र 10-30 मिनट गलत होगा। इसके बजाय, हमें पुनरावृत्तीय दृष्टिकोण उपयोग करना चाहिए।</> : <>For sunrise, we used an elegant hour-angle formula that assumes the Sun&apos;s position is essentially fixed during the rise event. The Sun moves only ~1° per day, so its declination and right ascension barely change in the ~6 hours between noon (when we compute the parameters) and sunrise. The Moon shatters this assumption. Moving ~13.2° per day means the Moon shifts ~0.5° in a single hour — comparable to the refraction and parallax corrections we&apos;re trying to apply. An analytical formula that computes moonrise from a &quot;snapshot&quot; position would be off by 10-30 minutes. Instead, we must use an iterative approach.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>हमारा दृष्टिकोण: 24 घण्टों में प्रत्येक 5 मिनट पर क्षितिज से चन्द्र ऊँचाई गणित करें। प्रत्येक चरण पर, पूर्ण 60-पद मीयस एल्गोरिदम से चन्द्र भूकेन्द्रीय स्थिति (भोगांश, अक्षांश, दूरी) गणित करें, क्षैतिज निर्देशांकों (दिगंश और ऊँचाई) में बदलें, और फिर स्थलकेन्द्रीय लम्बन सुधार लगाएँ। जब दो क्रमागत बिन्दु मिलें जहाँ ऊँचाई ऋणात्मक से धनात्मक बदलती है (चन्द्रमा उदय सीमा पार करता है), तो चन्द्रोदय घटना 5-मिनट खिड़की में कोष्ठकित हो गई।</> : <>Our approach: compute the Moon&apos;s altitude above the horizon every 5 minutes for 24 hours. At each step, we calculate the Moon&apos;s geocentric position (longitude, latitude, distance) using the full 60-term Meeus algorithm, convert to horizontal coordinates (azimuth and altitude), and then apply the topocentric parallax correction. When we find two consecutive points where the altitude changes from negative to positive (the Moon crosses the rise threshold), we have bracketed the moonrise event in a 5-minute window.</>}</p>
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
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्रमा एकमात्र ऐसा आकाशीय पिण्ड है जो पृथ्वी से इतना निकट है कि लम्बन — प्रेक्षक के केन्द्र के बजाय सतह पर होने से दृश्य स्थिति में खिसकाव — महत्त्वपूर्ण अन्तर डालता है। सूर्य का लम्बन केवल 8.8 कला-सेकण्ड (नगण्य) है। चन्द्रमा का क्षैतिज लम्बन 54&apos; से 61&apos; तक — लगभग 1 अंश! क्षितिज पर (जहाँ ऊँचाई 0° के निकट), लम्बन सुधार अधिकतम है: alt_topo = alt_geo - HP × cos(alt)। cos(0°) = 1 होने से, पूर्ण HP मान क्षितिज पर ज्यामितीय ऊँचाई से घटाया जाता है।</> : <>The Moon is the one celestial object close enough to Earth that parallax — the shift in apparent position due to the observer being on the surface rather than at the center of the Earth — makes a significant difference. The Sun&apos;s parallax is only 8.8 arcseconds (negligible). The Moon&apos;s horizontal parallax ranges from 54&apos; to 61&apos; — nearly 1 degree! At the horizon (where altitude is close to 0°), the parallax correction is at its maximum: alt_topo = alt_geo - HP x cos(alt). Since cos(0°) = 1, the full HP value is subtracted from the geometric altitude at the horizon.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>HP स्वयं चन्द्र दूरी से गणित होता है: sin(HP) = 6378.14 / दूरी, जहाँ 6378.14 किमी पृथ्वी की विषुवतीय त्रिज्या है। दूरी मीयस सारणी 47.A के 14 कोज्या पदों से आती है। उपभू (~356,000 किमी) पर HP ≈ 61&apos; (चन्द्रमा बड़ा दिखता है — यही &quot;सुपरमून&quot; का समय है)। अपभू (~407,000 किमी) पर HP ≈ 54&apos;। लम्बन में यह 7 कला भिन्नता उपभू और अपभू के बीच चन्द्रोदय समय को कई मिनट खिसकाती है, उसी आकाश स्थिति के लिए भी।</> : <>The HP itself is computed from the Moon&apos;s distance: sin(HP) = 6378.14 / distance, where 6378.14 km is Earth&apos;s equatorial radius. The distance comes from the 14 cosine terms of Meeus Table 47.A. At perigee (~356,000 km), HP ≈ 61&apos; (the Moon appears larger — this is when &quot;supermoons&quot; occur). At apogee (~407,000 km), HP ≈ 54&apos;. This 7-arcminute variation in parallax causes moonrise times to shift by several minutes between perigee and apogee, even for the same sky position.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Rise Threshold', hi: 'उदय सीमा', sa: 'उदय सीमा' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>चन्द्रोदय सीमा h₀ ≈ -0.3°। यह सूर्य के -0.8333° से भिन्न है क्योंकि चन्द्र अर्ध-व्यास (~16&apos;) और वायुमण्डलीय अपवर्तन (~34&apos;) आंशिक रूप से एक-दूसरे को सन्तुलित करते हैं, और बड़ा लम्बन सुधार स्थलकेन्द्रीय रूपान्तरण में अलग से संभाला जाता है। सटीक सीमा चन्द्र दूरी के साथ थोड़ी भिन्न होती है (अर्ध-व्यास 14.7&apos; से 16.7&apos; तक), किन्तु -0.3° एक अच्छा औसत है।</> : <>The moonrise threshold h₀ ≈ -0.3°. This differs from the Sun&apos;s -0.8333° because the Moon&apos;s semi-diameter (~16&apos;) and atmospheric refraction (~34&apos;) partially cancel, and the large parallax correction is handled separately in the topocentric conversion. The exact threshold varies slightly with the Moon&apos;s distance (semi-diameter ranges from 14.7&apos; to 16.7&apos;), but -0.3° is a good average.</>}</p>
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
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>5-मिनट अन्वेषण से कोष्ठक मिलने पर (मान लें मिनट 420 पर ऊँचाई -0.5° और मिनट 425 पर +0.3°), द्विआधारी खोज करते हैं। मध्यबिन्दु मिनट 422.5 है। उस क्षण चन्द्र स्थलकेन्द्रीय ऊँचाई गणित करते हैं। ऋणात्मक हो तो उदय 422.5 और 425 के बीच। धनात्मक हो तो 420 और 422.5 के बीच। 15 पुनरावृत्तियों के बाद, कोष्ठक चौड़ाई 5 मिनट / 2^15 = 0.009 सेकण्ड — आवश्यकता से बहुत अधिक सटीकता। अन्तिम कोष्ठक का मध्यबिन्दु चन्द्रोदय समय लेते हैं।</> : <>Once the 5-minute scan finds a bracket (say, at minute 420 the altitude is -0.5° and at minute 425 it is +0.3°), we perform binary search. The midpoint is minute 422.5. We compute the Moon&apos;s topocentric altitude at that instant. If it&apos;s negative, the rise is between 422.5 and 425. If positive, between 420 and 422.5. After 15 iterations, the bracket width is 5 minutes / 2^15 = 0.009 seconds — far more precision than we need. We take the midpoint of the final bracket as the moonrise time.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>परिणाम को स्थानीय समय में बदलना: द्विआधारी खोज हमें आंशिक सटीकता वाला जूलियन दिवस देती है। UT घण्टे (JD_fractional - 0.5) × 24 के रूप में निकालते हैं, फिर प्रेक्षक के स्थान का समयक्षेत्र ऑफ़सेट जोड़ते हैं। हमारा परिणाम: अधिकांश तिथियों और स्थानों पर प्रमुख पंचांग स्रोतों से 2 मिनट के भीतर। ~2 मिनट शेष त्रुटि लगभग पूर्णतः चन्द्र भोगांश सटीकता (~0.3° 60-पद मीयस एल्गोरिदम से) से आती है, अन्वेषण या लम्बन सुधारों से नहीं।</> : <>Converting the result to local time: the binary search gives us a Julian Day with fractional precision. We extract the UT hours as (JD_fractional - 0.5) x 24, then add the timezone offset for the observer&apos;s location. Our result: within 2 minutes of reference panchang sources for most dates and locations. The ~2 minute residual error comes almost entirely from the Moon&apos;s longitude accuracy (~0.3° from the 60-term Meeus algorithm), not from the scanning or parallax corrections.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Edge Cases', hi: 'विशेष स्थितियाँ', sa: 'विशेष स्थितियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चन्द्रोदय नहीं:</span> चन्द्रमा प्रतिदिन ~50 मिनट देर से उदित होने से, कभी-कभी ऐसी तिथि आती है जब चन्द्रोदय एक दिन मध्यरात्रि से ठीक पहले और अगला अगले दिन मध्यरात्रि के बाद आता है, जिससे एक कैलेण्डर तिथि बिना चन्द्रोदय रह जाती है। हमारा स्कैनर 24-घण्टे अन्वेषण में ऋणात्मक-से-धनात्मक क्रॉसिंग न मिलने पर &quot;चन्द्रोदय नहीं&quot; सही रूप से प्रतिवेदित करता है।</> : <><span className="text-gold-light font-medium">No moonrise:</span> Because the Moon rises ~50 minutes later each day, there are occasional dates when moonrise falls just before midnight and the next moonrise after midnight the following day, leaving one calendar date with no moonrise event. Our scanner correctly handles this by reporting &quot;no moonrise&quot; when the 24-hour scan finds no negative-to-positive crossing.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चन्द्रोदय लम्बन सूर्य की तरह नगण्य है।&quot; सूर्य का लम्बन (8.8&quot;) वास्तव में नगण्य है। चन्द्रमा का लम्बन (~57&apos;) 400 गुना बड़ा है और दृश्य चन्द्रोदय समय को 3-5 मिनट खिसकाता है। इसकी अनदेखी करने से हमारा चन्द्रोदय लगातार कई मिनट देर से आता।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Moonrise parallax is negligible like the Sun&apos;s.&quot; The Sun&apos;s parallax (8.8&quot;) is indeed negligible. The Moon&apos;s parallax (~57&apos;) is 400 times larger and shifts the apparent moonrise time by 3-5 minutes. Ignoring it would make our moonrise consistently late by several minutes.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रोदय समय पंचांग के लिए अत्यन्त महत्त्वपूर्ण है: करवा चौथ पर चन्द्रोदय समय व्रत-भंग अनुष्ठान निर्धारित करता है। शरद पूर्णिमा पर चन्द्रोदय समय अनुष्ठान समय-निर्धारण प्रभावित करता है। हमारा अन्वेषण + द्विआधारी खोज दृष्टिकोण पूर्ण 60-पद चन्द्र स्थिति ~300 बार (288 अन्वेषण बिन्दु + ~15 द्विआधारी खोज पुनरावृत्तियाँ) गणित करने के बावजूद आधुनिक हार्डवेयर पर 100ms से कम में चलता है, जिससे यह वास्तविक-समय वेब अनुप्रयोगों के लिए व्यावहारिक है।</> : <>Moonrise timing is crucial for Panchang: the Chandrodaya (moonrise) time on Karva Chauth determines when the fast-breaking ritual occurs. On Sharad Purnima, moonrise timing affects ritual scheduling. Our scanning + binary search approach runs in under 100ms on modern hardware despite computing the full 60-term Moon position ~300 times (288 scan points + ~15 binary search iterations), making it practical for real-time web applications.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
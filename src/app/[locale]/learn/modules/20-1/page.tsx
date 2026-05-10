'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';

const META: ModuleMeta = {
  id: 'mod_20_1', phase: 7, topic: 'KP System', moduleNumber: '20.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
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
          'KP replaces equal-house divisions with Placidus cusps  –  house sizes become unequal and latitude-dependent for more accurate results.',
          'The exact cusp degree determines which planet\'s sub-lord rules the house  –  this precision is the foundation of KP predictions.',
          'At equatorial latitudes, Placidus and equal houses nearly match. At higher latitudes (>30°N/S), differences become dramatic.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Equal vs Unequal House Systems', hi: 'समान बनाम असमान भाव पद्धतियाँ', sa: 'समान बनाम असमान भाव पद्धतियाँ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In traditional Vedic astrology (Parashari system), the chart is divided into 12 houses of exactly 30 degrees each, starting from the Ascendant degree. This is called the equal-house system. If your lagna (Ascendant) is at 10 degrees Aries, the 1st house spans 10 degrees Aries to 10 degrees Taurus, the 2nd house from 10 degrees Taurus to 10 degrees Gemini, and so on. Each house is exactly 30 degrees wide, mirroring the 30-degree width of each rashi (sign). This system is simple, elegant, and has been the standard in Indian astrology for millennia.', hi: 'पारम्परिक वैदिक ज्योतिष (पाराशरी पद्धति) में कुण्डली को लग्न अंश से आरम्भ करते हुए ठीक 30 अंश के 12 भावों में विभक्त किया जाता है। इसे समान-भाव पद्धति कहते हैं। यदि आपका लग्न 10 अंश मेष पर है, तो प्रथम भाव 10 अंश मेष से 10 अंश वृषभ तक, द्वितीय भाव 10 अंश वृषभ से 10 अंश मिथुन तक, इत्यादि। प्रत्येक भाव ठीक 30 अंश चौड़ा है।', sa: 'पारम्परिक वैदिक ज्योतिष (पाराशरी पद्धति) में कुण्डली को लग्न अंश से आरम्भ करते हुए ठीक 30 अंश के 12 भावों में विभक्त किया जाता है। इसे समान-भाव पद्धति कहते हैं।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The KP (Krishnamurti Paddhati) system, developed by K.S. Krishnamurti in the 1960s, made a radical departure: it adopted the Placidus house system from Western astrology. In Placidus, house sizes are UNEQUAL  –  they vary based on the observer\'s geographic latitude. A house might be as narrow as 20 degrees or as wide as 40 degrees. The reason for this choice was precision: at higher latitudes (like Europe at 47 degrees N, or even parts of North India at 28-30 degrees N), equal houses can place a planet in the wrong house, leading to incorrect predictions.', hi: 'के.एस. कृष्णमूर्ति द्वारा 1960 के दशक में विकसित केपी (कृष्णमूर्ति पद्धति) ने एक क्रान्तिकारी परिवर्तन किया: इसने पाश्चात्य ज्योतिष से प्लेसिडस भाव पद्धति अपनाई। प्लेसिडस में भावों का आकार असमान होता है  –  ये प्रेक्षक के भौगोलिक अक्षांश के अनुसार भिन्न होते हैं।', sa: 'केपी (कृष्णमूर्ति पद्धति) ने प्लेसिडस भाव पद्धति अपनाई। प्लेसिडस में भावों का आकार असमान होता है  –  ये प्रेक्षक के भौगोलिक अक्षांश के अनुसार भिन्न होते हैं।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The Placidus house system was developed by the Italian monk Placidus de Titis (1603-1668). However, the underlying concept traces back to Ptolemy\'s Tetrabiblos (2nd century CE). K.S. Krishnamurti, a professor from Tamil Nadu, recognised that this Western technique solved a real problem in Indian astrology  –  the inaccuracy of equal houses at non-equatorial latitudes  –  and brilliantly integrated it with the Vedic nakshatra sub-lord system to create KP.', hi: 'प्लेसिडस भाव पद्धति इतालवी भिक्षु प्लेसिडस दे टिटिस (1603-1668) ने विकसित की। तमिलनाडु के प्राध्यापक के.एस. कृष्णमूर्ति ने पहचाना कि यह पाश्चात्य तकनीक भारतीय ज्योतिष की एक वास्तविक समस्या का समाधान करती है  –  इसे वैदिक नक्षत्र उप-स्वामी पद्धति के साथ एकीकृत कर केपी का निर्माण किया।', sa: 'प्लेसिडस भाव पद्धति इतालवी भिक्षु प्लेसिडस दे टिटिस (1603-1668) ने विकसित की।' }, locale)}
        </p>
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
          {tl({ en: 'How Placidus Calculates Cusps', hi: 'प्लेसिडस भाव-सन्धि गणना', sa: 'प्लेसिडस भाव-सन्धि गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The Placidus method starts with four fixed anchor points: the Ascendant (1st house cusp), the Descendant (7th house cusp), the MC or Medium Coeli (10th house cusp), and the IC or Imum Coeli (4th house cusp). The magic lies in calculating the intermediate cusps  –  the 2nd, 3rd, 5th, 6th, 8th, 9th, 11th, and 12th house boundaries.', hi: 'प्लेसिडस विधि चार स्थिर आधार बिन्दुओं से आरम्भ होती है: लग्न, अस्त, MC (दशम भाव सन्धि), और IC (चतुर्थ भाव सन्धि)। वैशिष्ट्य मध्यवर्ती सन्धियों की गणना में है।', sa: 'प्लेसिडस विधि चार स्थिर आधार बिन्दुओं से आरम्भ होती है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The technique: for any point on the ecliptic, calculate its diurnal arc (how long it stays above the horizon) and nocturnal arc (below). Trisecting the diurnal semi-arc gives the 11th and 12th house cusps; trisecting the nocturnal semi-arc gives the 2nd and 3rd cusps. The same process below the horizon gives the remaining cusps. This means house sizes depend on the observer\'s latitude  –  at the equator, all semi-arcs are equal and Placidus closely matches equal houses.', hi: 'तकनीक: क्रान्तिवृत्त के बिन्दु के लिए दिवसीय चाप और रात्रिकालीन चाप गणित करें। दिवसीय अर्ध-चाप को त्रिभाजित करने से 11वीं और 12वीं सन्धियाँ मिलती हैं; रात्रिकालीन अर्ध-चाप से 2री और 3री।', sa: 'दिवसीय अर्ध-चाप को त्रिभाजित करने से भाव सन्धियाँ मिलती हैं।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Sub-Lord Theory  –  The KP Innovation</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The critical KP innovation is the sub-lord concept. Each cusp degree falls within a specific nakshatra, and each nakshatra is subdivided into 9 sub-divisions (proportional to dasha periods). The planet ruling the sub-division where a cusp falls is called the &quot;sub-lord&quot; of that house. The sub-lord determines whether the house&apos;s promise will be fulfilled or denied.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For example: if the 7th cusp sub-lord signifies houses 2, 7, and 11 (marriage houses), marriage is promised. If it signifies 1, 6, and 10 (anti-marriage houses), marriage is denied or delayed. This sub-lord analysis gives KP its remarkable predictive precision  –  a shift of even 1 degree in the cusp can change the sub-lord and thus the entire prediction.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart at 47°N (Switzerland):</span> Ascendant = 5° Cancer, MC = 15° Pisces. In equal houses, each house = 30°. In Placidus: 1st house = 5° Cancer to 28° Cancer (23° wide), 2nd = 28° Cancer to 25° Leo (27°), 10th = 15° Pisces to 20° Aries (35°). The 12° variation (23° to 35°) means planets near house boundaries can shift between houses.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Impact:</span> Mars at 25° Aries: Equal houses = 1st house (self, energy). Placidus at 47°N = 12th house (if 12th cusp is at 20° Aries). Completely different signification  –  personal vitality vs hidden enemies and foreign travel.
        </p>
      </section>
      <WhyItMatters locale={locale}>
        The house a planet occupies determines ALL predictions for that planet. A single-degree cusp shift can move a planet between houses, transforming every prediction. This is why KP insists on Placidus  –  it respects the actual astronomical conditions at the birth location rather than assuming a universal 30° per house.
      </WhyItMatters>
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
          {tl({ en: 'Practical Differences in Chart Interpretation', hi: 'कुण्डली व्याख्या में व्यावहारिक अन्तर', sa: 'कुण्डली व्याख्या में व्यावहारिक अन्तर' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'KP practitioners argue that Placidus matches real-world events more accurately because it respects the actual astronomical conditions at the birth location. The debate between equal and Placidus continues, but KP\'s track record of precise event timing has earned it a devoted following, especially in South India and among astrologers who prioritise prediction over personality analysis.', hi: 'केपी अभ्यासकर्ताओं का तर्क है कि प्लेसिडस वास्तविक-विश्व घटनाओं से अधिक सटीक मेल खाता है। केपी का सटीक घटना-समय निर्धारण ने इसे एक समर्पित अनुयायी वर्ग दिया है।', sa: 'केपी अभ्यासकर्ताओं का तर्क है कि प्लेसिडस अधिक सटीक है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key practical differences: (1) Planets near house boundaries may change houses between the two systems. (2) The sub-lord of each cusp changes with Placidus cusps, altering predictions. (3) At equatorial latitudes (0-15°N/S), the differences are minimal. (4) At higher latitudes (30°+ N/S, covering most of Europe, Northern USA, and Northern China), the differences become significant. (5) Beyond 66°N/S (Arctic/Antarctic), Placidus breaks down entirely  –  some houses become infinitely large.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;Placidus is a Western system, so it has no place in Vedic astrology.&quot; KP uses Placidus alongside purely Vedic concepts  –  nakshatras, Vimshottari dasha proportions, and Lahiri ayanamsha. The house division is geometric  –  it has no inherent cultural bias.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;One house system is objectively correct and the other wrong.&quot; Both are mathematical models. Equal houses work well at equatorial latitudes and for rashi-based (sign-based) analysis. Placidus works better for degree-precise house analysis at higher latitudes. Use the right tool for the right job.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Today, KP with Placidus houses is one of the most popular predictive systems in India. Our <span className="text-gold-light">KP System tool</span> computes Placidus cusps automatically for any latitude. The system is especially relevant for the Indian diaspora living at high latitudes (UK, Canada, Northern Europe) where equal houses become increasingly inaccurate. See <span className="text-gold-light">Module 20.2 (Sub-Lords)</span> for how cusps connect to predictions, and <span className="text-gold-light">Module 20.4 (Ruling Planets)</span> for event timing.
        </p>
      </section>

      <QuickCheck
        question="At what latitudes do Placidus and equal house systems give nearly identical results?"
        options={['All latitudes equally', 'Near the equator (0-15°)', 'At 45° latitude', 'Near the poles (60°+)']}
        correctIndex={1}
        explanation="Near the equator, diurnal and nocturnal arcs are nearly equal for all ecliptic points, so Placidus trisection produces houses close to 30° each  –  matching equal houses. The divergence grows with latitude."
      />
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
          Equal vs Placidus  –  When Each System Excels
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The debate between equal houses and Placidus is not about one being &quot;right&quot;  –  it is about choosing the right tool for the right task. Equal houses excel in rashi-based analysis where the sign (not the degree) determines house placement. Parashari techniques like yogas, sign-lords, and rashi drishti work naturally with equal houses. For personality analysis and general life themes, equal houses are sufficient and elegant.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Placidus excels when degree-level precision matters  –  specifically for KP&apos;s sub-lord analysis and event timing. The sub-lord of the 7th cusp at 15° Leo 23&apos; is different from the sub-lord at 15° Leo 45&apos;  –  and this difference can change whether marriage is promised or denied. This degree-level precision is what gives KP its edge in answering &quot;when?&quot; questions.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A practical recommendation: use equal houses for Parashari chart reading (yogas, planetary dignity, dasha analysis). Switch to Placidus for KP analysis (sub-lord evaluation, event timing, horary questions). Our app computes both systems and clearly labels which is in use. Many serious astrologers use both  –  Parashari for &quot;what&quot; and KP for &quot;when.&quot;
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Placidus Limitations</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">High latitude failure:</span> Beyond ~60° latitude, some ecliptic points never rise or set. This makes trisection impossible, producing undefined cusps. Alternative systems (Koch, Regiomontanus) handle this better but are rarely used in KP.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Interception:</span> At high latitudes, a complete rashi can be &quot;intercepted&quot; inside a house without appearing on any cusp. Equal houses never have this issue. KP acknowledges interceptions but treats them as a feature, not a bug  –  the intercepted sign&apos;s lord has reduced overt influence.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Computational complexity:</span> Placidus cusps require iterative trigonometric calculations. Equal houses require only simple addition (30° per house). This was a practical concern before computers; today it is irrelevant  –  our app computes Placidus in milliseconds.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Birth time sensitivity:</span> Placidus cusps change faster than equal-house cusps because they depend on latitude-specific diurnal arcs. A 4-minute error in birth time shifts cusps by approximately 1°. In KP, where the sub-lord changes every 1-4°, birth time accuracy is critical. This is why KP practitioners often use rectification techniques to verify the birth time before analysis.</p>
      </section>

      <QuickCheck
        question="What is the 'sub-lord' in KP system?"
        options={['The planet ruling the sign of a cusp', 'The planet ruling the nakshatra sub-division where a cusp falls', 'The weakest planet in the chart', 'The planet closest to the cusp degree']}
        correctIndex={1}
        explanation="Each nakshatra is divided into 9 sub-divisions proportional to Vimshottari dasha periods. The planet ruling the sub-division where a cusp falls is the 'sub-lord'  –  it determines whether the house's promise will be fulfilled or denied."
      />
    </div>
  );
}

export default function Module20_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

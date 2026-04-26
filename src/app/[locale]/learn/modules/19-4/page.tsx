'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/19-4.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_19_4', phase: 6, topic: 'Jaimini', moduleNumber: '19.4',
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
          'Hora Lagna (wealth reference), Ghati Lagna (power reference), and Varnada Lagna (life purpose) provide alternative starting points for chart analysis.',
          'These special lagnas give Jaimini astrology its multi-dimensional character — each lagna reveals a different facet of life.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Beyond the Birth Lagna', hi: 'जन्म लग्न से परे', sa: 'जन्म लग्न से परे' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाराशरी ज्योतिष में उदय लग्न सर्वाधिक महत्त्वपूर्ण एकमात्र सन्दर्भ बिन्दु है। जैमिनी ने अनेक विशेष लग्नों की शुरुआत करके इसका विस्तार किया, प्रत्येक जीवन का एक भिन्न आयाम प्रकट करता है। जन्म लग्न भौतिक स्व और सामान्य जीवन दिशा दिखाता है। किन्तु धन, शक्ति और उद्देश्य प्रत्येक को अपना सन्दर्भ बिन्दु चाहिए — और जैमिनी ने होरा लग्न (HL), घटी लग्न (GL), भाव लग्न (BL) और वर्णद लग्न (VL) द्वारा ठीक यही प्रदान किया।</>
            : <>In Parashari astrology, the Ascendant (Lagna) is the single most important reference point. Jaimini expanded this by introducing multiple special lagnas, each revealing a different dimension of life. The birth Lagna shows the physical self and general life direction. But wealth, power, and purpose each deserve their own reference point — and Jaimini provided exactly that through Hora Lagna (HL), Ghati Lagna (GL), Bhava Lagna (BL), and Varnada Lagna (VL).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>होरा लग्न (HL)</strong> — धन सूचक। सूर्य की राशि से आरम्भ करके सूर्योदय से प्रत्येक होरा (2.5 घण्टे) में एक राशि आगे बढ़ता है। HL की स्थिति, उसका स्वामी और दृष्ट ग्रह जातक की आर्थिक दिशा प्रकट करते हैं। <strong>घटी लग्न (GL)</strong> — अधिकार और शक्ति सूचक। लग्न से आरम्भ करके सूर्योदय से प्रत्येक घटी (24 मिनट) में एक राशि आगे बढ़ता है। GL यश, सामाजिक प्रतिष्ठा और अधिकार प्रयोग की क्षमता दिखाता है।</>
            : <><strong>Hora Lagna (HL)</strong> — The wealth indicator. It advances one sign per hora (2.5 hours) from sunrise, starting from the Sun&apos;s sign. The position of HL, its lord, and planets aspecting it reveal the native&apos;s financial trajectory. <strong>Ghati Lagna (GL)</strong> — The authority and power indicator. It advances one sign per ghati (24 minutes) from sunrise, starting from the lagna. GL shows fame, social standing, and the capacity to exercise authority.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Bhava Lagna — The Second Wealth Point', hi: 'भाव लग्न — द्वितीय धन बिन्दु', sa: 'भाव लग्न — द्वितीय धन बिन्दु' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Bhava Lagna (BL) is another wealth and sustenance indicator that complements Hora Lagna. While HL focuses on accumulated wealth, BL often relates to ongoing sustenance and the ability to maintain oneself. Some Jaimini scholars consider BL particularly relevant for assessing the native&apos;s capacity to earn a livelihood, as distinct from inherited or windfall wealth shown by HL. When both HL and BL fall in strong signs with benefic aspects, the native enjoys robust financial health throughout life.
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
          {tl({ en: 'Computing Hora Lagna', hi: 'होरा लग्न की गणना', sa: 'होरा लग्न की गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गणना एक स्पष्ट क्रमविधि का पालन करती है: (1) जन्म तिथि और स्थान के लिए सटीक सूर्योदय समय निर्धारित करें। (2) सूर्योदय से जन्म तक बीता समय घण्टों में गणित करें। (3) 2.5 से भाग दें ताकि बीती होराओं की संख्या मिले। (4) पूर्ण संख्या भाग बताता है कि सूर्य की राशि से कितनी राशियाँ आगे बढ़ानी हैं। भिन्नात्मक भाग उस राशि में अंश देता है। उदाहरण: सूर्योदय के 7.5 घण्टे बाद जन्म, सूर्य मेष में: 7.5 / 2.5 = 3.0 होरा। मेष से 3 राशियाँ: मेष(0) → वृषभ(1) → मिथुन(2) → कर्क(3)। HL = कर्क।</>
            : <>The computation follows a clear algorithm: (1) Determine the exact sunrise time for the birth date and location. (2) Calculate the elapsed time from sunrise to birth in hours. (3) Divide by 2.5 to get the number of horas elapsed. (4) The whole number portion tells you how many signs to advance from the Sun&apos;s sign. The fractional part gives the degree within that sign. For example, if born 7.5 hours after sunrise with Sun in Aries: 7.5 / 2.5 = 3.0 horas. Advance 3 signs from Aries: Aries(0) → Taurus(1) → Gemini(2) → Cancer(3). HL = Cancer.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Calculation: 2 PM Birth', hi: 'कार्यान्वित गणना: दोपहर 2 बजे का जन्म', sa: 'कार्यान्वित गणना: दोपहर 2 बजे का जन्म' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Given:</span> Birth at 2:00 PM, Sunrise at 6:00 AM, Sun in Taurus, Lagna in Virgo.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Hora Lagna:</span> Elapsed time = 2:00 PM - 6:00 AM = 8 hours. Horas = 8 / 2.5 = 3.2. Advance 3 signs from Taurus (Sun&apos;s sign): Taurus → Gemini(1) → Cancer(2) → Leo(3). HL = Leo. The 0.2 remaining = 0.2 x 30° = 6° within Leo. HL = 6° Leo.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">दिया गया:</span> जन्म दोपहर 2:00 बजे, सूर्योदय प्रातः 6:00 बजे, सूर्य वृषभ में, लग्न कन्या। होरा लग्न = सिंह 6°। घटी लग्न = वृषभ। इस जातक का धन बिन्दु (HL) सिंह में है — शक्तिशाली, शासकीय, और यदि सूर्य शक्तिशाली है तो धन नेतृत्व या सरकार से आता है। अधिकार बिन्दु (GL) वृषभ में है — स्थिर, धीरे-धीरे बनने वाला अधिकार।</>
            : <><span className="text-gold-light font-medium">Ghati Lagna:</span> Elapsed time = 8 hours = 480 minutes. Ghatis = 480 / 24 = 20. Advance 20 signs from Virgo (Lagna): 20 mod 12 = 8 signs. Virgo + 8 = Taurus. GL = Taurus.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;होरा लग्न और D2 (होरा) कुण्डली एक ही हैं।&quot; ये पूर्णतया भिन्न हैं। D2 होरा कुण्डली पाराशरी ज्योतिष में धन मूल्यांकन हेतु प्रयुक्त एक विभागीय कुण्डली है। होरा लग्न जैमिनी ज्योतिष में प्रयुक्त एक संवेदनशील बिन्दु (गणितीय लग्न-सदृश) है। दोनों &quot;होरा&quot; शब्द साझा करते हैं किन्तु भिन्न गणना और अनुप्रयोग वाली अलग अवधारणाएँ हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Hora Lagna and D2 (Hora) chart are the same thing.&quot; They are completely different. The D2 Hora chart is a divisional chart used in Parashari astrology to assess wealth. Hora Lagna is a sensitive point (like a mathematical lagna) used in Jaimini astrology. They share the word &quot;hora&quot; but are distinct concepts with different calculations and applications.</>}
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
          {tl({ en: 'Varnada Lagna — The Most Complex', hi: 'वर्णद लग्न — सर्वाधिक जटिल', sa: 'वर्णद लग्न — सर्वाधिक जटिल' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वर्णद लग्न की गणना जन्म लग्न और होरा लग्न के सम्बन्ध से होती है। क्रमविधि इस पर निर्भर करती है कि ये दो बिन्दु विषम या सम राशियों में हैं। <strong>नियम 1:</strong> यदि लग्न और HL दोनों विषम राशियों में हों, मेष से प्रत्येक तक आगे गिनें, गणनाओं का योग करें, और वह योग मेष से आगे गिनें। <strong>नियम 2:</strong> यदि दोनों सम में हों, मीन से प्रत्येक तक पीछे गिनें, योग करें, और वह योग मीन से पीछे गिनें। <strong>नियम 3:</strong> यदि एक विषम और दूसरा सम हो, मिश्र विधि प्रयुक्त होती है।</>
            : <>Varnada Lagna is computed from the relationship between the birth Lagna and the Hora Lagna. The algorithm depends on whether these two points fall in odd or even signs. <strong>Rule 1:</strong> If both Lagna and HL are in odd signs, count forward from Aries to each, sum the counts, and count that sum forward from Aries. <strong>Rule 2:</strong> If both are in even signs, count backward from Pisces to each, sum the counts, and count that sum backward from Pisces. <strong>Rule 3:</strong> If one is odd and the other even, the calculation uses a mixed method — count forward for the odd sign and backward for the even, then apply the sum appropriately.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Given:</span> Lagna in Aries (odd, sign 1), Hora Lagna in Leo (odd, sign 5). Both are odd — use Rule 1.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 1:</span> Count from Aries to Lagna (Aries) = 1. Count from Aries to HL (Leo) = 5.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 2:</span> Sum = 1 + 5 = 6. Count 6 signs forward from Aries: Aries(1) → Taurus(2) → Gemini(3) → Cancer(4) → Leo(5) → Virgo(6).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">परिणाम:</span> वर्णद लग्न = कन्या। कन्या का स्वामी (बुध) और कन्या को दृष्ट करने वाले ग्रह इस जातक की सच्ची पुकार प्रकट करते हैं — बुध बौद्धिक, संचार-सम्बन्धी या विश्लेषणात्मक वृत्ति का संकेत देता है।</>
            : <><span className="text-gold-light font-medium">Result:</span> Varnada Lagna = Virgo. The lord of Virgo (Mercury) and planets aspecting Virgo reveal this native&apos;s true calling — Mercury suggests an intellectual, communicative, or analytical vocation.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Purpose of Varnada', hi: 'वर्णद का उद्देश्य', sa: 'वर्णद का उद्देश्य' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>वर्णद लग्न जातक का &quot;वर्ण&quot; निर्धारित करता है — जाति के अर्थ में नहीं, बल्कि समाज में व्यक्ति की मूलभूत पुकार या योगदान के रूप में। इसका स्वामी और दृष्ट ग्रह प्रकट करते हैं कि व्यक्ति स्वाभाविक रूप से बौद्धिक कार्यों (ब्राह्मण गुण), नेतृत्व और शासन (क्षत्रिय गुण), वाणिज्य और उद्यम (वैश्य गुण), या सेवा और शिल्प (शूद्र गुण) की ओर उन्मुख है। आधुनिक व्याख्या में यह कठोर सामाजिक श्रेणियों के बजाय व्यापक जीविका आदर्शरूपों में अनुवादित होता है।</>
            : <>Varnada Lagna determines the native&apos;s &quot;varna&quot; — not in the caste sense, but as one&apos;s fundamental calling or contribution to society. Its lord and the planets aspecting it reveal whether the person is naturally inclined toward intellectual pursuits (Brahmana quality), leadership and governance (Kshatriya quality), commerce and enterprise (Vaishya quality), or service and craftsmanship (Shudra quality). In modern interpretation, this translates to broad career archetypes rather than rigid social categories.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>विशेष लग्न कुण्डली व्याख्या में उल्लेखनीय गहराई जोड़ते हैं। यद्यपि उन्हें सटीक जन्म समय चाहिए (विशेषकर घटी लग्न को), आधुनिक सॉफ्टवेयर चारों विशेष लग्नों की तत्काल गणना कर सकता है। परामर्श में ज्योतिषी पा सकता है कि जन्म लग्न एक जीविका दिशा सुझाता है जबकि होरा लग्न और वर्णद लग्न दूसरी ओर संकेत करते हैं — प्रकट करते हुए कि जातक जीविकार्थ क्या करता है और उसकी आत्मा वास्तव में क्या चाहती है, इसके बीच का तनाव। ये बहुविध दृष्टिकोण वैदिक ज्योतिष में जैमिनी के महानतम योगदानों में से एक हैं।</>
            : <>Special Lagnas add remarkable depth to chart interpretation. While they require accurate birth time (especially Ghati Lagna), modern software can compute all four special lagnas instantly. In consultation, an astrologer might find that the birth Lagna suggests one career direction while the Hora Lagna and Varnada Lagna point to another — revealing the tension between what the native does for a living versus what their soul truly desires. These multiple perspectives are one of Jaimini&apos;s greatest contributions to Vedic astrology.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

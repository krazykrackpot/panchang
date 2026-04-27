'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/32-1.json';

const META: ModuleMeta = {
  id: 'mod_32_1', phase: 4, topic: 'Yogas & Doshas', moduleNumber: '32.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 10,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/15-3' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/15-4' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q32_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q32_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q32_1_03', type: 'true_false',
    question: L.questions[2].question as Record<string, string>,
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q32_1_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — What Is Kaal Sarpa Dosha?                                 */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Kaal Sarpa Dosha?', hi: 'काल सर्प दोष क्या है?', sa: 'कालसर्पदोषः किम्?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>काल सर्प दोष एक ज्योतिषीय स्थिति है जो तब बनती है जब जन्म कुण्डली में सभी सात ग्रह (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) राहु-केतु अक्ष के एक ओर स्थित होते हैं। यह अवधारणा शास्त्रीय ग्रन्थों जैसे बृहत् पाराशर होरा शास्त्र (BPHS) या फलदीपिका में नहीं मिलती — यह 18वीं-19वीं शताब्दी की उत्तर-शास्त्रीय परम्परा से उत्पन्न हुई है।</>
            : <>Kaal Sarpa Dosha is an astrological condition that forms when all seven planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are positioned on one side of the Rahu-Ketu axis in the birth chart. Notably, this concept is NOT found in classical texts such as Brihat Parashara Hora Shastra (BPHS) or Phaladeepika — it originated in the post-classical tradition of the 18th-19th century.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>इस दोष के बारे में विद्वानों में मतभेद है। कुछ ज्योतिषी इसे अत्यन्त महत्वपूर्ण मानते हैं और इसे कार्मिक बाधाओं, विलम्ब और अप्रत्याशित उतार-चढ़ाव का कारण बताते हैं। अन्य विद्वान इसे पूर्णतः अस्वीकार करते हैं क्योंकि इसका कोई शास्त्रीय आधार नहीं है। एक सन्तुलित दृष्टिकोण यह है कि इसे एक सम्भावित प्रभावशाली कारक के रूप में देखें, न कि निश्चित भाग्य-निर्धारक के रूप में।</>
            : <>There is scholarly disagreement about this dosha. Some astrologers consider it extremely significant, attributing karmic obstacles, delays, and unexpected upheavals to its presence. Others reject it entirely due to its lack of classical textual basis. A balanced view treats it as a potentially influential factor rather than a deterministic fate-seal.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Full vs Partial Kaal Sarpa', hi: 'पूर्ण बनाम आंशिक काल सर्प', sa: 'पूर्ण बनाम आंशिक काल सर्प' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Full (Poorna):', hi: 'पूर्ण:', sa: 'पूर्ण:' }, locale)}</span>{' '}
            {tl({ en: 'All 7 planets are strictly between Rahu and Ketu with no planet conjunct either node. This is considered the strongest form.', hi: 'सभी 7 ग्रह राहु और केतु के बीच हैं, कोई ग्रह किसी नोड के साथ नहीं। यह सबसे प्रबल रूप माना जाता है।', sa: 'सभी 7 ग्रह राहु और केतु के बीच हैं।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Partial (Anshik):', hi: 'आंशिक:', sa: 'आंशिक:' }, locale)}</span>{' '}
            {tl({ en: 'All planets are between the nodes, but one or more planets are conjunct Rahu or Ketu. The conjunction weakens or breaks the formation, leading many practitioners to consider this a cancelled or negligible dosha.', hi: 'सभी ग्रह नोड्स के बीच हैं, पर एक या अधिक ग्रह राहु या केतु के साथ हैं। यह संयोग दोष को कमज़ोर या निरस्त करता है।', sa: 'सभी ग्रह नोड्स के बीच हैं पर एक या अधिक ग्रह नोड के साथ हैं।' }, locale)}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The 12 Types                                              */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);

  const TYPES = [
    { house: 1, en: 'Anant', hi: 'अनन्त', descEn: 'Self-identity and health challenged by karmic debt. The native may struggle with self-confidence and physical vitality.', descHi: 'स्वास्थ्य और पहचान में कर्मऋण से बाधा। जातक आत्मविश्वास और शारीरिक ऊर्जा में संघर्ष कर सकता है।' },
    { house: 2, en: 'Kulika', hi: 'कुलिक', descEn: 'Wealth, speech, and family lineage carry karmic burdens. Financial instability and family discord are common themes.', descHi: 'धन, वाणी और परिवार पर कर्म का बोझ। आर्थिक अस्थिरता और पारिवारिक कलह प्रमुख विषय हैं।' },
    { house: 3, en: 'Vasuki', hi: 'वासुकी', descEn: 'Courage, siblings, and communication face karmic obstacles. Short journeys and initiatives may face unexpected hurdles.', descHi: 'साहस, भाई-बहन और संचार में बाधा। छोटी यात्राओं और पहल में अप्रत्याशित बाधाएँ।' },
    { house: 4, en: 'Shankhapala', hi: 'शंखपाल', descEn: 'Home, mother, and emotional security are karmically tested. Property matters and domestic peace may be disrupted.', descHi: 'घर, माता और भावनात्मक सुरक्षा में चुनौती। सम्पत्ति और घरेलू शान्ति में बाधा।' },
    { house: 5, en: 'Padma', hi: 'पद्म', descEn: 'Children, creativity, and education bear karmic restrictions. Delays in progeny and obstacles in academic pursuits.', descHi: 'संतान, रचनात्मकता और शिक्षा में बाधा। सन्तान में विलम्ब और शैक्षिक बाधाएँ।' },
    { house: 6, en: 'Mahapadma', hi: 'महापद्म', descEn: 'Enemies, debts, and diseases carry deep karmic patterns. Legal battles and chronic health issues may persist.', descHi: 'शत्रु, ऋण और रोग में गहरा कर्म। कानूनी लड़ाई और दीर्घकालिक स्वास्थ्य समस्याएँ।' },
    { house: 7, en: 'Takshaka', hi: 'तक्षक', descEn: 'Marriage and business partnerships are karmically tested. Delays in marriage, marital discord, or difficult business alliances.', descHi: 'विवाह और व्यापारिक साझेदारी में कर्म की परीक्षा। विवाह में विलम्ब, वैवाहिक कलह।' },
    { house: 8, en: 'Karkotak', hi: 'कर्कोटक', descEn: 'Longevity, transformation, and inheritance carry karmic intensity. Sudden events and deep psychological transformations.', descHi: 'आयु, परिवर्तन और विरासत में तीव्रता। अचानक घटनाएँ और गहरे मनोवैज्ञानिक परिवर्तन।' },
    { house: 9, en: 'Shankhachud', hi: 'शंखचूड', descEn: 'Luck, dharma, and higher learning challenged by past-life karma. Spiritual progress may feel blocked despite sincere effort.', descHi: 'भाग्य, धर्म और उच्च शिक्षा में पूर्वजन्म का कर्म। ईमानदार प्रयास के बावजूद आध्यात्मिक प्रगति में बाधा।' },
    { house: 10, en: 'Ghatak', hi: 'घातक', descEn: 'Career, reputation, and public standing face karmic tests. Professional setbacks and authority conflicts.', descHi: 'करियर, प्रतिष्ठा और सार्वजनिक स्थिति में कर्मिक परीक्षा। व्यावसायिक असफलताएँ।' },
    { house: 11, en: 'Vishdhar', hi: 'विषधर', descEn: 'Gains, friendships, and ambitions delayed by karmic poison. Income fluctuations and unfulfilled desires.', descHi: 'लाभ, मित्रता और महत्वाकांक्षा में विलम्ब। आय में उतार-चढ़ाव और अपूर्ण इच्छाएँ।' },
    { house: 12, en: 'Sheshnag', hi: 'शेषनाग', descEn: 'Foreign lands, spirituality, and liberation carry intense karma. Expenses, isolation, and the path to moksha are all amplified.', descHi: 'विदेश, आध्यात्मिकता और मोक्ष में गहरा कर्म। खर्च, एकान्त और मोक्ष का मार्ग प्रबल।' },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The 12 Types of Kaal Sarpa Dosha', hi: 'काल सर्प दोष के 12 प्रकार', sa: 'कालसर्पदोषस्य द्वादश प्रकाराः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {isHi
            ? <>प्रत्येक प्रकार का नाम एक पौराणिक सर्प (नाग) के नाम पर है और यह राहु किस भाव (1-12) में स्थित है, इससे निर्धारित होता है। प्रभाव राहु या केतु की महादशा/अंतर्दशा के दौरान तीव्र होते हैं।</>
            : <>Each type is named after a mythological serpent (Naga) and is determined by which house (1-12) Rahu occupies. Effects are intensified during Rahu or Ketu Mahadasha or Antardasha periods.</>}
        </p>
      </section>

      <div className="grid gap-3">
        {TYPES.map(typ => (
          <div key={typ.house} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-lg p-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-gold-light font-bold text-sm">{typ.house}.</span>
              <span className="text-gold-light font-bold text-sm">{isHi ? typ.hi : typ.en}</span>
              {!isHi && <span className="text-text-secondary text-xs">({typ.hi})</span>}
              <span className="text-text-secondary text-xs ml-auto">
                {tl({ en: `Rahu in ${typ.house}${typ.house === 1 ? 'st' : typ.house === 2 ? 'nd' : typ.house === 3 ? 'rd' : 'th'} house`, hi: `राहु ${typ.house}वें भाव में`, sa: `राहु ${typ.house}वें भाव में` }, locale)}
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? typ.descHi : typ.descEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Cancellation & Remedies                                   */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Cancellation Conditions', hi: 'निरसन शर्तें', sa: 'निरसन शर्तें' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>काल सर्प दोष कई शर्तों से निरस्त या कमज़ोर हो सकता है। जब ये शर्तें पूर्ण होती हैं, तो दोष प्रभावी रूप से निष्प्रभावित या काफ़ी कम हो जाता है।</>
            : <>Kaal Sarpa Dosha can be cancelled or significantly weakened by several conditions. When these conditions are met, the dosha is effectively neutralized or substantially reduced.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Cancellation Factors', hi: 'निरसन कारक', sa: 'निरसन कारक' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Planet conjunct a node:', hi: 'ग्रह नोड के साथ:', sa: 'ग्रह नोड के साथ:' }, locale)}</span>{' '}
            {tl({ en: 'If any planet occupies the same house as Rahu or Ketu, it breaks the axis and cancels the formation. This is the strongest cancellation.', hi: 'यदि कोई ग्रह राहु या केतु के समान भाव में है, तो यह अक्ष तोड़ता है और दोष निरस्त होता है। यह सबसे प्रबल निरसन है।', sa: 'यदि कोई ग्रह राहु या केतु के समान भाव में है तो दोष निरस्त।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Jupiter aspects nodes:', hi: 'गुरु की नोड्स पर दृष्टि:', sa: 'गुरु की नोड्स पर दृष्टि:' }, locale)}</span>{' '}
            {tl({ en: 'Jupiter\'s benefic aspect (1st, 5th, 7th, or 9th) on Rahu or Ketu provides divine protection and mitigates the dosha\'s effects.', hi: 'गुरु की शुभ दृष्टि (1, 5, 7, या 9वीं) राहु या केतु पर दैवीय सुरक्षा प्रदान करती है और दोष के प्रभाव को कम करती है।', sa: 'गुरु की शुभ दृष्टि राहु या केतु पर दोष को कम करती है।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Nodes in upachaya houses:', hi: 'उपचय भावों में नोड:', sa: 'उपचय भावों में नोड:' }, locale)}</span>{' '}
            {tl({ en: 'If Rahu or Ketu occupy upachaya houses (3rd, 6th, or 11th), the dosha is weakened. Upachaya houses are houses of growth — malefics placed here improve over time.', hi: 'यदि राहु या केतु उपचय भावों (3, 6, 11) में हैं, तो दोष कमज़ोर होता है। उपचय भाव वृद्धि के भाव हैं — यहाँ पापग्रह समय के साथ सुधरते हैं।', sa: 'यदि राहु या केतु उपचय भावों में हैं तो दोष कमज़ोर।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Classical Remedies', hi: 'शास्त्रीय उपाय', sa: 'शास्त्रीय उपाय' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Kaal Sarp Nivaran Puja:', hi: 'काल सर्प निवारण पूजा:', sa: 'काल सर्प निवारण पूजा:' }, locale)}</span>{' '}
            {tl({ en: 'Performed at Trimbakeshwar (Nashik, Maharashtra) — one of the 12 Jyotirlingas. This is considered the most effective remedy by practitioners who recognize this dosha.', hi: 'त्र्यम्बकेश्वर (नासिक, महाराष्ट्र) में की जाती है — 12 ज्योतिर्लिंगों में से एक। इस दोष को मानने वाले ज्योतिषियों द्वारा यह सबसे प्रभावी उपाय माना जाता है।', sa: 'त्र्यम्बकेश्वर में काल सर्प निवारण पूजा।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Nag Panchami worship:', hi: 'नाग पंचमी पूजा:', sa: 'नाग पंचमी पूजा:' }, locale)}</span>{' '}
            {tl({ en: 'Annual worship of serpent deities on Nag Panchami (Shravana Shukla Panchami) with milk offerings and prayers for protection.', hi: 'नाग पंचमी (श्रावण शुक्ल पंचमी) पर सर्प देवताओं की वार्षिक पूजा, दूध अर्पण और सुरक्षा प्रार्थना के साथ।', sa: 'नाग पंचमी पर सर्प देवताओं की पूजा।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Maha Mrityunjaya Mantra:', hi: 'महामृत्युंजय मन्त्र:', sa: 'महामृत्युंजय मन्त्र:' }, locale)}</span>{' '}
            {tl({ en: 'Daily recitation of this powerful Shiva mantra (OM Tryambakam Yajamahe...) is prescribed for protection against the dosha\'s karmic effects.', hi: 'इस शक्तिशाली शिव मन्त्र (ॐ त्र्यम्बकं यजामहे...) का दैनिक जाप दोष के कार्मिक प्रभावों से सुरक्षा के लिए निर्धारित है।', sa: 'महामृत्युंजय मन्त्र का दैनिक जाप।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Perspective', hi: 'आधुनिक दृष्टिकोण', sa: 'आधुनिक दृष्टिकोण' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यह याद रखना महत्वपूर्ण है कि काल सर्प दोष एक विवादास्पद अवधारणा है। शास्त्रीय ज्योतिष के अनेक प्रमुख विद्वान इसे अमान्य मानते हैं क्योंकि यह BPHS, फलदीपिका, सारावली, या किसी अन्य प्राचीन ग्रन्थ में नहीं मिलता। दूसरी ओर, कई समकालीन ज्योतिषी इसे व्यावहारिक अनुभव के आधार पर महत्वपूर्ण मानते हैं। एक जिम्मेदार दृष्टिकोण यह है कि इसे कुण्डली के अन्य तत्वों (ग्रह बल, दशा, गोचर) के सन्दर्भ में देखें, न कि अलग-अलग।</>
            : <>It is important to remember that Kaal Sarpa Dosha is a controversial concept. Many leading scholars of classical Jyotish reject it entirely because it does not appear in BPHS, Phaladeepika, Saravali, or any other ancient text. On the other hand, many contemporary practitioners consider it significant based on practical experience. A responsible approach is to evaluate it in the context of the chart&apos;s other factors (planetary strength, dasha, transits) rather than in isolation. No single dosha defines a life.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module32_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

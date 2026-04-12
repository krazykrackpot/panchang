'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_10_2', phase: 3, topic: 'Vargas', moduleNumber: '10.2',
  title: { en: 'Navamsha Deep Dive (D9)', hi: 'नवांश गहन अध्ययन (D9)' },
  subtitle: {
    en: 'Each sign divided into 9 parts of 3°20\' — the most important divisional chart for marriage, dharma, and inner planetary strength',
    hi: 'प्रत्येक राशि 3°20\' के 9 भागों में विभक्त — विवाह, धर्म और ग्रहों के आन्तरिक बल के लिए सर्वाधिक महत्त्वपूर्ण विभागीय कुण्डली',
  },
  estimatedMinutes: 18,
  crossRefs: [
    { label: { en: 'Module 10-1: Varga Charts Overview', hi: 'मॉड्यूल 10-1: वर्ग कुण्डली अवलोकन' }, href: '/learn/modules/10-1' },
    { label: { en: 'Module 10-3: Dasamsha & Other Vargas', hi: 'मॉड्यूल 10-3: दशांश एवं अन्य वर्ग' }, href: '/learn/modules/10-3' },
    { label: { en: 'Vargas Reference', hi: 'वर्ग सन्दर्भ' }, href: '/learn/vargas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q10_2_01', type: 'mcq',
    question: {
      en: 'How many degrees does each Navamsha division span within a sign?',
      hi: 'एक राशि में प्रत्येक नवांश विभाग कितने अंशों में फैला होता है?',
    },
    options: [
      { en: '2°30\'', hi: '2°30\'' },
      { en: '3°20\'', hi: '3°20\'' },
      { en: '4°17\'', hi: '4°17\'' },
      { en: '3°00\'', hi: '3°00\'' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each sign of 30 degrees is divided into 9 equal parts for the Navamsha. 30 ÷ 9 = 3°20\' (3 degrees and 20 minutes of arc). Each 3°20\' segment maps to a specific Navamsha sign.',
      hi: 'नवांश के लिए प्रत्येक 30 अंश की राशि को 9 समान भागों में विभाजित किया जाता है। 30 ÷ 9 = 3°20\' (3 अंश और 20 कला)। प्रत्येक 3°20\' का खण्ड एक विशिष्ट नवांश राशि में स्थित होता है।',
    },
  },
  {
    id: 'q10_2_02', type: 'mcq',
    question: {
      en: 'For fire signs (Aries, Leo, Sagittarius), the Navamsha count begins from which sign?',
      hi: 'अग्नि तत्त्व राशियों (मेष, सिंह, धनु) के लिए नवांश गणना किस राशि से आरम्भ होती है?',
    },
    options: [
      { en: 'Cancer', hi: 'कर्क' },
      { en: 'Libra', hi: 'तुला' },
      { en: 'Aries', hi: 'मेष' },
      { en: 'Capricorn', hi: 'मकर' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Navamsha starting sign follows the element: Fire signs (Aries, Leo, Sag) start from Aries. Earth signs (Taurus, Virgo, Cap) start from Capricorn. Air signs (Gemini, Libra, Aquarius) start from Libra. Water signs (Cancer, Scorpio, Pisces) start from Cancer.',
      hi: 'नवांश की आरम्भिक राशि तत्त्व के अनुसार होती है: अग्नि राशियाँ (मेष, सिंह, धनु) मेष से, पृथ्वी राशियाँ (वृषभ, कन्या, मकर) मकर से, वायु राशियाँ (मिथुन, तुला, कुम्भ) तुला से, और जल राशियाँ (कर्क, वृश्चिक, मीन) कर्क से आरम्भ होती हैं।',
    },
  },
  {
    id: 'q10_2_03', type: 'mcq',
    question: {
      en: 'A planet at 15° Aries falls in which Navamsha? (Aries Navamsha starts from Aries)',
      hi: '15° मेष पर स्थित ग्रह किस नवांश में आता है? (मेष का नवांश मेष से आरम्भ होता है)',
    },
    options: [
      { en: '4th Navamsha — Cancer', hi: 'चतुर्थ नवांश — कर्क' },
      { en: '5th Navamsha — Leo', hi: 'पञ्चम नवांश — सिंह' },
      { en: '6th Navamsha — Virgo', hi: 'षष्ठ नवांश — कन्या' },
      { en: '3rd Navamsha — Gemini', hi: 'तृतीय नवांश — मिथुन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '15° ÷ 3°20\' = 4.5, so the planet is in the 5th Navamsha. Counting from Aries (the starting point for fire signs): Aries(1), Taurus(2), Gemini(3), Cancer(4), Leo(5). The 5th Navamsha of Aries is Leo.',
      hi: '15° ÷ 3°20\' = 4.5, अतः ग्रह 5वें नवांश में है। मेष से गणना करें (अग्नि राशियों का आरम्भ बिन्दु): मेष(1), वृषभ(2), मिथुन(3), कर्क(4), सिंह(5)। मेष का 5वाँ नवांश सिंह है।',
    },
  },
  {
    id: 'q10_2_04', type: 'true_false',
    question: {
      en: 'The 7th house of the Navamsha chart is used to assess the qualities and nature of the spouse.',
      hi: 'नवांश कुण्डली का सप्तम भाव पति/पत्नी के गुणों और स्वभाव का आकलन करने में प्रयुक्त होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The 7th house of D9 is one of the most critical indicators of spouse qualities. The sign on the 7th cusp, planets in the 7th, and the 7th lord\'s placement all describe the partner\'s nature, appearance tendencies, and the quality of marital life.',
      hi: 'सत्य। D9 का सप्तम भाव पति/पत्नी के गुणों का सबसे महत्त्वपूर्ण सूचक है। सप्तम भाव की राशि, उसमें स्थित ग्रह, और सप्तमेश की स्थिति — सब मिलकर जीवनसाथी के स्वभाव, रूप-प्रवृत्ति और वैवाहिक जीवन की गुणवत्ता का वर्णन करते हैं।',
    },
  },
  {
    id: 'q10_2_05', type: 'mcq',
    question: {
      en: 'Venus\'s placement in the Navamsha primarily reveals:',
      hi: 'नवांश में शुक्र की स्थिति मुख्य रूप से क्या प्रकट करती है?',
    },
    options: [
      { en: 'Career ambitions', hi: 'व्यावसायिक महत्त्वाकांक्षाएँ' },
      { en: 'The native\'s romantic nature, capacity for love, and marital harmony', hi: 'जातक का रोमांटिक स्वभाव, प्रेम की क्षमता और वैवाहिक सौहार्द' },
      { en: 'Physical health and longevity', hi: 'शारीरिक स्वास्थ्य और दीर्घायु' },
      { en: 'Relationship with father', hi: 'पिता से सम्बन्ध' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Venus is the natural karaka (significator) of marriage, love, and romance. Its Navamsha placement shows the depth of romantic feelings, aesthetic sensibilities, and the capacity for marital happiness. Venus in own/exalted Navamsha sign gives strong romantic fulfillment.',
      hi: 'शुक्र विवाह, प्रेम और रोमांस का नैसर्गिक कारक है। इसकी नवांश स्थिति रोमांटिक भावनाओं की गहराई, सौन्दर्यबोध और वैवाहिक सुख की क्षमता दिखाती है। स्वगृह/उच्च नवांश राशि में शुक्र प्रबल रोमांटिक सन्तुष्टि देता है।',
    },
  },
  {
    id: 'q10_2_06', type: 'true_false',
    question: {
      en: 'Vargottama status occurs when a planet is in the first 3°20\' of every sign without exception.',
      hi: 'वर्गोत्तम स्थिति तब होती है जब ग्रह बिना किसी अपवाद के प्रत्येक राशि के प्रथम 3°20\' में हो।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Vargottama occurs at different degree ranges depending on the sign type: first 3°20\' of cardinal signs (Aries, Cancer, Libra, Capricorn), middle portion (13°20\'-16°40\') of fixed signs (Taurus, Leo, Scorpio, Aquarius), and last 3°20\' (26°40\'-30°) of dual signs (Gemini, Virgo, Sagittarius, Pisces).',
      hi: 'असत्य। वर्गोत्तम राशि के प्रकार के अनुसार भिन्न अंशों पर होता है: चर राशियों (मेष, कर्क, तुला, मकर) के प्रथम 3°20\' में, स्थिर राशियों (वृषभ, सिंह, वृश्चिक, कुम्भ) के मध्य भाग (13°20\'-16°40\') में, और द्विस्वभाव राशियों (मिथुन, कन्या, धनु, मीन) के अन्तिम 3°20\' (26°40\'-30°) में।',
    },
  },
  {
    id: 'q10_2_07', type: 'mcq',
    question: {
      en: 'The Navamsha Lagna lord\'s placement in the D9 chart indicates:',
      hi: 'D9 कुण्डली में नवांश लग्नेश की स्थिति क्या दर्शाती है?',
    },
    options: [
      { en: 'The native\'s wealth accumulation pattern', hi: 'जातक का धन संचय प्रतिरूप' },
      { en: 'The overall quality and happiness of married life', hi: 'वैवाहिक जीवन की समग्र गुणवत्ता और सुख' },
      { en: 'The number of children the native will have', hi: 'जातक की सन्तानों की संख्या' },
      { en: 'The native\'s spiritual guru', hi: 'जातक के आध्यात्मिक गुरु' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Navamsha Lagna lord represents the self within the marriage context. When well-placed (in kendra/trikona, own/exalted sign), it indicates marital contentment and a supportive partnership. When afflicted, it points to dissatisfaction or challenges in sustaining harmony.',
      hi: 'नवांश लग्नेश विवाह के सन्दर्भ में स्वयं का प्रतिनिधित्व करता है। जब अच्छी स्थिति में हो (केन्द्र/त्रिकोण, स्वगृह/उच्च) तो वैवाहिक सन्तोष और सहयोगी साझेदारी दर्शाता है। पीड़ित होने पर सामंजस्य बनाए रखने में असन्तोष या चुनौतियों की ओर संकेत करता है।',
    },
  },
  {
    id: 'q10_2_08', type: 'mcq',
    question: {
      en: 'For earth signs (Taurus, Virgo, Capricorn), Navamsha counting starts from:',
      hi: 'पृथ्वी तत्त्व राशियों (वृषभ, कन्या, मकर) के लिए नवांश गणना किससे आरम्भ होती है?',
    },
    options: [
      { en: 'Aries', hi: 'मेष' },
      { en: 'Libra', hi: 'तुला' },
      { en: 'Cancer', hi: 'कर्क' },
      { en: 'Capricorn', hi: 'मकर' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'Earth signs start their Navamsha count from Capricorn. So the first Navamsha of Taurus is Capricorn, the second is Aquarius, the third is Pisces, and so on. This follows the element-based starting rule: Fire→Aries, Earth→Capricorn, Air→Libra, Water→Cancer.',
      hi: 'पृथ्वी राशियाँ अपनी नवांश गणना मकर से आरम्भ करती हैं। इसलिए वृषभ का प्रथम नवांश मकर, द्वितीय कुम्भ, तृतीय मीन, इत्यादि। यह तत्त्व-आधारित नियम है: अग्नि→मेष, पृथ्वी→मकर, वायु→तुला, जल→कर्क।',
    },
  },
  {
    id: 'q10_2_09', type: 'true_false',
    question: {
      en: 'A Vargottama Lagna (ascendant in same sign in D1 and D9) is considered a significant strength in the horoscope.',
      hi: 'वर्गोत्तम लग्न (D1 और D9 में एक ही राशि में लग्न) कुण्डली में एक महत्त्वपूर्ण बल माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. A Vargottama Lagna gives the native a strong, coherent personality where the outer persona and inner character are aligned. It strengthens the overall chart considerably and is treated with the dignity of being in its own sign.',
      hi: 'सत्य। वर्गोत्तम लग्न जातक को एक सुदृढ़, सुसंगत व्यक्तित्व देता है जहाँ बाह्य रूप और आन्तरिक चरित्र एकरूप होते हैं। यह समग्र कुण्डली को काफी बल देता है और इसे स्वराशि की गरिमा के समान माना जाता है।',
    },
  },
  {
    id: 'q10_2_10', type: 'mcq',
    question: {
      en: 'Pushkara Navamsha positions always fall in signs ruled by:',
      hi: 'पुष्कर नवांश स्थितियाँ सदैव किनके स्वामित्व वाली राशियों में आती हैं?',
    },
    options: [
      { en: 'Mars and Saturn (malefics)', hi: 'मंगल और शनि (पापग्रह)' },
      { en: 'Sun and Mars (fiery planets)', hi: 'सूर्य और मंगल (अग्नि ग्रह)' },
      { en: 'Benefics — Jupiter, Venus, Moon, Mercury', hi: 'शुभ ग्रह — बृहस्पति, शुक्र, चन्द्रमा, बुध' },
      { en: 'Only Jupiter and Venus', hi: 'केवल बृहस्पति और शुक्र' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Pushkara Navamsha positions always fall in signs owned by natural benefics: Cancer (Moon), Sagittarius/Pisces (Jupiter), Taurus/Libra (Venus), and Gemini/Virgo (Mercury). This ensures the nourishing, auspicious quality of these special degrees. A planet in Pushkara Navamsha receives inherent beneficence.',
      hi: 'पुष्कर नवांश स्थितियाँ सदैव नैसर्गिक शुभ ग्रहों की राशियों में आती हैं: कर्क (चन्द्रमा), धनु/मीन (बृहस्पति), वृषभ/तुला (शुक्र), और मिथुन/कन्या (बुध)। इससे इन विशेष अंशों की पोषक, शुभ गुणवत्ता सुनिश्चित होती है। पुष्कर नवांश में स्थित ग्रह स्वभावतः शुभता प्राप्त करता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Navamsha Calculation — The Mathematics
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Navamsha divides each 30-degree sign into <span className="text-gold-light font-medium">9 equal parts of 3°20'</span> (3 degrees and 20 minutes of arc). The crucial rule is which sign the first Navamsha maps to — this depends on the element of the rashi:
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { element: 'Fire', elementHi: 'अग्नि', signs: 'Aries, Leo, Sagittarius', signsHi: 'मेष, सिंह, धनु', start: 'Aries', startHi: 'मेष' },
              { element: 'Earth', elementHi: 'पृथ्वी', signs: 'Taurus, Virgo, Capricorn', signsHi: 'वृषभ, कन्या, मकर', start: 'Capricorn', startHi: 'मकर' },
              { element: 'Air', elementHi: 'वायु', signs: 'Gemini, Libra, Aquarius', signsHi: 'मिथुन, तुला, कुम्भ', start: 'Libra', startHi: 'तुला' },
              { element: 'Water', elementHi: 'जल', signs: 'Cancer, Scorpio, Pisces', signsHi: 'कर्क, वृश्चिक, मीन', start: 'Cancer', startHi: 'कर्क' },
            ].map(e => (
              <div key={e.element} className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
                <span className="text-gold-light font-bold text-xs">{isHi ? e.elementHi : e.element}</span>
                <p className="text-text-secondary/70 text-xs mt-1">{isHi ? e.signsHi : e.signs}</p>
                <p className="text-emerald-400 text-xs mt-1">{isHi ? `${e.startHi} से आरम्भ` : `Starts from: ${e.start}`}</p>
              </div>
            ))}
          </div>
        </div>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Worked Example:</span> A planet at 15° Aries. Aries is a fire sign, so Navamsha counting starts from Aries. Divide 15 by 3.333 (which is 3°20' in decimal): 15 ÷ 3.333 = 4.5. Take the ceiling: this is the 5th Navamsha. Counting from Aries: Aries(1), Taurus(2), Gemini(3), Cancer(4), <span className="text-gold-light font-medium">Leo(5)</span>. The planet is in Leo Navamsha — it takes on the inner qualities of Leo: pride, creativity, leadership from within.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Quick-Reference: 108 Navamshas</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          12 signs times 9 divisions = 108 total Navamshas. This sacred number (108) is not coincidental — it connects to the 108 beads of a japa mala, the 108 Upanishads, and reflects the completeness of the zodiacal-divisional framework. Each of the 108 Navamshas has a unique quality determined by the combination of rashi sign and Navamsha sign.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Navamsha cycle completes every 4 signs. Aries starts from Aries and ends at Pisces (9 Navamshas). Taurus starts from Capricorn and ends at Scorpio. By the time you reach Cancer (4th sign), the Navamsha is back at Cancer — and the cycle of 4 signs (one per element) repeats. This elegant mathematical structure ensures every Navamsha sign appears exactly 12 times across the zodiac.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Navamsha and Marriage
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The D9 chart is the single most important reference for marriage predictions. Classical texts are unambiguous: <span className="text-gold-light font-medium">the Navamsha is consulted for EVERY marriage-related question</span> — spouse qualities, timing of marriage, marital happiness, and potential for separation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">The 7th house of D9</span> describes the spouse's essential nature. The sign on the 7th cusp gives basic temperament. Planets in the 7th modify this — benefics (Jupiter, Venus, well-placed Moon) indicate a harmonious, supportive partner; malefics (Saturn, Mars, Rahu) suggest challenges, delays, or a partner with a strong/difficult personality. The 7th lord's placement shows where the spouse's primary focus lies.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-gold-light font-medium">Venus in D9</span> is especially telling. As the natural karaka of marriage, Venus's Navamsha sign reveals the romantic nature at the deepest level. Venus in a water-sign Navamsha (Cancer, Scorpio, Pisces) indicates deep emotional bonds; in air signs (Gemini, Libra, Aquarius), intellectual companionship matters most; in fire signs (Aries, Leo, Sagittarius), passion and adventure drive relationships; in earth signs (Taurus, Virgo, Capricorn), stability and material security are valued.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Navamsha Lagna Lord — The Key to Marital Happiness</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The lord of the Navamsha Lagna represents the native within the context of partnerships. Its placement tells the story of marital satisfaction:
        </p>
        <div className="space-y-1.5 mt-2">
          {[
            { placement: 'In kendra (1, 4, 7, 10)', placementHi: 'केन्द्र में (1, 4, 7, 10)', result: 'Strong marital foundation, active partnership', resultHi: 'सुदृढ़ वैवाहिक आधार, सक्रिय साझेदारी' },
            { placement: 'In trikona (1, 5, 9)', placementHi: 'त्रिकोण में (1, 5, 9)', result: 'Dharmic alignment with partner, shared values', resultHi: 'साथी के साथ धार्मिक सामंजस्य, साझा मूल्य' },
            { placement: 'In dusthana (6, 8, 12)', placementHi: 'दुःस्थान में (6, 8, 12)', result: 'Challenges — conflict (6th), secrecy/crisis (8th), loss/distance (12th)', resultHi: 'चुनौतियाँ — विवाद (6), गोपनीयता/संकट (8), हानि/दूरी (12)' },
            { placement: 'In own/exalted sign', placementHi: 'स्वगृह/उच्च राशि में', result: 'Self-assured in relationships, natural harmony', resultHi: 'सम्बन्धों में आत्मविश्वासी, स्वाभाविक सौहार्द' },
          ].map((item, i) => (
            <div key={i} className="bg-bg-primary/40 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-gold-light text-xs font-medium">{isHi ? item.placementHi : item.placement}</span>
              <span className="text-text-secondary/70 text-xs ml-2">→ {isHi ? item.resultHi : item.result}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Marriage Timing with D9</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Marriage typically occurs during the Dasha or Antardasha of planets connected to the D9's 7th house — its lord, occupants, or planets aspecting it. When the D1 dasha lord also activates the D9's marriage significators, the probability of marriage is very high.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example:</span> If Jupiter is the 7th lord of D9 and the native is running Jupiter Mahadasha or Jupiter Antardasha, marriage is strongly indicated — especially if transiting Jupiter also aspects the 7th house of D1 or D9 simultaneously.
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Vargottama Planets and Pushkara Degrees
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">Vargottama</span> — a planet in the same sign in both D1 and D9 — is one of the most valued conditions in Jyotish. It means the planet's outer expression (rashi) and inner nature (Navamsha) are perfectly harmonized. The planet acts with authenticity and integrated strength.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vargottama occurs in specific degree ranges that depend on the sign's modality:
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Vargottama Degree Ranges</h4>
        <div className="space-y-2">
          {[
            { type: 'Cardinal Signs', typeHi: 'चर राशियाँ', signs: 'Aries, Cancer, Libra, Capricorn', signsHi: 'मेष, कर्क, तुला, मकर', range: '0°00\' — 3°20\'', note: 'First Navamsha = same sign' },
            { type: 'Fixed Signs', typeHi: 'स्थिर राशियाँ', signs: 'Taurus, Leo, Scorpio, Aquarius', signsHi: 'वृषभ, सिंह, वृश्चिक, कुम्भ', range: '13°20\' — 16°40\'', note: '5th Navamsha = same sign' },
            { type: 'Dual Signs', typeHi: 'द्विस्वभाव राशियाँ', signs: 'Gemini, Virgo, Sagittarius, Pisces', signsHi: 'मिथुन, कन्या, धनु, मीन', range: '26°40\' — 30°00\'', note: '9th Navamsha = same sign' },
          ].map(item => (
            <div key={item.type} className="bg-bg-primary/40 rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-gold-light font-bold text-xs">{isHi ? item.typeHi : item.type}</span>
                <span className="text-emerald-400 font-mono text-xs">{item.range}</span>
              </div>
              <p className="text-text-secondary/70 text-xs mt-1">{isHi ? item.signsHi : item.signs}</p>
              <p className="text-text-secondary/70 text-xs mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Pushkara Navamsha — The Nourishing Degrees</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Certain Navamsha positions are called <span className="text-gold-light font-medium">Pushkara</span> (nourishing). These are specific degree ranges in each sign where the resulting Navamsha falls in a sign ruled by a natural benefic (Jupiter, Venus, Moon, or Mercury). A planet in Pushkara Navamsha gets an inherent boost — like planting a seed in the most fertile soil.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The Pushkara Navamshas are especially valued in Muhurta (electional astrology) — starting an important event when the Moon or Lagna is in a Pushkara Navamsha degree is considered highly auspicious. They are also meaningful in Prashna (horary astrology) as indicators of favorable outcomes.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Note on Pushkara Bhaga:</span> Related but distinct from Pushkara Navamsha are Pushkara Bhagas — specific individual degrees (one per sign) that are considered supremely auspicious. These are even more precise and powerful, often used in electional timing for critical events like marriages and temple consecrations.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara dedicates extensive chapters in BPHS to the Navamsha, stating it is the most important varga for assessing planetary strength and marital destiny. Mantreshwara in Phaladeepika (Chapter 15) elaborates on reading the D9 for spouse characteristics. Varahamihira in Brihat Jataka uses the Navamsha extensively for determining the true functional nature of planets. The unanimous classical consensus: no chart reading is complete without the Navamsha.
        </p>
      </section>
    </div>
  );
}

export default function Module10_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

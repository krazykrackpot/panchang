'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_19_4', phase: 6, topic: 'Jaimini', moduleNumber: '19.4',
  title: { en: 'Special Lagnas — Hora, Ghati, Bhava, Varnada', hi: 'विशेष लग्न — होरा, घटी, भाव, वर्णद' },
  subtitle: {
    en: 'Beyond the birth Ascendant — Jaimini\'s multiple reference points for wealth, power, and life purpose',
    hi: 'जन्म लग्न से परे — धन, शक्ति और जीवन उद्देश्य के लिए जैमिनी के बहुविध सन्दर्भ बिन्दु',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 19-1: Chara Karakas', hi: 'मॉड्यूल 19-1: चर कारक' }, href: '/learn/modules/19-1' },
    { label: { en: 'Module 19-2: Rashi Drishti', hi: 'मॉड्यूल 19-2: राशि दृष्टि' }, href: '/learn/modules/19-2' },
    { label: { en: 'Module 19-3: Argala', hi: 'मॉड्यूल 19-3: अर्गला' }, href: '/learn/modules/19-3' },
    { label: { en: 'Kundali Generator', hi: 'कुण्डली निर्माता' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q19_4_01', type: 'mcq',
    question: {
      en: 'Hora Lagna (HL) is primarily an indicator of:',
      hi: 'होरा लग्न (HL) मुख्यतः किसका सूचक है?',
    },
    options: [
      { en: 'Health and longevity', hi: 'स्वास्थ्य और दीर्घायु' },
      { en: 'Wealth and financial prosperity', hi: 'धन और आर्थिक समृद्धि' },
      { en: 'Marriage and relationships', hi: 'विवाह और सम्बन्ध' },
      { en: 'Spiritual attainment', hi: 'आध्यात्मिक उपलब्धि' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Hora Lagna is the primary wealth indicator in Jaimini astrology. It advances one sign per hora (2.5 hours) from sunrise. Its position, the planets aspecting it, and the Argala on it reveal the native\'s financial destiny.',
      hi: 'होरा लग्न जैमिनी ज्योतिष में प्राथमिक धन सूचक है। यह सूर्योदय से प्रत्येक होरा (2.5 घण्टे) में एक राशि आगे बढ़ता है। इसकी स्थिति, इसे दृष्ट करने वाले ग्रह और इस पर अर्गला जातक की आर्थिक नियति प्रकट करते हैं।',
    },
  },
  {
    id: 'q19_4_02', type: 'mcq',
    question: {
      en: 'Ghati Lagna (GL) advances one sign per:',
      hi: 'घटी लग्न (GL) प्रत्येक कितने समय में एक राशि आगे बढ़ता है?',
    },
    options: [
      { en: '2.5 hours (1 hora)', hi: '2.5 घण्टे (1 होरा)' },
      { en: '24 minutes (1 ghati/nadika)', hi: '24 मिनट (1 घटी/नाडिका)' },
      { en: '1 hour', hi: '1 घण्टा' },
      { en: '12 minutes', hi: '12 मिनट' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ghati Lagna advances one sign per ghati (also called nadika), which equals 24 minutes. Since there are 60 ghatis in a day (24 hours / 24 minutes = 60), the GL cycles through all 12 signs five times per day, making it very sensitive to exact birth time.',
      hi: 'घटी लग्न प्रत्येक घटी (नाडिका भी कहलाती है) में एक राशि आगे बढ़ता है, जो 24 मिनट के बराबर है। चूँकि एक दिन में 60 घटियाँ होती हैं (24 घण्टे / 24 मिनट = 60), GL प्रतिदिन सभी 12 राशियों में पाँच बार चक्र पूरा करता है, जिससे यह सटीक जन्म समय के प्रति अत्यन्त संवेदनशील है।',
    },
  },
  {
    id: 'q19_4_03', type: 'true_false',
    question: {
      en: 'Ghati Lagna is primarily used to assess authority, power, and social standing.',
      hi: 'घटी लग्न मुख्यतः अधिकार, शक्ति और सामाजिक प्रतिष्ठा का मूल्यांकन करने के लिए प्रयुक्त होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. While Hora Lagna deals with wealth, Ghati Lagna is the indicator of authority, power, fame, and social status. Planets conjunct or aspecting the GL reveal the nature of the native\'s authority and public standing.',
      hi: 'सत्य। जहाँ होरा लग्न धन से सम्बन्धित है, वहीं घटी लग्न अधिकार, शक्ति, यश और सामाजिक प्रतिष्ठा का सूचक है। GL से युक्त या दृष्ट ग्रह जातक के अधिकार और सार्वजनिक प्रतिष्ठा की प्रकृति प्रकट करते हैं।',
    },
  },
  {
    id: 'q19_4_04', type: 'mcq',
    question: {
      en: 'To compute Hora Lagna, you need to know:',
      hi: 'होरा लग्न गणित करने के लिए जानना आवश्यक है:',
    },
    options: [
      { en: 'Only the birth date', hi: 'केवल जन्म तिथि' },
      { en: 'The sunrise time and birth time', hi: 'सूर्योदय का समय और जन्म का समय' },
      { en: 'Only the Moon\'s position', hi: 'केवल चन्द्रमा की स्थिति' },
      { en: 'The Ayanamsha value', hi: 'अयनांश मान' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Hora Lagna is computed by counting hours from sunrise to birth, dividing by 2.5 to get the number of horas elapsed, and advancing that many signs from the Sun\'s sign. Both sunrise time and birth time are essential.',
      hi: 'होरा लग्न की गणना सूर्योदय से जन्म तक के घण्टे गिनकर, 2.5 से भाग देकर बीती होराओं की संख्या प्राप्त करके, और सूर्य की राशि से उतनी राशियाँ आगे बढ़ाकर की जाती है। सूर्योदय का समय और जन्म का समय दोनों आवश्यक हैं।',
    },
  },
  {
    id: 'q19_4_05', type: 'mcq',
    question: {
      en: 'If a person is born 7.5 hours after sunrise and the Sun is in Aries, the Hora Lagna is in:',
      hi: 'यदि कोई व्यक्ति सूर्योदय के 7.5 घण्टे बाद जन्मा और सूर्य मेष में है, तो होरा लग्न किस राशि में है?',
    },
    options: [
      { en: 'Aries (no change)', hi: 'मेष (कोई परिवर्तन नहीं)' },
      { en: 'Cancer (3 signs ahead)', hi: 'कर्क (3 राशियाँ आगे)' },
      { en: 'Taurus (1 sign ahead)', hi: 'वृषभ (1 राशि आगे)' },
      { en: 'Leo (4 signs ahead)', hi: 'सिंह (4 राशियाँ आगे)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '7.5 hours / 2.5 hours per hora = 3 horas elapsed. Starting from the Sun\'s sign (Aries = sign 1), advance 3 signs: Aries → Taurus → Gemini → Cancer. The Hora Lagna is in Cancer.',
      hi: '7.5 घण्टे / 2.5 घण्टे प्रति होरा = 3 होरा बीतीं। सूर्य की राशि (मेष = राशि 1) से 3 राशियाँ आगे: मेष → वृषभ → मिथुन → कर्क। होरा लग्न कर्क में है।',
    },
  },
  {
    id: 'q19_4_06', type: 'true_false',
    question: {
      en: 'Bhava Lagna is another wealth-related reference point, distinct from Hora Lagna.',
      hi: 'भाव लग्न धन से सम्बन्धित एक अन्य सन्दर्भ बिन्दु है, जो होरा लग्न से भिन्न है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. While both Hora Lagna and Bhava Lagna relate to wealth and sustenance, they are computed differently and provide complementary perspectives. Bhava Lagna is sometimes used to cross-check the financial indications of Hora Lagna.',
      hi: 'सत्य। यद्यपि होरा लग्न और भाव लग्न दोनों धन और जीविका से सम्बन्धित हैं, उनकी गणना भिन्न है और वे पूरक दृष्टिकोण प्रदान करते हैं। भाव लग्न का प्रयोग कभी-कभी होरा लग्न के आर्थिक संकेतों की पारस्परिक जाँच के लिए किया जाता है।',
    },
  },
  {
    id: 'q19_4_07', type: 'mcq',
    question: {
      en: 'Varnada Lagna is used to determine:',
      hi: 'वर्णद लग्न किसे निर्धारित करने के लिए प्रयुक्त होता है?',
    },
    options: [
      { en: 'The native\'s wealth potential', hi: 'जातक की धन सम्भावना' },
      { en: 'The native\'s true social role or calling (varna)', hi: 'जातक की सच्ची सामाजिक भूमिका या पुकार (वर्ण)' },
      { en: 'The native\'s health and longevity', hi: 'जातक का स्वास्थ्य और दीर्घायु' },
      { en: 'The native\'s marriage timing', hi: 'जातक के विवाह का समय' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Varnada Lagna reveals the native\'s true varna (calling/purpose) — their fundamental role in society. Its lord and the planets aspecting it determine the nature of one\'s contribution to the world, beyond just career or profession.',
      hi: 'वर्णद लग्न जातक का सच्चा वर्ण (पुकार/उद्देश्य) प्रकट करता है — समाज में उनकी मूलभूत भूमिका। इसका स्वामी और दृष्ट करने वाले ग्रह संसार में व्यक्ति के योगदान की प्रकृति निर्धारित करते हैं, केवल जीविका या व्यवसाय से परे।',
    },
  },
  {
    id: 'q19_4_08', type: 'mcq',
    question: {
      en: 'The computation of Varnada Lagna depends on the relationship between:',
      hi: 'वर्णद लग्न की गणना किनके सम्बन्ध पर निर्भर करती है?',
    },
    options: [
      { en: 'The Moon and the Sun', hi: 'चन्द्रमा और सूर्य' },
      { en: 'The Lagna and the Hora Lagna', hi: 'लग्न और होरा लग्न' },
      { en: 'The Atmakaraka and Amatyakaraka', hi: 'आत्मकारक और अमात्यकारक' },
      { en: 'Jupiter and Saturn', hi: 'बृहस्पति और शनि' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Varnada Lagna is computed based on the relationship between the birth Lagna and the Hora Lagna. Whether both are in odd signs, both in even signs, or mixed determines the counting direction (from Aries forward or from Pisces backward).',
      hi: 'वर्णद लग्न की गणना जन्म लग्न और होरा लग्न के सम्बन्ध पर आधारित है। दोनों विषम राशियों में हैं, दोनों सम में, या मिश्रित — यह गणना की दिशा (मेष से आगे या मीन से पीछे) निर्धारित करता है।',
    },
  },
  {
    id: 'q19_4_09', type: 'true_false',
    question: {
      en: 'Since Ghati Lagna changes sign every 24 minutes, even a small error in birth time can significantly alter the GL.',
      hi: 'चूँकि घटी लग्न प्रत्येक 24 मिनट में राशि बदलता है, जन्म समय में छोटी-सी त्रुटि भी GL को महत्त्वपूर्ण रूप से बदल सकती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. With a new sign every 24 minutes, even a 10-15 minute error in recorded birth time could place the Ghati Lagna in a completely different sign. This makes GL one of the most time-sensitive points in Jaimini astrology, and accurate birth time rectification is essential.',
      hi: 'सत्य। प्रत्येक 24 मिनट में नई राशि के साथ, अंकित जन्म समय में 10-15 मिनट की त्रुटि भी घटी लग्न को पूर्णतया भिन्न राशि में रख सकती है। यह GL को जैमिनी ज्योतिष के सर्वाधिक समय-संवेदनशील बिन्दुओं में से एक बनाता है, और सटीक जन्म समय शोधन आवश्यक है।',
    },
  },
  {
    id: 'q19_4_10', type: 'mcq',
    question: {
      en: 'If the Lagna is in an odd sign (Aries) and the Hora Lagna is also in an odd sign (Leo), Varnada Lagna is computed by counting:',
      hi: 'यदि लग्न विषम राशि (मेष) में है और होरा लग्न भी विषम राशि (सिंह) में है, तो वर्णद लग्न की गणना किस प्रकार होती है?',
    },
    options: [
      { en: 'Forward from Aries', hi: 'मेष से आगे गिनकर' },
      { en: 'Backward from Pisces', hi: 'मीन से पीछे गिनकर' },
      { en: 'Forward from the Moon\'s sign', hi: 'चन्द्रमा की राशि से आगे गिनकर' },
      { en: 'No counting needed — it equals the Lagna', hi: 'कोई गणना नहीं — यह लग्न के बराबर है' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'When both Lagna and Hora Lagna are in odd signs, the count for Varnada Lagna proceeds forward from Aries. The number of signs counted equals the sum of the distances of Lagna and HL from Aries. When both are in even signs, you count backward from Pisces.',
      hi: 'जब लग्न और होरा लग्न दोनों विषम राशियों में हों, वर्णद लग्न की गणना मेष से आगे गिनकर होती है। गिनी गई राशियों की संख्या लग्न और HL की मेष से दूरी के योग के बराबर है। जब दोनों सम राशियों में हों, मीन से पीछे गिना जाता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'जन्म लग्न से परे' : 'Beyond the Birth Lagna'}
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
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'भाव लग्न — द्वितीय धन बिन्दु' : 'Bhava Lagna — The Second Wealth Point'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Bhava Lagna (BL) is another wealth and sustenance indicator that complements Hora Lagna. While HL focuses on accumulated wealth, BL often relates to ongoing sustenance and the ability to maintain oneself. Some Jaimini scholars consider BL particularly relevant for assessing the native&apos;s capacity to earn a livelihood, as distinct from inherited or windfall wealth shown by HL. When both HL and BL fall in strong signs with benefic aspects, the native enjoys robust financial health throughout life.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'होरा लग्न की गणना' : 'Computing Hora Lagna'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गणना एक स्पष्ट क्रमविधि का पालन करती है: (1) जन्म तिथि और स्थान के लिए सटीक सूर्योदय समय निर्धारित करें। (2) सूर्योदय से जन्म तक बीता समय घण्टों में गणित करें। (3) 2.5 से भाग दें ताकि बीती होराओं की संख्या मिले। (4) पूर्ण संख्या भाग बताता है कि सूर्य की राशि से कितनी राशियाँ आगे बढ़ानी हैं। भिन्नात्मक भाग उस राशि में अंश देता है। उदाहरण: सूर्योदय के 7.5 घण्टे बाद जन्म, सूर्य मेष में: 7.5 / 2.5 = 3.0 होरा। मेष से 3 राशियाँ: मेष(0) → वृषभ(1) → मिथुन(2) → कर्क(3)। HL = कर्क।</>
            : <>The computation follows a clear algorithm: (1) Determine the exact sunrise time for the birth date and location. (2) Calculate the elapsed time from sunrise to birth in hours. (3) Divide by 2.5 to get the number of horas elapsed. (4) The whole number portion tells you how many signs to advance from the Sun&apos;s sign. The fractional part gives the degree within that sign. For example, if born 7.5 hours after sunrise with Sun in Aries: 7.5 / 2.5 = 3.0 horas. Advance 3 signs from Aries: Aries(0) → Taurus(1) → Gemini(2) → Cancer(3). HL = Cancer.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित गणना: दोपहर 2 बजे का जन्म' : 'Worked Calculation: 2 PM Birth'}</h4>
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
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
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
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'वर्णद लग्न — सर्वाधिक जटिल' : 'Varnada Lagna — The Most Complex'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वर्णद लग्न की गणना जन्म लग्न और होरा लग्न के सम्बन्ध से होती है। क्रमविधि इस पर निर्भर करती है कि ये दो बिन्दु विषम या सम राशियों में हैं। <strong>नियम 1:</strong> यदि लग्न और HL दोनों विषम राशियों में हों, मेष से प्रत्येक तक आगे गिनें, गणनाओं का योग करें, और वह योग मेष से आगे गिनें। <strong>नियम 2:</strong> यदि दोनों सम में हों, मीन से प्रत्येक तक पीछे गिनें, योग करें, और वह योग मीन से पीछे गिनें। <strong>नियम 3:</strong> यदि एक विषम और दूसरा सम हो, मिश्र विधि प्रयुक्त होती है।</>
            : <>Varnada Lagna is computed from the relationship between the birth Lagna and the Hora Lagna. The algorithm depends on whether these two points fall in odd or even signs. <strong>Rule 1:</strong> If both Lagna and HL are in odd signs, count forward from Aries to each, sum the counts, and count that sum forward from Aries. <strong>Rule 2:</strong> If both are in even signs, count backward from Pisces to each, sum the counts, and count that sum backward from Pisces. <strong>Rule 3:</strong> If one is odd and the other even, the calculation uses a mixed method — count forward for the odd sign and backward for the even, then apply the sum appropriately.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
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
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'वर्णद का उद्देश्य' : 'The Purpose of Varnada'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>वर्णद लग्न जातक का &quot;वर्ण&quot; निर्धारित करता है — जाति के अर्थ में नहीं, बल्कि समाज में व्यक्ति की मूलभूत पुकार या योगदान के रूप में। इसका स्वामी और दृष्ट ग्रह प्रकट करते हैं कि व्यक्ति स्वाभाविक रूप से बौद्धिक कार्यों (ब्राह्मण गुण), नेतृत्व और शासन (क्षत्रिय गुण), वाणिज्य और उद्यम (वैश्य गुण), या सेवा और शिल्प (शूद्र गुण) की ओर उन्मुख है। आधुनिक व्याख्या में यह कठोर सामाजिक श्रेणियों के बजाय व्यापक जीविका आदर्शरूपों में अनुवादित होता है।</>
            : <>Varnada Lagna determines the native&apos;s &quot;varna&quot; — not in the caste sense, but as one&apos;s fundamental calling or contribution to society. Its lord and the planets aspecting it reveal whether the person is naturally inclined toward intellectual pursuits (Brahmana quality), leadership and governance (Kshatriya quality), commerce and enterprise (Vaishya quality), or service and craftsmanship (Shudra quality). In modern interpretation, this translates to broad career archetypes rather than rigid social categories.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
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

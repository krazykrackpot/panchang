'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_21_3', phase: 8, topic: 'Varshaphal', moduleNumber: '21.3',
  title: { en: 'Mudda Dasha — Compressed Annual Dasha', hi: 'मुद्दा दशा — संकुचित वार्षिक दशा' },
  subtitle: {
    en: 'Vimshottari dasha compressed into one year — the same planetary proportions scaled from 120 years to 365 days for month-level annual predictions',
    hi: 'विंशोत्तरी दशा को एक वर्ष में संकुचित किया गया — वही ग्रह अनुपात 120 वर्ष से 365 दिनों में मापित, मास-स्तरीय वार्षिक फलादेश हेतु',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 21-1: Tajika Aspects', hi: 'मॉड्यूल 21-1: ताजिक दृष्टि' }, href: '/learn/modules/21-1' },
    { label: { en: 'Module 21-2: Sahams', hi: 'मॉड्यूल 21-2: सहम' }, href: '/learn/modules/21-2' },
    { label: { en: 'Module 21-4: Tithi Pravesha', hi: 'मॉड्यूल 21-4: तिथि प्रवेश' }, href: '/learn/modules/21-4' },
    { label: { en: 'Varshaphal Tool', hi: 'वर्षफल उपकरण' }, href: '/varshaphal' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q21_3_01', type: 'mcq',
    question: {
      en: 'What is Mudda Dasha?',
      hi: 'मुद्दा दशा क्या है?',
    },
    options: [
      { en: 'A new dasha system unrelated to Vimshottari', hi: 'विंशोत्तरी से असम्बन्धित एक नई दशा पद्धति' },
      { en: 'Vimshottari dasha compressed into one year (365.25 days)', hi: 'विंशोत्तरी दशा को एक वर्ष (365.25 दिन) में संकुचित किया गया' },
      { en: 'A dasha based on the Sun\'s position only', hi: 'केवल सूर्य की स्थिति पर आधारित दशा' },
      { en: 'A transit-based timing system', hi: 'गोचर-आधारित समय पद्धति' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mudda Dasha compresses the 120-year Vimshottari cycle into 365.25 days (one solar year). The same planetary proportions apply: Sun gets 6/120 of the year, Moon 10/120, Mars 7/120, etc.',
      hi: 'मुद्दा दशा 120 वर्ष के विंशोत्तरी चक्र को 365.25 दिनों (एक सौर वर्ष) में संकुचित करती है। वही ग्रह अनुपात लागू होते हैं: सूर्य को वर्ष का 6/120, चन्द्र को 10/120, मंगल को 7/120, आदि।',
    },
  },
  {
    id: 'q21_3_02', type: 'mcq',
    question: {
      en: 'How many days does the Sun Mudda Dasha last?',
      hi: 'सूर्य मुद्दा दशा कितने दिन चलती है?',
    },
    options: [
      { en: 'About 6 days', hi: 'लगभग 6 दिन' },
      { en: 'About 18.25 days', hi: 'लगभग 18.25 दिन' },
      { en: 'About 30 days', hi: 'लगभग 30 दिन' },
      { en: 'About 60 days', hi: 'लगभग 60 दिन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sun Mudda Dasha = 6/120 of 365.25 days = 18.26 days. The Sun\'s Vimshottari period is 6 years out of 120, so it gets 6/120th of the annual cycle.',
      hi: 'सूर्य मुद्दा दशा = 365.25 दिन का 6/120 = 18.26 दिन। सूर्य की विंशोत्तरी अवधि 120 में से 6 वर्ष है, अतः इसे वार्षिक चक्र का 6/120वाँ भाग मिलता है।',
    },
  },
  {
    id: 'q21_3_03', type: 'mcq',
    question: {
      en: 'Which planet has the longest Mudda Dasha period?',
      hi: 'किस ग्रह की मुद्दा दशा अवधि सबसे लम्बी है?',
    },
    options: [
      { en: 'Saturn (about 57.8 days)', hi: 'शनि (लगभग 57.8 दिन)' },
      { en: 'Venus (about 60.9 days)', hi: 'शुक्र (लगभग 60.9 दिन)' },
      { en: 'Rahu (about 54.8 days)', hi: 'राहु (लगभग 54.8 दिन)' },
      { en: 'Jupiter (about 48.7 days)', hi: 'गुरु (लगभग 48.7 दिन)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Venus has the longest Vimshottari period (20 years), so it has the longest Mudda Dasha: 20/120 of 365.25 = approximately 60.9 days, nearly 2 months.',
      hi: 'शुक्र की विंशोत्तरी अवधि सबसे लम्बी (20 वर्ष) है, अतः इसकी मुद्दा दशा भी सबसे लम्बी: 365.25 का 20/120 = लगभग 60.9 दिन, करीब 2 माह।',
    },
  },
  {
    id: 'q21_3_04', type: 'true_false',
    question: {
      en: 'The starting planet of Mudda Dasha is determined by the birth Moon\'s nakshatra, just like natal Vimshottari.',
      hi: 'मुद्दा दशा का आरम्भिक ग्रह जन्म चन्द्रमा के नक्षत्र से निर्धारित होता है, ठीक जन्म विंशोत्तरी की तरह।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The starting planet of Mudda Dasha is determined by the lord of the nakshatra in which the ANNUAL LAGNA (Varshaphal Ascendant) falls, NOT the birth Moon\'s nakshatra. This is a key difference from natal Vimshottari.',
      hi: 'असत्य। मुद्दा दशा का आरम्भिक ग्रह उस नक्षत्र के स्वामी से निर्धारित होता है जिसमें वार्षिक लग्न (वर्षफल लग्न) पड़ता है, जन्म चन्द्रमा के नक्षत्र से नहीं। यह जन्म विंशोत्तरी से एक प्रमुख अन्तर है।',
    },
  },
  {
    id: 'q21_3_05', type: 'mcq',
    question: {
      en: 'If the Varshaphal lagna is at 25 degrees Cancer (Ashlesha nakshatra), which planet\'s Mudda Dasha starts first?',
      hi: 'यदि वर्षफल लग्न 25 अंश कर्क (आश्लेषा नक्षत्र) पर है, तो किस ग्रह की मुद्दा दशा पहले आरम्भ होती है?',
    },
    options: [
      { en: 'Moon (Cancer lord)', hi: 'चन्द्र (कर्क स्वामी)' },
      { en: 'Mercury (Ashlesha lord)', hi: 'बुध (आश्लेषा स्वामी)' },
      { en: 'Ketu (Ashlesha\'s Vimshottari ruler)', hi: 'केतु (आश्लेषा का विंशोत्तरी शासक)' },
      { en: 'Jupiter (natural benefic)', hi: 'गुरु (प्राकृतिक शुभ)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ashlesha nakshatra is ruled by Mercury in the Vimshottari scheme. Since the Varshaphal lagna falls in Ashlesha, Mercury Mudda Dasha starts first. The remaining balance is computed from the lagna\'s exact position within Ashlesha.',
      hi: 'विंशोत्तरी योजना में आश्लेषा नक्षत्र का स्वामी बुध है। चूँकि वर्षफल लग्न आश्लेषा में पड़ता है, बुध मुद्दा दशा पहले आरम्भ होती है। शेष अवधि आश्लेषा में लग्न की यथार्थ स्थिति से गणित होती है।',
    },
  },
  {
    id: 'q21_3_06', type: 'mcq',
    question: {
      en: 'How is the dasha balance at the start of the year computed?',
      hi: 'वर्ष के आरम्भ में दशा शेष कैसे गणित किया जाता है?',
    },
    options: [
      { en: 'From the Moon\'s position in the nakshatra', hi: 'नक्षत्र में चन्द्रमा की स्थिति से' },
      { en: 'From the Varshaphal lagna\'s position within its nakshatra', hi: 'वर्षफल लग्न की उसके नक्षत्र के भीतर स्थिति से' },
      { en: 'Always starts at zero balance', hi: 'सदैव शून्य शेष से आरम्भ' },
      { en: 'From the Sun\'s position at solar return', hi: 'सौर प्रत्यावर्तन पर सूर्य की स्थिति से' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The dasha balance is computed from how far the Varshaphal lagna has progressed through its nakshatra, exactly like natal Vimshottari uses the Moon\'s progress. The remaining portion of the nakshatra determines the unexpired dasha period.',
      hi: 'दशा शेष इससे गणित होता है कि वर्षफल लग्न अपने नक्षत्र में कितना आगे बढ़ चुका है, ठीक जैसे जन्म विंशोत्तरी चन्द्रमा की प्रगति का उपयोग करता है। नक्षत्र का शेष भाग अव्यतीत दशा अवधि निर्धारित करता है।',
    },
  },
  {
    id: 'q21_3_07', type: 'true_false',
    question: {
      en: 'Mudda Dasha can be used independently without combining it with Tajika yogas.',
      hi: 'मुद्दा दशा को ताजिक योगों के साथ संयोजित किए बिना स्वतन्त्र रूप से उपयोग किया जा सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True, though it is most powerful when combined. Mudda Dasha alone indicates which months will be dominated by which planet\'s energy. However, combining with Tajika yogas gives the complete picture: Tajika says IF an event will happen, Mudda Dasha says WHEN (which month).',
      hi: 'सत्य, यद्यपि संयोजित होने पर सबसे शक्तिशाली है। मुद्दा दशा अकेले बताती है कि कौन-से माह किस ग्रह की ऊर्जा से प्रभावित होंगे। तथापि, ताजिक योगों के साथ संयोजन पूर्ण चित्र देता है: ताजिक बताता है कि घटना होगी या नहीं, मुद्दा दशा बताती है कब (कौन-सा माह)।',
    },
  },
  {
    id: 'q21_3_08', type: 'mcq',
    question: {
      en: 'How many days does Mars Mudda Dasha last?',
      hi: 'मंगल मुद्दा दशा कितने दिन चलती है?',
    },
    options: [
      { en: 'About 7 days', hi: 'लगभग 7 दिन' },
      { en: 'About 14 days', hi: 'लगभग 14 दिन' },
      { en: 'About 21.3 days', hi: 'लगभग 21.3 दिन' },
      { en: 'About 30 days', hi: 'लगभग 30 दिन' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Mars Mudda Dasha = 7/120 of 365.25 = 21.3 days (about 3 weeks). Mars\'s Vimshottari period is 7 years, giving it 7/120th of the annual cycle.',
      hi: 'मंगल मुद्दा दशा = 365.25 का 7/120 = 21.3 दिन (लगभग 3 सप्ताह)। मंगल की विंशोत्तरी अवधि 7 वर्ष है, जिससे इसे वार्षिक चक्र का 7/120वाँ भाग मिलता है।',
    },
  },
  {
    id: 'q21_3_09', type: 'mcq',
    question: {
      en: 'For convergent validation of a marriage prediction, what should you cross-check Mudda Dasha with?',
      hi: 'विवाह भविष्यवाणी के अभिसारी प्रमाणीकरण के लिए, मुद्दा दशा को किससे क्रॉस-चेक करना चाहिए?',
    },
    options: [
      { en: 'Only the transit chart', hi: 'केवल गोचर कुण्डली' },
      { en: 'The natal Vimshottari dasha', hi: 'जन्म विंशोत्तरी दशा' },
      { en: 'The lunar calendar', hi: 'चान्द्र पंचांग' },
      { en: 'The D-9 Navamsha only', hi: 'केवल D-9 नवांश' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'For convergent validation, cross-check the Mudda Dasha prediction with the natal Vimshottari dasha. If both the annual Mudda Dasha and the natal Vimshottari point to the same event → very high confidence prediction.',
      hi: 'अभिसारी प्रमाणीकरण के लिए, मुद्दा दशा फलादेश को जन्म विंशोत्तरी दशा से क्रॉस-चेक करें। यदि वार्षिक मुद्दा दशा और जन्म विंशोत्तरी दोनों एक ही घटना की ओर संकेत करें → अत्यन्त उच्च विश्वास का फलादेश।',
    },
  },
  {
    id: 'q21_3_10', type: 'true_false',
    question: {
      en: 'Rahu Mudda Dasha lasts approximately 54.8 days — the second longest after Venus.',
      hi: 'राहु मुद्दा दशा लगभग 54.8 दिन चलती है — शुक्र के बाद दूसरी सबसे लम्बी।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Rahu\'s Vimshottari period is 18 years. Rahu Mudda Dasha = 18/120 of 365.25 = 54.8 days. This is the second longest after Venus (60.9 days) and just before Saturn (57.8 days). Actually Saturn at 19 years gives 57.8 days, making Rahu third.',
      hi: 'सत्य। राहु की विंशोत्तरी अवधि 18 वर्ष है। राहु मुद्दा दशा = 365.25 का 18/120 = 54.8 दिन। वास्तव में शनि (19 वर्ष) 57.8 दिन देता है, अतः राहु शुक्र और शनि के बाद तीसरा सबसे लम्बा है।',
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
          {isHi ? 'विंशोत्तरी संकुचित: 120 वर्ष 365 दिनों में' : 'Vimshottari Compressed: 120 Years in 365 Days'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'मुद्दा दशा परिचित विंशोत्तरी दशा चक्र — जो सामान्यतः 120 वर्षों में फैला है — को एक सौर वर्ष के 365.25 दिनों में संकुचित करती है। प्रत्येक ग्रह को आनुपातिक आवंटन समान रहता है: सूर्य को वर्ष का 6/120 (18.26 दिन), चन्द्र को 10/120 (30.44 दिन), मंगल 7/120 (21.31 दिन), राहु 18/120 (54.79 दिन), गुरु 16/120 (48.70 दिन), शनि 19/120 (57.83 दिन), बुध 17/120 (51.74 दिन), केतु 7/120 (21.31 दिन), और शुक्र 20/120 (60.88 दिन)।'
            : 'Mudda Dasha takes the familiar Vimshottari dasha cycle — which normally spans 120 years — and compresses it into a single solar year of 365.25 days. The proportional allocation to each planet remains identical: Sun gets 6/120 of the year (18.26 days), Moon gets 10/120 (30.44 days), Mars 7/120 (21.31 days), Rahu 18/120 (54.79 days), Jupiter 16/120 (48.70 days), Saturn 19/120 (57.83 days), Mercury 17/120 (51.74 days), Ketu 7/120 (21.31 days), and Venus 20/120 (60.88 days).'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This compression allows month-level prediction within the annual chart. While the natal Vimshottari tells you which planet dominates your life across years or decades, Mudda Dasha tells you which planet dominates each MONTH of the specific year, giving a granular timeline for when annual promises will manifest.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'वार्षिक कुण्डलियों के लिए संकुचित दशाओं की अवधारणा ताजिक नीलकण्ठी और अन्य ताजिक ग्रन्थों में आती है। अन्तर्निहित तर्क सुन्दर है: यदि विंशोत्तरी अनुपात 120 वर्ष के जीवन चक्र को नियन्त्रित करते हैं, तो वही अनुपात 1 वर्ष के सूक्ष्म-चक्र को भी नियन्त्रित करने चाहिए। स्व-समान मापन का यह सिद्धान्त (वर्ष जीवन को प्रतिबिम्बित करता है) प्रकृति में भग्नगणित (फ्रैक्टल) प्रतिमानों की स्मृति दिलाता है। भारतीय ज्योतिषी विकल्प के रूप में योगिनी दशा को भी एक वर्ष में संकुचित करते हैं, किन्तु मुद्दा दशा (विंशोत्तरी-आधारित) सर्वाधिक प्रचलित वार्षिक दशा पद्धति बनी हुई है।'
            : 'The concept of compressed dashas for annual charts appears in Tajika Neelakanthi and other Tajika texts. The underlying logic is elegant: if the Vimshottari proportions govern the 120-year life cycle, the same proportions should govern the 1-year micro-cycle. This principle of self-similar scaling (the year mirrors the life) is reminiscent of fractal patterns in nature. Indian astrologers also use Yogini Dasha compressed into a year as an alternative, but Mudda Dasha (Vimshottari-based) remains the most widely used annual dasha system.'}
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
          {isHi ? 'आरम्भिक बिन्दु गणना' : 'Computing the Starting Point'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जन्म विंशोत्तरी से महत्त्वपूर्ण अन्तर: मुद्दा दशा का आरम्भिक ग्रह वार्षिक लग्न के नक्षत्र से निर्धारित होता है, जन्म चन्द्रमा के नक्षत्र से नहीं। ज्ञात करें कि वर्षफल लग्न अंश किस नक्षत्र में पड़ता है, और उस नक्षत्र का स्वामी प्रथम मुद्दा दशा ग्रह बनता है। उस दशा का शेष अंश लग्न ने नक्षत्र में कितनी प्रगति की है उससे गणित होता है।</>
            : <>The crucial difference from natal Vimshottari: the starting planet of Mudda Dasha is determined by the ANNUAL LAGNA&apos;s nakshatra, not the birth Moon&apos;s nakshatra. Find which nakshatra the Varshaphal Ascendant degree falls in, and the lord of that nakshatra becomes the first Mudda Dasha planet. The remaining balance of that dasha is computed from how far the lagna has progressed through the nakshatra.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          After the first planet&apos;s remaining period expires, the sequence follows standard Vimshottari order: Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury, and back to Ketu if the year hasn&apos;t ended. Each planet&apos;s full Mudda Dasha period applies for subsequent entries.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">वर्षफल लग्न 25 अंश कर्क पर:</span> 25 अंश कर्क = 115 अंश निरपेक्ष। नक्षत्र = floor(115 / 13.333) + 1 = floor(8.625) + 1 = 8 + 1 = 9वाँ नक्षत्र = आश्लेषा (16.667 से 30 अंश कर्क)। आश्लेषा स्वामी = बुध। अतः बुध मुद्दा दशा पहले आरम्भ होती है। आश्लेषा में स्थिति = 115 - 106.667 = 8.333 अंश। पार किया भाग = 8.333 / 13.333 = 0.625 (62.5% पूर्ण)। शेष बुध मुद्दा दशा = (1 - 0.625) x 51.74 दिन = 19.4 दिन। बुध समाप्ति के बाद केतु मुद्दा दशा (21.31 दिन), फिर शुक्र (60.88 दिन), इत्यादि वर्ष भर।</>
            : <><span className="text-gold-light font-medium">Varshaphal lagna at 25 degrees Cancer:</span> 25 degrees Cancer = 115 degrees absolute. Nakshatra = floor(115 / 13.333) + 1 = floor(8.625) + 1 = 8 + 1 = 9th nakshatra = Ashlesha (16.667 degrees to 30 degrees Cancer). Ashlesha lord = Mercury. So Mercury Mudda Dasha starts first. Position within Ashlesha = 115 - 106.667 = 8.333 degrees. Fraction traversed = 8.333 / 13.333 = 0.625 (62.5% done). Remaining Mercury Mudda Dasha = (1 - 0.625) x 51.74 days = 19.4 days. After Mercury expires, Ketu Mudda Dasha begins (21.31 days), then Venus (60.88 days), and so on through the year.</>}
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
          {isHi ? 'मुद्दा दशा से मास-स्तरीय फलादेश' : 'Month-Level Prediction with Mudda Dasha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>मुद्दा दशा की वास्तविक शक्ति ताजिक योगों के साथ संयोजित होने पर प्रकट होती है। ताजिक विश्लेषण बताता है कि घटना होगी या नहीं (इत्थशाल = हाँ, ईषराफ = नहीं)। मुद्दा दशा बताती है कि वर्ष में कब — किस ग्रह की अवधि में। यदि शुक्र का सप्तम स्वामी से इत्थशाल है (इस वर्ष विवाह), और शुक्र मुद्दा दशा 15 मार्च से 14 मई तक चलती है, तो मार्च-मई विवाह की खिड़की है।</>
            : <>The real power of Mudda Dasha emerges when combined with Tajika yogas. The Tajika analysis tells you IF an event will happen (Ithasala = yes, Easarapha = no). Mudda Dasha tells you WHEN within the year — during which planet&apos;s period. If Venus has Ithasala with the 7th lord (marriage this year), and Venus Mudda Dasha runs from March 15 to May 14, then March-May is the marriage window.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For convergent validation, cross-check with the natal Vimshottari. If the natal chart is also running Venus dasha/bhukti during the same period, confidence is very high. This convergence of annual and natal timing is one of the strongest prediction techniques in Indian astrology — when both the macro (natal dasha) and micro (Mudda Dasha) cycles align on the same planet for the same event, the prediction becomes near-certain.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;मुद्दा दशा जन्म विंशोत्तरी को प्रतिस्थापित या अधिभावी करती है।&quot; मुद्दा दशा केवल वार्षिक कुण्डली में कार्य करती है और उस विशिष्ट वर्ष के लिए मास-स्तरीय समय प्रदान करती है। यह जन्म विंशोत्तरी को प्रतिस्थापित नहीं करती जो जीवन-स्तरीय समयरेखा को नियन्त्रित करती है। दोनों साथ प्रयुक्त होती हैं — जन्म दशा दशक-स्तरीय चित्र के लिए, मुद्दा दशा मास-स्तरीय परिशोधन के लिए। सर्वोच्च विश्वास के लिए घटना को दोनों पद्धतियों का समर्थन मिलना चाहिए।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Mudda Dasha replaces or overrides the natal Vimshottari.&quot; Mudda Dasha operates ONLY within the annual chart and provides month-level timing for that specific year. It does NOT replace the natal Vimshottari which governs the life-level timeline. Both are used together — natal dasha for the decade-level picture, Mudda Dasha for the month-level refinement. An event must be supported by BOTH systems for highest confidence.</>}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>हमारा वर्षफल उपकरण वर्ष की सम्पूर्ण मुद्दा दशा समयरेखा गणित करता है, प्रत्येक ग्रह की अवधि की सटीक आरम्भ और समाप्ति तिथियाँ दिखाता है। यह उन मुद्दा दशा अवधियों को भी उजागर करता है जो अनुकूल ताजिक योगों के साथ मेल खाती हैं, जिससे उपयोगकर्ताओं को करियर, सम्बन्ध, स्वास्थ्य और अन्य जीवन क्षेत्रों के &quot;सक्रिय माहों&quot; की दृश्य समयरेखा मिलती है। अभिसारी प्रमाणीकरण सुविधा मुद्दा दशा को जन्म विंशोत्तरी से क्रॉस-रेफरेंस करती है, उन अवधियों को चिह्नित करती है जहाँ दोनों पद्धतियाँ मेल खाती हैं — ये सर्वोच्च विश्वास की फलादेश खिड़कियाँ हैं।</>
            : <>Our Varshaphal tool computes the complete Mudda Dasha timeline for the year, showing exact start and end dates for each planet&apos;s period. It also highlights which Mudda Dasha periods coincide with favorable Tajika yogas, giving users a visual timeline of &quot;hot months&quot; for career, relationships, health, and other life areas. The convergent validation feature cross-references Mudda Dasha with the natal Vimshottari, flagging periods where both systems align — these are the highest-confidence prediction windows.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

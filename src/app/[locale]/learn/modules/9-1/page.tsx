'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_1', phase: 3, topic: 'Kundali', moduleNumber: '9.1',
  title: { en: 'Birth Chart Basics — What is a Kundali?', hi: 'जन्म कुण्डली की मूल बातें — कुण्डली क्या है?' },
  subtitle: { en: 'The celestial snapshot frozen at the moment of your first breath', hi: 'आपकी पहली साँस के क्षण में जमा हुआ आकाशीय चित्र' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 9.2: Houses (Bhavas)', hi: 'मॉड्यूल 9.2: भाव' }, href: '/learn/modules/9-2' },
    { label: { en: 'Module 9.3: Planetary Dignities', hi: 'मॉड्यूल 9.3: ग्रह बल' }, href: '/learn/modules/9-3' },
    { label: { en: 'Module 9.4: Interpretation Framework', hi: 'मॉड्यूल 9.4: व्याख्या ढाँचा' }, href: '/learn/modules/9-4' },
    { label: { en: 'Learn: Kundali', hi: 'सीखें: कुण्डली' }, href: '/learn/kundali' },
    { label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q9_1_01', type: 'mcq',
    question: { en: 'What does a Kundali (birth chart) represent?', hi: 'कुण्डली (जन्म पत्रिका) क्या दर्शाती है?' },
    options: [
      { en: 'A random arrangement of symbols', hi: 'प्रतीकों की यादृच्छिक व्यवस्था' },
      { en: 'A map of the sky at the exact moment and place of birth', hi: 'जन्म के सटीक समय और स्थान पर आकाश का नक्शा' },
      { en: 'Only the position of the Sun', hi: 'केवल सूर्य की स्थिति' },
      { en: 'A Western zodiac horoscope', hi: 'पाश्चात्य राशिफल' },
    ],
    correctAnswer: 1,
    explanation: { en: 'A Kundali is a precise astronomical map showing all nine Vedic planets, 12 houses, and 12 signs as they appeared from the birthplace at the exact moment of birth.', hi: 'कुण्डली एक सटीक खगोलीय नक्शा है जो जन्मस्थान से जन्म के सटीक क्षण में सभी नौ वैदिक ग्रहों, 12 भावों और 12 राशियों को दर्शाती है।' },
  },
  {
    id: 'q9_1_02', type: 'mcq',
    question: { en: 'How often does the Lagna (Ascendant) sign change?', hi: 'लग्न राशि कितनी बार बदलती है?' },
    options: [
      { en: 'Once a day', hi: 'दिन में एक बार' },
      { en: 'Once a month', hi: 'महीने में एक बार' },
      { en: 'Approximately every 2 hours', hi: 'लगभग हर 2 घंटे' },
      { en: 'Once a year', hi: 'साल में एक बार' },
    ],
    correctAnswer: 2,
    explanation: { en: 'There are 12 signs rising over 24 hours, so each sign occupies the eastern horizon for roughly 2 hours (though this varies by latitude and sign).', hi: '24 घंटों में 12 राशियाँ उदय होती हैं, इसलिए प्रत्येक राशि पूर्वी क्षितिज पर लगभग 2 घंटे रहती है (हालाँकि यह अक्षांश और राशि के अनुसार बदलता है)।' },
  },
  {
    id: 'q9_1_03', type: 'true_false',
    question: { en: 'In the North Indian chart style, the Ascendant (Lagna) is always placed in the top diamond.', hi: 'उत्तर भारतीय कुण्डली शैली में लग्न हमेशा शीर्ष हीरे में रखा जाता है।' },
    correctAnswer: true,
    explanation: { en: 'In the North Indian diamond chart, the top diamond always represents the 1st house (Lagna). The houses are fixed and signs rotate based on the Ascendant sign.', hi: 'उत्तर भारतीय हीरा कुण्डली में, शीर्ष हीरा हमेशा प्रथम भाव (लग्न) दर्शाता है। भाव स्थिर होते हैं और राशियाँ लग्न राशि के अनुसार घूमती हैं।' },
  },
  {
    id: 'q9_1_04', type: 'mcq',
    question: { en: 'In a South Indian chart, what remains fixed?', hi: 'दक्षिण भारतीय कुण्डली में क्या स्थिर रहता है?' },
    options: [
      { en: 'The houses rotate', hi: 'भाव घूमते हैं' },
      { en: 'The signs are fixed in position, houses rotate', hi: 'राशियाँ स्थिर रहती हैं, भाव घूमते हैं' },
      { en: 'Nothing is fixed', hi: 'कुछ भी स्थिर नहीं' },
      { en: 'Only the Moon position is fixed', hi: 'केवल चन्द्र स्थिति स्थिर है' },
    ],
    correctAnswer: 1,
    explanation: { en: 'In the South Indian grid chart, the 12 signs always occupy the same box positions. The houses (bhavas) rotate based on the Ascendant sign. This is the opposite of the North Indian style.', hi: 'दक्षिण भारतीय ग्रिड कुण्डली में 12 राशियाँ हमेशा समान बक्से में रहती हैं। भाव लग्न राशि के अनुसार घूमते हैं। यह उत्तर भारतीय शैली के विपरीत है।' },
  },
  {
    id: 'q9_1_05', type: 'true_false',
    question: { en: 'A 4-minute error in birth time shifts the Lagna by approximately 1 degree.', hi: 'जन्म समय में 4 मिनट की त्रुटि लग्न को लगभग 1 अंश विस्थापित करती है।' },
    correctAnswer: true,
    explanation: { en: 'The Ascendant moves through 360 degrees in about 24 hours, so roughly 1 degree every 4 minutes. This is why birth time accuracy is critical in Jyotish.', hi: 'लग्न लगभग 24 घंटों में 360 अंश पार करता है, अर्थात हर 4 मिनट में लगभग 1 अंश। इसीलिए ज्योतिष में जन्म समय की सटीकता अत्यंत महत्वपूर्ण है।' },
  },
  {
    id: 'q9_1_06', type: 'mcq',
    question: { en: 'How many houses does a Kundali contain?', hi: 'कुण्डली में कितने भाव होते हैं?' },
    options: [
      { en: '9 (one per planet)', hi: '9 (प्रति ग्रह एक)' },
      { en: '12', hi: '12' },
      { en: '27 (one per Nakshatra)', hi: '27 (प्रति नक्षत्र एक)' },
      { en: '7', hi: '7' },
    ],
    correctAnswer: 1,
    explanation: { en: 'A Kundali always has 12 houses (bhavas), each representing a different area of life. The 12 houses correspond to the 12 signs of the zodiac.', hi: 'कुण्डली में हमेशा 12 भाव होते हैं, प्रत्येक जीवन के एक अलग क्षेत्र का प्रतिनिधित्व करता है। 12 भाव राशिचक्र की 12 राशियों से संबंधित हैं।' },
  },
  {
    id: 'q9_1_07', type: 'true_false',
    question: { en: 'The Kundali only considers the Sun and Moon positions.', hi: 'कुण्डली केवल सूर्य और चन्द्र की स्थिति पर विचार करती है।' },
    correctAnswer: false,
    explanation: { en: 'A Kundali maps all 9 Vedic grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu. Each planet contributes to the overall reading.', hi: 'कुण्डली सभी 9 वैदिक ग्रहों का मानचित्रण करती है: सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु। प्रत्येक ग्रह समग्र पठन में योगदान करता है।' },
  },
  {
    id: 'q9_1_08', type: 'mcq',
    question: { en: 'Why is the exact moment of birth important for a Kundali?', hi: 'कुण्डली के लिए जन्म का सटीक क्षण क्यों महत्वपूर्ण है?' },
    options: [
      { en: 'It determines the Sun sign only', hi: 'यह केवल सूर्य राशि निर्धारित करता है' },
      { en: 'It fixes the Lagna, which determines all house numbering and planet-house relationships', hi: 'यह लग्न तय करता है, जो सभी भाव क्रमांकन और ग्रह-भाव संबंध निर्धारित करता है' },
      { en: 'It is only a tradition with no astronomical basis', hi: 'यह केवल परम्परा है जिसका कोई खगोलीय आधार नहीं' },
      { en: 'Birth time does not matter', hi: 'जन्म समय का कोई महत्व नहीं' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The birth moment determines the Lagna (Ascendant), which is the foundation of the entire chart. It sets the 1st house and determines which sign and planets govern each life area.', hi: 'जन्म का क्षण लग्न निर्धारित करता है, जो पूरी कुण्डली की नींव है। यह प्रथम भाव तय करता है और निर्धारित करता है कि कौन सी राशि और ग्रह किस जीवन क्षेत्र पर शासन करते हैं।' },
  },
  {
    id: 'q9_1_09', type: 'true_false',
    question: { en: 'North Indian and South Indian chart styles contain different astrological information.', hi: 'उत्तर भारतीय और दक्षिण भारतीय कुण्डली शैलियों में अलग-अलग ज्योतिषीय जानकारी होती है।' },
    correctAnswer: false,
    explanation: { en: 'Both styles contain identical astronomical data. They are simply different visual representations. North Indian fixes houses, South Indian fixes signs. The information and interpretations are the same.', hi: 'दोनों शैलियों में समान खगोलीय डेटा होता है। ये केवल अलग-अलग दृश्य प्रस्तुतियाँ हैं। उत्तर भारतीय में भाव स्थिर होते हैं, दक्षिण भारतीय में राशियाँ। जानकारी और व्याख्या समान रहती है।' },
  },
  {
    id: 'q9_1_10', type: 'mcq',
    question: { en: 'Which classical text is the primary source for Kundali construction rules?', hi: 'कुण्डली निर्माण नियमों का प्राथमिक शास्त्रीय ग्रंथ कौन सा है?' },
    options: [
      { en: 'Rig Veda', hi: 'ऋग्वेद' },
      { en: 'Brihat Parashara Hora Shastra (BPHS)', hi: 'बृहत् पराशर होरा शास्त्र (BPHS)' },
      { en: 'Arthashastra', hi: 'अर्थशास्त्र' },
      { en: 'Manusmriti', hi: 'मनुस्मृति' },
    ],
    correctAnswer: 1,
    explanation: { en: 'BPHS by Sage Parashara is the foundational text of Parashari Jyotish. It systematically covers chart construction, house significations, planetary dignities, dashas, and yogas.', hi: 'ऋषि पराशर द्वारा रचित BPHS पाराशरी ज्योतिष का मूलभूत ग्रंथ है। इसमें कुण्डली निर्माण, भाव सूचकता, ग्रह बल, दशा और योग व्यवस्थित रूप से वर्णित हैं।' },
  },
];

/* ─── Page 1: What is a Kundali ──────────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कुण्डली क्या है?' : 'What is a Kundali?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली (जन्म पत्रिका) आपके जन्म के सटीक क्षण और स्थान पर आकाश का एक सटीक नक्शा है। कल्पना कीजिए कि जन्म के क्षण में आप बाहर खड़े होकर क्षितिज से क्षितिज तक पूरे आकाश का चित्र खींच रहे हैं — कुण्डली उसी चित्र का ज्यामितीय रूपांतरण है।</> : <>A Kundali (also called Janma Patrika or birth chart) is a precise map of the sky frozen at the exact moment and location of your birth. Imagine stepping outside the instant you were born and photographing the entire dome of the sky from horizon to horizon — the Kundali is that photograph rendered as a geometric diagram.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली में तीन मूलभूत तत्व होते हैं: <strong className="text-gold-light">12 भाव</strong> जो जीवन के क्षेत्र दर्शाते हैं, <strong className="text-gold-light">12 राशियाँ</strong> जो पृष्ठभूमि प्रदान करती हैं, और <strong className="text-gold-light">9 ग्रह</strong> — सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु — जो इनमें स्थापित होते हैं। लग्न (जन्म के समय पूर्वी क्षितिज पर उदय होने वाली राशि) पूरी संरचना का आधार है।</> : <>The chart contains three fundamental components: <strong className="text-gold-light">12 Houses (Bhavas)</strong> representing life areas, <strong className="text-gold-light">12 Signs (Rashis)</strong> providing the backdrop, and <strong className="text-gold-light">9 Planets (Grahas)</strong> — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — placed within them. The Ascendant (Lagna), the sign rising on the eastern horizon at birth, anchors the entire structure and determines which house is which.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>कुण्डली निर्माण की प्रणाली बृहत् पराशर होरा शास्त्र (BPHS) में संहिताबद्ध है, जो ऋषि पराशर (~1500 ई.पू.) को श्रेय दी जाती है। अध्याय 2 में राशिचक्र, अध्याय 3 में ग्रह स्वभाव, और अध्याय 4-5 में भाव निर्माण वर्णित है। वराहमिहिर की बृहत् जातक (छठी शताब्दी) ने गणना विधियों को परिष्कृत किया।</> : <>The system of Kundali construction is codified in Brihat Parashara Hora Shastra (BPHS), attributed to Sage Parashara (~1500 BCE). Chapter 2 defines the zodiac, Chapter 3 describes planetary natures, and Chapters 4-5 lay out house construction. Varahamihira&apos;s Brihat Jataka (6th century CE) refined the computational methods.</>}</p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कुण्डली शैलियाँ: उत्तर बनाम दक्षिण' : 'Chart Styles: North vs South Indian'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">उत्तर भारतीय (हीरा)</strong>: 12 भाव हीरे के आकार में स्थिर होते हैं। शीर्ष हीरा सदैव प्रथम भाव (लग्न) होता है। राशियाँ घूमती हैं — यदि लग्न वृषभ है, तो शीर्ष हीरे में वृषभ, अगले में मिथुन, इत्यादि। इस शैली से भाव संबंध एक नज़र में दिखते हैं।</> : <><strong className="text-gold-light">North Indian (Diamond)</strong>: The 12 houses are fixed in a diamond pattern. The top diamond is always the 1st house (Lagna). Signs rotate — if the Lagna is Taurus, the top diamond shows Taurus, the next one clockwise shows Gemini, and so on. This style makes it easy to see house relationships at a glance.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">दक्षिण भारतीय (ग्रिड)</strong>: एक 4x4 ग्रिड जहाँ राशियाँ स्थायी रूप से स्थिर हैं — मीन सदैव ऊपर-बाएँ, मेष अगला, इत्यादि। भाव लग्न राशि के अनुसार घूमते हैं। इससे विभिन्न कुण्डलियों में ग्रहों की राशि स्थिति की तुलना करना सरल होता है।</> : <><strong className="text-gold-light">South Indian (Grid)</strong>: A 4x4 grid where signs are permanently fixed — Pisces always top-left, Aries next, and so on clockwise. Houses rotate based on the Lagna sign. This makes it easy to track planets through signs across different charts.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: The Lagna (Ascendant) ──────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'लग्न — कुण्डली की नींव' : 'The Lagna (Ascendant) — The Chart&apos;s Foundation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>लग्न पूरी कुण्डली का सबसे महत्वपूर्ण बिन्दु है। यह राशिचक्र का वह सटीक अंश है जो जन्म के क्षण और स्थान पर पूर्वी क्षितिज पर उदय हो रहा था। लग्न प्रथम भाव निर्धारित करता है, और शेष सभी भाव इससे आगे बढ़ते हैं — लग्न के बाद की राशि द्वितीय भाव बनती है, अगली तृतीय भाव, और ऐसे ही बारहवें भाव तक।</> : <>The Lagna is the most important single point in the entire Kundali. It is the exact degree of the zodiac sign that was rising on the eastern horizon at the moment and place of birth. The Lagna determines the 1st house, and all other houses cascade from it — the sign after Lagna becomes the 2nd house, the next becomes the 3rd, and so on through all 12.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चूँकि पृथ्वी 24 घंटों में 360 अंश घूमती है, लग्न लगभग <strong className="text-gold-light">हर 4 मिनट में 1 अंश</strong> बढ़ता है। एक नई राशि लगभग हर 2 घंटे में उदय होती है (हालाँकि यह अक्षांश पर निर्भर करता है — उच्च अक्षांशों पर कुछ राशियाँ तेज़ और कुछ धीमी उदय होती हैं)। इसीलिए जन्म समय में कुछ मिनटों की त्रुटि भी कुण्डली को काफ़ी बदल सकती है।</> : <>Because the Earth rotates 360 degrees in 24 hours, the Lagna moves at roughly <strong className="text-gold-light">1 degree every 4 minutes</strong>. A new sign rises approximately every 2 hours (though this varies by latitude — at higher latitudes, some signs rise faster and others slower). This is why even a few minutes of birth time error can significantly alter the chart.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> दिल्ली में सुबह 6:15 बजे जन्मे बच्चे का सिंह लग्न होगा। प्रथम भाव सिंह, द्वितीय कन्या, सप्तम कुम्भ (विवाह), दशम वृषभ (कर्म)। यदि वही बच्चा 20 मिनट बाद 6:35 बजे जन्मे, तो लग्न लगभग 5 अंश बढ़ जाता है — अभी भी सिंह, लेकिन वर्ग कुण्डलियों (नवमांश, दशमांश) पर प्रभाव पड़ता है। 2 घंटे बाद जन्म हो तो? अब कन्या लग्न होगा और पूरी भाव संरचना बदल जाएगी।</> : <><span className="text-gold-light font-medium">Example:</span> A child born at 6:15 AM in Delhi has Leo (Simha) rising. Their 1st house is Leo, 2nd is Virgo, 7th is Aquarius (marriage), 10th is Taurus (career). If the same child were born just 20 minutes later at 6:35 AM, the Lagna shifts about 5 degrees — still Leo, but with a noticeably different Lagna degree affecting divisional charts (Navamsha, Dashamsha). Born 2 hours later? Now Virgo rises, and the entire house structure reshuffles.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रांतियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;मेरी सूर्य राशि ही मेरी कुण्डली है।&quot; वैदिक ज्योतिष में सूर्य राशि दर्जनों कारकों में से केवल एक है। समान सूर्य राशि किन्तु भिन्न लग्न वाले दो व्यक्तियों के जीवन पथ बहुत अलग होंगे। लग्न सूर्य राशि से कहीं अधिक निर्णायक है।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;My Sun sign IS my chart.&quot; In Vedic astrology, the Sun sign (Surya Rashi) is just one of dozens of factors. Two people with the same Sun sign but different Lagnas will have vastly different life patterns. The Lagna is far more defining than the Sun sign.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Reading the Chart ──────────────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'भावों और राशियों में ग्रह' : 'Planets in Houses and Signs'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली में प्रत्येक ग्रह एक विशिष्ट भाव और राशि में एक साथ स्थित होता है। <strong className="text-gold-light">भाव</strong> बताता है कि जीवन का कौन सा क्षेत्र प्रभावित है (जैसे, सप्तम भाव = विवाह/साझेदारी)। <strong className="text-gold-light">राशि</strong> बताती है कि ग्रह कैसे अभिव्यक्त होता है (जैसे, मीन में मंगल, मेष में मंगल से भिन्न व्यवहार करता है)। ग्रह स्वयं बताता है कि कौन सी ऊर्जा कार्यरत है (जैसे, मंगल = उत्साह, साहस, आक्रामकता)।</> : <>Each planet in a Kundali occupies a specific house and sign simultaneously. The <strong className="text-gold-light">house</strong> tells you the life area affected (e.g., 7th house = marriage/partnerships). The <strong className="text-gold-light">sign</strong> tells you how the planet expresses itself (e.g., Mars in Pisces acts differently from Mars in Aries). The planet itself tells you what energy is at work (e.g., Mars = drive, courage, aggression).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><strong className="text-gold-light">युति</strong> तब होती है जब दो या अधिक ग्रह एक ही राशि और भाव में हों। पंचम भाव में बृहस्पति-शुक्र युति ज्ञान को रचनात्मकता और प्रेम से जोड़ती है। <strong className="text-gold-light">दृष्टि</strong> प्रभाव की रेखाएँ हैं — वैदिक ज्योतिष में सभी ग्रह अपने से सप्तम भाव को देखते हैं, जबकि मंगल अतिरिक्त रूप से चतुर्थ और अष्टम, बृहस्पति पंचम और नवम, तथा शनि तृतीय और दशम भाव को भी देखते हैं। <strong className="text-gold-light">भाव स्वामित्व</strong> का अर्थ है कि प्रत्येक भाव का &quot;स्वामी&quot; वह ग्रह होता है जो उसमें स्थित राशि का शासक है।</> : <><strong className="text-gold-light">Conjunction</strong> occurs when two or more planets occupy the same sign and house. Jupiter conjunct Venus in the 5th house combines wisdom with creativity and romance. <strong className="text-gold-light">Aspects (Drishti)</strong> are lines of influence — in Vedic astrology, all planets aspect the 7th house from themselves, while Mars additionally aspects the 4th and 8th, Jupiter the 5th and 9th, and Saturn the 3rd and 10th. <strong className="text-gold-light">House lordship</strong> means each house is &quot;owned&quot; by the planet ruling the sign that falls in it.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example: Chart Walkthrough'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> मेष लग्न वाली कुण्डली पर विचार करें। प्रथम भाव का स्वामी मंगल है। यदि मंगल दशम भाव (मकर — उसकी उच्च राशि) में बैठा है, तो यह एक शक्तिशाली संयोजन बनाता है: आत्म (प्रथम भाव स्वामी) कर्म और सार्वजनिक जीवन (दशम भाव) की ओर अधिकतम शक्ति (उच्च) के साथ निर्देशित। ऐसा व्यक्ति स्वाभाविक रूप से नेतृत्व और कैरियर उपलब्धि की ओर आकर्षित होता है।</> : <><span className="text-gold-light font-medium">Example:</span> Consider a chart with Aries (Mesha) Lagna. The 1st house lord is Mars. If Mars sits in the 10th house (Capricorn — its exaltation sign), this creates a powerful combination: the self (1st lord) directed toward career and public life (10th house) with maximum strength (exaltation). This person naturally gravitates toward leadership and career achievement.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>अब बृहस्पति को द्वितीय भाव से मंगल पर दृष्टि डालते हुए जोड़ें (उसकी 9वीं दृष्टि दशम पर पड़ती है)। बृहस्पति नवम स्वामी (धनु) के रूप में दशम को देखता है — यह एक <strong className="text-gold-light">राजयोग</strong> (त्रिकोण स्वामी केन्द्र पर दृष्टि) है। कैरियर की सफलता अब धर्म, नैतिकता और ज्ञान से जुड़ जाती है।</> : <>Now add Jupiter aspecting Mars from the 2nd house (its 9th aspect hits the 10th). Jupiter as 9th lord (Sagittarius) aspects the 10th — this is a <strong className="text-gold-light">Raja Yoga</strong> (a Trikona lord aspecting a Kendra). The career success now comes with dharma, ethics, and wisdom attached to it.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा ऐप मीअस खगोलीय एल्गोरिदम का उपयोग करके आपकी पूर्ण कुण्डली बनाता है — वही गणितीय सटीकता जो वेधशाला सॉफ़्टवेयर में उपयोग होती है। ग्रहों की गणना सूर्य के लिए 0.01 अंश और चन्द्र के लिए 0.5 अंश तक की जाती है, फिर लहिरी अयनांश से सायन राशिचक्र में स्थापित किया जाता है। आप उत्तर भारतीय हीरा प्रारूप में अपनी कुण्डली देख सकते हैं, हर भाव और ग्रह स्थिति का अन्वेषण कर सकते हैं, और AI-जनित टिप्पणी (व्याख्यात्मक भाष्य) प्राप्त कर सकते हैं।</> : <>Our app generates your complete Kundali using Meeus astronomical algorithms — the same mathematical precision used in observatory software. Planets are calculated to within 0.01 degrees for the Sun and 0.5 degrees for the Moon, then placed into the sidereal zodiac using Lahiri Ayanamsha. You can view your chart in North Indian diamond format, explore every house and planet placement, and receive AI-generated tippanni (interpretive commentary).</>}</p>
      </section>
    </div>
  );
}

export default function Module9_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

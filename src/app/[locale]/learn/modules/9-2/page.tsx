'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_9_2', phase: 3, topic: 'Kundali', moduleNumber: '9.2',
  title: { en: 'Houses (Bhavas) — The 12 Life Areas', hi: 'भाव — जीवन के 12 क्षेत्र' },
  subtitle: { en: 'Each house maps a specific domain of human experience', hi: 'प्रत्येक भाव मानव अनुभव के एक विशिष्ट क्षेत्र का प्रतिनिधित्व करता है' },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 9.1: Birth Chart Basics', hi: 'मॉड्यूल 9.1: कुण्डली की मूल बातें' }, href: '/learn/modules/9-1' },
    { label: { en: 'Module 9.3: Planetary Dignities', hi: 'मॉड्यूल 9.3: ग्रह बल' }, href: '/learn/modules/9-3' },
    { label: { en: 'Learn: Bhavas', hi: 'सीखें: भाव' }, href: '/learn/bhavas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q9_2_01', type: 'mcq',
    question: { en: 'Which house represents marriage and partnerships?', hi: 'कौन सा भाव विवाह और साझेदारी दर्शाता है?' },
    options: [
      { en: '5th house', hi: 'पंचम भाव' },
      { en: '7th house', hi: 'सप्तम भाव' },
      { en: '10th house', hi: 'दशम भाव' },
      { en: '2nd house', hi: 'द्वितीय भाव' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The 7th house (Yuvati Bhava) governs marriage, spouse, partnerships, and all one-to-one relationships. It is directly opposite the 1st house (self), representing "the other."', hi: 'सप्तम भाव (युवती भाव) विवाह, जीवनसाथी, साझेदारी और सभी व्यक्तिगत संबंधों पर शासन करता है। यह प्रथम भाव (आत्म) के ठीक विपरीत है, "दूसरे" का प्रतिनिधित्व करता है।' },
  },
  {
    id: 'q9_2_02', type: 'mcq',
    question: { en: 'Which houses are the Kendras (angular houses)?', hi: 'केन्द्र भाव (कोणीय भाव) कौन से हैं?' },
    options: [
      { en: '1, 5, 9', hi: '1, 5, 9' },
      { en: '1, 4, 7, 10', hi: '1, 4, 7, 10' },
      { en: '6, 8, 12', hi: '6, 8, 12' },
      { en: '3, 6, 10, 11', hi: '3, 6, 10, 11' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Kendras (1, 4, 7, 10) are the four pillars of the chart. They represent self, home, relationships, and career — the structural foundation of life. Planets in Kendras gain strength.', hi: 'केन्द्र (1, 4, 7, 10) कुण्डली के चार स्तम्भ हैं। ये आत्म, गृह, संबंध और कर्म दर्शाते हैं — जीवन की संरचनात्मक नींव। केन्द्र में ग्रह शक्ति प्राप्त करते हैं।' },
  },
  {
    id: 'q9_2_03', type: 'true_false',
    question: { en: 'Trikona houses (1, 5, 9) are considered the most auspicious houses in a chart.', hi: 'त्रिकोण भाव (1, 5, 9) कुण्डली में सबसे शुभ भाव माने जाते हैं।' },
    correctAnswer: true,
    explanation: { en: 'Trikonas (1, 5, 9) represent Dharma — purpose, fortune, and divine grace. Their lords are natural benefics for the chart. A strong Trikona configuration is the hallmark of a blessed life.', hi: 'त्रिकोण (1, 5, 9) धर्म — उद्देश्य, भाग्य और दैवी कृपा का प्रतिनिधित्व करते हैं। इनके स्वामी कुण्डली के स्वाभाविक शुभ ग्रह होते हैं। सशक्त त्रिकोण संरचना सौभाग्यशाली जीवन की पहचान है।' },
  },
  {
    id: 'q9_2_04', type: 'mcq',
    question: { en: 'What is the Dusthana group of houses?', hi: 'दुःस्थान भाव समूह कौन सा है?' },
    options: [
      { en: '1, 4, 7, 10', hi: '1, 4, 7, 10' },
      { en: '2, 5, 8, 11', hi: '2, 5, 8, 11' },
      { en: '6, 8, 12', hi: '6, 8, 12' },
      { en: '3, 6, 9, 12', hi: '3, 6, 9, 12' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Dusthanas (6, 8, 12) represent challenges: enemies/disease (6th), longevity/secrets (8th), and losses/liberation (12th). However, they also bring transformation — the 8th can give occult wisdom, the 12th can give spiritual liberation.', hi: 'दुःस्थान (6, 8, 12) चुनौतियाँ दर्शाते हैं: शत्रु/रोग (छठा), आयु/रहस्य (आठवाँ), और हानि/मोक्ष (बारहवाँ)। लेकिन ये परिवर्तन भी लाते हैं — आठवाँ तान्त्रिक ज्ञान दे सकता है, बारहवाँ आध्यात्मिक मुक्ति।' },
  },
  {
    id: 'q9_2_05', type: 'mcq',
    question: { en: 'What happens when a Trikona lord conjoins a Kendra lord?', hi: 'जब त्रिकोण स्वामी केन्द्र स्वामी से युक्त होता है तो क्या होता है?' },
    options: [
      { en: 'It creates a Dosha (flaw)', hi: 'यह दोष बनाता है' },
      { en: 'It creates a Raja Yoga', hi: 'यह राजयोग बनाता है' },
      { en: 'It has no special significance', hi: 'इसका कोई विशेष महत्व नहीं' },
      { en: 'It always causes delays', hi: 'यह हमेशा विलम्ब करता है' },
    ],
    correctAnswer: 1,
    explanation: { en: 'When lords of Kendras (1,4,7,10) and Trikonas (1,5,9) associate by conjunction, mutual aspect, or exchange, they form Raja Yoga — a combination of power (Kendra) and fortune (Trikona) that elevates the native.', hi: 'जब केन्द्र (1,4,7,10) और त्रिकोण (1,5,9) के स्वामी युति, परस्पर दृष्टि, या परिवर्तन से संबद्ध होते हैं, तो राजयोग बनता है — शक्ति (केन्द्र) और भाग्य (त्रिकोण) का संयोजन जो जातक को उन्नत करता है।' },
  },
  {
    id: 'q9_2_06', type: 'true_false',
    question: { en: 'The 8th house only signifies death and has no positive significations.', hi: 'अष्टम भाव केवल मृत्यु का सूचक है और इसकी कोई शुभ सूचकता नहीं है।' },
    correctAnswer: false,
    explanation: { en: 'The 8th house also signifies longevity, inheritance, insurance, research, occult knowledge, and transformation. A strong 8th house can indicate a long life, sudden gains, and deep spiritual insight.', hi: 'अष्टम भाव दीर्घायु, विरासत, बीमा, अनुसंधान, तान्त्रिक ज्ञान और परिवर्तन का भी सूचक है। सशक्त अष्टम भाव दीर्घ आयु, आकस्मिक लाभ और गहन आध्यात्मिक अंतर्दृष्टि दे सकता है।' },
  },
  {
    id: 'q9_2_07', type: 'mcq',
    question: { en: 'Which house group is called Upachaya (houses of growth)?', hi: 'किस भाव समूह को उपचय (वृद्धि के भाव) कहते हैं?' },
    options: [
      { en: '1, 5, 9', hi: '1, 5, 9' },
      { en: '3, 6, 10, 11', hi: '3, 6, 10, 11' },
      { en: '2, 7, 12', hi: '2, 7, 12' },
      { en: '4, 8, 12', hi: '4, 8, 12' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Upachaya houses (3, 6, 10, 11) are called growth houses because natural malefics (Sun, Mars, Saturn) perform well here. Results improve over time. The 11th house of gains is particularly important for material success.', hi: 'उपचय भाव (3, 6, 10, 11) वृद्धि के भाव कहलाते हैं क्योंकि प्राकृतिक पापग्रह (सूर्य, मंगल, शनि) यहाँ अच्छा प्रदर्शन करते हैं। परिणाम समय के साथ सुधरते हैं। लाभ का एकादश भाव भौतिक सफलता के लिए विशेष महत्वपूर्ण है।' },
  },
  {
    id: 'q9_2_08', type: 'true_false',
    question: { en: 'The 4th house signifies mother, property, vehicles, and emotional peace.', hi: 'चतुर्थ भाव माता, सम्पत्ति, वाहन और मानसिक शांति का सूचक है।' },
    correctAnswer: true,
    explanation: { en: 'The 4th house (Sukha Sthana, house of happiness) covers mother, home, landed property, vehicles, inner contentment, formal education, and the heart. A strong 4th house gives domestic happiness and emotional stability.', hi: 'चतुर्थ भाव (सुख स्थान) माता, गृह, भू-सम्पत्ति, वाहन, आन्तरिक संतुष्टि, शिक्षा और हृदय को कवर करता है। सशक्त चतुर्थ भाव पारिवारिक सुख और भावनात्मक स्थिरता देता है।' },
  },
  {
    id: 'q9_2_09', type: 'mcq',
    question: { en: 'If the lord of the 7th house is placed in the 12th house, what could it indicate?', hi: 'यदि सप्तम भाव का स्वामी द्वादश भाव में हो, तो यह क्या संकेत कर सकता है?' },
    options: [
      { en: 'Early marriage', hi: 'शीघ्र विवाह' },
      { en: 'Spouse from a foreign land or settlement abroad after marriage', hi: 'विदेशी जीवनसाथी या विवाह के बाद विदेश में बसना' },
      { en: 'No marriage at all', hi: 'विवाह बिल्कुल नहीं' },
      { en: 'Spouse will be very wealthy', hi: 'जीवनसाथी बहुत धनी होगा' },
    ],
    correctAnswer: 1,
    explanation: { en: 'When the 7th lord (marriage) goes to the 12th (foreign lands, bed pleasures, loss), it often indicates a foreign spouse, marriage abroad, or settling in a foreign country after marriage. It can also indicate spiritual partnership.', hi: 'जब सप्तम स्वामी (विवाह) द्वादश (विदेश, शय्या सुख, व्यय) में जाता है, तो अक्सर विदेशी जीवनसाथी, विदेश में विवाह, या विवाह के बाद विदेश में बसने का संकेत होता है। यह आध्यात्मिक साझेदारी का भी संकेत हो सकता है।' },
  },
  {
    id: 'q9_2_10', type: 'mcq',
    question: { en: 'The 10th house primarily signifies:', hi: 'दशम भाव मुख्य रूप से किसका सूचक है?' },
    options: [
      { en: 'Children and education', hi: 'संतान और शिक्षा' },
      { en: 'Career, public reputation, and karma', hi: 'कैरियर, सार्वजनिक प्रतिष्ठा और कर्म' },
      { en: 'Marriage and partnerships', hi: 'विवाह और साझेदारी' },
      { en: 'Enemies and disease', hi: 'शत्रु और रोग' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The 10th house (Karma Bhava) is the most visible point of the chart — the Midheaven. It governs career, profession, public reputation, authority, and the actions for which you are known in the world.', hi: 'दशम भाव (कर्म भाव) कुण्डली का सबसे दृश्य बिन्दु है — मध्यावकाश। यह कैरियर, व्यवसाय, सार्वजनिक प्रतिष्ठा, अधिकार और उन कर्मों पर शासन करता है जिनके लिए आप संसार में जाने जाते हैं।' },
  },
];

/* ─── Page 1: The 12 Houses ──────────────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? '12 भाव: जीवन का नक्शा' : 'The 12 Houses: A Map of Life'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>12 भाव आकाश को 12 खण्डों में विभाजित करते हैं, प्रत्येक मानव अनुभव के एक विशिष्ट क्षेत्र पर शासन करता है। जन्म से मृत्यु तक, धन से मोक्ष तक, जीवन का हर पहलू इन भावों में से किसी एक में अपना स्थान पाता है। भावों को समझना किसी भी कुण्डली पढ़ने का पहला कदम है।</> : <>The 12 houses (Bhavas) divide the sky into 12 sectors, each governing a specific domain of human experience. From birth to death, from wealth to liberation, every aspect of life finds its place in one of these houses. Understanding the houses is the first step in reading any chart.</>}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { n: '1st', hi: 'प्रथम', name: 'Tanu', desc: 'Self, body, personality, appearance', hiDesc: 'आत्म, शरीर, व्यक्तित्व, रूप' },
            { n: '2nd', hi: 'द्वितीय', name: 'Dhana', desc: 'Wealth, family, speech, food', hiDesc: 'धन, परिवार, वाणी, भोजन' },
            { n: '3rd', hi: 'तृतीय', name: 'Sahaja', desc: 'Siblings, courage, short journeys, skills', hiDesc: 'भाई-बहन, साहस, लघु यात्रा, कौशल' },
            { n: '4th', hi: 'चतुर्थ', name: 'Sukha', desc: 'Mother, property, vehicles, inner peace', hiDesc: 'माता, सम्पत्ति, वाहन, मानसिक शांति' },
            { n: '5th', hi: 'पंचम', name: 'Putra', desc: 'Children, education, creativity, romance', hiDesc: 'संतान, शिक्षा, रचनात्मकता, प्रेम' },
            { n: '6th', hi: 'षष्ठ', name: 'Ripu', desc: 'Enemies, disease, debts, daily work', hiDesc: 'शत्रु, रोग, ऋण, दैनिक कार्य' },
            { n: '7th', hi: 'सप्तम', name: 'Yuvati', desc: 'Marriage, spouse, business partners', hiDesc: 'विवाह, जीवनसाथी, व्यापार साझेदार' },
            { n: '8th', hi: 'अष्टम', name: 'Randhra', desc: 'Longevity, hidden matters, inheritance', hiDesc: 'आयु, गुप्त विषय, विरासत' },
            { n: '9th', hi: 'नवम', name: 'Dharma', desc: 'Luck, father, guru, higher learning, dharma', hiDesc: 'भाग्य, पिता, गुरु, उच्च शिक्षा, धर्म' },
            { n: '10th', hi: 'दशम', name: 'Karma', desc: 'Career, public reputation, authority', hiDesc: 'कैरियर, प्रतिष्ठा, अधिकार' },
            { n: '11th', hi: 'एकादश', name: 'Labha', desc: 'Gains, income, friends, elder siblings, wishes', hiDesc: 'लाभ, आय, मित्र, बड़े भाई-बहन, इच्छाएँ' },
            { n: '12th', hi: 'द्वादश', name: 'Vyaya', desc: 'Loss, expenses, foreign travel, moksha', hiDesc: 'हानि, व्यय, विदेश यात्रा, मोक्ष' },
          ].map(h => (
            <div key={h.n} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-2.5">
              <span className="text-gold-light font-bold">{h.n}</span> <span className="text-gold-dark">({h.name})</span>
              <span className="text-text-tertiary ml-1">{isHi ? h.hi : ''}</span>
              <p className="text-text-tertiary mt-0.5">{isHi ? <>{h.hiDesc}</> : <>{h.desc}</>}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>भाव सूचकताएँ BPHS अध्याय 11-12, फलदीपिका अध्याय 2, और सारावली में वर्णित हैं। पराशर ने व्यवस्थित रूप से प्रत्येक भाव के शासन क्षेत्र सूचीबद्ध किए, और बाद के टीकाकारों जैसे वराहमिहिर और मन्त्रेश्वर ने इन सूचियों को परिष्कृत और विस्तारित किया। 12-भाव प्रणाली दो सहस्राब्दियों से उल्लेखनीय रूप से स्थिर रही है।</> : <>The house significations are described in BPHS Chapters 11-12, Phaladeepika Chapter 2, and Saravali. Parashara systematically lists what each house governs, and later commentators like Varahamihira and Mantreshwara refined and expanded these lists. The 12-house system has remained remarkably stable for over two millennia.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: House Classifications ──────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'भाव वर्गीकरण' : 'House Classifications'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>भावों को कार्यात्मक श्रेणियों में बाँटा जाता है जो निर्धारित करती हैं कि उनके स्वामी कुण्डली में कैसा व्यवहार करते हैं। यह वर्गीकरण अत्यंत महत्वपूर्ण है — त्रिकोण भाव का स्वामी स्वभावतः शुभ होता है, जबकि दुःस्थान भाव का स्वामी चुनौतियाँ लाता है। ये समूह योगों (ग्रह संयोजन) का आधार बनाते हैं।</> : <>Houses are grouped into functional categories that determine how their lords behave in the chart. This classification is crucial — a planet ruling a Trikona house is inherently auspicious, while a planet ruling a Dusthana house carries challenges. These groupings form the foundation of yogas (planetary combinations).</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Kendra (Pillars) — 1, 4, 7, 10 / केन्द्र (स्तम्भ)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>चार कोणीय भाव संरचनात्मक रीढ़ हैं। ये जीवन के चार स्तम्भ दर्शाते हैं: आत्म, गृह, संबंध, कर्म। केन्द्र में ग्रह केन्द्र बल प्राप्त करते हैं। केन्द्र में शुभ ग्रह पूरी कुण्डली को उन्नत करते हैं।</> : <>The four angular houses form the structural backbone. They represent the four pillars of life: self, home, relationships, career. Planets in Kendras gain Kendra Bala (angular strength). Benefics in Kendras uplift the entire chart.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-emerald-500/10">
            <p className="text-emerald-400 font-bold text-sm">Trikona (Fortune) — 1, 5, 9 / त्रिकोण (भाग्य)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>त्रिकोण भाव लक्ष्मी स्थान हैं — दैवी कृपा के आसन। प्रथम भाव केन्द्र और त्रिकोण दोनों है (इसलिए लग्न स्वामी सदैव शुभ है)। पंचम पूर्व पुण्य (पूर्वजन्म का पुण्य), और नवम भाग्य और धर्म पर शासन करता है। त्रिकोण स्वामी सदैव शुभ कारक ग्रह होते हैं।</> : <>The trine houses are Lakshmi Sthanas — seats of divine grace. The 1st house is both Kendra and Trikona (hence the Lagna lord is always auspicious). The 5th governs Purva Punya (past-life merit), and the 9th governs Bhagya (fortune and dharma). Trikona lords are always benefic functional planets.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">Dusthana (Challenges) — 6, 8, 12 / दुःस्थान (चुनौतियाँ)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ये भाव बाधाओं से जुड़े हैं, लेकिन परिवर्तन से भी। षष्ठ प्रयास से शत्रुओं और रोग पर विजय देता है। अष्टम संकट से परिवर्तित करता है और गुप्त ज्ञान प्रदान करता है। द्वादश अहंकार को विलीन करके मोक्ष का मार्ग खोलता है। प्राकृतिक पापग्रह यहाँ वास्तव में अच्छा प्रदर्शन कर सकते हैं।</> : <>These houses deal with obstacles, but also transformation. The 6th gives the ability to overcome enemies and disease through effort. The 8th transforms through crisis and grants hidden knowledge. The 12th dissolves ego and opens the path to moksha. Natural malefics can actually thrive here.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-blue-500/10">
            <p className="text-blue-300 font-bold text-sm">Upachaya (Growth) — 3, 6, 10, 11 / उपचय (वृद्धि)</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>इन भावों में परिणाम आयु और प्रयास के साथ सुधरते हैं। पापग्रह (सूर्य, मंगल, शनि, राहु) यहाँ स्थित होकर उत्पादक बनते हैं — वे अपनी आक्रामक ऊर्जा को साहस (तृतीय), प्रतिस्पर्धा पर विजय (षष्ठ), कर्म महत्वाकांक्षा (दशम), और भौतिक लाभ (एकादश) में प्रवाहित करते हैं।</> : <>Results in these houses improve with age and effort. Malefic planets (Sun, Mars, Saturn, Rahu) placed here become productive — they channel their aggressive energy into courage (3rd), defeating competition (6th), career ambition (10th), and material gains (11th).</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'केन्द्र + त्रिकोण = राजयोग क्यों' : 'Why Kendra + Trikona = Raja Yoga'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>केन्द्र विष्णु (धारण शक्ति) और त्रिकोण लक्ष्मी (भाग्य, कृपा) का प्रतिनिधित्व करते हैं। जब उनके स्वामी एक साथ आते हैं — युति, परस्पर दृष्टि, या राशि परिवर्तन से — शक्ति और भाग्य का मिलन राजयोग बनाता है, अर्थात &quot;राजसी संयोजन।&quot; यह पाराशरी ज्योतिष का सबसे महत्वपूर्ण योग सिद्धांत है।</> : <>Kendras represent Vishnu (sustaining power) and Trikonas represent Lakshmi (fortune, grace). When their lords come together — by conjunction, mutual aspect, or sign exchange — the union of power and fortune creates Raja Yoga, literally &quot;royal combination.&quot; This is the single most important yoga principle in Parashari Jyotish.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: House Lords ────────────────────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'भाव स्वामी — किस भाव का मालिक कौन?' : 'House Lords — Who Owns Which House?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक भाव का &quot;स्वामी&quot; वह ग्रह है जो उसमें स्थित राशि का शासक है। उदाहरण के लिए, यदि मेष पंचम भाव में है, तो मंगल पंचम भाव का स्वामी है। यदि तुला एकादश भाव में है, तो शुक्र एकादश का स्वामी है। भाव स्वामी जहाँ भी जाता है वहाँ भाव की सूचकताएँ ले जाता है — यदि पंचम स्वामी दशम भाव में जाता है, तो संतान/रचनात्मकता (पंचम) कर्म (दशम) से मिलता है, शायद शिक्षा, मनोरंजन, या बच्चों से जुड़े कार्य में कैरियर।</> : <>Every house is &quot;owned&quot; by the planet that rules the sign occupying it. For example, if Aries falls in the 5th house, Mars rules the 5th house. If Libra falls in the 11th house, Venus rules the 11th. The house lord carries the house&apos;s significations wherever it goes — if the 5th lord goes to the 10th house, children/creativity (5th) merges with career (10th), perhaps indicating a career in education, entertainment, or work involving children.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मुख्य सिद्धांत: <strong className="text-gold-light">प्रथम भाव स्वामी दशम में</strong> = आत्म (प्रथम) कर्म और सार्वजनिक जीवन (दशम) की ओर — स्वाभाविक नेता। <strong className="text-gold-light">सप्तम स्वामी द्वादश में</strong> = विवाह (सप्तम) का विदेश (द्वादश) से संबंध — अक्सर विदेशी जीवनसाथी या विवाह के बाद विदेश बसना। <strong className="text-gold-light">नवम स्वामी पंचम में</strong> = पिता का भाग्य (नवम) संतान/शिक्षा (पंचम) की ओर — सौभाग्यशाली पालन-पोषण, सशक्त उच्च शिक्षा।</> : <>Key principle: <strong className="text-gold-light">The lord of the 1st house placed in the 10th house</strong> = the self (1st) directed toward career and public life (10th) — a natural leader. <strong className="text-gold-light">The lord of the 7th in the 12th</strong> = marriage (7th) connecting to foreign lands (12th) — often a foreign spouse or settling abroad after marriage. <strong className="text-gold-light">The lord of the 9th in the 5th</strong> = father&apos;s fortune (9th) flowing to children/education (5th) — privileged upbringing, strong higher education.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 1: [2], 2: [5], 9: [4] }}
          title={isHi ? 'मेष लग्न — मंगल प्रथम में, शुक्र द्वितीय में, बृहस्पति नवम में' : 'Aries Lagna — Mars in 1st, Venus in 2nd, Jupiter in 9th'}
          highlight={[1, 2, 9]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">मेष लग्न:</span> मंगल प्रथम (मेष) और अष्टम (वृश्चिक) दोनों का स्वामी है। शुक्र द्वितीय (वृषभ) और सप्तम (तुला) का स्वामी है। बृहस्पति नवम (धनु) और द्वादश (मीन) का स्वामी है। यहाँ बृहस्पति नवम स्वामी के रूप में सर्वाधिक शुभ ग्रह है — यदि यह लग्न पर दृष्टि डाले या केन्द्र में बैठे, तो पूरी कुण्डली उन्नत होती है।</> : <><span className="text-gold-light font-medium">Aries Lagna:</span> Mars owns both the 1st (Aries) and 8th (Scorpio). Venus owns the 2nd (Taurus) and 7th (Libra). Jupiter owns the 9th (Sagittarius) and 12th (Pisces). Here, Jupiter as 9th lord is the most benefic planet — if it aspects the Lagna or sits in a Kendra, it uplifts the entire chart.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">कर्क लग्न:</span> चन्द्र प्रथम, सूर्य द्वितीय, मंगल पंचम और दशम का स्वामी है (अतः मंगल कर्क लग्न के लिए राजयोगकारक है क्योंकि यह त्रिकोण और केन्द्र दोनों का स्वामी है)। बृहस्पति षष्ठ और नवम का स्वामी है। शनि सप्तम और अष्टम का स्वामी है (मारक ग्रह — संभावित हानि)।</> : <><span className="text-gold-light font-medium">Cancer Lagna:</span> Moon rules the 1st, Sun rules the 2nd, Mars rules the 5th and 10th (hence Mars forms Raja Yoga for Cancer Lagna as it rules both a Trikona and a Kendra). Jupiter rules the 6th and 9th. Saturn rules the 7th and 8th (a Maraka planet — potential harm).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रांतियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;बृहस्पति सदैव शुभ और शनि सदैव अशुभ है।&quot; यह मूलतः गलत है। कारक स्वभाव स्वामित्व पर निर्भर करता है। वृषभ लग्न के लिए बृहस्पति अष्टम और एकादश का स्वामी है — विशेष शुभ नहीं। शनि नवम और दशम का स्वामी है — कुण्डली का सर्वश्रेष्ठ ग्रह जो योगकारक बनता है। प्राकृतिक शुभ ग्रह दुःस्थान का स्वामी होने पर हानिकारक बनते हैं; प्राकृतिक पापग्रह त्रिकोण का स्वामी होने पर सहायक बनते हैं।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;Jupiter is always good and Saturn is always bad.&quot; This is fundamentally wrong. Functional nature depends on lordship. For Taurus Lagna, Jupiter rules the 8th and 11th — not especially benefic. Saturn rules the 9th and 10th — the best planet in the chart forming Yoga Karaka. Natural benefics owning Dusthanas become harmful; natural malefics owning Trikonas become helpful.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन लग्न राशि और समभाव पद्धति के आधार पर प्रत्येक कुण्डली के भाव स्वामियों की स्वचालित गणना करता है। टिप्पणी (व्याख्यात्मक भाष्य) प्रत्येक भाव स्वामी की स्थिति का विश्लेषण करती है, योगों की पहचान करती है, शक्ति का मूल्यांकन करती है, और जीवन-क्षेत्र भविष्यवाणियाँ प्रदान करती है।</> : <>Our Kundali engine automatically calculates house lords for every chart based on the Lagna sign and the Equal House system. The tippanni (interpretive commentary) analyzes each house lord&apos;s placement, identifying yogas, evaluating strength, and providing life-area predictions. You can generate your chart and see exactly which planet rules each house in your life.</>}</p>
      </section>
    </div>
  );
}

export default function Module9_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

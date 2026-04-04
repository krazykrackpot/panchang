'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_6_1', phase: 2, topic: 'Nakshatra', moduleNumber: '6.1',
  title: { en: 'Nakshatra System — The 27 Lunar Mansions', hi: 'नक्षत्र पद्धति — 27 चान्द्र भवन' },
  subtitle: {
    en: 'The ecliptic divided into 27 equal segments of 13°20\', each tied to a junction star, a deity, and a ruling planet',
    hi: 'क्रान्तिवृत्त को 13°20\' के 27 समान खण्डों में विभक्त किया गया है, प्रत्येक एक योगतारा, देवता और स्वामी ग्रह से जुड़ा है',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 6-2: Nakshatra Padas', hi: 'मॉड्यूल 6-2: नक्षत्र पाद' }, href: '/learn/modules/6-2' },
    { label: { en: 'Module 6-3: Nakshatra Compatibility', hi: 'मॉड्यूल 6-3: नक्षत्र मेलापक' }, href: '/learn/modules/6-3' },
    { label: { en: 'Module 6-4: Nakshatra Lords & Dasha', hi: 'मॉड्यूल 6-4: नक्षत्र स्वामी एवं दशा' }, href: '/learn/modules/6-4' },
    { label: { en: 'Nakshatras Deep Dive', hi: 'नक्षत्र विस्तार' }, href: '/learn/nakshatras' },
    { label: { en: 'Daily Nakshatra', hi: 'दैनिक नक्षत्र' }, href: '/panchang/nakshatra' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q6_1_01', type: 'mcq',
    question: {
      en: 'How many nakshatras divide the ecliptic in the Vedic system?',
      hi: 'वैदिक पद्धति में क्रान्तिवृत्त को कितने नक्षत्रों में विभक्त किया गया है?',
    },
    options: [
      { en: '12', hi: '12' },
      { en: '27', hi: '27' },
      { en: '28', hi: '28' },
      { en: '30', hi: '30' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Vedic system divides the ecliptic into 27 nakshatras, each spanning 13°20\'. The number 27 approximates the Moon\'s sidereal orbital period of about 27.3 days.',
      hi: 'वैदिक पद्धति क्रान्तिवृत्त को 27 नक्षत्रों में विभक्त करती है, प्रत्येक 13°20\' का। संख्या 27 चन्द्रमा की नाक्षत्र कक्षा अवधि (लगभग 27.3 दिन) के निकट है।',
    },
  },
  {
    id: 'q6_1_02', type: 'mcq',
    question: {
      en: 'What is the angular span of each nakshatra?',
      hi: 'प्रत्येक नक्षत्र का कोणीय विस्तार कितना है?',
    },
    options: [
      { en: '12 degrees', hi: '12 अंश' },
      { en: '13 degrees 20 minutes', hi: '13 अंश 20 कला' },
      { en: '15 degrees', hi: '15 अंश' },
      { en: '10 degrees', hi: '10 अंश' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each nakshatra spans 13°20\' (13.333... degrees). 360° / 27 = 13°20\'. This is different from a tithi which spans 12°.',
      hi: 'प्रत्येक नक्षत्र 13°20\' (13.333... अंश) में फैला है। 360° / 27 = 13°20\'। यह तिथि के 12° विस्तार से भिन्न है।',
    },
  },
  {
    id: 'q6_1_03', type: 'true_false',
    question: {
      en: 'The yogtara (junction star) is the brightest star in every nakshatra without exception.',
      hi: 'योगतारा (जंक्शन स्टार) प्रत्येक नक्षत्र का बिना अपवाद सबसे चमकीला तारा होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The yogtara is the reference star closest to the ecliptic within each nakshatra zone, not necessarily the brightest. For some nakshatras the yogtara is a relatively faint star chosen for its proximity to the ecliptic midpoint.',
      hi: 'असत्य। योगतारा प्रत्येक नक्षत्र क्षेत्र में क्रान्तिवृत्त के निकटतम सन्दर्भ तारा है, आवश्यक नहीं कि सबसे चमकीला हो। कुछ नक्षत्रों में योगतारा अपेक्षाकृत धुँधला तारा है जो क्रान्तिवृत्त मध्यबिन्दु से निकटता के कारण चुना गया।',
    },
  },
  {
    id: 'q6_1_04', type: 'mcq',
    question: {
      en: 'Which nakshatra begins the sequence at 0° sidereal Aries (Mesha)?',
      hi: 'नाक्षत्र सायन मेष (0°) से कौन-सा नक्षत्र आरम्भ होता है?',
    },
    options: [
      { en: 'Rohini', hi: 'रोहिणी' },
      { en: 'Bharani', hi: 'भरणी' },
      { en: 'Ashwini', hi: 'अश्विनी' },
      { en: 'Krittika', hi: 'कृत्तिका' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Ashwini is the first nakshatra, spanning 0° to 13°20\' of sidereal Aries. It is ruled by Ketu and its deity is the Ashwini Kumaras, the divine physicians.',
      hi: 'अश्विनी प्रथम नक्षत्र है, जो निरयन मेष के 0° से 13°20\' तक फैला है। इसका स्वामी केतु है और इसके देवता अश्विनी कुमार (दिव्य वैद्य) हैं।',
    },
  },
  {
    id: 'q6_1_05', type: 'mcq',
    question: {
      en: 'The Moon stays in one nakshatra for approximately how long?',
      hi: 'चन्द्रमा एक नक्षत्र में लगभग कितने समय तक रहता है?',
    },
    options: [
      { en: 'About 12 hours', hi: 'लगभग 12 घण्टे' },
      { en: 'About 1 day (24 hours)', hi: 'लगभग 1 दिन (24 घण्टे)' },
      { en: 'About 2.5 days', hi: 'लगभग 2.5 दिन' },
      { en: 'About 7 days', hi: 'लगभग 7 दिन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon completes one sidereal revolution in ~27.3 days across 27 nakshatras, so it spends roughly 1 day (about 24 hours) in each nakshatra. The actual duration varies from ~19 to ~26 hours due to the Moon\'s elliptical orbit.',
      hi: 'चन्द्रमा ~27.3 दिनों में 27 नक्षत्रों में एक नाक्षत्र परिक्रमा पूर्ण करता है, अतः वह प्रत्येक नक्षत्र में लगभग 1 दिन (करीब 24 घण्टे) रहता है। वास्तविक अवधि चन्द्रमा की दीर्घवृत्ताकार कक्षा के कारण ~19 से ~26 घण्टे तक भिन्न होती है।',
    },
  },
  {
    id: 'q6_1_06', type: 'true_false',
    question: {
      en: 'Dhruva (fixed) nakshatras like Rohini and Uttara Phalguni are ideal for laying foundations and permanent constructions.',
      hi: 'ध्रुव (स्थिर) नक्षत्र जैसे रोहिणी और उत्तरा फाल्गुनी नींव रखने और स्थायी निर्माण के लिए आदर्श हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Dhruva nakshatras signify permanence and stability. Activities meant to endure — foundations, coronations, planting perennial trees — are recommended under these nakshatras.',
      hi: 'सत्य। ध्रुव नक्षत्र स्थायित्व और दृढ़ता का प्रतीक हैं। स्थायी रहने वाले कार्य — नींव, राज्याभिषेक, बारहमासी वृक्षारोपण — इन नक्षत्रों में करने की संस्तुति है।',
    },
  },
  {
    id: 'q6_1_07', type: 'mcq',
    question: {
      en: 'Which gana (temperament) classification does NOT exist in the nakshatra system?',
      hi: 'नक्षत्र पद्धति में कौन-सा गण (स्वभाव) वर्गीकरण विद्यमान नहीं है?',
    },
    options: [
      { en: 'Deva (divine)', hi: 'देव (दिव्य)' },
      { en: 'Manushya (human)', hi: 'मनुष्य (मानव)' },
      { en: 'Rakshasa (demonic)', hi: 'राक्षस (आसुरी)' },
      { en: 'Pishach (ghostly)', hi: 'पिशाच (प्रेत)' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'The three ganas are Deva (divine, gentle), Manushya (human, mixed), and Rakshasa (fierce, independent). There is no Pishach gana in the nakshatra classification system.',
      hi: 'तीन गण हैं — देव (दिव्य, सौम्य), मनुष्य (मानव, मिश्र) और राक्षस (उग्र, स्वतन्त्र)। नक्षत्र वर्गीकरण में कोई पिशाच गण नहीं है।',
    },
  },
  {
    id: 'q6_1_08', type: 'mcq',
    question: {
      en: 'Tikshna (sharp) nakshatras like Ardra and Mula are best suited for:',
      hi: 'तीक्ष्ण (उग्र) नक्षत्र जैसे आर्द्रा और मूल किस कार्य के लिए सर्वाधिक उपयुक्त हैं?',
    },
    options: [
      { en: 'Weddings and engagements', hi: 'विवाह और सगाई' },
      { en: 'Filing lawsuits, surgery, demolition', hi: 'मुकदमा दायर करना, शल्य चिकित्सा, विध्वंस' },
      { en: 'Starting a new business', hi: 'नया व्यापार आरम्भ करना' },
      { en: 'Naming ceremonies for children', hi: 'बच्चों का नामकरण संस्कार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Tikshna nakshatras carry a sharp, cutting energy ideal for confrontational or destructive activities: surgery, filing legal cases, breaking ground, demolition, or tantric practices.',
      hi: 'तीक्ष्ण नक्षत्रों में तीव्र, काटने वाली ऊर्जा होती है जो टकरावपूर्ण या विध्वंसक कार्यों के लिए आदर्श है: शल्य चिकित्सा, कानूनी मुकदमे, भूमि खनन, विध्वंस, या तान्त्रिक साधना।',
    },
  },
  {
    id: 'q6_1_09', type: 'true_false',
    question: {
      en: 'The Vimshottari dasha starting planet is determined by the Moon\'s nakshatra at the time of birth.',
      hi: 'विंशोत्तरी दशा का आरम्भिक ग्रह जन्म के समय चन्द्रमा के नक्षत्र से निर्धारित होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The nakshatra in which the Moon is placed at birth determines the ruling planet, which becomes the starting Mahadasha lord. For example, Moon in Ashwini (Ketu-ruled) starts with Ketu Mahadasha.',
      hi: 'सत्य। जन्म के समय चन्द्रमा जिस नक्षत्र में स्थित होता है उसका स्वामी ग्रह प्रथम महादशा नाथ बनता है। उदाहरणार्थ, अश्विनी (केतु-शासित) में चन्द्रमा हो तो केतु महादशा से आरम्भ होती है।',
    },
  },
  {
    id: 'q6_1_10', type: 'mcq',
    question: {
      en: 'How many nakshatras belong to the Deva gana?',
      hi: 'देव गण में कितने नक्षत्र आते हैं?',
    },
    options: [
      { en: '7', hi: '7' },
      { en: '9', hi: '9' },
      { en: '11', hi: '11' },
      { en: '12', hi: '12' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Nine nakshatras belong to Deva gana: Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, and Revati. They are considered gentle, harmonious, and sattvic in nature.',
      hi: 'देव गण में नौ नक्षत्र आते हैं: अश्विनी, मृगशिरा, पुनर्वसु, पुष्य, हस्त, स्वाति, अनुराधा, श्रवण और रेवती। ये सौम्य, सामंजस्यपूर्ण और सात्त्विक स्वभाव के माने जाते हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नक्षत्र क्या हैं?' : 'What Are Nakshatras?'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 27 nakshatras are equal divisions of the ecliptic, each spanning exactly 13 degrees and 20 arc-minutes (13.333... degrees). Together they cover the full 360-degree circle of the zodiac. The word &quot;nakshatra&quot; derives from &quot;naksha&quot; (map) and &quot;tra&quot; (guard) — literally the guardians of the celestial map. While the 12 rashis (signs) divide the sky into 30-degree sectors tied to solar months, the nakshatras provide a finer, lunar-based grid that has been fundamental to Indian astronomy since the Rigvedic era.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          27 नक्षत्र क्रान्तिवृत्त के समान विभाजन हैं, प्रत्येक ठीक 13 अंश 20 कला (13.333... अंश) में फैला है। साथ मिलकर ये राशिचक्र के पूर्ण 360 अंश को आवृत करते हैं। &quot;नक्षत्र&quot; शब्द &quot;नक्ष&quot; (मानचित्र) और &quot;त्र&quot; (रक्षक) से बना है — शाब्दिक अर्थ आकाशीय मानचित्र के रक्षक। जहाँ 12 राशियाँ आकाश को सौर मासों से जुड़े 30-अंश के खण्डों में विभक्त करती हैं, वहीं नक्षत्र एक सूक्ष्मतर चन्द्र-आधारित जालिका प्रदान करते हैं जो ऋग्वैदिक काल से भारतीय खगोलशास्त्र का आधार रही है।
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Why 27? The Moon completes one sidereal revolution — returning to the same star background — in approximately 27.3 days. This means the Moon transits roughly one nakshatra per day, making nakshatras the natural &quot;daily calendar&quot; of the Moon. Ancient astronomers observed which star cluster the Moon was near each night and codified 27 such stations. Each nakshatra is anchored by a yogtara (junction star), the reference star closest to the ecliptic within that segment. The yogtara is used for identification: when the Moon is near the yogtara of Rohini, we say the Moon is in Rohini nakshatra.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          27 क्यों? चन्द्रमा एक नाक्षत्र परिक्रमा — उसी तारा पृष्ठभूमि पर लौटना — लगभग 27.3 दिनों में पूर्ण करता है। इसका अर्थ है कि चन्द्रमा प्रतिदिन लगभग एक नक्षत्र पार करता है, जिससे नक्षत्र चन्द्रमा का प्राकृतिक &quot;दैनिक पंचांग&quot; बन जाता है। प्राचीन खगोलविदों ने प्रत्येक रात्रि चन्द्रमा किस तारा-समूह के निकट है यह प्रेक्षित किया और 27 ऐसे स्थानों को संहिताबद्ध किया। प्रत्येक नक्षत्र एक योगतारा (जंक्शन स्टार) से आबद्ध है — उस खण्ड में क्रान्तिवृत्त के निकटतम सन्दर्भ तारा। योगतारा पहचान हेतु प्रयुक्त होता है: जब चन्द्रमा रोहिणी के योगतारा के निकट हो, तो हम कहते हैं चन्द्रमा रोहिणी नक्षत्र में है।
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नाम, देवता एवं स्वामी ग्रह' : 'Names, Deities & Ruling Planets'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 27 nakshatras in order are: Ashwini, Bharani, Krittika, Rohini, Mrigashira, Ardra, Punarvasu, Pushya, Ashlesha, Magha, Purva Phalguni, Uttara Phalguni, Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha, Mula, Purva Ashadha, Uttara Ashadha, Shravana, Dhanishtha, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, and Revati. Each has a presiding deity: for example, Ashwini Kumaras (divine physicians) rule Ashwini, Yama (lord of death) rules Bharani, Agni (fire god) rules Krittika, and Brahma rules Rohini. The deity imbues each nakshatra with its core signification — Ashwini gives healing, Bharani governs transformation, Krittika brings purification.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          27 नक्षत्र क्रम से हैं: अश्विनी, भरणी, कृत्तिका, रोहिणी, मृगशिरा, आर्द्रा, पुनर्वसु, पुष्य, आश्लेषा, मघा, पूर्वा फाल्गुनी, उत्तरा फाल्गुनी, हस्त, चित्रा, स्वाति, विशाखा, अनुराधा, ज्येष्ठा, मूल, पूर्वाषाढ़ा, उत्तराषाढ़ा, श्रवण, धनिष्ठा, शतभिषा, पूर्वा भाद्रपद, उत्तरा भाद्रपद और रेवती। प्रत्येक का एक अधिष्ठाता देवता है: उदाहरणार्थ, अश्विनी कुमार (दिव्य वैद्य) अश्विनी पर शासन करते हैं, यम (मृत्यु के देवता) भरणी पर, अग्नि (अग्निदेव) कृत्तिका पर, और ब्रह्मा रोहिणी पर। देवता प्रत्येक नक्षत्र को उसका मूल फलादेश प्रदान करता है — अश्विनी चिकित्सा देता है, भरणी रूपान्तरण का शासक है, कृत्तिका शुद्धिकरण लाती है।
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'नक्षत्र पद्धति मानव सभ्यता के प्राचीनतम खगोलीय ढाँचों में से एक है। तैत्तिरीय संहिता और अथर्ववेद (लगभग 1500-1000 ई.पू.) में 27 (कभी-कभी अभिजित सहित 28) नक्षत्रों का उनके देवताओं सहित उल्लेख है। वेदांग ज्योतिष, प्राचीनतम भारतीय खगोलीय ग्रन्थ, नक्षत्रों को प्राथमिक निर्देशांक पद्धति के रूप में प्रयोग करता है। सूर्य सिद्धान्त प्रत्येक योगतारा की सटीक क्रान्तिवृत्तीय स्थिति देता है। वराहमिहिर की बृहत्संहिता (छठी शताब्दी ई.) प्रत्येक नक्षत्र के गुण, देवता और सांसारिक फलादेश का विस्तृत विवरण प्रदान करती है।'
            : 'The nakshatra system is among the oldest astronomical frameworks in human civilization. The Taittiriya Samhita and Atharvaveda (c. 1500-1000 BCE) enumerate the 27 (sometimes 28, including Abhijit) nakshatras with their deities. The Vedanga Jyotisha, the earliest Indian astronomical treatise, uses nakshatras as the primary coordinate system. Surya Siddhanta provides precise ecliptic positions for each yogtara. Varahamihira&apos;s Brihat Samhita (6th century CE) elaborates the qualities, deities, and mundane significations of each nakshatra in extensive detail.'}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नक्षत्र गुण (स्वभाव)' : 'Nakshatra Qualities (Svabhava)'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक नक्षत्र सात क्रिया श्रेणियों में से एक में आता है जो निर्धारित करती है कि चन्द्रमा उस नक्षत्र में गोचर करते समय कौन-से कार्य सर्वोत्तम हैं। ध्रुव (स्थिर) नक्षत्र — रोहिणी, उत्तरा फाल्गुनी, उत्तराषाढ़ा, उत्तरा भाद्रपद — स्थायित्व और दृढ़ता के प्रतीक हैं; ये नींव, राज्याभिषेक, बारहमासी फसल बोने और किसी भी स्थायी कार्य के लिए आदर्श हैं। चर (गतिशील) नक्षत्र — पुनर्वसु, स्वाति, श्रवण, धनिष्ठा, शतभिषा — यात्रा, वाहन क्रय और गति या परिवर्तन वाले कार्यों के लिए उपयुक्त हैं।'
            : 'Each nakshatra belongs to one of seven activity categories that determine which types of actions are best performed when the Moon transits that nakshatra. Dhruva (fixed) nakshatras — Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada — signify permanence and stability; they are ideal for foundations, coronations, planting perennial crops, and any activity meant to endure. Chara (movable) nakshatras — Punarvasu, Swati, Shravana, Dhanishtha, Shatabhisha — suit travel, vehicle purchase, and activities involving movement or change.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'तीक्ष्ण (उग्र) नक्षत्र — आर्द्रा, आश्लेषा, ज्येष्ठा, मूल — में भेदक, आक्रामक ऊर्जा होती है जो शल्यक्रिया, मुकदमा, विध्वंस और तान्त्रिक साधना हेतु उपयुक्त है। मृदु (कोमल) नक्षत्र — मृगशिरा, चित्रा, अनुराधा, रेवती — सौम्य हैं और कला, संगीत, प्रणय, नये वस्त्र धारण और विद्याध्ययन के लिए अनुकूल हैं। उग्र (प्रचण्ड) नक्षत्र — भरणी, मघा, पूर्वा फाल्गुनी, पूर्वाषाढ़ा, पूर्वा भाद्रपद — विध्वंसक या रूपान्तरकारी ऊर्जा लाते हैं, प्रतिस्पर्धी या युद्धात्मक कार्यों के लिए उपयुक्त। मिश्र नक्षत्र — कृत्तिका, विशाखा — कोमल और तीक्ष्ण दोनों गुणों का संयोजन रखते हैं।'
            : 'Tikshna (sharp) nakshatras — Ardra, Ashlesha, Jyeshtha, Mula — carry a piercing, aggressive energy suited for surgery, filing lawsuits, demolition, and tantric practices. Mridu (soft) nakshatras — Mrigashira, Chitra, Anuradha, Revati — are gentle and favorable for arts, music, romance, wearing new clothes, and learning. Ugra (fierce) nakshatras — Bharani, Magha, Purva Phalguni, Purva Ashadha, Purva Bhadrapada — bring destructive or transformative energy, suited for competitive or combative actions. Mishra (mixed) nakshatras — Krittika, Vishakha — combine both soft and sharp qualities.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'तीन गण' : 'The Three Ganas'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'प्रत्येक नक्षत्र तीन गणों (स्वभावों) में से एक का होता है जो उस नक्षत्र में जन्मे व्यक्तियों की मूल प्रकृति का वर्णन करता है। देव गण (दिव्य स्वभाव) में 9 नक्षत्र हैं: अश्विनी, मृगशिरा, पुनर्वसु, पुष्य, हस्त, स्वाति, अनुराधा, श्रवण और रेवती। देव नक्षत्र में जन्मे लोग सौम्य, सुसंस्कृत, कूटनीतिक और आध्यात्मिक प्रवृत्ति के माने जाते हैं। मनुष्य गण (मानव स्वभाव) में भी 9 नक्षत्र हैं: भरणी, रोहिणी, आर्द्रा, पूर्वा फाल्गुनी, उत्तरा फाल्गुनी, पूर्वाषाढ़ा, उत्तराषाढ़ा, पूर्वा भाद्रपद और उत्तरा भाद्रपद। ये व्यक्ति सांसारिक महत्त्वाकांक्षा और नैतिक संवेदनशीलता का सन्तुलित मिश्रण प्रदर्शित करते हैं। राक्षस गण (आसुरी स्वभाव) में शेष 9 नक्षत्र आते हैं: कृत्तिका, आश्लेषा, मघा, चित्रा, विशाखा, ज्येष्ठा, मूल, धनिष्ठा और शतभिषा। ये व्यक्ति स्वतन्त्र, प्रबल इच्छाशक्ति वाले और पारम्परिक बन्धनों को तोड़ने वाले होते हैं।'
            : 'Every nakshatra belongs to one of three ganas (temperaments) that describe the fundamental nature of people born under that star. Deva gana (divine temperament) includes 9 nakshatras: Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, and Revati. People born under Deva nakshatras are considered gentle, cultured, diplomatic, and spiritually inclined. Manushya gana (human temperament) also has 9 nakshatras: Bharani, Rohini, Ardra, Purva Phalguni, Uttara Phalguni, Purva Ashadha, Uttara Ashadha, Purva Bhadrapada, and Uttara Bhadrapada. These individuals exhibit a balanced mix of worldly ambition and moral sensitivity.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 1:</span> एक परिवार गृह प्रवेश का समय निश्चित करना चाहता है। आदर्श नक्षत्र ध्रुव प्रकार के होंगे: रोहिणी (ब्रह्मा के अधीन स्थायित्व, समृद्धि), उत्तरा फाल्गुनी (अर्यमन के अधीन स्थिरता), या उत्तराषाढ़ा (विश्वदेवों के अधीन स्थायी विजय)। तीक्ष्ण नक्षत्र जैसे आर्द्रा या मूल से बचना चाहिए, जो घर में अस्थिरता ला सकते हैं।</> : <><span className="text-gold-light font-medium">Example 1:</span> A family wants to schedule a housewarming (Griha Pravesh). Ideal nakshatras would be Dhruva types: Rohini (permanence, prosperity under Brahma), Uttara Phalguni (stability under Aryaman), or Uttara Ashadha (enduring victory under Vishvadevas). They should avoid Tikshna nakshatras like Ardra or Mula, which could bring instability to the home.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण 2:</span> पुष्य (देव गण, ध्रुव प्रकार, शनि शासित) में चन्द्रमा वाले व्यक्ति का स्वभाव पोषक और कर्तव्यनिष्ठ होगा। देव गण होने से सौम्य; ध्रुव होने से स्थिरता चाहने वाला; शनि स्वामी होने से अनुशासित। अनुकूलता मिलान में, अन्य देव गण नक्षत्रों के साथ सर्वोत्तम जोड़ी बनती है।</> : <><span className="text-gold-light font-medium">Example 2:</span> A person born with Moon in Pushya (Deva gana, Dhruva type, ruled by Saturn) would have a nurturing, dutiful personality. Being Deva gana, they are gentle; being Dhruva, they seek stability; Saturn as ruler gives discipline. In compatibility matching, they pair best with other Deva gana nakshatras.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;राक्षस गण के लोग दुष्ट या खतरनाक होते हैं।&quot; यह पूर्णतया गलत है। राक्षस गण स्वतन्त्रता, दृढ़ इच्छाशक्ति और अपरम्परागत चिन्तन का प्रतीक है। अनेक सफल नेता, नवप्रवर्तक और कलाकार राक्षस गण नक्षत्रों में जन्मे हैं। &quot;राक्षस&quot; शब्द स्वभाव की तीव्रता का वर्णन करता है, नैतिक चरित्र का नहीं। मूल (राक्षस गण) के जातक प्रायः गहन शोधकर्ता और अन्वेषक बनते हैं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Rakshasa gana people are evil or dangerous.&quot; This is entirely wrong. Rakshasa gana signifies independence, strong will, and unconventional thinking. Many successful leaders, innovators, and artists are born under Rakshasa gana nakshatras. The term &quot;Rakshasa&quot; describes temperament intensity, not moral character. Mula (Rakshasa gana) natives often become profound researchers and investigators.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'समकालीन भारत में नक्षत्र वर्गीकरण मुहूर्त (शुभ समय) चयन के लिए केन्द्रीय बना हुआ है। विवाह आयोजक, सम्पत्ति एजेंट और व्यापार परामर्शदाता महत्त्वपूर्ण कार्यक्रम निर्धारित करने से पहले नियमित रूप से पंचांग ऐप पर चन्द्रमा का नक्षत्र जाँचते हैं। हमारा अनुप्रयोग मीयस एल्गोरिदम द्वारा चन्द्रमा का सटीक निरयन भोगांश गणित करता है और वर्तमान नक्षत्र वास्तविक समय में निर्धारित करता है, जिससे उपयोगकर्ता उचित नक्षत्र गुण के अनुरूप कार्य नियोजित कर सकें।'
            : 'In contemporary India, nakshatra classifications remain central to muhurta (auspicious timing) selection. Wedding planners, real estate agents, and business consultants routinely consult Panchang apps to verify the Moon&apos;s nakshatra before scheduling important events. Our application computes the Moon&apos;s exact sidereal longitude using Meeus algorithms and determines the current nakshatra in real time, enabling users to plan activities aligned with the appropriate nakshatra quality.'}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'व्यावहारिक उपयोग: जन्म नक्षत्र एवं दशा' : 'Practical Usage: Birth Nakshatra & Dasha'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'ज्योतिष में नक्षत्रों का सर्वाधिक महत्त्वपूर्ण उपयोग जन्म पर विंशोत्तरी दशा क्रम निर्धारित करना है। जन्म के ठीक समय चन्द्रमा जिस नक्षत्र में हो, वह निर्धारित करता है कि कौन-सी ग्रह महादशा चल रही है। विंशोत्तरी पद्धति में प्रत्येक नक्षत्र का एक ग्रह स्वामी है: केतु अश्विनी, मघा, मूल का शासक; शुक्र भरणी, पूर्वा फाल्गुनी, पूर्वाषाढ़ा का; सूर्य कृत्तिका, उत्तरा फाल्गुनी, उत्तराषाढ़ा का; इसी प्रकार सभी 9 ग्रहों तक। यदि कोई बालक हस्त (चन्द्र शासित) में जन्मे तो जन्म पर चन्द्र महादशा सक्रिय होती है। उस दशा का शेष अंश चन्द्रमा ने नक्षत्र में कितनी दूरी तय की है उससे गणित किया जाता है।'
            : 'The most consequential application of nakshatras in Jyotish is determining the Vimshottari dasha sequence at birth. The nakshatra occupied by the Moon at the exact moment of birth dictates which planet&apos;s Mahadasha (major period) is running. Each nakshatra has a planetary ruler in the Vimshottari scheme: Ketu rules Ashwini, Magha, Mula; Venus rules Bharani, Purva Phalguni, Purva Ashadha; Sun rules Krittika, Uttara Phalguni, Uttara Ashadha; and so on through all 9 planets. If a child is born when the Moon is in Hasta (ruled by Moon), the Moon Mahadasha is active at birth. The remaining balance of that dasha is calculated from how far the Moon has progressed through the nakshatra.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नक्षत्र-आधारित शिशु नाम अक्षर' : 'Nakshatra-Based Baby Name Syllables'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi ? <>हिन्दू परिवारों में एक प्रिय परम्परा है कि शिशु का नामकरण जन्म नक्षत्र और पाद (चतुर्थांश) के आधार पर किया जाए। 108 पादों (27 नक्षत्र x 4 पाद) में से प्रत्येक को एक विशिष्ट अक्षर निर्धारित है। बालक के नाम का प्रथम अक्षर आदर्श रूप से उसके जन्म पाद के अक्षर से मेल खाना चाहिए। उदाहरणार्थ, अश्विनी पाद 1 &quot;चु&quot; देता है, पाद 2 &quot;चे&quot;, पाद 3 &quot;चो&quot;, पाद 4 &quot;ला&quot;। अश्विनी पाद 2 में जन्मे शिशु का नाम &quot;चेतन&quot; या &quot;चेतना&quot; रखा जा सकता है। यह प्रथा बालक की पहचान को जन्म के समय उपस्थित ब्रह्माण्डीय कम्पन से जोड़ती है।</> : <>A cherished tradition in Hindu families is naming the baby based on the birth nakshatra and pada (quarter). Each of the 108 padas (27 nakshatras x 4 padas) is assigned a specific syllable. The first syllable of the child&apos;s name should ideally match the syllable of their birth pada. For example, Ashwini pada 1 gives &quot;Chu&quot;, pada 2 gives &quot;Che&quot;, pada 3 gives &quot;Cho&quot;, pada 4 gives &quot;La&quot;. A baby born with Moon in Ashwini pada 2 might be named &quot;Chetan&quot; or &quot;Chetana.&quot; This practice connects the child&apos;s identity to the cosmic vibration present at their birth.</>}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'दैनिक पंचांग में चन्द्र नक्षत्र' : "Moon's Nakshatra in the Daily Panchang"}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'नक्षत्र पंचांग के पाँच मूल अंगों (पञ्चांग) में से एक है, तिथि, योग, करण और वार के साथ। दैनिक पंचांग सूर्योदय पर चन्द्र नक्षत्र और अगले नक्षत्र में संक्रमण का सटीक समय सूचित करता है। चूँकि चन्द्रमा लगभग 24 घण्टों में एक नक्षत्र पार करता है, प्रतिदिन सामान्यतः एक नक्षत्र संक्रमण होता है, यद्यपि कभी-कभी चन्द्रमा एक सूर्योदय से दूसरे सूर्योदय के बीच दो नक्षत्र पार कर सकता है (क्षय नक्षत्र) या तीन सूर्योदयों तक एक ही नक्षत्र में रह सकता है।'
            : 'Nakshatra is one of the five core limbs (pancha anga) of the Panchang, alongside Tithi, Yoga, Karana, and Vara (weekday). The daily Panchang lists the Moon&apos;s nakshatra at sunrise and the exact time it transitions to the next nakshatra. Since the Moon traverses one nakshatra in roughly 24 hours, there is typically one nakshatra transition per day, though occasionally the Moon may transit through two nakshatras within a single sunrise-to-sunrise period (creating a Kshaya nakshatra) or remain in the same nakshatra across three sunrises.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">गणना:</span> चन्द्रमा का निरयन भोगांश = 47.8°। नक्षत्र संख्या = floor(47.8 / 13.333) + 1 = floor(3.585) + 1 = 3 + 1 = 4। चौथा नक्षत्र रोहिणी है (40° से 53°20&apos; तक)। रोहिणी में स्थिति = 47.8° - 40° = 7.8°। पाद = floor(7.8 / 3.333) + 1 = floor(2.34) + 1 = 2 + 1 = 3। अतः चन्द्रमा रोहिणी पाद 3 में है।</> : <><span className="text-gold-light font-medium">Calculation:</span> Moon&apos;s sidereal longitude = 47.8°. Nakshatra number = floor(47.8 / 13.333) + 1 = floor(3.585) + 1 = 3 + 1 = 4. The 4th nakshatra is Rohini (spanning 40° to 53°20&apos;). Position within Rohini = 47.8° - 40° = 7.8°. Pada = floor(7.8 / 3.333) + 1 = floor(2.34) + 1 = 2 + 1 = 3. So the Moon is in Rohini pada 3.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;आपका नक्षत्र आपकी सूर्य राशि के तारामण्डल के समान है।&quot; आपका जन्म नक्षत्र चन्द्रमा की निरयन स्थिति से निर्धारित होता है, सूर्य की नहीं। वृषभ राशि में सूर्य वाले व्यक्ति का चन्द्रमा 27 में से किसी भी नक्षत्र में हो सकता है। नक्षत्र पद्धति और राशि पद्धति पूरक किन्तु भिन्न हैं — नक्षत्र चान्द्र व्यक्तित्व और दशा समय देते हैं, जबकि राशियाँ व्यापक सौर-चिह्न विशेषताओं का वर्णन करती हैं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Your nakshatra is the same as your Sun sign constellation.&quot; Your birth nakshatra is determined by the Moon&apos;s sidereal position, not the Sun&apos;s. A person with Sun in Taurus may have Moon in any of the 27 nakshatras. The nakshatra system and the rashi system are complementary but distinct — nakshatras give lunar personality and dasha timing, while rashis describe broader solar-sign characteristics.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'नक्षत्र पाद अक्षरों पर आधारित शिशु नामकरण शहरी, शिक्षित परिवारों में भी सर्वाधिक पालन की जाने वाली ज्योतिषीय परम्पराओं में से एक है। जन्म के कुछ ही घण्टों में अस्पताल के ज्योतिषी या पारिवारिक ज्योतिषी से सम्पर्क किया जाता है ताकि सटीक जन्म नक्षत्र और पाद निर्धारित हो, जिससे नामकरण अक्षर प्राप्त होता है। हमारा शिशु नाम उपकरण उसी पाद-से-अक्षर मानचित्रण का उपयोग करके बालक के गणित जन्म नक्षत्र के आधार पर सांस्कृतिक रूप से उपयुक्त नाम सुझाता है।'
            : 'Baby naming based on nakshatra pada syllables remains one of the most widely followed astrological traditions even among urbanized, educated families. Hospital astrologers or family jyotishis are consulted within hours of birth to determine the exact birth nakshatra and pada, from which the naming syllable is derived. Our Baby Names tool uses the same pada-to-syllable mapping to suggest culturally appropriate names based on the child&apos;s computed birth nakshatra.'}
        </p>
      </section>
    </div>
  );
}

export default function Module6_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

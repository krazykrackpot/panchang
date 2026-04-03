'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_0_4', phase: 0, topic: 'Foundations', moduleNumber: '0.4',
  title: { en: 'Reading Today\'s Panchang — A Practical Walkthrough', hi: 'आज का पंचांग पढ़ना — एक व्यावहारिक मार्गदर्शिका' },
  subtitle: {
    en: 'Open the Panchang page and learn what every element means in plain language',
    hi: 'पंचांग पृष्ठ खोलें और हर तत्त्व का अर्थ सरल भाषा में समझें',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 0-5: What is a Kundali?', hi: 'मॉड्यूल 0-5: कुण्डली क्या है?' }, href: '/learn/modules/0-5' },
    { label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' }, href: '/panchang' },
    { label: { en: 'Module 5-1: Tithi Deep Dive', hi: 'मॉड्यूल 5-1: तिथि विस्तार' }, href: '/learn/modules/5-1' },
    { label: { en: 'Module 7-1: Yoga System', hi: 'मॉड्यूल 7-1: योग पद्धति' }, href: '/learn/modules/7-1' },
    { label: { en: 'Module 8-1: Karana System', hi: 'मॉड्यूल 8-1: करण पद्धति' }, href: '/learn/modules/8-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q0_4_01', type: 'mcq',
    question: {
      en: 'How many tithis are there in a complete lunar month?',
      hi: 'एक पूर्ण चान्द्र मास में कितनी तिथियाँ होती हैं?',
    },
    options: [
      { en: '15', hi: '15' },
      { en: '27', hi: '27' },
      { en: '30', hi: '30' },
      { en: '12', hi: '12' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '30 tithis: 15 in Shukla Paksha (waxing) from Pratipada to Purnima, and 15 in Krishna Paksha (waning) from Pratipada to Amavasya. Each tithi spans 12° of Moon-Sun elongation.',
      hi: '30 तिथियाँ: शुक्ल पक्ष (बढ़ता चन्द्रमा) में प्रतिपदा से पूर्णिमा तक 15, और कृष्ण पक्ष (घटता चन्द्रमा) में प्रतिपदा से अमावस्या तक 15। प्रत्येक तिथि चन्द्र-सूर्य कोण के 12° में फैली है।',
    },
  },
  {
    id: 'q0_4_02', type: 'true_false',
    question: {
      en: 'The 7-day week order (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) was invented independently in both India and Babylon using the same planetary hora system.',
      hi: '7-दिवसीय सप्ताह का क्रम (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) भारत और बेबीलोन दोनों में एक ही ग्रह होरा पद्धति से स्वतन्त्र रूप से आविष्कृत हुआ।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The weekday order emerges naturally from the planetary hora system: assign each hour to a planet in the Chaldean order (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon), and every 24th hour gives the ruler of the next day — yielding the familiar Sun→Moon→Mars sequence.',
      hi: 'सत्य। सप्ताह का क्रम ग्रह होरा पद्धति से स्वाभाविक रूप से निकलता है: प्रत्येक होरा को कल्डियन क्रम (शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र) में एक ग्रह दें, और प्रत्येक 24वीं होरा अगले दिन का स्वामी देती है — जिससे सूर्य→चन्द्र→मंगल का परिचित क्रम बनता है।',
    },
  },
  {
    id: 'q0_4_03', type: 'mcq',
    question: {
      en: 'What does "Shukla Paksha" mean?',
      hi: '"शुक्ल पक्ष" का क्या अर्थ है?',
    },
    options: [
      { en: 'The waning (dark) fortnight', hi: 'घटता (अँधेरा) पखवाड़ा' },
      { en: 'The waxing (bright) fortnight', hi: 'बढ़ता (उज्ज्वल) पखवाड़ा' },
      { en: 'The eclipse period', hi: 'ग्रहण काल' },
      { en: 'The full moon day', hi: 'पूर्णिमा का दिन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shukla means "bright" or "white." Shukla Paksha is the waxing fortnight when the Moon grows from new to full. Krishna Paksha is the waning (dark) fortnight.',
      hi: 'शुक्ल का अर्थ है "उज्ज्वल" या "श्वेत।" शुक्ल पक्ष बढ़ता पखवाड़ा है जब चन्द्रमा अमावस्या से पूर्णिमा तक बढ़ता है। कृष्ण पक्ष घटता (अँधेरा) पखवाड़ा है।',
    },
  },
  {
    id: 'q0_4_04', type: 'mcq',
    question: {
      en: 'How many nakshatras does the Moon visit in approximately 27 days?',
      hi: 'चन्द्रमा लगभग 27 दिनों में कितने नक्षत्रों से होकर गुजरता है?',
    },
    options: [
      { en: '12', hi: '12' },
      { en: '27', hi: '27' },
      { en: '30', hi: '30' },
      { en: '9', hi: '9' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon visits all 27 nakshatras in one sidereal month (~27.3 days), spending roughly one day in each. This is why nakshatras are called "lunar mansions."',
      hi: 'चन्द्रमा एक नाक्षत्र मास (~27.3 दिन) में सभी 27 नक्षत्रों से होकर गुजरता है, प्रत्येक में लगभग एक दिन रहता है। इसीलिए नक्षत्रों को "चन्द्र भवन" कहते हैं।',
    },
  },
  {
    id: 'q0_4_05', type: 'mcq',
    question: {
      en: 'In the Panchang, "Yoga" refers to:',
      hi: 'पंचांग में "योग" का अर्थ है:',
    },
    options: [
      { en: 'Physical stretching exercises', hi: 'शारीरिक खिंचाव व्यायाम' },
      { en: 'The combined longitude of Sun + Moon divided into 27 segments', hi: 'सूर्य + चन्द्र का संयुक्त देशान्तर 27 खण्डों में विभक्त' },
      { en: 'A type of meditation', hi: 'एक प्रकार का ध्यान' },
      { en: 'The Moon\'s distance from Earth', hi: 'चन्द्रमा की पृथ्वी से दूरी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Panchang Yoga is calculated by adding the sidereal longitudes of Sun and Moon, then dividing by 13°20\' to get one of 27 yogas. The word "yuj" means combination — not the physical practice.',
      hi: 'पंचांग योग की गणना सूर्य और चन्द्रमा के निरयन देशान्तरों को जोड़कर, फिर 13°20\' से विभाजित कर 27 योगों में से एक प्राप्त करने से होती है। "युज" शब्द का अर्थ संयोग है — शारीरिक अभ्यास नहीं।',
    },
  },
  {
    id: 'q0_4_06', type: 'true_false',
    question: {
      en: 'Varahamihira\'s Brihat Samhita (6th century CE) used Panchang elements to predict monsoon timing and crop yields.',
      hi: 'वराहमिहिर की बृहत्संहिता (छठी शताब्दी ई.) ने पंचांग तत्त्वों का उपयोग मानसून समय और फसल उपज की भविष्यवाणी के लिए किया।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Varahamihira devoted several chapters to weather prediction using lunar phases, nakshatras, and planetary positions. Modern studies have found statistical correlations between lunar phases and Indian rainfall patterns.',
      hi: 'सत्य। वराहमिहिर ने चन्द्र कलाओं, नक्षत्रों और ग्रह स्थितियों का उपयोग करते हुए मौसम पूर्वानुमान पर कई अध्याय समर्पित किए। आधुनिक अध्ययनों ने चन्द्र कलाओं और भारतीय वर्षा प्रतिरूपों के बीच सांख्यिकीय सहसम्बन्ध पाया है।',
    },
  },
  {
    id: 'q0_4_07', type: 'mcq',
    question: {
      en: 'What is Vishti (Bhadra) Karana known for?',
      hi: 'विष्टि (भद्रा) करण किसलिए जाना जाता है?',
    },
    options: [
      { en: 'Most auspicious for starting new ventures', hi: 'नए कार्य आरम्भ करने के लिए सर्वाधिक शुभ' },
      { en: 'Best for marriages', hi: 'विवाह के लिए सर्वोत्तम' },
      { en: 'Inauspicious — avoid new beginnings', hi: 'अशुभ — नए कार्य टालें' },
      { en: 'Ideal for travel', hi: 'यात्रा के लिए आदर्श' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vishti (Bhadra) Karana is considered inauspicious. Traditional Panchang advice is to avoid starting important new activities during this half-tithi period.',
      hi: 'विष्टि (भद्रा) करण अशुभ माना जाता है। पारम्परिक पंचांग में इस अर्ध-तिथि काल में महत्त्वपूर्ण नए कार्य न आरम्भ करने की सलाह दी जाती है।',
    },
  },
  {
    id: 'q0_4_08', type: 'mcq',
    question: {
      en: 'Rahu Kaal is approximately how long each day?',
      hi: 'राहु काल प्रतिदिन लगभग कितना लम्बा होता है?',
    },
    options: [
      { en: 'About 30 minutes', hi: 'लगभग 30 मिनट' },
      { en: 'About 1.5 hours', hi: 'लगभग 1.5 घण्टे' },
      { en: 'About 3 hours', hi: 'लगभग 3 घण्टे' },
      { en: 'About 6 hours', hi: 'लगभग 6 घण्टे' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rahu Kaal is approximately 1.5 hours (one-eighth of the daytime period). It falls at a different time each weekday and is calculated based on sunrise and sunset for your location.',
      hi: 'राहु काल लगभग 1.5 घण्टे (दिन की अवधि का आठवाँ भाग) का होता है। यह प्रत्येक वार को अलग समय पर आता है और आपके स्थान के सूर्योदय-सूर्यास्त के आधार पर गणित होता है।',
    },
  },
  {
    id: 'q0_4_09', type: 'true_false',
    question: {
      en: 'Abhijit Muhurta, which falls around midday, is considered universally auspicious.',
      hi: 'अभिजित मुहूर्त, जो मध्याह्न के आसपास आता है, सार्वभौमिक रूप से शुभ माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Abhijit Muhurta is the 8th muhurta of the day, centered around local noon. It is ruled by Vishnu and considered auspicious for virtually all activities, regardless of other Panchang factors.',
      hi: 'सत्य। अभिजित मुहूर्त दिन का 8वाँ मुहूर्त है, स्थानीय मध्याह्न के आसपास केन्द्रित। यह विष्णु शासित है और अन्य पंचांग तत्त्वों की परवाह किए बिना लगभग सभी कार्यों के लिए शुभ माना जाता है।',
    },
  },
  {
    id: 'q0_4_10', type: 'mcq',
    question: {
      en: 'Each muhurta (time division) of the day is approximately how long?',
      hi: 'दिन का प्रत्येक मुहूर्त (समय विभाजन) लगभग कितना लम्बा होता है?',
    },
    options: [
      { en: 'About 24 minutes', hi: 'लगभग 24 मिनट' },
      { en: 'About 48 minutes', hi: 'लगभग 48 मिनट' },
      { en: 'About 90 minutes', hi: 'लगभग 90 मिनट' },
      { en: 'About 2 hours', hi: 'लगभग 2 घण्टे' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A day is divided into 30 muhurtas, each approximately 48 minutes long (24 hours / 30 = 48 minutes). 15 muhurtas fall in the daytime and 15 at night.',
      hi: 'एक दिन 30 मुहूर्तों में विभक्त है, प्रत्येक लगभग 48 मिनट (24 घण्टे / 30 = 48 मिनट)। 15 मुहूर्त दिन में और 15 रात में आते हैं।',
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
          {isHi ? 'पंचांग खोलें — पहले दो तत्त्व' : 'Open the Panchang — The First Two Elements'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हमारे ऐप पर पंचांग पृष्ठ खोलें। आप पाँच मूल तत्त्व देखेंगे — इसीलिए इसे "पंच-अंग" (पाँच अंग) कहते हैं। आइए पहले दो से शुरू करें।'
            : 'Open the Panchang page on our app. You\'ll see five core elements — that\'s why it\'s called "Panch-Anga" (five limbs). Let\'s start with the first two.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '1. तिथि — "चन्द्रमा किस कला में है?"' : '1. Tithi — "What Moon phase are we in?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'पश्चिमी कैलेंडर में चन्द्रमा की केवल 4 कलाएँ हैं (नया, पहली तिमाही, पूर्ण, अन्तिम तिमाही)। वैदिक पद्धति में 30 कलाएँ हैं! चन्द्र-सूर्य पृथक्करण के प्रत्येक 12° = 1 तिथि। शुक्ल पक्ष = बढ़ता चन्द्रमा (चन्द्रमा बड़ा हो रहा), कृष्ण पक्ष = घटता चन्द्रमा (चन्द्रमा छोटा हो रहा)। पूर्णिमा = पूर्ण चन्द्र, अमावस्या = नया चन्द्र।'
            : 'Western calendars have just 4 Moon phases (new, first quarter, full, last quarter). The Vedic system has 30! Every 12° of Moon-Sun separation = 1 tithi. Shukla Paksha = waxing (Moon growing), Krishna Paksha = waning (Moon shrinking). Purnima = full moon, Amavasya = new moon.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'क्यों 12°? क्योंकि चन्द्रमा सूर्य से प्रतिदिन लगभग 12° आगे बढ़ता है (चन्द्रमा ~13.2°/दिन - सूर्य ~1°/दिन ≈ 12°/दिन)। इसलिए लगभग प्रतिदिन एक नई तिथि — यह गणित है, रहस्यवाद नहीं।'
            : 'Why 12°? Because the Moon gains about 12° on the Sun each day (Moon ~13.2°/day - Sun ~1°/day ≈ 12°/day). So roughly one new tithi per day — it\'s mathematics, not mysticism.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '2. वार — "आज कौन-सा दिन है?"' : '2. Vara — "What day is it?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक दिन एक ग्रह द्वारा शासित है। रविवार = सूर्य (Ravi), सोमवार = चन्द्र (Soma), मंगलवार = मंगल (Mangala), बुधवार = बुध (Budha), गुरुवार = गुरु (Guru/Brihaspati), शुक्रवार = शुक्र (Shukra), शनिवार = शनि (Shani)। अंग्रेजी नाम उन्हीं ग्रहों से आते हैं! Sun-day, Moon-day, आदि।'
            : 'Each day is ruled by a planet. Ravivara = Sunday/Sun, Somavara = Monday/Moon, Mangalavara = Tuesday/Mars, Budhavara = Wednesday/Mercury, Guruvara = Thursday/Jupiter, Shukravara = Friday/Venus, Shanivara = Saturday/Saturn. The English names come from the same planets! Sun-day, Moon-day, etc.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-amber-400/20 bg-gradient-to-br from-amber-900/10 to-transparent">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? '7-दिवसीय सप्ताह भारत और बेबीलोन दोनों में एक ही ग्रह होरा पद्धति का उपयोग करके स्वतन्त्र रूप से आविष्कृत हुआ। क्रम सूर्य→चन्द्र→मंगल→बुध→गुरु→शुक्र→शनि प्रत्येक 24वीं होरा (ग्रह घण्टे) की गणना से आता है — शुद्ध गणित, संयोग नहीं। कल्डियन क्रम (शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र) में होराएँ निर्धारित करें, और प्रत्येक 24वीं होरा अगले दिन का स्वामी देती है।'
            : 'The 7-day week was invented independently in India and Babylon using the SAME planetary hora system. The order Sun\u2192Moon\u2192Mars\u2192Mercury\u2192Jupiter\u2192Venus\u2192Saturn comes from counting every 24th hora (planetary hour) \u2014 pure mathematics, not coincidence. Assign horas in the Chaldean order (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon), and every 24th hora gives the ruler of the next day.'}
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
          {isHi ? 'शेष तीन पंचांग तत्त्व' : 'The Remaining Three Panchang Elements'}
        </h3>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '3. नक्षत्र — "चन्द्रमा किस तारा-समूह में है?"' : '3. Nakshatra — "Which star group is the Moon visiting?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'चन्द्रमा ~27 दिनों में सभी 27 नक्षत्रों से होकर गुजरता है — प्रत्येक में लगभग एक दिन। प्रत्येक नक्षत्र का एक स्वभाव है (सौम्य, उग्र, स्थिर, चर) जो उस दिन की ऊर्जा को रंग देता है। उदाहरणार्थ, पुष्य (सबसे शुभ नक्षत्रों में से एक) सौम्य है — नए कार्य आरम्भ करने के लिए उत्तम। आर्द्रा तीक्ष्ण है — शल्य चिकित्सा या कठोर कार्यों के लिए बेहतर।'
            : 'The Moon visits all 27 nakshatras in ~27 days, spending roughly one day in each. Each nakshatra has a nature (gentle, fierce, fixed, movable) that colors the day\'s energy. For example, Pushya (one of the most auspicious nakshatras) is gentle \u2014 great for starting ventures. Ardra is sharp \u2014 better for surgery or tough tasks.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '4. योग — "सूर्य + चन्द्र का संयुक्त मिजाज़ क्या है?"' : '4. Yoga — "What\'s the combined Sun+Moon mood?"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'सूर्य का देशान्तर + चन्द्रमा का देशान्तर, 27 खण्डों में विभक्त। यह वह योग नहीं जो आसन (स्ट्रेचिंग) है — यह "युज" = संयोग है। 27 योगों में से प्रत्येक का एक नाम और स्वभाव है। विष्कम्भ (प्रथम) से वैधृति (अन्तिम) तक, कुछ शुभ हैं (सिद्धि, शिव, सौभाग्य) और कुछ अशुभ (व्यतीपात, वैधृति)।'
            : 'Sun longitude + Moon longitude, divided into 27 segments. Not the stretching kind of yoga \u2014 this is "yuj" = combination. Each of the 27 yogas has a name and nature. From Vishkambha (first) to Vaidhriti (last), some are auspicious (Siddhi, Shiva, Saubhagya) and some inauspicious (Vyatipata, Vaidhriti).'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '5. करण — "अर्ध-तिथि"' : '5. Karana — "Half a tithi"'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? '11 प्रकार के करण चन्द्र मास में चक्रित होते हैं। प्रत्येक तिथि में 2 करण होते हैं (प्रत्येक 6° का)। सबसे महत्त्वपूर्ण बात: विष्टि (भद्रा) करण = नई शुरुआत से बचें। यह प्रत्येक अष्टमी और एकादशी में नियमित रूप से आता है।'
            : '11 types of karanas cycle through the lunar month. Each tithi has 2 karanas (each spanning 6\u00B0). The most important thing to know: Vishti (Bhadra) karana = avoid new beginnings. It recurs regularly in every Ashtami and Ekadashi.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-amber-400/20 bg-gradient-to-br from-amber-900/10 to-transparent">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'वराहमिहिर की बृहत्संहिता (छठी शताब्दी ई.) ने पंचांग तत्त्वों का उपयोग मानसून समय, फसल उपज और भूकम्पों की भविष्यवाणी के लिए किया। आधुनिक मौसमविज्ञानियों ने चन्द्र कलाओं और भारत में वर्षा प्रतिरूपों के बीच सांख्यिकीय सहसम्बन्ध पाया है — जो वराहमिहिर ने 1500 वर्ष पहले प्रेक्षित किया था, उसे प्रमाणित करता है।'
            : 'Varahamihira\'s Brihat Samhita (6th century CE) used Panchang elements to predict monsoon timing, crop yields, and even earthquakes. Modern meteorologists have found statistical correlations between lunar phases and rainfall patterns in India \u2014 validating what Varahamihira observed 1500 years ago.'}
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
          {isHi ? 'व्यावहारिक भाग — समय की जानकारी' : 'The Practical Parts — Timing Information'}
        </h3>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सूर्योदय / सूर्यास्त' : 'Sunrise / Sunset'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'आपके स्थान के लिए गणित — सामान्य नहीं। वैदिक दिवस सूर्योदय से आरम्भ होता है (मध्यरात्रि से नहीं), इसलिए सूर्योदय का समय पंचांग का आधार है। हमारा ऐप आपके शहर के अक्षांश-देशान्तर का उपयोग करके सटीक सूर्योदय/सूर्यास्त गणित करता है।'
            : 'Calculated for YOUR location \u2014 not generic. The Vedic day begins at sunrise (not midnight), so sunrise time is the foundation of the Panchang. Our app uses your city\'s latitude and longitude to compute precise sunrise/sunset times.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'राहु काल' : 'Rahu Kaal'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रतिदिन ~1.5 घण्टे की अशुभ अवधि। प्रत्येक वार को अलग समय पर आती है। बहुत से भारतीय इस समय महत्त्वपूर्ण कार्य आरम्भ करने से बचते हैं — नया व्यापार, अनुबन्ध पर हस्ताक्षर, यात्रा प्रारम्भ। दिन की अवधि (सूर्योदय से सूर्यास्त) को 8 भागों में बाँटकर गणित होता है।'
            : 'A ~1.5 hour inauspicious window each day. Falls at a different time each weekday. Many Indians avoid starting important tasks during this time \u2014 new business, signing contracts, beginning travel. Calculated by dividing daylight hours (sunrise to sunset) into 8 equal parts.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'चौघड़िया और मुहूर्त' : 'Choghadiya & Muhurta'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'चौघड़िया: प्रत्येक अर्ध-दिवस में 8 समय-खण्ड, प्रत्येक एक भिन्न गुण से शासित (अमृत = सर्वोत्तम, काल = सबसे खराब)। मुहूर्त: प्रतिदिन 30 समय विभाजन (प्रत्येक ~48 मिनट)। मध्याह्न के आसपास अभिजित मुहूर्त = सार्वभौमिक रूप से शुभ — विष्णु शासित, सभी कार्यों के लिए उत्तम।'
            : 'Choghadiya: 8 time slots per half-day, each ruled by a different quality (Amrit = best, Kaal = worst). Muhurta: 30 time divisions per day (each ~48 minutes). Abhijit Muhurta around noon = universally auspicious \u2014 ruled by Vishnu, good for all activities.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-amber-400/20 bg-gradient-to-br from-emerald-900/10 to-transparent">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'व्यावहारिक अभ्यास' : 'Practical Exercise'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हमारे ऐप पर आज का पंचांग देखें। ढूँढ़ें: (1) वर्तमान तिथि और उसका स्वभाव, (2) राहु काल कब है, (3) अगला अभिजित मुहूर्त। बस — आपने पंचांग पढ़ लिया!'
            : 'Look at today\'s Panchang on our app. Find: (1) the current tithi and its nature, (2) when Rahu Kaal is today, (3) the next Abhijit Muhurta window. That\'s it \u2014 you\'ve just read a Panchang!'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अगले मॉड्यूल में हम कुण्डली (जन्म कुण्डली) को समझेंगे — आपके जन्म क्षण का आकाशीय मानचित्र।'
            : 'In the next module, we\'ll understand the Kundali (birth chart) \u2014 the celestial map of the moment you were born.'}
        </p>
      </section>
    </div>
  );
}

export default function Module0_4() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}

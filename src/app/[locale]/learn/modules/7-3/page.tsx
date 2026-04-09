'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_7_3', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.3',
  title: { en: 'Vara — The Weekday', hi: 'वार — सप्ताह का दिन' },
  subtitle: {
    en: 'Seven weekdays ruled by seven grahas, their sequence explained by the Hora system, and their role in Panchang muhurta selection',
    hi: 'सात ग्रहों द्वारा शासित सात वार, होरा प्रणाली से उनका क्रम, और पंचांग मुहूर्त चयन में उनकी भूमिका',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 7-1: Yoga', hi: 'मॉड्यूल 7-1: योग' }, href: '/learn/modules/7-1' },
    { label: { en: 'Module 7-2: Karana', hi: 'मॉड्यूल 7-2: करण' }, href: '/learn/modules/7-2' },
    { label: { en: 'Vara Deep Dive', hi: 'वार विस्तार' }, href: '/learn/vara' },
    { label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' }, href: '/panchang' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q7_3_01', type: 'mcq',
    question: {
      en: 'The Chaldean order of planets (by decreasing orbital period) is Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. Why does the weekday sequence skip two planets each time?',
      hi: 'कैल्डियन ग्रह क्रम (घटती कक्षीय अवधि) शनि, बृहस्पति, मंगल, सूर्य, शुक्र, बुध, चन्द्र है। वार क्रम में प्रत्येक बार दो ग्रह क्यों छोड़े जाते हैं?',
    },
    options: [
      { en: 'It is arbitrary with no mathematical basis', hi: 'यह यादृच्छिक है, कोई गणितीय आधार नहीं' },
      { en: 'Because 24 hours mod 7 = 3, each day\'s ruler is 3 steps forward in the Chaldean sequence', hi: 'क्योंकि 24 घण्टे mod 7 = 3, प्रत्येक दिन का स्वामी कैल्डियन क्रम में 3 स्थान आगे होता है' },
      { en: 'The planets are ordered by brightness', hi: 'ग्रह चमक के अनुसार क्रमित हैं' },
      { en: 'It follows the zodiac sign order', hi: 'यह राशि क्रम का अनुसरण करता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each day has 24 horas, each ruled by the next planet in Chaldean order. After 24 horas (24 mod 7 = 3), the ruler of the first hora of the next day is 3 positions ahead. This produces the weekday sequence: Sun (Ravi) → Moon (Soma) → Mars (Mangal) → Mercury (Budha) → Jupiter (Guru) → Venus (Shukra) → Saturn (Shani).',
      hi: 'प्रत्येक दिन में 24 होरा होती हैं, प्रत्येक कैल्डियन क्रम के अगले ग्रह द्वारा शासित। 24 होरा के बाद (24 mod 7 = 3), अगले दिन की प्रथम होरा का स्वामी 3 स्थान आगे होता है। इससे वार क्रम बनता है: रवि → सोम → मंगल → बुध → गुरु → शुक्र → शनि।',
    },
  },
  {
    id: 'q7_3_02', type: 'mcq',
    question: {
      en: 'What is the Sanskrit name for Wednesday?',
      hi: 'बुधवार का संस्कृत नाम क्या है?',
    },
    options: [
      { en: 'Mangalavara', hi: 'मंगलवार' },
      { en: 'Budhavara', hi: 'बुधवार' },
      { en: 'Guruvara', hi: 'गुरुवार' },
      { en: 'Shukravara', hi: 'शुक्रवार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The seven varas in Sanskrit are: Ravivara (Sunday/Sun), Somavara (Monday/Moon), Mangalavara (Tuesday/Mars), Budhavara (Wednesday/Mercury), Guruvara (Thursday/Jupiter), Shukravara (Friday/Venus), Shanivara (Saturday/Saturn).',
      hi: 'सात वारों के संस्कृत नाम: रविवार (सूर्य), सोमवार (चन्द्र), मंगलवार (मंगल), बुधवार (बुध), गुरुवार (बृहस्पति), शुक्रवार (शुक्र), शनिवार (शनि)।',
    },
  },
  {
    id: 'q7_3_03', type: 'true_false',
    question: {
      en: 'Tuesday (Mangalavara) and Saturday (Shanivara) are generally considered auspicious for initiating new ventures in Vedic tradition.',
      hi: 'मंगलवार और शनिवार वैदिक परम्परा में नये कार्यों के आरम्भ हेतु सामान्यतः शुभ माने जाते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Tuesday (Mars) and Saturday (Saturn) are generally considered inauspicious for starting new ventures, as Mars and Saturn are natural malefics. These days are better suited for activities requiring courage, discipline, or overcoming obstacles. Thursday (Jupiter/Guru) is considered the most universally auspicious day.',
      hi: 'असत्य। मंगलवार (मंगल) और शनिवार (शनि) नये कार्यों के लिए सामान्यतः अशुभ माने जाते हैं, क्योंकि मंगल और शनि प्राकृतिक पापग्रह हैं। ये दिन साहस, अनुशासन या बाधा-निवारण वाले कार्यों के लिए उपयुक्त हैं। गुरुवार (बृहस्पति) सर्वाधिक शुभ वार माना जाता है।',
    },
  },
  {
    id: 'q7_3_04', type: 'mcq',
    question: {
      en: 'Which vara is considered the most universally auspicious in Vedic tradition?',
      hi: 'वैदिक परम्परा में कौन-सा वार सर्वाधिक शुभ माना जाता है?',
    },
    options: [
      { en: 'Ravivara (Sunday)', hi: 'रविवार' },
      { en: 'Somavara (Monday)', hi: 'सोमवार' },
      { en: 'Guruvara (Thursday)', hi: 'गुरुवार' },
      { en: 'Shukravara (Friday)', hi: 'शुक्रवार' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Thursday (Guruvara), ruled by Jupiter (Guru/Brihaspati), is considered the most universally auspicious day. Jupiter is the greatest benefic in Jyotish — the planet of wisdom, dharma, expansion, and good fortune. Thursday is preferred for initiating education, rituals, marriages, and business ventures.',
      hi: 'गुरुवार, बृहस्पति (गुरु) द्वारा शासित, सर्वाधिक शुभ दिन माना जाता है। बृहस्पति ज्योतिष में सबसे बड़ा शुभग्रह है — ज्ञान, धर्म, विस्तार और सौभाग्य का ग्रह। गुरुवार शिक्षा, अनुष्ठान, विवाह और व्यापार आरम्भ के लिए उत्तम है।',
    },
  },
  {
    id: 'q7_3_05', type: 'mcq',
    question: {
      en: 'The vara (weekday) from a Julian Day Number is computed as:',
      hi: 'जूलियन दिवस संख्या से वार की गणना इस प्रकार होती है:',
    },
    options: [
      { en: 'floor(JD) mod 12', hi: 'floor(JD) mod 12' },
      { en: 'floor(JD + 1.5) mod 7', hi: 'floor(JD + 1.5) mod 7' },
      { en: 'floor(JD) mod 30', hi: 'floor(JD) mod 30' },
      { en: 'floor(JD - 0.5) mod 7', hi: 'floor(JD - 0.5) mod 7' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The formula floor(JD + 1.5) mod 7 gives the day of the week, where 0 = Monday. This is the simplest of all Panchang computations — a single modular arithmetic operation on the Julian Day Number.',
      hi: 'सूत्र floor(JD + 1.5) mod 7 सप्ताह का दिन देता है, जहाँ 0 = सोमवार। यह सभी पंचांग गणनाओं में सबसे सरल है — जूलियन दिवस संख्या पर एक मॉड्यूलर अंकगणित संक्रिया।',
    },
  },
  {
    id: 'q7_3_06', type: 'true_false',
    question: {
      en: 'A "hora" is a one-hour planetary period, and each day contains exactly 24 horas cycling through the 7 planets in Chaldean order.',
      hi: '"होरा" एक घण्टे की ग्रहीय अवधि है, और प्रत्येक दिन में 7 ग्रहों के कैल्डियन क्रम में चक्रित 24 होरा होती हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Each day is divided into 24 horas of one hour each. The first hora of the day is ruled by the day\'s ruling planet (e.g., Sunday starts with Sun hora). Subsequent horas follow the Chaldean order: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon, repeating.',
      hi: 'सत्य। प्रत्येक दिन 24 होराओं में विभाजित होता है, प्रत्येक एक घण्टे की। दिन की प्रथम होरा उस दिन के स्वामी ग्रह की होती है (जैसे रविवार सूर्य होरा से आरम्भ)। आगे की होरा कैल्डियन क्रम: शनि → बृहस्पति → मंगल → सूर्य → शुक्र → बुध → चन्द्र का अनुसरण करती हैं।',
    },
  },
  {
    id: 'q7_3_07', type: 'mcq',
    question: {
      en: 'Sarvartha Siddhi Yoga is formed by specific combinations of:',
      hi: 'सर्वार्थ सिद्धि योग किन विशिष्ट संयोगों से बनता है?',
    },
    options: [
      { en: 'Vara and Nakshatra', hi: 'वार और नक्षत्र' },
      { en: 'Tithi and Karana only', hi: 'केवल तिथि और करण' },
      { en: 'Yoga and Graha only', hi: 'केवल योग और ग्रह' },
      { en: 'Rashi and Lagna only', hi: 'केवल राशि और लग्न' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Sarvartha Siddhi Yoga ("all-purpose success yoga") is formed when specific Vara-Nakshatra combinations align. For example, Sunday + Pushya, Monday + Hasta, Thursday + Anuradha. These combinations amplify auspiciousness beyond what either element provides alone.',
      hi: 'सर्वार्थ सिद्धि योग ("सर्व-उद्देश्यीय सफलता योग") विशिष्ट वार-नक्षत्र संयोगों से बनता है। उदाहरण: रविवार + पुष्य, सोमवार + हस्त, गुरुवार + अनुराधा। ये संयोग प्रत्येक तत्व की व्यक्तिगत शुभता से अधिक शुभता प्रदान करते हैं।',
    },
  },
  {
    id: 'q7_3_08', type: 'true_false',
    question: {
      en: 'Amrita Siddhi Yoga is formed by specific Vara + Tithi combinations.',
      hi: 'अमृत सिद्धि योग विशिष्ट वार + तिथि संयोगों से बनता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Amrita Siddhi Yoga ("nectar of success") is formed when certain Vara-Tithi combinations occur. For example, Sunday + Dvadashi, Monday + Ekadashi, Wednesday + Dashami. These are extremely auspicious windows that override many other negative factors.',
      hi: 'सत्य। अमृत सिद्धि योग ("सफलता का अमृत") विशिष्ट वार-तिथि संयोगों से बनता है। उदाहरण: रविवार + द्वादशी, सोमवार + एकादशी, बुधवार + दशमी। ये अत्यन्त शुभ खिड़कियाँ हैं जो अन्य अनेक नकारात्मक कारकों को निरस्त कर देती हैं।',
    },
  },
  {
    id: 'q7_3_09', type: 'mcq',
    question: {
      en: 'Among the common auspicious days for new beginnings, which set is considered most favourable?',
      hi: 'नये कार्यारम्भ के लिए शुभ दिनों में कौन-सा समूह सर्वाधिक अनुकूल माना जाता है?',
    },
    options: [
      { en: 'Tuesday, Saturday, Sunday', hi: 'मंगलवार, शनिवार, रविवार' },
      { en: 'Monday, Wednesday, Thursday, Friday', hi: 'सोमवार, बुधवार, गुरुवार, शुक्रवार' },
      { en: 'Only Sunday', hi: 'केवल रविवार' },
      { en: 'Only Saturday', hi: 'केवल शनिवार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Monday (Moon), Wednesday (Mercury), Thursday (Jupiter), and Friday (Venus) are generally considered auspicious for new beginnings. These are ruled by benefic or mild planets. Thursday is the best among them. Tuesday and Saturday are ruled by malefics (Mars, Saturn) and Sunday by the authoritative Sun.',
      hi: 'सोमवार (चन्द्र), बुधवार (बुध), गुरुवार (बृहस्पति), और शुक्रवार (शुक्र) नये कार्यारम्भ हेतु शुभ माने जाते हैं। इनके स्वामी शुभ या सौम्य ग्रह हैं। इनमें गुरुवार सर्वोत्तम है। मंगलवार और शनिवार पापग्रहों (मंगल, शनि) और रविवार सत्तात्मक सूर्य द्वारा शासित हैं।',
    },
  },
  {
    id: 'q7_3_10', type: 'true_false',
    question: {
      en: 'Vara is the most computationally complex of the five Panchang elements.',
      hi: 'वार पंचांग के पाँच अंगों में गणनात्मक रूप से सबसे जटिल है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Vara is by far the simplest Panchang element to compute. It requires only the formula floor(JD + 1.5) mod 7. Compare this with Tithi (requiring precise Moon and Sun longitudes), Nakshatra (precise Moon longitude), Yoga (Sun+Moon sum), and Karana (derived from elongation).',
      hi: 'असत्य। वार गणनात्मक रूप से सबसे सरल पंचांग तत्व है। इसके लिए केवल सूत्र floor(JD + 1.5) mod 7 आवश्यक है। इसकी तुलना तिथि (सटीक चन्द्र और सूर्य अंश), नक्षत्र (सटीक चन्द्र अंश), योग (सूर्य+चन्द्र योग), और करण (कोणीय दूरी से व्युत्पन्न) से करें।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vara — The Weekday and the Hora System</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The seven weekdays (varas) are the most familiar time-division in both Eastern and Western cultures, yet few people know why the days follow the order Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn rather than the orbital speed sequence. The answer lies in the Hora system — an ancient planetary-hour framework shared between Vedic and Hellenistic astronomy.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Chaldean order ranks the seven classical planets by decreasing orbital period: Saturn (slowest), Jupiter, Mars, Sun, Venus, Mercury, Moon (fastest). Each of the 24 hours of a day is assigned to the next planet in this Chaldean sequence. The ruler of the first hora becomes the ruler of the entire day. After 24 horas, we have cycled through 3 complete rounds of 7 (= 21) plus 3 extra steps — so the next day&apos;s ruler is 3 positions forward in the Chaldean order. Starting from Saturn: skip 3 forward gives Sun; from Sun skip 3 gives Moon; from Moon skip 3 gives Mars — producing the familiar weekday order.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The Sanskrit names directly reflect planetary rulership: Ravivara (Ravi = Sun), Somavara (Soma = Moon), Mangalavara (Mangal = Mars), Budhavara (Budha = Mercury), Guruvara (Guru = Jupiter), Shukravara (Shukra = Venus), Shanivara (Shani = Saturn). Every European language encodes the same planetary assignments (e.g., Saturday = Saturn&apos;s day, Sunday = Sun&apos;s day).</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The Hora system is described in Varahamihira&apos;s Brihat Jataka (6th century CE) and in the Surya Siddhanta. The word &quot;hora&quot; itself derives from the Greek &quot;hora&quot; (hour), pointing to the shared Greco-Indian astronomical heritage. BPHS discusses vara as one of the five essential Panchang limbs. The Muhurta Chintamani provides extensive tables of Vara-Nakshatra and Vara-Tithi combinations that create special yogas like Sarvartha Siddhi and Amrita Siddhi.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Auspiciousness by Vara and Planetary Hora</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each vara carries the energy of its ruling planet. Thursday (Guruvara), ruled by Jupiter, is considered the most universally auspicious — suited for education, marriage, religious ceremonies, and business initiation. Monday (Somavara, Moon) is good for domestic affairs, travel, and meeting people. Wednesday (Budhavara, Mercury) favours communication, learning, and trade. Friday (Shukravara, Venus) is ideal for arts, romance, and luxury purchases.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Tuesday (Mangalavara, Mars) and Saturday (Shanivara, Saturn) are generally avoided for new beginnings because Mars and Saturn are natural malefics. However, they are powerful for activities aligned with their energy: Tuesday suits courage-demanding actions, surgery, and property disputes; Saturday suits discipline, penance, removal of obstacles, and Shani-related remedies. Sunday (Ravivara, Sun) carries authority energy — good for government matters and leadership roles but considered too fierce for gentle ceremonies.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Beyond the day-level vara, each hour within the day has its own hora ruler. The 24 horas cycle through the Chaldean sequence starting from the day&apos;s ruler. For fine-grained muhurta selection, practitioners check both the vara and the prevailing hora. A Jupiter hora on a Thursday is doubly auspicious; a Saturn hora on a Saturday intensifies Shani energy for better or worse.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1 (Vara from JD):</span> JD = 2460400.5 (a specific date). floor(2460400.5 + 1.5) mod 7 = floor(2460402) mod 7 = 2460402 mod 7 = 0 (Monday). So this date is Somavara — a good day for travel and domestic matters.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2 (Sarvartha Siddhi):</span> Date: Thursday, Nakshatra: Anuradha. Muhurta Chintamani lists Thursday + Anuradha as a Sarvartha Siddhi Yoga combination. This window is auspicious for virtually all activities — an &quot;all-purpose success&quot; window.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3 (Hora selection):</span> It is Wednesday, and you need to sign a contract at 3 PM. Wednesday starts with Mercury hora at sunrise (~6 AM). Counting 9 horas forward (9 hours later = 3 PM) through the Chaldean sequence: Mercury → Moon → Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon. The 10th hour (3 PM) is Moon hora — favourable for agreements involving public-facing matters.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vara Combinations, Computation, and Modern Use</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The true power of Vara emerges when combined with other Panchang elements. Two important compound yogas arise from Vara combinations. Sarvartha Siddhi Yoga is formed when specific Vara + Nakshatra pairs align — for example, Sunday + Pushya, Monday + Hasta, Tuesday + Ashwini, Wednesday + Anuradha, Thursday + Revati, Friday + Anuradha, Saturday + Pushya. These create universally auspicious windows.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Amrita Siddhi Yoga is formed by specific Vara + Tithi combinations — for instance, Sunday + Dvadashi, Monday + Ekadashi, Wednesday + Dashami. Amrita means &quot;nectar&quot; — these windows are considered potent enough to neutralize many other negative factors in the Panchang.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Computing the vara is trivially simple: floor(JD + 1.5) mod 7, where 0 = Monday, 1 = Tuesday, and so on. This makes vara the easiest of the five Panchang elements to compute — no planetary position calculations needed, just modular arithmetic on the Julian Day Number. Despite its computational simplicity, vara carries significant weight in muhurta decisions and is never omitted from any Panchang listing.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Tuesday and Saturday are always bad.&quot; These days are inauspicious for gentle beginnings, but they are powerful for Mars-type and Saturn-type activities respectively. Surgery on Tuesday, discipline on Saturday — matching the day&apos;s energy to the action&apos;s nature is the correct approach.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Vara alone determines whether a day is good or bad.&quot; Vara is just one of five Panchang limbs. A Thursday with Vyatipata yoga and Vishti karana is not automatically auspicious. The five elements must be evaluated together.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;The weekday order is arbitrary or culturally imposed.&quot; The sequence follows rigorously from the Hora system: 24 mod 7 = 3, producing the skip-two pattern in the Chaldean sequence. This mathematical derivation is shared across civilizations.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Vara is universally present in every Panchang, calendar, and almanac. In our app, the vara is displayed prominently on the daily Panchang page, and the Muhurta AI engine uses Vara-Nakshatra and Vara-Tithi lookup tables to detect Sarvartha Siddhi and Amrita Siddhi windows. The planetary hora calculator provides hour-by-hour planetary rulership for any given day. Even people who do not follow Jyotish actively tend to respect vara traditions — avoiding travel on Tuesday, worshipping Shani on Saturday, and fasting on Thursday (for Jupiter blessings).</p>
      </section>
    </div>
  );
}

export default function Module7_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

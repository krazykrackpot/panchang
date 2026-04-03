'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_4_1', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.1',
  title: { en: 'Precession & Ayanamsha — Where Tropical Meets Sidereal', hi: 'अयनांश एवं पुरस्सरण — जहाँ सायन और निरयन मिलते हैं' },
  subtitle: {
    en: 'Every 72 years your zodiac shifts by 1 degree. The physics, history, and great debate behind the ayanamsha.',
    hi: 'प्रत्येक 72 वर्ष में आपकी राशि 1 अंश खिसकती है। अयनांश के पीछे का भौतिकशास्त्र, इतिहास और महान वाद-विवाद।',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 4-2: Tropical vs Sidereal Zodiac', hi: 'मॉड्यूल 4-2: सायन बनाम निरयन राशिचक्र' }, href: '/learn/modules/4-2' },
    { label: { en: 'Module 4-3: Coordinate Systems', hi: 'मॉड्यूल 4-3: निर्देशांक पद्धतियाँ' }, href: '/learn/modules/4-3' },
    { label: { en: 'Ayanamsha Deep Dive', hi: 'अयनांश विस्तार' }, href: '/learn/ayanamsha' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q4_1_01', type: 'mcq',
    question: {
      en: 'What is the primary cause of Earth\'s axial precession?',
      hi: 'पृथ्वी के अक्षीय पुरस्सरण का प्रमुख कारण क्या है?',
    },
    options: [
      { en: 'Earth\'s magnetic field reversals', hi: 'पृथ्वी के चुम्बकीय क्षेत्र का उत्क्रमण' },
      { en: 'Gravitational pull of Sun and Moon on Earth\'s equatorial bulge', hi: 'पृथ्वी के भूमध्यरेखीय उभार पर सूर्य और चन्द्रमा का गुरुत्वाकर्षण' },
      { en: 'Jupiter\'s orbital resonance', hi: 'बृहस्पति की कक्षीय अनुनाद' },
      { en: 'Solar wind pressure on the magnetosphere', hi: 'चुम्बकमण्डल पर सौर पवन का दबाव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Sun and Moon\'s gravitational pull on Earth\'s equatorial bulge (Earth is 43km wider at the equator) creates a torque that drives axial precession at ~50.3 arcseconds per year.',
      hi: 'पृथ्वी के भूमध्यरेखीय उभार (पृथ्वी भूमध्य रेखा पर 43 किमी अधिक चौड़ी है) पर सूर्य और चन्द्रमा का गुरुत्वाकर्षण एक बलाघूर्ण उत्पन्न करता है जो ~50.3 कलांश/वर्ष की दर से पुरस्सरण चलाता है।',
    },
  },
  {
    id: 'q4_1_02', type: 'true_false',
    question: {
      en: 'Precession completes one full cycle (the Platonic Year) in approximately 25,772 years.',
      hi: 'पुरस्सरण एक पूर्ण चक्र (प्लेटोनिक वर्ष) लगभग 25,772 वर्षों में पूरा करता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'Correct. At 50.3 arcseconds/year, one full 360-degree precession cycle takes about 25,772 years — known as the Platonic Year or Great Year.',
      hi: 'सही। 50.3 कलांश/वर्ष की दर से, एक पूर्ण 360-अंश पुरस्सरण चक्र लगभग 25,772 वर्ष लेता है — जिसे प्लेटोनिक वर्ष या महावर्ष कहते हैं।',
    },
  },
  {
    id: 'q4_1_03', type: 'mcq',
    question: {
      en: 'The current Lahiri Ayanamsha (2026) is approximately:',
      hi: 'वर्तमान लहिरी अयनांश (2026) लगभग कितना है?',
    },
    options: [
      { en: '12 degrees', hi: '12 अंश' },
      { en: '24.2 degrees', hi: '24.2 अंश' },
      { en: '36 degrees', hi: '36 अंश' },
      { en: '0 degrees', hi: '0 अंश' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Lahiri Ayanamsha in 2026 is approximately 24.22 degrees — the accumulated angular gap between the tropical and sidereal zodiacs since they were aligned around 285 CE.',
      hi: 'लहिरी अयनांश 2026 में लगभग 24.22 अंश है — लगभग 285 ई. में राशिचक्रों के संरेखण के बाद से सायन और निरयन राशिचक्रों के बीच संचित कोणीय अन्तर।',
    },
  },
  {
    id: 'q4_1_04', type: 'true_false',
    question: {
      en: 'The Surya Siddhanta correctly described precession as a steady, one-directional increase.',
      hi: 'सूर्य सिद्धान्त ने पुरस्सरण को स्थिर, एकदिशात्मक वृद्धि के रूप में सही वर्णित किया।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The Surya Siddhanta used a trepidation (oscillating) model where precession swings back and forth with a maximum of ~27 degrees. Modern astronomy confirms precession is monotonic — it increases steadily and does not reverse.',
      hi: 'असत्य। सूर्य सिद्धान्त ने एक कम्पन (दोलन) प्रतिरूप प्रयोग किया जहाँ पुरस्सरण ~27 अंश तक आगे-पीछे झूलता है। आधुनिक खगोलशास्त्र पुष्टि करता है कि पुरस्सरण एकदिशात्मक है — यह स्थिर रूप से बढ़ता है और उलटता नहीं।',
    },
  },
  {
    id: 'q4_1_05', type: 'mcq',
    question: {
      en: 'To convert a tropical longitude to sidereal, you:',
      hi: 'सायन देशान्तर को निरयन में बदलने के लिए आप:',
    },
    options: [
      { en: 'Add the ayanamsha', hi: 'अयनांश जोड़ते हैं' },
      { en: 'Subtract the ayanamsha', hi: 'अयनांश घटाते हैं' },
      { en: 'Multiply by the ayanamsha', hi: 'अयनांश से गुणा करते हैं' },
      { en: 'Divide by the ayanamsha', hi: 'अयनांश से भाग देते हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sidereal longitude = Tropical longitude minus Ayanamsha. The tropical vernal equinox has moved forward (eastward) relative to the stars, so sidereal positions are behind by the ayanamsha amount.',
      hi: 'निरयन देशान्तर = सायन देशान्तर ऋण अयनांश। सायन वसन्त सम्पात तारों के सापेक्ष आगे (पूर्व दिशा में) बढ़ गया है, इसलिए निरयन स्थितियाँ अयनांश मात्रा से पीछे हैं।',
    },
  },
  {
    id: 'q4_1_06', type: 'mcq',
    question: {
      en: 'Which star anchors the Lahiri (Chitrapaksha) ayanamsha at exactly 180 degrees sidereal longitude?',
      hi: 'कौन-सा तारा लहिरी (चित्रापक्ष) अयनांश को ठीक 180 अंश निरयन देशान्तर पर स्थापित करता है?',
    },
    options: [
      { en: 'Polaris (Dhruva)', hi: 'पोलारिस (ध्रुव)' },
      { en: 'Spica (Chitra)', hi: 'स्पाइका (चित्रा)' },
      { en: 'Regulus (Magha)', hi: 'रेगुलस (मघा)' },
      { en: 'Aldebaran (Rohini)', hi: 'एल्डेबरान (रोहिणी)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Lahiri (Chitrapaksha) ayanamsha anchors the bright star Spica (Chitra) at exactly 180 degrees sidereal longitude — the exact opposite of the sidereal zero point. This was chosen by the Indian Calendar Reform Committee in 1955.',
      hi: 'लहिरी (चित्रापक्ष) अयनांश चमकीले तारे स्पाइका (चित्रा) को ठीक 180 अंश निरयन देशान्तर पर स्थापित करता है — निरयन शून्य बिन्दु के ठीक विपरीत। इसे 1955 में भारतीय पंचांग सुधार समिति ने चुना था।',
    },
  },
  {
    id: 'q4_1_07', type: 'mcq',
    question: {
      en: 'Who first measured precession in the Western tradition?',
      hi: 'पश्चिमी परम्परा में पुरस्सरण को सर्वप्रथम किसने मापा?',
    },
    options: [
      { en: 'Ptolemy (~150 CE)', hi: 'टॉलेमी (~150 ई.)' },
      { en: 'Hipparchus (~150 BCE)', hi: 'हिपार्कस (~150 ई.पू.)' },
      { en: 'Copernicus (1543 CE)', hi: 'कोपर्निकस (1543 ई.)' },
      { en: 'Newton (1687 CE)', hi: 'न्यूटन (1687 ई.)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Greek astronomer Hipparchus (c. 150 BCE) first measured precession by comparing star catalogs 150 years apart. He estimated the rate at 36 arcseconds/year — the actual value is 50.3 arcseconds/year.',
      hi: 'यूनानी खगोलशास्त्री हिपार्कस (लगभग 150 ई.पू.) ने 150 वर्षों के अन्तर पर तारा-सूचियों की तुलना करके पुरस्सरण को पहली बार मापा। उन्होंने दर 36 कलांश/वर्ष अनुमानित की — वास्तविक मान 50.3 कलांश/वर्ष है।',
    },
  },
  {
    id: 'q4_1_08', type: 'true_false',
    question: {
      en: 'The Lahiri and KP ayanamsha values differ by more than 2 degrees.',
      hi: 'लहिरी और के.पी. अयनांश मान 2 अंश से अधिक भिन्न हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Lahiri and KP ayanamsha values are very close — they differ by only about 0.03 degrees (~2 arcminutes). Both anchor to Spica, but KP uses a slightly different polynomial refinement. The difference rarely changes planetary sign placements.',
      hi: 'असत्य। लहिरी और के.पी. अयनांश मान बहुत निकट हैं — वे केवल लगभग 0.03 अंश (~2 कला) भिन्न हैं। दोनों चित्रा तारे पर आधारित हैं, किन्तु के.पी. थोड़ा भिन्न बहुपद शोधन प्रयोग करता है। यह अन्तर ग्रहों की राशि स्थिति शायद ही कभी बदलता है।',
    },
  },
  {
    id: 'q4_1_09', type: 'mcq',
    question: {
      en: 'A planet is at 24.5 degrees tropical longitude. With Lahiri ayanamsha (24.22 degrees) it falls at 0.28 degrees Aries. With Fagan-Bradley (25.10 degrees) it falls at:',
      hi: 'एक ग्रह 24.5 अंश सायन देशान्तर पर है। लहिरी अयनांश (24.22 अंश) से यह 0.28 अंश मेष में आता है। फ़गन-ब्रैडली (25.10 अंश) से यह कहाँ आएगा?',
    },
    options: [
      { en: '0.60 degrees Aries', hi: '0.60 अंश मेष' },
      { en: '29.40 degrees Pisces — a different sign!', hi: '29.40 अंश मीन — भिन्न राशि!' },
      { en: '24.50 degrees Pisces', hi: '24.50 अंश मीन' },
      { en: '1.10 degrees Aries', hi: '1.10 अंश मेष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '24.5 minus 25.10 = -0.60 degrees, which wraps to 360 - 0.60 = 359.40 degrees = 29.40 degrees Pisces. A mere 0.88 degree difference in ayanamsha pushes the planet into an entirely different sign! This is why boundary cases matter.',
      hi: '24.5 ऋण 25.10 = -0.60 अंश, जो 360 - 0.60 = 359.40 अंश = 29.40 अंश मीन बनता है। अयनांश में मात्र 0.88 अंश का अन्तर ग्रह को पूर्णतः भिन्न राशि में धकेल देता है! इसीलिए सीमारेखा के मामले महत्त्वपूर्ण हैं।',
    },
  },
  {
    id: 'q4_1_10', type: 'true_false',
    question: {
      en: 'Western tropical astrology is "wrong" because it ignores precession, while Vedic sidereal astrology is "correct."',
      hi: 'पश्चिमी सायन ज्योतिष "गलत" है क्योंकि यह पुरस्सरण की उपेक्षा करता है, जबकि वैदिक निरयन ज्योतिष "सही" है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Both systems are internally consistent reference frames. Tropical astrology tracks seasonal/equinox relationships (valid for weather and agricultural cycles). Sidereal astrology tracks stellar relationships (essential for nakshatra-based systems). Neither is inherently "wrong" — they answer different questions using different anchors.',
      hi: 'असत्य। दोनों पद्धतियाँ आन्तरिक रूप से सुसंगत सन्दर्भ ढाँचे हैं। सायन ज्योतिष मौसमी/सम्पात सम्बन्धों को ट्रैक करता है (मौसम और कृषि चक्रों के लिए मान्य)। निरयन ज्योतिष तारकीय सम्बन्धों को ट्रैक करता है (नक्षत्र-आधारित पद्धतियों के लिए आवश्यक)। कोई भी स्वाभाविक रूप से "गलत" नहीं है — वे भिन्न लंगरों का उपयोग करके भिन्न प्रश्नों का उत्तर देते हैं।',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE 1 — What is Precession and Why It Matters
   ═══════════════════════════════════════════════════════════════ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* Opening Hook */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पुरस्सरण क्या है और यह क्यों महत्त्वपूर्ण है' : 'What Is Precession and Why It Matters'}
        </h3>
        <p className="text-gold-light/90 text-sm leading-relaxed mb-4 italic border-l-2 border-gold-primary/30 pl-4">
          {isHi
            ? 'प्रत्येक 72 वर्ष में आपकी राशि 1 अंश खिसकती है। 2000 वर्षों में यह पूरी एक राशि खिसक जाती है। यह ज्योतिष नहीं — यह भौतिकशास्त्र है। और यही कारण है कि आपकी वैदिक राशि आपकी पश्चिमी राशि से भिन्न है।'
            : 'Every 72 years, your zodiac sign shifts by 1 degree. In 2,000 years, it shifts by an entire sign. This isn\'t astrology — it\'s physics. And it\'s the reason your Vedic sign differs from your Western sign.'}
        </p>
      </section>

      {/* The Spinning Top Analogy */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'लट्टू की उपमा' : 'The Spinning Top Analogy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'मेज़ पर एक घूमते हुए लट्टू की कल्पना कीजिए। जैसे-जैसे यह घूमता है, इसका अक्ष हवा में धीरे-धीरे एक वृत्त बनाता है — इसे पुरस्सरण कहते हैं। पृथ्वी ठीक यही करती है। पृथ्वी का घूर्णन अक्ष अन्तरिक्ष में एक शंकु बनाते हुए घूमता है, एक पूर्ण चक्र 25,772 वर्षों में पूरा करता है। इसे "प्लेटोनिक वर्ष" या "महावर्ष" कहा जाता है।'
            : 'Imagine a spinning top on a table. As it spins, its axis slowly traces a circle in the air — that\'s precession. Earth does exactly the same thing. Earth\'s rotation axis traces a cone in space, completing one full circle every 25,772 years. This is called the "Platonic Year" or "Great Year."'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भौतिकशास्त्र: सूर्य और चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के भूमध्यरेखीय उभार पर खींचता है (पृथ्वी ध्रुवों की तुलना में भूमध्य रेखा पर 43 किलोमीटर अधिक चौड़ी है)। यह एक बलाघूर्ण उत्पन्न करता है जो घूर्णन अक्ष को धीरे-धीरे घुमाता है। दर: 50.29 कलांश/वर्ष, अर्थात् प्रत्येक 71.6 वर्ष में 1 अंश।'
            : 'The physics: the Sun and Moon\'s gravitational pull acts on Earth\'s equatorial bulge (Earth is 43 kilometres wider at the equator than from pole to pole). This creates a torque that slowly tilts the rotation axis. Rate: 50.29 arcseconds per year, which equals 1 degree every 71.6 years.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'परिणाम: वसन्त सम्पात (जहाँ सूर्य खगोलीय भूमध्य रेखा को पार करता है) क्रान्तिवृत्त के सापेक्ष धीरे-धीरे पश्चिम की ओर विस्थापित होता है। इसका अर्थ है कि सायन राशिचक्र (सम्पातों पर आधारित) और निरयन राशिचक्र (तारों पर आधारित) धीरे-धीरे अलग होते जाते हैं। अयनांश = सायन और निरयन के बीच संचित कोणीय अन्तर। आज: ~24.22° (लहिरी)। प्रत्येक शताब्दी में ~1.4° की वृद्धि।'
            : 'The consequence: the vernal equinox (the point where the Sun crosses the celestial equator) slowly drifts westward along the ecliptic. This means the tropical zodiac (anchored to equinoxes) and the sidereal zodiac (anchored to fixed stars) slowly separate. The ayanamsha is the accumulated angular gap between them. Today: ~24.22 degrees (Lahiri). Growing at ~1.4 degrees per century.'}
        </p>
      </section>

      {/* Historical Discovery */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ऐतिहासिक खोज' : 'Historical Discovery'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हिपार्कस (लगभग 150 ई.पू., ग्रीस): 150 वर्षों के अन्तराल पर तारा-सूचियों की तुलना करके पुरस्सरण को मापने वाले प्रथम व्यक्ति। उनका अनुमान: 36 कलांश/वर्ष (वास्तविक: 50.3 कलांश/वर्ष)। उन्होंने देखा कि तारों की स्थितियाँ पिछली सूचियों से व्यवस्थित रूप से खिसकी हुई थीं — एक ही दिशा में, एक स्थिर दर से।'
            : 'Hipparchus (c. 150 BCE, Greece): First to measure precession by comparing star catalogues 150 years apart. His estimate: 36 arcseconds per year (actual: 50.3 arcseconds per year). He noticed that star positions had systematically shifted from earlier catalogues — all in the same direction, at a steady rate.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भारतीय खोज (स्वतन्त्र): सूर्य सिद्धान्त ने पुरस्सरण का वर्णन किया किन्तु "कम्पन" (दोलन) प्रतिरूप प्रयोग किया — अधिकतम ±27° तक दोलन। यह त्रुटिपूर्ण था; पुरस्सरण वस्तुतः एकदिशात्मक है। वराहमिहिर (505 ई.) ने पञ्चसिद्धान्तिका में पाँच खगोलीय पद्धतियों की तुलना की और विस्थापित होते सम्पात को नोट किया। भास्कराचार्य द्वितीय (1150 ई.) ने आधुनिक मान के निकट पुरस्सरण दर दी।'
            : 'Indian discovery (independent): The Surya Siddhanta described precession but used a "trepidation" model — an oscillation with a maximum of plus or minus 27 degrees. This was wrong; precession is actually monotonic (one-directional). Varahamihira (505 CE) compared five astronomical systems in the Pancha Siddhantika and noted the shifting equinox. Bhaskaracharya II (1150 CE) gave a precession rate close to the modern value.'}
        </p>
      </section>

      {/* Classical Origin Card */}
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सूर्य सिद्धान्त, अध्याय 3: "सम्पात बिन्दु क्रान्तिवृत्त के अनुदिश गति करते हैं, कभी पूर्व की ओर, कभी पश्चिम की ओर, 54 कलांश (प्रति वर्ष) की दर से।" यह कम्पन प्रतिरूप था — दिशा उलटने का विचार सूर्य सिद्धान्त की एकमात्र बड़ी त्रुटि थी। फिर भी, यह तथ्य कि प्राचीन भारतीय खगोलशास्त्रियों ने पुरस्सरण को बिल्कुल भी पहचाना, एक उल्लेखनीय उपलब्धि है।'
            : 'Surya Siddhanta, Chapter 3: "The solstitial points move along the ecliptic, sometimes eastward, sometimes westward, at the rate of 54 arcseconds (per year)." This was the trepidation model — the idea that the direction reverses was the Surya Siddhanta\'s one major error. Yet the fact that ancient Indian astronomers recognized precession at all was a remarkable achievement.'}
        </p>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 2 — The Ayanamsha: Where Tropical and Sidereal Diverge
   ═══════════════════════════════════════════════════════════════ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* Zero Ayanamsha Date */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अयनांश — जहाँ सायन और निरयन विभक्त होते हैं' : 'The Ayanamsha — Where Tropical and Sidereal Diverge'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'राशिचक्र कब संरेखित थे? इसे "शून्य अयनांश तिथि" कहते हैं — वह युग जब सायन = निरयन। विभिन्न पद्धतियाँ असहमत हैं, क्योंकि प्रत्येक पद्धति भिन्न सन्दर्भ तारे या गणितीय विधि का प्रयोग करती है।'
            : 'When were the two zodiacs aligned? This is called the "zero ayanamsha date" — the epoch when tropical equals sidereal. Different systems disagree, because each uses a different reference star or mathematical method.'}
        </p>
      </section>

      {/* Ayanamsha Systems Table */}
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10 overflow-x-auto">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'अयनांश पद्धतियों की तुलना' : 'Ayanamsha Systems Compared'}
        </h4>
        <table className="w-full text-xs text-text-secondary">
          <thead>
            <tr className="border-b border-gold-primary/10">
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">{isHi ? 'पद्धति' : 'System'}</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">J2000.0</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">2026</th>
              <th className="text-left py-2 pr-3 text-gold-light font-semibold">{isHi ? 'आधार तारा' : 'Anchor'}</th>
              <th className="text-left py-2 text-gold-light font-semibold">{isHi ? 'शून्य तिथि' : 'Zero Date'}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'लहिरी (चित्रापक्ष)' : 'Lahiri (Chitrapaksha)'}</td>
              <td className="py-2 pr-3">23.85&deg;</td>
              <td className="py-2 pr-3">24.22&deg;</td>
              <td className="py-2 pr-3">{isHi ? 'चित्रा (स्पाइका) 180° पर' : 'Spica (Chitra) at 180\u00b0'}</td>
              <td className="py-2">{isHi ? '~285 ई.' : '~285 CE'}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'रमण' : 'Raman'}</td>
              <td className="py-2 pr-3">22.40&deg;</td>
              <td className="py-2 pr-3">22.76&deg;</td>
              <td className="py-2 pr-3">&#8212;</td>
              <td className="py-2">{isHi ? '~397 ई.' : '~397 CE'}</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'के.पी. (कृष्णमूर्ति)' : 'KP (Krishnamurti)'}</td>
              <td className="py-2 pr-3">23.82&deg;</td>
              <td className="py-2 pr-3">24.19&deg;</td>
              <td className="py-2 pr-3">{isHi ? 'चित्रा (शोधित)' : 'Spica (refined)'}</td>
              <td className="py-2">{isHi ? '~291 ई.' : '~291 CE'}</td>
            </tr>
            <tr>
              <td className="py-2 pr-3 text-gold-light/80 font-medium">{isHi ? 'फ़गन-ब्रैडली' : 'Fagan-Bradley'}</td>
              <td className="py-2 pr-3">24.74&deg;</td>
              <td className="py-2 pr-3">25.10&deg;</td>
              <td className="py-2 pr-3">&#8212;</td>
              <td className="py-2">{isHi ? '~221 ई.' : '~221 CE'}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* The Calculation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'गणना कैसे होती है' : 'The Calculation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'किसी भी तिथि के लिए लहिरी अयनांश एक बहुपद सूत्र से निकाला जाता है:'
            : 'The Lahiri ayanamsha for any date is computed from a polynomial formula:'}
        </p>
        <div className="glass-card rounded-lg p-4 border border-gold-primary/10 font-mono text-xs text-gold-light/90 mb-3">
          <p>A = 24.042 + 1.3968 &times; T + 0.0005 &times; T&sup2;</p>
          <p className="text-text-secondary mt-1">
            {isHi ? 'जहाँ T = J2000.0 (1 जनवरी 2000) से शताब्दियाँ' : 'where T = centuries from J2000.0 (Jan 1, 2000)'}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अप्रैल 2026 के लिए: T ≈ 0.2625 → A ≈ 24.042 + (1.3968 × 0.2625) + (0.0005 × 0.0689) ≈ 24.042 + 0.367 + 0.00003 ≈ 24.41° (सरलीकृत; पूर्ण IAU बहुपद ~24.22° देता है)। सटीक मान प्रयुक्त शब्दों की संख्या पर निर्भर करता है — हमारा ऐप IAU पुरस्सरण के साथ पूर्ण बहुपद प्रयोग करता है।'
            : 'For April 2026: T is approximately 0.2625 centuries. A is approximately 24.042 + (1.3968 times 0.2625) + (0.0005 times 0.0689) = roughly 24.41 degrees (simplified; the full IAU polynomial yields ~24.22 degrees). The exact value depends on how many terms are included — our app uses the full polynomial fitted to IAU precession.'}
        </p>
      </section>

      {/* Worked Examples Card */}
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'उदाहरण — सीमारेखा की समस्या' : 'Worked Example — The Boundary Problem'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'प्रश्न:' : 'Problem:'}</span>{' '}
          {isHi
            ? 'एक ग्रह 24.5° सायन देशान्तर पर है। दोनों अयनांशों से निरयन स्थिति ज्ञात कीजिए।'
            : 'A planet is at 24.5 degrees tropical longitude. Find its sidereal position under both ayanamshas.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'लहिरी (24.22°):' : 'Lahiri (24.22 deg):'}</span>{' '}
          {isHi
            ? '24.5 - 24.22 = 0.28° → 0°17\' मेष (मेष राशि में)'
            : '24.5 minus 24.22 = 0.28 degrees = 0 degrees 17 arcminutes Aries (in Aries)'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'फ़गन-ब्रैडली (25.10°):' : 'Fagan-Bradley (25.10 deg):'}</span>{' '}
          {isHi
            ? '24.5 - 25.10 = -0.60° → 360° - 0.60° = 359.40° = 29°24\' मीन (मीन राशि में!)'
            : '24.5 minus 25.10 = negative 0.60 degrees, wraps to 359.40 degrees = 29 degrees 24 arcminutes Pisces (in Pisces!)'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2 pt-2 border-t border-white/5">
          {isHi
            ? 'अयनांश में मात्र 0.88° का अन्तर ग्रह को मेष से मीन में धकेल देता है — पूर्णतः भिन्न राशि, भिन्न स्वामी, भिन्न फलादेश। यह समस्या तब उत्पन्न होती है जब ग्रह किसी राशि की सीमा (0°-2° या 28°-30°) के निकट हो।'
            : 'A mere 0.88-degree difference in ayanamsha pushes the planet from Aries to Pisces — a completely different sign, different ruler, different interpretation. This problem arises when a planet is near any sign boundary (0-2 degrees or 28-30 degrees of any sign).'}
        </p>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 3 — India's Contribution and the Great Debate
   ═══════════════════════════════════════════════════════════════ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* Why Lahiri Won */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'लहिरी ने क्यों जीता — भारतीय पंचांग सुधार' : 'Why Lahiri Won — India\'s Calendar Reform'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भारतीय पंचांग सुधार समिति (1955), भौतिकशास्त्री मेघनाद साहा (जिन्होंने खगोल भौतिकी में विश्वव्यापी रूप से प्रयुक्त साहा आयनन समीकरण की खोज की) के नेतृत्व में, ने भारत के राष्ट्रीय पंचांग के लिए लहिरी (चित्रापक्ष) अयनांश को आधिकारिक रूप से अपनाया। साहा ने इसे चुना क्योंकि:'
            : 'The Indian Calendar Reform Committee (1955), headed by physicist Meghnad Saha (who discovered the Saha ionization equation used in astrophysics worldwide), officially adopted the Lahiri (Chitrapaksha) ayanamsha for India\'s National Calendar. Saha chose it because:'}
        </p>
        <ul className="text-text-secondary text-sm leading-relaxed space-y-2 ml-4 mb-3">
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">1.</span>
            <span>
              {isHi
                ? 'यह चित्रा (स्पाइका) पर आधारित है — एक चमकीला, आसानी से प्रेक्षणीय तारा जो प्रथम कोटि का है।'
                : 'It anchors to Spica (Chitra) — a bright, first-magnitude star that is easily observable.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">2.</span>
            <span>
              {isHi
                ? '180° खगोलीय रूप से स्वच्छ है — वसन्त सम्पात के ठीक विपरीत।'
                : '180 degrees is astronomically clean — exactly opposite the vernal equinox.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold-primary mt-1 shrink-0">3.</span>
            <span>
              {isHi
                ? 'यह भारतीय ग्रन्थों में ऐतिहासिक खगोलीय प्रेक्षणों से सर्वोत्तम मेल खाता है।'
                : 'It best fits historical astronomical observations recorded in Indian texts.'}
            </span>
          </li>
        </ul>
      </section>

      {/* The Ongoing Debate */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अनवरत वाद-विवाद' : 'The Ongoing Debate'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'कोई भी अयनांश "सिद्ध रूप से सही" नहीं है — चुनाव इस पर निर्भर करता है कि आप किस सन्दर्भ तारे या युग पर विश्वास करते हैं। लहिरी भारत में प्रमुख है (~90% ज्योतिषी)। के.पी. पद्धति एक बहुत निकट संस्करण प्रयोग करती है (मात्र ~2 कला अन्तर)। रमण एक महत्त्वपूर्ण अल्पसंख्यक द्वारा प्रयुक्त है। पश्चिमी निरयन ज्योतिषी फ़गन-ब्रैडली प्रयोग करते हैं।'
            : 'No ayanamsha is "proven correct" — the choice depends on which reference star or epoch you trust. Lahiri is dominant in India (roughly 90 percent of practitioners). The KP system uses a very close variant (only about 2 arcminutes difference). Raman is used by a significant minority. Western siderealists use Fagan-Bradley.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'व्यावहारिक प्रभाव: यदि आपका ग्रह किसी राशि की सीमा के 2° के भीतर (0°-2° या 28°-30°) है, तो अयनांश का चुनाव महत्त्वपूर्ण है — यह ग्रह की राशि, नक्षत्र या पाद बदल सकता है। राशि के मध्य में स्थित ग्रहों के लिए सभी अयनांश पद्धतियाँ सहमत हैं।'
            : 'Practical impact for you: if your planet is within 2 degrees of a sign boundary (0-2 degrees or 28-30 degrees of any sign), the ayanamsha choice matters — it could change your planet\'s sign, nakshatra, or pada. For planets in the middle of a sign, all ayanamsha systems agree.'}
        </p>
      </section>

      {/* How Our App Handles It */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'हमारा ऐप कैसे सँभालता है' : 'How Our App Handles It'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'कुण्डली जनक आपको लहिरी, रमण या के.पी. अयनांश चुनने देता है। पूर्वनिर्धारित लहिरी है (सर्वाधिक व्यापक)। सूत्र IAU पुरस्सरण पर आधारित बहुपद है जिसमें चित्रा (स्पाइका) 180° निरयन पर स्थिर है। सभी ग्रह स्थितियाँ पहले सायन (उष्णकटिबन्धीय) गणित से निकाली जाती हैं, फिर चयनित अयनांश घटाकर निरयन (नाक्षत्र) में रूपान्तरित की जाती हैं।'
            : 'The kundali generator lets you choose Lahiri, Raman, or KP ayanamsha. The default is Lahiri (most widely used). The formula is a polynomial fitted to IAU precession with Spica pinned at 180 degrees sidereal. All planetary positions are first computed using tropical (equinox-based) mathematics, then converted to sidereal by subtracting the chosen ayanamsha.'}
        </p>
      </section>

      {/* Misconceptions Card */}
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          <span className="text-red-300 font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span>{' '}
          {isHi
            ? '"पश्चिमी ज्योतिष गलत है क्योंकि वह अयनांश का प्रयोग नहीं करता।"'
            : '"Western astrology is wrong because it doesn\'t use ayanamsha."'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-emerald-400 font-medium">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
          {isHi
            ? 'दोनों पद्धतियाँ आन्तरिक रूप से सुसंगत हैं। सायन ज्योतिष मौसमी सम्बन्धों को ट्रैक करता है (मौसम और कृषि के लिए मान्य)। निरयन ज्योतिष तारकीय सम्बन्धों को ट्रैक करता है (नक्षत्र-आधारित पद्धतियों के लिए मान्य)। कोई भी "गलत" नहीं है — वे भिन्न लंगरों का उपयोग करके भिन्न प्रश्नों का उत्तर देते हैं।'
            : 'Both systems are internally consistent. Tropical astrology tracks seasonal and equinox relationships (valid for weather and agricultural cycles). Sidereal astrology tracks stellar relationships (valid for nakshatra-based systems). Neither is "wrong" — they answer different questions using different anchors.'}
        </p>
      </section>

      {/* Modern Relevance Card */}
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'अन्तर्राष्ट्रीय खगोलीय संघ (IAU) ICRS (अन्तर्राष्ट्रीय खगोलीय सन्दर्भ पद्धति) प्रयोग करता है जो दूरस्थ क्वेसारों पर आधारित है — न सायन, न निरयन। सभी अयनांश पद्धतियाँ मानव-चयनित सन्दर्भ ढाँचे हैं। जो महत्त्वपूर्ण है वह सुसंगतता है, न कि परम "सत्य"। नासा कक्षीय गणनाओं में पुरस्सरण प्रयोग करता है। हमारा ऐप वही गणित प्रयोग करता है — IAU पुरस्सरण दर पर आधारित बहुपद, चित्रा तारे से 180° पर स्थिर।'
            : 'The IAU (International Astronomical Union) uses the ICRS (International Celestial Reference System) anchored to distant quasars — neither tropical nor sidereal. All ayanamsha systems are human-chosen reference frames. What matters is consistency, not absolute "truth." NASA uses precession in all orbital calculations. Our app uses the same mathematics — a polynomial based on the IAU precession rate, anchored to the star Spica at 180 degrees sidereal.'}
        </p>
      </section>
    </div>
  );
}

export default function Module4_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

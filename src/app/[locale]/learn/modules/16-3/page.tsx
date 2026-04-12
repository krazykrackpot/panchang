'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_16_3', phase: 5, topic: 'Classical', moduleNumber: '16.3',
  title: {
    en: 'Surya Siddhanta & Mathematical Texts',
    hi: 'सूर्य सिद्धान्त एवं गणितीय ग्रन्थ',
  },
  subtitle: {
    en: 'The astronomical foundation — planetary mean motions, sine tables, epicyclic theory, and the computational lineage from ancient India to our app',
    hi: 'खगोलशास्त्रीय आधार — ग्रहों की मध्य गति, ज्या सारणी, अधिचक्र सिद्धान्त, और प्राचीन भारत से हमारे ऐप तक की गणनात्मक परम्परा',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 16-1: Brihat Parashara Hora Shastra', hi: 'मॉड्यूल 16-1: बृहत् पाराशर होरा शास्त्र' }, href: '/learn/modules/16-1' },
    { label: { en: 'Module 16-2: Phaladeepika & Jataka Parijata', hi: 'मॉड्यूल 16-2: फलदीपिका एवं जातक पारिजात' }, href: '/learn/modules/16-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q16_3_01', type: 'mcq',
    question: {
      en: 'What is the sidereal year length given by the Surya Siddhanta?',
      hi: 'सूर्य सिद्धान्त में नाक्षत्र वर्ष की लम्बाई कितनी दी गई है?',
    },
    options: [
      { en: '365.0000 days', hi: '365.0000 दिन' },
      { en: '365.2422 days', hi: '365.2422 दिन' },
      { en: '365.2587565 days', hi: '365.2587565 दिन' },
      { en: '366.0000 days', hi: '366.0000 दिन' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Surya Siddhanta gives the sidereal year as 365.2587565 days. The modern value is 365.25636 days — an error of only about 1.4 seconds per year. This is remarkably accurate for a text composed without telescopes.',
      hi: 'सूर्य सिद्धान्त नाक्षत्र वर्ष को 365.2587565 दिन बताता है। आधुनिक मान 365.25636 दिन है — प्रतिवर्ष केवल लगभग 1.4 सेकंड की त्रुटि। दूरबीन के बिना रचित ग्रन्थ के लिए यह उल्लेखनीय सटीकता है।',
    },
  },
  {
    id: 'q16_3_02', type: 'mcq',
    question: {
      en: 'The Surya Siddhanta uses which geometric model for planetary motion?',
      hi: 'सूर्य सिद्धान्त ग्रहों की गति के लिए कौन-सा ज्यामितीय मॉडल प्रयोग करता है?',
    },
    options: [
      { en: 'Heliocentric ellipses', hi: 'सूर्यकेन्द्री दीर्घवृत्त' },
      { en: 'Epicyclic theory (manda and shighra)', hi: 'अधिचक्र सिद्धान्त (मन्द और शीघ्र)' },
      { en: 'Simple circular orbits', hi: 'सरल वृत्ताकार कक्षाएँ' },
      { en: 'Kepler\'s laws directly', hi: 'सीधे केपलर के नियम' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Surya Siddhanta uses epicyclic theory with two corrections: Manda (equation of center, accounting for elliptical orbit) and Shighra (synodic correction, converting heliocentric to geocentric). This is geometrically equivalent to Ptolemy\'s epicycles but developed independently.',
      hi: 'सूर्य सिद्धान्त दो संशोधनों के साथ अधिचक्र सिद्धान्त का प्रयोग करता है: मन्द (केन्द्र का समीकरण, दीर्घवृत्ताकार कक्षा के लिए) और शीघ्र (सायन संशोधन, सूर्यकेन्द्री को भूकेन्द्री में परिवर्तित करता है)।',
    },
  },
  {
    id: 'q16_3_03', type: 'true_false',
    question: {
      en: 'Aryabhata (499 CE) improved upon the Surya Siddhanta by proposing that the Earth rotates on its axis.',
      hi: 'आर्यभट (499 ई.) ने सूर्य सिद्धान्त में सुधार किया और प्रस्तावित किया कि पृथ्वी अपनी धुरी पर घूमती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In his Aryabhatiya, Aryabhata stated that the apparent rotation of the sky is due to Earth\'s axial rotation — over a millennium before Copernicus. He also refined planetary parameters and introduced improved sine tables.',
      hi: 'सत्य। अपनी आर्यभटीय में आर्यभट ने कहा कि आकाश का प्रत्यक्ष घूर्णन पृथ्वी के अक्षीय घूर्णन के कारण है — कोपरनिकस से एक सहस्राब्दी से अधिक पूर्व। उन्होंने ग्रह मापदण्डों को भी परिष्कृत किया।',
    },
  },
  {
    id: 'q16_3_04', type: 'mcq',
    question: {
      en: 'The Indian mathematical concept of "jya" is equivalent to the modern:',
      hi: 'भारतीय गणितीय अवधारणा "ज्या" आधुनिक किसके समतुल्य है?',
    },
    options: [
      { en: 'Cosine function', hi: 'कोसाइन फलन' },
      { en: 'Sine function (R sin theta)', hi: 'साइन फलन (R sin theta)' },
      { en: 'Tangent function', hi: 'टैन्जेन्ट फलन' },
      { en: 'Logarithm', hi: 'लघुगणक' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jya (ज्या) is the Indian sine function, defined as R * sin(theta) where R is the radius. The word "sine" itself derives from a Latin mistranslation of the Arabic "jiba," which was a transliteration of the Sanskrit "jya."',
      hi: 'ज्या भारतीय साइन फलन है, जो R * sin(theta) के रूप में परिभाषित है जहाँ R त्रिज्या है। "sine" शब्द स्वयं अरबी "जीब" के लैटिन गलत अनुवाद से निकला है, जो संस्कृत "ज्या" का लिप्यन्तरण था।',
    },
  },
  {
    id: 'q16_3_05', type: 'mcq',
    question: {
      en: 'Approximately how accurate is the Surya Siddhanta for the Moon\'s position?',
      hi: 'सूर्य सिद्धान्त चन्द्रमा की स्थिति में लगभग कितना सटीक है?',
    },
    options: [
      { en: 'Within 0.01 degrees', hi: '0.01 अंश के भीतर' },
      { en: 'Within about 1 degree', hi: 'लगभग 1 अंश के भीतर' },
      { en: 'Within about 10 degrees', hi: 'लगभग 10 अंश के भीतर' },
      { en: 'Within about 30 degrees', hi: 'लगभग 30 अंश के भीतर' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Surya Siddhanta achieves about 1 degree accuracy for the Moon. The Sun is better at about 0.1 degrees. By comparison, our app\'s Meeus algorithms achieve ~0.01 degrees for the Sun and ~0.3 degrees for the Moon.',
      hi: 'सूर्य सिद्धान्त चन्द्रमा के लिए लगभग 1 अंश की सटीकता प्राप्त करता है। सूर्य बेहतर है, लगभग 0.1 अंश। तुलना में, हमारे ऐप के मीयस एल्गोरिदम सूर्य के लिए ~0.01 अंश और चन्द्रमा के लिए ~0.3 अंश प्राप्त करते हैं।',
    },
  },
  {
    id: 'q16_3_06', type: 'true_false',
    question: {
      en: 'Indian mathematicians computed planetary longitudes without telescopes, using only naked-eye observations and mathematics.',
      hi: 'भारतीय गणितज्ञों ने दूरबीन के बिना, केवल नग्न आँखों से अवलोकन और गणित का प्रयोग करके ग्रहों के देशान्तर की गणना की।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. All Indian astronomical computations before the colonial period were based on naked-eye observations refined through mathematical models. The sine tables, epicyclic corrections, and iterative methods achieved remarkable precision without optical instruments.',
      hi: 'सत्य। औपनिवेशिक काल से पूर्व सभी भारतीय खगोलीय गणनाएँ गणितीय मॉडलों से परिष्कृत नग्न-नेत्र अवलोकनों पर आधारित थीं। ज्या सारणियों, अधिचक्र संशोधनों और पुनरावृत्त विधियों ने प्रकाशीय उपकरणों के बिना उल्लेखनीय सटीकता प्राप्त की।',
    },
  },
  {
    id: 'q16_3_07', type: 'mcq',
    question: {
      en: 'The computational progression from ancient to modern astronomical methods is:',
      hi: 'प्राचीन से आधुनिक खगोलीय विधियों तक की गणनात्मक प्रगति है:',
    },
    options: [
      { en: 'Surya Siddhanta > JPL > Meeus > Swiss Ephemeris', hi: 'सूर्य सिद्धान्त > JPL > मीयस > स्विस एफेमेरिस' },
      { en: 'Surya Siddhanta > Meeus > Swiss Ephemeris > JPL DE440', hi: 'सूर्य सिद्धान्त > मीयस > स्विस एफेमेरिस > JPL DE440' },
      { en: 'Meeus > Surya Siddhanta > JPL > Swiss Ephemeris', hi: 'मीयस > सूर्य सिद्धान्त > JPL > स्विस एफेमेरिस' },
      { en: 'JPL > Swiss Ephemeris > Meeus > Surya Siddhanta', hi: 'JPL > स्विस एफेमेरिस > मीयस > सूर्य सिद्धान्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The progression in increasing accuracy: Surya Siddhanta (ancient, ~1 degree Moon) > Meeus algorithms (1991, ~0.3 degree Moon) > Swiss Ephemeris (sub-arcsecond, based on JPL) > JPL DE440 (highest precision, NASA\'s standard). Our app uses Meeus, which is sufficient for Panchang.',
      hi: 'बढ़ती सटीकता में प्रगति: सूर्य सिद्धान्त (प्राचीन, ~1 अंश चन्द्रमा) > मीयस एल्गोरिदम (1991, ~0.3 अंश चन्द्रमा) > स्विस एफेमेरिस (उप-आर्कसेकंड) > JPL DE440 (सर्वोच्च सटीकता)। हमारा ऐप मीयस का प्रयोग करता है।',
    },
  },
  {
    id: 'q16_3_08', type: 'mcq',
    question: {
      en: 'Our app uses which level of astronomical computation?',
      hi: 'हमारा ऐप खगोलीय गणना के किस स्तर का प्रयोग करता है?',
    },
    options: [
      { en: 'Surya Siddhanta directly', hi: 'सीधे सूर्य सिद्धान्त' },
      { en: 'Meeus algorithms (~0.01 degree Sun, ~0.3 degree Moon)', hi: 'मीयस एल्गोरिदम (~0.01 अंश सूर्य, ~0.3 अंश चन्द्रमा)' },
      { en: 'JPL DE440 directly', hi: 'सीधे JPL DE440' },
      { en: 'No computation — uses pre-stored tables', hi: 'कोई गणना नहीं — पूर्व-संग्रहीत सारणियाँ प्रयुक्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Our app implements Jean Meeus\'s "Astronomical Algorithms" — providing ~0.01 degree Sun accuracy and ~0.3 degree Moon accuracy. This is more than sufficient for Panchang calculations where tithi boundaries span 12 degrees.',
      hi: 'हमारा ऐप जीन मीयस के "Astronomical Algorithms" का कार्यान्वयन करता है — ~0.01 अंश सूर्य सटीकता और ~0.3 अंश चन्द्रमा सटीकता प्रदान करता है। यह पंचांग गणनाओं के लिए पर्याप्त से अधिक है जहाँ तिथि सीमाएँ 12 अंश में फैली होती हैं।',
    },
  },
  {
    id: 'q16_3_09', type: 'true_false',
    question: {
      en: 'The English word "sine" derives ultimately from the Sanskrit word "jya" through Arabic and Latin.',
      hi: 'अंग्रेजी शब्द "sine" अन्ततः संस्कृत शब्द "ज्या" से अरबी और लैटिन के माध्यम से निकला है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Sanskrit "jya" > Arabic "jiba" (transliteration) > Latin "sinus" (mistranslation, thinking "jiba" meant "fold/bay") > English "sine." This etymological chain is direct evidence of the transmission of Indian mathematics to the West.',
      hi: 'सत्य। संस्कृत "ज्या" > अरबी "जीब" (लिप्यन्तरण) > लैटिन "sinus" (गलत अनुवाद, "जीब" को "मोड़/खाड़ी" समझकर) > अंग्रेजी "sine"। यह व्युत्पत्ति शृंखला भारतीय गणित के पश्चिम में संचरण का प्रत्यक्ष प्रमाण है।',
    },
  },
  {
    id: 'q16_3_10', type: 'mcq',
    question: {
      en: 'For Panchang calculations, Meeus-level accuracy is sufficient because:',
      hi: 'पंचांग गणनाओं के लिए मीयस-स्तरीय सटीकता पर्याप्त है क्योंकि:',
    },
    options: [
      { en: 'Panchang does not involve any calculation', hi: 'पंचांग में कोई गणना सम्मिलित नहीं है' },
      { en: 'Tithi spans 12 degrees, so 0.3 degree Moon error is negligible', hi: 'तिथि 12 अंश में फैली है, अतः 0.3 अंश चन्द्र त्रुटि नगण्य है' },
      { en: 'Meeus has zero error', hi: 'मीयस में शून्य त्रुटि है' },
      { en: 'Only the Sun matters for Panchang', hi: 'पंचांग के लिए केवल सूर्य महत्वपूर्ण है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A tithi spans 12 degrees of Moon-Sun elongation. Our Moon error of ~0.3 degrees means worst-case timing error of about 40 minutes for tithi transitions — comparable to Drik Panchang and acceptable for all practical purposes.',
      hi: 'एक तिथि चन्द्र-सूर्य दूरी के 12 अंश में फैली है। हमारी ~0.3 अंश की चन्द्र त्रुटि का अर्थ है तिथि संक्रमण में अधिकतम लगभग 40 मिनट की समय त्रुटि — दृक् पंचांग के तुलनीय और सभी व्यावहारिक उद्देश्यों के लिए स्वीकार्य।',
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
          Surya Siddhanta — The Astronomical Foundation
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Surya Siddhanta is the oldest surviving complete astronomical text of India, dating in its current form to roughly the 4th-5th century CE (though it claims divine origin and its core methods may be much older). Unlike BPHS and Phaladeepika which focus on interpretation, the Surya Siddhanta is pure astronomy — it tells you WHERE planets are, not what their positions MEAN.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text provides mean motions for all visible planets, epicyclic corrections (manda and shighra) to convert mean positions to true positions, methods for computing eclipses, and a sophisticated time-measurement system. Its sidereal year of 365.2587565 days differs from the modern value (365.25636 days) by only 1.4 seconds per year.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Aryabhata (499 CE) refined the Surya Siddhanta&rsquo;s methods in his Aryabhatiya. He proposed that the Earth rotates on its axis (over a millennium before Copernicus), improved sine tables to 24 values at 3.75-degree intervals, and refined the planetary parameters. Later astronomers like Brahmagupta (628 CE) and Bhaskara II (1150 CE) continued this tradition of precision refinement.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Epicyclic Theory — Manda and Shighra</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Planets do not move at constant speed in circular orbits. The Surya Siddhanta accounts for this with two corrections: the Manda (slow) correction handles the equation of center (the planet speeds up at perihelion and slows at aphelion). The Shighra (fast) correction converts heliocentric longitude to geocentric — explaining retrograde motion. Together, these two epicycles reproduce observed planetary positions with about 1-degree accuracy for most planets.
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
          Mathematical Legacy — From Jya to Sine
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Indian mathematicians developed the sine function (jya), cosine (kotijya), and versine (utkramajya) for astronomical computation. The Surya Siddhanta provides a sine table with 24 values at 3.75-degree intervals. Aryabhata compressed this into an elegant verse using an alphabetic numeral system. Bhaskara I (7th century) provided a rational approximation for sine that is accurate to about 1.9% maximum error.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The word &ldquo;sine&rdquo; itself is a remarkable linguistic fossil. Sanskrit &ldquo;jya&rdquo; (bowstring) was transliterated into Arabic as &ldquo;jiba.&rdquo; When Latin translators encountered this, they misread the Arabic consonantal script as &ldquo;jaib&rdquo; (meaning fold or bay) and translated it as &ldquo;sinus&rdquo; — which became English &ldquo;sine.&rdquo; Every time a student writes &ldquo;sin(x),&rdquo; they are using an Indian mathematical invention.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Beyond trigonometry, Indian astronomical tradition contributed iterative methods for solving transcendental equations (used in computing true planetary positions), spherical geometry for coordinate transformations (horizontal to ecliptic), and sophisticated calendar systems that tracked multiple astronomical cycles simultaneously.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Computing Without Telescopes</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          How did Indian astronomers achieve sub-degree accuracy without optical instruments? Through sustained observation programs spanning centuries, mathematical curve-fitting to naked-eye data, and progressive refinement of parameters. Each generation of astronomers recorded planetary positions against star fields, compared them to predictions, and adjusted the constants. This is essentially the same method modern science uses — just with less precise measuring instruments and more patience.
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
          Accuracy Comparison — Ancient to Modern
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The progression of astronomical accuracy tells a compelling story. The Surya Siddhanta achieves roughly 0.1-degree accuracy for the Sun and 1-degree for the Moon. Meeus algorithms (what our app uses) achieve approximately 0.01-degree Sun and 0.3-degree Moon. The Swiss Ephemeris achieves sub-arcsecond precision by fitting to JPL numerical integrations. And JPL DE440 itself is accurate to milliarcseconds, calibrated by radar ranging and spacecraft tracking.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For Panchang purposes, the critical question is: does the accuracy matter? A tithi spans 12 degrees of Moon-Sun elongation. A nakshatra spans 13.33 degrees. Even the Surya Siddhanta&rsquo;s 1-degree Moon error would cause at most a 2-hour error in tithi transition time. Our Meeus-level accuracy reduces this to about 40 minutes — comparable to leading Panchang services like Drik Panchang.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Accuracy Table</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Surya Siddhanta:</span> Sun ~0.1 degree | Moon ~1 degree | Mars ~2-3 degrees</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Meeus (our app):</span> Sun ~0.01 degree | Moon ~0.3 degree | Mars ~0.5 degree</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Swiss Ephemeris:</span> All planets &lt; 0.001 degree (sub-arcsecond)</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">JPL DE440:</span> All planets ~0.000001 degree (milliarcsecond)</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">When Higher Accuracy Matters</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          For basic Panchang (tithi, nakshatra, yoga, karana), Meeus is more than sufficient. But for precise Kundali lagna calculation (which changes sign every ~2 hours), higher accuracy helps — a 0.3-degree Moon error could shift a close lagna by a few minutes. For divisional charts (D-9, D-12) where 1 degree can change the sign, Swiss Ephemeris precision becomes desirable. Our app balances practicality (no server-side ephemeris files needed) with sufficient accuracy for its use cases.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">The Unbroken Lineage</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app&rsquo;s Meeus algorithms are the intellectual descendants of the Surya Siddhanta. The same fundamental approach — compute mean position, apply periodic corrections, convert to geocentric coordinates — runs through the entire lineage. What changed is the number and precision of correction terms. The Surya Siddhanta uses one epicycle per planet; Meeus uses dozens of Fourier terms. But the architecture is recognizably the same. When you check today&rsquo;s Panchang in our app, you are using a computational tradition that is at least 1,500 years old.
        </p>
      </section>
    </div>
  );
}

export default function Module16_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

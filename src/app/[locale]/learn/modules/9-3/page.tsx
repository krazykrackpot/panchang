'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_3', phase: 3, topic: 'Kundali', moduleNumber: '9.3',
  title: { en: 'Planetary Dignities in the Chart', hi: 'कुण्डली में ग्रह गरिमाएँ' },
  subtitle: { en: 'Exaltation, debilitation, own sign, and the dignity hierarchy', hi: 'उच्च, नीच, स्वगृह, और गरिमा क्रम' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 9.1: Birth Chart Basics', hi: 'मॉड्यूल 9.1: कुण्डली की मूल बातें' }, href: '/learn/modules/9-1' },
    { label: { en: 'Module 9.2: Houses (Bhavas)', hi: 'मॉड्यूल 9.2: भाव' }, href: '/learn/modules/9-2' },
    { label: { en: 'Learn: Grahas', hi: 'सीखें: ग्रह' }, href: '/learn/grahas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q9_3_01', type: 'mcq',
    question: { en: 'In which sign is the Sun exalted?', hi: 'सूर्य किस राशि में उच्च का होता है?' },
    options: [
      { en: 'Leo', hi: 'सिंह' },
      { en: 'Aries', hi: 'मेष' },
      { en: 'Libra', hi: 'तुला' },
      { en: 'Cancer', hi: 'कर्क' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The Sun is exalted in Aries (Mesha) with deep exaltation at 10 degrees. In Aries, the Sun\'s leadership, initiative, and fiery nature find their fullest expression.', hi: 'सूर्य मेष राशि में उच्च का होता है, परम उच्च 10 अंश पर। मेष में सूर्य का नेतृत्व, पहल और अग्नि स्वभाव अपनी पूर्ण अभिव्यक्ति पाता है।' },
  },
  {
    id: 'q9_3_02', type: 'true_false',
    question: { en: 'The debilitation sign of a planet is always the 7th sign (opposite) from its exaltation sign.', hi: 'ग्रह की नीच राशि सदैव उसकी उच्च राशि से 7वीं (विपरीत) राशि होती है।' },
    correctAnswer: true,
    explanation: { en: 'This is a fundamental rule. Sun exalted in Aries (1st sign) is debilitated in Libra (7th sign). Moon exalted in Taurus is debilitated in Scorpio. Each exaltation-debilitation pair is exactly 180 degrees apart.', hi: 'यह एक मूलभूत नियम है। सूर्य मेष (1ली राशि) में उच्च, तुला (7वीं राशि) में नीच। चन्द्र वृषभ में उच्च, वृश्चिक में नीच। प्रत्येक उच्च-नीच जोड़ी ठीक 180 अंश अलग होती है।' },
  },
  {
    id: 'q9_3_03', type: 'mcq',
    question: { en: 'What is Neecha Bhanga Raja Yoga?', hi: 'नीचभंग राजयोग क्या है?' },
    options: [
      { en: 'When a debilitated planet gets cancelled and becomes powerful', hi: 'जब नीच ग्रह का नीच भंग हो और वह शक्तिशाली बन जाए' },
      { en: 'When an exalted planet loses its strength', hi: 'जब उच्च ग्रह अपनी शक्ति खो दे' },
      { en: 'When two debilitated planets conjoin', hi: 'जब दो नीच ग्रह युक्त हों' },
      { en: 'A type of financial yoga only', hi: 'केवल एक प्रकार का धन योग' },
    ],
    correctAnswer: 0,
    explanation: { en: 'Neecha Bhanga Raja Yoga occurs when a debilitated planet\'s weakness is cancelled by specific conditions (e.g., the ruler of the debilitation sign is in a Kendra). The initial weakness transforms into extraordinary strength — the "phoenix" principle.', hi: 'नीचभंग राजयोग तब होता है जब नीच ग्रह की कमजोरी विशिष्ट शर्तों से रद्द हो जाती है (जैसे, नीच राशि का स्वामी केन्द्र में हो)। प्रारम्भिक दुर्बलता असाधारण शक्ति में बदल जाती है — "फीनिक्स" सिद्धांत।' },
  },
  {
    id: 'q9_3_04', type: 'mcq',
    question: { en: 'Where is Jupiter exalted?', hi: 'बृहस्पति किस राशि में उच्च का है?' },
    options: [
      { en: 'Sagittarius', hi: 'धनु' },
      { en: 'Pisces', hi: 'मीन' },
      { en: 'Cancer', hi: 'कर्क' },
      { en: 'Virgo', hi: 'कन्या' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Jupiter is exalted in Cancer (Karka) with deep exaltation at 5 degrees. Cancer\'s nurturing, emotional, and protective qualities amplify Jupiter\'s wisdom, generosity, and expansive nature.', hi: 'बृहस्पति कर्क राशि में उच्च का है, परम उच्च 5 अंश पर। कर्क के पोषण, भावनात्मक और सुरक्षात्मक गुण बृहस्पति के ज्ञान, उदारता और विस्तारशील स्वभाव को बढ़ाते हैं।' },
  },
  {
    id: 'q9_3_05', type: 'true_false',
    question: { en: 'A planet in its Moolatrikona sign is stronger than in its own sign (Swakshetra).', hi: 'मूलत्रिकोण राशि में ग्रह अपनी स्वराशि (स्वक्षेत्र) से अधिक शक्तिशाली होता है।' },
    correctAnswer: true,
    explanation: { en: 'The dignity hierarchy is: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated. Moolatrikona is the sign where a planet performs its highest duty — slightly stronger than merely being "at home."', hi: 'गरिमा क्रम है: उच्च > मूलत्रिकोण > स्वराशि > मित्र > सम > शत्रु > नीच। मूलत्रिकोण वह राशि है जहाँ ग्रह अपना सर्वोच्च कर्तव्य निभाता है — केवल "घर पर" होने से थोड़ा अधिक शक्तिशाली।' },
  },
  {
    id: 'q9_3_06', type: 'mcq',
    question: { en: 'Saturn is exalted in which sign?', hi: 'शनि किस राशि में उच्च का है?' },
    options: [
      { en: 'Capricorn', hi: 'मकर' },
      { en: 'Aquarius', hi: 'कुम्भ' },
      { en: 'Libra', hi: 'तुला' },
      { en: 'Virgo', hi: 'कन्या' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Saturn is exalted in Libra (Tula) with deep exaltation at 20 degrees. Libra\'s qualities of balance, fairness, and justice perfectly channel Saturn\'s disciplined, karmic, and structured energy.', hi: 'शनि तुला राशि में उच्च का है, परम उच्च 20 अंश पर। तुला के संतुलन, निष्पक्षता और न्याय के गुण शनि की अनुशासित, कार्मिक और संरचित ऊर्जा को पूर्णतः प्रवाहित करते हैं।' },
  },
  {
    id: 'q9_3_07', type: 'mcq',
    question: { en: 'Which condition can create Neecha Bhanga (debilitation cancellation)?', hi: 'कौन सी स्थिति नीचभंग (नीच का भंग) बना सकती है?' },
    options: [
      { en: 'The debilitated planet is retrograde', hi: 'नीच ग्रह वक्री हो' },
      { en: 'The lord of the sign of debilitation is in a Kendra from Lagna or Moon', hi: 'नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो' },
      { en: 'The debilitated planet is conjunct Rahu', hi: 'नीच ग्रह राहु से युक्त हो' },
      { en: 'The native was born at night', hi: 'जातक का जन्म रात में हुआ हो' },
    ],
    correctAnswer: 1,
    explanation: { en: 'One of the classical Neecha Bhanga conditions from BPHS: if the lord of the sign where the planet is debilitated is placed in a Kendra (1, 4, 7, 10) from the Lagna or Moon, the debilitation is cancelled.', hi: 'BPHS से एक शास्त्रीय नीचभंग शर्त: यदि जिस राशि में ग्रह नीच है उस राशि का स्वामी लग्न या चन्द्र से केन्द्र (1, 4, 7, 10) में हो, तो नीच भंग हो जाता है।' },
  },
  {
    id: 'q9_3_08', type: 'true_false',
    question: { en: 'Venus is exalted in Pisces (Meena).', hi: 'शुक्र मीन राशि में उच्च का है।' },
    correctAnswer: true,
    explanation: { en: 'Venus is exalted in Pisces with deep exaltation at 27 degrees. Pisces\' spiritual, imaginative, and compassionate nature elevates Venus\' love, beauty, and artistic expression to their highest form.', hi: 'शुक्र मीन में उच्च का है, परम उच्च 27 अंश पर। मीन का आध्यात्मिक, कल्पनाशील और करुणामय स्वभाव शुक्र के प्रेम, सौन्दर्य और कलात्मक अभिव्यक्ति को उनके उच्चतम रूप तक ले जाता है।' },
  },
  {
    id: 'q9_3_09', type: 'mcq',
    question: { en: 'What is the correct dignity hierarchy from strongest to weakest?', hi: 'सबसे शक्तिशाली से कमजोर तक सही गरिमा क्रम क्या है?' },
    options: [
      { en: 'Own > Exalted > Friend > Neutral > Enemy > Debilitated', hi: 'स्व > उच्च > मित्र > सम > शत्रु > नीच' },
      { en: 'Exalted > Moolatrikona > Own > Friend > Neutral > Enemy > Debilitated', hi: 'उच्च > मूलत्रिकोण > स्व > मित्र > सम > शत्रु > नीच' },
      { en: 'Moolatrikona > Exalted > Own > Friend > Neutral > Debilitated', hi: 'मूलत्रिकोण > उच्च > स्व > मित्र > सम > नीच' },
      { en: 'Exalted > Own > Debilitated > Neutral > Friend', hi: 'उच्च > स्व > नीच > सम > मित्र' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The seven-tier dignity hierarchy determines a planet\'s ability to deliver its promised results. Exaltation is the peak, Moolatrikona just below, own sign provides comfort, and debilitation is the lowest rung.', hi: 'सात-स्तरीय गरिमा क्रम ग्रह की प्रतिश्रुत फल देने की क्षमता निर्धारित करता है। उच्च शिखर है, मूलत्रिकोण उसके ठीक नीचे, स्वराशि सुविधा देती है, और नीच सबसे निम्न स्तर है।' },
  },
  {
    id: 'q9_3_10', type: 'true_false',
    question: { en: 'Mars is exalted in Capricorn and debilitated in Cancer.', hi: 'मंगल मकर में उच्च और कर्क में नीच होता है।' },
    correctAnswer: true,
    explanation: { en: 'Mars is exalted in Capricorn (deep exaltation at 28 degrees) where Saturn\'s disciplined, structured environment channels Mars\' raw energy productively. In Cancer, the emotional, receptive environment weakens Mars\' assertive nature.', hi: 'मंगल मकर में उच्च है (परम उच्च 28 अंश) जहाँ शनि का अनुशासित, संरचित वातावरण मंगल की कच्ची ऊर्जा को उत्पादक रूप से प्रवाहित करता है। कर्क में भावनात्मक, ग्रहणशील वातावरण मंगल के आक्रामक स्वभाव को कमजोर करता है।' },
  },
];

/* ─── Page 1: Exaltation (Uccha) ─────────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'उच्च — ग्रह की शिखर शक्ति' : 'Exaltation (Uccha) — Peak Planetary Strength'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक ग्रह की एक विशिष्ट राशि होती है जहाँ वह अपने गुणों को अधिकतम शक्ति और स्पष्टता से व्यक्त करता है — यह उसकी उच्च राशि है। इसे ऐसे समझें कि ग्रह एक सम्मानित अतिथि है ऐसे गृहस्वामी के घर में जहाँ सब कुछ उसके स्वभाव से पूर्णतः मेल खाता है। उच्च ग्रह अपनी सूचकताएँ प्रचुर मात्रा में और सहजता से प्रदान करता है।</> : <>Every planet has one specific sign where it expresses its qualities with maximum power and clarity — this is its sign of exaltation (Uccha Rashi). Think of it as the planet being an honored guest in a host&apos;s home where everything aligns perfectly with its nature. An exalted planet delivers its significations abundantly and with ease.</>}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-gold-light text-left p-2">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'उच्च' : 'Exalted In'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'परम उच्च' : 'Deep Exaltation'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'कारण' : 'Why'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'सूर्य' : 'Sun'}</td><td className="p-2">{isHi ? 'मेष' : 'Aries'}</td><td className="p-2">10°</td><td className="p-2">Fire + initiative = peak authority</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'चन्द्र' : 'Moon'}</td><td className="p-2">{isHi ? 'वृषभ' : 'Taurus'}</td><td className="p-2">3°</td><td className="p-2">Earth stability nourishes emotions</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'मंगल' : 'Mars'}</td><td className="p-2">{isHi ? 'मकर' : 'Capricorn'}</td><td className="p-2">28°</td><td className="p-2">Discipline channels raw courage</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बुध' : 'Mercury'}</td><td className="p-2">{isHi ? 'कन्या' : 'Virgo'}</td><td className="p-2">15°</td><td className="p-2">Analytical sign perfects intellect</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बृहस्पति' : 'Jupiter'}</td><td className="p-2">{isHi ? 'कर्क' : 'Cancer'}</td><td className="p-2">5°</td><td className="p-2">Nurturing amplifies wisdom</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'शुक्र' : 'Venus'}</td><td className="p-2">{isHi ? 'मीन' : 'Pisces'}</td><td className="p-2">27°</td><td className="p-2">Spiritual love = highest beauty</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'शनि' : 'Saturn'}</td><td className="p-2">{isHi ? 'तुला' : 'Libra'}</td><td className="p-2">20°</td><td className="p-2">Justice + balance = ideal discipline</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'राहु' : 'Rahu'}</td><td className="p-2">{isHi ? 'वृषभ*' : 'Taurus'}</td><td className="p-2">20°</td><td className="p-2">Material mastery (per BPHS)</td></tr>
              <tr><td className="p-2">{isHi ? 'केतु' : 'Ketu'}</td><td className="p-2">{isHi ? 'वृश्चिक*' : 'Scorpio'}</td><td className="p-2">20°</td><td className="p-2">Occult depth (per BPHS)</td></tr>
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-1">{isHi ? <>* राहु/केतु का उच्च परम्परा अनुसार भिन्न है। कुछ मिथुन/धनु मानते हैं। BPHS वृषभ/वृश्चिक का समर्थन करता है।</> : <>* Rahu/Ketu exaltation varies by tradition. Some use Gemini/Sagittarius. BPHS supports Taurus/Scorpio.</>}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>उच्च अंश BPHS अध्याय 3 (श्लोक 51) और फलदीपिका अध्याय 2 में सूचीबद्ध हैं। ये विशिष्ट राशि-अंश संयोजन सभी ज्योतिष परम्पराओं में 2000 से अधिक वर्षों से अपरिवर्तित हैं। परम उच्च अंश वह है जहाँ ग्रह पूर्ण अधिकतम शक्ति पर पहुँचता है — ठीक 10° मेष सूर्य या 5° कर्क बृहस्पति अपने शिखर पर होता है।</> : <>Exaltation degrees are listed in BPHS Chapter 3 (Shloka 51) and Phaladeepika Chapter 2. These specific sign-degree combinations have remained unchanged for over 2000 years across all Jyotish traditions. The deep exaltation degree is where the planet reaches absolute maximum potency — a planet at exactly 10° Aries Sun or 5° Cancer Jupiter is at its peak.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Debilitation and Neecha Bhanga ─────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'नीच और उसका भंग' : 'Debilitation (Neecha) and Its Cancellation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>नीच राशि उच्च से ठीक विपरीत (180°) होती है। यहाँ ग्रह दुर्बल होता है — अपने स्वाभाविक गुणों को व्यक्त करने में संघर्ष करता है। तुला में नीच सूर्य समझौते की राशि में अपना निर्णायक अधिकार खो देता है। कर्क में नीच मंगल भावनात्मक, पोषण वातावरण में आक्रामकता को उत्पादक रूप से प्रवाहित नहीं कर पाता।</> : <>The debilitation sign is exactly opposite (180°) from exaltation. Here the planet is weakened — it struggles to express its natural qualities. Sun debilitated in Libra loses its decisive authority in the sign of compromise. Mars debilitated in Cancer cannot channel aggression productively in the emotional, nurturing environment.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          However, Jyotish provides a remarkable escape clause: <strong className="text-gold-light">Neecha Bhanga</strong> (cancellation of debilitation). Five classical conditions from BPHS can cancel the weakness:
        </p>
        <div className="space-y-1.5 text-xs text-text-secondary mb-3">{isHi ? <><p>1. नीच राशि का स्वामी लग्न या चन्द्र से केन्द्र में हो</p>
          <p>2. जिस राशि में नीच ग्रह उच्च होता है उसका स्वामी लग्न या चन्द्र से केन्द्र में हो</p>
          <p>3. नीच ग्रह पर उसकी नीच राशि के स्वामी की दृष्टि हो</p>
          <p>4. नीच ग्रह नवमांश कुण्डली में उच्च का हो</p>
          <p>5. नीच ग्रह किसी उच्च ग्रह से युक्त हो</p></> : <><p>1. The lord of the debilitation sign is in a Kendra from Lagna or Moon</p>
          <p>2. The lord of the sign where the debilitated planet gets exalted is in a Kendra from Lagna or Moon</p>
          <p>3. The debilitated planet is aspected by its debilitation sign lord</p>
          <p>4. The debilitated planet is exalted in the Navamsha chart</p>
          <p>5. The debilitated planet is conjoined with an exalted planet</p></>}</div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण: नीचभंग' : 'Worked Example: Neecha Bhanga'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> बृहस्पति मकर में नीच, सप्तम भाव में। मकर का स्वामी शनि है। यदि शनि केन्द्र में हो (मान लें, दशम भाव में मेष में), तो शर्त 1 पूरी होती है — नीचभंग होता है। प्रारम्भ में दुर्बल बृहस्पति शक्तिशाली बल में बदल जाता है। जातक को प्रारम्भ में संबंधों में चुनौतियाँ हो सकती हैं (नीच सप्तम भाव बृहस्पति), लेकिन अंततः प्रारम्भिक बाधाओं को पार करके एक असाधारण अर्थपूर्ण साझेदारी प्राप्त करता है।</> : <><span className="text-gold-light font-medium">Example:</span> Jupiter is debilitated in Capricorn in the 7th house. Capricorn is ruled by Saturn. If Saturn is placed in a Kendra (say, the 10th house in Aries), condition 1 is met — Neecha Bhanga occurs. The initially weak Jupiter transforms into a powerful force. The native may initially face relationship challenges (debilitated 7th house Jupiter), but ultimately achieves an exceptionally meaningful partnership after overcoming early obstacles.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रांतियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;नीच ग्रह का अर्थ है कि वह जीवन क्षेत्र बर्बाद है।&quot; यह दो स्तरों पर गलत है। पहला, नीचभंग की शर्तें बहुत सामान्य हैं — अधिकांश कुण्डलियों में कम से कम एक भंग होता है। दूसरा, भंग के बिना भी, नीच ग्रह ऐसी चुनौतियाँ उत्पन्न करता है जो विकास के लिए बाध्य करती हैं। कई अत्यंत सफल लोगों के पास नीच ग्रह होते हैं जो क्षतिपूर्ति के संघर्ष से उनकी महत्वाकांक्षा को संचालित करते हैं।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;A debilitated planet means that life area is doomed.&quot; This is wrong on two levels. First, Neecha Bhanga conditions are very common — most charts have at least one cancellation. Second, even without cancellation, a debilitated planet produces challenges that force growth. Many highly successful people have debilitated planets driving their ambition through the struggle to compensate.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Own Sign, Moolatrikona, and Dignity Hierarchy ──────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'स्वराशि, मूलत्रिकोण, और पूर्ण क्रम' : 'Own Sign, Moolatrikona, and the Full Hierarchy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>उच्च और नीच के चरम बिन्दुओं के बीच पाँच मध्यवर्ती गरिमा स्तर हैं। <strong className="text-gold-light">स्वराशि (स्वक्षेत्र)</strong> में ग्रह घर पर होने जैसा है — सुविधाजनक, उत्पादक, आत्मनिर्भर। मेष या वृश्चिक में मंगल, वृषभ या तुला में शुक्र, धनु या मीन में बृहस्पति सभी स्वराशि में हैं। <strong className="text-gold-light">मूलत्रिकोण</strong> राशि में ग्रह अपने &quot;कार्यालय&quot; में है — वह राशि जहाँ वह अपना सबसे आवश्यक कार्य केन्द्रित दक्षता से करता है। यह स्वराशि से थोड़ा अधिक शक्तिशाली है।</> : <>Between the extremes of exaltation and debilitation lie five intermediate dignity levels. A planet in its <strong className="text-gold-light">own sign (Swakshetra)</strong> is like being at home — comfortable, productive, self-sufficient. Mars in Aries or Scorpio, Venus in Taurus or Libra, Jupiter in Sagittarius or Pisces are all in their own signs. A planet in its <strong className="text-gold-light">Moolatrikona</strong> sign is at its &quot;office&quot; — the sign where it performs its most essential function with focused efficiency. This is slightly stronger than own sign.</>}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-gold-light text-left p-2">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'मूलत्रिकोण' : 'Moolatrikona'}</th>
                <th className="text-gold-light text-left p-2">{isHi ? 'स्वराशि' : 'Own Signs'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'सूर्य' : 'Sun'}</td><td className="p-2">Leo 0°-20°</td><td className="p-2">{isHi ? 'सिंह' : 'Leo'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'चन्द्र' : 'Moon'}</td><td className="p-2">Taurus 4°-20°</td><td className="p-2">{isHi ? 'कर्क' : 'Cancer'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'मंगल' : 'Mars'}</td><td className="p-2">Aries 0°-12°</td><td className="p-2">{isHi ? 'मेष, वृश्चिक' : 'Aries, Scorpio'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बुध' : 'Mercury'}</td><td className="p-2">Virgo 16°-20°</td><td className="p-2">{isHi ? 'मिथुन, कन्या' : 'Gemini, Virgo'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'बृहस्पति' : 'Jupiter'}</td><td className="p-2">Sagittarius 0°-10°</td><td className="p-2">{isHi ? 'धनु, मीन' : 'Sagittarius, Pisces'}</td></tr>
              <tr className="border-b border-white/5"><td className="p-2">{isHi ? 'शुक्र' : 'Venus'}</td><td className="p-2">Libra 0°-15°</td><td className="p-2">{isHi ? 'वृषभ, तुला' : 'Taurus, Libra'}</td></tr>
              <tr><td className="p-2">{isHi ? 'शनि' : 'Saturn'}</td><td className="p-2">Aquarius 0°-20°</td><td className="p-2">{isHi ? 'मकर, कुम्भ' : 'Capricorn, Aquarius'}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3 mt-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'मित्र और शत्रु राशियाँ' : 'Friend and Enemy Signs'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहों की प्राकृतिक मित्रता और शत्रुता होती है। बृहस्पति और सूर्य मित्र हैं — सिंह (सूर्य की राशि) में बृहस्पति सुविधाजनक है। शुक्र और सूर्य शत्रु हैं — सिंह में शुक्र असहज है। BPHS का <strong className="text-gold-light">पंचधा मैत्री</strong> (पाँच-स्तरीय संबंध) प्रणाली परिभाषित करती है: अधि मित्र, मित्र, सम, शत्रु, अधि शत्रु। ये गरिमा को संशोधित करती हैं: मित्र राशि में ग्रह शत्रु राशि की तुलना में अधिक प्रभावी होता है, भले ही कोई भी उच्च या नीच न हो।</> : <>Planets have natural friendships and enmities. Jupiter and Sun are friends — Jupiter in Leo (Sun&apos;s sign) is comfortable. Venus and Sun are enemies — Venus in Leo is uneasy. The <strong className="text-gold-light">Panchadha Maitri</strong> (five-fold relationship) system from BPHS defines: intimate friend, friend, neutral, enemy, bitter enemy. These modify the dignity: a planet in a friendly sign is more effective than in an enemy sign, even if neither is exalted or debilitated.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पूर्ण गरिमा क्रम' : 'The Complete Hierarchy'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>शक्तिशाली से कमजोर: <strong className="text-gold-light">उच्च</strong> (ग्रह शिखर शक्ति पर) &gt; <strong className="text-gold-light">मूलत्रिकोण</strong> (केन्द्रित कर्तव्य) &gt; <strong className="text-gold-light">स्वराशि</strong> (सुविधाजनक) &gt; <strong className="text-gold-light">मित्र राशि</strong> (स्वागत अतिथि) &gt; <strong className="text-gold-light">सम राशि</strong> (उदासीन) &gt; <strong className="text-gold-light">शत्रु राशि</strong> (अस्वागत अतिथि) &gt; <strong className="text-gold-light">नीच</strong> (ग्रह सबसे कमजोर)।</> : <>From strongest to weakest: <strong className="text-gold-light">Exalted</strong> (planet at peak power) &gt; <strong className="text-gold-light">Moolatrikona</strong> (focused duty) &gt; <strong className="text-gold-light">Own Sign</strong> (comfortable) &gt; <strong className="text-gold-light">Friend&apos;s Sign</strong> (welcome guest) &gt; <strong className="text-gold-light">Neutral Sign</strong> (indifferent) &gt; <strong className="text-gold-light">Enemy&apos;s Sign</strong> (unwelcome guest) &gt; <strong className="text-gold-light">Debilitated</strong> (planet at weakest).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन स्वचालित रूप से आपकी कुण्डली में प्रत्येक ग्रह की गरिमा का मूल्यांकन करता है। टिप्पणी उच्च और नीच ग्रहों की पहचान करती है, नीचभंग शर्तों की जाँच करती है, और समझाती है कि गरिमा प्रत्येक ग्रह की अपने भाव में फल देने की क्षमता को कैसे प्रभावित करती है। यह षड्बल शक्ति मूल्यांकन में एकीकृत है।</> : <>Our Kundali engine automatically evaluates every planet&apos;s dignity in your chart. The tippanni commentary identifies exalted and debilitated planets, checks for Neecha Bhanga conditions, and explains how dignity affects each planet&apos;s ability to deliver results in its house. This is integrated into the Shadbala strength assessment for a complete picture of planetary power.</>}</p>
      </section>
    </div>
  );
}

export default function Module9_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

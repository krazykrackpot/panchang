'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_18_1', phase: 5, topic: 'Strength', moduleNumber: '18.1',
  title: {
    en: 'Shadbala — The 6-Fold Planetary Strength',
    hi: 'षड्बल — ग्रहों की छह प्रकार की शक्ति',
  },
  subtitle: {
    en: 'How Jyotish quantifies planetary power through positional, directional, temporal, motional, natural, and aspectual strength into a single composite score',
    hi: 'ज्योतिष किस प्रकार स्थान, दिक्, काल, चेष्टा, नैसर्गिक और दृग्बल द्वारा ग्रह शक्ति को एकल समग्र अंक में परिमाणित करता है',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 18-2: Bhavabala — House Strength', hi: 'मॉड्यूल 18-2: भावबल — भाव शक्ति' }, href: '/learn/modules/18-2' },
    { label: { en: 'Module 18-3: Ashtakavarga — Bindu Scoring', hi: 'मॉड्यूल 18-3: अष्टकवर्ग — बिन्दु अंकन' }, href: '/learn/modules/18-3' },
    { label: { en: 'Module 18-5: Vimshopaka — Divisional Strength', hi: 'मॉड्यूल 18-5: विंशोपक — वर्गीय बल' }, href: '/learn/modules/18-5' },
    { label: { en: 'Kundali Tool', hi: 'कुण्डली उपकरण' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q18_1_01', type: 'mcq',
    question: {
      en: 'How many types of strength make up Shadbala?',
      hi: 'षड्बल में कितने प्रकार की शक्ति सम्मिलित होती है?',
    },
    options: [
      { en: '4', hi: '4' },
      { en: '6', hi: '6' },
      { en: '8', hi: '8' },
      { en: '12', hi: '12' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shadbala literally means "six strengths." The six components are Sthana (positional), Dig (directional), Kala (temporal), Cheshta (motional), Naisargika (natural), and Drig (aspectual) bala.',
      hi: 'षड्बल का शाब्दिक अर्थ है "छह शक्तियाँ।" छह घटक हैं: स्थानबल (स्थिति), दिग्बल (दिशा), कालबल (समय), चेष्टाबल (गति), नैसर्गिकबल (प्राकृतिक) और दृग्बल (दृष्टि)।',
    },
  },
  {
    id: 'q18_1_02', type: 'mcq',
    question: {
      en: 'In Dig Bala, which direction gives maximum strength to Jupiter and Mercury?',
      hi: 'दिग्बल में बृहस्पति और बुध को किस दिशा से अधिकतम बल प्राप्त होता है?',
    },
    options: [
      { en: 'South (10th house)', hi: 'दक्षिण (दशम भाव)' },
      { en: 'East (1st house/Lagna)', hi: 'पूर्व (प्रथम भाव/लग्न)' },
      { en: 'West (7th house)', hi: 'पश्चिम (सप्तम भाव)' },
      { en: 'North (4th house)', hi: 'उत्तर (चतुर्थ भाव)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jupiter and Mercury gain maximum Dig Bala in the East (1st house/Lagna). Sun and Mars are strongest in the South (10th), Saturn in the West (7th), and Moon and Venus in the North (4th).',
      hi: 'बृहस्पति और बुध को पूर्व (लग्न) में अधिकतम दिग्बल प्राप्त होता है। सूर्य और मंगल दक्षिण (दशम) में, शनि पश्चिम (सप्तम) में, और चन्द्र व शुक्र उत्तर (चतुर्थ) में सबसे बलवान होते हैं।',
    },
  },
  {
    id: 'q18_1_03', type: 'true_false',
    question: {
      en: 'A retrograde planet gains additional Cheshta Bala (motional strength) in Shadbala.',
      hi: 'वक्री ग्रह को षड्बल में अतिरिक्त चेष्टाबल (गति शक्ति) प्राप्त होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In Cheshta Bala, a retrograde planet is considered to have high motional strength because apparent backward motion indicates the planet is closest to Earth and thus exerts maximum influence. Retrograde = 60 shashtiamsas, direct = 30.',
      hi: 'सत्य। चेष्टाबल में वक्री ग्रह को उच्च गति शक्ति माना जाता है क्योंकि प्रत्यक्ष पश्चगति इंगित करती है कि ग्रह पृथ्वी के निकटतम है और अधिकतम प्रभाव डालता है। वक्री = 60 षष्ट्यंश, मार्गी = 30।',
    },
  },
  {
    id: 'q18_1_04', type: 'mcq',
    question: {
      en: 'What is the minimum Shadbala threshold (in rupas) for a planet to be considered effective?',
      hi: 'ग्रह को प्रभावी मानने के लिए न्यूनतम षड्बल सीमा (रूपा में) क्या है?',
    },
    options: [
      { en: '0.5 rupa', hi: '0.5 रूपा' },
      { en: '1.0 rupa', hi: '1.0 रूपा' },
      { en: '2.0 rupas', hi: '2.0 रूपा' },
      { en: '5.0 rupas', hi: '5.0 रूपा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A planet needs at least 1.0 rupa (= 60 shashtiamsas) of total Shadbala to be considered minimally effective. Different planets have different ideal thresholds, but 1.0 is the universal minimum. Sun/Mars need 5.0+, Moon 6.0+, Mercury 7.0+, Jupiter 6.5+, Venus 5.5+, Saturn 5.0+.',
      hi: 'एक ग्रह को न्यूनतम प्रभावी मानने के लिए कम से कम 1.0 रूपा (= 60 षष्ट्यंश) कुल षड्बल चाहिए। विभिन्न ग्रहों की अलग-अलग आदर्श सीमाएँ हैं, लेकिन 1.0 सार्वभौमिक न्यूनतम है।',
    },
  },
  {
    id: 'q18_1_05', type: 'mcq',
    question: {
      en: 'Sthana Bala (positional strength) consists of how many sub-components?',
      hi: 'स्थानबल (स्थिति शक्ति) में कितने उप-घटक होते हैं?',
    },
    options: [
      { en: '3', hi: '3' },
      { en: '5', hi: '5' },
      { en: '7', hi: '7' },
      { en: '9', hi: '9' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sthana Bala has 5 sub-components: Uccha Bala (exaltation strength), Saptavargaja Bala (7-divisional chart strength), Ojha-Yugma Bala (odd-even sign/navamsha), Kendradi Bala (angular placement), and Drekkana Bala (decanate placement).',
      hi: 'स्थानबल के 5 उप-घटक हैं: उच्चबल (उच्च शक्ति), सप्तवर्गज बल (7 वर्ग कुण्डली शक्ति), ओजा-युग्म बल (विषम-सम राशि/नवमांश), केन्द्रादि बल (कोणीय स्थिति), और द्रेक्काण बल (दशमांश स्थिति)।',
    },
  },
  {
    id: 'q18_1_06', type: 'true_false',
    question: {
      en: 'In Naisargika Bala (natural strength), Saturn is the strongest planet.',
      hi: 'नैसर्गिकबल (प्राकृतिक शक्ति) में शनि सबसे बलवान ग्रह है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. In Naisargika Bala, the Sun is the strongest (60 shashtiamsas) and Saturn is the weakest (8.57 shashtiamsas). The order is: Sun > Moon > Venus > Jupiter > Mercury > Mars > Saturn. This is a fixed value that never changes.',
      hi: 'असत्य। नैसर्गिकबल में सूर्य सबसे बलवान (60 षष्ट्यंश) और शनि सबसे दुर्बल (8.57 षष्ट्यंश) है। क्रम है: सूर्य > चन्द्र > शुक्र > बृहस्पति > बुध > मंगल > शनि। यह एक स्थिर मान है जो कभी नहीं बदलता।',
    },
  },
  {
    id: 'q18_1_07', type: 'mcq',
    question: {
      en: 'Mars in Capricorn (its exaltation sign) receives how many shashtiamsas of Uccha Bala?',
      hi: 'मंगल मकर (अपनी उच्च राशि) में कितने षष्ट्यंश उच्चबल प्राप्त करता है?',
    },
    options: [
      { en: '0', hi: '0' },
      { en: '30', hi: '30' },
      { en: '60', hi: '60' },
      { en: '120', hi: '120' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'A planet at its exact exaltation degree receives the maximum 60 shashtiamsas of Uccha Bala. Mars exalted in Capricorn (at 28 degrees) gets 60. At the debilitation point (Cancer 28 degrees), it would get 0. Other positions are proportional.',
      hi: 'अपने सटीक उच्च अंश पर ग्रह को अधिकतम 60 षष्ट्यंश उच्चबल प्राप्त होता है। मकर में उच्च मंगल (28 अंश पर) को 60 मिलते हैं। नीच बिन्दु (कर्क 28 अंश) पर 0 मिलेगा। अन्य स्थितियाँ आनुपातिक हैं।',
    },
  },
  {
    id: 'q18_1_08', type: 'mcq',
    question: {
      en: 'What does Drig Bala measure?',
      hi: 'दृग्बल क्या मापता है?',
    },
    options: [
      { en: 'Strength from planetary aspects received', hi: 'प्राप्त ग्रह दृष्टियों से शक्ति' },
      { en: 'Strength from house placement', hi: 'भाव स्थिति से शक्ति' },
      { en: 'Strength from the time of day', hi: 'दिन के समय से शक्ति' },
      { en: 'Strength from combustion', hi: 'अस्त से शक्ति' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Drig Bala (aspectual strength) measures the net effect of aspects received by a planet. Benefic aspects (from Jupiter, Venus, strong Mercury, waxing Moon) add strength, while malefic aspects (from Saturn, Mars, Rahu) subtract from it.',
      hi: 'दृग्बल (दृष्टि शक्ति) ग्रह को प्राप्त दृष्टियों के शुद्ध प्रभाव को मापता है। शुभ दृष्टियाँ (बृहस्पति, शुक्र, बलवान बुध, शुक्ल चन्द्र से) शक्ति जोड़ती हैं, जबकि पापी दृष्टियाँ (शनि, मंगल, राहु से) घटाती हैं।',
    },
  },
  {
    id: 'q18_1_09', type: 'true_false',
    question: {
      en: 'The planet with the highest total Shadbala in a chart is often called the "captain" of the horoscope.',
      hi: 'कुण्डली में सर्वाधिक कुल षड्बल वाले ग्रह को प्रायः कुण्डली का "कप्तान" कहा जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The strongest planet by Shadbala dominates the chart and strongly colours the native\'s personality and life direction. It is the planet whose significations manifest most powerfully and reliably in the person\'s life.',
      hi: 'सत्य। षड्बल द्वारा सबसे बलवान ग्रह कुण्डली पर प्रभुत्व रखता है और जातक के व्यक्तित्व एवं जीवन दिशा को प्रबलता से प्रभावित करता है। यह वह ग्रह है जिसके कारकत्व जातक के जीवन में सबसे शक्तिशाली रूप से प्रकट होते हैं।',
    },
  },
  {
    id: 'q18_1_10', type: 'mcq',
    question: {
      en: 'Which scenario does Shadbala help resolve?',
      hi: 'षड्बल किस परिस्थिति को सुलझाने में सहायता करता है?',
    },
    options: [
      { en: 'A planet that is both exalted and combust', hi: 'ग्रह जो उच्च भी हो और अस्त भी' },
      { en: 'Choosing between two wedding dates', hi: 'दो विवाह तिथियों में से चयन' },
      { en: 'Finding the birth nakshatra', hi: 'जन्म नक्षत्र ज्ञात करना' },
      { en: 'Calculating Ayanamsha', hi: 'अयनांश की गणना' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Shadbala resolves contradictions like a planet being exalted (high Sthana Bala) but combust (reduced Drig Bala), or in its own sign but in a dusthana. The total score reveals whether the planet is net-strong or net-weak despite mixed indicators.',
      hi: 'षड्बल उन विरोधाभासों को सुलझाता है जैसे ग्रह उच्च हो (उच्च स्थानबल) पर अस्त भी हो (घटा दृग्बल), या स्वराशि में हो पर दुःस्थान में। कुल अंक दर्शाता है कि मिश्रित संकेतकों के बावजूद ग्रह शुद्ध-बलवान है या शुद्ध-दुर्बल।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'षड्बल क्या है?' : 'What is Shadbala?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'षड्बल (\u201Cछह शक्तियाँ\u201D) वैदिक ज्योतिष में ग्रह की वास्तविक शक्ति को परिमाणित करने की सर्वाधिक व्यापक पद्धति है। कोई ग्रह उच्च में हो सकता है पर अस्त भी, या स्वराशि में हो पर दुःस्थान में। षड्बल छह स्वतन्त्र माप गणनाओं को जोड़कर एकल समग्र अंक (षष्ट्यंश में) देता है जो इन विरोधाभासों को सुलझाता है।'
            : 'Shadbala (\u201Csix strengths\u201D) is the most comprehensive system in Vedic astrology for quantifying how powerful a planet truly is. A planet may sit in exaltation yet be combust, or occupy its own sign yet languish in a dusthana house. Shadbala resolves these contradictions by computing six independent measurements and summing them into a single composite score measured in shashtiamsas (sixtieths of a rupa).'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>छह घटक हैं: <strong>स्थानबल</strong> (स्थिति) — 5 उप-भाग: उच्च, सप्तवर्गज, ओजा-युग्म, केन्द्रादि, द्रेक्काण। <strong>दिग्बल</strong> (दिशा) — बृहस्पति/बुध पूर्व में, सूर्य/मंगल दक्षिण में, शनि पश्चिम में, चन्द्र/शुक्र उत्तर में सबसे बलवान। <strong>कालबल</strong> (समय) — दिवस/रात्रि स्वामित्व, होरा, मास/वर्ष स्वामी। <strong>चेष्टाबल</strong> (गति) — वक्री ग्रह को अधिकतम शक्ति। <strong>नैसर्गिकबल</strong> (प्राकृतिक) — स्थिर मान, सूर्य सबसे बलवान, शनि सबसे दुर्बल। <strong>दृग्बल</strong> (दृष्टि) — शुभ दृष्टि जोड़ती है, पापी दृष्टि घटाती है। न्यूनतम प्रभावी सीमा 1.0 रूपा (60 षष्ट्यंश) है।</>
            : <>The six components are: <strong>Sthana Bala</strong> (positional) with 5 sub-parts &mdash; Uccha (exaltation), Saptavargaja (7 divisional charts), Ojha-Yugma (odd/even sign), Kendradi (angular placement), Drekkana (decanate). <strong>Dig Bala</strong> (directional) &mdash; Jupiter/Mercury strongest in the East (lagna), Sun/Mars in the South (10th), Saturn in the West (7th), Moon/Venus in the North (4th). <strong>Kala Bala</strong> (temporal) &mdash; day/night rulership, hora lord, month/year lords. <strong>Cheshta Bala</strong> (motional) &mdash; retrograde planets gain maximum strength. <strong>Naisargika Bala</strong> (natural) &mdash; fixed values, Sun strongest, Saturn weakest. <strong>Drig Bala</strong> (aspectual) &mdash; benefic aspects add, malefic aspects subtract.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उद्गम' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'षड्बल का उद्गम पराशर की बृहत् पाराशर होरा शास्त्र (BPHS), अध्याय 27-30 से है, जहाँ महर्षि पराशर ने प्रत्येक बल घटक को व्यवस्थित रूप से परिभाषित किया। इस पद्धति को बाद में वराहमिहिर ने बृहत् जातक में और नीलकण्ठ ने ताजिक नीलकण्ठी में परिष्कृत किया। षड्बल की गणितीय सटीकता प्राचीन भारतीय विद्वानों की प्रायोगिक खगोलीय परम्परा को दर्शाती है।'
            : 'Shadbala originates from Parashara\u2019s Brihat Parashara Hora Shastra (BPHS), chapters 27-30, where Maharishi Parashara systematically defines each strength component. The system was later refined by Varahamihira in Brihat Jataka and by Nilakantha in Tajika Neelakanthi. The mathematical precision of Shadbala reflects the empirical astronomical tradition of ancient Indian scholars who sought to move beyond subjective judgment to measurable planetary potency.'}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'प्रत्येक घटक की गणना' : 'Computing Each Component'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'आइये मकर राशि (उच्च) में दशम भाव में स्थित मंगल के लिए एक ठोस गणना देखें। छह में से प्रत्येक घटक कुल अंक में स्वतन्त्र रूप से योगदान करता है।'
            : 'Let us walk through a concrete calculation for Mars in Capricorn (exalted) placed in the 10th house of a daytime chart. Each of the six components contributes independently to the total score.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>स्थानबल:</strong> उच्चबल — मंगल 28&deg; मकर (सटीक उच्च अंश) पर = 60 षष्ट्यंश। यह अधिकतम है। नीच बिन्दु (28&deg; कर्क) पर 0 होगा। सूत्र रैखिक है: शक्ति = 60 &times; (180 &minus; उच्च से दूरी) / 180।</>
            : <><strong>Sthana Bala (positional):</strong> Uccha Bala &mdash; Mars at 28&deg; Capricorn (exact exaltation degree) = 60 shashtiamsas. This is the maximum. At its debilitation point (28&deg; Cancer) it would score 0. The formula is linear: strength = 60 &times; (180 &minus; distance from exaltation) / 180.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>दिग्बल:</strong> मंगल को दक्षिण (दशम भाव) में अधिकतम दिग्बल = 60 षष्ट्यंश मिलता है। विपरीत दिशा उत्तर (चतुर्थ भाव) में 0 होगा। हमारा मंगल दशम में है, अतः पूरे 60 अंक।</>
            : <><strong>Dig Bala (directional):</strong> Mars gains maximum Dig Bala in the South (10th house) = 60 shashtiamsas. In the opposite direction, North (4th house), it would score 0. Since our Mars IS in the 10th house, full 60 points.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><strong>कालबल:</strong> मंगल रात्रिचर ग्रह है, अतः रात्रि कुण्डली में शक्ति प्राप्त करता है। दिवस कुण्डली में कम कालबल — लगभग 30 षष्ट्यंश। <strong>चेष्टाबल:</strong> यदि मंगल मार्गी (वक्री नहीं), मध्यम गति शक्ति ~30। <strong>नैसर्गिकबल:</strong> मंगल का स्थिर प्राकृतिक बल 17.14 षष्ट्यंश (7 ग्रहों में 6ठा)। <strong>दृग्बल:</strong> प्राप्त दृष्टियों पर निर्भर — बृहस्पति दृष्टि +15; शनि दृष्टि -15। काल्पनिक शुद्ध: +10।</>
            : <><strong>Kala Bala:</strong> Mars is a nocturnal planet, so it gains strength in a night chart. In a daytime chart, it gets reduced Kala Bala &mdash; approximately 30 shashtiamsas instead of 60. <strong>Cheshta Bala:</strong> If Mars is direct (not retrograde), moderate motional strength of ~30. <strong>Naisargika Bala:</strong> Mars has a fixed natural strength of 17.14 shashtiamsas (6th of 7 planets). <strong>Drig Bala:</strong> Depends on aspects received &mdash; if Jupiter aspects this Mars, add ~15; if Saturn aspects, subtract ~15. Hypothetical net: +10.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यरत उदाहरण' : 'Worked Example'}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [2], 2: [4] }}
          title={isHi ? 'मेष लग्न — मंगल दशम में (मकर), बृहस्पति द्वितीय में' : 'Aries Lagna — Mars in 10th (Capricorn), Jupiter in 2nd'}
          highlight={[10, 2]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'मंगल मकर में, दशम भाव, दिवस कुण्डली, मार्गी गति, बृहस्पति दृष्टि:' : 'Mars in Capricorn, 10th house, daytime chart, direct motion, Jupiter aspecting:'}</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{isHi ? 'स्थानबल: ~150 (उच्च 60 + सप्तवर्गज ~50 + ओजा-युग्म ~15 + केन्द्रादि ~15 + द्रेक्काण ~10)' : 'Sthana Bala: ~150 (Uccha 60 + Saptavargaja ~50 + Ojha-Yugma ~15 + Kendradi ~15 + Drekkana ~10)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{isHi ? 'दिग्बल: 60 (दशम भाव = दक्षिण = मंगल हेतु अधिकतम)' : 'Dig Bala: 60 (10th house = South = maximum for Mars)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{isHi ? 'कालबल: ~95 (दिवस-रात्रि ~30 + होरा ~10 + मास ~20 + वर्ष ~20 + अन्य ~15)' : 'Kala Bala: ~95 (day-night ~30 + hora ~10 + month ~20 + year ~20 + other ~15)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{isHi ? 'चेष्टाबल: ~30 (मार्गी गति, मध्यम वेग)' : 'Cheshta Bala: ~30 (direct motion, moderate speed)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{isHi ? 'नैसर्गिकबल: 17.14 (मंगल का स्थिर मान)' : 'Naisargika Bala: 17.14 (fixed value for Mars)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? 'दृग्बल: ~10 (बृहस्पति दृष्टि +15, लघु पापी दृष्टि -5)' : 'Drig Bala: ~10 (Jupiter aspect +15, minor malefic aspect -5)'}</p>
        <p className="text-text-secondary text-xs leading-relaxed font-medium">
          {isHi
            ? <><span className="text-gold-light">कुल: ~362 षष्ट्यंश = 6.03 रूपा।</span> मंगल की न्यूनतम आवश्यकता 5.0 रूपा है, अतः यह मंगल प्रभावी और बलवान है।</>
            : 'Total: ~362 shashtiamsas = 6.03 rupas. Mars minimum requirement is 5.0 rupas, so this Mars is effective and strong.'}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'सामान्य भ्रम' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'कई आरम्भकर्ता मानते हैं कि उच्च ग्रह स्वतः कुण्डली में सबसे बलवान होता है। उच्च केवल उच्चबल (स्थानबल का एक उप-घटक) में योगदान करता है। एक नीच ग्रह जिसका दिग्बल, कालबल और शुभ दृग्बल प्रबल हो, वह उच्च ग्रह से श्रेष्ठ प्रदर्शन कर सकता है जो अस्त, प्रतिकूल दिशा में वक्री और पापी दृष्टि से ग्रस्त हो। षड्बल का सम्पूर्ण उद्देश्य सरल एकल-कारक मूल्यांकन से परे जाना है।'
            : 'Many beginners assume that an exalted planet is automatically the strongest in the chart. Exaltation only contributes to Uccha Bala (one sub-component of Sthana Bala). A debilitated planet with strong Dig Bala, Kala Bala, and benefic Drig Bala can outperform an exalted planet that is combust, retrograde in an unfavorable direction, and aspected by malefics. Shadbala\u2019s whole purpose is to go beyond simplistic single-factor assessments.'}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'व्याख्या एवं व्यावहारिक उपयोग' : 'Interpretation and Practical Use'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'सर्वाधिक कुल षड्बल वाला ग्रह कुण्डली का \u201Cकप्तान\u201D है \u2014 उसके कारकत्व जातक के जीवन में प्रभुत्व रखते हैं। यदि बृहस्पति अग्रणी हो तो व्यक्ति ज्ञान, शिक्षण और विस्तार की ओर आकर्षित होता है। यदि शुक्र अग्रणी हो तो सौन्दर्य, सम्बन्ध और सुख परिभाषित करते हैं। सबसे दुर्बल ग्रह उस जीवन क्षेत्र को दर्शाता है जिसमें सबसे अधिक सचेत प्रयास और उपचारात्मक उपायों की आवश्यकता है।'
            : 'The planet with the highest total Shadbala is the chart\u2019s \u201Ccaptain\u201D \u2014 its significations dominate the native\u2019s life. If Jupiter leads, the person gravitates toward wisdom, teaching, and expansion. If Venus leads, aesthetics, relationships, and comfort define them. The weakest planet reveals the life area requiring the most conscious effort and remedial measures.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'षड्बल विशेष रूप से विरोधाभासों को सुलझाने में शक्तिशाली है: उच्च पर अस्त ग्रह, स्वराशि में पर दुःस्थान में, नीच में वक्री ग्रह। प्रत्येक स्थिति में छह-आयामी विश्लेषण एक निर्णायक शुद्ध अंक देता है जो स्पष्ट करता है कि ग्रह व्यवहार में बलवान कार्य करता है या दुर्बल।'
            : 'Shadbala is particularly powerful for resolving contradictions: an exalted but combust planet, a planet in its own sign but in a dusthana, a retrograde planet in debilitation. In each case, the six-fold analysis provides a definitive net score that clarifies whether the planet functions as strong or weak in practice.'}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'कम्प्यूटर युग में षड्बल को नवीन रुचि प्राप्त हुई है। कम्प्यूटर से पहले, सात ग्रहों के सभी छह घटकों की गणना कई घण्टों का श्रमसाध्य कार्य था जो केवल उन्नत पण्डित करते थे। आज हमारा कुण्डली इंजन मिलीसेकण्ड में पूर्ण षड्बल गणना करता है और बल टैब में प्रदर्शित करता है। यह लोकतान्त्रीकरण हर उपयोगकर्ता को वही विश्लेषण गहराई प्रदान करता है जो कभी राजदरबारी ज्योतिषियों के लिए आरक्षित थी।'
            : 'Shadbala has gained renewed interest in the age of computation. Before computers, calculating all six components for all seven planets was a tedious multi-hour task done only by advanced pandits. Today, our Kundali engine computes complete Shadbala in milliseconds and displays it in the Strength tab. This democratization means every user can access the same depth of analysis that was once reserved for royal court astrologers. The planetary strength ranking directly affects our Tippanni commentary, dasha predictions, and remedy recommendations.'}
        </p>
      </section>
    </div>
  );
}

export default function Module18_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

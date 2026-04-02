'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_18_5', phase: 5, topic: 'Strength', moduleNumber: '18.5',
  title: {
    en: 'Vimshopaka — 20-Point Varga Strength',
    hi: 'विंशोपक — 20-अंकीय वर्ग बल',
  },
  subtitle: {
    en: 'A planet\'s dignity checked across 16 divisional charts (Shodasvarga), weighted and summed to a maximum of 20 points — the gold standard of inherent planetary quality',
    hi: '16 विभागीय कुण्डलियों (षोडशवर्ग) में ग्रह की गरिमा की जाँच, भारित और अधिकतम 20 अंकों तक योग — अन्तर्निहित ग्रह गुणवत्ता का स्वर्ण मानक',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 18-1: Shadbala Overview', hi: 'मॉड्यूल 18-1: षड्बल अवलोकन' }, href: '/learn/modules/18-1' },
    { label: { en: 'Module 18-4: Avasthas', hi: 'मॉड्यूल 18-4: अवस्थाएँ' }, href: '/learn/modules/18-4' },
    { label: { en: 'Module 10-1: Divisional Charts', hi: 'मॉड्यूल 10-1: वर्ग कुण्डलियाँ' }, href: '/learn/modules/10-1' },
    { label: { en: 'Kundali Tool', hi: 'कुण्डली उपकरण' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q18_5_01', type: 'mcq',
    question: {
      en: 'What does "Vimshopaka" literally mean?',
      hi: '"विंशोपक" का शाब्दिक अर्थ क्या है?',
    },
    options: [
      { en: 'Six-fold strength', hi: 'छह-गुना बल' },
      { en: 'Twenty-pointed', hi: 'बीस-अंकीय' },
      { en: 'Twelve divisions', hi: 'बारह विभाजन' },
      { en: 'Hundred-fold power', hi: 'सौ-गुना शक्ति' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Vimshopaka comes from "Vimsho" (twenty) + "upaka" (points/subsidiary). It is a 20-point scoring system where a planet\'s dignity is checked across 16 divisional charts and the weighted scores sum to a maximum of 20.',
      hi: 'विंशोपक "विंश" (बीस) + "उपक" (अंक/सहायक) से आता है। यह 20-अंकीय मूल्यांकन पद्धति है जहाँ 16 वर्ग कुण्डलियों में ग्रह की गरिमा जाँची जाती है और भारित अंकों का योग अधिकतम 20 तक होता है।',
    },
  },
  {
    id: 'q18_5_02', type: 'mcq',
    question: {
      en: 'How many divisional charts are used in the Shodasvarga scheme?',
      hi: 'षोडशवर्ग योजना में कितनी वर्ग कुण्डलियों का उपयोग होता है?',
    },
    options: [
      { en: '7', hi: '7' },
      { en: '12', hi: '12' },
      { en: '16', hi: '16' },
      { en: '20', hi: '20' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Shodasvarga means "sixteen divisions." The 16 vargas are: D1 (Rashi), D2 (Hora), D3 (Drekkana), D7 (Saptamsha), D9 (Navamsha), D10 (Dashamsha), D12 (Dwadashamsha), D16 (Shodashamsha), D20 (Vimshamsha), D24 (Chaturvimshamsha), D27 (Saptavimshamsha), D30 (Trimshamsha), D40 (Khavedamsha), D45 (Akshavedamsha), and D60 (Shashtiamsha).',
      hi: 'षोडशवर्ग का अर्थ है "सोलह विभाजन।" 16 वर्ग हैं: D1 (राशि), D2 (होरा), D3 (द्रेक्काण), D7 (सप्तांश), D9 (नवांश), D10 (दशांश), D12 (द्वादशांश), D16 (षोडशांश), D20 (विंशांश), D24 (चतुर्विंशांश), D27 (सप्तविंशांश), D30 (त्रिंशांश), D40 (खवेदांश), D45 (अक्षवेदांश), और D60 (षष्ट्यंश)।',
    },
  },
  {
    id: 'q18_5_03', type: 'mcq',
    question: {
      en: 'Which divisional chart carries the highest weight in the Shodasvarga Vimshopaka scheme?',
      hi: 'षोडशवर्ग विंशोपक योजना में किस वर्ग कुण्डली का भार सर्वाधिक है?',
    },
    options: [
      { en: 'D1 (Rashi) — weight 3.5', hi: 'D1 (राशि) — भार 3.5' },
      { en: 'D9 (Navamsha) — weight 3.0', hi: 'D9 (नवांश) — भार 3.0' },
      { en: 'D60 (Shashtiamsha) — weight 4.0', hi: 'D60 (षष्ट्यंश) — भार 4.0' },
      { en: 'D16 (Shodashamsha) — weight 2.0', hi: 'D16 (षोडशांश) — भार 2.0' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'D60 (Shashtiamsha) carries the highest weight of 4.0 points. This is significant — the most microscopic division (each portion is just 0.5° of the zodiac) is considered the most important. It reflects the Vedic emphasis on subtle, karmic indicators. D1 (3.5) and D9 (3.0) follow.',
      hi: 'D60 (षष्ट्यंश) का सर्वाधिक भार 4.0 अंक है। यह महत्वपूर्ण है — सबसे सूक्ष्म विभाजन (प्रत्येक भाग राशिचक्र का केवल 0.5°) सबसे महत्वपूर्ण माना जाता है। यह सूक्ष्म, कार्मिक संकेतकों पर वैदिक बल को दर्शाता है। D1 (3.5) और D9 (3.0) इसके बाद आते हैं।',
    },
  },
  {
    id: 'q18_5_04', type: 'mcq',
    question: {
      en: 'If a planet is exalted in a particular varga, what fraction of that varga\'s weight does it receive?',
      hi: 'यदि कोई ग्रह किसी विशेष वर्ग में उच्च है, तो उसे उस वर्ग के भार का कितना अंश प्राप्त होता है?',
    },
    options: [
      { en: '3/4 of the weight', hi: 'भार का 3/4' },
      { en: 'Full weight', hi: 'पूर्ण भार' },
      { en: '1/2 of the weight', hi: 'भार का 1/2' },
      { en: '1/4 of the weight', hi: 'भार का 1/4' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'An exalted planet receives the full weight of that varga. For example, if a planet is exalted in D60 (weight 4.0), it scores the complete 4.0 points for that division. Moolatrikona and own sign receive 3/4, friend\'s sign gets 1/2, neutral 1/4, enemy 1/8, and debilitated receives 0.',
      hi: 'उच्च ग्रह को उस वर्ग का पूर्ण भार प्राप्त होता है। उदाहरणार्थ, यदि कोई ग्रह D60 (भार 4.0) में उच्च है, तो उसे उस विभाजन के पूर्ण 4.0 अंक मिलते हैं। मूलत्रिकोण और स्वराशि को 3/4, मित्र राशि को 1/2, सम को 1/4, शत्रु को 1/8, और नीच को 0 मिलता है।',
    },
  },
  {
    id: 'q18_5_05', type: 'true_false',
    question: {
      en: 'A debilitated planet in any varga scores zero points for that varga in Vimshopaka.',
      hi: 'किसी भी वर्ग में नीच ग्रह को विंशोपक में उस वर्ग के लिए शून्य अंक मिलते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Debilitation yields zero contribution from that particular varga. If a planet is debilitated in D9 (weight 3.0), it contributes 0 out of 3.0 from the Navamsha. However, it may still score well in other vargas — Vimshopaka is a sum across all 16 charts.',
      hi: 'सत्य। नीच होने पर उस विशेष वर्ग से शून्य योगदान मिलता है। यदि कोई ग्रह D9 (भार 3.0) में नीच है, तो नवांश से 3.0 में से 0 योगदान होता है। परन्तु अन्य वर्गों में अच्छे अंक प्राप्त हो सकते हैं — विंशोपक सभी 16 कुण्डलियों का योग है।',
    },
  },
  {
    id: 'q18_5_06', type: 'mcq',
    question: {
      en: 'A planet scoring 16 out of 20 in Vimshopaka would be classified as:',
      hi: 'विंशोपक में 20 में से 16 अंक प्राप्त करने वाले ग्रह को किस रूप में वर्गीकृत किया जाएगा?',
    },
    options: [
      { en: 'Weak — needs remedial measures', hi: 'दुर्बल — उपाय आवश्यक' },
      { en: 'Mixed — inconsistent results', hi: 'मिश्रित — असंगत परिणाम' },
      { en: 'Highly auspicious — excellent inherent quality', hi: 'अत्यन्त शुभ — उत्कृष्ट अन्तर्निहित गुणवत्ता' },
      { en: 'Average — no special significance', hi: 'सामान्य — कोई विशेष महत्व नहीं' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'A score of 15+ is considered highly auspicious — the planet is dignified across most of the 16 divisional charts. 10-15 is good, 5-10 is mixed, and below 5 indicates weakness across multiple dimensions. A planet scoring 16/20 is consistently well-placed regardless of which divisional lens you examine it through.',
      hi: '15+ का अंक अत्यन्त शुभ माना जाता है — ग्रह 16 वर्ग कुण्डलियों में से अधिकांश में गरिमावान है। 10-15 अच्छा है, 5-10 मिश्रित है, और 5 से कम बहुआयामी दुर्बलता दर्शाता है। 16/20 अंक वाला ग्रह किसी भी वर्ग दृष्टिकोण से देखने पर सुस्थित है।',
    },
  },
  {
    id: 'q18_5_07', type: 'mcq',
    question: {
      en: 'What is the key difference between Vimshopaka and Shadbala?',
      hi: 'विंशोपक और षड्बल में मुख्य अन्तर क्या है?',
    },
    options: [
      { en: 'They measure the same thing using different scales', hi: 'वे समान वस्तु को भिन्न पैमानों से मापते हैं' },
      { en: 'Vimshopaka measures inherent dignity across vargas; Shadbala measures functional ability in the rashi chart', hi: 'विंशोपक वर्गों में अन्तर्निहित गरिमा मापता है; षड्बल राशि कुण्डली में कार्यात्मक क्षमता मापता है' },
      { en: 'Shadbala is more important than Vimshopaka', hi: 'षड्बल विंशोपक से अधिक महत्वपूर्ण है' },
      { en: 'Vimshopaka only uses the D9 chart', hi: 'विंशोपक केवल D9 कुण्डली का उपयोग करता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Vimshopaka measures "inherent quality" — is the planet dignified across multiple dimensional lenses? Shadbala measures "functional ability" — positional strength, directional strength, temporal strength in the birth chart. A planet can be dignified (high Vimshopaka) but poorly placed (low Shadbala), or vice versa. Both are needed for complete assessment.',
      hi: 'विंशोपक "अन्तर्निहित गुणवत्ता" मापता है — क्या ग्रह बहुआयामी दृष्टिकोणों में गरिमावान है? षड्बल "कार्यात्मक क्षमता" मापता है — जन्म कुण्डली में स्थानीय बल, दिशा बल, कालिक बल। एक ग्रह गरिमावान (उच्च विंशोपक) परन्तु कुस्थित (निम्न षड्बल) हो सकता है, या इसका विपरीत। पूर्ण मूल्यांकन के लिए दोनों आवश्यक हैं।',
    },
  },
  {
    id: 'q18_5_08', type: 'true_false',
    question: {
      en: 'A planet can have high Vimshopaka (dignified across vargas) but low Shadbala (weak positional strength).',
      hi: 'एक ग्रह का विंशोपक उच्च (वर्गों में गरिमावान) परन्तु षड्बल निम्न (दुर्बल स्थानीय बल) हो सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. This is a crucial concept. Imagine Jupiter exalted in Cancer (high dignity across many vargas = high Vimshopaka) but placed in the 6th house, with low directional strength, and in an inimical temporal state. The planet is inherently noble but situationally constrained. Understanding this distinction separates advanced practitioners from beginners.',
      hi: 'सत्य। यह एक महत्वपूर्ण अवधारणा है। कल्पना करें बृहस्पति कर्क में उच्च (अनेक वर्गों में उच्च गरिमा = उच्च विंशोपक) परन्तु 6वें भाव में स्थित, निम्न दिशा बल के साथ। ग्रह अन्तर्निहित रूप से श्रेष्ठ है परन्तु परिस्थितिगत रूप से बाधित। इस भेद को समझना उन्नत और नवशिक्षार्थी साधकों को अलग करता है।',
    },
  },
  {
    id: 'q18_5_09', type: 'mcq',
    question: {
      en: 'If a planet is in a neutral sign in a varga with weight 2.0, how many points does it contribute from that varga?',
      hi: 'यदि कोई ग्रह 2.0 भार वाले वर्ग में सम राशि में है, तो उस वर्ग से कितने अंक योगदान करता है?',
    },
    options: [
      { en: '2.0', hi: '2.0' },
      { en: '1.0', hi: '1.0' },
      { en: '0.5', hi: '0.5' },
      { en: '0.25', hi: '0.25' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'A neutral placement receives 1/4 of the varga\'s weight. So for a varga with weight 2.0, the contribution is 2.0 x 1/4 = 0.5 points. The scoring hierarchy is: Exalted = full, Moolatrikona/Own = 3/4, Friend = 1/2, Neutral = 1/4, Enemy = 1/8, Debilitated = 0.',
      hi: 'सम स्थिति को वर्ग भार का 1/4 प्राप्त होता है। अतः 2.0 भार वाले वर्ग के लिए, योगदान 2.0 x 1/4 = 0.5 अंक है। मूल्यांकन क्रम: उच्च = पूर्ण, मूलत्रिकोण/स्व = 3/4, मित्र = 1/2, सम = 1/4, शत्रु = 1/8, नीच = 0।',
    },
  },
  {
    id: 'q18_5_10', type: 'mcq',
    question: {
      en: 'Why is D60 (Shashtiamsha) given the highest weight (4.0) despite being the most microscopic division?',
      hi: 'D60 (षष्ट्यंश) को सबसे सूक्ष्म विभाजन होने के बावजूद सर्वाधिक भार (4.0) क्यों दिया गया है?',
    },
    options: [
      { en: 'It is the easiest to calculate', hi: 'इसकी गणना सबसे सरल है' },
      { en: 'It represents deep karmic and past-life indicators', hi: 'यह गहन कार्मिक और पूर्वजन्म संकेतकों को दर्शाता है' },
      { en: 'It was invented most recently', hi: 'इसका आविष्कार सबसे हाल में हुआ' },
      { en: 'It only applies to benefic planets', hi: 'यह केवल शुभ ग्रहों पर लागू होता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'D60 divides each sign into 60 parts (0.5° each), revealing the most subtle karmic layer. Parashara considered D60 the final arbiter of a planet\'s true nature — reflecting accumulated karma from past lives. Its high weight acknowledges that deep karmic merit (or debt) ultimately outweighs surface-level placements.',
      hi: 'D60 प्रत्येक राशि को 60 भागों (प्रत्येक 0.5°) में विभाजित करता है, सबसे सूक्ष्म कार्मिक परत को प्रकट करता है। पराशर ने D60 को ग्रह की वास्तविक प्रकृति का अन्तिम निर्णायक माना — पूर्वजन्मों के संचित कर्म को दर्शाते हुए। इसका उच्च भार स्वीकार करता है कि गहन कार्मिक पुण्य (या ऋण) अन्ततः सतही स्थितियों से अधिक महत्वपूर्ण है।',
    },
  },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          What Is Vimshopaka Bala?
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vimshopaka means &ldquo;twenty-pointed&rdquo; — a scoring system that checks a planet&rsquo;s dignity across 16 divisional charts (the Shodasvarga set) and sums the weighted results to a maximum of 20 points. It answers a fundamental question: <em>Is this planet consistently dignified, or does its dignity in the birth chart (D1) mask weakness in deeper dimensions?</em>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 16 vargas and their weights are: <strong className="text-gold-light">D1</strong> (Rashi) = 3.5, <strong className="text-gold-light">D2</strong> (Hora) = 0.5, <strong className="text-gold-light">D3</strong> (Drekkana) = 1.0, <strong className="text-gold-light">D7</strong> (Saptamsha) = 0.5, <strong className="text-gold-light">D9</strong> (Navamsha) = 3.0, <strong className="text-gold-light">D10</strong> (Dashamsha) = 0.5, <strong className="text-gold-light">D12</strong> (Dwadashamsha) = 0.5, <strong className="text-gold-light">D16</strong> (Shodashamsha) = 2.0, <strong className="text-gold-light">D20</strong> (Vimshamsha) = 0.5, <strong className="text-gold-light">D24</strong> (Chaturvimshamsha) = 0.5, <strong className="text-gold-light">D27</strong> (Saptavimshamsha) = 0.5, <strong className="text-gold-light">D30</strong> (Trimshamsha) = 1.0, <strong className="text-gold-light">D40</strong> (Khavedamsha) = 1.0, <strong className="text-gold-light">D45</strong> (Akshavedamsha) = 0.5, <strong className="text-gold-light">D60</strong> (Shashtiamsha) = 4.0. Total = 20.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Notice the weight distribution: D60 leads at 4.0, followed by D1 at 3.5, D9 at 3.0, and D16 at 2.0. These four alone account for 12.5 of the 20 points. The remaining 12 vargas share just 7.5 points. This weighting encodes a hierarchy: past-life karma (D60), present-life sign placement (D1), soul-level dharma (D9), and comforts/vehicles (D16) matter most.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Vimshopaka Bala is described in BPHS (Brihat Parashara Hora Shastra), chapter 16. Parashara specifies three varga schemes — Shadvarga (6 vargas), Saptavarga (7), and Shodasvarga (16) — each with its own weight set summing to 20. The Shodasvarga scheme is the most comprehensive and is the standard used by serious practitioners. The system predates Shadbala and represents Parashara&rsquo;s original strength assessment method.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Jupiter at 5&deg; Cancer. In D1, Jupiter is exalted in Cancer = full 3.5 points. In D9 (Navamsha), 5&deg; Cancer falls in the first navamsha pada, which maps to Cancer itself — still exalted = full 3.0 points. Already 6.5 out of 20 from just two vargas. If Jupiter is also well-placed in D60, that adds up to 4.0 more. Three favourable vargas alone could yield 10.5/20 — already in the &ldquo;good&rdquo; range before checking the other 13.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Many students assume that a planet exalted in D1 will automatically score high in Vimshopaka. This is not true. Exaltation in D1 contributes at most 3.5 out of 20 points. The planet could be debilitated or in enemy signs across many of the remaining 15 vargas, resulting in a mediocre total score. Vimshopaka&rsquo;s power lies precisely in this: it reveals whether D1 dignity is &ldquo;deep&rdquo; or &ldquo;superficial.&rdquo;
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Vimshopaka calculation is tedious by hand (checking dignity in 16 charts for each planet) but trivial for software. Modern Jyotish programs compute it instantly. This has made Vimshopaka accessible to every practitioner, not just scholars with the patience for manual divisional chart construction. It is now one of the first strength metrics checked in computerised chart analysis.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Scoring Per Varga — The Dignity Multiplier
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In each of the 16 vargas, the planet&rsquo;s dignity determines what fraction of that varga&rsquo;s weight it earns. The scoring hierarchy is precise:
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Exalted</strong> = full weight (1x). <strong className="text-gold-light">Moolatrikona</strong> = 3/4 weight. <strong className="text-gold-light">Own sign</strong> = 3/4 weight. <strong className="text-gold-light">Great friend&rsquo;s sign</strong> = 1/2 weight. <strong className="text-gold-light">Friend&rsquo;s sign</strong> = 1/2 weight. <strong className="text-text-secondary">Neutral sign</strong> = 1/4 weight. <strong className="text-red-400">Enemy sign</strong> = 1/8 weight. <strong className="text-red-400">Great enemy&rsquo;s sign</strong> = 1/16 weight. <strong className="text-red-400">Debilitated</strong> = 0.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The scoring is applied independently in each varga. A planet could be exalted in D1 (full 3.5), in a friend&rsquo;s sign in D9 (half of 3.0 = 1.5), neutral in D60 (quarter of 4.0 = 1.0), and so on across all 16 charts. The final Vimshopaka score is the sum of all 16 contributions.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The dignity multipliers follow the Panchadha Maitri (five-fold relationship) system from BPHS. This system first determines natural friendship between planets, then modifies it based on temporary friendship (chart-specific positions), yielding five relationship grades: great friend, friend, neutral, enemy, great enemy. These same grades drive the Vimshopaka scoring, creating a direct link between planetary relationship theory and strength assessment.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">Worked Example — Full Calculation</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Jupiter in Cancer at 5&deg;. Let us trace the major vargas:
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D1 (weight 3.5):</span> Cancer = exalted. Score: 3.5 x 1 = 3.50</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D9 (weight 3.0):</span> 5&deg; Cancer = Cancer navamsha = exalted. Score: 3.0 x 1 = 3.00</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D2 (weight 0.5):</span> 5&deg; = Moon&rsquo;s Hora (Cancer ruled by Moon, friend). Score: 0.5 x 1/2 = 0.25</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D3 (weight 1.0):</span> 5&deg; Cancer = first drekkana = Cancer itself = exalted. Score: 1.0 x 1 = 1.00</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Running subtotal from 4 vargas:</span> 7.75 out of 20. The remaining 12 vargas add their contributions similarly.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Students sometimes apply Moolatrikona and own-sign scoring incorrectly — treating them as the same as exaltation. While both score 3/4 (which is good), they are notably less than the full weight that exaltation receives. The difference matters in close cases. Also, &ldquo;great friend&rdquo; and &ldquo;friend&rdquo; both score 1/2, and &ldquo;enemy&rdquo; and &ldquo;great enemy&rdquo; differ (1/8 vs 1/16) — these fine gradations are often overlooked.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Vimshopaka scoring system is essentially a weighted average — a concept familiar in data science and statistics. Modern practitioners appreciate its mathematical elegance: 16 independent assessments, each weighted by importance, collapsed into a single 0-20 score. It is arguably the most &ldquo;modern&rdquo; of classical Jyotish tools in its design philosophy, anticipating multi-factor scoring systems by millennia.
        </p>
      </section>
    </div>
  );
}

function Page3() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Interpretation — Reading the Score
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Vimshopaka score falls into four broad bands: <strong className="text-gold-light">15-20</strong> = highly auspicious (planet is dignified across most vargas, delivering consistent quality), <strong className="text-gold-light">10-15</strong> = good (reliable planet with some dimensional weaknesses), <strong className="text-text-secondary">5-10</strong> = mixed (inconsistent dignity, results vary by life area), <strong className="text-red-400">below 5</strong> = weak across vargas (the planet&rsquo;s significations face systemic challenges).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The critical distinction is between Vimshopaka and Shadbala. <strong className="text-gold-light">Vimshopaka measures inherent quality</strong> — is the planet dignified when viewed through multiple divisional lenses? <strong className="text-gold-light">Shadbala measures functional ability</strong> — does the planet have positional power, directional strength, temporal advantage, and motional strength in the birth chart? These are independent axes.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A planet can be dignified (high Vimshopaka) but poorly placed (low Shadbala) — like a nobleman in exile: inherently worthy but unable to exercise power. Conversely, a planet can be functionally strong (high Shadbala) but of poor quality (low Vimshopaka) — like a powerful official of questionable character. The most auspicious planets score high on both measures. Complete strength assessment requires both Vimshopaka and Shadbala.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara presents Vimshopaka before Shadbala in BPHS, suggesting he considered it the primary strength metric. Later commentators like Balabhadra (Hora Ratnam) and modern scholars like Sanjay Rath have emphasised that Vimshopaka reveals the &ldquo;essence&rdquo; of a planet while Shadbala reveals its &ldquo;circumstances.&rdquo; Together they form a complete picture — like knowing both a person&rsquo;s character and their current situation.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">Worked Example — Vimshopaka vs Shadbala</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Saturn exalted in Libra (D1) at 20&deg;, also exalted in D9, D3, well-placed in D60 — Vimshopaka score: 16.2/20 (excellent). But this Saturn is in the 12th house, has low Dig Bala (directional strength, Saturn is strong in 7th not 12th), low Kala Bala (born during daytime when Saturn prefers night), and lost the planetary war with Mars nearby. Shadbala: only 85% of required minimum. This Saturn has superb inherent quality but difficult circumstances — during its dasha, the native achieves outcomes of lasting value but through struggle, isolation, or foreign lands (12th house themes).
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Some practitioners treat Vimshopaka as a replacement for Shadbala, or vice versa. This is a fundamental error. They measure different things and can diverge significantly for the same planet. A chart analysis that uses only one is incomplete. Additionally, neither Vimshopaka nor Shadbala accounts for house lordship — a planet with excellent scores can still produce challenging results if it lords over dusthana houses (6th, 8th, 12th).
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Vimshopaka-Shadbala distinction maps elegantly to modern psychological concepts. Vimshopaka is like measuring someone&rsquo;s &ldquo;trait&rdquo; — their stable, inherent character across contexts. Shadbala is like measuring their &ldquo;state&rdquo; — their current abilities given life circumstances. This dual-axis model of planetary strength, articulated thousands of years ago, anticipates modern personality psychology&rsquo;s trait-state distinction. For predictive work, high Vimshopaka with low Shadbala often manifests as &ldquo;potential waiting for the right dasha or transit to unlock it.&rdquo;
        </p>
      </section>
    </div>
  );
}

export default function Module18_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

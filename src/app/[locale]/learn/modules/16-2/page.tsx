'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_16_2', phase: 5, topic: 'Classical', moduleNumber: '16.2',
  title: {
    en: 'Phaladeepika & Jataka Parijata',
    hi: 'फलदीपिका एवं जातक पारिजात',
  },
  subtitle: {
    en: 'Two essential post-BPHS texts — Mantreshwara\'s practical handbook and Vaidyanatha\'s systematic yoga classification',
    hi: 'बृहत् पाराशर होरा शास्त्र के पश्चात् दो आवश्यक ग्रन्थ — मन्त्रेश्वर की व्यावहारिक पुस्तिका और वैद्यनाथ का व्यवस्थित योग वर्गीकरण',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 16-1: Brihat Parashara Hora Shastra', hi: 'मॉड्यूल 16-1: बृहत् पाराशर होरा शास्त्र' }, href: '/learn/modules/16-1' },
    { label: { en: 'Module 16-3: Surya Siddhanta & Mathematical Texts', hi: 'मॉड्यूल 16-3: सूर्य सिद्धान्त एवं गणितीय ग्रन्थ' }, href: '/learn/modules/16-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q16_2_01', type: 'mcq',
    question: {
      en: 'Who authored the Phaladeepika?',
      hi: 'फलदीपिका के रचयिता कौन हैं?',
    },
    options: [
      { en: 'Parashara', hi: 'पराशर' },
      { en: 'Varahamihira', hi: 'वराहमिहिर' },
      { en: 'Mantreshwara', hi: 'मन्त्रेश्वर' },
      { en: 'Vaidyanatha', hi: 'वैद्यनाथ' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Phaladeepika was composed by Mantreshwara in the 13th century CE. The title means "Lamp of Results" — reflecting its focus on clear, practical prediction rather than theoretical elaboration.',
      hi: 'फलदीपिका की रचना 13वीं शताब्दी में मन्त्रेश्वर ने की थी। शीर्षक का अर्थ है "फलों का दीपक" — जो सैद्धान्तिक विस्तार के बजाय स्पष्ट, व्यावहारिक भविष्यवाणी पर ध्यान केन्द्रित करता है।',
    },
  },
  {
    id: 'q16_2_02', type: 'mcq',
    question: {
      en: 'How many chapters does the Phaladeepika contain?',
      hi: 'फलदीपिका में कितने अध्याय हैं?',
    },
    options: [
      { en: '18', hi: '18' },
      { en: '28', hi: '28' },
      { en: '97', hi: '97' },
      { en: '42', hi: '42' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Phaladeepika has 28 chapters — far more concise than BPHS\'s 97. This economy of expression makes it an ideal reference for working astrologers who need quick access to core rules.',
      hi: 'फलदीपिका में 28 अध्याय हैं — बृहत् पाराशर होरा शास्त्र के 97 से बहुत संक्षिप्त। यह संक्षिप्तता इसे कार्यरत ज्योतिषियों के लिए आदर्श सन्दर्भ बनाती है।',
    },
  },
  {
    id: 'q16_2_03', type: 'true_false',
    question: {
      en: 'Jataka Parijata was composed by Vaidyanatha Dikshita in the 14th century.',
      hi: 'जातक पारिजात की रचना वैद्यनाथ दीक्षित ने 14वीं शताब्दी में की थी।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Vaidyanatha Dikshita composed Jataka Parijata ("The Celestial Tree of Horoscopy") in the 14th century. Its 18 chapters provide a systematic classification of yogas that is more organized than BPHS.',
      hi: 'सत्य। वैद्यनाथ दीक्षित ने 14वीं शताब्दी में जातक पारिजात ("फलित ज्योतिष का कल्पवृक्ष") की रचना की। इसके 18 अध्याय योगों का व्यवस्थित वर्गीकरण प्रदान करते हैं।',
    },
  },
  {
    id: 'q16_2_04', type: 'mcq',
    question: {
      en: 'Phaladeepika is best known for its clear descriptions of:',
      hi: 'फलदीपिका किसके स्पष्ट वर्णन के लिए सर्वाधिक प्रसिद्ध है?',
    },
    options: [
      { en: 'Eclipse calculations', hi: 'ग्रहण गणना' },
      { en: 'Yoga descriptions and planet-in-house results', hi: 'योग वर्णन और भाव में ग्रह फल' },
      { en: 'Remedial gemstones only', hi: 'केवल उपचारात्मक रत्न' },
      { en: 'Mundane astrology', hi: 'मेदिनी ज्योतिष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Phaladeepika excels at concise, practical yoga descriptions and planet-in-house results. Its clarity makes it the go-to text when BPHS is too verbose or ambiguous on a particular point.',
      hi: 'फलदीपिका संक्षिप्त, व्यावहारिक योग वर्णन और भाव में ग्रह फलों में उत्कृष्ट है। इसकी स्पष्टता इसे उन बिन्दुओं पर प्रमुख सन्दर्भ बनाती है जहाँ बृहत् पाराशर होरा शास्त्र अत्यधिक विस्तृत या अस्पष्ट है।',
    },
  },
  {
    id: 'q16_2_05', type: 'mcq',
    question: {
      en: 'Jataka Parijata is particularly famous for its treatment of:',
      hi: 'जातक पारिजात विशेष रूप से किसके विवेचन के लिए प्रसिद्ध है?',
    },
    options: [
      { en: 'Only Ashtakavarga', hi: 'केवल अष्टकवर्ग' },
      { en: 'Raja Yoga definitions and Nabhasa Yogas', hi: 'राज योग परिभाषाएँ और नाभस योग' },
      { en: 'Only remedial measures', hi: 'केवल उपचारात्मक उपाय' },
      { en: 'Only transit analysis', hi: 'केवल गोचर विश्लेषण' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jataka Parijata is renowned for its precise Raja Yoga definitions and exhaustive treatment of Nabhasa Yogas (celestial pattern yogas based on planetary distribution across houses). Its yoga classification is more systematic than BPHS.',
      hi: 'जातक पारिजात अपनी सटीक राज योग परिभाषाओं और नाभस योगों (भावों में ग्रह वितरण पर आधारित आकाशीय प्रतिरूप योग) के विस्तृत विवेचन के लिए प्रसिद्ध है।',
    },
  },
  {
    id: 'q16_2_06', type: 'true_false',
    question: {
      en: 'When BPHS and Phaladeepika contradict each other on a specific rule, BPHS is always considered correct.',
      hi: 'जब बृहत् पाराशर होरा शास्त्र और फलदीपिका किसी विशिष्ट नियम पर एक-दूसरे से विरोधाभासी हों, तो बृहत् पाराशर होरा शास्त्र सदैव सही माना जाता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. While BPHS is foundational, experienced practitioners use the principle: when texts disagree, verify against the native\'s actual life. The chart must fit reality. Phaladeepika sometimes provides more refined or practical rules for certain topics.',
      hi: 'असत्य। यद्यपि बृहत् पाराशर होरा शास्त्र आधारभूत है, अनुभवी ज्योतिषी इस सिद्धान्त का प्रयोग करते हैं: जब ग्रन्थ असहमत हों, जातक के वास्तविक जीवन से सत्यापित करें। कुण्डली को वास्तविकता से मेल खाना चाहिए।',
    },
  },
  {
    id: 'q16_2_07', type: 'mcq',
    question: {
      en: 'How many chapters does Jataka Parijata contain?',
      hi: 'जातक पारिजात में कितने अध्याय हैं?',
    },
    options: [
      { en: '12', hi: '12' },
      { en: '18', hi: '18' },
      { en: '28', hi: '28' },
      { en: '36', hi: '36' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jataka Parijata has 18 chapters, making it more compact than both BPHS (97) and Phaladeepika (28). Despite its brevity, it covers planetary combinations with remarkable thoroughness.',
      hi: 'जातक पारिजात में 18 अध्याय हैं, जो बृहत् पाराशर होरा शास्त्र (97) और फलदीपिका (28) दोनों से अधिक संक्षिप्त है। संक्षिप्तता के बावजूद, यह ग्रह संयोजनों को उल्लेखनीय गहनता से समाहित करता है।',
    },
  },
  {
    id: 'q16_2_08', type: 'mcq',
    question: {
      en: 'The practical approach for using classical texts is:',
      hi: 'शास्त्रीय ग्रन्थों के उपयोग का व्यावहारिक दृष्टिकोण है:',
    },
    options: [
      { en: 'Read only one text and ignore all others', hi: 'केवल एक ग्रन्थ पढ़ें और शेष सभी को अनदेखा करें' },
      { en: 'BPHS for foundations, Phaladeepika for interpretation, Jataka Parijata for yogas', hi: 'बृहत् पाराशर होरा शास्त्र आधार के लिए, फलदीपिका फलकथन के लिए, जातक पारिजात योगों के लिए' },
      { en: 'Only use modern textbooks', hi: 'केवल आधुनिक पाठ्यपुस्तकों का प्रयोग करें' },
      { en: 'Texts are irrelevant to modern practice', hi: 'ग्रन्थ आधुनिक अभ्यास से अप्रासंगिक हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each text has its strength: BPHS provides the comprehensive rule base, Phaladeepika gives concise practical interpretation, and Jataka Parijata excels at yoga identification. Together they form a complete toolkit.',
      hi: 'प्रत्येक ग्रन्थ की अपनी शक्ति है: बृहत् पाराशर होरा शास्त्र व्यापक नियम आधार देता है, फलदीपिका संक्षिप्त व्यावहारिक फलकथन देती है, और जातक पारिजात योग पहचान में उत्कृष्ट है।',
    },
  },
  {
    id: 'q16_2_09', type: 'true_false',
    question: {
      en: 'Nabhasa Yogas are based on how planets are distributed across houses and signs.',
      hi: 'नाभस योग इस पर आधारित हैं कि ग्रह भावों और राशियों में कैसे वितरित हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Nabhasa Yogas are celestial pattern yogas formed by the overall distribution of planets — how many houses are occupied, whether planets cluster in one hemisphere, etc. Jataka Parijata gives the most systematic treatment of these 32 yogas.',
      hi: 'सत्य। नाभस योग ग्रहों के समग्र वितरण से बनने वाले आकाशीय प्रतिरूप योग हैं — कितने भाव अधिकृत हैं, ग्रह एक गोलार्ध में एकत्रित हैं या नहीं, आदि। जातक पारिजात इन 32 योगों का सर्वाधिक व्यवस्थित विवेचन प्रदान करता है।',
    },
  },
  {
    id: 'q16_2_10', type: 'mcq',
    question: {
      en: 'What does the title "Phaladeepika" literally mean?',
      hi: '"फलदीपिका" शीर्षक का शाब्दिक अर्थ क्या है?',
    },
    options: [
      { en: 'The Great Treatise', hi: 'महान ग्रन्थ' },
      { en: 'Lamp of Results', hi: 'फलों का दीपक' },
      { en: 'Celestial Tree', hi: 'कल्पवृक्ष' },
      { en: 'Book of Stars', hi: 'तारों की पुस्तक' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Phala" means results/fruits, "Deepika" means lamp/light. So Phaladeepika = "The Lamp that Illuminates Results." The title perfectly captures the text\'s purpose: shedding clear light on how to predict outcomes.',
      hi: '"फल" का अर्थ है परिणाम/फल, "दीपिका" का अर्थ है दीपक/प्रकाश। अतः फलदीपिका = "वह दीपक जो फलों को प्रकाशित करता है।" शीर्षक ग्रन्थ के उद्देश्य को पूर्णतः व्यक्त करता है।',
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
          Phaladeepika — The Practitioner&rsquo;s Handbook
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Phaladeepika (&ldquo;The Lamp of Results&rdquo;) was composed by Mantreshwara in the 13th century CE. With 28 chapters, it condenses the vast ocean of BPHS into a practical, working reference. Where BPHS is an encyclopedia, Phaladeepika is a handbook — every verse is directly usable in chart interpretation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text is celebrated for its clear yoga descriptions. When a modern astrologer says &ldquo;Gajakesari Yoga gives fame and learning,&rdquo; that concise formulation often traces to Phaladeepika rather than BPHS. Mantreshwara had a gift for compression — stating in two lines what Parashara took a chapter to elaborate.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Planet-in-house results in Phaladeepika are particularly valued. Each chapter on bhava results gives crisp, memorable predictions for every planet placed there. These are the verses that astrologers memorize and apply in consultations — practical, testable, and time-proven over seven centuries of use.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Why Phaladeepika Endures</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Three qualities make Phaladeepika indispensable: brevity (no wasted verses), clarity (unambiguous language), and completeness within its scope (all essential topics covered). A student who masters Phaladeepika can read any birth chart competently. Many traditional gurukuls use it as the primary teaching text, introducing BPHS only for advanced topics.
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
          Jataka Parijata — The Systematic Classifier
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Jataka Parijata (&ldquo;The Celestial Tree of Horoscopy&rdquo;) was composed by Vaidyanatha Dikshita in the 14th century. Its 18 chapters provide what is arguably the most systematic classification of planetary yogas in all Jyotish literature. While BPHS scatters yoga definitions across multiple chapters, Jataka Parijata organizes them into clean, hierarchical categories.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text is particularly famous for its Raja Yoga definitions — the combinations that confer power, authority, and success. Vaidyanatha provides precise conditions: which house lords must combine, what aspects are required, and which additional factors strengthen or cancel the yoga. This precision makes the text invaluable for yoga identification in chart analysis.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Jataka Parijata also gives the most thorough treatment of Nabhasa Yogas — 32 pattern-based yogas determined by how planets distribute across houses. These include Yupa (all planets in 4 consecutive houses), Shara (planets in 4 alternate houses), and Chakra (planets in all odd or all even signs). These macro-patterns provide the overarching life theme before examining individual planet placements.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Key Jataka Parijata Contributions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Raja Yoga hierarchy:</span> Not all Raja Yogas are equal. Vaidyanatha ranks them by the houses involved — 1-9, 1-5, 4-10 lords combining produce different grades of power and fame.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Nabhasa Yogas:</span> 32 celestial patterns based on planetary distribution. These tell you the overall &ldquo;shape&rdquo; of a life before examining individual placements.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Cancellation rules:</span> Detailed conditions under which a yoga is cancelled (bhanga) by adverse factors — essential for accurate prediction.</p>
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
          Comparative Analysis — When Texts Disagree
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Classical texts sometimes contradict each other. BPHS may call a planet a natural benefic while Phaladeepika adds conditions. A Raja Yoga defined broadly in BPHS may have stricter requirements in Jataka Parijata. These are not errors — they reflect different schools, different eras, and different observational emphases accumulated over centuries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The working principle among experienced practitioners: use BPHS for foundational rules (planetary nature, house significations, dasha calculations). Use Phaladeepika for practical interpretation (what does this placement actually mean in daily life). Use Jataka Parijata for yoga identification (is this combination really a Raja Yoga or not). When all three agree, the prediction is strong. When they disagree, verify against the native&rsquo;s actual life events.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Myth:</span> &ldquo;If it is in BPHS, it must be exactly followed without question.&rdquo; Reality: BPHS has multiple recensions (manuscript versions), and some chapters were likely added later. Critical reading — comparing versions and checking internal consistency — is necessary.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Myth:</span> &ldquo;Newer texts are improvements over older ones.&rdquo; Reality: Phaladeepika and Jataka Parijata complement BPHS, they do not supersede it. Each text has domains where it excels. A skilled astrologer draws from all three as context demands.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Our App&rsquo;s Approach</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our yoga detection engine implements definitions from all three texts, prioritizing BPHS for foundational rules and cross-referencing Phaladeepika and Jataka Parijata for yoga classification. When texts disagree on a yoga condition, we follow the stricter definition — it is better to miss a marginal yoga than to flag a false one. The tippanni commentary notes which text supports each interpretation.
        </p>
      </section>
    </div>
  );
}

export default function Module16_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

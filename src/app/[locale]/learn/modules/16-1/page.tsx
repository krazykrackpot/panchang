'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_16_1', phase: 5, topic: 'Classical', moduleNumber: '16.1',
  title: {
    en: 'Brihat Parashara Hora Shastra — The Foundation',
    hi: 'बृहत् पाराशर होरा शास्त्र — आधारभूत ग्रन्थ',
  },
  subtitle: {
    en: '97 chapters attributed to Maharishi Parashara covering every dimension of Jyotish — from graha properties to dasha systems to remedies',
    hi: 'महर्षि पराशर को प्रदत्त 97 अध्याय जो ज्योतिष के प्रत्येक आयाम को समाहित करते हैं — ग्रह गुणों से दशा पद्धतियों तक, उपचारों तक',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 16-2: Phaladeepika & Jataka Parijata', hi: 'मॉड्यूल 16-2: फलदीपिका एवं जातक पारिजात' }, href: '/learn/modules/16-2' },
    { label: { en: 'Module 16-3: Surya Siddhanta & Mathematical Texts', hi: 'मॉड्यूल 16-3: सूर्य सिद्धान्त एवं गणितीय ग्रन्थ' }, href: '/learn/modules/16-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q16_1_01', type: 'mcq',
    question: {
      en: 'How many chapters does the Brihat Parashara Hora Shastra contain?',
      hi: 'बृहत् पाराशर होरा शास्त्र में कितने अध्याय हैं?',
    },
    options: [
      { en: '28', hi: '28' },
      { en: '54', hi: '54' },
      { en: '97', hi: '97' },
      { en: '120', hi: '120' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'BPHS contains 97 chapters (adhyayas) covering everything from planetary nature and sign descriptions to dasha systems, yogas, and remedial measures. It is the most comprehensive single text in Parashari Jyotish.',
      hi: 'बृहत् पाराशर होरा शास्त्र में 97 अध्याय हैं जो ग्रहों के स्वभाव और राशि वर्णन से लेकर दशा पद्धतियों, योगों और उपचारात्मक उपायों तक सब कुछ समाहित करते हैं।',
    },
  },
  {
    id: 'q16_1_02', type: 'mcq',
    question: {
      en: 'BPHS is structured as a dialogue between which two figures?',
      hi: 'बृहत् पाराशर होरा शास्त्र किन दो व्यक्तियों के संवाद के रूप में संरचित है?',
    },
    options: [
      { en: 'Shiva and Parvati', hi: 'शिव और पार्वती' },
      { en: 'Parashara and Maitreya', hi: 'पराशर और मैत्रेय' },
      { en: 'Vyasa and Arjuna', hi: 'व्यास और अर्जुन' },
      { en: 'Narada and Brahma', hi: 'नारद और ब्रह्मा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'BPHS is presented as the sage Parashara teaching his disciple Maitreya. This guru-shishya dialogue format is common in Indian shastra tradition and allows progressive exposition from basic to advanced concepts.',
      hi: 'बृहत् पाराशर होरा शास्त्र महर्षि पराशर द्वारा अपने शिष्य मैत्रेय को शिक्षा देने के रूप में प्रस्तुत है। यह गुरु-शिष्य संवाद शैली भारतीय शास्त्र परम्परा में सामान्य है।',
    },
  },
  {
    id: 'q16_1_03', type: 'true_false',
    question: {
      en: 'The Vimshottari Dasha system (120-year cycle) is described in BPHS Chapter 46.',
      hi: 'विंशोत्तरी दशा पद्धति (120 वर्ष का चक्र) बृहत् पाराशर होरा शास्त्र के अध्याय 46 में वर्णित है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. BPHS Chapter 46 describes Vimshottari Dasha in detail, including the nakshatra-based allocation of planetary periods. This is the most widely used dasha system in modern Jyotish practice.',
      hi: 'सत्य। अध्याय 46 में विंशोत्तरी दशा का विस्तृत वर्णन है, जिसमें नक्षत्र-आधारित ग्रह अवधि आवंटन सम्मिलित है। यह आधुनिक ज्योतिष में सर्वाधिक प्रयुक्त दशा पद्धति है।',
    },
  },
  {
    id: 'q16_1_04', type: 'mcq',
    question: {
      en: 'Which chapters of BPHS cover Bhava (house) results?',
      hi: 'बृहत् पाराशर होरा शास्त्र के कौन-से अध्याय भाव फल का वर्णन करते हैं?',
    },
    options: [
      { en: 'Chapters 1-3', hi: 'अध्याय 1-3' },
      { en: 'Chapters 12-25', hi: 'अध्याय 12-25' },
      { en: 'Chapters 87-97', hi: 'अध्याय 87-97' },
      { en: 'Chapters 50-60', hi: 'अध्याय 50-60' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Chapters 12 through 25 of BPHS systematically cover each of the 12 houses (bhavas) and the results of various planetary placements within them. This section forms the core of predictive astrology.',
      hi: 'अध्याय 12 से 25 में 12 भावों में से प्रत्येक और उनमें विभिन्न ग्रह स्थितियों के फलों का व्यवस्थित वर्णन है। यह खंड फलित ज्योतिष का मूल है।',
    },
  },
  {
    id: 'q16_1_05', type: 'mcq',
    question: {
      en: 'BPHS chapters 87-97 primarily deal with:',
      hi: 'बृहत् पाराशर होरा शास्त्र के अध्याय 87-97 मुख्यतः किस विषय से सम्बन्धित हैं?',
    },
    options: [
      { en: 'Planetary properties', hi: 'ग्रह गुण' },
      { en: 'Yoga combinations', hi: 'योग संयोजन' },
      { en: 'Remedial measures (upayas)', hi: 'उपचारात्मक उपाय' },
      { en: 'Sign descriptions', hi: 'राशि वर्णन' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The final chapters (87-97) of BPHS are devoted to remedial measures — gemstones, mantras, charity, fasting, and worship prescribed for planetary afflictions. This section makes BPHS unique as both a diagnostic and therapeutic manual.',
      hi: 'अन्तिम अध्याय (87-97) उपचारात्मक उपायों — रत्न, मन्त्र, दान, व्रत और पूजा — को समर्पित हैं जो ग्रह पीड़ा के लिए निर्दिष्ट हैं। यह खंड बृहत् पाराशर होरा शास्त्र को निदान और चिकित्सा दोनों का ग्रन्थ बनाता है।',
    },
  },
  {
    id: 'q16_1_06', type: 'true_false',
    question: {
      en: 'BPHS describes only the Vimshottari Dasha system and no other dasha systems.',
      hi: 'बृहत् पाराशर होरा शास्त्र में केवल विंशोत्तरी दशा पद्धति का वर्णन है और कोई अन्य दशा पद्धति नहीं है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. BPHS describes over 40 dasha systems including Ashtottari (108-year), Yogini, Kalachakra, Chara, and many conditional dashas. Vimshottari is simply the most universally applicable and widely practiced.',
      hi: 'असत्य। बृहत् पाराशर होरा शास्त्र में 40 से अधिक दशा पद्धतियों का वर्णन है जिनमें अष्टोत्तरी (108 वर्ष), योगिनी, कालचक्र, चर और अनेक सशर्त दशाएँ सम्मिलित हैं। विंशोत्तरी सर्वाधिक सार्वभौमिक रूप से प्रयोज्य है।',
    },
  },
  {
    id: 'q16_1_07', type: 'mcq',
    question: {
      en: 'Which chapter of BPHS covers Graha (planetary) properties and nature?',
      hi: 'बृहत् पाराशर होरा शास्त्र का कौन-सा अध्याय ग्रह गुणों और स्वभाव का वर्णन करता है?',
    },
    options: [
      { en: 'Chapter 3', hi: 'अध्याय 3' },
      { en: 'Chapter 12', hi: 'अध्याय 12' },
      { en: 'Chapter 34', hi: 'अध्याय 34' },
      { en: 'Chapter 46', hi: 'अध्याय 46' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Chapter 3 of BPHS (Graha Gunadhyaya) describes the inherent properties of each planet — their nature (benefic/malefic), element, caste, direction, deity, colour, and relationships with other planets.',
      hi: 'अध्याय 3 (ग्रह गुणाध्याय) में प्रत्येक ग्रह के स्वाभाविक गुणों का वर्णन है — उनका स्वभाव (शुभ/अशुभ), तत्त्व, वर्ण, दिशा, देवता, रंग और अन्य ग्रहों से सम्बन्ध।',
    },
  },
  {
    id: 'q16_1_08', type: 'mcq',
    question: {
      en: 'Yoga combinations in BPHS are primarily described in which chapter range?',
      hi: 'बृहत् पाराशर होरा शास्त्र में योग संयोजनों का वर्णन मुख्यतः किन अध्यायों में है?',
    },
    options: [
      { en: 'Chapters 3-4', hi: 'अध्याय 3-4' },
      { en: 'Chapters 12-25', hi: 'अध्याय 12-25' },
      { en: 'Chapters 34-41', hi: 'अध्याय 34-41' },
      { en: 'Chapters 87-97', hi: 'अध्याय 87-97' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Chapters 34-41 of BPHS contain the yoga descriptions — Raja Yogas, Dhana Yogas, Daridra Yogas, and other special combinations. These chapters are some of the most frequently referenced in practical chart analysis.',
      hi: 'अध्याय 34-41 में योगों का वर्णन है — राज योग, धन योग, दरिद्र योग और अन्य विशेष संयोजन। ये अध्याय व्यावहारिक कुण्डली विश्लेषण में सर्वाधिक संदर्भित हैं।',
    },
  },
  {
    id: 'q16_1_09', type: 'true_false',
    question: {
      en: 'The R. Santhanam translation of BPHS is considered one of the most accessible English translations.',
      hi: 'बृहत् पाराशर होरा शास्त्र का आर. सन्तानम् अनुवाद सर्वाधिक सुलभ अंग्रेजी अनुवादों में से एक माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. R. Santhanam\'s two-volume translation is widely used by English-speaking students. Girish Chand Sharma\'s Hindi translation is another major reference. Both provide verse-by-verse commentary essential for understanding the original Sanskrit.',
      hi: 'सत्य। आर. सन्तानम् का दो-खण्डीय अनुवाद अंग्रेजी भाषी विद्यार्थियों द्वारा व्यापक रूप से प्रयुक्त है। गिरीश चन्द शर्मा का हिन्दी अनुवाद भी एक प्रमुख सन्दर्भ है।',
    },
  },
  {
    id: 'q16_1_10', type: 'mcq',
    question: {
      en: 'Which BPHS chapter describes the Rashi (zodiac sign) properties?',
      hi: 'बृहत् पाराशर होरा शास्त्र का कौन-सा अध्याय राशि गुणों का वर्णन करता है?',
    },
    options: [
      { en: 'Chapter 1', hi: 'अध्याय 1' },
      { en: 'Chapter 4', hi: 'अध्याय 4' },
      { en: 'Chapter 12', hi: 'अध्याय 12' },
      { en: 'Chapter 34', hi: 'अध्याय 34' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Chapter 4 (Rashi Swarupadhyaya) describes the nature, element, quality, direction, and physical characteristics of each of the 12 zodiac signs. This foundational chapter informs all subsequent sign-based analysis.',
      hi: 'अध्याय 4 (राशि स्वरूपाध्याय) में 12 राशियों में से प्रत्येक के स्वभाव, तत्त्व, गुण, दिशा और शारीरिक विशेषताओं का वर्णन है। यह मूलभूत अध्याय सभी राशि-आधारित विश्लेषण का आधार है।',
    },
  },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          BPHS — The Foundational Text of Vedic Astrology
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Brihat Parashara Hora Shastra (BPHS) is the single most important text in Parashari Jyotish. Attributed to Maharishi Parashara — the father of Vyasa, who composed the Mahabharata — it is a comprehensive encyclopedia of predictive astrology spanning 97 chapters and roughly 4,000 verses in its most complete recensions.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text is structured as a dialogue: the sage Parashara teaches his disciple Maitreya, who asks progressively deeper questions. This guru-shishya format mirrors the Upanishadic tradition and allows the text to build from foundational concepts (planetary nature, sign properties) to advanced techniques (conditional dashas, nabhasa yogas, remedial prescriptions).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Dating BPHS precisely is difficult. The core astronomical content may originate from 1500-1200 BCE, while later chapters on remedies and certain yoga combinations were likely added over centuries. What matters for practitioners is that the system works — and its internal consistency is remarkable for a text of such scope.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">The 97-Chapter Architecture</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          BPHS is organized in a logical progression. Chapters 1-2 introduce the purpose of Jyotish. Chapter 3 defines Graha (planetary) properties. Chapter 4 describes Rashi (sign) nature. Chapters 5-11 cover subsidiary charts (Shadvarga, Saptavarga). Chapters 12-25 give house-by-house results. Chapters 26-33 handle special lagnas and strengths.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Chapters 34-41 contain the yoga encyclopedia — Raja Yogas, Dhana Yogas, Arishta Yogas. Chapters 42-50 describe dasha systems (including the Vimshottari in Chapter 46). Chapters 51-86 cover advanced topics like Ashtakavarga, Longevity, and Female Horoscopy. The final chapters (87-97) prescribe remedial measures for every planetary affliction.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">The Dialogue Format</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Maitreya asks: &ldquo;O great sage, please describe the nature of the nine grahas.&rdquo; Parashara responds with systematic descriptions. This call-and-response structure is not merely literary — it signals topic transitions and marks when the text moves from one domain to another. When Maitreya says &ldquo;Please elaborate further,&rdquo; it indicates that the next section deepens the preceding topic. Understanding this structure helps modern readers navigate the text efficiently.
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
          Key BPHS Concepts and Our App
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Every major calculation in this app traces back to a BPHS chapter. Our Graha (planet) definitions follow Chapter 3 — natural benefic/malefic status, exaltation/debilitation degrees, moolatrikona signs. Rashi properties from Chapter 4 determine sign lordship and elemental classification. House results from Chapters 12-25 power our tippanni (interpretive commentary).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Vimshottari Dasha engine (Chapter 46) calculates planetary periods from the birth nakshatra. Our yoga detection (Chapters 34-41) identifies combinations like Gajakesari, Budhaditya, Viparita Raja Yoga. The Ashtakavarga module (Chapter 66) computes bindu scores for transit assessment. In each case, we implement the classical algorithm with modern astronomical precision.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">Chapter Quick Reference</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 3 — Graha Gunadhyaya:</span> Planetary nature, caste, element, direction, deity, relationships. The DNA of each planet.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 4 — Rashi Swarupadhyaya:</span> Sign characteristics, odd/even, movable/fixed/dual, body parts, directions.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 12-25 — Bhavaphaladhyaya:</span> Results for each house — the most consulted section for predictions.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ch. 34-41 — Yogadhyaya:</span> Raja Yoga, Dhana Yoga, Arishta Yoga — combination analysis.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Ch. 46 — Dashadhyaya:</span> Vimshottari and other timing systems — the predictive backbone.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Pitfalls</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          BPHS verses are terse and sometimes ambiguous in Sanskrit. Different commentators interpret the same verse differently. For example, the definition of &ldquo;Yoga Karaka&rdquo; planet has subtle variations across translations. Always cross-reference multiple translations (Santhanam, Girish Chand Sharma, Ernst Wilhelm) before concluding a verse means a specific thing.
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
          Reading BPHS Today
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For English readers, the R. Santhanam two-volume translation (Ranjan Publications) remains the standard reference. It provides verse-by-verse Sanskrit, transliteration, and commentary. Girish Chand Sharma&rsquo;s Hindi edition is authoritative for Hindi readers. Ernst Wilhelm&rsquo;s translation takes a more interpretive approach, connecting verses to practical chart reading.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The verse citation format is Chapter.Verse — so &ldquo;BPHS 3.14&rdquo; means Chapter 3, Verse 14. This notation is used throughout Jyotish literature when referencing specific rules. When you encounter a claim in any astrology text, checking the BPHS reference verse often clarifies the original intent.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Which Chapters to Start With</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Beginners:</span> Start with Chapter 3 (planets) and Chapter 4 (signs). Then read Chapters 12-13 (1st and 2nd house results). This gives you enough to begin reading charts.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Intermediate:</span> Add Chapters 34-41 (yogas) and Chapter 46 (Vimshottari Dasha). These unlock predictive capability and timing.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Advanced:</span> Study Chapters 66 (Ashtakavarga), the conditional dashas (47-50), and the remedial chapters (87-97). These refine accuracy and provide actionable guidance.
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Text vs. Practice</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          There is always a gap between textual rules and practical interpretation. BPHS gives categorical statements — &ldquo;Sun in the 7th house causes late marriage&rdquo; — but experienced astrologers know these are tendencies modified by aspects, conjunctions, sign placement, and dasha timing. The text provides the grammar; chart reading provides the poetry. Our app bridges this gap by implementing the precise rules computationally while the tippanni module adds nuanced, context-aware interpretation.
        </p>
      </section>
    </div>
  );
}

export default function Module16_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

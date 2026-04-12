'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_17_4', phase: 5, topic: 'Muhurta', moduleNumber: '17.4',
  title: {
    en: 'Muhurta for Education & Naming',
    hi: 'शिक्षा एवं नामकरण मुहूर्त',
  },
  subtitle: {
    en: 'Vidyarambha (beginning education), Namakarana (naming ceremony), and Upanayana (sacred thread) — nakshatras, syllables, and seasonal rules',
    hi: 'विद्यारम्भ (शिक्षा आरम्भ), नामकरण (नाम संस्कार), और उपनयन (यज्ञोपवीत) — नक्षत्र, अक्षर, और ऋतु नियम',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 17-1: The Science of Timing', hi: 'मॉड्यूल 17-1: समय निर्धारण का विज्ञान' }, href: '/learn/modules/17-1' },
    { label: { en: 'Module 17-2: Muhurta for Marriage', hi: 'मॉड्यूल 17-2: विवाह मुहूर्त' }, href: '/learn/modules/17-2' },
    { label: { en: 'Module 17-3: Muhurta for Property & Travel', hi: 'मॉड्यूल 17-3: सम्पत्ति एवं यात्रा मुहूर्त' }, href: '/learn/modules/17-3' },
    { label: { en: 'Baby Names Tool', hi: 'शिशु नाम उपकरण' }, href: '/baby-names' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q17_4_01', type: 'mcq',
    question: {
      en: 'Which days of the week are ideal for Vidyarambha (beginning education)?',
      hi: 'विद्यारम्भ (शिक्षा आरम्भ) के लिए सप्ताह के कौन-से दिन आदर्श हैं?',
    },
    options: [
      { en: 'Saturday and Tuesday', hi: 'शनिवार और मंगलवार' },
      { en: 'Wednesday and Thursday', hi: 'बुधवार और गुरुवार' },
      { en: 'Sunday and Monday', hi: 'रविवार और सोमवार' },
      { en: 'Friday only', hi: 'केवल शुक्रवार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Wednesday (ruled by Mercury — the planet of intellect, communication, and learning) and Thursday (ruled by Jupiter — the planet of wisdom, knowledge, and the guru) are the ideal days for beginning education. Both planets directly govern the learning process.',
      hi: 'बुधवार (बुध — बुद्धि, संवाद और शिक्षा का ग्रह) और गुरुवार (बृहस्पति — ज्ञान, विद्या और गुरु का ग्रह) शिक्षा आरम्भ के लिए आदर्श दिन हैं। दोनों ग्रह सीधे शिक्षण प्रक्रिया का शासन करते हैं।',
    },
  },
  {
    id: 'q17_4_02', type: 'mcq',
    question: {
      en: 'Which planets should be strong for Vidyarambha muhurta?',
      hi: 'विद्यारम्भ मुहूर्त के लिए कौन-से ग्रह बलवान होने चाहिएँ?',
    },
    options: [
      { en: 'Mars and Saturn', hi: 'मंगल और शनि' },
      { en: 'Mercury and Jupiter', hi: 'बुध और बृहस्पति' },
      { en: 'Venus and Rahu', hi: 'शुक्र और राहु' },
      { en: 'Sun and Ketu', hi: 'सूर्य और केतु' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mercury (Budha) governs intellect, speech, and analytical ability. Jupiter (Guru) governs wisdom, higher knowledge, and the teacher-student relationship. Both should be strong — not debilitated, combust, or in dusthana houses — for the child to thrive in education.',
      hi: 'बुध बुद्धि, वाणी और विश्लेषणात्मक क्षमता का शासन करता है। बृहस्पति ज्ञान, उच्च विद्या और गुरु-शिष्य सम्बन्ध का शासन करता है। दोनों बलवान होने चाहिएँ — नीच, अस्त, या दुष्टस्थान में नहीं।',
    },
  },
  {
    id: 'q17_4_03', type: 'true_false',
    question: {
      en: 'Vasanta Panchami and Akshaya Tritiya are considered especially auspicious for Vidyarambha.',
      hi: 'वसन्त पञ्चमी और अक्षय तृतीया विद्यारम्भ के लिए विशेष रूप से शुभ मानी जाती हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Vasanta Panchami is the festival of Saraswati (goddess of learning) — the most auspicious day to begin education. Akshaya Tritiya is a self-auspicious day (swayam-siddha muhurta) where any activity begun yields lasting results. Both are traditional choices for children\'s first lessons.',
      hi: 'सत्य। वसन्त पञ्चमी सरस्वती (विद्या की देवी) का उत्सव है — शिक्षा आरम्भ के लिए सर्वाधिक शुभ दिन। अक्षय तृतीया स्वयंसिद्ध मुहूर्त है जहाँ कोई भी आरम्भ किया गया कार्य स्थायी परिणाम देता है। दोनों बालकों के प्रथम पाठ के लिए पारम्परिक विकल्प हैं।',
    },
  },
  {
    id: 'q17_4_04', type: 'mcq',
    question: {
      en: 'Which houses should be emphasized for Vidyarambha in the muhurta chart?',
      hi: 'मुहूर्त कुण्डली में विद्यारम्भ के लिए कौन-से भावों पर बल दिया जाना चाहिए?',
    },
    options: [
      { en: '6th and 8th', hi: '6वाँ और 8वाँ' },
      { en: '2nd and 5th', hi: '2रा और 5वाँ' },
      { en: '7th and 12th', hi: '7वाँ और 12वाँ' },
      { en: '3rd and 11th', hi: '3रा और 11वाँ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 2nd house governs speech, early education, and accumulated knowledge. The 5th house governs intelligence, creativity, and higher learning. Both should have benefic influence — strong house lords, benefic aspects, or benefic planet placement — for educational success.',
      hi: '2रा भाव वाणी, प्रारम्भिक शिक्षा और संचित ज्ञान का शासन करता है। 5वाँ भाव बुद्धि, सृजनशीलता और उच्च शिक्षा का शासन करता है। दोनों में शुभ प्रभाव होना चाहिए — बलवान भावेश, शुभ दृष्टि, या शुभ ग्रह स्थिति।',
    },
  },
  {
    id: 'q17_4_05', type: 'mcq',
    question: {
      en: 'When is the Namakarana (naming ceremony) traditionally performed?',
      hi: 'नामकरण संस्कार पारम्परिक रूप से कब सम्पन्न किया जाता है?',
    },
    options: [
      { en: 'Immediately at birth', hi: 'जन्म के तुरन्त बाद' },
      { en: 'On the 11th or 12th day after birth', hi: 'जन्म के 11वें या 12वें दिन' },
      { en: 'On the first birthday', hi: 'प्रथम जन्मदिन पर' },
      { en: 'On the 40th day', hi: '40वें दिन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Namakarana ceremony is traditionally performed on the 11th or 12th day after birth. By this time, the mother has completed the initial post-birth purification period, and the child\'s birth chart has been cast. The name\'s first syllable is determined by the birth nakshatra pada.',
      hi: 'नामकरण संस्कार पारम्परिक रूप से जन्म के 11वें या 12वें दिन सम्पन्न किया जाता है। इस समय तक माता ने प्रसवोत्तर शुद्धिकाल पूर्ण कर लिया होता है, और शिशु की जन्म कुण्डली बना ली गई होती है। नाम का प्रथम अक्षर जन्म नक्षत्र पाद से निर्धारित होता है।',
    },
  },
  {
    id: 'q17_4_06', type: 'mcq',
    question: {
      en: 'In Namakarana, the first syllable of the name comes from:',
      hi: 'नामकरण में नाम का प्रथम अक्षर किससे आता है?',
    },
    options: [
      { en: 'The father\'s name', hi: 'पिता के नाम से' },
      { en: 'The birth nakshatra\'s pada (4 syllables per nakshatra)', hi: 'जन्म नक्षत्र के पाद से (प्रत्येक नक्षत्र में 4 अक्षर)' },
      { en: 'Random selection by the priest', hi: 'पुरोहित द्वारा यादृच्छिक चयन' },
      { en: 'The weekday of birth', hi: 'जन्म के वार से' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each nakshatra has 4 padas, and each pada is assigned a specific syllable. For example, Ashwini: pada 1 = "Chu", pada 2 = "Che", pada 3 = "Cho", pada 4 = "La". The child\'s name should begin with the syllable of their birth nakshatra pada. Our baby-names tool implements this system.',
      hi: 'प्रत्येक नक्षत्र में 4 पाद हैं, और प्रत्येक पाद को एक विशिष्ट अक्षर दिया गया है। उदाहरणार्थ, अश्विनी: पाद 1 = "चु", पाद 2 = "चे", पाद 3 = "चो", पाद 4 = "ला"। शिशु का नाम उनके जन्म नक्षत्र पाद के अक्षर से आरम्भ होना चाहिए।',
    },
  },
  {
    id: 'q17_4_07', type: 'true_false',
    question: {
      en: 'Rahu Kaal should be avoided during the Namakarana ceremony.',
      hi: 'नामकरण संस्कार के दौरान राहु काल से बचना चाहिए।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Rahu Kaal is avoided for all auspicious ceremonies including Namakarana. Additionally, the Moon should be strong (not in 8th or 12th house from natal Moon), and a shubha nakshatra should be running at the time of the ceremony.',
      hi: 'सत्य। नामकरण सहित सभी शुभ संस्कारों में राहु काल से बचा जाता है। इसके अतिरिक्त, चन्द्रमा बलवान होना चाहिए (जन्म चन्द्र से 8वें या 12वें भाव में नहीं), और संस्कार के समय शुभ नक्षत्र चल रहा होना चाहिए।',
    },
  },
  {
    id: 'q17_4_08', type: 'mcq',
    question: {
      en: 'Upanayana (sacred thread ceremony) should ideally be performed when the Sun is in:',
      hi: 'उपनयन (यज्ञोपवीत संस्कार) आदर्श रूप से तब सम्पन्न होना चाहिए जब सूर्य किसमें हो:',
    },
    options: [
      { en: 'Dakshinayana (Sun moving southward)', hi: 'दक्षिणायन (सूर्य दक्षिणगामी)' },
      { en: 'Uttarayana (Sun moving northward, January-June)', hi: 'उत्तरायण (सूर्य उत्तरगामी, जनवरी-जून)' },
      { en: 'During an eclipse', hi: 'ग्रहण के दौरान' },
      { en: 'Any time of year', hi: 'वर्ष का कोई भी समय' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Uttarayana (the Sun\'s northward journey, roughly January to June) is the auspicious half of the year for Upanayana. The Sun is associated with Atman (soul) and spiritual initiation. Its northward movement symbolizes ascending consciousness — appropriate for this spiritual milestone.',
      hi: 'उत्तरायण (सूर्य की उत्तरगामी यात्रा, लगभग जनवरी से जून) उपनयन के लिए वर्ष का शुभ अर्धभाग है। सूर्य आत्मा और आध्यात्मिक दीक्षा से जुड़ा है। इसकी उत्तरगामी गति आरोही चेतना का प्रतीक है — इस आध्यात्मिक मील के पत्थर के लिए उपयुक्त।',
    },
  },
  {
    id: 'q17_4_09', type: 'mcq',
    question: {
      en: 'Which nakshatras are recommended for Upanayana?',
      hi: 'उपनयन के लिए कौन-से नक्षत्र अनुशंसित हैं?',
    },
    options: [
      { en: 'Ardra, Ashlesha, Bharani', hi: 'आर्द्रा, आश्लेषा, भरणी' },
      { en: 'Hasta, Chitra, Swati, Pushya, Dhanishtha, Shravana', hi: 'हस्त, चित्रा, स्वाति, पुष्य, धनिष्ठा, श्रवण' },
      { en: 'Mula, Jyeshtha, Uttara Bhadrapada', hi: 'मूल, ज्येष्ठा, उत्तरा भाद्रपद' },
      { en: 'Only Revati', hi: 'केवल रेवती' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Hasta (skill, devotion), Chitra (brilliance), Swati (independence), Pushya (nourishment), Dhanishtha (wealth of knowledge), and Shravana (hearing/learning — the nakshatra of Saraswati) are the recommended nakshatras for Upanayana. Shravana is especially fitting as Upanayana begins the period of Vedic study through listening.',
      hi: 'हस्त (कौशल, भक्ति), चित्रा (प्रतिभा), स्वाति (स्वतन्त्रता), पुष्य (पोषण), धनिष्ठा (ज्ञान की सम्पत्ति), और श्रवण (श्रवण/शिक्षा — सरस्वती का नक्षत्र) उपनयन के लिए अनुशंसित नक्षत्र हैं। श्रवण विशेष रूप से उपयुक्त है क्योंकि उपनयन श्रवण द्वारा वैदिक अध्ययन का काल आरम्भ करता है।',
    },
  },
  {
    id: 'q17_4_10', type: 'true_false',
    question: {
      en: 'The traditional age for Upanayana varies by varna — Brahmin at 8, Kshatriya at 11, Vaishya at 12.',
      hi: 'उपनयन की पारम्परिक आयु वर्ण के अनुसार भिन्न होती है — ब्राह्मण 8, क्षत्रिय 11, वैश्य 12 वर्ष।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. These are the traditional ages given in Dharmashastra texts. In modern practice, Upanayana is commonly performed between ages 7-12 regardless of family background, often before the boy starts higher education. Some families perform it just before the wedding if not done earlier.',
      hi: 'सत्य। ये धर्मशास्त्र ग्रन्थों में दी गई पारम्परिक आयु हैं। आधुनिक अभ्यास में, उपनयन सामान्यतः 7-12 वर्ष की आयु में पारिवारिक पृष्ठभूमि की परवाह किए बिना सम्पन्न किया जाता है, प्रायः बालक के उच्च शिक्षा आरम्भ करने से पूर्व।',
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
          Vidyarambha — Beginning Education
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vidyarambha (&ldquo;beginning of knowledge&rdquo;) is the ceremony marking a child&rsquo;s formal introduction to learning. Traditionally, the child writes their first letters — often &ldquo;Om&rdquo; or the name of Saraswati — on a plate of rice or a slate. The Muhurta for this event shapes the child&rsquo;s relationship with education throughout their life.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Wednesday (Mercury&rsquo;s day — intellect, communication, analytical ability) and Thursday (Jupiter&rsquo;s day — wisdom, higher knowledge, the guru principle) are the ideal weekdays. Mercury or Jupiter should be strong in the Muhurta chart — not debilitated, combust, or placed in dusthana houses (6th, 8th, 12th).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The 2nd house (speech, early learning) and 5th house (intelligence, creativity, higher learning) should be emphasized — with benefic planets or aspects. The recommended nakshatras are: Ashwini (quick learning), Pushya (nourishment of knowledge), Hasta (manual skill, writing), Shravana (listening, the Vedic learning method), Dhanishtha (mastery), Punarvasu (renewal, returning to knowledge), and Revati (completion of learning).
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Vasanta Panchami — The Supreme Day</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Vasanta Panchami (Shukla Panchami of Magha month, usually in late January or February) is the festival of Saraswati and the most auspicious day for Vidyarambha. It is considered a swayam-siddha muhurta — self-auspicious, requiring no additional Muhurta calculation. Similarly, Akshaya Tritiya (Shukla Tritiya of Vaishakha) is another self-auspicious day where any activity started yields lasting results. Many families specifically wait for one of these days.
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
          Namakarana — The Naming Ceremony
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Namakarana is performed on the 11th or 12th day after birth. The name&rsquo;s first syllable is determined by the birth nakshatra&rsquo;s pada — each nakshatra has 4 padas, each assigned a specific syllable. This creates a deep vibrational link between the child&rsquo;s name, their birth nakshatra, and the cosmic energy present at their birth.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The system is precise: Ashwini pada 1 = &ldquo;Chu&rdquo;, pada 2 = &ldquo;Che&rdquo;, pada 3 = &ldquo;Cho&rdquo;, pada 4 = &ldquo;La&rdquo;. Bharani pada 1 = &ldquo;Li&rdquo;, pada 2 = &ldquo;Lu&rdquo;, pada 3 = &ldquo;Le&rdquo;, pada 4 = &ldquo;Lo&rdquo;. This continues through all 27 nakshatras, giving 108 syllables (27 nakshatras x 4 padas) — mirroring the sacred number 108. Our baby-names tool implements this entire syllable mapping.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For the ceremony itself: the Moon should be strong (waxing preferred), Rahu Kaal must be avoided, and a shubha nakshatra should be running at the ceremony time (not necessarily the birth nakshatra — the ceremony&rsquo;s own nakshatra matters). The father traditionally whispers the chosen name into the child&rsquo;s right ear.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Nakshatra Syllable Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Ashwini:</span> Chu, Che, Cho, La</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Bharani:</span> Li, Lu, Le, Lo</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Krittika:</span> A, I, U, E</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Rohini:</span> O, Va, Vi, Vu</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Mrigashira:</span> Ve, Vo, Ka, Ki</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Many families use the Rashi (zodiac sign) syllable instead of the Nakshatra pada syllable. While the Rashi syllable is acceptable in some traditions, the Nakshatra-pada method is more precise (108 unique syllables vs. 12 sign-based syllables) and is the method recommended by BPHS. Our baby-names tool supports both approaches.
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
          Upanayana — The Sacred Thread Ceremony
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Upanayana (&ldquo;bringing near&rdquo;) is the initiation ceremony where the boy receives the sacred thread (yajnopavita) and begins formal Vedic study. It is one of the most important Samskaras, marking the spiritual &ldquo;second birth&rdquo; — hence the term &ldquo;Dwija&rdquo; (twice-born). The Muhurta for this event sets the tone for the boy&rsquo;s entire spiritual and intellectual development.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Sun must be in Uttarayana (northward journey, roughly January to June). Shukla Paksha is preferred — the waxing Moon symbolizing growth of knowledge and spiritual light. The recommended nakshatras are: Hasta (devotional skill), Chitra (brilliance, creativity), Swati (spiritual independence), Pushya (nourishment), Dhanishtha (wealth of knowledge), and Shravana (hearing — most fitting, as Upanayana initiates the period of learning through listening to the guru).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The traditional age varies by varna: Brahmin at 8 years, Kshatriya at 11, Vaishya at 12. In modern practice, Upanayana is performed between ages 7-12 regardless of background, often timed to coincide with the start of higher education. Some families who missed the traditional window perform it just before the wedding ceremony as a combined samskara.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Upanayana Requirements</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Season:</span> Uttarayana (January-June). Avoid Dakshinayana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Paksha:</span> Shukla Paksha preferred. Avoid Amavasya and Rikta tithis.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Nakshatras:</span> Hasta, Chitra, Swati, Pushya, Dhanishtha, Shravana.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Avoid:</span> Rahu Kaal, Vishti karana, Vyatipata/Vaidhriti yoga.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Planets:</span> Jupiter and Sun strong. Mercury well-placed for intellectual growth.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Adaptations</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Contemporary practice has adapted Upanayana in several ways. The strict age-by-varna rule is rarely followed. Some reformist traditions perform Upanayana for girls as well (historically it was reserved for boys). The ceremony may be shortened from the traditional multi-day format to a single morning. However, the core Muhurta requirements — Uttarayana, Shukla Paksha, suitable nakshatra, strong Jupiter — remain universally observed. The spiritual significance of the ceremony has not changed, even as its social context has evolved.
        </p>
      </section>
    </div>
  );
}

export default function Module17_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

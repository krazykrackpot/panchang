'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

// ─── Module Metadata ────────────────────────────────────────────────────────

const META: ModuleMeta = {
  id: 'mod_1_1',
  phase: 1,
  topic: 'Foundations',
  moduleNumber: '1.1',
  title: { en: 'The Night Sky & The Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त' },
  subtitle: { en: 'Understanding the celestial stage on which all of Jyotish plays out', hi: 'वह खगोलीय मंच समझें जिस पर सम्पूर्ण ज्योतिष प्रदर्शित होता है' },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: '1.2 Measuring the Sky', hi: '1.2 आकाश मापन' }, href: '/learn/modules/1-2' },
    { label: { en: 'Ayanamsha', hi: 'अयनांश' }, href: '/learn/ayanamsha' },
    { label: { en: 'Rashis (Signs)', hi: 'राशियाँ' }, href: '/learn/rashis' },
  ],
};

// ─── Question Bank (10 questions, 5 drawn per attempt) ──────────────────────

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q1_1_01', type: 'mcq',
    question: { en: 'What is the ecliptic?', hi: 'क्रान्तिवृत्त (ecliptic) क्या है?' },
    options: [
      { en: 'The path of the Moon through the sky', hi: 'आकाश में चंद्रमा का मार्ग' },
      { en: 'The apparent annual path of the Sun against the background stars', hi: 'तारों की पृष्ठभूमि पर सूर्य का आभासी वार्षिक मार्ग' },
      { en: 'The boundary between night and day', hi: 'रात और दिन की सीमा' },
      { en: 'The orbit of Earth around the Sun', hi: 'सूर्य के चारों ओर पृथ्वी की कक्षा' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The ecliptic is the apparent path the Sun traces against the background stars over the course of a year. It\'s a great circle tilted 23.5° to the celestial equator, caused by Earth\'s axial tilt. In Sanskrit, it\'s called Kranti-vritta (क्रान्तिवृत्त) — the circle of inclination.', hi: 'क्रान्तिवृत्त वह मार्ग है जो सूर्य एक वर्ष में तारों की पृष्ठभूमि पर बनाता प्रतीत होता है। यह खगोलीय भूमध्य रेखा से 23.5° झुका हुआ है।' },
    classicalRef: 'Surya Siddhanta Ch.1',
  },
  {
    id: 'q1_1_02', type: 'mcq',
    question: { en: 'Why do all planets appear near the ecliptic and never far from it?', hi: 'सभी ग्रह क्रान्तिवृत्त के पास ही क्यों दिखते हैं, कभी दूर नहीं?' },
    options: [
      { en: 'Because they all orbit in roughly the same plane as Earth', hi: 'क्योंकि वे सभी पृथ्वी के समान तल में कक्षा करते हैं' },
      { en: 'Because they are attracted to the Sun\'s magnetic field', hi: 'क्योंकि वे सूर्य के चुंबकीय क्षेत्र से आकर्षित होते हैं' },
      { en: 'Because they are all at the same distance from Earth', hi: 'क्योंकि वे सभी पृथ्वी से समान दूरी पर हैं' },
      { en: 'Because of an optical illusion', hi: 'एक दृष्टि भ्रम के कारण' },
    ],
    correctAnswer: 0,
    explanation: { en: 'The solar system formed from a flat disk of gas and dust (the solar nebula). All planets orbit in nearly the same plane, deviating at most 7° from the ecliptic. This is why you will NEVER find Jupiter in Ursa Major — it\'s too far from the ecliptic plane.', hi: 'सौर मंडल एक सपाट गैस और धूल की डिस्क से बना। सभी ग्रह लगभग एक ही तल में कक्षा करते हैं, क्रान्तिवृत्त से अधिकतम 7° विचलन।' },
  },
  {
    id: 'q1_1_03', type: 'mcq',
    question: { en: 'What angle is Earth\'s axis tilted relative to its orbital plane?', hi: 'पृथ्वी की धुरी अपने कक्षीय तल से कितने अंश झुकी है?' },
    options: [
      { en: '15.5°', hi: '15.5°' },
      { en: '23.5°', hi: '23.5°' },
      { en: '45°', hi: '45°' },
      { en: '90°', hi: '90°' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Earth\'s axial tilt is 23.5° (also called the obliquity of the ecliptic). This tilt causes the seasons and is the reason the ecliptic is inclined to the celestial equator. It also causes the phenomenon of precession over 25,772 years.', hi: 'पृथ्वी का अक्षीय झुकाव 23.5° है। यह झुकाव ऋतुओं का कारण है और 25,772 वर्षों में अयनगति (precession) का भी।' },
    classicalRef: 'Aryabhatiya, Golapada',
  },
  {
    id: 'q1_1_04', type: 'true_false',
    question: { en: 'The ecliptic and the celestial equator are the same circle.', hi: 'क्रान्तिवृत्त और खगोलीय भूमध्य रेखा एक ही वृत्त हैं।' },
    correctAnswer: false,
    explanation: { en: 'They are two different great circles on the celestial sphere, tilted 23.5° to each other. They intersect at two points called the equinoxes (Vernal and Autumnal). The ecliptic is the Sun\'s path; the celestial equator is the projection of Earth\'s equator.', hi: 'ये दो अलग-अलग वृत्त हैं, एक दूसरे से 23.5° झुके। वे दो बिंदुओं — विषुवों (vernal & autumnal equinox) — पर मिलते हैं।' },
  },
  {
    id: 'q1_1_05', type: 'mcq',
    question: { en: 'The Sanskrit term for the ecliptic is:', hi: 'क्रान्तिवृत्त (ecliptic) का संस्कृत नाम है:' },
    options: [
      { en: 'Bhagola (भगोल)', hi: 'भगोल' },
      { en: 'Kranti-vritta (क्रान्तिवृत्त)', hi: 'क्रान्तिवृत्त' },
      { en: 'Kha-gola (खगोल)', hi: 'खगोल' },
      { en: 'Rashi-chakra (राशिचक्र)', hi: 'राशिचक्र' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Kranti-vritta (क्रान्तिवृत्त) means "the circle of inclination" — Kranti = inclination/declination, Vritta = circle. Kha-gola means celestial sphere, Bhagola means the sphere of stars, and Rashi-chakra means the zodiac circle (which lies ON the ecliptic).', hi: 'क्रान्तिवृत्त = क्रान्ति (झुकाव) + वृत्त (वृत्त)। खगोल = आकाशीय गोला, भगोल = तारा गोला, राशिचक्र = राशियों का चक्र (जो क्रान्तिवृत्त पर है)।' },
    classicalRef: 'Surya Siddhanta Ch.12',
  },
  {
    id: 'q1_1_06', type: 'mcq',
    question: { en: 'If someone says "Mars is in Ursa Major tonight," what can you conclude?', hi: 'यदि कोई कहे "आज रात मंगल सप्तर्षि (Ursa Major) में है," तो आप क्या निष्कर्ष निकालेंगे?' },
    options: [
      { en: 'They made a rare and important observation', hi: 'उन्होंने एक दुर्लभ और महत्वपूर्ण अवलोकन किया' },
      { en: 'This is impossible — Mars stays near the ecliptic, and Ursa Major is far from it', hi: 'यह असंभव है — मंगल क्रान्तिवृत्त के पास रहता है, और सप्तर्षि इससे बहुत दूर है' },
      { en: 'Mars must be retrograde', hi: 'मंगल वक्री होगा' },
      { en: 'This happens every 12 years', hi: 'यह हर 12 वर्ष में होता है' },
    ],
    correctAnswer: 1,
    explanation: { en: 'This is physically impossible. All planets orbit within ~7° of the ecliptic plane. Ursa Major is near the north celestial pole, roughly 60-90° from the ecliptic. No planet can ever appear there. This is a key test of understanding — the ecliptic constrains WHERE planets can be.', hi: 'यह भौतिक रूप से असंभव है। सभी ग्रह क्रान्तिवृत्त से ~7° के भीतर कक्षा करते हैं। सप्तर्षि उत्तरी ध्रुव के पास है, क्रान्तिवृत्त से 60-90° दूर।' },
  },
  {
    id: 'q1_1_07', type: 'true_false',
    question: { en: 'The zodiac belt extends about 8° on either side of the ecliptic, forming a 16°-wide band.', hi: 'राशिचक्र पट्टी क्रान्तिवृत्त के दोनों ओर लगभग 8° तक विस्तृत है, 16° चौड़ी पट्टी बनाती है।' },
    correctAnswer: true,
    explanation: { en: 'Correct. The zodiac belt is approximately 8° on each side of the ecliptic (total ~16° wide). This accommodates the slight orbital inclinations of all planets. The Moon deviates the most at about 5°. The belt is the "highway" — only within this zone do planets travel.', hi: 'सही। राशिचक्र पट्टी क्रान्तिवृत्त के दोनों ओर ~8° है (कुल ~16° चौड़ी)। चंद्रमा सबसे अधिक ~5° विचलन करता है।' },
  },
  {
    id: 'q1_1_08', type: 'mcq',
    question: { en: 'What causes Earth to have seasons?', hi: 'पृथ्वी पर ऋतुएं किसके कारण होती हैं?' },
    options: [
      { en: 'Earth\'s varying distance from the Sun', hi: 'सूर्य से पृथ्वी की बदलती दूरी' },
      { en: 'Earth\'s 23.5° axial tilt', hi: 'पृथ्वी का 23.5° अक्षीय झुकाव' },
      { en: 'The Moon\'s gravitational influence', hi: 'चंद्रमा का गुरुत्वाकर्षण प्रभाव' },
      { en: 'Solar flares', hi: 'सौर ज्वालाएं' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Earth\'s 23.5° tilt causes different hemispheres to receive more direct sunlight at different times of year. In Jyotish, this creates the two Ayanas: Uttarayana (Sun moving northward, Jan-Jun) and Dakshinayana (Sun moving southward, Jul-Dec). Interestingly, Earth is actually CLOSEST to the Sun in January (northern winter).', hi: '23.5° झुकाव के कारण वर्ष के विभिन्न समय में विभिन्न गोलार्ध अधिक सीधी धूप प्राप्त करते हैं। ज्योतिष में यह दो अयन बनाता है: उत्तरायण और दक्षिणायन।' },
    classicalRef: 'Surya Siddhanta Ch.14',
  },
  {
    id: 'q1_1_09', type: 'mcq',
    question: { en: 'The Surya Siddhanta authors knew about the ecliptic without telescopes because:', hi: 'सूर्य सिद्धान्त के लेखक बिना दूरबीन के क्रान्तिवृत्त जानते थे क्योंकि:' },
    options: [
      { en: 'They used alien technology', hi: 'उन्होंने परग्रही तकनीक प्रयोग की' },
      { en: 'They tracked the Sun\'s position against stars at dawn/dusk over years', hi: 'उन्होंने वर्षों में सुबह/शाम तारों के विरुद्ध सूर्य की स्थिति देखी' },
      { en: 'It was revealed in meditation', hi: 'ध्यान में प्रकट हुआ' },
      { en: 'They guessed correctly', hi: 'उन्होंने सही अनुमान लगाया' },
    ],
    correctAnswer: 1,
    explanation: { en: 'By observing which stars were visible just before sunrise and after sunset over many years, ancient astronomers mapped the Sun\'s annual path through the zodiac. The heliacal risings (stars appearing just before dawn) shift by about 1° per day, tracing the full ecliptic over a year. This required decades of careful observation, not guesswork.', hi: 'वर्षों तक सूर्योदय से पहले और सूर्यास्त के बाद कौन से तारे दिखते हैं — इसका अवलोकन कर प्राचीन खगोलशास्त्रियों ने सूर्य का वार्षिक मार्ग मानचित्रित किया।' },
    classicalRef: 'Surya Siddhanta Ch.1 v.1-10',
  },
  {
    id: 'q1_1_10', type: 'true_false',
    question: { en: 'Uttarayana begins when the Sun starts moving northward (around January 14, Makar Sankranti).', hi: 'उत्तरायण तब आरम्भ होता है जब सूर्य उत्तर की ओर बढ़ना शुरू करता है (लगभग 14 जनवरी, मकर संक्रांति)।' },
    correctAnswer: true,
    explanation: { en: 'Correct. Uttarayana (उत्तर + अयन = northward journey) begins at Makar Sankranti when the Sun enters Capricorn (sidereal). From this point, the Sun moves northward in declination until the summer solstice. Dakshinayana begins ~July 16 when the Sun enters sidereal Cancer. Uttarayana is considered more auspicious — Bhishma waited for Uttarayana to leave his body.', hi: 'सही। उत्तरायण मकर संक्रांति पर आरम्भ — सूर्य उत्तर दिशा में। भीष्म ने शरीर त्यागने के लिए उत्तरायण की प्रतीक्षा की।' },
    classicalRef: 'Bhagavad Gita 8.24, Surya Siddhanta',
  },
];

// ─── Content Pages ──────────────────────────────────────────────────────────

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* 1. Conceptual Introduction */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>What Did Ancient Indians See?</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Imagine standing in an open field in ancient Bharatavarsha, 3,000 years ago. No light pollution, no buildings — just the immense dome of the night sky. You see thousands of stars, apparently fixed in their positions night after night, slowly wheeling around the sky as the night progresses.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          But if you watch carefully over weeks and months, you notice something extraordinary: a handful of "stars" — five of them, plus the Sun and Moon — <span className="text-gold-light font-medium">move</span> against this fixed backdrop. They wander through the star field, sometimes speeding up, sometimes slowing down, and occasionally even appearing to move <span className="text-gold-light font-medium">backward</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The ancient Sanskrit word for these wanderers is <span className="text-gold-light font-bold">Graha</span> (ग्रह) — literally "that which grasps or seizes." Not just "planet" — a Graha <em>seizes</em> your fate. This is not casual naming. The Greeks called them "planetes" (πλανήτης) — "wanderers." The Indian term is more active, more intentional. A Graha doesn't just wander — it <em>acts on you</em>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          But here's the critical observation that underpins ALL of Jyotish: these Grahas don't wander randomly across the entire sky. They are confined to a <span className="text-gold-light font-medium">narrow belt</span> — a highway approximately 16° wide. This belt is defined by the <span className="text-gold-light font-bold">ecliptic</span>, and understanding it is the absolute first step in learning Jyotish.
        </p>
      </section>

      {/* 2. Classical Origin */}
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The ecliptic is called <span className="text-gold-light font-bold">Kranti-vritta</span> (क्रान्तिवृत्त) in Sanskrit — <em>Kranti</em> means inclination or declination, <em>Vritta</em> means circle. The "circle of inclination" — named for its 23.5° tilt relative to the celestial equator.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The <span className="text-gold-light">Surya Siddhanta</span> (Chapter 1) opens with the concept of the Bhagola (sphere of stars) and the Kranti-vritta within it. The <span className="text-gold-light">Aryabhatiya</span> (499 CE) refined the measurement, and Aryabhata correctly stated that the apparent motion of stars is due to Earth's rotation — a millennium before Copernicus.
        </p>
        <p className="text-text-secondary text-xs text-text-tertiary">
          The celestial sphere itself is called <span className="text-gold-light">Khagola</span> (खगोल) — Kha = sky/space, Gola = sphere. The word "Khagol-shastra" (खगोलशास्त्र) — the science of the celestial sphere — is the Sanskrit term for astronomy.
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
      {/* 3. Detailed Explanation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Ecliptic — Earth's Orbital Plane Projected Onto the Sky</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The ecliptic is the <span className="text-gold-light font-medium">apparent path of the Sun</span> across the sky over the course of one year. "Apparent" because it's actually Earth that moves — we orbit the Sun, and from our perspective, the Sun appears to travel through the background stars, completing one full circuit in ~365.25 days.
        </p>

        {/* Diagram: Ecliptic vs Equator */}
        <div className="glass-card rounded-xl p-4 border border-gold-primary/10 mb-4">
          <svg viewBox="0 0 500 280" className="w-full max-w-lg mx-auto">
            {/* Celestial equator */}
            <ellipse cx="250" cy="140" rx="220" ry="60" fill="none" stroke="#4a9eff" strokeWidth="1.5" opacity="0.4" />
            <text x="470" y="145" fill="#4a9eff" fontSize="9" textAnchor="end">Celestial Equator</text>

            {/* Ecliptic - tilted */}
            <ellipse cx="250" cy="140" rx="220" ry="60" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.6"
              transform="rotate(-23.5, 250, 140)" />
            <text x="420" y="60" fill="#f0d48a" fontSize="9">Ecliptic (Kranti-vritta)</text>

            {/* Tilt angle */}
            <line x1="250" y1="140" x2="250" y2="80" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <line x1="250" y1="140" x2="270" y2="85" stroke="#f0d48a" strokeWidth="0.5" opacity="0.5" />
            <path d="M 250 100 Q 255 95 260 92" fill="none" stroke="#ff6b6b" strokeWidth="0.8" />
            <text x="265" y="100" fill="#ff6b6b" fontSize="8">23.5°</text>

            {/* Equinox points */}
            <circle cx="470" cy="140" r="4" fill="#2ecc71" />
            <text x="470" y="130" textAnchor="middle" fill="#2ecc71" fontSize="7">Vernal Equinox</text>
            <circle cx="30" cy="140" r="4" fill="#e74c3c" />
            <text x="30" y="130" textAnchor="middle" fill="#e74c3c" fontSize="7">Autumnal Equinox</text>

            {/* Sun on ecliptic */}
            <circle cx="380" cy="95" r="8" fill="#e67e22" opacity="0.8" />
            <text x="380" y="85" textAnchor="middle" fill="#e67e22" fontSize="7">Sun</text>

            {/* Zodiac belt */}
            <text x="250" y="220" textAnchor="middle" fill="#f0d48a" fontSize="8" opacity="0.4">← 16° wide zodiac belt →</text>

            {/* Planet dots near ecliptic */}
            <circle cx="150" cy="155" r="3" fill="#e74c3c" opacity="0.7" /><text x="160" y="160" fill="#e74c3c" fontSize="6">Mars</text>
            <circle cx="300" cy="108" r="3" fill="#f39c12" opacity="0.7" /><text x="310" y="113" fill="#f39c12" fontSize="6">Jupiter</text>
          </svg>
          <p className="text-text-tertiary text-[10px] text-center mt-1">The ecliptic (gold) tilted 23.5° from the celestial equator (blue). Planets stay within ~8° of the ecliptic.</p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Why 23.5°?</span> Earth's axis of rotation is tilted 23.5° relative to its orbital plane. This means the plane of Earth's orbit (projected onto the sky as the ecliptic) is tilted 23.5° from the celestial equator (the projection of Earth's equator). This tilt is called the <span className="text-gold-light">obliquity of the ecliptic</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">The consequences are profound:</span>
        </p>
        <ul className="text-text-secondary text-sm space-y-1.5 ml-4">
          <li>• <span className="text-gold-light">Seasons</span> — Different hemispheres receive different amounts of sunlight throughout the year</li>
          <li>• <span className="text-gold-light">Uttarayana & Dakshinayana</span> — The Sun's apparent northward and southward journeys, which define the Hindu year's two halves</li>
          <li>• <span className="text-gold-light">Precession</span> — The 23.5° tilt slowly wobbles over 25,772 years, causing the Ayanamsha to change</li>
          <li>• <span className="text-gold-light">Variable day length</span> — Dinamana (day duration) changes throughout the year, affecting muhurta calculations</li>
        </ul>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* The Zodiac Belt */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Zodiac Belt — A 16° Highway in the Sky</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The solar system formed from a flat rotating disk of gas and dust about 4.6 billion years ago. Because of this common origin, all planets orbit the Sun in approximately the same plane — deviating at most 7° from the ecliptic (Mercury has the highest inclination at 7°, most others are within 2-3°).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This means that from Earth's perspective, all planets are confined to a band about <span className="text-gold-light font-bold">8° on either side of the ecliptic</span> — a 16°-wide belt. This belt is the <span className="text-gold-light font-bold">zodiac</span> (राशिचक्र, Rashi-chakra). Every planet, the Sun, and the Moon are ALWAYS found within this belt. You will never see Mars in Ursa Major or Jupiter near Polaris — they are physically constrained to the zodiac highway.
        </p>
      </section>

      {/* 5. Worked Examples */}
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>

        <div className="space-y-4">
          <div>
            <p className="text-gold-light text-sm font-medium mb-1">Example 1: Where is the Sun in April?</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              In mid-April, the Sun is at roughly 0° sidereal Aries (after subtracting the ~24° ayanamsha from its tropical position of ~24° Aries). The Sun rises in the east, crosses overhead, and sets in the west — but against the background stars, it's positioned among the stars of the constellation Pisces/Aries (remember, constellations and signs are offset by the ayanamsha). At dawn and dusk, the zodiacal constellations adjacent to the Sun's position are visible.
            </p>
          </div>

          <div>
            <p className="text-gold-light text-sm font-medium mb-1">Example 2: Why can't a planet be in Ursa Major?</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              Ursa Major (Saptarishi Mandal/सप्तर्षि मंडल) is located at about +55° to +65° declination — roughly 60° north of the ecliptic. Since planets never deviate more than ~8° from the ecliptic, they physically cannot appear there. If someone claims to have seen Venus "in the Big Dipper," they've either misidentified the star or the constellation. This is a fundamental constraint that ancient astronomers understood perfectly.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Common Misconceptions */}
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Planets move across the entire sky."<br />
          <span className="text-emerald-300">Reality:</span> Planets are confined to the ~16° zodiac belt. They NEVER appear more than ~8° from the ecliptic.</p>

          <p><span className="text-red-300 font-bold">Misconception:</span> "Seasons are caused by Earth being closer to the Sun in summer."<br />
          <span className="text-emerald-300">Reality:</span> Earth is actually closest to the Sun in January (northern winter)! Seasons are caused by the 23.5° axial tilt.</p>

          <p><span className="text-red-300 font-bold">Misconception:</span> "The ecliptic was discovered by the Greeks."<br />
          <span className="text-emerald-300">Reality:</span> The ecliptic (Kranti-vritta) was independently described in the Surya Siddhanta and Vedanga Jyotisha, predating or contemporaneous with Greek sources.</p>
        </div>
      </section>

      {/* 7. Modern Relevance */}
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">Still completely valid.</span> The ecliptic is a fundamental astronomical concept used by NASA, ESA, and every space agency. The obliquity of 23.5° is measured with sub-arcsecond precision by modern instruments. The Surya Siddhanta's description of the ecliptic is physically correct — only its precession model (trepidation instead of steady precession) was incorrect.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app uses the ecliptic as the foundation for ALL calculations. When we compute the Sun's longitude, Moon's longitude, or any planet's position, we're computing their position <em>along the ecliptic</em>. The 360° circle of Jyotish IS the ecliptic circle, divided into 12 Rashis of 30° each and 27 Nakshatras of 13°20' each.
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module1_1Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}

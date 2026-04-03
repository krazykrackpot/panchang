'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_0_6', phase: 0, topic: 'Foundations', moduleNumber: '0.6',
  title: { en: 'How Hindu Rituals Connect to Astronomy', hi: 'हिन्दू कर्मकाण्ड और खगोलशास्त्र का सम्बन्ध' },
  subtitle: {
    en: 'Every festival, fast, and puja has an astronomical basis — here\'s the science behind the tradition',
    hi: 'प्रत्येक त्योहार, व्रत और पूजा का खगोलीय आधार है — परम्परा के पीछे का विज्ञान',
  },
  estimatedMinutes: 10,
  crossRefs: [
    { label: { en: 'Module 1-1: The Ecliptic & Degrees', hi: 'मॉड्यूल 1-1: क्रान्तिवृत्त और अंश' }, href: '/learn/modules/1-1' },
    { label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' }, href: '/panchang' },
    { label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ' }, href: '/kundali' },
    { label: { en: 'Sankalpa Generator', hi: 'संकल्प जनक' }, href: '/sankalpa' },
    { label: { en: 'Muhurta AI', hi: 'मुहूर्त AI' }, href: '/muhurta-ai' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q0_6_01', type: 'mcq',
    question: {
      en: 'What is the astronomical basis of Ekadashi fasting (11th tithi)?',
      hi: 'एकादशी व्रत (11वीं तिथि) का खगोलीय आधार क्या है?',
    },
    options: [
      { en: 'The Sun is at its brightest', hi: 'सूर्य सबसे तेज होता है' },
      { en: 'Moon-Sun elongation is 120°-132°, affecting tidal forces', hi: 'चन्द्र-सूर्य कोण 120°-132° होता है, ज्वारीय बलों को प्रभावित करता है' },
      { en: 'Mars is in opposition', hi: 'मंगल प्रतियोग में होता है' },
      { en: 'An eclipse is occurring', hi: 'ग्रहण हो रहा होता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'On Ekadashi, the Moon-Sun elongation is between 120°-132°. The Moon\'s gravitational pull on Earth\'s water is at a specific phase. Ayurveda links this to digestive changes, recommending fasting.',
      hi: 'एकादशी पर चन्द्र-सूर्य कोण 120°-132° के बीच होता है। पृथ्वी के जल पर चन्द्रमा का गुरुत्वाकर्षण एक विशेष चरण में होता है। आयुर्वेद इसे पाचन परिवर्तनों से जोड़ता है और उपवास की सलाह देता है।',
    },
  },
  {
    id: 'q0_6_02', type: 'true_false',
    question: {
      en: 'Aryabhata correctly explained in 499 CE that the Moon shines by reflected sunlight and eclipses are caused by Earth\'s shadow.',
      hi: 'आर्यभट ने 499 ई. में सही ढंग से समझाया कि चन्द्रमा परावर्तित सूर्य प्रकाश से चमकता है और ग्रहण पृथ्वी की छाया से होते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Aryabhata wrote in his Aryabhatiya (499 CE) that the Moon and planets shine by reflected sunlight, and that eclipses are caused by Earth\'s shadow on the Moon (lunar) or Moon\'s shadow on Earth (solar) — while Europe was in the Dark Ages.',
      hi: 'सत्य। आर्यभट ने अपनी आर्यभटीय (499 ई.) में लिखा कि चन्द्रमा और ग्रह परावर्तित सूर्य प्रकाश से चमकते हैं, और ग्रहण पृथ्वी की छाया (चन्द्र ग्रहण) या चन्द्रमा की छाया (सूर्य ग्रहण) से होते हैं — जब यूरोप अन्धकार युग में था।',
    },
  },
  {
    id: 'q0_6_03', type: 'mcq',
    question: {
      en: 'Why is Hanuman worshipped specifically on Tuesday (Mangalavara)?',
      hi: 'हनुमान की पूजा विशेष रूप से मंगलवार (मंगलवार) को क्यों होती है?',
    },
    options: [
      { en: 'It\'s a random tradition with no astrological basis', hi: 'यह बिना ज्योतिषीय आधार की यादृच्छिक परम्परा है' },
      { en: 'Tuesday is Mars-day; Mars rules courage and warfare; Hanuman is the warrior-deity', hi: 'मंगलवार मंगल-दिवस है; मंगल साहस और युद्ध का शासक है; हनुमान योद्धा-देवता हैं' },
      { en: 'Hanuman was born on a Tuesday', hi: 'हनुमान का जन्म मंगलवार को हुआ था' },
      { en: 'The Moon is strongest on Tuesdays', hi: 'मंगलवार को चन्द्रमा सबसे बलवान होता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mangalavara (Tuesday) is ruled by Mars (Mangala), the planet of courage, energy, and conflict. Hanuman embodies Mars qualities — strength, valor, devotion. Worshipping Hanuman on Mars-day = invoking Mars energy through the warrior-deity.',
      hi: 'मंगलवार मंगल ग्रह द्वारा शासित है, जो साहस, ऊर्जा और संघर्ष का ग्रह है। हनुमान मंगल गुणों के मूर्तिमान रूप हैं — बल, पराक्रम, भक्ति। मंगल-दिवस पर हनुमान पूजा = योद्धा-देवता के माध्यम से मंगल ऊर्जा का आह्वान।',
    },
  },
  {
    id: 'q0_6_04', type: 'mcq',
    question: {
      en: 'What does the Sankalpa before a puja essentially declare?',
      hi: 'पूजा से पहले संकल्प मूलतः क्या घोषित करता है?',
    },
    options: [
      { en: 'The amount of donation being offered', hi: 'दान की राशि' },
      { en: 'A cosmic timestamp — the exact astronomical moment of the vow', hi: 'एक ब्रह्माण्डीय समय-चिह्न — प्रतिज्ञा का सटीक खगोलीय क्षण' },
      { en: 'The names of attending family members', hi: 'उपस्थित परिवार के सदस्यों के नाम' },
      { en: 'A prayer for forgiveness of sins', hi: 'पापों की क्षमा की प्रार्थना' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A Sankalpa states the samvatsara, ayana, ritu, masa, paksha, tithi, vara, and nakshatra — literally declaring "at THIS precise astronomical moment, I make this vow." It is a cosmic timestamp for your intention.',
      hi: 'संकल्प में सम्वत्सर, अयन, ऋतु, मास, पक्ष, तिथि, वार और नक्षत्र कहा जाता है — शाब्दिक रूप से "इस सटीक खगोलीय क्षण पर, मैं यह प्रतिज्ञा करता हूँ।" यह आपके संकल्प का ब्रह्माण्डीय समय-चिह्न है।',
    },
  },
  {
    id: 'q0_6_05', type: 'true_false',
    question: {
      en: 'The Surya Siddhanta describes a time unit called "truti" which equals approximately 29.6 microseconds.',
      hi: 'सूर्य सिद्धान्त "त्रुटि" नामक समय इकाई का वर्णन करता है जो लगभग 29.6 माइक्रोसेकण्ड के बराबर है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Surya Siddhanta describes time from the truti (29.6 microseconds) up to the kalpa (4.32 billion years — remarkably close to Earth\'s actual age of 4.54 billion years). This scale of thinking was unique to Indian civilization.',
      hi: 'सत्य। सूर्य सिद्धान्त त्रुटि (29.6 माइक्रोसेकण्ड) से कल्प (4.32 अरब वर्ष — पृथ्वी की वास्तविक आयु 4.54 अरब वर्ष के उल्लेखनीय रूप से निकट) तक समय का वर्णन करता है। विचार का यह पैमाना भारतीय सभ्यता की विशेषता था।',
    },
  },
  {
    id: 'q0_6_06', type: 'mcq',
    question: {
      en: 'What astronomical condition is required for a good marriage muhurta?',
      hi: 'शुभ विवाह मुहूर्त के लिए कौन-सी खगोलीय शर्त आवश्यक है?',
    },
    options: [
      { en: 'Only the bride\'s birth chart matters', hi: 'केवल वधू की जन्म कुण्डली महत्त्वपूर्ण है' },
      { en: 'Moon in gentle nakshatra, Venus not combust, Jupiter aspecting 7th house, no Rahu Kaal', hi: 'सौम्य नक्षत्र में चन्द्रमा, शुक्र अस्त नहीं, गुरु की 7वें भाव पर दृष्टि, राहु काल नहीं' },
      { en: 'It must be a Sunday', hi: 'रविवार होना चाहिए' },
      { en: 'All planets must be in one sign', hi: 'सभी ग्रह एक राशि में होने चाहिए' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A marriage muhurta requires multiple astronomical conditions: Moon in a gentle nakshatra (like Rohini or Revati), Venus visible (not combust by Sun proximity), Jupiter aspecting the 7th house of marriage, and the time should not fall in Rahu Kaal.',
      hi: 'विवाह मुहूर्त के लिए अनेक खगोलीय शर्तें चाहिए: सौम्य नक्षत्र (जैसे रोहिणी या रेवती) में चन्द्रमा, शुक्र दृश्य (सूर्य की निकटता से अस्त नहीं), गुरु की विवाह के 7वें भाव पर दृष्टि, और राहु काल में न हो।',
    },
  },
  {
    id: 'q0_6_07', type: 'mcq',
    question: {
      en: 'On Purnima (full moon), the Moon is:',
      hi: 'पूर्णिमा पर चन्द्रमा:',
    },
    options: [
      { en: 'Conjunct (next to) the Sun', hi: 'सूर्य के साथ (युति में)' },
      { en: 'Directly opposite the Sun', hi: 'सूर्य के ठीक विपरीत' },
      { en: '90° from the Sun', hi: 'सूर्य से 90° पर' },
      { en: 'At its closest to Earth', hi: 'पृथ्वी के सबसे निकट' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'On Purnima, the Moon is directly opposite the Sun (180° elongation). Maximum reflected light reaches Earth. Tidal forces peak. Vedic thought considers the mind (manas) most active at this time.',
      hi: 'पूर्णिमा पर चन्द्रमा सूर्य के ठीक विपरीत (180° कोण) होता है। अधिकतम परावर्तित प्रकाश पृथ्वी पर आता है। ज्वारीय बल चरम पर होते हैं। वैदिक विचार में इस समय मन (मानस) सर्वाधिक सक्रिय माना जाता है।',
    },
  },
  {
    id: 'q0_6_08', type: 'true_false',
    question: {
      en: 'Amavasya (new moon) is traditionally associated with ancestor remembrance (Pitru Tarpana) because the Moon is invisible — conjunct with the Sun.',
      hi: 'अमावस्या (अमावस) पारम्परिक रूप से पितृ तर्पण से जुड़ी है क्योंकि चन्द्रमा अदृश्य होता है — सूर्य के साथ युति में।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. On Amavasya, the Moon is conjunct the Sun (0° elongation) and invisible. This "darkest" time is associated with ancestor remembrance. The astronomical alignment is precise; the cultural meaning layers onto the observable phenomenon.',
      hi: 'सत्य। अमावस्या पर चन्द्रमा सूर्य के साथ युति (0° कोण) में और अदृश्य होता है। यह "सबसे अँधेरा" समय पितृ स्मरण से जुड़ा है। खगोलीय संरेखण सटीक है; सांस्कृतिक अर्थ प्रेक्षणीय घटना पर आधारित है।',
    },
  },
  {
    id: 'q0_6_09', type: 'mcq',
    question: {
      en: 'The Surya Siddhanta\'s "kalpa" (4.32 billion years) is remarkably close to:',
      hi: 'सूर्य सिद्धान्त का "कल्प" (4.32 अरब वर्ष) किसके उल्लेखनीय रूप से निकट है?',
    },
    options: [
      { en: 'The age of the Moon (4.5 billion years)', hi: 'चन्द्रमा की आयु (4.5 अरब वर्ष)' },
      { en: 'Earth\'s actual age (4.54 billion years)', hi: 'पृथ्वी की वास्तविक आयु (4.54 अरब वर्ष)' },
      { en: 'The age of the Universe (13.8 billion years)', hi: 'ब्रह्माण्ड की आयु (13.8 अरब वर्ष)' },
      { en: 'The Sun\'s expected lifespan (10 billion years)', hi: 'सूर्य की अपेक्षित आयु (10 अरब वर्ष)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The kalpa of 4.32 billion years is remarkably close to Earth\'s scientifically determined age of 4.54 billion years. This scale of cosmic thinking — from microseconds to billions of years — was unique to Indian astronomical tradition.',
      hi: 'कल्प (4.32 अरब वर्ष) पृथ्वी की वैज्ञानिक रूप से निर्धारित आयु 4.54 अरब वर्ष के उल्लेखनीय रूप से निकट है। माइक्रोसेकण्ड से अरबों वर्षों तक ब्रह्माण्डीय चिन्तन का यह पैमाना भारतीय खगोलीय परम्परा की विशेषता थी।',
    },
  },
  {
    id: 'q0_6_10', type: 'mcq',
    question: {
      en: 'Saturday (Shanivara) is associated with visits to Shani temples because:',
      hi: 'शनिवार (शनिवार) शनि मन्दिर दर्शन से जुड़ा है क्योंकि:',
    },
    options: [
      { en: 'Saturn is visible only on Saturdays', hi: 'शनि केवल शनिवार को दिखता है' },
      { en: 'Saturn rules discipline, karma, and hardship — Saturday worship acknowledges Saturn\'s lessons', hi: 'शनि अनुशासन, कर्म और कठिनाई का शासक है — शनिवार की पूजा शनि के पाठों को स्वीकार करती है' },
      { en: 'Temples are only open on Saturdays', hi: 'मन्दिर केवल शनिवार को खुलते हैं' },
      { en: 'It is the only day without Rahu Kaal', hi: 'यह बिना राहु काल का एकमात्र दिन है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shanivara (Saturday) is Saturn\'s day. Saturn governs discipline, karma, perseverance, and life\'s hardships. Visiting Shani temples on Saturday is a way of acknowledging and working with Saturn\'s lessons — not avoiding them.',
      hi: 'शनिवार शनि का दिन है। शनि अनुशासन, कर्म, धैर्य और जीवन की कठिनाइयों का शासक है। शनिवार को शनि मन्दिर जाना शनि के पाठों को स्वीकार करने और उनके साथ कार्य करने का तरीका है — उनसे बचने का नहीं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section className="glass-card rounded-xl p-5 border border-cyan-400/20 bg-gradient-to-br from-cyan-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'यह बात आपको चौंका सकती है: आपके दादा-दादी जो भी हिन्दू कर्मकाण्ड करते हैं, उसके नीचे एक खगोलीय गणना चल रही है। जब आपकी माँ दिवाली पर सूर्यास्त में दीप जलाती हैं, वे कार्तिक अमावस्या पर सटीक सौर स्थिति चिह्नित कर रही हैं। जब पण्डित आपकी शादी की तारीख चुनता है, वह 7 खगोलीय मापदण्डों पर बहु-चर अनुकूलन समस्या हल कर रहा है। जब आप एकादशी का व्रत रखते हैं, आप एक विशिष्ट चन्द्र-सूर्य कोणीय सम्बन्ध पर प्रतिक्रिया दे रहे हैं। इनमें कुछ भी यादृच्छिक परम्परा नहीं है — यह व्यावहारिक खगोलशास्त्र है।'
            : 'Here\'s something that might surprise you: every Hindu ritual your grandparents perform has an astronomical calculation running underneath it. When your mother lights a lamp at sunset during Diwali, she\'s marking the exact solar position on Kartik Amavasya. When a pandit picks your wedding date, he\'s solving a multi-variable optimization problem across 7 astronomical parameters. When you fast on Ekadashi, you\'re responding to a specific Moon-Sun angular relationship. None of this is random tradition \u2014 it\'s applied astronomy.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'प्रत्येक हिन्दू कर्मकाण्ड का खगोलीय आधार है' : 'Every Hindu Ritual Has an Astronomical Basis'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'आपने कभी सोचा है कि एकादशी पर ही उपवास क्यों? पूर्णिमा पर ही पूजा क्यों? अमावस्या पर ही तर्पण क्यों? इन सबके पीछे सटीक खगोलीय गणित है।'
            : 'Ever wondered why fast specifically on Ekadashi? Why worship on Purnima? Why Tarpana on Amavasya? Behind all these lies precise astronomical mathematics.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'एकादशी व्रत (11वीं तिथि)' : 'Ekadashi Fasting (11th Tithi)'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'जब चन्द्र-सूर्य कोण 120°-132° होता है, चन्द्रमा का गुरुत्वाकर्षण पृथ्वी के जल पर एक विशेष चरण में होता है। आयुर्वेद इसे पाचन परिवर्तनों से जोड़ता है — उपवास सहायक होता है। तन्त्र स्वीकार करें या न करें, समय खगोलीय रूप से सटीक है।'
            : 'When Moon-Sun elongation reaches 120\u00B0-132\u00B0, the Moon\'s gravitational pull on Earth\'s water is at a specific phase. Ayurveda links this to digestive changes \u2014 fasting helps. Whether you accept the mechanism or not, the timing is astronomically precise.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'आधुनिक कालजीवविज्ञान (chronobiology) — जैविक प्रक्रियाओं और समय चक्रों के सम्बन्ध का अध्ययन — ने 2017 में चिकित्सा/शरीरविज्ञान का नोबेल पुरस्कार जीता। शोधकर्ताओं (हॉल, रोसबैश, यंग) ने सिद्ध किया कि हर कोशिका में बाहरी चक्रों से समन्वित एक आणविक घड़ी है। एकादशी व्रत परम्परा मूलतः कहती है: "चन्द्र चक्र के इस विशिष्ट बिन्दु पर (120°-132° चन्द्र-सूर्य कोण), आपका पाचन तन्त्र भिन्न रूप से काम करता है — इसलिए उपवास करें।" यह विशिष्ट दावा चिकित्सकीय परीक्षणों में अपरीक्षित है, लेकिन ढाँचा — कि जैविक लय ब्रह्माण्डीय चक्रों से सम्बद्ध हैं — अब नोबेल पुरस्कार विजेता विज्ञान है।'
            : 'Modern chronobiology \u2014 the study of how biological processes relate to time cycles \u2014 earned the 2017 Nobel Prize in Physiology/Medicine. The researchers (Hall, Rosbash, Young) proved that every cell has a molecular clock synchronized to external cycles. The Ekadashi fasting tradition essentially says: "At this specific point in the lunar cycle (120\u00B0-132\u00B0 Moon-Sun elongation), your digestive system operates differently \u2014 so fast." Whether this specific claim holds up to clinical trials is untested, but the FRAMEWORK \u2014 that biological rhythms correlate with celestial cycles \u2014 is now Nobel-winning science.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'पूर्णिमा पूजा' : 'Purnima (Full Moon) Worship'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'चन्द्रमा सूर्य के ठीक विपरीत — 180° कोण। अधिकतम परावर्तित प्रकाश। ज्वारीय बल चरम पर। वैदिक विचार में मन (मानस) सर्वाधिक सक्रिय — ध्यान और भक्ति के लिए आदर्श समय।'
            : 'The Moon is directly opposite the Sun \u2014 180\u00B0 elongation. Maximum reflected light. Tidal forces peak. In Vedic thought, the mind (manas) is most active \u2014 ideal for meditation and devotion.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'अमावस्या तर्पण' : 'Amavasya (New Moon) Tarpana'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'चन्द्रमा सूर्य के साथ युति में — अदृश्य। "सबसे अँधेरा" समय। पारम्परिक रूप से पितृ स्मरण (पितृ तर्पण) से जुड़ा। खगोलीय संरेखण वास्तविक है; सांस्कृतिक अर्थ उस पर आधारित है।'
            : 'Moon conjunct Sun \u2014 invisible. The "darkest" time. Traditionally associated with ancestor remembrance (Pitru Tarpana). The astronomical alignment is real; the cultural meaning layers onto it.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-amber-400/20 bg-gradient-to-br from-amber-900/10 to-transparent">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'आर्यभट ने सही ढंग से समझाया कि चन्द्रमा परावर्तित सूर्य प्रकाश से चमकता है (स्वयं प्रकाशमान नहीं), और ग्रहण पृथ्वी की छाया से होते हैं (राहु चन्द्रमा को निगलने से नहीं)। उन्होंने यह 499 ई. में लिखा — जब यूरोप अन्धकार युग में था। फिर उन्होंने राहु-केतु पौराणिक ढाँचे को शिक्षण उपकरण के रूप में समन्वित किया।'
            : 'Aryabhata correctly explained that the Moon shines by REFLECTED sunlight (not self-luminous), and that eclipses are caused by Earth\'s shadow (not Rahu swallowing the Moon). He wrote this in 499 CE \u2014 while Europe was in the Dark Ages. He then reconciled this with the Rahu-Ketu mythological framework as a teaching tool.'}
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
          {isHi ? 'विशेष दिन और समय क्यों महत्त्वपूर्ण हैं' : 'Why Specific Days and Times Matter'}
        </h3>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'मंगलवार — मंगल-दिवस' : 'Tuesday — Mars-Day (Mangalavara)'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'मंगल साहस, संघर्ष, शल्य चिकित्सा का शासक है। मंगलवार को हनुमान पूजा = योद्धा-देवता के माध्यम से मंगल ऊर्जा का आह्वान। हनुमान बल, पराक्रम और अटल भक्ति के प्रतीक हैं — ठीक वही गुण जो मंगल ग्रह प्रतिनिधित्व करता है।'
            : 'Mars rules courage, conflict, surgery. Hanuman worship on Tuesday = invoking Mars energy through the warrior-deity. Hanuman embodies strength, valor, and unwavering devotion \u2014 exactly the qualities Mars represents.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'शनिवार — शनि-दिवस' : 'Saturday — Saturn-Day (Shanivara)'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'शनि अनुशासन, कर्म, कठिनाई का शासक है। शनि मन्दिर दर्शन = शनि के पाठों को स्वीकार करना। यह भय नहीं, सम्मान है — ठीक वैसे जैसे कठोर शिक्षक का सम्मान करते हैं जिसने आपको सबसे अधिक सिखाया।'
            : 'Saturn rules discipline, karma, hardship. Shani temple visits on Saturday = acknowledging Saturn\'s lessons. Not fear, but respect \u2014 like respecting a tough teacher who taught you the most.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-cyan-400/20 bg-gradient-to-br from-cyan-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सोचिए: आप पहले से बिना जाने ग्रह जागरूकता का अभ्यास करते हैं। आप "Monday blues" कहते हैं (Moon-day = भावनात्मक, चिन्तनशील)। आप "TGIF" कहते हैं क्योंकि Friday (Venus-day = शुक्रवार) हल्का, अधिक सामाजिक लगता है। "Saturday night" (Saturn-day = अनुशासन ढीला) में आप छुट्टी मनाते हैं। सप्ताह के दिनों के नाम बनाने वाली ग्रह होरा पद्धति ठीक वही होरा पद्धति है जो ज्योतिष में है। आप जीवन भर व्यावहारिक ज्योतिष करते रहे हैं — बस संस्कृत शब्द नहीं जानते थे।'
            : 'Think about it: you already practice planetary awareness without realizing it. You call it "Monday blues" (Moon-day = emotional, reflective). You say "TGIF" because Friday (Venus-day = Shukravara) feels lighter, more social. "Saturday night" (Saturn-day = discipline relaxes) is when you let loose. The planetary hour system that created our weekday names is EXACTLY the Hora system in Jyotish. You\'ve been doing applied Jyotish your whole life \u2014 you just didn\'t know the Sanskrit terms.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'विवाह मुहूर्त — मनमाना नहीं' : 'Marriage Muhurta — Not Arbitrary'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'शुभ विवाह मुहूर्त के लिए आवश्यक: सौम्य नक्षत्र में चन्द्रमा, शुक्र अस्त नहीं (सूर्य से पर्याप्त दूर), गुरु की 7वें भाव पर दृष्टि, राहु काल में नहीं। ये गणनीय खगोलीय शर्तें हैं — अन्धविश्वास नहीं, गणित है।'
            : 'A good marriage muhurta requires: Moon in a gentle nakshatra, Venus not combust (sufficiently far from Sun), Jupiter aspecting the 7th house, no Rahu Kaal. These are computable astronomical conditions \u2014 not superstition, mathematics.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'संकल्प — ब्रह्माण्डीय समय-चिह्न' : 'Sankalpa — A Cosmic Timestamp'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक पूजा से पहले संकल्प में कहा जाता है: सम्वत्सर, अयन, ऋतु, मास, पक्ष, तिथि, वार, नक्षत्र। आप शाब्दिक रूप से घोषणा कर रहे हैं "इस सटीक खगोलीय क्षण पर, मैं यह प्रतिज्ञा करता हूँ।" हमारा संकल्प जनक यह सब स्वचालित रूप से गणित करता है।'
            : 'The Sankalpa before every puja states: samvatsara, ayana, ritu, masa, paksha, tithi, vara, nakshatra. You\'re literally declaring "at THIS precise astronomical moment, I make this vow." Our Sankalpa Generator computes all of this automatically.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-amber-400/20 bg-gradient-to-br from-amber-900/10 to-transparent">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'रोचक तथ्य' : 'Key Historical Fact'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'सूर्य सिद्धान्त "त्रुटि" (29.6 माइक्रोसेकण्ड) से "कल्प" (4.32 अरब वर्ष — पृथ्वी की वास्तविक आयु 4.54 अरब वर्ष के उल्लेखनीय रूप से निकट) तक समय विभाजन का वर्णन करता है। माइक्रोसेकण्ड से अरबों वर्षों तक — विचार का यह पैमाना भारतीय सभ्यता की विशेषता था।'
            : 'The Surya Siddhanta describes time divisions from the "truti" (29.6 microseconds) to the "kalpa" (4.32 billion years \u2014 remarkably close to Earth\'s actual age of 4.54 billion years). From microseconds to billions of years \u2014 this scale of thinking was unique to Indian civilization.'}
        </p>
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
          {isHi ? 'हमारा ऐप यह सब कैसे जोड़ता है' : 'How Our App Connects It All'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'अब आप जानते हैं कि कर्मकाण्ड और खगोलशास्त्र अभिन्न हैं। हमारे ऐप की प्रत्येक सुविधा इसी सम्बन्ध पर आधारित है:'
            : 'Now you know that rituals and astronomy are inseparable. Every feature of our app is built on this connection:'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <div className="space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• दैनिक पंचांग → आज का ब्रह्माण्डीय मौसम जानें'
              : '• Daily Panchang \u2192 know the cosmic weather for today'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• त्योहार कैलेंडर → कब मनाएँ, खगोलीय कारणों सहित'
              : '• Festival Calendar \u2192 when to celebrate, with astronomical reasons'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• पूजा विधि → मन्त्रों सहित चरण-दर-चरण पूजा मार्गदर्शिका'
              : '• Puja Vidhi \u2192 step-by-step worship guides with mantras'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• संकल्प जनक → किसी भी पूजा के लिए आपका व्यक्तिगत ब्रह्माण्डीय समय-चिह्न'
              : '• Sankalpa Generator \u2192 your personalized cosmic timestamp for any puja'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• मुहूर्त AI → किसी भी कार्य के लिए सर्वोत्तम समय, 0-100 अंकित'
              : '• Muhurta AI \u2192 find the best time for any activity, scored 0-100'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• कुण्डली → आपका व्यक्तिगत ब्रह्माण्डीय मानचित्र'
              : '• Kundali \u2192 your personal cosmic map'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi
              ? '• ज्योतिष सीखें → इन सबके पीछे का विज्ञान समझें'
              : '• Learn Jyotish \u2192 understand the science behind all of it'}
          </p>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-purple-400/20 bg-gradient-to-br from-purple-900/10 to-transparent">
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'ज्योतिष की सुन्दरता यह है: आपको भाग्य में विश्वास करने की आवश्यकता नहीं कि यह उपयोगी हो। पंचांग को एक सचेत दैनिक जाँच के रूप में उपयोग करें। अपनी कुण्डली को आत्म-चिन्तन के ढाँचे के रूप में। मुहूर्त को निर्णय-सहायता उपकरण के रूप में। संकल्प को किसी भी महत्त्वपूर्ण कार्य से पहले संकल्प-स्थापना के क्षण के रूप। खगोलीय गणनाएँ सटीक विज्ञान हैं। व्याख्या की परत सांस्कृतिक ज्ञान है। जो गूँजे वह लें, जो न गूँजे छोड़ दें — लेकिन कम से कम समझें कि आपके दादा-दादी क्या जानते थे, उसे खारिज करने से पहले।'
            : 'Here\'s the beautiful thing about Jyotish: you don\'t have to believe in destiny to find it useful. Use the Panchang as a mindful daily check-in. Use your Kundali as a framework for self-reflection. Use Muhurta as a decision-support tool. Use the Sankalpa as a moment of intention-setting before anything important. The astronomical calculations are exact science. The interpretive layer is cultural wisdom. Take what resonates, leave what doesn\'t \u2014 but at least understand what your grandparents knew before dismissing it.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-400/20 bg-gradient-to-br from-emerald-900/10 to-transparent">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधार पूर्ण!' : 'Foundations Complete!'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi ? 'अब आप जानते हैं:' : 'You now know:'}
        </p>
        <div className="space-y-1">
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi ? '\u2713 ज्योतिष क्या है (और क्या नहीं)' : '\u2713 What Jyotish IS (and isn\'t)'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi ? '\u2713 हिन्दू कैलेंडर कैसे काम करता है' : '\u2713 How the Hindu calendar works'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi ? '\u2713 आपकी राशि और नक्षत्र' : '\u2713 Your rashi and nakshatra'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi ? '\u2713 पंचांग कैसे पढ़ें' : '\u2713 How to read a Panchang'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi ? '\u2713 कुण्डली क्या दिखाती है' : '\u2713 What a Kundali shows'}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isHi ? '\u2713 कर्मकाण्डों का खगोलीय समय क्यों है' : '\u2713 Why rituals have astronomical timing'}
          </p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          {isHi
            ? 'अगला: मॉड्यूल 1-1 गहरी तकनीकी यात्रा आरम्भ करता है — क्रान्तिवृत्त, अंश, और हम आकाश कैसे मापते हैं।'
            : 'Next: Module 1-1 starts the deeper technical journey \u2014 the ecliptic, degrees, and how we measure the sky.'}
        </p>
      </section>
    </div>
  );
}

export default function Module0_6() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}

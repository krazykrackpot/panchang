'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

// ─── Module Metadata ────────────────────────────────────────────────────────

const META: ModuleMeta = {
  id: 'mod_0_3',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.3',
  title: { en: 'Your Cosmic Address — Sun Sign, Moon Sign, Nakshatra', hi: 'आपका ब्रह्माण्डीय पता — सूर्य राशि, चन्द्र राशि, नक्षत्र' },
  subtitle: { en: 'Why "what\'s your sign?" has a completely different answer in Vedic astrology', hi: '"आपकी राशि क्या है?" का वैदिक ज्योतिष में पूरी तरह अलग उत्तर क्यों है' },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: '0.1 What is Jyotish?', hi: '0.1 ज्योतिष क्या है?' }, href: '/learn/modules/0-1' },
    { label: { en: 'Sign Calculator', hi: 'राशि कैलकुलेटर' }, href: '/sign-calculator' },
    { label: { en: 'Nakshatras Deep Dive', hi: 'नक्षत्र विस्तृत अध्ययन' }, href: '/learn/nakshatras' },
    { label: { en: '1.1 The Night Sky & Ecliptic', hi: '1.1 रात्रि आकाश एवं क्रान्तिवृत्त' }, href: '/learn/modules/1-1' },
  ],
};

// ─── Question Bank (10 questions, 5 drawn per attempt) ──────────────────────

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q0_3_01', type: 'mcq',
    question: { en: 'In Vedic astrology, "your rashi" typically refers to your:', hi: 'वैदिक ज्योतिष में "आपकी राशि" सामान्यतः किसे कहते हैं?' },
    options: [
      { en: 'Sun sign (tropical zodiac)', hi: 'सूर्य राशि (ट्रॉपिकल राशिचक्र)' },
      { en: 'Moon sign (sidereal zodiac)', hi: 'चन्द्र राशि (साइडरियल राशिचक्र)' },
      { en: 'Rising sign (ascendant)', hi: 'उदय राशि (लग्न)' },
      { en: 'Jupiter sign', hi: 'गुरु राशि' },
    ],
    correctAnswer: 1,
    explanation: { en: 'In Vedic astrology, "your rashi" is your MOON sign in the sidereal zodiac. The Moon is primary because it changes sign every ~2.25 days (vs Sun\'s 30 days), making it more personal. In Vedic thought, the Moon governs the mind (manas).', hi: 'वैदिक ज्योतिष में "राशि" चन्द्र राशि है (साइडरियल राशिचक्र में)। चन्द्रमा प्रमुख है क्योंकि वह ~2.25 दिन में राशि बदलता है — अधिक व्यक्तिगत।' },
  },
  {
    id: 'q0_3_02', type: 'mcq',
    question: { en: 'Why is your Vedic Sun sign usually one sign behind your Western sign?', hi: 'आपकी वैदिक सूर्य राशि आमतौर पर पश्चिमी राशि से एक राशि पीछे क्यों होती है?' },
    options: [
      { en: 'Because Vedic astrology makes an error', hi: 'क्योंकि वैदिक ज्योतिष त्रुटि करता है' },
      { en: 'Because of the ~24 degree ayanamsha gap between sidereal and tropical zodiacs', hi: 'साइडरियल और ट्रॉपिकल राशिचक्रों के बीच ~24° अयनांश अन्तर के कारण' },
      { en: 'Because Vedic uses a 13-sign zodiac', hi: 'क्योंकि वैदिक में 13 राशियों का राशिचक्र है' },
      { en: 'Because of different planet calculations', hi: 'भिन्न ग्रह गणनाओं के कारण' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The sidereal zodiac (star-fixed) and tropical zodiac (season-fixed) have diverged by about 24 degrees due to precession of the equinoxes. Since each sign spans 30 degrees, a 24-degree offset means most people\'s Vedic Sun sign is one sign behind their Western sign.', hi: 'अयन गति (precession) के कारण साइडरियल और ट्रॉपिकल राशिचक्र ~24° विचलित हो गए हैं। प्रत्येक राशि 30° की होने से, अधिकांश लोगों की वैदिक सूर्य राशि पश्चिमी से एक पीछे होती है।' },
  },
  {
    id: 'q0_3_03', type: 'mcq',
    question: { en: 'How many nakshatras divide the ecliptic?', hi: 'क्रान्तिवृत्त कितने नक्षत्रों में विभाजित है?' },
    options: [
      { en: '12', hi: '12' },
      { en: '27', hi: '27' },
      { en: '28', hi: '28' },
      { en: '36', hi: '36' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The ecliptic is divided into 27 nakshatras, each spanning 13 degrees 20 minutes. This division is based on the Moon\'s sidereal period of ~27.3 days — the Moon spends roughly one day in each nakshatra. It is astronomically elegant.', hi: 'क्रान्तिवृत्त 27 नक्षत्रों में विभाजित है, प्रत्येक 13°20\'। यह चन्द्रमा के ~27.3 दिन के नाक्षत्र काल पर आधारित है — चन्द्रमा प्रत्येक नक्षत्र में लगभग एक दिन रहता है।' },
  },
  {
    id: 'q0_3_04', type: 'true_false',
    question: { en: 'The 27 nakshatras have an equivalent system in Western astrology.', hi: '27 नक्षत्रों की पश्चिमी ज्योतिष में एक समकक्ष प्रणाली है।' },
    correctAnswer: false,
    explanation: { en: 'False. The 27-nakshatra system is UNIQUE to Vedic Jyotish. Western astrology has no equivalent lunar mansion system. The nakshatras are one of the most distinctive and ancient features of Indian astronomy, mentioned in the Rigveda (c. 1500 BCE).', hi: 'गलत। 27-नक्षत्र प्रणाली वैदिक ज्योतिष की अनूठी विशेषता है। पश्चिमी ज्योतिष में ऐसी कोई चान्द्र नक्षत्र प्रणाली नहीं। ये ऋग्वेद (लगभग 1500 ई.पू.) में उल्लिखित हैं।' },
  },
  {
    id: 'q0_3_05', type: 'mcq',
    question: { en: 'Your birth nakshatra determines which of the following?', hi: 'आपका जन्म नक्षत्र निम्न में से क्या निर्धारित करता है?' },
    options: [
      { en: 'Only your personality', hi: 'केवल आपका व्यक्तित्व' },
      { en: 'Only your lucky number', hi: 'केवल आपका भाग्यशाली अंक' },
      { en: 'Your starting Mahadasha, name syllable, and compatibility factors', hi: 'आपकी प्रारम्भिक महादशा, नाम का अक्षर, और अनुकूलता कारक' },
      { en: 'Only your marriage compatibility', hi: 'केवल आपकी विवाह अनुकूलता' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Your birth nakshatra determines: (1) your starting Mahadasha period (Vimshottari system), (2) the traditional first syllable of your name (pada-based), and (3) your Ashta Kuta compatibility score for marriage matching. It is far more than just personality.', hi: 'जन्म नक्षत्र निर्धारित करता है: (1) प्रारम्भिक महादशा (विंशोत्तरी), (2) नाम का पारम्परिक पहला अक्षर (पद-आधारित), (3) विवाह अनुकूलता (अष्ट कूट)।' },
  },
  {
    id: 'q0_3_06', type: 'mcq',
    question: { en: 'How often does the Moon change sign (rashi)?', hi: 'चन्द्रमा कितनी बार राशि बदलता है?' },
    options: [
      { en: 'Every 30 days', hi: 'हर 30 दिन' },
      { en: 'Every 7 days', hi: 'हर 7 दिन' },
      { en: 'Every 2.25 days', hi: 'हर 2.25 दिन' },
      { en: 'Every 12 hours', hi: 'हर 12 घण्टे' },
    ],
    correctAnswer: 2,
    explanation: { en: 'The Moon completes a full circuit of the zodiac in ~27.3 days, spending about 2.25 days in each of the 12 signs. This rapid movement is why Vedic astrology favors the Moon — two people born just 3 days apart can have different Moon signs, making it much more individualizing than the Sun sign.', hi: 'चन्द्रमा ~27.3 दिन में पूरा राशिचक्र पूरा करता है, प्रत्येक राशि में ~2.25 दिन। इसीलिए वैदिक ज्योतिष चन्द्रमा को प्रमुख मानता है — 3 दिन के अन्तर से जन्मे दो व्यक्तियों की चन्द्र राशि भिन्न हो सकती है।' },
  },
  {
    id: 'q0_3_07', type: 'true_false',
    question: { en: 'The Rigveda (c. 1500 BCE) mentions nakshatras, making them the oldest continuously used astronomical coordinate system.', hi: 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है, जो इन्हें सबसे प्राचीन निरन्तर प्रयुक्त खगोलीय निर्देशांक प्रणाली बनाता है।' },
    correctAnswer: true,
    explanation: { en: 'True. The Rigveda references nakshatras, making this system at least 3,500 years old — and still in daily use. The Western zodiac signs are only about 2,500 years old. The nakshatra system is the oldest continuously used astronomical coordinate system in human history.', hi: 'सत्य। ऋग्वेद में नक्षत्रों का उल्लेख है — यह प्रणाली कम से कम 3,500 वर्ष पुरानी है और आज भी दैनिक उपयोग में। पश्चिमी राशियाँ केवल ~2,500 वर्ष पुरानी हैं।' },
    classicalRef: 'Rigveda, various hymns',
  },
  {
    id: 'q0_3_08', type: 'mcq',
    question: { en: 'What is the angular span of each nakshatra?', hi: 'प्रत्येक नक्षत्र का कोणीय विस्तार कितना है?' },
    options: [
      { en: '30 degrees', hi: '30 अंश' },
      { en: '13 degrees 20 minutes', hi: '13 अंश 20 कला' },
      { en: '15 degrees', hi: '15 अंश' },
      { en: '10 degrees', hi: '10 अंश' },
    ],
    correctAnswer: 1,
    explanation: { en: '360 degrees divided by 27 nakshatras = 13 degrees 20 minutes each. Each nakshatra is further divided into 4 padas (quarters) of 3 degrees 20 minutes. These padas determine name syllables and other fine details.', hi: '360° / 27 नक्षत्र = 13°20\' प्रत्येक। प्रत्येक नक्षत्र 4 पदों (चरणों) में विभाजित, प्रत्येक पद 3°20\'। पद नाम के अक्षर और अन्य सूक्ष्म विवरण निर्धारित करते हैं।' },
  },
  {
    id: 'q0_3_09', type: 'mcq',
    question: { en: 'Marriage compatibility (Ashta Kuta) in Vedic tradition is based on:', hi: 'वैदिक परम्परा में विवाह अनुकूलता (अष्ट कूट) किस पर आधारित है?' },
    options: [
      { en: 'Sun signs of both partners', hi: 'दोनों साथियों की सूर्य राशियाँ' },
      { en: 'Birth nakshatras of both partners', hi: 'दोनों साथियों के जन्म नक्षत्र' },
      { en: 'Blood types', hi: 'रक्त प्रकार' },
      { en: 'Birth order in the family', hi: 'परिवार में जन्म क्रम' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Ashta Kuta matching is 100% nakshatra-based. It compares the birth nakshatras of both partners across 8 categories (kutas) worth a maximum of 36 points. This is one of the most practically used features of Jyotish across India today.', hi: 'अष्ट कूट मिलान पूर्णतः नक्षत्र-आधारित है। यह दोनों साथियों के जन्म नक्षत्रों की 8 श्रेणियों (कूटों) में तुलना करता है, अधिकतम 36 अंक। आज भारत में ज्योतिष की सबसे व्यावहारिक विशेषताओं में से एक।' },
  },
  {
    id: 'q0_3_10', type: 'true_false',
    question: { en: 'The 12 zodiac signs (rashis) were independently adopted and modified in India, with the addition of the 27-nakshatra overlay.', hi: '12 राशियाँ भारत में स्वतन्त्र रूप से अपनाई और संशोधित की गईं, 27-नक्षत्र परत के साथ।' },
    correctAnswer: true,
    explanation: { en: 'True. While the 12-sign zodiac originated in Mesopotamia, India independently adopted and significantly modified it. The unique Indian contribution is the 27-nakshatra overlay, which has no Mesopotamian equivalent and creates a much finer-grained coordinate system for the ecliptic.', hi: 'सत्य। 12-राशि चक्र मेसोपोटामिया में उत्पन्न हुआ, किन्तु भारत ने इसे स्वतन्त्र रूप से अपनाया और महत्वपूर्ण रूप से संशोधित किया। 27-नक्षत्र परत भारत का अनूठा योगदान है।' },
  },
];

// ─── Content Pages ──────────────────────────────────────────────────────────

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? '"आपकी राशि क्या है?" — उत्तर इस पर निर्भर करता है कि कौन पूछ रहा है' : '"What\'s Your Sign?" — The Answer Depends on Who\'s Asking'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'एक पार्टी ट्रिक: अगली बार जब कोई पूछे "आपकी राशि क्या है?", दो उत्तर दीजिए। "पश्चिमी प्रणाली में मैं मिथुन हूँ, लेकिन मेरी वैदिक चन्द्र राशि वृषभ है।" उनकी उलझन देखिए — और फिर समझाइए क्यों।'
            : 'Here\'s a party trick: next time someone asks "What\'s your sign?", give them TWO answers. "In the Western system I\'m a Gemini, but my Vedic Moon sign is Taurus." Watch their confusion — and then explain why.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'यदि कोई पश्चिमी मित्र पूछे, आप कह सकते हैं "मैं मिथुन (Gemini) हूँ" — सूर्य जन्म के समय मिथुन में था, ट्रॉपिकल राशिचक्र में। किन्तु यदि कोई भारतीय ज्योतिषी पूछे, उत्तर हो सकता है "मेरी राशि वृषभ है" — चन्द्रमा जन्म के समय वृषभ में था, साइडरियल राशिचक्र में।'
            : 'If a Western friend asks, you might say "I\'m a Gemini" — the Sun was in Gemini at birth, in the tropical zodiac. But if an Indian astrologer asks, the answer might be "My rashi is Vrishabha (Taurus)" — the Moon was in Taurus at birth, in the sidereal zodiac.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi ? 'दो बड़े अन्तर यहाँ काम करते हैं:' : 'Two big differences are at play here:'}
        </p>

        <div className="grid gap-3 mb-4">
          <div className="glass-card rounded-lg p-4 border border-gold-primary/10">
            <p className="text-gold-light text-sm font-bold mb-2">{isHi ? '~24° अन्तर (अयनांश)' : 'The ~24 Degree Gap (Ayanamsha)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'ट्रॉपिकल राशिचक्र ऋतुओं (विषुव) से बँधा है। साइडरियल तारों से। अयन गति (precession) के कारण ये आज ~24° विचलित हैं। प्रत्येक राशि 30° की है, इसलिए आपकी वैदिक सूर्य राशि प्रायः पश्चिमी से एक राशि पीछे होती है। पश्चिमी Gemini = वैदिक Vrishabha (Taurus)!'
                : 'The tropical zodiac is tied to seasons (equinoxes). The sidereal is tied to stars. Due to precession, they\'ve diverged by ~24 degrees today. Since each sign is 30 degrees, your Vedic Sun sign is usually ONE sign behind your Western sign. Western Gemini = Vedic Vrishabha (Taurus)!'}
            </p>
          </div>
          <div className="glass-card rounded-lg p-4 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-2">{isHi ? 'चन्द्रमा बनाम सूर्य' : 'Moon vs Sun'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'पश्चिमी ज्योतिष सूर्य राशि पर केन्द्रित है — सूर्य 30 दिन प्रति राशि रहता है। वैदिक ज्योतिष चन्द्र राशि प्रमुख मानता है — चन्द्रमा केवल 2.25 दिन प्रति राशि रहता है, बहुत अधिक व्यक्तिगत। साथ ही, वैदिक विचार में चन्द्रमा मन (मनस्) का शासक है।'
                : 'Western astrology centers on the Sun sign — the Sun spends 30 days per sign. Vedic astrology prioritizes the Moon sign — the Moon spends only 2.25 days per sign, making it far more personal. Also, in Vedic thought, the Moon governs the mind (manas).'}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'वैदिक ज्योतिष चन्द्रमा को प्रमुख क्यों मानता है? चन्द्रमा हर 2.25 दिन में राशि बदलता है। सूर्य को 30 दिन लगते हैं। इसका अर्थ है कि एक ही महीने में जन्मे सभी लोगों की सूर्य राशि एक ही होती है — लेकिन चन्द्र राशि हर 2 दिन बदलती है, 12 गुना अधिक विशिष्टता देते हुए। इसमें नक्षत्र जोड़िए (जो हर 24 घण्टे बदलता है) और पद (हर 6 घण्टे), और आपको एक ब्रह्माण्डीय फिंगरप्रिंट मिलता है जो पश्चिमी सूर्य राशि से कहीं अधिक अनूठा है। आपकी वैदिक कुण्डली एक हाई-रेज़ फ़ोटो जैसी है जहाँ पश्चिमी एक थम्बनेल है। आपका नक्षत्र एक ब्रह्माण्डीय पिन कोड जैसा है — राशि चिह्न से कहीं अधिक विशिष्ट।'
            : 'Why does Vedic use the MOON as primary? The Moon changes sign every 2.25 days. The Sun takes 30 days to change sign. That means everyone born in a given month has the same Sun sign — but Moon sign changes every 2 days, giving 12x more specificity. Add the nakshatra (which changes every 24 hours) and pada (every 6 hours), and you get a cosmic fingerprint far more unique than Western sun signs. Your Vedic chart is like a hi-res photo where Western is a thumbnail. Your nakshatra is like a cosmic ZIP code — way more specific than a zodiac sign.'}
        </p>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? '12 राशियाँ मेसोपोटामिया में उत्पन्न हुईं किन्तु भारत में स्वतन्त्र रूप से अपनाई और संशोधित की गईं। भारतीय प्रणाली ने 27-नक्षत्र परत जोड़ी, जिसका कोई मेसोपोटामियाई समकक्ष नहीं।'
            : 'The 12 zodiac signs originated in Mesopotamia but were independently adopted and MODIFIED in India. The Indian system added the 27-nakshatra overlay, which has no Mesopotamian equivalent.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'प्रत्येक नक्षत्र 13°20\' का है — क्रान्तिवृत्त को 27 बराबर भागों में विभाजित करते हुए, चन्द्रमा के 27.3 दिन के नाक्षत्र काल पर आधारित। यह खगोलीय रूप से सुन्दर है: एक दिन = एक नक्षत्र।'
            : 'Each nakshatra spans 13 degrees 20 minutes — dividing the ecliptic into 27 equal parts based on the Moon\'s 27.3-day sidereal period. This is astronomically elegant: one day = one nakshatra.'}
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
          {isHi ? '12 राशियाँ 2 मिनट में' : 'The 12 Rashis in 2 Minutes'}
        </h3>

        {/* Rashi grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { n: 1, en: 'Mesha', hi: 'मेष', sym: 'Aries', ruler: isHi ? 'मंगल' : 'Mars', elem: isHi ? 'अग्नि' : 'Fire' },
            { n: 2, en: 'Vrishabha', hi: 'वृषभ', sym: 'Taurus', ruler: isHi ? 'शुक्र' : 'Venus', elem: isHi ? 'पृथ्वी' : 'Earth' },
            { n: 3, en: 'Mithuna', hi: 'मिथुन', sym: 'Gemini', ruler: isHi ? 'बुध' : 'Mercury', elem: isHi ? 'वायु' : 'Air' },
            { n: 4, en: 'Karka', hi: 'कर्क', sym: 'Cancer', ruler: isHi ? 'चन्द्र' : 'Moon', elem: isHi ? 'जल' : 'Water' },
            { n: 5, en: 'Simha', hi: 'सिंह', sym: 'Leo', ruler: isHi ? 'सूर्य' : 'Sun', elem: isHi ? 'अग्नि' : 'Fire' },
            { n: 6, en: 'Kanya', hi: 'कन्या', sym: 'Virgo', ruler: isHi ? 'बुध' : 'Mercury', elem: isHi ? 'पृथ्वी' : 'Earth' },
            { n: 7, en: 'Tula', hi: 'तुला', sym: 'Libra', ruler: isHi ? 'शुक्र' : 'Venus', elem: isHi ? 'वायु' : 'Air' },
            { n: 8, en: 'Vrischika', hi: 'वृश्चिक', sym: 'Scorpio', ruler: isHi ? 'मंगल' : 'Mars', elem: isHi ? 'जल' : 'Water' },
            { n: 9, en: 'Dhanu', hi: 'धनु', sym: 'Sagittarius', ruler: isHi ? 'गुरु' : 'Jupiter', elem: isHi ? 'अग्नि' : 'Fire' },
            { n: 10, en: 'Makara', hi: 'मकर', sym: 'Capricorn', ruler: isHi ? 'शनि' : 'Saturn', elem: isHi ? 'पृथ्वी' : 'Earth' },
            { n: 11, en: 'Kumbha', hi: 'कुम्भ', sym: 'Aquarius', ruler: isHi ? 'शनि' : 'Saturn', elem: isHi ? 'वायु' : 'Air' },
            { n: 12, en: 'Meena', hi: 'मीन', sym: 'Pisces', ruler: isHi ? 'गुरु' : 'Jupiter', elem: isHi ? 'जल' : 'Water' },
          ].map(r => (
            <div key={r.n} className="glass-card rounded-lg p-2 border border-gold-primary/5 text-center">
              <p className="text-gold-light text-xs font-bold">{r.n}. {isHi ? r.hi : r.en}</p>
              <p className="text-text-tertiary text-[10px]">{r.sym}</p>
              <p className="text-text-secondary text-[10px]">{r.ruler} · {r.elem}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {isHi
            ? 'एक बात जो लोगों को चौंका देती है: आपका जन्म नक्षत्र पारम्परिक रूप से आपके नाम का पहला अक्षर निर्धारित करता है। हस्त नक्षत्र पद 1 = "पू" ध्वनि। पद 2 = "ष"। पद 3 = "ण"। पद 4 = "ठ"। यह मनमाना नहीं — यह आपके नाम और आपके जन्म के ब्रह्माण्डीय क्षण के बीच एक स्मरण-सूत्र बनाता है। जब एक पण्डित आपका नाम पूछते हैं कुण्डली बनाने के लिए, तो नाम स्वयं खगोलीय जानकारी को कोड करता है। यह 3,000 वर्ष पुराना QR कोड जैसा है।'
            : 'Here\'s something that blows people\'s minds: your birth nakshatra traditionally determines the FIRST SYLLABLE of your name. Hasta nakshatra pada 1 = "Pu" sounds. Pada 2 = "Sha". Pada 3 = "Na". Pada 4 = "Tha". This isn\'t arbitrary — it creates a mnemonic link between your name and your cosmic moment of birth. When a pandit asks for your name to cast your chart, the NAME ITSELF encodes astronomical information. It\'s like a QR code from 3,000 years ago.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-base mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? '27 नक्षत्र — संक्षिप्त झलक' : 'The 27 Nakshatras — Quick Preview'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'प्रत्येक नक्षत्र एक ग्रह द्वारा शासित है (विंशोत्तरी क्रम में)। आपका जन्म नक्षत्र स्वामी निर्धारित करता है कि आपकी महादशा किस ग्रह से शुरू होती है।'
            : 'Each nakshatra is ruled by a planet (in Vimshottari order). Your birth nakshatra lord determines which Mahadasha your life begins with.'}
        </p>

        {/* Emerald fact card */}
        <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
          <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">
            {isHi ? 'उदाहरण' : 'Worked Example'}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-2">
            {isHi
              ? 'मान लीजिए जन्म के समय चन्द्रमा हस्त नक्षत्र में था। हस्त का स्वामी चन्द्रमा है। इसलिए:'
              : 'Suppose the Moon was in Hasta nakshatra at birth. Hasta\'s lord is the Moon. Therefore:'}
          </p>
          <ul className="text-text-secondary text-xs space-y-1 ml-3">
            <li>{isHi ? '• जन्म पर चन्द्र महादशा शुरू होती है (10 वर्ष)' : '• Moon Mahadasha starts at birth (10 years)'}</li>
            <li>{isHi ? '• चन्द्र राशि: कन्या (हस्त कन्या राशि में है)' : '• Moon sign: Kanya/Virgo (Hasta falls in Virgo)'}</li>
            <li>{isHi ? '• पद 3 → नाम अक्षर "णू" ध्वनि' : '• Pada 3 → name syllable "Nu" sound'}</li>
          </ul>
          <p className="text-text-secondary text-xs leading-relaxed mt-3">
            <span className="text-gold-light font-bold">{isHi ? 'अभी प्रयोग करें:' : 'Try it now:'}</span>{' '}
            {isHi
              ? 'हमारे राशि कैलकुलेटर पर जाएँ और अपनी राशि और नक्षत्र खोजें!'
              : 'Head to our Sign Calculator and find your own rashi and nakshatra!'}
          </p>
        </section>
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
          {isHi ? 'आपका नक्षत्र आपकी सोच से कहीं अधिक महत्वपूर्ण है' : 'Why Your Nakshatra Matters More Than You Think'}
        </h3>

        <div className="space-y-4">
          <div className="glass-card rounded-lg p-4 border border-gold-primary/10">
            <p className="text-gold-light text-sm font-bold mb-2">{isHi ? 'नामकरण' : 'NAMING'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'आपके नाम का पहला अक्षर पारम्परिक रूप से जन्म नक्षत्र के पद (चरण) से आता है। हस्त पद 3 = "णू" ध्वनि। यह यादृच्छिक नहीं — यह एक स्मरण-सूत्र है जो आपको आपके ब्रह्माण्डीय क्षण से जोड़ता है।'
                : 'The first syllable of your name traditionally comes from your birth nakshatra\'s pada (quarter). Hasta pada 3 = "Nu" sounds. This isn\'t random — it\'s a mnemonic linking you to your cosmic moment of birth.'}
            </p>
          </div>

          <div className="glass-card rounded-lg p-4 border border-gold-primary/10">
            <p className="text-gold-light text-sm font-bold mb-2">{isHi ? 'दशा (समय प्रणाली)' : 'DASHA (Timing System)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'आपके पूरे जीवन का ग्रहीय काल क्रम (120 वर्ष चक्र) जन्म नक्षत्र स्वामी से निर्धारित होता है। यह ज्योतिष की सबसे शक्तिशाली विशेषताओं में से एक है — "कब" होगा बताने की क्षमता।'
                : 'Your entire life\'s planetary period sequence (120-year cycle) is determined by your birth nakshatra lord. This is one of Jyotish\'s most powerful features — the ability to predict WHEN, not just what.'}
            </p>
          </div>

          <div className="glass-card rounded-lg p-4 border border-gold-primary/10">
            <p className="text-gold-light text-sm font-bold mb-2">{isHi ? 'विवाह मिलान' : 'MARRIAGE MATCHING'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'अष्ट कूट अनुकूलता 100% नक्षत्र-आधारित है। दोनों साथियों के जन्म नक्षत्रों की 8 श्रेणियों में तुलना, अधिकतम 36 अंक। आज भी भारत में करोड़ों परिवार विवाह से पहले यह जाँचते हैं।'
                : 'Ashta Kuta compatibility is 100% nakshatra-based. It compares birth nakshatras of both partners across 8 categories, max 36 points. Millions of families across India still check this before marriage.'}
            </p>
          </div>

          <div className="glass-card rounded-lg p-4 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-2">{isHi ? '120 वर्ष की समय-रेखा' : 'THE 120-YEAR TIMELINE'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'आपका जन्म नक्षत्र आपका सम्पूर्ण विंशोत्तरी दशा क्रम निर्धारित करता है — ग्रहीय कालों की 120 वर्षीय समय-रेखा। रोहिणी में जन्म? चन्द्र महादशा शुरू। अश्विनी में जन्म? केतु शुरू। यह एकमात्र डेटा बिन्दु — जन्म के समय चन्द्रमा किस तारे से मिल रहा था — आपके पूरे जीवन के ग्रहीय अध्यायों की घड़ी सेट करता है। दुनिया की किसी अन्य ज्योतिष प्रणाली में इस स्तर की कालिक विशिष्टता नहीं है। इसे ऐसे सोचिए: Spotify Wrapped — लेकिन आपके पूरे जीवन के लिए।'
                : 'Your birth nakshatra determines your ENTIRE Vimshottari Dasha sequence — a 120-year timeline of planetary periods. Born in Rohini? Moon Mahadasha starts. Born in Ashwini? Ketu starts. This single data point — which star the Moon was visiting when you were born — sets the clock for your entire life\'s planetary chapters. No other astrological system in the world has this level of temporal specificity. Think of it as Spotify Wrapped — but for your entire life.'}
            </p>
          </div>

          <div className="glass-card rounded-lg p-4 border border-gold-primary/10">
            <p className="text-gold-light text-sm font-bold mb-2">{isHi ? 'जन्म नक्षत्र दिवस' : 'JANMA NAKSHATRA DAY'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'प्रत्येक मास जब चन्द्रमा आपके जन्म नक्षत्र में लौटता है, वह आपका "जन्म नक्षत्र दिवस" है — आपके लिए विशेष रूप से शुभ।'
                : 'Each month when the Moon returns to your birth nakshatra, that is your "Janma Nakshatra day" — considered especially auspicious for you personally.'}
            </p>
          </div>
        </div>
      </section>

      {/* Red — Misconceptions */}
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"मेरी राशि सिंह है क्योंकि मैं अगस्त में पैदा हुआ"' : '"My sign is Leo because I was born in August"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'यह केवल पश्चिमी ट्रॉपिकल सूर्य राशि है। वैदिक ज्योतिष में आपकी सूर्य राशि कर्क हो सकती है (24° अयनांश) और आपकी "राशि" (चन्द्र राशि) कुछ भी हो सकती है!'
              : 'That\'s only your Western tropical Sun sign. In Vedic astrology, your Sun sign might be Cancer (24-degree ayanamsha), and your "rashi" (Moon sign) could be anything!'}
          </p>
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"नक्षत्र बस पश्चिमी नक्षत्रमंडल (constellations) के भारतीय नाम हैं"' : '"Nakshatras are just Indian names for Western constellations"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'पूर्णतः भिन्न। नक्षत्र 13°20\' के बराबर भाग हैं — गणितीय विभाजन। पश्चिमी नक्षत्रमंडल अनियमित, काल्पनिक आकृतियाँ हैं। नक्षत्र क्रान्तिवृत्त पर हैं; पश्चिमी नक्षत्रमंडल पूरे आकाश में फैले हैं।'
              : 'Completely different. Nakshatras are equal 13 degree 20 minute segments — mathematical divisions. Western constellations are irregular, imaginary shapes. Nakshatras are ON the ecliptic; Western constellations span the entire sky.'}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">{isHi ? 'ऐतिहासिक रिकॉर्ड:' : 'Historical record:'}</span>{' '}
          {isHi
            ? 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है — यह मानव इतिहास में सबसे प्राचीन निरन्तर प्रयुक्त खगोलीय निर्देशांक प्रणाली है। पश्चिमी राशियाँ केवल ~2,500 वर्ष पुरानी हैं। भारतीय नक्षत्र 3,500+ वर्ष पुराने हैं — और आज भी प्रतिदिन करोड़ों लोग इनका उपयोग करते हैं।'
            : 'The Rigveda (c. 1500 BCE) mentions nakshatras — making this the oldest continuously used astronomical coordinate system in human history. The Western zodiac signs are only ~2,500 years old. Indian nakshatras are 3,500+ years old — and still used daily by hundreds of millions of people.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'हमारा ऐप आपकी सटीक चन्द्र राशि, नक्षत्र और पद की गणना शुद्ध गणित से करता है — वही खगोलीय कलनविधि जो NASA उपयोग करता है। अपना राशि कैलकुलेटर अभी आज़माएँ और अपना ब्रह्माण्डीय पता खोजें!'
            : 'Our app calculates your exact Moon sign, nakshatra, and pada using pure mathematics — the same astronomical algorithms NASA uses. Try our Sign Calculator now and discover your cosmic address!'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi
            ? 'कालजैविकी (Chronobiology) — जैविक घड़ियों का अध्ययन — को 2017 का नोबेल पुरस्कार मिला। शोधकर्ताओं ने पाया कि आपके शरीर की हर कोशिका में बाहरी प्रकाश चक्रों से जुड़ी एक घड़ी है। नक्षत्र प्रणाली, अपने मूल में, 27-चरणीय चान्द्र घड़ी है जिसे प्राचीन भारतीयों ने मानव स्वभाव, स्वास्थ्य और जीवन प्रतिरूपों से सहसम्बन्धित किया। क्या ये सहसम्बन्ध आधुनिक सांख्यिकीय जाँच में टिकते हैं — यह एक खुला शोध प्रश्न है — लेकिन ढाँचा वैज्ञानिक रूप से सुसंगत है। आपके फ़ोन का GPS उन्हीं कक्षीय यान्त्रिकी का उपयोग करता है जो ये गणनाएँ करती हैं।'
            : 'Chronobiology (the study of biological clocks) earned the 2017 Nobel Prize. The researchers found that every cell in your body has a clock tuned to external light cycles. The nakshatra system is, at its core, a 27-phase lunar clock that ancient Indians correlated with human temperament, health, and life patterns. Whether the correlations hold up to modern statistical scrutiny is an open research question — but the framework is scientifically coherent. Your phone\'s GPS uses the same orbital mechanics that power these calculations.'}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_3Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}

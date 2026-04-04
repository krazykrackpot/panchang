'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

// ─── Module Metadata ────────────────────────────────────────────────────────

const META: ModuleMeta = {
  id: 'mod_0_1',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.1',
  title: { en: 'What is Jyotish? (And What It Isn\'t)', hi: 'ज्योतिष क्या है? (और क्या नहीं है)' },
  subtitle: { en: 'India\'s oldest scientific tradition — astronomy, not fortune-telling', hi: 'भारत की सबसे प्राचीन वैज्ञानिक परम्परा — खगोलशास्त्र, भविष्यवाणी नहीं' },
  estimatedMinutes: 10,
  crossRefs: [
    { label: { en: '0.2 The Hindu Calendar', hi: '0.2 हिन्दू पंचांग' }, href: '/learn/modules/0-2' },
    { label: { en: '0.3 Your Cosmic Address', hi: '0.3 आपका ब्रह्माण्डीय पता' }, href: '/learn/modules/0-3' },
    { label: { en: '1.1 The Night Sky & Ecliptic', hi: '1.1 रात्रि आकाश एवं क्रान्तिवृत्त' }, href: '/learn/modules/1-1' },
  ],
};

// ─── Question Bank (10 questions, 5 drawn per attempt) ──────────────────────

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q0_1_01', type: 'mcq',
    question: { en: 'What does the word "Jyotish" literally mean?', hi: '"ज्योतिष" शब्द का शाब्दिक अर्थ क्या है?' },
    options: [
      { en: 'Science of fate', hi: 'भाग्य का विज्ञान' },
      { en: 'Science of light/luminaries', hi: 'ज्योति/प्रकाश का विज्ञान' },
      { en: 'Science of stars', hi: 'तारों का विज्ञान' },
      { en: 'Science of time', hi: 'समय का विज्ञान' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Jyotish comes from "Jyoti" (ज्योति) meaning light or luminaries. It is the science of celestial lights — the Sun, Moon, and planets. The term emphasizes observation of luminous bodies, not fortune-telling.', hi: 'ज्योतिष "ज्योति" से आया है जिसका अर्थ है प्रकाश। यह आकाशीय ज्योतियों — सूर्य, चन्द्र और ग्रहों — का विज्ञान है।' },
  },
  {
    id: 'q0_1_02', type: 'mcq',
    question: { en: 'Which are the three branches of Jyotish?', hi: 'ज्योतिष की तीन शाखाएँ कौन सी हैं?' },
    options: [
      { en: 'Vastu, Tantra, Mantra', hi: 'वास्तु, तन्त्र, मन्त्र' },
      { en: 'Siddhanta, Hora, Samhita', hi: 'सिद्धान्त, होरा, संहिता' },
      { en: 'Jataka, Prashna, Muhurta', hi: 'जातक, प्रश्न, मुहूर्त' },
      { en: 'Ganita, Phalita, Shakuna', hi: 'गणित, फलित, शकुन' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The three classical branches are: Siddhanta (mathematical astronomy — eclipses, planetary positions), Hora (horoscopy — birth chart interpretation), and Samhita (mundane — weather, agriculture, national events).', hi: 'तीन शास्त्रीय शाखाएँ: सिद्धान्त (गणितीय खगोलशास्त्र), होरा (जन्मकुण्डली व्याख्या), संहिता (सामूहिक — मौसम, कृषि, राष्ट्रीय घटनाएँ)।' },
    classicalRef: 'Varahamihira, Brihat Samhita',
  },
  {
    id: 'q0_1_03', type: 'true_false',
    question: { en: 'Aryabhata (476 CE) believed the Earth was fixed and did not rotate.', hi: 'आर्यभट (476 ई.) मानते थे कि पृथ्वी स्थिर है और घूमती नहीं।' },
    correctAnswer: false,
    explanation: { en: 'False. Aryabhata explicitly stated that the Earth rotates on its axis, causing the apparent movement of stars. This was a revolutionary idea — Europe would not accept heliocentrism for another thousand years.', hi: 'गलत। आर्यभट ने स्पष्ट कहा कि पृथ्वी अपनी धुरी पर घूमती है। यूरोप ने यह बात हज़ार वर्ष बाद मानी।' },
    classicalRef: 'Aryabhatiya, Golapada v.9',
  },
  {
    id: 'q0_1_04', type: 'mcq',
    question: { en: 'How accurate was Aryabhata\'s calculation of Earth\'s circumference?', hi: 'आर्यभट द्वारा पृथ्वी की परिधि की गणना कितनी सटीक थी?' },
    options: [
      { en: 'About 50% accurate', hi: 'लगभग 50% सटीक' },
      { en: 'About 75% accurate', hi: 'लगभग 75% सटीक' },
      { en: 'About 90% accurate', hi: 'लगभग 90% सटीक' },
      { en: 'About 99.8% accurate', hi: 'लगभग 99.8% सटीक' },
    ],
    correctAnswer: 3,
    explanation: { en: 'Aryabhata calculated Earth\'s circumference as 39,968 km. The actual value is 40,075 km — an error of just 0.2%. This was achieved a thousand years before Columbus sailed, using pure mathematics and observation.', hi: 'आर्यभट ने पृथ्वी की परिधि 39,968 किमी गणित की। वास्तविक मान 40,075 किमी है — केवल 0.2% त्रुटि। कोलम्बस से हज़ार वर्ष पहले!', },
    classicalRef: 'Aryabhatiya, Golapada',
  },
  {
    id: 'q0_1_05', type: 'mcq',
    question: { en: 'The English word "sine" (trigonometry) derives from which Sanskrit word?', hi: 'अंग्रेजी शब्द "sine" (त्रिकोणमिति) किस संस्कृत शब्द से आया है?' },
    options: [
      { en: 'Jya (ज्या, bowstring)', hi: 'ज्या (धनुष की डोरी)' },
      { en: 'Koti (कोटि, side)', hi: 'कोटि (भुजा)' },
      { en: 'Trijya (त्रिज्या, radius)', hi: 'त्रिज्या' },
      { en: 'Karna (कर्ण, hypotenuse)', hi: 'कर्ण' },
    ],
    correctAnswer: 0,
    explanation: { en: 'Sanskrit "jya" (bowstring) was transliterated to Arabic as "jiba," which was misread as "jaib" (fold/pocket) by Latin translators, who rendered it as "sinus" — giving us "sine." Indian mathematicians invented trigonometry for astronomical calculations.', hi: 'संस्कृत "ज्या" अरबी में "जिबा" बना, फिर लैटिन में "sinus" — और अंग्रेज़ी में "sine"। भारतीय गणितज्ञों ने खगोलीय गणना के लिए त्रिकोणमिति का आविष्कार किया।' },
    classicalRef: 'Aryabhatiya, Ganita section',
  },
  {
    id: 'q0_1_06', type: 'true_false',
    question: { en: 'Vedic (Jyotish) and Western astrology use the same zodiac system.', hi: 'वैदिक (ज्योतिष) और पश्चिमी ज्योतिष एक ही राशिचक्र प्रणाली का उपयोग करते हैं।' },
    correctAnswer: false,
    explanation: { en: 'False. Jyotish uses the sidereal zodiac (fixed to stars), while Western astrology uses the tropical zodiac (fixed to seasons). They have diverged by about 24 degrees today, which means your Vedic sign is usually one sign behind your Western sign.', hi: 'गलत। ज्योतिष साइडरियल (तारा-स्थिर) राशिचक्र का उपयोग करता है, पश्चिमी ज्योतिष ट्रॉपिकल (ऋतु-स्थिर) का। आज ~24° का अन्तर है।' },
  },
  {
    id: 'q0_1_07', type: 'mcq',
    question: { en: 'Which system has nakshatras (27 lunar mansions)?', hi: 'किस प्रणाली में नक्षत्र (27 चन्द्र गृह) हैं?' },
    options: [
      { en: 'Western astrology only', hi: 'केवल पश्चिमी ज्योतिष' },
      { en: 'Both Western and Vedic', hi: 'पश्चिमी और वैदिक दोनों' },
      { en: 'Vedic Jyotish only', hi: 'केवल वैदिक ज्योतिष' },
      { en: 'Chinese astrology only', hi: 'केवल चीनी ज्योतिष' },
    ],
    correctAnswer: 2,
    explanation: { en: 'The 27 nakshatras are unique to Vedic Jyotish. They divide the ecliptic into 27 equal parts of 13 degrees 20 minutes each, based on the Moon\'s ~27.3-day sidereal period. Western astrology has no equivalent system.', hi: '27 नक्षत्र वैदिक ज्योतिष की अनूठी विशेषता है। ये क्रान्तिवृत्त को 27 बराबर भागों में बाँटते हैं, प्रत्येक 13°20\'। पश्चिमी ज्योतिष में ऐसी कोई प्रणाली नहीं।' },
  },
  {
    id: 'q0_1_08', type: 'mcq',
    question: { en: 'Brahmagupta (628 CE) gave the first rules for zero and negative numbers in which type of text?', hi: 'ब्रह्मगुप्त (628 ई.) ने शून्य और ऋणात्मक संख्याओं के नियम किस प्रकार के ग्रन्थ में दिए?' },
    options: [
      { en: 'A philosophy text', hi: 'एक दर्शन ग्रन्थ' },
      { en: 'A medical text', hi: 'एक चिकित्सा ग्रन्थ' },
      { en: 'An astronomy text', hi: 'एक खगोलशास्त्र ग्रन्थ' },
      { en: 'A grammar text', hi: 'एक व्याकरण ग्रन्थ' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Brahmagupta formalized rules for zero and negative numbers in his Brahmasphutasiddhanta (628 CE), which is primarily an astronomy text. Mathematics and astronomy were deeply intertwined in India — mathematical breakthroughs were driven by the need for precise astronomical calculations.', hi: 'ब्रह्मगुप्त ने ब्राह्मस्फुटसिद्धान्त में शून्य और ऋणात्मक संख्याओं के नियम दिए — यह मुख्यतः एक खगोलशास्त्र ग्रन्थ है। भारत में गणित और खगोलशास्त्र गहरे रूप से जुड़े थे।' },
    classicalRef: 'Brahmasphutasiddhanta Ch.18',
  },
  {
    id: 'q0_1_09', type: 'true_false',
    question: { en: 'The Surya Siddhanta calculated the sidereal year with an error of only 1.4 seconds per year.', hi: 'सूर्य सिद्धान्त ने नाक्षत्र वर्ष की गणना केवल 1.4 सेकण्ड प्रति वर्ष की त्रुटि से की।' },
    correctAnswer: true,
    explanation: { en: 'The Surya Siddhanta gives the sidereal year as 365.2587565 days. The modern value is 365.25636 days. The difference is about 1.4 seconds per year — an extraordinary achievement for a text composed around 400 CE without telescopes or modern instruments.', hi: 'सूर्य सिद्धान्त में नाक्षत्र वर्ष 365.2587565 दिन दिया गया। आधुनिक मान 365.25636 दिन है। अन्तर प्रति वर्ष केवल ~1.4 सेकण्ड — बिना दूरबीन के अद्भुत उपलब्धि!', },
    classicalRef: 'Surya Siddhanta Ch.1',
  },
  {
    id: 'q0_1_10', type: 'mcq',
    question: { en: 'What does the Dasha system in Jyotish predict that Western astrology cannot?', hi: 'ज्योतिष की दशा प्रणाली क्या भविष्यवाणी करती है जो पश्चिमी ज्योतिष नहीं कर सकता?' },
    options: [
      { en: 'Your personality type', hi: 'आपका व्यक्तित्व प्रकार' },
      { en: 'Your lucky number', hi: 'आपका भाग्यशाली अंक' },
      { en: 'WHEN specific planetary periods activate in your life', hi: 'कब विशिष्ट ग्रहकाल आपके जीवन में सक्रिय होंगे' },
      { en: 'What constellation is rising', hi: 'कौन सा तारामंडल उदय हो रहा है' },
    ],
    correctAnswer: 2,
    explanation: { en: 'The Vimshottari Dasha system is unique to Jyotish. It assigns specific time periods (up to 20 years each) ruled by different planets, providing a timeline of when different planetary influences become dominant. Western astrology has no comparable timing mechanism.', hi: 'विंशोत्तरी दशा ज्योतिष की अनूठी प्रणाली है। यह विभिन्न ग्रहों द्वारा शासित विशिष्ट समयकाल निर्धारित करती है, बताती है कब कौन सा ग्रहीय प्रभाव प्रबल होगा।' },
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
          {isHi ? '"ज्योति" का विज्ञान' : 'The "Science of Light"'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'ज्योतिष शब्द "ज्योति" (प्रकाश, दीप्ति) से बना है। यह भविष्यवाणी नहीं — यह आकाशीय ज्योतियों का अध्ययन है: सूर्य, चन्द्रमा, और ग्रहों का। यह भारत की सबसे प्राचीन निरन्तर वैज्ञानिक परम्परा है — यूनानी खगोलशास्त्र से भी पुरानी।'
            : 'The word Jyotish comes from "Jyoti" (ज्योति) — light, luminance. It is NOT fortune-telling. It is the study of celestial luminaries: the Sun, Moon, and planets. This is India\'s OLDEST continuous scientific tradition — predating Greek astronomy by centuries.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'ज्योतिष की तीन शाखाएँ हैं, और केवल एक कुण्डली से सम्बन्धित है:'
            : 'Jyotish has three branches, and only ONE is about horoscopes:'}
        </p>
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'सिद्धान्त' : 'Siddhanta'}</span>{' '}
            {isHi
              ? '— गणितीय खगोलशास्त्र। ग्रहगति, ग्रहण, उदय-अस्त — शुद्ध गणित।'
              : '— Mathematical astronomy. Planetary positions, eclipses, sunrise/sunset — pure mathematics.'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'होरा' : 'Hora'}</span>{' '}
            {isHi
              ? '— जन्मकुण्डली विश्लेषण। यही वह शाखा है जिसे लोग "ज्योतिष" समझते हैं।'
              : '— Birth chart interpretation. This is what most people think of as "astrology."'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'संहिता' : 'Samhita'}</span>{' '}
            {isHi
              ? '— सामूहिक ज्योतिष: मौसम, कृषि, राष्ट्रीय घटनाएँ, प्राकृतिक संकेत।'
              : '— Mundane astrology: weather, agriculture, national events, natural omens.'}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {isHi
            ? 'इसे ऐसे समझिए: सिद्धान्त दूरबीन बनाने जैसा है। होरा उससे अपने जीवन को देखने जैसा है। संहिता उससे समाज के लिए मौसम की भविष्यवाणी करने जैसा है।'
            : 'Think of it this way: Siddhanta is like building the telescope. Hora is like looking through it at your life. Samhita is like using it to forecast weather for society.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'एक चौंकाने वाला तथ्य: आपके फ़ोन पर हर अंक — 0, 1, 2, 3... 9 — भारत में खगोलीय गणनाओं के लिए आविष्कार किया गया था। पश्चिम इन्हें "अरबी अंक" कहता है, लेकिन अरबी विद्वान इन्हें "हिन्दू अंक" (अल-अरक़ाम अल-हिन्दिय्या) कहते थे। शून्य की अवधारणा? वह ब्रह्मगुप्त की है — एक खगोलशास्त्र की पुस्तक में।'
            : 'Here\'s a mind-blowing fact: every number on your phone — 0, 1, 2, 3... 9 — was invented in India, originally for astronomical calculations. The West calls them "Arabic numerals" but Arabic scholars called them "Hindu numerals" (al-arqam al-hindiyyah). The concept of zero? That\'s Brahmagupta, in an astronomy textbook.'}
        </p>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भारतीय खगोलशास्त्र की उपलब्धियाँ विस्मयकारी हैं — और पश्चिम में बहुत कम ज्ञात हैं:'
            : 'Indian astronomical achievements are staggering — and shockingly under-known in the West:'}
        </p>
        <ul className="text-text-secondary text-sm space-y-3 ml-2">
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'आर्यभट (476 ई.)' : 'Aryabhata (476 CE)'}</span>{' '}
            {isHi
              ? '— पृथ्वी की परिधि 39,968 किमी गणित की (वास्तविक: 40,075 किमी — 99.8% सटीक)। कोलम्बस से हज़ार वर्ष पहले! उन्होंने कहा कि पृथ्वी अपनी धुरी पर घूमती है — जबकि यूरोप मानता था कि पृथ्वी स्थिर है।'
              : '— calculated Earth\'s circumference as 39,968 km (actual: 40,075 km — 99.8% accuracy). A THOUSAND years before Columbus! He stated Earth ROTATES on its axis — while Europe believed it was fixed.'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'त्रिकोणमिति का "sine"' : 'Trigonometry\'s "sine"'}</span>{' '}
            {isHi
              ? '— अंग्रेजी शब्द "sine" संस्कृत "ज्या" (धनुष की डोरी) से आया → अरबी "जिबा" → लैटिन "sinus"। भारतीय गणितज्ञों ने खगोलीय गणना के लिए त्रिकोणमिति का आविष्कार किया।'
              : '— the word "sine" comes from Sanskrit "jya" (bowstring) → Arabic "jiba" → Latin "sinus." Indian mathematicians invented trigonometry FOR astronomical calculations.'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'वराहमिहिर (505 ई.)' : 'Varahamihira (505 CE)'}</span>{' '}
            {isHi
              ? '— पंचसिद्धान्तिका में 5 भिन्न खगोलीय प्रणालियों की तुलना की — 1500 वर्ष पहले सहकर्मी समीक्षा (peer review)!'
              : '— wrote Pancha Siddhantika comparing 5 different astronomical systems — peer review 1,500 years ago!'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'ब्रह्मगुप्त (628 ई.)' : 'Brahmagupta (628 CE)'}</span>{' '}
            {isHi
              ? '— शून्य और ऋणात्मक संख्याओं के पहले नियम दिए — एक खगोलशास्त्र ग्रन्थ (ब्राह्मस्फुटसिद्धान्त) में!'
              : '— gave the first rules for zero and negative numbers — in an ASTRONOMY text (Brahmasphutasiddhanta)!'}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4">
          {isHi
            ? 'आर्यभट ने केवल पृथ्वी की परिधि नहीं गणित की — उन्होंने कहा कि पृथ्वी अपनी धुरी पर घूमती है। 499 ई. में। कोपर्निकस ने यूरोप में यह प्रस्ताव 1543 तक नहीं रखा — एक हज़ार वर्ष बाद। और "कलनविधि" (algorithm) शब्द? यह अल-ख़्वारिज़्मी से आया — जिन्होंने भारतीय गणित से सीखा।'
            : 'Aryabhata didn\'t just calculate Earth\'s circumference — he stated that Earth ROTATES on its axis. In 499 CE. Copernicus wouldn\'t propose this in Europe until 1543 — over a THOUSAND years later. And the word "algorithm"? It traces back to al-Khwarizmi, who learned from Indian mathematics.'}
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
          {isHi ? 'ज्योतिष बनाम पश्चिमी ज्योतिष' : 'Jyotish vs Western Astrology'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'जब कोई पश्चिमी देश में कहता है "मेरी राशि मिथुन है" और एक भारतीय कहता है "मेरी राशि वृषभ है" — दोनों सही हो सकते हैं। वे दो पूरी तरह से भिन्न प्रणालियों का उपयोग कर रहे हैं। समझिए कैसे।'
            : 'When someone in the West says "I\'m a Gemini" and an Indian says "My rashi is Vrishabha (Taurus)" — both can be correct. They\'re using two completely different systems. Here\'s why.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'पश्चिमी ज्योतिष "ट्रॉपिकल" राशिचक्र का उपयोग करता है जो ऋतुओं (विषुव) से जुड़ा है। वैदिक ज्योतिष "साइडरियल" (निरयन) राशिचक्र का उपयोग करता है जो वास्तविक तारों से जुड़ा है। पृथ्वी की अक्षीय पुरस्सरण (precession) के कारण ये दोनों प्रणालियाँ प्रतिवर्ष ~50 आर्कसेकण्ड खिसकती जा रही हैं। आज यह अन्तर लगभग 24° है — जिसका अर्थ है कि आपकी वैदिक राशि प्रायः आपकी पश्चिमी राशि से एक राशि पीछे होगी।'
            : 'Western astrology uses the "Tropical" zodiac, anchored to the seasons (equinoxes). Vedic astrology uses the "Sidereal" (Nirayana) zodiac, anchored to the actual fixed stars. Due to Earth\'s axial precession, these two systems are drifting apart at ~50 arcseconds per year. Today the gap is about 24° — meaning your Vedic sign is usually one sign behind your Western sign.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'लेकिन अन्तर केवल राशिचक्र का नहीं है। वैदिक ज्योतिष के पास ऐसे शक्तिशाली उपकरण हैं जिनका पश्चिमी ज्योतिष में कोई समकक्ष नहीं — 27 नक्षत्र प्रणाली, दशा समय पद्धति (जो बताती है कब क्या होगा, न कि केवल क्या हो सकता है), और मुहूर्त चयन (शुभ समय ज्ञात करने की विस्तृत विधि)। नीचे दी गई तालिका में प्रमुख अन्तर देखें:'
            : 'But the differences go far beyond the zodiac. Vedic Jyotish has powerful tools with no Western equivalent — the 27 Nakshatra system, the Dasha timing system (which predicts WHEN events unfold, not just what might happen), and Muhurta selection (an elaborate method for finding auspicious times). The table below highlights the key differences:'}
        </p>

        {/* Comparison table */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary text-xs py-2 pr-3">{isHi ? 'पहलू' : 'Aspect'}</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">{isHi ? 'वैदिक (ज्योतिष)' : 'Vedic (Jyotish)'}</th>
                <th className="text-left text-blue-300 text-xs py-2">{isHi ? 'पश्चिमी' : 'Western'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'राशिचक्र' : 'Zodiac'}</td>
                <td className="py-2 pr-3">{isHi ? 'साइडरियल (तारा-स्थिर)' : 'Sidereal (star-fixed)'}</td>
                <td className="py-2">{isHi ? 'ट्रॉपिकल (ऋतु-स्थिर)' : 'Tropical (season-fixed)'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'प्रमुख ज्योति' : 'Primary luminary'}</td>
                <td className="py-2 pr-3">{isHi ? 'चन्द्रमा (मन)' : 'Moon (mind)'}</td>
                <td className="py-2">{isHi ? 'सूर्य (अहंकार)' : 'Sun (ego)'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'विचलन' : 'Divergence'}</td>
                <td className="py-2 pr-3" colSpan={2}>{isHi ? 'आज ~24° — आपकी वैदिक राशि प्रायः एक राशि पीछे होती है' : 'About 24 degrees today — your Vedic sign is usually ONE sign behind your Western sign'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'नक्षत्र' : 'Nakshatras'}</td>
                <td className="py-2 pr-3">{isHi ? '27 चन्द्र नक्षत्र' : '27 lunar mansions'}</td>
                <td className="py-2">{isHi ? 'कोई समकक्ष नहीं' : 'No equivalent'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'समय प्रणाली' : 'Timing system'}</td>
                <td className="py-2 pr-3">{isHi ? 'दशा (कब घटनाएँ होंगी)' : 'Dasha (WHEN events happen)'}</td>
                <td className="py-2">{isHi ? 'केवल गोचर' : 'Transits only'}</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-text-tertiary">{isHi ? 'मुहूर्त' : 'Muhurta'}</td>
                <td className="py-2 pr-3">{isHi ? 'शुभ समय चयन (विस्तृत)' : 'Auspicious time selection (elaborate)'}</td>
                <td className="py-2">{isHi ? 'कोई समकक्ष नहीं' : 'No equivalent'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {isHi
            ? 'व्यावहारिक अन्तर इस प्रकार है: एक पश्चिमी ज्योतिषी से पूछिए "मेरा विवाह कब होगा?" — वे कहेंगे "जब शुक्र आपके सप्तम भाव में गोचर करेगा।" एक वैदिक ज्योतिषी से वही प्रश्न पूछिए — वे कहेंगे "आपकी शुक्र महादशा में, विशेष रूप से गुरु अन्तर्दशा में, जब गुरु चन्द्रमा से सप्तम भाव में गोचर करेगा — सम्भवतः मार्च और अगस्त 2028 के बीच।" दशा प्रणाली एक समय-रेखा जोड़ती है जो पश्चिमी ज्योतिष के पास बस नहीं है। इसे ऐसे सोचिए: Spotify Wrapped — लेकिन आपके पूरे जीवन के लिए।'
            : 'Here\'s the practical difference: ask a Western astrologer "When will I get married?" and they\'ll say "when Venus transits your 7th house." Ask a Vedic astrologer the same question and they\'ll say "During your Venus Mahadasha, specifically in the Jupiter Antardasha, triggered when Jupiter transits your 7th from Moon — likely between March and August 2028." The Dasha system adds a TIMELINE that Western astrology simply cannot. Think of it as Spotify Wrapped — but for your entire life.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'केरल गणित सम्प्रदाय (14वीं-16वीं शताब्दी ई.) ने π और त्रिकोणमितीय फलनों के लिए अनन्त श्रेणियाँ विकसित कीं — न्यूटन और लाइब्निट्ज़ से 300 वर्ष पहले — विशेष रूप से ज्योतिष के लिए खगोलीय गणनाओं को सुधारने के लिए। कलनगणित (calculus) का आविष्कार बेहतर कुण्डलियों के लिए हुआ था।'
            : 'The Kerala School of Mathematics (14th-16th century CE) developed infinite series for pi and trigonometric functions — 300 years before Newton and Leibniz — specifically to improve astronomical calculations for Jyotish. Calculus was literally invented for better horoscopes.'}
        </p>
      </section>

      {/* Emerald fact card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'चौंकाने वाले तथ्य' : 'Astonishing Facts'}
        </h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-emerald-300 font-bold">{isHi ? 'सूर्य सिद्धान्त (लगभग 400 ई.)' : 'Surya Siddhanta (c. 400 CE)'}</span>{' '}
            {isHi
              ? '— नाक्षत्र वर्ष 365.2587565 दिन गणित किया। वास्तविक मान 365.25636 दिन है। प्रति वर्ष त्रुटि केवल 1.4 सेकण्ड!'
              : '— calculated the sidereal year as 365.2587565 days. The actual value is 365.25636 days. Error: only 1.4 SECONDS per year!'}
          </p>
          <p>
            <span className="text-emerald-300 font-bold">{isHi ? 'जन्तर मन्तर वेधशालाएँ' : 'Jantar Mantar Observatories'}</span>{' '}
            {isHi
              ? '— महाराजा जयसिंह द्वितीय ने 1734 तक 5 शहरों में सार्वजनिक वेधशालाएँ बनवाईं। पत्थर के उपकरण, 2 आर्कसेकण्ड तक सटीक!'
              : '— Maharaja Jai Singh II built public observatories in 5 cities by 1734. Stone instruments accurate to 2 arcseconds!'}
          </p>
        </div>
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
          {isHi ? 'यह पाठ्यक्रम आपको क्या सिखाएगा' : 'What This Course Will Teach You'}
        </h3>
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'दैनिक पंचांग पढ़ना' : 'Reading a daily Panchang'}</span>{' '}
            — {isHi ? 'आपकी दैनिक ब्रह्माण्डीय मौसम रिपोर्ट' : 'your cosmic weather report for each day'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'जन्मकुण्डली समझना' : 'Understanding a birth chart'}</span>{' '}
            — {isHi ? 'आपका ब्रह्माण्डीय DNA' : 'your cosmic DNA'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'गणना के पीछे का गणित' : 'The mathematics behind the calculations'}</span>{' '}
            — {isHi ? 'वास्तविक कलनविधि, रहस्यवाद नहीं' : 'real algorithms, not mysticism'}
          </li>
          <li>
            <span className="text-gold-light font-medium">{isHi ? 'सांस्कृतिक सन्दर्भ' : 'Cultural context'}</span>{' '}
            — {isHi ? 'हिन्दू अनुष्ठानों और त्योहारों के लिए' : 'for Hindu rituals and festivals'}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          <span className="text-red-300 font-bold">{isHi ? 'यह पाठ्यक्रम दावा नहीं करेगा:' : 'What this course will NOT claim:'}</span>{' '}
          {isHi
            ? 'नियतिवादी भाग्य भविष्यवाणी, पेशेवर सलाह का विकल्प, या अलौकिक शक्तियाँ।'
            : 'deterministic fate prediction, replacement for professional advice, or supernatural powers.'}
        </p>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"ज्योतिष केवल अन्धविश्वास है"' : '"Jyotish is just superstition"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'खगोलीय गणनाएँ विज्ञान हैं — NASA JPL से सत्यापित। व्याख्या परम्परा सांस्कृतिक ज्ञान है, जैसे कोई भी अर्थ-निर्माण प्रणाली। हमारा ऐप दोनों को अलग करता है: गणित सटीक है, व्याख्या पारम्परिक है।'
              : 'The astronomical calculations ARE science — verified against NASA JPL. The interpretive tradition is cultural wisdom, like any system of meaning-making. Our app separates the two: the math is exact, the interpretation is traditional.'}
          </p>
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"ज्योतिष यूनानी ज्योतिष से कॉपी किया गया"' : '"Jyotish was copied from Greek astrology"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है — यूनानी राशिचक्र से एक सहस्राब्दी पूर्व। सिकन्दर (326 ई.पू.) के बाद कुछ पारस्परिक प्रभाव हुआ, लेकिन भारतीय प्रणाली स्वतन्त्र रूप से विकसित हुई।'
              : 'The Rigveda (c. 1500 BCE) mentions nakshatras — a millennium before the Greek zodiac existed. Some cross-pollination occurred after Alexander (326 BCE), but the Indian system developed independently.'}
          </p>
          <p>
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"ज्योतिष और पश्चिमी ज्योतिष एक ही बात है"' : '"Jyotish and Western astrology are the same thing"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'वे भिन्न राशिचक्र, भिन्न प्राथमिक ज्योति (चन्द्रमा बनाम सूर्य), और पूर्णतया भिन्न उपकरण (नक्षत्र, दशा, मुहूर्त) का उपयोग करते हैं। "आपकी राशि क्या है?" का उत्तर दोनों प्रणालियों में भिन्न होता है।'
              : 'They use different zodiacs, different primary luminaries (Moon vs Sun), and entirely different tools (nakshatras, dashas, muhurtas). The answer to "what\'s your sign?" DIFFERS between the two systems.'}
          </p>
          <p className="mt-3">
            <span className="text-red-300 font-bold">{isHi ? 'भ्रान्ति:' : 'Misconception:'}</span>{' '}
            {isHi ? '"गणनाएँ अवैज्ञानिक हैं"' : '"The calculations are unscientific"'}
            <br />
            <span className="text-emerald-300">{isHi ? 'वास्तविकता:' : 'Reality:'}</span>{' '}
            {isHi
              ? 'एक परीक्षण: हमारा ऐप दिल्ली के लिए सूर्योदय सटीक मिनट तक गणित करता है, ड्रिक पंचांग से मिलान करता है। यह चन्द्रमा की स्थिति 6ठी शताब्दी की कलनविधि से 60 sine पदों का उपयोग करके गणित करता है। गणित सत्यापन योग्य, पुनरुत्पादनीय है, और NASA के JPL पंचांग से मिलान करता है। आप व्याख्यात्मक परम्परा में विश्वास करें या न करें — यह अलग प्रश्न है — लेकिन गणनाओं को "अवैज्ञानिक" कहना तथ्यात्मक रूप से गलत है।'
              : 'Here\'s a test: our app computes sunrise for Delhi to the exact MINUTE, matching Drik Panchang. It calculates the Moon\'s position using 60 sine terms from a 6th-century algorithm. The mathematics is verifiable, reproducible, and matches NASA\'s JPL ephemeris. Whether you believe in the interpretive tradition is a separate question — but calling the calculations "unscientific" is simply incorrect.'}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? 'ज्योतिष का गणित आज भी पूर्णतः मान्य है। वही कलनविधि जो सूर्य सिद्धान्त में वर्णित हैं, आधुनिक रूप में — हमारा ऐप उन्हें चलाता है। हम Meeus कलनविधि का उपयोग करते हैं: सूर्य ~0.01°, चन्द्रमा ~0.5° सटीकता। कोई बाहरी API नहीं — शुद्ध गणित।'
            : 'The mathematics of Jyotish is still completely valid today. The same algorithms described in the Surya Siddhanta, modernized — that is what our app runs. We use Meeus algorithms: Sun accurate to ~0.01 degrees, Moon to ~0.5 degrees. No external APIs — pure math.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'दुनिया भर में अरबों हिन्दू दैनिक पंचांग से त्योहारों, विवाह, गृहप्रवेश और अनुष्ठानों का समय निर्धारित करते हैं। यह सिखाना ज्योतिष का एक व्यावहारिक, सांस्कृतिक साक्षरता कौशल है।'
            : 'Billions of Hindus worldwide use the daily Panchang to time festivals, weddings, housewarmings, and rituals. Learning this is a practical, cultural literacy skill — not a mystical pursuit.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi
            ? '2017 का चिकित्सा में नोबेल पुरस्कार शरीर की आन्तरिक घड़ी — सर्केडियन लय — पर शोध के लिए दिया गया, जो प्रकाश-अन्धकार चक्रों पर प्रतिक्रिया करती है। यह मूलतः वही है जो मुहूर्त प्रणाली 3,000 वर्षों से ट्रैक कर रही है: आकाशीय चक्रों के आधार पर विभिन्न गतिविधियों के लिए इष्टतम समय। विज्ञान उसे समझ रहा है जो वराहमिहिर ने 6वीं शताब्दी में प्रलेखित किया था।'
            : 'The 2017 Nobel Prize in Physiology/Medicine was awarded for research on circadian rhythms — the body\'s internal clock that responds to light-dark cycles. This is essentially what the Muhurta system has been tracking for 3,000 years: optimal times for different activities based on celestial cycles. Science is catching up to what Varahamihira documented in the 6th century.'}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_1Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}

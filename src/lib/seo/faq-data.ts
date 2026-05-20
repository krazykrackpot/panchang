/**
 * Multilingual FAQ data for structured data (JSON-LD FAQPage schema).
 * Used to generate rich snippets in Google Search results.
 */

export interface FAQEntry {
  question: Record<string, string>; // locale-keyed (en, hi required; sa optional)
  answer: Record<string, string>;
}

export const FAQ_DATA: Record<string, FAQEntry[]> = {
  // ─── /panchang ──────────────────────────────────────────────
  '/panchang': [
    {
      question: {
        en: 'What is Panchang?',
        hi: 'पंचांग क्या है?',
        sa: 'पञ्चाङ्गं किम् अस्ति?',
      },
      answer: {
        en: 'Panchang is the traditional Vedic Hindu calendar system that tracks five key elements (Pancha Anga): Tithi (lunar day), Nakshatra (lunar mansion), Yoga (Sun-Moon angular relationship), Karana (half-Tithi), and Vara (weekday). Dekho Panchang computes all five elements using classical astronomical algorithms for any location worldwide.',
        hi: 'पंचांग पारंपरिक वैदिक हिन्दू पंचांग पद्धति है जो पाँच प्रमुख अंगों को दर्शाती है: तिथि, नक्षत्र, योग, करण और वार। देखो पंचांग शास्त्रीय खगोलीय गणनाओं द्वारा विश्व के किसी भी स्थान के लिए ये पाँचों अंग प्रस्तुत करता है।',
        sa: 'पञ्चाङ्गं पारम्परिकं वैदिकं कालगणनापद्धतिः अस्ति यत् पञ्च प्रमुखानि अङ्गानि दर्शयति  –  तिथिः, नक्षत्रम्, योगः, करणम्, वारश्च। देखो-पञ्चाङ्गम् शास्त्रीयखगोलगणनाभिः विश्वस्य कस्मिन् अपि स्थाने एतानि पञ्चाङ्गानि गणयति।',
      },
    },
    {
      question: {
        en: 'Why does Panchang change by location?',
        hi: 'पंचांग स्थान के अनुसार क्यों बदलता है?',
        sa: 'पञ्चाङ्गं स्थानानुसारं कथं परिवर्तते?',
      },
      answer: {
        en: 'Panchang values depend on local sunrise and sunset times, which vary by geographic location. Since the Vedic day begins at sunrise rather than midnight, two cities in different time zones will have different Tithi, Nakshatra, and other elements active at any given moment. Our tool calculates sunrise precisely for your coordinates.',
        hi: 'पंचांग के मान स्थानीय सूर्योदय और सूर्यास्त पर निर्भर करते हैं, जो भौगोलिक स्थिति के अनुसार बदलते हैं। वैदिक दिन सूर्योदय से आरम्भ होता है, अतः भिन्न-भिन्न नगरों में तिथि, नक्षत्र आदि भिन्न हो सकते हैं।',
        sa: 'पञ्चाङ्गमानानि स्थानीयसूर्योदयसूर्यास्तकालयोः आश्रितानि भवन्ति, ये भौगोलिकस्थित्यनुसारं भिद्यन्ते। वैदिकदिनं सूर्योदयात् आरभते न तु अर्धरात्रात्, अतः भिन्ननगरेषु तिथिनक्षत्रादयः भिन्नाः भवितुम् अर्हन्ति। अस्माकं साधनं भवतः स्थानाङ्कानाम् अनुसारं सूर्योदयं सूक्ष्मतया गणयति।',
      },
    },
    {
      question: {
        en: 'How accurate is this Panchang?',
        hi: 'यह पंचांग कितना सटीक है?',
        sa: 'एतत् पञ्चाङ्गं कियत् सूक्ष्मम् अस्ति?',
      },
      answer: {
        en: 'Dekho Panchang uses Meeus astronomical algorithms to compute Sun and Moon positions with an accuracy of approximately 0.01 degrees for the Sun and 0.5 degrees for the Moon. All Panchang values have been verified to be within 1-2 minutes of leading reference sources for multiple locations worldwide.',
        hi: 'देखो पंचांग मीयस खगोलीय एल्गोरिदम का उपयोग करता है जो सूर्य की स्थिति लगभग 0.01 अंश और चन्द्रमा की स्थिति लगभग 0.5 अंश की सटीकता से गणना करता है। सभी पंचांग मान प्रमुख संदर्भ स्रोतों से 1-2 मिनट के भीतर सत्यापित हैं।',
        sa: 'देखो-पञ्चाङ्गं मीयस-खगोलगणितसूत्राणि उपयुज्य सूर्यस्य स्थितिं प्रायः ०.०१ अंशपर्यन्तं चन्द्रमसश्च ०.५ अंशपर्यन्तं सूक्ष्मतया गणयति। सर्वाणि पञ्चाङ्गमानानि विश्वस्य अनेकस्थानेषु प्रमुखसन्दर्भस्रोतोभ्यः १-२ निमेषाभ्यन्तरे सत्यापितानि।',
      },
    },
  ],

  // ─── /panchang/tithi ────────────────────────────────────────
  '/panchang/tithi': [
    {
      question: {
        en: 'What is Tithi in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में तिथि क्या है?',
        sa: 'वैदिकज्योतिषशास्त्रे तिथिः का अस्ति?',
      },
      answer: {
        en: 'Tithi is a lunar day in the Vedic calendar, defined by each 12-degree increase in the angular distance between the Moon and the Sun. There are 30 Tithis in a lunar month, from Pratipada (1st) to Amavasya (new moon) or Purnima (full moon). Each Tithi has specific auspicious and inauspicious qualities for different activities.',
        hi: 'तिथि वैदिक पंचांग में चान्द्र दिवस है, जो चन्द्रमा और सूर्य के बीच 12 अंश के अन्तर से निर्धारित होती है। एक चान्द्र मास में प्रतिपदा से अमावस्या या पूर्णिमा तक 30 तिथियाँ होती हैं। प्रत्येक तिथि का विभिन्न कार्यों के लिए विशेष शुभ-अशुभ महत्व है।',
        sa: 'तिथिः वैदिकपञ्चाङ्गे चान्द्रदिनम् अस्ति, सूर्यचन्द्रयोः कोणान्तरस्य प्रति-द्वादशांशवृद्ध्या निर्धार्यते। एकस्मिन् चान्द्रमासे प्रतिपदः आरभ्य अमावास्यापर्यन्तं वा पूर्णिमापर्यन्तं त्रिंशत् तिथयः भवन्ति। प्रत्येका तिथिः विविधकर्मसु शुभाशुभगुणैः विशिष्टा भवति।',
      },
    },
    {
      question: {
        en: 'What is the difference between Shukla and Krishna Paksha?',
        hi: 'शुक्ल पक्ष और कृष्ण पक्ष में क्या अन्तर है?',
        sa: 'शुक्लपक्षकृष्णपक्षयोः कः भेदः?',
      },
      answer: {
        en: 'Shukla Paksha is the waxing (bright) fortnight from new moon to full moon, considered generally auspicious for new beginnings. Krishna Paksha is the waning (dark) fortnight from full moon to new moon, often preferred for spiritual practices and introspection. Each Paksha contains 15 Tithis.',
        hi: 'शुक्ल पक्ष अमावस्या से पूर्णिमा तक का बढ़ता हुआ (उजला) पखवाड़ा है, जो नए कार्यों के लिए शुभ माना जाता है। कृष्ण पक्ष पूर्णिमा से अमावस्या तक का घटता हुआ (अँधेरा) पखवाड़ा है, जो साधना और आत्मचिन्तन के लिए उपयुक्त है।',
        sa: 'शुक्लपक्षः अमावास्यातः पूर्णिमापर्यन्तं वर्धमानचन्द्रस्य पक्षार्धम् अस्ति, नवकार्याणाम् आरम्भाय सामान्यतः शुभं मन्यते। कृष्णपक्षः पूर्णिमातः अमावास्यापर्यन्तं क्षीयमाणचन्द्रस्य पक्षार्धम् अस्ति, आध्यात्मिकसाधनायै आत्मनिरीक्षणाय च उपयुक्तः। प्रत्येकस्मिन् पक्षे पञ्चदश तिथयः भवन्ति।',
      },
    },
    {
      question: {
        en: 'What is Kshaya Tithi?',
        hi: 'क्षय तिथि क्या है?',
        sa: 'क्षयतिथिः का अस्ति?',
      },
      answer: {
        en: 'A Kshaya Tithi is a "lost" or "skipped" Tithi that begins and ends within the same sunrise-to-sunrise day, meaning it never occupies a sunrise moment. This is a rare astronomical occurrence caused by the varying speed of the Moon. Kshaya Tithis have special rules in the Hindu calendar for festival and Vrat observances.',
        hi: 'क्षय तिथि वह तिथि है जो एक ही सूर्योदय से अगले सूर्योदय के बीच आरम्भ और समाप्त हो जाती है, अर्थात् किसी भी सूर्योदय पर वह तिथि नहीं होती। यह चन्द्रमा की गति में परिवर्तन के कारण दुर्लभ खगोलीय घटना है।',
        sa: 'क्षयतिथिः सा तिथिः या एकस्मिन् एव सूर्योदयान्तराले आरभते समाप्यते च, अर्थात् कस्मिन् अपि सूर्योदयकाले सा तिथिः न विद्यते। चन्द्रमसः गतिवैचित्र्यात् एषा दुर्लभा खगोलीयघटना भवति। हिन्दुपञ्चाङ्गे क्षयतिथीनां पर्वव्रतानुष्ठाने विशेषनियमाः सन्ति।',
      },
    },
  ],

  // ─── /panchang/nakshatra ────────────────────────────────────
  '/panchang/nakshatra': [
    {
      question: {
        en: 'What are Nakshatras?',
        hi: 'नक्षत्र क्या हैं?',
        sa: 'नक्षत्राणि कानि सन्ति?',
      },
      answer: {
        en: 'Nakshatras are the 27 lunar mansions in Vedic astrology, each spanning 13 degrees 20 minutes of the zodiac. They represent the position of the Moon along the ecliptic and are fundamental to Vedic horoscopy, Muhurta selection, and Panchang calculations. Dekho Panchang displays the current Nakshatra with precise start and end times for your location.',
        hi: 'नक्षत्र वैदिक ज्योतिष में 27 चान्द्र भवन हैं, जिनमें प्रत्येक राशिचक्र के 13 अंश 20 कला में फैला है। ये चन्द्रमा की क्रान्तिवृत्त पर स्थिति दर्शाते हैं और वैदिक फलित ज्योतिष, मुहूर्त चयन तथा पंचांग गणना के लिए मूलभूत हैं।',
        sa: 'नक्षत्राणि वैदिकज्योतिषे सप्तविंशतिः चान्द्रभवनानि सन्ति, प्रत्येकं राशिचक्रस्य त्रयोदशांशविंशतिकलापर्यन्तं व्याप्तम्। एतानि क्रान्तिवृत्ते चन्द्रमसः स्थितिं दर्शयन्ति, वैदिकफलितज्योतिषे मुहूर्तनिर्णये पञ्चाङ्गगणनायां च मूलभूतानि सन्ति। देखो-पञ्चाङ्गं भवतः स्थानाय सूक्ष्मारम्भसमाप्तिकालसहितं वर्तमाननक्षत्रं दर्शयति।',
      },
    },
    {
      question: {
        en: 'How are Nakshatras different from Rashis (zodiac signs)?',
        hi: 'नक्षत्र और राशि में क्या अन्तर है?',
        sa: 'नक्षत्राणां राशीनां च कः भेदः?',
      },
      answer: {
        en: 'Rashis (zodiac signs) divide the ecliptic into 12 equal parts of 30 degrees each, while Nakshatras divide it into 27 parts of 13 degrees 20 minutes each. Each Rashi contains approximately 2.25 Nakshatras. Rashis are primarily used for planetary sign placement, while Nakshatras provide finer detail about the Moon\'s influence and are crucial for compatibility matching and timing.',
        hi: 'राशियाँ क्रान्तिवृत्त को 30-30 अंश के 12 भागों में विभाजित करती हैं, जबकि नक्षत्र इसे 13 अंश 20 कला के 27 भागों में बाँटते हैं। प्रत्येक राशि में लगभग 2.25 नक्षत्र आते हैं। राशियाँ ग्रह-स्थिति के लिए और नक्षत्र चन्द्रमा के सूक्ष्म प्रभाव, मिलान तथा मुहूर्त के लिए प्रयुक्त होते हैं।',
        sa: 'राशयः क्रान्तिवृत्तं त्रिंशद्-त्रिंशदंशात्मकेषु द्वादशभागेषु विभजन्ति, नक्षत्राणि तु त्रयोदशांशविंशतिकलात्मकेषु सप्तविंशतिभागेषु। प्रत्येकस्यां राशौ प्रायः सार्धद्वयनक्षत्राणि भवन्ति। राशयः ग्रहस्थाननिर्णये प्रधानतया उपयुज्यन्ते, नक्षत्राणि तु चन्द्रप्रभावस्य सूक्ष्मविवरणे गुणमेलने मुहूर्तनिर्णये च अत्यावश्यकानि।',
      },
    },
    {
      question: {
        en: 'What is the Pada system in Nakshatras?',
        hi: 'नक्षत्र में पद पद्धति क्या है?',
        sa: 'नक्षत्रेषु पदपद्धतिः का अस्ति?',
      },
      answer: {
        en: 'Each Nakshatra is divided into 4 Padas (quarters) of 3 degrees 20 minutes each. Padas map directly to the Navamsha (D-9) chart divisions and determine the starting syllables for naming a child. The 108 total Padas (27 x 4) correspond to the 108 Navamsha divisions of the zodiac, linking the lunar mansion system to divisional chart analysis.',
        hi: 'प्रत्येक नक्षत्र को 3 अंश 20 कला के 4 पदों (चरणों) में विभाजित किया जाता है। पद सीधे नवांश (D-9) कुण्डली से सम्बन्धित हैं और शिशु के नामकरण के प्रारम्भिक अक्षर निर्धारित करते हैं। कुल 108 पद (27 x 4) राशिचक्र के 108 नवांश विभागों से मेल खाते हैं।',
        sa: 'प्रत्येकं नक्षत्रं त्र्यंशविंशतिकलात्मकेषु चतुर्षु पदेषु (चरणेषु) विभक्तम्। पदानि साक्षात् नवांशचक्रविभागैः सम्बद्धानि भवन्ति, शिशुनामकरणे आद्याक्षराणि च निर्धारयन्ति। अष्टोत्तरशतं (२७ × ४) पदानि राशिचक्रस्य अष्टोत्तरशतनवांशविभागैः सङ्गच्छन्ते, चान्द्रभवनपद्धतिं वर्गकुण्डलीविश्लेषणेन सम्बध्नन्ति।',
      },
    },
  ],

  // ─── /panchang/yoga ─────────────────────────────────────────
  '/panchang/yoga': [
    {
      question: {
        en: 'What is Yoga in Panchang?',
        hi: 'पंचांग में योग क्या है?',
        sa: 'पञ्चाङ्गे योगः कः अस्ति?',
      },
      answer: {
        en: 'Yoga in Panchang (not to be confused with physical Yoga exercises) is one of the five elements of the Vedic calendar. It is calculated from the combined longitudes of the Sun and Moon  –  each 13 degree 20 minute segment of their sum defines one of 27 Yogas. Each Yoga has distinct qualities that influence the auspiciousness of the day.',
        hi: 'पंचांग में योग (शारीरिक योगाभ्यास से भिन्न) वैदिक पंचांग के पाँच अंगों में से एक है। यह सूर्य और चन्द्रमा के संयुक्त रेखांश से गणना होता है  –  उनके योग के प्रत्येक 13 अंश 20 कला खण्ड से एक योग निर्धारित होता है। प्रत्येक योग दिन की शुभता को प्रभावित करता है।',
        sa: 'पञ्चाङ्गे योगः (शारीरिकयोगाभ्यासात् भिन्नः) वैदिकपञ्चाङ्गस्य पञ्चसु अङ्गेषु अन्यतमः अस्ति। सूर्यचन्द्रयोः संयुक्तरेखांशात् गण्यते  –  तयोः योगस्य प्रत्येकं त्रयोदशांशविंशतिकलाखण्डं सप्तविंशतियोगेषु एकं निर्धारयति। प्रत्येकस्य योगस्य दिनशुभत्वं प्रभावयन्तः विशिष्टगुणाः सन्ति।',
      },
    },
    {
      question: {
        en: 'Which Yogas are considered auspicious?',
        hi: 'कौन से योग शुभ माने जाते हैं?',
        sa: 'के योगाः शुभाः मन्यन्ते?',
      },
      answer: {
        en: 'Among the 27 Yogas, Siddhi, Amrita, and Sarvarthasiddhi are considered the most auspicious. Shubha, Shukla, and Brahma are also favourable. Conversely, Vishkumbha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, and Vaidhriti are generally considered inauspicious. Dekho Panchang marks each Yoga with its auspicious or inauspicious quality.',
        hi: 'सिद्धि, अमृत और सर्वार्थसिद्धि सबसे शुभ योग माने जाते हैं। शुभ, शुक्ल और ब्रह्म भी अनुकूल हैं। इसके विपरीत विष्कुम्भ, अतिगण्ड, शूल, गण्ड, व्याघात, वज्र, व्यतीपात, परिघ और वैधृति सामान्यतः अशुभ माने जाते हैं।',
        sa: 'सप्तविंशतियोगेषु सिद्धिः, अमृतः, सर्वार्थसिद्धिश्च सर्वाधिकशुभाः मन्यन्ते। शुभः, शुक्लः, ब्रह्म च अपि अनुकूलाः। विपरीतं विष्कम्भः, अतिगण्डः, शूलः, गण्डः, व्याघातः, वज्रः, व्यतीपातः, परिघः, वैधृतिश्च सामान्यतः अशुभाः मन्यन्ते। देखो-पञ्चाङ्गं प्रत्येकं योगं तस्य शुभाशुभगुणेन अङ्कयति।',
      },
    },
    {
      question: {
        en: 'How many Yogas are there in Vedic Panchang?',
        hi: 'वैदिक पंचांग में कितने योग हैं?',
        sa: 'वैदिकपञ्चाङ्गे कति योगाः सन्ति?',
      },
      answer: {
        en: 'There are 27 Yogas in the Vedic Panchang, also called Nitya Yogas (daily Yogas). They cycle continuously and each lasts approximately one day, though the exact duration varies. The 27 Yogas begin with Vishkumbha and end with Vaidhriti. Our Panchang tool shows the current Yoga with its precise start and end times.',
        hi: 'वैदिक पंचांग में 27 योग हैं जिन्हें नित्य योग भी कहते हैं। ये निरन्तर चक्र में चलते हैं और प्रत्येक लगभग एक दिन तक रहता है। 27 योग विष्कुम्भ से आरम्भ होकर वैधृति पर समाप्त होते हैं।',
        sa: 'वैदिकपञ्चाङ्गे सप्तविंशतिः योगाः सन्ति, ये नित्ययोगाः इति अपि उच्यन्ते। ते निरन्तरं चक्रवत् परिवर्तन्ते, प्रत्येकस्य कालावधिः प्रायः एकदिनम् भवति किन्तु सूक्ष्मकालः भिद्यते। सप्तविंशतियोगाः विष्कम्भात् आरभ्य वैधृतौ समाप्यन्ते। अस्माकं पञ्चाङ्गसाधनं सूक्ष्मारम्भसमाप्तिकालसहितं वर्तमानयोगं दर्शयति।',
      },
    },
  ],

  // ─── /panchang/rashi ────────────────────────────────────────
  '/panchang/rashi': [
    {
      question: {
        en: 'What is Rashi in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में राशि क्या है?',
        sa: 'वैदिकज्योतिषे राशिः कः अस्ति?',
      },
      answer: {
        en: 'Rashi refers to the 12 zodiac signs in Vedic (sidereal) astrology: Mesha (Aries) through Meena (Pisces). Unlike Western tropical astrology, Vedic Rashis account for the precession of equinoxes using the Ayanamsha correction, placing signs approximately 24 degrees behind their Western counterparts. Your Rashi determines core personality traits and life patterns.',
        hi: 'राशि वैदिक (सायन) ज्योतिष में 12 राशिचक्र चिह्नों को कहते हैं: मेष से मीन तक। पाश्चात्य ज्योतिष के विपरीत, वैदिक राशियाँ अयनांश सुधार का उपयोग करती हैं जो विषुव अयन को ध्यान में रखता है।',
        sa: 'राशिः वैदिकनिरयणज्योतिषे द्वादशराशिचक्रचिह्नेषु अन्यतमः अस्ति  –  मेषात् आरभ्य मीनपर्यन्तम्। पाश्चात्यसायनज्योतिषात् भिन्नं वैदिकराशयः अयनांशसंशोधनेन विषुवायनं गणयन्ति, तेन राशयः पाश्चात्यराशिभ्यः प्रायः चतुर्विंशत्यंशैः पृष्ठतः स्थिताः भवन्ति। भवतः राशिः मूलव्यक्तित्वगुणान् जीवनप्रतिरूपाणि च निर्धारयति।',
      },
    },
    {
      question: {
        en: 'How is the Vedic Moon sign different from the Western Sun sign?',
        hi: 'वैदिक चन्द्र राशि और पाश्चात्य सूर्य राशि में क्या अन्तर है?',
        sa: 'वैदिकचन्द्रराशेः पाश्चात्यसूर्यराशेश्च कः भेदः?',
      },
      answer: {
        en: 'In Vedic astrology, your primary sign (Rashi) is determined by the Moon\'s sidereal position at birth, emphasizing emotions and mind. Western astrology uses the Sun\'s tropical position, focusing on ego and outer personality. Due to the ~24 degree Ayanamsha difference, most people have different Vedic and Western signs. Dekho Panchang uses the Lahiri Ayanamsha for accurate sidereal calculations.',
        hi: 'वैदिक ज्योतिष में आपकी राशि जन्म के समय चन्द्रमा की सायन स्थिति से निर्धारित होती है, जो मन और भावनाओं पर बल देती है। पाश्चात्य ज्योतिष सूर्य की स्थिति का उपयोग करता है। लगभग 24 अंश के अयनांश अन्तर के कारण अधिकांश लोगों की वैदिक और पाश्चात्य राशि भिन्न होती है।',
        sa: 'वैदिकज्योतिषे भवतः मुख्या राशिः जन्मकाले चन्द्रमसः निरयणस्थित्या निर्धार्यते, यत् मनसः भावानां च प्राधान्यं ददाति। पाश्चात्यज्योतिषं सूर्यस्य सायनस्थितिम् उपयुङ्क्ते, अहङ्कारं बाह्यव्यक्तित्वं च लक्षयति। प्रायः चतुर्विंशत्यंशस्य अयनांशभेदात् अधिकाणां जनानां वैदिकपाश्चात्यराशी भिन्ने भवतः। देखो-पञ्चाङ्गं सूक्ष्मनिरयणगणनायै लाहिर्ययनांशम् उपयुङ्क्ते।',
      },
    },
    {
      question: {
        en: 'How can I find my Rashi?',
        hi: 'मैं अपनी राशि कैसे जान सकता/सकती हूँ?',
        sa: 'अहं स्वकीयां राशिं कथं ज्ञातुं शक्नोमि?',
      },
      answer: {
        en: 'To find your Vedic Rashi (Moon sign), you need your exact birth date, time, and place. Use our free Kundali generator on Dekho Panchang  –  enter your birth details and the tool will compute your Moon\'s sidereal position to determine your Rashi along with your complete birth chart, Nakshatras, and planetary positions.',
        hi: 'अपनी वैदिक राशि (चन्द्र राशि) जानने के लिए आपको अपनी सटीक जन्म तिथि, समय और स्थान की आवश्यकता है। देखो पंचांग पर निःशुल्क कुण्डली जनरेटर का उपयोग करें  –  अपना जन्म विवरण भरें और उपकरण आपकी राशि, नक्षत्र और ग्रह स्थिति की गणना करेगा।',
        sa: 'स्वकीयां वैदिकराशिं (चन्द्रराशिम्) ज्ञातुं भवतः सूक्ष्मजन्मतिथिः, कालः, स्थानं च आवश्यकम्। देखो-पञ्चाङ्गे निःशुल्ककुण्डलीजनकम् उपयुज्यताम्  –  स्वजन्मविवरणं प्रविश्य साधनं भवतः चन्द्रमसः निरयणस्थितिं गणयित्वा राशिं सम्पूर्णजन्मकुण्डलीं नक्षत्राणि ग्रहस्थितींश्च निर्धारयिष्यति।',
      },
    },
  ],

  // ─── /matching ──────────────────────────────────────────────
  '/matching': [
    {
      question: {
        en: 'What is Ashta Kuta matching?',
        hi: 'अष्ट कूट मिलान क्या है?',
        sa: 'अष्टकूटगुणमेलनं किम् अस्ति?',
      },
      answer: {
        en: 'Ashta Kuta is the traditional Vedic method for assessing marriage compatibility by comparing the birth Nakshatras of the bride and groom across 8 categories (Kutas): Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi. The maximum score is 36 Gunas. Dekho Panchang computes all 8 Kutas with detailed breakdowns and recommendations.',
        hi: 'अष्ट कूट वैदिक विवाह मिलान की पारंपरिक पद्धति है जिसमें वर-वधू के जन्म नक्षत्रों की 8 कूटों में तुलना की जाती है: वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट और नाडी। अधिकतम 36 गुण होते हैं। देखो पंचांग सभी 8 कूटों की विस्तृत गणना प्रस्तुत करता है।',
        sa: 'अष्टकूटं विवाहसाम्यपरीक्षायै पारम्परिकी वैदिकी पद्धतिः अस्ति यत्र वरवध्वोः जन्मनक्षत्राणाम् अष्टसु कूटेषु तुलना क्रियते  –  वर्णः, वश्यम्, तारा, योनिः, ग्रहमैत्री, गणः, भकूटः, नाडी च। अधिकतमाङ्काः षट्त्रिंशत् गुणाः भवन्ति। देखो-पञ्चाङ्गं सर्वेषाम् अष्टकूटानां विस्तृतविश्लेषणं प्रस्तौति।',
      },
    },
    {
      question: {
        en: 'What is the minimum Guna score required for marriage?',
        hi: 'विवाह के लिए न्यूनतम कितने गुण आवश्यक हैं?',
        sa: 'विवाहाय न्यूनतमं कति गुणाः आवश्यकाः?',
      },
      answer: {
        en: 'Traditionally, a minimum of 18 out of 36 Gunas is considered acceptable for marriage. Scores above 24 are considered good, and above 30 are excellent. However, individual Kuta scores matter too  –  a high total with a Nadi Dosha (0 in Nadi Kuta) may still raise concerns. Our matching tool highlights specific Dosha warnings alongside the total score.',
        hi: 'परम्परागत रूप से 36 में से न्यूनतम 18 गुण विवाह के लिए स्वीकार्य माने जाते हैं। 24 से अधिक गुण अच्छे और 30 से अधिक उत्तम माने जाते हैं। किन्तु व्यक्तिगत कूट भी महत्वपूर्ण हैं  –  नाडी दोष होने पर कुल गुण अधिक होने पर भी चिन्ता हो सकती है।',
        sa: 'परम्परया षट्त्रिंशतः गुणेषु न्यूनतमम् अष्टादश गुणाः विवाहाय स्वीकार्याः मन्यन्ते। चतुर्विंशत्यधिकाः उत्तमाः, त्रिंशदधिकाः श्रेष्ठाः च। किन्तु प्रत्येककूटाङ्काः अपि महत्त्वपूर्णाः  –  नाडीदोषे (नाडीकूटे शून्याङ्के) सति समग्रगुणाः अधिकाः चेदपि चिन्ता भवितुम् अर्हति। अस्माकं मेलनसाधनं समग्राङ्कैः सह विशिष्टदोषचेतावनीः दर्शयति।',
      },
    },
    {
      question: {
        en: 'What is Mangal Dosha and does it affect matching?',
        hi: 'मंगल दोष क्या है और क्या यह मिलान को प्रभावित करता है?',
        sa: 'मङ्गलदोषः कः अस्ति, किं च गुणमेलनं प्रभावयति?',
      },
      answer: {
        en: 'Mangal Dosha (Kuja Dosha) occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus in the birth chart. It is traditionally believed to cause difficulties in marriage. When both partners are Manglik, the Dosha is considered cancelled. Our matching tool checks for Mangal Dosha in both charts and notes any cancellation conditions.',
        hi: 'मंगल दोष (कुज दोष) तब होता है जब मंगल ग्रह जन्म कुण्डली में लग्न, चन्द्र या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में स्थित हो। परम्परा के अनुसार यह वैवाहिक कठिनाइयों का कारण माना जाता है। जब दोनों वर-वधू मांगलिक हों तो दोष निरस्त माना जाता है।',
        sa: 'मङ्गलदोषः (कुजदोषः) तदा भवति यदा कुजग्रहः जन्मकुण्डल्यां लग्नात् चन्द्रात् शुक्रात् वा प्रथमे, द्वितीये, चतुर्थे, सप्तमे, अष्टमे, द्वादशे वा भावे स्थितः भवति। परम्परया एषः वैवाहिककष्टानां हेतुः इति मन्यते। यदा वरवधू उभावपि माङ्गलिकौ भवतः तदा दोषः निरस्तः इति गण्यते। अस्माकं मेलनसाधनम् उभयोः कुण्डल्योः मङ्गलदोषं परीक्ष्य निरसनस्थितीः च दर्शयति।',
      },
    },
  ],

  // ─── /horoscope ─────────────────────────────────────────────
  '/horoscope': [
    {
      question: {
        en: 'How is the daily horoscope calculated on Dekho Panchang?',
        hi: 'देखो पंचांग पर दैनिक राशिफल की गणना कैसे होती है?',
        sa: 'देखो-पञ्चाङ्गे दैनिकराशिफलं कथं गण्यते?',
      },
      answer: {
        en: 'Our daily horoscope is derived from real-time planetary transits computed using Vedic sidereal astronomy. We analyze the current positions of the Sun, Moon, and major planets relative to each Moon sign (Rashi) to provide predictions grounded in actual celestial movements rather than generic templates.',
        hi: 'हमारा दैनिक राशिफल वैदिक सायन खगोल विज्ञान द्वारा गणना किए गए वास्तविक ग्रह गोचर पर आधारित है। हम प्रत्येक चन्द्र राशि के सापेक्ष सूर्य, चन्द्र और प्रमुख ग्रहों की वर्तमान स्थिति का विश्लेषण करते हैं।',
        sa: 'अस्माकं दैनिकराशिफलं वैदिकनिरयणखगोलविज्ञानेन गणितेभ्यः वास्तविकग्रहगोचरेभ्यः निष्पद्यते। वयं प्रत्येकां चन्द्रराशिम् अपेक्ष्य सूर्यचन्द्रप्रमुखग्रहाणां वर्तमानस्थितिं विश्लेष्य वास्तविकखगोलगतिषु आधारितानि फलानि प्रस्तुमः, न तु सामान्यप्रतिरूपानि।',
      },
    },
    {
      question: {
        en: 'Should I use my Sun sign or Moon sign for Vedic horoscope?',
        hi: 'वैदिक राशिफल के लिए सूर्य राशि या चन्द्र राशि का उपयोग करें?',
        sa: 'वैदिकराशिफलाय सूर्यराशिः उत चन्द्रराशिः उपयोक्तव्या?',
      },
      answer: {
        en: 'In Vedic astrology, the Moon sign (Chandra Rashi) is the primary reference for daily horoscopes, as the Moon governs the mind, emotions, and daily experiences. Western horoscopes typically use the Sun sign. If you know your Vedic Moon sign, use that for the most relevant predictions on Dekho Panchang.',
        hi: 'वैदिक ज्योतिष में दैनिक राशिफल के लिए चन्द्र राशि प्रमुख संदर्भ है क्योंकि चन्द्रमा मन, भावनाओं और दैनिक अनुभवों का शासक है। पाश्चात्य राशिफल सामान्यतः सूर्य राशि का उपयोग करता है। सबसे सटीक फल के लिए अपनी वैदिक चन्द्र राशि का उपयोग करें।',
        sa: 'वैदिकज्योतिषे दैनिकराशिफलाय चन्द्रराशिः (चन्द्रराशिः) प्रमुखः सन्दर्भः अस्ति, यतः चन्द्रमाः मनसः भावानां दैनिकानुभवानां च शासकः अस्ति। पाश्चात्यराशिफलं सामान्यतः सूर्यराशिम् उपयुङ्क्ते। यदि भवान् स्वकीयां वैदिकचन्द्रराशिं जानाति, तर्हि देखो-पञ्चाङ्गे सर्वाधिकसङ्गतफलाय ताम् उपयुज्यताम्।',
      },
    },
    {
      question: {
        en: 'How often is the horoscope updated?',
        hi: 'राशिफल कितनी बार अपडेट होता है?',
        sa: 'राशिफलं कियत्वारं नवीक्रियते?',
      },
      answer: {
        en: 'The daily horoscope on Dekho Panchang is updated every day based on the actual planetary transit positions for that date. Since planetary positions change continuously, each day brings fresh astrological influences that are reflected in the updated predictions for all 12 Rashis.',
        hi: 'देखो पंचांग पर दैनिक राशिफल प्रतिदिन उस तिथि के वास्तविक ग्रह गोचर के आधार पर अपडेट होता है। चूँकि ग्रहों की स्थिति निरन्तर बदलती रहती है, प्रतिदिन सभी 12 राशियों के लिए नवीन भविष्यफल प्रस्तुत किये जाते हैं।',
        sa: 'देखो-पञ्चाङ्गे दैनिकराशिफलं प्रतिदिनं तद्दिनस्य वास्तविकग्रहगोचरस्थितिम् अनुसृत्य नवीक्रियते। यतः ग्रहस्थितयः निरन्तरं परिवर्तन्ते, प्रतिदिनं सर्वासां द्वादशराशीनां कृते नवीनज्योतिषप्रभावाः नवीकृतफलेषु प्रतिबिम्बिताः भवन्ति।',
      },
    },
  ],

  // ─── /kundali ───────────────────────────────────────────────
  '/kundali': [
    {
      question: {
        en: 'What is a Kundali (birth chart)?',
        hi: 'कुण्डली (जन्म पत्रिका) क्या है?',
        sa: 'कुण्डली (जन्मपत्रिका) का अस्ति?',
      },
      answer: {
        en: 'A Kundali (also called Janam Kundli or birth chart) is a map of the sky at the exact moment and location of your birth, showing the positions of the Sun, Moon, and planets across the 12 houses and zodiac signs. It forms the foundation of Vedic astrology predictions including Dashas, Yogas, and life event timing. Dekho Panchang generates your complete Kundali for free.',
        hi: 'कुण्डली (जन्म कुण्डली या जन्म पत्रिका) आपके जन्म के सटीक समय और स्थान पर आकाश का मानचित्र है, जो 12 भावों और राशियों में सूर्य, चन्द्र और ग्रहों की स्थिति दर्शाती है। यह दशा, योग और जीवन की घटनाओं के समय की भविष्यवाणी का आधार है।',
        sa: 'कुण्डली (जन्मकुण्डली वा जन्मपत्रिका) भवतः जन्मस्य सूक्ष्मकाले स्थाने च आकाशस्य मानचित्रम् अस्ति, यत् द्वादशभावेषु राशिषु च सूर्यचन्द्रग्रहाणां स्थितिं दर्शयति। एषा दशाफलानां योगानां जीवनघटनाकालनिर्णयस्य च वैदिकज्योतिषभविष्यवाण्याः आधारशिला अस्ति। देखो-पञ्चाङ्गं भवतः सम्पूर्णां कुण्डलीं निःशुल्कं रचयति।',
      },
    },
    {
      question: {
        en: 'What is the difference between North Indian and South Indian chart styles?',
        hi: 'उत्तर भारतीय और दक्षिण भारतीय कुण्डली शैली में क्या अन्तर है?',
        sa: 'उत्तरभारतीयदक्षिणभारतीयकुण्डलीशैल्योः कः भेदः?',
      },
      answer: {
        en: 'The North Indian chart uses a diamond-shaped layout where the houses remain fixed and signs rotate based on the Ascendant. The South Indian chart uses a rectangular grid where the signs remain fixed and houses rotate. Both contain identical astronomical data  –  the choice is regional preference. Dekho Panchang supports both styles with a toggle switch.',
        hi: 'उत्तर भारतीय कुण्डली हीरे के आकार की होती है जिसमें भाव स्थिर रहते हैं और राशियाँ लग्न के अनुसार बदलती हैं। दक्षिण भारतीय कुण्डली आयताकार होती है जिसमें राशियाँ स्थिर रहती हैं। दोनों में खगोलीय जानकारी एक समान होती है  –  चयन क्षेत्रीय प्राथमिकता है।',
        sa: 'उत्तरभारतीया कुण्डली हीरकाकृतिविन्यासं उपयुज्य भावान् स्थिरान् रक्षति राशयश्च लग्नानुसारं परिवर्तन्ते। दक्षिणभारतीया कुण्डली आयताकारजालिकां उपयुज्य राशीन् स्थिरान् रक्षति भावाश्च परिवर्तन्ते। उभयोः खगोलीयदत्तांशाः समानाः एव  –  चयनं क्षेत्रीयरुचिम् अनुसरति। देखो-पञ्चाङ्गम् उभयशैल्योः परिवर्तनसुविधया सह समर्थयति।',
      },
    },
    {
      question: {
        en: 'Why does exact birth time matter for Kundali?',
        hi: 'कुण्डली के लिए सटीक जन्म समय क्यों महत्वपूर्ण है?',
        sa: 'कुण्डल्यै सूक्ष्मजन्मकालः कथं महत्त्वपूर्णः?',
      },
      answer: {
        en: 'The Ascendant (Lagna) changes approximately every 2 hours, and the Moon changes Nakshatra roughly every day. Even a few minutes\' difference can shift the Lagna, alter house placements, and change the Vimshottari Dasha sequence entirely. Accurate birth time is essential for reliable predictions  –  our tool allows time input down to the minute for precision.',
        hi: 'लग्न लगभग प्रत्येक 2 घण्टे में बदलता है और चन्द्रमा प्रतिदिन नक्षत्र बदलता है। कुछ मिनटों का अन्तर भी लग्न बदल सकता है, भाव-स्थिति और विंशोत्तरी दशा क्रम पूर्णतः परिवर्तित हो सकता है। विश्वसनीय भविष्यवाणी के लिए सटीक जन्म समय अत्यावश्यक है।',
        sa: 'लग्नं प्रायः प्रतिद्विघण्टं परिवर्तते, चन्द्रमाश्च प्रायः प्रतिदिनं नक्षत्रं परिवर्तयति। कतिपयनिमेषाणाम् अन्तरम् अपि लग्नं परिवर्तयितुम्, भावस्थितिं विकल्पयितुम्, विंशोत्तरीदशाक्रमं सम्पूर्णतया परिवर्तयितुं च शक्नोति। विश्वसनीयफलकथनाय सूक्ष्मजन्मकालः अत्यावश्यकः  –  अस्माकं साधनं निमेषपर्यन्तं सूक्ष्मकालप्रविष्टिम् अनुमन्यते।',
      },
    },
  ],

  // ─── /muhurta-ai ────────────────────────────────────────────
  '/muhurta-ai': [
    {
      question: {
        en: 'What is Muhurta in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में मुहूर्त क्या है?',
        sa: 'वैदिकज्योतिषे मुहूर्तः कः अस्ति?',
      },
      answer: {
        en: 'Muhurta is the Vedic science of selecting an auspicious date and time for important activities such as marriage, housewarming, travel, or starting a business. It considers multiple factors including Tithi, Nakshatra, Yoga, planetary positions, and the individual\'s birth chart to find the most favourable window for success.',
        hi: 'मुहूर्त विवाह, गृह प्रवेश, यात्रा या व्यापार आरम्भ जैसे महत्वपूर्ण कार्यों के लिए शुभ तिथि और समय चुनने का वैदिक विज्ञान है। यह तिथि, नक्षत्र, योग, ग्रह स्थिति और व्यक्ति की जन्म कुण्डली सहित अनेक कारकों पर विचार करता है।',
        sa: 'मुहूर्तः विवाहगृहप्रवेशयात्राव्यापारारम्भादिषु महत्कार्येषु शुभतिथिकालचयनस्य वैदिकं शास्त्रम् अस्ति। तिथिः, नक्षत्रम्, योगः, ग्रहस्थितयः, व्यक्तेः जन्मकुण्डली चेति अनेककारकान् विचार्य सिद्ध्यै सर्वाधिकानुकूलं कालखण्डं निर्धारयति।',
      },
    },
    {
      question: {
        en: 'How does the AI Muhurta finder work?',
        hi: 'AI मुहूर्त खोजक कैसे काम करता है?',
        sa: 'कृत्रिमप्रज्ञामुहूर्तान्वेषकः कथं कार्यं करोति?',
      },
      answer: {
        en: 'Our Muhurta engine is a classical constraint-based system with 36 rules from 7 texts (Muhurta Chintamani, Dharma Sindhu, BPHS, Brihat Samhita, Prashna Marga, B.V. Raman, Kalaprakashika). Unlike scoring-only systems, it rejects on fatal flaws first: Ganda/Vyatipata/Vaidhriti yogas are absolute vetoes for samskaras, Dagdha Tithi and Nakshatra Gandanta block windows outright. Only after passing these hard filters does scoring apply. The 5-tier cancellation hierarchy ensures strong lagna can cancel minor defects (weak karana, dur muhurtam) but CANNOT override inauspicious yoga or dagdha tithi  –  matching classical practice where one fatal dosha invalidates an otherwise good muhurta. Each activity has classically verified nakshatra whitelists (not permissive "everything not forbidden" lists). With birth data, the engine adds Tara Bala (3-cycle degradation), Chandra Bala (with Ashtama Chandra penalty), and Dasha Harmony.',
        hi: 'हमारा मुहूर्त इंजन 7 शास्त्रीय ग्रन्थों से 36 नियमों वाली बाधा-आधारित प्रणाली है। स्कोरिंग-केवल प्रणालियों के विपरीत, यह पहले घातक दोषों पर वर्ज्य करता है: गण्ड/व्यतीपात/वैधृति योग संस्कारों के लिए पूर्ण निषेध, दग्ध तिथि और नक्षत्र गण्डान्त खिड़कियों को सीधे अवरुद्ध करते हैं। इन कठोर फिल्टर को पार करने के बाद ही स्कोरिंग लागू होती है। बलवान लग्न लघु दोषों का निवारण कर सकता है किन्तु अशुभ योग या दग्ध तिथि का निवारण नहीं  –  शास्त्रीय प्रथा के अनुसार। प्रत्येक कार्य की शास्त्रीय रूप से सत्यापित नक्षत्र श्वेतसूची है।',
        sa: 'अस्माकं मुहूर्तयन्त्रं षट्त्रिंशत्नियमैः बाधाधारितं शास्त्रीयं यन्त्रम्। घातकदोषाः प्रथमं वर्ज्याः, ततः अङ्कनम्।',
      },
    },
    {
      question: {
        en: 'Which activities are supported by the Muhurta AI tool?',
        hi: 'मुहूर्त AI उपकरण में कौन-कौन से कार्य समर्थित हैं?',
        sa: 'मुहूर्तकृत्रिमप्रज्ञासाधने कानि कार्याणि समर्थितानि?',
      },
      answer: {
        en: 'Dekho Panchang\'s Muhurta AI supports 20 activities including marriage, housewarming (Griha Pravesh), travel, vehicle purchase, business launch, property purchase, naming ceremony, education start, medical procedures, job joining, gold purchase, loan signing, court hearings, and more. Each activity has specific Vedic rules that the AI applies automatically.',
        hi: 'देखो पंचांग का मुहूर्त AI विवाह, गृह प्रवेश, यात्रा, वाहन खरीद, व्यापार आरम्भ, भूमि खरीद, नामकरण, शिक्षा आरम्भ, चिकित्सा, स्वर्ण खरीद सहित 20 कार्यों का समर्थन करता है। प्रत्येक कार्य के लिए विशिष्ट वैदिक नियम स्वचालित रूप से लागू होते हैं।',
        sa: 'देखो-पञ्चाङ्गस्य मुहूर्तकृत्रिमप्रज्ञा विंशतिकार्याणि समर्थयति  –  विवाहः, गृहप्रवेशः, यात्रा, वाहनक्रयः, व्यापारारम्भः, भूमिक्रयः, नामकरणम्, विद्यारम्भः, चिकित्सा, सेवाप्रवेशः, स्वर्णक्रयः, ऋणपत्रम्, न्यायालयश्रवणम् इत्यादीनि। प्रत्येकस्य कार्यस्य विशिष्टवैदिकनियमाः कृत्रिमप्रज्ञया स्वयमेव अनुप्रयुज्यन्ते।',
      },
    },
    {
      question: {
        en: 'Which ayanamsha does the Muhurta AI use for scoring?',
        hi: 'मुहूर्त AI स्कोरिंग के लिए कौन सा अयनांश उपयोग करता है?',
        sa: 'मुहूर्तकृत्रिमप्रज्ञा अङ्कनाय कम् अयनांशम् उपयुनक्ति?',
      },
      answer: {
        en: 'The Muhurta AI always uses Lahiri (Chitrapaksha) ayanamsha for scoring, regardless of your kundali ayanamsha preference. This is because all classical muhurta rule tables  –  from Muhurta Chintamani, Dharma Sindhu, and Prashna Marga  –  were composed using Lahiri nakshatra boundaries. Applying those rules with a different ayanamsha (KP, Raman) would shift the boundaries and produce less accurate results. Your birth chart and panchang pages still use your chosen ayanamsha for display.',
        hi: 'मुहूर्त AI स्कोरिंग के लिए सदैव लाहिरी (चित्रपक्ष) अयनांश का उपयोग करता है, चाहे आपकी कुण्डली में कोई भी अयनांश चुना हो। ऐसा इसलिए क्योंकि सभी शास्त्रीय मुहूर्त नियम सारणियाँ  –  मुहूर्त चिन्तामणि, धर्म सिन्धु और प्रश्न मार्ग  –  लाहिरी नक्षत्र सीमाओं पर आधारित हैं। भिन्न अयनांश लगाने से नक्षत्र सीमाएँ खिसक जाती हैं और परिणाम कम सटीक होते हैं।',
        sa: 'मुहूर्तकृत्रिमप्रज्ञा अङ्कनाय सर्वदा लाहिरी (चित्रपक्ष) अयनांशम् उपयुनक्ति, भवतः कुण्डलीअयनांशवरणं यत्किमपि स्यात्। मुहूर्तचिन्तामणि-धर्मसिन्धु-प्रश्नमार्गादिषु सर्वेषु शास्त्रीयमुहूर्तनियमसारणीषु लाहिरीनक्षत्रसीमाः प्रयुक्ताः। भिन्नेन अयनांशेन तासां सीमानां विस्थापनं न्यूनसटीकफलानि च भवेयुः।',
      },
    },
    {
      question: {
        en: 'How does the AI Muhurta engine differ from other panchang sites?',
        hi: 'AI मुहूर्त इंजन अन्य पंचांग साइटों से कैसे अलग है?',
        sa: 'कृत्रिमप्रज्ञामुहूर्तयन्त्रं अन्येभ्यः पञ्चाङ्गस्थलेभ्यः कथं भिन्नम्?',
      },
      answer: {
        en: 'Most panchang sites use binary pass/fail on Panchanga Shuddhi  –  a date either passes or fails. Dekho Panchang\'s 36-rule engine scores windows 0-100 with classical cancellation logic from Muhurta Chintamani Ch.7: a strong lagna genuinely cancels a weak karana, not just offsets it numerically. We also personalise scores using your birth chart (Tara Bala, Chandra Bala, Dasha Harmony) and explain each recommendation with chapter-level citations  –  like a classically trained Jyotishi.',
        hi: 'अधिकांश पंचांग साइटें पंचांग शुद्धि पर हाँ/ना (pass/fail) प्रणाली उपयोग करती हैं। देखो पंचांग का 36-नियम इंजन मुहूर्त चिन्तामणि अध्याय 7 के शास्त्रीय निवारण तर्क के साथ 0-100 अंकन करता है: बलवान लग्न दुर्बल करण का वास्तविक निवारण करता है। साथ ही, आपकी जन्म कुण्डली से ताराबल, चन्द्रबल और दशा सामंजस्य से व्यक्तिगत अंकन करता है  –  प्रत्येक सिफारिश शास्त्रीय उद्धरणों के साथ।',
        sa: 'अधिकांशपञ्चाङ्गस्थलानि पञ्चाङ्गशुद्ध्या द्वयात्मकप्रणालिम् उपयुञ्जते। देखोपञ्चाङ्गस्य ३६-नियमयन्त्रम् शास्त्रीयनिवारणतर्कैः ० तः १०० पर्यन्तम् अङ्कयति।',
      },
    },
    {
      question: {
        en: 'Is the Muhurta AI free to use?',
        hi: 'क्या मुहूर्त AI मुफ्त है?',
        sa: 'किं मुहूर्तकृत्रिमप्रज्ञा निःशुल्का अस्ति?',
      },
      answer: {
        en: 'Yes, completely free. The Muhurta AI scanner, all 20 activities, personalised scoring, and classical reasoning chains are available without any paywall or signup. We believe Jyotish Shastra should be accessible to everyone.',
        hi: 'हाँ, पूर्णतः मुफ्त। मुहूर्त AI स्कैनर, सभी 20 गतिविधियाँ, व्यक्तिगत अंकन, और शास्त्रीय तर्क श्रृंखलाएँ बिना किसी भुगतान या साइनअप के उपलब्ध हैं। हमारा मानना है कि ज्योतिष शास्त्र सभी के लिए सुलभ होना चाहिए।',
        sa: 'आम्, सर्वथा निःशुल्कम्। ज्योतिषशास्त्रं सर्वेभ्यः सुलभं स्यात् इति अस्माकं विश्वासः।',
      },
    },
  ],

  // ─── /rahu-kaal ─────────────────────────────────────────────
  '/rahu-kaal': [
    {
      question: {
        en: 'What is Rahu Kaal?',
        hi: 'राहु काल क्या है?',
        sa: 'राहुकालः कः अस्ति?',
      },
      answer: {
        en: 'Rahu Kaal (Rahu Kalam) is an inauspicious period of approximately 1.5 hours that occurs every day, ruled by the shadow planet Rahu. It is calculated by dividing the daytime (sunrise to sunset) into 8 equal parts, with a specific segment assigned to Rahu based on the day of the week. Important new undertakings are traditionally avoided during this period.',
        hi: 'राहु काल प्रतिदिन लगभग 1.5 घण्टे की अशुभ अवधि है जो छाया ग्रह राहु द्वारा शासित होती है। इसकी गणना दिन के समय (सूर्योदय से सूर्यास्त) को 8 बराबर भागों में विभाजित करके की जाती है। इस अवधि में नए महत्वपूर्ण कार्य आरम्भ करना परम्परागत रूप से वर्जित है।',
        sa: 'राहुकालः प्रतिदिनं प्रायः सार्धघण्टायाः अशुभावधिः अस्ति यः छायाग्रहराहुना शासितः भवति। दिवसकालस्य (सूर्योदयात् सूर्यास्तपर्यन्तम्) अष्टसमभागेषु विभक्तस्य वारानुसारं विशिष्टभागः राहवे निर्दिष्टः भवति। अस्मिन् काले नवमहत्कार्याणाम् आरम्भः परम्परया वर्ज्यते।',
      },
    },
    {
      question: {
        en: 'Does Rahu Kaal timing change by city?',
        hi: 'क्या राहु काल का समय शहर के अनुसार बदलता है?',
        sa: 'किं राहुकालस्य समयः नगरानुसारं भिद्यते?',
      },
      answer: {
        en: 'Yes, Rahu Kaal timing varies by city because it depends on local sunrise and sunset times. Cities at different latitudes and longitudes have different day lengths, which shifts all 8 segments including Rahu Kaal. Dekho Panchang calculates Rahu Kaal precisely for your location using your geographic coordinates.',
        hi: 'हाँ, राहु काल का समय शहर के अनुसार बदलता है क्योंकि यह स्थानीय सूर्योदय और सूर्यास्त पर निर्भर करता है। भिन्न अक्षांश-देशान्तर वाले शहरों में दिन की अवधि भिन्न होती है, जिससे राहु काल सहित सभी 8 भाग बदल जाते हैं।',
        sa: 'आम्, राहुकालस्य समयः नगरानुसारं भिद्यते यतः स्थानीयसूर्योदयसूर्यास्तकालयोः आश्रितः भवति। भिन्नाक्षांशदेशान्तरेषु स्थितेषु नगरेषु दिवसावधिः भिन्ना भवति, येन राहुकालसहिताः सर्वे अष्टभागाः परिवर्तन्ते। देखो-पञ्चाङ्गं भवतः भौगोलिकाङ्कान् उपयुज्य राहुकालं सूक्ष्मतया गणयति।',
      },
    },
    {
      question: {
        en: 'What is the difference between Rahu Kaal and Rahu Kalam?',
        hi: 'राहु काल और राहु कालम् में क्या अन्तर है?',
        sa: 'राहुकालस्य राहुकालमस्य च कः भेदः?',
      },
      answer: {
        en: 'Rahu Kaal and Rahu Kalam refer to the same inauspicious time period  –  there is no astrological difference. "Rahu Kaal" is the Hindi/North Indian term while "Rahu Kalam" is the Tamil/South Indian term. Both represent the daily 1.5-hour window ruled by Rahu that is computed identically regardless of the name used.',
        hi: 'राहु काल और राहु कालम् एक ही अशुभ अवधि के दो नाम हैं  –  ज्योतिषीय दृष्टि से कोई अन्तर नहीं है। "राहु काल" हिन्दी/उत्तर भारतीय और "राहु कालम्" तमिल/दक्षिण भारतीय शब्द है। दोनों राहु द्वारा शासित दैनिक 1.5 घण्टे की अवधि को दर्शाते हैं।',
        sa: 'राहुकालः राहुकालमश्च एकाम् एव अशुभावधिं निर्दिशतः  –  ज्योतिषशास्त्रीयः कोऽपि भेदः नास्ति। "राहुकालः" हिन्दी-उत्तरभारतीयं पदं, "राहुकालम्" तु तमिल-दक्षिणभारतीयं पदम्। उभयम् अपि राहुशासितां दैनिकसार्धघण्टावधिं दर्शयति या नामपरिवर्तनम् अनपेक्ष्य समानतया गण्यते।',
      },
    },
    {
      question: {
        en: 'How long is Rahu Kaal each day?',
        hi: 'राहु काल प्रतिदिन कितना लम्बा होता है?',
        sa: 'प्रतिदिनं राहुकालः कियत्कालावधिः भवति?',
      },
      answer: {
        en: 'Rahu Kaal lasts approximately 1.5 hours (90 minutes) each day. The exact duration varies slightly because it depends on day length  –  daytime (sunrise to sunset) is divided into 8 equal parts, and one part is Rahu Kaal. In summer when days are longer, Rahu Kaal is slightly longer; in winter, slightly shorter.',
        hi: 'राहु काल प्रतिदिन लगभग 1.5 घण्टे (90 मिनट) का होता है। सटीक अवधि थोड़ी भिन्न होती है क्योंकि यह दिन की लम्बाई पर निर्भर करती है। गर्मियों में जब दिन लम्बे होते हैं तो राहु काल कुछ लम्बा होता है; सर्दियों में कुछ छोटा।',
        sa: 'राहुकालः प्रतिदिनं प्रायः सार्धघण्टां (90 निमेषान्) यावत् भवति। दिवसावधेः आश्रितत्वात् सूक्ष्मावधिः किञ्चित् भिद्यते।',
      },
    },
    {
      question: {
        en: 'Can I travel during Rahu Kaal?',
        hi: 'क्या राहु काल में यात्रा कर सकते हैं?',
        sa: 'किं राहुकाले यात्रां कर्तुं शक्नोति?',
      },
      answer: {
        en: 'Vedic tradition advises against starting a new journey during Rahu Kaal, as it is considered inauspicious for new beginnings. However, continuing a journey already in progress is fine. Routine travel (daily commute, errands) is generally not affected. The restriction applies mainly to first-time or important journeys  –  house moves, business trips, pilgrimages.',
        hi: 'वैदिक परम्परा के अनुसार राहु काल में नई यात्रा आरम्भ नहीं करनी चाहिए। लेकिन पहले से चल रही यात्रा जारी रखने में कोई दोष नहीं है। दैनिक आवागमन प्रभावित नहीं होता। प्रतिबन्ध मुख्यतः नई या महत्वपूर्ण यात्राओं पर लागू है।',
        sa: 'वैदिकपरम्परानुसारं राहुकाले नवयात्राम् आरभेत न इति उपदिश्यते। किन्तु पूर्वमारब्धा यात्रा अनुवर्तयितुं शक्या। दैनिकयातायातं न प्रभाव्यते।',
      },
    },
    {
      question: {
        en: 'What is the Rahu Kaal slot for each day of the week?',
        hi: 'सप्ताह के प्रत्येक दिन राहु काल कौनसी स्लॉट में आता है?',
        sa: 'सप्ताहस्य प्रतिदिनं राहुकालः कस्मिन् भागे भवति?',
      },
      answer: {
        en: 'The Rahu Kaal slot rotates by weekday: Sunday = 8th slot (4:30-6 PM approx.), Monday = 2nd slot (7:30-9 AM), Tuesday = 7th slot (3-4:30 PM), Wednesday = 5th slot (12-1:30 PM), Thursday = 6th slot (1:30-3 PM), Friday = 4th slot (10:30 AM-12 PM), Saturday = 3rd slot (9-10:30 AM). Actual times depend on your city\'s sunrise and sunset.',
        hi: 'राहु काल की स्लॉट वार के अनुसार बदलती है: रविवार = 8वीं स्लॉट (शाम ~4:30-6), सोमवार = 2री (~7:30-9 सुबह), मंगलवार = 7वीं (~3-4:30), बुधवार = 5वीं (~12-1:30), गुरुवार = 6ठी (~1:30-3), शुक्रवार = 4थी (~10:30-12), शनिवार = 3री (~9-10:30)।',
        sa: 'राहुकालस्य भागः वारानुसारं भ्रमति: रविवारः = अष्टमभागः, सोमवारः = द्वितीयभागः, मङ्गलवारः = सप्तमभागः, बुधवारः = पञ्चमभागः, गुरुवारः = षष्ठभागः, शुक्रवारः = चतुर्थभागः, शनिवारः = तृतीयभागः।',
      },
    },
    {
      question: {
        en: 'What should you avoid during Rahu Kaal?',
        hi: 'राहु काल में किन कार्यों से बचना चाहिए?',
        sa: 'राहुकाले कानि कार्याणि वर्जनीयानि?',
      },
      answer: {
        en: 'During Rahu Kaal, avoid starting new ventures: signing contracts, launching businesses, beginning journeys, entering a new home, buying vehicles or property, conducting naming ceremonies, and scheduling important meetings. Routine activities, prayers, and ongoing work are not affected. Emergency situations override any timing restrictions.',
        hi: 'राहु काल में नए कार्य आरम्भ करने से बचें: अनुबन्ध पर हस्ताक्षर, व्यापार आरम्भ, यात्रा, नया घर प्रवेश, वाहन या सम्पत्ति खरीद, नामकरण संस्कार, महत्वपूर्ण बैठकें। दैनिक कार्य, पूजा और चल रहा काम प्रभावित नहीं होता। आपातकालीन स्थितियाँ समय प्रतिबन्ध से ऊपर हैं।',
        sa: 'राहुकाले नवकार्याणाम् आरम्भात् विरमेत: सन्धिपत्रहस्ताक्षरणम्, व्यापारारम्भः, यात्रारम्भः, नवगृहप्रवेशः, वाहनसम्पत्तिक्रयः, नामकरणसंस्कारः। दैनिककार्याणि पूजा प्रवृत्तकार्यं च न प्रभाव्यन्ते।',
      },
    },
  ],

  // ─── /dates/ekadashi ─────────────────────────────────────────
  '/dates/ekadashi': [
    {
      question: {
        en: 'How many Ekadashis are there in a year?',
        hi: 'एक वर्ष में कितनी एकादशियाँ होती हैं?',
        sa: 'एकस्मिन् वर्षे कत्यः एकादश्यः भवन्ति?',
      },
      answer: {
        en: 'There are typically 24 Ekadashis in a year  –  two per lunar month, one in Shukla Paksha (waxing moon) and one in Krishna Paksha (waning moon). In a leap year (Adhika Masa), two extra Ekadashis are added, totalling 26. Each Ekadashi has a unique name and spiritual significance described in the Puranas.',
        hi: 'एक वर्ष में सामान्यतः 24 एकादशियाँ होती हैं  –  प्रत्येक चान्द्र मास में दो, एक शुक्ल पक्ष में और एक कृष्ण पक्ष में। अधिक मास वाले वर्ष में दो अतिरिक्त एकादशियाँ जुड़ जाती हैं।',
        sa: 'एकस्मिन् वर्षे सामान्यतः चतुर्विंशतिः एकादश्यः भवन्ति  –  प्रतिचान्द्रमासं द्वे, एका शुक्लपक्षे अपरा कृष्णपक्षे। अधिकमासयुक्ते वर्षे द्वे अतिरिक्ते एकादश्यौ योज्येते, तेन षड्विंशतिः भवन्ति। प्रत्येकस्याः एकादश्याः विशिष्टं नाम पुराणोक्तं आध्यात्मिकमहत्त्वं च अस्ति।',
      },
    },
    {
      question: {
        en: 'What is Ekadashi fasting (Ekadashi Vrat)?',
        hi: 'एकादशी व्रत क्या है?',
        sa: 'एकादशीव्रतं किम् अस्ति?',
      },
      answer: {
        en: 'Ekadashi Vrat involves fasting on the 11th Tithi of each lunar fortnight. Devotees abstain from grains and beans, consuming only fruits, milk, and root vegetables. The fast is broken on Dwadashi (12th Tithi) during the Parana window  –  the auspicious time calculated from the end of Ekadashi Tithi. Nirjala Ekadashi (Jyeshtha Shukla) is the strictest, observed without water.',
        hi: 'एकादशी व्रत में प्रत्येक पक्ष की 11वीं तिथि को उपवास रखा जाता है। भक्त अन्न और दालों से परहेज करते हैं। व्रत द्वादशी (12वीं तिथि) को पारण काल में तोड़ा जाता है। निर्जला एकादशी सबसे कठोर व्रत है।',
        sa: 'एकादशीव्रते प्रत्येकस्य पक्षार्धस्य एकादश्यां तिथौ उपवासः आचर्यते। भक्ताः अन्नशिम्बीभ्यो विरमन्ति, फलानि दुग्धं कन्दमूलानि च एव सेवन्ते। व्रतं द्वादश्यां (द्वादशतिथौ) पारणकाले भिद्यते  –  एकादशीतिथेः समाप्त्यनन्तरं गणितः शुभकालः। निर्जलैकादशी (ज्येष्ठशुक्ला) सर्वाधिककठोरा, जलं विना आचर्यते।',
      },
    },
  ],

  // ─── /dates/purnima ─────────────────────────────────────────
  '/dates/purnima': [
    {
      question: {
        en: 'How many Purnimas are there in a year?',
        hi: 'एक वर्ष में कितनी पूर्णिमा होती हैं?',
        sa: 'एकस्मिन् वर्षे कत्यः पूर्णिमाः भवन्ति?',
      },
      answer: {
        en: 'There are 12 Purnimas (full moons) in a regular year, one per lunar month. In a year with an Adhika Masa (intercalary month), there are 13 Purnimas. Each Purnima is named after its lunar month  –  for example, Kartik Purnima, Vaishakh Purnima, etc.',
        hi: 'सामान्य वर्ष में 12 पूर्णिमा होती हैं, प्रत्येक चान्द्र मास में एक। अधिक मास वाले वर्ष में 13 पूर्णिमा होती हैं। प्रत्येक पूर्णिमा अपने चान्द्र मास के नाम से जानी जाती है।',
        sa: 'सामान्यवर्षे द्वादश पूर्णिमाः (पूर्णचन्द्राः) भवन्ति, प्रतिचान्द्रमासम् एका। अधिकमासयुक्ते वर्षे त्रयोदश पूर्णिमाः भवन्ति। प्रत्येका पूर्णिमा स्वकीयचान्द्रमासस्य नाम्ना ज्ञायते  –  यथा कार्तिकपूर्णिमा, वैशाखपूर्णिमा इत्यादि।',
      },
    },
    {
      question: {
        en: 'Which Purnima is most important?',
        hi: 'कौन सी पूर्णिमा सबसे महत्वपूर्ण है?',
        sa: 'का पूर्णिमा सर्वाधिकमहत्त्वपूर्णा अस्ति?',
      },
      answer: {
        en: 'Several Purnimas hold special significance: Guru Purnima (Ashadha) honours spiritual teachers, Sharad Purnima (Ashwin) is celebrated for the brightest full moon, Kartik Purnima is sacred for holy dips and lighting lamps, and Buddha Purnima (Vaishakh) marks the birth of Gautama Buddha. Holi is celebrated on Phalguna Purnima.',
        hi: 'गुरु पूर्णिमा (आषाढ़) गुरुओं को समर्पित है, शरद पूर्णिमा (आश्विन) सबसे उज्ज्वल पूर्ण चन्द्रमा के लिए प्रसिद्ध है, कार्तिक पूर्णिमा पवित्र स्नान और दीपदान के लिए है, और बुद्ध पूर्णिमा (वैशाख) गौतम बुद्ध के जन्म का प्रतीक है।',
        sa: 'अनेकाः पूर्णिमाः विशिष्टमहत्त्वं धारयन्ति  –  गुरुपूर्णिमा (आषाढे) आध्यात्मिकगुरूणां सम्मानार्थम्, शरत्पूर्णिमा (आश्विने) सर्वाधिकदीप्तपूर्णचन्द्रार्थं प्रसिद्धा, कार्तिकपूर्णिमा पवित्रस्नानदीपदानाय पुण्या, बुद्धपूर्णिमा (वैशाखे) च गौतमबुद्धस्य जन्मसूचिका। होलिकोत्सवः फाल्गुनपूर्णिमायाम् आचर्यते।',
      },
    },
  ],

  // ─── /dates/amavasya ────────────────────────────────────────
  '/dates/amavasya': [
    {
      question: {
        en: 'Is Amavasya auspicious or inauspicious?',
        hi: 'क्या अमावस्या शुभ है या अशुभ?',
        sa: 'अमावास्या शुभा वा अशुभा वा?',
      },
      answer: {
        en: 'Amavasya is generally considered inauspicious for starting new ventures, marriages, and housewarming ceremonies. However, it is highly auspicious for Pitru Tarpan (ancestor offerings), Shani Puja, Kali worship, and Tantric practices. Somvati Amavasya (falling on Monday) and Mauni Amavasya (in Magha) are especially sacred for holy bathing and charity.',
        hi: 'अमावस्या नए कार्यों, विवाह और गृह प्रवेश के लिए अशुभ मानी जाती है। परन्तु पितृ तर्पण, शनि पूजा, काली पूजा और तान्त्रिक साधना के लिए अत्यन्त शुभ है। सोमवती अमावस्या और मौनी अमावस्या विशेष पवित्र हैं।',
        sa: 'अमावास्या नवकार्यारम्भाय विवाहाय गृहप्रवेशाय च सामान्यतः अशुभा मन्यते। किन्तु पितृतर्पणाय, शनिपूजायै, कालीपूजायै, तान्त्रिकसाधनायै च अत्यन्तं शुभा भवति। सोमवत्यमावास्या (सोमवारे पतिता) मौन्यमावास्या (माघमासे) च पवित्रस्नानदानाय विशेषतः पुण्ये स्तः।',
      },
    },
  ],

  // ─── /dates/pradosham ───────────────────────────────────────
  '/dates/pradosham': [
    {
      question: {
        en: 'What is the difference between Shani Pradosham and Soma Pradosham?',
        hi: 'शनि प्रदोष और सोम प्रदोष में क्या अन्तर है?',
        sa: 'शनिप्रदोषसोमप्रदोषयोः कः भेदः?',
      },
      answer: {
        en: 'When Pradosham (Trayodashi Tithi) falls on a Saturday, it is called Shani Pradosham  –  considered especially powerful for removing karmic debts and Saturn-related afflictions. When it falls on Monday, it is Soma Pradosham  –  ideal for devotion to Lord Shiva, as Monday is already Shiva\'s day. Both are observed during the twilight period (1.5 hours before and after sunset).',
        hi: 'जब प्रदोष (त्रयोदशी तिथि) शनिवार को पड़ता है तो शनि प्रदोष कहलाता है  –  कर्मऋण और शनि दोष निवारण के लिए विशेष शक्तिशाली। सोमवार को सोम प्रदोष होता है  –  शिव भक्ति के लिए सर्वोत्तम। दोनों सन्ध्याकाल में मनाए जाते हैं।',
        sa: 'यदा प्रदोषः (त्रयोदशी तिथिः) शनिवासरे पतति तदा शनिप्रदोषः इति उच्यते  –  कर्मऋणनिवारणाय शनिजन्यपीडापशमनाय च विशेषशक्तिमान् मन्यते। सोमवासरे पतति चेत् सोमप्रदोषः भवति  –  शिवभक्त्यै सर्वोत्तमः, यतः सोमवासरः शिवस्य दिनम् एव। उभौ सन्ध्याकाले (सूर्यास्तात् सार्धघण्टापूर्वम् अनन्तरं च) आचर्येते।',
      },
    },
  ],

  // ─── /dates/chaturthi ──────────────────────────────────────
  '/dates/chaturthi': [
    {
      question: {
        en: 'What is the difference between Sankashti and Vinayaka Chaturthi?',
        hi: 'संकष्टी और विनायक चतुर्थी में क्या अन्तर है?',
        sa: 'सङ्कष्टीविनायकचतुर्थ्योः कः भेदः?',
      },
      answer: {
        en: 'Sankashti Chaturthi falls on Krishna Paksha Chaturthi (4th day of the waning moon) and involves fasting until moonrise, followed by Ganesh Puja and moon sighting. Vinayaka Chaturthi falls on Shukla Paksha Chaturthi (4th day of the waxing moon) and is considered ideal for beginning new works. When Sankashti falls on Tuesday, it is called Angaraki Chaturthi  –  the most auspicious of all monthly Chaturthis.',
        hi: 'संकष्टी चतुर्थी कृष्ण पक्ष चतुर्थी को पड़ती है  –  चन्द्रोदय तक उपवास और गणेश पूजा की जाती है। विनायक चतुर्थी शुक्ल पक्ष चतुर्थी को होती है  –  नए कार्य आरम्भ के लिए शुभ। मंगलवार को पड़ने वाली संकष्टी अंगारकी चतुर्थी कहलाती है  –  सबसे शुभ।',
        sa: 'सङ्कष्टीचतुर्थी कृष्णपक्षचतुर्थ्यां (क्षीयमाणचन्द्रस्य चतुर्थदिने) पतति, चन्द्रोदयपर्यन्तम् उपवासः गणेशपूजा चन्द्रदर्शनं च आचर्यते। विनायकचतुर्थी शुक्लपक्षचतुर्थ्यां (वर्धमानचन्द्रस्य चतुर्थदिने) पतति, नवकार्यारम्भाय आदर्शा मन्यते। यदा सङ्कष्टी मङ्गलवासरे पतति तदा अङ्गारकीचतुर्थी इत्युच्यते  –  सर्वासां मासिकचतुर्थीनां सर्वाधिकशुभा।',
      },
    },
  ],

  // ─── /choghadiya ────────────────────────────────────────────
  '/choghadiya': [
    {
      question: {
        en: 'What is Choghadiya?',
        hi: 'चौघड़िया क्या है?',
        sa: 'चौघड़िया किम् अस्ति?',
      },
      answer: {
        en: 'Choghadiya (also spelled Chaughadia) is a Vedic time-division system that splits each day and night into 8 periods of approximately 1.5 hours each. Each period is ruled by a specific planet and classified as Shubh (auspicious), Labh (profitable), Amrit (excellent), Char (average), Rog (inauspicious), Kaal (bad), or Udyog (suitable for work). It is widely used in Gujarat and Western India for timing daily activities.',
        hi: 'चौघड़िया वैदिक समय-विभाजन पद्धति है जो प्रत्येक दिन और रात को लगभग 1.5 घण्टे की 8 अवधियों में बाँटती है। प्रत्येक अवधि एक विशेष ग्रह द्वारा शासित होती है और शुभ, लाभ, अमृत, चर, रोग, काल या उद्योग के रूप में वर्गीकृत है। यह गुजरात और पश्चिम भारत में व्यापक रूप से प्रयुक्त होती है।',
        sa: 'चौघड़िया वैदिककालविभाजनपद्धतिः अस्ति या प्रत्येकं दिवसं रात्रिं च प्रायः सार्धघण्टात्मकासु अष्टसु अवधिषु विभजति। प्रत्येकावधिः विशिष्टग्रहेण शासिता शुभा, लाभा, अमृता, चरा, रोगा, काला, उद्योगा वा इति वर्गीक्रियते। गुजरातदेशे पश्चिमभारते च दैनिककार्यकालनिर्णयाय व्यापकतया उपयुज्यते।',
      },
    },
    {
      question: {
        en: 'Which Choghadiya is best for travel?',
        hi: 'यात्रा के लिए कौन सा चौघड़िया सबसे अच्छा है?',
        sa: 'यात्रायै का चौघड़िया सर्वोत्तमा?',
      },
      answer: {
        en: 'For travel, the "Labh" (profitable, ruled by Mercury) and "Amrit" (excellent, ruled by Moon) Choghadiyas are considered the best. "Shubh" (auspicious, ruled by Jupiter) is also favourable. Avoid starting journeys during "Rog" (ruled by Mars) and "Kaal" (ruled by Saturn) periods. Our Choghadiya tool highlights the best travel windows for your location.',
        hi: 'यात्रा के लिए "लाभ" (बुध शासित) और "अमृत" (चन्द्र शासित) चौघड़िया सर्वोत्तम माने जाते हैं। "शुभ" (गुरु शासित) भी अनुकूल है। "रोग" (मंगल शासित) और "काल" (शनि शासित) अवधि में यात्रा आरम्भ से बचें।',
        sa: 'यात्रायै "लाभ" (बुधशासिता, लाभकरा) "अमृत" (चन्द्रशासिता, श्रेष्ठा) च चौघड़ियाः सर्वोत्तमाः मन्यन्ते। "शुभा" (गुरुशासिता) अपि अनुकूला। "रोग" (कुजशासिता) "काल" (शनिशासिता) च अवधिषु यात्रारम्भः वर्जनीयः। अस्माकं चौघड़ियासाधनं भवतः स्थानाय सर्वोत्तमयात्राकालखण्डानि सूचयति।',
      },
    },
    {
      question: {
        en: 'How many Choghadiya periods are there in a day?',
        hi: 'एक दिन में कितने चौघड़िया होते हैं?',
        sa: 'एकस्मिन् दिने कत्यः चौघड़ियाः भवन्ति?',
      },
      answer: {
        en: 'There are 16 Choghadiya periods in a full day  –  8 during daytime (sunrise to sunset) and 8 during nighttime (sunset to next sunrise). The duration of each period is not a fixed 1.5 hours; it varies by season because daytime and nighttime lengths change throughout the year. Dekho Panchang calculates exact Choghadiya times based on your location\'s actual sunrise and sunset.',
        hi: 'पूरे दिन में 16 चौघड़िया होते हैं  –  दिन में 8 (सूर्योदय से सूर्यास्त) और रात में 8 (सूर्यास्त से अगले सूर्योदय तक)। प्रत्येक अवधि निश्चित 1.5 घण्टे की नहीं होती; यह ऋतु के अनुसार बदलती है क्योंकि दिन-रात की अवधि वर्ष भर बदलती रहती है।',
        sa: 'सम्पूर्णदिने षोडश चौघड़ियाः भवन्ति  –  दिवसे अष्ट (सूर्योदयात् सूर्यास्तपर्यन्तम्) रात्रौ च अष्ट (सूर्यास्तात् अग्रिमसूर्योदयपर्यन्तम्)। प्रत्येकावधेः कालः निश्चितसार्धघण्टात्मकः न भवति; ऋत्वनुसारं भिद्यते यतः दिवारात्र्योः अवधिः सम्पूर्णवर्षं यावत् परिवर्तते। देखो-पञ्चाङ्गं भवतः स्थानस्य वास्तविकसूर्योदयसूर्यास्तम् अनुसृत्य सूक्ष्मचौघड़ियाकालान् गणयति।',
      },
    },
  ],
  // ─── /mangal-dosha ──────────────────────────────────────────
  '/mangal-dosha': [
    {
      question: {
        en: 'What is Mangal Dosha and who is a Manglik?',
        hi: 'मंगल दोष क्या है और मांगलिक कौन है?',
        sa: 'मङ्गलदोषः कः अस्ति माङ्गलिकः च कः?',
      },
      answer: {
        en: 'Mangal Dosha (also called Kuja Dosha or Chevvai Dosham) occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus in a birth chart. A person with this placement is called a "Manglik." It is traditionally believed to affect married life by causing conflicts, delays in marriage, or incompatibility with a non-Manglik partner.',
        hi: 'मंगल दोष (कुज दोष) तब होता है जब मंगल ग्रह जन्म कुण्डली में लग्न, चन्द्र या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में हो। ऐसे व्यक्ति को "मांगलिक" कहते हैं। परम्परा के अनुसार यह वैवाहिक जीवन में कठिनाइयाँ ला सकता है।',
        sa: 'मङ्गलदोषः (कुजदोषः) तदा भवति यदा कुजः लग्नात् चन्द्रात् शुक्रात् वा प्रथमे, द्वितीये, चतुर्थे, सप्तमे, अष्टमे, द्वादशे वा भावे स्थितः। एतादृशः जनः "माङ्गलिकः" इत्युच्यते।',
      },
    },
    {
      question: {
        en: 'When is Mangal Dosha cancelled?',
        hi: 'मंगल दोष कब निरस्त होता है?',
        sa: 'मङ्गलदोषः कदा निरस्तः भवति?',
      },
      answer: {
        en: 'Mangal Dosha is considered cancelled (or significantly reduced) in several conditions: Mars in its own sign (Aries/Scorpio) or exalted (Capricorn), Mars aspected by or conjunct benefic Jupiter, both partners being Manglik, Mars in certain Nakshatras (like Mrigashira, Chitra, Dhanishta), and after age 28 when Mars\'s intensity naturally diminishes in some traditions.',
        hi: 'मंगल दोष कई स्थितियों में निरस्त माना जाता है: मंगल अपनी राशि (मेष/वृश्चिक) या उच्च (मकर) में, गुरु की दृष्टि या युति, दोनों वर-वधू मांगलिक, विशेष नक्षत्रों में मंगल, और कुछ परम्पराओं में 28 वर्ष के बाद।',
        sa: 'मङ्गलदोषः अनेकासु स्थितिषु निरस्तः मन्यते  –  कुजः स्वराशौ (मेषे/वृश्चिके) वा उच्चराशौ (मकरे), गुरोः दृष्ट्या युत्या वा, उभौ वरवधू माङ्गलिकौ, विशेषनक्षत्रेषु कुजः।',
      },
    },
    {
      question: {
        en: 'Can a Manglik marry a non-Manglik?',
        hi: 'क्या मांगलिक गैर-मांगलिक से विवाह कर सकता है?',
        sa: 'किं माङ्गलिकः अमाङ्गलिकेन सह विवाहं कर्तुं शक्नोति?',
      },
      answer: {
        en: 'While tradition recommends matching two Mangliks, a Manglik can marry a non-Manglik if cancellation conditions exist in the chart. Many modern Jyotishis consider the overall chart strength, Saturn\'s position, and the 7th house condition rather than Mars alone. Remedial measures like Kumbh Vivah (symbolic marriage to a pot or tree) are also performed before such marriages.',
        hi: 'यद्यपि परम्परा दो मांगलिकों के विवाह की सलाह देती है, निवारण शर्तें होने पर मांगलिक गैर-मांगलिक से विवाह कर सकता है। कई आधुनिक ज्योतिषी समग्र कुण्डली बल देखते हैं। कुम्भ विवाह जैसे उपचार भी किये जाते हैं।',
        sa: 'निवारणस्थितयः सन्ति चेत् माङ्गलिकः अमाङ्गलिकेन सह विवाहं कर्तुं शक्नोति। कुम्भविवाहादयः उपचाराः अपि क्रियन्ते।',
      },
    },
  ],

  // ─── /kaal-sarp ────────────────────────────────────────────
  '/kaal-sarp': [
    {
      question: {
        en: 'What is Kaal Sarp Dosha?',
        hi: 'काल सर्प दोष क्या है?',
        sa: 'कालसर्पदोषः कः अस्ति?',
      },
      answer: {
        en: 'Kaal Sarp Dosha occurs when all seven planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are hemmed between Rahu and Ketu  –  that is, all planets fall on one side of the Rahu-Ketu axis. This is considered a significant karmic combination that can cause delays, obstacles, and sudden upheavals in life. However, its effects vary greatly depending on which houses Rahu and Ketu occupy.',
        hi: 'काल सर्प दोष तब होता है जब सभी सात ग्रह (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) राहु और केतु के बीच एक ओर हों। यह एक महत्वपूर्ण कर्म संयोजन है जो विलम्ब, बाधाएं और अचानक उथल-पुथल ला सकता है।',
        sa: 'कालसर्पदोषः तदा भवति यदा सर्वे सप्तग्रहाः राहुकेत्वोः एकत्र स्थिताः भवन्ति। एषः महत्त्वपूर्णः कार्मिकसंयोगः अस्ति।',
      },
    },
    {
      question: {
        en: 'How many types of Kaal Sarp Dosha are there?',
        hi: 'काल सर्प दोष के कितने प्रकार हैं?',
        sa: 'कालसर्पदोषस्य कति प्रकाराः सन्ति?',
      },
      answer: {
        en: 'There are 12 types of Kaal Sarp Dosha, named based on which houses Rahu and Ketu occupy: Anant (1-7), Kulik (2-8), Vasuki (3-9), Shankhpal (4-10), Padma (5-11), Mahapadma (6-12), Takshak (7-1), Karkotak (8-2), Shankhachud (9-3), Ghatak (10-4), Vishdhar (11-5), and Sheshnaag (12-6). Each type affects different life areas based on the houses involved.',
        hi: '12 प्रकार हैं: अनन्त (1-7), कुलिक (2-8), वासुकि (3-9), शंखपाल (4-10), पद्म (5-11), महापद्म (6-12), तक्षक (7-1), कर्कोटक (8-2), शंखचूड (9-3), घातक (10-4), विषधर (11-5), शेषनाग (12-6)।',
        sa: 'द्वादशप्रकाराः सन्ति  –  अनन्तः, कुलिकः, वासुकिः, शंखपालः, पद्मः, महापद्मः, तक्षकः, कर्कोटकः, शंखचूडः, घातकः, विषधरः, शेषनागश्च।',
      },
    },
    {
      question: {
        en: 'What are the remedies for Kaal Sarp Dosha?',
        hi: 'काल सर्प दोष के उपाय क्या हैं?',
        sa: 'कालसर्पदोषस्य उपायाः के सन्ति?',
      },
      answer: {
        en: 'Traditional remedies include: performing Kaal Sarp Dosha Nivaran Puja at Trimbakeshwar (Nashik) or Mahakaleshwar (Ujjain), chanting Rahu-Ketu mantras, wearing Gomed (Hessonite) for Rahu or Cat\'s Eye for Ketu after consulting a Jyotishi, offering milk and rice to snakes or ant hills on Nag Panchami, and performing Sarpa Suktam recitation. Regular worship of Lord Shiva and Nag Devta is also recommended.',
        hi: 'पारम्परिक उपाय: त्र्यम्बकेश्वर या महाकालेश्वर में काल सर्प दोष निवारण पूजा, राहु-केतु मन्त्र जप, गोमेद या लहसुनिया धारण (ज्योतिषी परामर्श से), नाग पंचमी पर दूध-चावल अर्पण, सर्प सूक्तम् पाठ, और शिव तथा नाग देवता की नियमित पूजा।',
        sa: 'पारम्परिकोपायाः  –  त्र्यम्बकेश्वरे महाकालेश्वरे वा कालसर्पदोषनिवारणपूजा, राहुकेतुमन्त्रजपः, गोमेदवैदूर्यधारणम्, नागपञ्चम्यां दुग्धतण्डुलार्पणम्, सर्पसूक्तपठनम्, शिवनागदेवतापूजा च।',
      },
    },
  ],

  // ─── /pitra-dosha ──────────────────────────────────────────
  '/pitra-dosha': [
    {
      question: {
        en: 'What is Pitra Dosha in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में पितृ दोष क्या है?',
        sa: 'वैदिकज्योतिषे पितृदोषः कः अस्ति?',
      },
      answer: {
        en: 'Pitra Dosha indicates unresolved ancestral karma in the birth chart. The primary indicator is Sun conjunct or aspected by Rahu, especially in the 9th house (house of father and dharma). Other indicators include: afflicted 9th house lord, malefics in the 9th house, and Sun-Saturn conjunction. It is believed to cause obstacles in career, progeny issues, and recurring family problems across generations.',
        hi: 'पितृ दोष जन्म कुण्डली में अनसुलझे पैतृक कर्म को दर्शाता है। प्रमुख संकेतक सूर्य पर राहु की युति या दृष्टि है, विशेषकर 9वें भाव (पिता और धर्म का भाव) में। अन्य संकेतक: पीड़ित 9वें भावेश, 9वें भाव में पापग्रह, और सूर्य-शनि युति।',
        sa: 'पितृदोषः जन्मकुण्डल्यां अनिराकृतं पैतृककर्म सूचयति। प्रमुखसङ्केतकः सूर्यस्य राहुणा युतिः दृष्टिः वा, विशेषतः नवमभावे (पितृधर्मभावे)।',
      },
    },
    {
      question: {
        en: 'How is Pitra Dosha different from Mangal Dosha?',
        hi: 'पितृ दोष और मंगल दोष में क्या अन्तर है?',
        sa: 'पितृदोषमङ्गलदोषयोः कः भेदः?',
      },
      answer: {
        en: 'Mangal Dosha is caused by Mars\'s placement and primarily affects marriage and relationships. Pitra Dosha is caused by Sun-Rahu affliction and relates to ancestral karma  –  it affects broader life patterns including career blocks, progeny issues, and generational family problems. Mangal Dosha is a single-planet placement check; Pitra Dosha involves multiple factors including the 9th house, Sun, Rahu, and sometimes Saturn.',
        hi: 'मंगल दोष मंगल की स्थिति से होता है और मुख्यतः विवाह प्रभावित करता है। पितृ दोष सूर्य-राहु पीड़ा से होता है और पैतृक कर्म से सम्बन्धित है  –  कैरियर अवरोध, सन्तान समस्या और पारिवारिक कठिनाइयाँ प्रभावित करता है।',
        sa: 'मङ्गलदोषः कुजस्थित्या भवति विवाहं च प्रभावयति। पितृदोषः सूर्यराहुपीडया भवति पैतृककर्मणा सम्बद्धश्च  –  वृत्तिम् अपत्यं पारिवारिकजीवनं च प्रभावयति।',
      },
    },
    {
      question: {
        en: 'What are the remedies for Pitra Dosha?',
        hi: 'पितृ दोष के उपाय क्या हैं?',
        sa: 'पितृदोषस्य उपायाः के सन्ति?',
      },
      answer: {
        en: 'Key remedies include: performing Shraddha (ancestral offerings) during Pitru Paksha (16-day period in Ashwin/Bhadrapada month), Pind Daan at sacred sites like Gaya or Varanasi, Tripindi Shraddha for forgotten ancestors, Narayan Nagbali Puja at Trimbakeshwar, regular Tarpan on Amavasya, and feeding Brahmins and crows (considered messengers of ancestors). Chanting Surya and Rahu mantras also helps.',
        hi: 'प्रमुख उपाय: पितृ पक्ष में श्राद्ध, गया या काशी में पिण्ड दान, त्रिपिण्डी श्राद्ध, त्र्यम्बकेश्वर में नारायण नागबलि पूजा, अमावस्या पर तर्पण, ब्राह्मणों और कौओं को भोजन। सूर्य और राहु मन्त्र जप भी लाभदायक है।',
        sa: 'प्रमुखोपायाः  –  पितृपक्षे श्राद्धम्, गयायां काश्यां वा पिण्डदानम्, त्रिपिण्डीश्राद्धम्, त्र्यम्बकेश्वरे नारायणनागबलिपूजा, अमावास्यायां तर्पणम्, ब्राह्मणकाकभोजनं च। सूर्यराहुमन्त्रजपः अपि लाभकरः।',
      },
    },
  ],

  // ─── /sade-sati ──────────────────────────────────────────────
  '/sade-sati': [
    {
      question: {
        en: 'How long does Sade Sati last?',
        hi: 'साढ़े साती कितने समय तक रहती है?',
        sa: 'साढेसातिः कियत्कालं तिष्ठति?',
      },
      answer: {
        en: 'Sade Sati lasts approximately 7.5 years. It occurs when Saturn transits through three consecutive signs  –  the sign before your Moon sign (~2.5 years), your Moon sign itself (~2.5 years), and the sign after (~2.5 years). The exact duration varies slightly because Saturn\'s orbital speed is not constant and it retrogrades periodically.',
        hi: 'साढ़े साती लगभग 7.5 वर्ष तक रहती है। यह तब होती है जब शनि तीन क्रमिक राशियों से गुजरता है  –  आपकी चन्द्र राशि से पहली (~2.5 वर्ष), स्वयं चन्द्र राशि (~2.5 वर्ष) और उसके बाद की (~2.5 वर्ष)। सटीक अवधि शनि की गति और वक्री होने के कारण थोड़ी भिन्न हो सकती है।',
        sa: 'साढेसातिः प्रायः सार्धसप्तवर्षाणि तिष्ठति। शनिः त्रिषु क्रमिकराशिषु गच्छति चेत् भवति  –  चन्द्रराशेः पूर्वराशौ (~२.५ वर्षाणि), स्वयं चन्द्रराशौ (~२.५ वर्षाणि), तदनन्तरराशौ च (~२.५ वर्षाणि)।',
      },
    },
    {
      question: {
        en: 'What are the three phases of Sade Sati?',
        hi: 'साढ़े साती के तीन चरण कौन से हैं?',
        sa: 'साढेसात्याः त्रयः चरणाः के सन्ति?',
      },
      answer: {
        en: 'The three phases are: Rising Phase (Saturn in 12th from Moon)  –  financial pressures, hidden anxieties, and sleep disturbances. Peak Phase (Saturn over Moon sign)  –  the most intense period with mental pressure, relationship tests, and career challenges, but also deep personal growth. Setting Phase (Saturn in 2nd from Moon)  –  financial strain eases but family and speech-related matters may surface.',
        hi: 'तीन चरण हैं: आरम्भ चरण (चन्द्र से 12वाँ)  –  आर्थिक दबाव, छिपी चिन्ताएँ। चरम चरण (चन्द्र राशि पर)  –  सबसे तीव्र काल, मानसिक दबाव और कैरियर चुनौतियाँ, किन्तु गहन विकास भी। अवसान चरण (चन्द्र से 2रा)  –  आर्थिक दबाव कम, पारिवारिक विषय।',
        sa: 'त्रयः चरणाः सन्ति  –  उत्थानचरणः (चन्द्रात् द्वादशे शनिः), चरमचरणः (चन्द्रराशौ शनिः), अवसानचरणः (चन्द्रात् द्वितीये शनिः) च।',
      },
    },
    {
      question: {
        en: 'Is Sade Sati always bad?',
        hi: 'क्या साढ़े साती हमेशा बुरी होती है?',
        sa: 'किं साढेसातिः सदा अशुभा भवति?',
      },
      answer: {
        en: 'No, Sade Sati is not always negative. Its effects depend on Saturn\'s natal position, the Moon\'s strength in your chart, and your current Vimshottari Dasha. For some people, Sade Sati brings career breakthroughs, spiritual awakening, or necessary life corrections. Many highly successful people achieved their greatest milestones during this period.',
        hi: 'नहीं, साढ़े साती सदैव बुरी नहीं होती। प्रभाव शनि की जन्म स्थिति, चन्द्रमा की शक्ति और वर्तमान दशा पर निर्भर करते हैं। कई सफल लोगों ने साढ़े साती में अपनी सबसे बड़ी उपलब्धियाँ प्राप्त कीं।',
        sa: 'न, साढेसातिः सदा अशुभा न भवति। प्रभावाः शनेः जन्मस्थित्या चन्द्रमसः बलेन वर्तमानदशया च निर्धार्यन्ते।',
      },
    },
    {
      question: {
        en: 'What are the best remedies during Sade Sati?',
        hi: 'साढ़े साती में सबसे अच्छे उपाय कौन से हैं?',
        sa: 'साढेसातौ श्रेष्ठाः उपायाः के सन्ति?',
      },
      answer: {
        en: 'Traditional remedies include: reciting Hanuman Chalisa daily (especially on Saturdays), donating black items like sesame seeds, iron, and mustard oil on Saturdays, lighting a mustard oil lamp under a Peepal tree every Saturday evening, and chanting the Shani mantra "Om Sham Shanaishcharaya Namah" 108 times daily. Serving the elderly and disabled is also highly recommended.',
        hi: 'पारम्परिक उपाय: प्रतिदिन हनुमान चालीसा (विशेषकर शनिवार), शनिवार को काली वस्तुएं (तिल, लोहा, सरसों का तेल) दान, शनिवार संध्या पीपल वृक्ष नीचे सरसों का दीपक, और "ॐ शं शनैश्चराय नमः" 108 बार जप। बुजुर्गों और विकलांगों की सेवा भी अत्यन्त लाभदायक है।',
        sa: 'पारम्परिकोपायाः  –  प्रतिदिनं हनुमत्चालीसापठनम्, शनिवासरे कृष्णवस्तूनां दानम्, पीपलवृक्षे सार्षपतैलदीपकम्, "ॐ शं शनैश्चराय नमः" इति अष्टोत्तरशतवारं जपश्च।',
      },
    },
    {
      question: {
        en: 'When does Sade Sati start for my Moon sign?',
        hi: 'मेरी चन्द्र राशि के लिए साढ़े साती कब शुरू होगी?',
        sa: 'मम चन्द्रराशये साढेसातिः कदा आरभते?',
      },
      answer: {
        en: 'Sade Sati begins when Saturn enters the sign just before (12th from) your Moon sign. Since Saturn takes about 2.5 years per sign and completes its orbit in ~29.5 years, Sade Sati occurs roughly every 30 years  –  meaning it happens 2-3 times in an average lifetime. Use our Sade Sati calculator to check exact dates based on your Moon sign or full birth chart.',
        hi: 'साढ़े साती तब शुरू होती है जब शनि आपकी चन्द्र राशि से ठीक पहले (12वीं) राशि में प्रवेश करता है। शनि ~29.5 वर्ष में एक चक्र पूरा करता है, अतः साढ़े साती लगभग 30 वर्ष में एक बार आती है  –  जीवनकाल में 2-3 बार। सटीक तिथियों के लिए हमारा गणक उपयोग करें।',
        sa: 'साढेसातिः तदा आरभते यदा शनिः चन्द्रराशेः पूर्वराशौ (द्वादशे) प्रविशति। शनिः ~२९.५ वर्षेषु एकं चक्रं पूरयति, अतः साढेसातिः प्रायः त्रिंशद्वर्षेषु एकवारम् आगच्छति।',
      },
    },
  ],

  // ─── /muhurat ──────────────────────────────────────────────
  '/muhurat': [
    {
      question: {
        en: 'What is a Muhurat and why is it important?',
        hi: 'मुहूर्त क्या है और यह क्यों महत्वपूर्ण है?',
        sa: 'मुहूर्तः कः अस्ति कथं च महत्त्वपूर्णः?',
      },
      answer: {
        en: 'Muhurat (auspicious timing) is the Vedic science of selecting the most favourable date and time for important activities. It considers multiple factors  –  Tithi, Nakshatra, Yoga, planetary positions, Rahu Kaal, and Choghadiya  –  to maximize the chances of a positive outcome. Starting important activities at the right Muhurat is believed to align your actions with cosmic energies.',
        hi: 'मुहूर्त महत्वपूर्ण कार्यों के लिए सबसे अनुकूल तिथि और समय चुनने का वैदिक विज्ञान है। यह तिथि, नक्षत्र, योग, ग्रह स्थिति, राहु काल और चौघड़िया जैसे अनेक कारकों पर विचार करता है।',
        sa: 'मुहूर्तः महत्कार्येषु सर्वाधिकानुकूलतिथिकालचयनस्य वैदिकं शास्त्रम् अस्ति।',
      },
    },
    {
      question: {
        en: 'How do I find a good Muhurat for marriage?',
        hi: 'विवाह के लिए अच्छा मुहूर्त कैसे खोजें?',
        sa: 'विवाहाय शुभमुहूर्तं कथम् अन्वेषणीयम्?',
      },
      answer: {
        en: 'For marriage Muhurat, Vedic astrology requires: an auspicious Tithi (Dwitiya, Tritiya, Panchami, Saptami, Ekadashi, Trayodashi are preferred), a favourable Nakshatra (Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Uttarashadha, Uttara Bhadrapada, Revati), avoidance of Rahu Kaal and Varjyam, and compatibility between the Muhurat chart and both partners\' birth charts.',
        hi: 'विवाह मुहूर्त में शुभ तिथि (द्वितीया, तृतीया, पंचमी, सप्तमी आदि), अनुकूल नक्षत्र (रोहिणी, मघा, हस्त, स्वाति, अनुराधा आदि), राहु काल और वर्ज्यम् से बचाव, तथा वर-वधू की कुण्डली से अनुकूलता आवश्यक है।',
        sa: 'विवाहमुहूर्ते शुभतिथिः, अनुकूलनक्षत्रम्, राहुकालवर्ज्यमपरिहारः, वरवध्वोः कुण्डल्या अनुकूलता च आवश्यकम्।',
      },
    },
    {
      question: {
        en: 'What are the most common activities that need a Muhurat?',
        hi: 'किन कार्यों के लिए मुहूर्त सबसे अधिक आवश्यक होता है?',
        sa: 'केषां कार्याणां कृते मुहूर्तः सर्वाधिकम् आवश्यकः?',
      },
      answer: {
        en: 'The most common activities requiring Muhurat selection include: marriage (Vivah), housewarming (Griha Pravesh), starting a new business (Vyapar Arambh), vehicle purchase, property purchase, naming ceremony (Namkaran), starting education (Vidya Arambh), medical procedures, gold purchase, and travel. Each activity has specific Vedic rules for what constitutes an auspicious time.',
        hi: 'मुहूर्त की सबसे अधिक आवश्यकता वाले कार्य: विवाह, गृह प्रवेश, व्यापार आरम्भ, वाहन खरीद, भूमि खरीद, नामकरण, विद्यारम्भ, चिकित्सा, स्वर्ण खरीद और यात्रा। प्रत्येक कार्य के लिए विशिष्ट वैदिक नियम हैं।',
        sa: 'मुहूर्तस्य सर्वाधिकावश्यकतायुक्तानि कार्याणि  –  विवाहः, गृहप्रवेशः, व्यापारारम्भः, वाहनक्रयः, भूमिक्रयः, नामकरणम्, विद्यारम्भः, चिकित्सा, स्वर्णक्रयः, यात्रा च।',
      },
    },
    {
      question: {
        en: 'Can Muhurat override a bad horoscope?',
        hi: 'क्या मुहूर्त खराब कुण्डली को दूर कर सकता है?',
        sa: 'किं मुहूर्तः अशुभकुण्डलीं निवारयितुं शक्नोति?',
      },
      answer: {
        en: 'Muhurat cannot completely override the indications in a birth chart, but it can significantly improve the chances of success for a specific undertaking. Think of it as choosing the best possible starting conditions  –  like a seed planted in fertile soil at the right season. Classical texts say that a good Muhurat can enhance favourable Dasha results and mitigate challenging planetary periods.',
        hi: 'मुहूर्त जन्म कुण्डली के संकेतों को पूरी तरह नहीं बदल सकता, किन्तु किसी विशेष कार्य की सफलता की सम्भावना काफी बढ़ा सकता है। शास्त्रीय ग्रन्थ कहते हैं कि शुभ मुहूर्त अनुकूल दशा फल को बढ़ाता है और चुनौतीपूर्ण ग्रह अवधि को कम करता है।',
        sa: 'मुहूर्तः जन्मकुण्डल्याः सङ्केतान् सम्पूर्णतया निवारयितुं न शक्नोति, किन्तु विशिष्टकार्यस्य सफलतासम्भावनां महत्त्वपूर्णतया वर्धयितुं शक्नोति।',
      },
    },
  ],

  // ─── /calendar ─────────────────────────────────────────────
  '/calendar': [
    {
      question: {
        en: 'What is the Hindu calendar system?',
        hi: 'हिन्दू कैलेंडर प्रणाली क्या है?',
        sa: 'हिन्दूपञ्चाङ्गपद्धतिः का अस्ति?',
      },
      answer: {
        en: 'The Hindu calendar is a lunisolar system that tracks both the Moon\'s phases and the Sun\'s position. A lunar month runs from new moon to new moon (Amanta) or full moon to full moon (Purnimant). Each month is divided into Shukla Paksha (bright half) and Krishna Paksha (dark half) with 15 Tithis each. An intercalary month (Adhika Masa) is added approximately every 3 years to synchronize with the solar year.',
        hi: 'हिन्दू कैलेंडर एक चान्द्र-सौर प्रणाली है जो चन्द्रमा के चरणों और सूर्य की स्थिति दोनों को ट्रैक करती है। चान्द्र मास अमावस्या से अमावस्या (अमान्त) या पूर्णिमा से पूर्णिमा (पूर्णिमान्त) तक चलता है।',
        sa: 'हिन्दूपञ्चाङ्गं चान्द्रसौरपद्धतिः अस्ति या चन्द्रमसः कलाः सूर्यस्य स्थितिं च अनुसरति।',
      },
    },
    {
      question: {
        en: 'What is the difference between Amanta and Purnimant calendars?',
        hi: 'अमान्त और पूर्णिमान्त कैलेंडर में क्या अन्तर है?',
        sa: 'अमान्तपूर्णिमान्तपञ्चाङ्गयोः कः भेदः?',
      },
      answer: {
        en: 'Amanta (Amant) calendar, used primarily in South and West India (Maharashtra, Gujarat, Karnataka), begins the lunar month from the day after Amavasya (new moon). Purnimant calendar, used in North India (UP, Bihar, MP, Rajasthan), begins from the day after Purnima (full moon). Both systems track the same festivals but the month names may differ for a given date. Dekho Panchang supports both systems with a toggle.',
        hi: 'अमान्त कैलेंडर (दक्षिण और पश्चिम भारत) में चान्द्र मास अमावस्या के बाद से शुरू होता है। पूर्णिमान्त (उत्तर भारत) में मास पूर्णिमा के बाद से शुरू होता है। दोनों प्रणालियों में त्योहार एक ही हैं किन्तु मास के नाम भिन्न हो सकते हैं।',
        sa: 'अमान्तपद्धत्यां चान्द्रमासः अमावास्यानन्तरम् आरभते। पूर्णिमान्तपद्धत्यां पूर्णिमानन्तरम्। उभयोः पद्धत्योः पर्वाणि समानानि किन्तु मासनामानि भिद्यन्ते।',
      },
    },
    {
      question: {
        en: 'How many festivals are there in the Hindu calendar?',
        hi: 'हिन्दू कैलेंडर में कितने त्योहार हैं?',
        sa: 'हिन्दूपञ्चाङ्गे कति पर्वाणि सन्ति?',
      },
      answer: {
        en: 'The Hindu calendar contains over 180 major festivals, vrats (fasting days), and observances annually. These include 24 Ekadashis, 12 Purnimas, 12 Amavasyas, Navaratri (twice), Diwali, Holi, and dozens of regional festivals. Dekho Panchang tracks all major festivals with location-aware Tithi timing, so dates are accurate for your specific city.',
        hi: 'हिन्दू कैलेंडर में प्रतिवर्ष 180+ प्रमुख त्योहार, व्रत और अनुष्ठान हैं  –  24 एकादशी, 12 पूर्णिमा, 12 अमावस्या, नवरात्रि, दीवाली, होली और दर्जनों क्षेत्रीय त्योहार। देखो पंचांग सभी प्रमुख त्योहारों को स्थान-आधारित तिथि समय के साथ दर्शाता है।',
        sa: 'हिन्दूपञ्चाङ्गे प्रतिवर्षम् अशीत्यधिकशतं प्रमुखपर्वाणि व्रतानि अनुष्ठानानि च सन्ति। देखो-पञ्चाङ्गं सर्वाणि प्रमुखपर्वाणि स्थानाधारिततिथिकालेन सह दर्शयति।',
      },
    },
    {
      question: {
        en: 'Why do Hindu festival dates change every year?',
        hi: 'हिन्दू त्योहारों की तिथि प्रतिवर्ष क्यों बदलती है?',
        sa: 'हिन्दूपर्वतिथयः प्रतिवर्षं कथं परिवर्तन्ते?',
      },
      answer: {
        en: 'Hindu festival dates change because they are based on the lunar calendar, which is about 11 days shorter than the solar (Gregorian) year. Since festivals are tied to specific Tithis (lunar days), Nakshatras, and lunar months, their Gregorian dates shift annually. The intercalary month (Adhika Masa) partially corrects this drift, keeping festivals roughly within the same season each year.',
        hi: 'हिन्दू त्योहारों की तिथियाँ बदलती हैं क्योंकि ये चान्द्र कैलेंडर पर आधारित हैं, जो सौर वर्ष से ~11 दिन छोटा होता है। चूँकि त्योहार विशिष्ट तिथियों, नक्षत्रों और चान्द्र मासों से जुड़े हैं, उनकी अंग्रेजी तिथियाँ प्रतिवर्ष बदलती हैं। अधिक मास इस अन्तर को आंशिक रूप से सुधारता है।',
        sa: 'हिन्दूपर्वतिथयः परिवर्तन्ते यतः चान्द्रपञ्चाङ्गम् आश्रिताः, यत् सौरवर्षात् ~११ दिनैः लघुतरम्। अधिकमासः एतम् अन्तरं आंशिकतया सुधारयति।',
      },
    },
  ],

  // ─── /ekadashi ─────────────────────────────────────────────
  '/ekadashi': [
    {
      question: {
        en: 'How many Ekadashis are there in 2026?',
        hi: '2026 में कितनी एकादशी हैं?',
        sa: '२०२६ वर्षे कति एकादश्यः सन्ति?',
      },
      answer: {
        en: 'There are 24 named Ekadashis in 2026  –  two per lunar month, one on Shukla Paksha (bright half) and one on Krishna Paksha (dark half). In years with an Adhika (intercalary) month, there can be 26 Ekadashis.',
        hi: '2026 में 24 नामित एकादशियाँ हैं  –  प्रति चन्द्र मास में दो, एक शुक्ल पक्ष में और एक कृष्ण पक्ष में। अधिक मास वाले वर्षों में 26 एकादशियाँ हो सकती हैं।',
        sa: '२०२६ वर्षे २४ नामिताः एकादश्यः सन्ति  –  प्रतिमासं द्वे, एका शुक्लपक्षे एका कृष्णपक्षे च।',
      },
    },
    {
      question: {
        en: 'Which is the most powerful Ekadashi?',
        hi: 'सबसे शक्तिशाली एकादशी कौन सी है?',
        sa: 'शक्तिमत्तमा एकादशी का अस्ति?',
      },
      answer: {
        en: 'Nirjala Ekadashi (Jyeshtha Shukla Ekadashi) is considered the most powerful. Fasting without even water on this single day is said to grant the merit of all 24 Ekadashis combined. It was prescribed by Sage Vyasa to Bhima of the Pandavas.',
        hi: 'निर्जला एकादशी (ज्येष्ठ शुक्ल एकादशी) सबसे शक्तिशाली मानी जाती है। केवल इस एक दिन बिना जल के व्रत रखना सभी 24 एकादशियों के सम्मिलित पुण्य के बराबर है।',
        sa: 'निर्जलैकादशी (ज्येष्ठशुक्लैकादशी) शक्तिमत्तमा मन्यते। एतस्यां दिने निर्जलव्रतं सर्वासां २४ एकादशीनां पुण्यसमम्।',
      },
    },
    {
      question: {
        en: 'What is Nirjala Ekadashi?',
        hi: 'निर्जला एकादशी क्या है?',
        sa: 'निर्जलैकादशी का अस्ति?',
      },
      answer: {
        en: 'Nirjala Ekadashi falls on Jyeshtha Shukla Ekadashi (May/June). "Nirjala" means "without water"  –  devotees fast for the entire day without consuming even water. Sage Vyasa told Bhima that this single strict fast equals the merit of observing all 24 Ekadashis. It is also called Pandava Ekadashi or Bhimseni Ekadashi.',
        hi: 'निर्जला एकादशी ज्येष्ठ शुक्ल एकादशी (मई/जून) पर आती है। "निर्जला" का अर्थ है "बिना जल के"  –  भक्त पूरे दिन जल भी नहीं लेते। व्यास मुनि ने भीम को बताया कि यह एक कठोर व्रत सभी 24 एकादशियों के पुण्य के बराबर है।',
        sa: 'निर्जलैकादशी ज्येष्ठशुक्लैकादश्यां पतति। "निर्जला" इति "जलविना" इत्यर्थः। व्यासः भीमम् अवदत् एतत् एकं कठोरव्रतं सर्वासां एकादशीनां पुण्यसमम् इति।',
      },
    },
    {
      question: {
        en: 'What should I eat and avoid on Ekadashi?',
        hi: 'एकादशी पर क्या खाएँ और क्या न खाएँ?',
        sa: 'एकादश्यां किं भक्षणीयं किं च त्याज्यम्?',
      },
      answer: {
        en: 'On Ekadashi, avoid all grains (rice, wheat, lentils) and beans. Permitted foods include fruits, nuts, milk, potatoes, sweet potatoes, buckwheat (kuttu), water chestnut flour (singhara), and rock salt (sendha namak). Many devotees observe a complete fast (nirjala or with only water). The fast is broken the next morning during the Parana window.',
        hi: 'एकादशी पर सभी अनाज (चावल, गेहूँ, दाल) और फलियों का त्याग करें। फल, मेवे, दूध, आलू, शकरकन्दी, कुट्टू, सिंघाड़ा और सेंधा नमक खा सकते हैं। अनेक भक्त पूर्ण व्रत (निर्जला या केवल जल) रखते हैं। अगली सुबह पारण काल में व्रत खोलें।',
        sa: 'एकादश्यां सर्वाणि धान्यानि (तण्डुलाः गोधूमाः मसूराः) शिम्बीनि च त्यजेत्। फलानि शुष्कमेवानि क्षीरं च भक्षणीयानि।',
      },
    },
  ],

  // ─── /sign-calculator ──────────────────────────────────────
  '/sign-calculator': [
    {
      question: {
        en: 'How is my Vedic Moon sign (Rashi) calculated?',
        hi: 'मेरी वैदिक चन्द्र राशि की गणना कैसे होती है?',
        sa: 'मम वैदिकचन्द्रराशिः कथं गण्यते?',
      },
      answer: {
        en: 'Your Vedic Moon sign is determined by the sidereal (Nirayana) position of the Moon at the exact moment of your birth. The Moon\'s tropical longitude is adjusted by subtracting the Ayanamsha value (~24 degrees for Lahiri) to get the sidereal longitude. The resulting degree falls in one of the 12 Rashis (30 degrees each), which is your Moon sign. This requires precise birth time, date, and location.',
        hi: 'आपकी वैदिक चन्द्र राशि जन्म के सटीक क्षण में चन्द्रमा की निरयण स्थिति से निर्धारित होती है। चन्द्रमा के सायन रेखांश से अयनांश (~24°) घटाकर निरयण रेखांश प्राप्त होता है, जो 12 राशियों में से एक में पड़ता है।',
        sa: 'भवतः वैदिकचन्द्रराशिः जन्मस्य सम्यक्क्षणे चन्द्रमसः निरयणस्थित्या निर्धार्यते।',
      },
    },
    {
      question: {
        en: 'Why is my Vedic sign different from my Western zodiac sign?',
        hi: 'मेरी वैदिक राशि और पाश्चात्य राशि भिन्न क्यों है?',
        sa: 'मम वैदिकराशिः पाश्चात्यराशेश्च कथं भिद्यते?',
      },
      answer: {
        en: 'Vedic astrology uses the sidereal zodiac (fixed stars) while Western astrology uses the tropical zodiac (seasons). Due to the precession of equinoxes, the two systems have diverged by approximately 24 degrees (the Ayanamsha). This means most people\'s Vedic sign is one sign behind their Western sign. Additionally, Vedic astrology emphasizes the Moon sign while Western focuses on the Sun sign.',
        hi: 'वैदिक ज्योतिष निरयण (स्थिर तारे) और पाश्चात्य ज्योतिष सायन (ऋतुएँ) राशिचक्र का उपयोग करता है। अयनांश (~24°) के कारण अधिकांश लोगों की वैदिक राशि पाश्चात्य राशि से एक राशि पीछे होती है। इसके अतिरिक्त, वैदिक ज्योतिष चन्द्र राशि और पाश्चात्य सूर्य राशि पर बल देता है।',
        sa: 'वैदिकज्योतिषं निरयणराशिचक्रम् (स्थिरताराः) पाश्चात्यज्योतिषं तु सायनराशिचक्रम् (ऋतवः) उपयुङ्क्ते। अयनांशभेदात् (~२४°) अधिकजनानां वैदिकराशिः पाश्चात्यराशेः एकराश्या पृष्ठतः भवति।',
      },
    },
    {
      question: {
        en: 'Do I need my exact birth time to find my Moon sign?',
        hi: 'क्या चन्द्र राशि जानने के लिए सटीक जन्म समय आवश्यक है?',
        sa: 'चन्द्रराशिज्ञानाय सूक्ष्मजन्मकालः आवश्यकः किम्?',
      },
      answer: {
        en: 'For the Moon sign alone, an approximate birth time (within 2-3 hours) is usually sufficient since the Moon stays in one sign for about 2.25 days. However, if the Moon was changing signs near your birth time, even a small error can give the wrong sign. For the Ascendant (Lagna), exact birth time is critical as it changes roughly every 2 hours. We recommend using the most precise birth time available.',
        hi: 'केवल चन्द्र राशि के लिए अनुमानित जन्म समय (2-3 घण्टे के भीतर) सामान्यतः पर्याप्त है क्योंकि चन्द्रमा एक राशि में लगभग 2.25 दिन रहता है। किन्तु यदि जन्म समय के आसपास चन्द्रमा राशि बदल रहा हो तो छोटी त्रुटि भी गलत राशि दे सकती है।',
        sa: 'चन्द्रराशिमात्रार्थम् अनुमानितजन्मकालः (२-३ घण्टाभ्यन्तरे) सामान्यतः पर्याप्तः, यतः चन्द्रमाः एकस्यां राश्यां प्रायः सार्धद्वयदिनानि तिष्ठति।',
      },
    },
    {
      question: {
        en: 'What is the difference between Sun sign and Moon sign in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में सूर्य राशि और चन्द्र राशि में क्या अन्तर है?',
        sa: 'वैदिकज्योतिषे सूर्यराशिचन्द्रराश्योः कः भेदः?',
      },
      answer: {
        en: 'The Sun sign (Surya Rashi) represents your soul, ego, vitality, and outward identity  –  it changes roughly once a month. The Moon sign (Chandra Rashi) represents your mind, emotions, instincts, and inner nature  –  it changes approximately every 2.25 days. In Vedic astrology, the Moon sign is considered more important for daily predictions and compatibility matching, while the Sun sign is used for assessing authority, career, and health.',
        hi: 'सूर्य राशि आत्मा, अहंकार और बाह्य पहचान का प्रतिनिधित्व करती है  –  प्रति मास बदलती है। चन्द्र राशि मन, भावनाओं और आन्तरिक स्वभाव का  –  ~2.25 दिन में बदलती है। वैदिक ज्योतिष में दैनिक फल और मिलान के लिए चन्द्र राशि अधिक महत्वपूर्ण मानी जाती है।',
        sa: 'सूर्यराशिः आत्मानम् अहङ्कारं बाह्यस्वरूपं च दर्शयति। चन्द्रराशिः मनसः भावानां आन्तरिकस्वभावस्य च प्रतिनिधित्वं करोति। वैदिकज्योतिषे दैनिकफलाय मेलनाय च चन्द्रराशिः अधिकमहत्त्वपूर्णा मन्यते।',
      },
    },
  ],

  // ─── /hora ─────────────────────────────────────────────────
  '/hora': [
    {
      question: {
        en: 'What is Hora in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में होरा क्या है?',
        sa: 'वैदिकज्योतिषे होरा का अस्ति?',
      },
      answer: {
        en: 'Hora is a Vedic time-division system where each hour of the day is ruled by one of the 7 classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) in a fixed sequence. The first Hora of each day is ruled by the planet that governs that weekday  –  Sunday starts with Sun Hora, Monday with Moon Hora, etc. Different Horas are suited for different activities, making it a practical timing tool.',
        hi: 'होरा वैदिक समय-विभाजन है जिसमें दिन का प्रत्येक घण्टा 7 शास्त्रीय ग्रहों (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) में से एक द्वारा शासित होता है। प्रत्येक दिन की प्रथम होरा उस वार के स्वामी ग्रह की होती है।',
        sa: 'होरा वैदिककालविभाजनपद्धतिः अस्ति यत्र दिनस्य प्रत्येकं घण्टं सप्तसु शास्त्रीयग्रहेषु एकेन शासितं भवति।',
      },
    },
    {
      question: {
        en: 'Which planetary Hora is best for financial activities?',
        hi: 'आर्थिक कार्यों के लिए कौन सी ग्रह होरा सबसे अच्छी है?',
        sa: 'आर्थिककार्येभ्यः का ग्रहहोरा श्रेष्ठा?',
      },
      answer: {
        en: 'Jupiter Hora is considered best for financial growth, investments, and auspicious money-related activities. Venus Hora is excellent for purchasing luxury items, jewellery, and vehicles. Mercury Hora is ideal for business deals, contracts, and banking transactions. Avoid Saturn Hora and Mars Hora for financial activities as they are associated with losses and impulsive spending respectively.',
        hi: 'गुरु होरा आर्थिक वृद्धि, निवेश और शुभ धन-सम्बन्धी कार्यों के लिए सर्वोत्तम है। शुक्र होरा विलासिता वस्तुएं, आभूषण और वाहन खरीदने के लिए उत्तम है। बुध होरा व्यापार, अनुबन्ध और बैंकिंग के लिए आदर्श है। शनि और मंगल होरा में आर्थिक कार्य टालें।',
        sa: 'गुरुहोरा आर्थिकवृद्ध्यै निवेशाय शुभधनकार्येभ्यश्च श्रेष्ठा। शुक्रहोरा विलासवस्तुक्रयाय, बुधहोरा व्यापारानुबन्धाय च आदर्शा। शनिकुजहोरासु आर्थिककार्याणि वर्जनीयानि।',
      },
    },
    {
      question: {
        en: 'How is Hora timing different from Choghadiya?',
        hi: 'होरा और चौघड़िया के समय में क्या अन्तर है?',
        sa: 'होरायाः चौघड़ियायाश्च काले कः भेदः?',
      },
      answer: {
        en: 'Hora divides the day into 24 one-hour periods (each ruled by a planet in the Chaldean order), while Choghadiya divides only the daytime and nighttime into 8 periods each (~1.5 hours, variable by season). Hora is consistent in duration but varies in planetary ruler; Choghadiya periods vary in duration but follow a fixed naming pattern. Both are valid timing systems  –  Hora is widely used across India while Choghadiya is especially popular in Gujarat and Western India.',
        hi: 'होरा दिन को 24 एक-एक घण्टे की अवधि में बाँटती है (प्रत्येक एक ग्रह द्वारा शासित), जबकि चौघड़िया दिन और रात को 8-8 अवधियों (~1.5 घण्टे) में। होरा की अवधि स्थिर है; चौघड़िया की ऋतु के अनुसार बदलती है। होरा सम्पूर्ण भारत में और चौघड़िया गुजरात-पश्चिम भारत में अधिक प्रचलित है।',
        sa: 'होरा दिनं चतुर्विंशतिघण्टात्मकेषु विभागेषु विभजति, चौघड़िया तु दिवारात्रम् अष्ट-अष्टविभागेषु। होरा समग्रभारते, चौघड़िया गुजरातपश्चिमभारते च अधिकप्रचलिता।',
      },
    },
  ],

  // ─── /annual-forecast ──────────────────────────────────────
  '/annual-forecast': [
    {
      question: {
        en: 'What is Varshaphal (annual horoscope)?',
        hi: 'वर्षफल (वार्षिक कुण्डली) क्या है?',
        sa: 'वर्षफलम् (वार्षिककुण्डली) किम् अस्ति?',
      },
      answer: {
        en: 'Varshaphal is the Vedic annual horoscope based on the Tajika system, cast for the exact moment the Sun returns to its natal position each year (Solar Return). It includes a unique chart, Muntha (progressed ascendant), Sahams (Arabic parts), the Varsheshvara (year lord), and Mudda Dasha (annual planetary periods). It provides predictions specific to that solar year  –  from one birthday to the next.',
        hi: 'वर्षफल ताजिक प्रणाली पर आधारित वैदिक वार्षिक कुण्डली है, जो प्रतिवर्ष सूर्य के जन्मस्थिति पर लौटने के सटीक क्षण (सौर प्रत्यावर्तन) के लिए बनाई जाती है। इसमें मुन्था, साहम, वर्षेश्वर और मुद्दा दशा शामिल हैं।',
        sa: 'वर्षफलं ताजिकपद्धत्याधारितं वैदिकवार्षिकफलम् अस्ति, सूर्यस्य जन्मस्थितौ प्रत्यावर्तनस्य सम्यक्क्षणे रच्यते।',
      },
    },
    {
      question: {
        en: 'How is the annual forecast different from the birth chart?',
        hi: 'वार्षिक भविष्यफल जन्म कुण्डली से कैसे भिन्न है?',
        sa: 'वार्षिकभविष्यफलं जन्मकुण्डल्याः कथं भिद्यते?',
      },
      answer: {
        en: 'The birth chart (Janma Kundali) is fixed for life and shows your overall karmic blueprint  –  personality, career tendencies, and life themes. The annual forecast (Varshaphal) is a temporary chart that changes every solar year, showing the specific themes, opportunities, and challenges active during that particular year. It uses the Tajika system with different aspects (Ithasala, Ishraf, etc.) rather than the standard Parashari aspects used in birth chart analysis.',
        hi: 'जन्म कुण्डली जीवन भर स्थिर रहती है और समग्र कर्म खाका दर्शाती है। वर्षफल एक अस्थायी कुण्डली है जो प्रतिवर्ष बदलती है, उस वर्ष की विशिष्ट थीम, अवसर और चुनौतियाँ दर्शाती है। यह ताजिक प्रणाली (इत्थशाल, ईशराफ आदि) का उपयोग करता है।',
        sa: 'जन्मकुण्डली जीवनपर्यन्तं स्थिरा भवति। वर्षफलं प्रतिसौरवर्षं परिवर्तमाना अस्थायिकुण्डली अस्ति, तद्वर्षस्य विशिष्टविषयान् दर्शयति।',
      },
    },
    {
      question: {
        en: 'When should I check my Varshaphal?',
        hi: 'वर्षफल कब देखना चाहिए?',
        sa: 'वर्षफलं कदा द्रष्टव्यम्?',
      },
      answer: {
        en: 'The ideal time to check your Varshaphal is around your birthday each year, as the solar year runs from one birthday to the next. You can generate it for any year  –  past, present, or future  –  to understand the planetary themes active during that period. Many Jyotishis recommend reviewing it alongside your Vimshottari Dasha for a comprehensive picture of the year ahead.',
        hi: 'वर्षफल देखने का आदर्श समय प्रतिवर्ष जन्मदिन के आसपास है, क्योंकि सौर वर्ष एक जन्मदिन से अगले तक चलता है। आप किसी भी वर्ष (भूत, वर्तमान, भविष्य) के लिए बना सकते हैं। कई ज्योतिषी विंशोत्तरी दशा के साथ मिलाकर देखने की सलाह देते हैं।',
        sa: 'वर्षफलं द्रष्टुं आदर्शकालः प्रतिवर्षं जन्मदिनस्य समीपे अस्ति। भूतवर्तमानभविष्यत्कस्यापि वर्षस्य कृते रचयितुं शक्यते।',
      },
    },
  ],

  // ─── /learn ────────────────────────────────────────────────
  '/learn': [
    {
      question: {
        en: 'How do I start learning Vedic astrology (Jyotish)?',
        hi: 'वैदिक ज्योतिष सीखना कैसे शुरू करें?',
        sa: 'वैदिकज्योतिषशास्त्रं शिक्षितुं कथम् आरभेत?',
      },
      answer: {
        en: 'Start with the five Panchang elements (Tithi, Nakshatra, Yoga, Karana, Vara) to understand the daily Vedic calendar. Then learn the 12 Rashis (signs) and 9 Grahas (planets) and their basic natures. Next, study house significations (1st through 12th) and how planets behave in different signs and houses. Our structured learning path on Dekho Panchang covers all these topics with interactive examples.',
        hi: 'पंचांग के पाँच अंगों (तिथि, नक्षत्र, योग, करण, वार) से शुरू करें। फिर 12 राशियाँ और 9 ग्रहों के मूल स्वभाव सीखें। फिर भावों (1-12) का अध्ययन करें। देखो पंचांग पर संरचित शिक्षण पथ इन सभी विषयों को सहज उदाहरणों से समझाता है।',
        sa: 'पञ्चाङ्गस्य पञ्चभिः अङ्गैः (तिथिः, नक्षत्रम्, योगः, करणम्, वारः) आरभेत। ततः द्वादशराशीन् नवग्रहांश्च शिक्षेत। ततः भावानां (१-१२) अध्ययनं कुर्यात्।',
      },
    },
    {
      question: {
        en: 'Can I learn Jyotish without knowing Sanskrit?',
        hi: 'क्या संस्कृत के बिना ज्योतिष सीख सकते हैं?',
        sa: 'संस्कृतं विना ज्योतिषं शिक्षितुं शक्यते किम्?',
      },
      answer: {
        en: 'Yes, you can learn Jyotish without Sanskrit fluency. While classical texts (Brihat Parashara Hora Shastra, Brihat Jataka, Phaladeepika) are in Sanskrit, excellent translations exist in English and Hindi. Most technical terms (Rashi, Graha, Bhava, Dasha, Yoga) are Sanskrit words used as-is in all languages. Familiarity with key terms is sufficient  –  you do not need to read Sanskrit grammar. Our learn section presents all concepts in English, Hindi, and Sanskrit.',
        hi: 'हाँ, संस्कृत में प्रवीणता के बिना ज्योतिष सीखा जा सकता है। यद्यपि शास्त्रीय ग्रन्थ संस्कृत में हैं, उनके उत्कृष्ट अनुवाद उपलब्ध हैं। अधिकांश तकनीकी शब्द (राशि, ग्रह, भाव, दशा, योग) सभी भाषाओं में वैसे ही प्रयुक्त होते हैं। मूल शब्दों की जानकारी पर्याप्त है।',
        sa: 'आम्, संस्कृतप्रावीण्यं विना ज्योतिषं शिक्षितुं शक्यते। शास्त्रीयग्रन्थानां (बृहत्पराशरहोराशास्त्रम् इत्यादीनां) उत्कृष्टानुवादाः उपलभ्यन्ते। प्रमुखशब्दानां ज्ञानं पर्याप्तम्।',
      },
    },
    {
      question: {
        en: 'What is the best order to study Jyotish topics?',
        hi: 'ज्योतिष विषयों को किस क्रम में पढ़ना चाहिए?',
        sa: 'ज्योतिषविषयान् केन क्रमेण पठेत्?',
      },
      answer: {
        en: 'A recommended learning path: (1) Panchang basics  –  Tithi, Nakshatra, Yoga, Karana, Vara; (2) Rashis and their qualities; (3) Grahas  –  natural significations and friendships; (4) Bhavas (houses)  –  what each house represents; (5) Planet-in-sign and planet-in-house effects; (6) Aspects (Drishti); (7) Vimshottari Dasha system; (8) Yogas and Doshas; (9) Divisional charts (D-9 Navamsha first); (10) Transits and predictive techniques.',
        hi: 'अनुशंसित क्रम: (1) पंचांग मूल  –  तिथि, नक्षत्र, योग, करण, वार; (2) राशियाँ; (3) ग्रह  –  स्वाभाविक कारकत्व और मैत्री; (4) भाव; (5) ग्रह-राशि और ग्रह-भाव प्रभाव; (6) दृष्टि; (7) विंशोत्तरी दशा; (8) योग और दोष; (9) वर्ग चार्ट; (10) गोचर।',
        sa: 'अनुशंसितक्रमः  –  (१) पञ्चाङ्गमूलानि, (२) राशयः, (३) ग्रहाः, (४) भावाः, (५) ग्रहराशिग्रहभावप्रभावाः, (६) दृष्टयः, (७) विंशोत्तरीदशा, (८) योगदोषाः, (९) वर्गचक्राणि, (१०) गोचरः।',
      },
    },
  ],

  // ─── /prashna ──────────────────────────────────────────────
  '/prashna': [
    {
      question: {
        en: 'What is Prashna Kundali (horary astrology)?',
        hi: 'प्रश्न कुण्डली (होरेरी ज्योतिष) क्या है?',
        sa: 'प्रश्नकुण्डली (होरेरीज्योतिषम्) किम् अस्ति?',
      },
      answer: {
        en: 'Prashna Kundali is the Vedic system of horary astrology where a chart is cast for the exact moment a question is asked (or arrives in the astrologer\'s mind). Unlike birth chart analysis, it does not require birth details. The chart of the question itself reveals the answer through planetary positions, house lords, and aspects at that precise moment. It is especially useful when birth data is unavailable or for time-sensitive questions.',
        hi: 'प्रश्न कुण्डली वैदिक होरेरी ज्योतिष है जिसमें प्रश्न पूछने के सटीक क्षण की कुण्डली बनाई जाती है। जन्म विवरण की आवश्यकता नहीं होती। प्रश्न की कुण्डली स्वयं ग्रह स्थिति, भावेश और दृष्टि के माध्यम से उत्तर देती है।',
        sa: 'प्रश्नकुण्डली वैदिकहोरेरीज्योतिषम् अस्ति यत्र प्रश्नस्य सम्यक्क्षणे कुण्डली रच्यते। जन्मविवरणम् नापेक्ष्यते। प्रश्नस्य कुण्डली स्वयं ग्रहस्थित्या भावेशैः दृष्टिभिश्च उत्तरं ददाति।',
      },
    },
    {
      question: {
        en: 'When should I use Prashna instead of my birth chart?',
        hi: 'जन्म कुण्डली के बदले प्रश्न कुण्डली कब उपयोग करें?',
        sa: 'जन्मकुण्डल्याः स्थाने प्रश्नकुण्डली कदा उपयोक्तव्या?',
      },
      answer: {
        en: 'Use Prashna when: (1) you don\'t know your exact birth time, (2) you have a specific, urgent question that needs an immediate answer, (3) you want to know the outcome of a particular event or decision, or (4) you\'re asking about something not clearly shown in the birth chart (like a lost object or a specific transaction). Prashna is ideal for "will this happen?" type questions with a definite yes/no answer.',
        hi: 'प्रश्न कुण्डली तब उपयोग करें जब: (1) सटीक जन्म समय न पता हो, (2) कोई विशिष्ट, तत्काल प्रश्न हो, (3) किसी विशेष घटना का परिणाम जानना हो, या (4) जन्म कुण्डली में स्पष्ट न दिखे (जैसे खोई वस्तु)। "क्या यह होगा?" प्रकार के हाँ/ना प्रश्नों के लिए आदर्श है।',
        sa: 'प्रश्नकुण्डल्या उपयोगः कार्यः यदा  –  (१) सूक्ष्मजन्मकालः न ज्ञातः, (२) विशिष्टः तात्कालिकः प्रश्नः अस्ति, (३) विशिष्टघटनायाः परिणामं ज्ञातुम् इच्छति, (४) जन्मकुण्डल्यां स्पष्टं न दृश्यते। "किम् एतत् भविष्यति?" इति प्रश्नेभ्यः आदर्शा।',
      },
    },
    {
      question: {
        en: 'Does the accuracy of Prashna depend on the sincerity of the question?',
        hi: 'क्या प्रश्न कुण्डली की सटीकता प्रश्न की गम्भीरता पर निर्भर करती है?',
        sa: 'किं प्रश्नकुण्डल्याः सूक्ष्मता प्रश्नस्य गाम्भीर्ये निर्भरा भवति?',
      },
      answer: {
        en: 'Classical texts emphasize that Prashna works best when the questioner has genuine concern about the matter. A question asked out of idle curiosity or to "test" astrology is unlikely to yield meaningful results. The underlying principle is that the moment of sincere inquiry is cosmically connected to the answer  –  the chart at that moment reflects the querent\'s karmic situation regarding that specific question.',
        hi: 'शास्त्रीय ग्रन्थ कहते हैं कि प्रश्न कुण्डली तब सबसे अच्छी काम करती है जब प्रश्नकर्ता को विषय की वास्तविक चिन्ता हो। उत्सुकता या "परीक्षा" हेतु पूछा गया प्रश्न सार्थक परिणाम नहीं देता। सच्ची जिज्ञासा का क्षण ब्रह्माण्डीय रूप से उत्तर से जुड़ा होता है।',
        sa: 'शास्त्रीयग्रन्थाः वदन्ति यत् प्रश्नकुण्डली तदा श्रेष्ठतया कार्यं करोति यदा प्रष्टुः विषये वास्तविकी चिन्ता भवति। सत्याः जिज्ञासायाः क्षणः ब्रह्माण्डीयतया उत्तरेण सम्बद्धः भवति।',
      },
    },
  ],

  // ─── /matching/compatibility ───────────────────────────────
  '/matching/compatibility': [
    {
      question: {
        en: 'What does the Rashi compatibility heatmap show?',
        hi: 'राशि अनुकूलता हीटमैप क्या दर्शाता है?',
        sa: 'राशिसाम्यतातापपत्रं किं दर्शयति?',
      },
      answer: {
        en: 'The compatibility heatmap shows the Ashta Kuta Guna Milan score (out of 36) for every possible Moon sign pair  –  all 144 combinations of the 12 Rashis. Higher scores (shown in green/gold) indicate better compatibility, while lower scores (red) suggest potential challenges. This gives you a quick visual overview of which Moon sign combinations are naturally harmonious according to Vedic matching rules.',
        hi: 'अनुकूलता हीटमैप प्रत्येक सम्भव चन्द्र राशि जोड़ी के लिए अष्ट कूट गुण मिलान अंक (36 में से) दर्शाता है  –  12 राशियों के सभी 144 संयोजन। उच्च अंक (हरा/स्वर्ण) बेहतर अनुकूलता और निम्न (लाल) सम्भावित चुनौतियाँ दर्शाते हैं।',
        sa: 'साम्यतातापपत्रं प्रत्येकस्य सम्भाव्यचन्द्रराशियुग्मस्य अष्टकूटगुणमेलनाङ्कम् (षट्त्रिंशतः) दर्शयति  –  द्वादशराशीनां सर्वाणि चतुश्चत्वारिंशदधिकशतसंयोजनानि।',
      },
    },
    {
      question: {
        en: 'Is Ashta Kuta score the only factor for marriage compatibility?',
        hi: 'क्या विवाह अनुकूलता के लिए अष्ट कूट अंक ही एकमात्र कारक है?',
        sa: 'किम् अष्टकूटाङ्कः विवाहसाम्यतायै एकमात्रः कारकः अस्ति?',
      },
      answer: {
        en: 'No, the Ashta Kuta score is an important starting point but not the only factor. A thorough compatibility analysis also examines: Mangal Dosha in both charts, the 7th house lord and Venus placement, Dasha compatibility (whether both partners are in favourable Dashas), and overall chart strength. A high Guna score with a serious Dosha (like Nadi Dosha) may still be problematic. Consulting the full birth charts provides a more complete picture.',
        hi: 'नहीं, अष्ट कूट अंक एक महत्वपूर्ण प्रारम्भिक बिन्दु है किन्तु एकमात्र कारक नहीं। सम्पूर्ण अनुकूलता विश्लेषण में मंगल दोष, 7वें भावेश और शुक्र स्थिति, दशा अनुकूलता और समग्र कुण्डली बल भी देखा जाता है।',
        sa: 'न, अष्टकूटाङ्कः महत्त्वपूर्णः आरम्भबिन्दुः किन्तु एकमात्रः कारकः नास्ति। सम्पूर्णसाम्यताविश्लेषणे मङ्गलदोषः, सप्तमभावेशः, दशासाम्यता, समग्रकुण्डलीबलं च परीक्ष्यन्ते।',
      },
    },
    {
      question: {
        en: 'What happens if the Guna score is low but we still want to marry?',
        hi: 'यदि गुण अंक कम हो लेकिन फिर भी विवाह करना चाहें तो?',
        sa: 'यदि गुणाङ्काः न्यूनाः किन्तु विवाहम् इच्छामः तर्हि किम्?',
      },
      answer: {
        en: 'A low Guna score (below 18) does not automatically mean the marriage will fail  –  it indicates areas that may need extra attention. Remedies include: performing specific Pujas recommended by a Jyotishi, wearing gemstones prescribed for Dosha mitigation, observing Shanti rituals before the wedding, and  –  most importantly  –  understanding which specific Kutas scored low so you can consciously work on those relationship areas (communication, temperament, etc.).',
        hi: 'कम गुण अंक (18 से नीचे) का अर्थ स्वचालित विवाह विफलता नहीं है  –  यह उन क्षेत्रों को इंगित करता है जिन पर अतिरिक्त ध्यान चाहिए। उपायों में विशिष्ट पूजा, रत्न धारण, शान्ति अनुष्ठान और  –  सबसे महत्वपूर्ण  –  कौन से कूट कम हैं यह जानकर उन सम्बन्ध क्षेत्रों पर सचेत रूप से कार्य करना शामिल है।',
        sa: 'न्यूनगुणाङ्कः (अष्टादशात् न्यूनः) स्वचालितविवाहविफलतां न सूचयति  –  तेषु क्षेत्रेषु अतिरिक्तध्यानम् आवश्यकम् इति दर्शयति।',
      },
    },
  ],

  // ─── /kp-system ────────────────────────────────────────────
  '/kp-system': [
    {
      question: {
        en: 'What is KP (Krishnamurti Paddhati) astrology?',
        hi: 'केपी (कृष्णमूर्ति पद्धति) ज्योतिष क्या है?',
        sa: 'केपी (कृष्णमूर्ति पद्धतिः) ज्योतिषं किम् अस्ति?',
      },
      answer: {
        en: 'KP System (Krishnamurti Paddhati) is a refined predictive system developed by Prof. K.S. Krishnamurti. It uses the Placidus house system (instead of equal houses), divides each Nakshatra into 9 sub-divisions based on Vimshottari Dasha lords, and creates a unique 249-entry sub-lord table. KP is known for its precision in timing events and answering specific yes/no questions  –  it is often used alongside traditional Parashari Jyotish.',
        hi: 'केपी प्रणाली (कृष्णमूर्ति पद्धति) प्रो. के.एस. कृष्णमूर्ति द्वारा विकसित एक परिष्कृत भविष्यवाणी प्रणाली है। यह प्लेसिडस भाव प्रणाली, 249 उप-स्वामी तालिका और नक्षत्रों के 9 उप-विभाजन का उपयोग करती है। केपी घटनाओं के समय और हाँ/ना प्रश्नों में अत्यन्त सटीक है।',
        sa: 'केपीपद्धतिः (कृष्णमूर्तिपद्धतिः) प्रो. कृष्णमूर्तिना विकसिता परिष्कृता भविष्यवाणीपद्धतिः अस्ति। प्लेसिडसभावपद्धतिम्, २४९ उपस्वामिसारणीं, नक्षत्राणां नवोपविभागांश्च उपयुङ्क्ते।',
      },
    },
    {
      question: {
        en: 'How is KP different from traditional Vedic astrology?',
        hi: 'केपी पारम्परिक वैदिक ज्योतिष से कैसे भिन्न है?',
        sa: 'केपी पारम्परिकवैदिकज्योतिषात् कथं भिद्यते?',
      },
      answer: {
        en: 'Key differences: (1) KP uses Placidus houses while Vedic uses equal/whole-sign houses; (2) KP introduces "sub-lord"  –  a finer division beyond Nakshatra lord, giving 249 subdivisions vs 27 Nakshatras; (3) KP uses "ruling planets" at the moment of judgment for confirmation; (4) KP focuses on cuspal sub-lords rather than house lords for prediction; (5) KP is particularly strong for timing events and Prashna (horary) questions.',
        hi: 'प्रमुख अन्तर: (1) केपी प्लेसिडस भाव, वैदिक समान/पूर्ण राशि भाव; (2) केपी "उप-स्वामी"  –  नक्षत्र स्वामी से भी सूक्ष्म विभाजन, 249 उपविभाग; (3) केपी निर्णय क्षण के "शासक ग्रह" से पुष्टि; (4) केपी भावेश के बजाय भाव मध्य उप-स्वामी पर ध्यान; (5) घटना समय और प्रश्न में विशेष रूप से प्रबल।',
        sa: 'प्रमुखभेदाः  –  (१) केपी प्लेसिडसभावान् उपयुङ्क्ते, (२) "उपस्वामी"  –  नक्षत्रस्वामिनः अतिसूक्ष्मः विभागः, २४९ उपविभागाः, (३) निर्णयक्षणे "शासकग्रहाः" पुष्ट्यर्थम्, (४) भावमध्योपस्वामिषु ध्यानम्।',
      },
    },
    {
      question: {
        en: 'What are ruling planets in KP system?',
        hi: 'केपी प्रणाली में शासक ग्रह क्या हैं?',
        sa: 'केपीपद्धतौ शासकग्रहाः के सन्ति?',
      },
      answer: {
        en: 'Ruling planets are the lords active at the moment of chart judgment  –  they include the Lagna sign lord, Lagna Nakshatra lord, Moon sign lord, Moon Nakshatra lord, and the day lord. In KP, ruling planets serve as a confirmation tool: if a significator planet for a particular event is also a ruling planet at the time of analysis, it strongly confirms that the event will manifest. This is a unique KP technique not found in traditional Vedic astrology.',
        hi: 'शासक ग्रह चार्ट विश्लेषण के क्षण में सक्रिय स्वामी हैं  –  लग्न राशि स्वामी, लग्न नक्षत्र स्वामी, चन्द्र राशि स्वामी, चन्द्र नक्षत्र स्वामी और वार स्वामी। केपी में यदि किसी घटना का कारक ग्रह विश्लेषण समय का शासक ग्रह भी हो, तो यह घटना की पुष्टि करता है।',
        sa: 'शासकग्रहाः चक्रविश्लेषणक्षणे सक्रियाः स्वामिनः सन्ति  –  लग्नराशिस्वामी, लग्ननक्षत्रस्वामी, चन्द्रराशिस्वामी, चन्द्रनक्षत्रस्वामी, वारस्वामी च। केपीपद्धतौ एषः अद्वितीयः पुष्टिसाधनम् अस्ति।',
      },
    },
  ],

  '/tithi-pravesha': [
    {
      question: {
        en: 'What is Tithi Pravesha?',
        hi: 'तिथि प्रवेश क्या है?',
        sa: 'तिथिप्रवेशः किम् अस्ति?',
      },
      answer: {
        en: 'Tithi Pravesha is the Vedic birthday  –  the exact moment each year when the same lunar tithi (day) as your birth recurs. It is used in Vedic astrology for annual predictions, similar to the Solar Return in Western astrology but based on the lunar calendar.',
        hi: 'तिथि प्रवेश वैदिक जन्मदिन है  –  हर वर्ष वह सटीक क्षण जब आपकी जन्म तिथि पुनः आती है। इसका उपयोग वैदिक ज्योतिष में वार्षिक भविष्यवाणी के लिए किया जाता है।',
        sa: 'तिथिप्रवेशः वैदिकजन्मदिवसः  –  प्रतिवर्षं यत् सटीकक्षणं यदा जन्मतिथिः पुनरागच्छति। वैदिकज्योतिषे वार्षिकभविष्यवाण्यर्थम् उपयुज्यते।',
      },
    },
    {
      question: {
        en: 'How is Tithi Pravesha different from a regular birthday?',
        hi: 'तिथि प्रवेश सामान्य जन्मदिन से कैसे अलग है?',
        sa: 'तिथिप्रवेशः सामान्यजन्मदिवसात् कथं भिन्नः?',
      },
      answer: {
        en: 'Your regular birthday follows the solar (Gregorian) calendar and falls on the same date each year. Tithi Pravesha follows the lunar calendar  –  the exact tithi of your birth  –  so the date shifts each year, typically by 10-12 days.',
        hi: 'आपका नियमित जन्मदिन सौर (ग्रेगोरियन) कैलेंडर का अनुसरण करता है। तिथि प्रवेश चंद्र कैलेंडर पर आधारित है  –  आपकी जन्म तिथि  –  इसलिए तारीख हर वर्ष 10-12 दिन बदलती है।',
        sa: 'भवतः नियमितजन्मदिवसः सौरपञ्चाङ्गम् अनुसरति। तिथिप्रवेशः चान्द्रपञ्चाङ्गम् अनुसरति  –  भवतः जन्मतिथिम्  –  अतः दिनाङ्कः प्रतिवर्षं १०-१२ दिनानि परिवर्तते।',
      },
    },
    {
      question: {
        en: 'What does the Tithi Lord indicate?',
        hi: 'तिथि स्वामी क्या दर्शाता है?',
        sa: 'तिथिस्वामी किं दर्शयति?',
      },
      answer: {
        en: 'Each tithi is ruled by a planet (the Tithi Lord). The lord of your birth tithi influences the theme of your Vedic year  –  for example, a Jupiter-ruled tithi suggests expansion and wisdom, while a Saturn-ruled one indicates discipline and karmic lessons.',
        hi: 'प्रत्येक तिथि का एक ग्रह स्वामी होता है। आपकी जन्म तिथि का स्वामी आपके वैदिक वर्ष की थीम को प्रभावित करता है।',
        sa: 'प्रत्येकतिथेः एकः ग्रहस्वामी भवति। भवतः जन्मतिथेः स्वामी भवतः वैदिकवर्षस्य विषयं प्रभावयति।',
      },
    },
  ],

  // ─── /caesarean-muhurta ──────────────────────────────────────
  '/caesarean-muhurta': [
    {
      question: {
        en: 'What is caesarean muhurta?',
        hi: 'सिजेरियन मुहूर्त क्या है?',
        sa: 'शस्त्रक्रियाजन्ममुहूर्तं किम् अस्ति?',
      },
      answer: {
        en: 'Caesarean muhurta is the Vedic practice of electing the most auspicious birth time for a planned C-section delivery. Since the delivery date range is known in advance, classical Jyotish principles are applied to find a time slot that produces the strongest possible birth chart for the child  –  optimising lagna strength, Moon placement, benefic distribution, and the starting Vimshottari dasha.',
        hi: 'सिजेरियन मुहूर्त नियोजित सिजेरियन प्रसव के लिए सबसे शुभ जन्म समय चुनने की वैदिक पद्धति है। चूंकि प्रसव की तिथि सीमा पहले से ज्ञात होती है, शास्त्रीय ज्योतिष सिद्धान्तों द्वारा ऐसा समय खोजा जाता है जो शिशु की सर्वश्रेष्ठ जन्म कुण्डली प्रदान करे।',
        sa: 'शस्त्रक्रियाजन्ममुहूर्तं नियोजितशस्त्रक्रियाप्रसवार्थं सर्वोत्तमजन्मकालस्य निर्वाचनं भवति। शास्त्रीयज्योतिषसिद्धान्तैः लग्नबलं चन्द्रस्थानं शुभग्रहवितरणं दशामार्गश्च अनुकूलितम्।',
      },
    },
    {
      question: {
        en: 'How does the 5-pillar birth time scorer work?',
        hi: 'पाँच स्तम्भ जन्म समय मूल्यांकन कैसे कार्य करता है?',
        sa: 'पञ्चस्तम्भजन्मकालमूल्याङ्कनं कथं कार्यं करोति?',
      },
      answer: {
        en: 'Each candidate time slot is scored across 5 classical pillars out of 100 points: Lagna Strength (30 pts  –  lord dignity, kendra/trikona placement, benefic in lagna, Pushkar Navamsha, sandhi buffer), Moon Strength (25 pts  –  house placement, paksha bala, nakshatra quality, Jupiter aspect), Benefic/Malefic Distribution (20 pts  –  benefics in kendras/trikonas, malefics in upachaya, clean 8th house), Dasha Trajectory (15 pts  –  quality and remaining balance of the starting maha dasha), and Structural Defects (10 pts deducted for Gandanta Moon, Kaal Sarpa, combust lagna lord, nodes in lagna, etc.).',
        hi: 'प्रत्येक उम्मीदवार समय खंड का 100 अंकों में 5 शास्त्रीय स्तम्भों पर मूल्यांकन होता है: लग्न बल (30), चन्द्र बल (25), शुभ/अशुभ ग्रह वितरण (20), दशा प्रक्षेपण (15), और संरचनात्मक दोष (10 कटौती)।',
        sa: 'प्रत्येकं कालखण्डं शतबिन्दुषु पञ्चशास्त्रीयस्तम्भेषु मूल्याङ्कितम्  –  लग्नबलं चन्द्रबलं शुभाशुभवितरणं दशामार्गः संरचनादोषाश्च।',
      },
    },
    {
      question: {
        en: 'Which nakshatras should be avoided for a caesarean birth?',
        hi: 'सिजेरियन जन्म के लिए किन नक्षत्रों से बचना चाहिए?',
        sa: 'शस्त्रक्रियाजन्मार्थं कानि नक्षत्राणि वर्जनीयानि?',
      },
      answer: {
        en: 'Classical texts flag specific Janma Nakshatra Doshas: Ashlesha (4th pada  –  harm to mother), Magha (1st pada  –  harm to father), Moola (1st pada  –  harm to father/family), and Jyeshtha (4th pada  –  harm to elder brother). Additionally, any Moon in the Gandanta zone (last 3°20\' of a water sign or first 3°20\' of a fire sign) is a hard veto  –  the tool marks such slots as "Avoid" regardless of other factors.',
        hi: 'शास्त्रीय ग्रन्थों में विशिष्ट जन्म नक्षत्र दोष बताए गए हैं: आश्लेषा (चौथा पद  –  माता को हानि), मघा (पहला पद  –  पिता को हानि), मूल (पहला पद  –  पिता/परिवार), ज्येष्ठा (चौथा पद  –  बड़े भाई)। गण्डान्त क्षेत्र में चन्द्रमा होना कठोर निषेध है।',
        sa: 'शास्त्रेषु विशिष्टजन्मनक्षत्रदोषाः उक्ताः  –  आश्लेषा (चतुर्थपादः), मघा (प्रथमपादः), मूलम् (प्रथमपादः), ज्येष्ठा (चतुर्थपादः)। गण्डान्तक्षेत्रे चन्द्रमाः कठोरनिषेधः।',
      },
    },
    {
      question: {
        en: 'Why does the starting Vimshottari dasha matter for a newborn?',
        hi: 'नवजात शिशु के लिए प्रारम्भिक विंशोत्तरी दशा क्यों महत्वपूर्ण है?',
        sa: 'नवजातशिशोः प्रारम्भिकविंशोत्तरीदशा कथं महत्त्वपूर्णा?',
      },
      answer: {
        en: 'The child enters the Vimshottari maha dasha of the Moon\'s nakshatra lord at birth. A Jupiter or Venus dasha (benefic, long duration) gives the child a stable, growth-oriented start, while a Ketu or Rahu dasha can indicate early confusion and instability. The remaining balance also matters  –  starting Jupiter with only 1 year left means a quick transition to Saturn. The scorer weighs both the dasha lord quality and the remaining balance.',
        hi: 'शिशु जन्म पर चन्द्र नक्षत्र स्वामी की विंशोत्तरी महादशा में प्रवेश करता है। गुरु या शुक्र दशा स्थिर शुरुआत देती है, जबकि केतु या राहु दशा अस्थिरता सूचित कर सकती है। शेष अवधि भी महत्वपूर्ण है  –  गुरु दशा केवल 1 वर्ष शेष हो तो शीघ्र शनि में संक्रमण होगा।',
        sa: 'शिशुः जन्मसमये चन्द्रनक्षत्रस्वामिनो विंशोत्तरीमहादशां प्रविशति। गुरुशुक्रदशा स्थिरारम्भं ददाति, केतुराहुदशा अस्थिरतां सूचयति। शेषावधिः अपि महत्त्वपूर्णा।',
      },
    },
    {
      question: {
        en: 'How accurate is the 15-minute scanning window?',
        hi: '15 मिनट की स्कैनिंग विंडो कितनी सटीक है?',
        sa: 'पञ्चदशनिमेषस्कैनिंगविन्डो कियत् सूक्ष्मम्?',
      },
      answer: {
        en: 'The Ascendant (Lagna) moves approximately 1 degree every 4 minutes  –  so a 15-minute interval captures roughly 3.5–4 degrees of lagna movement. This is fine-grained enough to distinguish different lagna signs and avoid sandhi (junction) zones, while keeping the computation time reasonable for multi-day scans. The scorer also applies a 2-degree sandhi buffer penalty to flag slots where the lagna is too close to a sign boundary, ensuring the recommended time is not on an unstable cusp.',
        hi: 'लग्न लगभग हर 4 मिनट में 1 अंश चलता है  –  15 मिनट के अंतराल में लगभग 3.5-4 अंश का परिवर्तन होता है। यह विभिन्न लग्न राशियों को पहचानने और सन्धि क्षेत्रों से बचने के लिए पर्याप्त सूक्ष्म है। मूल्यांकक 2 अंश की सन्धि बफर कटौती भी लागू करता है।',
        sa: 'लग्नं प्रतिचतुर्निमेषं प्रायशः एकांशं चलति  –  पञ्चदशनिमेषान्तरेण ३.५-४ अंशाः परिवर्तन्ते। एतत् भिन्नलग्नराशीनां पहचानार्थं सन्धिक्षेत्रपरिहारार्थं च पर्याप्तसूक्ष्मम्।',
      },
    },
  ],

  // ─── /learn/vivah-muhurta ──────────────────────────────────
  '/learn/vivah-muhurta': [
    {
      question: {
        en: 'Which nakshatras are auspicious for Hindu marriage?',
        hi: 'हिन्दू विवाह के लिए कौन से नक्षत्र शुभ हैं?',
      },
      answer: {
        en: 'Eleven nakshatras are classically auspicious for marriage per the Muhurta Chintamani: Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Moola, Uttarashada, Uttara Bhadrapada, and Revati. Rohini, Uttara Phalguni, and Anuradha are considered the finest of these. Pushya  –  though the most auspicious nakshatra for almost everything else  –  is specifically avoided for first marriages.',
        hi: 'मुहूर्त चिंतामणि के अनुसार ग्यारह नक्षत्र विवाह के लिए शुभ हैं: रोहिणी, मृगशिरा, मघा, उत्तर फाल्गुनी, हस्त, स्वाति, अनुराधा, मूल, उत्तराषाढ़ा, उत्तर भाद्रपद और रेवती। रोहिणी, उत्तर फाल्गुनी और अनुराधा इनमें सर्वश्रेष्ठ माने जाते हैं।',
      },
    },
    {
      question: {
        en: 'Why are marriages not performed during Venus or Jupiter combustion?',
        hi: 'शुक्र या गुरु अस्त के दौरान विवाह क्यों नहीं किया जाता?',
      },
      answer: {
        en: 'Venus is the significator of love, romance, and marital harmony. Jupiter is the significator of marriage itself, dharma, and blessings. When either planet is combust (too close to the Sun and invisible), its energy is suppressed. BPHS specifies combustion orbs: Venus within 10 degrees of the Sun (8 degrees retrograde), Jupiter within 11 degrees. A marriage during combustion begins with its essential love or blessing energy already weakened.',
        hi: 'शुक्र प्रेम, रोमांस और वैवाहिक सामंजस्य का कारक है। गुरु स्वयं विवाह, धर्म और आशीर्वाद का कारक है। जब कोई भी ग्रह अस्त (सूर्य के बहुत निकट और अदृश्य) होता है, तो इसकी ऊर्जा दबी होती है। अस्त के दौरान विवाह अपनी प्रेम या आशीर्वाद ऊर्जा पहले से कमजोर होने के साथ शुरू होता है।',
      },
    },
    {
      question: {
        en: 'Which months are best for a Hindu wedding?',
        hi: 'हिन्दू विवाह के लिए कौन से महीने सर्वोत्तम हैं?',
      },
      answer: {
        en: 'Marriage muhurta uses solar months (Sun\'s zodiac sign). Six solar signs are permitted: Aries (Apr-May), Taurus (May-Jun), Gemini (Jun-Jul), Scorpio (Nov-Dec), Capricorn (Jan-Feb), and Aquarius (Feb-Mar). Cancer through Libra are prohibited due to monsoon energy, Sagittarius and Pisces are blocked by Kharmas (weakened Jupiter energy). This is universal regardless of North or South Indian calendar.',
        hi: 'विवाह मुहूर्त सौर मासों (सूर्य की राशि) का उपयोग करता है। छह सौर राशियाँ अनुमत हैं: मेष, वृषभ, मिथुन, वृश्चिक, मकर और कुम्भ। कर्क से तुला मानसून ऊर्जा के कारण, धनु और मीन खरमास (कमजोर गुरु ऊर्जा) के कारण निषिद्ध हैं।',
      },
    },
    {
      question: {
        en: 'What is the best lagna (ascendant) for a marriage ceremony?',
        hi: 'विवाह समारोह के लिए सबसे अच्छा लग्न कौन सा है?',
      },
      answer: {
        en: 'The three best lagnas for marriage are Gemini (communication, partnership), Virgo (service, practical harmony), and Libra (balance, Venus-ruled sign of partnership). Good alternatives include Taurus, Cancer, Sagittarius, and Pisces. The 7th house of the marriage lagna must be vacant  –  no malefics. Jupiter or Venus in or aspecting the lagna is the strongest blessing.',
        hi: 'विवाह के लिए तीन सर्वश्रेष्ठ लग्न हैं मिथुन (संवाद, साझेदारी), कन्या (सेवा, व्यावहारिक सामंजस्य), और तुला (संतुलन, शुक्र शासित साझेदारी की राशि)। विवाह लग्न का 7वाँ भाव खाली होना चाहिए  –  कोई पाप ग्रह नहीं।',
      },
    },
    {
      question: {
        en: 'Why is Tuesday avoided for Hindu weddings?',
        hi: 'मंगलवार को हिन्दू विवाह क्यों नहीं होते?',
      },
      answer: {
        en: 'Tuesday is ruled by Mars, the planet of aggression, conflict, and impulsive action. Marriages on Tuesday are classically associated with quarrels, heated arguments, and marital discord. This is one of the most widely observed prohibitions across all regional Hindu traditions. Thursday (Jupiter  –  marriage significator) and Friday (Venus  –  love) are the preferred weekdays.',
        hi: 'मंगलवार मंगल द्वारा शासित है  –  आक्रामकता, संघर्ष और आवेगी कार्रवाई का ग्रह। मंगलवार के विवाह शास्त्रीय रूप से झगड़ों और वैवाहिक कलह से जुड़े हैं। गुरुवार (गुरु  –  विवाह कारक) और शुक्रवार (शुक्र  –  प्रेम) पसंदीदा दिन हैं।',
      },
    },
    {
      question: {
        en: 'What is Godhuli Lagna and why is it special for marriage?',
        hi: 'गोधूलि लग्न क्या है और यह विवाह के लिए विशेष क्यों है?',
      },
      answer: {
        en: 'Godhuli Lagna is the 24-minute window around sunset when cows return home raising dust in the twilight. The Brihat Samhita considers it the most auspicious time for marriage. It evokes homecoming, domesticity, and warmth. This lagna transcends normal lagna rules  –  it is universally auspicious regardless of which zodiac sign is rising.',
        hi: 'गोधूलि लग्न सूर्यास्त के आसपास 24 मिनट की खिड़की है जब गायें धूल उड़ाती हुई घर लौटती हैं। बृहत् संहिता इसे विवाह के लिए सबसे शुभ समय मानती है। यह लग्न सामान्य लग्न नियमों से परे है  –  चाहे कोई भी राशि उदय हो रही हो, यह सार्वभौमिक रूप से शुभ है।',
      },
    },
  ],

  // ─── /vivah-muhurat/2026 ──────────────────────────────────
  '/vivah-muhurat/2026': [
    {
      question: {
        en: 'How many auspicious marriage dates are there in 2026?',
        hi: '2026 में कितनी शुभ विवाह तिथियाँ हैं?',
      },
      answer: {
        en: 'The number of auspicious marriage dates in 2026 varies by location due to sunrise-based lagna calculations. For most Indian cities, there are typically 40-60 dates scoring above 50 on our 36-rule classical Vedic scoring engine. Months with Venus or Jupiter combustion and the Chaturmas period (July-November) have significantly fewer or no eligible dates.',
        hi: '2026 में शुभ विवाह तिथियों की संख्या स्थान के अनुसार भिन्न है क्योंकि लग्न गणना सूर्योदय पर आधारित है। अधिकांश भारतीय शहरों के लिए हमारे 36-नियम वैदिक स्कोरिंग इंजन पर 50 से अधिक अंक प्राप्त करने वाली 40-60 तिथियाँ होती हैं। शुक्र/गुरु अस्त और चातुर्मास काल (जुलाई-नवम्बर) में बहुत कम या कोई तिथि नहीं होती।',
      },
    },
    {
      question: {
        en: 'Which months are best for marriage in 2026?',
        hi: '2026 में विवाह के लिए कौन से महीने सबसे अच्छे हैं?',
      },
      answer: {
        en: 'The best months for marriage in 2026 are typically January-June and November-December, outside the Chaturmas period (Devshayani to Prabodhini Ekadashi). Within these months, dates with fixed nakshatras (Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada) on Monday, Wednesday, Thursday, or Friday in Shukla Paksha score highest per Muhurta Chintamani.',
        hi: 'चातुर्मास काल (देवशयनी से प्रबोधिनी एकादशी) के बाहर जनवरी-जून और नवम्बर-दिसम्बर 2026 में विवाह के लिए सर्वोत्तम हैं। इनमें स्थिर नक्षत्रों (रोहिणी, उत्तरा फाल्गुनी, उत्तरा आषाढ़ा, उत्तरा भाद्रपद) पर शुक्ल पक्ष के सोमवार, बुधवार, गुरुवार या शुक्रवार सबसे ऊँचे अंक प्राप्त करते हैं।',
      },
    },
    {
      question: {
        en: 'Why are marriages avoided during Chaturmas?',
        hi: 'चातुर्मास में विवाह क्यों वर्जित है?',
      },
      answer: {
        en: 'Chaturmas is the four-month period from Devshayani Ekadashi to Prabodhini Ekadashi (typically July to November) during which Lord Vishnu is believed to be in cosmic sleep. The Dharmasindhu and other classical texts prohibit auspicious ceremonies including marriage during this period. Additionally, this period overlaps with the monsoon season, which historically made travel and outdoor ceremonies impractical.',
        hi: 'चातुर्मास देवशयनी एकादशी से प्रबोधिनी एकादशी तक (जुलाई से नवम्बर) का चार मास का काल है जब भगवान विष्णु योगनिद्रा में होते हैं। धर्मसिन्धु और अन्य शास्त्रीय ग्रन्थ इस काल में विवाह सहित शुभ कार्यों को वर्जित करते हैं।',
      },
    },
    {
      question: {
        en: 'What is Venus combustion and how does it affect marriage dates?',
        hi: 'शुक्र अस्त क्या है और यह विवाह तिथियों को कैसे प्रभावित करता है?',
      },
      answer: {
        en: 'Venus (Shukra) combustion occurs when Venus passes within 10 degrees of the Sun (8 degrees when retrograde), per BPHS. Since Venus is the karaka (significator) of marriage, love, and conjugal harmony, marriages performed during Venus combustion are considered inauspicious by all classical texts including Muhurta Chintamani. Our engine applies this as an absolute veto  –  no marriage muhurta is recommended during Venus combustion regardless of other factors.',
        hi: 'शुक्र अस्त तब होता है जब शुक्र सूर्य के 10 अंश (वक्री में 8 अंश) के भीतर आ जाता है (BPHS)। शुक्र विवाह, प्रेम और दाम्पत्य सुख का कारक होने के कारण शुक्र अस्त में विवाह मुहूर्त चिन्तामणि सहित सभी शास्त्रीय ग्रन्थों में अशुभ माना गया है। हमारा इंजन इसे पूर्ण निषेध के रूप में लागू करता है।',
      },
    },
    {
      question: {
        en: 'How is the marriage muhurta score calculated?',
        hi: 'विवाह मुहूर्त का अंक कैसे गणना किया जाता है?',
      },
      answer: {
        en: 'Each marriage muhurta is scored 0-100 using 36 classical rules from 7 texts (Muhurta Chintamani, Dharmasindhu, BPHS, Brihat Samhita, Prashna Marga, B.V. Raman, Kalaprakashika). The score combines: Panchanga factors (tithi, nakshatra, yoga, karana, vara  –  up to 25 points), planetary positions (up to 15), time quality including hora and choghadiya (up to 20), lagna strength (up to 12), and special yogas like Sarvartha Siddhi or Godhuli Lagna (up to 10). Scores above 72 are Excellent, 58-71 Good, and 50-57 Fair.',
        hi: 'प्रत्येक विवाह मुहूर्त का मूल्यांकन 7 ग्रन्थों से 36 शास्त्रीय नियमों से 0-100 अंकों पर किया जाता है। अंक में शामिल हैं: पंचांग कारक (तिथि, नक्षत्र, योग, करण, वार  –  25 अंक), ग्रह स्थिति (15), होरा-चौघड़िया सहित काल गुणवत्ता (20), लग्न बल (12), और विशेष योग जैसे सर्वार्थ सिद्धि या गोधूलि लग्न (10)। 72+ उत्तम, 58-71 शुभ, 50-57 ठीक।',
      },
    },
  ],

  // ─── /vivah-muhurat/2027 ──────────────────────────────────
  '/vivah-muhurat/2027': [
    {
      question: {
        en: 'How many auspicious marriage dates are there in 2027?',
        hi: '2027 में कितनी शुभ विवाह तिथियाँ हैं?',
      },
      answer: {
        en: 'The number of auspicious marriage dates in 2027 depends on your location. Our 36-rule engine typically finds 40-60 dates scoring 50+ for major Indian cities. Venus and Jupiter combustion periods, Chaturmas, and Kharmas reduce available dates in certain months.',
        hi: '2027 में शुभ विवाह तिथियाँ आपके स्थान पर निर्भर करती हैं। हमारा 36-नियम इंजन प्रमुख भारतीय शहरों के लिए 50+ अंक वाली 40-60 तिथियाँ खोजता है। शुक्र-गुरु अस्त, चातुर्मास और खरमास कुछ महीनों में उपलब्ध तिथियाँ कम करते हैं।',
      },
    },
    {
      question: {
        en: 'What classical texts are used to determine marriage muhurta?',
        hi: 'विवाह मुहूर्त निर्धारित करने के लिए कौन से शास्त्रीय ग्रन्थ उपयोग किए जाते हैं?',
      },
      answer: {
        en: 'Our marriage muhurta engine uses rules from seven classical texts: Muhurta Chintamani by Rama Daivagya, Dharmasindhu, Brihat Parashara Hora Shastra (BPHS), Brihat Samhita by Varahamihira, Prashna Marga, B.V. Raman\'s Muhurtha, and Kalaprakashika. These texts span from the 6th century CE (Brihat Samhita) to the 20th century (B.V. Raman), covering the complete classical consensus on marriage timing.',
        hi: 'हमारा विवाह मुहूर्त इंजन सात शास्त्रीय ग्रन्थों के नियमों का उपयोग करता है: राम दैवज्ञ की मुहूर्त चिन्तामणि, धर्मसिन्धु, बृहत् पराशर होरा शास्त्र (BPHS), वराहमिहिर की बृहत् संहिता, प्रश्न मार्ग, बी.वी. रमन की मुहूर्थ, और कालप्रकाशिका।',
      },
    },
    {
      question: {
        en: 'Can I find personalised marriage muhurta using my birth chart?',
        hi: 'क्या मैं अपनी जन्म कुण्डली से व्यक्तिगत विवाह मुहूर्त खोज सकता हूँ?',
      },
      answer: {
        en: 'Yes. Our Muhurta AI tool accepts your birth data (nakshatra and rashi) to add three personalised scoring dimensions: Tara Bala (compatibility between your birth nakshatra and the transit nakshatra), Chandra Bala (Moon\'s transit house strength from your birth rashi), and Dasha Harmony (alignment of your current Vimshottari dasha period with the activity). Visit the Muhurta AI page to enter your birth details for personalised marriage dates.',
        hi: 'हाँ। हमारा मुहूर्त AI उपकरण आपके जन्म डेटा (नक्षत्र और राशि) स्वीकार करता है और तीन व्यक्तिगत स्कोरिंग आयाम जोड़ता है: तारा बल, चन्द्र बल, और दशा सामंजस्य। व्यक्तिगत विवाह तिथियों के लिए मुहूर्त AI पृष्ठ पर अपने जन्म विवरण दर्ज करें।',
      },
    },
  ],

  // ─── /learn/lagna ────────────────────────────────────────────
  '/learn/lagna': [
    {
      question: {
        en: 'What is Lagna (Ascendant) in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में लग्न (उदय राशि) क्या है?',
      },
      answer: {
        en: 'Lagna is the zodiac sign rising on the eastern horizon at the exact moment and place of birth (or event). It determines the 1st house in a Vedic birth chart and all 12 houses rotate from it. The Lagna changes approximately every 2 hours, making it the most time-sensitive factor in a horoscope. In Sanskrit, "Lagna" means "that which is attached"  –  the sign attached to the eastern horizon at your first breath.',
        hi: 'लग्न जन्म (या घटना) के ठीक उस क्षण और स्थान पर पूर्वी क्षितिज पर उदित होने वाली राशि है। यह कुण्डली में प्रथम भाव निर्धारित करता है और सभी 12 भाव इससे घूमते हैं। लग्न लगभग हर 2 घण्टे में बदलता है, जिससे यह कुण्डली का सबसे समय-संवेदनशील कारक बनता है।',
      },
    },
    {
      question: {
        en: 'Why is Lagna important in Muhurta (auspicious timing)?',
        hi: 'मुहूर्त (शुभ समय) में लग्न क्यों महत्वपूर्ण है?',
      },
      answer: {
        en: 'In muhurta selection, the lagna is the rising sign at the START of the activity. Different lagnas favour different activities: fixed signs (Taurus, Leo, Scorpio, Aquarius) are best for permanent things like marriage and house construction; movable signs (Aries, Cancer, Libra, Capricorn) for travel and new ventures; and dual signs (Gemini, Virgo, Sagittarius, Pisces) for education and creative work. Classical texts like Muhurta Chintamani state that a strong lagna can compensate for minor panchanga doshas.',
        hi: 'मुहूर्त चयन में लग्न कार्य के आरम्भ समय पर उदित राशि है। भिन्न लग्न भिन्न कार्यों के लिए अनुकूल हैं: स्थिर राशियाँ स्थायी कार्यों के लिए, चर राशियाँ यात्रा के लिए, और द्विस्वभाव राशियाँ शिक्षा के लिए। मुहूर्त चिन्तामणि जैसे शास्त्रीय ग्रन्थ कहते हैं कि बलवान लग्न लघु पंचांग दोषों की क्षतिपूर्ति कर सकता है।',
      },
    },
    {
      question: {
        en: 'How is Lagna different from Sun sign and Moon sign?',
        hi: 'लग्न सूर्य राशि और चन्द्र राशि से कैसे भिन्न है?',
      },
      answer: {
        en: 'Your Sun sign (Surya Rashi) changes once a month and represents your soul and core identity. Your Moon sign (Chandra Rashi) changes every 2.25 days and reflects your mind and emotions. Your Lagna changes every ~2 hours and governs your physical body, appearance, temperament, and how the world perceives you. All three are important, but the Lagna is considered the most critical point in Vedic astrology because all 12 houses are counted from it.',
        hi: 'सूर्य राशि महीने में एक बार बदलती है और आत्मा का प्रतिनिधित्व करती है। चन्द्र राशि हर 2.25 दिन में बदलती है और मन को दर्शाती है। लग्न हर ~2 घण्टे में बदलता है और शरीर, रूप, स्वभाव को नियन्त्रित करता है। तीनों महत्वपूर्ण हैं, परन्तु लग्न सबसे निर्णायक माना जाता है क्योंकि सभी 12 भाव इसी से गिने जाते हैं।',
      },
    },
    {
      question: {
        en: 'Can a strong Lagna override inauspicious tithi or yoga in muhurta?',
        hi: 'क्या बलवान लग्न मुहूर्त में अशुभ तिथि या योग को ओवरराइड कर सकता है?',
      },
      answer: {
        en: 'Yes, classical texts (Muhurta Chintamani Chapter 4) state that a well-placed lagna can compensate for minor panchanga doshas. If the lagna sign is appropriate for the activity AND the lagna lord is strong (not combust, not in dusthana, not debilitated), it acts as a quality multiplier. However, major inauspicious periods like Rahu Kaal, Vishti Karana, or Venus/Jupiter combustion are hard vetoes that even a strong lagna cannot override.',
        hi: 'हाँ, शास्त्रीय ग्रन्थ (मुहूर्त चिन्तामणि अ. 4) कहते हैं कि सुस्थित लग्न लघु पंचांग दोषों की क्षतिपूर्ति कर सकता है। परन्तु राहु काल, विष्टि करण, या शुक्र/गुरु अस्त जैसी प्रमुख अशुभ अवधियाँ कठोर निषेध हैं जिन्हें बलवान लग्न भी ओवरराइड नहीं कर सकता।',
      },
    },
  ],

  // ─── /hindu-calendar/2026 ──────────────────────────────────
  '/hindu-calendar/2026': [
    {
      question: {
        en: 'When is Diwali in 2026?',
        hi: 'दीवाली 2026 में कब है?',
      },
      answer: {
        en: 'Diwali in 2026 falls on Thursday, 8 October 2026 (Kartika Krishna Amavasya). Dhanteras is on 6 October and Bhai Dooj on 10 October.',
        hi: '2026 में दीवाली गुरुवार, 8 अक्टूबर 2026 (कार्तिक कृष्ण अमावस्या) को है। धनतेरस 6 अक्टूबर और भाई दूज 10 अक्टूबर को है।',
      },
    },
    {
      question: {
        en: 'How many Ekadashi vrats are there in 2026?',
        hi: '2026 में कितनी एकादशी हैं?',
      },
      answer: {
        en: 'There are 24 Ekadashi vrat dates in 2026  –  two per lunar month (one in Shukla Paksha and one in Krishna Paksha). If an Adhika Masa (intercalary month) occurs, there may be 26 Ekadashis. Each Ekadashi has a specific name and significance from the Padma Purana.',
        hi: '2026 में 24 एकादशी व्रत तिथियाँ हैं  –  प्रत्येक चान्द्र मास में दो (एक शुक्ल पक्ष और एक कृष्ण पक्ष)। यदि अधिक मास आता है तो 26 एकादशी हो सकती हैं। प्रत्येक एकादशी का पद्म पुराण से विशेष नाम और महत्व है।',
      },
    },
    {
      question: {
        en: 'When is Holi in 2026?',
        hi: '2026 में होली कब है?',
      },
      answer: {
        en: 'Holi in 2026 falls on Wednesday, 4 March 2026 (Phalguna Purnima). Holika Dahan is observed on the evening of 3 March.',
        hi: '2026 में होली बुधवार, 4 मार्च 2026 (फाल्गुन पूर्णिमा) को है। होलिका दहन 3 मार्च की सन्ध्या को है।',
      },
    },
    {
      question: {
        en: 'When is Navratri in 2026?',
        hi: '2026 में नवरात्रि कब है?',
      },
      answer: {
        en: 'Sharad Navratri in 2026 begins on Wednesday, 30 September and ends on Thursday, 8 October (Dussehra/Vijayadashami). Chaitra Navratri begins on Thursday, 19 March 2026.',
        hi: '2026 में शारदीय नवरात्रि बुधवार, 30 सितम्बर से प्रारम्भ होकर गुरुवार, 8 अक्टूबर (दशहरा/विजयादशमी) तक है। चैत्र नवरात्रि गुरुवार, 19 मार्च 2026 से आरम्भ होती है।',
      },
    },
    {
      question: {
        en: 'What eclipses occur in 2026?',
        hi: '2026 में कौन-कौन से ग्रहण हैं?',
      },
      answer: {
        en: 'In 2026, there are two solar eclipses and two lunar eclipses. The exact dates and visibility depend on geographic location. Check the full eclipse calendar for Sutak timings and visibility details.',
        hi: '2026 में दो सूर्य ग्रहण और दो चन्द्र ग्रहण हैं। सटीक तिथियाँ और दृश्यता भौगोलिक स्थिति पर निर्भर करती हैं। सूतक काल और दृश्यता विवरण के लिए पूर्ण ग्रहण कैलेंडर देखें।',
      },
    },
  ],

  // ─── /hindu-calendar/2027 ──────────────────────────────────
  '/hindu-calendar/2027': [
    {
      question: {
        en: 'When is Diwali in 2027?',
        hi: 'दीवाली 2027 में कब है?',
      },
      answer: {
        en: 'Diwali in 2027 falls on Monday, 27 October 2027 (Kartika Krishna Amavasya). Dhanteras is on 25 October and Bhai Dooj on 29 October.',
        hi: '2027 में दीवाली सोमवार, 27 अक्टूबर 2027 (कार्तिक कृष्ण अमावस्या) को है। धनतेरस 25 अक्टूबर और भाई दूज 29 अक्टूबर को है।',
      },
    },
    {
      question: {
        en: 'How many Ekadashi vrats are there in 2027?',
        hi: '2027 में कितनी एकादशी हैं?',
      },
      answer: {
        en: 'There are 24 Ekadashi vrat dates in 2027  –  two per lunar month (one in Shukla Paksha and one in Krishna Paksha). Each Ekadashi has a unique name and spiritual significance from the Padma Purana and Bhavishya Purana.',
        hi: '2027 में 24 एकादशी व्रत तिथियाँ हैं  –  प्रत्येक चान्द्र मास में दो। प्रत्येक एकादशी का पद्म पुराण और भविष्य पुराण से अनन्य नाम और आध्यात्मिक महत्व है।',
      },
    },
    {
      question: {
        en: 'When is Holi in 2027?',
        hi: '2027 में होली कब है?',
      },
      answer: {
        en: 'Holi in 2027 falls on Monday, 22 March 2027 (Phalguna Purnima). Holika Dahan is observed on the evening of 21 March.',
        hi: '2027 में होली सोमवार, 22 मार्च 2027 (फाल्गुन पूर्णिमा) को है। होलिका दहन 21 मार्च की सन्ध्या को है।',
      },
    },
    {
      question: {
        en: 'When is Navratri in 2027?',
        hi: '2027 में नवरात्रि कब है?',
      },
      answer: {
        en: 'Sharad Navratri in 2027 begins on Monday, 18 October and ends on Tuesday, 26 October (Dussehra/Vijayadashami). Chaitra Navratri begins on Saturday, 6 March 2027.',
        hi: '2027 में शारदीय नवरात्रि सोमवार, 18 अक्टूबर से प्रारम्भ होकर मंगलवार, 26 अक्टूबर (दशहरा/विजयादशमी) तक है। चैत्र नवरात्रि शनिवार, 6 मार्च 2027 से आरम्भ होती है।',
      },
    },
    {
      question: {
        en: 'What eclipses occur in 2027?',
        hi: '2027 में कौन-कौन से ग्रहण हैं?',
      },
      answer: {
        en: 'In 2027, there are two solar eclipses and two lunar eclipses. A total lunar eclipse is expected to be visible from India. Check the full eclipse calendar for exact dates, Sutak timings, and visibility maps.',
        hi: '2027 में दो सूर्य ग्रहण और दो चन्द्र ग्रहण हैं। एक पूर्ण चन्द्र ग्रहण भारत से दृश्य होने की सम्भावना है। सटीक तिथियों, सूतक काल और दृश्यता मानचित्र के लिए पूर्ण ग्रहण कैलेंडर देखें।',
      },
    },
  ],

  // ─── /vs/prokerala ─────────────────────────────────────────────
  '/vs/prokerala': [
    {
      question: {
        en: 'Is Dekho Panchang more accurate than Prokerala?',
        hi: 'क्या देखो पंचांग प्रोकेरला से अधिक सटीक है?',
      },
      answer: {
        en: 'Dekho Panchang uses Swiss Ephemeris (NASA JPL DE441) which provides arc-second precision for planetary positions. Both platforms are accurate for basic panchang, but Dekho Panchang offers 11 ayanamsha systems and has been verified against multiple reference sources across 3+ timezones.',
        hi: 'देखो पंचांग Swiss Ephemeris (NASA JPL DE441) का उपयोग करता है जो ग्रह स्थितियों के लिए आर्क-सेकंड सटीकता प्रदान करता है। दोनों मंच मूल पंचांग के लिए सटीक हैं, लेकिन देखो पंचांग 11 अयनांश पद्धतियाँ प्रदान करता है।',
      },
    },
    {
      question: {
        en: 'What does Dekho Panchang have that Prokerala does not?',
        hi: 'देखो पंचांग में क्या है जो प्रोकेरला में नहीं?',
      },
      answer: {
        en: 'Dekho Panchang offers AI-powered birth chart interpretation (Tippanni), a 36-rule muhurta engine with classical cancellation logic, 150+ yoga detection (vs ~20), Shadbala/Ashtakavarga analysis, 15+ dasha systems, KP System, Jaimini System, and a structured learning curriculum. All features are free without registration.',
        hi: 'देखो पंचांग AI-संचालित जन्म कुण्डली व्याख्या (टिप्पणी), 36-नियम मुहूर्त इंजन, 150+ योग पहचान (vs ~20), षड्बल/अष्टकवर्ग विश्लेषण, 15+ दशा प्रणालियाँ, केपी पद्धति, जैमिनी पद्धति और संरचित शिक्षण पाठ्यक्रम प्रदान करता है।',
      },
    },
    {
      question: {
        en: 'Is Dekho Panchang free like Prokerala?',
        hi: 'क्या देखो पंचांग प्रोकेरला की तरह मुफ़्त है?',
      },
      answer: {
        en: 'Yes. All core features on Dekho Panchang are completely free with no registration required. AI-powered features (chart chat, muhurta AI) have small daily usage limits. Unlike Prokerala, Dekho Panchang has zero ads in core features.',
        hi: 'हाँ। देखो पंचांग की सभी मुख्य सुविधाएँ बिना पंजीकरण के पूरी तरह मुफ़्त हैं। AI-संचालित सुविधाओं की छोटी दैनिक उपयोग सीमाएँ हैं। प्रोकेरला के विपरीत, देखो पंचांग में मुख्य सुविधाओं में शून्य विज्ञापन हैं।',
      },
    },
  ],

  // ─── /vs/astrosage ─────────────────────────────────────────────
  '/vs/astrosage': [
    {
      question: {
        en: 'How is Dekho Panchang different from AstroSage?',
        hi: 'देखो पंचांग एस्ट्रोसेज से कैसे भिन्न है?',
      },
      answer: {
        en: 'AstroSage is a content-first platform with thousands of articles and predictions. Dekho Panchang is computation-first: every value is computed live from Swiss Ephemeris planetary positions with documented, open methodology. Dekho Panchang also offers AI-powered interpretation, a 36-rule muhurta engine, and 150+ yoga detection  –  features AstroSage does not have.',
        hi: 'एस्ट्रोसेज हज़ारों लेखों और भविष्यवाणियों वाला सामग्री-प्रथम मंच है। देखो पंचांग गणना-प्रथम है: हर मान Swiss Ephemeris ग्रह स्थितियों से सीधे गणना किया जाता है। देखो पंचांग AI व्याख्या, 36-नियम मुहूर्त इंजन और 150+ योग पहचान भी प्रदान करता है।',
      },
    },
    {
      question: {
        en: 'Do I need to create an account on Dekho Panchang like AstroSage?',
        hi: 'क्या मुझे एस्ट्रोसेज की तरह देखो पंचांग पर खाता बनाना होगा?',
      },
      answer: {
        en: 'No. All core features  –  kundali generation, panchang, matching, muhurta  –  work without any registration. Only AI-powered features (chart chat, muhurta AI) require a free account for usage tracking.',
        hi: 'नहीं। सभी मुख्य सुविधाएँ  –  कुण्डली, पंचांग, मिलान, मुहूर्त  –  बिना किसी पंजीकरण के काम करती हैं। केवल AI-संचालित सुविधाओं के लिए मुफ़्त खाता आवश्यक है।',
      },
    },
    {
      question: {
        en: 'Is Dekho Panchang ad-free?',
        hi: 'क्या देखो पंचांग विज्ञापन-मुक्त है?',
      },
      answer: {
        en: 'Yes. Dekho Panchang has zero advertisements in all core features. AstroSage relies heavily on ad revenue, which affects page speed and user experience. Dekho Panchang is built on Next.js 16 with edge caching for fast load times.',
        hi: 'हाँ। देखो पंचांग की सभी मुख्य सुविधाओं में शून्य विज्ञापन हैं। एस्ट्रोसेज विज्ञापन राजस्व पर निर्भर है, जो पृष्ठ गति और उपयोगकर्ता अनुभव को प्रभावित करता है।',
      },
    },
    {
      question: {
        en: 'Does AstroSage have better predictions than Dekho Panchang?',
        hi: 'क्या एस्ट्रोसेज की भविष्यवाणियाँ देखो पंचांग से बेहतर हैं?',
      },
      answer: {
        en: 'AstroSage uses template-based predictions (generic text per planet/sign). Dekho Panchang uses AI-powered interpretation that analyses YOUR specific chart  –  considering planet positions, dasha periods, yogas, and aspects together. The result is personalised narrative commentary rather than generic one-size-fits-all text.',
        hi: 'एस्ट्रोसेज टेम्पलेट-आधारित भविष्यवाणियाँ (प्रति ग्रह/राशि सामान्य पाठ) उपयोग करता है। देखो पंचांग AI-संचालित व्याख्या करता है जो आपकी विशिष्ट कुण्डली का विश्लेषण करता है।',
      },
    },
  ],

  // ─── /vs/mpanchang ─────────────────────────────────────────────
  '/vs/mpanchang': [
    {
      question: {
        en: 'Can I use Dekho Panchang without downloading an app?',
        hi: 'क्या मैं ऐप डाउनलोड किए बिना देखो पंचांग का उपयोग कर सकता हूँ?',
      },
      answer: {
        en: 'Yes. Dekho Panchang is fully web-based and works in any browser. You can also install it as a PWA (Progressive Web App) for home screen access and offline support  –  no app store download required. mPanchang primarily requires a native app download.',
        hi: 'हाँ। देखो पंचांग पूरी तरह वेब-आधारित है और किसी भी ब्राउज़र में काम करता है। आप इसे PWA के रूप में भी इंस्टॉल कर सकते हैं  –  ऐप स्टोर डाउनलोड की आवश्यकता नहीं।',
      },
    },
    {
      question: {
        en: 'Does Dekho Panchang have daily notifications like mPanchang?',
        hi: 'क्या देखो पंचांग में एमपंचांग जैसी दैनिक सूचनाएं हैं?',
      },
      answer: {
        en: 'Yes. Dekho Panchang sends daily panchang emails and supports PWA push notifications. In addition to notifications, Dekho Panchang offers a full kundali generator, muhurta AI, matching, and learning curriculum  –  features that go far beyond what mPanchang provides.',
        hi: 'हाँ। देखो पंचांग दैनिक पंचांग ईमेल भेजता है और PWA पुश नोटिफिकेशन का समर्थन करता है। सूचनाओं के अलावा, देखो पंचांग पूर्ण कुण्डली जनरेटर, मुहूर्त AI, मिलान और शिक्षण पाठ्यक्रम प्रदान करता है।',
      },
    },
    {
      question: {
        en: 'What makes Dekho Panchang better than mPanchang for kundali?',
        hi: 'कुण्डली के लिए देखो पंचांग एमपंचांग से बेहतर क्यों है?',
      },
      answer: {
        en: 'mPanchang offers basic kundali features. Dekho Panchang provides a complete kundali experience: 16 Varga charts, Shadbala and Bhavabala analysis, Ashtakavarga heatmaps, 150+ yoga detection, 15+ dasha systems, KP System, Jaimini System, AI-powered interpretation, and a premium PDF report  –  all free.',
        hi: 'एमपंचांग मूल कुण्डली सुविधाएँ प्रदान करता है। देखो पंचांग पूर्ण कुण्डली अनुभव देता है: 16 वर्ग चार्ट, षड्बल और भावबल विश्लेषण, अष्टकवर्ग हीटमैप, 150+ योग पहचान, 15+ दशा प्रणालियाँ, केपी पद्धति, जैमिनी पद्धति, AI व्याख्या और प्रीमियम PDF रिपोर्ट  –  सब मुफ़्त।',
      },
    },
  ],

  // ─── /muhurta/travel ────────────────────────────────────────
  '/muhurta/travel': [
    {
      question: {
        en: 'What is the next auspicious date for travel in 2026?',
        hi: '2026 में यात्रा के लिए अगला शुभ मुहूर्त कब है?',
        sa: '2026 तमे वर्षे यात्रायाः कृते अग्रिमः शुभमुहूर्तः कः अस्ति?',
      },
      answer: {
        en: 'Auspicious travel dates in 2026 depend on your location and travel date. Dekho Panchang\'s muhurta engine evaluates Tithi, Nakshatra, weekday, and planetary positions to find the best travel windows. Generally, Pushya, Rohini, Hasta, Ashwini, and Mrigashira nakshatras combined with Monday, Wednesday, Thursday, or Friday yield the strongest travel muhurtas.',
        hi: '2026 में यात्रा के शुभ मुहूर्त आपके स्थान और तिथि पर निर्भर करते हैं। देखो पंचांग का मुहूर्त इंजन तिथि, नक्षत्र, वार और ग्रह स्थिति का आकलन करके सर्वोत्तम यात्रा काल निकालता है। सामान्यतः पुष्य, रोहिणी, हस्त, अश्विनी और मृगशिरा नक्षत्र तथा सोम, बुध, गुरु या शुक्रवार सर्वोत्तम यात्रा मुहूर्त देते हैं।',
        sa: '2026 तमे वर्षे यात्राशुभमुहूर्ताः भवतः स्थानतिथिविशेषयोः आश्रिताः। देखो-पञ्चाङ्गस्य मुहूर्तयन्त्रं तिथिं नक्षत्रं वारं ग्रहस्थितिं च विचार्य सर्वोत्तमयात्राकालखण्डानि निर्धारयति। सामान्यतः पुष्यरोहिणीहस्ताश्विनीमृगशीर्षनक्षत्राणि सोमबुधगुरुशुक्रवासरैश्च मिलित्वा श्रेष्ठयात्रामुहूर्तान् ददति।',
      },
    },
    {
      question: {
        en: 'How is travel muhurat calculated?',
        hi: 'यात्रा मुहूर्त की गणना कैसे होती है?',
        sa: 'यात्रामुहूर्तस्य गणना कथं क्रियते?',
      },
      answer: {
        en: 'Travel muhurta is calculated by checking the Tithi (avoiding Rikta Tithis 4, 9, 14), Nakshatra (whitelisted nakshatras for travel), weekday (Tuesday and Saturday are avoided), Chandra Bala (Moon\'s relationship to birth Moon sign), and inauspicious periods like Rahu Kaal and Yamaganda. A strong Lagna at the time of departure further reinforces the muhurta.',
        hi: 'यात्रा मुहूर्त की गणना में तिथि (रिक्ता तिथियाँ 4, 9, 14 वर्जित), नक्षत्र (यात्रा के लिए श्वेतसूचीबद्ध नक्षत्र), वार (मंगल और शनिवार वर्जित), चन्द्रबल और राहु काल, यमगण्ड जैसी अशुभ अवधियाँ देखी जाती हैं। प्रस्थान के समय बलवान लग्न मुहूर्त को और दृढ़ करता है।',
        sa: 'यात्रामुहूर्तगणने तिथिः (रिक्तातिथयः ४,९,१४ वर्ज्याः), नक्षत्रम् (यात्रायाः श्वेतसूचीनक्षत्राणि), वारः (मङ्गल-शनिवासरौ वर्ज्यौ), चन्द्रबलं, राहुकाल-यमगण्डादयः अशुभकालाश्च परीक्ष्यन्ते। प्रस्थानसमये बलवल्लग्नं मुहूर्तं पुनर्बलयति।',
      },
    },
    {
      question: {
        en: 'Which nakshatra is best for travel?',
        hi: 'यात्रा के लिए कौन सा नक्षत्र सबसे अच्छा है?',
        sa: 'यात्रायाः कृते कतमत् नक्षत्रं सर्वोत्तमम्?',
      },
      answer: {
        en: 'The best nakshatras for travel are Pushya (9), Rohini (4), Hasta (13), Ashwini (1), and Mrigashira (5). Punarvasu (7) and Revati (27) are also auspicious for long journeys. Avoid travel on Bharani (2), Krittika (3), Ardra (6), Ashlesha (9), Jyeshtha (18), and Moola (19) nakshatras, which are generally inauspicious for new beginnings.',
        hi: 'यात्रा के लिए सर्वोत्तम नक्षत्र हैं: पुष्य (9), रोहिणी (4), हस्त (13), अश्विनी (1) और मृगशिरा (5)। पुनर्वसु (7) और रेवती (27) भी लम्बी यात्राओं के लिए शुभ हैं। भरणी, कृत्तिका, आर्द्रा, आश्लेषा, ज्येष्ठा और मूल नक्षत्रों में यात्रा से बचें।',
        sa: 'यात्रायाः कृते सर्वोत्तमानि नक्षत्राणि: पुष्यः (9), रोहिणी (4), हस्तः (13), अश्विनी (1), मृगशीर्षं (5) च। पुनर्वसुः (7) रेवती (27) च दीर्घयात्राभ्यः शुभे। भरणी-कृत्तिका-आर्द्रा-आश्लेषा-ज्येष्ठा-मूलनक्षत्रेषु यात्रा वर्जनीया।',
      },
    },
  ],

  // ─── /muhurta/annaprashan ───────────────────────────────────
  '/muhurta/annaprashan': [
    {
      question: {
        en: 'What is the best month for Annaprashan in 2026?',
        hi: '2026 में अन्नप्राशन के लिए सबसे अच्छा महीना कौन सा है?',
        sa: '2026 तमे वर्षे अन्नप्राशनस्य कृते उत्तमः मासः कः?',
      },
      answer: {
        en: 'Auspicious months for Annaprashan in 2026 are Vaishakha (April–May), Jyeshtha (May–June), Ashwina (September–October), and Kartika (October–November). These months are generally free from Adhika Masa (intercalary months) and solar ingress restrictions. The actual date selection must also consider the child\'s Chandra Rashi, Tithi, and Nakshatra for a fully auspicious muhurta.',
        hi: '2026 में अन्नप्राशन के लिए शुभ माह हैं: वैशाख (अप्रैल-मई), ज्येष्ठ (मई-जून), आश्विन (सितम्बर-अक्टूबर) और कार्तिक (अक्टूबर-नवम्बर)। इन महीनों में सामान्यतः अधिक मास और सूर्य राशि परिवर्तन की बाधा नहीं होती। वास्तविक तिथि चयन के लिए बच्चे की चन्द्र राशि, तिथि और नक्षत्र भी देखने चाहिए।',
        sa: '2026 तमे वर्षे अन्नप्राशनस्य कृते शुभमासाः: वैशाखः (अप्रैल-मई), ज्येष्ठः (मई-जून), आश्विनः (सितम्बर-अक्टूबर), कार्तिकः (अक्टूबर-नवम्बर) च। एतेषु मासेषु सामान्यतः अधिकमास-सूर्यसंक्रान्तिरोधाः न भवन्ति। वास्तविकतिथिचयने बालकस्य चन्द्रराशिः तिथिः नक्षत्रं च विचार्यम्।',
      },
    },
    {
      question: {
        en: 'What is Annaprashan ceremony?',
        hi: 'अन्नप्राशन संस्कार क्या है?',
        sa: 'अन्नप्राशनसंस्कारः कः?',
      },
      answer: {
        en: 'Annaprashan (also called Choroonu or Mukhe Bhaat) is the Vedic ceremony of introducing solid food to a baby, typically performed when the child is 6 months old (boys) or 5–7 months (girls). It is the sixth of the sixteen Shodasha Samskaras. The ceremony involves offering the first cooked rice or kheer (sweet rice pudding) to the child in the presence of family and priests, accompanied by Vedic mantras.',
        hi: 'अन्नप्राशन (चोरोनु या मुखे भात भी कहते हैं) शिशु को पहली बार ठोस आहार देने का वैदिक संस्कार है, जो सामान्यतः लड़कों के लिए 6 माह और लड़कियों के लिए 5-7 माह में किया जाता है। यह षोडश संस्कारों में छठा संस्कार है। परिवार और पुरोहितों की उपस्थिति में वैदिक मन्त्रों के साथ बच्चे को पहली बार पके चावल या खीर दी जाती है।',
        sa: 'अन्नप्राशनसंस्कारः (चोरोनु मुखेभाताख्यः) शिशोः प्रथमाशनग्रहणस्य वैदिकः संस्कारः अस्ति, सामान्यतः पुंशिशोः षष्ठे मासे कन्याशिशोः पञ्चमे-सप्तमे वा मासे आचर्यते। षोडशसंस्काराणां मध्ये षष्ठः संस्कारः। परिवारपुरोहितानां समक्षं वैदिकमन्त्रैः शिशवे प्रथमशृतान्नं खीरं वा दीयते।',
      },
    },
    {
      question: {
        en: 'Which nakshatra is auspicious for Annaprashan?',
        hi: 'अन्नप्राशन के लिए कौन सा नक्षत्र शुभ है?',
        sa: 'अन्नप्राशनस्य कृते कतमत् नक्षत्रं शुभम्?',
      },
      answer: {
        en: 'The most auspicious nakshatras for Annaprashan are Rohini (4), Mrigashira (5), Pushya (8), Uttara Phalguni (12), Hasta (13), Chitra (14), Swati (15), Anuradha (17), Uttara Ashadha (21), Shravana (22), Dhanishtha (23), and Uttara Bhadrapada (26). These are classified as Sthira (fixed) or Mridu (soft) nakshatras ideal for samskaras involving the child\'s nourishment.',
        hi: 'अन्नप्राशन के लिए सर्वोत्तम नक्षत्र हैं: रोहिणी, मृगशिरा, पुष्य, उत्तरा फाल्गुनी, हस्त, चित्रा, स्वाती, अनुराधा, उत्तराषाढ़ा, श्रवण, धनिष्ठा और उत्तरा भाद्रपद। ये स्थिर या मृदु नक्षत्र हैं जो शिशु के पोषण से जुड़े संस्कारों के लिए आदर्श हैं।',
        sa: 'अन्नप्राशनस्य कृते सर्वोत्तमानि नक्षत्राणि: रोहिणी, मृगशीर्षं, पुष्यः, उत्तरफाल्गुनी, हस्तः, चित्रा, स्वाती, अनुराधा, उत्तराषाढ़ा, श्रवणः, धनिष्ठा, उत्तरभाद्रपदा च। एतानि स्थिरमृदुनक्षत्राणि शिशुपोषणसंस्काराय आदर्शानि।',
      },
    },
  ],

  // ─── /muhurta/upanayana ─────────────────────────────────────
  '/muhurta/upanayana': [
    {
      question: {
        en: 'When is the next Upanayana muhurat in 2026?',
        hi: '2026 में अगला उपनयन मुहूर्त कब है?',
        sa: '2026 तमे वर्षे अग्रिमः उपनयनमुहूर्तः कदा?',
      },
      answer: {
        en: 'Upanayana is traditionally performed in the bright fortnight (Shukla Paksha) of Magha, Phalguna, Vaishakha, or Jyeshtha months. For 2026, auspicious windows fall in February (Magha Shukla), March–April (Phalguna/Chaitra Shukla), and May (Vaishakha Shukha). Use Dekho Panchang\'s muhurta tool with the Upanayana activity to find exact dates for your location.',
        hi: '2026 में उपनयन के लिए शुभ समय माघ, फाल्गुन, वैशाख और ज्येष्ठ के शुक्ल पक्ष में है। 2026 के लिए फरवरी (माघ शुक्ल), मार्च-अप्रैल (फाल्गुन/चैत्र शुक्ल) और मई (वैशाख शुक्ल) में शुभ काल हैं। अपने स्थान के लिए सटीक तिथियाँ जानने के लिए देखो पंचांग के मुहूर्त उपकरण में उपनयन गतिविधि चुनें।',
        sa: '2026 तमे वर्षे उपनयनस्य कृते शुभकालः माघ-फाल्गुन-वैशाख-ज्येष्ठमासानां शुक्लपक्षे। 2026 तमे वर्षे फेब्रुवरी (माघशुक्ल), मार्च-अप्रैल (फाल्गुन-चैत्रशुक्ल), मई (वैशाखशुक्ल) च शुभखण्डाः। स्वस्थानस्य कृते सूक्ष्मतिथिः ज्ञातुं देखो-पञ्चाङ्गे उपनयनं चित्वा मुहूर्तसाधनम् उपयुज्यताम्।',
      },
    },
    {
      question: {
        en: 'What is Upanayana (Janeu) ceremony?',
        hi: 'उपनयन (जनेऊ) संस्कार क्या है?',
        sa: 'उपनयन (यज्ञोपवीत) संस्कारः कः?',
      },
      answer: {
        en: 'Upanayana (also called Yagnopavita or Janeu ceremony) is the Vedic initiation ceremony where a young boy is invested with the sacred thread (Yagnopavita) and formally initiated into Vedic learning. It is the tenth of the sixteen Shodasha Samskaras. The ceremony marks the beginning of Brahmacharya and the study of the Vedas under a guru, symbolising a second birth (Dvija — twice-born).',
        hi: 'उपनयन (यज्ञोपवीत या जनेऊ संस्कार) वैदिक दीक्षा संस्कार है जिसमें बालक को पवित्र धागा (यज्ञोपवीत) पहनाया जाता है और वेद अध्ययन की शुरुआत होती है। यह षोडश संस्कारों में दसवाँ संस्कार है। यह ब्रह्मचर्य आरम्भ और गुरु के सानिध्य में वेद अध्ययन का प्रतीक है — द्विज (दो बार जन्मे) की उपाधि इसी से मिलती है।',
        sa: 'उपनयनसंस्कारः (यज्ञोपवीतसंस्कारः) बालकस्य यज्ञोपवीतधारणेन वैदिकविद्यायां दीक्षायाः संस्कारः अस्ति। षोडशसंस्काराणां मध्ये दशमः। ब्रह्मचर्यारम्भस्य गुरोः सन्निधौ वेदाध्ययनस्य च सूचकः, द्विजत्वं (द्विर्जनिः) दर्शयति।',
      },
    },
    {
      question: {
        en: 'At what age should Upanayana be performed?',
        hi: 'उपनयन संस्कार किस उम्र में करना चाहिए?',
        sa: 'कस्यां वयसि उपनयनसंस्कारः करणीयः?',
      },
      answer: {
        en: 'According to classical Vedic texts, the ideal age for Upanayana differs by varna: Brahmins between 8 and 16 years (ideally in the 8th year from birth), Kshatriyas between 11 and 22, and Vaishyas between 12 and 24. In contemporary practice, 7–12 years is the most common range. The ceremony should be performed before marriage.',
        hi: 'शास्त्रानुसार उपनयन की आदर्श आयु वर्ण के अनुसार भिन्न है: ब्राह्मण 8 से 16 वर्ष (आदर्शतः 8वें वर्ष में), क्षत्रिय 11 से 22 और वैश्य 12 से 24 वर्ष। समकालीन प्रथा में 7-12 वर्ष सर्वाधिक प्रचलित है। विवाह से पूर्व संस्कार होना आवश्यक है।',
        sa: 'शास्त्रानुसारम् उपनयनस्य आदर्शवयः वर्णभेदेन: ब्राह्मणाय अष्टषोडशवर्षयोः (आदर्शतः अष्टमे वर्षे), क्षत्रियाय एकादश-द्वाविंशतिवर्षयोः, वैश्याय द्वादश-चतुर्विंशतिवर्षयोः। समकालीनप्रथायाम् सप्ततः द्वादशवर्षपर्यन्तं सर्वाधिकं प्रचलितम्। विवाहात् पूर्वं संस्कारः आवश्यकः।',
      },
    },
  ],

  // ─── /muhurta/mundan ────────────────────────────────────────
  '/muhurta/mundan': [
    {
      question: {
        en: 'What is the best age for Mundan ceremony?',
        hi: 'मुंडन संस्कार के लिए सबसे अच्छी उम्र क्या है?',
        sa: 'मुण्डनसंस्कारस्य कृते उत्तमा वयः का?',
      },
      answer: {
        en: 'According to Vedic tradition, Mundan (Chudakarana) should be performed in the child\'s first or third year of life. The first year Mundan should occur before the child turns one; the third year Mundan is performed in the odd months (1st, 3rd, 5th or 7th month) of the third year. Some communities also observe it in the fifth or seventh year. Avoid even years and even months for the ceremony.',
        hi: 'वैदिक परम्परा के अनुसार मुंडन (चूड़ाकरण) शिशु के पहले या तीसरे वर्ष में करना चाहिए। पहले वर्ष का मुंडन एक वर्ष पूर्ण होने से पहले, तीसरे वर्ष का मुंडन तीसरे वर्ष के विषम महीनों (1, 3, 5 या 7वें माह) में किया जाता है। कुछ समुदाय पाँचवें या सातवें वर्ष में भी करते हैं। सम वर्ष और सम महीनों से बचें।',
        sa: 'वैदिकपरम्परानुसारं मुण्डनसंस्कारः (चूड़ाकरणसंस्कारः) शिशोः प्रथमे वा तृतीये वर्षे करणीयः। प्रथमवर्षे एकवर्षपूर्तेः प्राक्; तृतीयवर्षे तृतीयवर्षस्य विषमेषु मासेषु (१, ३, ५, ७तमे मासे)। केचन समुदायाः पञ्चमे सप्तमे वा वर्षेऽपि कुर्वन्ति। समसंख्यावर्षमासावुभौ वर्जनीयौ।',
      },
    },
    {
      question: {
        en: 'Which month is auspicious for Mundan in 2026?',
        hi: '2026 में मुंडन के लिए कौन सा महीना शुभ है?',
        sa: '2026 तमे वर्षे मुण्डनस्य कृते कः मासः शुभः?',
      },
      answer: {
        en: 'Auspicious months for Mundan in 2026 are Vaishakha (April–May), Jyeshtha (May–June), Magha (January–February), and Phalguna (February–March). These months fall during the Uttarayana (northward solar journey) period or just before it, which is preferred for samskara ceremonies. Avoid performing Mundan during Adhika Masa (intercalary month), Pitru Paksha, and the four months of Chaturmas.',
        hi: '2026 में मुंडन के लिए शुभ माह हैं: वैशाख (अप्रैल-मई), ज्येष्ठ (मई-जून), माघ (जनवरी-फरवरी) और फाल्गुन (फरवरी-मार्च)। ये माह उत्तरायण काल में या उसके निकट होते हैं जो संस्कार कार्यों के लिए पसन्दीदा हैं। अधिक मास, पितृ पक्ष और चातुर्मास में मुंडन न करें।',
        sa: '2026 तमे वर्षे मुण्डनस्य कृते शुभमासाः: वैशाखः (अप्रैल-मई), ज्येष्ठः (मई-जून), माघः (जनवरी-फेब्रुवरी), फाल्गुनः (फेब्रुवरी-मार्च) च। एते मासाः उत्तरायणकाले तद्समीपे वा पतन्ति यत् संस्कारकार्येभ्यः प्रशस्तम्। अधिकमासे पितृपक्षे चातुर्मासे च मुण्डनं न कर्तव्यम्।',
      },
    },
    {
      question: {
        en: 'What is the significance of Mundan ceremony?',
        hi: 'मुंडन संस्कार का क्या महत्व है?',
        sa: 'मुण्डनसंस्कारस्य किं महत्त्वम्?',
      },
      answer: {
        en: 'Mundan (Chudakarana) is the third of the sixteen Vedic Shodasha Samskaras. It involves the ritual shaving of a child\'s hair for the first time. Spiritually, it symbolises the removal of impurities from a previous life and the renewal of the child\'s life force. The hair grown in the womb is considered to carry karmic residues; its removal through this ceremony is believed to purify the child\'s energy and ensure a healthy, auspicious life.',
        hi: 'मुंडन (चूड़ाकरण) षोडश वैदिक संस्कारों में तीसरा संस्कार है। इसमें पहली बार शिशु के बाल मुंडवाए जाते हैं। आध्यात्मिक दृष्टि से यह पिछले जन्म की अशुद्धियों के निष्कासन और शिशु की जीवनशक्ति के नवीनीकरण का प्रतीक है। गर्भ में उगे बालों में कार्मिक अवशेष माने जाते हैं; इस संस्कार से उनके निष्कासन से शिशु की ऊर्जा शुद्ध होती है।',
        sa: 'मुण्डनसंस्कारः (चूड़ाकरणसंस्कारः) षोडशवैदिकसंस्काराणां तृतीयः। अस्मिन् प्रथमवारं शिशोः केशानां क्षौरं क्रियते। आध्यात्मिकदृष्ट्या पूर्वजन्मावशिष्टमलानां निष्कासनं शिशोर्जीवनशक्तेः नवीकरणं च संकेतयति। गर्भजनितकेशेषु कार्मिकावशेषाः सन्ति इति मन्यते; तेषां निष्कासनेन शिशोः ऊर्जाशुद्धिः जायते।',
      },
    },
  ],

  // ─── /muhurta/griha-pravesh ─────────────────────────────────
  '/muhurta/griha-pravesh': [
    {
      question: {
        en: 'What is the next auspicious date for Griha Pravesh in 2026?',
        hi: '2026 में गृह प्रवेश के लिए अगला शुभ मुहूर्त कब है?',
        sa: '2026 तमे वर्षे गृहप्रवेशस्य कृते अग्रिमः शुभमुहूर्तः कः?',
      },
      answer: {
        en: 'Griha Pravesh muhurtas in 2026 are available in January–February (Magha Shukla), April–May (Vaishakha Shukla), June (Jyeshtha Shukla), and October–November (Kartik Shukla). Chaturmas (July–October) and Adhika Masa periods are generally avoided. Use Dekho Panchang\'s Griha Pravesh muhurta tool with your location to find the nearest auspicious window.',
        hi: '2026 में गृह प्रवेश के शुभ मुहूर्त जनवरी-फरवरी (माघ शुक्ल), अप्रैल-मई (वैशाख शुक्ल), जून (ज्येष्ठ शुक्ल) और अक्टूबर-नवम्बर (कार्तिक शुक्ल) में हैं। चातुर्मास (जुलाई-अक्टूबर) और अधिक मास में सामान्यतः गृह प्रवेश नहीं किया जाता। अपने स्थान के लिए निकटतम शुभ खिड़की जानने के लिए देखो पंचांग का गृह प्रवेश मुहूर्त उपकरण उपयोग करें।',
        sa: '2026 तमे वर्षे गृहप्रवेशमुहूर्ताः जनवरी-फेब्रुवरी (माघशुक्ल), अप्रैल-मई (वैशाखशुक्ल), जून (ज्येष्ठशुक्ल), अक्टूबर-नवम्बर (कार्तिकशुक्ल) च उपलब्धाः। चातुर्मास (जुलाई-अक्टूबर) अधिकमासे च सामान्यतः गृहप्रवेशः न क्रियते। स्वस्थानस्य कृते समीपतमशुभखण्डः ज्ञातुं देखो-पञ्चाङ्गस्य गृहप्रवेशमुहूर्तसाधनम् उपयुज्यताम्।',
      },
    },
    {
      question: {
        en: 'What should be done during Griha Pravesh?',
        hi: 'गृह प्रवेश में क्या करना चाहिए?',
        sa: 'गृहप्रवेशे किं करणीयम्?',
      },
      answer: {
        en: 'During Griha Pravesh, the family enters the new home at the auspicious muhurta time. Key rituals include: Vastu Puja (prayer to the deity of the dwelling), Havan (fire ceremony) for purification, Kalash Sthapana (pot of water with mango leaves symbolising prosperity), cow and calf entry as a blessing, lighting of the sacred fire in the kitchen, and the wife entering carrying rice, symbolising abundance. The head of the family should enter first.',
        hi: 'गृह प्रवेश में शुभ मुहूर्त पर परिवार नए घर में प्रवेश करता है। प्रमुख अनुष्ठान: वास्तु पूजा (गृहदेव की पूजा), हवन (शुद्धिकरण के लिए), कलश स्थापना (आम के पत्तों वाला जल कलश), गाय-बछड़े का प्रवेश (आशीर्वाद हेतु), रसोई में पवित्र अग्नि प्रज्वलन और गृहिणी का चावल लेकर प्रवेश (समृद्धि का प्रतीक)। परिवार के मुखिया को प्रथम प्रवेश करना चाहिए।',
        sa: 'गृहप्रवेशे शुभमुहूर्ते परिवारः नवगृहं प्रविशति। प्रमुखाः अनुष्ठानाः: वास्तुपूजा (गृहदेवतार्चनम्), हवनम् (शुद्धिकरणाय), कलशस्थापना (आम्रपर्णजलकलशः), गोवत्सप्रवेशः (आशीर्वादाय), रन्धनागारे पवित्राग्निप्रज्वलनम्, गृहिणीप्रवेशः धान्यं वहन्त्या (समृद्धिसूचकः)। कुलस्य मुख्यः प्रथमं प्रविशेत्।',
      },
    },
    {
      question: {
        en: 'Which day of the week is best for Griha Pravesh?',
        hi: 'गृह प्रवेश के लिए सप्ताह का कौन सा दिन सबसे अच्छा है?',
        sa: 'गृहप्रवेशस्य कृते सप्ताहस्य कः वासरः सर्वोत्तमः?',
      },
      answer: {
        en: 'Monday (ruled by Moon), Wednesday (Mercury), Thursday (Jupiter), and Friday (Venus) are the most auspicious weekdays for Griha Pravesh. Sunday and Tuesday are generally avoided, as they are ruled by the Sun (associated with sharp, aggressive energy) and Mars (conflict). Saturday is considered neutral but avoided by many due to Saturn\'s association with delay and restriction. The combination of a favourable weekday with a strong Nakshatra greatly enhances the muhurta.',
        hi: 'गृह प्रवेश के लिए सोमवार (चन्द्र), बुधवार (बुध), गुरुवार (गुरु) और शुक्रवार (शुक्र) सर्वाधिक शुभ वार हैं। रविवार और मंगलवार सामान्यतः वर्जित हैं। शनिवार तटस्थ माना जाता है किन्तु अनेक लोग शनि की विलम्बकारी प्रकृति से बचते हुए इसे छोड़ते हैं। अनुकूल वार और बलवान नक्षत्र का संयोग मुहूर्त को अत्यन्त शुभ बनाता है।',
        sa: 'गृहप्रवेशस्य कृते सोमवारः (चन्द्रः), बुधवारः (बुधः), गुरुवारः (गुरुः), शुक्रवारः (शुक्रः) च सर्वाधिकशुभाः वासराः। रविवारः मङ्गलवारश्च सामान्यतः वर्ज्यौ। शनिवारः तटस्थः किन्तु शनेः विलम्बकारित्वात् अनेके वर्जयन्ति। अनुकूलवासरस्य बलिनो नक्षत्रस्य च संयोगः मुहूर्तम् अत्यन्तशुभं करोति।',
      },
    },
  ],

  // ─── /baby-names ───────────────────────────────────────────
  '/baby-names': [
    {
      question: {
        en: 'How do I find a baby name based on nakshatra?',
        hi: 'नक्षत्र के आधार पर शिशु का नाम कैसे खोजें?',
      },
      answer: {
        en: 'Enter the birth date, time, and location. The tool computes the Moon\'s nakshatra at birth, determines the starting syllable (akshar) prescribed by Vedic tradition, and suggests names beginning with that syllable. Each of the 27 nakshatras has four assigned syllables corresponding to its four padas.',
        hi: 'जन्म तिथि, समय और स्थान दर्ज करें। यह उपकरण जन्म के समय चन्द्रमा के नक्षत्र की गणना करता है, वैदिक परम्परा द्वारा निर्धारित आरम्भिक अक्षर ज्ञात करता है, और उस अक्षर से आरम्भ होने वाले नाम सुझाता है।',
      },
    },
    {
      question: {
        en: 'What if I don\'t know the exact birth time for baby naming?',
        hi: 'यदि शिशु नामकरण के लिए सही जन्म समय न पता हो तो?',
      },
      answer: {
        en: 'If the exact birth time is unavailable, the tool can still suggest names based on the nakshatra active for most of that day. However, the Moon changes nakshatra roughly every 24 hours, so an approximate time within a few hours is usually sufficient to identify the correct syllable.',
        hi: 'यदि सही जन्म समय उपलब्ध नहीं है, तो उपकरण उस दिन के अधिकांश समय सक्रिय नक्षत्र के आधार पर नाम सुझा सकता है। चन्द्रमा लगभग हर 24 घण्टे में नक्षत्र बदलता है, इसलिए कुछ घण्टों का अनुमानित समय सामान्यतः पर्याप्त है।',
      },
    },
    {
      question: {
        en: 'Why is the nakshatra syllable important for naming a baby?',
        hi: 'शिशु के नामकरण में नक्षत्र अक्षर क्यों महत्वपूर्ण है?',
      },
      answer: {
        en: 'Vedic tradition holds that the sound vibration of a name influences the child\'s temperament and fortune. The nakshatra at birth connects the child to a specific cosmic energy, and the prescribed syllable is believed to harmonise the name with that energy. This practice is documented in Brihat Parashara Hora Shastra and remains widely followed across India.',
        hi: 'वैदिक परम्परा के अनुसार नाम की ध्वनि तरंग बच्चे के स्वभाव और भाग्य को प्रभावित करती है। जन्म नक्षत्र बच्चे को एक विशिष्ट ब्रह्माण्डीय ऊर्जा से जोड़ता है, और निर्धारित अक्षर उस ऊर्जा के साथ नाम का सामंजस्य स्थापित करता है।',
      },
    },
  ],

  // ─── /shraddha ─────────────────────────────────────────────
  '/shraddha': [
    {
      question: {
        en: 'What is Shraddha and when is it performed?',
        hi: 'श्राद्ध क्या है और यह कब किया जाता है?',
      },
      answer: {
        en: 'Shraddha is a Vedic ritual performed to honour deceased ancestors. It is observed on the tithi (lunar day) of the ancestor\'s death, particularly during Pitru Paksha — the 16-day dark fortnight in the month of Bhadrapada (September–October). Annual shraddha is also performed on the death anniversary tithi throughout the year.',
        hi: 'श्राद्ध दिवंगत पूर्वजों के सम्मान में किया जाने वाला वैदिक अनुष्ठान है। यह पूर्वज की मृत्यु तिथि पर मनाया जाता है, विशेषकर पितृ पक्ष के दौरान — भाद्रपद मास (सितम्बर-अक्टूबर) के 16 दिवसीय कृष्ण पक्ष में।',
      },
    },
    {
      question: {
        en: 'How do I find the correct tithi for my ancestor\'s Shraddha?',
        hi: 'अपने पूर्वज के श्राद्ध के लिए सही तिथि कैसे खोजें?',
      },
      answer: {
        en: 'Enter the date of death and the tool determines the corresponding tithi. Each year, the Shraddha is performed when that same tithi recurs in Pitru Paksha. For example, if the ancestor passed on Panchami, their Shraddha falls on Krishna Panchami of Bhadrapada. The tool accounts for Kshaya (skipped) tithis and leap adjustments.',
        hi: 'मृत्यु की तारीख दर्ज करें और उपकरण संबंधित तिथि निर्धारित करेगा। प्रतिवर्ष पितृ पक्ष में उसी तिथि पर श्राद्ध किया जाता है। उदाहरणार्थ, यदि पूर्वज पंचमी तिथि पर गए, तो उनका श्राद्ध भाद्रपद कृष्ण पंचमी को पड़ता है।',
      },
    },
    {
      question: {
        en: 'What are the dates of Pitru Paksha in 2026?',
        hi: '2026 में पितृ पक्ष की तिथियाँ क्या हैं?',
      },
      answer: {
        en: 'Pitru Paksha dates shift each year based on the lunar calendar. The tool computes the exact start and end dates for any year by finding the Krishna Paksha of Bhadrapada masa. Enter your location to get precise local dates, as Pitru Paksha timing can differ by a day depending on your timezone and local sunrise.',
        hi: 'पितृ पक्ष की तिथियाँ चान्द्र पंचांग के अनुसार प्रतिवर्ष बदलती हैं। यह उपकरण भाद्रपद मास के कृष्ण पक्ष के आधार पर किसी भी वर्ष की सटीक आरम्भ और समाप्ति तिथियाँ गणना करता है।',
      },
    },
  ],

  // ─── /vedic-time ───────────────────────────────────────────
  '/vedic-time': [
    {
      question: {
        en: 'What is Vedic time and how does it differ from modern time?',
        hi: 'वैदिक समय क्या है और यह आधुनिक समय से कैसे भिन्न है?',
      },
      answer: {
        en: 'Vedic time divides the day into units based on sunrise rather than midnight. The primary units are Ghati (24 minutes), Pala (24 seconds), and Vipala (0.4 seconds). A Vedic day contains 60 Ghatis from one sunrise to the next. This system also defines 30 Muhurtas per day, each lasting 48 minutes.',
        hi: 'वैदिक समय दिन को मध्यरात्रि के बजाय सूर्योदय के आधार पर विभाजित करता है। प्रमुख इकाइयाँ हैं — घटी (24 मिनट), पल (24 सेकण्ड) और विपल (0.4 सेकण्ड)। एक वैदिक दिन में एक सूर्योदय से अगले तक 60 घटियाँ होती हैं।',
      },
    },
    {
      question: {
        en: 'What is a Muhurta in Vedic timekeeping?',
        hi: 'वैदिक कालगणना में मुहूर्त क्या है?',
      },
      answer: {
        en: 'A Muhurta is a 48-minute time window in the Vedic system. There are 30 Muhurtas in each day, 15 during daytime and 15 at night. Each Muhurta has a specific name and quality — some are auspicious (like Abhijit Muhurta around midday) and others are inauspicious. The tool shows which Muhurta is currently active at your location.',
        hi: 'मुहूर्त वैदिक पद्धति में 48 मिनट की समय खिड़की है। प्रत्येक दिन में 30 मुहूर्त होते हैं — 15 दिन में और 15 रात्रि में। प्रत्येक मुहूर्त का विशिष्ट नाम और गुण है — कुछ शुभ हैं (जैसे मध्याह्न के आसपास अभिजित मुहूर्त) और कुछ अशुभ।',
      },
    },
    {
      question: {
        en: 'How do I convert modern clock time to Vedic Ghati-Pala?',
        hi: 'आधुनिक घड़ी के समय को वैदिक घटी-पल में कैसे बदलें?',
      },
      answer: {
        en: 'Calculate the minutes elapsed since local sunrise, then divide by 24 to get Ghatis. The remainder, divided by 24 again, gives Palas. For example, if sunrise is at 06:00 and the current time is 10:00, that is 240 minutes or 10 Ghatis exactly. The tool performs this conversion automatically for your location and current time.',
        hi: 'स्थानीय सूर्योदय के बाद बीते मिनटों की गणना करें, फिर 24 से भाग दें — यह घटी है। शेष को पुनः 24 से भाग दें — यह पल है। उदाहरणार्थ, यदि सूर्योदय 06:00 पर है और वर्तमान समय 10:00 है, तो 240 मिनट अर्थात् ठीक 10 घटी हुई।',
      },
    },
  ],

  // ─── /upagraha ─────────────────────────────────────────────
  '/upagraha': [
    {
      question: {
        en: 'What are Upagrahas in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में उपग्रह क्या हैं?',
      },
      answer: {
        en: 'Upagrahas are shadow sub-planets used in Vedic chart analysis. The five primary upagrahas are Dhuma, Vyatipata, Parivesha, Indrachapa (Kodanda), and Upaketu. They are mathematically derived from the Sun\'s longitude rather than observed celestial bodies, and they refine predictions by indicating hidden influences and karmic patterns.',
        hi: 'उपग्रह वैदिक कुण्डली विश्लेषण में प्रयुक्त छाया उपग्रह हैं। पाँच प्रमुख उपग्रह हैं — धूम, व्यतीपात, परिवेश, इन्द्रचाप (कोदण्ड) और उपकेतु। ये सूर्य के रेखांश से गणितीय रूप से व्युत्पन्न होते हैं और छिपे प्रभावों तथा कार्मिक पैटर्न को दर्शाते हैं।',
      },
    },
    {
      question: {
        en: 'How are Upagraha positions calculated?',
        hi: 'उपग्रहों की स्थिति की गणना कैसे की जाती है?',
      },
      answer: {
        en: 'Upagraha longitudes are derived by adding fixed offsets to the Sun\'s sidereal longitude. For example, Dhuma = Sun + 133°20\', Vyatipata = 360° − Dhuma, Parivesha = Vyatipata + 180°, Indrachapa = 360° − Parivesha, and Upaketu = Indrachapa + 16°40\'. These formulae come from Brihat Parashara Hora Shastra.',
        hi: 'उपग्रहों के रेखांश सूर्य के सायन रेखांश में निश्चित मान जोड़कर प्राप्त किये जाते हैं। उदाहरणार्थ, धूम = सूर्य + 133°20\', व्यतीपात = 360° − धूम, परिवेश = व्यतीपात + 180°, इन्द्रचाप = 360° − परिवेश, और उपकेतु = इन्द्रचाप + 16°40\'।',
      },
    },
    {
      question: {
        en: 'Do Upagrahas affect my birth chart predictions?',
        hi: 'क्या उपग्रह मेरी जन्म कुण्डली की भविष्यवाणियों को प्रभावित करते हैं?',
      },
      answer: {
        en: 'Yes, Upagrahas add a supplementary layer of analysis. When an upagraha occupies a sensitive house (1st, 7th, or 10th) or conjoins key planets, it can amplify malefic tendencies or indicate hidden karmic debts. Classical texts recommend examining upagrahas for a more complete picture, though they carry less weight than the nine main grahas.',
        hi: 'हाँ, उपग्रह विश्लेषण की एक अतिरिक्त परत जोड़ते हैं। जब कोई उपग्रह संवेदनशील भाव (प्रथम, सप्तम या दशम) में हो या प्रमुख ग्रहों के साथ युति करे, तो यह पापी प्रवृत्तियों को बढ़ा सकता है या छिपे कार्मिक ऋणों को दर्शा सकता है।',
      },
    },
  ],

  // ─── /devotional ───────────────────────────────────────────
  '/devotional': [
    {
      question: {
        en: 'What daily puja rituals does Vedic tradition recommend?',
        hi: 'वैदिक परम्परा में दैनिक पूजा के कौन से अनुष्ठान सुझाये जाते हैं?',
      },
      answer: {
        en: 'The core daily practice includes Sandhya Vandana (prayers at sunrise, noon, and sunset), lighting a lamp (deepa), offering flowers and incense to the family deity, and reciting a stotram or mantra. The specific deity and mantra vary by day of the week — for example, Monday is associated with Lord Shiva, Tuesday with Hanuman, and Thursday with Vishnu or Brihaspati.',
        hi: 'मूल दैनिक अभ्यास में सन्ध्या वन्दना (सूर्योदय, मध्याह्न और सूर्यास्त पर प्रार्थना), दीप प्रज्वलन, कुलदेवता को पुष्प और धूप अर्पित करना, तथा स्तोत्र या मन्त्र पाठ शामिल है। विशिष्ट देवता और मन्त्र सप्ताह के दिन के अनुसार भिन्न होते हैं।',
      },
    },
    {
      question: {
        en: 'Which deity should I worship on which day of the week?',
        hi: 'सप्ताह के किस दिन किस देवता की पूजा करनी चाहिए?',
      },
      answer: {
        en: 'The traditional weekly deity associations are: Sunday — Surya (Sun God), Monday — Shiva, Tuesday — Hanuman or Kartikeya, Wednesday — Ganesha or Budha, Thursday — Vishnu or Brihaspati (Guru), Friday — Lakshmi or Durga, and Saturday — Shani or Hanuman. The tool provides deity-specific mantras and puja vidhi for each day.',
        hi: 'पारम्परिक साप्ताहिक देवता सम्बन्ध हैं: रविवार — सूर्य, सोमवार — शिव, मंगलवार — हनुमान या कार्तिकेय, बुधवार — गणेश या बुध, गुरुवार — विष्णु या बृहस्पति, शुक्रवार — लक्ष्मी या दुर्गा, शनिवार — शनि या हनुमान।',
      },
    },
    {
      question: {
        en: 'What rituals are performed during major Hindu festivals?',
        hi: 'प्रमुख हिन्दू त्योहारों में कौन से अनुष्ठान किये जाते हैं?',
      },
      answer: {
        en: 'Major festivals have specific rituals: Diwali includes Lakshmi Puja, Ganesh Puja, and lamp lighting; Navaratri involves nine nights of Durga worship with different forms each day; Maha Shivaratri centres on night-long Shiva abhisheka; and Ganesh Chaturthi features Ganesh installation and visarjan. The tool provides festival-specific puja vidhi and mantras.',
        hi: 'प्रमुख त्योहारों के विशिष्ट अनुष्ठान हैं: दीवाली में लक्ष्मी पूजा, गणेश पूजा और दीप प्रज्वलन; नवरात्रि में नौ रातों तक दुर्गा की विभिन्न रूपों में पूजा; महाशिवरात्रि में रात्रिभर शिव अभिषेक; और गणेश चतुर्थी में गणेश स्थापना और विसर्जन।',
      },
    },
  ],

  // ─── /varshaphal ───────────────────────────────────────────
  '/varshaphal': [
    {
      question: {
        en: 'What is Varshaphal (solar return chart) in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में वर्षफल (सौर प्रत्यागमन कुण्डली) क्या है?',
      },
      answer: {
        en: 'Varshaphal is a Vedic annual horoscope chart cast for the exact moment when the Sun returns to its natal sidereal position each year. It uses the Tajika system of interpretation — distinct from classical Parashari methods — to predict the year\'s themes across career, relationships, health, and finances. It includes tools like Muntha, Sahams (sensitive points), and Mudda Dasha.',
        hi: 'वर्षफल प्रत्येक वर्ष सूर्य के अपनी जन्मकालीन सायन स्थिति पर लौटने के सटीक क्षण के लिए बनायी गयी वैदिक वार्षिक कुण्डली है। यह ताजिक पद्धति का उपयोग करता है और वर्ष के विषयों — करियर, सम्बन्ध, स्वास्थ्य और वित्त — की भविष्यवाणी करता है।',
      },
    },
    {
      question: {
        en: 'What is Muntha in Varshaphal and why does it matter?',
        hi: 'वर्षफल में मुन्था क्या है और यह क्यों महत्वपूर्ण है?',
      },
      answer: {
        en: 'Muntha is a mathematical point that advances one sign per year from the Ascendant of the birth chart. Its position in the annual chart indicates the overarching tone of the year. A well-placed Muntha (in a benefic house, aspected by Jupiter or Venus) signals a favourable year, while Muntha in the 6th, 8th, or 12th house suggests challenges requiring caution.',
        hi: 'मुन्था एक गणितीय बिन्दु है जो जन्म कुण्डली के लग्न से प्रत्येक वर्ष एक राशि आगे बढ़ता है। वार्षिक कुण्डली में इसकी स्थिति वर्ष के समग्र स्वर को दर्शाती है। शुभ भाव में अच्छी स्थिति वाला मुन्था अनुकूल वर्ष का संकेत देता है।',
      },
    },
    {
      question: {
        en: 'How does Varshaphal differ from Vimshottari Dasha predictions?',
        hi: 'वर्षफल विम्शोत्तरी दशा भविष्यवाणियों से कैसे भिन्न है?',
      },
      answer: {
        en: 'Vimshottari Dasha spans the entire lifetime with planetary periods lasting years, providing a broad karmic timeline. Varshaphal focuses on a single year with its own dasha system (Mudda Dasha) where planetary periods last days to weeks. The two systems complement each other — Varshaphal gives granular annual detail, while Vimshottari sets the overarching life context.',
        hi: 'विम्शोत्तरी दशा सम्पूर्ण जीवनकाल में वर्षों तक चलने वाली ग्रह अवधियों के साथ व्यापक कार्मिक समयरेखा प्रदान करती है। वर्षफल अपनी स्वयं की दशा पद्धति (मुद्दा दशा) के साथ एक वर्ष पर केन्द्रित होता है जहाँ ग्रह अवधियाँ दिनों से सप्ताहों तक चलती हैं।',
      },
    },
  ],

  // ─── /prashna-ashtamangala ─────────────────────────────────
  '/prashna-ashtamangala': [
    {
      question: {
        en: 'What is Ashtamangala Prashna and how does it work?',
        hi: 'अष्टमंगल प्रश्न क्या है और यह कैसे काम करता है?',
      },
      answer: {
        en: 'Ashtamangala Prashna is a Kerala-tradition horary divination method that answers specific questions without requiring the querent\'s birth data. The querent selects numbers associated with eight auspicious items (mirror, vessel, gold ornament, lamp, throne, bull, flag, and fan), and the astrologer constructs a prashna chart from the moment the question is asked.',
        hi: 'अष्टमंगल प्रश्न केरल परम्परा की एक प्रश्न ज्योतिष पद्धति है जो प्रश्नकर्ता के जन्म डेटा के बिना विशिष्ट प्रश्नों का उत्तर देती है। प्रश्नकर्ता आठ शुभ वस्तुओं (दर्पण, पात्र, स्वर्णाभूषण, दीप, सिंहासन, वृषभ, ध्वज और पंखा) से सम्बद्ध संख्याएँ चुनता है।',
      },
    },
    {
      question: {
        en: 'What are the eight auspicious items in Ashtamangala?',
        hi: 'अष्टमंगल में आठ शुभ वस्तुएँ कौन सी हैं?',
      },
      answer: {
        en: 'The eight Mangala Dravyas are: Darpana (mirror), Kumbha (full vessel/pot), Swarna (gold ornament), Deepa (lamp), Simhasana (throne/seat), Vrishabha (bull), Dhwaja (flag/banner), and Vyajana (fan/chamara). Each item is mapped to a number, and the querent\'s chosen numbers are used to derive the rashi, nakshatra, and planetary influences for the prashna chart.',
        hi: 'आठ मंगल द्रव्य हैं: दर्पण, कुम्भ (भरा पात्र), स्वर्ण (आभूषण), दीप, सिंहासन, वृषभ, ध्वज, और व्यजन (पंखा/चामर)। प्रत्येक वस्तु एक संख्या से जुड़ी है, और प्रश्नकर्ता द्वारा चुनी गयी संख्याओं से प्रश्न कुण्डली में राशि, नक्षत्र और ग्रह प्रभाव निर्धारित किये जाते हैं।',
      },
    },
    {
      question: {
        en: 'Can Ashtamangala Prashna be used without knowing my birth time?',
        hi: 'क्या अष्टमंगल प्रश्न मेरे जन्म समय को जाने बिना उपयोग किया जा सकता है?',
      },
      answer: {
        en: 'Yes, that is one of the key advantages of Prashna astrology. The chart is cast for the moment the question is posed, not from birth data. This makes it especially useful when birth details are unknown or uncertain. The accuracy depends on the sincerity of the question and the precision of the moment it is asked.',
        hi: 'हाँ, यह प्रश्न ज्योतिष का एक प्रमुख लाभ है। कुण्डली प्रश्न पूछे जाने के क्षण के लिए बनायी जाती है, न कि जन्म डेटा से। यह विशेष रूप से तब उपयोगी है जब जन्म विवरण अज्ञात या अनिश्चित हों।',
      },
    },
  ],

  // ─── /eclipses ─────────────────────────────────────────────
  '/eclipses': [
    {
      question: {
        en: 'When is the next solar or lunar eclipse?',
        hi: 'अगला सूर्य या चन्द्र ग्रहण कब है?',
      },
      answer: {
        en: 'The eclipse calendar shows upcoming solar and lunar eclipses with exact dates, times, and visibility regions. Eclipse frequency varies — typically 2 to 5 solar eclipses and 0 to 3 lunar eclipses occur each year. The tool computes eclipse circumstances for your specific location, including partial and total phases.',
        hi: 'ग्रहण पंचांग आगामी सूर्य और चन्द्र ग्रहणों की सटीक तिथियाँ, समय और दृश्यता क्षेत्र दिखाता है। प्रत्येक वर्ष सामान्यतः 2 से 5 सूर्य ग्रहण और 0 से 3 चन्द्र ग्रहण होते हैं। यह उपकरण आपके विशिष्ट स्थान के लिए ग्रहण परिस्थितियों की गणना करता है।',
      },
    },
    {
      question: {
        en: 'What is Sutak period during an eclipse?',
        hi: 'ग्रहण के दौरान सूतक काल क्या है?',
      },
      answer: {
        en: 'Sutak is the inauspicious period preceding an eclipse during which certain activities are traditionally avoided. For a solar eclipse, Sutak begins 12 hours before; for a lunar eclipse, it begins 9 hours before. During Sutak, eating, cooking, and starting new ventures are typically avoided. The tool calculates Sutak start and end times for your location.',
        hi: 'सूतक ग्रहण से पूर्व का अशुभ काल है जिसमें कुछ गतिविधियाँ परम्परागत रूप से वर्जित होती हैं। सूर्य ग्रहण के लिए सूतक 12 घण्टे पहले आरम्भ होता है; चन्द्र ग्रहण के लिए 9 घण्टे पहले। सूतक में भोजन, पाक और नये कार्य सामान्यतः वर्जित हैं।',
      },
    },
    {
      question: {
        en: 'How do eclipses affect my birth chart in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में ग्रहण मेरी जन्म कुण्डली को कैसे प्रभावित करते हैं?',
      },
      answer: {
        en: 'In Vedic astrology, an eclipse falling on or near a sensitive point in your birth chart (Ascendant, Moon, or natal Rahu-Ketu axis) is considered significant. Solar eclipses can trigger career or identity shifts, while lunar eclipses often relate to emotional or relationship changes. The effect is strongest when the eclipse degree is within 3 degrees of a natal planet.',
        hi: 'वैदिक ज्योतिष में, जब ग्रहण आपकी जन्म कुण्डली के संवेदनशील बिन्दु (लग्न, चन्द्र, या जन्मकालीन राहु-केतु अक्ष) पर या निकट पड़ता है, तो इसे महत्वपूर्ण माना जाता है। सूर्य ग्रहण करियर या पहचान में परिवर्तन ला सकते हैं, जबकि चन्द्र ग्रहण प्रायः भावनात्मक या सम्बन्ध परिवर्तनों से जुड़े होते हैं।',
      },
    },
  ],

  // ─── /transits ─────────────────────────────────────────────
  '/transits': [
    {
      question: {
        en: 'What are planetary transits (Gochar) in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में ग्रह गोचर क्या हैं?',
      },
      answer: {
        en: 'Gochar refers to the current real-time positions of planets as they move through the zodiac signs. In Vedic astrology, transits are analysed relative to your Moon sign (Janma Rashi) to predict their impact on different areas of life. Slow-moving planets like Jupiter (1 year per sign) and Saturn (2.5 years per sign) carry the most weight in transit analysis.',
        hi: 'गोचर राशियों में ग्रहों की वर्तमान वास्तविक समय स्थिति को दर्शाता है। वैदिक ज्योतिष में गोचर का विश्लेषण आपकी जन्म राशि (चन्द्र राशि) के सापेक्ष किया जाता है। बृहस्पति (प्रति राशि 1 वर्ष) और शनि (प्रति राशि 2.5 वर्ष) जैसे मन्द ग्रह गोचर विश्लेषण में सर्वाधिक महत्वपूर्ण हैं।',
      },
    },
    {
      question: {
        en: 'Which planets are most important for transit predictions?',
        hi: 'गोचर भविष्यवाणियों के लिए कौन से ग्रह सबसे महत्वपूर्ण हैं?',
      },
      answer: {
        en: 'Jupiter, Saturn, and the Rahu-Ketu axis are the most influential transiting planets because they remain in each sign for months to years. Jupiter\'s transit brings expansion and opportunity to the house it occupies; Saturn brings discipline and restructuring; Rahu-Ketu trigger karmic shifts. Faster planets like the Moon, Mercury, and Venus provide daily nuance.',
        hi: 'बृहस्पति, शनि और राहु-केतु अक्ष सर्वाधिक प्रभावशाली गोचर ग्रह हैं क्योंकि ये प्रत्येक राशि में महीनों से वर्षों तक रहते हैं। बृहस्पति का गोचर विस्तार और अवसर लाता है; शनि अनुशासन और पुनर्संरचना लाता है; राहु-केतु कार्मिक परिवर्तन प्रेरित करते हैं।',
      },
    },
    {
      question: {
        en: 'How do I check current planetary positions for my chart?',
        hi: 'अपनी कुण्डली के लिए वर्तमान ग्रह स्थिति कैसे देखें?',
      },
      answer: {
        en: 'The transits page displays the live sidereal positions of all nine Vedic planets (Sun through Ketu) computed using astronomical algorithms. If you have a saved birth chart, the tool overlays the current transits on your natal chart, highlighting which houses the transiting planets occupy relative to your Ascendant and Moon sign.',
        hi: 'गोचर पृष्ठ खगोलीय एल्गोरिदम का उपयोग करके सभी नौ वैदिक ग्रहों (सूर्य से केतु तक) की वास्तविक सायन स्थिति प्रदर्शित करता है। यदि आपकी जन्म कुण्डली सहेजी हुई है, तो उपकरण आपकी जन्म कुण्डली पर वर्तमान गोचर को आरोपित करता है।',
      },
    },
  ],

  // ─── /retrograde ───────────────────────────────────────────
  '/retrograde': [
    {
      question: {
        en: 'What does it mean when a planet is retrograde?',
        hi: 'जब कोई ग्रह वक्री होता है तो इसका क्या अर्थ है?',
      },
      answer: {
        en: 'Retrograde is an apparent backward motion of a planet as seen from Earth, caused by differences in orbital speeds. In Vedic astrology, a retrograde planet is considered stronger in certain respects — it turns its energy inward, encouraging reflection and revisiting past matters. Retrograde does not mean the planet is actually moving backwards; it is a geometric illusion.',
        hi: 'वक्री गति पृथ्वी से देखने पर ग्रह की पीछे की ओर जाती हुई प्रतीत होने वाली गति है, जो कक्षीय गति में अन्तर के कारण होती है। वैदिक ज्योतिष में वक्री ग्रह को कुछ मामलों में अधिक बलवान माना जाता है — यह अपनी ऊर्जा को अन्तर्मुखी करता है।',
      },
    },
    {
      question: {
        en: 'Which planets are currently retrograde?',
        hi: 'इस समय कौन से ग्रह वक्री हैं?',
      },
      answer: {
        en: 'The retrograde tracker shows real-time retrograde status for all planets. Mercury retrogrades 3–4 times per year for about 3 weeks each; Venus retrogrades once every 18 months for about 6 weeks; Mars every 2 years for about 2.5 months; Jupiter and Saturn each retrograde once a year for 4–5 months. Rahu and Ketu are perpetually retrograde by nature.',
        hi: 'वक्री ट्रैकर सभी ग्रहों की वास्तविक समय वक्री स्थिति दिखाता है। बुध वर्ष में 3-4 बार लगभग 3 सप्ताह के लिए वक्री होता है; शुक्र प्रत्येक 18 माह में एक बार लगभग 6 सप्ताह के लिए; मंगल हर 2 वर्ष में लगभग 2.5 माह के लिए; बृहस्पति और शनि प्रत्येक वर्ष में एक बार 4-5 माह के लिए।',
      },
    },
    {
      question: {
        en: 'Does Mercury retrograde really cause communication problems?',
        hi: 'क्या बुध वक्री वास्तव में संचार समस्याएँ उत्पन्न करता है?',
      },
      answer: {
        en: 'In Vedic astrology, Mercury governs communication, commerce, and intellect. When retrograde, its significations may manifest as delays in contracts, misunderstandings, or technology glitches — though the actual impact depends heavily on Mercury\'s placement in your birth chart. If Mercury is well-placed natally, its retrograde may bring beneficial review and revision rather than disruption.',
        hi: 'वैदिक ज्योतिष में बुध संचार, वाणिज्य और बुद्धि का कारक है। वक्री होने पर अनुबन्धों में विलम्ब, गलतफहमी या तकनीकी समस्याएँ हो सकती हैं — हालाँकि वास्तविक प्रभाव आपकी जन्म कुण्डली में बुध की स्थिति पर बहुत निर्भर करता है।',
      },
    },
  ],
};

/**
 * Generate FAQ JSON-LD structured data for a given route and locale.
 * Returns null if no FAQ data exists for the route.
 */
/**
 * Generate FAQPage JSON-LD for per-rashi horoscope pages.
 * Answers are EN-only  –  Google processes the English version for rich snippets.
 * @param rashiName  Vedic rashi name in the page locale (e.g. "Mesh" / "मेष")
 * @param westernName  Western zodiac name in English (e.g. "Aries")
 * @param period  Which page type: daily, weekly, or monthly
 */
export function generateHoroscopeFAQ(
  rashiName: string,
  westernName: string,
  period: 'daily' | 'weekly' | 'monthly'
): Record<string, unknown> {
  const qaMap: Record<typeof period, Array<{ q: string; a: string }>> = {
    daily: [
      {
        q: `What is today's horoscope for ${rashiName} (${westernName})?`,
        a: `Today's ${westernName} (${rashiName}) horoscope is based on the actual sidereal positions of the Sun, Moon, and planets computed in real time. Our Vedic horoscope analyses how transiting planets interact with your Moon sign to provide scores and insights for career, love, health, finance, and spirituality.`,
      },
      {
        q: `What are the lucky colors and numbers for ${rashiName} today?`,
        a: `Lucky colors and numbers for ${westernName} (${rashiName}) are derived from the ruling planet of your Nakshatra and the current planetary transits. These shift daily as the Moon moves through different lunar mansions. Check today's ${westernName} daily horoscope on Dekho Panchang for the updated lucky color, number, and auspicious time for your sign.`,
      },
      {
        q: `Is ${westernName} (${rashiName}) a Moon sign or Sun sign in Vedic astrology?`,
        a: `In Vedic astrology, ${rashiName} (${westernName}) is your Moon sign  –  determined by the sidereal position of the Moon at the time of your birth. Unlike Western astrology which uses the Sun sign for horoscopes, Vedic daily predictions are based on the Moon sign because the Moon governs the mind, emotions, and daily experiences.`,
      },
      {
        q: `How accurate are Vedic daily horoscope predictions for ${westernName}?`,
        a: `Vedic horoscope predictions on Dekho Panchang are grounded in real planetary transit data computed using classical Meeus astronomical algorithms. While no astrological prediction is guaranteed, our system analyses the actual positions of Jupiter, Saturn, Rahu, Ketu, and other planets relative to ${rashiName} to deliver transit-based insights rather than generic templates.`,
      },
    ],
    weekly: [
      {
        q: `Is this week good for ${rashiName} (${westernName})?`,
        a: `The weekly outlook for ${westernName} (${rashiName}) depends on the planets transiting through or aspecting your Moon sign this week. Our Vedic weekly horoscope evaluates day-by-day planetary positions to identify the best days for career moves, relationship discussions, financial decisions, and health care. Check the current week's horoscope for a detailed breakdown.`,
      },
      {
        q: `What should ${westernName} (${rashiName}) focus on this week?`,
        a: `The weekly ${rashiName} horoscope highlights key themes for the week based on active planetary transits. Typically, the Moon's movement through different signs each day, combined with the slower transits of Jupiter, Saturn, and Rahu-Ketu, shapes your weekly priorities across career, relationships, health, and finances.`,
      },
      {
        q: `Which days of the week are luckiest for ${westernName} this week?`,
        a: `The luckiest days for ${westernName} (${rashiName}) each week vary based on when the Moon transits into supportive lunar mansions and when planets like Jupiter and Venus form favourable angles. Our weekly horoscope provides a day-by-day auspiciousness score so you can plan important activities on your strongest days.`,
      },
      {
        q: `How is the Vedic weekly horoscope for ${westernName} calculated?`,
        a: `The weekly Vedic horoscope for ${rashiName} (${westernName}) is computed from the sidereal positions of all planets across each day of the week. We analyse transiting planets' house positions relative to your Moon sign, their mutual aspects, and key panchang elements like Tithi and Nakshatra to generate career, love, health, and finance scores for every day.`,
      },
    ],
    monthly: [
      {
        q: `What should ${rashiName} (${westernName}) expect this month?`,
        a: `The monthly horoscope for ${westernName} (${rashiName}) summarises the major planetary influences active during the month, including Jupiter and Saturn's ongoing transits, Rahu-Ketu axis effects, and any significant ingresses or retrograde periods. It highlights the best weeks for career advancement, relationship growth, financial decisions, and health management.`,
      },
      {
        q: `What are the best and worst weeks for ${westernName} this month?`,
        a: `The best weeks for ${rashiName} (${westernName}) are when benefic planets like Jupiter, Venus, or a waxing Moon form supportive angles to your Moon sign. Challenging weeks typically coincide with Saturn aspects, Rahu-Ketu transits, or eclipses. Our monthly horoscope calendar heatmap marks each day's auspiciousness so you can identify strong and weak periods at a glance.`,
      },
      {
        q: `How is the monthly Vedic horoscope for ${westernName} (${rashiName}) calculated?`,
        a: `The monthly Vedic horoscope is derived from a day-by-day analysis of planetary transits for the entire month. We compute the sidereal positions of the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu and evaluate how each planet's movement affects ${rashiName} across five life areas  –  career, love, health, finance, and spirituality.`,
      },
      {
        q: `How accurate are Vedic monthly horoscope predictions?`,
        a: `Vedic monthly horoscope predictions on Dekho Panchang are grounded in classical Jyotish methodology  –  transit-based analysis using real sidereal planetary positions. Slower planets like Saturn, Jupiter, and Rahu-Ketu have the most reliable and measurable long-term influence on a Moon sign. Fast-moving planets like the Moon add daily nuance. We present these as directional insights, not deterministic forecasts.`,
      },
    ],
  };

  const qaList = qaMap[period];

  // Add rashi-specific trait questions (these are what Hindi users search)
  const rashiSpecific: Array<{ q: string; a: string }> = [
    {
      q: `Who is the ruling planet (Swami Graha) of ${rashiName} (${westernName})?`,
      a: `${rashiName} (${westernName}) is ruled by its lord planet (Swami Graha) in Vedic astrology. The ruling planet governs the core personality, temperament, and life themes of ${westernName} Moon sign natives. Its strength in your birth chart determines how strongly these traits manifest in your life.`,
    },
    {
      q: `What element is ${rashiName} (${westernName}) in Vedic astrology?`,
      a: `In Vedic astrology, each sign belongs to one of four elements  –  Fire (Agni), Earth (Prithvi), Air (Vayu), or Water (Jal). The element of ${rashiName} shapes emotional temperament, communication style, and compatibility with other signs. Fire signs are energetic and action-oriented, Earth signs are stable and practical, Air signs are intellectual and social, Water signs are intuitive and emotional.`,
    },
    {
      q: `Is ${westernName} (${rashiName}) compatible with other signs?`,
      a: `Compatibility for ${rashiName} (${westernName}) depends on the elements, planetary friendships, and the 36-point Guna Milan system. Signs sharing the same element or with friendly ruling planets tend to have natural chemistry. For detailed compatibility analysis, use the Ashta Kuta matching tool on Dekho Panchang with both birth charts.`,
    },
  ];

  const allQA = [...qaList, ...rashiSpecific];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQA.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

export function generateFAQLD(route: string, locale: string): Record<string, unknown> | null {
  const faqs = FAQ_DATA[route];
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question[locale] || faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale] || faq.answer.en,
      },
    })),
  };
}

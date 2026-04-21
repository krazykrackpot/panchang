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
        sa: 'पञ्चाङ्गं पारम्परिकं वैदिकं कालगणनापद्धतिः अस्ति यत् पञ्च प्रमुखानि अङ्गानि दर्शयति — तिथिः, नक्षत्रम्, योगः, करणम्, वारश्च। देखो-पञ्चाङ्गम् शास्त्रीयखगोलगणनाभिः विश्वस्य कस्मिन् अपि स्थाने एतानि पञ्चाङ्गानि गणयति।',
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
        en: 'Yoga in Panchang (not to be confused with physical Yoga exercises) is one of the five elements of the Vedic calendar. It is calculated from the combined longitudes of the Sun and Moon — each 13 degree 20 minute segment of their sum defines one of 27 Yogas. Each Yoga has distinct qualities that influence the auspiciousness of the day.',
        hi: 'पंचांग में योग (शारीरिक योगाभ्यास से भिन्न) वैदिक पंचांग के पाँच अंगों में से एक है। यह सूर्य और चन्द्रमा के संयुक्त रेखांश से गणना होता है — उनके योग के प्रत्येक 13 अंश 20 कला खण्ड से एक योग निर्धारित होता है। प्रत्येक योग दिन की शुभता को प्रभावित करता है।',
        sa: 'पञ्चाङ्गे योगः (शारीरिकयोगाभ्यासात् भिन्नः) वैदिकपञ्चाङ्गस्य पञ्चसु अङ्गेषु अन्यतमः अस्ति। सूर्यचन्द्रयोः संयुक्तरेखांशात् गण्यते — तयोः योगस्य प्रत्येकं त्रयोदशांशविंशतिकलाखण्डं सप्तविंशतियोगेषु एकं निर्धारयति। प्रत्येकस्य योगस्य दिनशुभत्वं प्रभावयन्तः विशिष्टगुणाः सन्ति।',
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
        sa: 'राशिः वैदिकनिरयणज्योतिषे द्वादशराशिचक्रचिह्नेषु अन्यतमः अस्ति — मेषात् आरभ्य मीनपर्यन्तम्। पाश्चात्यसायनज्योतिषात् भिन्नं वैदिकराशयः अयनांशसंशोधनेन विषुवायनं गणयन्ति, तेन राशयः पाश्चात्यराशिभ्यः प्रायः चतुर्विंशत्यंशैः पृष्ठतः स्थिताः भवन्ति। भवतः राशिः मूलव्यक्तित्वगुणान् जीवनप्रतिरूपाणि च निर्धारयति।',
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
        en: 'To find your Vedic Rashi (Moon sign), you need your exact birth date, time, and place. Use our free Kundali generator on Dekho Panchang — enter your birth details and the tool will compute your Moon\'s sidereal position to determine your Rashi along with your complete birth chart, Nakshatras, and planetary positions.',
        hi: 'अपनी वैदिक राशि (चन्द्र राशि) जानने के लिए आपको अपनी सटीक जन्म तिथि, समय और स्थान की आवश्यकता है। देखो पंचांग पर निःशुल्क कुण्डली जनरेटर का उपयोग करें — अपना जन्म विवरण भरें और उपकरण आपकी राशि, नक्षत्र और ग्रह स्थिति की गणना करेगा।',
        sa: 'स्वकीयां वैदिकराशिं (चन्द्रराशिम्) ज्ञातुं भवतः सूक्ष्मजन्मतिथिः, कालः, स्थानं च आवश्यकम्। देखो-पञ्चाङ्गे निःशुल्ककुण्डलीजनकम् उपयुज्यताम् — स्वजन्मविवरणं प्रविश्य साधनं भवतः चन्द्रमसः निरयणस्थितिं गणयित्वा राशिं सम्पूर्णजन्मकुण्डलीं नक्षत्राणि ग्रहस्थितींश्च निर्धारयिष्यति।',
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
        sa: 'अष्टकूटं विवाहसाम्यपरीक्षायै पारम्परिकी वैदिकी पद्धतिः अस्ति यत्र वरवध्वोः जन्मनक्षत्राणाम् अष्टसु कूटेषु तुलना क्रियते — वर्णः, वश्यम्, तारा, योनिः, ग्रहमैत्री, गणः, भकूटः, नाडी च। अधिकतमाङ्काः षट्त्रिंशत् गुणाः भवन्ति। देखो-पञ्चाङ्गं सर्वेषाम् अष्टकूटानां विस्तृतविश्लेषणं प्रस्तौति।',
      },
    },
    {
      question: {
        en: 'What is the minimum Guna score required for marriage?',
        hi: 'विवाह के लिए न्यूनतम कितने गुण आवश्यक हैं?',
        sa: 'विवाहाय न्यूनतमं कति गुणाः आवश्यकाः?',
      },
      answer: {
        en: 'Traditionally, a minimum of 18 out of 36 Gunas is considered acceptable for marriage. Scores above 24 are considered good, and above 30 are excellent. However, individual Kuta scores matter too — a high total with a Nadi Dosha (0 in Nadi Kuta) may still raise concerns. Our matching tool highlights specific Dosha warnings alongside the total score.',
        hi: 'परम्परागत रूप से 36 में से न्यूनतम 18 गुण विवाह के लिए स्वीकार्य माने जाते हैं। 24 से अधिक गुण अच्छे और 30 से अधिक उत्तम माने जाते हैं। किन्तु व्यक्तिगत कूट भी महत्वपूर्ण हैं — नाडी दोष होने पर कुल गुण अधिक होने पर भी चिन्ता हो सकती है।',
        sa: 'परम्परया षट्त्रिंशतः गुणेषु न्यूनतमम् अष्टादश गुणाः विवाहाय स्वीकार्याः मन्यन्ते। चतुर्विंशत्यधिकाः उत्तमाः, त्रिंशदधिकाः श्रेष्ठाः च। किन्तु प्रत्येककूटाङ्काः अपि महत्त्वपूर्णाः — नाडीदोषे (नाडीकूटे शून्याङ्के) सति समग्रगुणाः अधिकाः चेदपि चिन्ता भवितुम् अर्हति। अस्माकं मेलनसाधनं समग्राङ्कैः सह विशिष्टदोषचेतावनीः दर्शयति।',
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
        en: 'The North Indian chart uses a diamond-shaped layout where the houses remain fixed and signs rotate based on the Ascendant. The South Indian chart uses a rectangular grid where the signs remain fixed and houses rotate. Both contain identical astronomical data — the choice is regional preference. Dekho Panchang supports both styles with a toggle switch.',
        hi: 'उत्तर भारतीय कुण्डली हीरे के आकार की होती है जिसमें भाव स्थिर रहते हैं और राशियाँ लग्न के अनुसार बदलती हैं। दक्षिण भारतीय कुण्डली आयताकार होती है जिसमें राशियाँ स्थिर रहती हैं। दोनों में खगोलीय जानकारी एक समान होती है — चयन क्षेत्रीय प्राथमिकता है।',
        sa: 'उत्तरभारतीया कुण्डली हीरकाकृतिविन्यासं उपयुज्य भावान् स्थिरान् रक्षति राशयश्च लग्नानुसारं परिवर्तन्ते। दक्षिणभारतीया कुण्डली आयताकारजालिकां उपयुज्य राशीन् स्थिरान् रक्षति भावाश्च परिवर्तन्ते। उभयोः खगोलीयदत्तांशाः समानाः एव — चयनं क्षेत्रीयरुचिम् अनुसरति। देखो-पञ्चाङ्गम् उभयशैल्योः परिवर्तनसुविधया सह समर्थयति।',
      },
    },
    {
      question: {
        en: 'Why does exact birth time matter for Kundali?',
        hi: 'कुण्डली के लिए सटीक जन्म समय क्यों महत्वपूर्ण है?',
        sa: 'कुण्डल्यै सूक्ष्मजन्मकालः कथं महत्त्वपूर्णः?',
      },
      answer: {
        en: 'The Ascendant (Lagna) changes approximately every 2 hours, and the Moon changes Nakshatra roughly every day. Even a few minutes\' difference can shift the Lagna, alter house placements, and change the Vimshottari Dasha sequence entirely. Accurate birth time is essential for reliable predictions — our tool allows time input down to the minute for precision.',
        hi: 'लग्न लगभग प्रत्येक 2 घण्टे में बदलता है और चन्द्रमा प्रतिदिन नक्षत्र बदलता है। कुछ मिनटों का अन्तर भी लग्न बदल सकता है, भाव-स्थिति और विंशोत्तरी दशा क्रम पूर्णतः परिवर्तित हो सकता है। विश्वसनीय भविष्यवाणी के लिए सटीक जन्म समय अत्यावश्यक है।',
        sa: 'लग्नं प्रायः प्रतिद्विघण्टं परिवर्तते, चन्द्रमाश्च प्रायः प्रतिदिनं नक्षत्रं परिवर्तयति। कतिपयनिमेषाणाम् अन्तरम् अपि लग्नं परिवर्तयितुम्, भावस्थितिं विकल्पयितुम्, विंशोत्तरीदशाक्रमं सम्पूर्णतया परिवर्तयितुं च शक्नोति। विश्वसनीयफलकथनाय सूक्ष्मजन्मकालः अत्यावश्यकः — अस्माकं साधनं निमेषपर्यन्तं सूक्ष्मकालप्रविष्टिम् अनुमन्यते।',
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
        en: 'Our AI Muhurta finder evaluates multiple Vedic factors simultaneously — Panchang elements, planetary transits, Choghadiya, Rahu Kaal, and activity-specific rules — to score and rank time windows. It uses a multi-factor scoring algorithm that weighs each element according to classical Jyotish texts, presenting the top-ranked auspicious windows for your chosen activity and location.',
        hi: 'हमारा AI मुहूर्त खोजक एक साथ अनेक वैदिक कारकों — पंचांग तत्व, ग्रह गोचर, चौघड़िया, राहु काल और कार्य-विशिष्ट नियमों — का मूल्यांकन करता है। यह शास्त्रीय ज्योतिष ग्रन्थों के अनुसार प्रत्येक तत्व को महत्व देकर शुभ समय खिड़कियों की रैंकिंग प्रस्तुत करता है।',
        sa: 'अस्माकं कृत्रिमप्रज्ञामुहूर्तान्वेषकः एककालं बहुविधवैदिककारकान् — पञ्चाङ्गतत्त्वानि, ग्रहगोचरान्, चौघड़ियां, राहुकालम्, कार्यविशिष्टनियमांश्च — मूल्यायित्वा कालखण्डानि अङ्कयति श्रेणीबद्धं करोति च। शास्त्रीयज्योतिषग्रन्थानुसारं प्रत्येकतत्त्वं भारयन् बहुकारकाङ्कनसूत्रम् उपयुज्य भवतः चयनिताय कार्यस्थानाय सर्वोच्छ्रेणिशुभकालखण्डानि प्रस्तौति।',
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
        sa: 'देखो-पञ्चाङ्गस्य मुहूर्तकृत्रिमप्रज्ञा विंशतिकार्याणि समर्थयति — विवाहः, गृहप्रवेशः, यात्रा, वाहनक्रयः, व्यापारारम्भः, भूमिक्रयः, नामकरणम्, विद्यारम्भः, चिकित्सा, सेवाप्रवेशः, स्वर्णक्रयः, ऋणपत्रम्, न्यायालयश्रवणम् इत्यादीनि। प्रत्येकस्य कार्यस्य विशिष्टवैदिकनियमाः कृत्रिमप्रज्ञया स्वयमेव अनुप्रयुज्यन्ते।',
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
        en: 'Rahu Kaal and Rahu Kalam refer to the same inauspicious time period — there is no astrological difference. "Rahu Kaal" is the Hindi/North Indian term while "Rahu Kalam" is the Tamil/South Indian term. Both represent the daily 1.5-hour window ruled by Rahu that is computed identically regardless of the name used.',
        hi: 'राहु काल और राहु कालम् एक ही अशुभ अवधि के दो नाम हैं — ज्योतिषीय दृष्टि से कोई अन्तर नहीं है। "राहु काल" हिन्दी/उत्तर भारतीय और "राहु कालम्" तमिल/दक्षिण भारतीय शब्द है। दोनों राहु द्वारा शासित दैनिक 1.5 घण्टे की अवधि को दर्शाते हैं।',
        sa: 'राहुकालः राहुकालमश्च एकाम् एव अशुभावधिं निर्दिशतः — ज्योतिषशास्त्रीयः कोऽपि भेदः नास्ति। "राहुकालः" हिन्दी-उत्तरभारतीयं पदं, "राहुकालम्" तु तमिल-दक्षिणभारतीयं पदम्। उभयम् अपि राहुशासितां दैनिकसार्धघण्टावधिं दर्शयति या नामपरिवर्तनम् अनपेक्ष्य समानतया गण्यते।',
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
        en: 'There are typically 24 Ekadashis in a year — two per lunar month, one in Shukla Paksha (waxing moon) and one in Krishna Paksha (waning moon). In a leap year (Adhika Masa), two extra Ekadashis are added, totalling 26. Each Ekadashi has a unique name and spiritual significance described in the Puranas.',
        hi: 'एक वर्ष में सामान्यतः 24 एकादशियाँ होती हैं — प्रत्येक चान्द्र मास में दो, एक शुक्ल पक्ष में और एक कृष्ण पक्ष में। अधिक मास वाले वर्ष में दो अतिरिक्त एकादशियाँ जुड़ जाती हैं।',
        sa: 'एकस्मिन् वर्षे सामान्यतः चतुर्विंशतिः एकादश्यः भवन्ति — प्रतिचान्द्रमासं द्वे, एका शुक्लपक्षे अपरा कृष्णपक्षे। अधिकमासयुक्ते वर्षे द्वे अतिरिक्ते एकादश्यौ योज्येते, तेन षड्विंशतिः भवन्ति। प्रत्येकस्याः एकादश्याः विशिष्टं नाम पुराणोक्तं आध्यात्मिकमहत्त्वं च अस्ति।',
      },
    },
    {
      question: {
        en: 'What is Ekadashi fasting (Ekadashi Vrat)?',
        hi: 'एकादशी व्रत क्या है?',
        sa: 'एकादशीव्रतं किम् अस्ति?',
      },
      answer: {
        en: 'Ekadashi Vrat involves fasting on the 11th Tithi of each lunar fortnight. Devotees abstain from grains and beans, consuming only fruits, milk, and root vegetables. The fast is broken on Dwadashi (12th Tithi) during the Parana window — the auspicious time calculated from the end of Ekadashi Tithi. Nirjala Ekadashi (Jyeshtha Shukla) is the strictest, observed without water.',
        hi: 'एकादशी व्रत में प्रत्येक पक्ष की 11वीं तिथि को उपवास रखा जाता है। भक्त अन्न और दालों से परहेज करते हैं। व्रत द्वादशी (12वीं तिथि) को पारण काल में तोड़ा जाता है। निर्जला एकादशी सबसे कठोर व्रत है।',
        sa: 'एकादशीव्रते प्रत्येकस्य पक्षार्धस्य एकादश्यां तिथौ उपवासः आचर्यते। भक्ताः अन्नशिम्बीभ्यो विरमन्ति, फलानि दुग्धं कन्दमूलानि च एव सेवन्ते। व्रतं द्वादश्यां (द्वादशतिथौ) पारणकाले भिद्यते — एकादशीतिथेः समाप्त्यनन्तरं गणितः शुभकालः। निर्जलैकादशी (ज्येष्ठशुक्ला) सर्वाधिककठोरा, जलं विना आचर्यते।',
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
        en: 'There are 12 Purnimas (full moons) in a regular year, one per lunar month. In a year with an Adhika Masa (intercalary month), there are 13 Purnimas. Each Purnima is named after its lunar month — for example, Kartik Purnima, Vaishakh Purnima, etc.',
        hi: 'सामान्य वर्ष में 12 पूर्णिमा होती हैं, प्रत्येक चान्द्र मास में एक। अधिक मास वाले वर्ष में 13 पूर्णिमा होती हैं। प्रत्येक पूर्णिमा अपने चान्द्र मास के नाम से जानी जाती है।',
        sa: 'सामान्यवर्षे द्वादश पूर्णिमाः (पूर्णचन्द्राः) भवन्ति, प्रतिचान्द्रमासम् एका। अधिकमासयुक्ते वर्षे त्रयोदश पूर्णिमाः भवन्ति। प्रत्येका पूर्णिमा स्वकीयचान्द्रमासस्य नाम्ना ज्ञायते — यथा कार्तिकपूर्णिमा, वैशाखपूर्णिमा इत्यादि।',
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
        sa: 'अनेकाः पूर्णिमाः विशिष्टमहत्त्वं धारयन्ति — गुरुपूर्णिमा (आषाढे) आध्यात्मिकगुरूणां सम्मानार्थम्, शरत्पूर्णिमा (आश्विने) सर्वाधिकदीप्तपूर्णचन्द्रार्थं प्रसिद्धा, कार्तिकपूर्णिमा पवित्रस्नानदीपदानाय पुण्या, बुद्धपूर्णिमा (वैशाखे) च गौतमबुद्धस्य जन्मसूचिका। होलिकोत्सवः फाल्गुनपूर्णिमायाम् आचर्यते।',
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
        en: 'When Pradosham (Trayodashi Tithi) falls on a Saturday, it is called Shani Pradosham — considered especially powerful for removing karmic debts and Saturn-related afflictions. When it falls on Monday, it is Soma Pradosham — ideal for devotion to Lord Shiva, as Monday is already Shiva\'s day. Both are observed during the twilight period (1.5 hours before and after sunset).',
        hi: 'जब प्रदोष (त्रयोदशी तिथि) शनिवार को पड़ता है तो शनि प्रदोष कहलाता है — कर्मऋण और शनि दोष निवारण के लिए विशेष शक्तिशाली। सोमवार को सोम प्रदोष होता है — शिव भक्ति के लिए सर्वोत्तम। दोनों सन्ध्याकाल में मनाए जाते हैं।',
        sa: 'यदा प्रदोषः (त्रयोदशी तिथिः) शनिवासरे पतति तदा शनिप्रदोषः इति उच्यते — कर्मऋणनिवारणाय शनिजन्यपीडापशमनाय च विशेषशक्तिमान् मन्यते। सोमवासरे पतति चेत् सोमप्रदोषः भवति — शिवभक्त्यै सर्वोत्तमः, यतः सोमवासरः शिवस्य दिनम् एव। उभौ सन्ध्याकाले (सूर्यास्तात् सार्धघण्टापूर्वम् अनन्तरं च) आचर्येते।',
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
        en: 'Sankashti Chaturthi falls on Krishna Paksha Chaturthi (4th day of the waning moon) and involves fasting until moonrise, followed by Ganesh Puja and moon sighting. Vinayaka Chaturthi falls on Shukla Paksha Chaturthi (4th day of the waxing moon) and is considered ideal for beginning new works. When Sankashti falls on Tuesday, it is called Angaraki Chaturthi — the most auspicious of all monthly Chaturthis.',
        hi: 'संकष्टी चतुर्थी कृष्ण पक्ष चतुर्थी को पड़ती है — चन्द्रोदय तक उपवास और गणेश पूजा की जाती है। विनायक चतुर्थी शुक्ल पक्ष चतुर्थी को होती है — नए कार्य आरम्भ के लिए शुभ। मंगलवार को पड़ने वाली संकष्टी अंगारकी चतुर्थी कहलाती है — सबसे शुभ।',
        sa: 'सङ्कष्टीचतुर्थी कृष्णपक्षचतुर्थ्यां (क्षीयमाणचन्द्रस्य चतुर्थदिने) पतति, चन्द्रोदयपर्यन्तम् उपवासः गणेशपूजा चन्द्रदर्शनं च आचर्यते। विनायकचतुर्थी शुक्लपक्षचतुर्थ्यां (वर्धमानचन्द्रस्य चतुर्थदिने) पतति, नवकार्यारम्भाय आदर्शा मन्यते। यदा सङ्कष्टी मङ्गलवासरे पतति तदा अङ्गारकीचतुर्थी इत्युच्यते — सर्वासां मासिकचतुर्थीनां सर्वाधिकशुभा।',
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
        en: 'There are 16 Choghadiya periods in a full day — 8 during daytime (sunrise to sunset) and 8 during nighttime (sunset to next sunrise). The duration of each period is not a fixed 1.5 hours; it varies by season because daytime and nighttime lengths change throughout the year. Dekho Panchang calculates exact Choghadiya times based on your location\'s actual sunrise and sunset.',
        hi: 'पूरे दिन में 16 चौघड़िया होते हैं — दिन में 8 (सूर्योदय से सूर्यास्त) और रात में 8 (सूर्यास्त से अगले सूर्योदय तक)। प्रत्येक अवधि निश्चित 1.5 घण्टे की नहीं होती; यह ऋतु के अनुसार बदलती है क्योंकि दिन-रात की अवधि वर्ष भर बदलती रहती है।',
        sa: 'सम्पूर्णदिने षोडश चौघड़ियाः भवन्ति — दिवसे अष्ट (सूर्योदयात् सूर्यास्तपर्यन्तम्) रात्रौ च अष्ट (सूर्यास्तात् अग्रिमसूर्योदयपर्यन्तम्)। प्रत्येकावधेः कालः निश्चितसार्धघण्टात्मकः न भवति; ऋत्वनुसारं भिद्यते यतः दिवारात्र्योः अवधिः सम्पूर्णवर्षं यावत् परिवर्तते। देखो-पञ्चाङ्गं भवतः स्थानस्य वास्तविकसूर्योदयसूर्यास्तम् अनुसृत्य सूक्ष्मचौघड़ियाकालान् गणयति।',
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
        sa: 'मङ्गलदोषः अनेकासु स्थितिषु निरस्तः मन्यते — कुजः स्वराशौ (मेषे/वृश्चिके) वा उच्चराशौ (मकरे), गुरोः दृष्ट्या युत्या वा, उभौ वरवधू माङ्गलिकौ, विशेषनक्षत्रेषु कुजः।',
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
        en: 'Kaal Sarp Dosha occurs when all seven planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are hemmed between Rahu and Ketu — that is, all planets fall on one side of the Rahu-Ketu axis. This is considered a significant karmic combination that can cause delays, obstacles, and sudden upheavals in life. However, its effects vary greatly depending on which houses Rahu and Ketu occupy.',
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
        sa: 'द्वादशप्रकाराः सन्ति — अनन्तः, कुलिकः, वासुकिः, शंखपालः, पद्मः, महापद्मः, तक्षकः, कर्कोटकः, शंखचूडः, घातकः, विषधरः, शेषनागश्च।',
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
        sa: 'पारम्परिकोपायाः — त्र्यम्बकेश्वरे महाकालेश्वरे वा कालसर्पदोषनिवारणपूजा, राहुकेतुमन्त्रजपः, गोमेदवैदूर्यधारणम्, नागपञ्चम्यां दुग्धतण्डुलार्पणम्, सर्पसूक्तपठनम्, शिवनागदेवतापूजा च।',
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
        en: 'Mangal Dosha is caused by Mars\'s placement and primarily affects marriage and relationships. Pitra Dosha is caused by Sun-Rahu affliction and relates to ancestral karma — it affects broader life patterns including career blocks, progeny issues, and generational family problems. Mangal Dosha is a single-planet placement check; Pitra Dosha involves multiple factors including the 9th house, Sun, Rahu, and sometimes Saturn.',
        hi: 'मंगल दोष मंगल की स्थिति से होता है और मुख्यतः विवाह प्रभावित करता है। पितृ दोष सूर्य-राहु पीड़ा से होता है और पैतृक कर्म से सम्बन्धित है — कैरियर अवरोध, सन्तान समस्या और पारिवारिक कठिनाइयाँ प्रभावित करता है।',
        sa: 'मङ्गलदोषः कुजस्थित्या भवति विवाहं च प्रभावयति। पितृदोषः सूर्यराहुपीडया भवति पैतृककर्मणा सम्बद्धश्च — वृत्तिम् अपत्यं पारिवारिकजीवनं च प्रभावयति।',
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
        sa: 'प्रमुखोपायाः — पितृपक्षे श्राद्धम्, गयायां काश्यां वा पिण्डदानम्, त्रिपिण्डीश्राद्धम्, त्र्यम्बकेश्वरे नारायणनागबलिपूजा, अमावास्यायां तर्पणम्, ब्राह्मणकाकभोजनं च। सूर्यराहुमन्त्रजपः अपि लाभकरः।',
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
        en: 'Sade Sati lasts approximately 7.5 years. It occurs when Saturn transits through three consecutive signs — the sign before your Moon sign (~2.5 years), your Moon sign itself (~2.5 years), and the sign after (~2.5 years). The exact duration varies slightly because Saturn\'s orbital speed is not constant and it retrogrades periodically.',
        hi: 'साढ़े साती लगभग 7.5 वर्ष तक रहती है। यह तब होती है जब शनि तीन क्रमिक राशियों से गुजरता है — आपकी चन्द्र राशि से पहली (~2.5 वर्ष), स्वयं चन्द्र राशि (~2.5 वर्ष) और उसके बाद की (~2.5 वर्ष)। सटीक अवधि शनि की गति और वक्री होने के कारण थोड़ी भिन्न हो सकती है।',
        sa: 'साढेसातिः प्रायः सार्धसप्तवर्षाणि तिष्ठति। शनिः त्रिषु क्रमिकराशिषु गच्छति चेत् भवति — चन्द्रराशेः पूर्वराशौ (~२.५ वर्षाणि), स्वयं चन्द्रराशौ (~२.५ वर्षाणि), तदनन्तरराशौ च (~२.५ वर्षाणि)।',
      },
    },
    {
      question: {
        en: 'What are the three phases of Sade Sati?',
        hi: 'साढ़े साती के तीन चरण कौन से हैं?',
        sa: 'साढेसात्याः त्रयः चरणाः के सन्ति?',
      },
      answer: {
        en: 'The three phases are: Rising Phase (Saturn in 12th from Moon) — financial pressures, hidden anxieties, and sleep disturbances. Peak Phase (Saturn over Moon sign) — the most intense period with mental pressure, relationship tests, and career challenges, but also deep personal growth. Setting Phase (Saturn in 2nd from Moon) — financial strain eases but family and speech-related matters may surface.',
        hi: 'तीन चरण हैं: आरम्भ चरण (चन्द्र से 12वाँ) — आर्थिक दबाव, छिपी चिन्ताएँ। चरम चरण (चन्द्र राशि पर) — सबसे तीव्र काल, मानसिक दबाव और कैरियर चुनौतियाँ, किन्तु गहन विकास भी। अवसान चरण (चन्द्र से 2रा) — आर्थिक दबाव कम, पारिवारिक विषय।',
        sa: 'त्रयः चरणाः सन्ति — उत्थानचरणः (चन्द्रात् द्वादशे शनिः), चरमचरणः (चन्द्रराशौ शनिः), अवसानचरणः (चन्द्रात् द्वितीये शनिः) च।',
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
        sa: 'पारम्परिकोपायाः — प्रतिदिनं हनुमत्चालीसापठनम्, शनिवासरे कृष्णवस्तूनां दानम्, पीपलवृक्षे सार्षपतैलदीपकम्, "ॐ शं शनैश्चराय नमः" इति अष्टोत्तरशतवारं जपश्च।',
      },
    },
    {
      question: {
        en: 'When does Sade Sati start for my Moon sign?',
        hi: 'मेरी चन्द्र राशि के लिए साढ़े साती कब शुरू होगी?',
        sa: 'मम चन्द्रराशये साढेसातिः कदा आरभते?',
      },
      answer: {
        en: 'Sade Sati begins when Saturn enters the sign just before (12th from) your Moon sign. Since Saturn takes about 2.5 years per sign and completes its orbit in ~29.5 years, Sade Sati occurs roughly every 30 years — meaning it happens 2-3 times in an average lifetime. Use our Sade Sati calculator to check exact dates based on your Moon sign or full birth chart.',
        hi: 'साढ़े साती तब शुरू होती है जब शनि आपकी चन्द्र राशि से ठीक पहले (12वीं) राशि में प्रवेश करता है। शनि ~29.5 वर्ष में एक चक्र पूरा करता है, अतः साढ़े साती लगभग 30 वर्ष में एक बार आती है — जीवनकाल में 2-3 बार। सटीक तिथियों के लिए हमारा गणक उपयोग करें।',
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
        en: 'Muhurat (auspicious timing) is the Vedic science of selecting the most favourable date and time for important activities. It considers multiple factors — Tithi, Nakshatra, Yoga, planetary positions, Rahu Kaal, and Choghadiya — to maximize the chances of a positive outcome. Starting important activities at the right Muhurat is believed to align your actions with cosmic energies.',
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
        sa: 'मुहूर्तस्य सर्वाधिकावश्यकतायुक्तानि कार्याणि — विवाहः, गृहप्रवेशः, व्यापारारम्भः, वाहनक्रयः, भूमिक्रयः, नामकरणम्, विद्यारम्भः, चिकित्सा, स्वर्णक्रयः, यात्रा च।',
      },
    },
    {
      question: {
        en: 'Can Muhurat override a bad horoscope?',
        hi: 'क्या मुहूर्त खराब कुण्डली को दूर कर सकता है?',
        sa: 'किं मुहूर्तः अशुभकुण्डलीं निवारयितुं शक्नोति?',
      },
      answer: {
        en: 'Muhurat cannot completely override the indications in a birth chart, but it can significantly improve the chances of success for a specific undertaking. Think of it as choosing the best possible starting conditions — like a seed planted in fertile soil at the right season. Classical texts say that a good Muhurat can enhance favourable Dasha results and mitigate challenging planetary periods.',
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
        hi: 'हिन्दू कैलेंडर में प्रतिवर्ष 180+ प्रमुख त्योहार, व्रत और अनुष्ठान हैं — 24 एकादशी, 12 पूर्णिमा, 12 अमावस्या, नवरात्रि, दीवाली, होली और दर्जनों क्षेत्रीय त्योहार। देखो पंचांग सभी प्रमुख त्योहारों को स्थान-आधारित तिथि समय के साथ दर्शाता है।',
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
        en: 'The Sun sign (Surya Rashi) represents your soul, ego, vitality, and outward identity — it changes roughly once a month. The Moon sign (Chandra Rashi) represents your mind, emotions, instincts, and inner nature — it changes approximately every 2.25 days. In Vedic astrology, the Moon sign is considered more important for daily predictions and compatibility matching, while the Sun sign is used for assessing authority, career, and health.',
        hi: 'सूर्य राशि आत्मा, अहंकार और बाह्य पहचान का प्रतिनिधित्व करती है — प्रति मास बदलती है। चन्द्र राशि मन, भावनाओं और आन्तरिक स्वभाव का — ~2.25 दिन में बदलती है। वैदिक ज्योतिष में दैनिक फल और मिलान के लिए चन्द्र राशि अधिक महत्वपूर्ण मानी जाती है।',
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
        en: 'Hora is a Vedic time-division system where each hour of the day is ruled by one of the 7 classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) in a fixed sequence. The first Hora of each day is ruled by the planet that governs that weekday — Sunday starts with Sun Hora, Monday with Moon Hora, etc. Different Horas are suited for different activities, making it a practical timing tool.',
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
        en: 'Hora divides the day into 24 one-hour periods (each ruled by a planet in the Chaldean order), while Choghadiya divides only the daytime and nighttime into 8 periods each (~1.5 hours, variable by season). Hora is consistent in duration but varies in planetary ruler; Choghadiya periods vary in duration but follow a fixed naming pattern. Both are valid timing systems — Hora is widely used across India while Choghadiya is especially popular in Gujarat and Western India.',
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
        en: 'Varshaphal is the Vedic annual horoscope based on the Tajika system, cast for the exact moment the Sun returns to its natal position each year (Solar Return). It includes a unique chart, Muntha (progressed ascendant), Sahams (Arabic parts), the Varsheshvara (year lord), and Mudda Dasha (annual planetary periods). It provides predictions specific to that solar year — from one birthday to the next.',
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
        en: 'The birth chart (Janma Kundali) is fixed for life and shows your overall karmic blueprint — personality, career tendencies, and life themes. The annual forecast (Varshaphal) is a temporary chart that changes every solar year, showing the specific themes, opportunities, and challenges active during that particular year. It uses the Tajika system with different aspects (Ithasala, Ishraf, etc.) rather than the standard Parashari aspects used in birth chart analysis.',
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
        en: 'The ideal time to check your Varshaphal is around your birthday each year, as the solar year runs from one birthday to the next. You can generate it for any year — past, present, or future — to understand the planetary themes active during that period. Many Jyotishis recommend reviewing it alongside your Vimshottari Dasha for a comprehensive picture of the year ahead.',
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
        en: 'Yes, you can learn Jyotish without Sanskrit fluency. While classical texts (Brihat Parashara Hora Shastra, Brihat Jataka, Phaladeepika) are in Sanskrit, excellent translations exist in English and Hindi. Most technical terms (Rashi, Graha, Bhava, Dasha, Yoga) are Sanskrit words used as-is in all languages. Familiarity with key terms is sufficient — you do not need to read Sanskrit grammar. Our learn section presents all concepts in English, Hindi, and Sanskrit.',
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
        en: 'A recommended learning path: (1) Panchang basics — Tithi, Nakshatra, Yoga, Karana, Vara; (2) Rashis and their qualities; (3) Grahas — natural significations and friendships; (4) Bhavas (houses) — what each house represents; (5) Planet-in-sign and planet-in-house effects; (6) Aspects (Drishti); (7) Vimshottari Dasha system; (8) Yogas and Doshas; (9) Divisional charts (D-9 Navamsha first); (10) Transits and predictive techniques.',
        hi: 'अनुशंसित क्रम: (1) पंचांग मूल — तिथि, नक्षत्र, योग, करण, वार; (2) राशियाँ; (3) ग्रह — स्वाभाविक कारकत्व और मैत्री; (4) भाव; (5) ग्रह-राशि और ग्रह-भाव प्रभाव; (6) दृष्टि; (7) विंशोत्तरी दशा; (8) योग और दोष; (9) वर्ग चार्ट; (10) गोचर।',
        sa: 'अनुशंसितक्रमः — (१) पञ्चाङ्गमूलानि, (२) राशयः, (३) ग्रहाः, (४) भावाः, (५) ग्रहराशिग्रहभावप्रभावाः, (६) दृष्टयः, (७) विंशोत्तरीदशा, (८) योगदोषाः, (९) वर्गचक्राणि, (१०) गोचरः।',
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
        sa: 'प्रश्नकुण्डल्या उपयोगः कार्यः यदा — (१) सूक्ष्मजन्मकालः न ज्ञातः, (२) विशिष्टः तात्कालिकः प्रश्नः अस्ति, (३) विशिष्टघटनायाः परिणामं ज्ञातुम् इच्छति, (४) जन्मकुण्डल्यां स्पष्टं न दृश्यते। "किम् एतत् भविष्यति?" इति प्रश्नेभ्यः आदर्शा।',
      },
    },
    {
      question: {
        en: 'Does the accuracy of Prashna depend on the sincerity of the question?',
        hi: 'क्या प्रश्न कुण्डली की सटीकता प्रश्न की गम्भीरता पर निर्भर करती है?',
        sa: 'किं प्रश्नकुण्डल्याः सूक्ष्मता प्रश्नस्य गाम्भीर्ये निर्भरा भवति?',
      },
      answer: {
        en: 'Classical texts emphasize that Prashna works best when the questioner has genuine concern about the matter. A question asked out of idle curiosity or to "test" astrology is unlikely to yield meaningful results. The underlying principle is that the moment of sincere inquiry is cosmically connected to the answer — the chart at that moment reflects the querent\'s karmic situation regarding that specific question.',
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
        en: 'The compatibility heatmap shows the Ashta Kuta Guna Milan score (out of 36) for every possible Moon sign pair — all 144 combinations of the 12 Rashis. Higher scores (shown in green/gold) indicate better compatibility, while lower scores (red) suggest potential challenges. This gives you a quick visual overview of which Moon sign combinations are naturally harmonious according to Vedic matching rules.',
        hi: 'अनुकूलता हीटमैप प्रत्येक सम्भव चन्द्र राशि जोड़ी के लिए अष्ट कूट गुण मिलान अंक (36 में से) दर्शाता है — 12 राशियों के सभी 144 संयोजन। उच्च अंक (हरा/स्वर्ण) बेहतर अनुकूलता और निम्न (लाल) सम्भावित चुनौतियाँ दर्शाते हैं।',
        sa: 'साम्यतातापपत्रं प्रत्येकस्य सम्भाव्यचन्द्रराशियुग्मस्य अष्टकूटगुणमेलनाङ्कम् (षट्त्रिंशतः) दर्शयति — द्वादशराशीनां सर्वाणि चतुश्चत्वारिंशदधिकशतसंयोजनानि।',
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
        en: 'A low Guna score (below 18) does not automatically mean the marriage will fail — it indicates areas that may need extra attention. Remedies include: performing specific Pujas recommended by a Jyotishi, wearing gemstones prescribed for Dosha mitigation, observing Shanti rituals before the wedding, and — most importantly — understanding which specific Kutas scored low so you can consciously work on those relationship areas (communication, temperament, etc.).',
        hi: 'कम गुण अंक (18 से नीचे) का अर्थ स्वचालित विवाह विफलता नहीं है — यह उन क्षेत्रों को इंगित करता है जिन पर अतिरिक्त ध्यान चाहिए। उपायों में विशिष्ट पूजा, रत्न धारण, शान्ति अनुष्ठान और — सबसे महत्वपूर्ण — कौन से कूट कम हैं यह जानकर उन सम्बन्ध क्षेत्रों पर सचेत रूप से कार्य करना शामिल है।',
        sa: 'न्यूनगुणाङ्कः (अष्टादशात् न्यूनः) स्वचालितविवाहविफलतां न सूचयति — तेषु क्षेत्रेषु अतिरिक्तध्यानम् आवश्यकम् इति दर्शयति।',
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
        en: 'KP System (Krishnamurti Paddhati) is a refined predictive system developed by Prof. K.S. Krishnamurti. It uses the Placidus house system (instead of equal houses), divides each Nakshatra into 9 sub-divisions based on Vimshottari Dasha lords, and creates a unique 249-entry sub-lord table. KP is known for its precision in timing events and answering specific yes/no questions — it is often used alongside traditional Parashari Jyotish.',
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
        en: 'Key differences: (1) KP uses Placidus houses while Vedic uses equal/whole-sign houses; (2) KP introduces "sub-lord" — a finer division beyond Nakshatra lord, giving 249 subdivisions vs 27 Nakshatras; (3) KP uses "ruling planets" at the moment of judgment for confirmation; (4) KP focuses on cuspal sub-lords rather than house lords for prediction; (5) KP is particularly strong for timing events and Prashna (horary) questions.',
        hi: 'प्रमुख अन्तर: (1) केपी प्लेसिडस भाव, वैदिक समान/पूर्ण राशि भाव; (2) केपी "उप-स्वामी" — नक्षत्र स्वामी से भी सूक्ष्म विभाजन, 249 उपविभाग; (3) केपी निर्णय क्षण के "शासक ग्रह" से पुष्टि; (4) केपी भावेश के बजाय भाव मध्य उप-स्वामी पर ध्यान; (5) घटना समय और प्रश्न में विशेष रूप से प्रबल।',
        sa: 'प्रमुखभेदाः — (१) केपी प्लेसिडसभावान् उपयुङ्क्ते, (२) "उपस्वामी" — नक्षत्रस्वामिनः अतिसूक्ष्मः विभागः, २४९ उपविभागाः, (३) निर्णयक्षणे "शासकग्रहाः" पुष्ट्यर्थम्, (४) भावमध्योपस्वामिषु ध्यानम्।',
      },
    },
    {
      question: {
        en: 'What are ruling planets in KP system?',
        hi: 'केपी प्रणाली में शासक ग्रह क्या हैं?',
        sa: 'केपीपद्धतौ शासकग्रहाः के सन्ति?',
      },
      answer: {
        en: 'Ruling planets are the lords active at the moment of chart judgment — they include the Lagna sign lord, Lagna Nakshatra lord, Moon sign lord, Moon Nakshatra lord, and the day lord. In KP, ruling planets serve as a confirmation tool: if a significator planet for a particular event is also a ruling planet at the time of analysis, it strongly confirms that the event will manifest. This is a unique KP technique not found in traditional Vedic astrology.',
        hi: 'शासक ग्रह चार्ट विश्लेषण के क्षण में सक्रिय स्वामी हैं — लग्न राशि स्वामी, लग्न नक्षत्र स्वामी, चन्द्र राशि स्वामी, चन्द्र नक्षत्र स्वामी और वार स्वामी। केपी में यदि किसी घटना का कारक ग्रह विश्लेषण समय का शासक ग्रह भी हो, तो यह घटना की पुष्टि करता है।',
        sa: 'शासकग्रहाः चक्रविश्लेषणक्षणे सक्रियाः स्वामिनः सन्ति — लग्नराशिस्वामी, लग्ननक्षत्रस्वामी, चन्द्रराशिस्वामी, चन्द्रनक्षत्रस्वामी, वारस्वामी च। केपीपद्धतौ एषः अद्वितीयः पुष्टिसाधनम् अस्ति।',
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
        en: 'Tithi Pravesha is the Vedic birthday — the exact moment each year when the same lunar tithi (day) as your birth recurs. It is used in Vedic astrology for annual predictions, similar to the Solar Return in Western astrology but based on the lunar calendar.',
        hi: 'तिथि प्रवेश वैदिक जन्मदिन है — हर वर्ष वह सटीक क्षण जब आपकी जन्म तिथि पुनः आती है। इसका उपयोग वैदिक ज्योतिष में वार्षिक भविष्यवाणी के लिए किया जाता है।',
        sa: 'तिथिप्रवेशः वैदिकजन्मदिवसः — प्रतिवर्षं यत् सटीकक्षणं यदा जन्मतिथिः पुनरागच्छति। वैदिकज्योतिषे वार्षिकभविष्यवाण्यर्थम् उपयुज्यते।',
      },
    },
    {
      question: {
        en: 'How is Tithi Pravesha different from a regular birthday?',
        hi: 'तिथि प्रवेश सामान्य जन्मदिन से कैसे अलग है?',
        sa: 'तिथिप्रवेशः सामान्यजन्मदिवसात् कथं भिन्नः?',
      },
      answer: {
        en: 'Your regular birthday follows the solar (Gregorian) calendar and falls on the same date each year. Tithi Pravesha follows the lunar calendar — the exact tithi of your birth — so the date shifts each year, typically by 10-12 days.',
        hi: 'आपका नियमित जन्मदिन सौर (ग्रेगोरियन) कैलेंडर का अनुसरण करता है। तिथि प्रवेश चंद्र कैलेंडर पर आधारित है — आपकी जन्म तिथि — इसलिए तारीख हर वर्ष 10-12 दिन बदलती है।',
        sa: 'भवतः नियमितजन्मदिवसः सौरपञ्चाङ्गम् अनुसरति। तिथिप्रवेशः चान्द्रपञ्चाङ्गम् अनुसरति — भवतः जन्मतिथिम् — अतः दिनाङ्कः प्रतिवर्षं १०-१२ दिनानि परिवर्तते।',
      },
    },
    {
      question: {
        en: 'What does the Tithi Lord indicate?',
        hi: 'तिथि स्वामी क्या दर्शाता है?',
        sa: 'तिथिस्वामी किं दर्शयति?',
      },
      answer: {
        en: 'Each tithi is ruled by a planet (the Tithi Lord). The lord of your birth tithi influences the theme of your Vedic year — for example, a Jupiter-ruled tithi suggests expansion and wisdom, while a Saturn-ruled one indicates discipline and karmic lessons.',
        hi: 'प्रत्येक तिथि का एक ग्रह स्वामी होता है। आपकी जन्म तिथि का स्वामी आपके वैदिक वर्ष की थीम को प्रभावित करता है।',
        sa: 'प्रत्येकतिथेः एकः ग्रहस्वामी भवति। भवतः जन्मतिथेः स्वामी भवतः वैदिकवर्षस्य विषयं प्रभावयति।',
      },
    },
  ],
};

/**
 * Generate FAQ JSON-LD structured data for a given route and locale.
 * Returns null if no FAQ data exists for the route.
 */
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

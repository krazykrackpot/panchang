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
      },
      answer: {
        en: 'Panchang is the traditional Vedic Hindu calendar system that tracks five key elements (Pancha Anga): Tithi (lunar day), Nakshatra (lunar mansion), Yoga (Sun-Moon angular relationship), Karana (half-Tithi), and Vara (weekday). Dekho Panchang computes all five elements using classical astronomical algorithms for any location worldwide.',
        hi: 'पंचांग पारंपरिक वैदिक हिन्दू पंचांग पद्धति है जो पाँच प्रमुख अंगों को दर्शाती है: तिथि, नक्षत्र, योग, करण और वार। देखो पंचांग शास्त्रीय खगोलीय गणनाओं द्वारा विश्व के किसी भी स्थान के लिए ये पाँचों अंग प्रस्तुत करता है।',
      },
    },
    {
      question: {
        en: 'Why does Panchang change by location?',
        hi: 'पंचांग स्थान के अनुसार क्यों बदलता है?',
      },
      answer: {
        en: 'Panchang values depend on local sunrise and sunset times, which vary by geographic location. Since the Vedic day begins at sunrise rather than midnight, two cities in different time zones will have different Tithi, Nakshatra, and other elements active at any given moment. Our tool calculates sunrise precisely for your coordinates.',
        hi: 'पंचांग के मान स्थानीय सूर्योदय और सूर्यास्त पर निर्भर करते हैं, जो भौगोलिक स्थिति के अनुसार बदलते हैं। वैदिक दिन सूर्योदय से आरम्भ होता है, अतः भिन्न-भिन्न नगरों में तिथि, नक्षत्र आदि भिन्न हो सकते हैं।',
      },
    },
    {
      question: {
        en: 'How accurate is this Panchang?',
        hi: 'यह पंचांग कितना सटीक है?',
      },
      answer: {
        en: 'Dekho Panchang uses Meeus astronomical algorithms to compute Sun and Moon positions with an accuracy of approximately 0.01 degrees for the Sun and 0.5 degrees for the Moon. All Panchang values have been verified to be within 1-2 minutes of leading reference sources for multiple locations worldwide.',
        hi: 'देखो पंचांग मीयस खगोलीय एल्गोरिदम का उपयोग करता है जो सूर्य की स्थिति लगभग 0.01 अंश और चन्द्रमा की स्थिति लगभग 0.5 अंश की सटीकता से गणना करता है। सभी पंचांग मान प्रमुख संदर्भ स्रोतों से 1-2 मिनट के भीतर सत्यापित हैं।',
      },
    },
  ],

  // ─── /panchang/tithi ────────────────────────────────────────
  '/panchang/tithi': [
    {
      question: {
        en: 'What is Tithi in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में तिथि क्या है?',
      },
      answer: {
        en: 'Tithi is a lunar day in the Vedic calendar, defined by each 12-degree increase in the angular distance between the Moon and the Sun. There are 30 Tithis in a lunar month, from Pratipada (1st) to Amavasya (new moon) or Purnima (full moon). Each Tithi has specific auspicious and inauspicious qualities for different activities.',
        hi: 'तिथि वैदिक पंचांग में चान्द्र दिवस है, जो चन्द्रमा और सूर्य के बीच 12 अंश के अन्तर से निर्धारित होती है। एक चान्द्र मास में प्रतिपदा से अमावस्या या पूर्णिमा तक 30 तिथियाँ होती हैं। प्रत्येक तिथि का विभिन्न कार्यों के लिए विशेष शुभ-अशुभ महत्व है।',
      },
    },
    {
      question: {
        en: 'What is the difference between Shukla and Krishna Paksha?',
        hi: 'शुक्ल पक्ष और कृष्ण पक्ष में क्या अन्तर है?',
      },
      answer: {
        en: 'Shukla Paksha is the waxing (bright) fortnight from new moon to full moon, considered generally auspicious for new beginnings. Krishna Paksha is the waning (dark) fortnight from full moon to new moon, often preferred for spiritual practices and introspection. Each Paksha contains 15 Tithis.',
        hi: 'शुक्ल पक्ष अमावस्या से पूर्णिमा तक का बढ़ता हुआ (उजला) पखवाड़ा है, जो नए कार्यों के लिए शुभ माना जाता है। कृष्ण पक्ष पूर्णिमा से अमावस्या तक का घटता हुआ (अँधेरा) पखवाड़ा है, जो साधना और आत्मचिन्तन के लिए उपयुक्त है।',
      },
    },
    {
      question: {
        en: 'What is Kshaya Tithi?',
        hi: 'क्षय तिथि क्या है?',
      },
      answer: {
        en: 'A Kshaya Tithi is a "lost" or "skipped" Tithi that begins and ends within the same sunrise-to-sunrise day, meaning it never occupies a sunrise moment. This is a rare astronomical occurrence caused by the varying speed of the Moon. Kshaya Tithis have special rules in the Hindu calendar for festival and Vrat observances.',
        hi: 'क्षय तिथि वह तिथि है जो एक ही सूर्योदय से अगले सूर्योदय के बीच आरम्भ और समाप्त हो जाती है, अर्थात् किसी भी सूर्योदय पर वह तिथि नहीं होती। यह चन्द्रमा की गति में परिवर्तन के कारण दुर्लभ खगोलीय घटना है।',
      },
    },
  ],

  // ─── /panchang/nakshatra ────────────────────────────────────
  '/panchang/nakshatra': [
    {
      question: {
        en: 'What are Nakshatras?',
        hi: 'नक्षत्र क्या हैं?',
      },
      answer: {
        en: 'Nakshatras are the 27 lunar mansions in Vedic astrology, each spanning 13 degrees 20 minutes of the zodiac. They represent the position of the Moon along the ecliptic and are fundamental to Vedic horoscopy, Muhurta selection, and Panchang calculations. Dekho Panchang displays the current Nakshatra with precise start and end times for your location.',
        hi: 'नक्षत्र वैदिक ज्योतिष में 27 चान्द्र भवन हैं, जिनमें प्रत्येक राशिचक्र के 13 अंश 20 कला में फैला है। ये चन्द्रमा की क्रान्तिवृत्त पर स्थिति दर्शाते हैं और वैदिक फलित ज्योतिष, मुहूर्त चयन तथा पंचांग गणना के लिए मूलभूत हैं।',
      },
    },
    {
      question: {
        en: 'How are Nakshatras different from Rashis (zodiac signs)?',
        hi: 'नक्षत्र और राशि में क्या अन्तर है?',
      },
      answer: {
        en: 'Rashis (zodiac signs) divide the ecliptic into 12 equal parts of 30 degrees each, while Nakshatras divide it into 27 parts of 13 degrees 20 minutes each. Each Rashi contains approximately 2.25 Nakshatras. Rashis are primarily used for planetary sign placement, while Nakshatras provide finer detail about the Moon\'s influence and are crucial for compatibility matching and timing.',
        hi: 'राशियाँ क्रान्तिवृत्त को 30-30 अंश के 12 भागों में विभाजित करती हैं, जबकि नक्षत्र इसे 13 अंश 20 कला के 27 भागों में बाँटते हैं। प्रत्येक राशि में लगभग 2.25 नक्षत्र आते हैं। राशियाँ ग्रह-स्थिति के लिए और नक्षत्र चन्द्रमा के सूक्ष्म प्रभाव, मिलान तथा मुहूर्त के लिए प्रयुक्त होते हैं।',
      },
    },
    {
      question: {
        en: 'What is the Pada system in Nakshatras?',
        hi: 'नक्षत्र में पद पद्धति क्या है?',
      },
      answer: {
        en: 'Each Nakshatra is divided into 4 Padas (quarters) of 3 degrees 20 minutes each. Padas map directly to the Navamsha (D-9) chart divisions and determine the starting syllables for naming a child. The 108 total Padas (27 x 4) correspond to the 108 Navamsha divisions of the zodiac, linking the lunar mansion system to divisional chart analysis.',
        hi: 'प्रत्येक नक्षत्र को 3 अंश 20 कला के 4 पदों (चरणों) में विभाजित किया जाता है। पद सीधे नवांश (D-9) कुण्डली से सम्बन्धित हैं और शिशु के नामकरण के प्रारम्भिक अक्षर निर्धारित करते हैं। कुल 108 पद (27 x 4) राशिचक्र के 108 नवांश विभागों से मेल खाते हैं।',
      },
    },
  ],

  // ─── /panchang/yoga ─────────────────────────────────────────
  '/panchang/yoga': [
    {
      question: {
        en: 'What is Yoga in Panchang?',
        hi: 'पंचांग में योग क्या है?',
      },
      answer: {
        en: 'Yoga in Panchang (not to be confused with physical Yoga exercises) is one of the five elements of the Vedic calendar. It is calculated from the combined longitudes of the Sun and Moon — each 13 degree 20 minute segment of their sum defines one of 27 Yogas. Each Yoga has distinct qualities that influence the auspiciousness of the day.',
        hi: 'पंचांग में योग (शारीरिक योगाभ्यास से भिन्न) वैदिक पंचांग के पाँच अंगों में से एक है। यह सूर्य और चन्द्रमा के संयुक्त रेखांश से गणना होता है — उनके योग के प्रत्येक 13 अंश 20 कला खण्ड से एक योग निर्धारित होता है। प्रत्येक योग दिन की शुभता को प्रभावित करता है।',
      },
    },
    {
      question: {
        en: 'Which Yogas are considered auspicious?',
        hi: 'कौन से योग शुभ माने जाते हैं?',
      },
      answer: {
        en: 'Among the 27 Yogas, Siddhi, Amrita, and Sarvarthasiddhi are considered the most auspicious. Shubha, Shukla, and Brahma are also favourable. Conversely, Vishkumbha, Atiganda, Shoola, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, and Vaidhriti are generally considered inauspicious. Dekho Panchang marks each Yoga with its auspicious or inauspicious quality.',
        hi: 'सिद्धि, अमृत और सर्वार्थसिद्धि सबसे शुभ योग माने जाते हैं। शुभ, शुक्ल और ब्रह्म भी अनुकूल हैं। इसके विपरीत विष्कुम्भ, अतिगण्ड, शूल, गण्ड, व्याघात, वज्र, व्यतीपात, परिघ और वैधृति सामान्यतः अशुभ माने जाते हैं।',
      },
    },
    {
      question: {
        en: 'How many Yogas are there in Vedic Panchang?',
        hi: 'वैदिक पंचांग में कितने योग हैं?',
      },
      answer: {
        en: 'There are 27 Yogas in the Vedic Panchang, also called Nitya Yogas (daily Yogas). They cycle continuously and each lasts approximately one day, though the exact duration varies. The 27 Yogas begin with Vishkumbha and end with Vaidhriti. Our Panchang tool shows the current Yoga with its precise start and end times.',
        hi: 'वैदिक पंचांग में 27 योग हैं जिन्हें नित्य योग भी कहते हैं। ये निरन्तर चक्र में चलते हैं और प्रत्येक लगभग एक दिन तक रहता है। 27 योग विष्कुम्भ से आरम्भ होकर वैधृति पर समाप्त होते हैं।',
      },
    },
  ],

  // ─── /panchang/rashi ────────────────────────────────────────
  '/panchang/rashi': [
    {
      question: {
        en: 'What is Rashi in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में राशि क्या है?',
      },
      answer: {
        en: 'Rashi refers to the 12 zodiac signs in Vedic (sidereal) astrology: Mesha (Aries) through Meena (Pisces). Unlike Western tropical astrology, Vedic Rashis account for the precession of equinoxes using the Ayanamsha correction, placing signs approximately 24 degrees behind their Western counterparts. Your Rashi determines core personality traits and life patterns.',
        hi: 'राशि वैदिक (सायन) ज्योतिष में 12 राशिचक्र चिह्नों को कहते हैं: मेष से मीन तक। पाश्चात्य ज्योतिष के विपरीत, वैदिक राशियाँ अयनांश सुधार का उपयोग करती हैं जो विषुव अयन को ध्यान में रखता है।',
      },
    },
    {
      question: {
        en: 'How is the Vedic Moon sign different from the Western Sun sign?',
        hi: 'वैदिक चन्द्र राशि और पाश्चात्य सूर्य राशि में क्या अन्तर है?',
      },
      answer: {
        en: 'In Vedic astrology, your primary sign (Rashi) is determined by the Moon\'s sidereal position at birth, emphasizing emotions and mind. Western astrology uses the Sun\'s tropical position, focusing on ego and outer personality. Due to the ~24 degree Ayanamsha difference, most people have different Vedic and Western signs. Dekho Panchang uses the Lahiri Ayanamsha for accurate sidereal calculations.',
        hi: 'वैदिक ज्योतिष में आपकी राशि जन्म के समय चन्द्रमा की सायन स्थिति से निर्धारित होती है, जो मन और भावनाओं पर बल देती है। पाश्चात्य ज्योतिष सूर्य की स्थिति का उपयोग करता है। लगभग 24 अंश के अयनांश अन्तर के कारण अधिकांश लोगों की वैदिक और पाश्चात्य राशि भिन्न होती है।',
      },
    },
    {
      question: {
        en: 'How can I find my Rashi?',
        hi: 'मैं अपनी राशि कैसे जान सकता/सकती हूँ?',
      },
      answer: {
        en: 'To find your Vedic Rashi (Moon sign), you need your exact birth date, time, and place. Use our free Kundali generator on Dekho Panchang — enter your birth details and the tool will compute your Moon\'s sidereal position to determine your Rashi along with your complete birth chart, Nakshatras, and planetary positions.',
        hi: 'अपनी वैदिक राशि (चन्द्र राशि) जानने के लिए आपको अपनी सटीक जन्म तिथि, समय और स्थान की आवश्यकता है। देखो पंचांग पर निःशुल्क कुण्डली जनरेटर का उपयोग करें — अपना जन्म विवरण भरें और उपकरण आपकी राशि, नक्षत्र और ग्रह स्थिति की गणना करेगा।',
      },
    },
  ],

  // ─── /matching ──────────────────────────────────────────────
  '/matching': [
    {
      question: {
        en: 'What is Ashta Kuta matching?',
        hi: 'अष्ट कूट मिलान क्या है?',
      },
      answer: {
        en: 'Ashta Kuta is the traditional Vedic method for assessing marriage compatibility by comparing the birth Nakshatras of the bride and groom across 8 categories (Kutas): Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi. The maximum score is 36 Gunas. Dekho Panchang computes all 8 Kutas with detailed breakdowns and recommendations.',
        hi: 'अष्ट कूट वैदिक विवाह मिलान की पारंपरिक पद्धति है जिसमें वर-वधू के जन्म नक्षत्रों की 8 कूटों में तुलना की जाती है: वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट और नाडी। अधिकतम 36 गुण होते हैं। देखो पंचांग सभी 8 कूटों की विस्तृत गणना प्रस्तुत करता है।',
      },
    },
    {
      question: {
        en: 'What is the minimum Guna score required for marriage?',
        hi: 'विवाह के लिए न्यूनतम कितने गुण आवश्यक हैं?',
      },
      answer: {
        en: 'Traditionally, a minimum of 18 out of 36 Gunas is considered acceptable for marriage. Scores above 24 are considered good, and above 30 are excellent. However, individual Kuta scores matter too — a high total with a Nadi Dosha (0 in Nadi Kuta) may still raise concerns. Our matching tool highlights specific Dosha warnings alongside the total score.',
        hi: 'परम्परागत रूप से 36 में से न्यूनतम 18 गुण विवाह के लिए स्वीकार्य माने जाते हैं। 24 से अधिक गुण अच्छे और 30 से अधिक उत्तम माने जाते हैं। किन्तु व्यक्तिगत कूट भी महत्वपूर्ण हैं — नाडी दोष होने पर कुल गुण अधिक होने पर भी चिन्ता हो सकती है।',
      },
    },
    {
      question: {
        en: 'What is Mangal Dosha and does it affect matching?',
        hi: 'मंगल दोष क्या है और क्या यह मिलान को प्रभावित करता है?',
      },
      answer: {
        en: 'Mangal Dosha (Kuja Dosha) occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus in the birth chart. It is traditionally believed to cause difficulties in marriage. When both partners are Manglik, the Dosha is considered cancelled. Our matching tool checks for Mangal Dosha in both charts and notes any cancellation conditions.',
        hi: 'मंगल दोष (कुज दोष) तब होता है जब मंगल ग्रह जन्म कुण्डली में लग्न, चन्द्र या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में स्थित हो। परम्परा के अनुसार यह वैवाहिक कठिनाइयों का कारण माना जाता है। जब दोनों वर-वधू मांगलिक हों तो दोष निरस्त माना जाता है।',
      },
    },
  ],

  // ─── /horoscope ─────────────────────────────────────────────
  '/horoscope': [
    {
      question: {
        en: 'How is the daily horoscope calculated on Dekho Panchang?',
        hi: 'देखो पंचांग पर दैनिक राशिफल की गणना कैसे होती है?',
      },
      answer: {
        en: 'Our daily horoscope is derived from real-time planetary transits computed using Vedic sidereal astronomy. We analyze the current positions of the Sun, Moon, and major planets relative to each Moon sign (Rashi) to provide predictions grounded in actual celestial movements rather than generic templates.',
        hi: 'हमारा दैनिक राशिफल वैदिक सायन खगोल विज्ञान द्वारा गणना किए गए वास्तविक ग्रह गोचर पर आधारित है। हम प्रत्येक चन्द्र राशि के सापेक्ष सूर्य, चन्द्र और प्रमुख ग्रहों की वर्तमान स्थिति का विश्लेषण करते हैं।',
      },
    },
    {
      question: {
        en: 'Should I use my Sun sign or Moon sign for Vedic horoscope?',
        hi: 'वैदिक राशिफल के लिए सूर्य राशि या चन्द्र राशि का उपयोग करें?',
      },
      answer: {
        en: 'In Vedic astrology, the Moon sign (Chandra Rashi) is the primary reference for daily horoscopes, as the Moon governs the mind, emotions, and daily experiences. Western horoscopes typically use the Sun sign. If you know your Vedic Moon sign, use that for the most relevant predictions on Dekho Panchang.',
        hi: 'वैदिक ज्योतिष में दैनिक राशिफल के लिए चन्द्र राशि प्रमुख संदर्भ है क्योंकि चन्द्रमा मन, भावनाओं और दैनिक अनुभवों का शासक है। पाश्चात्य राशिफल सामान्यतः सूर्य राशि का उपयोग करता है। सबसे सटीक फल के लिए अपनी वैदिक चन्द्र राशि का उपयोग करें।',
      },
    },
    {
      question: {
        en: 'How often is the horoscope updated?',
        hi: 'राशिफल कितनी बार अपडेट होता है?',
      },
      answer: {
        en: 'The daily horoscope on Dekho Panchang is updated every day based on the actual planetary transit positions for that date. Since planetary positions change continuously, each day brings fresh astrological influences that are reflected in the updated predictions for all 12 Rashis.',
        hi: 'देखो पंचांग पर दैनिक राशिफल प्रतिदिन उस तिथि के वास्तविक ग्रह गोचर के आधार पर अपडेट होता है। चूँकि ग्रहों की स्थिति निरन्तर बदलती रहती है, प्रतिदिन सभी 12 राशियों के लिए नवीन भविष्यफल प्रस्तुत किये जाते हैं।',
      },
    },
  ],

  // ─── /kundali ───────────────────────────────────────────────
  '/kundali': [
    {
      question: {
        en: 'What is a Kundali (birth chart)?',
        hi: 'कुण्डली (जन्म पत्रिका) क्या है?',
      },
      answer: {
        en: 'A Kundali (also called Janam Kundli or birth chart) is a map of the sky at the exact moment and location of your birth, showing the positions of the Sun, Moon, and planets across the 12 houses and zodiac signs. It forms the foundation of Vedic astrology predictions including Dashas, Yogas, and life event timing. Dekho Panchang generates your complete Kundali for free.',
        hi: 'कुण्डली (जन्म कुण्डली या जन्म पत्रिका) आपके जन्म के सटीक समय और स्थान पर आकाश का मानचित्र है, जो 12 भावों और राशियों में सूर्य, चन्द्र और ग्रहों की स्थिति दर्शाती है। यह दशा, योग और जीवन की घटनाओं के समय की भविष्यवाणी का आधार है।',
      },
    },
    {
      question: {
        en: 'What is the difference between North Indian and South Indian chart styles?',
        hi: 'उत्तर भारतीय और दक्षिण भारतीय कुण्डली शैली में क्या अन्तर है?',
      },
      answer: {
        en: 'The North Indian chart uses a diamond-shaped layout where the houses remain fixed and signs rotate based on the Ascendant. The South Indian chart uses a rectangular grid where the signs remain fixed and houses rotate. Both contain identical astronomical data — the choice is regional preference. Dekho Panchang supports both styles with a toggle switch.',
        hi: 'उत्तर भारतीय कुण्डली हीरे के आकार की होती है जिसमें भाव स्थिर रहते हैं और राशियाँ लग्न के अनुसार बदलती हैं। दक्षिण भारतीय कुण्डली आयताकार होती है जिसमें राशियाँ स्थिर रहती हैं। दोनों में खगोलीय जानकारी एक समान होती है — चयन क्षेत्रीय प्राथमिकता है।',
      },
    },
    {
      question: {
        en: 'Why does exact birth time matter for Kundali?',
        hi: 'कुण्डली के लिए सटीक जन्म समय क्यों महत्वपूर्ण है?',
      },
      answer: {
        en: 'The Ascendant (Lagna) changes approximately every 2 hours, and the Moon changes Nakshatra roughly every day. Even a few minutes\' difference can shift the Lagna, alter house placements, and change the Vimshottari Dasha sequence entirely. Accurate birth time is essential for reliable predictions — our tool allows time input down to the minute for precision.',
        hi: 'लग्न लगभग प्रत्येक 2 घण्टे में बदलता है और चन्द्रमा प्रतिदिन नक्षत्र बदलता है। कुछ मिनटों का अन्तर भी लग्न बदल सकता है, भाव-स्थिति और विंशोत्तरी दशा क्रम पूर्णतः परिवर्तित हो सकता है। विश्वसनीय भविष्यवाणी के लिए सटीक जन्म समय अत्यावश्यक है।',
      },
    },
  ],

  // ─── /muhurta-ai ────────────────────────────────────────────
  '/muhurta-ai': [
    {
      question: {
        en: 'What is Muhurta in Vedic astrology?',
        hi: 'वैदिक ज्योतिष में मुहूर्त क्या है?',
      },
      answer: {
        en: 'Muhurta is the Vedic science of selecting an auspicious date and time for important activities such as marriage, housewarming, travel, or starting a business. It considers multiple factors including Tithi, Nakshatra, Yoga, planetary positions, and the individual\'s birth chart to find the most favourable window for success.',
        hi: 'मुहूर्त विवाह, गृह प्रवेश, यात्रा या व्यापार आरम्भ जैसे महत्वपूर्ण कार्यों के लिए शुभ तिथि और समय चुनने का वैदिक विज्ञान है। यह तिथि, नक्षत्र, योग, ग्रह स्थिति और व्यक्ति की जन्म कुण्डली सहित अनेक कारकों पर विचार करता है।',
      },
    },
    {
      question: {
        en: 'How does the AI Muhurta finder work?',
        hi: 'AI मुहूर्त खोजक कैसे काम करता है?',
      },
      answer: {
        en: 'Our AI Muhurta finder evaluates multiple Vedic factors simultaneously — Panchang elements, planetary transits, Choghadiya, Rahu Kaal, and activity-specific rules — to score and rank time windows. It uses a multi-factor scoring algorithm that weighs each element according to classical Jyotish texts, presenting the top-ranked auspicious windows for your chosen activity and location.',
        hi: 'हमारा AI मुहूर्त खोजक एक साथ अनेक वैदिक कारकों — पंचांग तत्व, ग्रह गोचर, चौघड़िया, राहु काल और कार्य-विशिष्ट नियमों — का मूल्यांकन करता है। यह शास्त्रीय ज्योतिष ग्रन्थों के अनुसार प्रत्येक तत्व को महत्व देकर शुभ समय खिड़कियों की रैंकिंग प्रस्तुत करता है।',
      },
    },
    {
      question: {
        en: 'Which activities are supported by the Muhurta AI tool?',
        hi: 'मुहूर्त AI उपकरण में कौन-कौन से कार्य समर्थित हैं?',
      },
      answer: {
        en: 'Dekho Panchang\'s Muhurta AI supports 20 activities including marriage, housewarming (Griha Pravesh), travel, vehicle purchase, business launch, property purchase, naming ceremony, education start, medical procedures, job joining, gold purchase, loan signing, court hearings, and more. Each activity has specific Vedic rules that the AI applies automatically.',
        hi: 'देखो पंचांग का मुहूर्त AI विवाह, गृह प्रवेश, यात्रा, वाहन खरीद, व्यापार आरम्भ, भूमि खरीद, नामकरण, शिक्षा आरम्भ, चिकित्सा, स्वर्ण खरीद सहित 20 कार्यों का समर्थन करता है। प्रत्येक कार्य के लिए विशिष्ट वैदिक नियम स्वचालित रूप से लागू होते हैं।',
      },
    },
  ],

  // ─── /rahu-kaal ─────────────────────────────────────────────
  '/rahu-kaal': [
    {
      question: {
        en: 'What is Rahu Kaal?',
        hi: 'राहु काल क्या है?',
      },
      answer: {
        en: 'Rahu Kaal (Rahu Kalam) is an inauspicious period of approximately 1.5 hours that occurs every day, ruled by the shadow planet Rahu. It is calculated by dividing the daytime (sunrise to sunset) into 8 equal parts, with a specific segment assigned to Rahu based on the day of the week. Important new undertakings are traditionally avoided during this period.',
        hi: 'राहु काल प्रतिदिन लगभग 1.5 घण्टे की अशुभ अवधि है जो छाया ग्रह राहु द्वारा शासित होती है। इसकी गणना दिन के समय (सूर्योदय से सूर्यास्त) को 8 बराबर भागों में विभाजित करके की जाती है। इस अवधि में नए महत्वपूर्ण कार्य आरम्भ करना परम्परागत रूप से वर्जित है।',
      },
    },
    {
      question: {
        en: 'Does Rahu Kaal timing change by city?',
        hi: 'क्या राहु काल का समय शहर के अनुसार बदलता है?',
      },
      answer: {
        en: 'Yes, Rahu Kaal timing varies by city because it depends on local sunrise and sunset times. Cities at different latitudes and longitudes have different day lengths, which shifts all 8 segments including Rahu Kaal. Dekho Panchang calculates Rahu Kaal precisely for your location using your geographic coordinates.',
        hi: 'हाँ, राहु काल का समय शहर के अनुसार बदलता है क्योंकि यह स्थानीय सूर्योदय और सूर्यास्त पर निर्भर करता है। भिन्न अक्षांश-देशान्तर वाले शहरों में दिन की अवधि भिन्न होती है, जिससे राहु काल सहित सभी 8 भाग बदल जाते हैं।',
      },
    },
    {
      question: {
        en: 'What is the difference between Rahu Kaal and Rahu Kalam?',
        hi: 'राहु काल और राहु कालम् में क्या अन्तर है?',
      },
      answer: {
        en: 'Rahu Kaal and Rahu Kalam refer to the same inauspicious time period — there is no astrological difference. "Rahu Kaal" is the Hindi/North Indian term while "Rahu Kalam" is the Tamil/South Indian term. Both represent the daily 1.5-hour window ruled by Rahu that is computed identically regardless of the name used.',
        hi: 'राहु काल और राहु कालम् एक ही अशुभ अवधि के दो नाम हैं — ज्योतिषीय दृष्टि से कोई अन्तर नहीं है। "राहु काल" हिन्दी/उत्तर भारतीय और "राहु कालम्" तमिल/दक्षिण भारतीय शब्द है। दोनों राहु द्वारा शासित दैनिक 1.5 घण्टे की अवधि को दर्शाते हैं।',
      },
    },
  ],

  // ─── /dates/ekadashi ─────────────────────────────────────────
  '/dates/ekadashi': [
    {
      question: {
        en: 'How many Ekadashis are there in a year?',
        hi: 'एक वर्ष में कितनी एकादशियाँ होती हैं?',
      },
      answer: {
        en: 'There are typically 24 Ekadashis in a year — two per lunar month, one in Shukla Paksha (waxing moon) and one in Krishna Paksha (waning moon). In a leap year (Adhika Masa), two extra Ekadashis are added, totalling 26. Each Ekadashi has a unique name and spiritual significance described in the Puranas.',
        hi: 'एक वर्ष में सामान्यतः 24 एकादशियाँ होती हैं — प्रत्येक चान्द्र मास में दो, एक शुक्ल पक्ष में और एक कृष्ण पक्ष में। अधिक मास वाले वर्ष में दो अतिरिक्त एकादशियाँ जुड़ जाती हैं।',
      },
    },
    {
      question: {
        en: 'What is Ekadashi fasting (Ekadashi Vrat)?',
        hi: 'एकादशी व्रत क्या है?',
      },
      answer: {
        en: 'Ekadashi Vrat involves fasting on the 11th Tithi of each lunar fortnight. Devotees abstain from grains and beans, consuming only fruits, milk, and root vegetables. The fast is broken on Dwadashi (12th Tithi) during the Parana window — the auspicious time calculated from the end of Ekadashi Tithi. Nirjala Ekadashi (Jyeshtha Shukla) is the strictest, observed without water.',
        hi: 'एकादशी व्रत में प्रत्येक पक्ष की 11वीं तिथि को उपवास रखा जाता है। भक्त अन्न और दालों से परहेज करते हैं। व्रत द्वादशी (12वीं तिथि) को पारण काल में तोड़ा जाता है। निर्जला एकादशी सबसे कठोर व्रत है।',
      },
    },
  ],

  // ─── /dates/purnima ─────────────────────────────────────────
  '/dates/purnima': [
    {
      question: {
        en: 'How many Purnimas are there in a year?',
        hi: 'एक वर्ष में कितनी पूर्णिमा होती हैं?',
      },
      answer: {
        en: 'There are 12 Purnimas (full moons) in a regular year, one per lunar month. In a year with an Adhika Masa (intercalary month), there are 13 Purnimas. Each Purnima is named after its lunar month — for example, Kartik Purnima, Vaishakh Purnima, etc.',
        hi: 'सामान्य वर्ष में 12 पूर्णिमा होती हैं, प्रत्येक चान्द्र मास में एक। अधिक मास वाले वर्ष में 13 पूर्णिमा होती हैं। प्रत्येक पूर्णिमा अपने चान्द्र मास के नाम से जानी जाती है।',
      },
    },
    {
      question: {
        en: 'Which Purnima is most important?',
        hi: 'कौन सी पूर्णिमा सबसे महत्वपूर्ण है?',
      },
      answer: {
        en: 'Several Purnimas hold special significance: Guru Purnima (Ashadha) honours spiritual teachers, Sharad Purnima (Ashwin) is celebrated for the brightest full moon, Kartik Purnima is sacred for holy dips and lighting lamps, and Buddha Purnima (Vaishakh) marks the birth of Gautama Buddha. Holi is celebrated on Phalguna Purnima.',
        hi: 'गुरु पूर्णिमा (आषाढ़) गुरुओं को समर्पित है, शरद पूर्णिमा (आश्विन) सबसे उज्ज्वल पूर्ण चन्द्रमा के लिए प्रसिद्ध है, कार्तिक पूर्णिमा पवित्र स्नान और दीपदान के लिए है, और बुद्ध पूर्णिमा (वैशाख) गौतम बुद्ध के जन्म का प्रतीक है।',
      },
    },
  ],

  // ─── /dates/amavasya ────────────────────────────────────────
  '/dates/amavasya': [
    {
      question: {
        en: 'Is Amavasya auspicious or inauspicious?',
        hi: 'क्या अमावस्या शुभ है या अशुभ?',
      },
      answer: {
        en: 'Amavasya is generally considered inauspicious for starting new ventures, marriages, and housewarming ceremonies. However, it is highly auspicious for Pitru Tarpan (ancestor offerings), Shani Puja, Kali worship, and Tantric practices. Somvati Amavasya (falling on Monday) and Mauni Amavasya (in Magha) are especially sacred for holy bathing and charity.',
        hi: 'अमावस्या नए कार्यों, विवाह और गृह प्रवेश के लिए अशुभ मानी जाती है। परन्तु पितृ तर्पण, शनि पूजा, काली पूजा और तान्त्रिक साधना के लिए अत्यन्त शुभ है। सोमवती अमावस्या और मौनी अमावस्या विशेष पवित्र हैं।',
      },
    },
  ],

  // ─── /dates/pradosham ───────────────────────────────────────
  '/dates/pradosham': [
    {
      question: {
        en: 'What is the difference between Shani Pradosham and Soma Pradosham?',
        hi: 'शनि प्रदोष और सोम प्रदोष में क्या अन्तर है?',
      },
      answer: {
        en: 'When Pradosham (Trayodashi Tithi) falls on a Saturday, it is called Shani Pradosham — considered especially powerful for removing karmic debts and Saturn-related afflictions. When it falls on Monday, it is Soma Pradosham — ideal for devotion to Lord Shiva, as Monday is already Shiva\'s day. Both are observed during the twilight period (1.5 hours before and after sunset).',
        hi: 'जब प्रदोष (त्रयोदशी तिथि) शनिवार को पड़ता है तो शनि प्रदोष कहलाता है — कर्मऋण और शनि दोष निवारण के लिए विशेष शक्तिशाली। सोमवार को सोम प्रदोष होता है — शिव भक्ति के लिए सर्वोत्तम। दोनों सन्ध्याकाल में मनाए जाते हैं।',
      },
    },
  ],

  // ─── /dates/chaturthi ──────────────────────────────────────
  '/dates/chaturthi': [
    {
      question: {
        en: 'What is the difference between Sankashti and Vinayaka Chaturthi?',
        hi: 'संकष्टी और विनायक चतुर्थी में क्या अन्तर है?',
      },
      answer: {
        en: 'Sankashti Chaturthi falls on Krishna Paksha Chaturthi (4th day of the waning moon) and involves fasting until moonrise, followed by Ganesh Puja and moon sighting. Vinayaka Chaturthi falls on Shukla Paksha Chaturthi (4th day of the waxing moon) and is considered ideal for beginning new works. When Sankashti falls on Tuesday, it is called Angaraki Chaturthi — the most auspicious of all monthly Chaturthis.',
        hi: 'संकष्टी चतुर्थी कृष्ण पक्ष चतुर्थी को पड़ती है — चन्द्रोदय तक उपवास और गणेश पूजा की जाती है। विनायक चतुर्थी शुक्ल पक्ष चतुर्थी को होती है — नए कार्य आरम्भ के लिए शुभ। मंगलवार को पड़ने वाली संकष्टी अंगारकी चतुर्थी कहलाती है — सबसे शुभ।',
      },
    },
  ],

  // ─── /choghadiya ────────────────────────────────────────────
  '/choghadiya': [
    {
      question: {
        en: 'What is Choghadiya?',
        hi: 'चौघड़िया क्या है?',
      },
      answer: {
        en: 'Choghadiya (also spelled Chaughadia) is a Vedic time-division system that splits each day and night into 8 periods of approximately 1.5 hours each. Each period is ruled by a specific planet and classified as Shubh (auspicious), Labh (profitable), Amrit (excellent), Char (average), Rog (inauspicious), Kaal (bad), or Udyog (suitable for work). It is widely used in Gujarat and Western India for timing daily activities.',
        hi: 'चौघड़िया वैदिक समय-विभाजन पद्धति है जो प्रत्येक दिन और रात को लगभग 1.5 घण्टे की 8 अवधियों में बाँटती है। प्रत्येक अवधि एक विशेष ग्रह द्वारा शासित होती है और शुभ, लाभ, अमृत, चर, रोग, काल या उद्योग के रूप में वर्गीकृत है। यह गुजरात और पश्चिम भारत में व्यापक रूप से प्रयुक्त होती है।',
      },
    },
    {
      question: {
        en: 'Which Choghadiya is best for travel?',
        hi: 'यात्रा के लिए कौन सा चौघड़िया सबसे अच्छा है?',
      },
      answer: {
        en: 'For travel, the "Labh" (profitable, ruled by Mercury) and "Amrit" (excellent, ruled by Moon) Choghadiyas are considered the best. "Shubh" (auspicious, ruled by Jupiter) is also favourable. Avoid starting journeys during "Rog" (ruled by Mars) and "Kaal" (ruled by Saturn) periods. Our Choghadiya tool highlights the best travel windows for your location.',
        hi: 'यात्रा के लिए "लाभ" (बुध शासित) और "अमृत" (चन्द्र शासित) चौघड़िया सर्वोत्तम माने जाते हैं। "शुभ" (गुरु शासित) भी अनुकूल है। "रोग" (मंगल शासित) और "काल" (शनि शासित) अवधि में यात्रा आरम्भ से बचें।',
      },
    },
    {
      question: {
        en: 'How many Choghadiya periods are there in a day?',
        hi: 'एक दिन में कितने चौघड़िया होते हैं?',
      },
      answer: {
        en: 'There are 16 Choghadiya periods in a full day — 8 during daytime (sunrise to sunset) and 8 during nighttime (sunset to next sunrise). The duration of each period is not a fixed 1.5 hours; it varies by season because daytime and nighttime lengths change throughout the year. Dekho Panchang calculates exact Choghadiya times based on your location\'s actual sunrise and sunset.',
        hi: 'पूरे दिन में 16 चौघड़िया होते हैं — दिन में 8 (सूर्योदय से सूर्यास्त) और रात में 8 (सूर्यास्त से अगले सूर्योदय तक)। प्रत्येक अवधि निश्चित 1.5 घण्टे की नहीं होती; यह ऋतु के अनुसार बदलती है क्योंकि दिन-रात की अवधि वर्ष भर बदलती रहती है।',
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

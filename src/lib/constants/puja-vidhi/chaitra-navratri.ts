import type { PujaVidhi } from './types';

export const CHAITRA_NAVRATRI_PUJA: PujaVidhi = {
  festivalSlug: 'chaitra-navratri',
  category: 'festival',
  deity: { en: 'Durga (Nine Forms — Navadurga)', hi: 'दुर्गा (नौ रूप — नवदुर्गा)', sa: 'दुर्गा (नवरूपाणि — नवदुर्गा)' },

  samagri: [
    { name: { en: 'Kalash (copper/brass pot)', hi: 'कलश (ताँबा/पीतल)', sa: 'कलशः (ताम्र/पीतलपात्रम्)' }, category: 'vessels', essential: true },
    { name: { en: 'Mango leaves', hi: 'आम के पत्ते', sa: 'आम्रपत्राणि' }, quantity: '5-7', category: 'flowers', essential: true },
    { name: { en: 'Coconut (whole with husk)', hi: 'नारियल (छिलके सहित)', sa: 'नारिकेलम् (सवल्कलम्)' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'Red cloth (chunri)', hi: 'लाल चुनरी', sa: 'रक्तवस्त्रम् (चुनरी)' }, category: 'clothing', essential: true },
    { name: { en: 'Barley seeds (Jau)', hi: 'जौ के बीज', sa: 'यवबीजानि' }, category: 'puja_items', essential: true },
    { name: { en: 'Soil (clean earth)', hi: 'मिट्टी (शुद्ध)', sa: 'मृत्तिका (शुद्धा)' }, category: 'puja_items', essential: true },
    { name: { en: 'Durga idol or image', hi: 'दुर्गा मूर्ति या चित्र', sa: 'दुर्गामूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp (akhand jyoti)', hi: 'घी का अखण्ड दीपक', sa: 'घृताखण्डज्योतिः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Red flowers (hibiscus, rose)', hi: 'लाल फूल (गुड़हल, गुलाब)', sa: 'रक्तपुष्पाणि (जपापुष्पम्, शतपत्रम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Incense sticks and camphor', hi: 'अगरबत्ती और कपूर', sa: 'धूपं कर्पूरं च' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Fruits (banana, apple, coconut)', hi: 'फल (केला, सेब, नारियल)', sa: 'फलानि (कदलीफलम्, सेवफलम्, नारिकेलम्)' }, category: 'food', essential: false },
    { name: { en: 'Supari and paan leaves', hi: 'सुपारी और पान', sa: 'पूगीफलं ताम्बूलपत्राणि च' }, quantity: '5', category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Chaitra Navratri begins on Chaitra Shukla Pratipada (Hindu New Year). Ghatasthapana must be performed during the first one-third of the day (Pratahkaal), ideally during Abhijit Muhurta. Avoid Chitra Nakshatra and Vaidhriti Yoga.',
    hi: 'चैत्र नवरात्रि चैत्र शुक्ल प्रतिपदा (हिन्दू नववर्ष) से शुरू होती है। घटस्थापना दिन के पहले एक-तिहाई भाग (प्रातःकाल) में, विशेषकर अभिजित मुहूर्त में करनी चाहिए। चित्रा नक्षत्र और वैधृति योग से बचें।',
    sa: 'चैत्रनवरात्रिः चैत्रशुक्लप्रतिपदायाम् (हिन्दूनववर्षे) आरभ्यते। घटस्थापना दिनस्य प्रथमतृतीयांशे (प्रातःकाले) विशेषतः अभिजिन्मुहूर्ते कर्तव्या। चित्रानक्षत्रं वैधृतियोगं च वर्जयेत्।',
  },
  muhurtaWindow: { type: 'abhijit' },

  sankalpa: {
    en: 'On this auspicious Chaitra Shukla Pratipada, the beginning of Navratri, I worship Goddess Durga in her nine forms (Navadurga) for the removal of obstacles, destruction of evil, and bestowal of strength, wisdom, and prosperity.',
    hi: 'इस शुभ चैत्र शुक्ल प्रतिपदा, नवरात्रि के आरम्भ पर, मैं विघ्न निवारण, दुष्टों के विनाश और शक्ति, ज्ञान एवं समृद्धि की प्राप्ति के लिए देवी दुर्गा की नौ रूपों (नवदुर्गा) में पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे चैत्रशुक्लप्रतिपदायां नवरात्र्यारम्भे विघ्ननिवारणाय दुष्टविनाशाय शक्तिप्रज्ञासमृद्धिप्रदानाय च देवीं दुर्गां नवरूपेषु (नवदुर्गायाम्) पूजयामि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Ghatasthapana (Kalash Installation)', hi: 'घटस्थापना (कलश स्थापना)', sa: 'घटस्थापना (कलशस्थापनम्)' },
      description: {
        en: 'Clean the puja area. Place clean soil in a clay pot and sow barley seeds. Fill the kalash with water, place mango leaves around the rim, and set a coconut on top wrapped in red cloth. Install the kalash on the soil bed. This represents Goddess Durga.',
        hi: 'पूजा स्थल साफ करें। मिट्टी के बर्तन में शुद्ध मिट्टी भरकर जौ के बीज बोएँ। कलश में जल भरें, किनारे पर आम के पत्ते रखें और ऊपर लाल कपड़े में लिपटा नारियल रखें। कलश को मिट्टी के ऊपर स्थापित करें। यह देवी दुर्गा का प्रतीक है।',
        sa: 'पूजास्थलं शोधयेत्। मृण्मयपात्रे शुद्धमृत्तिकां पूरयित्वा यवबीजानि वपेत्। कलशं जलेन पूरयेत्, कण्ठे आम्रपत्राणि विन्यसेत्, उपरि रक्तवस्त्रवेष्टितं नारिकेलं स्थापयेत्। कलशं मृत्तिकोपरि स्थापयेत्। एतत् देव्याः दुर्गायाः प्रतीकम्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 2,
      title: { en: 'Akhand Jyoti (Eternal Lamp)', hi: 'अखण्ड ज्योति', sa: 'अखण्डज्योतिः' },
      description: {
        en: 'Light the akhand jyoti (eternal flame) near the kalash. This lamp must remain burning continuously for all 9 days and nights of Navratri. Use ghee or sesame oil.',
        hi: 'कलश के पास अखण्ड ज्योति जलाएँ। यह दीपक नवरात्रि की सभी 9 दिन और रातों में लगातार जलता रहना चाहिए। घी या तिल के तेल का उपयोग करें।',
        sa: 'कलशसमीपे अखण्डज्योतिं प्रज्वालयेत्। एषा ज्योतिः नवरात्र्याः सर्वेषु नवदिनेषु नवरात्रिषु च निरन्तरं प्रज्वलिता तिष्ठेत्। घृतं तिलतैलं वा प्रयुज्यताम्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Sankalpa', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water and akshat in the right hand. State your name, gotra, the tithi (Chaitra Shukla Pratipada), and resolve to worship Navadurga for 9 days. Release the water.',
        hi: 'दाहिने हाथ में जल और अक्षत लें। अपना नाम, गोत्र, तिथि (चैत्र शुक्ल प्रतिपदा) बताएँ और 9 दिनों तक नवदुर्गा पूजा का संकल्प करें। जल छोड़ें।',
        sa: 'दक्षिणहस्ते जलाक्षतान् गृहीत्वा स्वनाम गोत्रं तिथिं (चैत्रशुक्लप्रतिपदा) वदेत् नवदिनपर्यन्तं नवदुर्गापूजनस्य सङ्कल्पं कुर्यात्। जलं विसृजेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Daily Navadurga Worship (9 Days)', hi: 'दैनिक नवदुर्गा पूजन (9 दिन)', sa: 'प्रतिदिनं नवदुर्गापूजनम् (नवदिनानि)' },
      description: {
        en: 'Each day, worship the specific form of Durga: Day 1 — Shailaputri, Day 2 — Brahmacharini, Day 3 — Chandraghanta, Day 4 — Kushmanda, Day 5 — Skandamata, Day 6 — Katyayani, Day 7 — Kalaratri, Day 8 — Mahagauri, Day 9 — Siddhidatri. Offer the designated color flower and recite the specific mantra for each form.',
        hi: 'प्रतिदिन दुर्गा के विशिष्ट रूप की पूजा करें: दिन 1 — शैलपुत्री, दिन 2 — ब्रह्मचारिणी, दिन 3 — चन्द्रघण्टा, दिन 4 — कूष्माण्डा, दिन 5 — स्कन्दमाता, दिन 6 — कात्यायनी, दिन 7 — कालरात्रि, दिन 8 — महागौरी, दिन 9 — सिद्धिदात्री। निर्धारित रंग का फूल चढ़ाएँ और प्रत्येक रूप का विशिष्ट मंत्र पढ़ें।',
        sa: 'प्रतिदिनं दुर्गायाः विशिष्टरूपं पूजयेत्: प्रथमदिने — शैलपुत्री, द्वितीयदिने — ब्रह्मचारिणी, तृतीयदिने — चन्द्रघण्टा, चतुर्थदिने — कूष्माण्डा, पञ्चमदिने — स्कन्दमाता, षष्ठदिने — कात्यायनी, सप्तमदिने — कालरात्रि, अष्टमदिने — महागौरी, नवमदिने — सिद्धिदात्री। निर्धारितवर्णपुष्पं समर्पयेत् प्रत्येकरूपस्य विशिष्टमन्त्रं च पठेत्।',
      },
      duration: '30 min per day',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Durga Beej Mantra Japa', hi: 'दुर्गा बीज मंत्र जप', sa: 'दुर्गाबीजमन्त्रजपः' },
      description: {
        en: 'After the daily worship, chant the Durga Beej Mantra 108 times. This is the core mantra practice for all 9 days of Navratri.',
        hi: 'दैनिक पूजा के बाद दुर्गा बीज मंत्र का 108 बार जप करें। यह नवरात्रि के सभी 9 दिनों का मुख्य मंत्र अभ्यास है।',
        sa: 'प्रतिदिनपूजनानन्तरं दुर्गाबीजमन्त्रम् अष्टोत्तरशतवारं जपेत्। एषः नवरात्र्याः सर्वेषां नवदिनानां प्रधानमन्त्राभ्यासः।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'mantra',
      mantraRef: 'durga-beej',
    },
    {
      step: 6,
      title: { en: 'Kanya Puja (Day 8 or 9)', hi: 'कन्या पूजन (दिन 8 या 9)', sa: 'कन्यापूजनम् (अष्टमे नवमे वा दिने)' },
      description: {
        en: 'On Ashtami or Navami, invite 9 young girls (representing 9 forms of Durga) for Kanya Puja. Wash their feet, apply tilak, offer them food, sweets, gifts, and dakshina. This is one of the most sacred acts of Navratri.',
        hi: 'अष्टमी या नवमी पर 9 कन्याओं (दुर्गा के 9 रूपों का प्रतिनिधित्व) को कन्या पूजन के लिए आमन्त्रित करें। उनके पैर धोएँ, तिलक लगाएँ, भोजन, मिठाई, उपहार और दक्षिणा दें। यह नवरात्रि का सबसे पवित्र कर्म है।',
        sa: 'अष्टम्यां नवम्यां वा नवकन्याः (दुर्गायाः नवरूपप्रतिनिधयः) कन्यापूजनाय निमन्त्रयेत्। तासां पादान् प्रक्षालयेत्, तिलकं कुर्यात्, भोजनं मिष्टान्नम् उपहारान् दक्षिणां च दद्यात्। एतत् नवरात्र्याः पवित्रतमं कर्म।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Havan & Visarjan (Day 9)', hi: 'हवन एवं विसर्जन (दिन 9)', sa: 'हवनं विसर्जनं च (नवमे दिने)' },
      description: {
        en: 'On the final day, perform havan (fire ritual) with Navratri samagri. Offer ghee, samagri, and recite Durga mantras. After havan, do visarjan of the kalash — immerse or respectfully dispose of the items. The sprouted barley is distributed as prasad.',
        hi: 'अन्तिम दिन नवरात्रि सामग्री से हवन (अग्नि अनुष्ठान) करें। घी, सामग्री अर्पित करें और दुर्गा मंत्र पढ़ें। हवन के बाद कलश का विसर्जन करें — सामग्री को विसर्जित करें या सम्मानपूर्वक अलग करें। अंकुरित जौ प्रसाद के रूप में बाँटें।',
        sa: 'अन्तिमदिने नवरात्रिसामग्र्या हवनं (अग्निकर्म) कुर्यात्। घृतं सामग्रीं च समर्पयेत् दुर्गामन्त्रान् पठेत्। हवनानन्तरं कलशस्य विसर्जनं कुर्यात्। अङ्कुरितयवान् प्रसादरूपेण वितरेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'durga-beej',
      name: { en: 'Durga Beej Mantra', hi: 'दुर्गा बीज मंत्र', sa: 'दुर्गाबीजमन्त्रः' },
      devanagari: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
      iast: 'oṃ aiṃ hrīṃ klīṃ cāmuṇḍāyai vicce',
      meaning: {
        en: 'Om, with the seed syllables of Saraswati (Aim), Lakshmi (Hrim), and Kali (Klim), I invoke Chamunda (Durga). This mantra contains the essence of Navarna (nine syllable) power.',
        hi: 'ॐ, सरस्वती (ऐं), लक्ष्मी (ह्रीं) और काली (क्लीं) के बीज मंत्रों सहित, मैं चामुण्डा (दुर्गा) का आह्वान करता/करती हूँ। इस मंत्र में नवार्ण (नौ अक्षर) शक्ति का सार है।',
        sa: 'ॐ, सरस्वत्याः (ऐं) लक्ष्म्याः (ह्रीं) कालिकायाः (क्लीं) बीजमन्त्रैः सह चामुण्डाम् (दुर्गाम्) आवाहयामि। अस्मिन् मन्त्रे नवार्णशक्तेः सारः विद्यते।',
      },
      usage: {
        en: 'Chant 108 times daily during Navratri for the grace of Goddess Durga.',
        hi: 'नवरात्रि में प्रतिदिन देवी दुर्गा की कृपा के लिए 108 बार जपें।',
        sa: 'नवरात्रौ प्रतिदिनं देव्याः दुर्गायाः अनुग्रहाय अष्टोत्तरशतवारं जपेत्।',
      },
      japaCount: 108,
    },
    {
      id: 'navadurga-dhyan',
      name: { en: 'Navadurga Dhyana Mantra', hi: 'नवदुर्गा ध्यान मंत्र', sa: 'नवदुर्गाध्यानमन्त्रः' },
      devanagari: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
      iast: 'sarvamaṅgalamāṅgalye śive sarvārthasādhike |\nśaraṇye tryambake gauri nārāyaṇi namo\'stu te ||',
      meaning: {
        en: 'O auspicious one among all that is auspicious, O Shiva, accomplisher of all goals, O refuge, three-eyed Gauri, O Narayani, I bow to you.',
        hi: 'हे सर्वमंगलों में मंगलमय, हे शिवे, सभी उद्देश्यों को सिद्ध करने वाली, हे शरण देने वाली, त्रिनेत्री गौरी, हे नारायणी, आपको नमस्कार।',
        sa: 'हे सर्वमङ्गलेषु माङ्गल्ये, हे शिवे सर्वार्थसाधिके, हे शरण्ये त्र्यम्बके गौरि, हे नारायणि, तुभ्यं नमः।',
      },
      usage: {
        en: 'Recite at the beginning and end of each day\'s Navratri puja.',
        hi: 'प्रत्येक दिन की नवरात्रि पूजा के आरम्भ और अन्त में पाठ करें।',
        sa: 'प्रतिदिनं नवरात्रिपूजायाः आरम्भे अन्ते च पठेत्।',
      },
    },
    {
      id: 'durga-gayatri',
      name: { en: 'Durga Gayatri Mantra', hi: 'दुर्गा गायत्री मंत्र', sa: 'दुर्गागायत्रीमन्त्रः' },
      devanagari: 'ॐ कात्यायनाय विद्महे कन्यकुमारि धीमहि।\nतन्नो दुर्गिः प्रचोदयात्॥',
      iast: 'oṃ kātyāyanāya vidmahe kanyakumāri dhīmahi |\ntanno durgiḥ pracodayāt ||',
      meaning: {
        en: 'Om, let us know Katyayani, let us meditate upon the Virgin Goddess. May Durga inspire and enlighten us.',
        hi: 'ॐ, हम कात्यायनी को जानें, कन्याकुमारी का ध्यान करें। दुर्गा हमें प्रेरित और प्रबुद्ध करें।',
        sa: 'ॐ, कात्यायनीं विद्मः, कन्याकुमारीं ध्यायामः। दुर्गिः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Chant during the havan on the final day or daily after the Beej mantra japa.',
        hi: 'अन्तिम दिन हवन के दौरान या प्रतिदिन बीज मंत्र जप के बाद जपें।',
        sa: 'अन्तिमदिने हवनकाले अथवा प्रतिदिनं बीजमन्त्रजपानन्तरं जपेत्।',
      },
      japaCount: 108,
    },
  ],

  naivedya: {
    en: 'Offer halwa-puri-chana on Ashtami/Navami. Daily offerings include fruits, coconut, kheer, and seasonal sweets. Sattvic (pure vegetarian) food only — avoid onion, garlic, and non-vegetarian items throughout the 9 days.',
    hi: 'अष्टमी/नवमी पर हलवा-पूरी-चना का भोग लगाएँ। दैनिक नैवेद्य में फल, नारियल, खीर और मौसमी मिठाइयाँ शामिल हैं। 9 दिनों तक केवल सात्विक (शुद्ध शाकाहारी) भोजन — प्याज़, लहसुन और मांसाहार वर्जित।',
    sa: 'अष्टम्यां/नवम्यां हल्वापूरीचनभोगं समर्पयेत्। प्रतिदिनं फलानि नारिकेलं पायसं ऋतुमिष्टान्नानि च नैवेद्यरूपेण दद्यात्। नवदिनपर्यन्तं केवलं सात्त्विकम् (शुद्धशाकाहारम्) — पलाण्डुं लशुनं मांसाहारं च वर्जयेत्।',
  },

  precautions: [
    {
      en: 'The Akhand Jyoti must not extinguish during the 9 days. Ensure sufficient ghee/oil supply and protect from wind.',
      hi: '9 दिनों में अखण्ड ज्योति बुझनी नहीं चाहिए। पर्याप्त घी/तेल सुनिश्चित करें और हवा से बचाएँ।',
      sa: 'नवदिनेषु अखण्डज्योतिः न निर्वापणीया। पर्याप्तं घृतं तैलं वा सुनिश्चितं कुर्यात् वायोश्च रक्षेत्।',
    },
    {
      en: 'Ghatasthapana timing is critical — it must not be done during Chitra Nakshatra, Vaidhriti Yoga, or after the first one-third of the day ends.',
      hi: 'घटस्थापना का समय अत्यन्त महत्वपूर्ण है — यह चित्रा नक्षत्र, वैधृति योग में या दिन का पहला एक-तिहाई बीतने के बाद नहीं की जानी चाहिए।',
      sa: 'घटस्थापनायाः कालः अत्यन्तं महत्त्वपूर्णः — चित्रानक्षत्रे वैधृतियोगे दिनस्य प्रथमतृतीयांशसमाप्त्यनन्तरं वा न कर्तव्या।',
    },
    {
      en: 'Maintain strict fasting discipline during the 9 days. If full fasting is not possible, observe phalahari (fruit-based) diet.',
      hi: '9 दिनों में कठोर उपवास अनुशासन बनाए रखें। यदि पूर्ण उपवास सम्भव न हो, तो फलाहारी व्रत रखें।',
      sa: 'नवदिनेषु कठोरं उपवासानुशासनं पालयेत्। यदि पूर्णोपवासः न शक्यः, फलाहारव्रतम् आचरेत्।',
    },
    {
      en: 'For Kanya Puja, the girls should ideally be between ages 2 and 10. Treat them with utmost reverence as embodiments of the Goddess.',
      hi: 'कन्या पूजन के लिए कन्याएँ आदर्शतः 2 से 10 वर्ष की हों। उन्हें देवी का स्वरूप मानकर अत्यन्त श्रद्धा से व्यवहार करें।',
      sa: 'कन्यापूजनाय कन्याः आदर्शतया द्विवर्षीयतः दशवर्षीयपर्यन्तं स्युः। ताः देव्याः मूर्तिरूपेण परमादरेण व्यवहरेत्।',
    },
  ],

  phala: {
    en: 'Chaitra Navratri bestows the combined blessings of all nine forms of Durga — strength, knowledge, courage, prosperity, health, protection from evil, spiritual progress, removal of obstacles, and fulfilment of desires. The sprouted barley signifies growth and abundance in the coming year.',
    hi: 'चैत्र नवरात्रि दुर्गा के सभी नौ रूपों का संयुक्त आशीर्वाद प्रदान करती है — शक्ति, ज्ञान, साहस, समृद्धि, स्वास्थ्य, दुष्टों से रक्षा, आध्यात्मिक प्रगति, विघ्न निवारण और मनोकामना पूर्ति। अंकुरित जौ आने वाले वर्ष में वृद्धि और समृद्धि का प्रतीक है।',
    sa: 'चैत्रनवरात्रिः दुर्गायाः सर्वेषां नवरूपाणां संयुक्तानुग्रहं प्रयच्छति — शक्तिं ज्ञानं साहसं समृद्धिम् आरोग्यं दुष्टरक्षां आध्यात्मिकप्रगतिं विघ्ननिवारणं मनोरथसिद्धिं च। अङ्कुरितयवाः आगामिवर्षे वृद्धिसमृद्ध्योः प्रतीकाः।',
  },
};

import type { PujaVidhi } from './types';

export const KAMADA_EKADASHI_PUJA: PujaVidhi = {
  festivalSlug: 'kamada-ekadashi',
  category: 'festival',
  deity: { en: 'Lord Vishnu (Kamadeva Liberator)', hi: 'भगवान विष्णु (कामदेव उद्धारक)', sa: 'भगवान् विष्णुः (कामदेवोद्धारकः)' },

  samagri: [
    { name: { en: 'Vishnu idol or image', hi: 'विष्णु मूर्ति या चित्र', sa: 'विष्णुमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Tulsi leaves', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, category: 'flowers', essential: true },
    { name: { en: 'Yellow flowers', hi: 'पीले फूल', sa: 'पीतपुष्पाणि' }, category: 'flowers', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Chandan (sandalwood paste)', hi: 'चन्दन', sa: 'चन्दनम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Panchamrit', hi: 'पंचामृत', sa: 'पञ्चामृतम्' }, category: 'food', essential: false },
    { name: { en: 'Fruits (banana, pomegranate)', hi: 'फल (केला, अनार)', sa: 'फलानि (कदलीफलं दाडिमं च)' }, category: 'food', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Kamada Ekadashi falls on Chaitra Shukla Ekadashi. The vrat begins on Dashami evening and the puja is performed on Ekadashi during Madhyahna (midday) muhurta. This is the first Ekadashi of the Hindu new year (Vikram Samvat).',
    hi: 'कामदा एकादशी चैत्र शुक्ल एकादशी को पड़ती है। व्रत दशमी सायंकाल से आरम्भ होता है और पूजा एकादशी को मध्याह्न मुहूर्त में की जाती है। यह हिन्दू नववर्ष (विक्रम सम्वत्) की पहली एकादशी है।',
    sa: 'कामदा एकादशी चैत्रशुक्लैकादश्यां भवति। व्रतं दशम्यां सायंकाले आरभ्यते पूजा एकादश्यां मध्याह्नमुहूर्ते क्रियते। इयं हिन्दुनववर्षस्य (विक्रमसम्वत्सरस्य) प्रथमा एकादशी।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Chaitra Shukla Ekadashi, I worship Lord Vishnu with the prayer that all my righteous desires (kama) be fulfilled. Just as Lord Vishnu liberated the Gandharva Lalit from his curse through this vrat, may He liberate me from all obstacles and grant the fulfilment of noble wishes.',
    hi: 'इस पवित्र चैत्र शुक्ल एकादशी पर, मैं भगवान विष्णु की पूजा करता/करती हूँ कि मेरी सभी धार्मिक कामनाएँ पूर्ण हों। जैसे भगवान विष्णु ने इस व्रत से गन्धर्व ललित को शाप से मुक्त किया, वे मुझे सभी बाधाओं से मुक्त करें और शुभ मनोकामनाओं की पूर्ति करें।',
    sa: 'अस्मिन् पुण्ये चैत्रशुक्लैकादश्यां भगवन्तं विष्णुं पूजयामि यत् मम सर्वाः धार्मिककामनाः पूर्णाः भवन्तु। यथा भगवान् विष्णुः अनेन व्रतेन गन्धर्वं ललितं शापात् मुक्तवान् तथा स मां सर्वविघ्नेभ्यो मोचयतु शुभमनोरथान् पूरयतु च।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Ekadashi Vrat Sankalpa', hi: 'एकादशी व्रत संकल्प', sa: 'एकादशीव्रतसङ्कल्पः' },
      description: {
        en: 'Wake before sunrise on Ekadashi. Take a bath with Ganga Jal mixed in water. Resolve to observe the nirjala or phalahar fast for the fulfilment of desires. Hold water and akshat, state your name, gotra, and intention.',
        hi: 'एकादशी को सूर्योदय से पहले उठें। गंगाजल मिश्रित जल से स्नान करें। कामनापूर्ति हेतु निर्जला या फलाहार व्रत रखने का संकल्प लें। जल और अक्षत हाथ में लेकर नाम, गोत्र और उद्देश्य बोलें।',
        sa: 'एकादश्यां सूर्योदयात् प्राक् उत्थाय गङ्गाजलमिश्रितजलेन स्नायात्। कामनापूर्तये निर्जलं फलाहारं वा व्रतम् आचरितुं सङ्कल्पं कुर्यात्। जलाक्षतान् हस्ते गृहीत्वा नाम गोत्रं प्रयोजनं च वदेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Vishnu Sthapana & Puja', hi: 'विष्णु स्थापना और पूजा', sa: 'विष्णुस्थापना पूजनं च' },
      description: {
        en: 'Place Vishnu idol on a clean altar covered with yellow cloth. Bathe with panchamrit. Apply chandan tilak. Offer tulsi, yellow flowers, kumkum, and akshat. Light ghee diya and incense.',
        hi: 'पीले कपड़े से ढकी स्वच्छ वेदी पर विष्णु मूर्ति स्थापित करें। पंचामृत से स्नान कराएँ। चन्दन तिलक लगाएँ। तुलसी, पीले फूल, कुमकुम और अक्षत अर्पित करें। घी का दीपक और धूप जलाएँ।',
        sa: 'पीतवस्त्रावृतायां शुचिवेद्यां विष्णुमूर्तिं स्थापयेत्। पञ्चामृतेन स्नापयेत्। चन्दनतिलकं कुर्यात्। तुलसीं पीतपुष्पाणि कुङ्कुमम् अक्षतान् च समर्पयेत्। घृतदीपं धूपं च प्रज्वालयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'invocation',
      mantraRef: 'kamada-vishnu',
    },
    {
      step: 3,
      title: { en: 'Kamada Ekadashi Vrat Katha', hi: 'कामदा एकादशी व्रत कथा', sa: 'कामदैकादशीव्रतकथा' },
      description: {
        en: 'Listen to the Kamada Ekadashi Vrat Katha from the Varaha Purana. It tells the story of Gandharva Lalit and Apsara Lalita  –  how Lalit was cursed to become a demon and was liberated when Lalita observed this Ekadashi vrat with devotion.',
        hi: 'वराह पुराण से कामदा एकादशी व्रत कथा सुनें। यह गन्धर्व ललित और अप्सरा ललिता की कहानी बताती है  –  कैसे ललित को राक्षस बनने का शाप मिला और ललिता द्वारा भक्तिपूर्वक इस एकादशी व्रत के पालन से मुक्त हुआ।',
        sa: 'वराहपुराणात् कामदैकादशीव्रतकथां शृणुयात्। इयं गन्धर्वललितस्य अप्सरसः ललितायाश्च कथां वदति  –  यथा ललितो राक्षसत्वशापं प्राप्तः ललितया भक्त्या अस्य एकादशीव्रतस्य पालनेन मुक्तः।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 4,
      title: { en: 'Vishnu Mantra Japa', hi: 'विष्णु मंत्र जप', sa: 'विष्णुमन्त्रजपः' },
      description: {
        en: 'Chant the Dwadashakshara Vishnu Mantra (Om Namo Bhagavate Vasudevaya) 108 times on a tulsi mala. Keep your mind focused on your wish while chanting  –  this is the Kamada (desire-fulfilling) aspect.',
        hi: 'तुलसी माला पर द्वादशाक्षर विष्णु मंत्र (ॐ नमो भगवते वासुदेवाय) का 108 बार जाप करें। जाप करते हुए अपनी मनोकामना पर ध्यान केन्द्रित रखें  –  यही कामदा (कामनापूर्ति) का पहलू है।',
        sa: 'तुलसीमालायां द्वादशाक्षरविष्णुमन्त्रं (ॐ नमो भगवते वासुदेवाय) अष्टोत्तरशतवारं जपेत्। जपकाले स्वमनोरथे मनः स्थिरं कुर्यात्  –  इदमेव कामदा (कामनापूर्ति) स्वरूपम्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 5,
      title: { en: 'Aarti and Naivedya', hi: 'आरती और नैवेद्य', sa: 'आरात्रिकं नैवेद्यं च' },
      description: {
        en: 'Perform aarti with ghee lamp and camphor. Offer non-grain naivedya  –  fruits, milk, dry fruits, and coconut. Distribute prasad to devotees. Night jagran (staying awake) is recommended for maximum benefit.',
        hi: 'घी के दीपक और कपूर से आरती करें। अनाज-रहित नैवेद्य  –  फल, दूध, मेवे और नारियल  –  अर्पित करें। भक्तों में प्रसाद वितरित करें। अधिकतम लाभ के लिए रात्रि जागरण की सिफारिश है।',
        sa: 'घृतदीपेन कर्पूरेण च आरात्रिकं कुर्यात्। अन्नरहितनैवेद्यं  –  फलानि दुग्धं शुष्कफलानि नारिकेलं च  –  समर्पयेत्। भक्तेषु प्रसादं वितरेत्। अधिकतमलाभाय रात्रिजागरणम् अनुशस्यते।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'kamada-vishnu',
      name: { en: 'Kamada Vishnu Mantra', hi: 'कामदा विष्णु मंत्र', sa: 'कामदाविष्णुमन्त्रः' },
      devanagari: 'कामदेव नमस्तुभ्यं सर्वकामप्रदायक।\nपापं हर सदा विष्णो त्वं हि लोकहितो प्रभो॥',
      iast: 'kāmadeva namastubhyaṃ sarvakāmapradāyaka |\npāpaṃ hara sadā viṣṇo tvaṃ hi lokahito prabho ||',
      meaning: {
        en: 'Salutations to You, O fulfiller of all desires. O Vishnu, always remove sin  –  You are the benefactor of the world, O Lord.',
        hi: 'सभी कामनाओं को पूर्ण करने वाले, आपको नमस्कार। हे विष्णु, सदा पाप हरें  –  आप संसार के हितकारी हैं, हे प्रभु।',
        sa: 'सर्वकामप्रदायक, तुभ्यं नमः। हे विष्णो, सदा पापं हर  –  त्वं हि लोकहितः प्रभो।',
      },
      usage: {
        en: 'Chant during the main puja while offering tulsi and flowers.',
        hi: 'मुख्य पूजा के दौरान तुलसी और फूल अर्पित करते समय जाप करें।',
        sa: 'प्रधानपूजाकाले तुलसीपुष्पसमर्पणसमये जपेत्।',
      },
    },
    {
      id: 'vishnu-dwadashakshar-kamada',
      name: { en: 'Dwadashakshara Mantra', hi: 'द्वादशाक्षर मंत्र', sa: 'द्वादशाक्षरमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय।',
      iast: 'oṃ namo bhagavate vāsudevāya |',
      meaning: {
        en: 'Om, salutations to the blessed Lord Vasudeva.',
        hi: 'ॐ, भगवान वासुदेव को नमस्कार।',
        sa: 'ॐ, भगवते वासुदेवाय नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times on tulsi mala while focusing on your noble desire.',
        hi: 'अपनी शुभ कामना पर ध्यान करते हुए तुलसी माला पर 108 बार जाप करें।',
        sa: 'शुभमनोरथे ध्यानं कुर्वन् तुलसीमालायाम् अष्टोत्तरशतवारं जपेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Offer non-grain naivedya: fresh fruits (banana, pomegranate, apple), milk, panchamrit, dry fruits (almonds, cashews), and coconut water. Sattvic food only  –  no onion, garlic, or grains.',
    hi: 'अनाज-रहित नैवेद्य अर्पित करें: ताज़े फल (केला, अनार, सेब), दूध, पंचामृत, मेवे (बादाम, काजू), और नारियल पानी। केवल सात्विक भोजन  –  प्याज, लहसुन या अनाज नहीं।',
    sa: 'अन्नरहितं नैवेद्यं समर्पयेत्: नवफलानि (कदलीफलं दाडिमं सेवफलं च) दुग्धं पञ्चामृतं शुष्कफलानि (वातामफलं काजूफलं च) नारिकेलजलं च। सात्त्विकम् एव  –  पलाण्डुं लशुनम् अन्नं वा न।',
  },

  parana: {
    type: 'sunrise_plus_quarter',
    description: {
      en: 'Break the fast on Dwadashi morning within the first quarter of the day after sunrise.',
      hi: 'द्वादशी प्रातः सूर्योदय के बाद दिन के पहले प्रहर में व्रत तोड़ें।',
      sa: 'द्वादश्यां प्रातः सूर्योदयानन्तरं दिनस्य प्रथमप्रहरे व्रतं भञ्जयेत्।',
    },
  },

  precautions: [
    {
      en: 'Strictly avoid grain food on Ekadashi. Only fruits, milk, and permitted items (sabudana, makhana, potatoes in some traditions) are allowed.',
      hi: 'एकादशी पर अन्नाहार का कड़ा त्याग करें। केवल फल, दूध और अनुमत पदार्थ (साबूदाना, मखाना, कुछ परम्पराओं में आलू) वर्ज्य हैं।',
      sa: 'एकादश्यां अन्नाहारं कठोरतया वर्जयेत्। केवलं फलानि दुग्धम् अनुमतपदार्थाश्च (साबूदाना मखानम् आलुकम् इत्यादि) स्वीकार्याः।',
    },
    {
      en: 'Desires prayed for should be dharmic (righteous)  –  this vrat is not intended for selfish or harmful wishes.',
      hi: 'प्रार्थित कामनाएँ धार्मिक (न्यायसंगत) होनी चाहिए  –  यह व्रत स्वार्थी या हानिकारक इच्छाओं के लिए नहीं है।',
      sa: 'प्रार्थिताः कामनाः धार्मिकाः (न्यायसंगताः) भवेयुः  –  इदं व्रतं स्वार्थपूर्णानां हानिकराणां वा इच्छानां कृते नास्ति।',
    },
    {
      en: 'Maintain silence (mauna) during the japa for best results. Avoid gossip, anger, and negativity throughout the day.',
      hi: 'सर्वोत्तम परिणाम हेतु जप के दौरान मौन रखें। पूरे दिन गपशप, क्रोध और नकारात्मकता से बचें।',
      sa: 'उत्तमफलाय जपकाले मौनं पालयेत्। सर्वं दिनं कथावार्तां क्रोधं नकारात्मकतां च वर्जयेत्।',
    },
  ],

  phala: {
    en: 'Kamada Ekadashi fulfils all righteous desires (kama), destroys accumulated sins including those from past lives, and liberates the devotee from curses and karmic debts. It is said to grant the merit equivalent to performing an Ashvamedha Yajna.',
    hi: 'कामदा एकादशी सभी धार्मिक कामनाओं (काम) को पूर्ण करती है, पूर्वजन्मों सहित संचित पापों को नष्ट करती है, और भक्त को शापों एवं कर्म ऋणों से मुक्त करती है। इससे अश्वमेध यज्ञ के समान पुण्य मिलता कहा जाता है।',
    sa: 'कामदा एकादशी सर्वाः धार्मिककामनाः (कामान्) पूरयति, पूर्वजन्मसहितान् सञ्चितपापान् नाशयति, भक्तं शापेभ्यो कर्मऋणेभ्यश्च मोचयति। अश्वमेधयज्ञसमं पुण्यं प्रयच्छतीति कथ्यते।',
  },
};

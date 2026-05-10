import type { PujaVidhi } from './types';

export const DEVSHAYANI_EKADASHI_PUJA: PujaVidhi = {
  festivalSlug: 'devshayani-ekadashi',
  category: 'festival',
  deity: { en: 'Lord Vishnu (Sleeping Form)', hi: 'भगवान विष्णु (शयन रूप)', sa: 'भगवान् विष्णुः (शयनरूपः)' },

  samagri: [
    { name: { en: 'Vishnu idol or image', hi: 'विष्णु मूर्ति या चित्र', sa: 'विष्णुमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Tulsi leaves', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, category: 'flowers', essential: true },
    { name: { en: 'Yellow flowers', hi: 'पीले फूल', sa: 'पीतपुष्पाणि' }, category: 'flowers', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Yellow cloth for deity', hi: 'भगवान के लिए पीला वस्त्र', sa: 'देवस्य कृते पीतवस्त्रम्' }, category: 'clothing', essential: true },
    { name: { en: 'Panchamrit (milk, curd, honey, ghee, sugar)', hi: 'पंचामृत (दूध, दही, शहद, घी, शक्कर)', sa: 'पञ्चामृतम् (दुग्धं दधि मधु घृतं शर्करा)' }, category: 'food', essential: true },
    { name: { en: 'Chandan (sandalwood paste)', hi: 'चन्दन', sa: 'चन्दनम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Fruits (banana, mango)', hi: 'फल (केला, आम)', sa: 'फलानि (कदलीफलं आम्रफलं च)' }, category: 'food', essential: false },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Devshayani Ekadashi falls on Ashadha Shukla Ekadashi. The vrat begins on Dashami evening (previous night) and the puja is performed on Ekadashi during the Madhyahna (midday) muhurta. Chaturmas (four sacred months) begins from this day.',
    hi: 'देवशयनी एकादशी आषाढ़ शुक्ल एकादशी को पड़ती है। व्रत दशमी सायंकाल (पिछली रात) से आरम्भ होता है और पूजा एकादशी को मध्याह्न मुहूर्त में की जाती है। इसी दिन से चातुर्मास आरम्भ होता है।',
    sa: 'देवशयनी एकादशी आषाढशुक्लैकादश्यां भवति। व्रतं दशम्यां सायंकाले आरभ्यते पूजा एकादश्यां मध्याह्नमुहूर्ते क्रियते। अस्मात् दिनात् चातुर्मासः आरभते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Ashadha Shukla Ekadashi, I worship Lord Vishnu who enters yogic sleep (yoga nidra) on Shesha Naga for the four months of Chaturmas. May He bless me with spiritual growth during this auspicious period.',
    hi: 'इस पवित्र आषाढ़ शुक्ल एकादशी पर, मैं भगवान विष्णु की पूजा करता/करती हूँ जो चातुर्मास के चार माह शेषनाग पर योगनिद्रा में जाते हैं। वे इस शुभ अवधि में मुझे आध्यात्मिक उन्नति का आशीर्वाद दें।',
    sa: 'अस्मिन् पुण्ये आषाढशुक्लैकादश्यां भगवन्तं विष्णुं पूजयामि यः चातुर्मासचतुर्मासान् शेषनागे योगनिद्रां प्रविशति। स अस्मिन् शुभकाले मम आध्यात्मिकोन्नतिम् अनुगृह्णातु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Ekadashi Vrat', hi: 'एकादशी व्रत', sa: 'एकादशीव्रतम्' },
      description: {
        en: 'Begin the nirjala (waterless) or phalahar (fruit-only) fast from the previous evening (Dashami). Wake before sunrise on Ekadashi, bathe, and resolve to keep the vrat with complete devotion.',
        hi: 'पिछली शाम (दशमी) से निर्जला (जलरहित) या फलाहार (केवल फल) व्रत आरम्भ करें। एकादशी को सूर्योदय से पहले उठें, स्नान करें, और पूर्ण भक्ति से व्रत रखने का संकल्प लें।',
        sa: 'पूर्वसायंकालात् (दशम्याः) निर्जलं फलाहारं वा व्रतम् आरभेत्। एकादश्यां सूर्योदयात् प्राक् उत्थाय स्नात्वा पूर्णभक्त्या व्रतधारणस्य सङ्कल्पं कुर्यात्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Vishnu Puja', hi: 'विष्णु पूजा', sa: 'विष्णुपूजनम्' },
      description: {
        en: 'Place Vishnu idol on a clean altar. Bathe the idol with panchamrit. Dress in yellow cloth. Apply chandan tilak. Offer tulsi leaves, yellow flowers, akshat, and kumkum. Light ghee diya and incense.',
        hi: 'स्वच्छ वेदी पर विष्णु मूर्ति स्थापित करें। मूर्ति को पंचामृत से स्नान कराएँ। पीला वस्त्र पहनाएँ। चन्दन तिलक लगाएँ। तुलसी, पीले फूल, अक्षत और कुमकुम अर्पित करें। घी का दीपक और धूप जलाएँ।',
        sa: 'शुचिवेद्यां विष्णुमूर्तिं स्थापयेत्। पञ्चामृतेन मूर्तिं स्नापयेत्। पीतवस्त्रं धारयेत्। चन्दनतिलकं कुर्यात्। तुलसीपत्राणि पीतपुष्पाणि अक्षतान् कुङ्कुमं च समर्पयेत्। घृतदीपं धूपं च प्रज्वालयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'invocation',
      mantraRef: 'vishnu-shayana',
    },
    {
      step: 3,
      title: { en: 'Sankalpa for Chaturmas', hi: 'चातुर्मास संकल्प', sa: 'चातुर्माससङ्कल्पः' },
      description: {
        en: 'Take the Chaturmas vow  –  resolve to observe heightened spiritual discipline for the next four months. Traditionally, this includes additional fasting, charity, mantra japa, and abstaining from certain foods (onion, garlic, brinjal depending on tradition).',
        hi: 'चातुर्मास का संकल्प लें  –  अगले चार माह तक उन्नत आध्यात्मिक अनुशासन पालने का निश्चय करें। पारम्परिक रूप से इसमें अतिरिक्त उपवास, दान, मंत्र जप, और कुछ खाद्य पदार्थों (प्याज, लहसुन, बैंगन  –  परम्परा अनुसार) का त्याग शामिल है।',
        sa: 'चातुर्मासव्रतं गृह्णीयात्  –  आगामिचतुर्मासान् यावत् उन्नतं आध्यात्मिकानुशासनम् आचरितुं निश्चयं कुर्यात्। पारम्परिकं उपवासदानमन्त्रजपाः केषाञ्चित् खाद्यपदार्थानां त्यागश्च अत्र सन्ति।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Vishnu Sahasranama / Stotra Path', hi: 'विष्णु सहस्रनाम / स्तोत्र पाठ', sa: 'विष्णुसहस्रनाम / स्तोत्रपाठः' },
      description: {
        en: 'Recite the Vishnu Sahasranama (1000 names of Vishnu) or at minimum the Vishnu Stotram. This is the central spiritual practice of Devshayani Ekadashi.',
        hi: 'विष्णु सहस्रनाम (विष्णु के 1000 नाम) या न्यूनतम विष्णु स्तोत्रम् का पाठ करें। यह देवशयनी एकादशी का केन्द्रीय आध्यात्मिक अभ्यास है।',
        sa: 'विष्णुसहस्रनामस्तोत्रं (विष्णोः सहस्रनामानि) न्यूनातिन्यूनं विष्णुस्तोत्रं वा पठेत्। इदं देवशयन्येकादश्याः प्रधानम् आध्यात्मिकम् अभ्यासम्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 5,
      title: { en: 'Shayana (Putting Lord to Sleep)', hi: 'शयन (भगवान को शयन कराना)', sa: 'शयनम् (भगवन्तं शयनं कारयितुम्)' },
      description: {
        en: 'Prepare a bed of flowers and tulsi leaves for Lord Vishnu. Symbolically put the deity to sleep by placing the idol in a reclining position on the floral bed. This represents Vishnu entering Yoga Nidra for four months.',
        hi: 'भगवान विष्णु के लिए फूलों और तुलसी पत्तों की शय्या बनाएँ। मूर्ति को पुष्पशय्या पर शयन मुद्रा में रखकर भगवान को प्रतीकात्मक रूप से शयन कराएँ। यह चार माह तक विष्णु की योगनिद्रा का प्रतीक है।',
        sa: 'भगवतो विष्णोः कृते पुष्पतुलसीपत्रशय्यां रचयेत्। मूर्तिं पुष्पशय्यायां शयनमुद्रायां स्थापयित्वा भगवन्तं प्रतीकात्मकरूपेण शयनं कारयेत्। इदं चतुर्मासान् यावत् विष्णोः योगनिद्रायाः प्रतीकम्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Aarti and Prasad', hi: 'आरती और प्रसाद', sa: 'आरात्रिकं प्रसादश्च' },
      description: {
        en: 'Perform final aarti with ghee lamp and camphor. Offer fruits and milk-based sweets as naivedya. Distribute prasad. The parana (breaking of fast) is done on Dwadashi morning after sunrise.',
        hi: 'घी के दीपक और कपूर से अन्तिम आरती करें। फल और दूध की मिठाइयाँ नैवेद्य के रूप में अर्पित करें। प्रसाद वितरित करें। पारणा (व्रत तोड़ना) द्वादशी प्रातः सूर्योदय के बाद किया जाता है।',
        sa: 'घृतदीपेन कर्पूरेण च अन्तिमम् आरात्रिकं कुर्यात्। फलानि दुग्धमिष्टान्नानि च नैवेद्यरूपेण समर्पयेत्। प्रसादं वितरेत्। पारणा द्वादश्यां प्रातः सूर्योदयानन्तरं क्रियते।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'vishnu-shayana',
      name: { en: 'Vishnu Shayana Mantra', hi: 'विष्णु शयन मंत्र', sa: 'विष्णुशयनमन्त्रः' },
      devanagari: 'सुप्ते त्वयि जगन्नाथ जगत् सुप्तं भवेदिदम्।\nविबुद्धे त्वयि बुध्येत जगत् सर्वं चराचरम्॥',
      iast: 'supte tvayi jagannātha jagat suptaṃ bhavedidaṃ |\nvibuddhe tvayi budhyeta jagat sarvaṃ carācaram ||',
      meaning: {
        en: 'O Lord of the Universe, when You sleep, the entire world sleeps. When You awaken, all beings  –  moving and non-moving  –  awaken.',
        hi: 'हे जगन्नाथ, जब आप सोते हैं तो सम्पूर्ण संसार सो जाता है। जब आप जागते हैं तो सभी चराचर प्राणी जाग उठते हैं।',
        sa: 'हे जगन्नाथ, त्वयि सुप्ते इदं सकलं जगत् सुप्तं भवेत्। त्वयि विबुद्धे सर्वं चराचरजगत् बुध्येत।',
      },
      usage: {
        en: 'Chant while placing the Vishnu idol in the sleeping position.',
        hi: 'विष्णु मूर्ति को शयन मुद्रा में रखते समय जाप करें।',
        sa: 'विष्णुमूर्तिं शयनमुद्रायां स्थापयन्तं जपेत्।',
      },
    },
    {
      id: 'vishnu-ekadashi',
      name: { en: 'Vishnu Ekadashi Mantra', hi: 'विष्णु एकादशी मंत्र', sa: 'विष्णुएकादशीमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय।',
      iast: 'oṃ namo bhagavate vāsudevāya |',
      meaning: {
        en: 'Om, salutations to the blessed Lord Vasudeva (Vishnu/Krishna).',
        hi: 'ॐ, भगवान वासुदेव (विष्णु/कृष्ण) को नमस्कार।',
        sa: 'ॐ, भगवते वासुदेवाय नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'The twelve-syllable Vishnu mantra  –  chant 108 times during the vrat.',
        hi: 'द्वादशाक्षर विष्णु मंत्र  –  व्रत के दौरान 108 बार जाप करें।',
        sa: 'द्वादशाक्षरो विष्णुमन्त्रः  –  व्रतकाले अष्टोत्तरशतवारं जपेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Since this is an Ekadashi fast, the naivedya should be non-grain: offer fruits, milk, panchamrit, tulsi water, dry fruits, and coconut. After the parana on Dwadashi, kheer and sabudana khichdi may be prepared.',
    hi: 'यह एकादशी व्रत होने के कारण नैवेद्य अनाज-रहित होना चाहिए: फल, दूध, पंचामृत, तुलसी जल, मेवे और नारियल चढ़ाएँ। द्वादशी को पारणा के बाद खीर और साबूदाना खिचड़ी बनाई जा सकती है।',
    sa: 'एकादशीव्रतत्वात् नैवेद्यं अन्नरहितं स्यात्: फलानि दुग्धं पञ्चामृतं तुलसीजलं शुष्कफलानि नारिकेलं च समर्पयेत्। द्वादश्यां पारणानन्तरं पायसं साबूदानखिचडीं वा पचेत्।',
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
      en: 'No new auspicious ceremonies (marriages, griha pravesh, upanayana) should be performed during Chaturmas that begins from this day.',
      hi: 'इस दिन से आरम्भ होने वाले चातुर्मास में कोई नया शुभ कार्य (विवाह, गृह प्रवेश, उपनयन) नहीं करना चाहिए।',
      sa: 'अस्मात् दिनात् आरभ्यमाणे चातुर्मासे नवीनानि शुभकार्याणि (विवाहः गृहप्रवेशः उपनयनं च) न कर्तव्यानि।',
    },
    {
      en: 'Grain food (rice, wheat, lentils) must be strictly avoided on Ekadashi. Even accidental consumption is considered inauspicious.',
      hi: 'एकादशी पर अन्नाहार (चावल, गेहूँ, दाल) का सख्ती से त्याग करें। आकस्मिक सेवन भी अशुभ माना जाता है।',
      sa: 'एकादश्यां अन्नाहारः (ओदनं गोधूमः मसूरः) कठोरतया वर्जनीयः। आकस्मिकसेवनमपि अशुभं मन्यते।',
    },
    {
      en: 'Maintain celibacy, truthfulness, and compassion on this day. Avoid anger and harsh speech.',
      hi: 'इस दिन ब्रह्मचर्य, सत्यता और करुणा बनाए रखें। क्रोध और कठोर वाणी से बचें।',
      sa: 'अस्मिन् दिने ब्रह्मचर्यं सत्यवादित्वं करुणां च पालयेत्। क्रोधं कठोरवाणीं च वर्जयेत्।',
    },
    {
      en: 'The significance lies in internal transformation during Chaturmas  –  external rituals are meaningless without inner resolve for spiritual growth.',
      hi: 'चातुर्मास में आन्तरिक परिवर्तन ही सार है  –  आध्यात्मिक विकास के आन्तरिक संकल्प के बिना बाहरी कर्मकाण्ड अर्थहीन हैं।',
      sa: 'चातुर्मासे आन्तरिकपरिवर्तनमेव सारः  –  आध्यात्मिकविकासस्य आन्तरिकसङ्कल्पं विना बाह्यकर्मकाण्डाः निरर्थकाः।',
    },
  ],

  phala: {
    en: 'Devshayani Ekadashi grants the merit of all Ekadashi vrats combined. The Chaturmas observance that begins on this day accelerates spiritual growth, bestows Vishnu\'s grace, and is said to grant moksha. Charity given during Chaturmas yields manifold results.',
    hi: 'देवशयनी एकादशी सभी एकादशी व्रतों के संयुक्त पुण्य प्रदान करती है। इस दिन से आरम्भ होने वाला चातुर्मास आध्यात्मिक विकास को गति देता है, विष्णु कृपा प्रदान करता है, और मोक्ष देने वाला कहा जाता है। चातुर्मास में दिया गया दान बहुगुणित फल देता है।',
    sa: 'देवशयनी एकादशी सर्वासाम् एकादशीव्रतानां संयुक्तपुण्यं प्रयच्छति। अस्मात् दिनात् आरभ्यमाणः चातुर्मासः आध्यात्मिकविकासं त्वरयति विष्णोः अनुग्रहं प्रयच्छति मोक्षदश्चोच्यते। चातुर्मासे दत्तं दानं बहुगुणितफलं ददाति।',
  },
};

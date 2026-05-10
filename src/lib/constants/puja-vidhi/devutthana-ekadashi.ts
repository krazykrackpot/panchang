import type { PujaVidhi } from './types';

export const DEVUTTHANA_EKADASHI_PUJA: PujaVidhi = {
  festivalSlug: 'devutthana-ekadashi',
  category: 'festival',
  deity: { en: 'Lord Vishnu (Awakening Form)', hi: 'भगवान विष्णु (जागृत रूप)', sa: 'भगवान् विष्णुः (प्रबोधनरूपः)' },

  samagri: [
    { name: { en: 'Vishnu idol or image', hi: 'विष्णु मूर्ति या चित्र', sa: 'विष्णुमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Tulsi plant (for Tulsi Vivah)', hi: 'तुलसी का पौधा (तुलसी विवाह हेतु)', sa: 'तुलसीवृक्षः (तुलसीविवाहार्थम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Sugarcane sticks', hi: 'गन्ने की छड़ियाँ', sa: 'इक्षुदण्डाः' }, category: 'other', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Yellow flowers and garlands', hi: 'पीले फूल और मालाएँ', sa: 'पीतपुष्पाणि मालाश्च' }, category: 'flowers', essential: true },
    { name: { en: 'Chandan (sandalwood paste)', hi: 'चन्दन', sa: 'चन्दनम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Panchamrit', hi: 'पंचामृत', sa: 'पञ्चामृतम्' }, category: 'food', essential: true },
    { name: { en: 'Conch shell (shankh)', hi: 'शंख', sa: 'शङ्खः' }, category: 'puja_items', essential: false },
    { name: { en: 'Bell', hi: 'घंटी', sa: 'घण्टा' }, category: 'puja_items', essential: false },
    { name: { en: 'Fruits and dry fruits', hi: 'फल और मेवे', sa: 'फलानि शुष्कफलानि च' }, category: 'food', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Devutthana Ekadashi falls on Kartik Shukla Ekadashi. The puja is performed during Madhyahna (midday) muhurta. Tulsi Vivah is traditionally performed on the next day (Dwadashi). Chaturmas ends on this day  –  auspicious ceremonies may resume.',
    hi: 'देवउत्थान एकादशी कार्तिक शुक्ल एकादशी को पड़ती है। पूजा मध्याह्न मुहूर्त में की जाती है। तुलसी विवाह पारम्परिक रूप से अगले दिन (द्वादशी) को किया जाता है। इसी दिन चातुर्मास समाप्त होता है  –  शुभ कार्य पुनः आरम्भ हो सकते हैं।',
    sa: 'देवोत्थान एकादशी कार्तिकशुक्लैकादश्यां भवति। पूजा मध्याह्नमुहूर्ते क्रियते। तुलसीविवाहः पारम्परिकरूपेण अग्रिमदिने (द्वादश्यां) क्रियते। अस्मिन् दिने चातुर्मासः समाप्यते  –  शुभकार्याणि पुनः आरभन्ते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Kartik Shukla Ekadashi, I worship Lord Vishnu who awakens from His four-month yogic sleep. May His awakening herald a new beginning of auspiciousness, prosperity, and divine grace in my life.',
    hi: 'इस पवित्र कार्तिक शुक्ल एकादशी पर, मैं भगवान विष्णु की पूजा करता/करती हूँ जो चार माह की योगनिद्रा से जागृत होते हैं। उनका जागरण मेरे जीवन में शुभता, समृद्धि और दिव्य कृपा का नवारम्भ करे।',
    sa: 'अस्मिन् पुण्ये कार्तिकशुक्लैकादश्यां भगवन्तं विष्णुं पूजयामि यः चतुर्मासयोगनिद्रातः जागर्ति। तस्य प्रबोधनं मम जीवने शुभतायाः समृद्धेः दिव्यानुग्रहस्य च नवारम्भं सूचयतु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Vishnu Prabodhana (Awakening)', hi: 'विष्णु प्रबोधन (जागरण)', sa: 'विष्णुप्रबोधनम् (जागरणम्)' },
      description: {
        en: 'Wake Lord Vishnu by blowing the conch shell, ringing bells, and chanting "Uttishtha Uttishtha Govinda" (Arise, arise, O Govinda). Place the Vishnu idol in an upright/seated position from the sleeping posture.',
        hi: 'शंख बजाकर, घंटी बजाकर और "उत्तिष्ठ उत्तिष्ठ गोविन्द" का जाप करके भगवान विष्णु को जगाएँ। विष्णु मूर्ति को शयन मुद्रा से उठाकर बैठी/खड़ी मुद्रा में रखें।',
        sa: 'शङ्खं वादयित्वा घण्टां नादयित्वा "उत्तिष्ठ उत्तिष्ठ गोविन्द" इति जपित्वा च भगवन्तं विष्णुं जागरयेत्। विष्णुमूर्तिं शयनमुद्रातः उत्थाप्य उपवेशनस्थितिमुद्रायां स्थापयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
      mantraRef: 'vishnu-prabodhana',
    },
    {
      step: 2,
      title: { en: 'Vishnu Abhishek', hi: 'विष्णु अभिषेक', sa: 'विष्णुअभिषेकः' },
      description: {
        en: 'Bathe the Vishnu idol with panchamrit (milk, curd, honey, ghee, sugar) and then with clean water. Dry and dress in yellow silk cloth. Apply chandan tilak and offer tulsi garland.',
        hi: 'विष्णु मूर्ति को पंचामृत (दूध, दही, शहद, घी, शक्कर) और फिर स्वच्छ जल से स्नान कराएँ। सुखाकर पीला रेशमी वस्त्र पहनाएँ। चन्दन तिलक लगाएँ और तुलसी माला अर्पित करें।',
        sa: 'विष्णुमूर्तिं पञ्चामृतेन (दुग्धेन दध्ना मधुना घृतेन शर्करया) ततः शुद्धजलेन स्नापयेत्। शोषयित्वा पीतकौशेयवस्त्रं धारयेत्। चन्दनतिलकं कुर्यात् तुलसीमालां च अर्पयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Ekadashi Puja', hi: 'एकादशी पूजा', sa: 'एकादशीपूजनम्' },
      description: {
        en: 'Perform standard Vishnu puja with sixteen offerings (Shodashopachara). Offer yellow flowers, tulsi, kumkum, akshat, incense, and ghee lamp. Recite Vishnu Sahasranama or selected stotras.',
        hi: 'षोडशोपचार से विष्णु पूजा करें। पीले फूल, तुलसी, कुमकुम, अक्षत, धूप और घी का दीपक अर्पित करें। विष्णु सहस्रनाम या चयनित स्तोत्रों का पाठ करें।',
        sa: 'षोडशोपचारैः विष्णुपूजनं कुर्यात्। पीतपुष्पाणि तुलसीं कुङ्कुमम् अक्षतान् धूपं घृतदीपं च समर्पयेत्। विष्णुसहस्रनामस्तोत्रं चयनितस्तोत्राणि वा पठेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 4,
      title: { en: 'Rangoli with Sugarcane', hi: 'गन्ने से रंगोली', sa: 'इक्षुभिः रङ्गवल्ली' },
      description: {
        en: 'Create a decorative arrangement with sugarcane sticks around the Tulsi plant or puja area. Draw auspicious rangoli patterns. The sugarcane represents sweetness and prosperity returning after Chaturmas.',
        hi: 'तुलसी के पौधे या पूजा स्थल के चारों ओर गन्ने की छड़ियों से सजावट करें। शुभ रंगोली के पैटर्न बनाएँ। गन्ना चातुर्मास के बाद लौटती मधुरता और समृद्धि का प्रतीक है।',
        sa: 'तुलसीवृक्षस्य पूजास्थलस्य वा परितः इक्षुदण्डैः सज्जां कुर्यात्। शुभरङ्गवल्लीनां चित्राणि रचयेत्। इक्षुः चातुर्मासानन्तरं प्रत्यागच्छन्त्याः माधुर्यसमृद्ध्योः प्रतीकः।',
      },
      duration: '15 min',
      essential: false,
      stepType: 'preparation',
    },
    {
      step: 5,
      title: { en: 'Aarti and Prasad', hi: 'आरती और प्रसाद', sa: 'आरात्रिकं प्रसादश्च' },
      description: {
        en: 'Perform joyous aarti of Lord Vishnu with ghee lamp, camphor, and bell. This is a celebration  –  Vishnu has awakened and auspicious activities resume. Offer fruits and sweets as naivedya.',
        hi: 'घी के दीपक, कपूर और घंटी के साथ भगवान विष्णु की उत्साहपूर्ण आरती करें। यह उत्सव है  –  विष्णु जागृत हो गए हैं और शुभ कार्य पुनः आरम्भ हो रहे हैं। फल और मिठाइयाँ नैवेद्य के रूप में अर्पित करें।',
        sa: 'घृतदीपेन कर्पूरेण घण्टया च भगवतो विष्णोः उत्सवपूर्णम् आरात्रिकं कुर्यात्। इदम् उत्सवः  –  विष्णुः जागृतः शुभकार्याणि पुनः आरभन्ते। फलानि मिष्टान्नानि च नैवेद्यरूपेण समर्पयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'vishnu-prabodhana',
      name: { en: 'Vishnu Prabodhana Mantra', hi: 'विष्णु प्रबोधन मंत्र', sa: 'विष्णुप्रबोधनमन्त्रः' },
      devanagari: 'उत्तिष्ठोत्तिष्ठ गोविन्द त्यज निद्रां जगत्पते।\nत्वयि सुप्ते जगन्नाथ जगत् सुप्तमिदं भवेत्॥',
      iast: 'uttiṣṭhottiṣṭha govinda tyaja nidrāṃ jagatpate |\ntvayi supte jagannātha jagat suptamidaṃ bhavet ||',
      meaning: {
        en: 'Arise, arise O Govinda! Abandon sleep, O Lord of the world. When You sleep, O Lord of the Universe, the entire world sleeps.',
        hi: 'उत्तिष्ठ उत्तिष्ठ हे गोविन्द! निद्रा त्यागो, हे जगतपते। हे जगन्नाथ, जब तुम सोते हो तो सम्पूर्ण संसार सो जाता है।',
        sa: 'उत्तिष्ठ उत्तिष्ठ हे गोविन्द! निद्रां त्यज हे जगत्पते। हे जगन्नाथ, त्वयि सुप्ते इदं सकलं जगत् सुप्तं भवेत्।',
      },
      usage: {
        en: 'Chant loudly while blowing conch and ringing bells to awaken Lord Vishnu.',
        hi: 'शंख बजाते और घंटी नादते हुए भगवान विष्णु को जगाने के लिए ऊँचे स्वर में जाप करें।',
        sa: 'शङ्खं वादयन् घण्टां नादयन् च भगवन्तं विष्णुं जागरयितुम् उच्चैः जपेत्।',
      },
    },
    {
      id: 'vishnu-dvadashakshar',
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
        en: 'Chant 108 times during the main puja.',
        hi: 'मुख्य पूजा के दौरान 108 बार जाप करें।',
        sa: 'प्रधानपूजाकाले अष्टोत्तरशतवारं जपेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Offer non-grain items on Ekadashi: fruits, milk-based sweets, dry fruits, panchamrit, and coconut. Sugarcane juice is a special offering on this day, symbolising the sweetness of Vishnu\'s awakening.',
    hi: 'एकादशी पर अनाज-रहित पदार्थ अर्पित करें: फल, दूध की मिठाइयाँ, मेवे, पंचामृत और नारियल। गन्ने का रस इस दिन का विशेष नैवेद्य है, जो विष्णु जागरण की मधुरता का प्रतीक है।',
    sa: 'एकादश्यां अन्नरहितपदार्थान् समर्पयेत्: फलानि दुग्धमिष्टान्नानि शुष्कफलानि पञ्चामृतं नारिकेलं च। इक्षुरसः अस्मिन् दिने विशेषनैवेद्यम्, यो विष्णुजागरणस्य माधुर्यस्य प्रतीकः।',
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
      en: 'Grain food must be strictly avoided on Ekadashi. Break the fast only on Dwadashi during the prescribed parana window.',
      hi: 'एकादशी पर अन्नाहार का सख्ती से त्याग करें। केवल निर्धारित पारणा समय में द्वादशी पर व्रत तोड़ें।',
      sa: 'एकादश्यां अन्नाहारः कठोरतया वर्जनीयः। निर्दिष्टपारणासमये द्वादश्याम् एव व्रतं भञ्जयेत्।',
    },
    {
      en: 'Marriage season begins after this day  –  verify muhurta before scheduling auspicious events.',
      hi: 'इस दिन के बाद विवाह ऋतु आरम्भ होती है  –  शुभ कार्यक्रम निर्धारित करने से पहले मुहूर्त की जाँच करें।',
      sa: 'अस्मात् दिनात् अनन्तरं विवाहऋतुः आरभते  –  शुभकार्यक्रमनिर्धारणात् पूर्वं मुहूर्तं परीक्षयेत्।',
    },
    {
      en: 'Tulsi Vivah preparation should begin alongside this puja  –  both are closely connected celebrations.',
      hi: 'तुलसी विवाह की तैयारी इस पूजा के साथ शुरू करनी चाहिए  –  दोनों निकट सम्बन्धित उत्सव हैं।',
      sa: 'तुलसीविवाहसज्जा अस्याः पूजायाः सह एव आरभ्यताम्  –  उभौ निकटसम्बद्धौ उत्सवौ स्तः।',
    },
  ],

  phala: {
    en: 'Devutthana Ekadashi marks the end of Chaturmas and Vishnu\'s awakening. It grants the devotee freedom from accumulated sins, the resumption of auspicious activities (especially marriages), Vishnu\'s direct grace, and spiritual advancement equivalent to visiting Badrinath.',
    hi: 'देवउत्थान एकादशी चातुर्मास की समाप्ति और विष्णु के जागरण का प्रतीक है। यह भक्त को संचित पापों से मुक्ति, शुभ कार्यों (विशेषकर विवाह) की पुनः शुरुआत, विष्णु की प्रत्यक्ष कृपा, और बद्रीनाथ दर्शन के समान आध्यात्मिक उन्नति प्रदान करती है।',
    sa: 'देवोत्थान एकादशी चातुर्मासस्य समाप्तिं विष्णोः प्रबोधनं च सूचयति। इयं भक्तं सञ्चितपापेभ्यो मोचयति, शुभकार्याणां (विशेषतो विवाहानाम्) पुनरारम्भं, विष्णोः प्रत्यक्षानुग्रहं, बदरीनाथदर्शनसमम् आध्यात्मिकोन्नतिं च प्रयच्छति।',
  },
};

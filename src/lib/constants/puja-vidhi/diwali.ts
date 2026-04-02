import type { PujaVidhi } from './types';

export const DIWALI_PUJA: PujaVidhi = {
  festivalSlug: 'diwali',
  category: 'festival',
  deity: { en: 'Lakshmi & Ganesha', hi: 'लक्ष्मी एवं गणेश', sa: 'लक्ष्मीगणेशौ' },

  samagri: [
    { name: { en: 'New Lakshmi-Ganesha idols or images', hi: 'नई लक्ष्मी-गणेश मूर्तियाँ या चित्र', sa: 'नवलक्ष्मीगणेशमूर्ती अथवा चित्रे' } , category: 'puja_items', essential: true },
    { name: { en: 'Red cloth (for puja platform)', hi: 'लाल कपड़ा (पूजा चौकी के लिए)', sa: 'रक्तवस्त्रम् (पूजावेदिकायै)' } , category: 'clothing', essential: true },
    { name: { en: 'Coins and currency notes', hi: 'सिक्के और नोट', sa: 'मुद्राः नोटाः च' } , category: 'puja_items', essential: true },
    { name: { en: 'Lotus flowers', hi: 'कमल के फूल', sa: 'कमलपुष्पाणि' } , category: 'flowers', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' } , category: 'puja_items', essential: true },
    { name: { en: 'Turmeric', hi: 'हल्दी', sa: 'हरिद्रा' } , category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Cloves', hi: 'लौंग', sa: 'लवङ्गम्' }, quantity: '5' , category: 'puja_items', essential: false },
    { name: { en: 'Supari (betel nut)', hi: 'सुपारी', sa: 'पूगीफलम्' }, quantity: '5' , category: 'puja_items', essential: false },
    { name: { en: 'Paan leaves (betel)', hi: 'पान के पत्ते', sa: 'ताम्बूलपत्राणि' }, quantity: '5' , category: 'puja_items', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamps (diyas)', hi: 'घी के दीपक', sa: 'घृतदीपाः' }, quantity: '13', note: { en: 'Traditionally 13 diyas are lit', hi: 'परम्परानुसार 13 दीपक जलाए जाते हैं', sa: 'परम्परया त्रयोदश दीपाः प्रज्वाल्यन्ते' } , category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1' , category: 'food', essential: true },
    { name: { en: 'Fruits (banana, apple, pomegranate)', hi: 'फल (केला, सेब, अनार)', sa: 'फलानि (कदलीफलम्, सेवफलम्, दाडिमम्)' } , category: 'food', essential: true },
    { name: { en: 'Sweets (mithai)', hi: 'मिठाई', sa: 'मिष्टान्नानि' } , category: 'food', essential: true },
    { name: { en: 'New account book (Bahi Khata)', hi: 'नया बही खाता', sa: 'नवलेखापुस्तकम्' } , category: 'other', essential: false },
    { name: { en: 'New pen (red ink preferred)', hi: 'नई कलम (लाल स्याही वाली)', sa: 'नवलेखनी (रक्तमष्या)' } , category: 'other', essential: false },
    { name: { en: 'Conch shell (Shankh)', hi: 'शंख', sa: 'शङ्खः' } , category: 'puja_items', essential: false },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' } , category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Lakshmi Puja is performed during Pradosh Kaal (after sunset) and Nishita Kaal (midnight). The most auspicious window is typically between 6:00 PM and 8:00 PM on Amavasya night.',
    hi: 'लक्ष्मी पूजा प्रदोष काल (सूर्यास्त के बाद) और निशीथ काल (मध्यरात्रि) में की जाती है। सबसे शुभ समय अमावस्या की रात सामान्यतः शाम 6 से 8 बजे के बीच होता है।',
    sa: 'लक्ष्मीपूजा प्रदोषकाले (सूर्यास्तानन्तरम्) निशीथकाले (अर्धरात्रौ) च क्रियते। अमावास्यारात्रौ सायं षड्वादनतः अष्टवादनपर्यन्तं सर्वोत्तमः शुभकालः।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this auspicious Kartik Amavasya (Diwali), I undertake the worship of Goddess Lakshmi and Lord Ganesha for the bestowal of wealth, prosperity, health, and happiness in my household.',
    hi: 'इस शुभ कार्तिक अमावस्या (दिवाली) पर, अपने गृह में धन, समृद्धि, स्वास्थ्य और सुख की प्राप्ति के लिए, मैं माता लक्ष्मी और भगवान गणेश की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे कार्तिकामावास्यायां (दीपावल्याम्) स्वगृहे धनसमृद्ध्यारोग्यसुखप्राप्त्यर्थं श्रीलक्ष्मीगणेशपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation', hi: 'तैयारी', sa: 'सज्जता' },
      description: {
        en: 'Clean the puja area thoroughly. Spread a red cloth on a wooden chowki (platform). Place Lakshmi idol/image in the center facing East, Ganesha to her left. Place coins, the account book, and pen near the idols.',
        hi: 'पूजा स्थल को अच्छी तरह साफ करें। लकड़ी की चौकी पर लाल कपड़ा बिछाएँ। लक्ष्मी मूर्ति/चित्र बीच में पूर्वमुखी रखें, गणेश उनकी बाईं ओर। मूर्तियों के पास सिक्के, बही खाता और कलम रखें।',
        sa: 'पूजास्थलं सम्यक् शोधयेत्। काष्ठवेदिकायां रक्तवस्त्रं विस्तारयेत्। लक्ष्मीमूर्तिं मध्ये पूर्वाभिमुखीं स्थापयेत्, गणेशं तस्याः वामे। मूर्त्योः समीपे मुद्राः लेखापुस्तकं लेखनीं च निधद्यात्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Achamana', hi: 'आचमन', sa: 'आचमनम्' },
      description: {
        en: 'Sip water three times from the right palm for self-purification while reciting the names of Vishnu.',
        hi: 'विष्णु के नामों का उच्चारण करते हुए दाहिने हाथ से तीन बार जल का आचमन करें।',
        sa: 'विष्णुनामोच्चारणपूर्वकं दक्षिणकरात् त्रिवारं जलम् आचामेत्।',
      },
      duration: '2 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Sankalpa', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water and akshat in the right hand, state the date, place, and purpose of the Lakshmi-Ganesha puja, then release the water.',
        hi: 'दाहिने हाथ में जल और अक्षत लेकर, तिथि, स्थान और लक्ष्मी-गणेश पूजा का उद्देश्य बोलकर जल छोड़ें।',
        sa: 'दक्षिणहस्ते जलाक्षतान् गृहीत्वा तिथिस्थानप्रयोजनं वदेत् ततो जलं विसृजेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Ganesha Puja', hi: 'गणेश पूजा', sa: 'गणेशपूजनम्' },
      description: {
        en: 'Begin by worshipping Ganesha first (as is tradition before any puja). Offer kumkum, akshat, durva, and red flowers. Chant the Ganesh Beej Mantra.',
        hi: 'सबसे पहले गणेश जी की पूजा करें (परम्परानुसार किसी भी पूजा से पहले)। कुमकुम, अक्षत, दूर्वा और लाल फूल अर्पित करें। गणेश बीज मन्त्र का जाप करें।',
        sa: 'प्रथमं गणेशं पूजयेत् (परम्परया सर्वपूजापूर्वम्)। कुङ्कुमम् अक्षतान् दूर्वाम् रक्तपुष्पाणि च समर्पयेत्। गणेशबीजमन्त्रं जपेत्।',
      },
      mantraRef: 'ganesh-beej-diwali',
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Lakshmi Avahana', hi: 'लक्ष्मी आवाहन', sa: 'लक्ष्म्यावाहनम्' },
      description: {
        en: 'Invoke Goddess Lakshmi into the idol/image with folded hands. Offer akshat and lotus flowers while chanting the Lakshmi Beej Mantra.',
        hi: 'हाथ जोड़कर मूर्ति/चित्र में माता लक्ष्मी का आवाहन करें। लक्ष्मी बीज मन्त्र पढ़ते हुए अक्षत और कमल के फूल अर्पित करें।',
        sa: 'कृताञ्जलिपुटा मूर्तौ श्रीलक्ष्म्या आवाहनं कुर्यात्। लक्ष्मीबीजमन्त्रजपेन अक्षतान् कमलपुष्पाणि च समर्पयेत्।',
      },
      mantraRef: 'lakshmi-beej',
      duration: '3 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 6,
      title: { en: 'Padya-Arghya', hi: 'पाद्य-अर्घ्य', sa: 'पाद्यार्घ्यम्' },
      description: {
        en: 'Offer water for washing the feet (padya) and scented water as arghya to Goddess Lakshmi.',
        hi: 'माता लक्ष्मी को पैर धोने के लिए जल (पाद्य) और सुगन्धित जल अर्घ्य के रूप में अर्पित करें।',
        sa: 'श्रीलक्ष्म्यै पादप्रक्षालनार्थं जलं (पाद्यम्) सुगन्धितजलं अर्घ्यरूपेण च समर्पयेत्।',
      },
      duration: '2 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Snana (Abhishek)', hi: 'स्नान (अभिषेक)', sa: 'स्नानम् (अभिषेकः)' },
      description: {
        en: 'Bathe the Lakshmi idol with Panchamrit (milk, curd, ghee, honey, sugar), then with clean water.',
        hi: 'लक्ष्मी मूर्ति को पंचामृत (दूध, दही, घी, शहद, शक्कर) से और फिर शुद्ध जल से स्नान कराएँ।',
        sa: 'पञ्चामृतेन (क्षीर-दधि-घृत-मधु-शर्करा) लक्ष्मीमूर्तिं स्नापयेत् ततः शुद्धजलेन च।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Vastra and Shringar', hi: 'वस्त्र और श्रृंगार', sa: 'वस्त्रश्रृङ्गारः' },
      description: {
        en: 'Offer a red saree/cloth to Lakshmi. Adorn with ornaments if available.',
        hi: 'लक्ष्मी जी को लाल साड़ी/कपड़ा अर्पित करें। उपलब्ध हो तो आभूषण भी सजाएँ।',
        sa: 'लक्ष्म्यै रक्तवस्त्रं समर्पयेत्। उपलभ्ये सति आभरणैः अलङ्कुर्यात्।',
      },
      duration: '2 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 9,
      title: { en: 'Gandha-Kumkum', hi: 'गन्ध-कुमकुम', sa: 'गन्धकुङ्कुमम्' },
      description: {
        en: 'Apply sandalwood paste and kumkum to the Lakshmi idol.',
        hi: 'लक्ष्मी मूर्ति पर चन्दन का लेप और कुमकुम लगाएँ।',
        sa: 'लक्ष्मीमूर्तौ चन्दनं कुङ्कुमं च लेपयेत्।',
      },
      duration: '1 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 10,
      title: { en: 'Pushpa', hi: 'पुष्प', sa: 'पुष्पम्' },
      description: {
        en: 'Offer lotus flowers and other red/pink flowers to Goddess Lakshmi. Lotus is her most beloved flower.',
        hi: 'माता लक्ष्मी को कमल और अन्य लाल/गुलाबी फूल अर्पित करें। कमल उनका सबसे प्रिय पुष्प है।',
        sa: 'श्रीलक्ष्म्यै कमलपुष्पाणि अन्यानि रक्तारुणपुष्पाणि च समर्पयेत्। कमलं तस्याः प्रियतमं पुष्पम्।',
      },
      duration: '2 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 11,
      title: { en: 'Dhupa', hi: 'धूप', sa: 'धूपम्' },
      description: {
        en: 'Light incense sticks and wave them before both Lakshmi and Ganesha idols.',
        hi: 'अगरबत्ती जलाकर लक्ष्मी और गणेश दोनों मूर्तियों के सामने घुमाएँ।',
        sa: 'धूपं प्रज्वाल्य लक्ष्मीगणेशमूर्त्योः पुरतः भ्रामयेत्।',
      },
      duration: '1 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 12,
      title: { en: 'Deepa', hi: 'दीप', sa: 'दीपम्' },
      description: {
        en: 'Light all 13 ghee lamps. Place them around the puja area. Wave one lamp before the deities in a clockwise motion.',
        hi: 'सभी 13 घी के दीपक जलाएँ। उन्हें पूजा स्थल के चारों ओर रखें। एक दीपक देवताओं के सामने दक्षिणावर्त घुमाएँ।',
        sa: 'सर्वान् त्रयोदश घृतदीपान् प्रज्वालयेत्। पूजास्थलस्य परितः स्थापयेत्। एकं दीपं देवतायाः पुरतः प्रदक्षिणक्रमेण भ्रामयेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 13,
      title: { en: 'Shri Sukta Paath', hi: 'श्री सूक्त पाठ', sa: 'श्रीसूक्तपाठः' },
      description: {
        en: 'Recite the Shri Sukta from the Rig Veda — this is the most important recitation during Diwali Lakshmi puja.',
        hi: 'ऋग्वेद से श्री सूक्त का पाठ करें — दिवाली लक्ष्मी पूजा में यह सबसे महत्वपूर्ण पाठ है।',
        sa: 'ऋग्वेदस्य श्रीसूक्तं पठेत् — दीपावलीलक्ष्मीपूजने इदं सर्वप्रधानं पठनम्।',
      },
      mantraRef: 'shri-sukta',
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 14,
      title: { en: 'Lakshmi Mantra Japa', hi: 'लक्ष्मी मन्त्र जप', sa: 'लक्ष्मीमन्त्रजपः' },
      description: {
        en: 'Chant the Lakshmi Beej Mantra 108 times using a mala (rosary). Focus on abundance and prosperity.',
        hi: 'माला से लक्ष्मी बीज मन्त्र 108 बार जपें। समृद्धि और धन पर ध्यान केन्द्रित करें।',
        sa: 'मालया लक्ष्मीबीजमन्त्रम् अष्टोत्तरशतवारं जपेत्। समृद्धिधने मनो निवेशयेत्।',
      },
      mantraRef: 'lakshmi-beej',
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 15,
      title: { en: 'Kubera Puja', hi: 'कुबेर पूजा', sa: 'कुबेरपूजनम्' },
      description: {
        en: 'Worship Kubera (the divine treasurer) by placing coins near the idol and chanting the Kubera Mantra. This ensures continuous flow of wealth.',
        hi: 'मूर्ति के पास सिक्के रखकर कुबेर (दिव्य कोषाध्यक्ष) की पूजा करें और कुबेर मन्त्र का जाप करें। इससे धन का निरन्तर प्रवाह सुनिश्चित होता है।',
        sa: 'मूर्तेः समीपे मुद्राः निधाय कुबेरं (दिव्यकोषाध्यक्षम्) पूजयेत् कुबेरमन्त्रं च जपेत्। अनेन धनस्य निरन्तरप्रवाहः सुनिश्चितो भवति।',
      },
      mantraRef: 'kubera-mantra',
      duration: '5 min',
      essential: false,
      stepType: 'invocation',
    },
    {
      step: 16,
      title: { en: 'Naivedya', hi: 'नैवेद्य', sa: 'नैवेद्यम्' },
      description: {
        en: 'Offer sweets (kheer, laddoo, barfi), fruits, and coconut as naivedya. Sprinkle water around the offerings.',
        hi: 'मिठाई (खीर, लड्डू, बर्फी), फल और नारियल नैवेद्य के रूप में अर्पित करें। भोग के चारों ओर जल छिड़कें।',
        sa: 'मिष्टान्नानि (पायसम्, मोदकानि, बर्फी) फलानि नारिकेलं च नैवेद्यरूपेण निवेदयेत्। नैवेद्यस्य परितः जलं सिञ्चेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 17,
      title: { en: 'Tambula', hi: 'ताम्बूल', sa: 'ताम्बूलम्' },
      description: {
        en: 'Offer paan, supari, and cloves as tambula.',
        hi: 'पान, सुपारी और लौंग ताम्बूल के रूप में अर्पित करें।',
        sa: 'ताम्बूलं पूगीफलं लवङ्गं च ताम्बूलरूपेण समर्पयेत्।',
      },
      duration: '1 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 18,
      title: { en: 'Bahi Khata Puja', hi: 'बही खाता पूजा', sa: 'लेखापुस्तकपूजनम्' },
      description: {
        en: 'Place the new account book (Bahi Khata) before the Lakshmi idol. Write "Shri" or "Shubh Labh" on the first page with the new red pen. Apply kumkum and akshat on it.',
        hi: 'नया बही खाता लक्ष्मी मूर्ति के सामने रखें। नई लाल कलम से पहले पन्ने पर "श्री" या "शुभ लाभ" लिखें। उस पर कुमकुम और अक्षत लगाएँ।',
        sa: 'नवलेखापुस्तकं लक्ष्मीमूर्तेः पुरतः स्थापयेत्। नवरक्तलेखन्या प्रथमपृष्ठे "श्री" अथवा "शुभलाभ" इति लिखेत्। तस्मिन् कुङ्कुमम् अक्षतान् च न्यस्येत्।',
      },
      duration: '3 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 19,
      title: { en: 'Lakshmi Aarti', hi: 'लक्ष्मी आरती', sa: 'लक्ष्म्यारात्रिकम्' },
      description: {
        en: 'Perform aarti with camphor and ghee lamp while singing "Om Jai Lakshmi Mata". Ring the bell and blow the conch shell.',
        hi: 'कपूर और घी के दीपक से "ॐ जय लक्ष्मी माता" गाते हुए आरती करें। घण्टी बजाएँ और शंख फूँकें।',
        sa: 'कर्पूरघृतदीपेन "ॐ जय लक्ष्मी माता" गायन्ती आरात्रिकं कुर्यात्। घण्टां वादयेत् शङ्खं च ध्मापयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 20,
      title: { en: 'Pradakshina', hi: 'प्रदक्षिणा', sa: 'प्रदक्षिणा' },
      description: {
        en: 'Circumambulate the puja setup 3 times in a clockwise direction.',
        hi: 'पूजा स्थल की 3 बार दक्षिणावर्त परिक्रमा करें।',
        sa: 'पूजास्थलस्य त्रिवारं प्रदक्षिणां कुर्यात्।',
      },
      duration: '2 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 21,
      title: { en: 'Pushpanjali and Prarthana', hi: 'पुष्पाञ्जलि और प्रार्थना', sa: 'पुष्पाञ्जलिः प्रार्थना च' },
      description: {
        en: 'Offer flowers with both hands while praying for prosperity. Bow down and seek blessings.',
        hi: 'समृद्धि की प्रार्थना करते हुए दोनों हाथों से पुष्प अर्पित करें। प्रणाम कर आशीर्वाद माँगें।',
        sa: 'समृद्धिं प्रार्थयन् उभयहस्ताभ्यां पुष्पाणि समर्पयेत्। प्रणम्य आशीर्वादं याचेत।',
      },
      duration: '2 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 22,
      title: { en: 'Griha Deepa Sthapana', hi: 'गृह दीप स्थापना', sa: 'गृहदीपस्थापना' },
      description: {
        en: 'After the puja, place lit diyas at the entrance, windows, balcony, tulsi plant, and every room of the house. The entire home should be illuminated.',
        hi: 'पूजा के बाद, दरवाजे, खिड़कियों, बालकनी, तुलसी के पौधे और घर के हर कमरे में जलते दीपक रखें। पूरा घर दीपों से जगमगाना चाहिए।',
        sa: 'पूजानन्तरं द्वारे गवाक्षेषु वातायने तुलसीवृक्षे गृहस्य सर्वेषु कक्षेषु च प्रज्वलितदीपान् स्थापयेत्। सम्पूर्णं गृहं दीपैः प्रकाशितं भवेत्।',
      },
      duration: '10 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'lakshmi-beej',
      name: { en: 'Lakshmi Beej Mantra', hi: 'लक्ष्मी बीज मन्त्र', sa: 'लक्ष्मीबीजमन्त्रः' },
      devanagari: 'ॐ श्रीं महालक्ष्म्यै नमः',
      iast: 'oṃ śrīṃ mahālakṣmyai namaḥ',
      meaning: {
        en: 'Salutations to the great Goddess Lakshmi, the bestower of auspiciousness and wealth',
        hi: 'शुभ और धन प्रदान करने वाली महान देवी लक्ष्मी को नमन',
        sa: 'श्रेयोधनप्रदायिन्यै महालक्ष्म्यै नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Primary mantra for Diwali Lakshmi puja — chant 108 times with a mala',
        hi: 'दिवाली लक्ष्मी पूजा का मुख्य मन्त्र — माला से 108 बार जपें',
        sa: 'दीपावलीलक्ष्मीपूजायाः प्रधानमन्त्रः — मालया अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'shri-sukta',
      name: { en: 'Shri Sukta (Opening Verse)', hi: 'श्री सूक्त (प्रथम मन्त्र)', sa: 'श्रीसूक्तम् (प्रथममन्त्रः)' },
      devanagari: 'ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम्। चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥',
      iast: 'oṃ hiraṇyavarṇāṃ hariṇīṃ suvarṇarajatasrajām | candrāṃ hiraṇmayīṃ lakṣmīṃ jātavedo ma āvaha ||',
      meaning: {
        en: 'O Jataveda (Agni), bring to me that Lakshmi who is golden-hued, deer-like, adorned with gold and silver garlands, radiant as the moon, and resplendent as gold.',
        hi: 'हे जातवेद (अग्नि), उस लक्ष्मी को मेरे पास लाओ जो सुवर्ण वर्ण वाली, हरिणी के समान, स्वर्ण-रजत माला धारिणी, चन्द्र समान कान्तिमती और हिरण्मयी हैं।',
        sa: 'हे जातवेदः, हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजां चन्द्रां हिरण्मयीं लक्ष्मीं मह्यम् आवह।',
      },
      usage: {
        en: 'Recite the full Shri Sukta (15 verses) during the main Lakshmi puja',
        hi: 'मुख्य लक्ष्मी पूजा के दौरान सम्पूर्ण श्री सूक्त (15 मन्त्र) का पाठ करें',
        sa: 'प्रधानलक्ष्मीपूजनसमये सम्पूर्णं श्रीसूक्तम् (पञ्चदशमन्त्राः) पठेत्',
      },
    },
    {
      id: 'ganesh-beej-diwali',
      name: { en: 'Ganesh Beej Mantra', hi: 'गणेश बीज मन्त्र', sa: 'गणेशबीजमन्त्रः' },
      devanagari: 'ॐ गं गणपतये नमः',
      iast: 'oṃ gaṃ gaṇapataye namaḥ',
      meaning: {
        en: 'Salutations to Lord Ganapati, the remover of obstacles',
        hi: 'विघ्नहर्ता भगवान गणपति को नमन',
        sa: 'विघ्नविनाशकाय श्रीगणपतये नमः',
      },
      usage: {
        en: 'Chant before Lakshmi puja to invoke Ganesha\'s blessings for obstacle-free worship',
        hi: 'लक्ष्मी पूजा से पहले विघ्नरहित पूजा के लिए गणेश जी का आशीर्वाद प्राप्त करने हेतु जपें',
        sa: 'लक्ष्मीपूजनात् पूर्वं निर्विघ्नपूजनार्थं गणेशानुग्रहप्राप्त्यर्थं जपेत्',
      },
    },
    {
      id: 'kubera-mantra',
      name: { en: 'Kubera Mantra', hi: 'कुबेर मन्त्र', sa: 'कुबेरमन्त्रः' },
      devanagari: 'ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि दापय स्वाहा',
      iast: 'oṃ yakṣāya kuberāya vaiśravaṇāya dhanadhānyādhipataye dhanadhānyasamṛddhiṃ me dehi dāpaya svāhā',
      meaning: {
        en: 'O Kubera, lord of Yakshas, son of Vishravana, lord of wealth and grain — bestow upon me prosperity of wealth and grain.',
        hi: 'हे कुबेर, यक्षों के स्वामी, विश्रवण के पुत्र, धन-धान्य के अधिपति — मुझे धन-धान्य की समृद्धि प्रदान करें।',
        sa: 'हे यक्ष कुबेर वैश्रवण धनधान्याधिपते, मह्यं धनधान्यसमृद्धिं देहि दापय।',
      },
      usage: {
        en: 'Chant during the Kubera puja step for invoking wealth and abundance',
        hi: 'धन और समृद्धि के आवाहन के लिए कुबेर पूजा चरण में जपें',
        sa: 'धनसमृद्ध्यावाहनार्थं कुबेरपूजनचरणे जपेत्',
      },
    },
    {
      id: 'deepa-mantra',
      name: { en: 'Deepa (Lamp) Mantra', hi: 'दीप मन्त्र', sa: 'दीपमन्त्रः' },
      devanagari: 'शुभं करोति कल्याणमारोग्यं धनसम्पदम्। शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते॥',
      iast: 'śubhaṃ karoti kalyāṇamārogyaṃ dhanasampadam | śatrubuddhivināśāya dīpajyotirnamo\'stu te ||',
      meaning: {
        en: 'The lamp light brings auspiciousness, well-being, health, and wealth. It destroys the intellect of enemies. Salutations to the flame of the lamp.',
        hi: 'दीपक का प्रकाश शुभ, कल्याण, स्वास्थ्य और धन-सम्पदा लाता है। यह शत्रुओं की बुद्धि का नाश करता है। दीप की ज्योति को नमन।',
        sa: 'दीपज्योतिः शुभं कल्याणम् आरोग्यं धनसम्पदं करोति। शत्रुबुद्धिं विनाशयति। दीपज्योतिषे नमः।',
      },
      usage: {
        en: 'Recite while lighting each diya during Griha Deepa Sthapana',
        hi: 'गृह दीप स्थापना में प्रत्येक दीपक जलाते समय पढ़ें',
        sa: 'गृहदीपस्थापनायां प्रतिदीपप्रज्वालनसमये पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Shri Sukta', hi: 'श्री सूक्त', sa: 'श्रीसूक्तम्' },
      verseCount: 15,
      duration: '10 min',
      note: {
        en: 'The primary Vedic hymn to Lakshmi from the Rig Veda. Most important recitation during Diwali puja.',
        hi: 'ऋग्वेद से लक्ष्मी का प्रमुख वैदिक सूक्त। दिवाली पूजा का सबसे महत्वपूर्ण पाठ।',
        sa: 'ऋग्वेदस्य लक्ष्म्याः प्रधानं वैदिकसूक्तम्। दीपावलीपूजायाः सर्वप्रधानं पठनम्।',
      },
    },
    {
      name: { en: 'Lakshmi Ashtottara Shatanamavali', hi: 'लक्ष्मी अष्टोत्तर शतनामावली', sa: 'लक्ष्म्यष्टोत्तरशतनामावली' },
      verseCount: 108,
      duration: '12 min',
      note: {
        en: '108 names of Goddess Lakshmi. Recite while offering flowers or kumkum for each name.',
        hi: 'देवी लक्ष्मी के 108 नाम। प्रत्येक नाम पर पुष्प या कुमकुम अर्पित करते हुए पढ़ें।',
        sa: 'देव्याः लक्ष्म्याः अष्टोत्तरशतनामानि। प्रतिनाम्ना पुष्पं कुङ्कुमं वा समर्पयन् पठेत्।',
      },
    },
  ],

  aarti: {
    name: { en: 'Om Jai Lakshmi Mata', hi: 'ॐ जय लक्ष्मी माता', sa: 'ॐ जय लक्ष्मी माता' },
    devanagari:
      '॥ श्री लक्ष्मी माता की आरती ॥\n\nॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।\nतुमको निशदिन सेवत, हरि विष्णु विधाता॥\nॐ जय लक्ष्मी माता॥\n\nउमा रमा ब्रह्माणी, तुम ही जग माता।\nसूर्य चन्द्रमा ध्यावत, नारद ऋषि गाता॥\nॐ जय लक्ष्मी माता॥\n\nदुर्गा रूप निरंजनि, सुख सम्पत्ति दाता।\nजो कोई तुमको ध्यावत, ऋद्धि सिद्धि धन पाता॥\nॐ जय लक्ष्मी माता॥\n\nतुम पाताल निवासिनि, तुम ही शुभदाता।\nकर्म प्रभाव प्रकाशिनि, भवनिधि की त्राता॥\nॐ जय लक्ष्मी माता॥\n\nजिस घर में तुम रहतीं, सब सद्गुण आता।\nसब सम्भव हो जाता, मन नहीं घबराता॥\nॐ जय लक्ष्मी माता॥\n\nतुम बिन यज्ञ न होवे, वस्त्र न कोई पाता।\nखान पान का वैभव, सब तुमसे आता॥\nॐ जय लक्ष्मी माता॥\n\nमहालक्ष्मी जी की आरती, जो कोई जन गाता।\nउर आनन्द समाता, पाप उतर जाता॥\nॐ जय लक्ष्मी माता॥',
    iast:
      '|| śrī lakṣmī mātā kī āratī ||\n\noṃ jaya lakṣmī mātā, maiyā jaya lakṣmī mātā |\ntumako niśadina sevata, hari viṣṇu vidhātā ||\noṃ jaya lakṣmī mātā ||\n\numā ramā brahmāṇī, tuma hī jaga mātā |\nsūrya candramā dhyāvata, nārada ṛṣi gātā ||\noṃ jaya lakṣmī mātā ||\n\ndurgā rūpa niraṃjani, sukha sampatti dātā |\njo koī tumako dhyāvata, ṛddhi siddhi dhana pātā ||\noṃ jaya lakṣmī mātā ||\n\ntuma pātāla nivāsini, tuma hī śubhadātā |\nkarma prabhāva prakāśini, bhavanidhi kī trātā ||\noṃ jaya lakṣmī mātā ||\n\njisa ghara meṃ tuma rahatīṃ, saba sadguṇa ātā |\nsaba sambhava ho jātā, mana nahīṃ ghabarātā ||\noṃ jaya lakṣmī mātā ||\n\ntuma bina yajña na hove, vastra na koī pātā |\nkhāna pāna kā vaibhava, saba tumase ātā ||\noṃ jaya lakṣmī mātā ||\n\nmahālakṣmī jī kī āratī, jo koī jana gātā |\nura ānanda samātā, pāpa utara jātā ||\noṃ jaya lakṣmī mātā ||',
  },

  naivedya: {
    en: 'Kheer (rice pudding), laddoos, barfi, fresh fruits, whole coconut, dry fruits, batasha (sugar drops), and specially prepared sweets',
    hi: 'खीर, लड्डू, बर्फी, ताजे फल, पूरा नारियल, मेवे, बताशे और विशेष रूप से बनी मिठाइयाँ',
    sa: 'पायसम्, मोदकानि, बर्फी, नवफलानि, सम्पूर्णनारिकेलम्, शुष्कफलानि, शर्कराणि, विशेषमिष्टान्नानि च',
  },

  precautions: [
    {
      en: 'Perform puja facing East or North direction for maximum auspiciousness',
      hi: 'अधिकतम शुभता के लिए पूर्व या उत्तर दिशा की ओर मुख करके पूजा करें',
      sa: 'परमशुभत्वार्थं पूर्वोत्तरदिशाभिमुखं पूजां कुर्यात्',
    },
    {
      en: 'Do not use a broken coconut — it must be whole and uncracked for the puja',
      hi: 'टूटा हुआ नारियल उपयोग न करें — पूजा के लिए यह पूरा और बिना दरार का होना चाहिए',
      sa: 'भग्नं नारिकेलं नोपयोजयेत् — पूजार्थं सम्पूर्णम् अभग्नं भवेत्',
    },
    {
      en: 'All 13 lamps must be lit before sunset — do not light them after dark without first completing the puja setup',
      hi: 'सभी 13 दीपक सूर्यास्त से पहले जलाने चाहिए — पूजा की तैयारी पूरी किए बिना अँधेरे में न जलाएँ',
      sa: 'सूर्यास्तात् पूर्वं सर्वे त्रयोदश दीपाः प्रज्वालनीयाः — पूजासज्जतां विना अन्धकारे न प्रज्वालयेत्',
    },
    {
      en: 'Tie the new Bahi Khata (account book) with a red thread (mauli) after the puja and keep it in the safe or treasury',
      hi: 'पूजा के बाद नए बही खाते को लाल धागे (मौली) से बाँधें और तिजोरी में रखें',
      sa: 'पूजानन्तरं नवलेखापुस्तकं रक्तसूत्रेण (मौलिना) बध्नीयात् कोषागारे च स्थापयेत्',
    },
    {
      en: 'Do not sleep on Diwali night — staying awake is believed to please Lakshmi and ensure her continued presence',
      hi: 'दिवाली की रात सोएँ नहीं — जागरण से लक्ष्मी प्रसन्न होती हैं और उनकी कृपा बनी रहती है',
      sa: 'दीपावलीरात्रौ न निद्रायात् — जागरणेन लक्ष्मीः प्रसीदति तस्याः सान्निध्यं स्थिरं भवति',
    },
  ],

  phala: {
    en: 'Bestowal of wealth and prosperity, removal of poverty and financial hardship, Lakshmi\'s permanent residence in the household, success in business and career, and overall well-being of the family',
    hi: 'धन और समृद्धि की प्राप्ति, गरीबी और आर्थिक कठिनाइयों का निवारण, घर में लक्ष्मी का स्थायी निवास, व्यापार और करियर में सफलता, और परिवार का सम्पूर्ण कल्याण',
    sa: 'धनसमृद्धिप्राप्तिः, दारिद्र्यार्थकष्टनिवारणम्, गृहे लक्ष्म्याः स्थायिनिवासः, वाणिज्यजीवनसिद्धिः, कुटुम्बस्य सम्पूर्णकल्याणं च',
  },
};

import type { PujaVidhi } from './types';

export const VASANT_PANCHAMI_PUJA: PujaVidhi = {
  festivalSlug: 'vasant-panchami',
  category: 'festival',
  deity: { en: 'Saraswati', hi: 'सरस्वती', sa: 'सरस्वती' },

  samagri: [
    { name: { en: 'Saraswati idol or image', hi: 'सरस्वती मूर्ति या चित्र', sa: 'सरस्वतीमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'White flowers (especially white lotus)', hi: 'श्वेत फूल (विशेषकर श्वेत कमल)', sa: 'श्वेतपुष्पाणि (विशेषतः श्वेतकमलम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Yellow flowers (marigold, mustard flowers)', hi: 'पीले फूल (गेंदा, सरसों के फूल)', sa: 'पीतपुष्पाणि (स्थलपद्मम्, सर्षपपुष्पाणि)' }, category: 'flowers', essential: true },
    { name: { en: 'Books (for blessing)', hi: 'पुस्तकें (आशीर्वाद के लिए)', sa: 'पुस्तकानि (आशीर्वादार्थम्)' }, category: 'other', essential: true },
    { name: { en: 'Pen, pencil, or writing instrument', hi: 'कलम, पेंसिल या लेखन सामग्री', sa: 'लेखनी कूर्चिका लेखनसामग्री वा' }, category: 'other', essential: false },
    { name: { en: 'Musical instrument (veena if available)', hi: 'वाद्ययन्त्र (वीणा यदि उपलब्ध हो)', sa: 'वाद्ययन्त्रम् (वीणा यदि उपलभ्यते)' }, category: 'other', essential: false },
    { name: { en: 'White cloth (for altar)', hi: 'श्वेत कपड़ा (वेदी के लिए)', sa: 'श्वेतवस्त्रम् (वेदिकायै)' }, category: 'clothing', essential: false },
    { name: { en: 'Honey', hi: 'शहद', sa: 'मधु' }, category: 'food', essential: false },
    { name: { en: 'Panchamrit (milk, curd, ghee, honey, sugar)', hi: 'पंचामृत (दूध, दही, घी, शहद, शक्कर)', sa: 'पञ्चामृतम् (क्षीरं दधि घृतं मधु शर्करा)' }, category: 'food', essential: true },
    { name: { en: 'Yellow rice (turmeric-tinted akshat)', hi: 'पीले चावल (हल्दी मिश्रित अक्षत)', sa: 'पीताक्षताः (हरिद्रामिश्रिताः)' }, category: 'puja_items', essential: true },
    { name: { en: 'Yellow sweets (kesar barfi, boondi laddoo)', hi: 'पीली मिठाई (केसर बर्फी, बूँदी लड्डू)', sa: 'पीतमिष्टान्नानि (केसरबर्फी, बून्दीमोदकानि)' }, category: 'food', essential: true },
    { name: { en: 'Fruits', hi: 'फल', sa: 'फलानि' }, category: 'food', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Yellow cloth or dupatta (to wear)', hi: 'पीला कपड़ा या दुपट्टा (पहनने के लिए)', sa: 'पीतवस्त्रम् (धारणार्थम्)' }, category: 'clothing', essential: false },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Saraswati Puja is performed during Purva Madhyahna (forenoon), ideally between 7:00 AM and 12:00 PM on Magha Shukla Panchami. Morning hours are most auspicious as Saraswati is a morning deity associated with Brahma Muhurta.',
    hi: 'सरस्वती पूजा पूर्व मध्याह्न (पूर्वाह्न) में, आदर्श रूप से माघ शुक्ल पंचमी को प्रातः 7 से 12 बजे के बीच की जाती है। प्रातःकाल सबसे शुभ है क्योंकि सरस्वती ब्रह्म मुहूर्त से जुड़ी प्रातःकालीन देवी हैं।',
    sa: 'सरस्वतीपूजा पूर्वमध्याह्ने माघशुक्लपञ्चम्यां प्रातः सप्तवादनतः मध्याह्नद्वादशवादनपर्यन्तं क्रियते। प्रातःकालः सर्वोत्तमः यतः सरस्वती ब्रह्ममुहूर्तसम्बद्धा प्रातःकालीनदेवता।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this auspicious Magha Shukla Panchami (Vasant Panchami), I undertake the worship of Goddess Saraswati, the bestower of knowledge, wisdom, arts, and speech, for the attainment of vidya (learning) and the flowering of intellect.',
    hi: 'इस शुभ माघ शुक्ल पंचमी (वसन्त पंचमी) पर, विद्या (ज्ञान) की प्राप्ति और बुद्धि के विकास के लिए, ज्ञान, प्रज्ञा, कला और वाक् की दात्री देवी सरस्वती की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे माघशुक्लपञ्चम्यां (वसन्तपञ्चम्याम्) विद्याप्राप्त्यर्थं बुद्धिविकासार्थं च ज्ञानप्रज्ञाकलावाक्प्रदायिन्याः श्रीसरस्वतीदेव्याः पूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Wear Yellow & Preparation', hi: 'पीला पहनें एवं तैयारी', sa: 'पीतवस्त्रधारणं सज्जता च' },
      description: {
        en: 'Wake early, bathe, and wear yellow clothes — yellow represents the mustard fields blooming in spring and is Saraswati\'s auspicious colour for Vasant Panchami. Clean the puja area and spread a white cloth on the platform.',
        hi: 'जल्दी उठकर स्नान करें और पीले कपड़े पहनें — पीला रंग वसन्त में खिलते सरसों के खेतों का प्रतीक है और वसन्त पंचमी पर सरस्वती का शुभ रंग है। पूजा स्थल को साफ कर चौकी पर श्वेत कपड़ा बिछाएँ।',
        sa: 'प्रातः उत्थाय स्नात्वा पीतवस्त्राणि धारयेत् — पीतवर्णः वसन्ते प्रफुल्लसर्षपक्षेत्राणां प्रतीकः वसन्तपञ्चम्यां सरस्वत्याः शुभवर्णः च। पूजास्थलं शोधयित्वा वेदिकायां श्वेतवस्त्रं विस्तारयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Saraswati Altar Setup', hi: 'सरस्वती वेदी स्थापना', sa: 'सरस्वतीवेदिकास्थापनम्' },
      description: {
        en: 'Place the Saraswati idol/image on the white cloth facing East. Place books, writing instruments, and musical instruments before the idol — these will be blessed by the goddess. Arrange yellow and white flowers around the altar.',
        hi: 'श्वेत कपड़े पर सरस्वती मूर्ति/चित्र पूर्वमुखी रखें। मूर्ति के सामने पुस्तकें, लेखन सामग्री और वाद्ययन्त्र रखें — ये देवी द्वारा आशीर्वादित होंगे। वेदी के चारों ओर पीले और सफेद फूल सजाएँ।',
        sa: 'श्वेतवस्त्रोपरि सरस्वतीमूर्तिं पूर्वाभिमुखीं स्थापयेत्। मूर्तेः पुरतः पुस्तकानि लेखनसामग्रीं वाद्ययन्त्राणि च स्थापयेत् — एतानि देव्या आशीर्वादितानि भविष्यन्ति। वेदिकायाः परितः पीतश्वेतपुष्पाणि सज्जयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Achamana & Sankalpa', hi: 'आचमन एवं संकल्प', sa: 'आचमनं सङ्कल्पश्च' },
      description: {
        en: 'Perform achamana (sip water three times for purification). Then take yellow akshat and water in the right hand, state the date, location, and purpose of the Saraswati puja, and release the water.',
        hi: 'आचमन करें (शुद्धि के लिए तीन बार जल का आचमन)। फिर दाहिने हाथ में पीले अक्षत और जल लेकर, तिथि, स्थान और सरस्वती पूजा का उद्देश्य बोलकर जल छोड़ें।',
        sa: 'आचमनं कुर्यात् (शुद्ध्यर्थं त्रिवारं जलम् आचामेत्)। ततः दक्षिणहस्ते पीताक्षतान् जलं च गृहीत्वा तिथिस्थानप्रयोजनं वदेत् ततो जलं विसृजेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Saraswati Avahana & Shodashopachar Puja', hi: 'सरस्वती आवाहन एवं षोडशोपचार पूजा', sa: 'सरस्वत्यावाहनं षोडशोपचारपूजनं च' },
      description: {
        en: 'Invoke Goddess Saraswati into the idol with folded hands while chanting the Saraswati Beej Mantra. Perform the sixteen-step worship (Shodashopachar): Avahana, Asana, Padya, Arghya, Achamaniya, Snana (with Panchamrit), Vastra, Yajnopavita, Gandha (sandalwood), Pushpa (white and yellow flowers), Dhupa, Deepa, Naivedya, Tambula, Dakshina, Pradakshina.',
        hi: 'सरस्वती बीज मन्त्र पढ़ते हुए हाथ जोड़कर मूर्ति में सरस्वती का आवाहन करें। षोडशोपचार पूजा करें: आवाहन, आसन, पाद्य, अर्घ्य, आचमनीय, स्नान (पंचामृत से), वस्त्र, यज्ञोपवीत, गन्ध (चन्दन), पुष्प (श्वेत और पीले फूल), धूप, दीप, नैवेद्य, ताम्बूल, दक्षिणा, प्रदक्षिणा।',
        sa: 'सरस्वतीबीजमन्त्रं जपन् कृताञ्जलिपुटा मूर्तौ सरस्वत्या आवाहनं कुर्यात्। षोडशोपचारपूजनं कुर्यात् — आवाहनम्, आसनम्, पाद्यम्, अर्घ्यम्, आचमनीयम्, स्नानम् (पञ्चामृतेन), वस्त्रम्, यज्ञोपवीतम्, गन्धम् (चन्दनम्), पुष्पम् (श्वेतपीतपुष्पाणि), धूपम्, दीपम्, नैवेद्यम्, ताम्बूलम्, दक्षिणा, प्रदक्षिणा।',
      },
      mantraRef: 'saraswati-beej',
      duration: '20 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Offer Yellow Items', hi: 'पीली वस्तुएँ अर्पित करें', sa: 'पीतवस्तूनि समर्पयेत्' },
      description: {
        en: 'Offer yellow rice (haldi akshat), yellow flowers, yellow sweets (kesar barfi, boondi laddoo), and yellow fruits. Yellow is the colour of Vasant (spring) and represents knowledge blossoming like mustard flowers.',
        hi: 'पीले चावल (हल्दी अक्षत), पीले फूल, पीली मिठाई (केसर बर्फी, बूँदी लड्डू) और पीले फल अर्पित करें। पीला वसन्त (बसन्त) का रंग है और सरसों के फूलों की तरह खिलते ज्ञान का प्रतीक है।',
        sa: 'पीताक्षतान् पीतपुष्पाणि पीतमिष्टान्नानि (केसरबर्फी बून्दीमोदकानि) पीतफलानि च समर्पयेत्। पीतवर्णः वसन्तस्य वर्णः सर्षपपुष्पवत् प्रफुल्लविद्यायाः प्रतीकः।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Saraswati Vandana Recitation', hi: 'सरस्वती वन्दना पाठ', sa: 'सरस्वतीवन्दनापाठः' },
      description: {
        en: 'Recite the Saraswati Vandana shloka "Ya Kundendu Tusharahara Dhavala..." with devotion. This is the most famous invocation of Saraswati describing her white radiance, veena, and lotus seat.',
        hi: '"या कुन्देन्दुतुषारहारधवला..." सरस्वती वन्दना श्लोक भक्तिपूर्वक पढ़ें। यह सरस्वती का सबसे प्रसिद्ध आवाहन है जो उनकी श्वेत कान्ति, वीणा और कमलासन का वर्णन करता है।',
        sa: '"या कुन्देन्दुतुषारहारधवला..." सरस्वतीवन्दनाश्लोकं भक्त्या पठेत्। इदं सरस्वत्याः प्रसिद्धतमम् आवाहनं यत् तस्याः श्वेतकान्तिं वीणां कमलासनं च वर्णयति।',
      },
      mantraRef: 'saraswati-vandana',
      duration: '5 min',
      essential: false,
      stepType: 'mantra',
    },
    {
      step: 7,
      title: { en: 'Saraswati Gayatri Japa', hi: 'सरस्वती गायत्री जप', sa: 'सरस्वतीगायत्रीजपः' },
      description: {
        en: 'Chant the Saraswati Gayatri Mantra 108 times using a mala. Focus on knowledge, clarity of speech, and creative inspiration.',
        hi: 'माला से सरस्वती गायत्री मन्त्र 108 बार जपें। ज्ञान, वाणी की स्पष्टता और सृजनात्मक प्रेरणा पर ध्यान केन्द्रित करें।',
        sa: 'मालया सरस्वतीगायत्रीमन्त्रम् अष्टोत्तरशतवारं जपेत्। ज्ञाने वाक्स्पष्टतायां सृजनात्मकप्रेरणायां च मनो निवेशयेत्।',
      },
      mantraRef: 'saraswati-gayatri',
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 8,
      title: { en: 'Vidyarambham (Children\'s First Writing)', hi: 'विद्यारम्भम् (बच्चों का प्रथम लेखन)', sa: 'विद्यारम्भम् (शिशूनां प्रथमलेखनम्)' },
      description: {
        en: 'This is the sacred ceremony of initiating children into the world of letters. Seat the child before the Saraswati idol. Guide the child\'s hand to write "Om" (ॐ) or the alphabet "अ आ इ ई" on a slate, plate of rice, or in a notebook. This is considered the most auspicious day to begin a child\'s education.',
        hi: 'यह बच्चों को अक्षर-ज्ञान की दुनिया में दीक्षित करने की पवित्र विधि है। बच्चे को सरस्वती मूर्ति के सामने बिठाएँ। बच्चे का हाथ पकड़कर स्लेट, चावल की थाली या नोटबुक पर "ॐ" या "अ आ इ ई" लिखवाएँ। शिक्षा आरम्भ करने के लिए यह सबसे शुभ दिन माना जाता है।',
        sa: 'इदं शिशून् अक्षरज्ञानलोके दीक्षयितुं पवित्रं कर्म। शिशुं सरस्वतीमूर्तेः पुरतः उपवेशयेत्। शिशोः हस्तं गृहीत्वा पट्टे तण्डुलपात्रे पुस्तके वा "ॐ" अथवा "अ आ इ ई" इति लेखयेत्। शिक्षारम्भार्थम् इदं सर्वशुभतमं दिनं मन्यते।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 9,
      title: { en: 'Naivedya Offering', hi: 'नैवेद्य अर्पण', sa: 'नैवेद्यसमर्पणम्' },
      description: {
        en: 'Offer yellow sweets, fruits, honey, and kheer as naivedya to Goddess Saraswati. Sprinkle water around the offerings while chanting "Om Aim Saraswatyai Namah".',
        hi: 'देवी सरस्वती को पीली मिठाई, फल, शहद और खीर नैवेद्य के रूप में अर्पित करें। "ॐ ऐं सरस्वत्यै नमः" का जाप करते हुए भोग के चारों ओर जल छिड़कें।',
        sa: 'श्रीसरस्वत्यै पीतमिष्टान्नानि फलानि मधु पायसं च नैवेद्यरूपेण निवेदयेत्। "ॐ ऐं सरस्वत्यै नमः" इति जपन् नैवेद्यस्य परितः जलं सिञ्चेत्।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'meditation',
    },
    {
      step: 10,
      title: { en: 'Saraswati Aarti', hi: 'सरस्वती आरती', sa: 'सरस्वत्यारात्रिकम्' },
      description: {
        en: 'Perform aarti with a ghee lamp and camphor while singing "Jai Saraswati Mata". Ring a bell during the aarti. All family members should participate.',
        hi: 'घी के दीपक और कपूर से "जय सरस्वती माता" गाते हुए आरती करें। आरती के दौरान घण्टी बजाएँ। सभी परिवारजनों को भाग लेना चाहिए।',
        sa: 'घृतदीपकर्पूरेण "जय सरस्वती माता" गायन्ती आरात्रिकं कुर्यात्। आरात्रिकसमये घण्टां वादयेत्। सर्वे कुटुम्बिनः भागं गृह्णीयुः।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 11,
      title: { en: 'Pushpanjali & Prarthana', hi: 'पुष्पाञ्जलि एवं प्रार्थना', sa: 'पुष्पाञ्जलिः प्रार्थना च' },
      description: {
        en: 'Offer flowers with both hands while praying for knowledge, wisdom, eloquence, and mastery of arts. Bow down and seek Saraswati\'s blessings. Students should pray for success in examinations and learning.',
        hi: 'ज्ञान, प्रज्ञा, वाक्चातुर्य और कला में निपुणता की प्रार्थना करते हुए दोनों हाथों से पुष्प अर्पित करें। प्रणाम कर सरस्वती का आशीर्वाद माँगें। विद्यार्थी परीक्षा और अध्ययन में सफलता की प्रार्थना करें।',
        sa: 'ज्ञानप्रज्ञावाक्चातुर्यकलानैपुण्यं प्रार्थयन् उभयहस्ताभ्यां पुष्पाणि समर्पयेत्। प्रणम्य सरस्वत्याः आशीर्वादं याचेत। विद्यार्थिनः परीक्षाध्ययनसिद्ध्यर्थं प्रार्थयेयुः।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 12,
      title: { en: 'Prasad Distribution', hi: 'प्रसाद वितरण', sa: 'प्रसादवितरणम्' },
      description: {
        en: 'Distribute the blessed prasad (yellow sweets, fruits) to all family members and visitors. Share the yellow rice as akshata prasad. Books and instruments placed before the deity are now blessed — they may be used from the next day.',
        hi: 'सभी परिवारजनों और आगन्तुकों को आशीर्वादित प्रसाद (पीली मिठाई, फल) वितरित करें। पीले चावल अक्षत प्रसाद के रूप में बाँटें। देवी के सामने रखी पुस्तकें और वाद्ययन्त्र अब आशीर्वादित हैं — अगले दिन से उपयोग किए जा सकते हैं।',
        sa: 'सर्वेभ्यः कुटुम्बिभ्यः आगन्तुकेभ्यश्च आशीर्वादितं प्रसादं (पीतमिष्टान्नानि फलानि) वितरेत्। पीताक्षतान् अक्षतप्रसादरूपेण वितरेत्। देव्याः पुरतः स्थापितानि पुस्तकानि वाद्ययन्त्राणि च आशीर्वादितानि — परेद्युः उपयोक्तव्यानि।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'saraswati-beej',
      name: { en: 'Saraswati Beej Mantra', hi: 'सरस्वती बीज मन्त्र', sa: 'सरस्वतीबीजमन्त्रः' },
      devanagari: 'ॐ ऐं सरस्वत्यै नमः',
      iast: 'oṃ aiṃ sarasvatyai namaḥ',
      meaning: {
        en: 'Salutations to Goddess Saraswati through her seed syllable Aim — the primordial sound of knowledge and speech',
        hi: 'ज्ञान और वाणी की आदि ध्वनि — बीजाक्षर ऐं — के माध्यम से देवी सरस्वती को नमन',
        sa: 'ज्ञानवाक्प्रणवध्वनेः — बीजाक्षरस्य ऐं — माध्यमेन श्रीसरस्वत्यै नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Primary beej mantra for Saraswati puja — chant 108 times during invocation and throughout the puja',
        hi: 'सरस्वती पूजा का मुख्य बीज मन्त्र — आवाहन और पूजा भर में 108 बार जपें',
        sa: 'सरस्वतीपूजायाः प्रधानबीजमन्त्रः — आवाहने पूजने च अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'saraswati-gayatri',
      name: { en: 'Saraswati Gayatri Mantra', hi: 'सरस्वती गायत्री मन्त्र', sa: 'सरस्वतीगायत्रीमन्त्रः' },
      devanagari: 'ॐ वाग्देव्यै विद्महे ब्रह्मपत्न्यै धीमहि तन्नो वाणी प्रचोदयात्',
      iast: 'oṃ vāgdevyai vidmahe brahmapatnyai dhīmahi tanno vāṇī pracodayāt',
      meaning: {
        en: 'We meditate upon the Goddess of Speech. We contemplate the consort of Brahma. May that Vani (Speech) inspire and guide us.',
        hi: 'हम वाक् की देवी का ध्यान करते हैं। ब्रह्मा की पत्नी का चिन्तन करते हैं। वह वाणी हमें प्रेरित और मार्गदर्शित करे।',
        sa: 'वाग्देवीं विद्मः। ब्रह्मपत्नीं धीमहि। वाणी नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times for eloquence, clarity of speech, and academic success',
        hi: 'वाक्चातुर्य, वाणी की स्पष्टता और शैक्षणिक सफलता के लिए 108 बार जपें',
        sa: 'वाक्चातुर्यवाक्स्पष्टताशैक्षणिकसिद्ध्यर्थम् अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'saraswati-vandana',
      name: { en: 'Saraswati Vandana (Ya Kundendu)', hi: 'सरस्वती वन्दना (या कुन्देन्दु)', sa: 'सरस्वतीवन्दना (या कुन्देन्दु)' },
      devanagari: 'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता।\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥\nया ब्रह्माच्युतशंकरप्रभृतिभिर्देवैः सदा पूजिता।\nसा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥',
      iast: 'yā kundendutuṣārahāradhavalā yā śubhravastrāvṛtā |\nyā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā ||\nyā brahmācyutaśaṅkaraprabhṛtibhirdevaiḥ sadā pūjitā |\nsā māṃ pātu sarasvatī bhagavatī niḥśeṣajāḍyāpahā ||',
      meaning: {
        en: 'She who is white as a jasmine flower, the moon, and a garland of snow; She who is draped in pure white garments; She whose hands are adorned with the veena and the boon-giving staff; She who is seated on a white lotus; She who is ever worshipped by Brahma, Vishnu, Shankara, and all the gods — may that Goddess Saraswati, the remover of all ignorance, protect me.',
        hi: 'जो कुन्द के फूल, चन्द्रमा और हिमहार के समान श्वेत हैं; जो शुभ्र वस्त्र धारण किए हैं; जिनके हाथ वीणा और वरदण्ड से सुशोभित हैं; जो श्वेत कमल पर आसीन हैं; जिनकी ब्रह्मा, विष्णु, शंकर आदि देवता सदा पूजा करते हैं — वे सम्पूर्ण जड़ता (अज्ञान) को दूर करने वाली भगवती सरस्वती मेरी रक्षा करें।',
        sa: 'कुन्देन्दुतुषारहारवद् धवला शुभ्रवस्त्रावृता वीणावरदण्डमण्डितकरा श्वेतपद्मासना ब्रह्माच्युतशंकरप्रभृतिदेवैः सदा पूजिता सा भगवती सरस्वती निःशेषजाड्यापहा मां पातु।',
      },
      usage: {
        en: 'The most famous Saraswati invocation — recite at the beginning and end of the puja',
        hi: 'सबसे प्रसिद्ध सरस्वती आवाहन — पूजा के आरम्भ और अन्त में पढ़ें',
        sa: 'प्रसिद्धतमं सरस्वत्यावाहनम् — पूजायाः आदौ अन्ते च पठेत्',
      },
    },
    {
      id: 'saraswati-maheshwari',
      name: { en: 'Saraswati Namastubhyam', hi: 'सरस्वती नमस्तुभ्यम्', sa: 'सरस्वती नमस्तुभ्यम्' },
      devanagari: 'सरस्वती नमस्तुभ्यं वरदे कामरूपिणि।\nविद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा॥',
      iast: 'sarasvatī namastubhyaṃ varade kāmarūpiṇi |\nvidyārambhaṃ kariṣyāmi siddhirbhavatu me sadā ||',
      meaning: {
        en: 'O Saraswati, salutations to you, O bestower of boons, O one who takes any form desired. I am beginning my studies — may I always attain success.',
        hi: 'हे सरस्वती, आपको नमन, हे वरदायिनी, हे कामरूपिणी। मैं विद्या आरम्भ कर रहा/रही हूँ — मुझे सदा सिद्धि प्राप्त हो।',
        sa: 'हे सरस्वति, नमस्तुभ्यम् वरदे कामरूपिणि। विद्यारम्भं करिष्यामि मे सदा सिद्धिर्भवतु।',
      },
      usage: {
        en: 'Recite before beginning the Vidyarambham ceremony for children',
        hi: 'बच्चों के विद्यारम्भम् संस्कार से पहले पढ़ें',
        sa: 'शिशूनां विद्यारम्भसंस्कारात् पूर्वं पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Saraswati Stotram', hi: 'सरस्वती स्तोत्रम्', sa: 'सरस्वतीस्तोत्रम्' },
      verseCount: 12,
      duration: '8 min',
      note: {
        en: 'A devotional hymn praising Saraswati\'s attributes — knowledge, music, arts, and eloquence.',
        hi: 'सरस्वती के गुणों — ज्ञान, संगीत, कला और वाक्चातुर्य — की स्तुति का भक्ति स्तोत्र।',
        sa: 'सरस्वत्याः गुणानां — ज्ञानसंगीतकलावाक्चातुर्यस्य — स्तुतिभक्तिस्तोत्रम्।',
      },
    },
    {
      name: { en: 'Saraswati Ashtottara Shatanamavali', hi: 'सरस्वती अष्टोत्तर शतनामावली', sa: 'सरस्वत्यष्टोत्तरशतनामावली' },
      verseCount: 108,
      duration: '12 min',
      note: {
        en: '108 names of Goddess Saraswati. Recite while offering yellow flowers for each name.',
        hi: 'देवी सरस्वती के 108 नाम। प्रत्येक नाम पर पीले फूल अर्पित करते हुए पढ़ें।',
        sa: 'देव्याः सरस्वत्याः अष्टोत्तरशतनामानि। प्रतिनाम्ना पीतपुष्पं समर्पयन् पठेत्।',
      },
    },
  ],

  aarti: {
    name: { en: 'Jai Saraswati Mata', hi: 'जय सरस्वती माता', sa: 'जय सरस्वती माता' },
    devanagari:
      '॥ श्री सरस्वती माता की आरती ॥\n\nॐ जय सरस्वती माता, मैया जय सरस्वती माता।\nसद्गुण वैभव शालिनी, त्रिभुवन विख्याता॥\nॐ जय सरस्वती माता॥\n\nचन्द्रवदनि पद्मासिनि, द्युति मंगलकारी।\nसोहे शुभ हंस सवारी, अतुल तेजधारी॥\nॐ जय सरस्वती माता॥\n\nबाएं कर में वीणा, दाएं कर में माला।\nशीश मुकुट मणि सोहे, गल मोतियन माला॥\nॐ जय सरस्वती माता॥\n\nदेवी शरण जो आए, उनका उद्धार किया।\nपैठी मंथरा दासी, रावण संहार किया॥\nॐ जय सरस्वती माता॥\n\nविद्या ज्ञान प्रदायिनी, ज्ञान प्रकाश भरो।\nमोह अज्ञान और तिमिर का, जग से नाश करो॥\nॐ जय सरस्वती माता॥\n\nधूप दीप फल मेवा, माँ स्वीकार करो।\nज्ञानचक्षु दे माता, जग निस्तार करो॥\nॐ जय सरस्वती माता॥\n\nमाँ सरस्वती की आरती, जो कोई जन गावे।\nहितकारी सुखकारी, ज्ञान भक्ति पावे॥\nॐ जय सरस्वती माता॥',
    iast:
      '|| śrī sarasvatī mātā kī āratī ||\n\noṃ jaya sarasvatī mātā, maiyā jaya sarasvatī mātā |\nsadguṇa vaibhava śālinī, tribhuvana vikhyātā ||\noṃ jaya sarasvatī mātā ||\n\ncandravadani padmāsini, dyuti maṅgalakārī |\nsohe śubha haṃsa savārī, atula tejdhārī ||\noṃ jaya sarasvatī mātā ||\n\nbāeṃ kara meṃ vīṇā, dāeṃ kara meṃ mālā |\nśīśa mukuṭa maṇi sohe, gala motiyana mālā ||\noṃ jaya sarasvatī mātā ||\n\ndevī śaraṇa jo āe, unakā uddhāra kiyā |\npaiṭhī mantharā dāsī, rāvaṇa saṃhāra kiyā ||\noṃ jaya sarasvatī mātā ||\n\nvidyā jñāna pradāyinī, jñāna prakāśa bharo |\nmoha ajñāna aura timira kā, jaga se nāśa karo ||\noṃ jaya sarasvatī mātā ||\n\ndhūpa dīpa phala mevā, māṃ svīkāra karo |\njñānacakṣu de mātā, jaga nistāra karo ||\noṃ jaya sarasvatī mātā ||\n\nmāṃ sarasvatī kī āratī, jo koī jana gāve |\nhitakārī sukhakārī, jñāna bhakti pāve ||\noṃ jaya sarasvatī mātā ||',
  },

  naivedya: {
    en: 'Yellow sweets (kesar barfi, boondi laddoo), kheer, honey, seasonal fruits, panjiri, and panchamrit',
    hi: 'पीली मिठाई (केसर बर्फी, बूँदी लड्डू), खीर, शहद, मौसमी फल, पंजीरी और पंचामृत',
    sa: 'पीतमिष्टान्नानि (केसरबर्फी, बून्दीमोदकानि), पायसम्, मधु, ऋतुफलानि, पञ्जीरी, पञ्चामृतं च',
  },

  precautions: [
    {
      en: 'Wear only yellow or white clothes on Vasant Panchami — avoid dark or black colours',
      hi: 'वसन्त पंचमी पर केवल पीले या सफेद कपड़े पहनें — गहरे या काले रंग से बचें',
      sa: 'वसन्तपञ्चम्यां पीतानि श्वेतानि वा वस्त्राणि एव धारयेत् — कृष्णगहनवर्णान् वर्जयेत्',
    },
    {
      en: 'Do not study new subjects or start new learning until the puja is complete — begin studies only after receiving Saraswati\'s blessings',
      hi: 'पूजा पूर्ण होने तक नए विषय न पढ़ें या नई शिक्षा शुरू न करें — सरस्वती का आशीर्वाद मिलने के बाद ही अध्ययन आरम्भ करें',
      sa: 'पूजासमाप्तेः पूर्वं नवविषयान् न पठेत् नवशिक्षां न आरभेत् — सरस्वत्याः आशीर्वादप्राप्त्यनन्तरमेव अध्ययनम् आरभेत्',
    },
    {
      en: 'Books and instruments placed before Saraswati should not be read or used on puja day — they are being sanctified. Resume use from the next day.',
      hi: 'सरस्वती के सामने रखी पुस्तकें और वाद्ययन्त्र पूजा के दिन न पढ़ें या उपयोग करें — वे पवित्र किए जा रहे हैं। अगले दिन से उपयोग करें।',
      sa: 'सरस्वत्याः पुरतः स्थापितानि पुस्तकानि वाद्ययन्त्राणि च पूजादिने न पठेत् न उपयोजयेत् — तानि संस्क्रियन्ते। परेद्युः उपयोगम् आरभेत्।',
    },
    {
      en: 'Do not eat non-vegetarian food or consume alcohol on this day — maintain purity of body and mind',
      hi: 'इस दिन माँसाहार न करें और मद्यपान न करें — शरीर और मन की शुद्धता बनाए रखें',
      sa: 'अस्मिन् दिने मांसं न भक्षयेत् मद्यं न पिबेत् — शरीरमनसोः शुद्धिं पालयेत्',
    },
  ],

  phala: {
    en: 'Blessings of Goddess Saraswati for knowledge, wisdom, eloquence, mastery of arts and music, success in academics and examinations, clarity of thought and speech, creative inspiration, and removal of ignorance (jadya)',
    hi: 'ज्ञान, प्रज्ञा, वाक्चातुर्य, कला और संगीत में निपुणता, शैक्षणिक और परीक्षा में सफलता, विचार और वाणी की स्पष्टता, सृजनात्मक प्रेरणा, और अज्ञान (जड़ता) के निवारण के लिए देवी सरस्वती का आशीर्वाद',
    sa: 'ज्ञानप्रज्ञावाक्चातुर्यकलासंगीतनैपुण्यशैक्षणिकपरीक्षासिद्धिविचारवाक्स्पष्टतासृजनात्मकप्रेरणाजाड्यनिवारणार्थं श्रीसरस्वतीदेव्याः आशीर्वादः',
  },
};

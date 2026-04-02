import type { PujaVidhi } from './types';

export const HANUMAN_JAYANTI_PUJA: PujaVidhi = {
  festivalSlug: 'hanuman-jayanti',
  category: 'festival',
  deity: { en: 'Hanuman', hi: 'हनुमान', sa: 'हनुमान्' },

  samagri: [
    { name: { en: 'Hanuman idol or image', hi: 'हनुमान मूर्ति या चित्र', sa: 'हनुमन्मूर्तिः अथवा चित्रम्' } },
    { name: { en: 'Sindoor (vermilion)', hi: 'सिन्दूर', sa: 'सिन्दूरम्' }, note: { en: 'Most important offering for Hanuman', hi: 'हनुमान जी का सबसे प्रिय अर्पण', sa: 'हनुमतः प्रियतमम् अर्पणम्' } },
    { name: { en: 'Jasmine / Chameli oil', hi: 'चमेली का तेल', sa: 'चमेलीतैलम्' } },
    { name: { en: 'Janeyu (sacred thread)', hi: 'जनेऊ (यज्ञोपवीत)', sa: 'यज्ञोपवीतम्' } },
    { name: { en: 'Bananas', hi: 'केले', sa: 'कदलीफलानि' }, quantity: '5' },
    { name: { en: 'Boondi Laddoo', hi: 'बूँदी के लड्डू', sa: 'बून्दीमोदकानि' }, quantity: '5' },
    { name: { en: 'Red flowers (hibiscus preferred)', hi: 'लाल फूल (गुड़हल श्रेष्ठ)', sa: 'रक्तपुष्पाणि (जपापुष्पं श्रेष्ठम्)' } },
    { name: { en: 'Betel leaves (paan)', hi: 'पान के पत्ते', sa: 'ताम्बूलपत्राणि' }, quantity: '5' },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' } },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' } },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' } },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1' },
    { name: { en: 'Red cloth', hi: 'लाल कपड़ा', sa: 'रक्तवस्त्रम्' } },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Hanuman Jayanti puja is performed at sunrise, as Hanuman was born at sunrise on Chaitra Purnima. The ideal time is within one hour of sunrise.',
    hi: 'हनुमान जयन्ती पूजा सूर्योदय के समय की जाती है, क्योंकि हनुमान जी का जन्म चैत्र पूर्णिमा को सूर्योदय के समय हुआ था। आदर्श समय सूर्योदय के एक घण्टे के भीतर है।',
    sa: 'हनुमज्जयन्तीपूजा सूर्योदयकाले क्रियते, यतो हनुमान् चैत्रपूर्णिमायां सूर्योदयकाले जातः। सूर्योदयात् एकहोरापर्यन्तम् आदर्शसमयः।',
  },

  sankalpa: {
    en: 'On this auspicious Chaitra Purnima (Hanuman Jayanti), I undertake the worship of Lord Hanuman for strength, courage, devotion, and protection from all adversities.',
    hi: 'इस शुभ चैत्र पूर्णिमा (हनुमान जयन्ती) पर, बल, साहस, भक्ति और सभी विपत्तियों से रक्षा के लिए, मैं भगवान हनुमान की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे चैत्रपूर्णिमायां (हनुमज्जयन्त्याम्) बलशौर्यभक्तिसर्वविपत्तिरक्षणार्थं श्रीहनुमत्पूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation', hi: 'तैयारी', sa: 'सज्जता' },
      description: {
        en: 'Rise before sunrise. Bathe and wear clean clothes (red/orange preferred). Clean the puja area and place a red cloth on the platform. Install the Hanuman idol/image facing South (as Hanuman faces South — Dakshinamukhi).',
        hi: 'सूर्योदय से पहले उठें। स्नान करें और स्वच्छ वस्त्र (लाल/केसरिया श्रेष्ठ) पहनें। पूजा स्थल साफ करें और चौकी पर लाल कपड़ा बिछाएँ। हनुमान मूर्ति/चित्र दक्षिणमुखी स्थापित करें।',
        sa: 'सूर्योदयात् पूर्वम् उत्तिष्ठेत्। स्नात्वा शुचिवस्त्राणि (रक्तकाषायवर्णानि श्रेष्ठानि) धारयेत्। पूजास्थलं शोधयेत् वेदिकायां रक्तवस्त्रं विस्तारयेत्। हनुमन्मूर्तिं दक्षिणाभिमुखीं स्थापयेत्।',
      },
      duration: '10 min',
    },
    {
      step: 2,
      title: { en: 'Achamana & Sankalpa', hi: 'आचमन एवं संकल्प', sa: 'आचमनसङ्कल्पौ' },
      description: {
        en: 'Sip water three times for purification. Hold water and akshat in the right hand, state the purpose of the puja, and release the water.',
        hi: 'शुद्धि के लिए तीन बार जल का आचमन करें। दाहिने हाथ में जल और अक्षत लेकर पूजा का संकल्प बोलें और जल छोड़ें।',
        sa: 'शुद्ध्यर्थं त्रिवारं जलम् आचामेत्। दक्षिणहस्ते जलाक्षतान् गृहीत्वा पूजासङ्कल्पं वदेत् ततो जलं विसृजेत्।',
      },
      duration: '3 min',
    },
    {
      step: 3,
      title: { en: 'Ganesha Vandana', hi: 'गणेश वन्दना', sa: 'गणेशवन्दना' },
      description: {
        en: 'Begin with a brief prayer to Lord Ganesha for obstacle-free worship. Offer akshat and a flower.',
        hi: 'विघ्नरहित पूजा के लिए गणेश जी की संक्षिप्त वन्दना से शुरू करें। अक्षत और एक फूल अर्पित करें।',
        sa: 'निर्विघ्नपूजनार्थं गणेशस्य सङ्क्षिप्तवन्दनां कुर्यात्। अक्षतान् एकं पुष्पं च समर्पयेत्।',
      },
      duration: '2 min',
    },
    {
      step: 4,
      title: { en: 'Abhishek with Sindoor & Oil', hi: 'सिन्दूर एवं तेल से अभिषेक', sa: 'सिन्दूरतैलाभिषेकः' },
      description: {
        en: 'Apply sindoor (vermilion) generously to the Hanuman idol — this is the most important ritual of Hanuman puja. Then anoint with chameli (jasmine) oil. Sindoor symbolizes Hanuman\'s devotion to Sita.',
        hi: 'हनुमान मूर्ति पर भरपूर सिन्दूर लगाएँ — यह हनुमान पूजा का सबसे महत्वपूर्ण अनुष्ठान है। फिर चमेली के तेल से अभिषेक करें। सिन्दूर सीता माता के प्रति हनुमान जी की भक्ति का प्रतीक है।',
        sa: 'हनुमन्मूर्तौ प्रचुरं सिन्दूरं लेपयेत् — इदम् हनुमत्पूजायाः सर्वप्रधानम् अनुष्ठानम्। ततः चमेलीतैलेन अभिषिञ्चेत्। सिन्दूरं सीतायाः प्रति हनुमतो भक्तेः प्रतीकम्।',
      },
      duration: '5 min',
    },
    {
      step: 5,
      title: { en: 'Yajnopavita & Vastra', hi: 'यज्ञोपवीत एवं वस्त्र', sa: 'यज्ञोपवीतवस्त्रम्' },
      description: {
        en: 'Offer the sacred thread (janeyu) to Hanuman. Drape the idol with a red cloth or offer red flowers.',
        hi: 'हनुमान जी को जनेऊ (यज्ञोपवीत) अर्पित करें। मूर्ति को लाल कपड़े से सजाएँ या लाल फूल अर्पित करें।',
        sa: 'हनुमते यज्ञोपवीतं समर्पयेत्। मूर्तिं रक्तवस्त्रेण शोभयेत् अथवा रक्तपुष्पाणि समर्पयेत्।',
      },
      duration: '2 min',
    },
    {
      step: 6,
      title: { en: 'Pushpa & Archana', hi: 'पुष्प एवं अर्चना', sa: 'पुष्पार्चना' },
      description: {
        en: 'Offer red flowers (hibiscus, red roses) and betel leaves. Perform archana with Hanuman\'s names or the 108 names of Hanuman.',
        hi: 'लाल फूल (गुड़हल, लाल गुलाब) और पान के पत्ते अर्पित करें। हनुमान जी के नामों या 108 नामों से अर्चना करें।',
        sa: 'रक्तपुष्पाणि (जपापुष्पानि, रक्तपाटलानि) ताम्बूलपत्राणि च समर्पयेत्। हनुमन्नामभिः अष्टोत्तरशतनामभिः वा अर्चनां कुर्यात्।',
      },
      duration: '5 min',
    },
    {
      step: 7,
      title: { en: 'Dhupa & Deepa', hi: 'धूप एवं दीप', sa: 'धूपदीपम्' },
      description: {
        en: 'Light incense sticks and wave before the idol. Light the ghee lamp and perform deepa darshana.',
        hi: 'अगरबत्ती जलाकर मूर्ति के सामने घुमाएँ। घी का दीपक जलाएँ और दीप दर्शन करें।',
        sa: 'धूपं प्रज्वाल्य मूर्तेः पुरतः भ्रामयेत्। घृतदीपं प्रज्वाल्य दीपदर्शनं कुर्यात्।',
      },
      duration: '2 min',
    },
    {
      step: 8,
      title: { en: 'Hanuman Beej Mantra Japa', hi: 'हनुमान बीज मन्त्र जप', sa: 'हनुमद्बीजमन्त्रजपः' },
      description: {
        en: 'Chant the Hanuman Beej Mantra 108 times using a mala. Focus on courage and devotion.',
        hi: 'माला से हनुमान बीज मन्त्र 108 बार जपें। साहस और भक्ति पर ध्यान केन्द्रित करें।',
        sa: 'मालया हनुमद्बीजमन्त्रम् अष्टोत्तरशतवारं जपेत्। शौर्यभक्त्योः मनो निवेशयेत्।',
      },
      mantraRef: 'hanuman-beej',
      duration: '10 min',
    },
    {
      step: 9,
      title: { en: 'Hanuman Chalisa Paath', hi: 'हनुमान चालीसा पाठ', sa: 'हनुमच्चालीसापाठः' },
      description: {
        en: 'Recite the complete Hanuman Chalisa (40 chaupais). This is the centrepiece of Hanuman Jayanti worship. Recite with full devotion.',
        hi: 'सम्पूर्ण हनुमान चालीसा (40 चौपाइयाँ) का पाठ करें। यह हनुमान जयन्ती पूजा का केन्द्रबिन्दु है। पूर्ण भक्ति से पाठ करें।',
        sa: 'सम्पूर्णां हनुमच्चालीसां (चत्वारिंशत् चौपाईः) पठेत्। इदम् हनुमज्जयन्तीपूजायाः केन्द्रबिन्दुः। परिपूर्णभक्त्या पठेत्।',
      },
      duration: '15 min',
    },
    {
      step: 10,
      title: { en: 'Naivedya', hi: 'नैवेद्य', sa: 'नैवेद्यम्' },
      description: {
        en: 'Offer boondi laddoo, bananas, and coconut as naivedya. Sprinkle water around the offerings.',
        hi: 'बूँदी के लड्डू, केले और नारियल नैवेद्य के रूप में अर्पित करें। भोग के चारों ओर जल छिड़कें।',
        sa: 'बून्दीमोदकानि कदलीफलानि नारिकेलं च नैवेद्यरूपेण निवेदयेत्। नैवेद्यस्य परितः जलं सिञ्चेत्।',
      },
      duration: '3 min',
    },
    {
      step: 11,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform aarti with camphor and ghee lamp while singing "Aarti Keeje Hanuman Lala Ki". Ring the bell.',
        hi: '"आरती कीजे हनुमान लला की" गाते हुए कपूर और घी के दीपक से आरती करें। घण्टी बजाएँ।',
        sa: '"आरती कीजे हनुमान लला की" इति गायन्ती कर्पूरघृतदीपेन आरात्रिकं कुर्यात्। घण्टां वादयेत्।',
      },
      duration: '5 min',
    },
    {
      step: 12,
      title: { en: 'Pradakshina & Prarthana', hi: 'प्रदक्षिणा एवं प्रार्थना', sa: 'प्रदक्षिणा प्रार्थना च' },
      description: {
        en: 'Circumambulate the puja setup 3 times. Prostrate before the idol and pray for strength, courage, and devotion. Distribute sindoor prasad to devotees.',
        hi: 'पूजा स्थल की 3 बार प्रदक्षिणा करें। मूर्ति के सामने साष्टाङ्ग प्रणाम करें और बल, साहस व भक्ति की प्रार्थना करें। भक्तों को सिन्दूर प्रसाद बाँटें।',
        sa: 'पूजास्थलस्य त्रिवारं प्रदक्षिणां कुर्यात्। मूर्तेः पुरतः साष्टाङ्गप्रणामं कुर्यात् बलशौर्यभक्तिं च प्रार्थयेत्। भक्तेभ्यः सिन्दूरप्रसादं वितरेत्।',
      },
      duration: '3 min',
    },
  ],

  mantras: [
    {
      id: 'hanuman-beej',
      name: { en: 'Hanuman Beej Mantra', hi: 'हनुमान बीज मन्त्र', sa: 'हनुमद्बीजमन्त्रः' },
      devanagari: 'ॐ हं हनुमते नमः',
      iast: 'oṃ haṃ hanumate namaḥ',
      meaning: {
        en: 'Salutations to Lord Hanuman, the embodiment of strength and devotion',
        hi: 'बल और भक्ति के साक्षात् स्वरूप भगवान हनुमान को नमन',
        sa: 'बलभक्तिस्वरूपाय श्रीहनुमते नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Primary beej mantra for Hanuman Jayanti — chant 108 times with a mala',
        hi: 'हनुमान जयन्ती का मुख्य बीज मन्त्र — माला से 108 बार जपें',
        sa: 'हनुमज्जयन्त्याः प्रधानबीजमन्त्रः — मालया अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'hanuman-gayatri',
      name: { en: 'Hanuman Gayatri', hi: 'हनुमान गायत्री', sa: 'हनुमद्गायत्री' },
      devanagari: 'ॐ आञ्जनेयाय विद्महे वायुपुत्राय धीमहि। तन्नो हनुमत् प्रचोदयात्॥',
      iast: 'oṃ āñjaneyāya vidmahe vāyuputrāya dhīmahi | tanno hanumat pracodayāt ||',
      meaning: {
        en: 'We meditate upon the son of Anjana, we contemplate the son of Vayu. May Hanuman inspire and illuminate us.',
        hi: 'हम अंजना के पुत्र का ध्यान करते हैं, वायुपुत्र का चिन्तन करते हैं। हनुमान हमें प्रेरित और प्रकाशित करें।',
        sa: 'आञ्जनेयं विद्मः वायुपुत्रं धीमहि। हनुमान् नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite 3 or 11 times during the puja for invoking Hanuman\'s grace',
        hi: 'हनुमान जी की कृपा के आवाहन के लिए पूजा में 3 या 11 बार पढ़ें',
        sa: 'हनुमदनुग्रहावाहनार्थं पूजायां त्रिवारम् एकादशवारं वा पठेत्',
      },
    },
    {
      id: 'hanuman-dhyana',
      name: { en: 'Hanuman Dhyana Shloka', hi: 'हनुमान ध्यान श्लोक', sa: 'हनुमद्ध्यानश्लोकः' },
      devanagari: 'मनोजवं मारुततुल्यवेगम् जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
      iast: 'manojavaṃ mārutatulyavegam jitendriyaṃ buddhimatāṃ variṣṭham | vātātmajaṃ vānarayūthamukhyaṃ śrīrāmadūtaṃ śaraṇaṃ prapadye ||',
      meaning: {
        en: 'I take refuge in the messenger of Shri Rama — who is swift as the mind, fast as the wind, master of his senses, foremost among the wise, son of the Wind God, and chief of the monkey army.',
        hi: 'मैं श्रीराम के दूत की शरण लेता हूँ — जो मन की तरह तेज, पवन के समान वेगवान, जितेन्द्रिय, बुद्धिमानों में श्रेष्ठ, वायुपुत्र और वानरों के मुखिया हैं।',
        sa: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठं वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये।',
      },
      usage: {
        en: 'Opening dhyana shloka — recite at the beginning of Hanuman puja for meditation',
        hi: 'ध्यान श्लोक — हनुमान पूजा के आरम्भ में ध्यान हेतु पढ़ें',
        sa: 'ध्यानश्लोकः — हनुमत्पूजारम्भे ध्यानार्थं पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Hanuman Chalisa', hi: 'हनुमान चालीसा', sa: 'हनुमच्चालीसा' },
      verseCount: 40,
      duration: '15 min',
      note: {
        en: 'The most widely recited Hanuman stotra by Tulsidas. 40 chaupais praising Hanuman\'s glory and seeking his protection.',
        hi: 'तुलसीदास रचित हनुमान जी का सबसे लोकप्रिय स्तोत्र। 40 चौपाइयों में हनुमान जी की महिमा और उनकी रक्षा की प्रार्थना।',
        sa: 'तुलसीदासरचितं हनुमतः सर्वप्रसिद्धं स्तोत्रम्। चत्वारिंशत् चौपाईषु हनुमन्महिमा तद्रक्षाप्रार्थना च।',
      },
    },
    {
      name: { en: 'Bajrang Baan', hi: 'बजरंग बाण', sa: 'वज्राङ्गबाणम्' },
      verseCount: 37,
      duration: '10 min',
      note: {
        en: 'A powerful protective hymn to Hanuman. Recite for protection from evil forces and black magic.',
        hi: 'हनुमान जी का शक्तिशाली रक्षात्मक स्तोत्र। बुरी शक्तियों और काले जादू से रक्षा के लिए पढ़ें।',
        sa: 'हनुमतः शक्तिशालं रक्षास्तोत्रम्। दुष्टशक्तिकृत्याभिचारेभ्यो रक्षार्थं पठेत्।',
      },
    },
  ],

  aarti: {
    name: { en: 'Aarti Keeje Hanuman Lala Ki', hi: 'आरती कीजे हनुमान लला की', sa: 'हनुमल्ललस्यारात्रिकम्' },
    devanagari:
      'आरती कीजे हनुमान लला की।\nदुष्ट दलन रघुनाथ कला की॥\nजाके बल से गिरिवर काँपे।\nरोग दोष जाके निकट न झाँके॥\nआरती कीजे हनुमान लला की॥\n\nअंजनि पुत्र महा बलदाई।\nसन्तन के प्रभु सदा सहाई॥\nदे बीरा रघुनाथ पठाये।\nलंका जारि सिया सुधि लाये॥\nआरती कीजे हनुमान लला की॥\n\nलंका सो कोट समुद्र सी खाई।\nजात पवनसुत बार न लाई॥\nलंका जारि असुर सब मारे।\nसियारामजी के काज सँवारे॥\nआरती कीजे हनुमान लला की॥\n\nलक्ष्मण मूर्छित पड़े सकारे।\nआणि सजीवन प्राण उबारे॥\nपैठि पताल तोरि जम कारे।\nअहिरावण की भुजा उखारे॥\nआरती कीजे हनुमान लला की॥\n\nबाएँ भुजा असुर दल मारे।\nदाहिने भुजा सन्तजन तारे॥\nसूर समर करनी सुनि रारे।\nजग में यश तेरा तुम्हारे॥\nआरती कीजे हनुमान लला की॥\n\nकंचन थार कपूर लौ छाई।\nआरती करत अंजना माई॥\nजो हनुमानजी की आरती गावे।\nबसि बैकुण्ठ परम पद पावे॥\nआरती कीजे हनुमान लला की॥',
    iast:
      'āratī kīje hanumāna lalā kī |\nduṣṭa dalana raghunātha kalā kī ||\njāke bala se girivara kām̐pe |\nroga doṣa jāke nikaṭa na jhām̐ke ||\nāratī kīje hanumāna lalā kī ||\n\nañjani putra mahā baladāī |\nsantana ke prabhu sadā sahāī ||\nde bīrā raghunātha paṭhāye |\nlaṅkā jāri siyā sudhi lāye ||\nāratī kīje hanumāna lalā kī ||\n\nlaṅkā so koṭa samudra sī khāī |\njāta pavanasuta bāra na lāī ||\nlaṅkā jāri asura saba māre |\nsiyārāmajī ke kāja sam̐vāre ||\nāratī kīje hanumāna lalā kī ||\n\nlakṣmaṇa mūrchita paḍe sakāre |\nāṇi sajīvana prāṇa ubāre ||\npaiṭhi pātāla tori jama kāre |\nahirāvaṇa kī bhujā ukhāre ||\nāratī kīje hanumāna lalā kī ||\n\nbāem̐ bhujā asura dala māre |\ndāhine bhujā santajana tāre ||\nsūra samara karanī suni rāre |\njaga meṃ yaśa terā tumhāre ||\nāratī kīje hanumāna lalā kī ||\n\nkañcana thāra kapūra lau chāī |\nāratī karata añjanā māī ||\njo hanumānajī kī āratī gāve |\nbasi baikuṇṭha parama pada pāve ||\nāratī kīje hanumāna lalā kī ||',
  },

  naivedya: {
    en: 'Boondi laddoo, bananas, gur (jaggery), sesame sweets, and coconut',
    hi: 'बूँदी के लड्डू, केले, गुड़, तिल की मिठाई और नारियल',
    sa: 'बून्दीमोदकानि, कदलीफलानि, गुडम्, तिलमिष्टान्नानि, नारिकेलं च',
  },

  precautions: [
    {
      en: 'Maintain brahmacharya (celibacy) on Hanuman Jayanti — Hanuman is a Brahmachari deity',
      hi: 'हनुमान जयन्ती पर ब्रह्मचर्य का पालन करें — हनुमान ब्रह्मचारी देवता हैं',
      sa: 'हनुमज्जयन्त्यां ब्रह्मचर्यं पालयेत् — हनुमान् ब्रह्मचारी देवता',
    },
    {
      en: 'Apply sindoor only with the ring finger — do not use other fingers',
      hi: 'सिन्दूर केवल अनामिका (रिंग फिंगर) से लगाएँ — अन्य अंगुलियों का प्रयोग न करें',
      sa: 'अनामिकया एव सिन्दूरं लेपयेत् — अन्याभिः अङ्गुलीभिः न लेपयेत्',
    },
    {
      en: 'Do not offer tulsi (basil) to Hanuman — it is considered inauspicious',
      hi: 'हनुमान जी को तुलसी अर्पित न करें — इसे अशुभ माना जाता है',
      sa: 'हनुमते तुलसीं न समर्पयेत् — अशुभम् इति मन्यते',
    },
    {
      en: 'Face South while worshipping Hanuman (Dakshinamukhi Hanuman)',
      hi: 'हनुमान जी की पूजा करते समय दक्षिण दिशा की ओर मुख करें (दक्षिणमुखी हनुमान)',
      sa: 'हनुमत्पूजने दक्षिणाभिमुखं तिष्ठेत् (दक्षिणमुखी हनुमान्)',
    },
  ],

  phala: {
    en: 'Bestows immense physical and mental strength, courage to overcome obstacles, protection from evil forces, success in all endeavours, and deepening of devotion to Lord Rama',
    hi: 'अपार शारीरिक और मानसिक बल, बाधाओं पर विजय पाने का साहस, बुरी शक्तियों से रक्षा, सभी कार्यों में सफलता, और श्रीराम के प्रति भक्ति का गहन होना',
    sa: 'अपारशारीरिकमानसिकबलप्रदानम्, विघ्नजयशौर्यम्, दुष्टशक्तिरक्षणम्, सर्वकार्यसिद्धिः, श्रीरामभक्तेः गहनता च',
  },
};

import type { PujaVidhi } from './types';

export const DUSSEHRA_PUJA: PujaVidhi = {
  festivalSlug: 'dussehra',
  category: 'festival',
  deity: { en: 'Rama / Durga (Vijaya Dashami)', hi: 'राम / दुर्गा (विजयादशमी)', sa: 'रामः / दुर्गा (विजयादशमी)' },

  samagri: [
    { name: { en: 'Shami tree leaves', hi: 'शमी के पत्ते', sa: 'शमीपत्राणि' }, note: { en: 'The most important item — exchange with neighbours for prosperity', hi: 'सबसे महत्वपूर्ण सामग्री — समृद्धि के लिए पड़ोसियों से आदान-प्रदान करें', sa: 'सर्वप्रधानं द्रव्यम् — समृद्ध्यर्थं प्रतिवासिभिः सह आदानप्रदानं कुर्यात्' }, category: 'flowers', essential: true },
    { name: { en: 'Aparajita flowers (blue butterfly pea)', hi: 'अपराजिता के फूल', sa: 'अपराजितापुष्पाणि' }, category: 'flowers', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Weapons/tools for Shastra Puja', hi: 'शस्त्र/उपकरण शस्त्र पूजा के लिए', sa: 'शस्त्राणि/उपकरणानि शस्त्रपूजार्थम्' }, note: { en: 'Vehicles, instruments of livelihood, books, computers — anything that represents your work', hi: 'वाहन, जीविका के साधन, पुस्तकें, कम्प्यूटर — कुछ भी जो आपके कार्य का प्रतिनिधित्व करे', sa: 'वाहनानि, जीवनोपायसाधनानि, पुस्तकानि, सङ्गणकानि — किमपि यत् कार्यस्य प्रतिनिधित्वं करोति' }, category: 'other', essential: true },
    { name: { en: 'Ramayana (book)', hi: 'रामायण (पुस्तक)', sa: 'रामायणम् (ग्रन्थः)' }, category: 'other', essential: false },
    { name: { en: 'Blue flowers', hi: 'नीले फूल', sa: 'नीलपुष्पाणि' }, category: 'flowers', essential: false },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'Flowers (marigold, red)', hi: 'फूल (गेंदा, लाल)', sa: 'पुष्पाणि (स्थलपद्मम्, रक्तम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Sweets (jalebi, pedha)', hi: 'मिठाई (जलेबी, पेड़ा)', sa: 'मिष्टान्नानि (जलेबी, पेदकम्)' }, category: 'food', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Dussehra puja is performed during Vijaya Muhurta, which falls in the Aparahna (afternoon) period on Ashwin Shukla Dashami. The most auspicious window is typically between 1:30 PM and 3:30 PM.',
    hi: 'दशहरा पूजा विजय मुहूर्त में की जाती है, जो आश्विन शुक्ल दशमी के अपराह्न काल में आता है। सबसे शुभ समय सामान्यतः दोपहर 1:30 से 3:30 बजे के बीच होता है।',
    sa: 'दशहरापूजा विजयमुहूर्ते क्रियते, यः आश्विनशुक्लदशम्यां अपराह्णकाले भवति। सामान्यतः मध्याह्नात् परं सार्धैकवादनतः सार्धत्रिवादनपर्यन्तं सर्वोत्तमः शुभकालः।',
  },
  muhurtaWindow: { type: 'aparahna' },

  sankalpa: {
    en: 'On this auspicious Vijaya Dashami (Dussehra), I worship Lord Rama and Goddess Aparajita for victory over evil, success in all endeavours, and the triumph of dharma.',
    hi: 'इस शुभ विजयादशमी (दशहरा) पर, बुराई पर विजय, सभी कार्यों में सफलता और धर्म की जीत के लिए, मैं भगवान राम और देवी अपराजिता की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे विजयादशम्यां (दशहरायाम्) अधर्मोपरि विजयार्थं सर्वकार्यसिद्ध्यर्थं धर्मविजयार्थं च श्रीरामदेव्यपराजितापूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation', hi: 'तैयारी', sa: 'सज्जता' },
      description: {
        en: 'Clean the puja area. Set up images of Lord Rama and/or Goddess Durga. Collect shami leaves, aparajita flowers, and arrange the tools/instruments of your livelihood for Shastra Puja.',
        hi: 'पूजा स्थल साफ करें। भगवान राम और/या देवी दुर्गा के चित्र स्थापित करें। शमी के पत्ते, अपराजिता के फूल इकट्ठा करें और शस्त्र पूजा के लिए अपनी जीविका के उपकरण/साधन सजाएँ।',
        sa: 'पूजास्थलं शोधयेत्। श्रीरामस्य देव्याः दुर्गायाः वा चित्राणि स्थापयेत्। शमीपत्राणि अपराजितापुष्पाणि च सङ्गृह्णीयात्, शस्त्रपूजार्थं स्वजीवनोपायसाधनानि सज्जयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Shami Puja', hi: 'शमी पूजा', sa: 'शमीपूजनम्' },
      description: {
        en: 'Worship the Shami tree (or its leaves placed on the altar). Offer kumkum, akshat, and flowers to the shami leaves. The Shami tree is revered because Arjuna hid his weapons in a shami tree during the Pandavas\' exile.',
        hi: 'शमी वृक्ष (या वेदी पर रखे शमी पत्तों) की पूजा करें। शमी पत्तों पर कुमकुम, अक्षत और फूल अर्पित करें। शमी वृक्ष इसलिए पूजनीय है क्योंकि अर्जुन ने पाण्डवों के वनवास में अपने शस्त्र शमी वृक्ष में छिपाए थे।',
        sa: 'शमीवृक्षं (अथवा वेद्यां स्थापितानि शमीपत्राणि) पूजयेत्। शमीपत्रेषु कुङ्कुमम् अक्षतान् पुष्पाणि च समर्पयेत्। शमीवृक्षः पूज्यः यतोऽर्जुनः पाण्डवानां वनवासकाले स्वशस्त्राणि शमीवृक्षे न्यगूहत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Aparajita Puja', hi: 'अपराजिता पूजा', sa: 'अपराजितापूजनम्' },
      description: {
        en: 'Worship Goddess Aparajita (the Unconquered) with blue aparajita flowers, sandalwood paste, and kumkum. Chant the Aparajita Mantra. She grants invincibility and success.',
        hi: 'देवी अपराजिता (अजेय) की नीले अपराजिता फूलों, चन्दन लेप और कुमकुम से पूजा करें। अपराजिता मन्त्र का जाप करें। वे अजेयता और सफलता प्रदान करती हैं।',
        sa: 'देवीम् अपराजिताम् (अजेयाम्) नीलापराजितापुष्पैः चन्दनलेपेन कुङ्कुमेन च पूजयेत्। अपराजितामन्त्रं जपेत्। सा अजेयतां सिद्धिं च ददाति।',
      },
      mantraRef: 'aparajita-mantra',
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Rama Puja', hi: 'राम पूजा', sa: 'रामपूजनम्' },
      description: {
        en: 'Worship Lord Rama with flowers, sandalwood, kumkum, and akshat. Offer blue flowers (Rama\'s favourite colour is blue/dark). Chant the Rama Mantra and read a passage from the Ramayana (Lanka Kanda — Rama\'s victory over Ravana).',
        hi: 'भगवान राम की फूलों, चन्दन, कुमकुम और अक्षत से पूजा करें। नीले फूल अर्पित करें (राम का प्रिय रंग नीला/श्याम है)। राम मन्त्र का जाप करें और रामायण (लंकाकाण्ड — राम की रावण पर विजय) का एक अंश पढ़ें।',
        sa: 'श्रीरामं पुष्पैः चन्दनेन कुङ्कुमेन अक्षतैश्च पूजयेत्। नीलपुष्पाणि समर्पयेत् (रामस्य प्रियवर्णः नीलः/श्यामः)। राममन्त्रं जपेत् रामायणस्य (लङ्काकाण्डस्य — रामस्य रावणोपरि विजयस्य) अंशं पठेत्।',
      },
      mantraRef: 'rama-mantra',
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Shastra Puja (Worship of Tools)', hi: 'शस्त्र पूजा (उपकरणों की पूजा)', sa: 'शस्त्रपूजनम् (उपकरणपूजनम्)' },
      description: {
        en: 'Arrange your instruments of livelihood — vehicles, tools, books, computers, musical instruments, kitchen utensils — near the puja altar. Apply kumkum and akshat on each item. Offer flowers and sandalwood paste. This consecrates your means of earning and creation.',
        hi: 'अपनी जीविका के साधन — वाहन, औजार, पुस्तकें, कम्प्यूटर, वाद्य यन्त्र, रसोई के बर्तन — पूजा वेदी के पास सजाएँ। प्रत्येक वस्तु पर कुमकुम और अक्षत लगाएँ। फूल और चन्दन लेप अर्पित करें। यह आपके कमाने और सृजन के साधनों को पवित्र करता है।',
        sa: 'स्वजीवनोपायसाधनानि — वाहनानि, उपकरणानि, पुस्तकानि, सङ्गणकानि, वाद्ययन्त्राणि, पाकपात्राणि — पूजावेद्याः समीपे सज्जयेत्। प्रतिवस्तुनि कुङ्कुमम् अक्षतान् च न्यस्येत्। पुष्पाणि चन्दनलेपं च समर्पयेत्। अनेन स्वार्जनसृजनसाधनानां पवित्रीकरणं भवति।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Seemollanghana (Crossing the Boundary)', hi: 'सीमोल्लंघन', sa: 'सीमोल्लङ्घनम्' },
      description: {
        en: 'After the puja, cross the boundary of your village or locality in the North-East direction. This is called Seemollanghana — a ritual crossing symbolizing victory and expansion. Carry shami leaves with you.',
        hi: 'पूजा के बाद, अपने गाँव या मोहल्ले की सीमा ईशान (उत्तर-पूर्व) दिशा में पार करें। इसे सीमोल्लंघन कहते हैं — विजय और विस्तार का प्रतीकात्मक अनुष्ठान। अपने साथ शमी के पत्ते ले जाएँ।',
        sa: 'पूजानन्तरं स्वग्रामस्य स्थानस्य वा सीमाम् ईशानदिशि (उत्तरपूर्वदिशि) उल्लङ्घयेत्। इदं सीमोल्लङ्घनम् इति उच्यते — विजयविस्तारस्य प्रतीकात्मकम् अनुष्ठानम्। शमीपत्राणि स्वसमीपे गृहीत्वा गच्छेत्।',
      },
      duration: '15 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 7,
      title: { en: 'Exchange Shami Leaves', hi: 'शमी पत्रों का आदान-प्रदान', sa: 'शमीपत्रादानप्रदानम्' },
      description: {
        en: 'Exchange shami leaves with neighbours and friends, saying "शमी शमयते पापं शमी शत्रुविनाशिनी। अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी॥" — The shami leaves symbolize gold and prosperity being exchanged.',
        hi: 'पड़ोसियों और मित्रों के साथ शमी पत्रों का आदान-प्रदान करें, यह कहते हुए: "शमी शमयते पापं शमी शत्रुविनाशिनी। अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी॥" — शमी पत्ते सोने और समृद्धि के आदान-प्रदान का प्रतीक हैं।',
        sa: 'प्रतिवासिभिः मित्रैश्च शमीपत्राणाम् आदानप्रदानं कुर्यात्, "शमी शमयते पापं शमी शत्रुविनाशिनी। अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी॥" इति वदन् — शमीपत्राणि सुवर्णसमृद्ध्योः आदानप्रदानस्य प्रतीकानि।',
      },
      duration: '10 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Naivedya & Aarti', hi: 'नैवेद्य एवं आरती', sa: 'नैवेद्यम् आरात्रिकं च' },
      description: {
        en: 'Offer sweets (jalebi, shrikhand), fruits, and coconut as naivedya. Perform aarti with camphor and ghee lamp.',
        hi: 'मिठाई (जलेबी, श्रीखण्ड), फल और नारियल नैवेद्य के रूप में अर्पित करें। कपूर और घी के दीपक से आरती करें।',
        sa: 'मिष्टान्नानि (जलेबी, श्रीखण्डम्), फलानि, नारिकेलं च नैवेद्यरूपेण निवेदयेत्। कर्पूरघृतदीपेन आरात्रिकं कुर्यात्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 9,
      title: { en: 'Ravana Dahan (Effigies)', hi: 'रावण दहन', sa: 'रावणदहनम्' },
      description: {
        en: 'In the evening, attend or organize the Ravana Dahan — burning of effigies of Ravana, Kumbhakarna, and Meghanada. This symbolizes the victory of good over evil, Rama\'s triumph over Ravana.',
        hi: 'शाम को रावण दहन में भाग लें या आयोजित करें — रावण, कुम्भकर्ण और मेघनाद के पुतले जलाना। यह बुराई पर अच्छाई की जीत, राम की रावण पर विजय का प्रतीक है।',
        sa: 'सायं रावणदहने भागं गृह्णीयात् आयोजयेत् वा — रावणकुम्भकर्णमेघनादपुत्तलिकानां दहनम्। इदम् अधर्मोपरि धर्मस्य विजयस्य, रामस्य रावणोपरि विजयस्य च प्रतीकम्।',
      },
      duration: '1 hour',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'aparajita-mantra',
      name: { en: 'Aparajita Mantra', hi: 'अपराजिता मन्त्र', sa: 'अपराजितामन्त्रः' },
      devanagari: 'ॐ अपराजितायै नमः।\nहरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।\nहरे राम हरे राम राम राम हरे हरे॥',
      iast: 'oṃ aparājitāyai namaḥ |\nhare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare |\nhare rāma hare rāma rāma rāma hare hare ||',
      meaning: {
        en: 'Salutations to the Unconquered Goddess Aparajita. Hare Krishna, Hare Rama — the maha mantra invoking divine victory.',
        hi: 'अजेय देवी अपराजिता को नमन। हरे कृष्ण, हरे राम — दिव्य विजय का आवाहन करने वाला महामन्त्र।',
        sa: 'अजेयायै देव्यै अपराजितायै नमः। हरे कृष्ण हरे राम — दिव्यविजयावाहनस्य महामन्त्रः।',
      },
      usage: {
        en: 'Chant during Aparajita puja for invincibility and success in all endeavours',
        hi: 'सभी कार्यों में अजेयता और सफलता के लिए अपराजिता पूजा में जपें',
        sa: 'सर्वकार्येषु अजेयतासिद्ध्यर्थम् अपराजितापूजने जपेत्',
      },
    },
    {
      id: 'rama-mantra',
      name: { en: 'Rama Mantra', hi: 'राम मन्त्र', sa: 'राममन्त्रः' },
      devanagari: 'ॐ श्री रामाय नमः',
      iast: 'oṃ śrī rāmāya namaḥ',
      meaning: {
        en: 'Salutations to the auspicious Lord Rama, the embodiment of dharma',
        hi: 'धर्म के साक्षात् स्वरूप भगवान श्रीराम को नमन',
        sa: 'धर्मस्वरूपाय श्रीरामाय नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during Rama puja on Dussehra',
        hi: 'दशहरे पर राम पूजा में 108 बार जपें',
        sa: 'दशहरायां रामपूजने अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'vijaya-dashami-prayer',
      name: { en: 'Vijaya Dashami Prayer (Shami Shloka)', hi: 'विजयादशमी प्रार्थना (शमी श्लोक)', sa: 'विजयादशमीप्रार्थना (शमीश्लोकः)' },
      devanagari: 'शमी शमयते पापं शमी शत्रुविनाशिनी।\nअर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी॥',
      iast: 'śamī śamayate pāpaṃ śamī śatruvināśinī |\narjunasya dhanurdhārī rāmasya priyadarśinī ||',
      meaning: {
        en: 'The Shami tree destroys sins, the Shami annihilates enemies. She bore Arjuna\'s bow and is beloved of Rama.',
        hi: 'शमी पापों का शमन करती है, शमी शत्रुओं का नाश करती है। अर्जुन का धनुष धारण करने वाली और राम की प्रियदर्शिनी।',
        sa: 'शमी पापं शमयते, शमी शत्रून् विनाशयति। अर्जुनस्य धनुर्धारिणी रामस्य प्रियदर्शिनी च।',
      },
      usage: {
        en: 'Recite while exchanging shami leaves with neighbours and friends on Dussehra',
        hi: 'दशहरे पर पड़ोसियों और मित्रों के साथ शमी पत्ते आदान-प्रदान करते समय पढ़ें',
        sa: 'दशहरायां प्रतिवासिभिः मित्रैश्च शमीपत्रादानप्रदाने पठेत्',
      },
    },
  ],

  aarti: {
    name: { en: 'Shri Rama Aarti', hi: 'श्री राम आरती', sa: 'श्रीरामारात्रिकम्' },
    devanagari:
      'आरती कीजे श्री रामचन्द्र जी की।\nदुष्ट दलन सीतापति जी की॥\n\nगल में सुशोभित कौस्तुभ माला।\nबाजूबन्द नवरत्न उजाला॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nशिर पर मुकुट बनत है साजे।\nदेखत मुख जन सकल रीझाजे॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nसियाजी साथ विराजत सुन्दर।\nछवि बनी रही नयन अभिरामा अन्तर॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nभक्त हनुमत चँवर डुलावें।\nश्री लक्ष्मण शत्रुघ्न भरत सुख गावें॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nकनक थार में बहुविधि भोगा।\nअरती करत शोभासिन्धु योगा॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nआरती कीजे श्री रामचन्द्र जी की।\nदुष्ट दलन सीतापति जी की॥\n\n॥ इति श्री रामचन्द्र आरती सम्पूर्णम् ॥',
    iast:
      'āratī kīje śrī rāmacandra jī kī |\nduṣṭa dalana sītāpati jī kī ||\n\ngala meṃ suśobhita kaustubha mālā |\nbājūbanda navaratna ujālā ||\nāratī kīje śrī rāmacandra jī kī ||\n\nśira para mukuṭa banata hai sāje |\ndekhata mukha jana sakala rījhāje ||\nāratī kīje śrī rāmacandra jī kī ||\n\nsiyājī sātha virājata sundara |\nchavi banī rahī nayana abhirāmā antara ||\nāratī kīje śrī rāmacandra jī kī ||\n\nbhakta hanumata caṃvara ḍulāveṃ |\nśrī lakṣmaṇa śatrughna bharata sukha gāveṃ ||\nāratī kīje śrī rāmacandra jī kī ||\n\nkanaka thāra meṃ bahuvidhi bhogā |\naratī karata śobhāsindhu yogā ||\nāratī kīje śrī rāmacandra jī kī ||\n\nāratī kīje śrī rāmacandra jī kī |\nduṣṭa dalana sītāpati jī kī ||\n\n|| iti śrī rāmacandra āratī sampūrṇam ||',
  },

  naivedya: {
    en: 'Jalebi, shrikhand, pedha, seasonal fruits, coconut, and farsaan (savoury snacks)',
    hi: 'जलेबी, श्रीखण्ड, पेड़ा, मौसमी फल, नारियल और फरसाण (नमकीन)',
    sa: 'जलेबी, श्रीखण्डम्, पेदकम्, ऋतुफलानि, नारिकेलम्, लवणमिष्टान्नानि च',
  },

  precautions: [
    {
      en: 'Seemollanghana (crossing the boundary) must be done in the North-East direction — do not go South',
      hi: 'सीमोल्लंघन ईशान (उत्तर-पूर्व) दिशा में करना चाहिए — दक्षिण में न जाएँ',
      sa: 'सीमोल्लङ्घनम् ईशानदिशि (उत्तरपूर्वदिशि) कर्तव्यम् — दक्षिणदिशि न गच्छेत्',
    },
    {
      en: 'Exchange shami leaves with all neighbours — this is considered as exchanging gold and prosperity',
      hi: 'सभी पड़ोसियों के साथ शमी पत्तों का आदान-प्रदान करें — इसे सोने और समृद्धि का आदान-प्रदान माना जाता है',
      sa: 'सर्वैः प्रतिवासिभिः सह शमीपत्राणाम् आदानप्रदानं कुर्यात् — इदं सुवर्णसमृद्ध्योः आदानप्रदानमिति मन्यते',
    },
    {
      en: 'Shastra Puja applies to ALL instruments of livelihood — not just weapons. Modern items like laptops, books, and vehicles should also be worshipped.',
      hi: 'शस्त्र पूजा सभी जीविका के साधनों पर लागू होती है — केवल हथियारों पर नहीं। आधुनिक वस्तुएँ जैसे लैपटॉप, पुस्तकें और वाहन भी पूजने चाहिए।',
      sa: 'शस्त्रपूजा सर्वेषु जीवनोपायसाधनेषु प्रवर्तते — न केवलं शस्त्रेषु। आधुनिकवस्तूनि यथा सङ्गणकानि पुस्तकानि वाहनानि च पूजनीयानि।',
    },
    {
      en: 'Do not begin any new negative activity on this day — Vijaya Dashami is only for auspicious beginnings',
      hi: 'इस दिन कोई नया अशुभ कार्य शुरू न करें — विजयादशमी केवल शुभ आरम्भ के लिए है',
      sa: 'अस्मिन् दिने कमपि नवम् अशुभकार्यं न आरभेत् — विजयादशमी केवलं शुभारम्भार्थम्',
    },
  ],

  phala: {
    en: 'Victory over enemies and obstacles, triumph of dharma over adharma, success in all new ventures begun on this day, purification and empowerment of all tools and instruments, and the blessings of Rama and Aparajita for invincibility',
    hi: 'शत्रुओं और बाधाओं पर विजय, अधर्म पर धर्म की जीत, इस दिन शुरू किए गए सभी नए कार्यों में सफलता, सभी उपकरणों और साधनों का शुद्धिकरण और सशक्तीकरण, और अजेयता के लिए राम और अपराजिता का आशीर्वाद',
    sa: 'शत्रुविघ्नोपरि विजयः, अधर्मोपरि धर्मस्य जयः, अस्मिन् दिने आरब्धानां सर्वनवकार्याणां सिद्धिः, सर्वोपकरणसाधनानां शुद्धिसशक्तीकरणम्, अजेयतार्थं रामापराजितयोः आशीर्वादश्च',
  },
};

import type { PujaVidhi } from './types';

export const HARIYALI_TEEJ_PUJA: PujaVidhi = {
  festivalSlug: 'hariyali-teej',
  category: 'festival',
  deity: { en: 'Goddess Parvati (and Lord Shiva)', hi: 'देवी पार्वती (एवं भगवान शिव)', sa: 'देवी पार्वती (शिवश्च)' },

  samagri: [
    { name: { en: 'Parvati-Shiva idol or image', hi: 'पार्वती-शिव मूर्ति या चित्र', sa: 'पार्वतीशिवमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Solah Shringar items (16 adornments)', hi: 'सोलह श्रृंगार सामग्री', sa: 'षोडशशृङ्गारसामग्री' }, category: 'other', essential: true },
    { name: { en: 'Mehndi (henna)', hi: 'मेहँदी', sa: 'मेन्धिका' }, category: 'other', essential: true },
    { name: { en: 'Green bangles', hi: 'हरी चूड़ियाँ', sa: 'हरितकङ्कणानि' }, category: 'clothing', essential: true },
    { name: { en: 'Green saree or dress', hi: 'हरी साड़ी या वस्त्र', sa: 'हरितवस्त्रम्' }, category: 'clothing', essential: true },
    { name: { en: 'Flowers and garlands', hi: 'फूल और मालाएँ', sa: 'पुष्पाणि मालाश्च' }, category: 'flowers', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghewar (traditional sweet)', hi: 'घेवर', sa: 'घेवरमिष्टान्नम्' }, category: 'food', essential: true },
    { name: { en: 'Fruits (seasonal)', hi: 'फल (मौसमी)', sa: 'ऋतुफलानि' }, category: 'food', essential: false },
    { name: { en: 'Kumkum and sindoor', hi: 'कुमकुम और सिन्दूर', sa: 'कुङ्कुमं सिन्दूरं च' }, category: 'puja_items', essential: true },
    { name: { en: 'Swing (jhula) with decorations', hi: 'सजा हुआ झूला', sa: 'सुसज्जितं दोलनम्' }, category: 'other', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Hariyali Teej is observed on Shravan Shukla Tritiya. Married women begin the vrat at sunrise and perform puja during the Madhyahna (midday) muhurta. The festival is marked by swing celebrations throughout the day.',
    hi: 'हरियाली तीज श्रावण शुक्ल तृतीया को मनाई जाती है। सुहागिन स्त्रियाँ सूर्योदय पर व्रत आरम्भ करती हैं और मध्याह्न मुहूर्त में पूजा करती हैं। पूरे दिन झूले के उत्सव का आनन्द लिया जाता है।',
    sa: 'हरियालीतीजः श्रावणशुक्लतृतीयायाम् आचर्यते। सौभाग्यवत्यः स्त्रियः सूर्योदये व्रतम् आरभन्ते मध्याह्नमुहूर्ते पूजां कुर्वन्ति। सर्वं दिनं दोलनोत्सवः आनन्द्यते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this auspicious Shravan Shukla Tritiya, I worship Goddess Parvati, who performed severe penance to obtain Lord Shiva as her husband. May she bless my marriage with eternal love, prosperity, and the long life of my husband.',
    hi: 'इस शुभ श्रावण शुक्ल तृतीया पर, मैं देवी पार्वती की पूजा करती हूँ, जिन्होंने भगवान शिव को पति रूप में पाने के लिए कठोर तपस्या की। वे मेरे वैवाहिक जीवन को शाश्वत प्रेम, समृद्धि और पति की दीर्घायु से आशीर्वादित करें।',
    sa: 'अस्मिन् शुभे श्रावणशुक्लतृतीयायां देवीं पार्वतीं पूजयामि, या शिवं पतित्वेन प्राप्तुं कठोरां तपश्चर्यां कृतवती। सा मम वैवाहिकजीवनं शाश्वतप्रेम्णा समृद्ध्या पतिदीर्घायुषा च अनुगृह्णातु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Shringar (Adornment)', hi: 'श्रृंगार', sa: 'शृङ्गारः' },
      description: {
        en: 'Wear green clothes (saree or lehenga) and complete the Solah Shringar  –  the 16 traditional adornments including bindi, sindoor, kajal, bangles, anklets, mehndi, nose ring, earrings, necklace, etc. Green represents the monsoon season and fertility.',
        hi: 'हरे वस्त्र (साड़ी या लहँगा) पहनें और सोलह श्रृंगार पूरा करें  –  बिन्दी, सिन्दूर, काजल, चूड़ियाँ, पायल, मेहँदी, नथ, बालियाँ, हार आदि 16 पारम्परिक श्रृंगार। हरा रंग वर्षा ऋतु और उर्वरता का प्रतीक है।',
        sa: 'हरितवस्त्राणि (शाटिकां लहङ्गां वा) धारयेत् षोडशशृङ्गारं च पूरयेत्  –  बिन्दुः सिन्दूरं कज्जलं कङ्कणानि नूपुराणि मेन्धिका नासिकाभूषणं कर्णाभूषणानि हारः इत्यादीनि। हरितवर्णो वर्षाऋतोः उर्वरतायाश्च प्रतीकः।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Parvati-Shiva Puja', hi: 'पार्वती-शिव पूजा', sa: 'पार्वतीशिवपूजनम्' },
      description: {
        en: 'Place Parvati and Shiva idols together. Offer flowers, kumkum, sindoor, and green bangles to Goddess Parvati. Apply sindoor to the parting line of the Parvati idol. Offer bael leaves to Lord Shiva.',
        hi: 'पार्वती और शिव की मूर्तियाँ साथ रखें। देवी पार्वती को फूल, कुमकुम, सिन्दूर और हरी चूड़ियाँ अर्पित करें। पार्वती मूर्ति की माँग में सिन्दूर भरें। भगवान शिव को बेलपत्र अर्पित करें।',
        sa: 'पार्वतीशिवमूर्ती एकत्र स्थापयेत्। देव्यै पार्वत्यै पुष्पाणि कुङ्कुमं सिन्दूरं हरितकङ्कणानि च समर्पयेत्। पार्वतीप्रतिमायाः सीमन्ते सिन्दूरं पूरयेत्। शिवाय बिल्वपत्राणि समर्पयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Teej Vrat Katha', hi: 'तीज व्रत कथा', sa: 'तीजव्रतकथा' },
      description: {
        en: 'Listen to or read the Teej Vrat Katha, which narrates how Parvati performed 108 births of penance to unite with Lord Shiva. The story emphasises the power of devotion and marital love.',
        hi: 'तीज व्रत कथा सुनें या पढ़ें, जो बताती है कि पार्वती ने 108 जन्मों की तपस्या कर भगवान शिव से मिलन प्राप्त किया। यह कथा भक्ति और दाम्पत्य प्रेम की शक्ति पर बल देती है।',
        sa: 'तीजव्रतकथां शृणुयात् पठेत् वा, या वर्णयति यथा पार्वती अष्टोत्तरशतजन्मतपसा शिवेन सह मिलनं प्राप्तवती। इयं कथा भक्तेः दाम्पत्यप्रेम्णश्च शक्तिं प्रतिपादयति।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 4,
      title: { en: 'Swing Ritual (Jhula)', hi: 'झूला उत्सव', sa: 'दोलनोत्सवः' },
      description: {
        en: 'Decorate a swing with flowers and greenery. Place Parvati-Shiva idols on the swing and gently sway them. Married women also swing while singing Teej songs (geet). This represents the joy of Parvati upon reuniting with Shiva.',
        hi: 'झूले को फूलों और हरियाली से सजाएँ। पार्वती-शिव की मूर्तियों को झूले पर रखकर धीरे-धीरे झुलाएँ। सुहागिन स्त्रियाँ भी तीज के गीत गाते हुए झूला झूलें। यह शिव से मिलन पर पार्वती के आनन्द का प्रतीक है।',
        sa: 'दोलनं पुष्पैः हरिद्भिश्च सज्जयेत्। पार्वतीशिवमूर्ती दोलने स्थापयित्वा मन्दं दोलयेत्। सौभाग्यवत्यः स्त्रियः तीजगीतानि गायन्त्यो दोलनम् आरोहन्ति। इदं शिवमिलने पार्वत्याः आनन्दस्य प्रतीकम्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Mehndi Application', hi: 'मेहँदी लगाना', sa: 'मेन्धिकालेपनम्' },
      description: {
        en: 'Apply mehndi (henna) on hands and feet with intricate designs. This is a central tradition of Teej  –  the darker the mehndi colour, the deeper the husband\'s love, as per folk belief.',
        hi: 'हाथों और पैरों पर सुन्दर बारीक डिज़ाइन में मेहँदी लगाएँ। यह तीज की प्रमुख परम्परा है  –  लोक मान्यता के अनुसार, मेहँदी का रंग जितना गहरा हो, पति का प्रेम उतना गहरा होता है।',
        sa: 'हस्तयोः पादयोश्च सूक्ष्मचित्रैः मेन्धिकां लेपयेत्। इदं तीजस्य प्रधानपरम्परा  –  लोकमान्यतानुसारं मेन्धिकायाः वर्णो यथा गभीरो भवति तथा पतिप्रेम गभीरं भवति।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Aarti and Naivedya', hi: 'आरती और नैवेद्य', sa: 'आरात्रिकं नैवेद्यं च' },
      description: {
        en: 'Perform aarti of Parvati-Shiva with ghee lamp and camphor. Offer ghewar, fruits, and other sweets as naivedya. Distribute prasad to all married women present.',
        hi: 'घी के दीपक और कपूर से पार्वती-शिव की आरती करें। घेवर, फल और अन्य मिठाइयाँ नैवेद्य के रूप में अर्पित करें। उपस्थित सभी सुहागिन स्त्रियों को प्रसाद वितरित करें।',
        sa: 'घृतदीपेन कर्पूरेण च पार्वतीशिवयोः आरात्रिकं कुर्यात्। घेवरं फलानि अन्यमिष्टान्नानि च नैवेद्यरूपेण समर्पयेत्। उपस्थिताभ्यः सर्वाभ्यः सौभाग्यवतीभ्यः प्रसादं वितरेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'parvati-mantra',
      name: { en: 'Parvati Mantra', hi: 'पार्वती मंत्र', sa: 'पार्वतीमन्त्रः' },
      devanagari: 'ॐ ह्रीं उमायै नमः।',
      iast: 'oṃ hrīṃ umāyai namaḥ |',
      meaning: {
        en: 'Om, I bow to Uma (Parvati), the Divine Mother.',
        hi: 'ॐ, दिव्य माता उमा (पार्वती) को नमस्कार।',
        sa: 'ॐ, दिव्यमात्रे उमायै नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the Parvati puja.',
        hi: 'पार्वती पूजा के दौरान 108 बार जाप करें।',
        sa: 'पार्वतीपूजनकाले अष्टोत्तरशतवारं जपेत्।',
      },
    },
    {
      id: 'gauri-mantra',
      name: { en: 'Gauri Saubhagya Mantra', hi: 'गौरी सौभाग्य मंत्र', sa: 'गौरीसौभाग्यमन्त्रः' },
      devanagari: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
      iast: 'sarvamaṅgalamāṅgalye śive sarvārthasādhike |\nśaraṇye tryambake gauri nārāyaṇi namo\'stu te ||',
      meaning: {
        en: 'O auspicious one, giver of all auspiciousness, O Shiva (consort of Shiva), fulfiller of all desires! O refuge, three-eyed Gauri, O Narayani  –  salutations to you.',
        hi: 'हे सबसे मङ्गलमयी, सर्वार्थसाधिके, शिवे! हे शरणदात्री, त्र्यम्बके, गौरी, नारायणी  –  आपको नमस्कार।',
        sa: 'हे सर्वमङ्गले, सर्वार्थसाधिके शिवे! हे शरण्ये त्र्यम्बके गौरि नारायणि  –  तुभ्यं नमः।',
      },
      usage: {
        en: 'Recite while offering sindoor and bangles to Goddess Parvati.',
        hi: 'देवी पार्वती को सिन्दूर और चूड़ियाँ अर्पित करते समय पाठ करें।',
        sa: 'पार्वत्यै सिन्दूरकङ्कणसमर्पणकाले पठेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Ghewar (Rajasthani layered sweet), malpua, kheer, seasonal fruits, and panjiri are the traditional offerings. In some regions, special Teej thali with various sweets sent by the bride\'s parents is offered first to the goddess.',
    hi: 'घेवर (राजस्थानी मिठाई), मालपुआ, खीर, मौसमी फल और पंजीरी पारम्परिक नैवेद्य हैं। कुछ क्षेत्रों में वधू के मायके से भेजी गई विशेष तीज थाली पहले देवी को अर्पित की जाती है।',
    sa: 'घेवरं मालपुआ पायसं ऋतुफलानि पञ्जीरी च पारम्परिकनैवेद्यानि। केषुचित् प्रदेशेषु वधूमातृगृहात् प्रेषिता विशेषतीजथाली प्रथमं देव्यै समर्प्यते।',
  },

  precautions: [
    {
      en: 'This vrat is primarily for married women (suhagan). Unmarried girls may observe it for a good husband but should follow slightly different rituals as advised by elders.',
      hi: 'यह व्रत मुख्यतः सुहागिन स्त्रियों के लिए है। अविवाहित कन्याएँ अच्छे पति हेतु रख सकती हैं पर बड़ों के मार्गदर्शन में भिन्न विधि अपनाएँ।',
      sa: 'इदं व्रतं मुख्यतः सौभाग्यवतीनां स्त्रीणां कृते। अविवाहिताः कन्याः सत्पतिप्राप्तये आचरेयुः किन्तु वृद्धानां मार्गदर्शने भिन्नविधिम् अनुसरेयुः।',
    },
    {
      en: 'Green colour is mandatory in attire and decorations  –  it symbolises Shravan\'s greenery and marital prosperity.',
      hi: 'वस्त्र और सजावट में हरा रंग अनिवार्य है  –  यह श्रावण की हरियाली और वैवाहिक समृद्धि का प्रतीक है।',
      sa: 'वस्त्रेषु सज्जायां च हरितवर्णः अनिवार्यः  –  स श्रावणहरितिमायाः वैवाहिकसमृद्धेश्च प्रतीकः।',
    },
    {
      en: 'The nirjala (waterless) form of the vrat is the strictest. If health does not permit, phalahar (fruit diet) is acceptable.',
      hi: 'निर्जला व्रत सबसे कठोर रूप है। स्वास्थ्य अनुमति न दे तो फलाहार स्वीकार्य है।',
      sa: 'निर्जलव्रतं कठिनतमं रूपम्। स्वास्थ्यं न अनुमन्यते चेत् फलाहारः स्वीकार्यः।',
    },
  ],

  phala: {
    en: 'Hariyali Teej bestows long life and prosperity upon the husband, deepens the marital bond, and brings the blessings of Goddess Parvati for eternal saubhagya (marital bliss). Unmarried women gain the boon of a devoted, compatible husband.',
    hi: 'हरियाली तीज पति को दीर्घायु और समृद्धि प्रदान करती है, दाम्पत्य बन्धन को गहरा करती है, और शाश्वत सौभाग्य के लिए देवी पार्वती का आशीर्वाद देती है। अविवाहित स्त्रियों को समर्पित, अनुकूल पति का वरदान मिलता है।',
    sa: 'हरियालीतीजव्रतेन पतिः दीर्घायुः समृद्धश्च भवति, दाम्पत्यबन्धनं गभीरं भवति, शाश्वतसौभाग्याय पार्वत्याः अनुग्रहः प्राप्यते। अविवाहितानां स्त्रीणां समर्पितानुकूलपतिवरदानं लभ्यते।',
  },
};

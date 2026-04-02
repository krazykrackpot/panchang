import type { PujaVidhi } from './types';

export const TULSI_VIVAH_PUJA: PujaVidhi = {
  festivalSlug: 'tulsi-vivah',
  category: 'vrat',
  deity: { en: 'Tulsi-Vishnu', hi: 'तुलसी-विष्णु', sa: 'तुलसीविष्णू' },

  samagri: [
    { name: { en: 'Tulsi plant (holy basil)', hi: 'तुलसी का पौधा', sa: 'तुलसीवृक्षः' }, essential: true, note: { en: 'The bride — must be a healthy, well-maintained Tulsi plant in a pot or tulsi vrindavan', hi: 'वधू — स्वस्थ, सुव्यवस्थित तुलसी का पौधा गमले या तुलसी वृन्दावन में', sa: 'वधू — स्वस्थं सुरक्षितं तुलसीवृक्षं कुम्भे तुलसीवृन्दावने वा' } },
    { name: { en: 'Shaligrama stone (fossil ammonite)', hi: 'शालिग्राम शिला', sa: 'शालिग्रामशिला' }, essential: true, note: { en: 'The groom — a sacred stone representing Lord Vishnu', hi: 'वर — भगवान विष्णु का प्रतिनिधित्व करने वाला पवित्र पत्थर', sa: 'वरः — श्रीविष्णोः प्रतिनिधिभूतं पवित्रं शिलम्' } },
    { name: { en: 'Mandap decoration (small canopy with 4 pillars)', hi: 'मण्डप सजावट (4 खम्भों वाली छोटी छत)', sa: 'मण्डपालङ्करणम् (चतुःस्तम्भं लघुछत्रम्)' }, essential: true },
    { name: { en: 'Sugarcane sticks (for mandap pillars)', hi: 'गन्ने की छड़ें (मण्डप के खम्भों के लिए)', sa: 'इक्षुदण्डाः (मण्डपस्तम्भार्थम्)' } },
    { name: { en: 'Mango leaves and marigold garlands (for mandap)', hi: 'आम के पत्ते और गेंदे की मालाएँ (मण्डप के लिए)', sa: 'आम्रपत्राणि स्थालपद्ममालाश्च (मण्डपार्थम्)' }, category: 'flowers' },
    { name: { en: 'Wedding items (sindoor, mangalsutra, kumkum, haldi)', hi: 'विवाह सामग्री (सिन्दूर, मंगलसूत्र, कुमकुम, हल्दी)', sa: 'विवाहसामग्री (सिन्दूरं मङ्गलसूत्रं कुङ्कुमं हरिद्रा च)' }, essential: true },
    { name: { en: 'Red cloth (chunri/odhni for Tulsi)', hi: 'लाल कपड़ा (तुलसी के लिए चुनरी/ओढ़नी)', sa: 'रक्तवस्त्रम् (तुलस्यर्थं चुनरी)' }, category: 'clothing' },
    { name: { en: 'Amla (Indian gooseberry)', hi: 'आँवला', sa: 'आमलकम्' }, category: 'food', note: { en: 'Traditional offering — also marks the start of amla harvesting season', hi: 'पारम्परिक अर्पण — आँवले के मौसम की शुरुआत का प्रतीक', sa: 'पारम्परिकम् अर्पणम् — आमलकऋतोः आरम्भचिह्नं च' } },
    { name: { en: 'Ghee lamp (5-wick panchadeep)', hi: 'घी का दीपक (पाँच बत्ती वाला)', sa: 'घृतदीपः (पञ्चदीपः)' }, category: 'puja_items' },
    { name: { en: 'Tamarind and amla (for naivedya)', hi: 'इमली और आँवला (नैवेद्य के लिए)', sa: 'तिन्तिडीफलम् आमलकं च (नैवेद्यार्थम्)' }, category: 'food' },
    { name: { en: 'Puffed rice (laiya/murmura) and sweets', hi: 'मुरमुरे (लाई) और मिठाई', sa: 'लाजाः मिष्टान्नानि च' }, category: 'food' },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Tulsi Vivah is performed on Kartik Shukla Dwadashi (12th day of waxing moon in Kartik month), marking the end of Chaturmas. The ceremony is performed during Pradosh Kaal (evening twilight), just as regular Hindu weddings are performed in the evening.',
    hi: 'तुलसी विवाह कार्तिक शुक्ल द्वादशी (कार्तिक माह में बढ़ते चन्द्रमा का 12वाँ दिन) को होता है, जो चातुर्मास के अन्त का प्रतीक है। समारोह प्रदोष काल (सायं सन्ध्या) में होता है, जैसे सामान्य हिन्दू विवाह सायंकाल में होते हैं।',
    sa: 'तुलसीविवाहः कार्तिकशुक्लद्वादश्यां (कार्तिकमासे वर्धमानचन्द्रस्य द्वादशे दिने) क्रियते, चातुर्मासस्य अन्तं सूचयन्। विवाहः प्रदोषकाले (सायंसन्ध्यायाम्) क्रियते, यथा सामान्यहिन्दुविवाहाः सायं क्रियन्ते।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Kartik Dwadashi, I perform the ceremonial marriage of Tulsi Devi (Vrinda) with Lord Vishnu (Shaligrama), marking the end of Chaturmas and the beginning of the auspicious wedding season.',
    hi: 'इस पवित्र कार्तिक द्वादशी पर, मैं तुलसी देवी (वृन्दा) और भगवान विष्णु (शालिग्राम) का विवाह सम्पन्न करता/करती हूँ — चातुर्मास के अन्त और शुभ विवाह ऋतु के आरम्भ की घोषणा।',
    sa: 'अस्यां पवित्रायां कार्तिकद्वादश्यां तुलसीदेव्याः (वृन्दायाः) श्रीविष्णोः (शालिग्रामस्य) च विवाहं सम्पादयामि — चातुर्मासान्तं शुभविवाहर्तोः आरम्भं च सूचयन्।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Mandap Preparation', hi: 'मण्डप तैयारी', sa: 'मण्डपसज्जा' },
      description: {
        en: 'Erect a small wedding mandap (canopy) around the Tulsi plant using sugarcane sticks as pillars. Decorate with mango leaves, marigold garlands, and colourful cloth. This is the wedding venue.',
        hi: 'गन्ने की छड़ों को खम्भों के रूप में लगाकर तुलसी के पौधे के चारों ओर छोटा विवाह मण्डप बनाएँ। आम के पत्तों, गेंदे की मालाओं और रंगीन कपड़े से सजाएँ। यह विवाह स्थल है।',
        sa: 'तुलसीवृक्षं परितः इक्षुदण्डान् स्तम्भरूपेण स्थापयित्वा लघुविवाहमण्डपं रचयेत्। आम्रपत्रैः स्थालपद्ममालाभिः रङ्गवस्त्रैश्च अलङ्कुर्यात्। एतद् विवाहस्थलम्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '30 min',
    },
    {
      step: 2,
      title: { en: 'Bride & Groom Preparation', hi: 'वधू एवं वर की तैयारी', sa: 'वधूवरसज्जा' },
      description: {
        en: 'Bathe the Tulsi plant (the bride) with water and decorate with a red chunri (cloth), flowers, and jewellery. Place the Shaligrama stone (the groom) on a small pedestal near the Tulsi, draped in a yellow cloth.',
        hi: 'तुलसी के पौधे (वधू) को जल से स्नान कराएँ और लाल चुनरी, फूल और आभूषणों से सजाएँ। शालिग्राम शिला (वर) को तुलसी के पास एक छोटे चबूतरे पर पीले कपड़े में रखें।',
        sa: 'तुलसीवृक्षं (वधूम्) जलेन स्नापयेत् रक्तचुनर्या पुष्पैः आभूषणैश्च अलङ्कुर्यात्। शालिग्रामशिलां (वरम्) तुलसीसमीपे लघुपीठे पीतवस्त्रे स्थापयेत्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '15 min',
    },
    {
      step: 3,
      title: { en: 'Ganesh Puja & Sankalpa', hi: 'गणेश पूजा एवं संकल्प', sa: 'गणेशपूजनं सङ्कल्पश्च' },
      description: {
        en: 'As with all Hindu ceremonies, begin with Ganesha worship for removal of obstacles. Then take the formal sankalpa for the Tulsi Vivah, stating the tithi, purpose, and names of the divine couple.',
        hi: 'सभी हिन्दू समारोहों की तरह, विघ्न निवारण के लिए गणेश पूजा से आरम्भ करें। फिर तुलसी विवाह के लिए तिथि, उद्देश्य और दिव्य दम्पती के नाम बोलकर विधिवत् संकल्प लें।',
        sa: 'सर्वहिन्दुसमारोहवत् विघ्ननिवारणार्थं गणेशपूजनात् आरभेत्। ततः तुलसीविवाहार्थं तिथिप्रयोजनदिव्यदम्पतीनामोच्चारणपूर्वकं सङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
      duration: '10 min',
    },
    {
      step: 4,
      title: { en: 'Kanya Daan (Giving Away the Bride)', hi: 'कन्यादान', sa: 'कन्यादानम्' },
      description: {
        en: 'The householder symbolically performs kanya daan — giving away Tulsi (Vrinda Devi) in marriage to Lord Vishnu (Shaligrama). Pour water from the right palm while reciting the daan mantra, just as in a real wedding.',
        hi: 'गृहस्थ प्रतीकात्मक रूप से कन्यादान करता है — तुलसी (वृन्दा देवी) को भगवान विष्णु (शालिग्राम) को विवाह में समर्पित करता है। दान मन्त्र पढ़ते हुए दाहिने हाथ से जल छोड़ें, जैसे वास्तविक विवाह में होता है।',
        sa: 'गृहस्थः प्रतीकात्मकं कन्यादानं करोति — तुलसीं (वृन्दादेवीम्) श्रीविष्णवे (शालिग्रामाय) विवाहे समर्पयति। दानमन्त्रम् उच्चारयन् दक्षिणहस्तात् जलं मुञ्चेत्, यथा वास्तविके विवाहे।',
      },
      essential: true,
      stepType: 'offering',
      duration: '10 min',
    },
    {
      step: 5,
      title: { en: 'Mangalphera (Circumambulation)', hi: 'मंगलफेरे (परिक्रमा)', sa: 'मङ्गलफेराः (प्रदक्षिणा)' },
      description: {
        en: 'Carry the Shaligrama stone around the Tulsi plant 4 times (the four pheras/rounds of a Hindu wedding). Each round represents Dharma (duty), Artha (prosperity), Kama (love), and Moksha (liberation).',
        hi: 'शालिग्राम शिला को तुलसी के पौधे के चारों ओर 4 बार (हिन्दू विवाह के चार फेरे) घुमाएँ। प्रत्येक फेरा धर्म, अर्थ, काम और मोक्ष का प्रतीक है।',
        sa: 'शालिग्रामशिलां तुलसीवृक्षं परितः चतुर्वारं (हिन्दुविवाहस्य चतुष्फेराः) परिणयेत्। प्रत्येकफेरः धर्मम् अर्थं कामं मोक्षं च प्रतिनिधत्ते।',
      },
      essential: true,
      stepType: 'offering',
      duration: '10 min',
    },
    {
      step: 6,
      title: { en: 'Sindoor Daan & Mangalsutra', hi: 'सिन्दूर दान एवं मंगलसूत्र', sa: 'सिन्दूरदानं मङ्गलसूत्रं च' },
      description: {
        en: 'Apply sindoor (vermilion) at the base of the Tulsi plant and tie a small mangalsutra around the trunk. This symbolises the completion of the marriage ritual, just as a groom applies sindoor to the bride.',
        hi: 'तुलसी के पौधे की जड़ में सिन्दूर लगाएँ और तने के चारों ओर छोटा मंगलसूत्र बाँधें। यह विवाह अनुष्ठान की पूर्णता का प्रतीक है, जैसे वर वधू को सिन्दूर लगाता है।',
        sa: 'तुलसीवृक्षमूले सिन्दूरं लिम्पेत् स्कन्धे लघुमङ्गलसूत्रं बध्नीयात्। एतद् विवाहकर्मणः पूर्णतायाः प्रतीकम्, यथा वरः वध्वै सिन्दूरं लिम्पति।',
      },
      essential: true,
      stepType: 'offering',
      duration: '5 min',
    },
    {
      step: 7,
      title: { en: 'Tulsi Mantra Japa', hi: 'तुलसी मन्त्र जप', sa: 'तुलसीमन्त्रजपः' },
      description: {
        en: 'Chant the Tulsi mantra 108 times. Tulsi is Vrinda Devi — the most beloved consort of Vishnu in plant form. The mantra honours her sacred status.',
        hi: 'तुलसी मन्त्र 108 बार जपें। तुलसी वृन्दा देवी हैं — पौधे के रूप में विष्णु की सबसे प्रिय पत्नी। मन्त्र उनकी पवित्र स्थिति का सम्मान करता है।',
        sa: 'तुलसीमन्त्रं १०८ वारं जपेत्। तुलसी वृन्दादेवी — वनस्पतिरूपेण विष्णोः प्रियतमा पत्नी। मन्त्रः तस्याः पवित्रस्थितिं सम्मानयति।',
      },
      mantraRef: 'tulsi-mantra',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 8,
      title: { en: 'Vishnu Mantra & Prayer', hi: 'विष्णु मन्त्र एवं प्रार्थना', sa: 'विष्णुमन्त्रः प्रार्थना च' },
      description: {
        en: 'Chant the Vishnu mantra 108 times. Pray to Lord Vishnu to bless the household, just as he blesses his marriage with Tulsi (Vrinda).',
        hi: 'विष्णु मन्त्र 108 बार जपें। भगवान विष्णु से प्रार्थना करें कि वे घर को आशीर्वाद दें, जैसे वे तुलसी (वृन्दा) के साथ अपने विवाह को आशीर्वाद देते हैं।',
        sa: 'विष्णुमन्त्रं १०८ वारं जपेत्। श्रीविष्णुं प्रार्थयेत् गृहम् आशिषा पूरयतु, यथा सः तुलस्या (वृन्दया) सह स्वविवाहम् आशिषा पूरयति।',
      },
      mantraRef: 'vishnu-tulsi-mantra',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 9,
      title: { en: 'Naivedya & Aarti', hi: 'नैवेद्य एवं आरती', sa: 'नैवेद्यम् आरात्रिकं च' },
      description: {
        en: 'Offer naivedya of amla, puffed rice, sweets, and fruits. Perform the aarti with the panchadeep (five-wick lamp) and camphor. Sing wedding songs (mangal geet).',
        hi: 'आँवला, मुरमुरे, मिठाई और फलों का नैवेद्य अर्पित करें। पञ्चदीप (पाँच बत्ती का दीपक) और कपूर से आरती करें। विवाह गीत (मंगल गीत) गाएँ।',
        sa: 'आमलकं लाजान् मिष्टान्नानि फलानि च नैवेद्यम् अर्पयेत्। पञ्चदीपेन कर्पूरेण च आरात्रिकं कुर्यात्। विवाहगीतानि (मङ्गलगीतानि) गायेत्।',
      },
      essential: true,
      stepType: 'offering',
      duration: '15 min',
    },
    {
      step: 10,
      title: { en: 'Celebration & Distribution', hi: 'उत्सव एवं वितरण', sa: 'उत्सवः वितरणं च' },
      description: {
        en: 'Distribute prasad (sweets, puffed rice, amla) to neighbours and community members, just as at a real wedding feast. Light fireworks or diyas to celebrate. This marks the official end of Chaturmas and the opening of the wedding season.',
        hi: 'पड़ोसियों और समुदाय के सदस्यों को प्रसाद (मिठाई, मुरमुरे, आँवला) बाँटें, जैसे वास्तविक विवाह भोज में होता है। उत्सव के लिए पटाखे या दीपक जलाएँ। यह चातुर्मास का आधिकारिक अन्त और विवाह ऋतु का शुभारम्भ है।',
        sa: 'पार्श्ववासिनां समुदायसदस्यानां च प्रसादं (मिष्टान्नानि लाजान् आमलकं च) वितरेत्, यथा वास्तविकविवाहभोजे। उत्सवार्थं दीपान् प्रज्वालयेत्। एतच्चातुर्मासस्य आधिकारिकम् अन्तं विवाहर्तोः शुभारम्भं च सूचयति।',
      },
      essential: false,
      stepType: 'conclusion',
      duration: '20 min',
    },
  ],

  mantras: [
    {
      id: 'tulsi-mantra',
      name: { en: 'Tulsi Mantra', hi: 'तुलसी मन्त्र', sa: 'तुलसीमन्त्रः' },
      devanagari: 'ॐ तुलस्यमृतजन्मासि सदा त्वं केशवप्रिये। केशवार्थं चिनोमि त्वां वरदा भव शोभने॥',
      iast: 'oṃ tulasyamṛtajanmāsi sadā tvaṃ keśavapriye | keśavārthaṃ cinomi tvāṃ varadā bhava śobhane ||',
      meaning: {
        en: 'O Tulsi, you are born from the nectar of immortality, you are always dear to Keshava (Vishnu). I pluck you for Keshava\'s worship — O beautiful one, be the granter of boons.',
        hi: 'हे तुलसी, तुम अमृत से उत्पन्न हो, सदा केशव (विष्णु) की प्रिय हो। केशव की पूजा के लिए मैं तुम्हें चुनता/चुनती हूँ — हे सुन्दरी, वरदायिनी बनो।',
        sa: 'हे तुलसि, त्वम् अमृतजन्मा, सदा केशवप्रिया। केशवार्थं त्वां चिनोमि — हे शोभने, वरदा भव।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant during the Tulsi Vivah ceremony, 108 times. This mantra invokes the divine nature of Tulsi as Vrinda Devi.',
        hi: 'तुलसी विवाह समारोह के दौरान 108 बार जपें। यह मन्त्र वृन्दा देवी के रूप में तुलसी के दिव्य स्वरूप का आह्वान करता है।',
        sa: 'तुलसीविवाहसमारोहे १०८ वारं जपेत्। एषः मन्त्रः वृन्दादेव्याः रूपेण तुलस्याः दिव्यस्वरूपम् आवाहयति।',
      },
    },
    {
      id: 'vishnu-tulsi-mantra',
      name: { en: 'Vishnu Mantra (for Tulsi Vivah)', hi: 'विष्णु मन्त्र (तुलसी विवाह हेतु)', sa: 'विष्णुमन्त्रः (तुलसीविवाहार्थम्)' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय',
      iast: 'oṃ namo bhagavate vāsudevāya',
      meaning: {
        en: 'Om, I bow to Lord Vasudeva (Vishnu), the Supreme Being and groom of Tulsi.',
        hi: 'ॐ, सर्वोच्च भगवान वासुदेव (विष्णु), तुलसी के वर, को नमन।',
        sa: 'ॐ, परमात्मने तुलस्याः वराय वासुदेवाय (विष्णवे) नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the ceremony. The Dvadashakshari mantra represents the groom (Vishnu) in this sacred wedding.',
        hi: 'समारोह के दौरान 108 बार जपें। द्वादशाक्षरी मन्त्र इस पवित्र विवाह में वर (विष्णु) का प्रतिनिधित्व करता है।',
        sa: 'समारोहे १०८ वारं जपेत्। द्वादशाक्षरीमन्त्रः अस्मिन् पवित्रविवाहे वरं (विष्णुं) प्रतिनिधत्ते।',
      },
    },
  ],

  naivedya: {
    en: 'Offer amla (Indian gooseberry), puffed rice (laiya), chana (chickpeas), sweets (laddoo, peda), sugarcane pieces, and seasonal fruits. Amla is the signature offering of Tulsi Vivah.',
    hi: 'आँवला, मुरमुरे (लाई), चना, मिठाई (लड्डू, पेड़ा), गन्ने के टुकड़े और मौसमी फल अर्पित करें। आँवला तुलसी विवाह का प्रमुख भोग है।',
    sa: 'आमलकं लाजान् चणकान् मिष्टान्नानि (लड्डुकानि पेदकानि) इक्षुखण्डानि ऋतुफलानि च अर्पयेत्। आमलकं तुलसीविवाहस्य प्रमुखभोगः।',
  },

  precautions: [
    {
      en: 'Tulsi Vivah must be performed only after Dev Uthani Ekadashi (Kartik Shukla Ekadashi). It marks Vishnu\'s awakening from Chaturmas sleep.',
      hi: 'तुलसी विवाह केवल देवउठनी एकादशी (कार्तिक शुक्ल एकादशी) के बाद ही करना चाहिए। यह विष्णु के चातुर्मास निद्रा से जागने का प्रतीक है।',
      sa: 'तुलसीविवाहः देवोत्थान्येकादश्याः (कार्तिकशुक्लैकादश्याः) अनन्तरम् एव कर्तव्यः। विष्णोः चातुर्मासनिद्रातः जागरणं सूचयति।',
    },
    {
      en: 'Do not pluck Tulsi leaves after sunset. If leaves are needed for the evening ceremony, pluck them before sunset.',
      hi: 'सूर्यास्त के बाद तुलसी के पत्ते नहीं तोड़ें। यदि सायं समारोह के लिए पत्ते चाहिए तो सूर्यास्त से पहले तोड़ लें।',
      sa: 'सूर्यास्तानन्तरं तुलसीपत्राणि न छिन्द्यात्। सायंसमारोहार्थं पत्राणि चेत् आवश्यकानि सूर्यास्तात् प्राक् छिन्द्यात्।',
    },
    {
      en: 'The Shaligrama stone should be genuine and traditionally obtained. It represents Vishnu and must be treated with utmost reverence.',
      hi: 'शालिग्राम शिला प्रामाणिक और पारम्परिक रूप से प्राप्त होनी चाहिए। यह विष्णु का प्रतिनिधित्व करती है और इसके साथ अत्यन्त श्रद्धा से व्यवहार करना चाहिए।',
      sa: 'शालिग्रामशिला प्रामाणिकी पारम्परिकरूपेण प्राप्ता च स्यात्। सा विष्णुं प्रतिनिधत्ते परमादरेण व्यवहर्तव्या।',
    },
    {
      en: 'No Hindu weddings should be planned during Chaturmas (Ashadh Shukla Ekadashi to Kartik Shukla Ekadashi). Tulsi Vivah opens the wedding season.',
      hi: 'चातुर्मास (आषाढ़ शुक्ल एकादशी से कार्तिक शुक्ल एकादशी) के दौरान कोई हिन्दू विवाह नहीं होना चाहिए। तुलसी विवाह से विवाह ऋतु शुरू होती है।',
      sa: 'चातुर्मासे (आषाढशुक्लैकादश्याः कार्तिकशुक्लैकादशीपर्यन्तम्) हिन्दुविवाहाः न योजनीयाः। तुलसीविवाहः विवाहर्तुम् आरभते।',
    },
  ],

  phala: {
    en: 'Tulsi Vivah is believed to bestow the same merit as performing a kanya daan (giving a daughter in marriage) — the highest form of daan. It grants domestic harmony, prosperity, and the blessing of Vishnu upon the household. The Padma Purana states that one who performs Tulsi Vivah is freed from the debt of ancestors.',
    hi: 'तुलसी विवाह करने का पुण्य कन्यादान (पुत्री का विवाह में दान) — दान के सर्वोच्च रूप — के बराबर माना जाता है। यह घरेलू सौहार्द, समृद्धि और घर पर विष्णु का आशीर्वाद प्रदान करता है। पद्म पुराण के अनुसार जो तुलसी विवाह करता है वह पितृ-ऋण से मुक्त होता है।',
    sa: 'तुलसीविवाहः कन्यादानसमपुण्यं (विवाहे कन्यायाः दानं — दानस्य सर्वोच्चरूपम्) ददातीति विश्वस्यते। गृहसौहार्दं समृद्धिं गृहे विष्ण्वाशीर्वादं च ददाति। पद्मपुराणे उक्तं तुलसीविवाहकर्ता पितृऋणात् मुच्यत इति।',
  },
};

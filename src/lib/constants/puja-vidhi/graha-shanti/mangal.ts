import type { PujaVidhi } from '../types';

export const MANGAL_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-mangal',
  category: 'graha_shanti',
  deity: { en: 'Mangal (Mars)', hi: 'मंगल देव', sa: 'मङ्गलदेवः' },

  samagri: [
    { name: { en: 'Red lentils (masoor dal)', hi: 'मसूर दाल', sa: 'मसूरदालम्' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'Copper vessel', hi: 'ताँबे का पात्र', sa: 'ताम्रपात्रम्' }, essential: true, category: 'vessels' },
    { name: { en: 'Red cloth', hi: 'लाल वस्त्र', sa: 'रक्तवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Red flowers (hibiscus)', hi: 'लाल फूल (गुड़हल)', sa: 'रक्तपुष्पाणि (जपाकुसुमम्)' }, essential: true, category: 'flowers' },
    { name: { en: 'Jaggery (gur)', hi: 'गुड़', sa: 'गुडम्' }, quantity: '250 g', category: 'food' },
    { name: { en: 'Red sandalwood paste', hi: 'लाल चन्दन का लेप', sa: 'रक्तचन्दनलेपः' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Dhoop / Incense', hi: 'धूप / अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Mangal Shanti puja is performed on Tuesday during the morning hours, ideally within the first three hours after sunrise. Mangalvar (Tuesday) is Mars\'s own day.',
    hi: 'मंगल शान्ति पूजा मंगलवार को प्रातःकाल, सूर्योदय के बाद पहले तीन घण्टों में करनी चाहिए। मंगलवार मंगल ग्रह का अपना दिन है।',
    sa: 'मङ्गलशान्तिपूजा मङ्गलवासरे प्रातःकाले सूर्योदयात् प्रथमत्रिघण्टासु कर्तव्या। मङ्गलवासरः मङ्गलग्रहस्य स्वदिनम्।',
  },

  sankalpa: {
    en: 'On this sacred Tuesday, I perform Mangal Graha Shanti puja to pacify Mars and seek blessings for courage, protection from accidents, resolution of property disputes, and Mangal dosha relief.',
    hi: 'इस पवित्र मंगलवार को, मैं साहस, दुर्घटना से रक्षा, भूमि विवाद निवारण और मंगल दोष शान्ति हेतु मंगल ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रमङ्गलवासरे शौर्यं दुर्घटनारक्षा भूमिविवादनिवारणं मङ्गलदोषशान्तिश्च प्राप्त्यर्थं मङ्गलग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe early in the morning before sunrise. Wear clean red or maroon clothes. Maintain a disciplined and focused mindset.',
        hi: 'सूर्योदय से पहले प्रातः स्नान करें। स्वच्छ लाल या मरून वस्त्र पहनें। अनुशासित और एकाग्र मनःस्थिति रखें।',
        sa: 'सूर्योदयात् प्राक् प्रातः स्नानं कुर्यात्। शुचिरक्तवस्त्राणि धारयेत्। अनुशासितैकाग्रमानसं पालयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing south (Mars\'s direction). Hold water with red sandalwood and red flowers in the right palm. State your name, gotra, and intention to pacify Mangal graha.',
        hi: 'दक्षिण दिशा (मंगल की दिशा) की ओर मुख कर बैठें। दाहिने हाथ में लाल चन्दन व लाल फूल सहित जल लेकर मंगल ग्रह शान्ति का संकल्प करें।',
        sa: 'दक्षिणदिशम् (मङ्गलदिशाम्) अभिमुखम् उपविशेत्। दक्षिणहस्ते रक्तचन्दनरक्तपुष्पसहितजलं गृहीत्वा मङ्गलग्रहशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Place a copper vessel filled with water on a bed of red lentils. Add red sandalwood paste and red flowers. Cover with a red cloth.',
        hi: 'ताँबे के पात्र में जल भरकर मसूर दाल के बिछौने पर रखें। लाल चन्दन और लाल फूल डालें। लाल वस्त्र से ढकें।',
        sa: 'ताम्रपात्रं जलेन पूर्य मसूरदालोपरि स्थापयेत्। रक्तचन्दनं रक्तपुष्पाणि च क्षिपेत्। रक्तवस्त्रेण आवृणुयात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Mangal Avahana (Invocation)', hi: 'मंगल आवाहन', sa: 'मङ्गलावाहनम्' },
      description: {
        en: 'Invoke Mangal Deva by lighting the ghee lamp and offering red flowers. Apply red sandalwood tilak. Recite "Om Angarakaya Namah" three times.',
        hi: 'घी का दीपक जलाकर और लाल फूल अर्पित कर मंगल देव का आवाहन करें। लाल चन्दन का तिलक लगाएँ। "ॐ अंगारकाय नमः" तीन बार बोलें।',
        sa: 'घृतदीपं प्रज्वाल्य रक्तपुष्पाणि अर्पयित्वा मङ्गलदेवम् आवाहयेत्। रक्तचन्दनतिलकं धारयेत्। "ओं अङ्गारकाय नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Mangal Beej Mantra Japa', hi: 'मंगल बीज मन्त्र जप', sa: 'मङ्गलबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Mangal Beej Mantra 10,000 times (or 108 times minimum). Use a red coral or rudraksha mala. Meditate on a fiery red orb radiating courage and strength.',
        hi: 'मंगल बीज मन्त्र 10,000 बार (या न्यूनतम 108 बार) जपें। प्रवाल (मूँगा) या रुद्राक्ष माला का उपयोग करें। साहस और शक्ति विकीर्ण करते अग्निमय लाल गोले का ध्यान करें।',
        sa: 'मङ्गलबीजमन्त्रं दशसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। प्रवालरुद्राक्षमालाम् उपयुञ्जीत। शौर्यबलविकीर्णम् अग्निमयरक्तगोलं ध्यायेत्।',
      },
      mantraRef: 'mangal-beej',
      essential: true,
      stepType: 'mantra',
      duration: '60 min',
    },
    {
      step: 6,
      title: { en: 'Homa (Fire Offering) — Optional', hi: 'होम (हवन) — वैकल्पिक', sa: 'होमः — वैकल्पिकः' },
      description: {
        en: 'If possible, perform a small homa with red sandalwood sticks and ghee. Offer red lentils into the sacred fire while chanting the Mangal Gayatri. This intensifies the remedy.',
        hi: 'यदि सम्भव हो तो लाल चन्दन की लकड़ी और घी से लघु होम करें। मंगल गायत्री का जाप करते हुए पवित्र अग्नि में मसूर दाल की आहुति दें।',
        sa: 'यदि शक्यं रक्तचन्दनकाष्ठैः घृतेन च लघुहोमं कुर्यात्। मङ्गलगायत्रीं जपन् पवित्राग्नौ मसूरदालस्य आहुतिं दद्यात्।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate red lentils and jaggery to the poor. Copper items or red cloth may also be given. Feed sweets to monkeys (associated with Hanuman, Mars\'s presiding deity).',
        hi: 'गरीबों को मसूर दाल और गुड़ दान करें। ताँबे की वस्तुएँ या लाल वस्त्र भी दे सकते हैं। बन्दरों को मिठाई खिलाएँ (हनुमान, मंगल के अधिष्ठाता देवता से सम्बन्धित)।',
        sa: 'दरिद्रेभ्यः मसूरदालं गुडं च दद्यात्। ताम्रवस्तूनि रक्तवस्त्रं वा दातुं शक्यन्ते। वानरेभ्यः मिष्टान्नानि भोजयेत् (हनुमान् मङ्गलस्य अधिष्ठातृदेवता)।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Mangal Deva and Lord Hanuman for removal of Mars afflictions. Perform sashtanga namaskar. Recite Hanuman Chalisa for enhanced benefit.',
        hi: 'मंगल दोष निवारण हेतु मंगल देव और हनुमान जी से प्रार्थना करें। साष्टांग नमस्कार करें। अधिक लाभ के लिए हनुमान चालीसा पढ़ें।',
        sa: 'मङ्गलदोषनिवारणार्थं मङ्गलदेवं हनुमन्तं च प्रार्थयेत्। साष्टाङ्गनमस्कारं कुर्यात्। अधिकलाभाय हनुमच्चालीसां पठेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'mangal-beej',
      name: { en: 'Mangal Beej Mantra', hi: 'मंगल बीज मन्त्र', sa: 'मङ्गलबीजमन्त्रः' },
      devanagari: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      iast: 'oṃ krāṃ krīṃ krauṃ saḥ bhaumāya namaḥ',
      meaning: {
        en: 'Salutations to Mars (son of Earth). The seed syllables invoke Mangal\'s courageous energy for strength, protection, and resolution of conflicts.',
        hi: 'मंगल (भूमि पुत्र) को नमन। बीज अक्षर मंगल की साहसिक ऊर्जा का आवाहन शक्ति, रक्षा और विवाद निवारण हेतु करते हैं।',
        sa: 'भौमाय (भूमिपुत्राय) नमः। बीजाक्षराणि मङ्गलस्य शौर्यऊर्जां बलस्य रक्षायाः विवादनिवारणस्य च कृते आवाहयन्ति।',
      },
      japaCount: 10000,
      usage: {
        en: 'Chant 10,000 times for full Mangal shanti; 108 times daily for ongoing remedy',
        hi: 'पूर्ण मंगल शान्ति के लिए 10,000 बार जपें; दैनिक उपाय के लिए 108 बार',
        sa: 'पूर्णमङ्गलशान्त्यर्थं दशसहस्रवारं जपेत्; नित्योपचारार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'mangal-gayatri',
      name: { en: 'Mangal Gayatri Mantra', hi: 'मंगल गायत्री मन्त्र', sa: 'मङ्गलगायत्रीमन्त्रः' },
      devanagari: 'ॐ अङ्गारकाय विद्महे शक्तिहस्ताय धीमहि ।\nतन्नो भौमः प्रचोदयात् ॥',
      iast: 'oṃ aṅgārakāya vidmahe śaktihastāya dhīmahi |\ntanno bhaumaḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on Angaraka (Mars), who holds the shakti (power) weapon. May the son of Earth inspire courage and righteous action in us.',
        hi: 'हम अंगारक (मंगल) का ध्यान करते हैं, जो शक्ति अस्त्र धारण करते हैं। भूमि पुत्र हमें साहस और धर्मपूर्ण कर्म की प्रेरणा दें।',
        sa: 'अङ्गारकं (मङ्गलम्) शक्तिहस्तं ध्यायामः। भूमिपुत्रः नः शौर्यं धर्मकर्म च प्रेरयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during homa offering and as a daily prayer on Tuesdays',
        hi: 'होम के समय और मंगलवार को दैनिक प्रार्थना के रूप में जपें',
        sa: 'होमसमये मङ्गलवासरे दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer red lentil preparations, jaggery sweets, and red-coloured fruits. Laddu made with wheat and jaggery is traditional.',
    hi: 'मसूर दाल से बने पकवान, गुड़ की मिठाई और लाल रंग के फल अर्पित करें। गेहूँ और गुड़ के लड्डू पारम्परिक हैं।',
    sa: 'मसूरदालनिर्मितपक्वान्नानि गुडमिष्टान्नानि रक्तवर्णफलानि च अर्पयेत्। गोधूमगुडमोदकाः पारम्परिकाः।',
  },

  precautions: [
    {
      en: 'Face south during the puja. Red is the essential colour for all items — clothes, flowers, cloth, and samagri.',
      hi: 'पूजा में दक्षिण दिशा की ओर मुख करें। सभी सामग्री — वस्त्र, फूल, कपड़ा और सामग्री — का रंग लाल होना चाहिए।',
      sa: 'पूजायां दक्षिणदिशम् अभिमुखं कुर्यात्। सर्वेषां सामग्रीणां — वस्त्रपुष्पवस्त्रसामग्रीणां — वर्णः रक्तः भवेत्।',
    },
    {
      en: 'Avoid anger and aggression on the puja day — these are Mars\'s negative manifestations that the puja aims to pacify.',
      hi: 'पूजा के दिन क्रोध और आक्रामकता से बचें — ये मंगल के नकारात्मक प्रभाव हैं जिन्हें पूजा शान्त करने का उद्देश्य रखती है।',
      sa: 'पूजादिने क्रोधम् आक्रामकतां च वर्जयेत् — एते मङ्गलस्य नकारात्मकप्रभावाः यान् पूजा शमयितुम् उद्दिश्यते।',
    },
    {
      en: 'Celibacy (brahmacharya) should be observed on the day of Mangal Shanti puja for best results.',
      hi: 'सर्वोत्तम फल के लिए मंगल शान्ति पूजा के दिन ब्रह्मचर्य का पालन करें।',
      sa: 'श्रेष्ठफलाय मङ्गलशान्तिपूजादिने ब्रह्मचर्यं पालयेत्।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Mars. Bestows courage, protection from accidents and surgeries, resolution of property disputes, Mangal dosha relief for marriage, improved blood health, and sibling harmony.',
    hi: 'पीड़ित मंगल को शान्त करता है। साहस, दुर्घटना-शल्यक्रिया से रक्षा, भूमि विवाद निवारण, विवाह हेतु मंगल दोष शान्ति, रक्त स्वास्थ्य सुधार और भाई-बहन में सामंजस्य प्रदान करता है।',
    sa: 'पीडितमङ्गलं शमयति। शौर्यं दुर्घटनाशल्यक्रियारक्षां भूमिविवादनिवारणं विवाहार्थं मङ्गलदोषशान्तिं रक्तस्वास्थ्यसुधारं भ्रातृसामञ्जस्यं च प्रददाति।',
  },
};

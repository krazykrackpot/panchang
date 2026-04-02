import type { PujaVidhi } from '../types';

export const SURYA_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-surya',
  category: 'graha_shanti',
  deity: { en: 'Surya (Sun God)', hi: 'सूर्य देव', sa: 'सूर्यदेवः' },

  samagri: [
    { name: { en: 'Wheat grains', hi: 'गेहूँ', sa: 'गोधूमाः' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'Jaggery (gur)', hi: 'गुड़', sa: 'गुडम्' }, quantity: '250 g', essential: true, category: 'food' },
    { name: { en: 'Copper vessel (lota)', hi: 'ताँबे का लोटा', sa: 'ताम्रपात्रम्' }, essential: true, category: 'vessels' },
    { name: { en: 'Red flowers (lotus / hibiscus)', hi: 'लाल फूल (कमल / गुड़हल)', sa: 'रक्तपुष्पाणि (पद्मम् / जपाकुसुमम्)' }, essential: true, category: 'flowers' },
    { name: { en: 'Red sandalwood (raktachandan)', hi: 'लाल चन्दन (रक्तचन्दन)', sa: 'रक्तचन्दनम्' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Red cloth', hi: 'लाल वस्त्र', sa: 'रक्तवस्त्रम्' }, category: 'clothing' },
    { name: { en: 'Dhoop / Incense', hi: 'धूप / अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Surya Shanti puja is performed on Sunday during the early morning hours, ideally within the first hour after sunrise. The Madhyahna (solar noon) period is also auspicious.',
    hi: 'सूर्य शान्ति पूजा रविवार को प्रातःकाल, सूर्योदय के पहले घण्टे में करनी चाहिए। मध्याह्न काल भी शुभ है।',
    sa: 'सूर्यशान्तिपूजा रविवासरे प्रातःकाले सूर्योदयात् प्रथमघण्टायाम् कर्तव्या। मध्याह्नकालोऽपि शुभः।',
  },

  sankalpa: {
    en: 'On this sacred Sunday, I perform Surya Graha Shanti puja to pacify the Sun and seek His blessings for health, authority, vitality, and spiritual illumination.',
    hi: 'इस पवित्र रविवार को, मैं स्वास्थ्य, अधिकार, ओज और आध्यात्मिक प्रकाश की प्राप्ति हेतु सूर्य ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्ररविवासरे आरोग्याधिकारतेजसाम् आध्यात्मिकप्रकाशस्य च प्राप्त्यर्थं सूर्यग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Rise before sunrise. Bathe and wear clean red or saffron-coloured clothes. Face the east in preparation for the puja.',
        hi: 'सूर्योदय से पहले उठें। स्नान करके स्वच्छ लाल या केसरिया वस्त्र पहनें। पूजा के लिए पूर्व दिशा की ओर मुख करें।',
        sa: 'सूर्योदयात् प्राक् उत्तिष्ठेत्। स्नात्वा शुचिरक्तकाषायवस्त्राणि धारयेत्। पूजार्थं प्राङ्मुखम् उपविशेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water mixed with red sandalwood and flowers in the right palm. State your name, gotra, and the intention to pacify Surya graha for removal of afflictions.',
        hi: 'दाहिने हाथ में रक्तचन्दन व पुष्प मिश्रित जल लें। अपना नाम, गोत्र और सूर्य ग्रह दोष निवारण हेतु पूजा का संकल्प करें।',
        sa: 'दक्षिणहस्ते रक्तचन्दनपुष्पमिश्रितजलं गृहीत्वा स्वनाम गोत्रं सूर्यग्रहदोषनिवारणार्थं पूजासङ्कल्पं वदेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Fill the copper vessel with water, add red sandalwood paste and red flowers. Place it on a bed of wheat grains. This represents Surya\'s energy.',
        hi: 'ताँबे के पात्र में जल भरें, रक्तचन्दन और लाल फूल डालें। गेहूँ के बिछौने पर रखें। यह सूर्य की ऊर्जा का प्रतीक है।',
        sa: 'ताम्रपात्रं जलेन पूरयेत्, रक्तचन्दनं रक्तपुष्पाणि च क्षिपेत्। गोधूमोपरि स्थापयेत्। एतत् सूर्यतेजसः प्रतीकम्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Surya Avahana (Invocation)', hi: 'सूर्य आवाहन', sa: 'सूर्यावाहनम्' },
      description: {
        en: 'Invoke Surya Deva by offering red flowers and lighting the ghee lamp. Recite "Om Suryaya Namah" and welcome the Sun God into the puja.',
        hi: 'लाल फूल अर्पित कर और घी का दीपक जलाकर सूर्य देव का आवाहन करें। "ॐ सूर्याय नमः" का उच्चारण करें।',
        sa: 'रक्तपुष्पाणि अर्पयित्वा घृतदीपं प्रज्वाल्य सूर्यदेवम् आवाहयेत्। "ओं सूर्याय नमः" इति उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Surya Beej Mantra Japa', hi: 'सूर्य बीज मन्त्र जप', sa: 'सूर्यबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Surya Beej Mantra 7,000 times (or 108 times minimum). Use a rudraksha or sphatik mala. Face east and meditate on a brilliant golden-red orb.',
        hi: 'सूर्य बीज मन्त्र 7,000 बार (या न्यूनतम 108 बार) जपें। रुद्राक्ष या स्फटिक माला का उपयोग करें। पूर्व की ओर मुख कर सुनहरे-लाल तेजोमय गोले का ध्यान करें।',
        sa: 'सूर्यबीजमन्त्रं सप्तसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। रुद्राक्षस्फटिकमालाम् उपयुञ्जीत। प्राङ्मुखं स्थित्वा सुवर्णरक्ततेजोगोलं ध्यायेत्।',
      },
      mantraRef: 'surya-beej',
      essential: true,
      stepType: 'mantra',
      duration: '45-60 min',
    },
    {
      step: 6,
      title: { en: 'Surya Arghya (Water Offering)', hi: 'सूर्य अर्घ्य', sa: 'सूर्यार्घ्यम्' },
      description: {
        en: 'Stand facing the rising sun. Pour water from the copper vessel in a continuous stream while chanting the Surya Gayatri. Offer three arghyas.',
        hi: 'उगते सूर्य की ओर मुख करके खड़े हों। सूर्य गायत्री का जाप करते हुए ताँबे के पात्र से निरन्तर धारा में जल अर्पित करें। तीन अर्घ्य दें।',
        sa: 'उदयन्तं सूर्यम् अभिमुखं तिष्ठेत्। सूर्यगायत्रीं जपन् ताम्रपात्रात् निरन्तरधारया जलम् अर्पयेत्। त्रीणि अर्घ्याणि दद्यात्।',
      },
      mantraRef: 'surya-gayatri',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate wheat and jaggery to the poor or to a Brahmin. Copper items may also be given. Charity on Sunday helps pacify Surya\'s negative influences.',
        hi: 'गेहूँ और गुड़ गरीबों या ब्राह्मण को दान करें। ताँबे की वस्तुएँ भी दी जा सकती हैं। रविवार के दान से सूर्य के अशुभ प्रभाव शान्त होते हैं।',
        sa: 'गोधूमान् गुडं च दरिद्रेभ्यः ब्राह्मणाय वा दद्यात्। ताम्रवस्तूनि अपि दातुं शक्यन्ते। रविवासरे दानं सूर्यस्य अशुभप्रभावं शमयति।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Conclude with a heartfelt prayer to Surya Deva for removal of planetary afflictions. Perform sashtanga namaskar. Distribute prasad to family members.',
        hi: 'सूर्य देव से ग्रह दोष निवारण की हार्दिक प्रार्थना करें। साष्टांग नमस्कार करें। परिवार को प्रसाद वितरित करें।',
        sa: 'सूर्यदेवं प्रति ग्रहदोषनिवारणार्थं हार्दिकीं प्रार्थनां कुर्यात्। साष्टाङ्गनमस्कारं कुर्यात्। कुटुम्बेभ्यः प्रसादं वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'surya-beej',
      name: { en: 'Surya Beej Mantra', hi: 'सूर्य बीज मन्त्र', sa: 'सूर्यबीजमन्त्रः' },
      devanagari: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
      iast: 'oṃ hrāṃ hrīṃ hrauṃ saḥ sūryāya namaḥ',
      meaning: {
        en: 'Salutations to the Sun God. The seed syllables invoke Surya\'s radiant energy for vitality, authority, and spiritual illumination.',
        hi: 'सूर्य देव को नमन। बीज अक्षर सूर्य की दीप्तिमान ऊर्जा का आवाहन ओज, अधिकार और आध्यात्मिक प्रकाश हेतु करते हैं।',
        sa: 'सूर्यदेवाय नमः। बीजाक्षराणि सूर्यस्य दीप्तिमतीम् ऊर्जां तेजसः अधिकारस्य आध्यात्मिकप्रकाशस्य च कृते आवाहयन्ति।',
      },
      japaCount: 7000,
      usage: {
        en: 'Chant 7,000 times for full Surya shanti; 108 times daily for ongoing remedy',
        hi: 'पूर्ण सूर्य शान्ति के लिए 7,000 बार जपें; दैनिक उपाय के लिए 108 बार',
        sa: 'पूर्णसूर्यशान्त्यर्थं सप्तसहस्रवारं जपेत्; नित्योपचारार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'surya-gayatri',
      name: { en: 'Surya Gayatri Mantra', hi: 'सूर्य गायत्री मन्त्र', sa: 'सूर्यगायत्रीमन्त्रः' },
      devanagari: 'ॐ भास्कराय विद्महे महाद्युतिकराय धीमहि ।\nतन्नो सूर्यः प्रचोदयात् ॥',
      iast: 'oṃ bhāskarāya vidmahe mahādyutikarāya dhīmahi |\ntanno sūryaḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the radiant Sun (Bhaskara), the source of great brilliance. May Surya illuminate our intellect and guide us on the right path.',
        hi: 'हम दीप्तिमान सूर्य (भास्कर) का ध्यान करते हैं, जो महान तेज के स्रोत हैं। सूर्य हमारी बुद्धि को प्रकाशित करें और सन्मार्ग दिखाएँ।',
        sa: 'दीप्तिमन्तं सूर्यं (भास्करम्) महाद्युतिकरं ध्यायामः। सूर्यः नः बुद्धिं प्रकाशयतु सन्मार्गं च प्रदर्शयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during Surya Arghya offering and as a daily prayer to the Sun',
        hi: 'सूर्य अर्घ्य के समय और दैनिक सूर्य प्रार्थना के रूप में जपें',
        sa: 'सूर्यार्घ्यसमये दैनिकसूर्यप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer wheat-based sweets (churma, halwa), jaggery, and fruits. Serve in a copper vessel if possible.',
    hi: 'गेहूँ से बने पकवान (चूरमा, हलवा), गुड़ और फल अर्पित करें। सम्भव हो तो ताँबे के पात्र में रखें।',
    sa: 'गोधूमनिर्मितमिष्टान्नानि (चूर्णमोदकम्, हल्वा), गुडं फलानि च अर्पयेत्। यदि शक्यं ताम्रपात्रे स्थापयेत्।',
  },

  precautions: [
    {
      en: 'Perform the puja facing east. The copper vessel and red flowers are essential — do not substitute with other metals or colours.',
      hi: 'पूजा पूर्व दिशा की ओर मुख करके करें। ताँबे का पात्र और लाल फूल आवश्यक हैं — अन्य धातु या रंग से न बदलें।',
      sa: 'प्राङ्मुखं पूजां कुर्यात्। ताम्रपात्रं रक्तपुष्पाणि च अनिवार्याणि — अन्यधातुभिः वर्णैः वा न प्रतिस्थापयेत्।',
    },
    {
      en: 'Avoid salt and oil in food on the day of Surya Shanti puja. A sattvic diet is recommended.',
      hi: 'सूर्य शान्ति पूजा के दिन भोजन में नमक और तेल से बचें। सात्विक आहार उचित है।',
      sa: 'सूर्यशान्तिपूजादिने भोजने लवणं तैलं च वर्जयेत्। सात्त्विकाहारः उचितः।',
    },
    {
      en: 'Do not look directly at the sun during arghya. Let the water stream catch the sunlight instead.',
      hi: 'अर्घ्य के समय सीधे सूर्य की ओर न देखें। जल की धारा को सूर्य का प्रकाश ग्रहण करने दें।',
      sa: 'अर्घ्यसमये प्रत्यक्षं सूर्यं न पश्येत्। जलधारा सूर्यप्रकाशं गृह्णातु इति कुर्यात्।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Sun. Bestows improved health, vitality, confidence, government favour, success in leadership roles, stronger eyesight, and relief from father-related difficulties.',
    hi: 'पीड़ित सूर्य को शान्त करता है। उत्तम स्वास्थ्य, ओज, आत्मविश्वास, सरकारी कृपा, नेतृत्व में सफलता, दृष्टि सुधार और पिता सम्बन्धी कठिनाइयों से राहत प्रदान करता है।',
    sa: 'पीडितसूर्यं शमयति। उत्तमारोग्यं तेजः आत्मविश्वासः राज्यानुग्रहः नेतृत्वे सफलता दृष्टिसुधारः पितृसम्बन्धकष्टनिवारणं च प्रददाति।',
  },
};

import type { PujaVidhi } from '../types';

export const BUDHA_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-budha',
  category: 'graha_shanti',
  deity: { en: 'Budha (Mercury)', hi: 'बुध देव', sa: 'बुधदेवः' },

  samagri: [
    { name: { en: 'Moong dal (split green gram)', hi: 'मूँग दाल', sa: 'मुद्गदालम्' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'Green cloth', hi: 'हरा वस्त्र', sa: 'हरितवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Bronze vessel', hi: 'काँसे का पात्र', sa: 'काँस्यपात्रम्' }, essential: true, category: 'vessels' },
    { name: { en: 'Green flowers (tulsi / green chrysanthemum)', hi: 'हरे फूल (तुलसी / हरा गुलदाउदी)', sa: 'हरितपुष्पाणि (तुलसी / हरितगुलदाउदी)' }, essential: true, category: 'flowers' },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Dhoop / Incense (sandalwood)', hi: 'धूप / अगरबत्ती (चन्दन)', sa: 'धूपम् (चन्दनम्)' }, category: 'puja_items' },
    { name: { en: 'Durva grass', hi: 'दूर्वा घास', sa: 'दूर्वा' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Budha Shanti puja is performed on Wednesday morning, ideally during the first three hours after sunrise. Budhawar (Wednesday) is Mercury\'s own day.',
    hi: 'बुध शान्ति पूजा बुधवार को प्रातःकाल, सूर्योदय के बाद पहले तीन घण्टों में करनी चाहिए। बुधवार बुध ग्रह का अपना दिन है।',
    sa: 'बुधशान्तिपूजा बुधवासरे प्रातःकाले सूर्योदयात् प्रथमत्रिघण्टासु कर्तव्या। बुधवासरः बुधग्रहस्य स्वदिनम्।',
  },

  sankalpa: {
    en: 'On this sacred Wednesday, I perform Budha Graha Shanti puja to pacify Mercury and seek blessings for intelligence, communication, business success, and academic excellence.',
    hi: 'इस पवित्र बुधवार को, मैं बुद्धि, वाक्पटुता, व्यापार सफलता और शैक्षणिक उत्कृष्टता हेतु बुध ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रबुधवासरे बुद्ध्यर्थं वाक्पटुतायै व्यापारसफलतायै शैक्षणिकोत्कर्षाय च बुधग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe in the morning and wear clean green clothes. Mercury governs intellect, so approach the puja with a calm, focused, and analytical mind.',
        hi: 'प्रातः स्नान करें और स्वच्छ हरे वस्त्र पहनें। बुध बुद्धि का स्वामी है, अतः शान्त, एकाग्र और विश्लेषणात्मक मन से पूजा करें।',
        sa: 'प्रातः स्नात्वा शुचिहरितवस्त्राणि धारयेत्। बुधः बुद्धेः स्वामी, अतः शान्तैकाग्रविश्लेषणात्मकमनसा पूजां कुर्यात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing north (Mercury\'s direction). Hold water with durva grass in the right palm. State your name, gotra, and intention to pacify Budha graha.',
        hi: 'उत्तर दिशा (बुध की दिशा) की ओर मुख कर बैठें। दाहिने हाथ में दूर्वा सहित जल लेकर बुध ग्रह शान्ति का संकल्प करें।',
        sa: 'उत्तरदिशम् (बुधदिशाम्) अभिमुखम् उपविशेत्। दक्षिणहस्ते दूर्वासहितजलं गृहीत्वा बुधग्रहशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Fill the bronze vessel with water and add durva grass and green flowers. Place on a bed of moong dal covered with green cloth.',
        hi: 'काँसे के पात्र में जल भरकर दूर्वा और हरे फूल डालें। हरे वस्त्र से ढके मूँग दाल के बिछौने पर रखें।',
        sa: 'काँस्यपात्रं जलेन पूर्य दूर्वां हरितपुष्पाणि च क्षिपेत्। हरितवस्त्रावृतमुद्गदालोपरि स्थापयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Budha Avahana (Invocation)', hi: 'बुध आवाहन', sa: 'बुधावाहनम्' },
      description: {
        en: 'Invoke Budha Deva by lighting the ghee lamp and camphor. Offer durva grass and green flowers. Recite "Om Budhaya Namah" three times.',
        hi: 'घी का दीपक और कपूर जलाकर बुध देव का आवाहन करें। दूर्वा और हरे फूल अर्पित करें। "ॐ बुधाय नमः" तीन बार बोलें।',
        sa: 'घृतदीपं कर्पूरं च प्रज्वाल्य बुधदेवम् आवाहयेत्। दूर्वां हरितपुष्पाणि च अर्पयेत्। "ओं बुधाय नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Budha Beej Mantra Japa', hi: 'बुध बीज मन्त्र जप', sa: 'बुधबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Budha Beej Mantra 9,000 times (or 108 times minimum). Use an emerald or tulsi mala. Meditate on a brilliant green orb representing Mercury\'s intellect.',
        hi: 'बुध बीज मन्त्र 9,000 बार (या न्यूनतम 108 बार) जपें। पन्ना या तुलसी माला का उपयोग करें। बुध की बुद्धि का प्रतीक चमकीले हरे गोले का ध्यान करें।',
        sa: 'बुधबीजमन्त्रं नवसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। मरकततुलसीमालाम् उपयुञ्जीत। बुधबुद्धिप्रतीकं दीप्तहरितगोलं ध्यायेत्।',
      },
      mantraRef: 'budha-beej',
      essential: true,
      stepType: 'mantra',
      duration: '50-60 min',
    },
    {
      step: 6,
      title: { en: 'Homa (Fire Offering) — Optional', hi: 'होम (हवन) — वैकल्पिक', sa: 'होमः — वैकल्पिकः' },
      description: {
        en: 'If possible, perform a small homa with sandalwood sticks and ghee. Offer moong dal and durva grass into the fire while chanting the Budha Gayatri.',
        hi: 'यदि सम्भव हो तो चन्दन की लकड़ी और घी से लघु होम करें। बुध गायत्री का जाप करते हुए मूँग दाल और दूर्वा की आहुति दें।',
        sa: 'यदि शक्यं चन्दनकाष्ठैः घृतेन च लघुहोमं कुर्यात्। बुधगायत्रीं जपन् मुद्गदालं दूर्वां च अग्नौ आहुतिं दद्यात्।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate moong dal and green cloth to the needy. Supporting education — donating books, stationery, or school fees — is the most powerful Mercury remedy.',
        hi: 'ज़रूरतमन्दों को मूँग दाल और हरा वस्त्र दान करें। शिक्षा का सहयोग — पुस्तकें, स्टेशनरी या विद्यालय शुल्क दान — सबसे प्रभावशाली बुध उपाय है।',
        sa: 'दीनेभ्यः मुद्गदालं हरितवस्त्रं च दद्यात्। शिक्षासहयोगः — पुस्तकलेखनसामग्रीविद्यालयशुल्कदानम् — सर्वाधिकप्रभावशालि बुधोपचारः।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Budha Deva and Lord Vishnu (Mercury\'s presiding deity) for sharp intellect and eloquent speech. Perform namaskar and distribute prasad.',
        hi: 'तीक्ष्ण बुद्धि और वाक्पटुता हेतु बुध देव और भगवान विष्णु (बुध के अधिष्ठाता देवता) से प्रार्थना करें। नमस्कार करें और प्रसाद वितरित करें।',
        sa: 'तीक्ष्णबुद्ध्यर्थं वाक्पटुतायै च बुधदेवं विष्णुं (बुधस्य अधिष्ठातृदेवताम्) च प्रार्थयेत्। नमस्कारं कुर्यात् प्रसादं च वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'budha-beej',
      name: { en: 'Budha Beej Mantra', hi: 'बुध बीज मन्त्र', sa: 'बुधबीजमन्त्रः' },
      devanagari: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
      iast: 'oṃ brāṃ brīṃ brauṃ saḥ budhāya namaḥ',
      meaning: {
        en: 'Salutations to Mercury. The seed syllables invoke Budha\'s intellectual energy for sharpened mind, communication skills, and business acumen.',
        hi: 'बुध को नमन। बीज अक्षर बुध की बौद्धिक ऊर्जा का आवाहन तीक्ष्ण बुद्धि, संवाद कौशल और व्यापारिक कुशलता हेतु करते हैं।',
        sa: 'बुधाय नमः। बीजाक्षराणि बुधस्य बौद्धिकऊर्जां तीक्ष्णबुद्ध्यर्थं सम्भाषणकौशलाय वाणिज्यनिपुणतायै च आवाहयन्ति।',
      },
      japaCount: 9000,
      usage: {
        en: 'Chant 9,000 times for full Budha shanti; 108 times daily for ongoing remedy',
        hi: 'पूर्ण बुध शान्ति के लिए 9,000 बार जपें; दैनिक उपाय के लिए 108 बार',
        sa: 'पूर्णबुधशान्त्यर्थं नवसहस्रवारं जपेत्; नित्योपचारार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'budha-gayatri',
      name: { en: 'Budha Gayatri Mantra', hi: 'बुध गायत्री मन्त्र', sa: 'बुधगायत्रीमन्त्रः' },
      devanagari: 'ॐ गजध्वजाय विद्महे प्रियगुणाय धीमहि ।\nतन्नो बुधः प्रचोदयात् ॥',
      iast: 'oṃ gajadhvajāya vidmahe priyaguṇāya dhīmahi |\ntanno budhaḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the one with the elephant banner (Budha), endowed with pleasing qualities. May Mercury stimulate our intellect and learning.',
        hi: 'हम गजध्वज (बुध) का ध्यान करते हैं, जो प्रिय गुणों से सम्पन्न हैं। बुध हमारी बुद्धि और विद्या को प्रेरित करें।',
        sa: 'गजध्वजं (बुधम्) प्रियगुणसम्पन्नं ध्यायामः। बुधः नः बुद्धिं विद्यां च प्रेरयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during homa and as a daily prayer on Wednesdays for intellectual growth',
        hi: 'होम के समय और बुधवार को बौद्धिक विकास हेतु दैनिक प्रार्थना के रूप में जपें',
        sa: 'होमसमये बुधवासरे बौद्धिकवृद्ध्यर्थं दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer moong dal preparations (khichdi, halwa), green fruits, and sweets. Serve in a bronze vessel.',
    hi: 'मूँग दाल से बने पकवान (खिचड़ी, हलवा), हरे फल और मिठाई अर्पित करें। काँसे के पात्र में रखें।',
    sa: 'मुद्गदालनिर्मितपक्वान्नानि (खिचडी, हल्वा) हरितफलानि मिष्टान्नानि च अर्पयेत्। काँस्यपात्रे स्थापयेत्।',
  },

  precautions: [
    {
      en: 'Face north during the puja. Green is the essential colour — clothes, flowers, and cloth should all be green.',
      hi: 'पूजा में उत्तर दिशा की ओर मुख करें। हरा रंग आवश्यक है — वस्त्र, फूल और कपड़ा सभी हरे होने चाहिए।',
      sa: 'पूजायाम् उत्तरदिशम् अभिमुखं कुर्यात्। हरितवर्णः अनिवार्यः — वस्त्राणि पुष्पाणि वस्त्रं च सर्वाणि हरितानि भवेयुः।',
    },
    {
      en: 'Avoid lying and deceitful speech on the puja day. Mercury governs truthful communication.',
      hi: 'पूजा के दिन झूठ और छलपूर्ण वाणी से बचें। बुध सत्य संवाद का स्वामी है।',
      sa: 'पूजादिने मिथ्यावचनं छलवाणीं च वर्जयेत्। बुधः सत्यसम्भाषणस्य स्वामी।',
    },
    {
      en: 'Studying or reading sacred texts on Wednesday enhances Mercury\'s positive influence.',
      hi: 'बुधवार को अध्ययन या पवित्र ग्रन्थों का पाठन बुध के शुभ प्रभाव को बढ़ाता है।',
      sa: 'बुधवासरे अध्ययनं पवित्रग्रन्थपठनं वा बुधस्य शुभप्रभावं वर्धयति।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Mercury. Bestows sharp intellect, eloquent speech, success in business and trade, academic excellence, improved skin health, and relief from nervous disorders.',
    hi: 'पीड़ित बुध को शान्त करता है। तीक्ष्ण बुद्धि, वाक्पटुता, व्यापार में सफलता, शैक्षणिक उत्कृष्टता, त्वचा स्वास्थ्य सुधार और तन्त्रिका विकारों से राहत प्रदान करता है।',
    sa: 'पीडितबुधं शमयति। तीक्ष्णबुद्धिं वाक्पटुतां वाणिज्यसफलतां शैक्षणिकोत्कर्षं त्वग्स्वास्थ्यसुधारं तन्त्रिकाविकारनिवारणं च प्रददाति।',
  },
};

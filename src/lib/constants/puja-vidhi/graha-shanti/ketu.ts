import type { PujaVidhi } from '../types';

export const KETU_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-ketu',
  category: 'graha_shanti',
  deity: { en: 'Ketu (South Node)', hi: 'केतु', sa: 'केतुः' },

  samagri: [
    { name: { en: 'Kusha grass (darbha)', hi: 'कुशा घास (दर्भ)', sa: 'कुशतृणम् (दर्भः)' }, essential: true, category: 'puja_items' },
    { name: { en: 'Seven mixed grains (sapta dhanya)', hi: 'सात अनाज (सप्त धान्य)', sa: 'सप्तधान्यम्' }, quantity: '500 g each', essential: true, category: 'food',
      note: { en: 'Wheat, rice, moong, chana, urad, masoor, sesame', hi: 'गेहूँ, चावल, मूँग, चना, उड़द, मसूर, तिल', sa: 'गोधूमः, तण्डुलाः, मुद्गः, चणकः, माषः, मसूरः, तिलाः' } },
    { name: { en: 'Grey / brown cloth', hi: 'धूसर / भूरा वस्त्र', sa: 'धूसरभूरवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Blanket (for daan)', hi: 'कम्बल (दान के लिए)', sa: 'कम्बलम् (दानार्थम्)' }, category: 'clothing' },
    { name: { en: 'Sesame (black)', hi: 'काले तिल', sa: 'कृष्णतिलाः' }, quantity: '250 g', category: 'food' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Mixed coloured flowers', hi: 'मिश्रित रंगों के फूल', sa: 'मिश्रितवर्णपुष्पाणि' }, category: 'flowers' },
    { name: { en: 'Dhoop / Incense (camphor-based)', hi: 'धूप / अगरबत्ती (कपूर-आधारित)', sa: 'धूपम् (कर्पूराधारितम्)' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Ketu Shanti puja is performed on Tuesday night after sunset, or during Rahu Kalam. Tuesday night and Amavasya (new moon) are most potent for Ketu remedies.',
    hi: 'केतु शान्ति पूजा मंगलवार रात्रि सूर्यास्त के बाद या राहु काल में करनी चाहिए। मंगलवार रात्रि और अमावस्या केतु उपचार के लिए सर्वाधिक प्रभावी हैं।',
    sa: 'केतुशान्तिपूजा मङ्गलवासररात्रौ सूर्यास्तानन्तरं राहुकाले वा कर्तव्या। मङ्गलवासररात्रिः अमावास्या च केत्वूपचाराय सर्वाधिकप्रभावशालिन्यौ।',
  },

  sankalpa: {
    en: 'On this sacred night, I perform Ketu Graha Shanti puja to pacify Ketu and seek blessings for spiritual liberation, relief from mysterious ailments, and past-life karmic resolution.',
    hi: 'इस पवित्र रात्रि को, मैं आध्यात्मिक मुक्ति, रहस्यमय रोगों से राहत और पूर्वजन्म कर्म निवारण हेतु केतु ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्ररात्रौ आध्यात्मिकमोक्षाय रहस्यरोगनिवारणाय पूर्वजन्मकर्मनिवारणाय च केतुग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe in the evening. Add kusha grass to the bathing water for purification. Wear clean grey, brown, or muted-coloured clothes. Ketu favours renunciation and simplicity.',
        hi: 'सायं स्नान करें। शुद्धि के लिए स्नान के जल में कुशा घास डालें। स्वच्छ धूसर, भूरे या मन्द रंग के वस्त्र पहनें। केतु वैराग्य और सादगी को पसन्द करता है।',
        sa: 'सायं स्नानं कुर्यात्। शुद्ध्यर्थं स्नानजले कुशतृणं क्षिपेत्। शुचिधूसरभूरमन्दवर्णवस्त्राणि धारयेत्। केतुः वैराग्यं सादगीं च प्रीणयति।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing south. Hold water with kusha grass in the right palm. State your name, gotra, and intention to pacify Ketu for spiritual growth and karmic relief.',
        hi: 'दक्षिण दिशा की ओर मुख कर बैठें। दाहिने हाथ में कुशा सहित जल लेकर आध्यात्मिक विकास और कर्म निवारण हेतु केतु शान्ति का संकल्प करें।',
        sa: 'दक्षिणदिशम् अभिमुखम् उपविशेत्। दक्षिणहस्ते कुशसहितजलं गृहीत्वा आध्यात्मिकविकासकर्मनिवारणार्थं केतुशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Place a vessel filled with water on a bed of seven mixed grains. Add kusha grass and sesame. Wrap kusha grass around the vessel neck. Cover with grey cloth.',
        hi: 'जल से भरे पात्र को सात अनाजों के बिछौने पर रखें। कुशा और तिल डालें। पात्र के गले में कुशा लपेटें। धूसर वस्त्र से ढकें।',
        sa: 'जलपूर्णपात्रं सप्तधान्योपरि स्थापयेत्। कुशं तिलांश्च क्षिपेत्। पात्रग्रीवायां कुशं वेष्टयेत्। धूसरवस्त्रेण आवृणुयात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Ketu Avahana (Invocation)', hi: 'केतु आवाहन', sa: 'केत्वावाहनम्' },
      description: {
        en: 'Invoke Ketu by lighting the ghee lamp and offering kusha grass and mixed-coloured flowers. Recite "Om Ketave Namah" three times.',
        hi: 'घी का दीपक जलाकर कुशा और मिश्रित रंगों के फूल अर्पित कर केतु का आवाहन करें। "ॐ केतवे नमः" तीन बार बोलें।',
        sa: 'घृतदीपं प्रज्वाल्य कुशं मिश्रितवर्णपुष्पाणि च अर्पयित्वा केतुम् आवाहयेत्। "ओं केतवे नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Ketu Beej Mantra Japa', hi: 'केतु बीज मन्त्र जप', sa: 'केतुबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Ketu Beej Mantra 17,000 times (or 108 times minimum). Use a cat\'s eye (lahsuniya) or rudraksha mala. Meditate on a smoky, tail-like flame dissolving into light.',
        hi: 'केतु बीज मन्त्र 17,000 बार (या न्यूनतम 108 बार) जपें। लहसुनिया (वैदूर्य) या रुद्राक्ष माला का उपयोग करें। धूम्रवर्ण ज्वाला-पुच्छ के प्रकाश में विलीन होने का ध्यान करें।',
        sa: 'केतुबीजमन्त्रं सप्तदशसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। वैदूर्यरुद्राक्षमालाम् उपयुञ्जीत। धूम्रवर्णज्वालापुच्छस्य प्रकाशे विलीनतां ध्यायेत्।',
      },
      mantraRef: 'ketu-beej',
      essential: true,
      stepType: 'mantra',
      duration: '90-120 min',
    },
    {
      step: 6,
      title: { en: 'Homa (Fire Offering) — Optional', hi: 'होम (हवन) — वैकल्पिक', sa: 'होमः — वैकल्पिकः' },
      description: {
        en: 'If possible, perform a small homa with kusha grass and ghee. Offer seven grains and sesame into the fire while chanting the Ketu Gayatri. Ketu is purified through fire.',
        hi: 'यदि सम्भव हो तो कुशा और घी से लघु होम करें। केतु गायत्री जपते हुए सात अनाज और तिल की आहुति दें। केतु अग्नि से शुद्ध होता है।',
        sa: 'यदि शक्यं कुशेन घृतेन च लघुहोमं कुर्यात्। केतुगायत्रीं जपन् सप्तधान्यं तिलान् च अग्नौ आहुतिं दद्यात्। केतुः अग्निना शुध्यति।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate a blanket and seven mixed grains to the needy. Feed dogs (Ketu\'s associated animal). Support spiritual institutions, monasteries, or renunciates.',
        hi: 'ज़रूरतमन्दों को कम्बल और सात अनाज दान करें। कुत्तों (केतु का सम्बद्ध पशु) को भोजन दें। आध्यात्मिक संस्थाओं, मठों या संन्यासियों की सहायता करें।',
        sa: 'दीनेभ्यः कम्बलं सप्तधान्यं च दद्यात्। शुनकेभ्यः (केतोः सम्बद्धपशवे) भोजनं दद्यात्। आध्यात्मिकसंस्थाः मठान् संन्यासिनः वा सहायेत।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Ketu and Lord Ganesha (Ketu\'s presiding deity) for spiritual liberation, removal of obstacles, and past-life karmic resolution. Perform namaskar.',
        hi: 'आध्यात्मिक मुक्ति, विघ्न निवारण और पूर्वजन्म कर्म निवारण हेतु केतु और भगवान गणेश (केतु के अधिष्ठाता देवता) से प्रार्थना करें। नमस्कार करें।',
        sa: 'आध्यात्मिकमोक्षाय विघ्ननिवारणाय पूर्वजन्मकर्मनिवारणाय च केतुं गणेशं (केतोः अधिष्ठातृदेवताम्) च प्रार्थयेत्। नमस्कारं कुर्यात्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'ketu-beej',
      name: { en: 'Ketu Beej Mantra', hi: 'केतु बीज मन्त्र', sa: 'केतुबीजमन्त्रः' },
      devanagari: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
      iast: 'oṃ srāṃ srīṃ srauṃ saḥ ketave namaḥ',
      meaning: {
        en: 'Salutations to Ketu (the shadow tail). The seed syllables invoke Ketu\'s liberating energy for moksha, past-life karmic release, and spiritual insight.',
        hi: 'केतु (छाया पुच्छ) को नमन। बीज अक्षर केतु की मुक्तिदायिनी ऊर्जा का आवाहन मोक्ष, पूर्वजन्म कर्म मुक्ति और आध्यात्मिक अन्तर्दृष्टि हेतु करते हैं।',
        sa: 'केतवे (छायापुच्छाय) नमः। बीजाक्षराणि केतोः मुक्तिदायिनीम् ऊर्जां मोक्षाय पूर्वजन्मकर्ममुक्तये आध्यात्मिकान्तर्दृष्ट्यर्थं च आवाहयन्ति।',
      },
      japaCount: 17000,
      usage: {
        en: 'Chant 17,000 times for full Ketu shanti; 108 times daily for spiritual growth and karmic remedy',
        hi: 'पूर्ण केतु शान्ति के लिए 17,000 बार जपें; आध्यात्मिक विकास और कर्म उपचार के लिए दैनिक 108 बार',
        sa: 'पूर्णकेतुशान्त्यर्थं सप्तदशसहस्रवारं जपेत्; आध्यात्मिकविकासकर्मोपचारार्थं नित्यम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'ketu-gayatri',
      name: { en: 'Ketu Gayatri Mantra', hi: 'केतु गायत्री मन्त्र', sa: 'केतुगायत्रीमन्त्रः' },
      devanagari: 'ॐ अश्वध्वजाय विद्महे शूलहस्ताय धीमहि ।\nतन्नो केतुः प्रचोदयात् ॥',
      iast: 'oṃ aśvadhvajāya vidmahe śūlahastāya dhīmahi |\ntanno ketuḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the one with the horse banner (Ketu), who holds a trident. May Ketu inspire spiritual liberation and detachment in us.',
        hi: 'हम अश्वध्वज (केतु) का ध्यान करते हैं, जो त्रिशूल धारण करते हैं। केतु हमें आध्यात्मिक मुक्ति और वैराग्य की प्रेरणा दें।',
        sa: 'अश्वध्वजं (केतुम्) शूलहस्तं ध्यायामः। केतुः नः आध्यात्मिकमोक्षं वैराग्यं च प्रेरयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during homa and as a daily prayer for spiritual growth',
        hi: 'होम के समय और आध्यात्मिक विकास हेतु दैनिक प्रार्थना के रूप में जपें',
        sa: 'होमसमये आध्यात्मिकविकासार्थं दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer seven-grain mixture preparations, sesame sweets, and mixed fruits. Simplicity in offering reflects Ketu\'s ascetic nature.',
    hi: 'सात अनाज के मिश्रण से बने पकवान, तिल की मिठाई और मिश्रित फल अर्पित करें। अर्पण में सादगी केतु की संन्यासी प्रकृति को दर्शाती है।',
    sa: 'सप्तधान्यमिश्रणनिर्मितपक्वान्नानि तिलमिष्टान्नानि मिश्रितफलानि च अर्पयेत्। अर्पणे सादगी केतोः संन्यासिप्रकृतिं दर्शयति।',
  },

  precautions: [
    {
      en: 'Perform the puja after sunset facing south. Ketu is a headless shadow planet — night worship and meditative practice are most effective.',
      hi: 'पूजा सूर्यास्त के बाद दक्षिण दिशा की ओर मुख कर करें। केतु शिरहीन छाया ग्रह है — रात्रि पूजा और ध्यान साधना सर्वाधिक प्रभावी हैं।',
      sa: 'सूर्यास्तानन्तरं दक्षिणदिशम् अभिमुखं पूजां कुर्यात्। केतुः शिरहीनछायाग्रहः — रात्रिपूजा ध्यानसाधना च सर्वाधिकप्रभावशालिन्यौ।',
    },
    {
      en: 'Ketu favours detachment. On puja day, practice simplicity — avoid luxury, excess, and material obsession.',
      hi: 'केतु वैराग्य को पसन्द करता है। पूजा के दिन सादगी का पालन करें — विलासिता, अति और भौतिक आसक्ति से बचें।',
      sa: 'केतुः वैराग्यं प्रीणयति। पूजादिने सादगीं पालयेत् — विलासम् अतिरेकं भौतिकासक्तिं च वर्जयेत्।',
    },
    {
      en: 'Feeding stray dogs on Tuesday is a powerful and simple daily Ketu remedy.',
      hi: 'मंगलवार को आवारा कुत्तों को भोजन देना शक्तिशाली और सरल दैनिक केतु उपाय है।',
      sa: 'मङ्गलवासरे पथिशुनकेभ्यः भोजनदानं शक्तिशालः सरलश्च दैनिककेत्वुपचारः।',
    },
    {
      en: 'Meditation and yoga practices enhance Ketu shanti more than any ritual. Ketu is the planet of moksha.',
      hi: 'ध्यान और योग साधना किसी भी अनुष्ठान से अधिक केतु शान्ति को बढ़ाती है। केतु मोक्ष का ग्रह है।',
      sa: 'ध्यानयोगसाधना कस्मादपि अनुष्ठानात् अधिकं केतुशान्तिं वर्धयतः। केतुः मोक्षस्य ग्रहः।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Ketu. Bestows spiritual liberation (moksha), relief from mysterious ailments, past-life karmic resolution, psychic protection, meditative depth, and freedom from ghostly disturbances.',
    hi: 'पीड़ित केतु को शान्त करता है। आध्यात्मिक मुक्ति (मोक्ष), रहस्यमय रोगों से राहत, पूर्वजन्म कर्म निवारण, मानसिक सुरक्षा, ध्यान की गहराई और भूत-प्रेत बाधाओं से मुक्ति प्रदान करता है।',
    sa: 'पीडितकेतुं शमयति। आध्यात्मिकमोक्षं रहस्यरोगनिवारणं पूर्वजन्मकर्मनिवारणं मानसिकसुरक्षां ध्यानगाम्भीर्यं भूतप्रेतबाधामुक्तिं च प्रददाति।',
  },
};

import type { PujaVidhi } from './types';

export const SOMVAR_VRAT_PUJA: PujaVidhi = {
  festivalSlug: 'somvar-vrat',
  category: 'vrat',
  deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'शिवः' },

  samagri: [
    { name: { en: 'Bilva / Bel leaves', hi: 'बिल्व / बेल पत्र', sa: 'बिल्वपत्राणि' }, essential: true },
    { name: { en: 'Milk (for abhisheka)', hi: 'दूध (अभिषेक के लिए)', sa: 'क्षीरम् (अभिषेकार्थम्)' }, essential: true },
    { name: { en: 'White flowers', hi: 'सफ़ेद फूल', sa: 'श्वेतपुष्पाणि' } },
    { name: { en: 'Dhoop / Incense', hi: 'धूप / अगरबत्ती', sa: 'धूपम्' } },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' } },
    { name: { en: 'Fruits (for naivedya)', hi: 'फल (नैवेद्य के लिए)', sa: 'फलानि (नैवेद्यार्थम्)' } },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Somvar Vrat puja is ideally performed during Pradosh Kala (evening twilight) on Monday. The period from sunset to approximately 2.5 hours after sunset is most auspicious for Shiva worship on this day.',
    hi: 'सोमवार व्रत पूजा प्रदोष काल (सन्ध्या समय) में करना सर्वोत्तम है। सूर्यास्त से लगभग ढाई घण्टे बाद तक का समय इस दिन शिव पूजा के लिए सबसे शुभ है।',
    sa: 'सोमवारव्रतपूजा प्रदोषकाले (सन्ध्याकाले) कर्तव्या। सूर्यास्तात् प्रायः सार्धद्विघण्टापर्यन्तं कालः अस्मिन् दिने शिवपूजायै श्रेष्ठतमः।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Monday, I observe Somvar Vrat and worship Lord Shiva with devotion for marital harmony, Shiva\'s grace, and spiritual growth.',
    hi: 'इस पवित्र सोमवार को, मैं वैवाहिक सामंजस्य, शिव कृपा और आध्यात्मिक उन्नति के लिए भक्तिपूर्वक सोमवार व्रत और शिव पूजन का संकल्प करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रसोमवासरे वैवाहिकसामञ्जस्याय शिवकृपायै आध्यात्मिकवृद्ध्यर्थं च भक्त्या सोमवारव्रतं शिवपूजनं च करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Take a bath in the evening before puja. Wear clean white or light-colored clothes. Maintain a sattvic and devotional mindset throughout the day.',
        hi: 'पूजा से पहले सायं स्नान करें। स्वच्छ सफ़ेद या हल्के रंग के वस्त्र पहनें। दिन भर सात्विक और भक्तिपूर्ण मनःस्थिति बनाए रखें।',
        sa: 'पूजायाः प्राक् सायं स्नानं कुर्यात्। शुचिश्वेतवस्त्राणि मन्दवर्णवस्त्राणि वा धारयेत्। दिनं यावत् सात्त्विकभक्तिमयमानसं पालयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit before the Shiva Linga or image. Hold water in the right palm and formally resolve to observe the Somvar Vrat. State your name, gotra, and purpose.',
        hi: 'शिवलिंग या मूर्ति के सामने बैठें। दाहिने हाथ में जल लेकर सोमवार व्रत का विधिवत् संकल्प लें। अपना नाम, गोत्र और उद्देश्य बोलें।',
        sa: 'शिवलिङ्गस्य मूर्तेः वा पुरतः उपविशेत्। दक्षिणहस्ते जलं गृहीत्वा सोमवारव्रतस्य विधिवत् सङ्कल्पं कुर्यात्। स्वनाम गोत्रं प्रयोजनं च वदेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Abhisheka (Milk & Water Offering)', hi: 'अभिषेक (दूध और जल अर्पण)', sa: 'अभिषेकः (क्षीरजलार्पणम्)' },
      description: {
        en: 'Pour milk slowly over the Shiva Linga while chanting "Om Namah Shivaya." Follow with clean water. The stream should be continuous and gentle.',
        hi: '"ॐ नमः शिवाय" का जाप करते हुए शिवलिंग पर धीरे-धीरे दूध चढ़ाएँ। उसके बाद स्वच्छ जल अर्पित करें। धारा निरन्तर और मन्द होनी चाहिए।',
        sa: '"ओं नमः शिवाय" इति जपन् शिवलिङ्गोपरि शनैः क्षीरं सिञ्चेत्। ततः शुद्धजलम् अर्पयेत्। धारा निरन्तरा मन्दा च भवेत्।',
      },
      mantraRef: 'panchakshari-somvar',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Bilva & Flower Offering', hi: 'बिल्व एवं पुष्प अर्पण', sa: 'बिल्वपुष्पार्पणम्' },
      description: {
        en: 'Offer bilva leaves (smooth side up) and white flowers on the Shiva Linga. Light dhoop/incense and the ghee lamp. Circumambulate the Linga three times if possible.',
        hi: 'शिवलिंग पर बिल्व पत्र (चिकनी सतह ऊपर) और सफ़ेद फूल चढ़ाएँ। धूप/अगरबत्ती और घी का दीपक जलाएँ। यदि सम्भव हो तो लिंग की तीन बार परिक्रमा करें।',
        sa: 'शिवलिङ्गोपरि बिल्वपत्राणि (श्लक्ष्णपार्श्वम् उपरि) श्वेतपुष्पाणि च अर्पयेत्। धूपं घृतदीपं च प्रज्वालयेत्। यदि शक्यं लिङ्गं त्रिवारं प्रदक्षिणं कुर्यात्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Panchakshari Japa (108 times)', hi: 'पञ्चाक्षरी जप (108 बार)', sa: 'पञ्चाक्षरीजपः (अष्टोत्तरशतवारम्)' },
      description: {
        en: 'Chant "Om Namah Shivaya" 108 times using a Rudraksha mala or counting on fingers. Sit quietly with eyes closed, focused on Lord Shiva in your heart.',
        hi: 'रुद्राक्ष माला या उँगलियों पर गिनते हुए "ॐ नमः शिवाय" 108 बार जपें। आँखें बन्द कर शान्त बैठें, हृदय में शिव पर ध्यान केन्द्रित करें।',
        sa: 'रुद्राक्षमालया अङ्गुलिगणनया वा "ओं नमः शिवाय" इति अष्टोत्तरशतवारं जपेत्। नेत्रे निमील्य शान्तम् उपविश्य हृदये शिवं ध्यायेत्।',
      },
      mantraRef: 'panchakshari-somvar',
      essential: true,
      stepType: 'mantra',
      duration: '15 min',
    },
    {
      step: 6,
      title: { en: 'Aarti & Conclusion', hi: 'आरती एवं समापन', sa: 'आरती समापनं च' },
      description: {
        en: 'Perform aarti with a ghee lamp, circling clockwise before the Shiva Linga. Offer fruits as naivedya. Conclude with sashtanga namaskar (full prostration) and pray for Shiva\'s blessings.',
        hi: 'शिवलिंग के सामने घी के दीपक से दक्षिणावर्त आरती करें। फल नैवेद्य के रूप में अर्पित करें। साष्टांग नमस्कार करके शिव की कृपा के लिए प्रार्थना करें।',
        sa: 'शिवलिङ्गस्य पुरतः घृतदीपेन दक्षिणावर्तम् आरतिं कुर्यात्। फलानि नैवेद्यरूपेण अर्पयेत्। साष्टाङ्गनमस्कारं कृत्वा शिवकृपायै प्रार्थयेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'panchakshari-somvar',
      name: { en: 'Panchakshari Mantra', hi: 'पञ्चाक्षरी मन्त्र', sa: 'पञ्चाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमः शिवाय',
      iast: 'oṃ namaḥ śivāya',
      meaning: {
        en: 'Om, I bow to Lord Shiva. The five sacred syllables represent the five elements and Shiva\'s supreme lordship over them.',
        hi: 'ॐ, शिव को नमन। पाँच पवित्र अक्षर पंचतत्व और उन पर शिव के सर्वोच्च अधिपत्य का प्रतीक हैं।',
        sa: 'ओम्, शिवाय नमः। पञ्च पवित्राक्षराणि पञ्चतत्त्वानां तेषु शिवस्य सर्वोच्चाधिपत्यस्य च प्रतीकानि।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during Somvar puja — the most essential practice',
        hi: 'सोमवार पूजा में 108 बार जपें — सबसे मुख्य साधना',
        sa: 'सोमवारपूजायाम् अष्टोत्तरशतवारं जपेत् — मुख्यतमा साधना',
      },
    },
    {
      id: 'maha-mrityunjaya-somvar',
      name: { en: 'Maha Mrityunjaya Mantra', hi: 'महामृत्युञ्जय मन्त्र', sa: 'महामृत्युञ्जयमन्त्रः' },
      devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात् ॥',
      iast: 'oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam |\nurvārukamiva bandhanān mṛtyormukṣīya mā\'mṛtāt ||',
      meaning: {
        en: 'Om, we worship the three-eyed Lord (Shiva), who is fragrant and nourishes all beings. May He liberate us from death as a cucumber is freed from its vine — may we not be cut off from immortality.',
        hi: 'ॐ, हम त्रिनेत्र भगवान (शिव) की पूजा करते हैं जो सुगन्धित हैं और सभी प्राणियों का पोषण करते हैं। जैसे ककड़ी बेल से मुक्त होती है, वैसे ही वे हमें मृत्यु से मुक्त करें — हम अमृत से वंचित न हों।',
        sa: 'ओम्, त्र्यम्बकं (शिवम्) यजामहे यः सुगन्धिः पुष्टिवर्धनश्च। उर्वारुकमिव बन्धनात् मृत्योः मुक्षीय मा अमृतात् विच्छेदः भवतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant for health, longevity, and protection — especially powerful on Monday',
        hi: 'स्वास्थ्य, दीर्घायु और सुरक्षा के लिए जपें — सोमवार को विशेष प्रभावशाली',
        sa: 'आरोग्यदीर्घायुरक्षणार्थं जपेत् — सोमवासरे विशेषप्रभावशालिमन्त्रः',
      },
    },
  ],

  naivedya: {
    en: 'Offer fruits, milk, or simple sweets (kheer, peda). No grains should be consumed until parana if observing strict vrat. Many devotees consume only fruits and milk on Somvar Vrat.',
    hi: 'फल, दूध या सादी मिठाई (खीर, पेड़ा) अर्पित करें। कड़े व्रत में पारण तक अन्न नहीं खाना चाहिए। बहुत से भक्त सोमवार व्रत में केवल फल और दूध ग्रहण करते हैं।',
    sa: 'फलानि क्षीरं लघुमिष्टान्नानि (पायसम् पेडकम्) वा अर्पयेत्। कठिनव्रते पारणपर्यन्तं अन्नं न भक्षयेत्। बहवः भक्ताः सोमवारव्रते फलक्षीरमात्रं गृह्णन्ति।',
  },

  precautions: [
    {
      en: 'Observe the fast from sunrise to the next sunrise. Phalahar (fruit diet) or ek-bhojan (single meal) is acceptable for those unable to fast completely.',
      hi: 'सूर्योदय से अगले सूर्योदय तक व्रत रखें। जो पूर्ण उपवास नहीं रख सकते उनके लिए फलाहार या एक भोजन स्वीकार्य है।',
      sa: 'सूर्योदयात् परसूर्योदयपर्यन्तम् उपवासं कुर्यात्। ये पूर्णोपवासम् अक्षमाः तेभ्यः फलाहारः एकभोजनं वा स्वीकार्यम्।',
    },
    {
      en: 'Monday is ruled by the Moon, which is Shiva\'s crest jewel (Chandrashekhara). White foods and offerings are especially appropriate.',
      hi: 'सोमवार चन्द्रमा का दिन है, जो शिव का शिरोमणि (चन्द्रशेखर) है। सफ़ेद भोजन और अर्पण विशेष रूप से उपयुक्त हैं।',
      sa: 'सोमवासरः चन्द्रस्य दिनम्, यः शिवस्य शिरोमणिः (चन्द्रशेखरः)। श्वेतभोजनानि श्वेतार्पणानि च विशेषतः उपयुक्तानि।',
    },
  ],

  parana: {
    type: 'next_sunrise',
    description: {
      en: 'Break the fast on Tuesday morning after sunrise. Take a bath and offer brief prayers to Shiva before the first meal.',
      hi: 'मंगलवार प्रातः सूर्योदय के बाद व्रत तोड़ें। प्रथम भोजन से पहले स्नान करें और शिव को संक्षिप्त प्रार्थना अर्पित करें।',
      sa: 'मङ्गलवासरे प्रातः सूर्योदयानन्तरं व्रतं भञ्जयेत्। प्रथमभोजनात् प्राक् स्नानं कृत्वा शिवं सङ्क्षेपेण प्रार्थयेत्।',
    },
  },

  phala: {
    en: 'Marital harmony, Shiva\'s grace, fulfillment of desires, and spiritual growth. Unmarried devotees observe Somvar Vrat for an ideal spouse. It is especially auspicious during the month of Shravan.',
    hi: 'वैवाहिक सामंजस्य, शिव कृपा, मनोकामना पूर्ति, और आध्यात्मिक उन्नति। अविवाहित भक्त आदर्श जीवनसाथी के लिए सोमवार व्रत रखते हैं। श्रावण मास में यह विशेष शुभ है।',
    sa: 'वैवाहिकसामञ्जस्यं, शिवकृपा, मनोरथपूर्तिः, आध्यात्मिकवृद्धिश्च। अविवाहिताः भक्ताः आदर्शजीवनसङ्गिनीप्राप्त्यर्थं सोमवारव्रतं पालयन्ति। श्रावणमासे विशेषशुभम्।',
  },
};

import type { PujaVidhi } from './types';

export const HARTALIKA_TEEJ_PUJA: PujaVidhi = {
  festivalSlug: 'hartalika-teej',
  category: 'vrat',
  deity: { en: 'Shiva-Parvati', hi: 'शिव-पार्वती', sa: 'शिवपार्वती' },

  samagri: [
    { name: { en: 'Clay or sand idols of Shiva-Parvati', hi: 'शिव-पार्वती की मिट्टी या रेत की मूर्तियाँ', sa: 'शिवपार्वत्योः मृत्तिका-सिकतामूर्तयः' }, essential: true, note: { en: 'Make fresh idols from clay, sand, or cow dung on the morning of Teej', hi: 'तीज की सुबह मिट्टी, रेत या गोबर से ताज़ी मूर्तियाँ बनाएँ', sa: 'तीजप्रातः मृत्तिकया सिकतया गोमयेन वा नवमूर्तीः रचयेत्' } },
    { name: { en: '16 Shringar items (solah shringar)', hi: '16 श्रृंगार की वस्तुएँ (सोलह श्रृंगार)', sa: 'षोडशशृङ्गारसामग्री' }, essential: true, note: { en: 'Bindi, sindoor, bangles, kajal, mehendi, anklets, necklace, earrings, ring, nose ring, maang tika, comb, mirror, clothes, flower garland, perfume', hi: 'बिन्दी, सिन्दूर, चूड़ियाँ, काजल, मेहँदी, पायल, हार, कर्णफूल, अँगूठी, नथ, माँगटीका, कंघी, दर्पण, वस्त्र, फूलमाला, इत्र', sa: 'बिन्दी, सिन्दूरं, कङ्कणानि, अञ्जनम्, मेन्धिका, नूपुरम्, हारः, कर्णाभरणम्, अङ्गुलीयकम्, नासिकाभरणम्, माङ्गटिका, कङ्कतः, दर्पणम्, वस्त्रम्, पुष्पमाला, सुगन्धम्' } },
    { name: { en: 'Banana leaves (for puja base)', hi: 'केले के पत्ते (पूजा के आधार के लिए)', sa: 'कदलीपत्राणि (पूजाधाराय)' }, category: 'other' },
    { name: { en: 'Flowers (seasonal, especially jasmine and marigold)', hi: 'फूल (मौसमी, विशेषतः चमेली और गेंदा)', sa: 'पुष्पाणि (ऋतुजानि, विशेषतो मल्लिका स्थालपद्मं च)' }, category: 'flowers' },
    { name: { en: 'Fruits (seasonal)', hi: 'फल (मौसमी)', sa: 'फलानि (ऋतुजानि)' }, category: 'food' },
    { name: { en: 'Bel leaves (bilva patra)', hi: 'बेल पत्र', sa: 'बिल्वपत्राणि' }, category: 'flowers', essential: true },
    { name: { en: 'Turmeric and kumkum', hi: 'हल्दी और कुमकुम', sa: 'हरिद्रा कुङ्कुमं च' }, category: 'puja_items' },
    { name: { en: 'Incense and ghee lamp', hi: 'अगरबत्ती और घी का दीपक', sa: 'धूपं घृतदीपश्च' }, category: 'puja_items' },
    { name: { en: 'Red and green bangles (suhaag items)', hi: 'लाल और हरी चूड़ियाँ (सुहाग सामग्री)', sa: 'रक्तहरितकङ्कणानि (सौभाग्यसामग्री)' }, category: 'other' },
    { name: { en: 'Neem and lotus leaves', hi: 'नीम और कमल के पत्ते', sa: 'निम्बपत्राणि पद्मपत्राणि च' }, category: 'flowers' },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Hartalika Teej falls on Bhadrapada Shukla Tritiya (3rd day of waxing moon in Bhadrapada). The puja is performed during Pradosh Kaal (evening twilight). The nirjala vrat lasts from the previous evening to the next morning sunrise.',
    hi: 'हरतालिका तीज भाद्रपद शुक्ल तृतीया (भाद्रपद में बढ़ते चन्द्रमा का तीसरा दिन) को पड़ती है। पूजा प्रदोष काल (सायं सन्ध्या) में होती है। निर्जला व्रत पूर्व सन्ध्या से अगली प्रातः सूर्योदय तक रहता है।',
    sa: 'हरतालिकातीजं भाद्रपदशुक्लतृतीयायां (भाद्रपदे वर्धमानचन्द्रस्य तृतीये दिने) भवति। पूजा प्रदोषकाले (सायंसन्ध्यायाम्) क्रियते। निर्जलव्रतं पूर्वसन्ध्यातः अग्रिमप्रातःसूर्योदयपर्यन्तं तिष्ठति।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Bhadrapada Shukla Tritiya, I undertake the nirjala Hartalika Teej vrat and worship of Lord Shiva and Goddess Parvati for the long life and well-being of my spouse and eternal marital bliss.',
    hi: 'इस पवित्र भाद्रपद शुक्ल तृतीया पर, अपने पति की दीर्घायु और कल्याण तथा शाश्वत वैवाहिक सुख के लिए, मैं भगवान शिव और देवी पार्वती की पूजा एवं निर्जला हरतालिका तीज व्रत का संकल्प करती हूँ।',
    sa: 'अस्यां पवित्रायां भाद्रपदशुक्लतृतीयायां पतिदीर्घायुकल्याणार्थं शाश्वतवैवाहिकसुखाय च शिवपार्वत्योः पूजनं निर्जलहरतालिकातीजव्रतं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning — Bath & Shringar', hi: 'प्रातः — स्नान एवं श्रृंगार', sa: 'प्रातः — स्नानं शृङ्गारश्च' },
      description: {
        en: 'Wake before sunrise and take a purifying bath. Apply the 16 shringar items (adornments) — this is a mandatory part of the Teej tradition. Wear a red or green sari/outfit as married women.',
        hi: 'सूर्योदय से पहले उठें और शुद्धि स्नान करें। 16 श्रृंगार लगाएँ — यह तीज परम्परा का अनिवार्य भाग है। सुहागिन स्त्रियाँ लाल या हरी साड़ी/वस्त्र पहनें।',
        sa: 'सूर्योदयात् प्राक् उत्तिष्ठेत् शुद्धिस्नानं कुर्यात्। षोडशशृङ्गारं कुर्यात् — एतत् तीजपरम्परायाः अनिवार्यम्। सधवाः रक्तं हरितं वा वस्त्रं धारयेयुः।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '30 min',
    },
    {
      step: 2,
      title: { en: 'Making Clay Idols', hi: 'मिट्टी की मूर्तियाँ बनाना', sa: 'मृत्तिकामूर्तिरचनम्' },
      description: {
        en: 'Make idols of Lord Shiva (as Shivalinga) and Goddess Parvati from clay, sand, or cow dung. Place them on a banana leaf decorated with flowers. Some traditions also make a small idol of Ganesha alongside.',
        hi: 'मिट्टी, रेत या गोबर से भगवान शिव (शिवलिंग रूप में) और देवी पार्वती की मूर्तियाँ बनाएँ। इन्हें फूलों से सजे केले के पत्ते पर रखें। कुछ परम्पराओं में साथ में गणेश की छोटी मूर्ति भी बनाते हैं।',
        sa: 'मृत्तिकया सिकतया गोमयेन वा शिवस्य (शिवलिङ्गरूपेण) पार्वत्याश्च मूर्तीः रचयेत्। पुष्पालङ्कृते कदलीपत्रे ताः स्थापयेत्। कासुचित् परम्परासु गणेशस्य लघुमूर्तिम् अपि रचयन्ति।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '20 min',
    },
    {
      step: 3,
      title: { en: 'Sankalpa & Invocation', hi: 'संकल्प एवं आवाहन', sa: 'सङ्कल्पः आवाहनं च' },
      description: {
        en: 'Sit before the idols and take the formal sankalpa for the nirjala vrat. Invoke Shiva and Parvati into the clay idols with avahana mantras. Sprinkle gangajal on the idols.',
        hi: 'मूर्तियों के सामने बैठें और निर्जला व्रत का विधिवत् संकल्प लें। आवाहन मन्त्रों से मिट्टी की मूर्तियों में शिव-पार्वती का आवाहन करें। मूर्तियों पर गंगाजल छिड़कें।',
        sa: 'मूर्तीनां पुरतः उपविश्य निर्जलव्रतस्य सङ्कल्पं कुर्यात्। आवाहनमन्त्रैः मृत्तिकामूर्तिषु शिवपार्वत्योः आवाहनं कुर्यात्। मूर्तीषु गङ्गाजलं सिञ्चेत्।',
      },
      essential: true,
      stepType: 'invocation',
      duration: '15 min',
    },
    {
      step: 4,
      title: { en: 'Shiva-Parvati Puja (16 Upacharas)', hi: 'शिव-पार्वती पूजा (16 उपचार)', sa: 'शिवपार्वतीपूजनम् (षोडशोपचारः)' },
      description: {
        en: 'Perform the sixteen-step worship of Shiva-Parvati: Offer bel leaves to Shiva, flowers and shringar items to Parvati. Apply sandalwood paste, offer dhupa, dipa, and naivedya. Parvati receives all 16 shringar offerings symbolically.',
        hi: 'शिव-पार्वती की षोडशोपचार पूजा करें: शिव को बेलपत्र, पार्वती को फूल और श्रृंगार सामग्री अर्पित करें। चन्दन लगाएँ, धूप, दीप और नैवेद्य अर्पित करें। पार्वती को प्रतीकात्मक रूप में सभी 16 श्रृंगार अर्पित होते हैं।',
        sa: 'शिवपार्वत्योः षोडशोपचारपूजनं कुर्यात्: शिवाय बिल्वपत्राणि, पार्वत्यै पुष्पाणि शृङ्गारसामग्रीं च अर्पयेत्। चन्दनं लिम्पेत्, धूपं दीपं नैवेद्यं च अर्पयेत्। पार्वती प्रतीकात्मकं षोडशशृङ्गारार्पणं लभते।',
      },
      essential: true,
      stepType: 'offering',
      duration: '30 min',
    },
    {
      step: 5,
      title: { en: 'Hartalika Katha', hi: 'हरतालिका कथा', sa: 'हरतालिकाकथा' },
      description: {
        en: 'Read or listen to the Hartalika Teej Vrat Katha. The story narrates how Parvati performed severe penance to obtain Shiva as her husband, and how her friend (sakhi) took her away (hartalika = one who takes away) to the forest to help her.',
        hi: 'हरतालिका तीज व्रत कथा पढ़ें या सुनें। कथा बताती है कि कैसे पार्वती ने शिव को पति रूप में पाने के लिए कठोर तपस्या की, और उनकी सखी ने उन्हें वन में ले जाकर (हरतालिका = ले जाने वाली) उनकी सहायता की।',
        sa: 'हरतालिकातीजव्रतकथां पठेत् श्रृणुयात् वा। कथायां पार्वती शिवं पतित्वेन प्राप्तुं कठोरं तपः अकरोत्, तस्याः सखी ताम् वनं नीत्वा (हरतालिका = अपहर्त्री) साहाय्यम् अकरोत् इति वर्ण्यते।',
      },
      essential: true,
      stepType: 'meditation',
      duration: '20 min',
    },
    {
      step: 6,
      title: { en: 'Parvati Mantra Japa', hi: 'पार्वती मन्त्र जप', sa: 'पार्वतीमन्त्रजपः' },
      description: {
        en: 'Chant the Parvati mantra 108 times with a rudraksha mala. Pray for the well-being of your spouse and family. Unmarried women may pray for a good husband.',
        hi: 'रुद्राक्ष माला से पार्वती मन्त्र का 108 बार जप करें। अपने पति और परिवार के कल्याण की प्रार्थना करें। अविवाहित स्त्रियाँ अच्छे पति की कामना कर सकती हैं।',
        sa: 'रुद्राक्षमालया पार्वतीमन्त्रं १०८ वारं जपेत्। पतिपरिवारकल्याणं प्रार्थयेत्। अविवाहिताः शोभनपतिप्राप्त्यर्थं प्रार्थयेयुः।',
      },
      mantraRef: 'parvati-mantra',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 7,
      title: { en: 'Night Vigil (Jagran)', hi: 'रात्रि जागरण', sa: 'रात्रिजागरणम्' },
      description: {
        en: 'Stay awake through the night (jagran) singing bhajans, reading Shiva-Parvati stories from the Puranas, or meditating. Women often celebrate together with songs and dances. This jagran is an essential part of Hartalika Teej.',
        hi: 'पूरी रात जागकर भजन गाते, पुराणों से शिव-पार्वती की कथाएँ पढ़ते या ध्यान करते हुए बिताएँ। स्त्रियाँ प्रायः मिलकर गीत और नृत्य से उत्सव मनाती हैं। यह जागरण हरतालिका तीज का अनिवार्य अंग है।',
        sa: 'सर्वां रात्रिं जागृयात् भजनगायनेन पुराणेभ्यः शिवपार्वतीकथापठनेन ध्यानेन वा। स्त्रियः प्रायः सम्मिलित्य गीतनृत्याभ्याम् उत्सवं कुर्वन्ति। एतज्जागरणं हरतालिकातीजस्य अनिवार्यम् अङ्गम्।',
      },
      essential: true,
      stepType: 'meditation',
      duration: 'Overnight',
    },
    {
      step: 8,
      title: { en: 'Aarti & Pradakshina', hi: 'आरती एवं प्रदक्षिणा', sa: 'आरात्रिकं प्रदक्षिणा च' },
      description: {
        en: 'Perform the evening aarti of Shiva-Parvati with camphor and ghee lamp. Circumambulate the idols three times. Prostrate before the idols and pray for saubhagya (marital auspiciousness).',
        hi: 'कपूर और घी के दीपक से शिव-पार्वती की सायं आरती करें। मूर्तियों की तीन बार प्रदक्षिणा करें। मूर्तियों के सामने साष्टाँग प्रणाम करें और सौभाग्य की कामना करें।',
        sa: 'कर्पूरघृतदीपाभ्यां शिवपार्वत्योः सायमारात्रिकं कुर्यात्। मूर्तीः त्रिवारं प्रदक्षिणां कुर्यात्। मूर्तीनां पुरतः साष्टाङ्गप्रणामं कुर्यात् सौभाग्यं प्रार्थयेत् च।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
    {
      step: 9,
      title: { en: 'Visarjan (Immersion)', hi: 'विसर्जन', sa: 'विसर्जनम्' },
      description: {
        en: 'On the next morning, after sunrise, immerse the clay idols in flowing water (river or stream). If not possible, immerse in a bucket of water and pour the water at the base of a tree.',
        hi: 'अगली सुबह सूर्योदय के बाद मिट्टी की मूर्तियों को बहते पानी (नदी या नाले) में विसर्जित करें। सम्भव न हो तो बाल्टी में विसर्जन कर वह पानी वृक्ष के मूल में डालें।',
        sa: 'अग्रिमप्रातः सूर्योदयानन्तरं मृत्तिकामूर्तीः प्रवाहजले (नद्यां स्रोतसि वा) विसर्जयेत्। न सम्भवति चेत् कुम्भे विसर्जयेत् तज्जलं वृक्षमूले सिञ्चेत्।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
    {
      step: 10,
      title: { en: 'Parana — Breaking the Fast', hi: 'पारण — उपवास समाप्ति', sa: 'पारणम् — उपवाससमाप्तिः' },
      description: {
        en: 'After visarjan and next day sunrise, break the nirjala fast with water, then fruits, then a light sattvic meal. Receive blessings from elders. Share prasad with other women who observed the vrat.',
        hi: 'विसर्जन और अगले दिन सूर्योदय के बाद निर्जला व्रत जल से तोड़ें, फिर फल, फिर हल्का सात्विक भोजन लें। बड़ों से आशीर्वाद लें। व्रत रखने वाली अन्य महिलाओं के साथ प्रसाद बाँटें।',
        sa: 'विसर्जनानन्तरं अग्रिमदिनसूर्योदयानन्तरं निर्जलव्रतं जलेन भङ्गयेत्, ततो फलानि, ततो लघुसात्त्विकभोजनम्। वृद्धेभ्यः आशीर्वादं ग्रहणीयम्। व्रतधारिणीभ्यः प्रसादं वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
  ],

  mantras: [
    {
      id: 'parvati-mantra',
      name: { en: 'Parvati Saubhagya Mantra', hi: 'पार्वती सौभाग्य मन्त्र', sa: 'पार्वतीसौभाग्यमन्त्रः' },
      devanagari: 'ॐ ह्रीं उमायै नमः',
      iast: 'oṃ hrīṃ umāyai namaḥ',
      meaning: {
        en: 'Om, salutations to Goddess Uma (Parvati), the embodiment of grace and marital auspiciousness.',
        hi: 'ॐ, कृपा और वैवाहिक सौभाग्य की मूर्ति देवी उमा (पार्वती) को नमस्कार।',
        sa: 'ॐ, कृपासौभाग्यमूर्तये उमादेव्यै नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the main puja for saubhagya (marital bliss). This is the primary mantra for Hartalika Teej.',
        hi: 'सौभाग्य प्राप्ति के लिए मुख्य पूजा के दौरान 108 बार जपें। यह हरतालिका तीज का प्रमुख मन्त्र है।',
        sa: 'सौभाग्यार्थं प्रधानपूजायां १०८ वारं जपेत्। एषः हरतालिकातीजस्य प्रधानमन्त्रः।',
      },
    },
    {
      id: 'shiva-parvati-mantra',
      name: { en: 'Shiva-Parvati Mantra', hi: 'शिव-पार्वती मन्त्र', sa: 'शिवपार्वतीमन्त्रः' },
      devanagari: 'ॐ नमः शिवायै च नमः शिवाय',
      iast: 'oṃ namaḥ śivāyai ca namaḥ śivāya',
      meaning: {
        en: 'Om, salutations to Goddess Shivaa (Parvati) and salutations to Lord Shiva — the divine couple.',
        hi: 'ॐ, देवी शिवा (पार्वती) और भगवान शिव — दिव्य दम्पती — को नमस्कार।',
        sa: 'ॐ, शिवायै (पार्वत्यै) नमः शिवाय च नमः — दिव्यदम्पती।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant during the Shiva-Parvati puja and during the night vigil. Invokes the blessings of the divine couple together.',
        hi: 'शिव-पार्वती पूजा और रात्रि जागरण के दौरान जपें। दिव्य दम्पती का एक साथ आशीर्वाद प्राप्त होता है।',
        sa: 'शिवपार्वतीपूजायां रात्रिजागरणे च जपेत्। दिव्यदम्पत्योः सम्मिलितम् आशीर्वादम् आवाहयति।',
      },
    },
  ],

  naivedya: {
    en: 'Offer seasonal fruits, milk sweets, paan, coconut, and kheer. Since it is a nirjala fast, the naivedya is offered to the deity — the devotee does not consume anything until parana.',
    hi: 'मौसमी फल, दूध की मिठाई, पान, नारियल और खीर अर्पित करें। निर्जला व्रत होने से नैवेद्य देवता को अर्पित होता है — व्रती पारण तक कुछ नहीं खाती।',
    sa: 'ऋतुफलानि, क्षीरमिष्टान्नानि, ताम्बूलं, नारिकेलं, क्षीरान्नं च अर्पयेत्। निर्जलव्रतत्वात् नैवेद्यं देवतायै अर्प्यते — व्रतिनी पारणपर्यन्तं किमपि न भक्षयति।',
  },

  precautions: [
    {
      en: 'This is a nirjala (waterless) fast — not even a single drop of water is to be consumed from the evening before until the next morning sunrise.',
      hi: 'यह निर्जला (जलरहित) व्रत है — पूर्व सन्ध्या से अगली सुबह सूर्योदय तक एक बूँद पानी भी नहीं पीना है।',
      sa: 'एतद् निर्जलव्रतम् — पूर्वसन्ध्यातः अग्रिमप्रातःसूर्योदयपर्यन्तम् एकम् अपि जलबिन्दुं न पिबेत्।',
    },
    {
      en: 'Do not sleep during the night — the jagran (night vigil) is an essential part of the vrat.',
      hi: 'रात में नहीं सोना — जागरण व्रत का अनिवार्य अंग है।',
      sa: 'रात्रौ न स्वपेत् — जागरणं व्रतस्य अनिवार्यम् अङ्गम्।',
    },
    {
      en: 'Married women must wear all 16 shringar items. Removing any saubhagya symbol is considered inauspicious.',
      hi: 'सुहागिन स्त्रियाँ सभी 16 श्रृंगार अवश्य लगाएँ। किसी भी सौभाग्य चिह्न को हटाना अशुभ माना जाता है।',
      sa: 'सधवाः सर्वान् षोडशशृङ्गारान् अवश्यं धारयेयुः। सौभाग्यचिह्नम् अपनयनम् अशुभं मन्यते।',
    },
    {
      en: 'The clay idols must be made fresh — do not use old or pre-made idols. Immerse them the next morning without fail.',
      hi: 'मिट्टी की मूर्तियाँ ताज़ी बनाएँ — पुरानी या पहले से बनी मूर्तियाँ न लें। अगली सुबह अवश्य विसर्जन करें।',
      sa: 'मृत्तिकामूर्तयः नवरचिताः स्युः — पुरातनाः पूर्वरचिताः वा न उपयोज्याः। अग्रिमप्रातः अवश्यं विसर्जयेत्।',
    },
  ],

  phala: {
    en: 'Hartalika Teej vrat is considered the most meritorious vrat for married women. It grants saubhagya (eternal marital auspiciousness), long life of the spouse, and reunion with the same husband in every birth — just as Parvati obtained Shiva through her penance. Unmarried women gain a worthy husband.',
    hi: 'हरतालिका तीज व्रत विवाहित स्त्रियों का सबसे पुण्यदायी व्रत माना जाता है। यह सौभाग्य (शाश्वत वैवाहिक शुभता), पति की दीर्घायु, और प्रत्येक जन्म में उसी पति के साथ पुनर्मिलन प्रदान करता है — जैसे पार्वती ने तपस्या से शिव प्राप्त किए। अविवाहित स्त्रियों को योग्य पति प्राप्त होता है।',
    sa: 'हरतालिकातीजव्रतं विवाहितानां स्त्रीणां सर्वपुण्यतमं व्रतं मन्यते। सौभाग्यं (शाश्वतवैवाहिकशुभता), पतिदीर्घायुः, प्रतिजन्मनि तेनैव पतिना पुनर्मिलनं च ददाति — यथा पार्वती तपसा शिवं प्राप्तवती। अविवाहिताः योग्यपतिं लभन्ते।',
  },

  visarjan: {
    en: 'Immerse the clay idols in flowing water (river or stream) on the next morning after sunrise. If no flowing water is accessible, immerse in a water vessel and pour the water at the root of a sacred tree.',
    hi: 'अगली सुबह सूर्योदय के बाद मिट्टी की मूर्तियों को बहते पानी (नदी या नाले) में विसर्जित करें। बहता पानी उपलब्ध न हो तो जल पात्र में विसर्जित कर वह जल पवित्र वृक्ष की जड़ में डालें।',
    sa: 'अग्रिमप्रातः सूर्योदयानन्तरं मृत्तिकामूर्तीः प्रवाहजले (नद्यां स्रोतसि वा) विसर्जयेत्। प्रवाहजलं नोपलभ्यते चेत् जलपात्रे विसर्जयेत् तज्जलं पवित्रवृक्षमूले सिञ्चेत्।',
  },

  parana: {
    type: 'next_sunrise',
    description: {
      en: 'Break the nirjala fast after sunrise the next morning, following the visarjan of clay idols',
      hi: 'अगली सुबह सूर्योदय के बाद मिट्टी की मूर्तियों के विसर्जन के पश्चात् निर्जला व्रत तोड़ें',
      sa: 'अग्रिमप्रातः सूर्योदयानन्तरं मृत्तिकामूर्तिविसर्जनानन्तरं निर्जलव्रतं भङ्गयेत्',
    },
  },
};

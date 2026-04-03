import type { PujaVidhi } from './types';

export const RAKSHA_BANDHAN_PUJA: PujaVidhi = {
  festivalSlug: 'raksha-bandhan',
  category: 'festival',
  deity: { en: 'Sibling Bond (no specific deity)', hi: 'भाई-बहन का बन्धन (कोई विशेष देवता नहीं)', sa: 'भ्रातृभगिनीबन्धनम् (विशिष्टदेवता नास्ति)' },

  samagri: [
    { name: { en: 'Rakhi (sacred thread)', hi: 'राखी', sa: 'रक्षासूत्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Roli / Kumkum (vermilion)', hi: 'रोली / कुमकुम', sa: 'रोली / कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Diya (oil/ghee lamp)', hi: 'दीपक (तेल/घी)', sa: 'दीपः (तैल/घृत)' }, category: 'puja_items', essential: true },
    { name: { en: 'Mishri (rock sugar)', hi: 'मिश्री', sa: 'खण्डशर्करा' }, category: 'food', essential: true },
    { name: { en: 'Aarti plate (thali)', hi: 'आरती की थाली', sa: 'आरात्रिकपात्रम्' }, category: 'vessels', essential: true },
    { name: { en: 'Sweets', hi: 'मिठाई', sa: 'मिष्टान्नानि' }, category: 'food', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1', category: 'food', essential: false },
    { name: { en: 'Flowers', hi: 'फूल', sa: 'पुष्पाणि' }, category: 'flowers', essential: false },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Raksha Bandhan is performed during Aparahna (afternoon) on Shravana Purnima. Bhadra Kaal must be strictly avoided — tying Rakhi during Bhadra brings ill fortune. Check the Panchang for Bhadra timing and avoid it completely.',
    hi: 'रक्षा बन्धन श्रावण पूर्णिमा को अपराह्न (दोपहर बाद) में किया जाता है। भद्रा काल से सख्ती से बचना चाहिए — भद्रा में राखी बाँधना अशुभ होता है। भद्रा का समय पंचांग से देखें और उससे पूर्णतः बचें।',
    sa: 'रक्षाबन्धनं श्रावणपूर्णिमायाम् अपराह्णे क्रियते। भद्राकालः सर्वथा वर्जनीयः — भद्रायां रक्षासूत्रबन्धनम् अशुभम्। पञ्चाङ्गतः भद्राकालं ज्ञात्वा सर्वथा वर्जयेत्।',
  },
  muhurtaWindow: { type: 'aparahna' },

  sankalpa: {
    en: 'On this auspicious Shravana Purnima, I tie this Raksha (protective thread) on my brother\'s wrist, praying for his long life, good health, and prosperity. May this sacred bond of love and protection endure forever.',
    hi: 'इस शुभ श्रावण पूर्णिमा पर, मैं अपने भाई की कलाई पर यह रक्षा (सूत्र) बाँधती हूँ, उनकी दीर्घायु, स्वास्थ्य और समृद्धि की प्रार्थना करती हूँ। प्रेम और रक्षा का यह पवित्र बन्धन सदा बना रहे।',
    sa: 'अस्मिन् शुभे श्रावणपूर्णिमायां भ्रातुः मणिबन्धे रक्षासूत्रं बध्नामि, तस्य दीर्घायुः स्वास्थ्यं समृद्धिं च प्रार्थयामि। स्नेहरक्षणयोः इदं पवित्रं बन्धनं सर्वदा तिष्ठतु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation of Aarti Thali', hi: 'आरती थाली की तैयारी', sa: 'आरात्रिकपात्रसज्जता' },
      description: {
        en: 'The sister prepares the aarti plate with a lit diya, roli, akshat, mishri, a flower, and the rakhi. Both brother and sister should bathe and wear clean festive clothes.',
        hi: 'बहन आरती की थाली में जलता दीपक, रोली, अक्षत, मिश्री, एक फूल और राखी सजाती है। भाई और बहन दोनों स्नान करके स्वच्छ शुभ वस्त्र पहनें।',
        sa: 'भगिनी आरात्रिकपात्रं प्रज्वलितदीपेन रोल्या अक्षतैः खण्डशर्करया पुष्पेण रक्षासूत्रेण च सज्जयति। भ्राता भगिनी च स्नात्वा शुचिशुभवस्त्राणि धारयेताम्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Aarti of Brother', hi: 'भाई की आरती', sa: 'भ्रातुः आरात्रिकम्' },
      description: {
        en: 'The sister performs aarti of her brother by waving the lit diya plate clockwise around his face three times.',
        hi: 'बहन जलते दीपक की थाली को भाई के चेहरे के चारों ओर तीन बार दक्षिणावर्त घुमाकर उनकी आरती करती है।',
        sa: 'भगिनी प्रज्वलितदीपपात्रं भ्रातुः मुखस्य परितः त्रिवारं प्रदक्षिणक्रमेण भ्रामयन्ती आरात्रिकं करोति।',
      },
      duration: '2 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Tilak on Forehead', hi: 'माथे पर तिलक', sa: 'ललाटे तिलकम्' },
      description: {
        en: 'The sister applies roli tilak on the brother\'s forehead with the ring finger, then places akshat (rice grains) on the tilak. This marks him with auspicious blessings.',
        hi: 'बहन अनामिका से भाई के माथे पर रोली का तिलक लगाती है, फिर तिलक पर अक्षत (चावल के दाने) चिपकाती है। यह शुभ आशीर्वाद का प्रतीक है।',
        sa: 'भगिनी अनामिकया भ्रातुः ललाटे रोलीतिलकं करोति, ततः तिलके अक्षतान् निधद्यात्। इदं शुभाशीर्वादस्य चिह्नम्।',
      },
      duration: '2 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Tying the Rakhi', hi: 'राखी बाँधना', sa: 'रक्षासूत्रबन्धनम्' },
      description: {
        en: 'The sister ties the rakhi on the brother\'s right wrist while chanting the Raksha Sutra Mantra. The brother keeps his palm open, facing upward. This is the central ritual of Raksha Bandhan.',
        hi: 'बहन रक्षा सूत्र मन्त्र पढ़ते हुए भाई की दाहिनी कलाई पर राखी बाँधती है। भाई अपनी हथेली खुली और ऊपर की ओर रखते हैं। यह रक्षा बन्धन का मूल अनुष्ठान है।',
        sa: 'भगिनी रक्षासूत्रमन्त्रं पठन्ती भ्रातुः दक्षिणमणिबन्धे रक्षासूत्रं बध्नाति। भ्राता करतलम् उन्मुखं विवृतं धारयति। इदं रक्षाबन्धनस्य मूलानुष्ठानम्।',
      },
      mantraRef: 'raksha-sutra',
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Offering Sweets', hi: 'मिठाई खिलाना', sa: 'मिष्टान्नार्पणम्' },
      description: {
        en: 'The sister feeds the brother mishri or sweets, and the brother reciprocates by feeding sweets to the sister. This sweetens the bond.',
        hi: 'बहन भाई को मिश्री या मिठाई खिलाती है, और भाई भी बहन को मिठाई खिलाता है। इससे बन्धन मधुर होता है।',
        sa: 'भगिनी भ्रातरे खण्डशर्करां मिष्टान्नं वा ददाति, भ्राता अपि भगिन्यै मिष्टान्नं ददाति। अनेन बन्धनं मधुरं भवति।',
      },
      duration: '2 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Brother\'s Gift & Pledge', hi: 'भाई का उपहार और वचन', sa: 'भ्रातुः उपहारः प्रतिज्ञा च' },
      description: {
        en: 'The brother gives a gift (traditionally money or gold) to the sister and pledges to protect her for life. He touches her feet or head in blessing.',
        hi: 'भाई बहन को उपहार (परम्परागत रूप से धन या सोना) देता है और जीवनभर उसकी रक्षा का वचन देता है। वह आशीर्वाद स्वरूप उसके पैर या सिर छूता है।',
        sa: 'भ्राता भगिन्यै उपहारं (परम्परया धनं सुवर्णं वा) ददाति आजीवनं तस्याः रक्षणस्य प्रतिज्ञां करोति। आशीर्वादरूपेण तस्याः पादौ शिरो वा स्पृशति।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 7,
      title: { en: 'Sharing Sweets & Celebration', hi: 'मिठाई बाँटना और उत्सव', sa: 'मिष्टान्नवितरणम् उत्सवः च' },
      description: {
        en: 'The family shares sweets and celebrates together. Distribute sweets to neighbours and relatives.',
        hi: 'परिवार मिलकर मिठाई बाँटता है और उत्सव मनाता है। पड़ोसियों और रिश्तेदारों को मिठाई बाँटें।',
        sa: 'कुटुम्बं मिलित्वा मिष्टान्नानि वितरति उत्सवं करोति च। प्रतिवासिभ्यः बन्धुभ्यः च मिष्टान्नानि वितरेत्।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 8,
      title: { en: 'Prayer for Protection', hi: 'रक्षा की प्रार्थना', sa: 'रक्षाप्रार्थना' },
      description: {
        en: 'Both brother and sister pray together for each other\'s well-being, long life, and happiness. The sister prays for the brother\'s protection; the brother prays for the sister\'s prosperity.',
        hi: 'भाई और बहन दोनों मिलकर एक-दूसरे के कल्याण, दीर्घायु और सुख की प्रार्थना करते हैं। बहन भाई की रक्षा की प्रार्थना करती है; भाई बहन की समृद्धि की प्रार्थना करता है।',
        sa: 'भ्राता भगिनी च मिलित्वा परस्परं कल्याणदीर्घायुसुखार्थं प्रार्थयेताम्। भगिनी भ्रातुः रक्षां प्रार्थयते; भ्राता भगिन्याः समृद्धिं प्रार्थयते।',
      },
      duration: '2 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'raksha-sutra',
      name: { en: 'Raksha Sutra Mantra', hi: 'रक्षा सूत्र मन्त्र', sa: 'रक्षासूत्रमन्त्रः' },
      devanagari: 'येन बद्धो बली राजा दानवेन्द्रो महाबलः।\nतेन त्वामनुबध्नामि रक्षे मा चल मा चल॥',
      iast: 'yena baddho balī rājā dānavendro mahābalaḥ |\ntena tvāmanubadhnāmi rakṣe mā cala mā cala ||',
      meaning: {
        en: 'With the same bond by which the mighty demon king Bali was bound, I bind you. O Raksha (protector), do not waver, do not waver!',
        hi: 'जिस बन्धन से महाबली दानवराज बलि बाँधे गए थे, उसी बन्धन से मैं तुम्हें बाँधती हूँ। हे रक्षा, डिगो मत, डिगो मत!',
        sa: 'येन बन्धनेन महाबलः दानवेन्द्रो बली राजा बद्धः, तेनैव त्वां बध्नामि। हे रक्षे, मा चल मा चल।',
      },
      usage: {
        en: 'The sister chants this mantra while tying the rakhi on the brother\'s wrist — the central mantra of Raksha Bandhan',
        hi: 'भाई की कलाई पर राखी बाँधते समय बहन इस मन्त्र का उच्चारण करती है — रक्षा बन्धन का मुख्य मन्त्र',
        sa: 'भ्रातुः मणिबन्धे रक्षासूत्रं बध्नन्ती भगिनी इमं मन्त्रं पठति — रक्षाबन्धनस्य प्रधानमन्त्रः',
      },
    },
    {
      id: 'raksha-prarthana',
      name: { en: 'Raksha Bandhan Prayer', hi: 'रक्षा बन्धन प्रार्थना', sa: 'रक्षाबन्धनप्रार्थना' },
      devanagari: 'भ्रातः सदा सुखी भव, चिरञ्जीवी भव।\nआयुष्मान् भव, यशस्वी भव॥',
      iast: 'bhrātaḥ sadā sukhī bhava, cirañjīvī bhava |\nāyuṣmān bhava, yaśasvī bhava ||',
      meaning: {
        en: 'O brother, may you always be happy, may you live long. May you be blessed with long life and fame.',
        hi: 'हे भाई, सदा सुखी रहो, चिरञ्जीवी रहो। आयुष्मान रहो, यशस्वी रहो।',
        sa: 'हे भ्रातः, सदा सुखी भव, चिरञ्जीवी भव। आयुष्मान् भव, यशस्वी भव।',
      },
      usage: {
        en: 'Recite after tying the rakhi as a blessing for the brother',
        hi: 'राखी बाँधने के बाद भाई के आशीर्वाद के रूप में पढ़ें',
        sa: 'रक्षासूत्रबन्धनानन्तरं भ्रातुः आशीर्वादरूपेण पठेत्',
      },
    },
    {
      id: 'raksha-mantra-protection',
      name: { en: 'Protection Mantra', hi: 'रक्षा मन्त्र', sa: 'रक्षामन्त्रः' },
      devanagari: 'ॐ सर्वेभ्यो भयेभ्यो रक्ष रक्ष स्वाहा',
      iast: 'oṃ sarvebhyo bhayebhyo rakṣa rakṣa svāhā',
      meaning: {
        en: 'O Lord, protect from all fears — protect, protect! Svaha.',
        hi: 'हे भगवान, सभी भयों से रक्षा करो — रक्षा करो, रक्षा करो! स्वाहा।',
        sa: 'सर्वेभ्यो भयेभ्यो रक्ष रक्ष इति।',
      },
      usage: {
        en: 'Brother chants this while pledging to protect the sister',
        hi: 'भाई बहन की रक्षा का वचन देते समय इस मन्त्र का जाप करे',
        sa: 'भगिन्याः रक्षाप्रतिज्ञाकाले भ्राता इमं मन्त्रं जपेत्',
      },
    },
  ],

  aarti: {
    name: { en: 'Raksha Bandhan Aarti', hi: 'रक्षा बन्धन आरती', sa: 'रक्षाबन्धनारात्रिकम्' },
    devanagari:
      '॥ राखी की आरती ॥\n\nॐ जय श्री राखी माता, मैया जय श्री राखी माता।\nभाई बहन के प्रेम की, रक्षा का नाता॥\nॐ जय श्री राखी माता॥\n\nकलाई पर राखी सजाकर, टीका रोली लगाऊँ।\nमिठाई खिलाकर भैया को, स्नेह से गले लगाऊँ॥\nॐ जय श्री राखी माता॥\n\nरक्षासूत्र बाँधकर, मंगलकामना करती।\nभाई की दीर्घायु के लिए, प्रभु से प्रार्थना करती॥\nॐ जय श्री राखी माता॥\n\nराखी की आरती जो कोई, भाई बहन गावें।\nसुख सम्पत्ति समृद्धि, सदा ही पावें॥\nॐ जय श्री राखी माता॥',
    iast:
      '|| rākhī kī āratī ||\n\noṃ jaya śrī rākhī mātā, maiyā jaya śrī rākhī mātā |\nbhāī bahana ke prema kī, rakṣā kā nātā ||\noṃ jaya śrī rākhī mātā ||\n\nkalāī para rākhī sajākara, ṭīkā rolī lagāūṃ |\nmiṭhāī khilākara bhaiyā ko, sneha se gale lagāūṃ ||\noṃ jaya śrī rākhī mātā ||\n\nrakṣāsūtra bāṃdhakara, maṅgalakāmanā karatī |\nbhāī kī dīrghāyu ke lie, prabhu se prārthanā karatī ||\noṃ jaya śrī rākhī mātā ||\n\nrākhī kī āratī jo koī, bhāī bahana gāveṃ |\nsukha sampatti samṛddhi, sadā hī pāveṃ ||\noṃ jaya śrī rākhī mātā ||',
  },

  naivedya: {
    en: 'Mishri (rock sugar), coconut, barfi, peda, and seasonal fruits',
    hi: 'मिश्री, नारियल, बर्फी, पेड़ा और मौसमी फल',
    sa: 'खण्डशर्करा, नारिकेलम्, बर्फी, पेदकम्, ऋतुफलानि च',
  },

  precautions: [
    {
      en: 'Strictly avoid Bhadra Kaal — tying Rakhi during Bhadra is considered inauspicious and harmful. Calculate Bhadra timing from the Panchang.',
      hi: 'भद्रा काल से सख्ती से बचें — भद्रा में राखी बाँधना अशुभ और हानिकारक माना जाता है। पंचांग से भद्रा का समय गणना करें।',
      sa: 'भद्राकालं सर्वथा वर्जयेत् — भद्रायां रक्षासूत्रबन्धनम् अशुभं हानिकरं च मन्यते। पञ्चाङ्गतः भद्राकालं गणयेत्।',
    },
    {
      en: 'The Rakhi should be tied on the right wrist of the brother',
      hi: 'राखी भाई की दाहिनी कलाई पर बाँधनी चाहिए',
      sa: 'रक्षासूत्रं भ्रातुः दक्षिणमणिबन्धे बध्नीयात्',
    },
    {
      en: 'If Bhadra extends through the entire morning and afternoon, tie Rakhi during Pradosh Kaal (evening) after Bhadra ends',
      hi: 'यदि भद्रा सम्पूर्ण प्रातःकाल और अपराह्न तक रहे, तो भद्रा समाप्ति के बाद प्रदोष काल (सायं) में राखी बाँधें',
      sa: 'यदि भद्रा सम्पूर्णं प्रातःकालम् अपराह्णं च व्याप्नोति, तदा भद्रासमाप्त्यनन्तरं प्रदोषकाले (सायम्) रक्षासूत्रं बध्नीयात्',
    },
    {
      en: 'Do not use a broken or already-used Rakhi — it must be new and auspicious',
      hi: 'टूटी या पहले से प्रयुक्त राखी का उपयोग न करें — यह नई और शुभ होनी चाहिए',
      sa: 'भग्नं पूर्वप्रयुक्तं वा रक्षासूत्रं नोपयोजयेत् — नवं शुभं च भवेत्',
    },
  ],

  phala: {
    en: 'Strengthens the sacred bond between brother and sister, ensures the brother\'s long life and prosperity, grants divine protection to both siblings, and invokes the blessings of the family lineage',
    hi: 'भाई-बहन के पवित्र बन्धन को मजबूत करता है, भाई की दीर्घायु और समृद्धि सुनिश्चित करता है, दोनों भाई-बहनों को दिव्य रक्षा प्रदान करता है, और कुल की आशीर्वाद प्राप्ति होती है',
    sa: 'भ्रातृभगिनीपवित्रबन्धनं दृढयति, भ्रातुः दीर्घायुः समृद्धिश्च सुनिश्चिता भवति, उभयोः भ्रातृभगिन्योः दिव्यरक्षा भवति, कुलस्य आशीर्वादप्राप्तिश्च भवति',
  },
};

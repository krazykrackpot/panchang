import type { PujaVidhi } from './types';

export const GURU_PURNIMA_PUJA: PujaVidhi = {
  festivalSlug: 'guru-purnima',
  category: 'festival',
  deity: { en: 'Guru / Vyasa', hi: 'गुरु / व्यास', sa: 'गुरुः / व्यासः' },

  samagri: [
    { name: { en: 'Guru\'s photo or Paduka (sandals)', hi: 'गुरु का चित्र या पादुका (चरण पादुका)', sa: 'गुरोः चित्रम् अथवा पादुकौ' }, note: { en: 'If no personal guru, use an image of Veda Vyasa', hi: 'यदि कोई व्यक्तिगत गुरु नहीं, तो वेदव्यास का चित्र उपयोग करें', sa: 'यदि व्यक्तिगतगुरुः नास्ति, वेदव्यासस्य चित्रम् उपयोजयेत्' }, category: 'puja_items', essential: true },
    { name: { en: 'Flowers (white and yellow preferred)', hi: 'फूल (सफेद और पीले श्रेष्ठ)', sa: 'पुष्पाणि (श्वेतपीतानि श्रेष्ठानि)' }, category: 'flowers', essential: true },
    { name: { en: 'Fruits', hi: 'फल', sa: 'फलानि' }, category: 'food', essential: true },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Dakshina (monetary offering)', hi: 'दक्षिणा (धन अर्पण)', sa: 'दक्षिणा (धनार्पणम्)' }, note: { en: 'Offered to the guru or donated to a worthy cause', hi: 'गुरु को अर्पित या किसी योग्य कार्य में दान', sa: 'गुरवे अर्प्यते अथवा सत्कार्ये दीयते' }, category: 'other', essential: true },
    { name: { en: 'Books (sacred texts or study material)', hi: 'पुस्तकें (धार्मिक ग्रन्थ या अध्ययन सामग्री)', sa: 'पुस्तकानि (धर्मग्रन्थाः अध्ययनसामग्री वा)' }, category: 'other', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sweets', hi: 'मिठाई', sa: 'मिष्टान्नानि' }, category: 'food', essential: true },
    { name: { en: 'Water for Padya (foot washing)', hi: 'पाद्य (चरण प्रक्षालन) के लिए जल', sa: 'पाद्यार्थं जलम्' }, category: 'other', essential: true },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Guru Purnima puja is performed in the morning during Purva Madhyahna (forenoon) on Ashadha Purnima. The ideal time is between 7:00 AM and 12:00 PM, with the Vyasa Puja traditionally done before noon.',
    hi: 'गुरु पूर्णिमा पूजा आषाढ़ पूर्णिमा को पूर्व मध्याह्न (प्रातःकाल) में की जाती है। आदर्श समय प्रातः 7 से दोपहर 12 बजे के बीच है, व्यास पूजा परम्परागत रूप से दोपहर से पहले की जाती है।',
    sa: 'गुरुपूर्णिमापूजा आषाढपूर्णिमायां पूर्वमध्याह्ने (प्रभातकाले) क्रियते। प्रातः सप्तवादनतः मध्याह्नद्वादशवादनपर्यन्तम् आदर्शकालः, व्यासपूजा परम्परया मध्याह्नात् पूर्वं क्रियते।',
  },

  sankalpa: {
    en: 'On this auspicious Ashadha Purnima (Guru Purnima / Vyasa Purnima), I offer worship to my Guru and to the great sage Vyasa, the compiler of the Vedas, for the attainment of knowledge, wisdom, and spiritual liberation.',
    hi: 'इस शुभ आषाढ़ पूर्णिमा (गुरु पूर्णिमा / व्यास पूर्णिमा) पर, ज्ञान, विवेक और आध्यात्मिक मुक्ति की प्राप्ति के लिए, मैं अपने गुरु और वेदों के संकलनकर्ता महर्षि व्यास की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे आषाढपूर्णिमायां (गुरुपूर्णिमायां / व्यासपूर्णिमायां) ज्ञानविवेकमोक्षप्राप्त्यर्थं स्वगुरोः वेदसङ्कलयितुः महर्षेः व्यासस्य च पूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation', hi: 'तैयारी', sa: 'सज्जता' },
      description: {
        en: 'Rise early, bathe, and wear clean white or light-coloured clothes. Clean the puja area and set up the Guru\'s photo or paduka on a clean cloth. Place books and study materials near the altar.',
        hi: 'जल्दी उठें, स्नान करें और स्वच्छ सफेद या हल्के रंग के वस्त्र पहनें। पूजा स्थल साफ करें और स्वच्छ कपड़े पर गुरु का चित्र या पादुका स्थापित करें। वेदी के पास पुस्तकें और अध्ययन सामग्री रखें।',
        sa: 'प्रभाते उत्थाय स्नात्वा शुचिश्वेतवस्त्राणि मन्दवर्णानि वा धारयेत्। पूजास्थलं शोधयेत् शुचिवस्त्रे गुरोः चित्रं पादुकौ वा स्थापयेत्। वेद्याः समीपे पुस्तकानि अध्ययनसामग्रीं च स्थापयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Dhyana (Meditation on Guru)', hi: 'ध्यान (गुरु पर ध्यान)', sa: 'ध्यानम् (गुरुध्यानम्)' },
      description: {
        en: 'Sit in a meditative posture before the Guru\'s image. Close your eyes and meditate on your Guru\'s form, teachings, and grace. Remember the Guru Parampara (lineage of gurus).',
        hi: 'गुरु के चित्र के सामने ध्यान मुद्रा में बैठें। आँखें बन्द करके अपने गुरु के स्वरूप, शिक्षाओं और कृपा पर ध्यान करें। गुरु परम्परा (गुरुओं की वंश परम्परा) का स्मरण करें।',
        sa: 'गुरोः चित्रस्य पुरतः ध्यानमुद्रायां उपविशेत्। नेत्रे निमील्य स्वगुरोः स्वरूपं शिक्षाः कृपां च ध्यायेत्। गुरुपरम्पराम् (गुरूणां वंशपरम्पराम्) स्मरेत्।',
      },
      duration: '10 min',
      essential: false,
      stepType: 'meditation',
    },
    {
      step: 3,
      title: { en: 'Padya (Foot Washing)', hi: 'पाद्य (चरण प्रक्षालन)', sa: 'पाद्यम् (पादप्रक्षालनम्)' },
      description: {
        en: 'Offer padya (water for washing feet) to the Guru\'s paduka or photo. Pour water over the paduka while chanting the Guru Mantra. If visiting the Guru in person, wash the Guru\'s feet with water and apply sandalwood paste.',
        hi: 'गुरु की पादुका या चित्र को पाद्य (पैर धोने का जल) अर्पित करें। गुरु मन्त्र पढ़ते हुए पादुका पर जल डालें। यदि गुरु से सशरीर मिल रहे हैं, तो गुरु के चरण जल से धोएँ और चन्दन लेप लगाएँ।',
        sa: 'गुरोः पादुकायै चित्राय वा पाद्यं (पादप्रक्षालनजलम्) समर्पयेत्। गुरुमन्त्रं पठन् पादुकायां जलं सिञ्चेत्। यदि गुरुं साक्षात् मिलति, तर्हि गुरोः चरणौ जलेन प्रक्षाल्य चन्दनं लेपयेत्।',
      },
      mantraRef: 'guru-mantra',
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Gandha-Pushpa-Akshat', hi: 'गन्ध-पुष्प-अक्षत', sa: 'गन्धपुष्पाक्षतम्' },
      description: {
        en: 'Apply sandalwood paste and kumkum to the Guru\'s photo or paduka. Offer white and yellow flowers, and sprinkle akshat (unbroken rice).',
        hi: 'गुरु के चित्र या पादुका पर चन्दन लेप और कुमकुम लगाएँ। सफेद और पीले फूल अर्पित करें और अक्षत छिड़कें।',
        sa: 'गुरोः चित्रे पादुकायां वा चन्दनं कुङ्कुमं च लेपयेत्। श्वेतपीतपुष्पाणि समर्पयेत् अक्षतान् च विकिरेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Guru Mantra Japa', hi: 'गुरु मन्त्र जप', sa: 'गुरुमन्त्रजपः' },
      description: {
        en: 'Chant the Guru Mantra "Gurur Brahma Gurur Vishnu..." followed by the Guru Gayatri. Then recite the Guru Stotram or Guru Ashtakam if known.',
        hi: 'गुरु मन्त्र "गुरुर्ब्रह्मा गुरुर्विष्णुः..." और फिर गुरु गायत्री का जाप करें। उसके बाद गुरु स्तोत्रम् या गुरु अष्टकम् (यदि ज्ञात हो) का पाठ करें।',
        sa: 'गुरुमन्त्रम् "गुरुर्ब्रह्मा गुरुर्विष्णुः..." ततो गुरुगायत्रीं जपेत्। ततः गुरुस्तोत्रम् गुर्वष्टकं वा (यदि ज्ञातम्) पठेत्।',
      },
      mantraRef: 'guru-mantra',
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 6,
      title: { en: 'Vyasa Vandana', hi: 'व्यास वन्दना', sa: 'व्यासवन्दना' },
      description: {
        en: 'Offer special prayers to Veda Vyasa — the Adi Guru who compiled the Vedas, authored the Mahabharata, and codified the Puranas. Chant the Vyasa Vandana shloka. This is why the day is also called Vyasa Purnima.',
        hi: 'वेदव्यास — जिन्होंने वेदों का संकलन किया, महाभारत लिखा और पुराणों का संहिताकरण किया — आदि गुरु को विशेष प्रार्थना अर्पित करें। व्यास वन्दना श्लोक पढ़ें। इसीलिए इस दिन को व्यास पूर्णिमा भी कहते हैं।',
        sa: 'वेदव्यासाय — आदिगुरवे यो वेदान् सङ्कलितवान् महाभारतं रचितवान् पुराणानि च संहितीकृतवान् — विशेषप्रार्थनां समर्पयेत्। व्यासवन्दनाश्लोकं पठेत्। अतः अयं दिनं व्यासपूर्णिमा इत्यपि उच्यते।',
      },
      mantraRef: 'vyasa-vandana',
      duration: '5 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 7,
      title: { en: 'Dakshina & Naivedya', hi: 'दक्षिणा एवं नैवेद्य', sa: 'दक्षिणा नैवेद्यं च' },
      description: {
        en: 'Offer dakshina (monetary gift) to the Guru, or if worshipping at home, place dakshina at the Guru\'s paduka with the intent to donate it. Offer sweets, fruits, and coconut as naivedya.',
        hi: 'गुरु को दक्षिणा (धन उपहार) अर्पित करें, या यदि घर पर पूजा कर रहे हैं, तो दान के संकल्प से गुरु की पादुका पर दक्षिणा रखें। मिठाई, फल और नारियल नैवेद्य के रूप में अर्पित करें।',
        sa: 'गुरवे दक्षिणां (धनोपहारम्) समर्पयेत्, अथवा यदि गृहे पूजयति, दानसङ्कल्पेन गुरोः पादुकायां दक्षिणां निधद्यात्। मिष्टान्नानि फलानि नारिकेलं च नैवेद्यरूपेण निवेदयेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform aarti with camphor and ghee lamp before the Guru\'s image. Sing the Guru prayer as aarti.',
        hi: 'गुरु के चित्र के सामने कपूर और घी के दीपक से आरती करें। गुरु प्रार्थना को आरती के रूप में गाएँ।',
        sa: 'गुरोः चित्रस्य पुरतः कर्पूरघृतदीपेन आरात्रिकं कुर्यात्। गुरुप्रार्थनाम् आरात्रिकरूपेण गायेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 9,
      title: { en: 'Seek Blessings & Study', hi: 'आशीर्वाद लें और अध्ययन करें', sa: 'आशीर्वादग्रहणम् अध्ययनं च' },
      description: {
        en: 'Prostrate before the Guru\'s image and seek blessings for knowledge and wisdom. On this day, begin reading or studying something new — a new scripture, a new skill, or a new subject — as an offering to the Guru.',
        hi: 'गुरु के चित्र के सामने साष्टाङ्ग प्रणाम करें और ज्ञान व विवेक का आशीर्वाद माँगें। इस दिन कुछ नया पढ़ना या सीखना शुरू करें — कोई नया शास्त्र, कोई नया कौशल, या कोई नया विषय — गुरु को अर्पण के रूप में।',
        sa: 'गुरोः चित्रस्य पुरतः साष्टाङ्गप्रणामं कृत्वा ज्ञानविवेकस्य आशीर्वादं याचेत्। अस्मिन् दिने किमपि नवं पठितुम् अध्येतुं वा आरभेत् — नवं शास्त्रम्, नवं कौशलम्, नवं विषयं वा — गुरवे अर्पणरूपेण।',
      },
      duration: '15 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 10,
      title: { en: 'Prasad Distribution', hi: 'प्रसाद वितरण', sa: 'प्रसादवितरणम्' },
      description: {
        en: 'Distribute prasad to all present. Share knowledge or a teaching with others as spiritual prasad.',
        hi: 'सभी उपस्थित लोगों में प्रसाद बाँटें। आध्यात्मिक प्रसाद के रूप में दूसरों के साथ ज्ञान या कोई शिक्षा साझा करें।',
        sa: 'सर्वेभ्यः उपस्थितेभ्यः प्रसादं वितरेत्। आध्यात्मिकप्रसादरूपेण अन्येभ्यो ज्ञानं शिक्षां वा विभजेत्।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'guru-mantra',
      name: { en: 'Guru Mantra', hi: 'गुरु मन्त्र', sa: 'गुरुमन्त्रः' },
      devanagari: 'गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परब्रह्म तस्मै श्री गुरवे नमः॥',
      iast: 'gururbrahmā gururviṣṇuḥ gururdevo maheśvaraḥ |\nguruḥ sākṣāt parabrahma tasmai śrī gurave namaḥ ||',
      meaning: {
        en: 'The Guru is Brahma (the creator), the Guru is Vishnu (the preserver), the Guru is Shiva (the destroyer). The Guru is verily the Supreme Brahman itself. Salutations to that Guru.',
        hi: 'गुरु ब्रह्मा (सृष्टिकर्ता) हैं, गुरु विष्णु (पालनकर्ता) हैं, गुरु शिव (संहारकर्ता) हैं। गुरु साक्षात् परब्रह्म हैं। उन गुरु को नमन।',
        sa: 'गुरुः ब्रह्मा (सृष्टिकर्ता), गुरुः विष्णुः (पालयिता), गुरुः महेश्वरः (संहारकर्ता)। गुरुः साक्षात् परब्रह्म। तस्मै श्रीगुरवे नमः।',
      },
      usage: {
        en: 'The primary mantra for Guru Purnima — recite at every step of the puja and throughout the day',
        hi: 'गुरु पूर्णिमा का मुख्य मन्त्र — पूजा के प्रत्येक चरण में और पूरे दिन पढ़ें',
        sa: 'गुरुपूर्णिमायाः प्रधानमन्त्रः — पूजायाः प्रतिचरणे सम्पूर्णे दिने च पठेत्',
      },
    },
    {
      id: 'guru-gayatri',
      name: { en: 'Guru Gayatri', hi: 'गुरु गायत्री', sa: 'गुरुगायत्री' },
      devanagari: 'ॐ परमगुरवे विद्महे परमेष्ठिगुरवे धीमहि। तन्नो गुरुः प्रचोदयात्॥',
      iast: 'oṃ paramagurave vidmahe parameṣṭhigurave dhīmahi | tanno guruḥ pracodayāt ||',
      meaning: {
        en: 'We meditate upon the Supreme Guru, we contemplate the highest Guru. May the Guru inspire and illuminate us.',
        hi: 'हम परम गुरु का ध्यान करते हैं, सर्वोच्च गुरु का चिन्तन करते हैं। गुरु हमें प्रेरित और प्रकाशित करें।',
        sa: 'परमगुरुं विद्मः, परमेष्ठिगुरुं धीमहि। गुरुः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite 11 times after the Guru Mantra for deeper spiritual connection',
        hi: 'गहन आध्यात्मिक सम्बन्ध के लिए गुरु मन्त्र के बाद 11 बार पढ़ें',
        sa: 'गहनाध्यात्मिकसम्बन्धार्थं गुरुमन्त्रानन्तरम् एकादशवारं पठेत्',
      },
    },
    {
      id: 'vyasa-vandana',
      name: { en: 'Vyasa Vandana', hi: 'व्यास वन्दना', sa: 'व्यासवन्दना' },
      devanagari: 'व्यासं वसिष्ठनप्तारं शक्तेः पौत्रमकल्मषम्।\nपराशरात्मजं वन्दे शुकतातं तपोनिधिम्॥',
      iast: 'vyāsaṃ vasiṣṭhanaptāraṃ śakteḥ pautramakalmaṣam |\nparāśarātmajaṃ vande śukatātaṃ taponidhim ||',
      meaning: {
        en: 'I salute Vyasa, the great-grandson of Vasishtha, the sinless grandson of Shakti, the son of Parashara, the father of Shuka, the treasure of austerity.',
        hi: 'मैं व्यास को नमन करता हूँ — वसिष्ठ के प्रपौत्र, शक्ति के निर्मल पौत्र, पराशर के पुत्र, शुक के पिता, तपस्या के भण्डार।',
        sa: 'व्यासं वन्दे — वसिष्ठस्य नप्तारं, शक्तेः अकल्मषं पौत्रं, पराशरस्य आत्मजं, शुकस्य तातं, तपोनिधिम्।',
      },
      usage: {
        en: 'Recite during the Vyasa Vandana step to honour the Adi Guru of the Vedic tradition',
        hi: 'वैदिक परम्परा के आदि गुरु का सम्मान करने के लिए व्यास वन्दना चरण में पढ़ें',
        sa: 'वैदिकपरम्परायाः आदिगुरोः सम्मानार्थं व्यासवन्दनाचरणे पठेत्',
      },
    },
    {
      id: 'guru-dhyana-shloka',
      name: { en: 'Guru Dhyana Shloka', hi: 'गुरु ध्यान श्लोक', sa: 'गुरुध्यानश्लोकः' },
      devanagari: 'अखण्डमण्डलाकारं व्याप्तं येन चराचरम्।\nतत्पदं दर्शितं येन तस्मै श्री गुरवे नमः॥',
      iast: 'akhaṇḍamaṇḍalākāraṃ vyāptaṃ yena carācaram |\ntatpadaṃ darśitaṃ yena tasmai śrī gurave namaḥ ||',
      meaning: {
        en: 'Salutations to that Guru who revealed to me the truth of that which pervades the entire indivisible universe of moving and unmoving beings.',
        hi: 'उन गुरु को नमन जिन्होंने मुझे उस तत्त्व का दर्शन कराया जो सम्पूर्ण अखण्ड ब्रह्माण्ड में चर-अचर सबमें व्याप्त है।',
        sa: 'तस्मै श्रीगुरवे नमः येन अखण्डमण्डलाकारं चराचरव्याप्तं तत्पदं दर्शितम्।',
      },
      usage: {
        en: 'Recite during meditation on the Guru at the beginning of the puja',
        hi: 'पूजा के आरम्भ में गुरु पर ध्यान करते समय पढ़ें',
        sa: 'पूजारम्भे गुरुध्यानसमये पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Guru Ashtakam', hi: 'गुरु अष्टकम्', sa: 'गुर्वष्टकम्' },
      verseCount: 8,
      duration: '8 min',
      note: {
        en: 'Eight verses by Adi Shankaracharya glorifying the Guru. Each verse ends with "tasmai shri gurave namah".',
        hi: 'आदि शंकराचार्य रचित गुरु की महिमा के आठ श्लोक। प्रत्येक श्लोक "तस्मै श्री गुरवे नमः" से समाप्त होता है।',
        sa: 'आदिशङ्कराचार्यरचितानि गुरुमहिमायाः अष्टश्लोकाः। प्रतिश्लोकः "तस्मै श्रीगुरवे नमः" इति समाप्यते।',
      },
    },
  ],

  aarti: {
    name: { en: 'Guru Prayer (Aarti)', hi: 'गुरु प्रार्थना (आरती)', sa: 'गुरुप्रार्थना (आरात्रिकम्)' },
    devanagari:
      '॥ श्री गुरु की आरती ॥\n\nॐ जय गुरु देवा, ॐ जय गुरु देवा।\nजग के तिमिर मिटाओ, सद्गुरु देवा॥\nॐ जय गुरु देवा॥\n\nअज्ञानता का अन्धकार, तुम ज्ञान से मिटाओ।\nमोक्ष का मारग दिखाओ, पथ भूले को लाओ॥\nॐ जय गुरु देवा॥\n\nब्रह्मा विष्णु महेश्वर, तुम सबके रूप।\nगुरुकृपा बिन ज्ञान नहीं, तुम ज्ञान स्वरूप॥\nॐ जय गुरु देवा॥\n\nगुरु की आरती जो कोई, नर नारी गावै।\nगुरुकृपा को प्राप्त कर, भवसागर तर जावै॥\nॐ जय गुरु देवा॥',
    iast:
      '|| śrī guru kī āratī ||\n\noṃ jaya guru devā, oṃ jaya guru devā |\njaga ke timira miṭāo, sadguru devā ||\noṃ jaya guru devā ||\n\najñānatā kā andhakāra, tuma jñāna se miṭāo |\nmokṣa kā māraga dikhāo, patha bhūle ko lāo ||\noṃ jaya guru devā ||\n\nbrahmā viṣṇu maheśvara, tuma sabake rūpa |\ngurukṛpā bina jñāna nahīṃ, tuma jñāna svarūpa ||\noṃ jaya guru devā ||\n\nguru kī āratī jo koī, nara nārī gāvai |\ngurukṛpā ko prāpta kara, bhavasāgara tara jāvai ||\noṃ jaya guru devā ||',
  },

  naivedya: {
    en: 'Sweets (pedha, barfi), fresh fruits, coconut, dry fruits, and kheer',
    hi: 'मिठाई (पेड़ा, बर्फी), ताजे फल, नारियल, मेवे और खीर',
    sa: 'मिष्टान्नानि (पेदकम्, बर्फी), नवफलानि, नारिकेलम्, शुष्कफलानि, पायसं च',
  },

  precautions: [
    {
      en: 'Approach the Guru (or Guru\'s image) with utmost humility — ego is the greatest barrier to receiving the Guru\'s grace',
      hi: 'गुरु (या गुरु के चित्र) के पास अत्यन्त विनम्रता से जाएँ — अहंकार गुरु कृपा प्राप्ति में सबसे बड़ी बाधा है',
      sa: 'गुरुं (अथवा गुरोः चित्रम्) परमविनयेन उपगच्छेत् — अहङ्कारः गुरुकृपाप्राप्तौ सर्वोत्तमा बाधा',
    },
    {
      en: 'Do not step on or disrespect books, instruments, or any source of knowledge on this day — they represent the Guru\'s teachings',
      hi: 'इस दिन पुस्तकों, उपकरणों या ज्ञान के किसी भी स्रोत पर पैर न रखें या अपमान न करें — वे गुरु की शिक्षाओं का प्रतिनिधित्व करते हैं',
      sa: 'अस्मिन् दिने पुस्तकानि उपकरणानि ज्ञानस्रोतांसि वा पादेन न स्पृशेत् अवमानं वा न कुर्यात् — तानि गुरोः शिक्षाणां प्रतिनिधयः',
    },
    {
      en: 'If possible, visit your Guru in person and offer seva (selfless service) rather than just material gifts',
      hi: 'यदि सम्भव हो, तो गुरु से सशरीर मिलें और केवल भौतिक उपहारों के बजाय सेवा (निस्स्वार्थ सेवा) अर्पित करें',
      sa: 'यदि शक्यं गुरुं साक्षात् मिलित्वा केवलभौतिकोपहारात् सेवां (निस्स्वार्थसेवाम्) एव समर्पयेत्',
    },
    {
      en: 'Spend time reading, studying, or learning something new — this is the best offering to the Guru',
      hi: 'पढ़ने, अध्ययन करने या कुछ नया सीखने में समय बिताएँ — यह गुरु को सबसे उत्तम अर्पण है',
      sa: 'पठने अध्ययने किमपि नवम् अध्यतुं वा समयं यापयेत् — इदं गुरवे सर्वोत्तमम् अर्पणम्',
    },
  ],

  phala: {
    en: 'Attainment of true knowledge and wisdom, destruction of ignorance, spiritual progress and liberation, blessings of the entire Guru Parampara, success in education and learning, and the grace of Veda Vyasa',
    hi: 'सच्चे ज्ञान और विवेक की प्राप्ति, अज्ञान का नाश, आध्यात्मिक प्रगति और मुक्ति, सम्पूर्ण गुरु परम्परा का आशीर्वाद, शिक्षा और अध्ययन में सफलता, और वेदव्यास की कृपा',
    sa: 'सत्यज्ञानविवेकप्राप्तिः, अज्ञाननाशः, आध्यात्मिकप्रगतिमोक्षः, सम्पूर्णगुरुपरम्परायाः आशीर्वादः, शिक्षाध्ययनसिद्धिः, वेदव्यासकृपा च',
  },
};

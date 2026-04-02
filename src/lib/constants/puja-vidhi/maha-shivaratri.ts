import type { PujaVidhi } from './types';

export const MAHA_SHIVARATRI_PUJA: PujaVidhi = {
  festivalSlug: 'maha-shivaratri',
  category: 'vrat',
  deity: { en: 'Shiva', hi: 'शिव', sa: 'शिवः' },

  samagri: [
    { name: { en: 'Shivlinga', hi: 'शिवलिंग', sa: 'शिवलिङ्गम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Bilva (Bel) leaves', hi: 'बिल्व (बेल) पत्र', sa: 'बिल्वपत्राणि' }, note: { en: 'Three-leaf clusters, must be unbroken', hi: 'तीन पत्तियों के गुच्छे, बिना टूटे हों', sa: 'त्रिदलानि, अभग्नानि भवेयुः' } , category: 'flowers', essential: true },
    { name: { en: 'Milk', hi: 'दूध', sa: 'क्षीरम्' } , category: 'food', essential: true },
    { name: { en: 'Water (Ganga Jal preferred)', hi: 'जल (गंगा जल श्रेष्ठ)', sa: 'जलम् (गङ्गाजलं श्रेष्ठम्)' } , category: 'puja_items', essential: true },
    { name: { en: 'Honey', hi: 'शहद', sa: 'मधु' } , category: 'food', essential: true },
    { name: { en: 'Curd (yogurt)', hi: 'दही', sa: 'दधि' } , category: 'food', essential: true },
    { name: { en: 'Ghee (clarified butter)', hi: 'घी', sa: 'घृतम्' } , category: 'food', essential: true },
    { name: { en: 'Sugar', hi: 'शक्कर', sa: 'शर्करा' } , category: 'food', essential: false },
    { name: { en: 'Dhatura flowers', hi: 'धतूरे के फूल', sa: 'धत्तूरपुष्पाणि' } , category: 'flowers', essential: false },
    { name: { en: 'White flowers', hi: 'सफेद फूल', sa: 'श्वेतपुष्पाणि' } , category: 'flowers', essential: false },
    { name: { en: 'Bhasma (sacred ash)', hi: 'भस्म (विभूति)', sa: 'भस्म (विभूतिः)' } , category: 'puja_items', essential: true },
    { name: { en: 'Rudraksha', hi: 'रुद्राक्ष', sa: 'रुद्राक्षः' } , category: 'puja_items', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Bhang (cannabis paste, optional)', hi: 'भाँग (वैकल्पिक)', sa: 'भङ्गा (वैकल्पिकम्)' }, note: { en: 'Traditional offering; check local laws', hi: 'पारम्परिक अर्पण; स्थानीय कानून जाँचें', sa: 'पारम्परिकं समर्पणम्; स्थानीयनियमान् परीक्षेत्' } , category: 'food', essential: false },
    { name: { en: 'Panchamrit (milk, curd, ghee, honey, sugar)', hi: 'पंचामृत (दूध, दही, घी, शहद, शक्कर)', sa: 'पञ्चामृतम् (क्षीर-दधि-घृत-मधु-शर्करा)' } , category: 'food', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Nishita Kaal (midnight) is the most auspicious time for Maha Shivaratri puja. The traditional observance includes 4 prahar pujas throughout the night — each prahar lasting approximately 3 hours from sunset to sunrise.',
    hi: 'निशीथ काल (मध्यरात्रि) महाशिवरात्रि पूजा के लिए सर्वाधिक शुभ समय है। पारम्परिक उपासना में रात भर 4 प्रहर पूजाएँ होती हैं — प्रत्येक प्रहर सूर्यास्त से सूर्योदय तक लगभग 3 घण्टे का।',
    sa: 'निशीथकालः (अर्धरात्रिः) महाशिवरात्रिपूजायाः सर्वोत्तमः शुभकालः। पारम्परिकोपासने रात्रौ चत्वारि प्रहरपूजनानि भवन्ति — प्रत्येकं प्रहरं सूर्यास्तात् सूर्योदयपर्यन्तं प्रायः त्रिहोरात्मकम्।',
  },
  muhurtaWindow: { type: 'nishita' },

  sankalpa: {
    en: 'On this sacred Maha Shivaratri, I undertake this vrat and puja of Lord Shiva for the attainment of his grace, liberation from the cycle of birth and death, and purification of all sins.',
    hi: 'इस पवित्र महाशिवरात्रि पर, भगवान शिव की कृपा प्राप्ति, जन्म-मरण के चक्र से मुक्ति और सभी पापों के शुद्धिकरण के लिए, मैं यह व्रत और पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पुण्ये महाशिवरात्रिपर्वणि शिवानुग्रहप्राप्त्यर्थं जन्ममृत्युचक्रान्मोक्षार्थं सर्वपापशुद्ध्यर्थं च श्रीशिवपूजनव्रतमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Vrat Sankalpa and Preparation', hi: 'व्रत संकल्प और तैयारी', sa: 'व्रतसङ्कल्पः सज्जता च' },
      description: {
        en: 'Begin the fast from morning. Take a bath, wear clean clothes, and make the formal sankalpa for the Shivaratri vrat at the Shivlinga.',
        hi: 'प्रातःकाल से उपवास आरम्भ करें। स्नान कर स्वच्छ वस्त्र पहनें और शिवलिंग पर शिवरात्रि व्रत का औपचारिक संकल्प लें।',
        sa: 'प्रातः उपवासम् आरभेत। स्नात्वा शुचिवस्त्राणि धारयेत् शिवलिङ्गे शिवरात्रिव्रतस्य औपचारिकसङ्कल्पं कुर्यात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Achamana and Pranayama', hi: 'आचमन और प्राणायाम', sa: 'आचमनं प्राणायामः च' },
      description: {
        en: 'Perform achamana (water sipping) for purification, followed by three rounds of pranayama (breath control) to calm the mind.',
        hi: 'शुद्धि के लिए आचमन करें, उसके बाद मन शान्त करने के लिए तीन बार प्राणायाम करें।',
        sa: 'शुद्ध्यर्थम् आचमनं कुर्यात्, ततः मनःशान्त्यर्थं त्रिवारं प्राणायामं कुर्यात्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Dhyana (Meditation on Shiva)', hi: 'ध्यान (शिव पर)', sa: 'ध्यानम् (शिवस्य)' },
      description: {
        en: 'Meditate on Lord Shiva — three-eyed, moon-crested, blue-throated, holding the trident, damaru, and blessing mudra, seated on Mount Kailash with Nandi.',
        hi: 'भगवान शिव का ध्यान करें — त्रिनेत्र, चन्द्रमौलि, नीलकण्ठ, त्रिशूल, डमरू और वरदमुद्रा धारी, कैलाश पर्वत पर नन्दी सहित विराजमान।',
        sa: 'त्रिनेत्रं चन्द्रमौलिं नीलकण्ठं त्रिशूलडमरुवरदमुद्राधारिणं कैलासपर्वते नन्दिसहितं श्रीशिवं ध्यायेत्।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'meditation',
    },
    {
      step: 4,
      title: { en: 'First Prahar Puja — Milk Abhishek', hi: 'प्रथम प्रहर पूजा — दुग्ध अभिषेक', sa: 'प्रथमप्रहरपूजा — क्षीराभिषेकः' },
      description: {
        en: 'Perform the first prahar puja (approximately 6 PM to 9 PM). Bathe the Shivlinga with milk while chanting Om Namah Shivaya. Offer bilva leaves and white flowers. Light a ghee lamp and incense.',
        hi: 'प्रथम प्रहर पूजा करें (लगभग शाम 6 से 9 बजे)। "ॐ नमः शिवाय" का जाप करते हुए शिवलिंग पर दूध से अभिषेक करें। बिल्व पत्र और सफेद फूल चढ़ाएँ। घी का दीपक और धूप जलाएँ।',
        sa: 'प्रथमप्रहरपूजां कुर्यात् (प्रायः सायं षड्वादनतः नववादनपर्यन्तम्)। "ॐ नमः शिवाय" जपन् शिवलिङ्गं क्षीरेण अभिषिञ्चेत्। बिल्वपत्राणि श्वेतपुष्पाणि च समर्पयेत्। घृतदीपं धूपं च प्रज्वालयेत्।',
      },
      mantraRef: 'panchakshari',
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Second Prahar Puja — Curd Abhishek', hi: 'द्वितीय प्रहर पूजा — दधि अभिषेक', sa: 'द्वितीयप्रहरपूजा — दध्यभिषेकः' },
      description: {
        en: 'Perform the second prahar puja (approximately 9 PM to 12 AM). Bathe the Shivlinga with curd. Offer bilva leaves, dhatura flowers, and bhasma. Recite the Rudra Gayatri Mantra.',
        hi: 'द्वितीय प्रहर पूजा करें (लगभग रात 9 से 12 बजे)। शिवलिंग पर दही से अभिषेक करें। बिल्व पत्र, धतूरे के फूल और भस्म चढ़ाएँ। रुद्र गायत्री मन्त्र का पाठ करें।',
        sa: 'द्वितीयप्रहरपूजां कुर्यात् (प्रायः रात्रौ नववादनतः द्वादशवादनपर्यन्तम्)। शिवलिङ्गं दध्ना अभिषिञ्चेत्। बिल्वपत्राणि धत्तूरपुष्पाणि भस्म च समर्पयेत्। रुद्रगायत्रीमन्त्रं पठेत्।',
      },
      mantraRef: 'rudra-gayatri',
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Third Prahar Puja — Ghee Abhishek', hi: 'तृतीय प्रहर पूजा — घृत अभिषेक', sa: 'तृतीयप्रहरपूजा — घृताभिषेकः' },
      description: {
        en: 'Perform the third prahar puja (approximately 12 AM to 3 AM). Bathe the Shivlinga with ghee. Offer bilva leaves and incense. Chant the Maha Mrityunjaya Mantra 108 times.',
        hi: 'तृतीय प्रहर पूजा करें (लगभग रात 12 से 3 बजे)। शिवलिंग पर घी से अभिषेक करें। बिल्व पत्र और धूप चढ़ाएँ। महामृत्युञ्जय मन्त्र 108 बार जपें।',
        sa: 'तृतीयप्रहरपूजां कुर्यात् (प्रायः अर्धरात्रात् त्रिवादनपर्यन्तम्)। शिवलिङ्गं घृतेन अभिषिञ्चेत्। बिल्वपत्राणि धूपं च समर्पयेत्। महामृत्युञ्जयमन्त्रम् अष्टोत्तरशतवारं जपेत्।',
      },
      mantraRef: 'maha-mrityunjaya',
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Fourth Prahar Puja — Honey Abhishek', hi: 'चतुर्थ प्रहर पूजा — मधु अभिषेक', sa: 'चतुर्थप्रहरपूजा — मध्वभिषेकः' },
      description: {
        en: 'Perform the fourth prahar puja (approximately 3 AM to 6 AM). Bathe the Shivlinga with honey. Offer bilva leaves, bhasma, and rudraksha. Recite the Shiva Dhyana Mantra.',
        hi: 'चतुर्थ प्रहर पूजा करें (लगभग रात 3 से 6 बजे)। शिवलिंग पर शहद से अभिषेक करें। बिल्व पत्र, भस्म और रुद्राक्ष चढ़ाएँ। शिव ध्यान मन्त्र का पाठ करें।',
        sa: 'चतुर्थप्रहरपूजां कुर्यात् (प्रायः त्रिवादनतः षड्वादनपर्यन्तम्)। शिवलिङ्गं मधुना अभिषिञ्चेत्। बिल्वपत्राणि भस्म रुद्राक्षं च समर्पयेत्। शिवध्यानमन्त्रं पठेत्।',
      },
      mantraRef: 'shiva-dhyana',
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Shiva Gayatri and Panchakshari Japa', hi: 'शिव गायत्री और पञ्चाक्षरी जप', sa: 'शिवगायत्रीपञ्चाक्षरीजपः' },
      description: {
        en: 'Between prahar pujas, maintain continuous japa of Om Namah Shivaya and periodically recite the Shiva Gayatri Mantra.',
        hi: 'प्रहर पूजाओं के बीच, "ॐ नमः शिवाय" का निरन्तर जप करें और समय-समय पर शिव गायत्री मन्त्र का पाठ करें।',
        sa: 'प्रहरपूजयोः मध्ये "ॐ नमः शिवाय" इत्यस्य निरन्तरं जपं कुर्यात् प्रायः शिवगायत्रीमन्त्रं च पठेत्।',
      },
      mantraRef: 'shiva-gayatri',
      duration: 'Ongoing',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 9,
      title: { en: 'Dhupa (Incense)', hi: 'धूप', sa: 'धूपम्' },
      description: {
        en: 'Offer incense before the Shivlinga during each prahar. Use natural incense or camphor.',
        hi: 'प्रत्येक प्रहर में शिवलिंग के सामने धूप अर्पित करें। प्राकृतिक धूप या कपूर का उपयोग करें।',
        sa: 'प्रतिप्रहरे शिवलिङ्गस्य पुरतः धूपं समर्पयेत्। प्राकृतिकं धूपं कर्पूरं वा उपयोजयेत्।',
      },
      duration: '2 min per prahar',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 10,
      title: { en: 'Deepa (Lamp)', hi: 'दीप', sa: 'दीपम्' },
      description: {
        en: 'Keep a ghee lamp burning throughout the night near the Shivlinga. Relight if it goes out.',
        hi: 'शिवलिंग के पास रात भर घी का दीपक जलता रखें। बुझ जाए तो पुनः जलाएँ।',
        sa: 'शिवलिङ्गसमीपे सर्वां रात्रिं घृतदीपं ज्वालयेत्। निर्वाणे सति पुनः प्रज्वालयेत्।',
      },
      duration: 'Continuous',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 11,
      title: { en: 'Naivedya', hi: 'नैवेद्य', sa: 'नैवेद्यम्' },
      description: {
        en: 'Offer fruits, bel sherbet, thandai, and dry fruits as naivedya. Some offer bhang as per tradition.',
        hi: 'फल, बेल का शरबत, ठण्डाई और मेवे नैवेद्य के रूप में अर्पित करें। परम्परानुसार कुछ लोग भाँग भी चढ़ाते हैं।',
        sa: 'फलानि बिल्वपानकं शीतलपानकं शुष्कफलानि च नैवेद्यरूपेण निवेदयेत्। परम्परया केचित् भङ्गां समर्पयन्ति।',
      },
      duration: '3 min per prahar',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 12,
      title: { en: 'Rudram-Chamakam Recitation', hi: 'रुद्रम्-चमकम् पाठ', sa: 'रुद्रचमकपाठः' },
      description: {
        en: 'If possible, recite the Rudram (Namakam and Chamakam) from the Yajur Veda. This is the highest form of Shiva worship.',
        hi: 'यदि सम्भव हो, यजुर्वेद से रुद्रम् (नमकम् और चमकम्) का पाठ करें। यह शिव पूजा का सर्वोच्च रूप है।',
        sa: 'शक्ये सति यजुर्वेदस्य रुद्रम् (नमकं चमकं च) पठेत्। इदं शिवपूजायाः सर्वोत्कृष्टं स्वरूपम्।',
      },
      duration: '30 min',
      essential: false,
      stepType: 'mantra',
    },
    {
      step: 13,
      title: { en: 'Shiva Aarti', hi: 'शिव आरती', sa: 'शिवारात्रिकम्' },
      description: {
        en: 'Perform aarti with camphor and ghee lamp after each prahar puja, singing "Om Jai Shiv Omkara".',
        hi: 'प्रत्येक प्रहर पूजा के बाद कपूर और घी के दीपक से "ॐ जय शिव ओंकारा" गाते हुए आरती करें।',
        sa: 'प्रतिप्रहरपूजानन्तरं कर्पूरघृतदीपेन "ॐ जय शिव ओंकारा" गायन्ती आरात्रिकं कुर्यात्।',
      },
      duration: '5 min per prahar',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 14,
      title: { en: 'Pradakshina', hi: 'प्रदक्षिणा', sa: 'प्रदक्षिणा' },
      description: {
        en: 'Circumambulate the Shivlinga — but traditionally for Shiva, do NOT cross the water channel (Jalhari/Argha). Go halfway and return from the other side.',
        hi: 'शिवलिंग की परिक्रमा करें — पर परम्परा अनुसार शिव के लिए जलहरी (अर्घा) को पार न करें। आधे जाकर दूसरी तरफ से लौटें।',
        sa: 'शिवलिङ्गस्य प्रदक्षिणां कुर्यात् — परन्तु परम्परया शिवस्य जलधारां (अर्घाम्) न लङ्घयेत्। अर्धं गत्वा अन्यस्मात् पार्श्वात् प्रत्यागच्छेत्।',
      },
      duration: '3 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 15,
      title: { en: 'Parana (Breaking the Fast)', hi: 'पारण (व्रत खोलना)', sa: 'पारणम् (व्रतभङ्गः)' },
      description: {
        en: 'After the 4th prahar puja, at sunrise, complete the final puja. Break the fast after sunrise with sattvic food — fruits, milk, or simple vegetarian food.',
        hi: 'चतुर्थ प्रहर पूजा के बाद, सूर्योदय पर अन्तिम पूजा सम्पन्न करें। सूर्योदय के बाद सात्विक भोजन — फल, दूध, या सादा शाकाहारी भोजन से व्रत खोलें।',
        sa: 'चतुर्थप्रहरपूजानन्तरं सूर्योदये अन्तिमां पूजां सम्पादयेत्। सूर्योदयानन्तरं सात्त्विकाहारेण — फलैः, क्षीरेण, सादशाकाहारेण वा व्रतं भिन्द्यात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'panchakshari',
      name: { en: 'Panchakshari Mantra', hi: 'पञ्चाक्षरी मन्त्र', sa: 'पञ्चाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमः शिवाय',
      iast: 'oṃ namaḥ śivāya',
      meaning: {
        en: 'Salutations to Lord Shiva — the five-syllable mantra is the essence of all Vedas',
        hi: 'भगवान शिव को नमन — यह पञ्चाक्षरी मन्त्र सभी वेदों का सार है',
        sa: 'शिवाय नमः — अयं पञ्चाक्षरीमन्त्रः सर्ववेदसारः',
      },
      usage: {
        en: 'Chant continuously throughout the night — the primary mantra for Shivaratri jagran',
        hi: 'रात भर निरन्तर जपें — शिवरात्रि जागरण का प्रमुख मन्त्र',
        sa: 'सर्वां रात्रिं निरन्तरं जपेत् — शिवरात्रिजागरणस्य प्रधानमन्त्रः',
      },
    },
    {
      id: 'shiva-gayatri',
      name: { en: 'Shiva Gayatri Mantra', hi: 'शिव गायत्री मन्त्र', sa: 'शिवगायत्रीमन्त्रः' },
      devanagari: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्',
      iast: 'oṃ tatpuruṣāya vidmahe mahādevāya dhīmahi tanno rudraḥ pracodayāt',
      meaning: {
        en: 'We meditate upon the Supreme Being, we contemplate the Great God. May that Rudra inspire and illuminate us.',
        hi: 'हम परमपुरुष को जानते हैं, महादेव का ध्यान करते हैं। वह रुद्र हमें प्रेरित करें।',
        sa: 'तत्पुरुषं विजानीमहे महादेवं ध्यायामहे। रुद्रः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite during each prahar puja for invoking Shiva\'s supreme consciousness',
        hi: 'शिव की परम चेतना के आवाहन के लिए प्रत्येक प्रहर पूजा में पढ़ें',
        sa: 'शिवस्य परमचैतन्यावाहनार्थं प्रतिप्रहरपूजायां पठेत्',
      },
    },
    {
      id: 'maha-mrityunjaya',
      name: { en: 'Maha Mrityunjaya Mantra', hi: 'महामृत्युञ्जय मन्त्र', sa: 'महामृत्युञ्जयमन्त्रः' },
      devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥',
      iast: 'oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam | urvārukamiva bandhanānmṛtyormukṣīya māmṛtāt ||',
      meaning: {
        en: 'We worship the three-eyed Lord (Shiva) who is fragrant and nourishes all beings. As a cucumber is liberated from its vine, may we be freed from death, not from immortality.',
        hi: 'हम त्रिनेत्रधारी (शिव) की पूजा करते हैं जो सुगन्धित हैं और सभी प्राणियों का पोषण करते हैं। जैसे ककड़ी अपनी बेल से मुक्त होती है, वैसे हमें मृत्यु से मुक्ति मिले, अमृत से नहीं।',
        sa: 'त्र्यम्बकं सुगन्धिं पुष्टिवर्धनं यजामहे। उर्वारुकमिव बन्धनात् मृत्योः मुक्षीय, अमृतात् मा (मुक्षीय)।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the third prahar for protection from untimely death and attainment of liberation',
        hi: 'अकाल मृत्यु से रक्षा और मोक्ष प्राप्ति के लिए तृतीय प्रहर में 108 बार जपें',
        sa: 'अकालमृत्युरक्षार्थं मोक्षप्राप्त्यर्थं च तृतीयप्रहरे अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'rudra-gayatri',
      name: { en: 'Rudra Gayatri Mantra', hi: 'रुद्र गायत्री मन्त्र', sa: 'रुद्रगायत्रीमन्त्रः' },
      devanagari: 'ॐ तत्पुरुषाय विद्महे वागीशाय धीमहि तन्नो रुद्रः प्रचोदयात्',
      iast: 'oṃ tatpuruṣāya vidmahe vāgīśāya dhīmahi tanno rudraḥ pracodayāt',
      meaning: {
        en: 'We meditate upon the Supreme Being, we contemplate the Lord of Speech. May that Rudra inspire and illuminate us.',
        hi: 'हम परमपुरुष को जानते हैं, वाणी के ईश्वर का ध्यान करते हैं। वह रुद्र हमें प्रेरित करें।',
        sa: 'तत्पुरुषं विजानीमहे वागीशं ध्यायामहे। रुद्रः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite during the second prahar puja for invoking Rudra\'s grace',
        hi: 'रुद्र की कृपा के आवाहन के लिए द्वितीय प्रहर पूजा में पढ़ें',
        sa: 'रुद्रानुग्रहावाहनार्थं द्वितीयप्रहरपूजायां पठेत्',
      },
    },
    {
      id: 'shiva-dhyana',
      name: { en: 'Shiva Dhyana Mantra', hi: 'शिव ध्यान मन्त्र', sa: 'शिवध्यानमन्त्रः' },
      devanagari: 'ध्यायेन्नित्यं महेशं रजतगिरिनिभं चारुचन्द्रावतंसं रत्नाकल्पोज्ज्वलाङ्गं परशुमृगवराभीतिहस्तं प्रसन्नम्। पद्मासीनं समन्तात् स्तुतममरगणैर्व्याघ्रकृत्तिं वसानं विश्वाद्यं विश्ववन्द्यं निखिलभयहरं पञ्चवक्त्रं त्रिनेत्रम्॥',
      iast: 'dhyāyennityaṃ maheśaṃ rajatagirinibhaṃ cārucandāvataṃsaṃ ratnākalpojjvalāṅgaṃ paraśumṛgavarābhītihastṃ prasannam | padmāsīnaṃ samantāt stutamamaragaṇairvyāghrakṛttiṃ vasānaṃ viśvādyaṃ viśvavandyaṃ nikhilabhayaharaṃ pañcavaktraṃ trinetram ||',
      meaning: {
        en: 'One should always meditate on Maheshwara — who shines like a silver mountain, adorned with the beautiful moon, whose limbs gleam with jewel-ornaments, who holds an axe, deer, boon-giving and fear-removing hands, who is serene, seated on lotus, praised by the gods, wearing a tiger skin, the origin and lord of the universe, remover of all fear, five-faced and three-eyed.',
        hi: 'सदा महेश्वर का ध्यान करें — जो रजत पर्वत सम चमकते हैं, सुन्दर चन्द्र से अलंकृत, रत्नाभूषणों से दीप्त, परशु-मृग-वर-अभय मुद्रा धारी, प्रसन्न, पद्मासीन, देवताओं द्वारा स्तुत, व्याघ्रचर्म वस्त्र, विश्व के आदि, विश्ववन्दनीय, सभी भयों के हर्ता, पञ्चमुख और त्रिनेत्र।',
        sa: 'महेशं रजतगिरिनिभं चन्द्रावतंसं रत्नोज्ज्वलाङ्गं परशुमृगवराभीतिहस्तं प्रसन्नं पद्मासीनम् अमरस्तुतं व्याघ्रचर्मवसानं विश्वाद्यं विश्ववन्द्यं भयहरं पञ्चवक्त्रं त्रिनेत्रं नित्यं ध्यायेत्।',
      },
      usage: {
        en: 'Recite during the fourth prahar for deep meditation on Shiva\'s cosmic form',
        hi: 'शिव के विश्वरूप पर गहन ध्यान के लिए चतुर्थ प्रहर में पढ़ें',
        sa: 'शिवस्य विश्वरूपे गभीरध्यानार्थं चतुर्थप्रहरे पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Rudram (Namakam & Chamakam)', hi: 'रुद्रम् (नमकम् और चमकम्)', sa: 'रुद्रम् (नमकं चमकं च)' },
      verseCount: 66,
      duration: '30 min',
      note: {
        en: 'The supreme Vedic hymn to Rudra-Shiva from the Yajur Veda. Considered the highest form of Shiva worship.',
        hi: 'यजुर्वेद से रुद्र-शिव का सर्वोच्च वैदिक सूक्त। शिव पूजा का सर्वोत्कृष्ट रूप माना जाता है।',
        sa: 'यजुर्वेदस्य रुद्रशिवस्य सर्वोच्चं वैदिकसूक्तम्। शिवपूजायाः सर्वोत्कृष्टं स्वरूपं मन्यते।',
      },
    },
    {
      name: { en: 'Shiva Tandava Stotram', hi: 'शिव ताण्डव स्तोत्रम्', sa: 'शिवताण्डवस्तोत्रम्' },
      verseCount: 16,
      duration: '10 min',
      note: {
        en: 'Composed by Ravana in praise of Shiva\'s cosmic dance. Powerful rhythmic hymn recited during jagran.',
        hi: 'शिव के ताण्डव नृत्य की स्तुति में रावण द्वारा रचित। जागरण के दौरान गाया जाने वाला शक्तिशाली लयबद्ध स्तोत्र।',
        sa: 'शिवस्य ताण्डवनृत्यस्तुत्यर्थं रावणेन रचितम्। जागरणे गेयं शक्तिशालि छन्दोबद्धस्तोत्रम्।',
      },
    },
    {
      name: { en: 'Lingashtakam', hi: 'लिंगाष्टकम्', sa: 'लिङ्गाष्टकम्' },
      verseCount: 8,
      duration: '5 min',
      note: {
        en: 'Eight verses in praise of the Shivlinga. Ideal for recitation during abhishek.',
        hi: 'शिवलिंग की स्तुति में आठ श्लोक। अभिषेक के दौरान पाठ के लिए आदर्श।',
        sa: 'शिवलिङ्गस्तुत्यर्थम् अष्टश्लोकाः। अभिषेककाले पठनार्थम् आदर्शम्।',
      },
    },
  ],

  aarti: {
    name: { en: 'Om Jai Shiv Omkara', hi: 'ॐ जय शिव ओंकारा', sa: 'ॐ जय शिव ओंकारा' },
    devanagari: `ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव, अर्द्धाङ्गी धारा॥
ॐ जय शिव ओंकारा॥

एकानन चतुरानन पञ्चानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे॥
ॐ जय शिव ओंकारा॥

दो भुज चार चतुर्भुज दसभुज अति सोहे।
त्रिगुण रूप निरखता त्रिभुवन जन मोहे॥
ॐ जय शिव ओंकारा॥

अक्षमाला वनमाला मुण्डमाला धारी।
त्रिपुरारी कंसारी कर माला धारी॥
ॐ जय शिव ओंकारा॥

श्वेताम्बर पीताम्बर बाघम्बर अङ्गे।
सनकादिक गरुणादिक भूतादिक संगे॥
ॐ जय शिव ओंकारा॥

कर के मध्य कमण्डलु चक्र त्रिशूलधारी।
सुखकारी दुखहारी जगपालनकारी॥
ॐ जय शिव ओंकारा॥

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर में शोभित ये तीनों एका॥
ॐ जय शिव ओंकारा॥

काशी में विश्वनाथ विराजे नन्दी ब्रह्मचारी।
नित उठ दर्शन पावे महिमा अति भारी॥
ॐ जय शिव ओंकारा॥`,
    iast: `oṃ jaya śiva oṃkārā, svāmī jaya śiva oṃkārā |
brahmā viṣṇu sadāśiva, arddhāṅgī dhārā ||
oṃ jaya śiva oṃkārā ||

ekānana caturānana pañcānana rāje |
haṃsāsana garuḍāsana vṛṣavāhana sāje ||
oṃ jaya śiva oṃkārā ||

do bhuja cāra caturbhuja dasabhuja ati sohe |
triguṇa rūpa nirakhatā tribhuvana jana mohe ||
oṃ jaya śiva oṃkārā ||

akṣamālā vanamālā muṇḍamālā dhārī |
tripurārī kaṃsārī kara mālā dhārī ||
oṃ jaya śiva oṃkārā ||

śvetāmbara pītāmbara bāghambara aṅge |
sanakādika garuṇādika bhūtādika saṅge ||
oṃ jaya śiva oṃkārā ||

kara ke madhya kamaṇḍalu cakra triśūladhārī |
sukhakārī dukhahārī jagapālanakārī ||
oṃ jaya śiva oṃkārā ||

brahmā viṣṇu sadāśiva jānata avivekā |
praṇavākṣara mẽ śobhita ye tīnõ ekā ||
oṃ jaya śiva oṃkārā ||

kāśī mẽ viśvanātha virāje nandī brahmacārī |
nita uṭha darśana pāve mahimā ati bhārī ||
oṃ jaya śiva oṃkārā ||`,
  },

  naivedya: {
    en: 'Fresh fruits (especially bel fruit), thandai (cold milk drink with almonds and spices), dry fruits, bel sherbet, and milk-based sweets',
    hi: 'ताजे फल (विशेषकर बेल फल), ठण्डाई (बादाम और मसालों वाला ठण्डा दूध), मेवे, बेल का शरबत और दूध से बनी मिठाइयाँ',
    sa: 'नवफलानि (विशेषतः बिल्वफलम्), शीतलक्षीरपानकम् (बादाममसालसहितम्), शुष्कफलानि, बिल्वपानकम्, क्षीरनिर्मितमिष्टान्नानि च',
  },

  precautions: [
    {
      en: 'Maintain a complete fast — nirjala (without water) is the strictest form, or observe phalahar (fruits and milk only)',
      hi: 'पूर्ण उपवास रखें — निर्जला (बिना जल) सबसे कठोर रूप है, या फलाहार (केवल फल और दूध) करें',
      sa: 'पूर्णम् उपवासं पालयेत् — निर्जलव्रतं कठिनतमम्, अथवा फलाहारं (फलानि क्षीरं च मात्रम्) कुर्यात्',
    },
    {
      en: 'Stay awake throughout the night (jagran) — sleeping is prohibited during the vrat until the morning puja is complete',
      hi: 'रात भर जागते रहें (जागरण) — प्रातःकालीन पूजा सम्पन्न होने तक व्रत में सोना निषिद्ध है',
      sa: 'सर्वां रात्रिं जागृयात् (जागरणम्) — प्रातःपूजासम्पन्नतापर्यन्तं व्रते निद्रा निषिद्धा',
    },
    {
      en: 'Do not sleep until the morning puja after the 4th prahar is complete and the fast is broken',
      hi: 'चतुर्थ प्रहर के बाद प्रातःकालीन पूजा सम्पन्न होने और व्रत खुलने तक न सोएँ',
      sa: 'चतुर्थप्रहरानन्तरं प्रातःपूजासम्पादनं व्रतभञ्जनं च यावत् न निद्रायात्',
    },
    {
      en: 'Bilva (Bel) leaves must be unbroken with three intact leaflets — do not offer torn or damaged leaves',
      hi: 'बिल्व (बेल) पत्र तीन अखण्ड पत्तियों सहित बिना टूटे होने चाहिए — फटे या क्षतिग्रस्त पत्ते न चढ़ाएँ',
      sa: 'बिल्वपत्राणि अभग्नानि सत्रिदलानि भवेयुः — छिन्नानि भग्नानि वा पत्राणि न समर्पयेत्',
    },
    {
      en: 'Water used for abhishek should not be collected or reused — let it flow away or into a designated drain',
      hi: 'अभिषेक में प्रयुक्त जल एकत्र न करें या पुनः उपयोग न करें — इसे बहने दें या निर्धारित नाली में जाने दें',
      sa: 'अभिषेकजलं न सङ्गृह्णीयात् न पुनरुपयोजयेत् — प्रवाहयेत् अथवा निर्दिष्टनालिकायां गच्छतु',
    },
  ],

  phala: {
    en: 'Moksha (liberation from the cycle of birth and death), complete destruction of accumulated sins (Papa Nashana), Shiva\'s direct grace and darshan, fulfillment of all righteous wishes, and spiritual awakening',
    hi: 'मोक्ष (जन्म-मरण के चक्र से मुक्ति), संचित पापों का पूर्ण नाश (पापनाशन), शिव की प्रत्यक्ष कृपा और दर्शन, सभी धार्मिक मनोकामनाओं की पूर्ति, और आध्यात्मिक जागृति',
    sa: 'मोक्षः (जन्ममृत्युचक्रान्मुक्तिः), सञ्चितपापानां पूर्णनाशः (पापनाशनम्), शिवस्य साक्षात् अनुग्रहः दर्शनं च, सर्वधर्मकामनापूर्तिः, आध्यात्मिकजागृतिः च',
  },
};

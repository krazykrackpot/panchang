import type { PujaVidhi } from './types';

export const BHAI_DOOJ_PUJA: PujaVidhi = {
  festivalSlug: 'bhai-dooj',
  category: 'festival',
  deity: { en: 'Yama & Yamuna', hi: 'यम एवं यमुना', sa: 'यमः यमुना च' },

  samagri: [
    { name: { en: 'Roli / Kumkum (vermilion)', hi: 'रोली / कुमकुम', sa: 'रोली / कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Diya (oil/ghee lamp)', hi: 'दीपक (तेल/घी)', sa: 'दीपः (तैल/घृत)' }, category: 'puja_items', essential: true },
    { name: { en: 'Aarti plate (thali)', hi: 'आरती की थाली', sa: 'आरात्रिकपात्रम्' }, category: 'vessels', essential: true },
    { name: { en: 'Sweets (mithai)', hi: 'मिठाई', sa: 'मिष्टान्नानि' }, category: 'food', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'Flowers', hi: 'फूल', sa: 'पुष्पाणि' }, category: 'flowers', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Fruits', hi: 'फल', sa: 'फलानि' }, category: 'food', essential: false },
    { name: { en: 'Betel leaves (paan)', hi: 'पान के पत्ते', sa: 'ताम्बूलपत्राणि' }, quantity: '2', category: 'other', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Bhai Dooj is celebrated on Kartik Shukla Dwitiya (second day of bright half of Kartik). The tilak ceremony is performed during Aparahna (afternoon) when Dwitiya Tithi prevails. Avoid Bhadra timing.',
    hi: 'भाई दूज कार्तिक शुक्ल द्वितीया को मनाया जाता है। तिलक की रस्म अपराह्न (दोपहर बाद) में द्वितीया तिथि के दौरान की जाती है। भद्रा काल से बचें।',
    sa: 'भ्रातृद्वितीया कार्तिकशुक्लद्वितीयायां चर्यते। तिलककर्म अपराह्णे द्वितीयातिथिप्रवृत्तौ क्रियते। भद्राकालं वर्जयेत्।',
  },
  muhurtaWindow: { type: 'aparahna' },

  sankalpa: {
    en: 'On this auspicious Kartik Shukla Dwitiya (Bhai Dooj), I pray to Lord Yama and Goddess Yamuna for the long life, good health, and prosperity of my brother. May the sacred bond between siblings be strengthened.',
    hi: 'इस शुभ कार्तिक शुक्ल द्वितीया (भाई दूज) पर, मैं भगवान यम और देवी यमुना से अपने भाई की दीर्घायु, स्वास्थ्य और समृद्धि की प्रार्थना करती हूँ। भाई-बहन के पवित्र बन्धन को बल मिले।',
    sa: 'अस्मिन् शुभे कार्तिकशुक्लद्वितीयायां (भ्रातृद्वितीयायाम्) यमदेवं यमुनादेवीं च प्रार्थये भ्रातुः दीर्घायुः स्वास्थ्यं समृद्धिं च। भ्रातृभगिन्योः पवित्रबन्धनं दृढीभवतु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation', hi: 'तैयारी', sa: 'सज्जता' },
      description: {
        en: 'Both brother and sister should bathe and wear fresh clothes. The sister prepares the aarti thali with roli, akshat, diya, sweets, flowers, and coconut. Clean the puja area.',
        hi: 'भाई और बहन दोनों स्नान करके नए वस्त्र पहनें। बहन आरती की थाली में रोली, अक्षत, दीपक, मिठाई, फूल और नारियल सजाए। पूजा स्थल साफ करें।',
        sa: 'भ्राता भगिनी च स्नात्वा नववस्त्राणि धारयेताम्। भगिनी आरात्रिकपात्रं रोल्या अक्षतैः दीपेन मिष्टान्नैः पुष्पैः नारिकेलेन च सज्जयेत्। पूजास्थलं शोधयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Seating & Invocation', hi: 'आसन एवं आवाहन', sa: 'आसनम् आवाहनं च' },
      description: {
        en: 'The brother sits on a clean seat (asana) facing East. The sister sits opposite him. Light the diya and invoke the blessings of Yama and Yamuna, remembering the sacred story of Yamuna hosting her brother Yama on this day.',
        hi: 'भाई पूर्वमुखी होकर स्वच्छ आसन पर बैठें। बहन उनके सामने बैठें। दीपक जलाएँ और यम-यमुना का आशीर्वाद माँगें, इस दिन यमुना द्वारा अपने भाई यम की आगवानी की पवित्र कथा का स्मरण करें।',
        sa: 'भ्राता शुचिम् आसनम् उपविशेत् पूर्वाभिमुखः। भगिनी तस्य पुरतः उपविशेत्। दीपं प्रज्वालयेत् यमयमुनयोः आशीर्वादं प्रार्थयेत्, अस्मिन् दिने यमुनया स्वभ्रातुः यमस्य सत्कारकथां स्मरेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Tilak Ceremony', hi: 'तिलक लगाना', sa: 'तिलककर्म' },
      description: {
        en: 'The sister applies a tilak of roli (kumkum) on the brother\'s forehead using the ring finger. Then she places akshat (rice grains) on the tilak. She sprinkles flower petals on his head.',
        hi: 'बहन अनामिका (रिंग फिंगर) से भाई के मस्तक पर रोली (कुमकुम) का तिलक लगाए। फिर तिलक पर अक्षत (चावल) रखें। भाई के सिर पर फूल की पंखुड़ियाँ छिड़कें।',
        sa: 'भगिनी अनामिकाङ्गुल्या भ्रातुः ललाटे रोल्या (कुङ्कुमेन) तिलकं कुर्यात्। ततः तिलके अक्षतान् स्थापयेत्। तस्य शिरसि पुष्पदलानि विकिरेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Aarti of Brother', hi: 'भाई की आरती', sa: 'भ्रातुः आरात्रिकम्' },
      description: {
        en: 'The sister performs aarti of the brother by circling the lit diya around his face in a clockwise direction. She prays for his long life and well-being while doing the aarti.',
        hi: 'बहन जलते दीपक को भाई के मुख के सामने दक्षिणावर्त (clockwise) घुमाकर आरती करें। आरती करते हुए भाई की दीर्घायु और कल्याण की प्रार्थना करें।',
        sa: 'भगिनी प्रज्वलितदीपं भ्रातुः मुखस्य पुरतः प्रदक्षिणदिशि परिभ्रामयन्ती आरात्रिकं कुर्यात्। आरात्रिककाले भ्रातुः दीर्घायुः कल्याणं च प्रार्थयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 5,
      title: { en: 'Sweets & Gift Exchange', hi: 'मिठाई और उपहार विनिमय', sa: 'मिष्टान्नोपहारविनिमयः' },
      description: {
        en: 'The sister feeds sweets to the brother with her own hands. The brother then gives gifts (money, clothes, or other items) to the sister as a token of love and protection.',
        hi: 'बहन अपने हाथों से भाई को मिठाई खिलाएँ। फिर भाई बहन को प्रेम और रक्षा के प्रतीक रूप में उपहार (धन, वस्त्र या अन्य सामान) दें।',
        sa: 'भगिनी स्वहस्ताभ्यां भ्रातरं मिष्टान्नं भोजयेत्। ततः भ्राता भगिन्यै स्नेहरक्षणप्रतीकरूपेण उपहारान् (धनं वस्त्राणि अन्यवस्तूनि वा) दद्यात्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Prayer for Protection', hi: 'रक्षा की प्रार्थना', sa: 'रक्षाप्रार्थना' },
      description: {
        en: 'Both siblings join hands and pray together for each other\'s well-being. The brother pledges to protect his sister, and the sister prays for his long and healthy life. Recite the Yama mantra for protection.',
        hi: 'दोनों भाई-बहन हाथ जोड़कर एक-दूसरे की भलाई के लिए प्रार्थना करें। भाई बहन की रक्षा का वचन दे और बहन भाई की दीर्घायु एवं स्वस्थ जीवन की कामना करे। रक्षा के लिए यम मंत्र का पाठ करें।',
        sa: 'भ्राता भगिनी च हस्तौ सम्पुटीकृत्य परस्परं कल्याणं प्रार्थयेताम्। भ्राता भगिन्याः रक्षां प्रतिजानीयात्, भगिनी च भ्रातुः दीर्घायुः स्वास्थ्यं च कामयेत। रक्षार्थं यममन्त्रं पठेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'mantra',
      mantraRef: 'yama-mantra',
    },
  ],

  mantras: [
    {
      id: 'yama-mantra',
      name: { en: 'Yama Gayatri Mantra', hi: 'यम गायत्री मंत्र', sa: 'यमगायत्रीमन्त्रः' },
      devanagari: 'ॐ सूर्यपुत्राय विद्महे महाकालाय धीमहि।\nतन्नो यमः प्रचोदयात्॥',
      iast: 'oṃ sūryaputrāya vidmahe mahākālāya dhīmahi |\ntanno yamaḥ pracodayāt ||',
      meaning: {
        en: 'Om, let us know the son of Surya (Yama), let us meditate upon Mahakala. May Yama inspire and guide us.',
        hi: 'ॐ, हम सूर्यपुत्र (यम) को जानें, महाकाल का ध्यान करें। यम हमें प्रेरित और मार्गदर्शित करें।',
        sa: 'ॐ, सूर्यपुत्रं (यमम्) विद्मः, महाकालं ध्यायामः। यमः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite during the protection prayer for the brother\'s long life.',
        hi: 'भाई की दीर्घायु के लिए रक्षा प्रार्थना के दौरान जाप करें।',
        sa: 'भ्रातुः दीर्घायुषे रक्षाप्रार्थनाकाले जपेत्।',
      },
      japaCount: 11,
    },
    {
      id: 'sibling-prayer',
      name: { en: 'Sibling Protection Prayer', hi: 'भाई-बहन रक्षा प्रार्थना', sa: 'भ्रातृभगिनीरक्षाप्रार्थना' },
      devanagari: 'भ्रातृद्वितीया महापुण्या यमुनायमसंगमे।\nयमुना यमकं पूजा सर्वदुःखविनाशिनी॥',
      iast: 'bhrātṛdvitīyā mahāpuṇyā yamunāyamasaṃgame |\nyamunā yamakaṃ pūjā sarvaduḥkhavināśinī ||',
      meaning: {
        en: 'This great meritorious Bhratri Dwitiya, born of the meeting of Yamuna and Yama — the worship of Yama by Yamuna destroys all sorrows.',
        hi: 'यह महापुण्य भ्रातृद्वितीया यमुना और यम के मिलन से प्रकट हुई — यमुना द्वारा यम की पूजा सभी दुखों का नाश करती है।',
        sa: 'इयं महापुण्या भ्रातृद्वितीया यमुनायमसंगमे जाता — यमुनया यमस्य पूजा सर्वदुःखानि नाशयति।',
      },
      usage: {
        en: 'Recite at the beginning of the tilak ceremony.',
        hi: 'तिलक लगाने की शुरुआत में पाठ करें।',
        sa: 'तिलककर्मारम्भे पठेत्।',
      },
    },
    {
      id: 'yamuna-prayer',
      name: { en: 'Yamuna Prayer', hi: 'यमुना प्रार्थना', sa: 'यमुनाप्रार्थना' },
      devanagari: 'ॐ यमुनायै नमः।\nयमुने च कृपां कुरु भ्रातृभगिनीप्रेमवर्धिनी॥',
      iast: 'oṃ yamunāyai namaḥ |\nyamune ca kṛpāṃ kuru bhrātṛbhaginīpremavardhinī ||',
      meaning: {
        en: 'Om, salutations to Yamuna. O Yamuna, bestow your grace, you who nurture the love between brothers and sisters.',
        hi: 'ॐ, यमुना को नमस्कार। हे यमुने, कृपा करो, तुम जो भाई-बहन के प्रेम को बढ़ाती हो।',
        sa: 'ॐ, यमुनायै नमः। हे यमुने, कृपां कुरु, त्वं भ्रातृभगिन्योः प्रेम वर्धयसि।',
      },
      usage: {
        en: 'Recite while performing the aarti of the brother.',
        hi: 'भाई की आरती करते समय पाठ करें।',
        sa: 'भ्रातुः आरात्रिककाले पठेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Offer sweets specially prepared by the sister — traditional choices include ladoo, barfi, peda, and the brother\'s favorite sweets. Coconut and mishri (rock sugar) are essential accompaniments.',
    hi: 'बहन द्वारा विशेष रूप से बनाई गई मिठाइयाँ अर्पित करें — परम्परागत विकल्पों में लड्डू, बर्फी, पेड़ा और भाई की पसन्दीदा मिठाइयाँ शामिल हैं। नारियल और मिश्री आवश्यक हैं।',
    sa: 'भगिन्या विशेषनिर्मितानि मिष्टान्नानि समर्पयेत् — पारम्परिकविकल्पेषु लड्डुकः बर्फी पेडा भ्रातुः प्रियमिष्टान्नानि च सन्ति। नारिकेलं खण्डशर्करा च अनिवार्ये।',
  },

  precautions: [
    {
      en: 'Do not perform the tilak ceremony during Bhadra Kaal. Check the Panchang for Bhadra timing on Kartik Shukla Dwitiya.',
      hi: 'भद्रा काल में तिलक की रस्म न करें। कार्तिक शुक्ल द्वितीया पर भद्रा का समय पंचांग से जाँचें।',
      sa: 'भद्राकाले तिलककर्म मा कुर्यात्। कार्तिकशुक्लद्वितीयायां भद्राकालं पञ्चाङ्गतः परीक्षयेत्।',
    },
    {
      en: 'Both brother and sister should face East during the ceremony. The sister should use the ring finger for applying tilak.',
      hi: 'रस्म के दौरान भाई और बहन दोनों का मुख पूर्व दिशा में होना चाहिए। बहन तिलक लगाने के लिए अनामिका (रिंग फिंगर) का उपयोग करें।',
      sa: 'कर्मकाले भ्राता भगिनी च पूर्वाभिमुखौ स्याताम्। भगिनी तिलकार्थम् अनामिकाङ्गुलिं प्रयुञ्जीत।',
    },
    {
      en: 'This festival can be observed by sisters for any brotherly figure — cousin brothers or those bonded by love are equally valid.',
      hi: 'यह पर्व बहनें किसी भी भाई-समान व्यक्ति के लिए मना सकती हैं — चचेरे भाई या प्रेम से जुड़े भाई भी समान रूप से मान्य हैं।',
      sa: 'इदं पर्व भगिन्यः कस्मिन्नपि भ्रातृतुल्ये जने आचरितुं शक्नुवन्ति — पितृव्यपुत्राः स्नेहबद्धभ्रातरश्च समानरूपेण मान्याः।',
    },
  ],

  phala: {
    en: 'Bhai Dooj bestows Yama\'s protection upon the brother, ensuring longevity and freedom from untimely death. The sister gains merit equal to Yamuna puja. The bond between siblings is sanctified and strengthened for lifetimes.',
    hi: 'भाई दूज से भाई पर यम की कृपा होती है, जो दीर्घायु और अकाल मृत्यु से मुक्ति सुनिश्चित करती है। बहन को यमुना पूजा के समान पुण्य मिलता है। भाई-बहन का बन्धन जन्म-जन्मान्तर के लिए पवित्र और दृढ़ होता है।',
    sa: 'भ्रातृद्वितीयया भ्रातुः उपरि यमस्य कृपा भवति, दीर्घायुः अकालमृत्योः मुक्तिश्च सुनिश्चिता भवति। भगिनी यमुनापूजातुल्यं पुण्यं लभते। भ्रातृभगिन्योः बन्धनं जन्मजन्मान्तराय पवित्रं दृढं च भवति।',
  },
};

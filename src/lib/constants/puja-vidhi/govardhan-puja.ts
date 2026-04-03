import type { PujaVidhi } from './types';

export const GOVARDHAN_PUJA: PujaVidhi = {
  festivalSlug: 'govardhan-puja',
  category: 'festival',
  deity: { en: 'Lord Krishna (Govardhan Lila)', hi: 'भगवान कृष्ण (गोवर्धन लीला)', sa: 'भगवान् श्रीकृष्णः (गोवर्धनलीला)' },

  samagri: [
    { name: { en: 'Cow dung (for Govardhan idol)', hi: 'गोबर (गोवर्धन की मूर्ति के लिए)', sa: 'गोमयम् (गोवर्धनमूर्तये)' }, category: 'puja_items', essential: true },
    { name: { en: 'Krishna idol or image', hi: 'कृष्ण मूर्ति या चित्र', sa: 'कृष्णमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Annakut items (56 types of food offerings)', hi: 'अन्नकूट सामग्री (56 प्रकार के भोग)', sa: 'अन्नकूटसामग्री (षट्पञ्चाशद्भोगाः)' }, category: 'food', essential: true },
    { name: { en: 'Flowers and garlands', hi: 'फूल और मालाएँ', sa: 'पुष्पाणि मालाश्च' }, category: 'flowers', essential: true },
    { name: { en: 'Tulsi leaves', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, category: 'flowers', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Milk and curd', hi: 'दूध और दही', sa: 'दुग्धं दधि च' }, category: 'food', essential: false },
    { name: { en: 'Fruits (banana, apple, etc.)', hi: 'फल (केला, सेब, आदि)', sa: 'फलानि (कदलीफलम्, सेवफलम्, इत्यादि)' }, category: 'food', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Govardhan Puja is performed on the day after Diwali (Kartik Shukla Pratipada). The puja is done in the morning after sunrise, ideally during Pratahkaal. Annakut offering is arranged before noon.',
    hi: 'गोवर्धन पूजा दिवाली के अगले दिन (कार्तिक शुक्ल प्रतिपदा) को की जाती है। पूजा सूर्योदय के बाद प्रातःकाल में की जाती है। अन्नकूट का भोग दोपहर से पहले लगाया जाता है।',
    sa: 'गोवर्धनपूजा दीपावल्याः परदिने (कार्तिकशुक्लप्रतिपदायाम्) क्रियते। पूजा सूर्योदयानन्तरं प्रातःकाले क्रियते। अन्नकूटभोगः मध्याह्नात् पूर्वं समर्प्यते।',
  },

  sankalpa: {
    en: 'On this auspicious Kartik Shukla Pratipada, I worship Lord Govardhan and Lord Krishna, who lifted the Govardhan hill to protect the people of Vraja from the wrath of Indra. May He bestow abundance, protection, and devotion upon my family.',
    hi: 'इस शुभ कार्तिक शुक्ल प्रतिपदा पर, मैं भगवान गोवर्धन और श्रीकृष्ण की पूजा करता/करती हूँ, जिन्होंने इन्द्र के कोप से व्रजवासियों की रक्षा के लिए गोवर्धन पर्वत उठाया। वे मेरे परिवार पर समृद्धि, रक्षा और भक्ति की कृपा करें।',
    sa: 'अस्मिन् शुभे कार्तिकशुक्लप्रतिपदायां भगवन्तं गोवर्धनं श्रीकृष्णं च पूजयामि, यः इन्द्रकोपात् व्रजवासिनां रक्षार्थं गोवर्धनपर्वतमुद्धृतवान्। स मम कुटुम्बे समृद्धिं रक्षां भक्तिं च प्रयच्छतु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Making Govardhan Hill', hi: 'गोवर्धन पर्वत बनाना', sa: 'गोवर्धनपर्वतनिर्माणम्' },
      description: {
        en: 'Make a small hill (Govardhan) from cow dung in the courtyard or puja area. Decorate it with flowers, grass, and small plants. Place a Krishna idol on top with one hand raised (as if lifting the mountain).',
        hi: 'आँगन या पूजा स्थल में गोबर से एक छोटी पहाड़ी (गोवर्धन) बनाएँ। इसे फूलों, घास और छोटे पौधों से सजाएँ। ऊपर कृष्ण मूर्ति रखें जिनका एक हाथ उठा हो (पर्वत उठाने की मुद्रा में)।',
        sa: 'प्राङ्गणे पूजास्थले वा गोमयेन लघुपर्वतं (गोवर्धनम्) निर्मायात्। पुष्पैः तृणैः लघुवनस्पतिभिश्च अलङ्करोतु। उपरि कृष्णमूर्तिं स्थापयेत् यस्य एकः हस्तः उन्नतः (पर्वतोद्धरणमुद्रायाम्)।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Gau Puja (Cow Worship)', hi: 'गौ पूजा', sa: 'गोपूजा' },
      description: {
        en: 'Worship the cow by applying tilak of kumkum and haldi, offering garlands, and feeding her fresh green fodder and jaggery. The cow represents Kamadhenu and is central to this festival.',
        hi: 'गाय की पूजा करें — कुमकुम और हल्दी का तिलक लगाएँ, माला अर्पित करें, और ताज़ा हरा चारा एवं गुड़ खिलाएँ। गाय कामधेनु का प्रतीक है और इस पर्व में केन्द्रीय भूमिका रखती है।',
        sa: 'गोः पूजनं कुर्यात् — कुङ्कुमहरिद्राभ्यां तिलकं कृत्वा मालाम् अर्पयेत्, नवहरिततृणं गुडं च भोजयेत्। गौः कामधेनोः प्रतीकम् अस्ति अस्मिन् पर्वणि च प्रधाना।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Sankalpa', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water and akshat in the right hand. State your name, gotra, the date (Kartik Shukla Pratipada), and the purpose of the Govardhan puja. Release the water.',
        hi: 'दाहिने हाथ में जल और अक्षत लें। अपना नाम, गोत्र, तिथि (कार्तिक शुक्ल प्रतिपदा) और गोवर्धन पूजा का उद्देश्य बोलें। जल छोड़ें।',
        sa: 'दक्षिणहस्ते जलाक्षतान् गृहीत्वा स्वनाम गोत्रं तिथिं (कार्तिकशुक्लप्रतिपदा) गोवर्धनपूजाप्रयोजनं च वदेत्। जलं विसृजेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Govardhan Puja & Parikrama', hi: 'गोवर्धन पूजा और परिक्रमा', sa: 'गोवर्धनपूजा परिक्रमा च' },
      description: {
        en: 'Offer flowers, akshat, kumkum, incense, and lamp to the Govardhan hill. Then perform 7 parikramas (circumambulations) around the Govardhan hill, chanting Krishna mantras.',
        hi: 'गोवर्धन पर्वत पर फूल, अक्षत, कुमकुम, धूप और दीपक अर्पित करें। फिर कृष्ण मंत्रों का जाप करते हुए गोवर्धन की 7 परिक्रमाएँ करें।',
        sa: 'गोवर्धनपर्वते पुष्पाणि अक्षतान् कुङ्कुमं धूपं दीपं च समर्पयेत्। ततः कृष्णमन्त्रान् जपन् सप्तधा गोवर्धनपरिक्रमां कुर्यात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
      mantraRef: 'govardhan-dharan',
    },
    {
      step: 5,
      title: { en: 'Annakut (Mountain of Food)', hi: 'अन्नकूट (भोग का पर्वत)', sa: 'अन्नकूटः (भोगपर्वतः)' },
      description: {
        en: 'Arrange 56 types of food items (Chhappan Bhog) before the Krishna idol and Govardhan hill. This includes sweets, savories, fruits, dry fruits, rice, dal, vegetables, and breads. Offer with devotion and recite the bhog mantra.',
        hi: '56 प्रकार के भोग (छप्पन भोग) कृष्ण मूर्ति और गोवर्धन पर्वत के सामने सजाएँ। इसमें मिठाइयाँ, नमकीन, फल, मेवे, चावल, दाल, सब्ज़ियाँ और रोटियाँ शामिल हैं। भक्तिपूर्वक भोग मंत्र का पाठ करें।',
        sa: 'कृष्णमूर्तेः गोवर्धनपर्वतस्य च पुरतः षट्पञ्चाशद्विधभोगान् (छप्पनभोगान्) विन्यसेत्। अत्र मिष्टान्नानि लवणभक्ष्यानि फलानि शुष्कफलानि ओदनं दालं शाकानि रोटिकाश्च सन्ति। भक्त्या भोगमन्त्रं पठेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform aarti of Lord Krishna and Govardhan with ghee lamp and camphor. Sing "Aarti Kunj Bihari Ki" or other Krishna bhajans. Ring the bell while performing aarti.',
        hi: 'घी के दीपक और कपूर से भगवान कृष्ण और गोवर्धन की आरती करें। "आरती कुंज बिहारी की" या अन्य कृष्ण भजन गाएँ। आरती करते समय घंटी बजाएँ।',
        sa: 'घृतदीपेन कर्पूरेण च भगवतः कृष्णस्य गोवर्धनस्य च आरात्रिकं कुर्यात्। कृष्णभजनानि गायेत्। आरात्रिककाले घण्टां वादयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 7,
      title: { en: 'Prasad Distribution', hi: 'प्रसाद वितरण', sa: 'प्रसादवितरणम्' },
      description: {
        en: 'Distribute the annakut prasad to all family members and neighbours. Share the food with devotion — this is considered a key act of merit on Govardhan Puja day.',
        hi: 'अन्नकूट का प्रसाद सभी परिवारजनों और पड़ोसियों में वितरित करें। भक्तिपूर्वक भोजन बाँटना गोवर्धन पूजा के दिन प्रमुख पुण्य कर्म माना जाता है।',
        sa: 'अन्नकूटप्रसादं सर्वेषां कुटुम्बसदस्यानां प्रतिवेशिनां च मध्ये वितरेत्। भक्त्या अन्नवितरणं गोवर्धनपूजादिने प्रधानपुण्यकर्म मन्यते।',
      },
      duration: '10 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'govardhan-dharan',
      name: { en: 'Govardhan Dharan Mantra', hi: 'गोवर्धन धारण मंत्र', sa: 'गोवर्धनधारणमन्त्रः' },
      devanagari: 'गोवर्धन धराधार गोकुलत्राणकारक।\nविष्णुबाहु कृतारम्भ लक्ष्मीकान्त नमोऽस्तु ते॥',
      iast: 'govardhana dharādhāra gokulatrāṇakāraka |\nviṣṇubāhu kṛtārambha lakṣmīkānta namo\'stu te ||',
      meaning: {
        en: 'O Govardhan, upholder of the earth, protector of Gokula! O Lord whose arms are those of Vishnu, beloved of Lakshmi — I bow to you.',
        hi: 'हे गोवर्धन, पृथ्वी के आधार, गोकुल के रक्षक! हे विष्णु भुजाओं वाले, लक्ष्मीकान्त — आपको नमस्कार।',
        sa: 'हे गोवर्धन, धराधार, गोकुलत्राणकारक! हे विष्णुबाहो, लक्ष्मीकान्त — तुभ्यं नमः।',
      },
      usage: {
        en: 'Chant during Govardhan parikrama and while offering flowers to the hill.',
        hi: 'गोवर्धन परिक्रमा और पर्वत पर फूल चढ़ाते समय जाप करें।',
        sa: 'गोवर्धनपरिक्रमाकाले पर्वते पुष्पार्पणकाले च जपेत्।',
      },
    },
    {
      id: 'krishna-mantra',
      name: { en: 'Krishna Mool Mantra', hi: 'कृष्ण मूल मंत्र', sa: 'कृष्णमूलमन्त्रः' },
      devanagari: 'ॐ कृष्णाय वासुदेवाय हरये परमात्मने।\nप्रणतः क्लेशनाशाय गोविन्दाय नमो नमः॥',
      iast: 'oṃ kṛṣṇāya vāsudevāya haraye paramātmane |\npraṇataḥ kleśanāśāya govindāya namo namaḥ ||',
      meaning: {
        en: 'Om, salutations to Krishna, son of Vasudeva, Hari, the Supreme Soul. I bow to Govinda, the destroyer of all afflictions.',
        hi: 'ॐ, वासुदेव पुत्र कृष्ण, हरि, परमात्मा को नमस्कार। सभी क्लेशों के नाशक गोविन्द को बारम्बार नमन।',
        sa: 'ॐ, कृष्णाय वासुदेवाय हरये परमात्मने नमः। क्लेशनाशकाय गोविन्दाय पुनः पुनः नमः।',
      },
      usage: {
        en: 'Chant 108 times during the puja or as many times as possible.',
        hi: 'पूजा के दौरान 108 बार या यथासम्भव जाप करें।',
        sa: 'पूजाकाले अष्टोत्तरशतवारं यथाशक्ति वा जपेत्।',
      },
      japaCount: 108,
    },
    {
      id: 'govardhan-stuti',
      name: { en: 'Govardhan Stuti', hi: 'गोवर्धन स्तुति', sa: 'गोवर्धनस्तुतिः' },
      devanagari: 'गोवर्धनो जयत्येष शैलराजो गिरां पतिः।\nकृष्णेन लीलया यस्तु धृतः करतले यथा॥',
      iast: 'govardhano jayatyeṣa śailarājo girāṃ patiḥ |\nkṛṣṇena līlayā yastu dhṛtaḥ karatale yathā ||',
      meaning: {
        en: 'Victory to Govardhan, the king of mountains, lord of speech, who was playfully held on the palm of Lord Krishna.',
        hi: 'गोवर्धन की जय हो, पर्वतराज, वाणी के स्वामी, जिन्हें श्रीकृष्ण ने लीलापूर्वक अपनी हथेली पर धारण किया।',
        sa: 'गोवर्धनो जयति शैलराजः गिरां पतिः, यः कृष्णेन लीलया करतले धृतः।',
      },
      usage: {
        en: 'Recite during the Govardhan puja and aarti.',
        hi: 'गोवर्धन पूजा और आरती के समय पाठ करें।',
        sa: 'गोवर्धनपूजाकाले आरात्रिककाले च पठेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Chhappan Bhog (56 varieties of food) is the traditional offering, including peda, ladoo, kheer, puri, sabzi, rice, fruits, dry fruits, and various sweets. At minimum, offer fresh milk-based sweets, butter, and fruits.',
    hi: 'छप्पन भोग (56 प्रकार के भोजन) पारम्परिक नैवेद्य है, जिसमें पेड़ा, लड्डू, खीर, पूरी, सब्ज़ी, चावल, फल, मेवे और विभिन्न मिठाइयाँ शामिल हैं। कम से कम ताज़ी दूध की मिठाइयाँ, मक्खन और फल अर्पित करें।',
    sa: 'छप्पनभोगः (षट्पञ्चाशद्विधभोजनम्) पारम्परिकं नैवेद्यम्, यत्र पेडा लड्डुकः पायसः पूरी शाकम् ओदनं फलानि शुष्कफलानि विविधमिष्टान्नानि च सन्ति। न्यूनातिन्यूनं नवदुग्धमिष्टान्नानि नवनीतं फलानि च समर्पयेत्।',
  },

  precautions: [
    {
      en: 'Use only fresh cow dung for making the Govardhan hill. Do not use chemical-laden decorative materials.',
      hi: 'गोवर्धन पर्वत बनाने के लिए केवल ताज़ा गोबर का प्रयोग करें। रासायनिक सजावटी सामग्री का उपयोग न करें।',
      sa: 'गोवर्धनपर्वतनिर्माणाय केवलं नवगोमयं प्रयुज्यताम्। रासायनिकसज्जासामग्रीं मा प्रयुञ्जीत।',
    },
    {
      en: 'Annakut food should be freshly prepared with pure ingredients. Avoid stale or reheated food as offerings.',
      hi: 'अन्नकूट का भोजन शुद्ध सामग्री से ताज़ा बनाया जाना चाहिए। बासी या दोबारा गर्म किया भोजन नैवेद्य में न चढ़ाएँ।',
      sa: 'अन्नकूटभोजनं शुद्धपदार्थैः नवनिर्मितं स्यात्। वासिम् उष्णीकृतं वा भोजनं नैवेद्ये मा समर्पयेत्।',
    },
    {
      en: 'Treat cows with utmost respect on this day. Do not use force or mistreat any animal.',
      hi: 'इस दिन गायों के साथ अत्यन्त सम्मान से व्यवहार करें। किसी भी पशु के साथ बल प्रयोग या दुर्व्यवहार न करें।',
      sa: 'अस्मिन् दिने गाः परमादरेण व्यवहरेत्। कस्मिन्नपि पशौ बलप्रयोगं दुर्व्यवहारं वा मा कुर्यात्।',
    },
  ],

  phala: {
    en: 'Govardhan Puja bestows the blessings of Lord Krishna, protection from natural calamities, abundance of food and wealth, welfare of cattle and family, and deepens devotion to the Lord.',
    hi: 'गोवर्धन पूजा से भगवान कृष्ण की कृपा, प्राकृतिक आपदाओं से रक्षा, अन्न-धन की प्रचुरता, गो-कुटुम्ब का कल्याण और भगवान के प्रति भक्ति गहरी होती है।',
    sa: 'गोवर्धनपूजया भगवतः कृष्णस्य अनुग्रहः, प्राकृतिकापदाभ्यो रक्षा, अन्नधनप्राचुर्यम्, गोकुटुम्बकल्याणम्, भगवद्भक्तिवर्धनं च प्राप्यते।',
  },
};

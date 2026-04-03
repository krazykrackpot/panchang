import type { PujaVidhi } from './types';

export const JANMASHTAMI_PUJA: PujaVidhi = {
  festivalSlug: 'janmashtami',
  category: 'vrat',
  deity: { en: 'Krishna (Bal Gopal)', hi: 'कृष्ण (बाल गोपाल)', sa: 'कृष्णः (बालगोपालः)' },

  samagri: [
    { name: { en: 'Baby Krishna idol (Bal Gopal)', hi: 'बाल कृष्ण मूर्ति (बाल गोपाल)', sa: 'बालकृष्णमूर्तिः (बालगोपालः)' }, category: 'puja_items', essential: true },
    { name: { en: 'Jhula (cradle/swing)', hi: 'झूला (पालना)', sa: 'हिन्दोलम् (डोलः)' }, category: 'other', essential: true },
    { name: { en: 'Makhan (fresh butter)', hi: 'माखन (ताजा मक्खन)', sa: 'नवनीतम्' }, category: 'food', essential: true },
    { name: { en: 'Mishri (rock sugar)', hi: 'मिश्री (खड़ी शक्कर)', sa: 'खण्डशर्करा' }, category: 'food', essential: true },
    { name: { en: 'Tulsi leaves', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, category: 'flowers', essential: true },
    { name: { en: 'Peacock feather (mor pankh)', hi: 'मोर पंख', sa: 'मयूरपिच्छम्' }, category: 'other', essential: false },
    { name: { en: 'Flute (bansuri)', hi: 'बाँसुरी', sa: 'वंशी' }, category: 'other', essential: false },
    { name: { en: 'Panchamrit (milk, curd, ghee, honey, sugar)', hi: 'पंचामृत (दूध, दही, घी, शहद, शक्कर)', sa: 'पञ्चामृतम् (क्षीरं दधि घृतं मधु शर्करा)' }, category: 'food', essential: true },
    { name: { en: 'Fresh fruits', hi: 'ताजे फल', sa: 'नवफलानि' }, category: 'food', essential: true },
    { name: { en: 'Milk', hi: 'दूध', sa: 'क्षीरम्' }, quantity: '1 litre', category: 'food', essential: true },
    { name: { en: 'Curd (dahi)', hi: 'दही', sa: 'दधि' }, category: 'food', essential: true },
    { name: { en: 'Honey', hi: 'शहद', sa: 'मधु' }, category: 'food', essential: true },
    { name: { en: 'Ghee (clarified butter)', hi: 'घी', sa: 'घृतम्' }, category: 'food', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Nishita Kaal (midnight period) is the most auspicious time — Lord Krishna was born at the exact midnight hour on Bhadrapada Krishna Ashtami (Rohini Nakshatra)',
    hi: 'निशीथ काल (मध्यरात्रि) सर्वाधिक शुभ समय है — भगवान कृष्ण का जन्म भाद्रपद कृष्ण अष्टमी (रोहिणी नक्षत्र) को ठीक मध्यरात्रि में हुआ था',
    sa: 'निशीथकालः (मध्यरात्रिः) सर्वोत्तमः शुभकालः — श्रीकृष्णस्य जन्म भाद्रपदकृष्णाष्टम्यां (रोहिणीनक्षत्रे) ठीकमध्यरात्रौ अभवत्',
  },
  muhurtaWindow: { type: 'nishita' },

  sankalpa: {
    en: 'On this sacred Bhadrapada Krishna Ashtami, the divine birthday of Lord Krishna, I undertake this vrat and puja for the attainment of devotion, liberation from worldly bonds, and the supreme grace of Bhagavan Shri Krishna, the eighth avatar of Vishnu.',
    hi: 'इस पवित्र भाद्रपद कृष्ण अष्टमी, भगवान कृष्ण के दिव्य जन्मदिवस पर, भक्ति की प्राप्ति, सांसारिक बन्धनों से मुक्ति और भगवान श्री कृष्ण — विष्णु के अष्टम अवतार — की परम कृपा हेतु मैं यह व्रत और पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे भाद्रपदकृष्णाष्टम्यां श्रीकृष्णस्य दिव्यजन्मदिवसे भक्तिप्राप्त्यर्थं सांसारिकबन्धनमुक्त्यर्थं भगवच्छ्रीकृष्णस्य — विष्णोः अष्टमावतारस्य — परमानुग्रहार्थं च व्रतपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Nirjala/Phalahar Vrat (Day-long Fast)', hi: 'निर्जला/फलाहार व्रत (दिनभर का उपवास)', sa: 'निर्जलव्रतम् / फलाहारव्रतम् (दिनव्यापी उपवासः)' },
      description: {
        en: 'Observe a complete fast from sunrise. Strict devotees keep nirjala (without water), while others may take phalahar (fruits, milk, nuts). The fast continues until after the midnight puja.',
        hi: 'सूर्योदय से पूर्ण व्रत रखें। कठिन व्रती निर्जला (बिना जल) रखते हैं, अन्य फलाहार (फल, दूध, मेवे) ले सकते हैं। व्रत मध्यरात्रि पूजा के बाद तक चलता है।',
        sa: 'सूर्योदयात् सम्पूर्णम् उपवासं कुर्यात्। कठिनव्रतिनः निर्जलं (जलरहितम्) कुर्वन्ति, अन्ये फलाहारं (फलानि क्षीरं शुष्कफलानि) ग्रहीतुं शक्नुवन्ति। उपवासो मध्यरात्रिपूजानन्तरं पर्यन्तं चलति।',
      },
      duration: 'All day',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Decorate the Jhula (Swing)', hi: 'झूला सजाना', sa: 'हिन्दोलसज्जा' },
      description: {
        en: 'Decorate the cradle/swing with flowers, mango leaves, and colorful cloth. Place a small mattress and pillow inside. This will be the bed for baby Krishna at midnight.',
        hi: 'पालने/झूले को फूलों, आम के पत्तों और रंगीन कपड़े से सजाएँ। अन्दर छोटा गद्दा और तकिया रखें। यह मध्यरात्रि में बालकृष्ण का पलना होगा।',
        sa: 'हिन्दोलं पुष्पैः आम्रपत्रैः वर्णवस्त्रैश्च अलङ्कुर्यात्। अन्तः लघुशय्यां उपधानं च स्थापयेत्। इदं मध्यरात्रौ बालकृष्णस्य शयनं भविष्यति।',
      },
      duration: '20 min',
      essential: false,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Puja Mandap Setup', hi: 'पूजा मण्डप सज्जा', sa: 'पूजामण्डपसज्जा' },
      description: {
        en: 'Set up the puja area with Krishna idol, peacock feather, flute, and offerings. Place the jhula near the altar. Arrange Panchamrit ingredients, makhan-mishri, and fruits.',
        hi: 'कृष्ण मूर्ति, मोर पंख, बाँसुरी और प्रसाद सहित पूजा क्षेत्र सजाएँ। वेदी के पास झूला रखें। पंचामृत सामग्री, माखन-मिश्री और फल सजाएँ।',
        sa: 'कृष्णमूर्त्या मयूरपिच्छेन वंश्या प्रसादेन च पूजाक्षेत्रं सज्जयेत्। वेद्याः समीपे हिन्दोलं स्थापयेत्। पञ्चामृतसामग्रीं नवनीतखण्डशर्करां फलानि च सज्जयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Evening Puja Begins', hi: 'सन्ध्या पूजा आरम्भ', sa: 'सन्ध्यापूजारम्भः' },
      description: {
        en: 'At sunset, light the lamps and begin the evening worship. Offer dhupa (incense) and deepa (lamp) to Krishna. Commence recitation of Bhagavad Gita or Krishna Leela stories.',
        hi: 'सूर्यास्त पर दीपक जलाएँ और सन्ध्या पूजा आरम्भ करें। कृष्ण को धूप और दीप अर्पित करें। भगवद्गीता या कृष्ण लीला कथाओं का पाठ शुरू करें।',
        sa: 'सूर्यास्ते दीपान् प्रज्वालयेत् सन्ध्यापूजां च आरभेत्। कृष्णाय धूपं दीपं च समर्पयेत्। भगवद्गीतायाः कृष्णलीलाकथानां वा पाठम् आरभेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Jagran (Night Vigil) — Bhajan & Kirtan', hi: 'जागरण — भजन व कीर्तन', sa: 'जागरणम् — भजनकीर्तने' },
      description: {
        en: 'Stay awake through the night (jagran) singing Krishna bhajans and kirtans. Popular songs include "Hare Krishna Mahamantra", "Govind Bolo Hari Gopal Bolo", and narration of Krishna\'s childhood leelas.',
        hi: 'रात भर जागकर (जागरण) कृष्ण भजन और कीर्तन गाएँ। लोकप्रिय गीतों में "हरे कृष्ण महामन्त्र", "गोविन्द बोलो हरि गोपाल बोलो", और कृष्ण की बाल लीलाओं का वर्णन शामिल है।',
        sa: 'रात्रौ जागृतः (जागरणम्) कृष्णभजनकीर्तनानि गायेत्। प्रसिद्धगीतेषु "हरे कृष्ण महामन्त्रः", "गोविन्द बोलो हरि गोपाल बोलो", कृष्णस्य बाललीलावर्णनं चेति।',
      },
      mantraRef: 'mahamantra',
      duration: 'Until midnight',
      essential: false,
      stepType: 'mantra',
    },
    {
      step: 6,
      title: { en: 'Midnight Abhishek (12 AM — Birth Moment)', hi: 'मध्यरात्रि अभिषेक (12 बजे — जन्म क्षण)', sa: 'मध्यरात्र्यभिषेकः (जन्मक्षणः)' },
      description: {
        en: 'At the exact Nishita Kaal (midnight), bathe the baby Krishna idol with Panchamrit — first milk, then curd, then ghee, then honey, then sugar water — followed by clean water. Blow the conch, ring bells, and exclaim "Nand Gher Anand Bhayo, Jai Kanhaiya Lal Ki!"',
        hi: 'ठीक निशीथ काल (मध्यरात्रि) पर बालकृष्ण मूर्ति को पंचामृत से स्नान कराएँ — पहले दूध, फिर दही, फिर घी, फिर शहद, फिर शक्कर का पानी — उसके बाद शुद्ध जल। शंख बजाएँ, घण्टी बजाएँ और "नन्द घेर आनन्द भयो, जय कन्हैया लाल की!" का उद्घोष करें।',
        sa: 'ठीकनिशीथकाले (मध्यरात्रौ) बालकृष्णमूर्तिं पञ्चामृतेन स्नापयेत् — प्रथमं क्षीरेण, ततो दध्ना, ततो घृतेन, ततो मधुना, ततो शर्करोदकेन — ततः शुद्धजलेन। शङ्खं वादयेत्, घण्टां वादयेत्, "नन्दगृहे आनन्दो ऽभवत्, जयो बालकृष्णस्य!" इति उद्घोषयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Place Baby Krishna in Cradle', hi: 'बालकृष्ण को पालने में रखना', sa: 'बालकृष्णं डोले स्थापयेत्' },
      description: {
        en: 'After the abhishek, dress baby Krishna in new clothes, apply chandan tilak, place the peacock feather on his crown, and the flute in his hand. Gently place him in the decorated jhula (cradle).',
        hi: 'अभिषेक के बाद बालकृष्ण को नए वस्त्र पहनाएँ, चन्दन का तिलक लगाएँ, मुकुट पर मोर पंख लगाएँ, और हाथ में बाँसुरी रखें। सजे हुए झूले (पालने) में धीरे से रखें।',
        sa: 'अभिषेकानन्तरं बालकृष्णं नूतनवस्त्रैः आच्छादयेत्, चन्दनतिलकं लेपयेत्, मुकुटे मयूरपिच्छं स्थापयेत्, हस्ते वंशीं दद्यात्। अलङ्कृतहिन्दोले मृदुलं स्थापयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Swing the Cradle — Sing Bhajans', hi: 'पालना झुलाना — भजन गायन', sa: 'डोलम् आन्दोलयेत् — भजनगानम्' },
      description: {
        en: 'Swing the cradle gently while singing devotional songs — lullabies for baby Krishna such as "So Ja Rajkumari" or "Jai Jai Radha Raman." Each family member should take turns swinging.',
        hi: 'भक्ति गीत गाते हुए पालना धीरे-धीरे झुलाएँ — बालकृष्ण के लिए लोरियाँ जैसे "सो जा राजकुमारी" या "जय जय राधा रमण"। हर परिवार के सदस्य को बारी-बारी से झूला झुलाना चाहिए।',
        sa: 'भक्तिगीतानि गायन् डोलं मृदुलं आन्दोलयेत् — बालकृष्णार्थं लालनागीतानि। प्रत्येकं कुटुम्बसदस्यं पर्यायेण डोलम् आन्दोलयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 9,
      title: { en: 'Naivedya — Makhan-Mishri Offering', hi: 'नैवेद्य — माखन-मिश्री भोग', sa: 'नैवेद्यम् — नवनीतखण्डशर्करानिवेदनम्' },
      description: {
        en: 'Offer fresh makhan (butter) mixed with mishri (rock sugar) to baby Krishna — his most beloved food. Also offer milk, curd, fruits, Panchamrit, and tulsi leaves. Sprinkle water around offerings.',
        hi: 'बालकृष्ण को ताजा माखन (मक्खन) मिश्री मिलाकर अर्पित करें — उनका सबसे प्रिय भोजन। दूध, दही, फल, पंचामृत और तुलसी पत्ते भी अर्पित करें। भोग के चारों ओर जल छिड़कें।',
        sa: 'बालकृष्णाय नवं नवनीतं खण्डशर्करया मिश्रितं समर्पयेत् — तस्य सर्वप्रियं भोजनम्। क्षीरं दधि फलानि पञ्चामृतं तुलसीपत्राणि च निवेदयेत्। नैवेद्यस्य परितः जलं सिञ्चेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 10,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform the aarti of baby Krishna with camphor and ghee lamp. Sing "Aarti Kunj Bihari Ki" — the most celebrated aarti of Lord Krishna. Ring bells and blow the conch throughout.',
        hi: 'कपूर और घी के दीपक से बालकृष्ण की आरती करें। "आरती कुंज बिहारी की" गाएँ — भगवान कृष्ण की सबसे प्रसिद्ध आरती। पूरे समय घण्टी बजाएँ और शंख फूँकें।',
        sa: 'कर्पूरघृतदीपाभ्यां बालकृष्णस्य आरात्रिकं कुर्यात्। "आरती कुञ्जबिहारिणः" गायेत् — श्रीकृष्णस्य सर्वप्रसिद्धम् आरात्रिकम्। सर्वत्र घण्टां शङ्खं च वादयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 11,
      title: { en: 'Break the Fast (Parana)', hi: 'व्रत खोलना (पारणा)', sa: 'उपवासभञ्जनम् (पारणम्)' },
      description: {
        en: 'After the midnight puja, aarti, and naivedya, break the fast by first taking Panchamrit prasad, then makhan-mishri, then fruits and other sattvic food.',
        hi: 'मध्यरात्रि पूजा, आरती और नैवेद्य के बाद, पहले पंचामृत प्रसाद, फिर माखन-मिश्री, फिर फल और अन्य सात्विक भोजन लेकर व्रत खोलें।',
        sa: 'मध्यरात्रिपूजायाः आरात्रिकनैवेद्ययोः अनन्तरं प्रथमं पञ्चामृतप्रसादं ततो नवनीतखण्डशर्करां ततो फलानि अन्यं सात्त्विकाहारं च ग्रहीत्वा उपवासं भञ्जयेत्।',
      },
      duration: '10 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 12,
      title: { en: 'Dahi Handi (Next Day)', hi: 'दही हांडी (अगले दिन)', sa: 'दधिहाण्डी (अग्रिमदिवसे)' },
      description: {
        en: 'Next day, celebrate Dahi Handi — hang a pot of curd, butter, and fruits high up, and break it in teams, reenacting young Krishna\'s mischievous butter-stealing leelas in Gokul.',
        hi: 'अगले दिन दही हांडी मनाएँ — दही, मक्खन और फलों से भरी हांडी ऊँचाई पर लटकाएँ और टीमों में तोड़ें, गोकुल में बालकृष्ण की शरारती माखन-चोरी लीलाओं का पुनर्मंचन करते हुए।',
        sa: 'अग्रिमदिवसे दधिहाण्डीम् उत्सवयेत् — दधिनवनीतफलपूर्णां हाण्डीम् उच्चैः लम्बयेत् दलेषु च भञ्जयेत्, गोकुले बालकृष्णस्य विनोदनवनीतचौर्यलीलाः पुनः अभिनयन्।',
      },
      duration: 'All day',
    },
  ],

  mantras: [
    {
      id: 'krishna-beej',
      name: { en: 'Krishna Beej Mantra', hi: 'कृष्ण बीज मन्त्र', sa: 'कृष्णबीजमन्त्रः' },
      devanagari: 'ॐ क्लीं कृष्णाय नमः',
      iast: 'oṃ klīṃ kṛṣṇāya namaḥ',
      meaning: {
        en: 'Salutations to Lord Krishna — Kleem is the beej (seed) mantra of attraction and divine love (Kamabija)',
        hi: 'भगवान कृष्ण को नमन — क्लीं आकर्षण और दिव्य प्रेम का बीज मन्त्र (कामबीज) है',
        sa: 'श्रीकृष्णाय नमः — क्लीं आकर्षणदिव्यप्रेमणोः बीजमन्त्रः (कामबीजः)',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the midnight puja for invoking Krishna\'s divine grace and love',
        hi: 'मध्यरात्रि पूजा के दौरान कृष्ण की दिव्य कृपा और प्रेम के आवाहन हेतु 108 बार जपें',
        sa: 'मध्यरात्रिपूजाकाले कृष्णस्य दिव्यकृपाप्रेमावाहनार्थम् अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'krishna-gayatri',
      name: { en: 'Krishna Gayatri Mantra', hi: 'कृष्ण गायत्री मन्त्र', sa: 'कृष्णगायत्रीमन्त्रः' },
      devanagari: 'ॐ देवकीनन्दनाय विद्महे वासुदेवाय धीमहि तन्नो कृष्णः प्रचोदयात्',
      iast: 'oṃ devakīnandanāya vidmahe vāsudevāya dhīmahi tanno kṛṣṇaḥ pracodayāt',
      meaning: {
        en: 'We meditate upon the son of Devaki, we contemplate Vasudeva. May that Krishna inspire and illuminate us.',
        hi: 'हम देवकी नन्दन को जानते हैं, वासुदेव का ध्यान करते हैं। वह कृष्ण हमें प्रेरित करें।',
        sa: 'देवकीनन्दनं विजानीमहे वासुदेवं ध्यायामहे। कृष्णः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite during the evening puja and meditation for connecting with Krishna\'s divine consciousness',
        hi: 'सन्ध्या पूजा और ध्यान के दौरान कृष्ण की दिव्य चेतना से जुड़ने हेतु पढ़ें',
        sa: 'सन्ध्यापूजाध्यानकाले कृष्णस्य दिव्यचेतनया सम्बन्धार्थं पठेत्',
      },
    },
    {
      id: 'gopala-mantra',
      name: { en: 'Gopala Mantra (Dvadasakshari)', hi: 'गोपाल मन्त्र (द्वादशाक्षरी)', sa: 'गोपालमन्त्रः (द्वादशाक्षरी)' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय',
      iast: 'oṃ namo bhagavate vāsudevāya',
      meaning: {
        en: 'Salutations to the divine Lord Vasudeva (Krishna) — the twelve-syllable liberation mantra (Dvadasakshari Mukti Mantra)',
        hi: 'भगवान वासुदेव (कृष्ण) को नमन — द्वादश अक्षरों का मुक्ति मन्त्र (द्वादशाक्षरी मुक्ति मन्त्र)',
        sa: 'भगवते वासुदेवाय नमः — द्वादशाक्षरमुक्तिमन्त्रः',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times — this is the supreme Vaishnava mantra from Srimad Bhagavatam, the path to moksha',
        hi: '108 बार जपें — यह श्रीमद्भागवत से सर्वोच्च वैष्णव मन्त्र है, मोक्ष का मार्ग',
        sa: 'अष्टोत्तरशतवारं जपेत् — अयं श्रीमद्भागवतात् सर्वोत्तमो वैष्णवमन्त्रः, मोक्षमार्गः',
      },
    },
    {
      id: 'mahamantra',
      name: { en: 'Hare Krishna Mahamantra', hi: 'हरे कृष्ण महामन्त्र', sa: 'हरेकृष्णमहामन्त्रः' },
      devanagari: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।\nहरे राम हरे राम राम राम हरे हरे॥',
      iast: 'hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare |\nhare rāma hare rāma rāma rāma hare hare ||',
      meaning: {
        en: 'O Lord Hari (Krishna), O energy of the Lord (Hare/Radha) — this 16-word Mahamantra from Kali Santarana Upanishad is the supreme means of deliverance in Kali Yuga',
        hi: 'हे हरि (कृष्ण), हे भगवान की शक्ति (हरे/राधा) — कलिसन्तरण उपनिषद् से यह 16 शब्दों का महामन्त्र कलियुग में उद्धार का सर्वोच्च साधन है',
        sa: 'हे हरे (कृष्ण), हे भगवच्छक्ते (हरे/राधा) — कलिसन्तरणोपनिषदः अयं षोडशपदमहामन्त्रः कलियुगे उद्धारस्य सर्वोत्तमसाधनम्',
      },
      usage: {
        en: 'Chant continuously during the night vigil (jagran) — this is the most powerful mantra for Kali Yuga, recommended by Chaitanya Mahaprabhu',
        hi: 'रात्रि जागरण के दौरान लगातार जपें — यह कलियुग का सबसे शक्तिशाली मन्त्र है, चैतन्य महाप्रभु द्वारा अनुशंसित',
        sa: 'रात्रिजागरणकाले अविरतं जपेत् — अयं कलियुगस्य प्रभावशालितमो मन्त्रः, चैतन्यमहाप्रभुना अनुशंसितः',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Bhagavad Gita — Chapter 4 (Jnana Yoga)', hi: 'भगवद्गीता — अध्याय 4 (ज्ञान योग)', sa: 'भगवद्गीता — चतुर्थोऽध्यायः (ज्ञानयोगः)' },
      verseCount: 42,
      duration: '20 min',
      note: {
        en: 'Chapter 4 contains the famous verse "Yada yada hi dharmasya..." where Krishna declares he incarnates whenever dharma declines — most relevant for Janmashtami.',
        hi: 'अध्याय 4 में प्रसिद्ध श्लोक "यदा यदा हि धर्मस्य..." है जहाँ कृष्ण घोषणा करते हैं कि वे जब-जब धर्म की हानि होती है तब-तब अवतार लेते हैं — जन्माष्टमी के लिए सर्वाधिक प्रासंगिक।',
        sa: 'चतुर्थाध्याये प्रसिद्धश्लोकः "यदा यदा हि धर्मस्य..." यत्र कृष्णो घोषयति यदा यदा धर्मस्य ग्लानिर्भवति तदा तदा स अवतरतीति — जन्माष्टम्याः सर्वप्रासंगिकम्।',
      },
    },
    {
      name: { en: 'Srimad Bhagavatam — Dashama Skandha (10th Canto — Krishna Birth)', hi: 'श्रीमद्भागवत — दशम स्कन्ध (कृष्ण जन्म)', sa: 'श्रीमद्भागवतम् — दशमस्कन्धः (कृष्णजन्मम्)' },
      verseCount: 90,
      duration: '30 min',
      note: {
        en: 'The 10th Canto of Bhagavatam describes Krishna\'s birth in Mathura, Vasudeva carrying him across the Yamuna, and his childhood leelas in Gokul-Vrindavan.',
        hi: 'भागवत का दशम स्कन्ध मथुरा में कृष्ण जन्म, वसुदेव का उन्हें यमुना पार ले जाना, और गोकुल-वृन्दावन में उनकी बाल लीलाओं का वर्णन करता है।',
        sa: 'भागवतस्य दशमस्कन्धः मथुरायां कृष्णजन्म, वसुदेवेन तं यमुनापारं नयनं, गोकुलवृन्दावने च तस्य बाललीलाः वर्णयति।',
      },
    },
  ],

  aarti: {
    name: { en: 'Aarti Kunj Bihari Ki', hi: 'आरती कुंज बिहारी की', sa: 'आरती कुञ्जबिहारिणः' },
    devanagari:
      'आरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nगले में बैजन्ती माला, बजावे मुरली मधुर बाला।\nश्रवण में कुण्डल झलकाला, नन्द के आनन्द नन्दलाला।\nगगन सम अंग कान्ति काली, राधिका चमक रही आली।\nलतन में ठाढ़े बनमाली॥\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nकानन में कुण्डल, मोर मुकुट पर मंद हँसे।\nतन छवि श्यामल, अंग विश्व में चन्दन लेपे।\nकस्तूरी तिलक ललार पर, सोहत आनन्द केसरी के।\nविजयी ब्रज में आनन्दकन्द के॥\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nछप्पनभोग धरत नित जूठन तो ग्वालन सँग खात।\nअमर हों वे चरन छुवत हरि के, हस्तकमल से ग्रास उठात।\nउदर भरत हरि आप निछावर, गोपियन हित साँझ नचात।\nचरनामृत पीवत सब ही, मज्जन करत ब्रज के घात॥\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nजहाँ ते प्रकट भई गंगा, सकल मल हरणी अंगा।\nस्मरण ते होत मोह भंगा, बसी मेरे हृदय में रंगा।\nश्री गिरिधर कृष्ण मुरारी की।\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\n॥ इति श्री कृष्ण आरती सम्पूर्णम् ॥',
    iast:
      'āratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\ngale meṃ baijantī mālā, bajāve muralī madhura bālā |\nśravaṇa meṃ kuṇḍala jhalakālā, nanda ke ānanda nandalālā |\ngagana sama aṃga kānti kālī, rādhikā camaka rahī ālī |\nlatana meṃ ṭhāḍhe banamālī ||\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\nkānana meṃ kuṇḍala, mora mukuṭa para manda haṃse |\ntana chavi śyāmala, aṃga viśva meṃ candana lepe |\nkastūrī tilaka lalāra para, sohata ānanda kesarī ke |\nvijayī braja meṃ ānandakanda ke ||\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\nchappanabhoga dharata nita jūṭhana to gvālana saṃga khāta |\namara hoṃ ve carana chuvata hari ke, hastakamala se grāsa uṭhāta |\nudara bharata hari āpa nichāvara, gopīyana hita sāṃjha nacāta |\ncaraṇāmṛta pīvata saba hī, majjana karata braja ke ghāta ||\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\njahāṃ te prakaṭa bhaī gaṃgā, sakala mala haraṇī aṃgā |\nsmaraṇa te hota moha bhaṃgā, basī mere hṛdaya meṃ raṃgā |\nśrī giridhara kṛṣṇa murārī kī |\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\n|| iti śrī kṛṣṇa āratī sampūrṇam ||',
  },

  naivedya: {
    en: 'Makhan-mishri (fresh butter with rock sugar) — Krishna\'s most beloved offering — along with Panchamrit, fresh fruits, milk, curd, and tulsi leaves',
    hi: 'माखन-मिश्री (ताजा मक्खन और खड़ी शक्कर) — कृष्ण का सबसे प्रिय भोग — साथ में पंचामृत, ताजे फल, दूध, दही और तुलसी के पत्ते',
    sa: 'नवनीतखण्डशर्करा — कृष्णस्य सर्वप्रियं निवेदनम् — सह पञ्चामृतं नवफलानि क्षीरं दधि तुलसीपत्राणि च',
  },

  precautions: [
    {
      en: 'Complete fast must be observed until the midnight (Nishita Kaal) puja — do not break the fast before the abhishek and aarti are complete',
      hi: 'मध्यरात्रि (निशीथ काल) पूजा तक पूर्ण व्रत रखना अनिवार्य है — अभिषेक और आरती पूर्ण होने से पहले व्रत न तोड़ें',
      sa: 'मध्यरात्रिपर्यन्तं (निशीथकालपर्यन्तम्) सम्पूर्णम् उपवासं पालनीयम् — अभिषेकारात्रिकसम्पूर्त्यां पूर्वम् उपवासं न भञ्जयेत्',
    },
    {
      en: 'Do NOT sleep during the jagran (night vigil) — staying awake all night is an essential part of the Janmashtami vrat',
      hi: 'जागरण (रात्रि जागृति) के दौरान सोएँ नहीं — पूरी रात जागना जन्माष्टमी व्रत का अनिवार्य अंग है',
      sa: 'जागरणकाले (रात्रिजागृतौ) न स्वपेत् — सर्वरात्रौ जागरणं जन्माष्टमीव्रतस्य अनिवार्यम् अङ्गम्',
    },
    {
      en: 'Use ONLY tulsi, makhan (butter), and mishri (rock sugar) for naivedya — these are Krishna\'s most sacred offerings; do not substitute with other items',
      hi: 'नैवेद्य के लिए केवल तुलसी, माखन (मक्खन) और मिश्री (खड़ी शक्कर) का प्रयोग करें — ये कृष्ण के सबसे पवित्र भोग हैं; अन्य वस्तुओं से प्रतिस्थापन न करें',
      sa: 'नैवेद्यार्थं तुलसीं नवनीतं खण्डशर्करां च एव उपयोजयेत् — एतानि कृष्णस्य सर्वपवित्रनिवेदनानि; अन्यैः प्रतिस्थापयेत् न',
    },
    {
      en: 'Puja MUST be performed at the exact Nishita Kaal (midnight) — not before, not after; this is the precise time of Krishna\'s birth',
      hi: 'पूजा ठीक निशीथ काल (मध्यरात्रि) पर ही करनी चाहिए — न पहले, न बाद में; यह कृष्ण जन्म का सटीक समय है',
      sa: 'पूजा ठीकनिशीथकाले (मध्यरात्रौ) एव करणीया — न पूर्वं न परं; अयं कृष्णजन्मनः सटीककालः',
    },
    {
      en: 'Pregnant women and those with health conditions may observe a modified fast (phalahar) — consult family traditions',
      hi: 'गर्भवती महिलाएँ और स्वास्थ्य समस्या वाले लोग संशोधित व्रत (फलाहार) रख सकते हैं — पारिवारिक परम्परा से परामर्श करें',
      sa: 'गर्भवत्यः स्वास्थ्यसमस्याग्रस्ताश्च जनाः संशोधितव्रतं (फलाहारम्) कर्तुं शक्नुवन्ति — कुटुम्बपरम्परां परामृशेत्',
    },
  ],

  phala: {
    en: 'Supreme devotion (Prema Bhakti) to Lord Krishna, liberation from the cycle of birth and death (Moksha), destruction of all sins accumulated over lifetimes, attainment of Goloka (Krishna\'s eternal abode), and the divine grace of Bhagavan Shri Krishna — the Purna Avatar',
    hi: 'भगवान कृष्ण के प्रति परम भक्ति (प्रेम भक्ति), जन्म-मृत्यु के चक्र से मुक्ति (मोक्ष), जन्मों-जन्मों के संचित पापों का नाश, गोलोक (कृष्ण का शाश्वत धाम) की प्राप्ति, और भगवान श्री कृष्ण — पूर्ण अवतार — की दिव्य कृपा',
    sa: 'श्रीकृष्णे परमभक्तिः (प्रेमभक्तिः), जन्ममृत्युचक्रात् मुक्तिः (मोक्षः), जन्मजन्मान्तरसञ्चितपापनाशनम्, गोलोकप्राप्तिः (कृष्णस्य शाश्वतधाम), भगवच्छ्रीकृष्णस्य — पूर्णावतारस्य — दिव्यानुग्रहश्च',
  },
};

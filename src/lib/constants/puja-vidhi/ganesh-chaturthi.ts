import type { PujaVidhi } from './types';

export const GANESH_CHATURTHI_PUJA: PujaVidhi = {
  festivalSlug: 'ganesh-chaturthi',
  category: 'festival',
  deity: { en: 'Ganesha', hi: 'गणेश', sa: 'गणेशः' },

  samagri: [
    { name: { en: 'Clay/eco-friendly Ganesha idol', hi: 'मिट्टी की गणेश प्रतिमा', sa: 'मृण्मयी गणेशमूर्तिः' } },
    { name: { en: 'Modak (sweet dumplings)', hi: 'मोदक', sa: 'मोदकम्' }, quantity: '21' },
    { name: { en: 'Durva grass', hi: 'दूर्वा घास', sa: 'दूर्वा' }, note: { en: 'Must have 3 or 5 blades', hi: '3 या 5 पत्तियों वाली होनी चाहिए', sa: 'त्रिपत्रा पञ्चपत्रा वा भवेत्' } },
    { name: { en: 'Red flowers (hibiscus)', hi: 'लाल फूल (गुड़हल)', sa: 'रक्तपुष्पाणि (जपाकुसुमम्)' } },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1' },
    { name: { en: 'Supari (betel nut)', hi: 'सुपारी', sa: 'पूगीफलम्' }, quantity: '5' },
    { name: { en: 'Paan leaves (betel)', hi: 'पान के पत्ते', sa: 'ताम्बूलपत्राणि' }, quantity: '5' },
    { name: { en: 'Turmeric', hi: 'हल्दी', sa: 'हरिद्रा' } },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' } },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' } },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1' },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' } },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' } },
    { name: { en: 'Banana', hi: 'केला', sa: 'कदलीफलम्' } },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Madhyahna Kaal (midday period) is the most auspicious time for Ganesh Chaturthi puja',
    hi: 'मध्याह्न काल गणेश चतुर्थी पूजा के लिए सर्वाधिक शुभ समय है',
    sa: 'मध्याह्नकालः गणेशचतुर्थीपूजायाः सर्वोत्तमः शुभकालः',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'I undertake this Ganapati puja for the removal of all obstacles, attainment of wisdom, and success in all endeavors, on this auspicious Bhadrapada Shukla Chaturthi.',
    hi: 'इस शुभ भाद्रपद शुक्ल चतुर्थी पर, समस्त विघ्नों के नाश, बुद्धि की प्राप्ति और सभी कार्यों में सफलता के लिए मैं यह गणपति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे भाद्रपदशुक्लचतुर्थ्यां सर्वविघ्ननिवारणार्थं बुद्धिप्राप्त्यर्थं सर्वकार्यसिद्ध्यर्थं च श्रीगणपतिपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Achamana', hi: 'आचमन', sa: 'आचमनम्' },
      description: {
        en: 'Take water in the right palm three times, sipping each time while reciting the names of Vishnu (Keshava, Narayana, Madhava) for self-purification.',
        hi: 'दाहिने हाथ में तीन बार जल लेकर, केशव, नारायण, माधव नाम लेते हुए आचमन करें।',
        sa: 'दक्षिणकरे त्रिवारं जलं गृहीत्वा केशव-नारायण-माधवनामोच्चारणेन आचमनं कुर्यात्।',
      },
      duration: '2 min',
    },
    {
      step: 2,
      title: { en: 'Sankalpa', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water and akshat in the right hand, state the date, place, and purpose of the puja, then release the water.',
        hi: 'दाहिने हाथ में जल और अक्षत लेकर, तिथि, स्थान और पूजा का उद्देश्य बोलकर जल छोड़ें।',
        sa: 'दक्षिणहस्ते जलाक्षतान् गृहीत्वा तिथिस्थानपूजाप्रयोजनं वदेत् ततो जलं विसृजेत्।',
      },
      duration: '3 min',
    },
    {
      step: 3,
      title: { en: 'Dhyana', hi: 'ध्यान', sa: 'ध्यानम्' },
      description: {
        en: 'Meditate on Lord Ganesha — elephant-headed, four-armed, holding a noose, goad, modak, and blessing mudra, seated on a lotus with a mouse as his vehicle.',
        hi: 'भगवान गणेश का ध्यान करें — गजानन, चतुर्भुज, पाश, अंकुश, मोदक और वरदमुद्रा धारी, कमल पर विराजमान, मूषक वाहन।',
        sa: 'गजाननं चतुर्बाहुं पाशाङ्कुशमोदकवरदमुद्राधारिणं पद्मासनस्थं मूषकवाहनं श्रीगणेशं ध्यायेत्।',
      },
      duration: '3 min',
    },
    {
      step: 4,
      title: { en: 'Avahana', hi: 'आवाहन', sa: 'आवाहनम्' },
      description: {
        en: 'Invoke Lord Ganesha into the idol by offering akshat and flowers, requesting him to be present for the puja.',
        hi: 'अक्षत और पुष्प अर्पित कर मूर्ति में भगवान गणेश का आवाहन करें, पूजा में उपस्थित रहने की प्रार्थना करें।',
        sa: 'अक्षतपुष्पैः मूर्तौ श्रीगणेशस्य आवाहनं कुर्यात् पूजायां सान्निध्यं प्रार्थयेत् च।',
      },
      mantraRef: 'ganesh-beej',
      duration: '2 min',
    },
    {
      step: 5,
      title: { en: 'Asana', hi: 'आसन', sa: 'आसनम्' },
      description: {
        en: 'Offer a seat (asana) to Lord Ganesha by placing akshat at the base of the idol.',
        hi: 'मूर्ति के आधार पर अक्षत रखकर भगवान गणेश को आसन अर्पित करें।',
        sa: 'मूर्त्याधारे अक्षतान् निधाय श्रीगणेशाय आसनं समर्पयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 6,
      title: { en: 'Padya', hi: 'पाद्य', sa: 'पाद्यम्' },
      description: {
        en: 'Wash the feet of the idol by pouring water mixed with flowers at the base.',
        hi: 'मूर्ति के चरणों में पुष्पमिश्रित जल डालकर पाद्य अर्पित करें।',
        sa: 'सपुष्पजलेन मूर्तेः पादौ प्रक्षाल्य पाद्यं समर्पयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 7,
      title: { en: 'Arghya', hi: 'अर्घ्य', sa: 'अर्घ्यम्' },
      description: {
        en: 'Offer water mixed with sandalwood, akshat, and flowers in cupped hands to Lord Ganesha.',
        hi: 'चन्दन, अक्षत और पुष्प मिश्रित जल अंजलि में लेकर भगवान गणेश को अर्घ्य दें।',
        sa: 'चन्दनाक्षतपुष्पमिश्रितजलं अञ्जलौ गृहीत्वा श्रीगणेशाय अर्घ्यं दद्यात्।',
      },
      duration: '1 min',
    },
    {
      step: 8,
      title: { en: 'Snana (Abhishek)', hi: 'स्नान (अभिषेक)', sa: 'स्नानम् (अभिषेकः)' },
      description: {
        en: 'Bathe the idol with Panchamrit (milk, curd, ghee, honey, sugar) followed by clean water. Wipe gently and place back.',
        hi: 'मूर्ति को पंचामृत (दूध, दही, घी, शहद, शक्कर) से स्नान कराएँ, फिर शुद्ध जल से धोएँ। पोंछकर वापस स्थापित करें।',
        sa: 'पञ्चामृतेन (क्षीर-दधि-घृत-मधु-शर्करा) मूर्तिं स्नापयेत् ततः शुद्धजलेन प्रक्षाल्य पुनः स्थापयेत्।',
      },
      duration: '5 min',
    },
    {
      step: 9,
      title: { en: 'Vastra', hi: 'वस्त्र', sa: 'वस्त्रम्' },
      description: {
        en: 'Offer new clothes or a piece of red/orange cloth to the idol.',
        hi: 'मूर्ति को नए वस्त्र या लाल/नारंगी कपड़ा अर्पित करें।',
        sa: 'नूतनवस्त्रं रक्तवर्णं वा मूर्तये समर्पयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 10,
      title: { en: 'Yagnopavita', hi: 'यज्ञोपवीत', sa: 'यज्ञोपवीतम्' },
      description: {
        en: 'Offer a sacred thread (janeu) to Ganesha by placing it over the idol.',
        hi: 'मूर्ति पर जनेऊ (यज्ञोपवीत) अर्पित करें।',
        sa: 'मूर्तौ यज्ञोपवीतं समर्पयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 11,
      title: { en: 'Gandha', hi: 'गन्ध', sa: 'गन्धम्' },
      description: {
        en: 'Apply sandalwood paste and kumkum to the idol.',
        hi: 'मूर्ति पर चन्दन का लेप और कुमकुम लगाएँ।',
        sa: 'मूर्तौ चन्दनं कुङ्कुमं च लेपयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 12,
      title: { en: 'Pushpa', hi: 'पुष्प', sa: 'पुष्पम्' },
      description: {
        en: 'Offer durva grass (21 blades in groups of 3 or 5) and red flowers (hibiscus) to Ganesha.',
        hi: 'गणेश जी को दूर्वा (21 तिनके, 3 या 5 के समूह में) और लाल पुष्प (गुड़हल) अर्पित करें।',
        sa: 'दूर्वाङ्कुरान् (एकविंशतिः, त्रिकपञ्चकसमूहैः) रक्तपुष्पाणि (जपाकुसुमानि) च गणेशाय समर्पयेत्।',
      },
      duration: '3 min',
    },
    {
      step: 13,
      title: { en: 'Dhupa', hi: 'धूप', sa: 'धूपम्' },
      description: {
        en: 'Light incense sticks and wave them before the idol in a clockwise motion.',
        hi: 'अगरबत्ती जलाकर मूर्ति के सामने दक्षिणावर्त (घड़ी की दिशा में) घुमाएँ।',
        sa: 'धूपं प्रज्वाल्य मूर्तेः पुरतः प्रदक्षिणक्रमेण भ्रामयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 14,
      title: { en: 'Deepa', hi: 'दीप', sa: 'दीपम्' },
      description: {
        en: 'Light a ghee lamp and wave it before the idol — 3 times at the feet, 2 at the navel, 1 at the face, then 7 times around the entire form.',
        hi: 'घी का दीपक जलाकर मूर्ति के सामने आरती करें — 3 बार चरणों पर, 2 बार नाभि पर, 1 बार मुख पर, फिर 7 बार पूरी मूर्ति के चारों ओर।',
        sa: 'घृतदीपं प्रज्वाल्य मूर्तेः पुरतः आरात्रिकं कुर्यात् — त्रिवारं पादयोः, द्विवारं नाभौ, एकवारं मुखे, ततः सप्तवारं सम्पूर्णमूर्तेः परितः।',
      },
      duration: '2 min',
    },
    {
      step: 15,
      title: { en: 'Naivedya', hi: 'नैवेद्य', sa: 'नैवेद्यम्' },
      description: {
        en: 'Offer 21 modaks, fruits, coconut, and jaggery to Lord Ganesha. Sprinkle water around the offerings and chant the naivedya mantra.',
        hi: '21 मोदक, फल, नारियल और गुड़ भगवान गणेश को अर्पित करें। भोग के चारों ओर जल छिड़कें और नैवेद्य मन्त्र पढ़ें।',
        sa: 'एकविंशतिमोदकान् फलानि नारिकेलं गुडं च श्रीगणेशाय निवेदयेत्। नैवेद्यस्य परितः जलं सिञ्चेत् नैवेद्यमन्त्रं च जपेत्।',
      },
      duration: '3 min',
    },
    {
      step: 16,
      title: { en: 'Tambula', hi: 'ताम्बूल', sa: 'ताम्बूलम्' },
      description: {
        en: 'Offer paan leaves and supari (betel nut) as tambula to Lord Ganesha.',
        hi: 'पान के पत्ते और सुपारी ताम्बूल के रूप में भगवान गणेश को अर्पित करें।',
        sa: 'ताम्बूलपत्राणि पूगीफलानि च ताम्बूलरूपेण श्रीगणेशाय समर्पयेत्।',
      },
      duration: '1 min',
    },
    {
      step: 17,
      title: { en: 'Pradakshina', hi: 'प्रदक्षिणा', sa: 'प्रदक्षिणा' },
      description: {
        en: 'Circumambulate the idol 3 times in a clockwise direction while chanting the Ganesh Beej Mantra.',
        hi: 'गणेश बीज मन्त्र पढ़ते हुए मूर्ति की 3 बार दक्षिणावर्त परिक्रमा करें।',
        sa: 'गणेशबीजमन्त्रं जपन् मूर्तेः त्रिवारं प्रदक्षिणां कुर्यात्।',
      },
      mantraRef: 'ganesh-beej',
      duration: '3 min',
    },
    {
      step: 18,
      title: { en: 'Mantra Pushpanjali', hi: 'मन्त्र पुष्पाञ्जलि', sa: 'मन्त्रपुष्पाञ्जलिः' },
      description: {
        en: 'Take flowers in both hands, recite the Mantra Pushpanjali, and offer the flowers at the feet of Lord Ganesha. This concludes the formal puja.',
        hi: 'दोनों हाथों में फूल लेकर, मन्त्र पुष्पाञ्जलि पढ़ें और भगवान गणेश के चरणों में फूल अर्पित करें। इससे औपचारिक पूजा सम्पन्न होती है।',
        sa: 'उभयहस्ताभ्यां पुष्पाणि गृहीत्वा मन्त्रपुष्पाञ्जलिं पठेत् श्रीगणेशचरणयोः पुष्पाणि समर्पयेत् च। अनेन औपचारिकी पूजा समाप्ता भवति।',
      },
      mantraRef: 'ganesh-pushpanjali',
      duration: '3 min',
    },
  ],

  mantras: [
    {
      id: 'ganesh-beej',
      name: { en: 'Ganesh Beej Mantra', hi: 'गणेश बीज मन्त्र', sa: 'गणेशबीजमन्त्रः' },
      devanagari: 'ॐ गं गणपतये नमः',
      iast: 'oṃ gaṃ gaṇapataye namaḥ',
      meaning: {
        en: 'Salutations to Lord Ganapati, the remover of obstacles',
        hi: 'विघ्नहर्ता भगवान गणपति को नमन',
        sa: 'विघ्नविनाशकाय श्रीगणपतये नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the puja for invoking Ganesha\'s blessings',
        hi: 'पूजा के दौरान गणेश जी का आशीर्वाद प्राप्त करने के लिए 108 बार जपें',
        sa: 'गणेशानुग्रहप्राप्त्यर्थं पूजाकाले अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'ganesh-gayatri',
      name: { en: 'Ganesh Gayatri Mantra', hi: 'गणेश गायत्री मन्त्र', sa: 'गणेशगायत्रीमन्त्रः' },
      devanagari: 'ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि तन्नो दन्ती प्रचोदयात्',
      iast: 'oṃ ekadantāya vidmahe vakratuṇḍāya dhīmahi tanno dantī pracodayāt',
      meaning: {
        en: 'We meditate upon the one-tusked Lord, we contemplate the curved-trunk one. May that tusked Lord inspire and illuminate us.',
        hi: 'हम एकदन्त को जानते हैं, वक्रतुण्ड का ध्यान करते हैं। वह दन्ती हमें प्रेरित करें।',
        sa: 'एकदन्तं विजानीमहे वक्रतुण्डं ध्यायामहे। दन्ती नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite during dhyana (meditation) step for deeper connection with Ganesha',
        hi: 'ध्यान चरण में गणेश जी से गहरे जुड़ाव के लिए पढ़ें',
        sa: 'ध्यानसमये गणेशेन गभीरसम्बन्धार्थं पठेत्',
      },
    },
    {
      id: 'ganesh-mool',
      name: { en: 'Ganesh Mool Mantra', hi: 'गणेश मूल मन्त्र', sa: 'गणेशमूलमन्त्रः' },
      devanagari: 'ॐ श्रीं ह्रीं क्लीं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा',
      iast: 'oṃ śrīṃ hrīṃ klīṃ gaṃ gaṇapataye vara varada sarvajanṃ me vaśamānaya svāhā',
      meaning: {
        en: 'O Lord Ganapati, bestower of boons, bring all people under my benevolent influence.',
        hi: 'हे वरदाता गणपति, सभी लोगों को मेरे शुभ प्रभाव में लाएँ।',
        sa: 'हे वरद गणपते, सर्वजनान् मम शुभवशं आनय।',
      },
      usage: {
        en: 'Chant for attracting blessings of prosperity and influence',
        hi: 'समृद्धि और प्रभाव के आशीर्वाद के लिए जपें',
        sa: 'समृद्धिप्रभावानुग्रहार्थं जपेत्',
      },
    },
    {
      id: 'vakratunda',
      name: { en: 'Vakratunda Mahakaya', hi: 'वक्रतुण्ड महाकाय', sa: 'वक्रतुण्डमहाकायम्' },
      devanagari: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      iast: 'vakratuṇḍa mahākāya sūryakoṭi samaprabha | nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā ||',
      meaning: {
        en: 'O Lord with the curved trunk and massive body, whose brilliance equals a million suns — make all my endeavors free of obstacles, always.',
        hi: 'हे वक्रतुण्ड, विशाल शरीर वाले, करोड़ सूर्यों के समान तेजस्वी — मेरे सभी कार्य सदा निर्विघ्न करें।',
        sa: 'हे वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ, मम सर्वकार्याणि सर्वदा निर्विघ्नानि कुरु।',
      },
      usage: {
        en: 'Recite at the beginning of the puja and before any new venture',
        hi: 'पूजा के आरम्भ में और किसी भी नए कार्य से पहले पढ़ें',
        sa: 'पूजारम्भे नवकार्यारम्भे च पठेत्',
      },
    },
    {
      id: 'ganesh-pushpanjali',
      name: { en: 'Ganesh Mantra Pushpanjali', hi: 'गणेश मन्त्र पुष्पाञ्जलि', sa: 'गणेशमन्त्रपुष्पाञ्जलिः' },
      devanagari: 'ॐ गणानां त्वा गणपतिं हवामहे कविं कवीनामुपमश्रवस्तमम्। ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत आ नः शृण्वन्नूतिभिः सीद सादनम्॥',
      iast: 'oṃ gaṇānāṃ tvā gaṇapatiṃ havāmahe kaviṃ kavīnāmupamaśravastamam | jyeṣṭharājaṃ brahmaṇāṃ brahmaṇaspata ā naḥ śṛṇvannūtibhiḥ sīda sādanam ||',
      meaning: {
        en: 'We invoke you, Lord of the Ganas, wisest among the wise, supreme in glory. O eldest king of prayers, Lord of sacred speech — hear our invocations and take your seat among us.',
        hi: 'हे गणों के स्वामी, बुद्धिमानों में सर्वश्रेष्ठ, कीर्ति में सर्वोच्च — हम आपका आवाहन करते हैं। हे प्रार्थनाओं के ज्येष्ठ राजा, ब्रह्मणस्पति — हमारी पुकार सुनकर हमारे बीच विराजें।',
        sa: 'हे गणपते, गणानां गणाधिप, कवीनां कवे, उपमश्रवस्तम, ज्येष्ठराजन्, ब्रह्मणस्पते — नः ऊतिभिः शृण्वन् सादने आ सीद।',
      },
      usage: {
        en: 'Recite at the conclusion of the puja while offering flowers with both hands',
        hi: 'पूजा के अन्त में दोनों हाथों से पुष्प अर्पित करते हुए पढ़ें',
        sa: 'पूजान्ते उभयहस्ताभ्यां पुष्पार्पणकाले पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Ganapati Atharvashirsha', hi: 'गणपति अथर्वशीर्ष', sa: 'गणपत्यथर्वशीर्षम्' },
      verseCount: 21,
      duration: '15 min',
      note: {
        en: 'The most important Upanishad dedicated to Ganesha. Recite in full for complete blessings.',
        hi: 'गणेश को समर्पित सबसे महत्वपूर्ण उपनिषद। पूर्ण आशीर्वाद के लिए सम्पूर्ण पाठ करें।',
        sa: 'गणेशाय समर्पितं सर्वप्रधानम् उपनिषत्। सम्पूर्णानुग्रहार्थं सकलं पठेत्।',
      },
    },
    {
      name: { en: 'Sankatanashana Ganesha Stotra', hi: 'संकटनाशन गणेश स्तोत्र', sa: 'सङ्कटनाशनगणेशस्तोत्रम्' },
      verseCount: 12,
      duration: '8 min',
      note: {
        en: 'Powerful stotra for removal of obstacles and difficulties.',
        hi: 'विघ्नों और कठिनाइयों के निवारण के लिए प्रभावशाली स्तोत्र।',
        sa: 'विघ्नकष्टनिवारणार्थं प्रभावशालि स्तोत्रम्।',
      },
    },
  ],

  aarti: {
    name: { en: 'Jai Ganesh Jai Ganesh Deva', hi: 'जय गणेश जय गणेश देवा', sa: 'जय गणेश जय गणेश देवा' },
    devanagari:
      'जय गणेश जय गणेश जय गणेश देवा।\nमाता जाकी पार्वती पिता महादेवा॥\n\nएक दन्त दयावन्त चार भुजा धारी।\nमाथे पर तिलक सोहे मूसे की सवारी॥\nजय गणेश जय गणेश जय गणेश देवा॥\n\nपान चढ़े फूल चढ़े और चढ़े मेवा।\nलड्डुअन का भोग लगे सन्त करें सेवा॥\nजय गणेश जय गणेश जय गणेश देवा॥',
    iast:
      'jaya gaṇeśa jaya gaṇeśa jaya gaṇeśa devā |\nmātā jākī pārvatī pitā mahādevā ||\n\neka danta dayāvanta cāra bhujā dhārī |\nmāthe para tilaka sohe mūse kī savārī ||\njaya gaṇeśa jaya gaṇeśa jaya gaṇeśa devā ||\n\npāna caḍhe phūla caḍhe aura caḍhe mevā |\nlaḍḍuana kā bhoga lage santa kareṃ sevā ||\njaya gaṇeśa jaya gaṇeśa jaya gaṇeśa devā ||',
  },

  naivedya: {
    en: '21 modaks (steam-cooked sweet dumplings filled with coconut and jaggery), fresh fruits, whole coconut, jaggery, and laddoos',
    hi: '21 मोदक (नारियल और गुड़ भरे भाप में पके मीठे पकौड़े), ताजे फल, पूरा नारियल, गुड़ और लड्डू',
    sa: 'एकविंशतिमोदकाः (नारिकेलगुडपूरिताः उष्मपक्वाः मिष्टाः), नवफलानि, सम्पूर्णनारिकेलम्, गुडम्, मोदकानि च',
  },

  precautions: [
    {
      en: 'Do NOT look at the moon on Chaturthi night — this causes Chandra Dosha (Mithya Dosha), leading to false accusations',
      hi: 'चतुर्थी की रात चन्द्रमा को न देखें — इससे चन्द्र दोष (मिथ्या दोष) लगता है, जिससे झूठे आरोप लगते हैं',
      sa: 'चतुर्थीरात्रौ चन्द्रदर्शनं न कुर्यात् — अनेन चन्द्रदोषः (मिथ्यादोषः) भवति येन मिथ्याभियोगः जायते',
    },
    {
      en: 'Use only eco-friendly clay idol — avoid Plaster of Paris or chemical paint idols',
      hi: 'केवल पर्यावरण-अनुकूल मिट्टी की मूर्ति का उपयोग करें — प्लास्टर ऑफ पेरिस या रासायनिक रंग वाली मूर्ति से बचें',
      sa: 'पर्यावरणानुकूलां मृण्मयीं मूर्तिमेव उपयोजयेत् — रासायनिकवर्णयुक्तां मूर्तिं वर्जयेत्',
    },
    {
      en: 'Durva grass must have 3 or 5 blades — never offer single blades or even-numbered bunches',
      hi: 'दूर्वा में 3 या 5 पत्तियाँ होनी चाहिए — एक पत्ती या सम संख्या वाले गुच्छे कभी न चढ़ाएँ',
      sa: 'दूर्वा त्रिपत्रा पञ्चपत्रा वा भवेत् — एकपत्रां समसङ्ख्यापत्रां वा कदापि न समर्पयेत्',
    },
    {
      en: 'Use red or orange flowers only — white flowers are generally not offered to Ganesha',
      hi: 'केवल लाल या नारंगी फूल ही चढ़ाएँ — सफेद फूल सामान्यतः गणेश को नहीं चढ़ाए जाते',
      sa: 'रक्तवर्णानि नारङ्गवर्णानि वा पुष्पाणि एव समर्पयेत् — श्वेतपुष्पाणि प्रायशः गणेशाय न समर्पन्ते',
    },
    {
      en: 'Tulsi leaves are NEVER offered to Ganesha — this is strictly prohibited in shastra',
      hi: 'तुलसी के पत्ते गणेश को कभी नहीं चढ़ाए जाते — यह शास्त्रों में पूर्णतः निषिद्ध है',
      sa: 'तुलसीपत्राणि गणेशाय कदापि न समर्पयेत् — इदं शास्त्रेषु सर्वथा निषिद्धम्',
    },
  ],

  phala: {
    en: 'Removal of all obstacles (Vighna Nashana), bestowal of wisdom and intellect (Buddhi Pradayaka), success in new ventures, and fulfillment of all righteous desires',
    hi: 'सभी विघ्नों का नाश (विघ्ननाशन), बुद्धि और विवेक की प्राप्ति (बुद्धिप्रदायक), नए कार्यों में सफलता, और सभी धार्मिक इच्छाओं की पूर्ति',
    sa: 'सर्वविघ्ननाशनम्, बुद्धिमेधाप्रदानम्, नवकार्यसिद्धिः, सर्वधर्मकामनापूर्तिः च',
  },

  visarjan: {
    en: 'Immerse the idol in water on Anant Chaturdashi (after 1.5, 3, 5, 7, or 10 days). Perform aarti before visarjan, circumambulate 3 times chanting "Ganapati Bappa Morya, Pudhchya Varshi Laukarya!"',
    hi: 'अनन्त चतुर्दशी पर मूर्ति का जल में विसर्जन करें (1.5, 3, 5, 7 या 10 दिन बाद)। विसर्जन से पहले आरती करें, 3 बार परिक्रमा करें और "गणपति बप्पा मोरया, पुढच्या वर्षी लवकरिया!" का जयघोष करें।',
    sa: 'अनन्तचतुर्दश्यां मूर्तिं जले विसर्जयेत् (सार्धदिनानन्तरं, त्रिदिनानन्तरं, पञ्चदिनानन्तरं, सप्तदिनानन्तरं, दशदिनानन्तरं वा)। विसर्जनात् पूर्वम् आरात्रिकं कुर्यात्, त्रिवारं प्रदक्षिणां कुर्यात्।',
  },
};

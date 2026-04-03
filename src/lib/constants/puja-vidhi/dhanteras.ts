import type { PujaVidhi } from './types';

export const DHANTERAS_PUJA: PujaVidhi = {
  festivalSlug: 'dhanteras',
  category: 'festival',
  deity: { en: 'Dhanvantari & Lakshmi', hi: 'धन्वन्तरि एवं लक्ष्मी', sa: 'धन्वन्तरिः लक्ष्मीश्च' },

  samagri: [
    { name: { en: 'New gold/silver item or metal utensil', hi: 'नया सोना/चाँदी का सामान या धातु का बर्तन', sa: 'नवसुवर्णरजतवस्तु अथवा धातुपात्रम्' }, note: { en: 'Buying metals on Dhanteras is highly auspicious', hi: 'धनतेरस पर धातु खरीदना अत्यन्त शुभ है', sa: 'धनत्रयोदश्यां धातुक्रयणम् अत्यन्तशुभम्' }, category: 'other', essential: true },
    { name: { en: 'Diyas (earthen lamps)', hi: 'दीपक (मिट्टी के)', sa: 'दीपाः (मृत्तिकानिर्मिताः)' }, quantity: '13', note: { en: '13 Yama Deepa for warding off untimely death', hi: 'अकाल मृत्यु निवारण हेतु 13 यम दीपक', sa: 'अकालमृत्युनिवारणार्थं त्रयोदश यमदीपाः' }, category: 'puja_items', essential: true },
    { name: { en: 'Dhatura flowers and fruits', hi: 'धतूरे के फूल और फल', sa: 'धत्तूरपुष्पफलानि' }, category: 'flowers', essential: true },
    { name: { en: 'Coins (old and new)', hi: 'सिक्के (पुराने और नए)', sa: 'मुद्राः (पुरातनाः नवाश्च)' }, category: 'other', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Flowers (marigold, lotus)', hi: 'फूल (गेंदा, कमल)', sa: 'पुष्पाणि (स्थलपद्मम्, कमलम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee', hi: 'घी', sa: 'घृतम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Turmeric', hi: 'हल्दी', sa: 'हरिद्रा' }, category: 'puja_items', essential: false },
    { name: { en: 'Sweets', hi: 'मिठाई', sa: 'मिष्टान्नानि' }, category: 'food', essential: true },
    { name: { en: 'Dhaniya (coriander seeds)', hi: 'धनिया', sa: 'धान्यकम्' }, note: { en: 'Symbol of prosperity (Dhan)', hi: 'धन का प्रतीक', sa: 'धनस्य प्रतीकम्' }, category: 'other', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Dhanteras puja is performed during Pradosh Kaal (after sunset) on Kartik Krishna Trayodashi. The most auspicious window is the Sthira Lagna (fixed sign rising), typically between 6:00 PM and 8:00 PM.',
    hi: 'धनतेरस पूजा कार्तिक कृष्ण त्रयोदशी को प्रदोष काल (सूर्यास्त के बाद) में की जाती है। सबसे शुभ समय स्थिर लग्न होता है, सामान्यतः शाम 6 से 8 बजे के बीच।',
    sa: 'धनत्रयोदशीपूजा कार्तिककृष्णत्रयोदश्यां प्रदोषकाले (सूर्यास्तानन्तरम्) क्रियते। स्थिरलग्ने सर्वोत्तमः शुभकालः, सामान्यतः सायं षड्वादनतः अष्टवादनपर्यन्तम्।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this auspicious Kartik Krishna Trayodashi (Dhanteras), I undertake the worship of Lord Dhanvantari and Goddess Lakshmi for good health, wealth, and protection from untimely death.',
    hi: 'इस शुभ कार्तिक कृष्ण त्रयोदशी (धनतेरस) पर, स्वास्थ्य, धन और अकाल मृत्यु से रक्षा के लिए, मैं भगवान धन्वन्तरि और देवी लक्ष्मी की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे कार्तिककृष्णत्रयोदश्यां (धनत्रयोदश्याम्) स्वास्थ्यधनप्राप्त्यकालमृत्युनिवारणार्थं श्रीधन्वन्तरिलक्ष्मीपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Purchase of Metals', hi: 'धातु की खरीदारी', sa: 'धातुक्रयणम्' },
      description: {
        en: 'Before the puja, purchase a new gold or silver item, or at minimum a steel/brass utensil. This purchase symbolizes inviting wealth into the home. The item should be bought during Pradosh Kaal if possible.',
        hi: 'पूजा से पहले, नया सोना या चाँदी का सामान, या कम से कम स्टील/पीतल का बर्तन खरीदें। यह खरीदारी घर में धन के आगमन का प्रतीक है। यदि सम्भव हो तो प्रदोष काल में खरीदें।',
        sa: 'पूजनात् पूर्वं नवसुवर्णरजतवस्तु, न्यूनतमं लोहकांस्यपात्रं वा क्रीणीयात्। इदं क्रयणं गृहे धनागमनस्य प्रतीकम्। यदि शक्यं प्रदोषकाले क्रीणीयात्।',
      },
      duration: '30 min',
      essential: false,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Home Cleaning & Preparation', hi: 'घर की सफाई और तैयारी', sa: 'गृहशोधनसज्जता' },
      description: {
        en: 'Clean the entire home, especially the puja area and main entrance. Spread a clean cloth on the puja platform. Place the Dhanvantari and Lakshmi images, new purchases, coins, and sweets on the platform.',
        hi: 'पूरे घर की सफाई करें, विशेषतः पूजा स्थल और मुख्य प्रवेश द्वार। पूजा चौकी पर साफ कपड़ा बिछाएँ। धन्वन्तरि और लक्ष्मी चित्र, नई खरीदारी, सिक्के और मिठाई चौकी पर रखें।',
        sa: 'सम्पूर्णं गृहं शोधयेत्, विशेषतः पूजास्थलं मुख्यद्वारं च। पूजावेदिकायां शुचिवस्त्रं विस्तारयेत्। धन्वन्तरिलक्ष्मीचित्राणि, नवक्रीतवस्तूनि, मुद्राः, मिष्टान्नानि च वेदिकायां स्थापयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Achamana & Sankalpa', hi: 'आचमन एवं संकल्प', sa: 'आचमनसङ्कल्पौ' },
      description: {
        en: 'Sip water three times for purification. Take the sankalpa by holding water and akshat in the right hand, stating the purpose of the puja.',
        hi: 'शुद्धि के लिए तीन बार जल का आचमन करें। दाहिने हाथ में जल और अक्षत लेकर पूजा का संकल्प लें।',
        sa: 'शुद्ध्यर्थं त्रिवारं जलम् आचामेत्। दक्षिणहस्ते जलाक्षतान् गृहीत्वा पूजासङ्कल्पं कुर्यात्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Dhanvantari Puja', hi: 'धन्वन्तरि पूजा', sa: 'धन्वन्तरिपूजनम्' },
      description: {
        en: 'Worship Lord Dhanvantari (the divine physician, avatar of Vishnu who emerged with Amrit Kalash during Samudra Manthan). Offer kumkum, akshat, flowers, dhatura, and incense. Chant the Dhanvantari Mantra.',
        hi: 'भगवान धन्वन्तरि (दिव्य चिकित्सक, विष्णु के अवतार जो समुद्र मन्थन में अमृत कलश लेकर प्रकट हुए) की पूजा करें। कुमकुम, अक्षत, फूल, धतूरा और धूप अर्पित करें। धन्वन्तरि मन्त्र का जाप करें।',
        sa: 'भगवन्तं धन्वन्तरिं (दिव्यभिषजम्, विष्ण्ववतारं यः समुद्रमन्थने अमृतकलशेन प्रकटः) पूजयेत्। कुङ्कुमम् अक्षतान् पुष्पाणि धत्तूरं धूपं च समर्पयेत्। धन्वन्तरिमन्त्रं जपेत्।',
      },
      mantraRef: 'dhanvantari-mantra',
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Lakshmi Puja', hi: 'लक्ष्मी पूजा', sa: 'लक्ष्मीपूजनम्' },
      description: {
        en: 'Worship Goddess Lakshmi with flowers, kumkum, akshat, and incense. Place coins and the new metal purchase before her image. Chant the Lakshmi mantra.',
        hi: 'देवी लक्ष्मी की फूल, कुमकुम, अक्षत और धूप से पूजा करें। उनके चित्र के सामने सिक्के और नई धातु की खरीदारी रखें। लक्ष्मी मन्त्र का जाप करें।',
        sa: 'देवीं लक्ष्मीं पुष्पैः कुङ्कुमेन अक्षतैः धूपेन च पूजयेत्। तस्याः चित्रस्य पुरतः मुद्राः नवधातुक्रीतवस्तु च स्थापयेत्। लक्ष्मीमन्त्रं जपेत्।',
      },
      mantraRef: 'dhanteras-lakshmi',
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Yama Deepa (13 Lamps)', hi: 'यम दीपक (13 दीपक)', sa: 'यमदीपाः (त्रयोदशदीपाः)' },
      description: {
        en: 'Light 13 earthen diyas filled with ghee or mustard oil. Place them outside the main door facing SOUTH — this is the Yama Deepa, lit to ward off untimely death (apamrityu). One diya should be placed facing south in the evening and left to burn through the night.',
        hi: 'घी या सरसों के तेल से भरे 13 मिट्टी के दीपक जलाएँ। इन्हें मुख्य द्वार के बाहर दक्षिण दिशा में रखें — यह यम दीपक है, जो अकाल मृत्यु (अपमृत्यु) से बचाने के लिए जलाया जाता है। एक दीपक शाम को दक्षिण दिशा में रखकर रात भर जलने दें।',
        sa: 'घृतेन सर्षपतैलेन वा पूर्णान् त्रयोदश मृत्तिकादीपान् प्रज्वालयेत्। मुख्यद्वारस्य बहिः दक्षिणदिशि स्थापयेत् — इमे यमदीपाः, अकालमृत्योः (अपमृत्योः) निवारणार्थं प्रज्वाल्यन्ते। एकं दीपं सायं दक्षिणदिशि स्थापयित्वा रात्रौ ज्वलन्तं त्यजेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Naivedya & Aarti', hi: 'नैवेद्य एवं आरती', sa: 'नैवेद्यम् आरात्रिकं च' },
      description: {
        en: 'Offer sweets, fruits, and coriander seeds as naivedya. Perform aarti with camphor and ghee lamp, singing the Dhanvantari aarti.',
        hi: 'मिठाई, फल और धनिया नैवेद्य के रूप में अर्पित करें। कपूर और घी के दीपक से धन्वन्तरि आरती गाते हुए आरती करें।',
        sa: 'मिष्टान्नानि फलानि धान्यकं च नैवेद्यरूपेण निवेदयेत्। कर्पूरघृतदीपेन धन्वन्तर्यारात्रिकं गायन्ती आरात्रिकं कुर्यात्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 8,
      title: { en: 'Pradakshina & Prarthana', hi: 'प्रदक्षिणा एवं प्रार्थना', sa: 'प्रदक्षिणा प्रार्थना च' },
      description: {
        en: 'Circumambulate the puja setup 3 times. Pray for good health, wealth, and protection from untimely death for the entire family. Distribute prasad.',
        hi: 'पूजा स्थल की 3 बार प्रदक्षिणा करें। पूरे परिवार के स्वास्थ्य, धन और अकाल मृत्यु से रक्षा की प्रार्थना करें। प्रसाद बाँटें।',
        sa: 'पूजास्थलस्य त्रिवारं प्रदक्षिणां कुर्यात्। सम्पूर्णकुटुम्बस्य स्वास्थ्यधनाकालमृत्युरक्षणार्थं प्रार्थयेत्। प्रसादं वितरेत्।',
      },
      duration: '3 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'dhanvantari-mantra',
      name: { en: 'Dhanvantari Mantra', hi: 'धन्वन्तरि मन्त्र', sa: 'धन्वन्तरिमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय धन्वन्तरये अमृतकलशहस्ताय सर्वामयविनाशनाय त्रैलोक्यनाथाय श्री महाविष्णवे नमः',
      iast: 'oṃ namo bhagavate vāsudevāya dhanvantaraye amṛtakalaśahastāya sarvāmayavināśanāya trailokyānāthāya śrī mahāviṣṇave namaḥ',
      meaning: {
        en: 'Salutations to Lord Vasudeva Dhanvantari, who holds the pot of amrit (nectar of immortality), destroyer of all diseases, lord of the three worlds, the great Vishnu.',
        hi: 'भगवान वासुदेव धन्वन्तरि को नमन, जो अमृत कलश धारण करते हैं, सभी रोगों के नाशक, त्रिलोक के स्वामी, महाविष्णु।',
        sa: 'भगवते वासुदेवाय धन्वन्तरये नमः, यो अमृतकलशहस्तः, सर्वामयविनाशनः, त्रैलोक्यनाथः श्रीमहाविष्णुः।',
      },
      japaCount: 108,
      usage: {
        en: 'Primary mantra for Dhanteras — chant 108 times during Dhanvantari puja for health and longevity',
        hi: 'धनतेरस का मुख्य मन्त्र — स्वास्थ्य और दीर्घायु के लिए धन्वन्तरि पूजा में 108 बार जपें',
        sa: 'धनत्रयोदश्याः प्रधानमन्त्रः — स्वास्थ्यदीर्घायुषे धन्वन्तरिपूजने अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'dhanteras-lakshmi',
      name: { en: 'Lakshmi Dhana Mantra', hi: 'लक्ष्मी धन मन्त्र', sa: 'लक्ष्मीधनमन्त्रः' },
      devanagari: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः',
      iast: 'oṃ śrīṃ hrīṃ klīṃ mahālakṣmyai namaḥ',
      meaning: {
        en: 'Salutations to Maha Lakshmi with the beej mantras of prosperity (Shrim), maya (Hrim), and attraction (Klim)',
        hi: 'समृद्धि (श्रीं), माया (ह्रीं), और आकर्षण (क्लीं) बीजमन्त्रों सहित महालक्ष्मी को नमन',
        sa: 'श्रीबीजं ह्रीबीजं क्लीबीजं च सहित्वा महालक्ष्म्यै नमः',
      },
      usage: {
        en: 'Chant during Lakshmi puja step on Dhanteras for wealth attraction',
        hi: 'धन आकर्षण के लिए धनतेरस पर लक्ष्मी पूजा चरण में जपें',
        sa: 'धनाकर्षणार्थं धनत्रयोदश्यां लक्ष्मीपूजनचरणे जपेत्',
      },
    },
    {
      id: 'yama-deepa-mantra',
      name: { en: 'Yama Deepa Mantra', hi: 'यम दीप मन्त्र', sa: 'यमदीपमन्त्रः' },
      devanagari: 'मृत्युना पाशदण्डाभ्यां कालेन श्यामया सह।\nत्रयोदश्यां दीपदानात् सूर्यजः प्रीयतां मम॥',
      iast: 'mṛtyunā pāśadaṇḍābhyāṃ kālena śyāmayā saha |\ntrayodaśyāṃ dīpadānāt sūryajaḥ prīyatāṃ mama ||',
      meaning: {
        en: 'May Yama (son of Surya), along with Mrityu, Pasha, Danda, Kala, and Shyama, be pleased with me through the offering of lamps on the Trayodashi.',
        hi: 'मृत्यु, पाश, दण्ड, काल और श्यामा सहित यम (सूर्यपुत्र) त्रयोदशी पर दीपदान से मुझ पर प्रसन्न हों।',
        sa: 'मृत्यु-पाश-दण्ड-काल-श्यामाभिः सह सूर्यजः (यमः) त्रयोदश्यां दीपदानेन मम प्रीयताम्।',
      },
      usage: {
        en: 'Recite while lighting the 13 Yama Deepa outside the main door facing south',
        hi: 'मुख्य द्वार के बाहर दक्षिण दिशा में 13 यम दीपक जलाते समय पढ़ें',
        sa: 'मुख्यद्वारस्य बहिः दक्षिणदिशि त्रयोदशयमदीपान् प्रज्वालयन् पठेत्',
      },
    },
  ],

  aarti: {
    name: { en: 'Dhanvantari Aarti', hi: 'धन्वन्तरि आरती', sa: 'धन्वन्तर्यारात्रिकम्' },
    devanagari:
      '॥ श्री धन्वन्तरि आरती ॥\n\nॐ जय धन्वन्तरि देवा, ॐ जय धन्वन्तरि देवा।\nअमृतकलश कर धारा, आरत जन सेवा॥\nॐ जय धन्वन्तरि देवा॥\n\nसमुद्र मन्थन में प्रकटे, अमृत लेकर आए।\nदेवताओं को अमृत दे, असुरन को भगाए॥\nॐ जय धन्वन्तरि देवा॥\n\nआयुर्वेद के ज्ञाता, रोग हरण सुखकारी।\nनीलवर्ण चतुर्भुज, शंख चक्र धारी॥\nॐ जय धन्वन्तरि देवा॥\n\nधन्वन्तरि की आरती, जो कोई नर गावै।\nरोगमुक्त सुखसम्पन्न, सदा हर्ष पावै॥\nॐ जय धन्वन्तरि देवा॥',
    iast:
      '|| śrī dhanvantari āratī ||\n\noṃ jaya dhanvantari devā, oṃ jaya dhanvantari devā |\namṛtakalaśa kara dhārā, ārata jana sevā ||\noṃ jaya dhanvantari devā ||\n\nsamudra manthana meṃ prakaṭe, amṛta lekara āye |\ndevatāoṃ ko amṛta de, asurana ko bhagāye ||\noṃ jaya dhanvantari devā ||\n\nāyurveda ke jñātā, roga haraṇa sukhakārī |\nnīlavarṇa caturbhuja, śaṅkha cakra dhārī ||\noṃ jaya dhanvantari devā ||\n\ndhanvantari kī āratī, jo koī nara gāvai |\nrogamukta sukhasampanna, sadā harṣa pāvai ||\noṃ jaya dhanvantari devā ||',
  },

  naivedya: {
    en: 'Sweets (barfi, laddoo), fresh fruits, coriander seeds, coconut, and dry fruits',
    hi: 'मिठाई (बर्फी, लड्डू), ताजे फल, धनिया, नारियल और मेवे',
    sa: 'मिष्टान्नानि (बर्फी, मोदकानि), नवफलानि, धान्यकम्, नारिकेलम्, शुष्कफलानि च',
  },

  precautions: [
    {
      en: 'The 13 Yama Deepa must be placed outside the main door facing SOUTH — this is critical for the ritual to ward off untimely death',
      hi: '13 यम दीपक मुख्य द्वार के बाहर दक्षिण दिशा में रखने चाहिए — अकाल मृत्यु निवारण अनुष्ठान के लिए यह अत्यन्त महत्वपूर्ण है',
      sa: 'त्रयोदशयमदीपाः मुख्यद्वारस्य बहिः दक्षिणदिशि स्थापनीयाः — अकालमृत्युनिवारणकर्मणः इदम् अत्यावश्यकम्',
    },
    {
      en: 'Do not buy iron on Dhanteras — buy gold, silver, brass, or steel',
      hi: 'धनतेरस पर लोहा न खरीदें — सोना, चाँदी, पीतल या स्टील खरीदें',
      sa: 'धनत्रयोदश्यां लौहं न क्रीणीयात् — सुवर्णं रजतं कांस्यं लोहपात्रं वा क्रीणीयात्',
    },
    {
      en: 'The Yama Deepa should be kept burning the entire night — do not extinguish them',
      hi: 'यम दीपक पूरी रात जलते रहने चाहिए — इन्हें बुझाएँ नहीं',
      sa: 'यमदीपाः सम्पूर्णां रात्रिं ज्वलन्तः भवेयुः — तान् न निर्वापयेत्',
    },
    {
      en: 'Face North while performing Lakshmi puja — North is the direction of Kubera (wealth)',
      hi: 'लक्ष्मी पूजा करते समय उत्तर दिशा की ओर मुख करें — उत्तर कुबेर (धन) की दिशा है',
      sa: 'लक्ष्मीपूजने उत्तराभिमुखं तिष्ठेत् — उत्तरा कुबेरस्य (धनस्य) दिक्',
    },
  ],

  phala: {
    en: 'Protection from untimely death (apamrityu nivaran), bestowal of good health by Dhanvantari, attraction of wealth and prosperity by Lakshmi, auspicious beginning of the Diwali festivities, and purification of all metals and valuables in the home',
    hi: 'अकाल मृत्यु से रक्षा (अपमृत्यु निवारण), धन्वन्तरि द्वारा उत्तम स्वास्थ्य प्रदान, लक्ष्मी द्वारा धन-समृद्धि का आकर्षण, दिवाली उत्सव का शुभारम्भ, और घर की सभी धातुओं और मूल्यवान वस्तुओं का शुद्धिकरण',
    sa: 'अकालमृत्युनिवारणम्, धन्वन्तरिणा उत्तमस्वास्थ्यप्रदानम्, लक्ष्म्या धनसमृद्ध्याकर्षणम्, दीपावलीमहोत्सवस्य शुभारम्भः, गृहस्य सर्वधातूनां मूल्यवस्तूनां च शुद्धिकरणं च',
  },
};

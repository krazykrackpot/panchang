import type { PujaVidhi } from './types';

export const UGADI_PUJA: PujaVidhi = {
  festivalSlug: 'ugadi',
  category: 'festival',
  deity: { en: 'Brahma & Vishnu', hi: 'ब्रह्मा एवं विष्णु', sa: 'ब्रह्मा विष्णुश्च' },

  samagri: [
    { name: { en: 'Neem flowers (Bevu)', hi: 'नीम के फूल (बेवु)', sa: 'निम्बपुष्पाणि (बेवु)' }, category: 'flowers', essential: true },
    { name: { en: 'Jaggery (Bella)', hi: 'गुड़ (बेल्ला)', sa: 'गुडम् (बेल्ला)' }, category: 'food', essential: true },
    { name: { en: 'Raw mango pieces', hi: 'कच्चे आम के टुकड़े', sa: 'आम्रस्य आमखण्डानि' }, category: 'food', essential: true },
    { name: { en: 'Tamarind', hi: 'इमली', sa: 'चिञ्चा' }, category: 'food', essential: true },
    { name: { en: 'Fresh neem leaves', hi: 'ताज़ी नीम की पत्तियाँ', sa: 'आर्द्रनिम्बपत्राणि' }, category: 'puja_items', essential: true },
    { name: { en: 'Mango leaves (for torana)', hi: 'आम के पत्ते (तोरण के लिए)', sa: 'आम्रपत्राणि (तोरणार्थम्)' }, category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, category: 'food', essential: true },
    { name: { en: 'Banana', hi: 'केला', sa: 'कदलीफलम्' }, category: 'food', essential: true },
    { name: { en: 'Panchanga (almanac) for the new year', hi: 'नए वर्ष का पञ्चाङ्ग', sa: 'नववर्षस्य पञ्चाङ्गम्' }, category: 'other', essential: true },
    { name: { en: 'Oil for abhyanga (sesame oil)', hi: 'अभ्यंग के लिए तेल (तिल का तेल)', sa: 'अभ्यङ्गार्थं तैलम् (तिलतैलम्)' }, category: 'other', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Flowers (marigold, jasmine)', hi: 'फूल (गेंदा, चमेली)', sa: 'पुष्पाणि (स्थलपद्मं मल्लिका)' }, category: 'flowers', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum', hi: 'कुमकुम', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'New clothes', hi: 'नए वस्त्र', sa: 'नववस्त्राणि' }, category: 'clothing', essential: false },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Ugadi falls on Chaitra Shukla Pratipada — the first day of the Hindu lunar new year in the Deccan region. The main puja is performed during the morning hours (Purva Madhyahna) between 6 AM and 12 PM. The Panchanga Sravanam (listening to the new year\'s almanac) should be done during this window. Abhyanga Snana (oil bath) is taken before sunrise.',
    hi: 'उगादि चैत्र शुक्ल प्रतिपदा को आती है — दक्कन क्षेत्र में हिन्दू चान्द्र नववर्ष का पहला दिन। मुख्य पूजा प्रातः (पूर्व मध्याह्न) 6 AM से 12 PM के बीच की जाती है। पञ्चाङ्ग श्रवणम् (नववर्ष के पञ्चाङ्ग का श्रवण) इसी समय में होना चाहिए। अभ्यङ्ग स्नान (तेल स्नान) सूर्योदय से पहले किया जाता है।',
    sa: 'उगादिः चैत्रशुक्लप्रतिपदि आगच्छति — दक्षिणक्षेत्रे हिन्दूचान्द्रनववर्षस्य प्रथमदिनम्। प्रधानपूजा पूर्वमध्याह्ने प्रातः षड्वादनतः मध्याह्नद्वादशवादनपर्यन्तं क्रियते। पञ्चाङ्गश्रवणम् अस्मिन् काले कार्यम्। अभ्यङ्गस्नानं सूर्योदयात् पूर्वं क्रियते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred day of Ugadi, Chaitra Shukla Pratipada, the beginning of the new Samvatsara, I perform this puja seeking the blessings of Lord Brahma the creator and Lord Vishnu the sustainer, for a year filled with prosperity, good health, and happiness. I embrace all six flavours of life — sweet, sour, bitter, salty, pungent, and astringent — with equanimity.',
    hi: 'इस पवित्र उगादि दिवस, चैत्र शुक्ल प्रतिपदा, नए संवत्सर के आरम्भ पर, समृद्धि, स्वास्थ्य और सुख से परिपूर्ण वर्ष के लिए सृष्टिकर्ता ब्रह्मा और पालनकर्ता विष्णु का आशीर्वाद माँगते हुए यह पूजा करता/करती हूँ। मैं जीवन के छह रसों — मीठा, खट्टा, कड़वा, नमकीन, तीखा और कसैला — को समभाव से स्वीकार करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे उगादिदिने चैत्रशुक्लप्रतिपदि नवसंवत्सरारम्भे समृद्धिस्वास्थ्यसुखपूर्णवर्षार्थं सृष्टिकर्तुः ब्रह्मणः पालयितुः विष्णोश्च आशीर्वादं याचन् इदं पूजनं करिष्ये। जीवनस्य षड्रसान् — मधुरं आम्लं तिक्तं लवणं कटुकं कषायं च — समभावेन स्वीकरोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Abhyanga Snana (Oil Bath)', hi: 'अभ्यङ्ग स्नान (तेल स्नान)', sa: 'अभ्यङ्गस्नानम् (तैलस्नानम्)' },
      description: {
        en: 'Before sunrise, apply warm sesame oil all over the body and head. Massage thoroughly for at least 15 minutes. Then take a warm water bath. This is a cherished Ugadi tradition — the oil bath purifies the body, improves circulation, and prepares you for the new year with renewed vigour. Apply kumkum on the forehead after the bath. Wear new clothes.',
        hi: 'सूर्योदय से पहले पूरे शरीर और सिर पर गर्म तिल का तेल लगाएँ। कम से कम 15 मिनट अच्छी तरह मालिश करें। फिर गर्म पानी से स्नान करें। यह उगादि की प्रिय परम्परा है — तेल स्नान शरीर को शुद्ध करता है, रक्त संचार बढ़ाता है, और नई ऊर्जा के साथ नए वर्ष के लिए तैयार करता है। स्नान के बाद माथे पर कुमकुम लगाएँ। नए कपड़े पहनें।',
        sa: 'सूर्योदयात् पूर्वं सम्पूर्णशरीरे शिरसि च उष्णतिलतैलं विलिम्पेत्। पञ्चदशनिमेषपर्यन्तं सम्यक् मर्दयेत्। ततः उष्णजलेन स्नायात्। इदम् उगादेः प्रिया परम्परा — तैलस्नानं शरीरं शोधयति रक्तसञ्चारं वर्धयति नवोत्साहेन नववर्षार्थं सज्जयति च। स्नानानन्तरं ललाटे कुङ्कुमं विलिम्पेत्। नववस्त्राणि धारयेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Mango Leaf Torana & Home Decoration', hi: 'आम के पत्तों का तोरण एवं गृह सज्जा', sa: 'आम्रपत्रतोरणं गृहसज्जा च' },
      description: {
        en: 'Tie fresh mango leaf torana (festoon) at the main entrance of the house. This is an essential Ugadi tradition symbolizing prosperity and new beginnings. Draw colourful rangoli (muggu/kolam) designs at the doorstep using rice flour and coloured powders. Clean the puja room and set up the altar with a fresh white cloth. Place the Panchanga (new year almanac) on the altar.',
        hi: 'घर के मुख्य द्वार पर ताज़े आम के पत्तों का तोरण बाँधें। यह उगादि की अनिवार्य परम्परा है जो समृद्धि और नई शुरुआत का प्रतीक है। चावल के आटे और रंगीन पाउडर से द्वार पर रंगोली (मुग्गु/कोलम) डिज़ाइन बनाएँ। पूजा कक्ष साफ कर ताज़े श्वेत कपड़े से वेदी सजाएँ। वेदी पर पञ्चाङ्ग (नववर्ष का पत्रा) रखें।',
        sa: 'गृहस्य प्रधानद्वारे आम्रपत्रतोरणं बध्नीयात्। इदम् उगादेः अनिवार्या परम्परा समृद्ध्या नवारम्भस्य च प्रतीकम्। तण्डुलचूर्णरञ्जकचूर्णैः द्वारे रङ्गवल्लीं (मुग्गु/कोलम्) रचयेत्। पूजागृहं शोधयित्वा नवश्वेतवस्त्रेण वेदिकां सज्जयेत्। वेदिकायां पञ्चाङ्गं स्थापयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Bevu-Bella Distribution (Six Flavours)', hi: 'बेवु-बेल्ला वितरण (छह रस)', sa: 'बेवु-बेल्ला वितरणम् (षड्रसाः)' },
      description: {
        en: 'Prepare the Ugadi Pachadi — a special dish containing six tastes (Shadrasa) that symbolize the six emotions of life. Mix neem flowers/leaves (bitter — sadness), jaggery (sweet — happiness), raw mango (sour — surprise), tamarind juice (tangy — disgust), green chilli/pepper (pungent — anger), and salt (salty — fear). Each family member eats a spoonful. This teaches that the new year will bring all experiences and one must accept them with equanimity. In Karnataka, this is called Bevu-Bella; in Andhra/Telangana, Ugadi Pachadi.',
        hi: 'उगादि पचड़ी तैयार करें — छह स्वादों (षड्रस) वाला विशेष व्यञ्जन जो जीवन की छह भावनाओं का प्रतीक है। नीम के फूल/पत्ते (कड़वा — दुःख), गुड़ (मीठा — सुख), कच्चा आम (खट्टा — आश्चर्य), इमली का रस (तीखा खट्टा — घृणा), हरी मिर्च/काली मिर्च (तीखा — क्रोध), और नमक (नमकीन — भय) मिलाएँ। प्रत्येक परिवार सदस्य एक चम्मच खाए। यह सिखाता है कि नया वर्ष सभी अनुभव लाएगा और उन्हें समभाव से स्वीकार करना चाहिए। कर्नाटक में इसे बेवु-बेल्ला, आन्ध्र/तेलंगाना में उगादि पचड़ी कहते हैं।',
        sa: 'उगादिपचडीं सज्जयेत् — षड्रसयुतं विशेषं व्यञ्जनं यत् जीवनस्य षड्भावानां प्रतीकम्। निम्बपुष्पाणि/पत्राणि (तिक्तम् — दुःखम्), गुडम् (मधुरम् — सुखम्), आमाम्रम् (आम्लम् — विस्मयः), चिञ्चारसम् (तीक्ष्णाम्लम् — जुगुप्सा), हरितमरीचम्/मरीचम् (कटुकम् — क्रोधः), लवणं (लवणम् — भयम्) च मिश्रयेत्। प्रत्येकः कुटुम्बसदस्यः चमसमेकं भक्षयेत्। इदं शिक्षयति नववर्षं सर्वानुभवान् आनेष्यति तान् समभावेन स्वीकुर्यात् इति।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Brahma-Vishnu Puja & Sankalpa', hi: 'ब्रह्मा-विष्णु पूजा एवं संकल्प', sa: 'ब्रह्मविष्णुपूजनं सङ्कल्पश्च' },
      description: {
        en: 'Light the ghee lamp and incense at the altar. Place images of Lord Brahma and Lord Vishnu. Offer flowers, akshat, kumkum, and fruits. Ugadi celebrates the day Brahma began creation — invoke His creative energy. Also worship Vishnu as the sustainer who carries the creation forward. Perform the sankalpa stating the new Samvatsara name, the date, and your prayer for the year. Chant the Vishnu Sahasranama or at least the Vishnu Gayatri.',
        hi: 'वेदी पर घी का दीपक और अगरबत्ती जलाएँ। भगवान ब्रह्मा और विष्णु के चित्र रखें। फूल, अक्षत, कुमकुम और फल अर्पित करें। उगादि उस दिन का उत्सव है जब ब्रह्मा ने सृष्टि आरम्भ की — उनकी सृजनात्मक शक्ति का आवाहन करें। विष्णु की भी सृष्टि को आगे ले जाने वाले पालनकर्ता के रूप में पूजा करें। नए संवत्सर का नाम, तिथि और वर्ष की प्रार्थना बोलकर संकल्प करें। विष्णु सहस्रनाम या कम से कम विष्णु गायत्री का पाठ करें।',
        sa: 'वेदिकायां घृतदीपं धूपं च प्रज्वालयेत्। ब्रह्मविष्ण्वोः चित्राणि स्थापयेत्। पुष्पाणि अक्षतान् कुङ्कुमं फलानि च समर्पयेत्। उगादिः ब्रह्मणा सृष्ट्यारम्भदिनस्य उत्सवः — तस्य सृजनशक्तिम् आवाहयेत्। विष्णुम् अपि सृष्टिपालयितारं पूजयेत्। नवसंवत्सरनाम तिथिं वर्षप्रार्थनां च वदन् सङ्कल्पं कुर्यात्। विष्णुसहस्रनाम अथवा न्यूनातिन्यूनं विष्णुगायत्रीं पठेत्।',
      },
      mantraRef: 'vishnu-gayatri-ugadi',
      duration: '25 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Panchanga Sravanam (Almanac Reading)', hi: 'पञ्चाङ्ग श्रवणम् (पत्रा पठन)', sa: 'पञ्चाङ्गश्रवणम्' },
      description: {
        en: 'This is the most distinctive ritual of Ugadi. A priest or the eldest family member reads aloud the new year\'s Panchanga (almanac), announcing the new Samvatsara\'s name, the tithi, nakshatra, yoga, and karana for the day, and the year\'s predictions for rain, harvest, political affairs, and prosperity. The whole family listens attentively. In temples, this is done as a grand ceremony with hundreds attending. The reading foretells what the new year holds based on the ruling planets and nakshatras.',
        hi: 'यह उगादि का सबसे विशिष्ट अनुष्ठान है। पुरोहित या परिवार के सबसे बड़े सदस्य नए वर्ष का पञ्चाङ्ग जोर से पढ़ते हैं — नए संवत्सर का नाम, उस दिन की तिथि, नक्षत्र, योग, करण, और वर्ष भर की वर्षा, फसल, राजनीतिक मामलों और समृद्धि की भविष्यवाणी। पूरा परिवार ध्यानपूर्वक सुनता है। मन्दिरों में यह सैकड़ों लोगों की उपस्थिति में भव्य समारोह होता है। पठन शासक ग्रहों और नक्षत्रों के आधार पर नए वर्ष का पूर्वानुमान बताता है।',
        sa: 'इदम् उगादेः विशिष्टतमम् अनुष्ठानम्। पुरोहितः कुटुम्बस्य ज्येष्ठसदस्यो वा नववर्षस्य पञ्चाङ्गम् उच्चैः पठति — नवसंवत्सरनाम तद्दिनस्य तिथिं नक्षत्रं योगं करणं च वर्षस्य वृष्टिसस्यराजनीतिसमृद्धिभविष्यवाणीं च। सर्वं कुटुम्बम् अवधानेन शृणोति। मन्दिरेषु इदं शतशः जनानां सान्निध्ये भव्यसमारोहेन क्रियते। पठनं शासकग्रहनक्षत्राणाम् आधारेण नववर्षस्य पूर्वानुमानं कथयति।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 6,
      title: { en: 'Naivedya & Aarti', hi: 'नैवेद्य एवं आरती', sa: 'नैवेद्यम् आरात्रिकं च' },
      description: {
        en: 'Offer the prepared Ugadi special dishes as naivedya: Pulihora (tamarind rice), Bobbatlu/Obbattu (sweet stuffed flatbread), Ugadi Pachadi, and coconut rice. Light camphor and perform aarti. Ring the bell while circling the flame before the deities. All family members take part in the aarti. After aarti, distribute the prasad to everyone.',
        hi: 'तैयार किए गए उगादि विशेष व्यञ्जन नैवेद्य के रूप में अर्पित करें: पुलिहोरा (इमली चावल), बोब्बट्टू/ओब्बट्टू (मीठी भरवाँ रोटी), उगादि पचड़ी और नारियल चावल। कपूर जलाकर आरती करें। देवताओं के सामने ज्योत घुमाते हुए घण्टी बजाएँ। सभी परिवारजन आरती में भाग लें। आरती के बाद सभी को प्रसाद वितरित करें।',
        sa: 'सज्जितानि उगादिविशेषव्यञ्जनानि नैवेद्यरूपेण निवेदयेत्: पुलिहोरा (चिञ्चातण्डुलम्), बोब्बट्टु/ओब्बट्टु (मधुरपूरितरोटिका), उगादिपचडी, नारिकेलतण्डुलं च। कर्पूरं प्रज्वाल्य आरात्रिकं कुर्यात्। देवतानां पुरतः ज्वालां परिवर्तयन् घण्टां वादयेत्। सर्वे कुटुम्बिनः आरात्रिके भागं गृह्णीयुः। आरात्रिकानन्तरं सर्वेभ्यः प्रसादं वितरेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 7,
      title: { en: 'Festive Feast & Family Celebration', hi: 'उत्सव भोज एवं पारिवारिक जश्न', sa: 'उत्सवभोजनं कुटुम्बोत्सवश्च' },
      description: {
        en: 'The grand Ugadi feast is served on banana leaves. The traditional meal includes Pulihora, Bobbatlu/Holige, Ugadi Pachadi, Payasam, rice with sambar and rasam, curd rice, and various chutneys and pickles. The meal must include all six tastes. Visit elders to seek their blessings. Exchange new year greetings — "Ugadi Subhakankshalu" (Telugu) or "Yugadi Habbada Shubhashayagalu" (Kannada). In the evening, cultural programmes and Harikatha recitals are held at temples.',
        hi: 'भव्य उगादि भोज केले के पत्तों पर परोसा जाता है। पारम्परिक भोजन में पुलिहोरा, बोब्बट्टू/होलिगे, उगादि पचड़ी, पायसम, साम्बर और रसम के साथ चावल, दही चावल, और विभिन्न चटनियाँ और अचार शामिल हैं। भोजन में सभी छह स्वाद होने चाहिए। बड़ों के दर्शन कर आशीर्वाद लें। नववर्ष की शुभकामनाएँ दें — "उगादि शुभाकांक्षलु" (तेलुगु) या "युगादि हब्बद शुभाशयगळु" (कन्नड)। शाम को मन्दिरों में सांस्कृतिक कार्यक्रम और हरिकथा का आयोजन होता है।',
        sa: 'भव्यम् उगादिभोजनं कदलीपत्रेषु परिवेष्यते। पारम्परिकभोजने पुलिहोरा, बोब्बट्टु/होलिगे, उगादिपचडी, पायसम्, साम्बररसमसहिततण्डुलं, दधितण्डुलम्, विविधचट्नीआचारश्च अन्तर्भवन्ति। भोजने षड्रसाः भवेयुः। ज्येष्ठान् दर्शयित्वा आशीर्वादं गृह्णीयात्। नववर्षशुभकामनाः वदेत्। सायं मन्दिरेषु सांस्कृतिककार्यक्रमाः हरिकथाश्च आयोज्यन्ते।',
      },
      duration: '90 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'vishnu-gayatri-ugadi',
      name: { en: 'Vishnu Gayatri Mantra', hi: 'विष्णु गायत्री मन्त्र', sa: 'विष्णुगायत्रीमन्त्रः' },
      devanagari: 'ॐ नारायणाय विद्महे वासुदेवाय धीमहि तन्नो विष्णुः प्रचोदयात्',
      iast: 'oṃ nārāyaṇāya vidmahe vāsudevāya dhīmahi tanno viṣṇuḥ pracodayāt',
      meaning: {
        en: 'We meditate upon Narayana, we contemplate Vasudeva. May that Vishnu inspire and guide us in the new year.',
        hi: 'हम नारायण का ध्यान करते हैं, वासुदेव का चिन्तन करते हैं। वह विष्णु नए वर्ष में हमें प्रेरित और मार्गदर्शित करे।',
        sa: 'नारायणं विद्मः। वासुदेवं धीमहि। विष्णुः नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the Ugadi puja for Vishnu\'s blessings for the new year',
        hi: 'नए वर्ष में विष्णु के आशीर्वाद के लिए उगादि पूजा के दौरान 108 बार जपें',
        sa: 'नववर्षे विष्ण्वाशीर्वादार्थम् उगादिपूजायाम् अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'brahma-ugadi',
      name: { en: 'Brahma Mantra (for creation)', hi: 'ब्रह्मा मन्त्र (सृष्टि हेतु)', sa: 'ब्रह्ममन्त्रः (सृष्ट्यर्थम्)' },
      devanagari: 'ॐ चतुर्मुखाय विद्महे हंसारूढाय धीमहि तन्नो ब्रह्मा प्रचोदयात्',
      iast: 'oṃ caturmukhāya vidmahe haṃsārūḍhāya dhīmahi tanno brahmā pracodayāt',
      meaning: {
        en: 'We meditate upon the Four-Faced One, we contemplate the One seated on the Swan. May Brahma inspire and guide our creative endeavours.',
        hi: 'हम चतुर्मुख का ध्यान करते हैं, हंस पर आसीन का चिन्तन करते हैं। ब्रह्मा हमारे सृजनात्मक प्रयासों को प्रेरित और मार्गदर्शित करे।',
        sa: 'चतुर्मुखं विद्मः। हंसारूढं धीमहि। ब्रह्मा नः प्रचोदयात्।',
      },
      japaCount: 11,
      usage: {
        en: 'Chant during Ugadi puja while invoking Brahma\'s creative energy for the new year',
        hi: 'नए वर्ष में ब्रह्मा की सृजनात्मक शक्ति का आवाहन करते हुए उगादि पूजा में जपें',
        sa: 'नववर्षे ब्रह्मणः सृजनशक्तिम् आवाहयन् उगादिपूजायां जपेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Vishnu Sahasranama (selected)', hi: 'विष्णु सहस्रनाम (चयनित)', sa: 'विष्णुसहस्रनाम (चयनितम्)' },
      verseCount: 108,
      duration: '25 min',
      note: {
        en: 'The thousand names of Lord Vishnu. Reciting on Ugadi brings protection and prosperity for the entire year.',
        hi: 'भगवान विष्णु के सहस्र नाम। उगादि पर पाठ पूरे वर्ष सुरक्षा और समृद्धि लाता है।',
        sa: 'भगवतो विष्णोः सहस्रनामानि। उगादौ पाठः सम्पूर्णवर्षं रक्षां समृद्धिं च आनयति।',
      },
    },
  ],

  naivedya: {
    en: 'Ugadi Pachadi (six-flavour mix), Pulihora (tamarind rice), Bobbatlu/Obbattu (sweet stuffed flatbread with chana dal and jaggery filling), coconut rice, curd rice, Payasam (kheer), laddu, and seasonal fruits — mango, banana, coconut.',
    hi: 'उगादि पचड़ी (छह रसों का मिश्रण), पुलिहोरा (इमली चावल), बोब्बट्टू/ओब्बट्टू (चने की दाल और गुड़ भरी मीठी रोटी), नारियल चावल, दही चावल, पायसम (खीर), लड्डू, और मौसमी फल — आम, केला, नारियल।',
    sa: 'उगादिपचडी (षड्रसमिश्रणम्), पुलिहोरा (चिञ्चातण्डुलम्), बोब्बट्टु/ओब्बट्टु (चणकदालगुडपूरितमधुररोटिका), नारिकेलतण्डुलम्, दधितण्डुलम्, पायसम् (क्षीरान्नम्), मोदकानि, ऋतुफलानि — आम्रं कदलीफलं नारिकेलं च।',
  },

  precautions: [
    {
      en: 'Do not skip the Bevu-Bella / Ugadi Pachadi — tasting all six flavours on Ugadi morning is essential. It teaches philosophical acceptance of all life experiences.',
      hi: 'बेवु-बेल्ला / उगादि पचड़ी न छोड़ें — उगादि प्रातः छह स्वादों का सेवन आवश्यक है। यह जीवन के सभी अनुभवों की दार्शनिक स्वीकृति सिखाता है।',
      sa: 'बेवु-बेल्ला / उगादिपचडीं न त्यजेत् — उगादिप्रातः षड्रसानां सेवनम् अनिवार्यम्। इदं जीवनस्य सर्वानुभवानां दार्शनिकस्वीकृतिं शिक्षयति।',
    },
    {
      en: 'The Panchanga Sravanam must be heard on Ugadi day itself — it is considered inauspicious to miss the new year\'s almanac reading.',
      hi: 'पञ्चाङ्ग श्रवणम् उगादि के दिन ही सुनना चाहिए — नववर्ष के पत्रा पठन को छोड़ना अशुभ माना जाता है।',
      sa: 'पञ्चाङ्गश्रवणम् उगादिदिने एव श्रोतव्यम् — नववर्षस्य पञ्चाङ्गपठनस्य लोपः अशुभः मन्यते।',
    },
    {
      en: 'Avoid non-vegetarian food and alcohol on this sacred new year day. Maintain purity of body, speech, and mind.',
      hi: 'इस पवित्र नववर्ष दिवस पर माँसाहार और मद्यपान से बचें। शरीर, वाणी और मन की शुद्धता बनाए रखें।',
      sa: 'अस्मिन् पवित्रनववर्षदिने मांसं मद्यं च वर्जयेत्। शरीरवाणीमनसां शुद्धिं पालयेत्।',
    },
    {
      en: 'Begin the day with positive thoughts and avoid quarrels — the energy of the new year\'s first day sets the tone for the entire year.',
      hi: 'दिन की शुरुआत सकारात्मक विचारों से करें और झगड़ों से बचें — नववर्ष के पहले दिन की ऊर्जा पूरे वर्ष का स्वर निर्धारित करती है।',
      sa: 'शुभविचारैः दिनम् आरभेत् कलहं च वर्जयेत् — नववर्षस्य प्रथमदिनस्य ऊर्जा सम्पूर्णवर्षस्य स्वरं निर्धारयति।',
    },
  ],

  phala: {
    en: 'Blessings of Lord Brahma for creative energy and new beginnings. Blessings of Lord Vishnu for protection and sustenance throughout the year. Equanimity in facing life\'s joys and sorrows (as taught by the Bevu-Bella). Knowledge of the year\'s celestial influences through Panchanga Sravanam. Prosperity, good health, and harmonious family life.',
    hi: 'सृजनात्मक ऊर्जा और नई शुरुआत के लिए ब्रह्मा जी का आशीर्वाद। पूरे वर्ष सुरक्षा और पालन-पोषण के लिए विष्णु भगवान का आशीर्वाद। जीवन के सुख-दुःख को समभाव से सहना (बेवु-बेल्ला की शिक्षा)। पञ्चाङ्ग श्रवणम् से वर्ष के ग्रह प्रभावों का ज्ञान। समृद्धि, अच्छा स्वास्थ्य और सामंजस्यपूर्ण पारिवारिक जीवन।',
    sa: 'सृजनशक्त्यर्थं नवारम्भार्थं च ब्रह्मणः आशीर्वादः। सम्पूर्णवर्षं रक्षापालनार्थं विष्णोः आशीर्वादः। जीवनस्य सुखदुःखयोः समत्वम् (बेवु-बेल्लायाः शिक्षा)। पञ्चाङ्गश्रवणेन वर्षस्य ग्रहप्रभावानां ज्ञानम्। समृद्धिः स्वास्थ्यं सामञ्जस्यपूर्णकुटुम्बजीवनं च।',
  },
};

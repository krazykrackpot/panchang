import type { PujaVidhi } from './types';

export const SATYANARAYAN_PUJA: PujaVidhi = {
  festivalSlug: 'satyanarayan',
  category: 'vrat',
  deity: { en: 'Lord Vishnu (as Satyanarayan)', hi: 'भगवान विष्णु (सत्यनारायण रूप)', sa: 'श्रीविष्णुः (सत्यनारायणरूपेण)' },

  samagri: [
    { name: { en: 'Banana leaves (for altar setup)', hi: 'केले के पत्ते (वेदी सज्जा के लिए)', sa: 'कदलीपत्राणि (वेदिसज्जायै)' }, quantity: '5-7', category: 'other', essential: true },
    { name: { en: 'Panchamrit (milk, curd, ghee, honey, sugar)', hi: 'पंचामृत (दूध, दही, घी, शहद, शक्कर)', sa: 'पञ्चामृतम् (क्षीरं, दधि, घृतं, मधु, शर्करा)' }, category: 'food', essential: true },
    { name: { en: 'Suji/Sooji (semolina for sheera prasad)', hi: 'सूजी (शीरा प्रसाद के लिए)', sa: 'गोधूमसूक्ष्मचूर्णम् (शीरानैवेद्यार्थम्)' }, quantity: '500g', note: { en: 'For making sheera — the essential Satyanarayan prasad', hi: 'शीरा बनाने के लिए — सत्यनारायण का अनिवार्य प्रसाद', sa: 'शीरानिर्माणार्थम् — सत्यनारायणस्य अनिवार्यं नैवेद्यम्' }, category: 'food', essential: true },
    { name: { en: 'Tulsi leaves', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, category: 'flowers', essential: true },
    { name: { en: 'Fruits (banana, apple, pomegranate, coconut)', hi: 'फल (केला, सेब, अनार, नारियल)', sa: 'फलानि (कदलीफलम्, सेवफलम्, दाडिमम्, नारिकेलम्)' }, category: 'food', essential: true },
    { name: { en: 'Singhada (water chestnut flour/fruit)', hi: 'सिंघाड़ा (आटा/फल)', sa: 'श्रृङ्गाटकम्' }, category: 'food', essential: false },
    { name: { en: 'Coins (for offering)', hi: 'सिक्के (अर्पण के लिए)', sa: 'मुद्राः (अर्पणार्थम्)' }, quantity: '5-11', category: 'other', essential: false },
    { name: { en: 'Flowers (yellow marigold preferred)', hi: 'फूल (पीले गेंदे के फूल)', sa: 'पुष्पाणि (पीतस्थालपद्मानि श्रेष्ठानि)' }, category: 'flowers', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Red thread (mauli/kalava)', hi: 'लाल धागा (मौली/कलावा)', sa: 'रक्तसूत्रम् (मौलिः)' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum & turmeric', hi: 'कुमकुम एवं हल्दी', sa: 'कुङ्कुमं हरिद्रा च' }, category: 'puja_items', essential: true },
    { name: { en: 'Supari (betel nut) and paan leaves', hi: 'सुपारी और पान के पत्ते', sa: 'पूगीफलं ताम्बूलपत्राणि च' }, quantity: '5', category: 'puja_items', essential: false },
    { name: { en: 'Satyanarayan Katha book', hi: 'सत्यनारायण कथा पुस्तक', sa: 'सत्यनारायणकथापुस्तकम्' }, category: 'other', essential: true },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Satyanarayan Puja is typically performed on Purnima (full moon day) evening, but can be done on any auspicious occasion — house warming, new job, after recovery from illness, fulfillment of a wish, or any Shukla Paksha day. Evening (after 4 PM) is the preferred time.',
    hi: 'सत्यनारायण पूजा सामान्यतः पूर्णिमा (पूर्ण चन्द्र) की शाम को की जाती है, किन्तु किसी भी शुभ अवसर पर — गृह प्रवेश, नई नौकरी, रोग मुक्ति के बाद, मनोकामना पूर्ति, या किसी भी शुक्ल पक्ष के दिन — की जा सकती है। सायं (4 बजे के बाद) उत्तम समय है।',
    sa: 'सत्यनारायणपूजा प्रायः पूर्णिमायां सायं क्रियते, किन्तु कस्मिन्नपि शुभावसरे — गृहप्रवेशे, नवकर्मणि, रोगमुक्त्यनन्तरं, मनोरथसिद्धौ, शुक्लपक्षस्य कस्मिन्नपि दिने — कर्तुं शक्या। सायंकालः (चतुर्वादनानन्तरम्) उत्तमः।',
  },
  muhurtaWindow: { type: 'aparahna' },

  sankalpa: {
    en: 'On this auspicious day, I undertake the Satyanarayan Puja and Katha recitation with devotion, for the well-being, prosperity, and happiness of my family, and for the fulfillment of all righteous wishes.',
    hi: 'इस शुभ दिन पर, अपने परिवार की कुशलता, समृद्धि और सुख के लिए, तथा सभी धार्मिक मनोकामनाओं की पूर्ति के लिए, मैं भक्तिपूर्वक सत्यनारायण पूजा एवं कथा पाठ का संकल्प करता/करती हूँ।',
    sa: 'अस्मिन् शुभदिने स्वपरिवारस्य कुशलतासमृद्धिसुखार्थं सर्वधर्ममनोरथपूर्त्यर्थं च भक्त्या सत्यनारायणपूजनं कथापाठं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Altar Setup on Banana Leaves', hi: 'केले के पत्तों पर वेदी सज्जा', sa: 'कदलीपत्रेषु वेदिसज्जा' },
      description: {
        en: 'Spread banana leaves on a clean chowki (platform). Place a kalash (water vessel) with mango leaves and coconut on top. Place the Satyanarayan image/idol on the banana leaves. Arrange fruits, coins, akshat, flowers, and paan-supari around the deity. Tie red thread (mauli) on the kalash.',
        hi: 'स्वच्छ चौकी पर केले के पत्ते बिछाएँ। आम के पत्तों और नारियल सहित कलश स्थापित करें। केले के पत्तों पर सत्यनारायण की मूर्ति/चित्र रखें। देवता के चारों ओर फल, सिक्के, अक्षत, फूल और पान-सुपारी सजाएँ। कलश पर लाल धागा (मौली) बाँधें।',
        sa: 'शुचिवेदिकायां कदलीपत्राणि विस्तारयेत्। आम्रपत्रनारिकेलसहितं कलशं स्थापयेत्। कदलीपत्रेषु सत्यनारायणमूर्तिं स्थापयेत्। देवतां परितः फलानि मुद्राः अक्षतान् पुष्पाणि ताम्बूलपूगीफलानि च सज्जयेत्। कलशे रक्तसूत्रं बध्नीयात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Invocation of Satyanarayan', hi: 'सत्यनारायण का आवाहन', sa: 'सत्यनारायणस्य आवाहनम्' },
      description: {
        en: 'Perform achamana and sankalpa. Invoke Lord Satyanarayan by offering akshat, flowers, kumkum, and Tulsi. Chant "Om Namo Bhagavate Vasudevaya" 12 times. Offer panchamrit abhishek to the idol, followed by clean water. Dress with yellow cloth and sandalwood.',
        hi: 'आचमन और संकल्प करें। अक्षत, फूल, कुमकुम और तुलसी अर्पित करके सत्यनारायण का आवाहन करें। "ॐ नमो भगवते वासुदेवाय" 12 बार जपें। मूर्ति पर पंचामृत अभिषेक करें, फिर स्वच्छ जल से। पीले वस्त्र और चन्दन से सजाएँ।',
        sa: 'आचमनं सङ्कल्पं च कुर्यात्। अक्षतपुष्पकुङ्कुमतुलसीभिः सत्यनारायणम् आवाहयेत्। "ॐ नमो भगवते वासुदेवाय" इति द्वादशवारं जपेत्। मूर्तौ पञ्चामृताभिषेकं कुर्यात्, ततः शुद्धजलेन। पीतवस्त्रचन्दनाभ्यां सज्जयेत्।',
      },
      mantraRef: 'vasudeva-mantra',
      duration: '15 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Katha — Chapter 1: The Merchant\'s Story', hi: 'कथा — अध्याय 1: व्यापारी की कथा', sa: 'कथा — प्रथमोऽध्यायः: वणिक्कथा' },
      description: {
        en: 'Read Chapter 1 of the Satyanarayan Katha. A poor Brahmin receives the Satyanarayan vrat vidhi from Lord Vishnu himself. A woodcutter hears about it and performs the puja — his poverty is destroyed and he gains wealth. This chapter establishes that Satyanarayan puja is accessible to all, regardless of caste or status.',
        hi: 'सत्यनारायण कथा का अध्याय 1 पढ़ें। एक गरीब ब्राह्मण को स्वयं भगवान विष्णु से सत्यनारायण व्रत विधि प्राप्त होती है। एक लकड़हारा इसके बारे में सुनकर पूजा करता है — उसकी दरिद्रता नष्ट होती है और धन प्राप्त होता है। यह अध्याय स्थापित करता है कि सत्यनारायण पूजा जाति या स्थिति की परवाह किए बिना सभी के लिए सुलभ है।',
        sa: 'सत्यनारायणकथायाः प्रथमोऽध्यायं पठेत्। दरिद्रब्राह्मणः स्वयं विष्णोः सत्यनारायणव्रतविधिं प्राप्नोति। काष्ठच्छेदकः श्रुत्वा पूजां करोति — तस्य दारिद्र्यं विनश्यति धनं च प्राप्नोति। अयम् अध्यायः स्थापयति सत्यनारायणपूजा सर्वेभ्यः सुलभा जातिस्थित्यनपेक्षया।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 4,
      title: { en: 'Aarti after Chapter 1', hi: 'अध्याय 1 के बाद आरती', sa: 'प्रथमाध्यायानन्तरम् आरात्रिकम्' },
      description: {
        en: 'Perform a brief aarti with the ghee lamp after reading Chapter 1. Wave the lamp before the deity and offer flowers. All present should join in.',
        hi: 'अध्याय 1 पढ़ने के बाद घी के दीपक से संक्षिप्त आरती करें। देवता के सामने दीपक घुमाएँ और फूल अर्पित करें। सभी उपस्थित लोग सम्मिलित हों।',
        sa: 'प्रथमाध्यायपठनानन्तरं घृतदीपेन संक्षिप्तम् आरात्रिकं कुर्यात्। देवतायाः पुरतः दीपं भ्रामयेत् पुष्पाणि अर्पयेत् च। सर्वे उपस्थिताः सम्मिलेयुः।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Katha — Chapter 2: The Woodcutter\'s Prosperity', hi: 'कथा — अध्याय 2: लकड़हारे की समृद्धि', sa: 'कथा — द्वितीयोऽध्यायः: काष्ठच्छेदकसमृद्धिः' },
      description: {
        en: 'Read Chapter 2. A devout merchant named Sadhu performs the Satyanarayan puja regularly and prospers. A king named Ulkamukh and his minister Shatananda encounter the merchant during the puja and join in — they too receive prosperity and children. This chapter shows the contagious nature of Satyanarayan\'s grace.',
        hi: 'अध्याय 2 पढ़ें। साधु नामक एक धार्मिक व्यापारी नियमित रूप से सत्यनारायण पूजा करता है और समृद्ध होता है। उल्कामुख नामक राजा और उसके मन्त्री शतानन्द पूजा के दौरान व्यापारी से मिलते हैं और सम्मिलित होते हैं — उन्हें भी समृद्धि और सन्तान की प्राप्ति होती है। यह अध्याय सत्यनारायण की कृपा के संक्रामक स्वभाव को दर्शाता है।',
        sa: 'द्वितीयोऽध्यायं पठेत्। साधुनामा धार्मिकवणिक् नित्यं सत्यनारायणपूजां करोति समृद्धश्च भवति। उल्कामुखनामा राजा तस्य मन्त्री शतानन्दश्च पूजाकाले वणिजं मिलित्वा सम्मिलन्ति — तौ अपि समृद्धिं सन्तानं च प्राप्नुतः। अयम् अध्यायः सत्यनारायणकृपायाः सङ्क्रामकस्वभावं दर्शयति।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 6,
      title: { en: 'Aarti after Chapter 2 & Katha Chapter 3: The King\'s Test', hi: 'अध्याय 2 के बाद आरती एवं कथा अध्याय 3: राजा की परीक्षा', sa: 'द्वितीयाध्यायानन्तरम् आरात्रिकं तृतीयोऽध्यायश्च: राज्ञः परीक्षा' },
      description: {
        en: 'Perform brief aarti after Chapter 2, then read Chapter 3. King Ulkamukh, upon returning from a hunting trip, forgets his promise to perform the puja and neglects the prasad. As a result, he loses all his wealth and is imprisoned. He remembers his vow, performs the puja in prison, and is restored. This chapter warns against neglecting vows made to Satyanarayan.',
        hi: 'अध्याय 2 के बाद संक्षिप्त आरती करें, फिर अध्याय 3 पढ़ें। राजा उल्कामुख शिकार यात्रा से लौटकर पूजा के संकल्प को भूल जाता है और प्रसाद की उपेक्षा करता है। परिणामस्वरूप वह अपना सारा धन खो देता है और कारागार में डाल दिया जाता है। वह अपने संकल्प को याद करता है, कारागार में पूजा करता है, और पुनर्स्थापित होता है। यह अध्याय सत्यनारायण को किए गए संकल्पों की उपेक्षा के विरुद्ध चेतावनी देता है।',
        sa: 'द्वितीयाध्यायानन्तरम् आरात्रिकं कुर्यात्, ततः तृतीयोऽध्यायं पठेत्। राजा उल्कामुखः मृगयातः प्रत्यागत्य पूजासङ्कल्पं विस्मरति प्रसादम् उपेक्षते। तत्फलेन सर्वं धनं नश्यति कारागारे च क्षिप्यते। सङ्कल्पं स्मरति, कारागारे पूजां करोति, पुनःस्थाप्यते। अयम् अध्यायः सत्यनारायणाय कृतसङ्कल्पोपेक्षां प्रति चेतयति।',
      },
      duration: '12 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 7,
      title: { en: 'Aarti after Chapter 3 & Katha Chapter 4: The Merchant\'s Wife', hi: 'अध्याय 3 के बाद आरती एवं कथा अध्याय 4: व्यापारी की पत्नी', sa: 'तृतीयाध्यायानन्तरम् आरात्रिकं चतुर्थोऽध्यायश्च: वणिक्पत्नी' },
      description: {
        en: 'Perform brief aarti after Chapter 3, then read Chapter 4. The merchant Sadhu\'s wife Lilavati sends their daughter Kalavati to receive her returning father at the harbor. But Kalavati, in her haste, neglects to eat the Satyanarayan prasad. As punishment, her husband\'s ship sinks and he is imprisoned. She realizes her mistake, performs the puja properly, and all is restored. This chapter emphasizes that prasad must NEVER be refused.',
        hi: 'अध्याय 3 के बाद संक्षिप्त आरती करें, फिर अध्याय 4 पढ़ें। व्यापारी साधु की पत्नी लीलावती अपनी बेटी कलावती को बन्दरगाह पर लौटते पिता को लेने भेजती है। किन्तु कलावती जल्दबाजी में सत्यनारायण प्रसाद खाना भूल जाती है। दण्ड स्वरूप उसके पति का जहाज डूब जाता है और उसे कारागार में डाल दिया जाता है। वह अपनी गलती समझती है, विधिपूर्वक पूजा करती है, और सब ठीक हो जाता है। यह अध्याय बताता है कि प्रसाद कभी अस्वीकार नहीं करना चाहिए।',
        sa: 'तृतीयाध्यायानन्तरम् आरात्रिकं कुर्यात्, ततः चतुर्थोऽध्यायं पठेत्। वणिक्साधोः पत्नी लीलावती स्वपुत्रीं कलावतीं पत्तनं प्रत्यागच्छन्तं पितरं प्रत्युद्गन्तुं प्रेषयति। किन्तु कलावती त्वरया सत्यनारायणप्रसादं भक्षितुं विस्मरति। दण्डरूपेण तस्याः पत्युः नौः निमज्जति सः कारागारे क्षिप्यते। सा स्वदोषं जानाति, विधिपूर्वकं पूजां करोति, सर्वं पुनःस्थाप्यते। अयम् अध्यायः शिक्षयति प्रसादम् कदापि न अस्वीकरणीयम्।',
      },
      duration: '12 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 8,
      title: { en: 'Aarti after Chapter 4 & Katha Chapter 5: Conclusion', hi: 'अध्याय 4 के बाद आरती एवं कथा अध्याय 5: उपसंहार', sa: 'चतुर्थाध्यायानन्तरम् आरात्रिकं पञ्चमोऽध्यायश्च: उपसंहारः' },
      description: {
        en: 'Perform brief aarti after Chapter 4, then read Chapter 5 — the conclusion. Suta Muni summarizes the glory of Satyanarayan vrat: whoever hears or performs this katha with devotion attains all desires, is freed from sorrow, and gains lasting prosperity. The critical warning is repeated — the prasad must be consumed by ALL present; refusing it brings misfortune.',
        hi: 'अध्याय 4 के बाद संक्षिप्त आरती करें, फिर अध्याय 5 — उपसंहार पढ़ें। सूत मुनि सत्यनारायण व्रत की महिमा का सार प्रस्तुत करते हैं: जो कोई भक्तिपूर्वक यह कथा सुनता या करता है, वह सभी मनोकामनाएँ प्राप्त करता है, दुखों से मुक्त होता है, और स्थायी समृद्धि पाता है। महत्वपूर्ण चेतावनी दोहराई जाती है — प्रसाद सभी उपस्थित लोगों को खाना चाहिए; इसे अस्वीकार करने से दुर्भाग्य आता है।',
        sa: 'चतुर्थाध्यायानन्तरम् आरात्रिकं कुर्यात्, ततः पञ्चमोऽध्यायम् — उपसंहारं पठेत्। सूतमुनिः सत्यनारायणव्रतमाहात्म्यं सारयति: यः कश्चित् भक्त्या इमां कथां शृणोति करोति वा सः सर्वान् मनोरथान् प्राप्नोति दुःखात् मुच्यते स्थिरसमृद्धिं च लभते। महत्त्वपूर्णा चेतावनी पुनरुच्यते — प्रसादं सर्वैः उपस्थितैः भक्षितव्यम्; तस्य अस्वीकारे दुर्भाग्यम् आगच्छति।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 9,
      title: { en: 'Final Aarti & Sheera Prasad Distribution', hi: 'अन्तिम आरती एवं शीरा प्रसाद वितरण', sa: 'अन्तिमम् आरात्रिकं शीराप्रसादवितरणं च' },
      description: {
        en: 'Perform the final grand aarti singing "Om Jai Lakshmi Ramana". Offer the sheera (semolina halwa prepared with ghee, sugar, and dry fruits) as naivedya. After offering, distribute sheera prasad to EVERY person present — this is the most critical part of the entire puja. No one should leave without eating prasad. Untie the red thread from the kalash and tie it on the wrists of all family members.',
        hi: '"ॐ जय लक्ष्मी रमणा" गाते हुए अन्तिम भव्य आरती करें। शीरा (घी, चीनी और मेवों से बना सूजी का हलवा) नैवेद्य के रूप में अर्पित करें। अर्पण के बाद शीरा प्रसाद प्रत्येक उपस्थित व्यक्ति को बाँटें — यह पूरी पूजा का सबसे महत्वपूर्ण भाग है। कोई भी प्रसाद खाए बिना न जाए। कलश से लाल धागा खोलकर सभी परिवारजनों की कलाई पर बाँधें।',
        sa: '"ॐ जय लक्ष्मी रमणा" इति गायन् अन्तिमं भव्यम् आरात्रिकं कुर्यात्। शीरां (घृतशर्कराशुष्कफलैः निर्मितं गोधूमसूक्ष्मचूर्णपाकम्) नैवेद्यरूपेण अर्पयेत्। अर्पणानन्तरं शीराप्रसादं प्रत्येकम् उपस्थितं जनं वितरेत् — एतत् सम्पूर्णपूजायाः सर्वमहत्त्वपूर्णम् अंशम्। कोऽपि प्रसादम् अभक्षयित्वा न गच्छेत्। कलशात् रक्तसूत्रं विमुच्य सर्वपरिजनानां मणिबन्धे बध्नीयात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'vasudeva-mantra',
      name: { en: 'Vishnu Dvadashakshari Mantra', hi: 'विष्णु द्वादशाक्षरी मन्त्र', sa: 'विष्णुद्वादशाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वासुदेवाय',
      iast: 'oṃ namo bhagavate vāsudevāya',
      meaning: {
        en: 'Om, I bow to Lord Vasudeva (Krishna/Vishnu), the Supreme Being.',
        hi: 'ॐ, सर्वोच्च भगवान वासुदेव (कृष्ण/विष्णु) को मेरा नमन।',
        sa: 'ॐ, भगवते वासुदेवाय (कृष्णाय/विष्णवे) परमात्मने नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Primary mantra for Satyanarayan Puja. Chant 108 times during the invocation. Also chanted between katha chapters.',
        hi: 'सत्यनारायण पूजा का प्रमुख मन्त्र। आवाहन के दौरान 108 बार जपें। कथा अध्यायों के बीच भी जपा जाता है।',
        sa: 'सत्यनारायणपूजायाः प्रधानमन्त्रः। आवाहनकाले १०८ वारं जपेत्। कथाध्यायान्तरे अपि जप्यते।',
      },
    },
    {
      id: 'satyanarayan-stuti',
      name: { en: 'Satyanarayan Stuti (Prayer)', hi: 'सत्यनारायण स्तुति', sa: 'सत्यनारायणस्तुतिः' },
      devanagari: 'सत्यनारायणं देवं वन्दे सत्यपराक्रमम्। सत्यं सत्यस्वरूपं च सत्यमेव सदा भजे॥',
      iast: 'satyanārāyaṇaṃ devaṃ vande satyaparākramam | satyaṃ satyasvarūpaṃ ca satyameva sadā bhaje ||',
      meaning: {
        en: 'I worship Lord Satyanarayan, the god of truth and valor. He is truth itself, his form is truth — I forever worship that truth.',
        hi: 'मैं सत्यनारायण भगवान की वन्दना करता हूँ जो सत्य और पराक्रम के देव हैं। वे सत्यस्वरूप हैं — मैं सदा उस सत्य की पूजा करता हूँ।',
        sa: 'सत्यपराक्रमं सत्यनारायणदेवं वन्दे। सत्यं सत्यस्वरूपं सत्यमेव सदा भजे।',
      },
      usage: {
        en: 'Recite at the beginning and end of each katha chapter. This stuti encapsulates the essence of Satyanarayan — the lord of truth.',
        hi: 'प्रत्येक कथा अध्याय के आरम्भ और अन्त में पढ़ें। यह स्तुति सत्यनारायण — सत्य के स्वामी — के सार को समाहित करती है।',
        sa: 'प्रत्येकस्य कथाध्यायस्य आरम्भे अन्ते च पठेत्। इयं स्तुतिः सत्यनारायणस्य — सत्यस्वामिनः — सारं समाहरति।',
      },
    },
    {
      id: 'vishnu-panjara-stotra',
      name: { en: 'Vishnu Dhyana Shloka', hi: 'विष्णु ध्यान श्लोक', sa: 'विष्णुध्यानश्लोकः' },
      devanagari: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम्। विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्। लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यम्। वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥',
      iast: 'śāntākāraṃ bhujagaśayanaṃ padmanābhaṃ sureśam | viśvādhāraṃ gaganasadṛśaṃ meghavarṇaṃ śubhāṅgam | lakṣmīkāntaṃ kamalanayanaṃ yogibhirdhyānagamyam | vande viṣṇuṃ bhavabhayaharaṃ sarvalokaikanātham ||',
      meaning: {
        en: 'I worship Lord Vishnu — who has a serene form, who reclines on the serpent Shesha, from whose navel the lotus springs, lord of the gods, support of the universe, vast as the sky, dark as rain clouds, with auspicious limbs, beloved of Lakshmi, lotus-eyed, accessible to yogis through meditation, destroyer of the fear of worldly existence, sole lord of all worlds.',
        hi: 'मैं भगवान विष्णु की वन्दना करता हूँ — जिनका स्वरूप शान्त है, जो शेषनाग पर शयन करते हैं, जिनकी नाभि से कमल प्रकट होता है, देवताओं के ईश्वर, विश्व के आधार, आकाश सदृश, मेघ जैसे वर्ण वाले, शुभ अंगों वाले, लक्ष्मी के प्रिय, कमलनयन, योगियों को ध्यान द्वारा प्राप्य, भवभय को हरने वाले, सभी लोकों के एकमात्र नाथ।',
        sa: 'विष्णुं वन्दे — शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गं लक्ष्मीकान्तं कमलनयनं योगिध्यानगम्यं भवभयहरं सर्वलोकैकनाथम्।',
      },
      usage: {
        en: 'Recite at the very beginning of Satyanarayan Puja during dhyana (meditation). This shloka evokes the complete form of Vishnu.',
        hi: 'सत्यनारायण पूजा के आरम्भ में ध्यान के समय इस श्लोक का पाठ करें। यह श्लोक विष्णु के सम्पूर्ण स्वरूप का ध्यान कराता है।',
        sa: 'सत्यनारायणपूजायाः आरम्भे ध्यानकाले एतत् श्लोकं पठेत्। एषः श्लोकः विष्णोः सम्पूर्णं स्वरूपं ध्यापयति।',
      },
    },
  ],

  aarti: {
    name: { en: 'Om Jai Lakshmi Ramana — Satyanarayan Aarti', hi: 'ॐ जय लक्ष्मी रमणा — सत्यनारायण आरती', sa: 'ॐ जय लक्ष्मी रमणा — सत्यनारायणारात्रिकम्' },
    devanagari: `ॐ जय लक्ष्मी रमणा, स्वामी जय लक्ष्मी रमणा।
सत्यनारायण स्वामी, जन पातक हरणा॥
ॐ जय लक्ष्मी रमणा॥

रत्न जड़ित सिंहासन, अद्भुत छबि राजे।
नारद कहत निरन्तर, नित नूतन साजे॥
ॐ जय लक्ष्मी रमणा॥

प्रकट भये कलि कारन, द्विज को दर्श दियो।
बूढ़ा ब्राह्मण बनकर, कंचन महल कियो॥
ॐ जय लक्ष्मी रमणा॥

दुर्बल भील कठारे, ऋषि को बन दियो।
चन्द्रचूड़ एक राजा, तिनको धन दियो॥
ॐ जय लक्ष्मी रमणा॥

वैश्य मनोरथ पायो, श्रद्धा तज दीन्ही।
बाणिज सहित समुद्र में, ताहि डुबो दीन्ही॥
ॐ जय लक्ष्मी रमणा॥

सत्यनारायण कथा, वाणी विस्तारा।
ब्रह्मादिक मुनि गावें, हरद अम्बिका धारा॥
ॐ जय लक्ष्मी रमणा॥

श्री सत्यनारायण जी की आरती,
जो कोई नर गावे।
कहत शिवानन्द स्वामी,
मनवांछित फल पावे॥
ॐ जय लक्ष्मी रमणा॥`,
    iast: `oṃ jaya lakṣmī ramaṇā, svāmī jaya lakṣmī ramaṇā |
satyanārāyaṇa svāmī, jana pātaka haraṇā ||
oṃ jaya lakṣmī ramaṇā ||

ratna jaḍita siṃhāsana, adbhuta chabi rāje |
nārada kahata nirantara, nita nūtana sāje ||
oṃ jaya lakṣmī ramaṇā ||

prakaṭa bhaye kali kārana, dvija ko darśa diyo |
būḍhā brāhmaṇa banakara, kañcana mahala kiyo ||
oṃ jaya lakṣmī ramaṇā ||

durbala bhīla kaṭhāre, ṛṣi ko bana diyo |
candracūḍa eka rājā, tinako dhana diyo ||
oṃ jaya lakṣmī ramaṇā ||

vaiśya manoratha pāyo, śraddhā taja dīnhī |
bāṇija sahita samudra mẽ, tāhi ḍubo dīnhī ||
oṃ jaya lakṣmī ramaṇā ||

satyanārāyaṇa kathā, vāṇī vistārā |
brahmādika muni gāvẽ, harada ambikā dhārā ||
oṃ jaya lakṣmī ramaṇā ||

śrī satyanārāyaṇa jī kī āratī,
jo koī nara gāve |
kahata śivānanda svāmī,
manavāñchita phala pāve ||
oṃ jaya lakṣmī ramaṇā ||`,
  },

  naivedya: {
    en: 'Sheera (semolina halwa) is THE essential prasad — prepared with ghee, sugar, cardamom, saffron, and dry fruits (cashew, raisin). Also offer fruits, panchamrit, and Tulsi water. The sheera must be prepared fresh on the day of puja.',
    hi: 'शीरा (सूजी का हलवा) अनिवार्य प्रसाद है — घी, चीनी, इलायची, केसर और मेवों (काजू, किशमिश) से बनाया जाता है। फल, पंचामृत और तुलसी जल भी अर्पित करें। शीरा पूजा के दिन ताज़ा बनाना चाहिए।',
    sa: 'शीरा (गोधूमसूक्ष्मचूर्णपाकः) अनिवार्यं नैवेद्यम् — घृतशर्कराएलाकेसरशुष्कफलैः (काजूद्राक्षा) निर्मितम्। फलानि पञ्चामृतं तुलसीजलं च अर्पयेत्। शीरा पूजादिने नवीना निर्मातव्या।',
  },

  precautions: [
    {
      en: 'EVERY person present during the katha MUST eat the prasad (sheera). Refusing prasad brings misfortune — this is the central lesson of Chapter 4 of the Katha. Even a small amount must be consumed.',
      hi: 'कथा के दौरान उपस्थित प्रत्येक व्यक्ति को प्रसाद (शीरा) खाना अनिवार्य है। प्रसाद अस्वीकार करने से दुर्भाग्य आता है — यह कथा के अध्याय 4 का केन्द्रीय शिक्षा है। थोड़ी सी मात्रा भी अवश्य लेनी चाहिए।',
      sa: 'कथाकाले उपस्थितः प्रत्येकः जनः प्रसादं (शीरां) भक्षयेदेव। प्रसादस्य अस्वीकारे दुर्भाग्यम् आगच्छति — एषा कथायाः चतुर्थाध्यायस्य केन्द्रीया शिक्षा। स्वल्पमात्रम् अपि अवश्यं ग्रहणीयम्।',
    },
    {
      en: 'Prasad distribution is the MOST important part of the entire puja — more important than the katha reading itself. No one should leave without receiving and consuming prasad.',
      hi: 'प्रसाद वितरण पूरी पूजा का सबसे महत्वपूर्ण अंश है — कथा पाठ से भी अधिक महत्वपूर्ण। कोई भी प्रसाद लिए और खाए बिना न जाए।',
      sa: 'प्रसादवितरणं सम्पूर्णपूजायाः सर्वमहत्त्वपूर्णम् अंशम् — कथापठनादपि अधिकमहत्त्वपूर्णम्। कोऽपि प्रसादं अगृहीत्वा अभक्षयित्वा च न गच्छेत्।',
    },
    {
      en: 'If you make a sankalpa (vow) to perform Satyanarayan Puja, you MUST fulfill it. Forgetting or neglecting the vow brings adverse consequences (as shown in the Katha).',
      hi: 'यदि आप सत्यनारायण पूजा करने का संकल्प लें, तो उसे अवश्य पूर्ण करें। संकल्प को भूलने या उपेक्षा करने से प्रतिकूल परिणाम होते हैं (जैसा कथा में दिखाया गया है)।',
      sa: 'यदि सत्यनारायणपूजायाः सङ्कल्पं कुर्यात् तर्हि तं अवश्यं पूरयेत्। सङ्कल्पस्य विस्मरणम् उपेक्षा वा प्रतिकूलफलं ददाति (यथा कथायां दर्शितम्)।',
    },
    {
      en: 'The katha should be heard with complete attention. Do not talk, use phones, or be distracted during the reading. All family members should sit together.',
      hi: 'कथा पूर्ण ध्यान से सुननी चाहिए। पढ़ने के दौरान बात न करें, फ़ोन न देखें, विचलित न हों। सभी परिवारजन एक साथ बैठें।',
      sa: 'कथा सम्पूर्णावधानेन श्रोतव्या। पठनकाले न वदेत्, न विचलेत्। सर्वे परिजनाः सहोपविशेयुः।',
    },
  ],

  phala: {
    en: 'Satyanarayan Puja fulfills all wishes, brings lasting prosperity, removes all sorrows and obstacles, and grants peace of mind. The Skanda Purana states that this puja is the easiest and most effective way to please Lord Vishnu in Kali Yuga. Regular observance on Purnima ensures continuous divine grace.',
    hi: 'सत्यनारायण पूजा सभी मनोकामनाएँ पूर्ण करती है, स्थायी समृद्धि लाती है, सभी दुख और बाधाओं को दूर करती है, और मन की शान्ति प्रदान करती है। स्कन्द पुराण के अनुसार यह पूजा कलियुग में भगवान विष्णु को प्रसन्न करने का सबसे सरल और प्रभावी उपाय है। पूर्णिमा पर नियमित पालन से निरन्तर दैवी कृपा बनी रहती है।',
    sa: 'सत्यनारायणपूजा सर्वमनोरथान् पूरयति, स्थिरसमृद्धिं ददाति, सर्वदुःखविघ्नान् निवारयति, मनःशान्तिं च प्रददाति। स्कन्दपुराणे उक्तं कलियुगे विष्णुप्रसादनस्य सर्वसरलतमः प्रभावशालीतमः उपायः अयं पूजा। पूर्णिमायां नित्यपालनेन सतता दैवीकृपा वर्तते।',
  },
};

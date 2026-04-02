import type { PujaVidhi } from './types';

export const RAM_NAVAMI_PUJA: PujaVidhi = {
  festivalSlug: 'ram-navami',
  category: 'festival',
  deity: { en: 'Rama', hi: 'राम', sa: 'रामः' },

  samagri: [
    { name: { en: 'Rama idol/image (with Sita, Lakshman, Hanuman)', hi: 'राम मूर्ति/चित्र (सीता, लक्ष्मण, हनुमान सहित)', sa: 'राममूर्तिः/चित्रम् (सीतालक्ष्मणहनुमत्सहितम्)' } },
    { name: { en: 'Tulsi leaves', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' } },
    { name: { en: 'Panchamrit (milk, curd, ghee, honey, sugar)', hi: 'पंचामृत (दूध, दही, घी, शहद, शक्कर)', sa: 'पञ्चामृतम् (क्षीरं दधि घृतं मधु शर्करा)' } },
    { name: { en: 'Red and yellow flowers', hi: 'लाल और पीले फूल', sa: 'रक्तपीतपुष्पाणि' } },
    { name: { en: 'Fresh fruits', hi: 'ताजे फल', sa: 'नवफलानि' } },
    { name: { en: 'Whole coconut', hi: 'साबुत नारियल', sa: 'सम्पूर्णनारिकेलम्' }, quantity: '1' },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' } },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनम्' } },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1' },
    { name: { en: 'Cradle for baby Rama (jhula)', hi: 'बालराम के लिए पालना (झूला)', sa: 'बालरामार्थं डोला (हिन्दोलम्)' } },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' } },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' } },
    { name: { en: 'Yellow cloth (pitambar)', hi: 'पीला वस्त्र (पीताम्बर)', sa: 'पीताम्बरम्' } },
    { name: { en: 'Kalash (sacred pot) with mango leaves', hi: 'आम के पत्तों सहित कलश', sa: 'आम्रपत्रसहितकलशः' } },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Madhyahna Kaal (noon period) is the most auspicious time for Ram Navami puja — Lord Rama was born at midday on Chaitra Shukla Navami',
    hi: 'मध्याह्न काल (दोपहर का समय) राम नवमी पूजा के लिए सर्वाधिक शुभ है — भगवान राम का जन्म चैत्र शुक्ल नवमी को मध्याह्न में हुआ था',
    sa: 'मध्याह्नकालः रामनवमीपूजायाः सर्वोत्तमः शुभकालः — श्रीरामस्य जन्म चैत्रशुक्लनवम्यां मध्याह्ने अभवत्',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this auspicious Chaitra Shukla Navami, the sacred birthday of Lord Rama, I undertake this puja for the attainment of dharma, righteousness, courage, and the blessings of Maryada Purushottam Shri Rama.',
    hi: 'इस शुभ चैत्र शुक्ल नवमी, भगवान राम के पावन जन्मदिवस पर, धर्म, सदाचार, साहस और मर्यादा पुरुषोत्तम श्री राम के आशीर्वाद की प्राप्ति हेतु मैं यह पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे चैत्रशुक्लनवम्यां श्रीरामस्य पवित्रजन्मदिवसे धर्मसदाचारशौर्यप्राप्त्यर्थं मर्यादापुरुषोत्तमश्रीरामानुग्रहार्थं च पूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning Bath & Purification', hi: 'प्रातः स्नान व शुद्धि', sa: 'प्रातःस्नानं शुद्धिश्च' },
      description: {
        en: 'Rise early, take a sacred bath with Ganga jal if available. Wear clean yellow or saffron clothes. Observe a fast until Madhyahna (noon) puja.',
        hi: 'प्रातः उठकर गंगा जल (उपलब्ध हो तो) से पवित्र स्नान करें। स्वच्छ पीले या केसरिया वस्त्र पहनें। मध्याह्न (दोपहर) पूजा तक व्रत रखें।',
        sa: 'प्रातः उत्थाय गङ्गाजलेन (उपलभ्ये सति) पवित्रस्नानं कुर्यात्। शुद्धानि पीतकाषायवस्त्राणि धारयेत्। मध्याह्नपूजापर्यन्तं उपवासं कुर्यात्।',
      },
      duration: '15 min',
    },
    {
      step: 2,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापना' },
      description: {
        en: 'Fill a copper or brass kalash with water, place 5 mango leaves on top and a whole coconut. Draw a swastika on the kalash with kumkum. This represents the invocation of all sacred rivers.',
        hi: 'ताम्र या पीतल के कलश में जल भरें, ऊपर 5 आम के पत्ते और एक साबुत नारियल रखें। कलश पर कुमकुम से स्वस्तिक बनाएँ। यह सभी पवित्र नदियों का आवाहन है।',
        sa: 'ताम्रपीतलकलशं जलेन पूरयेत्, उपरि पञ्चाम्रपत्राणि सम्पूर्णनारिकेलं च स्थापयेत्। कलशे कुङ्कुमेन स्वस्तिकं लिखेत्। इदं सर्वपवित्रनदीनाम् आवाहनम्।',
      },
      duration: '5 min',
    },
    {
      step: 3,
      title: { en: 'Rama Idol Sthapana', hi: 'राम मूर्ति स्थापना', sa: 'राममूर्तिस्थापना' },
      description: {
        en: 'Place the Rama idol or image (ideally with Sita, Lakshman, and Hanuman) on a clean platform facing east. Spread yellow cloth beneath. Place the cradle nearby for the Bal Rama ceremony.',
        hi: 'राम मूर्ति या चित्र (आदर्शतः सीता, लक्ष्मण और हनुमान सहित) को पूर्व दिशा की ओर स्वच्छ चौकी पर स्थापित करें। नीचे पीला वस्त्र बिछाएँ। बाल राम संस्कार के लिए पास में पालना रखें।',
        sa: 'राममूर्तिं चित्रं वा (यथासम्भवं सीतालक्ष्मणहनुमत्सहितम्) पूर्वाभिमुखं शुद्धपीठे स्थापयेत्। अधस्तात् पीताम्बरं विस्तारयेत्। बालरामसंस्कारार्थं समीपे डोलं स्थापयेत्।',
      },
      duration: '5 min',
    },
    {
      step: 4,
      title: { en: 'Shodashopachar Puja', hi: 'षोडशोपचार पूजा', sa: 'षोडशोपचारपूजा' },
      description: {
        en: 'Perform the 16-step worship: Avahana, Asana, Padya, Arghya, Achamana, Snana, Vastra, Yagnopavita, Gandha, Pushpa, Dhupa, Deepa, Naivedya, Tambula, Pradakshina, and Mantra Pushpanjali — offering each to Lord Rama with devotion.',
        hi: '16 उपचारों की पूजा करें: आवाहन, आसन, पाद्य, अर्घ्य, आचमन, स्नान, वस्त्र, यज्ञोपवीत, गन्ध, पुष्प, धूप, दीप, नैवेद्य, ताम्बूल, प्रदक्षिणा और मन्त्र पुष्पाञ्जलि — प्रत्येक भक्तिपूर्वक भगवान राम को अर्पित करें।',
        sa: 'षोडशोपचारपूजनं कुर्यात् — आवाहनम्, आसनम्, पाद्यम्, अर्घ्यम्, आचमनम्, स्नानम्, वस्त्रम्, यज्ञोपवीतम्, गन्धम्, पुष्पम्, धूपम्, दीपम्, नैवेद्यम्, ताम्बूलम्, प्रदक्षिणा, मन्त्रपुष्पाञ्जलिः — प्रत्येकं भक्त्या श्रीरामाय समर्पयेत्।',
      },
      mantraRef: 'rama-taraka',
      duration: '20 min',
    },
    {
      step: 5,
      title: { en: 'Abhishek with Panchamrit', hi: 'पंचामृत अभिषेक', sa: 'पञ्चामृताभिषेकः' },
      description: {
        en: 'Bathe the Rama idol with Panchamrit (milk, curd, ghee, honey, sugar) in the given order, then with Ganga jal or clean water. Wipe gently and place back on the altar.',
        hi: 'राम मूर्ति को पंचामृत (दूध, दही, घी, शहद, शक्कर) से क्रमशः स्नान कराएँ, फिर गंगा जल या शुद्ध जल से। धीरे से पोंछकर वापस वेदी पर रखें।',
        sa: 'राममूर्तिं पञ्चामृतेन (क्षीरं दधि घृतं मधु शर्करा) यथाक्रमं स्नापयेत्, ततो गङ्गाजलेन शुद्धजलेन वा। मृदुलं प्रमार्ज्य पुनः वेद्यां स्थापयेत्।',
      },
      duration: '10 min',
    },
    {
      step: 6,
      title: { en: 'Vastra & Shringar', hi: 'वस्त्र व श्रृंगार', sa: 'वस्त्रं श्रृङ्गारश्च' },
      description: {
        en: 'Dress the idol in yellow cloth (pitambar). Apply chandan (sandalwood paste) and kumkum tilak. Offer tulsi mala (garland) and red-yellow flowers.',
        hi: 'मूर्ति को पीला वस्त्र (पीताम्बर) पहनाएँ। चन्दन और कुमकुम का तिलक लगाएँ। तुलसी की माला और लाल-पीले फूल अर्पित करें।',
        sa: 'मूर्तिं पीताम्बरेण आच्छादयेत्। चन्दनकुङ्कुमतिलकं लेपयेत्। तुलसीमालां रक्तपीतपुष्पाणि च समर्पयेत्।',
      },
      duration: '5 min',
    },
    {
      step: 7,
      title: { en: 'Kalyanotsavam (Symbolic Marriage)', hi: 'कल्याणोत्सवम् (प्रतीकात्मक विवाह)', sa: 'कल्याणोत्सवम् (प्रतीकात्मकविवाहः)' },
      description: {
        en: 'In many traditions, the marriage of Rama and Sita (Sita Kalyanam) is ceremonially enacted — garlands are exchanged between Rama and Sita idols, symbolizing their divine union described in Ramayana.',
        hi: 'कई परम्पराओं में राम-सीता विवाह (सीता कल्याणम्) का आनुष्ठानिक मंचन किया जाता है — राम और सीता मूर्तियों में माला विनिमय, रामायण में वर्णित उनके दिव्य मिलन का प्रतीक।',
        sa: 'बहुपरम्परासु रामसीतयोः विवाहः (सीताकल्याणम्) आनुष्ठानिकरूपेण प्रदर्श्यते — रामसीतामूर्तयोः मालाविनिमयः रामायणवर्णितदिव्यमिलनस्य प्रतीकः।',
      },
      duration: '10 min',
    },
    {
      step: 8,
      title: { en: 'Cradle Ceremony (Bal Rama Janmotsav)', hi: 'पालना संस्कार (बालराम जन्मोत्सव)', sa: 'डोलासंस्कारः (बालरामजन्मोत्सवः)' },
      description: {
        en: 'At Madhyahna (exact noon — the birth moment of Rama), place a small baby Rama idol in the decorated cradle. Swing the cradle gently while singing devotional songs. Blow the conch and ring bells to celebrate the birth.',
        hi: 'मध्याह्न (ठीक दोपहर — राम के जन्म का क्षण) पर, सजे हुए पालने में छोटी बालराम मूर्ति रखें। भक्ति गीत गाते हुए पालने को धीरे-धीरे झुलाएँ। जन्मोत्सव मनाने के लिए शंख बजाएँ और घण्टी बजाएँ।',
        sa: 'मध्याह्ने (ठीक मध्याह्नकाले — रामजन्मक्षणे) अलङ्कृतडोले लघुबालराममूर्तिं स्थापयेत्। भक्तिगीतानि गायन् डोलं मृदुलं आन्दोलयेत्। जन्मोत्सवं अभिनन्दितुं शङ्खं घण्टां च वादयेत्।',
      },
      duration: '10 min',
    },
    {
      step: 9,
      title: { en: 'Ramayana Path (Recitation)', hi: 'रामायण पाठ', sa: 'रामायणपाठः' },
      description: {
        en: 'Recite selected chapters from Ramayana — particularly Bal Kanda (birth chapter) from Tulsidas\'s Ramcharitmanas or Valmiki Ramayana. Many devotees recite Sundarkand for Hanuman\'s blessings.',
        hi: 'रामायण के चुनिन्दा अध्यायों का पाठ करें — विशेषकर तुलसीदास के रामचरितमानस या वाल्मीकि रामायण से बालकाण्ड (जन्म अध्याय)। कई भक्त हनुमान जी के आशीर्वाद हेतु सुन्दरकाण्ड का पाठ करते हैं।',
        sa: 'रामायणात् चितानि अध्यायानि पठेत् — विशेषतः तुलसीदासरामचरितमानसात् वाल्मीकिरामायणात् वा बालकाण्डम् (जन्माध्यायम्)। बहवो भक्ताः हनुमदनुग्रहार्थं सुन्दरकाण्डं पठन्ति।',
      },
      duration: '30 min',
    },
    {
      step: 10,
      title: { en: 'Dhupa & Deepa', hi: 'धूप व दीप', sa: 'धूपदीपौ' },
      description: {
        en: 'Light incense sticks and wave before the idol. Then light the ghee lamp and perform the ritual lamp waving — 3 times at the feet, 2 at the navel, 1 at the face, 7 times around the full form.',
        hi: 'अगरबत्ती जलाकर मूर्ति के सामने घुमाएँ। फिर घी का दीपक जलाकर आरती करें — 3 बार चरणों पर, 2 बार नाभि पर, 1 बार मुख पर, 7 बार पूरी मूर्ति के चारों ओर।',
        sa: 'धूपं प्रज्वाल्य मूर्तेः पुरतः भ्रामयेत्। ततो घृतदीपं प्रज्वाल्य आरात्रिकं कुर्यात् — त्रिवारं पादयोः, द्विवारं नाभौ, एकवारं मुखे, सप्तवारं सम्पूर्णमूर्तेः परितः।',
      },
      duration: '5 min',
    },
    {
      step: 11,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform aarti of Lord Rama by singing "Aarti Shri Ramchandra Ji Ki" with the camphor lamp. Ring the bell continuously during aarti.',
        hi: 'कपूर के दीपक के साथ "आरती श्री रामचन्द्र जी की" गाते हुए भगवान राम की आरती करें। आरती के दौरान लगातार घण्टी बजाएँ।',
        sa: 'कर्पूरदीपेन "आरती श्रीरामचन्द्रस्य" गायन् श्रीरामस्य आरात्रिकं कुर्यात्। आरात्रिककाले अविरतं घण्टां वादयेत्।',
      },
      duration: '5 min',
    },
    {
      step: 12,
      title: { en: 'Naivedya (Bhog)', hi: 'नैवेद्य (भोग)', sa: 'नैवेद्यम् (भोगः)' },
      description: {
        en: 'Offer fruits, kheer (rice pudding), panjeeri, coconut, and sattvic food to Lord Rama. Sprinkle water around the offerings and chant the naivedya mantra.',
        hi: 'भगवान राम को फल, खीर, पंजीरी, नारियल और सात्विक भोजन अर्पित करें। भोग के चारों ओर जल छिड़कें और नैवेद्य मन्त्र पढ़ें।',
        sa: 'श्रीरामाय फलानि क्षीरान्नं पञ्जीरीं नारिकेलं सात्त्विकाहारं च निवेदयेत्। नैवेद्यस्य परितः जलं सिञ्चेत् नैवेद्यमन्त्रं च जपेत्।',
      },
      duration: '5 min',
    },
    {
      step: 13,
      title: { en: 'Pradakshina & Prarthana', hi: 'प्रदक्षिणा व प्रार्थना', sa: 'प्रदक्षिणा प्रार्थना च' },
      description: {
        en: 'Circumambulate the idol 3 times chanting "Shri Ram Jai Ram Jai Jai Ram." Offer final prayers for dharma, protection, and the welfare of all beings.',
        hi: '"श्रीराम जय राम जय जय राम" का जप करते हुए मूर्ति की 3 बार प्रदक्षिणा करें। धर्म, रक्षा और सभी प्राणियों के कल्याण हेतु अन्तिम प्रार्थना करें।',
        sa: '"श्रीराम जय राम जय जय राम" जपन् मूर्तेः त्रिवारं प्रदक्षिणां कुर्यात्। धर्मरक्षासर्वप्राणिकल्याणार्थं अन्तिमप्रार्थनां कुर्यात्।',
      },
      mantraRef: 'rama-dhun',
      duration: '5 min',
    },
  ],

  mantras: [
    {
      id: 'rama-taraka',
      name: { en: 'Rama Taraka Mantra', hi: 'राम तारक मन्त्र', sa: 'रामतारकमन्त्रः' },
      devanagari: 'ॐ श्री रामाय नमः',
      iast: 'oṃ śrī rāmāya namaḥ',
      meaning: {
        en: 'Salutations to Lord Rama, the one who liberates (Taraka — the one who helps cross the ocean of worldly existence)',
        hi: 'भगवान राम को नमन, जो मुक्तिदाता हैं (तारक — भवसागर से पार कराने वाले)',
        sa: 'श्रीरामाय नमः, यो मोक्षदायकः (तारकः — भवसागरोत्तारकः)',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the puja — this is the most sacred Rama mantra, called Taraka because it liberates the soul',
        hi: 'पूजा के दौरान 108 बार जपें — यह सबसे पवित्र राम मन्त्र है, तारक कहलाता है क्योंकि यह आत्मा को मुक्त करता है',
        sa: 'पूजाकाले अष्टोत्तरशतवारं जपेत् — अयं सर्वपवित्रो राममन्त्रः तारक इति उच्यते यतः आत्मानं मोचयति',
      },
    },
    {
      id: 'rama-gayatri',
      name: { en: 'Rama Gayatri Mantra', hi: 'राम गायत्री मन्त्र', sa: 'रामगायत्रीमन्त्रः' },
      devanagari: 'ॐ दाशरथये विद्महे सीतावल्लभाय धीमहि तन्नो रामचन्द्रः प्रचोदयात्',
      iast: 'oṃ dāśarathaye vidmahe sītāvallabhāya dhīmahi tanno rāmacandraḥ pracodayāt',
      meaning: {
        en: 'We meditate upon the son of Dasharatha, we contemplate the beloved of Sita. May that Ramachandra inspire and illuminate us.',
        hi: 'हम दशरथ पुत्र को जानते हैं, सीता के प्रिय का ध्यान करते हैं। वह रामचन्द्र हमें प्रेरित करें।',
        sa: 'दाशरथिं विजानीमहे सीतावल्लभं ध्यायामहे। रामचन्द्रः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite during the dhyana (meditation) step for invoking Rama\'s divine qualities of dharma and righteousness',
        hi: 'ध्यान चरण में राम के धर्म और सदाचार के दिव्य गुणों के आवाहन हेतु पढ़ें',
        sa: 'ध्यानसमये रामस्य धर्मसदाचारदिव्यगुणावाहनार्थं पठेत्',
      },
    },
    {
      id: 'rama-dhun',
      name: { en: 'Rama Dhun (Sacred Chant)', hi: 'राम धुन', sa: 'रामधुनिः' },
      devanagari: 'श्रीराम जय राम जय जय राम',
      iast: 'śrīrāma jaya rāma jaya jaya rāma',
      meaning: {
        en: 'Glory to Lord Rama, victory to Rama, victory, victory to Rama!',
        hi: 'श्रीराम की जय, राम की जय, जय जय राम!',
        sa: 'श्रीरामस्य जयः, रामस्य जयः, जयजयरामः!',
      },
      usage: {
        en: 'Chant continuously during pradakshina and throughout the day — this is the simplest yet most powerful Rama chant, beloved of Tulsidas and Mahatma Gandhi',
        hi: 'प्रदक्षिणा के दौरान और पूरे दिन लगातार जपें — यह सबसे सरल किन्तु सबसे प्रभावशाली राम धुन है, तुलसीदास और महात्मा गाँधी को प्रिय',
        sa: 'प्रदक्षिणाकाले दिनभरं च अविरतं जपेत् — इयं सरलतमा किन्तु प्रभावशालिनी रामधुनिः, तुलसीदासमहात्मागान्धिप्रिया',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Ramcharitmanas — Bal Kanda (Birth section)', hi: 'रामचरितमानस — बालकाण्ड (जन्म प्रसंग)', sa: 'रामचरितमानसम् — बालकाण्डम् (जन्मप्रसङ्गः)' },
      duration: '20 min',
      note: {
        en: 'Recite the verses describing Rama\'s birth from Tulsidas\'s Ramcharitmanas, Bal Kanda — "Bhaye pragat kripala deen dayala..."',
        hi: 'तुलसीदास के रामचरितमानस, बालकाण्ड से राम जन्म वर्णन के छन्द पढ़ें — "भये प्रगट कृपाला दीनदयाला..."',
        sa: 'तुलसीदासरामचरितमानसात् बालकाण्डात् रामजन्मवर्णनपद्यानि पठेत् — "भये प्रगट कृपाला दीनदयाला..."',
      },
    },
    {
      name: { en: 'Rama Raksha Stotra', hi: 'राम रक्षा स्तोत्र', sa: 'रामरक्षास्तोत्रम्' },
      verseCount: 38,
      duration: '15 min',
      note: {
        en: 'Powerful protective stotra attributed to Budhakaushika Rishi. Provides divine armor of Rama\'s protection.',
        hi: 'बुधकौशिक ऋषि द्वारा रचित शक्तिशाली रक्षा स्तोत्र। राम के संरक्षण का दिव्य कवच प्रदान करता है।',
        sa: 'बुधकौशिकऋषिप्रणीतं प्रभावशालि रक्षास्तोत्रम्। श्रीरामरक्षायाः दिव्यकवचं प्रददाति।',
      },
    },
  ],

  aarti: {
    name: { en: 'Aarti Shri Ramchandra Ji Ki', hi: 'आरती श्री रामचन्द्र जी की', sa: 'आरती श्रीरामचन्द्रस्य' },
    devanagari:
      'आरती कीजे श्री रामचन्द्र जी की।\nदुष्ट दलन सीतापति जी की॥\n\nगल में सुशोभित कौस्तुभ माला।\nबाजूबन्द नवरत्न उजाला॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nशिर पर मुकुट बनत है साजे।\nदेखत मुख जन सकल रीझाजे॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nसियाजी साथ विराजत सुन्दर।\nछवि बनी रही नयन अभिरामा अन्तर॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nभक्त हनुमत चँवर डुलावें।\nश्री लक्ष्मण शत्रुघ्न भरत सुख गावें॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nकनक थार में बहुविधि भोगा।\nअरती करत शोभासिन्धु योगा॥\nआरती कीजे श्री रामचन्द्र जी की॥\n\nआरती कीजे श्री रामचन्द्र जी की।\nदुष्ट दलन सीतापति जी की॥\n\n॥ इति श्री रामचन्द्र आरती सम्पूर्णम् ॥',
    iast:
      'āratī kīje śrī rāmacandra jī kī |\nduṣṭa dalana sītāpati jī kī ||\n\ngala meṃ suśobhita kaustubha mālā |\nbājūbanda navaratna ujālā ||\nāratī kīje śrī rāmacandra jī kī ||\n\nśira para mukuṭa banata hai sāje |\ndekhata mukha jana sakala rījhāje ||\nāratī kīje śrī rāmacandra jī kī ||\n\nsiyājī sātha virājata sundara |\nchavi banī rahī nayana abhirāmā antara ||\nāratī kīje śrī rāmacandra jī kī ||\n\nbhakta hanumata caṃvara ḍulāveṃ |\nśrī lakṣmaṇa śatrughna bharata sukha gāveṃ ||\nāratī kīje śrī rāmacandra jī kī ||\n\nkanaka thāra meṃ bahuvidhi bhogā |\naratī karata śobhāsindhu yogā ||\nāratī kīje śrī rāmacandra jī kī ||\n\nāratī kīje śrī rāmacandra jī kī |\nduṣṭa dalana sītāpati jī kī ||\n\n|| iti śrī rāmacandra āratī sampūrṇam ||',
  },

  naivedya: {
    en: 'Kheer (rice pudding), panjeeri, fresh fruits, coconut, sattvic sweets, and seasonal offerings — all prepared without onion, garlic, or tamasic ingredients',
    hi: 'खीर (चावल की), पंजीरी, ताजे फल, नारियल, सात्विक मिठाइयाँ, और मौसमी प्रसाद — सभी बिना प्याज, लहसुन या तामसिक सामग्री के बने',
    sa: 'क्षीरान्नम्, पञ्जीरी, नवफलानि, नारिकेलम्, सात्त्विकमिष्टान्नानि, ऋत्वनुसारप्रसादः च — सर्वाणि पलाण्डुलशुनतामसद्रव्यरहितानि',
  },

  precautions: [
    {
      en: 'Fast until Madhyahna (noon) — break the fast only after completing the puja at the exact birth time of Rama',
      hi: 'मध्याह्न (दोपहर) तक व्रत रखें — केवल राम के जन्म समय पर पूजा सम्पन्न करने के बाद ही व्रत तोड़ें',
      sa: 'मध्याह्नपर्यन्तम् उपवासं कुर्यात् — रामजन्मकाले पूजां सम्पाद्य एव उपवासं भञ्जयेत्',
    },
    {
      en: 'Use only Tulsi leaves for Rama puja — do NOT use Bel (wood apple / bilva) leaves, which are reserved for Shiva',
      hi: 'राम पूजा में केवल तुलसी के पत्ते प्रयोग करें — बेल (बिल्व) के पत्ते न चढ़ाएँ, वे शिव के लिए आरक्षित हैं',
      sa: 'रामपूजायां तुलसीपत्राणि एव उपयोजयेत् — बिल्वपत्राणि न समर्पयेत्, तानि शिवार्थं आरक्षितानि',
    },
    {
      en: 'Face east during the entire puja — Lord Rama was born facing east, and the idol should also face east',
      hi: 'सम्पूर्ण पूजा के दौरान पूर्व दिशा की ओर मुख करें — भगवान राम का जन्म पूर्वाभिमुख हुआ था, मूर्ति भी पूर्व की ओर होनी चाहिए',
      sa: 'सम्पूर्णपूजाकाले पूर्वाभिमुखं तिष्ठेत् — श्रीरामस्य जन्म पूर्वाभिमुखम् अभवत्, मूर्तिः अपि पूर्वाभिमुखी भवेत्',
    },
    {
      en: 'Maintain strict sattvic diet on this day — no onion, garlic, meat, or intoxicants',
      hi: 'इस दिन कड़ा सात्विक आहार रखें — प्याज, लहसुन, मांस या नशीले पदार्थ वर्जित हैं',
      sa: 'अस्मिन् दिवसे कठिनं सात्त्विकाहारं पालयेत् — पलाण्डुः लशुनं मांसं मद्यं च वर्जनीयम्',
    },
  ],

  phala: {
    en: 'Attainment of dharma and righteousness, courage and moral strength, protection from evil, family harmony, and the supreme blessing of Maryada Purushottam Shri Rama — the ideal king, husband, son, and human being',
    hi: 'धर्म और सदाचार की प्राप्ति, साहस और नैतिक बल, अशुभ से रक्षा, पारिवारिक सामंजस्य, और मर्यादा पुरुषोत्तम श्री राम — आदर्श राजा, पति, पुत्र और मनुष्य — का सर्वोच्च आशीर्वाद',
    sa: 'धर्मसदाचारप्राप्तिः, शौर्यनैतिकबलम्, अशुभनिवारणम्, कुटुम्बसामञ्जस्यम्, मर्यादापुरुषोत्तमश्रीरामस्य — आदर्शनृपतेः पत्युः पुत्रस्य मनुष्यस्य च — सर्वोच्चानुग्रहः',
  },
};

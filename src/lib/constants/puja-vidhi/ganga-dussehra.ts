import type { PujaVidhi } from './types';

export const GANGA_DUSSEHRA_PUJA: PujaVidhi = {
  festivalSlug: 'ganga-dussehra',
  category: 'festival',
  deity: { en: 'Ganga Mata (Mother Ganges)', hi: 'गंगा माता', sa: 'गङ्गामाता' },

  samagri: [
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Flowers (lotus, marigold, rose)', hi: 'फूल (कमल, गेंदा, गुलाब)', sa: 'पुष्पाणि (पद्मं मालतीपुष्पं शतपत्रं च)' }, category: 'flowers', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Leaf boats (patravali) for diyas', hi: 'दीपदान के लिए पत्तों की नाव', sa: 'दीपप्रवाहार्थं पत्रनौकाः' }, category: 'puja_items', essential: true },
    { name: { en: 'Ganga Jal (holy Ganges water)', hi: 'गंगाजल', sa: 'गङ्गाजलम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, category: 'food', essential: false },
    { name: { en: 'Fruits (banana, apple)', hi: 'फल (केला, सेब)', sa: 'फलानि (कदलीफलम्, सेवफलम्)' }, category: 'food', essential: false },
    { name: { en: 'Sweets (kheer, ladoo)', hi: 'मिठाइयाँ (खीर, लड्डू)', sa: 'मिष्टान्नानि (पायसः लड्डुकः)' }, category: 'food', essential: false },
    { name: { en: 'Turmeric (haldi)', hi: 'हल्दी', sa: 'हरिद्रा' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Ganga Dussehra falls on Jyeshtha Shukla Dashami. The puja is ideally performed during Madhyahna (midday) or at river ghats during evening Ganga Aarti. Bathing in the Ganga at Haridwar, Varanasi, or Prayagraj during Hasta Nakshatra is considered most auspicious.',
    hi: 'गंगा दशहरा ज्येष्ठ शुक्ल दशमी को पड़ता है। पूजा मध्याह्न में या शाम की गंगा आरती के समय नदी घाट पर करना श्रेष्ठ है। हस्त नक्षत्र में हरिद्वार, वाराणसी या प्रयागराज में गंगा स्नान सर्वोत्तम माना जाता है।',
    sa: 'गङ्गादशहरा ज्येष्ठशुक्लदशम्यां भवति। पूजा मध्याह्ने नदीघट्टे वा सायंकालीनगङ्गाआरात्रिककाले कर्तुं श्रेष्ठम्। हस्तनक्षत्रे हरिद्वारे वाराणस्यां प्रयागराजे वा गङ्गास्नानं सर्वोत्तमं मन्यते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Jyeshtha Shukla Dashami, I worship Mother Ganga who descended from heaven to earth through the penance of King Bhagiratha. May she wash away my ten sins (dasha paapa) and bestow purity, liberation, and spiritual merit upon me and my family.',
    hi: 'इस पवित्र ज्येष्ठ शुक्ल दशमी पर, मैं माँ गंगा की पूजा करता/करती हूँ जो राजा भगीरथ की तपस्या से स्वर्ग से पृथ्वी पर अवतरित हुईं। वे मेरे दस पापों (दश पाप) को धो दें और मुझे तथा मेरे परिवार को पवित्रता, मोक्ष और पुण्य प्रदान करें।',
    sa: 'अस्मिन् पुण्ये ज्येष्ठशुक्लदशम्यां गङ्गामातरं पूजयामि या भगीरथस्य तपसा स्वर्गात् पृथिवीम् अवातरत्। सा मम दशपापानि प्रक्षालयतु मम कुटुम्बस्य च पावित्र्यं मोक्षं पुण्यं च प्रयच्छतु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Holy Bath (Snan)', hi: 'पवित्र स्नान', sa: 'पुण्यस्नानम्' },
      description: {
        en: 'Take a holy bath in the Ganga or any nearby river. If no river is accessible, add Ganga Jal to your bathing water. While bathing, pray to Ganga Mata for purification of ten sins (kaya, vacha, manas  –  three each, plus one universal).',
        hi: 'गंगा या किसी निकटवर्ती नदी में पवित्र स्नान करें। नदी उपलब्ध न हो तो स्नान के जल में गंगाजल मिलाएँ। स्नान करते हुए दस पापों (काय, वाचा, मनस  –  तीन-तीन, और एक सार्वभौमिक) के शुद्धिकरण हेतु गंगा माता से प्रार्थना करें।',
        sa: 'गङ्गायां समीपवर्तिन्यां नद्यां वा पुण्यस्नानं कुर्यात्। नदी अनुपलब्धा चेत् स्नानजले गङ्गाजलं मिश्रयेत्। स्नानकाले दशपापशोधनाय गङ्गामातरं प्रार्थयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Ganga Puja at the Ghat', hi: 'घाट पर गंगा पूजा', sa: 'घट्टे गङ्गापूजनम्' },
      description: {
        en: 'Sit near the water and place a small altar. Offer flowers, akshat, kumkum, and turmeric to the water. Apply tilak of kumkum on a small Ganga image or on the water vessel (kalash) representing the Ganga.',
        hi: 'जल के निकट बैठें और छोटी वेदी रखें। जल में फूल, अक्षत, कुमकुम और हल्दी अर्पित करें। गंगा की छोटी मूर्ति पर या गंगा का प्रतिनिधित्व करने वाले कलश पर कुमकुम का तिलक लगाएँ।',
        sa: 'जलसमीपे उपविश्य लघुवेदिं स्थापयेत्। जले पुष्पाणि अक्षतान् कुङ्कुमं हरिद्रां च समर्पयेत्। गङ्गाप्रतिमायां गङ्गाप्रतिनिधिकलशे वा कुङ्कुमतिलकं कुर्यात्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Sankalpa', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water and akshat in the right hand. State your name, gotra, the date (Jyeshtha Shukla Dashami), and the purpose  –  worship of Ganga Mata for removal of ten sins. Release the water into the river.',
        hi: 'दाहिने हाथ में जल और अक्षत लें। अपना नाम, गोत्र, तिथि (ज्येष्ठ शुक्ल दशमी) और उद्देश्य  –  दस पापों के निवारण हेतु गंगा माता की पूजा  –  बोलें। जल नदी में छोड़ें।',
        sa: 'दक्षिणहस्ते जलाक्षतान् गृहीत्वा स्वनाम गोत्रं तिथिं (ज्येष्ठशुक्लदशमी) दशपापनिवारणाय गङ्गामातुः पूजाप्रयोजनं च वदेत्। जलं नद्यां विसृजेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Diya Floating (Deep Daan)', hi: 'दीप दान', sa: 'दीपदानम्' },
      description: {
        en: 'Light ten ghee diyas on leaf boats, each representing the removal of one sin. Float them on the river while chanting Ganga mantras. Watch them float away as a symbol of your sins departing.',
        hi: 'पत्तों की नावों पर दस घी के दीपक जलाएँ, प्रत्येक एक पाप के निवारण का प्रतीक। गंगा मंत्रों का जाप करते हुए उन्हें नदी में प्रवाहित करें। जैसे वे बहते जाएँ, इसे अपने पापों के प्रस्थान का प्रतीक मानें।',
        sa: 'पत्रनौकासु दश घृतदीपान् प्रज्वालयेत्, प्रत्येकं एकपापनिवारणस्य प्रतीकम्। गङ्गामन्त्रान् जपन् तान् नद्यां प्रवाहयेत्। यथा ते प्रवहन्ति तथा स्वपापानां प्रस्थानचिह्नं मन्येत।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
      mantraRef: 'ganga-avataran',
    },
    {
      step: 5,
      title: { en: 'Mantra Japa', hi: 'मंत्र जप', sa: 'मन्त्रजपः' },
      description: {
        en: 'Chant the Ganga Stotram or the Ganga Mantra 108 times while seated near the river. Focus on the purifying energy of Ganga Mata flowing through you.',
        hi: 'नदी के निकट बैठकर गंगा स्तोत्र या गंगा मंत्र का 108 बार जाप करें। गंगा माता की शुद्धिकारी ऊर्जा पर ध्यान केन्द्रित करें।',
        sa: 'नद्याः समीपे उपविश्य गङ्गास्तोत्रं गङ्गामन्त्रं वा अष्टोत्तरशतवारं जपेत्। गङ्गामातुः पावनशक्तौ ध्यानं कुर्यात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 6,
      title: { en: 'Ganga Aarti', hi: 'गंगा आरती', sa: 'गङ्गाआरात्रिकम्' },
      description: {
        en: 'Perform Ganga Aarti with a large ghee lamp and camphor. Sing "Om Jai Gange Mata" or the traditional Ganga Aarti. Wave the lamp in clockwise circles towards the river. Ring the bell continuously.',
        hi: 'बड़े घी के दीपक और कपूर से गंगा आरती करें। "ॐ जय गंगे माता" या पारम्परिक गंगा आरती गाएँ। नदी की ओर दीपक को दक्षिणावर्त गोल घुमाएँ। लगातार घंटी बजाएँ।',
        sa: 'विशालघृतदीपेन कर्पूरेण च गङ्गाआरात्रिकं कुर्यात्। गङ्गाआरात्रिकगीतं गायेत्। नद्याः दिशि दीपं प्रदक्षिणवर्तेन भ्रामयेत्। सततं घण्टां वादयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 7,
      title: { en: 'Charity (Daan)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate ten items to Brahmins or the needy  –  representing the ten sins being absolved. Traditional gifts include grains, clothes, sesame seeds, and gold (according to capacity).',
        hi: 'ब्राह्मणों या ज़रूरतमंदों को दस वस्तुएँ दान करें  –  दस पापों के निवारण का प्रतीक। पारम्परिक दान में अनाज, वस्त्र, तिल और सोना (यथाशक्ति) शामिल हैं।',
        sa: 'ब्राह्मणेभ्यः दरिद्रेभ्यो वा दशवस्तूनि दद्यात्  –  दशपापनिवारणस्य प्रतीकम्। पारम्परिकदाने धान्यं वस्त्राणि तिलाः सुवर्णं (यथाशक्ति) च सन्ति।',
      },
      duration: '10 min',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'ganga-avataran',
      name: { en: 'Ganga Avataran Mantra', hi: 'गंगा अवतरण मंत्र', sa: 'गङ्गावतरणमन्त्रः' },
      devanagari: 'ॐ नमः शिवाय नारायणाय दशहराय गङ्गायै नमः।\nविष्णुपादाब्जसम्भूते गङ्गे त्रिपथगामिनि।\nधर्मद्रवेति विख्याते पापं मे हर जाह्नवि॥',
      iast: 'oṃ namaḥ śivāya nārāyaṇāya daśaharāya gaṅgāyai namaḥ |\nviṣṇupādābjasambhūte gaṅge tripatthagāmini |\ndharmadraveti vikhyāte pāpaṃ me hara jāhnavi ||',
      meaning: {
        en: 'Om, salutations to Shiva, Narayana, and Ganga who removes ten sins. O Ganga, born from the lotus feet of Vishnu, who flows through the three worlds, famed as the stream of dharma  –  remove my sins, O daughter of Jahnu.',
        hi: 'ॐ, शिव, नारायण और दस पापों को हरने वाली गंगा को नमस्कार। हे गंगे, विष्णु के चरणकमलों से उत्पन्न, तीन लोकों में बहने वाली, धर्म की धारा के रूप में विख्यात  –  हे जाह्नवी, मेरे पापों को हर लो।',
        sa: 'ॐ, शिवाय नारायणाय दशपापहारिण्यै गङ्गायै नमः। हे गङ्गे, विष्णुपादपद्मोद्भवे, त्रिपथगामिनि, धर्मप्रवाहरूपे  –  हे जाह्नवि, मम पापं हर।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant while floating diyas on the river and during the holy bath.',
        hi: 'नदी में दीपदान करते समय और पवित्र स्नान के दौरान जाप करें।',
        sa: 'नद्यां दीपप्रवाहनकाले पुण्यस्नानकाले च जपेत्।',
      },
    },
    {
      id: 'ganga-stotram',
      name: { en: 'Ganga Ashtakam (selected verse)', hi: 'गंगाष्टकम् (चयनित श्लोक)', sa: 'गङ्गाष्टकम् (चयनितश्लोकः)' },
      devanagari: 'देवि सुरेश्वरि भगवति गङ्गे त्रिभुवनतारिणि तरलतरङ्गे।\nशङ्करमौलिविहारिणि विमले मम मतिरास्तां तव पदकमले॥',
      iast: 'devi sureśvari bhagavati gaṅge tribhuvanatāriṇi taralataraṅge |\nśaṅkaramaulivihāriṇi vimale mama matirāstāṃ tava padakamale ||',
      meaning: {
        en: 'O Devi, queen of the gods, blessed Ganga, saviour of the three worlds with your restless waves! O pure one, who plays in the locks of Shankara  –  may my mind rest at your lotus feet.',
        hi: 'हे देवी, देवों की रानी, भगवती गंगे, तीन लोकों की तारिणी, चञ्चल तरंगों वाली! हे विमले, शंकर की जटाओं में विहार करने वाली  –  मेरा मन तुम्हारे चरणकमलों में स्थिर रहे।',
        sa: 'हे देवि सुरेश्वरि भगवति गङ्गे, त्रिभुवनतारिणि, तरलतरङ्गे! हे शङ्करमौलिविहारिणि विमले  –  मम मतिः तव पदकमले आस्ताम्।',
      },
      usage: {
        en: 'Recite during Ganga Aarti or while seated at the riverbank.',
        hi: 'गंगा आरती के समय या नदी किनारे बैठकर पाठ करें।',
        sa: 'गङ्गाआरात्रिककाले नदीतटे उपविश्य वा पठेत्।',
      },
    },
    {
      id: 'ganga-dhyan',
      name: { en: 'Ganga Dhyana Mantra', hi: 'गंगा ध्यान मंत्र', sa: 'गङ्गाध्यानमन्त्रः' },
      devanagari: 'ॐ विष्णुपादाय नमस्तुभ्यं गङ्गे विश्वेश्वरप्रिये।\nनमस्ते विष्णुरूपिण्यै नमो ब्रह्मस्वरूपिणि॥',
      iast: 'oṃ viṣṇupādāya namastubhyaṃ gaṅge viśveśvarapriye |\nnamaste viṣṇurūpiṇyai namo brahmasvarūpiṇi ||',
      meaning: {
        en: 'Om, I bow to you, Ganga, born from the feet of Vishnu, dear to the Lord of the universe. Salutations to you who are the form of Vishnu, the embodiment of Brahman.',
        hi: 'ॐ, विष्णु के चरणों से उत्पन्न, विश्वेश्वर की प्रिय, हे गंगे, मैं आपको नमन करता हूँ। विष्णुरूपिणी, ब्रह्मस्वरूपिणी  –  आपको नमस्कार।',
        sa: 'ॐ, विष्णुपादोद्भवे विश्वेश्वरप्रिये हे गङ्गे तुभ्यं नमः। विष्णुरूपिण्यै ब्रह्मस्वरूपिण्यै नमः।',
      },
      usage: {
        en: 'Chant during meditation at the riverbank.',
        hi: 'नदी किनारे ध्यान के समय जाप करें।',
        sa: 'नदीतटे ध्यानकाले जपेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Offer kheer (rice pudding), panjiri, seasonal fruits, and coconut to Ganga Mata. Sattvic vegetarian food is essential. Some traditions also offer batasha (sugar drops) and panchamrit.',
    hi: 'गंगा माता को खीर, पंजीरी, मौसमी फल और नारियल अर्पित करें। सात्विक शाकाहारी भोजन आवश्यक है। कुछ परम्पराओं में बताशे और पंचामृत भी चढ़ाया जाता है।',
    sa: 'गङ्गामात्रे पायसं पञ्जीरीं ऋतुफलानि नारिकेलं च समर्पयेत्। सात्त्विकं शाकाहारभोजनम् आवश्यकम्। काश्चित् परम्परासु बताशाः पञ्चामृतं च समर्प्यन्ते।',
  },

  precautions: [
    {
      en: 'Maintain cleanliness of the river  –  do not throw plastic, non-biodegradable items, or pollutants into the water.',
      hi: 'नदी की स्वच्छता बनाए रखें  –  प्लास्टिक, अजैविक पदार्थ या प्रदूषक जल में न डालें।',
      sa: 'नद्याः स्वच्छतां रक्षेत्  –  प्लास्टिकं अजैवपदार्थान् प्रदूषकान् वा जले मा क्षिपेत्।',
    },
    {
      en: 'Be cautious while bathing in the river, especially during monsoon season when water levels may be high.',
      hi: 'नदी में स्नान करते समय सावधान रहें, विशेषकर वर्षा ऋतु में जब जल स्तर ऊँचा हो सकता है।',
      sa: 'नद्यां स्नानकाले सावधानं भवेत्, विशेषतो वर्षाकाले यदा जलस्तरः उच्चो भवेत्।',
    },
    {
      en: 'The ten diyas represent the ten sins  –  perform the ritual with genuine devotion and intent for self-purification, not as a mere formality.',
      hi: 'दस दीपक दस पापों का प्रतीक हैं  –  यह अनुष्ठान वास्तविक भक्ति और आत्मशुद्धि के संकल्प से करें, केवल औपचारिकता के रूप में नहीं।',
      sa: 'दशदीपाः दशपापानां प्रतीकाः  –  इदम् अनुष्ठानं सच्चया भक्त्या आत्मशोधनसङ्कल्पेन कुर्यात्, केवलौपचारिकतया न।',
    },
    {
      en: 'Observe vegetarian diet on this day. Avoid alcohol, meat, and tamasic food.',
      hi: 'इस दिन शाकाहारी भोजन करें। मद्यपान, माँसाहार और तामसिक भोजन से बचें।',
      sa: 'अस्मिन् दिने शाकाहारं सेवेत। मद्यं मांसं तामसाहारं च वर्जयेत्।',
    },
  ],

  phala: {
    en: 'Ganga Dussehra destroys ten types of sins (three of body, three of speech, three of mind, and one universal). Bathing in and worshipping the Ganga on this day grants spiritual merit equivalent to visiting all tirthas. It brings purification, liberation from the cycle of rebirth, and ancestral peace.',
    hi: 'गंगा दशहरा दस प्रकार के पापों को नष्ट करता है (शरीर के तीन, वाणी के तीन, मन के तीन, और एक सार्वभौमिक)। इस दिन गंगा स्नान और पूजा से सभी तीर्थों के दर्शन के समान पुण्य मिलता है। यह शुद्धिकरण, पुनर्जन्म चक्र से मुक्ति और पितृ शान्ति प्रदान करता है।',
    sa: 'गङ्गादशहरा दशविधपापानि नाशयति (कायत्रयं वाक्त्रयं मनस्त्रयम् एकं सार्वभौमिकं च)। अस्मिन् दिने गङ्गास्नानपूजनेन सर्वतीर्थदर्शनसमं पुण्यं लभ्यते। इदं पावित्र्यं पुनर्जन्मचक्रमुक्तिं पितृशान्तिं च प्रयच्छति।',
  },
};

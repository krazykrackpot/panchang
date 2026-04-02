import type { PujaVidhi } from './types';

export const NAVARATRI_PUJA: PujaVidhi = {
  festivalSlug: 'navaratri',
  category: 'festival',
  deity: { en: 'Durga (Nine Forms)', hi: 'दुर्गा (नौ रूप)', sa: 'दुर्गा (नवस्वरूपाः)' },

  samagri: [
    { name: { en: 'Kalash (copper or brass pot)', hi: 'कलश (ताम्बे या पीतल का)', sa: 'कलशः (ताम्रः पीतलो वा)' }, quantity: '1' , category: 'vessels', essential: true },
    { name: { en: 'Mango leaves', hi: 'आम के पत्ते', sa: 'आम्रपत्राणि' }, quantity: '5-7' , category: 'flowers', essential: true },
    { name: { en: 'Whole coconut (with husk)', hi: 'पूरा नारियल (छिलके सहित)', sa: 'सम्पूर्णनारिकेलम् (सवल्कलम्)' }, quantity: '1' , category: 'food', essential: true },
    { name: { en: 'Red cloth', hi: 'लाल कपड़ा', sa: 'रक्तवस्त्रम्' } , category: 'clothing', essential: true },
    { name: { en: 'Durga idol or image', hi: 'दुर्गा मूर्ति या चित्र', sa: 'दुर्गामूर्तिः अथवा चित्रम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Navdhanya (9 types of grains)', hi: 'नवधान्य (9 प्रकार के अनाज)', sa: 'नवधान्यानि' }, note: { en: 'Wheat, rice, moong, chana, urad, masoor, barley, sesame, jowar', hi: 'गेहूँ, चावल, मूँग, चना, उड़द, मसूर, जौ, तिल, ज्वार', sa: 'गोधूमः, तण्डुलः, मुद्गः, चणकः, माषः, मसूरः, यवः, तिलः, यावनालः' } , category: 'food', essential: false },
    { name: { en: 'Akhand Jyoti lamp (with sufficient ghee/oil)', hi: 'अखण्ड ज्योति दीपक (पर्याप्त घी/तेल सहित)', sa: 'अखण्डज्योतिदीपः (पर्याप्तघृततैलयुक्तः)' }, quantity: '1', category: 'puja_items', essential: true },
    { name: { en: 'Red flowers (hibiscus, rose)', hi: 'लाल फूल (गुड़हल, गुलाब)', sa: 'रक्तपुष्पाणि (जपाकुसुमम्, पाटलम्)' } , category: 'flowers', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Sindoor', hi: 'सिन्दूर', sa: 'सिन्दूरम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Betel leaves', hi: 'पान के पत्ते', sa: 'ताम्बूलपत्राणि' }, quantity: '9' , category: 'puja_items', essential: false },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Ghee (for akhand jyoti and havan)', hi: 'घी (अखण्ड ज्योति और हवन के लिए)', sa: 'घृतम् (अखण्डज्योत्यर्थं हवनार्थं च)' } , category: 'food', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' } , category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } , category: 'puja_items', essential: true },
    { name: { en: 'Barley seeds (for sowing in kalash)', hi: 'जौ के बीज (कलश में बोने के लिए)', sa: 'यवबीजानि (कलशे वपनार्थम्)' }, category: 'food', essential: false },
    { name: { en: 'Havan samagri', hi: 'हवन सामग्री', sa: 'हवनसामग्री' } , category: 'puja_items', essential: false },
    { name: { en: 'Fruits and sweets for Kanya Pujan', hi: 'कन्या पूजन के लिए फल और मिठाई', sa: 'कन्यापूजनार्थं फलानि मिष्टान्नानि च' } , category: 'food', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Ghatasthapana on Day 1 must be performed during Abhijit Muhurta (around midday, roughly 11:45 AM to 12:30 PM). If Abhijit is not available, use the first one-third of the day during Pratipada tithi. Avoid Chitra Nakshatra for Ghatasthapana.',
    hi: 'प्रथम दिन घटस्थापना अभिजित मुहूर्त (लगभग मध्याह्न, प्रातः 11:45 से 12:30 बजे) में करनी चाहिए। यदि अभिजित उपलब्ध न हो तो प्रतिपदा तिथि के प्रथम तृतीयांश में करें। घटस्थापना में चित्रा नक्षत्र वर्जित है।',
    sa: 'प्रथमदिने घटस्थापनम् अभिजिन्मुहूर्ते (मध्याह्ने प्रायः) कर्तव्यम्। अभिजिन्मुहूर्ताभावे प्रतिपदातिथेः प्रथमतृतीयांशे कुर्यात्। घटस्थापने चित्रानक्षत्रं वर्जनीयम्।',
  },
  muhurtaWindow: { type: 'abhijit' },

  sankalpa: {
    en: 'On this auspicious Ashwin Shukla Pratipada, I undertake the nine-day Navaratri worship of the nine forms of Goddess Durga for the destruction of evil, attainment of strength, prosperity, and divine grace.',
    hi: 'इस शुभ आश्विन शुक्ल प्रतिपदा पर, दुष्टों के विनाश, शक्ति, समृद्धि और देवी कृपा की प्राप्ति के लिए, मैं देवी दुर्गा के नौ रूपों की नवरात्रि पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे आश्विनशुक्लप्रतिपदायां दुष्टविनाशाय शक्तिसमृद्धिदेवीकृपाप्राप्त्यर्थं श्रीदुर्गायाः नवस्वरूपाणां नवरात्रिपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Ghatasthapana (Day 1)', hi: 'घटस्थापना (प्रथम दिन)', sa: 'घटस्थापनम् (प्रथमदिनम्)' },
      description: {
        en: 'Clean the puja area and spread a red cloth on the platform. Fill a copper/brass kalash with water, place mango leaves around its rim, and set a coconut on top wrapped in red cloth. Place the kalash on a bed of soil mixed with barley seeds. Light the Akhand Jyoti. Day 1 is dedicated to Maa Shailaputri — the daughter of the mountains.',
        hi: 'पूजा स्थल को साफ कर चौकी पर लाल कपड़ा बिछाएँ। ताम्बे/पीतल के कलश में जल भरें, किनारे पर आम के पत्ते रखें, और ऊपर लाल कपड़े में लिपटा नारियल रखें। मिट्टी और जौ के बीजों की क्यारी पर कलश स्थापित करें। अखण्ड ज्योति प्रज्वलित करें। प्रथम दिन माँ शैलपुत्री — पर्वतराज की पुत्री — को समर्पित है।',
        sa: 'पूजास्थलं शोधयित्वा वेदिकायां रक्तवस्त्रं विस्तारयेत्। ताम्रकलशे जलं पूरयेत्, मुखे आम्रपत्राणि न्यस्येत्, उपरि रक्तवस्त्रवेष्टितनारिकेलं स्थापयेत्। मृद्यवबीजशय्यायां कलशं स्थापयेत्। अखण्डज्योतिं प्रज्वालयेत्। प्रथमदिनं माशैलपुत्र्यै — गिरिराजसुतायै — समर्पितम्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Day 2 — Brahmacharini Puja', hi: 'द्वितीय दिन — ब्रह्मचारिणी पूजा', sa: 'द्वितीयदिनम् — ब्रह्मचारिणीपूजनम्' },
      description: {
        en: 'Worship Maa Brahmacharini — the austere form of Parvati who performed intense tapas. Offer sugar, fruits, and white flowers. Chant the Durga Beej Mantra 108 times. Maintain the Akhand Jyoti by replenishing ghee/oil.',
        hi: 'माँ ब्रह्मचारिणी — पार्वती के तपस्विनी रूप — की पूजा करें। शक्कर, फल और सफेद फूल अर्पित करें। दुर्गा बीज मन्त्र 108 बार जपें। घी/तेल डालकर अखण्ड ज्योति बनाए रखें।',
        sa: 'माब्रह्मचारिणीं — पार्वत्याः तपस्विनीरूपं — पूजयेत्। शर्करां फलानि श्वेतपुष्पाणि च समर्पयेत्। दुर्गाबीजमन्त्रम् अष्टोत्तरशतवारं जपेत्। घृततैलपूरणेन अखण्डज्योतिं रक्षेत्।',
      },
      mantraRef: 'durga-beej',
      duration: '20 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Day 3 — Chandraghanta Puja', hi: 'तृतीय दिन — चन्द्रघण्टा पूजा', sa: 'तृतीयदिनम् — चन्द्रघण्टापूजनम्' },
      description: {
        en: 'Worship Maa Chandraghanta — adorned with a half-moon bell on her forehead, she destroys evil. Offer milk-based sweets and yellow flowers. Ring a bell during the puja to invoke her grace.',
        hi: 'माँ चन्द्रघण्टा — माथे पर अर्धचन्द्र घण्टी धारिणी, दुष्टों का नाश करने वाली — की पूजा करें। दूध से बनी मिठाई और पीले फूल अर्पित करें। कृपा प्राप्ति हेतु पूजा में घण्टी बजाएँ।',
        sa: 'माचन्द्रघण्टां — ललाटे अर्धचन्द्रघण्टाधारिणीं दुष्टविनाशिनीं — पूजयेत्। क्षीरमिष्टान्नानि पीतपुष्पाणि च समर्पयेत्। कृपाप्राप्त्यर्थं पूजने घण्टां वादयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Day 4 — Kushmanda Puja', hi: 'चतुर्थ दिन — कूष्माण्डा पूजा', sa: 'चतुर्थदिनम् — कूष्माण्डापूजनम्' },
      description: {
        en: 'Worship Maa Kushmanda — the creator of the cosmic egg (Brahmanda) with her smile. Offer malpua (sweet pancake) and petha (pumpkin sweet). She radiates like the sun and bestows cosmic energy.',
        hi: 'माँ कूष्माण्डा — अपनी मुस्कान से ब्रह्माण्ड की रचना करने वाली — की पूजा करें। मालपुआ और पेठा अर्पित करें। वे सूर्य के समान तेजस्वी हैं और ब्रह्माण्डीय ऊर्जा प्रदान करती हैं।',
        sa: 'माकूष्माण्डां — स्मितेन ब्रह्माण्डसृष्टिकर्त्रीं — पूजयेत्। मालपूयं कूष्माण्डमिष्टान्नं च समर्पयेत्। सूर्यवत् तेजस्विनी सा ब्रह्माण्डीयशक्तिं ददाति।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Day 5 — Skandamata Puja', hi: 'पञ्चम दिन — स्कन्दमाता पूजा', sa: 'पञ्चमदिनम् — स्कन्दमातापूजनम्' },
      description: {
        en: 'Worship Maa Skandamata — the mother of Kartikeya (Skanda). Offer bananas and other fruits. She grants wisdom and salvation. Sit in meditation after the puja.',
        hi: 'माँ स्कन्दमाता — कार्तिकेय (स्कन्द) की माता — की पूजा करें। केला और अन्य फल अर्पित करें। वे ज्ञान और मोक्ष प्रदान करती हैं। पूजा के बाद ध्यान में बैठें।',
        sa: 'मास्कन्दमातां — कार्तिकेयस्य (स्कन्दस्य) मातरं — पूजयेत्। कदलीफलानि अन्यफलानि च समर्पयेत्। ज्ञानमोक्षौ ददाति। पूजनानन्तरं ध्यानम् आसीत।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Day 6 — Katyayani Puja', hi: 'षष्ठ दिन — कात्यायनी पूजा', sa: 'षष्ठदिनम् — कात्यायनीपूजनम्' },
      description: {
        en: 'Worship Maa Katyayani — born in the ashrama of sage Katyayana, she is the warrior form who slew Mahishasura. Offer honey and recite the Navarna Mantra. Unmarried girls worship her for a good husband.',
        hi: 'माँ कात्यायनी — ऋषि कात्यायन के आश्रम में जन्मी, महिषासुर का वध करने वाली योद्धा रूप — की पूजा करें। शहद अर्पित करें और नवार्ण मन्त्र पढ़ें। अविवाहित कन्याएँ अच्छे वर के लिए इनकी पूजा करती हैं।',
        sa: 'माकात्यायनीं — कात्यायनमुनेः आश्रमे जातां महिषासुरमर्दिनीं योद्धारूपां — पूजयेत्। मधु समर्पयेत् नवार्णमन्त्रं च पठेत्। अविवाहिताः कन्याः सद्वरप्राप्त्यर्थं तां पूजयन्ति।',
      },
      mantraRef: 'navarna-mantra',
      duration: '20 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Day 7 — Kaalratri Puja & Saraswati Sthapana', hi: 'सप्तम दिन — कालरात्रि पूजा एवं सरस्वती स्थापना', sa: 'सप्तमदिनम् — कालरात्रिपूजनं सरस्वतीस्थापना च' },
      description: {
        en: 'Worship Maa Kaalratri — the fiercest form, dark as night, who destroys ignorance and evil spirits. Offer jaggery or gur. On this day, also perform Saraswati Sthapana by placing books and instruments before the altar for blessing.',
        hi: 'माँ कालरात्रि — सबसे भयंकर रूप, रात्रि के समान श्यामवर्णा, अज्ञान और दुष्ट आत्माओं का नाश करने वाली — की पूजा करें। गुड़ अर्पित करें। इसी दिन सरस्वती स्थापना भी करें — पुस्तकें और वाद्ययन्त्र वेदी के सामने रखें।',
        sa: 'माकालरात्रिं — भयङ्करतमां रात्रिकृष्णवर्णां अज्ञानदुष्टात्मविनाशिनीं — पूजयेत्। गुडं समर्पयेत्। अस्मिन् दिने सरस्वतीस्थापनमपि कुर्यात् — पुस्तकानि वाद्ययन्त्राणि च वेदिकायाः पुरतः स्थापयेत्।',
      },
      duration: '25 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Day 8 — Mahagauri Puja, Ashtami Havan & Kanya Pujan', hi: 'अष्टम दिन — महागौरी पूजा, अष्टमी हवन एवं कन्या पूजन', sa: 'अष्टमदिनम् — महागौरीपूजनम्, अष्टमीहवनं कन्यापूजनं च' },
      description: {
        en: 'Worship Maa Mahagauri — radiant white, the purest form, who fulfils all wishes. Perform the Ashtami Havan with ghee and samagri while chanting the Durga Gayatri. Then perform Kanya Pujan — invite 9 young girls (representing 9 Devi forms), wash their feet, offer tilak, gifts, food, and sweets, and seek their blessings.',
        hi: 'माँ महागौरी — श्वेत तेजस्विनी, सबसे पवित्र रूप, सभी मनोकामनाएँ पूर्ण करने वाली — की पूजा करें। दुर्गा गायत्री मन्त्र के साथ घी और सामग्री से अष्टमी हवन करें। फिर कन्या पूजन करें — 9 कन्याओं (नौ देवी स्वरूप) को आमन्त्रित कर उनके पैर धोएँ, तिलक लगाएँ, उपहार, भोजन और मिठाई दें, और उनका आशीर्वाद लें।',
        sa: 'मामहागौरीं — श्वेततेजस्विनीं पवित्रतमां सर्वमनोरथसिद्धिकरीं — पूजयेत्। दुर्गागायत्रीमन्त्रेण घृतसामग्र्या अष्टमीहवनं कुर्यात्। ततः कन्यापूजनं कुर्यात् — नवकन्याः (नवदेवीस्वरूपाः) आमन्त्र्य तासां पादौ प्रक्षाल्य तिलकं कृत्वा उपहारान् भोजनं मिष्टान्नानि च दत्त्वा तासाम् आशीर्वादं गृह्णीयात्।',
      },
      mantraRef: 'durga-gayatri',
      duration: '60 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 9,
      title: { en: 'Day 9 — Siddhidatri Puja & Navami Havan', hi: 'नवम दिन — सिद्धिदात्री पूजा एवं नवमी हवन', sa: 'नवमदिनम् — सिद्धिदात्रीपूजनं नवमीहवनं च' },
      description: {
        en: 'Worship Maa Siddhidatri — the bestower of all 8 Siddhis (supernatural powers). Perform the final Navami Havan with 108 ahutis (oblations) of ghee. Offer special bhog and sweets. Check the barley sprouts grown in the kalash — tall green sprouts signify a prosperous year.',
        hi: 'माँ सिद्धिदात्री — सभी 8 सिद्धियों (अलौकिक शक्तियों) की दाता — की पूजा करें। 108 आहुतियों के साथ अन्तिम नवमी हवन करें। विशेष भोग और मिठाई अर्पित करें। कलश में उगे जौ के अंकुर देखें — लम्बे हरे अंकुर सम्पन्न वर्ष का संकेत हैं।',
        sa: 'मासिद्धिदात्रीं — सर्वाष्टसिद्धिप्रदायिनीं — पूजयेत्। अष्टोत्तरशतघृताहुतिभिः अन्तिमं नवमीहवनं कुर्यात्। विशेषभोगमिष्टान्नानि च समर्पयेत्। कलशे प्ररूढान् यवाङ्कुरान् पश्येत् — दीर्घहरिताङ्कुराः समृद्धवर्षसूचकाः।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 10,
      title: { en: 'Daily Puja Routine (All 9 Days)', hi: 'दैनिक पूजा विधि (सभी 9 दिन)', sa: 'दैनिकपूजाविधिः (सर्वेषु नवदिनेषु)' },
      description: {
        en: 'Each morning: wake before sunrise, bathe, light fresh incense, offer red flowers and kumkum to the Durga idol, replenish the Akhand Jyoti with ghee, sprinkle water on the barley sprouts, chant the Durga Beej Mantra 108 times, and perform aarti. In the evening, repeat aarti and offer naivedya.',
        hi: 'प्रतिदिन प्रातः: सूर्योदय से पहले उठें, स्नान करें, ताजी अगरबत्ती जलाएँ, दुर्गा मूर्ति पर लाल फूल और कुमकुम अर्पित करें, अखण्ड ज्योति में घी डालें, जौ के अंकुरों पर जल छिड़कें, दुर्गा बीज मन्त्र 108 बार जपें, और आरती करें। सायं पुनः आरती और नैवेद्य अर्पित करें।',
        sa: 'प्रतिदिनं प्रातः — सूर्योदयात् पूर्वम् उत्थाय स्नात्वा नवधूपं प्रज्वाल्य दुर्गामूर्तौ रक्तपुष्पाणि कुङ्कुमं च समर्प्य अखण्डज्योतौ घृतं दत्त्वा यवाङ्कुरेषु जलं सिञ्च्य दुर्गाबीजमन्त्रम् अष्टोत्तरशतवारं जपित्वा आरात्रिकं कुर्यात्। सायं पुनः आरात्रिकं नैवेद्यं च समर्पयेत्।',
      },
      mantraRef: 'durga-beej',
      duration: '30 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 11,
      title: { en: 'Visarjan (Day 10 / Dashami)', hi: 'विसर्जन (दसवाँ दिन / दशमी)', sa: 'विसर्जनम् (दशमदिनम् / दशमी)' },
      description: {
        en: 'On Vijaya Dashami, perform the final aarti and seek forgiveness for any lapses during the 9 days. Remove the coconut from the kalash. Extinguish the Akhand Jyoti. Distribute the barley sprouts as prasad. Immerse the Durga idol in water (if clay) or store reverentially.',
        hi: 'विजयादशमी पर, अन्तिम आरती करें और 9 दिनों में किसी भी त्रुटि के लिए क्षमा माँगें। कलश से नारियल निकालें। अखण्ड ज्योति बुझाएँ। जौ के अंकुर प्रसाद के रूप में वितरित करें। दुर्गा मूर्ति का जल में विसर्जन करें (यदि मिट्टी की हो) अथवा श्रद्धापूर्वक रखें।',
        sa: 'विजयादशम्यां अन्तिमम् आरात्रिकं कृत्वा नवदिनेषु कृतापराधस्य क्षमां याचेत्। कलशात् नारिकेलं निष्कासयेत्। अखण्डज्योतिं निर्वापयेत्। यवाङ्कुरान् प्रसादरूपेण वितरेत्। दुर्गामूर्तिं जले विसृजेत् (मृन्मयीं चेत्) अथवा श्रद्धया संस्थापयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'durga-beej',
      name: { en: 'Durga Beej Mantra', hi: 'दुर्गा बीज मन्त्र', sa: 'दुर्गाबीजमन्त्रः' },
      devanagari: 'ॐ दुं दुर्गायै नमः',
      iast: 'oṃ duṃ durgāyai namaḥ',
      meaning: {
        en: 'Salutations to Goddess Durga, the invincible one who removes all suffering',
        hi: 'अजेय देवी दुर्गा को नमन, जो सभी कष्टों का निवारण करती हैं',
        sa: 'अपराजितायै सर्वदुःखनिवारिण्यै दुर्गादेव्यै नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Primary beej mantra for daily Navaratri puja — chant 108 times each morning',
        hi: 'दैनिक नवरात्रि पूजा का मुख्य बीज मन्त्र — प्रतिदिन प्रातः 108 बार जपें',
        sa: 'दैनिकनवरात्रिपूजायाः प्रधानबीजमन्त्रः — प्रतिप्रातः अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'navarna-mantra',
      name: { en: 'Navarna Mantra (Nine-Syllable Mantra)', hi: 'नवार्ण मन्त्र (नौ अक्षर मन्त्र)', sa: 'नवार्णमन्त्रः (नवाक्षरमन्त्रः)' },
      devanagari: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
      iast: 'oṃ aiṃ hrīṃ klīṃ cāmuṇḍāyai vicce',
      meaning: {
        en: 'Om — the primordial sound; Aim — Saraswati beej; Hreem — Lakshmi beej; Kleem — Kali beej; salutations to Chamunda — the slayer of Chanda and Munda',
        hi: 'ॐ — आदि ध्वनि; ऐं — सरस्वती बीज; ह्रीं — लक्ष्मी बीज; क्लीं — काली बीज; चामुण्डा — चण्ड-मुण्ड संहारिणी — को नमन',
        sa: 'ॐ — प्रणवः; ऐं — सरस्वतीबीजम्; ह्रीं — लक्ष्मीबीजम्; क्लीं — कालीबीजम्; चण्डमुण्डसंहारिण्यै चामुण्डायै नमः',
      },
      japaCount: 108,
      usage: {
        en: 'The most powerful Durga mantra from Durga Saptashati — chant 108 times daily during Navaratri',
        hi: 'दुर्गा सप्तशती का सबसे शक्तिशाली दुर्गा मन्त्र — नवरात्रि में प्रतिदिन 108 बार जपें',
        sa: 'दुर्गासप्तशत्याः शक्तिशालिदुर्गामन्त्रः — नवरात्रौ प्रतिदिनम् अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'durga-gayatri',
      name: { en: 'Durga Gayatri Mantra', hi: 'दुर्गा गायत्री मन्त्र', sa: 'दुर्गागायत्रीमन्त्रः' },
      devanagari: 'ॐ कात्यायनाय विद्महे कन्यकुमारि धीमहि तन्नो दुर्गिः प्रचोदयात्',
      iast: 'oṃ kātyāyanāya vidmahe kanyakumāri dhīmahi tanno durgiḥ pracodayāt',
      meaning: {
        en: 'We meditate upon Katyayani. May that virgin Goddess illuminate our intellect. May Durga inspire and guide us.',
        hi: 'हम कात्यायनी का ध्यान करते हैं। वह कन्या देवी हमारी बुद्धि को प्रकाशित करें। दुर्गा हमें प्रेरित और मार्गदर्शित करें।',
        sa: 'कात्यायनीं विद्मः। कन्यकुमारीं धीमहि। दुर्गिः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Chant during the Ashtami Havan — 108 times with each ghee oblation',
        hi: 'अष्टमी हवन के दौरान जपें — प्रत्येक घी की आहुति के साथ 108 बार',
        sa: 'अष्टमीहवने जपेत् — प्रतिघृताहुत्या अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'mahishasura-mardini',
      name: { en: 'Mahishasura Mardini Stotram (Verse)', hi: 'महिषासुरमर्दिनी स्तोत्रम् (श्लोक)', sa: 'महिषासुरमर्दिनीस्तोत्रम् (श्लोकः)' },
      devanagari: 'जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते',
      iast: 'jaya jaya he mahiṣāsuramardini ramyakapardini śailasute',
      meaning: {
        en: 'Victory, victory to you, O slayer of the buffalo demon Mahishasura, O one with beautiful braided hair, O daughter of the mountain!',
        hi: 'जय जय हे महिषासुर का वध करने वाली, सुन्दर जटाओं वाली, पर्वतपुत्री!',
        sa: 'जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते!',
      },
      usage: {
        en: 'Refrain verse from the Mahishasura Mardini Stotram — recite during evening aarti on all 9 days',
        hi: 'महिषासुरमर्दिनी स्तोत्र का स्थायी — सभी 9 दिनों की सन्ध्या आरती में पढ़ें',
        sa: 'महिषासुरमर्दिनीस्तोत्रस्य ध्रुवपदम् — सर्वेषु नवदिनेषु सन्ध्यारात्रिके पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Durga Saptashati (700 Verses)', hi: 'दुर्गा सप्तशती (700 श्लोक)', sa: 'दुर्गासप्तशती (सप्तशतश्लोकाः)' },
      verseCount: 700,
      duration: '90 min',
      note: {
        en: 'The primary scripture for Navaratri. Ideally recite all 13 chapters over 9 days. Can be divided: Ch 1 on Day 1, Ch 2-4 on Days 2-4, Ch 5-8 on Days 5-8, Ch 9-13 on Day 9.',
        hi: 'नवरात्रि का प्रमुख ग्रन्थ। आदर्श रूप से 9 दिनों में सभी 13 अध्याय पढ़ें। विभाजन: अध्याय 1 दिन 1, अध्याय 2-4 दिन 2-4, अध्याय 5-8 दिन 5-8, अध्याय 9-13 दिन 9 पर।',
        sa: 'नवरात्रेः प्रधानग्रन्थः। नवदिनेषु सर्वान् त्रयोदशाध्यायान् पठेत्। विभागः — अध्यायः १ दिने १, अध्यायाः २-४ दिनेषु २-४, अध्यायाः ५-८ दिनेषु ५-८, अध्यायाः ९-१३ दिने ९।',
      },
    },
    {
      name: { en: 'Mahishasura Mardini Stotram', hi: 'महिषासुरमर्दिनी स्तोत्रम्', sa: 'महिषासुरमर्दिनीस्तोत्रम्' },
      verseCount: 21,
      duration: '10 min',
      note: {
        en: 'A popular devotional hymn attributed to Adi Shankaracharya. Recite during the evening aarti.',
        hi: 'आदि शंकराचार्य को प्रायः समर्पित एक लोकप्रिय भक्ति स्तोत्र। सन्ध्या आरती में पढ़ें।',
        sa: 'आदिशङ्कराचार्यकृतं प्रसिद्धं भक्तिस्तोत्रम्। सन्ध्यारात्रिके पठेत्।',
      },
    },
  ],

  aarti: {
    name: { en: 'Jai Ambe Gauri', hi: 'जय अम्बे गौरी', sa: 'जय अम्बे गौरी' },
    devanagari:
      'जय अम्बे गौरी, मैया जय श्यामा गौरी।\nतुमको निशिदिन ध्यावत, हरि ब्रह्मा शिवरी॥\nजय अम्बे गौरी॥\n\nमां ब्रह्माणी मां ईश्वरी, मां शिवा शंकरी।\nजगजननी जगदम्बा, मां अम्बा परमेश्वरी॥\nजय अम्बे गौरी॥\n\nतेरे भक्त जनों पर मैया, कृपा करो भारी।\nतुम बिन कौन हमारा, तुम हो महतारी॥\nजय अम्बे गौरी॥\n\nकानों में कुण्डल शोभित, नासा में मोती।\nकोटिक चन्द्र दिवाकर, सम राजत ज्योती॥\nजय अम्बे गौरी॥\n\nशेरो पर सवारी, कृपा करो महारानी।\nत्रिभुवन के स्वामिनि, तू ही हैं गुणखानी॥\nजय अम्बे गौरी॥',
    iast:
      'jaya ambe gaurī, maiyā jaya śyāmā gaurī |\ntumako niśidina dhyāvata, hari brahmā śivarī ||\njaya ambe gaurī ||\n\nmāṃ brahmāṇī māṃ īśvarī, māṃ śivā śaṅkarī |\njagajananī jagadambā, māṃ ambā parameśvarī ||\njaya ambe gaurī ||\n\ntere bhakta janõ para maiyā, kṛpā karo bhārī |\ntuma bina kauna hamārā, tuma ho mahatārī ||\njaya ambe gaurī ||\n\nkānõ meṃ kuṇḍala śobhita, nāsā meṃ motī |\nkoṭika candra divākara, sama rājata jyotī ||\njaya ambe gaurī ||\n\nśero para savārī, kṛpā karo mahārānī |\ntribhuvana ke svāminī, tū hī hai guṇakhānī ||\njaya ambe gaurī ||',
  },

  naivedya: {
    en: 'Halwa, poori, chana (chickpea curry), kheer, fresh fruits, coconut, seasonal sweets, and special prasad for Kanya Pujan including poori-chana and halwa',
    hi: 'हलवा, पूरी, चने, खीर, ताजे फल, नारियल, मौसमी मिठाई, और कन्या पूजन के लिए विशेष प्रसाद — पूरी-चने और हलवा',
    sa: 'हल्वा, पूरिका, चणकव्यञ्जनम्, पायसम्, नवफलानि, नारिकेलम्, ऋतुमिष्टान्नानि, कन्यापूजनार्थं विशेषप्रसादः — पूरिकाचणकं हल्वा च',
  },

  precautions: [
    {
      en: 'The Akhand Jyoti (eternal lamp) must not extinguish during all 9 days — keep sufficient ghee/oil and a windshield around it',
      hi: 'अखण्ड ज्योति सभी 9 दिनों में बुझनी नहीं चाहिए — पर्याप्त घी/तेल और हवा से बचाव रखें',
      sa: 'अखण्डज्योतिः सर्वेषु नवदिनेषु न निर्वापणीया — पर्याप्तघृततैलं वायुरक्षणं च कुर्यात्',
    },
    {
      en: 'Consume only sattvik food during the 9 days — no non-vegetarian food, no alcohol, no onion, no garlic',
      hi: 'नौ दिनों में केवल सात्विक भोजन करें — माँसाहार, मद्य, प्याज और लहसुन वर्जित हैं',
      sa: 'नवदिनेषु सात्त्विकम् आहारमेव सेवेत — मांसं मद्यं पलाण्डुं लशुनं च वर्जयेत्',
    },
    {
      en: 'Do not cut hair or nails during Navaratri',
      hi: 'नवरात्रि में बाल या नाखून न काटें',
      sa: 'नवरात्रौ केशनखच्छेदनं न कुर्यात्',
    },
    {
      en: 'Maintain celibacy and purity of mind and body throughout the 9 days',
      hi: 'नौ दिनों में ब्रह्मचर्य और मन-शरीर की शुद्धता बनाए रखें',
      sa: 'नवदिनेषु ब्रह्मचर्यं मनःशरीरशुद्धिं च पालयेत्',
    },
    {
      en: 'Ensure the barley sown on Day 1 is sprinkled with water daily — do not let the soil dry out',
      hi: 'प्रथम दिन बोए गए जौ पर प्रतिदिन जल छिड़कें — मिट्टी सूखने न दें',
      sa: 'प्रथमदिने वपिताः यवाः प्रतिदिनं जलेन सिच्यन्ताम् — मृत्तिकां शुष्कां न भवेत्',
    },
  ],

  phala: {
    en: 'Destruction of evil forces and negative energies, attainment of Shakti (divine feminine power), fulfilment of wishes, protection from enemies, prosperity and success in all endeavours, and the grace of all nine forms of Goddess Durga',
    hi: 'दुष्ट शक्तियों और नकारात्मक ऊर्जाओं का नाश, शक्ति (दिव्य स्त्री शक्ति) की प्राप्ति, मनोकामनाओं की पूर्ति, शत्रुओं से रक्षा, सभी कार्यों में समृद्धि और सफलता, तथा देवी दुर्गा के नौ रूपों की कृपा',
    sa: 'दुष्टशक्तिनकारात्मकशक्तीनां विनाशः, शक्तिप्राप्तिः, मनोरथसिद्धिः, शत्रुभ्यो रक्षा, सर्वकार्येषु समृद्धिसिद्धिः, श्रीदुर्गायाः नवस्वरूपाणां कृपा च',
  },

  visarjan: {
    en: 'On Vijaya Dashami (Day 10), immerse the clay Durga idol in a river, lake, or large water body. If using a permanent idol, symbolically touch it to water and return it to the altar.',
    hi: 'विजयादशमी (दसवें दिन) पर मिट्टी की दुर्गा मूर्ति को नदी, तालाब या बड़े जलाशय में विसर्जित करें। स्थायी मूर्ति हो तो प्रतीकात्मक रूप से जल स्पर्श कराकर वापस वेदी पर रखें।',
    sa: 'विजयादशम्यां मृन्मयीं दुर्गामूर्तिं नद्यां सरसि महाजलाशये वा विसृजेत्। स्थायीमूर्तिं चेत् प्रतीकात्मकं जलस्पर्शं कृत्वा पुनः वेदिकायां स्थापयेत्।',
  },
};

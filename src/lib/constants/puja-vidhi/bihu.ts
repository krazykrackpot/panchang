import type { PujaVidhi } from './types';

export const BIHU_PUJA: PujaVidhi = {
  festivalSlug: 'bihu',
  category: 'festival',
  deity: { en: 'Agni (Fire God) & Lakshmi', hi: 'अग्नि एवं लक्ष्मी', sa: 'अग्निः लक्ष्मीश्च' },

  samagri: [
    { name: { en: 'Meji (bonfire structure of bamboo, thatch, hay)', hi: 'मेजी (बाँस, छप्पर, भूसे की अलाव संरचना)', sa: 'मेजी (वंशतृणभूषसंरचना)' }, category: 'other', essential: true },
    { name: { en: 'Til Pitha (sesame rice cake)', hi: 'तिल पीठा (तिल चावल केक)', sa: 'तिलपीठा (तिलतण्डुलपिष्टकम्)' }, category: 'food', essential: true },
    { name: { en: 'Laru (sesame and coconut ladoo)', hi: 'लारु (तिल और नारियल लड्डू)', sa: 'लारु (तिलनारिकेलमोदकम्)' }, category: 'food', essential: true },
    { name: { en: 'Jolpan (flattened rice, curd, jaggery)', hi: 'जलपान (चिड़वा, दही, गुड़)', sa: 'जल्पानम् (पृथुकं दधि गुडम्)' }, category: 'food', essential: true },
    { name: { en: 'Narikol laru (coconut ladoo)', hi: 'नारिकल लारु (नारियल लड्डू)', sa: 'नारिकेललारु (नारिकेलमोदकम्)' }, category: 'food', essential: true },
    { name: { en: 'Rice beer (traditional Assamese)', hi: 'चावल की शराब (पारम्परिक असमिया)', sa: 'तण्डुलमद्यम् (पारम्परिकम् आसामीयम्)' }, category: 'food', essential: false },
    { name: { en: 'Gamosa (Assamese traditional towel/scarf)', hi: 'गमोसा (असमिया पारम्परिक तौलिया/दुपट्टा)', sa: 'गमोसा (आसामीयपारम्परिकवस्त्रम्)' }, category: 'clothing', essential: true },
    { name: { en: 'Dhol and Pepa (drum and buffalo horn pipe)', hi: 'ढोल और पेपा (नगाड़ा और भैंस के सींग की बाँसुरी)', sa: 'ढोलः पेपा च (दुन्दुभिः महिषशृङ्गवंशी च)' }, category: 'other', essential: false },
    { name: { en: 'Mustard oil lamp', hi: 'सरसों तेल का दीपक', sa: 'सर्षपतैलदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Betel nut and betel leaves', hi: 'सुपारी और पान के पत्ते', sa: 'पूगीफलं ताम्बूलपत्राणि च' }, category: 'puja_items', essential: true },
    { name: { en: 'Banana leaves', hi: 'केले के पत्ते', sa: 'कदलीपत्राणि' }, category: 'other', essential: false },
    { name: { en: 'Fresh flowers (seasonal)', hi: 'ताज़े फूल (मौसमी)', sa: 'नवपुष्पाणि (ऋतुजानि)' }, category: 'flowers', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Bihu is celebrated three times a year in Assam: Rongali Bihu (Bohag Bihu) in mid-April marks the Assamese new year and spring harvest — the most festive. Kongali Bihu (Kati Bihu) in mid-October is a sombre prayer for good harvest during the lean season. Bhogali Bihu (Magh Bihu) in mid-January is the harvest thanksgiving festival. Bohag Bihu celebrations span 7 days. The Meji bonfire is lit at dawn on Bhogali Bihu (Uruka night is the eve). Rituals begin at sunrise.',
    hi: 'बिहू असम में वर्ष में तीन बार मनाया जाता है: रोंगाली बिहू (बोहाग बिहू) अप्रैल मध्य में असमिया नववर्ष और वसन्त फसल का प्रतीक — सबसे उत्सवपूर्ण। कोंगाली बिहू (कटि बिहू) अक्टूबर मध्य में अभाव के मौसम में अच्छी फसल की गम्भीर प्रार्थना। भोगाली बिहू (माघ बिहू) जनवरी मध्य में फसल धन्यवाद उत्सव। बोहाग बिहू 7 दिनों तक चलता है। मेजी अलाव भोगाली बिहू (उरुका रात पूर्व सन्ध्या है) पर भोर में जलाया जाता है।',
    sa: 'बिहू आसामे वर्षे त्रिवारम् आचर्यते: रोङ्गालीबिहू (बोहागबिहू) अप्रैलमध्ये आसामीयनववर्षं वसन्तसस्योत्सवं च — सर्वोत्सवपूर्णम्। कोङ्गालीबिहू (कटिबिहू) अक्टोबरमध्ये अभावकाले सुसस्यार्थं गम्भीरप्रार्थना। भोगालीबिहू (माघबिहू) जनवरीमध्ये सस्यधन्यवादोत्सवः। बोहागबिहू सप्तदिनान् व्याप्नोति। मेजी अग्निहोत्रं भोगालीबिहूदिने (उरुकारात्रिः पूर्वसन्ध्या) प्रभाते प्रज्वाल्यते।',
  },
  muhurtaWindow: { type: 'brahma_muhurta' },

  sankalpa: {
    en: 'On this auspicious day of Bihu, I offer my gratitude to Agni Devata and Mother Earth for the bountiful harvest. I pray for prosperity, good health, and community harmony in the coming season. I honour the rich agricultural heritage of Assam and celebrate the eternal cycle of nature — sowing, growing, and harvesting.',
    hi: 'इस शुभ बिहू दिवस पर, मैं भरपूर फसल के लिए अग्नि देवता और धरती माता को कृतज्ञता अर्पित करता/करती हूँ। आगामी ऋतु में समृद्धि, स्वास्थ्य और सामुदायिक सद्भाव की प्रार्थना करता/करती हूँ। मैं असम की समृद्ध कृषि विरासत का सम्मान करता/करती हूँ और प्रकृति के शाश्वत चक्र — बुवाई, उगाई और कटाई — का उत्सव मनाता/मनाती हूँ।',
    sa: 'अस्मिन् शुभे बिहूदिने समृद्धसस्यार्थम् अग्निदेवताम् पृथिवीमातरं च कृतज्ञतां समर्पयामि। आगामिन्यां ऋतौ समृद्धिस्वास्थ्यसामुदायिकसौहार्दार्थं प्रार्थयामि। आसामस्य समृद्धां कृषिपरम्परां सम्मानयामि प्रकृतेः शाश्वतचक्रम् — वपनं वर्धनं लवनं च — उत्सवयामि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Uruka Night — Community Feast (Bhogali Bihu)', hi: 'उरुका रात — सामुदायिक भोज (भोगाली बिहू)', sa: 'उरुकारात्रिः — सामुदायिकभोजनम् (भोगालीबिहू)' },
      description: {
        en: 'On the eve of Bhogali Bihu, the community gathers in open fields. Young men build the Meji — a tall conical structure of bamboo poles, dried banana leaves, hay, and thatch. Beside it, they build the Bhelaghar — a temporary communal hut of bamboo and thatch where the community feasts together through the night. A grand feast (bhoj) is prepared with traditional Assamese dishes. Singing, folk tales, and Bihu songs continue until dawn. This night epitomizes Assamese community bonding.',
        hi: 'भोगाली बिहू की पूर्व सन्ध्या पर समुदाय खुले मैदानों में एकत्र होता है। युवक मेजी बनाते हैं — बाँस के खम्भों, सूखे केले के पत्तों, भूसे और छप्पर से बनी ऊँची शंकुकार संरचना। उसके बगल में भेलाघर बनाते हैं — बाँस और छप्पर की अस्थायी सामुदायिक झोपड़ी जहाँ समुदाय रात भर एकत्र होकर भोजन करता है। पारम्परिक असमिया व्यञ्जनों के साथ भव्य भोज तैयार होता है। गायन, लोककथाएँ और बिहू गीत भोर तक चलते हैं।',
        sa: 'भोगालीबिहोः पूर्वसन्ध्यायां समुदायः मुक्तक्षेत्रेषु एकत्र मिलति। युवकाः मेजीं निर्मान्ति — वंशदण्डैः शुष्ककदलीपत्रैः तृणैः छदिषा च निर्मितां शंकुकारसंरचनाम्। तत्पार्श्वे भेलाघरं निर्मान्ति — वंशच्छदिषनिर्मितं तात्कालिकसामुदायिककुटीरं यत्र समुदायः रात्रौ सर्वत्र एकत्र भुङ्क्ते। पारम्परिकैः आसामीयव्यञ्जनैः भव्यभोजनं सज्जयन्ति। गायनं लोककथाः बिहूगीतानि च प्रभातपर्यन्तं प्रवर्तन्ते।',
      },
      duration: '180 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Meji Lighting — Sacred Bonfire at Dawn', hi: 'मेजी प्रज्वलन — भोर में पवित्र अलाव', sa: 'मेजीप्रज्वालनम् — प्रभाते पवित्राग्निहोत्रम्' },
      description: {
        en: 'At the first light of dawn, the community gathers around the Meji. The eldest member or the village headman lights the bonfire. Everyone offers prayers to Agni Devata (Fire God), tossing rice, betel nut, and pieces of food into the flames as offerings. The Meji fire symbolizes the destruction of evil, the warmth of community spirit, and prayers for a good harvest. As the Meji burns, people take a ritual bath in the nearby river or pond. After the bath, they offer prayers facing east to the rising Sun.',
        hi: 'भोर की पहली किरण पर समुदाय मेजी के चारों ओर एकत्र होता है। सबसे बड़े सदस्य या गाँव के मुखिया अलाव जलाते हैं। सभी अग्नि देवता को प्रार्थना करते हुए चावल, सुपारी और भोजन के टुकड़े ज्वालाओं में अर्पित करते हैं। मेजी अग्नि बुराई के विनाश, सामुदायिक भावना की ऊष्मा और अच्छी फसल की प्रार्थना का प्रतीक है। मेजी जलते समय लोग निकट की नदी या तालाब में स्नान करते हैं। स्नान के बाद पूर्व की ओर उगते सूर्य को प्रणाम करते हैं।',
        sa: 'प्रभातस्य प्रथमप्रकाशे समुदायः मेज्याः परितः एकत्र मिलति। ज्येष्ठसदस्यः ग्रामाधिपो वा अग्निहोत्रं प्रज्वालयति। सर्वे अग्निदेवतां प्रार्थयन्ति तण्डुलान् पूगीफलं अन्नखण्डानि च ज्वालासु अर्पयन्ति। मेज्यग्निः पापनाशस्य सामुदायिकभावनोष्मणः सुसस्यप्रार्थनायाश्च प्रतीकम्। मेजी दह्यमाने जनाः समीपनद्यां सरसि वा विधिस्नानं कुर्वन्ति। स्नानानन्तरं पूर्वाभिमुखाः उदयमानसूर्यं प्रणमन्ति।',
      },
      mantraRef: 'agni-bihu',
      duration: '30 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Goru Bihu — Honouring Cattle (Day 1 of Bohag Bihu)', hi: 'गोरु बिहू — पशुधन का सम्मान (बोहाग बिहू दिन 1)', sa: 'गोरुबिहू — पशुसम्मानम् (बोहागबिहोः प्रथमदिनम्)' },
      description: {
        en: 'The first day of Rongali/Bohag Bihu is Goru Bihu, dedicated to cattle. Early morning, cattle are taken to the nearest river or pond. They are bathed, scrubbed clean, and their horns are painted with bright colours. Laau (bottle gourd), bengena (brinjal), and halodhi (turmeric) are tied around their necks. Cattle are fed special rice cakes and their favourite foods. The owner recites: "Lau khaa, bengena khaa, bossore bossore barhi jaa" (Eat gourd, eat brinjal, grow and thrive year after year). This day expresses deep gratitude to the animals that sustain agricultural life.',
        hi: 'रोंगाली/बोहाग बिहू का पहला दिन गोरु बिहू है, पशुधन को समर्पित। सुबह-सुबह पशुओं को निकटतम नदी या तालाब में ले जाते हैं। उन्हें नहलाकर साफ करते हैं और सींगों पर चमकीले रंग लगाते हैं। लाउ (लौकी), बैंगन और हल्दी उनके गले में बाँधते हैं। पशुओं को विशेष चावल केक और उनका पसन्दीदा भोजन खिलाते हैं। मालिक कहता है: "लाउ खा, बैंगन खा, बस्सोरे बस्सोरे बड़ि जा" (लौकी खाओ, बैंगन खाओ, साल-दर-साल बढ़ते जाओ)। यह दिन कृषि जीवन को सम्भालने वाले पशुओं के प्रति गहरी कृतज्ञता व्यक्त करता है।',
        sa: 'रोङ्गाली/बोहागबिहोः प्रथमदिनं गोरुबिहू पशुभ्यः समर्पितम्। प्रातः पशून् समीपतमां नदीं सरो वा नयन्ति। तान् स्नापयित्वा मार्जयित्वा शृङ्गाणि उज्ज्वलवर्णैः चित्रयन्ति। अलाबुं वार्ताकं हरिद्रां च तेषां कण्ठे बध्नन्ति। पशुभ्यः विशेषतण्डुलपिष्टकानि प्रियान्नानि च भोजयन्ति। स्वामी वदति: "लाउ खा बेङ्गेना खा बस्सोरे बस्सोरे बड़ि जा" (अलाबुं खाद वार्ताकं खाद वर्षे वर्षे वर्धस्व)। इदं दिनं कृषिजीवनं पालयतां पशूनां प्रति गहनां कृतज्ञतां व्यनक्ति।',
      },
      duration: '60 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Manuh Bihu — Human Celebration (Day 2 of Bohag Bihu)', hi: 'मानुह बिहू — मानव उत्सव (बोहाग बिहू दिन 2)', sa: 'मानुहबिहू — मानवोत्सवः (बोहागबिहोः द्वितीयदिनम्)' },
      description: {
        en: 'The second day is Manuh Bihu (Human Bihu) — the Assamese New Year day. Everyone bathes early and wears new Assamese traditional attire — men wear dhoti and kurta with a gamosa, women wear the exquisite Mekhela Chador (Assamese silk saree). Younger members seek blessings from elders by touching their feet. Gamosas (hand-woven towels symbolising respect) are exchanged. A special puja is performed at the home altar — light lamps, offer flowers, akshat, and sweets, and pray for family well-being. This is also a day for visiting relatives and strengthening community bonds.',
        hi: 'दूसरा दिन मानुह बिहू (मानव बिहू) है — असमिया नववर्ष दिवस। सभी सुबह स्नान कर नई असमिया पारम्परिक वेशभूषा पहनते हैं — पुरुष धोती-कुर्ता गमोसा के साथ, महिलाएँ भव्य मेखेला चादर (असमिया रेशमी साड़ी) पहनती हैं। छोटे सदस्य बड़ों के पैर छूकर आशीर्वाद लेते हैं। गमोसा (सम्मान का प्रतीक हाथ से बुना तौलिया) का आदान-प्रदान होता है। घर की वेदी पर विशेष पूजा होती है — दीपक जलाएँ, फूल, अक्षत और मिठाई अर्पित करें, परिवार के कल्याण की प्रार्थना करें। यह रिश्तेदारों से मिलने और सामुदायिक बन्धन मजबूत करने का भी दिन है।',
        sa: 'द्वितीयदिनं मानुहबिहू (मानवबिहू) — आसामीयनववर्षदिनम्। सर्वे प्रातः स्नात्वा नवम् आसामीयपारम्परिकवेषं धारयन्ति — पुरुषाः धोतीकुर्तां गमोसासहितं स्त्रियः भव्यं मेखेलाचादरम् (आसामीयकौशेयवस्त्रम्) धारयन्ति। कनिष्ठसदस्याः ज्येष्ठानां चरणौ स्पृशन्तः आशीर्वादं गृह्णन्ति। गमोसाः (सम्मानप्रतीकानि हस्ततन्तवस्त्राणि) परस्परं विनिमयन्ते। गृहवेदिकायां विशेषपूजा क्रियते — दीपान् प्रज्वालयेत् पुष्पाणि अक्षतान् मिष्टान्नानि च अर्पयेत् कुटुम्बकल्याणार्थं प्रार्थयेत्।',
      },
      duration: '120 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Kati Bihu — Lighting the Akash Banti', hi: 'कटि बिहू — आकाश बन्ती जलाना', sa: 'कटिबिहू — आकाशदीपप्रज्वालनम्' },
      description: {
        en: 'Kongali (Kati) Bihu falls in mid-October when the paddy is still growing and the granary is at its leanest. The main ritual is lighting earthen lamps (Akash Banti) on tall bamboo poles in the paddy fields and at the tulsi (holy basil) plant near the house. Women light these lamps at dusk, praying to Lakshmi for protection of the growing crop. No feasting on this Bihu — it is a time of austerity and prayer. The Akash Banti guides the souls of departed ancestors and invokes divine protection over the vulnerable crop.',
        hi: 'कोंगाली (कटि) बिहू अक्टूबर मध्य में आता है जब धान अभी बढ़ रहा होता है और भण्डार सबसे कम होता है। मुख्य अनुष्ठान खेतों में ऊँचे बाँस के खम्भों पर और घर के पास तुलसी के पौधे पर मिट्टी के दीपक (आकाश बन्ती) जलाना है। महिलाएँ शाम को ये दीपक जलाती हैं, बढ़ती फसल की रक्षा के लिए लक्ष्मी से प्रार्थना करती हैं। इस बिहू में भोज नहीं — यह तपस्या और प्रार्थना का समय है। आकाश बन्ती पूर्वजों की आत्माओं का मार्गदर्शन करती है और कमजोर फसल पर दैवी सुरक्षा का आवाहन करती है।',
        sa: 'कोङ्गालीबिहू (कटिबिहू) अक्टोबरमध्ये आगच्छति यदा धान्यम् अद्यापि वर्धते कोषश्च न्यूनतमः। प्रधानम् अनुष्ठानं क्षेत्रेषु उच्चवंशदण्डेषु गृहसमीपतुलसीसस्ये च मृत्तिकादीपान् (आकाशदीपान्) प्रज्वालनम्। स्त्रियः सायं दीपान् प्रज्वालयन्ति वर्धमानसस्यरक्षार्थं लक्ष्मीं प्रार्थयन्ति। अस्मिन् बिहू भोजनोत्सवो नास्ति — तपस्याप्रार्थनाकालः। आकाशदीपः प्रेतानां पूर्वजानां मार्गदर्शनं करोति असुरक्षितसस्योपरि दैवीरक्षाम् आवाहयति च।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'meditation',
    },
    {
      step: 6,
      title: { en: 'Bihu Dance & Musical Celebration', hi: 'बिहू नृत्य एवं संगीत उत्सव', sa: 'बिहूनृत्यं सङ्गीतोत्सवश्च' },
      description: {
        en: 'The Bihu folk dance is the soul of Rongali Bihu. Young men and women gather in open fields performing the energetic Bihu dance to the rhythm of the Dhol (drum), Pepa (buffalo horn pipe), Gogona (bamboo instrument), and Toka (bamboo clapper). The dance movements imitate nature — birds, rivers, and the swaying of rice fields. Bihu songs (Bihugeet) are romantic, celebrating youth, love, nature, and the joy of spring. Husori groups go house to house singing blessings. This celebration continues for up to seven days.',
        hi: 'बिहू लोक नृत्य रोंगाली बिहू की आत्मा है। युवक-युवतियाँ खुले मैदानों में ढोल (नगाड़ा), पेपा (भैंस के सींग की बाँसुरी), गोगोना (बाँस का वाद्य) और टोका (बाँस का खड़खड़ा) की लय पर ऊर्जावान बिहू नृत्य करते हैं। नृत्य की गतिविधियाँ प्रकृति की नकल करती हैं — पक्षी, नदियाँ और धान के खेतों का लहराना। बिहू गीत (बिहूगीत) रोमांटिक होते हैं, युवा, प्रेम, प्रकृति और वसन्त के आनन्द का उत्सव। हुसोरी दल घर-घर जाकर आशीर्वाद के गीत गाते हैं। यह उत्सव सात दिनों तक चलता है।',
        sa: 'बिहूलोकनृत्यं रोङ्गालीबिहोः आत्मा। युवकयुवत्यः मुक्तक्षेत्रेषु ढोलस्य (दुन्दुभेः) पेपायाः (महिषशृङ्गवंश्याः) गोगोनायाः (वंशवाद्यस्य) टोकायाः (वंशघट्टनस्य) च तालेन ऊर्जावत् बिहूनृत्यं कुर्वन्ति। नृत्यचालनानि प्रकृतिम् अनुकुर्वन्ति — पक्षिणः नद्यः धान्यक्षेत्राणां दोलनं च। बिहूगीतानि रोमाञ्चकानि यौवनप्रेमप्रकृतिवसन्तानन्दोत्सवात्मकानि। हुसोरीवृन्दाः गृहे गृहे गत्वा आशीर्वादगीतानि गायन्ति। उत्सवः सप्तदिनानि प्रवर्तते।',
      },
      duration: '120 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 7,
      title: { en: 'Prasad Distribution & Community Sharing', hi: 'प्रसाद वितरण एवं सामुदायिक बँटवारा', sa: 'प्रसादवितरणं सामुदायिकवितरणं च' },
      description: {
        en: 'Distribute Til Pitha, Laru, Jolpan, and other Bihu specialties to all family members, neighbours, and visitors. Share generously — Bihu is about community abundance and collective joy. Elders bless the younger generation. Exchange gamosas as tokens of respect and affection. In the evening, families gather for a traditional Assamese meal served on banana leaves featuring fish curry, duck curry, pithas, and rice.',
        hi: 'तिल पीठा, लारु, जलपान और अन्य बिहू विशेषताएँ सभी परिवारजनों, पड़ोसियों और आगन्तुकों को वितरित करें। उदारतापूर्वक बाँटें — बिहू सामुदायिक समृद्धि और सामूहिक आनन्द के बारे में है। बड़े-बुज़ुर्ग युवा पीढ़ी को आशीर्वाद देते हैं। सम्मान और स्नेह के प्रतीक के रूप में गमोसा का आदान-प्रदान करें। शाम को परिवार केले के पत्तों पर परोसे गए पारम्परिक असमिया भोजन — मछली करी, बत्तख करी, पीठा और चावल — के लिए एकत्र होते हैं।',
        sa: 'तिलपीठां लारु जल्पानम् अन्यानि बिहूविशेषाणि च सर्वेभ्यः कुटुम्बिभ्यः पार्श्ववासिभ्यः आगन्तुकेभ्यश्च वितरेत्। औदार्येण वितरेत् — बिहू सामुदायिकसमृद्ध्याः सामूहिकानन्दस्य च विषये। ज्येष्ठाः युवपीढीम् आशिषन्ति। सम्मानस्नेहप्रतीकरूपेण गमोसाः विनिमयन्ते। सायं कुटुम्बाः कदलीपत्रेषु परिवेषितं पारम्परिकम् आसामीयभोजनम् — मत्स्यव्यञ्जनं वातकव्यञ्जनं पीठाः तण्डुलं च — भोक्तुम् एकत्र मिलन्ति।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'agni-bihu',
      name: { en: 'Agni Mantra (for Meji)', hi: 'अग्नि मन्त्र (मेजी हेतु)', sa: 'अग्निमन्त्रः (मेज्यर्थम्)' },
      devanagari: 'ॐ अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्।\nहोतारं रत्नधातमम्॥',
      iast: 'oṃ agnimīḷe purohitaṃ yajñasya devamṛtvijam |\nhotāraṃ ratnadhātamam ||',
      meaning: {
        en: 'I praise Agni, the household priest, the divine minister of the sacrifice, the invoker who bestows treasures upon us. (Rig Veda 1.1.1)',
        hi: 'मैं अग्नि की स्तुति करता हूँ, गृह पुरोहित, यज्ञ के दिव्य मन्त्री, हमें रत्न प्रदान करने वाले होता। (ऋग्वेद 1.1.1)',
        sa: 'अग्निम् ईळे पुरोहितं यज्ञस्य देवम् ऋत्विजं होतारं रत्नधातमम्। (ऋग्वेदः १.१.१)',
      },
      usage: {
        en: 'Chant while lighting the Meji bonfire on Bhogali Bihu morning',
        hi: 'भोगाली बिहू प्रातः मेजी अलाव जलाते समय जपें',
        sa: 'भोगालीबिहूप्रभाते मेजीम् प्रज्वालयन् जपेत्',
      },
    },
    {
      id: 'lakshmi-kati',
      name: { en: 'Lakshmi Mantra (for Kati Bihu)', hi: 'लक्ष्मी मन्त्र (कटि बिहू हेतु)', sa: 'लक्ष्मीमन्त्रः (कटिबिह्वर्थम्)' },
      devanagari: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद\nॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः',
      iast: 'oṃ śrīṃ hrīṃ śrīṃ kamale kamalālaye prasīda prasīda\noṃ śrīṃ hrīṃ śrīṃ mahālakṣmyai namaḥ',
      meaning: {
        en: 'O Lakshmi, dweller of the lotus, be pleased, be gracious. Salutations to Mahalakshmi, the great goddess of prosperity.',
        hi: 'हे कमलवासिनी लक्ष्मी, प्रसन्न होइए, कृपा कीजिए। समृद्धि की महान देवी महालक्ष्मी को नमन।',
        sa: 'हे कमलालये लक्ष्मि, प्रसीद प्रसीद। समृद्ध्या महादेव्यै महालक्ष्म्यै नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant while lighting the Akash Banti lamps during Kati Bihu for crop protection',
        hi: 'कटि बिहू में फसल सुरक्षा के लिए आकाश बन्ती दीपक जलाते समय जपें',
        sa: 'कटिबिहौ सस्यरक्षार्थम् आकाशदीपान् प्रज्वालयन् जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Til Pitha (sesame stuffed rice cakes), Narikol Laru (coconut ladoo), Til Laru (sesame ladoo), Jolpan (flattened rice with curd and jaggery), Sunga Pitha (rice cooked in bamboo), Ghila Pitha (deep-fried rice flour cakes), Payasam, and seasonal fruits. For Bhogali Bihu, the feast includes fish curry, duck curry, and various rice preparations.',
    hi: 'तिल पीठा (तिल भरे चावल केक), नारिकल लारु (नारियल लड्डू), तिल लारु (तिल लड्डू), जलपान (दही और गुड़ के साथ चिड़वा), सुंगा पीठा (बाँस में पका चावल), घिला पीठा (तले हुए चावल के आटे के केक), पायसम, और मौसमी फल। भोगाली बिहू के लिए भोज में मछली करी, बत्तख करी और विभिन्न चावल तैयारियाँ शामिल हैं।',
    sa: 'तिलपीठा (तिलपूरिततण्डुलपिष्टकानि), नारिकेललारु (नारिकेलमोदकानि), तिललारु (तिलमोदकानि), जल्पानम् (दधिगुडसहितपृथुकम्), सुङ्गापीठा (वंशे पक्वतण्डुलम्), घिलापीठा (तैलपक्वतण्डुलचूर्णपिष्टकानि), पायसम्, ऋतुफलानि च। भोगालीबिहवर्थं भोजने मत्स्यव्यञ्जनं वातकव्यञ्जनं विविधतण्डुलपक्वान्नानि च।',
  },

  precautions: [
    {
      en: 'Kati Bihu is a time of restraint — do not feast or celebrate extravagantly. Observe simplicity and pray for the crops.',
      hi: 'कटि बिहू संयम का समय है — भव्य भोज या जश्न न मनाएँ। सादगी अपनाएँ और फसलों के लिए प्रार्थना करें।',
      sa: 'कटिबिहू संयमकालः — भव्यभोजनोत्सवं न कुर्यात्। सादगीम् आचरेत् सस्येभ्यः प्रार्थयेत् च।',
    },
    {
      en: 'When lighting the Meji, ensure fire safety — keep water nearby. The bonfire should be in an open field away from houses and trees.',
      hi: 'मेजी जलाते समय अग्नि सुरक्षा सुनिश्चित करें — पास में पानी रखें। अलाव घरों और पेड़ों से दूर खुले मैदान में होना चाहिए।',
      sa: 'मेजीं प्रज्वालयन् अग्निसुरक्षां सुनिश्चितं कुर्यात् — समीपे जलं स्थापयेत्। अग्निहोत्रं गृहवृक्षेभ्यः दूरे मुक्तक्षेत्रे भवेत्।',
    },
    {
      en: 'The Gamosa must be given and received with both hands as a mark of respect. Never place it on the floor or use it carelessly.',
      hi: 'गमोसा सम्मान के चिह्न के रूप में दोनों हाथों से दिया और लिया जाना चाहिए। इसे कभी ज़मीन पर न रखें या लापरवाही से उपयोग न करें।',
      sa: 'गमोसा सम्मानचिह्नरूपेण उभयहस्ताभ्यां दातव्यं ग्राह्यं च। भूमौ कदापि न स्थापयेत् असावधानेन न उपयोजयेत् च।',
    },
    {
      en: 'Treat cattle with love and care on Goru Bihu — no cattle should be made to work. This is their day of honour and rest.',
      hi: 'गोरु बिहू पर पशुओं से प्रेम और देखभाल के साथ व्यवहार करें — किसी भी पशु से काम न कराएँ। यह उनके सम्मान और विश्राम का दिन है।',
      sa: 'गोरुबिहौ पशून् प्रेम्णा यत्नेन च सेवेत — कमपि पशुं कार्यं न कारयेत्। इदं तेषां सम्मानविश्रामदिनम्।',
    },
  ],

  phala: {
    en: 'Blessings of Agni Devata for purification and destruction of negativity (Bhogali Bihu). Blessings of Lakshmi for crop protection and agricultural abundance (Kati Bihu). Joy, community harmony, and cultural preservation (Rongali Bihu). Strengthened bonds between humans, animals, and nature. Gratitude for the harvest and prayers for continued prosperity in the eternal agricultural cycle.',
    hi: 'शुद्धि और नकारात्मकता के विनाश के लिए अग्नि देवता का आशीर्वाद (भोगाली बिहू)। फसल सुरक्षा और कृषि समृद्धि के लिए लक्ष्मी का आशीर्वाद (कटि बिहू)। आनन्द, सामुदायिक सद्भाव और सांस्कृतिक संरक्षण (रोंगाली बिहू)। मनुष्यों, पशुओं और प्रकृति के बीच मजबूत बन्धन। फसल के लिए कृतज्ञता और शाश्वत कृषि चक्र में निरन्तर समृद्धि की प्रार्थना।',
    sa: 'शुद्ध्यर्थं नकारात्मकतानाशार्थं च अग्निदेवतायाः आशीर्वादः (भोगालीबिहू)। सस्यरक्षाकृषिसमृद्ध्यर्थं लक्ष्म्याः आशीर्वादः (कटिबिहू)। आनन्दः सामुदायिकसौहार्दं सांस्कृतिकसंरक्षणं च (रोङ्गालीबिहू)। मनुष्यपशुप्रकृतीनां मध्ये सुदृढबन्धनम्। सस्यार्थं कृतज्ञता शाश्वतकृषिचक्रे निरन्तरसमृद्ध्यर्थं प्रार्थना च।',
  },
};

import type { PujaVidhi } from './types';

export const ONAM_PUJA: PujaVidhi = {
  festivalSlug: 'onam',
  category: 'festival',
  deity: { en: 'King Mahabali & Lord Vamana', hi: 'राजा महाबलि एवं भगवान वामन', sa: 'महाबलिराजा भगवान् वामनश्च' },

  samagri: [
    { name: { en: 'Fresh flowers for Pookalam (10+ varieties)', hi: 'पूकलम के लिए ताज़े फूल (10+ किस्में)', sa: 'पूकलमार्थं नवपुष्पाणि (दशाधिकप्रकाराणि)' }, category: 'flowers', essential: true },
    { name: { en: 'Thrikkakara Appan (clay Vamana idol)', hi: 'त्रिक्काकरा अप्पन (मिट्टी की वामन मूर्ति)', sa: 'त्रिक्काकरा अप्पन् (मृत्तिकावामनमूर्तिः)' }, category: 'puja_items', essential: true },
    { name: { en: 'Banana leaves (for Onasadya)', hi: 'केले के पत्ते (ओणसद्या के लिए)', sa: 'कदलीपत्राणि (ओणसद्यार्थम्)' }, category: 'other', essential: true },
    { name: { en: 'Nilavilakku (brass lamp)', hi: 'नीलविलक्कु (पीतल का दीपक)', sa: 'नीलविलक्कु (पीतलदीपः)' }, category: 'puja_items', essential: true },
    { name: { en: 'Coconut oil', hi: 'नारियल तेल', sa: 'नारिकेलतैलम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Rice (for Onasadya)', hi: 'चावल (ओणसद्या के लिए)', sa: 'तण्डुलाः (ओणसद्यार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, category: 'food', essential: true },
    { name: { en: 'Jaggery (sharkkara)', hi: 'गुड़', sa: 'गुडम्' }, category: 'food', essential: true },
    { name: { en: 'Banana (nenthrapazham)', hi: 'केला (नेन्द्रपऴम)', sa: 'कदलीफलम् (नेन्द्रपऴम्)' }, category: 'food', essential: true },
    { name: { en: 'Kasavu mundu (traditional white cloth with gold border)', hi: 'कसवु मुण्डु (सुनहरे किनारे वाला सफ़ेद वस्त्र)', sa: 'कसवुवस्त्रम् (सुवर्णसीमान्तं श्वेतवस्त्रम्)' }, category: 'clothing', essential: false },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Onam is celebrated during the Malayalam month of Chingam (August-September) when the star Thiruvonam (Shravana nakshatra) rises. Thiruvonam day is the main celebration. The ten-day festival (Atham to Thiruvonam) begins with Atham nakshatra. Puja is performed in the morning.',
    hi: 'ओणम मलयालम महीने चिंगम (अगस्त-सितम्बर) में मनाया जाता है जब तिरुवोणम (श्रवण नक्षत्र) उदय होता है। तिरुवोणम दिवस मुख्य उत्सव है। दस दिवसीय उत्सव (अत्तम से तिरुवोणम) अत्तम नक्षत्र से आरम्भ होता है। पूजा प्रातः की जाती है।',
    sa: 'ओणम् मलयालमासे चिङ्गमे (श्रावण-भाद्रपदे) तिरुवोणं (श्रवणनक्षत्रम्) उदयति तदा आचर्यते। तिरुवोणदिनं प्रधानोत्सवः। दशदिवसीयोत्सवः (अत्तमतः तिरुवोणपर्यन्तम्) अत्तमनक्षत्रात् आरभते। पूजा प्रातः क्रियते।',
  },

  sankalpa: {
    en: 'On this sacred Thiruvonam, I welcome King Mahabali, the benevolent Asura king who returns to visit his beloved people of Kerala each year. I worship Lord Vamana, the fifth avatar of Vishnu, and pray for prosperity, unity, and the harvest\'s abundance.',
    hi: 'इस पवित्र तिरुवोणम पर, मैं राजा महाबलि का स्वागत करता/करती हूँ, वह उदार असुर राजा जो प्रतिवर्ष अपनी प्रिय केरल की जनता से मिलने आते हैं। मैं भगवान वामन, विष्णु के पाँचवें अवतार, की पूजा करता/करती हूँ और समृद्धि, एकता और फसल की प्रचुरता की प्रार्थना करता/करती हूँ।',
    sa: 'अस्मिन् पुण्ये तिरुवोणदिने महाबलिराजानं स्वागतं करोमि, स उदारः असुरराजा यः प्रतिवर्षं स्वप्रियां केरलजनतां द्रष्टुम् आगच्छति। भगवन्तं वामनं विष्णोः पञ्चमावतारं पूजयामि समृद्धिम् ऐक्यं सस्यप्राचुर्यं च प्रार्थयामि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Pookalam (Flower Carpet)', hi: 'पूकलम (फूलों की रंगोली)', sa: 'पूकलम् (पुष्परङ्गवल्ली)' },
      description: {
        en: 'Create an elaborate Pookalam (flower rangoli) at the entrance of the home using fresh flowers of multiple colours  –  thumba, mukkutti, chembarathi, and other local flowers. The pattern grows larger each day of the ten-day celebration. On Thiruvonam, it should be the grandest.',
        hi: 'घर के प्रवेश द्वार पर विभिन्न रंगों के ताज़े फूलों  –  तुम्बा, मुक्कुट्टि, चेम्बरती और अन्य स्थानीय फूलों  –  से विस्तृत पूकलम (फूलों की रंगोली) बनाएँ। दस दिवसीय उत्सव में प्रतिदिन पैटर्न बड़ा होता है। तिरुवोणम पर यह सबसे भव्य होना चाहिए।',
        sa: 'गृहप्रवेशद्वारे विविधवर्णनवपुष्पैः  –  तुम्बा मुक्कुट्टि चेम्बरती अन्यैः स्थानीयपुष्पैश्च  –  विस्तृतं पूकलम् (पुष्परङ्गवल्लीम्) रचयेत्। दशदिवसोत्सवे प्रतिदिनं चित्रं विशालतरं भवति। तिरुवोणदिने भव्यतमं स्यात्।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Thrikkakara Appan Puja', hi: 'त्रिक्काकरा अप्पन पूजा', sa: 'त्रिक्काकराअप्पन्पूजनम्' },
      description: {
        en: 'Place the Thrikkakara Appan (clay pyramid idol representing Vamana/Mahabali) in the centre of the Pookalam. Light the Nilavilakku (brass lamp) with coconut oil. Offer flowers, rice, and coconut. This is the heart of the Onam puja.',
        hi: 'त्रिक्काकरा अप्पन (वामन/महाबलि का प्रतिनिधित्व करने वाली मिट्टी की पिरामिड मूर्ति) को पूकलम के बीच में रखें। नारियल तेल से नीलविलक्कु (पीतल का दीपक) जलाएँ। फूल, चावल और नारियल अर्पित करें। यह ओणम पूजा का हृदय है।',
        sa: 'त्रिक्काकराअप्पन् (वामनमहाबल्योः प्रतिनिधिभूतां मृत्तिकापिरामिडमूर्तिम्) पूकलमस्य मध्ये स्थापयेत्। नारिकेलतैलेन नीलविलक्कुं (पीतलदीपम्) प्रज्वालयेत्। पुष्पाणि तण्डुलान् नारिकेलं च समर्पयेत्। इदम् ओणम्पूजनस्य हृदयम्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'invocation',
      mantraRef: 'vamana-mantra',
    },
    {
      step: 3,
      title: { en: 'Onasadya (Grand Feast)', hi: 'ओणसद्या (भव्य भोज)', sa: 'ओणसद्या (भव्यभोजनम्)' },
      description: {
        en: 'Prepare and serve the Onasadya  –  the grand vegetarian feast of 26+ dishes on banana leaves. Traditional items include avial, olan, kalan, pachadi, payasam (pradhaman), sambar, rasam, pickles, chips, and rice. Everyone sits on the floor. The feast is served in a specific order from left to right on the leaf.',
        hi: 'ओणसद्या  –  केले के पत्तों पर 26+ व्यंजनों का भव्य शाकाहारी भोज  –  तैयार करें और परोसें। पारम्परिक व्यंजनों में अवियल, ओलन, कालन, पचड़ी, पायसम (प्रधमन), सांभर, रसम, अचार, चिप्स और चावल शामिल हैं। सभी ज़मीन पर बैठते हैं। भोज पत्ते पर बाएँ से दाएँ एक निश्चित क्रम में परोसा जाता है।',
        sa: 'ओणसद्यां  –  कदलीपत्रेषु षड्विंशत्यधिकव्यञ्जनानां भव्यं शाकाहारभोजनम्  –  सज्जयेत् परिवेषयेत् च। पारम्परिकव्यञ्जनेषु अवियल् ओलन् कालन् पचडी पायसम् (प्रधमन्) सांभर् रसम् आचारः चिप्स् तण्डुलाश्च सन्ति। सर्वे भूमौ उपविशन्ति। भोजनं पत्रे वामतो दक्षिणं निश्चितक्रमेण परिवेष्यते।',
      },
      duration: '60 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Onakalikal (Traditional Games)', hi: 'ओणक्कलिकल (पारम्परिक खेल)', sa: 'ओणक्कलिकल् (पारम्परिकक्रीडाः)' },
      description: {
        en: 'Participate in traditional Onam games: Vallam Kali (boat race), Pulikali (tiger dance), Onathappan (clap game), Thumbi Thullal (women\'s dance), and Kaikotti Kali (group dance). These communal activities embody the spirit of equality that Mahabali\'s reign represented.',
        hi: 'पारम्परिक ओणम खेलों में भाग लें: वल्लम कली (नौका दौड़), पुलिकली (बाघ नृत्य), ओणाथप्पन (ताली खेल), तुम्बी तुल्लल (महिला नृत्य), और कैकोट्टि कली (सामूहिक नृत्य)। ये सामुदायिक गतिविधियाँ महाबलि के शासन की समानता की भावना का प्रतीक हैं।',
        sa: 'पारम्परिकओणम्क्रीडासु भागं गृह्णीयात्: वल्लम्कली (नौकाप्रतिस्पर्धा), पुलिकली (व्याघ्रनृत्यम्), ओणाथप्पन् (करतालक्रीडा), तुम्बीतुल्लल् (स्त्रीणां नृत्यम्), कैकोट्टिकली (सामूहिकनृत्यम्) च। इमाः सामुदायिकक्रियाः महाबलिशासनस्य साम्यभावनां प्रतिबिम्बयन्ति।',
      },
      duration: '60 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Evening Lamp and Prayer', hi: 'सन्ध्या दीप और प्रार्थना', sa: 'सन्ध्यादीपः प्रार्थना च' },
      description: {
        en: 'Light the Nilavilakku in the evening. Offer fresh flowers at the Pookalam. Pray for Mahabali\'s blessings  –  that his spirit of justice, generosity, and equality may prevail. On the day after Thiruvonam, bid farewell to Mahabali until next year.',
        hi: 'सन्ध्या में नीलविलक्कु जलाएँ। पूकलम पर ताज़े फूल अर्पित करें। महाबलि के आशीर्वाद की प्रार्थना करें  –  कि उनकी न्याय, उदारता और समानता की भावना बनी रहे। तिरुवोणम के अगले दिन, अगले वर्ष तक महाबलि को विदाई दें।',
        sa: 'सायंकाले नीलविलक्कुं प्रज्वालयेत्। पूकलमे नवपुष्पाणि समर्पयेत्। महाबलेः अनुग्रहं प्रार्थयेत्  –  तस्य न्यायोदारतासाम्यभावना प्रवर्ततामिति। तिरुवोणानन्तरदिने आगामिवर्षपर्यन्तं महाबलये विदायं ददाति।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'vamana-mantra',
      name: { en: 'Vamana Mantra', hi: 'वामन मंत्र', sa: 'वामनमन्त्रः' },
      devanagari: 'ॐ नमो भगवते वामनाय।\nत्रिविक्रमाय विष्णवे नमो नमः॥',
      iast: 'oṃ namo bhagavate vāmanāya |\ntrivikramāya viṣṇave namo namaḥ ||',
      meaning: {
        en: 'Om, salutations to Lord Vamana. Repeated salutations to Trivikrama (who covered the three worlds), Lord Vishnu.',
        hi: 'ॐ, भगवान वामन को नमस्कार। त्रिविक्रम (जिन्होंने तीनों लोकों को नाप लिया) विष्णु को बारम्बार नमन।',
        sa: 'ॐ, भगवते वामनाय नमः। त्रिविक्रमाय विष्णवे पुनः पुनः नमः।',
      },
      usage: {
        en: 'Chant during the Thrikkakara Appan puja.',
        hi: 'त्रिक्काकरा अप्पन पूजा के दौरान जाप करें।',
        sa: 'त्रिक्काकराअप्पन्पूजनकाले जपेत्।',
      },
    },
    {
      id: 'mahabali-stuti',
      name: { en: 'Mahabali Welcome Verse', hi: 'महाबलि स्वागत श्लोक', sa: 'महाबलिस्वागतश्लोकः' },
      devanagari: 'मावेलि नाडुवाणीडुम् कालम्\nमानुषरेल्लारुम् ऒन्नुपोले।\nआमोदत्तोडे वसिक्कुम् कालम्\nआपत्तङ्गळ् ऒन्नुमिल्ल॥',
      iast: 'māveli nāḍuvāṇīḍum kālaṃ\nmānuṣarellārum onnupole |\nāmodattōḍe vasikkum kālaṃ\nāpattaṅṅaḷ onnumilla ||',
      meaning: {
        en: 'When Maveli (Mahabali) ruled the land, all people were equal. In that joyful time, there were no calamities.',
        hi: 'जब मावेली (महाबलि) ने राज्य पर शासन किया, सभी लोग समान थे। उस आनन्दमय काल में कोई विपत्ति नहीं थी।',
        sa: 'यदा मावेलिः (महाबलिः) राज्यम् अशासत् सर्वे मानवाः समानाः आसन्। तस्मिन् आनन्दकाले आपदः नैवासन्।',
      },
      usage: {
        en: 'Sing during the Pookalam arrangement and while welcoming Mahabali.',
        hi: 'पूकलम सजाते समय और महाबलि का स्वागत करते समय गाएँ।',
        sa: 'पूकलमरचनाकाले महाबलिस्वागतकाले च गायेत्।',
      },
    },
  ],

  naivedya: {
    en: 'The Onasadya (grand feast) IS the naivedya  –  26+ vegetarian dishes including payasam (pradhaman), avial, olan, kalan, pachadi, kootu curry, sambar, rasam, banana chips, sharkkaravaratti, and rice. Ada pradhaman (rice flake payasam) and palada pradhaman are the signature desserts.',
    hi: 'ओणसद्या (भव्य भोज) ही नैवेद्य है  –  26+ शाकाहारी व्यंजन जिसमें पायसम (प्रधमन), अवियल, ओलन, कालन, पचड़ी, कूटु करी, सांभर, रसम, केले के चिप्स, शर्करावरट्टि और चावल शामिल हैं। अडा प्रधमन (चावल के फ्लेक का पायसम) और पालदा प्रधमन विशेष मिठाइयाँ हैं।',
    sa: 'ओणसद्या (भव्यभोजनम्) एव नैवेद्यम्  –  षड्विंशत्यधिकशाकाहारव्यञ्जनानि यत्र पायसम् (प्रधमन्) अवियल् ओलन् कालन् पचडी कूटुव्यञ्जनं सांभर् रसम् कदलीचिप्स् शर्करावरट्टि तण्डुलाश्च सन्ति। अडाप्रधमन् पालदाप्रधमन् च विशेषमिष्टान्ने स्तः।',
  },

  precautions: [
    {
      en: 'Onam is a secular harvest festival celebrated by all Keralites regardless of religion. The puja aspect is Hindu, but the feast, games, and community celebrations are universal.',
      hi: 'ओणम एक धर्मनिरपेक्ष फसल उत्सव है जो सभी केरलवासी धर्म की परवाह किए बिना मनाते हैं। पूजा पक्ष हिन्दू है, किन्तु भोज, खेल और सामुदायिक उत्सव सार्वभौमिक हैं।',
      sa: 'ओणम् सार्वभौमः सस्योत्सवः यं सर्वे केरलवासिनो धर्मनिरपेक्षतया आचरन्ति। पूजापक्षो हिन्दुः, किन्तु भोजनं क्रीडाः सामुदायिकोत्सवाश्च सार्वभौमिकाः।',
    },
    {
      en: 'Use only fresh, locally sourced flowers for the Pookalam  –  artificial flowers are considered inauspicious. The Pookalam must be made fresh each morning.',
      hi: 'पूकलम के लिए केवल ताज़े, स्थानीय फूलों का उपयोग करें  –  कृत्रिम फूल अशुभ माने जाते हैं। पूकलम प्रतिदिन प्रातः ताज़ा बनाना चाहिए।',
      sa: 'पूकलमार्थं केवलं नवानि स्थानीयपुष्पाणि प्रयुज्यन्ताम्  –  कृत्रिमपुष्पाणि अशुभानि मन्यन्ते। पूकलम् प्रतिदिनं प्रातः नवं रचनीयम्।',
    },
    {
      en: 'The Onasadya must be purely vegetarian. Non-vegetarian food is strictly avoided on Thiruvonam day, even in communities that normally consume it.',
      hi: 'ओणसद्या पूर्ण शाकाहारी होनी चाहिए। तिरुवोणम दिवस पर माँसाहार का सख्ती से त्याग किया जाता है, उन समुदायों में भी जो सामान्यतः इसका सेवन करते हैं।',
      sa: 'ओणसद्या पूर्णशाकाहारी स्यात्। तिरुवोणदिने मांसाहारः कठोरतया वर्जनीयः, तेषु समुदायेष्वपि ये सामान्यतया तत् सेवन्ते।',
    },
    {
      en: 'Onam falls in the Malayalam solar calendar (Chingam month), not the North Indian lunar calendar. The date varies each year in the Gregorian calendar.',
      hi: 'ओणम मलयालम सौर कैलेंडर (चिंगम माह) में पड़ता है, उत्तर भारतीय चान्द्र कैलेंडर में नहीं। ग्रेगोरियन कैलेंडर में तिथि प्रतिवर्ष बदलती है।',
      sa: 'ओणम् मलयालसौरपञ्चाङ्गे (चिङ्गममासे) भवति, न उत्तरभारतीयचान्द्रपञ्चाङ्गे। ग्रेगोरियनपञ्चाङ्गे तिथिः प्रतिवर्षं भिद्यते।',
    },
  ],

  phala: {
    en: 'Onam celebrates the golden age of Mahabali\'s rule  –  a time of equality, prosperity, and justice. Observing Onam brings agricultural abundance, family unity, communal harmony, and the blessings of both Mahabali (prosperity) and Vamana (divine grace). It is believed that Mahabali\'s spirit visits Kerala during Onam to bless his people.',
    hi: 'ओणम महाबलि के शासन के स्वर्णयुग  –  समानता, समृद्धि और न्याय के काल  –  का उत्सव है। ओणम मनाने से कृषि प्रचुरता, पारिवारिक एकता, सामुदायिक सद्भाव, और महाबलि (समृद्धि) तथा वामन (दिव्य कृपा) दोनों का आशीर्वाद मिलता है। ऐसी मान्यता है कि ओणम के दौरान महाबलि की आत्मा केरल आती है अपनी प्रजा को आशीर्वाद देने।',
    sa: 'ओणम् महाबलिशासनस्य सुवर्णयुगम्  –  साम्यसमृद्धिन्यायकालम्  –  आचरति। ओणमाचरणेन कृषिप्राचुर्यं कुटुम्बैक्यं सामुदायिकसद्भावः महाबलेः (समृद्धेः) वामनस्य (दिव्यानुग्रहस्य) चानुग्रहो लभ्यते। ओणमवसरे महाबलेः आत्मा केरलं प्रति आगच्छति स्वप्रजाम् अनुग्रहीतुमिति विश्वस्यते।',
  },
};

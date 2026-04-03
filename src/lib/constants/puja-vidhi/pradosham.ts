import type { PujaVidhi } from './types';

export const PRADOSHAM_PUJA: PujaVidhi = {
  festivalSlug: 'pradosham',
  category: 'vrat',
  deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'श्रीशिवः' },

  samagri: [
    { name: { en: 'Shivlinga or Shiva image', hi: 'शिवलिंग या शिव चित्र', sa: 'शिवलिङ्गम् अथवा शिवचित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Milk (raw, unboiled)', hi: 'दूध (कच्चा, बिना उबला)', sa: 'क्षीरम् (अपक्वम्)' }, category: 'food', essential: true },
    { name: { en: 'Water (Ganga water preferred)', hi: 'जल (गंगाजल श्रेष्ठ)', sa: 'जलम् (गङ्गाजलं श्रेष्ठम्)' }, category: 'other', essential: true },
    { name: { en: 'Bel/Bilva leaves (trifoliate)', hi: 'बेल के पत्ते (तीन पत्ती वाले)', sa: 'बिल्वपत्राणि (त्रिदलानि)' }, note: { en: 'Most sacred offering to Shiva — each leaf represents the three eyes', hi: 'शिव को सबसे पवित्र अर्पण — प्रत्येक पत्ती तीन नेत्रों का प्रतीक', sa: 'शिवस्य पवित्रतमम् अर्पणम् — प्रतिपत्रं त्रिनेत्रप्रतीकम्' }, category: 'flowers', essential: true },
    { name: { en: 'White flowers (jasmine, white lotus)', hi: 'सफ़ेद फूल (चमेली, सफ़ेद कमल)', sa: 'श्वेतपुष्पाणि (मल्लिका, श्वेतकमलम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Dhatura (thorn apple fruit and flowers)', hi: 'धतूरा (फल और फूल)', sa: 'धत्तूरम् (फलानि पुष्पाणि च)' }, note: { en: 'Sacred to Shiva — handle carefully, poisonous to ingest', hi: 'शिव को प्रिय — सावधानी से लें, खाने पर विषैला', sa: 'शिवप्रियम् — सावधानं गृह्णीयात्, भक्षणे विषम्' }, category: 'flowers', essential: false },
    { name: { en: 'Vibhuti/Bhasma (sacred ash)', hi: 'विभूति/भस्म', sa: 'विभूतिः/भस्म' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Fruits (banana, apple)', hi: 'फल (केला, सेब)', sa: 'फलानि (कदलीफलम्, सेवफलम्)' }, category: 'food', essential: false },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Pradosh Kaal is the 1.5-hour window that begins immediately after sunset on Trayodashi (13th tithi). All puja rituals MUST be performed within this twilight window. This is when Shiva performs his cosmic Tandava dance and is most accessible to devotees.',
    hi: 'प्रदोष काल वह डेढ़ घंटे की अवधि है जो त्रयोदशी (13वीं तिथि) को सूर्यास्त के तुरन्त बाद आरम्भ होती है। सभी पूजा विधि इसी सन्ध्याकालीन अवधि में करनी चाहिए। इस समय शिव अपना दिव्य ताण्डव नृत्य करते हैं और भक्तों के लिए सर्वाधिक सुलभ होते हैं।',
    sa: 'प्रदोषकालः त्रयोदश्यां (त्रयोदशतिथ्याम्) सूर्यास्तानन्तरं सार्धहोरापर्यन्तम्। सर्वपूजाविधिः एतस्मिन् सन्ध्याकाले एव कर्तव्या। अस्मिन् काले शिवः दिव्यताण्डवनृत्यं करोति भक्तेभ्यश्च सर्वसुलभो भवति।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Pradosh (Trayodashi tithi), during the auspicious Pradosh Kaal, I undertake this vrat and worship of Lord Shiva and Goddess Parvati for the removal of sins, fulfillment of desires, and attainment of moksha.',
    hi: 'इस पवित्र प्रदोष (त्रयोदशी तिथि) पर, शुभ प्रदोष काल में, पापनाश, मनोकामना पूर्ति और मोक्षप्राप्ति के लिए मैं भगवान शिव और माता पार्वती का पूजन एवं व्रत का संकल्प करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे प्रदोषे (त्रयोदशीतिथौ) शुभे प्रदोषकाले पापनाशाय मनोरथसिद्ध्यर्थं मोक्षप्राप्त्यर्थं च श्रीशिवपार्वतीपूजनं व्रतं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Daytime Fast', hi: 'दिन का उपवास', sa: 'दिवाव्रतम्' },
      description: {
        en: 'Observe a fast throughout the day on Trayodashi. Strict observers do nirjala (without water), while others may take fruits, milk, and water. Have a single meal before sunset if doing a partial fast. Spend the day in devotional activities and remembrance of Shiva.',
        hi: 'त्रयोदशी के दिन पूरे दिन उपवास रखें। कठोर व्रती निर्जला (बिना जल) रखते हैं, अन्य फल, दूध और जल ले सकते हैं। आंशिक उपवास में सूर्यास्त से पहले एक भोजन कर लें। दिन शिव-स्मरण और भक्ति में बिताएँ।',
        sa: 'त्रयोदश्यां दिने सर्वं व्रतम् आचरेत्। कठोरव्रतिनः निर्जलं (जलं विना) कुर्वन्ति, अपरे फलानि क्षीरं जलं च ग्रहणीयम्। आंशिकव्रते सूर्यास्तात् प्राक् एकं भोजनं कुर्यात्। दिनं शिवस्मरणभक्त्या यापयेत्।',
      },
      duration: 'Full day',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Pre-Sunset Preparation', hi: 'सूर्यास्त पूर्व तैयारी', sa: 'सूर्यास्तपूर्वसज्जता' },
      description: {
        en: 'Take a purifying bath before sunset. Wear clean white or rudraksha mala. Set up the puja area with the Shivlinga or Shiva image. Arrange all samagri — milk, water, bel leaves, white flowers, dhatura, vibhuti, lamp, and incense.',
        hi: 'सूर्यास्त से पहले शुद्धि स्नान करें। स्वच्छ सफ़ेद वस्त्र या रुद्राक्ष माला पहनें। पूजा स्थल पर शिवलिंग या शिव चित्र स्थापित करें। सभी सामग्री — दूध, जल, बेलपत्र, सफ़ेद फूल, धतूरा, विभूति, दीपक और धूप — व्यवस्थित करें।',
        sa: 'सूर्यास्तात् प्राक् शुद्धिस्नानं कुर्यात्। शुचिश्वेतवस्त्रं रुद्राक्षमालां वा धारयेत्। पूजास्थले शिवलिङ्गं शिवचित्रं वा स्थापयेत्। सर्वसामग्रीं — क्षीरं, जलं, बिल्वपत्राणि, श्वेतपुष्पाणि, धत्तूरं, विभूतिं, दीपं, धूपं च — सज्जयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Begin Puja at Pradosh Kaal', hi: 'प्रदोष काल में पूजा आरम्भ', sa: 'प्रदोषकाले पूजारम्भः' },
      description: {
        en: 'As soon as the sun sets and Pradosh Kaal begins, light the ghee lamp and incense. Perform achamana (sipping water thrice). Take the sankalpa by holding water, akshat, and flowers in the right palm, stating the tithi, place, and purpose.',
        hi: 'जैसे ही सूर्यास्त हो और प्रदोष काल आरम्भ हो, घी का दीपक और धूप जलाएँ। आचमन करें (तीन बार जल पिएँ)। दाहिने हाथ में जल, अक्षत और फूल लेकर तिथि, स्थान और उद्देश्य बोलकर संकल्प लें।',
        sa: 'सूर्यास्ते प्रदोषकालारम्भे घृतदीपं धूपं च प्रज्वालयेत्। आचमनं कुर्यात् (त्रिवारं जलं पिबेत्)। दक्षिणहस्ते जलाक्षतपुष्पान् गृहीत्वा तिथिस्थानप्रयोजनवचनपूर्वकं सङ्कल्पं कुर्यात्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Shivlinga Abhishek', hi: 'शिवलिंग अभिषेक', sa: 'शिवलिङ्गाभिषेकः' },
      description: {
        en: 'Perform abhishek (ritual bathing) of the Shivlinga. Pour milk slowly over the linga while chanting "Om Namah Shivaya". Then pour clean water (Ganga water if available). The abhishek should be done with devotion, letting the milk and water flow gently from the top.',
        hi: 'शिवलिंग का अभिषेक (अनुष्ठानिक स्नान) करें। "ॐ नमः शिवाय" का जप करते हुए धीरे-धीरे लिंग पर दूध डालें। फिर स्वच्छ जल (यदि उपलब्ध हो तो गंगाजल) डालें। अभिषेक भक्तिपूर्वक करें, दूध और जल ऊपर से धीरे-धीरे बहने दें।',
        sa: 'शिवलिङ्गस्य अभिषेकं (विधिस्नानम्) कुर्यात्। "ॐ नमः शिवाय" इति जपन् शनैः शनैः लिङ्गोपरि क्षीरं सिञ्चेत्। ततः शुद्धजलं (गङ्गाजलं यदि उपलभ्यते) सिञ्चेत्। भक्त्या अभिषेकं कुर्यात्, क्षीरजले उपरितः शनैः प्रवाहयेत्।',
      },
      mantraRef: 'panchakshari',
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Offer Bel Leaves, Dhatura & Flowers', hi: 'बेलपत्र, धतूरा एवं पुष्प अर्पण', sa: 'बिल्वपत्रधत्तूरपुष्पार्पणम्' },
      description: {
        en: 'Offer fresh trifoliate bel (bilva) leaves on the Shivlinga — place them with the smooth side facing up and the stalk pointing toward you. Offer dhatura fruits and flowers. Place white flowers (jasmine or white lotus) around the linga. Apply sandalwood paste and vibhuti.',
        hi: 'शिवलिंग पर ताज़े तीन पत्ती वाले बेलपत्र चढ़ाएँ — चिकनी सतह ऊपर और डंठल अपनी ओर रखें। धतूरे के फल और फूल चढ़ाएँ। लिंग के चारों ओर सफ़ेद फूल (चमेली या सफ़ेद कमल) रखें। चन्दन का लेप और विभूति लगाएँ।',
        sa: 'शिवलिङ्गोपरि नवीनानि त्रिदलबिल्वपत्राणि अर्पयेत् — श्लक्ष्णपृष्ठम् ऊर्ध्वं वृन्तम् आत्मनः दिशि स्थापयेत्। धत्तूरफलपुष्पाणि अर्पयेत्। लिङ्गं परितः श्वेतपुष्पाणि (मल्लिकां श्वेतकमलं वा) स्थापयेत्। चन्दनं विभूतिं च लिम्पेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Light Ghee Lamp & Chant Mantras', hi: 'घी का दीपक जलाएँ एवं मन्त्र जप', sa: 'घृतदीपप्रज्वालनं मन्त्रजपश्च' },
      description: {
        en: 'Light a ghee lamp (preferably with two wicks) before the Shivlinga. Chant the Panchakshari Mantra (Om Namah Shivaya) 108 times using a Rudraksha mala. Then recite the Maha Mrityunjaya Mantra 108 times. Maintain focus and devotion throughout — this is the core of Pradosh worship.',
        hi: 'शिवलिंग के सामने घी का दीपक (अधिमानतः दो बत्तियों वाला) जलाएँ। रुद्राक्ष माला से पंचाक्षरी मन्त्र (ॐ नमः शिवाय) 108 बार जपें। फिर महामृत्युञ्जय मन्त्र 108 बार जपें। पूरे समय एकाग्रता और भक्ति बनाए रखें — यही प्रदोष पूजा का मूल है।',
        sa: 'शिवलिङ्गस्य पुरतः घृतदीपम् (द्विवर्तिकं श्रेष्ठम्) प्रज्वालयेत्। रुद्राक्षमालया पञ्चाक्षरीमन्त्रम् (ॐ नमः शिवाय) १०८ वारं जपेत्। ततः महामृत्युञ्जयमन्त्रम् १०८ वारं जपेत्। सर्वत्र एकाग्रतां भक्तिं च रक्षेत् — एतत् प्रदोषपूजायाः मूलम्।',
      },
      mantraRef: 'maha-mrityunjaya',
      duration: '30 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 7,
      title: { en: 'Shiva Tandava Stotram & Rudram', hi: 'शिव ताण्डव स्तोत्रम् एवं रुद्रम्', sa: 'शिवताण्डवस्तोत्रं रुद्रं च' },
      description: {
        en: 'Recite the Shiva Tandava Stotram composed by Ravana — this is especially appropriate for Pradosh as Shiva performs the Tandava during this time. If capable, also recite Sri Rudram (Namakam and Chamakam from Yajurveda). Otherwise, recite the Shiva Chalisa or any Shiva stotram.',
        hi: 'रावण रचित शिव ताण्डव स्तोत्रम् का पाठ करें — यह प्रदोष के लिए विशेष रूप से उपयुक्त है क्योंकि इस समय शिव ताण्डव नृत्य करते हैं। यदि सम्भव हो तो श्री रुद्रम् (यजुर्वेद से नमकम् और चमकम्) का भी पाठ करें। अन्यथा शिव चालीसा या कोई शिव स्तोत्र पढ़ें।',
        sa: 'रावणरचितं शिवताण्डवस्तोत्रं पठेत् — प्रदोषे एतद् विशेषोचितं यतः अस्मिन् काले शिवः ताण्डवनृत्यं करोति। यदि शक्यते तर्हि श्रीरुद्रम् (यजुर्वेदात् नमकं चमकं च) अपि पठेत्। अन्यथा शिवचालीसां शिवस्तोत्रं वा पठेत्।',
      },
      mantraRef: 'shiva-tandava-opening',
      duration: '20 min',
      essential: false,
      stepType: 'mantra',
    },
    {
      step: 8,
      title: { en: 'Aarti & Pradakshina', hi: 'आरती एवं प्रदक्षिणा', sa: 'आरात्रिकं प्रदक्षिणा च' },
      description: {
        en: 'Perform aarti with the ghee lamp and camphor, singing "Om Jai Shiv Omkara". Circle the lamp before the Shivlinga in a clockwise direction. After aarti, do pradakshina (circumambulation) of the Shivlinga — note: for Shivlinga, do a half-circle (go from left to right and return the same way, without crossing the abhishek channel).',
        hi: 'घी के दीपक और कपूर से "ॐ जय शिव ओंकारा" गाते हुए आरती करें। दीपक को शिवलिंग के सामने दक्षिणावर्त (clockwise) घुमाएँ। आरती के बाद शिवलिंग की प्रदक्षिणा करें — ध्यान रखें: शिवलिंग की अर्ध-प्रदक्षिणा करें (बाएँ से दाएँ जाएँ और उसी मार्ग से लौटें, जलाभिषेक नाली को पार न करें)।',
        sa: 'घृतदीपकर्पूराभ्याम् "ॐ जय शिव ओंकारा" इति गायन् आरात्रिकं कुर्यात्। दीपं शिवलिङ्गस्य पुरतः दक्षिणावर्तं भ्रामयेत्। आरात्रिकानन्तरं शिवलिङ्गस्य प्रदक्षिणां कुर्यात् — अवधेयम्: शिवलिङ्गस्य अर्धप्रदक्षिणां कुर्यात् (वामतो दक्षिणं गत्वा तेनैव मार्गेण प्रत्यागच्छेत्, अभिषेकनालिकां न लङ्घयेत्)।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 9,
      title: { en: 'Naivedya & Conclusion', hi: 'नैवेद्य एवं समापन', sa: 'नैवेद्यं समापनं च' },
      description: {
        en: 'Offer naivedya (fruits, sweets, milk) to Lord Shiva. Apply vibhuti (bhasma) to your forehead as prasad from Shiva. Pray for the well-being of all beings. Break the fast after completing the puja with sattvic food. The puja must be completed before the Pradosh Kaal window closes.',
        hi: 'भगवान शिव को नैवेद्य (फल, मिठाई, दूध) अर्पित करें। शिव के प्रसाद के रूप में माथे पर विभूति (भस्म) लगाएँ। सभी प्राणियों के कल्याण की प्रार्थना करें। पूजा पूर्ण होने के बाद सात्विक भोजन से उपवास तोड़ें। प्रदोष काल की अवधि समाप्त होने से पहले पूजा पूरी होनी चाहिए।',
        sa: 'श्रीशिवाय नैवेद्यम् (फलानि, मिष्टान्नानि, क्षीरम्) अर्पयेत्। शिवप्रसादरूपेण ललाटे विभूतिं (भस्म) धारयेत्। सर्वप्राणिनां कल्याणार्थं प्रार्थयेत्। पूजासमाप्त्यनन्तरं सात्त्विकभोजनेन व्रतं भञ्जयेत्। प्रदोषकालसमाप्तेः प्राक् पूजा समापनीया।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'panchakshari',
      name: { en: 'Panchakshari Mantra (5-syllable)', hi: 'पंचाक्षरी मन्त्र', sa: 'पञ्चाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमः शिवाय',
      iast: 'oṃ namaḥ śivāya',
      meaning: {
        en: 'Om, I bow to Lord Shiva — the auspicious one, the transformer, the supreme consciousness.',
        hi: 'ॐ, भगवान शिव को नमन — शुभंकर, संहारकर्ता, परम चेतना।',
        sa: 'ॐ, शिवाय नमः — शुभङ्कराय संहारकर्त्रे परमचैतन्याय।',
      },
      japaCount: 108,
      usage: {
        en: 'The fundamental Shiva mantra. Chant 108 times during Pradosh Kaal abhishek. Each syllable (Na-Ma-Shi-Va-Ya) represents one of the five elements.',
        hi: 'मूलभूत शिव मन्त्र। प्रदोष काल अभिषेक के दौरान 108 बार जपें। प्रत्येक अक्षर (न-मः-शि-वा-य) पाँच तत्वों में से एक का प्रतिनिधि है।',
        sa: 'मूलभूतः शिवमन्त्रः। प्रदोषकाले अभिषेके १०८ वारं जपेत्। प्रत्येकम् अक्षरं (न-मः-शि-वा-य) पञ्चतत्त्वेषु एकस्य प्रतिनिधिः।',
      },
    },
    {
      id: 'maha-mrityunjaya',
      name: { en: 'Maha Mrityunjaya Mantra', hi: 'महामृत्युञ्जय मन्त्र', sa: 'महामृत्युञ्जयमन्त्रः' },
      devanagari: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥',
      iast: 'oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam | urvārukamiva bandhanān mṛtyormukṣīya māmṛtāt ||',
      meaning: {
        en: 'Om, we worship the three-eyed one (Shiva), who is fragrant and who nourishes all beings. As a cucumber is severed from its vine, may we be liberated from death, not from immortality.',
        hi: 'ॐ, हम त्रिनेत्रधारी (शिव) की पूजा करते हैं, जो सुगन्धित हैं और सभी प्राणियों का पोषण करते हैं। जैसे ककड़ी अपनी बेल से अलग होती है, वैसे ही हम मृत्यु से मुक्त हों, अमरत्व से नहीं।',
        sa: 'ॐ, त्र्यम्बकं (शिवं) यजामहे यः सुगन्धिः सर्वप्राणिपोषकः। उर्वारुकमिव बन्धनात् मृत्योः मुक्ताः स्याम, न तु अमृतात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during Pradosh puja for protection from untimely death, disease, and fear. This is from Rig Veda (7.59.12) and is the most powerful healing mantra.',
        hi: 'अकाल मृत्यु, रोग और भय से रक्षा के लिए प्रदोष पूजा में 108 बार जपें। यह ऋग्वेद (7.59.12) से है और सबसे शक्तिशाली उपचार मन्त्र है।',
        sa: 'अकालमृत्युरोगभयेभ्यः रक्षार्थं प्रदोषपूजायां १०८ वारं जपेत्। ऋग्वेदात् (७.५९.१२) एषः सर्वशक्तिमान् चिकित्सामन्त्रः।',
      },
    },
    {
      id: 'shiva-tandava-opening',
      name: { en: 'Shiva Tandava Stotram — Opening Verse', hi: 'शिव ताण्डव स्तोत्रम् — प्रथम श्लोक', sa: 'शिवताण्डवस्तोत्रम् — प्रथमश्लोकः' },
      devanagari: 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्। डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥',
      iast: 'jaṭāṭavīgalajjalapravāhapāvitasthale gale\'valambye lambitāṃ bhujaṅgatuṅgamālikām | ḍamaḍḍamaḍḍamaḍḍamannināḍavaḍḍamarvayaṃ cakāra caṇḍatāṇḍavaṃ tanotu naḥ śivaḥ śivam ||',
      meaning: {
        en: 'From whose matted hair the holy Ganga flows purifying the ground, who wears a garland of great serpents around his neck, who performs the fierce Tandava dance to the beat of his damaru drum (da-da-da-dam) — may that Shiva bestow auspiciousness upon us.',
        hi: 'जिनकी जटाओं के वन से गंगा का पवित्र प्रवाह भूमि को पवित्र करता है, जिनके गले में महान सर्पों की माला लटकती है, जो डमरू की ताल (ड-ड-ड-डम) पर प्रचण्ड ताण्डव नृत्य करते हैं — वे शिव हमारा कल्याण करें।',
        sa: 'यस्य जटाटवीतः गलत् जलप्रवाहः स्थलं पावयति, गले भुजङ्गतुङ्गमालिका लम्बिता, डमरुनादेन (डमड्डमड्डमड्डम्) चण्डताण्डवं चकार — सः शिवः नः शिवं तनोतु।',
      },
      usage: {
        en: 'Recite the full Shiva Tandava Stotram (17 verses) during Pradosh Kaal. Composed by Ravana, it is the most celebrated hymn to Shiva\'s cosmic dance.',
        hi: 'प्रदोष काल में पूर्ण शिव ताण्डव स्तोत्रम् (17 श्लोक) का पाठ करें। रावण द्वारा रचित, यह शिव के दिव्य नृत्य का सबसे प्रसिद्ध स्तोत्र है।',
        sa: 'प्रदोषकाले सम्पूर्णं शिवताण्डवस्तोत्रम् (१७ श्लोकाः) पठेत्। रावणरचितम् एतत् शिवस्य दिव्यनृत्यस्य सर्वप्रसिद्धं स्तोत्रम्।',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Sri Rudram (Namakam & Chamakam)', hi: 'श्री रुद्रम् (नमकम् एवं चमकम्)', sa: 'श्रीरुद्रम् (नमकं चमकं च)' },
      verseCount: 66,
      duration: '30 min',
      note: {
        en: 'From Krishna Yajurveda, Taittiriya Samhita. The most ancient and sacred hymn to Rudra/Shiva. Namakam has 11 anuvakas, Chamakam has 11 anuvakas.',
        hi: 'कृष्ण यजुर्वेद, तैत्तिरीय संहिता से। रुद्र/शिव का सबसे प्राचीन और पवित्र स्तोत्र। नमकम् में 11 अनुवाक, चमकम् में 11 अनुवाक हैं।',
        sa: 'कृष्णयजुर्वेदस्य तैत्तिरीयसंहितायाः। रुद्रस्य/शिवस्य प्राचीनतमं पवित्रतमं स्तोत्रम्। नमके ११ अनुवाकाः, चमके ११ अनुवाकाः।',
      },
    },
  ],

  aarti: {
    name: { en: 'Om Jai Shiv Omkara — Shiva Aarti', hi: 'ॐ जय शिव ओंकारा — शिव आरती', sa: 'ॐ जय शिव ओंकारा — शिवारात्रिकम्' },
    devanagari: `ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव, अर्द्धाङ्गी धारा॥
ॐ जय शिव ओंकारा॥

एकानन चतुरानन पञ्चानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे॥
ॐ जय शिव ओंकारा॥

दो भुज चार चतुर्भुज दसभुज अति सोहे।
त्रिगुण रूप निरखता त्रिभुवन जन मोहे॥
ॐ जय शिव ओंकारा॥

अक्षमाला वनमाला मुण्डमाला धारी।
त्रिपुरारी कंसारी कर माला धारी॥
ॐ जय शिव ओंकारा॥

श्वेताम्बर पीताम्बर बाघम्बर अङ्गे।
सनकादिक गरुणादिक भूतादिक संगे॥
ॐ जय शिव ओंकारा॥

कर के मध्य कमण्डलु चक्र त्रिशूलधारी।
सुखकारी दुखहारी जगपालनकारी॥
ॐ जय शिव ओंकारा॥

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर में शोभित ये तीनों एका॥
ॐ जय शिव ओंकारा॥

काशी में विश्वनाथ विराजे नन्दी ब्रह्मचारी।
नित उठ दर्शन पावे महिमा अति भारी॥
ॐ जय शिव ओंकारा॥`,
    iast: `oṃ jaya śiva oṃkārā, svāmī jaya śiva oṃkārā |
brahmā viṣṇu sadāśiva, arddhāṅgī dhārā ||
oṃ jaya śiva oṃkārā ||

ekānana caturānana pañcānana rāje |
haṃsāsana garuḍāsana vṛṣavāhana sāje ||
oṃ jaya śiva oṃkārā ||

do bhuja cāra caturbhuja dasabhuja ati sohe |
triguṇa rūpa nirakhatā tribhuvana jana mohe ||
oṃ jaya śiva oṃkārā ||

akṣamālā vanamālā muṇḍamālā dhārī |
tripurārī kaṃsārī kara mālā dhārī ||
oṃ jaya śiva oṃkārā ||

śvetāmbara pītāmbara bāghambara aṅge |
sanakādika garuṇādika bhūtādika saṅge ||
oṃ jaya śiva oṃkārā ||

kara ke madhya kamaṇḍalu cakra triśūladhārī |
sukhakārī dukhahārī jagapālanakārī ||
oṃ jaya śiva oṃkārā ||

brahmā viṣṇu sadāśiva jānata avivekā |
praṇavākṣara mẽ śobhita ye tīnõ ekā ||
oṃ jaya śiva oṃkārā ||

kāśī mẽ viśvanātha virāje nandī brahmacārī |
nita uṭha darśana pāve mahimā ati bhārī ||
oṃ jaya śiva oṃkārā ||`,
  },

  naivedya: {
    en: 'Offer fruits, milk, white sweets (pedha, barfi), and panchamrit. Bel fruit (wood apple) is especially sacred for Shiva. Bhaang (cannabis) preparation is traditionally offered in some regions but is optional.',
    hi: 'फल, दूध, सफ़ेद मिठाई (पेड़ा, बर्फी) और पंचामृत अर्पित करें। बेल फल शिव के लिए विशेष रूप से पवित्र है। कुछ क्षेत्रों में भाँग का भोग परम्परागत है किन्तु यह वैकल्पिक है।',
    sa: 'फलानि, क्षीरं, श्वेतमिष्टान्नानि (पेडकं, बर्फिका), पञ्चामृतं च अर्पयेत्। बिल्वफलं शिवस्य विशेषपवित्रम्। भङ्गाभोगः केषुचित् प्रदेशेषु पारम्परिकः किन्तु ऐच्छिकः।',
  },

  precautions: [
    {
      en: 'Puja MUST be performed during Pradosh Kaal only — the 1.5-hour window after sunset. Performing the puja before sunset or after this window closes yields no Pradosh-specific merit.',
      hi: 'पूजा केवल प्रदोष काल में ही करनी चाहिए — सूर्यास्त के बाद डेढ़ घंटे की अवधि में। सूर्यास्त से पहले या इस अवधि के बाद पूजा करने से प्रदोष-विशिष्ट पुण्य नहीं मिलता।',
      sa: 'पूजा प्रदोषकाले एव कर्तव्या — सूर्यास्तानन्तरं सार्धहोरापर्यन्तम्। सूर्यास्तात् प्राक् अस्य कालस्य अनन्तरं वा पूजया प्रदोषविशिष्टं पुण्यं न लभ्यते।',
    },
    {
      en: 'Have only a single meal before sunset if doing a partial fast. Strict observers fast the entire day without food or water.',
      hi: 'आंशिक उपवास में सूर्यास्त से पहले केवल एक भोजन करें। कठोर व्रती पूरे दिन बिना भोजन या जल के उपवास रखते हैं।',
      sa: 'आंशिकव्रते सूर्यास्तात् प्राक् एकमेव भोजनं कुर्यात्। कठोरव्रतिनः सर्वं दिनम् अन्नजलं विना उपवसन्ति।',
    },
    {
      en: 'Do not consume tamasic food (onion, garlic, non-vegetarian) on Pradosh day. Only sattvic food is permitted.',
      hi: 'प्रदोष के दिन तामसिक भोजन (प्याज, लहसुन, माँसाहार) न खाएँ। केवल सात्विक भोजन की अनुमति है।',
      sa: 'प्रदोषदिने तामसिकाहारं (पलाण्डुं लशुनं मांसाहारं) न भक्षयेत्। सात्त्विकाहारः एव अनुमतः।',
    },
    {
      en: 'Soma Pradosh (Monday) and Shani Pradosh (Saturday) are considered especially powerful. Observe these with extra devotion if they fall on Trayodashi.',
      hi: 'सोम प्रदोष (सोमवार) और शनि प्रदोष (शनिवार) विशेष रूप से शक्तिशाली माने जाते हैं। यदि ये त्रयोदशी को पड़ें तो अतिरिक्त भक्ति से पालन करें।',
      sa: 'सोमप्रदोषः (सोमवासरे) शनिप्रदोषः (शनिवासरे) च विशेषशक्तिमन्तौ मन्येते। त्रयोदश्यां यदि एतौ पतेतां तर्हि विशेषभक्त्या आचरेत्।',
    },
  ],

  parana: {
    type: 'next_sunrise' as const,
    description: {
      en: 'Break fast after sunrise next day',
      hi: 'अगले दिन सूर्योदय के बाद व्रत खोलें',
      sa: 'परदिने सूर्योदयानन्तरं व्रतं भञ्जेत्',
    },
  },

  phala: {
    en: 'Pradosh vrat destroys all sins and bestows Shiva\'s grace. It grants longevity, health, wealth, and ultimately moksha. The Skanda Purana states that Pradosh vrat pleases Shiva more than even a month-long fast, because the Pradosh Kaal is when Shiva is in his most benevolent mood.',
    hi: 'प्रदोष व्रत सभी पापों को नष्ट करता है और शिव की कृपा प्रदान करता है। यह दीर्घायु, स्वास्थ्य, धन और अन्ततः मोक्ष प्रदान करता है। स्कन्द पुराण के अनुसार प्रदोष व्रत शिव को एक मास के उपवास से भी अधिक प्रसन्न करता है, क्योंकि प्रदोष काल वह समय है जब शिव सर्वाधिक कृपालु होते हैं।',
    sa: 'प्रदोषव्रतं सर्वपापानि विनाशयति शिवकृपां च प्रददाति। दीर्घायुः आरोग्यं धनं मोक्षं च ददाति। स्कन्दपुराणे उक्तं प्रदोषव्रतं मासव्रतादपि अधिकं शिवं प्रसादयति, यतः प्रदोषकालः शिवस्य सर्वकृपालुतमकालः।',
  },
};

import type { PujaVidhi } from './types';

export const CHHATH_PUJA: PujaVidhi = {
  festivalSlug: 'chhath-puja',
  category: 'vrat',
  deity: { en: 'Surya & Chhathi Maiya', hi: 'सूर्य एवं छठी मइया', sa: 'सूर्यः छठीमाता च' },

  samagri: [
    { name: { en: 'Bamboo Soop (winnowing fan)', hi: 'बाँस का सूप', sa: 'वंशसूर्पम्' }, note: { en: 'Essential vessel for offerings — must be new', hi: 'अर्पण के लिए आवश्यक पात्र — नया होना चाहिए', sa: 'अर्पणार्थम् अनिवार्यं पात्रम् — नवं भवेत्' }, category: 'vessels', essential: true },
    { name: { en: 'Thekua (wheat flour sweets)', hi: 'ठेकुआ (गेहूँ के आटे की मिठाई)', sa: 'गोधूमचूर्णमिष्टान्नम् (ठेकुआ)' }, note: { en: 'Prepared without onion/garlic, with jaggery, ghee, dry fruits', hi: 'प्याज/लहसुन रहित, गुड़, घी, मेवों से बनाया जाता है', sa: 'पलाण्डुलशुनरहितं गुडघृतशुष्कफलैः निर्मितम्' }, category: 'food', essential: true },
    { name: { en: 'Sugarcane', hi: 'गन्ना', sa: 'इक्षुदण्डः' }, quantity: '5-7', category: 'food', essential: true },
    { name: { en: 'Bananas', hi: 'केले', sa: 'कदलीफलानि' }, quantity: '1 bunch', category: 'food', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '5', category: 'food', essential: true },
    { name: { en: 'Sweet lime (Mausambi)', hi: 'मौसम्बी', sa: 'मधुरनिम्बूकम् (मौसम्बी)' }, quantity: '5-7', category: 'food', essential: true },
    { name: { en: 'Fresh ginger', hi: 'अदरक', sa: 'आर्द्रकम्' }, category: 'food', essential: false },
    { name: { en: 'Fresh turmeric roots', hi: 'कच्ची हल्दी', sa: 'आर्द्रहरिद्रा' }, category: 'food', essential: false },
    { name: { en: 'Earthen lamps (diyas)', hi: 'मिट्टी के दीपक', sa: 'मृत्तिकादीपाः' }, quantity: '5-7', category: 'puja_items', essential: true },
    { name: { en: 'New clothes for the Vratti', hi: 'व्रती के लिए नए वस्त्र', sa: 'व्रतिनः नववस्त्राणि' }, category: 'clothing', essential: true },
    { name: { en: 'Red/yellow cloth', hi: 'लाल/पीला कपड़ा', sa: 'रक्तपीतवस्त्रम्' }, category: 'clothing', essential: false },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Radish and other seasonal vegetables', hi: 'मूली और अन्य मौसमी सब्जियाँ', sa: 'मूलकम् अन्यानि ऋतुशाकानि च' }, category: 'food', essential: false },
    { name: { en: 'Rice flour laddoo', hi: 'चावल के आटे के लड्डू', sa: 'तण्डुलचूर्णमोदकानि' }, category: 'food', essential: true },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Chhath Puja spans 4 days. The critical arghya timings are: Day 3 (Sandhya Arghya) at sunset — stand in water and offer arghya to the setting sun. Day 4 (Usha Arghya) at sunrise — offer arghya to the rising sun while standing in water.',
    hi: 'छठ पूजा 4 दिनों तक चलती है। महत्वपूर्ण अर्घ्य समय: तीसरा दिन (सन्ध्या अर्घ्य) सूर्यास्त पर — पानी में खड़े होकर डूबते सूर्य को अर्घ्य दें। चौथा दिन (ऊषा अर्घ्य) सूर्योदय पर — पानी में खड़े होकर उगते सूर्य को अर्घ्य दें।',
    sa: 'छठपूजा चतुर्दिनं व्याप्नोति। महत्त्वपूर्णाः अर्घ्यकालाः: तृतीयदिने (सन्ध्यार्घ्यम्) सूर्यास्तसमये — जले स्थित्वा अस्तगतसूर्याय अर्घ्यं दद्यात्। चतुर्थदिने (ऊषार्घ्यम्) सूर्योदयसमये — जले स्थित्वा उदयमानसूर्याय अर्घ्यं दद्यात्।',
  },

  sankalpa: {
    en: 'On this sacred Kartik Shukla Shashthi, I observe the Chhath Vrat to worship Surya Devta and Chhathi Maiya for the health, longevity, and prosperity of my family.',
    hi: 'इस पवित्र कार्तिक शुक्ल षष्ठी पर, अपने परिवार के स्वास्थ्य, दीर्घायु और समृद्धि के लिए सूर्य देवता एवं छठी मइया की उपासनार्थ मैं छठ व्रत करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे कार्तिकशुक्लषष्ठ्यां कुटुम्बस्य स्वास्थ्यदीर्घायुसमृद्ध्यर्थं सूर्यदेवस्य छठीमातुश्च उपासनार्थं छठव्रतमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Day 1: Nahay Khay (Ritual Bath & Meal)', hi: 'पहला दिन: नहाय खाय', sa: 'प्रथमदिनम्: स्नानभोजनम्' },
      description: {
        en: 'The Vratti (devotee observing the fast) takes a holy bath in a river or pond at sunrise. Prepares and eats a sattvic meal of lauki (bottle gourd) sabzi, chana dal, and rice cooked in an earthen hearth. The home is cleaned thoroughly. From this meal onward, strict purity is maintained.',
        hi: 'व्रती सूर्योदय पर नदी या तालाब में पवित्र स्नान करता/करती है। मिट्टी के चूल्हे पर लौकी की सब्जी, चना दाल और चावल का सात्विक भोजन बनाकर खाता/खाती है। घर की अच्छी तरह सफाई की जाती है। इस भोजन के बाद से कड़ी शुद्धता बनाए रखी जाती है।',
        sa: 'व्रती सूर्योदयकाले नद्यां तडागे वा पवित्रस्नानं करोति। मृत्तिकाचूल्लौ अलाबूशाकं चणकदालं तण्डुलं च सात्विकभोजनं पचित्वा भुङ्क्ते। गृहं सम्यक् शोधयति। अस्मात् भोजनात् परं कठोरा शुद्धिः पालनीया।',
      },
      duration: '2-3 hours',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Day 2: Kharna (Fasting & Evening Offering)', hi: 'दूसरा दिन: खरना', sa: 'द्वितीयदिनम्: खरना' },
      description: {
        en: 'The Vratti fasts the entire day without water (nirjala). In the evening, after sunset, the fast is broken with kheer (rice pudding made with jaggery and milk) and chapati. This kheer prasad is first offered to Chhathi Maiya, then distributed to family members. After this meal, the 36-hour nirjala (waterless) fast begins.',
        hi: 'व्रती पूरा दिन निर्जल व्रत रखता/रखती है। शाम को सूर्यास्त के बाद, गुड़ और दूध की खीर और चपाती से व्रत खोला जाता है। यह खीर प्रसाद पहले छठी मइया को अर्पित किया जाता है, फिर परिवार में बाँटा जाता है। इस भोजन के बाद 36 घण्टे का निर्जल व्रत शुरू होता है।',
        sa: 'व्रती सम्पूर्णं दिनं निर्जलं उपवसति। सायं सूर्यास्तानन्तरं गुडक्षीरपायसेन चपात्या च व्रतं भङ्क्ते। इदं पायसप्रसादं प्रथमं छठीमात्रे अर्प्यते ततः कुटुम्बे वितर्यते। अस्मात् भोजनात् परं षट्त्रिंशद्होरापर्यन्तं निर्जलव्रतम् आरभते।',
      },
      duration: '4-5 hours',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Day 3: Sandhya Arghya (Evening Sun Offering)', hi: 'तीसरा दिन: सन्ध्या अर्घ्य', sa: 'तृतीयदिनम्: सन्ध्यार्घ्यम्' },
      description: {
        en: 'Prepare all offerings: thekua, rice laddoo, fruits (bananas, coconut, sweet lime), sugarcane, and other items in the bamboo soop. The Vratti, wearing new clothes, goes to a riverbank or water body before sunset. Standing in waist-deep water, the Vratti offers arghya to the setting sun — pouring water and milk through the soop toward the sun while family and community sing Chhath folk songs. Earthen lamps are lit on the soop.',
        hi: 'सभी अर्पण सामग्री तैयार करें: ठेकुआ, चावल के लड्डू, फल (केले, नारियल, मौसम्बी), गन्ना और अन्य सामान बाँस के सूप में। व्रती नए वस्त्र पहनकर सूर्यास्त से पहले नदी तट या जलाशय पर जाता/जाती है। कमर तक पानी में खड़े होकर, व्रती डूबते सूर्य को अर्घ्य देता/देती है — सूप से सूर्य की दिशा में जल और दूध अर्पित करता/करती है। परिवार और समुदाय छठ के लोकगीत गाते हैं। सूप पर मिट्टी के दीपक जलाए जाते हैं।',
        sa: 'सर्वाणि अर्पणद्रव्याणि सज्जयेत्: ठेकुआ, तण्डुलमोदकानि, फलानि (कदलीफलानि, नारिकेलानि, मौसम्बी), इक्षुदण्डान्, अन्यानि च वंशसूर्पे। व्रती नववस्त्राणि धृत्वा सूर्यास्तात् पूर्वं नदीतटं जलाशयं वा गच्छति। कटिपर्यन्तं जले स्थित्वा, व्रती अस्तगतसूर्याय अर्घ्यं ददाति — सूर्पेण सूर्यदिशि जलं क्षीरं च अर्पयति। कुटुम्बं समुदायश्च छठलोकगीतानि गायन्ति। सूर्पे मृत्तिकादीपान् प्रज्वालयन्ति।',
      },
      duration: '2-3 hours',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Night Vigil (Kosi)', hi: 'रात्रि जागरण (कोसी)', sa: 'रात्रिजागरणम् (कोसी)' },
      description: {
        en: 'After the evening arghya, a special Kosi ritual may be performed at home — five sugarcane sticks are arranged as a canopy and earthen lamps are lit beneath. The Vratti maintains the nirjala fast through the night, preparing for the dawn arghya.',
        hi: 'सन्ध्या अर्घ्य के बाद, घर पर विशेष कोसी अनुष्ठान किया जा सकता है — पाँच गन्ने की चँदवा बनाई जाती है और उसके नीचे मिट्टी के दीपक जलाए जाते हैं। व्रती रात भर निर्जल व्रत बनाए रखता/रखती है, भोर के अर्घ्य की तैयारी करता/करती है।',
        sa: 'सन्ध्यार्घ्यानन्तरं गृहे विशेषं कोसीकर्म कर्तुं शक्यते — पञ्चेक्षुदण्डैः चन्दनिका निर्मीयते तदधः मृत्तिकादीपाः प्रज्वाल्यन्ते। व्रती रात्रौ निर्जलव्रतं पालयति, प्रभातार्घ्यस्य सज्जतां करोति।',
      },
      duration: 'Overnight',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Day 4: Usha Arghya (Morning Sun Offering)', hi: 'चौथा दिन: ऊषा अर्घ्य', sa: 'चतुर्थदिनम्: ऊषार्घ्यम्' },
      description: {
        en: 'Before sunrise, the Vratti goes to the same water body with fresh offerings in the bamboo soop. Standing in water, the Vratti offers arghya to the rising sun as it appears on the horizon. Water and milk are offered through the soop. Community members join in singing Chhath geet (folk songs). This is the climactic moment of the entire Chhath Puja.',
        hi: 'सूर्योदय से पहले, व्रती बाँस के सूप में ताजा अर्पण सामग्री लेकर उसी जलाशय पर जाता/जाती है। पानी में खड़े होकर, क्षितिज पर उगते सूर्य को अर्घ्य देता/देती है। सूप से जल और दूध अर्पित किया जाता है। समुदाय के लोग छठ गीत गाते हैं। यह सम्पूर्ण छठ पूजा का चरम क्षण है।',
        sa: 'सूर्योदयात् पूर्वं व्रती वंशसूर्पे नवार्पणद्रव्याणि गृहीत्वा तमेव जलाशयं गच्छति। जले स्थित्वा क्षितिजे उदयमानसूर्याय अर्घ्यं ददाति। सूर्पेण जलं क्षीरं च अर्पयति। समुदायजनाः छठगीतानि गायन्ति। इदं सम्पूर्णछठपूजायाः चरमक्षणम्।',
      },
      duration: '1-2 hours',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Surya Arghya Mantra', hi: 'सूर्य अर्घ्य मन्त्र', sa: 'सूर्यार्घ्यमन्त्रः' },
      description: {
        en: 'While offering arghya, chant the Surya Arghya Mantra with folded hands before pouring the water. Face the sun directly with eyes closed or semi-closed.',
        hi: 'अर्घ्य देते समय, जल डालने से पहले हाथ जोड़कर सूर्य अर्घ्य मन्त्र का उच्चारण करें। आँखें बन्द या अर्धबन्द रखकर सूर्य की दिशा में मुख करें।',
        sa: 'अर्घ्यदानसमये जलसेचनात् पूर्वं कृताञ्जलिपुटा सूर्यार्घ्यमन्त्रम् उच्चारयेत्। नेत्रे निमील्य अर्धनिमील्य वा सूर्याभिमुखं तिष्ठेत्।',
      },
      mantraRef: 'surya-arghya',
      duration: '5 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 7,
      title: { en: 'Paran (Breaking the Fast)', hi: 'पारण (व्रत खोलना)', sa: 'पारणम् (व्रतभङ्गः)' },
      description: {
        en: 'After the Usha Arghya, the Vratti returns home. The fast is broken by drinking the arghya water (prasad) and eating the thekua and prasad. Family elders bless the Vratti. The 36-hour nirjala fast ends.',
        hi: 'ऊषा अर्घ्य के बाद, व्रती घर लौटता/लौटती है। अर्घ्य जल (प्रसाद) पीकर और ठेकुआ व प्रसाद खाकर व्रत तोड़ा जाता है। परिवार के बड़े व्रती को आशीर्वाद देते हैं। 36 घण्टे का निर्जल व्रत समाप्त होता है।',
        sa: 'ऊषार्घ्यानन्तरं व्रती गृहं प्रत्यागच्छति। अर्घ्यजलं (प्रसादम्) पीत्वा ठेकुआप्रसादं च भुक्त्वा व्रतं भङ्क्ते। कुटुम्बस्य वृद्धाः व्रतिनम् आशिषन्ति। षट्त्रिंशद्होरानिर्जलव्रतं समाप्यते।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 8,
      title: { en: 'Prasad Distribution', hi: 'प्रसाद वितरण', sa: 'प्रसादवितरणम्' },
      description: {
        en: 'Distribute the Chhath prasad (thekua, fruits, rice laddoo) to all family members, neighbours, and community. The prasad is considered highly sacred.',
        hi: 'छठ प्रसाद (ठेकुआ, फल, चावल के लड्डू) सभी परिवारजनों, पड़ोसियों और समुदाय में बाँटें। यह प्रसाद अत्यन्त पवित्र माना जाता है।',
        sa: 'छठप्रसादं (ठेकुआ, फलानि, तण्डुलमोदकानि) सर्वेषां कुटुम्बजनानां प्रतिवासिनां समुदायस्य च मध्ये वितरेत्। इदं प्रसादम् अतीव पवित्रं मन्यते।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'surya-arghya',
      name: { en: 'Surya Arghya Mantra', hi: 'सूर्य अर्घ्य मन्त्र', sa: 'सूर्यार्घ्यमन्त्रः' },
      devanagari: 'ॐ सूर्याय नमः। ॐ आदित्याय नमः। ॐ भास्कराय नमः।\nएहि सूर्य सहस्रांशो तेजोराशे जगत्पते।\nअनुकम्पय मां भक्त्या गृहाणार्घ्यं दिवाकर॥',
      iast: 'oṃ sūryāya namaḥ | oṃ ādityāya namaḥ | oṃ bhāskarāya namaḥ |\nehi sūrya sahasrāṃśo tejorāśe jagatpate |\nanukampaya māṃ bhaktyā gṛhāṇārghyaṃ divākara ||',
      meaning: {
        en: 'Salutations to Surya, Aditya, Bhaskara. O thousand-rayed Sun, treasure of radiance, lord of the world — have mercy on me with devotion, O day-maker, accept this arghya.',
        hi: 'सूर्य, आदित्य, भास्कर को नमन। हे सहस्र किरणों वाले सूर्य, तेज की राशि, जगत के स्वामी — भक्ति से मुझ पर कृपा करें, हे दिवाकर, यह अर्घ्य स्वीकार करें।',
        sa: 'सूर्याय आदित्याय भास्कराय नमः। हे सहस्रांशो सूर्य, तेजोराशे, जगत्पते, मां भक्त्या अनुकम्पय, हे दिवाकर, अर्घ्यं गृहाण।',
      },
      usage: {
        en: 'Chant while offering arghya to the sun during both Sandhya (evening) and Usha (morning) rituals',
        hi: 'सन्ध्या (शाम) और ऊषा (सुबह) दोनों अर्घ्य के समय सूर्य को अर्घ्य देते हुए पढ़ें',
        sa: 'सन्ध्या (सायम्) ऊषा (प्रभात) उभयार्घ्यसमये सूर्याय अर्घ्यं ददन् पठेत्',
      },
    },
    {
      id: 'chhath-prarthana',
      name: { en: 'Chhath Folk Prayer', hi: 'छठ लोक प्रार्थना', sa: 'छठलोकप्रार्थना' },
      devanagari: 'कांच ही बाँस के बहँगिया, बहँगी लचकत जाय।\nबहँगी लचकत जाय, पूजन कइली छठी माई॥\nहे छठी मइया, तोहरे से बिनती हमार।\nरक्षा करीं लालन के, सुनीं हमार पुकार॥',
      iast: 'kāñca hī bām̐sa ke baham̐giyā, baham̐gī lacakata jāya |\nbaham̐gī lacakata jāya, pūjana kailī chaṭhī māī ||\nhe chaṭhī maiyā, tohare se binatī hamāra |\nrakṣā karīṃ lālana ke, sunīṃ hamāra pukāra ||',
      meaning: {
        en: 'The bamboo basket sways as I carry it. I worship you, O Chhathi Maiya. O Mother Chhathi, this is my humble prayer — protect my children, hear my call.',
        hi: 'बाँस की बहँगी लचकती जाती है। हे छठी मइया, मैंने तुम्हारी पूजा की है। हे छठी मइया, तुमसे मेरी विनती है — बच्चों की रक्षा करो, मेरी पुकार सुनो।',
        sa: 'वंशपात्रं लचमानं गच्छति। हे छठीमातः, त्वां पूजितवती। हे छठीमातः, त्वां प्रति मम विनतिः — बालकानां रक्षां कुरु, मम आह्वानं शृणु।',
      },
      usage: {
        en: 'Sung as a folk song while walking to the river and during the arghya offering',
        hi: 'नदी की ओर चलते समय और अर्घ्य के दौरान लोकगीत के रूप में गाया जाता है',
        sa: 'नदीं प्रति गच्छन् अर्घ्यसमये च लोकगीतरूपेण गीयते',
      },
    },
    {
      id: 'surya-gayatri',
      name: { en: 'Surya Gayatri Mantra', hi: 'सूर्य गायत्री मन्त्र', sa: 'सूर्यगायत्रीमन्त्रः' },
      devanagari: 'ॐ भास्कराय विद्महे महाद्युतिकराय धीमहि। तन्नो आदित्यः प्रचोदयात्॥',
      iast: 'oṃ bhāskarāya vidmahe mahādyutikarāya dhīmahi | tanno ādityaḥ pracodayāt ||',
      meaning: {
        en: 'We meditate upon the radiant one (Bhaskara), we contemplate the great source of brilliance. May Aditya (Sun) inspire and illuminate us.',
        hi: 'हम भास्कर (प्रकाशमान) का ध्यान करते हैं, महान प्रकाश-स्रोत का चिन्तन करते हैं। आदित्य (सूर्य) हमें प्रेरित और प्रकाशित करें।',
        sa: 'भास्करं विद्मः, महाद्युतिकरं धीमहि। आदित्यः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Chant 11 times while facing the sun during arghya',
        hi: 'अर्घ्य के दौरान सूर्य की ओर मुख करके 11 बार जपें',
        sa: 'अर्घ्यसमये सूर्याभिमुखं एकादशवारं जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Thekua (wheat-jaggery-ghee sweet), rice flour laddoo, bananas, coconut, sweet lime, sugarcane, fresh turmeric, ginger, and seasonal fruits — all arranged in the bamboo soop',
    hi: 'ठेकुआ (गेहूँ-गुड़-घी मिठाई), चावल के आटे के लड्डू, केले, नारियल, मौसम्बी, गन्ना, कच्ची हल्दी, अदरक और मौसमी फल — सब बाँस के सूप में सजाकर',
    sa: 'ठेकुआ (गोधूमगुडघृतमिष्टान्नम्), तण्डुलचूर्णमोदकानि, कदलीफलानि, नारिकेलानि, मधुरनिम्बूकानि, इक्षुदण्डाः, आर्द्रहरिद्रा, आर्द्रकम्, ऋतुफलानि च — सर्वाणि वंशसूर्पे सज्जयित्वा',
  },

  precautions: [
    {
      en: 'Absolute purity must be maintained — no leather footwear, no onion, no garlic, no non-vegetarian food during the entire 4-day period',
      hi: 'पूर्ण शुद्धता बनाए रखें — सम्पूर्ण 4 दिनों में चमड़े के जूते, प्याज, लहसुन, माँसाहार वर्जित है',
      sa: 'पूर्णशुद्धिः पालनीया — सम्पूर्णचतुर्दिने चर्मपादत्राणं पलाण्डुं लशुनं मांसाहारं च वर्जयेत्',
    },
    {
      en: 'The Vratti must stand in water during arghya — do not wear footwear in the water',
      hi: 'व्रती को अर्घ्य के दौरान पानी में खड़ा होना चाहिए — पानी में जूते न पहनें',
      sa: 'अर्घ्यसमये व्रती जले स्थातव्यः — जले पादत्राणं न धारयेत्',
    },
    {
      en: 'The Vratti must observe nirjala (waterless) fast for 36 hours — from Kharna evening to Usha Arghya morning',
      hi: 'व्रती को 36 घण्टे का निर्जल व्रत रखना चाहिए — खरना की शाम से ऊषा अर्घ्य की सुबह तक',
      sa: 'व्रती षट्त्रिंशद्होरापर्यन्तं निर्जलव्रतं पालयेत् — खरनासायंकालात् ऊषार्घ्यप्रभातपर्यन्तम्',
    },
    {
      en: 'All food must be prepared without salt, onion, or garlic — purely sattvic',
      hi: 'सभी भोजन बिना नमक, प्याज या लहसुन के बनाना चाहिए — पूर्णतः सात्विक',
      sa: 'सर्वम् अन्नं लवणपलाण्डुलशुनरहितं पचेत् — शुद्धसात्विकम्',
    },
    {
      en: 'Ensure the water body is clean — river ghats should be cleaned before the arghya ceremony',
      hi: 'जलाशय स्वच्छ सुनिश्चित करें — अर्घ्य अनुष्ठान से पहले नदी घाट साफ करने चाहिए',
      sa: 'जलाशयः शुचिः सुनिश्चित्यताम् — अर्घ्यानुष्ठानात् पूर्वं नदीघट्टाः शोधनीयाः',
    },
  ],

  parana: {
    type: 'next_sunrise' as const,
    description: {
      en: 'Break fast after sunrise arghya on the last day',
      hi: 'अन्तिम दिन सूर्योदय अर्घ्य के बाद व्रत खोलें',
      sa: 'अन्तिमदिने सूर्योदयार्घ्यानन्तरं व्रतं भञ्जेत्',
    },
  },

  phala: {
    en: 'Blessings of Surya Devta for health, vitality, and longevity of the family; protection of children; cure of skin and eye ailments; fulfilment of heartfelt wishes; and the grace of Chhathi Maiya for prosperity and progeny',
    hi: 'परिवार के स्वास्थ्य, ऊर्जा और दीर्घायु के लिए सूर्य देवता का आशीर्वाद; सन्तानों की रक्षा; त्वचा और नेत्र रोगों का निवारण; मनोकामनाओं की पूर्ति; और समृद्धि व सन्तान के लिए छठी मइया की कृपा',
    sa: 'कुटुम्बस्य स्वास्थ्यतेजोदीर्घायुषे सूर्यदेवस्य आशीर्वादः; सन्ततिरक्षणम्; त्वक्नेत्ररोगनिवारणम्; मनोरथपूर्तिः; समृद्धिसन्ततिप्राप्त्यर्थं छठीमातुः कृपा च',
  },
};

import type { PujaVidhi } from './types';

export const MAHA_NAVAMI_PUJA: PujaVidhi = {
  festivalSlug: 'maha-navami',
  category: 'festival',
  deity: { en: 'Durga (Siddhidatri)', hi: 'दुर्गा (सिद्धिदात्री)', sa: 'दुर्गा (सिद्धिदात्री)' },

  samagri: [
    { name: { en: 'Durga idol or image', hi: 'दुर्गा मूर्ति या चित्र', sa: 'दुर्गाप्रतिमा अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Havan samagri (for Navami havan)', hi: 'हवन सामग्री (नवमी हवन हेतु)', sa: 'हवनसामग्री (नवमीहवनार्थम्)' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee (for havan)', hi: 'घी (हवन हेतु)', sa: 'घृतम् (हवनार्थम्)' }, quantity: '250g', category: 'food', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Red flowers (hibiscus, roses)', hi: 'लाल फूल (गुड़हल, गुलाब)', sa: 'रक्तपुष्पाणि (जपापुष्पाणि पाटलानि)' }, category: 'flowers', essential: true },
    { name: { en: 'Red cloth / chunri', hi: 'लाल कपड़ा / चुनरी', sa: 'रक्तवस्त्रम् / चुनरी' }, category: 'clothing', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Halwa-puri (for kanya puja)', hi: 'हलवा-पूरी (कन्या पूजा हेतु)', sa: 'हल्वापूरिका (कन्यापूजार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Chana (black gram for kanya puja)', hi: 'काले चने (कन्या पूजा हेतु)', sa: 'कृष्णचणकाः (कन्यापूजार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1', category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'Fruits and sweets', hi: 'फल और मिठाई', sa: 'फलानि मिष्टान्नानि च' }, category: 'food', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Maha Navami puja is performed on Ashwin Shukla Navami during the morning or Madhyahna period. The Navami Havan is done in the morning, and Kanya Puja is performed before noon. Sandhi Puja (junction of Ashtami-Navami) is the most auspicious moment.',
    hi: 'महा नवमी पूजा आश्विन शुक्ल नवमी को प्रातःकाल या मध्याह्न में की जाती है। नवमी हवन प्रातःकाल में होता है और कन्या पूजा दोपहर से पहले की जाती है। सन्धि पूजा (अष्टमी-नवमी का सन्धिकाल) सबसे शुभ क्षण है।',
    sa: 'महानवमीपूजा आश्विनशुक्लनवम्यां प्रभाते मध्याह्ने वा क्रियते। नवमीहवनं प्रभाते क्रियते कन्यापूजा मध्याह्नात् पूर्वं च। सन्धिपूजा (अष्टमीनवम्योः सन्धिकालः) सर्वाधिकशुभक्षणः।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Maha Navami, the ninth day of Sharadiya Navratri, I worship Goddess Durga in her Siddhidatri form — the bestower of all siddhis. I perform this havan and puja for the destruction of evil, attainment of spiritual powers, and the grace of the Divine Mother before the victory of Vijaya Dashami.',
    hi: 'इस पवित्र महा नवमी पर, शारदीय नवरात्रि के नवें दिन, मैं देवी दुर्गा की सिद्धिदात्री स्वरूप — सभी सिद्धियों की दात्री — की पूजा करता/करती हूँ। विजया दशमी की विजय से पूर्व, बुराई के विनाश, आध्यात्मिक शक्तियों की प्राप्ति और दिव्य माता की कृपा हेतु मैं यह हवन और पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे महानवम्यां शारदीयनवरात्रस्य नवमदिवसे सर्वसिद्धिप्रदात्रीं सिद्धिदात्रीस्वरूपां दुर्गादेवीं पूजयामि। विजयादशम्याः विजयात् पूर्वं दुष्टविनाशार्थम् आध्यात्मिकशक्तिप्राप्त्यर्थं दिव्यमातुः कृपार्थं च हवनपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning Preparation & Snan', hi: 'प्रातःकालीन तैयारी एवं स्नान', sa: 'प्रभातसज्जा स्नानं च' },
      description: {
        en: 'Rise early, bathe, and wear red or festive clothing. Clean and decorate the puja area. Prepare the havan kund (fire pit). Arrange all samagri including flowers, fruits, and havan ingredients.',
        hi: 'प्रातःकाल उठें, स्नान करें और लाल या उत्सवी वस्त्र पहनें। पूजा स्थल को साफ और सजाएँ। हवन कुण्ड (अग्निकुण्ड) तैयार करें। फूल, फल और हवन सामग्री सहित सभी सामग्री व्यवस्थित करें।',
        sa: 'प्रभाते उत्थाय स्नात्वा रक्तानि उत्सवीयानि वा वस्त्राणि धारयेत्। पूजास्थलं शोधयेत् सज्जयेत् च। हवनकुण्डं (अग्निकुण्डम्) सज्जयेत्। पुष्पाणि फलानि हवनसामग्रीं चेतरां सामग्रीं व्यवस्थापयेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Navami Havan (Fire Ceremony)', hi: 'नवमी हवन (अग्नि संस्कार)', sa: 'नवमीहवनम् (अग्निसंस्कारः)' },
      description: {
        en: 'Light the sacred fire in the havan kund. Offer ghee, havan samagri, and sesame seeds into the fire while chanting Durga mantras. Perform 108 ahutis (offerings) with "Om Dum Durgaye Namaha Svaha". The fire purifies and carries prayers to the Devi.',
        hi: 'हवन कुण्ड में पवित्र अग्नि प्रज्वलित करें। दुर्गा मन्त्रों का जाप करते हुए अग्नि में घी, हवन सामग्री और तिल अर्पित करें। "ॐ दुं दुर्गायै नमः स्वाहा" के साथ 108 आहुतियाँ दें। अग्नि शुद्ध करती है और प्रार्थनाएँ देवी तक पहुँचाती है।',
        sa: 'हवनकुण्डे पवित्राग्निं प्रज्वालयेत्। दुर्गामन्त्रजपेन अग्नौ घृतं हवनसामग्रीं तिलांश्चार्पयेत्। "ॐ दुं दुर्गायै नमः स्वाहा" इत्यष्टोत्तरशताहुतीः दद्यात्। अग्निः शोधयति प्रार्थनाः देवीं प्रति नयति च।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Durga Mahishasura Mardini Puja', hi: 'दुर्गा महिषासुर मर्दिनी पूजा', sa: 'दुर्गामहिषासुरमर्दिनीपूजनम्' },
      description: {
        en: 'Worship Goddess Durga as Mahishasura Mardini — the slayer of the buffalo demon. Offer red flowers, kumkum, red chunri, and coconut. Apply sindoor to the Devi. Recite Durga Saptashati or Mahishasura Mardini Stotram. This commemorates the final battle before Vijaya Dashami.',
        hi: 'देवी दुर्गा की महिषासुर मर्दिनी — महिषासुर का वध करने वाली — के रूप में पूजा करें। लाल फूल, कुमकुम, लाल चुनरी और नारियल अर्पित करें। देवी को सिन्दूर लगाएँ। दुर्गा सप्तशती या महिषासुर मर्दिनी स्तोत्रम् का पाठ करें। यह विजया दशमी से पूर्व अन्तिम युद्ध का स्मरण है।',
        sa: 'महिषासुरमर्दिनीरूपेण — महिषासुरघातिनीरूपेण — दुर्गादेवीं पूजयेत्। रक्तपुष्पाणि कुङ्कुमं रक्तचुनरीं नारिकेलं चार्पयेत्। देव्यै सिन्दूरं लिम्पेत्। दुर्गासप्तशतीं महिषासुरमर्दिनीस्तोत्रं वा पठेत्। एतद् विजयादशम्याः पूर्वम् अन्तिमयुद्धस्य स्मरणम्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 4,
      title: { en: 'Kanya Puja (Worship of Nine Girls)', hi: 'कन्या पूजा (नौ कन्याओं की पूजा)', sa: 'कन्यापूजा (नवकन्याकानां पूजनम्)' },
      description: {
        en: 'Invite 9 young girls (aged 2-10) representing the nine forms of Durga. Wash their feet, apply kumkum tilak, and offer red chunri. Serve them halwa, puri, and chana (black gram). Give gifts or dakshina. These girls are worshipped as living embodiments of Navadurga.',
        hi: 'दुर्गा के नौ रूपों का प्रतिनिधित्व करती 9 छोटी कन्याओं (2-10 वर्ष) को आमन्त्रित करें। उनके पैर धोएँ, कुमकुम तिलक लगाएँ और लाल चुनरी अर्पित करें। उन्हें हलवा, पूरी और काले चने परोसें। उपहार या दक्षिणा दें। इन कन्याओं की नवदुर्गा के जीवित अवतार के रूप में पूजा की जाती है।',
        sa: 'नवदुर्गारूपप्रतिनिधिरूपेण नव कन्याकाः (द्वि-दशवर्षीयाः) आमन्त्रयेत्। तासां पादौ प्रक्षालयेत्, कुङ्कुमतिलकं कुर्यात्, रक्तचुनरीम् अर्पयेत्। ताभ्यः हल्वां पूरिकां कृष्णचणकांश्च परिवेषयेत्। उपहारान् दक्षिणां वा दद्यात्। एताः कन्याकाः नवदुर्गायाः जीवितावतारत्वेन पूज्यन्ते।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Sandhi Puja (Ashtami-Navami Junction)', hi: 'सन्धि पूजा (अष्टमी-नवमी सन्धि)', sa: 'सन्धिपूजा (अष्टमीनवमीसन्धिः)' },
      description: {
        en: 'Perform the auspicious Sandhi Puja at the exact junction when Ashtami tithi ends and Navami begins. Light 108 earthen lamps. Offer special prayers to Durga as Chamunda — the fierce form who slayed Chanda and Munda. This is the most powerful moment of the entire Navratri.',
        hi: 'ठीक उस सन्धिकाल में सन्धि पूजा करें जब अष्टमी तिथि समाप्त होती है और नवमी आरम्भ होती है। 108 मिट्टी के दीपक जलाएँ। दुर्गा को चामुण्डा रूप में — जिन्होंने चण्ड और मुण्ड का वध किया — विशेष प्रार्थना अर्पित करें। यह सम्पूर्ण नवरात्रि का सबसे शक्तिशाली क्षण है।',
        sa: 'यदा अष्टमीतिथिः समाप्यते नवमी चारभ्यते तदा सन्धिकाले सन्धिपूजां कुर्यात्। अष्टोत्तरशतं मृत्तिकादीपान् प्रज्वालयेत्। चण्डमुण्डघातिनीं चामुण्डारूपिणीं दुर्गां विशेषप्रार्थनयार्चयेत्। एष सम्पूर्णनवरात्रस्य सर्वशक्तिमत्क्षणः।',
      },
      duration: '30 min',
      essential: false,
      stepType: 'invocation',
    },
    {
      step: 6,
      title: { en: 'Aarti & Conclusion', hi: 'आरती एवं समापन', sa: 'आरतिः समापनं च' },
      description: {
        en: 'Perform the Durga Aarti with camphor and ghee lamp. Offer fruits, sweets, and coconut as final naivedya. Distribute prasad to all devotees. The atmosphere is charged with anticipation of Vijaya Dashami — the day of ultimate victory over evil.',
        hi: 'कपूर और घी के दीपक से दुर्गा आरती करें। फल, मिठाई और नारियल अन्तिम नैवेद्य के रूप में अर्पित करें। सभी भक्तों को प्रसाद बाँटें। विजया दशमी — बुराई पर अन्तिम विजय के दिन — की प्रतीक्षा से वातावरण भक्तिमय है।',
        sa: 'कर्पूरेण घृतदीपेन च दुर्गाआरतिं कुर्यात्। फलानि मिष्टान्नानि नारिकेलं चान्तिमनैवेद्यरूपेण अर्पयेत्। सर्वभक्तेभ्यः प्रसादं विभजेत्। विजयादशम्याः — दुष्टोपरि अन्तिमविजयस्य — प्रतीक्षया वातावरणं भक्तिमयम्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'navami-durga-mantra',
      name: { en: 'Durga Navami Mantra', hi: 'दुर्गा नवमी मन्त्र', sa: 'दुर्गानवमीमन्त्रः' },
      devanagari: 'ॐ दुं दुर्गायै नमः',
      iast: 'oṃ duṃ durgāyai namaḥ',
      meaning: {
        en: 'Obeisance to Goddess Durga — the invincible one who removes all difficulties.',
        hi: 'देवी दुर्गा को नमस्कार — अजेय देवी जो सभी कठिनाइयों को दूर करती हैं।',
        sa: 'अजेयायै सर्वकष्टनिवारिण्यै दुर्गादेव्यै नमः।',
      },
      japaCount: 108,
      usage: { en: 'Primary mantra for havan ahutis and japa on Navami', hi: 'नवमी पर हवन आहुतियों और जप के लिए मुख्य मन्त्र', sa: 'नवम्यां हवनाहुतिजपयोः मुख्यमन्त्रः' },
    },
    {
      id: 'navami-siddhidatri',
      name: { en: 'Siddhidatri Mantra (9th Navadurga)', hi: 'सिद्धिदात्री मन्त्र (नवीं नवदुर्गा)', sa: 'सिद्धिदात्रीमन्त्रः (नवमनवदुर्गा)' },
      devanagari: 'सिद्धगन्धर्वयक्षाद्यैरसुरैरमरैरपि।\nसेव्यमाना सदा भूयात् सिद्धिदा सिद्धिदायिनी॥',
      iast: 'siddhagandharva­yakṣādyair asurair amarair api |\nsevyamānā sadā bhūyāt siddhidā siddhidāyinī ||',
      meaning: {
        en: 'She who is served by Siddhas, Gandharvas, Yakshas, Asuras, and Devas alike — may the bestower of all siddhis always be gracious.',
        hi: 'जिनकी सेवा सिद्ध, गन्धर्व, यक्ष, असुर और देवता सभी करते हैं — वे सभी सिद्धियों की दात्री सदा कृपालु हों।',
        sa: 'सिद्धगन्धर्वयक्षासुरामरैः सेव्यमाना सर्वसिद्धिप्रदात्री सिद्धिदायिनी सदा कृपालु भवतु।',
      },
      japaCount: 9,
      usage: { en: 'Chant during the worship of the ninth form of Navadurga', hi: 'नवदुर्गा के नवें रूप की पूजा के दौरान जपें', sa: 'नवदुर्गायाः नवमस्वरूपपूजनकाले जपेत्' },
    },
    {
      id: 'navami-mahishasura-mardini',
      name: { en: 'Mahishasura Mardini Verse', hi: 'महिषासुर मर्दिनी श्लोक', sa: 'महिषासुरमर्दिनीश्लोकः' },
      devanagari: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
      iast: 'sarvamaṅgalamāṅgalye śive sarvārthasādhike |\nśaraṇye tryambake gauri nārāyaṇi namo\'stu te ||',
      meaning: {
        en: 'O auspicious of all that is auspicious, O consort of Shiva, accomplisher of all goals, refuge of all, three-eyed Gauri, O Narayani, salutations to you.',
        hi: 'हे सभी मंगलों में मंगलकारी, हे शिव की पत्नी, सभी लक्ष्यों की साधिका, सभी की शरण, त्रिनेत्री गौरी, हे नारायणी, आपको नमस्कार।',
        sa: 'हे सर्वमङ्गलानां माङ्गल्ये शिवे सर्वार्थसाधिके शरण्ये त्र्यम्बके गौरि नारायणि ते नमोऽस्तु।',
      },
      japaCount: 3,
      usage: { en: 'Recite during aarti and as closing prayer', hi: 'आरती और समापन प्रार्थना के रूप में पाठ करें', sa: 'आरतिकाले समापनप्रार्थनारूपेण च पठेत्' },
    },
  ],

  naivedya: {
    en: 'Offer halwa-puri with chana (the traditional Kanya Puja bhog), kheer, seasonal fruits, coconut, and sweets. On Navami, non-vegetarian offerings are made in some Shakta traditions (bali pratha), but vegetarian offerings are predominant across most regions.',
    hi: 'हलवा-पूरी चने के साथ (पारम्परिक कन्या पूजा भोग), खीर, मौसमी फल, नारियल और मिठाई अर्पित करें। नवमी पर कुछ शाक्त परम्पराओं में माँसाहारी नैवेद्य (बलि प्रथा) दिया जाता है, परन्तु अधिकांश क्षेत्रों में शाकाहारी नैवेद्य प्रमुख है।',
    sa: 'हल्वापूरिकां चणकैः सह (पारम्परिककन्यापूजाभोगम्), क्षीरान्नं ऋतुफलानि नारिकेलं मिष्टान्नानि चार्पयेत्। नवम्यां काश्चित् शाक्तपरम्परासु माँसाहारनैवेद्यं (बलिप्रथा) दीयते, परन्तु अधिकांशप्रदेशेषु शाकाहारनैवेद्यं प्रमुखम्।',
  },

  precautions: [
    {
      en: 'If observing Navratri vrat, maintain the fast until after the Kanya Puja bhog is complete. Break fast only after feeding the kanyas.',
      hi: 'यदि नवरात्रि व्रत रख रहे हैं, तो कन्या पूजा भोग पूर्ण होने तक व्रत बनाए रखें। कन्याओं को भोजन कराने के बाद ही व्रत तोड़ें।',
      sa: 'यदि नवरात्रिव्रतं पालयति, कन्यापूजाभोगसम्पत्तिपर्यन्तं व्रतं पालयेत्। कन्याकाभ्यः भोजनदानानन्तरम् एव व्रतं भञ्जयेत्।',
    },
    {
      en: 'Treat the kanyas (young girls) with utmost respect. They are worshipped as forms of the Goddess. Never force or pressure children to participate.',
      hi: 'कन्याओं (छोटी बालिकाओं) का अत्यन्त सम्मान से व्यवहार करें। वे देवी के रूपों के रूप में पूजित होती हैं। बच्चों को भाग लेने के लिए कभी बाध्य या दबाव न दें।',
      sa: 'कन्याकाभिः (बालिकाभिः) परमादरेण व्यवहरेत्। ताः देव्याः रूपत्वेन पूज्यन्ते। बालान् भागग्रहणाय कदापि बलात् न प्रेरयेत्।',
    },
    {
      en: 'The havan fire must be handled carefully. Keep water nearby. Ensure proper ventilation if performing indoors.',
      hi: 'हवन अग्नि को सावधानी से संभालें। पास में जल रखें। यदि घर के अन्दर कर रहे हैं तो उचित वायु संचार सुनिश्चित करें।',
      sa: 'हवनाग्निं सावधानेन प्रचालयेत्। समीपे जलं स्थापयेत्। यदि गृहाभ्यन्तरे करोति तर्हि समुचितवायुसञ्चारं सुनिश्चितं कुर्यात्।',
    },
  ],

  phala: {
    en: 'Maha Navami puja bestows the eight supernatural siddhis (Anima, Mahima, Garima, Laghima, Prapti, Prakamya, Ishitva, Vashitva) through the grace of Siddhidatri Devi. The Navami havan destroys all accumulated sins and negative karmas. Kanya Puja brings the blessings of all nine forms of Durga. It grants courage, victory over enemies, protection from evil, and prepares the devotee for the ultimate triumph celebrated on Vijaya Dashami.',
    hi: 'महा नवमी पूजा सिद्धिदात्री देवी की कृपा से आठ अलौकिक सिद्धियाँ (अणिमा, महिमा, गरिमा, लघिमा, प्राप्ति, प्राकाम्य, ईशित्व, वशित्व) प्रदान करती है। नवमी हवन सभी संचित पापों और नकारात्मक कर्मों को नष्ट करता है। कन्या पूजा दुर्गा के सभी नौ रूपों का आशीर्वाद प्रदान करती है। यह साहस, शत्रुओं पर विजय, बुराई से रक्षा प्रदान करती है और भक्त को विजया दशमी पर मनाई जाने वाली अन्तिम विजय के लिए तैयार करती है।',
    sa: 'महानवमीपूजा सिद्धिदात्रीदेव्याः कृपया अष्टसिद्धीः (अणिमा महिमा गरिमा लघिमा प्राप्तिः प्राकाम्यम् ईशित्वं वशित्वं च) ददाति। नवमीहवनं सर्वसञ्चितपापनकारात्मककर्माणि नाशयति। कन्यापूजा दुर्गायाः नवरूपाणाम् आशीर्वादं ददाति। साहसं शत्रुविजयं दुष्टरक्षां च ददाति, विजयादशम्याम् उत्सवनीयाम् अन्तिमविजयार्थं भक्तं सज्जयति च।',
  },
};

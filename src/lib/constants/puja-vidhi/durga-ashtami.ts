import type { PujaVidhi } from './types';

export const DURGA_ASHTAMI_PUJA: PujaVidhi = {
  festivalSlug: 'durga-ashtami',
  category: 'festival',
  deity: { en: 'Durga (Mahagauri / Chamunda)', hi: 'दुर्गा (महागौरी / चामुण्डा)', sa: 'दुर्गा (महागौरी / चामुण्डा)' },

  samagri: [
    { name: { en: 'Durga idol or image', hi: 'दुर्गा मूर्ति या चित्र', sa: 'दुर्गामूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Havan samagri (fire ritual materials)', hi: 'हवन सामग्री', sa: 'हवनसामग्री' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee (for havan)', hi: 'घी (हवन के लिए)', sa: 'घृतम् (हवनार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Red flowers (hibiscus, rose)', hi: 'लाल फूल (गुड़हल, गुलाब)', sa: 'रक्तपुष्पाणि (जपापुष्पम्, शतपत्रम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks and camphor', hi: 'अगरबत्ती और कपूर', sa: 'धूपं कर्पूरं च' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'Halwa, puri, and chana (for naivedya)', hi: 'हलवा, पूरी और चना (नैवेद्य के लिए)', sa: 'हल्वा पूरी चनकं च (नैवेद्यार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Weapons/tools for Astra puja (symbolic)', hi: 'शस्त्र/औज़ार अस्त्र पूजा के लिए (प्रतीकात्मक)', sa: 'शस्त्राणि/उपकरणानि अस्त्रपूजार्थम् (प्रतीकात्मकानि)' }, category: 'other', essential: false },
    { name: { en: 'New clothes/gifts for Kanya Puja', hi: 'कन्या पूजन के लिए नए वस्त्र/उपहार', sa: 'कन्यापूजनार्थं नववस्त्राणि उपहाराश्च' }, category: 'clothing', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Durga Ashtami is observed on the 8th day of Navratri (Ashwin/Chaitra Shukla Ashtami). The Sandhi Puja — the most sacred moment — occurs during the junction (sandhi) of Ashtami and Navami tithi. Daily worship is done during Madhyahna (midday).',
    hi: 'दुर्गा अष्टमी नवरात्रि के 8वें दिन (आश्विन/चैत्र शुक्ल अष्टमी) मनाई जाती है। सन्धि पूजा — सबसे पवित्र क्षण — अष्टमी और नवमी तिथि के सन्धिकाल में होती है। दैनिक पूजा मध्याह्न में की जाती है।',
    sa: 'दुर्गाष्टमी नवरात्र्याः अष्टमे दिने (आश्विन/चैत्रशुक्लाष्टम्याम्) आचर्यते। सन्धिपूजा — पवित्रतमः क्षणः — अष्टमीनवम्योः सन्धिकाले भवति। प्रतिदिनपूजा मध्याह्ने क्रियते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Maha Ashtami, I worship Goddess Durga in her form as Mahagauri and Chamunda for the destruction of all evil, protection of dharma, and attainment of spiritual power. I resolve to perform Sandhi Puja, Kanya Puja, and Havan with full devotion.',
    hi: 'इस पवित्र महा अष्टमी पर, मैं समस्त दुष्टों के विनाश, धर्म की रक्षा और आध्यात्मिक शक्ति की प्राप्ति के लिए देवी दुर्गा की महागौरी और चामुण्डा रूप में पूजा करता/करती हूँ। मैं पूर्ण भक्ति से सन्धि पूजा, कन्या पूजन और हवन का संकल्प करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे महाष्टम्यां सर्वदुष्टविनाशाय धर्मरक्षणाय आध्यात्मिकशक्तिप्राप्त्यर्थं च देवीं दुर्गां महागौरीचामुण्डारूपेण पूजयामि। पूर्णभक्त्या सन्धिपूजां कन्यापूजनं हवनं च कर्तुं सङ्कल्पे।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Preparation & Snana', hi: 'तैयारी एवं स्नान', sa: 'सज्जता स्नानं च' },
      description: {
        en: 'Rise early, bathe, and wear clean red or orange clothes. Prepare the puja area with fresh flowers and clean the Durga idol. Arrange havan samagri, food offerings, and gifts for Kanya Puja.',
        hi: 'प्रातः उठें, स्नान करें और स्वच्छ लाल या नारंगी वस्त्र पहनें। ताज़े फूलों से पूजा स्थल सजाएँ और दुर्गा मूर्ति साफ करें। हवन सामग्री, भोग और कन्या पूजन के उपहार तैयार रखें।',
        sa: 'प्रातः उत्तिष्ठेत्, स्नायात्, शुचिरक्तनारङ्गवस्त्राणि धारयेत्। नवपुष्पैः पूजास्थलं सज्जयेत् दुर्गामूर्तिं शोधयेत्। हवनसामग्रीं भोगसामग्रीं कन्यापूजनोपहारांश्च सज्जीकुर्यात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa & Durga Puja', hi: 'संकल्प एवं दुर्गा पूजा', sa: 'सङ्कल्पः दुर्गापूजनं च' },
      description: {
        en: 'Take the sankalpa with water and akshat. Perform the 16-step (Shodashopachara) puja of Goddess Durga: Avahana (invocation), Asana, Padya, Arghya, Achamaniya, Snana, Vastra, Gandha, Pushpa, Dhupa, Deepa, Naivedya, Tambula, Dakshina, Aarti, Pradakshina.',
        hi: 'जल और अक्षत से संकल्प करें। देवी दुर्गा की षोडशोपचार पूजा करें: आवाहन, आसन, पाद्य, अर्घ्य, आचमनीय, स्नान, वस्त्र, गन्ध, पुष्प, धूप, दीप, नैवेद्य, ताम्बूल, दक्षिणा, आरती, प्रदक्षिणा।',
        sa: 'जलाक्षतैः सङ्कल्पं कुर्यात्। देव्याः दुर्गायाः षोडशोपचारपूजां कुर्यात्: आवाहनम्, आसनम्, पाद्यम्, अर्घ्यम्, आचमनीयम्, स्नानम्, वस्त्रम्, गन्धम्, पुष्पम्, धूपम्, दीपम्, नैवेद्यम्, ताम्बूलम्, दक्षिणा, आरात्रिकम्, प्रदक्षिणा।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Kanya Puja (Worship of 9 Girls)', hi: 'कन्या पूजन (9 कन्याओं की पूजा)', sa: 'कन्यापूजनम् (नवकन्यानां पूजा)' },
      description: {
        en: 'Invite 9 young girls (ages 2-10) representing the 9 forms of Durga: Kumarika (2), Trimurti (3), Kalyani (4), Rohini (5), Kali (6), Chandika (7), Shambhavi (8), Durga (9), Subhadra (10). Wash their feet, apply tilak, offer food (halwa-puri-chana), new clothes, and dakshina.',
        hi: '9 कन्याओं (2-10 वर्ष) को आमन्त्रित करें जो दुर्गा के 9 रूपों का प्रतिनिधित्व करती हैं: कुमारिका (2), त्रिमूर्ति (3), कल्याणी (4), रोहिणी (5), काली (6), चण्डिका (7), शाम्भवी (8), दुर्गा (9), सुभद्रा (10)। पैर धोएँ, तिलक लगाएँ, भोजन (हलवा-पूरी-चना), नए वस्त्र और दक्षिणा दें।',
        sa: 'नवकन्याः (द्विवर्षीयतः दशवर्षीयपर्यन्तम्) निमन्त्रयेत् याः दुर्गायाः नवरूपाणि प्रतिनिधन्ति: कुमारिका (2), त्रिमूर्तिः (3), कल्याणी (4), रोहिणी (5), काली (6), चण्डिका (7), शाम्भवी (8), दुर्गा (9), सुभद्रा (10)। पादान् प्रक्षालयेत्, तिलकं कुर्यात्, भोजनं (हल्वापूरीचनकम्) नववस्त्राणि दक्षिणां च दद्यात्।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Sandhi Puja', hi: 'सन्धि पूजा', sa: 'सन्धिपूजा' },
      description: {
        en: 'The most important ritual of Maha Ashtami. Perform this puja during the exact junction (sandhi kaal) when Ashtami tithi ends and Navami begins — typically a 48-minute window (24 minutes before and after the sandhi moment). Offer 108 lotuses and 108 lamps. Recite the Chamunda mantra.',
        hi: 'महा अष्टमी का सबसे महत्वपूर्ण अनुष्ठान। इसे ठीक उस सन्धि काल में करें जब अष्टमी तिथि समाप्त होकर नवमी शुरू होती है — सामान्यतः 48 मिनट का समय (सन्धि क्षण के 24 मिनट पहले और बाद)। 108 कमल और 108 दीपक अर्पित करें। चामुण्डा मंत्र का पाठ करें।',
        sa: 'महाष्टम्याः महत्तमम् अनुष्ठानम्। एतत् सन्धिकाले यदा अष्टमीतिथिः समाप्यते नवमी च आरभ्यते तदा कुर्यात् — सामान्यतः अष्टचत्वारिंशन्निमेषकालः (सन्धिक्षणात् चतुर्विंशतिनिमेषं पूर्वम् अपरं च)। अष्टोत्तरशतकमलानि अष्टोत्तरशतदीपान् च समर्पयेत्। चामुण्डामन्त्रं पठेत्।',
      },
      duration: '48 min',
      essential: true,
      stepType: 'mantra',
      mantraRef: 'chamunda-mantra',
    },
    {
      step: 5,
      title: { en: 'Astra Puja (Weapon Worship)', hi: 'अस्त्र पूजा (शस्त्र पूजन)', sa: 'अस्त्रपूजा (शस्त्रपूजनम्)' },
      description: {
        en: 'Perform Astra Puja — worship of weapons and tools. In the Durga tradition, this symbolizes the divine weapons given to Durga by the Devas. Place household tools, professional instruments, or symbolic weapons before the Goddess and worship them with flowers and kumkum.',
        hi: 'अस्त्र पूजा करें — शस्त्रों और औज़ारों की पूजा। दुर्गा परम्परा में यह देवताओं द्वारा दुर्गा को दिए गए दिव्य अस्त्रों का प्रतीक है। घरेलू औज़ार, व्यावसायिक उपकरण या प्रतीकात्मक शस्त्र देवी के सामने रखकर फूल और कुमकुम से पूजा करें।',
        sa: 'अस्त्रपूजां कुर्यात् — शस्त्रोपकरणानां पूजनम्। दुर्गापरम्परायां एतत् देवैः दुर्गायै प्रदत्तानां दिव्यास्त्राणां प्रतीकम्। गृहोपकरणानि व्यावसायिकयन्त्राणि प्रतीकात्मकशस्त्राणि वा देव्याः पुरतः स्थापयित्वा पुष्पकुङ्कुमाभ्यां पूजयेत्।',
      },
      duration: '15 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Havan (Fire Ritual)', hi: 'हवन (अग्नि अनुष्ठान)', sa: 'हवनम् (अग्निकर्म)' },
      description: {
        en: 'Prepare the havan kund (fire pit). Light the sacred fire and offer ghee, havan samagri, and sesame seeds while chanting the Durga Ashtami mantra and Durga Saptashati verses. Make 108 offerings (ahutis) into the fire.',
        hi: 'हवन कुण्ड तैयार करें। पवित्र अग्नि प्रज्वलित करें और दुर्गा अष्टमी मंत्र तथा दुर्गा सप्तशती के श्लोकों का पाठ करते हुए घी, हवन सामग्री और तिल की आहुतियाँ दें। अग्नि में 108 आहुतियाँ दें।',
        sa: 'हवनकुण्डं सज्जयेत्। पवित्राग्निं प्रज्वालयेत् दुर्गाष्टमीमन्त्रं दुर्गासप्तशतीश्लोकांश्च पठन् घृतं हवनसामग्रीं तिलान् च आहुतिरूपेण समर्पयेत्। अग्नौ अष्टोत्तरशतम् आहुतीः दद्यात्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'offering',
      mantraRef: 'ashtami-mantra',
    },
    {
      step: 7,
      title: { en: 'Aarti & Prasad', hi: 'आरती एवं प्रसाद', sa: 'आरात्रिकं प्रसादश्च' },
      description: {
        en: 'Perform the Durga Aarti with ghee lamp, camphor, and bell. Distribute the prasad (halwa-puri-chana) to all devotees. If fasting, break the fast after the aarti with the sanctified food.',
        hi: 'घी के दीपक, कपूर और घंटी के साथ दुर्गा आरती करें। सभी भक्तों में प्रसाद (हलवा-पूरी-चना) वितरित करें। यदि उपवास है तो आरती के बाद पवित्र भोजन से व्रत खोलें।',
        sa: 'घृतदीपेन कर्पूरेण घण्टया च दुर्गाआरात्रिकं कुर्यात्। सर्वेभ्यो भक्तेभ्यः प्रसादं (हल्वापूरीचनकम्) वितरेत्। यदि उपवासः, आरात्रिकानन्तरं पवित्रभोजनेन व्रतं भिन्द्यात्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'chamunda-mantra',
      name: { en: 'Chamunda Mantra', hi: 'चामुण्डा मंत्र', sa: 'चामुण्डामन्त्रः' },
      devanagari: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे।\nजयन्ती मङ्गला काली भद्रकाली कपालिनी।\nदुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते॥',
      iast: 'oṃ aiṃ hrīṃ klīṃ cāmuṇḍāyai vicce |\njayantī maṅgalā kālī bhadrakālī kapālinī |\ndurgā kṣamā śivā dhātrī svāhā svadhā namo\'stu te ||',
      meaning: {
        en: 'Om, with Aim, Hrim, Klim, I invoke Chamunda. Victory-giver, auspicious Kali, Bhadrakali, skull-bearer, Durga, the forgiving, Shiva, the sustainer — Svaha, Svadha, salutations to you.',
        hi: 'ॐ, ऐं, ह्रीं, क्लीं से चामुण्डा का आह्वान। जयन्ती, मंगला, काली, भद्रकाली, कपालिनी, दुर्गा, क्षमाशील, शिवा, धात्री — स्वाहा, स्वधा, आपको नमस्कार।',
        sa: 'ॐ, ऐं, ह्रीं, क्लीं, चामुण्डाम् आवाहयामि। जयन्ती मङ्गला काली भद्रकाली कपालिनी दुर्गा क्षमा शिवा धात्री — स्वाहा स्वधा तुभ्यं नमः।',
      },
      usage: {
        en: 'Chant 108 times during Sandhi Puja. This is the primary mantra for Maha Ashtami.',
        hi: 'सन्धि पूजा के दौरान 108 बार जपें। यह महा अष्टमी का प्रमुख मंत्र है।',
        sa: 'सन्धिपूजाकाले अष्टोत्तरशतवारं जपेत्। एषः महाष्टम्याः प्रधानमन्त्रः।',
      },
      japaCount: 108,
    },
    {
      id: 'ashtami-mantra',
      name: { en: 'Durga Ashtami Mantra', hi: 'दुर्गा अष्टमी मंत्र', sa: 'दुर्गाष्टमीमन्त्रः' },
      devanagari: 'ॐ देवी दुर्गायै नमः।\nया देवी सर्वभूतेषु शक्तिरूपेण संस्थिता।\nनमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥',
      iast: 'oṃ devī durgāyai namaḥ |\nyā devī sarvabhūteṣu śaktirūpeṇa saṃsthitā |\nnamastasyai namastasyai namastasyai namo namaḥ ||',
      meaning: {
        en: 'Om, salutations to Goddess Durga. The Goddess who resides in all beings in the form of power (Shakti) — I bow to her, I bow to her, I bow to her again and again.',
        hi: 'ॐ, देवी दुर्गा को नमस्कार। जो देवी सभी प्राणियों में शक्ति रूप में विराजमान हैं — उन्हें नमस्कार, उन्हें नमस्कार, उन्हें बारम्बार नमस्कार।',
        sa: 'ॐ, देवी दुर्गायै नमः। या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता — तस्यै नमः, तस्यै नमः, तस्यै पुनः पुनः नमः।',
      },
      usage: {
        en: 'Recite during the havan, offering each ahuti with "Svaha" after the mantra.',
        hi: 'हवन के दौरान पाठ करें, मंत्र के बाद "स्वाहा" कहकर प्रत्येक आहुति दें।',
        sa: 'हवनकाले पठेत्, मन्त्रानन्तरं "स्वाहा" इति वदन् प्रत्येकम् आहुतिं दद्यात्।',
      },
      japaCount: 108,
    },
    {
      id: 'mahagauri-mantra',
      name: { en: 'Mahagauri Mantra (Day 8 Navadurga)', hi: 'महागौरी मंत्र (दिन 8 नवदुर्गा)', sa: 'महागौरीमन्त्रः (अष्टमदिननवदुर्गा)' },
      devanagari: 'ॐ देवी महागौर्यै नमः।\nश्वेते वृषे समारूढा श्वेताम्बरधरा शुचिः।\nमहागौरी शुभं दद्यान्महादेवप्रमोददा॥',
      iast: 'oṃ devī mahāgauryai namaḥ |\nśvete vṛṣe samārūḍhā śvetāmbaradharā śuciḥ |\nmahāgaurī śubhaṃ dadyānmahādevapramodadā ||',
      meaning: {
        en: 'Om, salutations to Goddess Mahagauri. She who rides a white bull, wears white garments, is pure — may Mahagauri, who delights Mahadeva, bestow auspiciousness.',
        hi: 'ॐ, देवी महागौरी को नमस्कार। जो श्वेत वृषभ पर विराजमान हैं, श्वेत वस्त्र धारण करती हैं, पवित्र हैं — महागौरी, जो महादेव को प्रसन्न करती हैं, शुभ प्रदान करें।',
        sa: 'ॐ, देवी महागौर्यै नमः। श्वेतवृषारूढा श्वेताम्बरधारिणी शुचिः — महागौरी महादेवप्रमोददा शुभं दद्यात्।',
      },
      usage: {
        en: 'Chant specifically on the 8th day of Navratri during the morning puja.',
        hi: 'नवरात्रि के 8वें दिन प्रातः पूजा के दौरान विशेष रूप से जपें।',
        sa: 'नवरात्र्याः अष्टमे दिने प्रातःपूजाकाले विशेषतः जपेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Halwa-Puri-Chana is the traditional offering for Durga Ashtami. Also offer fresh fruits, coconut, kheer, and sweets. All food must be sattvic (pure vegetarian without onion and garlic).',
    hi: 'हलवा-पूरी-चना दुर्गा अष्टमी का पारम्परिक नैवेद्य है। ताज़े फल, नारियल, खीर और मिठाइयाँ भी अर्पित करें। सभी भोजन सात्विक (प्याज़-लहसुन रहित शुद्ध शाकाहारी) होना चाहिए।',
    sa: 'हल्वापूरीचनकं दुर्गाष्टम्याः पारम्परिकं नैवेद्यम्। नवफलानि नारिकेलं पायसं मिष्टान्नानि च समर्पयेत्। सर्वं भोजनं सात्त्विकं (पलाण्डुलशुनरहितं शुद्धशाकाहारम्) स्यात्।',
  },

  precautions: [
    {
      en: 'Sandhi Puja timing must be precise — consult the Panchang for the exact Ashtami-Navami sandhi moment. Missing this window significantly reduces the puja\'s merit.',
      hi: 'सन्धि पूजा का समय सटीक होना चाहिए — अष्टमी-नवमी सन्धि के सही क्षण के लिए पंचांग देखें। इस समय को चूकने से पूजा के पुण्य में अत्यधिक कमी होती है।',
      sa: 'सन्धिपूजायाः कालः यथार्थः स्यात् — अष्टमीनवम्योः सन्धिक्षणाय पञ्चाङ्गं परामृशेत्। अस्य समयस्य लोपेन पूजायाः पुण्यं बहुशः न्यूनी भवति।',
    },
    {
      en: 'During Kanya Puja, treat the girls with utmost devotion as living embodiments of the Goddess. Never disrespect or rush the ceremony.',
      hi: 'कन्या पूजन में कन्याओं के साथ देवी का जीवित स्वरूप मानकर अत्यन्त भक्ति से व्यवहार करें। कभी अनादर न करें या रस्म में जल्दबाज़ी न करें।',
      sa: 'कन्यापूजने कन्याः देव्याः जीवन्मूर्तिरूपेण परमभक्त्या व्यवहरेत्। कदापि अनादरं मा कुर्यात् कर्मणि त्वरां वा मा कुर्यात्।',
    },
    {
      en: 'The havan fire must be properly contained. Ensure fire safety and do not leave the havan kund unattended.',
      hi: 'हवन की अग्नि ठीक से नियन्त्रित होनी चाहिए। अग्नि सुरक्षा सुनिश्चित करें और हवन कुण्ड को लावारिस न छोड़ें।',
      sa: 'हवनाग्निः सम्यक् नियन्त्रिता स्यात्। अग्निसुरक्षां सुनिश्चितां कुर्यात् हवनकुण्डम् अनवधानं मा त्यजेत्।',
    },
  ],

  phala: {
    en: 'Durga Ashtami is considered the most powerful day of Navratri. Proper observance destroys all sins and enemies, grants divine protection, bestows courage and strength, fulfils desires, and accelerates spiritual progress. Sandhi Puja performed at the correct time yields the merit of worshipping Durga for an entire year.',
    hi: 'दुर्गा अष्टमी नवरात्रि का सबसे शक्तिशाली दिन माना जाता है। सही आचरण से सभी पापों और शत्रुओं का नाश होता है, दिव्य रक्षा, साहस और शक्ति मिलती है, मनोकामनाएँ पूर्ण होती हैं और आध्यात्मिक प्रगति तीव्र होती है। सही समय पर सन्धि पूजा करने से पूरे वर्ष दुर्गा पूजा का पुण्य मिलता है।',
    sa: 'दुर्गाष्टमी नवरात्र्याः शक्तिमत्तमं दिनं मन्यते। सम्यगाचरणेन सर्वपापशत्रुनाशः, दिव्यरक्षा, साहसशक्तिप्रदानम्, मनोरथसिद्धिः, आध्यात्मिकप्रगत्यभिवृद्धिश्च भवति। सम्यक्काले सन्धिपूजा कृता सम्पूर्णवर्षं दुर्गापूजायाः पुण्यं ददाति।',
  },
};

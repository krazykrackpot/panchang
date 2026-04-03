import type { PujaVidhi } from './types';

export const GURU_NANAK_JAYANTI_PUJA: PujaVidhi = {
  festivalSlug: 'guru-nanak-jayanti',
  category: 'festival',
  deity: { en: 'Guru Nanak Dev Ji', hi: 'गुरु नानक देव जी', sa: 'गुरुनानकदेवः' },

  samagri: [
    { name: { en: 'Guru Granth Sahib (or image of Guru Nanak)', hi: 'गुरु ग्रन्थ साहिब (या गुरु नानक का चित्र)', sa: 'गुरुग्रन्थसाहिबः (गुरुनानकस्य चित्रं वा)' }, category: 'puja_items', essential: true },
    { name: { en: 'Fresh flowers (marigold, roses)', hi: 'ताजे फूल (गेंदा, गुलाब)', sa: 'नवपुष्पाणि (स्थलपद्मानि पाटलपुष्पाणि)' }, category: 'flowers', essential: true },
    { name: { en: 'Karah Prasad ingredients (flour, ghee, sugar)', hi: 'कड़ाह प्रसाद सामग्री (आटा, घी, शक्कर)', sa: 'कराहप्रसादसामग्री (गोधूमचूर्णं घृतं शर्करा)' }, category: 'food', essential: true },
    { name: { en: 'Ghee lamps (jyoti)', hi: 'घी के दीपक (ज्योति)', sa: 'घृतदीपाः (ज्योतिः)' }, quantity: '5', category: 'puja_items', essential: true },
    { name: { en: 'Incense (agarbatti / dhoop)', hi: 'अगरबत्ती / धूप', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'White cloth for altar', hi: 'वेदी के लिए सफ़ेद कपड़ा', sa: 'वेद्यर्थं श्वेतवस्त्रम्' }, category: 'clothing', essential: true },
    { name: { en: 'Langar ingredients (dal, roti, rice, sabzi)', hi: 'लंगर सामग्री (दाल, रोटी, चावल, सब्ज़ी)', sa: 'लङ्गरसामग्री (सूपः रोटिका तण्डुलाः शाकानि)' }, category: 'food', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Chaur Sahib (ceremonial whisk)', hi: 'चौर साहिब (औपचारिक चँवर)', sa: 'चामरम् (औपचारिकम्)' }, note: { en: 'Used for waving over Guru Granth Sahib', hi: 'गुरु ग्रन्थ साहिब पर चँवर करने हेतु', sa: 'गुरुग्रन्थसाहिबोपरि चामरवीजनार्थम्' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Celebrations begin in the early morning (Amrit Vela, around 4-5 AM) with Prabhat Pheri (dawn procession). The Akhand Path (48-hour continuous reading of Guru Granth Sahib) concludes on this day. Main celebrations continue throughout the day at Gurdwaras.',
    hi: 'उत्सव प्रातःकाल (अमृत वेला, लगभग 4-5 बजे) प्रभात फेरी (सुबह की शोभायात्रा) से आरम्भ होता है। अखण्ड पाठ (गुरु ग्रन्थ साहिब का 48 घण्टे का निरन्तर पाठ) इस दिन समाप्त होता है। गुरुद्वारों में मुख्य उत्सव दिन भर जारी रहता है।',
    sa: 'उत्सवः प्रभातकाले (अमृतवेलायां, प्रातः चतुर्थपञ्चमवादनयोः) प्रभातफेर्या (प्रभातशोभायात्रया) आरभ्यते। अखण्डपाठः (गुरुग्रन्थसाहिबस्य अष्टचत्वारिंशद्घण्टीयनिरन्तरपाठः) अस्मिन् दिवसे समाप्यते। गुरुद्वारेषु मुख्योत्सवः दिनपर्यन्तं प्रवर्तते।',
  },

  sankalpa: {
    en: 'On this sacred day of Kartik Purnima, the birth anniversary of Guru Nanak Dev Ji, I dedicate myself to the remembrance of Waheguru, service to humanity (sewa), truthful living, and sharing with the needy. I honour Guru Nanak\'s teachings of equality, compassion, and devotion to the One Creator.',
    hi: 'कार्तिक पूर्णिमा के इस पवित्र दिन, गुरु नानक देव जी की जन्म जयन्ती पर, मैं वाहेगुरु के स्मरण, मानवता की सेवा (सेवा), सत्यपूर्ण जीवन और ज़रूरतमन्दों के साथ बाँटने के लिए स्वयं को समर्पित करता/करती हूँ। मैं गुरु नानक की समानता, करुणा और एक ईश्वर की भक्ति की शिक्षाओं का सम्मान करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे कार्तिकपूर्णिमादिवसे गुरुनानकदेवस्य जन्मजयन्त्यां वाहेगुरुस्मरणाय मानवसेवायै सत्यजीवनाय दीनैः सह विभजनाय चात्मानं समर्पयामि। गुरुनानकस्य समत्वकरुणाएकेश्वरभक्तिशिक्षाः सम्मानयामि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Prabhat Pheri (Dawn Procession)', hi: 'प्रभात फेरी (सुबह की शोभायात्रा)', sa: 'प्रभातफेरी (प्रभातशोभायात्रा)' },
      description: {
        en: 'Rise during Amrit Vela (pre-dawn, around 4 AM). Join the Prabhat Pheri — a community procession through the neighbourhood singing shabads (devotional hymns) from Guru Granth Sahib. The Nishan Sahib (Sikh flag) leads the procession.',
        hi: 'अमृत वेला (प्रभात से पहले, लगभग 4 बजे) में उठें। प्रभात फेरी में शामिल हों — गुरु ग्रन्थ साहिब के शब्दों (भक्ति गीतों) का गायन करते हुए मोहल्ले में सामुदायिक शोभायात्रा। निशान साहिब (सिख ध्वज) शोभायात्रा का नेतृत्व करता है।',
        sa: 'अमृतवेलायां (प्रभातपूर्वं, प्रातः चतुर्थवादने) उत्तिष्ठेत्। प्रभातफेर्यां सम्मिलेत् — गुरुग्रन्थसाहिबतः शब्दान् (भक्तिगीतान्) गायन्तः ग्रामे सामुदायिकशोभायात्रा। निशानसाहिबः (सिखध्वजः) शोभायात्रायाः नेतृत्वं करोति।',
      },
      duration: '60 min',
      essential: false,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Japji Sahib Recitation', hi: 'जपजी साहिब पाठ', sa: 'जपजीसाहिबपाठः' },
      description: {
        en: 'Recite the complete Japji Sahib, the morning prayer composed by Guru Nanak Dev Ji. This is the opening composition of Guru Granth Sahib and encapsulates the core spiritual teachings. Recite with focus on the Mool Mantar.',
        hi: 'गुरु नानक देव जी द्वारा रचित प्रातःकालीन प्रार्थना, सम्पूर्ण जपजी साहिब का पाठ करें। यह गुरु ग्रन्थ साहिब की आरम्भिक रचना है और मूल आध्यात्मिक शिक्षाओं का सार है। मूल मन्तर पर ध्यान केन्द्रित करके पाठ करें।',
        sa: 'गुरुनानकदेवेन रचितां प्रातःकालीनप्रार्थनां सम्पूर्णजपजीसाहिबं पठेत्। एषा गुरुग्रन्थसाहिबस्य आरम्भिकरचना मूलाध्यात्मिकशिक्षाणां सारश्च। मूलमन्त्रे ध्यानं केन्द्रीकृत्य पठेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 3,
      title: { en: 'Gurdwara Visit & Kirtan', hi: 'गुरुद्वारा दर्शन एवं कीर्तन', sa: 'गुरुद्वारदर्शनं कीर्तनं च' },
      description: {
        en: 'Visit the Gurdwara for darshan. Participate in the special Kirtan (devotional singing) programmes. Listen to katha (discourse) about Guru Nanak\'s life, travels (Udasis), and teachings. Bow before Guru Granth Sahib with reverence.',
        hi: 'गुरुद्वारा दर्शन के लिए जाएँ। विशेष कीर्तन (भक्ति संगीत) कार्यक्रमों में भाग लें। गुरु नानक के जीवन, यात्राओं (उदासियों) और शिक्षाओं के बारे में कथा (प्रवचन) सुनें। गुरु ग्रन्थ साहिब के आगे श्रद्धापूर्वक शीश नवाएँ।',
        sa: 'गुरुद्वारं दर्शनार्थं गच्छेत्। विशेषकीर्तन (भक्तिगायन) कार्यक्रमेषु भागं गृह्णीयात्। गुरुनानकस्य जीवनं यात्राः (उदासीः) शिक्षाश्च कथारूपेण शृणुयात्। गुरुग्रन्थसाहिबस्य पुरतः श्रद्धया शिरो नमयेत्।',
      },
      duration: '90 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Akhand Path Bhog (Completion)', hi: 'अखण्ड पाठ भोग (समापन)', sa: 'अखण्डपाठभोगः (समापनम्)' },
      description: {
        en: 'Attend the Bhog (completion ceremony) of the Akhand Path — the 48-hour non-stop reading of the entire Guru Granth Sahib that was started two days before. This culminates with Ardas (congregational prayer) and Hukamnama (divine command from a random opening of the scripture).',
        hi: 'अखण्ड पाठ का भोग (समापन समारोह) में सम्मिलित हों — दो दिन पहले आरम्भ हुए सम्पूर्ण गुरु ग्रन्थ साहिब का 48 घण्टे का निरन्तर पाठ। यह अरदास (सामूहिक प्रार्थना) और हुकमनामा (ग्रन्थ के यदृच्छिक उद्घाटन से दैवी आदेश) के साथ पूर्ण होता है।',
        sa: 'अखण्डपाठस्य भोगं (समापनसमारोहं) उपतिष्ठेत् — द्वयोः दिवसयोः पूर्वम् आरब्धस्य सम्पूर्णगुरुग्रन्थसाहिबस्य अष्टचत्वारिंशद्घण्टीयनिरन्तरपाठः। एतत् अरदासेन (सामुदायिकप्रार्थनया) हुकमनामेन (ग्रन्थस्य यादृच्छिकोद्घाटनेन दैवीनिर्देशेन) च समाप्यते।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 5,
      title: { en: 'Sewa (Selfless Service)', hi: 'सेवा (निःस्वार्थ सेवा)', sa: 'सेवा (निःस्वार्थसेवा)' },
      description: {
        en: 'Participate in sewa (selfless service) at the Gurdwara or community. Help prepare and serve Langar (community kitchen meal) to all, regardless of caste, creed, or status. This is the central practice honouring Guru Nanak\'s teaching of equality.',
        hi: 'गुरुद्वारे या समुदाय में सेवा (निःस्वार्थ सेवा) करें। जाति, धर्म या स्थिति की भेदभाव के बिना सभी को लंगर (सामुदायिक भोजन) बनाने और परोसने में सहायता करें। यह गुरु नानक की समानता की शिक्षा का सम्मान करने वाला केन्द्रीय अभ्यास है।',
        sa: 'गुरुद्वारे समुदाये वा सेवां (निःस्वार्थसेवां) कुर्यात्। जातिधर्मस्थितिभेदं विना सर्वेभ्यः लङ्गरं (सामुदायिकभोजनं) सज्जयितुं परिवेषयितुं च साहाय्यं कुर्यात्। एषा गुरुनानकस्य समत्वशिक्षायाः सम्मानस्य केन्द्रीयसाधना।',
      },
      duration: '120 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Evening Illumination & Closing', hi: 'सायंकालीन दीपोत्सव एवं समापन', sa: 'सायंदीपोत्सवः समापनं च' },
      description: {
        en: 'In the evening, light lamps and candles at home and at the Gurdwara in celebration. Gurdwaras and homes are illuminated with lights (similar to Diwali). Attend the Rehras Sahib (evening prayer). Share sweets, especially Karah Prasad, with all visitors and neighbours.',
        hi: 'सायंकाल को उत्सव में घर और गुरुद्वारे पर दीपक और मोमबत्तियाँ जलाएँ। गुरुद्वारे और घर रोशनी से सजाए जाते हैं (दीवाली के समान)। रहरास साहिब (सायं प्रार्थना) में उपस्थित हों। सभी अतिथियों और पड़ोसियों के साथ मिठाई, विशेषकर कड़ाह प्रसाद बाँटें।',
        sa: 'सायङ्काले उत्सवे गृहे गुरुद्वारे च दीपान् ज्वालयेत्। गुरुद्वाराणि गृहाणि च प्रकाशैः सज्जितानि (दीपावलीसदृशम्)। रहरासपाठे उपतिष्ठेत्। सर्वैः अतिथिभिः प्रतिवेशिभिश्च सह मिष्टान्नानि विशेषतः कराहप्रसादं विभजेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'guru-nanak-mool-mantar',
      name: { en: 'Mool Mantar', hi: 'मूल मन्तर', sa: 'मूलमन्त्रः' },
      devanagari: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ\nਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥\n\nइक ओंकार सतिनामु करता पुरखु निरभउ निरवैरु\nअकाल मूरति अजूनी सैभं गुर प्रसादि॥',
      iast: 'ik oṃkār satināmu karatā purakhu nirbhau nirvair\nakāl mūrati ajūnī saibhaṃ gur prasādi ||',
      meaning: {
        en: 'There is One Creator, whose name is Truth, the creative being, without fear, without enmity, timeless in form, beyond birth, self-existent, known by the Guru\'s grace.',
        hi: 'एक ईश्वर है, जिसका नाम सत्य है, जो रचयिता पुरुष है, निर्भय, निर्वैर, अकाल मूर्ति, अजन्मा, स्वयम्भू, गुरु की कृपा से ज्ञात।',
        sa: 'एक ओंकारः सत्यनामा रचयिता पुरुषः निर्भयः निर्वैरः अकालमूर्तिः अजन्मा स्वयम्भूः गुरुप्रसादात् ज्ञातः।',
      },
      japaCount: 108,
      usage: { en: 'The foundational prayer; recite as the opening of all devotions on this day', hi: 'मूलभूत प्रार्थना; इस दिन सभी भक्ति कार्यों के आरम्भ में पाठ करें', sa: 'मूलभूतप्रार्थना; अस्मिन् दिवसे सर्वभक्तिकार्याणाम् आरम्भे पठेत्' },
    },
    {
      id: 'guru-nanak-waheguru',
      name: { en: 'Waheguru Jaap', hi: 'वाहेगुरु जाप', sa: 'वाहेगुरुजापः' },
      devanagari: 'ਵਾਹਿਗੁਰੂ ਵਾਹਿਗੁਰੂ ਵਾਹਿਗੁਰੂ ਵਾਹਿਗੁਰੂ\n\nवाहेगुरु वाहेगुरु वाहेगुरु वाहेगुरु',
      iast: 'vāhegurū vāhegurū vāhegurū vāhegurū',
      meaning: {
        en: 'Wonderful Lord! Wonderful Guru! — the ecstatic exclamation of the Divine Name, expressing wonder at the Creator\'s greatness.',
        hi: 'अद्भुत गुरु! अद्भुत प्रभु! — दिव्य नाम का आनन्दमय उद्गार, सृष्टिकर्ता की महानता पर विस्मय व्यक्त करता है।',
        sa: 'अद्भुतगुरुः! अद्भुतप्रभुः! — दिव्यनाम्नः आनन्दमयः उद्गारः, सृष्टिकर्तुः महत्त्वे विस्मयं प्रकटयति।',
      },
      japaCount: 108,
      usage: { en: 'Continuous chanting (Naam Simran) throughout the day as meditation', hi: 'दिन भर ध्यान के रूप में निरन्तर जाप (नाम सिमरन)', sa: 'दिनपर्यन्तं ध्यानरूपेण निरन्तरजपः (नामसिमरणम्)' },
    },
  ],

  naivedya: {
    en: 'Karah Prasad (sacred pudding made from equal parts wheat flour, ghee, and sugar) is the primary offering. Langar — a full community meal of dal, roti, rice, and sabzi — is served free to all visitors. Sweets and fruits are also distributed.',
    hi: 'कड़ाह प्रसाद (समान मात्रा में गेहूँ का आटा, घी और शक्कर से बना पवित्र हलवा) मुख्य प्रसाद है। लंगर — दाल, रोटी, चावल और सब्ज़ी का पूर्ण सामुदायिक भोजन — सभी आगन्तुकों को निःशुल्क परोसा जाता है। मिठाई और फल भी बाँटे जाते हैं।',
    sa: 'कराहप्रसादः (समानमात्रायां गोधूमचूर्णं घृतं शर्करा इति निर्मितः पवित्रपायसः) मुख्यप्रसादः। लङ्गरम् — सूपः रोटिका तण्डुलाः शाकानि इति सम्पूर्णसामुदायिकभोजनम् — सर्वेभ्यः आगन्तुकेभ्यः निःशुल्कं परिवेष्यते। मिष्टान्नानि फलानि च वितर्यन्ते।',
  },

  precautions: [
    {
      en: 'Cover your head when entering the Gurdwara or while reciting from Guru Granth Sahib. Remove shoes before entering the prayer hall.',
      hi: 'गुरुद्वारे में प्रवेश करते समय या गुरु ग्रन्थ साहिब से पाठ करते समय सिर ढकें। प्रार्थना कक्ष में प्रवेश से पहले जूते उतारें।',
      sa: 'गुरुद्वारं प्रविशन् गुरुग्रन्थसाहिबतः पठन् वा शिरः आच्छादयेत्। प्रार्थनाकक्षप्रवेशात् पूर्वं पादत्राणानि उत्तारयेत्।',
    },
    {
      en: 'Maintain vegetarian food on this day. Avoid alcohol, tobacco, and all intoxicants as per Sikh teachings.',
      hi: 'इस दिन शाकाहारी भोजन रखें। सिख शिक्षाओं के अनुसार मद्य, तम्बाकू और सभी मादक पदार्थों से बचें।',
      sa: 'अस्मिन् दिवसे शाकाहारं पालयेत्। सिखशिक्षानुसारं मद्यं धूम्रपानं सर्वमादकपदार्थांश्च वर्जयेत्।',
    },
    {
      en: 'Guru Nanak Jayanti is a celebration of interfaith harmony. Welcome people of all faiths and backgrounds to participate in Langar and prayers.',
      hi: 'गुरु नानक जयन्ती अन्तर्धार्मिक सद्भाव का उत्सव है। सभी धर्मों और पृष्ठभूमि के लोगों का लंगर और प्रार्थनाओं में स्वागत करें।',
      sa: 'गुरुनानकजयन्ती अन्तर्धर्मसद्भावस्य उत्सवः। सर्वधर्मपृष्ठभूमीनां जनान् लङ्गरे प्रार्थनासु च स्वागतं कुर्यात्।',
    },
  ],

  phala: {
    en: 'Celebrating Guru Nanak Jayanti with devotion bestows spiritual awakening, inner peace, and divine grace. The practice of Langar sewa brings the merit of feeding thousands and cultivates humility and equality. Naam Simran (chanting the Divine Name) purifies the mind and brings one closer to Waheguru. Guru Nanak\'s blessings remove ego, attachment, and the cycle of suffering.',
    hi: 'भक्ति से गुरु नानक जयन्ती मनाने से आध्यात्मिक जागृति, आन्तरिक शान्ति और दैवी कृपा प्राप्त होती है। लंगर सेवा से हज़ारों को भोजन कराने का पुण्य मिलता है और विनम्रता एवं समानता विकसित होती है। नाम सिमरन (दिव्य नाम जप) मन को शुद्ध करता है और वाहेगुरु के समीप लाता है। गुरु नानक का आशीर्वाद अहंकार, मोह और दुःख चक्र को दूर करता है।',
    sa: 'भक्त्या गुरुनानकजयन्तीं मानयन् आध्यात्मिकजागृतिम् आन्तरिकशान्तिं दैवीकृपां च प्राप्नोति। लङ्गरसेवया सहस्राणां भोजनस्य पुण्यं विनम्रतासमत्वयोः विकासश्च भवति। नामसिमरणेन मनः शुद्ध्यति वाहेगुरोः समीपं च नीयते। गुरुनानकस्य आशीर्वादेन अहङ्कारः मोहः दुःखचक्रं च निवर्तते।',
  },
};

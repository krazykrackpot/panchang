import type { PujaVidhi } from './types';

export const MANGALVAR_VRAT_PUJA: PujaVidhi = {
  festivalSlug: 'mangalvar-vrat',
  category: 'vrat',
  deity: { en: 'Lord Hanuman', hi: 'भगवान हनुमान', sa: 'हनुमान्' },

  samagri: [
    { name: { en: 'Sindoor (vermillion)', hi: 'सिन्दूर', sa: 'सिन्दूरम्' }, essential: true, note: { en: 'Hanuman loves sindoor — mix with oil and apply on idol', hi: 'हनुमान को सिन्दूर अत्यन्त प्रिय है — तेल में मिलाकर मूर्ति पर लगाएँ', sa: 'हनुमते सिन्दूरं प्रियतमम् — तैलेन मिश्रयित्वा मूर्तौ लिम्पेत्' } },
    { name: { en: 'Jasmine oil (chameli tel)', hi: 'चमेली का तेल', sa: 'मल्लिकातैलम्' }, essential: true },
    { name: { en: 'Sacred thread (janeyu / moli)', hi: 'जनेऊ / मौली', sa: 'यज्ञोपवीतम् / मौलिसूत्रम्' } },
    { name: { en: 'Red flowers (hibiscus preferred)', hi: 'लाल फूल (गुड़हल श्रेष्ठ)', sa: 'रक्तपुष्पाणि (जपापुष्पं श्रेष्ठम्)' } },
    { name: { en: 'Bananas', hi: 'केले', sa: 'कदलीफलानि' } },
    { name: { en: 'Besan laddoo (gram flour sweets)', hi: 'बेसन के लड्डू', sa: 'चणकचूर्णमोदकाः' } },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Mangalvar Vrat puja is best performed during Pradosh Kala (evening twilight) on Tuesday. Hanuman temples are especially vibrant on Tuesday evenings. Morning puja at Brahma Muhurta is also acceptable.',
    hi: 'मंगलवार व्रत पूजा प्रदोष काल (सन्ध्या समय) में करना सर्वोत्तम है। मंगलवार सायं हनुमान मन्दिर विशेष रूप से जीवन्त होते हैं। ब्रह्म मुहूर्त में प्रातः पूजा भी स्वीकार्य है।',
    sa: 'मङ्गलवारव्रतपूजा प्रदोषकाले (सन्ध्याकाले) कर्तव्या। मङ्गलवासरसायं हनुमन्मन्दिराणि विशेषेण जीवन्तानि। ब्रह्ममुहूर्ते प्रातःपूजा अपि स्वीकार्या।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Tuesday, I observe Mangalvar Vrat and worship Lord Hanuman for courage, protection from evil forces, removal of Mars dosha, and divine strength.',
    hi: 'इस पवित्र मंगलवार को, मैं साहस, दुष्ट शक्तियों से रक्षा, मंगल दोष निवारण और दिव्य शक्ति के लिए मंगलवार व्रत और हनुमान पूजन का संकल्प करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रमङ्गलवासरे शौर्यार्थं दुष्टशक्तिरक्षणार्थं मङ्गलदोषनिवारणार्थं दिव्यबलार्थं च मङ्गलवारव्रतं हनुमत्पूजनं च करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Take a bath before puja. Wear clean red or orange clothes if possible, as these are Hanuman\'s colors. Maintain celibacy and avoid tamasic food on this day.',
        hi: 'पूजा से पहले स्नान करें। यदि सम्भव हो तो स्वच्छ लाल या केसरिया वस्त्र पहनें, ये हनुमान के रंग हैं। इस दिन ब्रह्मचर्य पालन करें और तामसिक भोजन से बचें।',
        sa: 'पूजायाः प्राक् स्नानं कुर्यात्। यदि शक्यं शुचिरक्तकाषायवस्त्राणि धारयेत्, एतानि हनुमतः वर्णाः। अस्मिन् दिने ब्रह्मचर्यं पालयेत् तामसिकाहारं च त्यजेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit before the Hanuman idol or image. Hold water in the right palm. State your name, gotra, and the purpose of the vrat — courage, protection, or Mars dosha remedy.',
        hi: 'हनुमान मूर्ति या चित्र के सामने बैठें। दाहिने हाथ में जल लें। अपना नाम, गोत्र और व्रत का उद्देश्य बोलें — साहस, रक्षा, या मंगल दोष निवारण।',
        sa: 'हनुमन्मूर्तेः चित्रस्य वा पुरतः उपविशेत्। दक्षिणहस्ते जलं गृह्णीयात्। स्वनाम गोत्रं व्रतप्रयोजनं च वदेत् — शौर्यं रक्षणं मङ्गलदोषनिवारणं वा।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Sindoor & Oil Offering', hi: 'सिन्दूर एवं तेल अर्पण', sa: 'सिन्दूरतैलार्पणम्' },
      description: {
        en: 'Mix sindoor with jasmine oil and apply it generously on the Hanuman idol. This is the most distinctive offering to Hanuman — He smeared sindoor on his entire body out of devotion to Sita. Offer the sacred thread (janeyu/moli).',
        hi: 'सिन्दूर को चमेली के तेल में मिलाकर हनुमान मूर्ति पर भरपूर लगाएँ। यह हनुमान को सबसे विशिष्ट अर्पण है — उन्होंने सीता के प्रति भक्ति से अपने पूरे शरीर पर सिन्दूर लगाया था। जनेऊ/मौली अर्पित करें।',
        sa: 'सिन्दूरं मल्लिकातैलेन मिश्रयित्वा हनुमन्मूर्तौ प्रचुरं लिम्पेत्। एतत् हनुमते विशिष्टतमार्पणम् — सः सीताभक्त्या सर्वशरीरे सिन्दूरं अलिम्पत्। यज्ञोपवीतं मौलिसूत्रं च अर्पयेत्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Hanuman Chalisa Recitation', hi: 'हनुमान चालीसा पाठ', sa: 'हनुमच्चालीसापाठः' },
      description: {
        en: 'Recite the Hanuman Chalisa (40 verses by Tulsidas) with devotion. This is the most popular and powerful prayer to Hanuman. If time permits, recite it 2, 3, or 7 times for greater effect.',
        hi: 'भक्तिपूर्वक हनुमान चालीसा (तुलसीदास कृत 40 चौपाइयाँ) का पाठ करें। यह हनुमान की सबसे लोकप्रिय और शक्तिशाली प्रार्थना है। यदि समय हो तो 2, 3 या 7 बार पाठ करें।',
        sa: 'भक्त्या हनुमच्चालीसां (तुलसीदासकृतां चत्वारिंशच्चौपदीः) पठेत्। एषा हनुमतः लोकप्रियतमा शक्तिशालिनी च प्रार्थना। यदि कालः अस्ति द्विवारं त्रिवारं सप्तवारं वा पठेत्।',
      },
      essential: true,
      stepType: 'mantra',
      duration: '15 min',
    },
    {
      step: 5,
      title: { en: 'Hanuman Beej Mantra Japa', hi: 'हनुमान बीज मन्त्र जप', sa: 'हनुमद्बीजमन्त्रजपः' },
      description: {
        en: 'Chant the Hanuman Beej Mantra 108 times using a mala. This concentrated mantra invokes Hanuman\'s protective energy and is especially potent for removing fears and obstacles.',
        hi: 'माला से हनुमान बीज मन्त्र का 108 बार जप करें। यह संकेन्द्रित मन्त्र हनुमान की रक्षात्मक ऊर्जा का आवाहन करता है और भय एवं बाधाओं को दूर करने में विशेष प्रभावशाली है।',
        sa: 'मालया हनुमद्बीजमन्त्रम् अष्टोत्तरशतवारं जपेत्। एषः सङ्केन्द्रितमन्त्रः हनुमतः रक्षात्मकशक्तिम् आवाहयति भयविघ्ननिवारणे च विशेषप्रभावशाली।',
      },
      mantraRef: 'hanuman-beej',
      essential: true,
      stepType: 'mantra',
      duration: '10 min',
    },
    {
      step: 6,
      title: { en: 'Aarti & Conclusion', hi: 'आरती एवं समापन', sa: 'आरती समापनं च' },
      description: {
        en: 'Perform aarti with a ghee lamp. Offer bananas and besan laddoo as naivedya — these are Hanuman\'s favorite foods. Distribute prasad. Conclude with dandavat pranam (full-body prostration).',
        hi: 'घी के दीपक से आरती करें। केले और बेसन के लड्डू नैवेद्य के रूप में अर्पित करें — ये हनुमान का प्रिय भोजन है। प्रसाद वितरित करें। दण्डवत प्रणाम से समापन करें।',
        sa: 'घृतदीपेन आरतिं कुर्यात्। कदलीफलानि चणकचूर्णमोदकान् च नैवेद्यरूपेण अर्पयेत् — एतानि हनुमतः प्रियभोजनानि। प्रसादं वितरेत्। दण्डवत्प्रणामेन समापयेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'hanuman-beej',
      name: { en: 'Hanuman Beej Mantra', hi: 'हनुमान बीज मन्त्र', sa: 'हनुमद्बीजमन्त्रः' },
      devanagari: 'ॐ ऐं भ्रीं हनुमन्ताय नमः',
      iast: 'oṃ aiṃ bhrīṃ hanumantāya namaḥ',
      meaning: {
        en: 'Om, salutations to Hanuman with the seed syllables of wisdom (aim) and strength (bhrim). This mantra invokes Hanuman\'s full divine power.',
        hi: 'ॐ, ज्ञान (ऐं) और शक्ति (भ्रीं) के बीजाक्षरों सहित हनुमान को नमन। यह मन्त्र हनुमान की पूर्ण दिव्य शक्ति का आवाहन करता है।',
        sa: 'ओम्, ज्ञानस्य (ऐं) बलस्य (भ्रीं) बीजाक्षरैः सह हनुमते नमः। एषः मन्त्रः हनुमतः पूर्णदिव्यशक्तिम् आवाहयति।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times for protection, courage, and removal of fear',
        hi: 'रक्षा, साहस और भय निवारण के लिए 108 बार जपें',
        sa: 'रक्षणशौर्यभयनिवारणार्थम् अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'bajrang-baan-ref',
      name: { en: 'Bajrang Baan (reference)', hi: 'बजरंग बाण (सन्दर्भ)', sa: 'बज्राङ्गबाणः (सन्दर्भः)' },
      devanagari: 'निश्चय प्रेम प्रतीति ते विनय करें सनमान ।\nतेहि के कारज सकल शुभ सिद्ध करें हनुमान ॥',
      iast: 'niścaya prema pratīti te vinaya kareṃ sanamāna |\ntehi ke kāraja sakala śubha siddha kareṃ hanumāna ||',
      meaning: {
        en: 'Those who approach Hanuman with unwavering love, faith, and humility — Hanuman fulfills all their auspicious endeavors. (Opening verse of Bajrang Baan by Tulsidas)',
        hi: 'जो अटल प्रेम, विश्वास और विनम्रता से हनुमान से प्रार्थना करते हैं — हनुमान उनके सभी शुभ कार्य सिद्ध करते हैं। (तुलसीदास कृत बजरंग बाण का प्रारम्भिक छन्द)',
        sa: 'ये अचलप्रेम्णा श्रद्धया विनयेन च हनुमन्तं प्रार्थयन्ते — हनुमान् तेषां सर्वाणि शुभकार्याणि सिद्धानि करोति। (तुलसीदासकृतबज्राङ्गबाणस्य प्रारम्भिकश्लोकः)',
      },
      usage: {
        en: 'Recite the full Bajrang Baan for powerful protection — especially in times of great fear or danger',
        hi: 'शक्तिशाली सुरक्षा के लिए पूर्ण बजरंग बाण पढ़ें — विशेषकर अत्यधिक भय या संकट के समय',
        sa: 'शक्तिशालिरक्षणार्थं पूर्णबज्राङ्गबाणं पठेत् — विशेषतः महाभये संकटे च',
      },
    },
  ],

  naivedya: {
    en: 'Offer bananas, besan laddoo, and jaggery-based sweets. Hanuman is also fond of boondi, churma, and seasonal fruits. Red-colored sweets are considered auspicious.',
    hi: 'केले, बेसन के लड्डू और गुड़ से बनी मिठाइयाँ अर्पित करें। हनुमान को बूँदी, चूरमा और मौसमी फल भी प्रिय हैं। लाल रंग की मिठाइयाँ शुभ मानी जाती हैं।',
    sa: 'कदलीफलानि चणकचूर्णमोदकान् गुडमिष्टान्नानि च अर्पयेत्। हनुमते बुन्दिका चूर्णमिष्टं ऋतुफलानि च प्रियाणि। रक्तवर्णमिष्टान्नानि शुभानि मन्यन्ते।',
  },

  precautions: [
    {
      en: 'Observe celibacy (brahmacharya) on Tuesday. Avoid non-vegetarian food, alcohol, and tamasic substances.',
      hi: 'मंगलवार को ब्रह्मचर्य का पालन करें। माँसाहार, मद्य और तामसिक पदार्थों से बचें।',
      sa: 'मङ्गलवासरे ब्रह्मचर्यं पालयेत्। मांसाहारं मद्यं तामसिकद्रव्याणि च त्यजेत्।',
    },
    {
      en: 'Tuesday is ruled by Mars (Mangal). This vrat is especially recommended for those with Mangal Dosha in their horoscope or those facing Mars-related difficulties.',
      hi: 'मंगलवार मंगल ग्रह का दिन है। कुण्डली में मंगल दोष वाले या मंगल सम्बन्धी कठिनाइयों का सामना करने वालों के लिए यह व्रत विशेष रूप से अनुशंसित है।',
      sa: 'मङ्गलवासरः मङ्गलग्रहस्य दिनम्। जन्मकुण्डल्यां मङ्गलदोषयुक्तानां मङ्गलसम्बन्धकठिनतानां च कृते एतत् व्रतं विशेषतः अनुशंस्यते।',
    },
  ],

  parana: {
    type: 'next_sunrise',
    description: {
      en: 'Break the fast on Wednesday morning after sunrise. Offer brief prayers to Hanuman before the first meal.',
      hi: 'बुधवार प्रातः सूर्योदय के बाद व्रत तोड़ें। प्रथम भोजन से पहले हनुमान को संक्षिप्त प्रार्थना अर्पित करें।',
      sa: 'बुधवासरे प्रातः सूर्योदयानन्तरं व्रतं भञ्जयेत्। प्रथमभोजनात् प्राक् हनुमन्तं सङ्क्षेपेण प्रार्थयेत्।',
    },
  },

  phala: {
    en: 'Courage, strength, and fearlessness. Protection from evil forces, black magic, and negative energies. Remedy for Mars dosha (Manglik) in horoscope. Hanuman\'s devotees are said to be free from Saturn\'s malefic influence as well.',
    hi: 'साहस, शक्ति और निर्भयता। दुष्ट शक्तियों, काले जादू और नकारात्मक ऊर्जाओं से रक्षा। कुण्डली में मंगल दोष (मांगलिक) का उपाय। हनुमान भक्त शनि के अशुभ प्रभाव से भी मुक्त माने जाते हैं।',
    sa: 'शौर्यं बलं निर्भयता च। दुष्टशक्तिभ्यः कृष्णजादूतः नकारात्मकशक्तिभ्यश्च रक्षणम्। जन्मकुण्डल्यां मङ्गलदोषस्य (मांगलिकस्य) उपायः। हनुमद्भक्ताः शनेः अशुभप्रभावात् अपि मुक्ताः इति मन्यन्ते।',
  },
};

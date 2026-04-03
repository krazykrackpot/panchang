import type { PujaVidhi } from './types';

export const PURNIMA_VRAT_PUJA: PujaVidhi = {
  festivalSlug: 'purnima-vrat',
  category: 'vrat',
  deity: { en: 'Chandra (Moon) / Vishnu', hi: 'चन्द्र (चन्द्रमा) / विष्णु', sa: 'चन्द्रः / विष्णुः' },

  samagri: [
    { name: { en: 'White flowers (mogra, chameli)', hi: 'सफ़ेद फूल (मोगरा, चमेली)', sa: 'श्वेतपुष्पाणि (मल्लिकामालतीपुष्पाणि)' }, category: 'flowers', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Milk (for abhishek and arghya)', hi: 'दूध (अभिषेक और अर्घ्य हेतु)', sa: 'क्षीरम् (अभिषेकार्घ्यार्थम्)' }, category: 'food', essential: true },
    { name: { en: 'Kheer (rice pudding)', hi: 'खीर (दूध-चावल)', sa: 'क्षीरान्नम् (पायसम्)' }, category: 'food', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1', category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'White cloth for altar', hi: 'वेदी के लिए सफ़ेद कपड़ा', sa: 'वेद्यर्थं श्वेतवस्त्रम्' }, category: 'clothing', essential: false },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Fruits (banana, white fruits preferred)', hi: 'फल (केला, सफ़ेद फल श्रेष्ठ)', sa: 'फलानि (कदलीफलानि श्वेतफलानि श्रेष्ठानि)' }, category: 'food', essential: true },
    { name: { en: 'Water in copper vessel (for Chandra arghya)', hi: 'ताम्बे के पात्र में जल (चन्द्र अर्घ्य हेतु)', sa: 'ताम्रपात्रे जलम् (चन्द्रार्घ्यार्थम्)' }, category: 'vessels', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'The puja is performed in the evening after sighting the full moon. Chandra Arghya (offering water to the Moon) is given immediately upon moonrise. The Satyanarayan Katha, if performed, is done during Pradosh Kaal (evening period).',
    hi: 'पूजा सायंकाल पूर्ण चन्द्रमा के दर्शन के बाद की जाती है। चन्द्रोदय होते ही चन्द्र अर्घ्य (चन्द्रमा को जल अर्पण) दिया जाता है। सत्यनारायण कथा, यदि की जाती है, तो प्रदोष काल (सायंकालीन अवधि) में की जाती है।',
    sa: 'पूजा सायङ्काले पूर्णचन्द्रदर्शनानन्तरं क्रियते। चन्द्रोदये एव चन्द्रार्घ्यं (चन्द्राय जलार्पणम्) दीयते। सत्यनारायणकथा यदि क्रियते तर्हि प्रदोषकाले (सायंकालीनावधौ) क्रियते।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this auspicious Purnima (full moon day), I observe this Purnima Vrat and worship Lord Vishnu and Chandra Deva for the attainment of peace, prosperity, good health, and spiritual merit. May the fullness of the moon reflect as fullness in my life.',
    hi: 'इस शुभ पूर्णिमा (पूर्ण चन्द्रमा) पर, शान्ति, समृद्धि, उत्तम स्वास्थ्य और आध्यात्मिक पुण्य की प्राप्ति के लिए मैं यह पूर्णिमा व्रत रखता/रखती हूँ और भगवान विष्णु एवं चन्द्र देव की पूजा करता/करती हूँ। चन्द्रमा की पूर्णता मेरे जीवन में भी पूर्णता के रूप में प्रतिबिम्बित हो।',
    sa: 'अस्मिन् शुभे पूर्णिमादिवसे शान्तिसमृद्ध्युत्तमस्वास्थ्यआध्यात्मिकपुण्यप्राप्त्यर्थं पूर्णिमाव्रतमहं पालयामि श्रीविष्णुं चन्द्रदेवं च पूजयामि। चन्द्रस्य पूर्णता मम जीवने पूर्णतारूपेण प्रतिबिम्बतां।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning Sankalpa & Fasting', hi: 'प्रातःकालीन संकल्प एवं उपवास', sa: 'प्रभातसङ्कल्पः उपवासश्च' },
      description: {
        en: 'Rise early, bathe, and take the sankalpa for Purnima Vrat. Begin the fast — either nirjala (without water), phalahari (fruits only), or ekabhukta (one meal). Wear clean white or light-coloured clothes. Visit a temple if possible.',
        hi: 'प्रातःकाल उठें, स्नान करें और पूर्णिमा व्रत का संकल्प लें। उपवास आरम्भ करें — निर्जला (बिना जल), फलाहारी (केवल फल), या एकभुक्त (एक भोजन)। स्वच्छ सफ़ेद या हल्के रंग के वस्त्र पहनें। यदि सम्भव हो तो मन्दिर जाएँ।',
        sa: 'प्रभाते उत्थाय स्नात्वा पूर्णिमाव्रतस्य सङ्कल्पं कुर्यात्। उपवासम् आरभेत् — निर्जलम् (जलरहितम्), फलाहारम् (फलमात्रम्), अथवा एकभुक्तम् (एकभोजनम्)। शुचिश्वेतवस्त्राणि मन्दवर्णानि वा धारयेत्। यदि शक्यं मन्दिरं गच्छेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Vishnu Puja', hi: 'विष्णु पूजा', sa: 'विष्णुपूजनम्' },
      description: {
        en: 'Set up the puja area with a white cloth. Place an image of Lord Vishnu. Perform Shodashopachara puja (16-step worship) with sandalwood, flowers, akshat, and incense. Light the ghee lamp. Chant Vishnu Sahasranama or Om Namo Narayanaya japa.',
        hi: 'सफ़ेद कपड़े से पूजा स्थल सजाएँ। भगवान विष्णु का चित्र रखें। चन्दन, फूल, अक्षत और अगरबत्ती से षोडशोपचार पूजा (16 चरणों की पूजा) करें। घी का दीपक जलाएँ। विष्णु सहस्रनाम या ॐ नमो नारायणाय का जप करें।',
        sa: 'श्वेतवस्त्रेण पूजास्थलं सज्जयेत्। श्रीविष्णोः चित्रं स्थापयेत्। चन्दनपुष्पाक्षतधूपैः षोडशोपचारपूजां कुर्यात्। घृतदीपं प्रज्वालयेत्। विष्णुसहस्रनामजपं ॐ नमो नारायणाय जपं वा कुर्यात्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Satyanarayan Katha (Optional)', hi: 'सत्यनारायण कथा (वैकल्पिक)', sa: 'सत्यनारायणकथा (वैकल्पिकी)' },
      description: {
        en: 'Many families perform the Satyanarayan Puja and Katha on Purnima. Read or listen to the five chapters of the Satyanarayan Katha, which narrate stories of devotees whose wishes were fulfilled through truthful devotion to Lord Vishnu.',
        hi: 'बहुत से परिवार पूर्णिमा पर सत्यनारायण पूजा और कथा करते हैं। सत्यनारायण कथा के पाँच अध्याय पढ़ें या सुनें, जिनमें भक्तों की कहानियाँ हैं जिनकी मनोकामनाएँ भगवान विष्णु की सच्ची भक्ति से पूर्ण हुईं।',
        sa: 'बहवः कुटुम्बाः पूर्णिमायां सत्यनारायणपूजां कथां च कुर्वन्ति। सत्यनारायणकथायाः पञ्च अध्यायान् पठेत् शृणुयात् वा, यत्र भक्तानां कथाः वर्णिताः येषां मनोरथाः श्रीविष्णोः सत्यभक्त्या पूर्णाः अभवन्।',
      },
      duration: '45 min',
      essential: false,
      stepType: 'mantra',
    },
    {
      step: 4,
      title: { en: 'Chandra Darshan & Arghya', hi: 'चन्द्र दर्शन एवं अर्घ्य', sa: 'चन्द्रदर्शनम् अर्घ्यं च' },
      description: {
        en: 'In the evening, step outside and sight the full moon. Fill a copper vessel with water, add milk, akshat, white flowers, and sandalwood. Facing the moon, offer arghya (pour the water mixture) while chanting Chandra mantras. This is the central ritual of Purnima Vrat.',
        hi: 'सायंकाल बाहर जाएँ और पूर्ण चन्द्रमा के दर्शन करें। ताम्बे के पात्र में जल भरें, दूध, अक्षत, सफ़ेद फूल और चन्दन डालें। चन्द्रमा की ओर मुख करके चन्द्र मन्त्रों का जाप करते हुए अर्घ्य (जल मिश्रण) अर्पित करें। यह पूर्णिमा व्रत का मुख्य अनुष्ठान है।',
        sa: 'सायङ्काले बहिर्गत्वा पूर्णचन्द्रं दर्शयेत्। ताम्रपात्रे जलं पूरयेत्, क्षीरम् अक्षतान् श्वेतपुष्पाणि चन्दनं चादद्यात्। चन्द्राभिमुखं चन्द्रमन्त्रजपेन अर्घ्यं (जलमिश्रणम्) अर्पयेत्। एतत् पूर्णिमाव्रतस्य मुख्यमनुष्ठानम्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Moon Meditation & Prayers', hi: 'चन्द्र ध्यान एवं प्रार्थना', sa: 'चन्द्रध्यानं प्रार्थना च' },
      description: {
        en: 'After arghya, sit under the moonlight and meditate. Visualize the cool, white light of the full moon filling your body with peace and serenity. Pray for mental peace, emotional balance, and cooling of all anger and agitation. The Moon governs the mind (manas) in Vedic astrology.',
        hi: 'अर्घ्य के बाद चाँदनी में बैठकर ध्यान करें। पूर्ण चन्द्रमा के शीतल, श्वेत प्रकाश की कल्पना करें जो आपके शरीर को शान्ति और स्थिरता से भर रहा है। मानसिक शान्ति, भावनात्मक सन्तुलन और समस्त क्रोध एवं अशान्ति के शमन की प्रार्थना करें। वैदिक ज्योतिष में चन्द्रमा मन (मानस) का शासक है।',
        sa: 'अर्घ्यानन्तरं चन्द्रिकायां उपविश्य ध्यायेत्। पूर्णचन्द्रस्य शीतलश्वेतप्रकाशं कल्पयेत् यः शरीरं शान्त्या स्थिरतया च पूरयति। मानसिकशान्त्यै भावनात्मकसन्तुलनाय सर्वक्रोधाशान्तिशमनाय च प्रार्थयेत्। वैदिकज्योतिषे चन्द्रः मनसः (मानसस्य) शासकः।',
      },
      duration: '15 min',
      essential: false,
      stepType: 'meditation',
    },
    {
      step: 6,
      title: { en: 'Parana (Breaking the Fast)', hi: 'पारणा (व्रत तोड़ना)', sa: 'पारणा (व्रतभञ्जनम्)' },
      description: {
        en: 'After the Chandra Arghya and puja, break the fast with kheer (rice pudding) — the primary naivedya of Purnima. Share prasad with family. Distribute food, clothes, or donations to the needy. The vrat is considered complete after offering arghya to the moon.',
        hi: 'चन्द्र अर्घ्य और पूजा के बाद खीर (दूध-चावल) — पूर्णिमा का मुख्य नैवेद्य — से व्रत तोड़ें। परिवार के साथ प्रसाद बाँटें। ज़रूरतमन्दों को भोजन, वस्त्र या दान वितरित करें। चन्द्रमा को अर्घ्य देने के बाद व्रत पूर्ण माना जाता है।',
        sa: 'चन्द्रार्घ्यपूजानन्तरं क्षीरान्नेन (पायसेन) — पूर्णिमायाः मुख्यनैवेद्येन — व्रतं भञ्जयेत्। कुटुम्बेन सह प्रसादं विभजेत्। दीनेभ्यः अन्नं वस्त्राणि दानानि वा वितरेत्। चन्द्राय अर्घ्यदानानन्तरं व्रतं पूर्णं मन्यते।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'purnima-chandra-mantra',
      name: { en: 'Chandra Mantra', hi: 'चन्द्र मन्त्र', sa: 'चन्द्रमन्त्रः' },
      devanagari: 'ॐ सों सोमाय नमः',
      iast: 'oṃ soṃ somāya namaḥ',
      meaning: {
        en: 'Obeisance to Soma (the Moon God) — the lord of herbs, nourisher of all life, ruler of the mind.',
        hi: 'सोम (चन्द्र देव) को नमस्कार — औषधियों के स्वामी, सभी जीवों के पोषक, मन के शासक।',
        sa: 'सोमाय (चन्द्रदेवाय) नमः — ओषधीनां पतये सर्वजीवपोषकाय मनसः शासकाय।',
      },
      japaCount: 108,
      usage: { en: 'Chant while offering arghya to the Moon and during meditation', hi: 'चन्द्रमा को अर्घ्य देते समय और ध्यान के दौरान जपें', sa: 'चन्द्रार्घ्यदानकाले ध्यानकाले च जपेत्' },
    },
    {
      id: 'purnima-vishnu-mantra',
      name: { en: 'Vishnu Ashtakshari Mantra', hi: 'विष्णु अष्टाक्षरी मन्त्र', sa: 'विष्ण्वष्टाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमो नारायणाय',
      iast: 'oṃ namo nārāyaṇāya',
      meaning: {
        en: 'Obeisance to Lord Narayana — the supreme refuge, sustainer of all creation.',
        hi: 'भगवान नारायण को नमस्कार — सर्वोच्च शरण, समस्त सृष्टि के पालनकर्ता।',
        sa: 'नारायणाय नमः — सर्वोच्चशरणाय सृष्टिपालकाय।',
      },
      japaCount: 108,
      usage: { en: 'Chant during Vishnu puja and throughout the day as Naam japa', hi: 'विष्णु पूजा के दौरान और दिन भर नाम जप के रूप में जपें', sa: 'विष्णुपूजनकाले दिनपर्यन्तं नामजपरूपेण च जपेत्' },
    },
    {
      id: 'purnima-chandra-arghya',
      name: { en: 'Chandra Arghya Mantra', hi: 'चन्द्र अर्घ्य मन्त्र', sa: 'चन्द्रार्घ्यमन्त्रः' },
      devanagari: 'क्षीरोदार्णवसम्भूत अत्रिगोत्रसमुद्भव।\nगृहाणार्घ्यं मया दत्तं रोहिणीसहित प्रभो॥',
      iast: 'kṣīrodārṇava­sambhūta atrigotra­samudbhava |\ngṛhāṇārghyaṃ mayā dattaṃ rohiṇīsahita prabho ||',
      meaning: {
        en: 'O Moon, born from the ocean of milk, descended from Atri\'s lineage — O Lord, along with Rohini, please accept this arghya offered by me.',
        hi: 'हे चन्द्रमा, क्षीरसागर से उत्पन्न, अत्रि गोत्र से प्रकट — हे प्रभु, रोहिणी सहित, मेरे द्वारा अर्पित यह अर्घ्य स्वीकार करें।',
        sa: 'हे चन्द्र क्षीरोदार्णवसम्भव अत्रिगोत्रसमुद्भव प्रभो रोहिणीसहित मया दत्तम् अर्घ्यं गृहाण।',
      },
      japaCount: 3,
      usage: { en: 'Recite while offering water to the full moon', hi: 'पूर्ण चन्द्रमा को जल अर्पित करते समय पाठ करें', sa: 'पूर्णचन्द्राय जलार्पणकाले पठेत्' },
    },
  ],

  parana: {
    type: 'moonrise',
    description: {
      en: 'The fast is broken after sighting the full moon and offering Chandra Arghya in the evening. Parana is done with kheer or sattvic food.',
      hi: 'सायंकाल पूर्ण चन्द्रमा के दर्शन और चन्द्र अर्घ्य के बाद व्रत तोड़ा जाता है। पारणा खीर या सात्विक भोजन से की जाती है।',
      sa: 'सायङ्काले पूर्णचन्द्रदर्शनं चन्द्रार्घ्यं च कृत्वा व्रतं भज्यते। पारणा क्षीरान्नेन सात्त्विकाहारेण वा क्रियते।',
    },
  },

  naivedya: {
    en: 'Kheer (rice pudding made with milk and sugar) is the primary offering on Purnima — white foods are auspicious for the Moon. Also offer white fruits (banana, pear), milk sweets (peda, barfi), and seasonal fruits.',
    hi: 'खीर (दूध और शक्कर से बना चावल का पायस) पूर्णिमा का मुख्य नैवेद्य है — चन्द्रमा के लिए सफ़ेद भोजन शुभ है। सफ़ेद फल (केला, नाशपाती), दूध की मिठाई (पेड़ा, बर्फ़ी) और मौसमी फल भी अर्पित करें।',
    sa: 'क्षीरान्नं (क्षीरशर्करानिर्मितं तण्डुलपायसम्) पूर्णिमायाः मुख्यनैवेद्यम् — चन्द्रस्य कृते श्वेताहाराः शुभाः। श्वेतफलानि (कदलीफलानि नाशपात्रफलानि) क्षीरमिष्टान्नानि (पेडकानि बर्फीकानि) ऋतुफलानि चार्पयेत्।',
  },

  precautions: [
    {
      en: 'Maintain a sattvic diet and peaceful state of mind throughout the day. Avoid arguments, anger, and negative speech.',
      hi: 'दिन भर सात्विक आहार और शान्त मानसिक स्थिति बनाए रखें। वाद-विवाद, क्रोध और नकारात्मक वाणी से बचें।',
      sa: 'दिनपर्यन्तं सात्त्विकाहारं शान्तमनःस्थितिं च पालयेत्। विवादं क्रोधं नकारात्मकवाणीं च वर्जयेत्।',
    },
    {
      en: 'Do not look at the moon before completing the formal Chandra Arghya ritual. The first darshan should be accompanied by the offering.',
      hi: 'औपचारिक चन्द्र अर्घ्य अनुष्ठान पूर्ण करने से पहले चन्द्रमा को न देखें। प्रथम दर्शन अर्घ्य के साथ होना चाहिए।',
      sa: 'औपचारिकचन्द्रार्घ्यानुष्ठानं पूर्णं कर्तुं पूर्वं चन्द्रं न पश्येत्। प्रथमदर्शनम् अर्घ्येन सह भवेत्।',
    },
    {
      en: 'This vrat can be observed every month on Purnima. For maximum benefit, observe continuously for 12 months (one full year cycle).',
      hi: 'यह व्रत प्रत्येक मास पूर्णिमा पर रखा जा सकता है। अधिकतम लाभ के लिए 12 मास (एक पूर्ण वार्षिक चक्र) तक लगातार रखें।',
      sa: 'एतद् व्रतं प्रतिमासं पूर्णिमायां पालयितुं शक्यते। अधिकतमलाभार्थं द्वादशमासान् (एकं पूर्णवार्षिकचक्रम्) निरन्तरं पालयेत्।',
    },
    {
      en: 'Pregnant women and those with health conditions may observe a modified fast (fruits and milk). Consult your family tradition for specific rules.',
      hi: 'गर्भवती स्त्रियाँ और स्वास्थ्य सम्बन्धी समस्या वाले लोग संशोधित उपवास (फल और दूध) रख सकते हैं। विशेष नियमों के लिए अपनी पारिवारिक परम्परा से परामर्श करें।',
      sa: 'गर्भिण्यः स्वास्थ्यसमस्यायुक्ताश्च संशोधितोपवासं (फलानि क्षीरं च) पालयितुं शक्नुवन्ति। विशेषनियमार्थं स्वकुटुम्बपरम्परां परामृशेत्।',
    },
  ],

  phala: {
    en: 'Purnima Vrat bestows the blessings of both Chandra and Vishnu. It brings mental peace, emotional stability, cooling of anger, and enhanced intuition. Regular observance removes Chandra dosha from the horoscope, improves relationships, and grants prosperity. The merit equals that of performing a Satyanarayan Puja. Those who observe for 12 consecutive months receive the full blessings of all 12 Adityas.',
    hi: 'पूर्णिमा व्रत चन्द्र और विष्णु दोनों का आशीर्वाद प्रदान करता है। यह मानसिक शान्ति, भावनात्मक स्थिरता, क्रोध का शमन और बढ़ी हुई अन्तर्ज्ञान प्रदान करता है। नियमित पालन कुण्डली से चन्द्र दोष दूर करता है, सम्बन्ध सुधारता है और समृद्धि प्रदान करता है। इसका पुण्य सत्यनारायण पूजा के समान है। जो 12 लगातार मास रखते हैं उन्हें सभी 12 आदित्यों का पूर्ण आशीर्वाद मिलता है।',
    sa: 'पूर्णिमाव्रतं चन्द्रस्य विष्णोश्च आशीर्वादं ददाति। मानसिकशान्तिं भावनात्मिकस्थिरतां क्रोधशमनं वर्धिताम् अन्तर्ज्ञानं च ददाति। नियमितपालनं कुण्डल्यां चन्द्रदोषं निवारयति सम्बन्धान् सुधारयति समृद्धिं च ददाति। अस्य पुण्यं सत्यनारायणपूजासमम्। ये द्वादशनिरन्तरमासान् पालयन्ति ते सर्वेषां द्वादशादित्यानां पूर्णम् आशीर्वादं प्राप्नुवन्ति।',
  },
};

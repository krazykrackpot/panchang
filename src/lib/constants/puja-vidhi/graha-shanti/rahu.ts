import type { PujaVidhi } from '../types';

export const RAHU_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-rahu',
  category: 'graha_shanti',
  deity: { en: 'Rahu (North Node)', hi: 'राहु', sa: 'राहुः' },

  samagri: [
    { name: { en: 'Black sesame (til)', hi: 'काले तिल', sa: 'कृष्णतिलाः' }, quantity: '500 g', essential: true, category: 'food' },
    { name: { en: 'Coconut (whole)', hi: 'नारियल (साबुत)', sa: 'नारिकेलम् (सम्पूर्णम्)' }, quantity: '1', essential: true, category: 'food' },
    { name: { en: 'Blue cloth', hi: 'नीला वस्त्र', sa: 'नीलवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Durva grass', hi: 'दूर्वा घास', sa: 'दूर्वा' }, essential: true, category: 'puja_items' },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनलेपः' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Blue / dark flowers', hi: 'नीले / गहरे फूल', sa: 'नीलगहनपुष्पाणि' }, category: 'flowers' },
    { name: { en: 'Dhoop / Incense', hi: 'धूप / अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Rahu Shanti puja is performed on Saturday night after sunset, or during Rahu Kalam on any day. Saturday night is most potent for Rahu remedies.',
    hi: 'राहु शान्ति पूजा शनिवार रात्रि सूर्यास्त के बाद या किसी भी दिन राहु काल में करनी चाहिए। शनिवार रात्रि राहु उपचार के लिए सर्वाधिक प्रभावी है।',
    sa: 'राहुशान्तिपूजा शनिवासररात्रौ सूर्यास्तानन्तरं कस्मिन्नपि दिने राहुकाले वा कर्तव्या। शनिवासररात्रिः राहूपचाराय सर्वाधिकप्रभावशालिनी।',
  },

  sankalpa: {
    en: 'On this sacred night, I perform Rahu Graha Shanti puja to pacify Rahu and seek relief from sudden misfortunes, confusion, obsessions, and Kaal Sarp Dosha.',
    hi: 'इस पवित्र रात्रि को, मैं आकस्मिक दुर्भाग्य, भ्रम, आसक्ति और काल सर्प दोष से मुक्ति हेतु राहु ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्ररात्रौ आकस्मिकदुर्भाग्यभ्रमासक्तिकालसर्पदोषमुक्त्यर्थं राहुग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe in the evening. Add a few black sesame seeds to the bathing water. Wear clean dark blue or dark-coloured clothes.',
        hi: 'सायं स्नान करें। स्नान के जल में कुछ काले तिल डालें। स्वच्छ गहरे नीले या गहरे रंग के वस्त्र पहनें।',
        sa: 'सायं स्नानं कुर्यात्। स्नानजले किञ्चित् कृष्णतिलान् क्षिपेत्। शुचिगहननीलगहनवर्णवस्त्राणि धारयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing south-west. Hold water with durva grass and black sesame in the right palm. State your name, gotra, and intention to pacify Rahu.',
        hi: 'नैऋत्य दिशा (दक्षिण-पश्चिम) की ओर मुख कर बैठें। दाहिने हाथ में दूर्वा और काले तिल सहित जल लेकर राहु शान्ति का संकल्प करें।',
        sa: 'नैऋतदिशम् (दक्षिणपश्चिमम्) अभिमुखम् उपविशेत्। दक्षिणहस्ते दूर्वाकृष्णतिलसहितजलं गृहीत्वा राहुशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Place a vessel filled with water on a bed of black sesame. Add durva grass, sandalwood paste, and a whole coconut on top. Cover with blue cloth.',
        hi: 'जल से भरे पात्र को काले तिल के बिछौने पर रखें। दूर्वा, चन्दन का लेप और ऊपर एक साबुत नारियल रखें। नीले वस्त्र से ढकें।',
        sa: 'जलपूर्णपात्रं कृष्णतिलोपरि स्थापयेत्। दूर्वां चन्दनलेपं सम्पूर्णनारिकेलं च उपरि स्थापयेत्। नीलवस्त्रेण आवृणुयात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Rahu Avahana (Invocation)', hi: 'राहु आवाहन', sa: 'राह्वावाहनम्' },
      description: {
        en: 'Invoke Rahu by lighting the ghee lamp and offering blue flowers, durva grass, and sandalwood paste. Recite "Om Rahave Namah" three times.',
        hi: 'घी का दीपक जलाकर नीले फूल, दूर्वा और चन्दन अर्पित कर राहु का आवाहन करें। "ॐ राहवे नमः" तीन बार बोलें।',
        sa: 'घृतदीपं प्रज्वाल्य नीलपुष्पाणि दूर्वां चन्दनं च अर्पयित्वा राहुम् आवाहयेत्। "ओं राहवे नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Rahu Beej Mantra Japa', hi: 'राहु बीज मन्त्र जप', sa: 'राहुबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Rahu Beej Mantra 18,000 times (or 108 times minimum). Use a hessonite (gomed) or dark sandalwood mala. Meditate on a dark, smoke-coloured orb.',
        hi: 'राहु बीज मन्त्र 18,000 बार (या न्यूनतम 108 बार) जपें। गोमेद या गहरे चन्दन की माला का उपयोग करें। धूम्रवर्ण गहरे गोले का ध्यान करें।',
        sa: 'राहुबीजमन्त्रम् अष्टादशसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। गोमेदगहनचन्दनमालाम् उपयुञ्जीत। धूम्रवर्णगहनगोलं ध्यायेत्।',
      },
      mantraRef: 'rahu-beej',
      essential: true,
      stepType: 'mantra',
      duration: '90-120 min',
    },
    {
      step: 6,
      title: { en: 'Narikel Daan (Coconut Offering)', hi: 'नारिकेल दान', sa: 'नारिकेलदानम्' },
      description: {
        en: 'Offer the whole coconut into flowing water (river or stream) while chanting the Rahu Gayatri. If no river is accessible, place it at a temple.',
        hi: 'राहु गायत्री का जाप करते हुए साबुत नारियल बहते जल (नदी या नाले) में प्रवाहित करें। यदि नदी उपलब्ध न हो तो मन्दिर में रखें।',
        sa: 'राहुगायत्रीं जपन् सम्पूर्णनारिकेलं प्रवाहितजले (नद्यां स्रोतसि वा) प्रवाहयेत्। यदि नदी नोपलभ्यते तर्हि मन्दिरे स्थापयेत्।',
      },
      mantraRef: 'rahu-gayatri',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate coconut and blue cloth to the needy. Black sesame, blankets, and iron items are also effective Rahu daan. Help those suffering from addiction or mental illness.',
        hi: 'ज़रूरतमन्दों को नारियल और नीला वस्त्र दान करें। काले तिल, कम्बल और लोहे की वस्तुएँ भी प्रभावी राहु दान हैं। व्यसन या मानसिक रोग से पीड़ित लोगों की सहायता करें।',
        sa: 'दीनेभ्यः नारिकेलं नीलवस्त्रं च दद्यात्। कृष्णतिलाः कम्बलानि लौहवस्तूनि च प्रभावशालिराहुदानानि। व्यसनमानसिकरोगपीडितानां सहायतां कुर्यात्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Rahu and Goddess Durga (Rahu\'s presiding deity) for protection from illusions, sudden misfortunes, and negative influences. Perform namaskar.',
        hi: 'भ्रम, आकस्मिक दुर्भाग्य और नकारात्मक प्रभावों से रक्षा हेतु राहु और देवी दुर्गा (राहु की अधिष्ठात्री देवी) से प्रार्थना करें। नमस्कार करें।',
        sa: 'भ्रमात् आकस्मिकदुर्भाग्यात् नकारात्मकप्रभावेभ्यश्च रक्षणार्थं राहुं दुर्गादेवीं (राहोः अधिष्ठातृदेवीम्) च प्रार्थयेत्। नमस्कारं कुर्यात्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'rahu-beej',
      name: { en: 'Rahu Beej Mantra', hi: 'राहु बीज मन्त्र', sa: 'राहुबीजमन्त्रः' },
      devanagari: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
      iast: 'oṃ bhrāṃ bhrīṃ bhrauṃ saḥ rāhave namaḥ',
      meaning: {
        en: 'Salutations to Rahu (the shadow planet). The seed syllables invoke Rahu\'s transformative energy for protection from illusions, sudden troubles, and spiritual awakening.',
        hi: 'राहु (छाया ग्रह) को नमन। बीज अक्षर राहु की परिवर्तनकारी ऊर्जा का आवाहन भ्रम, आकस्मिक विपत्तियों से रक्षा और आध्यात्मिक जागृति हेतु करते हैं।',
        sa: 'राहवे (छायाग्रहाय) नमः। बीजाक्षराणि राहोः परिवर्तनऊर्जां भ्रमात् आकस्मिकविपत्तिभ्यः रक्षणाय आध्यात्मिकजागृत्यर्थं च आवाहयन्ति।',
      },
      japaCount: 18000,
      usage: {
        en: 'Chant 18,000 times for full Rahu shanti; 108 times daily for ongoing remedy and Kaal Sarp relief',
        hi: 'पूर्ण राहु शान्ति के लिए 18,000 बार जपें; दैनिक उपाय और काल सर्प दोष निवारण के लिए 108 बार',
        sa: 'पूर्णराहुशान्त्यर्थम् अष्टादशसहस्रवारं जपेत्; नित्योपचारकालसर्पनिवारणार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'rahu-gayatri',
      name: { en: 'Rahu Gayatri Mantra', hi: 'राहु गायत्री मन्त्र', sa: 'राहुगायत्रीमन्त्रः' },
      devanagari: 'ॐ नागध्वजाय विद्महे पद्महस्ताय धीमहि ।\nतन्नो राहुः प्रचोदयात् ॥',
      iast: 'oṃ nāgadhvajāya vidmahe padmahastāya dhīmahi |\ntanno rāhuḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the one with the serpent banner (Rahu), who holds a lotus. May Rahu inspire clarity of thought and protect us from illusions.',
        hi: 'हम नागध्वज (राहु) का ध्यान करते हैं, जो कमल धारण करते हैं। राहु हमें विचारों की स्पष्टता दें और भ्रम से बचाएँ।',
        sa: 'नागध्वजं (राहुम्) पद्महस्तं ध्यायामः। राहुः नः विचारस्पष्टतां ददातु भ्रमात् च रक्षतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during coconut offering and as a daily protective prayer',
        hi: 'नारियल अर्पण के समय और दैनिक रक्षात्मक प्रार्थना के रूप में जपें',
        sa: 'नारिकेलार्पणसमये दैनिकरक्षात्मकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer urad dal preparations, coconut sweets, and dark-coloured fruits. A special offering of coconut with black sesame is traditional for Rahu.',
    hi: 'उड़द दाल से बने पकवान, नारियल मिठाई और गहरे रंग के फल अर्पित करें। काले तिल सहित नारियल का विशेष अर्पण राहु के लिए पारम्परिक है।',
    sa: 'माषदालनिर्मितपक्वान्नानि नारिकेलमिष्टान्नानि गहनवर्णफलानि च अर्पयेत्। कृष्णतिलसहितनारिकेलस्य विशेषार्पणं राहोः पारम्परिकम्।',
  },

  precautions: [
    {
      en: 'Perform the puja after sunset facing south-west. Rahu is a shadow planet — nighttime worship is more effective.',
      hi: 'पूजा सूर्यास्त के बाद नैऋत्य दिशा की ओर मुख कर करें। राहु छाया ग्रह है — रात्रि पूजा अधिक प्रभावी है।',
      sa: 'सूर्यास्तानन्तरं नैऋतदिशम् अभिमुखं पूजां कुर्यात्। राहुः छायाग्रहः — रात्रिपूजा अधिकप्रभावशालिनी।',
    },
    {
      en: 'Avoid intoxicants, gambling, and deceptive behaviour — Rahu amplifies these tendencies when afflicted.',
      hi: 'मादक पदार्थ, जुआ और छलपूर्ण व्यवहार से बचें — पीड़ित राहु इन प्रवृत्तियों को बढ़ाता है।',
      sa: 'मादकपदार्थान् द्यूतं छलपूर्णव्यवहारं च वर्जयेत् — पीडितराहुः एताः प्रवृत्तीः वर्धयति।',
    },
    {
      en: 'Rahu and Ketu shanti should ideally be performed together for complete nodal axis balancing.',
      hi: 'पूर्ण राहु-केतु अक्ष सन्तुलन के लिए राहु और केतु शान्ति एक साथ करना आदर्श है।',
      sa: 'पूर्णराहुकेत्वक्षसन्तुलनार्थं राहुकेतुशान्ती सह कर्तुं आदर्शम्।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Rahu. Bestows protection from sudden misfortunes, relief from Kaal Sarp Dosha, clarity of mind, freedom from addictions, success in foreign lands, and technological gains.',
    hi: 'पीड़ित राहु को शान्त करता है। आकस्मिक दुर्भाग्य से रक्षा, काल सर्प दोष निवारण, मानसिक स्पष्टता, व्यसन मुक्ति, विदेश में सफलता और प्रौद्योगिकी में लाभ प्रदान करता है।',
    sa: 'पीडितराहुं शमयति। आकस्मिकदुर्भाग्यरक्षां कालसर्पदोषनिवारणं मानसिकस्पष्टतां व्यसनमुक्तिं विदेशसफलतां प्रौद्योगिकीलाभं च प्रददाति।',
  },
};

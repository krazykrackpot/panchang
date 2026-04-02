import type { PujaVidhi } from '../types';

export const SHANI_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-shani',
  category: 'graha_shanti',
  deity: { en: 'Shani (Saturn)', hi: 'शनि देव', sa: 'शनिदेवः' },

  samagri: [
    { name: { en: 'Black sesame (til)', hi: 'काले तिल', sa: 'कृष्णतिलाः' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'Iron vessel or item', hi: 'लोहे का पात्र या वस्तु', sa: 'लौहपात्रम् लौहवस्तु वा' }, essential: true, category: 'vessels' },
    { name: { en: 'Blue / black cloth', hi: 'नीला / काला वस्त्र', sa: 'नीलं / कृष्णवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Mustard oil (sarson tel)', hi: 'सरसों का तेल', sa: 'सर्षपतैलम्' }, quantity: '500 ml', essential: true, category: 'other' },
    { name: { en: 'Urad dal (black gram)', hi: 'उड़द दाल', sa: 'माषदालम्' }, quantity: '500 g', category: 'food' },
    { name: { en: 'Blue / purple flowers', hi: 'नीले / बैंगनी फूल', sa: 'नीलबैंगनीपुष्पाणि' }, category: 'flowers' },
    { name: { en: 'Mustard oil lamp (diya)', hi: 'सरसों तेल का दीपक', sa: 'सर्षपतैलदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Dhoop / Incense', hi: 'धूप / अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Shani Shanti puja is performed on Saturday evening, ideally during Pradosh Kala. The hours after sunset on Saturday are most effective for Saturn remedies.',
    hi: 'शनि शान्ति पूजा शनिवार सायं प्रदोष काल में करनी चाहिए। शनिवार को सूर्यास्त के बाद के घण्टे शनि उपचार के लिए सर्वाधिक प्रभावी हैं।',
    sa: 'शनिशान्तिपूजा शनिवासरे सायं प्रदोषकाले कर्तव्या। शनिवासरे सूर्यास्तानन्तरघण्टाः शन्युपचाराय सर्वाधिकप्रभावशालिनः।',
  },

  sankalpa: {
    en: 'On this sacred Saturday, I perform Shani Graha Shanti puja to pacify Saturn and seek relief from Sade Sati, Dhaiyya, delays, and karmic debts.',
    hi: 'इस पवित्र शनिवार को, मैं साढ़ेसाती, ढैया, विलम्ब और कर्म ऋण से मुक्ति हेतु शनि ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रशनिवासरे साडेसाती ढैय्या विलम्बकर्मऋणमुक्त्यर्थं शनिग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe in the evening with black sesame mixed in water. Wear clean dark blue or black clothes. Saturn demands discipline and humility.',
        hi: 'सायं काले तिल मिले जल से स्नान करें। स्वच्छ गहरे नीले या काले वस्त्र पहनें। शनि अनुशासन और विनम्रता की माँग करता है।',
        sa: 'सायं कृष्णतिलमिश्रितजलेन स्नानं कुर्यात्। शुचिगहननीलकृष्णवस्त्राणि धारयेत्। शनिः अनुशासनं विनयं च अपेक्षते।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing west (Saturn\'s direction). Hold water with black sesame in the right palm. State your name, gotra, and intention to pacify Shani graha.',
        hi: 'पश्चिम दिशा (शनि की दिशा) की ओर मुख कर बैठें। दाहिने हाथ में काले तिल सहित जल लेकर शनि ग्रह शान्ति का संकल्प करें।',
        sa: 'पश्चिमदिशम् (शनिदिशाम्) अभिमुखम् उपविशेत्। दक्षिणहस्ते कृष्णतिलसहितजलं गृहीत्वा शनिग्रहशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Place an iron vessel filled with mustard oil and black sesame on a bed of urad dal. Cover with dark blue or black cloth. This represents Saturn\'s energy.',
        hi: 'लोहे के पात्र में सरसों का तेल और काले तिल भरकर उड़द दाल के बिछौने पर रखें। गहरे नीले या काले वस्त्र से ढकें।',
        sa: 'लौहपात्रं सर्षपतैलेन कृष्णतिलैश्च पूर्य माषदालोपरि स्थापयेत्। गहननीलकृष्णवस्त्रेण आवृणुयात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Shani Avahana (Invocation)', hi: 'शनि आवाहन', sa: 'शन्यावाहनम्' },
      description: {
        en: 'Invoke Shani Deva by lighting the mustard oil lamp. Offer blue/purple flowers and black sesame. Recite "Om Shanaischaraya Namah" three times.',
        hi: 'सरसों तेल का दीपक जलाकर शनि देव का आवाहन करें। नीले/बैंगनी फूल और काले तिल अर्पित करें। "ॐ शनैश्चराय नमः" तीन बार बोलें।',
        sa: 'सर्षपतैलदीपं प्रज्वाल्य शनिदेवम् आवाहयेत्। नीलबैंगनीपुष्पाणि कृष्णतिलान् च अर्पयेत्। "ओं शनैश्चराय नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Shani Beej Mantra Japa', hi: 'शनि बीज मन्त्र जप', sa: 'शनिबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Shani Beej Mantra 23,000 times (or 108 times minimum). Use an iron or dark rudraksha mala. Meditate on a deep blue-black orb representing Saturn\'s transformative power.',
        hi: 'शनि बीज मन्त्र 23,000 बार (या न्यूनतम 108 बार) जपें। लोहे या गहरी रुद्राक्ष माला का उपयोग करें। शनि की परिवर्तनकारी शक्ति के गहरे नीले-काले गोले का ध्यान करें।',
        sa: 'शनिबीजमन्त्रं त्रयोविंशतिसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। लौहगहनरुद्राक्षमालाम् उपयुञ्जीत। शनेः परिवर्तनशक्तेः गहननीलकृष्णगोलं ध्यायेत्।',
      },
      mantraRef: 'shani-beej',
      essential: true,
      stepType: 'mantra',
      duration: '120 min',
    },
    {
      step: 6,
      title: { en: 'Tailabhisheka (Oil Offering)', hi: 'तैलाभिषेक', sa: 'तैलाभिषेकः' },
      description: {
        en: 'Pour mustard oil over the Shani image or an iron nail/horseshoe while chanting the Shani Gayatri. This is a powerful Saturn-specific offering.',
        hi: 'शनि गायत्री का जाप करते हुए शनि प्रतिमा या लोहे की कील/नाल पर सरसों का तेल अर्पित करें। यह शनि का विशिष्ट शक्तिशाली अर्पण है।',
        sa: 'शनिगायत्रीं जपन् शनिप्रतिमायां लौहकीले अश्वनाले वा सर्षपतैलम् अर्पयेत्। एतत् शनिविशिष्टं शक्तिशाली अर्पणम्।',
      },
      mantraRef: 'shani-gayatri',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate black sesame, iron items, and mustard oil to the poor. Feeding crows (Saturn\'s vahana) with urad dal preparations is highly recommended. Serve the elderly and disabled.',
        hi: 'गरीबों को काले तिल, लोहे की वस्तुएँ और सरसों का तेल दान करें। कौवों (शनि का वाहन) को उड़द दाल से बने पकवान खिलाना अत्यन्त लाभकारी है। वृद्ध और दिव्यांग जनों की सेवा करें।',
        sa: 'दरिद्रेभ्यः कृष्णतिलान् लौहवस्तूनि सर्षपतैलं च दद्यात्। काकेभ्यः (शनेः वाहनम्) माषदालनिर्मितपक्वान्नानि भोजयेत्। वृद्धान् दिव्याङ्गान् च सेवेत।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Shani Deva for patience, endurance, and karmic relief. Accept Saturn\'s lessons with humility. Perform namaskar and share prasad.',
        hi: 'धैर्य, सहनशक्ति और कर्म फल से मुक्ति हेतु शनि देव से प्रार्थना करें। विनम्रता से शनि की शिक्षाओं को स्वीकार करें। नमस्कार करें और प्रसाद बाँटें।',
        sa: 'धैर्यसहनशक्तिकर्मफलमुक्त्यर्थं शनिदेवं प्रार्थयेत्। विनयेन शनेः शिक्षाः स्वीकुर्यात्। नमस्कारं कुर्यात् प्रसादं च वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'shani-beej',
      name: { en: 'Shani Beej Mantra', hi: 'शनि बीज मन्त्र', sa: 'शनिबीजमन्त्रः' },
      devanagari: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
      iast: 'oṃ prāṃ prīṃ prauṃ saḥ śanaiścarāya namaḥ',
      meaning: {
        en: 'Salutations to Saturn (the slow mover). The seed syllables invoke Shani\'s disciplining energy for karmic purification, patience, and spiritual maturity.',
        hi: 'शनि (धीमी गति वाले) को नमन। बीज अक्षर शनि की अनुशासनकारी ऊर्जा का आवाहन कर्म शुद्धि, धैर्य और आध्यात्मिक परिपक्वता हेतु करते हैं।',
        sa: 'शनैश्चराय (मन्दगतये) नमः। बीजाक्षराणि शनेः अनुशासनऊर्जां कर्मशुद्ध्यर्थं धैर्याय आध्यात्मिकपरिपक्वतायै च आवाहयन्ति।',
      },
      japaCount: 23000,
      usage: {
        en: 'Chant 23,000 times for full Shani shanti; 108 times daily for ongoing Sade Sati remedy',
        hi: 'पूर्ण शनि शान्ति के लिए 23,000 बार जपें; साढ़ेसाती उपाय के लिए दैनिक 108 बार',
        sa: 'पूर्णशनिशान्त्यर्थं त्रयोविंशतिसहस्रवारं जपेत्; साडेसातिउपचारार्थं नित्यम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'shani-gayatri',
      name: { en: 'Shani Gayatri Mantra', hi: 'शनि गायत्री मन्त्र', sa: 'शनिगायत्रीमन्त्रः' },
      devanagari: 'ॐ काकध्वजाय विद्महे खड्गहस्ताय धीमहि ।\nतन्नो मन्दः प्रचोदयात् ॥',
      iast: 'oṃ kākadhvajāya vidmahe khaḍgahastāya dhīmahi |\ntanno mandaḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the one with the crow banner (Shani), who holds a sword. May Saturn inspire discipline, patience, and karmic wisdom in us.',
        hi: 'हम काकध्वज (शनि) का ध्यान करते हैं, जो खड्ग धारण करते हैं। शनि हमें अनुशासन, धैर्य और कर्म ज्ञान की प्रेरणा दें।',
        sa: 'काकध्वजं (शनिम्) खड्गहस्तं ध्यायामः। मन्दः नः अनुशासनं धैर्यं कर्मज्ञानं च प्रेरयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during oil offering and as a daily prayer on Saturdays',
        hi: 'तैलाभिषेक के समय और शनिवार को दैनिक प्रार्थना के रूप में जपें',
        sa: 'तैलाभिषेकसमये शनिवासरे दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer urad dal preparations (urad dal vada, khichdi), black sesame sweets (til laddu), and dark-coloured fruits. Serve in an iron or steel vessel.',
    hi: 'उड़द दाल से बने पकवान (उड़द वड़ा, खिचड़ी), काले तिल की मिठाई (तिल लड्डू) और गहरे रंग के फल अर्पित करें। लोहे या स्टील के पात्र में रखें।',
    sa: 'माषदालनिर्मितपक्वान्नानि (माषवटकम्, खिचडी) कृष्णतिलमिष्टान्नानि (तिलमोदकम्) गहनवर्णफलानि च अर्पयेत्। लौहपात्रे इस्पातपात्रे वा स्थापयेत्।',
  },

  precautions: [
    {
      en: 'Face west during the puja. Dark blue or black is essential. Do not consume alcohol on puja day — Saturn punishes indiscipline.',
      hi: 'पूजा में पश्चिम दिशा की ओर मुख करें। गहरा नीला या काला रंग आवश्यक है। पूजा के दिन मदिरा सेवन न करें — शनि अनुशासनहीनता को दण्डित करता है।',
      sa: 'पूजायां पश्चिमदिशम् अभिमुखं कुर्यात्। गहननीलः कृष्णवर्णः वा अनिवार्यः। पूजादिने मद्यं न पिबेत् — शनिः अनुशासनहीनतां दण्डयति।',
    },
    {
      en: 'Do not disrespect servants, workers, or the elderly on Saturday. Saturn is the karaka of servants and the old.',
      hi: 'शनिवार को सेवकों, श्रमिकों या वृद्धों का अनादर न करें। शनि सेवकों और वृद्ध जनों का कारक है।',
      sa: 'शनिवासरे सेवकान् श्रमिकान् वृद्धान् वा न अवमन्येत। शनिः सेवकवृद्धजनानां कारकः।',
    },
    {
      en: 'Lighting a mustard oil lamp under a peepal tree on Saturday evening is a traditional and effective Shani remedy.',
      hi: 'शनिवार सायं पीपल वृक्ष के नीचे सरसों तेल का दीपक जलाना पारम्परिक और प्रभावी शनि उपाय है।',
      sa: 'शनिवासरे सायं पिप्पलवृक्षस्य अधः सर्षपतैलदीपं प्रज्वालयितुं पारम्परिकः प्रभावशाली शन्युपचारः।',
    },
    {
      en: 'Recite Hanuman Chalisa and Shani Stotra on Saturdays for additional protection during Sade Sati.',
      hi: 'साढ़ेसाती में अतिरिक्त सुरक्षा हेतु शनिवार को हनुमान चालीसा और शनि स्तोत्र का पाठ करें।',
      sa: 'साडेसातिकाले अतिरिक्तरक्षणार्थं शनिवासरे हनुमच्चालीसां शनिस्तोत्रं च पठेत्।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Saturn. Bestows relief from Sade Sati and Dhaiyya, removal of delays and obstacles, karmic debt resolution, longevity, career stability, and spiritual maturity.',
    hi: 'पीड़ित शनि को शान्त करता है। साढ़ेसाती और ढैया से राहत, विलम्ब-बाधाओं का निवारण, कर्म ऋण मुक्ति, दीर्घायु, व्यावसायिक स्थिरता और आध्यात्मिक परिपक्वता प्रदान करता है।',
    sa: 'पीडितशनिं शमयति। साडेसातिढैय्यानिवारणं विलम्बबाधानिवारणं कर्मऋणमुक्तिं दीर्घायुषं व्यावसायिकस्थिरताम् आध्यात्मिकपरिपक्वतां च प्रददाति।',
  },
};

import type { PujaVidhi } from '../types';

export const GURU_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-guru',
  category: 'graha_shanti',
  deity: { en: 'Guru / Brihaspati (Jupiter)', hi: 'गुरु / बृहस्पति', sa: 'गुरुः / बृहस्पतिः' },

  samagri: [
    { name: { en: 'Chana dal (split chickpeas)', hi: 'चना दाल', sa: 'चणकदालम्' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'Turmeric (haldi)', hi: 'हल्दी', sa: 'हरिद्रा' }, quantity: '100 g', essential: true, category: 'puja_items' },
    { name: { en: 'Yellow cloth', hi: 'पीला वस्त्र', sa: 'पीतवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Yellow flowers (marigold / champa)', hi: 'पीले फूल (गेंदा / चम्पा)', sa: 'पीतपुष्पाणि (स्थलपद्मम् / चम्पकम्)' }, essential: true, category: 'flowers' },
    { name: { en: 'Gold item (coin or ring)', hi: 'सोने की वस्तु (सिक्का या अंगूठी)', sa: 'सुवर्णवस्तु (मुद्रा अङ्गुलीयकं वा)' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Banana (for offering)', hi: 'केला (अर्पण के लिए)', sa: 'कदलीफलम् (अर्पणार्थम्)' }, category: 'food' },
    { name: { en: 'Dhoop / Incense', hi: 'धूप / अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Guru Shanti puja is performed on Thursday morning, ideally during Brahma Muhurta or the first three hours after sunrise. Guruwar (Thursday) is Jupiter\'s own day.',
    hi: 'गुरु शान्ति पूजा गुरुवार को प्रातःकाल, ब्रह्म मुहूर्त या सूर्योदय के बाद पहले तीन घण्टों में करनी चाहिए। गुरुवार बृहस्पति का अपना दिन है।',
    sa: 'गुरुशान्तिपूजा गुरुवासरे प्रातःकाले ब्रह्ममुहूर्ते सूर्योदयात् प्रथमत्रिघण्टासु वा कर्तव्या। गुरुवासरः बृहस्पतेः स्वदिनम्।',
  },

  sankalpa: {
    en: 'On this sacred Thursday, I perform Guru Graha Shanti puja to pacify Jupiter and seek blessings for wisdom, prosperity, progeny, spiritual growth, and dharmic living.',
    hi: 'इस पवित्र गुरुवार को, मैं ज्ञान, समृद्धि, सन्तान, आध्यात्मिक विकास और धार्मिक जीवन हेतु गुरु ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रगुरुवासरे ज्ञानसमृद्धिसन्तानाध्यात्मिकविकासधार्मिकजीवनार्थं गुरुग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe early and wear clean yellow clothes. Apply a turmeric tilak on the forehead. Jupiter represents the Guru principle — approach with humility and reverence.',
        hi: 'प्रातः स्नान करें और स्वच्छ पीले वस्त्र पहनें। माथे पर हल्दी का तिलक लगाएँ। बृहस्पति गुरु तत्त्व का प्रतीक है — विनम्रता और श्रद्धा से पूजा करें।',
        sa: 'प्रातः स्नात्वा शुचिपीतवस्त्राणि धारयेत्। ललाटे हरिद्रातिलकं धारयेत्। बृहस्पतिः गुरुतत्त्वस्य प्रतीकः — विनयेन श्रद्धया च पूजां कुर्यात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing north-east. Hold water with turmeric and yellow flowers in the right palm. State your name, gotra, and intention to pacify Guru graha.',
        hi: 'ईशान दिशा की ओर मुख कर बैठें। दाहिने हाथ में हल्दी व पीले फूल सहित जल लेकर गुरु ग्रह शान्ति का संकल्प करें।',
        sa: 'ईशानदिशम् अभिमुखम् उपविशेत्। दक्षिणहस्ते हरिद्रापीतपुष्पसहितजलं गृहीत्वा गुरुग्रहशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Fill a brass or gold-coloured vessel with water. Add turmeric, yellow flowers, and a gold coin if available. Place on a bed of chana dal covered with yellow cloth.',
        hi: 'पीतल या सुनहरे पात्र में जल भरें। हल्दी, पीले फूल और यदि उपलब्ध हो तो सोने का सिक्का डालें। पीले वस्त्र से ढके चना दाल पर रखें।',
        sa: 'पीतलपात्रं सुवर्णवर्णपात्रं वा जलेन पूरयेत्। हरिद्रां पीतपुष्पाणि सुवर्णमुद्रां च यदि उपलभ्यते क्षिपेत्। पीतवस्त्रावृतचणकदालोपरि स्थापयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Guru Avahana (Invocation)', hi: 'गुरु आवाहन', sa: 'गुर्ववाहनम्' },
      description: {
        en: 'Invoke Brihaspati by lighting the ghee lamp and offering yellow flowers and bananas. Apply turmeric to the kalash. Recite "Om Gurave Namah" three times.',
        hi: 'घी का दीपक जलाकर पीले फूल और केले अर्पित कर बृहस्पति का आवाहन करें। कलश पर हल्दी लगाएँ। "ॐ गुरवे नमः" तीन बार बोलें।',
        sa: 'घृतदीपं प्रज्वाल्य पीतपुष्पाणि कदलीफलानि च अर्पयित्वा बृहस्पतिम् आवाहयेत्। कलशे हरिद्रां लेपयेत्। "ओं गुरवे नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Guru Beej Mantra Japa', hi: 'गुरु बीज मन्त्र जप', sa: 'गुरुबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Guru Beej Mantra 19,000 times (or 108 times minimum). Use a pukhraj (yellow sapphire) or turmeric mala. Meditate on a golden-yellow orb of divine wisdom.',
        hi: 'गुरु बीज मन्त्र 19,000 बार (या न्यूनतम 108 बार) जपें। पुखराज या हल्दी माला का उपयोग करें। दिव्य ज्ञान के स्वर्णिम-पीले गोले का ध्यान करें।',
        sa: 'गुरुबीजमन्त्रम् एकोनविंशतिसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। पुष्यरागहरिद्रामालाम् उपयुञ्जीत। दिव्यज्ञानस्य सुवर्णपीतगोलं ध्यायेत्।',
      },
      mantraRef: 'guru-beej',
      essential: true,
      stepType: 'mantra',
      duration: '90-120 min',
    },
    {
      step: 6,
      title: { en: 'Homa (Fire Offering) — Optional', hi: 'होम (हवन) — वैकल्पिक', sa: 'होमः — वैकल्पिकः' },
      description: {
        en: 'If possible, perform a small homa with ghee and sandalwood sticks. Offer chana dal and turmeric into the fire while chanting the Guru Gayatri.',
        hi: 'यदि सम्भव हो तो घी और चन्दन की लकड़ी से लघु होम करें। गुरु गायत्री का जाप करते हुए चना दाल और हल्दी की आहुति दें।',
        sa: 'यदि शक्यं घृतेन चन्दनकाष्ठैश्च लघुहोमं कुर्यात्। गुरुगायत्रीं जपन् चणकदालं हरिद्रां च अग्नौ आहुतिं दद्यात्।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate chana dal and turmeric to a Brahmin or to the needy. Offering guru dakshina (gift to a teacher) is the most powerful Jupiter remedy. Donate yellow items.',
        hi: 'ब्राह्मण या ज़रूरतमन्दों को चना दाल और हल्दी दान करें। गुरु दक्षिणा (शिक्षक को उपहार) सबसे शक्तिशाली बृहस्पति उपाय है। पीली वस्तुएँ दान करें।',
        sa: 'ब्राह्मणाय दीनेभ्यः वा चणकदालं हरिद्रां च दद्यात्। गुरुदक्षिणा (आचार्याय उपहारः) सर्वाधिकशक्तिशालि बृहस्पत्युपचारः। पीतवस्तूनि दद्यात्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Pray to Brihaspati and Lord Dakshinamurti (Shiva as the supreme Guru) for wisdom and dharmic guidance. Perform sashtanga namaskar. Share prasad with all.',
        hi: 'ज्ञान और धर्म मार्गदर्शन हेतु बृहस्पति और दक्षिणामूर्ति (परम गुरु रूप शिव) से प्रार्थना करें। साष्टांग नमस्कार करें। सबको प्रसाद बाँटें।',
        sa: 'ज्ञानधर्ममार्गदर्शनाय बृहस्पतिं दक्षिणामूर्तिं (परमगुरुरूपं शिवम्) च प्रार्थयेत्। साष्टाङ्गनमस्कारं कुर्यात्। सर्वेभ्यः प्रसादं वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'guru-beej',
      name: { en: 'Guru Beej Mantra', hi: 'गुरु बीज मन्त्र', sa: 'गुरुबीजमन्त्रः' },
      devanagari: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      iast: 'oṃ grāṃ grīṃ grauṃ saḥ gurave namaḥ',
      meaning: {
        en: 'Salutations to Jupiter (Guru). The seed syllables invoke Brihaspati\'s expansive energy for wisdom, prosperity, and divine grace.',
        hi: 'गुरु (बृहस्पति) को नमन। बीज अक्षर बृहस्पति की विस्तारक ऊर्जा का आवाहन ज्ञान, समृद्धि और दिव्य कृपा हेतु करते हैं।',
        sa: 'गुरवे (बृहस्पतये) नमः। बीजाक्षराणि बृहस्पतेः विस्तारकऊर्जां ज्ञानसमृद्धिदिव्यकृपायै आवाहयन्ति।',
      },
      japaCount: 19000,
      usage: {
        en: 'Chant 19,000 times for full Guru shanti; 108 times daily for ongoing remedy',
        hi: 'पूर्ण गुरु शान्ति के लिए 19,000 बार जपें; दैनिक उपाय के लिए 108 बार',
        sa: 'पूर्णगुरुशान्त्यर्थम् एकोनविंशतिसहस्रवारं जपेत्; नित्योपचारार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'guru-gayatri',
      name: { en: 'Guru Gayatri Mantra', hi: 'गुरु गायत्री मन्त्र', sa: 'गुरुगायत्रीमन्त्रः' },
      devanagari: 'ॐ वृषभध्वजाय विद्महे ग्रहराजाय धीमहि ।\nतन्नो गुरुः प्रचोदयात् ॥',
      iast: 'oṃ vṛṣabhadhvajāya vidmahe graharājāya dhīmahi |\ntanno guruḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the one with the bull banner (Brihaspati), the king of planets. May Jupiter inspire wisdom and righteous conduct in us.',
        hi: 'हम वृषभध्वज (बृहस्पति), ग्रहराज का ध्यान करते हैं। गुरु हमें ज्ञान और धर्माचरण की प्रेरणा दें।',
        sa: 'वृषभध्वजं (बृहस्पतिम्) ग्रहराजं ध्यायामः। गुरुः नः ज्ञानं धर्माचरणं च प्रेरयतु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during homa and as a daily prayer on Thursdays for wisdom',
        hi: 'होम के समय और गुरुवार को ज्ञान प्राप्ति हेतु दैनिक प्रार्थना के रूप में जपें',
        sa: 'होमसमये गुरुवासरे ज्ञानप्राप्त्यर्थं दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer chana dal preparations (besan laddu, chana dal halwa), bananas, and yellow sweets. Serve in a brass vessel.',
    hi: 'चना दाल से बने पकवान (बेसन लड्डू, चना दाल हलवा), केले और पीली मिठाई अर्पित करें। पीतल के पात्र में रखें।',
    sa: 'चणकदालनिर्मितपक्वान्नानि (बेसनमोदकम्, चणकदालहल्वा) कदलीफलानि पीतमिष्टान्नानि च अर्पयेत्। पीतलपात्रे स्थापयेत्।',
  },

  precautions: [
    {
      en: 'Face north-east during the puja. Yellow is the essential colour. Respect for elders and teachers should be maintained throughout the day.',
      hi: 'पूजा में ईशान दिशा की ओर मुख करें। पीला रंग आवश्यक है। दिन भर बड़ों और गुरुजनों के प्रति सम्मान बनाए रखें।',
      sa: 'पूजायाम् ईशानदिशम् अभिमुखं कुर्यात्। पीतवर्णः अनिवार्यः। दिनं यावत् वृद्धानां गुरूणां च सम्मानं पालयेत्।',
    },
    {
      en: 'Avoid non-vegetarian food and alcohol on Thursday. Jupiter represents sattvic dharma.',
      hi: 'गुरुवार को माँसाहार और मदिरा से बचें। बृहस्पति सात्विक धर्म का प्रतीक है।',
      sa: 'गुरुवासरे मांसाहारं मद्यं च वर्जयेत्। बृहस्पतिः सात्त्विकधर्मस्य प्रतीकः।',
    },
    {
      en: 'Visiting a temple and offering prayers to Lord Vishnu on Thursday amplifies Guru shanti.',
      hi: 'गुरुवार को मन्दिर जाकर भगवान विष्णु की प्रार्थना करने से गुरु शान्ति का प्रभाव बढ़ता है।',
      sa: 'गुरुवासरे मन्दिरं गत्वा विष्णोः प्रार्थनां कर्तुं गुरुशान्तेः प्रभावं वर्धयति।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Jupiter. Bestows wisdom, prosperity, marital bliss, progeny, spiritual growth, respect in society, success in education, and resolution of legal matters.',
    hi: 'पीड़ित बृहस्पति को शान्त करता है। ज्ञान, समृद्धि, वैवाहिक सुख, सन्तान, आध्यात्मिक विकास, समाज में सम्मान, शिक्षा में सफलता और कानूनी मामलों का निवारण प्रदान करता है।',
    sa: 'पीडितबृहस्पतिं शमयति। ज्ञानं समृद्धिं वैवाहिकसुखं सन्तानम् आध्यात्मिकविकासं समाजे सम्मानं शिक्षायां सफलतां विधिविवादनिवारणं च प्रददाति।',
  },
};

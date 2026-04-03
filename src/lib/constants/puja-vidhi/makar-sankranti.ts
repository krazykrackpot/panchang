import type { PujaVidhi } from './types';

export const MAKAR_SANKRANTI_PUJA: PujaVidhi = {
  festivalSlug: 'makar-sankranti',
  category: 'festival',
  deity: { en: 'Surya (Sun God)', hi: 'सूर्य (सूर्य देव)', sa: 'सूर्यः (सूर्यदेवः)' },

  samagri: [
    { name: { en: 'Til (sesame seeds — black and white)', hi: 'तिल (काले और सफेद)', sa: 'तिलाः (कृष्णाः शुक्लाः च)' }, category: 'food', essential: true },
    { name: { en: 'Gur (jaggery)', hi: 'गुड़', sa: 'गुडम्' }, category: 'food', essential: true },
    { name: { en: 'Khichdi ingredients (rice and urad dal)', hi: 'खिचड़ी सामग्री (चावल और उड़द दाल)', sa: 'खिच्चिकासामग्री (तण्डुलाः माषदालं च)' }, category: 'food', essential: true },
    { name: { en: 'New pot for Arghya (copper or brass)', hi: 'अर्घ्य के लिए नया पात्र (ताम्बे या पीतल का)', sa: 'अर्घ्यार्थं नवपात्रम् (ताम्रं पीतलं वा)' }, quantity: '1', category: 'vessels', essential: true },
    { name: { en: 'Water (for Arghya)', hi: 'जल (अर्घ्य के लिए)', sa: 'जलम् (अर्घ्यार्थम्)' }, category: 'other', essential: true },
    { name: { en: 'Red flowers (marigold, red lotus)', hi: 'लाल फूल (गेंदा, लाल कमल)', sa: 'रक्तपुष्पाणि (स्थलपद्मम्, रक्तकमलम्)' }, category: 'flowers', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Fruits (sugarcane, banana, orange)', hi: 'फल (गन्ना, केला, संतरा)', sa: 'फलानि (इक्षुः, कदलीफलम्, नारङ्गम्)' }, category: 'food', essential: false },
    { name: { en: 'Til-Gur laddoo (sesame-jaggery sweets)', hi: 'तिल-गुड़ के लड्डू', sa: 'तिलगुडमोदकानि' }, category: 'food', essential: true },
    { name: { en: 'Warm clothes (for donation)', hi: 'गर्म कपड़े (दान के लिए)', sa: 'उष्णवस्त्राणि (दानार्थम्)' }, category: 'clothing', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Surya Arghya must be offered at the exact Sankranti moment — when the Sun transitions from Dhanu (Sagittarius) to Makara (Capricorn) rashi. The punya kaal (auspicious period) extends for 16 ghatikas (about 6.5 hours) after the Sankranti moment. Ideally, arghya is offered to the rising sun in the morning.',
    hi: 'सूर्य अर्घ्य ठीक संक्रान्ति काल में — जब सूर्य धनु से मकर राशि में प्रवेश करता है — देना चाहिए। पुण्यकाल संक्रान्ति क्षण के बाद 16 घटी (लगभग 6.5 घण्टे) तक रहता है। आदर्श रूप से, प्रातः उदित सूर्य को अर्घ्य दें।',
    sa: 'सूर्यार्घ्यं संक्रान्तिकाले — यदा सूर्यो धनुराशेः मकरराशिं प्रविशति — तदा दद्यात्। पुण्यकालः संक्रान्तिक्षणानन्तरं षोडशघटिकाः (प्रायः सार्धषड्होराः) यावत् तिष्ठति। प्रातः उदिताय सूर्याय अर्घ्यं दद्यात्।',
  },
  muhurtaWindow: { type: 'brahma_muhurta' },

  sankalpa: {
    en: 'On this auspicious Makar Sankranti, when the Sun begins his Uttarayana (northward journey), I offer arghya to Lord Surya and perform puja for health, vitality, wisdom, and the removal of all darkness from my life.',
    hi: 'इस शुभ मकर संक्रान्ति पर, जब सूर्य अपनी उत्तरायण यात्रा आरम्भ करते हैं, मैं भगवान सूर्य को अर्घ्य अर्पित करता/करती हूँ और अपने जीवन से समस्त अन्धकार दूर कर स्वास्थ्य, ओज, ज्ञान की प्राप्ति हेतु पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे मकरसंक्रान्तौ यदा सूर्यः उत्तरायणं प्रारभते तदा श्रीसूर्यदेवाय अर्घ्यं समर्पयामि आरोग्यतेजोज्ञानप्राप्त्यर्थं सर्वान्धकारनिवारणार्थं च पूजनं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Early Morning Holy Bath', hi: 'प्रातःकालीन पवित्र स्नान', sa: 'प्रातःकालीनपवित्रस्नानम्' },
      description: {
        en: 'Wake before sunrise and take a holy bath. If possible, bathe in a river, especially the Ganga, Yamuna, or any sacred river. Add sesame seeds and a few drops of Ganga water to the bathing water. This removes sins and purifies the body.',
        hi: 'सूर्योदय से पहले उठकर पवित्र स्नान करें। सम्भव हो तो नदी में, विशेषकर गंगा, यमुना या किसी पवित्र नदी में स्नान करें। स्नान के जल में तिल और गंगाजल की कुछ बूँदें डालें। इससे पाप नष्ट होते हैं और शरीर शुद्ध होता है।',
        sa: 'सूर्योदयात् पूर्वम् उत्थाय पवित्रस्नानं कुर्यात्। शक्ये सति नद्यां विशेषतो गङ्गायां यमुनायां अन्यस्यां पवित्रनद्यां वा स्नायात्। स्नानजले तिलान् गङ्गाजलबिन्दून् च क्षिपेत्। अनेन पापं नश्यति शरीरं शुद्ध्यति च।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Surya Arghya (Water Offering to the Sun)', hi: 'सूर्य अर्घ्य (सूर्य को जल अर्पण)', sa: 'सूर्यार्घ्यम् (सूर्याय जलार्पणम्)' },
      description: {
        en: 'Face the rising sun. Fill the copper/brass pot with water, add red flowers, akshat, kumkum, and sesame seeds. Raise the pot with both hands and slowly pour the water in a steady stream towards the sun while chanting the Surya Gayatri Mantra. The water stream should catch sunlight, creating a rainbow effect.',
        hi: 'उदित सूर्य की ओर मुख करें। ताम्बे/पीतल के पात्र में जल भरकर लाल फूल, अक्षत, कुमकुम और तिल डालें। दोनों हाथों से पात्र उठाकर सूर्य गायत्री मन्त्र पढ़ते हुए धीरे-धीरे सूर्य की दिशा में जलधारा प्रवाहित करें। जलधारा से सूर्य किरणों का इन्द्रधनुषी प्रभाव दिखना चाहिए।',
        sa: 'उदितसूर्याभिमुखं तिष्ठेत्। ताम्रपात्रे जलं पूरयित्वा रक्तपुष्पाणि अक्षतान् कुङ्कुमं तिलान् च क्षिपेत्। उभाभ्यां हस्ताभ्यां पात्रम् उत्थाप्य सूर्यगायत्रीमन्त्रं पठन् शनैः सूर्याभिमुखं जलधारां प्रवाहयेत्। जलधारायां सूर्यकिरणैः इन्द्रधनुषप्रभावो भवेत्।',
      },
      mantraRef: 'surya-gayatri',
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Surya Puja at the Altar', hi: 'वेदी पर सूर्य पूजा', sa: 'वेदिकायां सूर्यपूजनम्' },
      description: {
        en: 'Set up a small altar facing east. Place a Surya image or draw a sun symbol with kumkum. Light a ghee lamp and incense. Offer red flowers, akshat, kumkum, and fruits. Chant the Surya Beej Mantra 108 times.',
        hi: 'पूर्वमुखी छोटी वेदी स्थापित करें। सूर्य का चित्र रखें या कुमकुम से सूर्य का चिह्न बनाएँ। घी का दीपक और अगरबत्ती जलाएँ। लाल फूल, अक्षत, कुमकुम और फल अर्पित करें। सूर्य बीज मन्त्र 108 बार जपें।',
        sa: 'पूर्वाभिमुखां लघुवेदिकां स्थापयेत्। सूर्यचित्रं स्थापयेत् कुङ्कुमेन वा सूर्यचिह्नं लिखेत्। घृतदीपं धूपं च प्रज्वालयेत्। रक्तपुष्पाणि अक्षतान् कुङ्कुमं फलानि च समर्पयेत्। सूर्यबीजमन्त्रम् अष्टोत्तरशतवारं जपेत्।',
      },
      mantraRef: 'surya-beej',
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Til-Gur Distribution', hi: 'तिल-गुड़ वितरण', sa: 'तिलगुडवितरणम्' },
      description: {
        en: 'Prepare til-gur laddoos (sesame-jaggery sweets). Distribute them to family, neighbours, and friends with the greeting "Til gur ghya, god god bola" (Take til-gur, speak sweetly). This symbolises harmony and sweet relationships.',
        hi: 'तिल-गुड़ के लड्डू बनाएँ। परिवार, पड़ोसियों और मित्रों में "तिल गुड़ घ्या, गोड गोड बोला" (तिल-गुड़ लो, मीठा बोलो) कहते हुए वितरित करें। यह सद्भावना और मधुर सम्बन्धों का प्रतीक है।',
        sa: 'तिलगुडमोदकानि निर्माय कुटुम्बिनां प्रतिवासिनां मित्राणां च मध्ये "तिलगुडं गृह्णीत मधुरं वदत" इति सम्भाष्य वितरेत्। इदं सौहार्दमधुरसम्बन्धस्य प्रतीकम्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Khichdi Preparation and Offering', hi: 'खिचड़ी निर्माण और भोग', sa: 'खिच्चिकानिर्माणं नैवेद्यं च' },
      description: {
        en: 'Cook khichdi (rice and urad dal with ghee and spices). Offer it first to Surya Devata as naivedya with a lit lamp. Then serve the khichdi to family members. In many regions, khichdi made with newly harvested grain is considered highly auspicious.',
        hi: 'खिचड़ी (चावल और उड़द दाल, घी और मसालों सहित) पकाएँ। पहले जलते दीपक सहित सूर्य देवता को नैवेद्य के रूप में अर्पित करें। फिर परिवार को खिचड़ी परोसें। कई क्षेत्रों में नई फसल के अनाज से बनी खिचड़ी अत्यन्त शुभ मानी जाती है।',
        sa: 'खिच्चिकां (तण्डुलमाषदालं घृतव्यञ्जनसहितम्) पचेत्। प्रथमं प्रज्वलितदीपसहितं सूर्यदेवाय नैवेद्यरूपेण निवेदयेत्। ततः कुटुम्बिनां खिच्चिकां परिवेषयेत्। बहुषु प्रदेशेषु नवसस्यतण्डुलनिर्मिता खिच्चिका अत्यन्तशुभा मन्यते।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Aditya Hridayam Recitation', hi: 'आदित्य हृदयम् पाठ', sa: 'आदित्यहृदयपाठः' },
      description: {
        en: 'Recite the Aditya Hridayam — the sacred hymn taught by sage Agastya to Lord Rama before his battle with Ravana. This is the most powerful Surya stotra and grants victory, health, and removal of all enemies.',
        hi: 'आदित्य हृदयम् का पाठ करें — रावण के विरुद्ध युद्ध से पूर्व ऋषि अगस्त्य द्वारा भगवान राम को सिखाया गया पवित्र स्तोत्र। यह सबसे शक्तिशाली सूर्य स्तोत्र है जो विजय, स्वास्थ्य और समस्त शत्रुओं का नाश प्रदान करता है।',
        sa: 'आदित्यहृदयं पठेत् — रावणेन सह युद्धात् पूर्वम् अगस्त्यमुनिना श्रीरामाय उपदिष्टं पवित्रस्तोत्रम्। इदं सर्वशक्तिमत्सूर्यस्तोत्रं विजयम् आरोग्यं सर्वशत्रुविनाशं च ददाति।',
      },
      mantraRef: 'aditya-hridayam',
      duration: '15 min',
      essential: false,
      stepType: 'mantra',
    },
    {
      step: 7,
      title: { en: 'Daan (Donation)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate sesame seeds, jaggery, warm clothes (blankets, shawls), and food to the needy and to Brahmins. Til daan (sesame donation) on Makar Sankranti is considered equivalent to a hundred other charities. Also donate khichdi and fruits.',
        hi: 'जरूरतमन्दों और ब्राह्मणों को तिल, गुड़, गर्म कपड़े (कम्बल, शॉल) और भोजन दान करें। मकर संक्रान्ति पर तिल दान सौ अन्य दानों के बराबर माना जाता है। खिचड़ी और फल भी दान करें।',
        sa: 'दीनेभ्यो ब्राह्मणेभ्यश्च तिलान् गुडम् उष्णवस्त्राणि (कम्बलान् उत्तरीयाणि) भोजनं च दद्यात्। मकरसंक्रान्तौ तिलदानं शतान्यदानतुल्यं मन्यते। खिच्चिकां फलानि च दद्यात्।',
      },
      duration: '15 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Surya Aarti', hi: 'सूर्य आरती', sa: 'सूर्यारात्रिकम्' },
      description: {
        en: 'Perform aarti of Lord Surya with a ghee lamp and camphor. Sing the Surya Aarti while facing the sun. Ring a bell during the aarti. Offer red flowers at the conclusion.',
        hi: 'घी के दीपक और कपूर से भगवान सूर्य की आरती करें। सूर्य की ओर मुख करके सूर्य आरती गाएँ। आरती के दौरान घण्टी बजाएँ। अन्त में लाल फूल अर्पित करें।',
        sa: 'घृतदीपकर्पूरेण श्रीसूर्यस्य आरात्रिकं कुर्यात्। सूर्याभिमुखं सूर्यारात्रिकं गायेत्। आरात्रिकसमये घण्टां वादयेत्। अन्ते रक्तपुष्पाणि समर्पयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 9,
      title: { en: 'Kite Flying (Regional Celebration)', hi: 'पतंग उड़ाना (क्षेत्रीय उत्सव)', sa: 'पतङ्गोड्डयनम् (प्रादेशिकोत्सवः)' },
      description: {
        en: 'In Gujarat, Rajasthan, and other regions, kite flying is an integral part of Makar Sankranti celebrations. Fly kites in the afternoon sun — the exposure to sunlight during the transition of seasons is considered beneficial for health, as winter UV rays help cure skin ailments.',
        hi: 'गुजरात, राजस्थान और अन्य क्षेत्रों में पतंग उड़ाना मकर संक्रान्ति का अभिन्न अंग है। दोपहर की धूप में पतंग उड़ाएँ — ऋतु-परिवर्तन में सूर्य प्रकाश शरीर के लिए लाभकारी माना जाता है, शीतकालीन पराबैंगनी किरणें त्वचा रोगों में सहायक होती हैं।',
        sa: 'गुर्जरराजस्थानादिप्रदेशेषु पतङ्गोड्डयनं मकरसंक्रान्तेः अभिन्नम् अङ्गम्। अपराह्णसूर्ये पतङ्गम् उड्डयेत् — ऋतुसन्धौ सूर्यप्रकाशः शरीराय हितकरो मन्यते शैत्यकालीनाः पराबैंगनीकिरणाः त्वग्रोगेषु सहायकाः।',
      },
      duration: '60 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 10,
      title: { en: 'Prarthana (Closing Prayer)', hi: 'प्रार्थना (समापन)', sa: 'प्रार्थना (समापनम्)' },
      description: {
        en: 'In the evening, light a lamp and offer a final prayer to Surya Devata. Express gratitude for the Sun\'s northward journey (Uttarayana) which brings longer days, warmth, and the harvest season. Seek blessings for the coming agricultural cycle.',
        hi: 'सायंकाल दीपक जलाकर सूर्य देवता को अन्तिम प्रार्थना करें। सूर्य की उत्तरायण यात्रा के लिए कृतज्ञता व्यक्त करें जो लम्बे दिन, गर्मी और फसल का मौसम लाती है। आगामी कृषि चक्र के लिए आशीर्वाद माँगें।',
        sa: 'सायंकाले दीपं प्रज्वाल्य सूर्यदेवाय अन्तिमां प्रार्थनां कुर्यात्। सूर्यस्य उत्तरायणयात्रायै कृतज्ञतां प्रकटयेत् यो दीर्घदिवसान् उष्णतां सस्यकालं च आनयति। आगामिकृषिचक्रस्य कृते आशीर्वादं प्रार्थयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'surya-gayatri',
      name: { en: 'Surya Gayatri Mantra', hi: 'सूर्य गायत्री मन्त्र', sa: 'सूर्यगायत्रीमन्त्रः' },
      devanagari: 'ॐ भास्कराय विद्महे महाद्युतिकराय धीमहि तन्नो आदित्यः प्रचोदयात्',
      iast: 'oṃ bhāskarāya vidmahe mahādyutikarāya dhīmahi tanno ādityaḥ pracodayāt',
      meaning: {
        en: 'We meditate upon the radiant Sun (Bhaskara). We contemplate the one of great brilliance. May that Aditya (Sun) inspire and illuminate us.',
        hi: 'हम तेजस्वी सूर्य (भास्कर) का ध्यान करते हैं। महान प्रकाश वाले का चिन्तन करते हैं। वह आदित्य (सूर्य) हमें प्रेरित और प्रकाशित करें।',
        sa: 'भास्करं विद्मः। महाद्युतिकरं धीमहि। आदित्यः नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Primary mantra for Surya Arghya — chant while pouring water towards the sun',
        hi: 'सूर्य अर्घ्य का मुख्य मन्त्र — सूर्य की ओर जल प्रवाहित करते हुए जपें',
        sa: 'सूर्यार्घ्यस्य प्रधानमन्त्रः — सूर्याभिमुखं जलं प्रवाहयन् जपेत्',
      },
    },
    {
      id: 'surya-beej',
      name: { en: 'Surya Beej Mantra', hi: 'सूर्य बीज मन्त्र', sa: 'सूर्यबीजमन्त्रः' },
      devanagari: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
      iast: 'oṃ hrāṃ hrīṃ hrauṃ saḥ sūryāya namaḥ',
      meaning: {
        en: 'Salutations to Lord Surya through his seed sounds — Hraam, Hreem, Hraum — the vibrational essence of solar energy',
        hi: 'सूर्य देव को उनके बीज ध्वनियों — ह्रां, ह्रीं, ह्रौं — सौर ऊर्जा के कम्पन सार — के माध्यम से नमन',
        sa: 'सूर्यदेवाय तस्य बीजध्वनिभिः — ह्रां ह्रीं ह्रौं — सौरशक्तेः कम्पनसारैः नमः',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times during the Surya Puja at the altar for health and vitality',
        hi: 'स्वास्थ्य और ओज के लिए वेदी पर सूर्य पूजा के दौरान 108 बार जपें',
        sa: 'आरोग्यतेजोऽर्थं वेदिकायां सूर्यपूजनसमये अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'aditya-hridayam',
      name: { en: 'Aditya Hridayam (Opening Verse)', hi: 'आदित्य हृदयम् (प्रथम श्लोक)', sa: 'आदित्यहृदयम् (प्रथमश्लोकः)' },
      devanagari: 'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम्।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम्॥',
      iast: 'tato yuddhaparśrāntaṃ samare cintayā sthitam |\nrāvaṇaṃ cāgrato dṛṣṭvā yuddhāya samupasthitam ||',
      meaning: {
        en: 'Then, seeing Rama exhausted and anxious in battle, and Ravana standing before him ready to fight, sage Agastya approached and spoke.',
        hi: 'तब, युद्ध से थके और चिन्तित राम को देखकर, और रावण को युद्ध के लिए सामने खड़ा देखकर, ऋषि अगस्त्य ने आकर कहा।',
        sa: 'ततो युद्धपरिश्रान्तं चिन्तया स्थितं रामं दृष्ट्वा रावणं च युद्धाय अग्रतः उपस्थितं दृष्ट्वा अगस्त्यमुनिः आगत्य अवदत्।',
      },
      usage: {
        en: 'Opening verse of the Aditya Hridayam from Ramayana — recite the full 31 verses for complete benefit',
        hi: 'रामायण के आदित्य हृदयम् का प्रथम श्लोक — पूर्ण लाभ के लिए सम्पूर्ण 31 श्लोक पढ़ें',
        sa: 'रामायणस्य आदित्यहृदयस्य प्रथमश्लोकः — सम्पूर्णफलार्थम् एकत्रिंशत्श्लोकान् पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Aditya Hridayam Stotram', hi: 'आदित्य हृदयम् स्तोत्रम्', sa: 'आदित्यहृदयस्तोत्रम्' },
      verseCount: 31,
      duration: '15 min',
      note: {
        en: 'The supreme hymn to the Sun from the Yuddha Kanda of Valmiki Ramayana. Taught by Agastya to Rama for victory over Ravana.',
        hi: 'वाल्मीकि रामायण के युद्ध काण्ड से सूर्य का सर्वोत्कृष्ट स्तोत्र। रावण पर विजय के लिए अगस्त्य द्वारा राम को सिखाया गया।',
        sa: 'वाल्मीकिरामायणस्य युद्धकाण्डात् सूर्यस्य सर्वोत्कृष्टस्तोत्रम्। रावणविजयार्थम् अगस्त्येन रामाय उपदिष्टम्।',
      },
    },
    {
      name: { en: 'Surya Ashtakam', hi: 'सूर्याष्टकम्', sa: 'सूर्याष्टकम्' },
      verseCount: 8,
      duration: '5 min',
      note: {
        en: 'Eight verses praising the Sun God. Short yet powerful, ideal for daily recitation during Sankranti week.',
        hi: 'सूर्य देव की स्तुति के आठ श्लोक। संक्षिप्त किन्तु शक्तिशाली, संक्रान्ति सप्ताह में दैनिक पाठ के लिए उत्तम।',
        sa: 'सूर्यदेवस्य स्तुत्यष्टश्लोकाः। संक्षिप्ताः किन्तु शक्तिमन्तः, संक्रान्तिसप्ताहे दैनिकपाठार्थम् उत्तमाः।',
      },
    },
  ],

  aarti: {
    name: { en: 'Om Jai Surya Bhagavan', hi: 'ॐ जय सूर्य भगवान', sa: 'ॐ जय सूर्यभगवान्' },
    devanagari:
      'ॐ जय सूर्य भगवान, प्रभु जय सूर्य भगवान।\nतिमिर अन्धेरा मिटत, आपका किरण प्रकाश॥\nॐ जय सूर्य भगवान॥\n\nउत्तरायण शुभ गमन, मकर संक्रान्ति आज।\nधरती पर सुख बरसत, तेरे तेजमय राज॥\nॐ जय सूर्य भगवान॥\n\nसप्त अश्व रथ राजत, सारथि अरुण विराज।\nद्वादश रूप धरत प्रभु, आदित्य दिव्य साज॥\nॐ जय सूर्य भगवान॥\n\nसंजीवनी शक्ति दाता, जगत के प्राणाधार।\nतिल गुड़ का भोग लगाकर, करत जगत उद्धार॥\nॐ जय सूर्य भगवान॥',
    iast:
      'oṃ jaya sūrya bhagavān, prabhu jaya sūrya bhagavān |\ntimira andherā miṭata, āpakā kiraṇa prakāśa ||\noṃ jaya sūrya bhagavān ||\n\nuttarāyaṇa śubha gamana, makara saṅkrānti āja |\ndharatī para sukha barasata, tere tejamaya rāja ||\noṃ jaya sūrya bhagavān ||\n\nsapta aśva ratha rājata, sārathi aruṇa virāja |\ndvādaśa rūpa dharata prabhu, āditya divya sāja ||\noṃ jaya sūrya bhagavān ||\n\nsaṃjīvanī śakti dātā, jagata ke prāṇādhāra |\ntila guḍa kā bhoga lagākara, karata jagata uddhāra ||\noṃ jaya sūrya bhagavān ||',
  },

  naivedya: {
    en: 'Khichdi (rice and urad dal), til-gur laddoo (sesame-jaggery sweets), sugarcane, seasonal fruits, til chikki, gajak, and revdi',
    hi: 'खिचड़ी (चावल और उड़द दाल), तिल-गुड़ के लड्डू, गन्ना, मौसमी फल, तिल चिक्की, गजक और रेवड़ी',
    sa: 'खिच्चिका (तण्डुलमाषदालम्), तिलगुडमोदकानि, इक्षुः, ऋतुफलानि, तिलचिक्की, गजकं रेवडी च',
  },

  precautions: [
    {
      en: 'Arghya must be offered before the Sankranti moment passes — check the exact time of Sun\'s ingress into Makara rashi',
      hi: 'संक्रान्ति क्षण बीतने से पहले अर्घ्य देना अनिवार्य है — सूर्य के मकर राशि प्रवेश का सही समय जाँचें',
      sa: 'संक्रान्तिक्षणात् पूर्वम् अर्घ्यं दद्यात् — सूर्यस्य मकरराशिप्रवेशस्य सम्यक्कालं जानीयात्',
    },
    {
      en: 'Donate sesame (til) — do not merely consume it. Til daan is the primary dharmic act of Makar Sankranti',
      hi: 'तिल का दान करें — केवल खाएँ नहीं। तिल दान मकर संक्रान्ति का प्रमुख धार्मिक कार्य है',
      sa: 'तिलान् दद्यात् — केवलं न भक्षयेत्। तिलदानं मकरसंक्रान्तेः प्रधानधर्मकर्म',
    },
    {
      en: 'Bathe in flowing water (river or stream) if possible — standing water is less meritorious on this day',
      hi: 'सम्भव हो तो बहते जल (नदी या नाले) में स्नान करें — इस दिन ठहरे जल में स्नान कम पुण्यकारी है',
      sa: 'शक्ये सति प्रवाहिजले (नद्यां स्रोतसि वा) स्नायात् — अस्मिन् दिने स्थिरजलस्नानं न्यूनपुण्यकरम्',
    },
    {
      en: 'Avoid tamasic food on this day — consume sattvik food, especially til, gur, and khichdi',
      hi: 'इस दिन तामसिक भोजन से बचें — सात्विक भोजन, विशेषकर तिल, गुड़ और खिचड़ी खाएँ',
      sa: 'अस्मिन् दिने तामसम् आहारं वर्जयेत् — सात्त्विकम् आहारं विशेषतः तिलं गुडं खिच्चिकां च सेवेत',
    },
    {
      en: 'Use a copper or brass vessel for arghya — do not use steel, plastic, or glass',
      hi: 'अर्घ्य के लिए ताम्बे या पीतल का पात्र उपयोग करें — स्टील, प्लास्टिक या काँच का प्रयोग न करें',
      sa: 'अर्घ्यार्थं ताम्रं पीतलपात्रं वा उपयोजयेत् — इस्पातं प्लास्टिकं काचं वा न उपयोजयेत्',
    },
  ],

  phala: {
    en: 'Blessings of Surya Devata for health, vitality, and long life; purification of past sins through holy bath and til daan; auspicious beginning of Uttarayana (the path of the gods); prosperity through charity; and harmony in relationships through sweet words and til-gur sharing',
    hi: 'स्वास्थ्य, ओज और दीर्घायु के लिए सूर्य देवता का आशीर्वाद; पवित्र स्नान और तिल दान से पूर्व पापों का शुद्धिकरण; उत्तरायण (देवयान मार्ग) का शुभ आरम्भ; दान से समृद्धि; और मीठे बोल व तिल-गुड़ बाँटने से सम्बन्धों में सामंजस्य',
    sa: 'आरोग्यतेजोदीर्घायुषे सूर्यदेवस्य आशीर्वादः; पवित्रस्नानतिलदानेन पूर्वपापशुद्धिः; उत्तरायणस्य (देवयानमार्गस्य) शुभारम्भः; दानेन समृद्धिः; मधुरवचनतिलगुडवितरणेन सम्बन्धसामञ्जस्यं च',
  },
};

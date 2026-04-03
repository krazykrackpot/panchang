import type { PujaVidhi } from './types';

export const HOLIKA_DAHAN_PUJA: PujaVidhi = {
  festivalSlug: 'holika-dahan',
  category: 'festival',
  deity: { en: 'Vishnu (Narasimha) / Prahlada', hi: 'विष्णु (नरसिंह) / प्रह्लाद', sa: 'विष्णुः (नृसिंहः) / प्रह्लादः' },

  samagri: [
    { name: { en: 'Cow dung cakes', hi: 'गोबर के उपले', sa: 'गोमयोपलाः' }, quantity: '15-20', category: 'puja_items', essential: true },
    { name: { en: 'Wood logs and dry twigs', hi: 'लकड़ी के लट्ठे और सूखी टहनियाँ', sa: 'काष्ठखण्डाः शुष्कशाखाश्च' }, category: 'puja_items', essential: true },
    { name: { en: 'Whole coconut (with husk)', hi: 'साबुत नारियल (छिलके सहित)', sa: 'सम्पूर्णनारिकेलम् (सवल्कलम्)' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'White sesame seeds (til)', hi: 'सफ़ेद तिल', sa: 'श्वेततिलाः' }, category: 'food', essential: true },
    { name: { en: 'New harvest wheat ears', hi: 'नई फसल की गेहूँ की बालियाँ', sa: 'नवगोधूमशीर्षाणि' }, category: 'food', essential: true },
    { name: { en: 'Raw cotton thread (sutli)', hi: 'कच्चा सूती धागा (सूतली)', sa: 'कार्पाससूत्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Water pot (for parikrama)', hi: 'जल का लोटा (परिक्रमा हेतु)', sa: 'जलकुम्भः (प्रदक्षिणार्थम्)' }, category: 'vessels', essential: true },
    { name: { en: 'Garland of flowers', hi: 'फूलों की माला', sa: 'पुष्पमाला' }, category: 'flowers', essential: false },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1', category: 'puja_items', essential: true },
    { name: { en: 'Roasted gram and popcorn', hi: 'भुने चने और पॉपकॉर्न', sa: 'भर्जितचणकाः लाजाश्च' }, category: 'food', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Holika Dahan is performed during Pradosh Kaal (after sunset) on the Purnima tithi of Phalguna month, when Bhadra has ended. The fire must be lit only after the Bhadra period has passed.',
    hi: 'होलिका दहन फाल्गुन मास की पूर्णिमा तिथि पर प्रदोष काल (सूर्यास्त के बाद) में किया जाता है, जब भद्रा समाप्त हो जाती है। अग्नि भद्रा काल समाप्ति के बाद ही प्रज्वलित करनी चाहिए।',
    sa: 'होलिकादहनं फाल्गुनमासस्य पूर्णिमातिथौ प्रदोषकाले (सूर्यास्तोत्तरम्) भद्राकालसमाप्त्यनन्तरं क्रियते। भद्राकालातीते एव अग्निः प्रज्वालनीया।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this auspicious Phalguna Purnima, I perform this Holika Dahan for the destruction of all evil and negativity, celebrating the triumph of devotee Prahlada over demoness Holika, by the grace of Lord Narasimha. May all sins and obstacles be consumed in this sacred fire.',
    hi: 'इस शुभ फाल्गुन पूर्णिमा पर, समस्त पापों एवं नकारात्मकता के विनाश हेतु, भक्त प्रह्लाद की राक्षसी होलिका पर विजय के उत्सव में, भगवान नरसिंह की कृपा से, मैं यह होलिका दहन करता/करती हूँ। इस पवित्र अग्नि में समस्त पाप और विघ्न भस्म हों।',
    sa: 'अस्मिन् शुभे फाल्गुनपूर्णिमायां सर्वपापनकारात्मकतानाशनार्थं भक्तप्रह्लादस्य होलिकोपरि विजयोत्सवे श्रीनृसिंहकृपया होलिकादहनमहं करिष्ये। अस्मिन् पवित्राग्नौ सर्वपापविघ्नाः भस्मीभवन्तु।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Holika Pyre Construction', hi: 'होलिका चिता निर्माण', sa: 'होलिकाचितारचना' },
      description: {
        en: 'Days before the festival, collect cow dung cakes, wood logs, and dry material. Build a large pyre in an open community area. Place a wooden post in the center symbolizing Prahlada. Wind raw cotton thread (sutli) around the pyre.',
        hi: 'त्योहार से कुछ दिन पहले गोबर के उपले, लकड़ी के लट्ठे और सूखी सामग्री एकत्र करें। खुले सामुदायिक क्षेत्र में एक बड़ी चिता बनाएँ। बीच में प्रह्लाद के प्रतीक के रूप में एक लकड़ी का खम्भा रखें। कच्चे सूती धागे (सूतली) से चिता को लपेटें।',
        sa: 'उत्सवात् कतिपयदिनानि पूर्वं गोमयोपलान् काष्ठखण्डान् शुष्कसामग्रीं च सङ्कलयेत्। विवृतसामुदायिकक्षेत्रे बृहच्चितां रचयेत्। मध्ये प्रह्लादप्रतीकरूपेण काष्ठस्तम्भं स्थापयेत्। कार्पाससूत्रेण चितां वेष्टयेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Puja Sthapana & Invocation', hi: 'पूजा स्थापना एवं आवाहन', sa: 'पूजास्थापना आवाहनं च' },
      description: {
        en: 'At Pradosh Kaal, place a water pot near the pyre. Arrange kumkum, akshat, flowers, coconut, sesame, and other offerings on a thali. Light the ghee lamp and incense. Invoke Lord Narasimha and Prahlada.',
        hi: 'प्रदोष काल में चिता के पास जल का लोटा रखें। थाली में कुमकुम, अक्षत, फूल, नारियल, तिल और अन्य सामग्री सजाएँ। घी का दीपक और अगरबत्ती जलाएँ। भगवान नरसिंह और प्रह्लाद का आवाहन करें।',
        sa: 'प्रदोषकाले चितासमीपे जलकुम्भं स्थापयेत्। स्थालिकायां कुङ्कुमम् अक्षतान् पुष्पाणि नारिकेलं तिलान् चान्यां सामग्रीं सज्जयेत्। घृतदीपं धूपं च प्रज्वालयेत्। श्रीनृसिंहं प्रह्लादं चावाहयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Sankalpa & Offerings to Fire', hi: 'संकल्प एवं अग्नि को अर्पण', sa: 'सङ्कल्पः अग्न्यर्पणं च' },
      description: {
        en: 'Take sankalpa by holding water in the right palm. Offer akshat and kumkum to the pyre. Place the whole coconut, sesame seeds, new wheat ears, and roasted gram at the base of the pyre as offerings.',
        hi: 'दाहिने हाथ में जल लेकर संकल्प करें। चिता पर अक्षत और कुमकुम अर्पित करें। साबुत नारियल, तिल, नई गेहूँ की बालियाँ और भुने चने चिता के आधार पर अर्पित करें।',
        sa: 'दक्षिणकरे जलं गृहीत्वा सङ्कल्पं कुर्यात्। चितायाम् अक्षतान् कुङ्कुमं चार्पयेत्। सम्पूर्णनारिकेलं तिलान् नवगोधूमशीर्षाणि भर्जितचणकांश्च चिताधारे अर्पयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Holika Dahan (Lighting the Fire)', hi: 'होलिका दहन (अग्नि प्रज्वलन)', sa: 'होलिकादहनम् (अग्निप्रज्वालनम्)' },
      description: {
        en: 'Light the pyre from the eastern side while chanting "Asato Ma Sad Gamaya" or Narasimha mantras. The fire symbolizes the burning of all evil. Ensure the central post (Prahlada) remains unharmed as the surrounding material burns.',
        hi: 'पूर्व दिशा से "असतो मा सद्गमय" या नरसिंह मन्त्रों का जाप करते हुए चिता प्रज्वलित करें। अग्नि समस्त बुराई के दहन का प्रतीक है। सुनिश्चित करें कि चारों ओर की सामग्री जलते समय मध्य का खम्भा (प्रह्लाद) सुरक्षित रहे।',
        sa: '"असतो मा सद्गमय" अथवा नृसिंहमन्त्राणां जपेन पूर्वदिशातः चितां प्रज्वालयेत्। अग्निः सर्वदुष्टतायाः दहनस्य प्रतीकः। परितः सामग्रीदहनकाले मध्यस्तम्भः (प्रह्लादः) सुरक्षितः तिष्ठेदिति सुनिश्चितं कुर्यात्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Parikrama (Circumambulation)', hi: 'परिक्रमा (प्रदक्षिणा)', sa: 'प्रदक्षिणा' },
      description: {
        en: 'Perform 3, 5, or 7 parikramas (circumambulations) around the burning pyre in a clockwise direction. While walking, sprinkle water from the pot, offer sesame seeds and akshat into the fire, and chant mantras. Pray for removal of all negativity.',
        hi: 'जलती हुई चिता की 3, 5 या 7 परिक्रमाएँ (प्रदक्षिणा) दक्षिणावर्त दिशा में करें। चलते हुए लोटे से जल छिड़कें, अग्नि में तिल और अक्षत अर्पित करें, और मन्त्रों का जाप करें। समस्त नकारात्मकता के निवारण की प्रार्थना करें।',
        sa: 'प्रज्वलितचितायाः ३, ५ अथवा ७ प्रदक्षिणाः दक्षिणावर्तदिशया कुर्यात्। गच्छन् कुम्भात् जलं सिञ्चेत्, अग्नौ तिलान् अक्षतांश्चार्पयेत्, मन्त्रान् जपेत्। सर्वनकारात्मकतानिवारणाय प्रार्थयेत।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 6,
      title: { en: 'Conclusion & Prarthana', hi: 'समापन एवं प्रार्थना', sa: 'समापनं प्रार्थना च' },
      description: {
        en: 'After parikrama, offer final prayers to Lord Narasimha for protection. Apply the sacred ash (bhasma) from the Holika fire to the forehead. Share roasted offerings and sweets with family and community. The next morning is the festival of colours (Dhulandi/Rangwali Holi).',
        hi: 'परिक्रमा के बाद भगवान नरसिंह से रक्षा की अन्तिम प्रार्थना करें। होलिका अग्नि की पवित्र भस्म (राख) माथे पर लगाएँ। भुनी हुई सामग्री और मिठाई परिवार एवं समुदाय में बाँटें। अगली सुबह रंगों का त्योहार (धुलण्डी/रंगवाली होली) है।',
        sa: 'प्रदक्षिणानन्तरं श्रीनृसिंहं रक्षार्थम् अन्तिमप्रार्थनां कुर्यात्। होलिकाग्नेः पवित्रभस्म (भस्मनम्) ललाटे लिम्पेत्। भर्जितसामग्रीं मिष्टान्नानि च कुटुम्बसमुदायेन सह विभजेत्। अग्रिमप्रभाते वर्णोत्सवः (धुलण्डी) भवति।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'holika-narasimha',
      name: { en: 'Narasimha Mantra', hi: 'नरसिंह मन्त्र', sa: 'नृसिंहमन्त्रः' },
      devanagari: 'ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।\nनृसिंहं भीषणं भद्रं मृत्युमृत्युं नमाम्यहम्॥',
      iast: 'oṃ ugraṃ vīraṃ mahāviṣṇuṃ jvalantaṃ sarvatomukham |\nnṛsiṃhaṃ bhīṣaṇaṃ bhadraṃ mṛtyumṛtyuṃ namāmyaham ||',
      meaning: {
        en: 'I bow to Narasimha, the fierce, heroic, great Vishnu, blazing in all directions, terrifying yet auspicious, the death of death itself.',
        hi: 'मैं नरसिंह को नमन करता हूँ जो उग्र, वीर, महाविष्णु, सर्वत्र प्रज्वलित, भयंकर किन्तु मंगलकारी, मृत्यु की भी मृत्यु हैं।',
        sa: 'उग्रं वीरं महाविष्णुं सर्वतोमुखं ज्वलन्तं भीषणं भद्रं मृत्योः अपि मृत्युं नृसिंहं नमामि।',
      },
      japaCount: 3,
      usage: { en: 'Chant while lighting the Holika fire and during parikrama', hi: 'होलिका अग्नि प्रज्वलन और परिक्रमा के समय जपें', sa: 'होलिकाग्निप्रज्वालनकाले प्रदक्षिणाकाले च जपेत्' },
    },
    {
      id: 'holika-asato-ma',
      name: { en: 'Asato Ma Mantra (Pavamana)', hi: 'असतो मा मन्त्र (पवमान)', sa: 'असतो मा मन्त्रः (पवमानम्)' },
      devanagari: 'ॐ असतो मा सद्गमय।\nतमसो मा ज्योतिर्गमय।\nमृत्योर्मा अमृतं गमय।\nॐ शान्तिः शान्तिः शान्तिः॥',
      iast: 'oṃ asato mā sadgamaya |\ntamaso mā jyotirgamaya |\nmṛtyormā amṛtaṃ gamaya |\noṃ śāntiḥ śāntiḥ śāntiḥ ||',
      meaning: {
        en: 'Lead me from untruth to truth, from darkness to light, from death to immortality. Om peace, peace, peace.',
        hi: 'मुझे असत्य से सत्य की ओर, अन्धकार से प्रकाश की ओर, मृत्यु से अमरत्व की ओर ले चलो। ॐ शान्ति शान्ति शान्ति।',
        sa: 'असतः सत्यं प्रति, तमसः ज्योतिः प्रति, मृत्योः अमृतत्वं प्रति मां नय। ॐ शान्तिः शान्तिः शान्तिः।',
      },
      japaCount: 3,
      usage: { en: 'Chant during the lighting and while performing parikrama', hi: 'अग्नि प्रज्वलन और परिक्रमा करते समय जपें', sa: 'अग्निप्रज्वालनकाले प्रदक्षिणाकाले च जपेत्' },
    },
    {
      id: 'holika-prahlada-stuti',
      name: { en: 'Prahlada Prayer', hi: 'प्रह्लाद प्रार्थना', sa: 'प्रह्लादप्रार्थना' },
      devanagari: 'ॐ नमो भगवते नरसिंहाय\nनमस्तेजस्तेजसे आविराविर्भव\nवज्रनख वज्रदंष्ट्र कर्माशयान् रन्धय रन्धय\nतमो ग्रस ग्रस ॐ स्वाहा॥',
      iast: 'oṃ namo bhagavate narasiṃhāya\nnamastejastejase āvirāvirbhava\nvajranakha vajradaṃṣṭra karmāśayān randhaya randhaya\ntamo grasa grasa oṃ svāhā ||',
      meaning: {
        en: 'Obeisance to Lord Narasimha, salutation to the radiance of radiance. Appear, appear! O one with diamond claws and teeth, destroy karmic residues, devour darkness. Om Svaha.',
        hi: 'भगवान नरसिंह को नमस्कार, तेज के तेज को नमन। प्रकट हों, प्रकट हों! हे वज्र नख और वज्र दन्त वाले, कर्मों के संस्कार नष्ट करें, अन्धकार को ग्रसित करें। ॐ स्वाहा।',
        sa: 'भगवते नरसिंहाय नमः, तेजसां तेजसे नमः। आविर्भव आविर्भव। हे वज्रनख वज्रदंष्ट्र, कर्माशयान् रन्धय, तमो ग्रस। ॐ स्वाहा।',
      },
      japaCount: 1,
      usage: { en: 'Recite during the sankalpa and fire lighting', hi: 'संकल्प और अग्नि प्रज्वलन के समय पाठ करें', sa: 'सङ्कल्पकाले अग्निप्रज्वालनकाले च पठेत्' },
    },
  ],

  naivedya: {
    en: 'Offer roasted wheat ears (gehun ki bali), coconut pieces, roasted gram, popcorn (laja), and gujiya or other seasonal sweets to the Holika fire. After the fire subsides, distribute roasted offerings as prasad.',
    hi: 'होलिका अग्नि में भुनी हुई गेहूँ की बालियाँ, नारियल के टुकड़े, भुने चने, पॉपकॉर्न (लाजा) और गुजिया या अन्य मौसमी मिठाई अर्पित करें। अग्नि शान्त होने के बाद भुनी हुई सामग्री प्रसाद के रूप में बाँटें।',
    sa: 'होलिकाग्नौ भर्जितगोधूमशीर्षाणि नारिकेलखण्डानि भर्जितचणकान् लाजान् गुजियां चान्यमिष्टान्नानि अर्पयेत्। अग्निशान्तौ भर्जितसामग्रीं प्रसादरूपेण विभजेत्।',
  },

  precautions: [
    {
      en: 'Never perform Holika Dahan during Bhadra Kaal — this is considered extremely inauspicious. Wait for Bhadra to end before lighting the fire.',
      hi: 'भद्रा काल में कभी भी होलिका दहन न करें — यह अत्यन्त अशुभ माना जाता है। अग्नि प्रज्वलित करने से पहले भद्रा समाप्ति की प्रतीक्षा करें।',
      sa: 'भद्राकाले होलिकादहनं कदापि न कुर्यात् — एतत् अत्यन्तम् अशुभं मन्यते। अग्निप्रज्वालनात् पूर्वं भद्राकालसमाप्तिं प्रतीक्षेत।',
    },
    {
      en: 'Maintain a safe distance from the bonfire. Keep children under adult supervision. Do not use synthetic or chemical accelerants to light the fire.',
      hi: 'अग्नि से सुरक्षित दूरी बनाए रखें। बच्चों को वयस्कों की निगरानी में रखें। आग जलाने के लिए सिंथेटिक या रासायनिक ज्वलनशील पदार्थों का उपयोग न करें।',
      sa: 'अग्नेः सुरक्षितदूरीं पालयेत्। बालान् प्रौढानां निरीक्षणे स्थापयेत्। कृत्रिमरासायनिकज्वलनपदार्थान् अग्निप्रज्वालनार्थं न उपयोजयेत्।',
    },
    {
      en: 'Use only natural and eco-friendly materials. Avoid burning plastic, tyres, or toxic substances. The traditional pyre uses only cow dung, wood, and natural materials.',
      hi: 'केवल प्राकृतिक और पर्यावरण अनुकूल सामग्री का उपयोग करें। प्लास्टिक, टायर या विषैले पदार्थ न जलाएँ। पारम्परिक चिता में केवल गोबर, लकड़ी और प्राकृतिक सामग्री का उपयोग होता है।',
      sa: 'प्राकृतिकपर्यावरणानुकूलसामग्रीम् एव उपयोजयेत्। प्लास्टिकचक्रबन्धनविषपदार्थान् न दहेत्। पारम्परिकचितायां गोमयं काष्ठं प्राकृतिकसामग्री चैव उपयुज्यते।',
    },
    {
      en: 'Ensure the bonfire is fully extinguished before leaving. Collect the sacred ash (bhasma) the next morning for auspicious use.',
      hi: 'जाने से पहले सुनिश्चित करें कि अग्नि पूर्णतः बुझ गई है। अगली सुबह शुभ उपयोग के लिए पवित्र भस्म (राख) एकत्र करें।',
      sa: 'गमनात् पूर्वम् अग्निः सम्पूर्णतया निर्वापिता इति सुनिश्चितं कुर्यात्। अग्रिमप्रभाते शुभोपयोगार्थं पवित्रभस्म सङ्कलयेत्।',
    },
  ],

  phala: {
    en: 'Holika Dahan destroys all sins, evil influences, and negativity accumulated over the year. The sacred fire purifies the devotee and the surroundings. It bestows protection from enemies, freedom from fear, and the blessings of Lord Narasimha. The ritual celebrates the eternal triumph of devotion over demonic forces.',
    hi: 'होलिका दहन वर्ष भर में संचित सभी पापों, बुरे प्रभावों और नकारात्मकता का विनाश करता है। पवित्र अग्नि भक्त और वातावरण को शुद्ध करती है। यह शत्रुओं से रक्षा, भय से मुक्ति और भगवान नरसिंह का आशीर्वाद प्रदान करता है। यह अनुष्ठान आसुरी शक्तियों पर भक्ति की शाश्वत विजय का उत्सव है।',
    sa: 'होलिकादहनेन वर्षभरसञ्चितसर्वपापदुष्टप्रभावनकारात्मकतानां विनाशो भवति। पवित्राग्निः भक्तं परिसरं च शोधयति। शत्रुभ्यो रक्षां भयान्मुक्तिं श्रीनृसिंहस्य आशीर्वादं च ददाति। एतत् कर्म आसुरीशक्तीनाम् उपरि भक्तेः शाश्वतविजयस्य उत्सवः।',
  },
};

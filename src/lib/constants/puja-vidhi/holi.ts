import type { PujaVidhi } from './types';

export const HOLI_PUJA: PujaVidhi = {
  festivalSlug: 'holi',
  category: 'festival',
  deity: { en: 'Krishna / Vishnu (Narasimha)', hi: 'कृष्ण / विष्णु (नरसिंह)', sa: 'कृष्णः / विष्णुः (नृसिंहः)' },

  samagri: [
    { name: { en: 'Cow dung cakes', hi: 'गोबर के उपले', sa: 'गोमयोपलाः' }, quantity: '10-15', category: 'puja_items', essential: true },
    { name: { en: 'Wood logs', hi: 'लकड़ी के लट्ठे', sa: 'काष्ठखण्डाः' }, category: 'puja_items', essential: true },
    { name: { en: 'Whole coconut', hi: 'साबुत नारियल', sa: 'सम्पूर्णनारिकेलम्' }, quantity: '1', category: 'food', essential: true },
    { name: { en: 'New harvest wheat', hi: 'नई फसल का गेहूँ', sa: 'नवगोधूमाः' }, category: 'food', essential: true },
    { name: { en: 'New harvest barley', hi: 'नई फसल का जौ', sa: 'नवयवाः' }, category: 'food', essential: false },
    { name: { en: 'Roasted gram (chana)', hi: 'भुने चने', sa: 'भर्जितचणकाः' }, category: 'food', essential: false },
    { name: { en: 'Gulal (natural colors)', hi: 'गुलाल (प्राकृतिक रंग)', sa: 'गुलालम् (प्राकृतिकवर्णाः)' }, category: 'other', essential: false },
    { name: { en: 'Water pot (for parikrama)', hi: 'जल का लोटा (परिक्रमा हेतु)', sa: 'जलकुम्भः (प्रदक्षिणार्थम्)' }, category: 'vessels', essential: true },
    { name: { en: 'Gujiya / sweets', hi: 'गुजिया / मिठाई', sa: 'मिष्टान्नानि' }, category: 'food', essential: false },
    { name: { en: 'Garland of flowers', hi: 'फूलों की माला', sa: 'पुष्पमाला' }, category: 'flowers', essential: false },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, quantity: '1', category: 'puja_items', essential: true },
    { name: { en: 'Raw cotton thread (sutli)', hi: 'कच्चा सूती धागा (सूतली)', sa: 'कार्पाससूत्रम्' }, category: 'puja_items', essential: true },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Pradosh Kaal (evening period after sunset) on Phalguna Purnima is the auspicious time for Holika Dahan',
    hi: 'फाल्गुन पूर्णिमा पर प्रदोष काल (सूर्यास्त के बाद का सन्ध्याकाल) होलिका दहन का शुभ समय है',
    sa: 'फाल्गुनपूर्णिमायां प्रदोषकालः (सूर्यास्तोत्तरसन्ध्याकालः) होलिकादहनस्य शुभकालः',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this auspicious Phalguna Purnima, I undertake this Holika Dahan puja for the destruction of all evil, protection from negativity, and celebration of the triumph of devotion (Prahlada) over demonic forces (Holika), by the grace of Lord Narasimha.',
    hi: 'इस शुभ फाल्गुन पूर्णिमा पर, समस्त अशुभ के विनाश, नकारात्मकता से रक्षा, और भक्ति (प्रह्लाद) की आसुरी शक्तियों (होलिका) पर विजय के उत्सव हेतु, भगवान नरसिंह की कृपा से, मैं यह होलिका दहन पूजा करता/करती हूँ।',
    sa: 'अस्मिन् शुभे फाल्गुनपूर्णिमायां सर्वाशुभविनाशनार्थं दुष्टशक्तिनिवारणार्थं भक्तिविजयोत्सवार्थं (प्रह्लादस्य होलिकोपरि विजयः) श्रीनृसिंहकृपया होलिकादहनपूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Holika Pyre Preparation', hi: 'होलिका चिता निर्माण', sa: 'होलिकाचितासज्जा' },
      description: {
        en: 'Collect cow dung cakes, wood logs, and dry twigs. Build a pyre in an open area, placing a wooden post in the center representing Prahlada. Wind raw cotton thread around the pyre.',
        hi: 'गोबर के उपले, लकड़ी के लट्ठे और सूखी टहनियाँ इकट्ठी करें। खुले मैदान में चिता बनाएँ, बीच में एक लकड़ी का खम्भा रखें जो प्रह्लाद का प्रतीक है। चिता के चारों ओर कच्चा सूती धागा लपेटें।',
        sa: 'गोमयोपलान् काष्ठखण्डान् शुष्कशाखाश्च सङ्कलयेत्। विवृतक्षेत्रे चितां रचयेत्, मध्ये काष्ठस्तम्भं प्रह्लादप्रतीकरूपेण स्थापयेत्। कार्पाससूत्रेण चितां वेष्टयेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Puja Sthapana', hi: 'पूजा स्थापना', sa: 'पूजास्थापना' },
      description: {
        en: 'Place a water pot near the pyre. Arrange kumkum, akshat, flowers, coconut, and other samagri on a thali (plate).',
        hi: 'चिता के पास जल का लोटा रखें। थाली में कुमकुम, अक्षत, फूल, नारियल और अन्य सामग्री सजाएँ।',
        sa: 'चितासमीपे जलकुम्भं स्थापयेत्। स्थालिकायां कुङ्कुमं अक्षतान् पुष्पाणि नारिकेलं चान्यां सामग्रीं सज्जयेत्।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 3,
      title: { en: 'Sankalpa', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Hold water and akshat in the right hand, state the date, place, and purpose of Holika Dahan, then release the water.',
        hi: 'दाहिने हाथ में जल और अक्षत लेकर, तिथि, स्थान और होलिका दहन का उद्देश्य बोलकर जल छोड़ें।',
        sa: 'दक्षिणहस्ते जलाक्षतान् गृहीत्वा तिथिस्थानहोलिकादहनप्रयोजनं वदेत् ततो जलं विसृजेत्।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Parikrama (Circumambulation)', hi: 'परिक्रमा', sa: 'प्रदक्षिणा' },
      description: {
        en: 'Circumambulate the Holika pyre 3, 5, or 7 times in a clockwise direction, pouring water from the pot in a continuous stream. Apply kumkum and offer akshat to the pyre.',
        hi: 'होलिका चिता की 3, 5 या 7 बार दक्षिणावर्त (घड़ी की दिशा में) परिक्रमा करें, लोटे से निरन्तर जल की धारा डालते हुए। चिता पर कुमकुम लगाएँ और अक्षत चढ़ाएँ।',
        sa: 'होलिकाचितायाः त्रिवारं पञ्चवारं सप्तवारं वा प्रदक्षिणक्रमेण प्रदक्षिणां कुर्यात्, कुम्भात् अविच्छिन्नजलधारां सिञ्चन्। चितायां कुङ्कुमं लेपयेत् अक्षतांश्च समर्पयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Offer Garland & Flowers', hi: 'माला व पुष्प अर्पण', sa: 'मालापुष्पसमर्पणम्' },
      description: {
        en: 'Offer the flower garland to the pyre with prayers to Lord Narasimha for protection, remembering the story of Prahlada\'s unwavering devotion.',
        hi: 'भगवान नरसिंह से रक्षा की प्रार्थना करते हुए चिता पर फूलों की माला चढ़ाएँ, प्रह्लाद की अटूट भक्ति की कथा का स्मरण करें।',
        sa: 'प्रह्लादस्य अचलभक्तिकथां स्मरन् श्रीनृसिंहं रक्षार्थं प्रार्थयन् चितायां पुष्पमालां समर्पयेत्।',
      },
      mantraRef: 'narasimha',
      duration: '3 min',
      essential: false,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Holika Dahan (Lighting the Fire)', hi: 'होलिका दहन (अग्नि प्रज्वलन)', sa: 'होलिकादहनम् (अग्निप्रज्वालनम्)' },
      description: {
        en: 'Light the pyre at the auspicious Pradosh muhurta. As the fire rises, chant the Narasimha mantra and Holika Dahan mantra. The fire symbolizes the burning of evil and the triumph of good.',
        hi: 'शुभ प्रदोष मुहूर्त में चिता प्रज्वलित करें। जैसे-जैसे अग्नि ऊपर उठे, नरसिंह मन्त्र और होलिका दहन मन्त्र का जप करें। अग्नि अशुभ के दहन और सत्य की विजय का प्रतीक है।',
        sa: 'शुभप्रदोषमुहूर्ते चितां प्रज्वालयेत्। अग्नेः उत्थाने नृसिंहमन्त्रं होलिकादहनमन्त्रं च जपेत्। अग्निः अशुभदहनस्य सत्यविजयस्य च प्रतीकः।',
      },
      mantraRef: 'holika-dahan',
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Offer Grains & Coconut', hi: 'अन्न व नारियल अर्पण', sa: 'धान्यनारिकेलसमर्पणम्' },
      description: {
        en: 'Offer new harvest grains — wheat, barley, roasted gram — and the whole coconut into the sacred fire. These represent the season\'s first harvest offered to the divine.',
        hi: 'पवित्र अग्नि में नई फसल के अन्न — गेहूँ, जौ, भुने चने — और साबुत नारियल अर्पित करें। ये ऋतु की पहली उपज का देवार्पण हैं।',
        sa: 'पवित्राग्नौ नवधान्यानि — गोधूमान् यवान् भर्जितचणकान् — सम्पूर्णनारिकेलं च समर्पयेत्। एतानि ऋतोः प्रथमोपजस्य देवार्पणानि।',
      },
      duration: '3 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prayer for Protection', hi: 'रक्षा प्रार्थना', sa: 'रक्षाप्रार्थना' },
      description: {
        en: 'With folded hands, pray to Lord Narasimha and Prahlada: "As Prahlada was protected by his devotion, may all devotees be protected from evil." Recite the Prahlada prayer.',
        hi: 'हाथ जोड़कर भगवान नरसिंह और प्रह्लाद से प्रार्थना करें: "जैसे प्रह्लाद अपनी भक्ति से सुरक्षित रहे, वैसे ही सभी भक्तों की अशुभ से रक्षा हो।" प्रह्लाद प्रार्थना पढ़ें।',
        sa: 'कृताञ्जलिः श्रीनृसिंहं प्रह्लादं च प्रार्थयेत्: "यथा प्रह्लादः स्वभक्त्या रक्षितः तथा सर्वे भक्ताः दुष्टेभ्यो रक्षिताः भवन्तु।" प्रह्लादप्रार्थनां पठेत्।',
      },
      mantraRef: 'prahlada-prayer',
      duration: '3 min',
      essential: true,
      stepType: 'mantra',
    },
    {
      step: 9,
      title: { en: 'Roast Offerings in Fire', hi: 'अग्नि में भूनना', sa: 'अग्नौ भर्जनम्' },
      description: {
        en: 'Once the fire subsides, roast new harvest grains (wheat ears, barley) in the embers. These roasted grains are then shared as prasad among family and neighbors.',
        hi: 'जब अग्नि शान्त हो जाए, अंगारों में नई फसल के दाने (गेहूँ की बालियाँ, जौ) भूनें। ये भुने दाने प्रसाद के रूप में परिवार और पड़ोसियों में बाँटें।',
        sa: 'अग्नेः शमने सति अङ्गारेषु नवधान्यानि (गोधूमशिलीमुखान् यवान्) भर्जयेत्। एतानि भर्जितधान्यानि प्रसादरूपेण कुटुम्बिनां प्रतिवेशिनां च मध्ये वितरेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
    {
      step: 10,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform aarti of the Holika fire with a ghee lamp. Sing "Aarti Kunj Bihari Ki" — the aarti of Lord Krishna, celebrating the divine play of Holi.',
        hi: 'घी के दीपक से होलिका अग्नि की आरती करें। "आरती कुंज बिहारी की" गाएँ — भगवान कृष्ण की आरती, होली की दिव्य लीला का उत्सव।',
        sa: 'घृतदीपेन होलिकाग्नेः आरात्रिकं कुर्यात्। "आरती कुञ्जबिहारिणः" गायेत् — श्रीकृष्णस्य आरात्रिकम्, होलिकायाः दिव्यलीलोत्सवः।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 11,
      title: { en: 'Distribution of Prasad', hi: 'प्रसाद वितरण', sa: 'प्रसादवितरणम्' },
      description: {
        en: 'Distribute gujiya, sweets, and roasted grains as prasad among all present. Apply the sacred ash (vibhuti) from the Holika fire on the forehead for protection.',
        hi: 'उपस्थित सभी लोगों में गुजिया, मिठाई और भुने दानों का प्रसाद बाँटें। रक्षा हेतु होलिका अग्नि की पवित्र भस्म (विभूति) माथे पर लगाएँ।',
        sa: 'सर्वेभ्यः उपस्थितेभ्यः गुजियामिष्टान्नानि भर्जितधान्यानि च प्रसादरूपेण वितरेत्। रक्षार्थं होलिकाग्नेः पवित्रभस्म (विभूतिम्) ललाटे लेपयेत्।',
      },
      duration: '5 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 12,
      title: { en: 'Rang Panchami — Playing Colors', hi: 'रंग पंचमी — रंगों का खेल', sa: 'रङ्गपञ्चमी — वर्णक्रीडा' },
      description: {
        en: 'Next morning (Dhulandi / Rang Panchami): Apply gulal and natural colors to each other, dance, sing Holi songs celebrating Krishna\'s leela with the Gopis in Vrindavan. Use water guns (pichkari) and colored water.',
        hi: 'अगली सुबह (धुलण्डी / रंग पंचमी): एक-दूसरे को गुलाल और प्राकृतिक रंग लगाएँ, नाचें, वृन्दावन में कृष्ण की गोपियों के साथ लीला का स्मरण करते हुए होली गीत गाएँ। पिचकारी और रंगीन पानी का प्रयोग करें।',
        sa: 'अग्रिमप्रातः (धूलिवन्दनम् / रङ्गपञ्चमी): परस्परं गुलालं प्राकृतिकवर्णांश्च लेपयेत्, नृत्येत्, वृन्दावने श्रीकृष्णस्य गोपीभिः सह लीलां स्मरन् होलिकागीतानि गायेत्। जलयन्त्रैः (पिचकारीभिः) रङ्गितजलेन च क्रीडेत्।',
      },
      duration: 'All day',
      essential: false,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'narasimha',
      name: { en: 'Narasimha Mantra', hi: 'नरसिंह मन्त्र', sa: 'नृसिंहमन्त्रः' },
      devanagari: 'ॐ उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखम्।\nनृसिंहं भीषणं भद्रं मृत्योर्मृत्युं नमाम्यहम्॥',
      iast: 'oṃ ugraṃ vīraṃ mahāviṣṇuṃ jvalantaṃ sarvatomukham |\nnṛsiṃhaṃ bhīṣaṇaṃ bhadraṃ mṛtyormṛtyuṃ namāmyaham ||',
      meaning: {
        en: 'I bow to Lord Narasimha, who is fierce, heroic, the great Vishnu, blazing in all directions, terrifying yet auspicious — the death of death itself.',
        hi: 'मैं भगवान नरसिंह को प्रणाम करता हूँ, जो उग्र, वीर, महाविष्णु, सर्वत्र ज्वलन्त, भयंकर फिर भी मंगलकारी — मृत्यु की भी मृत्यु हैं।',
        sa: 'उग्रं वीरं महाविष्णुं ज्वलन्तं सर्वतोमुखं नृसिंहं भीषणं भद्रं मृत्योर्मृत्युं नमामि।',
      },
      japaCount: 11,
      usage: {
        en: 'Chant 11 times while circumambulating the Holika pyre and during Holika Dahan for divine protection',
        hi: 'होलिका चिता की परिक्रमा करते समय और होलिका दहन के दौरान दिव्य रक्षा के लिए 11 बार जपें',
        sa: 'होलिकाचिताप्रदक्षिणायां होलिकादहनकाले च दिव्यरक्षार्थम् एकादशवारं जपेत्',
      },
    },
    {
      id: 'holika-dahan',
      name: { en: 'Holika Dahan Mantra', hi: 'होलिका दहन मन्त्र', sa: 'होलिकादहनमन्त्रः' },
      devanagari: 'असृक्पाभयसन्त्रस्तैः कृता त्वं होलि बालिशैः।\nअतस्त्वां पूजयिष्यामि भूते भूतिप्रदा भव॥',
      iast: 'asṛkpābhayasantrastaiḥ kṛtā tvaṃ holi bāliśaiḥ |\natastvaṃ pūjayiṣyāmi bhūte bhūtipradā bhava ||',
      meaning: {
        en: 'O Holika, you were created by the frightened children (devotees) seeking protection from the blood-drinking demons. Therefore I worship you — O spirit, grant us prosperity.',
        hi: 'हे होलिका, रक्तपान करने वाले राक्षसों से भयभीत बच्चों (भक्तों) ने तुम्हें रचा। इसलिए मैं तुम्हारी पूजा करता हूँ — हे भूत, हमें समृद्धि प्रदान करो।',
        sa: 'हे होलि, असृक्पाभयसन्त्रस्तैः बालिशैः त्वं कृता। अतः त्वां पूजयिष्यामि — हे भूते, भूतिप्रदा भव।',
      },
      usage: {
        en: 'Recite while lighting the Holika pyre during the Dahan ceremony',
        hi: 'दहन संस्कार के समय होलिका चिता जलाते हुए पढ़ें',
        sa: 'दहनसंस्कारे होलिकाचितां प्रज्वालयन् पठेत्',
      },
    },
    {
      id: 'prahlada-prayer',
      name: { en: 'Prahlada Prayer', hi: 'प्रह्लाद प्रार्थना', sa: 'प्रह्लादप्रार्थना' },
      devanagari: 'ॐ नमो भगवते महासुदर्शनाय वैष्णवज्वराय।\nमहाज्वालाय सर्वरक्षोघ्नाय सर्वभूतरक्षोघ्नाय।\nसर्वज्वरघ्नाय दह दह पच पच नाशय नाशय हुं फट् स्वाहा॥',
      iast: 'oṃ namo bhagavate mahāsudarśanāya vaiṣṇavajvarāya |\nmahājvālāya sarvarakṣoghnāya sarvabhūtarakṣoghnāya |\nsarvajvaraghnāya daha daha paca paca nāśaya nāśaya huṃ phaṭ svāhā ||',
      meaning: {
        en: 'Salutations to the great Sudarshana (Lord Vishnu\'s disc), the Vaishnava fire, the great flame, destroyer of all demons, destroyer of all evil spirits, destroyer of all fevers — burn, burn, cook, cook, destroy, destroy — hum phat svaha!',
        hi: 'महासुदर्शन (भगवान विष्णु के चक्र) को नमन, वैष्णव ज्वर, महाज्वाला, सभी राक्षसों के संहारक, सभी भूत-प्रेतों के नाशक, सभी ज्वरों के नाशक — दहन करो, पचा दो, नष्ट करो — हुं फट् स्वाहा!',
        sa: 'महासुदर्शनाय वैष्णवज्वराय महाज्वालाय सर्वरक्षोघ्नाय सर्वभूतरक्षोघ्नाय सर्वज्वरघ्नाय नमः — दह दह पच पच नाशय नाशय हुं फट् स्वाहा।',
      },
      usage: {
        en: 'Recite during the prayer for protection after Holika Dahan, invoking divine shielding from all negativity',
        hi: 'होलिका दहन के बाद रक्षा प्रार्थना के समय पढ़ें, सभी नकारात्मकता से दिव्य सुरक्षा का आवाहन करते हुए',
        sa: 'होलिकादहनोत्तरं रक्षाप्रार्थनाकाले सर्वदुष्टशक्तिनिवारणार्थं दिव्यकवचावाहनपूर्वकं पठेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Narasimha Kavacham', hi: 'नरसिंह कवच', sa: 'नृसिंहकवचम्' },
      verseCount: 32,
      duration: '15 min',
      note: {
        en: 'Powerful protective hymn from the Trailokya Vijaya chapter. Provides divine armor against all evil.',
        hi: 'त्रैलोक्य विजय अध्याय से शक्तिशाली रक्षा स्तोत्र। सभी अशुभ के विरुद्ध दिव्य कवच प्रदान करता है।',
        sa: 'त्रैलोक्यविजयाध्यायात् प्रभावशालि रक्षास्तोत्रम्। सर्वाशुभविरुद्धं दिव्यकवचं प्रददाति।',
      },
    },
  ],

  aarti: {
    name: { en: 'Aarti Kunj Bihari Ki', hi: 'आरती कुंज बिहारी की', sa: 'आरती कुञ्जबिहारिणः' },
    devanagari:
      'आरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nगले में बैजन्ती माला, बजावे मुरली मधुर बाला।\nश्रवण में कुण्डल झलकाला, नन्द के आनन्द नन्दलाला।\nगगन सम अंग कान्ति काली, राधिका चमक रही आली।\nलतन में ठाढ़े बनमाली॥\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nकानन में कुण्डल, मोर मुकुट पर मंद हँसे।\nतन छवि श्यामल, अंग विश्व में चन्दन लेपे।\nकस्तूरी तिलक ललार पर, सोहत आनन्द केसरी के।\nविजयी ब्रज में आनन्दकन्द के॥\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nछप्पनभोग धरत नित जूठन तो ग्वालन सँग खात।\nअमर हों वे चरन छुवत हरि के, हस्तकमल से ग्रास उठात।\nउदर भरत हरि आप निछावर, गोपियन हित साँझ नचात।\nचरनामृत पीवत सब ही, मज्जन करत ब्रज के घात॥\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\nजहाँ ते प्रकट भई गंगा, सकल मल हरणी अंगा।\nस्मरण ते होत मोह भंगा, बसी मेरे हृदय में रंगा।\nश्री गिरिधर कृष्ण मुरारी की।\nआरती कुंज बिहारी की श्री गिरिधर कृष्ण मुरारी की॥\n\n॥ इति श्री कृष्ण आरती सम्पूर्णम् ॥',
    iast:
      'āratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\ngale meṃ baijantī mālā, bajāve muralī madhura bālā |\nśravaṇa meṃ kuṇḍala jhalakālā, nanda ke ānanda nandalālā |\ngagana sama aṃga kānti kālī, rādhikā camaka rahī ālī |\nlatana meṃ ṭhāḍhe banamālī ||\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\nkānana meṃ kuṇḍala, mora mukuṭa para manda haṃse |\ntana chavi śyāmala, aṃga viśva meṃ candana lepe |\nkastūrī tilaka lalāra para, sohata ānanda kesarī ke |\nvijayī braja meṃ ānandakanda ke ||\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\nchappanabhoga dharata nita jūṭhana to gvālana saṃga khāta |\namara hoṃ ve carana chuvata hari ke, hastakamala se grāsa uṭhāta |\nudara bharata hari āpa nichāvara, gopīyana hita sāṃjha nacāta |\ncaraṇāmṛta pīvata saba hī, majjana karata braja ke ghāta ||\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\njahāṃ te prakaṭa bhaī gaṃgā, sakala mala haraṇī aṃgā |\nsmaraṇa te hota moha bhaṃgā, basī mere hṛdaya meṃ raṃgā |\nśrī giridhara kṛṣṇa murārī kī |\nāratī kuñja bihārī kī śrī giridhara kṛṣṇa murārī kī ||\n\n|| iti śrī kṛṣṇa āratī sampūrṇam ||',
  },

  naivedya: {
    en: 'Gujiya (sweet dumplings), coconut barfi, roasted grains (wheat ears, barley, gram), milk sweets, and seasonal fruits',
    hi: 'गुजिया (मीठे पकौड़े), नारियल बर्फी, भुने दाने (गेहूँ की बालियाँ, जौ, चना), दूध की मिठाइयाँ, और मौसमी फल',
    sa: 'गुजिया (मधुरपूरिकाः), नारिकेलबर्फी, भर्जितधान्यानि (गोधूमशिलीमुखाः, यवाः, चणकाः), क्षीरमिष्टान्नानि, ऋतुफलानि च',
  },

  precautions: [
    {
      en: 'Use only natural and organic colors (gulal) — avoid synthetic chemical colors that harm skin and eyes',
      hi: 'केवल प्राकृतिक और जैविक रंग (गुलाल) का प्रयोग करें — त्वचा और आँखों को हानि पहुँचाने वाले रासायनिक रंगों से बचें',
      sa: 'प्राकृतिकजैविकवर्णान् (गुलालम्) एव उपयोजयेत् — त्वचानेत्रहानिकारकान् रासायनिकवर्णान् वर्जयेत्',
    },
    {
      en: 'Protect eyes and skin — apply coconut oil or mustard oil on exposed skin before playing colors, and wear old clothes',
      hi: 'आँखों और त्वचा की रक्षा करें — रंग खेलने से पहले खुली त्वचा पर नारियल या सरसों का तेल लगाएँ, और पुराने कपड़े पहनें',
      sa: 'नेत्रत्वचयोः रक्षां कुर्यात् — वर्णक्रीडायाः पूर्वम् अनावृतत्वचायां नारिकेलतैलं सर्षपतैलं वा लेपयेत्, पुरातनवस्त्राणि च धारयेत्',
    },
    {
      en: 'Do NOT burn plastic, toxic materials, or tyres in the Holika fire — use only natural combustible materials (wood, cow dung cakes, dry leaves)',
      hi: 'होलिका अग्नि में प्लास्टिक, विषैले पदार्थ या टायर न जलाएँ — केवल प्राकृतिक ज्वलनशील सामग्री (लकड़ी, गोबर के उपले, सूखे पत्ते) का प्रयोग करें',
      sa: 'होलिकाग्नौ प्लास्टिकं विषद्रव्याणि चक्रवस्त्राणि वा न दहेत् — प्राकृतिकदाह्यसामग्रीम् (काष्ठं गोमयोपलान् शुष्कपत्राणि) एव उपयोजयेत्',
    },
    {
      en: 'Be mindful of fire safety — keep water and sand nearby, maintain safe distance from the pyre, keep children supervised',
      hi: 'अग्नि सुरक्षा का ध्यान रखें — पास में पानी और रेत रखें, चिता से सुरक्षित दूरी बनाएँ, बच्चों पर निगरानी रखें',
      sa: 'अग्निसुरक्षां प्रति सावधानाः भवन्तु — समीपे जलं सिकतां च स्थापयेत्, चितायाः सुरक्षितदूरं रक्षेत्, बालकान् अधीक्षयेत्',
    },
    {
      en: 'Do not force colors on unwilling persons or animals — Holi should be played with mutual consent and joy',
      hi: 'अनिच्छुक व्यक्तियों या पशुओं पर जबरदस्ती रंग न डालें — होली परस्पर सहमति और आनन्द से खेलनी चाहिए',
      sa: 'अनिच्छुकेषु जनेषु पशुषु वा बलेन वर्णान् न क्षिपेत् — होलिका परस्परसम्मत्या आनन्देन च क्रीडनीया',
    },
  ],

  phala: {
    en: 'Destruction of all evil and negativity (as Holika was burned), protection from demonic forces, purification of the environment, celebration of the triumph of devotion over tyranny, and ushering in the spring season with joy and brotherhood',
    hi: 'सभी अशुभ और नकारात्मकता का विनाश (जैसे होलिका जलाई गई), आसुरी शक्तियों से रक्षा, वातावरण की शुद्धि, अत्याचार पर भक्ति की विजय का उत्सव, और आनन्द व भाईचारे से वसन्त ऋतु का स्वागत',
    sa: 'सर्वाशुभनकारात्मकतानाशनम् (यथा होलिका दग्धा), दुष्टशक्तिभ्यो रक्षणम्, पर्यावरणशुद्धिः, अत्याचारोपरि भक्तिविजयोत्सवः, आनन्दबन्धुत्वेन वसन्तर्तुस्वागतं च',
  },
};

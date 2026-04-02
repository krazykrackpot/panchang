import type { PujaVidhi } from './types';

export const AKSHAYA_TRITIYA_PUJA: PujaVidhi = {
  festivalSlug: 'akshaya-tritiya',
  category: 'vrat',
  deity: { en: 'Lakshmi-Vishnu', hi: 'लक्ष्मी-विष्णु', sa: 'लक्ष्मीविष्णू' },

  samagri: [
    { name: { en: 'Gold or silver item (even small — coin, ring, or chain)', hi: 'सोना या चाँदी की वस्तु (छोटी भी हो — सिक्का, अँगूठी या चेन)', sa: 'स्वर्णं रजतं वा (लघु अपि — नाणकम् अङ्गुलीयकं शृङ्खला वा)' }, essential: true, note: { en: 'Buying gold/silver on Akshaya Tritiya is believed to bring inexhaustible prosperity', hi: 'अक्षय तृतीया पर सोना/चाँदी ख़रीदने से अक्षय समृद्धि आती है', sa: 'अक्षयतृतीयायाम् स्वर्णरजतक्रयणेन अक्षयसमृद्धिः भवति' } },
    { name: { en: 'Tulsi leaves (holy basil)', hi: 'तुलसी के पत्ते', sa: 'तुलसीपत्राणि' }, essential: true, category: 'flowers' },
    { name: { en: 'Charity items (clothes, food, water pots)', hi: 'दान की वस्तुएँ (वस्त्र, भोजन, जल के बर्तन)', sa: 'दानसामग्री (वस्त्राणि, अन्नम्, जलपात्राणि)' }, essential: true },
    { name: { en: 'Vishnu idol or image', hi: 'विष्णु मूर्ति या चित्र', sa: 'विष्णुमूर्तिः अथवा चित्रम्' } },
    { name: { en: 'Lakshmi idol or image', hi: 'लक्ष्मी मूर्ति या चित्र', sa: 'लक्ष्मीमूर्तिः अथवा चित्रम्' } },
    { name: { en: 'Yellow flowers (marigold)', hi: 'पीले फूल (गेंदा)', sa: 'पीतपुष्पाणि (स्थालपद्मानि)' }, category: 'flowers' },
    { name: { en: 'Fruits and sweets', hi: 'फल और मिठाई', sa: 'फलानि मिष्टान्नानि च' }, category: 'food' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items' },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items' },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items' },
    { name: { en: 'Yellow cloth', hi: 'पीला कपड़ा', sa: 'पीतवस्त्रम्' }, category: 'clothing' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Akshaya Tritiya falls on Vaishakha Shukla Tritiya. The entire day is auspicious — no specific muhurta is required. Any activity performed on this day yields akshaya (inexhaustible) results. Puja, charity, and purchases can be done at any time during the day.',
    hi: 'अक्षय तृतीया वैशाख शुक्ल तृतीया को पड़ती है। पूरा दिन शुभ है — किसी विशेष मुहूर्त की आवश्यकता नहीं। इस दिन किया गया कोई भी कार्य अक्षय (अनन्त) फल देता है। पूजा, दान और ख़रीदारी दिन में कभी भी की जा सकती है।',
    sa: 'अक्षयतृतीया वैशाखशुक्लतृतीयायां भवति। सकलं दिनं शुभम् — विशिष्टमुहूर्तस्य आवश्यकता नास्ति। अस्मिन् दिने कृतं किमपि कर्म अक्षयफलं ददाति। पूजा दानं क्रयणं च दिने कदापि कर्तुं शक्यम्।',
  },

  sankalpa: {
    en: 'On this sacred Akshaya Tritiya, I undertake the worship of Lakshmi and Vishnu and perform charity (daan) for inexhaustible prosperity, spiritual merit, and divine grace.',
    hi: 'इस पवित्र अक्षय तृतीया पर, अक्षय समृद्धि, पुण्यप्राप्ति और दिव्य कृपा के लिए, मैं लक्ष्मी-विष्णु की पूजा और दान का संकल्प करता/करती हूँ।',
    sa: 'अस्यां पवित्रायाम् अक्षयतृतीयायां अक्षयसमृद्ध्यर्थं पुण्यसम्पादनाय दिव्यकृपाप्राप्त्यर्थं च लक्ष्मीविष्ण्वोः पूजनं दानं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning — Bath & Sankalpa', hi: 'प्रातः — स्नान एवं संकल्प', sa: 'प्रातः — स्नानसङ्कल्पौ' },
      description: {
        en: 'Take a purifying morning bath. Wear clean yellow or white clothes. Sit before the altar and take the formal sankalpa for Akshaya Tritiya puja and daan.',
        hi: 'प्रातः शुद्धि स्नान करें। स्वच्छ पीले या सफ़ेद वस्त्र पहनें। वेदी के सामने बैठकर अक्षय तृतीया पूजा और दान के लिए विधिवत् संकल्प करें।',
        sa: 'प्रातः शुद्धिस्नानं कुर्यात्। शुचिपीतश्वेतवस्त्रं धारयेत्। वेद्याः पुरतः उपविश्य अक्षयतृतीयापूजादानार्थं सङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '15 min',
    },
    {
      step: 2,
      title: { en: 'Lakshmi-Vishnu Puja', hi: 'लक्ष्मी-विष्णु पूजा', sa: 'लक्ष्मीविष्णुपूजनम्' },
      description: {
        en: 'Place idols or images of Lakshmi and Vishnu on the altar draped with a yellow cloth. Offer sandalwood paste, Tulsi leaves (to Vishnu), yellow flowers, akshat, and kumkum. Light incense and a ghee diya.',
        hi: 'पीले कपड़े से सजी वेदी पर लक्ष्मी-विष्णु की मूर्तियाँ या चित्र स्थापित करें। चन्दन, तुलसी पत्र (विष्णु को), पीले फूल, अक्षत और कुमकुम अर्पित करें। अगरबत्ती और घी का दीपक जलाएँ।',
        sa: 'पीतवस्त्रावृतायां वेद्याम् लक्ष्मीविष्ण्वोः मूर्तीः चित्राणि वा स्थापयेत्। चन्दनं तुलसीपत्राणि (विष्णवे) पीतपुष्पाणि अक्षतान् कुङ्कुमं च अर्पयेत्। धूपं घृतदीपं च प्रज्वालयेत्।',
      },
      essential: true,
      stepType: 'offering',
      duration: '20 min',
    },
    {
      step: 3,
      title: { en: 'Vishnu Beej Mantra Japa', hi: 'विष्णु बीज मन्त्र जप', sa: 'विष्णुबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Vishnu Beej mantra 108 times with a tulsi mala. Focus on the form of Lord Vishnu and pray for inexhaustible blessings.',
        hi: 'तुलसी माला से विष्णु बीज मन्त्र का 108 बार जप करें। भगवान विष्णु के स्वरूप पर ध्यान केन्द्रित करें और अक्षय आशीर्वाद की कामना करें।',
        sa: 'तुलसीमालया विष्णुबीजमन्त्रं १०८ वारं जपेत्। श्रीविष्णोः स्वरूपे ध्यानं केन्द्रीकुर्यात् अक्षयाशीर्वादं प्रार्थयेत् च।',
      },
      mantraRef: 'vishnu-beej',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 4,
      title: { en: 'Lakshmi Mantra & Prayer', hi: 'लक्ष्मी मन्त्र एवं प्रार्थना', sa: 'लक्ष्मीमन्त्रः प्रार्थना च' },
      description: {
        en: 'Chant the Lakshmi mantra 108 times. Pray to Goddess Lakshmi for wealth, prosperity, and abundance in the household. Offer lotus flowers or yellow flowers if lotus is unavailable.',
        hi: 'लक्ष्मी मन्त्र का 108 बार जप करें। देवी लक्ष्मी से घर में धन, समृद्धि और प्रचुरता की प्रार्थना करें। कमल के फूल या कमल उपलब्ध न हो तो पीले फूल अर्पित करें।',
        sa: 'लक्ष्मीमन्त्रं १०८ वारं जपेत्। लक्ष्मीदेवीं गृहे धनसमृद्धिप्रचुरतायै प्रार्थयेत्। पद्मानि अथवा पद्मानुपलभ्ये पीतपुष्पाणि अर्पयेत्।',
      },
      mantraRef: 'lakshmi-mantra',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 5,
      title: { en: 'Naivedya & Aarti', hi: 'नैवेद्य एवं आरती', sa: 'नैवेद्यम् आरात्रिकं च' },
      description: {
        en: 'Offer naivedya (fruits, sweets, kheer) to Lakshmi-Vishnu. Perform the aarti with camphor and ghee lamp. Ring the bell and offer the flame to all family members.',
        hi: 'लक्ष्मी-विष्णु को नैवेद्य (फल, मिठाई, खीर) अर्पित करें। कपूर और घी के दीपक से आरती करें। घण्टी बजाएँ और सभी परिवारजनों को ज्योति दिखाएँ।',
        sa: 'लक्ष्मीविष्णुभ्यां नैवेद्यम् (फलानि मिष्टान्नानि क्षीरान्नं च) अर्पयेत्। कर्पूरघृतदीपाभ्याम् आरात्रिकं कुर्यात्। घण्टां वादयेत् सर्वपरिजनेभ्यः ज्योतिं प्रदर्शयेत्।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
    {
      step: 6,
      title: { en: 'Charity — Daan (The Core Act)', hi: 'दान (मुख्य कर्म)', sa: 'दानम् (प्रधानकर्म)' },
      description: {
        en: 'Akshaya Tritiya is primarily a day of daan (charity). Donate clothes, food grains, water pots (for summer), gold/silver coins, fruits, and money to the needy. Anna daan (food charity) and jala daan (water charity) are especially meritorious on this day.',
        hi: 'अक्षय तृतीया मुख्यतः दान का दिन है। ज़रूरतमन्दों को वस्त्र, अनाज, जल के बर्तन (गर्मी के लिए), सोने/चाँदी के सिक्के, फल और धन दान करें। इस दिन अन्न दान और जल दान विशेष पुण्यदायी हैं।',
        sa: 'अक्षयतृतीया प्रधानतः दानदिनम्। दीनेभ्यः वस्त्राणि, अन्नम्, जलपात्राणि (ग्रीष्मार्थम्), स्वर्णरजतनाणकानि, फलानि, धनं च दद्यात्। अस्मिन् दिने अन्नदानं जलदानं च विशेषपुण्यप्रदम्।',
      },
      essential: true,
      stepType: 'offering',
      duration: '30 min',
    },
    {
      step: 7,
      title: { en: 'Gold/Silver Purchase (Optional)', hi: 'सोना/चाँदी ख़रीदना (वैकल्पिक)', sa: 'स्वर्णरजतक्रयणम् (ऐच्छिकम्)' },
      description: {
        en: 'Purchase gold or silver — even a small amount. This tradition symbolises that wealth acquired on Akshaya Tritiya is inexhaustible (akshaya = never diminishing). Even a gold coin or small piece of silver suffices.',
        hi: 'सोना या चाँदी ख़रीदें — थोड़ी सी भी। यह परम्परा दर्शाती है कि अक्षय तृतीया पर प्राप्त धन अक्षय (कभी न घटने वाला) होता है। एक स्वर्ण मुद्रा या चाँदी का छोटा टुकड़ा भी पर्याप्त है।',
        sa: 'स्वर्णं रजतं वा क्रीणीयात् — अल्पम् अपि। एषा परम्परा दर्शयति अक्षयतृतीयायां प्राप्तं धनम् अक्षयं (कदापि न क्षीयते) भवतीति। एकं स्वर्णनाणकं लघुरजतखण्डं वा पर्याप्तम्।',
      },
      essential: false,
      stepType: 'offering',
      duration: '15 min',
    },
    {
      step: 8,
      title: { en: 'Sattu & Refreshments Distribution', hi: 'सत्तू एवं जलपान वितरण', sa: 'सक्तुपानीयवितरणम्' },
      description: {
        en: 'Distribute sattu (roasted gram flour mixed with water and jaggery), buttermilk, or water to passersby and the poor. Akshaya Tritiya falls in the peak of summer, making water and cooling drinks the most valuable charity.',
        hi: 'राहगीरों और ग़रीबों को सत्तू (भुने चने का आटा जल और गुड़ मिलाकर), छाछ या जल वितरित करें। अक्षय तृतीया गर्मी की चरम पर पड़ती है, इसलिए जल और शीतल पेय सबसे मूल्यवान दान है।',
        sa: 'पथिकेभ्यः दीनेभ्यश्च सक्तुं (भृष्टचणकचूर्णं जलगुडमिश्रम्), तक्रं, जलं वा वितरेत्। अक्षयतृतीया ग्रीष्मोत्कर्षे भवति, अतो जलं शीतलपानीयं च सर्वमूल्यवत् दानम्।',
      },
      essential: false,
      stepType: 'conclusion',
      duration: '30 min',
    },
  ],

  mantras: [
    {
      id: 'vishnu-beej',
      name: { en: 'Vishnu Beej Mantra', hi: 'विष्णु बीज मन्त्र', sa: 'विष्णुबीजमन्त्रः' },
      devanagari: 'ॐ नमो नारायणाय',
      iast: 'oṃ namo nārāyaṇāya',
      meaning: {
        en: 'Om, salutations to Lord Narayana (Vishnu), the supreme refuge of all beings.',
        hi: 'ॐ, सभी प्राणियों के परम आश्रय भगवान नारायण (विष्णु) को नमस्कार।',
        sa: 'ॐ, सर्वभूतानां परमाश्रयाय नारायणाय (विष्णवे) नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'The eight-syllable Narayana mantra. Chant 108 times during the puja. This is the Ashtakshari mantra — the supreme Vaishnava mantra.',
        hi: 'आठ अक्षरों का नारायण मन्त्र। पूजा के दौरान 108 बार जपें। यह अष्टाक्षरी मन्त्र — वैष्णवों का सर्वोच्च मन्त्र है।',
        sa: 'अष्टाक्षरनारायणमन्त्रः। पूजायां १०८ वारं जपेत्। एषः अष्टाक्षरीमन्त्रः — वैष्णवानां परममन्त्रः।',
      },
    },
    {
      id: 'lakshmi-mantra',
      name: { en: 'Lakshmi Beej Mantra', hi: 'लक्ष्मी बीज मन्त्र', sa: 'लक्ष्मीबीजमन्त्रः' },
      devanagari: 'ॐ श्रीं महालक्ष्म्यै नमः',
      iast: 'oṃ śrīṃ mahālakṣmyai namaḥ',
      meaning: {
        en: 'Om, with the seed syllable of prosperity (Shrim), salutations to Goddess Mahalakshmi.',
        hi: 'ॐ, समृद्धि के बीज अक्षर (श्रीं) सहित, देवी महालक्ष्मी को नमस्कार।',
        sa: 'ॐ, समृद्धिबीजाक्षरेण (श्रीं) सह, महालक्ष्म्यै नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times for wealth and prosperity. Especially powerful on Akshaya Tritiya as all merit is akshaya (inexhaustible) on this day.',
        hi: 'धन और समृद्धि के लिए 108 बार जपें। अक्षय तृतीया पर विशेष प्रभावी क्योंकि इस दिन सभी पुण्य अक्षय होते हैं।',
        sa: 'धनसमृद्ध्यर्थं १०८ वारं जपेत्। अक्षयतृतीयायां विशेषप्रभावी यतः अस्मिन् दिने सर्वपुण्यम् अक्षयं भवति।',
      },
    },
  ],

  naivedya: {
    en: 'Offer kheer (rice pudding), fruits, sweets, and Tulsi water to Lakshmi-Vishnu. Sattu (roasted gram flour) laddoo and seasonal mangoes are traditional offerings on Akshaya Tritiya.',
    hi: 'लक्ष्मी-विष्णु को खीर, फल, मिठाई और तुलसी जल अर्पित करें। सत्तू (भुने चने का आटा) के लड्डू और मौसमी आम अक्षय तृतीया के पारम्परिक भोग हैं।',
    sa: 'लक्ष्मीविष्णुभ्यां क्षीरान्नं फलानि मिष्टान्नानि तुलसीजलं च अर्पयेत्। सक्तुलड्डुकानि ऋतुआम्राणि च अक्षयतृतीयायाः पारम्परिकभोगाः।',
  },

  precautions: [
    {
      en: 'Charity (daan) is the primary act of Akshaya Tritiya. Do not let the day pass without performing some form of charity, however small.',
      hi: 'दान अक्षय तृतीया का प्रमुख कर्म है। कुछ न कुछ दान किए बिना, चाहे छोटा ही हो, दिन न बीतने दें।',
      sa: 'दानम् अक्षयतृतीयायाः प्रधानकर्म। किञ्चित् दानं विना, अल्पम् अपि, दिनं न यापयेत्।',
    },
    {
      en: 'Do not buy gold merely for hoarding or greed. The spiritual purpose is to begin new worthy investments and charitable acts on this auspicious day.',
      hi: 'केवल जमा करने या लालच से सोना न ख़रीदें। आध्यात्मिक उद्देश्य इस शुभ दिन पर नए योग्य निवेश और दान कर्म आरम्भ करना है।',
      sa: 'केवलं सञ्चयलोभाय स्वर्णं न क्रीणीयात्। आध्यात्मिकप्रयोजनम् अस्मिन् शुभदिने नवान् योग्यनिवेशान् दानकर्माणि च आरभितुम्।',
    },
    {
      en: 'If fasting, it is not a strict nirjala fast. Phalahar (fruit diet) is acceptable. The emphasis is on charity and puja, not on severe fasting.',
      hi: 'यदि व्रत रख रहे हैं तो यह कठोर निर्जला व्रत नहीं है। फलाहार स्वीकार्य है। ज़ोर दान और पूजा पर है, कठोर उपवास पर नहीं।',
      sa: 'व्रतं चेत् कठोरनिर्जलव्रतं नास्ति। फलाहारः स्वीकार्यः। दाने पूजायां च बलम्, न कठोरोपवासे।',
    },
  ],

  phala: {
    en: 'Akshaya Tritiya is one of the most sacred tithis in the Hindu calendar. Any act of merit — charity, puja, japa, new beginnings — performed on this day yields akshaya (inexhaustible, never-diminishing) results. The Brahma Purana states that daan on Akshaya Tritiya is equal to daan at all tirthas combined. This is the day Treta Yuga began, the day the Ganges descended to earth, and the day Kubera received his wealth from Shiva.',
    hi: 'अक्षय तृतीया हिन्दू पञ्चाँग की सबसे पवित्र तिथियों में से एक है। इस दिन किया गया कोई भी पुण्य कर्म — दान, पूजा, जप, नई शुरुआत — अक्षय (कभी न घटने वाला) फल देता है। ब्रह्म पुराण के अनुसार अक्षय तृतीया पर दान सभी तीर्थों के दान के बराबर है। यही दिन है जब त्रेता युग आरम्भ हुआ, गंगा पृथ्वी पर अवतरित हुईं, और कुबेर को शिव से उनका धन प्राप्त हुआ।',
    sa: 'अक्षयतृतीया हिन्दूपञ्चाङ्गस्य पवित्रतमासु तिथिषु अन्यतमा। अस्मिन् दिने कृतं किमपि पुण्यकर्म — दानं पूजा जपः नवारम्भः — अक्षयफलं ददाति। ब्रह्मपुराणे उक्तम् अक्षयतृतीयायां दानं सर्वतीर्थदानसमम्। एतद्दिने त्रेतायुगः आरब्धः, गङ्गा पृथिव्याम् अवतीर्णा, कुबेरः शिवात् स्वधनं प्राप्तवान्।',
  },
};

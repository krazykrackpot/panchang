import type { PujaVidhi } from './types';

export const PONGAL_PUJA: PujaVidhi = {
  festivalSlug: 'pongal',
  category: 'festival',
  deity: { en: 'Surya (Sun God)', hi: 'सूर्य देव', sa: 'सूर्यदेवः', ta: 'சூரியன் (சூரிய பகவான்)' },

  samagri: [
    { name: { en: 'New earthen pot (Pongal Paanai)', hi: 'नया मिट्टी का बर्तन (पोंगल पानै)', sa: 'नवं मृत्तिकापात्रम् (पोङ्गलपानै)', ta: 'புதிய மண் பானை (பொங்கல் பானை)' }, category: 'vessels', essential: true },
    { name: { en: 'Raw rice', hi: 'कच्चे चावल', sa: 'आमतण्डुलाः', ta: 'பச்சரிசி' }, category: 'food', essential: true },
    { name: { en: 'Fresh cow milk', hi: 'ताजा गाय का दूध', sa: 'नवं गोक्षीरम्', ta: 'புதிய பசும்பால்' }, category: 'food', essential: true },
    { name: { en: 'Jaggery (vellam)', hi: 'गुड़ (वेल्लम्)', sa: 'गुडम् (वेल्लम्)', ta: 'வெல்லம்' }, category: 'food', essential: true },
    { name: { en: 'Sugarcane stalks', hi: 'गन्ने के डंठल', sa: 'इक्षुदण्डाः', ta: 'கரும்புத் தண்டுகள்' }, quantity: '4-5', category: 'food', essential: true },
    { name: { en: 'Turmeric plant with root (manjal)', hi: 'जड़ सहित हल्दी का पौधा (मंजल)', sa: 'समूलं हरिद्रासस्यम् (मञ्जल्)', ta: 'வேருடன் கூடிய மஞ்சள் செடி' }, category: 'puja_items', essential: true },
    { name: { en: 'Fresh turmeric leaves', hi: 'ताजी हल्दी की पत्तियाँ', sa: 'आर्द्रहरिद्रापत्राणि', ta: 'புதிய மஞ்சள் இலைகள்' }, category: 'puja_items', essential: false },
    { name: { en: 'Kolam powder (rice flour)', hi: 'कोलम पाउडर (चावल का आटा)', sa: 'कोलमचूर्णम् (तण्डुलचूर्णम्)', ta: 'கோலப் பொடி (அரிசி மாவு)' }, category: 'puja_items', essential: true },
    { name: { en: 'Banana leaves', hi: 'केले के पत्ते', sa: 'कदलीपत्राणि', ta: 'வாழை இலைகள்' }, category: 'other', essential: true },
    { name: { en: 'Cashews and raisins', hi: 'काजू और किशमिश', sa: 'काजूद्राक्षाशुष्कफलानि', ta: 'முந்திரி மற்றும் திராட்சை' }, category: 'food', essential: false },
    { name: { en: 'Cardamom', hi: 'इलायची', sa: 'एला', ta: 'ஏலக்காய்' }, category: 'food', essential: false },
    { name: { en: 'Ghee', hi: 'घी', sa: 'घृतम्', ta: 'நெய்' }, category: 'food', essential: true },
    { name: { en: 'Moong dal', hi: 'मूँग दाल', sa: 'मुद्गदालम्', ta: 'பாசிப்பருப்பு' }, category: 'food', essential: false },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्', ta: 'கற்பூரம்' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्', ta: 'ஊதுபத்திகள்' }, category: 'puja_items', essential: true },
    { name: { en: 'Flowers (marigold, jasmine)', hi: 'फूल (गेंदा, चमेली)', sa: 'पुष्पाणि (स्थलपद्मं मल्लिका च)', ta: 'பூக்கள் (சாமந்தி, மல்லிகை)' }, category: 'flowers', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्', ta: 'தேங்காய்' }, category: 'food', essential: true },
    { name: { en: 'Bananas', hi: 'केले', sa: 'कदलीफलानि', ta: 'வாழைப்பழங்கள்' }, category: 'food', essential: true },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Pongal is a 4-day harvest festival celebrated from January 14–17 (Thai month). Thai Pongal (Day 2) is the main day — cook the Pongal dish at sunrise facing east. The moment the milk boils over the pot is the most auspicious instant, symbolizing abundance overflowing into the new year.',
    hi: 'पोंगल 14-17 जनवरी (थाई मास) तक मनाया जाने वाला 4 दिवसीय फसल उत्सव है। थाई पोंगल (दूसरा दिन) मुख्य दिन है — सूर्योदय पर पूर्व दिशा में पोंगल पकाएँ। दूध का बर्तन से उफनकर बाहर आना सबसे शुभ क्षण है, नए वर्ष में समृद्धि के अतिप्रवाह का प्रतीक।',
    sa: 'पोङ्गलम् जनवरीमासस्य १४-१७ दिनाङ्केषु (थाईमासे) आचर्यमाणः चतुर्दिनात्मकः सस्योत्सवः। थाईपोङ्गलम् (द्वितीयदिनम्) प्रधानदिनम् — सूर्योदये पूर्वाभिमुखं पोङ्गलं पचेत्। क्षीरस्य पात्रात् उद्गमनं सर्वोत्तमः शुभक्षणः नववर्षे समृद्ध्यतिप्रवाहस्य प्रतीकम्।',
    ta: 'பொங்கல் ஜனவரி 14–17 (தை மாதம்) வரை கொண்டாடப்படும் 4 நாள் அறுவடைத் திருவிழா. தைப்பொங்கல் (2வது நாள்) முக்கிய நாள் — சூரிய உதயத்தில் கிழக்கு நோக்கி பொங்கல் சமைக்கவும். பால் பானையிலிருந்து பொங்கி வழியும் கணம் மிகவும் சுபமான தருணம், புத்தாண்டில் செழிப்பு பொங்கி வழிவதன் அடையாளம்.',
  },
  muhurtaWindow: { type: 'brahma_muhurta' },

  sankalpa: {
    en: 'On this auspicious day of Thai Pongal, I offer my gratitude to Surya Bhagavan, the giver of life and sustainer of all creation, for blessing us with a bountiful harvest and prosperity. I cook this Pongal with devotion, seeking continued blessings of health, wealth, and abundance for my family.',
    hi: 'इस शुभ थाई पोंगल के दिन, मैं जीवन के दाता और समस्त सृष्टि के पालक सूर्य भगवान को भरपूर फसल और समृद्धि का आशीर्वाद देने के लिए कृतज्ञता अर्पित करता/करती हूँ। मैं भक्तिपूर्वक यह पोंगल पकाता/पकाती हूँ, अपने परिवार के लिए निरन्तर स्वास्थ्य, धन और समृद्धि का आशीर्वाद माँगते हुए।',
    sa: 'अस्मिन् शुभे थाईपोङ्गलदिने जीवनदातारं सर्वसृष्टिपालकं सूर्यभगवन्तं समृद्धसस्यप्रदानाय कृतज्ञतां समर्पयामि। भक्त्या इदं पोङ्गलं पचामि कुटुम्बस्य कृते निरन्तरं स्वास्थ्यधनसमृद्ध्याशीर्वादं याचमानः।',
    ta: 'இந்த சுபமான தைப்பொங்கல் நாளில், உயிர் அளிப்பவரும் அனைத்து படைப்புகளையும் காப்பவருமான சூரிய பகவானுக்கு, எங்களுக்கு நிறைவான அறுவடையும் செழிப்பும் அருளியதற்கு நன்றி தெரிவிக்கிறேன். என் குடும்பத்திற்கு தொடர்ந்து ஆரோக்கியம், செல்வம், செழிப்பு என்ற ஆசிகளை வேண்டி பக்தியுடன் இந்தப் பொங்கலைச் சமைக்கிறேன்.',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Bhogi Pongal — Day 1: Cleansing & Bonfire', hi: 'भोगी पोंगल — दिन 1: शुद्धि एवं अलाव', sa: 'भोगीपोङ्गलम् — प्रथमदिनम्: शुद्धिः अग्निहोत्रं च', ta: 'போகிப் பொங்கல் — நாள் 1: தூய்மை & நெருப்பு' },
      description: {
        en: 'On the eve of Pongal, discard old and broken items from the house. At dawn, light the Bhogi Mantalu — a bonfire of old wooden furniture, clothes, and dried cow dung cakes. This symbolizes burning away the past and welcoming new beginnings. Women draw elaborate Kolam patterns with rice flour at the entrance. The house is thoroughly cleaned and decorated with mango leaves (torana).',
        hi: 'पोंगल की पूर्व सन्ध्या पर घर से पुरानी और टूटी वस्तुओं को हटाएँ। भोर में भोगी मन्तलु — पुराने लकड़ी के फर्नीचर, कपड़ों और सूखे गोबर के उपलों का अलाव — जलाएँ। यह अतीत को जलाकर नई शुरुआत का स्वागत करने का प्रतीक है। महिलाएँ प्रवेश द्वार पर चावल के आटे से विस्तृत कोलम बनाती हैं। घर की पूरी सफाई कर आम के पत्तों (तोरण) से सजाएँ।',
        sa: 'पोङ्गलस्य पूर्वसन्ध्यायां गृहात् जीर्णभग्नवस्तूनि अपसारयेत्। प्रभाते भोगीमन्तलु — जीर्णकाष्ठवस्त्रशुष्कगोमयोपलानाम् अग्निहोत्रम् — प्रज्वालयेत्। इदं अतीतस्य दाहेन नवारम्भस्वागतस्य प्रतीकम्। स्त्रियः द्वारे तण्डुलचूर्णेन विस्तृतं कोलमं रचयन्ति। गृहं सम्यक् शोधयित्वा आम्रपत्रैः (तोरणैः) सज्जयेत्।',
      },
      duration: '60 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Thai Pongal — Day 2: Cooking the Sacred Pongal', hi: 'थाई पोंगल — दिन 2: पवित्र पोंगल पकाना', sa: 'थाईपोङ्गलम् — द्वितीयदिनम्: पवित्रपोङ्गलपाकः', ta: 'தைப்பொங்கல் — நாள் 2: புனிதப் பொங்கல் சமைத்தல்' },
      description: {
        en: 'This is the main day. Rise before dawn and bathe. Draw a fresh Kolam with a pot (Pongal Paanai) design at the entrance. Set up the cooking area outdoors facing east. Place the new earthen pot on a brick hearth. Tie the turmeric plant and sugarcane to the pot. Pour milk into the pot and bring it to a boil. When the milk boils over, the family shouts "Pongalo Pongal!" — this is the climactic moment symbolizing overflowing prosperity. Then add rice, jaggery, ghee, cashews, and cardamom to make the sweet Pongal.',
        hi: 'यह मुख्य दिन है। भोर से पहले उठकर स्नान करें। प्रवेश द्वार पर बर्तन (पोंगल पानै) डिज़ाइन के साथ ताज़ा कोलम बनाएँ। खुले में पूर्वाभिमुख पाक स्थल तैयार करें। ईंट की चूल्हे पर नया मिट्टी का बर्तन रखें। बर्तन पर हल्दी का पौधा और गन्ना बाँधें। बर्तन में दूध डालकर उबालें। जब दूध उफनकर बाहर आए, परिवार "पोंगलो पोंगल!" चिल्लाए — यह उफनती समृद्धि का चरम क्षण है। फिर चावल, गुड़, घी, काजू और इलायची डालकर मीठा पोंगल बनाएँ।',
        sa: 'इदं प्रधानदिनम्। प्रभातात् पूर्वम् उत्थाय स्नायात्। द्वारे पात्रचित्रसहितं नवं कोलमं रचयेत्। बहिः पूर्वाभिमुखं पाकस्थलं सज्जयेत्। इष्टिकाचूल्ह्यां नवं मृत्तिकापात्रं स्थापयेत्। पात्रे हरिद्रासस्यम् इक्षुदण्डं च बध्नीयात्। पात्रे क्षीरं निक्षिप्य उत्कर्षयेत्। यदा क्षीरं पात्रात् उद्गच्छति तदा कुटुम्बिनः "पोङ्गलो पोङ्गल्!" इति उच्चैः वदन्ति — इदं समृद्ध्यतिप्रवाहस्य चरमक्षणः। ततः तण्डुलान् गुडं घृतं काजून् एलां च योजयित्वा मधुरपोङ्गलं पचेत्।',
      },
      duration: '45 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 3,
      title: { en: 'Surya Puja — Offering Pongal to the Sun', hi: 'सूर्य पूजा — सूर्य को पोंगल अर्पण', sa: 'सूर्यपूजा — सूर्याय पोङ्गलसमर्पणम्', ta: 'சூரிய பூஜை — சூரியனுக்குப் பொங்கல் படைத்தல்' },
      description: {
        en: 'Place the cooked Pongal on a banana leaf facing the Sun. Arrange sugarcane, bananas, coconut, turmeric, flowers, and betel leaves around it. Light camphor and incense. Offer prayers to Surya Bhagavan, thanking Him for the harvest and praying for continued prosperity. The whole family participates, wearing new clothes. The Pongal is first offered to Surya, then to Indra (god of rains), and then to the cattle and farm animals.',
        hi: 'पके हुए पोंगल को सूर्य की ओर केले के पत्ते पर रखें। चारों ओर गन्ना, केला, नारियल, हल्दी, फूल और पान के पत्ते सजाएँ। कपूर और अगरबत्ती जलाएँ। सूर्य भगवान को फसल के लिए धन्यवाद देते हुए और निरन्तर समृद्धि की प्रार्थना करते हुए पूजा अर्पित करें। पूरा परिवार नए कपड़े पहनकर भाग लेता है। पोंगल पहले सूर्य को, फिर इन्द्र (वर्षा के देवता) को, फिर पशुधन और कृषि पशुओं को अर्पित किया जाता है।',
        sa: 'पक्वं पोङ्गलं कदलीपत्रे सूर्याभिमुखं स्थापयेत्। परितः इक्षुदण्डान् कदलीफलानि नारिकेलं हरिद्रां पुष्पाणि ताम्बूलपत्राणि च सज्जयेत्। कर्पूरं धूपं च प्रज्वालयेत्। सस्योत्पत्तये धन्यवादं वदन् निरन्तरसमृद्ध्यर्थं प्रार्थयन् सूर्यभगवन्तं पूजयेत्। सर्वे कुटुम्बिनः नववस्त्राणि धारयित्वा भागं गृह्णन्ति। पोङ्गलं प्रथमं सूर्याय ततः इन्द्राय ततः पशुभ्यः कृषिपशुभ्यश्च समर्प्यते।',
      },
      mantraRef: 'surya-pongal',
      duration: '20 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Mattu Pongal — Day 3: Honoring Cattle', hi: 'मट्टू पोंगल — दिन 3: पशुधन का सम्मान', sa: 'मट्टुपोङ्गलम् — तृतीयदिनम्: पशूनां सम्मानम्', ta: 'மாட்டுப் பொங்கல் — நாள் 3: கால்நடைகளைப் போற்றுதல்' },
      description: {
        en: 'This day honours cattle, especially cows and bulls, who are vital to agriculture. Bathe the cattle and adorn their horns with bright paint, flowers, garlands, and bells. Apply kumkum and sandalwood paste on their foreheads. Feed them Pongal rice, sugarcane, and bananas. Take them in a procession through the village. In some regions, Jallikattu (bull-taming sport) is held on this day. This is also the day to express gratitude to Nandi, the sacred bull of Lord Shiva.',
        hi: 'यह दिन पशुधन, विशेषकर गायों और बैलों का सम्मान करता है जो कृषि के लिए अत्यावश्यक हैं। पशुओं को नहलाकर उनके सींगों को चमकीले रंग, फूलों, मालाओं और घण्टियों से सजाएँ। उनके माथे पर कुमकुम और चन्दन का लेप लगाएँ। उन्हें पोंगल चावल, गन्ना और केले खिलाएँ। गाँव में उनकी शोभायात्रा निकालें। कुछ क्षेत्रों में इस दिन जल्लीकट्टू (बैल दौड़) आयोजित होती है। यह नन्दी, भगवान शिव के पवित्र वृषभ, के प्रति कृतज्ञता व्यक्त करने का भी दिन है।',
        sa: 'इदं दिनं पशूनां विशेषतः गवां वृषभाणां च सम्मानार्थम्, ये कृष्यर्थम् अत्यावश्यकाः। पशून् स्नापयित्वा तेषां शृङ्गाणि उज्ज्वलवर्णैः पुष्पैः मालाभिः घण्टाभिश्च अलङ्कुर्यात्। तेषां ललाटे कुङ्कुमं चन्दनलेपं च विलिम्पेत्। तेभ्यः पोङ्गलतण्डुलान् इक्षुदण्डान् कदलीफलानि च भोजयेत्। ग्रामे तेषां शोभायात्रां नयेत्। केषुचित् प्रदेशेषु अस्मिन् दिने जल्लीकट्टु (वृषभक्रीडा) आयोज्यते। इदं नन्दिनः शिवस्य पवित्रवृषभस्य प्रति कृतज्ञतादिनमपि।',
      },
      duration: '60 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Kaanum Pongal — Day 4: Family Reunion', hi: 'कानुम पोंगल — दिन 4: पारिवारिक मिलन', sa: 'कानुमपोङ्गलम् — चतुर्थदिनम्: कुटुम्बमिलनम्', ta: 'காணும் பொங்கல் — நாள் 4: குடும்ப ஒன்றுகூடல்' },
      description: {
        en: 'The final day is dedicated to family bonding and outings. Place leftover Pongal rice, betel leaves, turmeric leaf, sugarcane pieces, and two bananas on a turmeric leaf in the open. Sisters pray for their brothers\' well-being (similar to Bhai Dooj). Families visit relatives, go to the beach or parks, and children enjoy bird-watching. In the evening, families gather for a feast. Young women perform the Kummi and Kolattam folk dances.',
        hi: 'अन्तिम दिन पारिवारिक जुड़ाव और सैर-सपाटे के लिए समर्पित है। हल्दी के पत्ते पर बचा हुआ पोंगल चावल, पान के पत्ते, हल्दी का पत्ता, गन्ने के टुकड़े और दो केले खुले में रखें। बहनें अपने भाइयों की कुशलता के लिए प्रार्थना करती हैं (भाई दूज के समान)। परिवार रिश्तेदारों से मिलने, समुद्र तट या पार्क जाते हैं, बच्चे पक्षी-दर्शन का आनन्द लेते हैं। शाम को परिवार भोज के लिए एकत्र होते हैं। युवतियाँ कुम्मी और कोलाट्टम लोक नृत्य करती हैं।',
        sa: 'अन्तिमं दिनं कुटुम्बबन्धनाय भ्रमणाय च समर्पितम्। हरिद्रापत्रे अवशिष्टपोङ्गलतण्डुलान् ताम्बूलपत्राणि हरिद्रापत्रम् इक्षुखण्डान् द्वे कदलीफले च बहिः स्थापयेत्। भगिन्यः स्वभ्रातृणां कुशलार्थं प्रार्थयन्ते (भ्रातृद्वितीयासदृशम्)। कुटुम्बाः बन्धून् मिलन्ति सागरतटं वनं वा गच्छन्ति बालाः पक्षिदर्शनम् आनन्दन्ते। सायं कुटुम्बाः भोजार्थम् एकत्र मिलन्ति। युवत्यः कुम्मी कोलाट्टम् इति लोकनृत्यानि कुर्वन्ति।',
      },
      duration: '120 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 6,
      title: { en: 'Aarti & Prasad Distribution', hi: 'आरती एवं प्रसाद वितरण', sa: 'आरात्रिकं प्रसादवितरणं च', ta: 'ஆரத்தி & பிரசாதம் வழங்குதல்' },
      description: {
        en: 'After the Surya Puja on Thai Pongal day, perform aarti with camphor. Distribute the sweet Pongal as prasad to all family members and neighbours. Share with the less fortunate — generosity on Pongal day brings blessings for the entire year. Elders bless the younger members of the family.',
        hi: 'थाई पोंगल दिवस पर सूर्य पूजा के बाद, कपूर से आरती करें। सभी परिवारजनों और पड़ोसियों को मीठा पोंगल प्रसाद के रूप में वितरित करें। जरूरतमन्दों के साथ बाँटें — पोंगल दिवस पर उदारता पूरे वर्ष आशीर्वाद लाती है। बड़े-बुज़ुर्ग परिवार के छोटे सदस्यों को आशीर्वाद देते हैं।',
        sa: 'थाईपोङ्गलदिने सूर्यपूजानन्तरं कर्पूरेण आरात्रिकं कुर्यात्। सर्वेभ्यः कुटुम्बिभ्यः पार्श्ववासिभ्यश्च मधुरपोङ्गलं प्रसादरूपेण वितरेत्। दरिद्रेभ्यः अपि दद्यात् — पोङ्गलदिने औदार्यं सम्पूर्णवर्षं आशीर्वादम् आनयति। ज्येष्ठाः कुटुम्बस्य कनिष्ठसदस्यान् आशिषन्ति।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'surya-pongal',
      name: { en: 'Surya Namaskar Mantra', hi: 'सूर्य नमस्कार मन्त्र', sa: 'सूर्यनमस्कारमन्त्रः' },
      devanagari: 'ॐ सूर्याय नमः\nॐ मित्राय नमः\nॐ रवये नमः\nॐ भानवे नमः\nॐ खगाय नमः\nॐ पूष्णे नमः\nॐ हिरण्यगर्भाय नमः\nॐ मरीचये नमः\nॐ आदित्याय नमः\nॐ सवित्रे नमः\nॐ अर्काय नमः\nॐ भास्कराय नमः',
      iast: 'oṃ sūryāya namaḥ\noṃ mitrāya namaḥ\noṃ ravaye namaḥ\noṃ bhānave namaḥ\noṃ khagāya namaḥ\noṃ pūṣṇe namaḥ\noṃ hiraṇyagarbhāya namaḥ\noṃ marīcaye namaḥ\noṃ ādityāya namaḥ\noṃ savitre namaḥ\noṃ arkāya namaḥ\noṃ bhāskarāya namaḥ',
      meaning: {
        en: 'The twelve names of Surya — salutations to the Sun, the Friend, the Radiant One, the Illuminator, the Sky-mover, the Nourisher, the Golden Womb, the Ray of Light, the Son of Aditi, the Stimulator, the Source of Energy, and the Shining One.',
        hi: 'सूर्य के बारह नाम — सूर्य, मित्र, रवि, भानु, खग, पूषन, हिरण्यगर्भ, मरीचि, आदित्य, सवित्र, अर्क और भास्कर को नमन।',
        sa: 'सूर्यस्य द्वादशनामानि — सूर्यः मित्रः रविः भानुः खगः पूषा हिरण्यगर्भः मरीचिः आदित्यः सवित्रा अर्कः भास्करश्च इति नमस्कारः।',
      },
      japaCount: 12,
      usage: {
        en: 'Chant all 12 names while offering arghya (water) to the Sun at sunrise during Thai Pongal',
        hi: 'थाई पोंगल पर सूर्योदय के समय सूर्य को अर्घ्य (जल) अर्पित करते हुए सभी 12 नामों का जाप करें',
        sa: 'थाईपोङ्गले सूर्योदयसमये सूर्याय अर्घ्यं दद्यात् द्वादशनामानि जपेत्',
      },
    },
    {
      id: 'surya-gayatri',
      name: { en: 'Surya Gayatri Mantra', hi: 'सूर्य गायत्री मन्त्र', sa: 'सूर्यगायत्रीमन्त्रः' },
      devanagari: 'ॐ भास्कराय विद्महे महाद्युतिकराय धीमहि तन्नो सूर्यः प्रचोदयात्',
      iast: 'oṃ bhāskarāya vidmahe mahādyutikarāya dhīmahi tanno sūryaḥ pracodayāt',
      meaning: {
        en: 'We meditate on the Radiant Sun, we contemplate the Great Illuminator. May that Surya inspire and guide us towards the light of knowledge.',
        hi: 'हम तेजस्वी सूर्य का ध्यान करते हैं, महा प्रकाशकर्ता का चिन्तन करते हैं। वह सूर्य हमें ज्ञान के प्रकाश की ओर प्रेरित और मार्गदर्शित करे।',
        sa: 'भास्करं विद्मः। महाद्युतिकरं धीमहि। सूर्यः नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times facing the rising sun during Pongal morning puja',
        hi: 'पोंगल प्रातः पूजा में उगते सूर्य की ओर मुख करके 108 बार जपें',
        sa: 'पोङ्गलप्रातःपूजायाम् उदयमानसूर्याभिमुखं अष्टोत्तरशतवारं जपेत्',
      },
    },
  ],

  stotras: [
    {
      name: { en: 'Aditya Hridayam (selected verses)', hi: 'आदित्य हृदयम् (चुनिन्दा श्लोक)', sa: 'आदित्यहृदयम् (चितश्लोकाः)' },
      verseCount: 31,
      duration: '15 min',
      note: {
        en: 'The hymn taught by Sage Agastya to Lord Rama before the battle with Ravana. Reciting this during Pongal invokes the full power of the Sun.',
        hi: 'रावण से युद्ध से पहले ऋषि अगस्त्य ने भगवान राम को यह स्तोत्र सिखाया। पोंगल में इसका पाठ सूर्य की पूर्ण शक्ति का आवाहन करता है।',
        sa: 'रावणयुद्धात् पूर्वं अगस्त्यमुनिना श्रीरामाय उपदिष्टं स्तोत्रम्। पोङ्गले अस्य पाठः सूर्यस्य पूर्णशक्तिम् आवाहयति।',
      },
    },
  ],

  naivedya: {
    en: 'Sweet Pongal (sakkarai pongal) made with rice, jaggery, ghee, cashews, and cardamom. Also Ven Pongal (savoury pongal with pepper and cumin), bananas, coconut, sugarcane juice, and seasonal fruits. In some families, Medu Vada and Vadai are also prepared.',
    hi: 'मीठा पोंगल (सक्करै पोंगल) — चावल, गुड़, घी, काजू और इलायची से बना। वेन पोंगल (काली मिर्च और जीरे वाला नमकीन पोंगल), केले, नारियल, गन्ने का रस और मौसमी फल भी। कुछ परिवारों में मेदु वड़ा और वडै भी बनाई जाती है।',
    sa: 'मधुरपोङ्गलम् (सक्करैपोङ्गलम्) — तण्डुलैः गुडेन घृतेन काजूभिः एलया च निर्मितम्। वेनपोङ्गलम् (मरीचजीरकसहितं लवणपोङ्गलम्), कदलीफलानि, नारिकेलम्, इक्षुरसः, ऋतुफलानि च। केषुचित् कुटुम्बेषु मेदुवडा वडै च अपि निर्मीयन्ते।',
    ta: 'சர்க்கரைப் பொங்கல் — அரிசி, வெல்லம், நெய், முந்திரி, ஏலக்காய் கொண்டு தயாரிக்கப்படும். வெண் பொங்கல் (மிளகு, சீரகம் சேர்த்த பொங்கல்), வாழைப்பழங்கள், தேங்காய், கரும்புச் சாறு, பருவகால பழங்கள். சில குடும்பங்களில் மெது வடை, வடையும் செய்யப்படும்.',
  },

  precautions: [
    {
      en: 'The Pongal pot must be new and unused — never cook Pongal in an old vessel. The newness symbolizes fresh beginnings.',
      hi: 'पोंगल का बर्तन नया और अप्रयुक्त होना चाहिए — पुराने बर्तन में कभी पोंगल न पकाएँ। नयापन नई शुरुआत का प्रतीक है।',
      sa: 'पोङ्गलपात्रं नवम् अप्रयुक्तं च भवेत् — जीर्णपात्रे कदापि पोङ्गलं न पचेत्। नवत्वं नवारम्भस्य प्रतीकम्।',
    },
    {
      en: 'Let the milk boil over naturally — do not stir or prevent it. The overflowing milk is the most sacred moment of the festival.',
      hi: 'दूध को स्वाभाविक रूप से उफनने दें — हिलाएँ नहीं या रोकें नहीं। उफनता दूध उत्सव का सबसे पवित्र क्षण है।',
      sa: 'क्षीरं स्वाभाविकरूपेण उद्गच्छतु — न विलोडयेत् न निवारयेत्। उद्गतं क्षीरम् उत्सवस्य पवित्रतमः क्षणः।',
    },
    {
      en: 'Cook the Pongal outdoors in sunlight — not inside the kitchen. The Sun must witness the cooking.',
      hi: 'पोंगल बाहर धूप में पकाएँ — रसोई के अन्दर नहीं। सूर्य को पकने का साक्षी होना चाहिए।',
      sa: 'पोङ्गलं बहिः सूर्यप्रकाशे पचेत् — पाकशालायाम् अन्तः न। सूर्यः पाकस्य साक्षी भवेत्।',
    },
    {
      en: 'On Mattu Pongal, do not make cattle work — it is their day of rest, celebration, and gratitude.',
      hi: 'मट्टू पोंगल पर पशुओं से काम न लें — यह उनके विश्राम, उत्सव और कृतज्ञता का दिन है।',
      sa: 'मट्टुपोङ्गले पशून् न कार्यं कारयेत् — इदं तेषां विश्रामोत्सवकृतज्ञतादिनम्।',
    },
  ],

  phala: {
    en: 'Blessings of Surya Bhagavan for a prosperous year, abundant harvest, good health, family unity, and material well-being. Honouring cattle on Mattu Pongal brings agricultural prosperity and the blessings of Nandi. The festival purifies the household, strengthens family bonds, and welcomes the auspicious Uttarayana (northward journey of the Sun).',
    hi: 'समृद्ध वर्ष, भरपूर फसल, अच्छा स्वास्थ्य, पारिवारिक एकता और भौतिक कल्याण के लिए सूर्य भगवान का आशीर्वाद। मट्टू पोंगल पर पशुओं का सम्मान कृषि समृद्धि और नन्दी का आशीर्वाद लाता है। यह उत्सव गृह को शुद्ध करता है, पारिवारिक बन्धन मजबूत करता है, और शुभ उत्तरायण (सूर्य की उत्तरी यात्रा) का स्वागत करता है।',
    sa: 'समृद्धवर्षसमृद्धसस्यस्वास्थ्यकुटुम्बैक्यभौतिककल्याणार्थं सूर्यभगवतः आशीर्वादः। मट्टुपोङ्गले पशुसम्मानं कृषिसमृद्धिं नन्द्याशीर्वादं च आनयति। उत्सवः गृहं शोधयति कुटुम्बबन्धनं सुदृढयति शुभोत्तरायणस्य (सूर्यस्य उत्तरयात्रायाः) स्वागतं करोति च।',
    ta: 'செழிப்பான ஆண்டு, நிறைவான அறுவடை, நல்ல ஆரோக்கியம், குடும்ப ஒற்றுமை, பொருள் நலனுக்கான சூரிய பகவானின் ஆசிகள். மாட்டுப் பொங்கலில் கால்நடைகளைப் போற்றுவது விவசாய செழிப்பையும் நந்தியின் ஆசியையும் தருகிறது. இத்திருவிழா வீட்டைத் தூய்மைப்படுத்துகிறது, குடும்ப பிணைப்பை வலுப்படுத்துகிறது, சுபமான உத்தராயணத்தை (சூரியனின் வடக்கு நோக்கிய பயணம்) வரவேற்கிறது.',
  },
};

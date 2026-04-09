import type { PujaVidhi } from './types';

export const BAISAKHI_PUJA: PujaVidhi = {
  festivalSlug: 'baisakhi',
  category: 'festival',
  deity: { en: 'Surya & Waheguru', hi: 'सूर्य एवं वाहेगुरु', sa: 'सूर्यः वाहेगुरुश्च' },

  samagri: [
    { name: { en: 'Wheat sheaves (freshly harvested)', hi: 'गेहूँ की बालियाँ (ताज़ी कटी)', sa: 'गोधूमशिखराणि (नवकर्तितानि)' }, category: 'other', essential: true },
    { name: { en: 'Jaggery (gur)', hi: 'गुड़', sa: 'गुडम्' }, category: 'food', essential: true },
    { name: { en: 'Mustard oil lamp', hi: 'सरसों तेल का दीपक', sa: 'सर्षपतैलदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Marigold garlands', hi: 'गेंदे की मालाएँ', sa: 'स्थलपद्ममालाः' }, category: 'flowers', essential: true },
    { name: { en: 'Fresh lassi or buttermilk', hi: 'ताजी लस्सी या छाछ', sa: 'नवतक्रम् (लस्सी)' }, category: 'food', essential: false },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम', sa: 'कुङ्कुमम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items', essential: true },
    { name: { en: 'Fresh fruits (seasonal)', hi: 'ताज़े फल (मौसमी)', sa: 'नवानि ऋतुफलानि' }, category: 'food', essential: true },
    { name: { en: 'Kada Prasad ingredients (wheat flour, ghee, sugar)', hi: 'कड़ा प्रसाद सामग्री (गेहूँ का आटा, घी, चीनी)', sa: 'कडाप्रसादसामग्री (गोधूमचूर्णं घृतं शर्करा)' }, category: 'food', essential: true },
    { name: { en: 'New clothes (preferably bright colours)', hi: 'नए कपड़े (चमकीले रंग)', sa: 'नववस्त्राणि (उज्ज्वलवर्णानि)' }, category: 'clothing', essential: false },
    { name: { en: 'Ghee lamp', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, category: 'food', essential: false },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Baisakhi falls on April 13 or 14 each year, marking the first day of the Vaisakh month in the Vikram Samvat calendar. The main puja is performed at sunrise. In Sikh tradition, the day commemorates the founding of the Khalsa Panth by Guru Gobind Singh Ji in 1699 at Anandpur Sahib. Celebrations begin at dawn and continue throughout the day with Nagar Kirtan processions.',
    hi: 'बैसाखी प्रत्येक वर्ष 13 या 14 अप्रैल को आती है, विक्रम सम्वत् कैलेण्डर में वैशाख माह का पहला दिन। मुख्य पूजा सूर्योदय पर की जाती है। सिख परम्परा में यह दिन गुरु गोबिन्द सिंह जी द्वारा 1699 में आनन्दपुर साहिब में खालसा पन्थ की स्थापना का स्मरण कराता है। उत्सव भोर से शुरू होकर पूरे दिन नगर कीर्तन शोभायात्राओं के साथ जारी रहते हैं।',
    sa: 'बैसाखी प्रतिवर्षम् अप्रैलमासस्य १३ अथवा १४ दिनाङ्के आगच्छति, विक्रमसम्वत्पञ्चाङ्गे वैशाखमासस्य प्रथमदिनम्। प्रधानपूजा सूर्योदये क्रियते। सिखपरम्परायां इदं दिनं गुरुगोबिन्दसिंहमहोदयेन १६९९ वर्षे आनन्दपुरसाहिबे खालसापन्थस्य स्थापनां स्मारयति। उत्सवः प्रभातात् आरभ्य सम्पूर्णदिनं नगरकीर्तनशोभायात्राभिः प्रवर्तते।',
  },
  muhurtaWindow: { type: 'brahma_muhurta' },

  sankalpa: {
    en: 'On this auspicious day of Baisakhi, the beginning of the new harvest year, I offer my gratitude to the divine for the golden harvest of wheat. I pray for continued abundance, prosperity, and harmony for my family and community. I honour the courage and sacrifice of the Khalsa tradition.',
    hi: 'इस शुभ बैसाखी के दिन, नई फसल वर्ष के आरम्भ पर, मैं गेहूँ की सुनहरी फसल के लिए ईश्वर को कृतज्ञता अर्पित करता/करती हूँ। मैं अपने परिवार और समुदाय के लिए निरन्तर समृद्धि और सद्भाव की प्रार्थना करता/करती हूँ। मैं खालसा परम्परा के साहस और बलिदान का सम्मान करता/करती हूँ।',
    sa: 'अस्मिन् शुभे बैसाखीदिने नवसस्यवर्षारम्भे गोधूमस्य सुवर्णसस्यार्थं दैवाय कृतज्ञतां समर्पयामि। कुटुम्बस्य समुदायस्य च निरन्तरसमृद्धिसौहार्दार्थं प्रार्थयामि। खालसापरम्परायाः शौर्यत्यागं सम्मानयामि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Early Morning Bath & Preparation', hi: 'प्रातः स्नान एवं तैयारी', sa: 'प्रातःस्नानं सज्जता च' },
      description: {
        en: 'Rise before dawn and take a ritual bath. Wear new or clean bright-coloured clothes — Punjabi men typically wear kurta-pyjama with a colourful turban, women wear bright salwar-kameez or phulkari dupatta. Clean and decorate the house entrance with rangoli patterns. Place wheat sheaves and marigold garlands at the doorway as symbols of the harvest.',
        hi: 'भोर से पहले उठकर स्नान करें। नए या साफ चमकीले रंग के कपड़े पहनें — पंजाबी पुरुष रंगीन पगड़ी के साथ कुर्ता-पायजामा पहनते हैं, महिलाएँ चमकीली सलवार-कमीज़ या फुलकारी दुपट्टा पहनती हैं। घर के प्रवेश द्वार को रंगोली से सजाएँ। फसल के प्रतीक के रूप में द्वार पर गेहूँ की बालियाँ और गेंदे की मालाएँ लगाएँ।',
        sa: 'प्रभातात् पूर्वम् उत्थाय विधिवत् स्नायात्। नवानि शुभ्राणि उज्ज्वलवर्णवस्त्राणि धारयेत्। गृहद्वारं रङ्गवल्ल्या सज्जयेत्। सस्यप्रतीकरूपेण द्वारे गोधूमशिखराणि स्थलपद्ममालाश्च स्थापयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Surya Puja — Gratitude to the Sun', hi: 'सूर्य पूजा — सूर्य को कृतज्ञता', sa: 'सूर्यपूजा — सूर्याय कृतज्ञता' },
      description: {
        en: 'Face east at sunrise and offer water (arghya) to the Sun with both hands. Place a kalash (sacred pot) with mango leaves and a coconut on a clean altar. Light the ghee lamp and incense. Offer akshat, kumkum, flowers, and fruits. Chant the Surya Namaskar mantras and the Gayatri Mantra. Thank Surya Devata for ripening the wheat harvest and sustaining all life.',
        hi: 'सूर्योदय पर पूर्व दिशा में मुख करके दोनों हाथों से सूर्य को जल (अर्घ्य) अर्पित करें। स्वच्छ वेदी पर आम के पत्तों और नारियल सहित कलश स्थापित करें। घी का दीपक और अगरबत्ती जलाएँ। अक्षत, कुमकुम, फूल और फल अर्पित करें। सूर्य नमस्कार मन्त्र और गायत्री मन्त्र का जाप करें। गेहूँ की फसल पकाने और सम्पूर्ण जीवन के पालन के लिए सूर्य देवता का धन्यवाद करें।',
        sa: 'सूर्योदये पूर्वाभिमुखः उभयहस्ताभ्यां सूर्याय अर्घ्यं दद्यात्। शुद्धवेदिकायां आम्रपत्रनारिकेलसहितं कलशं स्थापयेत्। घृतदीपं धूपं च प्रज्वालयेत्। अक्षतान् कुङ्कुमं पुष्पाणि फलानि च समर्पयेत्। सूर्यनमस्कारमन्त्रान् गायत्रीमन्त्रं च जपेत्। गोधूमसस्यपाचनाय सर्वजीवपोषणाय च सूर्यदेवतायै धन्यवादं वदेत्।',
      },
      mantraRef: 'surya-baisakhi',
      duration: '20 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Gurdwara Visit & Ardas (Sikh Tradition)', hi: 'गुरुद्वारा दर्शन एवं अरदास (सिख परम्परा)', sa: 'गुरुद्वारादर्शनम् अरदासं च (सिखपरम्परा)' },
      description: {
        en: 'Visit the Gurdwara early morning for special Baisakhi prayers. The Guru Granth Sahib Ji is given a ceremonial bath (Prakash). The Granthi recites special shabads commemorating the founding of the Khalsa. The Ardas (congregational prayer) is offered seeking Waheguru\'s blessings. Amrit Sanchar (Khalsa initiation ceremony) may be performed for new initiates. This is the most significant religious observance of the day for the Sikh community.',
        hi: 'विशेष बैसाखी प्रार्थनाओं के लिए सुबह-सुबह गुरुद्वारा जाएँ। गुरु ग्रन्थ साहिब जी को विधिवत् स्नान (प्रकाश) कराया जाता है। ग्रन्थी खालसा स्थापना के शबद पढ़ते हैं। वाहेगुरु का आशीर्वाद माँगते हुए अरदास (सामूहिक प्रार्थना) की जाती है। नए दीक्षितों के लिए अमृत सञ्चार (खालसा दीक्षा संस्कार) हो सकता है। यह सिख समुदाय के लिए दिन का सबसे महत्वपूर्ण धार्मिक अनुष्ठान है।',
        sa: 'विशेषबैसाखीप्रार्थनार्थं प्रातः गुरुद्वारं गच्छेत्। गुरुग्रन्थसाहिबमहोदयाय विधिवत् स्नानम् (प्रकाशम्) कार्यते। ग्रन्थी खालसास्थापनस्य शबदान् पठति। वाहेगुरोः आशीर्वादं याचन् अरदासम् (साङ्घिकप्रार्थना) क्रियते। नवदीक्षितानां कृते अमृतसञ्चारः (खालसादीक्षासंस्कारः) कार्यते। सिखसमुदायस्य कृते इदं दिनस्य प्रधानधार्मिकानुष्ठानम्।',
      },
      duration: '90 min',
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 4,
      title: { en: 'Langar & Community Feast', hi: 'लंगर एवं सामुदायिक भोज', sa: 'लङ्गरम् सामुदायिकभोजनं च' },
      description: {
        en: 'Participate in the community langar (free kitchen) at the Gurdwara where all eat together regardless of caste, creed, or social status. This is a core Sikh value of equality and service (seva). On Baisakhi, the langar is especially grand with traditional Punjabi dishes. In Hindu tradition, families share a festive meal including makki ki roti, sarson ka saag, kheer, and fresh jaggery with wheat preparations.',
        hi: 'गुरुद्वारे में सामुदायिक लंगर (निःशुल्क रसोई) में भाग लें जहाँ सभी जाति, पन्थ या सामाजिक स्थिति की परवाह किए बिना एक साथ भोजन करते हैं। यह समानता और सेवा का मूल सिख मूल्य है। बैसाखी पर लंगर विशेष रूप से भव्य होता है। हिन्दू परम्परा में परिवार मक्की की रोटी, सरसों का साग, खीर और ताज़े गुड़ सहित गेहूँ की तैयारी से उत्सव भोजन करते हैं।',
        sa: 'गुरुद्वारे सामुदायिकलङ्गरे (निःशुल्कपाकशालायाम्) भागं गृह्णीयात् यत्र सर्वे जातिपन्थसामाजिकस्थितिं विना एकत्र भुञ्जते। इदं समानतासेवायाः मूलसिखमूल्यम्। बैसाख्यां लङ्गरं विशेषतः भव्यं भवति। हिन्दूपरम्परायां कुटुम्बाः मक्कीरोटी सर्षपशाकं पायसं नवगुडसहितगोधूमपक्वान्नैश्च उत्सवभोजनं कुर्वन्ति।',
      },
      duration: '60 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Bhangra, Gidda & Mela', hi: 'भांगड़ा, गिद्दा एवं मेला', sa: 'भाङ्गडा गिद्दा मेलश्च' },
      description: {
        en: 'Baisakhi is incomplete without the energetic Bhangra (men\'s harvest dance) and Gidda (women\'s dance). Farmers celebrate the successful wheat harvest with exuberant drumming on the dhol. Visit the Baisakhi mela (fair) with rides, folk performances, wrestling (kushti), and turban-tying competitions. In rural Punjab, this is the highlight of the year. Nagar Kirtan processions (Sikh community processions) pass through the streets with the Guru Granth Sahib carried on a decorated float.',
        hi: 'बैसाखी ऊर्जावान भांगड़ा (पुरुषों का फसल नृत्य) और गिद्दा (महिलाओं का नृत्य) के बिना अधूरी है। किसान ढोल की जोशीली थाप पर गेहूँ की सफल फसल का जश्न मनाते हैं। बैसाखी मेले में झूले, लोक प्रदर्शन, कुश्ती और पगड़ी बाँधने की प्रतियोगिताएँ होती हैं। ग्रामीण पंजाब में यह वर्ष का सबसे बड़ा आयोजन है। नगर कीर्तन शोभायात्राएँ (सिख सामुदायिक शोभायात्राएँ) गलियों से गुज़रती हैं जिनमें गुरु ग्रन्थ साहिब सजे हुए रथ पर विराजित होते हैं।',
        sa: 'बैसाखी ऊर्जावता भाङ्गडानृत्येन (पुरुषाणां सस्यनृत्येन) गिद्दानृत्येन (स्त्रीणां नृत्येन) च विना अपूर्णा। कृषकाः ढोलस्य उत्साहपूर्णवादनेन गोधूमसस्यसिद्धिम् उत्सवयन्ति। बैसाखीमेले दोलाः लोकप्रदर्शनानि मल्लयुद्धं पगडीबन्धनप्रतियोगिताश्च भवन्ति। ग्रामपञ्जाबे इदं वर्षस्य प्रधानम् आयोजनम्। नगरकीर्तनशोभायात्राः विथीभ्यः गच्छन्ति यासु गुरुग्रन्थसाहिबः अलङ्कृतरथे विराजते।',
      },
      duration: '120 min',
      essential: false,
      stepType: 'conclusion',
    },
    {
      step: 6,
      title: { en: 'Evening Aarti & Thanksgiving', hi: 'सायं आरती एवं धन्यवाद', sa: 'सायम् आरात्रिकं धन्यवादश्च' },
      description: {
        en: 'In the evening, perform aarti at the home temple with ghee lamp and camphor. Thank the divine for the year\'s blessings. Distribute Kada Prasad (a halwa made from wheat flour, ghee, and sugar) to all family members and visitors. Elders share stories of the Khalsa\'s founding and Punjab\'s agricultural heritage. End the day with gratitude and prayer for the coming agricultural cycle.',
        hi: 'सायंकाल, घर के मन्दिर में घी के दीपक और कपूर से आरती करें। वर्ष भर के आशीर्वाद के लिए ईश्वर को धन्यवाद दें। सभी परिवारजनों और आगन्तुकों को कड़ा प्रसाद (गेहूँ के आटे, घी और चीनी से बना हलवा) वितरित करें। बड़े-बुज़ुर्ग खालसा की स्थापना और पंजाब की कृषि विरासत की कहानियाँ सुनाएँ। कृतज्ञता और आगामी कृषि चक्र के लिए प्रार्थना के साथ दिन समाप्त करें।',
        sa: 'सायं गृहमन्दिरे घृतदीपकर्पूरेण आरात्रिकं कुर्यात्। वर्षस्य आशीर्वादेभ्यः दैवाय धन्यवादं वदेत्। सर्वेभ्यः कुटुम्बिभ्यः आगन्तुकेभ्यश्च कडाप्रसादम् (गोधूमचूर्णघृतशर्करानिर्मितहल्वा) वितरेत्। ज्येष्ठाः खालसास्थापनस्य पञ्जाबकृषिवारसस्य च कथाः कथयन्ति। कृतज्ञतया आगामिकृषिचक्रार्थं प्रार्थनया च दिनं समापयेत्।',
      },
      duration: '20 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'surya-baisakhi',
      name: { en: 'Gayatri Mantra (for Baisakhi)', hi: 'गायत्री मन्त्र (बैसाखी हेतु)', sa: 'गायत्रीमन्त्रः (बैसाख्यर्थम्)' },
      devanagari: 'ॐ भूर्भुवः स्वः\nतत् सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्',
      iast: 'oṃ bhūrbhuvaḥ svaḥ\ntat saviturvareṇyaṃ\nbhargo devasya dhīmahi\ndhiyo yo naḥ pracodayāt',
      meaning: {
        en: 'We meditate upon the glorious radiance of the divine Savitri (Sun). May that divine light illuminate our intellect and guide us on the righteous path.',
        hi: 'हम दिव्य सवित्री (सूर्य) के गौरवशाली तेज का ध्यान करते हैं। वह दिव्य प्रकाश हमारी बुद्धि को प्रकाशित करे और सत्पथ पर मार्गदर्शन करे।',
        sa: 'सवितुः देवस्य वरेण्यं भर्गः धीमहि। यः नः धियः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times at sunrise on Baisakhi while offering arghya to the Sun',
        hi: 'बैसाखी पर सूर्योदय के समय सूर्य को अर्घ्य देते हुए 108 बार जपें',
        sa: 'बैसाख्यां सूर्योदये सूर्याय अर्घ्यं ददत् अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'mool-mantar',
      name: { en: 'Mool Mantar (Sikh)', hi: 'मूल मन्तर (सिख)', sa: 'मूलमन्त्रः (सिखपरम्परा)' },
      devanagari: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ',
      iast: 'ik oaṅkār sat nām kartā purakh nirbhau nirvair akāl mūrat ajūnī saibhaṅ gur prasād',
      meaning: {
        en: 'There is One God, Truth is His Name, He is the Creator, Without fear, Without enmity, Timeless in form, Beyond birth and death, Self-existent, Known by the Guru\'s grace.',
        hi: 'एक ईश्वर है, सत्य उनका नाम है, वे सृष्टिकर्ता हैं, निर्भय, निर्वैर, अकाल मूर्ति, अजूनी, स्वयम्भू, गुरु की कृपा से ज्ञात।',
        sa: 'एक ईश्वरः, सत्यं तस्य नाम, सः सृष्टिकर्ता, निर्भयः, निर्वैरः, अकालमूर्तिः, अजन्मा, स्वयम्भूः, गुरुप्रसादेन ज्ञेयः।',
      },
      usage: {
        en: 'The foundational Sikh prayer — recite during Baisakhi morning prayers at the Gurdwara',
        hi: 'मूलभूत सिख प्रार्थना — बैसाखी प्रातः प्रार्थना में गुरुद्वारे में पढ़ें',
        sa: 'मूलभूतसिखप्रार्थना — बैसाख्यां प्रातःप्रार्थनायां गुरुद्वारे पठेत्',
      },
    },
  ],

  naivedya: {
    en: 'Kada Prasad (sacred halwa of wheat flour, ghee, and sugar), makki ki roti with sarson ka saag, kheer, fresh jaggery sweets, chole bhature, pinni (ladoo made from desi ghee and wheat flour), and sweet lassi',
    hi: 'कड़ा प्रसाद (गेहूँ के आटे, घी और चीनी का पवित्र हलवा), मक्की की रोटी सरसों के साग के साथ, खीर, ताज़े गुड़ की मिठाई, छोले भटूरे, पिन्नी (देसी घी और गेहूँ के आटे का लड्डू), और मीठी लस्सी',
    sa: 'कडाप्रसादम् (गोधूमचूर्णघृतशर्करानिर्मितं पवित्रहल्वा), मक्कीरोटी सर्षपशाकेन सह, पायसम्, नवगुडमिष्टान्नानि, चणकभटूराणि, पिन्नी (देशीघृतगोधूमचूर्णमोदकम्), मधुरतक्रं च',
  },

  precautions: [
    {
      en: 'Offer gratitude to the land and farmers — Baisakhi is fundamentally a harvest thanksgiving. Do not waste food on this day.',
      hi: 'भूमि और किसानों के प्रति कृतज्ञता व्यक्त करें — बैसाखी मूल रूप से फसल धन्यवाद उत्सव है। इस दिन भोजन बर्बाद न करें।',
      sa: 'भूम्यै कृषकेभ्यश्च कृतज्ञतां वदेत् — बैसाखी मूलतः सस्यधन्यवादोत्सवः। अस्मिन् दिने अन्नं न नाशयेत्।',
    },
    {
      en: 'Respect both Hindu and Sikh traditions — Baisakhi has dual significance. Participate with communal harmony.',
      hi: 'हिन्दू और सिख दोनों परम्पराओं का सम्मान करें — बैसाखी का दोहरा महत्व है। सामुदायिक सद्भाव के साथ भाग लें।',
      sa: 'हिन्दूसिखपरम्परयोः उभयोः सम्मानं कुर्यात् — बैसाख्याः द्विविधं महत्त्वम्। सामुदायिकसौहार्देन भागं गृह्णीयात्।',
    },
    {
      en: 'If visiting a Gurdwara, cover your head and remove shoes before entering. Do not bring tobacco or alcohol.',
      hi: 'यदि गुरुद्वारे जा रहे हैं तो प्रवेश से पहले सिर ढकें और जूते उतारें। तम्बाकू या शराब न लाएँ।',
      sa: 'गुरुद्वारं गच्छन् प्रवेशात् पूर्वं शिरः आवृणुयात् पादुके च अपनयेत्। धूम्रपानं मद्यं वा न आनयेत्।',
    },
    {
      en: 'Share food and prasad generously with neighbours and the less fortunate — the spirit of seva (selfless service) is central to Baisakhi.',
      hi: 'पड़ोसियों और जरूरतमन्दों के साथ उदारतापूर्वक भोजन और प्रसाद बाँटें — सेवा (निःस्वार्थ सेवा) की भावना बैसाखी का केन्द्र है।',
      sa: 'पार्श्ववासिभ्यः दरिद्रेभ्यश्च औदार्येण अन्नं प्रसादं च वितरेत् — सेवाभावना (निःस्वार्थसेवा) बैसाख्याः केन्द्रम्।',
    },
  ],

  phala: {
    en: 'Blessings of Surya Devata for abundant harvests, prosperity, and good health. The divine grace of Waheguru for courage, righteousness, and spiritual growth. Community harmony, family unity, and gratitude for the earth\'s bounty. Starting new ventures on Baisakhi is considered highly auspicious for success.',
    hi: 'भरपूर फसल, समृद्धि और अच्छे स्वास्थ्य के लिए सूर्य देवता का आशीर्वाद। साहस, धार्मिकता और आध्यात्मिक विकास के लिए वाहेगुरु की दिव्य कृपा। सामुदायिक सद्भाव, पारिवारिक एकता और पृथ्वी की उदारता के प्रति कृतज्ञता। बैसाखी पर नए कार्य आरम्भ करना सफलता के लिए अत्यन्त शुभ माना जाता है।',
    sa: 'समृद्धसस्यसमृद्धिस्वास्थ्यार्थं सूर्यदेवतायाः आशीर्वादः। शौर्यधार्मिकताध्यात्मिकविकासार्थं वाहेगुरोः दिव्यकृपा। सामुदायिकसौहार्दं कुटुम्बैक्यं पृथिव्या औदार्ये कृतज्ञता च। बैसाख्यां नवकार्यारम्भः सिद्ध्यर्थम् अत्यन्तशुभः मन्यते।',
  },
};

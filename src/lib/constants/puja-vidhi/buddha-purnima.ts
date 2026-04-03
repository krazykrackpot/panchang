import type { PujaVidhi } from './types';

export const BUDDHA_PURNIMA_PUJA: PujaVidhi = {
  festivalSlug: 'buddha-purnima',
  category: 'festival',
  deity: { en: 'Lord Buddha (Vishnu Avatar)', hi: 'भगवान बुद्ध (विष्णु अवतार)', sa: 'भगवान् बुद्धः (विष्णोः अवतारः)' },

  samagri: [
    { name: { en: 'Buddha idol or image', hi: 'बुद्ध मूर्ति या चित्र', sa: 'बुद्धमूर्तिः अथवा चित्रम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items', essential: true },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items', essential: true },
    { name: { en: 'White flowers (lotus, jasmine)', hi: 'सफ़ेद फूल (कमल, चमेली)', sa: 'श्वेतपुष्पाणि (कमलं मल्लिका)' }, category: 'flowers', essential: true },
    { name: { en: 'Bodhi tree leaves or branch', hi: 'बोधि वृक्ष के पत्ते या शाखा', sa: 'बोधिवृक्षपत्राणि शाखा वा' }, category: 'flowers', essential: true },
    { name: { en: 'Clean water in vessel', hi: 'पात्र में स्वच्छ जल', sa: 'पात्रे शुद्धजलम्' }, category: 'vessels', essential: true },
    { name: { en: 'Fruits', hi: 'फल', sa: 'फलानि' }, category: 'food', essential: true },
    { name: { en: 'Rice (uncooked)', hi: 'चावल (कच्चे)', sa: 'तण्डुलाः' }, category: 'food', essential: true },
    { name: { en: 'Kheer (rice pudding)', hi: 'खीर', sa: 'पायसम्' }, category: 'food', essential: true },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items', essential: false },
    { name: { en: 'Sandalwood paste', hi: 'चन्दन का लेप', sa: 'चन्दनम्' }, category: 'puja_items', essential: false },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Buddha Purnima falls on Vaishakha Purnima. The puja is best performed during Brahma Muhurta (pre-dawn) or early morning hours. Meditation can be done throughout the day, especially during the full moon rise.',
    hi: 'बुद्ध पूर्णिमा वैशाख पूर्णिमा को आती है। पूजा ब्रह्म मुहूर्त (सूर्योदय से पहले) या प्रातःकाल में सर्वोत्तम होती है। ध्यान पूरे दिन किया जा सकता है, विशेषकर पूर्ण चन्द्रोदय के समय।',
    sa: 'बुद्धपूर्णिमा वैशाखपूर्णिमायां भवति। पूजा ब्रह्ममुहूर्ते (सूर्योदयात् पूर्वम्) प्रातःकाले वा श्रेष्ठा। ध्यानं सर्वदिनं कर्तुं शक्यते, विशेषतः पूर्णचन्द्रोदयकाले।',
  },
  muhurtaWindow: { type: 'brahma_muhurta' },

  sankalpa: {
    en: 'On this sacred Vaishakha Purnima (Buddha Purnima), I take refuge in Lord Buddha, the embodiment of compassion and wisdom. I resolve to practice charity, non-violence, and meditation for the welfare of all beings.',
    hi: 'इस पवित्र वैशाख पूर्णिमा (बुद्ध पूर्णिमा) पर, मैं करुणा और ज्ञान के मूर्तिरूप भगवान बुद्ध की शरण लेता/लेती हूँ। मैं सभी प्राणियों के कल्याण के लिए दान, अहिंसा और ध्यान का अभ्यास करने का संकल्प करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे वैशाखपूर्णिमायां (बुद्धपूर्णिमायाम्) करुणाप्रज्ञामूर्तिं भगवन्तं बुद्धं शरणं गच्छामि। सर्वप्राणिकल्याणाय दानम् अहिंसां ध्यानं च आचरितुं सङ्कल्पे।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana & Preparation', hi: 'स्नान एवं तैयारी', sa: 'स्नानं सज्जता च' },
      description: {
        en: 'Wake before dawn, bathe with clean water. Wear white or light-colored clothes as a symbol of purity. Clean the puja area and place a Buddha idol facing East. Arrange flowers, water, and offerings.',
        hi: 'सूर्योदय से पहले जागें, स्वच्छ जल से स्नान करें। पवित्रता के प्रतीक के रूप में सफ़ेद या हल्के रंग के वस्त्र पहनें। पूजा स्थल साफ करें और बुद्ध मूर्ति पूर्वमुखी रखें। फूल, जल और नैवेद्य सजाएँ।',
        sa: 'अरुणोदयात् पूर्वं जागृयात्, शुद्धजलेन स्नायात्। पावित्र्यप्रतीकरूपेण श्वेतानि मृदुवर्णवस्त्राणि वा धारयेत्। पूजास्थलं शोधयेत् बुद्धमूर्तिं पूर्वाभिमुखीं स्थापयेत्। पुष्पाणि जलं नैवेद्यं च विन्यसेत्।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Tisarana (Three Refuges)', hi: 'तिसरण (तीन शरण)', sa: 'त्रिशरणम्' },
      description: {
        en: 'Take the three refuges: Buddham Sharanam Gacchami, Dhammam Sharanam Gacchami, Sangham Sharanam Gacchami. This establishes the spiritual foundation for the puja.',
        hi: 'तीन शरण लें: बुद्धं शरणं गच्छामि, धम्मं शरणं गच्छामि, संघं शरणं गच्छामि। यह पूजा की आध्यात्मिक नींव स्थापित करता है।',
        sa: 'त्रिशरणं गृह्णीयात्: बुद्धं शरणं गच्छामि, धर्मं शरणं गच्छामि, सङ्घं शरणं गच्छामि। एतत् पूजायाः आध्यात्मिकं मूलं स्थापयति।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'invocation',
      mantraRef: 'tisarana',
    },
    {
      step: 3,
      title: { en: 'Offering of Flowers & Light', hi: 'पुष्प एवं दीप अर्पण', sa: 'पुष्पदीपसमर्पणम्' },
      description: {
        en: 'Offer white flowers (especially lotus) to the Buddha idol. Light the ghee lamp and incense. The lamp symbolizes the light of wisdom dispelling the darkness of ignorance.',
        hi: 'बुद्ध मूर्ति पर सफ़ेद फूल (विशेषकर कमल) चढ़ाएँ। घी का दीपक और धूप जलाएँ। दीपक अज्ञान के अन्धकार को दूर करने वाले ज्ञान के प्रकाश का प्रतीक है।',
        sa: 'बुद्धमूर्तौ श्वेतपुष्पाणि (विशेषतः कमलानि) समर्पयेत्। घृतदीपं धूपं च प्रज्वालयेत्। दीपः अज्ञानान्धकारनाशकस्य प्रज्ञाप्रकाशस्य प्रतीकः।',
      },
      duration: '5 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Bathing the Buddha Idol', hi: 'बुद्ध मूर्ति स्नान', sa: 'बुद्धमूर्तिस्नानम्' },
      description: {
        en: 'Gently bathe the Buddha idol with clean water mixed with sandalwood paste. This ritual commemorates the bathing of Prince Siddhartha at birth by the Devas. Dry the idol and adorn with fresh flowers.',
        hi: 'बुद्ध मूर्ति को चन्दन मिश्रित स्वच्छ जल से धीरे-धीरे स्नान कराएँ। यह अनुष्ठान जन्म के समय देवताओं द्वारा राजकुमार सिद्धार्थ के स्नान की स्मृति है। मूर्ति सुखाकर ताज़े फूलों से सजाएँ।',
        sa: 'बुद्धमूर्तिं चन्दनमिश्रितशुद्धजलेन मृदुतया स्नापयेत्। इदम् अनुष्ठानं जन्मसमये देवैः सिद्धार्थराजकुमारस्य स्नापनस्य स्मारकम्। मूर्तिं शोषयित्वा नवपुष्पैः अलङ्करोतु।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Meditation', hi: 'ध्यान', sa: 'ध्यानम्' },
      description: {
        en: 'Sit in a comfortable meditative posture before the Buddha idol. Practice mindfulness meditation (Anapanasati — awareness of breath) for at least 15-30 minutes. Contemplate the Four Noble Truths and the Eightfold Path.',
        hi: 'बुद्ध मूर्ति के सामने आरामदायक ध्यान मुद्रा में बैठें। कम से कम 15-30 मिनट तक सचेतन ध्यान (आनापानसति — श्वास का अवलोकन) का अभ्यास करें। चार आर्य सत्य और अष्टांगिक मार्ग पर चिन्तन करें।',
        sa: 'बुद्धमूर्तेः पुरतः सुखासने ध्यानमुद्रायां उपविशेत्। न्यूनातिन्यूनं पञ्चदशत्रिंशन्निमेषपर्यन्तं सचेतनध्यानम् (आनापानसतिं — प्राणावलोकनम्) अभ्यसेत्। चत्वार्यार्यसत्यानि अष्टाङ्गिकमार्गं च चिन्तयेत्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'meditation',
    },
    {
      step: 6,
      title: { en: 'Chanting & Mantra Japa', hi: 'जप एवं मंत्र पाठ', sa: 'जपः मन्त्रपाठश्च' },
      description: {
        en: 'Chant "Om Mani Padme Hum" 108 times using a mala. Follow with the Buddham Sharanam Gacchami mantra. These sacred syllables invoke compassion and wisdom.',
        hi: '"ॐ मणि पद्मे हुम्" माला पर 108 बार जपें। इसके बाद बुद्धं शरणं गच्छामि मंत्र का पाठ करें। ये पवित्र अक्षर करुणा और ज्ञान का आह्वान करते हैं।',
        sa: '"ॐ मणि पद्मे हूँ" इति मालया अष्टोत्तरशतवारं जपेत्। ततः बुद्धं शरणं गच्छामि मन्त्रं पठेत्। एते पवित्राक्षराः करुणां प्रज्ञां च आवाहयन्ति।',
      },
      duration: '15 min',
      essential: true,
      stepType: 'mantra',
      mantraRef: 'om-mani-padme-hum',
    },
    {
      step: 7,
      title: { en: 'Dana (Charity)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Practice charity (Dana) — feed the poor, donate clothes, give alms to monks. Charity on Buddha Purnima is considered supremely meritorious. Also feed birds and animals.',
        hi: 'दान का अभ्यास करें — गरीबों को भोजन दें, वस्त्र दान करें, भिक्षुओं को भिक्षा दें। बुद्ध पूर्णिमा पर दान सर्वश्रेष्ठ पुण्य माना जाता है। पक्षियों और पशुओं को भी भोजन दें।',
        sa: 'दानम् आचरेत् — दरिद्रान् भोजयेत्, वस्त्राणि दद्यात्, भिक्षुभ्यः भिक्षां दद्यात्। बुद्धपूर्णिमायां दानं सर्वोत्तमपुण्यं मन्यते। पक्षिभ्यः पशुभ्यश्च अन्नं दद्यात्।',
      },
      duration: '30 min',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Naivedya & Conclusion', hi: 'नैवेद्य एवं समापन', sa: 'नैवेद्यं समापनं च' },
      description: {
        en: 'Offer kheer (rice pudding) as naivedya — Sujata offered kheer to Siddhartha before his enlightenment. Distribute prasad to all present. Conclude with a prayer for the welfare of all sentient beings.',
        hi: 'नैवेद्य के रूप में खीर अर्पित करें — सुजाता ने सिद्धार्थ को बोधि प्राप्ति से पहले खीर खिलाई थी। सभी उपस्थितों में प्रसाद बाँटें। सभी प्राणियों के कल्याण की प्रार्थना से समापन करें।',
        sa: 'नैवेद्यरूपेण पायसं समर्पयेत् — सुजातया सिद्धार्थाय बोधेः पूर्वं पायसम् अर्पितम्। सर्वेभ्यः उपस्थितेभ्यः प्रसादं वितरेत्। सर्वसत्त्वकल्याणप्रार्थनया समापयेत्।',
      },
      duration: '10 min',
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'om-mani-padme-hum',
      name: { en: 'Om Mani Padme Hum', hi: 'ॐ मणि पद्मे हुम्', sa: 'ॐ मणि पद्मे हूम्' },
      devanagari: 'ॐ मणि पद्मे हूँ',
      iast: 'oṃ maṇi padme hūṃ',
      meaning: {
        en: 'Om, the jewel in the lotus — a mantra of compassion invoking the blessings of Avalokiteshvara (Chenrezig), embodiment of universal compassion.',
        hi: 'ॐ, कमल में मणि — करुणा का मंत्र जो अवलोकितेश्वर (चेनरेज़िग), सार्वभौमिक करुणा के मूर्तिरूप, का आशीर्वाद आह्वान करता है।',
        sa: 'ॐ, पद्मे मणिः — करुणामन्त्रः यः अवलोकितेश्वरस्य (चेनरेजिगस्य) सार्वभौमकरुणामूर्तेः आशीर्वादम् आवाहयति।',
      },
      usage: {
        en: 'Chant 108 times during meditation for cultivating compassion.',
        hi: 'करुणा विकसित करने के लिए ध्यान के दौरान 108 बार जपें।',
        sa: 'करुणावर्धनाय ध्यानकाले अष्टोत्तरशतवारं जपेत्।',
      },
      japaCount: 108,
    },
    {
      id: 'tisarana',
      name: { en: 'Tisarana (Three Refuges)', hi: 'तिसरण (तीन शरण)', sa: 'त्रिशरणम्' },
      devanagari: 'बुद्धं शरणं गच्छामि।\nधर्मं शरणं गच्छामि।\nसङ्घं शरणं गच्छामि।',
      iast: 'buddhaṃ śaraṇaṃ gacchāmi |\ndharmaṃ śaraṇaṃ gacchāmi |\nsaṅghaṃ śaraṇaṃ gacchāmi |',
      meaning: {
        en: 'I take refuge in the Buddha. I take refuge in the Dharma (teaching). I take refuge in the Sangha (community).',
        hi: 'मैं बुद्ध की शरण लेता/लेती हूँ। मैं धर्म (शिक्षा) की शरण लेता/लेती हूँ। मैं संघ (समुदाय) की शरण लेता/लेती हूँ।',
        sa: 'बुद्धं शरणं गच्छामि। धर्मं शरणं गच्छामि। सङ्घं शरणं गच्छामि।',
      },
      usage: {
        en: 'Recite three times at the beginning of the puja as the foundational invocation.',
        hi: 'पूजा के आरम्भ में मूल आवाहन के रूप में तीन बार पाठ करें।',
        sa: 'पूजारम्भे मूलावाहनरूपेण त्रिवारं पठेत्।',
      },
      japaCount: 3,
    },
    {
      id: 'buddha-vandana',
      name: { en: 'Buddha Vandana', hi: 'बुद्ध वन्दना', sa: 'बुद्धवन्दना' },
      devanagari: 'नमो तस्स भगवतो अरहतो सम्मासम्बुद्धस्स।',
      iast: 'namo tassa bhagavato arahato sammāsambuddhassa |',
      meaning: {
        en: 'Homage to the Blessed One, the Worthy One, the Perfectly Self-Enlightened One.',
        hi: 'उस भगवान, योग्य, सम्यक् सम्बुद्ध को नमस्कार।',
        sa: 'तस्मै भगवते अर्हते सम्यक्सम्बुद्धाय नमः।',
      },
      usage: {
        en: 'Recite as the opening salutation before any Buddhist prayer or meditation.',
        hi: 'किसी भी बौद्ध प्रार्थना या ध्यान से पहले प्रारम्भिक अभिवादन के रूप में पाठ करें।',
        sa: 'कस्यापि बौद्धप्रार्थनायाः ध्यानस्य वा पूर्वं प्रारम्भिकाभिवादनरूपेण पठेत्।',
      },
      japaCount: 3,
    },
  ],

  naivedya: {
    en: 'Kheer (rice pudding) is the primary offering, commemorating Sujata\'s offering to Siddhartha. Also offer fresh fruits, rice, and vegetarian food. Avoid meat, fish, eggs, and alcohol on this day.',
    hi: 'खीर (पायस) प्रमुख नैवेद्य है, जो सिद्धार्थ को सुजाता के भोजन की स्मृति में है। ताज़े फल, चावल और शाकाहारी भोजन भी अर्पित करें। इस दिन मांस, मछली, अण्डे और मदिरा का सेवन न करें।',
    sa: 'पायसं (खीरम्) प्रमुखं नैवेद्यम्, सिद्धार्थाय सुजातायाः भोजनार्पणस्य स्मारकम्। नवफलानि तण्डुलान् शाकाहारभोजनं च समर्पयेत्। अस्मिन् दिने मांसं मत्स्यम् अण्डानि मद्यं च वर्जयेत्।',
  },

  precautions: [
    {
      en: 'Observe strict non-violence (Ahimsa) throughout the day. Do not harm any living being, including insects.',
      hi: 'पूरे दिन कठोर अहिंसा का पालन करें। कीड़ों सहित किसी भी प्राणी को हानि न पहुँचाएँ।',
      sa: 'सर्वदिनं कठोराम् अहिंसाम् आचरेत्। कीटान् सहितं कमपि प्राणिनं मा हिंस्यात्।',
    },
    {
      en: 'Maintain vegetarian diet and avoid intoxicants on Buddha Purnima.',
      hi: 'बुद्ध पूर्णिमा पर शाकाहारी भोजन रखें और नशीले पदार्थों से बचें।',
      sa: 'बुद्धपूर्णिमायां शाकाहारं पालयेत् मादकद्रव्याणि च वर्जयेत्।',
    },
    {
      en: 'Practice mindful speech — avoid gossip, lies, and harsh words. Observe the Five Precepts (Pancha Sila) throughout the day.',
      hi: 'सचेतन वाणी का अभ्यास करें — गपशप, झूठ और कठोर शब्दों से बचें। पूरे दिन पंच शील का पालन करें।',
      sa: 'सचेतनवाचम् अभ्यसेत् — परोक्षनिन्दाम् असत्यं कठोरवचनानि च वर्जयेत्। सर्वदिनं पञ्चशीलम् आचरेत्।',
    },
    {
      en: 'If possible, visit a Buddhist temple (Vihara) or sacred Bodhi tree for group meditation and prayers.',
      hi: 'यदि सम्भव हो, सामूहिक ध्यान और प्रार्थना के लिए बौद्ध मन्दिर (विहार) या पवित्र बोधि वृक्ष के दर्शन करें।',
      sa: 'यदि शक्यं, सामूहिकध्यानप्रार्थनार्थं बौद्धमन्दिरं (विहारम्) पवित्रबोधिवृक्षं वा गच्छेत्।',
    },
  ],

  phala: {
    en: 'Buddha Purnima worship cultivates wisdom, compassion, and inner peace. It destroys negative karma, reduces suffering, and leads the devotee toward enlightenment. Charity on this day yields manifold merit.',
    hi: 'बुद्ध पूर्णिमा की पूजा ज्ञान, करुणा और आन्तरिक शान्ति विकसित करती है। यह नकारात्मक कर्मों का नाश करती है, दुख कम करती है और भक्त को बोधि की ओर ले जाती है। इस दिन दान का अनेक गुणा पुण्य होता है।',
    sa: 'बुद्धपूर्णिमापूजा प्रज्ञां करुणाम् आन्तरिकशान्तिं च विकासयति। दुष्कर्माणि नाशयति, दुःखं न्यूनीकरोति, भक्तं बोधिं प्रति नयति। अस्मिन् दिने दानस्य अनेकगुणं पुण्यं भवति।',
  },
};

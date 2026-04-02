import type { PujaVidhi } from './types';

export const VAT_SAVITRI_PUJA: PujaVidhi = {
  festivalSlug: 'vat-savitri',
  category: 'vrat',
  deity: { en: 'Savitri Devi', hi: 'सावित्री', sa: 'सावित्री' },

  samagri: [
    { name: { en: 'Sacred thread (kalava/mauli)', hi: 'कलावा/मौली (पवित्र धागा)', sa: 'कलावम् (पवित्रसूत्रम्)' }, essential: true, note: { en: 'Red and yellow thread for wrapping around the banyan tree during circumambulation', hi: 'परिक्रमा के दौरान बरगद के पेड़ के चारों ओर लपेटने के लिए लाल और पीला धागा', sa: 'प्रदक्षिणायां वटवृक्षं परितः वेष्टनार्थं रक्तपीतसूत्रम्' } },
    { name: { en: 'Banyan tree (vat vriksha)', hi: 'बरगद का पेड़ (वट वृक्ष)', sa: 'वटवृक्षः' }, essential: true, note: { en: 'The entire puja centres around the banyan tree — it represents eternal life', hi: 'पूरी पूजा बरगद के पेड़ के चारों ओर केन्द्रित है — यह शाश्वत जीवन का प्रतीक है', sa: 'सर्वा पूजा वटवृक्षं केन्द्रीकृत्य — स शाश्वतजीवनस्य प्रतीकः' } },
    { name: { en: 'Water pot (kalash)', hi: 'जल कलश', sa: 'जलकलशः' }, essential: true },
    { name: { en: 'Turmeric and kumkum', hi: 'हल्दी और कुमकुम', sa: 'हरिद्रा कुङ्कुमं च' }, category: 'puja_items' },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items' },
    { name: { en: 'Rice (akshat)', hi: 'अक्षत (चावल)', sa: 'अक्षताः' }, category: 'puja_items' },
    { name: { en: 'Flowers (red and yellow)', hi: 'फूल (लाल और पीले)', sa: 'पुष्पाणि (रक्तपीतानि)' }, category: 'flowers' },
    { name: { en: 'Fruits (banana, coconut)', hi: 'फल (केला, नारियल)', sa: 'फलानि (कदलीफलम्, नारिकेलम्)' }, category: 'food' },
    { name: { en: 'Sweets (for naivedya)', hi: 'मिठाई (नैवेद्य के लिए)', sa: 'मिष्टान्नानि (नैवेद्यार्थम्)' }, category: 'food' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Vat Savitri falls on Jyeshtha Amavasya (new moon in Jyeshtha month) in North Indian tradition, or Jyeshtha Purnima in some regions. The puja is performed in the morning hours at the banyan tree. The fast begins the previous evening.',
    hi: 'वट सावित्री उत्तर भारतीय परम्परा में ज्येष्ठ अमावस्या (ज्येष्ठ माह की अमावस्या) को, कुछ क्षेत्रों में ज्येष्ठ पूर्णिमा को पड़ती है। पूजा प्रातःकाल बरगद के पेड़ पर की जाती है। व्रत पूर्व सन्ध्या से शुरू होता है।',
    sa: 'वटसावित्री उत्तरभारतीयपरम्परायां ज्येष्ठामावास्यायां (ज्येष्ठमासस्य अमावास्यायाम्), कासुचित् प्रदेशेषु ज्येष्ठपूर्णिमायां भवति। पूजा प्रातःकाले वटवृक्षे क्रियते। व्रतं पूर्वसन्ध्यातः आरभते।',
  },

  sankalpa: {
    en: 'On this sacred day, I undertake the Vat Savitri vrat and worship of Savitri Devi at the banyan tree for the long life, health, and prosperity of my husband, and for eternal saubhagya.',
    hi: 'इस पवित्र दिन, मैं अपने पति की दीर्घायु, स्वास्थ्य और समृद्धि तथा शाश्वत सौभाग्य के लिए वट वृक्ष पर सावित्री देवी की पूजा एवं वट सावित्री व्रत का संकल्प करती हूँ।',
    sa: 'अस्मिन् पवित्रदिने पतिदीर्घायुः स्वास्थ्यसमृद्ध्यर्थं शाश्वतसौभाग्याय च वटवृक्षे सावित्रीदेव्याः पूजनं वटसावित्रीव्रतं च अहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Previous Evening — Fast Begins', hi: 'पूर्व सन्ध्या — व्रत आरम्भ', sa: 'पूर्वसन्ध्या — व्रतारम्भः' },
      description: {
        en: 'On the evening before Vat Savitri, eat a light sattvic meal before sunset. Resolve to observe the vrat. Prepare all puja samagri and the sacred thread (kalava).',
        hi: 'वट सावित्री से एक शाम पहले सूर्यास्त से पहले हल्का सात्विक भोजन करें। व्रत का संकल्प लें। सभी पूजा सामग्री और कलावा (पवित्र धागा) तैयार रखें।',
        sa: 'वटसावित्र्याः पूर्वसन्ध्यायां सूर्यास्तात् प्राक् लघु सात्त्विकभोजनं कुर्यात्। व्रतसङ्कल्पं कुर्यात्। सर्वां पूजासामग्रीं कलावं च सज्जयेत्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '20 min',
    },
    {
      step: 2,
      title: { en: 'Morning — Bath & Shringar', hi: 'प्रातः — स्नान एवं श्रृंगार', sa: 'प्रातः — स्नानं शृङ्गारश्च' },
      description: {
        en: 'Wake before sunrise. Take a purifying bath. Wear a red or yellow sari and full saubhagya items (sindoor, bangles, mangalsutra, bindi).',
        hi: 'सूर्योदय से पहले उठें। शुद्धि स्नान करें। लाल या पीली साड़ी और पूरी सौभाग्य सामग्री (सिन्दूर, चूड़ियाँ, मंगलसूत्र, बिन्दी) पहनें।',
        sa: 'सूर्योदयात् प्राक् उत्तिष्ठेत्। शुद्धिस्नानं कुर्यात्। रक्तं पीतं वा वस्त्रं सम्पूर्णसौभाग्यसामग्रीं (सिन्दूरं कङ्कणानि मङ्गलसूत्रं बिन्दिं च) धारयेत्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '20 min',
    },
    {
      step: 3,
      title: { en: 'Reach the Banyan Tree & Sankalpa', hi: 'बरगद के पेड़ तक पहुँचें एवं संकल्प', sa: 'वटवृक्षं प्राप्य सङ्कल्पः' },
      description: {
        en: 'Go to a banyan tree (vat vriksha). Clean the area around the tree. Place the water pot (kalash) near the roots. Take the formal sankalpa holding water and akshat.',
        hi: 'बरगद के पेड़ (वट वृक्ष) के पास जाएँ। पेड़ के चारों ओर सफ़ाई करें। जड़ों के पास जल कलश रखें। जल और अक्षत हाथ में लेकर विधिवत् संकल्प करें।',
        sa: 'वटवृक्षं गच्छेत्। वृक्षपरितः शोधयेत्। मूलेषु जलकलशं स्थापयेत्। जलाक्षतौ गृहीत्वा विधिवत् सङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
      duration: '10 min',
    },
    {
      step: 4,
      title: { en: 'Banyan Tree Worship', hi: 'वट वृक्ष पूजन', sa: 'वटवृक्षपूजनम्' },
      description: {
        en: 'Apply turmeric and kumkum on the trunk of the banyan tree. Offer flowers, akshat, and water at the roots. Light incense and a diya near the tree. The banyan tree itself is worshipped as the embodiment of Brahma, Vishnu, and Shiva.',
        hi: 'बरगद के तने पर हल्दी और कुमकुम लगाएँ। जड़ों पर फूल, अक्षत और जल अर्पित करें। पेड़ के पास अगरबत्ती और दीपक जलाएँ। बरगद का पेड़ स्वयं ब्रह्मा, विष्णु और शिव के रूप में पूजा जाता है।',
        sa: 'वटवृक्षस्य स्कन्धे हरिद्रां कुङ्कुमं च लिम्पेत्। मूलेषु पुष्पाणि अक्षतान् जलं च अर्पयेत्। वृक्षसमीपे धूपं दीपं च प्रज्वालयेत्। वटवृक्षः स्वयं ब्रह्मविष्णुशिवरूपेण पूज्यते।',
      },
      essential: true,
      stepType: 'offering',
      duration: '15 min',
    },
    {
      step: 5,
      title: { en: 'Savitri Mantra Japa', hi: 'सावित्री मन्त्र जप', sa: 'सावित्रीमन्त्रजपः' },
      description: {
        en: 'Chant the Savitri mantra 108 times sitting before the banyan tree. Pray to Savitri Devi for the long life of your husband, just as Savitri won back Satyavan from Yama (the god of death).',
        hi: 'बरगद के पेड़ के सामने बैठकर सावित्री मन्त्र 108 बार जपें। सावित्री देवी से अपने पति की दीर्घायु की प्रार्थना करें, जैसे सावित्री ने यम (मृत्यु के देवता) से सत्यवान को वापस जीता था।',
        sa: 'वटवृक्षस्य पुरतः उपविश्य सावित्रीमन्त्रं १०८ वारं जपेत्। सावित्रीदेव्यै पतिदीर्घायुषे प्रार्थयेत्, यथा सावित्री यमात् सत्यवन्तं पुनः प्राप्तवती।',
      },
      mantraRef: 'savitri-mantra',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 6,
      title: { en: 'Seven Circumambulations (Parikrama)', hi: 'सात परिक्रमा', sa: 'सप्तप्रदक्षिणाः' },
      description: {
        en: 'Circumambulate the banyan tree 7 times, wrapping the sacred thread (kalava) around the trunk with each round. While wrapping, chant the Vat Vriksha mantra. The thread symbolises the binding of your husband\'s life to the eternal banyan tree.',
        hi: 'बरगद के पेड़ की 7 बार परिक्रमा करें, प्रत्येक चक्कर में तने के चारों ओर कलावा (पवित्र धागा) लपेटें। लपेटते हुए वट वृक्ष मन्त्र का जप करें। धागा आपके पति के जीवन को शाश्वत बरगद से बाँधने का प्रतीक है।',
        sa: 'वटवृक्षं सप्तवारं प्रदक्षिणां कुर्यात्, प्रतिवारं स्कन्धे कलावं वेष्टयेत्। वेष्टयन् वटवृक्षमन्त्रं जपेत्। सूत्रं पतिजीवनस्य शाश्वतवटवृक्षेण बन्धनस्य प्रतीकम्।',
      },
      mantraRef: 'vat-vriksha-mantra',
      essential: true,
      stepType: 'offering',
      duration: '15 min',
    },
    {
      step: 7,
      title: { en: 'Savitri-Satyavan Katha', hi: 'सावित्री-सत्यवान कथा', sa: 'सावित्रीसत्यवत्कथा' },
      description: {
        en: 'Read or listen to the story of Savitri and Satyavan from the Mahabharata (Vana Parva). This narrates how the devoted wife Savitri followed Yama into the realm of death and, through her wisdom and devotion, won back her husband\'s life.',
        hi: 'महाभारत (वन पर्व) से सावित्री और सत्यवान की कथा पढ़ें या सुनें। इसमें बताया गया है कि पतिव्रता सावित्री ने यम के पीछे मृत्यु लोक तक जाकर अपनी बुद्धि और भक्ति से अपने पति का जीवन वापस जीता।',
        sa: 'महाभारतस्य (वनपर्वणः) सावित्रीसत्यवत्कथां पठेत् श्रृणुयात् वा। कथायां पतिव्रता सावित्री यमम् अनुगम्य मृत्युलोकं प्राप्य स्वबुद्ध्या भक्त्या च पतिजीवनं पुनः प्राप्तवती इति वर्ण्यते।',
      },
      essential: true,
      stepType: 'meditation',
      duration: '20 min',
    },
    {
      step: 8,
      title: { en: 'Parana — Breaking the Fast', hi: 'पारण — उपवास समाप्ति', sa: 'पारणम् — उपवाससमाप्तिः' },
      description: {
        en: 'After completing the puja and katha, break the fast the next morning after sunrise. Begin with water, then fruits, then a light meal. Receive blessings from the husband and elders.',
        hi: 'पूजा और कथा पूर्ण करने के बाद अगली सुबह सूर्योदय के बाद व्रत तोड़ें। पहले जल, फिर फल, फिर हल्का भोजन लें। पति और बड़ों से आशीर्वाद लें।',
        sa: 'पूजां कथां च सम्पूर्य अग्रिमप्रातः सूर्योदयानन्तरं व्रतं भङ्गयेत्। प्रथमं जलम्, ततो फलानि, ततो लघुभोजनम्। पतिवृद्धेभ्यश्च आशीर्वादं ग्रहणीयम्।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
  ],

  mantras: [
    {
      id: 'savitri-mantra',
      name: { en: 'Savitri Mantra', hi: 'सावित्री मन्त्र', sa: 'सावित्रीमन्त्रः' },
      devanagari: 'ॐ ह्रीं सावित्र्यै नमः',
      iast: 'oṃ hrīṃ sāvitryai namaḥ',
      meaning: {
        en: 'Om, salutations to Goddess Savitri, the epitome of wifely devotion and victory over death.',
        hi: 'ॐ, पतिव्रत धर्म और मृत्यु पर विजय की प्रतीक देवी सावित्री को नमस्कार।',
        sa: 'ॐ, पातिव्रत्यस्य मृत्युविजयस्य च प्रतीकभूतायै सावित्रीदेव्यै नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant 108 times while sitting before the banyan tree during the main puja. This invokes the spirit of Savitri\'s devotion.',
        hi: 'मुख्य पूजा के दौरान बरगद के पेड़ के सामने बैठकर 108 बार जपें। इससे सावित्री की भक्ति का आह्वान होता है।',
        sa: 'प्रधानपूजायां वटवृक्षस्य पुरतः उपविश्य १०८ वारं जपेत्। सावित्र्याः भक्तेः आह्वानं भवति।',
      },
    },
    {
      id: 'vat-vriksha-mantra',
      name: { en: 'Vat Vriksha (Banyan Tree) Mantra', hi: 'वट वृक्ष मन्त्र', sa: 'वटवृक्षमन्त्रः' },
      devanagari: 'वट वृक्षं महापुण्यं सदा हरितपल्लवम्। इष्टदं सर्वभूतानां वटवृक्षं नमाम्यहम्॥',
      iast: 'vaṭa vṛkṣaṃ mahāpuṇyaṃ sadā haritapallavām | iṣṭadaṃ sarvabhūtānāṃ vaṭavṛkṣaṃ namāmyaham ||',
      meaning: {
        en: 'I bow to the banyan tree, supremely meritorious, ever green-leaved, the wish-fulfiller for all beings.',
        hi: 'मैं बरगद के पेड़ को प्रणाम करता/करती हूँ — जो महापुण्यदायी, सदा हरे पत्तों वाला, सभी प्राणियों की इच्छाएँ पूर्ण करने वाला है।',
        sa: 'वटवृक्षं नमामि — महापुण्यं सदाहरितपल्लवं सर्वभूतानाम् इष्टदं च।',
      },
      japaCount: 7,
      usage: {
        en: 'Chant once during each of the 7 circumambulations of the banyan tree while wrapping the sacred thread.',
        hi: 'बरगद के पेड़ की 7 परिक्रमाओं में प्रत्येक चक्कर में एक बार जपें, कलावा लपेटते हुए।',
        sa: 'वटवृक्षस्य सप्तप्रदक्षिणासु प्रतिवारं कलावं वेष्टयन् एकवारं जपेत्।',
      },
    },
  ],

  naivedya: {
    en: 'Offer seasonal fruits, coconut, sweets, and paan at the base of the banyan tree. A special offering of sattu (roasted gram flour) laddoo is traditional in many regions.',
    hi: 'बरगद के पेड़ की जड़ में मौसमी फल, नारियल, मिठाई और पान अर्पित करें। कई क्षेत्रों में सत्तू (भुने चने का आटा) के लड्डू का विशेष भोग परम्परागत है।',
    sa: 'वटवृक्षमूले ऋतुफलानि नारिकेलं मिष्टान्नानि ताम्बूलं च अर्पयेत्। बहुप्रदेशेषु सक्तुलड्डुकानाम् (भृष्टचणकचूर्णस्य) विशेषभोगः पारम्परिकः।',
  },

  precautions: [
    {
      en: 'Do not pluck leaves or break branches of the banyan tree. The tree must be revered, not harmed.',
      hi: 'बरगद के पेड़ की पत्तियाँ न तोड़ें और न शाखाएँ काटें। वृक्ष का सम्मान करना है, हानि नहीं।',
      sa: 'वटवृक्षस्य पत्राणि न छिन्द्यात् शाखाः न भञ्ज्यात्। वृक्षः सम्मान्यः न हन्तव्यः।',
    },
    {
      en: 'The vrat should be observed only by married women (saubhagyavati). Widows and unmarried women traditionally do not observe this vrat.',
      hi: 'यह व्रत केवल विवाहित स्त्रियों (सौभाग्यवती) द्वारा रखा जाता है। विधवा और अविवाहित स्त्रियाँ परम्परागत रूप से यह व्रत नहीं रखतीं।',
      sa: 'एतद्व्रतं केवलं सधवाभिः (सौभाग्यवतीभिः) पाल्यते। विधवाः अविवाहिताश्च पारम्परिकं एतद्व्रतं न पालयन्ति।',
    },
    {
      en: 'Complete all 7 rounds around the banyan tree without breaking the circumambulation. If interrupted, restart from the beginning.',
      hi: 'परिक्रमा बीच में बिना तोड़े बरगद के पेड़ के सभी 7 चक्कर पूरे करें। बाधित होने पर आरम्भ से पुनः करें।',
      sa: 'प्रदक्षिणां मध्ये न भङ्गयित्वा सर्वाः सप्तप्रदक्षिणाः पूरयेत्। बाधिते सति आरम्भात् पुनः कुर्यात्।',
    },
    {
      en: 'Maintain a nirjala (waterless) fast for best merit. If unable, consume only fruits and water.',
      hi: 'सर्वोत्तम पुण्य के लिए निर्जला (जलरहित) व्रत रखें। न कर सकें तो केवल फल और जल लें।',
      sa: 'श्रेष्ठपुण्याय निर्जलव्रतं पालयेत्। न शक्नोति चेत् केवलं फलानि जलं च ग्रहणीयम्।',
    },
  ],

  phala: {
    en: 'Vat Savitri vrat bestows saubhagya (eternal marital auspiciousness), seven lives with the same husband, and protection from widowhood. Just as Savitri brought Satyavan back from Yama, this vrat is believed to protect the husband from untimely death. The Skanda Purana declares that this vrat equals the merit of performing 1000 ashvamedha yagnas.',
    hi: 'वट सावित्री व्रत सौभाग्य (शाश्वत वैवाहिक शुभता), सात जन्म तक उसी पति के साथ रहना, और वैधव्य से रक्षा प्रदान करता है। जैसे सावित्री ने सत्यवान को यम से लौटाया, यह व्रत पति की अकाल मृत्यु से रक्षा करता है। स्कन्द पुराण में कहा गया है कि यह व्रत 1000 अश्वमेध यज्ञों के बराबर पुण्य देता है।',
    sa: 'वटसावित्रीव्रतं सौभाग्यं (शाश्वतवैवाहिकशुभता), सप्तजन्मसु तेनैव पतिना सह वासं, वैधव्यात् रक्षां च ददाति। यथा सावित्री सत्यवन्तं यमात् प्रत्यानीतवती, एतद्व्रतं पतिम् अकालमृत्योः रक्षति। स्कन्दपुराणे उक्तम् एतद्व्रतं सहस्राश्वमेधयज्ञपुण्यसमम्।',
  },

  parana: {
    type: 'next_sunrise',
    description: {
      en: 'Break the fast after sunrise the next morning, following the completion of all puja rituals at the banyan tree',
      hi: 'बरगद के पेड़ पर सभी पूजा अनुष्ठानों के पूर्ण होने के बाद अगली सुबह सूर्योदय के बाद व्रत तोड़ें',
      sa: 'वटवृक्षे सर्वपूजानुष्ठानानां सम्पूर्तिपश्चात् अग्रिमप्रातः सूर्योदयानन्तरं व्रतं भङ्गयेत्',
    },
  },
};

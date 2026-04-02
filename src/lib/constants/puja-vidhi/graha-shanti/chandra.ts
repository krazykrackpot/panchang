import type { PujaVidhi } from '../types';

export const CHANDRA_SHANTI: PujaVidhi = {
  festivalSlug: 'graha-shanti-chandra',
  category: 'graha_shanti',
  deity: { en: 'Chandra (Moon God)', hi: 'चन्द्र देव', sa: 'चन्द्रदेवः' },

  samagri: [
    { name: { en: 'Rice (white, unbroken)', hi: 'चावल (सफ़ेद, अखण्डित)', sa: 'तण्डुलाः (श्वेताः, अखण्डिताः)' }, quantity: '1 kg', essential: true, category: 'food' },
    { name: { en: 'Milk (cow\'s milk)', hi: 'दूध (गाय का)', sa: 'क्षीरम् (गोक्षीरम्)' }, quantity: '1 litre', essential: true, category: 'food' },
    { name: { en: 'White flowers (jasmine / white lotus)', hi: 'सफ़ेद फूल (चमेली / श्वेत कमल)', sa: 'श्वेतपुष्पाणि (मल्लिका / श्वेतपद्मम्)' }, essential: true, category: 'flowers' },
    { name: { en: 'Silver coin or item', hi: 'चाँदी का सिक्का या वस्तु', sa: 'रजतमुद्रा रजतवस्तु वा' }, category: 'puja_items' },
    { name: { en: 'White cloth', hi: 'सफ़ेद वस्त्र', sa: 'श्वेतवस्त्रम्' }, essential: true, category: 'clothing' },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, essential: true, category: 'puja_items' },
    { name: { en: 'Dhoop / Incense (white sandalwood)', hi: 'धूप / अगरबत्ती (श्वेत चन्दन)', sa: 'धूपम् (श्वेतचन्दनम्)' }, category: 'puja_items' },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Chandra Shanti puja is performed on Monday evening during Pradosh Kala (twilight). Performing during Purnima (full moon) Monday is most powerful.',
    hi: 'चन्द्र शान्ति पूजा सोमवार सायं प्रदोष काल में करनी चाहिए। पूर्णिमा के सोमवार को करना सर्वाधिक प्रभावशाली है।',
    sa: 'चन्द्रशान्तिपूजा सोमवासरे सायं प्रदोषकाले कर्तव्या। पूर्णिमासोमवासरे कर्तुं सर्वाधिकप्रभावशालि।',
  },

  sankalpa: {
    en: 'On this sacred Monday, I perform Chandra Graha Shanti puja to pacify the Moon and seek blessings for mental peace, emotional stability, and maternal well-being.',
    hi: 'इस पवित्र सोमवार को, मैं मानसिक शान्ति, भावनात्मक स्थिरता और मातृ कल्याण हेतु चन्द्र ग्रह शान्ति पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रसोमवासरे मानसिकशान्त्यर्थं भावनात्मकस्थिरतायै मातृकल्याणाय च चन्द्रग्रहशान्तिपूजां करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Ritual Bath)', hi: 'स्नान', sa: 'स्नानम्' },
      description: {
        en: 'Bathe in the evening before puja. Wear clean white clothes. Add a few drops of milk to the bathing water for purification.',
        hi: 'पूजा से पहले सायं स्नान करें। स्वच्छ सफ़ेद वस्त्र पहनें। शुद्धि के लिए स्नान के जल में कुछ बूँद दूध मिलाएँ।',
        sa: 'पूजायाः प्राक् सायं स्नानं कुर्यात्। शुचिश्वेतवस्त्राणि धारयेत्। शुद्ध्यर्थं स्नानजले किञ्चित् क्षीरं मिश्रयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing north-east. Hold milk-mixed water in the right palm with white flowers. State your name, gotra, and intention to pacify Chandra graha.',
        hi: 'ईशान दिशा (उत्तर-पूर्व) की ओर मुख कर बैठें। दाहिने हाथ में दूध मिश्रित जल और सफ़ेद फूल लेकर चन्द्र ग्रह शान्ति का संकल्प करें।',
        sa: 'ईशानदिशम् अभिमुखम् उपविशेत्। दक्षिणहस्ते क्षीरमिश्रितजलं श्वेतपुष्पाणि च गृहीत्वा चन्द्रग्रहशान्तिसङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kalash Sthapana', hi: 'कलश स्थापना', sa: 'कलशस्थापनम्' },
      description: {
        en: 'Fill a silver or steel vessel with milk and water. Place white flowers and a silver coin inside. Set on a bed of rice grains covered with white cloth.',
        hi: 'चाँदी या स्टील के पात्र में दूध और जल भरें। सफ़ेद फूल और चाँदी का सिक्का डालें। सफ़ेद वस्त्र से ढके चावल पर रखें।',
        sa: 'रजतपात्रम् इस्पातपात्रं वा क्षीरजलाभ्यां पूरयेत्। श्वेतपुष्पाणि रजतमुद्रां च क्षिपेत्। श्वेतवस्त्रावृततण्डुलोपरि स्थापयेत्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Chandra Avahana (Invocation)', hi: 'चन्द्र आवाहन', sa: 'चन्द्रावाहनम्' },
      description: {
        en: 'Invoke Chandra Deva by lighting the ghee lamp and camphor. Offer white flowers and recite "Om Chandraya Namah" three times.',
        hi: 'घी का दीपक और कपूर जलाकर चन्द्र देव का आवाहन करें। सफ़ेद फूल अर्पित करें और "ॐ चन्द्राय नमः" तीन बार बोलें।',
        sa: 'घृतदीपं कर्पूरं च प्रज्वाल्य चन्द्रदेवम् आवाहयेत्। श्वेतपुष्पाणि अर्पयित्वा "ओं चन्द्राय नमः" इति त्रिवारम् उच्चारयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 5,
      title: { en: 'Chandra Beej Mantra Japa', hi: 'चन्द्र बीज मन्त्र जप', sa: 'चन्द्रबीजमन्त्रजपः' },
      description: {
        en: 'Chant the Chandra Beej Mantra 11,000 times (or 108 times minimum). Use a sphatik (crystal) or pearl mala. Meditate on a cool, silver-white lunar orb.',
        hi: 'चन्द्र बीज मन्त्र 11,000 बार (या न्यूनतम 108 बार) जपें। स्फटिक या मोती की माला का उपयोग करें। शीतल चाँदी-श्वेत चन्द्रमण्डल का ध्यान करें।',
        sa: 'चन्द्रबीजमन्त्रम् एकादशसहस्रवारम् (अथवा न्यूनतम् अष्टोत्तरशतवारम्) जपेत्। स्फटिकमुक्तामालाम् उपयुञ्जीत। शीतलरजतश्वेतचन्द्रमण्डलं ध्यायेत्।',
      },
      mantraRef: 'chandra-beej',
      essential: true,
      stepType: 'mantra',
      duration: '60-90 min',
    },
    {
      step: 6,
      title: { en: 'Dugdha Abhisheka (Milk Offering)', hi: 'दुग्ध अभिषेक', sa: 'दुग्धाभिषेकः' },
      description: {
        en: 'Pour milk over the Shiva Linga or Chandra image while chanting the Chandra Gayatri. The Moon is Shiva\'s crest ornament, so Shiva puja amplifies Chandra shanti.',
        hi: 'चन्द्र गायत्री का जाप करते हुए शिवलिंग या चन्द्र प्रतिमा पर दूध अर्पित करें। चन्द्रमा शिव का शिरोभूषण है, अतः शिव पूजा चन्द्र शान्ति को बढ़ाती है।',
        sa: 'चन्द्रगायत्रीं जपन् शिवलिङ्गोपरि चन्द्रप्रतिमायां वा क्षीरम् अर्पयेत्। चन्द्रः शिवस्य शिरोभूषणम्, अतः शिवपूजा चन्द्रशान्तिं वर्धयति।',
      },
      mantraRef: 'chandra-gayatri',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charitable Giving)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate rice and white cloth to the needy. Offering milk or white sweets to children is also auspicious for Chandra shanti.',
        hi: 'चावल और सफ़ेद वस्त्र ज़रूरतमन्दों को दान करें। बच्चों को दूध या सफ़ेद मिठाई देना भी चन्द्र शान्ति के लिए शुभ है।',
        sa: 'तण्डुलान् श्वेतवस्त्रं च दीनेभ्यः दद्यात्। बालेभ्यः क्षीरं श्वेतमिष्टान्नं वा दातुम् अपि चन्द्रशान्त्यर्थं शुभम्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Final Prayer)', hi: 'प्रार्थना', sa: 'प्रार्थना' },
      description: {
        en: 'Offer final prayers to Chandra for mental calm and emotional balance. Perform namaskar. View the moon if visible and offer mental salutations.',
        hi: 'मानसिक शान्ति और भावनात्मक सन्तुलन हेतु चन्द्र देव को अन्तिम प्रार्थना करें। नमस्कार करें। यदि चन्द्रमा दिखे तो मानसिक प्रणाम करें।',
        sa: 'मानसिकशान्त्यर्थं भावनात्मकसन्तुलनाय च चन्द्रदेवं प्रति अन्तिमां प्रार्थनां कुर्यात्। नमस्कारं कुर्यात्। यदि चन्द्रः दृश्यते तर्हि मानसिकं प्रणामं कुर्यात्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'chandra-beej',
      name: { en: 'Chandra Beej Mantra', hi: 'चन्द्र बीज मन्त्र', sa: 'चन्द्रबीजमन्त्रः' },
      devanagari: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
      iast: 'oṃ śrāṃ śrīṃ śrauṃ saḥ candrāya namaḥ',
      meaning: {
        en: 'Salutations to the Moon God. The seed syllables invoke Chandra\'s cooling, nurturing energy for mental peace, emotional balance, and maternal blessings.',
        hi: 'चन्द्र देव को नमन। बीज अक्षर चन्द्र की शीतल, पोषक ऊर्जा का आवाहन मानसिक शान्ति, भावनात्मक सन्तुलन और मातृ आशीर्वाद हेतु करते हैं।',
        sa: 'चन्द्रदेवाय नमः। बीजाक्षराणि चन्द्रस्य शीतलपोषकऊर्जां मानसिकशान्त्यर्थं भावनात्मकसन्तुलनाय मातृआशीर्वादाय च आवाहयन्ति।',
      },
      japaCount: 11000,
      usage: {
        en: 'Chant 11,000 times for full Chandra shanti; 108 times daily for ongoing remedy',
        hi: 'पूर्ण चन्द्र शान्ति के लिए 11,000 बार जपें; दैनिक उपाय के लिए 108 बार',
        sa: 'पूर्णचन्द्रशान्त्यर्थम् एकादशसहस्रवारं जपेत्; नित्योपचारार्थम् अष्टोत्तरशतवारम्',
      },
    },
    {
      id: 'chandra-gayatri',
      name: { en: 'Chandra Gayatri Mantra', hi: 'चन्द्र गायत्री मन्त्र', sa: 'चन्द्रगायत्रीमन्त्रः' },
      devanagari: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि ।\nतन्नो चन्द्रः प्रचोदयात् ॥',
      iast: 'oṃ kṣīraputrāya vidmahe amṛtattattvāya dhīmahi |\ntanno candraḥ pracodayāt ||',
      meaning: {
        en: 'We meditate on the son of the milk ocean (Chandra), the essence of nectar. May the Moon God illuminate our mind and grant serenity.',
        hi: 'हम क्षीरसागर-पुत्र (चन्द्र) का ध्यान करते हैं, जो अमृत तत्त्व हैं। चन्द्र देव हमारे मन को प्रकाशित करें और शान्ति प्रदान करें।',
        sa: 'क्षीरसागरपुत्रं (चन्द्रम्) अमृततत्त्वं ध्यायामः। चन्द्रदेवः नः मनः प्रकाशयतु शान्तिं च ददातु।',
      },
      japaCount: 108,
      usage: {
        en: 'Recite during milk abhisheka and as a daily prayer for mental peace',
        hi: 'दुग्ध अभिषेक के समय और मानसिक शान्ति के लिए दैनिक प्रार्थना के रूप में जपें',
        sa: 'दुग्धाभिषेकसमये मानसिकशान्त्यर्थं दैनिकप्रार्थनारूपेण च जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer kheer (rice pudding), white sweets, milk-based preparations, and fruits. Serve in a silver or white vessel.',
    hi: 'खीर, सफ़ेद मिठाई, दूध से बने पकवान और फल अर्पित करें। चाँदी या सफ़ेद पात्र में रखें।',
    sa: 'पायसं श्वेतमिष्टान्नानि क्षीरनिर्मितपक्वान्नानि फलानि च अर्पयेत्। रजतपात्रे श्वेतपात्रे वा स्थापयेत्।',
  },

  precautions: [
    {
      en: 'Perform the puja in the evening facing north-east. White is the essential colour — clothes, flowers, and offerings should all be white.',
      hi: 'पूजा सायं ईशान दिशा की ओर मुख कर करें। सफ़ेद रंग आवश्यक है — वस्त्र, फूल और अर्पण सभी सफ़ेद होने चाहिए।',
      sa: 'सायं ईशानदिशम् अभिमुखं पूजां कुर्यात्। श्वेतवर्णः अनिवार्यः — वस्त्राणि पुष्पाणि अर्पणानि च सर्वाणि श्वेतानि भवेयुः।',
    },
    {
      en: 'Avoid anger, arguments, and negative emotions on the puja day. Chandra governs the mind, so mental calm is essential.',
      hi: 'पूजा के दिन क्रोध, विवाद और नकारात्मक भावनाओं से बचें। चन्द्र मन का स्वामी है, अतः मानसिक शान्ति आवश्यक है।',
      sa: 'पूजादिने क्रोधं विवादं नकारात्मकभावनाश्च वर्जयेत्। चन्द्रः मनसः स्वामी, अतः मानसिकशान्तिः अनिवार्या।',
    },
    {
      en: 'Fasting or consuming only milk and fruits on Monday enhances the puja\'s effect.',
      hi: 'सोमवार को उपवास या केवल दूध और फल ग्रहण करने से पूजा का प्रभाव बढ़ता है।',
      sa: 'सोमवासरे उपवासः क्षीरफलमात्रभक्षणं वा पूजायाः प्रभावं वर्धयति।',
    },
  ],

  phala: {
    en: 'Pacifies afflicted Moon. Bestows mental peace, emotional stability, good sleep, relief from anxiety and depression, improved relationships, maternal blessings, and success in water-related ventures.',
    hi: 'पीड़ित चन्द्र को शान्त करता है। मानसिक शान्ति, भावनात्मक स्थिरता, अच्छी नींद, चिन्ता-अवसाद से मुक्ति, बेहतर सम्बन्ध, मातृ आशीर्वाद और जल सम्बन्धी कार्यों में सफलता प्रदान करता है।',
    sa: 'पीडितचन्द्रं शमयति। मानसिकशान्तिं भावनात्मकस्थिरतां सुनिद्रां चिन्ताविषादमुक्तिं सम्बन्धसुधारं मातृआशीर्वादं जलसम्बन्धकार्येषु सफलतां च प्रददाति।',
  },
};

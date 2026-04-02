import type { PujaVidhi } from './types';

export const SANKASHTI_CHATURTHI_PUJA: PujaVidhi = {
  festivalSlug: 'sankashti-chaturthi',
  category: 'vrat',
  deity: { en: 'Lord Ganesha', hi: 'गणेश', sa: 'गणेशः' },

  samagri: [
    { name: { en: 'Ganesha idol or image', hi: 'गणेश मूर्ति या चित्र', sa: 'गणेशमूर्तिः अथवा चित्रम्' }, essential: true },
    { name: { en: 'Modak (sweet dumplings)', hi: 'मोदक', sa: 'मोदकानि' }, category: 'food', note: { en: 'Ganesha\'s favourite — offer 21 modaks if possible', hi: 'गणेश का प्रिय भोग — सम्भव हो तो 21 मोदक अर्पित करें', sa: 'गणेशस्य प्रियभोगः — सम्भवे एकविंशतिः मोदकान् अर्पयेत्' } },
    { name: { en: 'Durva grass (21 blades)', hi: 'दूर्वा (21 तिनके)', sa: 'दूर्वा (एकविंशतिः)' }, category: 'flowers', essential: true, note: { en: 'Three-bladed durva with roots — most essential offering for Ganesha', hi: 'तीन पत्ती वाली दूर्वा जड़ सहित — गणेश का सबसे महत्वपूर्ण अर्पण', sa: 'त्रिपत्रिका समूलदूर्वा — गणेशस्य सर्वप्रधानार्पणम्' } },
    { name: { en: 'Red flowers (hibiscus preferred)', hi: 'लाल फूल (गुड़हल श्रेष्ठ)', sa: 'रक्तपुष्पाणि (जपाकुसुमं श्रेष्ठम्)' }, category: 'flowers' },
    { name: { en: 'Red sandalwood paste (raktachandan)', hi: 'लाल चन्दन', sa: 'रक्तचन्दनम्' }, category: 'puja_items' },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' }, category: 'puja_items' },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' }, category: 'puja_items' },
    { name: { en: 'Camphor', hi: 'कपूर', sa: 'कर्पूरम्' }, category: 'puja_items' },
    { name: { en: 'Jaggery (gur)', hi: 'गुड़', sa: 'गुडम्' }, category: 'food' },
    { name: { en: 'Coconut', hi: 'नारियल', sa: 'नारिकेलम्' }, category: 'food' },
    { name: { en: 'Fruits (banana, pomegranate)', hi: 'फल (केला, अनार)', sa: 'फलानि (कदलीफलम्, दाडिमम्)' }, category: 'food' },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' }, category: 'puja_items' },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Sankashti Chaturthi falls on Krishna Paksha Chaturthi every month. The main puja is performed during Pradosh Kaal (evening twilight). The fast is broken only after moonrise sighting.',
    hi: 'संकष्टी चतुर्थी प्रत्येक माह की कृष्ण पक्ष चतुर्थी को पड़ती है। मुख्य पूजा प्रदोष काल (सायं सन्ध्या) में की जाती है। उपवास केवल चन्द्र दर्शन के बाद तोड़ा जाता है।',
    sa: 'सङ्कष्टीचतुर्थी प्रतिमासं कृष्णपक्षचतुर्थ्यां भवति। प्रधानपूजा प्रदोषकाले (सायंसन्ध्यायाम्) क्रियते। चन्द्रदर्शनानन्तरम् एव व्रतभङ्गनं कुर्यात्।',
  },
  muhurtaWindow: { type: 'pradosh' },

  sankalpa: {
    en: 'On this sacred Sankashti Chaturthi, I undertake this vrat and worship of Lord Ganesha, the remover of all obstacles, for the destruction of difficulties, spiritual merit, and divine grace.',
    hi: 'इस पवित्र संकष्टी चतुर्थी पर, सभी विघ्नों के हर्ता श्री गणेश की पूजा और व्रत का संकल्प करता/करती हूँ — संकटों के नाश, पुण्यप्राप्ति और दिव्य कृपा के लिए।',
    sa: 'अस्यां पवित्रायां सङ्कष्टीचतुर्थ्यां सर्वविघ्नहरस्य श्रीगणेशस्य पूजनं व्रतं च अहं करिष्ये — सङ्कटनाशाय पुण्यसम्पादनाय दिव्यकृपाप्राप्त्यर्थं च।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning — Bath & Fast Begins', hi: 'प्रातः — स्नान एवं व्रत आरम्भ', sa: 'प्रातः — स्नानं व्रतारम्भश्च' },
      description: {
        en: 'Wake before sunrise, take a purifying bath. Resolve to observe the Sankashti Chaturthi vrat. The fast begins at sunrise — consume only water and fruits if needed.',
        hi: 'सूर्योदय से पहले उठें, शुद्धि स्नान करें। संकष्टी चतुर्थी व्रत का संकल्प लें। उपवास सूर्योदय से शुरू होता है — आवश्यकता हो तो केवल जल और फल लें।',
        sa: 'सूर्योदयात् प्राक् उत्तिष्ठेत्, शुद्धिस्नानं कुर्यात्। सङ्कष्टीचतुर्थीव्रतसङ्कल्पं कुर्यात्। व्रतं सूर्योदयात् आरभते — आवश्यकतायां जलं फलानि वा ग्रहणीयम्।',
      },
      essential: true,
      stepType: 'preparation',
      duration: '15 min',
    },
    {
      step: 2,
      title: { en: 'Morning Ganesha Worship', hi: 'प्रातः गणेश पूजन', sa: 'प्रातर्गणेशपूजनम्' },
      description: {
        en: 'Place the Ganesha idol or image on a clean altar. Offer kumkum, akshat, and a few durva blades. Light incense and a diya. This is a brief morning worship before the main evening puja.',
        hi: 'गणेश की मूर्ति या चित्र को स्वच्छ वेदी पर स्थापित करें। कुमकुम, अक्षत और कुछ दूर्वा अर्पित करें। अगरबत्ती और दीपक जलाएँ। यह मुख्य सायं पूजा से पहले की संक्षिप्त पूजा है।',
        sa: 'गणेशमूर्तिं शुचिवेद्याम् उपवेशयेत्। कुङ्कुमम् अक्षतान् दूर्वाः च अर्पयेत्। धूपं दीपं च प्रज्वालयेत्। एषा प्रधानसायंपूजायाः प्राक् संक्षिप्तपूजा।',
      },
      essential: false,
      stepType: 'invocation',
      duration: '10 min',
    },
    {
      step: 3,
      title: { en: 'Daytime — Ganesha Contemplation', hi: 'दिन में — गणेश चिन्तन', sa: 'दिवा — गणेशचिन्तनम्' },
      description: {
        en: 'Spend the day in devotion. Read Ganesha Purana or Ganesha Atharva Shirsha. Chant the Ganesh Beej mantra on a mala (rosary). Maintain a sattvic and pious mindset throughout the day.',
        hi: 'दिन भक्ति में बिताएँ। गणेश पुराण या गणेश अथर्वशीर्ष पढ़ें। माला पर गणेश बीज मन्त्र का जप करें। पूरे दिन सात्विक और धार्मिक मनोवृत्ति बनाए रखें।',
        sa: 'दिनं भक्त्या यापयेत्। गणेशपुराणं गणेशाथर्वशीर्षं वा पठेत्। मालायां गणेशबीजमन्त्रं जपेत्। सर्वं दिनं सात्त्विकधार्मिकमनोवृत्तिं धारयेत्।',
      },
      essential: false,
      stepType: 'meditation',
      duration: 'Daytime',
    },
    {
      step: 4,
      title: { en: 'Evening — Sankalpa', hi: 'सायं — संकल्प', sa: 'सायम् — सङ्कल्पः' },
      description: {
        en: 'Take a fresh bath in the evening. Sit before the altar and take the formal sankalpa by holding water and akshat in the right palm, stating the tithi, purpose, and deity.',
        hi: 'सायंकाल में पुनः स्नान करें। वेदी के सामने बैठकर दाहिने हाथ में जल और अक्षत लेकर तिथि, उद्देश्य और देवता का नाम बोलकर विधिवत् संकल्प लें।',
        sa: 'सायं पुनः स्नानं कुर्यात्। वेद्याः पुरतः उपविश्य दक्षिणहस्ते जलाक्षतान् गृहीत्वा तिथिप्रयोजनदेवतानामोच्चारणपूर्वकं सङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
      duration: '10 min',
    },
    {
      step: 5,
      title: { en: 'Ganesha Panchopachara Puja', hi: 'गणेश पञ्चोपचार पूजा', sa: 'गणेशपञ्चोपचारपूजनम्' },
      description: {
        en: 'Perform the five-fold worship: Gandha (red sandalwood paste), Pushpa (red flowers and 21 durva blades offered one by one), Dhupa (incense), Dipa (ghee lamp), and Naivedya (modak). Each durva blade is offered with "Om Gam Ganapataye Namah".',
        hi: 'पञ्चोपचार पूजा करें: गन्ध (लाल चन्दन), पुष्प (लाल फूल और 21 दूर्वा एक-एक करके), धूप (अगरबत्ती), दीप (घी का दीपक), और नैवेद्य (मोदक)। प्रत्येक दूर्वा "ॐ गं गणपतये नमः" बोलकर अर्पित करें।',
        sa: 'पञ्चोपचारपूजनं कुर्यात्: गन्धम् (रक्तचन्दनम्), पुष्पम् (रक्तपुष्पाणि एकविंशतिदूर्वाश्च एकैकशः), धूपम्, दीपम् (घृतदीपम्), नैवेद्यम् (मोदकानि)। प्रतिदूर्वाम् "ॐ गं गणपतये नमः" इति उच्चार्य अर्पयेत्।',
      },
      mantraRef: 'ganesh-beej',
      essential: true,
      stepType: 'offering',
      duration: '20 min',
    },
    {
      step: 6,
      title: { en: 'Ganesh Gayatri & Japa', hi: 'गणेश गायत्री एवं जप', sa: 'गणेशगायत्री जपश्च' },
      description: {
        en: 'Chant the Ganesh Gayatri mantra 108 times using a rudraksha or crystal mala. Follow with the Vakratunda Mahakaya shloka 11 times. Maintain focus on Ganesha\'s form during the japa.',
        hi: 'रुद्राक्ष या स्फटिक माला से गणेश गायत्री मन्त्र का 108 बार जप करें। इसके बाद वक्रतुण्ड महाकाय श्लोक 11 बार पढ़ें। जप के दौरान गणेश के स्वरूप पर ध्यान केन्द्रित रखें।',
        sa: 'रुद्राक्ष-स्फटिकमालया गणेशगायत्रीमन्त्रं १०८ वारं जपेत्। ततो वक्रतुण्डमहाकायश्लोकम् ११ वारं पठेत्। जपकाले गणेशस्वरूपे ध्यानं केन्द्रीकुर्यात्।',
      },
      mantraRef: 'ganesh-gayatri',
      essential: true,
      stepType: 'mantra',
      duration: '25 min',
    },
    {
      step: 7,
      title: { en: 'Sankashti Katha', hi: 'संकष्टी कथा', sa: 'सङ्कष्टीकथा' },
      description: {
        en: 'Read or listen to the Sankashti Chaturthi Vrat Katha. Each month has a different katha associated with a specific Ganesha form. The katha narrates how Ganesha removed the obstacles of devotees.',
        hi: 'संकष्टी चतुर्थी व्रत कथा पढ़ें या सुनें। प्रत्येक माह की कथा गणेश के एक विशिष्ट स्वरूप से जुड़ी होती है। कथा में बताया जाता है कि गणेश ने कैसे भक्तों के संकट दूर किए।',
        sa: 'सङ्कष्टीचतुर्थीव्रतकथां पठेत् श्रृणुयात् वा। प्रतिमासस्य कथा गणेशस्य विशिष्टस्वरूपेण सम्बद्धा। कथायां गणेशः भक्तानां सङ्कटान् कथम् अपाकरोत् इति वर्ण्यते।',
      },
      essential: true,
      stepType: 'meditation',
      duration: '15 min',
    },
    {
      step: 8,
      title: { en: 'Aarti', hi: 'आरती', sa: 'आरात्रिकम्' },
      description: {
        en: 'Perform the aarti of Lord Ganesha with camphor and ghee lamp. Sing "Sukhkarta Dukhharta" or "Jai Ganesh Deva". Ring the bell and offer the flame to all family members.',
        hi: 'कपूर और घी के दीपक से गणेश की आरती करें। "सुखकर्ता दुःखहर्ता" या "जय गणेश देवा" गाएँ। घण्टी बजाएँ और सभी परिवारजनों को ज्योति दिखाएँ।',
        sa: 'कर्पूरघृतदीपाभ्यां गणेशस्य आरात्रिकं कुर्यात्। "सुखकर्ता दुःखहर्ता" अथवा "जय गणेश देवा" इति गायेत्। घण्टां वादयेत् सर्वपरिजनेभ्यः ज्योतिं प्रदर्शयेत्।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '10 min',
    },
    {
      step: 9,
      title: { en: 'Moon Sighting & Arghya', hi: 'चन्द्र दर्शन एवं अर्घ्य', sa: 'चन्द्रदर्शनम् अर्घ्यं च' },
      description: {
        en: 'Wait for moonrise. Once the moon is visible, offer arghya (water offering) to the moon with akshat, flowers, and kumkum. Chant "Om Somaya Namah" while offering arghya. Sight the moon and bow.',
        hi: 'चन्द्रोदय की प्रतीक्षा करें। चन्द्रमा दिखने पर अक्षत, फूल और कुमकुम सहित चन्द्रमा को अर्घ्य दें। अर्घ्य देते समय "ॐ सोमाय नमः" बोलें। चन्द्रमा के दर्शन कर प्रणाम करें।',
        sa: 'चन्द्रोदयं प्रतीक्षेत। चन्द्रे दृश्ये सति अक्षतपुष्पकुङ्कुमसहितम् अर्घ्यं चन्द्राय दद्यात्। "ॐ सोमाय नमः" इति उच्चारयन् अर्घ्यं दद्यात्। चन्द्रं दृष्ट्वा प्रणमेत्।',
      },
      essential: true,
      stepType: 'offering',
      duration: '10 min',
    },
    {
      step: 10,
      title: { en: 'Parana — Breaking the Fast', hi: 'पारण — उपवास समाप्ति', sa: 'पारणम् — उपवाससमाप्तिः' },
      description: {
        en: 'After sighting the moon and offering arghya, break the fast by consuming modak prasad first, followed by other sattvic food. Share the prasad with family members.',
        hi: 'चन्द्र दर्शन और अर्घ्य के बाद पहले मोदक प्रसाद खाकर उपवास तोड़ें, फिर अन्य सात्विक भोजन लें। परिवारजनों में प्रसाद बाँटें।',
        sa: 'चन्द्रदर्शनार्घ्यानन्तरं प्रथमं मोदकप्रसादं भक्षयित्वा व्रतं भङ्गयेत्, ततः अन्यं सात्त्विकभोजनं ग्रहणीयम्। परिजनेभ्यः प्रसादं वितरेत्।',
      },
      essential: true,
      stepType: 'conclusion',
      duration: '15 min',
    },
  ],

  mantras: [
    {
      id: 'ganesh-beej',
      name: { en: 'Ganesha Beej Mantra', hi: 'गणेश बीज मन्त्र', sa: 'गणेशबीजमन्त्रः' },
      devanagari: 'ॐ गं गणपतये नमः',
      iast: 'oṃ gaṃ gaṇapataye namaḥ',
      meaning: {
        en: 'Om, salutations to Lord Ganapati (Ganesha), the lord of all beings.',
        hi: 'ॐ, सभी प्राणियों के स्वामी भगवान गणपति (गणेश) को नमस्कार।',
        sa: 'ॐ, सर्वगणाधिपतये गणपतये नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Primary mantra for Sankashti Chaturthi. Chant 108 times during puja and while offering each durva blade.',
        hi: 'संकष्टी चतुर्थी का प्रमुख मन्त्र। पूजा के दौरान और प्रत्येक दूर्वा अर्पित करते समय 108 बार जपें।',
        sa: 'सङ्कष्टीचतुर्थ्याः प्रधानमन्त्रः। पूजायां प्रतिदूर्वार्पणे च १०८ वारं जपेत्।',
      },
    },
    {
      id: 'ganesh-gayatri',
      name: { en: 'Ganesha Gayatri Mantra', hi: 'गणेश गायत्री मन्त्र', sa: 'गणेशगायत्रीमन्त्रः' },
      devanagari: 'ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि। तन्नो दन्ती प्रचोदयात्॥',
      iast: 'oṃ ekadantāya vidmahe vakratuṇḍāya dhīmahi | tanno dantī pracodayāt ||',
      meaning: {
        en: 'Om, we meditate upon the single-tusked one, we contemplate the curved-trunk one. May the tusked lord inspire and illuminate us.',
        hi: 'ॐ, हम एकदन्त का ध्यान करते हैं, वक्रतुण्ड का चिन्तन करते हैं। दन्ती हमें प्रेरित और प्रकाशित करें।',
        sa: 'ॐ, एकदन्तं विद्मः, वक्रतुण्डं ध्यायामः। दन्ती नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant during the main evening puja, 108 times with a mala. Especially powerful on Sankashti Chaturthi for removing obstacles.',
        hi: 'मुख्य सायं पूजा के दौरान माला से 108 बार जपें। संकष्टी चतुर्थी पर विघ्न निवारण हेतु विशेष प्रभावी।',
        sa: 'प्रधानसायंपूजायां मालया १०८ वारं जपेत्। सङ्कष्टीचतुर्थ्यां विघ्ननिवारणाय विशेषप्रभावी।',
      },
    },
    {
      id: 'vakratunda',
      name: { en: 'Vakratunda Mahakaya Shloka', hi: 'वक्रतुण्ड महाकाय श्लोक', sa: 'वक्रतुण्डमहाकायश्लोकः' },
      devanagari: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      iast: 'vakratuṇḍa mahākāya sūryakoṭi samaprabha | nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā ||',
      meaning: {
        en: 'O Lord with curved trunk and mighty body, whose radiance equals a crore suns — make all my endeavours free of obstacles, always.',
        hi: 'हे वक्रतुण्ड, महाकाय, करोड़ सूर्यों के समान प्रभावाले — हे देव, मेरे सभी कार्यों को सदा निर्विघ्न कीजिए।',
        sa: 'हे वक्रतुण्ड, महाकाय, सूर्यकोटिसमप्रभ — हे देव, मे सर्वकार्येषु सर्वदा निर्विघ्नं कुरु।',
      },
      japaCount: 11,
      usage: {
        en: 'Recite 11 times after the Gayatri japa. This is the universal Ganesha prayer for obstacle removal.',
        hi: 'गायत्री जप के बाद 11 बार पढ़ें। यह विघ्न निवारण के लिए गणेश की सार्वभौमिक प्रार्थना है।',
        sa: 'गायत्रीजपानन्तरम् ११ वारं पठेत्। एषा विघ्ननिवारणार्थं गणेशस्य सार्वभौमिकी प्रार्थना।',
      },
    },
  ],

  naivedya: {
    en: 'Offer modak (steamed or fried sweet dumplings), laddoo, jaggery, coconut pieces, and seasonal fruits. Modak is the foremost naivedya for Ganesha — no Ganesha puja is complete without it.',
    hi: 'मोदक (भाप में पके या तले मीठे पकौड़े), लड्डू, गुड़, नारियल के टुकड़े और मौसमी फल अर्पित करें। मोदक गणेश का सर्वप्रमुख नैवेद्य है — बिना मोदक के गणेश पूजा अधूरी है।',
    sa: 'मोदकानि (उष्णवाष्पेन पक्वानि तैले वा), लड्डुकानि, गुडं, नारिकेलखण्डानि, ऋतुफलानि च अर्पयेत्। मोदकानि गणेशस्य सर्वप्रधाननैवेद्यम् — मोदकं विना गणेशपूजा न सम्पूर्णा।',
  },

  precautions: [
    {
      en: 'Do not sight the moon on Chaturthi if it is Bhadrapada Shukla Chaturthi (Ganesh Chaturthi) — that specific moon sighting rule applies only to that day, not Sankashti.',
      hi: 'यदि भाद्रपद शुक्ल चतुर्थी (गणेश चतुर्थी) है तो चन्द्रमा न देखें — यह विशेष नियम केवल उसी दिन के लिए है, संकष्टी के लिए नहीं।',
      sa: 'भाद्रपदशुक्लचतुर्थ्यां (गणेशचतुर्थ्याम्) चन्द्रं न पश्येत् — एषः विशेषनियमः तद्दिने एव, न सङ्कष्ट्याम्।',
    },
    {
      en: 'Do not break the fast before sighting the moon. If the moon is not visible due to clouds, wait or break fast after the computed moonrise time.',
      hi: 'चन्द्रमा के दर्शन से पहले व्रत न तोड़ें। यदि बादलों के कारण चन्द्रमा न दिखे तो प्रतीक्षा करें या गणित चन्द्रोदय समय के बाद व्रत तोड़ें।',
      sa: 'चन्द्रदर्शनात् प्राक् व्रतं न भङ्गयेत्। मेघैः चन्द्रो न दृश्यते चेत् प्रतीक्षेत गणितचन्द्रोदयकालानन्तरं वा व्रतं भङ्गयेत्।',
    },
    {
      en: 'Use only three-bladed durva grass with roots. Do not offer broken or dried durva to Ganesha.',
      hi: 'केवल तीन पत्ती वाली जड़ सहित दूर्वा का उपयोग करें। गणेश को टूटी या सूखी दूर्वा अर्पित न करें।',
      sa: 'समूलत्रिपत्रिकादूर्वाम् एव उपयोजयेत्। भग्नां शुष्कां वा दूर्वां गणेशाय न अर्पयेत्।',
    },
    {
      en: 'Maintain strict brahmacharya (celibacy) and sattvic conduct on the day of the vrat.',
      hi: 'व्रत के दिन कड़ा ब्रह्मचर्य और सात्विक आचरण बनाए रखें।',
      sa: 'व्रतदिने कठोरं ब्रह्मचर्यं सात्त्विकाचारं च पालयेत्।',
    },
  ],

  phala: {
    en: 'Observing Sankashti Chaturthi vrat every month for a year bestows the grace of Ganesha and removes all obstacles from life. It grants wisdom, prosperity, and success in all undertakings. The Narada Purana states that this vrat fulfils all desires and the devotee never faces insurmountable difficulties.',
    hi: 'प्रत्येक माह संकष्टी चतुर्थी व्रत का एक वर्ष तक पालन करने से गणेश की कृपा प्राप्त होती है और जीवन से सभी बाधाएँ दूर होती हैं। यह बुद्धि, समृद्धि और सभी कार्यों में सफलता प्रदान करता है। नारद पुराण के अनुसार यह व्रत सभी मनोकामनाएँ पूर्ण करता है और भक्त को कभी अजेय कठिनाइयों का सामना नहीं करना पड़ता।',
    sa: 'प्रतिमासं सङ्कष्टीचतुर्थीव्रतम् एकवर्षं यावत् अनुष्ठितं गणेशकृपां ददाति जीवनात् सर्वविघ्नान् अपनयति। बुद्धिं समृद्धिं सर्वकार्यसिद्धिं च प्रददाति। नारदपुराणे उक्तम् एतद्व्रतं सर्वकामनापूरकं भक्तः अजेयसङ्कटान् न कदापि सम्मुखीकरोतीति।',
  },

  parana: {
    type: 'moonrise',
    description: {
      en: 'Break fast after moonrise sighting',
      hi: 'चन्द्र दर्शन के बाद पारण करें',
      sa: 'चन्द्रदर्शनानन्तरं पारणं कुर्यात्',
    },
  },
};

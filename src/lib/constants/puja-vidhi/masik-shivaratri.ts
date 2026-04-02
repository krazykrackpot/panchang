import type { PujaVidhi } from './types';

export const MASIK_SHIVARATRI_PUJA: PujaVidhi = {
  festivalSlug: 'masik-shivaratri',
  category: 'vrat',
  deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'शिवः' },

  samagri: [
    { name: { en: 'Bilva / Bel leaves', hi: 'बिल्व / बेल पत्र', sa: 'बिल्वपत्राणि' }, essential: true, note: { en: 'Trifoliate leaves most sacred to Shiva', hi: 'तीन पत्तियों वाले पत्ते शिव को अत्यन्त प्रिय', sa: 'त्रिदलपत्राणि शिवस्य अत्यन्तप्रियाणि' } },
    { name: { en: 'Milk (raw, unboiled preferred)', hi: 'दूध (कच्चा, बिना उबला)', sa: 'क्षीरम् (अपक्वं श्रेष्ठम्)' }, essential: true },
    { name: { en: 'Water (Ganga water if available)', hi: 'जल (गंगाजल यदि उपलब्ध हो)', sa: 'जलम् (गङ्गाजलं यदि लभ्यम्)' }, essential: true },
    { name: { en: 'White flowers (jasmine, mogra)', hi: 'सफ़ेद फूल (चमेली, मोगरा)', sa: 'श्वेतपुष्पाणि (मल्लिका)' } },
    { name: { en: 'Dhatura fruit/flower (if available)', hi: 'धतूरा फल/फूल (यदि उपलब्ध हो)', sa: 'धत्तूरफलम्/पुष्पम् (यदि लभ्यम्)' } },
    { name: { en: 'Vibhuti / Bhasma (sacred ash)', hi: 'विभूति / भस्म', sa: 'विभूतिः / भस्म' } },
    { name: { en: 'Rudraksha mala', hi: 'रुद्राक्ष माला', sa: 'रुद्राक्षमाला' } },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Masik Shivaratri falls on Chaturdashi (14th tithi) of Krishna Paksha every month. The Nishita Kala (midnight period) is the most auspicious time for Shiva worship. If unable to stay awake, Pradosh Kala (evening twilight) is the next best.',
    hi: 'मासिक शिवरात्रि प्रत्येक मास की कृष्ण पक्ष की चतुर्दशी (14वीं तिथि) को पड़ती है। निशीथ काल (मध्यरात्रि) शिव पूजा का सर्वोत्तम समय है। यदि जागना सम्भव न हो तो प्रदोष काल (सन्ध्या) अगला उत्तम समय है।',
    sa: 'मासिकशिवरात्रिः प्रतिमासं कृष्णपक्षचतुर्दश्यां भवति। निशीथकालः (मध्यरात्रिः) शिवपूजायाः श्रेष्ठतमः कालः। यदि जागरणम् अशक्यं प्रदोषकालः अनन्तरश्रेष्ठः।',
  },
  muhurtaWindow: { type: 'nishita' },

  sankalpa: {
    en: 'On this Chaturdashi of Krishna Paksha, I observe Masik Shivaratri vrat and worship Lord Shiva with devotion for the destruction of sins, spiritual purification, and attainment of Shiva\'s grace.',
    hi: 'इस कृष्ण पक्ष की चतुर्दशी पर, मैं पापनाश, आध्यात्मिक शुद्धि और शिव कृपा की प्राप्ति के लिए भक्तिपूर्वक मासिक शिवरात्रि व्रत और शिव पूजन का संकल्प करता/करती हूँ।',
    sa: 'अस्यां कृष्णपक्षचतुर्दश्यां पापनाशाय आध्यात्मिकशुद्ध्यर्थं शिवकृपाप्राप्त्यर्थं च भक्त्या मासिकशिवरात्रिव्रतं शिवपूजनं च करोमि।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
      description: {
        en: 'After bathing, sit before the Shiva Linga or image. Hold water in the right palm and take the vow of observing the Masik Shivaratri fast and worship.',
        hi: 'स्नान के बाद शिवलिंग या मूर्ति के सामने बैठें। दाहिने हाथ में जल लेकर मासिक शिवरात्रि व्रत और पूजन का संकल्प लें।',
        sa: 'स्नानानन्तरं शिवलिङ्गस्य मूर्तेः वा पुरतः उपविशेत्। दक्षिणहस्ते जलं गृहीत्वा मासिकशिवरात्रिव्रतपूजनयोः सङ्कल्पं कुर्यात्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 2,
      title: { en: 'Shiva Avahana (Invocation)', hi: 'शिव आवाहन', sa: 'शिवावाहनम्' },
      description: {
        en: 'Invoke Lord Shiva into the Linga or image by ringing the bell and chanting. Apply vibhuti/bhasma to the Linga. Offer flowers at the base.',
        hi: 'घण्टी बजाकर और मन्त्रोच्चार करके शिवलिंग या मूर्ति में शिव का आवाहन करें। लिंग पर विभूति/भस्म लगाएँ। आधार पर फूल अर्पित करें।',
        sa: 'घण्टानादेन मन्त्रोच्चारणेन च शिवलिङ्गे मूर्तौ वा शिवम् आवाहयेत्। लिङ्गे विभूतिं लिम्पेत्। मूले पुष्पाणि अर्पयेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Abhisheka (Milk & Water Bath)', hi: 'अभिषेक (दुग्ध एवं जल स्नान)', sa: 'अभिषेकः (क्षीरजलस्नानम्)' },
      description: {
        en: 'Pour milk slowly over the Shiva Linga while chanting "Om Namah Shivaya." Follow with water (Ganga water if available). The milk should flow continuously over the Linga.',
        hi: '"ॐ नमः शिवाय" का जाप करते हुए शिवलिंग पर धीरे-धीरे दूध चढ़ाएँ। उसके बाद जल (गंगाजल यदि उपलब्ध हो) अर्पित करें। दूध लिंग पर निरन्तर प्रवाहित होना चाहिए।',
        sa: '"ओं नमः शिवाय" इति जपन् शिवलिङ्गोपरि शनैः क्षीरं सिञ्चेत्। ततः जलम् (गङ्गाजलं यदि लभ्यम्) अर्पयेत्। क्षीरं लिङ्गोपरि निरन्तरं प्रवहेत्।',
      },
      mantraRef: 'panchakshari',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 4,
      title: { en: 'Bilva Arpan (Bel Leaf Offering)', hi: 'बिल्व अर्पण (बेल पत्र चढ़ाना)', sa: 'बिल्वार्पणम्' },
      description: {
        en: 'Offer trifoliate bilva leaves on the Shiva Linga with the smooth side facing up. Each leaf represents the three eyes of Shiva, the three gunas, or the trinity. Offer white flowers and dhatura alongside.',
        hi: 'तीन पत्तियों वाले बिल्व पत्र शिवलिंग पर चिकनी सतह ऊपर करके चढ़ाएँ। प्रत्येक पत्ता शिव के तीन नेत्रों, तीन गुणों या त्रिमूर्ति का प्रतीक है। साथ में सफ़ेद फूल और धतूरा भी अर्पित करें।',
        sa: 'त्रिदलबिल्वपत्राणि शिवलिङ्गोपरि श्लक्ष्णपार्श्वं उपरिकृत्य अर्पयेत्। प्रत्येकं पत्रं शिवस्य त्रिनेत्राणां त्रिगुणानां त्रिमूर्तेः वा प्रतीकम्। सह श्वेतपुष्पाणि धत्तूरं च अर्पयेत्।',
      },
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Panchakshari Japa', hi: 'पञ्चाक्षरी जप', sa: 'पञ्चाक्षरीजपः' },
      description: {
        en: 'Chant "Om Namah Shivaya" 108 times using a Rudraksha mala. Sit with eyes closed, focused on Lord Shiva. This is the core mantra practice of Shivaratri.',
        hi: 'रुद्राक्ष माला से "ॐ नमः शिवाय" का 108 बार जप करें। आँखें बन्द कर शिव पर ध्यान केन्द्रित करें। यह शिवरात्रि की मुख्य मन्त्र साधना है।',
        sa: 'रुद्राक्षमालया "ओं नमः शिवाय" इति अष्टोत्तरशतवारं जपेत्। नेत्रे निमील्य शिवे ध्यानं कुर्यात्। एषा शिवरात्रेः मुख्या मन्त्रसाधना।',
      },
      mantraRef: 'panchakshari',
      essential: true,
      stepType: 'mantra',
      duration: '20 min',
    },
    {
      step: 6,
      title: { en: 'Aarti & Conclusion', hi: 'आरती एवं समापन', sa: 'आरती समापनं च' },
      description: {
        en: 'Perform aarti with a ghee or camphor lamp, circling it clockwise before the Shiva Linga. Ring the bell throughout. Offer final prostration (sashtanga namaskar) and pray for Shiva\'s grace.',
        hi: 'शिवलिंग के सामने घी या कपूर के दीपक से दक्षिणावर्त आरती करें। पूरे समय घण्टी बजाते रहें। अन्तिम साष्टांग नमस्कार करें और शिव कृपा की प्रार्थना करें।',
        sa: 'शिवलिङ्गस्य पुरतः घृतकर्पूरदीपेन दक्षिणावर्तम् आरतिं कुर्यात्। सर्वत्र घण्टानादं कुर्यात्। अन्तिमसाष्टाङ्गनमस्कारं कृत्वा शिवकृपायै प्रार्थयेत्।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'panchakshari',
      name: { en: 'Panchakshari Mantra', hi: 'पञ्चाक्षरी मन्त्र', sa: 'पञ्चाक्षरीमन्त्रः' },
      devanagari: 'ॐ नमः शिवाय',
      iast: 'oṃ namaḥ śivāya',
      meaning: {
        en: 'Om, I bow to Lord Shiva. The five syllables (na-maḥ-śi-vā-ya) represent the five elements and five faces of Shiva.',
        hi: 'ॐ, शिव को नमन। पाँच अक्षर (न-मः-शि-वा-य) पंचतत्व और शिव के पाँच मुखों का प्रतीक हैं।',
        sa: 'ओम्, शिवाय नमः। पञ्चाक्षराणि (न-मः-शि-वा-य) पञ्चतत्त्वानां शिवस्य पञ्चमुखानां च प्रतीकानि।',
      },
      japaCount: 108,
      usage: {
        en: 'The supreme Shiva mantra — chant 108 times during abhisheka and japa',
        hi: 'परम शिव मन्त्र — अभिषेक और जप के दौरान 108 बार जपें',
        sa: 'परमशिवमन्त्रः — अभिषेके जपे च अष्टोत्तरशतवारं जपेत्',
      },
    },
    {
      id: 'shiva-gayatri',
      name: { en: 'Shiva Gayatri Mantra', hi: 'शिव गायत्री मन्त्र', sa: 'शिवगायत्रीमन्त्रः' },
      devanagari: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि ।\nतन्नो रुद्रः प्रचोदयात् ॥',
      iast: 'oṃ tatpuruṣāya vidmahe mahādevāya dhīmahi |\ntanno rudraḥ pracodayāt ||',
      meaning: {
        en: 'Om, we meditate on the Supreme Being (Tatpurusha), we contemplate Mahadeva. May Rudra inspire and illuminate us.',
        hi: 'ॐ, हम तत्पुरुष (परमात्मा) का ध्यान करते हैं, महादेव का चिन्तन करते हैं। रुद्र हमें प्रेरित और प्रकाशित करें।',
        sa: 'ओम्, तत्पुरुषं विद्मः, महादेवं ध्यायामः। रुद्रः नः प्रचोदयात्।',
      },
      usage: {
        en: 'Recite 3 or 11 times after the main puja for deeper Shiva meditation',
        hi: 'गहन शिव ध्यान के लिए मुख्य पूजा के बाद 3 या 11 बार जपें',
        sa: 'गभीरशिवध्यानार्थं मुख्यपूजानन्तरं त्रिवारम् एकादशवारं वा जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'Offer fruits, milk-based sweets, or simply milk and water. No grains are offered on Shivaratri vrat. Bhang (cannabis) preparation is traditional in some regions but not mandatory.',
    hi: 'फल, दूध से बनी मिठाइयाँ, या केवल दूध और जल अर्पित करें। शिवरात्रि व्रत में अन्न नहीं चढ़ाया जाता। कुछ क्षेत्रों में भाँग का प्रसाद परम्परा है पर अनिवार्य नहीं।',
    sa: 'फलानि क्षीरपक्वमिष्टान्नानि अथवा क्षीरजलं मात्रम् अर्पयेत्। शिवरात्रिव्रते अन्नं न अर्प्यते। केषुचित् प्रदेशेषु भङ्गप्रसादः परम्परा किन्तु नानिवार्यः।',
  },

  precautions: [
    {
      en: 'Observe a complete fast (nirjala or phalahar) from sunrise on Chaturdashi until the next sunrise.',
      hi: 'चतुर्दशी के सूर्योदय से अगले सूर्योदय तक पूर्ण उपवास (निर्जला या फलाहार) रखें।',
      sa: 'चतुर्दश्याः सूर्योदयात् परसूर्योदयपर्यन्तं पूर्णोपवासं (निर्जलं फलाहारं वा) पालयेत्।',
    },
    {
      en: 'Night vigil (jagaran) is highly meritorious. If full night vigil is not possible, stay awake at least during Nishita Kala (midnight).',
      hi: 'रात्रि जागरण अत्यन्त पुण्यकारी है। यदि पूर्ण जागरण सम्भव न हो तो कम से कम निशीथ काल (मध्यरात्रि) में जागें।',
      sa: 'रात्रिजागरणं अत्यन्तपुण्यकरम्। यदि पूर्णजागरणम् अशक्यं निशीथकाले (मध्यरात्रौ) न्यूनतमं जागृयात्।',
    },
  ],

  parana: {
    type: 'next_sunrise',
    description: {
      en: 'Break the fast after sunrise on Purnima/Pratipada (the day after Chaturdashi). Take a bath and offer prayers before eating.',
      hi: 'पूर्णिमा/प्रतिपदा (चतुर्दशी के अगले दिन) के सूर्योदय के बाद व्रत तोड़ें। भोजन से पहले स्नान और प्रार्थना करें।',
      sa: 'पूर्णिमायां/प्रतिपदायां (चतुर्दश्याः परदिने) सूर्योदयानन्तरं व्रतं भञ्जयेत्। भोजनात् प्राक् स्नानं प्रार्थनां च कुर्यात्।',
    },
  },

  phala: {
    en: 'Lord Shiva\'s grace and blessings, removal of sins and past karma, spiritual purification, and progress toward moksha. Each monthly observance accumulates immense merit.',
    hi: 'शिव की कृपा और आशीर्वाद, पापों और पूर्व कर्मों का नाश, आध्यात्मिक शुद्धि, और मोक्ष की ओर प्रगति। प्रत्येक मासिक पालन से अपार पुण्य संचित होता है।',
    sa: 'शिवस्य कृपा आशीर्वादश्च, पापानां पूर्वकर्मणां च नाशः, आध्यात्मिकशुद्धिः, मोक्षं प्रति प्रगतिश्च। प्रतिमासपालनेन अपारपुण्यं सञ्चीयते।',
  },
};

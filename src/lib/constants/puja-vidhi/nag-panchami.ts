import type { PujaVidhi } from './types';

export const NAG_PANCHAMI_PUJA: PujaVidhi = {
  festivalSlug: 'nag-panchami',
  category: 'vrat',
  deity: { en: 'Naga Devta (Serpent Deities)', hi: 'नाग देवता', sa: 'नागदेवताः' },

  samagri: [
    { name: { en: 'Nag image (drawn on wall with turmeric or clay idol)', hi: 'नाग चित्र (दीवार पर हल्दी से बनाया या मिट्टी की मूर्ति)', sa: 'नागचित्रम् (भित्तौ हरिद्रया रचितं मृन्मूर्तिः वा)' }, note: { en: 'Draw a five-hooded or seven-hooded serpent on a wooden board or wall', hi: 'लकड़ी के तख्ते या दीवार पर पाँच या सात फन वाला नाग बनाएँ', sa: 'काष्ठफलके भित्तौ वा पञ्चफणं सप्तफणं वा नागं रचयेत्' } },
    { name: { en: 'Milk (raw, unboiled)', hi: 'दूध (कच्चा, बिना उबला)', sa: 'क्षीरम् (अपक्वम्)' }, note: { en: 'For offering to the Nag — do NOT feed milk to live snakes', hi: 'नाग को अर्पित करने के लिए — जीवित साँपों को दूध न पिलाएँ', sa: 'नागाय अर्पणार्थम् — जीवद्भ्यः सर्पेभ्यः क्षीरं न दद्यात्' } },
    { name: { en: 'Flowers (white and yellow)', hi: 'फूल (सफ़ेद और पीले)', sa: 'पुष्पाणि (श्वेतपीतानि)' } },
    { name: { en: 'Durva grass (doob grass)', hi: 'दूर्वा घास (दूब)', sa: 'दूर्वा' } },
    { name: { en: 'Turmeric (haldi)', hi: 'हल्दी', sa: 'हरिद्रा' }, note: { en: 'For drawing the nag image and for tilak', hi: 'नाग चित्र बनाने और तिलक के लिए', sa: 'नागचित्ररचनाय तिलकार्थं च' } },
    { name: { en: 'Laddoo (sweet balls — especially besan laddoo)', hi: 'लड्डू (विशेषतः बेसन के लड्डू)', sa: 'लड्डुकानि (विशेषतः चणकसत्तुलड्डुकानि)' } },
    { name: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षताः' } },
    { name: { en: 'Incense sticks', hi: 'अगरबत्ती', sa: 'धूपम्' } },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनम्' } },
    { name: { en: 'Ghee lamp (diya)', hi: 'घी का दीपक', sa: 'घृतदीपः' } },
    { name: { en: 'Kumkum (vermilion)', hi: 'कुमकुम', sa: 'कुङ्कुमम्' } },
    { name: { en: 'Kheer (rice pudding) or pua (fried sweet bread)', hi: 'खीर या पुआ', sa: 'क्षीरान्नम् अथवा पूआ' } },
  ],

  muhurtaType: 'fixed',
  muhurtaDescription: {
    en: 'Nag Panchami falls on Shukla Paksha Panchami (5th day of waxing moon) in Shravan month. The puja should be performed in the morning hours, ideally before noon. Early morning (after sunrise) is considered the most auspicious time.',
    hi: 'नाग पंचमी श्रावण माह की शुक्ल पक्ष पंचमी (बढ़ते चन्द्रमा का 5वाँ दिन) को पड़ती है। पूजा प्रातःकाल में, मध्याह्न से पहले करनी चाहिए। प्रातःकाल (सूर्योदय के बाद) सबसे शुभ समय माना जाता है।',
    sa: 'नागपञ्चमी श्रावणमासस्य शुक्लपक्षपञ्चम्यां (वर्धमानचन्द्रस्य पञ्चमे दिने) भवति। पूजा प्रातःकाले मध्याह्नात् प्राक् कर्तव्या। प्रातःकालः (सूर्योदयानन्तरम्) सर्वशुभतमः कालः मन्यते।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this sacred Nag Panchami, I worship the great serpent deities — Shesha, Vasuki, Takshaka, and all Nagas — for protection from serpent-related fears, removal of Kaal Sarpa Dosha, and the well-being of my family.',
    hi: 'इस पवित्र नाग पंचमी पर, सर्प सम्बन्धी भय से रक्षा, काल सर्प दोष निवारण और परिवार की कुशलता के लिए, मैं महान नाग देवताओं — शेष, वासुकि, तक्षक और सभी नागों — की पूजा करता/करती हूँ।',
    sa: 'अस्मिन् पवित्रे नागपञ्चम्यां सर्पभयनिवारणाय कालसर्पदोषनिवृत्त्यर्थं कुटुम्बकुशलतायै च महानागदेवतानां — शेषस्य, वासुकेः, तक्षकस्य, सर्वनागानां च — पूजनमहं करिष्ये।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Morning Bath & Preparation', hi: 'प्रातः स्नान एवं तैयारी', sa: 'प्रातःस्नानं सज्जता च' },
      description: {
        en: 'Take an early morning bath after sunrise. Wear clean clothes. Clean the puja area near the main door or in the puja room. If performing puja at a snake anthill (termite mound), go there after bathing.',
        hi: 'सूर्योदय के बाद प्रातः स्नान करें। स्वच्छ वस्त्र पहनें। मुख्य द्वार के पास या पूजा कक्ष में पूजा स्थल साफ करें। यदि साँप की बाँबी (दीमक के टीले) पर पूजा करनी हो तो स्नान के बाद वहाँ जाएँ।',
        sa: 'सूर्योदयानन्तरं प्रातः स्नानं कुर्यात्। शुचिवस्त्रं धारयेत्। मुख्यद्वारसमीपे पूजाकक्षे वा पूजास्थलं शोधयेत्। यदि वल्मीके (नागबिले) पूजा कर्तव्या तर्हि स्नानानन्तरं तत्र गच्छेत्।',
      },
      duration: '15 min',
    },
    {
      step: 2,
      title: { en: 'Draw or Install Nag Image', hi: 'नाग चित्र बनाएँ या स्थापित करें', sa: 'नागचित्रं रचयेत् स्थापयेत् वा' },
      description: {
        en: 'Draw a serpent image on the wall or a wooden board using turmeric paste (haldi) or sandalwood paste. Traditionally, a five-hooded (panch-phani) or seven-hooded (sapt-phani) serpent is drawn. Alternatively, use a clay Nag idol. Place it on a clean platform with a white or yellow cloth.',
        hi: 'दीवार या लकड़ी के तख्ते पर हल्दी या चन्दन के लेप से सर्प चित्र बनाएँ। परम्परागत रूप से पाँच फन (पंचफणी) या सात फन (सप्तफणी) वाला नाग बनाया जाता है। वैकल्पिक रूप से मिट्टी की नाग मूर्ति उपयोग करें। स्वच्छ चौकी पर सफ़ेद या पीले कपड़े पर रखें।',
        sa: 'भित्तौ काष्ठफलके वा हरिद्रालेपेन चन्दनलेपेन वा सर्पचित्रं रचयेत्। पारम्पर्येण पञ्चफणं (पञ्चफणिनम्) सप्तफणं (सप्तफणिनम्) वा नागं रचयन्ति। वैकल्पिकरूपेण मृन्नागमूर्तिम् उपयोजयेत्। शुचिवेदिकायां श्वेतपीतवस्त्रोपरि स्थापयेत्।',
      },
      duration: '15 min',
    },
    {
      step: 3,
      title: { en: 'Sankalpa & Invocation of Naga Devtas', hi: 'संकल्प एवं नाग देवताओं का आवाहन', sa: 'सङ्कल्पः नागदेवतानाम् आवाहनं च' },
      description: {
        en: 'Sit before the Nag image. Perform achamana (sip water thrice). Take the sankalpa. Invoke the eight great Nagas by name: Ananta (Shesha), Vasuki, Takshaka, Karkotaka, Padma, Mahapadma, Shankhapala, and Kulika. These are the Ashta Nagas mentioned in the Puranas.',
        hi: 'नाग चित्र के सामने बैठें। आचमन करें (तीन बार जल पिएँ)। संकल्प लें। आठ महानागों का नाम लेकर आवाहन करें: अनन्त (शेष), वासुकि, तक्षक, कर्कोटक, पद्म, महापद्म, शंखपाल और कुलिक। ये पुराणों में वर्णित अष्टनाग हैं।',
        sa: 'नागचित्रस्य पुरतः उपविशेत्। आचमनं कुर्यात् (त्रिवारं जलं पिबेत्)। सङ्कल्पं कुर्यात्। अष्टमहानागानां नामोच्चारणपूर्वकम् आवाहनं कुर्यात्: अनन्तः (शेषः), वासुकिः, तक्षकः, कर्कोटकः, पद्मः, महापद्मः, शङ्खपालः, कुलिकः च। एते पुराणोक्ताः अष्टनागाः।',
      },
      mantraRef: 'nag-mantra',
      duration: '10 min',
    },
    {
      step: 4,
      title: { en: 'Offer Milk to Nag Image', hi: 'नाग चित्र को दूध अर्पित करें', sa: 'नागचित्राय क्षीरम् अर्पयेत्' },
      description: {
        en: 'Pour raw milk gently over the Nag image or at its base. This is the primary offering of Nag Panchami. IMPORTANT: Offer milk to the image/idol only — do NOT feed milk to live snakes as it harms them (snakes are lactose intolerant). If worshipping at a snake anthill, pour milk at the entrance.',
        hi: 'नाग चित्र पर या उसकी जड़ में धीरे-धीरे कच्चा दूध डालें। यह नाग पंचमी का प्रमुख अर्पण है। महत्वपूर्ण: दूध केवल चित्र/मूर्ति को अर्पित करें — जीवित साँपों को दूध न पिलाएँ क्योंकि इससे उन्हें हानि होती है (साँप लैक्टोज़ सहन नहीं कर सकते)। यदि साँप की बाँबी पर पूजा करें तो प्रवेश द्वार पर दूध डालें।',
        sa: 'नागचित्रोपरि तन्मूले वा शनैः अपक्वं क्षीरं सिञ्चेत्। एतत् नागपञ्चम्याः प्रधानम् अर्पणम्। अवधेयम्: क्षीरं चित्राय/मूर्तये एव अर्पयेत् — जीवद्भ्यः सर्पेभ्यः क्षीरं न दद्यात् यतः तेभ्यः हानिकरम् (सर्पाः दुग्धशर्करां न सहन्ते)। वल्मीके पूजायां प्रवेशद्वारे क्षीरं सिञ्चेत्।',
      },
      duration: '5 min',
    },
    {
      step: 5,
      title: { en: 'Offer Flowers, Durva & Sandalwood', hi: 'फूल, दूर्वा एवं चन्दन अर्पित करें', sa: 'पुष्पदूर्वाचन्दनार्पणम्' },
      description: {
        en: 'Offer fresh flowers (white and yellow), durva grass (doob), and sandalwood paste to the Nag image. Apply turmeric and kumkum tilak on the serpent image. Place akshat (unbroken rice) at the base. Light incense sticks and the ghee lamp.',
        hi: 'नाग चित्र को ताज़े फूल (सफ़ेद और पीले), दूर्वा घास (दूब) और चन्दन का लेप अर्पित करें। सर्प चित्र पर हल्दी और कुमकुम का तिलक लगाएँ। जड़ में अक्षत (साबुत चावल) रखें। अगरबत्ती और घी का दीपक जलाएँ।',
        sa: 'नागचित्राय नवीनानि पुष्पाणि (श्वेतपीतानि), दूर्वां, चन्दनं च अर्पयेत्। सर्पचित्रे हरिद्राकुङ्कुमतिलकं कुर्यात्। मूले अक्षतान् स्थापयेत्। धूपं घृतदीपं च प्रज्वालयेत्।',
      },
      duration: '10 min',
    },
    {
      step: 6,
      title: { en: 'Chant Nag Mantras', hi: 'नाग मन्त्र जप', sa: 'नागमन्त्रजपः' },
      description: {
        en: 'Chant the Nag mantra "Om Nagarajaya Namah" 108 times. Then recite the Nag Gayatri. Recite the names of the eight Naga kings. If you know the Sarpa Sukta from the Atharva Veda, recite it. Pray for protection from serpent-related fears and for the removal of Kaal Sarpa Dosha if applicable.',
        hi: 'नाग मन्त्र "ॐ नागराजाय नमः" 108 बार जपें। फिर नाग गायत्री पढ़ें। अष्ट नाग राजाओं के नाम बोलें। यदि आप अथर्ववेद से सर्प सूक्त जानते हैं तो उसका पाठ करें। सर्प सम्बन्धी भय से रक्षा और यदि लागू हो तो काल सर्प दोष निवारण के लिए प्रार्थना करें।',
        sa: 'नागमन्त्रम् "ॐ नागराजाय नमः" इति १०८ वारं जपेत्। ततः नागगायत्रीं पठेत्। अष्टनागराजानां नामानि वदेत्। यदि अथर्ववेदात् सर्पसूक्तं जानाति तर्हि तत् पठेत्। सर्पभयनिवारणाय, कालसर्पदोषनिवृत्त्यर्थं च (यदि प्रयोज्यम्) प्रार्थयेत्।',
      },
      mantraRef: 'nag-mantra',
      duration: '20 min',
    },
    {
      step: 7,
      title: { en: 'Offer Laddoo & Naivedya', hi: 'लड्डू एवं नैवेद्य अर्पण', sa: 'लड्डुकनैवेद्यार्पणम्' },
      description: {
        en: 'Offer laddoos (especially besan laddoo), kheer (rice pudding), and pua (fried sweet bread) to the Nag deities. These are the traditional naivedya items for Nag Panchami. Place them before the Nag image on a banana leaf or clean plate.',
        hi: 'नाग देवताओं को लड्डू (विशेषतः बेसन के लड्डू), खीर और पुआ अर्पित करें। ये नाग पंचमी के पारम्परिक नैवेद्य पदार्थ हैं। इन्हें नाग चित्र के सामने केले के पत्ते या स्वच्छ थाली पर रखें।',
        sa: 'नागदेवताभ्यः लड्डुकानि (विशेषतः चणकसत्तुलड्डुकानि), क्षीरान्नं, पूआं च अर्पयेत्। एतानि नागपञ्चम्याः पारम्परिकनैवेद्यपदार्थानि। नागचित्रस्य पुरतः कदलीपत्रे शुचिपात्रे वा स्थापयेत्।',
      },
      duration: '5 min',
    },
    {
      step: 8,
      title: { en: 'Pradakshina & Namaskara', hi: 'प्रदक्षिणा एवं नमस्कार', sa: 'प्रदक्षिणा नमस्कारश्च' },
      description: {
        en: 'Perform pradakshina (circumambulation) of the Nag image three times. Do a full namaskara (prostration). Pray that the Nag Devtas protect your home from snakes and poisonous creatures. Distribute the prasad (laddoo, kheer) to family members and neighbors. Apply turmeric tilak on the foreheads of all family members.',
        hi: 'नाग चित्र की तीन बार प्रदक्षिणा करें। पूर्ण नमस्कार (दण्डवत प्रणाम) करें। प्रार्थना करें कि नाग देवता आपके घर की साँपों और विषैले जीवों से रक्षा करें। प्रसाद (लड्डू, खीर) परिवारजनों और पड़ोसियों में बाँटें। सभी परिवारजनों के माथे पर हल्दी का तिलक लगाएँ।',
        sa: 'नागचित्रस्य त्रिवारं प्रदक्षिणां कुर्यात्। पूर्णं नमस्कारं (दण्डवत्प्रणामम्) कुर्यात्। प्रार्थयेत् नागदेवताः गृहं सर्पविषजन्तुभ्यः रक्षन्तु। प्रसादं (लड्डुकानि, क्षीरान्नम्) परिजनेभ्यः प्रतिवासिभ्यश्च वितरेत्। सर्वपरिजनानां ललाटे हरिद्रातिलकं कुर्यात्।',
      },
      duration: '10 min',
    },
  ],

  mantras: [
    {
      id: 'nag-mantra',
      name: { en: 'Nag Devta Mantra', hi: 'नाग देवता मन्त्र', sa: 'नागदेवतामन्त्रः' },
      devanagari: 'ॐ नागराजाय नमः',
      iast: 'oṃ nāgarājāya namaḥ',
      meaning: {
        en: 'Om, salutations to the King of Serpents.',
        hi: 'ॐ, सर्पों के राजा को नमन।',
        sa: 'ॐ, नागराजाय नमः।',
      },
      japaCount: 108,
      usage: {
        en: 'Primary Nag Panchami mantra. Chant 108 times while offering milk, flowers, and durva to the Nag image.',
        hi: 'नाग पंचमी का प्रमुख मन्त्र। नाग चित्र को दूध, फूल और दूर्वा अर्पित करते हुए 108 बार जपें।',
        sa: 'नागपञ्चम्याः प्रधानमन्त्रः। नागचित्राय क्षीरपुष्पदूर्वार्पणकाले १०८ वारं जपेत्।',
      },
    },
    {
      id: 'nag-gayatri',
      name: { en: 'Nag Gayatri Mantra', hi: 'नाग गायत्री मन्त्र', sa: 'नागगायत्रीमन्त्रः' },
      devanagari: 'ॐ नागकुलाय विद्महे विषधराय धीमहि। तन्नो नागः प्रचोदयात्॥',
      iast: 'oṃ nāgakulāya vidmahe viṣadharāya dhīmahi | tanno nāgaḥ pracodayāt ||',
      meaning: {
        en: 'Om, we meditate upon the serpent clan, we contemplate the bearer of venom. May the Naga inspire and illuminate us.',
        hi: 'ॐ, हम नागकुल का ध्यान करते हैं, विषधर का चिन्तन करते हैं। नाग हमें प्रेरित और प्रकाशित करें।',
        sa: 'ॐ, नागकुलं विद्मः, विषधरं ध्यायामः। नागः नः प्रचोदयात्।',
      },
      japaCount: 108,
      usage: {
        en: 'Chant after the Nag mantra during the main puja. This Gayatri invokes the spiritual power of the serpent deities.',
        hi: 'मुख्य पूजा के दौरान नाग मन्त्र के बाद जपें। यह गायत्री नाग देवताओं की आध्यात्मिक शक्ति का आवाहन करती है।',
        sa: 'मुख्यपूजायां नागमन्त्रानन्तरं जपेत्। इयं गायत्री नागदेवतानाम् आध्यात्मिकशक्तिम् आवाहयति।',
      },
    },
    {
      id: 'sarpa-sukta-verse',
      name: { en: 'Sarpa Sukta — Invocation Verse', hi: 'सर्प सूक्त — आवाहन श्लोक', sa: 'सर्पसूक्तम् — आवाहनश्लोकः' },
      devanagari: 'नमो अस्तु सर्पेभ्यो ये के च पृथिवीमनु। ये अन्तरिक्षे ये दिवि तेभ्यः सर्पेभ्यो नमः॥',
      iast: 'namo astu sarpebhyo ye ke ca pṛthivīmanu | ye antarikṣe ye divi tebhyaḥ sarpebhyo namaḥ ||',
      meaning: {
        en: 'Salutations to all the serpents — those that dwell on earth, those in the atmosphere, and those in the heavens — to all those serpents, I bow.',
        hi: 'सभी सर्पों को नमन — जो पृथ्वी पर निवास करते हैं, जो अन्तरिक्ष में हैं, और जो स्वर्ग में हैं — उन सभी सर्पों को मेरा प्रणाम।',
        sa: 'सर्वेभ्यः सर्पेभ्यः नमः — ये पृथिव्यां वसन्ति, ये अन्तरिक्षे, ये दिवि — तेभ्यः सर्वेभ्यः सर्पेभ्यः नमः।',
      },
      usage: {
        en: 'This verse from the Atharva Veda is recited during Nag Panchami puja to honor serpents in all three realms — earth, sky, and heaven.',
        hi: 'अथर्ववेद का यह मन्त्र नाग पंचमी पूजा में तीनों लोकों — पृथ्वी, आकाश और स्वर्ग — के सर्पों को सम्मान देने के लिए पढ़ा जाता है।',
        sa: 'अथर्ववेदात् एषः मन्त्रः नागपञ्चमीपूजायां त्रिषु लोकेषु — पृथिव्यां, अन्तरिक्षे, दिवि — स्थितान् सर्पान् सम्मानयितुं पठ्यते।',
      },
    },
  ],

  naivedya: {
    en: 'Offer laddoo (especially besan laddoo), kheer (rice pudding), pua (fried sweet bread), and milk. No fried-in-oil items on this day (some traditions). Fruits may also be offered. The naivedya should be placed on a banana leaf or clean plate before the Nag image.',
    hi: 'लड्डू (विशेषतः बेसन के लड्डू), खीर, पुआ और दूध अर्पित करें। इस दिन तेल में तले पदार्थ नहीं (कुछ परम्पराओं में)। फल भी अर्पित किए जा सकते हैं। नैवेद्य केले के पत्ते या स्वच्छ थाली पर नाग चित्र के सामने रखना चाहिए।',
    sa: 'लड्डुकानि (विशेषतः चणकसत्तुलड्डुकानि), क्षीरान्नं, पूआं, क्षीरं च अर्पयेत्। अस्मिन् दिने तैलपक्वपदार्थाः न (केषुचित् परम्परासु)। फलानि अपि अर्पयितुं शक्यन्ते। नैवेद्यं कदलीपत्रे शुचिपात्रे वा नागचित्रस्य पुरतः स्थापनीयम्।',
  },

  precautions: [
    {
      en: 'Do NOT dig earth, plough fields, or disturb the ground on Nag Panchami. Snakes live underground and this day is dedicated to their protection. Even gardening should be avoided.',
      hi: 'नाग पंचमी पर ज़मीन न खोदें, खेत न जोतें, भूमि को न छेड़ें। साँप भूमिगत रहते हैं और यह दिन उनकी रक्षा को समर्पित है। बागवानी भी न करें।',
      sa: 'नागपञ्चम्यां भूमिं न खनेत्, क्षेत्रं न कर्षेत्, भूमिं न विक्षोभयेत्। सर्पाः भूम्यधः वसन्ति अयं दिनः तेषां रक्षायै समर्पितः। उद्यानकर्मापि वर्जनीयम्।',
    },
    {
      en: 'Do NOT kill or harm any snake on this day — this is a grave sin on Nag Panchami. If you encounter a snake, let it pass peacefully. The day celebrates reverence for serpent life.',
      hi: 'इस दिन किसी भी साँप को न मारें और न ही हानि पहुँचाएँ — नाग पंचमी पर यह गम्भीर पाप है। यदि साँप दिखे तो उसे शान्ति से जाने दें। यह दिन सर्प जीवन के प्रति श्रद्धा का उत्सव है।',
      sa: 'अस्मिन् दिने कमपि सर्पं न हन्यात् न च हिंस्यात् — नागपञ्चम्यां एतत् गुरुपापम्। यदि सर्पः दृश्यते तर्हि शान्त्या गन्तुं ददयात्। अयं दिनः सर्पजीवनस्य श्रद्धोत्सवः।',
    },
    {
      en: 'Do NOT fry food in oil on Nag Panchami. Many traditions prohibit using tava (griddle) and frying pan. Food should be boiled or steamed, not fried.',
      hi: 'नाग पंचमी पर तेल में भोजन न तलें। कई परम्पराओं में तवा और कड़ाही का उपयोग वर्जित है। भोजन उबला या भाप में पका हो, तला नहीं।',
      sa: 'नागपञ्चम्यां तैले अन्नं न पचेत्। बहुपरम्परासु तवा कटाहस्य च उपयोगः निषिद्धः। अन्नम् उत्क्वाथितं वाष्पपक्वं वा स्यात्, न तैलपक्वम्।',
    },
    {
      en: 'Do NOT feed milk to live snakes — this is a common misconception. Snakes are lactose intolerant and feeding them milk causes them suffering and can kill them. Offer milk only to the Nag image or idol.',
      hi: 'जीवित साँपों को दूध न पिलाएँ — यह एक आम ग़लतफ़हमी है। साँप लैक्टोज़ सहन नहीं कर सकते और दूध पिलाने से उन्हें कष्ट होता है और वे मर सकते हैं। दूध केवल नाग चित्र या मूर्ति को अर्पित करें।',
      sa: 'जीवद्भ्यः सर्पेभ्यः क्षीरं न दद्यात् — एषा सामान्या भ्रान्तिः। सर्पाः दुग्धशर्करां न सहन्ते, क्षीरपानेन तेषां कष्टं भवति मृत्युश्च सम्भवति। क्षीरं केवलं नागचित्राय मूर्तये वा अर्पयेत्।',
    },
    {
      en: 'Observe a fast (partial or full) on Nag Panchami. Many devotees eat only once after the puja is completed. The fast enhances the merit of the worship.',
      hi: 'नाग पंचमी पर उपवास (आंशिक या पूर्ण) रखें। कई भक्त पूजा पूर्ण होने के बाद ही एक बार भोजन करते हैं। उपवास पूजा के पुण्य को बढ़ाता है।',
      sa: 'नागपञ्चम्यां व्रतम् (आंशिकं पूर्णं वा) आचरेत्। बहवः भक्ताः पूजासमाप्त्यनन्तरम् एकवारमेव भुञ्जन्ते। व्रतं पूजापुण्यं वर्धयति।',
    },
  ],

  phala: {
    en: 'Nag Panchami worship removes the fear of snakes and snake bites, neutralizes Kaal Sarpa Dosha in the horoscope, and grants the protection of the Naga Devtas. The Garuda Purana states that those who worship Nagas on Panchami are protected from serpent-related harm for the entire year. It also grants fertility, prosperity, and the blessings of Lord Vishnu (who reclines on Shesha Nag).',
    hi: 'नाग पंचमी पूजा साँपों और सर्पदंश के भय को दूर करती है, कुण्डली में काल सर्प दोष को शान्त करती है, और नाग देवताओं की रक्षा प्रदान करती है। गरुड़ पुराण के अनुसार जो पंचमी पर नागों की पूजा करते हैं वे पूरे वर्ष सर्प सम्बन्धी हानि से सुरक्षित रहते हैं। यह सन्तान सुख, समृद्धि और भगवान विष्णु (जो शेषनाग पर विराजमान हैं) का आशीर्वाद भी प्रदान करती है।',
    sa: 'नागपञ्चमीपूजनं सर्पभयसर्पदंशभयं निवारयति, जन्मकुण्डल्यां कालसर्पदोषं शमयति, नागदेवतानां रक्षां च प्रददाति। गरुडपुराणे उक्तं ये पञ्चम्यां नागान् पूजयन्ति ते सर्वं वर्षं सर्पहानितः सुरक्षिताः भवन्ति। सन्तानसुखं समृद्धिं विष्णोः (शेषनागोपरि विराजमानस्य) आशीर्वादं च ददाति।',
  },
};

import type { PujaVidhi } from './types';

export const AMAVASYA_TARPAN_PUJA: PujaVidhi = {
  festivalSlug: 'amavasya-tarpan',
  category: 'vrat',
  deity: { en: 'Pitrs (Ancestors)', hi: 'पितृ देवता', sa: 'पितृदेवताः' },

  samagri: [
    { name: { en: 'Black sesame seeds (til)', hi: 'काले तिल', sa: 'कृष्णतिलाः' }, essential: true },
    { name: { en: 'Kusha / Darbha grass', hi: 'कुशा / दर्भ घास', sa: 'कुशाः / दर्भाः' }, essential: true },
    { name: { en: 'Water vessel (copper or earthen)', hi: 'जल पात्र (ताँबे या मिट्टी का)', sa: 'जलपात्रम् (ताम्रं वा मृण्मयम्)' }, essential: true },
    { name: { en: 'Barley (jau)', hi: 'जौ', sa: 'यवाः' } },
    { name: { en: 'White uncooked rice', hi: 'सफ़ेद कच्चे चावल', sa: 'श्वेततण्डुलाः' } },
    { name: { en: 'White flowers', hi: 'सफ़ेद फूल', sa: 'श्वेतपुष्पाणि' } },
    { name: { en: 'White cloth', hi: 'सफ़ेद कपड़ा', sa: 'श्वेतवस्त्रम्' } },
    { name: { en: 'Sandalwood paste (chandan)', hi: 'चन्दन का लेप', sa: 'चन्दनम्' } },
  ],

  muhurtaType: 'computed',
  muhurtaDescription: {
    en: 'Tarpan is best performed during Kutup/Madhyahna muhurta (midday period) on Amavasya. This is the most auspicious time for ancestor worship as pitrs are believed to be closest during this window.',
    hi: 'तर्पण अमावस्या के कुतुप/मध्याह्न मुहूर्त (दोपहर का समय) में करना सर्वोत्तम है। इस समय पितृ सबसे निकट माने जाते हैं।',
    sa: 'तर्पणं अमावस्यायां कुतुपमध्याह्नमुहूर्ते (मध्यन्दिनकाले) कर्तव्यम्। अस्मिन् काले पितरः समीपतमाः भवन्ति इति विश्वासः।',
  },
  muhurtaWindow: { type: 'madhyahna' },

  sankalpa: {
    en: 'On this Amavasya tithi, I perform tarpan for my departed ancestors — paternal and maternal — seeking their blessings, peace of their souls, and freedom from pitru dosha.',
    hi: 'इस अमावस्या तिथि पर, मैं अपने दिवंगत पितृगण — पैतृक एवं मातृक — के लिए तर्पण करता/करती हूँ, उनके आशीर्वाद, उनकी आत्मा की शान्ति और पितृ दोष से मुक्ति हेतु।',
    sa: 'अस्यां अमावस्यायां तिथौ पितृणां मातृणां च दिवंगतानां निमित्तं तर्पणं करोमि — तेषां आशीर्वादाय आत्मशान्तये पितृदोषनिवारणाय च।',
  },

  vidhiSteps: [
    {
      step: 1,
      title: { en: 'Snana (Purifying Bath)', hi: 'स्नान (शुद्धि स्नान)', sa: 'स्नानम् (शुद्धिस्नानम्)' },
      description: {
        en: 'Take a bath early morning. Wear clean white clothes. Remain in a sattvic, contemplative mood. Avoid eating before completing the tarpan.',
        hi: 'प्रातःकाल स्नान करें। स्वच्छ सफ़ेद वस्त्र पहनें। सात्विक और ध्यानपूर्ण मनःस्थिति में रहें। तर्पण पूर्ण होने तक भोजन न करें।',
        sa: 'प्रातःकाले स्नानं कुर्यात्। शुचिश्वेतवस्त्रं धारयेत्। सात्त्विकध्यानशीलमनसा तिष्ठेत्। तर्पणसमाप्तेः प्राक् भोजनं न कुर्यात्।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 2,
      title: { en: 'Sankalpa (Formal Resolve)', hi: 'संकल्प (विधिवत् प्रतिज्ञा)', sa: 'सङ्कल्पः' },
      description: {
        en: 'Sit facing south. Hold water, black sesame, and kusha grass in the right palm. State your gotra, the names of ancestors (father, grandfather, great-grandfather for paternal; maternal equivalents), the tithi, and the purpose of tarpan.',
        hi: 'दक्षिण दिशा की ओर मुख करके बैठें। दाहिने हाथ में जल, काले तिल और कुशा घास लें। अपना गोत्र, पितृगण के नाम (पिता, पितामह, प्रपितामह; मातृपक्ष के समकक्ष), तिथि और तर्पण का उद्देश्य बोलें।',
        sa: 'दक्षिणाभिमुखः उपविशेत्। दक्षिणहस्ते जलं कृष्णतिलान् कुशांश्च गृह्णीयात्। स्वगोत्रं पितृनामानि (पिता पितामहः प्रपितामहः; मातृपक्षसमाः) तिथिं तर्पणप्रयोजनं च वदेत्।',
      },
      essential: true,
      stepType: 'invocation',
    },
    {
      step: 3,
      title: { en: 'Kusha Pavitri (Ring)', hi: 'कुशा पवित्री (अंगूठी)', sa: 'कुशपवित्रम् (अङ्गुलीयकम्)' },
      description: {
        en: 'Make a ring from two blades of kusha grass and wear it on the ring finger of the right hand. This purifies the offerings and is essential for pitru karma.',
        hi: 'कुशा घास की दो पत्तियों से अँगूठी बनाकर दाहिने हाथ की अनामिका (रिंग फिंगर) में पहनें। यह अर्पण को शुद्ध करती है और पितृ कर्म के लिए अनिवार्य है।',
        sa: 'कुशद्वयेन पवित्रं रचयित्वा दक्षिणहस्तस्य अनामिकायां धारयेत्। एतत् अर्पणं शुद्धं करोति पितृकर्मणि अनिवार्यं च।',
      },
      essential: true,
      stepType: 'preparation',
    },
    {
      step: 4,
      title: { en: 'Tarpan (Water-Sesame Offering)', hi: 'तर्पण (जल-तिल अर्पण)', sa: 'तर्पणम् (जलतिलार्पणम्)' },
      description: {
        en: 'Facing south, pour water mixed with black sesame from the right hand between the thumb and index finger (pitru tirtha). Offer three anjalis (palmfuls) each for father, grandfather, and great-grandfather — then for maternal ancestors. Recite the tarpan mantra with each offering.',
        hi: 'दक्षिण दिशा की ओर मुख करके, दाहिने हाथ के अँगूठे और तर्जनी के बीच से (पितृ तीर्थ) काले तिल मिश्रित जल अर्पित करें। पिता, पितामह और प्रपितामह — प्रत्येक के लिए तीन-तीन अंजलि दें, फिर मातृ पक्ष के पितरों के लिए। प्रत्येक अर्पण के साथ तर्पण मन्त्र का उच्चारण करें।',
        sa: 'दक्षिणाभिमुखः अङ्गुष्ठतर्जन्योः मध्ये (पितृतीर्थेन) कृष्णतिलमिश्रितजलं अर्पयेत्। पित्रे पितामहाय प्रपितामहाय च प्रत्येकं त्रिरञ्जलिं दद्यात्, ततः मातृपक्षपितृभ्यः। प्रत्यर्पणं तर्पणमन्त्रं जपेत्।',
      },
      mantraRef: 'pitru-tarpan',
      essential: true,
      stepType: 'offering',
    },
    {
      step: 5,
      title: { en: 'Pind Daan (Rice Balls)', hi: 'पिण्ड दान (चावल के पिण्ड)', sa: 'पिण्डदानम्' },
      description: {
        en: 'Optionally, make small balls of cooked rice mixed with sesame and barley. Place them on kusha grass facing south. This represents nourishment offered directly to ancestors.',
        hi: 'वैकल्पिक रूप से, पके चावल में तिल और जौ मिलाकर छोटे पिण्ड बनाएँ। दक्षिण दिशा में कुशा घास पर रखें। यह सीधे पितरों को अर्पित पोषण का प्रतीक है।',
        sa: 'यथेच्छम् पक्वतण्डुलतिलयवमिश्रणेन लघुपिण्डान् रचयेत्। दक्षिणाभिमुखं कुशोपरि स्थापयेत्। एतत् साक्षात् पितृभ्यः पोषणार्पणं प्रतीकम्।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 6,
      title: { en: 'Brahmana Bhojana (Feeding)', hi: 'ब्राह्मण भोजन', sa: 'ब्राह्मणभोजनम्' },
      description: {
        en: 'If possible, feed a Brahmin or offer food to someone in need. This act of charity multiplies the merit of tarpan.',
        hi: 'यदि सम्भव हो तो ब्राह्मण को भोजन कराएँ या किसी ज़रूरतमन्द को भोजन दें। यह दान तर्पण के पुण्य को बढ़ाता है।',
        sa: 'यदि शक्यं ब्राह्मणं भोजयेत् अथवा दीनाय अन्नं दद्यात्। एतत् दानं तर्पणपुण्यं वर्धयति।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 7,
      title: { en: 'Daan (Charity)', hi: 'दान', sa: 'दानम्' },
      description: {
        en: 'Donate clothes, grains, or money in the name of ancestors. Black sesame, white cloth, and food grains are traditional Amavasya charity items.',
        hi: 'पितरों के नाम पर वस्त्र, अन्न या धन दान करें। काले तिल, सफ़ेद वस्त्र और अनाज अमावस्या के पारम्परिक दान हैं।',
        sa: 'पितृणां नाम्ना वस्त्राणि धान्यं धनं वा दद्यात्। कृष्णतिलाः श्वेतवस्त्रं धान्यं च अमावस्यायाः पारम्परिकदानद्रव्याणि।',
      },
      essential: false,
      stepType: 'offering',
    },
    {
      step: 8,
      title: { en: 'Prarthana (Closing Prayer)', hi: 'प्रार्थना (समापन)', sa: 'प्रार्थना (समापनम्)' },
      description: {
        en: 'Fold hands and pray to your ancestors for their blessings. Ask for their peace and liberation. Remove the kusha pavitri ring. You may now take food.',
        hi: 'हाथ जोड़कर पितरों से उनके आशीर्वाद के लिए प्रार्थना करें। उनकी शान्ति और मुक्ति की कामना करें। कुशा पवित्री अँगूठी उतारें। अब भोजन ग्रहण कर सकते हैं।',
        sa: 'अञ्जलिं बद्ध्वा पितॄन् आशीर्वादाय प्रार्थयेत्। तेषां शान्तिं मोक्षं च कामयेत्। कुशपवित्रम् अपनयेत्। इदानीं भोजनं ग्रहीतुं शक्नोति।',
      },
      essential: true,
      stepType: 'conclusion',
    },
  ],

  mantras: [
    {
      id: 'pitru-tarpan',
      name: { en: 'Pitru Tarpan Mantra', hi: 'पितृ तर्पण मन्त्र', sa: 'पितृतर्पणमन्त्रः' },
      devanagari: 'ॐ पिता स्वर्गतो यस्य माता यस्य दिवं गता ।\nतस्य तिलोदकं दत्तं अक्षयं उपतिष्ठतु ॥',
      iast: 'oṃ pitā svargato yasya mātā yasya divaṃ gatā |\ntasya tilodakaṃ dattaṃ akṣayaṃ upatiṣṭhatu ||',
      meaning: {
        en: 'Om, may the water with sesame offered for those whose father and mother have gone to heaven, reach them and be inexhaustible.',
        hi: 'ॐ, जिनके पिता स्वर्गवासी हैं, जिनकी माता स्वर्ग गई हैं, उनको दिए गए तिलोदक अक्षय हों।',
        sa: 'ओम्, यस्य पिता स्वर्गं गतः यस्य माता दिवं गता, तस्मै दत्तं तिलोदकं अक्षयं भवतु।',
      },
      usage: {
        en: 'Recite while pouring each anjali of water-sesame offering facing south',
        hi: 'दक्षिण दिशा की ओर प्रत्येक अंजलि जल-तिल अर्पित करते समय बोलें',
        sa: 'दक्षिणाभिमुखं प्रत्यञ्जलि जलतिलार्पणे जपेत्',
      },
    },
    {
      id: 'pitru-gayatri',
      name: { en: 'Pitru Gayatri Mantra', hi: 'पितृ गायत्री मन्त्र', sa: 'पितृगायत्रीमन्त्रः' },
      devanagari: 'ॐ देवताभ्यः पितृभ्यश्च महायोगिभ्य एव च ।\nनमः स्वधायै स्वाहायै नित्यमेव नमो नमः ॥',
      iast: 'oṃ devatābhyaḥ pitṛbhyaśca mahāyogibhya eva ca |\nnamaḥ svadhāyai svāhāyai nityameva namo namaḥ ||',
      meaning: {
        en: 'Om, salutations to the devas, the ancestors, and the great yogis. Eternal obeisance to Svadha (offering to ancestors) and Svaha (offering to devas).',
        hi: 'ॐ, देवताओं, पितरों और महायोगियों को नमस्कार। स्वधा (पितृ अर्पण) और स्वाहा (देव अर्पण) को सदा नमन।',
        sa: 'ओम्, देवताभ्यः पितृभ्यः महायोगिभ्यः च नमः। स्वधायै स्वाहायै नित्यं नमो नमः।',
      },
      usage: {
        en: 'Recite at the conclusion of tarpan for overall blessings of ancestors',
        hi: 'तर्पण के अन्त में पितरों के समग्र आशीर्वाद के लिए बोलें',
        sa: 'तर्पणसमाप्तौ पितृणां सामान्याशीर्वादार्थं जपेत्',
      },
    },
  ],

  naivedya: {
    en: 'No special naivedya for tarpan. After completion, the performer eats a simple sattvic meal. Avoid non-vegetarian food, onion, and garlic on Amavasya.',
    hi: 'तर्पण के लिए विशेष नैवेद्य नहीं। पूर्ण होने के बाद सात्विक भोजन करें। अमावस्या पर माँसाहार, प्याज़ और लहसुन से बचें।',
    sa: 'तर्पणाय विशेषनैवेद्यं नास्ति। समाप्तौ सात्त्विकभोजनं ग्रह्णीयात्। अमावस्यायां मांसाहारं पलाण्डुं लशुनं च त्यजेत्।',
  },

  precautions: [
    {
      en: 'Always face south while performing tarpan — south is the direction of Yama and the pitru loka.',
      hi: 'तर्पण करते समय सदैव दक्षिण दिशा की ओर मुख रखें — दक्षिण यम और पितृलोक की दिशा है।',
      sa: 'तर्पणे सदा दक्षिणाभिमुखं तिष्ठेत् — दक्षिणा यमस्य पितृलोकस्य च दिक्।',
    },
    {
      en: 'Use darbha/kusha grass — it is considered essential for all pitru karma as it conducts spiritual energy.',
      hi: 'दर्भ/कुशा घास का उपयोग करें — पितृ कर्म में यह अनिवार्य माना जाता है क्योंकि यह आध्यात्मिक ऊर्जा का संवाहक है।',
      sa: 'दर्भ/कुशं प्रयोजयेत् — सर्वेषु पितृकर्मसु अनिवार्यं तत् आध्यात्मिकशक्तिसंवाहकत्वात्।',
    },
    {
      en: 'Perform tarpan before eating any food. The performer must be in a fasting state.',
      hi: 'भोजन से पहले तर्पण करें। करने वाला उपवास की अवस्था में होना चाहिए।',
      sa: 'भोजनात् प्राक् तर्पणं कुर्यात्। कर्ता उपवासावस्थायां भवेत्।',
    },
    {
      en: 'Amavasya is not a day for celebration. Maintain a solemn, contemplative demeanor throughout the day.',
      hi: 'अमावस्या उत्सव का दिन नहीं है। दिन भर गम्भीर और चिन्तनशील व्यवहार रखें।',
      sa: 'अमावस्या उत्सवदिनं नास्ति। दिनं यावत् गम्भीरचिन्तनशीलव्यवहारं पालयेत्।',
    },
  ],

  phala: {
    en: 'Ancestors\' blessings, freedom from pitru dosha, peace for departed souls, and progeny welfare. Regular Amavasya tarpan ensures ancestral grace flows unimpeded across generations.',
    hi: 'पितरों के आशीर्वाद, पितृ दोष से मुक्ति, दिवंगत आत्माओं को शान्ति, और सन्तान कल्याण। नियमित अमावस्या तर्पण सुनिश्चित करता है कि पितृकृपा पीढ़ियों तक निर्बाध बहती रहे।',
    sa: 'पितृणाम् आशीर्वादः, पितृदोषान्मुक्तिः, दिवंगतात्मनां शान्तिः, सन्ततिकल्याणं च। नियमितम् अमावस्यातर्पणं पितृकृपां पीढीषु निर्बाधं प्रवहति।',
  },
};

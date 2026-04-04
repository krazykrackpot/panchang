// src/lib/tippanni/convergence/patterns/spiritual.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const SPIRITUAL_PATTERNS: ConvergencePattern[] = [
  {
    id: 'awakening',
    theme: 'spiritual',
    significance: 5,
    conditions: [
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 12 },
      { type: 'natal', check: 'lord-strong', house: 12 },
    ],
    text: {
      full: {
        en: 'A profound spiritual awakening convergence. Ketu\'s dasha dissolves material attachments, Jupiter\'s transit through your 12th house expands spiritual awareness, and your 12th lord is strong enough to channel this energy constructively. Meditation deepens effortlessly, synchronicities multiply, and worldly concerns feel distant. This is one of the most significant spiritual windows your chart will produce.',
        hi: 'गहन आध्यात्मिक जागृति संयोग। केतु दशा भौतिक मोह विलीन करती है, बृहस्पति गोचर द्वादश भाव में आध्यात्मिक जागरूकता विस्तारित, द्वादशेश इस ऊर्जा को रचनात्मक रूप से संचालित करने में सक्षम। ध्यान सहज गहरा होता है।',
      },
      mild: {
        en: 'Spiritual energies are gently stirring. Ketu\'s dasha encourages inward reflection, and Jupiter\'s proximity to your 12th house softens the boundary between the material and the unseen. Quiet time spent in prayer or meditation will feel unusually rewarding.',
        hi: 'आध्यात्मिक ऊर्जाएँ धीरे-धीरे जाग रही हैं। केतु दशा अंतर्मुखी चिंतन को प्रोत्साहित करती है। ध्यान या प्रार्थना में बिताया समय असामान्य रूप से फलदायी लगेगा।',
      },
    },
    advice: {
      en: 'Establish a daily meditation practice now — even 10 minutes. Reduce screen time and sensory noise. The inner voice becomes audible only in stillness.',
      hi: 'अभी एक दैनिक ध्यान अभ्यास स्थापित करें — 10 मिनट भी पर्याप्त। स्क्रीन और शोर कम करें। आंतरिक आवाज़ केवल शांति में सुनाई देती है।',
    },
    laypersonNote: {
      en: 'Three independent signals — your dasha, a transit, and your natal chart — are all pointing toward the same inner doorway. When this rarely happens, it\'s worth walking through it.',
      hi: 'तीन स्वतंत्र संकेत — दशा, गोचर, और जन्म कुंडली — सभी एक ही आंतरिक द्वार की ओर इशारा कर रहे हैं। यह दुर्लभ अवसर है।',
    },
    relatedSections: [
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
      TippanniSection.PlanetInsights,
    ],
  },

  {
    id: 'guru-connection',
    theme: 'spiritual',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 9 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 9 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 9 },
    ],
    text: {
      full: {
        en: 'The guru house is triply activated. Your 9th lord is strong, Jupiter blesses it with transit, and your dasha energizes this house. A spiritual teacher, mentor, or guide is entering your life — or an existing one is about to transmit something profound. Pilgrimages undertaken now carry transformative power. Higher education or philosophical study opens doors.',
        hi: 'गुरु भाव तिगुना सक्रिय। नवमेश बलवान, बृहस्पति गोचर आशीर्वाद, दशा इस भाव को ऊर्जावान करती है। एक आध्यात्मिक गुरु आपके जीवन में प्रवेश कर रहा है। तीर्थयात्राएँ अब परिवर्तनकारी शक्ति रखती हैं।',
      },
      mild: {
        en: 'Your 9th house of wisdom and guidance is receiving positive attention from both transit and dasha. A meaningful teacher or philosophical influence is available to you — you may need to take the first step toward them.',
        hi: 'नवम भाव गोचर और दशा दोनों से सकारात्मक ध्यान प्राप्त कर रहा है। एक सार्थक गुरु या दार्शनिक प्रभाव उपलब्ध है — शायद आपको पहला कदम उठाना हो।',
      },
    },
    advice: {
      en: 'Actively seek a teacher or study group in your area of spiritual inquiry. Attend discourses, read foundational texts, plan a pilgrimage. The 9th house rewards those who pursue it with sincerity.',
      hi: 'अपनी आध्यात्मिक जिज्ञासा में एक गुरु या अध्ययन समूह सक्रिय रूप से खोजें। प्रवचन में जाएँ, मूल ग्रंथ पढ़ें, तीर्थयात्रा की योजना बनाएँ।',
    },
    laypersonNote: {
      en: 'The 9th house is your chart\'s spiritual compass. When Jupiter visits it while your dasha is also pointing there, the universe is essentially holding a door open for you to meet your teacher.',
      hi: 'नवम भाव आपकी कुंडली का आध्यात्मिक कम्पास है। जब बृहस्पति वहाँ आता है और दशा भी उसी ओर इशारा करती है, ब्रह्मांड आपके गुरु से मिलने का द्वार खोल देता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'pilgrimage',
    theme: 'spiritual',
    significance: 3,
    conditions: [
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 9 },
    ],
    text: {
      full: {
        en: 'Ketu\'s dasha pulls you toward sacred places while Jupiter transits your house of pilgrimages. The urge to visit temples, ashrams, or holy sites isn\'t random — it\'s a karmic call. Journeys to spiritual places during this period carry the potential for genuine inner transformation, not just sightseeing.',
        hi: 'केतु दशा पवित्र स्थानों की ओर खींचती है जबकि बृहस्पति तीर्थ भाव में गोचर। मंदिर, आश्रम या तीर्थ स्थलों की यात्रा की इच्छा कार्मिक पुकार है। इस अवधि में आध्यात्मिक यात्रा सच्चे आंतरिक परिवर्तन की संभावना रखती है।',
      },
      mild: {
        en: 'A gentle pull toward sacred travel is present. Even a short visit to a local temple or a retreat weekend can yield disproportionate inner benefit during this alignment.',
        hi: 'पवित्र यात्रा की ओर एक सौम्य खिंचाव है। इस संरेखण में एक स्थानीय मंदिर या रिट्रीट सप्ताहांत भी असमान आंतरिक लाभ दे सकता है।',
      },
    },
    advice: {
      en: 'Plan a pilgrimage or spiritual retreat — even a short one. The intention matters as much as the destination. Go with openness rather than a tourist checklist.',
      hi: 'एक तीर्थयात्रा या आध्यात्मिक रिट्रीट की योजना बनाएँ — छोटी भी ठीक है। इरादा गंतव्य जितना ही महत्वपूर्ण है। खुले मन से जाएँ।',
    },
    laypersonNote: {
      en: 'Sometimes the chart shows that a physical journey can catalyze an internal one. This is one of those times — the map and the territory are aligned.',
      hi: 'कभी-कभी कुंडली दिखाती है कि एक शारीरिक यात्रा आंतरिक यात्रा को उत्प्रेरित कर सकती है। यह उन्हीं समयों में से एक है।',
    },
    relatedSections: [
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'moksha-activation',
    theme: 'spiritual',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 8, house: 12 },
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 12 },
    ],
    text: {
      full: {
        en: 'The Moksha triangle fires completely. Ketu in your 12th house is the classic liberation placement, Ketu\'s dasha period activates this energy, and Jupiter\'s transit illuminates the path. This is the rarest and most significant spiritual alignment — a genuine window for consciousness evolution. Material life may feel increasingly meaningless as the soul orients toward liberation.',
        hi: 'मोक्ष त्रिकोण पूर्णतः सक्रिय। द्वादश में केतु मुक्ति का शास्त्रीय स्थान, केतु दशा इस ऊर्जा को सक्रिय, बृहस्पति गोचर मार्ग प्रकाशित। सबसे दुर्लभ और महत्वपूर्ण आध्यात्मिक संरेखण — चेतना विकास की वास्तविक खिड़की।',
      },
      mild: {
        en: 'Ketu in your 12th house carries a lifetime orientation toward liberation, and the current dasha amplifies this quietly. A sense of wanting less and understanding more may be gradually taking hold.',
        hi: 'द्वादश में केतु आजीवन मुक्ति की ओर उन्मुखीकरण रखता है, और वर्तमान दशा इसे शांतिपूर्वक बढ़ाती है। कम चाहने और अधिक समझने की भावना धीरे-धीरे पकड़ ले रही है।',
      },
    },
    advice: {
      en: 'Engage seriously with a liberation-oriented practice — Advaita study, vipassana, self-inquiry. Reduce possessiveness in relationships and things. This is not a time for accumulation.',
      hi: 'एक मुक्ति-उन्मुख अभ्यास में गंभीरता से संलग्न हों — अद्वैत अध्ययन, विपश्यना, आत्म-जिज्ञासा। संबंधों और वस्तुओं में स्वामित्व कम करें। यह संचय का समय नहीं।',
    },
    laypersonNote: {
      en: 'Ketu in the 12th is the chart\'s most direct pointer toward moksha. When Ketu also runs the dasha and Jupiter illuminates the same house, the soul is being given every possible signal to turn inward.',
      hi: 'द्वादश में केतु मोक्ष की ओर कुंडली का सबसे सीधा संकेतक है। जब केतु दशा भी चलाता है और बृहस्पति उसी भाव को प्रकाशित करता है, तो आत्मा को अंतर्मुखी होने के हर संभव संकेत मिल रहे हैं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'meditation',
    theme: 'spiritual',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 12 },
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
    ],
    text: {
      full: {
        en: 'Your 12th house of withdrawal and meditation is strong, and Ketu\'s dasha naturally turns attention inward. Meditation, contemplation, and solitary spiritual practice come easily now. Dreams become more vivid and potentially prophetic. Sleep quality may initially fluctuate as the subconscious processes deep material.',
        hi: 'द्वादश भाव (ध्यान, वैराग्य) बलवान और केतु दशा ध्यान स्वाभाविक रूप से अंतर्मुखी करती है। ध्यान, चिंतन और एकांत आध्यात्मिक अभ्यास अब सहज। स्वप्न अधिक स्पष्ट और संभवतः भविष्यसूचक।',
      },
      mild: {
        en: 'A quiet spiritual quality is present. The 12th house is natally supported, and Ketu\'s dasha encourages detachment. Moments of stillness feel more accessible than usual.',
        hi: 'एक शांत आध्यात्मिक गुण उपस्थित है। द्वादश भाव जन्म से समर्थित है, और केतु दशा वैराग्य को प्रोत्साहित करती है। शांति के क्षण सामान्य से अधिक सुलभ लगते हैं।',
      },
    },
    advice: {
      en: 'Keep a dream journal. Reduce stimulants. Consider a structured meditation course — the chart\'s support for inner work is clear. Solitude is an asset, not a deficit, right now.',
      hi: 'स्वप्न पत्रिका रखें। उत्तेजक पदार्थ कम करें। एक संरचित ध्यान पाठ्यक्रम पर विचार करें। एकांत अभी एक संपत्ति है, कमी नहीं।',
    },
    laypersonNote: {
      en: 'When your birth chart\'s 12th house is strong and Ketu runs the dasha, the inner world becomes more accessible than the outer one. This is one of the best configurations for meditation practice.',
      hi: 'जब जन्म कुंडली का द्वादश भाव बलवान हो और केतु दशा चले, तो आंतरिक संसार बाहरी से अधिक सुलभ हो जाता है। ध्यान अभ्यास के लिए यह सर्वोत्तम विन्यासों में से एक है।',
    },
    relatedSections: [
      TippanniSection.DashaSynthesis,
      TippanniSection.PlanetInsights,
    ],
  },

  {
    id: 'past-life',
    theme: 'spiritual',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 8, house: 1 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 1 },
    ],
    text: {
      full: {
        en: 'Ketu in your 1st house connects your identity to past-life impressions, and the current dasha is activating your sense of self. Déjà vu experiences, inexplicable skills or knowledge, and encounters with people who feel \'familiar\' from the start — these are past-life echoes surfacing for integration. Pay attention to recurring themes in your life — they carry karmic lessons.',
        hi: 'प्रथम भाव में केतु पहचान को पूर्वजन्म संस्कारों से जोड़ता है, और दशा आत्म-बोध सक्रिय कर रही है। डेजा वू, अकथनीय कौशल, और \'परिचित\' लगने वाले लोगों से मुलाकात — पूर्वजन्म प्रतिध्वनियाँ एकीकरण के लिए सतह पर।',
      },
      mild: {
        en: 'Ketu in the 1st house gives your personality an otherworldly quality that others sense. The current dasha is activating your self-expression, which may bring old patterns and inexplicable tendencies into view.',
        hi: 'प्रथम भाव में केतु आपके व्यक्तित्व को एक अलौकिक गुण देता है जो दूसरे अनुभव करते हैं। वर्तमान दशा आपकी आत्म-अभिव्यक्ति को सक्रिय कर रही है, जो पुराने पैटर्न सामने ला सकती है।',
      },
    },
    advice: {
      en: 'Keep a journal of recurring dreams, inexplicable aversions, and instant connections. Past-life regression or karmic astrology consultations can be illuminating. Don\'t dismiss what feels ancient in you.',
      hi: 'आवर्ती स्वप्नों, अकथनीय विमुखताओं और तत्काल संबंधों की पत्रिका रखें। पूर्वजन्म प्रतिगमन या कार्मिक ज्योतिष परामर्श प्रकाशकारी हो सकते हैं।',
    },
    laypersonNote: {
      en: 'Ketu in the 1st house is like carrying a library of previous lifetimes in your personality. The current dasha is opening that library. Some of what you find will explain things about yourself that nothing else could.',
      hi: 'प्रथम भाव में केतु व्यक्तित्व में पिछले जन्मों की एक लाइब्रेरी ले जाने जैसा है। वर्तमान दशा वह लाइब्रेरी खोल रही है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.Personality,
    ],
  },

  {
    id: 'detachment',
    theme: 'spiritual',
    significance: 3,
    conditions: [
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 1 },
    ],
    text: {
      full: {
        en: 'Ketu\'s dasha dissolves attachments while Saturn\'s transit through your 1st house strips away false identities. You may feel a growing disconnection from things that once defined you — career titles, social status, material possessions. This isn\'t depression — it\'s spiritual detachment. The discomfort is the ego protesting as the soul evolves beyond it.',
        hi: 'केतु दशा मोह विलीन करती है जबकि शनि गोचर प्रथम भाव में झूठी पहचानें हटाता है। उन चीजों से बढ़ता वियोग जो कभी आपको परिभाषित करती थीं। यह अवसाद नहीं — आध्यात्मिक वैराग्य। आत्मा अहंकार से परे विकसित हो रही है।',
      },
      mild: {
        en: 'A quiet loosening of old self-concepts is underway. Ketu\'s dasha removes what no longer serves, and Saturn\'s transit to your 1st is tightening standards. Life may feel more serious and stripped-down than usual.',
        hi: 'पुरानी आत्म-अवधारणाओं का शांत विमोचन हो रहा है। केतु दशा जो अब काम नहीं करता उसे हटाती है, और शनि गोचर मानदंड कड़े करता है। जीवन सामान्य से अधिक गंभीर और सादा लग सकता है।',
      },
    },
    advice: {
      en: 'Don\'t cling to the old identity — cooperate with the shedding. Ask which of your self-definitions are real and which are performance. This transit is doing necessary renovation work.',
      hi: 'पुरानी पहचान से न चिपकें — विमोचन में सहयोग करें। पूछें कि आपकी कौन सी आत्म-परिभाषाएँ वास्तविक हैं और कौन सी प्रदर्शन। यह गोचर आवश्यक नवीकरण कार्य कर रहा है।',
    },
    laypersonNote: {
      en: 'When Ketu runs the dasha and Saturn transits the self-house simultaneously, the chart is essentially performing a controlled demolition of false identity structures. It\'s uncomfortable, but it clears space for something authentic.',
      hi: 'जब केतु दशा चलाता है और शनि एक साथ स्व-भाव में गोचर करता है, तो कुंडली झूठी पहचान संरचनाओं का नियंत्रित विध्वंस कर रही है। असुविधाजनक है, लेकिन प्रामाणिक के लिए जगह बनाता है।',
    },
    relatedSections: [
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
      TippanniSection.Personality,
    ],
  },

  {
    id: 'occult',
    theme: 'spiritual',
    significance: 2,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 8 },
      { type: 'natal', check: 'planet-in-house', planet: 8, house: 8 },
    ],
    text: {
      full: {
        en: 'Your 8th house of occult knowledge has both a strong lord and Ketu\'s mystical presence. Psychic sensitivity, intuitive diagnosis, astrology, tantra, and hidden knowledge systems come naturally. You may find yourself drawn to study the esoteric — follow this pull. Your chart supports deep investigation of what lies beyond the visible.',
        hi: 'अष्टम भाव (गूढ़ ज्ञान) में बलवान स्वामी और केतु की रहस्यमय उपस्थिति। मानसिक संवेदनशीलता, सहज निदान, ज्योतिष, तंत्र और गुप्त ज्ञान प्रणालियाँ स्वाभाविक। गूढ़ अध्ययन की ओर आकर्षण — इस खिंचाव का अनुसरण करें।',
      },
      mild: {
        en: 'Your natal 8th house carries both a strong lord and Ketu\'s signature — a reliable indicator of intuitive and esoteric ability. Subjects like astrology, energy healing, or symbolic interpretation may come more naturally to you than to most.',
        hi: 'आपके जन्म के अष्टम भाव में बलवान स्वामी और केतु दोनों हैं — सहज और गूढ़ क्षमता का एक विश्वसनीय संकेतक। ज्योतिष, ऊर्जा चिकित्सा जैसे विषय अधिकांश लोगों की तुलना में आपके लिए अधिक स्वाभाविक हो सकते हैं।',
      },
    },
    advice: {
      en: 'Begin systematic study of a hidden-knowledge tradition — Jyotish, numerology, sacred geometry, or energy medicine. You have the natal wiring for it. Practice discernment: occult knowledge carries responsibility.',
      hi: 'एक गुप्त-ज्ञान परंपरा का व्यवस्थित अध्ययन शुरू करें — ज्योतिष, अंक विज्ञान, पवित्र ज्यामिति। आपके पास इसके लिए जन्मजात क्षमता है। विवेक का अभ्यास करें: गूढ़ ज्ञान जिम्मेदारी लाता है।',
    },
    laypersonNote: {
      en: 'Ketu in the 8th house with a strong 8th lord is a chart signature for people who naturally see patterns others miss — in energy, in timing, in what is hidden. This is a genuine gift, not imagination.',
      hi: 'अष्टम में केतु और बलवान अष्टमेश उन लोगों का कुंडली हस्ताक्षर है जो स्वाभाविक रूप से वे पैटर्न देखते हैं जो दूसरे चूक जाते हैं — ऊर्जा में, समय में, जो छुपा है उसमें।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },
];

// src/lib/horoscope/rashi-editorial.ts

/**
 * Static bilingual editorial content for each rashi.
 * Server-rendered below the dynamic horoscope widget — gives Google
 * substantive indexable content on every /horoscope/[rashi] page.
 *
 * Content does NOT change daily — it's sign-specific personality and
 * trait text. The dynamic horoscope above it changes daily.
 */

import type { LocaleText } from '@/types/panchang';

export interface RashiEditorial {
  personality: LocaleText;          // 2-3 sentences about the sign's nature
  rulerInfluence: LocaleText;       // How the ruling planet shapes the sign
  elementTraits: LocaleText;        // Fire/Earth/Air/Water element traits
  strengthsWeaknesses: LocaleText;  // Key strengths and growth areas
  compatibility: LocaleText;        // Natural compatible and challenging signs
}

export const RASHI_EDITORIAL: Record<number, RashiEditorial> = {
  // ─── 1. Mesh (Aries) — Mars, Fire, Cardinal ───────────────────────
  1: {
    personality: {
      en: 'Aries (Mesh) is the first sign of the Vedic zodiac, ruled by Mars. People born under Mesh are natural pioneers — bold, energetic, and driven by an instinct to lead. They possess an infectious enthusiasm that inspires those around them, though their impatience can sometimes lead to hasty decisions.',
      hi: 'मेष वैदिक राशिचक्र की प्रथम राशि है, जिसके स्वामी मंगल हैं। मेष राशि के लोग स्वाभाविक अग्रणी होते हैं — साहसी, ऊर्जावान, और नेतृत्व की प्रवृत्ति से प्रेरित। उनका उत्साह संक्रामक होता है, हालांकि उनकी अधीरता कभी-कभी जल्दबाज़ी के निर्णयों की ओर ले जा सकती है।',
    },
    rulerInfluence: {
      en: 'Mars infuses Aries with courage, physical vitality, and a competitive spirit. When Mars is well-placed in a birth chart, it amplifies leadership qualities and athletic ability. During Mars transits through key houses, Aries natives feel surges of motivation and determination.',
      hi: 'मंगल मेष को साहस, शारीरिक ऊर्जा और प्रतिस्पर्धी भावना प्रदान करता है। जब मंगल जन्म कुंडली में अच्छी स्थिति में हो, तो यह नेतृत्व गुणों और शारीरिक क्षमता को बढ़ाता है। मंगल के प्रमुख भावों में गोचर के दौरान, मेष जातकों में प्रेरणा और दृढ़ संकल्प की लहर उमड़ती है।',
    },
    elementTraits: {
      en: 'As a cardinal fire sign, Aries thrives on action and initiative. Fire signs are spontaneous, creative, and drawn to challenges. The cardinal quality adds a drive to start new ventures — Aries natives are the ones who light the spark, though sustaining it requires conscious effort.',
      hi: 'चर अग्नि राशि होने के कारण, मेष कर्म और पहल पर फलता-फूलता है। अग्नि राशियाँ सहज, रचनात्मक और चुनौतियों की ओर आकर्षित होती हैं। चर गुण नए कार्यों को आरम्भ करने की प्रेरणा देता है — मेष जातक ही वो लोग हैं जो चिंगारी जलाते हैं, हालांकि उसे बनाए रखना सचेत प्रयास माँगता है।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: courage, determination, confidence, enthusiasm, and unshakeable honesty. Growth areas: impatience, a short temper, impulsiveness, and a tendency towards competitiveness that can strain personal relationships.',
      hi: 'शक्तियाँ: साहस, दृढ़ता, आत्मविश्वास, उत्साह, और अटल ईमानदारी। विकास क्षेत्र: अधीरता, चिड़चिड़ापन, आवेगशीलता, और व्यक्तिगत संबंधों में प्रतिस्पर्धा की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Leo and Sagittarius (fellow fire signs) and Gemini and Aquarius (air signs that fan the flames). More challenging dynamics with Cancer and Capricorn, where patience and compromise are essential for harmony.',
      hi: 'सिंह और धनु (अग्नि राशियों) तथा मिथुन और कुम्भ (वायु राशियों) के साथ स्वाभाविक अनुकूलता। कर्क और मकर के साथ चुनौतीपूर्ण गतिशीलता, जहाँ सामंजस्य के लिए धैर्य और समझौता आवश्यक है।',
    },
  },

  // ─── 2. Vrishabh (Taurus) — Venus, Earth, Fixed ───────────────────
  2: {
    personality: {
      en: 'Taurus (Vrishabh) is the second sign of the Vedic zodiac, ruled by Venus. Vrishabh natives are grounded, patient, and deeply sensual — they appreciate beauty, comfort, and the finer things in life. Their steadfast nature makes them reliable partners and loyal friends, though their stubbornness can become an obstacle when change is needed.',
      hi: 'वृषभ वैदिक राशिचक्र की दूसरी राशि है, जिसकी स्वामिनी शुक्र हैं। वृषभ जातक धरती से जुड़े, धैर्यवान और गहरे सौंदर्य-प्रेमी होते हैं — वे सुंदरता, आराम और जीवन की उत्कृष्ट वस्तुओं को सराहते हैं। उनकी स्थिर प्रकृति उन्हें विश्वसनीय साथी बनाती है, हालांकि उनका हठ बदलाव के समय बाधा बन सकता है।',
    },
    rulerInfluence: {
      en: 'Venus bestows Taurus with an innate love of art, music, and material comfort. A well-placed Venus in the birth chart enhances charm, financial acumen, and aesthetic sensibility. Venus transits through Taurus amplify desires for luxury, romance, and sensory indulgence.',
      hi: 'शुक्र वृषभ को कला, संगीत और भौतिक सुख-सुविधाओं के प्रति स्वाभाविक प्रेम प्रदान करता है। जन्म कुंडली में शुक्र की अच्छी स्थिति आकर्षण, आर्थिक बुद्धि और सौंदर्यबोध को बढ़ाती है। शुक्र के वृषभ में गोचर के दौरान विलासिता, रोमांस और इंद्रिय सुख की इच्छाएँ प्रबल होती हैं।',
    },
    elementTraits: {
      en: 'As a fixed earth sign, Taurus embodies stability, persistence, and material grounding. Earth signs are practical and results-oriented. The fixed quality gives Taurus extraordinary endurance — once committed, they see things through to completion, building wealth and security brick by brick.',
      hi: 'स्थिर पृथ्वी राशि होने के कारण, वृषभ स्थिरता, दृढ़ता और भौतिक आधार का प्रतीक है। पृथ्वी राशियाँ व्यावहारिक और परिणाम-उन्मुख होती हैं। स्थिर गुण वृषभ को असाधारण सहनशीलता देता है — एक बार प्रतिबद्ध होने पर, वे ईंट-ईंट जोड़कर सम्पत्ति और सुरक्षा का निर्माण करते हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: reliability, patience, practicality, devotion, and a strong aesthetic sense. Growth areas: stubbornness, possessiveness, resistance to change, and a tendency to prioritise comfort over growth.',
      hi: 'शक्तियाँ: विश्वसनीयता, धैर्य, व्यावहारिकता, समर्पण, और सशक्त सौंदर्यबोध। विकास क्षेत्र: हठ, अधिकार-भाव, बदलाव का प्रतिरोध, और विकास की जगह आराम को प्राथमिकता देने की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Virgo and Capricorn (fellow earth signs) and Cancer and Pisces (water signs that nurture earth). More challenging dynamics with Leo and Aquarius, where clashes over control and freedom can arise.',
      hi: 'कन्या और मकर (पृथ्वी राशियों) तथा कर्क और मीन (जल राशियों) के साथ स्वाभाविक अनुकूलता। सिंह और कुम्भ के साथ चुनौतीपूर्ण संबंध, जहाँ नियंत्रण और स्वतंत्रता को लेकर टकराव हो सकता है।',
    },
  },

  // ─── 3. Mithun (Gemini) — Mercury, Air, Mutable ───────────────────
  3: {
    personality: {
      en: 'Gemini (Mithun) is the third sign of the Vedic zodiac, ruled by Mercury. Mithun natives are intellectually curious, quick-witted, and endlessly adaptable — they are the communicators of the zodiac. Their dual nature allows them to see every side of a debate, but this same versatility can lead to restlessness and difficulty committing to one path.',
      hi: 'मिथुन वैदिक राशिचक्र की तीसरी राशि है, जिसके स्वामी बुध हैं। मिथुन जातक बौद्धिक रूप से जिज्ञासु, चतुर और अत्यंत अनुकूलनशील होते हैं — वे राशिचक्र के संवादक हैं। उनकी द्वैत प्रकृति उन्हें हर पक्ष को देखने की क्षमता देती है, लेकिन यही बहुमुखी प्रतिभा बेचैनी और एक मार्ग पर टिकने में कठिनाई का कारण भी बन सकती है।',
    },
    rulerInfluence: {
      en: 'Mercury gifts Gemini with sharp intellect, eloquence, and a talent for commerce and writing. A strong Mercury in the chart produces exceptional speakers, traders, and analysts. Mercury retrograde periods often push Gemini natives to revisit unfinished conversations and reconsider decisions.',
      hi: 'बुध मिथुन को तीक्ष्ण बुद्धि, वाक्पटुता, और व्यापार तथा लेखन में प्रतिभा प्रदान करता है। कुंडली में शक्तिशाली बुध उत्कृष्ट वक्ता, व्यापारी और विश्लेषक बनाता है। बुध के वक्री काल में मिथुन जातक अधूरी बातचीत पर लौटते हैं और निर्णयों पर पुनर्विचार करते हैं।',
    },
    elementTraits: {
      en: 'As a mutable air sign, Gemini flows with ideas and social connections. Air signs value intellect over emotion and thrive in environments of learning and exchange. The mutable quality makes Gemini the most adaptable of the air triad — they can shift perspectives effortlessly, making them brilliant networkers but sometimes lacking depth.',
      hi: 'द्विस्वभाव वायु राशि होने के कारण, मिथुन विचारों और सामाजिक सम्पर्कों के साथ बहता है। वायु राशियाँ भावनाओं से अधिक बुद्धि को महत्व देती हैं। द्विस्वभाव गुण मिथुन को वायु त्रिकोण में सबसे अनुकूलनशील बनाता है — वे सहजता से दृष्टिकोण बदल सकते हैं, जो उन्हें शानदार नेटवर्कर बनाता है, किंतु कभी-कभी गहराई की कमी रह जाती है।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: versatility, communication skills, intellectual curiosity, wit, and social magnetism. Growth areas: inconsistency, nervousness, superficiality, and a tendency to scatter energy across too many interests simultaneously.',
      hi: 'शक्तियाँ: बहुमुखी प्रतिभा, संवाद कौशल, बौद्धिक जिज्ञासा, हाज़िरजवाबी, और सामाजिक आकर्षण। विकास क्षेत्र: अस्थिरता, घबराहट, सतहीपन, और एक साथ बहुत से कार्यों में ऊर्जा बिखेरने की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Libra and Aquarius (fellow air signs) and Aries and Leo (fire signs that energise the intellect). More challenging dynamics with Virgo and Pisces, where differing communication styles require conscious bridging.',
      hi: 'तुला और कुम्भ (वायु राशियों) तथा मेष और सिंह (अग्नि राशियों) के साथ स्वाभाविक अनुकूलता। कन्या और मीन के साथ चुनौतीपूर्ण संबंध, जहाँ भिन्न संवाद शैलियों के बीच सचेत सामंजस्य आवश्यक है।',
    },
  },

  // ─── 4. Kark (Cancer) — Moon, Water, Cardinal ─────────────────────
  4: {
    personality: {
      en: 'Cancer (Kark) is the fourth sign of the Vedic zodiac, ruled by the Moon. Kark natives are deeply intuitive, emotionally rich, and profoundly nurturing — they are the caregivers of the zodiac. Their sensitivity allows them to read people and situations with uncanny accuracy, though they can retreat into a protective shell when feeling vulnerable.',
      hi: 'कर्क वैदिक राशिचक्र की चौथी राशि है, जिसके स्वामी चन्द्रमा हैं। कर्क जातक अत्यंत सहज ज्ञानी, भावनात्मक रूप से समृद्ध और गहरे पोषक होते हैं — वे राशिचक्र के देखभालकर्ता हैं। उनकी संवेदनशीलता उन्हें लोगों को अद्भुत सटीकता से पढ़ने देती है, हालांकि असुरक्षा महसूस होने पर वे अपने सुरक्षा कवच में सिमट जाते हैं।',
    },
    rulerInfluence: {
      en: 'The Moon makes Cancer the most emotionally fluid sign — moods shift with lunar phases in a way that is almost literal. A well-placed Moon in the birth chart grants profound empathy, strong memory, and domestic happiness. Cancer natives are especially sensitive during Full Moon and New Moon days, when emotions peak and introspection deepens.',
      hi: 'चन्द्रमा कर्क को भावनात्मक रूप से सबसे तरल राशि बनाता है — मनोदशा चन्द्र कलाओं के साथ लगभग शाब्दिक रूप से बदलती है। जन्म कुंडली में अच्छी स्थिति का चन्द्रमा गहरी सहानुभूति, तीव्र स्मृति और पारिवारिक सुख प्रदान करता है। कर्क जातक पूर्णिमा और अमावस्या के दिनों में विशेष रूप से संवेदनशील होते हैं।',
    },
    elementTraits: {
      en: 'As a cardinal water sign, Cancer initiates through emotional connection and protective instinct. Water signs feel deeply and navigate life through intuition. The cardinal quality drives Cancer to build safe havens — they are the ones who create homes, families, and communities rooted in emotional security.',
      hi: 'चर जल राशि होने के कारण, कर्क भावनात्मक जुड़ाव और सुरक्षात्मक प्रवृत्ति से पहल करता है। जल राशियाँ गहराई से अनुभव करती हैं और सहज ज्ञान से जीवन का संचालन करती हैं। चर गुण कर्क को सुरक्षित आश्रय बनाने के लिए प्रेरित करता है — वे ही घर, परिवार और समुदाय का निर्माण करते हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: empathy, loyalty, intuition, tenacity, and a powerful nurturing instinct. Growth areas: moodiness, over-sensitivity, tendency to cling, and difficulty letting go of past hurts.',
      hi: 'शक्तियाँ: सहानुभूति, वफ़ादारी, अंतर्ज्ञान, दृढ़ता, और शक्तिशाली पोषण प्रवृत्ति। विकास क्षेत्र: मिज़ाजीपन, अत्यधिक संवेदनशीलता, जकड़ने की प्रवृत्ति, और पुरानी पीड़ाओं को छोड़ने में कठिनाई।',
    },
    compatibility: {
      en: 'Naturally compatible with Scorpio and Pisces (fellow water signs) and Taurus and Virgo (earth signs that provide stability). More challenging dynamics with Aries and Libra, where emotional needs and intellectual approaches can collide.',
      hi: 'वृश्चिक और मीन (जल राशियों) तथा वृषभ और कन्या (पृथ्वी राशियों) के साथ स्वाभाविक अनुकूलता। मेष और तुला के साथ चुनौतीपूर्ण संबंध, जहाँ भावनात्मक आवश्यकताएँ और बौद्धिक दृष्टिकोण टकरा सकते हैं।',
    },
  },

  // ─── 5. Simha (Leo) — Sun, Fire, Fixed ────────────────────────────
  5: {
    personality: {
      en: 'Leo (Simha) is the fifth sign of the Vedic zodiac, ruled by the Sun. Simha natives radiate warmth, authority, and creative brilliance — they are born to hold centre stage. Their generous spirit and natural charisma draw people to them like moths to a flame, though their need for recognition can sometimes come across as vanity.',
      hi: 'सिंह वैदिक राशिचक्र की पाँचवीं राशि है, जिसके स्वामी सूर्य हैं। सिंह जातक उष्मा, अधिकार और रचनात्मक प्रतिभा बिखेरते हैं — वे मंच के केंद्र में रहने के लिए जन्मे हैं। उनकी उदार भावना और स्वाभाविक करिश्मा लोगों को आकर्षित करता है, हालांकि मान्यता की उनकी आवश्यकता कभी-कभी अहंकार जैसी प्रतीत हो सकती है।',
    },
    rulerInfluence: {
      en: 'The Sun grants Leo a powerful sense of identity, self-expression, and vitality. When the Sun is dignified in the birth chart, it confers leadership, fame, and a noble character. During Sun transits, Leo natives experience heightened confidence and visibility — these are their peak periods for public recognition.',
      hi: 'सूर्य सिंह को पहचान, आत्म-अभिव्यक्ति और जीवन शक्ति का प्रबल बोध प्रदान करता है। जब सूर्य जन्म कुंडली में गरिमा में हो, तो यह नेतृत्व, यश और उदात्त चरित्र देता है। सूर्य के गोचर के दौरान, सिंह जातकों में आत्मविश्वास और दृश्यता चरम पर होती है — ये उनकी सार्वजनिक मान्यता के शिखर काल होते हैं।',
    },
    elementTraits: {
      en: 'As a fixed fire sign, Leo burns with steady, unwavering intensity. Fire signs are passionate and expressive, but the fixed quality gives Leo remarkable staying power — unlike the flash of Aries, Leo\'s fire is sustained, like a hearth that warms an entire household through the coldest season.',
      hi: 'स्थिर अग्नि राशि होने के कारण, सिंह स्थिर और अडिग तीव्रता से जलता है। अग्नि राशियाँ भावुक और अभिव्यक्तिपूर्ण होती हैं, लेकिन स्थिर गुण सिंह को उल्लेखनीय टिकाऊपन देता है — मेष की चमक के विपरीत, सिंह की अग्नि निरंतर है, जैसे एक चूल्हा जो सबसे ठंडे मौसम में भी पूरे घर को गर्म रखता है।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: generosity, creativity, warmth, courage, and natural authority. Growth areas: pride, stubbornness, a craving for attention, and difficulty accepting criticism or sharing the spotlight.',
      hi: 'शक्तियाँ: उदारता, रचनात्मकता, उष्मा, साहस, और स्वाभाविक अधिकारशीलता। विकास क्षेत्र: अभिमान, हठ, ध्यान आकर्षित करने की लालसा, और आलोचना स्वीकारने या मंच साझा करने में कठिनाई।',
    },
    compatibility: {
      en: 'Naturally compatible with Aries and Sagittarius (fellow fire signs) and Gemini and Libra (air signs that appreciate Leo\'s warmth). More challenging dynamics with Taurus and Scorpio, where power struggles and control issues may surface.',
      hi: 'मेष और धनु (अग्नि राशियों) तथा मिथुन और तुला (वायु राशियों) के साथ स्वाभाविक अनुकूलता। वृषभ और वृश्चिक के साथ चुनौतीपूर्ण संबंध, जहाँ सत्ता संघर्ष और नियंत्रण के मुद्दे उभर सकते हैं।',
    },
  },

  // ─── 6. Kanya (Virgo) — Mercury, Earth, Mutable ───────────────────
  6: {
    personality: {
      en: 'Virgo (Kanya) is the sixth sign of the Vedic zodiac, ruled by Mercury. Kanya natives are analytical, detail-oriented, and driven by a deep desire to be of service. They possess a rare combination of intellectual precision and practical skill that makes them invaluable in any endeavour, though their perfectionism can sometimes become paralysing self-criticism.',
      hi: 'कन्या वैदिक राशिचक्र की छठी राशि है, जिसके स्वामी बुध हैं। कन्या जातक विश्लेषणात्मक, विस्तार-उन्मुख और सेवा की गहरी इच्छा से प्रेरित होते हैं। उनमें बौद्धिक सटीकता और व्यावहारिक कौशल का दुर्लभ संयोजन होता है जो उन्हें किसी भी कार्य में अमूल्य बनाता है, हालांकि उनकी पूर्णतावादिता कभी-कभी आत्म-आलोचना में बदल सकती है।',
    },
    rulerInfluence: {
      en: 'Mercury in Virgo operates at its analytical peak — this is where the planet of intellect meets earth\'s need for concrete results. A strong Mercury here produces skilled healers, researchers, and craftspeople who turn abstract knowledge into tangible solutions. Mercury retrograde periods push Virgo natives to review systems and refine processes rather than start new ones.',
      hi: 'कन्या में बुध अपने विश्लेषणात्मक शिखर पर कार्य करता है — यहाँ बुद्धि का ग्रह पृथ्वी तत्व की ठोस परिणामों की आवश्यकता से मिलता है। यहाँ शक्तिशाली बुध कुशल चिकित्सक, शोधकर्ता और शिल्पकार बनाता है जो अमूर्त ज्ञान को ठोस समाधानों में बदलते हैं। बुध वक्री काल कन्या जातकों को नई शुरुआत की बजाय मौजूदा प्रणालियों की समीक्षा और परिष्कृत करने के लिए प्रेरित करता है।',
    },
    elementTraits: {
      en: 'As a mutable earth sign, Virgo combines grounding practicality with adaptability. Earth signs seek tangible outcomes, and the mutable quality allows Virgo to adjust methods until the result is flawless. This makes them the master problem-solvers of the zodiac — they find the crack others miss and fix it quietly.',
      hi: 'द्विस्वभाव पृथ्वी राशि होने के कारण, कन्या में व्यावहारिकता और अनुकूलनशीलता का संयोजन है। पृथ्वी राशियाँ ठोस परिणाम चाहती हैं, और द्विस्वभाव गुण कन्या को तब तक विधि बदलने देता है जब तक परिणाम पूर्ण न हो। यह उन्हें राशिचक्र का सर्वश्रेष्ठ समस्या-समाधानकर्ता बनाता है।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: analytical mind, attention to detail, reliability, humility, and a genuine desire to help others. Growth areas: excessive worry, overcritical tendencies, difficulty relaxing, and a habit of undervaluing their own contributions.',
      hi: 'शक्तियाँ: विश्लेषणात्मक मन, विस्तार पर ध्यान, विश्वसनीयता, विनम्रता, और दूसरों की सहायता की सच्ची इच्छा। विकास क्षेत्र: अत्यधिक चिंता, आलोचनात्मक प्रवृत्ति, विश्राम में कठिनाई, और अपने योगदान को कम आँकने की आदत।',
    },
    compatibility: {
      en: 'Naturally compatible with Taurus and Capricorn (fellow earth signs) and Cancer and Scorpio (water signs that add emotional depth). More challenging dynamics with Gemini and Sagittarius, where differing priorities around detail versus big-picture thinking create friction.',
      hi: 'वृषभ और मकर (पृथ्वी राशियों) तथा कर्क और वृश्चिक (जल राशियों) के साथ स्वाभाविक अनुकूलता। मिथुन और धनु के साथ चुनौतीपूर्ण संबंध, जहाँ विस्तार बनाम बड़े दृष्टिकोण की भिन्न प्राथमिकताओं में घर्षण उत्पन्न होता है।',
    },
  },

  // ─── 7. Tula (Libra) — Venus, Air, Cardinal ───────────────────────
  7: {
    personality: {
      en: 'Libra (Tula) is the seventh sign of the Vedic zodiac, ruled by Venus. Tula natives are diplomats by nature — graceful, fair-minded, and deeply invested in harmony. They possess an instinctive understanding of balance in all things, from aesthetics to justice, though their desire to please everyone can sometimes leave them paralysed by indecision.',
      hi: 'तुला वैदिक राशिचक्र की सातवीं राशि है, जिसकी स्वामिनी शुक्र हैं। तुला जातक स्वभाव से कूटनीतिज्ञ होते हैं — शालीन, निष्पक्ष, और सामंजस्य में गहरी रुचि रखने वाले। उनमें सौंदर्य से लेकर न्याय तक, हर चीज़ में संतुलन की सहज समझ होती है, हालांकि सबको प्रसन्न करने की उनकी इच्छा कभी-कभी उन्हें अनिर्णय में फँसा देती है।',
    },
    rulerInfluence: {
      en: 'Venus in Libra expresses itself through relationships, aesthetics, and social grace rather than the sensual indulgence it shows in Taurus. A well-placed Venus here creates charming mediators, gifted designers, and natural peacemakers. Venus transits heighten Libra\'s desire for beautiful surroundings and meaningful partnerships.',
      hi: 'तुला में शुक्र स्वयं को संबंधों, सौंदर्यशास्त्र और सामाजिक शिष्टाचार के माध्यम से अभिव्यक्त करता है, न कि वृषभ जैसे इंद्रिय सुख से। यहाँ अच्छी स्थिति का शुक्र आकर्षक मध्यस्थ, प्रतिभाशाली डिज़ाइनर और स्वाभाविक शांतिदूत बनाता है। शुक्र के गोचर तुला की सुंदर परिवेश और सार्थक साझेदारियों की इच्छा को तीव्र करते हैं।',
    },
    elementTraits: {
      en: 'As a cardinal air sign, Libra initiates through ideas, dialogue, and social connection. Air signs are intellectually driven, and the cardinal quality gives Libra a proactive stance on fairness — they don\'t just think about justice, they actively create it. This combination makes them natural leaders in collaborative and creative fields.',
      hi: 'चर वायु राशि होने के कारण, तुला विचारों, संवाद और सामाजिक जुड़ाव से पहल करता है। वायु राशियाँ बौद्धिक रूप से प्रेरित होती हैं, और चर गुण तुला को निष्पक्षता पर सक्रिय रुख देता है — वे न्याय के बारे में केवल सोचते नहीं, बल्कि सक्रिय रूप से उसका निर्माण करते हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: diplomacy, fairness, charm, artistic sensitivity, and the ability to see all perspectives. Growth areas: indecisiveness, people-pleasing, avoidance of confrontation, and a tendency to lose their own identity in relationships.',
      hi: 'शक्तियाँ: कूटनीति, निष्पक्षता, आकर्षण, कलात्मक संवेदनशीलता, और सभी दृष्टिकोण देखने की क्षमता। विकास क्षेत्र: अनिर्णय, लोगों को प्रसन्न करने की प्रवृत्ति, टकराव से बचना, और संबंधों में अपनी पहचान खोने की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Gemini and Aquarius (fellow air signs) and Leo and Sagittarius (fire signs that bring passion to Libra\'s grace). More challenging dynamics with Cancer and Capricorn, where emotional intensity or rigid structure can feel stifling.',
      hi: 'मिथुन और कुम्भ (वायु राशियों) तथा सिंह और धनु (अग्नि राशियों) के साथ स्वाभाविक अनुकूलता। कर्क और मकर के साथ चुनौतीपूर्ण संबंध, जहाँ भावनात्मक तीव्रता या कठोर संरचना दमघोंटू लग सकती है।',
    },
  },

  // ─── 8. Vrishchik (Scorpio) — Mars, Water, Fixed ──────────────────
  8: {
    personality: {
      en: 'Scorpio (Vrishchik) is the eighth sign of the Vedic zodiac, ruled by Mars. Vrishchik natives are intensely perceptive, emotionally powerful, and drawn to the hidden depths of life — they are the alchemists of the zodiac. Their penetrating gaze misses nothing, and their capacity for transformation is unmatched, though this intensity can manifest as jealousy or obsessive control.',
      hi: 'वृश्चिक वैदिक राशिचक्र की आठवीं राशि है, जिसके स्वामी मंगल हैं। वृश्चिक जातक अत्यंत सूक्ष्मदर्शी, भावनात्मक रूप से शक्तिशाली और जीवन की छिपी गहराइयों की ओर आकर्षित होते हैं — वे राशिचक्र के कीमियागर हैं। उनकी भेदती दृष्टि कुछ भी नहीं चूकती, और परिवर्तन की उनकी क्षमता अतुलनीय है, हालांकि यह तीव्रता ईर्ष्या या जुनूनी नियंत्रण के रूप में भी प्रकट हो सकती है।',
    },
    rulerInfluence: {
      en: 'Mars in Scorpio operates with strategic cunning rather than Aries\' headlong charge. Here, Mars\' warrior energy turns inward — probing, investigating, and striking with surgical precision. A strong Mars in Scorpio produces fearless detectives, surgeons, and researchers who thrive in crisis. Mars transits can trigger periods of intense emotional purging and renewal for Vrishchik natives.',
      hi: 'वृश्चिक में मंगल मेष की सीधी आक्रामकता के बजाय रणनीतिक चतुराई से कार्य करता है। यहाँ मंगल की योद्धा ऊर्जा अंतर्मुखी हो जाती है — जाँच करती, खोजती, और शल्यक सटीकता से प्रहार करती है। वृश्चिक में शक्तिशाली मंगल निडर जासूस, शल्य चिकित्सक और शोधकर्ता बनाता है। मंगल के गोचर वृश्चिक जातकों में तीव्र भावनात्मक शुद्धि और नवीकरण के काल प्रारम्भ कर सकते हैं।',
    },
    elementTraits: {
      en: 'As a fixed water sign, Scorpio\'s emotions run deep and still, like an underground river. Water signs are intuitive and feeling, but the fixed quality gives Scorpio extraordinary emotional endurance — they can withstand what would break others. This makes them capable of profound loyalty but also of holding grudges indefinitely.',
      hi: 'स्थिर जल राशि होने के कारण, वृश्चिक की भावनाएँ गहरी और शांत होती हैं, जैसे एक भूमिगत नदी। जल राशियाँ सहज और भावनात्मक होती हैं, लेकिन स्थिर गुण वृश्चिक को असाधारण भावनात्मक सहनशक्ति देता है — वे वह सह सकते हैं जो दूसरों को तोड़ दे। यह उन्हें गहरी निष्ठा में सक्षम बनाता है, लेकिन अनिश्चित काल तक मन में बात रखने में भी।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: determination, resourcefulness, emotional courage, investigative acuity, and transformative power. Growth areas: jealousy, secretiveness, vindictiveness, and a tendency to test others\' loyalty to extremes.',
      hi: 'शक्तियाँ: दृढ़ संकल्प, संसाधनशीलता, भावनात्मक साहस, अन्वेषणात्मक तीक्ष्णता, और परिवर्तनकारी शक्ति। विकास क्षेत्र: ईर्ष्या, गोपनीयता, प्रतिशोधात्मकता, और दूसरों की निष्ठा को चरम सीमा तक परखने की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Cancer and Pisces (fellow water signs) and Virgo and Capricorn (earth signs that ground Scorpio\'s intensity). More challenging dynamics with Leo and Aquarius, where competing needs for control and independence create friction.',
      hi: 'कर्क और मीन (जल राशियों) तथा कन्या और मकर (पृथ्वी राशियों) के साथ स्वाभाविक अनुकूलता। सिंह और कुम्भ के साथ चुनौतीपूर्ण संबंध, जहाँ नियंत्रण और स्वतंत्रता की प्रतिस्पर्धी आवश्यकताओं में घर्षण उत्पन्न होता है।',
    },
  },

  // ─── 9. Dhanu (Sagittarius) — Jupiter, Fire, Mutable ──────────────
  9: {
    personality: {
      en: 'Sagittarius (Dhanu) is the ninth sign of the Vedic zodiac, ruled by Jupiter. Dhanu natives are philosophical seekers, eternal optimists, and lovers of freedom — they are the adventurers of the zodiac. Their expansive worldview and infectious laughter make them beloved companions, though their bluntness and restless wandering can strain commitments.',
      hi: 'धनु वैदिक राशिचक्र की नौवीं राशि है, जिसके स्वामी बृहस्पति हैं। धनु जातक दार्शनिक अन्वेषक, शाश्वत आशावादी और स्वतंत्रता के प्रेमी हैं — वे राशिचक्र के साहसिक यात्री हैं। उनका विस्तृत विश्वदृष्टिकोण और संक्रामक हँसी उन्हें प्रिय साथी बनाती है, हालांकि उनकी स्पष्टवादिता और बेचैन भटकाव प्रतिबद्धताओं पर दबाव डाल सकता है।',
    },
    rulerInfluence: {
      en: 'Jupiter grants Sagittarius boundless optimism, a thirst for higher knowledge, and natural good fortune. A dignified Jupiter in the chart produces teachers, philosophers, judges, and spiritual guides. Jupiter transits through favourable houses bring expansion — new studies, foreign travel, and opportunities that seem to arrive out of nowhere.',
      hi: 'बृहस्पति धनु को असीम आशावाद, उच्च ज्ञान की प्यास, और स्वाभाविक सौभाग्य प्रदान करता है। कुंडली में गरिमा में बृहस्पति शिक्षक, दार्शनिक, न्यायाधीश और आध्यात्मिक मार्गदर्शक बनाता है। अनुकूल भावों में बृहस्पति के गोचर विस्तार लाते हैं — नई शिक्षा, विदेश यात्रा, और अवसर जो अनायास प्रकट होते प्रतीत होते हैं।',
    },
    elementTraits: {
      en: 'As a mutable fire sign, Sagittarius burns bright but shifts direction freely. Fire signs are passionate and bold, and the mutable quality gives Dhanu an intellectual flexibility rare among fire signs — they blend the philosopher\'s mind with the warrior\'s spirit, seeking truth across cultures, religions, and disciplines.',
      hi: 'द्विस्वभाव अग्नि राशि होने के कारण, धनु उज्ज्वल रूप से जलता है लेकिन स्वतंत्र रूप से दिशा बदलता है। अग्नि राशियाँ उत्साही और साहसी होती हैं, और द्विस्वभाव गुण धनु को अग्नि राशियों में दुर्लभ बौद्धिक लचीलापन देता है — वे दार्शनिक के मन को योद्धा की भावना से जोड़ते हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: optimism, generosity, philosophical depth, adventurous spirit, and a contagious sense of humour. Growth areas: tactlessness, overcommitting, impatience with details, and a tendency to promise more than they can deliver.',
      hi: 'शक्तियाँ: आशावाद, उदारता, दार्शनिक गहराई, साहसिक भावना, और संक्रामक हास्यबोध। विकास क्षेत्र: बेबाकी, अत्यधिक प्रतिबद्धता, विवरणों में अधीरता, और वादे से अधिक कर दिखाने की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Aries and Leo (fellow fire signs) and Libra and Aquarius (air signs that share the love of ideas). More challenging dynamics with Virgo and Pisces, where Sagittarius\' big-picture focus clashes with their partner\'s need for nuance or emotional depth.',
      hi: 'मेष और सिंह (अग्नि राशियों) तथा तुला और कुम्भ (वायु राशियों) के साथ स्वाभाविक अनुकूलता। कन्या और मीन के साथ चुनौतीपूर्ण संबंध, जहाँ धनु का बड़ा दृष्टिकोण साथी की सूक्ष्मता या भावनात्मक गहराई की आवश्यकता से टकराता है।',
    },
  },

  // ─── 10. Makar (Capricorn) — Saturn, Earth, Cardinal ──────────────
  10: {
    personality: {
      en: 'Capricorn (Makar) is the tenth sign of the Vedic zodiac, ruled by Saturn. Makar natives are disciplined, ambitious, and possess an almost preternatural sense of timing — they understand that lasting achievement requires patience. Their quiet determination and strategic thinking often lead them to positions of authority, though their seriousness can sometimes be mistaken for coldness.',
      hi: 'मकर वैदिक राशिचक्र की दसवीं राशि है, जिसके स्वामी शनि हैं। मकर जातक अनुशासित, महत्वाकांक्षी, और समय की लगभग अलौकिक समझ रखते हैं — वे जानते हैं कि स्थायी उपलब्धि के लिए धैर्य आवश्यक है। उनका शांत दृढ़ संकल्प और रणनीतिक सोच उन्हें प्रायः अधिकार के पदों तक ले जाता है, हालांकि उनकी गंभीरता को कभी-कभी रूखापन समझ लिया जाता है।',
    },
    rulerInfluence: {
      en: 'Saturn teaches Capricorn through restriction, responsibility, and the rewards of perseverance. A well-placed Saturn creates executives, architects, and institution-builders who understand that structure is the foundation of all freedom. Saturn return periods (around ages 29 and 58) are profound turning points for Makar natives, demanding maturity and reshaping life direction.',
      hi: 'शनि मकर को प्रतिबंध, जिम्मेदारी, और दृढ़ता के पुरस्कारों के माध्यम से सिखाता है। अच्छी स्थिति का शनि कार्यकारी, वास्तुकार और संस्था-निर्माता बनाता है जो समझते हैं कि संरचना ही स्वतंत्रता की नींव है। शनि की साढ़ेसाती और वापसी (लगभग 29 और 58 वर्ष की आयु में) मकर जातकों के लिए गहन मोड़ होते हैं, जो परिपक्वता की माँग करते हैं।',
    },
    elementTraits: {
      en: 'As a cardinal earth sign, Capricorn takes initiative in the material world. Earth signs are grounded and practical, and the cardinal quality drives Capricorn to build empires — not for show, but for legacy. They are the architects of the zodiac, laying foundations meant to outlast a single lifetime.',
      hi: 'चर पृथ्वी राशि होने के कारण, मकर भौतिक संसार में पहल करता है। पृथ्वी राशियाँ यथार्थवादी और व्यावहारिक होती हैं, और चर गुण मकर को साम्राज्य बनाने के लिए प्रेरित करता है — दिखावे के लिए नहीं, बल्कि विरासत के लिए। वे राशिचक्र के वास्तुकार हैं, ऐसी नींव रखते हैं जो एक जीवनकाल से आगे तक टिके।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: discipline, responsibility, strategic thinking, patience, and an unshakeable work ethic. Growth areas: pessimism, emotional repression, workaholism, and a tendency to measure people by their productivity or status.',
      hi: 'शक्तियाँ: अनुशासन, जिम्मेदारी, रणनीतिक सोच, धैर्य, और अटल कार्य नैतिकता। विकास क्षेत्र: निराशावाद, भावनात्मक दमन, कार्यमय जीवन, और लोगों को उनकी उत्पादकता या प्रतिष्ठा से मापने की प्रवृत्ति।',
    },
    compatibility: {
      en: 'Naturally compatible with Taurus and Virgo (fellow earth signs) and Scorpio and Pisces (water signs that soften Saturn\'s rigidity). More challenging dynamics with Aries and Libra, where Capricorn\'s methodical pace frustrates more impulsive or indecisive partners.',
      hi: 'वृषभ और कन्या (पृथ्वी राशियों) तथा वृश्चिक और मीन (जल राशियों) के साथ स्वाभाविक अनुकूलता। मेष और तुला के साथ चुनौतीपूर्ण संबंध, जहाँ मकर की व्यवस्थित गति आवेगी या अनिर्णयी साथियों को निराश करती है।',
    },
  },

  // ─── 11. Kumbh (Aquarius) — Saturn, Air, Fixed ────────────────────
  11: {
    personality: {
      en: 'Aquarius (Kumbh) is the eleventh sign of the Vedic zodiac, ruled by Saturn. Kumbh natives are visionary thinkers, humanitarian idealists, and fiercely independent — they march to a rhythm only they can hear. Their ability to think decades ahead and champion collective progress makes them natural reformers, though their emotional detachment can create distance in personal relationships.',
      hi: 'कुम्भ वैदिक राशिचक्र की ग्यारहवीं राशि है, जिसके स्वामी शनि हैं। कुम्भ जातक दूरदर्शी विचारक, मानवतावादी आदर्शवादी और अत्यंत स्वतंत्र होते हैं — वे एक ऐसी लय पर चलते हैं जो केवल वे ही सुन सकते हैं। दशकों आगे सोचने और सामूहिक प्रगति का समर्थन करने की उनकी क्षमता उन्हें स्वाभाविक सुधारक बनाती है, हालांकि उनकी भावनात्मक अलगाव व्यक्तिगत संबंधों में दूरी बना सकती है।',
    },
    rulerInfluence: {
      en: 'Saturn in Aquarius operates through systems, networks, and social structures rather than Capricorn\'s personal ambition. Here, Saturn\'s discipline serves the collective — Kumbh natives build organisations, movements, and technologies that uplift communities. Saturn transits push Aquarius to refine their social mission and confront whether their idealism translates into real impact.',
      hi: 'कुम्भ में शनि मकर की व्यक्तिगत महत्वाकांक्षा के बजाय प्रणालियों, नेटवर्क और सामाजिक संरचनाओं के माध्यम से कार्य करता है। यहाँ शनि का अनुशासन सामूहिक की सेवा करता है — कुम्भ जातक ऐसे संगठन, आंदोलन और प्रौद्योगिकियाँ बनाते हैं जो समुदायों का उत्थान करें। शनि के गोचर कुम्भ को अपने सामाजिक मिशन को परिष्कृत करने के लिए प्रेरित करते हैं।',
    },
    elementTraits: {
      en: 'As a fixed air sign, Aquarius holds firm to ideas and principles with remarkable tenacity. Air signs are intellectual and communicative, and the fixed quality gives Kumbh the perseverance to see revolutionary ideas through to completion — they don\'t just think about change, they build the infrastructure for it.',
      hi: 'स्थिर वायु राशि होने के कारण, कुम्भ उल्लेखनीय दृढ़ता से विचारों और सिद्धांतों पर अडिग रहता है। वायु राशियाँ बौद्धिक और संवादात्मक होती हैं, और स्थिर गुण कुम्भ को क्रांतिकारी विचारों को पूर्णता तक पहुँचाने की दृढ़ता देता है — वे केवल बदलाव के बारे में सोचते नहीं, बल्कि उसके लिए ढाँचा बनाते हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: originality, humanitarian vision, intellectual independence, progressive thinking, and unwavering commitment to principles. Growth areas: emotional aloofness, stubbornness about ideas, contrarianism for its own sake, and difficulty with intimate emotional connection.',
      hi: 'शक्तियाँ: मौलिकता, मानवतावादी दृष्टि, बौद्धिक स्वतंत्रता, प्रगतिशील सोच, और सिद्धांतों के प्रति अडिग प्रतिबद्धता। विकास क्षेत्र: भावनात्मक अलगाव, विचारों में हठ, विरोध के लिए विरोध, और घनिष्ठ भावनात्मक जुड़ाव में कठिनाई।',
    },
    compatibility: {
      en: 'Naturally compatible with Gemini and Libra (fellow air signs) and Aries and Sagittarius (fire signs that match Aquarius\' independent spirit). More challenging dynamics with Taurus and Scorpio, where Aquarius\' need for freedom clashes with their partner\'s desire for security and emotional depth.',
      hi: 'मिथुन और तुला (वायु राशियों) तथा मेष और धनु (अग्नि राशियों) के साथ स्वाभाविक अनुकूलता। वृषभ और वृश्चिक के साथ चुनौतीपूर्ण संबंध, जहाँ कुम्भ की स्वतंत्रता की आवश्यकता साथी की सुरक्षा और भावनात्मक गहराई की इच्छा से टकराती है।',
    },
  },

  // ─── 12. Meen (Pisces) — Jupiter, Water, Mutable ──────────────────
  12: {
    personality: {
      en: 'Pisces (Meen) is the twelfth and final sign of the Vedic zodiac, ruled by Jupiter. Meen natives are profoundly intuitive, compassionate, and spiritually attuned — they carry the wisdom of all eleven signs that precede them. Their boundless empathy and vivid imagination make them natural artists and healers, though their porous boundaries can leave them absorbing others\' pain as their own.',
      hi: 'मीन वैदिक राशिचक्र की बारहवीं और अंतिम राशि है, जिसके स्वामी बृहस्पति हैं। मीन जातक अत्यंत सहज ज्ञानी, करुणामय और आध्यात्मिक रूप से सचेत होते हैं — वे अपने पहले की सभी ग्यारह राशियों की बुद्धि अपने भीतर लिए चलते हैं। उनकी असीम सहानुभूति और सजीव कल्पनाशीलता उन्हें स्वाभाविक कलाकार और चिकित्सक बनाती है, हालांकि उनकी झिरझिरी सीमाएँ उन्हें दूसरों की पीड़ा को अपनी बना लेने की ओर ले जा सकती हैं।',
    },
    rulerInfluence: {
      en: 'Jupiter in Pisces expresses itself through faith, compassion, and spiritual expansion rather than Sagittarius\' worldly adventure. A well-placed Jupiter here produces mystics, counsellors, and artists whose work carries transcendent meaning. Jupiter transits through Pisces are periods of spiritual awakening, creative flowering, and the dissolution of old limitations for Meen natives.',
      hi: 'मीन में बृहस्पति स्वयं को धनु के सांसारिक साहस के बजाय श्रद्धा, करुणा और आध्यात्मिक विस्तार के माध्यम से अभिव्यक्त करता है। यहाँ अच्छी स्थिति का बृहस्पति रहस्यवादी, परामर्शदाता और ऐसे कलाकार बनाता है जिनके कार्य में अलौकिक अर्थ होता है। बृहस्पति के मीन में गोचर आध्यात्मिक जागृति, रचनात्मक पुष्पन और पुरानी सीमाओं के विसर्जन के काल होते हैं।',
    },
    elementTraits: {
      en: 'As a mutable water sign, Pisces flows and adapts like the ocean itself — boundless, shape-shifting, and deeply connected to unseen currents. Water signs are emotional and intuitive, and the mutable quality gives Meen an almost chameleon-like sensitivity to their environment. They absorb the mood of every room they enter, for better or worse.',
      hi: 'द्विस्वभाव जल राशि होने के कारण, मीन स्वयं महासागर की तरह बहता और अनुकूलित होता है — असीम, आकार बदलता, और अदृश्य धाराओं से गहराई से जुड़ा। जल राशियाँ भावनात्मक और सहज होती हैं, और द्विस्वभाव गुण मीन को अपने परिवेश के प्रति लगभग गिरगिट जैसी संवेदनशीलता देता है — वे हर कमरे का मिज़ाज अपने भीतर समा लेते हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: compassion, artistic genius, spiritual depth, adaptability, and an intuitive understanding of human suffering. Growth areas: escapism, indecisiveness, tendency towards martyrdom, and difficulty maintaining practical boundaries in relationships and work.',
      hi: 'शक्तियाँ: करुणा, कलात्मक प्रतिभा, आध्यात्मिक गहराई, अनुकूलनशीलता, और मानवीय पीड़ा की सहज समझ। विकास क्षेत्र: पलायनवाद, अनिर्णय, बलिदान की प्रवृत्ति, और संबंधों तथा कार्य में व्यावहारिक सीमाएँ बनाए रखने में कठिनाई।',
    },
    compatibility: {
      en: 'Naturally compatible with Cancer and Scorpio (fellow water signs) and Taurus and Capricorn (earth signs that provide the structure Pisces needs). More challenging dynamics with Gemini and Sagittarius, where Pisces\' emotional depth can feel overwhelming to more intellectually oriented partners.',
      hi: 'कर्क और वृश्चिक (जल राशियों) तथा वृषभ और मकर (पृथ्वी राशियों) के साथ स्वाभाविक अनुकूलता। मिथुन और धनु के साथ चुनौतीपूर्ण संबंध, जहाँ मीन की भावनात्मक गहराई अधिक बौद्धिक रूप से उन्मुख साथियों के लिए भारी पड़ सकती है।',
    },
  },
};

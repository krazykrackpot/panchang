/**
 * Drekkana (D3) Chart — 36 Decanate Faces
 * Reference: Varahamihira's Brihat Jataka Ch.27
 *
 * Each sign is divided into 3 decanates of 10° each.
 * Ruling signs follow the triplicity (element) pattern:
 *   Fire signs (1,5,9): decanates ruled by Aries, Leo, Sagittarius
 *   Earth signs (2,6,10): decanates ruled by Taurus, Virgo, Capricorn
 *   Air signs (3,7,11): decanates ruled by Gemini, Libra, Aquarius
 *   Water signs (4,8,12): decanates ruled by Cancer, Scorpio, Pisces
 */

export interface DrekkanaFace {
  signId: number;      // 1-12
  decanate: number;    // 1-3 (0-10°, 10-20°, 20-30°)
  rulingSign: number;  // The sign that rules this decanate
  image: { en: string; hi: string };           // Traditional Varahamihira image
  interpretation: { en: string; hi: string };  // Meaning for planets placed here
  keywords: string[];
}

// Element groupings for triplicity decanate rulers
// Fire: Aries(1), Leo(5), Sagittarius(9)
// Earth: Taurus(2), Virgo(6), Capricorn(10)
// Air: Gemini(3), Libra(7), Aquarius(11)
// Water: Cancer(4), Scorpio(8), Pisces(12)
const TRIPLICITY: Record<number, [number, number, number]> = {
  1: [1, 5, 9],   // Fire
  2: [2, 6, 10],  // Earth
  3: [3, 7, 11],  // Air
  4: [4, 8, 12],  // Water
};

function getElement(signId: number): number {
  // 1=Fire, 2=Earth, 3=Air, 4=Water
  return ((signId - 1) % 4) + 1;
}

function getRulingSign(signId: number, decanate: number): number {
  const element = getElement(signId);
  return TRIPLICITY[element][decanate - 1];
}

export const DREKKANA_FACES: DrekkanaFace[] = [
  // ─── ARIES (1) ───────────────────────────────────────────────────────────────
  {
    signId: 1, decanate: 1, rulingSign: 1,
    image: {
      en: 'A dark-complexioned man with red garments, fiery eyes, and an axe — fierce and ready for action.',
      hi: 'लाल वस्त्र पहने, अग्निमय नेत्रों वाला, कुल्हाड़ी धारण किए एक श्यामवर्णी पुरुष — उग्र और कर्मशील।',
    },
    interpretation: {
      en: 'Planets here bestow courage, initiative, and a pioneering spirit. The native takes bold action but may act impulsively. Leadership comes naturally but patience must be cultivated.',
      hi: 'यहाँ स्थित ग्रह साहस, पहल और अग्रणी भावना प्रदान करते हैं। जातक साहसिक कार्य करता है परंतु आवेगी हो सकता है। नेतृत्व स्वाभाविक आता है किंतु धैर्य विकसित करना आवश्यक है।',
    },
    keywords: ['courage', 'initiative', 'impulsiveness', 'leadership'],
  },
  {
    signId: 1, decanate: 2, rulingSign: 5,
    image: {
      en: 'A woman wearing white garlands, with a horse face, hungry and thirsty, fierce in temperament.',
      hi: 'श्वेत मालाधारी एक स्त्री, अश्वमुखी, भूख-प्यास से व्याकुल, उग्र स्वभाव की।',
    },
    interpretation: {
      en: 'Planets here combine Arian drive with Leonine pride. The native craves recognition and may pursue creative ambitions relentlessly. Nobility and generosity emerge through self-expression.',
      hi: 'यहाँ ग्रह मेष की ऊर्जा और सिंह के गर्व का संयोग करते हैं। जातक प्रसिद्धि की लालसा रखता है और रचनात्मक महत्वाकांक्षाओं का दृढ़ता से पीछा करता है। आत्माभिव्यक्ति से उदारता प्रकट होती है।',
    },
    keywords: ['ambition', 'pride', 'creativity', 'recognition'],
  },
  {
    signId: 1, decanate: 3, rulingSign: 9,
    image: {
      en: 'A cruel man with a yellow complexion, skilled in arts, wearing red cloth and holding a staff.',
      hi: 'पीले वर्ण का एक क्रूर पुरुष, कलाओं में निपुण, लाल वस्त्र और दण्ड धारण किए हुए।',
    },
    interpretation: {
      en: 'Planets here infuse action with philosophical purpose. The native fights for beliefs and ideals. Travel, teaching, and moral crusades define this decanate. Excess righteousness can alienate others.',
      hi: 'यहाँ ग्रह कर्म को दार्शनिक उद्देश्य से जोड़ते हैं। जातक विश्वासों और आदर्शों के लिए संघर्ष करता है। यात्रा, शिक्षण और नैतिक अभियान इस दशमांश की विशेषता है।',
    },
    keywords: ['philosophy', 'idealism', 'teaching', 'travel'],
  },

  // ─── TAURUS (2) ──────────────────────────────────────────────────────────────
  {
    signId: 2, decanate: 1, rulingSign: 2,
    image: {
      en: 'A woman with torn hair, hungry, with a pot on her head, wearing dirty clothes, seeking food.',
      hi: 'बिखरे बालों वाली एक स्त्री, भूखी, सिर पर घड़ा लिए, मैले वस्त्रों में, भोजन की खोज में।',
    },
    interpretation: {
      en: 'Planets here give a deep need for material security and sensory pleasure. The native is practical and determined but may become possessive. Wealth accumulates slowly through persistent effort.',
      hi: 'यहाँ ग्रह भौतिक सुरक्षा और इंद्रिय सुख की गहरी आवश्यकता देते हैं। जातक व्यावहारिक और दृढ़ है किंतु अधिकार-भाव रख सकता है। निरंतर प्रयास से धन धीरे-धीरे संचित होता है।',
    },
    keywords: ['security', 'persistence', 'possessiveness', 'wealth'],
  },
  {
    signId: 2, decanate: 2, rulingSign: 6,
    image: {
      en: 'A man with a hungry body, dark complexion, possessing knowledge of lands and farming.',
      hi: 'भूखे शरीर वाला, श्यामवर्णी पुरुष, भूमि और कृषि का ज्ञाता।',
    },
    interpretation: {
      en: 'Planets here combine Taurean stability with Virgoan analysis. The native excels in practical crafts, agriculture, and detailed work. Health consciousness and service to others define the approach to life.',
      hi: 'यहाँ ग्रह वृषभ की स्थिरता और कन्या के विश्लेषण का संयोग करते हैं। जातक व्यावहारिक शिल्प, कृषि और विस्तृत कार्य में उत्कृष्ट होता है। स्वास्थ्य चेतना और सेवा जीवन दृष्टिकोण को परिभाषित करती है।',
    },
    keywords: ['craftsmanship', 'analysis', 'health', 'service'],
  },
  {
    signId: 2, decanate: 3, rulingSign: 10,
    image: {
      en: 'A man with a body like an elephant, white-toothed, yellow-skinned, with large thighs, skilled in trade.',
      hi: 'हाथी जैसे शरीर वाला, श्वेतदन्त, पीतवर्णी, विशाल जंघाओं वाला, व्यापार में कुशल पुरुष।',
    },
    interpretation: {
      en: 'Planets here drive toward institutional power and worldly achievement. The native builds empires slowly, valuing tradition and status. Material mastery is pursued with methodical Capricornian discipline.',
      hi: 'यहाँ ग्रह संस्थागत शक्ति और सांसारिक उपलब्धि की ओर प्रेरित करते हैं। जातक परम्परा और प्रतिष्ठा को महत्व देते हुए धीरे-धीरे साम्राज्य बनाता है। मकर की अनुशासित पद्धति से भौतिक सिद्धि प्राप्त होती है।',
    },
    keywords: ['status', 'institution', 'discipline', 'achievement'],
  },

  // ─── GEMINI (3) ──────────────────────────────────────────────────────────────
  {
    signId: 3, decanate: 1, rulingSign: 3,
    image: {
      en: 'A woman skilled in needle-work, fond of ornaments, beautiful, residing in a garden.',
      hi: 'सिलाई-कढ़ाई में निपुण, आभूषणप्रिय, सुंदर, उद्यान में निवास करने वाली स्त्री।',
    },
    interpretation: {
      en: 'Planets here bestow intellectual curiosity, communication skill, and manual dexterity. The native is versatile and sociable but may scatter energies. Writing, teaching, and commerce are natural outlets.',
      hi: 'यहाँ ग्रह बौद्धिक जिज्ञासा, संवाद कौशल और हस्तकुशलता प्रदान करते हैं। जातक बहुमुखी और मिलनसार है किंतु ऊर्जा बिखर सकती है। लेखन, शिक्षण और वाणिज्य स्वाभाविक अभिव्यक्ति हैं।',
    },
    keywords: ['communication', 'curiosity', 'versatility', 'commerce'],
  },
  {
    signId: 3, decanate: 2, rulingSign: 7,
    image: {
      en: 'A man in a garden, wearing armor, with a bow, face like that of Garuda, fond of play.',
      hi: 'उद्यान में कवचधारी, धनुर्धर, गरुड़ जैसे मुख वाला, क्रीड़ाप्रिय पुरुष।',
    },
    interpretation: {
      en: 'Planets here merge mental agility with Libran diplomacy. The native excels in negotiation, law, and artistic expression. Partnerships are intellectualized; fairness and balance become guiding principles.',
      hi: 'यहाँ ग्रह मानसिक चपलता और तुला की कूटनीति का मेल करते हैं। जातक वार्ता, विधि और कलात्मक अभिव्यक्ति में उत्कृष्ट होता है। साझेदारियाँ बौद्धिक होती हैं; निष्पक्षता और संतुलन मार्गदर्शक सिद्धांत बनते हैं।',
    },
    keywords: ['diplomacy', 'partnership', 'art', 'balance'],
  },
  {
    signId: 3, decanate: 3, rulingSign: 11,
    image: {
      en: 'A man with armor and weapons, adorned with gems, with the face of a monkey, residing in a fort.',
      hi: 'कवच और शस्त्रधारी, रत्नभूषित, वानरमुखी, दुर्ग में निवासी पुरुष।',
    },
    interpretation: {
      en: 'Planets here combine Geminian intellect with Aquarian vision. The native thinks in systems and networks, championing humanitarian ideals. Innovation through communication and group endeavors is highlighted.',
      hi: 'यहाँ ग्रह मिथुन की बुद्धि और कुम्भ की दूरदृष्टि का संयोग करते हैं। जातक तंत्र और नेटवर्क में सोचता है, मानवतावादी आदर्शों का समर्थन करता है। संवाद और सामूहिक प्रयास से नवाचार होता है।',
    },
    keywords: ['innovation', 'networks', 'humanitarian', 'systems'],
  },

  // ─── CANCER (4) ──────────────────────────────────────────────────────────────
  {
    signId: 4, decanate: 1, rulingSign: 4,
    image: {
      en: 'A man standing among palm trees, with the body of a horse, holding fruits and roots, with a pig face.',
      hi: 'ताड़ वृक्षों के बीच खड़ा, अश्वशरीर, फल-मूल धारण किए, सूकरमुखी पुरुष।',
    },
    interpretation: {
      en: 'Planets here intensify emotional sensitivity and nurturing instincts. The native builds deep roots in home and family. Intuition is powerful, but mood swings and attachment can overwhelm rational thought.',
      hi: 'यहाँ ग्रह भावनात्मक संवेदनशीलता और पालन-पोषण की प्रवृत्ति को तीव्र करते हैं। जातक घर और परिवार में गहरी जड़ें जमाता है। अंतर्ज्ञान शक्तिशाली है किंतु मनोदशा परिवर्तन और आसक्ति तर्क पर भारी पड़ सकती है।',
    },
    keywords: ['nurturing', 'intuition', 'home', 'emotion'],
  },
  {
    signId: 4, decanate: 2, rulingSign: 8,
    image: {
      en: 'A woman with a serpent body, with lotus flowers on her head, weeping in a forest.',
      hi: 'सर्पशरीरा स्त्री, सिर पर कमल पुष्प, वन में रोती हुई।',
    },
    interpretation: {
      en: 'Planets here add Scorpionic depth and transformative power to Cancerian emotion. The native experiences intense inner states and seeks truth beneath surfaces. Healing abilities and psychic sensitivity are heightened.',
      hi: 'यहाँ ग्रह कर्क की भावनाओं में वृश्चिक की गहराई और परिवर्तनकारी शक्ति जोड़ते हैं। जातक तीव्र आंतरिक अवस्थाओं का अनुभव करता है और सतह के नीचे सत्य खोजता है। उपचार और अतींद्रिय संवेदनशीलता बढ़ती है।',
    },
    keywords: ['transformation', 'depth', 'healing', 'psychic'],
  },
  {
    signId: 4, decanate: 3, rulingSign: 12,
    image: {
      en: 'A man decorated with gold ornaments, crossing the ocean in a ship with serpents.',
      hi: 'स्वर्णाभूषित पुरुष, सर्पों सहित जलयान में सागर पार करता हुआ।',
    },
    interpretation: {
      en: 'Planets here blend emotional depth with Piscean spirituality. The native is compassionate, dreamy, and drawn to mysticism. Sacrifice for loved ones is instinctive, but boundaries must be consciously maintained.',
      hi: 'यहाँ ग्रह भावनात्मक गहराई और मीन की आध्यात्मिकता का मिश्रण करते हैं। जातक करुणामय, स्वप्नदर्शी और रहस्यवाद की ओर आकर्षित होता है। प्रियजनों के लिए त्याग सहज है किंतु सीमाएँ सचेत रूप से बनानी आवश्यक हैं।',
    },
    keywords: ['spirituality', 'compassion', 'sacrifice', 'mysticism'],
  },

  // ─── LEO (5) ─────────────────────────────────────────────────────────────────
  {
    signId: 5, decanate: 1, rulingSign: 5,
    image: {
      en: 'A vulture seated on a silk-cotton tree, with a dog face and white garments.',
      hi: 'सेमल वृक्ष पर बैठा गिद्ध, श्वानमुखी, श्वेत वस्त्रधारी।',
    },
    interpretation: {
      en: 'Planets here grant regal confidence, artistic flair, and commanding presence. The native demands attention and leads by example. Generosity flows naturally, but vanity can undermine genuine authority.',
      hi: 'यहाँ ग्रह राजसी आत्मविश्वास, कलात्मक प्रतिभा और प्रभावशाली व्यक्तित्व प्रदान करते हैं। जातक ध्यान आकर्षित करता है और उदाहरण से नेतृत्व करता है। उदारता स्वाभाविक है किंतु घमंड वास्तविक अधिकार को कमजोर कर सकता है।',
    },
    keywords: ['confidence', 'authority', 'generosity', 'vanity'],
  },
  {
    signId: 5, decanate: 2, rulingSign: 9,
    image: {
      en: 'A man with a horse face, wearing a white crown, holding a bow, with a deer skin.',
      hi: 'अश्वमुखी पुरुष, श्वेत मुकुट, धनुष और मृगचर्म धारण किए।',
    },
    interpretation: {
      en: 'Planets here unite Leonine majesty with Sagittarian wisdom. The native inspires through vision and teaching. Politics, religion, and higher learning attract powerfully. Authority is exercised with moral conviction.',
      hi: 'यहाँ ग्रह सिंह की गरिमा और धनु की बुद्धिमत्ता को जोड़ते हैं। जातक दृष्टि और शिक्षण से प्रेरित करता है। राजनीति, धर्म और उच्च शिक्षा शक्तिशाली रूप से आकर्षित करती हैं।',
    },
    keywords: ['vision', 'teaching', 'politics', 'moral authority'],
  },
  {
    signId: 5, decanate: 3, rulingSign: 1,
    image: {
      en: 'A man with a bear face, holding fruit, with a monkey on his head, cruel in nature.',
      hi: 'भालू के मुख वाला पुरुष, फल धारण किए, सिर पर वानर, क्रूर स्वभाव।',
    },
    interpretation: {
      en: 'Planets here combine Leonine pride with Arian aggression. The native is a warrior-king — courageous, commanding, and impatient. Creative energy is channeled through physical action. Temper must be mastered.',
      hi: 'यहाँ ग्रह सिंह के गर्व और मेष की आक्रामकता का संयोग करते हैं। जातक योद्धा-राजा है — साहसी, प्रभावशाली और अधीर। रचनात्मक ऊर्जा शारीरिक क्रिया से प्रवाहित होती है। क्रोध पर नियंत्रण आवश्यक है।',
    },
    keywords: ['warrior', 'command', 'impatience', 'action'],
  },

  // ─── VIRGO (6) ────────────────────────────────────────────────────────────────
  {
    signId: 6, decanate: 1, rulingSign: 6,
    image: {
      en: 'A virgin holding a pot and a spoon, going to a place of worship, wearing colorful garments.',
      hi: 'कन्या, घड़ा और चम्मच लिए, पूजा स्थल की ओर जाती हुई, रंगीन वस्त्रधारी।',
    },
    interpretation: {
      en: 'Planets here sharpen analytical faculties and devotion to craft. The native excels in medicine, accounting, and detail-oriented service. Perfectionism is a strength that can become self-critical paralysis.',
      hi: 'यहाँ ग्रह विश्लेषणात्मक शक्तियों और शिल्प के प्रति समर्पण को तीक्ष्ण करते हैं। जातक चिकित्सा, लेखा और विस्तारमूलक सेवा में उत्कृष्ट होता है। पूर्णतावाद शक्ति है जो आत्म-आलोचनात्मक जड़ता बन सकती है।',
    },
    keywords: ['analysis', 'service', 'perfectionism', 'medicine'],
  },
  {
    signId: 6, decanate: 2, rulingSign: 10,
    image: {
      en: 'A man with a dark body, big head, with a pen and books, ready for counting and writing.',
      hi: 'श्यामवर्णी, बड़े सिर वाला पुरुष, कलम और पुस्तकों सहित, गणना और लेखन हेतु तत्पर।',
    },
    interpretation: {
      en: 'Planets here combine Virgoan precision with Capricornian ambition. The native builds methodical systems, excelling in bureaucracy, engineering, and administrative roles. Professional recognition through competence, not charisma.',
      hi: 'यहाँ ग्रह कन्या की सटीकता और मकर की महत्वाकांक्षा का संयोग करते हैं। जातक व्यवस्थित तंत्र बनाता है, प्रशासन, अभियांत्रिकी में उत्कृष्ट होता है। व्यावसायिक मान्यता योग्यता से आती है, करिश्मे से नहीं।',
    },
    keywords: ['system', 'bureaucracy', 'engineering', 'competence'],
  },
  {
    signId: 6, decanate: 3, rulingSign: 2,
    image: {
      en: 'A tall woman, white-complexioned, with loose hair, going to a temple with a pot.',
      hi: 'लम्बी, गोरी स्त्री, खुले बालों वाली, घड़ा लिए मन्दिर जाती हुई।',
    },
    interpretation: {
      en: 'Planets here blend Virgoan intellect with Taurean sensuality. The native finds pleasure in practical beauty — cooking, gardening, artisanal work. Financial prudence and aesthetic taste combine productively.',
      hi: 'यहाँ ग्रह कन्या की बुद्धि और वृषभ की इन्द्रियता का मिश्रण करते हैं। जातक व्यावहारिक सौंदर्य में आनंद पाता है — पाककला, बागवानी, दस्तकारी। वित्तीय विवेक और सौंदर्य बोध उत्पादक रूप से मिलते हैं।',
    },
    keywords: ['beauty', 'artisan', 'prudence', 'practical aesthetics'],
  },

  // ─── LIBRA (7) ────────────────────────────────────────────────────────────────
  {
    signId: 7, decanate: 1, rulingSign: 7,
    image: {
      en: 'A man holding a balance in a market, with a thoughtful expression, skilled in trading.',
      hi: 'बाज़ार में तराजू लिए विचारशील भाव वाला, व्यापार में कुशल पुरुष।',
    },
    interpretation: {
      en: 'Planets here emphasize partnership, justice, and harmony. The native excels in law, diplomacy, and social mediation. Beauty and balance are pursued in all things, though indecision can be a constant struggle.',
      hi: 'यहाँ ग्रह साझेदारी, न्याय और सामंजस्य पर बल देते हैं। जातक विधि, कूटनीति और सामाजिक मध्यस्थता में उत्कृष्ट होता है। सौंदर्य और संतुलन सभी विषयों में खोजा जाता है, किंतु अनिर्णय निरंतर संघर्ष बना रहता है।',
    },
    keywords: ['justice', 'harmony', 'partnership', 'indecision'],
  },
  {
    signId: 7, decanate: 2, rulingSign: 11,
    image: {
      en: 'A man with a vulture face, hungry, holding a pot, wandering in search of food.',
      hi: 'गिद्धमुखी, भूखा पुरुष, घड़ा लिए, भोजन की खोज में भटकता हुआ।',
    },
    interpretation: {
      en: 'Planets here unite Libran aesthetics with Aquarian idealism. The native envisions a fair society and works toward collective harmony. Friendships and group affiliations carry great importance.',
      hi: 'यहाँ ग्रह तुला के सौंदर्यबोध और कुम्भ के आदर्शवाद को जोड़ते हैं। जातक न्यायपूर्ण समाज की कल्पना करता है और सामूहिक सामंजस्य के लिए कार्य करता है। मित्रता और समूह सम्बद्धता का बहुत महत्व है।',
    },
    keywords: ['idealism', 'collective', 'friendship', 'social reform'],
  },
  {
    signId: 7, decanate: 3, rulingSign: 3,
    image: {
      en: 'A man adorned with jewels, with a monkey-like body, holding fruits, skilled in arts.',
      hi: 'रत्नाभूषित, वानर जैसे शरीर वाला, फल धारण किए, कलाओं में निपुण पुरुष।',
    },
    interpretation: {
      en: 'Planets here merge Libran charm with Geminian wit. The native is a natural communicator and social connector. Writing, art criticism, and intellectual partnerships thrive. Superficiality is the shadow to watch.',
      hi: 'यहाँ ग्रह तुला के आकर्षण और मिथुन की बुद्धिमत्ता का मिश्रण करते हैं। जातक स्वाभाविक संवादक और सामाजिक संयोजक है। लेखन, कला समीक्षा और बौद्धिक साझेदारियाँ फलती-फूलती हैं।',
    },
    keywords: ['charm', 'wit', 'art', 'social connection'],
  },

  // ─── SCORPIO (8) ──────────────────────────────────────────────────────────────
  {
    signId: 8, decanate: 1, rulingSign: 8,
    image: {
      en: 'A beautiful woman with serpents, naked, bound in chains, alone on a deserted shore.',
      hi: 'सर्पों सहित सुंदर स्त्री, नग्न, शृंखलाओं में बँधी, निर्जन तट पर अकेली।',
    },
    interpretation: {
      en: 'Planets here bring intense willpower, secrecy, and transformative experiences. The native confronts hidden truths fearlessly. Regeneration through crisis is a recurring theme. Trust is given sparingly.',
      hi: 'यहाँ ग्रह तीव्र इच्छाशक्ति, गोपनीयता और परिवर्तनकारी अनुभव लाते हैं। जातक निर्भय होकर छुपे सत्य का सामना करता है। संकट से पुनर्जन्म बारम्बार विषय है। विश्वास कम ही दिया जाता है।',
    },
    keywords: ['willpower', 'secrecy', 'transformation', 'crisis'],
  },
  {
    signId: 8, decanate: 2, rulingSign: 12,
    image: {
      en: 'A woman with a tortoise body, covered in flowers, fond of home and comfort.',
      hi: 'कूर्मशरीरा स्त्री, पुष्पाच्छादित, गृह और सुख की प्रेमी।',
    },
    interpretation: {
      en: 'Planets here deepen Scorpionic intensity with Piscean surrender. The native is drawn to spiritual transformation and mystical exploration. Compassion emerges through personal suffering; isolation can be both refuge and prison.',
      hi: 'यहाँ ग्रह वृश्चिक की तीव्रता में मीन के समर्पण की गहराई जोड़ते हैं। जातक आध्यात्मिक परिवर्तन और रहस्यमय अन्वेषण की ओर आकर्षित होता है। व्यक्तिगत पीड़ा से करुणा उत्पन्न होती है।',
    },
    keywords: ['surrender', 'mystical', 'compassion', 'isolation'],
  },
  {
    signId: 8, decanate: 3, rulingSign: 4,
    image: {
      en: 'A man with a lion face, bound in chains, holding serpents and a tortoise.',
      hi: 'सिंहमुखी पुरुष, शृंखलाओं में बँधा, सर्प और कूर्म धारण किए।',
    },
    interpretation: {
      en: 'Planets here blend Scorpionic power with Cancerian protectiveness. The native guards family and loved ones fiercely. Emotional manipulation is the shadow side; constructive channeling creates profound nurturing.',
      hi: 'यहाँ ग्रह वृश्चिक की शक्ति और कर्क की सुरक्षात्मकता का मिश्रण करते हैं। जातक परिवार और प्रियजनों की उग्रता से रक्षा करता है। भावनात्मक छल छाया पक्ष है; रचनात्मक मार्ग से गहन पालन-पोषण होता है।',
    },
    keywords: ['protection', 'fierce loyalty', 'emotional depth', 'family'],
  },

  // ─── SAGITTARIUS (9) ─────────────────────────────────────────────────────────
  {
    signId: 9, decanate: 1, rulingSign: 9,
    image: {
      en: 'A man with a horse body, holding a bow and arrow, stationed in a hermitage.',
      hi: 'अश्वशरीर पुरुष, धनुष-बाण लिए, आश्रम में स्थित।',
    },
    interpretation: {
      en: 'Planets here grant optimism, philosophical depth, and love of exploration. The native is a natural teacher and adventurer. Excess optimism and tactlessness are pitfalls. Higher learning and long-distance travel define the life path.',
      hi: 'यहाँ ग्रह आशावाद, दार्शनिक गहराई और अन्वेषण प्रेम प्रदान करते हैं। जातक स्वाभाविक शिक्षक और साहसी है। अत्यधिक आशावाद और स्पष्टवादिता बाधाएँ हैं। उच्च शिक्षा और दूर की यात्राएँ जीवन पथ को परिभाषित करती हैं।',
    },
    keywords: ['exploration', 'philosophy', 'optimism', 'teaching'],
  },
  {
    signId: 9, decanate: 2, rulingSign: 1,
    image: {
      en: 'A woman with a pot on her head, beautiful, gathering precious gems from the sea.',
      hi: 'सिर पर घड़ा लिए सुंदर स्त्री, सागर से बहुमूल्य रत्न एकत्र करती हुई।',
    },
    interpretation: {
      en: 'Planets here merge Sagittarian vision with Arian action. The native pursues ideals with physical energy. Sports, military service, and entrepreneurial ventures attract. Inspiration leads to immediate execution.',
      hi: 'यहाँ ग्रह धनु की दृष्टि और मेष की क्रिया को मिलाते हैं। जातक शारीरिक ऊर्जा से आदर्शों का अनुसरण करता है। खेल, सैन्य सेवा और उद्यमशीलता आकर्षित करती है। प्रेरणा तुरंत क्रियान्वयन की ओर ले जाती है।',
    },
    keywords: ['action', 'entrepreneurship', 'sports', 'ideals'],
  },
  {
    signId: 9, decanate: 3, rulingSign: 5,
    image: {
      en: 'A man seated on a golden throne, with a crown, giving orders to attendants.',
      hi: 'स्वर्ण सिंहासन पर विराजमान, मुकुटधारी, सेवकों को आदेश देता पुरुष।',
    },
    interpretation: {
      en: 'Planets here unite Sagittarian wisdom with Leonine authority. The native teaches, preaches, and leads with conviction. Creative expression serves a philosophical or spiritual purpose. Recognition and honor follow.',
      hi: 'यहाँ ग्रह धनु की बुद्धिमत्ता और सिंह के अधिकार को जोड़ते हैं। जातक विश्वास के साथ पढ़ाता, उपदेश देता और नेतृत्व करता है। रचनात्मक अभिव्यक्ति दार्शनिक या आध्यात्मिक उद्देश्य की सेवा करती है।',
    },
    keywords: ['authority', 'wisdom', 'preaching', 'honor'],
  },

  // ─── CAPRICORN (10) ──────────────────────────────────────────────────────────
  {
    signId: 10, decanate: 1, rulingSign: 10,
    image: {
      en: 'A man with a body of a pig, dark-skinned, with a forest of hair, holding a net and weapons.',
      hi: 'सूकरशरीर, श्यामवर्णी, घने बालों वाला, जाल और शस्त्र धारण किए पुरुष।',
    },
    interpretation: {
      en: 'Planets here grant relentless ambition, organizational skill, and endurance. The native climbs patiently toward authority. Emotional coldness and workaholism are dangers. Material success is built brick by brick.',
      hi: 'यहाँ ग्रह अथक महत्वाकांक्षा, संगठनात्मक कौशल और सहनशक्ति प्रदान करते हैं। जातक धैर्यपूर्वक अधिकार की ओर बढ़ता है। भावनात्मक शीतलता और कर्मव्यसन खतरे हैं। भौतिक सफलता ईंट-ईंट कर बनती है।',
    },
    keywords: ['ambition', 'endurance', 'organization', 'authority'],
  },
  {
    signId: 10, decanate: 2, rulingSign: 2,
    image: {
      en: 'A woman fond of ornaments, with beautiful eyes, searching for wealth in a forest.',
      hi: 'आभूषणप्रिय, सुन्दर नेत्रों वाली, वन में धन की खोज करती स्त्री।',
    },
    interpretation: {
      en: 'Planets here combine Capricornian structure with Taurean sensuality. The native builds lasting wealth through patience and taste. Luxury and status are pursued as measures of achievement. Financial conservatism is pronounced.',
      hi: 'यहाँ ग्रह मकर की संरचना और वृषभ की इन्द्रियता का संयोग करते हैं। जातक धैर्य और रुचि से स्थायी सम्पत्ति बनाता है। विलासिता और प्रतिष्ठा उपलब्धि के मापदण्ड हैं। वित्तीय रूढ़िवाद स्पष्ट है।',
    },
    keywords: ['wealth', 'conservatism', 'luxury', 'patience'],
  },
  {
    signId: 10, decanate: 3, rulingSign: 6,
    image: {
      en: 'A man with a quiver of arrows, wearing a crown of flowers, resembling a deity.',
      hi: 'तूणीरधारी, पुष्पमुकुटी, देवता सदृश पुरुष।',
    },
    interpretation: {
      en: 'Planets here merge Capricornian discipline with Virgoan precision. The native excels in technical professions, research, and healthcare administration. Service to institutions and meticulous planning define the career.',
      hi: 'यहाँ ग्रह मकर के अनुशासन और कन्या की सटीकता का मिश्रण करते हैं। जातक तकनीकी व्यवसायों, अनुसंधान और स्वास्थ्य प्रशासन में उत्कृष्ट होता है। संस्थागत सेवा और सूक्ष्म नियोजन करियर को परिभाषित करता है।',
    },
    keywords: ['precision', 'research', 'healthcare', 'technical'],
  },

  // ─── AQUARIUS (11) ────────────────────────────────────────────────────────────
  {
    signId: 11, decanate: 1, rulingSign: 11,
    image: {
      en: 'A man with the face of a vulture, carrying pots of oil, wearing dirty clothes.',
      hi: 'गिद्धमुखी पुरुष, तेल के घड़े ले जाता हुआ, मैले वस्त्रधारी।',
    },
    interpretation: {
      en: 'Planets here bestow humanitarian vision, unconventional thinking, and scientific temperament. The native breaks social norms for a higher purpose. Detachment enables objectivity but can alienate personal relationships.',
      hi: 'यहाँ ग्रह मानवतावादी दृष्टि, अपरम्परागत चिंतन और वैज्ञानिक स्वभाव प्रदान करते हैं। जातक उच्च उद्देश्य के लिए सामाजिक मानदण्ड तोड़ता है। विरक्ति वस्तुनिष्ठता देती है किंतु व्यक्तिगत सम्बन्ध दूर हो सकते हैं।',
    },
    keywords: ['humanitarian', 'unconventional', 'scientific', 'detachment'],
  },
  {
    signId: 11, decanate: 2, rulingSign: 3,
    image: {
      en: 'A woman with a dirty body, wearing leaves, skilled in metal-working and arts.',
      hi: 'मलिन शरीर वाली स्त्री, पत्तों से आच्छादित, धातुकर्म और कलाओं में निपुण।',
    },
    interpretation: {
      en: 'Planets here combine Aquarian originality with Geminian communication. The native is an intellectual innovator — writing, broadcasting, and digital media are natural arenas. Ideas spread rapidly through networks.',
      hi: 'यहाँ ग्रह कुम्भ की मौलिकता और मिथुन के संवाद को जोड़ते हैं। जातक बौद्धिक नवप्रवर्तक है — लेखन, प्रसारण और डिजिटल मीडिया स्वाभाविक क्षेत्र हैं। विचार नेटवर्क के माध्यम से तेज़ी से फैलते हैं।',
    },
    keywords: ['innovation', 'media', 'communication', 'networks'],
  },
  {
    signId: 11, decanate: 3, rulingSign: 7,
    image: {
      en: 'A dark man with a serpent body, wrapped in cloth, standing near a temple.',
      hi: 'श्यामवर्णी, सर्पशरीर पुरुष, वस्त्र में लिपटा, मन्दिर के निकट खड़ा।',
    },
    interpretation: {
      en: 'Planets here blend Aquarian idealism with Libran grace. The native advocates for social justice through art and relationship. Diplomatic skill serves reform agendas. Group harmony is a driving motivation.',
      hi: 'यहाँ ग्रह कुम्भ के आदर्शवाद और तुला की शालीनता का मिश्रण करते हैं। जातक कला और सम्बन्ध के माध्यम से सामाजिक न्याय का समर्थन करता है। कूटनीतिक कौशल सुधार एजेंडों की सेवा करता है।',
    },
    keywords: ['social justice', 'diplomacy', 'reform', 'group harmony'],
  },

  // ─── PISCES (12) ──────────────────────────────────────────────────────────────
  {
    signId: 12, decanate: 1, rulingSign: 12,
    image: {
      en: 'A man adorned with gems, crossing the ocean in a boat, carrying fine goods.',
      hi: 'रत्नभूषित पुरुष, नौका में सागर पार करता हुआ, उत्तम वस्तुएँ ले जाता।',
    },
    interpretation: {
      en: 'Planets here intensify Piscean compassion, imagination, and spiritual longing. The native is a dreamer and a healer. Artistic gifts flow from deep empathy. Escapism through substances or fantasy must be guarded against.',
      hi: 'यहाँ ग्रह मीन की करुणा, कल्पनाशीलता और आध्यात्मिक लालसा को तीव्र करते हैं। जातक स्वप्नदर्शी और उपचारक है। गहरी सहानुभूति से कलात्मक प्रतिभा प्रवाहित होती है। मादक द्रव्यों या कल्पना में पलायन से बचाव आवश्यक है।',
    },
    keywords: ['compassion', 'imagination', 'healing', 'escapism'],
  },
  {
    signId: 12, decanate: 2, rulingSign: 4,
    image: {
      en: 'A woman with a beautiful body, sailing in a ship decorated with flowers and creepers.',
      hi: 'सुन्दर शरीर वाली स्त्री, पुष्पों और लताओं से सजे जलयान में यात्रा करती हुई।',
    },
    interpretation: {
      en: 'Planets here merge Piscean sensitivity with Cancerian nurturing. The native creates a sanctuary of emotional warmth. Mothering instinct, psychic attunement, and artistic domesticity characterize this decanate.',
      hi: 'यहाँ ग्रह मीन की संवेदनशीलता और कर्क के पालन-पोषण को मिलाते हैं। जातक भावनात्मक उष्मा का आश्रय बनाता है। मातृत्व सहजवृत्ति, अतींद्रिय अनुकूलन और कलात्मक गृहस्थता इस दशमांश की विशेषता है।',
    },
    keywords: ['nurturing', 'sanctuary', 'psychic', 'domesticity'],
  },
  {
    signId: 12, decanate: 3, rulingSign: 8,
    image: {
      en: 'A man wearing armlets and anklets, naked, standing in a cemetery with a trident.',
      hi: 'बाजूबन्द और पायल पहने, नग्न, त्रिशूल सहित श्मशान में खड़ा पुरुष।',
    },
    interpretation: {
      en: 'Planets here unite Piscean transcendence with Scorpionic intensity. The native is drawn to occult sciences, tantra, and extreme spiritual practices. Death and rebirth are experienced symbolically throughout life. Profound healing powers emerge from this depth.',
      hi: 'यहाँ ग्रह मीन के अतिक्रमण और वृश्चिक की तीव्रता को जोड़ते हैं। जातक गूढ़ विद्याओं, तंत्र और चरम आध्यात्मिक साधनाओं की ओर आकर्षित होता है। मृत्यु और पुनर्जन्म जीवन भर प्रतीकात्मक रूप से अनुभव होते हैं।',
    },
    keywords: ['occult', 'tantra', 'rebirth', 'profound healing'],
  },
];

/**
 * Look up a Drekkana face by sign and decanate number.
 * @param signId 1-12
 * @param decanate 1-3 (1 = 0-10°, 2 = 10-20°, 3 = 20-30°)
 */
export function getDrekkanaFace(signId: number, decanate: number): DrekkanaFace | undefined {
  if (signId < 1 || signId > 12 || decanate < 1 || decanate > 3) return undefined;
  return DREKKANA_FACES.find(f => f.signId === signId && f.decanate === decanate);
}

/**
 * Get the decanate number from a planet's longitude within its sign.
 * @param degreeInSign 0-30 (longitude % 30)
 * @returns 1, 2, or 3
 */
export function getDecanateFromDegree(degreeInSign: number): number {
  if (degreeInSign < 10) return 1;
  if (degreeInSign < 20) return 2;
  return 3;
}

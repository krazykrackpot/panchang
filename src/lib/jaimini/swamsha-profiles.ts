/**
 * Swamsha Profile Library
 *
 * Interpretations for the Atmakaraka in each of the 12 navamsha signs
 * (Swamsha / Karakamsha Lagna). Based on Jaimini Sutras Ch.1-2.
 *
 * The Atmakaraka's navamsha sign defines the soul's deepest purpose,
 * spiritual orientation, and natural career inclination.
 */

export interface SwamshaProfile {
  signId: number;  // 1-12
  signName: { en: string; hi: string };
  personality: { en: string; hi: string };  // 2-3 sentences
  spiritualPath: { en: string; hi: string }; // 1-2 sentences
  career: { en: string; hi: string };        // 1-2 sentences
  keywords: string[];
}

/**
 * 12 Swamsha profiles indexed by sign ID (1=Aries .. 12=Pisces).
 * Reference: Jaimini Sutras 1.2.19-31, Sanjay Rath's "Jaimini Maharishi's Upadesa Sutras"
 */
export const SWAMSHA_PROFILES: SwamshaProfile[] = [
  {
    signId: 1,
    signName: { en: 'Aries', hi: 'मेष' },
    personality: {
      en: 'The soul is pioneering, courageous, and self-reliant. There is a natural drive to initiate, lead, and conquer new territory. Impatience and combativeness are the shadow side that must be tempered with wisdom.',
      hi: 'आत्मा अग्रणी, साहसी और आत्मनिर्भर है। नई दिशाओं में पहल, नेतृत्व और विजय की स्वाभाविक प्रवृत्ति। अधीरता और आक्रामकता को बुद्धि से संतुलित करना आवश्यक।',
    },
    spiritualPath: {
      en: 'Karma Yoga — the path of selfless action. Spiritual growth comes through fearless service and righteous battle against adharma.',
      hi: 'कर्म योग — निष्काम कर्म का मार्ग। निर्भय सेवा और अधर्म के विरुद्ध धर्मयुद्ध से आध्यात्मिक विकास।',
    },
    career: {
      en: 'Military, surgery, engineering, entrepreneurship, competitive sports, or any field requiring bold initiative.',
      hi: 'सैन्य, शल्य चिकित्सा, इंजीनियरिंग, उद्यमिता, प्रतिस्पर्धी खेल, या साहसिक पहल वाला कोई भी क्षेत्र।',
    },
    keywords: ['leadership', 'courage', 'initiative', 'independence', 'pioneering'],
  },
  {
    signId: 2,
    signName: { en: 'Taurus', hi: 'वृष' },
    personality: {
      en: 'The soul seeks stability, beauty, and material security. There is a strong affinity for land, art, music, and accumulated wealth. Patient and persistent, this soul builds lasting value over time.',
      hi: 'आत्मा स्थिरता, सौंदर्य और भौतिक सुरक्षा चाहती है। भूमि, कला, संगीत और संचित धन के प्रति गहरा आकर्षण। धैर्यवान और दृढ़, यह आत्मा समय के साथ स्थायी मूल्य बनाती है।',
    },
    spiritualPath: {
      en: 'Bhakti through beauty and devotion. The divine is experienced through sacred music, temple arts, and sensory refinement.',
      hi: 'सौंदर्य और भक्ति के माध्यम से भक्ति योग। पवित्र संगीत, मंदिर कला और इंद्रिय परिष्कार से दिव्यता का अनुभव।',
    },
    career: {
      en: 'Finance, agriculture, real estate, luxury goods, music, culinary arts, or banking.',
      hi: 'वित्त, कृषि, अचल संपत्ति, विलासिता, संगीत, पाक कला, या बैंकिंग।',
    },
    keywords: ['stability', 'wealth', 'beauty', 'patience', 'material security'],
  },
  {
    signId: 3,
    signName: { en: 'Gemini', hi: 'मिथुन' },
    personality: {
      en: 'The soul is intellectually versatile, curious, and communicative. Multiple simultaneous interests and projects are the norm. Adaptability is the greatest strength, but scattered focus is the challenge.',
      hi: 'आत्मा बौद्धिक रूप से बहुमुखी, जिज्ञासु और संवादशील है। एक साथ कई रुचियां और परियोजनाएं सामान्य हैं। अनुकूलनशीलता सबसे बड़ी ताकत, किन्तु बिखरा ध्यान चुनौती।',
    },
    spiritualPath: {
      en: 'Jnana Yoga — the path of knowledge. Scriptural study, philosophical debate, and intellectual discrimination lead to liberation.',
      hi: 'ज्ञान योग — ज्ञान का मार्ग। शास्त्र अध्ययन, दार्शनिक वाद-विवाद और बौद्धिक विवेक से मुक्ति।',
    },
    career: {
      en: 'Writing, journalism, teaching, commerce, translation, media, or information technology.',
      hi: 'लेखन, पत्रकारिता, शिक्षण, वाणिज्य, अनुवाद, मीडिया, या सूचना प्रौद्योगिकी।',
    },
    keywords: ['intellect', 'communication', 'versatility', 'curiosity', 'duality'],
  },
  {
    signId: 4,
    signName: { en: 'Cancer', hi: 'कर्क' },
    personality: {
      en: 'The soul is nurturing, emotionally deep, and protective. There is a strong connection to mother, homeland, and the collective emotional wellbeing. The instinct to shelter and feed others defines this soul.',
      hi: 'आत्मा पोषणकारी, भावनात्मक रूप से गहरी और रक्षात्मक है। माता, मातृभूमि और सामूहिक भावनात्मक कल्याण से गहरा जुड़ाव। दूसरों को आश्रय और भोजन देने की वृत्ति।',
    },
    spiritualPath: {
      en: 'Bhakti Yoga through devotion to the Divine Mother. Pilgrimage to sacred water bodies and service to the needy.',
      hi: 'दिव्य माता की भक्ति के माध्यम से भक्ति योग। पवित्र जल स्थलों की तीर्थयात्रा और जरूरतमंदों की सेवा।',
    },
    career: {
      en: 'Healthcare, hospitality, real estate, food industry, social work, or public service.',
      hi: 'स्वास्थ्य सेवा, आतिथ्य, अचल संपत्ति, खाद्य उद्योग, समाज सेवा, या लोक सेवा।',
    },
    keywords: ['nurturing', 'emotional depth', 'protection', 'homeland', 'mothering'],
  },
  {
    signId: 5,
    signName: { en: 'Leo', hi: 'सिंह' },
    personality: {
      en: 'The soul carries a regal quality with natural authority and creative power. The desire to lead, inspire, and be recognized drives all action. Dignity and honor are non-negotiable values.',
      hi: 'आत्मा में राजकीय गुण, स्वाभाविक अधिकार और सृजनात्मक शक्ति है। नेतृत्व, प्रेरणा और मान्यता की इच्छा सभी कर्मों को प्रेरित करती है। गरिमा और सम्मान अटल मूल्य।',
    },
    spiritualPath: {
      en: 'Raja Yoga — the royal path of meditation and self-mastery. The ego must be surrendered to the Atman.',
      hi: 'राज योग — ध्यान और आत्म-निपुणता का राजमार्ग। अहंकार को आत्मन् के समक्ष समर्पित करना आवश्यक।',
    },
    career: {
      en: 'Politics, performing arts, administration, government, entertainment, or executive leadership.',
      hi: 'राजनीति, प्रदर्शन कला, प्रशासन, सरकार, मनोरंजन, या कार्यकारी नेतृत्व।',
    },
    keywords: ['royalty', 'authority', 'creativity', 'leadership', 'dignity'],
  },
  {
    signId: 6,
    signName: { en: 'Virgo', hi: 'कन्या' },
    personality: {
      en: 'The soul finds purpose through precision, service, and healing. Analytical, methodical, and detail-oriented, this soul perfects whatever it touches. Self-criticism can become excessive.',
      hi: 'आत्मा सटीकता, सेवा और उपचार में उद्देश्य पाती है। विश्लेषणात्मक, व्यवस्थित और विस्तार-उन्मुख, यह आत्मा जो भी छूती है उसे पूर्ण करती है। आत्म-आलोचना अत्यधिक हो सकती है।',
    },
    spiritualPath: {
      en: 'Seva Yoga — the path of selfless service. Purification through discipline, fasting, and meticulous ritual observance.',
      hi: 'सेवा योग — निस्वार्थ सेवा का मार्ग। अनुशासन, उपवास और सूक्ष्म अनुष्ठान पालन से शुद्धि।',
    },
    career: {
      en: 'Medicine, healing arts, editing, accounting, research, quality control, or environmental science.',
      hi: 'चिकित्सा, उपचार कला, संपादन, लेखांकन, अनुसंधान, गुणवत्ता नियंत्रण, या पर्यावरण विज्ञान।',
    },
    keywords: ['precision', 'service', 'healing', 'analysis', 'perfection'],
  },
  {
    signId: 7,
    signName: { en: 'Libra', hi: 'तुला' },
    personality: {
      en: 'The soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Fairness and aesthetic harmony are the guiding principles of all decisions.',
      hi: 'आत्मा संतुलन, न्याय और सौंदर्य की ओर उन्मुख है। कूटनीतिक, कलात्मक और संबंध-केंद्रित। निष्पक्षता और सौंदर्य सामंजस्य सभी निर्णयों के मार्गदर्शक सिद्धांत।',
    },
    spiritualPath: {
      en: 'The path of dharmic partnership — spiritual growth through sacred relationship, marriage, and harmonizing opposites.',
      hi: 'धार्मिक साझेदारी का मार्ग — पवित्र संबंध, विवाह और विपरीतताओं में सामंजस्य से आध्यात्मिक विकास।',
    },
    career: {
      en: 'Law, diplomacy, design, fashion, mediation, counseling, or fine arts.',
      hi: 'कानून, कूटनीति, डिजाइन, फैशन, मध्यस्थता, परामर्श, या ललित कला।',
    },
    keywords: ['balance', 'justice', 'beauty', 'diplomacy', 'partnership'],
  },
  {
    signId: 8,
    signName: { en: 'Scorpio', hi: 'वृश्चिक' },
    personality: {
      en: 'The soul seeks transformation through depth and hidden knowledge. Intensely perceptive, secretive, and drawn to the mysteries of life and death. The capacity for complete regeneration is the greatest gift.',
      hi: 'आत्मा गहराई और छिपे ज्ञान से परिवर्तन चाहती है। अत्यंत सूक्ष्मदर्शी, गोपनीय, जीवन-मृत्यु के रहस्यों की ओर आकर्षित। पूर्ण पुनर्जन्म की क्षमता सबसे बड़ा वरदान।',
    },
    spiritualPath: {
      en: 'Tantra and Kundalini Yoga — transformation through confronting the shadow. Mantra sadhana and occult disciplines.',
      hi: 'तंत्र और कुंडलिनी योग — छाया का सामना करके परिवर्तन। मंत्र साधना और गुप्त अनुशासन।',
    },
    career: {
      en: 'Research, psychology, detective work, surgery, occult sciences, insurance, or intelligence.',
      hi: 'अनुसंधान, मनोविज्ञान, जासूसी, शल्य चिकित्सा, गुप्त विज्ञान, बीमा, या गुप्तचर।',
    },
    keywords: ['transformation', 'depth', 'mystery', 'regeneration', 'occult'],
  },
  {
    signId: 9,
    signName: { en: 'Sagittarius', hi: 'धनु' },
    personality: {
      en: 'The soul is oriented toward truth, philosophy, and higher education. Optimistic, expansive, and drawn to foreign cultures and long-distance travel. Teaching and preaching come naturally.',
      hi: 'आत्मा सत्य, दर्शन और उच्च शिक्षा की ओर उन्मुख है। आशावादी, विस्तारवादी, विदेशी संस्कृतियों और दूरस्थ यात्रा की ओर आकर्षित। शिक्षण और प्रवचन स्वाभाविक।',
    },
    spiritualPath: {
      en: 'Guru Bhakti — devotion to a spiritual teacher. Pilgrimage, scriptural study, and dharma propagation are the soul-level purpose.',
      hi: 'गुरु भक्ति — आध्यात्मिक गुरु के प्रति समर्पण। तीर्थयात्रा, शास्त्र अध्ययन और धर्म प्रचार आत्मा का उद्देश्य।',
    },
    career: {
      en: 'Teaching, law, philosophy, publishing, religion, international affairs, or higher education.',
      hi: 'शिक्षण, कानून, दर्शन, प्रकाशन, धर्म, अंतर्राष्ट्रीय मामले, या उच्च शिक्षा।',
    },
    keywords: ['truth', 'philosophy', 'expansion', 'teaching', 'dharma'],
  },
  {
    signId: 10,
    signName: { en: 'Capricorn', hi: 'मकर' },
    personality: {
      en: 'The soul builds slowly and surely with ambition, patience, and discipline. Destined for a late-career peak, this soul earns authority through sustained effort rather than inherited privilege.',
      hi: 'आत्मा महत्वाकांक्षा, धैर्य और अनुशासन से धीरे-धीरे निर्माण करती है। देर से करियर चरम के लिए नियत, यह आत्मा विरासती विशेषाधिकार की बजाय निरंतर प्रयास से अधिकार अर्जित करती है।',
    },
    spiritualPath: {
      en: 'Tapas — austerity and self-discipline as spiritual practice. The path of renunciation, structured meditation, and karma purification.',
      hi: 'तपस — तपस्या और आत्म-अनुशासन आध्यात्मिक साधना के रूप में। त्याग, व्यवस्थित ध्यान और कर्म शुद्धि का मार्ग।',
    },
    career: {
      en: 'Administration, engineering, corporate leadership, government, mining, or architecture.',
      hi: 'प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व, सरकार, खनन, या वास्तुकला।',
    },
    keywords: ['ambition', 'discipline', 'patience', 'authority', 'structure'],
  },
  {
    signId: 11,
    signName: { en: 'Aquarius', hi: 'कुंभ' },
    personality: {
      en: 'The soul works for collective betterment through science, social reform, and humanitarian causes. Innovative, unconventional, and group-oriented, this soul challenges the status quo.',
      hi: 'आत्मा विज्ञान, सामाजिक सुधार और मानवतावादी कार्यों से सामूहिक उन्नति के लिए कार्य करती है। नवाचारी, अपरंपरागत और समूह-उन्मुख, यह आत्मा यथास्थिति को चुनौती देती है।',
    },
    spiritualPath: {
      en: 'Sangha — spiritual growth through community, shared practice, and service to humanity. The ashram model of collective awakening.',
      hi: 'संघ — समुदाय, साझा अभ्यास और मानवता की सेवा से आध्यात्मिक विकास। सामूहिक जागृति का आश्रम मॉडल।',
    },
    career: {
      en: 'Technology, science, social activism, NGOs, aviation, networking, or futuristic industries.',
      hi: 'प्रौद्योगिकी, विज्ञान, सामाजिक सक्रियतावाद, एनजीओ, विमानन, नेटवर्किंग, या भविष्यवादी उद्योग।',
    },
    keywords: ['innovation', 'humanitarianism', 'community', 'reform', 'unconventional'],
  },
  {
    signId: 12,
    signName: { en: 'Pisces', hi: 'मीन' },
    personality: {
      en: 'The soul is oriented toward transcendence, mysticism, and compassion. Deeply intuitive and empathic, this soul dissolves boundaries between self and other. The final sign represents the completion of the soul journey.',
      hi: 'आत्मा अतिक्रमण, रहस्यवाद और करुणा की ओर उन्मुख है। गहन अंतर्ज्ञानी और सहानुभूतिशील, यह आत्मा स्वयं और दूसरे के बीच की सीमाओं को मिटाती है। अंतिम राशि आत्मा यात्रा की पूर्णता।',
    },
    spiritualPath: {
      en: 'Moksha — the path of liberation and dissolution of the ego. Meditation, compassionate service, and surrender to the divine will.',
      hi: 'मोक्ष — मुक्ति और अहंकार विसर्जन का मार्ग। ध्यान, करुणामय सेवा और दिव्य इच्छा के प्रति समर्पण।',
    },
    career: {
      en: 'Spiritual teaching, charitable work, healing, cinema, photography, maritime, or any work serving the disadvantaged.',
      hi: 'आध्यात्मिक शिक्षण, दानकार्य, उपचार, सिनेमा, फोटोग्राफी, समुद्री, या वंचितों की सेवा।',
    },
    keywords: ['transcendence', 'mysticism', 'compassion', 'intuition', 'moksha'],
  },
];

/**
 * Get the Swamsha profile for a given navamsha sign (1-12).
 * Returns undefined if signId is out of range.
 */
export function getSwamshaProfile(signId: number): SwamshaProfile | undefined {
  return SWAMSHA_PROFILES.find(p => p.signId === signId);
}

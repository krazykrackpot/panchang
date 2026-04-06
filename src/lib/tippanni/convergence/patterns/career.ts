// src/lib/tippanni/convergence/patterns/career.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const CAREER_PATTERNS: ConvergencePattern[] = [
  {
    id: 'career-peak',
    theme: 'career',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 10 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 10 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
    ],
    text: {
      full: {
        en: 'A rare triple convergence on your 10th house of career. Your 10th lord is natally strong, Jupiter — the great benefic — is transiting your career house, and your current dasha period activates this same area. This is a career peak window. Authority, recognition, and professional advancement are all aligned in your favor. Bold moves made now carry exceptional momentum.',
        hi: 'आपके दशम भाव (करियर) पर एक दुर्लभ तिहरा संयोग। आपका दशमेश जन्म से बलवान है, बृहस्पति — महान शुभ ग्रह — आपके करियर भाव में गोचर कर रहा है, और वर्तमान दशा इसी क्षेत्र को सक्रिय करती है। यह करियर शिखर की खिड़की है।',
      },
      mild: {
        en: 'Multiple signals point toward career activation. Your professional house is receiving attention from both dasha and transit — though not all factors align perfectly, this is still a meaningful period for career advancement. Stay alert for opportunities.',
        hi: 'कई संकेत करियर सक्रियता की ओर इशारा करते हैं। आपका पेशेवर भाव दशा और गोचर दोनों से ध्यान प्राप्त कर रहा है। अवसरों के प्रति सतर्क रहें।',
      },
    },
    advice: {
      en: 'Apply for promotions, launch ventures, seek public visibility. This window is time-bound — act decisively while the alignment holds.',
      hi: 'पदोन्नति के लिए आवेदन करें, उद्यम शुरू करें, सार्वजनिक दृश्यता चाहें। यह खिड़की समय-सीमित है।',
    },
    laypersonNote: {
      en: 'When three independent astrological cycles all focus on your career simultaneously, it creates a rare momentum window. Think of it as three green lights turning on at the same time.',
      hi: 'जब तीन स्वतंत्र ज्योतिषीय चक्र एक साथ आपके करियर पर केंद्रित होते हैं, तो यह एक दुर्लभ गति खिड़की बनाता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'authority-conflict',
    theme: 'career',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 10 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
    ],
    text: {
      full: {
        en: "A challenging convergence on your career house. A natal malefic already creates friction in your professional life, Saturn's transit is adding weight and pressure to this area, and your dasha period is activating the same theme. Power struggles with authority figures, bureaucratic delays, and tests of professional patience are likely. This isn't punishment — it's Saturn asking if your career is built on solid foundations.",
        hi: 'करियर भाव पर एक चुनौतीपूर्ण संयोग। जन्म से एक पापी ग्रह पेशेवर जीवन में घर्षण पैदा करता है, शनि का गोचर इस क्षेत्र पर भार डाल रहा है, और दशा इसी विषय को सक्रिय कर रही है। यह दंड नहीं — शनि पूछ रहा है कि क्या आपका करियर ठोस नींव पर बना है।',
      },
      mild: {
        en: 'Career pressure is building from multiple directions. Authority figures may be demanding or unsupportive. The current period tests your professional resilience — respond with discipline, not rebellion.',
        hi: 'कई दिशाओं से करियर का दबाव बढ़ रहा है। अधिकारी कठिन या असहायक हो सकते हैं। वर्तमान अवधि पेशेवर लचीलेपन की परीक्षा है।',
      },
    },
    advice: {
      en: "Don't confront authority directly — work within the system. Document everything. Build alliances quietly. This transit passes, but the lessons stick.",
      hi: 'अधिकार का सीधा सामना न करें — व्यवस्था के भीतर कार्य करें। सब कुछ दस्तावेज़ित करें।',
    },
    laypersonNote: {
      en: "Multiple planetary pressures on the same career area create a stress-test. It feels heavy, but it's building something stronger.",
      hi: 'एक ही करियर क्षेत्र पर कई ग्रहीय दबाव एक तनाव-परीक्षण बनाते हैं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'career-change',
    theme: 'career',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 10 },
      { type: 'dasha', check: 'lord-is-planet', planet: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 },
    ],
    text: {
      full: {
        en: "A convergence suggesting career transformation. Your 10th house is under natal stress, Rahu's dasha brings unconventional ambitions and restless energy, and Saturn's transit through your career sector is dismantling outdated structures. This is not a setback — it's a forced evolution.",
        hi: 'करियर परिवर्तन का संकेत देने वाला संयोग। दशम भाव जन्म से तनावग्रस्त है, राहु दशा अपरंपरागत महत्वाकांक्षा लाती है, और शनि का गोचर पुरानी संरचनाओं को तोड़ रहा है।',
      },
      mild: {
        en: 'Career dissatisfaction is building. The urge to change direction is strong — but timing matters.',
        hi: 'करियर असंतोष बढ़ रहा है। दिशा बदलने की इच्छा प्रबल है — लेकिन समय महत्वपूर्ण है।',
      },
    },
    advice: {
      en: "Research new directions actively. Upskill in your area of curiosity. Don't quit impulsively.",
      hi: 'नई दिशाओं पर सक्रिय रूप से शोध करें। जिज्ञासा के क्षेत्र में कौशल बढ़ाएँ।',
    },
    laypersonNote: {
      en: "When your chart shows multiple forces pushing you away from your current career, it usually means you've outgrown it.",
      hi: 'जब कुंडली कई बल वर्तमान करियर से दूर धकेलते दिखाती है, तो इसका मतलब है कि आपने इसे पार कर लिया है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'public-recognition',
    theme: 'career',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 0, house: 10 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 10 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
    ],
    text: {
      full: {
        en: "A powerful convergence for public recognition. Your natal Sun in the 10th house gives you natural authority and leadership charisma. Jupiter's transit amplifies this, and your dasha period activates career themes. This is a window for awards, public honors, or promotion to a visible leadership role.",
        hi: 'सार्वजनिक मान्यता के लिए शक्तिशाली संयोग। दशम भाव में जन्मस्थ सूर्य स्वाभाविक अधिकार देता है। बृहस्पति का गोचर इसे बढ़ा रहा है, और दशा करियर विषय सक्रिय करती है।',
      },
      mild: {
        en: 'Your natural authority is being activated by favorable transits. Public visibility is increasing.',
        hi: 'आपका स्वाभाविक अधिकार अनुकूल गोचर से सक्रिय हो रहा है।',
      },
    },
    advice: {
      en: 'Accept leadership roles. Publish, present, be visible. Your reputation is your greatest asset.',
      hi: 'नेतृत्व भूमिकाएँ स्वीकार करें। प्रकाशित करें, प्रस्तुत करें, दृश्यमान रहें।',
    },
    laypersonNote: {
      en: 'Your birth chart has natural leadership wiring, and right now the cosmic timing is amplifying it.',
      hi: 'आपकी जन्म कुंडली में स्वाभाविक नेतृत्व क्षमता है, और अभी ब्रह्मांडीय समय इसे बढ़ा रहा है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'entrepreneur-window',
    theme: 'career',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 11 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 11 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 7 },
    ],
    text: {
      full: {
        en: "A convergence for independent ventures. Your 11th house of gains is natally strong, Jupiter's transit through your 11th amplifies income and networks, and your dasha activates the 7th house of partnerships and business. This is a window for launching ventures, building alliances, and shifting from employment to enterprise.",
        hi: 'स्वतंत्र उद्यम का संयोग। एकादश भाव बलवान, बृहस्पति एकादश में आय और नेटवर्क बढ़ाता है, दशा व्यापार और साझेदारी सक्रिय करती है। नौकरी से उद्यम की ओर जाने की खिड़की।',
      },
      mild: {
        en: 'Independent earning potential is strong. Side ventures and business partnerships are favored.',
        hi: 'स्वतंत्र आय क्षमता मजबूत। साइड वेंचर और व्यापारिक साझेदारी अनुकूल।',
      },
    },
    advice: {
      en: 'Build your network actively. Explore partnerships and freelance opportunities. Financial gains come through collaboration, not solo effort.',
      hi: 'नेटवर्क बनाएँ। साझेदारी और फ्रीलांस अवसर खोजें।',
    },
    laypersonNote: {
      en: "Your chart's earnings potential is being amplified by transits — perfect timing for business launches.",
      hi: 'आपकी कुंडली की आय क्षमता गोचर से बढ़ रही है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'foreign-career-window',
    theme: 'career',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 7, house: 10 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 7, house: 9 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 12 },
    ],
    text: {
      full: {
        en: "A rare foreign career alignment. Natal Rahu in the 10th house gives unconventional ambitions, Rahu's transit through your 9th activates international connections, and your dasha activates the 12th house of foreign lands. Immigration, international positions, remote work, or global business opportunities are highlighted.",
        hi: 'दुर्लभ विदेशी करियर संरेखण। दशम में राहु अपरंपरागत महत्वाकांक्षा, नवम में राहु गोचर अंतर्राष्ट्रीय संपर्क, द्वादश दशा विदेश सक्रिय। आव्रजन, अंतर्राष्ट्रीय पद, या वैश्विक व्यापार।',
      },
      mild: {
        en: 'International career opportunities are emerging. Foreign connections are becoming significant.',
        hi: 'अंतर्राष्ट्रीय करियर अवसर उभर रहे हैं।',
      },
    },
    advice: {
      en: 'Apply for international roles. Explore remote work for global companies. Rahu rewards bold unconventional moves.',
      hi: 'अंतर्राष्ट्रीय भूमिकाओं के लिए आवेदन करें। वैश्विक कंपनियों के लिए रिमोट वर्क।',
    },
    laypersonNote: {
      en: "Rahu's nature is foreign, unconventional, and ambitious — when it activates your career area, overseas opportunities arise.",
      hi: 'राहु का स्वभाव विदेशी, अपरंपरागत — करियर क्षेत्र में विदेशी अवसर।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'professional-stagnation',
    theme: 'career',
    significance: 3,
    conditions: [
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 },
      { type: 'dasha', check: 'lord-is-planet', planet: 6 },
    ],
    text: {
      full: {
        en: "Saturn's double grip on your career — both through transit and dasha. Professional progress feels glacially slow. Promotions are delayed, recognition is withheld. This is Saturn's signature: delayed, not denied. Every seed planted now will bear fruit when this transit lifts.",
        hi: 'शनि की दोहरी पकड़ — गोचर और दशा दोनों से। पेशेवर प्रगति बेहद धीमी। यह शनि का हस्ताक्षर है: विलंबित, इनकार नहीं।',
      },
      mild: {
        en: "Career momentum is slow under Saturn's influence. Focus on building foundations rather than seeking quick wins.",
        hi: 'शनि के प्रभाव में करियर गति धीमी। नींव बनाने पर ध्यान दें।',
      },
    },
    advice: {
      en: "Don't chase shortcuts — Saturn punishes them. Build skills, document achievements, maintain discipline.",
      hi: 'शॉर्टकट का पीछा न करें — शनि उन्हें दंडित करता है। कौशल बनाएँ, अनुशासन बनाए रखें।',
    },
    laypersonNote: {
      en: 'Saturn slows things down so you build them properly.',
      hi: 'शनि चीजों को धीमा करता है ताकि आप उन्हें ठीक से बनाएँ।',
    },
    relatedSections: [
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
  },
];

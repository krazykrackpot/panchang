// src/lib/tippanni/convergence/patterns/relationship.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const RELATIONSHIP_PATTERNS: ConvergencePattern[] = [
  {
    id: 'marriage-window',
    theme: 'relationship',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 7 },
      { type: 'dasha', check: 'lord-is-planet', planet: 5 },
    ],
    text: {
      full: {
        en: "A rare marriage alignment. Your 7th lord is natally strong, Jupiter's transit through your 7th house brings expansion, and Venus dasha activates love and union. If unmarried, this is one of the strongest marriage windows your chart will produce.",
        hi: 'एक दुर्लभ विवाह संरेखण। सप्तमेश बलवान, बृहस्पति सप्तम में गोचर, शुक्र दशा प्रेम सक्रिय करती है। अविवाहित हों तो सबसे मजबूत विवाह खिड़की।',
      },
      mild: {
        en: 'Relationship energy is favorable. Partnership opportunities are emerging.',
        hi: 'संबंध ऊर्जा अनुकूल है।',
      },
    },
    advice: {
      en: 'If considering marriage, this is auspicious. Attend social events, be open.',
      hi: 'विवाह पर विचार करें तो यह शुभ है।',
    },
    laypersonNote: {
      en: 'Three planetary forces support partnership — rare and auspicious.',
      hi: 'तीन ग्रहीय बल साझेदारी का समर्थन — दुर्लभ और शुभ।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'relationship-storm',
    theme: 'relationship',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 7 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 7 },
    ],
    text: {
      full: {
        en: "A serious convergence on your 7th house. A natal malefic creates inherent relationship tension, Saturn's transit tests every partnership with cold scrutiny, and your dasha activates this area. Relationships lacking commitment face existential pressure.",
        hi: 'सप्तम भाव पर गंभीर संयोग। पापी ग्रह तनाव, शनि गोचर परख, दशा सक्रिय करती है। सच्ची प्रतिबद्धता के बिना संबंधों पर अस्तित्वगत दबाव।',
      },
      mild: {
        en: 'Relationships are under pressure from multiple directions.',
        hi: 'संबंध कई दिशाओं से दबाव में हैं।',
      },
    },
    advice: {
      en: "Don't make permanent decisions under temporary pressure. Communicate openly.",
      hi: 'अस्थायी दबाव में स्थायी निर्णय न लें।',
    },
    laypersonNote: {
      en: 'Three forces stress your relationship area — the universe forcing a reckoning.',
      hi: 'तीन बल संबंध क्षेत्र पर दबाव — सत्य प्रकट करने के लिए।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
      TippanniSection.Doshas,
    ],
  },

  {
    id: 'partnership-blessing',
    theme: 'relationship',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'benefic', house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 7 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 7 },
    ],
    text: {
      full: {
        en: 'A harmonious convergence. A natal benefic blesses your 7th house, Jupiter amplifies with expansion, and your dasha activates partnership themes. Relationships deepen, new connections feel destined.',
        hi: 'सामंजस्यपूर्ण संयोग। शुभ ग्रह सप्तम में, बृहस्पति विस्तार लाता है, दशा साझेदारी सक्रिय करती है।',
      },
      mild: {
        en: 'Partnership energy is positive. Collaborative ventures favored.',
        hi: 'साझेदारी ऊर्जा सकारात्मक।',
      },
    },
    advice: {
      en: "Invest in your key relationships — they're bearing fruit.",
      hi: 'प्रमुख संबंधों में निवेश करें।',
    },
    laypersonNote: {
      en: 'Multiple planetary blessings on your partnership house.',
      hi: 'साझेदारी भाव पर कई ग्रहीय आशीर्वाद।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'divorce-separation',
    theme: 'relationship',
    significance: 5,
    mutuallyExclusive: ['partnership-blessing', 'marriage-window'],
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 2, house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 7 },
      { type: 'natal', check: 'lord-afflicted', house: 7 },
    ],
    text: {
      full: {
        en: "A critical convergence indicating severe relationship pressure. Mars in 7th brings inherent conflict, Saturn's transit adds weight, and your 7th lord is weakened. If underlying issues have been ignored, this period forces them into the open.",
        hi: 'गंभीर संबंध दबाव। सप्तम में मंगल संघर्ष लाता है, शनि गोचर दबाव, सप्तमेश कमजोर। अनदेखी समस्याएँ खुले में आएँगी।',
      },
      mild: {
        en: 'Relationship foundations are being tested. Seek counseling.',
        hi: 'संबंध नींव की परीक्षा। परामर्श लें।',
      },
    },
    advice: {
      en: "Don't make permanent decisions impulsively. Seek counseling. Saturn demands maturity.",
      hi: 'आवेश में स्थायी निर्णय न लें।',
    },
    laypersonNote: {
      en: 'Three forces pressure your relationship area with unusual intensity.',
      hi: 'तीन बल असामान्य तीव्रता से संबंध क्षेत्र पर दबाव।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.Doshas,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'new-romantic-encounter',
    theme: 'relationship',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'benefic-aspect-to-house', house: 5 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 5, house: 5 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 },
    ],
    text: {
      full: {
        en: "A convergence of love energies. Benefic planets bless your 5th house natally, Venus transits your 5th house of romance, and your dasha activates this same theme. This is a window for new romantic encounters — spontaneous, meaningful, and potentially life-changing. Open yourself to connection.",
        hi: 'प्रेम ऊर्जाओं का संयोग। शुभ ग्रह पंचम भाव में जन्म से, शुक्र गोचर प्रेम का भाव, दशा इसी विषय को सक्रिय। नए रोमांटिक मिलन की खिड़की।',
      },
      mild: {
        en: 'Romance and attraction energies are heightened. New connections carry unusual depth.',
        hi: 'रोमांस और आकर्षण ऊर्जा बढ़ी हुई। नए संबंध असामान्य गहराई लिए होंगे।',
      },
    },
    advice: {
      en: 'Say yes to social invitations. Be present in gatherings. The next meaningful connection may arise unexpectedly.',
      hi: 'सामाजिक निमंत्रण स्वीकार करें। अगला सार्थक संबंध अप्रत्याशित रूप से उत्पन्न होगा।',
    },
    laypersonNote: {
      en: 'Three forces aligned on your romance area create a window where love finds you.',
      hi: 'तीन बल प्रेम क्षेत्र पर — प्यार खोजने की खिड़की।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
      TippanniSection.DashaSynthesis,
    ],
  },

  {
    id: 'commitment-deepening',
    theme: 'relationship',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 7 },
      { type: 'dasha', check: 'lord-is-planet', planet: 1 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 2 },
    ],
    text: {
      full: {
        en: "A stabilizing convergence. Your 7th lord is natally strong, Moon dasha brings emotional depth and nurturing toward partnerships, and Jupiter's transit through your 2nd house strengthens family bonds and shared resources. Existing relationships deepen. Commitments made now carry long-term weight.",
        hi: 'स्थिर करने वाला संयोग। सप्तमेश बलवान, चंद्र दशा भावनात्मक गहराई लाती है, बृहस्पति द्वितीय में पारिवारिक बंधन मजबूत। वर्तमान संबंध गहरे होंगे।',
      },
      mild: {
        en: 'Existing relationships are becoming more emotionally rich. Shared values and security are emphasized.',
        hi: 'मौजूदा संबंध अधिक भावनात्मक रूप से समृद्ध हो रहे हैं।',
      },
    },
    advice: {
      en: 'Invest in your committed relationships — this is a season for deepening, not searching. Joint financial decisions carry favorable energy.',
      hi: 'प्रतिबद्ध संबंधों में निवेश करें। साझा वित्तीय निर्णय अनुकूल।',
    },
    laypersonNote: {
      en: 'These planets create a nurturing, stabilizing energy around existing partnerships.',
      hi: 'ये ग्रह मौजूदा साझेदारी के आसपास पोषण और स्थिरता बनाते हैं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'past-love-returns',
    theme: 'relationship',
    significance: 3,
    conditions: [
      { type: 'retro', check: 'planet-retrograde', planet: 5 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 },
    ],
    text: {
      full: {
        en: "Venus retrograde during activation of your 5th house of romance — a classic 'ex returns' signature. Past lovers and unfinished chapters resurface. This isn't about going back — it's understanding what you truly value in love.",
        hi: "शुक्र वक्री पंचम भाव सक्रियता के दौरान — 'पुराना प्रेम लौटता है' का शास्त्रीय संकेत।",
      },
      mild: {
        en: "Venus retrograde is stirring old romantic memories. Reflect but don't act impulsively.",
        hi: 'शुक्र वक्री पुरानी प्रेम स्मृतियाँ जगा रहा है।',
      },
    },
    advice: {
      en: "Journal about what you learned. If an ex reaches out, listen but don't commit.",
      hi: 'पिछले संबंधों से सीख पर लिखें।',
    },
    laypersonNote: {
      en: 'When the planet of love goes backward while your romance area is active, old themes replay.',
      hi: 'जब प्रेम का ग्रह पीछे जाता है, पुराने विषय दोहराते हैं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
    ],
  },
];

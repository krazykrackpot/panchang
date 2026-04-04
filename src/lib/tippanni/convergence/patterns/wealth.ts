// src/lib/tippanni/convergence/patterns/wealth.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const WEALTH_PATTERNS: ConvergencePattern[] = [
  {
    id: 'sudden-wealth',
    theme: 'wealth',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 2 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 11 },
      { type: 'dasha', check: 'lord-is-planet', planet: 7 },
    ],
    text: {
      full: {
        en: 'A rare wealth convergence. Your 2nd lord (wealth house) is natally strong, Jupiter transits your 11th house of gains, and Rahu\'s dasha brings sudden, unconventional windfalls. Inheritance, lottery, investment returns, or unexpected income sources activate. This is a window where calculated risks pay disproportionate dividends.',
        hi: 'एक दुर्लभ धन संयोग। द्वितीयेश बलवान, बृहस्पति लाभ भाव में गोचर, राहु दशा अचानक अपरंपरागत लाभ लाती है। विरासत, निवेश प्रतिफल या अप्रत्याशित आय स्रोत सक्रिय। गणनात्मक जोखिम अनुपातहीन लाभ देते हैं।',
      },
      mild: {
        en: 'Financial signals are turning positive. Multiple factors support income growth — stay alert for unconventional opportunities.',
        hi: 'वित्तीय संकेत सकारात्मक। कई कारक आय वृद्धि का समर्थन — अपरंपरागत अवसरों के प्रति सतर्क रहें।',
      },
    },
    advice: {
      en: 'Diversify investments, explore new income streams. Don\'t hoard — circulate wealth for maximum returns.',
      hi: 'निवेश विविधीकृत करें, नए आय स्रोत खोजें। संचय न करें — अधिकतम प्रतिफल के लिए धन प्रवाहित करें।',
    },
    laypersonNote: {
      en: 'When your wealth house, gains house, and dasha all align favorably, money flows from unexpected directions.',
      hi: 'जब धन भाव, लाभ भाव और दशा सब अनुकूल, धन अप्रत्याशित दिशाओं से आता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'financial-crisis',
    theme: 'wealth',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 2 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 2 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 12 },
    ],
    text: {
      full: {
        en: 'A challenging financial convergence. Your wealth house is natally stressed, Saturn\'s transit is constricting income flow, and your dasha period activates the 12th house of losses. Savings deplete, debts accumulate, and expenses outpace income. This isn\'t permanent — but it demands austerity and strategic financial planning. Cut discretionary spending immediately.',
        hi: 'चुनौतीपूर्ण वित्तीय संयोग। धन भाव तनावग्रस्त, शनि गोचर आय प्रवाह संकुचित, दशा व्यय भाव सक्रिय करती है। बचत घटती है, ऋण बढ़ता है। यह स्थायी नहीं — लेकिन मितव्ययिता और रणनीतिक वित्तीय योजना की माँग करता है।',
      },
      mild: {
        en: 'Financial pressure is building. Income growth is sluggish while expenses rise. Tighten the budget proactively.',
        hi: 'वित्तीय दबाव बढ़ रहा है। आय वृद्धि धीमी, व्यय बढ़ रहा। सक्रिय रूप से बजट कसें।',
      },
    },
    advice: {
      en: 'Build an emergency fund. Avoid new debt. Renegotiate existing obligations. This transit passes — survive it wisely.',
      hi: 'आपातकालीन कोष बनाएँ। नया ऋण न लें। मौजूदा दायित्वों पर पुनर्वार्ता करें।',
    },
    laypersonNote: {
      en: 'Multiple financial pressure points activating simultaneously — the chart is signaling to tighten, not expand.',
      hi: 'एक साथ कई वित्तीय दबाव बिंदु सक्रिय — कुंडली संकुचन का संकेत दे रही है, विस्तार का नहीं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
    mutuallyExclusive: ['sudden-wealth'],
  },

  {
    id: 'steady-accumulation',
    theme: 'wealth',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 2 },
      { type: 'natal', check: 'lord-strong', house: 11 },
    ],
    text: {
      full: {
        en: 'Both your wealth houses have strong lords — a solid foundation for steady financial growth. You may not see dramatic windfalls, but money accumulates reliably through disciplined effort. Savings grow, investments compound, and financial security builds over time. This is the tortoise winning the race.',
        hi: 'दोनों धन भावों के स्वामी बलवान — स्थिर वित्तीय वृद्धि की ठोस नींव। नाटकीय लाभ न दिखें, लेकिन अनुशासित प्रयास से धन विश्वसनीय रूप से संचित होता है।',
      },
      mild: {
        en: 'Financial foundations are solid. Focus on consistent saving and long-term investment strategies.',
        hi: 'वित्तीय नींव ठोस। निरंतर बचत और दीर्घकालिक निवेश रणनीतियों पर ध्यान दें।',
      },
    },
    advice: {
      en: 'Automate savings, invest in index funds, avoid get-rich-quick schemes. Your chart rewards patience.',
      hi: 'बचत स्वचालित करें, इंडेक्स फंड में निवेश, जल्दी अमीर बनो योजनाओं से बचें।',
    },
    laypersonNote: {
      en: 'Strong foundations in both income houses — your chart is built for steady growth, not speculation.',
      hi: 'दोनों आय भावों में मजबूत नींव — आपकी कुंडली स्थिर वृद्धि के लिए बनी है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'speculative-gains',
    theme: 'wealth',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 5 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 5 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 },
    ],
    text: {
      full: {
        en: 'Your 5th house of speculation is triply activated. The lord is strong, Jupiter\'s transit expands risk appetite favorably, and your dasha period energizes this house. Investments, stock markets, and calculated gambles are more likely to pay off now. Your intuition about money is sharper than usual.',
        hi: 'पंचम भाव (सट्टा) तिगुना सक्रिय। स्वामी बलवान, बृहस्पति गोचर जोखिम अनुकूल, दशा ऊर्जावान। निवेश, शेयर बाजार और गणनात्मक जोखिम अब अधिक फल दे सकते हैं।',
      },
      mild: {
        en: 'Speculative instincts are heightened. Small calculated risks may pay off — but don\'t bet the farm.',
        hi: 'सट्टा वृत्ति तीव्र। छोटे गणनात्मक जोखिम फल दे सकते हैं — लेकिन सब दाँव पर न लगाएँ।',
      },
    },
    advice: {
      en: 'Allocate a fixed speculative budget. Trust your gut on investments, but set stop-losses. Don\'t exceed 10-15% of portfolio in speculation.',
      hi: 'एक निश्चित सट्टा बजट आवंटित करें। निवेश पर अंतर्ज्ञान पर भरोसा करें, लेकिन स्टॉप-लॉस लगाएँ।',
    },
    laypersonNote: {
      en: 'Your speculation house is receiving multiple boosts — a favorable window for calculated investment risks.',
      hi: 'सट्टा भाव को कई बढ़ावा — गणनात्मक निवेश जोखिम के लिए अनुकूल खिड़की।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'speculative-losses',
    theme: 'wealth',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 5 },
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 5 },
      { type: 'dasha', check: 'lord-is-planet', planet: 7 },
    ],
    text: {
      full: {
        en: 'Danger signals on speculation. Your 5th house is afflicted natally, a malefic occupies it, and Rahu\'s dasha amplifies risk-taking beyond reason. Gambling, crypto, speculative stocks, and get-rich-quick schemes are especially dangerous now. Every impulse to \'double down\' should be questioned. The chart is warning, not inviting.',
        hi: 'सट्टे पर खतरे के संकेत। पंचम भाव जन्म से पीड़ित, पापी ग्रह विराजमान, राहु दशा जोखिम तर्क से परे बढ़ाती है। जुआ, क्रिप्टो, सट्टा शेयर विशेष रूप से खतरनाक। \'दोगुना दाँव\' का हर आवेग प्रश्नित होना चाहिए।',
      },
      mild: {
        en: 'Speculative instincts may be unreliable now. Avoid major gambles — the chart advises caution with risk.',
        hi: 'सट्टा वृत्ति अविश्वसनीय हो सकती है। बड़े जोखिम से बचें।',
      },
    },
    advice: {
      en: 'Liquidate risky positions. Move to fixed deposits and bonds. No new speculative entries until this transit passes.',
      hi: 'जोखिम भरी स्थितियाँ समाप्त करें। सावधि जमा और बॉन्ड में जाएँ। इस गोचर तक कोई नया सट्टा नहीं।',
    },
    laypersonNote: {
      en: 'When affliction and Rahu combine on your speculation house, your judgment about risk is compromised.',
      hi: 'जब पीड़ा और राहु सट्टा भाव पर मिलते हैं, जोखिम के बारे में निर्णय क्षमता प्रभावित होती है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
    mutuallyExclusive: ['speculative-gains'],
  },

  {
    id: 'property-acquisition',
    theme: 'wealth',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 4 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 4 },
    ],
    text: {
      full: {
        en: 'Property stars align. Your 4th lord (real estate, home, land) is strong and Jupiter\'s transit expands this area. Favorable time for buying property, renovating, or upgrading your living situation. Real estate investments made now tend to appreciate well.',
        hi: 'संपत्ति सितारे संरेखित। चतुर्थेश बलवान और बृहस्पति गोचर इस क्षेत्र का विस्तार करता है। संपत्ति खरीदने, नवीनीकरण या रहन-सहन सुधारने का अनुकूल समय।',
      },
      mild: {
        en: 'Property matters are favored. Explore real estate options — timing supports acquisition.',
        hi: 'संपत्ति मामले अनुकूल। अचल संपत्ति विकल्प खोजें।',
      },
    },
    advice: {
      en: 'Get pre-approved for loans, visit properties, negotiate from strength. Jupiter\'s blessing on the 4th house is time-bound.',
      hi: 'ऋण पूर्व-स्वीकृति लें, संपत्ति देखें, मजबूती से बातचीत करें।',
    },
    laypersonNote: {
      en: 'Your home and property sector is receiving Jupiter\'s expansive blessing — a natural window for real estate moves.',
      hi: 'घर और संपत्ति क्षेत्र बृहस्पति का विस्तारक आशीर्वाद प्राप्त कर रहा है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'inheritance',
    theme: 'wealth',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 8 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 8 },
    ],
    text: {
      full: {
        en: 'Your 8th house of inheritance and transformation is activated. The 8th lord is strong, and your dasha period energizes this house. Legacy wealth, insurance payouts, partner\'s resources, or inheritance may become accessible. This also signals transformation through shared resources — mergers, joint ventures, or matrimonial property.',
        hi: 'अष्टम भाव (विरासत, परिवर्तन) सक्रिय। अष्टमेश बलवान और दशा इस भाव को ऊर्जावान करती है। विरासत, बीमा, साथी के संसाधन या मातृ-संपत्ति सुलभ हो सकती है।',
      },
      mild: {
        en: 'Inheritance or shared resource themes are activating. Stay open to receiving from others.',
        hi: 'विरासत या साझा संसाधन विषय सक्रिय हो रहे हैं।',
      },
    },
    advice: {
      en: 'Update your will. Review insurance policies. If inheritance is pending, this period may accelerate it.',
      hi: 'वसीयत अपडेट करें। बीमा नीतियों की समीक्षा करें।',
    },
    laypersonNote: {
      en: 'The 8th house governs other people\'s money and legacy — when it activates, resources flow from outside yourself.',
      hi: 'अष्टम भाव दूसरों के धन और विरासत को नियंत्रित करता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
    ],
  },

  {
    id: 'income-change',
    theme: 'wealth',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 10 },
      { type: 'dasha', check: 'lord-is-planet', planet: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 },
    ],
    text: {
      full: {
        en: 'Career disruption is reshaping your income. The 10th house is stressed, Rahu\'s dasha brings unconventional ambitions, and Saturn\'s transit pressures your professional sector. Your income source is likely to change — voluntarily or not. This can be the catalyst for building a more authentic livelihood aligned with your true calling.',
        hi: 'करियर बाधा आपकी आय को पुनर्आकार दे रही है। दशम भाव तनावग्रस्त, राहु दशा अपरंपरागत महत्वाकांक्षा, शनि गोचर पेशेवर क्षेत्र पर दबाव। आय स्रोत बदलने की संभावना।',
      },
      mild: {
        en: 'Income sources may shift as career evolves. Prepare for transition — build a financial buffer.',
        hi: 'करियर विकास के साथ आय स्रोत बदल सकते हैं। संक्रमण की तैयारी करें।',
      },
    },
    advice: {
      en: 'Build 6 months of savings before any career move. Explore freelance or side income while transitioning.',
      hi: 'करियर बदलाव से पहले 6 महीने की बचत बनाएँ। संक्रमण के दौरान फ्रीलांस आय खोजें।',
    },
    laypersonNote: {
      en: 'When career pressure and income themes converge, the universe is redirecting your livelihood — resist, and it\'s painful; align, and it\'s liberating.',
      hi: 'जब करियर दबाव और आय विषय मिलते हैं, ब्रह्मांड आजीविका पुनर्निर्देशित कर रहा है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'debt-trap',
    theme: 'wealth',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 6 },
      { type: 'natal', check: 'planet-in-house', planet: 7, house: 6 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 6 },
    ],
    text: {
      full: {
        en: 'A dangerous debt convergence. Your 6th house (debts, enemies) is afflicted, Rahu\'s presence amplifies borrowing temptation, and Saturn\'s transit makes repayment harder. Loan sharks, credit card debt, and financial obligations spiral if not checked now. This is the chart screaming: stop borrowing.',
        hi: 'खतरनाक ऋण संयोग। षष्ठ भाव पीड़ित, राहु उधार प्रलोभन बढ़ाता है, शनि गोचर भुगतान कठिन बनाता है। ऋण सर्पिल — कुंडली चिल्ला रही है: उधार बंद करो।',
      },
      mild: {
        en: 'Debt signals are concerning. Avoid new loans and aggressively pay down existing obligations.',
        hi: 'ऋण संकेत चिंताजनक। नए ऋण से बचें और मौजूदा दायित्व आक्रामक रूप से चुकाएँ।',
      },
    },
    advice: {
      en: 'Consolidate debts. Seek financial counseling. Cut all non-essential spending. No new credit cards or loans.',
      hi: 'ऋण समेकित करें। वित्तीय परामर्श लें। सभी गैर-आवश्यक व्यय काटें।',
    },
    laypersonNote: {
      en: 'When debt-related houses are under simultaneous pressure, borrowing becomes a trap, not a tool.',
      hi: 'जब ऋण-संबंधित भाव एक साथ दबाव में, उधार जाल बन जाता है, उपकरण नहीं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'charity-phase',
    theme: 'wealth',
    significance: 2,
    conditions: [
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 12 },
    ],
    text: {
      full: {
        en: 'Ketu\'s dasha combined with Jupiter transiting your 12th house of surrender creates a natural inclination toward giving. Charitable donations, temple contributions, and acts of selfless service feel deeply satisfying now. Money spent on spiritual purposes or helping others brings more lasting fulfillment than material accumulation. This is a phase where giving IS receiving.',
        hi: 'केतु दशा और बृहस्पति द्वादश भाव में गोचर — दान की प्राकृतिक प्रवृत्ति। दान, मंदिर योगदान और निःस्वार्थ सेवा गहरा संतोष देते हैं। आध्यात्मिक प्रयोजनों पर खर्च भौतिक संचय से अधिक स्थायी पूर्णता लाता है।',
      },
      mild: {
        en: 'A natural pull toward generosity. Small acts of charity feel unusually rewarding now.',
        hi: 'उदारता की स्वाभाविक प्रवृत्ति। छोटे दान असामान्य रूप से पुरस्कृत।',
      },
    },
    advice: {
      en: 'Set up a regular donation. Volunteer time, not just money. Sponsor a child\'s education. The returns are karmic.',
      hi: 'नियमित दान स्थापित करें। समय दें, केवल धन नहीं। बच्चे की शिक्षा प्रायोजित करें।',
    },
    laypersonNote: {
      en: 'Ketu detaches from material, Jupiter expands spiritual giving — together they create a phase where generosity is your best investment.',
      hi: 'केतु भौतिक से विरक्ति, बृहस्पति आध्यात्मिक दान का विस्तार — उदारता सबसे अच्छा निवेश।',
    },
    relatedSections: [
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
    ],
  },
];

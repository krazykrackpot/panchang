// src/lib/tippanni/convergence/patterns/health.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const HEALTH_PATTERNS: ConvergencePattern[] = [
  {
    id: 'chronic-illness',
    theme: 'health',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 6 },
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 6 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 6 },
    ],
    text: {
      full: {
        en: 'A concerning health convergence. Your 6th house of disease is natally afflicted, a malefic occupies it, and Saturn\'s transit adds chronic pressure. This signals the onset or worsening of long-term health conditions — particularly related to the organs governed by the afflicting planet. Early diagnosis and preventive care are critical now.',
        hi: 'चिंताजनक स्वास्थ्य संयोग। षष्ठ भाव जन्म से पीड़ित, पापी ग्रह विराजमान, शनि गोचर दीर्घकालिक दबाव। दीर्घकालिक स्वास्थ्य स्थितियों की शुरुआत या बिगड़ने का संकेत। शीघ्र निदान और निवारक देखभाल महत्वपूर्ण।',
      },
      mild: {
        en: 'Your 6th house is under some stress from multiple directions. Minor health issues may be more persistent than usual. Routine checkups and preventive habits are advisable to stay ahead of any developing concerns.',
        hi: 'षष्ठ भाव कई दिशाओं से कुछ दबाव में है। छोटी स्वास्थ्य समस्याएँ सामान्य से अधिक बनी रह सकती हैं। नियमित जाँच और निवारक आदतें उचित हैं।',
      },
    },
    advice: {
      en: 'Schedule a comprehensive health evaluation now. Do not ignore persistent symptoms. Adopt a preventive lifestyle — diet, sleep, and stress reduction are your first line of defense.',
      hi: 'अभी व्यापक स्वास्थ्य मूल्यांकन करवाएँ। लगातार लक्षणों को नजरअंदाज न करें। निवारक जीवनशैली अपनाएँ — आहार, नींद और तनाव प्रबंधन प्राथमिक रक्षा है।',
    },
    laypersonNote: {
      en: 'When your birth chart\'s disease house is stressed AND a malefic planet sits in it AND Saturn transits the same area, it\'s like three warning lights coming on simultaneously. Your body is asking for attention.',
      hi: 'जब जन्म कुंडली का रोग भाव तनावग्रस्त हो, पापी ग्रह उसमें हो और शनि गोचर उसी क्षेत्र में हो — तीन चेतावनी बत्तियाँ एक साथ जलती हैं। शरीर ध्यान माँग रहा है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'recovery',
    theme: 'health',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 1 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 1 },
    ],
    text: {
      full: {
        en: 'Healing energy converges on your body. Your lagna lord is strong — giving constitutional resilience — and Jupiter\'s transit through your 1st house brings vitality, optimism, and physical recovery. If dealing with illness, this is the most favorable window for treatment and recuperation. Your body\'s self-healing capacity is at its peak.',
        hi: 'उपचार ऊर्जा शरीर पर केंद्रित। लग्नेश बलवान — संवैधानिक लचीलापन — बृहस्पति गोचर प्रथम भाव में जीवन शक्ति, आशावाद और शारीरिक पुनर्प्राप्ति लाता है। शरीर की आत्म-उपचार क्षमता चरम पर।',
      },
      mild: {
        en: 'Your physical constitution is in a positive phase. Jupiter\'s influence on the ascendant brings general health improvement and resilience. A good time to begin healthy lifestyle changes.',
        hi: 'आपकी शारीरिक संरचना सकारात्मक चरण में है। बृहस्पति का लग्न पर प्रभाव सामान्य स्वास्थ्य सुधार लाता है। स्वस्थ जीवनशैली परिवर्तन शुरू करने का अच्छा समय।',
      },
    },
    advice: {
      en: 'Begin or intensify medical treatment now if you have been delaying. Start wellness routines — this window amplifies their effectiveness. Recovery from chronic or acute conditions is strongly supported.',
      hi: 'यदि उपचार टाल रहे हैं तो अभी शुरू या तेज करें। स्वास्थ्य दिनचर्या शुरू करें — यह खिड़की उनकी प्रभावशीलता बढ़ाती है।',
    },
    laypersonNote: {
      en: 'A strong lagna lord means your body has good constitution, and Jupiter transiting your ascendant is like a seasonal boost to your immune and vital systems.',
      hi: 'बलवान लग्नेश का अर्थ है मजबूत शारीरिक संरचना, और लग्न में बृहस्पति गोचर प्रतिरक्षा और जीवन प्रणालियों को मौसमी बढ़ावा देता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'accident-prone',
    theme: 'health',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 2, house: 8 },
      { type: 'natal', check: 'planet-in-house', planet: 7, house: 1 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 2, house: 8 },
    ],
    text: {
      full: {
        en: 'A high-alert safety convergence. Mars in your 8th house creates inherent accident susceptibility, Rahu in the 1st house brings impulsiveness and risk-blindness, and Mars\' transit activates the danger axis. Physical safety requires conscious attention — avoid extreme sports, reckless driving, and unnecessary risks during this period.',
        hi: 'उच्च-सतर्कता सुरक्षा संयोग। अष्टम में मंगल दुर्घटना संवेदनशीलता, प्रथम में राहु आवेग और जोखिम-अंधता, मंगल गोचर खतरे की धुरी सक्रिय। शारीरिक सुरक्षा पर सचेत ध्यान आवश्यक।',
      },
      mild: {
        en: 'Mars and Rahu together create an impulsive energy that can lead to minor injuries or accidents. Be more deliberate in physical activities and avoid rushing or taking shortcuts in daily tasks.',
        hi: 'मंगल और राहु मिलकर आवेगी ऊर्जा बनाते हैं जो छोटी चोट या दुर्घटना का कारण बन सकती है। शारीरिक गतिविधियों में अधिक सावधान रहें और दैनिक कार्यों में जल्दबाजी से बचें।',
      },
    },
    advice: {
      en: 'Slow down. Double-check before acting. Avoid alcohol, fatigue, or distraction while driving or operating machinery. Wear protective gear during physical activities. This period rewards caution, not bravado.',
      hi: 'धीमे चलें। कार्य करने से पहले दोबारा जाँचें। गाड़ी चलाते समय शराब, थकान या विक्षेप से बचें। यह अवधि साहस नहीं, सावधानी को पुरस्कृत करती है।',
    },
    laypersonNote: {
      en: 'Mars in the 8th is like a car with worn brakes — usually fine, but needs extra care. When Rahu clouds your judgment AND Mars transits the same zone, the risk of impulsive accidents rises meaningfully.',
      hi: 'अष्टम में मंगल घिसे ब्रेक वाली कार जैसा है — सामान्यतः ठीक, पर अतिरिक्त सावधानी चाहिए। जब राहु निर्णय क्षमता धुंधली करे और मंगल गोचर उसी क्षेत्र में हो, तो आवेगी दुर्घटनाओं का जोखिम बढ़ता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'mental-health',
    theme: 'health',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 4 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 4 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 4 },
    ],
    text: {
      full: {
        en: 'Mental health is under converging pressure. Your 4th house (emotional wellbeing, inner peace) is natally stressed, Saturn\'s transit adds heaviness and isolation to your emotional world, and your dasha activates this vulnerable area. Anxiety, depression, and emotional exhaustion are real risks. This is not weakness — this is your chart telling you to prioritize mental health NOW, before it becomes a crisis.',
        hi: 'मानसिक स्वास्थ्य पर संयुक्त दबाव। चतुर्थ भाव तनावग्रस्त, शनि गोचर भावनात्मक दुनिया में भारीपन और अकेलापन, दशा संवेदनशील क्षेत्र सक्रिय। चिंता, अवसाद और भावनात्मक थकान वास्तविक जोखिम। यह कमजोरी नहीं — मानसिक स्वास्थ्य को अभी प्राथमिकता दें।',
      },
      mild: {
        en: 'Emotional heaviness is building. Saturn\'s transit through your 4th house can create a sense of isolation or burden. Acknowledge the weight you are carrying and seek support before it accumulates into deeper distress.',
        hi: 'भावनात्मक भारीपन बढ़ रहा है। चतुर्थ भाव में शनि गोचर अकेलेपन या बोझ की भावना पैदा कर सकता है। आप जो वजन उठा रहे हैं उसे स्वीकारें और गहरे दुख में बदलने से पहले सहायता लें।',
      },
    },
    advice: {
      en: 'Seek therapy or counseling proactively — not when you hit rock bottom. Build a support network. Reduce social isolation. Meditation, journaling, and time in nature are not optional luxuries during this period.',
      hi: 'सक्रिय रूप से थेरेपी या परामर्श लें — तल तक पहुँचने की प्रतीक्षा न करें। सहायता नेटवर्क बनाएँ। सामाजिक अकेलेपन को कम करें। ध्यान, जर्नलिंग और प्रकृति में समय इस अवधि में विलासिता नहीं, आवश्यकता है।',
    },
    laypersonNote: {
      en: 'The 4th house rules your emotional home base. When it is natally stressed, dasha-activated, and Saturn is transiting it — three layers of pressure land on your inner life simultaneously. Getting help is not giving up; it is responding intelligently to your chart.',
      hi: 'चतुर्थ भाव भावनात्मक आधार है। जब यह जन्म से तनावग्रस्त हो, दशा सक्रिय करे और शनि गोचर हो — तीन परतें एक साथ आंतरिक जीवन पर दबाव डालती हैं। सहायता लेना हार नहीं — कुंडली के प्रति बुद्धिमान प्रतिक्रिया है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
      TippanniSection.DashaSynthesis,
    ],
  },

  {
    id: 'surgery',
    theme: 'health',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 2, house: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 2, house: 8 },
    ],
    text: {
      full: {
        en: 'Mars doubly activates your 8th house (surgery, transformation). Natal Mars here gives surgical susceptibility, and Mars\' transit intensifies this. If surgery is recommended, this period favors decisive medical intervention — Mars gives the surgeon\'s hand precision. However, avoid elective procedures if possible and consult Muhurta for optimal timing.',
        hi: 'मंगल अष्टम भाव को दोगुना सक्रिय करता है। जन्मस्थ मंगल शल्यचिकित्सा संवेदनशीलता, मंगल गोचर तीव्रता। यदि शल्यचिकित्सा अनुशंसित, यह अवधि निर्णायक चिकित्सा हस्तक्षेप का पक्ष लेती है।',
      },
      mild: {
        en: 'The 8th house is receiving Mars energy from both natal and transit positions. Minor surgical or invasive procedures may be on the horizon. If non-urgent, consult an auspicious muhurta for scheduling.',
        hi: 'अष्टम भाव को जन्म और गोचर दोनों से मंगल ऊर्जा मिल रही है। छोटी शल्य या आक्रामक प्रक्रियाएँ क्षितिज पर हो सकती हैं। यदि अत्यावश्यक नहीं, तो शुभ मुहूर्त से समय निर्धारित करें।',
      },
    },
    advice: {
      en: 'If surgery is medically indicated, do not delay unnecessarily — Mars energy can support decisive intervention. Use the Muhurta tool to identify favorable dates. Ensure post-operative care is well-planned.',
      hi: 'यदि चिकित्सकीय रूप से शल्यचिकित्सा आवश्यक है, तो अनावश्यक विलंब न करें। मुहूर्त उपकरण से अनुकूल तिथि निर्धारित करें। ऑपरेशन के बाद देखभाल अच्छी तरह योजनाबद्ध करें।',
    },
    laypersonNote: {
      en: 'Mars rules cutting and precision. When it appears in the 8th house natally and also transits there, it creates a heightened surgical environment — not always bad, but worth understanding and timing carefully.',
      hi: 'मंगल काटने और सटीकता का शासक है। जब यह जन्म में और गोचर में अष्टम भाव में हो, शल्य वातावरण बढ़ता है — हमेशा बुरा नहीं, पर सावधानी से समझने और समय निर्धारित करने योग्य।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'vitality-peak',
    theme: 'health',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 1 },
      { type: 'natal', check: 'planet-in-house', planet: 0, house: 1 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 1 },
    ],
    text: {
      full: {
        en: 'Your vitality is at a peak. Sun in your 1st house gives natural constitutional strength and charisma, your lagna lord is strong, and Jupiter\'s transit amplifies physical energy and optimism. This is the ideal period to start fitness regimens, tackle physical challenges, and push your body to new levels. You have more energy than you realize.',
        hi: 'आपकी जीवन शक्ति चरम पर। प्रथम भाव में सूर्य स्वाभाविक संवैधानिक शक्ति, लग्नेश बलवान, बृहस्पति गोचर शारीरिक ऊर्जा और आशावाद बढ़ाता है। फिटनेस कार्यक्रम शुरू करने का आदर्श समय।',
      },
      mild: {
        en: 'Physical vitality is elevated. Your lagna lord supports constitutional resilience, and Jupiter\'s transit adds a layer of optimism and energy. A productive period for health investments.',
        hi: 'शारीरिक जीवन शक्ति बढ़ी हुई है। लग्नेश संवैधानिक लचीलेपन का समर्थन करता है, और बृहस्पति गोचर आशावाद और ऊर्जा जोड़ता है। स्वास्थ्य निवेश के लिए उत्पादक अवधि।',
      },
    },
    advice: {
      en: 'Capitalize on this peak energy window. Start a new fitness program, schedule demanding health goals, or undergo elective health procedures. Energy invested in your body now yields compounding returns.',
      hi: 'इस शिखर ऊर्जा खिड़की का लाभ उठाएँ। नया फिटनेस कार्यक्रम शुरू करें, माँगलिक स्वास्थ्य लक्ष्य निर्धारित करें। अभी शरीर में निवेश की गई ऊर्जा चक्रवृद्धि लाभ देती है।',
    },
    laypersonNote: {
      en: 'Sun in the 1st gives you natural physical brightness. A strong lagna lord means your constitution handles stress well. Jupiter transiting the ascendant is like a seasonal health supercharge — your body is primed to respond.',
      hi: 'प्रथम भाव में सूर्य स्वाभाविक शारीरिक चमक देता है। बलवान लग्नेश संरचना को तनाव अच्छे से संभालने देता है। लग्न में बृहस्पति गोचर मौसमी स्वास्थ्य सुपरचार्ज है — शरीर प्रतिक्रिया देने के लिए तैयार है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'eye-head',
    theme: 'health',
    significance: 2,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 2 },
      { type: 'natal', check: 'planet-in-house', planet: 0, house: 12 },
    ],
    text: {
      full: {
        en: 'Vulnerability signals for eyes and head. Your 2nd house (right eye, face) is stressed, and Sun in the 12th house (left eye, vision) weakens solar vitality. Regular eye checkups are advised. If you experience persistent headaches or vision changes, seek medical attention promptly.',
        hi: 'आँख और सिर की संवेदनशीलता। द्वितीय भाव (दाँयी आँख) तनावग्रस्त, सूर्य द्वादश भाव में (बाँयी आँख) सौर जीवन शक्ति कमजोर। नियमित नेत्र जाँच की सलाह।',
      },
      mild: {
        en: 'Mild indicators suggest attention to eye and facial health. The 2nd house and 12th-house Sun combination can manifest as strain or fatigue in the eyes and head area. Simple preventive care addresses this well.',
        hi: 'हल्के संकेतक नेत्र और चेहरे के स्वास्थ्य पर ध्यान सुझाते हैं। द्वितीय भाव और द्वादश सूर्य का संयोजन आँख और सिर क्षेत्र में तनाव या थकान के रूप में प्रकट हो सकता है।',
      },
    },
    advice: {
      en: 'Schedule an annual eye examination. Limit screen time and use blue-light protection. If headaches are frequent, rule out vision correction needs before assuming stress-related causes.',
      hi: 'वार्षिक नेत्र परीक्षण करवाएँ। स्क्रीन समय सीमित करें और ब्लू-लाइट सुरक्षा का उपयोग करें। यदि सिरदर्द बार-बार हो, तनाव-संबंधित कारण मानने से पहले दृष्टि सुधार की आवश्यकता जाँचें।',
    },
    laypersonNote: {
      en: 'In Vedic astrology, the 2nd house rules the right eye and face, while the 12th house rules the left eye. Sun in the 12th can dim its own vitality in the zone it rules. Together, these two indicators create a gentle but real signal for eye care.',
      hi: 'वैदिक ज्योतिष में द्वितीय भाव दाँयी आँख और चेहरे का, द्वादश भाव बाँयी आँख का स्वामी है। द्वादश में सूर्य उस क्षेत्र में अपनी जीवन शक्ति कम कर सकता है। दोनों मिलकर नेत्र देखभाल के लिए सौम्य पर वास्तविक संकेत देते हैं।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'digestive',
    theme: 'health',
    significance: 2,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 6 },
      { type: 'natal', check: 'planet-in-house', planet: 3, house: 6 },
    ],
    text: {
      full: {
        en: 'Digestive system vulnerability. Mercury in the 6th house with an afflicted 6th lord points to metabolic and gut health issues. Nervous digestion, food sensitivities, and stress-related stomach problems are indicated. Dietary discipline and stress management are your best medicine.',
        hi: 'पाचन तंत्र संवेदनशीलता। षष्ठ भाव में बुध पीड़ित षष्ठेश के साथ — चयापचय और आंत स्वास्थ्य समस्याएँ। तंत्रिका पाचन, खाद्य संवेदनशीलता और तनाव-संबंधित पेट की समस्याएँ। आहार अनुशासन सर्वोत्तम दवा।',
      },
      mild: {
        en: 'Some digestive sensitivity is indicated by Mercury\'s placement in the 6th house. Mindful eating, regular meal times, and reducing processed foods go a long way toward keeping this manageable.',
        hi: 'षष्ठ भाव में बुध की स्थिति से कुछ पाचन संवेदनशीलता संकेतित है। सचेत भोजन, नियमित भोजन का समय और प्रसंस्कृत खाद्य पदार्थों को कम करना इसे प्रबंधनीय रखने में मदद करता है।',
      },
    },
    advice: {
      en: 'Track food sensitivities through elimination diets. Eat at consistent times to regulate your nervous system\'s relationship with digestion. Reduce caffeine and processed foods during stressful periods. Probiotics and gut-friendly foods offer real support.',
      hi: 'उन्मूलन आहार से खाद्य संवेदनशीलता ट्रैक करें। पाचन के साथ तंत्रिका तंत्र संबंध नियमित करने के लिए नियमित समय पर खाएँ। तनावपूर्ण समय में कैफीन और प्रसंस्कृत खाद्य पदार्थ कम करें।',
    },
    laypersonNote: {
      en: 'Mercury rules the nervous system and intestinal function. When Mercury sits in the 6th house of illness with a stressed house lord, it creates a direct line between your mental anxiety and your gut health — the mind-body digestive link is strong in your chart.',
      hi: 'बुध तंत्रिका तंत्र और आंत कार्य का शासक है। जब बुध रोग के षष्ठ भाव में पीड़ित भावेश के साथ हो, यह मानसिक चिंता और आंत स्वास्थ्य के बीच सीधा संबंध बनाता है — कुंडली में मन-शरीर पाचन संबंध प्रबल है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },
];

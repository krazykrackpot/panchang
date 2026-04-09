'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Tippanni — Your Chart Interpretation Guide', hi: 'टिप्पणी — कुण्डली व्याख्या मार्गदर्शिका' },
  subtitle: {
    en: 'How your birth chart is transformed from raw data into meaningful life insights',
    hi: 'कैसे आपकी जन्म कुण्डली कच्चे डेटा से सार्थक जीवन अन्तर्दृष्टि में बदलती है',
  },

  whatTitle: { en: 'What is a Tippanni?', hi: 'टिप्पणी क्या है?' },
  whatP1: {
    en: 'Tippanni (टिप्पणी) literally means "notes" or "commentary" in Sanskrit. In the context of Jyotish, a Tippanni is the interpretive reading of your birth chart — the translation of planetary positions, house placements, yogas, and dashas into human language. While your Kundali is the raw data (the map), the Tippanni is what the map means for YOUR specific life.',
    hi: 'टिप्पणी का शाब्दिक अर्थ "टिप्पणियाँ" या "भाष्य" है। ज्योतिष के संदर्भ में, टिप्पणी आपकी जन्म कुण्डली का व्याख्यात्मक पठन है — ग्रह स्थितियों, भाव स्थानों, योगों और दशाओं का मानवीय भाषा में अनुवाद। जहाँ कुण्डली कच्चा डेटा (नक्शा) है, टिप्पणी बताती है कि वह नक्शा आपके विशिष्ट जीवन के लिए क्या अर्थ रखता है।',
  },
  whatP2: {
    en: 'Traditionally, a Tippanni was handwritten by an astrologer who would spend hours studying a chart. Our system generates it algorithmically by analyzing the convergence of multiple data points — each section synthesizes several calculations into one coherent interpretation.',
    hi: 'परम्परागत रूप से, एक ज्योतिषी द्वारा कुण्डली का घंटों अध्ययन करके हस्तलिखित टिप्पणी तैयार की जाती थी। हमारी प्रणाली इसे एल्गोरिदमिक रूप से उत्पन्न करती है — प्रत्येक खण्ड कई गणनाओं को एक सुसंगत व्याख्या में संश्लेषित करता है।',
  },

  howTitle: { en: 'How the Tippanni is Generated', hi: 'टिप्पणी कैसे उत्पन्न होती है' },
  howP1: {
    en: 'No single factor in a chart works in isolation. The Tippanni engine uses convergence analysis — examining how multiple independent data points point in the same direction:',
    hi: 'कुण्डली में कोई एकल कारक अकेले काम नहीं करता। टिप्पणी इंजन अभिसरण विश्लेषण का उपयोग करता है — कई स्वतंत्र डेटा बिन्दु एक ही दिशा में कैसे इंगित करते हैं, यह जाँचता है:',
  },
  convergenceFactors: [
    { factor: { en: 'Planet Position', hi: 'ग्रह स्थिति' }, detail: { en: 'Which house and sign each planet occupies — the base layer of interpretation', hi: 'प्रत्येक ग्रह किस भाव और राशि में है — व्याख्या की आधार परत' } },
    { factor: { en: 'Dignity', hi: 'गरिमा' }, detail: { en: 'Is the planet exalted, own-sign, friendly, enemy, or debilitated? This modifies intensity', hi: 'ग्रह उच्च, स्वराशि, मित्र, शत्रु या नीच में है? यह तीव्रता को संशोधित करता है' } },
    { factor: { en: 'Aspects', hi: 'दृष्टि' }, detail: { en: 'Which planets aspect each other — creating synergies or conflicts', hi: 'कौन से ग्रह एक दूसरे पर दृष्टि डालते हैं — सहयोग या संघर्ष' } },
    { factor: { en: 'Yogas', hi: 'योग' }, detail: { en: 'Special combinations that amplify specific themes', hi: 'विशेष संयोग जो विशिष्ट विषयों को बढ़ाते हैं' } },
    { factor: { en: 'Shadbala', hi: 'षड्बल' }, detail: { en: 'Numerical strength confirming whether a planet CAN deliver its promises', hi: 'संख्यात्मक बल जो पुष्टि करता है कि ग्रह अपने वादे पूरे कर सकता है या नहीं' } },
    { factor: { en: 'Navamsha', hi: 'नवांश' }, detail: { en: 'The D9 chart confirming or modifying the D1 reading', hi: 'D9 चार्ट जो D1 पठन की पुष्टि या संशोधन करता है' } },
    { factor: { en: 'Current Dasha', hi: 'वर्तमान दशा' }, detail: { en: 'Which planet\'s period is running NOW — activating specific chart areas', hi: 'कौन से ग्रह की अवधि अभी चल रही है — विशिष्ट कुण्डली क्षेत्रों को सक्रिय करती है' } },
  ],

  personalityTitle: { en: 'Personality Section — The Three Pillars', hi: 'व्यक्तित्व खण्ड — तीन स्तम्भ' },
  personalityP1: {
    en: 'Your personality in Vedic astrology is not determined by a single sign. It is the convergence of three key factors, each representing a different dimension of who you are:',
    hi: 'वैदिक ज्योतिष में आपका व्यक्तित्व एक ही राशि से निर्धारित नहीं होता। यह तीन प्रमुख कारकों का अभिसरण है, प्रत्येक आपके अस्तित्व के एक अलग आयाम का प्रतिनिधित्व करता है:',
  },
  personalityPillars: [
    {
      pillar: { en: 'Ascendant (Lagna)', hi: 'लग्न' },
      represents: { en: 'Your outer self — physical body, appearance, first impressions, natural behavior. This is the "mask" you wear and the lens through which you experience the world. It determines your physical constitution (Aries rising = athletic, Cancer rising = nurturing).', hi: 'आपका बाहरी स्वरूप — शरीर, रूप, प्रथम प्रभाव, स्वाभाविक व्यवहार। यह वह "मुखौटा" है जो आप पहनते हैं और वह लेंस जिससे आप दुनिया अनुभव करते हैं।' },
    },
    {
      pillar: { en: 'Moon Sign', hi: 'चन्द्र राशि' },
      represents: { en: 'Your inner self — mind, emotions, instinctive reactions, what makes you feel safe, your emotional needs. The Moon sign is often more accurate than the Sun sign for describing daily experience. This is who you are when no one is watching.', hi: 'आपका आन्तरिक स्वरूप — मन, भावनाएं, सहज प्रतिक्रियाएं, क्या आपको सुरक्षित महसूस कराता है। चन्द्र राशि अक्सर दैनिक अनुभव का सटीक वर्णन करती है। यह वह है जो आप अकेले में हैं।' },
    },
    {
      pillar: { en: 'Sun Sign', hi: 'सूर्य राशि' },
      represents: { en: 'Your soul\'s purpose — ego, ambition, core identity, what you want to be known for. In Vedic astrology the Sun sign is calculated differently (sidereal vs tropical), so your Vedic Sun sign may differ from your Western one.', hi: 'आत्मा का उद्देश्य — अहंकार, महत्वाकांक्षा, मूल पहचान। वैदिक ज्योतिष में सूर्य राशि भिन्न तरीके से गणना की जाती है (साइडरियल), इसलिए आपकी वैदिक सूर्य राशि पश्चिमी से भिन्न हो सकती है।' },
    },
  ],

  planetInsightsTitle: { en: 'Planet Insights — What Each Placement Means', hi: 'ग्रह अन्तर्दृष्टि — प्रत्येक स्थिति का अर्थ' },
  planetInsightsP1: {
    en: 'For each of the 9 planets, the Tippanni describes what that planet means in YOUR specific house and sign. This is not generic Sun-sign astrology — it combines the planet\'s natural significations with its house lordship for your Ascendant, its dignity in the sign it occupies, and aspects it receives.',
    hi: 'प्रत्येक 9 ग्रहों के लिए, टिप्पणी बताती है कि वह ग्रह आपके विशिष्ट भाव और राशि में क्या अर्थ रखता है। यह सामान्य सूर्य-राशि ज्योतिष नहीं है — यह ग्रह के प्राकृतिक अर्थों को आपके लग्न के लिए भाव स्वामित्व, राशि में गरिमा और प्राप्त दृष्टियों के साथ मिलाती है।',
  },
  planetInsightsP2: {
    en: 'For example, Jupiter in the 7th house gives a wise, generous spouse — but Jupiter in the 7th house in Capricorn (debilitated) may give a spouse who is wise but initially appears cold or overly practical. The Tippanni captures these nuances.',
    hi: 'उदाहरण: सप्तम भाव में गुरु बुद्धिमान, उदार जीवनसाथी देता है — लेकिन मकर राशि (नीच) में सप्तम भाव में गुरु बुद्धिमान पर शुरू में ठंडा या अत्यधिक व्यावहारिक जीवनसाथी दे सकता है। टिप्पणी इन सूक्ष्मताओं को पकड़ती है।',
  },

  yogasTitle: { en: 'Yogas — Your Installed Bonus Features', hi: 'योग — आपकी स्थापित बोनस सुविधाएँ' },
  yogasP1: {
    en: 'Yogas are special planetary combinations that, when present in your chart, create distinct talents, blessings, or challenges. The Tippanni identifies all active yogas and explains their specific impact on your life.',
    hi: 'योग विशेष ग्रह संयोग हैं जो आपकी कुण्डली में होने पर विशिष्ट प्रतिभाएँ, आशीर्वाद या चुनौतियाँ बनाते हैं। टिप्पणी सभी सक्रिय योगों की पहचान करती है और आपके जीवन पर उनके विशिष्ट प्रभाव की व्याख्या करती है।',
  },
  yogasP2: {
    en: 'Not all yogas in classical texts apply equally. The Tippanni evaluates each yoga\'s strength based on: (a) the involved planets\' Shadbala scores, (b) whether the yoga is supported or weakened by aspects, (c) the Navamsha confirmation, and (d) whether the Dasha period is activating the yoga NOW.',
    hi: 'शास्त्रीय ग्रन्थों के सभी योग समान रूप से लागू नहीं होते। टिप्पणी प्रत्येक योग की शक्ति का मूल्यांकन करती है: (a) सम्बन्धित ग्रहों के षड्बल, (b) दृष्टियों से समर्थन या कमज़ोरी, (c) नवांश पुष्टि, और (d) क्या दशा अवधि अभी योग को सक्रिय कर रही है।',
  },

  doshasTitle: { en: 'Doshas — Not Death Sentences', hi: 'दोष — मृत्युदण्ड नहीं' },
  doshasP1: {
    en: 'A Dosha is a challenging combination in the chart. The three most commonly discussed are Manglik Dosha (Mars in 1/2/4/7/8/12), Kala Sarpa Dosha (all planets between Rahu-Ketu), and Pitru Dosha (Sun afflicted by Rahu/Saturn). The Tippanni contextualizes each dosha:',
    hi: 'दोष कुण्डली में चुनौतीपूर्ण संयोग है। तीन सबसे सामान्य: मांगलिक दोष (मंगल 1/2/4/7/8/12 में), काल सर्प दोष (सभी ग्रह राहु-केतु के बीच), और पितृ दोष (सूर्य राहु/शनि से पीड़ित)। टिप्पणी प्रत्येक दोष को संदर्भ में रखती है:',
  },
  doshaPoints: [
    { point: { en: 'Is it actually formed in your chart? Many "Manglik" charts don\'t actually meet the classical criteria.', hi: 'क्या यह वास्तव में आपकी कुण्डली में बनता है? कई "मांगलिक" कुण्डलियाँ शास्त्रीय मानदण्ड पूरे नहीं करतीं।' } },
    { point: { en: 'Is it cancelled? Manglik Dosha has over 10 cancellation conditions. Kala Sarpa is cancelled if any planet is with Rahu/Ketu.', hi: 'क्या यह रद्द है? मांगलिक दोष की 10 से अधिक रद्दीकरण शर्तें हैं। काल सर्प रद्द होता है यदि कोई ग्रह राहु/केतु के साथ है।' } },
    { point: { en: 'How strong is it? A dosha from a well-placed Mars (own sign, aspected by Jupiter) is much milder than one from an afflicted Mars.', hi: 'कितना प्रबल है? सुस्थित मंगल (स्वराशि, गुरु दृष्टि) का दोष पीड़ित मंगल से कहीं हल्का होता है।' } },
    { point: { en: 'Remedies are given — not as superstition, but as practical methods to channel the difficult energy constructively.', hi: 'उपाय दिए जाते हैं — अंधविश्वास के रूप में नहीं, बल्कि कठिन ऊर्जा को रचनात्मक रूप से चैनल करने के व्यावहारिक तरीकों के रूप में।' } },
  ],

  lifeAreasTitle: { en: 'Life Areas — Houses Map to Real Life', hi: 'जीवन क्षेत्र — भाव वास्तविक जीवन से जुड़ते हैं' },
  lifeAreas: [
    { area: { en: 'Career & Status', hi: 'कैरियर और प्रतिष्ठा' }, houses: '10, 6, 2, 11', detail: { en: 'The 10th house is primary. Its lord, occupants, and aspects determine career direction. The 6th house shows daily work style. The 2nd shows income, the 11th shows gains and networks.', hi: '10वाँ भाव प्राथमिक है। इसका स्वामी, निवासी और दृष्टियाँ कैरियर दिशा निर्धारित करते हैं। 6वाँ भाव दैनिक कार्यशैली, 2रा आय, 11वाँ लाभ दिखाता है।' } },
    { area: { en: 'Wealth & Finance', hi: 'धन और वित्त' }, houses: '2, 11, 5, 9', detail: { en: 'The 2nd house shows accumulated wealth and family money. The 11th shows income streams. The 5th shows speculative gains. The 9th shows fortune and luck.', hi: '2रा भाव संचित धन, 11वाँ आय धाराएं, 5वाँ सट्टा लाभ, 9वाँ भाग्य और किस्मत दिखाता है।' } },
    { area: { en: 'Marriage & Relationships', hi: 'विवाह और सम्बन्ध' }, houses: '7, 2, 5, 8', detail: { en: 'The 7th house is the primary marriage house. Its lord\'s placement reveals spouse characteristics. Venus (natural significator of marriage) and Jupiter (for women\'s husband) are key.', hi: '7वाँ भाव प्राथमिक विवाह भाव है। इसके स्वामी की स्थिति जीवनसाथी के गुण बताती है। शुक्र और गुरु प्रमुख हैं।' } },
    { area: { en: 'Health', hi: 'स्वास्थ्य' }, houses: '1, 6, 8', detail: { en: 'The 1st house and its lord indicate overall constitution. The 6th house shows diseases and immune response. The 8th shows chronic conditions and longevity.', hi: '1ला भाव और लग्नेश समग्र संरचना दर्शाते हैं। 6वाँ भाव रोग और प्रतिरक्षा, 8वाँ दीर्घकालिक स्थितियाँ और दीर्घायु दिखाता है।' } },
    { area: { en: 'Education & Intelligence', hi: 'शिक्षा और बुद्धि' }, houses: '5, 4, 9, 2', detail: { en: 'The 5th house governs intelligence and learning ability. The 4th is formal education. The 9th is higher education and wisdom. Mercury and Jupiter are the knowledge planets.', hi: '5वाँ भाव बुद्धि और सीखने की क्षमता, 4था औपचारिक शिक्षा, 9वाँ उच्च शिक्षा और ज्ञान को नियंत्रित करता है। बुध और गुरु ज्ञान ग्रह हैं।' } },
  ],

  dashaInsightTitle: { en: 'Dasha Insight — Your Current Life Chapter', hi: 'दशा अन्तर्दृष्टि — आपका वर्तमान जीवन अध्याय' },
  dashaInsightP1: {
    en: 'The Dasha section of the Tippanni tells you which planet is currently "running the show" in your life. Your Mahadasha (major period) sets the overall theme, and the Antardasha (sub-period) fine-tunes it. The Tippanni synthesizes:',
    hi: 'टिप्पणी का दशा खण्ड बताता है कि कौन सा ग्रह वर्तमान में आपके जीवन में "प्रमुख भूमिका" में है। महादशा समग्र विषय तय करती है और अन्तर्दशा उसे सूक्ष्म करती है। टिप्पणी संश्लेषित करती है:',
  },
  dashaInsightPoints: [
    { point: { en: 'The Mahadasha lord\'s strength (Shadbala) — can it deliver good or challenging results?', hi: 'महादशा स्वामी की शक्ति (षड्बल) — क्या यह अच्छे या चुनौतीपूर्ण परिणाम दे सकता है?' } },
    { point: { en: 'Which houses the Dasha lord rules and occupies — what life areas are activated', hi: 'दशा स्वामी किन भावों का शासन करता है और किसमें बैठा है — कौन से जीवन क्षेत्र सक्रिय हैं' } },
    { point: { en: 'The Antardasha lord\'s relationship with the Mahadasha lord — friendly, neutral, or hostile', hi: 'अन्तर्दशा स्वामी का महादशा स्वामी से सम्बन्ध — मित्र, तटस्थ या शत्रु' } },
    { point: { en: 'Any yogas involving the Dasha lord that become active during this period', hi: 'दशा स्वामी से जुड़े कोई योग जो इस अवधि में सक्रिय होते हैं' } },
  ],

  strengthTitle: { en: 'Strength Overview — Shadbala Percentages', hi: 'बल अवलोकन — षड्बल प्रतिशत' },
  strengthP1: {
    en: 'The Tippanni includes a strength bar for each planet showing its Shadbala (six-fold strength) as a percentage of the required minimum. A planet scoring 150% or higher is considered strong — it can deliver its promises during its Dasha. Below 100%, the planet struggles. The strongest planet in your chart often defines your most prominent personality trait and the life area where you naturally excel.',
    hi: 'टिप्पणी में प्रत्येक ग्रह के लिए एक बल पट्टी शामिल है जो उसका षड्बल आवश्यक न्यूनतम के प्रतिशत के रूप में दिखाती है। 150% या अधिक स्कोर करने वाला ग्रह बलवान माना जाता है। 100% से नीचे, ग्रह संघर्ष करता है। आपकी कुण्डली का सबसे बलवान ग्रह अक्सर आपका सबसे प्रमुख व्यक्तित्व लक्षण परिभाषित करता है।',
  },

  yearPredictionsTitle: { en: 'Year Predictions — Transits + Dasha', hi: 'वार्षिक भविष्यवाणी — गोचर + दशा' },
  yearPredictionsP1: {
    en: 'The most dynamic section of the Tippanni combines two timing systems to give year-specific predictions:',
    hi: 'टिप्पणी का सबसे गतिशील खण्ड वर्ष-विशिष्ट भविष्यवाणियाँ देने के लिए दो समय प्रणालियों को जोड़ता है:',
  },
  yearPredictionsSystems: [
    {
      system: { en: 'Transits (Gochar)', hi: 'गोचर' },
      detail: {
        en: 'Where are the planets RIGHT NOW in the sky, and which houses of your birth chart are they activating? Slow planets matter most: Jupiter (1 year per sign), Saturn (2.5 years), and Rahu/Ketu (1.5 years). The Tippanni checks if you are in Sade Sati (Saturn over Moon), Jupiter return, or Rahu-Ketu axis transit.',
        hi: 'अभी आकाश में ग्रह कहाँ हैं, और आपकी जन्म कुण्डली के कौन से भाव सक्रिय कर रहे हैं? धीमे ग्रह सबसे महत्वपूर्ण: गुरु (1 वर्ष प्रति राशि), शनि (2.5 वर्ष), राहु/केतु (1.5 वर्ष)।',
      },
    },
    {
      system: { en: 'Dashas', hi: 'दशा' },
      detail: {
        en: 'Your current Mahadasha and Antardasha set the base vibration. Transits over the Dasha lord\'s natal position intensify its effects. When both Dasha and transit point to the same theme (e.g., Saturn Dasha + Saturn transiting 10th house = intense career focus), the prediction is strong.',
        hi: 'आपकी वर्तमान महादशा और अन्तर्दशा आधार कम्पन तय करती है। दशा स्वामी की जन्म स्थिति पर गोचर उसके प्रभावों को तीव्र करता है। जब दशा और गोचर दोनों एक ही विषय की ओर इंगित करें, तो भविष्यवाणी प्रबल होती है।',
      },
    },
  ],

  remediesTitle: { en: 'Remedies — Gemstones, Mantras, Practices', hi: 'उपाय — रत्न, मन्त्र, अभ्यास' },
  remediesP1: {
    en: 'The Tippanni concludes with personalized remedies based on the specific weaknesses and challenges identified in your chart. These are not superstition — they are time-tested methods from classical Jyotish texts for channeling difficult planetary energies:',
    hi: 'टिप्पणी आपकी कुण्डली में पहचानी गई विशिष्ट कमज़ोरियों और चुनौतियों के आधार पर व्यक्तिगत उपायों के साथ समाप्त होती है। ये अंधविश्वास नहीं — शास्त्रीय ज्योतिष ग्रन्थों से कठिन ग्रह ऊर्जाओं को चैनल करने के समय-परीक्षित तरीके हैं:',
  },
  remedyTypes: [
    { type: { en: 'Gemstones (Ratna)', hi: 'रत्न' }, detail: { en: 'Each planet has an associated gemstone that amplifies its energy. Gemstones should ONLY be worn for benefic planets or planets whose energy you want to strengthen. Wearing a gemstone for a malefic planet can intensify problems. The Tippanni recommends stones only for planets that are functional benefics for your Ascendant.', hi: 'प्रत्येक ग्रह का एक सम्बद्ध रत्न है जो उसकी ऊर्जा बढ़ाता है। रत्न केवल शुभ ग्रहों या जिनकी ऊर्जा बढ़ानी हो उनके लिए पहनने चाहिए। पाप ग्रह का रत्न समस्याएँ बढ़ा सकता है।' } },
    { type: { en: 'Mantras', hi: 'मन्त्र' }, detail: { en: 'Specific Sanskrit mantras for each planet that, when chanted with regularity and devotion, harmonize the planet\'s vibration. The number of repetitions (japa) varies by planet. Mantras work through sound vibration — the physical resonance affects consciousness.', hi: 'प्रत्येक ग्रह के विशिष्ट संस्कृत मन्त्र, जिनका नियमित और श्रद्धापूर्वक जप ग्रह के कम्पन को सामंजस्य करता है। जप संख्या ग्रह अनुसार भिन्न होती है। मन्त्र ध्वनि कम्पन से कार्य करते हैं।' } },
    { type: { en: 'Practices (Upaya)', hi: 'अभ्यास (उपाय)' }, detail: { en: 'Specific actions aligned with each planet: charity on the planet\'s day, fasting, serving the planet\'s karakas (e.g., serving the elderly for Saturn), visiting related temples, and lifestyle adjustments. These redirect the planetary energy constructively.', hi: 'प्रत्येक ग्रह से सम्बद्ध विशिष्ट क्रियाएँ: ग्रह के दिन दान, उपवास, ग्रह के कारकों की सेवा (शनि के लिए बुज़ुर्गों की सेवा), सम्बन्धित मन्दिर यात्रा और जीवनशैली समायोजन।' } },
  ],

  furtherTitle: { en: 'Explore Each Section in Depth', hi: 'प्रत्येक खण्ड का गहन अध्ययन करें' },
  furtherLinks: [
    { href: '/learn/birth-chart', label: { en: 'Understanding Your Birth Chart', hi: 'अपनी जन्म कुण्डली समझें' } },
    { href: '/learn/grahas', label: { en: 'The 9 Planets (Grahas)', hi: '9 ग्रह' } },
    { href: '/learn/yogas', label: { en: 'Yogas: Planetary Combinations', hi: 'योग: ग्रह संयोग' } },
    { href: '/learn/doshas', label: { en: 'Understanding Doshas', hi: 'दोष समझें' } },
    { href: '/learn/dashas', label: { en: 'Dashas: Life Timing System', hi: 'दशा: जीवन समय प्रणाली' } },
    { href: '/learn/shadbala', label: { en: 'Shadbala: Planetary Strength', hi: 'षड्बल: ग्रह शक्ति' } },
    { href: '/learn/transits', label: { en: 'Understanding Transits (Gochar)', hi: 'गोचर को समझें' } },
    { href: '/learn/remedies', label: { en: 'Remedies in Vedic Astrology', hi: 'वैदिक ज्योतिष में उपाय' } },
  ],
};

export default function TippanniPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {isHi ? L.title.hi : L.title.en}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{isHi ? L.subtitle.hi : L.subtitle.en}</p>
      </header>

      {/* 1. What is a Tippanni */}
      <LessonSection number={1} title={isHi ? L.whatTitle.hi : L.whatTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.whatP1.hi : L.whatP1.en}</p>
          <p>{isHi ? L.whatP2.hi : L.whatP2.en}</p>
        </div>
      </LessonSection>

      {/* 2. How it's generated */}
      <LessonSection number={2} title={isHi ? L.howTitle.hi : L.howTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.howP1.hi : L.howP1.en}</p>
          <div className="space-y-2 mt-4">
            {L.convergenceFactors.map((f, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                <span className="text-gold-primary font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                <div>
                  <span className="text-gold-light font-semibold text-xs">{isHi ? f.factor.hi : f.factor.en}</span>
                  <span className="text-text-secondary text-xs"> — {isHi ? f.detail.hi : f.detail.en}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 3. Personality */}
      <LessonSection number={3} title={isHi ? L.personalityTitle.hi : L.personalityTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.personalityP1.hi : L.personalityP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.personalityPillars.map((p, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {isHi ? p.pillar.hi : p.pillar.en}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? p.represents.hi : p.represents.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 4. Planet insights */}
      <LessonSection number={4} title={isHi ? L.planetInsightsTitle.hi : L.planetInsightsTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.planetInsightsP1.hi : L.planetInsightsP1.en}</p>
          <p>{isHi ? L.planetInsightsP2.hi : L.planetInsightsP2.en}</p>
        </div>
      </LessonSection>

      {/* 5. Yogas */}
      <LessonSection number={5} title={isHi ? L.yogasTitle.hi : L.yogasTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.yogasP1.hi : L.yogasP1.en}</p>
          <p>{isHi ? L.yogasP2.hi : L.yogasP2.en}</p>
          <p className="text-xs">
            <Link href="/learn/yogas" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'योगों का गहन अध्ययन →' : 'Deep dive into Yogas →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 6. Doshas */}
      <LessonSection number={6} title={isHi ? L.doshasTitle.hi : L.doshasTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.doshasP1.hi : L.doshasP1.en}</p>
          <ul className="space-y-2 mt-3">
            {L.doshaPoints.map((d, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{isHi ? d.point.hi : d.point.en}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs">
            <Link href="/learn/doshas" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'दोषों का गहन अध्ययन →' : 'Deep dive into Doshas →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 7. Life areas */}
      <LessonSection number={7} title={isHi ? L.lifeAreasTitle.hi : L.lifeAreasTitle.en}>
        <div className="space-y-3">
          {L.lifeAreas.map((la, i) => (
            <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-bold text-sm">{isHi ? la.area.hi : la.area.en}</span>
                <span className="text-text-secondary/40 text-xs ml-auto">{isHi ? 'भाव' : 'Houses'}: {la.houses}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{isHi ? la.detail.hi : la.detail.en}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 8. Dasha insight */}
      <LessonSection number={8} title={isHi ? L.dashaInsightTitle.hi : L.dashaInsightTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.dashaInsightP1.hi : L.dashaInsightP1.en}</p>
          <ul className="space-y-2 mt-3">
            {L.dashaInsightPoints.map((d, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{isHi ? d.point.hi : d.point.en}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs">
            <Link href="/learn/dashas" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'दशा प्रणाली का गहन अध्ययन →' : 'Deep dive into the Dasha system →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 9. Strength */}
      <LessonSection number={9} title={isHi ? L.strengthTitle.hi : L.strengthTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.strengthP1.hi : L.strengthP1.en}</p>
          <p className="text-xs">
            <Link href="/learn/shadbala" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'षड्बल का गहन अध्ययन →' : 'Deep dive into Shadbala →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 10. Year predictions */}
      <LessonSection number={10} title={isHi ? L.yearPredictionsTitle.hi : L.yearPredictionsTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.yearPredictionsP1.hi : L.yearPredictionsP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.yearPredictionsSystems.map((s, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {isHi ? s.system.hi : s.system.en}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? s.detail.hi : s.detail.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 11. Remedies */}
      <LessonSection number={11} title={isHi ? L.remediesTitle.hi : L.remediesTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.remediesP1.hi : L.remediesP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.remedyTypes.map((r, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
                  {isHi ? r.type.hi : r.type.en}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? r.detail.hi : r.detail.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* Further learning */}
      <LessonSection title={isHi ? L.furtherTitle.hi : L.furtherTitle.en}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {L.furtherLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {isHi ? link.label.hi : link.label.en} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}

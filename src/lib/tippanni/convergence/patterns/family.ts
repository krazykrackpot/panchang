// src/lib/tippanni/convergence/patterns/family.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const FAMILY_PATTERNS: ConvergencePattern[] = [
  {
    id: 'childbirth',
    theme: 'family',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 5 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 5 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 },
    ],
    text: {
      full: {
        en: 'A powerful convergence for children. Your 5th lord (progeny) is strong, Jupiter — the natural significator of children — transits your 5th house, and your dasha activates the same area. If trying to conceive, this is one of the most favorable windows. If already a parent, children bring exceptional joy and pride. Creative projects conceived now carry the energy of new life.',
        hi: 'संतान के लिए शक्तिशाली संयोग। पंचमेश बलवान, बृहस्पति — संतान का प्राकृतिक कारक — पंचम भाव में गोचर, दशा इसी क्षेत्र को सक्रिय। गर्भधारण का प्रयास कर रहे हों तो सर्वाधिक अनुकूल खिड़की।',
      },
      mild: {
        en: 'Positive energy flows toward children and creative endeavors. Your 5th house is receiving favorable attention and the conditions for expansion in this area are supportive. This is a meaningful period to nurture what you wish to bring into the world.',
        hi: 'संतान और सृजनात्मक प्रयासों की ओर सकारात्मक ऊर्जा प्रवाहित। पंचम भाव अनुकूल ध्यान प्राप्त कर रहा है। आप जो दुनिया में लाना चाहते हैं उसे पोषित करने का सार्थक समय।',
      },
    },
    advice: {
      en: 'If family expansion is your goal, consult a physician and take proactive steps — the cosmic window supports the intention. If you are already a parent, invest quality time with your children; bonds forged now deepen meaningfully.',
      hi: 'यदि परिवार विस्तार लक्ष्य है तो चिकित्सक से परामर्श लें और सक्रिय कदम उठाएँ। यदि पहले से माता-पिता हैं तो बच्चों के साथ गुणवत्तापूर्ण समय बिताएँ।',
    },
    laypersonNote: {
      en: 'When your birth chart, current planetary period, and a major transit all focus on the house of children simultaneously, it creates one of the strongest fertility and parenthood windows in Vedic astrology.',
      hi: 'जब जन्म कुंडली, वर्तमान ग्रह काल और बड़ा गोचर एक साथ संतान भाव पर केंद्रित होते हैं, तो वैदिक ज्योतिष में सबसे मजबूत प्रजनन और पितृत्व खिड़की बनती है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'child-health',
    theme: 'family',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 5 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 5 },
    ],
    text: {
      full: {
        en: "Concern signals regarding children. Your 5th house lord is weakened and Saturn's transit adds pressure to the children sector. If you have children, monitor their health and wellbeing — they may face challenges that require your attention. Academic pressures, health issues, or behavioral changes in children are possible. Be present and supportive.",
        hi: 'संतान संबंधी चिंता संकेत। पंचमेश कमजोर और शनि गोचर संतान क्षेत्र पर दबाव। बच्चों के स्वास्थ्य और कल्याण पर ध्यान दें। शैक्षिक दबाव, स्वास्थ्य समस्या या व्यवहार परिवर्तन संभव।',
      },
      mild: {
        en: "Some strain touches the children sector of your chart. Saturn's transit calls for patient, steady attention rather than alarm. Stay observant and responsive to the needs of your children during this period.",
        hi: 'बच्चों के क्षेत्र में कुछ तनाव। शनि का गोचर घबराहट नहीं, धैर्यपूर्ण ध्यान माँगता है। इस अवधि में बच्चों की जरूरतों के प्रति सतर्क और उत्तरदायी रहें।',
      },
    },
    advice: {
      en: "Schedule health checkups for your children and stay in close communication with their teachers or caregivers. Saturn's transit here is temporary — steady attentiveness now prevents larger problems later.",
      hi: 'बच्चों की स्वास्थ्य जाँच कराएँ और शिक्षकों या देखभालकर्ताओं से संपर्क में रहें। शनि का गोचर अस्थायी है — अभी सतर्कता बाद की बड़ी समस्याएँ रोकती है।',
    },
    laypersonNote: {
      en: 'A weakened 5th house combined with Saturn transiting the same area is a classic signal to pay extra attention to children. It does not predict harm — it recommends vigilance.',
      hi: 'कमजोर पंचम भाव और शनि का उसी क्षेत्र में गोचर बच्चों पर अतिरिक्त ध्यान देने का संकेत है। यह नुकसान की भविष्यवाणी नहीं — सतर्कता की सिफारिश है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'mother-health',
    theme: 'family',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 4 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 4 },
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 4 },
    ],
    text: {
      full: {
        en: "Multiple signals stress your 4th house — the house of the mother. The lord is afflicted, Saturn transits this area, and a malefic occupies it natally. Mother's health may face challenges, or your relationship with her may become strained. If she has existing conditions, extra vigilance is warranted. Your own emotional wellbeing is also connected to this house.",
        hi: 'कई संकेत चतुर्थ भाव — माता के भाव — को तनावग्रस्त करते हैं। स्वामी पीड़ित, शनि गोचर, जन्म से पापी ग्रह। माता के स्वास्थ्य में चुनौती या संबंध तनावपूर्ण। अतिरिक्त सतर्कता उचित।',
      },
      mild: {
        en: 'The 4th house of home and mother is under some pressure. Tensions at home or concerns for your mother may surface. This is a period to offer more patience and care in domestic relationships.',
        hi: 'गृह और माता का चतुर्थ भाव कुछ दबाव में। घर में तनाव या माता के बारे में चिंता सतह पर आ सकती है। घरेलू संबंधों में अधिक धैर्य और देखभाल का समय।',
      },
    },
    advice: {
      en: "Spend more time with your mother if possible, and arrange medical checkups if she has ongoing health concerns. Resolving old emotional patterns between you now can bring lasting healing to the relationship.",
      hi: 'यदि संभव हो तो माता के साथ अधिक समय बिताएँ और यदि उन्हें स्वास्थ्य समस्याएँ हैं तो चिकित्सा जाँच कराएँ। पुराने भावनात्मक पैटर्न सुलझाना स्थायी उपचार ला सकता है।',
    },
    laypersonNote: {
      en: 'In Vedic astrology, the 4th house governs both the mother and your inner emotional security. Pressure here often shows up simultaneously as family tension and a sense of inner unease.',
      hi: 'वैदिक ज्योतिष में चतुर्थ भाव माता और आंतरिक भावनात्मक सुरक्षा दोनों को नियंत्रित करता है। यहाँ दबाव अक्सर पारिवारिक तनाव और आंतरिक बेचैनी दोनों के रूप में दिखाई देता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'father-health',
    theme: 'family',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 9 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 9 },
    ],
    text: {
      full: {
        en: "Your 9th house — representing the father — is under stress. The lord is weakened and Saturn's transit adds heaviness. Father's health or your relationship with paternal figures may face challenges. If your father has chronic conditions, this period warrants extra attention and possibly medical checkups.",
        hi: 'नवम भाव — पिता का प्रतिनिधि — तनाव में। स्वामी कमजोर और शनि गोचर भारीपन जोड़ता है। पिता के स्वास्थ्य या पितृ संबंध में चुनौती। अतिरिक्त ध्यान और चिकित्सा जाँच उचित।',
      },
      mild: {
        en: "Saturn's movement through your 9th house brings a sobering quality to matters of father and paternal lineage. This is a time to show up for your father with practical support rather than waiting for a crisis.",
        hi: 'शनि का नवम भाव से गोचर पितृ विषयों में गंभीरता लाता है। संकट की प्रतीक्षा करने के बजाय व्यावहारिक समर्थन से पिता के लिए उपस्थित होने का समय।',
      },
    },
    advice: {
      en: 'Reach out to your father proactively. If he is elderly or has health concerns, coordinate with family members for consistent care. Mending any distance in the relationship is favored now.',
      hi: 'पिता से सक्रिय रूप से संपर्क करें। यदि वे वृद्ध हैं या स्वास्थ्य संबंधी चिंताएँ हैं तो परिवार के सदस्यों के साथ नियमित देखभाल का समन्वय करें।',
    },
    laypersonNote: {
      en: 'The 9th house represents both the biological father and the concept of higher guidance and blessing. Saturn transiting here while the lord is weak often coincides with a period of greater responsibility toward the paternal line.',
      hi: 'नवम भाव जैविक पिता और उच्च मार्गदर्शन दोनों का प्रतिनिधित्व करता है। स्वामी के कमजोर होने पर शनि का यहाँ गोचर अक्सर पितृ पंक्ति के प्रति अधिक जिम्मेदारी के साथ मेल खाता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'property-dispute',
    theme: 'family',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 4 },
      { type: 'natal', check: 'planet-in-house', planet: 2, house: 4 },
      { type: 'dasha', check: 'lord-is-planet', planet: 7 },
    ],
    text: {
      full: {
        en: 'Property dispute signals converge. Mars in your 4th house brings conflict over land, home, and real estate, the 4th lord is weakened, and Rahu\'s dasha intensifies legal complications around property. Title disputes, boundary conflicts, family inheritance fights, and construction delays are all in the danger zone. Legal counsel and documentation are essential.',
        hi: 'संपत्ति विवाद संकेत। चतुर्थ भाव में मंगल भूमि और अचल संपत्ति पर संघर्ष, चतुर्थेश कमजोर, राहु दशा कानूनी जटिलता। शीर्षक विवाद, सीमा संघर्ष, पारिवारिक विरासत लड़ाई। कानूनी परामर्श और दस्तावेज़ीकरण आवश्यक।',
      },
      mild: {
        en: 'Tensions around home, land, or property are elevated. Mars in your 4th house and a weakened house lord suggest friction in domestic matters. Avoid impulsive decisions about real estate during this period.',
        hi: 'घर, भूमि या संपत्ति के आसपास तनाव ऊंचा। चतुर्थ भाव में मंगल और कमजोर भाव स्वामी घरेलू मामलों में घर्षण। इस अवधि में अचल संपत्ति के बारे में आवेगपूर्ण निर्णयों से बचें।',
      },
    },
    advice: {
      en: 'Retain a property lawyer, ensure all documents are in order, and avoid verbal agreements on real estate matters. Family negotiations around inheritance or property should be conducted in writing with witnesses present.',
      hi: 'संपत्ति वकील रखें, सभी दस्तावेज़ सही हों, अचल संपत्ति पर मौखिक समझौते से बचें। विरासत या संपत्ति पर पारिवारिक वार्ता लिखित में और गवाहों की उपस्थिति में करें।',
    },
    laypersonNote: {
      en: "Mars in the 4th house natally is the classic placement for property disputes in Vedic astrology. When combined with Rahu's dasha — which tends to amplify legal entanglements — the risk of prolonged property conflict rises considerably.",
      hi: 'जन्म कुंडली में चतुर्थ भाव में मंगल संपत्ति विवाद के लिए शास्त्रीय स्थान है। राहु दशा के साथ — जो कानूनी उलझनों को बढ़ाती है — लंबे संपत्ति संघर्ष का जोखिम काफी बढ़ जाता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.DashaSynthesis,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'family-harmony',
    theme: 'family',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'benefic', house: 4 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 4 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 4 },
    ],
    text: {
      full: {
        en: "A blessing on domestic life. A benefic graces your 4th house natally, Jupiter's transit expands domestic happiness, and your dasha activates home themes. Family gatherings feel warm, home renovations go smoothly, and emotional security deepens. This is an excellent period for hosting, celebrating, and strengthening family bonds.",
        hi: 'घरेलू जीवन पर आशीर्वाद। शुभ ग्रह चतुर्थ भाव में, बृहस्पति गोचर घरेलू सुख विस्तारित, दशा गृह विषय सक्रिय। पारिवारिक सभाएँ सुखद, गृह नवीनीकरण सुचारू, भावनात्मक सुरक्षा गहरी।',
      },
      mild: {
        en: "Home and family matters are receiving gentle uplift. Jupiter's presence in the 4th area from your Moon brings a sense of warmth and expansion to domestic life. Small gestures toward family closeness carry amplified meaning now.",
        hi: 'घर और परिवार के मामलों को हल्की उन्नति मिल रही है। चंद्र से चतुर्थ भाव में बृहस्पति घरेलू जीवन में गर्मजोशी और विस्तार लाता है।',
      },
    },
    advice: {
      en: 'Organize a family gathering, invest in home improvements, and initiate conversations to heal old family wounds. The energy supports reconciliation and domestic stability — make full use of this window.',
      hi: 'पारिवारिक सभा आयोजित करें, घर सुधार में निवेश करें, पुरानी पारिवारिक पीड़ाएँ ठीक करने की बातचीत शुरू करें। ऊर्जा मेल-मिलाप और घरेलू स्थिरता का समर्थन करती है।',
    },
    laypersonNote: {
      en: 'When a naturally positive planet sits in your home house, Jupiter amplifies that warmth through transit, and your life period also emphasizes home — domestic life tends to feel like a genuine sanctuary.',
      hi: 'जब स्वाभाविक रूप से सकारात्मक ग्रह आपके गृह भाव में हो, बृहस्पति गोचर से उस गर्मजोशी को बढ़ाए, और जीवन काल भी घर पर जोर दे — तो घरेलू जीवन वास्तविक आश्रय जैसा लगता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },

  {
    id: 'ancestral-karma',
    theme: 'family',
    significance: 3,
    conditions: [
      { type: 'natal', check: 'dosha-present', doshaId: 'pitri' },
      { type: 'dasha', check: 'lord-is-planet', planet: 8 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 9 },
    ],
    text: {
      full: {
        en: "Ancestral karma is surfacing for resolution. Pitri Dosha is present in your chart, Ketu's dasha stirs past-life and ancestral energies, and Saturn's transit through the 9th house (father, lineage) brings these patterns to the surface. Family patterns that have repeated for generations are asking to be broken. Shraddha ceremonies, ancestor prayers, and lineage healing work are especially powerful now.",
        hi: 'पैतृक कर्म समाधान के लिए सतह पर। पितृ दोष विद्यमान, केतु दशा पूर्वजन्म और पैतृक ऊर्जा जगाती है, शनि गोचर नवम भाव में। पीढ़ियों से दोहराए जा रहे पारिवारिक पैटर्न टूटने की माँग कर रहे हैं। श्राद्ध, पितृ प्रार्थना विशेष रूप से शक्तिशाली।',
      },
      mild: {
        en: "Ancestral themes are gently but persistently rising to the surface. Old family patterns, inherited beliefs, or unresolved grief from previous generations may feel present. This is an invitation to acknowledge the lineage you carry.",
        hi: 'पैतृक विषय धीरे लेकिन लगातार सतह पर उठ रहे हैं। पुराने पारिवारिक पैटर्न, विरासत में मिली मान्यताएँ या पीढ़ियों की अनसुलझी दुख महसूस हो सकती है।',
      },
    },
    advice: {
      en: 'Perform Shraddha or Tarpan rituals if they are part of your tradition, or simply light a lamp and offer silent remembrance to your ancestors. Seek stories from elders about your family history — understanding the lineage is itself a form of healing.',
      hi: 'यदि परंपरा का हिस्सा हो तो श्राद्ध या तर्पण करें, या बस दीप जलाएँ और पूर्वजों को मौन स्मरण अर्पित करें। परिवार के बड़ों से वंश की कहानियाँ जानें।',
    },
    laypersonNote: {
      en: "Ketu's dasha combined with Pitri Dosha is a recognized signal in Vedic astrology that ancestral debts or unresolved family karma are ready to be addressed. It is an opportunity, not a curse.",
      hi: 'पितृ दोष के साथ केतु दशा वैदिक ज्योतिष में मान्यता प्राप्त संकेत है कि पैतृक ऋण या अनसुलझे पारिवारिक कर्म संबोधित होने के लिए तैयार हैं। यह अवसर है, अभिशाप नहीं।',
    },
    relatedSections: [
      TippanniSection.Doshas,
      TippanniSection.DashaSynthesis,
      TippanniSection.YearPredictions,
    ],
  },

  {
    id: 'sibling-dynamics',
    theme: 'family',
    significance: 2,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 3 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 2, house: 3 },
    ],
    text: {
      full: {
        en: "Your 3rd house (siblings, courage) is stressed, and Mars' transit activates fraternal dynamics. Conflicts with brothers or sisters may surface. Younger siblings may face challenges that affect you. On the positive side, this energy also brings bursts of courage and initiative — if you can channel the Mars energy into action rather than argument.",
        hi: 'तृतीय भाव (भाई-बहन, साहस) तनावग्रस्त और मंगल गोचर भ्रातृ गतिशीलता सक्रिय। भाई-बहनों से संघर्ष सतह पर आ सकता है। सकारात्मक पक्ष — साहस और पहल की ऊर्जा। मंगल ऊर्जा को बहस नहीं, कार्य में लगाएँ।',
      },
      mild: {
        en: "Mars moving through your 3rd house area stirs up sibling energy — some friction is possible, but so is a surge of personal drive. The key is to use this assertive energy constructively rather than letting it spill into family friction.",
        hi: 'मंगल तृतीय भाव से गोचर भ्रातृ ऊर्जा जगाता है — कुछ घर्षण संभव, लेकिन व्यक्तिगत उत्साह भी। मुख्य बात यह ऊर्जा रचनात्मक रूप से उपयोग करना है।',
      },
    },
    advice: {
      en: "If sibling tensions arise, address them calmly and directly rather than letting resentments accumulate. Meanwhile, use the Martian surge of this period to push forward on personal projects that require boldness and initiative.",
      hi: 'यदि भाई-बहन में तनाव उठे तो शांति से सीधे संबोधित करें, नाराजगी जमा न होने दें। साथ ही इस मंगल उत्साह का उपयोग साहस और पहल की आवश्यकता वाली परियोजनाओं में करें।',
    },
    laypersonNote: {
      en: "Mars transiting the 3rd house is a two-edged influence in Vedic astrology: it can sharpen sibling conflicts but also dramatically boost courage and willpower. The outcome depends on how consciously you direct the energy.",
      hi: 'वैदिक ज्योतिष में तृतीय भाव में मंगल का गोचर दोधारी प्रभाव है: भाई-बहन के संघर्ष तेज कर सकता है लेकिन साहस और इच्छाशक्ति भी बढ़ाता है।',
    },
    relatedSections: [
      TippanniSection.PlanetInsights,
      TippanniSection.LifeAreas,
    ],
  },
];

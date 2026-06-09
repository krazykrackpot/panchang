/**
 * Detailed yoga data for individual yoga pages (/learn/yoga/[slug]).
 * Each entry powers a rich, SEO-optimised page with description,
 * effects, remedies, classical references, and related yogas.
 */

// Inherits the `[key: string]: string | undefined` index signature
// from the global LocaleText so `tl()` (which requires that signature)
// accepts these objects without casts. Local fields tighten `hi` to
// required (the canonical yoga store always ships hi) and add optional
// overlay-language fields for option A — mai shipped in the first wave,
// the other 6 regional locales added in the expansion wave.
import type { LocaleText as GlobalLocaleText } from '@/types/panchang';
interface LocaleText extends GlobalLocaleText {
  hi: string;
  sa?: string;
  // Option A overlays — injected at runtime by yoga-details-with-overlay.ts
  // from per-locale yoga-{loc}-overlay.json files. Per spec
  // 2026-06-04-noindex-thin-translation-locales.md §3, presence of a locale
  // key means that slug + locale has authoritative translated content; absence
  // means fall back to .en via tl().
  mai?: string;
  ta?: string;
  te?: string;
  bn?: string;
  gu?: string;
  kn?: string;
  mr?: string;
}

interface YogaEffect {
  area: LocaleText;
  description: LocaleText;
}

interface YogaRemedies {
  gemstone?: LocaleText;
  mantra?: string;
  charity?: LocaleText;
}

interface ClassicalRef {
  verse: string;
  source: string;
}

/**
 * A planet placement used for chart visualisation on yoga detail pages.
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Houses are 1-based (1=Lagna/Ascendant through 12).
 * fromLagna: true = house counted from Lagna; false = house counted from Moon.
 */
export interface YogaChartPosition {
  planetId: number;
  house: number;       // 1-12
  fromLagna: boolean;
}

export interface YogaDetailEntry {
  name: LocaleText & { sa: string };
  category: string;
  isAuspicious: boolean;
  frequency: number; // expected % of charts
  formationRule: LocaleText;
  // Option A overlays inject per-locale arrays at runtime via the
  // yoga-{loc}-overlay.json files. mai shipped in PR #412; the other 6
  // arrive in the expansion wave.
  detailedDescription: {
    en: string[];
    hi: string[];
    mai?: string[];
    ta?: string[];
    te?: string[];
    bn?: string[];
    gu?: string[];
    kn?: string[];
    mr?: string[];
  };
  effects: YogaEffect[];
  cancellations?: LocaleText[];
  remedies?: YogaRemedies;
  classicalReference?: ClassicalRef;
  relatedYogas?: string[];
  /** Planet positions for birth chart visualisation — one example formation */
  chartPositions?: YogaChartPosition[];
  // ─── Expansion fields (PR 2026-06-09 thin-content rescue) ──────────────
  // Each adds 60-180 words of unique narrative content per yoga page,
  // taking thin pages from ~220 → ~550+ words. Source: src/lib/constants/
  // yoga-expansions-{locale}-overlay.json (EN authored, regional locales
  // attached via yoga-details-with-overlay.ts).
  //
  // realWorldManifestation — 2-4 sentences on how the yoga shows up in
  // someone's life when present (career patterns, relationship dynamics,
  // health tendencies, recognisable temperament). Not a list — flowing prose.
  realWorldManifestation?: LocaleText;
  // strengthFactors — 3-5 short bullets on what amplifies or weakens this
  // yoga's expression (planetary dignity, aspectual support, dasha lord
  // position, navamsa confirmation). Each bullet 8-20 words.
  strengthFactors?: LocaleText[];
  // activationTiming — 1-2 sentences on which dasha/antardasha periods
  // typically trigger the yoga's results (e.g. "Activates strongly during
  // Moon mahadasha and Jupiter antardasha for Gajakesari").
  activationTiming?: LocaleText;
  // practicalGuidance — 3-4 actionable lifestyle/spiritual recommendations
  // for someone with this yoga. Each item 10-25 words. Not duplicates of
  // remedies (which are gemstone/mantra/charity); these are behavioural.
  practicalGuidance?: LocaleText[];
}

export const YOGA_DETAIL_DATA: Record<string, YogaDetailEntry> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // DOSHAS (Afflictions)
  // ═══════════════════════════════════════════════════════════════════════════

  mangala_dosha: {
    name: { en: 'Mangala Dosha (Manglik)', hi: 'मंगल दोष (मांगलिक)', sa: 'मङ्गलदोषः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 30,
    formationRule: {
      en: 'Mars in the 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus',
      hi: 'लग्न, चन्द्र, या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में मंगल',
    },
    detailedDescription: {
      en: [
        'Mangala Dosha, commonly known as Manglik Dosha, is one of the most widely discussed afflictions in Vedic astrology, particularly in the context of marriage compatibility. The dosha is named after Mangal (Mars), the fiery planet of energy, aggression, and passion.',
        'The dosha forms when Mars occupies specific houses (1st, 2nd, 4th, 7th, 8th, or 12th) from the Lagna (ascendant), Moon, or Venus. Mars in these positions is believed to create turbulence in marital life due to its aggressive, independent, and dominating energy clashing with the harmony required in partnerships.',
        'Classical texts like Brihat Parashara Hora Shastra discuss this extensively. However, many cancellation conditions exist: Mars in its own sign (Aries/Scorpio), Mars in exaltation (Capricorn), both partners being Manglik, Jupiter aspecting Mars, and more. Most astrologers check from all three reference points (Lagna, Moon, Venus) for a comprehensive assessment.',
        'In modern practice, the severity of Mangala Dosha varies enormously. A Mars in Capricorn (exalted) in the 7th house is technically Manglik but practically strong and beneficial. Approximately 30% of all charts have some form of this dosha, making it extremely common — which means most "Manglik" charts lead perfectly normal married lives.',
      ],
      hi: [
        'मंगल दोष, जिसे मांगलिक दोष भी कहा जाता है, वैदिक ज्योतिष में विवाह अनुकूलता के संदर्भ में सबसे अधिक चर्चित दोषों में से एक है। इस दोष का नाम मंगल ग्रह के नाम पर है — ऊर्जा, आक्रामकता और जुनून का अग्नि ग्रह।',
        'यह दोष तब बनता है जब मंगल लग्न, चन्द्र या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में हो। इन स्थितियों में मंगल की आक्रामक, स्वतंत्र ऊर्जा वैवाहिक जीवन में अशांति पैदा करती है।',
        'बृहत् पाराशर होरा शास्त्र जैसे शास्त्रीय ग्रन्थों में इसकी विस्तृत चर्चा है। हालांकि, अनेक भंग शर्तें हैं: मंगल स्वराशि (मेष/वृश्चिक) में, मंगल उच्च (मकर) में, दोनों साथी मांगलिक, बृहस्पति की दृष्टि आदि।',
        'लगभग 30% कुण्डलियों में मंगल दोष का कोई रूप होता है, जो इसे अत्यंत सामान्य बनाता है। अधिकांश "मांगलिक" कुण्डलियाँ पूर्णतः सामान्य वैवाहिक जीवन जीती हैं।',
      ],
    },
    effects: [
      { area: { en: 'Marriage & Partnerships', hi: 'विवाह और साझेदारी' }, description: { en: 'Delays in marriage, disagreements with spouse, dominance struggles. In severe cases, separation or multiple marriages — but cancellations are common.', hi: 'विवाह में विलंब, जीवनसाथी से असहमति, प्रभुत्व संघर्ष। गंभीर मामलों में अलगाव — लेकिन भंग सामान्य है।' } },
      { area: { en: 'Temperament', hi: 'स्वभाव' }, description: { en: 'Strong willpower, competitive nature, impatience. Can be channelled positively into sports, military, surgery, or entrepreneurship.', hi: 'दृढ़ इच्छाशक्ति, प्रतिस्पर्धी स्वभाव, अधीरता। खेल, सेना, शल्यक्रिया या उद्यमिता में सकारात्मक रूप से।' } },
      { area: { en: 'Health', hi: 'स्वास्थ्य' }, description: { en: 'Mars-related health issues: blood pressure, accidents, inflammation, surgical interventions. Physical fitness is essential.', hi: 'मंगल-सम्बन्धित स्वास्थ्य: रक्तचाप, दुर्घटनाएँ, सूजन, शल्यक्रिया। शारीरिक फिटनेस आवश्यक।' } },
    ],
    cancellations: [
      { en: 'Mars in own sign (Aries or Scorpio)', hi: 'मंगल स्वराशि (मेष या वृश्चिक) में' },
      { en: 'Mars in exaltation (Capricorn)', hi: 'मंगल उच्च (मकर) में' },
      { en: 'Jupiter aspects Mars or the 7th house', hi: 'बृहस्पति की दृष्टि मंगल या 7वें भाव पर' },
      { en: 'Both partners have Mangala Dosha (mutual cancellation)', hi: 'दोनों साथियों में मंगल दोष (पारस्परिक भंग)' },
      { en: 'Mars in the 2nd house in Gemini or Virgo', hi: 'मंगल 2वें भाव में मिथुन या कन्या राशि में' },
    ],
    remedies: {
      gemstone: { en: 'Red Coral (Moonga) for Mars', hi: 'मूँगा (मंगल के लिए)' },
      mantra: 'ॐ अं अंगारकाय नमः',
      charity: { en: 'Donate red lentils, jaggery, or red cloth on Tuesdays', hi: 'मंगलवार को लाल मसूर, गुड़ या लाल कपड़ा दान करें' },
    },
    classicalReference: {
      verse: 'लग्ने व्यये च पाताले जामित्रे चाष्टमे कुजे।\nकन्या भर्तृविनाशाय भर्ता कन्याविनाशकृत्॥',
      source: 'Brihat Parashara Hora Shastra, Chapter 81',
    },
    relatedYogas: ['kala_sarpa', 'pitra_dosha', 'guru_chandal', 'angarak'],
    chartPositions: [
      { planetId: 2, house: 7, fromLagna: true },
    ],
  },

  kala_sarpa: {
    name: { en: 'Kala Sarpa Yoga', hi: 'काल सर्प योग', sa: 'कालसर्पयोगः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 15,
    formationRule: {
      en: 'All seven planets (Sun through Saturn) hemmed between Rahu and Ketu',
      hi: 'सभी सात ग्रह (सूर्य से शनि) राहु और केतु के बीच',
    },
    detailedDescription: {
      en: [
        'Kala Sarpa Yoga is one of the most feared combinations in Vedic astrology, formed when all seven visible planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are hemmed between the shadow planets Rahu and Ketu. The name translates to "Serpent of Time" — evoking the image of a cosmic snake swallowing all planetary energies.',
        'There are 12 types of Kala Sarpa depending on the Rahu-Ketu axis: Ananta, Kulika, Vasuki, Shankhapala, Padma, Mahapadma, Takshaka, Karkotaka, Shankhachuda, Ghataka, Vishadhar, and Sheshanaga. Each type affects different life areas based on which houses Rahu and Ketu occupy.',
        'Classical texts debate whether Kala Sarpa is a true yoga or a modern interpolation. It does not appear in Brihat Parashara Hora Shastra or Phaladeepika. However, its effects are widely observed in practice: karmic intensity, sudden reversals of fortune, obstacles that dissolve suddenly, and a life that feels "fated" rather than freely chosen.',
        'Approximately 15% of charts have Kala Sarpa. Its severity depends on the strength of Rahu/Ketu, their house placement, and whether any planet is conjunct either node. A strong Jupiter aspecting the axis significantly mitigates the dosha. Many successful leaders and spiritual figures have Kala Sarpa — it is not a death sentence but an indicator of a karmically intense life.',
      ],
      hi: [
        'काल सर्प योग वैदिक ज्योतिष के सबसे भयावह संयोगों में से एक है, जो तब बनता है जब सभी सात दृश्य ग्रह राहु और केतु के बीच हों। नाम का अर्थ "समय का सर्प" है — सभी ग्रह ऊर्जाओं को निगलने वाले ब्रह्मांडीय सांप की छवि।',
        'राहु-केतु अक्ष के आधार पर 12 प्रकार हैं: अनन्त, कुलिक, वासुकि, शंखपाल, पद्म, महापद्म, तक्षक, कर्कोटक, शंखचूड, घातक, विषधर, और शेषनाग। प्रत्येक प्रकार राहु-केतु की भाव-स्थिति के आधार पर भिन्न जीवन क्षेत्रों को प्रभावित करता है।',
        'शास्त्रीय ग्रन्थों में काल सर्प एक सच्चा योग है या आधुनिक प्रक्षेप, इस पर बहस है। बृहत् पाराशर होरा शास्त्र या फलदीपिका में यह नहीं है। फिर भी, व्यवहार में इसके प्रभाव व्यापक रूप से देखे गये हैं।',
        'लगभग 15% कुण्डलियों में काल सर्प होता है। इसकी गम्भीरता राहु/केतु की शक्ति, भाव-स्थिति पर निर्भर करती है। अनेक सफल नेताओं और आध्यात्मिक विभूतियों में यह योग है।',
      ],
    },
    effects: [
      { area: { en: 'Karmic Intensity', hi: 'कार्मिक तीव्रता' }, description: { en: 'Life feels fated rather than freely chosen. Sudden reversals, both positive and negative. Past-life karma strongly influences present circumstances.', hi: 'जीवन स्वतन्त्र चुनाव के बजाय नियति जैसा लगता है। अचानक उलटफेर। पूर्वजन्म कर्म वर्तमान को प्रबलता से प्रभावित।' } },
      { area: { en: 'Obstacles & Delays', hi: 'बाधाएँ और विलंब' }, description: { en: 'Repeated obstacles in career, relationships, and health. Progress comes in sudden bursts after long stagnation periods.', hi: 'करियर, सम्बन्धों और स्वास्थ्य में बार-बार बाधाएँ। लम्बी स्थिरता के बाद अचानक प्रगति।' } },
      { area: { en: 'Spiritual Growth', hi: 'आध्यात्मिक विकास' }, description: { en: 'Often accelerates spiritual development through suffering. Many spiritual leaders have this yoga. Deep interest in mysticism, past lives, and metaphysics.', hi: 'कष्ट के माध्यम से आध्यात्मिक विकास को अक्सर तेज करता है। रहस्यवाद और तत्वज्ञान में गहरी रुचि।' } },
    ],
    cancellations: [
      { en: 'Any planet conjunct Rahu or Ketu (breaks the hemming)', hi: 'कोई ग्रह राहु या केतु के साथ युत (बन्धन तोड़ता है)' },
      { en: 'Jupiter aspects Rahu or Ketu', hi: 'बृहस्पति की दृष्टि राहु या केतु पर' },
      { en: 'One planet on the other side of the Rahu-Ketu axis', hi: 'एक ग्रह राहु-केतु अक्ष के दूसरी ओर' },
    ],
    remedies: {
      gemstone: { en: 'Hessonite (Gomed) for Rahu, Cat\'s Eye (Lehsunia) for Ketu', hi: 'गोमेद (राहु के लिए), लहसुनिया (केतु के लिए)' },
      mantra: 'ॐ नमः शिवाय (108 times daily)',
      charity: { en: 'Feed snakes (Nag Panchami), donate blankets to the homeless on Saturdays', hi: 'नागपंचमी पर नागों को दूध, शनिवार को बेघरों को कम्बल दान' },
    },
    classicalReference: {
      verse: 'राहुकेत्वन्तरे यस्य सर्वे स्युः सप्तभूमिजाः।\nकालसर्पयोग इत्युक्तो जन्मन्यतिकठोरदः॥',
      source: 'Manasagari (medieval Jyotish text)',
    },
    relatedYogas: ['mangala_dosha', 'pitra_dosha', 'grahan', 'guru_chandal'],
    chartPositions: [
      { planetId: 7, house: 1, fromLagna: true },
      { planetId: 8, house: 7, fromLagna: true },
      { planetId: 0, house: 2, fromLagna: true },
      { planetId: 1, house: 3, fromLagna: true },
      { planetId: 2, house: 4, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 6, fromLagna: true },
      { planetId: 6, house: 6, fromLagna: true },
    ],
  },

  pitra_dosha: {
    name: { en: 'Pitra Dosha', hi: 'पितृ दोष', sa: 'पितृदोषः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 20,
    formationRule: {
      en: 'Sun conjunct or aspected by Rahu/Ketu, or Sun in 9th house afflicted',
      hi: 'सूर्य राहु/केतु से युत या दृष्ट, या सूर्य 9वें भाव में पीड़ित',
    },
    detailedDescription: {
      en: [
        'Pitra Dosha indicates karmic debts from ancestors and past lives. It forms primarily when the Sun (father/ancestors) is afflicted by Rahu or Ketu, or when the 9th house (house of father and fortune) is under malefic influence.',
        'The dosha manifests as unexplained obstacles despite talent and effort, difficulty in receiving blessings from elders, strained father-child relationships, and recurring patterns of misfortune in the family lineage. Remedies involve Shraddha rituals and ancestral propitiation.',
      ],
      hi: [
        'पितृ दोष पूर्वजों और पूर्वजन्मों से कार्मिक ऋण दर्शाता है। यह मुख्यतः तब बनता है जब सूर्य (पिता/पूर्वज) राहु या केतु से पीड़ित हो, या 9वां भाव (पिता और भाग्य का भाव) पाप प्रभाव में हो।',
        'यह दोष प्रतिभा और प्रयास के बावजूद अस्पष्ट बाधाएँ, बड़ों से आशीर्वाद प्राप्त करने में कठिनाई, और वंश में दुर्भाग्य के आवर्ती पैटर्न के रूप में प्रकट होता है।',
      ],
    },
    effects: [
      { area: { en: 'Ancestral Karma', hi: 'पैतृक कर्म' }, description: { en: 'Unexplained obstacles, family patterns of misfortune repeating across generations.', hi: 'अस्पष्ट बाधाएँ, पीढ़ियों में दुर्भाग्य के पैटर्न।' } },
      { area: { en: 'Father Relationship', hi: 'पिता सम्बन्ध' }, description: { en: 'Strained relationship with father, early separation, father\'s health issues.', hi: 'पिता से तनावपूर्ण सम्बन्ध, शीघ्र वियोग, पिता का स्वास्थ्य।' } },
      { area: { en: 'Fortune & Luck', hi: 'भाग्य' }, description: { en: 'Delays in fortune despite deserving, luck arriving late but coming eventually.', hi: 'योग्य होने के बावजूद भाग्य में विलंब, देर से पर अंततः आता है।' } },
    ],
    remedies: {
      mantra: 'ॐ पितृभ्यो नमः',
      charity: { en: 'Perform Shraddha rituals on Amavasya. Feed Brahmins. Donate food on father\'s death anniversary.', hi: 'अमावस्या पर श्राद्ध करें। ब्राह्मणों को भोजन कराएँ। पिता की पुण्यतिथि पर अन्नदान।' },
    },
    classicalReference: {
      verse: 'पितृदोषो यदा जन्मनि ग्रहैः प्रबलो भवेत्।\nतर्पणेन च दानेन शमं याति न संशयः॥',
      source: 'Garuda Purana, Preta Khanda',
    },
    relatedYogas: ['kala_sarpa', 'mangala_dosha', 'surya_grahan', 'grahan'],
    chartPositions: [
      { planetId: 0, house: 9, fromLagna: true },
      { planetId: 7, house: 9, fromLagna: true },
      { planetId: 8, house: 3, fromLagna: true },
    ],
  },

  shrapit_dosha: {
    name: { en: 'Shrapit Dosha', hi: 'शापित दोष', sa: 'शापितदोषः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 8,
    formationRule: {
      en: 'Saturn conjunct Rahu in the birth chart',
      hi: 'जन्म कुण्डली में शनि-राहु की युति',
    },
    detailedDescription: {
      en: [
        'Shrapit Dosha forms when Saturn and Rahu are conjunct, believed to indicate a curse from a past life. Saturn represents karma and discipline while Rahu represents obsession and past-life desires. Their conjunction creates intense karmic pressure.',
        'The dosha manifests as chronic delays, fear and anxiety patterns, and feeling perpetually cursed or unlucky. However, after age 36 (Saturn maturity), significant breakthroughs often occur. The intensity depends on the house and sign of the conjunction.',
      ],
      hi: [
        'शापित दोष तब बनता है जब शनि और राहु युत हों, जो पूर्वजन्म के शाप का संकेत माना जाता है। शनि कर्म और अनुशासन, राहु जुनून और पूर्वजन्म की इच्छाओं का प्रतिनिधित्व करता है।',
        'यह दोष दीर्घकालिक विलंब, भय और चिंता के पैटर्न के रूप में प्रकट होता है। हालांकि, 36 वर्ष (शनि परिपक्वता) के बाद महत्वपूर्ण सफलताएँ अक्सर आती हैं।',
      ],
    },
    effects: [
      { area: { en: 'Chronic Delays', hi: 'दीर्घकालिक विलंब' }, description: { en: 'Everything takes longer than expected. Career milestones delayed. Eventual success after persistent effort.', hi: 'सब कुछ अपेक्षा से अधिक समय लेता है। करियर की उपलब्धियाँ विलम्बित।' } },
      { area: { en: 'Mental Health', hi: 'मानसिक स्वास्थ्य' }, description: { en: 'Anxiety, fear of failure, paranoia. Meditation and spiritual practice are essential remedies.', hi: 'चिंता, विफलता का भय। ध्यान और आध्यात्मिक अभ्यास आवश्यक।' } },
    ],
    remedies: {
      gemstone: { en: 'Blue Sapphire (Neelam) for Saturn — only after trial period', hi: 'नीलम (शनि के लिए) — परीक्षण अवधि के बाद ही' },
      mantra: 'ॐ शं शनैश्चराय नमः (108 times on Saturdays)',
      charity: { en: 'Feed crows on Saturdays. Donate black sesame seeds and iron.', hi: 'शनिवार को कौवों को भोजन दें। काले तिल और लोहा दान करें।' },
    },
    relatedYogas: ['shani_rahu', 'kala_sarpa', 'pitra_dosha', 'bandhana'],
    chartPositions: [
      { planetId: 6, house: 5, fromLagna: true },
      { planetId: 7, house: 5, fromLagna: true },
      { planetId: 8, house: 11, fromLagna: true },
    ],
  },

  kalathra_dosha: {
    name: { en: 'Kalathra Dosha', hi: 'कलत्र दोष', sa: 'कलत्रदोषः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 18,
    formationRule: {
      en: 'Malefic planets in the 7th house or 7th lord afflicted',
      hi: 'सप्तम भाव में पाप ग्रह या सप्तमेश पीड़ित',
    },
    detailedDescription: {
      en: [
        'Kalathra Dosha relates to afflictions of the 7th house (house of marriage, partnerships, and spouse). It forms when malefic planets occupy or aspect the 7th house, or when the 7th lord is debilitated, combust, or afflicted.',
        'The effects include delays in marriage, disharmony with spouse, and challenges in maintaining long-term partnerships. The severity varies based on which malefic is involved and the strength of benefic influences.',
      ],
      hi: [
        'कलत्र दोष 7वें भाव (विवाह, साझेदारी और जीवनसाथी) की पीड़ा से सम्बन्धित है। यह तब बनता है जब पाप ग्रह 7वें भाव में हों या उसे देखें, या सप्तमेश नीच, अस्त या पीड़ित हो।',
        'प्रभावों में विवाह में विलंब, जीवनसाथी से अशांति, और दीर्घकालिक साझेदारी बनाए रखने में चुनौतियाँ शामिल हैं।',
      ],
    },
    effects: [
      { area: { en: 'Marriage', hi: 'विवाह' }, description: { en: 'Delayed marriage, multiple proposals failing, disagreements after marriage.', hi: 'विवाह में विलंब, अनेक प्रस्ताव विफल, विवाह के बाद मतभेद।' } },
      { area: { en: 'Business Partnerships', hi: 'व्यापारिक साझेदारी' }, description: { en: 'Partnership disputes, trust issues in business collaborations.', hi: 'साझेदारी विवाद, व्यावसायिक सहयोग में विश्वास के मुद्दे।' } },
    ],
    remedies: {
      mantra: 'ॐ शुक्राय नमः',
      charity: { en: 'Donate white items (rice, sugar, milk) on Fridays', hi: 'शुक्रवार को सफेद वस्तुएँ (चावल, चीनी, दूध) दान करें' },
    },
    relatedYogas: ['mangala_dosha', 'venus_7th', 'shukra_shani'],
    chartPositions: [
      { planetId: 2, house: 7, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
  },

  guru_chandal: {
    name: { en: 'Guru Chandal Yoga', hi: 'गुरु चांडाल योग', sa: 'गुरुचाण्डालयोगः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 12,
    formationRule: {
      en: 'Jupiter conjunct Rahu in the birth chart',
      hi: 'जन्म कुण्डली में बृहस्पति-राहु की युति',
    },
    detailedDescription: {
      en: [
        'Guru Chandal Yoga forms when Jupiter (the divine teacher, guru of the devas) is conjunct Rahu (the outcaste, the shadow). The name literally means "Teacher-Outcaste" — a combination that challenges traditional wisdom and conventional belief systems.',
        'This yoga often produces individuals who reject organised religion but independently discover deep spiritual truths. They may have troubled relationships with mentors, teachers, or father figures. Rahu amplifies Jupiter\'s expansive energy but corrupts its purity, leading to unconventional philosophies, ethical grey areas, or hypocrisy in religious matters.',
        'In Sagittarius or Pisces (Jupiter\'s signs), the yoga is somewhat mitigated. In Cancer (Jupiter exalted), Rahu\'s shadow on Jupiter is reduced. The yoga is strongest (most challenging) in Capricorn (Jupiter debilitated) where both wisdom and ethics are under pressure.',
        'Despite its negative reputation, many brilliant innovators, scientists, and reformers have Guru Chandal — the "pollution" of tradition by Rahu often produces breakthrough thinking that challenges outdated norms.',
      ],
      hi: [
        'गुरु चांडाल योग तब बनता है जब बृहस्पति (देवगुरु) राहु (छायाग्रह) से युत हो। नाम का शाब्दिक अर्थ "गुरु-चांडाल" है — एक संयोग जो पारम्परिक ज्ञान को चुनौती देता है।',
        'यह योग अक्सर ऐसे व्यक्तियों को उत्पन्न करता है जो संगठित धर्म को अस्वीकार करते हैं पर स्वतंत्र रूप से गहन आध्यात्मिक सत्य खोजते हैं। राहु बृहस्पति की विस्तारशील ऊर्जा को बढ़ाता है पर उसकी शुद्धता को दूषित करता है।',
        'अपनी नकारात्मक प्रतिष्ठा के बावजूद, अनेक प्रतिभाशाली नवप्रवर्तकों, वैज्ञानिकों और सुधारकों में गुरु चांडाल है — परम्परा का "प्रदूषण" अक्सर सफल नवाचारी चिन्तन उत्पन्न करता है।',
      ],
    },
    effects: [
      { area: { en: 'Spirituality & Religion', hi: 'आध्यात्मिकता और धर्म' }, description: { en: 'Unorthodox beliefs, challenges with gurus, may reject tradition but find truth independently.', hi: 'अपरंपरागत विश्वास, गुरुओं से चुनौतियाँ, परम्परा अस्वीकार पर स्वतंत्र सत्य।' } },
      { area: { en: 'Education', hi: 'शिक्षा' }, description: { en: 'Disruptions in formal education, unconventional learning paths, self-taught expertise.', hi: 'औपचारिक शिक्षा में व्यवधान, अपरंपरागत सीखने के मार्ग, स्वयं-शिक्षित विशेषज्ञता।' } },
      { area: { en: 'Children', hi: 'सन्तान' }, description: { en: 'Concerns about children, delayed childbirth, or unconventional parenting approaches.', hi: 'सन्तान के बारे में चिन्ता, विलंबित सन्तानोत्पत्ति, अपरंपरागत पालन-पोषण।' } },
    ],
    remedies: {
      gemstone: { en: 'Yellow Sapphire (Pukhraj) to strengthen Jupiter', hi: 'पुखराज (बृहस्पति को बलवान करने के लिए)' },
      mantra: 'ॐ बृं बृहस्पतये नमः (108 times on Thursdays)',
      charity: { en: 'Donate yellow items on Thursdays. Respect teachers and elders.', hi: 'गुरुवार को पीली वस्तुएँ दान करें। गुरुओं और बड़ों का सम्मान करें।' },
    },
    classicalReference: {
      verse: 'गुरुराहुयुतिर्यत्र चाण्डालयोगसंज्ञकम्।\nधर्मे शङ्का गुरौ दोषः विद्यायां विघ्नकारकम्॥',
      source: 'Phaladeepika, Chapter 6',
    },
    relatedYogas: ['kala_sarpa', 'grahan', 'angarak', 'shani_rahu'],
    chartPositions: [
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 7, house: 5, fromLagna: true },
      { planetId: 8, house: 11, fromLagna: true },
    ],
  },

  grahan: {
    name: { en: 'Grahan Dosha', hi: 'ग्रहण दोष', sa: 'ग्रहणदोषः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 18,
    formationRule: {
      en: 'Sun or Moon conjunct Rahu or Ketu',
      hi: 'सूर्य या चन्द्र राहु या केतु से युत',
    },
    detailedDescription: {
      en: [
        'Grahan Dosha (Eclipse Yoga) forms when the luminaries (Sun or Moon) are conjunct the lunar nodes (Rahu or Ketu). This creates an "eclipse" in the birth chart — the life force (Sun) or mind (Moon) is partially shadowed.',
        'The effects depend on which luminary is eclipsed and in which house. Sun-Rahu/Ketu affects ego, authority, and father; Moon-Rahu/Ketu affects emotions, mother, and mental peace. Despite challenges, this yoga can grant research ability, occult knowledge, and penetrating insight.',
      ],
      hi: [
        'ग्रहण दोष तब बनता है जब प्रकाशमान ग्रह (सूर्य या चन्द्र) चन्द्र ग्रन्थियों (राहु या केतु) से युत हों। यह जन्म कुण्डली में "ग्रहण" बनाता है।',
        'प्रभाव इस पर निर्भर करते हैं कि कौन सा प्रकाशमान ग्रह ग्रस्त है और किस भाव में। चुनौतियों के बावजूद, यह योग अनुसंधान क्षमता और गहन अंतर्दृष्टि प्रदान कर सकता है।',
      ],
    },
    effects: [
      { area: { en: 'Authority & Ego', hi: 'अधिकार और अहंकार' }, description: { en: 'Challenges with authority figures, ego confusion, identity crises. Sun-Rahu: father issues. Sun-Ketu: spiritual ego death.', hi: 'अधिकारियों से चुनौतियाँ, अहंकार भ्रम। सूर्य-राहु: पिता समस्याएँ। सूर्य-केतु: आध्यात्मिक अहं मृत्यु।' } },
      { area: { en: 'Emotions & Mind', hi: 'भावनाएँ और मन' }, description: { en: 'Emotional turbulence, anxiety patterns, but also strong intuition. Moon-Rahu: obsessive mind. Moon-Ketu: detached emotions.', hi: 'भावनात्मक अशांति, चिंता, पर तीव्र अंतर्ज्ञान भी। चंद्र-राहु: जुनूनी मन। चंद्र-केतु: विरक्त भावनाएँ।' } },
    ],
    remedies: {
      mantra: 'ॐ राहवे नमः / ॐ केतवे नमः',
      charity: { en: 'Donate on eclipse days. Perform Navagraha Shanti puja.', hi: 'ग्रहण के दिन दान करें। नवग्रह शांति पूजा करें।' },
    },
    relatedYogas: ['surya_grahan', 'chandra_grahan', 'kala_sarpa', 'guru_chandal'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 7, house: 1, fromLagna: true },
      { planetId: 8, house: 7, fromLagna: true },
    ],
  },

  badhaka: {
    name: { en: 'Badhaka Yoga', hi: 'बाधक योग', sa: 'बाधकयोगः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 12,
    formationRule: {
      en: 'Badhaka lord (obstructing planet) placed in the Lagna or aspecting the ascendant',
      hi: 'बाधक स्वामी (अवरोधक ग्रह) लग्न में या लग्न को देख रहा',
    },
    detailedDescription: {
      en: [
        'Badhaka Yoga involves the Badhaka lord — the planet ruling the sign that obstructs the native\'s ascendant. For movable signs, the 11th lord is Badhaka; for fixed signs, the 9th lord; for dual signs, the 7th lord.',
        'When this planet is placed in the Lagna or strongly influences the ascendant, it creates chronic obstructions, unexplained failures, and resistance to progress. Spiritual remedies are considered essential for mitigation.',
      ],
      hi: [
        'बाधक योग में बाधक स्वामी शामिल है — वह ग्रह जो जातक के लग्न को अवरुद्ध करने वाली राशि का स्वामी है। चर राशियों के लिए 11वां स्वामी, स्थिर के लिए 9वां, और द्विस्वभाव के लिए 7वां बाधक है।',
        'जब यह ग्रह लग्न में हो या लग्न को प्रबलता से प्रभावित करे, तो दीर्घकालिक अवरोध, अस्पष्ट विफलताएँ उत्पन्न होती हैं।',
      ],
    },
    effects: [
      { area: { en: 'Life Progress', hi: 'जीवन प्रगति' }, description: { en: 'Chronic obstructions, near-miss opportunities, unexplained failures despite competence.', hi: 'दीर्घकालिक अवरोध, निकट-चूक अवसर, योग्यता के बावजूद अस्पष्ट विफलताएँ।' } },
    ],
    remedies: {
      mantra: 'ॐ नमो भगवते वासुदेवाय',
      charity: { en: 'Worship the deity associated with the badhaka planet. Perform specific archana.', hi: 'बाधक ग्रह से सम्बन्धित देवता की पूजा करें।' },
    },
    relatedYogas: ['kendradhipati_dosha', 'daridra', 'papa_kartari'],
    chartPositions: [
      { planetId: 6, house: 1, fromLagna: true },
    ],
  },

  kendradhipati_dosha: {
    name: { en: 'Kendradhipati Dosha', hi: 'केन्द्राधिपति दोष', sa: 'केन्द्राधिपतिदोषः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 20,
    formationRule: {
      en: 'Natural benefics (Jupiter, Venus, Mercury, Moon) owning kendra houses (1, 4, 7, 10) lose beneficence',
      hi: 'प्राकृतिक शुभ ग्रह (गुरु, शुक्र, बुध, चन्द्र) केन्द्र स्वामी होने पर शुभता खोते हैं',
    },
    detailedDescription: {
      en: [
        'Kendradhipati Dosha is a technical affliction where natural benefic planets lose their beneficence when they rule kendra houses. According to Parashara, kendra lordship turns benefics into functional neutrals, reducing their ability to produce good results.',
        'This is most significant for Jupiter in Gemini/Virgo ascendant (owning 7th/10th or 4th/7th) and Venus in Pisces/Gemini ascendant. The dosha is theoretical and rarely devastating in isolation.',
      ],
      hi: [
        'केन्द्राधिपति दोष एक तकनीकी पीड़ा है जहाँ प्राकृतिक शुभ ग्रह केन्द्र भावों के स्वामी होने पर शुभता खो देते हैं। पाराशर के अनुसार, केन्द्र स्वामित्व शुभ ग्रहों को कार्यात्मक तटस्थ बना देता है।',
        'यह मिथुन/कन्या लग्न में बृहस्पति और मीन/मिथुन लग्न में शुक्र के लिए सबसे महत्वपूर्ण है। यह दोष सैद्धान्तिक है और अकेले में शायद ही विनाशकारी हो।',
      ],
    },
    effects: [
      { area: { en: 'Reduced Beneficence', hi: 'कम शुभता' }, description: { en: 'Benefic planets give neutral rather than positive results. Their dashas may not bring expected gains.', hi: 'शुभ ग्रह सकारात्मक के बजाय तटस्थ परिणाम देते हैं।' } },
    ],
    relatedYogas: ['badhaka', 'daridra', 'raja_yoga'],
    chartPositions: [
      { planetId: 4, house: 7, fromLagna: true },
    ],
  },

  angarak: {
    name: { en: 'Angarak Yoga', hi: 'अंगारक योग', sa: 'अङ्गारकयोगः' },
    category: 'dosha',
    isAuspicious: false,
    frequency: 8,
    formationRule: {
      en: 'Mars conjunct Rahu in the birth chart',
      hi: 'जन्म कुण्डली में मंगल-राहु की युति',
    },
    detailedDescription: {
      en: [
        'Angarak Yoga forms when Mars (fire) and Rahu (amplifier) are conjunct. The name means "burning coal" — Rahu fans Mars\'s flames into an inferno. This is one of the most explosive planetary combinations.',
        'The yoga brings both dangers and extraordinary capabilities. Accident-proneness, litigation, surgical risks, and explosive anger are the negative manifestations. On the positive side, extraordinary courage, technical brilliance, engineering genius, and ability to overcome impossible odds are commonly seen.',
      ],
      hi: [
        'अंगारक योग तब बनता है जब मंगल (अग्नि) और राहु (प्रवर्धक) युत हों। नाम का अर्थ "जलता कोयला" है — राहु मंगल की ज्वालाओं को प्रचण्ड अग्नि में बदल देता है।',
        'यह योग खतरे और असाधारण क्षमताएँ दोनों लाता है। नकारात्मक: दुर्घटना-प्रवणता, मुकदमेबाजी, विस्फोटक क्रोध। सकारात्मक: असाधारण साहस, तकनीकी प्रतिभा।',
      ],
    },
    effects: [
      { area: { en: 'Temperament', hi: 'स्वभाव' }, description: { en: 'Explosive anger, impulsiveness, but also extraordinary courage and decisive action under pressure.', hi: 'विस्फोटक क्रोध, आवेग, पर दबाव में असाधारण साहस और निर्णायक कार्य भी।' } },
      { area: { en: 'Career', hi: 'करियर' }, description: { en: 'Technical brilliance, engineering, surgery, military, fire-fighting. Success in high-risk fields.', hi: 'तकनीकी प्रतिभा, इंजीनियरिंग, शल्यक्रिया, सेना। उच्च-जोखिम क्षेत्रों में सफलता।' } },
    ],
    remedies: {
      gemstone: { en: 'Red Coral (Moonga) after consultation', hi: 'मूँगा (परामर्श के बाद)' },
      mantra: 'ॐ अं अंगारकाय नमः',
      charity: { en: 'Donate red items on Tuesdays. Hanuman Chalisa recitation.', hi: 'मंगलवार को लाल वस्तुएँ दान। हनुमान चालीसा पाठ।' },
    },
    relatedYogas: ['mangala_dosha', 'guru_chandal', 'shani_rahu', 'mars_saturn'],
    chartPositions: [
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 7, house: 3, fromLagna: true },
      { planetId: 8, house: 9, fromLagna: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PANCHA MAHAPURUSHA YOGAS
  // ═══════════════════════════════════════════════════════════════════════════

  hansa: {
    name: { en: 'Hamsa Yoga', hi: 'हंस योग', sa: 'हंसयोगः' },
    category: 'mahapurusha',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: 'Jupiter in own sign (Sagittarius/Pisces) or exalted (Cancer) in a Kendra (1, 4, 7, 10)',
      hi: 'बृहस्पति स्वराशि (धनु/मीन) या उच्च (कर्क) में केन्द्र (1, 4, 7, 10) में',
    },
    detailedDescription: {
      en: [
        'Hamsa Yoga is the most revered of the five Pancha Mahapurusha Yogas, formed by Jupiter in its own or exalted sign in a kendra house. The name "Hamsa" (swan) refers to the mythological bird that can separate milk from water — symbolising the ability to discern truth from falsehood.',
        'Natives with Hamsa Yoga are known for wisdom, righteousness, spiritual authority, and a life devoted to dharma. Jupiter is the greatest benefic, and when dignified in an angular house, it creates one of the most powerful yogas for overall life blessing.',
        'Classical texts describe Hamsa natives as fair-complexioned, honey-voiced, and devoted to spiritual practices. They often become teachers, judges, religious leaders, or advisors to rulers. The yoga is most potent in the 1st house (direct personality influence) and the 10th house (career authority).',
      ],
      hi: [
        'हंस योग पाँच पंच महापुरुष योगों में सबसे प्रतिष्ठित है, जो बृहस्पति के स्वराशि या उच्च राशि में केन्द्र भाव में होने पर बनता है। "हंस" नाम पौराणिक पक्षी को संदर्भित करता है जो दूध से पानी अलग कर सकता है।',
        'हंस योग वाले जातक ज्ञान, धार्मिकता, आध्यात्मिक अधिकार और धर्म को समर्पित जीवन के लिए जाने जाते हैं। बृहस्पति सबसे बड़ा शुभ ग्रह है।',
        'शास्त्रीय ग्रन्थ हंस जातकों को गौर-वर्ण, मधुर-वाणी और आध्यात्मिक अभ्यास में लीन बताते हैं।',
      ],
    },
    effects: [
      { area: { en: 'Wisdom & Learning', hi: 'ज्ञान और विद्या' }, description: { en: 'Exceptional wisdom, love of learning, teaching ability. Natural philosopher and counsellor.', hi: 'असाधारण ज्ञान, विद्या प्रेम, शिक्षण क्षमता।' } },
      { area: { en: 'Spiritual Life', hi: 'आध्यात्मिक जीवन' }, description: { en: 'Deep spiritual inclination, dharmic living, potential for guruhood. Respected in religious circles.', hi: 'गहन आध्यात्मिक प्रवृत्ति, धार्मिक जीवन, गुरुत्व की सम्भावना।' } },
      { area: { en: 'Social Status', hi: 'सामाजिक प्रतिष्ठा' }, description: { en: 'Naturally respected, commands authority through wisdom not force. Advisor to leaders.', hi: 'स्वाभाविक सम्मान, ज्ञान से अधिकार। नेताओं के सलाहकार।' } },
    ],
    remedies: {
      gemstone: { en: 'Yellow Sapphire (Pukhraj) to enhance Jupiter', hi: 'पुखराज (बृहस्पति बलवान करने)' },
      mantra: 'ॐ बृं बृहस्पतये नमः',
      charity: { en: 'Donate yellow items, turmeric, ghee on Thursdays', hi: 'गुरुवार को पीली वस्तुएँ, हल्दी, घी दान' },
    },
    classicalReference: {
      verse: 'केन्द्रे स्वोच्चे च धिष्ण्ये वा यो गुरुः स तु हंसकः।\nधर्मज्ञो विद्यावान् शूरो राजपूज्यश्च जायते॥',
      source: 'BPHS, Chapter 75 (Pancha Mahapurusha)',
    },
    relatedYogas: ['malavya', 'shasha', 'ruchaka', 'bhadra', 'gajakesari'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
    ],
  },

  malavya: {
    name: { en: 'Malavya Yoga', hi: 'मालव्य योग', sa: 'मालव्ययोगः' },
    category: 'mahapurusha',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: 'Venus in own sign (Taurus/Libra) or exalted (Pisces) in a Kendra (1, 4, 7, 10)',
      hi: 'शुक्र स्वराशि (वृषभ/तुला) या उच्च (मीन) में केन्द्र (1, 4, 7, 10) में',
    },
    detailedDescription: {
      en: [
        'Malavya Yoga forms when Venus occupies its own sign or exaltation in a kendra. Venus governs beauty, luxury, art, romance, and refinement. This yoga creates individuals of exceptional charm, artistic talent, and material abundance.',
        'Classical texts describe Malavya natives as possessing beautiful features, strong build, devoted spouse, and abundance of vehicles and comforts. They are naturally drawn to arts, music, fashion, and fine living.',
      ],
      hi: [
        'मालव्य योग तब बनता है जब शुक्र स्वराशि या उच्च राशि में केन्द्र में हो। शुक्र सौन्दर्य, विलासिता, कला, प्रेम और परिष्कार का शासक है।',
        'शास्त्रीय ग्रन्थ मालव्य जातकों को सुन्दर रूप, बलवान शरीर, समर्पित जीवनसाथी और सुख-सुविधाओं की प्रचुरता वाला बताते हैं।',
      ],
    },
    effects: [
      { area: { en: 'Beauty & Charm', hi: 'सौन्दर्य और आकर्षण' }, description: { en: 'Attractive appearance, magnetic personality, refined taste in all things.', hi: 'आकर्षक रूप, चुम्बकीय व्यक्तित्व, सभी चीजों में परिष्कृत रुचि।' } },
      { area: { en: 'Wealth & Luxury', hi: 'धन और विलासिता' }, description: { en: 'Material abundance, fine vehicles, comfortable home, luxury lifestyle.', hi: 'भौतिक प्रचुरता, उत्तम वाहन, आरामदायक घर, विलासितापूर्ण जीवनशैली।' } },
      { area: { en: 'Relationships', hi: 'सम्बन्ध' }, description: { en: 'Happy marriage, devoted spouse, harmonious partnerships. Success in love.', hi: 'सुखी विवाह, समर्पित जीवनसाथी, सामंजस्यपूर्ण साझेदारी।' } },
    ],
    remedies: {
      gemstone: { en: 'Diamond (Heera) or White Sapphire for Venus', hi: 'हीरा या सफेद पुखराज (शुक्र के लिए)' },
      mantra: 'ॐ शुं शुक्राय नमः',
      charity: { en: 'Donate white items, perfume, silk on Fridays', hi: 'शुक्रवार को सफेद वस्तुएँ, इत्र, रेशम दान' },
    },
    classicalReference: {
      verse: 'केन्द्रे स्वोच्चे भृगुः सम्यक् मालव्ययोगकारकः।\nसुखी भोगी कलासक्तो रूपवान् धनवान् भवेत्॥',
      source: 'BPHS, Chapter 75',
    },
    relatedYogas: ['hansa', 'shasha', 'ruchaka', 'bhadra', 'lakshmi'],
    chartPositions: [
      { planetId: 5, house: 7, fromLagna: true },
    ],
  },

  shasha: {
    name: { en: 'Shasha Yoga', hi: 'शश योग', sa: 'शशयोगः' },
    category: 'mahapurusha',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: 'Saturn in own sign (Capricorn/Aquarius) or exalted (Libra) in a Kendra',
      hi: 'शनि स्वराशि (मकर/कुम्भ) या उच्च (तुला) में केन्द्र में',
    },
    detailedDescription: {
      en: [
        'Shasha Yoga forms when Saturn is dignified (own sign or exalted) in a kendra. Saturn is the planet of discipline, endurance, and long-term achievement. When well-placed, it grants authority earned through hard work and perseverance.',
        'Classical texts describe Shasha natives as commanding servants and followers, possessing authority over towns or cities, and being skilled in metallurgy and mechanics. Modern equivalents include CEOs, senior government officials, and industrial leaders.',
      ],
      hi: [
        'शश योग तब बनता है जब शनि स्वराशि या उच्च में केन्द्र में हो। शनि अनुशासन, सहनशक्ति और दीर्घकालिक उपलब्धि का ग्रह है।',
        'शास्त्रीय ग्रन्थ शश जातकों को सेवकों और अनुयायियों पर अधिकार, नगरों पर शासन, और यांत्रिकी में कौशल वाला बताते हैं।',
      ],
    },
    effects: [
      { area: { en: 'Authority & Power', hi: 'अधिकार और शक्ति' }, description: { en: 'Rises to positions of authority through discipline and hard work. Respected for integrity.', hi: 'अनुशासन और परिश्रम से अधिकार पद तक। ईमानदारी के लिए सम्मान।' } },
      { area: { en: 'Longevity', hi: 'दीर्घायु' }, description: { en: 'Strong constitution, long life, endurance. Saturn well-placed promotes longevity.', hi: 'मजबूत शरीर, दीर्घ जीवन, सहनशक्ति।' } },
    ],
    remedies: {
      gemstone: { en: 'Blue Sapphire (Neelam) for Saturn', hi: 'नीलम (शनि के लिए)' },
      mantra: 'ॐ शं शनैश्चराय नमः',
      charity: { en: 'Donate iron, black sesame, oil on Saturdays', hi: 'शनिवार को लोहा, काले तिल, तेल दान' },
    },
    classicalReference: {
      verse: 'केन्द्रे स्वोच्चे शनैश्चरः शशयोगप्रदो भवेत्।\nनगराधिपतिः शूरो धनाढ्यो दीर्घजीवनः॥',
      source: 'BPHS, Chapter 75',
    },
    relatedYogas: ['hansa', 'malavya', 'ruchaka', 'bhadra', 'shani_dasham'],
    chartPositions: [
      { planetId: 6, house: 10, fromLagna: true },
    ],
  },

  ruchaka: {
    name: { en: 'Ruchaka Yoga', hi: 'रुचक योग', sa: 'रुचकयोगः' },
    category: 'mahapurusha',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: 'Mars in own sign (Aries/Scorpio) or exalted (Capricorn) in a Kendra',
      hi: 'मंगल स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में केन्द्र में',
    },
    detailedDescription: {
      en: [
        'Ruchaka Yoga forms when Mars is dignified in a kendra. Mars governs courage, energy, and action. When powerful, it creates warriors, leaders, athletes, and commanders. The name means "brilliant" or "lustrous".',
        'Classical texts describe Ruchaka natives as having a reddish complexion, strong physique, commanding voice, and valor in battle. In modern terms, these are the athletes, surgeons, military officers, and entrepreneurs who lead through decisive action.',
      ],
      hi: [
        'रुचक योग तब बनता है जब मंगल स्वराशि या उच्च में केन्द्र में हो। मंगल साहस, ऊर्जा और कर्म का शासक है। शक्तिशाली होने पर यह योद्धा, नेता और सेनानायक बनाता है।',
        'शास्त्रीय ग्रन्थ रुचक जातकों को लालिमा युक्त वर्ण, मजबूत शरीर, प्रभावशाली वाणी और युद्ध में वीरता वाला बताते हैं।',
      ],
    },
    effects: [
      { area: { en: 'Courage & Valour', hi: 'साहस और वीरता' }, description: { en: 'Fearless nature, physical strength, decisive action. Natural leader in crisis situations.', hi: 'निडर स्वभाव, शारीरिक शक्ति, निर्णायक कार्य। संकट में स्वाभाविक नेता।' } },
      { area: { en: 'Career', hi: 'करियर' }, description: { en: 'Military, police, surgery, sports, engineering, real estate. Success in competitive fields.', hi: 'सेना, पुलिस, शल्यक्रिया, खेल, इंजीनियरिंग। प्रतिस्पर्धी क्षेत्रों में सफलता।' } },
    ],
    remedies: {
      gemstone: { en: 'Red Coral (Moonga) for Mars', hi: 'मूँगा (मंगल के लिए)' },
      mantra: 'ॐ अं अंगारकाय नमः',
      charity: { en: 'Donate red lentils on Tuesdays', hi: 'मंगलवार को लाल मसूर दान' },
    },
    classicalReference: {
      verse: 'केन्द्रे स्वोच्चे कुजो यत्र रुचकाख्ययोगकृत्।\nशूरो रणजयी नित्यं भूस्वामी बलवान् भवेत्॥',
      source: 'BPHS, Chapter 75',
    },
    relatedYogas: ['hansa', 'malavya', 'shasha', 'bhadra', 'mangal_dasham'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
    ],
  },

  bhadra: {
    name: { en: 'Bhadra Yoga', hi: 'भद्र योग', sa: 'भद्रयोगः' },
    category: 'mahapurusha',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: 'Mercury in own sign (Gemini/Virgo) or exalted (Virgo) in a Kendra',
      hi: 'बुध स्वराशि (मिथुन/कन्या) या उच्च (कन्या) में केन्द्र में',
    },
    detailedDescription: {
      en: [
        'Bhadra Yoga forms when Mercury is dignified in a kendra. Mercury governs intelligence, communication, commerce, and analytical ability. This yoga creates brilliant communicators, skilled traders, and intellectual luminaries.',
        'Classical texts describe Bhadra natives as having the strength of a lion, attractive features, sharp intellect, and expertise in mathematics and commerce. Modern equivalents: CEOs, writers, scientists, diplomats, and tech entrepreneurs.',
      ],
      hi: [
        'भद्र योग तब बनता है जब बुध स्वराशि या उच्च में केन्द्र में हो। बुध बुद्धि, संवाद, वाणिज्य और विश्लेषणात्मक क्षमता का शासक है।',
        'शास्त्रीय ग्रन्थ भद्र जातकों को सिंह जैसी शक्ति, आकर्षक रूप, तीक्ष्ण बुद्धि और गणित-वाणिज्य में विशेषज्ञता वाला बताते हैं।',
      ],
    },
    effects: [
      { area: { en: 'Intelligence & Communication', hi: 'बुद्धि और संवाद' }, description: { en: 'Exceptional analytical ability, eloquent speech, writing talent. Quick learner.', hi: 'असाधारण विश्लेषणात्मक क्षमता, वाक्पटुता, लेखन प्रतिभा।' } },
      { area: { en: 'Commerce & Trade', hi: 'वाणिज्य और व्यापार' }, description: { en: 'Business acumen, success in trade, financial analysis, and technology.', hi: 'व्यावसायिक कुशाग्रता, व्यापार में सफलता।' } },
    ],
    remedies: {
      gemstone: { en: 'Emerald (Panna) for Mercury', hi: 'पन्ना (बुध के लिए)' },
      mantra: 'ॐ बुं बुधाय नमः',
      charity: { en: 'Donate green items, moong dal on Wednesdays', hi: 'बुधवार को हरी वस्तुएँ, मूँग दाल दान' },
    },
    classicalReference: {
      verse: 'केन्द्रे स्वोच्चे बुधो यत्र भद्रयोगप्रदो भवेत्।\nसिंहतुल्यबलो विद्वान् वाणिज्यकुशलो नरः॥',
      source: 'BPHS, Chapter 75',
    },
    relatedYogas: ['hansa', 'malavya', 'shasha', 'ruchaka', 'budhaditya'],
    chartPositions: [
      { planetId: 3, house: 1, fromLagna: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOON-BASED YOGAS
  // ═══════════════════════════════════════════════════════════════════════════

  gajakesari: {
    name: { en: 'Gajakesari Yoga', hi: 'गजकेसरी योग', sa: 'गजकेसरीयोगः' },
    category: 'moon_based',
    isAuspicious: true,
    frequency: 25,
    formationRule: {
      en: 'Jupiter in a Kendra (1st, 4th, 7th, or 10th house) from Moon',
      hi: 'चन्द्रमा से केन्द्र (1, 4, 7 या 10वें भाव) में बृहस्पति',
    },
    detailedDescription: {
      en: [
        'Gajakesari is one of the most celebrated yogas in Vedic astrology. The name combines "Gaja" (elephant) and "Kesari" (lion) — two of the most powerful animals in Indian symbolism. Just as the elephant commands respect through wisdom and the lion through courage, this yoga bestows both intellectual depth and natural authority.',
        'The yoga forms when Jupiter, the great benefic and guru of the gods, occupies a Kendra (angular house) from the Moon, the mind and emotions. This alignment creates a bridge between wisdom (Jupiter) and emotional intelligence (Moon), producing individuals who are both learned and emotionally mature.',
        'Classical texts like Brihat Parashara Hora Shastra and Phaladeepika describe Gajakesari natives as eloquent speakers, respected leaders, and individuals who leave a lasting legacy. The yoga is especially powerful when Jupiter is strong — in own sign (Sagittarius/Pisces), exalted (Cancer), or unafflicted by malefics.',
        'Approximately 25% of charts have some form of Gajakesari, making it relatively common. However, its strength varies enormously — a Jupiter in exaltation in the 1st from Moon is dramatically different from a combust Jupiter in the 7th. The yoga\'s effects are most pronounced during Jupiter and Moon dashas.',
      ],
      hi: [
        'गजकेसरी वैदिक ज्योतिष के सबसे प्रसिद्ध योगों में से एक है। इसका नाम "गज" (हाथी) और "केसरी" (सिंह) से बना है — भारतीय प्रतीकवाद के दो सबसे शक्तिशाली प्राणी। जैसे हाथी बुद्धि से और सिंह साहस से सम्मान प्राप्त करता है, यह योग दोनों गुण प्रदान करता है।',
        'यह योग तब बनता है जब बृहस्पति, देवगुरु और महान शुभ ग्रह, चन्द्रमा से केन्द्र भाव (1, 4, 7 या 10) में स्थित होता है। यह ज्ञान (बृहस्पति) और भावनात्मक बुद्धि (चन्द्रमा) के बीच एक सेतु बनाता है।',
        'बृहत् पाराशर होरा शास्त्र और फलदीपिका जैसे शास्त्रीय ग्रन्थ गजकेसरी वालों को वाक्पटु, सम्मानित नेता और स्थायी विरासत छोड़ने वाले व्यक्ति बताते हैं। योग विशेष रूप से शक्तिशाली होता है जब बृहस्पति स्वराशि, उच्च या अनाक्रान्त हो।',
        'लगभग 25% कुण्डलियों में गजकेसरी का कोई न कोई रूप होता है। लेकिन इसकी शक्ति में भारी अन्तर होता है — चन्द्रमा से प्रथम भाव में उच्च का बृहस्पति और सप्तम में अस्त बृहस्पति में बहुत फर्क है।',
      ],
    },
    effects: [
      { area: { en: 'Intelligence & Wisdom', hi: 'बुद्धि और ज्ञान' }, description: { en: 'Sharp intellect combined with practical wisdom. Natural ability to learn and retain knowledge. Often seen in scholars, teachers, and counsellors.', hi: 'व्यावहारिक ज्ञान के साथ तीक्ष्ण बुद्धि। सीखने और ज्ञान धारण करने की प्राकृतिक क्षमता।' } },
      { area: { en: 'Social Status & Respect', hi: 'सामाजिक प्रतिष्ठा' }, description: { en: 'Commands natural respect in social circles. Often rises to leadership positions without aggressive ambition. Respected for fairness and integrity.', hi: 'सामाजिक वृत्त में स्वाभाविक सम्मान। निष्पक्षता और ईमानदारी के लिए आदर।' } },
      { area: { en: 'Wealth & Prosperity', hi: 'धन और समृद्धि' }, description: { en: 'Wealth comes through knowledge-based professions — teaching, law, medicine, advisory roles. Not sudden windfalls but steady, earned prosperity.', hi: 'ज्ञान-आधारित व्यवसायों से धन — शिक्षण, विधि, चिकित्सा। अचानक नहीं बल्कि स्थिर, अर्जित समृद्धि।' } },
      { area: { en: 'Speech & Communication', hi: 'वाणी और संवाद' }, description: { en: 'Eloquent and persuasive speech. Ability to explain complex ideas simply. Often sought for advice and counsel.', hi: 'वाक्पटु और प्रभावशाली वाणी। जटिल विचारों को सरलता से समझाने की क्षमता।' } },
    ],
    cancellations: [
      { en: 'Jupiter is combust (within 11 degrees of the Sun)', hi: 'बृहस्पति अस्त है (सूर्य से 11 अंश के भीतर)' },
      { en: 'Jupiter is debilitated in Capricorn without cancellation', hi: 'बृहस्पति मकर में नीच है बिना नीचभंग के' },
      { en: 'Jupiter is in an enemy sign and aspected by malefics', hi: 'बृहस्पति शत्रु राशि में और पापग्रहों की दृष्टि में' },
      { en: 'Moon is waning (Krishna Paksha near Amavasya) and weak', hi: 'चन्द्रमा क्षीण (अमावस्या के निकट कृष्ण पक्ष) और दुर्बल है' },
    ],
    remedies: {
      gemstone: { en: 'Yellow Sapphire (Pukhraj) for Jupiter', hi: 'पुखराज (बृहस्पति के लिए)' },
      mantra: 'ॐ बृं बृहस्पतये नमः',
      charity: { en: 'Donate yellow items (turmeric, gold, bananas) on Thursdays', hi: 'गुरुवार को पीली वस्तुएँ (हल्दी, सोना, केला) दान करें' },
    },
    classicalReference: {
      verse: 'केन्द्रे देवगुरौ लग्नाच्चन्द्राद्वा शुभदृग्युते।\nगजकेसरीति प्रोक्तो योगोऽयं शुभदो नृणाम्॥',
      source: 'Phaladeepika, Chapter 6, Verse 1',
    },
    relatedYogas: ['chandra_mangala', 'sunapha', 'anapha', 'durdhara', 'kemadruma'],
    chartPositions: [
      { planetId: 1, house: 1, fromLagna: false },
      { planetId: 4, house: 4, fromLagna: false },
    ],
  },

  sunapha: {
    name: { en: 'Sunapha Yoga', hi: 'सुनफा योग', sa: 'सुनफायोगः' },
    category: 'moon_based',
    isAuspicious: true,
    frequency: 30,
    formationRule: {
      en: 'Any planet (except Sun, Rahu, Ketu) in the 2nd house from Moon',
      hi: 'कोई ग्रह (सूर्य, राहु, केतु को छोड़कर) चन्द्र से 2वें भाव में',
    },
    detailedDescription: {
      en: [
        'Sunapha Yoga forms when any planet other than the Sun occupies the 2nd house from the Moon. This creates support "ahead" of the Moon, symbolising resources, wealth, and self-earned prosperity coming to the native.',
        'The effects depend on which planet forms the yoga. Mars gives courage and property, Mercury gives intelligence and business skill, Jupiter gives wisdom and children, Venus gives beauty and luxury, Saturn gives organisation and authority.',
      ],
      hi: [
        'सुनफा योग तब बनता है जब सूर्य को छोड़कर कोई ग्रह चन्द्र से 2वें भाव में हो। यह चन्द्र के "आगे" समर्थन बनाता है, जो संसाधन, धन और स्वार्जित समृद्धि का प्रतीक है।',
        'प्रभाव इस पर निर्भर करता है कि कौन सा ग्रह योग बनाता है। मंगल: साहस और सम्पत्ति, बुध: बुद्धि और व्यापार, बृहस्पति: ज्ञान, शुक्र: सौन्दर्य, शनि: अधिकार।',
      ],
    },
    effects: [
      { area: { en: 'Self-Earned Wealth', hi: 'स्वार्जित धन' }, description: { en: 'Wealth through one\'s own effort, not inheritance. Self-made success and financial independence.', hi: 'अपने प्रयास से धन, विरासत नहीं। स्वनिर्मित सफलता और वित्तीय स्वतंत्रता।' } },
      { area: { en: 'Intelligence', hi: 'बुद्धि' }, description: { en: 'Good analytical ability, practical intelligence, ability to accumulate resources.', hi: 'अच्छी विश्लेषणात्मक क्षमता, व्यावहारिक बुद्धि।' } },
    ],
    classicalReference: {
      verse: 'चन्द्राद्द्वितीये यदि खेचरो भवेत्\nसुनफा नाम योगोऽयं स्वबलेन धनाप्तिकृत्॥',
      source: 'Phaladeepika, Chapter 6',
    },
    relatedYogas: ['anapha', 'durdhara', 'kemadruma', 'gajakesari'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
    ],
  },

  anapha: {
    name: { en: 'Anapha Yoga', hi: 'अनफा योग', sa: 'अनफायोगः' },
    category: 'moon_based',
    isAuspicious: true,
    frequency: 30,
    formationRule: {
      en: 'Any planet (except Sun, Rahu, Ketu) in the 12th house from Moon',
      hi: 'कोई ग्रह (सूर्य, राहु, केतु को छोड़कर) चन्द्र से 12वें भाव में',
    },
    detailedDescription: {
      en: [
        'Anapha Yoga forms when any planet other than the Sun occupies the 12th house from the Moon. This creates support "behind" the Moon, symbolising past-life merit, intuition, and subconscious strength supporting the native.',
        'Anapha natives often have strong intuition, good health, spiritual inclination, and support from unseen sources. The yoga is considered slightly less powerful than Sunapha for material success, but stronger for spiritual growth.',
      ],
      hi: [
        'अनफा योग तब बनता है जब कोई ग्रह (सूर्य को छोड़कर) चन्द्र से 12वें भाव में हो। यह चन्द्र के "पीछे" समर्थन बनाता है, जो पूर्वजन्म पुण्य और अवचेतन शक्ति का प्रतीक है।',
        'अनफा जातकों में प्रायः तीव्र अंतर्ज्ञान, अच्छा स्वास्थ्य और आध्यात्मिक प्रवृत्ति होती है।',
      ],
    },
    effects: [
      { area: { en: 'Intuition & Health', hi: 'अंतर्ज्ञान और स्वास्थ्य' }, description: { en: 'Strong intuitive sense, good physical health, support from unseen sources. Past-life merit manifesting.', hi: 'तीव्र अंतर्ज्ञान, अच्छा शारीरिक स्वास्थ्य, अदृश्य स्रोतों से सहायता।' } },
    ],
    relatedYogas: ['sunapha', 'durdhara', 'kemadruma', 'gajakesari'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
    ],
  },

  durdhara: {
    name: { en: 'Durdhara Yoga', hi: 'दुर्धरा योग', sa: 'दुर्धरायोगः' },
    category: 'moon_based',
    isAuspicious: true,
    frequency: 15,
    formationRule: {
      en: 'Planets in both 2nd and 12th houses from Moon (Sunapha + Anapha combined)',
      hi: 'चन्द्र से 2वें और 12वें दोनों भावों में ग्रह (सुनफा + अनफा संयुक्त)',
    },
    detailedDescription: {
      en: [
        'Durdhara Yoga is the combination of Sunapha and Anapha — planets flanking the Moon on both sides. This is considered more powerful than either yoga individually, as the Moon receives support from both directions.',
        'The native enjoys both self-earned wealth (Sunapha) and past-life merit (Anapha), creating a powerful foundation for success. Material comfort, generous nature, and charitable disposition are hallmarks.',
      ],
      hi: [
        'दुर्धरा योग सुनफा और अनफा का संयोजन है — चन्द्र के दोनों ओर ग्रह। यह किसी भी एक योग से अधिक शक्तिशाली माना जाता है।',
        'जातक स्वार्जित धन और पूर्वजन्म पुण्य दोनों का लाभ उठाता है, जो सफलता की शक्तिशाली नींव बनाता है।',
      ],
    },
    effects: [
      { area: { en: 'Comprehensive Prosperity', hi: 'समग्र समृद्धि' }, description: { en: 'Wealth from both self-effort and fortune. Generous, charitable, and well-regarded in society.', hi: 'स्व-प्रयास और भाग्य दोनों से धन। उदार, दानशील और समाज में सम्मानित।' } },
    ],
    relatedYogas: ['sunapha', 'anapha', 'kemadruma', 'gajakesari'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 2, house: 5, fromLagna: true },
      { planetId: 5, house: 3, fromLagna: true },
    ],
  },

  kemadruma: {
    name: { en: 'Kemadruma Yoga', hi: 'केमद्रुम योग', sa: 'केमद्रुमयोगः' },
    category: 'moon_based',
    isAuspicious: false,
    frequency: 15,
    formationRule: {
      en: 'No planet (except Sun, Rahu, Ketu) in the 2nd or 12th house from Moon, and Moon not in a kendra',
      hi: 'चन्द्र से 2वें या 12वें में कोई ग्रह नहीं (सूर्य/राहु/केतु को छोड़कर), और चन्द्र केन्द्र में नहीं',
    },
    detailedDescription: {
      en: [
        'Kemadruma Yoga is the absence of both Sunapha and Anapha — the Moon stands alone without planetary support on either side. This is considered one of the most challenging yogas for material prosperity and emotional wellbeing.',
        'The native may experience poverty despite talent, loneliness, emotional instability, and a feeling of being unsupported. However, many cancellation conditions exist, including planets in kendras from Lagna or Moon, strong aspects on Moon, and Moon in its own or exalted sign.',
        'In practice, pure Kemadruma is rare because cancellation conditions are common. The yoga is most problematic when Moon is also weak (waning, in enemy sign, aspected by malefics).',
      ],
      hi: [
        'केमद्रुम योग सुनफा और अनफा दोनों की अनुपस्थिति है — चन्द्र दोनों ओर ग्रह समर्थन के बिना अकेला खड़ा है। यह भौतिक समृद्धि और भावनात्मक कल्याण के लिए सबसे चुनौतीपूर्ण योगों में से एक माना जाता है।',
        'जातक प्रतिभा के बावजूद दरिद्रता, अकेलापन और भावनात्मक अस्थिरता अनुभव कर सकता है। हालांकि, अनेक भंग शर्तें हैं।',
        'व्यवहार में शुद्ध केमद्रुम दुर्लभ है क्योंकि भंग शर्तें सामान्य हैं।',
      ],
    },
    effects: [
      { area: { en: 'Material Hardship', hi: 'भौतिक कठिनाई' }, description: { en: 'Financial struggles, difficulty accumulating wealth, poverty despite effort. Needs strong lagna lord for mitigation.', hi: 'वित्तीय संघर्ष, धन संचय में कठिनाई। शमन के लिए बलवान लग्नेश आवश्यक।' } },
      { area: { en: 'Emotional Isolation', hi: 'भावनात्मक अलगाव' }, description: { en: 'Loneliness, feeling unsupported, emotional instability. Tendency towards depression without proper support.', hi: 'अकेलापन, असमर्थित महसूस करना, भावनात्मक अस्थिरता।' } },
    ],
    cancellations: [
      { en: 'Moon is conjunct any planet', hi: 'चन्द्र किसी ग्रह से युत' },
      { en: 'Planets in kendras from Lagna or Moon', hi: 'लग्न या चन्द्र से केन्द्रों में ग्रह' },
      { en: 'Moon is in own sign (Cancer) or exalted (Taurus)', hi: 'चन्द्र स्वराशि (कर्क) या उच्च (वृषभ) में' },
    ],
    remedies: {
      gemstone: { en: 'Pearl (Moti) for Moon', hi: 'मोती (चन्द्र के लिए)' },
      mantra: 'ॐ चन्द्राय नमः',
      charity: { en: 'Donate white rice, milk, silver on Mondays', hi: 'सोमवार को सफेद चावल, दूध, चाँदी दान' },
    },
    classicalReference: {
      verse: 'चन्द्राद्द्वादशद्वितीययोर्ग्रहाभावे केमद्रुमो भवेत्।\nदरिद्रो दुःखितो नित्यं परान्नभोजी च जायते॥',
      source: 'Phaladeepika, Chapter 6',
    },
    relatedYogas: ['sunapha', 'anapha', 'durdhara', 'gajakesari'],
    chartPositions: [
      { planetId: 1, house: 6, fromLagna: true },
    ],
  },

  chandra_mangala: {
    name: { en: 'Chandra-Mangala Yoga', hi: 'चन्द्र-मंगल योग', sa: 'चन्द्रमङ्गलयोगः' },
    category: 'moon_based',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: 'Moon conjunct Mars or Moon and Mars in mutual 7th aspect',
      hi: 'चन्द्र-मंगल युति या चन्द्र और मंगल की परस्पर सप्तम दृष्टि',
    },
    detailedDescription: {
      en: [
        'Chandra-Mangala Yoga combines the emotional depth of the Moon with the fiery action of Mars. This is a wealth-producing yoga, as the Moon (public, masses) combined with Mars (action, energy) creates individuals who earn through bold, decisive action.',
        'The yoga is particularly powerful for business, real estate, and entrepreneurship. It gives emotional courage — the ability to take risks and act on instinct. However, it can also produce emotional volatility and impulsiveness if not well-managed.',
      ],
      hi: [
        'चन्द्र-मंगल योग चन्द्र की भावनात्मक गहराई को मंगल की अग्नि क्रिया के साथ जोड़ता है। यह धन-उत्पादक योग है, क्योंकि चन्द्र (जनता) और मंगल (कर्म, ऊर्जा) का संयोग साहसिक कार्य से अर्जन करने वाले व्यक्ति बनाता है।',
        'यह योग व्यवसाय, रियल एस्टेट और उद्यमिता के लिए विशेष रूप से शक्तिशाली है। यह भावनात्मक साहस देता है — जोखिम लेने और अंतर्ज्ञान पर कार्य करने की क्षमता।',
      ],
    },
    effects: [
      { area: { en: 'Wealth Through Action', hi: 'कर्म से धन' }, description: { en: 'Earns through bold action, business ventures, real estate, and entrepreneurship.', hi: 'साहसिक कार्य, व्यवसाय, रियल एस्टेट और उद्यमिता से अर्जन।' } },
      { area: { en: 'Emotional Courage', hi: 'भावनात्मक साहस' }, description: { en: 'Ability to take risks, act on instinct, emotionally resilient. Can be volatile if unmanaged.', hi: 'जोखिम लेने की क्षमता, अंतर्ज्ञान पर कार्य। अप्रबंधित हो तो अस्थिर भी।' } },
    ],
    relatedYogas: ['gajakesari', 'sunapha', 'anapha', 'chandra_mangal_dhana'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 2, house: 4, fromLagna: true },
    ],
  },

  shakata: {
    name: { en: 'Shakata Yoga', hi: 'शकट योग', sa: 'शकटयोगः' },
    category: 'moon_based',
    isAuspicious: false,
    frequency: 25,
    formationRule: {
      en: 'Jupiter in the 6th, 8th, or 12th house from Moon',
      hi: 'बृहस्पति चन्द्र से 6, 8 या 12वें भाव में',
    },
    detailedDescription: {
      en: [
        'Shakata Yoga is the opposite of Gajakesari — Jupiter is in the 6th, 8th, or 12th from Moon instead of a kendra. The name means "cart" — the native\'s fortune rises and falls like a cart wheel, with alternating periods of prosperity and adversity.',
        'This yoga is common (~25% of charts) and its effects vary. Jupiter in the 8th from Moon is the most challenging position, while Jupiter in the 6th can actually aid in defeating enemies if Jupiter is strong.',
      ],
      hi: [
        'शकट योग गजकेसरी का विपरीत है — बृहस्पति चन्द्र से 6, 8 या 12वें भाव में है। नाम का अर्थ "गाड़ी" है — जातक का भाग्य गाड़ी के पहिये की तरह उतार-चढ़ाव करता है।',
        'यह योग सामान्य है (~25% कुण्डलियाँ) और इसके प्रभाव भिन्न हैं। चन्द्र से 8वें में बृहस्पति सबसे चुनौतीपूर्ण है।',
      ],
    },
    effects: [
      { area: { en: 'Fluctuating Fortune', hi: 'उतार-चढ़ाव भाग्य' }, description: { en: 'Cycles of prosperity and adversity. Fortune not stable — gains are followed by losses.', hi: 'समृद्धि और विपत्ति के चक्र। भाग्य स्थिर नहीं — लाभ के बाद हानि।' } },
    ],
    relatedYogas: ['gajakesari', 'kemadruma', 'shakata_extended'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUN-BASED YOGAS
  // ═══════════════════════════════════════════════════════════════════════════

  budhaditya: {
    name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य योग', sa: 'बुधादित्ययोगः' },
    category: 'sun_based',
    isAuspicious: true,
    frequency: 33,
    formationRule: {
      en: 'Sun and Mercury conjunct in the same house',
      hi: 'सूर्य और बुध एक ही भाव में युत',
    },
    detailedDescription: {
      en: [
        'Budhaditya Yoga is one of the most common yogas, forming when the Sun and Mercury are conjunct. Since Mercury never strays more than 28 degrees from the Sun, this conjunction occurs in roughly one-third of all charts.',
        'The yoga combines the authority and confidence of the Sun with the intelligence and communication skills of Mercury. When both planets are strong and Mercury is not combust (more than 5 degrees from the Sun), the yoga produces sharp intellect, administrative ability, and fame through knowledge.',
        'However, when Mercury is very close to the Sun (within 5 degrees), combustion weakens Mercury\'s intellectual clarity. The yoga is strongest when Sun and Mercury are in signs where both are comfortable — Leo, Gemini, or Virgo.',
      ],
      hi: [
        'बुधादित्य योग सबसे सामान्य योगों में से एक है, जो सूर्य और बुध के युत होने पर बनता है। चूँकि बुध सूर्य से 28 अंश से अधिक दूर नहीं जाता, यह युति लगभग एक-तिहाई कुण्डलियों में होती है।',
        'योग सूर्य के अधिकार और आत्मविश्वास को बुध की बुद्धि और संवाद कौशल के साथ जोड़ता है। जब दोनों ग्रह बलवान हों और बुध अस्त न हो, तो तीक्ष्ण बुद्धि और प्रशासनिक क्षमता मिलती है।',
        'हालांकि, जब बुध सूर्य के बहुत निकट (5 अंश के भीतर) हो, तो अस्तत्व बुध की बौद्धिक स्पष्टता कमजोर करता है।',
      ],
    },
    effects: [
      { area: { en: 'Intellect & Administration', hi: 'बुद्धि और प्रशासन' }, description: { en: 'Sharp analytical mind, administrative talent, success in government or management roles.', hi: 'तीक्ष्ण विश्लेषणात्मक मन, प्रशासनिक प्रतिभा, सरकार या प्रबंधन में सफलता।' } },
      { area: { en: 'Communication', hi: 'संवाद' }, description: { en: 'Eloquent speaker, writing ability, teaching talent. Fame through intellectual achievements.', hi: 'वाक्पटु वक्ता, लेखन क्षमता, शिक्षण प्रतिभा। बौद्धिक उपलब्धियों से यश।' } },
    ],
    cancellations: [
      { en: 'Mercury combust (within 5 degrees of Sun)', hi: 'बुध अस्त (सूर्य से 5 अंश के भीतर)' },
      { en: 'Both planets in enemy sign', hi: 'दोनों ग्रह शत्रु राशि में' },
    ],
    remedies: {
      gemstone: { en: 'Emerald (Panna) for Mercury', hi: 'पन्ना (बुध के लिए)' },
      mantra: 'ॐ बुं बुधाय नमः',
      charity: { en: 'Donate green vegetables, moong dal on Wednesdays', hi: 'बुधवार को हरी सब्जियाँ, मूँग दाल दान' },
    },
    classicalReference: {
      verse: 'सूर्यबुधयुतिर्यत्र बुधादित्ययोगकृत्।\nमेधावी प्रशासक श्रेष्ठो विद्यया यशमाप्नुयात्॥',
      source: 'Saravali, Chapter 16',
    },
    relatedYogas: ['veshi', 'vasi', 'obhayachari', 'budha_aditya_strong'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 3, house: 1, fromLagna: true },
    ],
  },

  veshi: {
    name: { en: 'Veshi Yoga', hi: 'वेशी योग', sa: 'वेशीयोगः' },
    category: 'sun_based',
    isAuspicious: true,
    frequency: 25,
    formationRule: {
      en: 'Planet (not Moon) in the 2nd house from Sun',
      hi: 'सूर्य से 2वें भाव में ग्रह (चन्द्र नहीं)',
    },
    detailedDescription: {
      en: [
        'Veshi Yoga forms when any planet except the Moon occupies the 2nd house from the Sun. This creates a "front guard" for the Sun, enhancing the native\'s authority, wealth accumulation, and public image.',
        'The effects depend on which planet is in the 2nd from Sun. A benefic creates Shubha Veshi (wealth, fame), while a malefic creates Ashubha Veshi (challenges in authority and finance).',
      ],
      hi: [
        'वेशी योग तब बनता है जब चन्द्र को छोड़कर कोई ग्रह सूर्य से 2वें भाव में हो। यह सूर्य का "अगला रक्षक" बनाता है, जातक के अधिकार, धन संचय और सार्वजनिक छवि को बढ़ाता है।',
        'प्रभाव इस पर निर्भर करता है कि कौन सा ग्रह है। शुभ ग्रह: शुभ वेशी (धन, यश)। पाप ग्रह: अशुभ वेशी (अधिकार और वित्त में चुनौतियाँ)।',
      ],
    },
    effects: [
      { area: { en: 'Authority & Wealth', hi: 'अधिकार और धन' }, description: { en: 'Enhanced authority, wealth accumulation abilities, and positive public image.', hi: 'बढ़ा हुआ अधिकार, धन संचय क्षमता और सकारात्मक सार्वजनिक छवि।' } },
    ],
    relatedYogas: ['vasi', 'obhayachari', 'budhaditya'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 4, house: 6, fromLagna: true },
    ],
  },

  vasi: {
    name: { en: 'Vasi Yoga', hi: 'वासी योग', sa: 'वासीयोगः' },
    category: 'sun_based',
    isAuspicious: true,
    frequency: 25,
    formationRule: {
      en: 'Planet (not Moon) in the 12th house from Sun',
      hi: 'सूर्य से 12वें भाव में ग्रह (चन्द्र नहीं)',
    },
    detailedDescription: {
      en: [
        'Vasi Yoga forms when any planet except the Moon occupies the 12th house from the Sun. This creates a "rear guard" for the Sun, providing past-life support, hidden resources, and spiritual depth to the native.',
      ],
      hi: [
        'वासी योग तब बनता है जब चन्द्र को छोड़कर कोई ग्रह सूर्य से 12वें भाव में हो। यह सूर्य का "पिछला रक्षक" बनाता है, पूर्वजन्म समर्थन और आध्यात्मिक गहराई प्रदान करता है।',
      ],
    },
    effects: [
      { area: { en: 'Hidden Support', hi: 'छिपा समर्थन' }, description: { en: 'Past-life merit supporting present success, charitable nature, spiritual depth.', hi: 'पूर्वजन्म पुण्य वर्तमान सफलता का समर्थन, दानशील स्वभाव, आध्यात्मिक गहराई।' } },
    ],
    relatedYogas: ['veshi', 'obhayachari', 'budhaditya'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 2, house: 4, fromLagna: true },
    ],
  },

  obhayachari: {
    name: { en: 'Ubhayachari Yoga', hi: 'उभयचारी योग', sa: 'उभयचारीयोगः' },
    category: 'sun_based',
    isAuspicious: true,
    frequency: 10,
    formationRule: {
      en: 'Planets in both 2nd and 12th from Sun (Veshi + Vasi combined)',
      hi: 'सूर्य से 2वें और 12वें दोनों में ग्रह (वेशी + वासी संयुक्त)',
    },
    detailedDescription: {
      en: [
        'Ubhayachari Yoga combines Veshi and Vasi — the Sun is flanked by planets on both sides. This is a powerful yoga creating king-like personality, eloquent speech, strong physique, and wealth.',
        'Classical texts describe Ubhayachari natives as extremely handsome, eloquent, wealthy, and strong-bodied. The yoga protects and enhances the Sun\'s significations from all directions.',
      ],
      hi: [
        'उभयचारी योग वेशी और वासी का संयोजन है — सूर्य दोनों ओर ग्रहों से सुरक्षित है। यह राजा जैसा व्यक्तित्व, वाक्पटुता, बलवान शरीर और धन प्रदान करने वाला शक्तिशाली योग है।',
        'शास्त्रीय ग्रन्थ उभयचारी जातकों को अत्यंत सुन्दर, वाक्पटु, धनवान और बलवान बताते हैं।',
      ],
    },
    effects: [
      { area: { en: 'Royal Personality', hi: 'राजसी व्यक्तित्व' }, description: { en: 'King-like bearing, eloquence, physical strength, wealth, and magnetic personality.', hi: 'राजा जैसा आचरण, वाक्पटुता, शारीरिक शक्ति, धन और चुम्बकीय व्यक्तित्व।' } },
    ],
    relatedYogas: ['veshi', 'vasi', 'budhaditya'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 4, house: 6, fromLagna: true },
      { planetId: 2, house: 4, fromLagna: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RAJA YOGAS
  // ═══════════════════════════════════════════════════════════════════════════

  raja_yoga: {
    name: { en: 'Raja Yoga (Generic)', hi: 'राज योग', sa: 'राजयोगः' },
    category: 'raja',
    isAuspicious: true,
    frequency: 20,
    formationRule: {
      en: 'Lord of a kendra (1,4,7,10) and lord of a trikona (1,5,9) are conjunct, in mutual aspect, or exchange signs',
      hi: 'केन्द्र (1,4,7,10) और त्रिकोण (1,5,9) के स्वामी युत, परस्पर दृष्टि, या राशि विनिमय',
    },
    detailedDescription: {
      en: [
        'Raja Yoga is the most important category of yogas in Vedic astrology. It forms when the lords of kendra (angular) houses and trikona (trinal) houses come together through conjunction, mutual aspect, or sign exchange. This combination unites power (kendra) with fortune (trikona).',
        'The strongest Raja Yogas involve the 1st, 5th, and 9th lords (trikona) connecting with the 1st, 4th, 7th, or 10th lords (kendra). The 1st lord participating in both creates the most powerful version.',
        'Not all Raja Yogas are equal. Their strength depends on the dignity of the planets involved, the houses they occupy, and whether they are afflicted by malefics. A Raja Yoga involving two debilitated planets in the 12th house is technically present but practically weak.',
      ],
      hi: [
        'राज योग वैदिक ज्योतिष में योगों की सबसे महत्वपूर्ण श्रेणी है। यह तब बनता है जब केन्द्र और त्रिकोण भावों के स्वामी युति, परस्पर दृष्टि या राशि विनिमय द्वारा एक साथ आते हैं।',
        'सबसे शक्तिशाली राज योग 1, 5, 9वें स्वामियों (त्रिकोण) का 1, 4, 7, 10वें स्वामियों (केन्द्र) से सम्बन्ध है।',
        'सभी राज योग समान नहीं हैं। उनकी शक्ति सम्बन्धित ग्रहों की गरिमा, भाव-स्थिति पर निर्भर करती है।',
      ],
    },
    effects: [
      { area: { en: 'Power & Authority', hi: 'शक्ति और अधिकार' }, description: { en: 'Rise to positions of power, leadership, government authority, social prominence.', hi: 'शक्ति, नेतृत्व, सरकारी अधिकार, सामाजिक प्रमुखता के पदों तक उत्थान।' } },
      { area: { en: 'Wealth & Fortune', hi: 'धन और भाग्य' }, description: { en: 'Combination of power and luck creates opportunities for significant wealth accumulation.', hi: 'शक्ति और भाग्य का संयोग महत्वपूर्ण धन संचय के अवसर बनाता है।' } },
    ],
    classicalReference: {
      verse: 'केन्द्रत्रिकोणाधिपयोर्दशासु राजप्रदो योग इति प्रदिष्टः।',
      source: 'BPHS, Chapter 41',
    },
    relatedYogas: ['dharma_karmadhipati', 'viparita_raja', 'neechabhanga_raja', 'akhanda_samrajya'],
    chartPositions: [
      { planetId: 4, house: 10, fromLagna: true },
      { planetId: 6, house: 10, fromLagna: true },
    ],
  },

  dhana_yoga: {
    name: { en: 'Dhana Yoga', hi: 'धन योग', sa: 'धनयोगः' },
    category: 'wealth',
    isAuspicious: true,
    frequency: 20,
    formationRule: {
      en: 'Lords of 2nd, 5th, 9th, and 11th houses in mutual relationship (conjunction, aspect, or exchange)',
      hi: '2, 5, 9 और 11वें भाव के स्वामी आपसी सम्बन्ध (युति, दृष्टि या विनिमय) में',
    },
    detailedDescription: {
      en: [
        'Dhana Yoga is a wealth-producing combination involving the lords of the money houses (2nd — accumulated wealth, 11th — gains) and fortune houses (5th — past merit, 9th — luck). When these lords connect, they create channels for wealth flow.',
        'The yoga is strongest when the 2nd and 11th lords are both strong and connected to the 5th or 9th lords. Multiple Dhana Yogas in one chart significantly amplify wealth potential.',
      ],
      hi: [
        'धन योग एक धन-उत्पादक संयोग है जिसमें धन भावों (2 — संचित धन, 11 — लाभ) और भाग्य भावों (5 — पूर्वपुण्य, 9 — भाग्य) के स्वामी शामिल हैं।',
        'योग तब सबसे शक्तिशाली होता है जब 2 और 11वें स्वामी दोनों बलवान हों और 5 या 9वें स्वामियों से जुड़े हों।',
      ],
    },
    effects: [
      { area: { en: 'Wealth Accumulation', hi: 'धन संचय' }, description: { en: 'Strong ability to earn, save, and grow wealth. Multiple income sources. Financial security.', hi: 'अर्जन, बचत और धन वृद्धि की प्रबल क्षमता। अनेक आय स्रोत।' } },
    ],
    relatedYogas: ['lakshmi', 'kubera', 'kalanidhi', 'mahalakshmi'],
    chartPositions: [
      { planetId: 5, house: 11, fromLagna: true },
      { planetId: 4, house: 11, fromLagna: true },
      { planetId: 0, house: 9, fromLagna: true },
      { planetId: 6, house: 2, fromLagna: true },
    ],
  },

  viparita_raja: {
    name: { en: 'Viparita Raja Yoga', hi: 'विपरीत राज योग', sa: 'विपरीतराजयोगः' },
    category: 'raja',
    isAuspicious: true,
    frequency: 10,
    formationRule: {
      en: 'Lords of 6th, 8th, or 12th houses placed in other dusthana houses (6th, 8th, 12th) — the negative cancels the negative',
      hi: '6, 8, या 12वें भाव के स्वामी अन्य दुस्थान (6, 8, 12) में — नकारात्मक नकारात्मक को निरस्त करता है',
    },
    detailedDescription: {
      en: [
        'Viparita Raja Yoga is one of the most fascinating yogas — it turns adversity into triumph. When dusthana lords (6th, 8th, 12th) are placed in other dusthanas, the double negative creates a positive. Enemies defeat themselves, losses become gains, and obstacles become stepping stones.',
        'There are three types: Harsha (6th lord in 8th/12th), Sarala (8th lord in 6th/12th), and Vimala (12th lord in 6th/8th). Each transforms a specific type of challenge into an advantage. The yoga often manifests as success through unconventional paths, winning against stronger opponents, or thriving in adverse conditions.',
      ],
      hi: [
        'विपरीत राज योग सबसे रोचक योगों में से एक है — यह विपत्ति को विजय में बदलता है। जब दुस्थान स्वामी अन्य दुस्थानों में हों, तो दोहरा नकारात्मक सकारात्मक बन जाता है।',
        'तीन प्रकार हैं: हर्ष (6 स्वामी 8/12 में), सरल (8 स्वामी 6/12 में), और विमल (12 स्वामी 6/8 में)। प्रत्येक एक विशिष्ट प्रकार की चुनौती को लाभ में बदलता है।',
      ],
    },
    effects: [
      { area: { en: 'Triumph Through Adversity', hi: 'विपत्ति से विजय' }, description: { en: 'Success through unconventional paths. Enemies self-destruct. Obstacles become stepping stones.', hi: 'अपरंपरागत मार्गों से सफलता। शत्रु स्वयं नष्ट होते हैं। बाधाएँ सोपान बनती हैं।' } },
    ],
    relatedYogas: ['raja_yoga', 'neechabhanga_raja', 'harsha_yoga'],
    chartPositions: [
      { planetId: 3, house: 8, fromLagna: true },
      { planetId: 2, house: 12, fromLagna: true },
    ],
  },

  neechabhanga_raja: {
    name: { en: 'Neechabhanga Raja Yoga', hi: 'नीचभंग राज योग', sa: 'नीचभङ्गराजयोगः' },
    category: 'raja',
    isAuspicious: true,
    frequency: 12,
    formationRule: {
      en: 'A debilitated planet has its debilitation cancelled by specific conditions (sign lord in kendra, exaltation lord aspects, etc.)',
      hi: 'एक नीच ग्रह की नीचता विशिष्ट शर्तों (राशि स्वामी केन्द्र में, उच्च स्वामी दृष्टि आदि) द्वारा निरस्त',
    },
    detailedDescription: {
      en: [
        'Neechabhanga Raja Yoga occurs when a debilitated planet\'s weakness is cancelled, transforming it into a source of great strength. The concept is that struggle and initial weakness, when properly supported, produce extraordinary achievement — like a person who overcomes disability to become a champion.',
        'Several conditions cancel debilitation: the lord of the debilitation sign is in a kendra from Lagna or Moon; the lord of the exaltation sign aspects the debilitated planet; the debilitated planet is in a kendra; or the debilitated planet is conjunct an exalted planet.',
      ],
      hi: [
        'नीचभंग राज योग तब होता है जब एक नीच ग्रह की दुर्बलता निरस्त हो जाती है, उसे महान शक्ति के स्रोत में बदल देती है। अवधारणा यह है कि संघर्ष और प्रारम्भिक दुर्बलता, जब उचित समर्थन मिले, तो असाधारण उपलब्धि उत्पन्न करती है।',
        'अनेक शर्तें नीचता भंग करती हैं: नीच राशि स्वामी लग्न या चन्द्र से केन्द्र में; उच्च राशि स्वामी नीच ग्रह को देखे; नीच ग्रह केन्द्र में हो; या नीच ग्रह उच्च ग्रह से युत हो।',
      ],
    },
    effects: [
      { area: { en: 'Extraordinary Rise', hi: 'असाधारण उत्थान' }, description: { en: 'Rise from humble beginnings to great heights. Initial weakness becomes ultimate strength. Rags-to-riches stories.', hi: 'विनम्र शुरुआत से महान ऊँचाइयों तक उत्थान। प्रारम्भिक दुर्बलता अंतिम शक्ति बनती है।' } },
    ],
    relatedYogas: ['raja_yoga', 'viparita_raja', 'dharma_karmadhipati'],
    chartPositions: [
      { planetId: 6, house: 1, fromLagna: true },
      { planetId: 2, house: 4, fromLagna: true },
    ],
  },

  dharma_karmadhipati: {
    name: { en: 'Dharma-Karmadhipati Yoga', hi: 'धर्म-कर्माधिपति योग', sa: 'धर्मकर्माधिपतियोगः' },
    category: 'raja',
    isAuspicious: true,
    frequency: 8,
    formationRule: {
      en: '9th lord (dharma) and 10th lord (karma) conjunct, in mutual aspect, or exchange signs',
      hi: '9वें स्वामी (धर्म) और 10वें स्वामी (कर्म) युत, परस्पर दृष्टि या राशि विनिमय',
    },
    detailedDescription: {
      en: [
        'Dharma-Karmadhipati Yoga is considered the most powerful specific Raja Yoga, uniting the 9th lord (dharma, fortune, father, philosophy) with the 10th lord (karma, career, public action). When fortune meets action, extraordinary achievement follows.',
        'This yoga creates leaders who are both lucky and hardworking, blessed and diligent. Their career aligns with their higher purpose. Success comes through righteous action — they succeed because they deserve to.',
      ],
      hi: [
        'धर्म-कर्माधिपति योग सबसे शक्तिशाली विशिष्ट राज योग माना जाता है, जो 9वें स्वामी (धर्म, भाग्य) को 10वें स्वामी (कर्म, करियर) के साथ जोड़ता है। जब भाग्य कर्म से मिलता है, असाधारण उपलब्धि होती है।',
        'यह योग ऐसे नेता बनाता है जो भाग्यशाली भी हैं और परिश्रमी भी। उनका करियर उनके उच्च उद्देश्य के अनुरूप है।',
      ],
    },
    effects: [
      { area: { en: 'Career Aligned with Purpose', hi: 'उद्देश्य के अनुरूप करियर' }, description: { en: 'Career success through righteous action. Fortune and effort combine for extraordinary achievement.', hi: 'धार्मिक कर्म से करियर सफलता। भाग्य और प्रयास असाधारण उपलब्धि के लिए मिलते हैं।' } },
    ],
    classicalReference: {
      verse: 'धर्मकर्माधिपौ युक्तौ राजयोगप्रदौ परौ।\nयश्च धर्मे रतो नित्यं कर्मणा च महीपतिः॥',
      source: 'BPHS, Chapter 41',
    },
    relatedYogas: ['raja_yoga', 'viparita_raja', 'neechabhanga_raja', 'akhanda_samrajya'],
    chartPositions: [
      { planetId: 4, house: 9, fromLagna: true },
      { planetId: 6, house: 9, fromLagna: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUSPICIOUS / OTHER YOGAS
  // ═══════════════════════════════════════════════════════════════════════════

  saraswati: {
    name: { en: 'Saraswati Yoga', hi: 'सरस्वती योग', sa: 'सरस्वतीयोगः' },
    category: 'other',
    isAuspicious: true,
    frequency: 5,
    formationRule: {
      en: 'Mercury, Jupiter, and Venus in kendra, trikona, or 2nd house, with Jupiter dignified',
      hi: 'बुध, बृहस्पति और शुक्र केन्द्र, त्रिकोण या 2वें भाव में, बृहस्पति सम्मानित',
    },
    detailedDescription: {
      en: [
        'Saraswati Yoga is named after the goddess of learning, music, and arts. It forms when Mercury (intellect), Jupiter (wisdom), and Venus (arts) are placed in strong positions — kendras, trikonas, or the 2nd house — with Jupiter additionally dignified.',
        'This is a rare and powerful yoga for intellectual and artistic achievement. It creates scholars, artists, musicians, writers, and academics who achieve lasting fame through their creative and intellectual contributions.',
      ],
      hi: [
        'सरस्वती योग का नाम विद्या, संगीत और कला की देवी के नाम पर है। यह तब बनता है जब बुध (बुद्धि), बृहस्पति (ज्ञान) और शुक्र (कला) शक्तिशाली स्थानों — केन्द्र, त्रिकोण या 2वें भाव — में हों।',
        'यह बौद्धिक और कलात्मक उपलब्धि के लिए एक दुर्लभ और शक्तिशाली योग है। यह विद्वान, कलाकार, संगीतकार, लेखक और शिक्षाविद् बनाता है।',
      ],
    },
    effects: [
      { area: { en: 'Learning & Scholarship', hi: 'विद्या और विद्वत्ता' }, description: { en: 'Exceptional learning ability, mastery of multiple subjects, scholarly fame.', hi: 'असाधारण सीखने की क्षमता, अनेक विषयों में निपुणता, विद्वत् यश।' } },
      { area: { en: 'Arts & Music', hi: 'कला और संगीत' }, description: { en: 'Musical talent, artistic genius, literary achievement. Blessed by Saraswati.', hi: 'संगीत प्रतिभा, कलात्मक प्रतिभा, साहित्यिक उपलब्धि। सरस्वती की कृपा।' } },
    ],
    remedies: {
      gemstone: { en: 'Emerald (Panna) for Mercury + Yellow Sapphire for Jupiter', hi: 'पन्ना (बुध) + पुखराज (बृहस्पति)' },
      mantra: 'ॐ ऐं सरस्वत्यै नमः',
      charity: { en: 'Donate books, stationery, musical instruments to schools', hi: 'विद्यालयों को पुस्तकें, लेखन सामग्री, वाद्य यंत्र दान' },
    },
    classicalReference: {
      verse: 'बुधगुरुसितगाः केन्द्रत्रिकोणद्वितीयगाः।\nगुरुबलसमेताश्चेत् सरस्वतीयोग उच्यते॥',
      source: 'Phaladeepika, Chapter 6',
    },
    relatedYogas: ['budhaditya', 'hansa', 'bharati', 'kalanidhi'],
    chartPositions: [
      { planetId: 3, house: 1, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 2, fromLagna: true },
    ],
  },

  mahabhagya: {
    name: { en: 'Mahabhagya Yoga', hi: 'महाभाग्य योग', sa: 'महाभाग्ययोगः' },
    category: 'other',
    isAuspicious: true,
    frequency: 3,
    formationRule: {
      en: 'Male: day birth, Sun/Moon/Lagna all in odd signs. Female: night birth, Sun/Moon/Lagna all in even signs.',
      hi: 'पुरुष: दिन का जन्म, सूर्य/चन्द्र/लग्न सब विषम राशियों में। स्त्री: रात का जन्म, सब सम राशियों में।',
    },
    detailedDescription: {
      en: [
        'Mahabhagya Yoga is one of the rarest and most auspicious yogas in Vedic astrology. For males, it requires a daytime birth with the Sun, Moon, and Lagna all in odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius). For females, it requires a night birth with all three in even signs.',
        'The yoga grants great fortune, long life, fame, power, and prosperity. Natives with Mahabhagya are considered blessed by destiny itself. Its rarity (only ~3% of charts) makes it genuinely significant when present.',
      ],
      hi: [
        'महाभाग्य योग वैदिक ज्योतिष के सबसे दुर्लभ और शुभ योगों में से एक है। पुरुषों के लिए, दिन के जन्म के साथ सूर्य, चन्द्र और लग्न सब विषम राशियों में होने चाहिए।',
        'योग महान भाग्य, दीर्घ जीवन, यश, शक्ति और समृद्धि प्रदान करता है। इसकी दुर्लभता (केवल ~3% कुण्डलियाँ) इसे उपस्थित होने पर वास्तव में महत्वपूर्ण बनाती है।',
      ],
    },
    effects: [
      { area: { en: 'Great Fortune', hi: 'महान भाग्य' }, description: { en: 'Blessed by destiny. Long life, fame, wealth, power, and lasting legacy.', hi: 'नियति द्वारा आशीर्वादित। दीर्घ जीवन, यश, धन, शक्ति और स्थायी विरासत।' } },
    ],
    classicalReference: {
      verse: 'दिवाजातस्य पुंसः स्युर्विषमे रविचन्द्रमौ।\nलग्नं चैव विषमं तत्र महाभाग्ययोगकृत्॥',
      source: 'Phaladeepika, Chapter 6',
    },
    relatedYogas: ['raja_yoga', 'gajakesari', 'lakshmi'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 1, house: 3, fromLagna: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SHORTER ENTRIES — REMAINING YOGAS (1-2 paragraphs each)
  // ═══════════════════════════════════════════════════════════════════════════

  adhi: {
    name: { en: 'Adhi Yoga', hi: 'अधि योग', sa: 'अधियोगः' },
    category: 'moon_based',
    isAuspicious: true,
    frequency: 5,
    formationRule: { en: 'Benefics in the 6th, 7th, and 8th from Moon', hi: 'शुभ ग्रह चन्द्र से 6, 7, 8वें भाव में' },
    detailedDescription: {
      en: ['Adhi Yoga forms when benefic planets (Jupiter, Venus, Mercury) occupy the 6th, 7th, and 8th houses from the Moon. This creates a protective shield around the Moon, granting ministerial positions, polite and trustworthy character, victory over enemies, and long life. It is one of the most powerful Moon-based yogas for worldly success.'],
      hi: ['अधि योग तब बनता है जब शुभ ग्रह चन्द्र से 6, 7, 8वें भावों में हों। यह मंत्री पद, विनम्र चरित्र, शत्रुओं पर विजय और दीर्घायु प्रदान करता है।'],
    },
    effects: [
      { area: { en: 'Leadership & Power', hi: 'नेतृत्व और शक्ति' }, description: { en: 'Ministerial or leadership positions, trust of rulers, prosperity.', hi: 'मंत्री या नेतृत्व पद, शासकों का विश्वास, समृद्धि।' } },
    ],
    relatedYogas: ['gajakesari', 'chandradhi', 'adhi_moon_ext'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 9, fromLagna: true },
      { planetId: 5, house: 10, fromLagna: true },
      { planetId: 3, house: 11, fromLagna: true },
    ],
  },

  chatussagara: {
    name: { en: 'Chatussagara Yoga', hi: 'चतुःसागर योग', sa: 'चतुःसागरयोगः' },
    category: 'raja',
    isAuspicious: true,
    frequency: 5,
    formationRule: { en: 'All four kendras (1, 4, 7, 10) occupied by planets', hi: 'चारों केन्द्र (1, 4, 7, 10) में ग्रह' },
    detailedDescription: {
      en: ['Chatussagara (Four Oceans) Yoga forms when all four kendra houses are occupied by planets. This is a powerful combination indicating fame spreading in all four directions, like the four oceans surrounding the earth. The native commands respect far beyond their immediate circle.'],
      hi: ['चतुःसागर योग तब बनता है जब चारों केन्द्र भावों में ग्रह हों। यह चारों दिशाओं में फैलने वाले यश का संकेत है।'],
    },
    effects: [
      { area: { en: 'Widespread Fame', hi: 'व्यापक यश' }, description: { en: 'Fame in all directions, international recognition, respected across communities.', hi: 'सभी दिशाओं में यश, अन्तर्राष्ट्रीय मान्यता।' } },
    ],
    relatedYogas: ['raja_yoga', 'chatussagara_full', 'chaturmukha'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 5, house: 7, fromLagna: true },
      { planetId: 6, house: 10, fromLagna: true },
    ],
  },

  vasumati: {
    name: { en: 'Vasumati Yoga', hi: 'वसुमती योग', sa: 'वसुमतीयोगः' },
    category: 'wealth',
    isAuspicious: true,
    frequency: 3,
    formationRule: { en: 'All benefics in upachaya houses (3, 6, 10, 11) from Moon', hi: 'सभी शुभ ग्रह चन्द्र से उपचय (3, 6, 10, 11) में' },
    detailedDescription: {
      en: ['Vasumati Yoga requires ALL natural benefics (Jupiter, Venus, Mercury, Moon) to be in upachaya houses from Moon. This strict condition makes it rare (~3%). When present, it grants ever-growing wealth that increases with age — the upachaya houses are houses of growth.'],
      hi: ['वसुमती योग के लिए सभी शुभ ग्रहों का चन्द्र से उपचय भावों में होना आवश्यक है। यह सतत बढ़ता धन प्रदान करता है।'],
    },
    effects: [
      { area: { en: 'Ever-Growing Wealth', hi: 'सतत बढ़ता धन' }, description: { en: 'Wealth increases with age. Financial position improves steadily throughout life.', hi: 'उम्र के साथ धन बढ़ता है। जीवन भर वित्तीय स्थिति लगातार सुधरती है।' } },
    ],
    relatedYogas: ['dhana_yoga', 'lakshmi', 'kubera'],
    chartPositions: [
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 4, house: 3, fromLagna: false },
      { planetId: 5, house: 6, fromLagna: false },
      { planetId: 3, house: 10, fromLagna: false },
    ],
  },

  amala: {
    name: { en: 'Amala Yoga', hi: 'अमल योग', sa: 'अमलयोगः' },
    category: 'other',
    isAuspicious: true,
    frequency: 12,
    formationRule: { en: 'Benefic in the 10th from Moon or Lagna', hi: 'चन्द्र या लग्न से 10वें में शुभ ग्रह' },
    detailedDescription: {
      en: ['Amala (spotless) Yoga forms when a benefic planet occupies the 10th house from Moon or Lagna. It grants an unblemished reputation, ethical character, and lasting fame through virtuous deeds. The native\'s career is marked by integrity and public service.'],
      hi: ['अमल (निर्मल) योग तब बनता है जब शुभ ग्रह चन्द्र या लग्न से 10वें भाव में हो। यह निष्कलंक प्रतिष्ठा और सद्गुणों से यश देता है।'],
    },
    effects: [
      { area: { en: 'Reputation', hi: 'प्रतिष्ठा' }, description: { en: 'Unblemished reputation, ethical career, lasting fame through good deeds.', hi: 'निष्कलंक प्रतिष्ठा, नैतिक करियर, सत्कर्मों से स्थायी यश।' } },
    ],
    relatedYogas: ['raja_yoga', 'chatussagara', 'saraswati'],
    chartPositions: [
      { planetId: 4, house: 10, fromLagna: true },
    ],
  },

  lakshmi: {
    name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग', sa: 'लक्ष्मीयोगः' },
    category: 'wealth',
    isAuspicious: true,
    frequency: 5,
    formationRule: { en: '9th lord in own/exalted sign in a kendra or trikona', hi: '9वां स्वामी स्वराशि/उच्च में केन्द्र या त्रिकोण में' },
    detailedDescription: {
      en: ['Lakshmi Yoga is named after the goddess of wealth. It forms when the 9th lord (fortune) is in its own or exalted sign in a kendra or trikona. This is one of the strongest wealth yogas, granting permanent prosperity, beautiful surroundings, and blessings of the divine feminine.'],
      hi: ['लक्ष्मी योग धन की देवी के नाम पर है। 9वां स्वामी स्वराशि या उच्च में केन्द्र/त्रिकोण में हो तो यह स्थायी समृद्धि देता है।'],
    },
    effects: [
      { area: { en: 'Permanent Wealth', hi: 'स्थायी धन' }, description: { en: 'Lasting prosperity, beautiful surroundings, divine blessings.', hi: 'स्थायी समृद्धि, सुन्दर परिवेश, दिव्य आशीर्वाद।' } },
    ],
    relatedYogas: ['dhana_yoga', 'mahalakshmi', 'vasumati'],
    chartPositions: [
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  parvata: {
    name: { en: 'Parvata Yoga', hi: 'पर्वत योग', sa: 'पर्वतयोगः' },
    category: 'raja',
    isAuspicious: true,
    frequency: 10,
    formationRule: { en: 'Benefics in kendras and no malefics in kendras (or 6th/8th lords in 6th/8th)', hi: 'केन्द्रों में शुभ ग्रह और केन्द्रों में पाप ग्रह नहीं' },
    detailedDescription: {
      en: ['Parvata (mountain) Yoga creates towering success and stability. When benefics dominate the kendras without malefic interference, the chart has a strong foundation — like a mountain that cannot be moved. The native achieves fame, leadership, and lasting prosperity.'],
      hi: ['पर्वत योग ऊँची सफलता और स्थिरता बनाता है। जब शुभ ग्रह बिना पाप हस्तक्षेप के केन्द्रों पर प्रभुत्व रखें, कुण्डली मजबूत नींव पर होती है।'],
    },
    effects: [
      { area: { en: 'Stability & Fame', hi: 'स्थिरता और यश' }, description: { en: 'Unshakeable success, leadership positions, lasting fame.', hi: 'अटल सफलता, नेतृत्व पद, स्थायी यश।' } },
    ],
    relatedYogas: ['raja_yoga', 'chatussagara', 'amala'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 7, fromLagna: true },
    ],
  },

  kahala: {
    name: { en: 'Kahala Yoga', hi: 'कहल योग', sa: 'कहलयोगः' },
    category: 'raja', isAuspicious: true, frequency: 8,
    formationRule: { en: '4th lord and 9th lord in mutual kendras, lagna lord strong', hi: '4 और 9वें स्वामी परस्पर केन्द्रों में, लग्नेश बलवान' },
    detailedDescription: {
      en: ['Kahala Yoga produces bold and energetic individuals who achieve authority through courage and initiative. It combines home/property energy (4th) with fortune (9th), creating success in real estate, agriculture, and land-based enterprises.'],
      hi: ['कहल योग साहसी और ऊर्जावान व्यक्तियों को उत्पन्न करता है जो पहल से अधिकार प्राप्त करते हैं।'],
    },
    effects: [
      { area: { en: 'Courage & Initiative', hi: 'साहस और पहल' }, description: { en: 'Bold action, property success, authority through courage.', hi: 'साहसिक कार्य, सम्पत्ति सफलता, साहस से अधिकार।' } },
    ],
    relatedYogas: ['raja_yoga', 'parvata', 'ruchaka'],
    chartPositions: [
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 4, house: 4, fromLagna: true },
      { planetId: 2, house: 1, fromLagna: true },
    ],
  },

  gauri: {
    name: { en: 'Gauri Yoga', hi: 'गौरी योग', sa: 'गौरीयोगः' },
    category: 'other', isAuspicious: true, frequency: 6,
    formationRule: { en: 'Moon in own/exalted sign aspected by Jupiter in a kendra from lagna', hi: 'चन्द्र स्वराशि/उच्च में, लग्न से केन्द्र में बृहस्पति की दृष्टि' },
    detailedDescription: {
      en: ['Gauri Yoga, named after goddess Parvati, blesses women with beauty, virtue, and happy married life. For men, it grants emotional stability, public favour, and a devoted spouse. Moon\'s strength with Jupiter\'s wisdom creates a harmonious personality.'],
      hi: ['गौरी योग, देवी पार्वती के नाम पर, स्त्रियों को सौन्दर्य, सद्गुण और सुखी वैवाहिक जीवन का आशीर्वाद देता है।'],
    },
    effects: [
      { area: { en: 'Beauty & Virtue', hi: 'सौन्दर्य और सद्गुण' }, description: { en: 'Beautiful appearance, virtuous character, happy marriage.', hi: 'सुन्दर रूप, सद्गुणी चरित्र, सुखी विवाह।' } },
    ],
    relatedYogas: ['lakshmi', 'malavya', 'gajakesari'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 10, fromLagna: true },
    ],
  },

  bharati: {
    name: { en: 'Bharati Yoga', hi: 'भारती योग', sa: 'भारतीयोगः' },
    category: 'other', isAuspicious: true, frequency: 4,
    formationRule: { en: '2nd lord conjunct 5th lord with Jupiter in kendra/trikona', hi: '2 स्वामी 5 स्वामी से युत, बृहस्पति केन्द्र/त्रिकोण में' },
    detailedDescription: {
      en: ['Bharati Yoga grants mastery of speech, language, and scholarship. Named after the goddess of learning, it combines family traditions (2nd) with creative intelligence (5th) under Jupiter\'s blessing, producing orators, writers, and linguists of distinction.'],
      hi: ['भारती योग वाणी, भाषा और विद्वत्ता में निपुणता प्रदान करता है। विद्या की देवी के नाम पर, यह वक्ता, लेखक और भाषाविद् बनाता है।'],
    },
    effects: [
      { area: { en: 'Speech & Scholarship', hi: 'वाणी और विद्वत्ता' }, description: { en: 'Mastery of languages, eloquent speech, scholarly achievement.', hi: 'भाषाओं में निपुणता, वाक्पटु वाणी, विद्वत् उपलब्धि।' } },
    ],
    relatedYogas: ['saraswati', 'budhaditya', 'bhadra'],
    chartPositions: [
      { planetId: 5, house: 2, fromLagna: true },
      { planetId: 0, house: 2, fromLagna: true },
      { planetId: 4, house: 1, fromLagna: true },
    ],
  },

  shrinatha: {
    name: { en: 'Shrinatha Yoga', hi: 'श्रीनाथ योग', sa: 'श्रीनाथयोगः' },
    category: 'wealth', isAuspicious: true, frequency: 6,
    formationRule: { en: '7th lord in 10th, 10th lord in 9th, with 9th lord strong', hi: '7 स्वामी 10वें में, 10 स्वामी 9वें में, 9 स्वामी बलवान' },
    detailedDescription: {
      en: ['Shrinatha (Lord of Lakshmi) Yoga creates a chain of auspicious energy flowing from partnerships (7th) through career (10th) to fortune (9th). Success comes through collaborative ventures and blessed partnerships.'],
      hi: ['श्रीनाथ योग साझेदारी (7) से करियर (10) से भाग्य (9) तक शुभ ऊर्जा की श्रृंखला बनाता है।'],
    },
    effects: [
      { area: { en: 'Partnership Wealth', hi: 'साझेदारी धन' }, description: { en: 'Wealth through partnerships and collaborative ventures.', hi: 'साझेदारी और सहयोगी उद्यमों से धन।' } },
    ],
    relatedYogas: ['lakshmi', 'dhana_yoga', 'shri_kanthi'],
    chartPositions: [
      { planetId: 5, house: 10, fromLagna: true },
      { planetId: 6, house: 9, fromLagna: true },
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  shankha: {
    name: { en: 'Shankha Yoga', hi: 'शंख योग', sa: 'शङ्खयोगः' },
    category: 'raja', isAuspicious: true, frequency: 6,
    formationRule: { en: '5th and 6th lords in mutual kendras from each other', hi: '5 और 6वें स्वामी परस्पर केन्द्रों में' },
    detailedDescription: {
      en: ['Shankha (conch) Yoga combines creative intelligence (5th) with competitive edge (6th), producing individuals who triumph over rivals through talent. Long life, moral character, and comfortable old age are hallmarks.'],
      hi: ['शंख योग सृजनात्मक बुद्धि (5) को प्रतिस्पर्धी किनारे (6) के साथ जोड़ता है। दीर्घायु और नैतिक चरित्र इसकी विशेषताएँ हैं।'],
    },
    effects: [
      { area: { en: 'Victory & Longevity', hi: 'विजय और दीर्घायु' }, description: { en: 'Triumph over rivals, comfortable old age, moral reputation.', hi: 'प्रतिद्वंद्वियों पर विजय, सुखी वृद्धावस्था, नैतिक प्रतिष्ठा।' } },
    ],
    relatedYogas: ['raja_yoga', 'bheri', 'parvata'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 3, house: 4, fromLagna: true },
    ],
  },

  bheri: {
    name: { en: 'Bheri Yoga', hi: 'भेरी योग', sa: 'भेरीयोगः' },
    category: 'raja', isAuspicious: true, frequency: 5,
    formationRule: { en: 'Lagna lord, Jupiter, and Venus in mutual kendras, 9th lord strong', hi: 'लग्नेश, बृहस्पति और शुक्र परस्पर केन्द्रों में, 9 स्वामी बलवान' },
    detailedDescription: {
      en: ['Bheri (drum) Yoga announces the native\'s arrival like a royal drum. When the lagna lord, Jupiter, and Venus occupy mutual kendras with a strong 9th lord, it creates lasting fame, fortune, and respect. The native is known for courage and dharmic living.'],
      hi: ['भेरी (नगाड़ा) योग राजसी नगाड़े की तरह जातक के आगमन की घोषणा करता है। स्थायी यश, भाग्य और सम्मान देता है।'],
    },
    effects: [
      { area: { en: 'Fame & Honour', hi: 'यश और सम्मान' }, description: { en: 'Lasting fame, royal treatment, respected for dharmic conduct.', hi: 'स्थायी यश, राजसी व्यवहार, धार्मिक आचरण के लिए सम्मान।' } },
    ],
    relatedYogas: ['shankha', 'raja_yoga', 'parvata'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
      { planetId: 4, house: 4, fromLagna: true },
      { planetId: 5, house: 7, fromLagna: true },
    ],
  },

  pushkala: {
    name: { en: 'Pushkala Yoga', hi: 'पुष्कल योग', sa: 'पुष्कलयोगः' },
    category: 'other', isAuspicious: true, frequency: 7,
    formationRule: { en: 'Lagna lord in friend\'s sign, Moon in lagna, lagna lord aspected by a friendly planet', hi: 'लग्नेश मित्र राशि में, चन्द्र लग्न में, लग्नेश मित्र ग्रह से दृष्ट' },
    detailedDescription: {
      en: ['Pushkala (abundance) Yoga grants nourishment in all aspects of life — wealth, family, health, and social standing. The Moon in lagna ensures emotional fulfilment while the lagna lord in a friendly sign ensures supportive life circumstances.'],
      hi: ['पुष्कल (प्रचुरता) योग जीवन के सभी पहलुओं — धन, परिवार, स्वास्थ्य, सामाजिक स्थिति — में पोषण प्रदान करता है।'],
    },
    effects: [
      { area: { en: 'Overall Abundance', hi: 'समग्र प्रचुरता' }, description: { en: 'Abundance in wealth, family, health, and social standing. Public popularity.', hi: 'धन, परिवार, स्वास्थ्य और सामाजिक स्थिति में प्रचुरता।' } },
    ],
    relatedYogas: ['gajakesari', 'lakshmi', 'pushkala_moon'],
    chartPositions: [
      { planetId: 2, house: 9, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
    ],
  },

  chapa: {
    name: { en: 'Chapa Yoga', hi: 'चाप योग', sa: 'चापयोगः' },
    category: 'other', isAuspicious: true, frequency: 5,
    formationRule: { en: 'Lagna lord exalted, 4th and 10th lords exchange signs', hi: 'लग्नेश उच्च, 4 और 10 स्वामी राशि विनिमय' },
    detailedDescription: {
      en: ['Chapa (bow) Yoga gives precision, focus, and the ability to hit targets — metaphorically achieving goals with accuracy. The exchange of 4th and 10th lords connects home with career, creating harmony between personal and professional life.'],
      hi: ['चाप (धनुष) योग सटीकता, एकाग्रता और लक्ष्य साधने की क्षमता देता है।'],
    },
    effects: [
      { area: { en: 'Focused Achievement', hi: 'केन्द्रित उपलब्धि' }, description: { en: 'Goal-oriented success, precision in action, work-life harmony.', hi: 'लक्ष्य-उन्मुख सफलता, कार्य में सटीकता।' } },
    ],
    relatedYogas: ['raja_yoga', 'parvata'],
    chartPositions: [
      { planetId: 2, house: 10, fromLagna: true },
      { planetId: 1, house: 10, fromLagna: true },
      { planetId: 6, house: 4, fromLagna: true },
    ],
  },

  rajalakshana: {
    name: { en: 'Rajalakshana Yoga', hi: 'राजलक्षण योग', sa: 'राजलक्षणयोगः' },
    category: 'raja', isAuspicious: true, frequency: 5,
    formationRule: { en: 'Strong 9th and 10th lords in kendras with lagna lord', hi: 'बलवान 9 और 10 स्वामी लग्नेश के साथ केन्द्रों में' },
    detailedDescription: {
      en: ['Rajalakshana (royal marks) Yoga indicates the native bears the marks of royalty — leadership ability, noble bearing, commanding presence, and destined for positions of authority.'],
      hi: ['राजलक्षण योग दर्शाता है कि जातक राजसी चिह्न धारण करता है — नेतृत्व क्षमता, शाही आचरण, प्रभावशाली उपस्थिति।'],
    },
    effects: [
      { area: { en: 'Royal Bearing', hi: 'राजसी आचरण' }, description: { en: 'Commanding presence, natural leadership, noble character.', hi: 'प्रभावशाली उपस्थिति, स्वाभाविक नेतृत्व, उत्तम चरित्र।' } },
    ],
    relatedYogas: ['raja_yoga', 'dharma_karmadhipati', 'mahabhagya'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 6, house: 4, fromLagna: true },
      { planetId: 2, house: 10, fromLagna: true },
    ],
  },

  pravrajya: {
    name: { en: 'Pravrajya Yoga', hi: 'प्रव्रज्या योग', sa: 'प्रव्रज्यायोगः' },
    category: 'other', isAuspicious: false, frequency: 5,
    formationRule: { en: '4+ planets in one house forming a stellium', hi: 'एक भाव में 4+ ग्रह स्टेलियम बनाते हुए' },
    detailedDescription: {
      en: ['Pravrajya (renunciation) Yoga indicates a strong pull towards spiritual life and renunciation of worldly attachments. When 4 or more planets concentrate in a single house, the native may leave conventional life for spiritual pursuits, monasticism, or asceticism.'],
      hi: ['प्रव्रज्या (संन्यास) योग आध्यात्मिक जीवन और सांसारिक आसक्तियों के त्याग की ओर प्रबल खिंचाव दर्शाता है।'],
    },
    effects: [
      { area: { en: 'Spiritual Calling', hi: 'आध्यात्मिक आह्वान' }, description: { en: 'Pull towards renunciation, spiritual seeking, monastic life.', hi: 'संन्यास, आध्यात्मिक खोज, मठवासी जीवन की ओर खिंचाव।' } },
    ],
    relatedYogas: ['tapasvi', 'parivraja', 'sada_sannyasa', 'moksha_yoga'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 5, fromLagna: true },
    ],
  },

  vanchana_chora_bheeti: {
    name: { en: 'Vanchana Chora Bheeti Yoga', hi: 'वंचना चोर भीति योग', sa: 'वञ्चनाचोरभीतियोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 10,
    formationRule: { en: 'Lord of 7th conjunct Rahu or in navamsha of Rahu, aspected by malefic', hi: '7 स्वामी राहु से युत या राहु के नवांश में, पाप से दृष्ट' },
    detailedDescription: {
      en: ['This yoga indicates fear of deception, theft, and betrayal. The native may encounter untrustworthy partners, financial fraud, or fear-inducing situations. Awareness and caution in partnerships is essential.'],
      hi: ['यह योग छल, चोरी और विश्वासघात का भय दर्शाता है। जातक अविश्वसनीय साझेदार या वित्तीय धोखाधड़ी का सामना कर सकता है।'],
    },
    effects: [
      { area: { en: 'Trust & Deception', hi: 'विश्वास और छल' }, description: { en: 'Risk of betrayal, deception in partnerships, need for caution.', hi: 'विश्वासघात का जोखिम, साझेदारी में छल, सावधानी आवश्यक।' } },
    ],
    relatedYogas: ['kalathra_dosha', 'grahan', 'kala_sarpa'],
    chartPositions: [
      { planetId: 5, house: 7, fromLagna: true },
      { planetId: 7, house: 7, fromLagna: true },
      { planetId: 8, house: 1, fromLagna: true },
      { planetId: 6, house: 10, fromLagna: true },
    ],
  },

  graha_sanghata: {
    name: { en: 'Graha Sanghata (Planetary Cluster)', hi: 'ग्रह संघात (ग्रह समूह)', sa: 'ग्रहसंघातयोगः' },
    category: 'other', isAuspicious: true, frequency: 3,
    formationRule: { en: 'All 7 planets (Sun–Saturn) within 4 consecutive houses', hi: 'सभी 7 ग्रह (सूर्य-शनि) 4 क्रमागत भावों में' },
    detailedDescription: {
      en: ['Graha Sanghata (planetary cluster) forms when all seven visible planets (Sun through Saturn) are concentrated within a narrow 4-house window. This creates intense, focused energy — like a laser rather than a floodlight. The houses occupied determine whether this concentration manifests positively (kendra/trikona) or as life imbalance (dusthana).'],
      hi: ['ग्रह संघात तब बनता है जब सभी सात दृश्य ग्रह (सूर्य से शनि) 4 क्रमागत भावों की संकीर्ण खिड़की में संकेन्द्रित हों। यह तीव्र, केन्द्रित ऊर्जा उत्पन्न करता है। कौन से भाव अधिगृहीत हैं, इससे निर्धारित होता है कि यह संकेन्द्रण सकारात्मक (केन्द्र/त्रिकोण) या जीवन असन्तुलन (दुस्थान) के रूप में प्रकट होगा।'],
    },
    effects: [
      { area: { en: 'Concentrated Energy', hi: 'संकेन्द्रित ऊर्जा' }, description: { en: 'All planetary energy focused in a narrow band — intense life themes with deep expertise but potential imbalance in unoccupied houses.', hi: 'सभी ग्रह ऊर्जा संकीर्ण क्षेत्र में — गहन जीवन विषय और विशेषज्ञता किन्तु खाली भावों में सम्भावित असन्तुलन।' } },
    ],
    relatedYogas: ['graha_malika', 'ardha_chandra_nabhasa', 'chhatra_nabhasa'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 2, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 4, fromLagna: true },
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 2, fromLagna: true },
      { planetId: 6, house: 3, fromLagna: true },
    ],
  },

  daridra: {
    name: { en: 'Daridra Yoga', hi: 'दरिद्र योग', sa: 'दरिद्रयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 15,
    formationRule: { en: '11th lord in 6th/8th/12th house (gains obstructed by losses/enemies/debts)', hi: '11 स्वामी 6/8/12 भाव में (लाभ हानि/शत्रु/ऋण से अवरुद्ध)' },
    detailedDescription: {
      en: ['Daridra (poverty) Yoga forms when the lord of gains (11th) is placed in houses of loss (6th, 8th, 12th). Income is blocked, financial struggles persist despite effort. Multiple forms exist based on which wealth lords are afflicted.'],
      hi: ['दरिद्र योग तब बनता है जब लाभ (11) का स्वामी हानि (6, 8, 12) भावों में हो। आय अवरुद्ध, प्रयासों के बावजूद वित्तीय संघर्ष।'],
    },
    effects: [
      { area: { en: 'Financial Struggle', hi: 'वित्तीय संघर्ष' }, description: { en: 'Income blocked, financial difficulties despite talent and effort.', hi: 'आय अवरुद्ध, प्रतिभा और प्रयास के बावजूद वित्तीय कठिनाइयाँ।' } },
    ],
    relatedYogas: ['daridra_lagna_12', 'daridra_2nd_in_12', 'daridra_11_in_6_12'],
    chartPositions: [
      { planetId: 6, house: 6, fromLagna: true },
    ],
  },

  shubha_kartari: {
    name: { en: 'Shubha Kartari Yoga', hi: 'शुभ कर्तरी योग', sa: 'शुभकर्तरीयोगः' },
    category: 'other', isAuspicious: true, frequency: 10,
    formationRule: { en: 'Benefics in houses adjacent to (hemming) a specific house or planet', hi: 'किसी विशेष भाव या ग्रह के निकटवर्ती भावों में शुभ ग्रह' },
    detailedDescription: {
      en: ['Shubha Kartari (auspicious scissors) Yoga forms when benefic planets hem a house or planet from both sides. This creates a protective shield of positive energy, enhancing the significations of the hemmed house. Lagna hemmed by benefics is especially powerful.'],
      hi: ['शुभ कर्तरी योग तब बनता है जब शुभ ग्रह किसी भाव या ग्रह को दोनों ओर से घेरें। यह सकारात्मक ऊर्जा का रक्षात्मक कवच बनाता है।'],
    },
    effects: [
      { area: { en: 'Protection & Enhancement', hi: 'रक्षा और वृद्धि' }, description: { en: 'Protective shield around the hemmed house, enhanced positive results.', hi: 'घेरे गये भाव के चारों ओर रक्षात्मक कवच, बढ़े हुए सकारात्मक परिणाम।' } },
    ],
    relatedYogas: ['papa_kartari', 'shubha_kartari_moon'],
    chartPositions: [
      { planetId: 4, house: 12, fromLagna: true },
      { planetId: 5, house: 2, fromLagna: true },
    ],
  },

  papa_kartari: {
    name: { en: 'Papa Kartari Yoga', hi: 'पाप कर्तरी योग', sa: 'पापकर्तरीयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 12,
    formationRule: { en: 'Malefics hemming a house or planet from both sides', hi: 'पाप ग्रह किसी भाव या ग्रह को दोनों ओर से घेरते हुए' },
    detailedDescription: {
      en: ['Papa Kartari (inauspicious scissors) is the opposite of Shubha Kartari — malefics hemming a house squeeze out its positive significations. A lagna hemmed by Saturn and Mars creates stress, health issues, and obstacles. The severity depends on which malefics are involved.'],
      hi: ['पाप कर्तरी शुभ कर्तरी का विपरीत है — पाप ग्रह किसी भाव को दबाकर उसके सकारात्मक परिणाम निचोड़ लेते हैं।'],
    },
    effects: [
      { area: { en: 'Stress & Obstacles', hi: 'तनाव और बाधाएँ' }, description: { en: 'Squeezed positive energy, stress, obstacles in the affected house\'s significations.', hi: 'दबी सकारात्मक ऊर्जा, तनाव, प्रभावित भाव में बाधाएँ।' } },
    ],
    relatedYogas: ['shubha_kartari', 'papa_kartari_moon'],
    chartPositions: [
      { planetId: 6, house: 12, fromLagna: true },
      { planetId: 2, house: 2, fromLagna: true },
    ],
  },

  // Nabhasa Sankhya Yogas (sign-count based)
  gola: {
    name: { en: 'Gola Yoga', hi: 'गोल योग', sa: 'गोलयोगः' },
    category: 'other', isAuspicious: false, frequency: 0.1,
    formationRule: { en: 'All 7 planets in 1 sign', hi: 'सभी 7 ग्रह 1 राशि में' },
    detailedDescription: {
      en: ['Gola (sphere) Yoga is astronomically almost impossible — all 7 planets in one sign. If it ever forms, it creates extreme concentration of energy. The native dominates one area of life completely while other areas are barren.'],
      hi: ['गोल योग खगोलीय रूप से लगभग असम्भव है — सभी 7 ग्रह एक राशि में। यह ऊर्जा का अत्यधिक संकेंद्रण बनाता है।'],
    },
    effects: [
      { area: { en: 'Extreme Concentration', hi: 'अत्यधिक संकेंद्रण' }, description: { en: 'One life area dominates completely; others neglected.', hi: 'एक जीवन क्षेत्र पूर्णतः प्रभावी; अन्य उपेक्षित।' } },
    ],
    relatedYogas: ['yuga', 'shoola_nabhasa', 'kedara'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 2, house: 1, fromLagna: true },
      { planetId: 3, house: 1, fromLagna: true },
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 1, fromLagna: true },
      { planetId: 6, house: 1, fromLagna: true },
    ],
  },

  yuga: {
    name: { en: 'Yuga Yoga', hi: 'युग योग', sa: 'युगयोगः' },
    category: 'other', isAuspicious: false, frequency: 0.5,
    formationRule: { en: 'All 7 planets in exactly 2 signs', hi: 'सभी 7 ग्रह केवल 2 राशियों में' },
    detailedDescription: {
      en: ['Yuga (yoke) Yoga creates extreme polarity — life oscillates between two extremes. The native may be very wealthy or very poor, deeply religious or completely irreligious, with little middle ground.'],
      hi: ['युग योग अत्यधिक ध्रुवीयता बनाता है — जीवन दो छोरों के बीच झूलता है।'],
    },
    effects: [
      { area: { en: 'Life Polarity', hi: 'जीवन ध्रुवीयता' }, description: { en: 'Oscillation between extremes, polarised existence.', hi: 'छोरों के बीच दोलन, ध्रुवीकृत अस्तित्व।' } },
    ],
    relatedYogas: ['gola', 'shoola_nabhasa', 'kedara'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 2, house: 1, fromLagna: true },
      { planetId: 3, house: 2, fromLagna: true },
      { planetId: 4, house: 2, fromLagna: true },
      { planetId: 5, house: 2, fromLagna: true },
      { planetId: 6, house: 2, fromLagna: true },
    ],
  },

  kedara: {
    name: { en: 'Kedara Yoga', hi: 'केदार योग', sa: 'केदारयोगः' },
    category: 'other', isAuspicious: true, frequency: 15,
    formationRule: { en: 'All planets occupy exactly 4 houses', hi: 'सभी ग्रह केवल 4 भावों में' },
    detailedDescription: {
      en: ['Kedara (ploughed field) Yoga indicates agricultural wealth, landed property, and patient hard work yielding results. The native earns through steady effort like a farmer cultivating land.'],
      hi: ['केदार योग कृषि धन, भूमि सम्पत्ति और धैर्यपूर्ण कार्य से परिणाम दर्शाता है।'],
    },
    effects: [
      { area: { en: 'Property & Land', hi: 'सम्पत्ति और भूमि' }, description: { en: 'Agricultural wealth, property acquisition, steady earned prosperity.', hi: 'कृषि धन, सम्पत्ति अर्जन, स्थिर अर्जित समृद्धि।' } },
    ],
    relatedYogas: ['gola', 'yuga', 'pasha', 'damini'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 3, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 5, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
  },

  pasha: {
    name: { en: 'Pasha Yoga', hi: 'पाश योग', sa: 'पाशयोगः' },
    category: 'other', isAuspicious: false, frequency: 10,
    formationRule: { en: 'Planets in 5 signs', hi: 'ग्रह 5 राशियों में' },
    detailedDescription: {
      en: ['Pasha (noose) Yoga indicates some restriction but also deep connections. The native may feel bound by obligations, family duties, or societal expectations, but these bonds also provide stability and support.'],
      hi: ['पाश योग कुछ प्रतिबंध पर गहरे सम्बन्ध भी दर्शाता है। जातक दायित्वों से बंधा महसूस कर सकता है, पर ये बंधन स्थिरता भी देते हैं।'],
    },
    effects: [
      { area: { en: 'Bonds & Obligations', hi: 'बन्धन और दायित्व' }, description: { en: 'Restriction through bonds, but stability through deep connections.', hi: 'बन्धनों से प्रतिबंध, पर गहरे सम्बन्धों से स्थिरता।' } },
    ],
    relatedYogas: ['kedara', 'damini', 'veena'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 7, fromLagna: true },
      { planetId: 6, house: 9, fromLagna: true },
    ],
  },

  damini: {
    name: { en: 'Damini Yoga', hi: 'दामिनी योग', sa: 'दामिनीयोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Planets in 6 signs', hi: 'ग्रह 6 राशियों में' },
    detailedDescription: {
      en: ['Damini (lightning) Yoga grants generous, charitable nature and lightning-like brilliance. The broad distribution of planets across 6 signs creates versatility, multiple talents, and the ability to illuminate many areas of life.'],
      hi: ['दामिनी योग उदार, दानशील स्वभाव और बिजली जैसी प्रतिभा देता है।'],
    },
    effects: [
      { area: { en: 'Versatility & Generosity', hi: 'बहुमुखी प्रतिभा और उदारता' }, description: { en: 'Multiple talents, charitable nature, brilliant flashes of insight.', hi: 'अनेक प्रतिभाएँ, दानशील स्वभाव, अंतर्दृष्टि की चमक।' } },
    ],
    relatedYogas: ['kedara', 'pasha', 'veena'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 2, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 4, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 6, house: 6, fromLagna: true },
    ],
  },

  veena: {
    name: { en: 'Veena Yoga', hi: 'वीणा योग', sa: 'वीणायोगः' },
    category: 'other', isAuspicious: true, frequency: 6,
    formationRule: { en: 'Planets in all 7 signs', hi: 'ग्रह सभी 7 राशियों में' },
    detailedDescription: {
      en: ['Veena (musical instrument) Yoga indicates musical, artistic, balanced personality spread across many areas of life. Like a well-tuned veena, the native produces harmonious results in multiple domains.'],
      hi: ['वीणा योग संगीतमय, कलात्मक, सन्तुलित व्यक्तित्व दर्शाता है जो जीवन के अनेक क्षेत्रों में फैला है।'],
    },
    effects: [
      { area: { en: 'Harmony & Arts', hi: 'सामंजस्य और कला' }, description: { en: 'Musical talent, artistic nature, harmonious life across many areas.', hi: 'संगीत प्रतिभा, कलात्मक स्वभाव, अनेक क्षेत्रों में सामंजस्यपूर्ण जीवन।' } },
    ],
    relatedYogas: ['damini', 'saraswati', 'malavya'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 2, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 4, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 6, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
  },

  graha_malika: {
    name: { en: 'Graha Malika Yoga', hi: 'ग्रह मालिका योग', sa: 'ग्रहमालिकायोगः' },
    category: 'other', isAuspicious: true, frequency: 3,
    formationRule: { en: 'All 7 planets in consecutive houses forming a continuous garland', hi: 'सभी 7 ग्रह क्रमागत भावों में निरन्तर माला बनाते हुए' },
    detailedDescription: {
      en: ['Graha Malika (planetary garland) Yoga forms a continuous chain of planetary energy across consecutive houses. Like a garland of flowers, each planet enhances the next, creating a flow of positive results. The starting house determines the type of success.'],
      hi: ['ग्रह मालिका योग क्रमागत भावों में ग्रह ऊर्जा की निरन्तर श्रृंखला बनाता है। प्रत्येक ग्रह अगले को बढ़ाता है।'],
    },
    effects: [
      { area: { en: 'Flowing Success', hi: 'प्रवाहित सफलता' }, description: { en: 'Continuous chain of positive results, each success leading to the next.', hi: 'सकारात्मक परिणामों की निरन्तर श्रृंखला, प्रत्येक सफलता अगली की ओर।' } },
    ],
    relatedYogas: ['graha_sanghata', 'ardha_chandra_nabhasa'],
    chartPositions: [
      { planetId: 0, house: 2, fromLagna: true },
      { planetId: 1, house: 3, fromLagna: true },
      { planetId: 2, house: 4, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
      { planetId: 4, house: 6, fromLagna: true },
      { planetId: 5, house: 7, fromLagna: true },
      { planetId: 6, house: 8, fromLagna: true },
    ],
  },

  // Conjunction-based yogas
  surya_grahan: {
    name: { en: 'Surya Grahan Yoga', hi: 'सूर्य ग्रहण योग', sa: 'सूर्यग्रहणयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 10,
    formationRule: { en: 'Sun conjunct Rahu or Ketu', hi: 'सूर्य राहु या केतु से युत' },
    detailedDescription: {
      en: ['Solar eclipse yoga — the Sun\'s life force is shadowed by the nodes. Father/authority issues, ego challenges, and government obstacles are common. However, it can also grant research ability and occult knowledge through the shadow\'s depth.'],
      hi: ['सूर्य ग्रहण योग — सूर्य की जीवन शक्ति ग्रन्थियों से आच्छादित। पिता/अधिकार समस्याएँ, अहंकार चुनौतियाँ, पर अनुसंधान क्षमता भी।'],
    },
    effects: [
      { area: { en: 'Authority & Father', hi: 'अधिकार और पिता' }, description: { en: 'Father issues, ego challenges, government obstacles. But also deep research ability.', hi: 'पिता समस्याएँ, अहंकार चुनौतियाँ, पर गहन अनुसंधान क्षमता भी।' } },
    ],
    relatedYogas: ['chandra_grahan', 'grahan', 'kala_sarpa'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 7, house: 1, fromLagna: true },
      { planetId: 8, house: 7, fromLagna: true },
    ],
  },

  chandra_grahan: {
    name: { en: 'Chandra Grahan Yoga', hi: 'चंद्र ग्रहण योग', sa: 'चन्द्रग्रहणयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 10,
    formationRule: { en: 'Moon conjunct Rahu or Ketu', hi: 'चन्द्र राहु या केतु से युत' },
    detailedDescription: {
      en: ['Lunar eclipse yoga — emotional turbulence, mother\'s health concerns, anxiety patterns. The positive side includes strong intuition and psychic ability. Moon-Rahu creates obsessive mind; Moon-Ketu creates detached emotions.'],
      hi: ['चंद्र ग्रहण योग — भावनात्मक अशांति, माता के स्वास्थ्य की चिन्ता, चिंता। सकारात्मक पक्ष: तीव्र अंतर्ज्ञान और मानसिक क्षमता।'],
    },
    effects: [
      { area: { en: 'Emotions & Mother', hi: 'भावनाएँ और माता' }, description: { en: 'Emotional turbulence, mother concerns, but strong intuition.', hi: 'भावनात्मक अशांति, माता चिन्ता, पर तीव्र अंतर्ज्ञान।' } },
    ],
    relatedYogas: ['surya_grahan', 'grahan', 'kala_sarpa'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 7, house: 4, fromLagna: true },
      { planetId: 8, house: 10, fromLagna: true },
    ],
  },

  shani_rahu: {
    name: { en: 'Shani-Rahu Yoga', hi: 'शनि-राहु योग', sa: 'शनिराहुयोगः' },
    category: 'dosha', isAuspicious: false, frequency: 8,
    formationRule: { en: 'Saturn conjunct Rahu', hi: 'शनि-राहु युति' },
    detailedDescription: {
      en: ['Saturn-Rahu conjunction creates chronic delays, fear, anxiety, and past-life karmic debt manifesting as obstacles. However, intense perseverance and eventual breakthrough after Saturn\'s maturity age (36) is the typical trajectory.'],
      hi: ['शनि-राहु युति दीर्घकालिक विलंब, भय, चिंता बनाती है, पर शनि परिपक्वता (36 वर्ष) के बाद सफलता सामान्य मार्ग है।'],
    },
    effects: [
      { area: { en: 'Delays & Breakthrough', hi: 'विलंब और सफलता' }, description: { en: 'Chronic delays but eventual breakthrough after age 36.', hi: 'दीर्घकालिक विलंब पर 36 के बाद अंतिम सफलता।' } },
    ],
    relatedYogas: ['shrapit_dosha', 'angarak', 'bandhana'],
    chartPositions: [
      { planetId: 6, house: 5, fromLagna: true },
      { planetId: 7, house: 5, fromLagna: true },
      { planetId: 8, house: 11, fromLagna: true },
    ],
  },

  // Additional shorter entries for remaining yogas
  kubera: {
    name: { en: 'Kubera Yoga', hi: 'कुबेर योग', sa: 'कुबेरयोगः' },
    category: 'wealth', isAuspicious: true, frequency: 5,
    formationRule: { en: 'Lord of 1st in 2nd and lord of 2nd in 11th, or similar wealth chain', hi: '1 स्वामी 2वें में और 2 स्वामी 11वें में' },
    detailedDescription: {
      en: ['Kubera Yoga, named after the god of wealth, creates a chain of prosperity flowing from self (1st) through wealth (2nd) to gains (11th). Immense wealth accumulation potential.'],
      hi: ['कुबेर योग, धन के देवता के नाम पर, स्व (1) से धन (2) से लाभ (11) तक समृद्धि की श्रृंखला बनाता है।'],
    },
    effects: [
      { area: { en: 'Immense Wealth', hi: 'अपार धन' }, description: { en: 'Strong wealth accumulation, multiple income streams.', hi: 'प्रबल धन संचय, अनेक आय धाराएँ।' } },
    ],
    relatedYogas: ['dhana_yoga', 'lakshmi', 'vasumati'],
    chartPositions: [
      { planetId: 2, house: 2, fromLagna: true },
      { planetId: 5, house: 11, fromLagna: true },
    ],
  },

  akhanda_samrajya: {
    name: { en: 'Akhanda Samrajya Yoga', hi: 'अखंड साम्राज्य योग', sa: 'अखण्डसाम्राज्ययोगः' },
    category: 'raja', isAuspicious: true, frequency: 4,
    formationRule: { en: 'Jupiter lords 2nd/5th/11th and is in kendra from Moon', hi: 'गुरु 2/5/11 स्वामी + चन्द्र से केन्द्र में' },
    detailedDescription: {
      en: ['Akhanda Samrajya (undivided empire) Yoga grants vast, unchallenged authority. The native\'s power remains undivided — like an empire without succession disputes. Great fame across regions.'],
      hi: ['अखंड साम्राज्य योग विशाल, अविवादित अधिकार प्रदान करता है। जातक की शक्ति अविभाजित रहती है।'],
    },
    effects: [
      { area: { en: 'Undivided Authority', hi: 'अविभाजित अधिकार' }, description: { en: 'Vast authority, power remains unchallenged, great fame.', hi: 'विशाल अधिकार, शक्ति अविवादित, महान यश।' } },
    ],
    relatedYogas: ['raja_yoga', 'dharma_karmadhipati', 'gajakesari'],
    chartPositions: [
      { planetId: 4, house: 4, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
    ],
  },

  chamara: {
    name: { en: 'Chamara Yoga', hi: 'चामर योग', sa: 'चामरयोगः' },
    category: 'raja', isAuspicious: true, frequency: 5,
    formationRule: { en: 'Lagna lord exalted in kendra', hi: 'लग्नेश उच्च केन्द्र में' },
    detailedDescription: {
      en: ['Chamara (royal fan) Yoga indicates oratory skill, royal patronage, commanding presence, long life, eloquence, and fame. The exalted lagna lord in a kendra projects the native\'s personality with maximum impact.'],
      hi: ['चामर योग वक्तृत्व कला, राजकीय संरक्षण, प्रभावशाली उपस्थिति, दीर्घायु और यश दर्शाता है।'],
    },
    effects: [
      { area: { en: 'Oratory & Fame', hi: 'वक्तृत्व और यश' }, description: { en: 'Eloquent speech, commanding presence, lasting fame.', hi: 'वाक्पटु वाणी, प्रभावशाली उपस्थिति, स्थायी यश।' } },
    ],
    relatedYogas: ['raja_yoga', 'hansa', 'mahabhagya'],
    chartPositions: [
      { planetId: 2, house: 10, fromLagna: true },
    ],
  },

  nipuna: {
    name: { en: 'Nipuna Yoga', hi: 'निपुण योग', sa: 'निपुणयोगः' },
    category: 'other', isAuspicious: true, frequency: 5,
    formationRule: { en: 'Sun + Moon + Mercury in the same house', hi: 'सूर्य + चन्द्र + बुध एक भाव में' },
    detailedDescription: {
      en: ['Nipuna (skilled/expert) Yoga combines the Sun\'s authority, Moon\'s intuition, and Mercury\'s intellect in one house. This creates exceptional craftsmen, skilled professionals, and multi-talented individuals.'],
      hi: ['निपुण योग सूर्य के अधिकार, चन्द्र के अंतर्ज्ञान और बुध की बुद्धि को एक भाव में जोड़ता है।'],
    },
    effects: [
      { area: { en: 'Multi-Skilled', hi: 'बहु-कौशल' }, description: { en: 'Exceptional craftsmanship, multiple skills, quick learner.', hi: 'असाधारण शिल्पकारिता, अनेक कौशल, तेज शिक्षार्थी।' } },
    ],
    relatedYogas: ['budhaditya', 'saraswati', 'bhadra'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 1, house: 5, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
    ],
  },

  balarishta: {
    name: { en: 'Balarishta Yoga', hi: 'बालारिष्ट योग', sa: 'बालारिष्टयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 8,
    formationRule: { en: 'Moon in dusthana (6/8/12) afflicted by malefic, lagna lord weak', hi: 'चन्द्र दुस्थान (6/8/12) में पाप से पीड़ित, लग्नेश दुर्बल' },
    detailedDescription: {
      en: ['Balarishta (childhood danger) Yoga indicates health challenges in early life. The Moon (nurturer) in a dusthana under malefic influence suggests vulnerability in infancy. Jupiter\'s aspect or strong lagna lord cancels the danger.'],
      hi: ['बालारिष्ट योग बाल्यकाल में स्वास्थ्य चुनौतियों का संकेत है। बृहस्पति की दृष्टि या बलवान लग्नेश खतरे को निरस्त करता है।'],
    },
    effects: [
      { area: { en: 'Childhood Health', hi: 'बाल्यकाल स्वास्थ्य' }, description: { en: 'Health vulnerabilities in early life, extra care needed in infancy.', hi: 'प्रारम्भिक जीवन में स्वास्थ्य कमजोरियाँ, शैशव में अतिरिक्त देखभाल।' } },
    ],
    relatedYogas: ['balarishta_ext', 'alpayu', 'arishta_bhanga'],
    chartPositions: [
      { planetId: 1, house: 8, fromLagna: true },
      { planetId: 6, house: 8, fromLagna: true },
    ],
  },

  alpayu: {
    name: { en: 'Alpayu Yoga', hi: 'अल्पायु योग', sa: 'अल्पायुयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 5,
    formationRule: { en: 'Malefics in both 1st and 7th houses', hi: 'पाप ग्रह 1 और 7 दोनों भावों में' },
    detailedDescription: {
      en: ['Alpayu (short life) Yoga is a health indicator when malefics straddle the ascendant axis. Health consciousness is essential. Jupiter\'s aspect or strong lagna lord significantly mitigates this yoga.'],
      hi: ['अल्पायु योग स्वास्थ्य का संकेतक है जब पाप ग्रह लग्न अक्ष पर हों। स्वास्थ्य जागरूकता आवश्यक है।'],
    },
    effects: [
      { area: { en: 'Health Vigilance', hi: 'स्वास्थ्य सतर्कता' }, description: { en: 'Need for health consciousness, regular medical check-ups.', hi: 'स्वास्थ्य जागरूकता की आवश्यकता, नियमित स्वास्थ्य जाँच।' } },
    ],
    relatedYogas: ['balarishta', 'arishta_bhanga', 'madhyayu'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
  },

  arishta_bhanga: {
    name: { en: 'Arishta Bhanga Yoga', hi: 'अरिष्ट भंग योग', sa: 'अरिष्टभङ्गयोगः' },
    category: 'other', isAuspicious: true, frequency: 15,
    formationRule: { en: 'Lagna lord in kendra in own or exalted sign', hi: 'लग्नेश केन्द्र में स्वराशि या उच्च राशि में' },
    detailedDescription: {
      en: ['Arishta Bhanga (cancellation of danger) Yoga is a protective yoga — a strong lagna lord in a kendra cancels all arishta (danger) yogas in the chart. It grants recovery from illness, accident survival, and overcoming adversity.'],
      hi: ['अरिष्ट भंग योग एक रक्षात्मक योग है — बलवान लग्नेश केन्द्र में सभी अरिष्ट योगों को निरस्त करता है।'],
    },
    effects: [
      { area: { en: 'Protection', hi: 'रक्षा' }, description: { en: 'Cancels danger yogas, recovery from illness, overcoming adversity.', hi: 'अरिष्ट योगों को निरस्त, रोग से स्वस्थता, विपत्ति पर विजय।' } },
    ],
    relatedYogas: ['balarishta', 'alpayu', 'mahabhagya'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
    ],
  },

  // Planet-placement yogas
  guru_mangal: {
    name: { en: 'Guru-Mangal Yoga', hi: 'गुरु-मंगल योग', sa: 'गुरुमङ्गलयोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Jupiter conjunct Mars', hi: 'गुरु-मंगल युति' },
    detailedDescription: {
      en: ['Guru-Mangal combines wisdom (Jupiter) with action (Mars) — courageous yet righteous, military/police leadership, land ownership, brothers prosper.'],
      hi: ['गुरु-मंगल ज्ञान (गुरु) को कर्म (मंगल) से जोड़ता है — साहसी पर धार्मिक, सैन्य नेतृत्व, भूमि स्वामित्व।'],
    },
    effects: [
      { area: { en: 'Wisdom + Action', hi: 'ज्ञान + कर्म' }, description: { en: 'Courageous yet righteous action, military/police success, land ownership.', hi: 'साहसी पर धार्मिक कर्म, सैन्य सफलता, भूमि स्वामित्व।' } },
    ],
    relatedYogas: ['ruchaka', 'hansa', 'gajakesari'],
    chartPositions: [
      { planetId: 4, house: 9, fromLagna: true },
      { planetId: 2, house: 9, fromLagna: true },
    ],
  },

  guru_shukra: {
    name: { en: 'Guru-Shukra Yoga', hi: 'गुरु-शुक्र योग', sa: 'गुरुशुक्रयोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Jupiter conjunct Venus', hi: 'गुरु-शुक्र युति' },
    detailedDescription: {
      en: ['Great benefic conjunction — wealth + wisdom combined, patronage of arts, generous and beautiful life. May indicate internal conflict between spiritual and material desires, since Jupiter (spirituality) and Venus (materialism) are natural enemies.'],
      hi: ['महान शुभ युति — धन + ज्ञान, कला संरक्षण, उदार और सुन्दर जीवन। आध्यात्मिक और भौतिक इच्छाओं में आन्तरिक द्वंद्व भी सम्भव।'],
    },
    effects: [
      { area: { en: 'Wealth + Wisdom', hi: 'धन + ज्ञान' }, description: { en: 'Art patronage, generous life, but possible spiritual-material tension.', hi: 'कला संरक्षण, उदार जीवन, पर आध्यात्मिक-भौतिक तनाव सम्भव।' } },
    ],
    relatedYogas: ['hansa', 'malavya', 'saraswati'],
    chartPositions: [
      { planetId: 4, house: 2, fromLagna: true },
      { planetId: 5, house: 2, fromLagna: true },
    ],
  },

  mars_saturn: {
    name: { en: 'Yama Yoga (Mars-Saturn)', hi: 'यम योग (मंगल-शनि)', sa: 'यमयोगः' },
    category: 'other', isAuspicious: false, frequency: 8,
    formationRule: { en: 'Mars conjunct Saturn', hi: 'मंगल-शनि युति' },
    detailedDescription: {
      en: ['Yama (god of death) energy — intense discipline or destructive frustration. Can excel in surgery, engineering, military, mining. Needs physical outlet for the compressed energy.'],
      hi: ['यम (मृत्यु देवता) ऊर्जा — तीव्र अनुशासन या विनाशकारी कुंठा। शल्यक्रिया, इंजीनियरिंग, सेना में उत्कृष्ट। शारीरिक निकास आवश्यक।'],
    },
    effects: [
      { area: { en: 'Discipline or Destruction', hi: 'अनुशासन या विनाश' }, description: { en: 'Intense discipline channelled into surgery, engineering, military.', hi: 'तीव्र अनुशासन शल्यक्रिया, इंजीनियरिंग, सेना में।' } },
    ],
    relatedYogas: ['angarak', 'ruchaka', 'shasha'],
    chartPositions: [
      { planetId: 2, house: 6, fromLagna: true },
      { planetId: 6, house: 6, fromLagna: true },
    ],
  },

  shukra_shani: {
    name: { en: 'Shukra-Shani Yoga', hi: 'शुक्र-शनि योग', sa: 'शुक्रशनियोगः' },
    category: 'other', isAuspicious: false, frequency: 8,
    formationRule: { en: 'Venus conjunct Saturn', hi: 'शुक्र-शनि युति' },
    detailedDescription: {
      en: ['Delayed romance, late marriage, but deeply loyal and lasting relationships. Artistic talent combined with disciplined execution produces craft mastery — the patient artist.'],
      hi: ['विलंबित प्रेम, देर से विवाह, पर गहरे वफादार और स्थायी सम्बन्ध। कला प्रतिभा + अनुशासित निष्पादन = शिल्प निपुणता।'],
    },
    effects: [
      { area: { en: 'Delayed but Lasting Love', hi: 'विलंबित पर स्थायी प्रेम' }, description: { en: 'Late marriage, deep loyalty, artistic mastery through discipline.', hi: 'देर से विवाह, गहरी वफादारी, अनुशासन से कलात्मक निपुणता।' } },
    ],
    relatedYogas: ['malavya', 'shasha', 'kalathra_dosha'],
    chartPositions: [
      { planetId: 5, house: 7, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
  },

  sun_saturn: {
    name: { en: 'Pitr-Shani Yoga', hi: 'पितृ-शनि योग', sa: 'पितृशनियोगः' },
    category: 'other', isAuspicious: false, frequency: 8,
    formationRule: { en: 'Sun conjunct Saturn', hi: 'सूर्य-शनि युति' },
    detailedDescription: {
      en: ['Father-son tension — struggles with authority figures, delayed recognition, but eventual rise through hard work. Government career after initial obstacles. The native must earn respect rather than inherit it.'],
      hi: ['पिता-पुत्र तनाव — अधिकारियों से संघर्ष, विलंबित मान्यता, पर कठिन परिश्रम से अंतिम उत्थान।'],
    },
    effects: [
      { area: { en: 'Authority Struggles', hi: 'अधिकार संघर्ष' }, description: { en: 'Struggles with authority, delayed recognition, eventual success through hard work.', hi: 'अधिकारियों से संघर्ष, विलंबित मान्यता, परिश्रम से अंतिम सफलता।' } },
    ],
    relatedYogas: ['pitra_dosha', 'shasha', 'surya_dasham'],
    chartPositions: [
      { planetId: 0, house: 10, fromLagna: true },
      { planetId: 6, house: 10, fromLagna: true },
    ],
  },

  // Quick entries for remaining identifiable yogas
  parijata: {
    name: { en: 'Parijata Yoga', hi: 'पारिजात योग', sa: 'पारिजातयोगः' },
    category: 'other', isAuspicious: true, frequency: 6,
    formationRule: { en: 'Lagna lord\'s dispositor is in own/exalted sign in kendra/trikona', hi: 'लग्नेश के अधिपति स्वराशि/उच्च में केन्द्र/त्रिकोण में' },
    detailedDescription: {
      en: ['Parijata (celestial tree) Yoga grants happiness increasing with age, like the mythical wish-fulfilling tree. A chain of strong planetary dispositors creates compound dignity.'],
      hi: ['पारिजात योग उम्र के साथ बढ़ता सुख प्रदान करता है, जैसे कल्पवृक्ष।'],
    },
    effects: [
      { area: { en: 'Increasing Happiness', hi: 'बढ़ता सुख' }, description: { en: 'Happiness increasing with age, compound blessings.', hi: 'उम्र के साथ बढ़ता सुख, संयुक्त आशीर्वाद।' } },
    ],
    relatedYogas: ['raja_yoga', 'parvata', 'lakshmi'],
    chartPositions: [
      { planetId: 2, house: 9, fromLagna: true },
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  varchasvi: {
    name: { en: 'Varchasvi Yoga', hi: 'वर्चस्वी योग', sa: 'वर्चस्वीयोगः' },
    category: 'moon_based', isAuspicious: true, frequency: 4,
    formationRule: { en: 'Moon in own sign aspected by Jupiter', hi: 'चन्द्र स्वराशि में बृहस्पति की दृष्टि' },
    detailedDescription: {
      en: ['Varchasvi (radiant lustre) Yoga creates a charismatic personality with magnetic appeal, emotional intelligence, and leadership through charm and wisdom.'],
      hi: ['वर्चस्वी योग करिश्माई व्यक्तित्व, चुम्बकीय आकर्षण और आकर्षण-ज्ञान से नेतृत्व बनाता है।'],
    },
    effects: [
      { area: { en: 'Charisma', hi: 'करिश्मा' }, description: { en: 'Magnetic personality, emotional intelligence, natural leadership.', hi: 'चुम्बकीय व्यक्तित्व, भावनात्मक बुद्धिमत्ता, स्वाभाविक नेतृत्व।' } },
    ],
    relatedYogas: ['gajakesari', 'amrita_yoga', 'pushkala_moon'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 10, fromLagna: true },
    ],
  },

  amrita_yoga: {
    name: { en: 'Amrita Yoga', hi: 'अमृत योग', sa: 'अमृतयोगः' },
    category: 'moon_based', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Moon conjunct benefic in kendra from Lagna', hi: 'चन्द्र लग्न से केन्द्र में शुभ ग्रह से युत' },
    detailedDescription: {
      en: ['Amrita (nectar) Yoga — Moon strengthened by benefic conjunction in kendra grants longevity, emotional harmony, public love, and healing ability.'],
      hi: ['अमृत योग — केन्द्र में शुभ युति से बलवान चन्द्र दीर्घायु, भावनात्मक सामंजस्य, जनप्रेम देता है।'],
    },
    effects: [
      { area: { en: 'Healing & Longevity', hi: 'उपचार और दीर्घायु' }, description: { en: 'Emotional harmony, public love, healing ability, longevity.', hi: 'भावनात्मक सामंजस्य, जनप्रेम, उपचार क्षमता, दीर्घायु।' } },
    ],
    relatedYogas: ['gajakesari', 'varchasvi', 'pushkala_moon'],
    chartPositions: [
      { planetId: 1, house: 4, fromLagna: true },
      { planetId: 4, house: 4, fromLagna: true },
    ],
  },

  chandradhi: {
    name: { en: 'Chandradhi Yoga', hi: 'चन्द्राधि योग', sa: 'चन्द्राधियोगः' },
    category: 'raja', isAuspicious: true, frequency: 3,
    formationRule: { en: 'Benefics in 6th, 7th, and 8th from Moon', hi: 'शुभ ग्रह चन्द्र से 6, 7, 8 में' },
    detailedDescription: {
      en: ['Moon-supremacy yoga — minister or leader, polite and trustworthy, defeats enemies, excellent health, long life. One of the strongest Moon-based Raja Yogas.'],
      hi: ['चन्द्र-श्रेष्ठता योग — मंत्री या नेता, विनम्र और विश्वसनीय, शत्रुओं पर विजय, उत्तम स्वास्थ्य, दीर्घायु।'],
    },
    effects: [
      { area: { en: 'Leadership & Health', hi: 'नेतृत्व और स्वास्थ्य' }, description: { en: 'Ministerial position, defeats enemies, excellent health.', hi: 'मंत्री पद, शत्रु पराजय, उत्तम स्वास्थ्य।' } },
    ],
    relatedYogas: ['adhi', 'gajakesari', 'adhi_moon_ext'],
    chartPositions: [
      { planetId: 3, house: 6, fromLagna: false },
      { planetId: 5, house: 7, fromLagna: false },
      { planetId: 4, house: 8, fromLagna: false },
    ],
  },

  tapasvi: {
    name: { en: 'Tapasvi Yoga', hi: 'तपस्वी योग', sa: 'तपस्वियोगः' },
    category: 'other', isAuspicious: true, frequency: 4,
    formationRule: { en: 'Moon in Capricorn/Aquarius aspected by Saturn', hi: 'चन्द्र मकर/कुम्भ में शनि की दृष्टि' },
    detailedDescription: {
      en: ['Tapasvi (ascetic) Yoga — deep austerity, detachment from material comforts, spiritual discipline, meditative temperament. The Moon under Saturn\'s influence creates a naturally renunciate disposition.'],
      hi: ['तपस्वी योग — गहन तपस्या, भौतिक सुखों से विरक्ति, आध्यात्मिक अनुशासन, ध्यानशील स्वभाव।'],
    },
    effects: [
      { area: { en: 'Spiritual Discipline', hi: 'आध्यात्मिक अनुशासन' }, description: { en: 'Natural austerity, meditative temperament, spiritual depth.', hi: 'प्राकृतिक तपस्या, ध्यानशील स्वभाव, आध्यात्मिक गहराई।' } },
    ],
    relatedYogas: ['pravrajya', 'parivraja', 'moksha_yoga', 'vairagyakarak'],
    chartPositions: [
      { planetId: 1, house: 10, fromLagna: true },
      { planetId: 6, house: 8, fromLagna: true },
    ],
  },

  moksha_yoga: {
    name: { en: 'Moksha Yoga', hi: 'मोक्ष योग', sa: 'मोक्षयोगः' },
    category: 'other', isAuspicious: true, frequency: 6,
    formationRule: { en: '12th lord in 1st or 9th, aspected by benefic', hi: 'व्ययेश 1 या 9 में, शुभ दृष्टि' },
    detailedDescription: {
      en: ['Moksha (liberation) Yoga indicates potential for spiritual liberation. The 12th lord (dissolution) in dharma houses (1st, 9th), blessed by benefics, transforms worldly detachment into spiritual achievement.'],
      hi: ['मोक्ष योग आध्यात्मिक मुक्ति की सम्भावना दर्शाता है। व्ययेश (विलय) धर्म भावों (1, 9) में शुभ आशीर्वाद से सांसारिक विरक्ति को आध्यात्मिक उपलब्धि में बदलता है।'],
    },
    effects: [
      { area: { en: 'Spiritual Liberation', hi: 'आध्यात्मिक मुक्ति' }, description: { en: 'Liberation potential, dharmic life leading to moksha.', hi: 'मुक्ति की सम्भावना, मोक्ष की ओर धार्मिक जीवन।' } },
    ],
    relatedYogas: ['tapasvi', 'pravrajya', 'ketu_twelfth', 'vairagyakarak'],
    chartPositions: [
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  bandhana: {
    name: { en: 'Bandhana Yoga', hi: 'बंधन योग', sa: 'बन्धनयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 5,
    formationRule: { en: 'Rahu, Saturn, Mars conjunct in kendra/trikona', hi: 'राहु, शनि, मंगल केन्द्र/त्रिकोण में युत' },
    detailedDescription: {
      en: ['Bandhana (imprisonment/bondage) Yoga — restriction of freedom, legal entanglements, confinement. Can manifest as feeling trapped in life circumstances, debt bondage, or actual legal issues.'],
      hi: ['बंधन योग — स्वतंत्रता का प्रतिबंध, कानूनी उलझन, कारावास। जीवन परिस्थितियों में फँसा महसूस करने के रूप में प्रकट हो सकता है।'],
    },
    effects: [
      { area: { en: 'Restriction', hi: 'प्रतिबंध' }, description: { en: 'Legal entanglements, feeling trapped, restriction of freedom.', hi: 'कानूनी उलझन, फँसा महसूस करना, स्वतंत्रता का प्रतिबंध।' } },
    ],
    relatedYogas: ['shrapit_dosha', 'shani_rahu', 'angarak'],
    chartPositions: [
      { planetId: 7, house: 5, fromLagna: true },
      { planetId: 6, house: 5, fromLagna: true },
      { planetId: 2, house: 5, fromLagna: true },
      { planetId: 8, house: 11, fromLagna: true },
    ],
  },

  // Nabhasa Akriti (geometric shape) Yogas
  mala_nabhasa: {
    name: { en: 'Mala Yoga (Nabhasa)', hi: 'माला योग (नभस)', sa: 'मालायोगः' },
    category: 'other', isAuspicious: true, frequency: 2,
    formationRule: { en: 'Benefics in 3 kendras, malefics in 3rd/6th/11th only', hi: 'शुभ ग्रह 3 केन्द्रों में, पाप केवल 3/6/11 में' },
    detailedDescription: {
      en: ['Mala (garland) Yoga — benefics adorning the angular houses grant fame, happiness, and comfort like a garland of flowers. This Nabhasa yoga is quite rare and highly auspicious.'],
      hi: ['माला योग — शुभ ग्रह केन्द्रों में पुष्पमाला सम यश, सुख और समृद्धि देते हैं।'],
    },
    effects: [
      { area: { en: 'Garland of Blessings', hi: 'आशीर्वाद की माला' }, description: { en: 'Fame, happiness, comfort — like being adorned with flowers.', hi: 'यश, सुख, आराम — पुष्पमाला से सुशोभित।' } },
    ],
    relatedYogas: ['sarpa_nabhasa', 'ardha_chandra_nabhasa', 'chhatra_nabhasa'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 3, house: 7, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 6, house: 6, fromLagna: true },
    ],
  },

  sarpa_nabhasa: {
    name: { en: 'Sarpa Yoga (Nabhasa)', hi: 'सर्प योग (नभस)', sa: 'सर्पयोगः' },
    category: 'inauspicious', isAuspicious: false, frequency: 2,
    formationRule: { en: 'Malefics in 3 kendras, benefics in 3rd/6th/11th only', hi: 'पाप ग्रह 3 केन्द्रों में, शुभ केवल 3/6/11 में' },
    detailedDescription: {
      en: ['Sarpa (serpent) Yoga — malefics dominating angular houses bring struggles, deception, and suffering like a coiled snake. The opposite of Mala Yoga.'],
      hi: ['सर्प योग — पाप ग्रह केन्द्रों में कुण्डलित सर्प सम संघर्ष, छल और कष्ट देते हैं।'],
    },
    effects: [
      { area: { en: 'Struggles', hi: 'संघर्ष' }, description: { en: 'Deception, suffering, malefic domination of key houses.', hi: 'छल, कष्ट, प्रमुख भावों पर पाप प्रभुत्व।' } },
    ],
    relatedYogas: ['mala_nabhasa', 'kala_sarpa', 'papa_kartari'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
      { planetId: 6, house: 4, fromLagna: true },
      { planetId: 0, house: 7, fromLagna: true },
      { planetId: 4, house: 3, fromLagna: true },
      { planetId: 5, house: 6, fromLagna: true },
    ],
  },

  ardha_chandra_nabhasa: {
    name: { en: 'Ardha-Chandra Yoga (Nabhasa)', hi: 'अर्धचन्द्र योग (नभस)', sa: 'अर्धचन्द्रयोगः' },
    category: 'other', isAuspicious: true, frequency: 1,
    formationRule: { en: 'All 7 planets in 7 consecutive houses, each occupied', hi: 'सभी 7 ग्रह 7 क्रमागत भावों में, प्रत्येक में ग्रह' },
    detailedDescription: {
      en: ['Ardha-Chandra (half-moon) — beautiful appearance, popular leader, natural commander, military or political eminence. Very rare geometric pattern.'],
      hi: ['अर्धचन्द्र — सुन्दर रूप, लोकप्रिय नेता, सैन्य या राजनीतिक प्रतिष्ठा। अत्यंत दुर्लभ ज्यामितीय पैटर्न।'],
    },
    effects: [
      { area: { en: 'Leadership & Beauty', hi: 'नेतृत्व और सौन्दर्य' }, description: { en: 'Beautiful appearance, military/political eminence.', hi: 'सुन्दर रूप, सैन्य/राजनीतिक प्रतिष्ठा।' } },
    ],
    relatedYogas: ['chhatra_nabhasa', 'nauka_nabhasa', 'graha_malika'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 2, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 4, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 6, fromLagna: true },
      { planetId: 6, house: 7, fromLagna: true },
    ],
  },

  // Navamsha yogas
  vargottama_lagna: {
    name: { en: 'Vargottama Lagna', hi: 'वर्गोत्तम लग्न', sa: 'वर्गोत्तमलग्नम्' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Ascendant in the same sign in both D1 (Rashi) and D9 (Navamsha)', hi: 'लग्न D1 और D9 दोनों में एक ही राशि में' },
    detailedDescription: {
      en: ['Vargottama Lagna doubles the ascendant\'s strength — the same sign in both rashi and navamsha charts. This grants strong self-identity, resilience, and clear life direction. It is one of the simplest yet most powerful positive indicators.'],
      hi: ['वर्गोत्तम लग्न लग्न की शक्ति दोगुनी करता है — राशि और नवांश दोनों में एक ही राशि। यह मजबूत आत्म-पहचान और स्पष्ट जीवन दिशा देता है।'],
    },
    effects: [
      { area: { en: 'Self-Identity', hi: 'आत्म-पहचान' }, description: { en: 'Strong self-identity, resilience, clear life direction.', hi: 'मजबूत आत्म-पहचान, सहनशक्ति, स्पष्ट जीवन दिशा।' } },
    ],
    relatedYogas: ['pushkara_navamsha_yoga', 'navamsha_parivartana'],
    chartPositions: [
      { planetId: 2, house: 1, fromLagna: true },
    ],
  },

  venus_7th: {
    name: { en: 'Venus in 7th Yoga', hi: 'शुक्र सप्तम योग', sa: 'शुक्रसप्तमयोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Venus in the 7th house', hi: 'शुक्र 7वें भाव में' },
    detailedDescription: {
      en: ['Venus (karaka of marriage) in the house of marriage — beautiful spouse, happy married life, artistic partner. One of the best placements for relationship harmony.'],
      hi: ['शुक्र (विवाह कारक) विवाह भाव में — सुन्दर जीवनसाथी, सुखी वैवाहिक जीवन, कलात्मक साथी।'],
    },
    effects: [
      { area: { en: 'Happy Marriage', hi: 'सुखी विवाह' }, description: { en: 'Beautiful spouse, harmonious marriage, artistic partner.', hi: 'सुन्दर जीवनसाथी, सामंजस्यपूर्ण विवाह।' } },
    ],
    relatedYogas: ['malavya', 'gauri', 'kalathra_dosha'],
    chartPositions: [
      { planetId: 5, house: 7, fromLagna: true },
    ],
  },

  surya_dasham: {
    name: { en: 'Surya Dasham Yoga', hi: 'सूर्य दशम योग', sa: 'सूर्यदशमयोगः' },
    category: 'raja', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Sun in 10th house (maximum Dig Bala)', hi: 'सूर्य 10वें भाव में (अधिकतम दिग्बल)' },
    detailedDescription: {
      en: ['Sun at the zenith of the chart — maximum directional strength. Government authority, leadership, fame in profession, and a prominent father are typical results.'],
      hi: ['सूर्य चार्ट के शिखर पर — अधिकतम दिग्बल। सरकारी अधिकार, नेतृत्व, व्यावसायिक यश।'],
    },
    effects: [
      { area: { en: 'Government Authority', hi: 'सरकारी अधिकार' }, description: { en: 'Government service, leadership, fame in profession.', hi: 'सरकारी सेवा, नेतृत्व, व्यावसायिक यश।' } },
    ],
    relatedYogas: ['raja_yoga', 'mangal_dasham', 'shani_dasham'],
    chartPositions: [
      { planetId: 0, house: 10, fromLagna: true },
    ],
  },

  shani_dasham: {
    name: { en: 'Shani Dasham Yoga', hi: 'शनि दशम योग', sa: 'शनिदशमयोगः' },
    category: 'raja', isAuspicious: true, frequency: 7,
    formationRule: { en: 'Saturn in 10th house (not debilitated)', hi: 'शनि 10वें भाव में (नीच नहीं)' },
    detailedDescription: {
      en: ['Saturn in the house of career — slow but steady rise to authority through discipline, hard work, and public service. Industrial leaders, administrators, and judges often have this placement.'],
      hi: ['शनि करियर भाव में — अनुशासन और परिश्रम से धीमी लेकिन स्थिर उन्नति।'],
    },
    effects: [
      { area: { en: 'Steady Career Rise', hi: 'स्थिर करियर उत्थान' }, description: { en: 'Slow but steady authority through discipline and hard work.', hi: 'अनुशासन और परिश्रम से धीमा पर स्थिर अधिकार।' } },
    ],
    relatedYogas: ['shasha', 'surya_dasham', 'raja_yoga'],
    chartPositions: [
      { planetId: 6, house: 10, fromLagna: true },
    ],
  },

  mangal_dasham: {
    name: { en: 'Mangal Dasham Yoga', hi: 'मंगल दशम योग', sa: 'मङ्गलदशमयोगः' },
    category: 'raja', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Mars in 10th house', hi: 'मंगल 10वें भाव में' },
    detailedDescription: {
      en: ['Mars with directional strength in the career house — engineering, surgery, military, sports, and property development careers are favoured.'],
      hi: ['मंगल करियर भाव में दिग्बल — इंजीनियरिंग, शल्यक्रिया, सेना, खेल करियर।'],
    },
    effects: [
      { area: { en: 'Technical Career', hi: 'तकनीकी करियर' }, description: { en: 'Engineering, surgery, military, sports success.', hi: 'इंजीनियरिंग, शल्यक्रिया, सेना, खेल सफलता।' } },
    ],
    relatedYogas: ['ruchaka', 'surya_dasham', 'raja_yoga'],
    chartPositions: [
      { planetId: 2, house: 10, fromLagna: true },
    ],
  },

  ketu_twelfth: {
    name: { en: 'Ketu in 12th (Moksha Yoga)', hi: 'केतु द्वादश (मोक्ष योग)', sa: 'केतुद्वादशमोक्षयोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Ketu in 12th house', hi: 'केतु 12वें भाव में' },
    detailedDescription: {
      en: ['Ketu (detachment) in the house of liberation — natural spiritual inclination, meditation ability, past-life spiritual merit. May also indicate foreign residence.'],
      hi: ['केतु (विरक्ति) मोक्ष भाव में — स्वाभाविक आध्यात्मिक प्रवृत्ति, ध्यान क्षमता, पूर्वजन्म आध्यात्मिक पुण्य।'],
    },
    effects: [
      { area: { en: 'Spiritual Liberation', hi: 'आध्यात्मिक मुक्ति' }, description: { en: 'Natural meditation ability, spiritual inclination, possible foreign residence.', hi: 'प्राकृतिक ध्यान क्षमता, आध्यात्मिक प्रवृत्ति, सम्भव विदेश निवास।' } },
    ],
    relatedYogas: ['moksha_yoga', 'tapasvi', 'vairagyakarak'],
    chartPositions: [
      { planetId: 8, house: 12, fromLagna: true },
      { planetId: 7, house: 6, fromLagna: true },
    ],
  },

  saubhagya: {
    name: { en: 'Saubhagya Yoga', hi: 'सौभाग्य योग', sa: 'सौभाग्ययोगः' },
    category: 'raja', isAuspicious: true, frequency: 4,
    formationRule: { en: '3+ benefics in kendra houses', hi: '3+ शुभ ग्रह केन्द्र भावों में' },
    detailedDescription: {
      en: ['Multiple benefics in angular houses — great fortune, divine protection, life flows smoothly. Surrounded by goodness in all four directions of the chart.'],
      hi: ['अनेक शुभ ग्रह केन्द्रों में — महान भाग्य, दिव्य रक्षा, जीवन सुचारू रूप से।'],
    },
    effects: [
      { area: { en: 'Divine Protection', hi: 'दिव्य रक्षा' }, description: { en: 'Great fortune, divine protection, smooth life.', hi: 'महान भाग्य, दिव्य रक्षा, सुचारू जीवन।' } },
    ],
    relatedYogas: ['chatussagara', 'chaturmukha', 'mahabhagya'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 3, house: 10, fromLagna: true },
    ],
  },

  chaturmukha: {
    name: { en: 'Chaturmukha Yoga', hi: 'चतुर्मुख योग', sa: 'चतुर्मुखयोगः' },
    category: 'raja', isAuspicious: true, frequency: 2,
    formationRule: { en: 'Benefic planet in each of the 4 kendras (1,4,7,10)', hi: 'प्रत्येक 4 केन्द्र में शुभ ग्रह' },
    detailedDescription: {
      en: ['Chaturmukha (four-faced, like Brahma) Yoga — supremely fortunate, fame in all four directions, devotion to dharma, long life exceeding 96 years according to classical texts.'],
      hi: ['चतुर्मुख (ब्रह्मा की तरह चार-मुखी) योग — अत्यंत भाग्यशाली, चारों दिशाओं में यश, शास्त्रीय ग्रन्थों के अनुसार 96+ वर्ष आयु।'],
    },
    effects: [
      { area: { en: 'Supreme Fortune', hi: 'सर्वोच्च भाग्य' }, description: { en: 'Fame in all directions, long life, supreme fortune.', hi: 'चारों दिशाओं में यश, दीर्घायु, सर्वोच्च भाग्य।' } },
    ],
    relatedYogas: ['chatussagara', 'saubhagya', 'mahabhagya'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 3, house: 7, fromLagna: true },
      { planetId: 1, house: 10, fromLagna: true },
    ],
  },

  shiva_yoga: {
    name: { en: 'Shiva Yoga', hi: 'शिव योग', sa: 'शिवयोगः' },
    category: 'raja', isAuspicious: true, frequency: 3,
    formationRule: { en: 'Sun + Moon + Jupiter conjunct', hi: 'सूर्य + चन्द्र + गुरु युत' },
    detailedDescription: {
      en: ['Trident energy of consciousness — supreme spiritual authority, blessed by divine grace, teacher of teachers, regal bearing with compassion. The three most important celestial bodies united.'],
      hi: ['चेतना की त्रिशूल ऊर्जा — सर्वोच्च आध्यात्मिक अधिकार, दिव्य कृपा, गुरुओं के गुरु, करुणा के साथ राजसी आचरण।'],
    },
    effects: [
      { area: { en: 'Supreme Spiritual Authority', hi: 'सर्वोच्च आध्यात्मिक अधिकार' }, description: { en: 'Divine grace, teacher of teachers, spiritual and worldly authority.', hi: 'दिव्य कृपा, गुरुओं के गुरु, आध्यात्मिक और सांसारिक अधिकार।' } },
    ],
    relatedYogas: ['hansa', 'gajakesari', 'mahabhagya'],
    chartPositions: [
      { planetId: 0, house: 9, fromLagna: true },
      { planetId: 1, house: 9, fromLagna: true },
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  kala_amrita: {
    name: { en: 'Kala Amrita Yoga', hi: 'काल अमृत योग', sa: 'कालामृतयोगः' },
    category: 'other', isAuspicious: true, frequency: 5,
    formationRule: { en: 'All planets between Sun-Moon axis (not Rahu-Ketu axis)', hi: 'सभी ग्रह सूर्य-चन्द्र अक्ष में' },
    detailedDescription: {
      en: ['Kala Amrita (time-nectar) — all planets contained within Sun-Moon arc. Similar to Kala Sarpa but with luminaries instead of nodes. Focused energy, spiritual potential, and destined for meaningful achievements.'],
      hi: ['काल अमृत — सभी ग्रह सूर्य-चन्द्र चाप में। काल सर्प जैसा पर ग्रन्थियों के बजाय प्रकाशमान ग्रहों के साथ। केन्द्रित ऊर्जा, आध्यात्मिक क्षमता।'],
    },
    effects: [
      { area: { en: 'Focused Purpose', hi: 'केन्द्रित उद्देश्य' }, description: { en: 'Concentrated energy, spiritual potential, meaningful achievements.', hi: 'केन्द्रित ऊर्जा, आध्यात्मिक क्षमता, सार्थक उपलब्धियाँ।' } },
    ],
    relatedYogas: ['kala_sarpa', 'shiva_yoga'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 7, fromLagna: true },
      { planetId: 2, house: 3, fromLagna: true },
      { planetId: 3, house: 2, fromLagna: true },
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 5, house: 4, fromLagna: true },
      { planetId: 6, house: 6, fromLagna: true },
    ],
  },

  tri_vakri: {
    name: { en: 'Tri-Vakri Yoga', hi: 'त्रि-वक्री योग', sa: 'त्रिवक्रीयोगः' },
    category: 'other', isAuspicious: false, frequency: 10,
    formationRule: { en: '3+ planets retrograde at birth', hi: 'जन्म पर 3+ ग्रह वक्री' },
    detailedDescription: {
      en: ['Multiple retrograde planets — internalised energy, delayed results, unconventional life path. Karmic intensity from past lives. These natives often succeed later in life after a period of inner development.'],
      hi: ['अनेक वक्री ग्रह — आंतरिक ऊर्जा, विलंबित परिणाम, अपरंपरागत जीवन पथ। पूर्वजन्मों से कार्मिक तीव्रता।'],
    },
    effects: [
      { area: { en: 'Delayed Success', hi: 'विलंबित सफलता' }, description: { en: 'Internalized energy, unconventional path, success later in life.', hi: 'आंतरिक ऊर्जा, अपरंपरागत मार्ग, जीवन में बाद में सफलता।' } },
    ],
    relatedYogas: ['kala_sarpa', 'shakata'],
    chartPositions: [
      { planetId: 3, house: 2, fromLagna: true },
      { planetId: 4, house: 7, fromLagna: true },
      { planetId: 6, house: 9, fromLagna: true },
    ],
  },

  // Additional wealth yogas
  kalanidhi: {
    name: { en: 'Kalanidhi Yoga', hi: 'कलानिधि योग', sa: 'कलानिधियोगः' },
    category: 'wealth', isAuspicious: true, frequency: 3,
    formationRule: { en: 'Jupiter in 2nd/5th with Mercury and Venus in conjunction/aspect', hi: 'बृहस्पति 2/5 में बुध और शुक्र से सम्बन्ध' },
    detailedDescription: {
      en: ['Kalanidhi (treasure of arts) Yoga — patronage of fine arts, wealth through creative pursuits, scholarly reputation, refined taste and culture.'],
      hi: ['कलानिधि योग — ललित कलाओं का संरक्षण, सृजनात्मक कार्यों से धन, विद्वत् प्रतिष्ठा।'],
    },
    effects: [
      { area: { en: 'Artistic Wealth', hi: 'कलात्मक धन' }, description: { en: 'Wealth through arts, scholarly reputation, refined culture.', hi: 'कलाओं से धन, विद्वत् प्रतिष्ठा, परिष्कृत संस्कृति।' } },
    ],
    relatedYogas: ['saraswati', 'lakshmi', 'mahalakshmi'],
    chartPositions: [
      { planetId: 4, house: 5, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
      { planetId: 5, house: 5, fromLagna: true },
    ],
  },

  mahalakshmi: {
    name: { en: 'Mahalakshmi Yoga', hi: 'महालक्ष्मी योग', sa: 'महालक्ष्मीयोगः' },
    category: 'wealth', isAuspicious: true, frequency: 3,
    formationRule: { en: 'Venus in own sign in 2nd/11th, aspected by Jupiter', hi: 'शुक्र स्वराशि में 2/11 में, बृहस्पति दृष्टि' },
    detailedDescription: {
      en: ['Blessings of Mahalakshmi — permanent wealth, luxury, beautiful surroundings, happy marriage. Venus dignified in a wealth house with Jupiter\'s wisdom creates the most stable form of material prosperity.'],
      hi: ['महालक्ष्मी की कृपा — स्थायी धन, विलासिता, सुन्दर परिवेश, सुखी विवाह।'],
    },
    effects: [
      { area: { en: 'Permanent Luxury', hi: 'स्थायी विलासिता' }, description: { en: 'Permanent wealth, luxury, beautiful surroundings.', hi: 'स्थायी धन, विलासिता, सुन्दर परिवेश।' } },
    ],
    relatedYogas: ['lakshmi', 'dhana_yoga', 'malavya'],
    chartPositions: [
      { planetId: 5, house: 2, fromLagna: true },
      { planetId: 4, house: 10, fromLagna: true },
    ],
  },

  bhagya_yoga: {
    name: { en: 'Bhagya Yoga', hi: 'भाग्य योग', sa: 'भाग्ययोगः' },
    category: 'wealth', isAuspicious: true, frequency: 3,
    formationRule: { en: '9th lord in 9th house in own sign', hi: 'नवमेश 9वें भाव में स्वराशि में' },
    detailedDescription: {
      en: ['Supreme fortune — 9th lord at home amplifies luck. Father prosperous, divine blessings, pilgrimage, righteous wealth. One of the most auspicious placements for the fortune lord.'],
      hi: ['सर्वोच्च भाग्य — नवमेश स्वभाव में भाग्य प्रबल, पिता समृद्ध, दिव्य आशीर्वाद।'],
    },
    effects: [
      { area: { en: 'Supreme Fortune', hi: 'सर्वोच्च भाग्य' }, description: { en: 'Amplified luck, prosperous father, divine blessings.', hi: 'प्रबल भाग्य, समृद्ध पिता, दिव्य आशीर्वाद।' } },
    ],
    relatedYogas: ['lakshmi', 'dharma_karmadhipati', 'mahabhagya'],
    chartPositions: [
      { planetId: 4, house: 9, fromLagna: true },
    ],
  },

  // Remaining essential yogas
  rahu_third: {
    name: { en: 'Rahu in 3rd Yoga', hi: 'राहु तृतीय योग', sa: 'राहुतृतीययोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Rahu in 3rd house (upachaya)', hi: 'राहु 3वें भाव (उपचय) में' },
    detailedDescription: {
      en: ['Rahu in the house of courage — extraordinary daring, unconventional communication, success through bold ventures. Excellent for media, technology, and writing careers.'],
      hi: ['राहु साहस भाव में — असाधारण साहस, अपरंपरागत संचार, मीडिया और तकनीक में सफलता।'],
    },
    effects: [
      { area: { en: 'Bold Ventures', hi: 'साहसिक उद्यम' }, description: { en: 'Extraordinary daring, media/tech success, bold ventures.', hi: 'असाधारण साहस, मीडिया/तकनीक सफलता।' } },
    ],
    relatedYogas: ['kala_sarpa', 'angarak'],
    chartPositions: [
      { planetId: 7, house: 3, fromLagna: true },
      { planetId: 8, house: 9, fromLagna: true },
    ],
  },

  guru_lagna: {
    name: { en: 'Guru in Lagna Yoga', hi: 'गुरु लग्न योग', sa: 'गुरुलग्नयोगः' },
    category: 'other', isAuspicious: true, frequency: 8,
    formationRule: { en: 'Jupiter in 1st house', hi: 'गुरु लग्न में' },
    detailedDescription: {
      en: ['Jupiter in the ascendant — wisdom, divine grace, generous nature, respected in society. One of the best planetary placements, granting the native a naturally ethical and philosophical approach to life.'],
      hi: ['गुरु लग्न में — ज्ञान, दैवी कृपा, उदार स्वभाव, समाज में सम्मान।'],
    },
    effects: [
      { area: { en: 'Wisdom & Grace', hi: 'ज्ञान और कृपा' }, description: { en: 'Divine grace, generous nature, philosophical outlook.', hi: 'दैवी कृपा, उदार स्वभाव, दार्शनिक दृष्टिकोण।' } },
    ],
    relatedYogas: ['hansa', 'gajakesari', 'shiva_yoga'],
    chartPositions: [
      { planetId: 4, house: 1, fromLagna: true },
    ],
  },

  chandra_surya: {
    name: { en: 'Chandra-Surya Yoga (Amavasya)', hi: 'चन्द्र-सूर्य योग (अमावस्या)', sa: 'चन्द्रसूर्ययोगः' },
    category: 'moon_based', isAuspicious: false, frequency: 8,
    formationRule: { en: 'Sun and Moon in the same sign (new Moon birth)', hi: 'सूर्य और चन्द्र एक ही राशि में (अमावस्या जन्म)' },
    detailedDescription: {
      en: ['New Moon birth — Moon weakened by solar proximity. Emotional struggles and introspective nature, but concentrated willpower and spiritual depth. The darkness of Amavasya holds great inner power.'],
      hi: ['अमावस्या जन्म — सौर सान्निध्य से चन्द्र दुर्बल। भावनात्मक संघर्ष, पर एकाग्र इच्छाशक्ति और आध्यात्मिक गहराई।'],
    },
    effects: [
      { area: { en: 'Inner Power', hi: 'आन्तरिक शक्ति' }, description: { en: 'Concentrated willpower, spiritual depth, introspective nature.', hi: 'एकाग्र इच्छाशक्ति, आध्यात्मिक गहराई, अन्तर्मुखी स्वभाव।' } },
    ],
    relatedYogas: ['kemadruma', 'grahan'],
    chartPositions: [
      { planetId: 0, house: 5, fromLagna: true },
      { planetId: 1, house: 5, fromLagna: true },
    ],
  },

  shoola_nabhasa: {
    name: { en: 'Shoola Yoga (Nabhasa)', hi: 'शूल योग (नभस)', sa: 'शूलयोगः' },
    category: 'other', isAuspicious: false, frequency: 3,
    formationRule: { en: 'Planets in 3 signs', hi: 'ग्रह 3 राशियों में' },
    detailedDescription: {
      en: ['Shoola (trident) — sharp focus but extremes in fortune, aggressive nature, potential for conflict but concentrated power. Like Shiva\'s trident, it destroys and creates.'],
      hi: ['शूल (त्रिशूल) — तीव्र एकाग्रता पर भाग्य के उतार-चढ़ाव, आक्रामक स्वभाव, पर केन्द्रित शक्ति।'],
    },
    effects: [
      { area: { en: 'Concentrated Power', hi: 'केन्द्रित शक्ति' }, description: { en: 'Sharp focus, extremes in fortune, concentrated energy.', hi: 'तीव्र एकाग्रता, भाग्य में उतार-चढ़ाव, केन्द्रित ऊर्जा।' } },
    ],
    relatedYogas: ['gola', 'yuga', 'kedara'],
    chartPositions: [
      { planetId: 0, house: 1, fromLagna: true },
      { planetId: 1, house: 1, fromLagna: true },
      { planetId: 2, house: 5, fromLagna: true },
      { planetId: 3, house: 5, fromLagna: true },
      { planetId: 4, house: 9, fromLagna: true },
      { planetId: 5, house: 9, fromLagna: true },
      { planetId: 6, house: 1, fromLagna: true },
    ],
  },

};

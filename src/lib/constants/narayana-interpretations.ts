/**
 * Narayana Dasha Sign Interpretations
 * Reference: BPHS Ch.19, Jaimini Sutras, PVR Narasimha Rao
 *
 * Each sign-dasha activates the themes of that sign and the houses
 * it rules from the natal Lagna. These are general sign-level
 * interpretations; house-from-lagna context should be overlaid by
 * the consuming component.
 */

export interface NarayanaDashaInterpretation {
  signId: number;  // 1-12
  themes: { en: string; hi: string };
  focus: { en: string; hi: string };
  caution: { en: string; hi: string };
}

export const NARAYANA_INTERPRETATIONS: NarayanaDashaInterpretation[] = [
  // ─── ARIES (1) ───────────────────────────────────────────────────────────────
  {
    signId: 1,
    themes: {
      en: 'Aries dasha activates themes of independence, initiative, and new beginnings. This is a period of asserting the self, taking decisive action, and pursuing individual goals with vigor. Physical vitality and courage are heightened.',
      hi: 'मेष दशा स्वतंत्रता, पहल और नवारम्भ के विषयों को सक्रिय करती है। यह आत्म-स्थापना, निर्णायक कार्यवाही और व्यक्तिगत लक्ष्यों को ऊर्जा से अनुसरण करने का काल है। शारीरिक ऊर्जा और साहस बढ़ता है।',
    },
    focus: {
      en: 'Primary focus falls on personal identity, physical body, and leadership roles — launching new ventures and establishing one\'s mark in the world.',
      hi: 'प्राथमिक ध्यान व्यक्तिगत पहचान, शारीरिक देह और नेतृत्व भूमिकाओं पर रहता है — नए उपक्रम आरम्भ करना और संसार में अपनी छाप छोड़ना।',
    },
    caution: {
      en: 'Guard against impulsiveness, aggression, and rushing into commitments without sufficient planning — haste can create conflicts that linger.',
      hi: 'आवेग, आक्रामकता और पर्याप्त योजना के बिना प्रतिबद्धताओं में शीघ्रता से सावधान रहें — जल्दबाज़ी से स्थायी विवाद उत्पन्न हो सकते हैं।',
    },
  },

  // ─── TAURUS (2) ──────────────────────────────────────────────────────────────
  {
    signId: 2,
    themes: {
      en: 'Taurus dasha brings focus to wealth accumulation, family life, and sensory enjoyment. This period favors building material security, strengthening family bonds, and refining personal values. Artistic pursuits and luxuries attract attention.',
      hi: 'वृषभ दशा धन संचय, पारिवारिक जीवन और इन्द्रिय सुख पर ध्यान केन्द्रित करती है। यह काल भौतिक सुरक्षा निर्माण, पारिवारिक बन्धनों को सुदृढ़ करने और व्यक्तिगत मूल्यों को परिष्कृत करने के लिए अनुकूल है।',
    },
    focus: {
      en: 'Primary focus falls on finances, speech, family heritage, and the accumulation of resources that provide lasting stability.',
      hi: 'प्राथमिक ध्यान वित्त, वाणी, पारिवारिक धरोहर और स्थायी स्थिरता प्रदान करने वाले संसाधनों के संचय पर रहता है।',
    },
    caution: {
      en: 'Watch for stubbornness, over-attachment to possessions, and resistance to necessary change — comfort zones can become stagnation traps.',
      hi: 'हठधर्मिता, सम्पत्ति से अति-आसक्ति और आवश्यक परिवर्तन का प्रतिरोध — सुविधा क्षेत्र ठहराव के जाल बन सकते हैं।',
    },
  },

  // ─── GEMINI (3) ──────────────────────────────────────────────────────────────
  {
    signId: 3,
    themes: {
      en: 'Gemini dasha activates communication, learning, and short journeys. Intellectual curiosity peaks, siblings and neighbors become significant, and multi-tasking defines the rhythm of life. Writing, commerce, and skills training are favored.',
      hi: 'मिथुन दशा संवाद, शिक्षा और लघु यात्राओं को सक्रिय करती है। बौद्धिक जिज्ञासा चरम पर होती है, भाई-बहन और पड़ोसी महत्वपूर्ण बनते हैं। लेखन, वाणिज्य और कौशल प्रशिक्षण अनुकूल हैं।',
    },
    focus: {
      en: 'Primary focus falls on communication skills, local connections, courage in expression, and the exchange of ideas through multiple channels.',
      hi: 'प्राथमिक ध्यान संवाद कौशल, स्थानीय सम्पर्क, अभिव्यक्ति में साहस और अनेक माध्यमों से विचार-विनिमय पर रहता है।',
    },
    caution: {
      en: 'Beware of scattered energy, superficial commitments, and gossip — depth may be sacrificed for breadth during this period.',
      hi: 'बिखरी ऊर्जा, सतही प्रतिबद्धताओं और अफ़वाहों से सावधान रहें — इस काल में गहराई चौड़ाई के लिए बलिदान हो सकती है।',
    },
  },

  // ─── CANCER (4) ──────────────────────────────────────────────────────────────
  {
    signId: 4,
    themes: {
      en: 'Cancer dasha activates home, mother, emotional security, and inner peace. Property matters, vehicles, and domestic comfort become central concerns. The native seeks emotional roots and may renovate, relocate, or deepen family ties.',
      hi: 'कर्क दशा गृह, माता, भावनात्मक सुरक्षा और आन्तरिक शान्ति को सक्रिय करती है। सम्पत्ति, वाहन और घरेलू सुविधा केन्द्रीय चिन्ता बनती है। जातक भावनात्मक जड़ें खोजता है और गृह-नवीनीकरण या स्थानान्तरण हो सकता है।',
    },
    focus: {
      en: 'Primary focus falls on emotional well-being, domestic environment, mother\'s health, and establishing a secure personal foundation.',
      hi: 'प्राथमिक ध्यान भावनात्मक कल्याण, घरेलू वातावरण, माता के स्वास्थ्य और सुरक्षित व्यक्तिगत आधार स्थापित करने पर रहता है।',
    },
    caution: {
      en: 'Guard against excessive sentimentality, clinginess, and letting emotional turbulence cloud practical decisions.',
      hi: 'अत्यधिक भावुकता, आसक्ति और भावनात्मक उथल-पुथल को व्यावहारिक निर्णयों पर हावी होने से बचाएँ।',
    },
  },

  // ─── LEO (5) ─────────────────────────────────────────────────────────────────
  {
    signId: 5,
    themes: {
      en: 'Leo dasha activates creativity, children, romance, and self-expression. This is a vibrant period for artistic endeavors, speculative gains, and joyful pursuits. Authority, recognition, and political involvement may increase substantially.',
      hi: 'सिंह दशा रचनात्मकता, संतान, प्रेम और आत्माभिव्यक्ति को सक्रिय करती है। यह कलात्मक प्रयासों, सट्टा लाभ और आनन्दमय गतिविधियों के लिए जीवन्त काल है। अधिकार, मान्यता और राजनीतिक सहभागिता बढ़ सकती है।',
    },
    focus: {
      en: 'Primary focus falls on creative output, children\'s welfare, romantic fulfillment, and gaining public recognition through personal talent.',
      hi: 'प्राथमिक ध्यान रचनात्मक उत्पादन, संतान कल्याण, प्रेम पूर्ति और व्यक्तिगत प्रतिभा से सार्वजनिक मान्यता प्राप्ति पर रहता है।',
    },
    caution: {
      en: 'Watch for excessive pride, risky speculation, and ego-driven conflicts — the desire for applause can override better judgment.',
      hi: 'अत्यधिक अहंकार, जोखिमपूर्ण सट्टा और अहम्-जनित विवादों से सावधान — प्रशंसा की लालसा विवेक पर भारी पड़ सकती है।',
    },
  },

  // ─── VIRGO (6) ────────────────────────────────────────────────────────────────
  {
    signId: 6,
    themes: {
      en: 'Virgo dasha brings focus to health, daily routines, service, and problem-solving. Enemies or competitors may surface, requiring strategic response. Debts and legal matters need attention. Medical treatment and health optimization are highlighted.',
      hi: 'कन्या दशा स्वास्थ्य, दैनिक दिनचर्या, सेवा और समस्या-समाधान पर ध्यान केन्द्रित करती है। शत्रु या प्रतिस्पर्धी उभर सकते हैं जिनके लिए रणनीतिक प्रतिक्रिया आवश्यक है। ऋण और विधिक मामलों पर ध्यान देना आवश्यक है।',
    },
    focus: {
      en: 'Primary focus falls on health management, workplace efficiency, resolving disputes, and perfecting skills through disciplined practice.',
      hi: 'प्राथमिक ध्यान स्वास्थ्य प्रबन्धन, कार्यस्थल दक्षता, विवाद समाधान और अनुशासित अभ्यास से कौशल परिष्कार पर रहता है।',
    },
    caution: {
      en: 'Beware of over-analysis, hypochondria, and being overly critical of self and others — perfectionism becomes paralyzing if unchecked.',
      hi: 'अत्यधिक विश्लेषण, रोगभ्रम और स्वयं तथा दूसरों की अति-आलोचना से सावधान रहें — अनियंत्रित पूर्णतावाद पक्षाघाती बन जाता है।',
    },
  },

  // ─── LIBRA (7) ────────────────────────────────────────────────────────────────
  {
    signId: 7,
    themes: {
      en: 'Libra dasha activates partnerships, marriage, business alliances, and public dealings. Contracts, negotiations, and legal agreements take center stage. The native seeks balance, harmony, and meaningful one-to-one connections.',
      hi: 'तुला दशा साझेदारी, विवाह, व्यापारिक गठबन्धन और सार्वजनिक व्यवहार को सक्रिय करती है। अनुबन्ध, वार्ता और कानूनी समझौते केन्द्र में आते हैं। जातक संतुलन, सामंजस्य और सार्थक एक-से-एक सम्बन्ध खोजता है।',
    },
    focus: {
      en: 'Primary focus falls on marriage, business partnerships, diplomatic relationships, and achieving fairness in all dealings.',
      hi: 'प्राथमिक ध्यान विवाह, व्यापारिक साझेदारी, कूटनीतिक सम्बन्ध और सभी व्यवहारों में निष्पक्षता प्राप्ति पर रहता है।',
    },
    caution: {
      en: 'Guard against codependency, indecisiveness, and sacrificing personal needs to maintain peace — suppressed conflict erupts later.',
      hi: 'सह-निर्भरता, अनिर्णय और शान्ति बनाए रखने हेतु व्यक्तिगत आवश्यकताओं के बलिदान से सावधान रहें — दबा हुआ विवाद बाद में फूटता है।',
    },
  },

  // ─── SCORPIO (8) ──────────────────────────────────────────────────────────────
  {
    signId: 8,
    themes: {
      en: 'Scorpio dasha activates transformation, hidden matters, inheritance, and occult interests. This period brings deep psychological changes, encounters with mortality, and opportunities for regeneration. Joint finances and others\' resources become significant.',
      hi: 'वृश्चिक दशा परिवर्तन, गुप्त विषयों, विरासत और गूढ़ रुचियों को सक्रिय करती है। यह काल गहन मनोवैज्ञानिक परिवर्तन, मृत्यु-बोध और पुनर्जन्म के अवसर लाता है। संयुक्त वित्त और दूसरों के संसाधन महत्वपूर्ण बनते हैं।',
    },
    focus: {
      en: 'Primary focus falls on inner transformation, managing shared resources, research into hidden truths, and confronting deep-seated fears.',
      hi: 'प्राथमिक ध्यान आन्तरिक परिवर्तन, साझा संसाधनों का प्रबन्धन, गूढ़ सत्यों का अनुसन्धान और गहन भय का सामना करने पर रहता है।',
    },
    caution: {
      en: 'Watch for obsessive behavior, power struggles, and destructive jealousy — the intensity of this period can consume if not channeled constructively.',
      hi: 'जुनूनी व्यवहार, सत्ता संघर्ष और विनाशकारी ईर्ष्या से सावधान रहें — इस काल की तीव्रता रचनात्मक मार्ग न मिलने पर विनाशकारी हो सकती है।',
    },
  },

  // ─── SAGITTARIUS (9) ─────────────────────────────────────────────────────────
  {
    signId: 9,
    themes: {
      en: 'Sagittarius dasha activates dharma, higher learning, long-distance travel, and spiritual growth. The father figure, gurus, and philosophical quests become central. Legal victories, academic success, and pilgrimage are favored.',
      hi: 'धनु दशा धर्म, उच्च शिक्षा, दूर की यात्रा और आध्यात्मिक विकास को सक्रिय करती है। पिता, गुरु और दार्शनिक अन्वेषण केन्द्र में आते हैं। विधिक विजय, शैक्षणिक सफलता और तीर्थयात्रा अनुकूल हैं।',
    },
    focus: {
      en: 'Primary focus falls on expanding wisdom, connecting with mentors, pursuing higher education, and finding life\'s deeper purpose.',
      hi: 'प्राथमिक ध्यान ज्ञान विस्तार, गुरुजनों से सम्पर्क, उच्च शिक्षा प्राप्ति और जीवन के गहरे उद्देश्य की खोज पर रहता है।',
    },
    caution: {
      en: 'Beware of dogmatism, over-preaching, and neglecting practical details in pursuit of grand visions — idealism needs grounding.',
      hi: 'कट्टरता, अत्यधिक उपदेश और विराट दृष्टि की खोज में व्यावहारिक विवरणों की उपेक्षा से सावधान — आदर्शवाद को धरातल की आवश्यकता है।',
    },
  },

  // ─── CAPRICORN (10) ──────────────────────────────────────────────────────────
  {
    signId: 10,
    themes: {
      en: 'Capricorn dasha activates career, public reputation, authority, and worldly achievement. This is a period of maximum professional effort and social visibility. Government dealings, organizational leadership, and legacy-building come to the fore.',
      hi: 'मकर दशा करियर, सार्वजनिक प्रतिष्ठा, अधिकार और सांसारिक उपलब्धि को सक्रिय करती है। यह अधिकतम व्यावसायिक प्रयास और सामाजिक दृश्यता का काल है। सरकारी व्यवहार, संगठनात्मक नेतृत्व और विरासत-निर्माण सामने आता है।',
    },
    focus: {
      en: 'Primary focus falls on career milestones, professional reputation, assuming positions of authority, and building a lasting legacy.',
      hi: 'प्राथमिक ध्यान करियर उपलब्धियों, व्यावसायिक प्रतिष्ठा, अधिकार पदों को ग्रहण करने और स्थायी विरासत निर्माण पर रहता है।',
    },
    caution: {
      en: 'Guard against workaholism, emotional coldness, and neglecting family for professional gains — success without fulfillment is hollow.',
      hi: 'कर्मव्यसन, भावनात्मक शीतलता और व्यावसायिक लाभ के लिए परिवार की उपेक्षा से सावधान — पूर्ति के बिना सफलता खोखली है।',
    },
  },

  // ─── AQUARIUS (11) ────────────────────────────────────────────────────────────
  {
    signId: 11,
    themes: {
      en: 'Aquarius dasha activates gains, social networks, elder siblings, and the fulfillment of desires. Income from multiple sources increases. Community involvement, humanitarian work, and large-scale projects define this period.',
      hi: 'कुम्भ दशा लाभ, सामाजिक नेटवर्क, बड़े भाई-बहन और इच्छापूर्ति को सक्रिय करती है। अनेक स्रोतों से आय बढ़ती है। सामुदायिक भागीदारी, मानवतावादी कार्य और बड़ी-परियोजनाएँ इस काल को परिभाषित करती हैं।',
    },
    focus: {
      en: 'Primary focus falls on expanding income, building alliances, fulfilling long-held aspirations, and contributing to collective welfare.',
      hi: 'प्राथमिक ध्यान आय विस्तार, गठबन्धन निर्माण, दीर्घकालीन आकांक्षाओं की पूर्ति और सामूहिक कल्याण में योगदान पर रहता है।',
    },
    caution: {
      en: 'Watch for detachment from close relationships, rebelliousness for its own sake, and scattering efforts across too many causes.',
      hi: 'निकट सम्बन्धों से विरक्ति, स्वयं के लिए विद्रोह और बहुत सारे कार्यों में प्रयासों के बिखराव से सावधान रहें।',
    },
  },

  // ─── PISCES (12) ──────────────────────────────────────────────────────────────
  {
    signId: 12,
    themes: {
      en: 'Pisces dasha activates spirituality, foreign lands, liberation (moksha), and expenses. This is a deeply introspective period — meditation, charity, and retreat from worldly pursuits are emphasized. Bed pleasures, dreams, and the subconscious surface.',
      hi: 'मीन दशा आध्यात्मिकता, विदेश, मोक्ष और व्यय को सक्रिय करती है। यह गहन आत्मनिरीक्षण का काल है — ध्यान, दान और सांसारिक गतिविधियों से विराम पर बल है। शय्या सुख, स्वप्न और अवचेतन सतह पर आता है।',
    },
    focus: {
      en: 'Primary focus falls on spiritual practices, releasing attachments, settling karmic debts, and finding peace through surrender and service.',
      hi: 'प्राथमिक ध्यान आध्यात्मिक साधना, आसक्ति त्याग, कार्मिक ऋण निपटान और समर्पण तथा सेवा से शान्ति प्राप्ति पर रहता है।',
    },
    caution: {
      en: 'Beware of excessive escapism, uncontrolled expenses, and losing oneself in fantasy or substances — the dissolution energy of Pisces needs conscious channeling.',
      hi: 'अत्यधिक पलायनवाद, अनियंत्रित व्यय और कल्पना या मादक द्रव्यों में स्वयं को खोने से सावधान — मीन की विलय ऊर्जा को सचेत मार्गदर्शन की आवश्यकता है।',
    },
  },
];

/**
 * Look up interpretation for a Narayana Dasha sign period.
 * @param signId 1-12
 */
export function getNarayanaInterpretation(signId: number): NarayanaDashaInterpretation | undefined {
  if (signId < 1 || signId > 12) return undefined;
  return NARAYANA_INTERPRETATIONS.find(i => i.signId === signId);
}

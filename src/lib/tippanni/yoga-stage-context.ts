/**
 * Yoga Category x Life Stage Relevance Weights & Context Suffixes
 *
 * When yogas are detected in a chart, their practical significance varies by age.
 * A Dhana Yoga matters far more at 35 (peak earning years) than at 18 (still in school).
 * A Moksha Yoga matters more at 70 (spiritual ripening) than at 25 (worldly engagement).
 *
 * This module provides:
 * 1. Relevance weights (0.3-1.5) per yoga category x life stage
 * 2. Context suffixes (1-2 sentences) that frame the yoga for the user's current age
 * 3. A classifier that maps yoga names to categories
 *
 * Used by the tippanni engine to adjust yoga prominence and add age-appropriate commentary.
 */

import type { LifeStage } from '@/lib/kundali/life-stage';

// ── Yoga Categories ──

export type YogaCategory =
  | 'dhana'        // wealth yogas (Dhana, Lakshmi, etc.)
  | 'raja'         // power/authority yogas (Raja, Pancha Mahapurusha, etc.)
  | 'moksha'       // spiritual liberation yogas (Moksha, Pravrajya, etc.)
  | 'saraswati'    // learning/knowledge yogas (Saraswati, Budhaditya, etc.)
  | 'parivartana'  // exchange yogas
  | 'daridra'      // poverty/obstruction yogas
  | 'health'       // health-related yogas (Arishta, Balarishta, etc.)
  | 'marriage'     // marriage/relationship yogas
  | 'nabhasa'      // pattern yogas (Yupa, Shakata, etc.)
  | 'general';     // unclassified fallback

// ── Relevance Weights ──
// 0.3 = barely relevant at this stage, 1.0 = neutral, 1.5 = peak relevance

export const YOGA_STAGE_RELEVANCE: Record<YogaCategory, Record<LifeStage, number>> = {
  dhana: {
    student: 0.5,
    early_career: 0.9,
    householder: 1.4,
    established: 1.3,
    elder: 0.8,
    sage: 0.4,
  },
  raja: {
    student: 0.6,
    early_career: 1.1,
    householder: 1.5,
    established: 1.3,
    elder: 0.7,
    sage: 0.4,
  },
  moksha: {
    student: 0.3,
    early_career: 0.4,
    householder: 0.5,
    established: 0.9,
    elder: 1.3,
    sage: 1.5,
  },
  saraswati: {
    student: 1.5,
    early_career: 1.2,
    householder: 0.8,
    established: 0.7,
    elder: 0.9,
    sage: 1.1,
  },
  parivartana: {
    student: 0.7,
    early_career: 1.0,
    householder: 1.3,
    established: 1.1,
    elder: 0.8,
    sage: 0.6,
  },
  daridra: {
    student: 0.8,
    early_career: 1.2,
    householder: 1.4,
    established: 1.1,
    elder: 0.7,
    sage: 0.4,
  },
  health: {
    student: 0.6,
    early_career: 0.7,
    householder: 0.9,
    established: 1.2,
    elder: 1.5,
    sage: 1.5,
  },
  marriage: {
    student: 0.7,
    early_career: 1.4,
    householder: 1.3,
    established: 0.9,
    elder: 0.7,
    sage: 0.5,
  },
  nabhasa: {
    student: 0.8,
    early_career: 1.0,
    householder: 1.0,
    established: 1.0,
    elder: 0.9,
    sage: 0.8,
  },
  general: {
    student: 0.8,
    early_career: 1.0,
    householder: 1.0,
    established: 1.0,
    elder: 0.9,
    sage: 0.8,
  },
};

// ── Context Suffixes ──
// 1-2 sentences appended to a yoga interpretation to frame it for the user's life stage.
// Tone: personal, encouraging, wise. Never alarmist.

export const YOGA_STAGE_SUFFIX: Record<YogaCategory, Record<LifeStage, { en: string; hi: string }>> = {
  dhana: {
    student: {
      en: 'This wealth combination activates in your earning years -- focus on building the skills and networks that will unlock it.',
      hi: 'यह धन योग आपके कमाई के वर्षों में सक्रिय होगा -- उन कौशलों और सम्पर्कों पर ध्यान दें जो इसे खोलेंगे।',
    },
    early_career: {
      en: 'Your wealth potential is beginning to stir. The financial decisions you make in this decade lay the groundwork for lasting prosperity.',
      hi: 'आपकी धन क्षमता जागने लगी है। इस दशक में लिए वित्तीय निर्णय स्थायी समृद्धि की नींव रखेंगे।',
    },
    householder: {
      en: 'This is the prime window for this yoga to bear fruit. Strategic investments and bold career moves can amplify its promise now.',
      hi: 'यह इस योग के फल देने की सर्वोत्तम अवधि है। रणनीतिक निवेश और साहसिक कैरियर कदम अब इसकी क्षमता को बढ़ा सकते हैं।',
    },
    established: {
      en: 'Your wealth yoga is in its harvest phase. Focus on preserving gains, securing your family\'s future, and giving back wisely.',
      hi: 'आपका धन योग अपने फसल काटने के चरण में है। लाभ सुरक्षित रखें, परिवार का भविष्य सुनिश्चित करें और बुद्धिमानी से दान करें।',
    },
    elder: {
      en: 'Material wealth now serves a deeper purpose -- funding your peace, your family\'s stability, and your chosen causes.',
      hi: 'भौतिक धन अब एक गहरे उद्देश्य की सेवा करता है -- आपकी शान्ति, परिवार की स्थिरता और चुने हुए उद्देश्यों को।',
    },
    sage: {
      en: 'You have moved beyond the pursuit of wealth. Whatever this yoga has given, let it flow outward as generosity and legacy.',
      hi: 'आप धन की खोज से आगे बढ़ चुके हैं। इस योग ने जो दिया, उसे उदारता और विरासत के रूप में बहने दें।',
    },
  },

  raja: {
    student: {
      en: 'Authority and recognition come later -- your current task is to build the character and competence that this yoga rewards.',
      hi: 'अधिकार और मान्यता बाद में आएगी -- आपका वर्तमान कार्य उस चरित्र और योग्यता का निर्माण है जिसे यह योग पुरस्कृत करता है।',
    },
    early_career: {
      en: 'This is the seed-sowing period for your leadership potential. Take on challenges, even uncomfortable ones -- they activate this yoga.',
      hi: 'यह आपकी नेतृत्व क्षमता के बीज बोने का काल है। चुनौतियाँ स्वीकारें, असहज भी -- ये इस योग को सक्रिय करती हैं।',
    },
    householder: {
      en: 'Your authority yoga is at peak activation. Promotions, public roles, and institutional power are within reach if you act decisively.',
      hi: 'आपका राजयोग चरम सक्रियता पर है। पदोन्नति, सार्वजनिक भूमिकाएँ और संस्थागत शक्ति निर्णायक कार्रवाई से पहुँच में हैं।',
    },
    established: {
      en: 'Your power yoga now calls for mentorship and legacy-building. Lead by elevating others -- your influence multiplies through them.',
      hi: 'आपका शक्ति योग अब मार्गदर्शन और विरासत निर्माण की माँग करता है। दूसरों को ऊपर उठाकर नेतृत्व करें।',
    },
    elder: {
      en: 'Formal authority may be winding down, but your earned respect commands influence. Advisory and honorary roles suit this phase.',
      hi: 'औपचारिक अधिकार कम हो सकता है, पर आपका अर्जित सम्मान प्रभाव रखता है। सलाहकार और मानद भूमिकाएँ इस चरण के अनुरूप हैं।',
    },
    sage: {
      en: 'True kingship is inner sovereignty. The authority this yoga conferred has prepared you for the ultimate rule -- over your own mind.',
      hi: 'सच्चा राजत्व आन्तरिक सम्प्रभुता है। इस योग ने जो अधिकार दिया, उसने आपको परम शासन के लिए तैयार किया -- अपने मन पर।',
    },
  },

  moksha: {
    student: {
      en: 'Spiritual depth is a seed within you, but this is not the season to renounce. Learn the world first -- moksha deepens with lived experience.',
      hi: 'आध्यात्मिक गहराई आपके भीतर एक बीज है, पर यह त्याग का मौसम नहीं। पहले संसार सीखें -- मोक्ष अनुभव से गहरा होता है।',
    },
    early_career: {
      en: 'Your spiritual inclination is real, but balance it with worldly engagement. The householder path enriches your eventual liberation.',
      hi: 'आपका आध्यात्मिक झुकाव वास्तविक है, पर सांसारिक सहभागिता से सन्तुलन रखें। गृहस्थ मार्ग आपकी अन्तिम मुक्ति को समृद्ध करता है।',
    },
    householder: {
      en: 'Keep a daily sadhana even amid worldly responsibilities. This yoga ensures that your spiritual core remains accessible beneath the surface.',
      hi: 'सांसारिक जिम्मेदारियों के बीच भी दैनिक साधना बनाए रखें। यह योग सुनिश्चित करता है कि आपका आध्यात्मिक केन्द्र सुलभ रहे।',
    },
    established: {
      en: 'The pull toward inner life is strengthening now. Begin setting aside more time for meditation, study, and pilgrimage.',
      hi: 'आन्तरिक जीवन की ओर खिंचाव अब मजबूत हो रहा है। ध्यान, अध्ययन और तीर्थयात्रा के लिए अधिक समय निकालना शुरू करें।',
    },
    elder: {
      en: 'This yoga is entering its most potent phase. Spiritual practice now yields profound results -- the soul is ready for what the mind long resisted.',
      hi: 'यह योग अपने सबसे शक्तिशाली चरण में प्रवेश कर रहा है। आध्यात्मिक साधना अब गहन फल देती है।',
    },
    sage: {
      en: 'All of life has led here. This yoga ripens into direct experience of the divine -- surrender to its pull with full trust.',
      hi: 'सारा जीवन यहाँ ले आया है। यह योग परमात्मा के प्रत्यक्ष अनुभव में पकता है -- पूर्ण विश्वास से इसके आकर्षण को समर्पित हों।',
    },
  },

  saraswati: {
    student: {
      en: 'This is YOUR season. Learning comes naturally and sticks deeply -- invest every available hour in structured study and creative exploration.',
      hi: 'यह आपका मौसम है। सीखना स्वाभाविक आता है और गहरा टिकता है -- हर उपलब्ध घंटा व्यवस्थित अध्ययन और रचनात्मक अन्वेषण में लगाएँ।',
    },
    early_career: {
      en: 'Your knowledge yoga gives you an edge -- leverage it through certifications, teaching, writing, or building intellectual authority in your field.',
      hi: 'आपका ज्ञान योग आपको बढ़त देता है -- प्रमाणपत्र, शिक्षण, लेखन या अपने क्षेत्र में बौद्धिक अधिकार बनाकर इसका लाभ उठाएँ।',
    },
    householder: {
      en: 'Don\'t let career busyness crowd out intellectual growth. This yoga rewards continued learning even during the busiest years.',
      hi: 'कैरियर की व्यस्तता को बौद्धिक विकास पर हावी न होने दें। यह योग व्यस्ततम वर्षों में भी निरन्तर सीखने को पुरस्कृत करता है।',
    },
    established: {
      en: 'Your accumulated knowledge is a treasure -- share it through mentoring, writing, or founding an institution that outlives you.',
      hi: 'आपका संचित ज्ञान एक खजाना है -- मार्गदर्शन, लेखन या एक ऐसी संस्था की स्थापना से साझा करें जो आपसे आगे जीवित रहे।',
    },
    elder: {
      en: 'Teaching and scriptural study bring deep fulfillment now. Your intellectual capacity may shift but your wisdom has never been greater.',
      hi: 'शिक्षण और शास्त्र अध्ययन अब गहरी पूर्णता लाते हैं। आपकी बौद्धिक क्षमता बदल सकती है पर आपकी बुद्धि कभी इतनी महान नहीं रही।',
    },
    sage: {
      en: 'Knowledge has become wisdom, and wisdom has become silence. This yoga culminates in the understanding that needs no words.',
      hi: 'ज्ञान बुद्धि बन गया, और बुद्धि मौन। यह योग उस समझ में परिणत होता है जिसे शब्दों की आवश्यकता नहीं।',
    },
  },

  parivartana: {
    student: {
      en: 'Exchange yogas create unexpected connections between life areas. Stay open to cross-disciplinary opportunities -- they are your hidden advantage.',
      hi: 'परिवर्तन योग जीवन क्षेत्रों के बीच अप्रत्याशित सम्बन्ध बनाते हैं। अन्तर-विषयक अवसरों के लिए खुले रहें -- ये आपका छिपा लाभ हैं।',
    },
    early_career: {
      en: 'This yoga thrives on versatility. Career pivots and lateral moves may serve you better than a single straight path.',
      hi: 'यह योग बहुमुखी प्रतिभा पर फलता-फूलता है। कैरियर परिवर्तन और पार्श्व चाल एक सीधे रास्ते से बेहतर सेवा कर सकते हैं।',
    },
    householder: {
      en: 'The exchange energy is at full strength -- partnerships, joint ventures, and cross-functional leadership unlock this yoga\'s peak potential.',
      hi: 'विनिमय ऊर्जा पूर्ण शक्ति पर है -- साझेदारी, संयुक्त उद्यम और बहु-कार्यात्मक नेतृत्व इस योग की चरम क्षमता खोलते हैं।',
    },
    established: {
      en: 'Your ability to bridge different worlds is a rare gift. Use it to connect generations, industries, or communities in your sphere.',
      hi: 'विभिन्न संसारों को जोड़ने की आपकी क्षमता एक दुर्लभ उपहार है। इसे पीढ़ियों, उद्योगों या समुदायों को जोड़ने में उपयोग करें।',
    },
    elder: {
      en: 'Exchange energy now manifests as the ability to see connections others miss. Counsel and mediation are natural roles for you.',
      hi: 'विनिमय ऊर्जा अब उन सम्बन्धों को देखने की क्षमता के रूप में प्रकट होती है जो दूसरे चूक जाते हैं। परामर्श और मध्यस्थता आपकी स्वाभाविक भूमिकाएँ हैं।',
    },
    sage: {
      en: 'All exchanges dissolve into unity at this stage. The yoga\'s lesson is complete -- separation was always an illusion.',
      hi: 'इस अवस्था में सभी विनिमय एकता में विलीन हो जाते हैं। योग का पाठ पूर्ण है -- पृथकता सदा एक भ्रम थी।',
    },
  },

  daridra: {
    student: {
      en: 'Financial challenges in youth build resilience. This yoga does not define your future -- conscious effort and wise choices can redirect its energy.',
      hi: 'युवावस्था में वित्तीय चुनौतियाँ सहनशीलता बनाती हैं। यह योग आपका भविष्य तय नहीं करता -- सचेत प्रयास और बुद्धिमान विकल्प इसकी ऊर्जा को पुनर्निर्देशित कर सकते हैं।',
    },
    early_career: {
      en: 'Be extra disciplined with finances now. Avoid speculative risks and build savings methodically -- this yoga responds well to structured effort.',
      hi: 'अभी वित्त में अतिरिक्त अनुशासित रहें। सट्टा जोखिमों से बचें और व्यवस्थित रूप से बचत करें -- यह योग संरचित प्रयास पर अच्छा प्रतिसाद देता है।',
    },
    householder: {
      en: 'The pressure of this yoga peaks during high-expense years. Protective remedies and conservative financial planning are especially important now.',
      hi: 'इस योग का दबाव उच्च-व्यय वर्षों में चरम पर होता है। सुरक्षात्मक उपाय और रूढ़िवादी वित्तीय योजना अब विशेष रूप से महत्वपूर्ण हैं।',
    },
    established: {
      en: 'If you have navigated this far, the worst is behind you. Focus on debt elimination and passive income to neutralize remaining effects.',
      hi: 'यदि आप यहाँ तक पहुँचे हैं, तो सबसे बुरा बीत चुका है। शेष प्रभावों को निष्प्रभावी करने के लिए ऋण उन्मूलन और निष्क्रिय आय पर ध्यान दें।',
    },
    elder: {
      en: 'Material concerns diminish naturally at this stage. Whatever this yoga took, it also taught you the value of what money cannot buy.',
      hi: 'इस अवस्था में भौतिक चिन्ताएँ स्वाभाविक रूप से कम होती हैं। इस योग ने जो लिया, उसने आपको वह मूल्य भी सिखाया जो धन नहीं खरीद सकता।',
    },
    sage: {
      en: 'Detachment from wealth is the very gift of this yoga -- what seemed a curse was preparation for inner freedom.',
      hi: 'धन से वैराग्य इस योग का सच्चा उपहार है -- जो अभिशाप लगता था, वह आन्तरिक स्वतन्त्रता की तैयारी थी।',
    },
  },

  health: {
    student: {
      en: 'Health yogas in youth call for early awareness, not anxiety. Build strong habits now -- exercise, sleep, and regular check-ups create a foundation that lasts.',
      hi: 'युवावस्था में स्वास्थ्य योग जल्दी जागरूकता की माँग करते हैं, चिन्ता की नहीं। अभी मजबूत आदतें बनाएँ -- व्यायाम, नींद और नियमित जाँच।',
    },
    early_career: {
      en: 'Don\'t sacrifice health for career ambition. This yoga warns that neglecting your body now will compound into bigger issues later.',
      hi: 'कैरियर महत्वाकांक्षा के लिए स्वास्थ्य का त्याग न करें। यह योग चेतावनी देता है कि अभी शरीर की उपेक्षा बाद में बड़ी समस्याएँ बनेगी।',
    },
    householder: {
      en: 'Stress-related health issues are the primary risk at this stage. This yoga activates under sustained pressure -- prioritize recovery and preventive care.',
      hi: 'इस अवस्था में तनाव-सम्बन्धित स्वास्थ्य समस्याएँ प्राथमिक जोखिम हैं। यह योग निरन्तर दबाव में सक्रिय होता है -- पुनर्प्राप्ति और निवारक देखभाल को प्राथमिकता दें।',
    },
    established: {
      en: 'This is when health yogas demand the most attention. Comprehensive annual check-ups and lifestyle adjustments are non-negotiable now.',
      hi: 'यह वह समय है जब स्वास्थ्य योग सबसे अधिक ध्यान माँगते हैं। व्यापक वार्षिक जाँच और जीवनशैली समायोजन अब अनिवार्य हैं।',
    },
    elder: {
      en: 'Health is your most precious resource now. This yoga reminds you to listen to your body with the same attention you once gave to career and family.',
      hi: 'स्वास्थ्य अब आपका सबसे अमूल्य संसाधन है। यह योग आपको अपने शरीर की उतनी ही सुनने की याद दिलाता है जितना आपने कभी कैरियर और परिवार को दिया।',
    },
    sage: {
      en: 'Gentle living is your medicine. Accept the body\'s limitations with grace -- the spirit within remains untouched by physical change.',
      hi: 'सौम्य जीवन आपकी औषधि है। शरीर की सीमाओं को गरिमा से स्वीकारें -- भीतर की आत्मा शारीरिक परिवर्तन से अछूती रहती है।',
    },
  },

  marriage: {
    student: {
      en: 'Relationship patterns are forming now, even if marriage is distant. Understand your partnership tendencies -- they will shape your future choices.',
      hi: 'सम्बन्ध पैटर्न अभी बन रहे हैं, भले ही विवाह दूर हो। अपनी साझेदारी प्रवृत्तियों को समझें -- ये आपके भविष्य के विकल्पों को आकार देंगी।',
    },
    early_career: {
      en: 'This is the prime activation window for marriage yogas. Be intentional about the partner you choose -- this yoga amplifies whatever you bring to it.',
      hi: 'यह विवाह योगों की प्रमुख सक्रियता अवधि है। साथी चुनने में सचेत रहें -- यह योग जो आप लाते हैं उसे बढ़ाता है।',
    },
    householder: {
      en: 'Marriage yogas now express through the daily reality of partnership -- domestic harmony, shared goals, and mutual growth. Invest in your relationship consciously.',
      hi: 'विवाह योग अब साझेदारी की दैनिक वास्तविकता में व्यक्त होते हैं -- पारिवारिक सद्भाव, साझा लक्ष्य और पारस्परिक विकास। सचेत रूप से सम्बन्ध में निवेश करें।',
    },
    established: {
      en: 'Your partnership has weathered decades. This yoga now asks you to rediscover your partner beyond roles -- as fellow travelers on life\'s journey.',
      hi: 'आपकी साझेदारी ने दशकों का सामना किया है। यह योग अब आपसे भूमिकाओं से परे अपने साथी को फिर से खोजने को कहता है।',
    },
    elder: {
      en: 'Companionship is now the core of this yoga\'s expression. Presence, patience, and shared silence matter more than grand gestures.',
      hi: 'साहचर्य अब इस योग की अभिव्यक्ति का केन्द्र है। उपस्थिति, धैर्य और साझा मौन भव्य इशारों से अधिक महत्वपूर्ण हैं।',
    },
    sage: {
      en: 'Your relationship is a lifelong tapas that has refined both souls. Honor it with gentle presence and gratitude for the journey shared.',
      hi: 'आपका सम्बन्ध एक आजीवन तपस्या है जिसने दोनों आत्माओं को परिष्कृत किया। सौम्य उपस्थिति और साझा यात्रा के लिए कृतज्ञता से इसका सम्मान करें।',
    },
  },

  nabhasa: {
    student: {
      en: 'This planetary pattern shapes your overall temperament and approach to life. Awareness of it helps you play to your innate strengths as you build your path.',
      hi: 'यह ग्रह पैटर्न आपके समग्र स्वभाव और जीवन के दृष्टिकोण को आकार देता है। इसकी जागरूकता आपको अपनी जन्मजात शक्तियों का उपयोग करने में मदद करती है।',
    },
    early_career: {
      en: 'Your chart\'s structural pattern suggests a natural working style. Lean into it rather than fighting it -- careers aligned with innate patterns flourish.',
      hi: 'आपकी कुण्डली का संरचनात्मक पैटर्न एक स्वाभाविक कार्यशैली सुझाता है। इसके विरुद्ध लड़ने के बजाय इसमें झुकें -- जन्मजात पैटर्न से जुड़े कैरियर फलते-फूलते हैं।',
    },
    householder: {
      en: 'This pattern yoga defines how you handle the complexity of peak life -- family, career, and social roles simultaneously. Work with your pattern, not against it.',
      hi: 'यह पैटर्न योग परिभाषित करता है कि आप शिखर जीवन की जटिलता को कैसे सँभालते हैं। अपने पैटर्न के साथ काम करें, उसके विरुद्ध नहीं।',
    },
    established: {
      en: 'By now, this pattern has revealed itself clearly through decades of lived experience. You know your strengths -- trust them more fully.',
      hi: 'अब तक, यह पैटर्न दशकों के जीवन अनुभव से स्पष्ट रूप से प्रकट हो चुका है। आप अपनी शक्तियाँ जानते हैं -- उन पर अधिक विश्वास करें।',
    },
    elder: {
      en: 'Your life pattern is a completed tapestry now. Looking back, you can see how this yoga wove through every chapter -- a signature uniquely yours.',
      hi: 'आपका जीवन पैटर्न अब एक पूर्ण बुनावट है। पीछे देखने पर, आप देख सकते हैं कि इस योग ने हर अध्याय में कैसे बुना।',
    },
    sage: {
      en: 'Patterns belong to the body and mind. The witness within you has always been beyond any configuration of planets.',
      hi: 'पैटर्न शरीर और मन से सम्बन्धित हैं। आपके भीतर का साक्षी सदा ग्रहों की किसी भी स्थिति से परे रहा है।',
    },
  },

  general: {
    student: {
      en: 'This yoga\'s full significance will unfold over time. For now, simply be aware of its presence as you build your foundation.',
      hi: 'इस योग का पूर्ण महत्व समय के साथ प्रकट होगा। अभी, अपनी नींव बनाते समय बस इसकी उपस्थिति के प्रति सचेत रहें।',
    },
    early_career: {
      en: 'Keep this yoga in mind as you make formative career and life decisions. Its influence shapes outcomes in ways that become clearer with time.',
      hi: 'जब आप निर्णायक कैरियर और जीवन निर्णय लें तो इस योग को ध्यान में रखें। इसका प्रभाव समय के साथ स्पष्ट होता जाता है।',
    },
    householder: {
      en: 'This yoga is actively shaping your current life chapter. Pay attention to how its themes manifest in your daily reality.',
      hi: 'यह योग सक्रिय रूप से आपके वर्तमान जीवन अध्याय को आकार दे रहा है। ध्यान दें कि इसके विषय आपकी दैनिक वास्तविकता में कैसे प्रकट होते हैं।',
    },
    established: {
      en: 'With decades of experience, you can now see this yoga\'s thread running through your life story. Use that awareness intentionally.',
      hi: 'दशकों के अनुभव के साथ, अब आप इस योग के धागे को अपनी जीवन कथा में देख सकते हैं। उस जागरूकता का सचेत उपयोग करें।',
    },
    elder: {
      en: 'This yoga has played its part in a life well-lived. Let its lessons inform the wisdom you share with those who seek your guidance.',
      hi: 'इस योग ने एक अच्छे जीवन में अपनी भूमिका निभाई है। इसके पाठ उस बुद्धि को सूचित करें जो आप मार्गदर्शन चाहने वालों के साथ साझा करते हैं।',
    },
    sage: {
      en: 'All yogas are threads in the grand design. At this stage, the weaver matters more than the weave -- turn inward.',
      hi: 'सभी योग विराट रचना के धागे हैं। इस अवस्था में, बुनकर बुनावट से अधिक महत्वपूर्ण है -- अन्तर्मुख हों।',
    },
  },
};

// ── Yoga Name to Category Classifier ──

/** Keywords mapped to categories for yoga name classification */
const YOGA_CATEGORY_KEYWORDS: [RegExp, YogaCategory][] = [
  // Dhana (wealth) yogas
  [/\bdhana\b/i, 'dhana'],
  [/\blakshmi\b/i, 'dhana'],
  [/\bchandra.?mangala\b/i, 'dhana'],  // wealth aspect of Chandra-Mangala
  [/\bvasumati\b/i, 'dhana'],
  [/\bkahal[a]?\b/i, 'dhana'],

  // Raja (power/authority) yogas
  [/\braja\b/i, 'raja'],
  [/\bhamsa\b/i, 'raja'],
  [/\bmalavya\b/i, 'raja'],
  [/\bruchaka\b/i, 'raja'],
  [/\bbhadra\b/i, 'raja'],
  [/\bshasha\b/i, 'raja'],
  [/\bgaja.?kesari\b/i, 'raja'],
  [/\bgajakesari\b/i, 'raja'],
  [/\bdharma.?karm/i, 'raja'],
  [/\bamala\b/i, 'raja'],
  [/\bpancha.?mahapurusha\b/i, 'raja'],
  [/\bmahapurusha\b/i, 'raja'],
  [/\bneech.?bhang/i, 'raja'],   // Neechabhanga Raja Yoga
  [/\bviparit/i, 'raja'],         // Viparita Raja Yoga

  // Moksha (spiritual liberation) yogas
  [/\bmoksha\b/i, 'moksha'],
  [/\bpravrajya\b/i, 'moksha'],
  [/\bvairagya\b/i, 'moksha'],
  [/\bsannyasa?\b/i, 'moksha'],
  [/\btapasvi\b/i, 'moksha'],

  // Saraswati (knowledge/learning) yogas
  [/\bsaraswati\b/i, 'saraswati'],
  [/\bbudh.?aditya\b/i, 'saraswati'],
  [/\bbudhaditya\b/i, 'saraswati'],
  [/\bvidya\b/i, 'saraswati'],
  [/\bchaturmukh/i, 'saraswati'],

  // Parivartana (exchange) yogas
  [/\bparivartana\b/i, 'parivartana'],
  [/\bdainya\b/i, 'parivartana'],
  [/\bmaha.?parivartana\b/i, 'parivartana'],

  // Daridra (poverty/obstruction) yogas
  [/\bdaridra\b/i, 'daridra'],
  [/\bkemdrum\b/i, 'daridra'],
  [/\bkemadruma\b/i, 'daridra'],  // poverty aspect
  [/\bshakat\b/i, 'daridra'],
  [/\bshakata\b/i, 'daridra'],

  // Health yogas
  [/\bbalarisht/i, 'health'],
  [/\barisht[a]?\b/i, 'health'],
  [/\balpayu\b/i, 'health'],
  [/\bbandhana\b/i, 'health'],
  [/\bmrityu\b/i, 'health'],

  // Marriage/relationship yogas
  [/\bkalatra\b/i, 'marriage'],
  [/\bvivah/i, 'marriage'],
  [/\bstri\b/i, 'marriage'],      // Stri Yoga (feminine/marriage)
  [/\bpati\b/i, 'marriage'],       // Pati Yoga (husband)
  [/\bdampatya\b/i, 'marriage'],   // marital harmony
  [/\bsaubhagya\b/i, 'marriage'],
  [/\bsumangali\b/i, 'marriage'],

  // Nabhasa (pattern) yogas — all 32 types
  // Ashraya (3): Rajju, Musala, Nala
  [/\brajju\b/i, 'nabhasa'],
  [/\bmusala?\b/i, 'nabhasa'],
  [/\bnala\b/i, 'nabhasa'],
  // Dala (2): Mala/Srak, Sarpa
  [/\bmala\b/i, 'nabhasa'],
  [/\bsrak\b/i, 'nabhasa'],
  [/\bsarpa\b/i, 'nabhasa'],
  // Akriti (20):
  [/\byupa\b/i, 'nabhasa'],
  [/\bshara\b/i, 'nabhasa'],
  [/\bshakti\b/i, 'nabhasa'],
  [/\bdanda\b/i, 'nabhasa'],
  [/\bnauka\b/i, 'nabhasa'],
  [/\bkuta\b/i, 'nabhasa'],
  [/\bchhatra\b/i, 'nabhasa'],
  [/\bchatra\b/i, 'nabhasa'],
  [/\bchaap[a]?\b/i, 'nabhasa'],
  [/\bardha.?chandra\b/i, 'nabhasa'],
  [/\bchakra\b/i, 'nabhasa'],
  [/\bsamudra\b/i, 'nabhasa'],
  [/\bkamala\b/i, 'nabhasa'],
  [/\bvaapi\b/i, 'nabhasa'],
  [/\byuga\b/i, 'nabhasa'],
  [/\bgola\b/i, 'nabhasa'],
  [/\bveena\b/i, 'nabhasa'],
  [/\bdama\b/i, 'nabhasa'],
  [/\bpasha\b/i, 'nabhasa'],
  [/\bkedara\b/i, 'nabhasa'],
  [/\bshula\b/i, 'nabhasa'],
  [/\byava\b/i, 'nabhasa'],
  [/\bvajra\b/i, 'nabhasa'],
  [/\bshringatak/i, 'nabhasa'],
  [/\bhala\b/i, 'nabhasa'],
  [/\bgada\b/i, 'nabhasa'],
  // Sankhya (7): Vallaki, Dama, Pasha, Kedara, Shula, Yuga, Gola
  // (already covered above — Nabhasa Sankhya names overlap with Akriti)
];

/**
 * Classify a yoga by name into a category.
 * Uses keyword matching against the yoga name string.
 * Falls back to 'general' for unrecognized names.
 *
 * @param yogaName - The English or transliterated name of the yoga
 * @returns The yoga's category
 */
export function classifyYoga(yogaName: string): YogaCategory {
  const normalized = yogaName.trim();
  for (const [pattern, category] of YOGA_CATEGORY_KEYWORDS) {
    if (pattern.test(normalized)) {
      return category;
    }
  }
  return 'general';
}

// ── Helper Functions ──

/**
 * Get relevance weight for a yoga category at a given life stage.
 * Returns 1.0 (neutral) if category or stage not found.
 */
export function getYogaRelevance(category: YogaCategory, stage: LifeStage): number {
  const weights = YOGA_STAGE_RELEVANCE[category];
  if (!weights) return 1.0;
  return weights[stage] ?? 1.0;
}

/**
 * Get context suffix for a yoga category at a given life stage.
 * Falls back to English if the requested locale is not available.
 *
 * @param category - Yoga category
 * @param stage - User's current life stage
 * @param locale - 'en' or 'hi' (falls back to 'en' for other locales)
 * @returns A 1-2 sentence context suffix
 */
export function getYogaStageSuffix(category: YogaCategory, stage: LifeStage, locale: string): string {
  const categorySuffixes = YOGA_STAGE_SUFFIX[category];
  if (!categorySuffixes) return '';
  const stageSuffix = categorySuffixes[stage];
  if (!stageSuffix) return '';
  // Only 'hi' has a dedicated translation; everything else falls back to 'en'
  if (locale === 'hi') return stageSuffix.hi;
  return stageSuffix.en;
}

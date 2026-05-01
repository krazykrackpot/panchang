/**
 * Life-Stage-Conditioned Transit Interpretations
 *
 * Provides age-appropriate transit text for Jupiter, Saturn, and Rahu-Ketu
 * through each house. Generic "base" text is overridden when the user's
 * LifeStage has a dedicated entry in `byStage`.
 *
 * Astrological content follows BPHS transit principles:
 *   - Jupiter (Guru): expansion, grace, wisdom — benefic in 2,5,7,9,11 from Moon
 *   - Saturn (Shani): discipline, restriction, maturation — tests through houses
 *   - Rahu-Ketu axis: obsession/detachment polarity across opposing houses
 *
 * Each entry: 2-4 sentences, 50-80 words, personal/warm/actionable tone.
 */

import type { LifeStage } from '@/lib/kundali/life-stage';

// ── Types ──

export interface StageTransitEffect {
  base: { en: string; hi: string };
  byStage?: Partial<Record<LifeStage, { en: string; hi: string }>>;
}

// ── Jupiter Transit Effects (Houses 1-12) ──

export const JUPITER_STAGE_EFFECTS: Record<number, StageTransitEffect> = {
  1: {
    base: {
      en: 'Jupiter transiting your 1st house brings renewed optimism and personal growth. Your confidence rises naturally, attracting favorable circumstances. This is a year to initiate new ventures and present yourself boldly to the world.',
      hi: 'बृहस्पति आपके प्रथम भाव में गोचर कर नवीन आशावाद और व्यक्तिगत विकास लाते हैं। आपका आत्मविश्वास स्वाभाविक रूप से बढ़ता है और अनुकूल परिस्थितियाँ आकर्षित होती हैं। नए उपक्रम प्रारम्भ करने और विश्व के समक्ष साहसपूर्वक प्रस्तुत होने का वर्ष है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in your 1st house marks a defining year of self-discovery. Your personality gains a magnetic quality that impresses teachers and mentors. Take bold steps — apply for that scholarship, join that leadership role. The universe is backing your ambitions right now.',
        hi: 'बृहस्पति प्रथम भाव में आत्म-खोज का निर्णायक वर्ष चिह्नित करते हैं। आपका व्यक्तित्व एक आकर्षक गुण पाता है जो शिक्षकों और गुरुओं को प्रभावित करता है। साहसिक कदम उठाएँ — छात्रवृत्ति के लिए आवेदन करें, नेतृत्व भूमिका लें। ब्रह्माण्ड आपकी महत्वाकांक्षाओं का समर्थन कर रहा है।',
      },
      householder: {
        en: 'Jupiter blessing your ascendant brings a year of expanded influence at work and at home. People see you as a leader and advisor. This is an excellent period for launching a business, taking on greater professional responsibility, or starting a family project that requires vision.',
        hi: 'बृहस्पति लग्न को आशीर्वाद देते हुए कार्यस्थल और घर दोनों पर प्रभाव विस्तार का वर्ष लाते हैं। लोग आपको नेता और सलाहकार के रूप में देखते हैं। व्यवसाय शुरू करने, अधिक व्यावसायिक जिम्मेदारी लेने या दूरदृष्टि वाली पारिवारिक परियोजना आरम्भ करने का उत्कृष्ट काल है।',
      },
      elder: {
        en: 'Jupiter illuminating your 1st house brings a gentle renaissance. Your health improves, your outlook brightens, and younger people seek your guidance. This is a wonderful year for travel, beginning a wellness routine, or starting that book you have always wanted to write.',
        hi: 'बृहस्पति प्रथम भाव को प्रकाशित करते हुए एक सौम्य पुनर्जागरण लाते हैं। आपका स्वास्थ्य सुधरता है, दृष्टिकोण उज्ज्वल होता है और युवा पीढ़ी आपका मार्गदर्शन चाहती है। यात्रा, स्वास्थ्य दिनचर्या या वह पुस्तक शुरू करने का अद्भुत वर्ष है जो आप सदा लिखना चाहते थे।',
      },
    },
  },
  2: {
    base: {
      en: 'Jupiter in your 2nd house expands wealth and family happiness. Income from multiple sources is likely. Speech becomes persuasive and impactful. This is a favorable year for savings, investments, and strengthening family bonds.',
      hi: 'बृहस्पति द्वितीय भाव में धन और पारिवारिक सुख का विस्तार करते हैं। अनेक स्रोतों से आय की सम्भावना है। वाणी प्रभावशाली और प्रेरक बनती है। बचत, निवेश और पारिवारिक बन्धनों को मजबूत करने का अनुकूल वर्ष है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 2nd house sharpens your speaking skills and academic expression. Debates, presentations, and interviews go well. Family support increases — you may receive financial help for education. Start building the habit of saving, even small amounts.',
        hi: 'बृहस्पति द्वितीय भाव में आपकी वाक्कला और शैक्षिक अभिव्यक्ति को तीक्ष्ण करते हैं। वाद-विवाद, प्रस्तुतियाँ और साक्षात्कार अच्छे होते हैं। पारिवारिक सहायता बढ़ती है — शिक्षा के लिए आर्थिक मदद मिल सकती है। बचत की आदत बनाना शुरू करें, चाहे छोटी रकम हो।',
      },
      householder: {
        en: 'This is a peak earning transit. Jupiter in the 2nd house opens doors for salary increases, bonuses, or new revenue streams. Family meals and gatherings bring joy. If you have been planning a major purchase — a home, vehicle, or education fund for children — this year favors it.',
        hi: 'यह चरम आय का गोचर है। बृहस्पति द्वितीय भाव में वेतन वृद्धि, बोनस या नई आय धाराओं के द्वार खोलते हैं। पारिवारिक भोजन और सभाएँ आनन्द लाती हैं। यदि बड़ी खरीदारी — घर, वाहन या बच्चों का शिक्षा कोष — की योजना बना रहे हैं, तो यह वर्ष अनुकूल है।',
      },
      elder: {
        en: 'Jupiter blesses your 2nd house of accumulated wealth and family. Financial security strengthens — existing investments yield well. Your words carry wisdom that your family cherishes. This is a wonderful time to organize your estate and share stories from your life.',
        hi: 'बृहस्पति संचित धन और परिवार के द्वितीय भाव को आशीर्वाद देते हैं। आर्थिक सुरक्षा मजबूत होती है — मौजूदा निवेश अच्छा प्रतिफल देते हैं। आपके शब्दों में वह ज्ञान है जो परिवार को प्रिय है। सम्पत्ति व्यवस्थित करने और जीवन की कहानियाँ साझा करने का सुन्दर समय है।',
      },
    },
  },
  3: {
    base: {
      en: 'Jupiter transiting the 3rd house energizes communication, courage, and short travels. Siblings and neighbors become sources of support. Creative writing, media work, and self-promotion efforts gain traction. Take initiative on projects you have been hesitating about.',
      hi: 'बृहस्पति तृतीय भाव में संवाद, साहस और लघु यात्राओं को ऊर्जा देते हैं। भाई-बहन और पड़ोसी सहायता के स्रोत बनते हैं। रचनात्मक लेखन, मीडिया कार्य और आत्म-प्रचार को गति मिलती है। जिन परियोजनाओं पर झिझक रहे थे, उन पर पहल करें।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 3rd house supercharges your curiosity and communication skills. Extracurricular activities, blogging, social media presence, or campus journalism thrive. Short courses and workshops bring unexpected opportunities. Your relationship with siblings improves noticeably.',
        hi: 'बृहस्पति तृतीय भाव में आपकी जिज्ञासा और संवाद कौशल को अत्यधिक ऊर्जा देते हैं। पाठ्येतर गतिविधियाँ, ब्लॉगिंग, सोशल मीडिया या कैम्पस पत्रकारिता फलती-फूलती है। लघु पाठ्यक्रम और कार्यशालाएँ अप्रत्याशित अवसर लाते हैं। भाई-बहनों से सम्बन्ध स्पष्ट रूप से सुधरते हैं।',
      },
      householder: {
        en: 'Jupiter in the 3rd house boosts your professional networking and communication reach. Proposals, pitches, and negotiations favor you. If you manage a team, your leadership communication becomes especially effective. Short business trips prove lucrative. Siblings may bring collaborative opportunities.',
        hi: 'बृहस्पति तृतीय भाव में व्यावसायिक नेटवर्किंग और संवाद पहुँच को बढ़ाते हैं। प्रस्ताव, पिच और वार्ताएँ आपके पक्ष में होती हैं। यदि टीम का प्रबन्धन करते हैं, तो नेतृत्व संवाद विशेष रूप से प्रभावी होता है। लघु व्यापारिक यात्राएँ लाभदायक सिद्ध होती हैं।',
      },
      elder: {
        en: 'Jupiter in the 3rd house rekindles your love for learning and expression. Writing memoirs, joining a book club, or mentoring young writers brings deep satisfaction. Neighborhood connections strengthen. Short pilgrimages or visits to relatives bring joy and meaning.',
        hi: 'बृहस्पति तृतीय भाव में शिक्षा और अभिव्यक्ति के प्रति प्रेम को पुनर्जीवित करते हैं। संस्मरण लिखना, पुस्तक क्लब में शामिल होना या युवा लेखकों का मार्गदर्शन गहन सन्तुष्टि लाता है। पड़ोस के सम्बन्ध मजबूत होते हैं। लघु तीर्थयात्राएँ या सम्बन्धियों से मिलना आनन्द और अर्थ लाता है।',
      },
    },
  },
  4: {
    base: {
      en: 'Jupiter in the 4th house brings domestic happiness, property gains, and emotional stability. Your home environment becomes more comfortable and harmonious. Mother\'s health and happiness improve. This is a favorable period for real estate decisions and home renovation.',
      hi: 'बृहस्पति चतुर्थ भाव में घरेलू सुख, सम्पत्ति लाभ और भावनात्मक स्थिरता लाते हैं। घर का वातावरण अधिक सुखद और सामंजस्यपूर्ण होता है। माता का स्वास्थ्य और प्रसन्नता में सुधार होता है। अचल सम्पत्ति निर्णय और गृह नवीनीकरण के लिए अनुकूल काल है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 4th house creates a nurturing home environment that supports your studies. You feel emotionally grounded and focused. If you are deciding between living at home or away, this transit favors the option that gives you more stability. Academic performance improves through inner calm.',
        hi: 'बृहस्पति चतुर्थ भाव में अध्ययन का समर्थन करने वाला पोषक गृह वातावरण बनाते हैं। आप भावनात्मक रूप से स्थिर और केन्द्रित अनुभव करते हैं। घर पर रहने या बाहर जाने का निर्णय हो तो यह गोचर अधिक स्थिरता वाले विकल्प का पक्ष लेता है। आन्तरिक शान्ति से शैक्षिक प्रदर्शन सुधरता है।',
      },
      householder: {
        en: 'Jupiter in the 4th house is one of the best transits for buying property, upgrading your home, or settling into a new city. Family life flourishes — your home becomes a place of warmth and celebration. If your mother is alive, her blessings and support strengthen noticeably during this period.',
        hi: 'बृहस्पति चतुर्थ भाव में सम्पत्ति खरीदने, घर उन्नत करने या नए शहर में बसने के सर्वोत्तम गोचरों में से एक है। पारिवारिक जीवन पनपता है — आपका घर ऊष्मा और उत्सव का स्थान बनता है। यदि माता जीवित हैं, तो इस अवधि में उनका आशीर्वाद और सहायता स्पष्ट रूप से मजबूत होती है।',
      },
      elder: {
        en: 'Jupiter blesses your 4th house of inner peace and domestic comfort. This is a year for making your home a sanctuary — comfortable, serene, and spiritually meaningful. Relationships with children and grandchildren who visit bring deep contentment. Gardening, cooking, and home rituals gain significance.',
        hi: 'बृहस्पति आन्तरिक शान्ति और घरेलू सुख के चतुर्थ भाव को आशीर्वाद देते हैं। यह वर्ष अपने घर को एक आश्रय बनाने का है — आरामदायक, शान्त और आध्यात्मिक रूप से सार्थक। मिलने आने वाले बच्चों और नाती-पोतों से गहन सन्तोष मिलता है। बागवानी, पाक कला और गृह अनुष्ठान महत्वपूर्ण होते हैं।',
      },
    },
  },
  5: {
    base: {
      en: 'Jupiter in the 5th house illuminates creativity, romance, and intelligence. Speculative investments tend to succeed. Education pursuits bring recognition. Children bring joy, and romantic relationships deepen with genuine warmth and mutual respect.',
      hi: 'बृहस्पति पञ्चम भाव में रचनात्मकता, प्रेम और बुद्धि को प्रकाशित करते हैं। सट्टा निवेश सफल होने की प्रवृत्ति रखते हैं। शिक्षा प्रयास मान्यता लाते हैं। सन्तान आनन्द लाती है और प्रेम सम्बन्ध सच्ची ऊष्मा और पारस्परिक सम्मान से गहरे होते हैं।',
    },
    byStage: {
      student: {
        en: 'Jupiter illuminates your house of education — this is a breakthrough year for academic achievement. Competitive exams favor you strongly. Creative talents emerge with unusual clarity, and you may discover a passion that shapes your career direction. Romantic interests bring happiness without distraction.',
        hi: 'बृहस्पति आपके शिक्षा भाव को प्रकाशित करते हैं — शैक्षिक उपलब्धि के लिए यह सफलता का वर्ष है। प्रतियोगी परीक्षाएँ आपके पक्ष में हैं। रचनात्मक प्रतिभाएँ असाधारण स्पष्टता से उभरती हैं और आप एक ऐसा जुनून खोज सकते हैं जो आपकी कैरियर दिशा तय करे। प्रेम रुचियाँ बिना विचलन के प्रसन्नता लाती हैं।',
      },
      householder: {
        en: 'Jupiter in the 5th brings joy through children, creative fulfillment, and speculative gains. If planning a family, this is among the most auspicious transits for conception. Investment decisions made this year tend toward success. Creative professionals find their work recognized and rewarded.',
        hi: 'बृहस्पति पञ्चम भाव में सन्तान के माध्यम से आनन्द, रचनात्मक पूर्णता और सट्टा लाभ लाते हैं। यदि परिवार की योजना बना रहे हैं, तो गर्भधारण के लिए यह सर्वाधिक शुभ गोचरों में से एक है। इस वर्ष लिए गए निवेश निर्णय सफलता की ओर प्रवृत्त होते हैं। रचनात्मक पेशेवर अपने कार्य की मान्यता और पुरस्कार पाते हैं।',
      },
      elder: {
        en: 'Jupiter blesses your 5th house of purva punya — the fruits of past merit ripen now. Joy arrives through grandchildren, spiritual study, and creative hobbies. This is a year for writing, teaching, or deepening your meditation practice. The contentment you feel comes from within, not from external achievement.',
        hi: 'बृहस्पति पूर्व पुण्य के पञ्चम भाव को आशीर्वाद देते हैं — पिछले पुण्य के फल अब पकते हैं। नाती-पोतों, आध्यात्मिक अध्ययन और रचनात्मक शौक से आनन्द आता है। यह लेखन, शिक्षण या ध्यान साधना गहरी करने का वर्ष है। जो सन्तोष आप अनुभव करते हैं वह भीतर से आता है, बाह्य उपलब्धि से नहीं।',
      },
    },
  },
  6: {
    base: {
      en: 'Jupiter in the 6th house strengthens your ability to overcome obstacles, rivals, and health challenges. Legal matters tend to resolve favorably. Daily routines improve with discipline and structure. Enemies weaken while your determination grows.',
      hi: 'बृहस्पति षष्ठ भाव में बाधाओं, प्रतिद्वन्द्वियों और स्वास्थ्य चुनौतियों पर विजय की क्षमता को मजबूत करते हैं। कानूनी मामले अनुकूल रूप से सुलझने की प्रवृत्ति रखते हैं। दैनिक दिनचर्या अनुशासन और संरचना से सुधरती है। शत्रु कमजोर होते हैं जबकि आपका संकल्प बढ़ता है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 6th house helps you conquer academic competition and overcome study challenges. If you have been struggling with a subject or exam, expect a turning point. Health habits improve — this is a great time to start exercising regularly. Peer conflicts resolve naturally.',
        hi: 'बृहस्पति षष्ठ भाव में शैक्षिक प्रतियोगिता जीतने और अध्ययन चुनौतियों पर विजय पाने में सहायता करते हैं। यदि किसी विषय या परीक्षा से जूझ रहे थे, तो मोड़ की अपेक्षा करें। स्वास्थ्य आदतें सुधरती हैं — नियमित व्यायाम शुरू करने का उत्तम समय है। साथियों के विवाद स्वाभाविक रूप से सुलझते हैं।',
      },
      householder: {
        en: 'Jupiter in the 6th house helps resolve workplace conflicts, pending litigation, and debt. If you manage employees, team dynamics improve. Health concerns that have been lingering get proper diagnosis and treatment. This is an excellent period for refinancing loans or settling disputes with competitors.',
        hi: 'बृहस्पति षष्ठ भाव में कार्यस्थल विवाद, लम्बित मुकदमे और ऋण सुलझाने में सहायता करते हैं। यदि कर्मचारियों का प्रबन्धन करते हैं, तो टीम गतिशीलता सुधरती है। लम्बित स्वास्थ्य चिन्ताओं का उचित निदान और उपचार होता है। ऋण पुनर्वित्तपोषण या प्रतिस्पर्धियों से विवाद निपटाने का उत्कृष्ट काल है।',
      },
      elder: {
        en: 'Jupiter in the 6th house supports your health recovery and management of chronic conditions. Medical treatments respond well, and you find the right practitioners. Daily wellness routines become enjoyable rather than burdensome. Any legal or financial disputes from the past move toward resolution.',
        hi: 'बृहस्पति षष्ठ भाव में स्वास्थ्य पुनर्प्राप्ति और दीर्घकालिक स्थितियों के प्रबन्धन का समर्थन करते हैं। चिकित्सा उपचार अच्छी प्रतिक्रिया देते हैं और सही चिकित्सक मिलते हैं। दैनिक स्वास्थ्य दिनचर्या भारी के बजाय आनन्ददायक बनती है। अतीत के कानूनी या वित्तीय विवाद समाधान की ओर बढ़ते हैं।',
      },
    },
  },
  7: {
    base: {
      en: 'Jupiter transiting the 7th house blesses partnerships and marriage. Existing relationships gain depth and trust. Business partnerships prosper. If unmarried, this is one of the most favorable transits for meeting a life partner. Social reputation rises.',
      hi: 'बृहस्पति सप्तम भाव में साझेदारी और विवाह को आशीर्वाद देते हैं। मौजूदा सम्बन्ध गहराई और विश्वास पाते हैं। व्यापारिक साझेदारियाँ समृद्ध होती हैं। यदि अविवाहित हैं, तो जीवनसाथी मिलने के सर्वाधिक अनुकूल गोचरों में से एक है। सामाजिक प्रतिष्ठा बढ़ती है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 7th house brings meaningful relationships into your life. You may meet someone who profoundly influences your worldview. Academic collaborations and study partnerships prove especially fruitful. Social confidence increases — this is a year when people are drawn to you.',
        hi: 'बृहस्पति सप्तम भाव में सार्थक सम्बन्ध आपके जीवन में लाते हैं। किसी ऐसे व्यक्ति से मिल सकते हैं जो आपके विश्वदृष्टिकोण को गहराई से प्रभावित करे। शैक्षिक सहयोग और अध्ययन साझेदारियाँ विशेष रूप से फलदायी सिद्ध होती हैं। सामाजिक आत्मविश्वास बढ़ता है — यह वर्ष है जब लोग आपकी ओर आकर्षित होते हैं।',
      },
      householder: {
        en: 'Jupiter in the 7th is a landmark transit for marriage and business partnerships. If married, your relationship enters a golden phase — plan a renewal of commitment or a meaningful trip together. Business partnerships formed now have excellent long-term potential. Legal agreements favor you.',
        hi: 'बृहस्पति सप्तम भाव में विवाह और व्यापारिक साझेदारी के लिए ऐतिहासिक गोचर है। यदि विवाहित हैं, तो सम्बन्ध स्वर्णिम चरण में प्रवेश करता है — प्रतिबद्धता का नवीनीकरण या सार्थक यात्रा की योजना बनाएँ। अब बनाई व्यापारिक साझेदारियों में उत्कृष्ट दीर्घकालिक क्षमता है। कानूनी समझौते आपके पक्ष में होते हैं।',
      },
      elder: {
        en: 'Jupiter blesses your 7th house of companionship. Your relationship with your spouse deepens into a beautiful tapas of shared wisdom. If widowed or single, meaningful companionship may enter your life. Community connections strengthen, and your advisory opinion is sought in social matters.',
        hi: 'बृहस्पति साहचर्य के सप्तम भाव को आशीर्वाद देते हैं। जीवनसाथी के साथ सम्बन्ध साझा ज्ञान की सुन्दर तपस्या में गहरा होता है। यदि विधवा/विधुर या एकल हैं, तो सार्थक साहचर्य जीवन में आ सकता है। सामुदायिक सम्बन्ध मजबूत होते हैं और सामाजिक मामलों में आपकी सलाहकार राय माँगी जाती है।',
      },
    },
  },
  8: {
    base: {
      en: 'Jupiter in the 8th house deepens your interest in hidden knowledge, occult sciences, and transformation. Inheritance or unexpected financial gains are possible. This transit brings psychological insight and the courage to face what you have been avoiding. Health needs attention.',
      hi: 'बृहस्पति अष्टम भाव में गूढ़ ज्ञान, तान्त्रिक विज्ञान और परिवर्तन में रुचि गहरी करते हैं। विरासत या अप्रत्याशित वित्तीय लाभ सम्भव है। यह गोचर मनोवैज्ञानिक अन्तर्दृष्टि और जिसे टालते रहे उसका सामना करने का साहस लाता है। स्वास्थ्य पर ध्यान आवश्यक है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 8th house awakens your interest in research, psychology, and deep study. You may excel in subjects that require investigative thinking — science, philosophy, or coding. Emotionally, you process old fears and emerge stronger. Be mindful of health — rest and recovery matter this year.',
        hi: 'बृहस्पति अष्टम भाव में अनुसन्धान, मनोविज्ञान और गहन अध्ययन में रुचि जागृत करते हैं। जाँच-पड़ताल सोच वाले विषयों में उत्कृष्टता प्राप्त कर सकते हैं — विज्ञान, दर्शन या कोडिंग। भावनात्मक रूप से पुराने भय संसाधित करते हैं और अधिक मजबूत उभरते हैं। स्वास्थ्य पर ध्यान दें — इस वर्ष विश्राम और पुनर्प्राप्ति महत्वपूर्ण है।',
      },
      householder: {
        en: 'Jupiter in the 8th house can bring sudden financial transformation — inheritance, insurance settlements, or partner\'s income boost. Joint finances improve. This is also a deeply psychological transit — therapy or introspection reveals patterns that unlock personal growth. Review life insurance and estate planning.',
        hi: 'बृहस्पति अष्टम भाव में अचानक वित्तीय परिवर्तन ला सकते हैं — विरासत, बीमा निपटान या साथी की आय वृद्धि। संयुक्त वित्त सुधरता है। यह गहरा मनोवैज्ञानिक गोचर भी है — चिकित्सा या आत्मनिरीक्षण ऐसे पैटर्न प्रकट करता है जो व्यक्तिगत विकास खोलते हैं। जीवन बीमा और सम्पत्ति नियोजन की समीक्षा करें।',
      },
      elder: {
        en: 'Jupiter in the 8th house brings a philosophical acceptance of life\'s deeper mysteries. Spiritual practices like meditation or pranayama deepen naturally. You may receive an inheritance or financial windfall. This is a year for settling old accounts — both financial and emotional — with grace and wisdom.',
        hi: 'बृहस्पति अष्टम भाव में जीवन के गहन रहस्यों की दार्शनिक स्वीकृति लाते हैं। ध्यान या प्राणायाम जैसी आध्यात्मिक साधनाएँ स्वाभाविक रूप से गहरी होती हैं। विरासत या वित्तीय अप्रत्याशित लाभ मिल सकता है। यह पुराने हिसाब — वित्तीय और भावनात्मक दोनों — गरिमा और ज्ञान से निपटाने का वर्ष है।',
      },
    },
  },
  9: {
    base: {
      en: 'Jupiter in the 9th house — its own joy — brings the most auspicious results. Long-distance travel, higher education, spiritual growth, and fortune all flourish. Your relationship with teachers and father figures strengthens. This is a year when dharma and luck align powerfully in your favor.',
      hi: 'बृहस्पति नवम भाव में — अपने स्वयं के आनन्द में — सर्वाधिक शुभ फल लाते हैं। दूरस्थ यात्रा, उच्च शिक्षा, आध्यात्मिक विकास और भाग्य सभी पनपते हैं। शिक्षकों और पितृ तुल्य व्यक्तियों से सम्बन्ध मजबूत होता है। यह वर्ष है जब धर्म और भाग्य आपके पक्ष में शक्तिशाली रूप से संरेखित होते हैं।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 9th house is the most powerful transit for higher education. Admissions to prestigious institutions, study abroad opportunities, and scholarship awards are strongly indicated. A teacher or mentor appears who changes your life trajectory. Your worldview expands dramatically this year.',
        hi: 'बृहस्पति नवम भाव में उच्च शिक्षा के लिए सर्वाधिक शक्तिशाली गोचर है। प्रतिष्ठित संस्थानों में प्रवेश, विदेश अध्ययन के अवसर और छात्रवृत्ति पुरस्कार दृढ़ता से संकेतित हैं। एक शिक्षक या गुरु प्रकट होते हैं जो आपकी जीवन दिशा बदलते हैं। आपका विश्वदृष्टिकोण इस वर्ष नाटकीय रूप से विस्तारित होता है।',
      },
      householder: {
        en: 'Jupiter in the 9th is your luckiest transit of the decade. International opportunities open — travel, business expansion abroad, or cross-cultural collaborations. If you have been planning a pilgrimage, this is the year. Your father or a father figure plays a positive role. Legal and ethical matters resolve in your favor.',
        hi: 'बृहस्पति नवम भाव में दशक का सबसे भाग्यशाली गोचर है। अन्तर्राष्ट्रीय अवसर खुलते हैं — यात्रा, विदेश में व्यापार विस्तार या अन्तर-सांस्कृतिक सहयोग। यदि तीर्थयात्रा की योजना बना रहे थे, तो यह वह वर्ष है। पिता या पितृ तुल्य व्यक्ति सकारात्मक भूमिका निभाते हैं। कानूनी और नैतिक मामले आपके पक्ष में सुलझते हैं।',
      },
      elder: {
        en: 'Jupiter in the 9th house brings the deepest spiritual fulfillment. Pilgrimages, sacred study, and encounters with wisdom traditions bring profound peace. Grandchildren may travel to see you, or you visit them. This is a year where your lifelong dharma bears visible fruit — others recognize your wisdom and seek your blessings.',
        hi: 'बृहस्पति नवम भाव में गहनतम आध्यात्मिक पूर्णता लाते हैं। तीर्थयात्राएँ, पवित्र अध्ययन और ज्ञान परम्पराओं से मिलन गहन शान्ति लाते हैं। नाती-पोते मिलने आ सकते हैं या आप उनसे मिलने जाते हैं। यह वर्ष है जब आपका आजीवन धर्म दृश्य फल देता है — दूसरे आपका ज्ञान पहचानते हैं और आपका आशीर्वाद चाहते हैं।',
      },
    },
  },
  10: {
    base: {
      en: 'Jupiter in the 10th house elevates your career and public reputation. Professional recognition, promotions, and leadership opportunities arise. Your work gains visibility, and authority figures support your growth. This is a peak year for career achievement and professional legacy.',
      hi: 'बृहस्पति दशम भाव में कैरियर और सार्वजनिक प्रतिष्ठा को ऊँचा उठाते हैं। व्यावसायिक मान्यता, पदोन्नति और नेतृत्व के अवसर उत्पन्न होते हैं। आपके कार्य को दृश्यता मिलती है और अधिकारी व्यक्ति आपके विकास का समर्थन करते हैं। कैरियर उपलब्धि और व्यावसायिक विरासत का शिखर वर्ष है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 10th house gives you a preview of your future career success. Internships, campus placements, and professional mentorship align beautifully. Authority figures notice your potential. If you are unsure about your career path, clarity arrives this year through real-world experiences.',
        hi: 'बृहस्पति दशम भाव में भविष्य की कैरियर सफलता की झलक देते हैं। इन्टर्नशिप, कैम्पस प्लेसमेन्ट और व्यावसायिक मार्गदर्शन सुन्दर ढंग से संरेखित होते हैं। अधिकारी व्यक्ति आपकी क्षमता पहचानते हैं। यदि कैरियर मार्ग के बारे में अनिश्चित हैं, तो व्यावहारिक अनुभवों से इस वर्ष स्पष्टता आती है।',
      },
      householder: {
        en: 'Jupiter in the 10th is the crowning career transit. Expect promotions, leadership appointments, or public recognition for your work. If you run a business, expansion succeeds. Your professional reputation reaches its zenith. Government or institutional support is available — apply for grants, contracts, or positions.',
        hi: 'बृहस्पति दशम भाव में ताजपोशी का कैरियर गोचर है। पदोन्नति, नेतृत्व नियुक्तियों या कार्य की सार्वजनिक मान्यता की अपेक्षा करें। यदि व्यवसाय चलाते हैं, तो विस्तार सफल होता है। व्यावसायिक प्रतिष्ठा शिखर पर पहुँचती है। सरकारी या संस्थागत सहायता उपलब्ध है — अनुदान, अनुबन्ध या पदों के लिए आवेदन करें।',
      },
      elder: {
        en: 'Jupiter in the 10th house crowns your lifetime of professional effort. Awards, honors, or public recognition for your contributions are likely. Advisory board positions or emeritus roles suit you perfectly. Your legacy solidifies — this is a year when your life\'s work receives the respect it deserves.',
        hi: 'बृहस्पति दशम भाव में आजीवन व्यावसायिक प्रयास का ताजपोशी करते हैं। योगदान के लिए पुरस्कार, सम्मान या सार्वजनिक मान्यता की सम्भावना है। सलाहकार मण्डल या मानद भूमिकाएँ आपके लिए बिल्कुल उपयुक्त हैं। आपकी विरासत सुदृढ़ होती है — यह वर्ष है जब आपके जीवन के कार्य को वह सम्मान मिलता है जिसके वह योग्य है।',
      },
    },
  },
  11: {
    base: {
      en: 'Jupiter in the 11th house fulfills long-held desires and amplifies income. Social networks expand with beneficial connections. Friendships deepen and new allies appear. Group endeavors and community participation bring both material gain and personal satisfaction.',
      hi: 'बृहस्पति एकादश भाव में दीर्घकालिक इच्छाओं को पूर्ण करते हैं और आय बढ़ाते हैं। सामाजिक नेटवर्क लाभकारी सम्पर्कों से विस्तारित होता है। मित्रताएँ गहरी होती हैं और नए सहयोगी प्रकट होते हैं। सामूहिक प्रयास और सामुदायिक भागीदारी भौतिक लाभ और व्यक्तिगत सन्तुष्टि दोनों लाते हैं।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 11th house expands your social circle with people who genuinely support your growth. Study groups, clubs, and online communities become launchpads for opportunity. Older friends or seniors provide crucial guidance. Financially, part-time work or pocket money increases. Dreams start feeling achievable.',
        hi: 'बृहस्पति एकादश भाव में सामाजिक दायरे का विस्तार उन लोगों से करते हैं जो वास्तव में आपके विकास का समर्थन करते हैं। अध्ययन समूह, क्लब और ऑनलाइन समुदाय अवसर के मंच बनते हैं। बड़े मित्र या वरिष्ठ महत्वपूर्ण मार्गदर्शन प्रदान करते हैं। आर्थिक रूप से अंशकालिक कार्य या जेबखर्ची बढ़ती है। सपने साकार होने लगते हैं।',
      },
      householder: {
        en: 'Jupiter in the 11th is the income-maximizing transit. Side income, bonuses, profit sharing, and investment returns all increase. Professional associations and industry networks bring high-value connections. This is the year to reach for ambitious financial targets. Long-planned purchases become affordable.',
        hi: 'बृहस्पति एकादश भाव में आय अधिकतमीकरण का गोचर है। अतिरिक्त आय, बोनस, लाभांश और निवेश प्रतिफल सभी बढ़ते हैं। व्यावसायिक संघ और उद्योग नेटवर्क उच्च-मूल्य सम्पर्क लाते हैं। यह वर्ष महत्वाकांक्षी वित्तीय लक्ष्यों तक पहुँचने का है। दीर्घ-नियोजित खरीदारियाँ किफायती हो जाती हैं।',
      },
      elder: {
        en: 'Jupiter in the 11th house fulfills wishes you had set aside long ago. Social connections bring warmth — old friends reconnect, community groups welcome your participation. Financial security feels assured. This is a year for giving generously to causes you believe in and enjoying the fruits of a lifetime of relationship-building.',
        hi: 'बृहस्पति एकादश भाव में बहुत पहले छोड़ दी गई इच्छाओं को पूर्ण करते हैं। सामाजिक सम्पर्क ऊष्मा लाते हैं — पुराने मित्र फिर जुड़ते हैं, सामुदायिक समूह आपकी भागीदारी का स्वागत करते हैं। वित्तीय सुरक्षा सुनिश्चित अनुभव होती है। यह वर्ष उन कारणों के लिए उदारतापूर्वक देने का है जिन पर आप विश्वास करते हैं और आजीवन सम्बन्ध निर्माण के फलों का आनन्द लेने का है।',
      },
    },
  },
  12: {
    base: {
      en: 'Jupiter in the 12th house turns your attention inward. Expenses may rise, but they often serve a higher purpose — charity, pilgrimage, or spiritual retreat. Foreign connections strengthen. Sleep quality and dream life become significant. This is a year for letting go, healing, and preparing for a new cycle.',
      hi: 'बृहस्पति द्वादश भाव में ध्यान अन्तर्मुखी करते हैं। व्यय बढ़ सकता है, पर प्रायः उच्चतर उद्देश्य — दान, तीर्थ या आध्यात्मिक एकान्तवास — की सेवा करता है। विदेशी सम्पर्क मजबूत होते हैं। नींद की गुणवत्ता और स्वप्न जीवन महत्वपूर्ण होते हैं। यह छोड़ने, उपचार और नए चक्र की तैयारी का वर्ष है।',
    },
    byStage: {
      student: {
        en: 'Jupiter in the 12th house favors study abroad, foreign university applications, and travel for education. You need more solitude than usual — honor that with quiet study time. Expenses on education are investments, not losses. Spiritual curiosity may awaken. Sleep well and protect your energy.',
        hi: 'बृहस्पति द्वादश भाव में विदेश अध्ययन, विदेशी विश्वविद्यालय आवेदन और शिक्षा यात्रा का पक्ष लेते हैं। सामान्य से अधिक एकान्त चाहिए — शान्त अध्ययन समय से इसका सम्मान करें। शिक्षा पर व्यय निवेश है, हानि नहीं। आध्यात्मिक जिज्ञासा जागृत हो सकती है। अच्छी नींद लें और ऊर्जा की रक्षा करें।',
      },
      householder: {
        en: 'Jupiter in the 12th house increases expenses — but purposefully. Foreign business connections, charitable giving, and investments in intangible assets (education, health, spirituality) bring long-term returns. A pilgrimage or retreat recharges you deeply. Be mindful of overspending, but do not fear generosity.',
        hi: 'बृहस्पति द्वादश भाव में व्यय बढ़ाते हैं — पर उद्देश्यपूर्ण ढंग से। विदेशी व्यापार सम्पर्क, दान और अमूर्त सम्पत्तियों (शिक्षा, स्वास्थ्य, आध्यात्मिकता) में निवेश दीर्घकालिक प्रतिफल लाते हैं। तीर्थयात्रा या एकान्तवास गहराई से पुनर्जीवित करता है। अधिक व्यय से सावधान रहें, पर उदारता से न डरें।',
      },
      elder: {
        en: 'Jupiter in the 12th house brings the most beautiful spiritual transit of this cycle. Meditation deepens, sleep becomes restorative, and inner peace settles in. Charitable giving brings profound satisfaction. Hospital visits (if needed) have favorable outcomes. This is a year for releasing worldly attachments and finding contentment within.',
        hi: 'बृहस्पति द्वादश भाव में इस चक्र का सबसे सुन्दर आध्यात्मिक गोचर लाते हैं। ध्यान गहरा होता है, नींद पुनर्स्थापक बनती है और आन्तरिक शान्ति स्थापित होती है। दान गहन सन्तुष्टि लाता है। अस्पताल भ्रमण (यदि आवश्यक) के अनुकूल परिणाम होते हैं। यह सांसारिक आसक्तियों को त्यागने और भीतर सन्तोष पाने का वर्ष है।',
      },
    },
  },
};

// ── Saturn Transit Effects (Houses 1-12) ──

export const SATURN_STAGE_EFFECTS: Record<number, StageTransitEffect> = {
  1: {
    base: {
      en: 'Saturn transiting your 1st house brings a period of serious self-assessment. You feel the weight of responsibility more than usual. Health requires attention — particularly bones, joints, and stamina. This is a maturing transit that strips away pretense and builds character through effort.',
      hi: 'शनि प्रथम भाव में गम्भीर आत्म-मूल्यांकन का काल लाते हैं। जिम्मेदारी का भार सामान्य से अधिक अनुभव होता है। स्वास्थ्य पर ध्यान आवश्यक — विशेषकर हड्डियाँ, जोड़ और सहनशक्ति। यह परिपक्वता का गोचर है जो दिखावा हटाकर प्रयास से चरित्र निर्माण करता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 1st house demands discipline and maturity beyond your years. Academic pressure intensifies, but the rewards for genuine effort are lasting. You may feel isolated or burdened — this is temporary. Build routines, prioritize health, and avoid shortcuts. The character you forge now defines your adult life.',
        hi: 'शनि प्रथम भाव में उम्र से परे अनुशासन और परिपक्वता की माँग करते हैं। शैक्षिक दबाव तीव्र होता है, पर सच्चे प्रयास का पुरस्कार स्थायी है। अकेलापन या बोझ अनुभव हो सकता है — यह अस्थायी है। दिनचर्या बनाएँ, स्वास्थ्य को प्राथमिकता दें, शॉर्टकट से बचें। अब जो चरित्र गढ़ते हैं वह वयस्क जीवन को परिभाषित करता है।',
      },
      established: {
        en: 'Saturn in the 1st house at this stage prompts a fundamental reassessment of your identity and direction. You may feel physically slower or weighed down — preventive health checks are essential. Professional identity shifts from "what you do" to "what you stand for." Embrace the pruning — what remains is authentic.',
        hi: 'शनि प्रथम भाव में इस अवस्था पर पहचान और दिशा का मौलिक पुनर्मूल्यांकन प्रेरित करते हैं। शारीरिक रूप से धीमा या भारी अनुभव हो सकता है — निवारक स्वास्थ्य जाँच आवश्यक है। व्यावसायिक पहचान "क्या करते हैं" से "किसके लिए खड़े हैं" में बदलती है। छँटाई को स्वीकार करें — जो शेष रहता है वह प्रामाणिक है।',
      },
      sage: {
        en: 'Saturn returns to your 1st house, completing another cycle of maturation. Physical limitations become more pronounced — accept help gracefully and modify your daily routine. This transit deepens your philosophical understanding of aging and impermanence. Your patience and equanimity inspire those around you.',
        hi: 'शनि प्रथम भाव में लौटकर परिपक्वता का एक और चक्र पूर्ण करते हैं। शारीरिक सीमाएँ अधिक स्पष्ट होती हैं — गरिमापूर्वक सहायता स्वीकार करें और दैनिक दिनचर्या संशोधित करें। यह गोचर बुढ़ापे और अनित्यता की दार्शनिक समझ गहरी करता है। आपका धैर्य और समभाव आस-पास के लोगों को प्रेरित करता है।',
      },
    },
  },
  2: {
    base: {
      en: 'Saturn in the 2nd house restricts easy income flow and demands financial discipline. Speech becomes more measured and deliberate. Family responsibilities increase. This is a period for budgeting carefully, avoiding debt, and building reserves through sustained effort rather than windfalls.',
      hi: 'शनि द्वितीय भाव में सहज आय प्रवाह को प्रतिबन्धित करते हैं और वित्तीय अनुशासन की माँग करते हैं। वाणी अधिक सोची-समझी और सुविचारित होती है। पारिवारिक जिम्मेदारियाँ बढ़ती हैं। सावधानी से बजट बनाने, ऋण से बचने और अचानक लाभ के बजाय निरन्तर प्रयास से भण्डार बनाने का काल है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 2nd house teaches you the value of money early. Pocket money or part-time income may shrink — learn to manage with less. Your speaking skills improve through practice, not talent alone. Family may face financial stress; your understanding and maturity help everyone cope.',
        hi: 'शनि द्वितीय भाव में जल्दी पैसे का मूल्य सिखाते हैं। जेबखर्ची या अंशकालिक आय घट सकती है — कम में प्रबन्ध करना सीखें। वाक्कला प्रतिभा से नहीं, अभ्यास से सुधरती है। परिवार को वित्तीय तनाव हो सकता है; आपकी समझ और परिपक्वता सबकी सहायता करती है।',
      },
      established: {
        en: 'Saturn in the 2nd house at your stage signals a phase of financial consolidation. Income may plateau — focus on reducing expenses and optimizing existing investments rather than seeking new ones. Family financial responsibilities (aging parents, children\'s education) feel heavy but manageable with planning.',
        hi: 'शनि द्वितीय भाव में आपकी अवस्था पर वित्तीय समेकन का चरण संकेत करते हैं। आय स्थिर हो सकती है — नए निवेश खोजने के बजाय व्यय कम करने और मौजूदा निवेश अनुकूलित करने पर ध्यान दें। पारिवारिक वित्तीय जिम्मेदारियाँ (वृद्ध माता-पिता, बच्चों की शिक्षा) भारी लगती हैं पर योजना से प्रबन्धनीय हैं।',
      },
      sage: {
        en: 'Saturn in the 2nd house encourages simplicity in speech and lifestyle. Financial needs are modest — ensure your arrangements are clear and your family understands your wishes. Eat simply and mindfully. Your words carry the weight of experience; use them sparingly and people will listen more carefully.',
        hi: 'शनि द्वितीय भाव में वाणी और जीवनशैली में सादगी प्रोत्साहित करते हैं। वित्तीय आवश्यकताएँ मामूली हैं — सुनिश्चित करें कि व्यवस्थाएँ स्पष्ट हों और परिवार आपकी इच्छाएँ समझे। सादा और सचेत भोजन करें। आपके शब्दों में अनुभव का भार है; संयम से बोलें और लोग अधिक ध्यान से सुनेंगे।',
      },
    },
  },
  3: {
    base: {
      en: 'Saturn in the 3rd house strengthens your determination and perseverance. Short travels may involve delays or hardships that ultimately prove worthwhile. Relationships with siblings require patience. Communication becomes more structured and purposeful. Courage is tested and forged through real challenges.',
      hi: 'शनि तृतीय भाव में संकल्प और धैर्य को मजबूत करते हैं। लघु यात्राओं में विलम्ब या कठिनाइयाँ हो सकती हैं जो अन्ततः सार्थक सिद्ध होती हैं। भाई-बहनों से सम्बन्धों में धैर्य आवश्यक। संवाद अधिक संरचित और उद्देश्यपूर्ण होता है। वास्तविक चुनौतियों से साहस परखा और गढ़ा जाता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 3rd house teaches you to communicate with precision and substance. Quick answers and superficial knowledge no longer suffice — depth is rewarded. Group projects test your patience with peers. Sibling relationships may strain but mature. Physical endurance improves through consistent practice.',
        hi: 'शनि तृतीय भाव में सटीकता और तत्व के साथ संवाद करना सिखाते हैं। त्वरित उत्तर और सतही ज्ञान अब पर्याप्त नहीं — गहराई को पुरस्कृत किया जाता है। सामूहिक परियोजनाएँ साथियों के साथ धैर्य परखती हैं। भाई-बहन सम्बन्ध तनावपूर्ण हो सकते हैं पर परिपक्व होते हैं। निरन्तर अभ्यास से शारीरिक सहनशक्ति सुधरती है।',
      },
      established: {
        en: 'Saturn in the 3rd house at your stage brings a no-nonsense approach to communication. Business writing, contracts, and negotiations benefit from your increased precision. Siblings or neighbors may need your help — respond with boundaries, not guilt. Daily commutes and routines feel heavy; simplify where possible.',
        hi: 'शनि तृतीय भाव में आपकी अवस्था पर संवाद में गम्भीर दृष्टिकोण लाते हैं। व्यावसायिक लेखन, अनुबन्ध और वार्ताएँ बढ़ी हुई सटीकता से लाभ पाते हैं। भाई-बहन या पड़ोसियों को आपकी सहायता चाहिए हो सकती है — अपराधबोध नहीं, सीमाओं के साथ प्रतिक्रिया दें। दैनिक आवागमन और दिनचर्या भारी लगती है; जहाँ सम्भव हो सरल करें।',
      },
      sage: {
        en: 'Saturn in the 3rd house brings quiet strength to your communication. You speak less but mean more. Writing — letters, journals, or even a memoir — becomes a meditative practice. Neighbors and community members rely on your steady presence. Physical movement may slow, but daily walks remain important for wellbeing.',
        hi: 'शनि तृतीय भाव में संवाद में शान्त शक्ति लाते हैं। कम बोलते हैं पर अधिक अर्थपूर्ण। लेखन — पत्र, डायरी या संस्मरण — ध्यान साधना बनता है। पड़ोसी और समुदाय के लोग आपकी स्थिर उपस्थिति पर निर्भर करते हैं। शारीरिक गति धीमी हो सकती है, पर दैनिक टहलना स्वास्थ्य के लिए महत्वपूर्ण रहता है।',
      },
    },
  },
  4: {
    base: {
      en: 'Saturn in the 4th house brings challenges related to home, property, and emotional security. Renovation delays, real estate complications, or domestic tension may arise. Mother\'s health may need attention. Through these tests, you build genuine inner stability that no external circumstance can shake.',
      hi: 'शनि चतुर्थ भाव में घर, सम्पत्ति और भावनात्मक सुरक्षा से सम्बन्धित चुनौतियाँ लाते हैं। नवीनीकरण में विलम्ब, अचल सम्पत्ति जटिलताएँ या घरेलू तनाव उत्पन्न हो सकते हैं। माता के स्वास्थ्य पर ध्यान आवश्यक। इन परीक्षाओं से आप वास्तविक आन्तरिक स्थिरता बनाते हैं जिसे कोई बाह्य परिस्थिति नहीं हिला सकती।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 4th house may create an uncomfortable home environment — tension with parents, cramped study space, or frequent moves. Use this as motivation to build your own future stability. Emotional resilience grows through these challenges. Focus on academics as your path to independence.',
        hi: 'शनि चतुर्थ भाव में असहज गृह वातावरण बना सकते हैं — माता-पिता से तनाव, संकुचित अध्ययन स्थान या बार-बार स्थानान्तरण। इसे अपनी भविष्य की स्थिरता बनाने की प्रेरणा के रूप में प्रयोग करें। इन चुनौतियों से भावनात्मक लचीलापन बढ़ता है। स्वतन्त्रता के मार्ग के रूप में शिक्षा पर ध्यान केन्द्रित करें।',
      },
      established: {
        en: 'Saturn in the 4th house at your stage may bring property disputes, home maintenance burdens, or concerns about aging parents. Real estate transactions move slowly — patience is essential. Your role as the family anchor intensifies. Invest in making your home physically comfortable; it directly affects your professional energy.',
        hi: 'शनि चतुर्थ भाव में आपकी अवस्था पर सम्पत्ति विवाद, गृह रखरखाव का बोझ या वृद्ध माता-पिता की चिन्ता ला सकते हैं। अचल सम्पत्ति लेन-देन धीमा चलता है — धैर्य आवश्यक। पारिवारिक आधार के रूप में आपकी भूमिका तीव्र होती है। घर को शारीरिक रूप से आरामदायक बनाने में निवेश करें; यह व्यावसायिक ऊर्जा को सीधे प्रभावित करता है।',
      },
      sage: {
        en: 'Saturn in the 4th house asks you to find peace within, regardless of external living conditions. Home repairs or downsizing may be necessary. Your emotional foundation has been built over decades — trust it. If caregiving responsibilities arise, accept support from family. Create a simple, sacred space for daily practice.',
        hi: 'शनि चतुर्थ भाव में बाह्य रहने की स्थितियों की परवाह किए बिना भीतर शान्ति खोजने को कहते हैं। घर की मरम्मत या छोटे स्थान में जाना आवश्यक हो सकता है। आपकी भावनात्मक नींव दशकों में बनी है — उस पर विश्वास करें। यदि देखभाल की जिम्मेदारियाँ आएँ, तो परिवार से सहायता स्वीकार करें। दैनिक साधना के लिए सादा, पवित्र स्थान बनाएँ।',
      },
    },
  },
  5: {
    base: {
      en: 'Saturn in the 5th house restricts easy pleasures and demands disciplined creativity. Romance takes on a serious tone — casual relationships lose appeal. Children may bring responsibilities. Investments require careful analysis rather than speculation. Education demands sustained effort for results.',
      hi: 'शनि पञ्चम भाव में सहज सुखों को प्रतिबन्धित करते हैं और अनुशासित रचनात्मकता की माँग करते हैं। प्रेम गम्भीर स्वर लेता है — आकस्मिक सम्बन्ध आकर्षण खो देते हैं। सन्तान जिम्मेदारियाँ ला सकती है। निवेश में सट्टे के बजाय सावधान विश्लेषण आवश्यक। शिक्षा परिणामों के लिए निरन्तर प्रयास माँगती है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 5th house makes academic achievement harder-won but more meaningful. Cramming does not work — only deep, sustained study yields results. Romantic relationships feel heavy or grow serious beyond your years. Creative pursuits require discipline. The effort you invest now builds skills that last a lifetime.',
        hi: 'शनि पञ्चम भाव में शैक्षिक उपलब्धि कठिन पर अधिक सार्थक बनाते हैं। रटना काम नहीं करता — केवल गहन, निरन्तर अध्ययन परिणाम देता है। प्रेम सम्बन्ध भारी या उम्र से परे गम्भीर होते हैं। रचनात्मक प्रयासों में अनुशासन आवश्यक। अब जो प्रयास लगाते हैं वह आजीवन कौशल बनाता है।',
      },
      established: {
        en: 'Saturn in the 5th house at your stage often manifests as concern about children — their education, career, or wellbeing. Speculative investments should be avoided; stick to proven strategies. Creative projects need persistence, not inspiration. If you mentor younger colleagues, this transit makes you an especially effective guide.',
        hi: 'शनि पञ्चम भाव में आपकी अवस्था पर प्रायः सन्तान — शिक्षा, कैरियर या कल्याण — की चिन्ता प्रकट होती है। सट्टा निवेश से बचें; सिद्ध रणनीतियों पर टिके रहें। रचनात्मक परियोजनाओं में प्रेरणा नहीं, दृढ़ता चाहिए। यदि युवा सहकर्मियों का मार्गदर्शन करते हैं, तो यह गोचर आपको विशेष रूप से प्रभावी मार्गदर्शक बनाता है।',
      },
      sage: {
        en: 'Saturn in the 5th house brings a reflective quality to your creative and spiritual life. Simple creative practices — drawing, writing poetry, singing bhajans — bring more satisfaction than elaborate projects. Grandchildren may need your stability during their own challenges. Your purva punya is your greatest wealth now.',
        hi: 'शनि पञ्चम भाव में रचनात्मक और आध्यात्मिक जीवन में चिन्तनशील गुण लाते हैं। सादी रचनात्मक साधनाएँ — चित्रकारी, कविता लिखना, भजन गाना — विस्तृत परियोजनाओं से अधिक सन्तुष्टि देती हैं। नाती-पोतों को उनकी चुनौतियों में आपकी स्थिरता चाहिए हो सकती है। पूर्व पुण्य अब आपका सबसे बड़ा धन है।',
      },
    },
  },
  6: {
    base: {
      en: 'Saturn in the 6th house is a favorable position — it helps you defeat enemies, overcome obstacles, and establish disciplined health routines. Legal disputes tend to resolve. Service-oriented work thrives. This transit builds resilience through methodical effort and patient endurance.',
      hi: 'शनि षष्ठ भाव में अनुकूल स्थिति है — शत्रुओं को पराजित करने, बाधाओं पर विजय पाने और अनुशासित स्वास्थ्य दिनचर्या स्थापित करने में सहायता करते हैं। कानूनी विवाद सुलझने की प्रवृत्ति। सेवा-उन्मुख कार्य पनपता है। यह गोचर व्यवस्थित प्रयास और धैर्यपूर्ण सहनशीलता से लचीलापन बनाता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 6th house helps you build exceptional study discipline. Competition feels manageable, and you outwork your rivals. If you have been struggling with a health issue, consistent treatment shows results. Part-time work or service activities build real-world skills. Enemies and detractors lose power over you.',
        hi: 'शनि षष्ठ भाव में असाधारण अध्ययन अनुशासन बनाने में सहायता करते हैं। प्रतियोगिता प्रबन्धनीय लगती है और प्रतिद्वन्द्वियों से अधिक परिश्रम करते हैं। यदि स्वास्थ्य समस्या से जूझ रहे थे, तो निरन्तर उपचार परिणाम दिखाता है। अंशकालिक कार्य या सेवा गतिविधियाँ व्यावहारिक कौशल बनाती हैं। शत्रु और निन्दक आप पर शक्ति खो देते हैं।',
      },
      established: {
        en: 'Saturn in the 6th house at your stage strengthens your management of health, employees, and daily operations. Chronic conditions respond to disciplined treatment plans. Workplace restructuring succeeds. Legal matters and regulatory compliance proceed smoothly. This is a transit that rewards your systematic approach to life.',
        hi: 'शनि षष्ठ भाव में आपकी अवस्था पर स्वास्थ्य, कर्मचारियों और दैनिक संचालन के प्रबन्धन को मजबूत करते हैं। दीर्घकालिक स्थितियाँ अनुशासित उपचार योजनाओं पर प्रतिक्रिया देती हैं। कार्यस्थल पुनर्गठन सफल होता है। कानूनी मामले और नियामक अनुपालन सुचारू रूप से आगे बढ़ते हैं। यह गोचर जीवन के प्रति व्यवस्थित दृष्टिकोण को पुरस्कृत करता है।',
      },
      sage: {
        en: 'Saturn in the 6th house supports your health management with discipline and routine. Daily walks, simple meals, and regular medical check-ups keep you strong. If you are dealing with chronic ailments, this transit brings the determination to follow through on treatment. Seva (selfless service) brings deep fulfillment.',
        hi: 'शनि षष्ठ भाव में अनुशासन और दिनचर्या से स्वास्थ्य प्रबन्धन का समर्थन करते हैं। दैनिक टहलना, सादा भोजन और नियमित चिकित्सा जाँच आपको मजबूत रखते हैं। यदि दीर्घकालिक रोगों से जूझ रहे हैं, तो यह गोचर उपचार पर दृढ़ रहने का संकल्प लाता है। सेवा (निस्वार्थ सेवा) गहन पूर्णता लाती है।',
      },
    },
  },
  7: {
    base: {
      en: 'Saturn in the 7th house tests partnerships and marriage. Relationships feel the weight of unspoken expectations. Business partnerships require renegotiation. If single, you attract mature or older partners. This transit rewards commitment and honest communication, while exposing relationships built on convenience.',
      hi: 'शनि सप्तम भाव में साझेदारी और विवाह की परीक्षा लेते हैं। सम्बन्धों पर अनकही अपेक्षाओं का भार अनुभव होता है। व्यापारिक साझेदारियों में पुनर्वार्ता आवश्यक। यदि अविवाहित हैं, तो परिपक्व या बड़ी उम्र के साथी आकर्षित होते हैं। यह गोचर प्रतिबद्धता और ईमानदार संवाद को पुरस्कृत करता है, जबकि सुविधा पर बने सम्बन्धों को उजागर करता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 7th house makes you serious about relationships. Casual dating loses its appeal — you want depth and commitment. This is not a negative thing; it means you are maturing emotionally. Academic partnerships require clear expectations. You learn who your real friends are during this transit.',
        hi: 'शनि सप्तम भाव में सम्बन्धों के प्रति गम्भीर बनाते हैं। आकस्मिक डेटिंग आकर्षण खो देती है — गहराई और प्रतिबद्धता चाहते हैं। यह नकारात्मक नहीं; इसका अर्थ भावनात्मक परिपक्वता है। शैक्षिक साझेदारियों में स्पष्ट अपेक्षाएँ आवश्यक। इस गोचर में जानते हैं कि सच्चे मित्र कौन हैं।',
      },
      established: {
        en: 'Saturn in the 7th house at your stage brings relationship responsibilities to the forefront. If married, unresolved issues demand honest conversation. Business partnerships may feel restrictive — renegotiate terms rather than suffering in silence. This transit either deepens genuine bonds or dissolves those based on obligation alone.',
        hi: 'शनि सप्तम भाव में आपकी अवस्था पर सम्बन्ध जिम्मेदारियों को अग्रभूमि में लाते हैं। यदि विवाहित हैं, तो अनसुलझे मुद्दे ईमानदार बातचीत की माँग करते हैं। व्यापारिक साझेदारियाँ प्रतिबन्धक लग सकती हैं — चुपचाप सहने के बजाय शर्तें पुनर्वार्ता करें। यह गोचर सच्चे बन्धनों को गहरा करता है या केवल कर्तव्य पर आधारित बन्धन विलीन करता है।',
      },
      sage: {
        en: 'Saturn in the 7th house tests the durability of your closest relationship. If your spouse is alive, this is a time for patience, service, and deep companionship through difficulties. If alone, accept the solitude as a teacher rather than an adversary. Community relationships require your steady, calming presence.',
        hi: 'शनि सप्तम भाव में निकटतम सम्बन्ध की टिकाऊपन की परीक्षा लेते हैं। यदि जीवनसाथी जीवित हैं, तो कठिनाइयों में धैर्य, सेवा और गहन साहचर्य का समय है। यदि अकेले हैं, तो एकान्त को शत्रु नहीं, शिक्षक के रूप में स्वीकार करें। सामुदायिक सम्बन्धों में आपकी स्थिर, शान्तिदायक उपस्थिति आवश्यक है।',
      },
    },
  },
  8: {
    base: {
      en: 'Saturn in the 8th house brings a period of deep transformation and hidden challenges. Joint finances may face restrictions. Health requires vigilance, especially chronic conditions. This transit forces confrontation with mortality, debts, and dependency — emerging from it, you gain unshakeable inner strength.',
      hi: 'शनि अष्टम भाव में गहन परिवर्तन और छिपी चुनौतियों का काल लाते हैं। संयुक्त वित्त प्रतिबन्ध का सामना कर सकता है। स्वास्थ्य में सतर्कता आवश्यक, विशेषकर दीर्घकालिक स्थितियाँ। यह गोचर मृत्यु, ऋण और निर्भरता का सामना करने को बाध्य करता है — इससे निकलकर अडिग आन्तरिक शक्ति प्राप्त करते हैं।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 8th house can feel emotionally intense. You may grapple with anxiety, existential questions, or family secrets. Channel this energy into research, psychology, or deep academic inquiry. Financial dependence on family feels uncomfortable — plan for future independence. Seek trusted counselors if the emotional weight grows heavy.',
        hi: 'शनि अष्टम भाव में भावनात्मक रूप से तीव्र लग सकता है। चिन्ता, अस्तित्ववादी प्रश्नों या पारिवारिक रहस्यों से जूझ सकते हैं। इस ऊर्जा को अनुसन्धान, मनोविज्ञान या गहन शैक्षिक जाँच में प्रवाहित करें। परिवार पर वित्तीय निर्भरता असहज लगती है — भविष्य की स्वतन्त्रता की योजना बनाएँ। भावनात्मक भार बढ़े तो विश्वसनीय परामर्शदाता से मिलें।',
      },
      established: {
        en: 'Saturn in the 8th house at your stage demands serious attention to insurance, inheritance planning, and tax obligations. Joint financial structures need review. Health screening for chronic or hereditary conditions is non-negotiable. This transit also deepens your psychological maturity — uncomfortable truths lead to genuine liberation.',
        hi: 'शनि अष्टम भाव में आपकी अवस्था पर बीमा, विरासत नियोजन और कर दायित्वों पर गम्भीर ध्यान माँगते हैं। संयुक्त वित्तीय संरचनाओं की समीक्षा आवश्यक। दीर्घकालिक या वंशानुगत स्थितियों की स्वास्थ्य जाँच अनिवार्य। यह गोचर मनोवैज्ञानिक परिपक्वता भी गहरी करता है — असहज सत्य वास्तविक मुक्ति की ओर ले जाते हैं।',
      },
      sage: {
        en: 'Saturn in the 8th house confronts you with the great questions of mortality and transcendence. Health needs consistent monitoring. Financial matters — wills, trusts, beneficiary designations — must be finalized. Paradoxically, this deep introspection brings peace rather than fear. You are closer to moksha than ever before.',
        hi: 'शनि अष्टम भाव में मृत्यु और पारलौकिकता के महान प्रश्नों से सामना कराते हैं। स्वास्थ्य की निरन्तर निगरानी आवश्यक। वित्तीय मामले — वसीयत, न्यास, लाभार्थी पदनाम — अन्तिम रूप देने चाहिए। विरोधाभासी रूप से यह गहन आत्मनिरीक्षण भय के बजाय शान्ति लाता है। आप मोक्ष के पहले से कहीं अधिक निकट हैं।',
      },
    },
  },
  9: {
    base: {
      en: 'Saturn in the 9th house brings a pragmatic approach to religion, philosophy, and higher learning. Blind faith is replaced by tested conviction. Long-distance travel involves delays but yields valuable experiences. Your relationship with father figures or mentors becomes more realistic and grounded.',
      hi: 'शनि नवम भाव में धर्म, दर्शन और उच्च शिक्षा के प्रति व्यावहारिक दृष्टिकोण लाते हैं। अन्ध विश्वास परीक्षित विश्वास से प्रतिस्थापित होता है। दूरस्थ यात्रा में विलम्ब पर मूल्यवान अनुभव प्राप्त होते हैं। पितृ तुल्य व्यक्तियों या गुरुओं से सम्बन्ध अधिक यथार्थवादी और ठोस होता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 9th house challenges your beliefs and worldview. Higher education requires extra effort — admissions may be delayed, not denied. Study abroad involves logistical hurdles but transforms you permanently. Question what you have been taught, but do so with humility. The teacher who demands the most from you is the one to follow.',
        hi: 'शनि नवम भाव में विश्वासों और विश्वदृष्टिकोण को चुनौती देते हैं। उच्च शिक्षा में अतिरिक्त प्रयास आवश्यक — प्रवेश विलम्बित हो सकता है, अस्वीकृत नहीं। विदेश अध्ययन में कार्यकारी बाधाएँ पर आपको स्थायी रूप से बदलता है। जो सिखाया गया उस पर प्रश्न करें, पर विनम्रता से। जो शिक्षक सबसे अधिक माँगे, उनका अनुसरण करें।',
      },
      established: {
        en: 'Saturn in the 9th house at your stage refines your philosophical outlook. You become skeptical of easy answers and institutional authority. Legal processes involving ethics or compliance need careful attention. International business faces regulatory friction. Your evolving worldview may conflict with family traditions — navigate with respect.',
        hi: 'शनि नवम भाव में आपकी अवस्था पर दार्शनिक दृष्टिकोण को परिष्कृत करते हैं। सहज उत्तरों और संस्थागत अधिकार के प्रति सन्देही हो जाते हैं। नैतिकता या अनुपालन से जुड़ी कानूनी प्रक्रियाओं पर सावधान ध्यान चाहिए। अन्तर्राष्ट्रीय व्यापार नियामक बाधाओं का सामना करता है। बदलता विश्वदृष्टिकोण पारिवारिक परम्पराओं से टकरा सकता है — सम्मान से चलें।',
      },
      sage: {
        en: 'Saturn in the 9th house distills your spiritual understanding to its purest form. Rituals may feel hollow unless they carry genuine devotion. Long-held religious beliefs are tested and those that survive become unshakeable faith. This is the transit of the true philosopher — your dharma becomes lived experience rather than borrowed doctrine.',
        hi: 'शनि नवम भाव में आध्यात्मिक समझ को शुद्धतम रूप तक संशोधित करते हैं। अनुष्ठान खोखले लग सकते हैं जब तक सच्ची भक्ति न हो। दीर्घकालिक धार्मिक विश्वास परीक्षित होते हैं और जो बचते हैं वे अडिग आस्था बन जाते हैं। यह सच्चे दार्शनिक का गोचर है — आपका धर्म उधार सिद्धान्त के बजाय जीवित अनुभव बनता है।',
      },
    },
  },
  10: {
    base: {
      en: 'Saturn in the 10th house — its natural strength — brings the heaviest professional responsibilities alongside the greatest career potential. Hard work is noticed and rewarded, but slowly. Authority figures place demands on you. This transit builds your professional legacy through persistent effort.',
      hi: 'शनि दशम भाव में — अपनी स्वाभाविक शक्ति में — सबसे भारी व्यावसायिक जिम्मेदारियों के साथ सबसे बड़ी कैरियर क्षमता लाते हैं। कड़ी मेहनत देखी जाती है और पुरस्कृत होती है, पर धीरे-धीरे। अधिकारी व्यक्ति माँगें रखते हैं। यह गोचर निरन्तर प्रयास से व्यावसायिक विरासत बनाता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 10th house gives you a preview of professional life\'s demands. Part-time work, internships, or academic leadership roles feel heavy but build real competence. Career decisions made under this transit — even if difficult — tend to be the right ones. Your work ethic is being forged; trust the process.',
        hi: 'शनि दशम भाव में पेशेवर जीवन की माँगों की पूर्वझलक देते हैं। अंशकालिक कार्य, इन्टर्नशिप या शैक्षिक नेतृत्व भूमिकाएँ भारी लगती हैं पर वास्तविक क्षमता बनाती हैं। इस गोचर में लिए कैरियर निर्णय — कठिन होने पर भी — सही होने की प्रवृत्ति रखते हैं। कार्य नैतिकता गढ़ी जा रही है; प्रक्रिया पर विश्वास करें।',
      },
      established: {
        en: 'Saturn in the 10th house at your stage is the ultimate career crucible. You carry the heaviest professional load, but the authority and recognition you earn now becomes permanent. Leadership succession, organizational restructuring, and strategic pivots fall on your shoulders. Deliver consistently — your legacy is being carved in stone.',
        hi: 'शनि दशम भाव में आपकी अवस्था पर अन्तिम कैरियर कसौटी है। सबसे भारी व्यावसायिक भार उठाते हैं, पर अब अर्जित अधिकार और मान्यता स्थायी बनती है। नेतृत्व उत्तराधिकार, संगठनात्मक पुनर्गठन और रणनीतिक मोड़ आपके कन्धों पर हैं। निरन्तर प्रदर्शन करें — आपकी विरासत पत्थर में उकेरी जा रही है।',
      },
      sage: {
        en: 'Saturn in the 10th house at your stage is about the final chapter of your public life. Advisory roles, honorary positions, or community leadership define this period. Your reputation precedes you — protect it with integrity. Younger professionals seek your counsel; give it generously but without attachment to whether they follow it.',
        hi: 'शनि दशम भाव में आपकी अवस्था पर सार्वजनिक जीवन का अन्तिम अध्याय है। सलाहकार भूमिकाएँ, मानद पद या सामुदायिक नेतृत्व इस काल को परिभाषित करते हैं। आपकी प्रतिष्ठा आपसे पहले पहुँचती है — ईमानदारी से उसकी रक्षा करें। युवा पेशेवर आपकी सलाह चाहते हैं; उदारतापूर्वक दें पर इस आसक्ति के बिना कि वे मानें या नहीं।',
      },
    },
  },
  11: {
    base: {
      en: 'Saturn in the 11th house gradually increases income through sustained effort. Social networks are pruned to genuine connections. Large group activities or organizations demand your time and effort. Long-term financial goals see steady progress. Friendships become fewer but deeper.',
      hi: 'शनि एकादश भाव में निरन्तर प्रयास से आय धीरे-धीरे बढ़ाते हैं। सामाजिक नेटवर्क सच्चे सम्पर्कों तक सीमित होता है। बड़ी सामूहिक गतिविधियाँ या संगठन समय और प्रयास माँगते हैं। दीर्घकालिक वित्तीय लक्ष्य स्थिर प्रगति देखते हैं। मित्रताएँ कम पर गहरी होती हैं।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 11th house teaches you who your real friends are. Social circles shrink, but the friendships that survive are lifelong. Group projects require you to carry more than your share — frustrating but character-building. Financial goals feel distant; start planning systematically rather than wishing.',
        hi: 'शनि एकादश भाव में सिखाते हैं कि सच्चे मित्र कौन हैं। सामाजिक दायरा सिकुड़ता है, पर जो मित्रताएँ बचती हैं वे आजीवन होती हैं। सामूहिक परियोजनाओं में अपने हिस्से से अधिक उठाना पड़ता है — निराशाजनक पर चरित्र निर्माणकारी। वित्तीय लक्ष्य दूर लगते हैं; इच्छा के बजाय व्यवस्थित योजना बनाएँ।',
      },
      established: {
        en: 'Saturn in the 11th house at your stage builds income through patience, not shortcuts. Professional networks consolidate around people who genuinely support mutual growth. Industry associations or board positions demand your time but expand your influence. Long-term investment strategies finally begin to show compounding returns.',
        hi: 'शनि एकादश भाव में आपकी अवस्था पर शॉर्टकट नहीं, धैर्य से आय बनाते हैं। व्यावसायिक नेटवर्क उन लोगों के इर्द-गिर्द सुदृढ़ होता है जो वास्तव में पारस्परिक विकास का समर्थन करते हैं। उद्योग संघ या बोर्ड पद समय माँगते हैं पर प्रभाव विस्तारित करते हैं। दीर्घकालिक निवेश रणनीतियाँ अन्ततः चक्रवृद्धि प्रतिफल दिखाने लगती हैं।',
      },
      sage: {
        en: 'Saturn in the 11th house brings the satisfaction of seeing long-term plans bear fruit. Financial security is stable if not exciting. The friends who remain in your life at this stage are precious — invest in those relationships. Community involvement gives your days structure and purpose beyond personal concerns.',
        hi: 'शनि एकादश भाव में दीर्घकालिक योजनाओं को फलते देखने की सन्तुष्टि लाते हैं। वित्तीय सुरक्षा स्थिर है भले उत्तेजक न हो। इस अवस्था में जीवन में शेष मित्र अमूल्य हैं — उन सम्बन्धों में निवेश करें। सामुदायिक भागीदारी दिनों को व्यक्तिगत चिन्ताओं से परे संरचना और उद्देश्य देती है।',
      },
    },
  },
  12: {
    base: {
      en: 'Saturn in the 12th house increases expenses and demands solitude for inner work. Foreign connections may involve hardships. Sleep may be disturbed, and hidden fears surface for resolution. This transit tests your spiritual resilience. Hospitals, ashrams, and retreats feature prominently. The reward is profound inner freedom.',
      hi: 'शनि द्वादश भाव में व्यय बढ़ाते हैं और आन्तरिक कार्य के लिए एकान्त माँगते हैं। विदेशी सम्पर्कों में कठिनाइयाँ हो सकती हैं। नींद बाधित हो सकती है और छिपे भय समाधान के लिए सतह पर आते हैं। यह गोचर आध्यात्मिक लचीलापन परखता है। अस्पताल, आश्रम और एकान्तवास प्रमुखता पाते हैं। पुरस्कार गहन आन्तरिक स्वतन्त्रता है।',
    },
    byStage: {
      student: {
        en: 'Saturn in the 12th house can feel isolating — you may not fit in with peers or feel disconnected from your environment. Channel this into introspection, journaling, or counseling. Study abroad faces obstacles but is still possible with persistence. Sleep hygiene matters more than ever. The loneliness you feel now is preparing you for deep self-reliance.',
        hi: 'शनि द्वादश भाव में अलग-थलग लग सकता है — साथियों में न बैठना या वातावरण से विलग अनुभव। इसे आत्मनिरीक्षण, डायरी या परामर्श में प्रवाहित करें। विदेश अध्ययन बाधाओं का सामना करता है पर दृढ़ता से सम्भव। नींद की स्वच्छता पहले से कहीं अधिक महत्वपूर्ण। अब जो अकेलापन अनुभव करते हैं वह गहन आत्मनिर्भरता के लिए तैयार कर रहा है।',
      },
      established: {
        en: 'Saturn in the 12th house at your stage brings hidden expenses, tax obligations, or settlement costs. Foreign investments face friction. Sleep disorders or stress-related health issues need attention. This is actually a deeply transformative transit — unresolved psychological patterns from decades ago demand release. Therapy, meditation, or retreat helps enormously.',
        hi: 'शनि द्वादश भाव में आपकी अवस्था पर छिपे व्यय, कर दायित्व या निपटान लागत लाते हैं। विदेशी निवेश बाधा का सामना करते हैं। नींद विकार या तनाव-सम्बन्धित स्वास्थ्य मुद्दों पर ध्यान आवश्यक। यह वास्तव में गहन परिवर्तनकारी गोचर है — दशकों पुराने अनसुलझे मनोवैज्ञानिक पैटर्न मुक्ति माँगते हैं। चिकित्सा, ध्यान या एकान्तवास बहुत सहायता करता है।',
      },
      sage: {
        en: 'Saturn in the 12th house is the final lesson before a new cycle begins. Hospitalization risks need proactive management. Expenses flow toward spiritual activities, charitable donations, and end-of-life arrangements. But beneath the material tests, this transit offers the deepest peace — a gentle surrender to the divine order of existence.',
        hi: 'शनि द्वादश भाव में नए चक्र से पहले अन्तिम पाठ है। अस्पताल में भर्ती के जोखिमों का सक्रिय प्रबन्धन आवश्यक। व्यय आध्यात्मिक गतिविधियों, दानों और अन्तिम व्यवस्थाओं की ओर प्रवाहित होता है। पर भौतिक परीक्षाओं के नीचे यह गोचर गहनतम शान्ति प्रदान करता है — अस्तित्व की दिव्य व्यवस्था को सौम्य समर्पण।',
      },
    },
  },
};

// ── Rahu-Ketu Axis Effects (6 axes) ──
// Key format: "R-K" where R = Rahu's house, K = Ketu's house

export const RAHU_KETU_STAGE_EFFECTS: Record<string, StageTransitEffect> = {
  '1-7': {
    base: {
      en: 'Rahu in the 1st house amplifies your desire for personal reinvention, while Ketu in the 7th detaches you from partnership expectations. You crave individual identity but may neglect relationships. Balance ambition with empathy. This axis pushes you to define who you are, independent of others.',
      hi: 'राहु प्रथम भाव में व्यक्तिगत पुनर्निर्माण की इच्छा बढ़ाते हैं, जबकि केतु सप्तम भाव में साझेदारी अपेक्षाओं से विरक्त करते हैं। व्यक्तिगत पहचान की तीव्र इच्छा पर सम्बन्ध उपेक्षित हो सकते हैं। महत्वाकांक्षा को सहानुभूति से सन्तुलित करें। यह अक्ष दूसरों से स्वतन्त्र, स्वयं को परिभाषित करने को प्रेरित करता है।',
    },
    byStage: {
      student: {
        en: 'Rahu in the 1st house fuels an urgent desire to stand out — new looks, bold choices, and a hunger for recognition define this period. Friendships and early relationships may suffer as you become self-focused. Channel this energy into building genuine skills rather than just an image. Ketu in the 7th teaches you that true connection requires vulnerability.',
        hi: 'राहु प्रथम भाव में अलग दिखने की तीव्र इच्छा जगाते हैं — नया रूप, साहसिक विकल्प और मान्यता की भूख इस काल को परिभाषित करती है। आत्म-केन्द्रित होने पर मित्रता और प्रारम्भिक सम्बन्ध प्रभावित हो सकते हैं। इस ऊर्जा को केवल छवि नहीं, वास्तविक कौशल बनाने में लगाएँ। केतु सप्तम भाव में सिखाते हैं कि सच्चा जुड़ाव संवेदनशीलता माँगता है।',
      },
      householder: {
        en: 'Rahu in the 1st house drives a powerful urge to reinvent your personal and professional identity. Career pivots, bold public moves, and a fresh self-image are likely. Ketu in the 7th can create emotional distance in marriage — your partner may feel neglected. Consciously invest in your relationship even as you pursue individual growth.',
        hi: 'राहु प्रथम भाव में व्यक्तिगत और व्यावसायिक पहचान पुनर्निर्मित करने की शक्तिशाली प्रेरणा देते हैं। कैरियर मोड़, साहसिक सार्वजनिक कदम और नई आत्म-छवि सम्भावित। केतु सप्तम भाव में विवाह में भावनात्मक दूरी बना सकते हैं — साथी उपेक्षित अनुभव कर सकते हैं। व्यक्तिगत विकास करते हुए भी सचेत रूप से सम्बन्ध में निवेश करें।',
      },
      elder: {
        en: 'Rahu in the 1st house at this stage sparks a surprising desire for reinvention — perhaps a new hobby, public role, or personal transformation. Ketu in the 7th brings philosophical detachment from social expectations about relationships. Honor your individuality while remaining kind to those who share your life. This axis is about finding your authentic self.',
        hi: 'राहु प्रथम भाव में इस अवस्था पर पुनर्निर्माण की आश्चर्यजनक इच्छा जगाते हैं — शायद नया शौक, सार्वजनिक भूमिका या व्यक्तिगत परिवर्तन। केतु सप्तम भाव में सम्बन्धों की सामाजिक अपेक्षाओं से दार्शनिक विरक्ति लाते हैं। जीवन साझा करने वालों के प्रति दयालु रहते हुए अपनी व्यक्तिगतता का सम्मान करें। यह अक्ष प्रामाणिक स्वयं खोजने के बारे में है।',
      },
    },
  },
  '2-8': {
    base: {
      en: 'Rahu in the 2nd house creates an insatiable desire for wealth and material security, while Ketu in the 8th house detaches you from hidden dependencies and joint finances. Speech may become manipulative if unchecked. Focus on earning through your own skills rather than relying on others\' resources.',
      hi: 'राहु द्वितीय भाव में धन और भौतिक सुरक्षा की अतृप्त इच्छा उत्पन्न करते हैं, जबकि केतु अष्टम भाव में छिपी निर्भरताओं और संयुक्त वित्त से विरक्त करते हैं। वाणी अनियन्त्रित हो तो छलपूर्ण बन सकती है। दूसरों के संसाधनों पर निर्भर रहने के बजाय स्वयं के कौशल से कमाने पर ध्यान दें।',
    },
    byStage: {
      student: {
        en: 'Rahu in the 2nd house makes you acutely aware of financial differences — you may feel envious of peers with more resources. Use this as motivation to build earning skills, not resentment. Your speaking ability can be magnetic; use it ethically. Ketu in the 8th diminishes fear — you become surprisingly brave in crisis situations.',
        hi: 'राहु द्वितीय भाव में वित्तीय अन्तर की तीव्र जागरूकता देते हैं — अधिक संसाधन वाले साथियों से ईर्ष्या अनुभव हो सकती है। इसे ईर्ष्या नहीं, कमाने के कौशल बनाने की प्रेरणा बनाएँ। वाक्शक्ति चुम्बकीय हो सकती है; नैतिकता से उपयोग करें। केतु अष्टम भाव में भय कम करते हैं — संकट स्थितियों में आश्चर्यजनक रूप से साहसी बनते हैं।',
      },
      householder: {
        en: 'Rahu in the 2nd house drives aggressive wealth accumulation — new income streams, side businesses, and investments attract you strongly. Be cautious of get-rich-quick schemes. Family finances improve but may cause tension over spending priorities. Ketu in the 8th simplifies your relationship with inheritance and joint assets — you prefer to earn independently.',
        hi: 'राहु द्वितीय भाव में आक्रामक धन संचय की प्रेरणा — नई आय धाराएँ, अतिरिक्त व्यापार और निवेश तीव्रता से आकर्षित करते हैं। जल्दी अमीर बनने की योजनाओं से सावधान रहें। पारिवारिक वित्त सुधरता है पर व्यय प्राथमिकताओं पर तनाव हो सकता है। केतु अष्टम भाव में विरासत और संयुक्त सम्पत्ति से सम्बन्ध सरल करते हैं — आप स्वतन्त्र रूप से कमाना पसन्द करते हैं।',
      },
      elder: {
        en: 'Rahu in the 2nd house creates unusual desires around food, family, and financial security — you may want to leave a larger legacy than necessary. Ketu in the 8th brings a remarkable calm about mortality and the unknown. Channel Rahu\'s energy into meaningful giving rather than accumulation. Your intuition about hidden matters becomes exceptionally sharp.',
        hi: 'राहु द्वितीय भाव में भोजन, परिवार और वित्तीय सुरक्षा के बारे में असामान्य इच्छाएँ उत्पन्न करते हैं — आवश्यकता से बड़ी विरासत छोड़ना चाह सकते हैं। केतु अष्टम भाव में मृत्यु और अज्ञात के बारे में उल्लेखनीय शान्ति लाते हैं। राहु की ऊर्जा को संचय के बजाय सार्थक दान में प्रवाहित करें। गूढ़ मामलों में अन्तर्ज्ञान असाधारण रूप से तीक्ष्ण होता है।',
      },
    },
  },
  '3-9': {
    base: {
      en: 'Rahu in the 3rd house amplifies ambition in communication, media, and entrepreneurship, while Ketu in the 9th creates restlessness with traditional belief systems. You question inherited wisdom and seek your own answers. Short-distance pursuits outperform long-distance ventures. Courage and initiative drive this period.',
      hi: 'राहु तृतीय भाव में संवाद, मीडिया और उद्यमिता में महत्वाकांक्षा बढ़ाते हैं, जबकि केतु नवम भाव में पारम्परिक विश्वास प्रणालियों से बेचैनी पैदा करते हैं। विरासत में मिले ज्ञान पर प्रश्न उठाते हैं और स्वयं के उत्तर खोजते हैं। लघु-दूरी प्रयास दीर्घ-दूरी उपक्रमों से बेहतर करते हैं। साहस और पहल इस काल को चलाती है।',
    },
    byStage: {
      student: {
        en: 'Rahu in the 3rd house makes you a bold communicator — social media, debates, creative writing, and content creation call you powerfully. You may challenge teachers or religious teachings (Ketu in 9th) — do so with intelligence, not rebellion. Short courses and certifications outperform full-degree programs in practical value this period.',
        hi: 'राहु तृतीय भाव में साहसी संवादकर्ता बनाते हैं — सोशल मीडिया, वाद-विवाद, रचनात्मक लेखन और सामग्री निर्माण शक्तिशाली रूप से बुलाते हैं। शिक्षकों या धार्मिक शिक्षाओं को चुनौती दे सकते हैं (केतु नवम भाव) — बुद्धि से करें, विद्रोह से नहीं। लघु पाठ्यक्रम और प्रमाणपत्र इस काल में पूर्ण डिग्री कार्यक्रमों से व्यावहारिक मूल्य में बेहतर करते हैं।',
      },
      householder: {
        en: 'Rahu in the 3rd house drives entrepreneurial ventures, aggressive marketing, and media presence. Sales, negotiations, and networking reach peak effectiveness. Ketu in the 9th may distance you from your father or mentors — recognize that you are outgrowing old guidance, not rejecting it. Business travel over pilgrimage defines this period.',
        hi: 'राहु तृतीय भाव में उद्यमिता, आक्रामक विपणन और मीडिया उपस्थिति की प्रेरणा देते हैं। बिक्री, वार्ता और नेटवर्किंग चरम प्रभावशीलता पर। केतु नवम भाव में पिता या गुरुओं से दूरी हो सकती है — पहचानें कि पुराने मार्गदर्शन से आगे बढ़ रहे हैं, अस्वीकार नहीं कर रहे। तीर्थ पर व्यापार यात्रा इस काल को परिभाषित करती है।',
      },
      elder: {
        en: 'Rahu in the 3rd house at this stage encourages you to share your wisdom through writing, teaching, or community media. Your voice reaches further than expected. Ketu in the 9th brings a healthy skepticism of dogma — your spirituality becomes personal and experiential rather than institutional. Short trips to visit loved ones bring more joy than long pilgrimages.',
        hi: 'राहु तृतीय भाव में इस अवस्था पर लेखन, शिक्षण या सामुदायिक मीडिया से ज्ञान साझा करने को प्रोत्साहित करते हैं। आपकी आवाज अपेक्षा से दूर तक पहुँचती है। केतु नवम भाव में हठधर्मिता का स्वस्थ सन्देह लाते हैं — आध्यात्मिकता संस्थागत के बजाय व्यक्तिगत और अनुभवात्मक बनती है। प्रियजनों से मिलने की लघु यात्राएँ लम्बी तीर्थयात्राओं से अधिक आनन्द देती हैं।',
      },
    },
  },
  '4-10': {
    base: {
      en: 'Rahu in the 4th house creates an obsessive desire for domestic security, property, and emotional comfort, while Ketu in the 10th detaches you from career ambition. The tension between home life and professional duty defines this axis. Finding peace at home while maintaining your public role requires conscious effort.',
      hi: 'राहु चतुर्थ भाव में घरेलू सुरक्षा, सम्पत्ति और भावनात्मक आराम की जुनूनी इच्छा बनाते हैं, जबकि केतु दशम भाव में कैरियर महत्वाकांक्षा से विरक्त करते हैं। गृह जीवन और व्यावसायिक कर्तव्य के बीच तनाव इस अक्ष को परिभाषित करता है। सार्वजनिक भूमिका बनाए रखते हुए घर पर शान्ति पाने के लिए सचेत प्रयास आवश्यक।',
    },
    byStage: {
      student: {
        en: 'Rahu in the 4th house makes home and family issues unusually prominent — you may feel responsible for domestic problems beyond your years. Academic focus can suffer when home life is turbulent. Ketu in the 10th means career planning feels abstract or uninteresting. Focus on emotional stability first; career clarity will follow naturally.',
        hi: 'राहु चतुर्थ भाव में घर और परिवार के मुद्दे असामान्य रूप से प्रमुख बनाते हैं — उम्र से परे घरेलू समस्याओं की जिम्मेदारी अनुभव हो सकती है। गृह जीवन अशान्त होने पर शैक्षिक ध्यान प्रभावित हो सकता है। केतु दशम भाव में कैरियर योजना अमूर्त या अरुचिकर लगती है। पहले भावनात्मक स्थिरता पर ध्यान दें; कैरियर स्पष्टता स्वाभाविक रूप से आएगी।',
      },
      householder: {
        en: 'Rahu in the 4th house drives major real estate moves — buying, building, or renovating with intense urgency. You want the perfect home as a symbol of success. Ketu in the 10th may trigger career dissatisfaction or a desire to step back from professional life. Balance both: invest in your home without abandoning your professional momentum.',
        hi: 'राहु चतुर्थ भाव में प्रमुख अचल सम्पत्ति कदम — तीव्र तत्परता से खरीदना, बनाना या नवीनीकरण। सफलता के प्रतीक के रूप में आदर्श घर चाहते हैं। केतु दशम भाव में कैरियर असन्तोष या व्यावसायिक जीवन से पीछे हटने की इच्छा उत्पन्न कर सकते हैं। दोनों सन्तुलित करें: व्यावसायिक गति त्यागे बिना घर में निवेश करें।',
      },
      elder: {
        en: 'Rahu in the 4th house creates a strong attachment to your home and family legacy. You may want to ensure every detail of your domestic life is settled perfectly. Ketu in the 10th frees you from concern about public reputation. Focus on making your home a place of warmth and welcome for the next generation rather than a monument to your achievements.',
        hi: 'राहु चतुर्थ भाव में घर और पारिवारिक विरासत के प्रति तीव्र आसक्ति बनाते हैं। घरेलू जीवन का हर विवरण पूर्ण रूप से व्यवस्थित करना चाह सकते हैं। केतु दशम भाव में सार्वजनिक प्रतिष्ठा की चिन्ता से मुक्त करते हैं। अपनी उपलब्धियों के स्मारक के बजाय अगली पीढ़ी के लिए ऊष्मा और स्वागत का स्थान बनाने पर ध्यान दें।',
      },
    },
  },
  '5-11': {
    base: {
      en: 'Rahu in the 5th house intensifies desires around creativity, romance, children, and speculation, while Ketu in the 11th detaches you from social networks and group conformity. You pursue individual creative expression over collective goals. Speculative risks attract you — exercise caution with investments.',
      hi: 'राहु पञ्चम भाव में रचनात्मकता, प्रेम, सन्तान और सट्टे की इच्छाओं को तीव्र करते हैं, जबकि केतु एकादश भाव में सामाजिक नेटवर्क और सामूहिक अनुरूपता से विरक्त करते हैं। सामूहिक लक्ष्यों पर व्यक्तिगत रचनात्मक अभिव्यक्ति अनुसरण करते हैं। सट्टा जोखिम आकर्षित करते हैं — निवेश में सावधानी बरतें।',
    },
    byStage: {
      student: {
        en: 'Rahu in the 5th house makes you intensely creative and romantically adventurous. Academic interests shift toward arts, performance, or unconventional subjects. Romance can become all-consuming — maintain balance with studies. Ketu in the 11th means you may drift from friend groups. Trust your creative instincts but do not neglect your support network.',
        hi: 'राहु पञ्चम भाव में तीव्र रचनात्मक और प्रेम साहसी बनाते हैं। शैक्षिक रुचियाँ कला, प्रदर्शन या अपरम्परागत विषयों की ओर मुड़ती हैं। प्रेम सर्वग्राही बन सकता है — अध्ययन से सन्तुलन बनाएँ। केतु एकादश भाव में मित्र समूहों से दूर हो सकते हैं। रचनात्मक प्रवृत्तियों पर विश्वास करें पर सहायता नेटवर्क की उपेक्षा न करें।',
      },
      householder: {
        en: 'Rahu in the 5th house can trigger intense desire for children, creative fame, or speculative gains. Stock market, real estate speculation, and entrepreneurial risks attract you powerfully. Ketu in the 11th reduces interest in networking events and social obligations. Channel creative energy into one focused project rather than scattering across many ventures.',
        hi: 'राहु पञ्चम भाव में सन्तान, रचनात्मक प्रसिद्धि या सट्टा लाभ की तीव्र इच्छा उत्पन्न कर सकते हैं। शेयर बाजार, अचल सम्पत्ति सट्टा और उद्यमी जोखिम शक्तिशाली रूप से आकर्षित करते हैं। केतु एकादश भाव में नेटवर्किंग कार्यक्रमों और सामाजिक दायित्वों में रुचि कम करते हैं। रचनात्मक ऊर्जा को अनेक उपक्रमों में बिखेरने के बजाय एक केन्द्रित परियोजना में प्रवाहित करें।',
      },
      elder: {
        en: 'Rahu in the 5th house reawakens creative passions — you may take up painting, music, or writing with unexpected intensity. Grandchildren become a source of deep fascination. Ketu in the 11th frees you from social obligations that no longer serve you. Pursue joy and creative expression without guilt — you have earned this freedom.',
        hi: 'राहु पञ्चम भाव में रचनात्मक जुनून पुनर्जागृत करते हैं — अप्रत्याशित तीव्रता से चित्रकारी, संगीत या लेखन अपना सकते हैं। नाती-पोते गहन मोह का स्रोत बनते हैं। केतु एकादश भाव में उन सामाजिक दायित्वों से मुक्त करते हैं जो अब सार्थक नहीं। अपराधबोध के बिना आनन्द और रचनात्मक अभिव्यक्ति अनुसरण करें — आपने यह स्वतन्त्रता अर्जित की है।',
      },
    },
  },
  '6-12': {
    base: {
      en: 'Rahu in the 6th house drives an intense desire to conquer enemies, overcome obstacles, and master daily routines, while Ketu in the 12th brings natural detachment from worldly attachments and expenses. This axis favors service-oriented work and spiritual practice. Health improves through disciplined effort.',
      hi: 'राहु षष्ठ भाव में शत्रुओं को जीतने, बाधाओं पर विजय पाने और दैनिक दिनचर्या में निपुणता की तीव्र इच्छा प्रेरित करते हैं, जबकि केतु द्वादश भाव में सांसारिक आसक्तियों और व्ययों से स्वाभाविक विरक्ति लाते हैं। यह अक्ष सेवा-उन्मुख कार्य और आध्यात्मिक साधना का पक्ष लेता है। अनुशासित प्रयास से स्वास्थ्य सुधरता है।',
    },
    byStage: {
      student: {
        en: 'Rahu in the 6th house makes you fiercely competitive in academics and extracurriculars. You thrive on challenge and can outwork most peers. Health and fitness become important interests. Ketu in the 12th gives you natural meditation ability and vivid dreams. Balance your competitive drive with compassion — winning is not everything.',
        hi: 'राहु षष्ठ भाव में शिक्षा और पाठ्येतर गतिविधियों में अत्यन्त प्रतिस्पर्धी बनाते हैं। चुनौती पर पनपते हैं और अधिकांश साथियों से अधिक परिश्रम कर सकते हैं। स्वास्थ्य और फिटनेस महत्वपूर्ण रुचियाँ बनती हैं। केतु द्वादश भाव में स्वाभाविक ध्यान क्षमता और स्पष्ट स्वप्न देते हैं। प्रतिस्पर्धी प्रेरणा को करुणा से सन्तुलित करें — जीतना सब कुछ नहीं।',
      },
      householder: {
        en: 'Rahu in the 6th house makes you an effective problem-solver at work — you handle crises, litigation, and competition with unusual skill. Employees and subordinates respond to your authority. Health improves through disciplined regimens. Ketu in the 12th naturally reduces wasteful spending and draws you toward charitable work and spiritual retreat.',
        hi: 'राहु षष्ठ भाव में कार्यस्थल पर प्रभावी समस्या-समाधानकर्ता बनाते हैं — संकट, मुकदमे और प्रतियोगिता को असाधारण कुशलता से सम्भालते हैं। कर्मचारी और अधीनस्थ आपके अधिकार पर प्रतिक्रिया देते हैं। अनुशासित दिनचर्या से स्वास्थ्य सुधरता है। केतु द्वादश भाव में अपव्यय स्वाभाविक रूप से कम करते हैं और दान कार्य व आध्यात्मिक एकान्तवास की ओर आकर्षित करते हैं।',
      },
      elder: {
        en: 'Rahu in the 6th house at this stage helps you manage health challenges with determination and discipline. Daily routines become your greatest ally — walking, diet, medication compliance. Ketu in the 12th brings a natural readiness for meditation, ashram visits, and spiritual surrender. This axis powerfully supports both physical health maintenance and spiritual advancement.',
        hi: 'राहु षष्ठ भाव में इस अवस्था पर संकल्प और अनुशासन से स्वास्थ्य चुनौतियों का प्रबन्धन करने में सहायता करते हैं। दैनिक दिनचर्या सबसे बड़ी सहयोगी बनती है — टहलना, आहार, औषधि अनुपालन। केतु द्वादश भाव में ध्यान, आश्रम भ्रमण और आध्यात्मिक समर्पण की स्वाभाविक तत्परता लाते हैं। यह अक्ष शारीरिक स्वास्थ्य रखरखाव और आध्यात्मिक उन्नति दोनों का शक्तिशाली समर्थन करता है।',
      },
    },
  },
};

// ── Lookup Helper ──

/**
 * Retrieve the appropriate transit effect text for a given house/axis key
 * and life stage. Falls back to `base` when the stage has no dedicated entry.
 *
 * @param effects - One of JUPITER_STAGE_EFFECTS, SATURN_STAGE_EFFECTS, or RAHU_KETU_STAGE_EFFECTS
 * @param key - House number (1-12) or axis string ("1-7")
 * @param stage - Optional life stage; if omitted or unmatched, returns base text
 */
export function getStageTransitEffect(
  effects: Record<string | number, StageTransitEffect>,
  key: string | number,
  stage?: LifeStage
): { en: string; hi: string } {
  const entry = effects[key];
  if (!entry) {
    // Defensive fallback — should not happen with valid input
    return { en: '', hi: '' };
  }

  if (stage && entry.byStage?.[stage]) {
    return entry.byStage[stage];
  }

  return entry.base;
}

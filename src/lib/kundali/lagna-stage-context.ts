/**
 * Lagna × Life Stage Context
 *
 * 72 entries (12 lagnas × 6 life stages) providing personalized
 * "What This Means for You Now" commentary appended after lagna
 * personality descriptions in the tippanni system.
 *
 * Each entry: 2-3 sentences, warm pandit tone, Vedic terminology.
 * Lagnas: 1=Mesha, 2=Vrishabha, 3=Mithuna, 4=Karka, 5=Simha,
 *         6=Kanya, 7=Tula, 8=Vrishchika, 9=Dhanu, 10=Makara,
 *         11=Kumbha, 12=Meena
 */

import type { LifeStage } from './life-stage';

export const LAGNA_STAGE_CONTEXT: Record<number, Record<LifeStage, { en: string; hi: string }>> = {
  // ── 1. Mesha (Aries) — ruled by Mangal ──
  1: {
    student: {
      en: 'Your Mangal-driven fire gives you a natural competitive edge in academics and sports. Channel this intensity into focused preparation rather than scattered ambitions. The leader in you emerges through discipline, not just raw energy.',
      hi: 'मंगल की अग्नि आपको शिक्षा और खेल में स्वाभाविक प्रतिस्पर्धी बढ़त देती है। इस तीव्रता को बिखरी महत्वाकांक्षाओं की जगह केन्द्रित तैयारी में लगाएँ। आपके भीतर का नेता अनुशासन से प्रकट होता है, केवल कच्ची ऊर्जा से नहीं।',
    },
    early_career: {
      en: 'Mesha lagna people rise fast in competitive environments — startups, sales, and leadership roles suit you. Guard against impatience with slower colleagues; your Mangal energy can intimidate when you intend to motivate. Build alliances now — lone warriors plateau early.',
      hi: 'मेष लग्न के जातक प्रतिस्पर्धी माहौल में तेज़ी से उभरते हैं — स्टार्टअप, बिक्री और नेतृत्व भूमिकाएँ आपके अनुकूल हैं। धीमे सहकर्मियों के प्रति अधीरता से बचें; आपकी मंगल ऊर्जा प्रेरित करने के बदले भयभीत कर सकती है। अभी गठबंधन बनाएँ — अकेले योद्धा जल्दी रुक जाते हैं।',
    },
    householder: {
      en: 'This is your season of maximum influence — Mangal rewards action, and you are at your most capable. Balance professional ambition with patience at home; your family needs your warmth, not your warrior mode. Channel surplus energy into building assets that outlast this peak.',
      hi: 'यह आपके अधिकतम प्रभाव का काल है — मंगल कर्म को पुरस्कृत करता है और आप अपनी पूर्ण क्षमता में हैं। पेशेवर महत्वाकांक्षा को घर में धैर्य से सन्तुलित करें; परिवार को आपकी उष्णता चाहिए, योद्धा रूप नहीं। अतिरिक्त ऊर्जा को ऐसी सम्पत्ति बनाने में लगाएँ जो इस शिखर से आगे भी टिकें।',
    },
    established: {
      en: 'Your pioneering nature now serves best through mentoring the next generation of leaders. Mangal still burns strong — direct it toward health discipline and protecting your family\'s future. The battles worth fighting now are strategic, not personal.',
      hi: 'आपका अग्रणी स्वभाव अब अगली पीढ़ी के नेताओं को मार्गदर्शन देकर सर्वोत्तम सेवा करता है। मंगल अभी भी प्रबल है — इसे स्वास्थ्य अनुशासन और परिवार के भविष्य की रक्षा में लगाएँ। अब लड़ने योग्य लड़ाइयाँ रणनीतिक हैं, व्यक्तिगत नहीं।',
    },
    elder: {
      en: 'Your lifelong courage now transforms into the wisdom of knowing when NOT to fight. Mangal\'s fire, tempered by experience, makes you a powerful protector and advisor. Physical exercise remains essential — your constitution demands movement even now.',
      hi: 'आपका आजीवन साहस अब यह जानने की बुद्धि में बदलता है कि कब नहीं लड़ना है। अनुभव से तपा मंगल का तेज आपको शक्तिशाली रक्षक और सलाहकार बनाता है। शारीरिक व्यायाम अनिवार्य रहता है — आपकी प्रकृति अब भी गति की माँग करती है।',
    },
    sage: {
      en: 'The warrior\'s final victory is over the self. Your Mangal energy, once directed outward in conquest, now fuels an inner discipline of mantra, pranayama, and meditation. Walk daily — your body was built for action and rewards gentle movement even in this season of stillness.',
      hi: 'योद्धा की अन्तिम विजय स्वयं पर होती है। आपकी मंगल ऊर्जा, जो कभी बाहरी विजय में लगी थी, अब मन्त्र, प्राणायाम और ध्यान की आन्तरिक साधना को प्रज्वलित करती है। प्रतिदिन चलें — आपका शरीर क्रिया के लिए बना है और इस विश्राम काल में भी सौम्य गति से लाभान्वित होता है।',
    },
  },

  // ── 2. Vrishabha (Taurus) — ruled by Shukra ──
  2: {
    student: {
      en: 'Shukra blesses you with artistic sensibility and a love of comfort — use this to create study environments that inspire you. Your steady Vrishabha nature excels in subjects requiring patience and depth. Resist the temptation to coast on natural talent; consistent effort compounds beautifully for your sign.',
      hi: 'शुक्र आपको कलात्मक संवेदना और आराम का प्रेम देता है — इसका उपयोग ऐसे अध्ययन वातावरण बनाने में करें जो आपको प्रेरित करें। आपका स्थिर वृषभ स्वभाव धैर्य और गहराई वाले विषयों में उत्कृष्ट है। स्वाभाविक प्रतिभा पर निर्भर रहने के प्रलोभन से बचें; निरन्तर प्रयास आपकी राशि के लिए सुन्दर फल देता है।',
    },
    early_career: {
      en: 'Vrishabha lagna people build careers like they build gardens — slowly, beautifully, and for the long term. Finance, arts, luxury goods, and real estate naturally attract you. Your challenge is starting: once in motion, no one outlasts you. Take that first bold step now.',
      hi: 'वृषभ लग्न के जातक कैरियर वैसे बनाते हैं जैसे बगीचा — धीरे-धीरे, सुन्दरता से, दीर्घकाल के लिए। वित्त, कला, विलासिता और भूसम्पत्ति स्वाभाविक रूप से आकर्षित करते हैं। आपकी चुनौती शुरुआत है: एक बार गति में आने पर कोई आपसे आगे नहीं टिकता। वह पहला साहसिक कदम अभी उठाएँ।',
    },
    householder: {
      en: 'This is the phase where your Shukra-given instinct for wealth truly shines. Property, investments, and beautiful homes — you build all of these with natural grace. Ensure you nurture relationships with the same devotion you give to material goals; your partner needs presence, not just provision.',
      hi: 'यह वह चरण है जहाँ धन के प्रति आपकी शुक्र-प्रदत्त सहज बुद्धि वास्तव में चमकती है। सम्पत्ति, निवेश और सुन्दर घर — आप ये सब स्वाभाविक कुशलता से बनाते हैं। सुनिश्चित करें कि भौतिक लक्ष्यों जैसी ही भक्ति सम्बन्धों को भी दें; आपके साथी को उपस्थिति चाहिए, केवल भरण-पोषण नहीं।',
    },
    established: {
      en: 'Your lifetime of patient accumulation now bears tangible fruit — enjoy it without guilt, for Shukra rewards those who build with integrity. Turn attention to preserving wealth across generations and investing in your children\'s stability. Your taste and judgment are at their finest now.',
      hi: 'आपके धैर्यपूर्ण संचय का आजीवन प्रयास अब ठोस फल दे रहा है — बिना अपराधबोध के इसका आनन्द लें, क्योंकि शुक्र ईमानदारी से बनाने वालों को पुरस्कृत करता है। ध्यान पीढ़ियों तक धन संरक्षण और बच्चों की स्थिरता में निवेश पर लगाएँ। आपकी रुचि और निर्णय क्षमता अब अपने श्रेष्ठतम रूप में है।',
    },
    elder: {
      en: 'Your lifetime of patience now bears fruit in the stability others seek from you. This is the season to enjoy the material comforts you have earned and to guide the next generation in the art of persistence. Your relationship with beauty deepens — art, music, and nature become sources of profound peace.',
      hi: 'आपके आजीवन धैर्य का फल अब उस स्थिरता में है जो दूसरे आपसे चाहते हैं। यह भौतिक सुखों का आनन्द लेने और अगली पीढ़ी को धैर्य की कला सिखाने का मौसम है। सौन्दर्य से आपका सम्बन्ध गहरा होता है — कला, संगीत और प्रकृति गहन शान्ति के स्रोत बनते हैं।',
    },
    sage: {
      en: 'Shukra\'s final gift is the ability to find beauty in simplicity. Your attachment to material comforts naturally softens — not through renunciation, but through a deepening appreciation of what truly matters. Let music, gardening, and gentle rituals be your daily meditation.',
      hi: 'शुक्र का अन्तिम उपहार सरलता में सौन्दर्य खोजने की क्षमता है। भौतिक सुखों से आपका लगाव स्वाभाविक रूप से नरम होता है — त्याग से नहीं, बल्कि जो वास्तव में महत्वपूर्ण है उसकी गहरी समझ से। संगीत, बागवानी और सौम्य अनुष्ठानों को अपना दैनिक ध्यान बनने दें।',
    },
  },

  // ── 3. Mithuna (Gemini) — ruled by Budh ──
  3: {
    student: {
      en: 'Budh makes you the quickest learner in any classroom — your mind absorbs languages, mathematics, and communication arts effortlessly. The danger is superficiality: you can learn anything but master nothing unless you commit to depth. Choose two or three subjects and go deep before going wide.',
      hi: 'बुध आपको किसी भी कक्षा में सबसे तेज़ शिक्षार्थी बनाता है — आपका मन भाषाएँ, गणित और संवाद कला सहजता से ग्रहण करता है। खतरा सतहीपन है: आप कुछ भी सीख सकते हैं पर गहराई की प्रतिबद्धता बिना कुछ भी पूर्ण नहीं करेंगे। दो-तीन विषय चुनें और विस्तार से पहले गहराई में जाएँ।',
    },
    early_career: {
      en: 'Your Budh-powered versatility is your greatest asset and your greatest risk. Media, technology, writing, trading, and consulting all call to you — but job-hopping dilutes your expertise. Pick a lane that uses your communication gifts and build a reputation in it before diversifying.',
      hi: 'आपकी बुध-शक्ति बहुमुखी प्रतिभा आपकी सबसे बड़ी सम्पत्ति और सबसे बड़ा जोखिम दोनों है। मीडिया, तकनीक, लेखन, व्यापार और परामर्श सभी आपको बुलाते हैं — पर बार-बार नौकरी बदलना विशेषज्ञता को कमज़ोर करता है। एक ऐसा मार्ग चुनें जो संवाद कौशल का उपयोग करे और विविधीकरण से पहले उसमें प्रतिष्ठा बनाएँ।',
    },
    householder: {
      en: 'Mithuna lagna thrives on intellectual stimulation even in domestic life — your home should be a place of books, conversation, and learning. Multiple income streams come naturally to you, but ensure at least one is stable and predictable. Your children benefit enormously from your curiosity; share it generously.',
      hi: 'मिथुन लग्न पारिवारिक जीवन में भी बौद्धिक उत्तेजना से पनपता है — आपका घर पुस्तकों, संवाद और सीखने का स्थान होना चाहिए। आय के अनेक स्रोत स्वाभाविक रूप से आते हैं, पर सुनिश्चित करें कि कम से कम एक स्थिर और अनुमानित हो। आपके बच्चे आपकी जिज्ञासा से अत्यधिक लाभान्वित होते हैं; उदारता से बाँटें।',
    },
    established: {
      en: 'Your vast network and accumulated knowledge make you an invaluable connector and advisor. Budh rewards those who share wisdom — consider writing, teaching, or consulting as your primary contribution. Guard against mental restlessness; meditation and pranayama help your ever-active mind find stillness.',
      hi: 'आपका विस्तृत नेटवर्क और संचित ज्ञान आपको अमूल्य संयोजक और सलाहकार बनाता है। बुध ज्ञान बाँटने वालों को पुरस्कृत करता है — लेखन, शिक्षण या परामर्श को अपना प्राथमिक योगदान मानें। मानसिक अशान्ति से बचें; ध्यान और प्राणायाम आपके सदा सक्रिय मन को शान्ति पाने में सहायता करते हैं।',
    },
    elder: {
      en: 'Your mind remains sharp — Budh ages gracefully in Mithuna lagna. This is the time to write memoirs, teach grandchildren, and pursue intellectual hobbies you deferred during busy decades. Social connections sustain your vitality; isolation is your enemy, not solitude.',
      hi: 'आपका मन तीक्ष्ण बना रहता है — मिथुन लग्न में बुध शालीनता से वृद्ध होता है। यह संस्मरण लिखने, पोते-पोतियों को सिखाने और व्यस्त दशकों में टाली बौद्धिक रुचियों को अपनाने का समय है। सामाजिक सम्पर्क आपकी जीवनशक्ति बनाए रखते हैं; एकान्त नहीं, अकेलापन आपका शत्रु है।',
    },
    sage: {
      en: 'Budh\'s highest expression is Vidya — sacred knowledge that liberates. Your naturally agile mind is now ready for Vedanta, Upanishadic study, and the subtlest philosophical inquiry. Share what you learn through conversation and gentle teaching; your words carry decades of lived wisdom.',
      hi: 'बुध की सर्वोच्च अभिव्यक्ति विद्या है — वह पवित्र ज्ञान जो मुक्त करता है। आपका स्वाभाविक रूप से चपल मन अब वेदान्त, उपनिषद अध्ययन और सूक्ष्मतम दार्शनिक जिज्ञासा के लिए तैयार है। संवाद और सौम्य शिक्षण से जो सीखें वह बाँटें; आपके शब्दों में दशकों का जीवन-अनुभव है।',
    },
  },

  // ── 4. Karka (Cancer) — ruled by Chandra ──
  4: {
    student: {
      en: 'Chandra gives you deep emotional intelligence — you sense what teachers and classmates need before they speak. Use this intuition in your studies, but don\'t let emotional fluctuations derail your routine. A stable daily schedule anchors your lunar nature and helps you perform at your true level.',
      hi: 'चन्द्र आपको गहन भावनात्मक बुद्धि देता है — आप शिक्षकों और सहपाठियों की ज़रूरत उनके बोलने से पहले भाँप लेते हैं। अध्ययन में इस अन्तर्ज्ञान का उपयोग करें, पर भावनात्मक उतार-चढ़ाव को दिनचर्या भंग न करने दें। एक स्थिर दैनिक कार्यक्रम आपकी चान्द्र प्रकृति को स्थिर रखता है।',
    },
    early_career: {
      en: 'Your nurturing Karka nature makes you exceptional in healthcare, education, hospitality, and any role requiring empathy. Build emotional boundaries at work — absorbing everyone\'s stress will exhaust you. Your instinct for real estate and property investment is strong; trust it early.',
      hi: 'आपकी पोषक कर्क प्रकृति स्वास्थ्य, शिक्षा, आतिथ्य और सहानुभूति वाली किसी भी भूमिका में आपको असाधारण बनाती है। कार्यस्थल पर भावनात्मक सीमाएँ बनाएँ — सबका तनाव सोखना आपको थका देगा। भूसम्पत्ति निवेश की आपकी सहज बुद्धि प्रबल है; जल्दी विश्वास करें।',
    },
    householder: {
      en: 'This is your natural kingdom — Karka lagna finds its deepest fulfillment in creating a loving, secure home. Your children feel your devotion like warmth from a hearth. Guard against over-protectiveness; let your family grow through their own challenges while knowing you are their anchor.',
      hi: 'यह आपका स्वाभाविक राज्य है — कर्क लग्न को प्रेमपूर्ण, सुरक्षित घर बनाने में अपनी गहनतम पूर्णता मिलती है। आपके बच्चे आपकी भक्ति को चूल्हे की ऊष्मा जैसा अनुभव करते हैं। अतिसुरक्षा से बचें; परिवार को अपनी चुनौतियों से बढ़ने दें, यह जानते हुए कि आप उनका लंगर हैं।',
    },
    established: {
      en: 'Your emotional wisdom is now your most valuable offering to the world. Chandra has matured in you — the mood swings of youth have given way to deep, stable intuition. Focus on securing your family\'s future and creating the home that sustains everyone through life\'s transitions.',
      hi: 'आपकी भावनात्मक बुद्धि अब संसार को आपका सबसे मूल्यवान उपहार है। चन्द्र आपमें परिपक्व हो गया है — युवावस्था के मनोदशा परिवर्तन गहन, स्थिर अन्तर्ज्ञान में बदल गए हैं। परिवार का भविष्य सुरक्षित करने और ऐसा घर बनाने पर ध्यान दें जो सबको जीवन के परिवर्तनों में सहारा दे।',
    },
    elder: {
      en: 'As the family matriarch or patriarch, your Karka lagna now radiates the warmth that holds generations together. Grandchildren especially respond to your nurturing presence. Tend to your own emotional needs too — give yourself the same care you have always given others.',
      hi: 'परिवार के मुखिया के रूप में, आपका कर्क लग्न अब वह ऊष्मा विकीर्ण करता है जो पीढ़ियों को जोड़ती है। पोते-पोतियाँ विशेष रूप से आपकी पोषक उपस्थिति से प्रभावित होते हैं। अपनी भावनात्मक आवश्यकताओं का भी ध्यान रखें — स्वयं को वही देखभाल दें जो आपने सदा दूसरों को दी है।',
    },
    sage: {
      en: 'Chandra\'s final teaching is that all nurturing ultimately flows from the Divine Mother. Your caregiving instinct now expands beyond family to universal compassion. River walks, moon-gazing, and simple devotional practice connect you to the cosmic rhythm that has always guided your life.',
      hi: 'चन्द्र की अन्तिम शिक्षा यह है कि समस्त पोषण अन्ततः दिव्य माता से प्रवाहित होता है। आपकी सेवा भावना अब परिवार से विस्तृत होकर सार्वभौमिक करुणा बन जाती है। नदी-भ्रमण, चन्द्र-दर्शन और सरल भक्ति साधना आपको उस ब्रह्माण्डीय लय से जोड़ती है जिसने सदा आपके जीवन का मार्गदर्शन किया है।',
    },
  },

  // ── 5. Simha (Leo) — ruled by Surya ──
  5: {
    student: {
      en: 'Surya places you naturally at the centre of any group — class leader, team captain, the one others look to for direction. Use this visibility for collective good, not just personal glory. Your academic performance improves dramatically when you feel genuine passion for the subject; seek what inspires awe in you.',
      hi: 'सूर्य आपको स्वाभाविक रूप से किसी भी समूह के केन्द्र में रखता है — कक्षा नेता, टीम कप्तान, वह जिसकी ओर दूसरे दिशा के लिए देखते हैं। इस दृश्यता का सामूहिक भलाई के लिए उपयोग करें, केवल व्यक्तिगत यश के लिए नहीं। जब विषय के प्रति सच्चा जुनून हो तो आपका प्रदर्शन नाटकीय रूप से सुधरता है।',
    },
    early_career: {
      en: 'Simha lagna demands a career where you can shine — leadership, performance, politics, or entrepreneurship. Subordinate roles drain your Surya energy; seek positions of authority early, even if the pay is initially modest. Your natural magnetism attracts mentors and opportunities when you lead with authenticity.',
      hi: 'सिंह लग्न ऐसे कैरियर की माँग करता है जहाँ आप चमक सकें — नेतृत्व, प्रदर्शन, राजनीति या उद्यमिता। अधीनस्थ भूमिकाएँ आपकी सूर्य ऊर्जा को क्षीण करती हैं; अधिकार के पद जल्दी खोजें, भले ही वेतन शुरू में मामूली हो। प्रामाणिकता से नेतृत्व करने पर आपका स्वाभाविक आकर्षण गुरुओं और अवसरों को खींचता है।',
    },
    householder: {
      en: 'You are in your regal prime — Surya empowers you to provide generously and lead your family with dignity. Your home reflects your taste for the majestic. Beware of excessive pride in this phase; the strongest kings are those who listen. Your children inherit your confidence; ensure they also learn humility.',
      hi: 'आप अपने राजसी शिखर पर हैं — सूर्य आपको उदारता से प्रदान करने और गरिमा से परिवार का नेतृत्व करने का बल देता है। आपका घर भव्यता के प्रति आपकी रुचि दर्शाता है। इस चरण में अत्यधिक अहंकार से सावधान रहें; सबसे शक्तिशाली राजा वे हैं जो सुनते हैं। बच्चों को आत्मविश्वास के साथ विनम्रता भी सिखाएँ।',
    },
    established: {
      en: 'Surya now asks you to transition from personal achievement to legacy building. Your reputation is established — use it to elevate others. Board seats, advisory roles, and philanthropic leadership are your natural territory. Health-wise, protect your heart; Surya rules the heart organ and yours has worked hard.',
      hi: 'सूर्य अब आपसे व्यक्तिगत उपलब्धि से विरासत निर्माण की ओर बढ़ने को कहता है। आपकी प्रतिष्ठा स्थापित है — इसका उपयोग दूसरों को ऊपर उठाने में करें। बोर्ड पद, सलाहकार भूमिकाएँ और परोपकारी नेतृत्व आपका स्वाभाविक क्षेत्र है। स्वास्थ्य में हृदय की रक्षा करें; सूर्य हृदय अंग का स्वामी है।',
    },
    elder: {
      en: 'The sun does not diminish — it simply shifts the quality of its light. Your Simha dignity now expresses as gracious presence and quiet authority. People still look to you for direction; offer it through stories and example rather than command. Morning sun-gazing and Surya Namaskar keep your vitality strong.',
      hi: 'सूर्य क्षीण नहीं होता — वह केवल अपने प्रकाश की गुणवत्ता बदलता है। आपकी सिंह गरिमा अब शालीन उपस्थिति और शान्त अधिकार के रूप में व्यक्त होती है। लोग अभी भी दिशा के लिए आपकी ओर देखते हैं; आदेश के बजाय कथाओं और उदाहरण से मार्गदर्शन दें। प्रातःकालीन सूर्य दर्शन और सूर्य नमस्कार आपकी जीवनशक्ति को प्रबल रखते हैं।',
    },
    sage: {
      en: 'Surya\'s highest purpose is Atma-Jyoti — the light of the Self. In this final phase, your natural radiance becomes spiritual luminosity. You need not seek attention; those who need your light find you. Daily Surya Namaskar and Gayatri mantra connect you to the source of the light you have always carried.',
      hi: 'सूर्य का सर्वोच्च उद्देश्य आत्म-ज्योति है — स्वयं का प्रकाश। इस अन्तिम चरण में आपकी स्वाभाविक आभा आध्यात्मिक दीप्ति बन जाती है। आपको ध्यान आकर्षित करने की आवश्यकता नहीं; जिन्हें आपके प्रकाश की ज़रूरत है वे आपको पा लेते हैं। दैनिक सूर्य नमस्कार और गायत्री मन्त्र आपको उस स्रोत से जोड़ते हैं जिसका प्रकाश आप सदा से वहन करते रहे हैं।',
    },
  },

  // ── 6. Kanya (Virgo) — ruled by Budh ──
  6: {
    student: {
      en: 'Budh in Kanya gives you exceptional analytical ability — you naturally excel in science, mathematics, and any subject requiring precision. Your tendency toward perfectionism can create anxiety before exams; remember that an imperfect start is better than a perfect plan never executed. Study groups benefit enormously from your organized notes.',
      hi: 'कन्या में बुध आपको असाधारण विश्लेषणात्मक क्षमता देता है — विज्ञान, गणित और सटीकता वाले विषयों में आप स्वाभाविक रूप से उत्कृष्ट हैं। पूर्णतावाद की प्रवृत्ति परीक्षा से पहले चिन्ता बना सकती है; याद रखें कि अपूर्ण शुरुआत उस पूर्ण योजना से बेहतर है जो कभी क्रियान्वित न हो। अध्ययन समूह आपके व्यवस्थित नोट्स से बहुत लाभान्वित होते हैं।',
    },
    early_career: {
      en: 'Kanya lagna people become indispensable in any organization — your eye for detail and process improvement is unmatched. Healthcare, analytics, quality assurance, editing, and financial auditing suit you perfectly. Beware of becoming the person who does everything but gets credited for nothing; advocate for yourself as skillfully as you serve others.',
      hi: 'कन्या लग्न के जातक किसी भी संगठन में अपरिहार्य बन जाते हैं — विस्तार और प्रक्रिया सुधार पर आपकी दृष्टि अद्वितीय है। स्वास्थ्य, विश्लेषण, गुणवत्ता, सम्पादन और वित्तीय लेखापरीक्षा आपके अनुकूल हैं। सावधान रहें कि सब कुछ करने वाले पर श्रेय किसी को न मिलने वाले न बनें; जितनी कुशलता से सेवा करते हैं उतनी ही से अपनी पैरवी भी करें।',
    },
    householder: {
      en: 'Your Kanya precision creates a well-run household — budgets balanced, schedules maintained, health routines followed. But your family needs warmth alongside efficiency. Consciously schedule unstructured time for play, spontaneity, and affection. Your digestive health needs attention in this high-stress phase; eat mindfully.',
      hi: 'आपकी कन्या सटीकता एक सुचारु घर बनाती है — बजट सन्तुलित, कार्यक्रम व्यवस्थित, स्वास्थ्य दिनचर्या अनुशासित। पर परिवार को दक्षता के साथ ऊष्मा भी चाहिए। खेल, स्वतःस्फूर्तता और स्नेह के लिए सचेत रूप से असंरचित समय रखें। इस उच्च-तनाव चरण में पाचन स्वास्थ्य पर ध्यान दें; सजगता से खाएँ।',
    },
    established: {
      en: 'Your decades of meticulous work have built systems that run without you — this is Budh\'s highest reward. Now step back from execution to oversight and mentoring. Your health awareness, always strong, becomes critical; preventive care is your forte, so apply it to yourself with the same rigor you apply to work.',
      hi: 'आपके दशकों के सूक्ष्म कार्य ने ऐसी व्यवस्थाएँ बनाई हैं जो आपके बिना चलती हैं — यह बुध का सर्वोच्च पुरस्कार है। अब क्रियान्वयन से हटकर निगरानी और मार्गदर्शन में आएँ। आपकी स्वास्थ्य जागरूकता सदा प्रबल रही है और अब महत्वपूर्ण होती है; निवारक देखभाल आपकी विशेषता है, इसे कार्य जैसी ही कठोरता से स्वयं पर लागू करें।',
    },
    elder: {
      en: 'Your analytical mind remains razor-sharp — Budh ages beautifully in Kanya lagna. Use this clarity to organize family affairs, create health protocols, and document wisdom others need. Release the burden of perfection; at this stage, "good enough done with love" outshines "perfect done with stress."',
      hi: 'आपका विश्लेषणात्मक मन तीक्ष्ण बना रहता है — कन्या लग्न में बुध सुन्दरता से वृद्ध होता है। इस स्पष्टता का उपयोग पारिवारिक मामले व्यवस्थित करने, स्वास्थ्य प्रोटोकॉल बनाने और दूसरों के काम आने वाला ज्ञान दस्तावेज़ करने में करें। पूर्णता का भार छोड़ें; इस अवस्था में "प्रेम से किया पर्याप्त" "तनाव से किए पूर्ण" से श्रेष्ठ है।',
    },
    sage: {
      en: 'Budh in Kanya reaches its zenith when analysis gives way to acceptance. You have spent a lifetime improving — now let things be. Your service instinct can express through small, perfect acts: arranging a puja, writing letters to grandchildren, tending a garden with devotion. The cosmos does not need fixing; it needs witnessing.',
      hi: 'कन्या में बुध अपने शिखर पर तब पहुँचता है जब विश्लेषण स्वीकृति का मार्ग देता है। आपने जीवन भर सुधार में लगाया — अब चीज़ों को होने दें। आपकी सेवा भावना छोटे, पूर्ण कार्यों से व्यक्त हो सकती है: पूजा सजाना, पोते-पोतियों को पत्र लिखना, भक्ति से बगीचे की देखभाल। ब्रह्माण्ड को ठीक करने की नहीं, साक्षी की आवश्यकता है।',
    },
  },

  // ── 7. Tula (Libra) — ruled by Shukra ──
  7: {
    student: {
      en: 'Shukra in Tula gives you a refined aesthetic sense and a natural talent for diplomacy — you are the peacemaker in every group. Arts, design, law, and social sciences suit your balanced mind. Your challenge is decisiveness: weighing every option endlessly delays action. Set deadlines for decisions and honour them.',
      hi: 'तुला में शुक्र आपको परिष्कृत सौन्दर्य बोध और कूटनीति की स्वाभाविक प्रतिभा देता है — आप हर समूह में शान्तिदूत हैं। कला, डिज़ाइन, कानून और सामाजिक विज्ञान आपके सन्तुलित मन के अनुकूल हैं। चुनौती निर्णायकता है: हर विकल्प को अन्तहीन तौलना कार्य में विलम्ब करता है। निर्णयों की समय-सीमा निर्धारित करें और उनका पालन करें।',
    },
    early_career: {
      en: 'Tula lagna thrives in partnership-based careers — law, consulting, design firms, diplomacy, and joint ventures. You perform best with a complementary partner rather than solo. Your Shukra charm opens doors effortlessly; use it ethically. Early career is the time to develop the assertiveness your naturally accommodating nature lacks.',
      hi: 'तुला लग्न साझेदारी-आधारित कैरियर में फलता-फूलता है — कानून, परामर्श, डिज़ाइन, कूटनीति और संयुक्त उद्यम। अकेले से बेहतर आप पूरक साथी के साथ प्रदर्शन करते हैं। शुक्र का आकर्षण सहज रूप से द्वार खोलता है; नैतिकता से उपयोग करें। प्रारम्भिक कैरियर में वह दृढ़ता विकसित करें जो आपके स्वाभाविक समायोजनकारी स्वभाव में कम है।',
    },
    householder: {
      en: 'Your home is likely beautiful — Shukra ensures that. But Tula lagna must guard against keeping peace at the cost of truth. Speak difficult truths kindly to your partner; unspoken resentments poison relationships more than honest conflicts. Financial planning benefits from your balanced approach; you invest wisely when you trust your judgment.',
      hi: 'आपका घर सम्भवतः सुन्दर है — शुक्र यह सुनिश्चित करता है। पर तुला लग्न को सत्य की कीमत पर शान्ति बनाए रखने से बचना चाहिए। साथी को कठिन सच कोमलता से बोलें; अनकही कड़वाहट सम्बन्धों को ईमानदार संघर्ष से अधिक विषाक्त करती है। वित्तीय नियोजन आपके सन्तुलित दृष्टिकोण से लाभान्वित होता है।',
    },
    established: {
      en: 'Your gift for seeing both sides makes you an exceptional mediator — family disputes, business negotiations, and community conflicts all benefit from your Tula wisdom. Shukra rewards aesthetic investment in this phase: art collections, beautiful spaces, and cultural patronage bring deep satisfaction.',
      hi: 'दोनों पक्ष देखने का आपका गुण आपको असाधारण मध्यस्थ बनाता है — पारिवारिक विवाद, व्यापार वार्ता और सामुदायिक संघर्ष सभी आपकी तुला बुद्धि से लाभान्वित होते हैं। शुक्र इस चरण में सौन्दर्यात्मक निवेश पुरस्कृत करता है: कला संग्रह, सुन्दर स्थान और सांस्कृतिक संरक्षण गहन सन्तुष्टि लाते हैं।',
    },
    elder: {
      en: 'Relationships are your life\'s masterwork — and in this phase, the deepest ones reveal their full beauty. Companionship with your partner reaches a tenderness only decades of shared life can create. Share your diplomatic wisdom with younger family members navigating their own conflicts; you have mastered what most people struggle with lifelong.',
      hi: 'सम्बन्ध आपके जीवन की उत्कृष्ट कृति हैं — और इस चरण में सबसे गहरे सम्बन्ध अपनी पूर्ण सुन्दरता प्रकट करते हैं। साथी के साथ सहचर्य उस कोमलता को प्राप्त करता है जो केवल दशकों का साझा जीवन ही बना सकता है। अपनी कूटनीतिक बुद्धि युवा परिजनों से बाँटें जो अपने संघर्ष नेविगेट कर रहे हैं।',
    },
    sage: {
      en: 'Shukra\'s final lesson through Tula is that true balance is not between two external forces — it is between the world and the Self. Your lifelong quest for harmony now turns inward. Devotional music, sacred art, and gentle companionship are your path to moksha. You need not renounce beauty; simply recognize its divine source.',
      hi: 'तुला के माध्यम से शुक्र की अन्तिम शिक्षा यह है कि सच्चा सन्तुलन दो बाह्य शक्तियों के बीच नहीं — संसार और आत्मा के बीच है। सामंजस्य की आपकी आजीवन खोज अब अन्तर्मुखी होती है। भक्ति संगीत, पवित्र कला और सौम्य सहचर्य आपका मोक्ष मार्ग है। सौन्दर्य का त्याग नहीं करना; बस उसके दिव्य स्रोत को पहचानना है।',
    },
  },

  // ── 8. Vrishchika (Scorpio) — ruled by Mangal ──
  8: {
    student: {
      en: 'Vrishchika lagna gives you a penetrating mind that refuses surface answers — you instinctively dig until you find the hidden truth. Research, psychology, medicine, and forensic sciences suit this intensity. Guard against obsessive focus on one subject at the expense of others; your depth is an asset only when balanced with breadth.',
      hi: 'वृश्चिक लग्न आपको ऐसा भेदक मन देता है जो सतही उत्तर स्वीकार नहीं करता — आप सहज रूप से छिपे सत्य तक खुदाई करते हैं। अनुसन्धान, मनोविज्ञान, चिकित्सा और फोरेंसिक विज्ञान इस तीव्रता के अनुकूल हैं। एक विषय पर जुनूनी ध्यान से बचें जो दूसरों की हानि करे; गहराई तभी सम्पत्ति है जब विस्तार से सन्तुलित हो।',
    },
    early_career: {
      en: 'Your Mangal-in-Vrishchika intensity makes you formidable in crisis management, investigation, surgery, strategic planning, and any field where others fear to tread. Trust slowly but completely. Your greatest career risk is burning bridges when betrayed — learn to walk away without destruction. Power comes to you naturally; wield it wisely.',
      hi: 'वृश्चिक में मंगल की तीव्रता आपको संकट प्रबन्धन, अन्वेषण, शल्यचिकित्सा और रणनीतिक नियोजन में दुर्जेय बनाती है। धीरे पर पूर्णता से विश्वास करें। विश्वासघात पर सम्बन्ध तोड़ना आपका सबसे बड़ा कैरियर जोखिम है — बिना विनाश के हटना सीखें। शक्ति स्वाभाविक रूप से आपके पास आती है; बुद्धिमत्ता से चलाएँ।',
    },
    householder: {
      en: 'Your home is your fortress — fiercely protected, deeply private. Vrishchika lagna parents raise resilient children because you teach them to face darkness without fear. Balance your intensity with vulnerability; your partner needs to see your tender side, not just your strong one. Financial instincts are sharp — trust your gut on investments.',
      hi: 'आपका घर आपका किला है — उग्रता से सुरक्षित, गहन निजी। वृश्चिक लग्न के माता-पिता लचीले बच्चे पालते हैं क्योंकि आप उन्हें अन्धकार का निर्भय सामना सिखाते हैं। तीव्रता को भेद्यता से सन्तुलित करें; साथी को केवल शक्तिशाली नहीं, कोमल पक्ष भी देखना चाहिए। वित्तीय सहज बुद्धि तीक्ष्ण है — निवेश में अपनी अन्तर्ज्ञान पर भरोसा करें।',
    },
    established: {
      en: 'Decades of navigating power dynamics have given you rare wisdom about human nature. Mangal has tempered your aggression into strategic patience. This is the phase to transform accumulated power into lasting institutions — trusts, foundations, or businesses that outlive you. Health-wise, watch for inflammation and stress-related conditions.',
      hi: 'दशकों की शक्ति गतिशीलता ने आपको मानव स्वभाव की दुर्लभ बुद्धि दी है। मंगल ने आपकी आक्रामकता को रणनीतिक धैर्य में ढाला है। यह संचित शक्ति को स्थायी संस्थाओं में बदलने का चरण है — न्यास, फ़ाउण्डेशन या व्यवसाय जो आपके बाद भी जीवित रहें। स्वास्थ्य में सूजन और तनाव-सम्बन्धी स्थितियों पर ध्यान दें।',
    },
    elder: {
      en: 'The scorpion\'s venom transforms into nectar in the elder phase — your intensity becomes healing power. People trust you with their deepest secrets and hardest truths because you have never flinched from the dark. Channel this into spiritual mentorship; you understand transformation like no other lagna.',
      hi: 'बिच्छू का विष वृद्धावस्था में अमृत में बदलता है — आपकी तीव्रता उपचार शक्ति बन जाती है। लोग अपने गहनतम रहस्य और कठिनतम सत्य आपको सौंपते हैं क्योंकि आपने कभी अन्धकार से मुँह नहीं मोड़ा। इसे आध्यात्मिक मार्गदर्शन में लगाएँ; रूपान्तरण को आप जैसा कोई अन्य लग्न नहीं समझता।',
    },
    sage: {
      en: 'Mangal\'s deepest lesson through Vrishchika is that the ultimate battle is ego\'s surrender to the Atman. Your lifelong intensity now fuels Kundalini practices, Tantric meditation, and the kind of unflinching self-inquiry that terrifies weaker minds. Death holds no fear for you — it never did. This is the lagna of moksha, and you approach it fully prepared.',
      hi: 'वृश्चिक के माध्यम से मंगल की गहनतम शिक्षा यह है कि अन्तिम युद्ध अहंकार का आत्मा के समक्ष समर्पण है। आपकी आजीवन तीव्रता अब कुण्डलिनी साधना, तान्त्रिक ध्यान और निर्भीक आत्म-जिज्ञासा को प्रज्वलित करती है। मृत्यु से आपको भय नहीं — कभी नहीं था। यह मोक्ष का लग्न है, और आप पूर्ण तैयारी से इसके निकट आते हैं।',
    },
  },

  // ── 9. Dhanu (Sagittarius) — ruled by Guru ──
  9: {
    student: {
      en: 'Guru blesses Dhanu lagna with an insatiable hunger for knowledge and truth. Philosophy, law, theology, languages, and travel excite you more than rote learning. Your challenge is following through — the next big idea always seems more exciting than finishing the current one. Complete what you start; Guru rewards those who honour commitments.',
      hi: 'गुरु धनु लग्न को ज्ञान और सत्य की अतृप्त भूख से आशीर्वाद देता है। दर्शन, कानून, धर्मशास्त्र, भाषाएँ और यात्रा रटन्त शिक्षा से अधिक उत्साहित करते हैं। चुनौती पूर्ण करना है — अगला बड़ा विचार सदा वर्तमान से अधिक रोमांचक लगता है। जो शुरू करें उसे पूरा करें; गुरु प्रतिबद्धता का सम्मान करने वालों को पुरस्कृत करता है।',
    },
    early_career: {
      en: 'Dhanu lagna is born for roles with expansive horizons — education, law, international business, publishing, and spiritual guidance. A desk-bound routine will suffocate your Guru energy. Seek careers that involve travel, teaching, or connecting cultures. Your optimism attracts opportunities but can also lead to overcommitment; learn to say no before you burn out.',
      hi: 'धनु लग्न विस्तृत क्षितिज वाली भूमिकाओं के लिए जन्मा है — शिक्षा, कानून, अन्तर्राष्ट्रीय व्यापार, प्रकाशन और आध्यात्मिक मार्गदर्शन। डेस्क-बद्ध दिनचर्या आपकी गुरु ऊर्जा को घोंट देगी। यात्रा, शिक्षण या संस्कृतियों को जोड़ने वाले कैरियर खोजें। आशावाद अवसर आकर्षित करता है पर अत्यधिक प्रतिबद्धता भी ला सकता है; थकने से पहले मना करना सीखें।',
    },
    householder: {
      en: 'Your home is a university — Guru ensures your children grow up with expansive worldviews, philosophical depth, and ethical values. International connections, spiritual practices, and intellectual gatherings define your household. Guard your finances: Dhanu lagna tends toward generous spending. Ensure savings match your grand lifestyle vision.',
      hi: 'आपका घर एक विश्वविद्यालय है — गुरु सुनिश्चित करता है कि बच्चे विस्तृत दृष्टिकोण, दार्शनिक गहराई और नैतिक मूल्यों के साथ बड़े हों। अन्तर्राष्ट्रीय सम्पर्क, आध्यात्मिक साधना और बौद्धिक सभाएँ आपके घर को परिभाषित करती हैं। वित्त की रक्षा करें: धनु लग्न उदार व्यय की ओर झुकता है। बचत को भव्य जीवनशैली दृष्टिकोण से मिलाएँ।',
    },
    established: {
      en: 'Guru now asks you to become the teacher, not just the student. Your accumulated wisdom — from travel, experience, and spiritual seeking — is ready to be shared. Write, lecture, mentor, or establish an institution that carries your values forward. Health-wise, watch the liver and hips; Guru governs both.',
      hi: 'गुरु अब आपसे शिक्षक बनने को कहता है, केवल शिष्य नहीं। यात्रा, अनुभव और आध्यात्मिक खोज से आपका संचित ज्ञान बाँटने के लिए तैयार है। लिखें, व्याख्यान दें, मार्गदर्शन करें या ऐसी संस्था स्थापित करें जो आपके मूल्यों को आगे ले जाए। स्वास्थ्य में यकृत और कूल्हों का ध्यान रखें; गुरु दोनों का शासक है।',
    },
    elder: {
      en: 'Your natural role as the wise elder is now fully ripened. Guru in Dhanu lagna creates the classic pandit, guru, or sage archetype. Grandchildren and younger seekers gravitate to you for life philosophy, not just practical advice. Pilgrimage and sacred study bring profound joy in this phase; travel to places of spiritual power.',
      hi: 'बुद्धिमान वृद्ध के रूप में आपकी स्वाभाविक भूमिका अब पूर्णतः परिपक्व है। धनु लग्न में गुरु शास्त्रीय पण्डित, गुरु या ऋषि का आदर्श बनाता है। पोते-पोतियाँ और युवा जिज्ञासु व्यावहारिक सलाह नहीं, जीवन दर्शन के लिए आपकी ओर आकर्षित होते हैं। तीर्थयात्रा और पवित्र अध्ययन इस चरण में गहन आनन्द लाते हैं।',
    },
    sage: {
      en: 'Guru\'s highest expression is Brahma-Vidya — the knowledge of the Absolute. Your entire life has been preparation for this phase. The restlessness that once drove you to distant lands now drives you inward toward the Self. Teach without agenda, give without attachment, and trust that the universe you explored so enthusiastically is also exploring itself through you.',
      hi: 'गुरु की सर्वोच्च अभिव्यक्ति ब्रह्म-विद्या है — परम तत्व का ज्ञान। आपका सम्पूर्ण जीवन इस चरण की तैयारी रहा है। जो बेचैनी कभी आपको दूर देशों तक ले गई, वह अब अन्तरात्मा की ओर ले जाती है। बिना एजेण्डा के सिखाएँ, बिना आसक्ति के दें, और भरोसा रखें कि जिस ब्रह्माण्ड को आपने इतने उत्साह से खोजा, वह आपके माध्यम से स्वयं को भी खोज रहा है।',
    },
  },

  // ── 10. Makara (Capricorn) — ruled by Shani ──
  10: {
    student: {
      en: 'Shani grants Makara lagna a maturity beyond your years — you take studies seriously while peers are still finding themselves. This old-soul quality is your hidden advantage. Don\'t rush to prove yourself; Shani rewards patience and methodical effort over decades, not semesters. Build habits now that will compound for a lifetime.',
      hi: 'शनि मकर लग्न को उम्र से परे परिपक्वता प्रदान करता है — जब साथी अभी स्वयं को खोज रहे हैं, आप अध्ययन को गम्भीरता से लेते हैं। यह प्राचीन-आत्मा गुण आपका छिपा लाभ है। स्वयं को सिद्ध करने की जल्दी न करें; शनि सत्रों नहीं, दशकों में धैर्य और व्यवस्थित प्रयास पुरस्कृत करता है। अभी ऐसी आदतें बनाएँ जो जीवन भर फल दें।',
    },
    early_career: {
      en: 'Makara lagna careers start slowly and peak late — this is Shani\'s promise, not a curse. Government, law, engineering, management, and any field requiring endurance suits you. While peers enjoy rapid early success, yours will be slower but far more durable. Build your reputation on reliability; promotions come through trust, not flash.',
      hi: 'मकर लग्न के कैरियर धीमे शुरू होते हैं और देर से शिखर पर पहुँचते हैं — यह शनि का वचन है, अभिशाप नहीं। सरकार, कानून, इंजीनियरिंग, प्रबन्धन और सहनशक्ति वाला कोई भी क्षेत्र उपयुक्त है। जब साथी तीव्र प्रारम्भिक सफलता पाते हैं, आपकी धीमी पर अत्यधिक टिकाऊ होगी। विश्वसनीयता पर प्रतिष्ठा बनाएँ; पदोन्नति चमक से नहीं, भरोसे से आती है।',
    },
    householder: {
      en: 'This is where Shani\'s delayed rewards begin arriving — career authority, financial stability, and social respect. Your household runs with admirable structure and discipline. Ensure discipline doesn\'t become rigidity; your children need your warmth as much as your standards. Knee and joint health deserve attention; Shani governs the skeletal system.',
      hi: 'यहाँ शनि के विलम्बित पुरस्कार आने शुरू होते हैं — कैरियर अधिकार, वित्तीय स्थिरता और सामाजिक सम्मान। आपका घर प्रशंसनीय संरचना और अनुशासन से चलता है। सुनिश्चित करें कि अनुशासन कठोरता न बने; बच्चों को आपके मानकों जितनी ही ऊष्मा चाहिए। घुटने और जोड़ों के स्वास्थ्य पर ध्यान दें; शनि कंकाल तन्त्र का शासक है।',
    },
    established: {
      en: 'You are now in your power decade — Shani peaks in the second half of life for Makara lagna. The authority and wealth that peers enjoyed earlier now flows abundantly to you. Protect what you have built with proper succession planning. Your natural frugality serves you well; resist the urge to suddenly splurge after years of restraint.',
      hi: 'आप अपने शक्ति दशक में हैं — मकर लग्न के लिए शनि जीवन के दूसरे अर्ध में शिखर पर होता है। जो अधिकार और धन साथियों ने पहले पाया, वह अब आपकी ओर प्रचुरता से बहता है। उचित उत्तराधिकार नियोजन से जो बनाया है उसकी रक्षा करें। स्वाभाविक मितव्ययिता आपकी सेवा करती है; वर्षों के संयम के बाद अचानक फिज़ूलखर्ची के प्रलोभन से बचें।',
    },
    elder: {
      en: 'Shani\'s most beautiful paradox reveals itself now: the planet of restriction becomes the planet of liberation through discipline. Your lifetime of structured effort has freed you from material anxiety. Others see you as the unmovable mountain — steady, reliable, eternal. Share your practical wisdom about patience; this generation needs it desperately.',
      hi: 'शनि का सबसे सुन्दर विरोधाभास अब प्रकट होता है: प्रतिबन्ध का ग्रह अनुशासन से मुक्ति का ग्रह बनता है। आपके आजीवन संरचित प्रयास ने भौतिक चिन्ता से मुक्त किया है। दूसरे आपको अचल पर्वत देखते हैं — स्थिर, भरोसेमन्द, शाश्वत। धैर्य का व्यावहारिक ज्ञान बाँटें; इस पीढ़ी को इसकी अत्यन्त आवश्यकता है।',
    },
    sage: {
      en: 'Shani is the Guru of the school of hard knocks — and you have graduated with honours. In this final phase, discipline becomes effortless, structure becomes second nature, and austerity becomes not deprivation but liberation. Simple living, early rising, and steady spiritual practice are not sacrifices for you — they are your natural state. You were born for this.',
      hi: 'शनि कठिन अनुभवों की पाठशाला का गुरु है — और आप सम्मान के साथ स्नातक हैं। इस अन्तिम चरण में अनुशासन सहज हो जाता है, संरचना स्वभाव बन जाती है, और तपस्या वंचना नहीं बल्कि मुक्ति बन जाती है। सादा जीवन, प्रातःकाल जागरण और स्थिर आध्यात्मिक साधना आपके लिए त्याग नहीं — आपकी स्वाभाविक अवस्था है। आप इसके लिए जन्मे थे।',
    },
  },

  // ── 11. Kumbha (Aquarius) — ruled by Shani ──
  11: {
    student: {
      en: 'Shani through Kumbha gives you an unconventional mind that questions established systems. You learn best through independent study, technology, and peer collaboration rather than traditional classroom hierarchies. Science, technology, social reform, and innovation call to you. Your ideas may seem ahead of their time — trust them anyway.',
      hi: 'कुम्भ के माध्यम से शनि आपको एक अपरम्परागत मन देता है जो स्थापित व्यवस्थाओं पर प्रश्न करता है। पारम्परिक कक्षा पदानुक्रम की बजाय स्वतन्त्र अध्ययन, तकनीक और सहपाठी सहयोग से आप बेहतर सीखते हैं। विज्ञान, तकनीक, सामाजिक सुधार और नवाचार आपको बुलाते हैं। आपके विचार अपने समय से आगे लग सकते हैं — फिर भी उन पर भरोसा रखें।',
    },
    early_career: {
      en: 'Kumbha lagna thrives in technology, social enterprise, NGOs, research labs, and any field where innovation matters more than tradition. You work best in flat organizations with intellectual freedom. Your challenge is emotional detachment — colleagues may find you brilliant but distant. Build genuine connections; your ideas need advocates, not just admirers.',
      hi: 'कुम्भ लग्न तकनीक, सामाजिक उद्यम, एनजीओ, अनुसन्धान प्रयोगशालाओं और नवाचार-प्रधान क्षेत्रों में फलता-फूलता है। बौद्धिक स्वतन्त्रता वाले समतल संगठनों में आप सर्वोत्तम काम करते हैं। चुनौती भावनात्मक विरक्ति है — सहकर्मी आपको प्रतिभाशाली पर दूर पा सकते हैं। सच्चे सम्पर्क बनाएँ; आपके विचारों को प्रशंसकों नहीं, समर्थकों की ज़रूरत है।',
    },
    householder: {
      en: 'Your home is likely unconventional — open to diverse people, ideas, and causes. Kumbha lagna parents raise independent-thinking children who question authority (including yours). Embrace this; you are raising future changemakers. Financial planning may feel mundane to your visionary mind, but systematic investment in this phase secures your idealistic later years.',
      hi: 'आपका घर सम्भवतः अपरम्परागत है — विविध लोगों, विचारों और कार्यों के लिए खुला। कुम्भ लग्न के माता-पिता स्वतन्त्र सोच वाले बच्चे पालते हैं जो अधिकार को (आपके सहित) चुनौती देते हैं। इसे अपनाएँ; आप भविष्य के परिवर्तनकर्ता पाल रहे हैं। आपके दूरदर्शी मन को वित्तीय नियोजन सामान्य लग सकता है, पर इस चरण में व्यवस्थित निवेश आदर्शवादी बाद के वर्ष सुरक्षित करता है।',
    },
    established: {
      en: 'Your progressive vision is now backed by decades of credibility. Shani through Kumbha rewards those who serve the collective — board seats on nonprofits, advisory roles in innovation, and community leadership suit you perfectly. Your greatest contribution is not what you built for yourself, but the systems you built for others.',
      hi: 'आपकी प्रगतिशील दृष्टि अब दशकों की विश्वसनीयता से समर्थित है। कुम्भ के माध्यम से शनि सामूहिक सेवा करने वालों को पुरस्कृत करता है — गैर-लाभकारी संस्थाओं में बोर्ड पद, नवाचार में सलाहकार भूमिकाएँ और सामुदायिक नेतृत्व पूर्णतः अनुकूल हैं। आपका सबसे बड़ा योगदान वह नहीं जो स्वयं के लिए बनाया, बल्कि जो व्यवस्थाएँ दूसरों के लिए बनाईं।',
    },
    elder: {
      en: 'The humanitarian flame burns brightest in your later years. Kumbha lagna elders become beacons of social conscience — you see injustice clearly and speak against it without fear. Maintain friendships across generations; your progressive ideas keep younger people energized and their energy keeps you vital. Circulation health needs monitoring; keep moving.',
      hi: 'मानवतावादी ज्वाला आपके उत्तर वर्षों में सबसे तेज जलती है। कुम्भ लग्न के वृद्ध सामाजिक चेतना के प्रकाशस्तम्भ बनते हैं — आप अन्याय स्पष्ट देखते हैं और निर्भय होकर बोलते हैं। पीढ़ियों में मित्रता बनाए रखें; आपके प्रगतिशील विचार युवाओं को ऊर्जा देते हैं और उनकी ऊर्जा आपको जीवन्त रखती है। रक्तसंचार स्वास्थ्य की निगरानी करें; चलते रहें।',
    },
    sage: {
      en: 'Shani through Kumbha achieves its noblest expression in selfless service. Your entire life has been preparation for this: the individual ego dissolves into service to humanity. You need no ashram, no title, no following — your lived example of principled detachment IS the teaching. Simple acts of kindness carry the weight of a lifetime\'s conviction.',
      hi: 'कुम्भ के माध्यम से शनि निःस्वार्थ सेवा में अपनी सर्वोत्कृष्ट अभिव्यक्ति प्राप्त करता है। आपका सम्पूर्ण जीवन इसकी तैयारी रहा है: व्यक्तिगत अहंकार मानवता की सेवा में विलीन हो जाता है। आपको किसी आश्रम, पदवी या अनुयायियों की आवश्यकता नहीं — सिद्धान्तपूर्ण विरक्ति का आपका जीवन्त उदाहरण ही शिक्षा है। दयालुता के सरल कार्य जीवन भर की आस्था का भार वहन करते हैं।',
    },
  },

  // ── 12. Meena (Pisces) — ruled by Guru ──
  12: {
    student: {
      en: 'Guru through Meena gives you a boundless imagination and intuitive understanding that textbooks cannot teach. You absorb knowledge through feeling rather than memorization — arts, music, spirituality, and healing sciences attract you deeply. Your challenge is practical application: ground your dreams in concrete study plans and deadlines.',
      hi: 'मीन के माध्यम से गुरु आपको असीमित कल्पनाशक्ति और सहज बोध देता है जो पाठ्यपुस्तकें नहीं सिखा सकतीं। आप रटन्त से नहीं, अनुभूति से ज्ञान ग्रहण करते हैं — कला, संगीत, आध्यात्मिकता और चिकित्सा विज्ञान गहराई से आकर्षित करते हैं। चुनौती व्यावहारिक अनुप्रयोग है: अपने सपनों को ठोस अध्ययन योजनाओं और समय-सीमाओं में स्थापित करें।',
    },
    early_career: {
      en: 'Meena lagna finds fulfillment in careers that serve a higher purpose — healing, counselling, spiritual teaching, creative arts, and charitable work. Corporate ladder-climbing drains your Guru energy unless the organization has a mission you believe in. Set clear financial boundaries; your generous nature can be exploited. You earn best when you follow purpose, not money.',
      hi: 'मीन लग्न को उच्चतर उद्देश्य वाले कैरियर में पूर्णता मिलती है — चिकित्सा, परामर्श, आध्यात्मिक शिक्षण, रचनात्मक कला और सेवा कार्य। कॉर्पोरेट पदोन्नति आपकी गुरु ऊर्जा क्षीण करती है जब तक संगठन का उद्देश्य विश्वसनीय न हो। स्पष्ट वित्तीय सीमाएँ निर्धारित करें; उदार स्वभाव का शोषण हो सकता है। उद्देश्य का अनुसरण करें, धन का नहीं।',
    },
    householder: {
      en: 'Your home is a sanctuary — a place of music, spirituality, and emotional depth. Meena lagna parents raise compassionate children who understand suffering. Guard against absorbing your family\'s emotional burdens entirely; you need solitude to recharge your deeply empathic nature. Creative hobbies are not luxury but necessity for your wellbeing.',
      hi: 'आपका घर एक अभयारण्य है — संगीत, आध्यात्मिकता और भावनात्मक गहराई का स्थान। मीन लग्न के माता-पिता करुणाशील बच्चे पालते हैं जो पीड़ा समझते हैं। परिवार का सम्पूर्ण भावनात्मक बोझ सोखने से बचें; गहन सहानुभूतिशील स्वभाव को पुनर्स्थापित करने के लिए एकान्त चाहिए। रचनात्मक शौक विलासिता नहीं, आपके कल्याण की आवश्यकता हैं।',
    },
    established: {
      en: 'Your intuitive wisdom has matured into something rare — the ability to sense what is right before logic catches up. Guru in Meena makes you a natural healer, mediator, and spiritual guide. Trust your dreams and intuitions about investments; your subconscious processes information that your rational mind misses. This is the phase to deepen your sadhana.',
      hi: 'आपकी सहज बुद्धि किसी दुर्लभ वस्तु में परिपक्व हुई है — तर्क से पहले सही को भाँपने की क्षमता। मीन में गुरु आपको स्वाभाविक चिकित्सक, मध्यस्थ और आध्यात्मिक मार्गदर्शक बनाता है। निवेश के बारे में अपने स्वप्नों और अन्तर्ज्ञान पर विश्वास करें; आपका अवचेतन वह सूचना संसाधित करता है जो तर्कशील मन चूकता है। यह साधना गहरी करने का चरण है।',
    },
    elder: {
      en: 'The veil between worlds grows thinner for Meena lagna in the elder years — your dreams become more vivid, your intuition almost prophetic. This is a gift, not a symptom. Sacred music, temple visits, and river pilgrimages nourish you profoundly. Be gentle with your feet and lymphatic system; Guru rules these through Meena.',
      hi: 'वृद्धावस्था में मीन लग्न के लिए लोकों का पर्दा पतला होता जाता है — स्वप्न अधिक स्पष्ट होते हैं, अन्तर्ज्ञान लगभग भविष्यवाणी जैसा। यह उपहार है, लक्षण नहीं। भक्ति संगीत, मन्दिर दर्शन और नदी तीर्थयात्रा आपको गहनता से पोषित करती है। पैरों और लसीका तन्त्र का ध्यान रखें; मीन के माध्यम से गुरु इनका शासक है।',
    },
    sage: {
      en: 'Guru achieves its absolute zenith in Meena — the sign of its exaltation and its moolatrikona. Your entire life has been a pilgrimage toward this: the dissolution of the separate self into the ocean of consciousness. You do not need to DO anything more. Simply being present, radiating compassion, and allowing the Divine to flow through you is your final and greatest offering.',
      hi: 'गुरु मीन में अपने परम शिखर को प्राप्त करता है — उच्च और मूलत्रिकोण राशि। आपका सम्पूर्ण जीवन इसकी ओर तीर्थयात्रा रहा है: पृथक आत्मा का चेतना के सागर में विलय। आपको और कुछ करने की आवश्यकता नहीं। बस उपस्थित रहना, करुणा विकीर्ण करना और दिव्यता को अपने माध्यम से प्रवाहित होने देना — यही आपका अन्तिम और सर्वोच्च अर्पण है।',
    },
  },
};

/**
 * BNN (Bhrigu Nandi Nadi) Base Prediction Database
 *
 * 108 entries: 9 planets × 12 signs.
 * Each prediction describes planet-in-sign themes per BNN tradition —
 * focusing on life themes (career, relationships, dharma, karma)
 * rather than predictive events.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs: 1=Aries, 2=Taurus, 3=Gemini, 4=Cancer, 5=Leo, 6=Virgo,
 *           7=Libra, 8=Scorpio, 9=Sagittarius, 10=Capricorn, 11=Aquarius, 12=Pisces
 */

export const BNN_BASE: Record<number, Record<number, { en: string; hi: string }>> = {
  // ─── 0: SUN ────────────────────────────────────────────────────────────────
  0: {
    1: {
      en: 'Sun in Aries activates a pioneering spirit and a natural instinct for leadership. Authority is seized rather than inherited — you forge your own path with confidence and courage. Government service, military careers, or entrepreneurial ventures suit this placement; the father figure is typically dynamic, forceful, and independent-minded.',
      hi: 'मेष राशि में सूर्य एक अग्रणी भावना और नेतृत्व की स्वाभाविक प्रवृत्ति को सक्रिय करता है। अधिकार विरासत में नहीं मिलता, बल्कि आत्मविश्वास और साहस से अर्जित किया जाता है। सरकारी सेवा, सैन्य करियर या उद्यमिता इस स्थान के लिए उपयुक्त हैं; पिता आमतौर पर गतिशील, दृढ़ और स्वतंत्र विचारों वाले होते हैं।',
    },
    2: {
      en: 'Sun in Taurus brings authority through accumulated wealth and material mastery. Prestige is expressed through possessions, land, and financial stability. The native often rises to prominence in banking, agriculture, arts administration, or luxury industries. The father is typically a man of substance and steady values.',
      hi: 'वृषभ राशि में सूर्य संचित धन और भौतिक निपुणता के माध्यम से अधिकार लाता है। प्रतिष्ठा संपत्ति, भूमि और वित्तीय स्थिरता के माध्यम से व्यक्त होती है। बैंकिंग, कृषि, कला प्रशासन या विलासिता उद्योगों में प्रमुखता संभव है। पिता आमतौर पर ठोस मूल्यों वाले समृद्ध व्यक्ति होते हैं।',
    },
    3: {
      en: 'Sun in Gemini confers authority through intellect, communication, and versatility. Fame comes through writing, oratory, media, or multiple fields of expertise. The native commands respect by knowing more and expressing it better than peers. The father is educated, communicative, and often involved in trade or information-based work.',
      hi: 'मिथुन राशि में सूर्य बुद्धि, संचार और बहुमुखी प्रतिभा के माध्यम से अधिकार प्रदान करता है। लेखन, वक्तृत्व, मीडिया या विशेषज्ञता के अनेक क्षेत्रों से ख्याति मिलती है। पिता शिक्षित, वाचाल और प्रायः व्यापार या सूचना-आधारित कार्य में संलग्न होते हैं।',
    },
    4: {
      en: 'Sun in Cancer places authority within the domestic and public sphere — leadership in community affairs, administration, or caretaking roles. The native is deeply attached to roots, homeland, and lineage. The father has a nurturing or protective role in the family; emotional intelligence becomes the tool of power here.',
      hi: 'कर्क राशि में सूर्य घरेलू और सार्वजनिक क्षेत्र में अधिकार रखता है। सामुदायिक मामलों, प्रशासन या देखभाल की भूमिकाओं में नेतृत्व मिलता है। मूल जड़ों, मातृभूमि और वंश से गहरा लगाव होता है। पिता परिवार में पोषण या सुरक्षात्मक भूमिका निभाते हैं।',
    },
    5: {
      en: 'Sun in Leo is its own sign — the fullest expression of solar power. Royal bearing, creative authority, and an irrepressible need for recognition define this placement. Leadership is natural and magnetic; government, politics, performing arts, and administration all beckon. The father is a proud, generous, and often prominent figure.',
      hi: 'सिंह राशि में सूर्य अपने ही राशि में है — सौर शक्ति की पूर्णतम अभिव्यक्ति। शाही आचरण, रचनात्मक अधिकार और पहचान की अदम्य इच्छा इस स्थान को परिभाषित करती है। सरकार, राजनीति, प्रदर्शन कला और प्रशासन में नेतृत्व मिलता है। पिता गर्वित, उदार और प्रमुख व्यक्ति होते हैं।',
    },
    6: {
      en: 'Sun in Virgo expresses authority through service, analysis, and refined skill. Leadership comes in professional domains — medicine, technical fields, government administration, or health services. The native commands respect through precision and competence rather than charisma. The father is detail-oriented, health-conscious, or in a service profession.',
      hi: 'कन्या राशि में सूर्य सेवा, विश्लेषण और परिष्कृत कौशल के माध्यम से अधिकार व्यक्त करता है। चिकित्सा, तकनीकी क्षेत्र, सरकारी प्रशासन या स्वास्थ्य सेवाओं में नेतृत्व मिलता है। पिता विवरण-उन्मुख, स्वास्थ्य-सचेत या सेवा व्यवसाय में होते हैं।',
    },
    7: {
      en: 'Sun in Libra — debilitated — creates authority through partnership, law, and diplomacy but with underlying tension around self-assertion. Leadership is achieved through collaboration rather than individual command. Careers in law, justice, diplomacy, or public relations are favoured. The father may be compromised in authority or a figure of diplomatic bearing.',
      hi: 'तुला राशि में सूर्य नीचस्थ है — साझेदारी, कानून और कूटनीति के माध्यम से अधिकार बनता है लेकिन आत्म-दावे में आंतरिक तनाव रहता है। कानून, न्याय, कूटनीति या जन संपर्क में करियर अनुकूल है। पिता कूटनीतिक स्वभाव के या अधिकार में समझौता करने वाले हो सकते हैं।',
    },
    8: {
      en: 'Sun in Scorpio places authority in the domain of transformation, hidden power, and investigation. Leadership through research, occult sciences, intelligence services, or crisis management is indicated. The native has an ability to see through surfaces and command respect from depth. The father may have secret strengths or involvement in mysterious occupations.',
      hi: 'वृश्चिक राशि में सूर्य रूपांतरण, छिपी शक्ति और जांच के क्षेत्र में अधिकार देता है। अनुसंधान, गूढ़ विज्ञान, खुफिया सेवाओं या संकट प्रबंधन में नेतृत्व संभव है। पिता के पास गुप्त शक्तियाँ हो सकती हैं या वे रहस्यमय व्यवसायों में संलग्न हो सकते हैं।',
    },
    9: {
      en: 'Sun in Sagittarius confers authority through higher learning, dharma, and the expansion of wisdom. Leadership in academia, law, religion, publishing, or international affairs is natural. The native is a philosophical guide who commands respect through the breadth of knowledge. The father is learned, idealistic, and often spiritually inclined.',
      hi: 'धनु राशि में सूर्य उच्च शिक्षा, धर्म और ज्ञान के विस्तार के माध्यम से अधिकार देता है। अकादमिक, कानून, धर्म, प्रकाशन या अंतरराष्ट्रीय मामलों में नेतृत्व स्वाभाविक है। पिता विद्वान, आदर्शवादी और प्रायः आध्यात्मिक रूप से झुके होते हैं।',
    },
    10: {
      en: 'Sun in Capricorn brings authority through sustained effort, institutional power, and professional achievement. Government administration, corporate leadership, or traditional authority roles are strongly favoured. The native rises slowly but ascends to lasting heights. The father is hardworking, ambitious, and disciplined in worldly affairs.',
      hi: 'मकर राशि में सूर्य निरंतर प्रयास, संस्थागत शक्ति और पेशेवर उपलब्धि के माध्यम से अधिकार लाता है। सरकारी प्रशासन, कॉर्पोरेट नेतृत्व या पारंपरिक अधिकार भूमिकाएँ अनुकूल हैं। पिता मेहनती, महत्वाकांक्षी और सांसारिक मामलों में अनुशासित होते हैं।',
    },
    11: {
      en: 'Sun in Aquarius expresses authority through social vision, innovation, and collective leadership. The native commands respect by elevating communities, driving humanitarian causes, or pioneering technology. Leadership is often unconventional — serving the group rather than reigning over it. The father has progressive views and may be involved in community or scientific work.',
      hi: 'कुम्भ राशि में सूर्य सामाजिक दृष्टिकोण, नवाचार और सामूहिक नेतृत्व के माध्यम से अधिकार व्यक्त करता है। समुदायों को ऊपर उठाकर, मानवतावादी कारणों को आगे बढ़ाकर या प्रौद्योगिकी में अग्रणी होकर सम्मान मिलता है। पिता प्रगतिशील विचारों वाले और समुदाय या वैज्ञानिक कार्य में संलग्न हो सकते हैं।',
    },
    12: {
      en: 'Sun in Pisces places authority in the realm of imagination, spirituality, and compassion. The native finds power through healing arts, spiritual guidance, creative expression, or working behind the scenes. Leadership here is surrendered ego rather than asserted will. The father may be spiritually sensitive, artistic, or less materially prominent.',
      hi: 'मीन राशि में सूर्य कल्पना, आध्यात्मिकता और करुणा के क्षेत्र में अधिकार देता है। चिकित्सा कला, आध्यात्मिक मार्गदर्शन, रचनात्मक अभिव्यक्ति या पर्दे के पीछे काम करने से शक्ति मिलती है। पिता आध्यात्मिक रूप से संवेदनशील, कलात्मक या कम भौतिक रूप से प्रमुख हो सकते हैं।',
    },
  },

  // ─── 1: MOON ───────────────────────────────────────────────────────────────
  1: {
    1: {
      en: 'Moon in Aries creates a restless, impulsive mind that is quick to react and slow to reflect. Emotional life is intense and changeable — passions run high and fade quickly. The mother is energetic, independent, and possibly short-tempered. The native thrives in fast-moving environments and struggles with emotional patience.',
      hi: 'मेष राशि में चन्द्रमा एक बेचैन, आवेगी मन बनाता है जो जल्दी प्रतिक्रिया करता है और धीरे सोचता है। भावनात्मक जीवन तीव्र और परिवर्तनशील है। माँ ऊर्जावान, स्वतंत्र और संभवतः जल्दी गुस्सा होने वाली हैं। तेज़ गतिशील वातावरण में उत्कर्ष होता है।',
    },
    2: {
      en: 'Moon in Taurus — exalted — brings emotional stability, sensory pleasure, and a deep attachment to comfort and beauty. The mind is steady, patient, and focused on building lasting security. The mother is nurturing, practical, and devoted to material well-being. Financial accumulation and attachment to home are primary life themes.',
      hi: 'वृषभ राशि में चन्द्रमा उच्च स्थान में है — भावनात्मक स्थिरता, इंद्रिय सुख और आराम एवं सौंदर्य से गहरा लगाव होता है। मन स्थिर, धैर्यवान और स्थायी सुरक्षा बनाने पर केंद्रित है। माँ पोषण करने वाली, व्यावहारिक और भौतिक कल्याण के प्रति समर्पित हैं।',
    },
    3: {
      en: 'Moon in Gemini creates a brilliant, communicative, but emotionally scattered mind. The native is curious, witty, and drawn to learning, writing, and social interaction. Emotions shift rapidly with new information. The mother is intelligent, talkative, and versatile. Multiple interests and simultaneous pursuits define the emotional landscape.',
      hi: 'मिथुन राशि में चन्द्रमा एक प्रतिभाशाली, संवादशील लेकिन भावनात्मक रूप से बिखरा हुआ मन बनाता है। जिज्ञासु, हाजिर जवाब और सीखने, लिखने व सामाजिक मेल-जोल में रुचि होती है। माँ बुद्धिमान, बातूनी और बहुमुखी हैं।',
    },
    4: {
      en: 'Moon in Cancer — its own sign — bestows the strongest expression of lunar qualities: deep nurturing, powerful intuition, and profound emotional bonds. Home and family are the axis of existence. The native is highly empathic and protective. The mother is a central, loving figure whose influence shapes the entire emotional foundation.',
      hi: 'कर्क राशि में चन्द्रमा अपनी राशि में है — चंद्र गुणों की सबसे शक्तिशाली अभिव्यक्ति: गहरा पोषण, शक्तिशाली अंतर्ज्ञान और गहरे भावनात्मक बंधन। घर और परिवार अस्तित्व की धुरी हैं। माँ एक केंद्रीय, प्रेमपूर्ण व्यक्ति हैं।',
    },
    5: {
      en: 'Moon in Leo generates emotional warmth, dramatic expression, and a strong need for appreciation and public recognition. The native is generous, creative, and emotionally magnanimous. The mother is proud, performative, and may have a strong personality. Emotional fulfilment comes through creative expression, leadership, and being seen.',
      hi: 'सिंह राशि में चन्द्रमा भावनात्मक उष्णता, नाटकीय अभिव्यक्ति और सराहना एवं सार्वजनिक पहचान की तीव्र इच्छा उत्पन्न करता है। उदार, रचनात्मक और भावनात्मक रूप से महानुभाव होते हैं। माँ गर्वित और प्रबल व्यक्तित्व वाली हैं।',
    },
    6: {
      en: 'Moon in Virgo creates an analytical, detail-oriented emotional nature. The mind finds comfort in order, routine, and practical problem-solving. There is a tendency to worry and over-analyse feelings. The mother is helpful, health-conscious, and service-oriented. Emotional peace comes through useful work and clean, organised living.',
      hi: 'कन्या राशि में चन्द्रमा एक विश्लेषणात्मक, विवरण-उन्मुख भावनात्मक स्वभाव बनाता है। मन व्यवस्था, दिनचर्या और व्यावहारिक समस्या-समाधान में आराम पाता है। भावनाओं को अधिक सोचने की प्रवृत्ति होती है। माँ सहायक, स्वास्थ्य-सचेत और सेवा-उन्मुख हैं।',
    },
    7: {
      en: 'Moon in Libra creates a mind oriented toward beauty, balance, and relationship. Emotional wellbeing is deeply tied to the quality of partnerships and social harmony. The native is charming, diplomatic, and uncomfortable with conflict. The mother is gracious and relationship-oriented. Decisions are often delayed by the need to weigh all sides.',
      hi: 'तुला राशि में चन्द्रमा सौंदर्य, संतुलन और संबंध की ओर उन्मुख मन बनाता है। भावनात्मक कल्याण साझेदारी की गुणवत्ता और सामाजिक सामंजस्य से गहराई से जुड़ा है। माँ शालीन और संबंध-उन्मुख हैं।',
    },
    8: {
      en: 'Moon in Scorpio — debilitated — creates intense, transformative, and often turbulent emotional depths. The native experiences emotions with volcanic force — profound attachments, powerful jealousies, and rare moments of transcendence. The mother is complex, secretive, or a transformative influence. Psychological depth and regeneration are lifelong themes.',
      hi: 'वृश्चिक राशि में चन्द्रमा नीचस्थ है — तीव्र, रूपांतरित करने वाली और अक्सर उथल-पुथल भरी भावनात्मक गहराइयाँ बनाता है। भावनाएँ ज्वालामुखी बल के साथ अनुभव होती हैं। माँ जटिल, रहस्यमय या एक परिवर्तनकारी प्रभाव हैं।',
    },
    9: {
      en: 'Moon in Sagittarius creates an expansive, optimistic, and freedom-seeking mind. Emotional wellbeing is tied to learning, travel, philosophy, and the pursuit of higher truth. The native is emotionally generous but needs intellectual and spiritual space. The mother is philosophical, religious, or widely travelled.',
      hi: 'धनु राशि में चन्द्रमा एक विस्तृत, आशावादी और स्वतंत्रता-चाहने वाला मन बनाता है। भावनात्मक कल्याण सीखने, यात्रा, दर्शन और उच्च सत्य की खोज से जुड़ा है। माँ दार्शनिक, धार्मिक या व्यापक यात्रा करने वाली हैं।',
    },
    10: {
      en: 'Moon in Capricorn creates an emotionally reserved, disciplined, and achievement-oriented mind. The native may suppress feelings in favour of duty and practical responsibility. The mother may be emotionally distant but responsible and hardworking. Emotional fulfilment comes through professional accomplishment and structured life goals.',
      hi: 'मकर राशि में चन्द्रमा भावनात्मक रूप से संयमित, अनुशासित और उपलब्धि-उन्मुख मन बनाता है। कर्तव्य और व्यावहारिक जिम्मेदारी के पक्ष में भावनाएँ दबा दी जा सकती हैं। माँ भावनात्मक रूप से दूर लेकिन जिम्मेदार और मेहनती हो सकती हैं।',
    },
    11: {
      en: 'Moon in Aquarius creates an intellectually oriented, socially aware, but emotionally detached mind. The native processes feelings through ideas rather than direct experience. Friendship and humanitarian connection replace personal intimacy as primary emotional sustenance. The mother may be unconventional, intellectual, or socially progressive.',
      hi: 'कुम्भ राशि में चन्द्रमा बौद्धिक रूप से उन्मुख, सामाजिक रूप से जागरूक लेकिन भावनात्मक रूप से अलग मन बनाता है। भावनाएँ प्रत्यक्ष अनुभव के बजाय विचारों के माध्यम से संसाधित होती हैं। माँ अपरंपरागत, बौद्धिक या सामाजिक रूप से प्रगतिशील हो सकती हैं।',
    },
    12: {
      en: 'Moon in Pisces creates a deeply intuitive, empathic, and spiritually receptive mind. Emotions are porous — the native absorbs the feelings of others effortlessly. Mystical experiences, creative imagination, and compassionate service feel emotionally nourishing. The mother is sensitive, selfless, or spiritually devoted.',
      hi: 'मीन राशि में चन्द्रमा एक गहरा अंतर्ज्ञानी, सहानुभूतिपूर्ण और आध्यात्मिक रूप से ग्रहणशील मन बनाता है। भावनाएँ पारगम्य होती हैं। रहस्यमय अनुभव, रचनात्मक कल्पना और करुणापूर्ण सेवा भावनात्मक रूप से पोषण देती है। माँ संवेदनशील, निस्वार्थ या आध्यात्मिक रूप से समर्पित हैं।',
    },
  },

  // ─── 2: MARS ───────────────────────────────────────────────────────────────
  2: {
    1: {
      en: 'Mars in Aries — its own sign — produces a native of exceptional courage, drive, and competitive energy. Property acquired through personal initiative; siblings are strong, independent personalities. Athletic excellence, military leadership, surgery, or entrepreneurship are primary career themes. Energy levels are high but patience is scarce.',
      hi: 'मेष राशि में मंगल — अपनी राशि में — असाधारण साहस, प्रेरणा और प्रतिस्पर्धी ऊर्जा का व्यक्ति बनाता है। व्यक्तिगत पहल से संपत्ति अर्जित होती है। खेल में उत्कृष्टता, सैन्य नेतृत्व, शल्य चिकित्सा या उद्यमिता प्रमुख करियर विषय हैं।',
    },
    2: {
      en: 'Mars in Taurus drives the accumulation of property, financial assets, and material resources through persistent, determined effort. Siblings may be involved in business or agriculture. Stubbornness can become an asset — the native never abandons a goal once committed. Land, construction, and durable goods industries are favoured.',
      hi: 'वृषभ राशि में मंगल दृढ़, संकल्पित प्रयास के माध्यम से संपत्ति, वित्तीय संपत्ति और भौतिक संसाधनों के संचय को प्रेरित करता है। भाई-बहन व्यापार या कृषि में शामिल हो सकते हैं। भूमि, निर्माण और टिकाऊ वस्तु उद्योग अनुकूल हैं।',
    },
    3: {
      en: 'Mars in Gemini produces a sharp, combative intellect and quick-witted communication skills. Siblings are numerous, energetic, or intellectually competitive. Writing, journalism, sales, and debate suit this placement well. The native argues passionately and can be cutting with words — channelling this into advocacy produces outstanding results.',
      hi: 'मिथुन राशि में मंगल एक तीव्र, लड़ाकू बुद्धि और चतुर संचार कौशल पैदा करता है। भाई-बहन अनेक, ऊर्जावान या बौद्धिक रूप से प्रतिस्पर्धी होते हैं। लेखन, पत्रकारिता, बिक्री और वाद-विवाद इस स्थान के लिए उपयुक्त हैं।',
    },
    4: {
      en: 'Mars in Cancer creates tension between drive and domesticity. Property is acquired but through struggle — real estate disputes or family property conflicts are common themes. Siblings may have a complex relationship with the mother. The native needs to guard against emotional aggression; channelling drive into home-building is the path of resolution.',
      hi: 'कर्क राशि में मंगल प्रेरणा और घरेलूपन के बीच तनाव पैदा करता है। संपत्ति अर्जित होती है लेकिन संघर्ष के माध्यम से। भाई-बहन का माँ के साथ जटिल संबंध हो सकता है। घर बनाने में प्रेरणा को चैनल करना समाधान का मार्ग है।',
    },
    5: {
      en: 'Mars in Leo generates bold, creative courage and a drive for recognition and dramatic self-expression. Property often involves speculative investments or entertainment ventures. Siblings are proud, ambitious individuals. Leadership in creative fields, sports management, or children\'s education suits this fiery placement.',
      hi: 'सिंह राशि में मंगल साहसी, रचनात्मक हिम्मत और मान्यता एवं नाटकीय आत्म-अभिव्यक्ति की प्रेरणा उत्पन्न करता है। संपत्ति में अक्सर सट्टेबाजी के निवेश शामिल होते हैं। भाई-बहन गर्वित, महत्वाकांक्षी होते हैं। रचनात्मक क्षेत्रों में नेतृत्व अनुकूल है।',
    },
    6: {
      en: 'Mars in Virgo directs energy into service, technical precision, and health-related fields. Military medicine, surgical specialisations, engineering, or competitive analytical work suit this placement. Siblings tend to be skilled technicians or health professionals. Energy is best deployed in systematic, methodical work rather than impulsive action.',
      hi: 'कन्या राशि में मंगल ऊर्जा को सेवा, तकनीकी सटीकता और स्वास्थ्य-संबंधित क्षेत्रों में निर्देशित करता है। सैन्य चिकित्सा, शल्य विशेषज्ञता, इंजीनियरिंग या प्रतिस्पर्धी विश्लेषणात्मक कार्य उपयुक्त हैं। भाई-बहन कुशल तकनीशियन या स्वास्थ्य पेशेवर होते हैं।',
    },
    7: {
      en: 'Mars in Libra creates passionate, assertive tendencies within partnership. Legal battles, competitive business partnerships, or romantic rivalry are recurring themes. The native fights for justice and equality with genuine conviction. Siblings may be involved in legal or social-reform work. The challenge is balancing assertiveness with the Libran need for harmony.',
      hi: 'तुला राशि में मंगल साझेदारी में जोशीली, दृढ़ प्रवृत्तियाँ बनाता है। कानूनी लड़ाई, प्रतिस्पर्धी व्यापारिक साझेदारी या रोमांटिक प्रतिद्वंद्विता आवर्ती विषय हैं। न्याय और समानता के लिए लड़ाई सच्ची विश्वास के साथ होती है।',
    },
    8: {
      en: 'Mars in Scorpio — its own sign — produces the most intense, transformative, and investigative expression of Martian energy. Capacity for deep research, esoteric sciences, surgery, crisis intervention, and uncovering hidden truths is exceptional. Siblings may be intense or secretive personalities. The drive to penetrate beneath surfaces is the defining life theme.',
      hi: 'वृश्चिक राशि में मंगल — अपनी राशि में — मंगल ऊर्जा की सबसे तीव्र, रूपांतरित करने वाली अभिव्यक्ति पैदा करता है। गहरे शोध, गूढ़ विज्ञान, शल्य चिकित्सा और छिपे सत्य को उजागर करने की असाधारण क्षमता होती है।',
    },
    9: {
      en: 'Mars in Sagittarius channels courage into philosophical conviction and the defence of dharma. The native fights for higher principles — religious reform, legal crusades, or academic freedom. Siblings may be travellers, philosophers, or lawyers. Long journeys energise the native; teaching, publishing, and spiritual activism suit this placement.',
      hi: 'धनु राशि में मंगल साहस को दार्शनिक विश्वास और धर्म की रक्षा में चैनल करता है। उच्च सिद्धांतों के लिए लड़ाई होती है — धार्मिक सुधार, कानूनी अभियान या शैक्षणिक स्वतंत्रता। भाई-बहन यात्री, दार्शनिक या वकील हो सकते हैं।',
    },
    10: {
      en: 'Mars in Capricorn — exalted — produces disciplined, ambitious, and supremely effective action. Career ascent is steady and relentless; the native excels in administrative leadership, engineering, government service, or construction. Property accumulation through diligent sustained effort is a defining feature. Siblings are typically ambitious and career-driven.',
      hi: 'मकर राशि में मंगल — उच्च स्थान में — अनुशासित, महत्वाकांक्षी और अत्यंत प्रभावी क्रिया पैदा करता है। करियर में वृद्धि स्थिर और अथक है। प्रशासनिक नेतृत्व, इंजीनियरिंग, सरकारी सेवा या निर्माण में उत्कृष्टता होती है।',
    },
    11: {
      en: 'Mars in Aquarius channels energy into collective action, innovation, and social reform. The native fights for systemic change and is energised by groups, technology, and progressive causes. Siblings may be scientists, activists, or community organisers. Property comes through networks or unconventional means; the drive is to improve systems, not just personal gain.',
      hi: 'कुम्भ राशि में मंगल ऊर्जा को सामूहिक क्रिया, नवाचार और सामाजिक सुधार में चैनल करता है। प्रणालीगत परिवर्तन के लिए लड़ाई होती है। भाई-बहन वैज्ञानिक, कार्यकर्ता या सामुदायिक आयोजक हो सकते हैं।',
    },
    12: {
      en: 'Mars in Pisces directs energy inward — toward spiritual practice, healing arts, and creative imagination. Property may be in foreign lands or acquired through charitable work. Siblings may be spiritual seekers or artists. The native\'s greatest battles are interior ones; channelling drive into meditation, creative service, or healing work brings fulfilment.',
      hi: 'मीन राशि में मंगल ऊर्जा को अंदर की ओर निर्देशित करता है — आध्यात्मिक अभ्यास, उपचार कला और रचनात्मक कल्पना की ओर। संपत्ति विदेश में या धर्मार्थ कार्य के माध्यम से अर्जित हो सकती है। सबसे बड़ी लड़ाइयाँ आंतरिक होती हैं।',
    },
  },

  // ─── 3: MERCURY ────────────────────────────────────────────────────────────
  3: {
    1: {
      en: 'Mercury in Aries produces quick, assertive, and pioneering thinking. Communication is direct, bold, and sometimes impatient. Business ventures that require rapid decisions suit this placement. The native excels in competitive intellectual fields and is often the first to express an innovative idea — though follow-through benefits from conscious effort.',
      hi: 'मेष राशि में बुध त्वरित, दृढ़ और अग्रणी सोच पैदा करता है। संचार सीधा, साहसी और कभी-कभी अधीर होता है। तीव्र निर्णय की आवश्यकता वाले व्यापारिक उद्यम उपयुक्त हैं। प्रतिस्पर्धी बौद्धिक क्षेत्रों में उत्कृष्टता होती है।',
    },
    2: {
      en: 'Mercury in Taurus produces steady, methodical, and practical intellect. Communication is measured, reliable, and focused on tangible outcomes. Business in finance, banking, agriculture, or luxury goods is favoured. The native builds knowledge systems slowly and retains them reliably — a formidable memory paired with patient analysis.',
      hi: 'वृषभ राशि में बुध स्थिर, व्यवस्थित और व्यावहारिक बुद्धि पैदा करता है। संचार मापा हुआ, विश्वसनीय और मूर्त परिणामों पर केंद्रित है। वित्त, बैंकिंग, कृषि या विलासिता वस्तुओं में व्यापार अनुकूल है।',
    },
    3: {
      en: 'Mercury in Gemini — own sign — produces the sharpest, most versatile, and communicatively gifted mind. Writing, media, education, and trade are natural arenas of success. The native processes information rapidly and speaks with elegance and precision. Multiple income streams, business ventures, and intellectual pursuits run simultaneously.',
      hi: 'मिथुन राशि में बुध — अपनी राशि में — सबसे तीव्र, बहुमुखी और संचार में प्रतिभाशाली मन पैदा करता है। लेखन, मीडिया, शिक्षा और व्यापार सफलता के स्वाभाविक क्षेत्र हैं। जानकारी तेज़ी से संसाधित होती है और सुरुचि के साथ व्यक्त होती है।',
    },
    4: {
      en: 'Mercury in Cancer creates an intuitive, emotionally informed intellect. The native thinks through feelings and communicates with warmth and memory. Business related to home, food, real estate, or emotional services is suited here. Strong attachment to family stories and ancestral knowledge; writing about home, heritage, or psychology is a natural gift.',
      hi: 'कर्क राशि में बुध एक अंतर्ज्ञानी, भावनात्मक रूप से सूचित बुद्धि बनाता है। घर, भोजन, रियल एस्टेट या भावनात्मक सेवाओं से संबंधित व्यापार उपयुक्त है। पारिवारिक कहानियों और पैतृक ज्ञान से मजबूत लगाव होता है।',
    },
    5: {
      en: 'Mercury in Leo gives intellect a performative, authoritative, and creative flair. The native is a natural teacher, presenter, or intellectual entertainer. Business in publishing, entertainment, or education leadership is favoured. Communication commands attention; there is a gift for making complex ideas accessible and memorable.',
      hi: 'सिंह राशि में बुध बुद्धि को प्रदर्शनकारी, आधिकारिक और रचनात्मक चरित्र देता है। प्राकृतिक शिक्षक, प्रस्तुतकर्ता या बौद्धिक मनोरंजनकर्ता होते हैं। प्रकाशन, मनोरंजन या शिक्षा नेतृत्व में व्यापार अनुकूल है।',
    },
    6: {
      en: 'Mercury in Virgo — exalted and own sign — produces the most analytical, precise, and service-oriented intellect in the zodiac. Detail mastery, technical writing, data analysis, medicine, and accounting are natural strengths. The native finds flaws others miss and communicates with surgical clarity. Business in healthcare, editing, or information services is especially favoured.',
      hi: 'कन्या राशि में बुध — उच्च और अपनी राशि में — राशिचक्र में सबसे विश्लेषणात्मक, सटीक और सेवा-उन्मुख बुद्धि पैदा करता है। विवरण में महारत, तकनीकी लेखन, डेटा विश्लेषण, चिकित्सा और लेखांकन स्वाभाविक शक्तियाँ हैं।',
    },
    7: {
      en: 'Mercury in Libra produces a balanced, diplomatic, and aesthetically refined intellect. Communication is gracious and persuasive — the native excels in negotiation, law, counselling, and the arts. Business partnerships are intellectually productive. The native processes information through relationship — comparing, weighing, and synthesising perspectives.',
      hi: 'तुला राशि में बुध संतुलित, कूटनीतिक और सौंदर्यबोध से परिष्कृत बुद्धि पैदा करता है। संचार शालीन और प्रेरक है। वार्ता, कानून, परामर्श और कला में उत्कृष्टता होती है। व्यापारिक साझेदारियाँ बौद्धिक रूप से उत्पादक हैं।',
    },
    8: {
      en: 'Mercury in Scorpio gives the intellect penetrating depth, investigative instinct, and an appetite for hidden knowledge. Research, psychology, occult sciences, forensic investigation, and intelligence work suit this placement. Communication can be probing and intense. Business in research, pharmaceuticals, or financial investigation is favoured.',
      hi: 'वृश्चिक राशि में बुध बुद्धि को भेदने वाली गहराई, जांच की प्रवृत्ति और छिपे ज्ञान की भूख देता है। अनुसंधान, मनोविज्ञान, गूढ़ विज्ञान, फोरेंसिक जांच और खुफिया कार्य उपयुक्त हैं।',
    },
    9: {
      en: 'Mercury in Sagittarius creates a broad, philosophically inclined, and sometimes scattered intellect. The mind grasps big pictures and universal patterns but may overlook details. Business in publishing, education, international trade, or legal philosophy is favoured. Communication is enthusiastic and visionary; precision benefits from conscious cultivation.',
      hi: 'धनु राशि में बुध एक व्यापक, दार्शनिक रूप से झुका हुआ और कभी-कभी बिखरा हुआ बुद्धि बनाता है। प्रकाशन, शिक्षा, अंतर्राष्ट्रीय व्यापार या कानूनी दर्शन में व्यापार अनुकूल है। संचार उत्साहपूर्ण और दूरदर्शी है।',
    },
    10: {
      en: 'Mercury in Capricorn produces a disciplined, structured, and strategically oriented intellect. The native thinks in long-term frameworks and communicates with authority and concision. Business in administration, corporate strategy, civil engineering, or government planning is favoured. Writing is precise; the native builds intellectual structures that last.',
      hi: 'मकर राशि में बुध अनुशासित, संरचित और रणनीतिक रूप से उन्मुख बुद्धि पैदा करता है। दीर्घकालिक ढाँचों में सोचते हैं और अधिकार व संक्षिप्तता के साथ संवाद करते हैं। प्रशासन, कॉर्पोरेट रणनीति, सिविल इंजीनियरिंग या सरकारी योजना में व्यापार अनुकूल है।',
    },
    11: {
      en: 'Mercury in Aquarius creates a visionary, socially conscious, and technologically innovative intellect. The native is drawn to systems thinking, collective intelligence, and futuristic ideas. Communication through digital media, group forums, and broadcasting suits this placement. Business in technology, social networks, or humanitarian organisations is especially favoured.',
      hi: 'कुम्भ राशि में बुध एक दूरदर्शी, सामाजिक रूप से जागरूक और तकनीकी रूप से अभिनव बुद्धि बनाता है। प्रणाली सोच, सामूहिक बुद्धिमत्ता और भविष्यवादी विचारों की ओर आकर्षण होता है। प्रौद्योगिकी, सामाजिक नेटवर्क या मानवतावादी संगठनों में व्यापार विशेष रूप से अनुकूल है।',
    },
    12: {
      en: 'Mercury in Pisces — debilitated — creates an intuitive, imaginative, and spiritually receptive mind, but one prone to vagueness and impracticality. Creative writing, poetry, spiritual teachings, and healing communication are where this intellect shines. Business in the arts, retreat services, or spiritual education can prosper with discipline applied to the imaginative gifts.',
      hi: 'मीन राशि में बुध नीचस्थ है — एक अंतर्ज्ञानी, कल्पनाशील और आध्यात्मिक रूप से ग्रहणशील मन बनाता है, लेकिन अस्पष्टता की प्रवृत्ति के साथ। रचनात्मक लेखन, कविता, आध्यात्मिक शिक्षाएं और उपचार संचार में यह बुद्धि चमकती है।',
    },
  },

  // ─── 4: JUPITER ────────────────────────────────────────────────────────────
  4: {
    1: {
      en: 'Jupiter in Aries bestows wisdom expressed through bold action and pioneering dharma. The native is a natural teacher and guide who leads by example. Children are dynamic, courageous, and independent-minded. Expansion comes through initiative, sports, martial disciplines, or religious leadership. The life purpose involves inspiring others to act with courage and conviction.',
      hi: 'मेष राशि में बृहस्पति साहसी क्रिया और अग्रणी धर्म के माध्यम से व्यक्त ज्ञान प्रदान करता है। प्राकृतिक शिक्षक और मार्गदर्शक जो उदाहरण से नेतृत्व करते हैं। बच्चे गतिशील, साहसी और स्वतंत्र विचारों वाले होते हैं। धर्म में नेतृत्व के माध्यम से विस्तार होता है।',
    },
    2: {
      en: 'Jupiter in Taurus produces abundant wealth accumulation, financial wisdom, and genuine generosity. The native blesses others through material provision. Children are stable, prosperous, and practically oriented. Dharma is expressed through stewardship of resources — ensuring family, community, and tradition are supported. Business in finance, education, or agriculture brings great prosperity.',
      hi: 'वृषभ राशि में बृहस्पति प्रचुर धन संचय, वित्तीय बुद्धि और वास्तविक उदारता पैदा करता है। बच्चे स्थिर, समृद्ध और व्यावहारिक रूप से उन्मुख होते हैं। संसाधनों के प्रबंधन के माध्यम से धर्म व्यक्त होता है।',
    },
    3: {
      en: 'Jupiter in Gemini expands wisdom through communication, teaching, and the exchange of diverse ideas. The native is a prolific writer, educator, or multi-disciplinary thinker. Children are intellectually gifted and communicative. Dharma is expressed through the dissemination of knowledge across many channels; siblings may be great teachers or scholars.',
      hi: 'मिथुन राशि में बृहस्पति संचार, शिक्षण और विविध विचारों के आदान-प्रदान के माध्यम से ज्ञान का विस्तार करता है। विपुल लेखक, शिक्षक या बहु-अनुशासनीय विचारक होते हैं। बच्चे बौद्धिक रूप से प्रतिभाशाली और संवादशील होते हैं।',
    },
    4: {
      en: 'Jupiter in Cancer — exalted — produces the highest expression of Jupiterian grace in domestic and emotional life. The native blesses home, family, and community with wisdom and generosity. Children are deeply loved and spiritually protected. The motherland or ancestral heritage carries a sacred dimension. Dharma is rooted in care, belonging, and the nurturing of tradition.',
      hi: 'कर्क राशि में बृहस्पति — उच्च स्थान में — घरेलू और भावनात्मक जीवन में बृहस्पतीय कृपा की उच्चतम अभिव्यक्ति पैदा करता है। घर, परिवार और समुदाय को ज्ञान और उदारता से आशीर्वाद देते हैं। धर्म देखभाल, अपनेपन और परंपरा के पोषण में निहित है।',
    },
    5: {
      en: 'Jupiter in Leo creates a magnanimous, creative, and regal expression of wisdom. The native is a natural teacher, performer, or spiritual leader who inspires through presence and charisma. Children are gifted, proud, and often publicly successful. Dharma is expressed through creative contribution and the elevation of others through art, leadership, and generous mentorship.',
      hi: 'सिंह राशि में बृहस्पति ज्ञान की उदार, रचनात्मक और राजसी अभिव्यक्ति बनाता है। प्राकृतिक शिक्षक, कलाकार या आध्यात्मिक नेता जो उपस्थिति और करिश्मे से प्रेरित करते हैं। बच्चे प्रतिभाशाली, गर्वित और प्रायः सार्वजनिक रूप से सफल होते हैं।',
    },
    6: {
      en: 'Jupiter in Virgo directs wisdom into healing, service, and the refinement of practical systems. The native is a teacher in technical or health-related fields; dharma is expressed through meticulous service to others. Children are analytical and service-oriented. Expansion comes through improving the lives of others one detail at a time.',
      hi: 'कन्या राशि में बृहस्पति ज्ञान को चिकित्सा, सेवा और व्यावहारिक प्रणालियों के परिष्करण में निर्देशित करता है। तकनीकी या स्वास्थ्य-संबंधित क्षेत्रों में शिक्षक होते हैं। बच्चे विश्लेषणात्मक और सेवा-उन्मुख होते हैं।',
    },
    7: {
      en: 'Jupiter in Libra expresses wisdom through just partnerships, diplomacy, and the harmonisation of opposing views. The native is blessed with an outstanding spouse and through marriage gains wisdom and prosperity. Children bring balance and beauty. Dharma involves creating fair, equitable relationships and social structures that benefit all parties.',
      hi: 'तुला राशि में बृहस्पति न्यायपूर्ण साझेदारी, कूटनीति और विरोधी विचारों के सामंजस्य के माध्यम से ज्ञान व्यक्त करता है। विवाह के माध्यम से ज्ञान और समृद्धि प्राप्त होती है। बच्चे संतुलन और सौंदर्य लाते हैं।',
    },
    8: {
      en: 'Jupiter in Scorpio — debilitated — channels wisdom into the depths of transformation, psychology, and hidden knowledge. The native is a guide for others through crisis, death, and rebirth cycles. Children may be deeply spiritual or involved in healing. Dharma involves confronting what others fear; expansion comes from bringing light into darkness.',
      hi: 'वृश्चिक राशि में बृहस्पति नीचस्थ है — ज्ञान को रूपांतरण, मनोविज्ञान और छिपे ज्ञान की गहराइयों में चैनल करता है। संकट, मृत्यु और पुनर्जन्म चक्रों से गुजरने में दूसरों के लिए मार्गदर्शक होते हैं।',
    },
    9: {
      en: 'Jupiter in Sagittarius — its own sign — produces the most classically Jupiterian placement: wisdom, dharma, higher learning, and spiritual authority in their fullest expression. The native is a teacher of teachers, a beacon of philosophical and spiritual guidance. Children are learned, idealistic, and dharmic. International journeys and higher education are deeply blessed.',
      hi: 'धनु राशि में बृहस्पति — अपनी राशि में — सबसे शास्त्रीय बृहस्पतीय स्थान पैदा करता है: ज्ञान, धर्म, उच्च शिक्षा और आध्यात्मिक अधिकार अपनी पूर्णतम अभिव्यक्ति में। बच्चे विद्वान, आदर्शवादी और धार्मिक होते हैं।',
    },
    10: {
      en: 'Jupiter in Capricorn — debilitated — channels wisdom into practical achievement, institutional authority, and long-term strategy. Despite debilitation, the native often rises to positions of considerable administrative power. Children are ambitious, responsible, and career-focused. Dharma is expressed through sustained, disciplined contribution to societal structures.',
      hi: 'मकर राशि में बृहस्पति नीचस्थ है — ज्ञान को व्यावहारिक उपलब्धि, संस्थागत अधिकार और दीर्घकालिक रणनीति में चैनल करता है। बच्चे महत्वाकांक्षी, जिम्मेदार और करियर-केंद्रित होते हैं।',
    },
    11: {
      en: 'Jupiter in Aquarius expresses wisdom through social vision, collective upliftment, and humanitarian enterprise. The native is a teacher for communities and a visionary guide for group progress. Children are progressive, socially conscious, and independent. Dharma involves expanding the circle of inclusion and using wisdom to serve the many rather than the few.',
      hi: 'कुम्भ राशि में बृहस्पति सामाजिक दृष्टिकोण, सामूहिक उत्थान और मानवतावादी उद्यम के माध्यम से ज्ञान व्यक्त करता है। समुदायों के लिए शिक्षक और समूह प्रगति के लिए दूरदर्शी मार्गदर्शक होते हैं।',
    },
    12: {
      en: 'Jupiter in Pisces — own sign — creates a profoundly spiritual, compassionate, and mystical expression of wisdom. The native is a healer, saint, or spiritual guide whose dharma is the liberation of souls. Children are spiritually sensitive and deeply intuitive. Expansion comes through surrender, meditation, and selfless service — a soul on the moksha path.',
      hi: 'मीन राशि में बृहस्पति — अपनी राशि में — ज्ञान की गहरी आध्यात्मिक, करुणापूर्ण और रहस्यमय अभिव्यक्ति बनाता है। बच्चे आध्यात्मिक रूप से संवेदनशील और गहरे अंतर्ज्ञानी होते हैं। विस्तार समर्पण, ध्यान और निस्वार्थ सेवा के माध्यम से होता है।',
    },
  },

  // ─── 5: VENUS ──────────────────────────────────────────────────────────────
  5: {
    1: {
      en: 'Venus in Aries creates passionate, impulsive romantic energy and a love of action, competition, and self-expression. The native is attractive through confidence and vitality. Marriage may come suddenly or with a dynamic, independent partner. Vehicles are fast; artistic expression is bold and colourful. The challenge is sustaining long-term romantic patience.',
      hi: 'मेष राशि में शुक्र जोशीली, आवेगी रोमांटिक ऊर्जा और क्रिया, प्रतिस्पर्धा और आत्म-अभिव्यक्ति का प्रेम बनाता है। आत्मविश्वास और जीवंतता के माध्यम से आकर्षक होते हैं। विवाह अचानक हो सकता है या एक गतिशील, स्वतंत्र साथी के साथ।',
    },
    2: {
      en: 'Venus in Taurus — own sign — produces the most sensuous, materially abundant, and aesthetically refined expression of Venusian themes. Marriage is stable, loving, and materially comfortable. Vehicles are luxurious; artistic talent is genuine and enduring. The native accumulates wealth through beauty, art, luxury goods, or financial acumen.',
      hi: 'वृषभ राशि में शुक्र — अपनी राशि में — शुक्र विषयों की सबसे कामुक, भौतिक रूप से प्रचुर और सौंदर्यबोध से परिष्कृत अभिव्यक्ति पैदा करता है। विवाह स्थिर, प्रेमपूर्ण और भौतिक रूप से आरामदायक है। कलात्मक प्रतिभा वास्तविक और स्थायी है।',
    },
    3: {
      en: 'Venus in Gemini creates charm through wit, words, and intellectual versatility. Multiple romantic interests or artistic pursuits run in parallel. Marriage is with a communicative, youthful, or intellectually engaging partner. Writing, music, and voice arts are particular strengths. Vehicles serve communication; the native\'s social network is wide and stylish.',
      hi: 'मिथुन राशि में शुक्र चालाकी, शब्दों और बौद्धिक बहुमुखी प्रतिभा के माध्यम से आकर्षण बनाता है। कई रोमांटिक रुचियाँ या कलात्मक खोज समानांतर चलती हैं। संचारशील, युवा या बौद्धिक रूप से आकर्षक साथी के साथ विवाह होता है।',
    },
    4: {
      en: 'Venus in Cancer creates deep emotional attachment in love and a love for beautiful, nurturing homes. Marriage is centred on family, comfort, and emotional security. Artistic talent often runs in the family. Vehicles serve domestic life; the native creates harmonious, aesthetically beautiful living spaces. Love of mother and homeland is deeply felt.',
      hi: 'कर्क राशि में शुक्र प्रेम में गहरा भावनात्मक लगाव और सुंदर, पोषण करने वाले घरों का प्रेम बनाता है। विवाह परिवार, आराम और भावनात्मक सुरक्षा पर केंद्रित है। कलात्मक प्रतिभा प्रायः परिवार में होती है। माँ और मातृभूमि का गहरा प्रेम महसूस होता है।',
    },
    5: {
      en: 'Venus in Leo creates a glamorous, theatrical, and generous expression of love and beauty. The native is powerfully attractive and drawn to romance, luxury, and creative performance. Marriage is with a proud, charming partner. Vehicles and jewellery are expressions of status. Artistic expression is dramatic and captivating; love affairs are passionate and memorable.',
      hi: 'सिंह राशि में शुक्र प्रेम और सौंदर्य की चमकदार, नाटकीय और उदार अभिव्यक्ति बनाता है। शक्तिशाली रूप से आकर्षक और रोमांस, विलासिता और रचनात्मक प्रदर्शन की ओर आकर्षित होते हैं।',
    },
    6: {
      en: 'Venus in Virgo — debilitated — creates refined aesthetic sensibility focused on practical beauty, health, and service. Love is expressed through acts of service rather than grand gestures. Marriage may come late or with a partner in health or technical fields. Artistic talent is precise and detailed — craft over inspiration. Love requires learning to receive, not just give.',
      hi: 'कन्या राशि में शुक्र नीचस्थ है — व्यावहारिक सौंदर्य, स्वास्थ्य और सेवा पर केंद्रित परिष्कृत सौंदर्य संवेदनशीलता बनाता है। प्रेम बड़े इशारों के बजाय सेवा के कार्यों के माध्यम से व्यक्त होता है। प्रेम में प्राप्त करना सीखना आवश्यक है।',
    },
    7: {
      en: 'Venus in Libra — own sign — produces the most harmonious, beautiful, and relationally gifted expression of Venusian energy. Marriage is a central life blessing; the partner is charming, refined, and artistic. Vehicles are beautiful and stylish. Career in the arts, diplomacy, law, or luxury industries brings great success. Life is enriched by beauty, balance, and enduring love.',
      hi: 'तुला राशि में शुक्र — अपनी राशि में — शुक्र ऊर्जा की सबसे सामंजस्यपूर्ण, सुंदर और संबंध में प्रतिभाशाली अभिव्यक्ति पैदा करता है। विवाह एक केंद्रीय जीवन आशीर्वाद है। कला, कूटनीति, कानून या विलासिता उद्योगों में करियर महान सफलता लाता है।',
    },
    8: {
      en: 'Venus in Scorpio creates intense, transformative, and deeply bonded romantic experiences. Love is all-or-nothing; the native experiences the heights and depths of intimate connection. Marriage may involve crisis and renewal. Artistic talent is dark, mysterious, and captivating. Vehicles may be acquired through inheritance or partnerships. Love transforms the soul.',
      hi: 'वृश्चिक राशि में शुक्र तीव्र, रूपांतरित करने वाले और गहरे बंधन वाले रोमांटिक अनुभव बनाता है। प्रेम सब-या-कुछ नहीं होता है। विवाह में संकट और नवीकरण शामिल हो सकते हैं। प्रेम आत्मा को रूपांतरित करता है।',
    },
    9: {
      en: 'Venus in Sagittarius expresses love through adventure, philosophy, and the sharing of wisdom. The partner is from a different culture, background, or ideological tradition. Marriage involves travel, learning, and mutual expansion. Artistic expression is large-scale and inspiring. Vehicles serve journeys; the native\'s love life is an ongoing voyage of discovery.',
      hi: 'धनु राशि में शुक्र साहस, दर्शन और ज्ञान के साझाकरण के माध्यम से प्रेम व्यक्त करता है। साथी अलग संस्कृति, पृष्ठभूमि या वैचारिक परंपरा से होता है। विवाह में यात्रा, सीखना और पारस्परिक विस्तार शामिल होता है।',
    },
    10: {
      en: 'Venus in Capricorn creates a disciplined, status-conscious, and enduring approach to love and beauty. Marriage is taken seriously — a lifelong commitment built on mutual respect and practical partnership. Artistic talent is applied with diligence and commercial focus. Vehicles are status symbols; luxury comes through hard work. Love endures the test of time.',
      hi: 'मकर राशि में शुक्र प्रेम और सौंदर्य के प्रति अनुशासित, स्थिति-सचेत और टिकाऊ दृष्टिकोण बनाता है। विवाह को गंभीरता से लिया जाता है। कलात्मक प्रतिभा परिश्रम और व्यावसायिक ध्यान के साथ लागू होती है।',
    },
    11: {
      en: 'Venus in Aquarius creates an unconventional, socially expansive, and friendship-centred approach to love. The partner is unusual, progressive, or a longtime friend. Marriage may defy convention. Artistic expression is innovative and technologically enabled. Vehicles serve community; the native\'s love is wide — given to many rather than one.',
      hi: 'कुम्भ राशि में शुक्र प्रेम के प्रति अपरंपरागत, सामाजिक रूप से विस्तृत और मित्रता-केंद्रित दृष्टिकोण बनाता है। साथी असामान्य, प्रगतिशील या पुराना मित्र होता है। विवाह परंपरा को चुनौती दे सकता है। कलात्मक अभिव्यक्ति नवाचारी है।',
    },
    12: {
      en: 'Venus in Pisces — exalted — produces the most spiritually refined, compassionate, and unconditionally loving expression of Venusian grace. The native loves with a selfless, oceanic quality. Marriage may be with a spiritually evolved or artistically exceptional partner. Artistic gifts are ethereal and deeply moving. Vehicles serve pilgrimage; love is the path to liberation.',
      hi: 'मीन राशि में शुक्र — उच्च स्थान में — शुक्र कृपा की सबसे आध्यात्मिक रूप से परिष्कृत, करुणापूर्ण और बिना शर्त प्यार करने वाली अभिव्यक्ति पैदा करता है। साथी आध्यात्मिक रूप से विकसित या कलात्मक रूप से असाधारण हो सकता है।',
    },
  },

  // ─── 6: SATURN ─────────────────────────────────────────────────────────────
  6: {
    1: {
      en: 'Saturn in Aries creates tension between the planet of discipline and the sign of impulsive initiative. Delays and obstacles arise at career beginnings, but the native develops exceptional resilience. Service roles, construction, or long-term technical projects reward patience. Longevity and stamina are eventual gifts; early setbacks build the character that later achievements rest upon.',
      hi: 'मेष राशि में शनि अनुशासन के ग्रह और आवेगी पहल के राशि के बीच तनाव बनाता है। करियर शुरुआत में देरी और बाधाएँ आती हैं, लेकिन असाधारण लचीलापन विकसित होता है। शुरुआती असफलताएँ बाद की उपलब्धियों का आधार बनने वाला चरित्र बनाती हैं।',
    },
    2: {
      en: 'Saturn in Taurus creates slow, steady, and ultimately substantial wealth accumulation. Financial discipline is a life lesson; abundance comes in the second half of life through patient effort. Service in industries related to agriculture, mining, construction, or traditional crafts is favoured. The native values what is earned and guards it carefully.',
      hi: 'वृषभ राशि में शनि धीमा, स्थिर और अंततः पर्याप्त धन संचय बनाता है। वित्तीय अनुशासन एक जीवन पाठ है। धैर्यपूर्ण प्रयास के माध्यम से जीवन की दूसरी छमाही में प्रचुरता आती है।',
    },
    3: {
      en: 'Saturn in Gemini creates a deliberate, structured communicator and a mind that excels at technical writing, system design, or long-term planning. Siblings may be few, distant, or require service. Communication matures beautifully with age. Business in publishing, technical documentation, or information systems rewards the native\'s patience and precision.',
      hi: 'मिथुन राशि में शनि एक जानबूझकर, संरचित संवादक बनाता है और एक मन जो तकनीकी लेखन, सिस्टम डिजाइन या दीर्घकालिक योजना में उत्कृष्ट होता है। भाई-बहन कम, दूर या सेवा की आवश्यकता वाले हो सकते हैं।',
    },
    4: {
      en: 'Saturn in Cancer creates tension in emotional life and delayed homemaking. The early home environment may be restrictive or emotionally cold. The native works diligently to build a secure, stable home in later years. Real estate acquired through persistent effort becomes a lasting legacy. Emotional maturity and groundedness develop over decades.',
      hi: 'कर्क राशि में शनि भावनात्मक जीवन में तनाव और विलंबित गृहनिर्माण बनाता है। प्रारंभिक घरेलू वातावरण प्रतिबंधात्मक या भावनात्मक रूप से ठंडा हो सकता है। बाद के वर्षों में एक सुरक्षित, स्थिर घर बनाने के लिए परिश्रम से काम किया जाता है।',
    },
    5: {
      en: 'Saturn in Leo creates tension between the need for recognition and the discipline of restraint. Children may come late or require extra care. Creativity matures with age — the native\'s best work appears in the second half of life. Leadership comes through demonstrated discipline and sustained excellence rather than natural charisma.',
      hi: 'सिंह राशि में शनि मान्यता की जरूरत और संयम के अनुशासन के बीच तनाव बनाता है। बच्चे देर से आ सकते हैं या अतिरिक्त देखभाल की आवश्यकता हो सकती है। रचनात्मकता उम्र के साथ परिपक्व होती है।',
    },
    6: {
      en: 'Saturn in Virgo — its most productive placement in service — creates mastery in technical fields, health administration, and detailed professional service. The native excels in medicine, engineering, law, or government work through meticulous discipline. Service careers bring long-term recognition. Enemies are defeated through patient, methodical counter-strategies.',
      hi: 'कन्या राशि में शनि — सेवा में सबसे उत्पादक स्थान — तकनीकी क्षेत्रों, स्वास्थ्य प्रशासन और विस्तृत पेशेवर सेवा में निपुणता बनाता है। चिकित्सा, इंजीनियरिंग, कानून या सरकारी कार्य में सूक्ष्म अनुशासन के माध्यम से उत्कृष्टता होती है।',
    },
    7: {
      en: 'Saturn in Libra — exalted — produces the most just, balanced, and enduring expression of Saturnian wisdom. Marriage comes late but is built on deep mutual respect and shared dharma. Partnerships in law, government, or social reform bring great achievement. The native\'s reputation for fairness and impartiality becomes a life asset.',
      hi: 'तुला राशि में शनि — उच्च स्थान में — शनि ज्ञान की सबसे न्यायपूर्ण, संतुलित और स्थायी अभिव्यक्ति पैदा करता है। विवाह देर से होता है लेकिन गहरे पारस्परिक सम्मान और साझा धर्म पर बना है। निष्पक्षता और निष्पक्षता की प्रतिष्ठा एक जीवन संपत्ति बन जाती है।',
    },
    8: {
      en: 'Saturn in Scorpio creates a slow, disciplined confrontation with the themes of transformation, inheritance, and hidden power. Longevity is indicated; chronic conditions if any tend to be manageable over time. Careers in research, insurance, taxation, occult sciences, or crisis management are favoured. The native masters the art of survival and regeneration.',
      hi: 'वृश्चिक राशि में शनि रूपांतरण, विरासत और छिपी शक्ति के विषयों के साथ धीमा, अनुशासित टकराव बनाता है। दीर्घायु का संकेत है। अनुसंधान, बीमा, कराधान, गूढ़ विज्ञान या संकट प्रबंधन में करियर अनुकूल है।',
    },
    9: {
      en: 'Saturn in Sagittarius creates a serious, structured approach to philosophy, religion, and higher learning. The native earns spiritual wisdom through study and discipline rather than intuition. Teaching, law, or religious administration are favoured careers. Dharma becomes a lifelong study. Long journeys are slow but transformative; the native\'s philosophy is earned, not inherited.',
      hi: 'धनु राशि में शनि दर्शन, धर्म और उच्च शिक्षा के प्रति गंभीर, संरचित दृष्टिकोण बनाता है। अध्ययन और अनुशासन के माध्यम से आध्यात्मिक ज्ञान अर्जित किया जाता है। शिक्षण, कानून या धार्मिक प्रशासन अनुकूल करियर हैं।',
    },
    10: {
      en: 'Saturn in Capricorn — its own sign — produces the native best suited for worldly mastery through sustained effort, institutional authority, and professional discipline. Rise to the top is slow but irresistible. Government, corporate leadership, engineering, and administrative roles bring great distinction. Longevity and late-blooming success are the defining gifts.',
      hi: 'मकर राशि में शनि — अपनी राशि में — निरंतर प्रयास, संस्थागत अधिकार और पेशेवर अनुशासन के माध्यम से सांसारिक महारत के लिए सबसे उपयुक्त व्यक्ति पैदा करता है। शीर्ष पर पहुँचना धीमा लेकिन अप्रतिरोध्य है।',
    },
    11: {
      en: 'Saturn in Aquarius — its own sign — channels disciplined Saturnian energy into collective benefit, systemic reform, and social engineering. The native builds lasting institutions, community organisations, or technological systems that serve the many. Friendships are few but loyal. The life purpose involves improving collective structures through patient, methodical work.',
      hi: 'कुम्भ राशि में शनि — अपनी राशि में — अनुशासित शनि ऊर्जा को सामूहिक लाभ, प्रणालीगत सुधार और सामाजिक इंजीनियरिंग में चैनल करता है। स्थायी संस्थाएँ, सामुदायिक संगठन या तकनीकी प्रणालियाँ बनाई जाती हैं। मित्रताएँ कम लेकिन वफादार होती हैं।',
    },
    12: {
      en: 'Saturn in Pisces creates a lifetime of spiritual discipline, solitary practice, and service rendered quietly and without recognition. The native may work in hospitals, prisons, monasteries, or remote locations. Foreign residency or work in isolated places is possible. Deep karmic debts are repaid here; liberation through sustained self-discipline and compassionate service is the ultimate reward.',
      hi: 'मीन राशि में शनि आध्यात्मिक अनुशासन, एकांत अभ्यास और चुपचाप और बिना मान्यता के की गई सेवा का जीवनकाल बनाता है। अस्पतालों, जेलों, मठों या दूरदराज के स्थानों में काम संभव है। गहरे कार्मिक ऋण यहाँ चुकाए जाते हैं।',
    },
  },

  // ─── 7: RAHU ───────────────────────────────────────────────────────────────
  7: {
    1: {
      en: 'Rahu in Aries intensifies ambition, courage, and the obsessive drive for individual achievement. The native is a trailblazer in unconventional fields — technology, science, or avant-garde leadership. Foreign influences shape the career and identity. The ego expands dramatically but may lose touch with authentic self. The karmic lesson is to channel ambition into purposeful action rather than restless accumulation of experiences.',
      hi: 'मेष राशि में राहु महत्वाकांक्षा, साहस और व्यक्तिगत उपलब्धि के लिए जुनूनी प्रेरणा को तीव्र करता है। प्रौद्योगिकी, विज्ञान या मोहरे नेतृत्व में एक अग्रणी होते हैं। विदेशी प्रभाव करियर और पहचान को आकार देते हैं। कार्मिक पाठ महत्वाकांक्षा को उद्देश्यपूर्ण क्रिया में चैनल करना है।',
    },
    2: {
      en: 'Rahu in Taurus creates an insatiable appetite for wealth, luxury, and material comfort. Financial gains can be sudden and unconventional — through technology, trading, or foreign commerce. Family wealth is amplified but also complicated by illusions. The karmic lesson involves developing genuine contentment alongside material acquisition — learning that abundance is a state of being, not accumulation.',
      hi: 'वृषभ राशि में राहु धन, विलासिता और भौतिक आराम के लिए अतृप्त भूख बनाता है। वित्तीय लाभ अचानक और अपरंपरागत हो सकते हैं। कार्मिक पाठ भौतिक अधिग्रहण के साथ-साथ वास्तविक संतुष्टि विकसित करना है।',
    },
    3: {
      en: 'Rahu in Gemini amplifies communicative gifts, intellectual versatility, and an obsessive curiosity. The native excels in media, technology, foreign languages, or multi-platform businesses. Siblings may be unconventional or foreign. The mind is restless and brilliant; the karmic lesson is learning depth over breadth — to go deeply into fewer things rather than skimming many.',
      hi: 'मिथुन राशि में राहु संचार उपहार, बौद्धिक बहुमुखी प्रतिभा और जुनूनी जिज्ञासा को बढ़ाता है। मीडिया, प्रौद्योगिकी, विदेशी भाषाओं या बहु-मंच व्यवसायों में उत्कृष्टता होती है। कार्मिक पाठ विस्तार के बजाय गहराई सीखना है।',
    },
    4: {
      en: 'Rahu in Cancer creates an intense, often obsessive connection to home, mother, and emotional security — yet the native may find domestic life unsettled or foreign. Real estate in foreign lands is possible. The mother may be unconventional or a foreign national. The karmic lesson involves finding inner emotional security independent of external circumstances or ancestral attachments.',
      hi: 'कर्क राशि में राहु घर, माँ और भावनात्मक सुरक्षा से गहरा, अक्सर जुनूनी संबंध बनाता है। विदेशी भूमि में रियल एस्टेट संभव है। माँ अपरंपरागत या विदेशी हो सकती हैं। कार्मिक पाठ आंतरिक भावनात्मक सुरक्षा खोजना है।',
    },
    5: {
      en: 'Rahu in Leo amplifies creative expression, desire for fame, and connection to powerful or unconventional figures. The native is drawn to speculative investments, entertainment, and political influence. Children may have unusual or remarkable destinies. The karmic lesson is to move from seeking recognition to serving through authentic creative expression — from performance to purpose.',
      hi: 'सिंह राशि में राहु रचनात्मक अभिव्यक्ति, प्रसिद्धि की इच्छा और शक्तिशाली या अपरंपरागत व्यक्तित्वों से संबंध को बढ़ाता है। सट्टेबाजी के निवेश, मनोरंजन और राजनीतिक प्रभाव की ओर आकर्षण होता है।',
    },
    6: {
      en: 'Rahu in Virgo creates an obsessive focus on work, health, and service excellence. The native may be drawn to unconventional medicine, foreign service professions, or analytical work that defies conventional categories. Enemies are numerous but defeated. The karmic lesson involves transcending perfectionism and the illusion that being needed equals being loved.',
      hi: 'कन्या राशि में राहु काम, स्वास्थ्य और सेवा उत्कृष्टता पर जुनूनी ध्यान केंद्रित करता है। अपरंपरागत चिकित्सा, विदेशी सेवा व्यवसायों या विश्लेषणात्मक कार्य की ओर आकर्षण हो सकता है। कार्मिक पाठ पूर्णतावाद को पार करना है।',
    },
    7: {
      en: 'Rahu in Libra creates an obsessive pull toward partnership, fame through relationships, and attraction to foreign or unconventional spouses. Legal and diplomatic careers attract Rahu\'s amplifying power. The karmic lesson involves learning that authentic relationship requires true self-knowledge — the self cannot be defined through another person\'s mirror alone.',
      hi: 'तुला राशि में राहु साझेदारी की ओर जुनूनी खिंचाव, संबंधों के माध्यम से प्रसिद्धि और विदेशी या अपरंपरागत जीवनसाथी के प्रति आकर्षण बनाता है। कार्मिक पाठ यह सीखना है कि प्रामाणिक संबंध के लिए वास्तविक आत्म-ज्ञान की आवश्यकता है।',
    },
    8: {
      en: 'Rahu in Scorpio intensifies investigation of the taboo, the occult, and the transformative powers of life and death. The native is drawn to deep psychology, hidden wealth, occult sciences, and crisis-driven environments. Sudden gains through inheritance or speculation are possible. The karmic lesson is to use penetrating insight for healing and liberation, not manipulation or obsession.',
      hi: 'वृश्चिक राशि में राहु वर्जित, गूढ़ और जीवन और मृत्यु की परिवर्तनकारी शक्तियों की जांच को तीव्र करता है। गहरे मनोविज्ञान, छिपी संपदा और संकट-संचालित वातावरण की ओर आकर्षण होता है।',
    },
    9: {
      en: 'Rahu in Sagittarius amplifies the pursuit of philosophy, foreign travel, and unconventional spirituality. The native may become a teacher, guru figure, or spiritual influencer through non-traditional paths. Long-distance journeys alter the life course dramatically. The karmic lesson is to distinguish genuine spiritual wisdom from the illusion of spiritual identity or the performance of philosophy.',
      hi: 'धनु राशि में राहु दर्शन, विदेश यात्रा और अपरंपरागत आध्यात्मिकता की खोज को बढ़ाता है। गैर-पारंपरिक मार्गों के माध्यम से शिक्षक, गुरु या आध्यात्मिक प्रभावशाली बन सकते हैं। कार्मिक पाठ वास्तविक आध्यात्मिक ज्ञान को आध्यात्मिक पहचान के भ्रम से अलग करना है।',
    },
    10: {
      en: 'Rahu in Capricorn intensifies career ambition, organisational power, and the drive to reach institutional heights through unconventional means. The native may rise suddenly in politics, technology corporations, or international organisations. The karmic lesson is to build something that serves beyond personal legacy — to use institutional power for collective good rather than personal empire-building.',
      hi: 'मकर राशि में राहु करियर महत्वाकांक्षा, संगठनात्मक शक्ति और अपरंपरागत साधनों के माध्यम से संस्थागत ऊँचाइयों तक पहुँचने की प्रेरणा को तीव्र करता है। राजनीति, प्रौद्योगिकी कॉर्पोरेशन या अंतर्राष्ट्रीय संगठनों में अचानक वृद्धि हो सकती है।',
    },
    11: {
      en: 'Rahu in Aquarius creates an obsessive attraction to social networks, technology, and the influence that comes from connecting communities. The native is a networker, innovator, or social media amplifier who gains through groups and collective movements. The karmic lesson is to build genuine community rather than merely accumulating contacts — depth of connection over breadth of reach.',
      hi: 'कुम्भ राशि में राहु सामाजिक नेटवर्क, प्रौद्योगिकी और समुदायों को जोड़ने से आने वाले प्रभाव के प्रति जुनूनी आकर्षण बनाता है। कार्मिक पाठ केवल संपर्क जमा करने के बजाय वास्तविक समुदाय बनाना है।',
    },
    12: {
      en: 'Rahu in Pisces creates an intense fascination with spirituality, foreign mysticism, dream states, and hidden realms. The native may become a powerful spiritual seeker, healer, or artist working in the space between the seen and unseen. Foreign spiritual traditions exert a powerful pull. The karmic lesson is to discern genuine spiritual insight from spiritual escapism or the glamour of the mystical.',
      hi: 'मीन राशि में राहु आध्यात्मिकता, विदेशी रहस्यवाद, स्वप्न अवस्थाओं और छिपे क्षेत्रों के प्रति तीव्र आकर्षण बनाता है। विदेशी आध्यात्मिक परंपराएँ शक्तिशाली खिंचाव डालती हैं। कार्मिक पाठ वास्तविक आध्यात्मिक अंतर्दृष्टि को आध्यात्मिक पलायनवाद से अलग करना है।',
    },
  },

  // ─── 8: KETU ───────────────────────────────────────────────────────────────
  8: {
    1: {
      en: 'Ketu in Aries indicates past-life mastery of courage, independent action, and pioneering initiative. In this life, the drive for individual heroism feels somehow familiar — almost automatic — and thus less satisfying. The soul seeks liberation through surrender of the ego-driven self. Moksha comes through channelling Aries energy toward spiritual practice rather than personal conquest.',
      hi: 'मेष राशि में केतु साहस, स्वतंत्र क्रिया और अग्रणी पहल की पूर्व जीवन महारत दर्शाता है। इस जीवन में, व्यक्तिगत वीरता की प्रेरणा परिचित लगती है। आत्मा अहंकार-चालित स्व के समर्पण के माध्यम से मुक्ति चाहती है।',
    },
    2: {
      en: 'Ketu in Taurus indicates past-life accumulation of wealth and material mastery. In this life, material possessions and financial security feel incomplete as sources of fulfilment. Detachment from wealth creates the paradox of greater financial flow. The soul seeks liberation through non-attachment to material outcomes while living in the world fully.',
      hi: 'वृषभ राशि में केतु धन और भौतिक महारत के पूर्व जीवन संचय को दर्शाता है। इस जीवन में, भौतिक संपत्ति और वित्तीय सुरक्षा पूर्णता के स्रोत के रूप में अधूरी लगती है। भौतिक परिणामों से अनासक्ति के माध्यम से मुक्ति।',
    },
    3: {
      en: 'Ketu in Gemini indicates past-life development of intellectual skills, communication, and business acumen. In this life, communication comes naturally but does not deeply satisfy. Siblings or short journeys may be sources of confusion or detachment. The soul finds liberation through moving from information to wisdom — from knowing many things to knowing one truth deeply.',
      hi: 'मिथुन राशि में केतु बौद्धिक कौशल, संचार और व्यावसायिक कुशाग्रता के पूर्व जीवन विकास को दर्शाता है। इस जीवन में, संचार स्वाभाविक है लेकिन गहराई से संतुष्ट नहीं करता। जानकारी से ज्ञान की ओर बढ़ने से मुक्ति।',
    },
    4: {
      en: 'Ketu in Cancer indicates deep past-life roots in domestic life, emotional bonding, and nurturing. In this life, the native feels a mysterious distance from home and family despite surface connection. The mother relationship carries karmic weight. Liberation comes through releasing clinging to the past and ancestral patterns — finding the inner home that no exterior house can provide.',
      hi: 'कर्क राशि में केतु घरेलू जीवन, भावनात्मक बंधन और पोषण में गहरी पूर्व जीवन जड़ों को दर्शाता है। इस जीवन में, घर और परिवार से एक रहस्यमय दूरी महसूस होती है। अतीत और पैतृक पैटर्न से चिपकने को छोड़ने से मुक्ति।',
    },
    5: {
      en: 'Ketu in Leo indicates past-life royal authority, creative expression, and recognition. In this life, the need for fame and recognition feels hollow or unsatisfying. Children may have complex destinies. Creative gifts exist but require surrender of ego to fully flower. Liberation comes through creating for the joy of creation rather than the recognition it brings.',
      hi: 'सिंह राशि में केतु पूर्व जीवन शाही अधिकार, रचनात्मक अभिव्यक्ति और मान्यता को दर्शाता है। इस जीवन में, प्रसिद्धि और मान्यता की जरूरत खोखली लगती है। मान्यता के बजाय सृजन के आनंद के लिए बनाने से मुक्ति।',
    },
    6: {
      en: 'Ketu in Virgo indicates past-life mastery of service, analysis, and health. In this life, work and service may feel mechanical or insufficiently meaningful despite technical competence. Enemies dissolve without effort. Liberation comes through moving from service as duty to service as devotion — offering work as a spiritual act rather than a performance of competence.',
      hi: 'कन्या राशि में केतु सेवा, विश्लेषण और स्वास्थ्य की पूर्व जीवन महारत को दर्शाता है। इस जीवन में, काम और सेवा यांत्रिक लग सकती है। शत्रु प्रयास के बिना दूर हो जाते हैं। सेवा को कर्तव्य से भक्ति की ओर ले जाने से मुक्ति।',
    },
    7: {
      en: 'Ketu in Libra indicates past-life expertise in partnership, diplomacy, and aesthetic refinement. In this life, relationships may feel destined but somehow unsatisfying or incomplete. Marriage carries karmic themes. Liberation comes through moving from needing relationships for completion to offering love from wholeness — learning that true partnership begins with a complete self.',
      hi: 'तुला राशि में केतु साझेदारी, कूटनीति और सौंदर्य परिष्करण में पूर्व जीवन विशेषज्ञता दर्शाता है। इस जीवन में, संबंध नियत लेकिन किसी तरह असंतोषजनक लग सकते हैं। पूर्ण स्व से प्रेम देने से मुक्ति।',
    },
    8: {
      en: 'Ketu in Scorpio — its own sign — creates the deepest spiritual potential in the chart. Past-life mastery of occult sciences, crisis navigation, and psychological depth is indicated. In this life, Ketu gives natural facility with transformation and moksha but can also cause sudden losses in eighth-house matters. Liberation comes through using this depth for others\' healing rather than personal power.',
      hi: 'वृश्चिक राशि में केतु — अपनी राशि में — कुण्डली में सबसे गहरी आध्यात्मिक संभावना बनाता है। गूढ़ विज्ञान, संकट नेविगेशन और मनोवैज्ञानिक गहराई की पूर्व जीवन महारत। इस गहराई को दूसरों के उपचार के लिए उपयोग करने से मुक्ति।',
    },
    9: {
      en: 'Ketu in Sagittarius indicates past-life mastery of religious philosophy, dharma, and higher learning. In this life, traditional religion or philosophical frameworks may feel hollow or limiting. The native seeks spiritual truth beyond institutional forms. Liberation comes through discovering direct, experiential spiritual knowledge — beyond scripture to living the dharma in every moment.',
      hi: 'धनु राशि में केतु धार्मिक दर्शन, धर्म और उच्च शिक्षा की पूर्व जीवन महारत दर्शाता है। इस जीवन में, पारंपरिक धर्म या दार्शनिक ढाँचे खोखले लग सकते हैं। प्रत्यक्ष, अनुभवात्मक आध्यात्मिक ज्ञान की खोज से मुक्ति।',
    },
    10: {
      en: 'Ketu in Capricorn indicates past-life development of institutional authority, administrative mastery, and worldly achievement. In this life, career success comes easily but feels strangely unsatisfying. The soul is ready to move beyond personal ambition toward a larger purpose. Liberation comes through using professional mastery in service of a higher calling rather than personal career advancement.',
      hi: 'मकर राशि में केतु संस्थागत अधिकार, प्रशासनिक महारत और सांसारिक उपलब्धि के पूर्व जीवन विकास को दर्शाता है। इस जीवन में, करियर की सफलता आसानी से मिलती है लेकिन अजीब तरह से असंतोषजनक लगती है। व्यक्तिगत करियर उन्नति के बजाय उच्च बुलावे की सेवा में पेशेवर महारत का उपयोग करने से मुक्ति।',
    },
    11: {
      en: 'Ketu in Aquarius indicates past-life immersion in collective social structures, community organisations, and progressive movements. In this life, group affiliations and social networks feel somehow limiting or empty. Old friendships dissolve. Liberation comes through discovering the universal in the particular — transcending tribal belonging to touch the unity beneath all social distinctions.',
      hi: 'कुम्भ राशि में केतु सामूहिक सामाजिक संरचनाओं, सामुदायिक संगठनों और प्रगतिशील आंदोलनों में पूर्व जीवन विसर्जन दर्शाता है। इस जीवन में, समूह संबद्धताएँ और सामाजिक नेटवर्क किसी तरह सीमित लग सकते हैं। सभी सामाजिक भेदों के नीचे एकता को छूने से मुक्ति।',
    },
    12: {
      en: 'Ketu in Pisces — its other own sign — creates a soul steeped in spiritual dissolution, self-sacrifice, and universal compassion from past lives. In this life, the boundary between self and cosmos is naturally thin. Mystical gifts are innate but need grounding. Liberation comes through learning to be spiritually present in the material world — to be in the world without being lost in it.',
      hi: 'मीन राशि में केतु — इसकी दूसरी अपनी राशि में — पूर्व जनमों से आध्यात्मिक विसर्जन, आत्म-बलिदान और सार्वभौमिक करुणा में डूबी आत्मा बनाता है। रहस्यमय उपहार जन्मजात हैं लेकिन आधार की आवश्यकता है। भौतिक दुनिया में आध्यात्मिक रूप से उपस्थित रहने से मुक्ति।',
    },
  },
};

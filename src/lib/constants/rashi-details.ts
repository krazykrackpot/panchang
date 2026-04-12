/**
 * Rich astrological content for all 12 Rashis (Zodiac Signs)
 * Used on rashi detail pages for personality, career, health, relationships, FAQs, etc.
 */

type MultilingualText = Record<string, string>;

export interface RashiDetail {
  id: number;
  personality: MultilingualText;
  career: MultilingualText;
  health: MultilingualText;
  relationships: MultilingualText;
  strengths: MultilingualText;
  challenges: MultilingualText;
  luckyNumbers: number[];
  luckyColors: MultilingualText;
  luckyGems: MultilingualText;
  compatibleRashis: number[];
  faqs: Array<{ question: MultilingualText; answer: MultilingualText }>;
}

export const RASHI_DETAILS: RashiDetail[] = [
  // ─── 1. MESH (Aries) ────────────────────────────────────────────
  {
    id: 1,
    personality: {
      en: 'Aries, the first sign of the zodiac, is ruled by Mars — the planet of energy, aggression, and courage. As a cardinal fire sign, Aries natives are natural initiators who charge headfirst into new ventures with unshakeable confidence. The ram symbolizes their headstrong nature: once an Aries sets a goal, they pursue it with relentless determination, often preferring action over deliberation. Mars bestows upon them a fiery temperament, sharp reflexes, and a competitive spirit that thrives in challenging environments. They possess an innate leadership quality that draws others to follow their bold vision. Aries individuals are remarkably direct in communication — they say what they mean without diplomatic cushioning, which can be refreshing or abrasive depending on the listener. Their enthusiasm is infectious; they can rally entire teams with sheer force of will. However, their impulsive nature means they sometimes leap before looking, starting many projects but finishing fewer. The cardinal modality gives them exceptional ability to launch initiatives, but they may lose interest once the initial excitement fades. At their best, Aries natives are fearless pioneers who open paths others are afraid to tread. Their childlike wonder and perpetual optimism make them eternally youthful in spirit, always ready for the next adventure.',
      hi: 'मेष राशि, राशिचक्र की पहली राशि, मंगल ग्रह द्वारा शासित है — जो ऊर्जा, साहस और पराक्रम का ग्रह है। चर अग्नि राशि होने के कारण मेष के जातक स्वाभाविक नेता होते हैं जो अडिग आत्मविश्वास के साथ नए कार्यों में कूद पड़ते हैं। मेष (राम) उनके हठी स्वभाव का प्रतीक है — एक बार लक्ष्य तय करने के बाद वे अथक दृढ़ता से उसका पीछा करते हैं। मंगल उन्हें उग्र स्वभाव, तीव्र प्रतिक्रिया और प्रतिस्पर्धी भावना प्रदान करता है। ये जातक संवाद में बेहद स्पष्ट होते हैं और बिना लाग-लपेट के अपनी बात कहते हैं। उनका उत्साह संक्रामक होता है — वे केवल अपनी इच्छाशक्ति से पूरी टीम को प्रेरित कर सकते हैं। हालाँकि, आवेगी स्वभाव के कारण वे कभी-कभी बिना सोचे-समझे कदम उठा लेते हैं। अपने सर्वश्रेष्ठ रूप में, मेष जातक निडर अग्रदूत होते हैं जो उन रास्तों को खोलते हैं जिन पर चलने से अन्य डरते हैं।'
    },
    career: {
      en: 'Mars-ruled Aries excels in careers demanding quick decision-making, physical courage, and competitive drive. They thrive as military officers, surgeons, firefighters, athletes, and entrepreneurs. Their natural leadership makes them effective executives and project managers who can mobilize teams under pressure. Engineering, especially mechanical and civil, appeals to their hands-on problem-solving nature. Aries natives often pioneer new industries or startups, as they possess the boldness to take risks others avoid. They perform poorly in bureaucratic roles requiring patience and repetitive tasks — they need dynamic environments with clear challenges to conquer. Sales, emergency medicine, and law enforcement also suit their action-oriented disposition.',
      hi: 'मंगल-शासित मेष राशि के जातक त्वरित निर्णय, शारीरिक साहस और प्रतिस्पर्धा वाले करियर में उत्कृष्ट प्रदर्शन करते हैं। सेना, शल्य चिकित्सा, अग्निशमन, खेल और उद्यमिता में ये सफल होते हैं। उनके नेतृत्व गुण उन्हें प्रभावी अधिकारी बनाते हैं। इंजीनियरिंग और नए स्टार्टअप शुरू करना भी इनके अनुकूल है। नौकरशाही और दोहराव वाले कार्यों में ये ऊब जाते हैं — इन्हें गतिशील वातावरण चाहिए।'
    },
    health: {
      en: 'Aries rules the head and face, making natives prone to headaches, migraines, sinus issues, and facial injuries. Their impulsive nature increases risk of accidents, particularly head trauma. Mars influence can manifest as fevers, inflammation, and high blood pressure. Aries individuals tend to push through illness rather than rest, which can worsen conditions. They benefit from vigorous exercise to channel their abundant energy, but must guard against overexertion. Dental problems and eye strain are also common. A regular practice of cooling pranayama and meditation helps balance their fiery constitution. They should protect their head during physical activities and avoid skipping meals, as their fast metabolism demands regular nourishment.',
      hi: 'मेष राशि सिर और चेहरे पर शासन करती है, जिससे जातकों को सिरदर्द, माइग्रेन, साइनस और चेहरे की चोटों की संभावना रहती है। मंगल के प्रभाव से बुखार, सूजन और उच्च रक्तचाप हो सकता है। ये जातक बीमारी में भी आराम नहीं करते जो स्थिति बिगाड़ सकता है। व्यायाम से ऊर्जा को सही दिशा मिलती है, लेकिन अत्यधिक परिश्रम से बचना चाहिए। शीतली प्राणायाम और ध्यान उनके अग्नि स्वभाव को संतुलित करता है।'
    },
    relationships: {
      en: 'In relationships, Aries is passionate, direct, and fiercely loyal — but demands equal intensity from their partner. They fall in love quickly and pursue their interest with unmistakable enthusiasm. Fire-air combinations work best: fellow fire signs (Leo, Sagittarius) match their energy, while air signs (Gemini, Aquarius) provide intellectual stimulation that keeps Aries engaged. They struggle with overly emotional or clingy partners, needing space to maintain their independence. Aries natives are generous and protective but can be dominating. Arguments are intense but short-lived — they rarely hold grudges. Their ideal partner is someone who can stand their ground without being confrontational, offering both challenge and admiration.',
      hi: 'रिश्तों में मेष जातक भावुक, स्पष्ट और अत्यंत वफादार होते हैं — लेकिन साथी से समान तीव्रता चाहते हैं। अग्नि-वायु संयोजन सबसे अच्छा काम करता है: सिंह और धनु उनकी ऊर्जा से मेल खाते हैं, जबकि मिथुन और कुम्भ बौद्धिक उत्तेजना देते हैं। अत्यधिक भावुक या चिपकने वाले साथी के साथ ये कठिनाई महसूस करते हैं। झगड़े तीव्र लेकिन अल्पकालिक होते हैं — ये शायद ही कभी शिकायत रखते हैं।'
    },
    strengths: {
      en: 'Courageous, pioneering, energetic, confident, enthusiastic, direct, resilient, decisive, optimistic, natural leader',
      hi: 'साहसी, अग्रणी, ऊर्जावान, आत्मविश्वासी, उत्साही, स्पष्टवादी, लचीले, निर्णायक, आशावादी, स्वाभाविक नेता'
    },
    challenges: {
      en: 'Impulsive, impatient, short-tempered, domineering, easily bored, reckless, confrontational, self-centered at times',
      hi: 'आवेगी, अधीर, क्रोधी, दबंग, जल्दी ऊबने वाले, लापरवाह, टकरावपूर्ण, कभी-कभी आत्मकेंद्रित'
    },
    luckyNumbers: [9, 1, 8],
    luckyColors: {
      en: 'Red, Scarlet, Copper',
      hi: 'लाल, सिंदूरी, ताम्र'
    },
    luckyGems: {
      en: 'Red Coral (Moonga)',
      hi: 'लाल मूंगा (मूंगा)'
    },
    compatibleRashis: [5, 9, 3, 11],
    faqs: [
      {
        question: { en: 'What planet rules Aries (Mesh)?', hi: 'मेष राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Mars (Mangal) is the ruling planet of Aries. Mars bestows courage, physical energy, aggression, and a warrior-like temperament upon Aries natives. It is the planet of action, making Aries the most initiative-driven sign in the zodiac.', hi: 'मंगल ग्रह मेष राशि का स्वामी है। मंगल साहस, शारीरिक ऊर्जा, आक्रामकता और योद्धा जैसा स्वभाव प्रदान करता है। यह क्रिया का ग्रह है, जो मेष को राशिचक्र की सबसे पहलकदमी वाली राशि बनाता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Aries?', hi: 'मेष राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Three nakshatras occupy Aries: Ashwini (0°-13°20\'), Bharani (13°20\'-26°40\'), and the first pada of Krittika (26°40\'-30°). Each nakshatra gives distinct sub-characteristics — Ashwini natives are swift healers, Bharani are creative and intense, while Krittika pada 1 adds sharpness and critical thinking.', hi: 'मेष राशि में तीन नक्षत्र आते हैं: अश्विनी (0°-13°20\'), भरणी (13°20\'-26°40\'), और कृत्तिका का पहला पद (26°40\'-30°)। प्रत्येक नक्षत्र अलग विशेषताएँ देता है — अश्विनी के जातक तेज और चिकित्सक होते हैं, भरणी रचनात्मक और तीव्र, जबकि कृत्तिका पद 1 तीक्ष्णता जोड़ता है।' }
      },
      {
        question: { en: 'Is Aries compatible with Capricorn?', hi: 'क्या मेष और मकर राशि में अनुकूलता होती है?' },
        answer: { en: 'Aries and Capricorn form a challenging square aspect (4th-10th axis). Mars (Aries) and Saturn (Capricorn) are natural adversaries — Mars is impulsive while Saturn demands patience. This combination can work in business partnerships where Aries provides initiative and Capricorn provides structure, but romantic relationships require significant compromise from both sides.', hi: 'मेष और मकर चतुर्थ-दशम अक्ष बनाते हैं जो चुनौतीपूर्ण है। मंगल (मेष) और शनि (मकर) प्राकृतिक विरोधी हैं। व्यापार में यह जोड़ी काम कर सकती है जहाँ मेष पहल करता है और मकर संरचना देता है, लेकिन प्रेम संबंधों में दोनों से महत्वपूर्ण समझौते की आवश्यकता होती है।' }
      },
      {
        question: { en: 'What is the best gemstone for Aries?', hi: 'मेष राशि के लिए सबसे अच्छा रत्न कौन सा है?' },
        answer: { en: 'Red Coral (Moonga) is the primary gemstone for Aries, as it strengthens Mars energy. It should be set in copper or gold and worn on the ring finger of the right hand on a Tuesday during Shukla Paksha. Carnelian and bloodstone are affordable alternatives that also resonate with Mars energy.', hi: 'लाल मूंगा (मूंगा) मेष राशि का प्रमुख रत्न है जो मंगल की ऊर्जा को मजबूत करता है। इसे ताम्र या सोने में जड़वाकर दाहिने हाथ की अनामिका में शुक्ल पक्ष के मंगलवार को पहनना चाहिए।' }
      }
    ]
  },

  // ─── 2. VRISHABH (Taurus) ───────────────────────────────────────
  {
    id: 2,
    personality: {
      en: 'Taurus, the second sign of the zodiac, is ruled by Venus — the planet of beauty, luxury, and sensual pleasure. As a fixed earth sign, Taurus natives embody stability, patience, and an unwavering attachment to material comfort. The bull symbolizes their formidable endurance: slow to anger but devastating when provoked. Venus bestows upon them a refined aesthetic sense, love of art, music, and fine cuisine, and a deep appreciation for the tangible pleasures of life. Taurus individuals build their lives on solid foundations — they prefer proven paths over risky experiments, accumulating wealth and possessions with methodical persistence. Their fixed modality gives them extraordinary staying power; what an Aries starts, a Taurus finishes. They are the most reliable sign in the zodiac, honoring commitments with quiet determination. However, this same fixity can become obstinacy — once a Taurus decides something, changing their mind is nearly impossible. They experience the world primarily through their senses: touch, taste, smell, sound, and sight all matter deeply to them. Their connection to earth makes them natural gardeners, cooks, and craftspeople. In matters of finance, they are shrewd and conservative, rarely making speculative investments. At their core, Taurus natives seek security and beauty in equal measure, building a life that satisfies both practical needs and aesthetic desires.',
      hi: 'वृषभ राशि, राशिचक्र की दूसरी राशि, शुक्र ग्रह द्वारा शासित है — जो सौंदर्य, विलासिता और कला का ग्रह है। स्थिर पृथ्वी राशि होने के कारण वृषभ के जातक स्थिरता, धैर्य और भौतिक सुख के प्रति गहरे लगाव का प्रतीक हैं। बैल उनकी अद्भुत सहनशक्ति का प्रतीक है — क्रोधित होने में धीमे लेकिन भड़कने पर विनाशकारी। शुक्र उन्हें परिष्कृत सौंदर्य बोध, कला-संगीत का प्रेम और जीवन के स्पर्शनीय सुखों की गहरी सराहना प्रदान करता है। ये जातक ठोस नींव पर जीवन बनाते हैं और जोखिम भरे प्रयोगों से अधिक सिद्ध मार्गों को प्राथमिकता देते हैं। स्थिर स्वभाव के कारण इनकी सहनशक्ति असाधारण होती है, लेकिन यही स्थिरता जिद बन सकती है। वित्तीय मामलों में ये चतुर और रूढ़िवादी होते हैं।'
    },
    career: {
      en: 'Venus-ruled Taurus gravitates toward careers involving beauty, finance, and material creation. They excel as bankers, financial advisors, real estate developers, interior designers, chefs, musicians, and luxury brand managers. Their patient, methodical nature makes them outstanding accountants and auditors. Agriculture and horticulture strongly appeal to their earth element connection. Taurus natives make excellent artists — sculptors, jewelers, and fashion designers who work with tangible materials. They prefer stable, well-paying positions over high-risk entrepreneurship, though they can build highly successful businesses in hospitality, food, beauty, or luxury goods where their refined taste becomes a competitive advantage.',
      hi: 'शुक्र-शासित वृषभ जातक सौंदर्य, वित्त और भौतिक सृजन से जुड़े करियर की ओर आकर्षित होते हैं। बैंकिंग, वित्तीय सलाह, रियल एस्टेट, इंटीरियर डिज़ाइन, पाक कला, संगीत और लक्जरी ब्रांड प्रबंधन में ये सफल होते हैं। कृषि और बागवानी उनके पृथ्वी तत्व से जुड़ी है। ये उत्कृष्ट कलाकार होते हैं — मूर्तिकार, जौहरी और फैशन डिज़ाइनर। उच्च जोखिम वाले व्यवसाय की बजाय स्थिर, अच्छे वेतन वाले पदों को प्राथमिकता देते हैं।'
    },
    health: {
      en: 'Taurus governs the throat, neck, and thyroid gland, making natives susceptible to sore throats, thyroid disorders, tonsillitis, and neck stiffness. Their love of rich food and sedentary tendencies can lead to weight gain, diabetes, and metabolic issues. Venus influence manifests as skin sensitivities and a tendency toward overindulgence in sweets and alcohol. Taurus natives benefit from regular but moderate exercise — yoga, swimming, and nature walks suit them better than intense competitive sports. They should pay special attention to portion control and maintain a balanced diet rich in fresh vegetables. Singing and vocal exercises can actually strengthen their vulnerable throat area. Regular thyroid screening is advisable after age 30.',
      hi: 'वृषभ राशि गले, गर्दन और थायरॉइड ग्रंथि पर शासन करती है, जिससे गले में खराश, थायरॉइड विकार, टॉन्सिलिटिस और गर्दन की अकड़न की संभावना रहती है। समृद्ध भोजन के प्रेम और बैठी जीवनशैली से वजन बढ़ना और मधुमेह हो सकता है। नियमित लेकिन मध्यम व्यायाम — योग, तैराकी और प्रकृति में टहलना इनके लिए उपयुक्त है। आहार में संयम और ताज़ी सब्जियाँ महत्वपूर्ण हैं। 30 वर्ष के बाद नियमित थायरॉइड जाँच अनुशंसित है।'
    },
    relationships: {
      en: 'Taurus approaches relationships with the same steadfastness they bring to everything else — once committed, they are loyal to the core. They express love through physical affection, gift-giving, and creating comfortable shared spaces. Earth-water combinations are most harmonious: Virgo and Capricorn share their practical values, while Cancer and Pisces provide the emotional depth Taurus secretly craves. They need a partner who appreciates routine and domestic stability. Possessiveness is their greatest relationship challenge — they can become jealous and controlling if they feel their security is threatened. Taurus lovers are sensual and attentive but slow to open up, requiring patience from their partner to build deep trust.',
      hi: 'वृषभ जातक रिश्तों में वही दृढ़ता लाते हैं जो वे हर चीज़ में दिखाते हैं — एक बार प्रतिबद्ध होने पर अत्यंत वफादार होते हैं। शारीरिक स्नेह, उपहार और आरामदायक साझा स्थान बनाकर प्रेम व्यक्त करते हैं। कन्या और मकर उनके व्यावहारिक मूल्य साझा करते हैं, जबकि कर्क और मीन भावनात्मक गहराई प्रदान करते हैं। ईर्ष्या और नियंत्रण उनकी सबसे बड़ी रिश्ते की चुनौती है — सुरक्षा का खतरा महसूस होने पर ये अधिकार-भावना दिखा सकते हैं।'
    },
    strengths: {
      en: 'Patient, reliable, devoted, responsible, stable, artistic, practical, sensual, determined, financially shrewd',
      hi: 'धैर्यवान, विश्वसनीय, समर्पित, जिम्मेदार, स्थिर, कलात्मक, व्यावहारिक, कामुक, दृढ़निश्चयी, आर्थिक रूप से चतुर'
    },
    challenges: {
      en: 'Stubborn, possessive, materialistic, resistant to change, overindulgent, lazy when unmotivated, inflexible, grudge-holding',
      hi: 'जिद्दी, अधिकारी, भौतिकवादी, परिवर्तन-विरोधी, अतिभोगी, प्रेरणा के बिना आलसी, अनम्य, शिकायत रखने वाले'
    },
    luckyNumbers: [6, 5, 8],
    luckyColors: {
      en: 'White, Cream, Green, Pink',
      hi: 'सफ़ेद, क्रीम, हरा, गुलाबी'
    },
    luckyGems: {
      en: 'Diamond (Heera) or White Sapphire',
      hi: 'हीरा या श्वेत पुखराज'
    },
    compatibleRashis: [6, 10, 4, 12],
    faqs: [
      {
        question: { en: 'What planet rules Taurus (Vrishabh)?', hi: 'वृषभ राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Venus (Shukra) rules Taurus. Venus is the planet of love, beauty, art, and material wealth. It gives Taurus natives their refined taste, love of comfort, artistic sensibility, and strong attachment to physical pleasures and financial security.', hi: 'शुक्र ग्रह वृषभ राशि का स्वामी है। शुक्र प्रेम, सौंदर्य, कला और भौतिक संपत्ति का ग्रह है। यह वृषभ जातकों को परिष्कृत रुचि, आराम का प्रेम, कलात्मक संवेदनशीलता और भौतिक सुखों से गहरा लगाव प्रदान करता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Taurus?', hi: 'वृषभ राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Taurus contains Krittika padas 2-4 (30°-40°), the complete Rohini nakshatra (40°-53°20\'), and Mrigashira padas 1-2 (53°20\'-60°). Rohini is considered the most auspicious nakshatra in Taurus, associated with fertility, creativity, and beauty. The Moon is exalted in Taurus at 3° (Krittika).', hi: 'वृषभ राशि में कृत्तिका पद 2-4, संपूर्ण रोहिणी नक्षत्र, और मृगशिरा पद 1-2 आते हैं। रोहिणी को वृषभ का सबसे शुभ नक्षत्र माना जाता है, जो उर्वरता, रचनात्मकता और सौंदर्य से जुड़ा है। चंद्रमा वृषभ में 3° पर उच्च का होता है।' }
      },
      {
        question: { en: 'Why is Taurus considered the most stubborn sign?', hi: 'वृषभ को सबसे जिद्दी राशि क्यों माना जाता है?' },
        answer: { en: 'Taurus is a fixed earth sign — the most immovable combination in the zodiac. Fixed signs resist change by nature, and earth element adds material attachment to that resistance. Combined with Venus rulership (which seeks comfort and dislikes disruption), Taurus natives develop strong attachment to their established routines, possessions, and opinions. This quality is also their greatest strength: unmatched perseverance and reliability.', hi: 'वृषभ एक स्थिर पृथ्वी राशि है — राशिचक्र का सबसे अचल संयोजन। स्थिर राशियाँ स्वभाव से परिवर्तन का विरोध करती हैं, और पृथ्वी तत्व उस प्रतिरोध में भौतिक लगाव जोड़ता है। शुक्र के शासन के साथ, ये जातक अपनी स्थापित दिनचर्या और विचारों से गहरा लगाव विकसित करते हैं। यही गुण उनकी सबसे बड़ी ताकत भी है: अद्वितीय दृढ़ता और विश्वसनीयता।' }
      },
      {
        question: { en: 'What is the best gemstone for Taurus?', hi: 'वृषभ राशि के लिए सबसे अच्छा रत्न कौन सा है?' },
        answer: { en: 'Diamond (Heera) is the primary gemstone for Taurus, strengthening Venus energy. It should be worn on the middle finger or ring finger of the right hand in platinum or silver, on a Friday during Shukla Paksha. White Sapphire (Safed Pukhraj) and Opal are more affordable alternatives for Venus enhancement.', hi: 'हीरा वृषभ राशि का प्रमुख रत्न है जो शुक्र की ऊर्जा को मजबूत करता है। इसे प्लेटिनम या चाँदी में जड़वाकर दाहिने हाथ की मध्यमा या अनामिका में शुक्ल पक्ष के शुक्रवार को पहनना चाहिए। सफ़ेद पुखराज और ओपल किफायती विकल्प हैं।' }
      }
    ]
  },

  // ─── 3. MITHUN (Gemini) ─────────────────────────────────────────
  {
    id: 3,
    personality: {
      en: 'Gemini, the third sign of the zodiac, is ruled by Mercury — the planet of intellect, communication, and duality. As a mutable air sign, Gemini natives are the communicators and information brokers of the zodiac, constantly gathering, processing, and distributing knowledge. The twins symbolize their dual nature: they can hold two contradictory ideas simultaneously and see merit in both sides of any argument. Mercury bestows upon them exceptional verbal and written skills, quick wit, and a restless curiosity that drives them to explore every subject under the sun — often many at once. Gemini individuals are social chameleons who can adapt their personality to any audience, making them charming conversationalists and skilled networkers. Their mutable modality gives them remarkable flexibility and adaptability, but also contributes to inconsistency. They process information at extraordinary speed, often thinking several steps ahead of those around them. However, their mind\'s constant activity can make it difficult to focus on one thing for extended periods. They are natural linguists, often speaking multiple languages or writing with unusual facility. Gemini natives live primarily in the realm of ideas — they are more comfortable discussing emotions than actually feeling them deeply. At their best, they are brilliant mediators, translators, and bridges between disparate worlds of thought.',
      hi: 'मिथुन राशि, राशिचक्र की तीसरी राशि, बुध ग्रह द्वारा शासित है — जो बुद्धि, संवाद और द्वैत का ग्रह है। द्विस्वभाव वायु राशि होने के कारण मिथुन जातक राशिचक्र के संचारक और सूचना दलाल हैं। जुड़वाँ उनके द्वैत स्वभाव का प्रतीक है — वे एक साथ दो विपरीत विचार रख सकते हैं। बुध उन्हें असाधारण वाक् कौशल, तीव्र बुद्धि और अथक जिज्ञासा प्रदान करता है। ये सामाजिक गिरगिट हैं जो किसी भी श्रोता के अनुसार अपना व्यवहार ढाल सकते हैं। सूचना को असाधारण गति से संसाधित करते हैं, लेकिन एक विषय पर लंबे समय तक ध्यान केंद्रित करना कठिन होता है। ये स्वाभाविक भाषाविद् होते हैं और विचारों के क्षेत्र में जीते हैं।'
    },
    career: {
      en: 'Mercury-ruled Gemini thrives in careers centered on communication, information, and intellectual exchange. Journalism, writing, broadcasting, public relations, and social media management are natural fits. They make excellent teachers, translators, interpreters, and diplomats. Their quick thinking suits trading, stock markets, and sales roles where rapid information processing is essential. Technology, particularly software development and data analysis, appeals to their logical minds. Gemini natives often juggle multiple careers simultaneously — a writer who also teaches and runs a podcast. They struggle in isolated, repetitive roles and need environments offering variety and social interaction. Advertising, marketing, and content creation perfectly blend their creativity with communication skills.',
      hi: 'बुध-शासित मिथुन जातक संचार, सूचना और बौद्धिक आदान-प्रदान पर केंद्रित करियर में फलते-फूलते हैं। पत्रकारिता, लेखन, प्रसारण, जनसंपर्क और सोशल मीडिया प्रबंधन स्वाभाविक विकल्प हैं। ये उत्कृष्ट शिक्षक, अनुवादक और राजनयिक बनते हैं। ट्रेडिंग और शेयर बाज़ार में तेज़ सोच काम आती है। ये अक्सर एक साथ कई करियर संभालते हैं। एकांत और दोहराव वाली भूमिकाओं में ये संघर्ष करते हैं।'
    },
    health: {
      en: 'Gemini governs the arms, shoulders, hands, and lungs, making natives vulnerable to respiratory issues, asthma, bronchitis, and repetitive strain injuries in the hands and wrists. Their nervous energy can manifest as anxiety, insomnia, and nervous exhaustion. Mercury\'s influence makes them susceptible to skin allergies and nerve-related disorders. Gemini individuals often neglect their physical health while overworking their minds — they need to consciously practice grounding exercises. Breathing exercises (pranayama) are particularly beneficial for strengthening their vulnerable respiratory system. They should guard against information overload and schedule regular digital detoxes. Shoulder and arm stretches, along with activities like swimming that engage the upper body, help maintain their physical wellbeing.',
      hi: 'मिथुन राशि भुजाओं, कंधों, हाथों और फेफड़ों पर शासन करती है, जिससे श्वसन समस्याएँ, अस्थमा, ब्रोंकाइटिस और हाथ-कलाई की चोटों की संभावना रहती है। उनकी तंत्रिका ऊर्जा चिंता, अनिद्रा और तंत्रिका थकान के रूप में प्रकट हो सकती है। बुध का प्रभाव त्वचा एलर्जी और तंत्रिका विकारों की संभावना बनाता है। प्राणायाम उनकी कमज़ोर श्वसन प्रणाली को मजबूत करने के लिए विशेष रूप से लाभदायक है। नियमित डिजिटल डिटॉक्स की भी आवश्यकता है।'
    },
    relationships: {
      en: 'Gemini approaches relationships with curiosity and playfulness, seeking a partner who is first and foremost an intellectual equal. They need mental stimulation more than emotional intensity — boring conversations are a bigger dealbreaker than anything else. Air-fire combinations work wonderfully: Libra and Aquarius share their love of ideas and social engagement, while Aries and Leo bring exciting energy. Gemini lovers are witty, fun, and verbally affectionate, but can seem emotionally detached. Their dual nature means they can be deeply engaged one day and distantly preoccupied the next, which partners may find confusing. Freedom within partnership is essential — a possessive partner will drive a Gemini away faster than anything else.',
      hi: 'मिथुन जातक रिश्तों में जिज्ञासा और खेल भावना लाते हैं, ऐसे साथी की तलाश में जो सबसे पहले बौद्धिक बराबरी का हो। भावनात्मक तीव्रता से अधिक मानसिक उत्तेजना चाहिए। तुला और कुम्भ विचारों और सामाजिक जुड़ाव का प्रेम साझा करते हैं, जबकि मेष और सिंह रोमांचक ऊर्जा लाते हैं। ये प्रेमी बुद्धिमान और मज़ेदार होते हैं लेकिन भावनात्मक रूप से विलग लग सकते हैं। साझेदारी में स्वतंत्रता अनिवार्य है।'
    },
    strengths: {
      en: 'Versatile, communicative, intellectual, witty, adaptable, curious, social, quick-thinking, articulate, youthful',
      hi: 'बहुमुखी, संवादशील, बौद्धिक, चतुर, अनुकूलनशील, जिज्ञासु, सामाजिक, तेज़-सोच, वाक्पटु, युवा'
    },
    challenges: {
      en: 'Inconsistent, superficial, anxious, indecisive, gossipy, emotionally detached, restless, unreliable when bored',
      hi: 'असंगत, सतही, चिंतित, अनिर्णायक, गपशप करने वाले, भावनात्मक रूप से विलग, बेचैन, ऊबने पर अविश्वसनीय'
    },
    luckyNumbers: [5, 3, 6],
    luckyColors: {
      en: 'Green, Yellow, Light Blue',
      hi: 'हरा, पीला, हल्का नीला'
    },
    luckyGems: {
      en: 'Emerald (Panna)',
      hi: 'पन्ना'
    },
    compatibleRashis: [7, 11, 1, 5],
    faqs: [
      {
        question: { en: 'What planet rules Gemini (Mithun)?', hi: 'मिथुन राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Mercury (Budh) rules Gemini. Mercury is the planet of intellect, communication, commerce, and analysis. It gives Gemini natives their quick wit, linguistic ability, love of learning, and talent for connecting people and ideas across boundaries.', hi: 'बुध ग्रह मिथुन राशि का स्वामी है। बुध बुद्धि, संवाद, व्यापार और विश्लेषण का ग्रह है। यह मिथुन जातकों को तीव्र बुद्धि, भाषा क्षमता, सीखने का प्रेम और लोगों तथा विचारों को जोड़ने की प्रतिभा प्रदान करता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Gemini?', hi: 'मिथुन राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Gemini contains Mrigashira padas 3-4 (60°-66°40\'), the complete Ardra nakshatra (66°40\'-80°), and Punarvasu padas 1-3 (80°-90°). Ardra, ruled by Rahu, is the most intense nakshatra here — associated with storms, transformation, and intellectual breakthroughs. Punarvasu brings optimism and renewal.', hi: 'मिथुन राशि में मृगशिरा पद 3-4, संपूर्ण आर्द्रा नक्षत्र, और पुनर्वसु पद 1-3 आते हैं। राहु-शासित आर्द्रा यहाँ का सबसे तीव्र नक्षत्र है — तूफान, परिवर्तन और बौद्धिक सफलताओं से जुड़ा। पुनर्वसु आशावाद और नवीनीकरण लाता है।' }
      },
      {
        question: { en: 'Why do Geminis have a reputation for being two-faced?', hi: 'मिथुन जातकों को दोहरे स्वभाव वाला क्यों माना जाता है?' },
        answer: { en: 'This reputation stems from Gemini\'s twin symbolism and mutable nature. Gemini natives genuinely see multiple perspectives and can shift viewpoints rapidly, which others may interpret as inconsistency or duplicity. In reality, they are processing information from all angles simultaneously. Their adaptability in social situations — adjusting tone and topic to different audiences — can also appear inauthentic, though it is actually a form of social intelligence.', hi: 'यह प्रतिष्ठा मिथुन के जुड़वाँ प्रतीक और द्विस्वभाव प्रकृति से आती है। मिथुन जातक वास्तव में कई दृष्टिकोण देखते हैं और तेज़ी से विचार बदल सकते हैं, जिसे अन्य लोग असंगतता या छल मान सकते हैं। वास्तव में, वे एक साथ सभी कोणों से सूचना संसाधित कर रहे होते हैं।' }
      }
    ]
  },

  // ─── 4. KARK (Cancer) ───────────────────────────────────────────
  {
    id: 4,
    personality: {
      en: 'Cancer, the fourth sign of the zodiac, is ruled by the Moon — the luminary of emotions, intuition, and the subconscious mind. As a cardinal water sign, Cancer natives are emotionally intelligent initiators who create safe harbors for themselves and their loved ones. The crab symbolizes their protective nature: a hard exterior shell concealing extraordinary emotional depth and sensitivity within. The Moon bestows upon them powerful intuition, empathic ability, and a memory that retains emotional experiences with photographic clarity — they never truly forget how someone made them feel. Cancer individuals are the nurturers and caretakers of the zodiac, driven by a deep need to protect and provide for their family and inner circle. Their cardinal modality gives them surprising initiative when their loved ones are threatened or when building a home and family. They experience reality primarily through feelings, often knowing things before they can rationally explain why. Their moods wax and wane with lunar cycles, creating emotional tides that can be overwhelming to both themselves and those around them. They possess an innate connection to ancestry, tradition, and the past — often becoming family historians or preservers of cultural heritage. At their best, Cancer natives create environments of unconditional love and emotional safety that allow others to heal and grow. Their creativity often flows from deep emotional wells, producing art, music, and writing of profound sensitivity.',
      hi: 'कर्क राशि, राशिचक्र की चौथी राशि, चंद्रमा द्वारा शासित है — जो भावनाओं, अंतर्ज्ञान और अवचेतन मन का ग्रह है। चर जल राशि होने के कारण कर्क जातक भावनात्मक रूप से बुद्धिमान होते हैं जो अपने और प्रियजनों के लिए सुरक्षित आश्रय बनाते हैं। केकड़ा उनकी रक्षात्मक प्रकृति का प्रतीक है — कठोर बाहरी आवरण के भीतर असाधारण भावनात्मक गहराई। चंद्रमा उन्हें शक्तिशाली अंतर्ज्ञान, सहानुभूति और स्मृति प्रदान करता है जो भावनात्मक अनुभवों को तस्वीर जैसी स्पष्टता से संजोती है। ये राशिचक्र के पालनकर्ता हैं, परिवार की रक्षा और भरण-पोषण की गहरी आवश्यकता से प्रेरित। उनकी भावनाएँ चंद्र चक्रों के साथ बढ़ती-घटती हैं। वंश, परंपरा और अतीत से गहरा जुड़ाव रखते हैं।'
    },
    career: {
      en: 'Moon-ruled Cancer excels in careers involving nurturing, caregiving, and emotional connection with the public. They make outstanding nurses, doctors, psychologists, therapists, social workers, and childcare professionals. Their connection to the Moon gives them talent in hospitality — hotel management, restaurants, and catering. Real estate appeals to their home-oriented nature. Cancer natives also excel in fields connecting to heritage and memory: museum curation, archaeology, history, and genealogy. Their intuitive understanding of public sentiment makes them effective politicians and public servants. The food industry, dairy farming, and anything related to water (marine biology, shipping, fisheries) align with their elemental nature. Creative fields like poetry, music composition, and interior design channel their deep emotional sensitivity into beautiful expression.',
      hi: 'चंद्र-शासित कर्क जातक पालन-पोषण, देखभाल और जनता से भावनात्मक जुड़ाव वाले करियर में उत्कृष्ट होते हैं। नर्सिंग, चिकित्सा, मनोविज्ञान, सामाजिक कार्य और शिशु देखभाल में सफल होते हैं। आतिथ्य — होटल प्रबंधन, रेस्तराँ में प्रतिभा दिखाते हैं। रियल एस्टेट उनके गृह-उन्मुख स्वभाव के अनुकूल है। विरासत और स्मृति से जुड़े क्षेत्र — संग्रहालय, पुरातत्व, इतिहास में भी सफल होते हैं। खाद्य उद्योग और जल से जुड़े क्षेत्र उनकी तात्विक प्रकृति के अनुरूप हैं।'
    },
    health: {
      en: 'Cancer rules the chest, stomach, and breasts, predisposing natives to digestive disorders, acid reflux, gastric ulcers, and breast-related conditions. Their emotional nature means stress directly impacts their gut — anxiety often manifests as stomach problems. Water retention, bloating, and lymphatic congestion are common. The Moon\'s influence creates sensitivity to lunar cycles, with symptoms often worsening around full and new moons. Cancer natives are prone to emotional eating, using food as comfort during stress. They benefit from gentle, nurturing forms of exercise like swimming, walking by water, and yin yoga. Maintaining emotional equilibrium is critical for their physical health — unresolved emotions will inevitably manifest as physical symptoms. Probiotics and digestive enzymes can support their sensitive digestive systems.',
      hi: 'कर्क राशि छाती, पेट और स्तनों पर शासन करती है, जिससे पाचन विकार, अम्लता, गैस्ट्रिक अल्सर और स्तन संबंधी समस्याओं की संभावना रहती है। भावनात्मक स्वभाव का अर्थ है कि तनाव सीधे पेट को प्रभावित करता है। जल प्रतिधारण और सूजन आम है। चंद्र चक्रों के प्रति संवेदनशीलता होती है। भावनात्मक खाने की प्रवृत्ति होती है। तैराकी और यिन योग जैसे कोमल व्यायाम लाभदायक हैं। भावनात्मक संतुलन शारीरिक स्वास्थ्य के लिए महत्वपूर्ण है।'
    },
    relationships: {
      en: 'Cancer is perhaps the most relationship-oriented sign in the zodiac, seeking deep emotional bonds and lasting commitment above all else. They love with complete devotion and expect the same in return. Water-earth combinations are ideal: Scorpio and Pisces understand their emotional depth intuitively, while Taurus and Virgo provide the stability and practical grounding they need. Cancer lovers express affection through cooking, creating cozy spaces, and remembering every meaningful detail about their partner. Their greatest challenge is moodiness and emotional withdrawal — they retreat into their shell when hurt, shutting out even those who want to help. They can be clingy and over-protective, sometimes smothering their partner with care. Past hurts are difficult for them to release, and they may project old wounds onto new relationships.',
      hi: 'कर्क शायद राशिचक्र की सबसे रिश्ता-केंद्रित राशि है, जो गहरे भावनात्मक बंधन और स्थायी प्रतिबद्धता चाहती है। पूर्ण समर्पण से प्रेम करते हैं और बदले में वही चाहते हैं। वृश्चिक और मीन उनकी भावनात्मक गहराई को सहज रूप से समझते हैं, जबकि वृषभ और कन्या स्थिरता प्रदान करते हैं। खाना बनाकर, आरामदायक स्थान बनाकर प्यार व्यक्त करते हैं। सबसे बड़ी चुनौती मनोदशा में उतार-चढ़ाव और भावनात्मक पीछे हटना है — चोट लगने पर अपने खोल में सिमट जाते हैं।'
    },
    strengths: {
      en: 'Nurturing, intuitive, emotionally intelligent, protective, loyal, imaginative, tenacious, empathic, domestic, devoted to family',
      hi: 'पालनकर्ता, अंतर्ज्ञानी, भावनात्मक रूप से बुद्धिमान, रक्षक, वफादार, कल्पनाशील, दृढ़, सहानुभूतिपूर्ण, घरेलू, परिवार-समर्पित'
    },
    challenges: {
      en: 'Moody, clingy, over-sensitive, manipulative when insecure, passive-aggressive, prone to self-pity, difficulty letting go of the past',
      hi: 'मनमौजी, चिपकने वाले, अत्यधिक संवेदनशील, असुरक्षित होने पर चालाक, निष्क्रिय-आक्रामक, आत्म-दया की प्रवृत्ति, अतीत को छोड़ने में कठिनाई'
    },
    luckyNumbers: [2, 7, 9],
    luckyColors: {
      en: 'White, Silver, Pale Yellow',
      hi: 'सफ़ेद, चाँदी, हल्का पीला'
    },
    luckyGems: {
      en: 'Pearl (Moti)',
      hi: 'मोती'
    },
    compatibleRashis: [8, 12, 2, 6],
    faqs: [
      {
        question: { en: 'What planet rules Cancer (Kark)?', hi: 'कर्क राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'The Moon (Chandra) rules Cancer. The Moon governs emotions, the subconscious mind, mother, nurturing, and public life. It gives Cancer natives their deep intuition, emotional sensitivity, strong attachment to home and family, and ability to connect with people on an emotional level.', hi: 'चंद्रमा (चंद्र) कर्क राशि का स्वामी है। चंद्रमा भावनाओं, अवचेतन मन, माता, पालन-पोषण और सार्वजनिक जीवन पर शासन करता है। यह कर्क जातकों को गहरा अंतर्ज्ञान, भावनात्मक संवेदनशीलता और घर-परिवार से गहरा लगाव प्रदान करता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Cancer?', hi: 'कर्क राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Cancer contains Punarvasu pada 4 (90°-93°20\'), the complete Pushya nakshatra (93°20\'-106°40\'), and the complete Ashlesha nakshatra (106°40\'-120°). Pushya is considered the most nourishing nakshatra in the entire zodiac, ruled by Saturn and associated with dharma and spiritual growth. Ashlesha, ruled by Mercury, carries serpent energy — mystical but potentially manipulative.', hi: 'कर्क राशि में पुनर्वसु पद 4, संपूर्ण पुष्य नक्षत्र, और संपूर्ण आश्लेषा नक्षत्र आते हैं। पुष्य को संपूर्ण राशिचक्र का सबसे पोषक नक्षत्र माना जाता है। आश्लेषा में सर्प ऊर्जा होती है — रहस्यमय लेकिन संभावित रूप से छलपूर्ण।' }
      },
      {
        question: { en: 'How does the Moon\'s cycle affect Cancer natives?', hi: 'चंद्रमा का चक्र कर्क जातकों को कैसे प्रभावित करता है?' },
        answer: { en: 'Cancer natives are the most Moon-sensitive sign in the zodiac. During the waxing Moon (Shukla Paksha), they tend to feel more energetic, optimistic, and socially engaged. During the waning Moon (Krishna Paksha), they may become more introspective, emotional, and withdrawn. Full Moon days often bring heightened emotions and creativity, while New Moon days can trigger deep introspection or melancholy. Tracking lunar phases can help Cancer natives plan important decisions during their emotionally strongest periods.', hi: 'कर्क जातक राशिचक्र में चंद्रमा के प्रति सबसे अधिक संवेदनशील होते हैं। शुक्ल पक्ष में अधिक ऊर्जावान और आशावादी, कृष्ण पक्ष में अधिक अंतर्मुखी और भावुक होते हैं। पूर्णिमा पर भावनाएँ और रचनात्मकता चरम पर होती है, अमावस्या पर गहन आत्मनिरीक्षण हो सकता है।' }
      },
      {
        question: { en: 'What is the best gemstone for Cancer?', hi: 'कर्क राशि के लिए सबसे अच्छा रत्न कौन सा है?' },
        answer: { en: 'Pearl (Moti) is the primary gemstone for Cancer, strengthening the Moon\'s beneficial qualities. Natural sea pearls are most effective, set in silver and worn on the little finger of the right hand on a Monday during Shukla Paksha. Moonstone is a popular and more affordable alternative that also channels lunar energy effectively.', hi: 'मोती कर्क राशि का प्रमुख रत्न है जो चंद्रमा के शुभ गुणों को मजबूत करता है। प्राकृतिक समुद्री मोती सबसे प्रभावी होते हैं, चाँदी में जड़वाकर दाहिने हाथ की कनिष्ठिका में शुक्ल पक्ष के सोमवार को पहनना चाहिए। मूनस्टोन एक किफायती विकल्प है।' }
      }
    ]
  },

  // ─── 5. SIMHA (Leo) ─────────────────────────────────────────────
  {
    id: 5,
    personality: {
      en: 'Leo, the fifth sign of the zodiac, is ruled by the Sun — the king of planets, the source of light, vitality, and authority. As a fixed fire sign, Leo natives radiate warmth, confidence, and a natural magnetism that draws people into their orbit like planets around a star. The lion symbolizes their regal bearing: proud, generous, and commanding, with a mane of dignity they wear in all circumstances. The Sun bestows upon them a powerful sense of self, creative fire, and an innate understanding of leadership that goes beyond mere authority to genuine inspiration. Leo individuals live with theatrical flair — they do nothing quietly or halfway. Their fixed modality gives their creative fire sustained intensity, producing artists, performers, and leaders of enduring influence rather than fleeting fame. They possess an extraordinary ability to see the best in others and inspire them to reach their potential, making them natural mentors and patrons. However, their need for recognition and admiration can become an Achilles heel — Leo natives can be devastated by perceived disrespect or public embarrassment. Their generosity is legendary: they give lavishly of their time, resources, and affection, sometimes to their own detriment. At their core, Leo natives are driven by a deep need to create, express, and leave a lasting legacy. Their warmth is genuine and solar — being around a Leo at their best feels like standing in warm sunlight, nourishing and life-giving.',
      hi: 'सिंह राशि, राशिचक्र की पाँचवीं राशि, सूर्य द्वारा शासित है — ग्रहों का राजा, प्रकाश, जीवन शक्ति और अधिकार का स्रोत। स्थिर अग्नि राशि होने के कारण सिंह जातक ऊष्मा, आत्मविश्वास और प्राकृतिक चुंबकत्व विकीर्ण करते हैं जो लोगों को अपनी कक्षा में खींचता है। सिंह (शेर) उनके राजसी आचरण का प्रतीक है — गर्वशील, उदार और प्रभावशाली। सूर्य उन्हें शक्तिशाली आत्म-बोध, रचनात्मक अग्नि और नेतृत्व की सहज समझ प्रदान करता है। ये जातक नाटकीय शान से जीते हैं — कुछ भी चुपचाप या आधा-अधूरा नहीं करते। दूसरों में सर्वश्रेष्ठ देखने और उन्हें प्रेरित करने की असाधारण क्षमता रखते हैं। हालाँकि, मान्यता की आवश्यकता उनकी कमज़ोरी बन सकती है। उनकी उदारता अद्वितीय है — समय, संसाधन और स्नेह भरपूर देते हैं।'
    },
    career: {
      en: 'Sun-ruled Leo gravitates toward careers offering authority, recognition, and creative expression. Government service, administration, and politics are natural domains where their leadership shines. They excel as CEOs, directors, and heads of organizations — any position where they can set vision and inspire teams. The entertainment industry — acting, directing, producing, music performance — perfectly suits their theatrical nature. Education at senior levels (principals, deans, professors) appeals to their mentoring instincts. Leo natives make charismatic motivational speakers, life coaches, and brand ambassadors. Luxury industries, gold trading, and prestigious professions like cardiology (Leo rules the heart) also attract them. They struggle in subordinate roles with no autonomy or recognition — they need a stage, whether literal or metaphorical.',
      hi: 'सूर्य-शासित सिंह जातक अधिकार, मान्यता और रचनात्मक अभिव्यक्ति वाले करियर की ओर आकर्षित होते हैं। सरकारी सेवा, प्रशासन और राजनीति स्वाभाविक क्षेत्र हैं। सीईओ, निदेशक और संगठन प्रमुख के रूप में उत्कृष्ट। मनोरंजन उद्योग — अभिनय, निर्देशन, संगीत — उनके नाटकीय स्वभाव के लिए उपयुक्त है। वरिष्ठ स्तर की शिक्षा और प्रेरणादायक वक्ता के रूप में भी सफल होते हैं। बिना स्वायत्तता या मान्यता वाली अधीनस्थ भूमिकाओं में ये संघर्ष करते हैं।'
    },
    health: {
      en: 'Leo governs the heart, spine, and upper back, making natives susceptible to cardiac conditions, hypertension, spinal problems, and upper back pain. The Sun\'s intense energy can manifest as inflammation, fevers, and eye problems (particularly vision deterioration with age). Leo natives tend to push themselves hard and may ignore early warning signs of heart strain. Their pride can prevent them from seeking medical help until conditions become serious. They benefit from cardiovascular exercise that strengthens the heart without overstraining it — moderate jogging, cycling, and dance. Yoga postures that open the chest and strengthen the spine are particularly beneficial. They should manage stress proactively, as their tendency to take on leadership burdens can create chronic tension. Regular cardiac checkups are essential, especially with family history of heart disease.',
      hi: 'सिंह राशि हृदय, रीढ़ और ऊपरी पीठ पर शासन करती है, जिससे हृदय रोग, उच्च रक्तचाप, रीढ़ की समस्याएँ और पीठ दर्द की संभावना रहती है। सूर्य की तीव्र ऊर्जा सूजन, बुखार और नेत्र समस्याओं के रूप में प्रकट हो सकती है। ये जातक खुद पर अत्यधिक दबाव डालते हैं और चेतावनी के संकेत अनदेखा कर सकते हैं। हृदय को मजबूत करने वाला मध्यम व्यायाम — जॉगिंग, साइकिलिंग, नृत्य लाभदायक है। छाती खोलने वाले योग आसन विशेष रूप से फायदेमंद हैं। नियमित हृदय जाँच आवश्यक है।'
    },
    relationships: {
      en: 'Leo loves with grand, dramatic gestures — they want a romance worthy of a great story. They are generous, warm, and fiercely protective partners who put their loved ones on a pedestal. Fire-air combinations ignite their passion: Aries and Sagittarius match their fire and enthusiasm, while Gemini and Libra offer admiration and social grace that Leo adores. Leo lovers need to feel special, admired, and central to their partner\'s world. They struggle with partners who are emotionally cold, critical, or who refuse to express appreciation openly. Their ego can create conflicts — Leo needs to learn that love sometimes means stepping out of the spotlight. Despite their pride, they are secretly vulnerable and deeply wounded by betrayal. A loyal partner who offers both genuine praise and honest feedback (delivered with tact) is Leo\'s ideal match.',
      hi: 'सिंह जातक भव्य, नाटकीय इशारों से प्रेम करते हैं — वे एक महान कहानी के योग्य प्रेम चाहते हैं। उदार, गर्मजोशी से भरे और अत्यंत रक्षात्मक साथी होते हैं। मेष और धनु उनकी अग्नि और उत्साह से मेल खाते हैं, जबकि मिथुन और तुला प्रशंसा और सामाजिक शिष्टता प्रदान करते हैं। विशेष और प्रशंसित महसूस करना चाहिए। भावनात्मक रूप से ठंडे या आलोचनात्मक साथियों के साथ संघर्ष करते हैं। गर्व के बावजूद, विश्वासघात से गहरा आघात लगता है।'
    },
    strengths: {
      en: 'Generous, warm-hearted, creative, charismatic, confident, loyal, inspiring, dignified, playful, magnanimous',
      hi: 'उदार, गर्मदिल, रचनात्मक, करिश्माई, आत्मविश्वासी, वफादार, प्रेरणादायक, गरिमामय, चंचल, महानुभाव'
    },
    challenges: {
      en: 'Arrogant, attention-seeking, dominating, inflexible ego, melodramatic, vain, intolerant of criticism, extravagant',
      hi: 'अहंकारी, ध्यान-आकांक्षी, दबंग, अनम्य अहं, नाटकीय, घमंडी, आलोचना-असहिष्णु, फिजूलखर्ची'
    },
    luckyNumbers: [1, 4, 9],
    luckyColors: {
      en: 'Gold, Orange, Royal Red',
      hi: 'सुनहरा, नारंगी, शाही लाल'
    },
    luckyGems: {
      en: 'Ruby (Manik)',
      hi: 'माणिक्य (माणिक)'
    },
    compatibleRashis: [1, 9, 3, 7],
    faqs: [
      {
        question: { en: 'What planet rules Leo (Simha)?', hi: 'सिंह राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'The Sun (Surya) rules Leo. The Sun is the king of the planetary cabinet in Vedic astrology, governing authority, self-expression, vitality, father, government, and soul purpose. It gives Leo natives their commanding presence, leadership ability, creative power, and desire for recognition.', hi: 'सूर्य (सूर्य) सिंह राशि का स्वामी है। सूर्य वैदिक ज्योतिष में ग्रह मंत्रिमंडल का राजा है, जो अधिकार, आत्म-अभिव्यक्ति, जीवन शक्ति, पिता और आत्मा के उद्देश्य पर शासन करता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Leo?', hi: 'सिंह राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Leo contains the complete Magha nakshatra (120°-133°20\'), the complete Purva Phalguni (133°20\'-146°40\'), and Uttara Phalguni pada 1 (146°40\'-150°). Magha, ruled by Ketu, carries ancestral and royal energy. Purva Phalguni, ruled by Venus, brings creativity, romance, and artistic talent. Uttara Phalguni pada 1, ruled by the Sun, adds administrative capability and patronage.', hi: 'सिंह राशि में संपूर्ण मघा नक्षत्र, संपूर्ण पूर्व फाल्गुनी, और उत्तर फाल्गुनी पद 1 आते हैं। केतु-शासित मघा में पैतृक और राजसी ऊर्जा होती है। शुक्र-शासित पूर्व फाल्गुनी रचनात्मकता और कलात्मक प्रतिभा लाती है।' }
      },
      {
        question: { en: 'Why is Leo associated with royalty and leadership?', hi: 'सिंह राशि को राजसत्ता और नेतृत्व से क्यों जोड़ा जाता है?' },
        answer: { en: 'Leo\'s association with royalty stems from its ruler, the Sun — called "Raja" (King) in Vedic astrology. The Sun is the center of the solar system, and Leo natives naturally gravitate toward central, authoritative positions. The lion symbolism reinforces this: the lion is "King of the Jungle" in Indian tradition. Additionally, the Magha nakshatra in Leo literally means "the great one" and is associated with throne rooms and royal lineages.', hi: 'सिंह का राजसत्ता से संबंध इसके स्वामी सूर्य से आता है — जिसे वैदिक ज्योतिष में "राजा" कहा जाता है। सूर्य सौरमंडल का केंद्र है, और सिंह जातक स्वाभाविक रूप से केंद्रीय, सत्तात्मक पदों की ओर आकर्षित होते हैं। मघा नक्षत्र का शाब्दिक अर्थ "महान" है और यह सिंहासन और राजवंशों से जुड़ा है।' }
      }
    ]
  },

  // ─── 6. KANYA (Virgo) ───────────────────────────────────────────
  {
    id: 6,
    personality: {
      en: 'Virgo, the sixth sign of the zodiac, is ruled by Mercury — but here Mercury expresses its analytical and discriminating faculties rather than the communicative side seen in Gemini. As a mutable earth sign, Virgo natives are the master craftspeople and analysts of the zodiac, applying intellectual precision to material reality. The virgin symbolizes purity of intent and method — Virgo seeks perfection not for vanity but because excellence is its own reward. Mercury bestows upon them razor-sharp analytical skills, attention to detail that borders on the microscopic, and a methodical approach to problem-solving that breaks complex issues into manageable components. Virgo individuals are service-oriented by nature — they find genuine fulfillment in being useful, in improving systems, and in helping others function better. Their mutable earth quality gives them practical adaptability: they can refine and optimize any process, system, or environment. They experience the world through the lens of "how can this be improved?" — a question that drives both their greatest contributions and their deepest anxieties. Criticism, including self-criticism, comes naturally to them. They are often their own harshest judges, setting impossibly high standards that even they struggle to meet. At their best, Virgo natives are indispensable: the person who catches the error everyone else missed, who organizes chaos into order, and who quietly ensures everything functions smoothly behind the scenes.',
      hi: 'कन्या राशि, राशिचक्र की छठी राशि, बुध ग्रह द्वारा शासित है — लेकिन यहाँ बुध अपने विश्लेषणात्मक और विवेकशील पक्ष को व्यक्त करता है। द्विस्वभाव पृथ्वी राशि होने के कारण कन्या जातक राशिचक्र के कुशल कारीगर और विश्लेषक हैं, जो बौद्धिक सटीकता को भौतिक वास्तविकता पर लागू करते हैं। कन्या पवित्रता का प्रतीक है — पूर्णता की खोज घमंड के लिए नहीं बल्कि उत्कृष्टता स्वयं पुरस्कार है। बुध उन्हें तीक्ष्ण विश्लेषणात्मक कौशल, सूक्ष्म विवरण पर ध्यान और समस्या-समाधान का व्यवस्थित दृष्टिकोण प्रदान करता है। ये सेवा-उन्मुख स्वभाव के होते हैं — उपयोगी होने, प्रणालियों को बेहतर बनाने में वास्तविक संतुष्टि पाते हैं। आत्म-आलोचना उनके लिए स्वाभाविक है — अक्सर अपने सबसे कठोर निर्णायक स्वयं होते हैं।'
    },
    career: {
      en: 'Mercury-ruled Virgo excels in careers demanding precision, analysis, and service. Healthcare is a primary domain — they make exceptional doctors, pharmacists, nutritionists, laboratory technicians, and medical researchers. Accounting, auditing, quality control, and data analysis perfectly suit their detail-oriented nature. They thrive in editorial work — proofreading, editing, and technical writing where accuracy is paramount. Virgo natives are outstanding programmers and software testers, finding bugs others overlook. Agriculture, herbal medicine, and Ayurveda connect to their earth element and healing nature. They excel in hygiene-related fields: food safety, environmental health, and sanitation. Administrative roles where they organize systems and processes leverage their natural talents. They struggle in creative-chaos environments without clear standards or structure.',
      hi: 'बुध-शासित कन्या जातक सटीकता, विश्लेषण और सेवा की माँग वाले करियर में उत्कृष्ट होते हैं। स्वास्थ्य सेवा प्राथमिक क्षेत्र है — उत्कृष्ट चिकित्सक, फार्मासिस्ट, पोषण विशेषज्ञ बनते हैं। लेखांकन, गुणवत्ता नियंत्रण और डेटा विश्लेषण में सफल। संपादकीय कार्य — प्रूफरीडिंग, तकनीकी लेखन में माहिर। प्रोग्रामिंग और सॉफ्टवेयर परीक्षण में दूसरों द्वारा अनदेखी गलतियाँ पकड़ते हैं। कृषि, हर्बल चिकित्सा और आयुर्वेद भी अनुकूल क्षेत्र हैं।'
    },
    health: {
      en: 'Virgo rules the intestines, digestive system, and abdomen, making natives prone to irritable bowel syndrome, food sensitivities, celiac disease, and digestive inflammation. Their anxious nature often manifests as gut problems — the gut-brain connection is especially strong in Virgo natives. Mercury\'s influence creates nervous tension that can lead to skin conditions (eczema, psoriasis) and nervous tics. Virgo individuals are often health-conscious to the point of hypochondria, worrying about illnesses they don\'t have. Paradoxically, their worry itself becomes the health problem. They benefit enormously from meditation and mindfulness practices that quiet their overactive analytical mind. A carefully monitored diet — Virgo often discovers food intolerances through personal experimentation — is more important for them than for any other sign. Herbal teas, probiotics, and foods rich in fiber support their sensitive digestive system.',
      hi: 'कन्या राशि आँतों, पाचन तंत्र और उदर पर शासन करती है, जिससे चिड़चिड़ा आँत्र सिंड्रोम, खाद्य संवेदनशीलता और पाचन सूजन की प्रवृत्ति होती है। चिंतित स्वभाव अक्सर पेट की समस्याओं के रूप में प्रकट होता है। बुध का प्रभाव तंत्रिका तनाव बनाता है जो त्वचा समस्याओं का कारण बन सकता है। ये अक्सर स्वास्थ्य के प्रति इतने सचेत होते हैं कि हाइपोकॉन्ड्रिया तक पहुँच जाते हैं। ध्यान और माइंडफुलनेस उनके अति-सक्रिय विश्लेषणात्मक मन को शांत करने में अत्यंत लाभदायक है।'
    },
    relationships: {
      en: 'Virgo approaches relationships with the same careful analysis they apply to everything else — they observe, evaluate, and commit only when they are truly convinced. They are not cold, but cautious: their love is expressed through acts of service — fixing things, organizing your life, noticing what you need before you ask. Earth-water combinations are most compatible: Taurus and Capricorn share their practical approach, while Cancer and Scorpio provide the emotional depth that softens Virgo\'s analytical edges. Their biggest relationship challenge is criticism — they can be overly critical of their partner\'s flaws while simultaneously feeling they themselves are never good enough. They need a patient partner who understands that Virgo\'s suggestions come from love, not judgment. Physical affection may not come naturally, but once comfortable, they are deeply attentive and devoted partners.',
      hi: 'कन्या जातक रिश्तों में वही सावधान विश्लेषण लाते हैं — देखते हैं, मूल्यांकन करते हैं, और तभी प्रतिबद्ध होते हैं जब वास्तव में आश्वस्त हों। प्रेम सेवा के कार्यों से व्यक्त करते हैं — चीज़ें ठीक करना, जीवन व्यवस्थित करना। वृषभ और मकर व्यावहारिक दृष्टिकोण साझा करते हैं, जबकि कर्क और वृश्चिक भावनात्मक गहराई प्रदान करते हैं। सबसे बड़ी चुनौती आलोचना है — साथी की खामियों की अत्यधिक आलोचना करते हैं। एक धैर्यवान साथी चाहिए जो समझे कि कन्या के सुझाव प्रेम से आते हैं।'
    },
    strengths: {
      en: 'Analytical, meticulous, reliable, practical, diligent, health-conscious, modest, service-oriented, organized, problem-solver',
      hi: 'विश्लेषणात्मक, सूक्ष्मदर्शी, विश्वसनीय, व्यावहारिक, परिश्रमी, स्वास्थ्य-सजग, विनम्र, सेवा-उन्मुख, व्यवस्थित, समस्या-समाधक'
    },
    challenges: {
      en: 'Overcritical, anxious, perfectionist, overthinking, judgmental, workaholic, difficulty relaxing, obsessive about details',
      hi: 'अत्यधिक आलोचनात्मक, चिंतित, पूर्णतावादी, अत्यधिक सोचने वाले, निर्णयात्मक, कार्यव्यसनी, विश्राम में कठिनाई, विवरण के प्रति जुनूनी'
    },
    luckyNumbers: [5, 3, 2],
    luckyColors: {
      en: 'Green, Dark Green, Earthy Brown',
      hi: 'हरा, गहरा हरा, मिट्टी जैसा भूरा'
    },
    luckyGems: {
      en: 'Emerald (Panna)',
      hi: 'पन्ना'
    },
    compatibleRashis: [2, 10, 4, 8],
    faqs: [
      {
        question: { en: 'What planet rules Virgo (Kanya)?', hi: 'कन्या राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Mercury (Budh) rules Virgo, just as it rules Gemini — but its expression differs significantly. In Virgo, Mercury manifests its analytical, discriminating, and detail-oriented side rather than the communicative, social side seen in Gemini. Mercury is also exalted in Virgo at 15°, making it the most powerful Mercury placement in the zodiac.', hi: 'बुध (बुध) कन्या राशि का स्वामी है, जैसे मिथुन का भी — लेकिन अभिव्यक्ति काफी भिन्न है। कन्या में बुध अपने विश्लेषणात्मक, विवेकशील पक्ष को प्रकट करता है। बुध कन्या में 15° पर उच्च का होता है, जो इसे राशिचक्र का सबसे शक्तिशाली बुध स्थान बनाता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Virgo?', hi: 'कन्या राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Virgo contains Uttara Phalguni padas 2-4 (150°-160°), the complete Hasta nakshatra (160°-173°20\'), and Chitra padas 1-2 (173°20\'-180°). Hasta, ruled by the Moon, is known for skilled hands and healing ability — it literally means "the hand." Chitra, ruled by Mars, brings artistic skill and craftsmanship. These nakshatras combine to give Virgo its reputation for precision handwork.', hi: 'कन्या राशि में उत्तर फाल्गुनी पद 2-4, संपूर्ण हस्त नक्षत्र, और चित्रा पद 1-2 आते हैं। चंद्र-शासित हस्त कुशल हाथों और उपचार क्षमता के लिए जाना जाता है — इसका शाब्दिक अर्थ "हाथ" है। मंगल-शासित चित्रा कलात्मक कौशल और शिल्पकारिता लाती है।' }
      },
      {
        question: { en: 'How is Virgo different from Gemini if both are ruled by Mercury?', hi: 'अगर दोनों बुध शासित हैं तो कन्या मिथुन से कैसे अलग है?' },
        answer: { en: 'While both are Mercury-ruled, they express Mercury\'s energy through different elements and modalities. Gemini (mutable air) uses Mercury for communication, social networking, and information exchange — it is Mercury\'s outward, verbal expression. Virgo (mutable earth) uses Mercury for analysis, organization, and practical problem-solving — it is Mercury\'s inward, methodical expression. Think of it as Mercury the messenger (Gemini) versus Mercury the accountant (Virgo).', hi: 'दोनों बुध-शासित हैं, लेकिन अलग-अलग तत्वों से बुध की ऊर्जा व्यक्त करते हैं। मिथुन (द्विस्वभाव वायु) बुध को संवाद और सूचना आदान-प्रदान के लिए उपयोग करता है — बुध की बाहरी अभिव्यक्ति। कन्या (द्विस्वभाव पृथ्वी) विश्लेषण, संगठन और व्यावहारिक समस्या-समाधान के लिए — बुध की आंतरिक, व्यवस्थित अभिव्यक्ति।' }
      }
    ]
  },

  // ─── 7. TULA (Libra) ────────────────────────────────────────────
  {
    id: 7,
    personality: {
      en: 'Libra, the seventh sign of the zodiac, is ruled by Venus — but here Venus expresses its refined aesthetic judgment and social harmony rather than the sensual indulgence seen in Taurus. As a cardinal air sign, Libra natives are the diplomats, aesthetes, and relationship architects of the zodiac. The scales symbolize their defining trait: an innate drive toward balance, fairness, and equilibrium in all things. Venus bestows upon them exceptional taste, social grace, charm, and a genuine need for partnership that goes beyond mere desire for company to a philosophical conviction that truth emerges from the union of opposites. Libra individuals think in terms of relationships — between people, between ideas, between colors, between notes of music. Their cardinal modality makes them active seekers of balance rather than passive acceptors of whatever comes. They initiate harmony, sometimes by confronting injustice directly, other times through subtle diplomatic maneuvering. Their minds naturally weigh both sides of every issue, which produces both their legendary fairness and their notorious indecisiveness. They are often physically attractive and possess a natural elegance that transcends fashion. At their best, Libra natives create beauty, justice, and meaningful connection wherever they go — they are the civilization-builders of the zodiac, believing that how we treat each other matters more than individual achievement.',
      hi: 'तुला राशि, राशिचक्र की सातवीं राशि, शुक्र द्वारा शासित है — लेकिन यहाँ शुक्र परिष्कृत सौंदर्य निर्णय और सामाजिक सामंजस्य व्यक्त करता है। चर वायु राशि होने के कारण तुला जातक राशिचक्र के राजनयिक, सौंदर्यप्रेमी और रिश्ते निर्माता हैं। तराजू उनकी परिभाषित विशेषता का प्रतीक है — संतुलन, निष्पक्षता और समता की सहज प्रवृत्ति। शुक्र उन्हें असाधारण रुचि, सामाजिक शिष्टता, आकर्षण और साझेदारी की वास्तविक आवश्यकता प्रदान करता है। ये जातक रिश्तों के संदर्भ में सोचते हैं — लोगों, विचारों, रंगों, संगीत के बीच। उनका मन स्वाभाविक रूप से हर मुद्दे के दोनों पक्षों को तौलता है, जो उनकी प्रसिद्ध निष्पक्षता और कुख्यात अनिर्णय दोनों उत्पन्न करता है।'
    },
    career: {
      en: 'Venus-ruled Libra excels in careers requiring aesthetic judgment, mediation, and interpersonal finesse. Law and justice are primary domains — they make outstanding judges, mediators, arbitrators, and human rights lawyers. Diplomacy, international relations, and United Nations work align perfectly with their peacemaking nature. Fashion design, art curation, interior decoration, and beauty consulting leverage their refined Venus taste. They thrive in partnership-based businesses and consulting roles where building relationships is key. Public relations, event planning, and wedding coordination suit their social skills and eye for beauty. Libra natives also excel in counseling and couple\'s therapy, naturally understanding relational dynamics. They struggle in aggressive, confrontational roles or solitary work requiring no collaboration — they need people and harmony to function at their best.',
      hi: 'शुक्र-शासित तुला जातक सौंदर्य निर्णय, मध्यस्थता और पारस्परिक कुशलता वाले करियर में उत्कृष्ट होते हैं। कानून और न्याय प्राथमिक क्षेत्र हैं — उत्कृष्ट न्यायाधीश, मध्यस्थ और मानवाधिकार वकील बनते हैं। कूटनीति और अंतरराष्ट्रीय संबंध उनके शांतिदूत स्वभाव के अनुकूल। फैशन डिज़ाइन, कला संग्रहण, इंटीरियर सजावट में शुक्र की परिष्कृत रुचि काम आती है। साझेदारी आधारित व्यवसायों और परामर्श भूमिकाओं में सफल। आक्रामक या एकांत भूमिकाओं में संघर्ष करते हैं।'
    },
    health: {
      en: 'Libra governs the kidneys, lower back, and adrenal glands, making natives susceptible to kidney stones, urinary tract infections, lower back pain, and adrenal fatigue. Their desire for harmony can lead to chronic stress when their environment is discordant — they absorb others\' tensions into their own body. Venus influence creates a tendency toward sugar cravings and overindulgence in rich foods, affecting kidney function over time. Libra natives often neglect self-care while focusing on others\' needs. They benefit from exercises that strengthen the lower back and core — Pilates and targeted yoga sequences are excellent. Adequate water intake is critical for kidney health. They should learn to set boundaries to protect their adrenals from the exhaustion of constant people-pleasing. Regular kidney function tests and maintaining acid-alkaline balance in diet are advisable.',
      hi: 'तुला राशि गुर्दों, पीठ के निचले हिस्से और अधिवृक्क ग्रंथियों पर शासन करती है, जिससे गुर्दे की पथरी, मूत्र पथ संक्रमण, कमर दर्द और अधिवृक्क थकान की संभावना रहती है। सामंजस्य की चाह के कारण विवादपूर्ण वातावरण में पुराना तनाव हो सकता है। शुक्र मीठे और समृद्ध भोजन की लालसा बनाता है। पिलाटीज़ और योग पीठ के निचले हिस्से को मजबूत करने के लिए उत्कृष्ट हैं। पर्याप्त जल सेवन गुर्दों के लिए महत्वपूर्ण है। सीमाएँ तय करना सीखना चाहिए।'
    },
    relationships: {
      en: 'Libra is the sign of partnership itself — the 7th house of the natural zodiac. They are incomplete without a significant relationship and invest enormous energy in creating harmonious unions. Air-fire combinations bring out their best: Gemini and Aquarius stimulate them intellectually, while Aries and Leo provide the decisive energy and passion that balances Libra\'s contemplative nature. Libra lovers are romantic, attentive, and deeply committed to making their partner feel valued. Their greatest challenge is conflict avoidance — they may suppress their own needs to maintain peace, building resentment that eventually erupts. They can also be perceived as superficial, prioritizing appearance and social standing in a partner. The ideal partner for Libra is someone who encourages honest communication, makes decisions confidently, and appreciates beauty without being enslaved by it.',
      hi: 'तुला स्वयं साझेदारी की राशि है — प्राकृतिक राशिचक्र का 7वाँ भाव। एक महत्वपूर्ण रिश्ते के बिना अपूर्ण महसूस करते हैं। मिथुन और कुम्भ बौद्धिक उत्तेजना देते हैं, जबकि मेष और सिंह निर्णायक ऊर्जा और जोश प्रदान करते हैं। रोमांटिक, ध्यानशील और साथी को मूल्यवान महसूस कराने के लिए समर्पित। सबसे बड़ी चुनौती संघर्ष से बचना है — शांति बनाए रखने के लिए अपनी ज़रूरतें दबा सकते हैं।'
    },
    strengths: {
      en: 'Diplomatic, fair-minded, gracious, aesthetic, cooperative, idealistic, romantic, charming, socially skilled, peace-loving',
      hi: 'कूटनीतिक, निष्पक्ष, शिष्ट, सौंदर्यप्रेमी, सहयोगी, आदर्शवादी, रोमांटिक, आकर्षक, सामाजिक रूप से कुशल, शांतिप्रिय'
    },
    challenges: {
      en: 'Indecisive, people-pleasing, conflict-avoidant, superficial, codependent, easily influenced, passive-aggressive, vain',
      hi: 'अनिर्णायक, लोगों को खुश करने वाले, संघर्ष-विरोधी, सतही, सह-निर्भर, आसानी से प्रभावित, निष्क्रिय-आक्रामक, दिखावटी'
    },
    luckyNumbers: [6, 5, 9],
    luckyColors: {
      en: 'White, Pastel Blue, Light Pink',
      hi: 'सफ़ेद, हल्का नीला, हल्का गुलाबी'
    },
    luckyGems: {
      en: 'Diamond (Heera) or White Sapphire',
      hi: 'हीरा या श्वेत पुखराज'
    },
    compatibleRashis: [3, 11, 5, 9],
    faqs: [
      {
        question: { en: 'What planet rules Libra (Tula)?', hi: 'तुला राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Venus (Shukra) rules Libra, just as it rules Taurus — but with different emphasis. In Libra, Venus expresses its social, aesthetic, and justice-oriented qualities rather than the material and sensual side dominant in Taurus. Saturn is exalted in Libra at 20°, emphasizing justice, fairness, and structured social contracts.', hi: 'शुक्र (शुक्र) तुला राशि का स्वामी है, जैसे वृषभ का भी — लेकिन भिन्न ज़ोर के साथ। तुला में शुक्र अपने सामाजिक, सौंदर्यात्मक और न्याय-उन्मुख गुणों को व्यक्त करता है। शनि तुला में 20° पर उच्च का होता है, जो न्याय और निष्पक्षता पर बल देता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Libra?', hi: 'तुला राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Libra contains Chitra padas 3-4 (180°-186°40\'), the complete Swati nakshatra (186°40\'-200°), and Vishakha padas 1-3 (200°-210°). Swati, ruled by Rahu, is the most characteristic Libra nakshatra — independent, self-propelled like the wind, and skilled in commerce and diplomacy. Vishakha, ruled by Jupiter, brings determination and goal-oriented focus that counterbalances Libra\'s indecisiveness.', hi: 'तुला राशि में चित्रा पद 3-4, संपूर्ण स्वाति नक्षत्र, और विशाखा पद 1-3 आते हैं। राहु-शासित स्वाति सबसे विशेषता वाला तुला नक्षत्र है — स्वतंत्र, वायु की तरह स्व-प्रेरित, व्यापार और कूटनीति में कुशल। गुरु-शासित विशाखा दृढ़ संकल्प लाती है।' }
      },
      {
        question: { en: 'Why are Libras so indecisive?', hi: 'तुला जातक इतने अनिर्णायक क्यों होते हैं?' },
        answer: { en: 'Libra\'s indecisiveness stems from their core nature of weighing both sides equally. The scales symbol represents their mind — constantly seeking perfect balance. When both options have genuine merit, choosing one feels like an injustice to the other. Additionally, as a Venus-ruled air sign, they are acutely aware of how decisions affect others, adding another layer of consideration. This quality makes them excellent judges and mediators but frustrating decision-makers in daily life.', hi: 'तुला की अनिर्णयता उनके दोनों पक्षों को समान रूप से तौलने के मूल स्वभाव से आती है। तराजू उनके मन का प्रतीक है — निरंतर पूर्ण संतुलन की खोज। जब दोनों विकल्पों में वास्तविक गुण हों, तो एक चुनना दूसरे के साथ अन्याय लगता है। शुक्र-शासित वायु राशि के रूप में, वे तीव्रता से जानते हैं कि निर्णय दूसरों को कैसे प्रभावित करते हैं।' }
      }
    ]
  },

  // ─── 8. VRISHCHIK (Scorpio) ─────────────────────────────────────
  {
    id: 8,
    personality: {
      en: 'Scorpio, the eighth sign of the zodiac, is ruled by Mars — but here Mars operates beneath the surface, channeling its energy into psychological depth, investigation, and transformation rather than outward physical action. As a fixed water sign, Scorpio natives possess the most emotionally intense and psychologically penetrating nature in the zodiac. The scorpion symbolizes their capacity for both self-defense and self-destruction: when cornered, they can strike with devastating precision, but they are equally capable of the self-inflicted sting of obsessive brooding. Mars gives them exceptional willpower, strategic thinking, and an ability to endure suffering that would break other signs. Scorpio individuals see past surfaces — they are natural detectives who sense hidden motives, unspoken truths, and the psychological undercurrents that drive human behavior. Their fixed water nature creates emotional depth comparable to the ocean: calm on the surface but containing immense pressure and mysterious life in its depths. They experience everything intensely — love, hatred, loyalty, betrayal — and are incapable of superficiality. Privacy is sacred to them; they reveal themselves only to those who have earned their trust through time and trial. The transformative power of Scorpio is their greatest gift: like the phoenix from their alternative symbolism, they can die metaphorically and be reborn, turning their deepest wounds into their greatest wisdom. At their evolved best, Scorpio natives are healers, researchers, and truth-seekers who illuminate what others fear to examine.',
      hi: 'वृश्चिक राशि, राशिचक्र की आठवीं राशि, मंगल द्वारा शासित है — लेकिन यहाँ मंगल सतह के नीचे संचालित होता है, अपनी ऊर्जा को मनोवैज्ञानिक गहराई और परिवर्तन में बदलता है। स्थिर जल राशि होने के कारण वृश्चिक जातक राशिचक्र में सबसे भावनात्मक रूप से तीव्र और मनोवैज्ञानिक रूप से भेदक स्वभाव रखते हैं। बिच्छू उनकी आत्मरक्षा और आत्मविनाश दोनों की क्षमता का प्रतीक है। मंगल उन्हें असाधारण इच्छाशक्ति, रणनीतिक सोच और कष्ट सहने की क्षमता प्रदान करता है। ये सतह के पार देखते हैं — छिपे उद्देश्यों और अनकहे सत्यों को भाँप लेते हैं। गोपनीयता उनके लिए पवित्र है। वृश्चिक की परिवर्तनकारी शक्ति उनका सबसे बड़ा उपहार है — फीनिक्स की तरह, वे अपने गहरे घावों को अपनी सबसे बड़ी बुद्धि में बदल सकते हैं।'
    },
    career: {
      en: 'Mars-ruled Scorpio excels in careers involving investigation, research, transformation, and power. They are outstanding surgeons, forensic scientists, criminal investigators, and psychotherapists — any role requiring deep penetration below surface appearances. Finance and investment banking attract them through the power dynamics of money. They thrive in intelligence agencies, cybersecurity, and espionage-related fields. Mining, geology, and archaeology appeal to their nature of uncovering what is hidden beneath. Scorpio natives make powerful crisis managers and turnaround specialists who thrive in situations others flee from. Occult sciences, depth psychology, and transformative healing modalities (Tantra, Pranic healing) align with their mystical side. They struggle in transparent, low-stakes environments — they need intensity, depth, and the feeling that their work genuinely matters.',
      hi: 'मंगल-शासित वृश्चिक जातक जाँच, शोध, परिवर्तन और शक्ति से जुड़े करियर में उत्कृष्ट होते हैं। उत्कृष्ट शल्य चिकित्सक, फॉरेंसिक वैज्ञानिक, अपराध अन्वेषक और मनोचिकित्सक बनते हैं। वित्त और निवेश बैंकिंग धन की शक्ति गतिशीलता से आकर्षित करती है। खुफिया एजेंसियाँ, साइबर सुरक्षा में सफल। खनन, भूविज्ञान और पुरातत्व उनकी छिपे को उजागर करने की प्रकृति के अनुकूल। संकट प्रबंधन में शक्तिशाली। गूढ़ विज्ञान और गहन मनोविज्ञान भी अनुकूल क्षेत्र हैं।'
    },
    health: {
      en: 'Scorpio rules the reproductive organs, excretory system, and pelvis, predisposing natives to urinary tract infections, reproductive disorders, hemorrhoids, and hormonal imbalances. Their intense emotional nature creates psychosomatic conditions — suppressed rage can manifest as autoimmune disorders, and unprocessed grief as chronic pelvic conditions. Mars influence brings susceptibility to infections, sexually transmitted diseases, and surgical needs. Scorpio natives tend toward extremes in health — either obsessively healthy or completely neglectful. They benefit from intense physical exercise that provides an outlet for their powerful emotional energy — martial arts, competitive swimming, and intense yoga practices. Emotional processing through therapy or journaling is critical, as they tend to internalize everything. Pelvic floor exercises and reproductive health screenings are especially important.',
      hi: 'वृश्चिक राशि प्रजनन अंगों, उत्सर्जन प्रणाली और श्रोणि पर शासन करती है, जिससे मूत्र पथ संक्रमण, प्रजनन विकार, बवासीर और हार्मोनल असंतुलन की संभावना रहती है। तीव्र भावनात्मक स्वभाव मनोदैहिक स्थितियाँ बनाता है — दबा हुआ क्रोध स्वप्रतिरक्षी विकार बन सकता है। मंगल संक्रमण की संवेदनशीलता लाता है। मार्शल आर्ट्स और तीव्र योग शक्तिशाली भावनात्मक ऊर्जा के लिए आउटलेट प्रदान करते हैं। चिकित्सा या जर्नलिंग द्वारा भावनात्मक प्रसंस्करण महत्वपूर्ण है।'
    },
    relationships: {
      en: 'Scorpio loves with an all-or-nothing intensity that can be both intoxicating and overwhelming. They seek soul-deep connection — casual dating holds no interest for them. Water-earth combinations provide the best foundation: Cancer and Pisces match their emotional depth, while Taurus and Virgo offer grounding stability that helps manage their intensity. Trust is the absolute foundation of any Scorpio relationship — betrayal is the one thing they cannot forgive. They are possessive and jealous by nature, demanding complete loyalty while guarding their own privacy fiercely. Their penetrating insight means they usually know if a partner is being dishonest before any evidence appears. Physical intimacy is deeply important to them — a spiritual experience rather than merely physical. The ideal Scorpio partner must be emotionally brave, completely honest, and comfortable with deep psychological intimacy.',
      hi: 'वृश्चिक सब-या-कुछ-नहीं तीव्रता से प्रेम करते हैं जो नशीला और भारी दोनों हो सकता है। आत्मा-गहरा जुड़ाव चाहते हैं — साधारण डेटिंग में रुचि नहीं। कर्क और मीन भावनात्मक गहराई से मेल खाते हैं, जबकि वृषभ और कन्या स्थिरता प्रदान करते हैं। विश्वास किसी भी वृश्चिक रिश्ते की पूर्ण नींव है — विश्वासघात वह चीज़ है जो वे माफ नहीं कर सकते। स्वभाव से अधिकारी और ईर्ष्यालु, पूर्ण वफादारी की माँग करते हैं। शारीरिक अंतरंगता गहरी रूप से महत्वपूर्ण है।'
    },
    strengths: {
      en: 'Resourceful, determined, brave, passionate, loyal, strategic, perceptive, transformative, resilient, psychologically deep',
      hi: 'संसाधनपूर्ण, दृढ़निश्चयी, बहादुर, भावुक, वफादार, रणनीतिक, सूक्ष्मदर्शी, परिवर्तनकारी, लचीले, मनोवैज्ञानिक रूप से गहरे'
    },
    challenges: {
      en: 'Jealous, secretive, vengeful, controlling, obsessive, mistrustful, manipulative, self-destructive tendencies',
      hi: 'ईर्ष्यालु, गोपनीय, प्रतिशोधी, नियंत्रणकारी, जुनूनी, अविश्वासी, चालाक, आत्मविनाशकारी प्रवृत्तियाँ'
    },
    luckyNumbers: [9, 1, 3],
    luckyColors: {
      en: 'Deep Red, Maroon, Black',
      hi: 'गहरा लाल, मैरून, काला'
    },
    luckyGems: {
      en: 'Red Coral (Moonga)',
      hi: 'लाल मूंगा (मूंगा)'
    },
    compatibleRashis: [4, 12, 6, 10],
    faqs: [
      {
        question: { en: 'What planet rules Scorpio (Vrishchik)?', hi: 'वृश्चिक राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Mars (Mangal) rules Scorpio in Vedic astrology. While Western astrology assigns Pluto as co-ruler, traditional Jyotish uses only visible planets. Mars in Scorpio operates very differently from Mars in Aries — here it is internalized, strategic, and psychologically focused rather than overtly aggressive. Ketu is also considered a co-significator, adding depth and mystical quality.', hi: 'वैदिक ज्योतिष में मंगल (मंगल) वृश्चिक राशि का स्वामी है। मेष में मंगल से बहुत अलग — यहाँ यह आंतरिक, रणनीतिक और मनोवैज्ञानिक रूप से केंद्रित है। केतु को सह-कारक माना जाता है, जो गहराई और रहस्यमय गुणवत्ता जोड़ता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Scorpio?', hi: 'वृश्चिक राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Scorpio contains Vishakha pada 4 (210°-213°20\'), the complete Anuradha nakshatra (213°20\'-226°40\'), and the complete Jyeshtha nakshatra (226°40\'-240°). Anuradha, ruled by Saturn, represents devotion and the ability to befriend others even in adversarial conditions. Jyeshtha, ruled by Mercury, means "the eldest" and carries authority, seniority, and protective power — it is associated with Indra, king of the gods.', hi: 'वृश्चिक राशि में विशाखा पद 4, संपूर्ण अनुराधा नक्षत्र, और संपूर्ण ज्येष्ठा नक्षत्र आते हैं। शनि-शासित अनुराधा भक्ति और प्रतिकूल परिस्थितियों में भी मित्रता की क्षमता का प्रतीक है। बुध-शासित ज्येष्ठा का अर्थ "सबसे बड़ा" है और अधिकार, वरिष्ठता और रक्षात्मक शक्ति वहन करती है।' }
      },
      {
        question: { en: 'Why is Scorpio associated with transformation and rebirth?', hi: 'वृश्चिक को परिवर्तन और पुनर्जन्म से क्यों जोड़ा जाता है?' },
        answer: { en: 'Scorpio rules the 8th house of the natural zodiac — the house of death, transformation, hidden wealth, and rebirth. In Vedic tradition, Scorpio has three evolutionary symbols: the scorpion (reactive, destructive), the eagle (rising above base instincts), and the phoenix (complete transformation through destruction and rebirth). This triple symbolism reflects the Scorpio journey from unconscious emotional reaction through conscious awareness to spiritual transcendence.', hi: 'वृश्चिक प्राकृतिक राशिचक्र के 8वें भाव पर शासन करती है — मृत्यु, परिवर्तन, छिपी संपत्ति और पुनर्जन्म का भाव। वैदिक परंपरा में वृश्चिक के तीन विकासवादी प्रतीक हैं: बिच्छू (प्रतिक्रियात्मक), गरुड़ (आधार वृत्तियों से ऊपर उठना), और फीनिक्स (विनाश और पुनर्जन्म द्वारा पूर्ण परिवर्तन)।' }
      }
    ]
  },

  // ─── 9. DHANU (Sagittarius) ─────────────────────────────────────
  {
    id: 9,
    personality: {
      en: 'Sagittarius, the ninth sign of the zodiac, is ruled by Jupiter — the great benefic, planet of wisdom, expansion, dharma, and higher learning. As a mutable fire sign, Sagittarius natives are the philosophers, adventurers, and truth-seekers of the zodiac, perpetually aiming their arrow toward distant horizons of knowledge and experience. The archer symbolizes their defining quality: a restless aspiration toward higher understanding that refuses to be confined by convention, borders, or limiting beliefs. Jupiter bestows upon them optimism that borders on the cosmic — a fundamental faith that life is meaningful, that truth exists and can be found, and that expansion is the natural state of the soul. Sagittarius individuals are characterized by an insatiable appetite for learning, traveling, and experiencing diverse cultures and philosophies. Their mutable fire quality gives them an enthusiastic adaptability: they burn with passion for their current pursuit but can redirect that fire instantly when a new horizon beckons. They are remarkably honest — sometimes to the point of tactlessness — believing that truth should never be softened or compromised. Their humor is broad, philosophical, and often self-deprecating. At their best, Sagittarius natives are inspiring teachers, visionary leaders, and cultural bridges who expand everyone\'s understanding of what is possible. Their greatest contribution is making others believe in something larger than themselves.',
      hi: 'धनु राशि, राशिचक्र की नौवीं राशि, बृहस्पति द्वारा शासित है — महान शुभ ग्रह, ज्ञान, विस्तार, धर्म और उच्च शिक्षा का ग्रह। द्विस्वभाव अग्नि राशि होने के कारण धनु जातक राशिचक्र के दार्शनिक, साहसी और सत्य-अन्वेषक हैं, निरंतर ज्ञान और अनुभव के दूर क्षितिजों की ओर अपना बाण साधते हुए। बृहस्पति उन्हें ब्रह्मांडीय आशावाद प्रदान करता है — एक मूलभूत विश्वास कि जीवन सार्थक है और सत्य मिल सकता है। ये जातक सीखने, यात्रा और विविध संस्कृतियों का अनुभव करने की अतृप्त भूख से विशेषता रखते हैं। अत्यधिक ईमानदार होते हैं — कभी-कभी बेतकल्लुफी तक। अपने सर्वश्रेष्ठ रूप में, प्रेरणादायक शिक्षक और सांस्कृतिक सेतु होते हैं।'
    },
    career: {
      en: 'Jupiter-ruled Sagittarius excels in careers involving wisdom, teaching, and cross-cultural exchange. Higher education — university professors, researchers, academic administrators — is a natural domain. Law, particularly constitutional law and jurisprudence, appeals to their sense of justice and philosophical reasoning. They thrive in religious and spiritual vocations: priests, gurus, motivational speakers, and spiritual counselors. Publishing, long-distance travel, import-export businesses, and foreign services align with Jupiter\'s expansive nature. Sagittarius natives make excellent sports coaches, outdoor adventure guides, and equestrian professionals. Philosophy, ethics consulting, and cultural anthropology leverage their broad-minded worldview. They struggle in micro-managed, detail-heavy environments — they need the big picture and freedom to explore.',
      hi: 'बृहस्पति-शासित धनु जातक ज्ञान, शिक्षण और अंतर-सांस्कृतिक आदान-प्रदान वाले करियर में उत्कृष्ट होते हैं। उच्च शिक्षा — विश्वविद्यालय प्रोफेसर, शोधकर्ता — स्वाभाविक क्षेत्र। कानून, विशेषकर संवैधानिक कानून में सफल। धार्मिक और आध्यात्मिक व्यवसायों में सफल — पुरोहित, गुरु, प्रेरक वक्ता। प्रकाशन, विदेशी व्यापार और विदेश सेवा बृहस्पति की विस्तारवादी प्रकृति के अनुकूल। खेल प्रशिक्षण और दर्शनशास्त्र भी उपयुक्त। सूक्ष्म प्रबंधन वाले वातावरण में संघर्ष करते हैं।'
    },
    health: {
      en: 'Sagittarius governs the thighs, hips, and liver, making natives prone to sciatica, hip joint issues, liver disorders, and weight gain particularly around the thighs and hips. Jupiter\'s expansive nature can manifest as excess — overeating, overdrinking, and overexertion that strains the liver. They are prone to sports injuries, particularly to the lower body, due to their physically active and risk-taking nature. Sagittarius natives tend to overestimate their physical capacity and push beyond safe limits. They benefit from activities that build lower body strength while maintaining flexibility — horseback riding, hiking, cycling, and yoga that targets the hip flexors. Liver-supporting herbs like turmeric and milk thistle are especially beneficial. Moderation is the key health lesson for Sagittarius — their Jupiter influence makes excess feel natural and even righteous.',
      hi: 'धनु राशि जाँघों, कूल्हों और यकृत पर शासन करती है, जिससे कटिस्नायुशूल, कूल्हे की समस्याएँ, यकृत विकार और जाँघ-कूल्हे के आसपास वजन बढ़ने की संभावना रहती है। बृहस्पति की विस्तारवादी प्रकृति अधिकता के रूप में प्रकट हो सकती है — अत्यधिक खाना, पीना। शारीरिक रूप से सक्रिय और जोखिम लेने वाले स्वभाव के कारण खेल चोटों की संभावना। हल्दी और मिल्क थिसल जैसी यकृत-सहायक जड़ी-बूटियाँ विशेष रूप से लाभदायक। संयम धनु के लिए प्रमुख स्वास्थ्य पाठ है।'
    },
    relationships: {
      en: 'Sagittarius approaches love as a grand adventure — they seek a partner who is a fellow explorer rather than an anchor. Freedom within relationship is non-negotiable; they will bolt from any situation that feels confining. Fire-air combinations bring out their best: Aries and Leo match their enthusiasm and energy, while Gemini and Libra offer intellectual partnership and social variety. Sagittarius lovers are generous, funny, and refreshingly honest — they will always tell you the truth, even when you don\'t want to hear it. Their biggest challenge is commitment phobia: the vast horizon always beckons, making it difficult to settle down. Long-distance relationships sometimes work better for them than constant proximity. They need a partner who has their own independent life, who can match their intellectual curiosity, and who doesn\'t take their occasional tactlessness personally.',
      hi: 'धनु प्रेम को एक भव्य साहस के रूप में देखते हैं — साथी को एक सह-अन्वेषक चाहिए, लंगर नहीं। रिश्ते में स्वतंत्रता अपरिहार्य है। मेष और सिंह उनके उत्साह से मेल खाते हैं, जबकि मिथुन और तुला बौद्धिक साझेदारी प्रदान करते हैं। उदार, मज़ेदार और ताज़गी देने वाले ईमानदार प्रेमी। सबसे बड़ी चुनौती प्रतिबद्धता-भय है। स्वतंत्र जीवन वाले साथी की आवश्यकता जो उनकी बौद्धिक जिज्ञासा से मेल खा सके।'
    },
    strengths: {
      en: 'Optimistic, philosophical, adventurous, honest, generous, broad-minded, enthusiastic, inspiring, humorous, visionary',
      hi: 'आशावादी, दार्शनिक, साहसी, ईमानदार, उदार, व्यापक दृष्टि वाले, उत्साही, प्रेरणादायक, विनोदी, दूरदर्शी'
    },
    challenges: {
      en: 'Tactless, commitment-phobic, preachy, reckless, overconfident, impatient with details, scattered, promises more than delivers',
      hi: 'बेतकल्लुफ, प्रतिबद्धता-भीरू, उपदेशी, लापरवाह, अति-आत्मविश्वासी, विवरण में अधीर, बिखरे, वादे से अधिक करते हैं'
    },
    luckyNumbers: [3, 5, 8],
    luckyColors: {
      en: 'Yellow, Golden, Orange',
      hi: 'पीला, सुनहरा, नारंगी'
    },
    luckyGems: {
      en: 'Yellow Sapphire (Pukhraj)',
      hi: 'पुखराज'
    },
    compatibleRashis: [1, 5, 3, 7],
    faqs: [
      {
        question: { en: 'What planet rules Sagittarius (Dhanu)?', hi: 'धनु राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Jupiter (Brihaspati/Guru) rules Sagittarius. Jupiter is the largest planet and the great benefic in Vedic astrology, governing wisdom, dharma, expansion, wealth, children, and spiritual teaching. In Sagittarius, Jupiter expresses its philosophical, adventurous, and teaching-oriented qualities — the outward expression of Jupiter\'s wisdom.', hi: 'बृहस्पति (गुरु) धनु राशि का स्वामी है। बृहस्पति सबसे बड़ा ग्रह और वैदिक ज्योतिष में महान शुभ ग्रह है, जो ज्ञान, धर्म, विस्तार, संपत्ति और आध्यात्मिक शिक्षण पर शासन करता है। धनु में बृहस्पति अपने दार्शनिक और शिक्षण-उन्मुख गुणों को व्यक्त करता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Sagittarius?', hi: 'धनु राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Sagittarius contains the complete Moola nakshatra (240°-253°20\'), the complete Purva Ashadha (253°20\'-266°40\'), and Uttara Ashadha pada 1 (266°40\'-270°). Moola, ruled by Ketu, represents the root — it strips away illusions to reach fundamental truth. Purva Ashadha, ruled by Venus, means "the invincible" and brings conviction and ability to inspire. Uttara Ashadha pada 1, ruled by the Sun, adds universal authority.', hi: 'धनु राशि में संपूर्ण मूल नक्षत्र, संपूर्ण पूर्वाषाढ़ा, और उत्तराषाढ़ा पद 1 आते हैं। केतु-शासित मूल "जड़" का प्रतीक है — भ्रम हटाकर मूलभूत सत्य तक पहुँचता है। शुक्र-शासित पूर्वाषाढ़ा का अर्थ "अजेय" है और विश्वास तथा प्रेरित करने की क्षमता लाती है।' }
      },
      {
        question: { en: 'What is the best gemstone for Sagittarius?', hi: 'धनु राशि के लिए सबसे अच्छा रत्न कौन सा है?' },
        answer: { en: 'Yellow Sapphire (Pukhraj) is the primary gemstone for Sagittarius, strengthening Jupiter\'s auspicious influence. It should be set in gold and worn on the index finger of the right hand on a Thursday during Shukla Paksha. Yellow Sapphire is believed to enhance wisdom, prosperity, marital harmony, and spiritual growth. Citrine and Yellow Topaz are more affordable Jupiter alternatives.', hi: 'पुखराज (पीला नीलम) धनु राशि का प्रमुख रत्न है जो बृहस्पति के शुभ प्रभाव को मजबूत करता है। इसे सोने में जड़वाकर दाहिने हाथ की तर्जनी में शुक्ल पक्ष के गुरुवार को पहनना चाहिए। सिट्रीन और पीला पुखराज किफायती विकल्प हैं।' }
      }
    ]
  },

  // ─── 10. MAKAR (Capricorn) ──────────────────────────────────────
  {
    id: 10,
    personality: {
      en: 'Capricorn, the tenth sign of the zodiac, is ruled by Saturn — the planet of discipline, time, karma, and enduring structure. As a cardinal earth sign, Capricorn natives are the master builders and strategists of the zodiac, constructing their ambitions with the patience of mountain goats ascending step by careful step to the summit. The sea-goat (makara) symbolizes their dual nature: practical and grounded like the goat, yet harboring hidden emotional and spiritual depths like the sea creature. Saturn bestows upon them an old soul quality — even young Capricorns carry a seriousness and sense of responsibility that seems beyond their years. They understand, perhaps more deeply than any other sign, that lasting achievement requires sustained effort, sacrifice, and the willingness to endure hardship. Their cardinal modality makes them ambitious initiators, but unlike Aries who charges ahead, Capricorn initiates with calculated strategy and contingency planning. They possess an extraordinary work ethic, often putting career and duty before personal comfort or pleasure. Time is their ally: Capricorn natives tend to age in reverse — burdened with responsibility in youth but becoming progressively lighter, wiser, and even more playful as they mature. At their best, they are the pillars of their families and communities — people of integrity who build institutions, businesses, and legacies that outlast them. Their humor is dry, sardonic, and often brilliantly observed.',
      hi: 'मकर राशि, राशिचक्र की दसवीं राशि, शनि द्वारा शासित है — अनुशासन, समय, कर्म और स्थायी संरचना का ग्रह। चर पृथ्वी राशि होने के कारण मकर जातक राशिचक्र के कुशल निर्माता और रणनीतिकार हैं, पहाड़ी बकरियों के धैर्य से कदम-दर-कदम शिखर की ओर बढ़ते हुए। शनि उन्हें पुरानी आत्मा का गुण प्रदान करता है — युवा मकर भी गंभीरता और जिम्मेदारी की भावना वहन करते हैं। वे समझते हैं कि स्थायी उपलब्धि के लिए निरंतर प्रयास, त्याग और कठिनाई सहने की तत्परता आवश्यक है। असाधारण कार्य नैतिकता रखते हैं। समय उनका सहयोगी है — मकर जातक उलटे बूढ़े होते हैं, युवावस्था में भारी लेकिन परिपक्वता के साथ हल्के और बुद्धिमान। अपने सर्वश्रेष्ठ रूप में, अपने परिवारों और समुदायों के स्तंभ होते हैं।'
    },
    career: {
      en: 'Saturn-ruled Capricorn excels in careers requiring structure, authority, and long-term strategic thinking. Corporate leadership, management consulting, and executive administration are natural fits — they climb organizational ladders with patient determination. Government service, bureaucracy, and civil engineering appeal to their sense of duty and structure-building. They thrive in banking, insurance, and traditional finance where conservative approaches are valued. Construction, architecture, and real estate development align with their builder instincts. Capricorn natives make excellent judges, administrators, and project managers who can handle complex, long-term initiatives. Agriculture and mining connect to their earth element. They are surprisingly effective in comedy — their dry, observational humor lands precisely because it\'s unexpected from such a serious exterior. They struggle in chaotic, unstructured environments without clear hierarchies or goals.',
      hi: 'शनि-शासित मकर जातक संरचना, अधिकार और दीर्घकालिक रणनीतिक सोच वाले करियर में उत्कृष्ट होते हैं। कॉर्पोरेट नेतृत्व, प्रबंधन परामर्श और कार्यकारी प्रशासन स्वाभाविक विकल्प हैं। सरकारी सेवा, नौकरशाही और सिविल इंजीनियरिंग कर्तव्य बोध के अनुकूल। बैंकिंग, बीमा और पारंपरिक वित्त में सफल। निर्माण, वास्तुकला और रियल एस्टेट विकास उनकी निर्माता प्रवृत्ति के अनुरूप। कृषि और खनन पृथ्वी तत्व से जुड़े हैं। अव्यवस्थित वातावरण में संघर्ष करते हैं।'
    },
    health: {
      en: 'Capricorn governs the knees, bones, joints, and skin, predisposing natives to arthritis, knee injuries, osteoporosis, dental problems, and chronic skin conditions like eczema. Saturn\'s influence brings a tendency toward chronic rather than acute conditions — problems that develop slowly and persist over time. Depression and melancholy are common, particularly in youth when Saturn\'s burdens feel heaviest. Capricorn natives tend to neglect their health while focused on work goals, only addressing problems when they become serious. They benefit from weight-bearing exercises that strengthen bones and joints — resistance training, walking, and gentle yoga. Calcium and vitamin D supplementation is especially important. Knee protection during physical activities and regular dental care are advisable. Mental health support should not be stigmatized — Capricorn needs to learn that seeking help is a sign of wisdom, not weakness.',
      hi: 'मकर राशि घुटनों, हड्डियों, जोड़ों और त्वचा पर शासन करती है, जिससे गठिया, घुटने की चोटें, ऑस्टियोपोरोसिस, दंत समस्याएँ और त्वचा रोगों की संभावना रहती है। शनि का प्रभाव तीव्र के बजाय पुरानी स्थितियों की प्रवृत्ति लाता है। अवसाद और उदासी आम है, विशेषकर युवावस्था में। कार्य लक्ष्यों पर ध्यान केंद्रित करते हुए स्वास्थ्य की उपेक्षा करते हैं। हड्डियों को मजबूत करने वाले व्यायाम — प्रतिरोध प्रशिक्षण, पैदल चलना लाभदायक। कैल्शियम और विटामिन डी विशेष रूप से महत्वपूर्ण।'
    },
    relationships: {
      en: 'Capricorn approaches relationships with the same calculated seriousness they bring to their career — they invest carefully, expect returns, and plan for the long term. They are not unromantic, but their love language is providing stability, financial security, and practical support rather than grand gestures. Earth-water combinations work best: Taurus and Virgo share their practical values and work ethic, while Cancer and Pisces provide the emotional warmth that softens Capricorn\'s sometimes rigid exterior. Their biggest relationship challenge is emotional unavailability — they can be so focused on achievement that their partner feels like an afterthought. Work-life balance is a lifelong lesson for Capricorn. They need a patient partner who understands that their reserved exterior hides genuine depth of feeling, and who doesn\'t mistake their stoicism for indifference.',
      hi: 'मकर रिश्तों में वही गणनात्मक गंभीरता लाते हैं जो करियर में — सावधानी से निवेश करते हैं और दीर्घकालिक योजना बनाते हैं। भव्य इशारों के बजाय स्थिरता, आर्थिक सुरक्षा और व्यावहारिक सहायता प्रदान करके प्रेम व्यक्त करते हैं। वृषभ और कन्या व्यावहारिक मूल्य साझा करते हैं, जबकि कर्क और मीन भावनात्मक गर्मी प्रदान करते हैं। सबसे बड़ी चुनौती भावनात्मक अनुपलब्धता — उपलब्धि पर इतना ध्यान कि साथी गौण महसूस करे। कार्य-जीवन संतुलन जीवन भर का पाठ है।'
    },
    strengths: {
      en: 'Disciplined, responsible, ambitious, patient, strategic, resourceful, traditional, loyal, dry humor, strong moral compass',
      hi: 'अनुशासित, जिम्मेदार, महत्वाकांक्षी, धैर्यवान, रणनीतिक, संसाधनपूर्ण, परंपरागत, वफादार, रूखा हास्य, मजबूत नैतिक दिशा'
    },
    challenges: {
      en: 'Rigid, pessimistic, workaholic, emotionally cold, status-conscious, unforgiving, condescending, fear of vulnerability',
      hi: 'कठोर, निराशावादी, कार्यव्यसनी, भावनात्मक रूप से ठंडे, प्रतिष्ठा-सजग, क्षमा न करने वाले, दयाहीन, भेद्यता का भय'
    },
    luckyNumbers: [8, 6, 4],
    luckyColors: {
      en: 'Black, Dark Blue, Brown',
      hi: 'काला, गहरा नीला, भूरा'
    },
    luckyGems: {
      en: 'Blue Sapphire (Neelam)',
      hi: 'नीलम'
    },
    compatibleRashis: [2, 6, 8, 12],
    faqs: [
      {
        question: { en: 'What planet rules Capricorn (Makar)?', hi: 'मकर राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Saturn (Shani) rules Capricorn. Saturn is the planet of discipline, karma, time, structure, and endurance. In Capricorn, Saturn expresses its organizational, ambitious, and authority-oriented qualities — the outward, worldly expression of Saturn\'s energy. Mars is exalted in Capricorn at 28°, combining disciplined action with strategic planning.', hi: 'शनि (शनि) मकर राशि का स्वामी है। शनि अनुशासन, कर्म, समय, संरचना और सहनशक्ति का ग्रह है। मकर में शनि अपने संगठनात्मक, महत्वाकांक्षी और अधिकार-उन्मुख गुणों को व्यक्त करता है। मंगल मकर में 28° पर उच्च का होता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Capricorn?', hi: 'मकर राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Capricorn contains Uttara Ashadha padas 2-4 (270°-280°), the complete Shravana nakshatra (280°-293°20\'), and Dhanishta padas 1-2 (293°20\'-300°). Shravana, ruled by the Moon, means "hearing" and is associated with learning through listening, knowledge, and connection. It is one of the most auspicious nakshatras for new beginnings. Dhanishta, ruled by Mars, brings rhythm, prosperity, and musical talent.', hi: 'मकर राशि में उत्तराषाढ़ा पद 2-4, संपूर्ण श्रवण नक्षत्र, और धनिष्ठा पद 1-2 आते हैं। चंद्र-शासित श्रवण का अर्थ "सुनना" है और सीखने, ज्ञान और जुड़ाव से जुड़ा है। मंगल-शासित धनिष्ठा लय, समृद्धि और संगीत प्रतिभा लाती है।' }
      },
      {
        question: { en: 'Why do Capricorns seem to get younger with age?', hi: 'मकर जातक उम्र के साथ जवान क्यों लगते हैं?' },
        answer: { en: 'This phenomenon is called "Saturn\'s reverse aging" in Vedic astrology. Saturn burdens Capricorn natives with heavy responsibilities in youth — they often become caregivers, breadwinners, or mature beyond their years early in life. However, as they fulfill Saturn\'s karmic demands and achieve their goals, the weight gradually lifts. By middle age, having built their foundation, they can finally relax, play, and enjoy life. Their first Saturn Return (around age 29-30) often marks a significant turning point toward greater ease and lightness.', hi: 'इस घटना को वैदिक ज्योतिष में "शनि की उलटी आयु" कहा जाता है। शनि मकर जातकों को युवावस्था में भारी जिम्मेदारियों से बोझिल करता है। हालाँकि, जैसे-जैसे वे शनि की कार्मिक माँगों को पूरा करते हैं, बोझ धीरे-धीरे हल्का होता है। मध्य आयु तक, नींव बना लेने के बाद, अंततः आराम और जीवन का आनंद ले सकते हैं। पहला शनि वापसी (लगभग 29-30 वर्ष) अक्सर एक महत्वपूर्ण मोड़ होता है।' }
      }
    ]
  },

  // ─── 11. KUMBH (Aquarius) ───────────────────────────────────────
  {
    id: 11,
    personality: {
      en: 'Aquarius, the eleventh sign of the zodiac, is ruled by Saturn — but here Saturn expresses its revolutionary, reformist, and humanitarian qualities rather than the traditional conservatism seen in Capricorn. As a fixed air sign, Aquarius natives are the visionaries, innovators, and social reformers of the zodiac, applying intellectual fixity to ideas about how society should function. The water-bearer symbolizes their role: not drinking the water themselves but pouring it out for humanity — distributing knowledge, innovation, and progress to all. Saturn in Aquarius channels discipline and structure into the service of collective welfare rather than personal ambition. Aquarius individuals think in systems, networks, and large-scale patterns — they see humanity as a whole rather than focusing on individuals. Their fixed air quality gives them intellectual stubbornness: once they form an opinion based on their analysis, changing it requires overwhelming evidence. They are paradoxically both the most social and the most detached sign — they care deeply about humanity in the abstract but can seem aloof in personal interactions. Their minds work differently from the mainstream, often arriving at conclusions that seem bizarre initially but prove visionary in retrospect. Innovation, technology, and progressive social causes are their natural domains. At their best, Aquarius natives are ahead of their time — inventors, reformers, and humanitarians whose ideas shape future societies.',
      hi: 'कुम्भ राशि, राशिचक्र की ग्यारहवीं राशि, शनि द्वारा शासित है — लेकिन यहाँ शनि क्रांतिकारी, सुधारवादी और मानवतावादी गुण व्यक्त करता है। स्थिर वायु राशि होने के कारण कुम्भ जातक राशिचक्र के दूरदर्शी, नवप्रवर्तक और सामाजिक सुधारक हैं। कलशवाहक उनकी भूमिका का प्रतीक है — स्वयं जल नहीं पीना बल्कि मानवता के लिए उंडेलना। कुम्भ जातक प्रणालियों, नेटवर्कों और बड़े पैमाने के प्रतिमानों में सोचते हैं। विरोधाभासी रूप से सबसे सामाजिक और सबसे विलग राशि — अमूर्त रूप से मानवता की गहरी चिंता लेकिन व्यक्तिगत बातचीत में अलग-थलग। उनके दिमाग मुख्यधारा से अलग काम करते हैं। अपने सर्वश्रेष्ठ रूप में, अपने समय से आगे — आविष्कारक और मानवतावादी जिनके विचार भविष्य की समाजों को आकार देते हैं।'
    },
    career: {
      en: 'Saturn-ruled Aquarius thrives in careers involving technology, innovation, and social change. Software engineering, data science, artificial intelligence, and emerging technology development are natural fits for their systematic, future-oriented thinking. Social work, NGO leadership, human rights advocacy, and community organizing align with their humanitarian instincts. Scientific research, particularly in physics, astronomy, and aerospace engineering, appeals to their fascination with systems and the cosmos. They make excellent network builders, union organizers, and cooperative founders. Aquarius natives excel in unconventional roles that don\'t yet have established career paths — they are the people who invent new job categories. Broadcasting, telecommunications, and internet-based businesses leverage their connection to networks and information distribution. They struggle in rigid hierarchies and traditional corporate cultures that value conformity over innovation.',
      hi: 'शनि-शासित कुम्भ जातक प्रौद्योगिकी, नवाचार और सामाजिक परिवर्तन वाले करियर में सफल होते हैं। सॉफ्टवेयर इंजीनियरिंग, डेटा विज्ञान, कृत्रिम बुद्धिमत्ता स्वाभाविक विकल्प हैं। सामाजिक कार्य, एनजीओ नेतृत्व, मानवाधिकार वकालत उनकी मानवतावादी प्रवृत्ति के अनुकूल। वैज्ञानिक शोध, विशेषकर भौतिकी और अंतरिक्ष विज्ञान में सफल। प्रसारण, दूरसंचार और इंटरनेट-आधारित व्यवसाय नेटवर्क से जुड़ाव का लाभ उठाते हैं। कठोर पदानुक्रमों और अनुरूपता वाली संस्कृतियों में संघर्ष करते हैं।'
    },
    health: {
      en: 'Aquarius governs the ankles, calves, and circulatory system, making natives prone to ankle sprains, varicose veins, poor circulation, and blood pressure irregularities. Saturn\'s influence manifests as chronic conditions affecting the lower legs and circulatory health. Their tendency to live in their heads means they often neglect physical exercise entirely, leading to overall deconditioning. Aquarius natives can develop unusual or hard-to-diagnose conditions due to their unique constitution. They benefit from regular cardiovascular exercise that promotes circulation — walking, cycling, and swimming. Ankle-strengthening exercises and compression garments help prevent common lower leg issues. They should avoid prolonged sitting or standing in one position. Electrolyte balance and adequate hydration support their circulatory system. Mental health awareness is important — their detached nature can mask depression or anxiety that they intellectualize rather than feel.',
      hi: 'कुम्भ राशि टखनों, पिंडलियों और रक्त संचार प्रणाली पर शासन करती है, जिससे टखने की मोच, वैरिकाज़ नसें, खराब रक्त संचार और रक्तचाप अनियमितताओं की संभावना रहती है। शनि का प्रभाव निचले पैरों को प्रभावित करने वाली पुरानी स्थितियों के रूप में प्रकट होता है। अपने दिमाग में जीने की प्रवृत्ति से शारीरिक व्यायाम की उपेक्षा हो सकती है। नियमित हृदय-वाहिकीय व्यायाम जो रक्त संचार बढ़ाए — पैदल चलना, साइकिलिंग, तैराकी लाभदायक। पर्याप्त जलयोजन महत्वपूर्ण। मानसिक स्वास्थ्य जागरूकता भी महत्वपूर्ण है।'
    },
    relationships: {
      en: 'Aquarius approaches relationships as intellectual partnerships first and emotional bonds second. They seek a partner who is a friend, equal, and fellow thinker — conventional romance often feels artificial to them. Air-fire combinations stimulate their best qualities: Gemini and Libra match their intellectual nature, while Aries and Sagittarius bring passionate energy that warms their cool detachment. Aquarius lovers are loyal, stimulating, and genuinely accepting of their partner\'s individuality — they never try to change someone. Their biggest challenge is emotional intimacy: they can discuss feelings analytically but struggle to simply feel them with another person. They need significant space and independence, and partners who are emotionally needy will find Aquarius frustratingly unavailable. The ideal partner respects their need for freedom, engages them intellectually, and gently encourages emotional vulnerability without pressuring it.',
      hi: 'कुम्भ रिश्तों को पहले बौद्धिक साझेदारी और फिर भावनात्मक बंधन के रूप में देखते हैं। मित्र, समान और सह-विचारक साथी चाहते हैं। मिथुन और तुला बौद्धिक स्वभाव से मेल खाते हैं, जबकि मेष और धनु जोशीली ऊर्जा लाते हैं। वफादार और साथी की व्यक्तित्व को वास्तव में स्वीकार करने वाले। सबसे बड़ी चुनौती भावनात्मक अंतरंगता — भावनाओं का विश्लेषण कर सकते हैं लेकिन उन्हें महसूस करने में कठिनाई। महत्वपूर्ण स्थान और स्वतंत्रता चाहिए।'
    },
    strengths: {
      en: 'Innovative, humanitarian, intellectual, independent, progressive, original, loyal to causes, objective, visionary, egalitarian',
      hi: 'नवप्रवर्तक, मानवतावादी, बौद्धिक, स्वतंत्र, प्रगतिशील, मौलिक, उद्देश्यों के प्रति वफादार, वस्तुनिष्ठ, दूरदर्शी, समतावादी'
    },
    challenges: {
      en: 'Emotionally detached, rebellious for its own sake, contrarian, aloof, unpredictable, stubborn about ideas, cold in personal interactions',
      hi: 'भावनात्मक रूप से विलग, बिना कारण विद्रोही, विरोधाभासी, अलग-थलग, अप्रत्याशित, विचारों में जिद्दी, व्यक्तिगत बातचीत में ठंडे'
    },
    luckyNumbers: [8, 4, 7],
    luckyColors: {
      en: 'Electric Blue, Dark Blue, Grey',
      hi: 'विद्युत नीला, गहरा नीला, धूसर'
    },
    luckyGems: {
      en: 'Blue Sapphire (Neelam)',
      hi: 'नीलम'
    },
    compatibleRashis: [3, 7, 1, 9],
    faqs: [
      {
        question: { en: 'What planet rules Aquarius (Kumbh)?', hi: 'कुम्भ राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Saturn (Shani) rules Aquarius in Vedic astrology. While Western astrology assigns Uranus, traditional Jyotish uses Saturn as the sole ruler. Saturn in Aquarius expresses its reformist, humanitarian, and systematic qualities — the collective-oriented expression of Saturn\'s energy, in contrast to Capricorn\'s more personal ambition. Rahu is considered a co-significator, adding unconventionality and innovation.', hi: 'वैदिक ज्योतिष में शनि (शनि) कुम्भ राशि का स्वामी है। मकर की व्यक्तिगत महत्वाकांक्षा के विपरीत, कुम्भ में शनि अपने सुधारवादी, मानवतावादी और व्यवस्थित गुणों को व्यक्त करता है। राहु को सह-कारक माना जाता है, जो अपरंपरागतता और नवाचार जोड़ता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Aquarius?', hi: 'कुम्भ राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Aquarius contains Dhanishta padas 3-4 (300°-306°40\'), the complete Shatabhisha nakshatra (306°40\'-320°), and Purva Bhadrapada padas 1-3 (320°-330°). Shatabhisha, ruled by Rahu, means "hundred healers" and is associated with healing, secrecy, and aquatic environments. Purva Bhadrapada, ruled by Jupiter, carries intense transformative energy and is associated with fire and purification rituals.', hi: 'कुम्भ राशि में धनिष्ठा पद 3-4, संपूर्ण शतभिषा नक्षत्र, और पूर्व भाद्रपद पद 1-3 आते हैं। राहु-शासित शतभिषा का अर्थ "सौ चिकित्सक" है और उपचार, गोपनीयता और जलीय वातावरण से जुड़ा है। गुरु-शासित पूर्व भाद्रपद तीव्र परिवर्तनकारी ऊर्जा वहन करती है।' }
      },
      {
        question: { en: 'How is Aquarius different from Capricorn if both are ruled by Saturn?', hi: 'अगर दोनों शनि शासित हैं तो कुम्भ मकर से कैसे अलग है?' },
        answer: { en: 'Though both are Saturn-ruled, they express Saturn through different elements and modalities. Capricorn (cardinal earth) uses Saturn for personal ambition, career building, and establishing tangible structures in the material world. Aquarius (fixed air) uses Saturn for social reform, collective welfare, and building intellectual/ideological systems. Capricorn builds businesses; Aquarius builds movements. Capricorn respects tradition; Aquarius challenges it. Capricorn is the establishment; Aquarius is the revolution.', hi: 'दोनों शनि-शासित हैं, लेकिन अलग तत्वों से शनि की ऊर्जा व्यक्त करते हैं। मकर (चर पृथ्वी) शनि का उपयोग व्यक्तिगत महत्वाकांक्षा और भौतिक संरचनाएँ स्थापित करने के लिए करता है। कुम्भ (स्थिर वायु) सामाजिक सुधार और सामूहिक कल्याण के लिए। मकर व्यवसाय बनाता है; कुम्भ आंदोलन। मकर परंपरा का सम्मान करता है; कुम्भ उसे चुनौती देता है।' }
      }
    ]
  },

  // ─── 12. MEEN (Pisces) ──────────────────────────────────────────
  {
    id: 12,
    personality: {
      en: 'Pisces, the twelfth and final sign of the zodiac, is ruled by Jupiter — but here Jupiter expresses its spiritual, transcendent, and compassionate qualities rather than the philosophical expansion seen in Sagittarius. As a mutable water sign, Pisces natives are the mystics, dreamers, and empaths of the zodiac, dissolving the boundaries between self and other, between reality and imagination, between the material and the divine. The two fish swimming in opposite directions symbolize their perpetual tension between the spiritual and the mundane, between engagement and withdrawal. Jupiter bestows upon them vast emotional and spiritual capacity, boundless compassion, and an intuitive connection to the collective unconscious that makes them natural artists, healers, and spiritual practitioners. Pisces individuals absorb the emotions and energies of everyone around them like psychic sponges — a gift that enables extraordinary empathy but can also lead to emotional overwhelm and confusion about whose feelings they are actually experiencing. Their mutable water quality makes them the most adaptable sign — they can flow around any obstacle, fill any container, and connect with any type of person. At their best, Pisces natives are channels for divine creativity and unconditional love — the artists who move us to tears, the healers who sense what medicine cannot diagnose, and the spiritual teachers who remind us of our connection to something greater than ourselves. Their greatest challenge is maintaining boundaries and a firm sense of identity in a world whose suffering they feel so acutely.',
      hi: 'मीन राशि, राशिचक्र की बारहवीं और अंतिम राशि, बृहस्पति द्वारा शासित है — लेकिन यहाँ बृहस्पति अपने आध्यात्मिक, अलौकिक और करुणामय गुणों को व्यक्त करता है। द्विस्वभाव जल राशि होने के कारण मीन जातक राशिचक्र के रहस्यवादी, स्वप्नदर्शी और सहानुभूतिशील हैं, जो स्वयं और अन्य, वास्तविकता और कल्पना, भौतिक और दिव्य के बीच सीमाओं को विलीन करते हैं। विपरीत दिशाओं में तैरती दो मछलियाँ आध्यात्मिक और सांसारिक के बीच उनके निरंतर तनाव का प्रतीक हैं। बृहस्पति उन्हें विशाल भावनात्मक और आध्यात्मिक क्षमता, असीम करुणा और सामूहिक अचेतन से सहज जुड़ाव प्रदान करता है। मीन जातक मनोवैज्ञानिक स्पंज की तरह सबकी भावनाएँ अवशोषित करते हैं। अपने सर्वश्रेष्ठ रूप में, दिव्य रचनात्मकता और बिना शर्त प्रेम के माध्यम होते हैं। उनकी सबसे बड़ी चुनौती सीमाएँ बनाए रखना और पहचान की दृढ़ भावना बनाना है।'
    },
    career: {
      en: 'Jupiter-ruled Pisces excels in careers involving compassion, creativity, and spiritual service. They are natural healers — outstanding doctors, therapists, hospice workers, and alternative medicine practitioners. The arts are a primary domain: music, poetry, painting, filmmaking, photography, and dance all allow them to channel their rich inner world into tangible expression. Spiritual vocations — priests, meditation teachers, astrologers, and counselors — align with their transcendent nature. They thrive in charitable organizations, humanitarian aid, and social welfare. Marine biology, oceanography, and anything connected to water resonates with their elemental nature. Pisces natives make intuitive researchers who arrive at conclusions through insight rather than linear analysis. They also excel in pharmaceuticals, anesthesiology, and chemistry. They struggle in highly competitive, aggressive business environments that value ruthlessness over empathy — they need to feel their work serves a higher purpose.',
      hi: 'बृहस्पति-शासित मीन जातक करुणा, रचनात्मकता और आध्यात्मिक सेवा वाले करियर में उत्कृष्ट होते हैं। स्वाभाविक चिकित्सक — उत्कृष्ट डॉक्टर, चिकित्सक और वैकल्पिक चिकित्सा प्रैक्टिशनर। कला प्राथमिक क्षेत्र — संगीत, काव्य, चित्रकला, फिल्म निर्माण, नृत्य। आध्यात्मिक व्यवसाय — पुजारी, ध्यान शिक्षक, ज्योतिषी। धर्मार्थ संगठनों और मानवीय सहायता में सफल। समुद्री जीवविज्ञान और जल से जुड़ी हर चीज़ अनुकूल। औषधि विज्ञान और रसायन विज्ञान में भी उत्कृष्ट। आक्रामक व्यावसायिक वातावरण में संघर्ष करते हैं।'
    },
    health: {
      en: 'Pisces rules the feet, lymphatic system, and the body\'s fluid balance, making natives prone to foot problems (flat feet, bunions, plantar fasciitis), lymphatic congestion, edema, and immune system irregularities. Their absorptive nature makes them unusually sensitive to medications, alcohol, and environmental toxins — they often require lower doses and react strongly to substances that barely affect others. Jupiter\'s influence can manifest as fluid retention and weight gain, particularly in the lower body. Pisces natives are prone to escapism through substances, making addiction a genuine risk. Their immune system can be inconsistent — strong at times, mysteriously weak at others. They benefit from gentle exercises in or near water — swimming, aqua aerobics, and beach walks. Lymphatic drainage massage and dry brushing support their sluggish lymphatic system. Foot care is essential: quality footwear, regular foot massage, and reflexology. Adequate sleep is more important for Pisces than any other sign.',
      hi: 'मीन राशि पैरों, लसीका तंत्र और शरीर के तरल संतुलन पर शासन करती है, जिससे पैरों की समस्याएँ, लसीका जमाव, सूजन और प्रतिरक्षा प्रणाली अनियमितताओं की संभावना रहती है। अवशोषक प्रकृति के कारण दवाओं, शराब और पर्यावरणीय विषाक्त पदार्थों के प्रति असामान्य रूप से संवेदनशील। पदार्थों के माध्यम से पलायनवाद की प्रवृत्ति, जो व्यसन का जोखिम बनाती है। जल में या उसके निकट कोमल व्यायाम लाभदायक — तैराकी, जल व्यायाम। पैरों की देखभाल आवश्यक। पर्याप्त नींद मीन के लिए किसी भी अन्य राशि से अधिक महत्वपूर्ण है।'
    },
    relationships: {
      en: 'Pisces loves with oceanic depth and selfless devotion — they idealize their partner and willingly sacrifice their own needs for the relationship. They seek a soul-deep, almost telepathic connection that transcends ordinary communication. Water-earth combinations provide the best foundation: Cancer and Scorpio match their emotional intensity and understand the language of feelings, while Taurus and Capricorn provide the practical grounding and structure Pisces needs to function in the material world. Pisces lovers are incredibly romantic, intuitive about their partner\'s needs, and emotionally generous. Their biggest challenge is losing themselves in relationships — they can become so enmeshed with their partner that they forget their own identity, needs, and boundaries. They are also prone to staying in unhealthy relationships too long, making excuses for bad behavior because they can always see the potential in people. The ideal partner is someone who is emotionally strong, grounded, and appreciates Pisces\' sensitivity without exploiting it.',
      hi: 'मीन समुद्र जैसी गहराई और निःस्वार्थ समर्पण से प्रेम करते हैं — अपने साथी को आदर्श बनाते हैं और रिश्ते के लिए स्वेच्छा से अपनी ज़रूरतों का त्याग करते हैं। कर्क और वृश्चिक उनकी भावनात्मक तीव्रता से मेल खाते हैं, जबकि वृषभ और मकर व्यावहारिक आधार प्रदान करते हैं। अविश्वसनीय रूप से रोमांटिक और साथी की ज़रूरतों के प्रति सहज। सबसे बड़ी चुनौती रिश्तों में खुद को खो देना — अपनी पहचान, ज़रूरतें और सीमाएँ भूल जाते हैं। अस्वस्थ रिश्तों में भी बहुत लंबे समय तक रहने की प्रवृत्ति।'
    },
    strengths: {
      en: 'Compassionate, intuitive, artistic, selfless, imaginative, spiritually attuned, gentle, wise, empathic, adaptable',
      hi: 'करुणामय, अंतर्ज्ञानी, कलात्मक, निःस्वार्थ, कल्पनाशील, आध्यात्मिक रूप से अभ्यस्त, कोमल, बुद्धिमान, सहानुभूतिशील, अनुकूलनशील'
    },
    challenges: {
      en: 'Escapist, overly trusting, victim mentality, boundary-less, addictive tendencies, impractical, easily overwhelmed, martyrdom complex',
      hi: 'पलायनवादी, अत्यधिक भरोसेमंद, पीड़ित मानसिकता, सीमा-रहित, व्यसनी प्रवृत्तियाँ, अव्यावहारिक, आसानी से अभिभूत, बलिदान परिसर'
    },
    luckyNumbers: [3, 7, 12],
    luckyColors: {
      en: 'Sea Green, Yellow, Lavender',
      hi: 'समुद्री हरा, पीला, लैवेंडर'
    },
    luckyGems: {
      en: 'Yellow Sapphire (Pukhraj)',
      hi: 'पुखराज'
    },
    compatibleRashis: [4, 8, 6, 10],
    faqs: [
      {
        question: { en: 'What planet rules Pisces (Meen)?', hi: 'मीन राशि का स्वामी ग्रह कौन है?' },
        answer: { en: 'Jupiter (Brihaspati/Guru) rules Pisces in Vedic astrology. While Western astrology assigns Neptune, traditional Jyotish recognizes Jupiter as the sole ruler. In Pisces, Jupiter expresses its spiritual, compassionate, and transcendent qualities — the inward, mystical expression of Jupiter\'s wisdom, in contrast to Sagittarius\' outward philosophical exploration. Venus is exalted in Pisces at 27°, combining divine love with spiritual wisdom.', hi: 'वैदिक ज्योतिष में बृहस्पति (गुरु) मीन राशि का स्वामी है। मीन में बृहस्पति अपने आध्यात्मिक, करुणामय और अलौकिक गुणों को व्यक्त करता है — धनु के बाहरी दार्शनिक अन्वेषण के विपरीत बृहस्पति की आंतरिक, रहस्यमय अभिव्यक्ति। शुक्र मीन में 27° पर उच्च का होता है।' }
      },
      {
        question: { en: 'Which nakshatras fall in Pisces?', hi: 'मीन राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Pisces contains Purva Bhadrapada pada 4 (330°-333°20\'), the complete Uttara Bhadrapada nakshatra (333°20\'-346°40\'), and the complete Revati nakshatra (346°40\'-360°). Uttara Bhadrapada, ruled by Saturn, represents deep wisdom, restraint, and the ability to see through illusion. Revati, ruled by Mercury, is the final nakshatra of the zodiac — associated with safe journeys, nourishment, and the completion of cosmic cycles. It is considered the most gentle and protective nakshatra.', hi: 'मीन राशि में पूर्व भाद्रपद पद 4, संपूर्ण उत्तर भाद्रपद नक्षत्र, और संपूर्ण रेवती नक्षत्र आते हैं। शनि-शासित उत्तर भाद्रपद गहन ज्ञान और भ्रम को भेदने की क्षमता का प्रतिनिधित्व करती है। बुध-शासित रेवती राशिचक्र का अंतिम नक्षत्र है — सुरक्षित यात्राओं, पोषण और ब्रह्मांडीय चक्रों के पूर्ण होने से जुड़ा। इसे सबसे कोमल और रक्षात्मक नक्षत्र माना जाता है।' }
      },
      {
        question: { en: 'Why is Pisces considered the most spiritual sign?', hi: 'मीन को सबसे आध्यात्मिक राशि क्यों माना जाता है?' },
        answer: { en: 'Pisces occupies the 12th house of the natural zodiac — the house of moksha (liberation), the subconscious, and dissolution of the ego. As the final sign, it represents the culmination of the soul\'s journey through all 12 signs, carrying the wisdom and karmic residue of every preceding sign. Jupiter\'s rulership adds spiritual wisdom, while the water element provides the emotional and intuitive faculties necessary for transcendent experience. Venus\'s exaltation here suggests that the highest form of love — unconditional, divine bhakti — finds its fullest expression in Pisces.', hi: 'मीन प्राकृतिक राशिचक्र के 12वें भाव पर अधिकार रखती है — मोक्ष, अवचेतन और अहंकार के विलय का भाव। अंतिम राशि के रूप में, यह सभी 12 राशियों से गुज़रते हुए आत्मा की यात्रा की पराकाष्ठा का प्रतिनिधित्व करती है। बृहस्पति का शासन आध्यात्मिक ज्ञान जोड़ता है, जबकि जल तत्व अलौकिक अनुभव के लिए भावनात्मक और अंतर्ज्ञानी क्षमताएँ प्रदान करता है। शुक्र का यहाँ उच्च होना सुझाव देता है कि प्रेम का सर्वोच्च रूप — बिना शर्त, दिव्य भक्ति — मीन में अपनी पूर्णतम अभिव्यक्ति पाता है।' }
      }
    ]
  },
];

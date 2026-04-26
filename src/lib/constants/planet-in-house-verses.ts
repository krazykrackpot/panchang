/**
 * Planet-in-House Verse Mapping
 *
 * 84 entries (7 classical planets x 12 houses) with classical verse paraphrases,
 * modern interpretations, source citations, and keywords.
 *
 * Sources: BPHS (Brihat Parashara Hora Shastra) Ch.24 and
 * Phaladeepika by Mantreshwara Ch.6-8.
 *
 * Verse text is a SHORT paraphrase (not the full shloka).
 * Interpretation is a modern, practical reading (2-3 sentences).
 */

import type { LocaleText } from '@/types/panchang';

export interface PlanetHouseVerse {
  planetId: number; // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
  house: number; // 1-12
  source: string; // e.g., "BPHS Ch.24, Shloka 3"
  verse: LocaleText; // Classical verse paraphrase (en + hi)
  interpretation: LocaleText; // Modern interpretation (en + hi)
  keywords: string[]; // 3-5 actionable words
}

export const PLANET_HOUSE_VERSES: PlanetHouseVerse[] = [
  // ──────────────────────────────────────────────
  // SUN (id: 0) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 0,
    house: 1,
    source: 'BPHS Ch.24, Shloka 1-2',
    verse: {
      en: 'The native born with the Sun in the ascendant will have sparse hair, a bilious constitution, and a strong but lean body. He will be valorous, given to anger, and of a lordly disposition.',
      hi: 'लग्न में सूर्य होने पर जातक के बाल विरल होते हैं, पित्त प्रकृति, बलवान किन्तु दुबला शरीर होता है। वह वीर, क्रोधी और स्वामी स्वभाव का होता है।',
    },
    interpretation: {
      en: 'A powerful sense of self and natural leadership ability. You command attention and respect, though others may find you dominating. Government connections or authority roles suit you well.',
      hi: 'आत्मविश्वास और नेतृत्व क्षमता प्रबल होती है। आप ध्यान और सम्मान आकर्षित करते हैं, यद्यपि लोग आपको प्रभावशाली पा सकते हैं। सरकारी या अधिकार के पद अनुकूल हैं।',
    },
    keywords: ['leadership', 'authority', 'self-confidence', 'government'],
  },
  {
    planetId: 0,
    house: 2,
    source: 'BPHS Ch.24, Shloka 3-4',
    verse: {
      en: 'With the Sun in the second house, the native will be devoid of learning, shameless, will stammer, and be without wealth. The face may bear marks or blemishes.',
      hi: 'द्वितीय भाव में सूर्य होने पर जातक विद्या से वंचित, निर्लज्ज, हकलाने वाला और धनहीन होता है। मुख पर चिह्न या दाग हो सकते हैं।',
    },
    interpretation: {
      en: 'Speech can be blunt and authoritative rather than diplomatic. Wealth comes through authority or government service, but family finances may fluctuate. Eye or dental issues need attention.',
      hi: 'वाणी कूटनीतिक के बजाय स्पष्ट और आधिकारिक होती है। धन सरकारी सेवा से आता है, परन्तु पारिवारिक वित्त में उतार-चढ़ाव रहता है। नेत्र या दन्त समस्याओं पर ध्यान दें।',
    },
    keywords: ['wealth', 'speech', 'family', 'harsh-words'],
  },
  {
    planetId: 0,
    house: 3,
    source: 'BPHS Ch.24, Shloka 5-6',
    verse: {
      en: 'The Sun in the third house makes the native valorous, strong, victorious over enemies, wealthy, and blessed with good siblings. Intelligence and physical strength are notable.',
      hi: 'तृतीय भाव में सूर्य जातक को वीर, बलवान, शत्रुओं पर विजयी, धनवान और अच्छे भाई-बहनों वाला बनाता है। बुद्धि और शारीरिक बल उल्लेखनीय होते हैं।',
    },
    interpretation: {
      en: 'Courageous initiative and strong willpower drive your efforts. Siblings may be influential or in positions of authority. Short travels and bold communication bring success.',
      hi: 'साहसिक पहल और दृढ़ इच्छाशक्ति आपके प्रयासों को आगे बढ़ाती है। भाई-बहन प्रभावशाली या अधिकार के पदों पर हो सकते हैं। लघु यात्राएं और निर्भीक संवाद सफलता लाते हैं।',
    },
    keywords: ['courage', 'siblings', 'adventure', 'willpower'],
  },
  {
    planetId: 0,
    house: 4,
    source: 'BPHS Ch.24, Shloka 7-8',
    verse: {
      en: 'The Sun in the fourth house deprives the native of happiness from relatives, friends, home, and conveyances. The mind is troubled and landed property may be lacking.',
      hi: 'चतुर्थ भाव में सूर्य जातक को बंधुओं, मित्रों, घर और वाहनों के सुख से वंचित करता है। मन अशांत रहता है और भूमि सम्पत्ति कम हो सकती है।',
    },
    interpretation: {
      en: 'Domestic life is restless; you may live away from your birthplace. Relations with the mother or authority figures at home can be strained. Government land or property through official channels is possible.',
      hi: 'घरेलू जीवन अशांत रहता है; आप जन्मस्थान से दूर रह सकते हैं। माता या घर के अधिकारी व्यक्तियों से संबंध तनावपूर्ण हो सकते हैं। सरकारी भूमि या आधिकारिक माध्यम से संपत्ति संभव है।',
    },
    keywords: ['domestic-life', 'property', 'mother', 'restlessness'],
  },
  {
    planetId: 0,
    house: 5,
    source: 'BPHS Ch.24, Shloka 9-10',
    verse: {
      en: 'With the Sun in the fifth, the native will be bereft of happiness and progeny, short-lived yet intelligent, given to wandering, and inclined toward mantras and spiritual practices.',
      hi: 'पंचम भाव में सूर्य से जातक सुख और संतान से वंचित, अल्पायु किन्तु बुद्धिमान, भ्रमणशील और मंत्र-साधना में रुचि रखने वाला होता है।',
    },
    interpretation: {
      en: 'Sharp intellect and political acumen, with a flair for speculation and creative pursuits. Children may be few but distinguished. Interest in governance, education, or spiritual scholarship.',
      hi: 'तीक्ष्ण बुद्धि और राजनीतिक कौशल, सट्टा और रचनात्मक कार्यों में रुचि। संतान कम किन्तु विशिष्ट हो सकती है। शासन, शिक्षा या आध्यात्मिक विद्वत्ता में रुचि।',
    },
    keywords: ['intelligence', 'politics', 'children', 'creativity'],
  },
  {
    planetId: 0,
    house: 6,
    source: 'BPHS Ch.24, Shloka 11-12',
    verse: {
      en: 'The Sun in the sixth house makes the native famous, a destroyer of enemies, powerful, wealthy, with a good digestive fire, and victorious in competition.',
      hi: 'षष्ठ भाव में सूर्य जातक को प्रसिद्ध, शत्रु विनाशक, शक्तिशाली, धनवान, अच्छी जठराग्नि वाला और प्रतियोगिता में विजयी बनाता है।',
    },
    interpretation: {
      en: 'Excellent placement for overcoming adversaries and health challenges. You excel in competitive environments, litigation, and service-oriented careers. Enemies are decisively defeated.',
      hi: 'शत्रुओं और स्वास्थ्य चुनौतियों पर विजय के लिए उत्कृष्ट स्थिति। आप प्रतिस्पर्धी वातावरण, मुकदमेबाजी और सेवा-उन्मुख करियर में उत्कृष्ट हैं। शत्रु निर्णायक रूप से पराजित होते हैं।',
    },
    keywords: ['enemies', 'victory', 'health', 'competition'],
  },
  {
    planetId: 0,
    house: 7,
    source: 'BPHS Ch.24, Shloka 13-14',
    verse: {
      en: 'The Sun in the seventh brings humiliation from women or government, purposeless wandering, disease, and deprivation of marital happiness. The spouse may be afflicted.',
      hi: 'सप्तम भाव में सूर्य स्त्रियों या सरकार से अपमान, निरुद्देश्य भटकना, रोग और वैवाहिक सुख का अभाव देता है। पत्नी पीड़ित हो सकती है।',
    },
    interpretation: {
      en: 'Marriage tends to be delayed or involves a partner with a strong, independent personality. Business partnerships require careful negotiation. A dominant spouse or partner in authority is common.',
      hi: 'विवाह में विलम्ब या स्वतंत्र व्यक्तित्व वाले साथी से होता है। व्यापारिक साझेदारी में सावधानीपूर्वक वार्ता आवश्यक है। प्रभावशाली पत्नी या अधिकार में साथी सामान्य है।',
    },
    keywords: ['marriage', 'partnerships', 'spouse', 'dominance'],
  },
  {
    planetId: 0,
    house: 8,
    source: 'BPHS Ch.24, Shloka 15-16',
    verse: {
      en: 'The Sun in the eighth gives few children, impaired eyesight, and a short life. Separation from close ones, loss of wealth, and interest in occult knowledge are indicated.',
      hi: 'अष्टम भाव में सूर्य कम संतान, दृष्टि दोष और अल्पायु देता है। प्रियजनों से वियोग, धन हानि और गूढ़ ज्ञान में रुचि दर्शाता है।',
    },
    interpretation: {
      en: 'Transformative life experiences shape your personality. Inheritance matters may be complex. Interest in research, occult sciences, or investigation. Health requires attention, especially eyes and bones.',
      hi: 'परिवर्तनकारी जीवन अनुभव आपके व्यक्तित्व को आकार देते हैं। उत्तराधिकार के मामले जटिल हो सकते हैं। शोध, गूढ़ विज्ञान या जांच में रुचि। स्वास्थ्य, विशेषकर नेत्र और हड्डियों पर ध्यान दें।',
    },
    keywords: ['transformation', 'inheritance', 'occult', 'health'],
  },
  {
    planetId: 0,
    house: 9,
    source: 'BPHS Ch.24, Shloka 17-18',
    verse: {
      en: 'The Sun in the ninth endows the native with children and wealth, devotion to God, charity, and knowledge of sacred texts. Relations with the father may be strained.',
      hi: 'नवम भाव में सूर्य जातक को संतान और धन, ईश्वर भक्ति, दान और शास्त्र ज्ञान प्रदान करता है। पिता से संबंध तनावपूर्ण हो सकते हैं।',
    },
    interpretation: {
      en: 'Strong dharmic inclinations and philosophical depth. You may become a guiding figure or mentor. Father may be prominent but distant. Pilgrimages and higher learning bring fulfillment.',
      hi: 'प्रबल धार्मिक प्रवृत्ति और दार्शनिक गहराई। आप मार्गदर्शक या गुरु बन सकते हैं। पिता प्रतिष्ठित किन्तु दूर हो सकते हैं। तीर्थयात्रा और उच्च शिक्षा संतुष्टि लाती है।',
    },
    keywords: ['dharma', 'father', 'pilgrimage', 'higher-learning'],
  },
  {
    planetId: 0,
    house: 10,
    source: 'BPHS Ch.24, Shloka 19-20',
    verse: {
      en: 'The Sun in the tenth blesses the native with paternal happiness, fame, intelligence, strength, and charity. He will be a king or equal to a king.',
      hi: 'दशम भाव में सूर्य जातक को पैतृक सुख, यश, बुद्धि, बल और दान की भावना से आशीर्वादित करता है। वह राजा या राजा के समान होगा।',
    },
    interpretation: {
      en: 'One of the strongest placements for career and public recognition. Authority positions, government roles, and leadership come naturally. Fame through professional excellence is strongly indicated.',
      hi: 'करियर और सार्वजनिक मान्यता के लिए सबसे शक्तिशाली स्थितियों में से एक। अधिकार के पद, सरकारी भूमिकाएं और नेतृत्व स्वाभाविक रूप से आते हैं। व्यावसायिक उत्कृष्टता से यश दृढ़ता से संकेतित है।',
    },
    keywords: ['career', 'fame', 'authority', 'government', 'leadership'],
  },
  {
    planetId: 0,
    house: 11,
    source: 'BPHS Ch.24, Shloka 21-22',
    verse: {
      en: 'The Sun in the eleventh house makes the native wealthy, long-lived, happy, with many servants, and possessed of conveyances. Gains from authority come easily.',
      hi: 'एकादश भाव में सूर्य जातक को धनवान, दीर्घायु, सुखी, अनेक सेवकों वाला और वाहनयुक्त बनाता है। अधिकार से लाभ सहज प्राप्त होते हैं।',
    },
    interpretation: {
      en: 'Substantial income and gains through influential connections. Friendships with people in power benefit you greatly. Ambitions are realized through networking and social influence.',
      hi: 'प्रभावशाली संबंधों के माध्यम से पर्याप्त आय और लाभ। शक्तिशाली लोगों से मित्रता आपको बहुत लाभ पहुंचाती है। नेटवर्किंग और सामाजिक प्रभाव से महत्वाकांक्षाएं पूर्ण होती हैं।',
    },
    keywords: ['wealth', 'gains', 'influential-friends', 'ambition'],
  },
  {
    planetId: 0,
    house: 12,
    source: 'BPHS Ch.24, Shloka 23-24',
    verse: {
      en: 'The Sun in the twelfth makes the native inimical toward the father, causes eye ailments, poverty, lack of sons, and residence in foreign lands. Spiritual inclinations may develop.',
      hi: 'द्वादश भाव में सूर्य जातक को पिता से शत्रुता, नेत्र रोग, दरिद्रता, पुत्र अभाव और विदेश वास देता है। आध्यात्मिक प्रवृत्तियां विकसित हो सकती हैं।',
    },
    interpretation: {
      en: 'Expenditure may exceed income, and self-identity is explored through solitude or foreign living. Eye health requires care. Spiritual practice and charitable work bring inner peace.',
      hi: 'व्यय आय से अधिक हो सकता है, और आत्मपहचान एकांत या विदेश में रहकर खोजी जाती है। नेत्र स्वास्थ्य पर ध्यान दें। आध्यात्मिक साधना और दानकार्य आंतरिक शांति लाते हैं।',
    },
    keywords: ['foreign-travel', 'spirituality', 'expenditure', 'eyes'],
  },

  // ──────────────────────────────────────────────
  // MOON (id: 1) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 1,
    house: 1,
    source: 'BPHS Ch.24, Shloka 25-26',
    verse: {
      en: 'The native with the Moon in the ascendant will be beautiful, soft-hearted, with an attractive personality, valorous, and fond of the opposite gender. A bright Moon gives wealth and fame.',
      hi: 'लग्न में चन्द्रमा होने पर जातक सुंदर, कोमल हृदय, आकर्षक व्यक्तित्व वाला, वीर और विपरीत लिंग का प्रेमी होता है। शुक्ल चन्द्र धन और यश देता है।',
    },
    interpretation: {
      en: 'Emotionally sensitive and nurturing, with a magnetic personal charm. Your moods strongly influence your actions. A waxing Moon here is especially favourable for public appeal and popularity.',
      hi: 'भावनात्मक रूप से संवेदनशील और पोषक, आकर्षक व्यक्तिगत आभा के साथ। आपका मनोभाव आपके कार्यों को प्रबलता से प्रभावित करता है। शुक्ल चन्द्र यहां जनप्रियता के लिए विशेष अनुकूल है।',
    },
    keywords: ['charm', 'emotions', 'popularity', 'sensitivity'],
  },
  {
    planetId: 1,
    house: 2,
    source: 'BPHS Ch.24, Shloka 27-28',
    verse: {
      en: 'The Moon in the second house makes the native wealthy, a lover of good food, handsome of face, and learned. The family will be large and income will come from multiple sources.',
      hi: 'द्वितीय भाव में चन्द्रमा जातक को धनवान, सुभोजन प्रेमी, सुंदर मुखाकृति वाला और विद्वान बनाता है। परिवार बड़ा होगा और अनेक स्रोतों से आय होगी।',
    },
    interpretation: {
      en: 'Sweet, persuasive speech and a love of comfort. Family life is rich and nurturing. Wealth accumulates through food, hospitality, or public-facing roles. Emotional attachment to possessions.',
      hi: 'मधुर, प्रभावशाली वाणी और आराम का प्रेम। पारिवारिक जीवन समृद्ध और पोषक है। भोजन, आतिथ्य या जनसम्पर्क कार्यों से धन एकत्र होता है। सम्पत्ति से भावनात्मक लगाव।',
    },
    keywords: ['wealth', 'family', 'speech', 'comfort', 'food'],
  },
  {
    planetId: 1,
    house: 3,
    source: 'BPHS Ch.24, Shloka 29-30',
    verse: {
      en: 'The Moon in the third makes the native courageous, blessed with siblings, proud, with servants, and inclined toward virtuous deeds. Mental strength and short journeys are favoured.',
      hi: 'तृतीय भाव में चन्द्रमा जातक को साहसी, भाई-बहनों से भाग्यशाली, गर्वी, सेवकों वाला और सद्कर्मों की ओर प्रवृत्त बनाता है। मानसिक बल और लघु यात्राएं अनुकूल हैं।',
    },
    interpretation: {
      en: 'Emotional courage and creative communication. Relationships with siblings are warm and supportive. Frequent short travels nourish the mind. Writing, media, and artistic expression are natural outlets.',
      hi: 'भावनात्मक साहस और रचनात्मक संवाद। भाई-बहनों से संबंध स्नेहपूर्ण और सहायक हैं। बार-बार की लघु यात्राएं मन को पोषित करती हैं। लेखन, मीडिया और कलात्मक अभिव्यक्ति स्वाभाविक माध्यम हैं।',
    },
    keywords: ['courage', 'siblings', 'communication', 'travel'],
  },
  {
    planetId: 1,
    house: 4,
    source: 'BPHS Ch.24, Shloka 31-32',
    verse: {
      en: 'The Moon in the fourth makes the native happy, possessing conveyances, houses, ornaments, and lands. Maternal happiness is indicated and the mind will be at ease.',
      hi: 'चतुर्थ भाव में चन्द्रमा जातक को सुखी, वाहन, गृह, आभूषण और भूमि का स्वामी बनाता है। मातृ सुख का संकेत है और मन शांत रहता है।',
    },
    interpretation: {
      en: 'Deep attachment to home, mother, and homeland. Emotional security comes from property and comfortable surroundings. An excellent placement for domestic happiness, vehicles, and real estate.',
      hi: 'घर, माता और मातृभूमि से गहरा लगाव। संपत्ति और आरामदायक वातावरण से भावनात्मक सुरक्षा मिलती है। घरेलू सुख, वाहन और अचल संपत्ति के लिए उत्कृष्ट स्थिति।',
    },
    keywords: ['home', 'mother', 'property', 'comfort', 'vehicles'],
  },
  {
    planetId: 1,
    house: 5,
    source: 'BPHS Ch.24, Shloka 33-34',
    verse: {
      en: 'The Moon in the fifth makes the native wise, fit for ministerial positions, sharp-witted, and blessed with good children. If afflicted, mental restlessness may result.',
      hi: 'पंचम भाव में चन्द्रमा जातक को बुद्धिमान, मंत्री पद के योग्य, तीक्ष्ण बुद्धि वाला और अच्छी संतान से आशीर्वादित बनाता है। पीड़ित होने पर मानसिक अशांति हो सकती है।',
    },
    interpretation: {
      en: 'Emotionally rich creative life and intuitive intelligence. Children bring joy. Romance is heartfelt and emotionally deep. Interest in arts, education, and spiritual practices.',
      hi: 'भावनात्मक रूप से समृद्ध रचनात्मक जीवन और सहज बुद्धि। संतान आनंद लाती है। प्रेम हार्दिक और भावनात्मक रूप से गहरा है। कला, शिक्षा और आध्यात्मिक साधना में रुचि।',
    },
    keywords: ['children', 'creativity', 'intelligence', 'romance'],
  },
  {
    planetId: 1,
    house: 6,
    source: 'BPHS Ch.24, Shloka 35-36',
    verse: {
      en: 'The Moon in the sixth makes the native short-lived, afflicted by stomach ailments, humiliated by enemies, and lazy. A waning Moon here worsens health concerns.',
      hi: 'षष्ठ भाव में चन्द्रमा जातक को अल्पायु, उदर रोग से पीड़ित, शत्रुओं द्वारा अपमानित और आलसी बनाता है। क्षीण चन्द्र यहां स्वास्थ्य चिंताएं बढ़ाता है।',
    },
    interpretation: {
      en: 'Emotional sensitivity to stress and workplace conflicts. Digestive health requires attention. Service to others and caregiving roles suit you, but set emotional boundaries to avoid burnout.',
      hi: 'तनाव और कार्यस्थल के संघर्षों के प्रति भावनात्मक संवेदनशीलता। पाचन स्वास्थ्य पर ध्यान दें। सेवा और देखभाल की भूमिकाएं उपयुक्त हैं, किन्तु थकान से बचने के लिए भावनात्मक सीमाएं निर्धारित करें।',
    },
    keywords: ['health', 'service', 'enemies', 'stress', 'digestion'],
  },
  {
    planetId: 1,
    house: 7,
    source: 'BPHS Ch.24, Shloka 37-38',
    verse: {
      en: 'The Moon in the seventh makes the native attractive, passionate, happy in marriage, and blessed with a beautiful spouse. Popularity in public dealings is indicated.',
      hi: 'सप्तम भाव में चन्द्रमा जातक को आकर्षक, कामुक, वैवाहिक सुख से युक्त और सुंदर पत्नी से भाग्यशाली बनाता है। सार्वजनिक व्यवहार में लोकप्रियता संकेतित है।',
    },
    interpretation: {
      en: 'Emotional fulfillment through partnerships and marriage. Your spouse is nurturing and attractive. Public relations and people-oriented business thrive. Emotional dependence on the partner is common.',
      hi: 'साझेदारी और विवाह से भावनात्मक पूर्णता। आपका जीवनसाथी पोषक और आकर्षक है। जनसम्पर्क और लोगोन्मुख व्यवसाय फलते-फूलते हैं। साथी पर भावनात्मक निर्भरता सामान्य है।',
    },
    keywords: ['marriage', 'spouse', 'partnership', 'public-relations'],
  },
  {
    planetId: 1,
    house: 8,
    source: 'BPHS Ch.24, Shloka 39-40',
    verse: {
      en: 'The Moon in the eighth makes the native sickly, short-lived, and prone to mental disturbances. If full and benefic-aspected, longevity improves and psychic abilities develop.',
      hi: 'अष्टम भाव में चन्द्रमा जातक को रोगी, अल्पायु और मानसिक विकारों के प्रति प्रवृत्त बनाता है। पूर्ण और शुभ दृष्टि होने पर दीर्घायु बढ़ती है और पारलौकिक क्षमताएं विकसित होती हैं।',
    },
    interpretation: {
      en: 'Deep emotional intensity and interest in the hidden side of life. Intuitive and psychic perceptions are strong. Inheritance through the mother or spouse is possible. Emotional turbulence transforms into wisdom over time.',
      hi: 'गहरी भावनात्मक तीव्रता और जीवन के गूढ़ पक्ष में रुचि। सहज और पारलौकिक धारणाएं प्रबल हैं। माता या पत्नी से उत्तराधिकार संभव है। भावनात्मक उथल-पुथल समय के साथ ज्ञान में रूपांतरित होती है।',
    },
    keywords: ['psychology', 'intuition', 'inheritance', 'transformation'],
  },
  {
    planetId: 1,
    house: 9,
    source: 'BPHS Ch.24, Shloka 41-42',
    verse: {
      en: 'The Moon in the ninth makes the native virtuous, eloquent, wealthy, devoted to God, and blessed with children. Righteous conduct and philosophical inclination are indicated.',
      hi: 'नवम भाव में चन्द्रमा जातक को गुणी, वाक्पटु, धनवान, ईश्वर भक्त और संतान से आशीर्वादित बनाता है। धर्मपरायण आचरण और दार्शनिक प्रवृत्ति संकेतित है।',
    },
    interpretation: {
      en: 'Emotionally connected to faith and philosophy. The mother or maternal figures inspire your dharmic path. Long journeys, especially over water, are fortunate. Teaching and mentoring come naturally.',
      hi: 'आस्था और दर्शन से भावनात्मक जुड़ाव। माता या मातृ स्वरूप आपके धार्मिक मार्ग को प्रेरित करते हैं। लम्बी यात्राएं, विशेषकर जल से, शुभ हैं। शिक्षण और मार्गदर्शन स्वाभाविक हैं।',
    },
    keywords: ['dharma', 'philosophy', 'mother', 'travel', 'teaching'],
  },
  {
    planetId: 1,
    house: 10,
    source: 'BPHS Ch.24, Shloka 43-44',
    verse: {
      en: 'The Moon in the tenth makes the native charitable, learned, wealthy, brave, and devoted to virtuous deeds. Success in public life and career prominence are indicated.',
      hi: 'दशम भाव में चन्द्रमा जातक को दानशील, विद्वान, धनवान, वीर और सत्कर्मों में लीन बनाता है। सार्वजनिक जीवन में सफलता और करियर में प्रमुखता संकेतित है।',
    },
    interpretation: {
      en: 'Public image and career are strongly influenced by emotional intelligence. Success in fields involving public contact, nurturing, or hospitality. The mother may influence your career path.',
      hi: 'सार्वजनिक छवि और करियर भावनात्मक बुद्धि से प्रबलता से प्रभावित हैं। जनसम्पर्क, पोषण या आतिथ्य के क्षेत्रों में सफलता। माता आपके करियर मार्ग को प्रभावित कर सकती हैं।',
    },
    keywords: ['career', 'public-image', 'nurturing', 'fame'],
  },
  {
    planetId: 1,
    house: 11,
    source: 'BPHS Ch.24, Shloka 45-46',
    verse: {
      en: 'The Moon in the eleventh makes the native wealthy, illustrious, long-lived, blessed with children, and surrounded by many friends. Gains through social connections come readily.',
      hi: 'एकादश भाव में चन्द्रमा जातक को धनवान, यशस्वी, दीर्घायु, संतान से भाग्यशाली और अनेक मित्रों से घिरा बनाता है। सामाजिक संबंधों से लाभ सहज मिलते हैं।',
    },
    interpretation: {
      en: 'Emotional fulfillment through friendships and community. Gains come through women, the public, and nurturing networks. Aspirations are realized with the support of a caring circle.',
      hi: 'मित्रता और समुदाय से भावनात्मक पूर्णता। स्त्रियों, जनता और पोषक संजाल से लाभ आता है। देखभाल करने वाले वृत्त के सहयोग से आकांक्षाएं पूर्ण होती हैं।',
    },
    keywords: ['gains', 'friends', 'community', 'aspirations'],
  },
  {
    planetId: 1,
    house: 12,
    source: 'BPHS Ch.24, Shloka 47-48',
    verse: {
      en: 'The Moon in the twelfth makes the native lazy, humiliated, with defective limbs, and inimical toward others. If well-aspected, foreign residence and spiritual development are possible.',
      hi: 'द्वादश भाव में चन्द्रमा जातक को आलसी, अपमानित, अंग दोष युक्त और दूसरों के प्रति शत्रुतापूर्ण बनाता है। शुभ दृष्टि होने पर विदेश निवास और आध्यात्मिक विकास संभव है।',
    },
    interpretation: {
      en: 'Rich inner emotional life and vivid dreams. Expenditure on comforts and emotional needs. Solitude and meditation bring peace. Foreign residence or hospital/ashram-related work is indicated.',
      hi: 'समृद्ध आंतरिक भावनात्मक जीवन और स्पष्ट स्वप्न। आराम और भावनात्मक आवश्यकताओं पर व्यय। एकांत और ध्यान शांति लाते हैं। विदेश निवास या चिकित्सालय/आश्रम संबंधित कार्य संकेतित है।',
    },
    keywords: ['solitude', 'dreams', 'foreign-residence', 'spirituality'],
  },

  // ──────────────────────────────────────────────
  // MARS (id: 2) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 2,
    house: 1,
    source: 'BPHS Ch.24, Shloka 49-50',
    verse: {
      en: 'Mars in the ascendant gives the native a wound or mark on the body, courage, a short life in some readings, and a cruel disposition. Valor and physical strength are notable.',
      hi: 'लग्न में मंगल जातक के शरीर पर घाव या चिह्न, साहस, कुछ पाठों में अल्पायु और क्रूर स्वभाव देता है। वीरता और शारीरिक बल उल्लेखनीय हैं।',
    },
    interpretation: {
      en: 'Fiery energy, athletic build, and a competitive spirit. You are a natural initiator who thrives on challenges. Scars or marks on the body are common. Temperament needs channelling into productive action.',
      hi: 'अग्नि ऊर्जा, खिलाड़ी शरीर और प्रतिस्पर्धी भावना। आप स्वाभाविक रूप से पहल करने वाले हैं जो चुनौतियों से उन्नति करते हैं। शरीर पर निशान सामान्य हैं। स्वभाव को उत्पादक कार्य में लगाना आवश्यक है।',
    },
    keywords: ['energy', 'courage', 'competition', 'physical-strength'],
  },
  {
    planetId: 2,
    house: 2,
    source: 'BPHS Ch.24, Shloka 51-52',
    verse: {
      en: 'Mars in the second house deprives the native of education and wealth, causes harsh speech, bad food, and an unpleasant face. Family discord is indicated.',
      hi: 'द्वितीय भाव में मंगल जातक को शिक्षा और धन से वंचित करता है, कठोर वाणी, खराब भोजन और अप्रिय मुखाकृति देता है। पारिवारिक कलह संकेतित है।',
    },
    interpretation: {
      en: 'Speech is direct and aggressive — arguments over money are likely. Earning through engineering, surgery, or military. Family finances are volatile. Dental or facial injuries possible.',
      hi: 'वाणी सीधी और आक्रामक है — धन पर विवाद संभव हैं। इंजीनियरिंग, शल्यचिकित्सा या सेना से कमाई। पारिवारिक वित्त अस्थिर है। दंत या चेहरे की चोट संभव।',
    },
    keywords: ['harsh-speech', 'family-discord', 'finance', 'surgery'],
  },
  {
    planetId: 2,
    house: 3,
    source: 'BPHS Ch.24, Shloka 53-54',
    verse: {
      en: 'Mars in the third makes the native valorous, unconquerable, wealthy, happy, and good-natured. Relations with siblings are supportive and great courage is displayed.',
      hi: 'तृतीय भाव में मंगल जातक को वीर, अजेय, धनवान, सुखी और सद्स्वभावी बनाता है। भाई-बहनों से संबंध सहायक हैं और महान साहस प्रदर्शित होता है।',
    },
    interpretation: {
      en: 'Exceptional physical courage and mental determination. Siblings may be combative or in military/sports. Bold in communication — writing, broadcasting, or debate. Short travels bring adventure.',
      hi: 'असाधारण शारीरिक साहस और मानसिक दृढ़ता। भाई-बहन लड़ाकू या सेना/खेल में हो सकते हैं। संवाद में निर्भीक — लेखन, प्रसारण या वाद-विवाद। लघु यात्राएं रोमांच लाती हैं।',
    },
    keywords: ['valor', 'siblings', 'determination', 'adventure'],
  },
  {
    planetId: 2,
    house: 4,
    source: 'BPHS Ch.24, Shloka 55-56',
    verse: {
      en: 'Mars in the fourth deprives the native of relatives, friends, mother, lands, and happiness. Domestic unrest, disputes over property, and lack of mental peace are indicated.',
      hi: 'चतुर्थ भाव में मंगल जातक को बंधुओं, मित्रों, माता, भूमि और सुख से वंचित करता है। घरेलू अशांति, संपत्ति विवाद और मानसिक अशांति संकेतित है।',
    },
    interpretation: {
      en: 'Restless domestic environment with frequent changes of residence. Disputes over land and property. Relationship with the mother can be strained. Manglik dosha affects marital harmony from this house.',
      hi: 'निवास में बार-बार परिवर्तन के साथ अशांत घरेलू वातावरण। भूमि और संपत्ति पर विवाद। माता से संबंध तनावपूर्ण हो सकते हैं। इस भाव से मांगलिक दोष वैवाहिक सामंजस्य प्रभावित करता है।',
    },
    keywords: ['property-disputes', 'domestic-unrest', 'mother', 'manglik'],
  },
  {
    planetId: 2,
    house: 5,
    source: 'BPHS Ch.24, Shloka 57-58',
    verse: {
      en: 'Mars in the fifth deprives the native of children and wealth, and gives a wavering mind. If well-aspected, intelligence in competitive pursuits and speculation is indicated.',
      hi: 'पंचम भाव में मंगल जातक को संतान और धन से वंचित करता है और चंचल मन देता है। शुभ दृष्टि होने पर प्रतिस्पर्धी कार्यों और सट्टे में बुद्धि संकेतित है।',
    },
    interpretation: {
      en: 'Sharp, aggressive intellect suited to competitive examinations and sports. Speculative ventures carry high risk. Children may be headstrong. Romance is passionate but turbulent.',
      hi: 'तीक्ष्ण, आक्रामक बुद्धि प्रतियोगी परीक्षाओं और खेलों के लिए उपयुक्त। सट्टा उपक्रमों में उच्च जोखिम। संतान जिद्दी हो सकती है। प्रेम भावुक किन्तु अशांत है।',
    },
    keywords: ['competition', 'speculation', 'intellect', 'children'],
  },
  {
    planetId: 2,
    house: 6,
    source: 'BPHS Ch.24, Shloka 59-60',
    verse: {
      en: 'Mars in the sixth makes the native wealthy, famous, and a vanquisher of enemies. This is one of the best placements — enemies are decisively defeated.',
      hi: 'षष्ठ भाव में मंगल जातक को धनवान, प्रसिद्ध और शत्रुओं का विजेता बनाता है। यह सर्वोत्तम स्थितियों में से एक है — शत्रु निर्णायक रूप से पराजित होते हैं।',
    },
    interpretation: {
      en: 'Powerful placement for overcoming enemies, debts, and diseases. Military, police, surgery, or competitive sports are ideal careers. Vigorous physical health and stamina.',
      hi: 'शत्रुओं, ऋणों और रोगों पर विजय के लिए शक्तिशाली स्थिति। सेना, पुलिस, शल्यचिकित्सा या प्रतिस्पर्धी खेल आदर्श करियर हैं। प्रबल शारीरिक स्वास्थ्य और सहनशक्ति।',
    },
    keywords: ['victory', 'enemies', 'military', 'health', 'stamina'],
  },
  {
    planetId: 2,
    house: 7,
    source: 'BPHS Ch.24, Shloka 61-62',
    verse: {
      en: 'Mars in the seventh causes loss of spouse or domestic strife, aimless wandering, and humiliation. Manglik dosha strongly applies, affecting marital harmony.',
      hi: 'सप्तम भाव में मंगल पत्नी हानि या गृह कलह, निरुद्देश्य भटकना और अपमान देता है। मांगलिक दोष प्रबलता से लागू होता है, वैवाहिक सामंजस्य प्रभावित करता है।',
    },
    interpretation: {
      en: 'Intense and passionate partnerships that need careful handling. The spouse may be aggressive or quarrelsome. Business partnerships carry conflict risk. Manglik dosha remedies are traditionally recommended.',
      hi: 'तीव्र और भावुक साझेदारी जिन्हें सावधानीपूर्ण संभालने की आवश्यकता है। जीवनसाथी आक्रामक या झगड़ालू हो सकता है। व्यापारिक साझेदारी में संघर्ष का जोखिम। मांगलिक दोष उपाय पारम्परिक रूप से अनुशंसित हैं।',
    },
    keywords: ['marriage', 'conflict', 'manglik', 'partnerships'],
  },
  {
    planetId: 2,
    house: 8,
    source: 'BPHS Ch.24, Shloka 63-64',
    verse: {
      en: 'Mars in the eighth makes the native sickly, short-lived, and with few possessions. Interest in surgery, martial arts, or occult research is indicated. Accidents are possible.',
      hi: 'अष्टम भाव में मंगल जातक को रोगी, अल्पायु और अल्प सम्पत्ति वाला बनाता है। शल्यचिकित्सा, मार्शल आर्ट या गूढ़ शोध में रुचि संकेतित है। दुर्घटनाएं संभव हैं।',
    },
    interpretation: {
      en: 'Prone to accidents, surgical interventions, and sudden health crises. Strong interest in investigation, forensics, or occult research. Inheritance may come through conflict. Transformative courage.',
      hi: 'दुर्घटनाओं, शल्य हस्तक्षेप और अचानक स्वास्थ्य संकटों की प्रवृत्ति। जांच, फोरेंसिक या गूढ़ शोध में प्रबल रुचि। उत्तराधिकार संघर्ष से आ सकता है। परिवर्तनकारी साहस।',
    },
    keywords: ['accidents', 'surgery', 'occult', 'inheritance'],
  },
  {
    planetId: 2,
    house: 9,
    source: 'BPHS Ch.24, Shloka 65-66',
    verse: {
      en: 'Mars in the ninth makes the native sinful, speaking ill of elders, fatherless early, yet given to pilgrimages. If well-placed, courage in defending beliefs is indicated.',
      hi: 'नवम भाव में मंगल जातक को पापी, बड़ों की निंदा करने वाला, शीघ्र पितृहीन, किन्तु तीर्थयात्रा करने वाला बनाता है। शुभ स्थिति में विश्वासों की रक्षा में साहस संकेतित है।',
    },
    interpretation: {
      en: 'Aggressive pursuit of beliefs and strong opinions on dharma. Relationship with the father or guru may be contentious. Adventurous long-distance travel. Defense of religious or ethical principles.',
      hi: 'विश्वासों की आक्रामक खोज और धर्म पर दृढ़ विचार। पिता या गुरु से संबंध विवादास्पद हो सकते हैं। साहसिक लम्बी यात्राएं। धार्मिक या नैतिक सिद्धांतों की रक्षा।',
    },
    keywords: ['beliefs', 'father', 'adventure', 'pilgrimage'],
  },
  {
    planetId: 2,
    house: 10,
    source: 'BPHS Ch.24, Shloka 67-68',
    verse: {
      en: 'Mars in the tenth makes the native brave, famous, prosperous, and devoted to the ruler. Career success through decisive action and discipline is strongly indicated.',
      hi: 'दशम भाव में मंगल जातक को वीर, प्रसिद्ध, समृद्ध और शासक का भक्त बनाता है। निर्णायक कार्रवाई और अनुशासन से करियर में सफलता दृढ़ता से संकेतित है।',
    },
    interpretation: {
      en: 'Excellent for careers in engineering, military, police, surgery, or sports. You lead with action, not words. Professional life is marked by boldness and decisive execution.',
      hi: 'इंजीनियरिंग, सेना, पुलिस, शल्यचिकित्सा या खेलों में करियर के लिए उत्कृष्ट। आप शब्दों से नहीं, कर्म से नेतृत्व करते हैं। व्यावसायिक जीवन निर्भीकता और निर्णायक कार्यान्वयन से चिह्नित है।',
    },
    keywords: ['career', 'engineering', 'military', 'action', 'fame'],
  },
  {
    planetId: 2,
    house: 11,
    source: 'BPHS Ch.24, Shloka 69-70',
    verse: {
      en: 'Mars in the eleventh makes the native wealthy, courageous, happy, and possessed of lands and conveyances. Gains through bold enterprise are indicated.',
      hi: 'एकादश भाव में मंगल जातक को धनवान, साहसी, सुखी और भूमि व वाहनों का स्वामी बनाता है। साहसिक उद्यम से लाभ संकेतित है।',
    },
    interpretation: {
      en: 'Ambitions are realized through courage and competitive drive. Friendships with military, sports, or engineering professionals. Property gains and high income from technical or physical work.',
      hi: 'महत्वाकांक्षाएं साहस और प्रतिस्पर्धी प्रेरणा से पूर्ण होती हैं। सेना, खेल या इंजीनियरिंग पेशेवरों से मित्रता। तकनीकी या शारीरिक कार्य से संपत्ति लाभ और उच्च आय।',
    },
    keywords: ['gains', 'ambition', 'property', 'enterprise'],
  },
  {
    planetId: 2,
    house: 12,
    source: 'BPHS Ch.24, Shloka 71-72',
    verse: {
      en: 'Mars in the twelfth gives eye ailments, sinful tendencies, cruelty, loss of spouse happiness, and expenditure through conflicts or hidden enemies.',
      hi: 'द्वादश भाव में मंगल नेत्र रोग, पापी प्रवृत्तियां, क्रूरता, पत्नी सुख की हानि और संघर्षों या छिपे शत्रुओं से व्यय देता है।',
    },
    interpretation: {
      en: 'Energy is spent in hidden ways — behind-the-scenes work, hospitals, or foreign lands. Suppressed anger needs healthy outlets. Expenditure through litigation or secret adversaries. Spiritual warrior path.',
      hi: 'ऊर्जा छिपे तरीकों से खर्च होती है — पर्दे के पीछे का कार्य, अस्पताल या विदेश। दबा हुआ क्रोध स्वस्थ माध्यम चाहता है। मुकदमेबाजी या गुप्त शत्रुओं से व्यय। आध्यात्मिक योद्धा मार्ग।',
    },
    keywords: ['expenditure', 'foreign-lands', 'hidden-enemies', 'hospitals'],
  },

  // ──────────────────────────────────────────────
  // MERCURY (id: 3) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 3,
    house: 1,
    source: 'BPHS Ch.24, Shloka 73-74',
    verse: {
      en: 'Mercury in the ascendant makes the native learned, sweet-spoken, long-lived, with good memory. A sharp intellect, youthful appearance, and adaptable personality are indicated.',
      hi: 'लग्न में बुध जातक को विद्वान, मधुरभाषी, दीर्घायु, अच्छी स्मरणशक्ति वाला बनाता है। तीक्ष्ण बुद्धि, युवा दिखावट और अनुकूलनीय व्यक्तित्व संकेतित है।',
    },
    interpretation: {
      en: 'Quick-witted and articulate with a versatile personality. You adapt easily to new environments and excel in communication. A youthful energy persists throughout life.',
      hi: 'हाज़िरजवाब और वाक्पटु, बहुमुखी व्यक्तित्व के साथ। आप नए वातावरण में सहज ढल जाते हैं और संवाद में उत्कृष्ट हैं। जीवन भर युवा ऊर्जा बनी रहती है।',
    },
    keywords: ['intellect', 'communication', 'adaptability', 'youthfulness'],
  },
  {
    planetId: 3,
    house: 2,
    source: 'BPHS Ch.24, Shloka 75-76',
    verse: {
      en: 'Mercury in the second makes the native wealthy, sweet-tongued, a poet, learned in scriptures, and a lover of fine food. Earning through intellect and communication is favoured.',
      hi: 'द्वितीय भाव में बुध जातक को धनवान, मधुरभाषी, कवि, शास्त्र में निपुण और सुभोजन प्रेमी बनाता है। बुद्धि और संवाद से कमाई अनुकूल है।',
    },
    interpretation: {
      en: 'Wealth through writing, accounting, teaching, or trade. Eloquent speech that persuades and educates. Strong financial intelligence. Family values learning and intellectual pursuits.',
      hi: 'लेखन, लेखाकर्म, शिक्षण या व्यापार से धन। प्रभावशाली वाणी जो मनाती और शिक्षित करती है। प्रबल वित्तीय बुद्धि। परिवार शिक्षा और बौद्धिक कार्यों को महत्व देता है।',
    },
    keywords: ['wealth', 'speech', 'writing', 'trade', 'learning'],
  },
  {
    planetId: 3,
    house: 3,
    source: 'BPHS Ch.24, Shloka 77-78',
    verse: {
      en: 'Mercury in the third makes the native courageous, blessed with siblings, devoted to virtue, with a medium life span. Skill in writing, media, and short travel is indicated.',
      hi: 'तृतीय भाव में बुध जातक को साहसी, भाई-बहनों से भाग्यशाली, धर्मपरायण, मध्यम आयु वाला बनाता है। लेखन, मीडिया और लघु यात्रा में कौशल संकेतित है।',
    },
    interpretation: {
      en: 'Natural communicator with a talent for writing, media, and networking. Siblings may be intellectually oriented. Short trips are frequent and stimulating. Skill in languages and trade.',
      hi: 'लेखन, मीडिया और नेटवर्किंग में प्रतिभा के साथ स्वाभाविक संवादकर्ता। भाई-बहन बौद्धिक प्रवृत्ति के हो सकते हैं। लघु यात्राएं बार-बार और उत्तेजक हैं। भाषाओं और व्यापार में कौशल।',
    },
    keywords: ['writing', 'media', 'siblings', 'networking', 'languages'],
  },
  {
    planetId: 3,
    house: 4,
    source: 'BPHS Ch.24, Shloka 79-80',
    verse: {
      en: 'Mercury in the fourth makes the native learned, happy, possessing houses, ornaments, and conveyances. An educated home environment and success in property matters are indicated.',
      hi: 'चतुर्थ भाव में बुध जातक को विद्वान, सुखी, गृह, आभूषण और वाहनों का स्वामी बनाता है। शिक्षित घरेलू वातावरण और संपत्ति मामलों में सफलता संकेतित है।',
    },
    interpretation: {
      en: 'Intellectual home environment with emphasis on education. Real estate through clever negotiation. The mother may be educated and communicative. Mental peace through study and learning.',
      hi: 'शिक्षा पर बल के साथ बौद्धिक घरेलू वातावरण। चतुर बातचीत से अचल संपत्ति। माता शिक्षित और संवादशील हो सकती हैं। अध्ययन और सीखने से मानसिक शांति।',
    },
    keywords: ['education', 'property', 'home', 'mother', 'study'],
  },
  {
    planetId: 3,
    house: 5,
    source: 'BPHS Ch.24, Shloka 81-82',
    verse: {
      en: 'Mercury in the fifth makes the native a minister or advisor, eloquent, skilled in mantras, and blessed with children. Sharp intelligence and skill in teaching are indicated.',
      hi: 'पंचम भाव में बुध जातक को मंत्री या सलाहकार, वाक्पटु, मंत्र में कुशल और संतान से आशीर्वादित बनाता है। तीक्ष्ण बुद्धि और शिक्षण में कौशल संकेतित है।',
    },
    interpretation: {
      en: 'Brilliant analytical mind suited to advisory, consultancy, or teaching roles. Children are intellectually gifted. Creative expression through writing or performing arts. Skilled in speculation and strategy.',
      hi: 'सलाहकार, परामर्श या शिक्षण भूमिकाओं के लिए उपयुक्त शानदार विश्लेषणात्मक मन। संतान बौद्धिक रूप से प्रतिभाशाली है। लेखन या प्रदर्शन कला से रचनात्मक अभिव्यक्ति। सट्टा और रणनीति में कुशल।',
    },
    keywords: ['advisory', 'teaching', 'children', 'strategy', 'creativity'],
  },
  {
    planetId: 3,
    house: 6,
    source: 'BPHS Ch.24, Shloka 83-84',
    verse: {
      en: 'Mercury in the sixth makes the native lazy, harsh in speech, quarrelsome, and surrounded by enemies. However, the ability to solve complex problems analytically is strong.',
      hi: 'षष्ठ भाव में बुध जातक को आलसी, कठोर वाणी वाला, झगड़ालू और शत्रुओं से घिरा बनाता है। तथापि, जटिल समस्याओं को विश्लेषणात्मक रूप से हल करने की क्षमता प्रबल है।',
    },
    interpretation: {
      en: 'Analytical ability applied to problem-solving in health, law, or service fields. Nervous tension and anxiety need management. Disputes are won through logic and documentation.',
      hi: 'स्वास्थ्य, कानून या सेवा क्षेत्रों में समस्या-समाधान में लागू विश्लेषणात्मक क्षमता। तंत्रिका तनाव और चिंता को प्रबंधन की आवश्यकता है। तर्क और प्रलेखन से विवाद जीते जाते हैं।',
    },
    keywords: ['analysis', 'problem-solving', 'disputes', 'health', 'anxiety'],
  },
  {
    planetId: 3,
    house: 7,
    source: 'BPHS Ch.24, Shloka 85-86',
    verse: {
      en: 'Mercury in the seventh makes the native learned, good-looking, with a learned spouse, and well-versed in arts. Success in partnerships and communication businesses is indicated.',
      hi: 'सप्तम भाव में बुध जातक को विद्वान, सुदर्शन, विद्वान पत्नी वाला और कलाओं में निपुण बनाता है। साझेदारी और संवाद व्यवसायों में सफलता संकेतित है।',
    },
    interpretation: {
      en: 'An intellectual and youthful partner is attracted. Business partnerships based on communication, trade, or technology thrive. Marriage brings intellectual stimulation and shared learning.',
      hi: 'एक बौद्धिक और युवा साथी आकर्षित होता है। संवाद, व्यापार या प्रौद्योगिकी पर आधारित व्यापारिक साझेदारियां फलती-फूलती हैं। विवाह बौद्धिक उत्तेजना और साझा शिक्षा लाता है।',
    },
    keywords: ['partnerships', 'spouse', 'trade', 'communication'],
  },
  {
    planetId: 3,
    house: 8,
    source: 'BPHS Ch.24, Shloka 87-88',
    verse: {
      en: 'Mercury in the eighth makes the native famous, long-lived, serving the ruler, and with many income sources. Analytical approach to mysteries and research is indicated.',
      hi: 'अष्टम भाव में बुध जातक को प्रसिद्ध, दीर्घायु, शासक की सेवा करने वाला और अनेक आय स्रोतों वाला बनाता है। रहस्यों और शोध के प्रति विश्लेषणात्मक दृष्टिकोण संकेतित है।',
    },
    interpretation: {
      en: 'Penetrating intellect for research, investigation, and occult studies. Earning through insurance, taxation, or inheritance management. Transformation through knowledge and mental depth.',
      hi: 'शोध, जांच और गूढ़ अध्ययन के लिए भेदक बुद्धि। बीमा, कराधान या उत्तराधिकार प्रबंधन से कमाई। ज्ञान और मानसिक गहराई से परिवर्तन।',
    },
    keywords: ['research', 'investigation', 'occult', 'insurance', 'depth'],
  },
  {
    planetId: 3,
    house: 9,
    source: 'BPHS Ch.24, Shloka 89-90',
    verse: {
      en: 'Mercury in the ninth makes the native devoted to God, eloquent, scholarly, wealthy, and blessed with children. Interest in philosophy, teaching, and foreign cultures is indicated.',
      hi: 'नवम भाव में बुध जातक को ईश्वर भक्त, वाक्पटु, विद्वान, धनवान और संतान से आशीर्वादित बनाता है। दर्शन, शिक्षण और विदेशी संस्कृतियों में रुचि संकेतित है।',
    },
    interpretation: {
      en: 'Scholarly approach to religion and philosophy. Teaching, publishing, and academic pursuits are favoured. Multilingual abilities and interest in foreign cultures. Father may be learned.',
      hi: 'धर्म और दर्शन के प्रति विद्वतापूर्ण दृष्टिकोण। शिक्षण, प्रकाशन और अकादमिक कार्य अनुकूल हैं। बहुभाषी क्षमता और विदेशी संस्कृतियों में रुचि। पिता विद्वान हो सकते हैं।',
    },
    keywords: ['philosophy', 'teaching', 'publishing', 'languages', 'father'],
  },
  {
    planetId: 3,
    house: 10,
    source: 'BPHS Ch.24, Shloka 91-92',
    verse: {
      en: 'Mercury in the tenth makes the native wise, happy, valorous, truthful, and prosperous. Career success through intellect, communication, and business acumen is indicated.',
      hi: 'दशम भाव में बुध जातक को बुद्धिमान, सुखी, वीर, सत्यवादी और समृद्ध बनाता है। बुद्धि, संवाद और व्यापारिक कुशाग्रता से करियर में सफलता संकेतित है।',
    },
    interpretation: {
      en: 'Career in commerce, IT, accounting, journalism, or teaching. Professional success comes through versatility and quick thinking. Multiple career changes or simultaneous projects are common.',
      hi: 'वाणिज्य, आईटी, लेखाकर्म, पत्रकारिता या शिक्षण में करियर। व्यावसायिक सफलता बहुमुखी प्रतिभा और त्वरित चिंतन से आती है। अनेक करियर परिवर्तन या समकालिक परियोजनाएं सामान्य हैं।',
    },
    keywords: ['career', 'commerce', 'technology', 'journalism', 'versatility'],
  },
  {
    planetId: 3,
    house: 11,
    source: 'BPHS Ch.24, Shloka 93-94',
    verse: {
      en: 'Mercury in the eleventh makes the native wealthy, truthful, long-lived, with many friends. Gains through intellectual pursuits, networking, and trade are indicated.',
      hi: 'एकादश भाव में बुध जातक को धनवान, सत्यवादी, दीर्घायु और अनेक मित्रों वाला बनाता है। बौद्धिक कार्यों, नेटवर्किंग और व्यापार से लाभ संकेतित है।',
    },
    interpretation: {
      en: 'Income through intellectual work, networking, and multiple channels. Friendships with writers, traders, and tech professionals. Goals are achieved through smart strategy and information advantage.',
      hi: 'बौद्धिक कार्य, नेटवर्किंग और अनेक माध्यमों से आय। लेखकों, व्यापारियों और तकनीकी पेशेवरों से मित्रता। चतुर रणनीति और सूचना लाभ से लक्ष्य प्राप्त होते हैं।',
    },
    keywords: ['gains', 'networking', 'trade', 'friends', 'strategy'],
  },
  {
    planetId: 3,
    house: 12,
    source: 'BPHS Ch.24, Shloka 95-96',
    verse: {
      en: 'Mercury in the twelfth makes the native mean, ineffective in speech, lazy, and without wealth. If well-aspected, foreign communication work and a rich inner mental life are possible.',
      hi: 'द्वादश भाव में बुध जातक को नीच, वाणी में अप्रभावी, आलसी और धनहीन बनाता है। शुभ दृष्टि होने पर विदेशी संवाद कार्य और समृद्ध आंतरिक मानसिक जीवन संभव है।',
    },
    interpretation: {
      en: 'The mind works in mysterious ways — imagination and visualization are strong. Work in foreign lands or behind the scenes. Expenditure on education or communication. Spiritual writing or journaling brings clarity.',
      hi: 'मन रहस्यमय तरीकों से कार्य करता है — कल्पना और दृश्यावलोकन प्रबल हैं। विदेश या पर्दे के पीछे का कार्य। शिक्षा या संवाद पर व्यय। आध्यात्मिक लेखन या डायरी से स्पष्टता आती है।',
    },
    keywords: ['imagination', 'foreign-work', 'expenditure', 'writing'],
  },

  // ──────────────────────────────────────────────
  // JUPITER (id: 4) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 4,
    house: 1,
    source: 'BPHS Ch.24, Shloka 97-98',
    verse: {
      en: 'Jupiter in the ascendant makes the native handsome, happy, devoted to God, long-lived, fearless, and favoured by rulers. Wisdom and good fortune are inherent.',
      hi: 'लग्न में गुरु जातक को सुंदर, सुखी, ईश्वर भक्त, दीर्घायु, निर्भय और शासकों द्वारा अनुग्रहीत बनाता है। ज्ञान और सौभाग्य जन्मजात हैं।',
    },
    interpretation: {
      en: 'Blessed with optimism, wisdom, and a generous spirit. Natural teacher and guide. Physical well-being and a dignified bearing. Others seek your counsel instinctively.',
      hi: 'आशावाद, ज्ञान और उदार भावना से आशीर्वादित। स्वाभाविक शिक्षक और मार्गदर्शक। शारीरिक स्वास्थ्य और गरिमापूर्ण व्यक्तित्व। दूसरे सहज रूप से आपकी सलाह चाहते हैं।',
    },
    keywords: ['wisdom', 'optimism', 'fortune', 'guidance', 'health'],
  },
  {
    planetId: 4,
    house: 2,
    source: 'BPHS Ch.24, Shloka 99-100',
    verse: {
      en: 'Jupiter in the second makes the native wealthy, learned, eloquent, with a large family, handsome, and a lover of fine food. Noble speech and prosperity are indicated.',
      hi: 'द्वितीय भाव में गुरु जातक को धनवान, विद्वान, वाक्पटु, बड़े परिवार वाला, सुंदर और सुभोजन प्रेमी बनाता है। उदात्त वाणी और समृद्धि संकेतित है।',
    },
    interpretation: {
      en: 'Wealth grows steadily through ethical means. Speech is dignified and persuasive — suited to law, teaching, or preaching. Family life is harmonious and value-oriented.',
      hi: 'नैतिक माध्यमों से धन स्थिर रूप से बढ़ता है। वाणी गरिमापूर्ण और प्रभावशाली है — कानून, शिक्षण या प्रवचन के लिए उपयुक्त। पारिवारिक जीवन सामंजस्यपूर्ण और मूल्य-उन्मुख है।',
    },
    keywords: ['wealth', 'family', 'speech', 'ethics', 'prosperity'],
  },
  {
    planetId: 4,
    house: 3,
    source: 'BPHS Ch.24, Shloka 101-102',
    verse: {
      en: 'Jupiter in the third makes the native stingy, despised by relatives, and may have difficult sibling relations. If well-aspected, wise communication brings eventual respect.',
      hi: 'तृतीय भाव में गुरु जातक को कंजूस, बंधुओं द्वारा तिरस्कृत बनाता है और भाई-बहनों से कठिन संबंध हो सकते हैं। शुभ दृष्टि होने पर बुद्धिमान संवाद अंततः सम्मान लाता है।',
    },
    interpretation: {
      en: 'Wisdom applied to communication and media. Sibling relationships require patience. Short travels for religious or educational purposes. Publishing, counselling, and mentoring suit you.',
      hi: 'संवाद और मीडिया में ज्ञान का प्रयोग। भाई-बहनों के संबंधों में धैर्य आवश्यक है। धार्मिक या शैक्षिक उद्देश्यों के लिए लघु यात्राएं। प्रकाशन, परामर्श और मार्गदर्शन आपके अनुकूल है।',
    },
    keywords: ['communication', 'siblings', 'counselling', 'publishing'],
  },
  {
    planetId: 4,
    house: 4,
    source: 'BPHS Ch.24, Shloka 103-104',
    verse: {
      en: 'Jupiter in the fourth blesses the native with happiness, wealth, good mother, friends, conveyances, and lands. Domestic happiness and comfortable living are strongly indicated.',
      hi: 'चतुर्थ भाव में गुरु जातक को सुख, धन, अच्छी माता, मित्र, वाहन और भूमि से आशीर्वादित करता है। घरेलू सुख और आरामदायक जीवन दृढ़ता से संकेतित है।',
    },
    interpretation: {
      en: 'One of the best placements for domestic peace. Large, comfortable home with a learned atmosphere. The mother is wise and supportive. Property and vehicle ownership come naturally.',
      hi: 'घरेलू शांति के लिए सर्वोत्तम स्थितियों में से एक। विद्वत वातावरण के साथ बड़ा, आरामदायक घर। माता बुद्धिमान और सहायक हैं। संपत्ति और वाहन स्वामित्व स्वाभाविक रूप से आता है।',
    },
    keywords: ['home', 'mother', 'property', 'happiness', 'comfort'],
  },
  {
    planetId: 4,
    house: 5,
    source: 'BPHS Ch.24, Shloka 105-106',
    verse: {
      en: 'Jupiter in the fifth makes the native an advisor or minister, wealthy, blessed with children, and endowed with fame. Intelligence and spiritual merit are exceptionally strong.',
      hi: 'पंचम भाव में गुरु जातक को सलाहकार या मंत्री, धनवान, संतान से आशीर्वादित और यश से संपन्न बनाता है। बुद्धि और आध्यात्मिक पुण्य असाधारण रूप से प्रबल हैं।',
    },
    interpretation: {
      en: 'Exceptional placement for wisdom, children, and creative intelligence. Natural advisor, teacher, or spiritual guide. Children bring great joy. Past-life merit manifests as good fortune.',
      hi: 'ज्ञान, संतान और रचनात्मक बुद्धि के लिए असाधारण स्थिति। स्वाभाविक सलाहकार, शिक्षक या आध्यात्मिक मार्गदर्शक। संतान महान आनंद लाती है। पूर्वजन्म का पुण्य सौभाग्य के रूप में प्रकट होता है।',
    },
    keywords: ['children', 'wisdom', 'education', 'advisory', 'fortune'],
  },
  {
    planetId: 4,
    house: 6,
    source: 'BPHS Ch.24, Shloka 107-108',
    verse: {
      en: 'Jupiter in the sixth destroys enemies but makes the native lazy and prone to humiliation. If afflicted, health issues from overindulgence are possible.',
      hi: 'षष्ठ भाव में गुरु शत्रुओं का नाश करता है किन्तु जातक को आलसी और अपमान प्रवण बनाता है। पीड़ित होने पर अतिभोग से स्वास्थ्य समस्याएं संभव हैं।',
    },
    interpretation: {
      en: 'Ability to resolve disputes through wisdom and fairness. Success in healing, law, or service professions. Weight management and liver health need attention. Enemies are overcome through dharmic means.',
      hi: 'ज्ञान और निष्पक्षता से विवाद सुलझाने की क्षमता। चिकित्सा, कानून या सेवा व्यवसायों में सफलता। वजन प्रबंधन और यकृत स्वास्थ्य पर ध्यान दें। शत्रु धार्मिक माध्यमों से पराजित होते हैं।',
    },
    keywords: ['healing', 'law', 'service', 'enemies', 'overindulgence'],
  },
  {
    planetId: 4,
    house: 7,
    source: 'BPHS Ch.24, Shloka 109-110',
    verse: {
      en: 'Jupiter in the seventh gives a virtuous and beautiful spouse, makes the native eloquent, and superior to the father. Fortunate and ethical partnerships are indicated.',
      hi: 'सप्तम भाव में गुरु गुणवान और सुंदर पत्नी देता है, जातक को वाक्पटु और पिता से श्रेष्ठ बनाता है। भाग्यशाली और नैतिक साझेदारियां संकेतित हैं।',
    },
    interpretation: {
      en: 'Marriage to a wise, educated, and spiritually inclined partner. Business partnerships are ethical and profitable. Public reputation grows through fair dealings. Marriage expands your worldview.',
      hi: 'बुद्धिमान, शिक्षित और आध्यात्मिक प्रवृत्ति के साथी से विवाह। व्यापारिक साझेदारियां नैतिक और लाभदायक हैं। निष्पक्ष व्यवहार से सार्वजनिक प्रतिष्ठा बढ़ती है। विवाह आपके विश्वदृष्टिकोण को विस्तारित करता है।',
    },
    keywords: ['marriage', 'spouse', 'ethics', 'partnerships', 'reputation'],
  },
  {
    planetId: 4,
    house: 8,
    source: 'BPHS Ch.24, Shloka 111-112',
    verse: {
      en: 'Jupiter in the eighth gives long life but humiliation, few possessions, and service to others. Interest in occult wisdom and protection from sudden harm are indicated.',
      hi: 'अष्टम भाव में गुरु दीर्घायु किन्तु अपमान, अल्प सम्पत्ति और दूसरों की सेवा देता है। गूढ़ ज्ञान में रुचि और अचानक हानि से सुरक्षा संकेतित है।',
    },
    interpretation: {
      en: 'Protection in crises and longevity despite challenges. Deep interest in Jyotish, tantra, or spiritual transformation. Inheritance or insurance benefits are possible. Research into life mysteries.',
      hi: 'संकटों में सुरक्षा और चुनौतियों के बावजूद दीर्घायु। ज्योतिष, तंत्र या आध्यात्मिक परिवर्तन में गहरी रुचि। उत्तराधिकार या बीमा लाभ संभव हैं। जीवन के रहस्यों में शोध।',
    },
    keywords: ['longevity', 'occult', 'transformation', 'protection'],
  },
  {
    planetId: 4,
    house: 9,
    source: 'BPHS Ch.24, Shloka 113-114',
    verse: {
      en: 'Jupiter in the ninth makes the native devoted to God, fortunate, wise, wealthy, famous, and blessed with sons. Spiritual and material blessings abound in this placement.',
      hi: 'नवम भाव में गुरु जातक को ईश्वर भक्त, भाग्यशाली, बुद्धिमान, धनवान, प्रसिद्ध और पुत्रों से आशीर्वादित बनाता है। इस स्थिति में आध्यात्मिक और भौतिक आशीर्वाद प्रचुर हैं।',
    },
    interpretation: {
      en: 'The most fortunate placement for Jupiter — dharma, luck, and higher learning flourish. You become a teacher, mentor, or spiritual guide. Father is respected. Pilgrimage and foreign travel bring blessings.',
      hi: 'गुरु के लिए सर्वाधिक भाग्यशाली स्थिति — धर्म, भाग्य और उच्च शिक्षा फलती-फूलती है। आप शिक्षक, गुरु या आध्यात्मिक मार्गदर्शक बनते हैं। पिता सम्मानित हैं। तीर्थयात्रा और विदेश यात्रा आशीर्वाद लाती है।',
    },
    keywords: ['dharma', 'fortune', 'teaching', 'pilgrimage', 'father'],
  },
  {
    planetId: 4,
    house: 10,
    source: 'BPHS Ch.24, Shloka 115-116',
    verse: {
      en: 'Jupiter in the tenth makes the native happy, wealthy, powerful, famous, virtuous, and devoted to God. Career success through ethical leadership is strongly indicated.',
      hi: 'दशम भाव में गुरु जातक को सुखी, धनवान, शक्तिशाली, प्रसिद्ध, गुणवान और ईश्वर भक्त बनाता है। नैतिक नेतृत्व से करियर में सफलता दृढ़ता से संकेतित है।',
    },
    interpretation: {
      en: 'Prominent career in education, law, religion, finance, or government. Natural leader who commands respect through wisdom. Professional reputation is sterling. Ethical conduct defines your public image.',
      hi: 'शिक्षा, कानून, धर्म, वित्त या सरकार में प्रमुख करियर। ज्ञान से सम्मान प्राप्त करने वाला स्वाभाविक नेता। व्यावसायिक प्रतिष्ठा उत्कृष्ट है। नैतिक आचरण आपकी सार्वजनिक छवि को परिभाषित करता है।',
    },
    keywords: ['career', 'leadership', 'ethics', 'fame', 'government'],
  },
  {
    planetId: 4,
    house: 11,
    source: 'BPHS Ch.24, Shloka 117-118',
    verse: {
      en: 'Jupiter in the eleventh makes the native long-lived, wealthy, truthful, happy, with few children but many servants. Ambitions are fulfilled through knowledge.',
      hi: 'एकादश भाव में गुरु जातक को दीर्घायु, धनवान, सत्यवादी, सुखी, कम संतान किन्तु अनेक सेवकों वाला बनाता है। ज्ञान से महत्वाकांक्षाएं पूर्ण होती हैं।',
    },
    interpretation: {
      en: 'Large-scale gains through education, wisdom, and wise counsel. Friendships with learned and influential people. Financial goals are met through ethical channels. Social causes benefit from your involvement.',
      hi: 'शिक्षा, ज्ञान और बुद्धिमान सलाह से बड़े पैमाने पर लाभ। विद्वान और प्रभावशाली लोगों से मित्रता। नैतिक माध्यमों से वित्तीय लक्ष्य पूरे होते हैं। सामाजिक कार्य आपकी भागीदारी से लाभान्वित होते हैं।',
    },
    keywords: ['gains', 'wisdom', 'friends', 'ethics', 'social-causes'],
  },
  {
    planetId: 4,
    house: 12,
    source: 'BPHS Ch.24, Shloka 119-120',
    verse: {
      en: 'Jupiter in the twelfth makes the native disliked, without wealth or children, and serving others. If well-aspected, spiritual growth, foreign travel, and moksha are indicated.',
      hi: 'द्वादश भाव में गुरु जातक को अप्रिय, धन और संतान रहित और दूसरों की सेवा करने वाला बनाता है। शुभ दृष्टि होने पर आध्यात्मिक विकास, विदेश यात्रा और मोक्ष संकेतित है।',
    },
    interpretation: {
      en: 'Expenditure on charity, spiritual pursuits, and foreign travel. Strong moksha indication — liberation through selfless service. Work in hospitals, ashrams, or foreign institutions. Inner wealth surpasses material wealth.',
      hi: 'दान, आध्यात्मिक कार्यों और विदेश यात्रा पर व्यय। प्रबल मोक्ष संकेत — निःस्वार्थ सेवा से मुक्ति। अस्पतालों, आश्रमों या विदेशी संस्थानों में कार्य। आंतरिक संपदा भौतिक संपदा से अधिक है।',
    },
    keywords: ['moksha', 'charity', 'foreign-travel', 'spirituality'],
  },

  // ──────────────────────────────────────────────
  // VENUS (id: 5) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 5,
    house: 1,
    source: 'BPHS Ch.24, Shloka 121-122',
    verse: {
      en: 'Venus in the ascendant makes the native happy, handsome, long-lived, endowed with good qualities, and blessed with conjugal happiness. Charm and artistic sensibility are indicated.',
      hi: 'लग्न में शुक्र जातक को सुखी, सुंदर, दीर्घायु, गुणसम्पन्न और दाम्पत्य सुख से आशीर्वादित बनाता है। आकर्षण और कलात्मक संवेदनशीलता संकेतित है।',
    },
    interpretation: {
      en: 'Attractive appearance and a charming, diplomatic personality. Success in arts, fashion, beauty, or entertainment. Relationships are central to your life. Physical comforts come easily.',
      hi: 'आकर्षक रूप और मोहक, कूटनीतिक व्यक्तित्व। कला, फैशन, सौंदर्य या मनोरंजन में सफलता। संबंध आपके जीवन के केंद्र में हैं। शारीरिक सुख सहज प्राप्त होते हैं।',
    },
    keywords: ['beauty', 'charm', 'arts', 'relationships', 'comfort'],
  },
  {
    planetId: 5,
    house: 2,
    source: 'BPHS Ch.24, Shloka 123-124',
    verse: {
      en: 'Venus in the second makes the native wealthy, a poet, sweet-spoken, with a beautiful face, and happy with family. Earning through artistic pursuits and luxury trades is favoured.',
      hi: 'द्वितीय भाव में शुक्र जातक को धनवान, कवि, मधुरभाषी, सुंदर मुखाकृति वाला और परिवार से सुखी बनाता है। कलात्मक कार्यों और विलास व्यापार से कमाई अनुकूल है।',
    },
    interpretation: {
      en: 'Wealth through beauty, art, luxury goods, or food industry. Speech is sweet and melodious — suited to singing, public speaking, or diplomacy. Family life is comfortable and aesthetically rich.',
      hi: 'सौंदर्य, कला, विलास सामग्री या खाद्य उद्योग से धन। वाणी मधुर और सुरीली है — गायन, सार्वजनिक भाषण या कूटनीति के लिए उपयुक्त। पारिवारिक जीवन आरामदायक और सौंदर्यपूर्ण है।',
    },
    keywords: ['wealth', 'art', 'luxury', 'sweet-speech', 'family'],
  },
  {
    planetId: 5,
    house: 3,
    source: 'BPHS Ch.24, Shloka 125-126',
    verse: {
      en: 'Venus in the third may deprive the native of happiness, wealth, and a good spouse. If well-aspected, artistic talents and harmonious creative work are possible.',
      hi: 'तृतीय भाव में शुक्र जातक को सुख, धन और अच्छी पत्नी से वंचित कर सकता है। शुभ दृष्टि होने पर कलात्मक प्रतिभा और सामंजस्यपूर्ण रचनात्मक कार्य संभव है।',
    },
    interpretation: {
      en: 'Creative communication through art, music, or media. Siblings may be artistic or in beauty-related fields. Short travels for pleasure or artistic pursuits. Romantic adventures during travels.',
      hi: 'कला, संगीत या मीडिया के माध्यम से रचनात्मक संवाद। भाई-बहन कलात्मक या सौंदर्य संबंधित क्षेत्रों में हो सकते हैं। आनंद या कलात्मक कार्यों के लिए लघु यात्राएं। यात्राओं के दौरान रोमांटिक रोमांच।',
    },
    keywords: ['creativity', 'art', 'music', 'siblings', 'travel'],
  },
  {
    planetId: 5,
    house: 4,
    source: 'BPHS Ch.24, Shloka 127-128',
    verse: {
      en: 'Venus in the fourth gives conveyances, houses, ornaments, clothes, perfumes, and lands. Luxury at home and domestic happiness are strongly indicated.',
      hi: 'चतुर्थ भाव में शुक्र वाहन, गृह, आभूषण, वस्त्र, सुगंध और भूमि देता है। घर पर विलासिता और घरेलू सुख दृढ़ता से संकेतित है।',
    },
    interpretation: {
      en: 'Beautiful, well-decorated home with all comforts. Luxury vehicles and property. Mother is graceful and cultured. Deep emotional attachment to home and a love of gardening or interior design.',
      hi: 'सभी सुविधाओं के साथ सुंदर, सुसज्जित घर। विलास वाहन और संपत्ति। माता सुशील और सुसंस्कृत हैं। घर से गहरा भावनात्मक लगाव और बागवानी या इंटीरियर डिजाइन का प्रेम।',
    },
    keywords: ['luxury', 'home', 'vehicles', 'property', 'mother'],
  },
  {
    planetId: 5,
    house: 5,
    source: 'BPHS Ch.24, Shloka 129-130',
    verse: {
      en: 'Venus in the fifth makes the native an advisor, wealthy, blessed with children, and fond of the opposite gender. Romantic fulfillment and creative talent are indicated.',
      hi: 'पंचम भाव में शुक्र जातक को सलाहकार, धनवान, संतान से आशीर्वादित और विपरीत लिंग का प्रेमी बनाता है। प्रेम पूर्णता और रचनात्मक प्रतिभा संकेतित है।',
    },
    interpretation: {
      en: 'Rich romantic life and creative expression. Children are beautiful and artistically inclined. Talent in performing arts, cinema, or entertainment. Speculation in luxury markets may yield gains.',
      hi: 'समृद्ध प्रेम जीवन और रचनात्मक अभिव्यक्ति। संतान सुंदर और कलात्मक प्रवृत्ति की है। प्रदर्शन कला, सिनेमा या मनोरंजन में प्रतिभा। विलास बाजारों में सट्टा लाभ दे सकता है।',
    },
    keywords: ['romance', 'creativity', 'children', 'entertainment', 'arts'],
  },
  {
    planetId: 5,
    house: 6,
    source: 'BPHS Ch.24, Shloka 131-132',
    verse: {
      en: 'Venus in the sixth may deprive the native of enemies but also of wealth, causing humiliation. Relationship challenges but creative service success are possible.',
      hi: 'षष्ठ भाव में शुक्र जातक को शत्रुओं से मुक्त किन्तु धन से भी वंचित कर सकता है, अपमान देता है। संबंध चुनौतियां किन्तु रचनात्मक सेवा सफलता संभव है।',
    },
    interpretation: {
      en: 'Romantic relationships face obstacles or workplace complications. Service in beauty, health, or wellness industries suits you. Disputes are resolved diplomatically. Watch for reproductive health issues.',
      hi: 'प्रेम संबंधों में बाधाएं या कार्यस्थल जटिलताएं आती हैं। सौंदर्य, स्वास्थ्य या कल्याण उद्योगों में सेवा आपके अनुकूल है। विवाद कूटनीतिक रूप से सुलझते हैं। प्रजनन स्वास्थ्य पर ध्यान दें।',
    },
    keywords: ['service', 'health', 'relationships', 'diplomacy'],
  },
  {
    planetId: 5,
    house: 7,
    source: 'BPHS Ch.24, Shloka 133-134',
    verse: {
      en: 'Venus in the seventh makes the native passionate, handsome, blessed with a beautiful spouse, and happy in marriage. This is a strong placement for marital harmony.',
      hi: 'सप्तम भाव में शुक्र जातक को कामुक, सुंदर, सुंदर पत्नी से भाग्यशाली और विवाह में सुखी बनाता है। वैवाहिक सामंजस्य के लिए यह प्रबल स्थिति है।',
    },
    interpretation: {
      en: 'Excellent for marriage and partnerships. Your spouse is attractive, refined, and loving. Business partnerships in beauty, fashion, or luxury succeed. Social life is vibrant and fulfilling.',
      hi: 'विवाह और साझेदारी के लिए उत्कृष्ट। आपका जीवनसाथी आकर्षक, परिष्कृत और स्नेही है। सौंदर्य, फैशन या विलास में व्यापारिक साझेदारियां सफल होती हैं। सामाजिक जीवन जीवंत और संतोषप्रद है।',
    },
    keywords: ['marriage', 'beauty', 'partnerships', 'love', 'harmony'],
  },
  {
    planetId: 5,
    house: 8,
    source: 'BPHS Ch.24, Shloka 135-136',
    verse: {
      en: 'Venus in the eighth gives long life, wealth, and all comforts. Inheritance, sensual depth, and transformative experiences in love are indicated.',
      hi: 'अष्टम भाव में शुक्र दीर्घायु, धन और सभी सुख देता है। उत्तराधिकार, कामुक गहराई और प्रेम में परिवर्तनकारी अनुभव संकेतित हैं।',
    },
    interpretation: {
      en: 'Wealth through inheritance, insurance, or the spouse. Deep and transformative romantic experiences. Interest in tantric practices or occult arts. Hidden pleasures and luxuries.',
      hi: 'उत्तराधिकार, बीमा या पत्नी से धन। गहरे और परिवर्तनकारी प्रेम अनुभव। तांत्रिक साधनाओं या गूढ़ कलाओं में रुचि। छिपे सुख और विलासिता।',
    },
    keywords: ['inheritance', 'transformation', 'tantra', 'wealth', 'depth'],
  },
  {
    planetId: 5,
    house: 9,
    source: 'BPHS Ch.24, Shloka 137-138',
    verse: {
      en: 'Venus in the ninth makes the native devoted to God, charitable, wealthy, happy, and blessed with wife and children. Fortune through arts and foreign connections is indicated.',
      hi: 'नवम भाव में शुक्र जातक को ईश्वर भक्त, दानशील, धनवान, सुखी और पत्नी-संतान से आशीर्वादित बनाता है। कला और विदेशी संबंधों से भाग्य संकेतित है।',
    },
    interpretation: {
      en: 'Fortune through artistic, cultural, or diplomatic channels. Marriage partner may be from a different culture or foreign land. Love of beauty enriches spiritual practice. Travel for pleasure and culture.',
      hi: 'कलात्मक, सांस्कृतिक या कूटनीतिक माध्यमों से भाग्य। विवाह साथी भिन्न संस्कृति या विदेश से हो सकता है। सौंदर्य का प्रेम आध्यात्मिक साधना को समृद्ध करता है। आनंद और संस्कृति के लिए यात्रा।',
    },
    keywords: ['fortune', 'culture', 'foreign-spouse', 'arts', 'dharma'],
  },
  {
    planetId: 5,
    house: 10,
    source: 'BPHS Ch.24, Shloka 139-140',
    verse: {
      en: 'Venus in the tenth makes the native happy, valorous, famous, and inclined to perform meritorious deeds. Career success in arts, beauty, or entertainment is indicated.',
      hi: 'दशम भाव में शुक्र जातक को सुखी, वीर, प्रसिद्ध और पुण्य कर्मों की ओर प्रवृत्त बनाता है। कला, सौंदर्य या मनोरंजन में करियर सफलता संकेतित है।',
    },
    interpretation: {
      en: 'Career in fashion, beauty, entertainment, hospitality, or diplomacy. Professional charm opens doors. Public image is polished and attractive. Success comes through aesthetic sensibility and social grace.',
      hi: 'फैशन, सौंदर्य, मनोरंजन, आतिथ्य या कूटनीति में करियर। व्यावसायिक आकर्षण दरवाज़े खोलता है। सार्वजनिक छवि परिष्कृत और आकर्षक है। सौंदर्यबोध और सामाजिक शिष्टता से सफलता आती है।',
    },
    keywords: ['career', 'fashion', 'entertainment', 'diplomacy', 'fame'],
  },
  {
    planetId: 5,
    house: 11,
    source: 'BPHS Ch.24, Shloka 141-142',
    verse: {
      en: 'Venus in the eleventh makes the native wealthy, enjoying all pleasures, and endowed with conveyances. Desires for luxury and pleasure are fulfilled through social connections.',
      hi: 'एकादश भाव में शुक्र जातक को धनवान, सभी सुखों का भोगी और वाहनयुक्त बनाता है। विलास और आनंद की इच्छाएं सामाजिक संबंधों से पूर्ण होती हैं।',
    },
    interpretation: {
      en: 'Abundant gains through social connections, especially with women. Luxury items and pleasures are easily attained. Friendships are warm, sociable, and mutually beneficial. Material desires are fulfilled.',
      hi: 'सामाजिक संबंधों से प्रचुर लाभ, विशेषकर स्त्रियों से। विलास वस्तुएं और सुख सहज प्राप्त होते हैं। मित्रता स्नेहपूर्ण, मिलनसार और परस्पर लाभकारी है। भौतिक इच्छाएं पूर्ण होती हैं।',
    },
    keywords: ['gains', 'luxury', 'social-life', 'pleasure', 'friends'],
  },
  {
    planetId: 5,
    house: 12,
    source: 'BPHS Ch.24, Shloka 143-144',
    verse: {
      en: 'Venus in the twelfth gives bed pleasures, wealth, and luxuries. Pleasures abroad, rich fantasy life, and spiritual love are indicated.',
      hi: 'द्वादश भाव में शुक्र शय्या सुख, धन और विलासिता देता है। विदेश में आनंद, समृद्ध कल्पना जीवन और आध्यात्मिक प्रेम संकेतित है।',
    },
    interpretation: {
      en: 'Expenditure on luxury, pleasures, and foreign travel. Rich imaginative and dream life. Romance with foreign partners. Spiritual devotion through beauty, art, and love. One of the best placements for Venus.',
      hi: 'विलास, आनंद और विदेश यात्रा पर व्यय। समृद्ध कल्पनाशील और स्वप्न जीवन। विदेशी साथियों से प्रेम। सौंदर्य, कला और प्रेम से आध्यात्मिक भक्ति। शुक्र के लिए सर्वोत्तम स्थितियों में से एक।',
    },
    keywords: ['luxury', 'foreign-pleasure', 'dreams', 'spirituality', 'love'],
  },

  // ──────────────────────────────────────────────
  // SATURN (id: 6) in Houses 1-12
  // ──────────────────────────────────────────────
  {
    planetId: 6,
    house: 1,
    source: 'BPHS Ch.24, Shloka 145-146',
    verse: {
      en: 'Saturn in the ascendant makes the native sickly, lean, lazy, without good qualities, and away from home during childhood. A serious and disciplined personality develops over time.',
      hi: 'लग्न में शनि जातक को रोगी, दुबला, आलसी, गुणहीन और बचपन में घर से दूर बनाता है। समय के साथ गम्भीर और अनुशासित व्यक्तित्व विकसित होता है।',
    },
    interpretation: {
      en: 'Life improves with age — hardship in youth builds resilience. Serious demeanor masks deep wisdom. Health challenges require discipline. Success comes late but is lasting and well-earned.',
      hi: 'उम्र के साथ जीवन बेहतर होता है — युवावस्था में कठिनाई लचीलापन बनाती है। गम्भीर व्यवहार गहरी बुद्धि छुपाता है। स्वास्थ्य चुनौतियों के लिए अनुशासन आवश्यक है। सफलता देर से आती है किन्तु स्थायी और सुयोग्य होती है।',
    },
    keywords: ['discipline', 'hardship', 'resilience', 'late-success'],
  },
  {
    planetId: 6,
    house: 2,
    source: 'BPHS Ch.24, Shloka 147-148',
    verse: {
      en: 'Saturn in the second deprives the native of wealth and family happiness, brings accusations, and gives an unpleasant face. Delayed prosperity through persistent hard work is indicated.',
      hi: 'द्वितीय भाव में शनि जातक को धन और पारिवारिक सुख से वंचित करता है, आरोप लगाता है और अप्रिय मुखाकृति देता है। निरंतर कठोर परिश्रम से विलम्बित समृद्धि संकेतित है।',
    },
    interpretation: {
      en: 'Wealth comes slowly but steadily through persistent effort. Speech is measured and sometimes harsh. Family responsibilities feel burdensome. Financial discipline and savings are essential for security.',
      hi: 'धन धीरे-धीरे किन्तु स्थिर रूप से निरंतर प्रयास से आता है। वाणी नपी-तुली और कभी-कभी कठोर होती है। पारिवारिक जिम्मेदारियां बोझिल लगती हैं। सुरक्षा के लिए वित्तीय अनुशासन और बचत आवश्यक है।',
    },
    keywords: ['delayed-wealth', 'discipline', 'family', 'persistence'],
  },
  {
    planetId: 6,
    house: 3,
    source: 'BPHS Ch.24, Shloka 149-150',
    verse: {
      en: 'Saturn in the third makes the native intelligent, wealthy, with a difficult spouse, lazy, yet valorous. Determination and persistence despite early challenges are indicated.',
      hi: 'तृतीय भाव में शनि जातक को बुद्धिमान, धनवान, कठिन पत्नी वाला, आलसी किन्तु वीर बनाता है। प्रारम्भिक चुनौतियों के बावजूद दृढ़ता और धैर्य संकेतित है।',
    },
    interpretation: {
      en: 'Methodical and patient communicator. Siblings may face hardships or be older. Success in structured writing, documentation, or research. Courage develops through overcoming obstacles.',
      hi: 'व्यवस्थित और धैर्यवान संवादकर्ता। भाई-बहनों को कठिनाइयां हो सकती हैं या वे बड़े हो सकते हैं। संरचित लेखन, प्रलेखन या शोध में सफलता। बाधाओं पर विजय से साहस विकसित होता है।',
    },
    keywords: ['patience', 'determination', 'siblings', 'documentation'],
  },
  {
    planetId: 6,
    house: 4,
    source: 'BPHS Ch.24, Shloka 151-152',
    verse: {
      en: 'Saturn in the fourth deprives the native of house, land, mother, friends, and happiness. Domestic happiness is delayed but eventual stable property comes through sustained effort.',
      hi: 'चतुर्थ भाव में शनि जातक को गृह, भूमि, माता, मित्र और सुख से वंचित करता है। घरेलू सुख में विलम्ब होता है किन्तु निरंतर प्रयास से अंततः स्थिर संपत्ति मिलती है।',
    },
    interpretation: {
      en: 'Domestic happiness is delayed — property ownership comes late in life. Relationship with the mother may be burdened by duty. Old, traditional, or structurally sound homes appeal. Inner peace requires lifelong effort.',
      hi: 'घरेलू सुख में विलम्ब — संपत्ति स्वामित्व जीवन में देर से आता है। माता से संबंध कर्तव्य से भारित हो सकता है। पुराने, पारम्परिक या संरचनात्मक रूप से मजबूत घर आकर्षित करते हैं। आंतरिक शांति के लिए आजीवन प्रयास आवश्यक है।',
    },
    keywords: ['delayed-property', 'mother', 'duty', 'tradition'],
  },
  {
    planetId: 6,
    house: 5,
    source: 'BPHS Ch.24, Shloka 153-154',
    verse: {
      en: 'Saturn in the fifth deprives the native of wealth and children, and makes one wicked. If well-aspected, serious-minded offspring and deep learning are indicated.',
      hi: 'पंचम भाव में शनि जातक को धन और संतान से वंचित करता है और दुष्ट बनाता है। शुभ दृष्टि होने पर गम्भीर विचारों वाली संतान और गहन विद्या संकेतित है।',
    },
    interpretation: {
      en: 'Children may come late or require extra responsibility. Education requires discipline and persistence. Creative expression is structured — architecture, classical music, or formal writing. Investment approach is conservative.',
      hi: 'संतान देर से आ सकती है या अतिरिक्त जिम्मेदारी मांगती है। शिक्षा में अनुशासन और धैर्य आवश्यक है। रचनात्मक अभिव्यक्ति संरचित है — वास्तुकला, शास्त्रीय संगीत या औपचारिक लेखन। निवेश दृष्टिकोण रूढ़िवादी है।',
    },
    keywords: ['delayed-children', 'discipline', 'education', 'structure'],
  },
  {
    planetId: 6,
    house: 6,
    source: 'BPHS Ch.24, Shloka 155-156',
    verse: {
      en: 'Saturn in the sixth makes the native a glutton, wealthy, vanquisher of enemies, and arrogant. Overcoming long-term obstacles through service with gradual recognition is indicated.',
      hi: 'षष्ठ भाव में शनि जातक को पेटू, धनवान, शत्रुओं का विजेता और अहंकारी बनाता है। सेवा के माध्यम से दीर्घकालिक बाधाओं पर विजय और क्रमिक मान्यता संकेतित है।',
    },
    interpretation: {
      en: 'Excellent for overcoming chronic enemies, debts, and diseases through sustained effort. Success in labor, service, or structured work environments. Health improves through disciplined routine.',
      hi: 'निरंतर प्रयास से चिरकालिक शत्रुओं, ऋणों और रोगों पर विजय के लिए उत्कृष्ट। श्रम, सेवा या संरचित कार्य वातावरण में सफलता। अनुशासित दिनचर्या से स्वास्थ्य सुधरता है।',
    },
    keywords: ['service', 'enemies', 'discipline', 'chronic-health'],
  },
  {
    planetId: 6,
    house: 7,
    source: 'BPHS Ch.24, Shloka 157-158',
    verse: {
      en: 'Saturn in the seventh causes aimless wandering, a sickly or older spouse, and lack of happiness. Marriage is delayed, or the spouse is mature and responsible.',
      hi: 'सप्तम भाव में शनि निरुद्देश्य भटकना, रोगी या वृद्ध पत्नी और सुख का अभाव देता है। विवाह में विलम्ब होता है, या पत्नी परिपक्व और जिम्मेदार होती है।',
    },
    interpretation: {
      en: 'Marriage is delayed but often stable once it occurs. Partner may be older, mature, or from a different background. Business partnerships require clear contracts. Loyalty is tested but rewarded.',
      hi: 'विवाह में विलम्ब होता है किन्तु होने पर प्रायः स्थिर होता है। साथी बड़ी उम्र का, परिपक्व या भिन्न पृष्ठभूमि का हो सकता है। व्यापारिक साझेदारी में स्पष्ट अनुबंध आवश्यक हैं। निष्ठा परीक्षित होती है किन्तु पुरस्कृत।',
    },
    keywords: ['delayed-marriage', 'mature-spouse', 'contracts', 'loyalty'],
  },
  {
    planetId: 6,
    house: 8,
    source: 'BPHS Ch.24, Shloka 159-160',
    verse: {
      en: 'Saturn in the eighth makes the native sickly, thievish, short-tempered, and with few friends. However, longevity is often granted, along with deep research interests.',
      hi: 'अष्टम भाव में शनि जातक को रोगी, चोर प्रवृत्ति, क्रोधी और अल्प मित्रों वाला बनाता है। तथापि, दीर्घायु प्रायः प्राप्त होती है, साथ ही गहन शोध रुचि।',
    },
    interpretation: {
      en: 'Long life but marked by chronic health challenges. Interest in mining, archaeology, or deep research. Inheritance may come with complications. Transformation through enduring hardship and patience.',
      hi: 'दीर्घायु किन्तु चिरकालिक स्वास्थ्य चुनौतियों से चिह्नित। खनन, पुरातत्व या गहन शोध में रुचि। उत्तराधिकार जटिलताओं के साथ आ सकता है। कठिनाई और धैर्य सहकर परिवर्तन।',
    },
    keywords: ['longevity', 'chronic-health', 'research', 'endurance'],
  },
  {
    planetId: 6,
    house: 9,
    source: 'BPHS Ch.24, Shloka 161-162',
    verse: {
      en: 'Saturn in the ninth deprives the native of fortune, children, and wealth, and makes one irreligious. If well-aspected, disciplined spiritual practice and thorough higher education are indicated.',
      hi: 'नवम भाव में शनि जातक को भाग्य, संतान और धन से वंचित करता है और अधार्मिक बनाता है। शुभ दृष्टि होने पर अनुशासित आध्यात्मिक साधना और सम्पूर्ण उच्च शिक्षा संकेतित है।',
    },
    interpretation: {
      en: 'Structured approach to religion and philosophy — orthodox or traditional paths. Relationship with the father may be distant or burdened by duty. Higher education takes effort but yields lasting results.',
      hi: 'धर्म और दर्शन के प्रति संरचित दृष्टिकोण — रूढ़िवादी या पारम्परिक मार्ग। पिता से संबंध दूर या कर्तव्य से भारित हो सकता है। उच्च शिक्षा में प्रयास लगता है किन्तु स्थायी परिणाम देती है।',
    },
    keywords: ['traditional-dharma', 'father', 'discipline', 'education'],
  },
  {
    planetId: 6,
    house: 10,
    source: 'BPHS Ch.24, Shloka 163-164',
    verse: {
      en: 'Saturn in the tenth makes the native a king or minister, wealthy, famous, and of charitable disposition. Career success through steady effort in structured institutions is strongly indicated.',
      hi: 'दशम भाव में शनि जातक को राजा या मंत्री, धनवान, प्रसिद्ध और दानशील स्वभाव का बनाता है। संरचित संस्थानों में स्थिर प्रयास से करियर में सफलता दृढ़ता से संकेतित है।',
    },
    interpretation: {
      en: 'Powerful placement for career — authority earned through sustained effort. Government, administration, law, or large organizations suit you. Rise is slow but position is unshakeable once attained.',
      hi: 'करियर के लिए शक्तिशाली स्थिति — निरंतर प्रयास से अर्जित अधिकार। सरकार, प्रशासन, कानून या बड़े संगठन आपके अनुकूल हैं। उन्नति धीमी किन्तु एक बार प्राप्त होने पर स्थिति अटल है।',
    },
    keywords: ['career', 'authority', 'government', 'persistence', 'structure'],
  },
  {
    planetId: 6,
    house: 11,
    source: 'BPHS Ch.24, Shloka 165-166',
    verse: {
      en: 'Saturn in the eleventh makes the native long-lived, wealthy, happy, powerful, and with many servants. Persistent effort brings lasting gains and long-term goal achievement.',
      hi: 'एकादश भाव में शनि जातक को दीर्घायु, धनवान, सुखी, शक्तिशाली और अनेक सेवकों वाला बनाता है। निरंतर प्रयास स्थायी लाभ और दीर्घकालिक लक्ष्य पूर्ति लाता है।',
    },
    interpretation: {
      en: 'One of the best placements for Saturn — steady, long-term gains. Friendships with older, experienced individuals. Income grows consistently over decades. Goals are achieved through patience and structured planning.',
      hi: 'शनि के लिए सर्वोत्तम स्थितियों में से एक — स्थिर, दीर्घकालिक लाभ। वृद्ध, अनुभवी व्यक्तियों से मित्रता। आय दशकों में निरंतर बढ़ती है। धैर्य और संरचित योजना से लक्ष्य प्राप्त होते हैं।',
    },
    keywords: ['long-term-gains', 'patience', 'elder-friends', 'goals'],
  },
  {
    planetId: 6,
    house: 12,
    source: 'BPHS Ch.24, Shloka 167-168',
    verse: {
      en: 'Saturn in the twelfth deprives the native of wealth and happiness, makes one sinful, and may give defective limbs. If well-aspected, foreign residence and spiritual discipline are indicated.',
      hi: 'द्वादश भाव में शनि जातक को धन और सुख से वंचित करता है, पापी बनाता है और अंग दोष दे सकता है। शुभ दृष्टि होने पर विदेश निवास और आध्यात्मिक अनुशासन संकेतित है।',
    },
    interpretation: {
      en: 'Expenditure exceeds income unless carefully managed. Isolation or foreign residence may occur. Service in hospitals, prisons, or charitable institutions. Deep spiritual discipline and eventual detachment bring peace.',
      hi: 'सावधानीपूर्वक प्रबंधन के बिना व्यय आय से अधिक होता है। एकांत या विदेश निवास हो सकता है। अस्पतालों, कारागारों या दानार्थ संस्थानों में सेवा। गहन आध्यात्मिक अनुशासन और अंततः वैराग्य शांति लाता है।',
    },
    keywords: ['expenditure', 'isolation', 'foreign-residence', 'spiritual-discipline'],
  },
];

/**
 * Lookup helper: get the verse entry for a specific planet + house combination.
 * Returns undefined if not found (e.g., for Rahu/Ketu which are not in this file).
 */
export function getPlanetHouseVerse(
  planetId: number,
  house: number,
): PlanetHouseVerse | undefined {
  return PLANET_HOUSE_VERSES.find(
    (v) => v.planetId === planetId && v.house === house,
  );
}

/**
 * Lookup helper: get all 12 house entries for a given planet.
 */
export function getVersesForPlanet(planetId: number): PlanetHouseVerse[] {
  return PLANET_HOUSE_VERSES.filter((v) => v.planetId === planetId);
}

/**
 * Graha Shanti Puja Vidhi — Remedial prescriptions for the 9 Navagrahas
 * Reference: Navagraha Stotra (attributed to Vyasa), BPHS Ch.3, traditional puja vidhis
 *
 * Each planet has: presiding deity, beeja/stotra mantra, gemstone, metal,
 * day, color, grain, flower, direction, and fasting notes.
 */

export interface GrahaShanti {
  planetId: number;  // 0-8 (Sun through Ketu)
  deity: { en: string; hi: string; sa: string };
  mantra: {
    text: string;        // Sanskrit mantra in Devanagari
    meaning: { en: string; hi: string };
    count: number;       // Recommended japa count
  };
  gemstone: { en: string; hi: string };
  metal: { en: string; hi: string };
  day: { en: string; hi: string };
  color: { en: string; hi: string };
  grain: { en: string; hi: string };
  flower: { en: string; hi: string };
  direction: { en: string; hi: string };
  fastNote: { en: string; hi: string };
}

export const GRAHA_SHANTI: GrahaShanti[] = [
  // ─── SUN (0) ─────────────────────────────────────────────────────────────────
  {
    planetId: 0,
    deity: { en: 'Lord Surya (Sun God)', hi: 'भगवान सूर्य', sa: 'सूर्यदेवः' },
    mantra: {
      text: 'जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम्। तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥',
      meaning: {
        en: 'I bow to the Sun, who shines like the hibiscus flower, born of Kashyapa, of great brilliance, enemy of darkness, and destroyer of all sins.',
        hi: 'मैं दिवाकर सूर्य को प्रणाम करता हूँ जो जपाकुसुम (गुड़हल) के समान कांतिमान, कश्यप के पुत्र, महातेजस्वी, अंधकार के शत्रु और समस्त पापों के नाशक हैं।',
      },
      count: 7000,
    },
    gemstone: { en: 'Ruby (Manikya)', hi: 'माणिक्य' },
    metal: { en: 'Gold', hi: 'स्वर्ण' },
    day: { en: 'Sunday', hi: 'रविवार' },
    color: { en: 'Red / Copper', hi: 'लाल / ताम्र' },
    grain: { en: 'Wheat', hi: 'गेहूँ' },
    flower: { en: 'Red Lotus / Hibiscus', hi: 'लाल कमल / गुड़हल' },
    direction: { en: 'East', hi: 'पूर्व' },
    fastNote: {
      en: 'Fast on Sundays. Eat one meal before sunset, preferably wheat-based. Offer water (arghya) to the rising sun.',
      hi: 'रविवार को व्रत रखें। सूर्यास्त से पहले एक बार गेहूँ-आधारित भोजन करें। उदित सूर्य को अर्घ्य दें।',
    },
  },

  // ─── MOON (1) ────────────────────────────────────────────────────────────────
  {
    planetId: 1,
    deity: { en: 'Lord Chandra (Moon God)', hi: 'भगवान चन्द्र', sa: 'चन्द्रदेवः' },
    mantra: {
      text: 'दधिशंखतुषाराभं क्षीरोदार्णवसम्भवम्। नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम्॥',
      meaning: {
        en: 'I bow to the Moon, who is white like curd, conch, and snow, born from the ocean of milk, and who adorns the crest of Lord Shiva.',
        hi: 'मैं चन्द्रमा को नमन करता हूँ जो दही, शंख और तुषार के समान श्वेत, क्षीरसागर से उत्पन्न और शम्भु के मुकुट की भूषा हैं।',
      },
      count: 11000,
    },
    gemstone: { en: 'Pearl (Moti)', hi: 'मोती' },
    metal: { en: 'Silver', hi: 'चाँदी' },
    day: { en: 'Monday', hi: 'सोमवार' },
    color: { en: 'White', hi: 'श्वेत' },
    grain: { en: 'Rice', hi: 'चावल' },
    flower: { en: 'White Lotus', hi: 'श्वेत कमल' },
    direction: { en: 'Northwest', hi: 'वायव्य (उत्तर-पश्चिम)' },
    fastNote: {
      en: 'Fast on Mondays. Consume only milk-based foods or fruits. Offer water mixed with milk to Shiva Linga.',
      hi: 'सोमवार को व्रत रखें। केवल दुग्ध-आधारित भोजन या फल ग्रहण करें। शिवलिंग पर दुग्ध-मिश्रित जल चढ़ाएँ।',
    },
  },

  // ─── MARS (2) ────────────────────────────────────────────────────────────────
  {
    planetId: 2,
    deity: { en: 'Lord Mangal (Kartikeya / Hanuman)', hi: 'भगवान मंगल (कार्तिकेय / हनुमान)', sa: 'मङ्गलदेवः' },
    mantra: {
      text: 'धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम्। कुमारं शक्तिहस्तं च मंगलं प्रणमाम्यहम्॥',
      meaning: {
        en: 'I bow to Mars, born of the Earth, with the brilliance of lightning, youthful, holding a spear in hand.',
        hi: 'मैं मंगल को प्रणाम करता हूँ जो पृथ्वी के गर्भ से जन्मे, विद्युत के समान कांतिमान, कुमार रूप, शक्ति (भाला) हस्त में धारण किए हैं।',
      },
      count: 10000,
    },
    gemstone: { en: 'Red Coral (Moonga)', hi: 'मूँगा' },
    metal: { en: 'Copper', hi: 'ताँबा' },
    day: { en: 'Tuesday', hi: 'मंगलवार' },
    color: { en: 'Red', hi: 'लाल' },
    grain: { en: 'Masoor Dal (Red Lentil)', hi: 'मसूर दाल' },
    flower: { en: 'Red Flower (Hibiscus / Red Oleander)', hi: 'लाल पुष्प (गुड़हल / लाल कनेर)' },
    direction: { en: 'South', hi: 'दक्षिण' },
    fastNote: {
      en: 'Fast on Tuesdays. Eat one meal of wheat or jaggery-based sweets. Visit Hanuman temple and offer sindoor.',
      hi: 'मंगलवार को व्रत रखें। गेहूँ या गुड़ की मिठाई का एक भोजन करें। हनुमान मन्दिर जाकर सिन्दूर अर्पित करें।',
    },
  },

  // ─── MERCURY (3) ─────────────────────────────────────────────────────────────
  {
    planetId: 3,
    deity: { en: 'Lord Budha (Vishnu)', hi: 'भगवान बुध (विष्णु)', sa: 'बुधदेवः' },
    mantra: {
      text: 'प्रियंगुकलिकाश्यामं रूपेणाप्रतिमं बुधम्। सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम्॥',
      meaning: {
        en: 'I bow to Mercury, who is dark like the bud of the priyangu plant, of unparalleled beauty, gentle, and endowed with gentle qualities.',
        hi: 'मैं बुध को प्रणाम करता हूँ जो प्रियंगु कली के समान श्यामवर्ण, अनुपम रूपवान, सौम्य और सौम्य गुणों से युक्त हैं।',
      },
      count: 9000,
    },
    gemstone: { en: 'Emerald (Panna)', hi: 'पन्ना' },
    metal: { en: 'Bronze / Brass', hi: 'काँसा / पीतल' },
    day: { en: 'Wednesday', hi: 'बुधवार' },
    color: { en: 'Green', hi: 'हरा' },
    grain: { en: 'Moong Dal (Green Gram)', hi: 'मूँग दाल' },
    flower: { en: 'Durva Grass (Bermuda Grass)', hi: 'दूर्वा (दूब)' },
    direction: { en: 'North', hi: 'उत्तर' },
    fastNote: {
      en: 'Fast on Wednesdays. Eat green vegetables and moong dal. Offer durva grass and green items to Lord Vishnu or Ganesha.',
      hi: 'बुधवार को व्रत रखें। हरी सब्ज़ियाँ और मूँग दाल खाएँ। भगवान विष्णु या गणेश को दूर्वा और हरी वस्तुएँ अर्पित करें।',
    },
  },

  // ─── JUPITER (4) ─────────────────────────────────────────────────────────────
  {
    planetId: 4,
    deity: { en: 'Lord Brihaspati (Guru / Dakshinamurti)', hi: 'भगवान बृहस्पति (गुरु / दक्षिणामूर्ति)', sa: 'बृहस्पतिदेवः' },
    mantra: {
      text: 'देवानां च ऋषीणां च गुरुं कांचनसन्निभम्। बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्॥',
      meaning: {
        en: 'I bow to Jupiter, the guru of gods and sages, golden in appearance, the embodiment of wisdom, and lord of the three worlds.',
        hi: 'मैं बृहस्पति को नमन करता हूँ जो देवताओं और ऋषियों के गुरु, स्वर्ण के समान कांतिमान, बुद्धि के स्वरूप और त्रिलोक के ईश्वर हैं।',
      },
      count: 19000,
    },
    gemstone: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज' },
    metal: { en: 'Gold', hi: 'स्वर्ण' },
    day: { en: 'Thursday', hi: 'गुरुवार' },
    color: { en: 'Yellow', hi: 'पीला' },
    grain: { en: 'Chana Dal (Bengal Gram)', hi: 'चना दाल' },
    flower: { en: 'Yellow Flower (Marigold / Champa)', hi: 'पीला पुष्प (गेंदा / चम्पा)' },
    direction: { en: 'Northeast', hi: 'ईशान (उत्तर-पूर्व)' },
    fastNote: {
      en: 'Fast on Thursdays. Eat yellow foods — chana dal, turmeric rice, banana. Offer yellow flowers and turmeric to Vishnu or one\'s Guru.',
      hi: 'गुरुवार को व्रत रखें। पीले भोजन करें — चना दाल, हल्दी चावल, केला। विष्णु या अपने गुरु को पीले पुष्प और हल्दी अर्पित करें।',
    },
  },

  // ─── VENUS (5) ───────────────────────────────────────────────────────────────
  {
    planetId: 5,
    deity: { en: 'Lord Shukra (Lakshmi / Parashurama)', hi: 'भगवान शुक्र (लक्ष्मी / परशुराम)', sa: 'शुक्रदेवः' },
    mantra: {
      text: 'हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम्। सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम्॥',
      meaning: {
        en: 'I bow to Venus, who shines like the snow, jasmine, and lotus fiber, the supreme guru of the demons, and the expounder of all scriptures.',
        hi: 'मैं भार्गव शुक्र को प्रणाम करता हूँ जो हिम, कुन्द और मृणाल के समान कांतिमान, दैत्यों के परम गुरु और समस्त शास्त्रों के प्रवक्ता हैं।',
      },
      count: 16000,
    },
    gemstone: { en: 'Diamond (Heera)', hi: 'हीरा' },
    metal: { en: 'Silver', hi: 'चाँदी' },
    day: { en: 'Friday', hi: 'शुक्रवार' },
    color: { en: 'White / Cream', hi: 'श्वेत / क्रीम' },
    grain: { en: 'Rice', hi: 'चावल' },
    flower: { en: 'White Flower (Jasmine / White Rose)', hi: 'श्वेत पुष्प (चमेली / सफ़ेद गुलाब)' },
    direction: { en: 'Southeast', hi: 'आग्नेय (दक्षिण-पूर्व)' },
    fastNote: {
      en: 'Fast on Fridays. Eat white foods — rice, milk, curd. Offer white flowers and sweets to Goddess Lakshmi.',
      hi: 'शुक्रवार को व्रत रखें। श्वेत भोजन करें — चावल, दूध, दही। देवी लक्ष्मी को श्वेत पुष्प और मिठाई अर्पित करें।',
    },
  },

  // ─── SATURN (6) ──────────────────────────────────────────────────────────────
  {
    planetId: 6,
    deity: { en: 'Lord Shani (Shiva / Yama)', hi: 'भगवान शनि (शिव / यम)', sa: 'शनैश्चरदेवः' },
    mantra: {
      text: 'नीलांजनसमाभासं रविपुत्रं यमाग्रजम्। छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम्॥',
      meaning: {
        en: 'I bow to Saturn, who is dark blue like collyrium, son of the Sun, elder brother of Yama, born of Chhaya and Surya.',
        hi: 'मैं शनैश्चर को नमन करता हूँ जो नीलांजन (काजल) के समान श्यामवर्ण, सूर्यपुत्र, यम के अग्रज, छाया और सूर्य से उत्पन्न हैं।',
      },
      count: 23000,
    },
    gemstone: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम' },
    metal: { en: 'Iron', hi: 'लोहा' },
    day: { en: 'Saturday', hi: 'शनिवार' },
    color: { en: 'Black / Dark Blue', hi: 'काला / गहरा नीला' },
    grain: { en: 'Urad Dal (Black Gram)', hi: 'उड़द दाल' },
    flower: { en: 'Blue / Purple Flower (Shami leaves)', hi: 'नीला / बैंगनी पुष्प (शमी पत्र)' },
    direction: { en: 'West', hi: 'पश्चिम' },
    fastNote: {
      en: 'Fast on Saturdays. Eat urad dal or sesame-based foods once. Offer mustard oil, iron items, and black cloth to Shani temple. Light a sesame oil lamp.',
      hi: 'शनिवार को व्रत रखें। एक बार उड़द या तिल-आधारित भोजन करें। शनि मन्दिर में सरसों का तेल, लोहे की वस्तुएँ और काला वस्त्र अर्पित करें। तिल के तेल का दीपक जलाएँ।',
    },
  },

  // ─── RAHU (7) ────────────────────────────────────────────────────────────────
  {
    planetId: 7,
    deity: { en: 'Lord Rahu (Durga / Sarpa)', hi: 'भगवान राहु (दुर्गा / सर्प)', sa: 'राहुदेवः' },
    mantra: {
      text: 'अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम्। सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम्॥',
      meaning: {
        en: 'I bow to Rahu, who is half-bodied, of great valor, the eclipser of Sun and Moon, born from the womb of Simhika.',
        hi: 'मैं राहु को प्रणाम करता हूँ जो अर्धकाय, महापराक्रमी, चन्द्र और सूर्य को ग्रसने वाले, सिंहिका के गर्भ से उत्पन्न हैं।',
      },
      count: 18000,
    },
    gemstone: { en: 'Hessonite Garnet (Gomed)', hi: 'गोमेद' },
    metal: { en: 'Mixed Metal (Ashtadhatu / Lead)', hi: 'मिश्र धातु (अष्टधातु / सीसा)' },
    day: { en: 'Saturday', hi: 'शनिवार' },
    color: { en: 'Dark Blue / Smoky', hi: 'गहरा नीला / धूम्र' },
    grain: { en: 'Urad Dal (Black Gram)', hi: 'उड़द दाल' },
    flower: { en: 'Durva Grass / Blue Flower', hi: 'दूर्वा / नीला पुष्प' },
    direction: { en: 'Southwest', hi: 'नैर्ऋत्य (दक्षिण-पश्चिम)' },
    fastNote: {
      en: 'Fast on Saturdays (shared with Shani). Donate urad dal and coconut. Worship Goddess Durga. Feed ants and birds with grains. Avoid non-vegetarian food during the fast.',
      hi: 'शनिवार को व्रत रखें (शनि के साथ)। उड़द दाल और नारियल दान करें। देवी दुर्गा की पूजा करें। चींटियों और पक्षियों को अनाज खिलाएँ। व्रत में माँसाहार वर्जित है।',
    },
  },

  // ─── KETU (8) ────────────────────────────────────────────────────────────────
  {
    planetId: 8,
    deity: { en: 'Lord Ketu (Ganesha / Chitragupta)', hi: 'भगवान केतु (गणेश / चित्रगुप्त)', sa: 'केतुदेवः' },
    mantra: {
      text: 'पलाशपुष्पसंकाशं तारकाग्रहमस्तकम्। रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम्॥',
      meaning: {
        en: 'I bow to Ketu, who is like the Palasha flower in color, the head of stars and planets, fierce, of terrifying nature, and dreadful.',
        hi: 'मैं केतु को प्रणाम करता हूँ जो पलाश पुष्प के समान वर्ण वाले, तारकाओं और ग्रहों के शिरोभूषण, रौद्र, रौद्रात्मक और घोर हैं।',
      },
      count: 17000,
    },
    gemstone: { en: "Cat's Eye (Lehsunia / Vaidurya)", hi: 'लहसुनिया (वैदूर्य)' },
    metal: { en: 'Mixed Metal (Ashtadhatu)', hi: 'मिश्र धातु (अष्टधातु)' },
    day: { en: 'Tuesday', hi: 'मंगलवार' },
    color: { en: 'Grey / Smoky Brown', hi: 'धूसर / धूम्र भूरा' },
    grain: { en: 'Horse Gram (Kulthi)', hi: 'कुलथी (गहत)' },
    flower: { en: 'Kusha Grass / Ashwagandha', hi: 'कुशा / अश्वगंधा' },
    direction: { en: 'Southwest', hi: 'नैर्ऋत्य (दक्षिण-पश्चिम)' },
    fastNote: {
      en: 'Fast on Tuesdays (shared with Mars). Donate blankets and sesame. Worship Lord Ganesha. Feed dogs and offer multi-colored flowers. Recite Ganesha Atharvashirsha.',
      hi: 'मंगलवार को व्रत रखें (मंगल के साथ)। कम्बल और तिल दान करें। भगवान गणेश की पूजा करें। कुत्तों को भोजन दें और बहुरंगी पुष्प अर्पित करें। गणेश अथर्वशीर्ष का पाठ करें।',
    },
  },
];

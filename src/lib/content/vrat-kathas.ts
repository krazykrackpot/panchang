/**
 * Vrat Katha (Fasting Stories) reference data.
 *
 * The full kathas are sacred texts that deserve to be read in their
 * traditional form from authentic sources (family pandit, printed
 * editions, or temple publications). We intentionally do NOT include
 * condensed story text -- only practical reference metadata: when to
 * observe, significance, and vidhi (method).
 */

export interface VratKatha {
  slug: string;
  title: { en: string; hi: string };
  deity: { en: string; hi: string };
  linkedFestivalSlugs: string[];
  /** 2-3 sentence significance / overview */
  overview: { en: string; hi: string };
  /** When to observe — tithi, month, weekday, etc. */
  whenObserved: { en: string; hi: string };
  /** Benefits of observing the vrat */
  phal: { en: string; hi: string };
  /** Step-by-step method */
  vidhi: { en: string; hi: string };
}

export const VRAT_KATHAS: VratKatha[] = [
  // ─── 1. Ekadashi Vrat ─────────────────────────────────
  {
    slug: 'ekadashi',
    title: { en: 'Ekadashi Vrat', hi: 'एकादशी व्रत' },
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु' },
    linkedFestivalSlugs: ['ekadashi'],
    overview: {
      en: 'Ekadashi is the most important Vaishnava fasting day, observed on the 11th tithi of both lunar fortnights. The vrat honours Lord Vishnu and is believed to destroy all sins and grant liberation. The story of Ekadashi\'s origin and King Ambarish\'s devotion is narrated in the Bhagavata Purana.',
      hi: 'एकादशी सबसे महत्वपूर्ण वैष्णव व्रत है, दोनों पक्षों की 11वीं तिथि को मनाया जाता है। यह व्रत भगवान विष्णु को समर्पित है और सभी पापों को नष्ट कर मोक्ष प्रदान करता है। एकादशी की उत्पत्ति और राजा अम्बरीष की भक्ति की कथा भागवत पुराण में वर्णित है।',
    },
    whenObserved: {
      en: 'Twice every lunar month — on the 11th tithi (Ekadashi) of both Shukla Paksha and Krishna Paksha. 24 Ekadashis per year (26 in an Adhika Masa year). Each Ekadashi has a unique name and significance.',
      hi: 'प्रत्येक चन्द्र मास में दो बार — शुक्ल पक्ष और कृष्ण पक्ष दोनों की 11वीं तिथि (एकादशी) को। वर्ष में 24 एकादशी (अधिक मास वर्ष में 26)। प्रत्येक एकादशी का अद्वितीय नाम और महत्व है।',
    },
    phal: {
      en: 'Observing Ekadashi with devotion destroys all sins, including Brahmahatya. The devotee attains Vaikuntha after death. Regular fasting brings health, mental clarity, spiritual progress, and protection from negative forces. The merit of observing all 24 Ekadashis equals performing an Ashwamedha Yajna.',
      hi: 'श्रद्धापूर्वक एकादशी व्रत करने से ब्रह्महत्या सहित सभी पाप नष्ट होते हैं। भक्त मृत्यु के बाद वैकुण्ठ प्राप्त करता है। नियमित व्रत स्वास्थ्य, मानसिक स्पष्टता, आध्यात्मिक उन्नति और नकारात्मक शक्तियों से सुरक्षा प्रदान करता है।',
    },
    vidhi: {
      en: 'Begin the fast on Dashami night — eat a simple sattvic meal before sunset. On Ekadashi, wake before sunrise, bathe, and worship Lord Vishnu with tulsi leaves, flowers, and incense. Chant the Vishnu Sahasranama or "Om Namo Bhagavate Vasudevaya." Avoid all grains, beans, rice, wheat, and lentils. Permitted: fruits, nuts, milk, root vegetables, sabudana, and rock salt. Maintain silence and devotion throughout the day. Perform night vigil (jagran) if possible. Break the fast (Parana) the next day after sunrise within the prescribed Dwadashi window.',
      hi: 'दशमी की रात से व्रत आरम्भ करें — सूर्यास्त से पहले सात्विक भोजन करें। एकादशी के दिन सूर्योदय से पहले उठें, स्नान करें, तुलसी पत्र, पुष्प और धूप से भगवान विष्णु की पूजा करें। विष्णु सहस्रनाम या "ॐ नमो भगवते वासुदेवाय" का जाप करें। सभी अनाज, दाल, चावल, गेहूं से परहेज करें। फल, मेवे, दूध, कंदमूल, साबूदाना और सेंधा नमक खा सकते हैं। दिन भर मौन और भक्ति बनाए रखें। अगले दिन सूर्योदय के बाद निर्धारित द्वादशी काल में पारण करें।',
    },
  },

  // ─── 2. Satyanarayan Vrat ──────────────────────────────
  {
    slug: 'satyanarayan',
    title: { en: 'Satyanarayan Vrat', hi: 'सत्यनारायण व्रत' },
    deity: { en: 'Lord Satyanarayan (Vishnu)', hi: 'भगवान सत्यनारायण (विष्णु)' },
    linkedFestivalSlugs: ['satyanarayan'],
    overview: {
      en: 'The Satyanarayan Katha is a five-chapter narrative from the Skanda Purana, narrated by Lord Vishnu to Narada Muni. It teaches the importance of keeping one\'s vows and respecting prasad through the stories of a woodcutter, merchant Sadhu, King Ulkamukha, and Kalavati. The complete katha is traditionally recited during the puja with family gathered.',
      hi: 'सत्यनारायण कथा स्कन्द पुराण से पांच अध्यायों की कथा है, जो भगवान विष्णु ने नारद मुनि को सुनाई। यह लकड़हारे, व्यापारी साधु, राजा उल्कामुख और कलावती की कथाओं के माध्यम से संकल्प पालन और प्रसाद सम्मान का महत्व सिखाती है। पूर्ण कथा परम्परागत रूप से परिवार सहित पूजा के दौरान पढ़ी जाती है।',
    },
    whenObserved: {
      en: 'Typically on Purnima (full moon day), especially after auspicious events: buying a new home, starting a business, childbirth, marriage, or any significant milestone. Can be performed on any auspicious day.',
      hi: 'सामान्यतः पूर्णिमा को, विशेषकर शुभ अवसरों पर: नया घर खरीदने, व्यापार आरम्भ, सन्तान जन्म, विवाह, या किसी महत्वपूर्ण उपलब्धि पर। किसी भी शुभ दिन कर सकते हैं।',
    },
    phal: {
      en: 'Performing Satyanarayan Puja brings prosperity, removes obstacles, fulfills wishes, and grants peace of mind. The collective merit extends to all family members and participants.',
      hi: 'सत्यनारायण पूजा करने से समृद्धि आती है, बाधाएं दूर होती हैं, मनोकामनाएं पूर्ण होती हैं, और मानसिक शांति मिलती है।',
    },
    vidhi: {
      en: 'Clean the puja area and place a kalash filled with water, topped with mango leaves and a coconut. Prepare prasad: mix wheat flour, sugar, ghee, and banana to make sheera/lapsi. Place Lord Satyanarayan\'s image, light a ghee diya and incense. Recite all five chapters of the katha with family gathered. After each chapter, offer panchamrit and flowers. Distribute prasad to all present — never discard or disrespect the prasad. The puja can be performed by anyone regardless of caste, gender, or wealth.',
      hi: 'पूजा स्थान साफ करें और जल से भरा कलश रखें, ऊपर आम के पत्ते और नारियल। प्रसाद तैयार करें: गेहूं का आटा, चीनी, घी और केला मिलाकर शीरा/लपसी बनाएं। भगवान सत्यनारायण की मूर्ति/चित्र स्थापित करें, घी का दीया और धूप जलाएं। परिवार सहित सभी पांच अध्यायों का पाठ करें। प्रत्येक अध्याय के बाद पंचामृत और पुष्प अर्पित करें। उपस्थित सभी को प्रसाद वितरित करें — कभी प्रसाद का अनादर न करें।',
    },
  },

  // ─── 3. Karva Chauth ───────────────────────────────────
  {
    slug: 'karva-chauth',
    title: { en: 'Karva Chauth Vrat', hi: 'करवा चौथ व्रत' },
    deity: { en: 'Lord Shiva & Parvati', hi: 'भगवान शिव एवं पार्वती' },
    linkedFestivalSlugs: [],
    overview: {
      en: 'Karva Chauth is a day-long fast observed by married women for the longevity and well-being of their husbands. The katha tells the story of Queen Veeravati, whose brothers tricked her into breaking her fast before moonrise with a false moon, leading to her husband\'s death — and her year-long penance to restore him through Parvati\'s grace.',
      hi: 'करवा चौथ विवाहित स्त्रियों द्वारा पति की दीर्घायु और कल्याण हेतु रखा जाने वाला दिनभर का व्रत है। कथा रानी वीरावती की है, जिसके भाइयों ने उसे झूठे चांद से छलकर चन्द्रोदय से पहले व्रत तुड़वा दिया, जिससे उसके पति की मृत्यु हो गई — और पार्वती की कृपा से उसने वर्षभर तपस्या कर पति को पुनर्जीवित किया।',
    },
    whenObserved: {
      en: 'Kartik Krishna Chaturthi (4th day of waning moon in Kartik month) — typically October/November. Observed from sunrise to moonrise.',
      hi: 'कार्तिक कृष्ण चतुर्थी — सामान्यतः अक्टूबर/नवम्बर। सूर्योदय से चन्द्रोदय तक व्रत।',
    },
    phal: {
      en: 'Observing Karva Chauth with sincere devotion ensures the husband\'s long life, good health, and prosperity. It strengthens the marital bond and the couple receives the blessings of Shiva and Parvati.',
      hi: 'श्रद्धापूर्वक करवा चौथ व्रत करने से पति की दीर्घायु, स्वास्थ्य और समृद्धि सुनिश्चित होती है। यह वैवाहिक बन्धन को सुदृढ़ करता है।',
    },
    vidhi: {
      en: 'Wake before sunrise, eat sargi (pre-dawn meal prepared by mother-in-law). Fast without food or water from sunrise to moonrise. Apply mehndi and wear bridal attire. In the evening, gather with other women to listen to the Karva Chauth Katha. Prepare a puja thali with a karva (earthen pot), diya, sweets, and offerings. When the moon rises, view it through a sieve, then look at the husband\'s face through the sieve. The husband offers water and the first bite of food to break the fast.',
      hi: 'सूर्योदय से पहले उठें, सरगी (सास द्वारा तैयार भोर का भोजन) खाएं। सूर्योदय से चन्द्रोदय तक बिना अन्न-जल के व्रत रखें। मेहंदी लगाएं और दुल्हन जैसा श्रृंगार करें। सन्ध्या में अन्य महिलाओं के साथ करवा चौथ कथा सुनें। करवा (मिट्टी का बर्तन), दीया, मिठाई सहित पूजा थाली तैयार करें। चन्द्रोदय पर छलनी से चांद देखें, फिर छलनी से पति का चेहरा देखें। पति जल और पहला ग्रास देकर व्रत तोड़वाएं।',
    },
  },

  // ─── 4. Somvar Vrat ────────────────────────────────────
  {
    slug: 'somvar-vrat',
    title: { en: 'Somvar Vrat (Monday Fast)', hi: 'सोमवार व्रत' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    linkedFestivalSlugs: ['somvar-vrat'],
    overview: {
      en: 'The Somvar Vrat is observed on Mondays in devotion to Lord Shiva. The katha tells the story of a childless couple whose years of Monday fasting pleased Shiva, who granted them a son with a limited lifespan — later extended through divine grace when the family\'s devotion proved unwavering.',
      hi: 'सोमवार व्रत भगवान शिव की भक्ति में सोमवार को रखा जाता है। कथा एक निःसन्तान दम्पती की है जिनके वर्षों के सोमवार व्रत से प्रसन्न होकर शिव ने उन्हें सीमित आयु का पुत्र दिया — जो बाद में परिवार की अटल भक्ति से दिव्य कृपा द्वारा बढ़ाई गई।',
    },
    whenObserved: {
      en: 'Every Monday. Best observed for 16 consecutive Mondays (Solah Somvar Vrat) for maximum benefit, especially during Shravan month (July-August).',
      hi: 'प्रत्येक सोमवार। श्रेष्ठ फल हेतु 16 सोमवार लगातार (सोलह सोमवार व्रत), विशेषकर श्रावण मास (जुलाई-अगस्त) में।',
    },
    phal: {
      en: 'Monday fasting pleases Lord Shiva and grants fulfillment of desires, good health, removal of obstacles in marriage, progeny, and spiritual growth. Sixteen consecutive Mondays is considered particularly powerful.',
      hi: 'सोमवार व्रत से भगवान शिव प्रसन्न होते हैं और मनोकामना पूर्ति, स्वास्थ्य, विवाह में बाधा निवारण, सन्तान, और आध्यात्मिक उन्नति प्रदान करते हैं।',
    },
    vidhi: {
      en: 'Wake early, bathe, and visit a Shiva temple. Offer bilva leaves, white flowers, dhatura, milk, and water for abhishek. Light a ghee diya and incense. Chant "Om Namah Shivaya" 108 times. Eat one meal after sunset — preferably fruits, milk, or a simple vegetarian meal without salt (in strict observance). Observe for 16 consecutive Mondays for best results. On the final Monday, feed 5 Brahmins and donate white items (rice, cloth, silver).',
      hi: 'सवेरे उठें, स्नान करें, शिव मन्दिर जाएं। बिल्वपत्र, श्वेत पुष्प, धतूरा, दूध और जल से अभिषेक करें। घी का दीया और धूप जलाएं। "ॐ नमः शिवाय" का 108 बार जाप करें। सूर्यास्त के बाद एक समय भोजन करें। श्रेष्ठ फल हेतु 16 सोमवार लगातार करें। अन्तिम सोमवार 5 ब्राह्मणों को भोजन कराएं और श्वेत वस्तुएं दान करें।',
    },
  },

  // ─── 5. Mangalvar Vrat ─────────────────────────────────
  {
    slug: 'mangalvar-vrat',
    title: { en: 'Mangalvar Vrat (Tuesday Fast)', hi: 'मंगलवार व्रत' },
    deity: { en: 'Lord Hanuman', hi: 'भगवान हनुमान' },
    linkedFestivalSlugs: [],
    overview: {
      en: 'The Mangalvar Vrat is observed on Tuesdays in devotion to Lord Hanuman. The katha narrates how a poor Brahmin\'s wife, through her unwavering Tuesday fasts, received Hanuman\'s blessing in the form of a hidden treasure — and how a greedy king who troubled the devotee was punished and then reformed.',
      hi: 'मंगलवार व्रत भगवान हनुमान की भक्ति में मंगलवार को रखा जाता है। कथा बताती है कैसे एक निर्धन ब्राह्मण की पत्नी ने अपने अटल मंगलवार व्रतों से हनुमान का आशीर्वाद छिपे खजाने के रूप में प्राप्त किया — और कैसे भक्त को कष्ट देने वाले लोभी राजा को दण्ड मिला और फिर सुधार हुआ।',
    },
    whenObserved: {
      en: 'Every Tuesday. Best observed for 21 consecutive Tuesdays for full effect.',
      hi: 'प्रत्येक मंगलवार। पूर्ण फल हेतु 21 मंगलवार लगातार।',
    },
    phal: {
      en: 'Tuesday fasting for Hanuman grants courage, physical strength, victory over enemies, freedom from debt and legal troubles, and protection from evil forces. It is especially powerful during Mangal Dosha periods.',
      hi: 'हनुमान के लिए मंगलवार व्रत करने से साहस, शारीरिक बल, शत्रुओं पर विजय, ऋण और कानूनी समस्याओं से मुक्ति, और बुरी शक्तियों से सुरक्षा मिलती है।',
    },
    vidhi: {
      en: 'Wake before sunrise, bathe, and visit a Hanuman temple. Offer sindoor (vermillion), red flowers, sesame oil lamp, and jalebi/boondi as prasad. Chant Hanuman Chalisa or "Om Hanumate Namah" 108 times. Wear red or orange clothing. Eat one meal after sunset — wheat bread, jaggery, and fruits. Avoid non-vegetarian food, alcohol, and anger on this day. Observe for 21 consecutive Tuesdays for full effect. Feed monkeys and donate red items.',
      hi: 'सूर्योदय से पहले उठें, स्नान करें, हनुमान मन्दिर जाएं। सिन्दूर, लाल पुष्प, तिल का तेल का दीया, और जलेबी/बूंदी अर्पित करें। हनुमान चालीसा या "ॐ हनुमते नमः" का 108 बार जाप करें। लाल या नारंगी वस्त्र पहनें। सूर्यास्त के बाद एक समय भोजन — गेहूं की रोटी, गुड़ और फल। इस दिन मांसाहार, मद्यपान और क्रोध से बचें। 21 मंगलवार लगातार करें।',
    },
  },

  // ─── 6. Pradosh Vrat ───────────────────────────────────
  {
    slug: 'pradosh-vrat',
    title: { en: 'Pradosh Vrat', hi: 'प्रदोष व्रत' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    linkedFestivalSlugs: ['pradosham'],
    overview: {
      en: 'Pradosh Vrat commemorates Shiva\'s consumption of the Halahala poison during the Samudra Manthan to save all creation. The katha narrates how Parvati held his throat to contain the poison (making him Neelakantha), and how Nandi\'s penance established the Pradosh twilight hour as the most powerful window for Shiva worship.',
      hi: 'प्रदोष व्रत समुद्र मंथन के दौरान शिव द्वारा सृष्टि की रक्षा हेतु हालाहल विष पान की स्मृति है। कथा बताती है कैसे पार्वती ने विष रोकने के लिए उनका गला दबाया (नीलकण्ठ बनाया), और कैसे नन्दी की तपस्या ने प्रदोष संध्या काल को शिव पूजा की सर्वाधिक शक्तिशाली अवधि स्थापित किया।',
    },
    whenObserved: {
      en: 'Twice a month — on Trayodashi (13th tithi) of both Shukla and Krishna Paksha. The puja is performed during Pradosh Kaal (90-minute twilight window after sunset). Shani Pradosh (Saturday) is especially powerful.',
      hi: 'मास में दो बार — शुक्ल और कृष्ण पक्ष दोनों की त्रयोदशी (13वीं तिथि) को। पूजा प्रदोष काल (सूर्यास्त के बाद 90 मिनट की संध्या अवधि) में होती है। शनि प्रदोष विशेष शक्तिशाली है।',
    },
    phal: {
      en: 'Pradosh Vrat grants swift blessings from Lord Shiva. It removes all sins, fulfills desires, brings prosperity, cures diseases, and grants moksha. Shani Pradosham (Saturday) is particularly powerful for Saturn-related remedies.',
      hi: 'प्रदोष व्रत से भगवान शिव का शीघ्र आशीर्वाद मिलता है। यह सभी पाप नष्ट करता है, मनोकामना पूर्ण करता है, समृद्धि लाता है, रोग दूर करता है, और मोक्ष प्रदान करता है।',
    },
    vidhi: {
      en: 'Fast from sunrise. In the evening during Pradosh Kaal (1.5 hours after sunset), visit a Shiva temple. Perform abhishek with milk, water, honey, and yogurt. Offer bilva leaves, white flowers, dhatura, and bhasma. Light a ghee lamp. Chant Maha Mrityunjaya Mantra 108 times and recite the Shiva Rudram if possible. Circumambulate the Shiva Linga 3 times. Break the fast after the puja. For maximum benefit, also worship Nandi before approaching the Shiva Linga.',
      hi: 'सूर्योदय से व्रत रखें। सन्ध्या में प्रदोष काल (सूर्यास्त के 1.5 घंटे बाद) शिव मन्दिर जाएं। दूध, जल, मधु, दही से अभिषेक करें। बिल्वपत्र, श्वेत पुष्प, धतूरा, भस्म अर्पित करें। घी का दीया जलाएं। महामृत्युंजय मन्त्र 108 बार जपें और सम्भव हो तो शिव रुद्रम् पाठ करें। शिवलिंग की 3 बार परिक्रमा करें। पूजा के बाद व्रत तोड़ें।',
    },
  },

  // ─── 7. Maha Shivratri ──────────────────────────────────
  {
    slug: 'shivratri',
    title: { en: 'Maha Shivratri Vrat', hi: 'महा शिवरात्रि व्रत' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    linkedFestivalSlugs: ['maha-shivaratri'],
    overview: {
      en: 'Maha Shivratri is the great night of Shiva. The katha tells how a hunter named Gurudruha, unknowingly sheltering in a bilva tree above a Shiva Linga, accidentally performed a perfect vigil — fasting, dropping bilva leaves, and staying awake all night — and was thereby liberated. It teaches that Shiva\'s grace is accessible to all, even through accidental devotion.',
      hi: 'महा शिवरात्रि शिव की महान रात्रि है। कथा बताती है कैसे गुरुद्रुह नामक शिकारी, अनजाने में शिवलिंग के ऊपर बिल्व वृक्ष पर आश्रय लेकर, संयोगवश पूर्ण जागरण कर बैठा — उपवास, बिल्वपत्र अर्पण, और रातभर जागरण — और इस प्रकार मुक्त हुआ। यह सिखाती है कि शिव की कृपा सबके लिए सुलभ है।',
    },
    whenObserved: {
      en: 'Phalguna Krishna Chaturdashi (14th day of waning moon in Phalguna month) — typically February/March. The night is divided into 4 prahars for worship.',
      hi: 'फाल्गुन कृष्ण चतुर्दशी — सामान्यतः फरवरी/मार्च। रात्रि 4 प्रहरों में विभक्त होती है।',
    },
    phal: {
      en: 'Observing Maha Shivratri with fasting, night vigil, and Shiva worship grants liberation (moksha). Even unknowing worship on this night carries immense merit. It removes the most serious sins and grants the direct darshan of Lord Shiva.',
      hi: 'उपवास, रात्रि जागरण और शिव पूजा सहित महा शिवरात्रि का पालन मोक्ष प्रदान करता है। इस रात अनजाने में भी पूजा का अपार पुण्य है।',
    },
    vidhi: {
      en: 'Fast the entire day without food (nirjala or fruit-only). Visit a Shiva temple at night. The night is divided into 4 prahars — perform abhishek in each prahar: first with milk, second with curd, third with ghee, fourth with honey. Offer bilva leaves, white flowers, bhasma, and dhatura throughout the night. Chant "Om Namah Shivaya" continuously. Stay awake the entire night (jagran). Break the fast the next morning after sunrise puja.',
      hi: 'पूरे दिन बिना भोजन (निर्जल या फलाहार) व्रत रखें। रात्रि में शिव मन्दिर जाएं। रात को 4 प्रहरों में बांटा जाता है — प्रत्येक प्रहर में अभिषेक करें: पहले दूध, दूसरे दही, तीसरे घी, चौथे मधु से। रातभर बिल्वपत्र, श्वेत पुष्प, भस्म, धतूरा अर्पित करें। "ॐ नमः शिवाय" का निरन्तर जाप करें। पूरी रात जागें। अगली सुबह सूर्योदय पूजा के बाद व्रत तोड़ें।',
    },
  },

  // ─── 8. Santoshi Maa Vrat ──────────────────────────────
  {
    slug: 'santoshi-maa',
    title: { en: 'Santoshi Maa Vrat', hi: 'सन्तोषी माता व्रत' },
    deity: { en: 'Santoshi Mata', hi: 'सन्तोषी माता' },
    linkedFestivalSlugs: [],
    overview: {
      en: 'Santoshi Maa is the goddess of contentment, born from Lord Ganesha\'s divine energy. The katha tells of Satyavati, a mistreated daughter-in-law who found inner peace and transformed her circumstances through 16 consecutive Friday fasts. It emphasizes that sour food must never be consumed or offered during this vrat.',
      hi: 'सन्तोषी माता सन्तोष की देवी हैं, भगवान गणेश की दिव्य शक्ति से जन्मी। कथा सत्यवती की है, एक प्रताड़ित बहू जिसने 16 लगातार शुक्रवार के व्रतों से आन्तरिक शांति पाई और अपनी परिस्थितियां बदलीं। यह दर्शाती है कि इस व्रत में खट्टा भोजन कभी नहीं खाना या अर्पित करना चाहिए।',
    },
    whenObserved: {
      en: 'Every Friday, for 16 consecutive Fridays. Concluded with an Udyapan ceremony (feeding 8 boys).',
      hi: 'प्रत्येक शुक्रवार, 16 लगातार शुक्रवार। उद्यापन समारोह (8 बालकों को भोजन) के साथ समापन।',
    },
    phal: {
      en: 'Santoshi Maa Vrat brings contentment, family harmony, resolution of domestic disputes, financial stability, and fulfillment of long-pending wishes. The goddess grants satisfaction with what one has while gradually improving circumstances.',
      hi: 'सन्तोषी माता व्रत सन्तोष, पारिवारिक सद्भाव, गृह कलह का समाधान, आर्थिक स्थिरता और लम्बित मनोकामनाओं की पूर्ति लाता है।',
    },
    vidhi: {
      en: 'Observe on 16 consecutive Fridays. Wake early, bathe, and worship Santoshi Maa with chana (chickpeas) and gur (jaggery) as prasad. Light a ghee diya. Do NOT eat or offer anything sour (citrus, tamarind, pickle, yogurt, vinegar) on this day. Eat one sattvic meal. After 16 Fridays, perform Udyapan: invite 8 boys for a meal, offer dakshina, and distribute prasad. Strictly avoid sour food during the entire Udyapan.',
      hi: '16 लगातार शुक्रवार व्रत करें। सवेरे उठें, स्नान करें, चना और गुड़ के प्रसाद से सन्तोषी माता की पूजा करें। घी का दीया जलाएं। इस दिन कुछ भी खट्टा (नीम्बू, इमली, अचार, दही, सिरका) न खाएं न अर्पित करें। एक सात्विक भोजन करें। 16 शुक्रवार बाद उद्यापन करें: 8 बालकों को भोजन कराएं, दक्षिणा दें, प्रसाद वितरित करें।',
    },
  },

  // ─── 9. Ganesh Chaturthi ───────────────────────────────
  {
    slug: 'ganesh-chaturthi',
    title: { en: 'Ganesh Chaturthi Vrat', hi: 'गणेश चतुर्थी व्रत' },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश' },
    linkedFestivalSlugs: ['ganesh-chaturthi'],
    overview: {
      en: 'Ganesh Chaturthi celebrates the birth of Lord Ganesha. The katha narrates how Parvati created Ganesha from turmeric paste to guard her privacy, how Shiva unknowingly severed the boy\'s head, and how he was revived with an elephant\'s head and declared Pratham Pujya — to be worshipped before all gods.',
      hi: 'गणेश चतुर्थी भगवान गणेश के जन्म का उत्सव है। कथा बताती है कैसे पार्वती ने हल्दी से गणेश को बनाया, कैसे शिव ने अनजाने में बालक का शीश काटा, और कैसे हाथी के शीश से पुनर्जीवित कर उन्हें प्रथम पूज्य घोषित किया — सभी देवताओं से पहले पूजनीय।',
    },
    whenObserved: {
      en: 'Bhadrapada Shukla Chaturthi (4th day of waxing moon in Bhadrapada month) — typically August/September. The festival lasts 1.5, 3, 5, 7, or 10 days.',
      hi: 'भाद्रपद शुक्ल चतुर्थी — सामान्यतः अगस्त/सितम्बर। उत्सव 1.5, 3, 5, 7 या 10 दिन चलता है।',
    },
    phal: {
      en: 'Ganesh Chaturthi worship removes all obstacles, grants wisdom, success in education and business, protection during new beginnings, and brings prosperity. Lord Ganesha is invoked before starting any new venture.',
      hi: 'गणेश चतुर्थी पूजा सभी बाधाएं दूर करती है, विद्या, शिक्षा और व्यापार में सफलता, नई शुरुआत में सुरक्षा, और समृद्धि प्रदान करती है।',
    },
    vidhi: {
      en: 'Install a clay Ganesha idol. Perform Prana Pratishtha (invocation) with mantras. Offer 21 modaks, 21 durva grass bundles, red flowers, and sindoor. Light a ghee diya. Chant Ganapati Atharvashirsha or "Om Gan Ganapataye Namah" 108 times. Perform aarti with camphor. On the final day, perform visarjan (immersion) with "Ganpati Bappa Morya, Purchya Varshi Laukarya!"',
      hi: 'मिट्टी की गणेश मूर्ति स्थापित करें। मन्त्रों से प्राण प्रतिष्ठा करें। 21 मोदक, 21 दूर्वा गुच्छ, लाल पुष्प, सिन्दूर अर्पित करें। घी का दीया जलाएं। गणपति अथर्वशीर्ष या "ॐ गं गणपतये नमः" का 108 बार जाप करें। कर्पूर से आरती करें। अन्तिम दिन "गणपति बप्पा मोरया, पुढच्या वर्षी लौकरिया!" के जयघोष से विसर्जन करें।',
    },
  },

  // ─── 10. Ahoi Ashtami ──────────────────────────────────
  {
    slug: 'ahoi-ashtami',
    title: { en: 'Ahoi Ashtami Vrat', hi: 'अहोई अष्टमी व्रत' },
    deity: { en: 'Ahoi Mata (Goddess of Protection)', hi: 'अहोई माता (रक्षा की देवी)' },
    linkedFestivalSlugs: [],
    overview: {
      en: 'Ahoi Ashtami is observed by mothers for the protection and long life of their children. The katha tells of a woman who accidentally killed a baby porcupine, was cursed to lose her seven sons, and through sincere repentance and Ahoi Mata\'s grace, had them all restored to life.',
      hi: 'अहोई अष्टमी माताओं द्वारा बच्चों की रक्षा और दीर्घायु हेतु रखा जाता है। कथा एक स्त्री की है जिसने अनजाने में साही का बच्चा मार दिया, श्राप से सातों पुत्र खोए, और सच्चे पश्चाताप व अहोई माता की कृपा से सभी पुनर्जीवित हुए।',
    },
    whenObserved: {
      en: 'Kartik Krishna Ashtami (8th day of waning moon in Kartik month) — four days before Diwali. Puja is performed at starrise (not moonrise).',
      hi: 'कार्तिक कृष्ण अष्टमी — दीवाली से चार दिन पहले। पूजा तारा उदय पर (चन्द्रोदय नहीं) होती है।',
    },
    phal: {
      en: 'Ahoi Ashtami grants protection, long life, and good health for children. It is especially powerful for mothers with young children or those praying for the birth of a child.',
      hi: 'अहोई अष्टमी बच्चों की रक्षा, दीर्घायु और स्वास्थ्य प्रदान करती है। यह विशेष रूप से छोटे बच्चों की माताओं या सन्तान प्रार्थी माताओं के लिए शक्तिशाली है।',
    },
    vidhi: {
      en: 'Draw or print the image of Ahoi Mata (with a porcupine and cubs) on the wall or a board. Fast from sunrise — no food or water until starrise in the evening. At starrise (when the first star appears), offer water, grain, and sweets to the image. Listen to or read the Ahoi Ashtami Katha. After the puja, look at the stars and break the fast. Older women in the family typically narrate the katha while younger mothers listen.',
      hi: 'दीवार या बोर्ड पर अहोई माता (साही और शावकों सहित) की छवि बनाएं। सूर्योदय से व्रत रखें — सन्ध्या में तारा उदय तक बिना अन्न-जल। तारा उदय पर जल, अनाज, मिठाई अर्पित करें। अहोई अष्टमी कथा सुनें या पढ़ें। पूजा के बाद तारों को देखकर व्रत तोड़ें।',
    },
  },
];

/** Get a single katha by slug */
export function getVratKatha(slug: string): VratKatha | undefined {
  return VRAT_KATHAS.find(k => k.slug === slug);
}

/** Get all katha slugs for static generation */
export function getAllVratKathaSlugs(): string[] {
  return VRAT_KATHAS.map(k => k.slug);
}

/**
 * Find a Vrat Katha linked to a given festival/puja slug.
 * Returns the first matching katha, or undefined if none.
 */
export function getVratKathaByFestivalSlug(festivalSlug: string): VratKatha | undefined {
  return VRAT_KATHAS.find(k => k.linkedFestivalSlugs.includes(festivalSlug));
}

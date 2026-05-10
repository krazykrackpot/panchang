/**
 * City-specific festival celebration context.
 * Returns unique local content for festival×city pages to differentiate
 * them from generic descriptions. Used to enrich programmatic SEO pages.
 *
 * Coverage: 10 festivals × 15 cities = 150 entries.
 */

interface CityFestivalContext {
  en: string;
  hi: string;
}

/** Get city-specific context for a festival, or null if no data */
export function getCityFestivalContext(festivalSlug: string, citySlug: string): CityFestivalContext | null {
  return CONTEXT_MAP[`${festivalSlug}:${citySlug}`] ?? null;
}

const CONTEXT_MAP: Record<string, CityFestivalContext> = {
  // ═══════════════════════════════════════════════════════════════════
  // DIWALI
  // ═══════════════════════════════════════════════════════════════════
  'diwali:delhi': {
    en: 'Delhi celebrates Diwali with massive firecracker displays along the Yamuna riverfront and elaborate lighting at India Gate and Connaught Place. The markets of Chandni Chowk and Sarojini Nagar bustle with weeks of shopping for diyas, rangoli, and sweets. The Lakshmi Narayan Temple (Birla Mandir) hosts special Lakshmi Puja attended by thousands.',
    hi: 'दिल्ली में दीवाली यमुना तट पर भव्य आतिशबाजी और इंडिया गेट व कनॉट प्लेस की रोशनी से मनाई जाती है। चांदनी चौक और सरोजिनी नगर के बाज़ारों में दीये, रंगोली और मिठाइयों की हफ़्तों पहले से ख़रीदारी होती है। लक्ष्मी नारायण मंदिर (बिरला मंदिर) में विशेष लक्ष्मी पूजा होती है जिसमें हज़ारों श्रद्धालु आते हैं।',
  },
  'diwali:mumbai': {
    en: 'Mumbai lights up from Marine Drive to Bandra with elaborate decorations on every high-rise. The Mahalakshmi Temple conducts special abhishek ceremonies drawing enormous queues. Worli and Dadar see massive rangoli competitions, while South Mumbai homes exchange handmade mithais from iconic shops like MM Mithaiwala and Brijwasi.',
    hi: 'मुंबई में मरीन ड्राइव से बांद्रा तक हर इमारत सजी होती है। महालक्ष्मी मंदिर में विशेष अभिषेक होता है जिसमें भारी भीड़ उमड़ती है। वर्ली और दादर में विशाल रंगोली प्रतियोगिताएँ होती हैं, और दक्षिण मुंबई में एमएम मिठाईवाला जैसी दुकानों की मिठाइयाँ उपहार में दी जाती हैं।',
  },
  'diwali:bangalore': {
    en: 'Bangalore celebrates Diwali with a distinct South Indian flavour — early morning oil baths (abhyanga snan) are followed by bursting crackers at dawn rather than night. Commercial Street and Chickpet markets overflow with shoppers. The ISKCON Temple on Hare Krishna Hill hosts a grand Govardhan Puja the day after Diwali.',
    hi: 'बेंगलुरु में दीवाली दक्षिण भारतीय शैली में मनाई जाती है — सुबह अभ्यंग स्नान के बाद भोर में पटाखे फोड़े जाते हैं। कमर्शियल स्ट्रीट और चिकपेट बाज़ार खरीदारों से भरे रहते हैं। इस्कॉन मंदिर में दीवाली के अगले दिन भव्य गोवर्धन पूजा होती है।',
  },
  'diwali:chennai': {
    en: 'Chennai observes Diwali primarily as Naraka Chaturdashi rather than Amavasya — celebrations peak at 4 AM with oil baths and early morning firecrackers. T. Nagar and Mylapore are the main shopping hubs for silk sarees and sweets. Kapaleeshwarar Temple in Mylapore holds special dawn arati ceremonies.',
    hi: 'चेन्नई में दीवाली मुख्यतः नरक चतुर्दशी के रूप में मनाई जाती है — सुबह 4 बजे तेल स्नान और पटाखों से उत्सव शुरू होता है। टी. नगर और मायलापुर मुख्य खरीदारी केन्द्र हैं। कपालीश्वर मंदिर में विशेष भोर आरती होती है।',
  },
  'diwali:kolkata': {
    en: 'Kolkata celebrates Diwali as Kali Puja — Goddess Kali is worshipped instead of Lakshmi, with thousands of pandals erected across the city. The most famous Kali Puja pandals are at Kalighat and College Square. The night sky is lit with both fireworks and the warm glow of earthen diyas placed on rooftops and balconies throughout North and South Kolkata.',
    hi: 'कोलकाता में दीवाली काली पूजा के रूप में मनाई जाती है — लक्ष्मी के स्थान पर माँ काली की पूजा होती है और शहर भर में हज़ारों पंडाल लगते हैं। कालीघाट और कॉलेज स्क्वायर के पंडाल सबसे प्रसिद्ध हैं। छतों और बालकनियों पर दीये जलाए जाते हैं।',
  },
  'diwali:hyderabad': {
    en: 'Hyderabad celebrates Diwali with a blend of Telugu and Marwari traditions. The Charminar area and Begum Bazaar light up spectacularly, while Secunderabad Parade Ground hosts massive firework shows. The Birla Mandir on Naubat Pahad hill offers panoramic views of the illuminated city and conducts special Lakshmi Puja.',
    hi: 'हैदराबाद में दीवाली तेलुगु और मारवाड़ी परंपराओं के मिश्रण से मनाई जाती है। चारमीनार और बेगम बाज़ार भव्य रूप से सजते हैं। सिकंदराबाद परेड ग्राउंड में विशाल आतिशबाजी होती है। नौबत पहाड़ पर बिरला मंदिर से जगमगाते शहर का दृश्य दिखता है।',
  },
  'diwali:pune': {
    en: 'Pune celebrates Diwali with the Marathi tradition of Fort illumination — Shaniwar Wada and Sinhagad Fort are lit with thousands of lamps. Laxmi Road becomes a river of shoppers buying traditional faral (Diwali snacks). The Dagdusheth Halwai Ganpati temple holds special Lakshmi Puja, and Tulshibaug market overflows with festive goods.',
    hi: 'पुणे में दीवाली मराठी परंपरा से मनाई जाती है — शनिवार वाड़ा और सिंहगड किला हज़ारों दीयों से जगमगाता है। लक्ष्मी रोड पर फराल (दीवाली नमकीन) खरीदने वालों की भीड़ होती है। दगडूशेठ हलवाई गणपति मंदिर में विशेष लक्ष्मी पूजा होती है।',
  },
  'diwali:ahmedabad': {
    en: 'Ahmedabad celebrates Diwali followed by the Gujarati New Year (Bestu Varas). The old city pol houses are decorated with traditional Gujarati torans and rangolis. Families visit the Swaminarayan Temple in Kalupur for darshan. Law Garden night market and Manek Chowk overflow with shoppers buying chaniya cholis and festive garments.',
    hi: 'अहमदाबाद में दीवाली के बाद गुजराती नव वर्ष (बेस्तु वरस) मनाया जाता है। पुरानी शहर की पोल में पारंपरिक तोरण और रंगोली सजाई जाती है। कालूपुर स्वामीनारायण मंदिर में दर्शन के लिए परिवार जाते हैं। लॉ गार्डन और मानेक चौक में खरीदारों की भीड़ होती है।',
  },
  'diwali:jaipur': {
    en: 'Jaipur transforms into a golden city of lights during Diwali — the Nahargarh Fort, Hawa Mahal, and City Palace are illuminated magnificently. Johari Bazaar and Bapu Bazaar bustle with shoppers buying lac bangles, mojris, and traditional Rajasthani gifts. The Govind Dev Ji Temple holds an elaborate Lakshmi-Narayan Puja.',
    hi: 'दीवाली पर जयपुर सोने की रोशनी से चमकता है — नाहरगढ़ किला, हवा महल और सिटी पैलेस भव्य रूप से सजाए जाते हैं। जौहरी बाज़ार और बापू बाज़ार में लाख की चूड़ियाँ, मोजड़ी और राजस्थानी उपहार खरीदे जाते हैं। गोविंद देव जी मंदिर में भव्य लक्ष्मी-नारायण पूजा होती है।',
  },
  'diwali:lucknow': {
    en: 'Lucknow celebrates Diwali with Awadhi elegance — the Hazratganj and Aminabad markets offer exquisite chikankari work and Lucknawi sweets. The banks of the Gomti River are lined with thousands of diyas during the Deepotsav celebrations. The Hanuman Setu Temple and Mankameshwar Temple conduct special evening arati.',
    hi: 'लखनऊ में दीवाली अवधी शान से मनाई जाती है — हज़रतगंज और अमीनाबाद में चिकनकारी और लखनवी मिठाइयाँ मिलती हैं। गोमती नदी के तट पर दीपोत्सव में हज़ारों दीये जलाए जाते हैं। हनुमान सेतु मंदिर और मनकामेश्वर मंदिर में विशेष संध्या आरती होती है।',
  },
  'diwali:varanasi': {
    en: 'Dev Deepawali on the ghats of Varanasi is celebrated 15 days after Diwali on Kartik Purnima, when the entire riverfront is illuminated with over a million earthen diyas. The main celebrations at Dashashwamedh Ghat feature the spectacular Ganga Aarti. Varanasi is considered the city of Lord Shiva, making Diwali here deeply connected to the divine light tradition.',
    hi: 'वाराणसी के घाटों पर देव दीपावली दीवाली के 15 दिन बाद कार्तिक पूर्णिमा पर मनाई जाती है, जब पूरा तट दस लाख से अधिक मिट्टी के दीयों से जगमगा उठता है। दशाश्वमेध घाट पर भव्य गंगा आरती होती है। वाराणसी भगवान शिव की नगरी है, इसलिए यहाँ दीवाली दिव्य ज्योति परंपरा से जुड़ी है।',
  },
  'diwali:patna': {
    en: 'Patna celebrates Diwali with special fervour as it precedes Chhath Puja by just days — families begin Chhath preparations immediately after. The Gandhi Maidan area and Boring Road light up with decorations. Mahavir Mandir near Patna Junction conducts grand Lakshmi Puja ceremonies, and the Ganga ghats at Collectorate Ghat see early Chhath devotees.',
    hi: 'पटना में दीवाली विशेष उत्साह से मनाई जाती है क्योंकि छठ पूजा कुछ ही दिनों बाद होती है — परिवार तुरंत छठ की तैयारी शुरू करते हैं। गाँधी मैदान और बोरिंग रोड सजते हैं। पटना जंक्शन के पास महावीर मंदिर में भव्य लक्ष्मी पूजा होती है।',
  },
  'diwali:bhopal': {
    en: 'Bhopal celebrates Diwali with communal harmony — both Hindu and Muslim neighbourhoods participate in the lighting festivities. The old city around Chowk Bazaar and New Market are decorated elaborately. Birla Mandir atop Arera Hills offers a stunning view of the illuminated city and the Upper Lake reflecting thousands of lights.',
    hi: 'भोपाल में दीवाली साम्प्रदायिक सद्भाव से मनाई जाती है — हिन्दू और मुस्लिम दोनों मोहल्ले रोशनी उत्सव में भाग लेते हैं। चौक बाज़ार और न्यू मार्केट सजाए जाते हैं। अरेरा हिल्स पर बिरला मंदिर से जगमगाते शहर और बड़े तालाब का दृश्य अद्भुत होता है।',
  },
  'diwali:chandigarh': {
    en: 'Chandigarh celebrates Diwali with a planned-city aesthetic — Sector 17 plaza and Sukhna Lake promenade are illuminated tastefully. The city enforces strict green cracker norms, leading to more laser shows and LED decorations. Mansa Devi Temple in nearby Panchkula sees heavy footfall for Lakshmi Puja.',
    hi: 'चंडीगढ़ में दीवाली नियोजित शहर की शोभा से मनाई जाती है — सेक्टर 17 प्लाज़ा और सुखना झील सुंदर रोशनी से जगमगाते हैं। शहर ग्रीन पटाखों का पालन करता है, इसलिए लेज़र शो और एलईडी सजावट अधिक होती है। पंचकूला के मनसा देवी मंदिर में लक्ष्मी पूजा के लिए भारी भीड़ होती है।',
  },
  'diwali:new-york': {
    en: 'New York celebrates Diwali with a spectacular fireworks display over the Hudson River and the lighting of the Empire State Building in orange and gold. Jackson Heights in Queens transforms into a Little India with massive Diwali melas. The Hindu Temple Society of North America in Flushing hosts elaborate pujas, while Times Square has held official Diwali celebrations since 2013.',
    hi: 'न्यूयॉर्क में दीवाली हडसन नदी पर आतिशबाजी और एम्पायर स्टेट बिल्डिंग पर नारंगी-सुनहरी रोशनी से मनाई जाती है। क्वीन्स का जैक्सन हाइट्स छोटे भारत में बदल जाता है। फ्लशिंग के हिंदू मंदिर में भव्य पूजा होती है, और टाइम्स स्क्वायर में 2013 से आधिकारिक दीवाली उत्सव होता है।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // JANMASHTAMI
  // ═══════════════════════════════════════════════════════════════════
  'janmashtami:delhi': {
    en: 'Delhi celebrates Janmashtami with grand Dahi Handi events in East Delhi and Dwarka. The ISKCON Temple in East of Kailash draws lakhs of devotees for the midnight celebration of Krishna\'s birth. Jhandewalan and Chattarpur temples also host elaborate jhankis (tableaux) depicting scenes from Krishna\'s life.',
    hi: 'दिल्ली में जन्माष्टमी पूर्वी दिल्ली और द्वारका में भव्य दही हांडी से मनाई जाती है। ईस्ट ऑफ कैलाश के इस्कॉन मंदिर में मध्यरात्रि उत्सव में लाखों भक्त आते हैं। झंडेवालान और छतरपुर मंदिरों में कृष्ण लीला की भव्य झाँकियाँ सजाई जाती हैं।',
  },
  'janmashtami:mumbai': {
    en: 'Mumbai is famous for its Dahi Handi competitions where human pyramids reach heights of 40+ feet to break hanging pots of curd. The biggest events are in Dadar, Worli, and Thane with prize money in lakhs. Govindas (teams) practice for months. The ISKCON Juhu temple and Siddhivinayak area hold grand midnight celebrations.',
    hi: 'मुंबई दही हांडी प्रतियोगिताओं के लिए प्रसिद्ध है जहाँ मानव पिरामिड 40+ फीट ऊँचाई तक बनते हैं। सबसे बड़े आयोजन दादर, वर्ली और ठाणे में होते हैं। गोविंदा टीमें महीनों अभ्यास करती हैं। इस्कॉन जुहू और सिद्धिविनायक क्षेत्र में भव्य मध्यरात्रि उत्सव होता है।',
  },
  'janmashtami:bangalore': {
    en: 'Bangalore celebrates Janmashtami as Krishna Jayanti with the distinctive Karnataka tradition of breaking a dahi handi hung from a height decorated with currency notes and fruits. The ISKCON temple on Hare Krishna Hill in Rajajinagar sees a 48-hour celebration with abhishek at midnight. Art of Living Ashram on Kanakapura Road also hosts large gatherings.',
    hi: 'बेंगलुरु में जन्माष्टमी कृष्ण जयंती के रूप में कर्नाटक की विशिष्ट शैली से मनाई जाती है। राजाजीनगर के इस्कॉन मंदिर में 48 घंटे का उत्सव और मध्यरात्रि अभिषेक होता है। कनकपुरा रोड पर आर्ट ऑफ लिविंग आश्रम में भी बड़ा आयोजन होता है।',
  },
  'janmashtami:chennai': {
    en: 'Chennai celebrates Janmashtami as Gokulashtami or Sri Jayanti with kolam (rangoli) competitions in Mylapore and T. Nagar. The Parthasarathy Temple in Triplicane — one of the 108 Divya Desams — hosts an 8-day Utsavam. Uriyadi (pot-breaking) events are held in the streets of North Chennai, particularly in Sowcarpet.',
    hi: 'चेन्नई में जन्माष्टमी गोकुलाष्टमी या श्री जयंती के रूप में मनाई जाती है। मायलापुर और टी.नगर में कोलम प्रतियोगिताएँ होती हैं। त्रिप्लिकेन का पार्थसारथी मंदिर — 108 दिव्य देशों में एक — 8 दिवसीय उत्सवम् करता है। सौकारपेट में उड़ियाडी (मटकी फोड़) होती है।',
  },
  'janmashtami:kolkata': {
    en: 'Kolkata celebrates Janmashtami with a Bengali flavour — the focus is on scholarly recitations from the Bhagavata Purana and cultural programmes rather than Dahi Handi. The Radha Govinda Temple in Baghbazar and the ISKCON Chandrodaya Mandir in Mayapur (nearby) host massive gatherings. Sweet shops offer special Gopalkala and Makhan Mishri.',
    hi: 'कोलकाता में जन्माष्टमी बंगाली शैली से मनाई जाती है — भागवत पुराण पाठ और सांस्कृतिक कार्यक्रमों पर ज़ोर होता है। बाग़बाज़ार का राधा गोविन्द मंदिर और मायापुर का इस्कॉन चन्द्रोदय मंदिर भव्य आयोजन करते हैं। मिठाई दुकानों में गोपालकला और माखन मिश्री विशेष मिलती है।',
  },
  'janmashtami:hyderabad': {
    en: 'Hyderabad celebrates Janmashtami with Dahi Handi events in the old city and grand pujas at the ISKCON Temple in Abids. The Chilkur Balaji Temple (Visa Balaji) near Gandipet Lake also sees heavy devotee turnout. Local Telugu tradition includes making a butter pot (Vennela Muddha) and decorating Krishna idols with new clothes and jewellery.',
    hi: 'हैदराबाद में जन्माष्टमी पुरानी शहर में दही हांडी और अबिड्स के इस्कॉन मंदिर में भव्य पूजा से मनाई जाती है। गंडीपेट के पास चिलकुर बालाजी मंदिर में भी भारी भीड़ होती है। तेलुगु परंपरा में माखन पात्र (वेन्नेला मुड्डा) बनाया जाता है।',
  },
  'janmashtami:pune': {
    en: 'Pune celebrates Janmashtami with enthusiastic Dahi Handi competitions across the city, particularly in Parvati, Narayan Peth, and Bibwewadi. The Marathi tradition includes elaborate decoration of home temples with tiny Krishna footprints (pauli) made from rice paste. ISKCON NVCC in Katraj hosts a grand midnight celebration.',
    hi: 'पुणे में जन्माष्टमी भव्य दही हांडी प्रतियोगिताओं से मनाई जाती है, विशेषकर पर्वती, नारायण पेठ और बिबवेवाड़ी में। मराठी परंपरा में चावल के आटे से कृष्ण के पदचिह्न (पाउली) बनाए जाते हैं। कतराज में इस्कॉन NVCC भव्य मध्यरात्रि उत्सव करता है।',
  },
  'janmashtami:ahmedabad': {
    en: 'Ahmedabad celebrates Janmashtami with matki-fod (pot-breaking) events in the walled city pols and Maninagar. The Swaminarayan Temple hosts grand ceremonies with special prasad distribution. Ranchhodji Temple in Dakor (90km away) sees massive pilgrimages. Local tradition includes making maakhan mishri and singing garba-style bhajans.',
    hi: 'अहमदाबाद में जन्माष्टमी पुरानी शहर की पोलों और मणिनगर में माटकी-फोड़ से मनाई जाती है। स्वामीनारायण मंदिर भव्य समारोह और प्रसाद वितरण करता है। डाकोर का रणछोड़जी मंदिर भारी तीर्थयात्रा देखता है। स्थानीय परंपरा में माखन मिश्री और गरबा शैली के भजन होते हैं।',
  },
  'janmashtami:jaipur': {
    en: 'Jaipur celebrates Janmashtami with grand processions through the old city walled areas — Tripolia Bazaar and Johri Bazaar are decorated with Krishna themes. The Govind Dev Ji Temple (within City Palace complex) is the centrepiece, with the deity dressed in new clothes and a silver cradle ceremony at midnight.',
    hi: 'जयपुर में जन्माष्टमी पुरानी शहर की गलियों में भव्य शोभायात्राओं से मनाई जाती है — त्रिपोलिया और जौहरी बाज़ार कृष्ण थीम से सजते हैं। सिटी पैलेस के गोविंद देव जी मंदिर में मध्यरात्रि को चाँदी के पालने में कृष्ण जन्म उत्सव होता है।',
  },
  'janmashtami:lucknow': {
    en: 'Lucknow celebrates Janmashtami with the Awadhi tradition of elaborate jhankis (tableaux) depicting Vrindavan scenes. The Krishna Janmabhoomi Committee organises grand processions from Lalbagh to Hazratganj. The Radha Krishna Temple in Daliganj and ISKCON in Vrindavan Colony host midnight celebrations with bhajans lasting until dawn.',
    hi: 'लखनऊ में जन्माष्टमी अवधी परंपरा से वृन्दावन दृश्यों की भव्य झाँकियों से मनाई जाती है। कृष्ण जन्मभूमि समिति लालबाग़ से हज़रतगंज तक शोभायात्रा करती है। दालीगंज का राधा कृष्ण मंदिर और वृन्दावन कॉलोनी का इस्कॉन भोर तक भजन-कीर्तन करते हैं।',
  },
  'janmashtami:varanasi': {
    en: 'Varanasi celebrates Janmashtami with midnight celebrations at hundreds of temples along the ghats. The most prominent celebrations are at the Gokul Temple near Dashashwamedh Ghat and at the ISKCON temple in Rathyatra. Boats on the Ganga are decorated with lights and devotional music echoes across the river throughout the night.',
    hi: 'वाराणसी में जन्माष्टमी घाटों के सैकड़ों मंदिरों में मध्यरात्रि उत्सव से मनाई जाती है। दशाश्वमेध घाट के पास गोकुल मंदिर और रथयात्रा के इस्कॉन मंदिर मुख्य केन्द्र हैं। गंगा पर नावें रोशनी से सजती हैं और भक्ति संगीत रात भर गूँजता है।',
  },
  'janmashtami:patna': {
    en: 'Patna celebrates Janmashtami with grand celebrations at the Mahavir Mandir and the ISKCON temple in Patliputra Colony. The Patna Sahib area hosts large processions. Bihar has a strong Krishna Bhakti tradition, and local sweet shops prepare special Peda and Mawa Bati. Dahi Handi events are held in Boring Road and Kankarbagh areas.',
    hi: 'पटना में जन्माष्टमी महावीर मंदिर और पाटलिपुत्र कॉलोनी के इस्कॉन मंदिर में भव्य उत्सव से मनाई जाती है। पटना साहिब क्षेत्र में बड़ी शोभायात्राएँ निकलती हैं। बिहार में कृष्ण भक्ति परंपरा मज़बूत है, और मिठाई दुकानों में विशेष पेड़ा और मावा बाटी बनती है।',
  },
  'janmashtami:bhopal': {
    en: 'Bhopal celebrates Janmashtami with midnight celebrations at the Birla Mandir and the ISKCON temple near Karond. The old city Chowk area sees Dahi Handi events. Bhopal\'s distinct tradition includes processions with decorated raths (chariots) through the New Market area and cultural programmes at Bharat Bhavan.',
    hi: 'भोपाल में जन्माष्टमी बिरला मंदिर और करोंद के इस्कॉन मंदिर में मध्यरात्रि उत्सव से मनाई जाती है। पुरानी शहर के चौक में दही हांडी होती है। भोपाल की विशिष्ट परंपरा में सजे रथों की शोभायात्रा और भारत भवन में सांस्कृतिक कार्यक्रम होते हैं।',
  },
  'janmashtami:chandigarh': {
    en: 'Chandigarh celebrates Janmashtami with well-organised events in Sector 20, 34, and 46 community centres. The city\'s ISKCON temple in Sector 36 hosts elaborate midnight celebrations. Being a Punjabi-dominant city, the tradition includes performing Raas Leela dramas and distributing panchamrit and butter-sugar (makhan mishri) to children.',
    hi: 'चंडीगढ़ में जन्माष्टमी सेक्टर 20, 34 और 46 के कम्युनिटी सेंटरों में सुव्यवस्थित आयोजनों से मनाई जाती है। सेक्टर 36 का इस्कॉन मंदिर भव्य मध्यरात्रि उत्सव करता है। पंजाबी परंपरा में रासलीला नाटक और बच्चों को पंचामृत व माखन-मिश्री बाँटी जाती है।',
  },
  'janmashtami:new-york': {
    en: 'New York celebrates Janmashtami at the ISKCON temple in Brooklyn (305 Schermerhorn St) with a 12-hour celebration culminating in a midnight abhishek. The Hindu Temple Society of North America in Flushing, Queens holds elaborate ceremonies. Jackson Heights hosts street celebrations, and the Bhakti Center in the East Village offers kirtan sessions through the night.',
    hi: 'न्यूयॉर्क में जन्माष्टमी ब्रुकलिन के इस्कॉन मंदिर में 12 घंटे के उत्सव और मध्यरात्रि अभिषेक से मनाई जाती है। फ्लशिंग का हिंदू मंदिर भव्य समारोह करता है। जैक्सन हाइट्स में सड़क उत्सव होता है, और ईस्ट विलेज के भक्ति सेंटर में रात भर कीर्तन होता है।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // MAHA SHIVARATRI
  // ═══════════════════════════════════════════════════════════════════
  'maha-shivaratri:delhi': {
    en: 'Delhi observes Maha Shivaratri with massive queues at the Shiv Mandir near Parliament (Birla Mandir) and Gauri Shankar Temple in Chandni Chowk. The Jhandewalan Temple and Yogmaya Temple in Mehrauli also see heavy footfall. Night-long jagran (vigil) programmes with bhajans are held in community temples across South and East Delhi.',
    hi: 'दिल्ली में महाशिवरात्रि पर बिरला मंदिर और चांदनी चौक के गौरी शंकर मंदिर में भारी भीड़ होती है। झंडेवालान मंदिर और महरौली के योगमाया मंदिर में भी दर्शनार्थी उमड़ते हैं। दक्षिण और पूर्वी दिल्ली में रातभर जागरण और भजन कार्यक्रम होते हैं।',
  },
  'maha-shivaratri:mumbai': {
    en: 'Mumbai celebrates Maha Shivaratri with night-long worship at Babulnath Temple (one of Mumbai\'s oldest Shiva temples) and the ancient Walkeshwar Temple at Malabar Hill. Thousands visit the Shiva Temple at Ambernath — a 1,000-year-old UNESCO-heritage-contender. The milk abhishek at Mahalakshmi\'s Shiva shrine draws huge crowds after midnight.',
    hi: 'मुंबई में महाशिवरात्रि बाबुलनाथ मंदिर (मुंबई के सबसे पुराने शिव मंदिरों में एक) और मालाबार हिल के वालकेश्वर मंदिर में रातभर पूजा से मनाई जाती है। हज़ारों लोग अंबरनाथ के 1000 साल पुराने शिव मंदिर जाते हैं। महालक्ष्मी शिव मंदिर में मध्यरात्रि के बाद दुग्ध अभिषेक होता है।',
  },
  'maha-shivaratri:bangalore': {
    en: 'Bangalore observes Maha Shivaratri with special emphasis on the Bull Temple (Dodda Basavana Gudi) in Basavanagudi — one of the largest Nandi statues in India. The Shivoham Shiva Temple in Ulsoor Road and the Gavi Gangadhareshwara Cave Temple host all-night vigils. Kannada tradition includes offering bilva patra collected from Lalbagh Botanical Garden.',
    hi: 'बेंगलुरु में महाशिवरात्रि बसवनगुड़ी के बुल टेम्पल (दोड्डा बसवन्ना गुड़ी) — भारत की सबसे बड़ी नंदी प्रतिमाओं में एक — पर विशेष रूप से मनाई जाती है। उलसूर रोड का शिवोहम मंदिर और गवी गंगाधरेश्वर गुफा मंदिर रातभर जागरण करते हैं।',
  },
  'maha-shivaratri:chennai': {
    en: 'Chennai observes Maha Shivaratri at the ancient Kapaleeshwarar Temple in Mylapore with elaborate abhishekam using milk, honey, and sandalwood paste. Thousands throng the Marundeeswarar Temple in Thiruvanmiyur and Vadapalani Murugan Temple. The unique Tamil tradition of singing Thevaram and Thiruvachagam hymns continues through all four yamas of the night.',
    hi: 'चेन्नई में महाशिवरात्रि मायलापुर के प्राचीन कपालीश्वर मंदिर में दूध, शहद और चंदन से अभिषेकम से मनाई जाती है। तिरुवन्मियुर का मरुन्देश्वर मंदिर और वडपलनी मुरुगन मंदिर में भी भीड़ होती है। रात के चारों याम तेवारम और तिरुवाचगम भजन गाए जाते हैं।',
  },
  'maha-shivaratri:kolkata': {
    en: 'Kolkata observes Maha Shivaratri with puja at the Tarakeshwar Temple (55km from city centre) which sees over 5 lakh devotees. Within the city, the Shiva temples at Bhukailash (Khidirpur) and the Dakshineshwar complex host night-long celebrations. Bengali tradition includes fasting without even water (nirjala) and reciting the Shiva Mahimna Stotram.',
    hi: 'कोलकाता में महाशिवरात्रि ताराकेश्वर मंदिर (शहर से 55 किमी) में 5 लाख से अधिक भक्तों के साथ मनाई जाती है। शहर में भुकैलास (खिदिरपुर) और दक्षिणेश्वर के शिव मंदिरों में रातभर उत्सव होता है। बंगाली परंपरा में निर्जल व्रत और शिव महिम्न स्तोत्रम् पाठ होता है।',
  },
  'maha-shivaratri:hyderabad': {
    en: 'Hyderabad observes Maha Shivaratri with grand celebrations at the Keesaragutta Temple (30km from city centre) which attracts lakhs of devotees. Within the city, the Kala Bhairava Temple in Old City and the thousand-pillar temple at Warangal (nearby) are key sites. The Telugu tradition includes performing Ekadasa Rudra Abhishekam with 11 types of sacred items.',
    hi: 'हैदराबाद में महाशिवरात्रि कीसरगुट्टा मंदिर (शहर से 30 किमी) में लाखों भक्तों के साथ भव्यता से मनाई जाती है। शहर में पुरानी सिटी का काल भैरव मंदिर प्रमुख है। तेलुगु परंपरा में एकादश रुद्र अभिषेकम 11 प्रकार की पवित्र सामग्रियों से किया जाता है।',
  },
  'maha-shivaratri:pune': {
    en: 'Pune observes Maha Shivaratri with special worship at the Parvati Hill Temple — one of Pune\'s most iconic landmarks — and at the Mahadev Temple at the base of Sinhagad Fort. The Someshwar Temple near Balewadi and the Bhimashankar Jyotirlinga (100km away) see massive pilgrimages. Marathi devotees sing Abhanga bhajans through the night.',
    hi: 'पुणे में महाशिवरात्रि पर्वती हिल मंदिर और सिंहगड किले के महादेव मंदिर में विशेष पूजा से मनाई जाती है। बालेवाड़ी का सोमेश्वर मंदिर और भीमाशंकर ज्योतिर्लिंग (100 किमी) में भारी तीर्थयात्रा होती है। मराठी भक्त रात भर अभंग भजन गाते हैं।',
  },
  'maha-shivaratri:ahmedabad': {
    en: 'Ahmedabad observes Maha Shivaratri with a unique Gujarati tradition — the grand procession (shobha yatra) through the old city pols with silver rath carrying Shiva lingam. The Mahadev Temple at Shahibaug and the Nageshwar Temple in Jamnagar (pilgrimage trip) are key sites. Gujarati families perform rudrabhishek at home temples.',
    hi: 'अहमदाबाद में महाशिवरात्रि विशिष्ट गुजराती परंपरा से मनाई जाती है — पुरानी शहर की पोलों में चाँदी के रथ पर शिवलिंग की शोभायात्रा निकलती है। शाहीबाग का महादेव मंदिर प्रमुख है। गुजराती परिवार घर मंदिर में रुद्राभिषेक करते हैं।',
  },
  'maha-shivaratri:jaipur': {
    en: 'Jaipur observes Maha Shivaratri with grand celebrations at the Birla Mandir (Laxmi Narayan Temple) at the foot of Moti Dungri hill. The ancient Ghat ki Guni Shiva Temple and Galtaji complex attract thousands. Rajasthani tradition includes making bhang ki lassi and thandai as Shiva\'s prasad, distributed freely in temple courtyards.',
    hi: 'जयपुर में महाशिवरात्रि मोती डूंगरी तलहटी के बिरला मंदिर में भव्य उत्सव से मनाई जाती है। प्राचीन घाट की गुणी शिव मंदिर और गलताजी में हज़ारों भक्त आते हैं। राजस्थानी परंपरा में शिव प्रसाद के रूप में भांग की लस्सी और ठंडाई मंदिर आँगन में बाँटी जाती है।',
  },
  'maha-shivaratri:lucknow': {
    en: 'Lucknow celebrates Maha Shivaratri with elaborate worship at the Mankameshwar Temple on the banks of the Gomti and the ancient Bara Imambara-adjacent Shiva shrine. Night-long jagran events with Awadhi-style bhajans are held at Hanuman Setu and Aliganj temples. Devotees make the pilgrimage to nearby Naimisharanya for holy dips.',
    hi: 'लखनऊ में महाशिवरात्रि गोमती तट के मनकामेश्वर मंदिर में भव्य पूजा से मनाई जाती है। हनुमान सेतु और अलीगंज मंदिरों में अवधी शैली के भजनों सहित रातभर जागरण होता है। भक्त पास के नैमिषारण्य में पवित्र स्नान के लिए जाते हैं।',
  },
  'maha-shivaratri:varanasi': {
    en: 'Varanasi — the city of Lord Shiva — is the ultimate destination for Maha Shivaratri. The Kashi Vishwanath Temple (one of 12 Jyotirlingas) sees queues stretching kilometres. The royal Shiva Baraat procession through the old city lanes is unique to Varanasi. All ghats perform special Ganga Aarti, and the Manikarnika Ghat glows with thousands of lamps.',
    hi: 'वाराणसी — भगवान शिव की नगरी — महाशिवरात्रि के लिए सर्वोत्तम स्थल है। काशी विश्वनाथ मंदिर (12 ज्योतिर्लिंगों में एक) में किलोमीटर लंबी पंक्तियाँ होती हैं। पुरानी गलियों में शिव बारात शोभायात्रा वाराणसी की अनूठी परंपरा है। सभी घाटों पर विशेष गंगा आरती होती है।',
  },
  'maha-shivaratri:patna': {
    en: 'Patna observes Maha Shivaratri with worship at the ancient Patan Devi Temple and the Shitala Mata-Shiva complex near Gandhi Maidan. The Baidyanath Jyotirlinga at Deoghar (250km) sees massive pilgrimages from Patna. Local tradition includes carrying Ganga water from the ghats to offer at Shiva temples throughout the city.',
    hi: 'पटना में महाशिवरात्रि प्राचीन पटन देवी मंदिर और गाँधी मैदान के पास शीतला माता-शिव मंदिर में पूजा से मनाई जाती है। देवघर का बैद्यनाथ ज्योतिर्लिंग (250 किमी) में पटना से भारी तीर्थयात्रा होती है। स्थानीय परंपरा में घाटों से गंगाजल लाकर शिवालयों में चढ़ाया जाता है।',
  },
  'maha-shivaratri:bhopal': {
    en: 'Bhopal observes Maha Shivaratri with special worship at the Bhojpur Temple (30km away) — home to one of the tallest Shiva lingams in India (7.5 feet, incomplete). The temple built by Raja Bhoj attracts lakhs of devotees. Within the city, the Gufa Mandir (cave temple) in Lalghati and the Birla Mandir host night-long celebrations.',
    hi: 'भोपाल में महाशिवरात्रि भोजपुर मंदिर (30 किमी) में विशेष पूजा से मनाई जाती है — जहाँ भारत के सबसे ऊँचे शिवलिंगों में एक (7.5 फीट) है। राजा भोज द्वारा निर्मित मंदिर में लाखों भक्त आते हैं। शहर में लालघाटी के गुफा मंदिर और बिरला मंदिर रातभर उत्सव करते हैं।',
  },
  'maha-shivaratri:chandigarh': {
    en: 'Chandigarh observes Maha Shivaratri at the Mansa Devi Temple complex in Panchkula foothills and the Shiva Temple in Sector 26. The Chattbir Shiva Temple near Zirakpur also sees large gatherings. Being a Punjabi city, the tradition includes night-long kirtan sessions and distributing thandai-flavoured prasad.',
    hi: 'चंडीगढ़ में महाशिवरात्रि पंचकूला तलहटी के मनसा देवी मंदिर और सेक्टर 26 के शिव मंदिर में मनाई जाती है। ज़ीरकपुर का छतबीर शिव मंदिर भी बड़ी भीड़ देखता है। पंजाबी परंपरा में रातभर कीर्तन और ठंडाई प्रसाद वितरण होता है।',
  },
  'maha-shivaratri:new-york': {
    en: 'New York observes Maha Shivaratri at the Hindu Temple Society of North America in Flushing with 4-yaama (four-watch) puja through the night. The Shiva-Vishnu Temple in Livermore (NJ commuters) and the Ganesh Temple in Queens both host abhishekam ceremonies. Community halls in Edison, NJ host large night-long bhajan sessions for the tri-state Indian diaspora.',
    hi: 'न्यूयॉर्क में महाशिवरात्रि फ्लशिंग के हिंदू मंदिर में 4 याम (चतुर्प्रहर) पूजा से मनाई जाती है। क्वीन्स का गणेश मंदिर अभिषेक करता है। एडिसन (न्यू जर्सी) के सामुदायिक हॉल में त्रि-राज्य भारतीय प्रवासियों के लिए रातभर भजन सत्र होते हैं।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // GANESH CHATURTHI
  // ═══════════════════════════════════════════════════════════════════
  'ganesh-chaturthi:delhi': {
    en: 'Delhi celebrates Ganesh Chaturthi with pandals in South Delhi (CR Park, known as "Mini Bengal"), Lajpat Nagar, and Rohini. The celebrations are modest compared to Mumbai, but CR Park\'s Durga-Ganesh pandals and the Siddhivinayak Temple in Panchsheel Park draw thousands. Immersion takes place at select ghats on the Yamuna.',
    hi: 'दिल्ली में गणेश चतुर्थी दक्षिण दिल्ली के सीआर पार्क, लाजपत नगर और रोहिणी में पंडालों से मनाई जाती है। सीआर पार्क के दुर्गा-गणेश पंडाल और पंचशील पार्क का सिद्धिविनायक मंदिर हज़ारों भक्तों को आकर्षित करते हैं। विसर्जन यमुना के चुनिंदा घाटों पर होता है।',
  },
  'ganesh-chaturthi:mumbai': {
    en: 'Mumbai celebrates Ganesh Chaturthi with unmatched grandeur — the city hosts over 200,000 pandals. The most famous is the Lalbaugcha Raja at Lalbaug, which attracts millions of devotees. The 10-day festival culminates in massive immersion processions along Girgaum Chowpatty and Juhu Beach, often lasting through the night.',
    hi: 'मुंबई गणेश चतुर्थी को अतुलनीय भव्यता से मनाती है — शहर में 2 लाख से अधिक पंडाल लगते हैं। सबसे प्रसिद्ध लालबागचा राजा है जो लाखों भक्तों को आकर्षित करता है। 10 दिवसीय उत्सव गिरगाँव चौपाटी और जुहू बीच पर विशाल विसर्जन जुलूस के साथ समाप्त होता है।',
  },
  'ganesh-chaturthi:bangalore': {
    en: 'Bangalore celebrates Ganesh Chaturthi with both Maharashtrian and Kannada traditions. Basavanagudi\'s Dodda Ganapathi Temple houses one of the largest Ganesha idols in the city. The Gavipuram Ganesha Temple and Bull Temple Road see major celebrations. Ulsoor Lake and Sankey Tank are official immersion points with eco-friendly mandates.',
    hi: 'बेंगलुरु में गणेश चतुर्थी महाराष्ट्रीय और कन्नड दोनों परंपराओं से मनाई जाती है। बसवनगुड़ी के दोड्डा गणपति मंदिर में शहर की सबसे बड़ी गणेश प्रतिमाओं में एक है। उलसूर झील और सैंकी टैंक इको-फ्रेंडली विसर्जन स्थल हैं।',
  },
  'ganesh-chaturthi:chennai': {
    en: 'Chennai celebrates Vinayaka Chaturthi (the Tamil name) with kolam-decorated pandals in T. Nagar, Mylapore, and Vadapalani. The Pillaiyar (Ganesha) temples at Ashok Nagar and Valasaravakkam are particularly popular. Immersion processions head to Pattinapakkam Beach and Elliot\'s Beach. Tamil tradition includes offering modakam (kozhukattai) and appam.',
    hi: 'चेन्नई में विनायक चतुर्थी (तमिल नाम) टी.नगर, मायलापुर और वडपलनी में कोलम-सजे पंडालों से मनाई जाती है। अशोक नगर और वलसरवक्कम के पिल्लैयार मंदिर विशेष लोकप्रिय हैं। विसर्जन शोभायात्रा पट्टिनपक्कम बीच की ओर जाती है। तमिल परंपरा में मोदकम (कोळुक्कट्टई) चढ़ाया जाता है।',
  },
  'ganesh-chaturthi:kolkata': {
    en: 'Kolkata has seen Ganesh Chaturthi grow significantly in recent years, though Durga Puja remains the primary festival. Pandals appear in Bhowanipore, Behala, and New Alipore. The Bengali tradition is more intimate — clay Ganesha murti is worshipped at home for 1-3 days. Immersion happens at Babughat and Princep Ghat on the Hooghly.',
    hi: 'कोलकाता में गणेश चतुर्थी हाल के वर्षों में बढ़ी है, हालाँकि दुर्गा पूजा प्रमुख त्योहार बना हुआ है। भवानीपुर, बेहाला और न्यू अलीपुर में पंडाल लगते हैं। बंगाली परंपरा अधिक घरेलू है — मिट्टी की गणेश मूर्ति 1-3 दिन घर पर पूजी जाती है। विसर्जन बाबूघाट पर होता है।',
  },
  'ganesh-chaturthi:hyderabad': {
    en: 'Hyderabad celebrates Ganesh Chaturthi on a massive scale — the Khairatabad Ganesh is the city\'s most famous, with idols reaching 40-60 feet in height. The immersion procession to Hussain Sagar Lake is a major event attracting millions. Balapur Ganesh laddu auction is nationally famous, with winning bids in crores. Tank Bund Road becomes the procession\'s main artery.',
    hi: 'हैदराबाद में गणेश चतुर्थी विशाल पैमाने पर मनाई जाती है — खैराताबाद गणेश सबसे प्रसिद्ध है, 40-60 फीट ऊँची मूर्तियों के साथ। हुसैन सागर झील में विसर्जन प्रमुख आयोजन है। बालापुर गणेश लड्डू नीलामी राष्ट्रीय स्तर पर प्रसिद्ध है जिसमें करोड़ों की बोली लगती है।',
  },
  'ganesh-chaturthi:pune': {
    en: 'Pune is the cultural birthplace of the public Ganesh Chaturthi celebration — Lokmanya Tilak started the tradition here in 1893. The five Manache Ganapati (honoured Ganeshas) lead the immersion procession: Kasba Ganpati, Tambdi Jogeshwari, Guruji Talim, Tulshibaug, and Kesariwada. Dagdusheth Halwai Ganpati draws massive crowds throughout the 10 days.',
    hi: 'पुणे सार्वजनिक गणेश चतुर्थी उत्सव का सांस्कृतिक जन्मस्थान है — लोकमान्य तिलक ने 1893 में यहीं यह परंपरा शुरू की। पाँच मानाचे गणपति विसर्जन शोभायात्रा का नेतृत्व करते हैं: कसबा, तांबडी जोगेश्वरी, गुरुजी तालीम, तुलसीबाग और केसरीवाड़ा। दगडूशेठ हलवाई गणपति 10 दिन भारी भीड़ आकर्षित करता है।',
  },
  'ganesh-chaturthi:ahmedabad': {
    en: 'Ahmedabad celebrates Ganesh Chaturthi with a growing Gujarati-Marathi crossover tradition. The main celebrations are in Madhupura, Raikhad, and Maninagar. Eco-friendly clay idols are increasingly popular. The immersion procession goes to Kankaria Lake and Sabarmati Riverfront. Gujarati-style modak (called modak or Ellu Bella) and shrikhand are traditional offerings.',
    hi: 'अहमदाबाद में गणेश चतुर्थी गुजराती-मराठी परंपराओं के मिश्रण से मनाई जाती है। मुख्य उत्सव मधुपुरा, रायखड़ और मणिनगर में होते हैं। इको-फ्रेंडली मिट्टी की मूर्तियाँ लोकप्रिय हैं। विसर्जन कांकरिया झील और साबरमती रिवरफ्रंट पर होता है।',
  },
  'ganesh-chaturthi:jaipur': {
    en: 'Jaipur celebrates Ganesh Chaturthi with visits to the Moti Dungri Ganesh Temple — Rajasthan\'s most famous Ganesh shrine, built in a Scottish castle-style architecture. The temple sees a footfall of over a lakh on Chaturthi. Rajasthani sweets like mawa kachori and ghevar are offered as naivedya. Immersion processions go to Mansagar Lake near Jal Mahal.',
    hi: 'जयपुर में गणेश चतुर्थी मोती डूंगरी गणेश मंदिर — राजस्थान का सबसे प्रसिद्ध गणेश मंदिर — में दर्शन से मनाई जाती है। चतुर्थी पर एक लाख से अधिक दर्शनार्थी आते हैं। राजस्थानी मावा कचौरी और घेवर नैवेद्य के रूप में चढ़ाया जाता है। विसर्जन मानसागर झील पर होता है।',
  },
  'ganesh-chaturthi:lucknow': {
    en: 'Lucknow celebrates Ganesh Chaturthi with pandals in Aminabad, Aliganj, and Gomti Nagar. The celebrations have grown in recent years with decorated pandals featuring elaborate themes. The immersion procession heads to the Gomti River ghats. Lucknawi tradition includes offering laddu from local sweet shops like Ram Asrey and special evening aartis.',
    hi: 'लखनऊ में गणेश चतुर्थी अमीनाबाद, अलीगंज और गोमती नगर में पंडालों से मनाई जाती है। हाल के वर्षों में थीम-आधारित भव्य पंडाल बढ़े हैं। विसर्जन शोभायात्रा गोमती नदी के घाटों की ओर जाती है। लखनवी परंपरा में राम आसरे की लड्डू और विशेष संध्या आरती होती है।',
  },
  'ganesh-chaturthi:varanasi': {
    en: 'Varanasi celebrates Ganesh Chaturthi with worship at the Sakshi Vinayak Temple near Kashi Vishwanath — one of the city\'s most revered Ganesha shrines. Pandals appear along the ghats and in Lanka and Bhelupur areas. The immersion at Dashashwamedh Ghat is accompanied by dhol-tasha processions. BHU campus also hosts notable celebrations.',
    hi: 'वाराणसी में गणेश चतुर्थी काशी विश्वनाथ के पास साक्षी विनायक मंदिर में पूजा से मनाई जाती है। घाटों पर और लंका-भेलूपुर में पंडाल लगते हैं। दशाश्वमेध घाट पर ढोल-ताशा शोभायात्रा के साथ विसर्जन होता है। बीएचयू कैम्पस में भी उल्लेखनीय उत्सव होता है।',
  },
  'ganesh-chaturthi:patna': {
    en: 'Patna celebrates Ganesh Chaturthi with pandals across Boring Road, Kankarbagh, and Danapur. Though not as large-scale as western India, the celebrations have grown with Maharashtrian and Bihari communities participating together. Immersion processions head to the Ganga ghats near Collectorate. Local tradition includes offering laddus and kheer.',
    hi: 'पटना में गणेश चतुर्थी बोरिंग रोड, कंकड़बाग और दानापुर में पंडालों से मनाई जाती है। महाराष्ट्रीय और बिहारी समुदाय मिलकर उत्सव मनाते हैं। विसर्जन शोभायात्रा कलेक्ट्रिएट के पास गंगा घाटों तक जाती है। स्थानीय परंपरा में लड्डू और खीर अर्पित की जाती है।',
  },
  'ganesh-chaturthi:bhopal': {
    en: 'Bhopal celebrates Ganesh Chaturthi with pandals in the old city, New Market, and MP Nagar areas. The 10-day celebration includes cultural programmes and bhajan sandhya. Immersion processions head to the Upper Lake (Bada Talab). The Moti Masjid-adjacent areas in the old city see Hindu-Muslim harmony during the celebrations.',
    hi: 'भोपाल में गणेश चतुर्थी पुरानी शहर, न्यू मार्केट और एमपी नगर में पंडालों से मनाई जाती है। 10 दिवसीय उत्सव में सांस्कृतिक कार्यक्रम और भजन संध्या होती है। विसर्जन शोभायात्रा बड़ा तालाब (अपर लेक) तक जाती है। पुरानी शहर में हिन्दू-मुस्लिम सद्भाव से उत्सव मनाया जाता है।',
  },
  'ganesh-chaturthi:chandigarh': {
    en: 'Chandigarh celebrates Ganesh Chaturthi with community pandals in Sectors 22, 34, and 43. The city promotes eco-friendly celebrations with clay idols and artificial ponds for immersion at Sukhna Lake. Panchkula\'s Ganesh pandals, particularly near Mansa Devi road, are also popular. Cultural programmes include Ganesh Vandana dance performances.',
    hi: 'चंडीगढ़ में गणेश चतुर्थी सेक्टर 22, 34 और 43 में सामुदायिक पंडालों से मनाई जाती है। शहर मिट्टी की मूर्तियों और सुखना झील पर कृत्रिम तालाबों में इको-फ्रेंडली विसर्जन को बढ़ावा देता है। पंचकूला में मनसा देवी रोड के पंडाल भी लोकप्रिय हैं।',
  },
  'ganesh-chaturthi:new-york': {
    en: 'New York celebrates Ganesh Chaturthi at the Ganesh Temple in Flushing, Queens — the oldest Hindu temple in North America (est. 1977). The temple conducts elaborate pujas for 10 days with special abhishekam and modak distribution. The Bharatiya Vidya Bhavan in Manhattan and community organisations in Jersey City host immersion ceremonies at the Hudson River.',
    hi: 'न्यूयॉर्क में गणेश चतुर्थी फ्लशिंग (क्वीन्स) के गणेश मंदिर — उत्तर अमेरिका का सबसे पुराना हिंदू मंदिर (1977) — में मनाई जाती है। 10 दिन विशेष अभिषेक और मोदक वितरण होता है। जर्सी सिटी की संस्थाएँ हडसन नदी पर विसर्जन करती हैं।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // HOLI
  // ═══════════════════════════════════════════════════════════════════
  'holi:delhi': {
    en: 'Delhi celebrates Holi with legendary street celebrations — the Holi Moo festival at JLN Stadium, colour parties at Hauz Khas Village, and traditional gulal throwing in Old Delhi\'s lanes near Jama Masjid. Homes prepare gujiya, mathri, and thandai days in advance. The President\'s Estate (Rashtrapati Bhavan) hosts an annual Holi Milap gathering.',
    hi: 'दिल्ली में होली प्रसिद्ध सड़क उत्सवों से मनाई जाती है — JLN स्टेडियम में होली मू फेस्टिवल, हौज़ खास विलेज में रंग पार्टियाँ, और पुरानी दिल्ली में गुलाल। घरों में दिनों पहले गुजिया, मथरी और ठंडाई बनती है। राष्ट्रपति भवन में वार्षिक होली मिलन होता है।',
  },
  'holi:mumbai': {
    en: 'Mumbai celebrates Holi with beach parties at Juhu and Versova, rooftop events in Bandra and Andheri, and traditional celebrations in the Marwari and Gujarati-dominated areas of South Mumbai. The Matharpacady village in Mazgaon (an East Indian Catholic enclave) celebrates a unique tradition called "Zimma" on Holi. Shivaji Park hosts large community gatherings.',
    hi: 'मुंबई में होली जुहू और वर्सोवा पर बीच पार्टियों, बांद्रा-अंधेरी में छत आयोजनों और दक्षिण मुंबई के मारवाड़ी-गुजराती क्षेत्रों में पारंपरिक तरीके से मनाई जाती है। मज़गाँव का माथारपाकडी गाँव होली पर "झिम्मा" नामक अनूठी परंपरा मनाता है।',
  },
  'holi:bangalore': {
    en: 'Bangalore celebrates Holi with a cosmopolitan flair — major events at Cubbon Park, Koramangala, and Whitefield cater to the city\'s diverse North Indian population. South Indian locals celebrate Kamadahana (burning of Kama) on the eve of Holi at neighbourhood bonfires. HSR Layout and Indiranagar host popular rain dance Holi events.',
    hi: 'बेंगलुरु में होली कॉस्मोपॉलिटन अंदाज़ में मनाई जाती है — कब्बन पार्क, कोरमंगला और व्हाइटफील्ड में बड़े आयोजन होते हैं। स्थानीय दक्षिण भारतीय होली की पूर्व संध्या पर कामदहन मनाते हैं। एचएसआर लेआउट और इंदिरानगर में रेन डांस होली लोकप्रिय है।',
  },
  'holi:chennai': {
    en: 'Chennai celebrates Holi in a more subdued manner than North India — the festival coincides with Panguni Uthiram celebrations at Mylapore\'s Kapaleeshwarar Temple. The North Indian community organises events at Anna Nagar and Adyar. Thiruvanmiyur Beach and Elliot\'s Beach see colour celebrations. Water scarcity awareness keeps celebrations dry-colour focused.',
    hi: 'चेन्नई में होली उत्तर भारत से कम धूमधाम से मनाई जाती है — यह पंगुनी उत्तिरम के साथ आती है। उत्तर भारतीय समुदाय अन्ना नगर और अड्यार में आयोजन करता है। तिरुवन्मियुर बीच पर रंग उत्सव होता है। जल संकट के कारण सूखे रंगों पर ज़ोर दिया जाता है।',
  },
  'holi:kolkata': {
    en: 'Kolkata celebrates Holi as Dol Jatra or Basanta Utsav — a more musical, dance-oriented celebration popularised by Rabindranath Tagore at Shantiniketan. Women wear yellow saris and smear each other with abir (perfumed powder). Jorasanko Thakur Bari (Tagore\'s ancestral home) hosts cultural programmes. The tradition is gentler and more poetic than North Indian Holi.',
    hi: 'कोलकाता में होली दोल जात्रा या बसंत उत्सव के रूप में मनाई जाती है — रवीन्द्रनाथ टैगोर द्वारा शांतिनिकेतन में लोकप्रिय की गई संगीत व नृत्य प्रधान परंपरा। महिलाएँ पीली साड़ी पहनकर अबीर लगाती हैं। जोड़ासांको ठाकुरबाड़ी में सांस्कृतिक कार्यक्रम होते हैं।',
  },
  'holi:hyderabad': {
    en: 'Hyderabad celebrates Holi with colour events at Ramoji Film City, Shilparamam craft village, and the Jalavihar waterpark. The old city sees more traditional celebrations in the Marwari and North Indian localities around Sultan Bazaar and Koti. Golconda Fort area hosts community bonfires (Holika Dahan). Telugu families prepare special Bobbatlu (Puran Poli) for the occasion.',
    hi: 'हैदराबाद में होली रामोजी फिल्म सिटी, शिल्पारामम और जलविहार वॉटरपार्क में रंग उत्सवों से मनाई जाती है। सुल्तान बाज़ार और कोटी के मारवाड़ी-उत्तर भारतीय क्षेत्रों में पारंपरिक उत्सव होता है। गोलकुंडा किले पर सामुदायिक होलिका दहन होता है।',
  },
  'holi:pune': {
    en: 'Pune celebrates Holi with Rang Panchami — colour play happens five days after Holika Dahan, not on the same day as in North India. The Marathi tradition of playing with wet colours and pichkaris peaks on Rang Panchami at Shaniwar Wada and Laxmi Road. Puranpoli (sweet flatbread) is the traditional Holi dish. Dhulandi celebrations in Deccan Gymkhana are famous.',
    hi: 'पुणे में होली रंग पंचमी के रूप में मनाई जाती है — होलिका दहन के पाँच दिन बाद रंग खेला जाता है। शनिवार वाड़ा और लक्ष्मी रोड पर रंग पंचमी धूमधाम से मनाई जाती है। पुरनपोली (मीठी रोटी) पारंपरिक होली पकवान है। डेक्कन जिमखाना की धुलंडी प्रसिद्ध है।',
  },
  'holi:ahmedabad': {
    en: 'Ahmedabad celebrates Holi with the unique Gujarati tradition of Dhuleti (the day after Holika Dahan). The old city pols see colourful celebrations with water balloons and natural colours. Kankaria Lakefront hosts large community events. The Sabarmati Ashram celebrates with a more Gandhian simplicity. Gujarati tradition includes fafda-jalebi breakfast on Dhuleti morning.',
    hi: 'अहमदाबाद में होली गुजराती धुलेटी परंपरा (होलिका दहन के अगले दिन) से मनाई जाती है। पुरानी शहर की पोलों में पानी के गुब्बारों और प्राकृतिक रंगों से खेला जाता है। कांकरिया लेकफ्रंट पर बड़े सामुदायिक आयोजन होते हैं। धुलेटी की सुबह फाफड़ा-जलेबी का नाश्ता परंपरा है।',
  },
  'holi:jaipur': {
    en: 'Jaipur celebrates Holi with royal splendour — the City Palace hosts the famous "Elephant Holi" where decorated elephants parade and participate in colour festivities. Govind Dev Ji Temple in the palace complex hosts traditional celebrations. The Pink City\'s lanes are transformed with colour, and tourists flock to experience Holi at Amer Fort and Nahargarh.',
    hi: 'जयपुर में होली शाही शान से मनाई जाती है — सिटी पैलेस में प्रसिद्ध "हाथी होली" होती है जहाँ सजे हाथी रंग उत्सव में भाग लेते हैं। गोविंद देव जी मंदिर में पारंपरिक उत्सव होता है। गुलाबी शहर की गलियाँ रंगों से भर जाती हैं और पर्यटक आमेर किले पर होली मनाने आते हैं।',
  },
  'holi:lucknow': {
    en: 'Lucknow celebrates Holi with Awadhi refinement — the tradition of "rang" is accompanied by classical music soirees and recitation of Hori (Holi songs by Tansen and Amir Khusrau). Hazratganj and Aminabad see vibrant colour play. The tradition of serving thandai laced with bhang and Lucknawi malai gilori continues in old Lucknow households.',
    hi: 'लखनऊ में होली अवधी शिष्टता से मनाई जाती है — रंग के साथ शास्त्रीय संगीत और होरी (तानसेन व अमीर खुसरो की होली) की महफ़िलें होती हैं। हज़रतगंज और अमीनाबाद में जमकर रंग खेला जाता है। पुराने लखनऊ में भांग की ठंडाई और मलाई गिलौरी की परंपरा जारी है।',
  },
  'holi:varanasi': {
    en: 'Varanasi celebrates Holi with extraordinary intensity — Rang Bhari Ekadashi (8 days before Holi) marks the beginning at Kashi Vishwanath when even the deities are smeared with gulal. The main Holi on the ghats is legendary with music, bhang-infused thandai, and colours thrown from boats on the Ganga. The cremation ground (Manikarnika) is the only ghat where Holi is not played.',
    hi: 'वाराणसी में होली असाधारण उत्साह से मनाई जाती है — रंगभरी एकादशी (होली से 8 दिन पहले) काशी विश्वनाथ में शुरू होती है जब देवताओं को भी गुलाल लगाया जाता है। घाटों पर मुख्य होली संगीत, भांग की ठंडाई और गंगा की नावों से रंग उड़ाने के साथ प्रसिद्ध है।',
  },
  'holi:patna': {
    en: 'Patna celebrates Holi with vibrant colour play in the streets of Boring Road, Kankarbagh, and the old city near Patna Sahib. The Bihar tradition includes singing folk Holi songs (Faag or Phaguaa) with dholak accompaniment days before the festival. Gandhi Maidan sees community bonfires. Bihar\'s malpua (sweet pancake) is the traditional Holi delicacy.',
    hi: 'पटना में होली बोरिंग रोड, कंकड़बाग और पटना साहिब की पुरानी गलियों में जमकर रंग खेलकर मनाई जाती है। बिहार की परंपरा में दिनों पहले ढोलक पर फाग (फगुआ) गाया जाता है। गाँधी मैदान में सामुदायिक होलिका दहन होता है। बिहार का मालपुआ पारंपरिक होली पकवान है।',
  },
  'holi:bhopal': {
    en: 'Bhopal celebrates Holi with a communal harmony tradition — Rang Panchami is celebrated alongside regular Holi in the city. The old city around Chowk and Itwara sees intense colour play. Bhojtal (Upper Lake) promenade hosts community gatherings. The Bhimbetka caves near Bhopal are believed to contain ancient rock paintings depicting Holi-like celebrations.',
    hi: 'भोपाल में होली सांप्रदायिक सद्भाव से मनाई जाती है — होली के साथ रंग पंचमी भी मनाई जाती है। चौक और इतवारा की पुरानी शहर में ज़बरदस्त रंग खेला जाता है। भोजताल (बड़ा तालाब) प्रोमनेड पर सामुदायिक आयोजन होते हैं।',
  },
  'holi:chandigarh': {
    en: 'Chandigarh celebrates Holi with organised community events at Sector 17 Plaza, Sukhna Lake, and Leisure Valley. The city enforces water conservation norms during Holi, promoting dry colours and organic gulal. Rose Garden and Rock Garden host special Holi-themed events. Punjabi tradition includes singing "Hola Mohalla" songs and preparing gujiya and dahi bhalle.',
    hi: 'चंडीगढ़ में होली सेक्टर 17 प्लाज़ा, सुखना झील और लेज़र वैली में सुव्यवस्थित आयोजनों से मनाई जाती है। शहर जल संरक्षण के लिए सूखे और जैविक रंगों को बढ़ावा देता है। रोज़ गार्डन और रॉक गार्डन में विशेष होली आयोजन होते हैं। पंजाबी परंपरा में गुजिया और दही भल्ले बनाए जाते हैं।',
  },
  'holi:new-york': {
    en: 'New York celebrates Holi at multiple venues — the Festival of Colors in Brooklyn attracts thousands, while the Holi Hai event at Governors Island is the city\'s largest. Jackson Heights hosts traditional community celebrations with gulal and thandai. The BAPS Swaminarayan Mandir in Robbinsville (NJ) and the Radha Krishna Temple in Flushing hold traditional pujas on Phalguni Purnima.',
    hi: 'न्यूयॉर्क में होली कई स्थानों पर मनाई जाती है — ब्रुकलिन का फेस्टिवल ऑफ कलर्स हज़ारों लोगों को आकर्षित करता है। गवर्नर्स आइलैंड पर होली है शहर का सबसे बड़ा आयोजन है। जैक्सन हाइट्स में गुलाल और ठंडाई के साथ पारंपरिक समुदायिक उत्सव होता है।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // DUSSEHRA
  // ═══════════════════════════════════════════════════════════════════
  'dussehra:delhi': {
    en: 'Delhi hosts India\'s grandest Dussehra celebrations at the Ramlila Maidan where massive Ravana effigies (over 100 feet tall) are set ablaze. The Lav Kush Ramlila at Red Fort grounds and the Shriram Bharatiya Kala Kendra\'s Ramlila are nationally famous. The event at the old Delhi Ramlila Maidan has been attended by sitting Prime Ministers.',
    hi: 'दिल्ली में दशहरा रामलीला मैदान पर भारत का सबसे भव्य उत्सव होता है जहाँ 100 फीट से अधिक ऊँचे रावण के पुतले जलाए जाते हैं। लाल किले की लव-कुश रामलीला और श्रीराम भारतीय कला केन्द्र की रामलीला राष्ट्रीय स्तर पर प्रसिद्ध है।',
  },
  'dussehra:mumbai': {
    en: 'Mumbai celebrates Dussehra with Ramlila performances in Shivaji Park (Dadar) and the burning of Ravana effigies at Azad Maidan and BKC grounds. The Gujarati and Rajasthani communities in Ghatkopar perform traditional Garba-Raas on the nine nights preceding Dussehra. Cross-the-road processions (Shobha Yatras) pass through Girgaum and Lalbaug.',
    hi: 'मुंबई में दशहरा शिवाजी पार्क (दादर) में रामलीला और आज़ाद मैदान पर रावण दहन से मनाया जाता है। घाटकोपर में गुजराती-राजस्थानी समुदाय नवरात्रि में गरबा-रास करते हैं। गिरगाँव और लालबाग में शोभा यात्राएँ निकलती हैं।',
  },
  'dussehra:bangalore': {
    en: 'Bangalore celebrates Dussehra in the Mysuru tradition — though the grand Mysore Dasara (90km away) steals the spotlight. Within the city, Bombe Habba (doll festival) is displayed in Rajajinagar and Basavanagudi homes. The Palace Grounds host Ramlila events. The Karnataka government organises a Dasara exhibition on Palace Grounds modelled after the Mysore procession.',
    hi: 'बेंगलुरु में दशहरा मैसूरु परंपरा से मनाया जाता है — हालाँकि मैसूर दशहरा (90 किमी) मुख्य आकर्षण है। शहर में राजाजीनगर और बसवनगुड़ी के घरों में बोम्बे हब्बा (गुड़िया उत्सव) सजाया जाता है। पैलेस ग्राउंड पर रामलीला और दशहरा प्रदर्शनी होती है।',
  },
  'dussehra:chennai': {
    en: 'Chennai celebrates Dussehra as Vijayadashami — the day is auspicious for starting new ventures and children\'s education (Vidyarambham ceremony). Golu (Bommai Kolu) — stepped displays of dolls — are set up in homes across Mylapore, Adyar, and Besant Nagar. Women exchange haldi-kumkum and sundal prasad. Kapaleeshwarar Temple hosts a grand Saraswati Puja.',
    hi: 'चेन्नई में दशहरा विजयादशमी के रूप में मनाया जाता है — यह नए कार्य और बच्चों की शिक्षा (विद्यारम्भम) शुरू करने का शुभ दिन है। मायलापुर, अड्यार और बेसंत नगर में गोलु (बोम्मई कोलु) — गुड़ियों की सीढ़ीनुमा सजावट — सजाई जाती है।',
  },
  'dussehra:kolkata': {
    en: 'Kolkata does not celebrate Dussehra in the North Indian sense — instead, Vijayadashami marks the culmination of Durga Puja. Goddess Durga idols are immersed in the Hooghly River in massive processions from thousands of pandals. Women perform Sindur Khela (smearing vermillion on each other and the deity) before the emotional Visarjan. Babughat is the largest immersion point.',
    hi: 'कोलकाता में दशहरा उत्तर भारतीय तरीके से नहीं बल्कि विजयादशमी दुर्गा पूजा की समाप्ति के रूप में मनाया जाता है। हज़ारों पंडालों से माँ दुर्गा की मूर्तियाँ हुगली नदी में विसर्जित होती हैं। महिलाएँ सिंदूर खेला करती हैं। बाबूघाट सबसे बड़ा विसर्जन स्थल है।',
  },
  'dussehra:hyderabad': {
    en: 'Hyderabad celebrates Dussehra with the Bathukamma festival unique to Telangana — women make floral stacks (Bathukamma) and immerse them in lakes. Ravana Dahan happens at Exhibition Grounds and Necklace Road. The Telangana government organises a grand Bathukamma event at Tank Bund with lakhs of women participating in the floral celebration.',
    hi: 'हैदराबाद में दशहरा तेलंगाना के अनूठे बतुकम्मा उत्सव से मनाया जाता है — महिलाएँ फूलों के ढेर (बतुकम्मा) बनाकर झीलों में विसर्जित करती हैं। रावण दहन प्रदर्शनी मैदान और नेकलेस रोड पर होता है। टैंक बंड पर लाखों महिलाओं का बतुकम्मा आयोजन होता है।',
  },
  'dussehra:pune': {
    en: 'Pune celebrates Dussehra with the Maratha tradition of Seemolanghan (crossing borders) — symbolically stepping across the city boundary. The Shrimant Dagdusheth Halwai Ganpati Trust organises a major Ramlila. Families exchange Apta (Bauhinia) leaves as gold symbols. Shaniwar Wada hosts cultural programmes commemorating the Peshwa era Dussehra celebrations.',
    hi: 'पुणे में दशहरा मराठा सीमोल्लंघन परंपरा से मनाया जाता है — शहर की सीमा पार करने का प्रतीकात्मक कर्म। दगडूशेठ हलवाई गणपति ट्रस्ट रामलीला आयोजित करता है। परिवार आपटा (बहुनिया) पत्ते सोने के प्रतीक के रूप में बाँटते हैं। शनिवार वाड़ा में पेशवा युग की याद में कार्यक्रम होते हैं।',
  },
  'dussehra:ahmedabad': {
    en: 'Ahmedabad celebrates Dussehra on the culmination of nine nights of Navratri Garba — Gujarat\'s signature celebration. The GMDC Ground, Karnavati Club, and United Way Garba events are among Asia\'s largest. Dussehra morning sees the burning of Ravana effigies at Sabarmati Riverfront, but Garba remains the highlight. Fafda-Jalebi is the traditional morning breakfast.',
    hi: 'अहमदाबाद में दशहरा नवरात्रि गरबा के नौ रातों की समाप्ति पर मनाया जाता है — गुजरात का सबसे बड़ा उत्सव। GMDC ग्राउंड और कर्णावती क्लब के गरबा एशिया के सबसे बड़े हैं। दशहरा सुबह साबरमती रिवरफ्रंट पर रावण दहन होता है, लेकिन गरबा मुख्य आकर्षण रहता है।',
  },
  'dussehra:jaipur': {
    en: 'Jaipur celebrates Dussehra with a royal procession — the erstwhile Jaipur royal family participates in the Vijay Dashami Shobha Yatra from City Palace to Amar Jawan Jyoti. Giant Ravana effigies are burnt at Polo Ground and SMS Stadium. The Kachhwaha Rajput tradition includes Shastra Puja (weapon worship) and taking out the royal swords from the armoury.',
    hi: 'जयपुर में दशहरा शाही शोभायात्रा से मनाया जाता है — जयपुर राजपरिवार सिटी पैलेस से अमर जवान ज्योति तक विजय दशमी यात्रा में भाग लेता है। पोलो ग्राउंड पर विशाल रावण दहन होता है। कच्छवाहा राजपूत परंपरा में शस्त्र पूजा और राजसी तलवारें निकाली जाती हैं।',
  },
  'dussehra:lucknow': {
    en: 'Lucknow celebrates Dussehra with grand Ramlila performances at Aishbagh Ramleela — one of India\'s oldest (since 1860s). The Ravana effigies at Aishbagh ground are among UP\'s tallest. The Awadhi tradition includes a procession of Ram\'s chariot through Hazratganj. Nakhas and Chowk areas have weeks-long Ramlila performances with local theatre troupes.',
    hi: 'लखनऊ में दशहरा ऐशबाग रामलीला — भारत की सबसे पुरानी में एक (1860 के दशक से) — में भव्य रामलीला से मनाया जाता है। ऐशबाग मैदान के रावण पुतले UP के सबसे ऊँचे हैं। अवधी परंपरा में राम रथ की हज़रतगंज से शोभायात्रा निकलती है।',
  },
  'dussehra:varanasi': {
    en: 'Varanasi celebrates Dussehra with the famous Ramnagar Ramlila — a month-long dramatic enactment across the entire town of Ramnagar (across the Ganga). Started by Maharaja Udit Narayan Singh in the early 19th century, it is UNESCO-recognised Intangible Cultural Heritage. The king of Ramnagar still presides over the ceremony on his elephant.',
    hi: 'वाराणसी में दशहरा प्रसिद्ध रामनगर रामलीला से मनाया जाता है — गंगा पार रामनगर में एक महीने की नाट्य प्रस्तुति। 19वीं सदी में महाराजा उदित नारायण सिंह द्वारा शुरू की गई यह UNESCO मान्यता प्राप्त अमूर्त सांस्कृतिक धरोहर है। रामनगर के राजा आज भी हाथी पर इस समारोह की अध्यक्षता करते हैं।',
  },
  'dussehra:patna': {
    en: 'Patna celebrates Dussehra with Ramlila performances at Gandhi Maidan and Ravana Dahan at the Exhibition Ground. The week-long Ramlila at Gardanibagh is among Bihar\'s most famous. Patna\'s distinct tradition includes a massive Durga Puja celebration running parallel, with immersion processions meeting the Dussehra processions at the Ganga ghats.',
    hi: 'पटना में दशहरा गाँधी मैदान पर रामलीला और प्रदर्शनी मैदान पर रावण दहन से मनाया जाता है। गर्दनीबाग की रामलीला बिहार की सबसे प्रसिद्ध है। पटना की विशिष्ट परंपरा में दुर्गा पूजा विसर्जन शोभायात्रा दशहरा जुलूस से गंगा घाटों पर मिलती है।',
  },
  'dussehra:bhopal': {
    en: 'Bhopal celebrates Dussehra with grand Ramlila at the BHEL Ground and Ravana Dahan at Lal Parade Ground. The 10-day celebration includes nightly Ramlila performances at multiple venues across the old city. The tradition of Shastra Puja is observed at police and military establishments. Dussehra processions pass through the MP Nagar and New Market areas.',
    hi: 'भोपाल में दशहरा BHEL ग्राउंड पर भव्य रामलीला और लाल परेड ग्राउंड पर रावण दहन से मनाया जाता है। 10 दिवसीय उत्सव में पुरानी शहर के कई स्थानों पर रामलीला होती है। पुलिस और सैन्य प्रतिष्ठानों में शस्त्र पूजा होती है। शोभायात्रा एमपी नगर से गुज़रती है।',
  },
  'dussehra:chandigarh': {
    en: 'Chandigarh celebrates Dussehra with one of North India\'s tallest Ravana effigies at the Sector 46 ground — often exceeding 80 feet. The Ramlila at Sector 16 is the city\'s longest-running cultural event. Dussehra Mela at Ramleela Ground offers carnival rides and food stalls. The Punjab tradition of exchanging "Neel Kanth" (blue jay bird) sightings is considered auspicious.',
    hi: 'चंडीगढ़ में दशहरा सेक्टर 46 मैदान पर उत्तर भारत के सबसे ऊँचे रावण पुतलों (80 फीट से अधिक) से मनाया जाता है। सेक्टर 16 की रामलीला शहर का सबसे पुराना सांस्कृतिक आयोजन है। रामलीला मैदान पर दशहरा मेला लगता है। नीलकंठ पक्षी देखना शुभ माना जाता है।',
  },
  'dussehra:new-york': {
    en: 'New York celebrates Dussehra with community Ramlila performances at South Street Seaport and cultural centres in Jackson Heights. The Association of Indians in America organises Ravana Dahan events in New Jersey parks. Navratri Garba nights at the Javits Center and various Queens venues precede Dussehra. Indian consulate hosts a diplomatic Dussehra reception.',
    hi: 'न्यूयॉर्क में दशहरा साउथ स्ट्रीट सीपोर्ट और जैक्सन हाइट्स में सामुदायिक रामलीला से मनाया जाता है। एसोसिएशन ऑफ इंडियन्स इन अमेरिका न्यू जर्सी के पार्कों में रावण दहन करता है। जेविट्स सेंटर में नवरात्रि गरबा दशहरा से पहले होता है।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // RAM NAVAMI
  // ═══════════════════════════════════════════════════════════════════
  'ram-navami:delhi': {
    en: 'Delhi celebrates Ram Navami with grand processions through Chandni Chowk and the old city. The Hanuman Temple at Connaught Place and the Birla Mandir host special ceremonies. Jhankis (tableaux) depicting scenes from Ramcharitmanas travel through Karol Bagh and Rajouri Garden. The Lal Qila (Red Fort) area sees massive gatherings.',
    hi: 'दिल्ली में राम नवमी चांदनी चौक और पुरानी दिल्ली में भव्य शोभायात्राओं से मनाई जाती है। कनॉट प्लेस का हनुमान मंदिर और बिरला मंदिर विशेष समारोह करते हैं। करोलबाग और राजौरी गार्डन में रामचरितमानस के दृश्यों की झाँकियाँ निकलती हैं।',
  },
  'ram-navami:mumbai': {
    en: 'Mumbai celebrates Ram Navami with processions through Dadar, Girgaum, and Bhandup. The Ram Mandir at Wadala is a major centre of worship. Sindhi communities in Ulhasnagar organise massive Jhulelal-Ram processions. South Mumbai\'s Thakurdwar area hosts a week-long Ramayan Parayan (recitation). ISKCON Juhu conducts Ram Abhishek at noon (the birth moment).',
    hi: 'मुंबई में राम नवमी दादर, गिरगाँव और भांडुप में शोभायात्राओं से मनाई जाती है। वडाला का राम मंदिर प्रमुख पूजा केन्द्र है। उल्हासनगर में सिंधी समुदाय भव्य झूलेलाल-राम शोभायात्रा करता है। ठाकुरद्वार में सप्ताहभर रामायण पारायण होता है।',
  },
  'ram-navami:bangalore': {
    en: 'Bangalore celebrates Sri Rama Navami with the famous Ragigudda Sri Prasanna Ramaswamy Temple in Jayanagar hosting a massive celebration. The Karnataka tradition includes Sri Rama Pattabhisheka (coronation re-enactment). Iskcon Rajajinagar, Ramanjaneya Temple in Basavanagudi, and the Art of Living campus all host special programmes.',
    hi: 'बेंगलुरु में श्री राम नवमी जयनगर के रागीगुड्डा मंदिर में भव्य उत्सव से मनाई जाती है। कर्नाटक परंपरा में श्री राम पट्टाभिषेक (राज्याभिषेक पुनर्प्रस्तुति) होता है। इस्कॉन राजाजीनगर और बसवनगुड़ी के रामांजनेय मंदिर में विशेष कार्यक्रम होते हैं।',
  },
  'ram-navami:chennai': {
    en: 'Chennai observes Sri Rama Navami with grand celebrations at the Kodandaramaswamy Temple in Vadapalani and the Parthasarathy Temple in Triplicane. The tradition of Sita Rama Kalyanam (celestial wedding) is performed in many temples. A 9-day Ramayana Parayanam concludes on Navami day. Sundara Kandam recitation is considered especially meritorious.',
    hi: 'चेन्नई में श्री राम नवमी वडपलनी के कोदंडरामस्वामी मंदिर और त्रिप्लिकेन के पार्थसारथी मंदिर में भव्यता से मनाई जाती है। सीता राम कल्याणम (दिव्य विवाह) कई मंदिरों में होता है। 9 दिवसीय रामायण पारायणम नवमी पर समाप्त होता है।',
  },
  'ram-navami:kolkata': {
    en: 'Kolkata celebrates Ram Navami with growing enthusiasm — processions with Ram-Sita-Hanuman jhankis pass through Burrabazar, Shyambazar, and Central Avenue. The celebrations have expanded significantly in recent years with large community participation. Bengali Vaishnava tradition includes recitation from Krittibas Ramayan.',
    hi: 'कोलकाता में राम नवमी बढ़ते उत्साह से मनाई जाती है — बड़ाबाज़ार, श्यामबाज़ार और सेंट्रल एवेन्यू में राम-सीता-हनुमान झाँकियों की शोभायात्रा निकलती है। हाल के वर्षों में उत्सव बड़े पैमाने पर बढ़ा है। बंगाली वैष्णव परंपरा में कृत्तिवास रामायण का पाठ होता है।',
  },
  'ram-navami:hyderabad': {
    en: 'Hyderabad celebrates Ram Navami with a famous grand procession from the Sri Sita Ramachandra Swamy Temple in Old City\'s Sultan Bazaar to Badi Chowdi. The procession features a golden chariot (Ratham) carrying Ram-Sita-Lakshmana idols. Sri Rama Navami Utsava Committee has organised this since 1901, making it one of India\'s oldest.',
    hi: 'हैदराबाद में राम नवमी सुल्तान बाज़ार के श्री सीता रामचन्द्र स्वामी मंदिर से बड़ी चौड़ी तक भव्य शोभायात्रा से मनाई जाती है। शोभायात्रा में सोने का रथ राम-सीता-लक्ष्मण विग्रह ले जाता है। श्री रामनवमी उत्सव समिति 1901 से यह आयोजन करती है।',
  },
  'ram-navami:pune': {
    en: 'Pune celebrates Ram Navami with the Marathi tradition of reading Bhavartha Ramayana and performing puja at noon (the birth hour). The Tulshibaug Ram Mandir and Ram Mandir in Budhwar Peth are the main centres. Community kitchens distribute panhe (raw mango drink) and kosimbir. The tradition of fasting until noon and breaking fast with panakam is followed.',
    hi: 'पुणे में राम नवमी मराठी परंपरा से भावार्थ रामायण पाठ और दोपहर (जन्म समय) पूजा से मनाई जाती है। तुलसीबाग राम मंदिर और बुधवार पेठ मुख्य केन्द्र हैं। सामुदायिक रसोई पन्हा (कच्चे आम का पेय) और कोशिम्बिर बाँटती है।',
  },
  'ram-navami:ahmedabad': {
    en: 'Ahmedabad celebrates Ram Navami with a grand Rath Yatra through the old city pols — from Kalupur to Jamalpur. The procession is second in scale only to the Jagannath Rath Yatra in the city. Ram temples in Raipur area and Swaminarayan Mandir host special Ram Janma celebrations at noon with cradle ceremonies. Gujarati ram-dhun singing continues all day.',
    hi: 'अहमदाबाद में राम नवमी पुरानी शहर की पोलों से भव्य रथ यात्रा — कालूपुर से जमालपुर तक — से मनाई जाती है। रायपुर क्षेत्र के राम मंदिरों और स्वामीनारायण मंदिर में दोपहर पालना उत्सव होता है। दिनभर गुजराती रामधुन गाई जाती है।',
  },
  'ram-navami:jaipur': {
    en: 'Jaipur celebrates Ram Navami with the royal tradition of taking out a grand procession from the Ram Mandir in Johari Bazaar through the walled city gates. The Govind Dev Ji Temple hosts kirtan all day. Rajasthani tradition includes reciting Ramcharitmanas at home from Bal Kanda. Special rabri and churma are offered as bhog.',
    hi: 'जयपुर में राम नवमी जौहरी बाज़ार के राम मंदिर से दीवारों वाले शहर के दरवाज़ों से भव्य शोभायात्रा की शाही परंपरा से मनाई जाती है। गोविंद देव जी मंदिर में दिनभर कीर्तन होता है। राजस्थानी परंपरा में घर पर रामचरितमानस बालकांड का पाठ होता है।',
  },
  'ram-navami:lucknow': {
    en: 'Lucknow celebrates Ram Navami with the Awadhi tradition of grand processions from Aliganj\'s Hanuman Mandir through Hazratganj. Being the land of Awadh (Ayodhya is 130km away), the celebrations carry special cultural significance. Kanak Bhawan-style cradle ceremonies are performed at noon. Ram Katha sessions continue for nine days at Tulsi Udyan.',
    hi: 'लखनऊ में राम नवमी अलीगंज हनुमान मंदिर से हज़रतगंज तक भव्य शोभायात्रा की अवधी परंपरा से मनाई जाती है। अवध की भूमि होने से (अयोध्या 130 किमी) उत्सव का विशेष सांस्कृतिक महत्व है। दोपहर कनक भवन शैली का पालना उत्सव होता है।',
  },
  'ram-navami:varanasi': {
    en: 'Varanasi celebrates Ram Navami with grand worship at the Sankat Mochan Hanuman Temple and the Tulsi Manas Temple (built at the site where Tulsidas wrote Ramcharitmanas). A massive procession passes through the old city lanes. The Ramnagar temple also holds week-long celebrations. Noon abhishek at Ram temples along the ghats marks the birth moment.',
    hi: 'वाराणसी में राम नवमी संकट मोचन हनुमान मंदिर और तुलसी मानस मंदिर (जहाँ तुलसीदास ने रामचरितमानस लिखा) में भव्य पूजा से मनाई जाती है। पुरानी गलियों से विशाल शोभायात्रा निकलती है। दोपहर घाटों के राम मंदिरों में अभिषेक जन्म क्षण मनाता है।',
  },
  'ram-navami:patna': {
    en: 'Patna celebrates Ram Navami with processions through Ashok Rajpath and the old city. The Mahavir Mandir near Patna Junction — one of India\'s richest temples — hosts grand celebrations with special abhishek. Patna\'s Sonepur Mela ground sees large gatherings. The Bihar tradition of Ram Katha by local kathavachaks continues for nine days before Navami.',
    hi: 'पटना में राम नवमी अशोक राजपथ और पुरानी शहर में शोभायात्राओं से मनाई जाती है। पटना जंक्शन का महावीर मंदिर — भारत के सबसे धनी मंदिरों में एक — भव्य अभिषेक करता है। बिहार की परंपरा में नवमी से पहले नौ दिन स्थानीय कथावाचकों द्वारा राम कथा होती है।',
  },
  'ram-navami:bhopal': {
    en: 'Bhopal celebrates Ram Navami with a grand Shobha Yatra through the New Market and Peer Gate areas. The Birla Mandir and the Ram Mandir in Arera Colony host special noon celebrations with cradle ceremonies. Community pandals in Kolar and BHEL townships perform continuous Ramayan Akhand Path. MP government organises official Ram Navami events at Lal Parade Ground.',
    hi: 'भोपाल में राम नवमी न्यू मार्केट और पीर गेट से भव्य शोभा यात्रा से मनाई जाती है। बिरला मंदिर और अरेरा कॉलोनी के राम मंदिर में दोपहर पालना उत्सव होता है। कोलार और BHEL में सामुदायिक पंडालों में अखण्ड रामायण पाठ होता है।',
  },
  'ram-navami:chandigarh': {
    en: 'Chandigarh celebrates Ram Navami with processions through Sector 22 and 34 markets. The Ram Darbar Temple in Sector 9 is the main worship centre for the day. Community organisations in Manimajra and Mohali organise jhankis. The Punjabi tradition of distributing jal-jeera and sharbat during processions is followed. Ramlila grounds host cultural events.',
    hi: 'चंडीगढ़ में राम नवमी सेक्टर 22 और 34 से शोभायात्राओं से मनाई जाती है। सेक्टर 9 का राम दरबार मंदिर मुख्य पूजा केन्द्र है। मणिमाजरा और मोहाली में झाँकियाँ सजाई जाती हैं। पंजाबी परंपरा में शोभायात्रा में जलजीरा और शरबत बाँटा जाता है।',
  },
  'ram-navami:new-york': {
    en: 'New York celebrates Ram Navami at the Hindu Temple Society in Flushing with special abhishek and Sita-Ram Kalyanam ceremony. The Chinmaya Mission in Queens and Arya Samaj centres in New Jersey host Havan ceremonies. Jackson Heights community organisations hold processions with Ram-Sita jhankis. Cultural programmes include Ramayan recitation in multiple languages.',
    hi: 'न्यूयॉर्क में राम नवमी फ्लशिंग के हिंदू मंदिर में विशेष अभिषेक और सीता-राम कल्याणम से मनाई जाती है। क्वीन्स का चिन्मय मिशन और न्यू जर्सी के आर्य समाज केन्द्र हवन करते हैं। जैक्सन हाइट्स में राम-सीता झाँकियों की शोभायात्रा होती है।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // RAKSHA BANDHAN
  // ═══════════════════════════════════════════════════════════════════
  'raksha-bandhan:delhi': {
    en: 'Delhi celebrates Raksha Bandhan with massive shopping in Karol Bagh, Lajpat Nagar, and Chandni Chowk for designer rakhis and sweets. The India Gate lawns see families gathering for the celebration. Auto-rickshaw and metro services run free for women on this day. The tradition of sisters visiting brothers\' homes makes the streets of Delhi particularly busy.',
    hi: 'दिल्ली में रक्षा बंधन करोलबाग, लाजपत नगर और चांदनी चौक में डिज़ाइनर राखी और मिठाई की भारी खरीदारी से मनाया जाता है। इंडिया गेट पर परिवार एकत्र होते हैं। इस दिन महिलाओं के लिए ऑटो और मेट्रो मुफ़्त चलती है। बहनों के भाइयों के घर जाने से सड़कें भीड़भाड़ रहती हैं।',
  },
  'raksha-bandhan:mumbai': {
    en: 'Mumbai celebrates Raksha Bandhan alongside Narali Pournima — Koli fisherfolk offer coconuts to the sea at Worli, Versova, and Sassoon Dock, marking the end of the monsoon fishing ban. Sisters tie rakhis while fishermen decorate their boats with flowers and flags. This unique coastal-meets-family festival combination is distinctly Mumbaikar.',
    hi: 'मुंबई में रक्षा बंधन नारली पूर्णिमा के साथ मनाया जाता है — कोली मछुआरे वर्ली, वर्सोवा और ससून डॉक पर समुद्र को नारियल अर्पित करते हैं। बहनें राखी बाँधती हैं जबकि मछुआरे नावें फूलों और झंडों से सजाते हैं। यह तटीय-पारिवारिक संयोजन मुंबई की अनूठी परंपरा है।',
  },
  'raksha-bandhan:bangalore': {
    en: 'Bangalore celebrates Raksha Bandhan primarily among the North Indian community — Commercial Street and Brigade Road see brisk rakhi sales. The South Indian equivalent, Avani Avittam (Upanayana thread-changing ceremony for Brahmins), is celebrated on the same day. ISKCON temple hosts a special programme where devotees tie rakhis to Krishna\'s idol.',
    hi: 'बेंगलुरु में रक्षा बंधन मुख्यतः उत्तर भारतीय समुदाय में मनाया जाता है — कमर्शियल स्ट्रीट पर राखी बिक्री होती है। दक्षिण भारतीय उसी दिन अवनि अवित्तम (ब्राह्मणों का जनेऊ बदलने का संस्कार) मनाते हैं। इस्कॉन मंदिर में कृष्ण को राखी बाँधी जाती है।',
  },
  'raksha-bandhan:chennai': {
    en: 'Chennai celebrates Avani Avittam (the Yajur Vedi Upakarma) on the same day as Raksha Bandhan — Brahmin men change their sacred thread at the beach or temple tanks. Marina Beach and Besant Nagar Beach see hundreds performing the ritual at dawn. The North Indian rakhi tradition is observed mainly in areas like Anna Nagar and T. Nagar.',
    hi: 'चेन्नई में रक्षा बंधन के दिन अवनि अवित्तम (यजुर्वेदी उपाकर्म) मनाया जाता है — ब्राह्मण पुरुष समुद्र तट या मंदिर तालाबों पर जनेऊ बदलते हैं। मरीना बीच पर भोर में सैकड़ों यह संस्कार करते हैं। उत्तर भारतीय राखी परंपरा मुख्यतः अन्ना नगर में मनाई जाती है।',
  },
  'raksha-bandhan:kolkata': {
    en: 'Kolkata celebrates Raksha Bandhan alongside Jhulan Purnima — the festival of Radha-Krishna\'s swing. Jhula (swings) decorated with flowers are set up at Radha Krishna temples in Baghbazar and Kumartuli. The Bengali tradition also includes Rabindranath Tagore\'s Rakhi Utsav — tying rakhis across communities for communal harmony (started during Swadeshi movement).',
    hi: 'कोलकाता में रक्षा बंधन झूलन पूर्णिमा — राधा-कृष्ण के झूले के उत्सव — के साथ मनाया जाता है। बागबाज़ार और कुमारटुली के मंदिरों में फूलों से सजे झूले लगाए जाते हैं। बंगाली परंपरा में रवीन्द्रनाथ टैगोर का राखी उत्सव — सामुदायिक सद्भाव के लिए राखी बाँधना — भी शामिल है।',
  },
  'raksha-bandhan:hyderabad': {
    en: 'Hyderabad celebrates Raksha Bandhan with shopping in Begum Bazaar and Abids for rakhis sent across the country via post. The Telugu Brahmins observe Shravana Purnima and Hayagreeva Jayanti on this day. Secunderabad and Jubilee Hills see North Indian-style celebrations. The tradition of sending rakhis to soldiers at Secunderabad Cantonment is particularly strong.',
    hi: 'हैदराबाद में रक्षा बंधन बेगम बाज़ार और अबिड्स में राखी खरीदारी से मनाया जाता है। तेलुगु ब्राह्मण इस दिन श्रावण पूर्णिमा और हयग्रीव जयंती मनाते हैं। सिकंदराबाद छावनी में सैनिकों को राखी भेजने की परंपरा विशेष रूप से मज़बूत है।',
  },
  'raksha-bandhan:pune': {
    en: 'Pune celebrates Raksha Bandhan alongside Narali Pournima — though being inland, the coconut offering tradition is adapted at river ghats along the Mutha River. Tulshibaug and Laxmi Road see brisk rakhi sales. The Marathi tradition includes exchanging shrikhand and puran poli. Vishwakarma Jayanti (for craftsmen) is also observed near this date in industrial Pimpri-Chinchwad.',
    hi: 'पुणे में रक्षा बंधन नारली पूर्णिमा के साथ मनाया जाता है — मुठा नदी के घाटों पर नारियल चढ़ाया जाता है। तुलसीबाग और लक्ष्मी रोड पर राखी बिक्री होती है। मराठी परंपरा में श्रीखंड और पुरनपोली का आदान-प्रदान होता है।',
  },
  'raksha-bandhan:ahmedabad': {
    en: 'Ahmedabad celebrates Raksha Bandhan with the Gujarati tradition of visiting the nearest river or lake to offer coconuts (Narali Purnima equivalent). The Sabarmati Riverfront sees families performing this ritual. Rani no Hajiro and Law Garden market bustle with rakhi shoppers. Gujarati tradition includes preparing dhokla, fafda, and mohanthal as festival snacks.',
    hi: 'अहमदाबाद में रक्षा बंधन गुजराती परंपरा से नारियल चढ़ाने के लिए नज़दीकी नदी या झील जाने से मनाया जाता है। साबरमती रिवरफ्रंट पर परिवार यह संस्कार करते हैं। रानी नो हजीरो और लॉ गार्डन में राखी खरीदारों की भीड़ होती है।',
  },
  'raksha-bandhan:jaipur': {
    en: 'Jaipur celebrates Raksha Bandhan with Rajput fervour — the tradition of Lumba Rakhi (tied on sister-in-law\'s bangle) is a distinctly Rajasthani custom. Johari Bazaar and Bapu Bazaar overflow with ornate rakhis featuring Kundan and Meenakari work. The Rajasthani tradition includes elaborate thali decoration and special ghevar sweets for the occasion.',
    hi: 'जयपुर में रक्षा बंधन राजपूत उत्साह से मनाया जाता है — लुम्बा राखी (भाभी की चूड़ी पर बाँधना) विशिष्ट राजस्थानी रिवाज है। जौहरी बाज़ार में कुंदन और मीनाकारी की अलंकृत राखियाँ मिलती हैं। राजस्थानी परंपरा में भव्य थाली सजावट और घेवर मिठाई होती है।',
  },
  'raksha-bandhan:lucknow': {
    en: 'Lucknow celebrates Raksha Bandhan with Awadhi elegance — Aminabad and Hazratganj are the main markets for rakhis and chikankari gifts. The tradition of sisters visiting brothers includes the famous Lucknawi protocol of paan, itr (perfume), and sweets from Ram Asrey. Post office queues are notably long as rakhis are mailed to brothers in other cities.',
    hi: 'लखनऊ में रक्षा बंधन अवधी शिष्टाचार से मनाया जाता है — अमीनाबाद और हज़रतगंज राखी और चिकनकारी उपहारों के मुख्य बाज़ार हैं। बहनों के भाइयों से मिलने की परंपरा में लखनवी पान, इत्र और राम आसरे की मिठाई शामिल है।',
  },
  'raksha-bandhan:varanasi': {
    en: 'Varanasi celebrates Raksha Bandhan with sisters tying rakhis at home followed by visiting the Ganga ghats for Shravan Purnima snan. The Dashashwamedh Ghat and Assi Ghat see special puja. Banarasi silk rakhis from Vishwanath Gali are famous across India. The Kashi tradition includes prasad from the Kashi Vishwanath Temple distributed to families.',
    hi: 'वाराणसी में रक्षा बंधन घर पर राखी बाँधने के बाद श्रावण पूर्णिमा स्नान के लिए गंगा घाटों पर जाने से मनाया जाता है। दशाश्वमेध और अस्सी घाट पर विशेष पूजा होती है। विश्वनाथ गली की बनारसी रेशम राखियाँ देशभर में प्रसिद्ध हैं।',
  },
  'raksha-bandhan:patna': {
    en: 'Patna celebrates Raksha Bandhan with grand enthusiasm — Boring Road and Kankarbagh markets are packed with rakhi shoppers. Sisters visiting brothers often cross the Ganga by ferry from trans-Ganga areas. The Mahavir Mandir distributes special prasad rakhis. Bihar tradition includes making thekua and anarsa sweets for the occasion.',
    hi: 'पटना में रक्षा बंधन बड़े उत्साह से मनाया जाता है — बोरिंग रोड और कंकड़बाग बाज़ार राखी खरीदारों से भरे रहते हैं। गंगा पार के क्षेत्रों से बहनें नाव से आती हैं। महावीर मंदिर विशेष प्रसाद राखियाँ बाँटता है। बिहार की परंपरा में ठेकुआ और अनरसा बनाया जाता है।',
  },
  'raksha-bandhan:bhopal': {
    en: 'Bhopal celebrates Raksha Bandhan with shopping in New Market and Chowk bazaar. The tradition of tying rakhis to trees (Vriksha Bandhan) by environmentalists at Van Vihar National Park is unique to Bhopal. The Birla Mandir and Gufa Mandir host special puja. Community organisations send rakhis to soldiers at the nearby Babina military cantonment.',
    hi: 'भोपाल में रक्षा बंधन न्यू मार्केट और चौक बाज़ार में खरीदारी से मनाया जाता है। वन विहार नेशनल पार्क में पर्यावरणविदों द्वारा पेड़ों को राखी बाँधना (वृक्ष बंधन) भोपाल की अनूठी परंपरा है। बिरला मंदिर और गुफा मंदिर विशेष पूजा करते हैं।',
  },
  'raksha-bandhan:chandigarh': {
    en: 'Chandigarh celebrates Raksha Bandhan with shopping at Sector 17 Plaza and Sector 22 market. The Punjabi tradition makes this a grand family affair with elaborate lunches. Elante Mall and other shopping centres host rakhi-making workshops. The city\'s Sukhna Lake promenade sees families gathering for picnics after the morning rituals.',
    hi: 'चंडीगढ़ में रक्षा बंधन सेक्टर 17 प्लाज़ा और सेक्टर 22 में खरीदारी से मनाया जाता है। पंजाबी परंपरा में यह भव्य पारिवारिक आयोजन होता है। एलांते मॉल में राखी बनाने की कार्यशालाएँ होती हैं। सुबह की रस्मों के बाद सुखना झील पर परिवार पिकनिक के लिए जुटते हैं।',
  },
  'raksha-bandhan:new-york': {
    en: 'New York celebrates Raksha Bandhan at community gatherings in Jackson Heights and temple events in Flushing. The Indian diaspora heavily relies on international courier services to send rakhis — post offices in Edison (NJ) and Queens see long queues days before. The South Asian Students Association at NYU and Columbia host Rakhi events bringing together students away from siblings.',
    hi: 'न्यूयॉर्क में रक्षा बंधन जैक्सन हाइट्स के सामुदायिक आयोजनों और फ्लशिंग मंदिर में मनाया जाता है। भारतीय प्रवासी राखी भेजने के लिए अंतर्राष्ट्रीय कूरियर पर निर्भर रहते हैं। NYU और कोलंबिया में छात्र संगठन राखी आयोजन करते हैं।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // AKSHAYA TRITIYA
  // ═══════════════════════════════════════════════════════════════════
  'akshaya-tritiya:delhi': {
    en: 'Delhi sees a massive gold-buying rush on Akshaya Tritiya — Karol Bagh\'s jewellery lane, Dariba Kalan in Chandni Chowk (India\'s oldest jewellery market), and South Extension become incredibly crowded. Tanishq, Kalyan, and local jewellers offer special collections. Real estate companies time major launches on this day. CP\'s Hanuman Mandir sees special puja.',
    hi: 'दिल्ली में अक्षय तृतीया पर सोने की भारी खरीदारी होती है — करोलबाग, दरीबा कालान (भारत का सबसे पुराना आभूषण बाज़ार) और साउथ एक्सटेंशन में अविश्वसनीय भीड़ होती है। तनिष्क, कल्याण और स्थानीय ज्वेलर्स विशेष कलेक्शन लाते हैं। रियल एस्टेट कंपनियाँ इसी दिन नई परियोजनाएँ लॉन्च करती हैं।',
  },
  'akshaya-tritiya:mumbai': {
    en: 'Mumbai\'s Zaveri Bazaar — India\'s largest bullion market — sees record gold sales on Akshaya Tritiya. Jewellers on Sheikh Memon Street stay open past midnight. The Mahalakshmi Temple and Siddhivinayak Temple conduct special Lakshmi pujas. South Mumbai\'s Marwari community considers this the most auspicious day to start new business ventures.',
    hi: 'मुंबई का ज़वेरी बाज़ार — भारत का सबसे बड़ा सर्राफ़ा बाज़ार — अक्षय तृतीया पर रिकॉर्ड सोना बिक्री देखता है। शेख मेमन स्ट्रीट के ज्वेलर्स मध्यरात्रि तक खुले रहते हैं। महालक्ष्मी और सिद्धिविनायक मंदिर विशेष लक्ष्मी पूजा करते हैं।',
  },
  'akshaya-tritiya:bangalore': {
    en: 'Bangalore sees massive footfall at jewellery stores on Avenue Road, Commercial Street, and in Jayanagar on Akshaya Tritiya. The South Indian tradition of buying gold on this day is particularly strong. Lakshmi Jewellers and GRT in South Bangalore see queues from early morning. Temples perform Mahalakshmi Homa. New vehicle purchases are also timed for this day.',
    hi: 'बेंगलुरु में अक्षय तृतीया पर एवेन्यू रोड, कमर्शियल स्ट्रीट और जयनगर की आभूषण दुकानों में भारी भीड़ होती है। इस दिन सोना खरीदने की दक्षिण भारतीय परंपरा विशेष मज़बूत है। सुबह से ही कतारें लगती हैं। मंदिरों में महालक्ष्मी होम होता है।',
  },
  'akshaya-tritiya:chennai': {
    en: 'Chennai\'s T. Nagar — particularly North Usman Road (India\'s highest gold-selling density) — witnesses extraordinary crowds on Akshaya Tritiya. GRT, NAC, Joyalukkas, and Saravana Stores gold counters have 3-4 hour wait times. The Tamil tradition considers this day sacred to both Lakshmi and Kubera. Mylapore\'s tank street jewellers also see massive demand.',
    hi: 'चेन्नई का टी.नगर — विशेषकर नॉर्थ उस्मान रोड (भारत की सबसे अधिक सोना बिक्री वाली सड़क) — अक्षय तृतीया पर असाधारण भीड़ देखता है। GRT, NAC, जॉयालुक्कस में 3-4 घंटे की प्रतीक्षा होती है। तमिल परंपरा में यह दिन लक्ष्मी और कुबेर दोनों को पवित्र है।',
  },
  'akshaya-tritiya:kolkata': {
    en: 'Kolkata\'s Bowbazar (jewellery hub) and Gariahat see heavy gold buying on Akshaya Tritiya. The Bengali tradition of starting new account books (Halkhata) coincides with this day for many merchants. Senco Gold and PC Chandra Jewellers report their highest annual sales. Kalighat Temple and Dakshineswar host Lakshmi puja ceremonies.',
    hi: 'कोलकाता का बोबाज़ार (आभूषण केन्द्र) और गड़ियाहाट अक्षय तृतीया पर भारी सोना खरीदारी देखता है। कई व्यापारियों की हालखाता (नई बहीखाता) शुरू करने की बंगाली परंपरा इसी दिन होती है। सेनको गोल्ड और पीसी चंद्रा अपनी सर्वाधिक वार्षिक बिक्री करते हैं।',
  },
  'akshaya-tritiya:hyderabad': {
    en: 'Hyderabad\'s Pot Market in Begum Bazaar and the jewellery shops at Abids report massive gold and silver sales on Akshaya Tritiya. Manepally Jewellers and TBZ host special collections. The Telugu tradition includes performing Lakshmi Kubera Puja at home. New business registrations spike on this day. Tirumala TTD also launches special gold products.',
    hi: 'हैदराबाद का बेगम बाज़ार पॉट मार्केट और अबिड्स की ज्वैलरी दुकानें अक्षय तृतीया पर भारी सोना-चाँदी बिक्री करती हैं। मानेपल्ली ज्वेलर्स विशेष कलेक्शन लाते हैं। तेलुगु परंपरा में घर पर लक्ष्मी कुबेर पूजा होती है। इस दिन नई व्यापार पंजीकरण बढ़ जाते हैं।',
  },
  'akshaya-tritiya:pune': {
    en: 'Pune\'s Laxmi Road and Tulshibaug — the traditional jewellery shopping areas — see extraordinary demand on Akshaya Tritiya. PN Gadgil and Waman Hari Pethe are the most sought-after Marathi jewellers. The tradition of buying Lakshmi-minted coins is particularly popular. Many families also purchase land or sign property documents on this auspicious day.',
    hi: 'पुणे की लक्ष्मी रोड और तुलसीबाग — पारंपरिक आभूषण बाज़ार — अक्षय तृतीया पर असाधारण माँग देखते हैं। पीएन गाडगिल और वामन हरि पेठे सबसे लोकप्रिय मराठी ज्वेलर्स हैं। लक्ष्मी अंकित सिक्के खरीदने की परंपरा विशेष लोकप्रिय है।',
  },
  'akshaya-tritiya:ahmedabad': {
    en: 'Ahmedabad\'s Manek Chowk — the city\'s traditional jewellery market — is packed on Akshaya Tritiya. The Gujarati Vaishya community considers this the single most auspicious day for gold investment. Tribhovandas Bhimji Zaveri and Hari Krishna Mandir Road jewellers see queues from dawn. Many families also initiate new Demat accounts on this day.',
    hi: 'अहमदाबाद का मानेक चौक — शहर का पारंपरिक आभूषण बाज़ार — अक्षय तृतीया पर भरा रहता है। गुजराती वैश्य समुदाय इसे सोने के निवेश का सर्वाधिक शुभ दिन मानता है। त्रिभुवनदास भीमजी ज़वेरी पर सुबह से कतारें लगती हैं। कई परिवार नए डीमैट खाते भी खोलते हैं।',
  },
  'akshaya-tritiya:jaipur': {
    en: 'Jaipur — India\'s gemstone capital — celebrates Akshaya Tritiya with massive gold and precious stone purchases. Johari Bazaar (literally "Jeweller\'s Market") sees its peak annual sales. Rajasthani tradition includes gifting gold nose pins (nath) and borla (forehead ornaments) to brides-to-be. The Gem & Jewellery Export Promotion Council organises special exhibitions.',
    hi: 'जयपुर — भारत की रत्न राजधानी — अक्षय तृतीया भव्य सोना और रत्न खरीदारी से मनाता है। जौहरी बाज़ार (शाब्दिक "ज्वेलर्स मार्केट") अपनी सर्वाधिक वार्षिक बिक्री देखता है। राजस्थानी परंपरा में नई दुल्हनों को सोने की नाथ और बोरला उपहार दिया जाता है।',
  },
  'akshaya-tritiya:lucknow': {
    en: 'Lucknow\'s Chowk area and Hazratganj jewellers report peak sales on Akshaya Tritiya. The Awadhi tradition of buying gold for newlywed brides (shagun) is timed for this day. Tribhovandas and local jewellers like Kumar Jewellers see long queues. Many families also start new savings accounts or SIPs. Hanuman Setu Temple hosts special puja.',
    hi: 'लखनऊ के चौक और हज़रतगंज ज्वेलर्स अक्षय तृतीया पर चरम बिक्री करते हैं। नवविवाहित दुल्हनों के लिए सोना (शगुन) खरीदने की अवधी परंपरा इसी दिन होती है। कुमार ज्वेलर्स में लंबी कतारें लगती हैं। कई परिवार नई बचत योजनाएँ शुरू करते हैं।',
  },
  'akshaya-tritiya:varanasi': {
    en: 'Varanasi celebrates Akshaya Tritiya with devotional significance beyond gold-buying — this is believed to be the day the Ganga descended to Earth. Devotees take holy dips at Dashashwamedh and Manikarnika Ghats. The Vishwanath Gali jewellers see strong gold sales. Dana (charity) given on this day is considered inexhaustible — hence mass food distribution at temples.',
    hi: 'वाराणसी में अक्षय तृतीया सोना खरीदने से परे भक्तिमय महत्व रखती है — माना जाता है इसी दिन गंगा पृथ्वी पर उतरीं। दशाश्वमेध और मणिकर्णिका घाट पर भक्त पवित्र स्नान करते हैं। विश्वनाथ गली के ज्वेलर्स में सोने की बिक्री होती है। इस दिन दान अक्षय माना जाता है।',
  },
  'akshaya-tritiya:patna': {
    en: 'Patna celebrates Akshaya Tritiya with gold buying in Hathwa Market and Patna City\'s jewellery lanes. The Bihar tradition includes mass feeding (anna daan) at temples and ghats — considered especially meritorious on this day. Mahavir Mandir distributes prasad to thousands. Many farming families purchase seeds and equipment to begin the kharif sowing season.',
    hi: 'पटना में अक्षय तृतीया हथवा मार्केट और पटना सिटी की ज्वैलरी गलियों में सोना खरीदारी से मनाई जाती है। बिहार की परंपरा में मंदिरों और घाटों पर अन्नदान होता है — इस दिन यह विशेष पुण्यकारी माना जाता है। महावीर मंदिर हज़ारों को प्रसाद बाँटता है।',
  },
  'akshaya-tritiya:bhopal': {
    en: 'Bhopal celebrates Akshaya Tritiya with gold purchases at Sarafa Bazaar (the city\'s traditional jewellery market which also doubles as a night food street). New Market and MP Nagar jewellery shops report peak sales. The tradition of starting new financial investments is strong among Bhopal\'s trading community. Birla Mandir hosts special Lakshmi Puja.',
    hi: 'भोपाल में अक्षय तृतीया सर्राफ़ा बाज़ार (शहर का पारंपरिक आभूषण बाज़ार जो रात में खाद्य गली भी है) में सोना खरीदारी से मनाई जाती है। न्यू मार्केट और एमपी नगर में चरम बिक्री होती है। व्यापारी समुदाय में नई वित्तीय योजनाएँ शुरू करने की परंपरा मज़बूत है।',
  },
  'akshaya-tritiya:chandigarh': {
    en: 'Chandigarh celebrates Akshaya Tritiya with gold buying in Sector 17 and Sector 22 jewellery shops. Tanishq, Malabar Gold, and local Punjabi jewellers see heavy footfall. The Punjabi tradition of gifting gold kare (bangles) to daughters is particularly associated with this day. Many families also book new properties through Chandigarh Housing Board on this date.',
    hi: 'चंडीगढ़ में अक्षय तृतीया सेक्टर 17 और 22 की ज्वैलरी दुकानों में सोना खरीदारी से मनाई जाती है। तनिष्क, मालाबार गोल्ड और स्थानीय पंजाबी ज्वेलर्स में भारी भीड़ होती है। बेटियों को सोने के कड़े उपहार देने की पंजाबी परंपरा इसी दिन से जुड़ी है।',
  },
  'akshaya-tritiya:new-york': {
    en: 'New York\'s Indian community celebrates Akshaya Tritiya with gold purchases at Jackson Heights jewellery stores on 74th Street — Rajdhani and Kiran Jewellers see peak demand. Online gold buying from Indian platforms like Tanishq and BlueStone spikes among the diaspora. Community temples in Flushing and New Jersey host Lakshmi-Kubera puja on this day.',
    hi: 'न्यूयॉर्क का भारतीय समुदाय अक्षय तृतीया जैक्सन हाइट्स की 74वीं स्ट्रीट की ज्वेलरी दुकानों — राजधानी और किरण ज्वेलर्स — में सोना खरीदकर मनाता है। प्रवासियों में तनिष्क और ब्लूस्टोन से ऑनलाइन सोना खरीदारी बढ़ती है। फ्लशिंग मंदिर में लक्ष्मी-कुबेर पूजा होती है।',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHHATH PUJA
  // ═══════════════════════════════════════════════════════════════════
  'chhath-puja:delhi': {
    en: 'Delhi celebrates Chhath Puja with massive gatherings at the Yamuna ghats — ITO, Kalindi Kunj, and Chhath Ghat near ISBT are the main locations. Over 1,000 temporary ghats are set up by the Delhi government. The Bihari and Purvanchali community (estimated 30% of Delhi\'s population) makes this one of Delhi\'s largest festivals by participation.',
    hi: 'दिल्ली में छठ पूजा यमुना घाटों पर विशाल जमावड़े से मनाई जाती है — ITO, कालिंदी कुंज और ISBT के पास छठ घाट मुख्य स्थल हैं। दिल्ली सरकार 1,000 से अधिक अस्थायी घाट बनाती है। बिहारी और पूर्वांचली समुदाय (दिल्ली की 30% आबादी) इसे सबसे बड़े त्योहारों में बनाता है।',
  },
  'chhath-puja:mumbai': {
    en: 'Mumbai celebrates Chhath Puja at Juhu Beach, Girgaum Chowpatty, and hundreds of coastal spots. The Bihari community in Mulund, Dombivli, and Thane sets up elaborate ghats. Juhu Beach sees over a lakh devotees at the Sandhya Arghya (evening offering). The sea serves as a substitute for the traditional river, making Mumbai\'s Chhath uniquely coastal.',
    hi: 'मुंबई में छठ पूजा जुहू बीच, गिरगाँव चौपाटी और सैकड़ों तटीय स्थलों पर मनाई जाती है। मुलुंड, डोम्बिवली और ठाणे में बिहारी समुदाय भव्य घाट बनाता है। जुहू बीच पर संध्या अर्घ्य में एक लाख से अधिक भक्त आते हैं। समुद्र नदी का विकल्प बनता है।',
  },
  'chhath-puja:bangalore': {
    en: 'Bangalore\'s Chhath Puja celebrations are concentrated around Ulsoor Lake, Sankey Tank, and Madiwala Lake where the Bihari community sets up ghats. The celebrations are more intimate compared to Bihar, but the ritual strictness (36-hour fast, standing in water) is maintained exactly. RT Nagar and Marathahalli have large Purvanchali populations that organise community Chhath.',
    hi: 'बेंगलुरु में छठ पूजा उलसूर झील, सैंकी टैंक और मडीवाला झील के आसपास बिहारी समुदाय के घाटों पर मनाई जाती है। बिहार की तुलना में उत्सव छोटा है, लेकिन 36 घंटे का व्रत और पानी में खड़े होने की कठोरता पूरी तरह पालन होती है।',
  },
  'chhath-puja:chennai': {
    en: 'Chennai has a small but devoted Chhath Puja celebration by the Bihari community, primarily at Marina Beach and Thiruvanmiyur Beach. The celebration is modest but authentic — the 36-hour nirjala vrat, preparing thekua and rasiao, and offering arghya to the setting and rising sun are performed with full devotion despite being far from home.',
    hi: 'चेन्नई में छठ पूजा बिहारी समुदाय द्वारा मुख्यतः मरीना बीच और तिरुवन्मियुर बीच पर मनाई जाती है। उत्सव छोटा लेकिन प्रामाणिक है — 36 घंटे का निर्जल व्रत, ठेकुआ-रसियाव बनाना और डूबते व उगते सूर्य को अर्घ्य पूरी श्रद्धा से दिया जाता है।',
  },
  'chhath-puja:kolkata': {
    en: 'Kolkata celebrates Chhath Puja with significant participation — the large Bihari diaspora performs rituals at Babughat, Princep Ghat, and Subhas Sarovar (Deshapriya Park). The Hooghly River serves as the sacred water body. Chhath songs echo through Narkeldanga and Park Circus areas where Bihari communities are concentrated.',
    hi: 'कोलकाता में छठ पूजा बड़े पैमाने पर मनाई जाती है — बिहारी प्रवासी बाबूघाट, प्रिंसेप घाट और सुभाष सरोवर पर अनुष्ठान करते हैं। हुगली नदी पवित्र जलाशय का काम करती है। नारकेलडांगा और पार्क सर्कस में बिहारी समुदाय के क्षेत्रों में छठ गीत गूँजते हैं।',
  },
  'chhath-puja:hyderabad': {
    en: 'Hyderabad\'s Chhath Puja is observed at Hussain Sagar Lake and the various lakes in Kukatpally and Secunderabad by the Bihari community. The celebration has grown in recent years as the IT sector brought many Bihar/Jharkhand professionals. HITEC City area residents organise community Chhath at nearby ponds. Traditional thekua is prepared at home.',
    hi: 'हैदराबाद में छठ पूजा बिहारी समुदाय द्वारा हुसैन सागर झील और कुकटपल्ली की झीलों पर मनाई जाती है। IT क्षेत्र में बिहार/झारखंड के पेशेवरों के आने से उत्सव बढ़ा है। HITEC सिटी क्षेत्र के निवासी पास के तालाबों पर सामुदायिक छठ करते हैं।',
  },
  'chhath-puja:pune': {
    en: 'Pune\'s Chhath Puja is celebrated at the Mutha River ghats and Pashan Lake by the growing Bihari community in the IT/manufacturing sectors. Hinjewadi and Kharadi IT parks see groups organising community Chhath. The tradition of preparing special prasad (thekua, kheer) and observing the 36-hour fast is maintained rigorously even away from home.',
    hi: 'पुणे में छठ पूजा मुठा नदी घाटों और पाषाण झील पर IT/विनिर्माण क्षेत्र के बढ़ते बिहारी समुदाय द्वारा मनाई जाती है। हिंजेवाड़ी और खराड़ी IT पार्कों में सामुदायिक छठ होती है। ठेकुआ-खीर प्रसाद और 36 घंटे का व्रत घर से दूर भी कठोरता से पालन होता है।',
  },
  'chhath-puja:ahmedabad': {
    en: 'Ahmedabad celebrates Chhath Puja at the Sabarmati Riverfront and Kankaria Lake, where the Bihari community sets up temporary ghats. The celebration is relatively small but heartfelt — migrant workers from Bihar in the textile and construction sectors gather to perform the sacred ritual. Community groups organise transport to the river ghats.',
    hi: 'अहमदाबाद में छठ पूजा साबरमती रिवरफ्रंट और कांकरिया झील पर बिहारी समुदाय के अस्थायी घाटों पर मनाई जाती है। उत्सव अपेक्षाकृत छोटा लेकिन भावपूर्ण है — कपड़ा और निर्माण क्षेत्र के बिहारी प्रवासी श्रमिक पवित्र अनुष्ठान करने एकत्र होते हैं।',
  },
  'chhath-puja:jaipur': {
    en: 'Jaipur\'s Chhath Puja celebrations take place at Man Sagar Lake (near Jal Mahal) and the Dravyavati River banks where the Bihari community gathers. The celebration is growing with the increasing Purvanchali population in the city. Mansarovar and Vaishali Nagar areas have notable community celebrations with proper ghats set up by local organisations.',
    hi: 'जयपुर में छठ पूजा मानसागर झील (जल महल के पास) और द्रव्यवती नदी तट पर बिहारी समुदाय द्वारा मनाई जाती है। शहर में बढ़ती पूर्वांचली आबादी से उत्सव बड़ा हो रहा है। मानसरोवर और वैशाली नगर में स्थानीय संगठन उचित घाट बनाकर सामुदायिक छठ करते हैं।',
  },
  'chhath-puja:lucknow': {
    en: 'Lucknow celebrates Chhath Puja at Gomti River ghats — particularly Daliganj, Kudia Ghat, and Gaughat. The Purvanchali community in Lucknow is substantial, making Chhath one of the city\'s larger celebrations. The UP government provides special facilities at designated ghats. Alambagh and Rajajipuram areas organise community celebrations with traditional songs.',
    hi: 'लखनऊ में छठ पूजा गोमती नदी के घाटों — विशेषकर दालीगंज, कुड़िया घाट और गौघाट — पर मनाई जाती है। लखनऊ में पूर्वांचली समुदाय बड़ा है, जो छठ को शहर के बड़े उत्सवों में बनाता है। UP सरकार निर्धारित घाटों पर विशेष सुविधाएँ देती है।',
  },
  'chhath-puja:varanasi': {
    en: 'Varanasi is one of the most sacred locations for Chhath Puja after Bihar itself — the Ganga ghats transform with thousands of devotees standing waist-deep in the river at dawn. Assi Ghat, Kedar Ghat, and Chet Singh Ghat are the primary sites. The city being at the border of UP and Bihar means the tradition is deeply ingrained. Chhath songs resonate across all 84 ghats.',
    hi: 'वाराणसी बिहार के बाद छठ पूजा के सबसे पवित्र स्थलों में है — गंगा घाटों पर हज़ारों भक्त भोर में कमर तक पानी में खड़े होते हैं। अस्सी घाट, केदार घाट और चेत सिंह घाट प्रमुख स्थल हैं। UP-बिहार सीमा पर होने से यह परंपरा गहरी है। 84 घाटों पर छठ गीत गूँजते हैं।',
  },
  'chhath-puja:patna': {
    en: 'Patna is the epicentre of Chhath Puja — the city virtually shuts down for 4 days. Gandhi Ghat, Collectorate Ghat, and Digha Ghat on the Ganga see millions of devotees. The entire riverbank from Patna to Danapur is one continuous celebration. Chhath is Bihar\'s greatest festival, bigger than Diwali here, with every household observing the rigorous 36-hour nirjala vrat.',
    hi: 'पटना छठ पूजा का केन्द्र है — शहर 4 दिन के लिए वस्तुतः ठहर जाता है। गाँधी घाट, कलेक्ट्रिएट घाट और दीघा घाट पर लाखों भक्त आते हैं। पटना से दानापुर तक पूरा गंगा तट एक निरंतर उत्सव है। छठ बिहार का सबसे बड़ा त्योहार है — दीवाली से भी बड़ा — हर घर 36 घंटे का निर्जल व्रत रखता है।',
  },
  'chhath-puja:bhopal': {
    en: 'Bhopal celebrates Chhath Puja at the Upper Lake (Bada Talab) and Halali Dam where the Bihari community gathers. The MP capital has a growing Purvanchali population that organises community celebrations in Kolar, Ayodhya Nagar, and Misrod areas. Despite being far from Bihar, the tradition of thekua preparation and 36-hour fasting is followed with full rigour.',
    hi: 'भोपाल में छठ पूजा बड़ा तालाब (अपर लेक) और हलाली डैम पर बिहारी समुदाय द्वारा मनाई जाती है। राजधानी में बढ़ती पूर्वांचली आबादी कोलार, अयोध्या नगर और मिसरोद में सामुदायिक उत्सव करती है। बिहार से दूर होने पर भी ठेकुआ और 36 घंटे के व्रत की पूरी कठोरता पालन होती है।',
  },
  'chhath-puja:chandigarh': {
    en: 'Chandigarh celebrates Chhath Puja at Sukhna Lake where the administration sets up official ghats for the Bihari and UP community. Sector 42 and Sector 56 host community celebrations. The Purvanchali population from IT and government sectors participates enthusiastically. Special buses run to Sukhna Lake during Sandhya and Usha Arghya timings.',
    hi: 'चंडीगढ़ में छठ पूजा सुखना झील पर मनाई जाती है जहाँ प्रशासन बिहारी और UP समुदाय के लिए आधिकारिक घाट बनाता है। सेक्टर 42 और 56 में सामुदायिक उत्सव होते हैं। IT और सरकारी क्षेत्रों की पूर्वांचली आबादी उत्साह से भाग लेती है।',
  },
  'chhath-puja:new-york': {
    en: 'New York\'s Bihari community celebrates Chhath Puja at select locations along the Hudson River and at Jamaica Bay in Queens. The ritual of offering arghya to the setting sun by standing in cold November waters shows remarkable devotion. Community groups in Edison (NJ) organise at local ponds. Despite the cold, the 36-hour fast and all traditional steps are maintained.',
    hi: 'न्यूयॉर्क का बिहारी समुदाय छठ पूजा हडसन नदी और क्वीन्स की जमैका बे पर मनाता है। ठंडे नवंबर के पानी में खड़े होकर डूबते सूर्य को अर्घ्य देना असाधारण भक्ति दर्शाता है। एडिसन (NJ) में सामुदायिक समूह स्थानीय तालाबों पर आयोजन करते हैं। ठंड के बावजूद सभी परंपराएँ पालन होती हैं।',
  },
};

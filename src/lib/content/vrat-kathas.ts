/**
 * Vrat Katha (Fasting Stories) content.
 *
 * Each katha contains the story itself, benefits (phal), and method (vidhi)
 * in English and Hindi.
 */

export interface VratKatha {
  slug: string;
  title: { en: string; hi: string };
  deity: { en: string; hi: string };
  linkedFestivalSlugs: string[];  // slugs of related festival/puja pages
  story: { en: string; hi: string };
  phal: { en: string; hi: string };
  vidhi: { en: string; hi: string };
}

export const VRAT_KATHAS: VratKatha[] = [
  // ─── 1. Ekadashi Vrat Katha ─────────────────────────────────
  {
    slug: 'ekadashi',
    title: { en: 'Ekadashi Vrat Katha', hi: 'एकादशी व्रत कथा' },
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु' },
    linkedFestivalSlugs: ['ekadashi'],
    story: {
      en: `In the Satya Yuga, there lived a fearsome demon named Mura who had conquered the three worlds and driven the Devas from heaven. The Devas approached Lord Vishnu for help. A great battle ensued that lasted one thousand celestial years. During this battle, Lord Vishnu retreated to a cave called Hemavati to rest. The demon Mura followed him, intending to slay the sleeping Lord.

As Mura raised his weapon, a radiant female form emerged from Lord Vishnu's body. She was Ekadashi — a divine shakti born from the Lord's own spiritual energy. With a single fierce glance, she reduced Mura to ashes. When Lord Vishnu awoke, he was pleased and granted Ekadashi a boon. She asked that anyone who observes a fast on this day should be freed from sins and attain liberation.

King Ambarish was the most devoted observer of Ekadashi. He ruled Ayodhya with righteousness and never missed a single Ekadashi fast. Once, the sage Durvasa visited him on the day of Parana (breaking the fast). The sage went to bathe in the river, but did not return before the auspicious window for breaking the fast was closing. King Ambarish, following dharma, sipped a drop of water to technically break the fast without eating a full meal — honoring both the Ekadashi vrat and his duty to wait for his guest.

Durvasa was enraged and sent a fiery demon (Kritya) to destroy the king. But Lord Vishnu dispatched the Sudarshana Chakra to protect his devotee. The Chakra pursued Durvasa across the three worlds until the sage surrendered and begged forgiveness from Ambarish himself. The king, ever gracious, prayed to the Sudarshana Chakra to spare Durvasa. This episode, narrated in the Bhagavata Purana, established that Ekadashi devotees receive the direct protection of Lord Vishnu.`,
      hi: `सत्ययुग में मुर नामक एक भयंकर दैत्य था जिसने तीनों लोकों को जीत लिया और देवताओं को स्वर्ग से निकाल दिया। देवताओं ने भगवान विष्णु से सहायता मांगी। एक भीषण युद्ध हुआ जो एक सहस्र दिव्य वर्षों तक चला। इस युद्ध के दौरान भगवान विष्णु हेमावती नामक गुफा में विश्राम करने गए। मुर दैत्य ने उनका पीछा किया, सोते हुए भगवान को मारने के उद्देश्य से।

जब मुर ने अपना शस्त्र उठाया, तो भगवान विष्णु के शरीर से एक दिव्य स्त्री रूप प्रकट हुआ। वे एकादशी थीं — भगवान की अपनी आध्यात्मिक शक्ति से जन्मी दिव्य शक्ति। एक तीव्र दृष्टि मात्र से उन्होंने मुर को भस्म कर दिया। जब भगवान विष्णु जागे, तो प्रसन्न होकर उन्होंने एकादशी को वरदान दिया। उन्होंने मांगा कि जो कोई इस दिन व्रत रखे, वह पापों से मुक्त हो और मोक्ष प्राप्त करे।

राजा अम्बरीष एकादशी के सबसे समर्पित व्रती थे। उन्होंने अयोध्या पर धर्मपूर्वक शासन किया और कभी एक भी एकादशी व्रत नहीं छोड़ा। एक बार पारण के दिन ऋषि दुर्वासा उनके पास आए। ऋषि नदी में स्नान करने गए, परन्तु व्रत तोड़ने की शुभ अवधि समाप्त होने से पहले नहीं लौटे। राजा अम्बरीष ने धर्म का पालन करते हुए जल का एक घूंट पिया — एकादशी व्रत और अतिथि की प्रतीक्षा दोनों का सम्मान किया।

दुर्वासा क्रोधित हुए और राजा को नष्ट करने के लिए एक अग्निमय दानव (कृत्या) भेजा। किन्तु भगवान विष्णु ने अपने भक्त की रक्षा के लिए सुदर्शन चक्र भेजा। चक्र ने दुर्वासा का तीनों लोकों में पीछा किया जब तक ऋषि ने आत्मसमर्पण नहीं किया और स्वयं अम्बरीष से क्षमा मांगी। राजा ने कृपापूर्वक सुदर्शन चक्र से दुर्वासा को छोड़ने की प्रार्थना की।`,
    },
    phal: {
      en: 'Observing Ekadashi with devotion destroys all sins, including Brahmahatya (killing of a Brahmin). The devotee attains Vaikuntha (the abode of Vishnu) after death. Regular Ekadashi fasting brings health, mental clarity, spiritual progress, and protection from negative forces. It is said that the merit of observing all 24 Ekadashis in a year equals the merit of performing an Ashwamedha Yajna.',
      hi: 'श्रद्धापूर्वक एकादशी व्रत करने से ब्रह्महत्या सहित सभी पाप नष्ट होते हैं। भक्त मृत्यु के बाद वैकुण्ठ प्राप्त करता है। नियमित एकादशी व्रत स्वास्थ्य, मानसिक स्पष्टता, आध्यात्मिक उन्नति और नकारात्मक शक्तियों से सुरक्षा प्रदान करता है। कहा जाता है कि वर्ष में सभी 24 एकादशियों का पालन करने का पुण्य अश्वमेध यज्ञ के बराबर है।',
    },
    vidhi: {
      en: 'Begin the fast on Dashami night — eat a simple sattvic meal before sunset. On Ekadashi, wake before sunrise, bathe, and worship Lord Vishnu with tulsi leaves, flowers, and incense. Chant the Vishnu Sahasranama or "Om Namo Bhagavate Vasudevaya." Avoid all grains, beans, rice, wheat, and lentils. Permitted: fruits, nuts, milk, root vegetables, sabudana, and rock salt. Maintain silence and devotion throughout the day. Perform night vigil (jagran) if possible. Break the fast (Parana) the next day after sunrise within the prescribed Dwadashi window.',
      hi: 'दशमी की रात से व्रत आरम्भ करें — सूर्यास्त से पहले सात्विक भोजन करें। एकादशी के दिन सूर्योदय से पहले उठें, स्नान करें, तुलसी पत्र, पुष्प और धूप से भगवान विष्णु की पूजा करें। विष्णु सहस्रनाम या "ॐ नमो भगवते वासुदेवाय" का जाप करें। सभी अनाज, दाल, चावल, गेहूं से परहेज करें। फल, मेवे, दूध, कंदमूल, साबूदाना और सेंधा नमक खा सकते हैं। दिन भर मौन और भक्ति बनाए रखें। अगले दिन सूर्योदय के बाद निर्धारित द्वादशी काल में पारण करें।',
    },
  },

  // ─── 2. Satyanarayan Vrat Katha ──────────────────────────────
  {
    slug: 'satyanarayan',
    title: { en: 'Satyanarayan Vrat Katha', hi: 'सत्यनारायण व्रत कथा' },
    deity: { en: 'Lord Satyanarayan (Vishnu)', hi: 'भगवान सत्यनारायण (विष्णु)' },
    linkedFestivalSlugs: ['satyanarayan'],
    story: {
      en: `The Satyanarayan Katha is narrated by Lord Vishnu to Narada Muni in the Skanda Purana, divided into five chapters.

Chapter 1 — The Promise: Narada, wandering the earth, witnessed immense human suffering. He asked Lord Vishnu for a remedy accessible to all — rich and poor alike. Vishnu revealed the Satyanarayan Vrat: a simple puja with a heartfelt offering, requiring no elaborate rituals or expensive materials.

Chapter 2 — The Woodcutter: A poor woodcutter in Kashi could barely feed his family. A wandering Brahmin told him about Satyanarayan Puja. The woodcutter performed it with whatever little he had — a handful of flour, a few bananas, and sugar. From that day, his fortunes transformed. He found precious sandalwood in the forest, merchants sought him out, and he became prosperous. He continued the puja every month with gratitude.

Chapter 3 — The Merchant Sadhu: A wealthy merchant named Sadhu promised to perform Satyanarayan Puja after the birth of a child. A son was born, but Sadhu delayed the puja. Then he promised it after his daughter Kalavati's marriage. The marriage happened, but still he neglected the vow. During a business journey, both Sadhu and his son-in-law Kalavati's husband were falsely accused of theft by a king, imprisoned, and lost all their wealth. Only when Kalavati performed Satyanarayan Puja with sincere devotion were her father and husband freed and their wealth restored.

Chapter 4 — The King Ulkamukha: King Ulkamukha regularly performed Satyanarayan Puja. One day, a group of merchants arrived at his kingdom. The king asked what their ships carried. The merchants, wishing to hide their precious cargo, lied: "Only dried leaves and sticks." Lord Satyanarayan made their lie come true — when they opened the ships, they found only dried leaves. Terrified, they prayed and spoke the truth. The goods were restored, teaching that one must never lie, especially in the presence of the divine.

Chapter 5 — Kalavati's Lesson: After Sadhu's return, Kalavati was performing the closing puja when she heard her father's ship had arrived. In her excitement, she rushed out without taking the prasad. As punishment for this disrespect, her husband's ship sank before her eyes. Kalavati realized her mistake, returned, completed the puja properly, consumed the prasad, and the ship reappeared safely. This teaches that one must always complete worship with full attention and never disrespect prasad.`,
      hi: `सत्यनारायण कथा स्कन्द पुराण में भगवान विष्णु द्वारा नारद मुनि को सुनाई गई, पांच अध्यायों में विभक्त।

अध्याय 1 — प्रतिज्ञा: नारद पृथ्वी पर भ्रमण करते हुए अपार मानवीय दुःख देखा। उन्होंने भगवान विष्णु से सभी के लिए सुलभ उपाय पूछा। विष्णु ने सत्यनारायण व्रत प्रकट किया: हृदयपूर्वक अर्पण सहित सरल पूजा, न विस्तृत अनुष्ठान न महंगी सामग्री की आवश्यकता।

अध्याय 2 — लकड़हारा: काशी में एक निर्धन लकड़हारा मुश्किल से अपने परिवार का पालन करता था। एक भ्रमणशील ब्राह्मण ने उसे सत्यनारायण पूजा के बारे में बताया। लकड़हारे ने जो कुछ था उसी से पूजा की — मुट्ठी भर आटा, कुछ केले और चीनी। उस दिन से उसका भाग्य बदल गया। उसे वन में बहुमूल्य चन्दन मिला, व्यापारी उसे ढूंढने लगे, और वह समृद्ध हो गया।

अध्याय 3 — व्यापारी साधु: साधु नामक एक धनी व्यापारी ने सन्तान होने पर सत्यनारायण पूजा करने का वचन दिया। पुत्र हुआ, परन्तु साधु ने पूजा टाल दी। फिर पुत्री कलावती के विवाह पर करने का वचन दिया। विवाह हुआ, फिर भी उसने व्रत की उपेक्षा की। एक व्यापारिक यात्रा में साधु और उसके दामाद दोनों पर चोरी का झूठा आरोप लगा, कारावास हुआ, और सब धन नष्ट हो गया। जब कलावती ने श्रद्धापूर्वक सत्यनारायण पूजा की, तभी उसके पिता और पति मुक्त हुए।

अध्याय 4 — राजा उल्कामुख: राजा उल्कामुख नियमित रूप से सत्यनारायण पूजा करते थे। एक दिन व्यापारियों के जहाज आए। राजा ने पूछा जहाजों में क्या है। व्यापारियों ने बहुमूल्य माल छुपाने के लिए झूठ बोला: "केवल सूखे पत्ते और लकड़ियां।" भगवान सत्यनारायण ने उनका झूठ सच कर दिया — जहाज खोले तो केवल सूखे पत्ते मिले।

अध्याय 5 — कलावती की शिक्षा: साधु की वापसी पर कलावती समापन पूजा कर रही थी। उसने सुना कि पिता का जहाज आ गया। उत्साह में वह प्रसाद लिए बिना बाहर भागी। इस अनादर के दण्ड स्वरूप उसके पति का जहाज उसकी आंखों के सामने डूब गया। कलावती ने अपनी भूल समझी, लौटकर पूजा पूर्ण की, प्रसाद ग्रहण किया, और जहाज सुरक्षित प्रकट हो गया।`,
    },
    phal: {
      en: 'Performing Satyanarayan Puja brings prosperity, removes obstacles, fulfills wishes, and grants peace of mind. It is especially recommended on Purnima, after buying a new home, starting a business, childbirth, marriage, or achieving any significant milestone. The collective merit of the puja extends to all family members and participants.',
      hi: 'सत्यनारायण पूजा करने से समृद्धि आती है, बाधाएं दूर होती हैं, मनोकामनाएं पूर्ण होती हैं, और मानसिक शांति मिलती है। यह विशेष रूप से पूर्णिमा, नया घर खरीदने, व्यापार आरम्भ, सन्तान जन्म, विवाह या किसी महत्वपूर्ण उपलब्धि पर करने की सिफारिश की जाती है।',
    },
    vidhi: {
      en: 'Clean the puja area and place a kalash filled with water, topped with mango leaves and a coconut. Prepare prasad: mix wheat flour, sugar, ghee, and banana to make sheera/lapsi. Place Lord Satyanarayan\'s image, light a ghee diya and incense. Recite all five chapters of the katha with family gathered. After each chapter, offer panchamrit and flowers. Distribute prasad to all present — never discard or disrespect the prasad. The puja can be performed by anyone regardless of caste, gender, or wealth.',
      hi: 'पूजा स्थान साफ करें और जल से भरा कलश रखें, ऊपर आम के पत्ते और नारियल। प्रसाद तैयार करें: गेहूं का आटा, चीनी, घी और केला मिलाकर शीरा/लपसी बनाएं। भगवान सत्यनारायण की मूर्ति/चित्र स्थापित करें, घी का दीया और धूप जलाएं। परिवार सहित सभी पांच अध्यायों का पाठ करें। प्रत्येक अध्याय के बाद पंचामृत और पुष्प अर्पित करें। उपस्थित सभी को प्रसाद वितरित करें — कभी प्रसाद का अनादर न करें।',
    },
  },

  // ─── 3. Karva Chauth Katha ───────────────────────────────────
  {
    slug: 'karva-chauth',
    title: { en: 'Karva Chauth Katha', hi: 'करवा चौथ कथा' },
    deity: { en: 'Lord Shiva & Parvati', hi: 'भगवान शिव एवं पार्वती' },
    linkedFestivalSlugs: [],
    story: {
      en: `In ancient times, there lived a beautiful queen named Veeravati who was the youngest of seven siblings — six brothers and herself. During her first Karva Chauth fast after marriage, she grew terribly weak as the day wore on. Her six loving brothers could not bear to see her suffering.

As moonrise was delayed, the brothers devised a plan. They climbed to the top of a hill and held up a mirror behind a pipal tree, creating the illusion of moonrise. They called out to Veeravati: "Sister, the moon has risen! You may break your fast!" Veeravati believed them and broke her fast.

The moment the food touched her lips, terrible news arrived: her husband, the king, had collapsed dead. Veeravati was devastated. An old woman told her that her husband had died because she broke the fast before the actual moonrise, deceived by her brothers' false moon. The old woman advised her to observe Karva Chauth with complete faith for an entire year.

Veeravati observed the strictest fast on every Karva Chauth, praying day and night for her husband's life. After a year of unwavering devotion, Lord Shiva and Parvati were moved by her dedication. Parvati herself came to Veeravati and restored her husband to life, granting the couple a long and happy life together.

From that day, married women observe Karva Chauth for their husband's long life and well-being, fasting from sunrise to moonrise without even a drop of water. The fast is broken only after sighting the moon through a sieve and then looking at the husband's face.`,
      hi: `प्राचीन काल में वीरावती नामक एक सुन्दर रानी थी जो सात भाई-बहनों में सबसे छोटी थी — छह भाई और वह। विवाह के बाद अपने पहले करवा चौथ व्रत में, दिन बीतने पर वह बहुत कमजोर हो गई। उसके छह प्रेमी भाई उसे कष्ट में देख न सके।

चन्द्रोदय में विलम्ब होने पर भाइयों ने एक योजना बनाई। वे पहाड़ी की चोटी पर गए और पीपल के पेड़ के पीछे दर्पण पकड़ लिया, चन्द्रोदय का भ्रम उत्पन्न किया। उन्होंने वीरावती को पुकारा: "बहन, चांद निकल आया है! तुम व्रत तोड़ सकती हो!" वीरावती ने विश्वास किया और व्रत तोड़ दिया।

जैसे ही भोजन ने उसके होंठ छुए, भयानक समाचार आया: उसका पति, राजा, गिरकर मर गया। वीरावती विदीर्ण हो गई। एक वृद्ध स्त्री ने बताया कि उसका पति इसलिए मरा क्योंकि उसने वास्तविक चन्द्रोदय से पहले व्रत तोड़ा, भाइयों के झूठे चांद से छली गई। वृद्ध स्त्री ने सलाह दी कि वह पूरे वर्ष पूर्ण श्रद्धा से करवा चौथ करे।

वीरावती ने प्रत्येक करवा चौथ पर कठोरतम व्रत रखा, दिन-रात पति के जीवन हेतु प्रार्थना की। एक वर्ष की अटल भक्ति से भगवान शिव और पार्वती प्रभावित हुए। पार्वती स्वयं वीरावती के पास आईं और उसके पति को जीवन प्रदान किया, दम्पती को दीर्घ सुखी जीवन का आशीर्वाद दिया।`,
    },
    phal: {
      en: 'Observing Karva Chauth with sincere devotion ensures the husband\'s long life, good health, and prosperity. It strengthens the marital bond and is believed to accumulate merit equivalent to performing many pujas. The couple receives the blessings of Shiva and Parvati for a harmonious life together.',
      hi: 'श्रद्धापूर्वक करवा चौथ व्रत करने से पति की दीर्घायु, स्वास्थ्य और समृद्धि सुनिश्चित होती है। यह वैवाहिक बन्धन को सुदृढ़ करता है। दम्पती को शिव और पार्वती का आशीर्वाद मिलता है।',
    },
    vidhi: {
      en: 'Wake before sunrise, eat sargi (pre-dawn meal prepared by mother-in-law). Fast without food or water from sunrise to moonrise. Apply mehndi and wear bridal attire. In the evening, gather with other women to listen to the Karva Chauth Katha. Prepare a puja thali with a karva (earthen pot), diya, sweets, and offerings. When the moon rises, view it through a sieve, then look at the husband\'s face through the sieve. The husband offers water and the first bite of food to break the fast.',
      hi: 'सूर्योदय से पहले उठें, सरगी (सास द्वारा तैयार भोर का भोजन) खाएं। सूर्योदय से चन्द्रोदय तक बिना अन्न-जल के व्रत रखें। मेहंदी लगाएं और दुल्हन जैसा श्रृंगार करें। सन्ध्या में अन्य महिलाओं के साथ करवा चौथ कथा सुनें। करवा (मिट्टी का बर्तन), दीया, मिठाई सहित पूजा थाली तैयार करें। चन्द्रोदय पर छलनी से चांद देखें, फिर छलनी से पति का चेहरा देखें। पति जल और पहला ग्रास देकर व्रत तोड़वाएं।',
    },
  },

  // ─── 4. Somvar Vrat Katha ────────────────────────────────────
  {
    slug: 'somvar-vrat',
    title: { en: 'Somvar Vrat Katha', hi: 'सोमवार व्रत कथा' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    linkedFestivalSlugs: ['somvar-vrat'],
    story: {
      en: `In a city, there lived a wealthy merchant and his wife who were devoted to Lord Shiva. They observed the Monday fast regularly but had no children. Every Monday, they visited the Shiva temple, offered bilva leaves, performed abhishek with milk and water, and prayed for a child.

Pleased by their years of devotion, Lord Shiva appeared and granted them a boon: they would be blessed with a son, but the child would live only until the age of twelve. The couple was both joyful and heartbroken — they accepted the blessing, trusting in Shiva's grace.

A handsome son was born. When the boy turned eleven, his parents sent him to Kashi (Varanasi) for his sacred thread ceremony (Upanayana), accompanied by his maternal uncle. On the way, they stopped at a city where a grand wedding was being arranged. The groom's party had arrived, but the groom himself was blind in one eye. The bride's father, seeing the merchant's handsome son, secretly asked the uncle to substitute the boy as the groom.

The uncle refused, but the wedding party offered enormous wealth. They agreed. The boy was married to the girl. When the truth was discovered, the bride's father was furious, but Lord Shiva, honoring the boy's parents' devotion, extended the boy's life. On his twelfth birthday, when death was supposed to claim him, Shiva and Parvati appeared and granted him a full lifespan.

The young man, his wife, and both families became lifelong devotees of Shiva, observing Somvar Vrat every Monday for the rest of their lives. Their story spread, and Monday fasting for Shiva became one of the most popular vrats across India.`,
      hi: `एक नगर में एक धनी व्यापारी और उसकी पत्नी रहते थे जो भगवान शिव के भक्त थे। वे नियमित रूप से सोमवार का व्रत करते थे परन्तु उनकी कोई सन्तान नहीं थी। प्रत्येक सोमवार शिव मन्दिर जाते, बिल्वपत्र चढ़ाते, दूध-जल से अभिषेक करते, और सन्तान की प्रार्थना करते।

वर्षों की भक्ति से प्रसन्न होकर भगवान शिव प्रकट हुए और वरदान दिया: पुत्र होगा, किन्तु बालक केवल बारह वर्ष तक जीवित रहेगा। दम्पती हर्षित और दुःखी दोनों हुए — उन्होंने शिव की कृपा पर विश्वास करते हुए वरदान स्वीकार किया।

एक सुन्दर पुत्र का जन्म हुआ। ग्यारह वर्ष की अवस्था में माता-पिता ने उसे यज्ञोपवीत संस्कार हेतु मामा के साथ काशी भेजा। मार्ग में एक नगर में भव्य विवाह की तैयारी हो रही थी। वर पक्ष आया था, परन्तु वर की एक आंख में दोष था। वधू के पिता ने व्यापारी के सुन्दर पुत्र को देखकर मामा से बालक को वर के रूप में प्रस्तुत करने की गुप्त प्रार्थना की।

मामा ने मना किया, परन्तु विवाह पक्ष ने अपार धन दिया। बालक का विवाह हो गया। जब सत्य प्रकट हुआ तो वधू के पिता क्रोधित हुए, किन्तु भगवान शिव ने बालक के माता-पिता की भक्ति का सम्मान करते हुए बालक का जीवन बढ़ा दिया। बारहवें जन्मदिन पर, जब मृत्यु उसे लेने आई, शिव और पार्वती प्रकट हुए और उसे पूर्ण आयु प्रदान की।`,
    },
    phal: {
      en: 'Monday fasting pleases Lord Shiva and grants: fulfillment of desires, good health, removal of obstacles in marriage, progeny, and spiritual growth. It is especially recommended for those seeking a suitable life partner, facing marital difficulties, or dealing with health issues. Sixteen consecutive Mondays (Solah Somvar) is considered particularly powerful.',
      hi: 'सोमवार व्रत से भगवान शिव प्रसन्न होते हैं और प्रदान करते हैं: मनोकामना पूर्ति, स्वास्थ्य, विवाह में बाधा निवारण, सन्तान, और आध्यात्मिक उन्नति। यह विशेष रूप से उचित जीवनसाथी चाहने वालों, वैवाहिक कठिनाइयों या स्वास्थ्य समस्याओं से जूझ रहे लोगों के लिए अनुशंसित है। सोलह सोमवार का व्रत विशेष रूप से शक्तिशाली माना जाता है।',
    },
    vidhi: {
      en: 'Wake early, bathe, and visit a Shiva temple. Offer bilva leaves, white flowers, dhatura, milk, and water for abhishek. Light a ghee diya and incense. Chant "Om Namah Shivaya" 108 times. Eat one meal after sunset — preferably fruits, milk, or a simple vegetarian meal without salt (in strict observance). Observe for 16 consecutive Mondays for best results. On the final Monday, feed 5 Brahmins and donate white items (rice, cloth, silver).',
      hi: 'सवेरे उठें, स्नान करें, शिव मन्दिर जाएं। बिल्वपत्र, श्वेत पुष्प, धतूरा, दूध और जल से अभिषेक करें। घी का दीया और धूप जलाएं। "ॐ नमः शिवाय" का 108 बार जाप करें। सूर्यास्त के बाद एक समय भोजन करें — फल, दूध, या बिना नमक का सादा शाकाहारी भोजन। श्रेष्ठ फल हेतु 16 सोमवार लगातार करें। अन्तिम सोमवार 5 ब्राह्मणों को भोजन कराएं और श्वेत वस्तुएं दान करें।',
    },
  },

  // ─── 5. Mangalvar Vrat Katha ─────────────────────────────────
  {
    slug: 'mangalvar-vrat',
    title: { en: 'Mangalvar Vrat Katha', hi: 'मंगलवार व्रत कथा' },
    deity: { en: 'Lord Hanuman', hi: 'भगवान हनुमान' },
    linkedFestivalSlugs: [],
    story: {
      en: `A devout Brahmin couple lived a humble life. The husband was a scholar, but poverty weighed upon the family. His wife, devoted to Lord Hanuman, began observing a strict fast every Tuesday. She would wake before dawn, bathe, light a lamp with sesame oil, offer sindoor and red flowers at the Hanuman temple, and eat only one meal of wheat bread and jaggery after sunset.

After seven consecutive Tuesdays, Hanuman was moved by her devotion. One night, the Brahmin dreamt of a cave in the nearby forest containing a treasure. He dismissed it as fantasy, but the dream returned three consecutive nights. His wife encouraged him to investigate.

In the forest, he found the cave exactly as described. Inside was a chest of gold coins with an inscription: "A gift from Hanuman to his devotee." The Brahmin used the wealth wisely — he built a temple, dug a well for the village, and educated poor children. He never stopped his wife from observing the Tuesday fast.

Word spread to the king, who summoned the Brahmin. The king, driven by greed, demanded the treasure for himself. The Brahmin refused, saying it was Hanuman's gift meant for the people. The king imprisoned him. But that night, the king's palace caught fire, his treasury was looted by invaders, and he fell severely ill.

The royal astrologer declared that the king had committed a great sin by troubling Hanuman's devotee. The king released the Brahmin, begged forgiveness, and himself began observing Mangalvar Vrat. His kingdom was restored, and peace returned. Since then, Tuesday fasting for Hanuman has been observed for courage, protection from enemies, debt relief, and overcoming fear.`,
      hi: `एक भक्त ब्राह्मण दम्पती सरल जीवन जीते थे। पति विद्वान था, परन्तु दरिद्रता परिवार पर भारी थी। पत्नी, हनुमान की भक्त, ने प्रत्येक मंगलवार कठोर व्रत रखना आरम्भ किया। भोर से पहले उठती, स्नान करती, तिल के तेल का दीया जलाती, हनुमान मन्दिर में सिन्दूर और लाल पुष्प अर्पित करती, और सूर्यास्त के बाद केवल गेहूं की रोटी और गुड़ का एक समय भोजन करती।

सात लगातार मंगलवारों के बाद हनुमान उसकी भक्ति से प्रभावित हुए। एक रात ब्राह्मण ने स्वप्न में समीप के वन में एक गुफा में खजाना देखा। उसने कल्पना समझकर टाल दिया, परन्तु स्वप्न लगातार तीन रातें आया। पत्नी ने जांच करने के लिए प्रेरित किया।

वन में उसने ठीक वैसी ही गुफा पाई। अन्दर स्वर्ण मुद्राओं का सन्दूक था जिस पर लिखा था: "हनुमान की ओर से अपने भक्त को उपहार।" ब्राह्मण ने धन का विवेकपूर्ण उपयोग किया — मन्दिर बनवाया, गांव के लिए कुआं खुदवाया, और गरीब बच्चों को शिक्षित किया।

राजा को पता चला, उसने ब्राह्मण को बुलाया। लोभवश राजा ने खजाना अपने लिए मांगा। ब्राह्मण ने मना किया। राजा ने उसे कारावास में डाल दिया। किन्तु उसी रात राजमहल में आग लगी, खजाने को आक्रमणकारियों ने लूटा, और राजा गम्भीर रूप से बीमार हो गया। राजज्योतिषी ने घोषित किया कि राजा ने हनुमान भक्त को कष्ट देकर महापाप किया है। राजा ने ब्राह्मण को मुक्त किया, क्षमा मांगी, और स्वयं मंगलवार व्रत करने लगा।`,
    },
    phal: {
      en: 'Tuesday fasting for Hanuman grants courage, physical strength, victory over enemies, freedom from debt and legal troubles, and protection from black magic and evil spirits. It is especially powerful during Mangal Dosha periods or when Mars is afflicted in one\'s horoscope. Regular observance brings fearlessness and removes obstacles from one\'s path.',
      hi: 'हनुमान के लिए मंगलवार व्रत करने से साहस, शारीरिक बल, शत्रुओं पर विजय, ऋण और कानूनी समस्याओं से मुक्ति, और बुरी शक्तियों से सुरक्षा मिलती है। यह विशेष रूप से मंगल दोष काल में या कुण्डली में मंगल पीड़ित होने पर शक्तिशाली है।',
    },
    vidhi: {
      en: 'Wake before sunrise, bathe, and visit a Hanuman temple. Offer sindoor (vermillion), red flowers, sesame oil lamp, and jalebi/boondi as prasad. Chant Hanuman Chalisa or "Om Hanumate Namah" 108 times. Wear red or orange clothing. Eat one meal after sunset — wheat bread, jaggery, and fruits. Avoid non-vegetarian food, alcohol, and anger on this day. Observe for 21 consecutive Tuesdays for full effect. Feed monkeys and donate red items.',
      hi: 'सूर्योदय से पहले उठें, स्नान करें, हनुमान मन्दिर जाएं। सिन्दूर, लाल पुष्प, तिल का तेल का दीया, और जलेबी/बूंदी अर्पित करें। हनुमान चालीसा या "ॐ हनुमते नमः" का 108 बार जाप करें। लाल या नारंगी वस्त्र पहनें। सूर्यास्त के बाद एक समय भोजन — गेहूं की रोटी, गुड़ और फल। इस दिन मांसाहार, मद्यपान और क्रोध से बचें। 21 मंगलवार लगातार करें।',
    },
  },

  // ─── 6. Pradosh Vrat Katha ───────────────────────────────────
  {
    slug: 'pradosh-vrat',
    title: { en: 'Pradosh Vrat Katha', hi: 'प्रदोष व्रत कथा' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    linkedFestivalSlugs: ['pradosham'],
    story: {
      en: `During the great churning of the cosmic ocean (Samudra Manthan), the Devas and Asuras cooperated to extract the nectar of immortality (Amrit). They used Mount Mandara as the churning rod and Vasuki, the serpent king, as the rope. Lord Vishnu took the form of Kurma (tortoise) to support the mountain from below.

As the churning intensified, many treasures emerged: Kamadhenu the wish-fulfilling cow, Uchhaishravas the divine horse, Airavata the celestial elephant, the Kalpavriksha (wish-fulfilling tree), and Goddess Lakshmi herself. But then something terrible emerged — Halahala, a poison so deadly that its fumes alone could destroy all creation.

The Devas panicked. The Asuras fled. No one could contain the poison. In desperation, all the gods rushed to Lord Shiva during the twilight hour of Trayodashi (the 13th lunar day) — the time of Pradosh. Shiva, moved by compassion for all living beings, consumed the deadly poison. Goddess Parvati, watching in horror, pressed her hand against Shiva's throat to prevent the poison from descending into his body. The poison remained in his throat, turning it blue — and Shiva became known as Neelakantha (the blue-throated one).

Nandi, Shiva's devoted bull vehicle, was overwhelmed by his master's sacrifice. He performed a powerful tapas (penance) during the same Pradosh period, praying that Lord Shiva would be worshipped during this sacred twilight hour for all eternity. Shiva granted this boon: anyone who worships him during Pradosh Kaal (the 90-minute twilight window on Trayodashi) would receive swift divine grace — faster than any other form of worship.

This is why Pradosh Vrat is observed twice a month, on both Shukla and Krishna Trayodashi. The twilight hour between sunset and nightfall on these days is considered the most powerful window for Shiva worship in the entire Hindu calendar.`,
      hi: `समुद्र मंथन के दौरान देवताओं और असुरों ने अमृत निकालने में सहयोग किया। मन्दराचल पर्वत को मथनी और वासुकि नाग को रस्सी बनाया। भगवान विष्णु ने कूर्म रूप धारण कर पर्वत को नीचे से सहारा दिया।

मंथन तीव्र होने पर अनेक रत्न प्रकट हुए: कामधेनु, उच्चैःश्रवा, ऐरावत, कल्पवृक्ष, और स्वयं देवी लक्ष्मी। फिर कुछ भयंकर प्रकट हुआ — हालाहल, इतना प्राणघातक विष कि इसके धुएं मात्र से समस्त सृष्टि नष्ट हो सकती थी।

देवता भयभीत हो गए। असुर भागे। कोई विष रोक नहीं सका। निराशा में सभी देवता त्रयोदशी (13वें चन्द्र दिवस) की संध्या बेला में — प्रदोष काल में — भगवान शिव के पास दौड़े। शिव ने सभी प्राणियों के प्रति करुणावश प्राणघातक विष का पान किया। देवी पार्वती ने भयभीत होकर शिव के गले पर हाथ दबाया ताकि विष शरीर में न उतरे। विष गले में रह गया, गला नीला हो गया — और शिव नीलकण्ठ कहलाए।

नन्दी, शिव के समर्पित वाहन, अपने स्वामी के बलिदान से अभिभूत हुए। उन्होंने उसी प्रदोष काल में तपस्या की, प्रार्थना की कि भगवान शिव की इस पवित्र संध्या काल में सदा पूजा हो। शिव ने वरदान दिया: जो कोई प्रदोष काल (त्रयोदशी पर 90 मिनट की संध्या अवधि) में उनकी पूजा करेगा, उसे शीघ्र दिव्य कृपा प्राप्त होगी।`,
    },
    phal: {
      en: 'Pradosh Vrat grants swift blessings from Lord Shiva — faster than any other form of worship. It removes all sins, fulfills desires, brings prosperity, cures diseases, and grants moksha. Shani Pradosham (Saturday) is particularly powerful for Saturn-related remedies. Soma Pradosham (Monday) brings emotional peace and mental clarity.',
      hi: 'प्रदोष व्रत से भगवान शिव का शीघ्र आशीर्वाद मिलता है। यह सभी पाप नष्ट करता है, मनोकामना पूर्ण करता है, समृद्धि लाता है, रोग दूर करता है, और मोक्ष प्रदान करता है। शनि प्रदोष शनि सम्बन्धी उपायों के लिए विशेष शक्तिशाली है। सोम प्रदोष भावनात्मक शांति और मानसिक स्पष्टता लाता है।',
    },
    vidhi: {
      en: 'Fast from sunrise. In the evening during Pradosh Kaal (1.5 hours after sunset), visit a Shiva temple. Perform abhishek with milk, water, honey, and yogurt. Offer bilva leaves, white flowers, dhatura, and bhasma. Light a ghee lamp. Chant Maha Mrityunjaya Mantra 108 times and recite the Shiva Rudram if possible. Circumambulate the Shiva Linga 3 times. Break the fast after the puja. For maximum benefit, also worship Nandi before approaching the Shiva Linga.',
      hi: 'सूर्योदय से व्रत रखें। सन्ध्या में प्रदोष काल (सूर्यास्त के 1.5 घंटे बाद) शिव मन्दिर जाएं। दूध, जल, मधु, दही से अभिषेक करें। बिल्वपत्र, श्वेत पुष्प, धतूरा, भस्म अर्पित करें। घी का दीया जलाएं। महामृत्युंजय मन्त्र 108 बार जपें और सम्भव हो तो शिव रुद्रम् पाठ करें। शिवलिंग की 3 बार परिक्रमा करें। पूजा के बाद व्रत तोड़ें।',
    },
  },

  // ─── 7. Shivratri Katha ──────────────────────────────────────
  {
    slug: 'shivratri',
    title: { en: 'Maha Shivratri Katha', hi: 'महा शिवरात्रि कथा' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    linkedFestivalSlugs: ['maha-shivaratri'],
    story: {
      en: `A hunter named Gurudruha lived in a dense forest. He was neither learned nor religious — he hunted animals for his livelihood and had never once visited a temple or uttered a prayer. One night, while hunting, he climbed a bilva tree near a lake to wait for prey. It was the night of Maha Shivratri, though he knew nothing of it.

As he sat in the tree through the cold night, he plucked bilva leaves to stay awake, absently dropping them below. He did not know that directly beneath the tree was a Shiva Linga, naturally formed from the earth. As the night progressed through its four prahars (watches), the leaves he dropped fell upon the Linga.

By dawn, without knowing it, Gurudruha had performed the perfect Shivratri worship: he had stayed awake all night (jagran), he had fasted (he had no food), he had offered bilva leaves upon a Shiva Linga, and his tears from the cold had served as the water abhishek. The dew drops falling from the tree were like the milk offering.

When death came for the hunter years later, Yama's messengers (Yamadutas) arrived to take his soul to the underworld. But Shiva's ganas (attendants) also appeared, claiming his soul for Kailash. A dispute arose. Lord Shiva himself intervened: because the hunter had unknowingly performed a perfect vigil on Shivratri — even without intention or knowledge — the merit was real. Shiva declared that the sincerity of the act matters more than the sophistication of the ritual.

Gurudruha was transported to Kailash, freed from the cycle of birth and death. This story teaches that Shiva's grace is accessible to all — the learned and the ignorant, the wealthy and the destitute, the pious and the sinful — and that even accidental worship on Shivratri carries immense power.`,
      hi: `गुरुद्रुह नामक एक शिकारी घने वन में रहता था। न विद्वान था न धार्मिक — जीविका के लिए पशुओं का शिकार करता था और न कभी मन्दिर गया न प्रार्थना की। एक रात शिकार करते हुए एक तालाब के पास बिल्व वृक्ष पर शिकार की प्रतीक्षा में चढ़ गया। वह महा शिवरात्रि की रात थी, यद्यपि उसे इसका ज्ञान नहीं था।

शीत रात्रि में वृक्ष पर बैठे हुए वह जागे रहने के लिए बिल्वपत्र तोड़ता और बेध्यानी में नीचे गिराता रहा। उसे ज्ञात नहीं था कि ठीक वृक्ष के नीचे पृथ्वी से स्वयंभू शिवलिंग था। जैसे-जैसे रात अपने चार प्रहरों से गुजरी, उसके गिराए पत्ते शिवलिंग पर गिरते रहे।

प्रातः तक, अनजाने में गुरुद्रुह ने पूर्ण शिवरात्रि पूजा कर दी: रातभर जागा (जागरण), उपवास रखा (भोजन नहीं था), शिवलिंग पर बिल्वपत्र अर्पित किए, और ठण्ड से उसके आंसू जलाभिषेक बन गए। वृक्ष से गिरती ओस बूंदें दुग्धाभिषेक जैसी थीं।

वर्षों बाद जब मृत्यु आई, यमदूत उसकी आत्मा को यमलोक ले जाने आए। किन्तु शिव के गण भी प्रकट हुए, कैलाश के लिए उसकी आत्मा का दावा करते हुए। विवाद हुआ। भगवान शिव ने स्वयं हस्तक्षेप किया: शिकारी ने अनजाने में शिवरात्रि पर पूर्ण जागरण किया था — बिना इरादे या ज्ञान के भी — पुण्य वास्तविक था। शिव ने घोषित किया कि कर्म की सच्चाई अनुष्ठान की जटिलता से अधिक महत्वपूर्ण है।

गुरुद्रुह कैलाश पहुंचा, जन्म-मृत्यु के चक्र से मुक्त हुआ।`,
    },
    phal: {
      en: 'Observing Maha Shivratri with fasting, night vigil, and Shiva worship is said to grant liberation (moksha) from the cycle of birth and death. Even unknowing worship on this night carries immense merit. It removes the most serious sins and grants the direct darshan of Lord Shiva after death.',
      hi: 'उपवास, रात्रि जागरण और शिव पूजा सहित महा शिवरात्रि का पालन जन्म-मृत्यु के चक्र से मोक्ष प्रदान करता है। इस रात अनजाने में भी पूजा का अपार पुण्य है। यह गम्भीरतम पापों को नष्ट करता है।',
    },
    vidhi: {
      en: 'Fast the entire day without food (nirjala or fruit-only). Visit a Shiva temple at night. The night is divided into 4 prahars — perform abhishek in each prahar: first with milk, second with curd, third with ghee, fourth with honey. Offer bilva leaves, white flowers, bhasma, and dhatura throughout the night. Chant "Om Namah Shivaya" continuously. Stay awake the entire night (jagran). Break the fast the next morning after sunrise puja.',
      hi: 'पूरे दिन बिना भोजन (निर्जल या फलाहार) व्रत रखें। रात्रि में शिव मन्दिर जाएं। रात को 4 प्रहरों में बांटा जाता है — प्रत्येक प्रहर में अभिषेक करें: पहले दूध, दूसरे दही, तीसरे घी, चौथे मधु से। रातभर बिल्वपत्र, श्वेत पुष्प, भस्म, धतूरा अर्पित करें। "ॐ नमः शिवाय" का निरन्तर जाप करें। पूरी रात जागें। अगली सुबह सूर्योदय पूजा के बाद व्रत तोड़ें।',
    },
  },

  // ─── 8. Santoshi Maa Vrat Katha ──────────────────────────────
  {
    slug: 'santoshi-maa',
    title: { en: 'Santoshi Maa Vrat Katha', hi: 'सन्तोषी माता व्रत कथा' },
    deity: { en: 'Santoshi Mata', hi: 'सन्तोषी माता' },
    linkedFestivalSlugs: [],
    story: {
      en: `Lord Ganesha had two sons, Shubh (Auspiciousness) and Labh (Profit). One day during Raksha Bandhan, the sons saw their sister (Ganesha's other children's sisters) receiving gifts and attention. They complained to their father: "We have no sister! We want a sister too!" Lord Ganesha, pleased by their innocent request, created a daughter from divine flames — Santoshi Ma, the Goddess of Satisfaction and Contentment. She was born from the combined energies of joy, gratitude, and inner peace.

In the mortal realm, a poor Brahmin woman named Satyavati was married into a large, cruel family. Her mother-in-law and sisters-in-law treated her as a servant, giving her barely enough food and making her do all the household chores. Despite her suffering, Satyavati never lost her faith or her gentle nature.

One day, Satyavati heard other women discussing the Santoshi Maa Vrat. She began observing it every Friday with whatever meager offerings she could manage — a handful of chickpeas and jaggery, the simplest prasad. She observed sixteen consecutive Fridays with unwavering devotion.

Santoshi Maa was deeply moved. She transformed Satyavati's life: her husband received a promotion in the king's court, the family's financial troubles disappeared, and her in-laws gradually changed their behavior. Most importantly, Satyavati found inner peace and contentment even before the external circumstances changed — the true gift of Santoshi Maa.

However, Satyavati's jealous sisters-in-law tried to sabotage her Udyapan (concluding ceremony) by mixing sour food with the prasad — sour food is strictly forbidden during Santoshi Maa worship. The goddess was angered, and troubles returned. But when Satyavati discovered the sabotage and performed the Udyapan correctly, all blessings were restored permanently.`,
      hi: `भगवान गणेश के दो पुत्र थे, शुभ और लाभ। एक दिन रक्षाबन्धन पर पुत्रों ने अपनी बहनों को उपहार और ध्यान पाते देखा। उन्होंने पिता से शिकायत की: "हमारी कोई बहन नहीं!" भगवान गणेश ने प्रसन्न होकर दिव्य ज्वालाओं से एक पुत्री रची — सन्तोषी मां, सन्तोष और तृप्ति की देवी।

मर्त्यलोक में सत्यवती नामक एक निर्धन ब्राह्मण स्त्री का विवाह एक बड़े, क्रूर परिवार में हुआ था। सास और ननदें उसे दासी समझतीं, मुश्किल से भोजन देतीं और सारे घरेलू कार्य करवातीं। कष्ट के बावजूद सत्यवती ने कभी विश्वास या सरल स्वभाव नहीं खोया।

एक दिन सत्यवती ने अन्य स्त्रियों को सन्तोषी माता व्रत की चर्चा करते सुना। उसने प्रत्येक शुक्रवार जो कुछ अल्प अर्पण कर सकती थी — मुट्ठी भर चने और गुड़ — के साथ व्रत करना आरम्भ किया। सोलह शुक्रवार लगातार अटल भक्ति से व्रत किया।

सन्तोषी मां गहन प्रभावित हुईं। सत्यवती का जीवन बदल गया: पति को राजदरबार में उन्नति मिली, आर्थिक कष्ट दूर हुए, ससुराल वालों का व्यवहार बदला। सबसे महत्वपूर्ण, बाहरी परिस्थितियां बदलने से पहले ही सत्यवती को आन्तरिक शांति और सन्तोष मिला।

किन्तु ईर्ष्यालु ननदों ने उद्यापन (समापन समारोह) में प्रसाद में खट्टा भोजन मिला दिया — सन्तोषी मां पूजा में खट्टा सर्वथा वर्जित है। देवी क्रोधित हुईं और कष्ट लौट आए। परन्तु जब सत्यवती ने षड्यन्त्र का पता लगाया और सही उद्यापन किया, सभी आशीर्वाद स्थायी रूप से लौट आए।`,
    },
    phal: {
      en: 'Santoshi Maa Vrat brings contentment, family harmony, resolution of domestic disputes, financial stability, and fulfillment of long-pending wishes. It is especially recommended for women facing difficult family situations, marital troubles, or seeking inner peace. The goddess grants satisfaction with what one has while gradually improving circumstances.',
      hi: 'सन्तोषी माता व्रत सन्तोष, पारिवारिक सद्भाव, गृह कलह का समाधान, आर्थिक स्थिरता और लम्बित मनोकामनाओं की पूर्ति लाता है। यह विशेष रूप से कठिन पारिवारिक स्थितियों, वैवाहिक समस्याओं, या आन्तरिक शांति चाहने वाली महिलाओं के लिए अनुशंसित है।',
    },
    vidhi: {
      en: 'Observe on 16 consecutive Fridays. Wake early, bathe, and worship Santoshi Maa with chana (chickpeas) and gur (jaggery) as prasad. Light a ghee diya. Do NOT eat or offer anything sour (citrus, tamarind, pickle, yogurt, vinegar) on this day. Eat one sattvic meal. After 16 Fridays, perform Udyapan: invite 8 boys for a meal, offer dakshina, and distribute prasad. Strictly avoid sour food during the entire Udyapan.',
      hi: '16 लगातार शुक्रवार व्रत करें। सवेरे उठें, स्नान करें, चना और गुड़ के प्रसाद से सन्तोषी माता की पूजा करें। घी का दीया जलाएं। इस दिन कुछ भी खट्टा (नीम्बू, इमली, अचार, दही, सिरका) न खाएं न अर्पित करें। एक सात्विक भोजन करें। 16 शुक्रवार बाद उद्यापन करें: 8 बालकों को भोजन कराएं, दक्षिणा दें, प्रसाद वितरित करें।',
    },
  },

  // ─── 9. Ganesh Chaturthi Katha ───────────────────────────────
  {
    slug: 'ganesh-chaturthi',
    title: { en: 'Ganesh Chaturthi Katha', hi: 'गणेश चतुर्थी कथा' },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश' },
    linkedFestivalSlugs: ['ganesh-chaturthi'],
    story: {
      en: `Goddess Parvati, while Lord Shiva was away on Mount Kailash for meditation, desired privacy for her bath. She created a boy from the turmeric paste (ubtan) she used for her body, breathed life into him, and appointed him as her guardian. "Stand at the door," she instructed. "Let no one enter."

The boy, radiant and strong, stood guard dutifully. When Lord Shiva returned home, the boy blocked his path. "Who are you?" Shiva asked. "I am Parvati's son, and she has forbidden anyone from entering," the boy replied firmly. Shiva, not recognizing his own wife's creation, was enraged. A fierce battle ensued between the supreme god and the determined boy.

When Shiva's ganas (attendants) could not defeat the boy, Shiva himself in fury severed the boy's head with his trident (trishul). Parvati, emerging from her bath, saw her son's lifeless body and was consumed by grief and rage. She threatened to destroy all of creation unless her son was restored.

The Devas trembled. Brahma and Vishnu pleaded with Shiva to revive the boy. Shiva, now realizing his mistake, was filled with remorse. He instructed his ganas: "Go north. The first creature whose head faces north — bring me that head." They found an elephant sleeping with its head facing north, and brought its head to Shiva.

Shiva placed the elephant head on the boy's body and revived him with divine power. He declared: "This boy is now my own son. He shall be worshipped first before all the gods — Pratham Pujya. His name is Ganesha — Lord of the Ganas." Shiva granted him two boons: he would be worshipped before any other deity in any puja, and he would be the remover of all obstacles (Vighnaharta). The gods showered blessings: Brahma granted him wisdom, Vishnu granted him devotees in every age, and Lakshmi granted him eternal prosperity.

This is why Ganesh Chaturthi celebrates the birth (or more precisely, the "rebirth") of Lord Ganesha, and why his worship precedes every other Hindu ritual.`,
      hi: `जब भगवान शिव कैलाश पर ध्यान में थे, देवी पार्वती ने स्नान के लिए एकान्त चाहा। उन्होंने अपने उबटन की हल्दी से एक बालक बनाया, उसमें प्राण फूंके, और रक्षक नियुक्त किया। "द्वार पर खड़े रहो, किसी को प्रवेश मत करने दो।"

बालक ने कर्तव्यनिष्ठा से पहरा दिया। जब भगवान शिव लौटे, बालक ने मार्ग रोका। "तुम कौन हो?" शिव ने पूछा। "मैं पार्वती का पुत्र हूं, उन्होंने किसी को प्रवेश वर्जित किया है," बालक ने दृढ़ता से उत्तर दिया। शिव क्रोधित हुए। भीषण युद्ध हुआ।

जब शिव के गण बालक को परास्त न कर सके, शिव ने क्रोध में त्रिशूल से बालक का शीश काट दिया। पार्वती ने बालक का निर्जीव शरीर देखा और शोक व क्रोध से व्याकुल हो गईं। उन्होंने पुत्र की पुनर्जीवन न होने पर समस्त सृष्टि के विनाश की धमकी दी।

शिव ने पश्चाताप में गणों को आदेश दिया: "उत्तर दिशा में जाओ। जिस प्रथम प्राणी का मुख उत्तर की ओर हो, उसका शीश ले आओ।" उन्हें उत्तर मुख करके सोता हाथी मिला। शिव ने हाथी का शीश बालक के शरीर पर रखा और दिव्य शक्ति से पुनर्जीवित किया। उन्होंने घोषित किया: "यह बालक अब मेरा पुत्र है। सभी देवताओं से पहले इसकी पूजा होगी — प्रथम पूज्य। इसका नाम गणेश है — गणों का स्वामी।" शिव ने दो वरदान दिए: किसी भी पूजा में सर्वप्रथम गणेश की पूजा होगी, और वे विघ्नहर्ता होंगे।`,
    },
    phal: {
      en: 'Ganesh Chaturthi worship removes all obstacles from one\'s life, grants wisdom, success in education and business, protection during new beginnings, and brings prosperity. Lord Ganesha is especially invoked before starting any new venture, journey, examination, or important task. Regular Chaturthi observance ensures his continuous protection.',
      hi: 'गणेश चतुर्थी पूजा जीवन से सभी बाधाएं दूर करती है, विद्या, शिक्षा और व्यापार में सफलता, नई शुरुआत में सुरक्षा, और समृद्धि प्रदान करती है। किसी भी नए कार्य, यात्रा, परीक्षा या महत्वपूर्ण कार्य से पहले भगवान गणेश का विशेष आवाहन किया जाता है।',
    },
    vidhi: {
      en: 'Install a clay Ganesha idol. Perform Prana Pratishtha (invocation) with mantras. Offer 21 modaks, 21 durva grass bundles, red flowers, and sindoor. Light a ghee diya. Chant Ganapati Atharvashirsha or "Om Gan Ganapataye Namah" 108 times. Perform aarti with camphor. The festival lasts 1.5, 3, 5, 7, or 10 days. On the final day, perform visarjan (immersion) in a water body with the chant "Ganpati Bappa Morya, Purchya Varshi Laukarya!"',
      hi: 'मिट्टी की गणेश मूर्ति स्थापित करें। मन्त्रों से प्राण प्रतिष्ठा करें। 21 मोदक, 21 दूर्वा गुच्छ, लाल पुष्प, सिन्दूर अर्पित करें। घी का दीया जलाएं। गणपति अथर्वशीर्ष या "ॐ गं गणपतये नमः" का 108 बार जाप करें। कर्पूर से आरती करें। उत्सव 1.5, 3, 5, 7, या 10 दिन चलता है। अन्तिम दिन "गणपति बप्पा मोरया, पुढच्या वर्षी लौकरिया!" के जयघोष से जल में विसर्जन करें।',
    },
  },

  // ─── 10. Ahoi Ashtami Katha ──────────────────────────────────
  {
    slug: 'ahoi-ashtami',
    title: { en: 'Ahoi Ashtami Katha', hi: 'अहोई अष्टमी कथा' },
    deity: { en: 'Ahoi Mata (Goddess of Protection)', hi: 'अहोई माता (रक्षा की देवी)' },
    linkedFestivalSlugs: [],
    story: {
      en: `Long ago in a village, there lived a woman who had seven sons. Before the festival of Diwali, the woman went to a forest to dig clay for renovating her home. While digging, her pickaxe accidentally struck a den, killing a baby porcupine (syahi) inside. The mother porcupine witnessed this and cursed the woman: "As you have killed my child, your children will also die."

Within a year, all seven of the woman's sons died one by one. She was devastated beyond measure. The villagers told her about the curse. Grief-stricken and repentant, the woman went to the forest, found the mother porcupine, and begged forgiveness with tears streaming down her face.

The porcupine, seeing the woman's genuine remorse and suffering, was moved. She said: "I cannot undo death, but Ahoi Mata — the protector of children — can help you. Observe a fast on the Ashtami (eighth day) of Krishna Paksha in the month of Kartik. Worship Ahoi Mata with a drawing of a porcupine and her seven babies. Pray with all your heart. If your repentance is sincere, your children will be restored."

The woman observed the fast with absolute devotion. She drew the image of Ahoi Mata on the wall, depicted the syahi and her cubs, offered water and grain to the image at starrise (not moonrise — Ahoi Ashtami puja is done at starrise), and prayed through the night. By the grace of Ahoi Mata, her seven sons were restored to life.

From that day, mothers throughout India observe Ahoi Ashtami for the well-being, long life, and protection of their children. The fast is observed four days before Diwali, on Kartik Krishna Ashtami. Mothers who have no sons also observe it praying for a son, or for the general welfare of all their children.`,
      hi: `बहुत पहले एक गांव में एक स्त्री रहती थी जिसके सात पुत्र थे। दीवाली से पहले स्त्री घर की मरम्मत के लिए मिट्टी खोदने वन गई। खोदते समय उसकी कुदाल से एक मांद में स्याही (साही) का बच्चा मर गया। मां साही ने देखा और स्त्री को श्राप दिया: "जैसे तूने मेरे बच्चे को मारा, तेरे बच्चे भी मरेंगे।"

एक वर्ष में स्त्री के सातों पुत्र एक-एक करके मर गए। वह अत्यन्त विदीर्ण हो गई। ग्रामीणों ने श्राप के बारे में बताया। दुःखी और पश्चातापी स्त्री वन गई, मां साही को ढूंढा, और आंसू बहाते हुए क्षमा याचना की।

साही ने स्त्री का सच्चा पश्चाताप और कष्ट देखकर कहा: "मैं मृत्यु को पलट नहीं सकती, परन्तु अहोई माता — बच्चों की रक्षक — सहायता कर सकती हैं। कार्तिक मास की कृष्ण पक्ष अष्टमी को व्रत करो। साही और उसके सात बच्चों के चित्र सहित अहोई माता की पूजा करो। हृदय से प्रार्थना करो।"

स्त्री ने पूर्ण भक्ति से व्रत किया। दीवार पर अहोई माता की छवि बनाई, साही और शावकों को चित्रित किया, तारा उदय पर (चन्द्रोदय नहीं) जल और अनाज अर्पित किया, और रातभर प्रार्थना की। अहोई माता की कृपा से उसके सातों पुत्र पुनर्जीवित हो गए।

तब से माताएं अपने बच्चों की रक्षा, दीर्घायु और कल्याण के लिए अहोई अष्टमी का व्रत करती हैं।`,
    },
    phal: {
      en: 'Ahoi Ashtami grants protection, long life, and good health for children. Mothers who observe this fast with devotion ensure their children are shielded from illness, accidents, and misfortune. It is believed to be especially powerful for mothers with young children or those praying for the birth of a child.',
      hi: 'अहोई अष्टमी बच्चों की रक्षा, दीर्घायु और स्वास्थ्य प्रदान करती है। श्रद्धापूर्वक इस व्रत को करने वाली माताएं अपने बच्चों को बीमारी, दुर्घटना और दुर्भाग्य से सुरक्षित रखती हैं।',
    },
    vidhi: {
      en: 'Draw or print the image of Ahoi Mata (with a porcupine and cubs) on the wall or a board. Fast from sunrise — no food or water until starrise in the evening. In the evening at starrise (when the first star appears), offer water, grain (wheat or rice), and sweets to the Ahoi Mata image. Listen to or read the Ahoi Ashtami Katha. After the puja, look at the stars and break the fast. Older women in the family typically narrate the katha while younger mothers listen.',
      hi: 'दीवार या बोर्ड पर अहोई माता (साही और शावकों सहित) की छवि बनाएं। सूर्योदय से व्रत रखें — सन्ध्या में तारा उदय तक बिना अन्न-जल। सन्ध्या में तारा उदय पर (पहला तारा दिखने पर) अहोई माता की छवि को जल, अनाज, मिठाई अर्पित करें। अहोई अष्टमी कथा सुनें या पढ़ें। पूजा के बाद तारों को देखकर व्रत तोड़ें।',
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

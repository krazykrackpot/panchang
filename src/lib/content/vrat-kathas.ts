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
  /** External link to the full katha text from a reliable source */
  kathaUrl?: { url: string; source: string; language: string }[];
  /** Puja materials needed for the vrat */
  samagri?: { en: string[]; hi: string[] };
  /** Full katha text divided into chapters */
  chapters?: {
    number: number;
    title: { en: string; hi: string };
    content: { en: string; hi: string };
  }[];
  /** Slugs referencing devotional/aarti content */
  relatedAartis?: string[];
}

export const VRAT_KATHAS: VratKatha[] = [
  // ─── 1. Ekadashi Vrat ─────────────────────────────────
  {
    slug: 'ekadashi',
    title: { en: 'Ekadashi Vrat', hi: 'एकादशी व्रत' },
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु' },
    linkedFestivalSlugs: ['ekadashi'],
    kathaUrl: [
      { url: 'https://en.wikipedia.org/wiki/Ekadashi', source: 'Wikipedia', language: 'English' },
      { url: 'https://hi.wikipedia.org/wiki/%E0%A4%8F%E0%A4%95%E0%A4%BE%E0%A4%A6%E0%A4%B6%E0%A5%80', source: 'विकिपीडिया', language: 'हिन्दी' },
    ],
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
    samagri: {
      en: [
        'Satyanarayan idol or photo',
        'Red/yellow cloth for altar',
        'Kalash with water + mango leaves + coconut',
        'Panchamrit (milk, curd, honey, ghee, sugar)',
        'Tulsi leaves',
        'Betel leaves and nuts',
        'Banana, seasonal fruits',
        'Wheat flour, sugar, ghee for prasad (sheera)',
        'Ghee diya and cotton wicks',
        'Incense sticks and camphor',
        'Roli, haldi, akshat (rice)',
        'Red/yellow flowers',
        'White thread (mauli)',
      ],
      hi: [
        'सत्यनारायण मूर्ति या चित्र',
        'वेदी के लिए लाल/पीला वस्त्र',
        'जल + आम के पत्ते + नारियल सहित कलश',
        'पंचामृत (दूध, दही, शहद, घी, शक्कर)',
        'तुलसी पत्र',
        'पान और सुपारी',
        'केला, मौसमी फल',
        'प्रसाद हेतु गेहूं का आटा, चीनी, घी (शीरा)',
        'घी का दीया और रुई की बत्ती',
        'अगरबत्ती और कपूर',
        'रोली, हल्दी, अक्षत (चावल)',
        'लाल/पीले पुष्प',
        'मौली (सफ़ेद धागा)',
      ],
    },
    chapters: [
      // ── Chapter 1: Origin & Narada's Question ──
      {
        number: 1,
        title: {
          en: 'The Origin — Narada\'s Question in Vaikuntha',
          hi: 'प्रथम अध्याय — नारद का प्रश्न और भगवान का उपदेश',
        },
        content: {
          en: `In the sacred forest of Naimisharanya, the great sages once gathered to perform a thousand-year yajna for the welfare of all beings. Among them sat the venerable Suta Goswami, the master storyteller who had heard all the Puranas from the lips of Vyasa himself. The sages, weary from their long austerities, beseeched him: "O Suta, tell us a tale that will purify our hearts and show the path to liberation for all — not just the learned, but the simple householder, the poor labourer, the widow, and the child."

Suta Goswami smiled and said: "I shall narrate to you the most merciful of all vratas — the Satyanarayan Katha, which Lord Vishnu himself revealed to Narada Muni for the benefit of all humanity."

In a distant age, the celestial sage Narada was wandering through the three worlds. He had visited the heavenly realms where the gods dwell in splendour, and the netherworlds where the asuras scheme in darkness. But it was on Prithvi Lok — this mortal earth — that his heart was moved to its depths. Everywhere he looked, he saw suffering beyond measure. In one village, a farmer wept over barren fields while his children went hungry. In another, a merchant had lost his entire fortune to thieves and sat in the dust, broken. A young mother clutched a sick infant, praying to any god who would listen. An old Brahmin, learned in all the Vedas, could not afford a single meal and begged from door to door with hollow eyes.

Narada, whose compassion was as vast as the sky, could bear it no longer. With tears streaming down his face, he ascended to Vaikuntha, the eternal abode of Lord Vishnu. There, upon a throne of divine light, sat Bhagavan Satyanarayan — Lord Vishnu in his form as the embodiment of Truth. His complexion was the colour of rain-laden clouds, his four arms holding the conch, discus, mace, and lotus. Goddess Lakshmi sat at his feet, and the eternal attendants Jaya and Vijaya guarded the gates.

Narada prostrated himself fully and said: "O Jagannath, O Lord of all worlds! I have seen the suffering of your children on earth. The pious and the sinful alike are tormented by poverty, disease, and grief. Surely there must be a simple path — not requiring great wealth, not demanding years of penance, not reserved for scholars alone — by which ordinary men and women can free themselves from this ocean of sorrow. Please reveal such a vrat to me, O Merciful One."

Lord Vishnu, pleased beyond measure by Narada's selfless compassion, spoke in a voice that resonated through all of creation: "O Narada, you have asked the question that no one else has thought to ask. You did not pray for your own liberation, but for the relief of others. Therefore I shall reveal to you the Satyanarayan Vrat — the vow of the Lord of Truth."

"This vrat," the Lord continued, "is open to all. There is no restriction of varna, of wealth, of gender, or of age. The poorest beggar and the mightiest king may perform it with equal right. The materials needed are simple — whatever one can afford. A handful of flour, a spoonful of sugar, a few drops of ghee — even this is sufficient if offered with a pure heart."

"The devotee should gather family and friends, install my image or simply invoke my name, prepare a simple prasad of sheera, and listen to this katha with full attention. After the katha, the prasad must be distributed to all present — none should be turned away, and none should refuse it. This is the essential rule: the prasad of Satyanarayan must never be disrespected."

"Whoever performs this vrat with sincerity," Lord Vishnu declared, "shall be freed from poverty, blessed with progeny, cured of disease, and protected from misfortune. Their household will know peace, their ventures will prosper, and at the end of their days, they shall attain my eternal abode."

Narada, overwhelmed with gratitude, bowed again and again. He resolved to travel the earth and spread this teaching to every soul he met. And so he descended from Vaikuntha, carrying with him the most compassionate gift that the Lord had ever bestowed upon humanity — the Satyanarayan Vrat Katha.

Thus ends the first chapter. Those who listen to this chapter with devotion and a pure heart shall find their minds at peace and their path illuminated by the Lord's grace.`,
          hi: `एक समय की बात है, नैमिषारण्य के पवित्र वन में ऋषि-मुनियों का विशाल समागम हुआ। सहस्रों वर्षों के यज्ञ में लीन ये महात्मा समस्त प्राणियों के कल्याण हेतु तपस्या कर रहे थे। उनमें श्री सूत गोस्वामी भी विराजमान थे — वही महान कथावाचक जिन्होंने स्वयं वेदव्यास जी के श्रीमुख से समस्त पुराण सुने थे। ऋषियों ने उनसे विनती की: "हे सूत जी, हमें ऐसी कथा सुनाइए जो न केवल विद्वानों के लिए, अपितु साधारण गृहस्थ, निर्धन श्रमिक, विधवा और बालक — सबके लिए कल्याणकारी हो।"

सूत गोस्वामी मुस्कुराये और बोले: "हे मुनिवरों, मैं आपको सबसे करुणामय व्रत की कथा सुनाता हूं — श्री सत्यनारायण कथा, जिसे स्वयं भगवान विष्णु ने नारद मुनि को सम्पूर्ण मानवता के हित में प्रकट किया।"

बहुत पुरानी बात है। देवर्षि नारद तीनों लोकों में विचरण कर रहे थे। उन्होंने स्वर्गलोक देखा जहां देवता वैभव में निवास करते हैं, पाताललोक देखा जहां असुर अपनी योजनाओं में लीन रहते हैं। किन्तु जब उन्होंने पृथ्वीलोक पर दृष्टि डाली, तो उनका हृदय विदीर्ण हो गया। जहां भी देखा, असीम दुःख दिखाई दिया। एक गांव में किसान अपने बंजर खेतों पर रो रहा था, उसके बच्चे भूखे थे। दूसरे गांव में एक व्यापारी डाकुओं के हाथों सब कुछ खोकर धूल में बैठा था, टूटा हुआ। एक युवा माता अपने रोगी शिशु को छाती से लगाये किसी भी देवता से प्रार्थना कर रही थी। एक वृद्ध ब्राह्मण, जो समस्त वेदों का ज्ञाता था, एक समय के भोजन के लिए द्वार-द्वार भिक्षा मांग रहा था।

नारद मुनि, जिनकी करुणा आकाश के समान विशाल थी, यह दृश्य और नहीं सह सके। उनकी आंखों से अश्रुधारा बहने लगी। वे तुरन्त वैकुण्ठ धाम की ओर चले — भगवान विष्णु का शाश्वत निवास। वहां दिव्य प्रकाश के सिंहासन पर भगवान सत्यनारायण विराजमान थे — भगवान विष्णु अपने सत्य-स्वरूप में। उनका वर्ण मेघों के समान श्यामल था, चार भुजाओं में शंख, चक्र, गदा और पद्म धारण किये हुए। देवी लक्ष्मी उनके चरणों में बैठी थीं, और शाश्वत द्वारपाल जय-विजय द्वार पर खड़े थे।

नारद मुनि ने साष्टांग प्रणाम किया और बोले: "हे जगन्नाथ! हे समस्त लोकों के स्वामी! मैंने पृथ्वी पर आपकी सन्तानों का दुःख देखा है। पुण्यात्मा और पापी — दोनों ही दरिद्रता, रोग और शोक से पीड़ित हैं। निश्चय ही कोई ऐसा सरल मार्ग होगा — जिसमें न महान सम्पत्ति की आवश्यकता हो, न वर्षों की तपस्या, न केवल विद्वानों के लिए सीमित — जिससे साधारण स्त्री-पुरुष इस दुःख-सागर से मुक्त हो सकें। हे करुणानिधान, कृपया ऐसा व्रत मुझे बताइये।"

भगवान विष्णु नारद की निःस्वार्थ करुणा से अत्यन्त प्रसन्न हुए। उन्होंने ऐसी वाणी में कहा जो समस्त सृष्टि में गूंज उठी: "हे नारद! तुमने वह प्रश्न पूछा है जो किसी और ने नहीं सोचा। तुमने अपनी मुक्ति नहीं मांगी, बल्कि दूसरों के दुःख-निवारण की प्रार्थना की। इसलिए मैं तुम्हें सत्यनारायण व्रत प्रकट करता हूं — सत्य के भगवान का व्रत।"

"यह व्रत," भगवान ने आगे कहा, "सबके लिए खुला है। न वर्ण का बन्धन है, न धन का, न लिंग का, न आयु का। निर्धन भिखारी और महान सम्राट दोनों समान अधिकार से इसे कर सकते हैं। सामग्री सरल है — जो भी सामर्थ्य हो। मुट्ठीभर आटा, चम्मचभर चीनी, कुछ बूंद घी — शुद्ध हृदय से अर्पित हो तो यह भी पर्याप्त है।"

"भक्त परिवार और मित्रों को एकत्र करे, मेरी मूर्ति स्थापित करे अथवा केवल मेरे नाम का आह्वान करे, शीरे का सरल प्रसाद बनाये, और पूर्ण ध्यान से यह कथा सुने। कथा के पश्चात प्रसाद सबको वितरित करना अनिवार्य है — किसी को लौटाया न जाये, और कोई मना न करे। यही मूल नियम है: सत्यनारायण के प्रसाद का कभी अनादर नहीं करना चाहिए।"

"जो कोई भी यह व्रत सच्चे मन से करेगा," भगवान विष्णु ने घोषणा की, "वह दरिद्रता से मुक्त होगा, सन्तान से सुखी होगा, रोग से छुटकारा पायेगा, और दुर्भाग्य से सुरक्षित रहेगा। उसके घर में शान्ति होगी, उसके कार्य सफल होंगे, और अन्त में वह मेरे शाश्वत धाम को प्राप्त करेगा।"

नारद मुनि कृतज्ञता से विह्वल हो गये। उन्होंने बार-बार प्रणाम किया। उन्होंने संकल्प किया कि वे पृथ्वी पर जाकर यह शिक्षा प्रत्येक जीव तक पहुंचायेंगे। और इस प्रकार वे वैकुण्ठ से उतरे, अपने साथ लाते हुए वह सबसे करुणामय उपहार जो भगवान ने मानवता को कभी प्रदान किया — श्री सत्यनारायण व्रत कथा।

इति प्रथम अध्याय सम्पूर्ण। जो भक्तजन इस अध्याय को श्रद्धा और शुद्ध हृदय से सुनते हैं, उनका मन शान्त होता है और उनका मार्ग भगवान की कृपा से प्रकाशित होता है।`,
        },
      },
      // ── Chapter 2: The Poor Brahmin ──
      {
        number: 2,
        title: {
          en: 'The Poor Brahmin of Kashi',
          hi: 'द्वितीय अध्याय — काशी का निर्धन ब्राह्मण',
        },
        content: {
          en: `Suta Goswami continued: "Now hear, O sages, what happened when Narada descended to earth with the Lord's teaching."

In the ancient and holy city of Kashi — Varanasi, the city of light, where Lord Shiva himself resides — there lived a Brahmin of great learning but terrible poverty. This Brahmin knew all four Vedas, could recite the Upanishads from memory, and was well-versed in the rituals of dharma. Yet for all his knowledge, fate had dealt him a cruel hand. His granary was empty, his clothes were patched and threadbare, and his family went to sleep hungry more nights than not. Each morning he would walk to the ghats of the Ganga, perform his sandhya vandana with trembling hands, and pray: "O Lord, I do not ask for palaces or gold. I ask only that my children may eat today."

His wife, a woman of immense patience and faith, never once complained. She would gather wild greens from the riverbank and cook whatever meagre grain they had with such love that even that poor meal tasted of devotion. Their children, though thin and barefoot, were taught to pray before eating and to share even their last morsel with a guest.

One night, after a day when the Brahmin had walked the entire city begging for alms and received nothing — not a single grain, not a single coin — he collapsed on the floor of his hut in despair. His wife covered him with their only blanket and sat beside him, quietly chanting the name of Vishnu.

That night, Lord Vishnu, moved by the Brahmin's unwavering devotion despite his suffering, appeared in his dream. The Lord took the form of an old Brahmin — a wandering sadhu with matted hair, ash-smeared forehead, and kind, twinkling eyes. This divine visitor sat beside the sleeping man and spoke softly: "O learned one, why do you weep? Your devotion has reached the ears of Satyanarayan himself. I have come to tell you of a vrat that will transform your life."

"It is called the Satyanarayan Vrat," the old Brahmin continued. "You need not travel to any tirtha or perform elaborate rituals. Simply gather your family, prepare whatever prasad you can afford — even a handful of flour mixed with jaggery will suffice — and listen to the five chapters of this sacred katha with a devoted heart. Invite your neighbours, for this vrat multiplies in power with every soul that participates."

The Brahmin woke with a start. The dream was vivid, more real than waking life. He could still smell the sandalwood fragrance that had surrounded the old sadhu. He told his wife everything, and she — wise woman that she was — said immediately: "We must perform this vrat today. We have a little flour, a small lump of jaggery, and some ghee that the neighbour gave us. It is enough."

And so the poor Brahmin, with trembling hands and a heart full of hope, set up a simple altar. He placed a small brass image of Vishnu that had been in his family for generations — tarnished and dented, but sacred. His wife prepared the prasad: a simple sheera of wheat flour, jaggery, and the last drops of their ghee. They had no flowers, so they offered tulsi leaves from the plant growing by their door. They had no incense, so they burned a small piece of dried cow dung mixed with camphor. The children sat in a circle, their eyes wide with wonder at this ceremony they had never seen before.

The Brahmin recited the katha from memory — for he had heard it once, long ago, from his own guru — and his voice broke with emotion at every passage. When he reached the verse where Lord Vishnu says "this vrat is open to all," he wept openly, for he had believed his poverty had closed every door.

That very evening, after the prasad was distributed and the neighbours had gone home, a miracle occurred. A wealthy merchant who had been travelling through Kashi stopped at the Brahmin's door, lost and seeking directions. Seeing the remnants of the puja, the merchant was moved. He said: "I have been searching for a learned Brahmin to perform my daughter's wedding ceremonies. Your devotion tells me you are the one." He gave the Brahmin a generous advance — more money than the family had seen in years.

From that day forward, the Brahmin's fortunes turned. Students sought him out for teaching, families invited him for ceremonies, and his reputation as a man of genuine devotion spread throughout Kashi. But the Brahmin never forgot the source of his blessings. Every Purnima, without fail, he performed the Satyanarayan Puja. Whether he had much or little, the puja was never skipped. He would say to his wife: "This is not our wealth. It is the Lord's prasad flowing through our hands. The moment we stop giving thanks, it will flow elsewhere."

His wife would smile and reply: "Then let us never stop."

And they never did. For the rest of their long and prosperous lives, the Brahmin and his wife performed the Satyanarayan Vrat on every Purnima, and their home became known throughout Kashi as a place where no guest was ever turned away and no hungry soul left unfed.

Thus ends the second chapter. The lesson is clear: even the poorest devotee, with nothing but faith and a pure heart, can invoke the grace of Satyanarayan. The Lord does not measure the value of the offering — he measures the devotion behind it.`,
          hi: `सूत गोस्वामी ने कथा आगे बढ़ाई: "हे मुनिवरों, अब सुनिये कि जब नारद भगवान की शिक्षा लेकर पृथ्वी पर उतरे, तो क्या हुआ।"

प्राचीन और पवित्र काशी नगरी में — वाराणसी, प्रकाश की नगरी, जहां स्वयं भगवान शिव निवास करते हैं — एक अत्यन्त विद्वान किन्तु अत्यन्त निर्धन ब्राह्मण रहता था। यह ब्राह्मण चारों वेदों का ज्ञाता था, उपनिषदों का कण्ठस्थ पाठ कर सकता था, और धर्म के समस्त अनुष्ठानों में पारंगत था। किन्तु इतने ज्ञान के बावजूद भाग्य ने उसके साथ क्रूर खेल खेला था। उसका अन्न भण्डार खाली था, वस्त्र फटे और जीर्ण थे, और उसका परिवार अधिकांश रातें भूखा सोता था। प्रत्येक प्रातः वह गंगा के घाट पर जाता, कांपते हाथों से सन्ध्या वन्दना करता, और प्रार्थना करता: "हे प्रभु, मैं महल या स्वर्ण नहीं मांगता। बस इतना कि आज मेरे बच्चे खा सकें।"

उसकी पत्नी, अपार धैर्य और श्रद्धा की स्त्री, ने कभी एक शब्द भी शिकायत का नहीं कहा। वह नदी के किनारे से जंगली साग चुनती और जो भी थोड़ा-बहुत अनाज होता, उसे इतने प्रेम से पकाती कि वह निर्धन भोजन भी भक्ति का स्वाद रखता। उनके बच्चे, भले ही दुबले और नंगे पांव थे, उन्हें सिखाया गया था कि भोजन से पहले प्रार्थना करो और अपना अन्तिम ग्रास भी अतिथि के साथ बांटो।

एक रात, जब ब्राह्मण ने पूरे दिन नगर में भिक्षा मांगी और कुछ भी नहीं मिला — एक दाना भी नहीं, एक पैसा भी नहीं — वह निराशा में अपनी झोंपड़ी के फर्श पर गिर पड़ा। उसकी पत्नी ने उसे उनके एकमात्र कम्बल से ढका और उसके पास बैठकर चुपचाप विष्णु नाम का जाप करती रही।

उस रात, भगवान विष्णु, ब्राह्मण की कष्टों के बावजूद अटल भक्ति से द्रवित होकर, उसके स्वप्न में प्रकट हुए। भगवान ने एक वृद्ध ब्राह्मण का रूप धारण किया — जटाधारी, भस्म-विभूषित ललाट, और कृपालु चमकती आंखों वाले परिव्राजक साधु। इस दिव्य अतिथि ने सोते हुए ब्राह्मण के पास बैठकर धीरे से कहा: "हे विद्वान, तुम क्यों रोते हो? तुम्हारी भक्ति स्वयं सत्यनारायण के कानों तक पहुंची है। मैं तुम्हें एक ऐसे व्रत के बारे में बताने आया हूं जो तुम्हारा जीवन बदल देगा।"

"इसे सत्यनारायण व्रत कहते हैं," वृद्ध ब्राह्मण ने कहा। "तुम्हें किसी तीर्थ पर जाने या विस्तृत अनुष्ठान करने की आवश्यकता नहीं। बस अपने परिवार को एकत्र करो, जो भी प्रसाद बना सको — मुट्ठीभर आटा और गुड़ भी पर्याप्त है — और भक्तिपूर्ण हृदय से इस पवित्र कथा के पांचों अध्यायों को सुनो। अपने पड़ोसियों को भी बुलाओ, क्योंकि यह व्रत प्रत्येक सहभागी आत्मा के साथ शक्ति में गुणित होता है।"

ब्राह्मण चौंककर जागा। स्वप्न इतना स्पष्ट था कि जागृत अवस्था से भी अधिक सत्य लगता था। वह अभी भी उस चन्दन की सुगन्ध अनुभव कर सकता था जो वृद्ध साधु के चारों ओर थी। उसने अपनी पत्नी को सब कुछ बताया, और उसकी पत्नी — बुद्धिमती स्त्री जो थी — ने तुरन्त कहा: "हमें आज ही यह व्रत करना चाहिए। हमारे पास थोड़ा आटा है, गुड़ का एक छोटा टुकड़ा है, और पड़ोसन ने जो घी दिया था वह है। यही पर्याप्त है।"

और इस प्रकार उस निर्धन ब्राह्मण ने कांपते हाथों और आशा से भरे हृदय से एक सरल वेदी सजाई। उसने भगवान विष्णु की एक छोटी पीतल की मूर्ति रखी जो पीढ़ियों से उसके परिवार में थी — धूमिल और दंतहीन, किन्तु पवित्र। उसकी पत्नी ने प्रसाद बनाया: गेहूं के आटे, गुड़, और उनके अन्तिम बूंदों के घी का सादा शीरा। फूल नहीं थे, तो उन्होंने दरवाजे पर उगे तुलसी के पत्ते अर्पित किये। अगरबत्ती नहीं थी, तो उन्होंने सूखे गोबर का छोटा टुकड़ा कपूर के साथ जलाया। बच्चे गोल घेरे में बैठे, उनकी आंखें इस अनुष्ठान को देखकर विस्मय से चौड़ी थीं जो उन्होंने पहले कभी नहीं देखा था।

ब्राह्मण ने कथा कण्ठस्थ सुनाई — क्योंकि उसने बहुत पहले अपने गुरु से एक बार सुनी थी — और प्रत्येक अनुच्छेद पर उसकी वाणी भावुकता से भर्रा जाती। जब वह उस श्लोक पर पहुंचा जहां भगवान विष्णु कहते हैं "यह व्रत सबके लिए है," तो वह खुलकर रो पड़ा, क्योंकि उसने विश्वास कर लिया था कि उसकी निर्धनता ने हर द्वार बन्द कर दिया है।

उसी सन्ध्या, जब प्रसाद वितरित हो गया और पड़ोसी जा चुके, एक चमत्कार हुआ। एक धनी व्यापारी जो काशी से गुजर रहा था, रास्ता भटककर ब्राह्मण के द्वार पर आ पहुंचा। पूजा के अवशेष देखकर व्यापारी का हृदय द्रवित हुआ। उसने कहा: "मैं अपनी पुत्री के विवाह संस्कार के लिए एक विद्वान ब्राह्मण खोज रहा हूं। तुम्हारी भक्ति बताती है कि तुम वही हो।" उसने ब्राह्मण को उदार अग्रिम राशि दी — इतना धन जितना उस परिवार ने वर्षों में नहीं देखा था।

उस दिन से ब्राह्मण का भाग्य पलट गया। विद्यार्थी उसके पास शिक्षा के लिए आने लगे, परिवार उसे संस्कारों के लिए बुलाने लगे, और सच्चे भक्त के रूप में उसकी ख्याति पूरी काशी में फैल गई। किन्तु ब्राह्मण ने कभी अपने आशीर्वाद का स्रोत नहीं भुलाया। प्रत्येक पूर्णिमा को, बिना एक भी चूक, वह सत्यनारायण पूजा करता। चाहे बहुत हो या थोड़ा, पूजा कभी नहीं छोड़ी। वह अपनी पत्नी से कहता: "यह हमारा धन नहीं है। यह भगवान का प्रसाद है जो हमारे हाथों से बह रहा है। जिस क्षण हम धन्यवाद देना बन्द करेंगे, यह कहीं और बह जायेगा।"

उसकी पत्नी मुस्कुराती और कहती: "तो हम कभी बन्द नहीं करेंगे।"

और उन्होंने कभी नहीं किया। अपने शेष दीर्घ और समृद्ध जीवन में, ब्राह्मण और उसकी पत्नी ने प्रत्येक पूर्णिमा को सत्यनारायण व्रत किया, और उनका घर पूरी काशी में ऐसे स्थान के रूप में जाना गया जहां कोई अतिथि कभी लौटाया नहीं गया और कोई भूखा कभी बिना खाये नहीं गया।

इति द्वितीय अध्याय सम्पूर्ण। शिक्षा स्पष्ट है: निर्धन से निर्धन भक्त भी, केवल श्रद्धा और शुद्ध हृदय से, सत्यनारायण की कृपा का आह्वान कर सकता है। भगवान अर्पण का मूल्य नहीं तौलते — वे उसके पीछे की भक्ति तौलते हैं।`,
        },
      },
      // ── Chapter 3: The Woodcutter & Merchant Sadhu ──
      {
        number: 3,
        title: {
          en: 'The Woodcutter Lakshita and the Merchant Sadhu\'s Vow',
          hi: 'तृतीय अध्याय — लकड़हारा लक्षित और व्यापारी साधु का संकल्प',
        },
        content: {
          en: `In the same city of Kashi, there lived a poor woodcutter named Lakshita. Every day he would walk deep into the forest, chop wood from dawn until his arms ached, carry the heavy bundle on his head to the market, and sell it for a few coins — barely enough to feed his family. His hands were calloused, his back was bent, and his face was weathered beyond his years. Yet he was a man of good heart who never cursed his lot.

One evening, returning from the forest with his bundle of wood, Lakshita passed by the Brahmin's house. Through the open door, he saw something that stopped him in his tracks: the Brahmin, whom he remembered as the poorest man in the neighbourhood, was seated before a beautiful altar, surrounded by family and neighbours, reciting a katha with a voice full of joy. The house, which had once been bare and crumbling, was now clean and well-maintained. The children, once thin and ragged, were healthy and well-dressed. The fragrance of sheera prasad filled the air.

Lakshita set down his bundle and stood at the doorway, listening. When the katha was complete and the prasad was distributed, the Brahmin noticed him and invited him in. "Come, brother, eat this prasad. It is Lord Satyanarayan's blessing."

Lakshita ate the sweet sheera and felt a warmth spread through his tired body. "Pandit ji," he asked, "what is this puja that has transformed your life so? I remember when you had nothing."

The Brahmin smiled and told him everything — Narada's teaching, the dream, the simple vrat, and the miraculous change. "This vrat requires no wealth, Lakshita. Your devotion is all the Lord asks for."

That very night, Lakshita told his wife about the Satyanarayan Vrat. She was overjoyed. "We have flour and jaggery," she said. "What more does the Lord need?" The next Purnima, the woodcutter and his wife performed the vrat with complete devotion. They had no brass idol, so they drew the image of Lord Vishnu on a clay tablet with turmeric paste. They had no proper kalash, so they used their water pot with fresh leaves from the forest.

The sincerity of their worship moved the heavens. Within days, Lakshita found a grove of premium sandalwood trees deep in the forest — trees that other woodcutters had somehow missed for years. The sandalwood fetched a hundred times the price of ordinary wood. Within months, Lakshita had saved enough to buy his own small plot of forest land. Within a year, he had become a respected timber merchant, employing other woodcutters and ensuring they were paid fairly.

Like the Brahmin, Lakshita never forgot the source of his good fortune. Every Purnima, his family performed the Satyanarayan Puja, and he always invited his workers and their families to share in the prasad.

Now hear, O sages, the contrasting tale of the merchant Sadhu.

In the prosperous trading city of Ratnapur, there lived a wealthy merchant named Sadhu. Despite his name, which means "virtuous," Sadhu was a man consumed by worldly ambition. He had warehouses full of silks and spices, ships that sailed to distant lands, and a mansion with marble floors. But for all his wealth, he had one great sorrow: he had no children.

Sadhu and his wife Lilavati had prayed at every temple, consulted every astrologer, and performed every prescribed remedy. Nothing worked. One day, a wandering sadhu — who was none other than Narada in disguise — came to Sadhu's door. After receiving generous hospitality, the sadhu told him: "O merchant, your suffering has a remedy. Perform the Satyanarayan Vrat with true devotion, and the Lord will bless you with a child."

Sadhu, desperate, immediately agreed. But more than that — he made a solemn vow. Falling at the sadhu's feet, he declared: "If Lord Satyanarayan blesses me with a child, I will perform the most magnificent Satyanarayan Puja this city has ever seen! I will feed a thousand Brahmins, distribute gold coins, and sing the Lord's glory for seven days!"

The sadhu smiled and departed. Within the year, Lilavati gave birth to a beautiful daughter. They named her Kalavati, and the entire household rejoiced.

But as the months passed and the joy of the new baby consumed their attention, Sadhu forgot his vow. His wife reminded him once: "My lord, you promised to perform the Satyanarayan Puja." Sadhu waved his hand dismissively: "Yes, yes, I will do it. But first let the child grow a little. There is time."

Years passed. Kalavati grew into a beautiful and virtuous young woman. When it came time for her marriage, Sadhu found a worthy groom — a young merchant's son of good family. Once again, someone reminded him of his vow. "After the wedding," Sadhu said. "I will perform the grandest puja after my daughter's wedding. It will be even more magnificent."

The wedding was celebrated with great pomp. But again, the puja was not performed. The Lord, who is patient but just, who gives every chance but also teaches necessary lessons, observed all of this. And he decided that the merchant Sadhu needed to learn, through experience, the weight of a broken vow.

Thus ends the third chapter. The lesson: the Lord's blessings must be received with gratitude and returned with devotion. A vow made to Satyanarayan is not a transaction to be forgotten when the goods are delivered — it is a sacred promise, and breaking it invites consequences that only sincere repentance can undo.`,
          hi: `उसी काशी नगरी में लक्षित नाम का एक निर्धन लकड़हारा रहता था। प्रतिदिन वह घने जंगल में जाता, प्रातः से लेकर बांहों में दर्द होने तक लकड़ी काटता, भारी गट्ठर सिर पर लादकर बाज़ार ले जाता, और कुछ सिक्कों में बेचता — बस इतने कि परिवार का पेट भर सके। उसके हाथ कठोर हो गये थे, पीठ झुक गयी थी, और चेहरे पर उम्र से अधिक झुर्रियां थीं। फिर भी वह भले हृदय का व्यक्ति था जिसने कभी अपने भाग्य को कोसा नहीं।

एक सन्ध्या, जंगल से लकड़ी का गट्ठर लेकर लौटते हुए, लक्षित ब्राह्मण के घर के सामने से गुजरा। खुले द्वार से उसने वह दृश्य देखा जिसने उसे ठिठका दिया: वही ब्राह्मण, जिसे वह मोहल्ले का सबसे निर्धन व्यक्ति जानता था, एक सुन्दर वेदी के सामने बैठा था, परिवार और पड़ोसियों से घिरा हुआ, आनन्दपूर्ण स्वर में कथा सुना रहा था। वह घर, जो कभी खाली और जीर्ण था, अब स्वच्छ और सुव्यवस्थित था। वे बच्चे, जो कभी दुबले और फटेहाल थे, अब स्वस्थ और सुसज्जित थे। शीरे के प्रसाद की सुगन्ध वातावरण में भरी थी।

लक्षित ने अपना गट्ठर नीचे रखा और दरवाजे पर खड़ा होकर सुनने लगा। जब कथा पूर्ण हुई और प्रसाद वितरित हुआ, ब्राह्मण ने उसे देखा और भीतर बुलाया। "आओ भाई, यह प्रसाद खाओ। यह भगवान सत्यनारायण का आशीर्वाद है।"

लक्षित ने मीठा शीरा खाया और उसके थके शरीर में एक ऊष्मा फैल गयी। "पण्डित जी," उसने पूछा, "यह कौन-सी पूजा है जिसने आपका जीवन ऐसे बदल दिया? मुझे याद है जब आपके पास कुछ नहीं था।"

ब्राह्मण मुस्कुराया और उसे सब बताया — नारद की शिक्षा, स्वप्न, सरल व्रत, और चमत्कारी परिवर्तन। "इस व्रत में कोई धन नहीं चाहिए, लक्षित। भगवान केवल तुम्हारी भक्ति मांगते हैं।"

उसी रात, लक्षित ने अपनी पत्नी को सत्यनारायण व्रत के बारे में बताया। वह अत्यन्त प्रसन्न हुई। "हमारे पास आटा और गुड़ तो है," उसने कहा, "भगवान को और क्या चाहिए?" अगली पूर्णिमा को, लकड़हारे और उसकी पत्नी ने पूर्ण भक्ति से व्रत किया। पीतल की मूर्ति नहीं थी, तो उन्होंने मिट्टी की पटिया पर हल्दी से भगवान विष्णु का चित्र बनाया। कलश नहीं था, तो अपना पानी का घड़ा जंगल के ताज़े पत्तों से सजाकर रख दिया।

उनकी पूजा की सच्चाई ने स्वर्ग को हिला दिया। कुछ ही दिनों में, लक्षित को जंगल की गहराई में उत्कृष्ट चन्दन के वृक्षों का एक कुंज मिला — ऐसे वृक्ष जो वर्षों से अन्य लकड़हारों की दृष्टि से बचे रहे थे। चन्दन की लकड़ी साधारण लकड़ी से सौ गुना अधिक दाम पर बिकी। कुछ ही महीनों में, लक्षित ने अपनी स्वयं की छोटी वन भूमि खरीदने के लिए पर्याप्त धन बचा लिया। एक वर्ष के भीतर, वह एक सम्मानित काष्ठ व्यापारी बन गया, अन्य लकड़हारों को रोज़गार देता और उन्हें उचित वेतन सुनिश्चित करता।

ब्राह्मण की भांति, लक्षित ने कभी अपने सौभाग्य का स्रोत नहीं भुलाया। प्रत्येक पूर्णिमा को उसका परिवार सत्यनारायण पूजा करता, और वह सदा अपने कर्मचारियों और उनके परिवारों को प्रसाद बांटने के लिए बुलाता।

अब सुनिये, हे मुनिवरों, व्यापारी साधु की विपरीत कथा।

समृद्ध व्यापारिक नगर रत्नपुर में साधु नाम का एक धनी व्यापारी रहता था। अपने नाम के बावजूद — जिसका अर्थ "सदाचारी" है — साधु सांसारिक महत्वाकांक्षा में डूबा व्यक्ति था। उसके गोदामों में रेशम और मसाले भरे थे, उसके जहाज दूर देशों तक जाते थे, और संगमरमर के फर्श वाली हवेली थी। किन्तु इतनी सम्पत्ति के बावजूद उसे एक महान दुःख था: उसकी कोई सन्तान नहीं थी।

साधु और उसकी पत्नी लीलावती ने हर मन्दिर में प्रार्थना की, हर ज्योतिषी से परामर्श किया, और हर निर्धारित उपाय किया। कुछ भी कारगर नहीं हुआ। एक दिन, एक परिव्राजक साधु — जो कोई और नहीं, भेष बदले नारद थे — साधु के द्वार पर आये। उदार आतिथ्य प्राप्त करने के बाद, साधु ने उससे कहा: "हे व्यापारी, तुम्हारे दुःख का उपाय है। सच्ची भक्ति से सत्यनारायण व्रत करो, और भगवान तुम्हें सन्तान का आशीर्वाद देंगे।"

साधु ने, बेचैन होकर, तुरन्त स्वीकार किया। बल्कि उससे भी अधिक — उसने एक गम्भीर संकल्प किया। साधु के चरणों में गिरकर उसने घोषणा की: "यदि भगवान सत्यनारायण मुझे सन्तान का आशीर्वाद देंगे, तो मैं इस नगर की सबसे भव्य सत्यनारायण पूजा करूंगा! एक सहस्र ब्राह्मणों को भोजन कराऊंगा, स्वर्ण मुद्राएं वितरित करूंगा, और सात दिन भगवान का यशोगान करूंगा!"

साधु मुस्कुराये और चले गये। वर्ष भर में, लीलावती ने एक सुन्दर कन्या को जन्म दिया। उन्होंने उसका नाम कलावती रखा, और सम्पूर्ण घर में आनन्द छा गया।

किन्तु जैसे-जैसे महीने बीते और नवजात शिशु के आनन्द में वे डूबे रहे, साधु अपना संकल्प भूल गया। उसकी पत्नी ने एक बार याद दिलाया: "स्वामी, आपने सत्यनारायण पूजा करने का वचन दिया था।" साधु ने हाथ हिलाकर टाल दिया: "हां, हां, करूंगा। पहले बच्ची को थोड़ा बड़ा हो लेने दो। समय तो है।"

वर्ष बीतते गये। कलावती एक सुन्दर और गुणवती युवती बन गयी। जब उसके विवाह का समय आया, साधु ने एक योग्य वर ढूंढा — एक अच्छे परिवार के युवा व्यापारी का पुत्र। फिर किसी ने उसे संकल्प याद दिलाया। "विवाह के बाद," साधु ने कहा। "मैं अपनी पुत्री के विवाह के बाद सबसे भव्य पूजा करूंगा। और भी अधिक विशाल होगी।"

विवाह बड़ी धूमधाम से सम्पन्न हुआ। किन्तु फिर भी पूजा नहीं हुई। भगवान, जो धैर्यवान हैं किन्तु न्यायी भी, जो हर अवसर देते हैं किन्तु आवश्यक शिक्षा भी देते हैं, यह सब देख रहे थे। और उन्होंने निश्चय किया कि व्यापारी साधु को अनुभव से सीखना होगा कि टूटे हुए संकल्प का भार कितना होता है।

इति तृतीय अध्याय सम्पूर्ण। शिक्षा यह है: भगवान के आशीर्वाद कृतज्ञता से ग्रहण किये जायें और भक्ति से लौटाये जायें। सत्यनारायण से किया गया संकल्प कोई सौदा नहीं है जिसे वस्तु मिलने पर भुला दिया जाये — यह एक पवित्र वचन है, और इसे तोड़ने के परिणाम केवल सच्चे पश्चाताप से ही मिट सकते हैं।`,
        },
      },
      // ── Chapter 4: King Ulkamukha & Sadhu's Troubles ──
      {
        number: 4,
        title: {
          en: 'King Ulkamukha and the Merchant\'s Downfall',
          hi: 'चतुर्थ अध्याय — राजा उल्कामुख और व्यापारी का पतन',
        },
        content: {
          en: `Now hear, O sages, of the consequences that befell the merchant Sadhu for his broken vow, and of the righteous King Ulkamukha whose devotion stood in sharp contrast.

In a kingdom by the banks of a great river, there ruled a just and devout king named Ulkamukha — also known as Tungadhwaj in some tellings. King Ulkamukha was beloved by his people, for he ruled with dharma, settled disputes with fairness, and never taxed the poor beyond their means. His queen, Chandravati, was equally devoted — she spent her mornings in prayer and her afternoons tending to the sick and the elderly in the royal hospitals.

One afternoon, King Ulkamukha and Queen Chandravati were seated on the banks of the river, performing the Satyanarayan Puja. The altar was set on the sandy shore, the kalash gleaming in the sunlight, the fragrance of incense mingling with the river breeze. The royal priest was reciting the katha, and the king and queen listened with folded hands and closed eyes, their hearts absorbed in devotion.

At that very moment, a magnificent merchant vessel appeared on the river. It was Sadhu's ship, returning from a profitable voyage to distant lands. The ship was laden with treasure — bolts of the finest silk, sacks of black pepper and cardamom, chests of precious gems, bars of silver, and jars of rare perfumes. Sadhu stood at the bow, surveying his wealth with satisfaction.

As the ship drew near the shore, Sadhu saw the royal puja. The king's guards hailed the ship: "What vessel is this, and what cargo does it carry?"

Now, a strange impulse seized the merchant. Perhaps it was arrogance — the pride of a self-made man who believed his wealth was entirely his own doing. Perhaps it was miserliness — the fear that the king would demand a tithe of his goods. Or perhaps it was the working of the Lord's maya, designed to bring the consequences of his broken vow to their inevitable conclusion.

Whatever the reason, Sadhu cupped his hands to his mouth and shouted back: "This is a humble trading vessel! It carries nothing of value — just dried leaves and hay for cattle feed!"

King Ulkamukha, absorbed in his puja, merely nodded and returned to his worship. But the Lord of Truth — Satyanarayan himself — heard the lie. And by his divine will, a transformation occurred that made every sailor on the ship cry out in horror.

The silks turned to dried leaves. The spices turned to dust. The gems became pebbles. The silver bars became logs of worthless wood. The perfumes turned to stagnant water. Every last item of treasure on the ship became exactly what Sadhu had claimed — leaves and hay. The magnificent cargo hold now looked like a barn.

Sadhu fell to his knees, clutching his head. "What sorcery is this?" he screamed. But deep in his heart, he knew. The old sadhu's words echoed in his memory. The forgotten vow. The neglected promise. The Lord had given him a child, and he had not given the Lord even a single puja in return.

But Sadhu's troubles were only beginning. When the ship docked and the customs officers inspected it, they found no recorded cargo — only leaves and hay. "This man is clearly a smuggler," they declared. "He has hidden his goods somewhere or sold them illegally abroad." Sadhu was arrested, clapped in chains, and thrown into the royal dungeon.

His son-in-law, the young merchant who had married Kalavati, had been travelling with him on the ship to learn the trade. He too was arrested as an accomplice. The young man, bewildered and terrified, was dragged away to a separate cell.

News reached Ratnapur that the merchant Sadhu had been imprisoned. His wife Lilavati collapsed in shock. His daughter Kalavati wept day and night. The servants fled. The creditors circled. The grand mansion, once the pride of the city, stood silent and dark.

Meanwhile, in the dungeon, Sadhu sat on the cold stone floor. For the first time in his life, he had nothing — no silk, no spice, no silver, no pride. And in that empty darkness, stripped of everything he had valued, he finally remembered.

"O Satyanarayan," he whispered, his voice cracked and broken. "I made you a vow. I promised you the grandest puja. You gave me everything I asked for, and I gave you nothing in return. Forgive me, O Lord. If you free me from this darkness, I will perform your puja before I draw another breath of free air."

But the dungeon walls gave no answer. The Lord's lesson was not yet complete.

Thus ends the fourth chapter. The lesson: arrogance and ingratitude are the enemies of prosperity. The Lord gives freely, but he also teaches that every blessing received is a blessing that must be acknowledged. A lie spoken in the presence of Truth will transform reality itself — for Satyanarayan is the Lord of Truth, and no falsehood can stand in his light.`,
          hi: `अब सुनिये, हे मुनिवरों, व्यापारी साधु पर उसके टूटे संकल्प के क्या परिणाम हुए, और धर्मात्मा राजा उल्कामुख की भक्ति कैसे इसके विपरीत थी।

एक महानदी के तट पर एक राज्य था, जहां उल्कामुख नाम के न्यायी और भक्त राजा शासन करते थे — जिन्हें कुछ कथाओं में तुंगध्वज भी कहा जाता है। राजा उल्कामुख प्रजा में अत्यन्त प्रिय थे, क्योंकि वे धर्म से शासन करते, विवादों का न्यायपूर्ण समाधान करते, और निर्धनों पर उनकी सामर्थ्य से अधिक कर कभी नहीं लगाते। उनकी रानी चन्द्रावती भी उतनी ही भक्त थीं — वे प्रातः प्रार्थना में और दोपहर राजकीय चिकित्सालयों में रोगियों और वृद्धों की सेवा में बिताती थीं।

एक दोपहर, राजा उल्कामुख और रानी चन्द्रावती नदी के तट पर बैठे सत्यनारायण पूजा कर रहे थे। बालू के तट पर वेदी सजी थी, कलश सूर्य की किरणों में चमक रहा था, अगरबत्ती की सुगन्ध नदी की हवा में घुल रही थी। राजपुरोहित कथा पाठ कर रहे थे, और राजा-रानी हाथ जोड़े, नेत्र बन्द किये, भक्ति में लीन होकर सुन रहे थे।

ठीक उसी समय, एक भव्य व्यापारिक जहाज नदी पर दिखाई दिया। यह साधु का जहाज था, जो दूर देशों की लाभदायक यात्रा से लौट रहा था। जहाज खजाने से लदा था — उत्कृष्ट रेशम के थान, काली मिर्च और इलायची की बोरियां, बहुमूल्य रत्नों के सन्दूक, चांदी की ईंटें, और दुर्लभ इत्रों के पात्र। साधु जहाज के अगले भाग में खड़ा, सन्तोष से अपनी सम्पत्ति का निरीक्षण कर रहा था।

जैसे ही जहाज तट के समीप आया, साधु ने राजकीय पूजा देखी। राजा के सैनिकों ने जहाज को पुकारा: "यह किसका जहाज है, और इसमें क्या माल है?"

अब व्यापारी पर एक विचित्र प्रेरणा ने अधिकार कर लिया। शायद यह अहंकार था — स्वनिर्मित धनी व्यक्ति का गर्व जो मानता था कि उसकी सम्पत्ति पूर्णतः उसकी अपनी करनी है। शायद कंजूसी थी — यह भय कि राजा उसके माल का दशमांश मांगेगा। या शायद यह भगवान की माया का कार्य था, जो उसके टूटे संकल्प के परिणामों को उनके अनिवार्य निष्कर्ष तक पहुंचाने के लिए बनाई गयी थी।

कारण जो भी हो, साधु ने हाथों का कटोरा बनाकर चिल्लाया: "यह एक साधारण व्यापारिक नौका है! इसमें कुछ मूल्यवान नहीं — बस सूखे पत्ते और पशुचारे का भूसा है!"

राजा उल्कामुख, अपनी पूजा में लीन, ने बस सिर हिलाया और पुनः अपने अनुष्ठान में लौट गये। किन्तु सत्य के स्वामी — स्वयं सत्यनारायण भगवान — ने वह असत्य सुना। और उनकी दिव्य इच्छा से एक ऐसा रूपान्तरण हुआ जिसे देखकर जहाज के प्रत्येक नाविक ने भय से चीख मारी।

रेशम सूखे पत्तों में बदल गया। मसाले धूल बन गये। रत्न कंकड़ बन गये। चांदी की ईंटें बेकार लकड़ी के लट्ठे बन गयीं। इत्र सड़ा हुआ जल बन गया। जहाज पर खजाने की प्रत्येक अन्तिम वस्तु ठीक वही बन गयी जो साधु ने कहा था — पत्ते और भूसा। भव्य माल-कक्ष अब एक ढोर-बाड़े जैसा दिख रहा था।

साधु घुटनों पर गिर पड़ा, सिर पकड़कर। "यह कैसा जादू है?" वह चीखा। किन्तु अपने हृदय की गहराई में वह जानता था। उस वृद्ध साधु के शब्द उसकी स्मृति में गूंज रहे थे। भूला हुआ संकल्प। उपेक्षित वचन। भगवान ने उसे सन्तान दी, और उसने भगवान को बदले में एक पूजा भी नहीं दी।

किन्तु साधु की विपत्तियां तो अभी शुरू ही हुई थीं। जब जहाज लंगर डाला गया और शुल्क अधिकारियों ने निरीक्षण किया, तो कोई पंजीकृत माल नहीं मिला — बस पत्ते और भूसा। "यह व्यक्ति स्पष्ट रूप से तस्कर है," उन्होंने घोषणा की। "इसने अपना माल कहीं छिपाया है या विदेश में अवैध रूप से बेचा है।" साधु को गिरफ्तार किया गया, बेड़ियां डाली गयीं, और राजकीय कारागार में फेंक दिया गया।

उसका दामाद, वह युवा व्यापारी जिसने कलावती से विवाह किया था, व्यापार सीखने के लिए उसके साथ जहाज पर यात्रा कर रहा था। उसे भी सहअपराधी के रूप में गिरफ्तार किया गया। वह युवक, भौचक्का और भयभीत, एक अलग कोठरी में घसीट ले जाया गया।

रत्नपुर में समाचार पहुंचा कि व्यापारी साधु को कारागार में डाल दिया गया है। उसकी पत्नी लीलावती सदमे से गिर पड़ी। उसकी पुत्री कलावती दिन-रात रोती रही। नौकर भाग गये। लेनदार घेराबन्दी करने लगे। वह भव्य हवेली, जो कभी नगर का गौरव थी, सूनी और अंधेरी खड़ी रही।

इधर, कारागार में, साधु ठण्डे पत्थर के फर्श पर बैठा था। जीवन में पहली बार, उसके पास कुछ नहीं था — न रेशम, न मसाले, न चांदी, न गर्व। और उस रिक्त अंधकार में, जिसने उसे उसकी हर मूल्यवान वस्तु से वंचित कर दिया था, उसे अन्ततः याद आया।

"हे सत्यनारायण," उसने फुसफुसाया, उसकी वाणी फटी और टूटी हुई। "मैंने आपसे संकल्प किया था। मैंने सबसे भव्य पूजा का वचन दिया था। आपने मुझे वह सब दिया जो मैंने मांगा, और मैंने बदले में कुछ नहीं दिया। क्षमा करें, हे प्रभु। यदि आप मुझे इस अंधकार से मुक्त करें, तो मुक्त वायु का एक और श्वास लेने से पहले मैं आपकी पूजा करूंगा।"

किन्तु कारागार की दीवारों ने कोई उत्तर नहीं दिया। भगवान की शिक्षा अभी पूर्ण नहीं हुई थी।

इति चतुर्थ अध्याय सम्पूर्ण। शिक्षा यह है: अहंकार और कृतघ्नता समृद्धि के शत्रु हैं। भगवान उदारता से देते हैं, किन्तु वे यह भी सिखाते हैं कि प्रत्येक प्राप्त आशीर्वाद एक ऐसा आशीर्वाद है जिसे स्वीकार किया जाना चाहिए। सत्य की उपस्थिति में बोला गया असत्य स्वयं यथार्थ को रूपान्तरित कर देगा — क्योंकि सत्यनारायण सत्य के स्वामी हैं, और कोई मिथ्या उनके प्रकाश में टिक नहीं सकती।`,
        },
      },
      // ── Chapter 5: Kalavati's Devotion & Restoration ──
      {
        number: 5,
        title: {
          en: 'Kalavati\'s Devotion and the Power of Prasad',
          hi: 'पंचम अध्याय — कलावती की भक्ति और प्रसाद की महिमा',
        },
        content: {
          en: `The final chapter, O sages, tells of how the Lord's grace was restored through the pure devotion of women — and of the supreme importance of honouring the prasad.

When news of Sadhu's imprisonment reached his home in Ratnapur, his wife Lilavati and daughter Kalavati were plunged into an ocean of grief. The creditors had seized the mansion. The family was forced to move into a small rented room. Kalavati, who had grown up in luxury and married into prosperity, now found herself a pauper, her husband in a distant dungeon, her father in chains.

But Kalavati was her father's daughter in name only — in spirit, she was made of far stronger stuff. Where Sadhu had been consumed by pride and forgetfulness, Kalavati carried within her a deep and genuine devotion to the divine. Even in her darkest hour, she did not curse God. She did not blame fate. She asked only one question: "What can I do?"

It was a neighbouring woman, an old widow who had known the family in better days, who gave her the answer. "Child," said the old woman, "I have heard of the Satyanarayan Vrat. It is said that this vrat can reverse the most terrible misfortunes. It requires nothing but a sincere heart. Why don't you try?"

Kalavati and her mother Lilavati looked at each other. In that look was an entire conversation — grief, hope, determination, and faith. Lilavati said: "We have nothing left. But we have flour, and the neighbour has offered us ghee. We have our devotion. Let us begin."

That very evening, in their tiny rented room, the two women performed the Satyanarayan Puja. They had no priest — Lilavati recited the katha from her own memory, for she had heard it many times in her youth. They had no proper altar — they spread a clean cloth on the floor and placed a small picture of Lord Vishnu that Kalavati had saved from the creditors by hiding it in her blouse. The prasad was the simplest possible — a small ball of sheera made from a handful of wheat flour, a spoonful of sugar, and a few drops of ghee.

But the devotion with which they performed that puja was unlike anything the heavens had witnessed. Kalavati wept through every chapter, not from self-pity, but from a genuine outpouring of love for the Lord. She did not pray: "Give me back my wealth." She prayed: "O Satyanarayan, forgive my father. He is not a bad man — only a forgetful one. Show him the way back to you."

Lilavati, the elder, prayed with the quiet strength of a woman who had endured much: "Lord, I do not ask that you restore what we have lost. I ask only that you free my husband and my son-in-law from their suffering. Whatever you decide is just."

The sincerity of their worship pierced through all the worlds and reached Vaikuntha itself. Lord Satyanarayan, seated on his eternal throne, smiled. "Now," he said to no one in particular — for in Vaikuntha, every thought is heard — "now the lesson is complete."

That very night, in the royal dungeon, Sadhu had a dream. The same old Brahmin who had appeared to him years ago stood before him. But this time, the sadhu's expression was not kind — it was stern. "Sadhu," the old Brahmin said, "you made a vow to the Lord of Truth and broke it. Do you understand now the weight of a promise?"

"I understand," Sadhu wept. "I was a fool. I let my wealth blind me to my obligations. The Lord gave me a daughter, and I gave him nothing."

"Your daughter," said the old Brahmin, his expression softening, "has given what you could not. She and your wife have performed the puja in your name, with nothing but flour and faith. The Lord is pleased. You will be freed — but remember: never again make a vow you do not intend to keep."

The next morning, King Ulkamukha received a divine message in his own meditation. The Lord told him: "The merchant in your dungeon is not a criminal. He is a devotee who lost his way. Release him, and restore his goods."

The king, a righteous man who obeyed dharma above all, immediately ordered Sadhu's release. When the merchant stepped out of the dungeon into the sunlight, he fell to his knees and wept. His son-in-law was also freed. And when they returned to the ship — the cargo hold was once again full of silk, spices, gems, and silver. The leaves and hay had vanished.

Sadhu sailed home to Ratnapur as fast as the winds would carry him. His first act upon setting foot on land was not to check his warehouses or count his profits. He walked straight to the small rented room where his wife and daughter were living, fell at their feet, and said: "You saved me. Your devotion saved me."

And then, before even unpacking his ship, Sadhu performed the Satyanarayan Puja. Not a grand affair with a thousand Brahmins — but a simple, heartfelt puja with his family. The prasad was sheera, and every person present ate it with reverence.

But the story is not quite complete. When the son-in-law was sailing the ship back to Ratnapur, the Lord tested him one final time. The young man, exhausted from his ordeal in the dungeon and eager to reach home, was offered prasad from a Satyanarayan Puja being performed by sailors on a passing vessel. In his haste and irritation, he waved it away. "I have no time for this," he said. "We need to reach port."

The moment the words left his lips, the ship lurched violently. A sudden storm appeared from a clear sky. The mast cracked. Water poured in from every seam. The sailors screamed that they were sinking.

The son-in-law, remembering everything that had happened, fell to his knees on the heaving deck. "O Satyanarayan, forgive me! I did not mean to disrespect your prasad! I accept it — I accept it with all my heart!" A sailor brought the prasad bowl to him, and he ate it with trembling hands and genuine devotion.

Instantly, the storm ceased. The sky cleared. The mast repaired itself. The ship sailed smoothly into Ratnapur harbour as though nothing had happened.

From that day forward, the entire family — Sadhu, Lilavati, Kalavati, and the son-in-law — performed the Satyanarayan Puja on every Purnima without fail. And they taught their children, and their children's children, the one lesson that the Lord had taught them through joy and sorrow alike: Never make a vow you will not keep. Never disrespect the prasad. And never, ever forget that every blessing in your life flows from the grace of Satyanarayan.

Thus ends the fifth and final chapter of the Satyanarayan Katha. Whoever listens to this katha with devotion, distributes the prasad with an open heart, and honours their vows shall be blessed with prosperity, peace, and liberation. Om Namo Bhagavate Vasudevaya.

॥ इति श्री सत्यनारायण कथा सम्पूर्ण ॥`,
          hi: `अन्तिम अध्याय, हे मुनिवरों, यह बताता है कि कैसे स्त्रियों की शुद्ध भक्ति से भगवान की कृपा पुनः प्राप्त हुई — और प्रसाद के सम्मान का सर्वोच्च महत्व क्या है।

जब साधु के कारावास का समाचार रत्नपुर में उसके घर पहुंचा, तो उसकी पत्नी लीलावती और पुत्री कलावती शोक-सागर में डूब गयीं। लेनदारों ने हवेली पर अधिकार कर लिया। परिवार को एक छोटे किराये के कमरे में जाना पड़ा। कलावती, जो विलासिता में पली-बढ़ी थी और समृद्धि में ब्याही थी, अब स्वयं को निर्धन पाती थी — पति दूर के कारागार में, पिता बेड़ियों में।

किन्तु कलावती अपने पिता की पुत्री केवल नाम से थी — आत्मा से वह कहीं अधिक दृढ़ स्वभाव की थी। जहां साधु अहंकार और विस्मरण में डूबा रहा, कलावती के भीतर ईश्वर के प्रति गहरी और सच्ची भक्ति थी। अपनी सबसे अंधेरी घड़ी में भी, उसने ईश्वर को कोसा नहीं। भाग्य को दोष नहीं दिया। उसने केवल एक प्रश्न पूछा: "मैं क्या कर सकती हूं?"

एक पड़ोसन, एक वृद्ध विधवा जो परिवार को अच्छे दिनों से जानती थी, ने उसे उत्तर दिया। "बेटी," वृद्ध स्त्री ने कहा, "मैंने सत्यनारायण व्रत के बारे में सुना है। कहते हैं यह व्रत भयंकर से भयंकर दुर्भाग्य को भी पलट सकता है। इसमें सच्चे हृदय के अतिरिक्त कुछ नहीं चाहिए। तुम क्यों नहीं करके देखती?"

कलावती और उसकी माता लीलावती ने एक-दूसरे को देखा। उस एक दृष्टि में सम्पूर्ण संवाद था — शोक, आशा, दृढ़ संकल्प, और श्रद्धा। लीलावती ने कहा: "हमारे पास कुछ नहीं बचा। किन्तु आटा है, और पड़ोसन ने घी देने का कहा है। हमारी भक्ति है। चलो शुरू करें।"

उसी सन्ध्या, अपने छोटे से किराये के कमरे में, दोनों स्त्रियों ने सत्यनारायण पूजा की। पुरोहित नहीं था — लीलावती ने अपनी स्मृति से कथा सुनाई, क्योंकि उसने अपनी युवावस्था में कई बार सुनी थी। उचित वेदी नहीं थी — उन्होंने फर्श पर स्वच्छ कपड़ा बिछाया और भगवान विष्णु का एक छोटा चित्र रखा जिसे कलावती ने लेनदारों से बचाकर अपने आंचल में छिपा लिया था। प्रसाद सबसे सरल था — मुट्ठीभर गेहूं के आटे, एक चम्मच चीनी, और कुछ बूंद घी से बना शीरे का छोटा-सा गोला।

किन्तु जिस भक्ति से उन्होंने वह पूजा की, वैसी स्वर्ग ने भी कम ही देखी थी। कलावती प्रत्येक अध्याय में रोती रही — आत्मदया से नहीं, बल्कि भगवान के प्रति प्रेम के सच्चे उद्गार से। उसने यह प्रार्थना नहीं की: "मुझे मेरी सम्पत्ति लौटा दो।" उसने प्रार्थना की: "हे सत्यनारायण, मेरे पिता को क्षमा करो। वे बुरे व्यक्ति नहीं हैं — केवल भुलक्कड़ हैं। उन्हें अपनी ओर लौटने का मार्ग दिखाओ।"

लीलावती ने, जो बड़ी थीं, उस शान्त शक्ति से प्रार्थना की जो बहुत कुछ सहने वाली स्त्री में होती है: "प्रभु, मैं यह नहीं मांगती कि जो खोया है वह लौटाओ। मैं केवल इतना मांगती हूं कि मेरे पति और दामाद को उनके कष्ट से मुक्त करो। आप जो भी निर्णय लें, वही न्याय है।"

उनकी पूजा की सच्चाई ने समस्त लोकों को भेदकर स्वयं वैकुण्ठ तक पहुंची। भगवान सत्यनारायण, अपने शाश्वत सिंहासन पर विराजमान, मुस्कुराये। "अब," उन्होंने कहा — क्योंकि वैकुण्ठ में प्रत्येक विचार सुना जाता है — "अब शिक्षा पूर्ण हुई।"

उसी रात, राजकीय कारागार में, साधु ने एक स्वप्न देखा। वही वृद्ध ब्राह्मण जो वर्षों पहले प्रकट हुए थे, उसके सामने खड़े थे। किन्तु इस बार, साधु का भाव कृपालु नहीं — कठोर था। "साधु," वृद्ध ब्राह्मण ने कहा, "तुमने सत्य के स्वामी से संकल्प किया और तोड़ दिया। क्या अब तुम एक वचन का भार समझते हो?"

"मैं समझता हूं," साधु रो पड़ा। "मैं मूर्ख था। मैंने अपनी सम्पत्ति को अपने कर्तव्यों से आंखें मूंदने दीं। भगवान ने मुझे पुत्री दी, और मैंने उन्हें कुछ नहीं दिया।"

"तुम्हारी पुत्री ने," वृद्ध ब्राह्मण ने कहा, उनका भाव कोमल होते हुए, "वह दिया है जो तुम नहीं दे सके। उसने और तुम्हारी पत्नी ने तुम्हारे नाम से पूजा की है, केवल आटे और श्रद्धा से। भगवान प्रसन्न हैं। तुम मुक्त किये जाओगे — किन्तु स्मरण रहे: फिर कभी ऐसा संकल्प मत करना जो पूरा करने का इरादा न हो।"

अगली प्रातः, राजा उल्कामुख को अपने ध्यान में दिव्य सन्देश प्राप्त हुआ। भगवान ने उनसे कहा: "तुम्हारे कारागार में जो व्यापारी है, वह अपराधी नहीं है। वह एक भक्त है जो मार्ग भटक गया था। उसे मुक्त करो, और उसका माल लौटा दो।"

राजा, जो धर्म को सर्वोपरि मानने वाले सत्यनिष्ठ व्यक्ति थे, ने तुरन्त साधु की रिहाई का आदेश दिया। जब व्यापारी कारागार से बाहर सूर्य के प्रकाश में आया, वह घुटनों पर गिर पड़ा और रो दिया। उसका दामाद भी मुक्त हुआ। और जब वे जहाज पर लौटे — माल-कक्ष फिर से रेशम, मसालों, रत्नों, और चांदी से भरा था। पत्ते और भूसा लुप्त हो गये थे।

साधु ने जितनी तेज़ हवाएं ले जा सकीं, उतनी शीघ्रता से रत्नपुर की ओर प्रस्थान किया। भूमि पर पैर रखते ही उसका पहला कार्य अपने गोदामों की जांच या लाभ गिनना नहीं था। वह सीधे उस छोटे किराये के कमरे में गया जहां उसकी पत्नी और पुत्री रह रही थीं, उनके चरणों में गिरा, और बोला: "तुमने मुझे बचाया। तुम्हारी भक्ति ने मुझे बचाया।"

और फिर, अपने जहाज का माल उतारने से भी पहले, साधु ने सत्यनारायण पूजा की। सहस्र ब्राह्मणों वाला भव्य आयोजन नहीं — बल्कि अपने परिवार के साथ एक सरल, हार्दिक पूजा। प्रसाद शीरा था, और उपस्थित प्रत्येक व्यक्ति ने उसे श्रद्धापूर्वक खाया।

किन्तु कथा अभी पूर्ण नहीं हुई। जब दामाद जहाज लेकर रत्नपुर लौट रहा था, भगवान ने उसकी एक अन्तिम परीक्षा ली। वह युवक, कारागार की यातना से थका हुआ और घर पहुंचने को व्याकुल, एक गुज़रते जहाज पर नाविकों द्वारा की जा रही सत्यनारायण पूजा का प्रसाद दिया गया। अपनी जल्दी और चिड़चिड़ेपन में, उसने हाथ हिलाकर मना कर दिया। "मेरे पास इसके लिए समय नहीं है," उसने कहा। "हमें बन्दरगाह पहुंचना है।"

जिस क्षण ये शब्द उसके मुंह से निकले, जहाज भयंकर रूप से हिला। साफ आकाश से अचानक तूफान उठ खड़ा हुआ। मस्तूल टूट गया। हर जोड़ से पानी भरने लगा। नाविक चीखने लगे कि जहाज डूब रहा है।

दामाद को सब कुछ याद आ गया जो हुआ था। वह हिलते हुए डेक पर घुटनों पर गिर पड़ा। "हे सत्यनारायण, क्षमा करें! मैंने आपके प्रसाद का अनादर नहीं करना चाहा! मैं स्वीकार करता हूं — पूरे हृदय से स्वीकार करता हूं!" एक नाविक प्रसाद का पात्र लेकर आया, और उसने कांपते हाथों और सच्ची भक्ति से खाया।

तत्क्षण, तूफान थम गया। आकाश साफ हो गया। मस्तूल अपने-आप ठीक हो गया। जहाज सहज रूप से रत्नपुर बन्दरगाह में ऐसे पहुंचा जैसे कुछ हुआ ही न हो।

उस दिन से, सम्पूर्ण परिवार — साधु, लीलावती, कलावती, और दामाद — ने प्रत्येक पूर्णिमा को बिना एक भी चूक के सत्यनारायण पूजा की। और उन्होंने अपने बच्चों को, और अपने बच्चों के बच्चों को, वह एक शिक्षा दी जो भगवान ने उन्हें सुख और दुःख दोनों से सिखाई थी: कभी ऐसा संकल्प मत करो जो पूरा न करोगे। कभी प्रसाद का अनादर मत करो। और कभी, कभी मत भूलो कि तुम्हारे जीवन का प्रत्येक आशीर्वाद सत्यनारायण की कृपा से प्रवाहित होता है।

इति पंचम एवं अन्तिम अध्याय सम्पूर्ण। जो कोई इस कथा को भक्तिपूर्वक सुनता है, खुले हृदय से प्रसाद वितरित करता है, और अपने संकल्पों का सम्मान करता है, उसे समृद्धि, शान्ति और मोक्ष का आशीर्वाद प्राप्त होता है। ॐ नमो भगवते वासुदेवाय।

॥ इति श्री सत्यनारायण कथा सम्पूर्ण ॥`,
        },
      },
    ],
    relatedAartis: ['satyanarayan-aarti', 'om-jai-jagdish-hare'],
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

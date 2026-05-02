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
    samagri: {
      en: [
        'Vishnu idol or image',
        'Tulsi leaves',
        'Fresh fruits (banana, apple, pomegranate)',
        'Milk and panchamrit',
        'Fresh flowers (lotus, marigold)',
        'Ghee diya and cotton wicks',
        'Incense sticks and camphor',
      ],
      hi: [
        'विष्णु मूर्ति या चित्र',
        'तुलसी पत्र',
        'ताजे फल (केला, सेब, अनार)',
        'दूध और पंचामृत',
        'ताजे पुष्प (कमल, गेंदा)',
        'घी का दीया और रुई की बत्ती',
        'अगरबत्ती और कपूर',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Origin of Ekadashi — The Slaying of Mura',
          hi: 'प्रथम अध्याय — एकादशी की उत्पत्ति और मुर वध',
        },
        content: {
          en: `In the age when the boundaries between heaven and earth trembled under the weight of darkness, there arose a demon of terrible power named Mura. This asura was no ordinary adversary — he had performed tapasya of such ferocity that Brahma himself was compelled to grant him boons of near-invincibility. With each passing year, Mura's strength grew beyond measure. His roar shook the pillars of Indra's court, and his shadow fell across all three worlds like an eclipse that would not end.

Mura gathered an army of asuras — millions strong, their armour forged in the fires of Patala, their weapons dripping with venom. He marched first upon the minor kingdoms of the devatas, crushing them with contemptuous ease. The Gandharvas fled their celestial gardens. The Apsaras abandoned their lakes of silver. The Yakshas sealed their treasure vaults and hid in the roots of mountains. One by one, the lights of the divine realms were extinguished.

Indra, the king of gods, assembled his forces. The Ashtadikpalas — guardians of the eight directions — stood shoulder to shoulder. Agni blazed forth with walls of flame. Vayu hurled hurricanes that uprooted cosmic trees. Varuna unleashed the waters of seven oceans. Yet Mura walked through fire, wind, and flood as though through morning mist. He seized Indra's thunderbolt and snapped it across his knee. The king of gods fell from his throne, wounded and humiliated.

In desperation, the devas fled to Vaikuntha, the abode of Lord Vishnu. They prostrated themselves at his lotus feet, their crowns rolling in the dust, their voices cracked with fear. "O Narayana!" they cried. "Mura devours the universe! None among us can stand against him. You alone are our refuge."

Lord Vishnu, the preserver of all creation, heard their plea. His eyes, serene as two dark lotuses, narrowed with quiet determination. He lifted his conch Panchajanya and blew a note that echoed through every dimension of existence — a declaration of war. Then, mounting his divine eagle Garuda, Bhagavan flew to meet Mura on the battlefield of Chandravarti.

The battle that followed was unlike any the cosmos had witnessed. Vishnu's Sudarshana Chakra spun through legions of asuras, severing heads and scattering armies. His mace Kaumodaki crushed the war chariots of demon generals. For a thousand celestial years — each year equal to countless mortal lifetimes — Vishnu and Mura fought. The earth quaked. The seas boiled. Stars fell from their courses.

But Mura's boon was powerful beyond reckoning. Each wound Vishnu inflicted healed within moments. Each fallen asura warrior rose again, regenerated by Mura's dark sorcery. The battle had no end, and even the infinite Lord felt the weight of a thousand years of ceaseless combat. His divine body, radiant as molten gold, was streaked with the dust of a thousand battlefields. His arms, which hold the universe in balance, ached with the effort of an unending war.

At last, Lord Vishnu withdrew to a sacred cave called Himavati, nestled in the Badarika hills. He lay down upon the bare stone floor, his four arms folded, and entered a state of divine rest — not sleep as mortals know it, but a yogic withdrawal, a gathering of cosmic energy for the final confrontation.

Mura, drunk on what he perceived as victory, tracked Vishnu to the cave. He entered with his sword raised, his lips curled in a triumphant snarl. "Now," he whispered, "I shall slay Narayana himself, and all creation shall kneel before Mura alone."

But as the demon raised his blade, a miracle occurred. From the body of the resting Lord — from his very essence, from the divine light that sustains all worlds — a radiant feminine form emerged. She was neither goddess nor mortal, but something new — a manifestation of Vishnu's own yogic power, born from the accumulated spiritual energy of eleven tithis. Her form blazed with the light of a thousand suns. Her eyes were steady as the pole star, and in her hands she bore weapons forged from pure consciousness itself.

Mura laughed. "A woman? Vishnu sends a woman to fight me?" But his laughter died in his throat as the divine maiden moved. She was faster than thought, more precise than fate. Her weapons struck Mura's vital points with the knowledge of one who understood every atom of his being. She knew where his boon was strongest and where it had gaps, for she was born from the very force that had granted him power.

In a battle that lasted but moments yet contained the fury of aeons, the divine maiden destroyed Mura. She tore through his defences, shattered his regenerative powers, and with a final blow that resonated across all the worlds, she severed his head from his body. The asura fell, and with him fell the darkness that had engulfed creation. Light returned to the heavens. The devas wept with relief.

When Lord Vishnu rose from his rest, he beheld the maiden standing before the fallen Mura, her radiance undimmed. He smiled — a smile that warmed every frozen star — and spoke: "O divine one, you have accomplished what no other being in creation could. Ask any boon, and it shall be yours."

The maiden bowed and said: "O Lord, I ask only this — that any mortal who fasts and worships you on the tithi from which I was born shall be freed from all sins and attain your eternal grace."

Vishnu was moved beyond measure. "So be it," he declared. "You were born on the eleventh tithi, and from this day you shall be known as Ekadashi. Those who observe your day with fasting and devotion shall be cleansed of sins as terrible as Brahmahatya. Their merit shall equal a thousand Ashvamedha yajnas, and at the end of their days, my own attendants shall carry them to Vaikuntha."

And so it came to pass that Ekadashi was established — not merely as a day of fasting, but as a living gateway between the mortal world and the divine, born from the body of Vishnu himself, sanctified by the blood of a demon, and blessed with the power to liberate any soul who observes it with sincerity.

Thus ends the first chapter. Those who hear this account of Ekadashi's origin with faith shall find the courage to observe the vrat and the assurance that even the greatest obstacles can be overcome by the grace of the Lord.`,
          hi: `उस युग में जब अंधकार के भार से स्वर्ग और पृथ्वी की सीमाएं कांप रही थीं, एक भयंकर शक्तिशाली दैत्य का उदय हुआ जिसका नाम मुर था। यह असुर कोई साधारण शत्रु नहीं था — उसने इतनी प्रचण्ड तपस्या की थी कि स्वयं ब्रह्मा जी को उसे लगभग अजेयता के वरदान देने पड़े। प्रत्येक बीतते वर्ष के साथ, मुर की शक्ति अपरिमित होती गई। उसकी गर्जना से इन्द्र के दरबार के स्तम्भ हिल उठते थे, और उसकी छाया तीनों लोकों पर ऐसे ग्रहण की भांति पड़ी थी जो समाप्त ही न हो।

मुर ने असुरों की सेना एकत्र की — लाखों की संख्या में, पाताल की अग्नि में गढ़े कवचधारी, विष टपकते शस्त्रधारी। उसने पहले देवताओं के छोटे राज्यों पर आक्रमण किया, उन्हें तिरस्कारपूर्ण सहजता से कुचल दिया। गन्धर्व अपने दिव्य उद्यान छोड़कर भागे। अप्सराएं अपनी रजत सरोवरों को त्याग गईं। यक्षों ने अपने खजाने के कोष सील कर पर्वतों की जड़ों में छिप गए। एक-एक करके, दिव्य लोकों के प्रकाश बुझते गए।

इन्द्र, देवताओं के राजा, ने अपनी सेनाएं एकत्र कीं। अष्टदिक्पाल — आठ दिशाओं के रक्षक — कन्धे से कन्धा मिलाकर खड़े हुए। अग्नि ने ज्वाला की दीवारें खड़ी कीं। वायु ने ऐसे तूफान फेंके जिन्होंने ब्रह्माण्डीय वृक्ष उखाड़ दिए। वरुण ने सात समुद्रों का जल उन्मुक्त किया। किन्तु मुर अग्नि, पवन और बाढ़ में से ऐसे गुजरा जैसे प्रातः के कोहरे में से गुजर रहा हो। उसने इन्द्र का वज्र पकड़ा और अपने घुटने पर तोड़ डाला। देवराज अपने सिंहासन से गिरे, घायल और अपमानित।

हताश होकर, देवता वैकुण्ठ भागे — भगवान विष्णु के धाम। उन्होंने उनके चरण-कमलों में साष्टांग प्रणाम किया, उनके मुकुट धूल में लोट रहे थे, उनके स्वर भय से फटे हुए थे। "हे नारायण!" वे चीखे। "मुर ब्रह्माण्ड को निगल रहा है! हममें से कोई उसके सामने खड़ा नहीं हो सकता। केवल आप ही हमारे शरण हैं।"

भगवान विष्णु, समस्त सृष्टि के पालनकर्ता, ने उनकी पुकार सुनी। उनके नेत्र, दो श्याम कमलों की भांति शान्त, शान्त दृढ़ता से संकुचित हुए। उन्होंने अपना शंख पाञ्चजन्य उठाया और ऐसा नाद किया जो अस्तित्व के प्रत्येक आयाम में गूंज उठा — युद्ध की घोषणा। फिर, अपने दिव्य गरुड़ पर आरूढ़ होकर, भगवान चन्द्रावर्ती के रणक्षेत्र में मुर से मिलने चले।

जो युद्ध हुआ वह ब्रह्माण्ड ने ऐसा कभी नहीं देखा था। विष्णु का सुदर्शन चक्र असुरों की टुकड़ियों को चीरता गया, शीश काटता, सेनाएं बिखेरता। उनकी गदा कौमोदकी ने दैत्य सेनापतियों के युद्ध रथ चूर-चूर कर दिए। एक सहस्र दिव्य वर्षों तक — प्रत्येक वर्ष असंख्य मानव जीवनकालों के बराबर — विष्णु और मुर लड़ते रहे। पृथ्वी कांपी। समुद्र उबले। तारे अपने पथ से गिरे।

किन्तु मुर का वरदान अत्यन्त शक्तिशाली था। विष्णु द्वारा लगाया प्रत्येक घाव क्षणों में भर जाता था। प्रत्येक गिरा हुआ असुर योद्धा मुर के काले जादू से पुनर्जीवित होकर उठ खड़ा होता। युद्ध का कोई अन्त नहीं था, और अनन्त भगवान भी एक सहस्र वर्षों के अविराम युद्ध का भार अनुभव कर रहे थे। उनका दिव्य शरीर, पिघले स्वर्ण की भांति दीप्तिमान, सहस्र रणभूमियों की धूल से रेखित था। उनकी भुजाएं, जो ब्रह्माण्ड को सन्तुलन में रखती हैं, अनन्त युद्ध के परिश्रम से थक रही थीं।

अन्ततः, भगवान विष्णु बदरिका पर्वतों में स्थित हिमावती नामक एक पवित्र गुफा में गए। वे नंगे पत्थर के फर्श पर लेट गए, चारों भुजाएं समेटे हुए, और दिव्य विश्राम की अवस्था में प्रवेश किया — यह वैसी निद्रा नहीं जैसी मर्त्य जानते हैं, बल्कि एक योगिक प्रत्याहार, अन्तिम संघर्ष के लिए ब्रह्माण्डीय ऊर्जा का संचय।

मुर, जिसे उसने विजय समझा उसके नशे में धुत्त, विष्णु का पीछा करते हुए गुफा तक पहुंचा। वह उठी हुई तलवार लेकर भीतर आया, उसके होंठ विजयी मुस्कान में मुड़े हुए। "अब," उसने फुसफुसाया, "मैं स्वयं नारायण का वध करूंगा, और समस्त सृष्टि केवल मुर के समक्ष घुटने टेकेगी।"

किन्तु जैसे ही दानव ने अपनी तलवार उठाई, एक चमत्कार हुआ। विश्राम करते भगवान के शरीर से — उनके स्वरूप से, उस दिव्य प्रकाश से जो समस्त लोकों को धारण करता है — एक तेजस्वी स्त्री रूप प्रकट हुआ। वह न देवी थी न मानवी, बल्कि कुछ नवीन — विष्णु की स्वयं की योगशक्ति का प्रकटीकरण, ग्यारह तिथियों की संचित आध्यात्मिक ऊर्जा से जन्मी। उसका स्वरूप सहस्र सूर्यों के प्रकाश से दीप्त था। उसके नेत्र ध्रुव तारे की भांति स्थिर थे, और उसके हाथों में शुद्ध चेतना से गढ़े शस्त्र थे।

मुर हंसा। "एक स्त्री? विष्णु मुझसे लड़ने एक स्त्री भेजता है?" किन्तु उसकी हंसी उसके गले में ही मर गई जब दिव्य कन्या हिली। वह विचार से तेज थी, भाग्य से अधिक सटीक। उसके शस्त्रों ने मुर के मर्मस्थलों पर ऐसे प्रहार किए जैसे उसके अस्तित्व के प्रत्येक अणु का ज्ञान हो। वह जानती थी कि उसका वरदान कहां सबसे शक्तिशाली है और कहां रिक्तियां हैं, क्योंकि वह उसी शक्ति से जन्मी थी जिसने उसे सामर्थ्य प्रदान किया था।

एक युद्ध में जो क्षणों तक चला किन्तु युगों का प्रकोप समेटे था, दिव्य कन्या ने मुर का विनाश किया। उसने उसकी सुरक्षा तोड़ी, उसकी पुनर्जनन शक्ति नष्ट की, और एक अन्तिम प्रहार से जो समस्त लोकों में गूंजा, उसने उसका शीश धड़ से अलग किया। असुर गिरा, और उसके साथ गिरा वह अन्धकार जिसने सृष्टि को घेर रखा था। स्वर्गों में प्रकाश लौट आया। देवताओं ने राहत से अश्रु बहाए।

जब भगवान विष्णु अपने विश्राम से उठे, उन्होंने कन्या को गिरे हुए मुर के सामने खड़ी देखा, उसकी आभा अमलिन। वे मुस्कुराए — एक मुस्कान जिसने प्रत्येक जमे हुए तारे को ऊष्मा दी — और बोले: "हे दिव्य, तुमने वह सम्पन्न किया जो सृष्टि में कोई अन्य प्राणी नहीं कर सका। कोई भी वरदान मांगो, वह तुम्हारा होगा।"

कन्या ने प्रणाम किया और कहा: "हे प्रभु, मैं केवल इतना मांगती हूं — कि जो भी मनुष्य उस तिथि पर उपवास कर आपकी पूजा करे जिससे मेरा जन्म हुआ, वह समस्त पापों से मुक्त हो जाए और आपकी शाश्वत कृपा प्राप्त करे।"

विष्णु अत्यन्त द्रवित हुए। "तथास्तु," उन्होंने घोषणा की। "तुम्हारा जन्म ग्यारहवीं तिथि से हुआ, और आज से तुम एकादशी के नाम से जानी जाओगी। जो तुम्हारे दिन को उपवास और भक्ति से पालन करेंगे, वे ब्रह्महत्या जैसे भयंकर पापों से शुद्ध होंगे। उनका पुण्य सहस्र अश्वमेध यज्ञों के बराबर होगा, और अपने अन्तिम दिनों में, मेरे स्वयं के पार्षद उन्हें वैकुण्ठ ले जाएंगे।"

और इस प्रकार एकादशी की स्थापना हुई — केवल उपवास के दिन के रूप में नहीं, बल्कि मर्त्य संसार और दिव्य लोक के बीच एक जीवित द्वार के रूप में, स्वयं विष्णु के शरीर से जन्मी, एक दानव के रक्त से पवित्र, और किसी भी आत्मा को मुक्त करने की शक्ति से अभिषिक्त जो इसे सच्चे हृदय से पालन करे।

इति प्रथम अध्याय सम्पूर्ण। जो भक्तजन एकादशी की उत्पत्ति की यह कथा श्रद्धापूर्वक सुनते हैं, उन्हें व्रत पालन का साहस और यह विश्वास प्राप्त होगा कि भगवान की कृपा से बड़ी से बड़ी बाधा भी पार हो सकती है।`,
        },
      },
      {
        number: 2,
        title: {
          en: 'The Story of King Ambarish — The Devotee Protected by Sudarshana',
          hi: 'द्वितीय अध्याय — राजा अम्बरीष की कथा और सुदर्शन की रक्षा',
        },
        content: {
          en: `In the solar dynasty of Ikshvaku, there was born a king whose devotion to Lord Vishnu would become a byword for faith itself. His name was Ambarish, and he ruled the earth not with the pride of a conqueror but with the humility of a servant. Though he possessed the wealth of seven continents and commanded armies that stretched from horizon to horizon, King Ambarish considered himself nothing more than a sweeper at the feet of Narayana.

Ambarish dedicated his mind to meditating on the lotus feet of Vishnu, his words to singing the Lord's glories, his hands to cleaning the temples, and his ears to hearing the sacred scriptures. His kingdom prospered as no kingdom had prospered before — not because Ambarish sought wealth, but because dharma itself flourished under a ruler who had surrendered everything to the divine. The rivers flowed clear and sweet. The harvests were bountiful. No citizen went hungry, and no dispute went unresolved.

Of all his observances, Ambarish held the Ekadashi vrat most sacred. He observed every Ekadashi without exception — the Nirjala (waterless) fast, the jagran (night vigil), and the precise Dwadashi parana (breaking of the fast) at the moment prescribed by the shastras. For Ambarish, the parana timing was not a mere ritual detail — it was an act of obedience to the Lord's own instruction. To break the fast too early would be a sign of weakness; to break it too late would mean the Dwadashi tithi had passed and the entire Ekadashi merit would be lost.

One year, Ambarish observed the Dwadashi Ekadashi vrat with extraordinary devotion. On the Dwadashi morning, as the prescribed parana window approached, the great sage Durvasa arrived at the palace with a retinue of disciples. Durvasa was known throughout the three worlds for two things: his immense spiritual power, and his volcanic temper. The slightest perceived insult could send him into a rage that had cursed kings, toppled kingdoms, and sent tremors through heaven.

Ambarish, ever the gracious host, received Durvasa with the highest honours. He washed the sage's feet, offered him a golden throne, and invited him to partake of the parana meal. "O great sage," Ambarish said, "your arrival at this moment is Lord Vishnu's blessing. Please grace our humble feast."

Durvasa replied: "I shall be happy to eat with you, O king. But first, let me go to the river to bathe and perform my sandhya." And so Durvasa departed for the riverbank, accompanied by his disciples.

Time passed. The parana window grew narrow. The royal priests watched the sky with increasing anxiety. "Maharaj," they said, "the Dwadashi tithi is ending. If you do not complete the parana before the tithi changes, the entire merit of your Ekadashi fast will be nullified."

Ambarish was caught in a terrible dilemma. To eat before his guest returned would be a grave breach of hospitality — a violation of dharma. But to let the Dwadashi window pass would be a violation of his vrat — another dimension of dharma. The king consulted his priests, who devised a solution rooted in scripture: "Maharaj, take a single sip of water. The shastras say that water is both food and not-food. It will technically complete the parana without dishonouring your guest, for you will still eat the full meal with the sage when he returns."

Ambarish, with trembling hands and a prayer on his lips, took a single sip of water infused with tulsi. "O Narayana," he whispered, "I do this not from hunger, but from obedience to your law. Forgive me if I err."

When Durvasa returned from the river, his supernatural perception immediately told him what had happened. The sage's eyes blazed with fury. His matted hair seemed to writhe like serpents. "You dare!" he thundered. "You broke your fast before I returned? You ate without your guest? This is the gravest insult to a Brahmin! I shall teach you the meaning of hospitality!"

Ambarish fell at Durvasa's feet. "Forgive me, O great sage. I took only a sip of water to preserve the sanctity of the Dwadashi. The full meal awaits you."

But Durvasa was beyond reason. In his rage, he tore a lock of his matted hair and hurled it to the ground. From that lock sprang a demon — a Kritya, a being of pure destructive energy, blazing with fire, wielding a trident, its eyes red with the intent to kill. "Destroy this arrogant king!" Durvasa commanded.

The Kritya charged at Ambarish with the force of a meteor. But Ambarish did not flinch. He did not flee. He did not summon his armies or his royal guard. He simply stood with folded hands and closed eyes, his lips moving in a single prayer: "Om Namo Bhagavate Vasudevaya."

And Lord Vishnu answered.

From the heavens descended the Sudarshana Chakra — that wheel of divine fire which is Vishnu's supreme weapon, spinning with the light of a million suns, its rim sharper than the edge of time itself. It incinerated the Kritya in a flash, as effortlessly as the sun burns away morning dew. The demon did not even have time to scream.

But the Sudarshana did not stop there. Having destroyed the threat to the Lord's devotee, the divine chakra turned upon the source of the threat — Durvasa himself. The disc began to chase the sage across the sky.

Durvasa ran. For the first time in his ancient life, the proud sage ran in terror. He fled to every corner of creation seeking refuge. He went to Brahma's court in Satya Loka. "Help me, O Pitamaha!" he begged. Brahma shook his head sadly: "This is Vishnu's weapon. I cannot stop it." He went to Shiva on Mount Kailash. "Save me, O Mahadeva!" he pleaded. Shiva replied with compassion: "Even I cannot overrule the Sudarshana when it is protecting a devotee. Go to Vishnu himself."

And so, after fleeing through all the fourteen worlds, Durvasa at last arrived at Vaikuntha. He threw himself at Lord Vishnu's feet, weeping, all his pride shattered to dust. "O Lord, call back your weapon! I was wrong. I was consumed by pride and anger. Forgive me!"

Lord Vishnu looked at Durvasa with eyes full of both compassion and firmness. "O Durvasa," he said, "I cannot recall the Sudarshana. It is not mine to command — it belongs to my devotee. I have given myself so completely to those who love me that I am no longer free. I am bound by their devotion. I eat what they offer. I go where they call. I protect whom they cherish. My Sudarshana obeys not my will, but the devotion of Ambarish."

"Then what am I to do?" Durvasa cried.

"Go to Ambarish," Vishnu said gently. "Fall at the feet of the very man you sought to destroy. He alone can save you, for his forgiveness is the only force that can call back the Sudarshana."

And so the mighty Durvasa — the sage before whom gods and demons trembled — returned to earth, entered Ambarish's palace, and fell at the feet of the king. "O Ambarish," he wept, "I wronged you. I let my ego overwhelm my wisdom. Please forgive me and call back this terrible weapon."

Ambarish, who had been fasting all this time — refusing to eat a full meal until his guest returned — lifted Durvasa to his feet and embraced him. "O sage," he said with tears in his eyes, "you owe me no apology. You are a great soul, and your presence in my home is a blessing." He then clasped his hands and prayed to the Sudarshana Chakra directly: "O divine weapon of my Lord, this sage is not my enemy but my guest. His anger was a test of my devotion, and I have no anger in return. Please withdraw."

The Sudarshana, which had been circling above them with flames licking the sky, slowly dimmed, grew still, and vanished into the heavens. Durvasa collapsed with relief.

Ambarish served Durvasa a feast of such generosity and love that the sage, who had eaten in the courts of gods, declared it the finest meal of his immortal life. As he departed, Durvasa blessed Ambarish: "O king, you are greater than I. Your devotion has taught me that true power lies not in curses and austerities, but in love and surrender. May you reign forever in the heart of Narayana."

And King Ambarish did. His name became eternal — a symbol of steadfast devotion, the proof that a devotee who surrenders completely to the Lord need fear nothing in all creation, not even the wrath of the mightiest sage.

Thus ends the second chapter. The lesson is profound: devotion is the greatest shield. The Lord himself declared that he is bound by the love of his devotees. Even a sage's curse cannot touch one who has surrendered to Narayana. Observe Ekadashi with Ambarish's devotion, and the Sudarshana itself shall guard your path.`,
          hi: `इक्ष्वाकु के सूर्यवंश में एक ऐसे राजा का जन्म हुआ जिसकी भगवान विष्णु के प्रति भक्ति स्वयं श्रद्धा का पर्याय बन गई। उनका नाम अम्बरीष था, और वे पृथ्वी पर एक विजेता के गर्व से नहीं बल्कि एक सेवक की विनम्रता से शासन करते थे। सात द्वीपों की सम्पत्ति और क्षितिज से क्षितिज तक फैली सेनाओं के स्वामी होते हुए भी, राजा अम्बरीष स्वयं को नारायण के चरणों का मात्र सेवक मानते थे।

अम्बरीष ने अपना मन विष्णु के चरण-कमलों के ध्यान में, अपनी वाणी भगवान की महिमा के गायन में, अपने हाथ मन्दिरों की सफाई में, और अपने कान पवित्र शास्त्रों के श्रवण में समर्पित किए। उनका राज्य ऐसा समृद्ध हुआ जैसा कोई राज्य पहले कभी नहीं हुआ — इसलिए नहीं कि अम्बरीष ने धन की कामना की, बल्कि इसलिए कि जिस शासक ने सब कुछ ईश्वर को समर्पित कर दिया, उसके राज में स्वयं धर्म का विकास हुआ। नदियां निर्मल और मधुर बहती थीं। फसलें प्रचुर होती थीं। कोई नागरिक भूखा नहीं रहता था, और कोई विवाद अनसुलझा नहीं रहता था।

अपने सभी अनुष्ठानों में, अम्बरीष एकादशी व्रत को सर्वाधिक पवित्र मानते थे। वे बिना अपवाद प्रत्येक एकादशी का पालन करते — निर्जल उपवास, जागरण, और शास्त्रों द्वारा निर्धारित क्षण पर सटीक द्वादशी पारण। अम्बरीष के लिए, पारण का समय मात्र अनुष्ठानिक विवरण नहीं था — यह भगवान के स्वयं के निर्देश का पालन था। समय से पहले व्रत तोड़ना दुर्बलता का चिह्न होता; देर से तोड़ने का अर्थ होता कि द्वादशी तिथि बीत गई और सम्पूर्ण एकादशी का पुण्य नष्ट हो गया।

एक वर्ष, अम्बरीष ने असाधारण भक्ति के साथ द्वादशी एकादशी व्रत का पालन किया। द्वादशी के प्रातः, जैसे-जैसे निर्धारित पारण की अवधि निकट आ रही थी, महान ऋषि दुर्वासा अपने शिष्यों के दल सहित राजमहल पहुंचे। दुर्वासा तीनों लोकों में दो बातों के लिए विख्यात थे: उनकी अपार आध्यात्मिक शक्ति, और उनका ज्वालामुखी-सा क्रोध। थोड़ा-सा भी अपमान उन्हें ऐसे कोप में भेज सकता था जिसने राजाओं को शापित किया, राज्यों को उलटा दिया, और स्वर्ग तक कम्पन पहुंचाए थे।

अम्बरीष ने, सदा के शिष्ट आतिथेय, दुर्वासा का सर्वोच्च सम्मान से स्वागत किया। उन्होंने ऋषि के चरण धोए, स्वर्ण सिंहासन अर्पित किया, और पारण भोज में सम्मिलित होने का निमन्त्रण दिया। "हे महामुनि," अम्बरीष ने कहा, "इस समय आपका आगमन भगवान विष्णु का आशीर्वाद है। कृपया हमारे विनम्र भोज को कृतार्थ करें।"

दुर्वासा ने उत्तर दिया: "मैं प्रसन्नतापूर्वक आपके साथ भोजन करूंगा, हे राजन। किन्तु पहले मुझे नदी में स्नान और सन्ध्या करने जाने दीजिए।" और इस प्रकार दुर्वासा अपने शिष्यों सहित नदी तट की ओर चले गए।

समय बीतता गया। पारण की अवधि सिकुड़ती गई। राजपुरोहित बढ़ती चिन्ता से आकाश को देख रहे थे। "महाराज," उन्होंने कहा, "द्वादशी तिथि समाप्त हो रही है। यदि तिथि बदलने से पहले पारण नहीं किया, तो आपके सम्पूर्ण एकादशी व्रत का पुण्य नष्ट हो जाएगा।"

अम्बरीष भयानक दुविधा में फंस गए। अतिथि की वापसी से पहले भोजन करना आतिथ्य का गम्भीर उल्लंघन होता — धर्म का अपमान। किन्तु द्वादशी की अवधि बीतने देना उनके व्रत का उल्लंघन होता — धर्म का दूसरा आयाम। राजा ने अपने पुरोहितों से परामर्श किया, जिन्होंने शास्त्र-सम्मत समाधान निकाला: "महाराज, एक घूंट जल ले लीजिए। शास्त्र कहते हैं कि जल अन्न भी है और अन्न नहीं भी। यह तकनीकी रूप से पारण पूर्ण कर देगा बिना अतिथि के अपमान के, क्योंकि ऋषि के लौटने पर आप उनके साथ पूर्ण भोजन करेंगे।"

अम्बरीष ने कांपते हाथों और होंठों पर प्रार्थना के साथ तुलसी-मिश्रित जल का एक घूंट लिया। "हे नारायण," उन्होंने फुसफुसाया, "मैं यह भूख से नहीं, बल्कि आपकी विधि के पालन से करता हूं। यदि मुझसे त्रुटि हो तो क्षमा करें।"

जब दुर्वासा नदी से लौटे, उनकी अलौकिक अन्तर्दृष्टि ने तुरन्त बता दिया कि क्या हुआ था। ऋषि की आंखें क्रोध से प्रज्वलित हुईं। उनकी जटाएं सर्पों की भांति लहराने लगीं। "तुम्हारी हिम्मत!" वे गरजे। "मेरे लौटने से पहले तुमने व्रत तोड़ा? अतिथि के बिना खाया? यह ब्राह्मण का सबसे गम्भीर अपमान है! मैं तुम्हें आतिथ्य का अर्थ सिखाऊंगा!"

अम्बरीष दुर्वासा के चरणों में गिर पड़े। "क्षमा करें, हे महामुनि। मैंने द्वादशी की पवित्रता बनाए रखने के लिए केवल एक घूंट जल लिया। पूर्ण भोजन आपकी प्रतीक्षा में है।"

किन्तु दुर्वासा तर्क से परे थे। अपने क्रोध में, उन्होंने अपनी जटा की एक लट नोचकर भूमि पर फेंकी। उस लट से एक दानव उत्पन्न हुआ — एक कृत्या, शुद्ध विनाशकारी ऊर्जा का प्राणी, अग्नि से धधकता, त्रिशूल धारण किए, उसकी लाल आंखें वध के संकल्प से भरी। "इस अहंकारी राजा को नष्ट करो!" दुर्वासा ने आज्ञा दी।

कृत्या उल्का की शक्ति से अम्बरीष पर झपटी। किन्तु अम्बरीष न कांपे। न भागे। न अपनी सेनाओं या अंगरक्षकों को बुलाया। वे केवल हाथ जोड़े और आंखें बन्द किए खड़े रहे, उनके होंठ एक ही प्रार्थना में हिल रहे थे: "ॐ नमो भगवते वासुदेवाय।"

और भगवान विष्णु ने उत्तर दिया।

आकाश से सुदर्शन चक्र अवतरित हुआ — वह दिव्य अग्नि का चक्र जो विष्णु का सर्वोच्च अस्त्र है, लाखों सूर्यों के प्रकाश से घूमता, इसकी धार स्वयं काल की धार से भी तीक्ष्ण। उसने कृत्या को एक क्षण में भस्म कर दिया, उतनी सहजता से जैसे सूर्य प्रातः की ओस को सुखा देता है। दानवी को चीखने का भी समय न मिला।

किन्तु सुदर्शन यहां नहीं रुका। भगवान के भक्त के लिए खतरा नष्ट करने के बाद, दिव्य चक्र खतरे के स्रोत की ओर मुड़ा — स्वयं दुर्वासा। चक्र ऋषि का पीछा करने लगा।

दुर्वासा भागे। अपने प्राचीन जीवन में पहली बार, गर्वित ऋषि आतंक में भागे। वे शरण खोजते हुए सृष्टि के प्रत्येक कोने में गए। वे सत्यलोक में ब्रह्मा के दरबार में गए। "मेरी सहायता करें, हे पितामह!" उन्होंने विनती की। ब्रह्मा ने दुःखी होकर सिर हिलाया: "यह विष्णु का अस्त्र है। मैं इसे नहीं रोक सकता।" वे कैलाश पर शिव के पास गए। "मुझे बचाइए, हे महादेव!" उन्होंने गुहार लगाई। शिव ने करुणापूर्वक उत्तर दिया: "जब सुदर्शन किसी भक्त की रक्षा कर रहा हो, तो मैं भी उसे नहीं रोक सकता। स्वयं विष्णु के पास जाओ।"

और इस प्रकार, चौदहों लोकों में भागने के बाद, दुर्वासा अन्ततः वैकुण्ठ पहुंचे। वे भगवान विष्णु के चरणों में गिर पड़े, रोते हुए, उनका समस्त गर्व धूल में मिल चुका था। "हे प्रभु, अपना अस्त्र वापस बुलाइए! मैं गलत था। मैं अहंकार और क्रोध में डूबा था। मुझे क्षमा करें!"

भगवान विष्णु ने दुर्वासा को करुणा और दृढ़ता दोनों से भरी दृष्टि से देखा। "हे दुर्वासा," उन्होंने कहा, "मैं सुदर्शन को वापस नहीं बुला सकता। यह मेरे आदेश का नहीं — यह मेरे भक्त का है। मैंने स्वयं को उन्हें इतना पूर्णतः समर्पित कर दिया है जो मुझसे प्रेम करते हैं कि मैं अब स्वतन्त्र नहीं हूं। मैं उनकी भक्ति से बंधा हूं। वे जो अर्पित करते हैं मैं वही खाता हूं। वे जहां बुलाते हैं मैं वहीं जाता हूं। वे जिसकी रक्षा चाहते हैं मैं उसकी रक्षा करता हूं। मेरा सुदर्शन मेरी इच्छा नहीं, अम्बरीष की भक्ति का पालन करता है।"

"तो मैं क्या करूं?" दुर्वासा चीखे।

"अम्बरीष के पास जाओ," विष्णु ने कोमलता से कहा। "उसी व्यक्ति के चरणों में गिरो जिसे तुमने नष्ट करना चाहा। केवल वही तुम्हें बचा सकता है, क्योंकि उसकी क्षमा ही एकमात्र शक्ति है जो सुदर्शन को वापस बुला सकती है।"

और इस प्रकार शक्तिशाली दुर्वासा — वह ऋषि जिनके सामने देवता और दानव कांपते थे — पृथ्वी पर लौटे, अम्बरीष के राजमहल में प्रवेश किया, और राजा के चरणों में गिर पड़े। "हे अम्बरीष," वे रोए, "मैंने तुम्हारे साथ अन्याय किया। मैंने अपने अहंकार को अपनी बुद्धि पर हावी होने दिया। कृपया मुझे क्षमा करो और इस भयंकर अस्त्र को वापस बुलाओ।"

अम्बरीष, जो इस पूरे समय उपवास कर रहे थे — अपने अतिथि की वापसी तक पूर्ण भोजन करने से इनकार करते हुए — ने दुर्वासा को उठाकर गले लगाया। "हे मुनिवर," उन्होंने आंखों में अश्रु लिए कहा, "आप मुझसे कोई क्षमा के ऋणी नहीं हैं। आप महान आत्मा हैं, और मेरे घर में आपकी उपस्थिति आशीर्वाद है।" फिर उन्होंने हाथ जोड़कर सीधे सुदर्शन चक्र से प्रार्थना की: "हे मेरे प्रभु के दिव्य अस्त्र, ये ऋषि मेरे शत्रु नहीं, मेरे अतिथि हैं। उनका क्रोध मेरी भक्ति की परीक्षा था, और मेरे हृदय में कोई क्रोध नहीं। कृपया लौट जाइए।"

सुदर्शन, जो आकाश को चाटती ज्वालाओं के साथ उनके ऊपर चक्कर लगा रहा था, धीरे-धीरे मन्द पड़ा, स्थिर हुआ, और आकाश में लुप्त हो गया। दुर्वासा राहत से ढह पड़े।

अम्बरीष ने दुर्वासा को ऐसी उदारता और प्रेम का भोज कराया कि ऋषि ने, जिन्होंने देवताओं के दरबार में भोजन किया था, इसे अपने अमर जीवन का सर्वश्रेष्ठ भोजन घोषित किया। विदा होते समय, दुर्वासा ने अम्बरीष को आशीर्वाद दिया: "हे राजन, तुम मुझसे महान हो। तुम्हारी भक्ति ने मुझे सिखाया कि सच्ची शक्ति शापों और तपस्या में नहीं, बल्कि प्रेम और समर्पण में है। तुम सदा नारायण के हृदय में राज करो।"

और राजा अम्बरीष ने किया। उनका नाम शाश्वत हो गया — अटल भक्ति का प्रतीक, इस बात का प्रमाण कि जो भक्त पूर्णतः भगवान को समर्पित हो जाता है, उसे सम्पूर्ण सृष्टि में किसी से भय नहीं, महानतम ऋषि के कोप से भी नहीं।

इति द्वितीय अध्याय सम्पूर्ण। शिक्षा गम्भीर है: भक्ति सबसे बड़ी ढाल है। स्वयं भगवान ने घोषणा की कि वे अपने भक्तों के प्रेम से बंधे हैं। ऋषि का शाप भी उसे छू नहीं सकता जिसने नारायण को समर्पित कर दिया। अम्बरीष की भक्ति से एकादशी का पालन करो, और स्वयं सुदर्शन तुम्हारे मार्ग की रक्षा करेगा।`,
        },
      },
    ],
    relatedAartis: ['om-jai-jagdish-hare', 'vishnu-aarti'],
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
    samagri: {
      en: [
        'Karva (earthen pot with spout)',
        'Sieve (chalni) for viewing the moon',
        'Ghee diya and cotton wicks',
        'Mehndi (henna)',
        'Sindoor and kumkum',
        'Glass bangles (red/green)',
        'Sweets and seasonal fruits',
        'Puja thali with roli, rice, flowers',
      ],
      hi: [
        'करवा (टोंटीदार मिट्टी का बर्तन)',
        'छलनी (चांद देखने के लिए)',
        'घी का दीया और रुई की बत्ती',
        'मेहंदी',
        'सिन्दूर और कुमकुम',
        'कांच की चूड़ियां (लाल/हरी)',
        'मिठाई और मौसमी फल',
        'रोली, चावल, पुष्प सहित पूजा थाली',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Story of Queen Veeravati — The False Moon',
          hi: 'प्रथम अध्याय — रानी वीरावती की कथा और झूठा चांद',
        },
        content: {
          en: `In a prosperous kingdom of ancient Bharatavarsha, there lived a beautiful princess named Veeravati. She was the youngest child and the only sister of seven devoted brothers. From the day of her birth, her brothers adored her beyond measure. They would bring her the first fruits of every season, shield her from every hardship, and grant her every wish before she could fully speak it. Veeravati grew up surrounded by such love that she believed no sorrow could ever touch her.

When Veeravati came of age, she was married to a noble and handsome king. The wedding was celebrated with splendour that rivalled the festivals of Indra's court — elephants draped in gold, musicians playing through the night, and garlands of jasmine perfuming the air for miles. As she departed for her husband's palace, her seven brothers wept, for though they rejoiced in her happiness, they could not bear the thought of their beloved sister enduring even a moment's discomfort.

In her new home, Veeravati was loved and honoured. Her husband the king was a righteous ruler — kind, brave, and devoted to his queen. Their life together was a garden of contentment. When the first Karva Chauth arrived after her marriage, Veeravati resolved to observe it with all the traditional rigour her mother had taught her. She would fast from the pre-dawn sargi until the moon rose in the evening sky, praying for her husband's long life and prosperity.

She began her fast before sunrise, having eaten the sargi prepared by her mother-in-law — a few sweets, dried fruits, and a glass of milk. As the morning wore on, her fast was easy, buoyed by excitement and devotion. But as the sun climbed to its zenith and the afternoon stretched endlessly, the young queen — unaccustomed to such severe abstinence — began to suffer terribly. She had not eaten since before dawn. She had not taken even a sip of water. Her throat burned. Her vision blurred. Her hands trembled so violently that she could not hold her prayer beads. By late afternoon, she could barely stand.

Her seven brothers, who had come to visit their sister's home for the festival season, watched her deterioration with growing alarm. They loved their sister more than life itself, and to see her suffering was unbearable agony for each of them.

"We must do something," the eldest brother whispered to the others. "She will collapse before moonrise. She is not strong enough for this fast."

"But the moon will not rise for hours yet," the second brother said. "What can we do? She will not break her fast until she sees the moon — she believes her husband's life depends on it."

The seven brothers huddled together, and in their love-blinded desperation, they hatched a plan that would bring disaster upon them all. They would create a false moonrise to trick their sister into breaking her fast early. Their intentions were pure — they wanted only to end her suffering — but the road to catastrophe is often paved with the kindest of intentions.

As twilight gathered, the brothers climbed a nearby hill. Behind a large pipal tree, they stretched a fine silk cloth and lit a great fire behind it. The light of the flames, filtered through the silk and framed by the leaves of the pipal tree, created a luminous golden disc on the horizon that looked remarkably like the rising moon. They positioned it perfectly, so that when viewed from the palace terrace, it appeared as a crescent moon hanging just above the tree line.

"Sister!" the youngest brother called out, running breathlessly to Veeravati. "Come quickly! The moon has risen early tonight! Such good fortune — Lord Shiva must be pleased with your devotion!"

Veeravati, her mind clouded by exhaustion and hunger, did not question. She rushed to the terrace, and there, hanging above the distant trees, was what appeared to be the moon — pale gold, crescent-shaped, beautiful. Her heart leapt with joy. She picked up the sieve, gazed at the false moon through its mesh, then turned to look at her husband's face through the same sieve, completing the ritual.

"Bring the water," she said with a weak smile. Her husband, who did not know of the brothers' deception, offered her the first sip. She drank. She ate a morsel of food. And in that instant, the world fractured.

A servant came running from the inner chambers, his face ashen. "Maharani! The king — the king has collapsed!" Veeravati dropped the glass. She ran to the royal chambers and found her husband lying on the floor, his body cold, his breath gone, his eyes staring at nothing. The king was dead.

The wailing that rose from the palace that night could be heard across the kingdom. Veeravati threw herself upon her husband's body and screamed until her voice broke. Her brothers, realizing the horror of what they had done, fell to their knees in shock. The false moon — their loving trick — had murdered the king as surely as any assassin's blade.

For days, Veeravati sat beside her husband's body, refusing to eat, refusing to sleep, refusing to let anyone take him away. The funeral arrangements were halted by her sheer force of will. "He is not dead," she whispered. "He cannot be dead. The gods would not be so cruel."

On the seventh day of her vigil, as she sat hollow-eyed beside the body that was preserved by some miracle from decay, a divine light filled the room. Before her stood Goddess Parvati — Shiva's consort, the embodiment of wifely devotion, her form radiating maternal compassion. Parvati's eyes glistened with both sympathy and gentle reproach.

"Child," Parvati spoke, her voice like temple bells at dawn, "your husband did not die by accident or fate. He died because you broke the Karva Chauth vrat before the true moonrise. The moon you saw was a trick of your brothers — a false light born of love but carried on the wings of deception. The vrat's power protects the husband's life, but only when observed to completion. When you broke it with a false moon, the protection shattered."

Veeravati fell at Parvati's feet, her tears pooling on the cold floor. "O Devi, is there no remedy? Must I live the rest of my days knowing that I — however unwittingly — caused my husband's death? Tell me what penance to perform, and I shall do it if it takes a thousand lifetimes."

Parvati's expression softened. The goddess, who herself had performed the most severe tapasya in all of creation to win Lord Shiva as her husband, understood Veeravati's love and pain better than any being in the universe.

"There is a way," Parvati said. "From this day forward, you must observe every Karva Chauth for one full year with absolute perfection. Not a drop of water shall pass your lips before the true moon is confirmed by the stars around it. You must sit with the married women of the kingdom and listen to the katha with undivided attention. You must offer your prayers not out of fear, but out of genuine love. And at the end of one year, if your devotion has been pure, I shall restore your husband to life."

Veeravati accepted this penance with the strength of a woman who has nothing left to lose and everything to fight for. For the next twelve months, she observed every Karva Chauth with a devotion so fierce that the very gods took notice. She did not merely fast — she transformed the fast into an act of worship so pure that each moment of hunger became a prayer, each moment of thirst became an offering. She sat with the women of the kingdom, she narrated the katha from memory, she taught young brides the importance of completing the vrat with integrity. Her sincerity became legendary.

On the final Karva Chauth, as the true moon rose — confirmed by the familiar constellations surrounding it — Veeravati performed the ritual with trembling hands and overflowing eyes. She gazed at the real moon through the sieve, she whispered her husband's name, and she prayed: "O Parvati Devi, I have done as you asked. Not for reward, but because my love demanded it. If my husband's destiny is to remain in death, I accept it. But if there is mercy in this universe, let him open his eyes."

As the last word left her lips, a warmth spread through the palace. In the preserved chamber where the king's body lay, colour returned to his cheeks. His fingers twitched. His chest rose with a breath. And then his eyes opened — clear, bewildered, alive. He sat up and looked around, as though waking from a long and dreamless sleep.

Veeravati heard the servants' joyful cries and ran. When she saw her husband sitting up, alive and whole, she collapsed at his feet, laughing and weeping at once. The king, who remembered nothing of his death, held her in his arms and said: "Why do you weep, my queen? I am here."

"Yes," Veeravati whispered. "You are here. And I shall never let you go."

From that day, Queen Veeravati became the patron saint of Karva Chauth. Her story is told every year by married women as they fast for their husbands — a reminder that love, when tested by suffering and purified by devotion, has the power to conquer even death itself. And the lesson of the false moon endures: never seek shortcuts in sacred vows, for the truth of devotion cannot be mimicked, and the consequences of deception — however well-intentioned — are always severe.

Thus ends the katha. May every woman who observes Karva Chauth with Veeravati's devotion receive the blessings of Shiva and Parvati, and may every husband be worthy of such love.`,
          hi: `प्राचीन भारतवर्ष के एक समृद्ध राज्य में वीरावती नाम की एक सुन्दर राजकुमारी रहती थी। वह सबसे छोटी सन्तान थी और सात समर्पित भाइयों की एकमात्र बहन। जन्म के दिन से ही, उसके भाइयों ने उसे अपरिमित प्रेम दिया। वे हर मौसम के पहले फल उसके लिए लाते, हर कठिनाई से उसकी रक्षा करते, और उसकी हर इच्छा पूरी होने से पहले ही पूरी कर देते। वीरावती ऐसे प्रेम में पली-बढ़ी कि उसे विश्वास था कि कोई दुःख उसे छू ही नहीं सकता।

जब वीरावती विवाह योग्य हुई, तो उसका विवाह एक कुलीन और सुन्दर राजा से किया गया। विवाह ऐसी भव्यता से मनाया गया जो इन्द्र के दरबार के उत्सवों की बराबरी करता था — स्वर्ण से सज्जित हाथी, रातभर बजते वाद्य, और मीलों तक चमेली की मालाओं की सुगन्ध। जब वह अपने पति के महल के लिए विदा हुई, उसके सातों भाई रोए, क्योंकि उसकी प्रसन्नता पर हर्षित होने के बावजूद, वे अपनी प्रिय बहन को एक क्षण भी कष्ट सहते देखने की कल्पना सहन नहीं कर सकते थे।

अपने नए घर में, वीरावती को प्रेम और सम्मान मिला। उसका पति राजा एक धर्मात्मा शासक था — दयालु, साहसी, और अपनी रानी के प्रति समर्पित। उनका साथ का जीवन सन्तोष का उद्यान था। विवाह के बाद पहला करवा चौथ आने पर, वीरावती ने उसे पूरी परम्परागत कड़ाई से पालन करने का संकल्प किया जो उसकी माता ने सिखाई थी। वह भोर की सरगी से लेकर सन्ध्या के आकाश में चन्द्रोदय तक उपवास रखेगी, पति की दीर्घायु और समृद्धि की प्रार्थना करते हुए।

उसने सूर्योदय से पहले व्रत आरम्भ किया, सास द्वारा तैयार सरगी खाकर — कुछ मिठाइयां, सूखे मेवे, और एक गिलास दूध। प्रातः तक व्रत आसान था, उत्साह और भक्ति से भरा। किन्तु जैसे-जैसे सूर्य चढ़ा और दोपहर अन्तहीन खिंचती गई, युवा रानी — जो ऐसे कठोर उपवास की अभ्यस्त नहीं थी — भयंकर रूप से कष्ट सहने लगी। उसने भोर से कुछ नहीं खाया था। एक घूंट जल भी नहीं पिया था। उसका गला जल रहा था। दृष्टि धुंधली हो रही थी। उसके हाथ इतने कांप रहे थे कि माला भी नहीं पकड़ पा रही थी। सन्ध्या तक, वह मुश्किल से खड़ी हो पा रही थी।

उसके सातों भाई, जो उत्सव के मौसम में बहन के ससुराल आए थे, उसकी बिगड़ती दशा को बढ़ती चिन्ता से देख रहे थे। वे अपनी बहन से प्राण से भी अधिक प्रेम करते थे, और उसे कष्ट में देखना उनमें से प्रत्येक के लिए असहनीय पीड़ा थी।

"हमें कुछ करना होगा," बड़े भाई ने दूसरों से फुसफुसाकर कहा। "चन्द्रोदय से पहले वह गिर जाएगी। वह इस व्रत के लिए पर्याप्त सबल नहीं है।"

"किन्तु चांद अभी घण्टों बाद उगेगा," दूसरे भाई ने कहा। "हम क्या कर सकते हैं? वह चांद देखे बिना व्रत नहीं तोड़ेगी — उसे विश्वास है कि उसके पति का जीवन इस पर निर्भर है।"

सातों भाई एक साथ बैठे, और प्रेमान्ध हताशा में, उन्होंने एक ऐसी योजना बनाई जो उन सबके लिए विपत्ति लाने वाली थी। वे अपनी बहन को झूठे चन्द्रोदय से छलकर समय से पहले व्रत तुड़वाएंगे। उनके इरादे शुद्ध थे — वे केवल उसका कष्ट समाप्त करना चाहते थे — किन्तु विनाश का मार्ग प्रायः सबसे नेक इरादों से ही बिछा होता है।

जैसे ही सन्ध्या ढली, भाई पास की पहाड़ी पर चढ़े। एक बड़े पीपल के वृक्ष के पीछे, उन्होंने महीन रेशमी कपड़ा तान दिया और उसके पीछे बड़ी अग्नि प्रज्वलित की। ज्वाला का प्रकाश, रेशम से छनकर और पीपल के पत्तों से फ्रेम होकर, क्षितिज पर एक चमकीली सुनहरी चकती बनाता था जो उदित होते चन्द्रमा जैसी दिखती थी। उन्होंने इसे ऐसे स्थापित किया कि महल की छत से देखने पर वह वृक्ष रेखा के ठीक ऊपर लटका अर्धचन्द्र लगता था।

"बहन!" सबसे छोटे भाई ने हांफते हुए वीरावती को बुलाया। "जल्दी आओ! आज चांद जल्दी निकल गया! कितना शुभ — भगवान शिव तुम्हारी भक्ति से प्रसन्न अवश्य हैं!"

वीरावती, थकान और भूख से धुंधले मन में, ने प्रश्न नहीं किया। वह दौड़कर छत पर गई, और वहां, दूर के वृक्षों के ऊपर, जो चन्द्रमा लग रहा था — हल्का सुनहरा, अर्धचन्द्राकार, सुन्दर। उसका हृदय आनन्द से उछल पड़ा। उसने छलनी उठाई, उसकी जाली से झूठे चांद को देखा, फिर छलनी से अपने पति का चेहरा देखकर अनुष्ठान पूरा किया।

"जल लाओ," उसने कमजोर मुस्कान के साथ कहा। उसके पति ने, जो भाइयों के छल से अनजान था, उसे पहला घूंट दिया। उसने पिया। एक ग्रास खाया। और उसी क्षण, संसार बिखर गया।

एक सेवक अन्तः कक्ष से दौड़ता आया, उसका चेहरा पीला पड़ा हुआ। "महारानी! राजा — राजा गिर पड़े हैं!" वीरावती ने गिलास गिरा दिया। वह दौड़कर राजकक्ष में गई और अपने पति को फर्श पर पड़ा पाया, शरीर ठण्डा, श्वास बन्द, आंखें शून्य में ताकती हुई। राजा की मृत्यु हो गई थी।

उस रात महल से उठी चीत्कार पूरे राज्य में सुनी गई। वीरावती ने पति के शव पर गिरकर तब तक चीखा जब तक उसका स्वर भंग नहीं हो गया। उसके भाई, अपने किए की भयावहता समझकर, सदमे में घुटनों पर गिर पड़े। झूठा चांद — उनकी प्रेमपूर्ण चाल — ने राजा को किसी हत्यारे की तलवार की भांति निश्चित रूप से मार डाला था।

दिनों तक, वीरावती पति के शव के पास बैठी रही, खाने से इनकार, सोने से इनकार, किसी को उन्हें ले जाने देने से इनकार। उसकी अदम्य इच्छाशक्ति ने अन्तिम संस्कार की तैयारियां रोक दीं। "वे मरे नहीं हैं," वह फुसफुसाती। "वे मर नहीं सकते। देवता इतने क्रूर नहीं हो सकते।"

उसके जागरण के सातवें दिन, जब वह पथराई आंखों से उस शव के पास बैठी थी जो किसी चमत्कार से क्षय से बचा हुआ था, कमरे में दिव्य प्रकाश भर गया। उसके सामने देवी पार्वती खड़ी थीं — शिव की संगिनी, पातिव्रत्य का मूर्तरूप, उनका स्वरूप मातृत्व करुणा से दीप्त। पार्वती की आंखों में सहानुभूति और कोमल उपालम्भ दोनों चमक रहे थे।

"बेटी," पार्वती बोलीं, उनकी वाणी प्रातःकालीन मन्दिर की घण्टियों-सी, "तुम्हारे पति की मृत्यु दुर्घटना या भाग्य से नहीं हुई। वे मरे क्योंकि तुमने सच्चे चन्द्रोदय से पहले करवा चौथ का व्रत तोड़ दिया। जो चांद तुमने देखा वह तुम्हारे भाइयों की चाल था — प्रेम से जन्मा किन्तु छल के पंखों पर उड़ता झूठा प्रकाश। व्रत की शक्ति पति के प्राणों की रक्षा करती है, किन्तु तभी जब पूर्ण रूप से पालन किया जाए। जब तुमने झूठे चांद से तोड़ा, रक्षा टूट गई।"

वीरावती पार्वती के चरणों में गिर पड़ी, उसके अश्रु ठण्डे फर्श पर एकत्र हो रहे थे। "हे देवी, क्या कोई उपाय नहीं? क्या मुझे शेष जीवन यह जानकर जीना होगा कि मैंने — चाहे अनजाने में — अपने पति की मृत्यु कराई? मुझे बताइये कौन-सा प्रायश्चित्त करना है, और मैं करूंगी चाहे सहस्र जन्म लग जाएं।"

पार्वती का भाव कोमल हुआ। देवी, जिन्होंने स्वयं भगवान शिव को पति रूप में पाने के लिए सम्पूर्ण सृष्टि की सबसे कठोर तपस्या की थी, वीरावती के प्रेम और पीड़ा को ब्रह्माण्ड में किसी भी प्राणी से बेहतर समझती थीं।

"एक मार्ग है," पार्वती ने कहा। "आज से, तुम एक पूरे वर्ष तक प्रत्येक करवा चौथ सम्पूर्ण शुद्धता से पालन करोगी। सच्चे चन्द्रमा की पुष्टि उसके चारों ओर के तारों से होने तक एक बूंद जल भी तुम्हारे होंठों से नहीं गुजरेगा। तुम राज्य की विवाहित स्त्रियों के साथ बैठकर अविभाजित ध्यान से कथा सुनोगी। तुम अपनी प्रार्थना भय से नहीं, बल्कि सच्चे प्रेम से करोगी। और एक वर्ष के अन्त में, यदि तुम्हारी भक्ति शुद्ध रही, तो मैं तुम्हारे पति को जीवन लौटाऊंगी।"

वीरावती ने यह प्रायश्चित्त उस स्त्री की शक्ति से स्वीकार किया जिसके पास खोने को कुछ नहीं बचा था और लड़ने को सब कुछ। अगले बारह महीनों तक, उसने प्रत्येक करवा चौथ ऐसी प्रचण्ड भक्ति से पालन किया कि स्वयं देवताओं ने ध्यान दिया। उसने मात्र उपवास नहीं किया — उसने उपवास को इतनी शुद्ध पूजा में रूपान्तरित कर दिया कि भूख का प्रत्येक क्षण प्रार्थना बन गया, प्यास का प्रत्येक क्षण अर्पण। वह राज्य की स्त्रियों के साथ बैठती, कण्ठस्थ कथा सुनाती, नवविवाहित वधुओं को व्रत पूर्णता से पालन करने का महत्व सिखाती। उसकी सच्चाई किंवदन्ती बन गई।

अन्तिम करवा चौथ पर, जैसे ही सच्चा चांद उगा — उसके चारों ओर के परिचित तारामण्डलों से पुष्ट — वीरावती ने कांपते हाथों और छलकती आंखों से अनुष्ठान किया। उसने छलनी से सच्चे चांद को देखा, अपने पति का नाम फुसफुसाया, और प्रार्थना की: "हे पार्वती देवी, मैंने वैसा ही किया जैसा आपने कहा। पुरस्कार के लिए नहीं, बल्कि इसलिए कि मेरे प्रेम ने इसकी मांग की। यदि मेरे पति का भाग्य मृत्यु में रहना है, तो मैं स्वीकार करती हूं। किन्तु यदि इस ब्रह्माण्ड में करुणा है, तो उन्हें आंखें खोलने दीजिए।"

जैसे ही अन्तिम शब्द उसके होंठों से निकला, महल में ऊष्मा फैल गई। जिस संरक्षित कक्ष में राजा का शव रखा था, उसके गालों पर रंग लौट आया। उनकी उंगलियां हिलीं। उनकी छाती श्वास से उठी। और फिर उनकी आंखें खुलीं — स्पष्ट, विस्मित, जीवित। वे उठकर बैठे और चारों ओर देखा, जैसे किसी लम्बी और स्वप्नहीन निद्रा से जागे हों।

वीरावती ने सेवकों की आनन्दपूर्ण पुकार सुनी और दौड़ी। जब उसने अपने पति को बैठे हुए, जीवित और सम्पूर्ण देखा, वह उनके चरणों में गिर पड़ी, एक साथ हंसती और रोती हुई। राजा, जिन्हें अपनी मृत्यु की कोई स्मृति नहीं थी, ने उसे अपनी बांहों में लिया और कहा: "तुम क्यों रोती हो, मेरी रानी? मैं यहां हूं।"

"हां," वीरावती ने फुसफुसाया। "आप यहां हैं। और मैं आपको कभी नहीं जाने दूंगी।"

उस दिन से, रानी वीरावती करवा चौथ की आराध्य देवी बन गईं। उनकी कथा प्रत्येक वर्ष विवाहित स्त्रियां सुनाती हैं जब वे अपने पतियों के लिए व्रत रखती हैं — एक स्मरण कि प्रेम, जब कष्ट से परीक्षित और भक्ति से शुद्ध हो, उसमें मृत्यु को भी जीतने की शक्ति होती है। और झूठे चांद की शिक्षा सदा रहती है: पवित्र व्रतों में कभी शॉर्टकट न खोजो, क्योंकि भक्ति की सच्चाई की नकल नहीं हो सकती, और छल के परिणाम — चाहे कितने भी सद्भावना से हों — सदा गम्भीर होते हैं।

इति कथा सम्पूर्ण। जो भी स्त्री वीरावती की भक्ति से करवा चौथ का पालन करे, उसे शिव और पार्वती का आशीर्वाद प्राप्त हो, और प्रत्येक पति ऐसे प्रेम के योग्य बने।`,
        },
      },
    ],
    relatedAartis: ['karva-chauth-aarti'],
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
    samagri: {
      en: [
        'Bilva (bael) leaves',
        'White flowers (jasmine, mogra)',
        'Milk for abhishek',
        'Dhatura fruit and flowers',
        'Vibhuti (sacred ash)',
        'Ghee diya and cotton wicks',
        'Incense sticks and camphor',
      ],
      hi: [
        'बिल्वपत्र (बेल पत्र)',
        'श्वेत पुष्प (चमेली, मोगरा)',
        'अभिषेक के लिए दूध',
        'धतूरा फल और पुष्प',
        'विभूति (पवित्र भस्म)',
        'घी का दीया और रुई की बत्ती',
        'अगरबत्ती और कपूर',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Childless Couple and the Boy of Twelve Years',
          hi: 'प्रथम अध्याय — निःसन्तान दम्पती और बारह वर्ष का बालक',
        },
        content: {
          en: `In a small village at the foot of a great mountain, there lived a Brahmin couple of exemplary virtue. The husband was a scholar of the Vedas, respected throughout the region for his learning and integrity. His wife was a woman of deep faith, whose daily worship of Lord Shiva was as constant as the sunrise. They lived a simple life — their home was modest, their meals were plain, but their love for each other and for the divine was immeasurable.

Yet for all their piety, one sorrow hung over their lives like an unending monsoon cloud: they had no children. Year after year, they prayed. They visited every Shiva temple within a hundred leagues. They performed every prescribed ritual — the Santana Gopala mantra, the Putra Kameshti yajna, offerings at every sacred river. Nothing worked. The wife would weep silently during the night, and the husband would console her with words he himself barely believed: "The Lord has a plan. We must be patient."

But patience has its limits, even for the devout. When fifteen years of marriage had passed without the blessing of a child, the couple made a final, desperate resolve. They would observe the Solah Somvar Vrat — sixteen consecutive Monday fasts in honour of Lord Shiva — with such absolute dedication that the heavens themselves would have to respond.

And so they began. Every Monday, before the first light of dawn touched the mountain peaks, the couple would rise, bathe in cold water from the village well, and walk barefoot to the ancient Shiva temple on the hillside. The husband would perform the abhishek himself — pouring milk, water, honey, and yogurt over the weathered stone Linga while chanting the Rudram. The wife would offer bilva leaves that she had gathered at sunrise, counting them one by one — always an odd number, always fresh, always placed with the stem pointing toward herself as the shastras prescribed. They would offer white flowers, dhatura, and vibhuti. They would light a ghee diya that burned steadily even in the mountain wind, and they would sit in meditation, chanting "Om Namah Shivaya" until the sun was high.

They ate nothing until after sunset — and even then, only fruits and milk. No grain, no salt, no cooked food touched their lips on any Monday. Their neighbours thought them mad. "Sixteen weeks of such austerity?" they whispered. "At their age? They will destroy their health for nothing." But the couple paid no heed. Their eyes were fixed on the Shiva Linga, and their hearts were fixed on their prayer.

On the sixteenth Monday, as they completed the final puja with tears of devotion streaming down their faces, the flame of the ghee diya suddenly blazed upward — high as a man's height, casting no heat but radiating a light that was not of this world. The temple filled with the fragrance of sandalwood and camphor, though none had been burned. The stone floor trembled. And from the depths of the Shiva Linga, a voice spoke — deep as thunder, gentle as rain.

"I am pleased."

The couple fell prostrate. The wife could not breathe. The husband's hands shook so violently that the puja bell fell from his fingers.

"Your devotion has pierced through all the worlds and reached me on Mount Kailash," Lord Shiva's voice continued. "I shall grant you a son. He will be beautiful, intelligent, and virtuous. He will be the light of your old age."

The wife raised her tear-stained face. "O Mahadeva," she whispered, "there are no words —"

"But hear me well," Shiva interrupted, and his voice carried the weight of cosmic law. "This son will live only twelve years. On the day he completes twelve years of age, he will leave this world. This is written in the book of Chitragupta, and even I do not erase what is written there without cause. Accept this boon with full knowledge of its condition."

The couple looked at each other. In that look was an entire lifetime of pain, hope, and a question that had no easy answer: Is twelve years of parenthood worth an eternity of grief?

The wife spoke first. "We accept, O Lord," she said, her voice steady despite her streaming eyes. "Twelve years of a child's love is more than a thousand years of emptiness. We will cherish every moment as if it were the last."

And so it came to pass. Within the year, a son was born to them — a boy so beautiful that the village midwife said she had never seen such a child. His eyes were large and luminous, the colour of dark honey. His laughter was like temple bells. They named him Dhruva, after the pole star — the one light that never moves, the one certainty in the spinning sky.

Dhruva grew as children grow — too fast for those who love them. He walked at nine months, spoke at one year, and by three was already asking questions about the stars that kept the village pandit up at night trying to formulate answers. By five, he could recite the Gayatri Mantra with perfect pronunciation. By eight, he was helping his father perform the village ceremonies. By ten, his reputation as a young prodigy had spread to the neighbouring kingdoms.

But for his parents, each birthday was both a celebration and a countdown. Eleven years passed. Then eleven and a half. The mother would sometimes freeze mid-task, staring at her son with an intensity that frightened him. "Why do you look at me like that, Ma?" he would ask. "Because you are beautiful," she would reply, and turn away to hide her tears.

When Dhruva turned twelve, the father made a decision born of both faith and desperation. He told his wife: "We shall send Dhruva to Kashi — to the great seat of learning. There, in the city of Shiva himself, surrounded by the most powerful temples and the most learned saints, perhaps the Lord's own mercy will find a way to extend our son's life. At the very least, if the prophecy is to be fulfilled, let it happen in the holiest city on earth, where even death leads to liberation."

The mother wept but agreed. They packed provisions for the journey and gave Dhruva enough gold to sustain himself. "Study well," the father said, his voice breaking. "And worship Shiva every day. Never forget who gave you this life."

Dhruva set out on the long road to Kashi. He travelled through forests and across rivers, through villages and past ancient ruins. One evening, he stopped at a prosperous town where a great commotion was underway. Banners flew from every rooftop. Musicians played in the streets. A wedding was being celebrated — the daughter of the wealthiest merchant in the region was being married.

But as Dhruva approached, he sensed something wrong. The music had a strained quality. The faces of the merchant's family were tight with anxiety, not relaxed with joy. As he inquired at a tea stall, the old shopkeeper told him the terrible secret: "The groom died this morning. A sudden fever. But the baraat has already arrived from a distant city, and the astrologer has declared that this precise muhurta is the only auspicious time for the next twelve years. If the girl is not married now, she will remain unwed. The family is in despair."

The merchant, a shrewd but desperate man, spotted Dhruva passing through the town. The boy was handsome, clearly well-born, and of Brahmin family. The merchant rushed to him. "Young sir, I have a proposal that may seem strange. My daughter's groom has died, and the auspicious hour passes within the hour. Will you stand in as the groom? I will give you a handsome dowry, and you may continue your journey afterward."

Dhruva, whose twelve-year death sentence had given him a strange fearlessness about the future, thought: "What difference does it make? If I am to die soon, at least this girl will not suffer the stigma of remaining unmarried. And if by some miracle I live, I shall have a companion."

He agreed. The wedding was performed with hasty but proper rituals. The merchant's daughter, Shobhana, was a girl of grace and intelligence. When Dhruva explained his situation — that he was en route to Kashi and might not return — she said simply: "Then I shall wait. A wife's duty does not expire."

Dhruva continued to Kashi. And there, in the city of light, on the ghats of the sacred Ganga, he performed Shiva puja with a devotion that surpassed even his parents'. Every morning, before dawn, he would descend the stone steps to the river, bathe in the cold water as the mist rose from the surface, and walk dripping to the Kashi Vishwanath temple. He would offer bilva leaves until his hands were stained green. He would pour milk over the Linga until the floor was white. He would chant "Om Namah Shivaya" until his voice became a mere vibration in his chest, beyond words, beyond sound — a pure resonance between his soul and the divine.

The priests of Kashi Vishwanath noticed. The sadhus noticed. Even the stones of the temple seemed to vibrate differently when Dhruva prayed. One old priest, whose eyes could see things beyond the physical, said: "This boy carries death on his shoulder like a garland. But his devotion is building a bridge to eternity."

On the day Dhruva completed twelve years — the exact day, the exact hour foretold by Shiva — the messengers of Yama descended. But they could not approach. Around Dhruva, as he sat in deep meditation before the Shiva Linga, a circle of divine light had formed — the accumulated radiance of a thousand Monday fasts performed by his parents and his own unwavering devotion in Kashi. The light was so intense that Yama's messengers recoiled.

Yama himself appeared. The Lord of Death, mounted on his black buffalo, stood at the temple gate. "I have come for the boy," he declared. "His time is written."

But from the Shiva Linga, a voice spoke — the same voice that had spoken to the parents years ago: "This boy's time was written for twelve years. But his parents purchased those years with sixteen Mondays of perfect devotion, and the boy himself has multiplied that devotion a hundredfold. I now rewrite what was written. Dhruva shall live a full and long life. Return to your abode, Yama. This soul belongs to me."

Yama bowed. The Lord of Death bowed to the Lord of Destruction, for even death obeys Shiva. He turned his buffalo and departed, and the book of Chitragupta was silently amended.

Dhruva opened his eyes to find the temple flooded with light and the priests weeping with joy. He did not know what had happened, but he felt a lightness in his chest — as though a weight he had carried his entire life had been lifted without his noticing.

He returned to his parents, who had spent the day in agonized prayer, convinced their son was dead. When they saw him walking up the village path, healthy and smiling, the mother collapsed and had to be carried to a cot. The father simply stood in the doorway, unable to move, as tears carved channels through the dust on his face.

Dhruva brought his bride Shobhana to his village. They lived together for many decades — prosperous, blessed with children and grandchildren, and devoted to Lord Shiva until their last breath. Every Monday, without exception, the entire family gathered for the Somvar Vrat, and the story of Dhruva's salvation was told and retold until it became a legend that spread across all of Bharatavarsha.

Thus ends the chapter. The lesson is eternal: Lord Shiva rewards unwavering devotion with miracles that overwrite destiny itself. Even the book of death can be revised when a devotee's faith is absolute. Observe the Somvar Vrat with sincerity, and no fate is truly fixed.`,
          hi: `एक विशाल पर्वत की तलहटी में बसे छोटे गांव में एक अनुकरणीय सद्गुणी ब्राह्मण दम्पती रहता था। पति वेदों का विद्वान था, अपनी विद्वत्ता और सत्यनिष्ठा के लिए पूरे क्षेत्र में सम्मानित। उसकी पत्नी गहन श्रद्धा की स्त्री थी, जिसकी भगवान शिव की दैनिक पूजा सूर्योदय जितनी नियमित थी। वे सादा जीवन जीते थे — घर साधारण, भोजन सरल, किन्तु एक-दूसरे और ईश्वर के प्रति उनका प्रेम अपरिमित था।

किन्तु इतनी धर्मनिष्ठा के बावजूद, एक शोक उनके जीवन पर अनन्त बादल की भांति मंडरा रहा था: उनकी कोई सन्तान नहीं थी। वर्ष-दर-वर्ष उन्होंने प्रार्थना की। सौ कोस के भीतर प्रत्येक शिव मन्दिर में गए। प्रत्येक विहित अनुष्ठान किया — सन्तान गोपाल मन्त्र, पुत्र कामेष्टि यज्ञ, प्रत्येक पवित्र नदी पर अर्पण। कुछ भी कारगर नहीं हुआ। पत्नी रात में चुपचाप रोती, और पति उसे ऐसे शब्दों से सान्त्वना देता जिन पर वह स्वयं कठिनता से विश्वास करता: "भगवान की कोई योजना है। हमें धैर्य रखना चाहिए।"

किन्तु धैर्य की भी सीमा होती है, भक्तों के लिए भी। जब पन्द्रह वर्ष का विवाह सन्तान के आशीर्वाद के बिना बीत गया, दम्पती ने एक अन्तिम, बेचैन संकल्प किया। वे सोलह सोमवार व्रत करेंगे — भगवान शिव के सम्मान में सोलह लगातार सोमवार का उपवास — ऐसे पूर्ण समर्पण से कि स्वयं स्वर्ग को उत्तर देना पड़ेगा।

और इस प्रकार उन्होंने आरम्भ किया। प्रत्येक सोमवार, प्रथम प्रभात की किरण पर्वत शिखरों को छूने से पहले, दम्पती उठते, गांव के कुएं से ठण्डे जल से स्नान करते, और नंगे पांव पहाड़ी पर स्थित प्राचीन शिव मन्दिर तक चलकर जाते। पति स्वयं अभिषेक करता — पुराने पत्थर के शिवलिंग पर दूध, जल, मधु और दही उड़ेलते हुए रुद्रम् का पाठ करता। पत्नी सूर्योदय पर एकत्र किए बिल्वपत्र अर्पित करती, एक-एक गिनकर — सदा विषम संख्या, सदा ताजे, सदा डण्ठल अपनी ओर रखकर जैसा शास्त्रों में विधान है। वे श्वेत पुष्प, धतूरा और विभूति अर्पित करते। वे घी का दीया जलाते जो पर्वतीय हवा में भी स्थिर रहता, और ध्यान में बैठकर "ॐ नमः शिवाय" का जाप करते जब तक सूर्य ऊंचा न चढ़ जाए।

वे सूर्यास्त तक कुछ नहीं खाते — और तब भी केवल फल और दूध। कोई अनाज, कोई नमक, कोई पका हुआ भोजन किसी भी सोमवार को उनके होंठों को नहीं छूता। पड़ोसी उन्हें पागल समझते थे। "सोलह सप्ताह ऐसी तपस्या?" वे फुसफुसाते। "इस उम्र में? व्यर्थ में अपना स्वास्थ्य नष्ट कर लेंगे।" किन्तु दम्पती ने कोई ध्यान नहीं दिया। उनकी दृष्टि शिवलिंग पर स्थिर थी, और उनका हृदय अपनी प्रार्थना पर।

सोलहवें सोमवार को, जब उन्होंने भक्ति के अश्रुओं से भीगे चेहरों के साथ अन्तिम पूजा पूर्ण की, घी के दीये की ज्वाला अचानक ऊपर की ओर भभक उठी — एक पुरुष की ऊंचाई तक, कोई ताप नहीं किन्तु ऐसा प्रकाश विकीर्ण करती जो इस लोक का नहीं था। मन्दिर चन्दन और कपूर की सुगन्ध से भर गया, यद्यपि कुछ भी जलाया नहीं गया था। पत्थर का फर्श कांपा। और शिवलिंग की गहराई से एक वाणी बोली — मेघ-गर्जना सी गम्भीर, वर्षा सी कोमल।

"मैं प्रसन्न हूं।"

दम्पती साष्टांग गिर पड़े। पत्नी श्वास नहीं ले पा रही थी। पति के हाथ इतने कांपे कि पूजा की घण्टी उंगलियों से गिर गई।

"तुम्हारी भक्ति ने समस्त लोकों को भेदकर कैलाश पर मुझ तक पहुंच गई है," भगवान शिव की वाणी ने कहा। "मैं तुम्हें पुत्र प्रदान करता हूं। वह सुन्दर, बुद्धिमान और गुणवान होगा। वह तुम्हारे वृद्धावस्था का प्रकाश होगा।"

पत्नी ने अश्रु-सिक्त मुख उठाया। "हे महादेव," उसने फुसफुसाया, "शब्द नहीं हैं —"

"किन्तु ध्यान से सुनो," शिव ने बीच में कहा, और उनकी वाणी में ब्रह्माण्डीय विधान का भार था। "यह पुत्र केवल बारह वर्ष जीवित रहेगा। जिस दिन वह बारह वर्ष पूर्ण करेगा, वह इस संसार से चला जाएगा। यह चित्रगुप्त की पुस्तक में लिखा है, और बिना कारण मैं भी वहां लिखा हुआ नहीं मिटाता। इस वरदान को उसकी शर्त के पूर्ण ज्ञान के साथ स्वीकार करो।"

दम्पती ने एक-दूसरे को देखा। उस दृष्टि में पीड़ा, आशा, और एक ऐसे प्रश्न का पूरा जीवन था जिसका सरल उत्तर नहीं था: क्या बारह वर्ष का पितृत्व अनन्त शोक के योग्य है?

पत्नी पहले बोली। "हम स्वीकार करते हैं, हे प्रभु," उसने कहा, बहती आंखों के बावजूद स्थिर स्वर में। "एक सन्तान के प्रेम के बारह वर्ष रिक्तता के सहस्र वर्षों से अधिक हैं। हम प्रत्येक क्षण को ऐसे संजोएंगे जैसे वह अन्तिम हो।"

और ऐसा ही हुआ। वर्ष भर के भीतर, उन्हें पुत्र रत्न की प्राप्ति हुई — इतना सुन्दर बालक कि गांव की दाई ने कहा उसने ऐसा शिशु कभी नहीं देखा। उसकी आंखें बड़ी और दीप्तिमान थीं, गहरे शहद के रंग की। उसकी हंसी मन्दिर की घण्टियों जैसी थी। उन्होंने उसका नाम ध्रुव रखा — ध्रुव तारे के नाम पर — वह एक प्रकाश जो कभी नहीं हिलता, घूमते आकाश में एक निश्चितता।

ध्रुव वैसे बढ़ा जैसे बच्चे बढ़ते हैं — उन्हें प्यार करने वालों के लिए बहुत तेजी से। नौ महीने में चला, एक वर्ष में बोला, और तीन वर्ष की आयु तक तारों के बारे में ऐसे प्रश्न पूछने लगा जिनके उत्तर गढ़ने में गांव के पण्डित को रातें जागनी पड़ती थीं। पांच वर्ष तक, वह शुद्ध उच्चारण से गायत्री मन्त्र पढ़ सकता था। आठ तक, पिता को गांव के संस्कार करने में सहायता कर रहा था। दस तक, युवा प्रतिभाशाली के रूप में उसकी ख्याति पड़ोसी राज्यों तक फैल गई थी।

किन्तु उसके माता-पिता के लिए, प्रत्येक जन्मदिन उत्सव और उलटी गिनती दोनों था। ग्यारह वर्ष बीते। फिर साढ़े ग्यारह। माता कभी-कभी काम करते-करते ठिठक जाती, अपने पुत्र को ऐसी तीव्रता से देखती जो उसे डरा देती। "आप मुझे ऐसे क्यों देखती हैं, मां?" वह पूछता। "क्योंकि तू सुन्दर है," वह उत्तर देती, और अपने अश्रु छिपाने मुड़ जाती।

जब ध्रुव बारह वर्ष का हुआ, पिता ने श्रद्धा और हताशा दोनों से जन्मा निर्णय लिया। उसने पत्नी से कहा: "हम ध्रुव को काशी भेजेंगे — महान विद्या-पीठ में। वहां, स्वयं शिव की नगरी में, सबसे शक्तिशाली मन्दिरों और सबसे विद्वान सन्तों से घिरे, शायद प्रभु की स्वयं की करुणा हमारे पुत्र का जीवन बढ़ाने का मार्ग खोज ले। कम से कम, यदि भविष्यवाणी पूर्ण होनी है, तो वह पृथ्वी की सबसे पवित्र नगरी में हो, जहां मृत्यु भी मोक्ष की ओर ले जाती है।"

माता रोई किन्तु सहमत हुई। उन्होंने यात्रा का सामान बांधा और ध्रुव को पर्याप्त स्वर्ण दिया। "अच्छे से पढ़ना," पिता ने भर्राई वाणी में कहा। "और प्रतिदिन शिव की पूजा करना। कभी मत भूलना किसने तुम्हें यह जीवन दिया।"

ध्रुव काशी की लम्बी राह पर चल पड़ा। वह वनों से और नदियों के पार, गांवों से और प्राचीन खण्डहरों के पास होकर गया। एक सन्ध्या, वह एक समृद्ध नगर में रुका जहां बड़ा हलचल मचा हुआ था। प्रत्येक छत पर पताकाएं लहरा रही थीं। गलियों में संगीतकार बजा रहे थे। एक विवाह मनाया जा रहा था — क्षेत्र के सबसे धनी व्यापारी की पुत्री का विवाह था।

किन्तु जैसे ही ध्रुव निकट पहुंचा, उसे कुछ गलत लगा। संगीत में तनाव था। व्यापारी के परिवार के चेहरे आनन्द से शिथिल नहीं, चिन्ता से तने हुए थे। जब उसने एक चाय की दुकान पर पूछताछ की, बूढ़े दुकानदार ने उसे भयंकर रहस्य बताया: "वर आज सुबह मर गया। अचानक ज्वर। किन्तु बारात दूर के नगर से पहले ही आ चुकी है, और ज्योतिषी ने घोषणा की है कि यह सटीक मुहूर्त अगले बारह वर्षों में एकमात्र शुभ समय है। यदि कन्या अभी विवाहित नहीं हुई, तो अविवाहित रह जाएगी। परिवार हताश है।"

व्यापारी, एक चतुर किन्तु हताश व्यक्ति, ने नगर से गुजरते ध्रुव को देखा। बालक सुन्दर था, स्पष्ट रूप से कुलीन, और ब्राह्मण परिवार का। व्यापारी दौड़कर उसके पास आया। "हे युवक, मेरा एक प्रस्ताव है जो विचित्र लग सकता है। मेरी पुत्री का वर मर गया है, और शुभ मुहूर्त एक घण्टे में बीत जाएगा। क्या आप वर के रूप में खड़े होंगे? मैं आपको अच्छा दहेज दूंगा, और आप बाद में अपनी यात्रा जारी रख सकते हैं।"

ध्रुव, जिसके बारह वर्ष के मृत्यु-दण्ड ने उसे भविष्य के प्रति एक विचित्र निर्भयता दी थी, ने सोचा: "क्या फर्क पड़ता है? यदि मुझे शीघ्र मरना है, तो कम से कम यह कन्या अविवाहित रहने के कलंक से बचेगी। और यदि किसी चमत्कार से मैं जीवित रहा, तो मेरे पास एक संगिनी होगी।"

उसने स्वीकार किया। विवाह शीघ्र किन्तु उचित अनुष्ठानों से सम्पन्न हुआ। व्यापारी की पुत्री शोभना शालीन और बुद्धिमती कन्या थी। जब ध्रुव ने अपनी स्थिति समझाई — कि वह काशी जा रहा है और शायद लौटे नहीं — उसने सरलता से कहा: "तो मैं प्रतीक्षा करूंगी। पत्नी का कर्तव्य समाप्त नहीं होता।"

ध्रुव काशी पहुंचा। और वहां, प्रकाश की नगरी में, पवित्र गंगा के घाटों पर, उसने शिव पूजा ऐसी भक्ति से की जो उसके माता-पिता की भी पार कर गई। प्रत्येक प्रातः, भोर से पहले, वह पत्थर की सीढ़ियों से नदी में उतरता, सतह से उठती धुन्ध में ठण्डे जल से स्नान करता, और भीगते हुए काशी विश्वनाथ मन्दिर तक चलता। वह बिल्वपत्र अर्पित करता जब तक उसके हाथ हरे न हो जाएं। शिवलिंग पर दूध उंडेलता जब तक फर्श श्वेत न हो जाए। "ॐ नमः शिवाय" का जाप करता जब तक उसकी वाणी छाती में मात्र एक कम्पन न बन जाए, शब्दों से परे, ध्वनि से परे — उसकी आत्मा और दिव्य के बीच एक शुद्ध अनुनाद।

काशी विश्वनाथ के पुजारियों ने ध्यान दिया। साधुओं ने ध्यान दिया। मन्दिर के पत्थर भी जब ध्रुव प्रार्थना करता तो भिन्न प्रकार से कम्पित होते लगते थे। एक वृद्ध पुजारी, जिसकी दृष्टि भौतिक से परे देख सकती थी, ने कहा: "यह बालक अपने कन्धे पर मृत्यु माला की भांति लिए चलता है। किन्तु उसकी भक्ति अनन्त की ओर सेतु बना रही है।"

जिस दिन ध्रुव ने बारह वर्ष पूर्ण किए — ठीक वही दिन, ठीक वही घड़ी जो शिव ने कही थी — यम के दूत उतरे। किन्तु वे निकट नहीं आ सके। ध्रुव के चारों ओर, जो शिवलिंग के सामने गहन ध्यान में बैठा था, दिव्य प्रकाश का एक वृत्त बन गया था — उसके माता-पिता द्वारा सहस्र सोमवार के उपवासों और काशी में उसकी स्वयं की अटल भक्ति की संचित आभा। प्रकाश इतना तीव्र था कि यम के दूत पीछे हट गए।

स्वयं यम प्रकट हुए। मृत्यु के देवता, अपने काले महिष पर आरूढ़, मन्दिर के द्वार पर खड़े थे। "मैं इस बालक के लिए आया हूं," उन्होंने घोषणा की। "उसका समय लिखा हुआ है।"

किन्तु शिवलिंग से एक वाणी बोली — वही वाणी जो वर्षों पूर्व माता-पिता से बोली थी: "इस बालक का समय बारह वर्ष लिखा गया था। किन्तु उसके माता-पिता ने वे वर्ष सोलह सोमवार की पूर्ण भक्ति से खरीदे, और बालक ने स्वयं उस भक्ति को सौ गुना बढ़ाया। मैं अब लिखे हुए को पुनः लिखता हूं। ध्रुव पूर्ण और दीर्घ जीवन जिएगा। अपने धाम लौट जाओ, यम। यह आत्मा मेरी है।"

यम ने प्रणाम किया। मृत्यु के देवता ने विनाश के देवता को प्रणाम किया, क्योंकि मृत्यु भी शिव का आज्ञापालन करती है। उन्होंने अपना महिष मोड़ा और चले गए, और चित्रगुप्त की पुस्तक मौन रूप से संशोधित हो गई।

ध्रुव ने आंखें खोलीं तो मन्दिर प्रकाश से भरा था और पुजारी आनन्द से रो रहे थे। उसे नहीं पता था क्या हुआ, किन्तु उसने अपनी छाती में एक हल्कापन अनुभव किया — जैसे कोई भार जो उसने पूरा जीवन उठाया था, बिना उसकी जानकारी के उतर गया हो।

वह अपने माता-पिता के पास लौटा, जिन्होंने पूरा दिन पीड़ा भरी प्रार्थना में बिताया था, विश्वास करते हुए कि उनका पुत्र मर गया। जब उन्होंने उसे गांव की पगडण्डी पर स्वस्थ और मुस्कुराता हुआ चलते देखा, माता बेहोश होकर गिर पड़ी और उसे खाट पर ले जाना पड़ा। पिता बस दरवाजे में खड़ा रहा, हिलने में असमर्थ, जैसे-जैसे अश्रु उसके चेहरे की धूल में रास्ते बनाते गए।

ध्रुव अपनी वधू शोभना को गांव ले आया। वे कई दशकों तक साथ रहे — समृद्ध, सन्तान और पोते-पोतियों से सुखी, और अन्तिम श्वास तक भगवान शिव के प्रति समर्पित। प्रत्येक सोमवार, बिना अपवाद, सम्पूर्ण परिवार सोमवार व्रत के लिए एकत्र होता, और ध्रुव के उद्धार की कथा बार-बार सुनाई जाती जब तक वह एक किंवदन्ती न बन गई जो सम्पूर्ण भारतवर्ष में फैल गई।

इति अध्याय सम्पूर्ण। शिक्षा शाश्वत है: भगवान शिव अटल भक्ति को ऐसे चमत्कारों से पुरस्कृत करते हैं जो स्वयं भाग्य को पुनः लिखते हैं। मृत्यु की पुस्तक भी संशोधित हो सकती है जब भक्त की श्रद्धा पूर्ण हो। सोमवार व्रत को सच्चे हृदय से करो, और कोई भाग्य सचमुच अटल नहीं है।`,
        },
      },
    ],
    relatedAartis: ['shiva-aarti'],
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
    samagri: {
      en: [
        'Sindoor (vermillion)',
        'Sesame oil lamp',
        'Red flowers (hibiscus, marigold)',
        'Laddoo or boondi prasad',
        'Red cloth for offering',
      ],
      hi: [
        'सिन्दूर',
        'तिल के तेल का दीया',
        'लाल पुष्प (गुड़हल, गेंदा)',
        'लड्डू या बूंदी प्रसाद',
        'अर्पण के लिए लाल वस्त्र',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Devotion of Hanuman and the Poor Woman\'s Lamp',
          hi: 'प्रथम अध्याय — हनुमान की भक्ति और निर्धन स्त्री का दीया',
        },
        content: {
          en: `In a village so small that it had no name on any map, there lived a poor woman named Savitri. She was a widow — her husband had died young, leaving her with two small children, a crumbling mud house, and not a single coin to her name. Her neighbours pitied her, but pity does not fill empty stomachs. Each day, Savitri would walk to the nearby town to work as a domestic servant in the houses of the wealthy, earning barely enough for a single meal of thin gruel and rotis for her family.

Despite her poverty, Savitri possessed something that many wealthy people lack — an unshakeable faith. In the corner of her small house, she had placed a small stone that she had painted orange with turmeric and kumkum. This was her Hanuman — not a proper murti from a temple shop, but a stone she had found by the river, smooth and roughly the shape of a kneeling figure. To the world, it was a river pebble. To Savitri, it was Bajrangbali himself.

Every Tuesday without fail, Savitri would wake an hour before dawn, bathe in cold water — even in winter, when the well water made her bones ache — and sit before her orange stone. She would light a small diya made from a clay lamp she had fashioned herself, filled with the cheapest sesame oil she could afford. Sometimes, when even oil was beyond her means, she would burn a wick dipped in leftover cooking grease. She would apply a dot of sindoor to the stone — sindoor she mixed from the powder given free at the town's Hanuman temple. And she would recite the Hanuman Chalisa from memory, her voice cracked and thin but steady as a heartbeat.

"Jai Hanuman gyan gun sagar," she would begin, and her two children, still half asleep on their thin mat, would hear their mother's voice weaving through the pre-dawn darkness like a thread of warmth.

She had no flowers to offer — flowers cost money. She had no laddoos — sugar and ghee were luxuries. She had no red cloth — her own clothes were patched and faded. But she offered what she had: her voice, her tears, her absolute conviction that Hanuman was listening.

The years passed. Savitri's children grew. Her son, though bright, could not attend school because the fees were beyond their reach. Her daughter helped with the housework and learned to cook with whatever scraps they could gather. The poverty did not lift. The prayers seemed unanswered. Her neighbours began to mock her: "Where is your Hanuman now? You have prayed every Tuesday for seven years and still cannot afford two meals a day. Perhaps your stone is sleeping."

Savitri's answer was always the same. She would smile — a smile that held no bitterness, only a patience that the mockers could not understand — and say: "Bajrangbali does not owe me anything. I do not pray for wealth. I pray because he deserves my prayer."

One Tuesday, as Savitri was performing her modest puja, she noticed that her sesame oil had run out. Not a single drop remained. The next market day was three days away, and she had no money to buy oil before then. For the first time in seven years, she faced the prospect of a Tuesday without a lit diya for Hanuman.

She sat before the orange stone and wept. Not for herself — she had long since stopped weeping for her own condition — but for the shame of coming to her Lord without even a lamp. "Forgive me, Bajrangbali," she whispered. "Today I have nothing. Not even oil. But my heart is your lamp, and it will never go out."

At that moment, her daughter came running in from outside. "Amma! Come quickly! The old banyan tree at the edge of the village — it fell in last night's storm, and its roots have torn up the earth!" Savitri, wiping her eyes, followed her daughter.

At the base of the fallen banyan, where the massive root ball had ripped from the ground, a hole had opened in the earth. And in that hole, gleaming dully in the morning light, was a brass pot — ancient, green with age, its lid sealed with beeswax. The villagers gathered around, curious but afraid. No one dared touch it.

Savitri, with a practical courage born of having nothing to lose, climbed down into the hole and lifted the pot. It was heavy — far heavier than brass alone would account for. She pried off the lid. Inside were gold coins — hundreds of them, stamped with the seal of a kingdom that had ceased to exist centuries ago. This was a raja's treasure, buried during some long-forgotten invasion and never recovered.

The village erupted. The headman tried to claim the treasure for the village fund. A local landlord insisted it belonged to him because the tree was on his land. But the village pandit, an honest old man, consulted the dharma shastras and declared: "The treasure was found by this woman. By dharmic law and by civil custom, it belongs to her and her children."

And so Savitri, who had never complained, who had never demanded anything from her God, who had offered sesame oil and sindoor when she had nothing else — was blessed with wealth that transformed her family's life. She built a proper house. She sent her son to the best school in the region. She arranged her daughter's marriage with dignity. And she built a small Hanuman temple in the village — not grand, but beautiful, with a proper murti, a proper lamp that burned day and night with the finest sesame oil, and red flags that flew in the wind.

But here is the part of the story that matters most, and the part that the people of that village still tell to this day.

When the temple was built and the murti installed, Savitri placed her old orange stone beside the proper murti. The priest protested: "This is a river pebble, not a deity. It does not belong in a temple."

Savitri looked at the priest with those quiet, steady eyes and said: "This stone heard my prayers when no one else would listen. It stayed with me when the world turned away. If Hanuman lives in the murti you bought from the market, he surely lives in the stone that received seven years of my tears. Both stay, or neither stays."

The priest relented. And the people who visited that temple over the years reported something strange: the proper murti was beautiful, well-crafted, decorated with garlands and ornaments. But it was the old orange stone that seemed to radiate warmth. It was before the stone that the most desperate prayers were offered. It was the stone that people touched when they needed courage.

For that is the truth of Hanuman's devotion that this katha teaches. The great Bajrangbali was himself born on a Tuesday — the day of Mars, the planet of courage and action. His entire life was an offering. When Lord Rama needed a bridge to Lanka, Hanuman did not say "I am only a monkey — what can I do?" He carried mountains. When Sita needed proof of Rama's love, Hanuman did not send a messenger — he leapt across the ocean himself. When Lakshmana lay dying, Hanuman did not consult committees — he flew to the Himalayas and brought back the entire mountain because he could not identify the herb.

Hanuman's devotion was total, practical, and absolutely without self-interest. He asked nothing for himself. He sought no reward. He wanted no temple, no hymn, no worshipper. He wanted only to serve. And in that selfless service, he became the most powerful being in creation — more powerful than the gods who sought power, more enduring than the demons who hoarded it.

When you fast on Tuesday, you are not performing a transaction with the divine. You are practicing Hanuman's way of being. You are saying: "I do not fast because I want something. I fast because devotion itself is the reward." Offer what you have — if it is only a clay lamp with cheap oil, it is enough. If it is only a river stone painted with kumkum, it is enough. If it is only your voice, cracked and thin in the pre-dawn darkness, chanting the Chalisa from memory — it is more than enough.

For Hanuman does not measure the value of the offering. He measures the sincerity behind it. And a poor widow's sesame lamp, burning steadily through seven years of hardship, outshines all the gold lamps in all the temples of the world.

Thus ends the chapter. Offer your Tuesday to Hanuman with Savitri's sincerity, and Bajrangbali shall move mountains for you — for that is what he does, and that is who he is.`,
          hi: `इतने छोटे गांव में, जिसका किसी नक्शे पर नाम भी नहीं था, सावित्री नाम की एक निर्धन स्त्री रहती थी। वह विधवा थी — उसका पति युवावस्था में ही चल बसा था, उसे दो छोटे बच्चों, एक जर्जर मिट्टी के घर, और अपने नाम का एक भी सिक्का छोड़कर। पड़ोसी उस पर दया करते, किन्तु दया से खाली पेट नहीं भरता। प्रतिदिन, सावित्री पास के कस्बे में धनी लोगों के घरों में काम करने जाती, इतना कमाती कि बस एक समय की पतली दाल और रोटी का जुगाड़ हो सके।

निर्धनता के बावजूद, सावित्री के पास कुछ ऐसा था जो बहुत से धनी लोगों के पास नहीं होता — एक अटल श्रद्धा। अपने छोटे घर के कोने में, उसने एक छोटा पत्थर रखा था जिसे उसने हल्दी और कुमकुम से नारंगी रंग दिया था। यह उसके हनुमान थे — मन्दिर की दुकान से खरीदी कोई मूर्ति नहीं, बल्कि नदी से मिला एक पत्थर, चिकना और मोटे तौर पर एक घुटने टेके आकृति जैसा। संसार के लिए यह नदी का कंकड़ था। सावित्री के लिए यह स्वयं बजरंगबली थे।

प्रत्येक मंगलवार बिना चूक, सावित्री भोर से एक घण्टा पहले उठती, ठण्डे पानी से स्नान करती — सर्दियों में भी, जब कुएं का पानी हड्डियों तक ठण्ड पहुंचाता — और अपने नारंगी पत्थर के सामने बैठती। वह एक छोटा दीया जलाती जो उसने स्वयं मिट्टी से गढ़ा था, सबसे सस्ते तिल के तेल से भरा। कभी-कभी, जब तेल भी उसकी सामर्थ्य से बाहर होता, वह बची हुई रसोई की चिकनाई में बत्ती डुबोकर जलाती। पत्थर पर सिन्दूर का टीका लगाती — सिन्दूर जो कस्बे के हनुमान मन्दिर से मुफ्त मिले चूर्ण से बनाती। और कण्ठस्थ हनुमान चालीसा का पाठ करती, उसकी वाणी फटी और पतली किन्तु हृदय की धड़कन जैसी स्थिर।

"जय हनुमान ज्ञान गुन सागर," वह आरम्भ करती, और उसके दो बच्चे, अपनी पतली चटाई पर अभी भी अर्ध-निद्रा में, अपनी माता की वाणी सुनते जो भोर-पूर्व अंधकार में ऊष्मा के धागे सी बुनती जाती।

अर्पित करने को फूल नहीं थे — फूलों में पैसा लगता। लड्डू नहीं थे — चीनी और घी विलासिता थी। लाल कपड़ा नहीं था — उसके स्वयं के वस्त्र जोड़-तोड़ के और फीके थे। किन्तु जो था वह अर्पित करती: अपनी वाणी, अपने अश्रु, अपना पूर्ण विश्वास कि हनुमान सुन रहे हैं।

वर्ष बीते। सावित्री के बच्चे बड़े हुए। पुत्र, होनहार होते हुए भी, शाला नहीं जा सकता था क्योंकि शुल्क उनकी पहुंच से बाहर था। पुत्री घर के कामों में सहायता करती और जो भी जुट पाती उसी से पकाना सीखती। निर्धनता नहीं हटी। प्रार्थनाएं अनुत्तरित लगती थीं। पड़ोसी ताने मारने लगे: "कहां है तुम्हारा हनुमान? सात साल हर मंगलवार प्रार्थना की और अभी भी दो वक्त का खाना नसीब नहीं। शायद तुम्हारा पत्थर सो रहा है।"

सावित्री का उत्तर सदा एक-सा होता। वह मुस्कुराती — एक मुस्कान जिसमें कोई कड़वाहट नहीं, केवल एक ऐसा धैर्य जो तानेबाज समझ नहीं सकते थे — और कहती: "बजरंगबली मेरे ऋणी नहीं हैं। मैं धन के लिए प्रार्थना नहीं करती। मैं इसलिए प्रार्थना करती हूं क्योंकि वे मेरी प्रार्थना के योग्य हैं।"

एक मंगलवार, जब सावित्री अपनी विनम्र पूजा कर रही थी, उसने देखा कि तिल का तेल समाप्त हो गया है। एक बूंद भी शेष नहीं। अगला बाजार तीन दिन बाद था, और उसके पास पहले तेल खरीदने के पैसे नहीं थे। सात वर्षों में पहली बार, उसके सामने बिना जले दीये का मंगलवार आने की स्थिति थी।

वह नारंगी पत्थर के सामने बैठी और रोई। अपने लिए नहीं — वह बहुत पहले अपनी दशा के लिए रोना बन्द कर चुकी थी — बल्कि अपने प्रभु के सामने बिना दीये के आने की लज्जा के लिए। "क्षमा करें, बजरंगबली," उसने फुसफुसाया। "आज मेरे पास कुछ नहीं। तेल भी नहीं। किन्तु मेरा हृदय आपका दीया है, और यह कभी नहीं बुझेगा।"

उसी क्षण, उसकी बेटी बाहर से दौड़ती आई। "अम्मा! जल्दी आओ! गांव के किनारे का पुराना बरगद — रात के तूफान में गिर गया, और उसकी जड़ों ने ज़मीन उखाड़ दी है!" सावित्री, आंखें पोंछती हुई, बेटी के पीछे गई।

गिरे हुए बरगद की जड़ पर, जहां विशाल जड़ का गोला ज़मीन से उखड़ा था, पृथ्वी में एक गड्ढा खुल गया था। और उस गड्ढे में, प्रातः के प्रकाश में मन्द चमकता, एक पीतल का पात्र था — प्राचीन, जंग से हरा, उसका ढक्कन मोम से सील। गांववाले चारों ओर जमा हुए, जिज्ञासु किन्तु भयभीत। किसी की हिम्मत नहीं हुई छूने की।

सावित्री ने, खोने को कुछ न होने से उपजे व्यावहारिक साहस से, गड्ढे में उतरकर पात्र उठाया। वह भारी था — पीतल अकेले से कहीं अधिक। उसने ढक्कन खोला। भीतर सोने के सिक्के थे — सैकड़ों, उस राज्य की मुहर लगी जो शताब्दियों पहले लुप्त हो गया था। यह किसी राजा का खजाना था, किसी भुला दिए आक्रमण के दौरान गाड़ा गया और कभी बरामद नहीं हुआ।

गांव में हलचल मच गई। मुखिया ने गांव-कोष के लिए खजाने पर दावा जताया। एक स्थानीय ज़मींदार ने कहा यह उसका है क्योंकि पेड़ उसकी ज़मीन पर था। किन्तु गांव के पण्डित, एक ईमानदार वृद्ध, ने धर्मशास्त्रों से परामर्श कर घोषणा की: "खजाना इस स्त्री ने पाया है। धार्मिक विधान और लोक-प्रथा दोनों से, यह इसका और इसके बच्चों का है।"

और इस प्रकार सावित्री, जिसने कभी शिकायत नहीं की, जिसने कभी अपने ईश्वर से कुछ मांगा नहीं, जिसने तिल का तेल और सिन्दूर तब अर्पित किया जब उसके पास और कुछ नहीं था — ऐसी सम्पत्ति से आशीर्वादित हुई जिसने उसके परिवार का जीवन बदल दिया। उसने अच्छा घर बनाया। पुत्र को क्षेत्र की सर्वश्रेष्ठ शाला में भेजा। पुत्री का सम्मानपूर्ण विवाह किया। और गांव में एक छोटा हनुमान मन्दिर बनवाया — भव्य नहीं, किन्तु सुन्दर, उचित मूर्ति के साथ, एक उचित दीया जो दिन-रात उत्तम तिल के तेल से जलता, और लाल ध्वजाएं जो हवा में लहरातीं।

किन्तु कथा का सबसे महत्वपूर्ण भाग यह है, और यही उस गांव के लोग आज भी बताते हैं।

जब मन्दिर बना और मूर्ति स्थापित हुई, सावित्री ने अपना पुराना नारंगी पत्थर उचित मूर्ति के पास रख दिया। पुजारी ने आपत्ति की: "यह नदी का कंकड़ है, देवता नहीं। मन्दिर में इसका स्थान नहीं।"

सावित्री ने पुजारी को अपनी शान्त, स्थिर आंखों से देखा और कहा: "इस पत्थर ने मेरी प्रार्थनाएं तब सुनीं जब कोई और सुनने को तैयार नहीं था। यह तब मेरे साथ रहा जब संसार ने मुंह मोड़ लिया। यदि हनुमान उस मूर्ति में हैं जो आपने बाजार से खरीदी, तो निश्चय ही वे उस पत्थर में भी हैं जिसने मेरे सात वर्षों के अश्रु ग्रहण किए। दोनों रहेंगे, या कोई नहीं रहेगा।"

पुजारी ने स्वीकार किया। और वर्षों में उस मन्दिर में आने वाले लोगों ने कुछ विचित्र बताया: उचित मूर्ति सुन्दर थी, सुगढ़, मालाओं और आभूषणों से सज्जित। किन्तु पुराना नारंगी पत्थर ऊष्मा विकीर्ण करता लगता था। पत्थर के सामने ही सबसे बेचैन प्रार्थनाएं की जाती थीं। जब लोगों को साहस चाहिए होता तो वे पत्थर को छूते थे।

क्योंकि यही हनुमान की भक्ति का सत्य है जो यह कथा सिखाती है। महान बजरंगबली स्वयं मंगलवार को जन्मे — मंगल का दिन, साहस और कर्म का ग्रह। उनका सम्पूर्ण जीवन एक अर्पण था। जब भगवान राम को लंका तक सेतु चाहिए था, हनुमान ने नहीं कहा "मैं तो बस एक वानर हूं — मैं क्या कर सकता हूं?" उन्होंने पर्वत उठाए। जब सीता को राम के प्रेम का प्रमाण चाहिए था, हनुमान ने दूत नहीं भेजा — स्वयं समुद्र लांघकर गए। जब लक्ष्मण मृत्यु-शय्या पर थे, हनुमान ने समितियों से परामर्श नहीं किया — हिमालय उड़कर गए और पूरा पर्वत ही ले आए क्योंकि जड़ी-बूटी पहचान नहीं सके।

हनुमान की भक्ति पूर्ण, व्यावहारिक, और सम्पूर्णतः निःस्वार्थ थी। उन्होंने अपने लिए कुछ नहीं मांगा। कोई पुरस्कार नहीं चाहा। कोई मन्दिर नहीं चाहा, कोई भजन नहीं, कोई पूजक नहीं। वे केवल सेवा चाहते थे। और उसी निःस्वार्थ सेवा में, वे सृष्टि के सबसे शक्तिशाली प्राणी बन गए — उन देवताओं से शक्तिशाली जिन्होंने शक्ति खोजी, उन दानवों से अधिक चिरस्थायी जिन्होंने उसे संचित किया।

जब तुम मंगलवार को उपवास करते हो, तो तुम ईश्वर से कोई सौदा नहीं कर रहे। तुम हनुमान के जीवन-मार्ग का अभ्यास कर रहे हो। तुम कह रहे हो: "मैं इसलिए उपवास नहीं करता कि मुझे कुछ चाहिए। मैं उपवास करता हूं क्योंकि भक्ति स्वयं पुरस्कार है।" जो है वह अर्पित करो — यदि केवल सस्ते तेल का मिट्टी का दीया है, तो पर्याप्त है। यदि केवल कुमकुम से रंगा नदी का पत्थर है, तो पर्याप्त है। यदि केवल तुम्हारी वाणी है, फटी और पतली भोर-पूर्व के अंधेरे में, कण्ठस्थ चालीसा का पाठ करती — तो यह पर्याप्त से भी अधिक है।

क्योंकि हनुमान अर्पण का मूल्य नहीं तौलते। वे उसके पीछे की सच्चाई तौलते हैं। और एक निर्धन विधवा का तिल का दीया, सात वर्षों की कठिनाई में स्थिर जलता हुआ, संसार के सभी मन्दिरों के सभी स्वर्ण दीपों को मात करता है।

इति अध्याय सम्पूर्ण। अपना मंगलवार सावित्री की सच्चाई से हनुमान को अर्पित करो, और बजरंगबली तुम्हारे लिए पर्वत हिला देंगे — क्योंकि वही उनका स्वभाव है, और वही वे हैं।`,
        },
      },
    ],
    relatedAartis: ['hanuman-aarti'],
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
    samagri: {
      en: [
        'Bilva (bael) leaves',
        'Milk, water, honey for abhishek',
        'White flowers',
        'Dhoop (incense) and camphor',
        'Ghee diya and cotton wicks',
        'Vibhuti (sacred ash)',
      ],
      hi: [
        'बिल्वपत्र (बेल पत्र)',
        'अभिषेक के लिए दूध, जल, मधु',
        'श्वेत पुष्प',
        'धूप और कपूर',
        'घी का दीया और रुई की बत्ती',
        'विभूति (पवित्र भस्म)',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Churning of the Ocean and Shiva\'s Sacrifice at Twilight',
          hi: 'प्रथम अध्याय — समुद्र मंथन और संध्या काल में शिव का बलिदान',
        },
        content: {
          en: `In the age before ages, when the universe was younger than memory, the devas and the asuras came together for a purpose that would shake the foundations of all creation. The celestial sage Durvasa — the same whose wrath would later chase King Ambarish — had cursed Indra, and that curse drained the lustre from all the gods. Their strength waned. Their weapons lost their edge. Their kingdoms grew dim and vulnerable. Lakshmi, the goddess of prosperity, withdrew from the heavens entirely, plunging all three worlds into darkness and decay.

In desperation, the devas approached Lord Vishnu. The great preserver, reclining on the cosmic serpent Shesha in the ocean of milk, smiled and said: "You must churn the Kshira Sagara — the ocean of milk. Within its depths lie treasures beyond imagination, including the Amrita, the nectar of immortality, which will restore your power. But the ocean is vast, and the churning will require the help of the asuras. Promise them a share of the Amrita — I will ensure they do not receive it."

And so the greatest collaboration in cosmic history began — and it was built on deception, which guaranteed that it would also be the most dangerous. Mount Mandara was uprooted to serve as the churning rod. Vasuki, the great serpent king, was wrapped around the mountain as the churning rope. The devas held Vasuki's tail, the asuras held his head. And they began to churn.

The churning was not a gentle process. Mount Mandara spun in the ocean with such force that it began to sink into the ocean floor. Lord Vishnu, taking the form of the great turtle Kurma, dived beneath the mountain and supported it on his shell. The ocean roiled. Tidal waves swept across the horizons. The heavens trembled and the earth groaned.

From the churning ocean rose wonders: Kamadhenu, the wish-fulfilling cow; Ucchaisravas, the seven-headed celestial horse; Airavata, the white elephant who would become Indra's mount; the Kalpavriksha, the tree that grants all desires; Chandra, the moon god, who rose pale and luminous; Dhanvantari, the physician of the gods, bearing the pot of Amrita; and Lakshmi herself, radiant and eternal, who chose Vishnu as her consort.

But between the treasures and the nectar, something else emerged — something terrible.

A column of dark vapour rose from the churning depths, and from it materialized a substance that made every being in creation recoil in horror. It was Halahala — the poison of the cosmos, the concentrated essence of all the negativity, all the entropy, all the destructive potential that had accumulated in the ocean since the beginning of time. Its colour was the blue-black of a thunderstorm compressed into liquid form. Its fumes killed birds in mid-flight. Its heat cracked the rocks on the shore. Its mere proximity withered the divine herbs and made the celestial musicians fall silent.

The devas dropped Vasuki's tail and fled. The asuras released his head and scrambled backward. The poison spread. It was not merely a substance — it was an event, a catastrophe unfolding in slow motion. If it touched the ocean of milk, it would contaminate the Amrita. If it reached the atmosphere, it would poison the air of all the worlds. If it seeped into the earth, every living thing would perish. The destruction of the universe was minutes away.

"Who will contain this?" Brahma cried out. "I cannot. My power is creation, not absorption."

Vishnu shook his head. "My dharma is to preserve — but this poison would destroy even me if I absorb it. Its nature is dissolution, the opposite of preservation."

Every eye turned to one being — the one who embodies destruction and transformation, the one who stands at the boundary between existence and void. Lord Shiva.

Shiva had been sitting in meditation on Mount Kailash, observing the churning with the detached awareness of one who sees all of time simultaneously. But now he rose. His third eye, which can reduce worlds to ash, flickered open for a moment. Nandi, his faithful bull, stamped nervously. The ganas — his divine attendants — drew back in awe. Even Parvati, who knew her husband's power better than anyone, felt a tremor of fear.

"I will drink it," Shiva said. His voice was calm, as though he were discussing the weather and not the potential extinction of all existence.

"My lord," Parvati began, her eyes wide, "the Halahala —"

"I know what it is," Shiva replied gently. "It is the darkness of the cosmos. It is everything that creation wishes to forget. And there is only one place in the universe large enough to contain it — my own consciousness."

Shiva descended from Kailash. He walked across the sky, each footstep creating ripples in the fabric of space. He reached the shore of the churning ocean, where the Halahala bubbled and hissed, a lake of liquid death spreading inexorably outward. Without hesitation, without ritual, without even a prayer — for to whom would the God of Gods pray? — Shiva cupped his hands, gathered the Halahala, and raised it to his lips.

He drank. All of it. Every drop of the cosmic poison entered his mouth, flowed down his throat, and burned through his body with a heat that would have vaporized a thousand suns. The devas screamed. The asuras covered their eyes. The earth shook so violently that mountains crumbled and rivers reversed their course.

But Parvati — Shakti incarnate, the power that moves the universe — was faster than fear. In the instant between Shiva drinking the poison and the poison reaching his stomach, she acted. With divine precision, she pressed her hand against Shiva's throat, stopping the Halahala at the neck. The poison could not descend to the stomach, where it would have destroyed even the indestructible. It remained trapped in the throat, burning with an eternal blue flame.

Shiva's throat turned blue — the deep, luminous blue of a midnight sky, the blue of the deepest ocean trench, the blue of the space between stars. From that moment, he became Neelakantha — the Blue-Throated One, the god who carries the poison of the universe in his own body so that creation may survive.

The universe exhaled. The churning resumed. The Amrita was eventually obtained, and through Vishnu's Mohini avatar, was distributed only to the devas. But that is another story.

The poison in Shiva's throat burned without ceasing. It was not a wound that could heal. It was not a condition that could be treated. It was a permanent sacrifice — an eternal act of absorption, a continuous willingness to hold the darkness so that the light could exist. Shiva's body cooled the poison enough to prevent it from destroying creation, but the pain was constant. Even the God of Destruction can feel pain when he chooses to.

And the hour at which this great act occurred — the twilight hour, the transition between day and night, the boundary moment when the sun has set but darkness has not yet fully claimed the sky — became the Pradosh Kaal. In that liminal window, the barrier between the mortal world and Shiva's consciousness is thinnest. Prayer offered during Pradosh Kaal reaches Shiva with the directness of a flame touching fuel.

Nandi, Shiva's eternal bull and most devoted attendant, witnessed the entire event. Overcome with devotion, Nandi performed a penance that lasted millennia, during which he stood motionless on one leg, facing the Shiva Linga, chanting the Rudram ceaselessly. When Shiva asked what boon he desired, Nandi said: "Lord, grant that any devotee who worships you during the Pradosh Kaal on Trayodashi shall receive your swiftest blessing — swifter than any other time, swifter than even Shivaratri."

Shiva, moved by his faithful attendant's selfless request — for Nandi asked nothing for himself — granted the boon. "So be it. The Pradosh Kaal of Trayodashi shall be my most accessible hour. Whoever fasts through the day and worships me during this twilight window, with bilva leaves and milk and the Rudram on their lips, shall find me closer than their own breath."

And so the Pradosh Vrat was established — not merely as a fast, but as a commemoration of the greatest sacrifice in cosmic history. When you fast on Trayodashi and worship Shiva at twilight, you are remembering the moment when creation itself was saved by one being's willingness to swallow poison. You are standing at the same shore, in the same hour, offering your prayers to the Blue-Throated One who carries the darkness of the universe so that you may live in its light.

Thus ends the chapter. Worship Shiva during Pradosh Kaal with the knowledge that his throat still burns with the poison he drank for you, and let your devotion be the cooling balm that eases his eternal sacrifice.`,
          hi: `युगों से पहले के युग में, जब ब्रह्माण्ड स्मृति से भी युवा था, देवताओं और असुरों ने एक ऐसे उद्देश्य के लिए एकत्र होकर कार्य किया जो समस्त सृष्टि की नींव हिला देने वाला था। दिव्य ऋषि दुर्वासा — वही जिनका क्रोध बाद में राजा अम्बरीष का पीछा करेगा — ने इन्द्र को शाप दिया था, और उस शाप ने सभी देवताओं का तेज निचोड़ लिया। उनकी शक्ति क्षीण हो गई। उनके अस्त्र अपनी धार खो बैठे। उनके राज्य मन्द और असुरक्षित हो गए। लक्ष्मी, समृद्धि की देवी, स्वर्ग से पूर्णतः चली गईं, तीनों लोकों को अन्धकार और ह्रास में डुबोते हुए।

हताश होकर, देवताओं ने भगवान विष्णु से सम्पर्क किया। महान पालनकर्ता, क्षीर सागर में शेषनाग पर विराजमान, मुस्कुराये और बोले: "तुम्हें क्षीर सागर का मंथन करना होगा। इसकी गहराइयों में कल्पना से परे खजाने छिपे हैं, जिनमें अमृत भी है — अमरत्व का सुधा, जो तुम्हारी शक्ति पुनः स्थापित करेगा। किन्तु सागर विशाल है, और मंथन में असुरों की सहायता चाहिए। उन्हें अमृत में भागीदारी का वचन दो — मैं सुनिश्चित करूंगा कि उन्हें न मिले।"

और इस प्रकार ब्रह्माण्डीय इतिहास का सबसे बड़ा सहयोग आरम्भ हुआ — और यह छल पर आधारित था, जिसने सुनिश्चित किया कि यह सबसे खतरनाक भी होगा। मन्दर पर्वत को मंथन दण्ड के रूप में उखाड़ा गया। वासुकि, महान सर्प राजा, को पर्वत के चारों ओर मंथन रस्सी के रूप में लपेटा गया। देवताओं ने वासुकि की पूंछ पकड़ी, असुरों ने सिर। और मंथन आरम्भ हुआ।

मंथन कोमल प्रक्रिया नहीं थी। मन्दर पर्वत सागर में ऐसी शक्ति से घूमा कि सागर तल में धंसने लगा। भगवान विष्णु ने कूर्म रूप धारण कर पर्वत के नीचे डुबकी लगाई और उसे अपनी पीठ पर सहारा दिया। सागर उफना। ज्वारीय लहरें क्षितिजों तक फैलीं। स्वर्ग कांपा और पृथ्वी कराही।

मंथित सागर से अद्भुत वस्तुएं उत्पन्न हुईं: कामधेनु, इच्छा पूर्ण करने वाली गाय; उच्चैःश्रवा, सात सिरों वाला दिव्य अश्व; ऐरावत, श्वेत गजराज जो इन्द्र का वाहन बनेगा; कल्पवृक्ष, सभी इच्छाएं पूर्ण करने वाला वृक्ष; चन्द्रमा, जो पीला और दीप्तिमान उदित हुए; धन्वन्तरि, देवताओं के वैद्य, अमृत कलश लिए; और स्वयं लक्ष्मी, तेजस्विनी और शाश्वत, जिन्होंने विष्णु को अपना पति चुना।

किन्तु खजानों और अमृत के बीच, कुछ और प्रकट हुआ — कुछ भयंकर।

मंथन की गहराइयों से काले वाष्प का स्तम्भ उठा, और उससे एक ऐसा पदार्थ साकार हुआ जिसने सृष्टि के प्रत्येक प्राणी को भय से पीछे हटा दिया। यह हालाहल था — ब्रह्माण्ड का विष, समय के आरम्भ से सागर में संचित समस्त नकारात्मकता, समस्त क्षय, समस्त विनाशकारी सम्भावना का सान्द्र सार। इसका रंग तूफान का नील-कृष्ण था जो द्रव रूप में संपीड़ित हो। इसके धुएं से पक्षी उड़ान में ही मर गए। इसकी ऊष्मा ने तट की चट्टानें तोड़ दीं। इसकी मात्र निकटता से दिव्य औषधियां मुरझा गईं और दिव्य संगीतकार मौन हो गए।

देवताओं ने वासुकि की पूंछ छोड़कर भागे। असुरों ने सिर छोड़कर पीछे हटे। विष फैला। यह मात्र पदार्थ नहीं था — यह एक घटना थी, धीमी गति में प्रकट होती विपत्ति। यदि यह क्षीर सागर को छूता, अमृत दूषित हो जाता। यदि वायुमण्डल तक पहुंचता, सभी लोकों की वायु विषाक्त हो जाती। यदि पृथ्वी में रिसता, प्रत्येक जीव नष्ट हो जाता। ब्रह्माण्ड का विनाश मिनटों दूर था।

"इसे कौन रोकेगा?" ब्रह्मा चीखे। "मैं नहीं कर सकता। मेरी शक्ति सृजन है, अवशोषण नहीं।"

विष्णु ने सिर हिलाया। "मेरा धर्म संरक्षण है — किन्तु यह विष इसे अवशोषित करने पर मुझे भी नष्ट कर देगा। इसकी प्रकृति विघटन है, संरक्षण का विपरीत।"

सबकी दृष्टि एक प्राणी पर गई — वह जो विनाश और रूपान्तरण का मूर्तरूप है, वह जो अस्तित्व और शून्य की सीमा पर खड़ा है। भगवान शिव।

शिव कैलाश पर्वत पर ध्यान में बैठे मंथन को उस वैराग्यपूर्ण जागरूकता से देख रहे थे जो समय को एक साथ देखती है। किन्तु अब वे उठे। उनका तीसरा नेत्र, जो लोकों को भस्म कर सकता है, एक क्षण के लिए झिलमिलाया। नन्दी, उनका विश्वासपात्र वृषभ, बेचैनी से पैर पटकने लगा। गण — उनके दिव्य परिचारक — भय से पीछे हटे। पार्वती तक, जो अपने पति की शक्ति को किसी से बेहतर जानती थीं, ने भय का कम्पन अनुभव किया।

"मैं इसे पी लूंगा," शिव ने कहा। उनकी वाणी शान्त थी, जैसे वे मौसम की चर्चा कर रहे हों, न कि समस्त अस्तित्व के सम्भावित विनाश की।

"प्रभु," पार्वती ने आरम्भ किया, उनकी आंखें चौड़ी, "हालाहल —"

"मैं जानता हूं यह क्या है," शिव ने कोमलता से उत्तर दिया। "यह ब्रह्माण्ड का अन्धकार है। यह वह सब कुछ है जो सृष्टि भूलना चाहती है। और ब्रह्माण्ड में इसे धारण करने के लिए पर्याप्त विशाल केवल एक स्थान है — मेरी अपनी चेतना।"

शिव कैलाश से उतरे। वे आकाश में चले, प्रत्येक पग से अन्तरिक्ष के ताने-बाने में तरंगें उत्पन्न करते। वे मंथित सागर के तट पर पहुंचे, जहां हालाहल बुलबुलाता और फुफकारता था, द्रव मृत्यु की झील अनवरत बाहर फैलती। बिना हिचकिचाहट, बिना अनुष्ठान, बिना प्रार्थना — क्योंकि देवों के देव किससे प्रार्थना करें? — शिव ने अपने हाथों का अंजलि बनाया, हालाहल एकत्र किया, और अपने होंठों तक उठाया।

उन्होंने पिया। सम्पूर्ण। ब्रह्माण्डीय विष की प्रत्येक बूंद उनके मुख में प्रविष्ट हुई, गले से नीचे बही, और उनके शरीर में ऐसी ऊष्मा से जली जो सहस्र सूर्यों को वाष्पित कर देती। देवता चीखे। असुरों ने आंखें ढकीं। पृथ्वी इतनी प्रचण्डता से हिली कि पर्वत ढहे और नदियों ने अपनी दिशा बदल ली।

किन्तु पार्वती — शक्ति का साक्षात रूप, वह बल जो ब्रह्माण्ड को चलाता है — भय से तेज थीं। शिव के विष पीने और विष के उदर तक पहुंचने के बीच के क्षण में, उन्होंने कार्य किया। दिव्य सटीकता से, उन्होंने अपना हाथ शिव के कण्ठ पर रखा, हालाहल को गले में रोक दिया। विष उदर तक नहीं उतर सका, जहां यह अविनाशी को भी नष्ट कर देता। यह कण्ठ में अटका रहा, शाश्वत नीली ज्वाला से जलता।

शिव का कण्ठ नीला हो गया — मध्यरात्रि के आकाश का गहरा, दीप्तिमान नील, सबसे गहरी सागर खाई का नील, तारों के बीच के अन्तरिक्ष का नील। उस क्षण से, वे नीलकण्ठ बन गए — नील-कण्ठ वाले, वह देव जो ब्रह्माण्ड का विष अपने शरीर में धारण करता है ताकि सृष्टि जीवित रह सके।

ब्रह्माण्ड ने श्वास ली। मंथन पुनः आरम्भ हुआ। अन्ततः अमृत प्राप्त हुआ, और विष्णु के मोहिनी अवतार द्वारा केवल देवताओं को वितरित किया गया। किन्तु वह अलग कथा है।

शिव के कण्ठ में विष अविराम जलता रहा। यह ऐसा घाव नहीं था जो भर सकता। यह ऐसी अवस्था नहीं थी जिसका उपचार हो सकता। यह एक स्थायी बलिदान था — अवशोषण का शाश्वत कर्म, अन्धकार को धारण करने की निरन्तर तत्परता ताकि प्रकाश अस्तित्व में रह सके। शिव का शरीर विष को इतना ठण्डा करता था कि सृष्टि नष्ट न हो, किन्तु पीड़ा निरन्तर थी। विनाश के देवता भी पीड़ा अनुभव कर सकते हैं जब वे चुनें।

और जिस समय यह महान कार्य हुआ — सन्ध्या काल, दिन और रात्रि का सन्धिकाल, वह सीमा-क्षण जब सूर्य अस्त हो चुका है किन्तु अन्धकार ने अभी पूर्णतः आकाश पर अधिकार नहीं किया — वह प्रदोष काल बन गया। उस सीमान्त अवधि में, मर्त्य लोक और शिव की चेतना के बीच का अवरोध सबसे पतला होता है। प्रदोष काल में अर्पित प्रार्थना शिव तक ऐसी सीधेपन से पहुंचती है जैसे ज्वाला ईंधन को छूती है।

नन्दी, शिव के शाश्वत वृषभ और सर्वाधिक भक्त परिचारक, ने सम्पूर्ण घटना देखी। भक्ति से अभिभूत, नन्दी ने सहस्राब्दियों तक चलने वाली तपस्या की, जिसमें वे शिवलिंग की ओर मुख किए एक पैर पर अचल खड़े रहे, अविराम रुद्रम् का पाठ करते। जब शिव ने पूछा कौन-सा वरदान चाहता है, नन्दी ने कहा: "प्रभु, कृपा करें कि जो भी भक्त त्रयोदशी के प्रदोष काल में आपकी पूजा करे, उसे आपका सबसे शीघ्र आशीर्वाद प्राप्त हो — किसी भी अन्य समय से शीघ्र, शिवरात्रि से भी शीघ्र।"

शिव, अपने विश्वासपात्र सेवक की निःस्वार्थ प्रार्थना से द्रवित — क्योंकि नन्दी ने अपने लिए कुछ नहीं मांगा — ने वरदान दिया। "तथास्तु। त्रयोदशी का प्रदोष काल मेरी सर्वाधिक सुलभ घड़ी होगी। जो कोई दिनभर उपवास कर इस सन्ध्या अवधि में मेरी पूजा करेगा, बिल्वपत्र और दूध के साथ और होंठों पर रुद्रम् — वह मुझे अपने श्वास से भी निकट पाएगा।"

और इस प्रकार प्रदोष व्रत स्थापित हुआ — मात्र उपवास के रूप में नहीं, बल्कि ब्रह्माण्डीय इतिहास के सबसे महान बलिदान की स्मृति के रूप में। जब तुम त्रयोदशी को उपवास कर सन्ध्या में शिव की पूजा करते हो, तुम उस क्षण को स्मरण कर रहे हो जब एक प्राणी की विष निगलने की तत्परता से स्वयं सृष्टि बची थी। तुम उसी तट पर, उसी घड़ी में खड़े हो, नीलकण्ठ को अपनी प्रार्थनाएं अर्पित करते हुए जो ब्रह्माण्ड का अन्धकार धारण करते हैं ताकि तुम उसके प्रकाश में जी सको।

इति अध्याय सम्पूर्ण। प्रदोष काल में शिव की पूजा इस ज्ञान के साथ करो कि उनका कण्ठ अभी भी उस विष से जलता है जो उन्होंने तुम्हारे लिए पिया, और अपनी भक्ति को वह शीतल लेप बनने दो जो उनके शाश्वत बलिदान को सान्त्वना दे।`,
        },
      },
    ],
    relatedAartis: ['shiva-aarti'],
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
    samagri: {
      en: [
        'Bilva (bael) leaves',
        'Milk, curd, ghee, honey for abhishek',
        'Water from Ganga (or clean water)',
        'White flowers and dhatura',
        'Ghee diya and cotton wicks',
        'Vibhuti (sacred ash) and sandalwood',
      ],
      hi: [
        'बिल्वपत्र (बेल पत्र)',
        'अभिषेक के लिए दूध, दही, घी, मधु',
        'गंगाजल (या स्वच्छ जल)',
        'श्वेत पुष्प और धतूरा',
        'घी का दीया और रुई की बत्ती',
        'विभूति (पवित्र भस्म) और चन्दन',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Hunter Gurudruha and the Accidental Vigil',
          hi: 'प्रथम अध्याय — शिकारी गुरुद्रुह और अनजाना जागरण',
        },
        content: {
          en: `Deep in the forests of Vindhya, where the trees grow so thick that sunlight reaches the floor only in narrow shafts, there lived a hunter named Gurudruha. He was a man of the forest — born to the tribe of Kirata hunters, raised with a bow in his hand, taught from childhood that killing was not merely his livelihood but his dharma. He knew every trail, every animal call, every sign of water and shelter. He could track a deer through moonless dark by scent alone.

Gurudruha was not a bad man, but he was not a good one either — by the standards of the saints and sages. He had never entered a temple. He had never chanted a mantra. He did not know the names of the gods, except as curses muttered when a shot went wide. He ate what he killed, drank from forest streams, and slept beneath the stars with the comfortable indifference of a creature who does not know there is anything beyond the forest.

He had a wife and three small children. They lived in a hut of branches and animal skins on the edge of the great forest. His wife would dry the meat he brought home, tan the hides, and sell them at the weekly market in the nearest village. It was a hard life, but the forest provided, and Gurudruha asked for nothing more.

On the fourteenth day of the waning moon in the month of Phalguna — the night that would become known as Maha Shivaratri — Gurudruha went into the forest at dawn to hunt. His wife had told him: "The larder is empty. The children have not eaten meat in three days. You must bring something home today."

But the forest, on this of all days, seemed enchanted against him. He walked for hours without seeing a single animal. The deer were invisible. The rabbits were hidden. Even the birds had gone silent, as though the entire forest was holding its breath. As the afternoon wore on and the shadows lengthened, Gurudruha grew increasingly desperate. His children were hungry. His wife was counting on him. And the forest offered nothing.

As darkness fell, Gurudruha found himself deep in an unfamiliar part of the forest, far from any trail he recognized. The moon was the thinnest sliver — a dark-moon night, cold and full of sounds that even a seasoned hunter found unsettling. Wolves howled in the distance. An owl's cry pierced the canopy.

Ahead, he spotted a large bilva tree — a wood-apple tree, its trunk thick and its branches spreading wide — standing beside a small pool of clear water. "I'll climb the tree and wait," he decided. "Animals come to water at night. Sooner or later, a deer will appear."

He climbed the tree and settled onto a broad branch, his bow ready, his quiver on his back, his eyes scanning the moonlit pool below. What Gurudruha did not know — could not know, for he had never been taught — was that directly beneath the bilva tree, at its very roots, partially hidden by fallen leaves and moss, sat a Shiva Linga. An ancient one, placed there by some forgotten sage in some forgotten age, worn smooth by centuries of rain, forgotten by the world but not by the divine.

The night was bitterly cold. The Phalguna wind cut through Gurudruha's thin deer-hide cloak. To stay warm, and more importantly to stay awake — for a sleeping hunter catches nothing — he began plucking bilva leaves from the branches around him and dropping them absentmindedly below. The leaves, carried by the gentle night breeze, fell precisely on the Shiva Linga.

In the first prahar of the night — the first three hours after sunset — Gurudruha plucked and dropped leaves while watching the pool. His eyes watered from the cold, and those tears, falling from his face, dripped down through the branches. Some of them landed on the Shiva Linga below. Without knowing it, the hunter was performing abhishek — the sacred bathing of the Lord — with his own tears.

No deer came. The pool remained empty. Gurudruha shivered and plucked more leaves.

In the second prahar, the cold intensified. Gurudruha's teeth chattered so violently that he bit his own tongue, and a few drops of blood fell from his mouth. They landed on the Linga. Unknowingly, he had offered rakta-pushpa — the offering of blood, which in the ancient Tantric traditions is considered the most potent offering a human being can make to Shiva.

Still no animals appeared. The forest remained empty and silent.

In the third prahar, exhaustion set in. Gurudruha's eyelids drooped. His fingers grew numb. But he forced himself to stay awake — not out of devotion, but out of sheer stubbornness and hunger. He began singing hunting songs to keep himself alert, rough melodies passed down through generations of Kirata hunters. The sound of his voice, raw and unmelodious as it was, vibrated through the cold air and through the Shiva Linga below — and in the ears of the divine, any sound made in genuine need is a form of prayer.

He continued dropping bilva leaves. By now, a thick carpet of leaves covered the Linga below.

In the fourth and final prahar — the darkest hours before dawn — Gurudruha was in agony. He had been awake all night, eaten nothing all day, was frozen to the bone, and had failed in his single purpose of providing for his family. For the first time in his rough, uncomplicated life, he felt something unfamiliar — a hollowness that was not merely physical hunger. It was the void that opens when a man reaches the limit of his own strength and finds nothing beyond it.

In that emptiness, Gurudruha did something he had never done before. He spoke to the darkness. Not to any god he knew — he knew none. Not in any prayer he had been taught — he had been taught none. He simply said, in his rough forest dialect: "Whatever is out there — if anything is out there — I have nothing left. My body is cold. My family is hungry. My arrows are useless. If there is something greater than this forest, greater than this cold, greater than this failure — show me."

It was not a mantra. It was not a prayer in any recognized form. But it was honest — stripped bare of pretension, empty of expectation, offered from a place where ego has been burned away by suffering. And that, in the cosmic economy of devotion, is the purest offering of all.

As the first light of dawn touched the eastern horizon, the pool below the tree shimmered. The water seemed to glow from within. The air warmed suddenly, impossibly, as though a flame had been lit in the centre of the forest. The bilva leaves that covered the Linga began to radiate a golden light, and from the ancient stone, a form began to emerge.

Lord Shiva appeared.

Not the fearsome Rudra of the battlefield, but the gentle Shankara — the bestower of peace. His body was smeared with ash, but the ash glowed like starlight. His hair was matted, but from the matted locks flowed the silver stream of the Ganga. His three eyes were open — the left eye cool as the moon, the right eye warm as the sun, and the third eye in the centre radiating a deep, calm awareness that encompassed all of existence. Around his neck coiled Vasuki, and on his lap sat the infant Kartikeya. The sound of his damru — that small drum whose rhythm is the heartbeat of the cosmos — filled the forest with a gentle, pulsing music.

Gurudruha nearly fell from the tree in shock. He scrambled down, his bow clattering to the ground, and prostrated himself on the earth — not because he knew the protocol for divine darshan, but because every cell in his body told him that he was in the presence of something infinitely greater than himself.

"Rise, Gurudruha," Shiva said, and his voice was warm, amused, and infinitely kind. "Do you know what you have done tonight?"

"N-nothing, Lord," the hunter stammered. "I sat in a tree. I dropped leaves. I stayed awake because I was cold and hungry. I did nothing."

"You did everything," Shiva replied. "You fasted all day — a complete nirjala upavasa. You performed jagran — staying awake through all four prahars of the night. You offered bilva leaves upon my Linga — not one or two, but thousands, covering me in the most sacred leaf of all trees. You performed abhishek with your tears and your blood. You sang — and though you did not know it, your hunting songs became hymns in my ears. And in the final prahar, you offered the most precious thing a man can offer — your honest surrender, your admission that you have reached the end of yourself. That, Gurudruha, is the essence of all worship."

"But I didn't know!" the hunter protested. "I didn't know there was a Linga under the tree. I didn't intend any of this!"

Shiva smiled. "Intent is valued by the world. I value sincerity. You did not intend to worship me — but you did worship me, perfectly, with your whole being, on the most sacred night of the year. Your accidental devotion was more complete than the calculated rituals of a thousand priests. For you had nothing to gain, no bargain to strike, no merit to accumulate. You were simply present — cold, hungry, honest, and alive. That is prayer."

"From this night forward," Shiva declared, "Maha Shivaratri shall be the night when my grace is most freely given. Whoever fasts through the day, stays awake through the night, offers bilva leaves, performs abhishek, and keeps their heart open to the divine — whether they know my name or not, whether they follow the proper rituals or not — they shall receive my darshan and be freed from all sins."

Gurudruha fell at Shiva's feet, weeping — not with grief, but with the overwhelming astonishment of a man who has stumbled upon the ocean while searching for a puddle. "What should I do now, Lord?" he asked.

"Go home," Shiva said simply. "Feed your children. Love your wife. And live knowing that I am in every tree, every stone, every pool of water, and every creature of this forest that you call home. You need never search for me again. You have already found me."

And Gurudruha went home. The forest that had been barren the day before was now abundant — a deer appeared on the path, standing still, almost offering itself. He fed his family. He lived many more years, growing old in the forest, and every Phalguna, on the darkest night of the waning moon, he would climb the bilva tree and sit all night, dropping leaves, shedding tears, singing his rough songs — and smiling, for he knew now what he had not known before: that grace needs no invitation, and that the divine is present even in the most unlikely of devotees.

Thus ends the chapter. Observe Maha Shivaratri knowing that Lord Shiva does not require your perfection — he requires your presence. Fast, stay awake, offer what you have, and surrender what you cannot hold. That is enough. It has always been enough.`,
          hi: `विन्ध्य के गहन वनों में, जहां वृक्ष इतने घने हैं कि सूर्य का प्रकाश फर्श तक केवल पतली किरणों में पहुंचता है, गुरुद्रुह नाम का एक शिकारी रहता था। वह वन का व्यक्ति था — किरात शिकारियों के कबीले में जन्मा, हाथ में धनुष लेकर पला, बचपन से सिखाया गया कि शिकार उसकी जीविका ही नहीं बल्कि उसका धर्म है। वह प्रत्येक पगडण्डी जानता था, प्रत्येक पशु की पुकार, जल और आश्रय का प्रत्येक संकेत। वह अमावस्या के अंधेरे में केवल गंध से हिरण का पीछा कर सकता था।

गुरुद्रुह बुरा आदमी नहीं था, किन्तु सन्तों और ऋषियों के मानदण्डों से अच्छा भी नहीं — कभी मन्दिर नहीं गया। कभी मन्त्र नहीं जपा। देवताओं के नाम नहीं जानता था, सिवाय उन अपशब्दों के जो तीर चूकने पर बड़बड़ाता। जो मारता वही खाता, वनों के झरनों से पीता, और तारों के नीचे सोता उस सुखद उदासीनता से जो उस प्राणी की होती है जिसे नहीं पता कि वन से परे भी कुछ है।

उसकी पत्नी और तीन छोटे बच्चे थे। वे महान वन के किनारे शाखाओं और पशु-खालों की झोंपड़ी में रहते थे। पत्नी उसके लाये मांस को सुखाती, खाल पकाती, और निकट के गांव के साप्ताहिक बाजार में बेचती। कठिन जीवन था, किन्तु वन प्रदान करता था, और गुरुद्रुह ने इससे अधिक कभी नहीं मांगा।

फाल्गुन मास के कृष्ण पक्ष की चतुर्दशी को — वह रात्रि जो महा शिवरात्रि के नाम से जानी जाएगी — गुरुद्रुह भोर में शिकार के लिए वन में गया। उसकी पत्नी ने कहा था: "भण्डार खाली है। बच्चों ने तीन दिन से मांस नहीं खाया। आज कुछ लाना ही होगा।"

किन्तु वन, सभी दिनों में इस दिन, उसके विरुद्ध जादू-सा कर रहा था। वह घण्टों चला बिना एक भी जानवर देखे। हिरण अदृश्य थे। खरगोश छिपे हुए। पक्षी भी मौन हो गए थे, जैसे सम्पूर्ण वन अपनी श्वास रोके हो। जैसे-जैसे दोपहर बीती और छायाएं लम्बी होती गईं, गुरुद्रुह बढ़ती हताशा में डूबता गया।

अंधेरा छाते-छाते, गुरुद्रुह ने स्वयं को वन के एक अपरिचित भाग में पाया, किसी जानी-पहचानी पगडण्डी से दूर। चांद सबसे पतली रेखा था — अमावस्या के निकट की रात, ठण्डी और ऐसी ध्वनियों से भरी जो अनुभवी शिकारी को भी बेचैन करती थीं।

आगे, उसने एक बड़ा बिल्व वृक्ष देखा — बेल का पेड़, मोटे तने और फैली शाखाओं वाला — निर्मल जल के एक छोटे सरोवर के पास। "पेड़ पर चढ़कर प्रतीक्षा करूंगा," उसने निश्चय किया। "रात को जानवर जल पीने आते हैं। देर-सवेर कोई हिरण आएगा।"

वह पेड़ पर चढ़ा और एक चौड़ी शाखा पर जम गया, धनुष तैयार, तरकस पीठ पर, आंखें नीचे चांदनी-सने सरोवर पर। जो गुरुद्रुह नहीं जानता था — जान नहीं सकता था, क्योंकि उसे कभी सिखाया नहीं गया — वह यह कि ठीक बिल्व वृक्ष के नीचे, उसकी जड़ों में, गिरे पत्तों और काई से आधा ढका, एक शिवलिंग विराजमान था। एक प्राचीन शिवलिंग, किसी भूले हुए ऋषि द्वारा किसी भूले हुए युग में स्थापित, सदियों की वर्षा से चिकना, संसार द्वारा भुलाया किन्तु दिव्य द्वारा नहीं।

रात भयंकर ठण्डी थी। फाल्गुन की हवा गुरुद्रुह के पतले मृग-चर्म वस्त्र को चीर रही थी। गर्म रहने के लिए, और इससे भी महत्वपूर्ण जागे रहने के लिए — क्योंकि सोता शिकारी कुछ नहीं पकड़ता — वह अपने चारों ओर की शाखाओं से बिल्वपत्र तोड़कर बेध्यानी से नीचे गिराने लगा। पत्ते, रात की मन्द हवा में बहकर, ठीक शिवलिंग पर गिरे।

रात के प्रथम प्रहर में — सूर्यास्त के बाद पहले तीन घण्टे — गुरुद्रुह पत्ते तोड़ता और गिराता रहा। ठण्ड से उसकी आंखों में पानी आया, और वे अश्रु, उसके चेहरे से गिरकर, शाखाओं से होते हुए नीचे टपके। कुछ शिवलिंग पर गिरे। बिना जाने, शिकारी अभिषेक कर रहा था — भगवान का पवित्र स्नान — अपने स्वयं के अश्रुओं से।

कोई हिरण नहीं आया। सरोवर खाली रहा। गुरुद्रुह कांपता रहा और अधिक पत्ते तोड़ता रहा।

द्वितीय प्रहर में, ठण्ड और बढ़ी। गुरुद्रुह के दांत इतने कड़कड़ाये कि उसने अपनी जीभ काट ली, और रक्त की कुछ बूंदें मुख से गिरीं। वे शिवलिंग पर गिरीं। अनजाने में, उसने रक्त-पुष्प अर्पित कर दिया — प्राचीन तान्त्रिक परम्पराओं में जो मनुष्य शिव को सबसे शक्तिशाली अर्पण कर सकता है।

अभी भी कोई जानवर नहीं दिखा। वन खाली और मौन रहा।

तृतीय प्रहर में, थकान ने घेर लिया। गुरुद्रुह की पलकें भारी होने लगीं। उंगलियां सुन्न पड़ गईं। किन्तु उसने जागे रहने को विवश किया — भक्ति से नहीं, बल्कि शुद्ध जिद और भूख से। वह सतर्क रहने के लिए शिकार के गीत गाने लगा, किरात शिकारियों की पीढ़ियों से चले आ रहे रुखे स्वर। उसकी वाणी की ध्वनि, कर्कश और बेसुरी, ठण्डी हवा और नीचे शिवलिंग में कम्पित हुई — और दिव्य के कानों में, सच्ची आवश्यकता में की गई कोई भी ध्वनि प्रार्थना का एक रूप है।

वह बिल्वपत्र गिराता रहा। अब तक, पत्तों की मोटी चादर ने नीचे शिवलिंग को ढक लिया था।

चतुर्थ और अन्तिम प्रहर में — भोर से पहले के सबसे अंधेरे घण्टे — गुरुद्रुह पीड़ा में था। पूरी रात जागा था, पूरा दिन कुछ नहीं खाया, हड्डियों तक ठण्ड, और अपने एकमात्र उद्देश्य में विफल — परिवार के लिए कुछ लाना। अपने रूखे, सरल जीवन में पहली बार, उसने कुछ अपरिचित अनुभव किया — एक खालीपन जो मात्र शारीरिक भूख नहीं था। वह शून्य जो तब खुलता है जब मनुष्य अपनी शक्ति की सीमा पर पहुंचता है और उससे परे कुछ नहीं पाता।

उस रिक्तता में, गुरुद्रुह ने वह किया जो पहले कभी नहीं किया था। उसने अंधेरे से बात की। किसी ज्ञात देवता से नहीं — वह किसी को नहीं जानता था। किसी सिखाई प्रार्थना में नहीं — उसे कोई सिखाई नहीं गई थी। उसने बस अपनी रूखी वन-बोली में कहा: "जो कुछ भी वहां बाहर है — यदि कुछ है तो — मेरे पास कुछ नहीं बचा। शरीर ठण्डा है। परिवार भूखा है। तीर बेकार हैं। यदि इस वन से बड़ा कुछ है, इस ठण्ड से बड़ा, इस विफलता से बड़ा — तो मुझे दिखाओ।"

यह मन्त्र नहीं था। किसी मान्य रूप में प्रार्थना नहीं थी। किन्तु ईमानदार थी — दिखावे से मुक्त, अपेक्षा से रिक्त, उस स्थान से अर्पित जहां अहंकार पीड़ा की अग्नि में जल चुका था। और वही, भक्ति की ब्रह्माण्डीय अर्थव्यवस्था में, सबसे शुद्ध अर्पण है।

जैसे ही भोर का पहला प्रकाश पूर्वी क्षितिज को छुआ, वृक्ष के नीचे सरोवर चमक उठा। जल भीतर से चमकता लगा। वायु अचानक, असम्भव रूप से गर्म हुई, जैसे वन के केन्द्र में ज्योति प्रज्वलित हो गई हो। शिवलिंग को ढकने वाले बिल्वपत्र स्वर्णिम प्रकाश विकीर्ण करने लगे, और प्राचीन शिला से एक आकृति प्रकट होने लगी।

भगवान शिव प्रकट हुए।

रणभूमि के भयंकर रुद्र नहीं, बल्कि कोमल शंकर — शान्ति के दाता। उनका शरीर भस्म से सना था, किन्तु भस्म तारों की भांति चमक रही थी। जटाएं बंधी थीं, किन्तु जटाओं से गंगा की रजत धारा बह रही थी। तीनों नेत्र खुले थे — बायां चन्द्रमा सा शीतल, दायां सूर्य सा उष्ण, और केन्द्र का तृतीय नेत्र गहन, शान्त जागरूकता विकीर्ण करता जो समस्त अस्तित्व को समेटे थी।

गुरुद्रुह आतंक से पेड़ से गिरते-गिरते बचा। वह लुढ़कता हुआ नीचे आया, धनुष खड़खड़ाता हुआ गिरा, और भूमि पर साष्टांग हुआ — इसलिए नहीं कि उसे दिव्य दर्शन की विधि पता थी, बल्कि इसलिए कि उसके शरीर के प्रत्येक कोष ने कहा कि वह स्वयं से अनन्त रूप से महान किसी की उपस्थिति में है।

"उठो, गुरुद्रुह," शिव बोले, और उनकी वाणी उष्ण, विनोदपूर्ण, और अनन्त रूप से कृपालु थी। "क्या तुम जानते हो आज रात तुमने क्या किया?"

"कु-कुछ नहीं, प्रभु," शिकारी हकलाया। "मैं पेड़ पर बैठा रहा। पत्ते गिराता रहा। जागता रहा क्योंकि ठण्ड और भूख थी। मैंने कुछ नहीं किया।"

"तुमने सब कुछ किया," शिव ने उत्तर दिया। "तुमने पूरे दिन उपवास किया — पूर्ण निर्जल उपवास। तुमने जागरण किया — रात्रि के चारों प्रहरों में जागे रहे। तुमने मेरे शिवलिंग पर बिल्वपत्र अर्पित किए — एक-दो नहीं, बल्कि हजारों, मुझे सर्वाधिक पवित्र पत्तों से ढक दिया। तुमने अपने अश्रुओं और रक्त से अभिषेक किया। तुमने गाया — और यद्यपि तुम नहीं जानते थे, तुम्हारे शिकार के गीत मेरे कानों में भजन बन गए। और अन्तिम प्रहर में, तुमने सबसे मूल्यवान वस्तु अर्पित की जो मनुष्य कर सकता है — अपना ईमानदार समर्पण, अपनी स्वीकृति कि तुम अपनी सीमा पर पहुंच गए हो। यही, गुरुद्रुह, समस्त पूजा का सार है।"

"किन्तु मुझे पता नहीं था!" शिकारी ने विरोध किया। "मुझे नहीं पता था कि पेड़ के नीचे शिवलिंग है। मेरा इनमें से कुछ भी इरादा नहीं था!"

शिव मुस्कुराये। "इरादे को संसार मूल्य देता है। मैं सच्चाई को मूल्य देता हूं। तुम्हारा मेरी पूजा का इरादा नहीं था — किन्तु तुमने मेरी पूजा की, पूर्ण रूप से, अपने सम्पूर्ण अस्तित्व से, वर्ष की सबसे पवित्र रात को। तुम्हारी आकस्मिक भक्ति सहस्र पुजारियों के परिकलित अनुष्ठानों से अधिक पूर्ण थी। क्योंकि तुम्हारे पास पाने को कुछ नहीं था, कोई सौदा नहीं, कोई पुण्य संचय नहीं। तुम बस उपस्थित थे — ठण्डे, भूखे, ईमानदार, और जीवित। वही प्रार्थना है।"

"आज से," शिव ने घोषणा की, "महा शिवरात्रि वह रात होगी जब मेरी कृपा सबसे मुक्त रूप से बहेगी। जो कोई दिनभर उपवास करे, रातभर जागे, बिल्वपत्र अर्पित करे, अभिषेक करे, और अपना हृदय दिव्य के लिए खुला रखे — चाहे मेरा नाम जानता हो या नहीं, चाहे उचित अनुष्ठान करता हो या नहीं — उसे मेरा दर्शन होगा और वह सभी पापों से मुक्त होगा।"

गुरुद्रुह शिव के चरणों में गिर पड़ा, रोता हुआ — शोक से नहीं, बल्कि उस अभिभूत करने वाले विस्मय से जो उस मनुष्य का होता है जिसने पोखर खोजते-खोजते सागर पा लिया। "अब मैं क्या करूं, प्रभु?" उसने पूछा।

"घर जाओ," शिव ने सरलता से कहा। "बच्चों को खिलाओ। पत्नी से प्रेम करो। और जीओ यह जानते हुए कि मैं प्रत्येक वृक्ष में हूं, प्रत्येक पत्थर में, प्रत्येक जल के सरोवर में, और इस वन के प्रत्येक प्राणी में जिसे तुम अपना घर कहते हो। तुम्हें मुझे फिर कभी खोजने की आवश्यकता नहीं। तुम मुझे पहले ही पा चुके हो।"

और गुरुद्रुह घर गया। वन जो कल बंजर था, अब प्रचुर था — एक हिरण रास्ते पर प्रकट हुआ, स्थिर खड़ा, जैसे स्वयं को अर्पित कर रहा हो। उसने अपने परिवार को खिलाया। वह और कई वर्ष जीवित रहा, वन में वृद्ध होता, और प्रत्येक फाल्गुन में, कृष्ण पक्ष की सबसे अंधेरी रात को, वह बिल्व वृक्ष पर चढ़ता और पूरी रात बैठता, पत्ते गिराता, अश्रु बहाता, अपने रूखे गीत गाता — और मुस्कुराता, क्योंकि अब वह जानता था जो पहले नहीं जानता था: कि कृपा को निमन्त्रण की आवश्यकता नहीं, और दिव्य सबसे असम्भव भक्तों में भी उपस्थित है।

इति अध्याय सम्पूर्ण। महा शिवरात्रि यह जानकर मनाओ कि भगवान शिव को तुम्हारी पूर्णता नहीं चाहिए — तुम्हारी उपस्थिति चाहिए। उपवास करो, जागो, जो है वह अर्पित करो, और जो पकड़ नहीं सकते वह समर्पित करो। यही पर्याप्त है। यही सदा पर्याप्त रहा है।`,
        },
      },
    ],
    relatedAartis: ['shiva-aarti'],
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
    samagri: {
      en: [
        'Gur (jaggery)',
        'Chana (roasted chickpeas)',
        'Banana and seasonal fruits',
        'Red flowers',
        'Ghee diya and cotton wicks',
        'Incense sticks',
      ],
      hi: [
        'गुड़',
        'भुना चना',
        'केला और मौसमी फल',
        'लाल पुष्प',
        'घी का दीया और रुई की बत्ती',
        'अगरबत्ती',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'Satyavati the Devoted Wife and the Grace of Santoshi Maa',
          hi: 'प्रथम अध्याय — भक्त पत्नी सत्यवती और सन्तोषी माता की कृपा',
        },
        content: {
          en: `In a village at the edge of a great river, there lived a young woman named Satyavati. She was married into a large joint family — her husband was the youngest of five brothers, a good-hearted but simple man who worked in the fields and earned barely enough for his own household, let alone for the joint family's many expenses. The family was headed by a domineering mother-in-law whose tongue was sharper than a ploughshare, and whose favouritism toward her older daughters-in-law was as obvious as the sun at noon.

From the first day Satyavati entered the household, she was treated as the family's servant. While the older daughters-in-law wore silk and slept on proper cots, Satyavati was given the coarsest cotton and a thin mat on the kitchen floor. While they ate first, choosing the best portions, Satyavati ate last, scraping the remnants from the pot. She washed all the clothes, swept all the floors, cleaned all the vessels, cooked all the meals — and for all her labour received nothing but sharp words and contemptuous glances.

"Why did we marry the youngest to this plain-faced girl?" the mother-in-law would say loudly, knowing Satyavati could hear. "She brought no dowry. She has no skills. She is a burden on this house." The sisters-in-law would titter behind their veils, and Satyavati would bow her head and continue her work, her eyes burning but her lips sealed.

Her husband loved her, but he was weak — intimidated by his mother and bullied by his brothers. He would sometimes find Satyavati weeping silently in the kitchen after everyone had gone to sleep, and he would hold her hand and say: "I am sorry. I will talk to them." But he never did, and they both knew it.

The years wore on. Satyavati's husband was eventually forced by his brothers to seek work in a distant city. "There is no room for parasites here," the eldest brother said. "Go earn something or don't come back." The husband departed with promises to send money and return soon, but the city swallowed him — no letters came, no money arrived, and Satyavati was left alone in a household that saw her as nothing more than an unpaid servant whose provider had abandoned her.

The cruelty intensified. The mother-in-law assigned Satyavati the most degrading tasks — cleaning the cow shed, washing the family's soiled clothes, carrying water from the distant well in the scorching heat. The food portions grew smaller. Sometimes, Satyavati was given nothing at all, and she would quietly eat a handful of dry gram she had hidden in her blouse, washing it down with well water.

One Friday afternoon, as Satyavati walked to the well under the pitiless sun, she passed by the village temple. An old woman sat in the shade of the temple wall, stringing marigolds into garlands. The old woman was known in the village as Amma — a widow of no particular wealth but great kindness, who survived by making garlands for the temple and was known for her encyclopedic knowledge of vrats and kathas.

"Daughter," Amma called out, seeing Satyavati's exhausted face and work-reddened hands, "come sit for a moment. You look as though you have not rested in weeks."

Satyavati hesitated — she knew she would be scolded if she returned late — but her legs were trembling with fatigue, and the shade looked like paradise. She sat down. And once she sat, the dam broke. She told Amma everything — the cruelty, the loneliness, the absent husband, the hunger, the despair. She did not weep; she was beyond weeping. She spoke in a flat, exhausted voice, as though recounting the life of a stranger.

Amma listened without interruption. When Satyavati finished, the old woman was silent for a long moment. Then she spoke: "Child, I know a vrat that was shown to me by my own grandmother, and to her by hers, going back generations beyond memory. It is the vrat of Santoshi Maa — the Mother of Contentment, born from the divine essence of Lord Ganesha himself."

"Santoshi Maa," Amma continued, "is the goddess who does not promise wealth or power or revenge. She promises something far more precious — santosh, contentment. She transforms not your circumstances, but your ability to find peace within them. And then, slowly, quietly, like a river changing its course over years, the circumstances themselves begin to change."

"The vrat is simple," Amma said. "Every Friday for sixteen consecutive Fridays, you must fast — eating only one meal without any sour food. No lemon, no tamarind, no yogurt, no vinegar, no pickle — nothing sour must pass your lips or be served in your house on that day. Prepare a simple prasad of gur and chana — jaggery and roasted chickpeas — and offer it to Santoshi Maa with a diya of ghee and red flowers. Listen to the katha of Santoshi Maa, or if there is no one to narrate it, recite it from memory. After sixteen Fridays, perform the udyapan — the concluding ceremony — by feeding eight boys a meal with devotion."

Satyavati said: "I have no money for gur and chana. I have no ghee for a diya. I have no red flowers."

Amma smiled. "Do you have a handful of grain?" Satyavati nodded. "Then roast it on the fire. That is your chana. Do you have a lump of dried sugarcane?" Again, a nod. "Then that is your gur. Do you have any oil at all — even mustard oil?" A small nod. "That is your diya fuel. And the red flowers —" Amma plucked a few small red wildflowers from the grass beside the temple wall and handed them to Satyavati. "These grow everywhere. The goddess does not need hothouse roses. She needs your heart."

Satyavati began the vrat that very Friday. In the pre-dawn darkness, before the household woke, she lit her tiny mustard-oil diya in the corner of the kitchen, placed her roasted grain and dried sugarcane before a small spot on the wall where she had drawn a rudimentary image of a goddess with wet turmeric, and offered the wild red flowers. She whispered the katha that Amma had taught her, her voice barely audible, afraid that the mother-in-law would hear and mock her.

The first Friday passed. Nothing happened. The second. The third. The cruelty continued. The hunger continued. The loneliness continued. But something was changing inside Satyavati — something she could not name. The knot of bitterness in her chest, which had been tightening for years, began to loosen. Not because her circumstances improved, but because the act of devotion itself — the simple discipline of waking early, preparing the offering, sitting in silence before the divine — gave her a centre of calm that the storms of the household could not reach.

By the eighth Friday, Satyavati noticed that she no longer wept at night. By the twelfth, she found herself humming while she worked — not songs of sorrow, but the melody of the Santoshi Maa katha. The sisters-in-law noticed and were baffled. "What is wrong with her?" they whispered. "She is smiling. She never smiles." The mother-in-law, disturbed by this unexpected serenity, redoubled her cruelty — but it bounced off Satyavati like rain off a lotus leaf.

On the fifteenth Friday, a letter arrived. It was from Satyavati's husband. He had found work in the city — good work, with a kind employer who valued his honesty. He had been unable to write because he had been ill, but had recovered, and was sending money. Enclosed in the letter was more money than the household had seen in months.

The family's attitude shifted instantly — not from remorse, but from greed. The mother-in-law, who had been calling Satyavati a burden, suddenly praised her: "I always said she was a good girl. Her husband is doing well because of this family's blessings."

On the sixteenth and final Friday, Satyavati performed the vrat with a devotion that radiated through the walls of the kitchen. As she completed the puja, she felt a warmth fill the room — not physical heat, but a presence, like being held by invisible arms. She did not see Santoshi Maa, but she felt her — a vast, maternal embrace that said without words: "You are not alone. You were never alone."

The next day, Satyavati's husband returned home — not as the meek youngest brother, but as a man transformed by his time in the city, standing taller, speaking with quiet authority. He had brought gifts for the family, settled the household debts, and — most importantly — he told his mother and brothers, firmly and without anger: "Satyavati is my wife and the mother of my future children. She will be treated with respect in this house, or she and I will build our own."

The mother-in-law, for the first time in her life, was silenced.

Satyavati performed the udyapan the following Friday. She prepared a simple but lovingly cooked meal and invited eight boys from the village. As she served them, she remembered Amma's words: "The goddess does not promise wealth or power. She promises santosh — contentment." And looking at her life now — not wealthy, not powerful, but dignified, loved, and at peace — Satyavati understood that contentment is not the absence of suffering. It is the presence of grace.

But the katha carries one final warning, which must be told. After the udyapan, the mother-in-law, who had been secretly resentful of Satyavati's newfound standing, prepared a meal for the family that deliberately included sour items — tamarind chutney, lemon pickle, and yogurt. She served these to Satyavati with a false smile: "Eat, daughter. You deserve a feast after your vrat."

Satyavati, in her contentment, did not suspect treachery. She ate. And that evening, misfortune struck — a small fire broke out in the kitchen, the cow fell sick, and her husband received word that his employer's business had suffered a loss. The sweetness of the previous weeks curdled overnight.

Satyavati, bewildered, went to Amma. The old woman listened and said: "Did you eat anything sour after the udyapan?" Satyavati remembered the tamarind and lemon. "That is the breach," Amma said gravely. "Santoshi Maa's one inviolable rule is that sour food must be avoided not only during the vrat but also on the day of the udyapan and the days following. Sour food is the symbol of jealousy and bitterness — the very emotions that the goddess works to remove. Consuming them after the vrat is like reopening a wound that had just begun to heal."

Satyavati immediately performed a remedial fast — three additional Fridays with strict avoidance of all sour food. She apologized to Santoshi Maa with genuine contrition, not for eating the food, but for not being vigilant enough to recognize the sabotage. And the goddess, who is a mother before she is a deity, forgave. The misfortunes reversed. The husband's employment was restored. The household settled into a new equilibrium — not perfect, for families are never perfect, but functional, dignified, and touched by grace.

Thus ends the chapter. Observe the Santoshi Maa Vrat with Satyavati's patience, and remember: the goddess does not remove your thorns — she teaches you to walk among them without bleeding. Avoid sour food on Friday as you avoid sour thoughts in life. And never, ever underestimate the power of a woman who has found her centre.`,
          hi: `एक महानदी के किनारे बसे गांव में सत्यवती नाम की एक युवती रहती थी। उसका विवाह एक बड़े संयुक्त परिवार में हुआ था — पति पांच भाइयों में सबसे छोटा, भले हृदय का किन्तु सीधा-साधा व्यक्ति जो खेतों में काम करता और अपने घर के लिए भी बमुश्किल कमा पाता, संयुक्त परिवार के बहुत से खर्चों की तो बात ही क्या। परिवार की मुखिया एक दबंग सास थी जिसकी जीभ हल के फाल से भी तेज थी, और जिसकी बड़ी बहुओं के प्रति पक्षपाता दोपहर के सूर्य जितना स्पष्ट था।

पहले दिन से ही जब सत्यवती ने घर में प्रवेश किया, उसके साथ परिवार की नौकरानी जैसा व्यवहार हुआ। जबकि बड़ी बहुएं रेशम पहनतीं और उचित खाटों पर सोतीं, सत्यवती को सबसे मोटा सूती कपड़ा और रसोई के फर्श पर पतली चटाई दी गई। जबकि वे पहले खातीं, सबसे अच्छे हिस्से चुनतीं, सत्यवती अन्त में खाती, बर्तन की तली से बचा-खुचा खुरचकर। वह सारे कपड़े धोती, सारे फर्श बुहारती, सारे बर्तन साफ करती, सारा खाना पकाती — और अपने सम्पूर्ण श्रम के बदले कड़वे शब्दों और तिरस्कारपूर्ण दृष्टियों के अतिरिक्त कुछ नहीं पाती।

"सबसे छोटे का विवाह इस सादी-सी लड़की से क्यों किया?" सास जोर से कहती, जानते हुए कि सत्यवती सुन सकती है। "न दहेज लाई। कोई हुनर नहीं। इस घर पर बोझ है।" ननदें और जेठानियां अपने घूंघटों के पीछे खिलखिलातीं, और सत्यवती सिर झुकाकर काम करती रहती, आंखें जलतीं किन्तु होंठ सिले।

पति उससे प्रेम करता था, किन्तु कमजोर था — मां से डरता और भाइयों से दबता। कभी-कभी सब सो जाने के बाद सत्यवती को रसोई में चुपचाप रोता पाता, उसका हाथ पकड़ता और कहता: "मुझे दुख है। मैं उनसे बात करूंगा।" किन्तु कभी नहीं करता, और दोनों जानते थे।

वर्ष बीते। सत्यवती के पति को अन्ततः भाइयों ने दूर के शहर में काम खोजने को विवश किया। "यहां परजीवियों के लिए जगह नहीं है," बड़े भाई ने कहा। "कुछ कमाओ या वापस मत आओ।" पति पैसे भेजने और जल्दी लौटने के वचन के साथ चला गया, किन्तु शहर ने उसे निगल लिया — न पत्र आये, न पैसे, और सत्यवती अकेली रह गई ऐसे घर में जो उसे बिना वेतन की नौकरानी से अधिक कुछ नहीं मानता था।

क्रूरता और बढ़ी। सास ने सत्यवती को सबसे अपमानजनक काम सौंपे — गोशाला साफ करना, परिवार के गन्दे कपड़े धोना, तपती धूप में दूर के कुएं से पानी ढोना। भोजन के हिस्से छोटे होते गए। कभी-कभी, सत्यवती को कुछ भी नहीं दिया जाता, और वह चुपचाप मुट्ठीभर सूखा चना खाती जो उसने अपने आंचल में छिपा रखा होता, कुएं के पानी से निगलती।

एक शुक्रवार दोपहर, जब सत्यवती निर्दयी धूप में कुएं की ओर जा रही थी, वह गांव के मन्दिर के पास से गुजरी। मन्दिर की दीवार की छाया में एक वृद्ध स्त्री बैठी गेंदे की मालाएं गूंथ रही थी। वृद्ध स्त्री गांव में अम्मा के नाम से जानी जाती थी — विशेष धनी नहीं किन्तु अत्यन्त कृपालु विधवा, जो मन्दिर के लिए मालाएं बनाकर जीवन यापन करती और व्रतों-कथाओं के विश्वकोषीय ज्ञान के लिए विख्यात थी।

"बेटी," अम्मा ने सत्यवती का थका चेहरा और काम से लाल हाथ देखकर पुकारा, "एक क्षण बैठ जा। ऐसा लगता है हफ्तों से आराम नहीं किया।"

सत्यवती हिचकिचाई — वह जानती थी देर से लौटने पर डांट पड़ेगी — किन्तु उसके पैर थकान से कांप रहे थे, और छाया स्वर्ग जैसी लग रही थी। वह बैठ गई। और बैठते ही बांध टूट गया। उसने अम्मा को सब बताया — क्रूरता, अकेलापन, गायब पति, भूख, निराशा। वह रोई नहीं; वह रोने से परे थी। सपाट, थकी वाणी में बोली, जैसे किसी अजनबी का जीवन सुना रही हो।

अम्मा ने बिना बीच में बोले सुना। जब सत्यवती ने समाप्त किया, वृद्ध स्त्री लम्बे क्षण तक मौन रही। फिर बोली: "बेटी, मैं एक व्रत जानती हूं जो मुझे मेरी दादी ने बताया, और उन्हें उनकी दादी ने, पीढ़ियों-पीढ़ियों से चला आ रहा। यह सन्तोषी माता का व्रत है — सन्तोष की माता, स्वयं भगवान गणेश के दिव्य तत्व से जन्मी।"

"सन्तोषी माता," अम्मा ने कहा, "वह देवी हैं जो धन, शक्ति या प्रतिशोध का वचन नहीं देतीं। वे कहीं अधिक मूल्यवान वस्तु का वचन देती हैं — सन्तोष। वे तुम्हारी परिस्थितियां नहीं बदलतीं, बल्कि उनमें शान्ति पाने की तुम्हारी क्षमता बदलती हैं। और फिर, धीरे-धीरे, चुपचाप, जैसे नदी वर्षों में अपना मार्ग बदलती है, परिस्थितियां स्वयं बदलने लगती हैं।"

"व्रत सरल है," अम्मा ने कहा। "सोलह लगातार शुक्रवार, तुम उपवास करोगी — बिना किसी खट्टी वस्तु के केवल एक भोजन। न नीम्बू, न इमली, न दही, न सिरका, न अचार — कुछ भी खट्टा तुम्हारे होंठों से नहीं गुजरना चाहिए और न उस दिन घर में परोसा जाना चाहिए। गुड़ और भुने चने का सरल प्रसाद बनाओ और घी के दीये और लाल पुष्पों के साथ सन्तोषी माता को अर्पित करो। सन्तोषी माता की कथा सुनो, और यदि सुनाने वाला कोई न हो तो कण्ठस्थ पढ़ो। सोलह शुक्रवार बाद उद्यापन करो — समापन समारोह — आठ बालकों को भक्तिपूर्वक भोजन कराकर।"

सत्यवती ने कहा: "मेरे पास गुड़ और चने के लिए पैसे नहीं। दीये के लिए घी नहीं। लाल पुष्प नहीं।"

अम्मा मुस्कुराई। "मुट्ठीभर अनाज है?" सत्यवती ने सिर हिलाया। "तो आग पर भून लो। वही तुम्हारा चना। सूखे गन्ने का टुकड़ा है?" फिर सिर हिला। "वही तुम्हारा गुड़। कोई तेल — सरसों का तेल भी?" छोटा-सा सिर हिलाना। "वही तुम्हारे दीये का ईंधन। और लाल पुष्प —" अम्मा ने मन्दिर की दीवार के पास घास से कुछ छोटे लाल जंगली फूल तोड़कर सत्यवती को दिए। "ये हर जगह उगते हैं। देवी को ग्रीनहाउस के गुलाब नहीं चाहिए। उन्हें तुम्हारा हृदय चाहिए।"

सत्यवती ने उसी शुक्रवार व्रत आरम्भ किया। भोर-पूर्व अंधेरे में, घर के जागने से पहले, उसने रसोई के कोने में अपना छोटा-सा सरसों-तेल का दीया जलाया, गीली हल्दी से दीवार पर बनाई देवी की सरल आकृति के सामने भुना अनाज और सूखा गन्ना रखा, और जंगली लाल फूल अर्पित किए। अम्मा ने जो कथा सिखाई थी वह फुसफुसाकर सुनाई, उसकी वाणी मुश्किल से सुनाई देती, इस डर से कि सास सुनकर मजाक उड़ाएगी।

पहला शुक्रवार बीता। कुछ नहीं हुआ। दूसरा। तीसरा। क्रूरता जारी रही। भूख जारी। अकेलापन जारी। किन्तु सत्यवती के भीतर कुछ बदल रहा था — कुछ जिसे वह नाम नहीं दे सकती थी। उसकी छाती में कड़वाहट की गांठ, जो वर्षों से कसती जा रही थी, ढीली पड़ने लगी। इसलिए नहीं कि परिस्थितियां सुधरीं, बल्कि इसलिए कि भक्ति का कर्म स्वयं — सवेरे जागने, अर्पण तैयार करने, दिव्य के सामने मौन बैठने का सरल अनुशासन — ने उसे शान्ति का एक केन्द्र दिया जहां घर के तूफान पहुंच नहीं सकते थे।

आठवें शुक्रवार तक, सत्यवती ने देखा कि वह रात को रोती नहीं है। बारहवें तक, वह काम करते हुए गुनगुनाती पाई — शोक के गीत नहीं, बल्कि सन्तोषी माता कथा की धुन। ननदों ने देखा और चकित हुईं। "इसे क्या हो गया?" वे फुसफुसाईं। "यह मुस्कुरा रही है। यह कभी नहीं मुस्कुराती।" सास, इस अप्रत्याशित शान्ति से विचलित, ने क्रूरता दोगुनी कर दी — किन्तु वह सत्यवती से कमल के पत्ते से वर्षा की भांति फिसल जाती।

पन्द्रहवें शुक्रवार को, एक पत्र आया। सत्यवती के पति का। उसे शहर में काम मिल गया था — अच्छा काम, एक दयालु नियोक्ता के साथ जो उसकी ईमानदारी को मानता था। वह लिख नहीं पाया क्योंकि बीमार था, किन्तु ठीक हो गया, और पैसे भेज रहा था। पत्र में उससे अधिक पैसे थे जितने परिवार ने महीनों में देखे थे।

परिवार का रवैया तत्क्षण बदला — पश्चाताप से नहीं, लालच से। सास, जो सत्यवती को बोझ कह रही थी, अचानक उसकी प्रशंसा करने लगी: "मैंने हमेशा कहा था यह अच्छी लड़की है। इसका पति इस परिवार के आशीर्वाद से अच्छा कर रहा है।"

सोलहवें और अन्तिम शुक्रवार को, सत्यवती ने ऐसी भक्ति से व्रत किया जो रसोई की दीवारों से विकीर्ण हुई। जब उसने पूजा पूर्ण की, उसने कमरे में ऊष्मा भरती अनुभव की — शारीरिक ताप नहीं, बल्कि एक उपस्थिति, जैसे अदृश्य बांहों में समाहित किया जा रहा हो। उसने सन्तोषी माता को देखा नहीं, किन्तु अनुभव किया — एक विशाल, मातृत्व भरा आलिंगन जो बिना शब्दों के कहता था: "तू अकेली नहीं है। तू कभी अकेली नहीं थी।"

अगले दिन, सत्यवती का पति घर लौटा — दब्बू छोटे भाई के रूप में नहीं, बल्कि शहर में बिताए समय से रूपान्तरित व्यक्ति के रूप में, ऊंचा खड़ा, शान्त अधिकार से बोलता। वह परिवार के लिए उपहार लाया, घर के कर्ज़ चुकाए, और — सबसे महत्वपूर्ण — उसने अपनी मां और भाइयों से, दृढ़ता से और बिना क्रोध के कहा: "सत्यवती मेरी पत्नी और मेरी भावी सन्तानों की माता है। इस घर में उसके साथ सम्मानपूर्वक व्यवहार होगा, अन्यथा वह और मैं अपना अलग घर बनाएंगे।"

सास अपने जीवन में पहली बार मौन हो गई।

सत्यवती ने अगले शुक्रवार उद्यापन किया। उसने सरल किन्तु प्रेमपूर्वक पकाया भोजन तैयार किया और गांव के आठ बालकों को बुलाया। उन्हें परोसते हुए, उसे अम्मा के शब्द याद आये: "देवी धन या शक्ति का वचन नहीं देतीं। वे सन्तोष का वचन देती हैं।" और अपना जीवन अब देखते हुए — धनी नहीं, शक्तिशाली नहीं, किन्तु सम्मानित, प्रेमित, और शान्त — सत्यवती ने समझा कि सन्तोष कष्ट की अनुपस्थिति नहीं है। यह कृपा की उपस्थिति है।

किन्तु कथा एक अन्तिम चेतावनी लिए है, जो बतानी अनिवार्य है। उद्यापन के बाद, सास ने, जो सत्यवती की नई प्रतिष्ठा से गुप्त रूप से जलती थी, परिवार के लिए जानबूझकर खट्टी वस्तुओं वाला भोजन बनाया — इमली की चटनी, नीम्बू का अचार, और दही। उसने ये सत्यवती को झूठी मुस्कान से परोसे: "खा बेटी। व्रत के बाद तू भोज की हकदार है।"

सत्यवती ने, अपने सन्तोष में, छल की शंका नहीं की। उसने खाया। और उस सन्ध्या, दुर्भाग्य आया — रसोई में छोटी आग लगी, गाय बीमार पड़ी, और पति को समाचार मिला कि नियोक्ता के व्यापार को हानि हुई। पिछले सप्ताहों की मधुरता रातोंरात कड़वी हो गई।

हतप्रभ सत्यवती अम्मा के पास गई। वृद्ध स्त्री ने सुना और पूछा: "उद्यापन के बाद कुछ खट्टा खाया?" सत्यवती को इमली और नीम्बू याद आया। "यही उल्लंघन है," अम्मा ने गम्भीरता से कहा। "सन्तोषी माता का एक अनुल्लंघनीय नियम यह है कि खट्टा भोजन न केवल व्रत के दौरान बल्कि उद्यापन और बाद के दिनों में भी वर्जित है। खट्टा भोजन ईर्ष्या और कड़वाहट का प्रतीक है — वही भावनाएं जिन्हें देवी दूर करने का कार्य करती हैं। व्रत के बाद उन्हें खाना ऐसा है जैसे उस घाव को फिर से खोलना जो अभी भरना शुरू हुआ था।"

सत्यवती ने तुरन्त उपचारात्मक उपवास किया — तीन अतिरिक्त शुक्रवार, समस्त खट्टे भोजन से कड़ा परहेज। उसने सन्तोषी माता से सच्चे पश्चाताप से क्षमा मांगी, खाने के लिए नहीं, बल्कि तोड़फोड़ पहचानने में सतर्क न रहने के लिए। और देवी ने, जो देवता होने से पहले माता हैं, क्षमा किया। दुर्भाग्य उलट गए। पति का रोज़गार बहाल हुआ। घर एक नए सन्तुलन में ढला — पूर्ण नहीं, क्योंकि परिवार कभी पूर्ण नहीं होते, किन्तु कार्यशील, सम्मानित, और कृपा से स्पर्शित।

इति अध्याय सम्पूर्ण। सन्तोषी माता व्रत सत्यवती के धैर्य से करो, और स्मरण रखो: देवी तुम्हारे कांटे नहीं हटातीं — वे तुम्हें उनके बीच बिना रक्तपात चलना सिखाती हैं। शुक्रवार को खट्टे भोजन से बचो जैसे जीवन में खट्टे विचारों से बचो। और कभी, कभी उस स्त्री की शक्ति को कम मत आंको जिसने अपना केन्द्र खोज लिया है।`,
        },
      },
    ],
    relatedAartis: ['santoshi-maa-aarti'],
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
    samagri: {
      en: [
        'Clay Ganesh murti',
        'Durva grass (21 bundles)',
        'Modak (21 pieces)',
        'Red flowers and shendur (sindoor)',
        'Ghee diya and cotton wicks',
        'Camphor for aarti',
        'Coconut and seasonal fruits',
      ],
      hi: [
        'मिट्टी की गणेश मूर्ति',
        'दूर्वा घास (21 गुच्छ)',
        'मोदक (21)',
        'लाल पुष्प और शेंदूर (सिन्दूर)',
        'घी का दीया और रुई की बत्ती',
        'आरती के लिए कपूर',
        'नारियल और मौसमी फल',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Birth of Ganesha — The Guardian at the Door',
          hi: 'प्रथम अध्याय — गणेश का जन्म और द्वार का रक्षक',
        },
        content: {
          en: `On Mount Kailash, the abode of Lord Shiva, where the peaks pierce the sky and the winds carry the fragrance of divine herbs, Goddess Parvati dwelt with her consort. Their love was the axis upon which the universe turned — Shiva the consciousness, Parvati the energy, together forming the complete reality from which all existence flows. Yet even in paradise, the goddess sometimes found herself alone, for Shiva's nature was wandering. He would depart for tapasya without warning, meditate in remote caves for years that felt like moments, or roam the cremation grounds in the company of his ganas and ghosts, lost in the ecstasy of his own infinite awareness.

Parvati bore this with the patience of a goddess — which is to say, with patience vast as the sky but not without its limits. She had her attendants — Jaya and Vijaya, the doorkeepers — and the ganas, Shiva's wild retinue of spirits and demi-gods. But the ganas were Shiva's creatures, loyal to him first and to her by extension. When she bathed, she had no privacy. When she wished for solitude, there was none to be had. The ganas obeyed Shiva, and Shiva's idea of boundaries was as expansive as his consciousness — which is to say, he had none.

One day, while Shiva was away on one of his unannounced wanderings, Parvati decided to bathe in the sacred spring that flowed from the rocks near their dwelling. The spring water was heated by volcanic warmth from deep within Kailash, and its mineral-rich waters were as rejuvenating as nectar. But Parvati wanted privacy — true privacy, guaranteed by a guardian who answered to her and her alone.

She went to her private chambers and gathered the turmeric paste that she used for her skin — a fragrant golden mixture of haldi, sandalwood, and sacred herbs. With her own divine hands, she began to shape the paste. She worked with the concentration of a sculptor and the love of a mother, for she was creating not merely a form but a soul. She moulded a head — round, with large intelligent eyes and a gentle mouth. She shaped a body — strong but not imposing, built for protection not aggression. She gave him four arms, for divine work requires more than mortal capacity. And she breathed into his nostrils the breath of life — not ordinary life, but a spark of her own Shakti, the primordial energy that powers the universe.

The boy opened his eyes. They were the colour of dark lotus petals, deep and luminous, and they fixed upon Parvati with instant recognition and boundless love. "Ma," he said — the first word ever spoken by this new being, and the word that defined his entire existence.

Parvati's heart overflowed. For the first time on Kailash, she had someone who was wholly, completely, unambiguously hers. Not Shiva's creature, not a servant who served two masters, but her own child — born of her essence, loyal to her will, created by her power. She embraced him, dressed him in fine garments, adorned him with ornaments, and gave him a staff.

"You are my son," she said. "Your name is Ganesh — the lord of the ganas, the master of all obstacles. And I have a task for you. Stand at this door. Let no one — no one at all, regardless of who they claim to be — enter while I bathe. This is my space, and you are its guardian."

Ganesh stood at the door. He was young — newly born, in fact — but his divine origin gave him a presence that belied his age. His eyes were calm. His stance was rooted. His staff was held with the easy confidence of a being who knows exactly what he is and what he has been created to do.

Time passed. Parvati bathed in peace, enjoying the luxury of true privacy for the first time in aeons.

And then Shiva returned.

The great god came striding up the mountain path, his matted locks swinging, his trident gleaming, his bull Nandi trotting behind him. He was in high spirits, eager to see his beloved Parvati after his wanderings. He approached the door of his own dwelling — and found a boy blocking his way.

"Who are you?" Shiva asked, his voice carrying the casual authority of one who is accustomed to being obeyed by the entire universe.

"I am Ganesh," the boy replied, his voice steady. "I am Parvati Ma's son, and she has commanded me to let no one enter while she bathes."

Shiva's eyebrows rose. He had no knowledge of this child — Parvati had created Ganesh during his absence. "Son?" he repeated. "Parvati has no son. I am her husband, and this is my home. Stand aside, boy."

"My mother said no one enters," Ganesh said. "She did not make exceptions."

Shiva, who was not accustomed to being denied anything — least of all entry to his own residence — felt the first stirring of irritation. "I am Shiva," he said, his voice dropping to a deeper register. "The Lord of Kailash. The Destroyer of Worlds. I do not need permission to enter my own home."

"And I am Ganesh," the boy replied without flinching. "The guardian of this door. My mother's command is my dharma. I do not recognize your authority here."

What followed was a confrontation that shook the mountain. Shiva sent his ganas — his personal army of spirits and warriors — to remove the boy. Ganesh defeated them all. His staff whirled like a cyclone. Ganas flew through the air like leaves in a storm. Not one of them could touch him, for he was made of Parvati's Shakti, and Parvati's Shakti is the power that moves even Shiva.

Shiva sent Kartikeya — his own divine son, the commander of the celestial armies, the slayer of Tarakasura. Kartikeya advanced with his vel — the divine spear — and met resistance that surprised him. The boy at the door was not merely strong; he was immovable. The battle raged until Kartikeya withdrew, shaking his head in bewilderment.

By now, Shiva's irritation had hardened into cosmic wrath. The third eye — Shiva's ultimate weapon, the eye whose gaze reduces entire worlds to ash — began to flicker. The temperature on Kailash rose. Stones cracked. Snow melted instantly. The devas, watching from their celestial perches, trembled.

But even the third eye alone could not have overcome Ganesh, for the boy's protection came from Shakti herself. It was Lord Vishnu who intervened — not to attack Ganesh, but to create a distraction. Using his divine maya, Vishnu drew Ganesh's attention for a single moment. And in that moment, Shiva struck.

His trident descended with the force of a collapsing universe. The blade, sharper than the edge between existence and non-existence, severed Ganesh's head from his body. The golden head — shaped with such love by Parvati's own hands — flew from the boy's shoulders and rolled across the rocky floor of Kailash, disappearing over the edge of the mountain into the forests far below.

The body crumpled. The staff clattered to the ground. And the door stood open.

The silence that followed was the silence of a universe holding its breath.

Parvati emerged from her bath. She saw the headless body of her son — the son she had created with her own hands barely hours ago — lying in a pool of his own blood at the threshold. And Parvati's grief became the most dangerous force in creation.

She screamed — and the scream was not merely sound. It was Shakti unleashed, the raw power of the cosmic feminine, and it made the foundations of reality tremble. "Who did this?" she roared, her eyes blazing with a fire that made even Shiva's third eye seem like a candle. "Who killed my son?"

When she learned it was Shiva — her own husband — her grief turned to a fury that threatened to unmake the universe. "You killed a child who was doing nothing but his duty!" she screamed. "He was following my command! He was protecting my dignity! And you — the great Lord Shiva, the master of all creation — could not see past your own ego long enough to wait until I finished my bath?"

She began to transform. The gentle Parvati was dissolving, and in her place rose forms that the universe had hoped never to see — Kali, the dark destroyer, Durga, the invincible warrior, and behind them the shadow of Adi Shakti herself, the primordial power before which even the Trinity bows.

"If my son is not restored to life," Parvati declared, her voice carrying the finality of a death sentence upon reality itself, "I will dissolve this creation. Every world, every being, every atom — returned to the void from which I called them. You think you are the Destroyer, Shiva? You destroy what exists. I can destroy the very possibility of existence."

The devas panicked. Brahma pleaded. Vishnu counselled. And Shiva — Shiva, who had acted in anger, who had mistaken a mother's protection for a stranger's defiance — understood his error. Not merely a tactical mistake, but a failure of the deepest kind: he had destroyed what love had created, because he was too proud to pause and ask.

"Send my ganas north," Shiva commanded, his voice now heavy with remorse. "They are to find the first living being they encounter that is facing north, and bring me its head."

The ganas flew northward and found a great elephant lying on its side, its head facing north, sleeping in a forest clearing. It was an old elephant, wise and dignified, at the end of its natural life. The ganas reverently took its head and brought it back to Kailash.

Shiva placed the elephant's head on Ganesh's body. He pressed his hands to the junction of head and body and poured his own divine energy into the connection. Slowly, the grey skin of the elephant fused with the golden body of the boy. The great ears twitched. The trunk curled. And the eyes — those same large, luminous, lotus-dark eyes — opened once more.

"Ma," Ganesh said again — the same first word, spoken with the same boundless love, but now from a face that the world would recognize for all eternity.

Parvati fell upon her son, weeping with a joy that made the flowers of Kailash bloom out of season. She held his elephant head against her chest and kissed his broad forehead, and her tears watered the earth of the mountain and became streams that flow to this day.

Shiva, humbled as he had never been humbled before, knelt before Ganesh — his wife's creation, the boy he had killed, the son he had restored. "I have wronged you," he said. "And I shall make it right. From this day forward, you shall be worshipped before all other gods — including me. No puja, no ceremony, no auspicious undertaking shall begin without first invoking your name. You are Ganapati — the lord of all the ganas. You are Vighnaharta — the remover of all obstacles. You are Pratham Pujya — the first to be worshipped. And this day — Bhadrapada Shukla Chaturthi — shall be celebrated as the day of your birth, with modaks and durva grass and the love of all who call upon you."

And Ganesh, with the gentle wisdom that was evident even in his newly-joined elephant eyes, looked at Shiva and said: "Father, you did what you believed was right. And I did what I knew was right. There is no anger in my heart. Give me your blessing, and give Ma your love. That is all I ask."

In that moment, Shiva understood something that even the Destroyer of Worlds had not fully grasped: that the greatest power in the universe is not the power to destroy — it is the power to forgive.

Thus ends the chapter. Worship Lord Ganesha knowing that he was born from a mother's love, tested by a father's wrath, and restored by the power of family. He stands at every door, removes every obstacle, and asks only for modaks and your devotion. Ganpati Bappa Morya.`,
          hi: `कैलाश पर्वत पर, भगवान शिव का धाम, जहां शिखर आकाश को भेदते हैं और पवन दिव्य औषधियों की सुगन्ध लाती है, देवी पार्वती अपने पति के साथ निवास करती थीं। उनका प्रेम वह अक्ष था जिस पर ब्रह्माण्ड घूमता है — शिव चेतना, पार्वती शक्ति, मिलकर वह पूर्ण सत्य जिससे समस्त अस्तित्व प्रवाहित होता है। फिर भी स्वर्ग में भी, देवी कभी-कभी स्वयं को अकेला पातीं, क्योंकि शिव का स्वभाव विचरणशील था। वे बिना सूचना तपस्या के लिए प्रस्थान कर जाते, दूरस्थ गुफाओं में वर्षों ध्यान करते जो क्षणों जैसे लगते, या अपने गणों और भूत-प्रेतों की संगति में श्मशान भूमि में घूमते।

पार्वती यह देवी के धैर्य से सहती थीं — अर्थात् आकाश जैसा विशाल धैर्य, किन्तु सीमाहीन नहीं। उनकी परिचारिकाएं थीं — जया और विजया, द्वारपाल — और गण, शिव के उन्मत्त परिचारक। किन्तु गण शिव के प्राणी थे, पहले उनके प्रति वफादार और पार्वती के प्रति विस्तार से। जब वे स्नान करतीं, एकान्त नहीं मिलता। जब एकान्त चाहतीं, कहीं नहीं मिलता।

एक दिन, जब शिव अपनी बिना-सूचना यात्राओं में से एक पर गये थे, पार्वती ने उस पवित्र स्रोत में स्नान करने का निश्चय किया जो उनके निवास के निकट चट्टानों से बहता था। किन्तु पार्वती चाहती थीं एकान्त — सच्चा एकान्त, ऐसे रक्षक द्वारा सुनिश्चित जो केवल उन्हीं की आज्ञा माने।

वे अपने कक्ष में गईं और वह हल्दी का लेप एकत्र किया जो वे त्वचा के लिए प्रयोग करती थीं — हल्दी, चन्दन, और पवित्र जड़ी-बूटियों का सुगन्धित स्वर्णिम मिश्रण। अपने दिव्य हाथों से, वे लेप को आकार देने लगीं। उन्होंने मूर्तिकार की एकाग्रता और माता के प्रेम से काम किया, क्योंकि वे मात्र आकृति नहीं, एक आत्मा रच रही थीं। उन्होंने एक शीश गढ़ा — गोल, बड़ी बुद्धिमान आंखों और कोमल मुख वाला। एक शरीर — बलवान किन्तु आतंकारी नहीं, रक्षा के लिए बना, आक्रमण के लिए नहीं। चार भुजाएं दीं, क्योंकि दिव्य कार्य में मानवीय क्षमता से अधिक चाहिए। और उसकी नासिका में प्राण फूंके — साधारण प्राण नहीं, बल्कि अपनी स्वयं की शक्ति की चिनगारी, वह आदि ऊर्जा जो ब्रह्माण्ड को चलाती है।

बालक ने आंखें खोलीं। उसकी आंखें श्याम कमल की पंखुड़ियों के रंग की थीं, गहरी और दीप्तिमान, और उन्होंने पार्वती पर तत्काल पहचान और असीम प्रेम से दृष्टि स्थिर की। "मां," उसने कहा — इस नवीन प्राणी का पहला शब्द, और वह शब्द जिसने उसके सम्पूर्ण अस्तित्व को परिभाषित किया।

पार्वती का हृदय उमड़ पड़ा। कैलाश पर पहली बार, उनके पास कोई था जो पूर्णतः, सम्पूर्णतः, निःसन्देह उनका था। अपना सन्तान — अपने सार से जन्मा, अपनी इच्छा के प्रति निष्ठावान, अपनी शक्ति से रचित। उन्होंने उसे गले लगाया, सुन्दर वस्त्र पहनाए, आभूषण सजाए, और एक दण्ड दिया।

"तू मेरा पुत्र है," उन्होंने कहा। "तेरा नाम गणेश है — गणों का स्वामी, समस्त बाधाओं का अधिपति। और मेरे पास तेरे लिए एक कार्य है। इस द्वार पर खड़ा रह। किसी को — किसी को भी, चाहे कोई भी होने का दावा करे — मेरे स्नान के समय प्रवेश मत करने देना। यह मेरा स्थान है, और तू इसका रक्षक है।"

गणेश द्वार पर खड़ा हुआ। वह बालक था — वस्तुतः अभी-अभी जन्मा — किन्तु उसकी दिव्य उत्पत्ति ने उसे ऐसी उपस्थिति दी जो उसकी आयु से कहीं आगे थी। उसकी दृष्टि शान्त थी। उसकी मुद्रा स्थिर। उसका दण्ड उस सहज आत्मविश्वास से पकड़ा था जो उस प्राणी का होता है जो ठीक-ठीक जानता है कि वह कौन है और किसलिए रचा गया है।

समय बीता। पार्वती शान्ति से स्नान करती रहीं, युगों में पहली बार सच्चे एकान्त का सुख लेती।

और तभी शिव लौटे।

महादेव पर्वतीय पथ पर चढ़ते आ रहे थे, जटाएं झूलती हुईं, त्रिशूल चमकता, नन्दी पीछे-पीछे। वे प्रसन्न थे, भ्रमण के बाद प्रिय पार्वती से मिलने को उत्सुक। वे अपने निवास के द्वार पर पहुंचे — और एक बालक ने मार्ग रोका।

"तुम कौन हो?" शिव ने पूछा, उनकी वाणी में उसका सहज अधिकार था जो सम्पूर्ण ब्रह्माण्ड की आज्ञाकारिता का अभ्यस्त है।

"मैं गणेश हूं," बालक ने स्थिर स्वर में उत्तर दिया। "मैं पार्वती मां का पुत्र हूं, और उन्होंने मुझे आज्ञा दी है कि उनके स्नान के समय किसी को प्रवेश न करने दूं।"

शिव की भौंहें ऊपर उठीं। "पुत्र? पार्वती का कोई पुत्र नहीं। मैं उनका पति हूं, और यह मेरा घर है। हट जाओ, बालक।"

"मेरी माता ने कहा कोई प्रवेश नहीं करेगा," गणेश ने कहा। "उन्होंने कोई अपवाद नहीं किया।"

जो हुआ उसके बाद पर्वत हिल गया। शिव ने अपने गण भेजे — बालक को हटाने। गणेश ने सबको पराजित किया। उसका दण्ड चक्रवात-सा घूमा। गण तूफान में पत्तों की भांति हवा में उड़े। एक भी उसे छू नहीं सका, क्योंकि वह पार्वती की शक्ति से बना था।

शिव ने कार्तिकेय भेजा — अपना स्वयं का दिव्य पुत्र, दिव्य सेनाओं का सेनापति। कार्तिकेय ने अपने वेल से आक्रमण किया और ऐसे प्रतिरोध से मिला जिसने उसे चकित किया। द्वार का बालक मात्र बलवान नहीं था; वह अचल था।

अब तक, शिव की चिड़चिड़ाहट ब्रह्माण्डीय क्रोध में बदल चुकी थी। तृतीय नेत्र — शिव का परम अस्त्र — झिलमिलाने लगा। किन्तु तृतीय नेत्र अकेला भी गणेश पर विजय नहीं पा सकता था, क्योंकि बालक की रक्षा स्वयं शक्ति से थी। भगवान विष्णु ने हस्तक्षेप किया — गणेश पर आक्रमण करने नहीं, बल्कि ध्यान भटकाने। अपनी दिव्य माया से, विष्णु ने एक क्षण के लिए गणेश का ध्यान खींचा। और उसी क्षण, शिव ने प्रहार किया।

उनका त्रिशूल ध्वस्त होते ब्रह्माण्ड की शक्ति से उतरा। फाल ने, जो अस्तित्व और अनस्तित्व के बीच की सीमा से भी तीक्ष्ण था, गणेश का शीश धड़ से अलग कर दिया। वह सुनहरा शीश — जो पार्वती ने अपने हाथों से इतने प्रेम से गढ़ा था — बालक के कन्धों से उड़ा और कैलाश के चट्टानी फर्श पर लुढ़कता हुआ पर्वत के किनारे से नीचे दूर के वनों में गायब हो गया।

शरीर ढह गया। दण्ड खड़खड़ाता हुआ गिरा। और द्वार खुला खड़ा रहा।

जो मौन हुआ वह ब्रह्माण्ड के श्वास रोके रखने का मौन था।

पार्वती स्नान से बाहर आईं। उन्होंने अपने पुत्र का शीशविहीन शव देखा — वह पुत्र जिसे उन्होंने मात्र घण्टों पहले अपने हाथों से रचा था — देहली पर अपने रक्त के पोखर में पड़ा। और पार्वती का शोक सृष्टि की सबसे खतरनाक शक्ति बन गया।

वे चीखीं — और वह चीख मात्र ध्वनि नहीं थी। वह शक्ति का उन्मोचन था, ब्रह्माण्डीय स्त्री-शक्ति का कच्चा बल, और इसने सत्ता की नींव कंपा दी। "किसने किया यह?" वे गरजीं। "किसने मारा मेरे पुत्र को?"

जब उन्हें पता चला शिव ने — उनके अपने पति ने — उनका शोक ऐसे प्रकोप में बदल गया जो ब्रह्माण्ड को पूर्ववत् करने की धमकी देता था। "तुमने एक बालक को मारा जो अपना कर्तव्य ही कर रहा था! वह मेरी आज्ञा पालन कर रहा था! मेरी गरिमा की रक्षा कर रहा था!"

वे रूपान्तरित होने लगीं। कोमल पार्वती विलीन हो रही थीं, और उनके स्थान पर वे रूप उभर रहे थे जो ब्रह्माण्ड ने कभी न देखने की आशा की थी — काली, अन्धकार-विनाशिनी, दुर्गा, अजेय योद्धा।

"यदि मेरा पुत्र जीवित नहीं किया गया," पार्वती ने घोषणा की, "तो मैं इस सृष्टि को विलीन कर दूंगी। प्रत्येक लोक, प्रत्येक प्राणी, प्रत्येक अणु — उस शून्य में लौट जाएगा जहां से मैंने उन्हें बुलाया।"

देवता घबराए। ब्रह्मा ने विनती की। विष्णु ने परामर्श दिया। और शिव — शिव, जिन्होंने क्रोध में कार्य किया, जिन्होंने माता की रक्षा को अज्ञात की अवज्ञा समझा — ने अपनी भूल समझी। केवल कूटनीतिक त्रुटि नहीं, बल्कि गहनतम विफलता: उन्होंने वह नष्ट किया जो प्रेम ने रचा था, क्योंकि वे रुककर पूछने के लिए बहुत अभिमानी थे।

"मेरे गणों को उत्तर दिशा भेजो," शिव ने आज्ञा दी, उनकी वाणी अब पश्चाताप से भारी। "उन्हें उत्तर की ओर मुख किए प्रथम जीवित प्राणी मिले, उसका शीश लेकर आएं।"

गण उत्तर में उड़े और वन के एक स्थान पर उत्तर की ओर मुख किए सोता एक विशाल गजराज पाया। वह वृद्ध हाथी था, बुद्धिमान और गरिमामय, अपने प्राकृतिक जीवन के अन्त में। गणों ने श्रद्धापूर्वक उसका शीश लिया और कैलाश लौटे।

शिव ने गज-शीश गणेश के शरीर पर रखा। उन्होंने शीश और शरीर के जोड़ पर हाथ रखे और अपनी दिव्य ऊर्जा उंडेल दी। धीरे-धीरे, गज की धूसर त्वचा बालक के स्वर्णिम शरीर से जुड़ गई। विशाल कान फड़के। सूंड़ मुड़ी। और वे आंखें — वही बड़ी, दीप्तिमान, कमल-श्याम आंखें — पुनः खुलीं।

"मां," गणेश ने फिर कहा — वही पहला शब्द, उसी असीम प्रेम से, किन्तु अब उस मुख से जिसे संसार अनन्तकाल तक पहचानेगा।

पार्वती अपने पुत्र पर गिर पड़ीं, ऐसे आनन्द से रोती हुईं जिसने कैलाश के फूलों को ऋतु से बाहर खिला दिया। उन्होंने उसके गज-शीश को छाती से लगाया और उसके चौड़े ललाट को चूमा।

शिव, जो पहले कभी इतने विनम्र नहीं हुए थे, गणेश के सामने घुटने टेके। "मैंने तुम्हारे साथ अन्याय किया," उन्होंने कहा। "और मैं ठीक करूंगा। आज से, तुम सभी देवताओं से पहले पूजे जाओगे — मुझ सहित। कोई पूजा, कोई संस्कार, कोई शुभ कार्य तुम्हारा नाम लिए बिना आरम्भ नहीं होगा। तुम गणपति हो — समस्त गणों के स्वामी। तुम विघ्नहर्ता हो — समस्त बाधाओं को हरने वाले। तुम प्रथम पूज्य हो। और यह दिन — भाद्रपद शुक्ल चतुर्थी — तुम्हारे जन्म दिवस के रूप में मनाया जाएगा, मोदकों और दूर्वा और सबके प्रेम के साथ।"

और गणेश ने, अपने नव-जुड़े गज-नेत्रों में भी स्पष्ट उस शान्त बुद्धि के साथ, शिव को देखा और कहा: "पिताजी, आपने वह किया जो आपने ठीक समझा। और मैंने वह किया जो मैं ठीक जानता था। मेरे हृदय में कोई क्रोध नहीं। मुझे अपना आशीर्वाद दीजिए, और मां को अपना प्रेम। बस इतना ही मैं मांगता हूं।"

उस क्षण, शिव ने कुछ समझा जो संसारों के संहारक ने भी पूर्णतः नहीं जाना था: कि ब्रह्माण्ड में सबसे बड़ी शक्ति विनाश की शक्ति नहीं — क्षमा की शक्ति है।

इति अध्याय सम्पूर्ण। भगवान गणेश की पूजा यह जानकर करो कि वे माता के प्रेम से जन्मे, पिता के क्रोध से परीक्षित, और परिवार की शक्ति से पुनर्स्थापित हुए। वे प्रत्येक द्वार पर खड़े हैं, प्रत्येक बाधा हरते हैं, और केवल मोदक और तुम्हारी भक्ति मांगते हैं। गणपति बप्पा मोरया।`,
        },
      },
    ],
    relatedAartis: ['ganesh-aarti'],
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
    samagri: {
      en: [
        'Ahoi Mata drawing or printed image',
        'Water pot (lota)',
        'Puri (fried bread)',
        'Halwa (semolina pudding)',
        'Ghee diya and cotton wicks',
        'Roli, rice, and flowers for puja',
      ],
      hi: [
        'अहोई माता का चित्र या प्रिंट',
        'जल पात्र (लोटा)',
        'पूड़ी',
        'हलवा (सूजी का)',
        'घी का दीया और रुई की बत्ती',
        'रोली, चावल और पुष्प पूजा के लिए',
      ],
    },
    chapters: [
      {
        number: 1,
        title: {
          en: 'The Mother, the Porcupine, and the Grace of Ahoi Mata',
          hi: 'प्रथम अध्याय — माता, साही, और अहोई माता की कृपा',
        },
        content: {
          en: `In a village surrounded by dense forest, there lived a woman who was blessed with seven sons. They were the pride of her life — seven strong boys, each born a year apart, growing like young saplings in a garden of plenty. Her husband was a farmer of modest means, but together they had built a life that lacked nothing essential. The fields gave grain. The cow gave milk. The well gave water. And the seven sons gave more joy than a mother's heart could hold.

As Diwali approached one autumn, the mother decided to renovate their house for the festival. The earthen walls needed fresh mud plaster, and the floors needed re-laying. She took her small iron spade — the khurupi, a sharp digging tool used by village women — and went to the edge of the forest where the best clay was found, near the roots of an old banyan tree.

She began to dig. The clay was soft and rich, perfect for plastering. She drove her spade deep, scooped out load after load, humming a festival song to herself, her mind full of plans for the Diwali decorations. Her hands worked rhythmically, automatically, guided by years of practice.

Then the spade struck something soft. Not a root. Not a stone. Something that yielded, then resisted, then screamed.

The mother pulled back her spade and saw, in the freshly dug clay, a nest — a porcupine's burrow, warm and lined with dried grass. And in the nest, a baby porcupine — a syahi — barely a week old, its eyes still closed, its tiny quills soft as kitten fur. Her spade had struck the creature. Blood pooled around its small body. It twitched once, twice, and was still.

The mother dropped the spade. Her hands flew to her mouth. Horror flooded through her like ice water. She had killed a baby animal — a helpless infant in its own home, murdered by her carelessness while she hummed a happy song. She looked around wildly, hoping no one had seen. No one had. The forest was silent. The dead syahi lay in its broken nest, a tiny accusation made of blood and silence.

She could not undo it. She could not bring it back. She gathered her clay with shaking hands, covered the nest with leaves — as though hiding the evidence would hide the deed from fate — and returned home. She told no one. She plastered her walls with the clay that had been mixed with the blood of an innocent creature, and she prepared for Diwali with a smile that did not reach her eyes.

But karma does not forget.

Within the first month after Diwali, her eldest son fell ill with a fever that no village healer could diagnose. He grew thin, his eyes became hollow, and before the month was out, he was dead. The mother's grief was devastating — but she had six sons remaining, and grief, however deep, does not always connect causes to consequences.

Three months later, her second son drowned in the village pond — a pond he had swum in since childhood, a pond shallow enough for a child to stand in. They said he must have hit his head on a rock and lost consciousness. The mother screamed until her voice broke, but her screams did not bring him back.

By the end of that year, a third son was gone — bitten by a snake that had never been seen in the village before, a krait that appeared in the boy's bed as though placed there by an invisible hand. The fourth was killed by a falling tree during a storm — a tree that had stood for a century and chose that precise moment, that precise angle, to fall upon the exact spot where the boy was sleeping.

By now, the mother knew. Not with her rational mind — she was a simple village woman, not a philosopher — but with the deep, ancestral knowing that lives in the bones of every Indian mother. She had sinned. She had taken an innocent life, and the universe was taking her innocent lives in return. The cosmic ledger was being balanced, and the currency was her children.

The fifth son died of a wasting disease that turned his skin grey and his laughter to silence. The sixth was carried away by a flash flood that came from nowhere on a cloudless day. And the seventh — her baby, her last hope, her final anchor to the will to live — fell from the roof of the house while flying a kite, landing on the very stones that the mother had plastered with the fatal clay.

Seven sons. All gone. In less than two years.

The mother did not die. That would have been mercy, and the universe, when it teaches, is not always merciful. She lived — empty, hollow, her eyes the eyes of a woman who has seen the bottom of the abyss and found that the bottom is a mirror.

Her husband, broken beyond repair, withdrew into silence. The villagers, who had once envied her seven sons, now crossed the street when they saw her coming, as though death were contagious. The house — freshly plastered, beautifully decorated for a Diwali that now seemed like a lifetime ago — stood silent, its seven beds empty, its walls a monument to a moment of carelessness that had cost everything.

One day, an old wise woman — the village's eldest, a woman who remembered stories from her grandmother's grandmother — came to the mother's house. She found the mother sitting on the floor, staring at nothing, her hair unwashed, her clothes unchanged, a living ghost in her own home.

"I know what happened," the old woman said gently. She had heard the mother's midnight confessions to the empty rooms — the whispered story of the spade and the syahi that the mother had been repeating to herself like a mantra of guilt. "You killed a syahi's child. The mother porcupine cursed you. And the curse has taken all seven of your sons."

The mother raised her empty eyes. "Is there a way to undo it? Or must I live like this until I die?"

"There is a way," the old woman said. "But it requires more than penance. It requires genuine transformation. You must worship Ahoi Mata — the Mother Earth aspect of the divine feminine, the goddess who presides over the bond between mothers and children, the power that gives life and can restore it."

"On Kartik Krishna Ashtami — eight days before Diwali — you must fast from sunrise. Not a grain of food, not a drop of water, until the first star appears in the evening sky. Draw the image of Ahoi Mata on the wall — she is depicted with the syahi and her cubs, for the porcupine is her sacred animal. When the first star appears, offer water and grain and sweets to Ahoi Mata, and tell her your story. Tell her everything — the digging, the spade, the blood, the cover-up. Hide nothing. And then ask not for your sons to be returned — for that is too great a demand to make of even a goddess — but for forgiveness. Ask for the curse to be lifted. Ask for the cycle of karmic retribution to be broken."

"And if the goddess does not listen?" the mother whispered.

"She is a mother," the old woman replied. "Mothers always listen."

The mother followed the instruction to the letter. On Kartik Krishna Ashtami, she rose before dawn — the first time she had risen early in months — and cleaned herself and her house. She drew the image of Ahoi Mata on the wall with trembling hands: the goddess seated with the syahi and her cubs, surrounded by stars. She fasted through the entire day — the first time in months she had felt anything other than numbness, for hunger is at least a sensation, a reminder that the body is still alive even when the heart has died.

As the sun set and the sky deepened from gold to indigo, the mother sat before the image, her eyes fixed on the sky above the roofline, waiting for the first star. The minutes stretched like hours. The sky darkened. And then — there it was. A single point of light, steady and eternal, piercing the twilight.

The mother offered water from a clay pot. She offered grain — wheat and rice, the same crops her husband grew in the fields where her sons once played. She offered halwa — made with shaking hands, sweetened with the last sugar in the house. And she spoke.

She told Ahoi Mata everything. The digging. The song she was humming. The softness of the spade striking flesh. The blood. The covering of leaves. The silence. And then the deaths — one by one, each one described with the precision of a mother who remembers every detail of every child she has lost. She did not spare herself. She did not make excuses. She said: "I killed an innocent creature while it slept in its mother's nest. I deserve this punishment. But my sons were innocent. If there is justice in the universe, let the punishment fall on me alone, not on them."

And then she wept. For the first time since the seventh son's death, she truly wept — not the empty tears of exhaustion, but the deep, purifying tears of genuine repentance, the tears that wash away karma as surely as the Ganga washes away sin.

The image of Ahoi Mata on the wall seemed to shimmer. The drawn syahi seemed to breathe. And in the silence of that twilight room, the mother felt a presence — vast, warm, ancient, maternal. Not a voice, not a vision, but a feeling: the feeling of being held by the earth itself, cradled in the arms of the ground that holds every seed until it is ready to sprout.

The mother fell asleep before the image, her body collapsed by grief and fasting. And in her sleep, she dreamed. She dreamed of a forest clearing where seven young trees stood — saplings, thin and pale, leafless, their roots barely holding the soil. As she watched, a gentle rain began to fall — warm rain, golden rain — and the saplings straightened, their bark thickened, their roots dug deep, and green leaves unfurled from every branch. The trees grew tall and strong, and in their shade, seven boys played, their laughter echoing through the dream-forest like temple bells.

She woke at dawn. The house was silent, as it had been for months. But something had changed — the quality of the silence. It was no longer the silence of absence. It was the silence of anticipation.

Within the week, a miracle unfolded. Her eldest son's grave was found empty one morning — not dug up, but simply empty, as though the earth had opened from below and released what it held. Before the village could process this impossibility, the boy appeared at the village well, confused, healthy, and hungry, with no memory of his death and no awareness that time had passed. One by one, over the course of seven days, each son returned — each one healthy, each one confused, each one hungry. The village watched in stunned silence as seven dead boys walked back into their mother's house, sat down at the table, and asked for breakfast.

The mother fed them. She held each one so tightly that they complained their ribs hurt. She laughed and wept simultaneously, a sound that the villagers would describe for generations as the most joyful noise they had ever heard.

From that day, the mother observed Ahoi Ashtami every year without fail. She became the village's most devoted advocate for the vrat, teaching young mothers the story and the ritual with a passion that came from lived experience. "Never harm a creature in its nest," she would say. "And if you do — for we are all imperfect, and accidents happen — do not hide it. Confess it to Ahoi Mata. She is a mother. She understands mistakes. But she cannot forgive what is not confessed."

She would draw the image of Ahoi Mata with the syahi every year, and each time she drew the baby porcupine, she would pause, touch the image gently, and whisper: "Forgive me. I remember." And the drawn syahi, they say, always seemed to smile.

Thus ends the chapter. Observe Ahoi Ashtami with this mother's repentance and faith. Fast for your children, pray for their protection, and remember that the bond between mother and child is sacred — so sacred that it extends even to the smallest creature in the smallest burrow in the darkest forest. Ahoi Mata watches over all mothers, and all mothers watch over all children. This is the way of the world, and it is good.`,
          hi: `घने वन से घिरे एक गांव में एक ऐसी स्त्री रहती थी जो सात पुत्रों से सौभाग्यशाली थी। वे उसके जीवन का गौरव थे — सात बलवान बालक, प्रत्येक एक वर्ष के अन्तर से जन्मे, प्रचुरता के उद्यान में युवा वृक्षों की भांति बढ़ते। पति साधारण किसान था, किन्तु मिलकर उन्होंने ऐसा जीवन बनाया था जिसमें किसी आवश्यक वस्तु की कमी नहीं थी। खेत अनाज देते। गाय दूध देती। कुआं जल देता। और सात पुत्र उतना आनन्द देते जितना एक माता का हृदय समा नहीं सकता।

एक शरद ऋतु में जब दीपावली निकट आई, माता ने उत्सव के लिए घर का जीर्णोद्धार करने का निश्चय किया। मिट्टी की दीवारों को ताजी लिपाई चाहिए थी, और फर्श को पुनः बिछाना था। उसने अपना छोटा लोहे का खुरपा लिया — गांव की स्त्रियों द्वारा प्रयुक्त तीखा खुदाई का औजार — और वन के किनारे गई जहां पुराने बरगद की जड़ों के पास सबसे अच्छी मिट्टी मिलती थी।

उसने खोदना शुरू किया। मिट्टी मुलायम और उपजाऊ थी, लिपाई के लिए उत्तम। उसने खुरपा गहरा गाड़ा, बोझ-दर-बोझ निकाला, उत्सव का गीत गुनगुनाती हुई, मन दीपावली की सजावट की योजनाओं से भरा।

तभी खुरपा किसी मुलायम चीज से टकराया। जड़ नहीं। पत्थर नहीं। कुछ जो झुका, फिर अटका, फिर चीखा।

माता ने खुरपा खींचा और ताजी खुदी मिट्टी में देखा — एक बिल, साही का बिल, गर्म और सूखी घास से पंक्तिबद्ध। और बिल में, एक नवजात साही — स्याही — मुश्किल से सप्ताह भर का, आंखें अभी बन्द, उसके छोटे कांटे बिल्ली के बच्चे के रोएं जैसे मुलायम। उसके खुरपे ने उस प्राणी पर प्रहार किया था। रक्त उसके छोटे शरीर के चारों ओर जमा हो गया। वह एक बार तड़पा, दो बार, और स्थिर हो गया।

माता ने खुरपा गिरा दिया। हाथ मुंह पर गए। भय बर्फ के पानी की भांति उसमें भर गया। उसने एक बच्चे को मारा था — एक असहाय शिशु को उसके अपने घर में, उसकी लापरवाही ने हत्या की जब वह खुशी का गीत गुनगुना रही थी। उसने कांपते हाथों से मिट्टी इकट्ठी की, बिल को पत्तों से ढका — जैसे प्रमाण छिपाने से कर्म भाग्य से छिप जाएगा — और घर लौट गई। किसी को नहीं बताया।

किन्तु कर्म नहीं भूलता।

दीपावली के बाद पहले महीने में, उसका बड़ा पुत्र एक ऐसे ज्वर से बीमार पड़ा जिसका कोई गांव का वैद्य निदान नहीं कर सका। वह दुबला हुआ, आंखें धंस गईं, और महीना बीतने से पहले, वह मर गया।

तीन महीने बाद, दूसरा पुत्र गांव के तालाब में डूब गया — वही तालाब जिसमें वह बचपन से तैरता था। तीसरा सांप ने काटा। चौथा तूफान में गिरे वृक्ष ने। पांचवां एक क्षयकारी रोग से। छठा अचानक आई बाढ़ में। और सातवां — उसका शिशु, उसकी अन्तिम आशा — दीपावली वाली मिट्टी से लिपे घर की छत से गिरकर।

सात पुत्र। सब गए। दो वर्ष से भी कम में।

माता मरी नहीं। वह जीवित रही — रिक्त, खोखली। एक दिन, गांव की सबसे बुजुर्ग स्त्री — एक वृद्ध ज्ञानी — माता के घर आई।

"मुझे पता है क्या हुआ था," वृद्ध स्त्री ने कोमलता से कहा। "तुमने साही का बच्चा मारा। साही की माता ने तुम्हें शाप दिया। और शाप ने तुम्हारे सातों पुत्र ले लिए।"

माता ने रिक्त आंखें उठाईं। "क्या कोई उपाय है? या मुझे मरने तक ऐसे ही जीना होगा?"

"एक उपाय है," वृद्ध स्त्री ने कहा। "किन्तु इसमें प्रायश्चित्त से अधिक चाहिए। सच्चा रूपान्तरण चाहिए। तुम्हें अहोई माता की पूजा करनी होगी — दिव्य स्त्री-शक्ति का धरती माता स्वरूप, वह देवी जो माताओं और सन्तानों के बन्धन की अधिष्ठात्री है।"

"कार्तिक कृष्ण अष्टमी को — दीपावली से आठ दिन पहले — सूर्योदय से व्रत रखो। एक दाना अन्न नहीं, एक बूंद जल नहीं, जब तक सन्ध्या आकाश में पहला तारा न दिखे। दीवार पर अहोई माता का चित्र बनाओ — वे साही और उसके शावकों के साथ दर्शाई जाती हैं, क्योंकि साही उनका पवित्र पशु है। जब पहला तारा दिखे, अहोई माता को जल, अनाज और मिठाई अर्पित करो, और अपनी कथा सुनाओ। सब कुछ — खुदाई, खुरपा, रक्त, छिपाना। कुछ मत छिपाओ। और फिर यह मत मांगो कि पुत्र लौटें — क्योंकि यह देवी से भी बड़ी मांग है — बल्कि क्षमा मांगो। शाप हटाने की प्रार्थना करो।"

"और यदि देवी न सुनें?" माता ने फुसफुसाया।

"वे माता हैं," वृद्ध स्त्री ने उत्तर दिया। "माताएं सदा सुनती हैं।"

माता ने अक्षरशः पालन किया। कार्तिक कृष्ण अष्टमी को, वह भोर से पहले उठी — महीनों में पहली बार। उसने स्वयं को और घर को साफ किया। कांपते हाथों से दीवार पर अहोई माता का चित्र बनाया: देवी साही और शावकों के साथ, तारों से घिरी। पूरा दिन उपवास किया।

जैसे ही सूर्य अस्त हुआ और आकाश स्वर्ण से नील में गहराया, माता चित्र के सामने बैठी, आंखें छत के ऊपर के आकाश पर स्थिर, पहले तारे की प्रतीक्षा में। मिनट घण्टों की भांति खिंचे। आकाश अंधेरा हुआ। और तभी — वह था। प्रकाश का एक बिन्दु, स्थिर और शाश्वत, सन्ध्या को भेदता।

माता ने मिट्टी के पात्र से जल अर्पित किया। अनाज — गेहूं और चावल। हलवा — कांपते हाथों से बना, घर की अन्तिम चीनी से मीठा। और बोली।

उसने अहोई माता को सब बताया। खुदाई। जो गीत गुनगुना रही थी। खुरपे का मांस पर प्रहार करने का मुलायमपन। रक्त। पत्तों का ढकना। मौन। और फिर मृत्यु — एक-एक करके, प्रत्येक उस सटीकता से वर्णित जो उस माता की होती है जो अपने प्रत्येक खोये सन्तान का प्रत्येक विवरण याद रखती है। उसने स्वयं को नहीं बख्शा। बहाने नहीं बनाए। कहा: "मैंने एक निर्दोष प्राणी को उसकी माता के बिल में सोते हुए मारा। मैं इस दण्ड की पात्र हूं। किन्तु मेरे पुत्र निर्दोष थे। यदि ब्रह्माण्ड में न्याय है, तो दण्ड केवल मुझ पर गिरे, उन पर नहीं।"

और फिर वह रोई। सातवें पुत्र की मृत्यु के बाद पहली बार, सच में रोई — थकान के रिक्त अश्रु नहीं, बल्कि सच्चे पश्चाताप के गहरे, शुद्ध करने वाले अश्रु, वे अश्रु जो कर्म को उतनी ही निश्चितता से धोते हैं जैसे गंगा पाप धोती है।

दीवार पर अहोई माता का चित्र चमचमाता लगा। बनाई हुई साही श्वास लेती लगी। और उस सन्ध्या-काल के मौन कमरे में, माता ने एक उपस्थिति अनुभव की — विशाल, उष्ण, प्राचीन, मातृत्वपूर्ण। न वाणी, न दर्शन, बल्कि एक भाव: स्वयं पृथ्वी द्वारा धारण किए जाने का भाव, उस भूमि की गोद में पालित जो प्रत्येक बीज को तब तक धारण करती है जब तक वह अंकुरित होने को तैयार न हो।

माता चित्र के सामने सो गई, शरीर शोक और उपवास से ढह गया। और निद्रा में, उसने स्वप्न देखा। उसने वन के एक स्थान में सात युवा वृक्ष देखे — पौधे, पतले और पीले, पत्तीविहीन, उनकी जड़ें मुश्किल से मिट्टी पकड़े। जैसे-जैसे उसने देखा, एक कोमल वर्षा होने लगी — गर्म, स्वर्णिम — और पौधे सीधे हुए, उनकी छाल मोटी हुई, जड़ें गहरी गईं, और हरे पत्ते प्रत्येक शाखा से खुले। वृक्ष ऊंचे और मजबूत हुए, और उनकी छाया में, सात बालक खेले, उनकी हंसी स्वप्न-वन में मन्दिर की घण्टियों की भांति गूंजती।

वह भोर में जागी। घर मौन था, जैसा महीनों से था। किन्तु कुछ बदल गया था — मौन का गुण। यह अब अनुपस्थिति का मौन नहीं था। यह प्रतीक्षा का मौन था।

सप्ताह के भीतर, एक चमत्कार प्रकट हुआ। बड़े पुत्र की समाधि एक प्रातः खाली मिली — खोदी नहीं गई, बल्कि बस खाली, जैसे पृथ्वी ने नीचे से खुलकर जो धारण कर रखा था छोड़ दिया। गांव इस असम्भवता को समझ पाता उससे पहले, बालक गांव के कुएं पर प्रकट हुआ, भ्रमित, स्वस्थ, और भूखा, न मृत्यु की कोई स्मृति, न समय बीतने का बोध। एक-एक करके, सात दिनों में, प्रत्येक पुत्र लौटा — प्रत्येक स्वस्थ, भ्रमित, भूखा। गांव ने स्तब्ध मौन में देखा जब सात मृत बालक अपनी माता के घर में लौटे, मेज पर बैठे, और नाश्ता मांगा।

माता ने उन्हें खिलाया। प्रत्येक को इतनी कसकर पकड़ा कि उन्होंने शिकायत की पसलियां दुख रही हैं। वह एक साथ हंसी और रोई, एक ध्वनि जिसे गांव वाले पीढ़ियों तक वर्णन करेंगे कि वह उनकी सुनी सबसे आनन्दपूर्ण ध्वनि थी।

उस दिन से, माता ने प्रत्येक वर्ष बिना चूक अहोई अष्टमी का पालन किया। वह गांव की सबसे समर्पित प्रचारक बन गई, युवा माताओं को कथा और अनुष्ठान ऐसी प्रबलता से सिखाती जो जीवित अनुभव से आती थी। "कभी किसी प्राणी को उसके बिल में हानि मत पहुंचाओ," वह कहती। "और यदि पहुंचा दो — क्योंकि हम सब अपूर्ण हैं, और दुर्घटनाएं होती हैं — तो छिपाओ मत। अहोई माता से कहो। वे माता हैं। वे गलतियां समझती हैं। किन्तु जो स्वीकार नहीं किया, उसे क्षमा नहीं कर सकतीं।"

वह प्रत्येक वर्ष साही के साथ अहोई माता का चित्र बनाती, और हर बार जब शावक बनाती, रुकती, चित्र को कोमलता से छूती, और फुसफुसाती: "क्षमा करें। मुझे याद है।" और बनाई हुई साही, वे कहते हैं, सदा मुस्कुराती लगती थी।

इति अध्याय सम्पूर्ण। अहोई अष्टमी इस माता के पश्चाताप और श्रद्धा से मनाओ। अपनी सन्तानों के लिए उपवास करो, उनकी रक्षा की प्रार्थना करो, और स्मरण रखो कि माता और सन्तान का बन्धन पवित्र है — इतना पवित्र कि यह सबसे अंधेरे वन के सबसे छोटे बिल के सबसे छोटे प्राणी तक विस्तृत है। अहोई माता सभी माताओं की रक्षक हैं, और सभी माताएं सभी सन्तानों की। यही संसार का मार्ग है, और यह शुभ है।`,
        },
      },
    ],
    relatedAartis: [],
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

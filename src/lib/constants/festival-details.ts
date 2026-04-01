/**
 * Rich trilingual content for festivals, vrats, and Ekadashis.
 * Keyed by slug (festival-engine generates matching slugs).
 */
import type { Trilingual } from '@/types/panchang';

export interface FestivalDetail {
  name: Trilingual;
  mythology: Trilingual;
  observance: Trilingual;
  significance: Trilingual;
  deity?: Trilingual;
  isFast?: boolean;
  fastNote?: Trilingual;
}

/* ═══════════════════════════════════════════
   MAJOR FESTIVALS
   ═══════════════════════════════════════════ */

export const FESTIVAL_DETAILS: Record<string, FestivalDetail> = {
  // ── Major Festivals ──
  'makar-sankranti': {
    name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', sa: 'मकरसंक्रान्तिः' },
    mythology: {
      en: 'Makar Sankranti marks the Sun\'s northward journey (Uttarayana) — considered the beginning of the auspicious half of the year. In the Mahabharata, Bhishma Pitamah waited on his bed of arrows for this day to depart, as dying during Uttarayana is believed to lead to liberation.',
      hi: 'मकर संक्रान्ति सूर्य की उत्तरायण यात्रा का प्रतीक है — वर्ष के शुभ अर्धभाग का आरम्भ। महाभारत में भीष्म पितामह ने इस दिन की प्रतीक्षा शर-शय्या पर की, क्योंकि उत्तरायण में मृत्यु मोक्षदायिनी मानी जाती है।',
      sa: 'मकरसंक्रान्तिः सूर्यस्य उत्तरायणयात्रायाः प्रतीकः — वर्षस्य शुभार्धभागस्य आरम्भः।',
    },
    observance: {
      en: 'Take a holy bath at sunrise, offer water to the Sun (Surya Arghya), donate sesame seeds and jaggery. Fly kites (in Gujarat and Rajasthan). Prepare til-gul laddoos and khichdi. It is one of the few festivals based on the solar calendar, so it falls on nearly the same Gregorian date each year.',
      hi: 'सूर्योदय पर पवित्र स्नान, सूर्य को अर्घ्य, तिल और गुड़ का दान। पतंग उड़ाएँ। तिल-गुड़ के लड्डू और खिचड़ी बनाएँ। यह सौर कैलेंडर पर आधारित कुछ त्योहारों में से एक है।',
      sa: 'सूर्योदये पवित्रस्नानं, सूर्याय अर्घ्यं, तिलगुडदानं च। तिलगुडलड्डुकान् खिचडीं च पचतु।',
    },
    significance: {
      en: 'Marks the transition from Dakshinayana (southward) to Uttarayana (northward movement of the Sun). Days begin to grow longer. Auspicious for charity, penance, and new beginnings.',
      hi: 'दक्षिणायन से उत्तरायण में सूर्य के संक्रमण का प्रतीक। दिन लम्बे होने लगते हैं। दान, तपस्या और नई शुरुआत के लिए शुभ।',
      sa: 'दक्षिणायनात् उत्तरायणे सूर्यसंक्रमणस्य प्रतीकः। दिनानि दीर्घाणि भवन्ति।',
    },
    deity: { en: 'Surya (Sun God)', hi: 'सूर्य देव', sa: 'सूर्यदेवः' },
  },

  'vasant-panchami': {
    name: { en: 'Vasant Panchami', hi: 'वसन्त पञ्चमी', sa: 'वसन्तपञ्चमी' },
    mythology: {
      en: 'Lord Brahma created the world but found it silent and lifeless. He prayed to Goddess Saraswati, who emerged from his mouth playing the Veena. Her music filled creation with life, speech, and wisdom. This day celebrates her appearance.',
      hi: 'ब्रह्मा जी ने सृष्टि रची पर वह मूक और निर्जीव थी। उन्होंने देवी सरस्वती की प्रार्थना की, जो वीणा बजाती हुई उनके मुख से प्रकट हुईं। उनके संगीत ने सृष्टि को जीवन, वाणी और ज्ञान से भर दिया।',
      sa: 'ब्रह्मा सृष्टिम् अरचयत् किन्तु सा मूका निर्जीवा चासीत्। सरस्वतीदेवी वीणावादयन्ती तस्य मुखात् प्राकट्यत।',
    },
    observance: {
      en: 'Worship Goddess Saraswati with yellow flowers and sweets. Wear yellow clothes (symbolizing the mustard fields of spring). Start new learning or creative pursuits. Place books, instruments, and pens before the deity. Children are often initiated into learning (Vidyarambham) on this day.',
      hi: 'देवी सरस्वती की पीले फूलों और मिठाइयों से पूजा करें। पीले वस्त्र पहनें। नई शिक्षा या सृजनात्मक कार्य आरम्भ करें। बच्चों का विद्यारम्भ संस्कार इस दिन किया जाता है।',
      sa: 'सरस्वतीदेवीं पीतपुष्पैः मिष्टान्नैः च पूजयतु। पीतवस्त्राणि धारयतु। नवशिक्षां आरभतु।',
    },
    significance: {
      en: 'Marks the arrival of spring. Considered the most auspicious day for starting education, learning music, and artistic endeavours. Yellow represents knowledge and prosperity.',
      hi: 'वसन्त ऋतु के आगमन का प्रतीक। शिक्षा, संगीत और कला आरम्भ करने का सबसे शुभ दिन।',
      sa: 'वसन्तर्तोः आगमनस्य प्रतीकः। शिक्षायाः संगीतस्य कलायाः च आरम्भार्थं शुभतमं दिनम्।',
    },
    deity: { en: 'Saraswati', hi: 'सरस्वती', sa: 'सरस्वती' },
  },

  'maha-shivaratri': {
    name: { en: 'Maha Shivaratri', hi: 'महाशिवरात्रि', sa: 'महाशिवरात्रिः' },
    mythology: {
      en: 'Multiple stories surround this night: It is when Lord Shiva performed the Tandava — the cosmic dance of creation and destruction. It is also when Shiva drank the Halahala poison during Samudra Manthan to save the universe, turning his throat blue (Neelakantha). Some traditions hold it as the wedding night of Shiva and Parvati.',
      hi: 'इस रात्रि से अनेक कथाएँ जुड़ी हैं: शिव ने ताण्डव नृत्य किया — सृष्टि और विनाश का ब्रह्माण्डीय नृत्य। समुद्र मन्थन में विश्व को बचाने के लिए शिव ने हलाहल विष पिया, जिससे उनका कण्ठ नीला हो गया (नीलकण्ठ)।',
      sa: 'अस्मिन् रात्रौ शिवः ताण्डवनृत्यम् अकरोत्। समुद्रमन्थने विश्वरक्षार्थं हालाहलविषम् अपिबत्, तेन तस्य कण्ठः नीलः अभवत्।',
    },
    observance: {
      en: 'Observe a strict fast (nirjala or with fruits). Stay awake all night (jagaran). Offer Bel leaves, milk, water, and honey to the Shiva Lingam during four Praharas (night quarters). Chant "Om Namah Shivaya". Visit Shiva temples.',
      hi: 'कठोर उपवास रखें (निर्जला या फलाहार)। रात भर जागें (जागरण)। चार प्रहरों में शिवलिंग पर बेलपत्र, दूध, जल और शहद चढ़ाएँ। "ओम नमः शिवाय" का जाप करें।',
      sa: 'कठोरं व्रतं धारयतु। सर्वां रात्रिं जागृतं तिष्ठतु। चतुर्षु प्रहरेषु शिवलिङ्गे बिल्वपत्राणि क्षीरं जलं मधु च अर्पयतु।',
    },
    significance: {
      en: 'The darkest night of the year — symbolizing the overcoming of darkness and ignorance. Considered the night when Shiva\'s energy is most accessible. Fasting and meditation on this night is said to be equivalent to a year of spiritual practice.',
      hi: 'वर्ष की सबसे अन्धकारमय रात्रि — अन्धकार और अज्ञान पर विजय का प्रतीक। इस रात्रि शिव की ऊर्जा सर्वाधिक सुलभ मानी जाती है।',
      sa: 'वर्षस्य अन्धकारतमा रात्रिः — अन्धकारस्य अज्ञानस्य च उपरि विजयस्य प्रतीकः।',
    },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'शिवः' },
    isFast: true,
    fastNote: { en: 'Strict fast (nirjala or fruits only). Break fast next morning after puja.', hi: 'कठोर व्रत (निर्जला या केवल फलाहार)। अगली सुबह पूजा के बाद पारण करें।', sa: 'कठोरं व्रतम्। प्रातः पूजानन्तरं पारणम्।' },
  },

  'holi': {
    name: { en: 'Holi', hi: 'होली', sa: 'होलिका' },
    mythology: {
      en: 'Hiranyakashipu, a demon king, tried to kill his son Prahlad for worshipping Lord Vishnu. His sister Holika, who had a boon of fire immunity, sat with Prahlad in a bonfire. But the boon worked only when Holika sat alone — she was burned while Prahlad emerged unscathed. The bonfire (Holika Dahan) on the eve celebrates this victory.',
      hi: 'दैत्य राजा हिरण्यकशिपु ने अपने पुत्र प्रह्लाद को विष्णु की भक्ति के लिए मारने का प्रयास किया। उसकी बहन होलिका, जिसे अग्नि से प्रतिरक्षा का वरदान था, प्रह्लाद को गोद में लेकर अग्नि में बैठी। पर वरदान केवल अकेले बैठने पर काम करता था — होलिका जल गई और प्रह्लाद बच गया।',
      sa: 'हिरण्यकशिपुः स्वपुत्रं प्रह्लादं विष्णुभक्तेः कारणात् हन्तुम् अप्रयतत। तस्य भगिनी होलिका अग्निसुरक्षावरदानयुक्ता प्रह्लादं गृहीत्वा अग्नौ उपाविशत्। किन्तु होलिका दग्धा प्रह्लादः च सुरक्षितः।',
    },
    observance: {
      en: 'Evening before: Holika Dahan — light a bonfire, circumambulate it, offer coconut and grains. Next day: Play with colours (gulal, water balloons), drink thandai and bhang, eat gujiya and sweets. Visit friends and family.',
      hi: 'पूर्व संध्या: होलिका दहन — अलाव जलाएँ, परिक्रमा करें। अगले दिन: रंगों से खेलें (गुलाल, पिचकारी), ठण्डाई पिएँ, गुजिया खाएँ। मित्रों और परिवार से मिलें।',
      sa: 'पूर्वसन्ध्या: होलिकादहनम्। अग्रे दिने: रङ्गैः क्रीडतु। मित्रान् कुटुम्बं च मिलतु।',
    },
    significance: {
      en: 'Victory of good (Prahlad\'s devotion) over evil (Hiranyakashipu\'s arrogance). Celebration of spring, renewal, and the breaking of social barriers through shared joy.',
      hi: 'अच्छाई (प्रह्लाद की भक्ति) की बुराई (हिरण्यकशिपु के अहंकार) पर विजय। वसन्त, नवीनता और सामाजिक एकता का उत्सव।',
      sa: 'सत्यस्य (प्रह्लादभक्तेः) असत्योपरि (हिरण्यकशिपोः अहङ्कारोपरि) विजयः।',
    },
    deity: { en: 'Lord Vishnu (as protector of Prahlad)', hi: 'भगवान विष्णु (प्रह्लाद के रक्षक)', sa: 'विष्णुः (प्रह्लादरक्षकः)' },
  },

  'ram-navami': {
    name: { en: 'Ram Navami', hi: 'रामनवमी', sa: 'रामनवमी' },
    mythology: {
      en: 'Lord Vishnu incarnated as Rama, the prince of Ayodhya, to King Dasharatha and Queen Kausalya on Chaitra Shukla Navami. Born at noon (Madhyahna), Rama is the embodiment of Dharma — the ideal king, son, husband, and warrior. His life story is told in the Ramayana by Sage Valmiki.',
      hi: 'भगवान विष्णु ने चैत्र शुक्ल नवमी को राजा दशरथ और रानी कौशल्या के पुत्र राम के रूप में अयोध्या में अवतार लिया। मध्याह्न में जन्मे राम धर्म के मूर्तिमान रूप हैं।',
      sa: 'विष्णुः चैत्रशुक्लनवम्यां राजदशरथस्य रान्याः कौशल्यायाः च पुत्ररूपेण अवतीर्णः। मध्याह्ने जातः रामः धर्मस्य मूर्तिमान् रूपम्।',
    },
    observance: {
      en: 'Fast until noon, then break fast with fruits or a meal. Read the Ramayana (especially Sundarkand). Perform Rama Puja at home or visit a temple. Chant "Shri Ram Jai Ram Jai Jai Ram". Temples host kirtans and distribute prasad.',
      hi: 'मध्याह्न तक उपवास, फिर फलाहार या भोजन। रामायण पाठ करें (विशेषतः सुन्दरकाण्ड)। राम पूजा करें। "श्री राम जय राम जय जय राम" का जाप करें।',
      sa: 'मध्याह्नपर्यन्तं व्रतम्। रामायणं पठतु। रामपूजां करोतु।',
    },
    significance: {
      en: 'Celebrates the birth of Maryada Purushottam — the ideal man who upheld dharma at every step. Falls in the spring month of Chaitra, marking new beginnings in the Hindu calendar.',
      hi: 'मर्यादा पुरुषोत्तम के जन्म का उत्सव — जिन्होंने प्रत्येक कदम पर धर्म का पालन किया।',
      sa: 'मर्यादापुरुषोत्तमस्य जन्मोत्सवः — यः प्रत्येकं पदे धर्मम् अपालयत्।',
    },
    deity: { en: 'Lord Rama', hi: 'भगवान राम', sa: 'श्रीरामः' },
    isFast: true,
    fastNote: { en: 'Fast until noon (Madhyahna). Break fast with fruits and sattvic food.', hi: 'मध्याह्न तक उपवास। फलाहार और सात्विक भोजन से पारण करें।', sa: 'मध्याह्नपर्यन्तं व्रतम्। फलैः सात्त्विकाहारेण च पारणम्।' },
  },

  'hanuman-jayanti': {
    name: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती', sa: 'हनुमज्जयन्ती' },
    mythology: {
      en: 'Hanuman is the son of Vayu (the Wind God) and Anjana. As a child, he mistook the Sun for a ripe fruit and leapt to swallow it. Indra struck him with his Vajra, but Vayu revived him and all the gods blessed him with powers — making him immortal, invulnerable, and the greatest devotee of Lord Rama.',
      hi: 'हनुमान वायु देव और अंजना के पुत्र हैं। बचपन में उन्होंने सूर्य को पका फल समझकर निगलने का प्रयास किया। इन्द्र ने वज्र से प्रहार किया पर वायु ने उन्हें पुनर्जीवित किया और सभी देवताओं ने उन्हें वरदान दिए।',
      sa: 'हनुमान् वायोः अञ्जनायाः च पुत्रः। बाल्ये सूर्यं पक्वफलं मत्वा ग्रसितुम् अप्रयतत।',
    },
    observance: {
      en: 'Visit Hanuman temples, recite Hanuman Chalisa and Sundarkand. Offer sindoor (vermilion), oil, and flowers. Distribute prasad. Many observe a fast and break it after evening prayers.',
      hi: 'हनुमान मन्दिर जाएँ, हनुमान चालीसा और सुन्दरकाण्ड का पाठ करें। सिन्दूर, तेल और फूल अर्पित करें।',
      sa: 'हनुमन्मन्दिरं गच्छतु। हनुमच्चालीसां सुन्दरकाण्डं च पठतु।',
    },
    significance: {
      en: 'Celebrates the embodiment of devotion (Bhakti), strength (Shakti), and selfless service (Seva). Hanuman represents the ideal devotee — powerful yet humble.',
      hi: 'भक्ति, शक्ति और निःस्वार्थ सेवा के मूर्तिमान रूप का उत्सव। हनुमान आदर्श भक्त हैं — शक्तिशाली किन्तु विनम्र।',
      sa: 'भक्तेः शक्तेः निःस्वार्थसेवायाः च मूर्तिमतः उत्सवः।',
    },
    deity: { en: 'Lord Hanuman', hi: 'हनुमान जी', sa: 'हनुमान्' },
  },

  'guru-purnima': {
    name: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा', sa: 'गुरुपूर्णिमा' },
    mythology: {
      en: 'This day honours Sage Vyasa (Krishna Dvaipayana), who compiled the Vedas, authored the Mahabharata, and organized the Puranas. It is also the day Lord Shiva, as Adi Guru (first teacher), began transmitting yoga to the Saptarishis (seven sages).',
      hi: 'यह दिन व्यास मुनि का सम्मान करता है, जिन्होंने वेदों का संकलन, महाभारत की रचना और पुराणों का संगठन किया। इस दिन शिव ने आदि गुरु के रूप में सप्तर्षियों को योग सिखाना आरम्भ किया।',
      sa: 'एतत् दिनं व्यासमुनिं सम्मानयति यः वेदान् संकलितवान् महाभारतम् अरचयत् पुराणानि च संगठितवान्।',
    },
    observance: {
      en: 'Express gratitude to your teachers and mentors. Perform Guru Puja. Offer flowers, fruits, and dakshina. Recite Guru Stotram. Many spiritual traditions hold special discourses on this day.',
      hi: 'अपने शिक्षकों और गुरुओं के प्रति कृतज्ञता व्यक्त करें। गुरु पूजा करें। फूल, फल और दक्षिणा अर्पित करें।',
      sa: 'आचार्यान् प्रति कृतज्ञतां व्यक्तीकुरुतु। गुरुपूजां करोतु।',
    },
    significance: {
      en: 'The full moon of Ashadha is dedicated to the Guru principle — the remover of darkness (Gu = darkness, Ru = remover). Also called Vyasa Purnima.',
      hi: 'आषाढ़ की पूर्णिमा गुरु तत्व को समर्पित है — अन्धकार का निवारक (गु = अन्धकार, रु = निवारक)।',
      sa: 'आषाढपूर्णिमा गुरुतत्त्वाय समर्पिता — अन्धकारस्य निवारकः (गु = अन्धकारः, रु = निवारकः)।',
    },
    deity: { en: 'Sage Vyasa / The Guru', hi: 'वेदव्यास / गुरु', sa: 'वेदव्यासः / गुरुः' },
  },

  'raksha-bandhan': {
    name: { en: 'Raksha Bandhan', hi: 'रक्षाबन्धन', sa: 'रक्षाबन्धनम्' },
    mythology: {
      en: 'In the Bhagavata Purana, when Lord Vishnu won the three worlds from King Bali, Lakshmi tied a thread on Bali\'s wrist. Moved by this gesture, Bali asked for a wish — and Lakshmi asked for Vishnu\'s return. In another tradition, Draupadi tore a strip of her sari to bandage Krishna\'s wounded wrist, and he pledged to protect her.',
      hi: 'भागवत पुराण में, जब विष्णु ने राजा बलि से तीनों लोक जीते, लक्ष्मी ने बलि की कलाई पर धागा बाँधा। द्रौपदी ने कृष्ण के घायल कलाई पर अपनी साड़ी का टुकड़ा बाँधा, और कृष्ण ने उनकी रक्षा का वचन दिया।',
      sa: 'भागवतपुराणे विष्णुः राज्ञः बलेः त्रीन् लोकान् अजयत्। लक्ष्मीः बलेः कलायां सूत्रम् अबध्नात्।',
    },
    observance: {
      en: 'Sisters tie a decorative thread (Rakhi) on brothers\' wrists, apply tilak, offer sweets, and pray for their well-being. Brothers give gifts and pledge to protect their sisters. Today the festival extends beyond blood relations to all bonds of protection.',
      hi: 'बहनें भाइयों की कलाई पर राखी बाँधती हैं, तिलक लगाती हैं, मिठाई खिलाती हैं। भाई उपहार देते हैं और रक्षा का वचन देते हैं।',
      sa: 'भगिन्यः भ्रातृणां कलायां राखीं बध्नन्ति, तिलकं लगयन्ति, मिष्टान्नं यच्छन्ति।',
    },
    significance: {
      en: 'Celebrates the sacred bond between siblings and the duty of protection. The Rakhi thread symbolizes love, trust, and the sister\'s prayer for her brother\'s long life.',
      hi: 'भाई-बहन के पवित्र बन्धन और रक्षा के कर्तव्य का उत्सव।',
      sa: 'भ्रातृभगिन्योः पवित्रबन्धनस्य रक्षाकर्तव्यस्य च उत्सवः।',
    },
    deity: { en: 'Lakshmi / Krishna', hi: 'लक्ष्मी / कृष्ण', sa: 'लक्ष्मीः / कृष्णः' },
  },

  'janmashtami': {
    name: { en: 'Janmashtami', hi: 'जन्माष्टमी', sa: 'जन्माष्टमी' },
    mythology: {
      en: 'Lord Krishna was born at midnight in a prison cell in Mathura to Devaki and Vasudeva. The tyrant king Kamsa had imprisoned them after a prophecy that Devaki\'s eighth child would kill him. At Krishna\'s birth, all guards fell asleep, chains broke, and Vasudeva carried the divine baby across the flooding Yamuna river to safety in Gokul.',
      hi: 'भगवान कृष्ण का जन्म मथुरा की कारागार में मध्यरात्रि को देवकी और वसुदेव के घर हुआ। अत्याचारी कंस ने भविष्यवाणी के बाद उन्हें कैद किया था। कृष्ण के जन्म पर सभी पहरेदार सो गए, बेड़ियाँ टूट गईं।',
      sa: 'कृष्णः मथुरायां कारागारे मध्यरात्रौ देवक्याः वसुदेवस्य च गृहे जातः।',
    },
    observance: {
      en: 'Fast all day until midnight (when Krishna was born). Perform puja at midnight with songs and bhajans. Prepare 56 dishes (Chhappan Bhog) as offering. Swing a cradle with baby Krishna\'s idol. Break fast after midnight puja with prasad.',
      hi: 'मध्यरात्रि तक उपवास (कृष्ण का जन्म समय)। मध्यरात्रि में भजन-कीर्तन के साथ पूजा। 56 भोग तैयार करें। बाल कृष्ण की मूर्ति को झूला झुलाएँ।',
      sa: 'मध्यरात्रिपर्यन्तं व्रतम्। मध्यरात्रौ भजनकीर्तनैः सह पूजा। छप्पनभोगं सज्जयतु।',
    },
    significance: {
      en: 'Birth of the Supreme Being who spoke the Bhagavad Gita. Krishna embodies divine love (Prema), cosmic wisdom (Jnana), and righteous action (Karma Yoga). The midnight birth symbolizes light emerging in the darkest hour.',
      hi: 'भगवद्गीता के वक्ता परमात्मा का जन्म। कृष्ण दिव्य प्रेम, ब्रह्माण्डीय ज्ञान और कर्मयोग के प्रतीक हैं।',
      sa: 'भगवद्गीतावक्तुः परमात्मनः जन्म। कृष्णः दिव्यप्रेमस्य ज्ञानस्य कर्मयोगस्य च प्रतीकः।',
    },
    deity: { en: 'Lord Krishna', hi: 'भगवान कृष्ण', sa: 'श्रीकृष्णः' },
    isFast: true,
    fastNote: { en: 'Strict fast until midnight. Break with prasad after midnight puja and Abhishek.', hi: 'मध्यरात्रि तक कठोर व्रत। मध्यरात्रि पूजा के बाद प्रसाद से पारण।', sa: 'मध्यरात्रिपर्यन्तं कठोरव्रतम्। अभिषेकानन्तरं प्रसादेन पारणम्।' },
  },

  'ganesh-chaturthi': {
    name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', sa: 'गणेशचतुर्थी' },
    mythology: {
      en: 'Goddess Parvati created Ganesha from sandalwood paste and breathed life into him, setting him as guard while she bathed. When Shiva returned, Ganesha blocked his entry. Shiva, not knowing who the boy was, beheaded him in anger. To console Parvati, Shiva replaced his head with that of an elephant and declared him the leader (Ganapati) of his ganas.',
      hi: 'देवी पार्वती ने चन्दन के लेप से गणेश की रचना की और उनमें प्राण फूँके। जब शिव लौटे, गणेश ने उन्हें रोका। शिव ने क्रोध में उनका सिर काट दिया। पार्वती को शान्त करने के लिए शिव ने हाथी का सिर लगाया।',
      sa: 'पार्वतीदेवी चन्दनलेपात् गणेशम् अरचयत्। शिवः क्रोधेन तस्य शिरः अच्छिनत्। गजशिरः स्थापितवान्।',
    },
    observance: {
      en: 'Install a Ganesha idol (clay/eco-friendly) at home. Perform daily puja for 1.5 / 3 / 5 / 7 / 10 days. Offer modak (sweet dumplings), durva grass, and red flowers. Conclude with Visarjan (immersion) in a water body with processions.',
      hi: 'घर में गणेश प्रतिमा (मिट्टी) स्थापित करें। 1.5 / 3 / 5 / 7 / 10 दिन पूजा करें। मोदक, दूर्वा और लाल फूल चढ़ाएँ। जुलूस के साथ विसर्जन करें।',
      sa: 'गृहे गणेशप्रतिमां स्थापयतु। मोदकं दूर्वां रक्तपुष्पाणि च अर्पयतु। विसर्जनं करोतु।',
    },
    significance: {
      en: 'Lord of new beginnings, remover of obstacles (Vighnaharta). Worshipped before all undertakings. The festival celebrates wisdom, prosperity, and the power of devotion.',
      hi: 'नई शुरुआत के देवता, विघ्नहर्ता। सभी कार्यों से पहले पूजित। ज्ञान, समृद्धि और भक्ति की शक्ति का उत्सव।',
      sa: 'नवारम्भस्य देवः, विघ्नहर्ता। सर्वकार्याणां पूर्वं पूजितः।',
    },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'गणेशः' },
  },

  'navaratri': {
    name: { en: 'Navaratri (Sharad)', hi: 'शारदीय नवरात्रि', sa: 'शारदीयनवरात्रिः' },
    mythology: {
      en: 'The demon Mahishasura, after a boon from Brahma that no man or god could kill him, conquered the three worlds. The combined energy of all gods manifested as Goddess Durga. She battled Mahishasura for nine nights and slew him on the tenth day (Vijayadashami). Each night is dedicated to a different form of the Goddess (Navadurga).',
      hi: 'महिषासुर ने ब्रह्मा से वरदान पाकर तीनों लोकों पर विजय प्राप्त की। सभी देवताओं की संयुक्त ऊर्जा से देवी दुर्गा प्रकट हुईं। उन्होंने नौ रातों तक महिषासुर से युद्ध किया और दसवें दिन उसका वध किया।',
      sa: 'महिषासुरः ब्रह्मणः वरदानं प्राप्य त्रीन् लोकान् अजयत्। सर्वदेवानां संयुक्तशक्तिः दुर्गादेवीरूपेण प्राकट्यत।',
    },
    observance: {
      en: 'Nine nights of Goddess worship with specific forms each day: Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kaalratri, Mahagauri, Siddhidatri. Fasting, Garba/Dandiya dancing (Gujarat), recitation of Durga Saptashati. Many observe strict fasting for all 9 days.',
      hi: 'नौ रातों में देवी के नौ रूपों की पूजा। उपवास, गरबा/डाण्डिया (गुजरात), दुर्गा सप्तशती का पाठ। कई लोग पूरे 9 दिन कठोर व्रत रखते हैं।',
      sa: 'नवरात्रिषु देव्याः नवरूपाणां पूजनम्। व्रतम्, दुर्गासप्तशतीपाठः।',
    },
    significance: {
      en: 'Victory of divine feminine power (Shakti) over evil. Each of the nine forms represents a different aspect of feminine energy — from ferocity to compassion.',
      hi: 'दैवी स्त्री शक्ति (शक्ति) की बुराई पर विजय। नौ रूपों में से प्रत्येक स्त्री ऊर्जा के एक भिन्न पहलू का प्रतिनिधित्व करता है।',
      sa: 'दैवीशक्तेः दुष्टतोपरि विजयः। नवरूपाणि स्त्रीशक्तेः विभिन्नपक्षान् प्रतिनिधयन्ति।',
    },
    deity: { en: 'Goddess Durga (Navadurga)', hi: 'देवी दुर्गा (नवदुर्गा)', sa: 'दुर्गादेवी (नवदुर्गा)' },
    isFast: true,
    fastNote: { en: 'Many observe a 9-day fast (fruits, sabudana, kuttu atta). Some fast only on the first and last day.', hi: 'कई लोग 9 दिन व्रत रखते हैं (फल, साबूदाना, कुट्टू)। कुछ केवल पहले और अन्तिम दिन।', sa: 'बहवः 9 दिनानि व्रतं धारयन्ति।' },
  },

  'dussehra': {
    name: { en: 'Dussehra', hi: 'दशहरा', sa: 'विजयादशमी' },
    mythology: {
      en: 'Lord Rama vanquished the ten-headed Ravana on this day after a fierce battle, rescuing Sita from Lanka. In another tradition, Goddess Durga slayed the buffalo demon Mahishasura on this tenth day (Vijayadashami). Both stories celebrate the triumph of righteousness.',
      hi: 'भगवान राम ने इस दिन भयंकर युद्ध के बाद दशानन रावण का वध किया और सीता को लंका से मुक्त कराया। एक अन्य परम्परा में, देवी दुर्गा ने इसी दसवें दिन महिषासुर का वध किया।',
      sa: 'श्रीरामः अस्मिन् दिने दशाननं रावणं जघान सीतां च अमोचयत्।',
    },
    observance: {
      en: 'Burn effigies of Ravana, Meghanada, and Kumbhakarna. Perform Shastra Puja (worship of weapons/tools). Exchange Apta leaves (symbolizing gold). In Bengal, it marks Durga Visarjan. Ram Lila performances conclude on this day.',
      hi: 'रावण, मेघनाद और कुम्भकर्ण के पुतले जलाएँ। शस्त्र पूजा करें। आपटा पत्ते (सोने का प्रतीक) बाँटें। बंगाल में दुर्गा विसर्जन होता है।',
      sa: 'रावणमेघनादकुम्भकर्णपुत्तलिकाः दहतु। शस्त्रपूजां करोतु।',
    },
    significance: {
      en: 'Vijayadashami — the "tenth day of victory". Considered the most auspicious day to begin new ventures, buy property, or start learning. The burning of Ravana symbolizes the destruction of the ten vices (ego, greed, lust, etc.).',
      hi: 'विजयादशमी — "विजय का दसवाँ दिन"। नए कार्य आरम्भ करने का सर्वाधिक शुभ दिन। रावण दहन दस दुर्गुणों के नाश का प्रतीक है।',
      sa: 'विजयादशमी — "विजयस्य दशमं दिनम्"। नवकार्याणि आरम्भितुं शुभतमं दिनम्।',
    },
    deity: { en: 'Lord Rama / Goddess Durga', hi: 'भगवान राम / देवी दुर्गा', sa: 'श्रीरामः / दुर्गादेवी' },
  },

  'diwali': {
    name: { en: 'Diwali', hi: 'दीपावली', sa: 'दीपावलिः' },
    mythology: {
      en: 'Lord Rama returned to Ayodhya after 14 years of exile and his victory over Ravana. The citizens lit thousands of oil lamps (diyas) to welcome him, illuminating the moonless night of Kartika Amavasya. In another tradition, Lakshmi emerged from the Samudra Manthan (ocean churning) on this night and is worshipped for wealth and prosperity.',
      hi: 'भगवान राम 14 वर्ष के वनवास और रावण पर विजय के बाद अयोध्या लौटे। नागरिकों ने हज़ारों दीप जलाकर उनका स्वागत किया। एक अन्य परम्परा में, लक्ष्मी समुद्र मन्थन से इसी रात्रि प्रकट हुईं।',
      sa: 'श्रीरामः 14 वर्षाणां वनवासात् रावणविजयानन्तरं अयोध्यां प्रत्यागतः। नागरिकाः सहस्रशः दीपान् प्रज्वाल्य तम् अस्वागन्।',
    },
    observance: {
      en: 'Five-day celebration: Dhanteras (buy gold/utensils), Naraka Chaturdashi (pre-dawn oil bath), Diwali (Lakshmi Puja at night, light diyas, burst crackers), Govardhan Puja (worship food mountains), Bhai Dooj (sister-brother bond). Clean and decorate homes, make rangoli, wear new clothes.',
      hi: 'पाँच दिनों का उत्सव: धनतेरस, नरक चतुर्दशी, दीपावली (लक्ष्मी पूजा, दीप जलाएँ), गोवर्धन पूजा, भाई दूज। घर की सफाई, रंगोली, नए वस्त्र।',
      sa: 'पञ्चदिनानाम् उत्सवः: धनत्रयोदशी, नरकचतुर्दशी, दीपावलिः, गोवर्धनपूजा, भ्रातृद्वितीया।',
    },
    significance: {
      en: 'The festival of lights — the triumph of light over darkness, knowledge over ignorance, good over evil. The darkest night (Amavasya) is illuminated, symbolizing hope and renewal. Also marks the Hindu new year in many traditions.',
      hi: 'प्रकाश का त्योहार — अन्धकार पर प्रकाश, अज्ञान पर ज्ञान, बुराई पर अच्छाई की विजय। सबसे अन्धेरी रात (अमावस्या) को प्रकाशित किया जाता है।',
      sa: 'दीपानाम् उत्सवः — अन्धकारोपरि प्रकाशस्य, अज्ञानोपरि ज्ञानस्य, असत्योपरि सत्यस्य विजयः।',
    },
    deity: { en: 'Goddess Lakshmi, Lord Rama, Lord Ganesha', hi: 'देवी लक्ष्मी, भगवान राम, भगवान गणेश', sa: 'लक्ष्मीः, श्रीरामः, गणेशः' },
  },
};

/* ═══════════════════════════════════════════
   NAMED EKADASHIS — 24 per year
   ═══════════════════════════════════════════ */

export interface EkadashiDetail {
  name: Trilingual;
  story: Trilingual;
  benefit: Trilingual;
}

// Keyed by Hindu month name + paksha
export const EKADASHI_NAMES: Record<string, { shukla: EkadashiDetail; krishna: EkadashiDetail }> = {
  chaitra: {
    shukla: {
      name: { en: 'Kamada Ekadashi', hi: 'कामदा एकादशी', sa: 'कामदैकादशी' },
      story: { en: 'A Gandharva named Lalit was cursed to become a demon. His wife Lalita observed this Ekadashi and the merit freed him from the curse. Lord Krishna told Yudhishthira that this Ekadashi fulfils all desires (Kama = desire, Da = giver).', hi: 'ललित नामक गन्धर्व को राक्षस बनने का शाप मिला। उसकी पत्नी ललिता ने यह एकादशी रखी और पुण्य से शाप मुक्ति हुई। कामदा = इच्छा पूर्ण करने वाली।', sa: 'ललितो नाम गन्धर्वः राक्षसत्वशापं प्राप्तवान्। तस्य पत्नी ललिता एताम् एकादशीम् अवर्तयत्।' },
      benefit: { en: 'Fulfils all desires, removes sins equivalent to killing a Brahmana, grants liberation', hi: 'सभी इच्छाएँ पूर्ण करती है, ब्रह्महत्या तुल्य पापों को नष्ट करती है', sa: 'सर्वान् कामान् पूरयति, ब्रह्महत्यासमपापानि नाशयति' },
    },
    krishna: {
      name: { en: 'Papamochani Ekadashi', hi: 'पापमोचनी एकादशी', sa: 'पापमोचनीएकादशी' },
      story: { en: 'The sage Medhavi was seduced by the apsara Manjughosha, losing years of penance. Both were cursed. By observing this Ekadashi, they were freed from all sins. Papa = sin, Mochani = liberator.', hi: 'ऋषि मेधावी अप्सरा मञ्जुघोषा द्वारा मोहित हुए और वर्षों की तपस्या खो दी। इस एकादशी से दोनों पापमुक्त हुए।', sa: 'मेधावीऋषिः अप्सरया मोहितः। एतया एकादश्या तौ पापमुक्तौ अभवताम्।' },
      benefit: { en: 'Destroys all sins, removes effects of broken vows and curses', hi: 'सभी पापों का नाश, टूटे व्रतों और शापों के प्रभाव को हटाती है', sa: 'सर्वपापनाशनम्, भग्नव्रतशापप्रभावनिवारणम्' },
    },
  },
  vaishakha: {
    shukla: {
      name: { en: 'Mohini Ekadashi', hi: 'मोहिनी एकादशी', sa: 'मोहिनीएकादशी' },
      story: { en: 'Named after Lord Vishnu\'s Mohini avatar, who enchanted the demons during the distribution of Amrit. A merchant named Dhanapala\'s wicked son Dhrishtabuddhi was saved from hell by the merit of this Ekadashi fast observed by his father.', hi: 'विष्णु के मोहिनी अवतार के नाम पर, जिन्होंने अमृत वितरण में दानवों को मोहित किया। धनपाल नामक व्यापारी के दुष्ट पुत्र को इस एकादशी के पुण्य से नरक से मुक्ति मिली।', sa: 'विष्णोः मोहिन्यवतारस्य नाम्ना। धनपालस्य दुष्टपुत्रः एतस्याः एकादश्याः पुण्येन नरकात् मुक्तः।' },
      benefit: { en: 'Destroys illusion (Moha), grants clarity and spiritual progress', hi: 'मोह का नाश, स्पष्टता और आध्यात्मिक प्रगति', sa: 'मोहनाशनम्, आध्यात्मिकप्रगतिः' },
    },
    krishna: {
      name: { en: 'Varuthini Ekadashi', hi: 'वरुथिनी एकादशी', sa: 'वरुथिनीएकादशी' },
      story: { en: 'King Mandhata asked about this Ekadashi from the sage Dhaumya. Its merit equals donating thousands of cows, performing Ashwamedha Yagna, and donating gold equivalent to Mount Meru.', hi: 'राजा मान्धाता ने ऋषि धौम्य से इस एकादशी के बारे में पूछा। इसका पुण्य हज़ारों गायों के दान, अश्वमेध यज्ञ और मेरु पर्वत के बराबर सोने के दान के समान है।', sa: 'मान्धाताराजा धौम्यऋषिं पृष्टवान्।' },
      benefit: { en: 'Removes fear of Yamaraja (death), grants protection and merit', hi: 'यमराज का भय दूर करती है, रक्षा और पुण्य प्रदान करती है', sa: 'यमराजभयनिवारणम्, रक्षापुण्यप्रदानम्' },
    },
  },
  jyeshtha: {
    shukla: {
      name: { en: 'Nirjala Ekadashi', hi: 'निर्जला एकादशी', sa: 'निर्जलैकादशी' },
      story: { en: 'Bhima (Bhimsena of the Pandavas), unable to fast on all 24 Ekadashis due to his great hunger, asked Sage Vyasa for an alternative. Vyasa told him that fasting without even water (Nirjala) on this single Ekadashi equals the merit of all 24 combined. Also called Pandava Ekadashi or Bhimseni Ekadashi.', hi: 'भीम अपनी भारी भूख के कारण सभी 24 एकादशियों पर व्रत नहीं रख सकते थे। व्यास मुनि ने कहा कि केवल इस एक एकादशी पर बिना जल के (निर्जला) व्रत रखना सभी 24 के पुण्य के बराबर है।', sa: 'भीमः महाक्षुधायाः कारणात् सर्वासु एकादशीषु व्रतं धारयितुं न अशक्नोत्। व्यासः अवदत् एतस्याम् एकस्याम् निर्जलव्रतं सर्वासां पुण्यसमम्।' },
      benefit: { en: 'Equal to observing all 24 Ekadashis. Most powerful Ekadashi of the year. Grants Vaikuntha (Vishnu\'s abode).', hi: 'सभी 24 एकादशियों के बराबर। वर्ष की सबसे शक्तिशाली एकादशी। वैकुण्ठ प्रदान करती है।', sa: 'सर्वासां 24 एकादशीनां समम्। वर्षस्य शक्तिमत्तमा एकादशी।' },
    },
    krishna: {
      name: { en: 'Apara Ekadashi', hi: 'अपरा एकादशी', sa: 'अपरैकादशी' },
      story: { en: 'Lord Krishna told Yudhishthira that this Ekadashi has boundless (Apara = limitless) merit. It destroys sins of warriors, protects reputation, and even redeems ghosts from their cursed state.', hi: 'कृष्ण ने युधिष्ठिर को बताया कि इस एकादशी का अपरिमित (अपरा) पुण्य है।', sa: 'कृष्णः युधिष्ठिरम् अवदत् एतस्याः एकादश्याः अपरिमितं पुण्यम् इति।' },
      benefit: { en: 'Limitless merit, removes infamy, redeems suffering souls', hi: 'अपरिमित पुण्य, अपयश दूर करती है', sa: 'अपरिमितपुण्यम्, अपयशनिवारणम्' },
    },
  },
  ashadha: {
    shukla: {
      name: { en: 'Devshayani Ekadashi', hi: 'देवशयनी एकादशी', sa: 'देवशयनीएकादशी' },
      story: { en: 'Lord Vishnu goes to sleep (Yoga Nidra) on the cosmic serpent Shesha on this day, beginning Chaturmas — the four sacred months of the monsoon. He awakens on Prabodhini Ekadashi in Kartika. During this period, auspicious ceremonies like marriages are avoided.', hi: 'इस दिन विष्णु शेषनाग पर योगनिद्रा में जाते हैं, चातुर्मास आरम्भ होता है। कार्तिक में प्रबोधिनी एकादशी पर जागते हैं। इस काल में विवाह जैसे शुभ कार्य नहीं होते।', sa: 'अस्मिन् दिने विष्णुः शेषनागोपरि योगनिद्रां प्रविशति। चातुर्मासः आरभ्यते।' },
      benefit: { en: 'Marks the start of Chaturmas. Extremely auspicious for spiritual practices and charity.', hi: 'चातुर्मास का आरम्भ। आध्यात्मिक साधना और दान के लिए अत्यन्त शुभ।', sa: 'चातुर्मासस्य आरम्भः। आध्यात्मिकसाधनादानयोः अत्यन्तशुभम्।' },
    },
    krishna: {
      name: { en: 'Yogini Ekadashi', hi: 'योगिनी एकादशी', sa: 'योगिनीएकादशी' },
      story: { en: 'A gardener named Hemamali in Kubera\'s garden neglected his duties due to his wife. He was cursed with leprosy. By observing this Ekadashi, he was cured and restored to his celestial position.', hi: 'कुबेर के उद्यान में हेमामाली नामक माली ने अपनी पत्नी के कारण कर्तव्य की अवहेलना की और कोढ़ का शाप मिला। इस एकादशी से ठीक हुआ।', sa: 'कुबेरस्य उद्याने हेमामाली उद्यानपालः कुष्ठशापं प्राप्तवान्।' },
      benefit: { en: 'Cures diseases, removes curses, more meritorious than charity at holy places', hi: 'रोगों से मुक्ति, शापों को हटाती है, तीर्थस्थलों पर दान से अधिक पुण्यदायी', sa: 'रोगमुक्तिः, शापनिवारणम्' },
    },
  },
  shravana: {
    shukla: { name: { en: 'Putrada Ekadashi', hi: 'पुत्रदा एकादशी', sa: 'पुत्रदैकादशी' }, story: { en: 'King Mahijita had no heir. Sage Lomasa advised observing this Ekadashi for a son. The king and queen fasted, and were blessed with a prince. Putrada = giver of sons.', hi: 'राजा महिजित के कोई सन्तान नहीं थी। ऋषि लोमश ने इस एकादशी का व्रत बताया। राजा-रानी ने व्रत रखा और पुत्र प्राप्त हुआ।', sa: 'महिजितराजा सन्तानहीनः आसीत्। लोमशऋषिः एताम् एकादशीम् अवदत्।' }, benefit: { en: 'Blesses with progeny, especially a son. Fulfils parental wishes.', hi: 'सन्तान, विशेषतः पुत्र का आशीर्वाद। माता-पिता की इच्छा पूर्ण करती है।', sa: 'सन्तानवरदानम्, पुत्रवरदानम्।' } },
    krishna: { name: { en: 'Kamika Ekadashi', hi: 'कामिका एकादशी', sa: 'कामिकैकादशी' }, story: { en: 'Lord Brahma narrated this Ekadashi\'s glory to Narada. Offering Tulsi leaves to Vishnu on this day equals donating ten million cows. Even the shadow of a Tulsi plant removes sins.', hi: 'ब्रह्मा ने नारद को इस एकादशी का महत्व बताया। इस दिन विष्णु को तुलसी पत्र अर्पण करना एक करोड़ गायों के दान के बराबर है।', sa: 'ब्रह्मा नारदाय एतस्याः एकादश्याः माहात्म्यम् अकथयत्।' }, benefit: { en: 'Offering Tulsi on this day multiplies merit infinitely. Removes fear of death.', hi: 'इस दिन तुलसी अर्पण करने से पुण्य अनन्तगुना बढ़ता है। मृत्यु का भय दूर होता है।', sa: 'तुलस्यर्पणेन पुण्यम् अनन्तगुणं वर्धते।' } },
  },
  bhadrapada: {
    shukla: { name: { en: 'Parivartini Ekadashi', hi: 'परिवर्तिनी एकादशी', sa: 'परिवर्तिनीएकादशी' }, story: { en: 'Lord Vishnu turns on his side (Parivartini = turning) in his cosmic sleep. King Bali, in Patala, worships Vishnu on this day. Also called Parsva Ekadashi.', hi: 'विष्णु अपनी ब्रह्माण्डीय निद्रा में करवट बदलते हैं (परिवर्तिनी)। पाताल में राजा बलि इस दिन विष्णु की पूजा करते हैं।', sa: 'विष्णुः निद्रायां पार्श्वं परिवर्तयति।' }, benefit: { en: 'Grants the merit of Chaturmas vows. Lord Vishnu is especially gracious this day.', hi: 'चातुर्मास व्रतों का पुण्य प्राप्त होता है।', sa: 'चातुर्मासव्रतानां पुण्यं लभ्यते।' } },
    krishna: { name: { en: 'Aja Ekadashi', hi: 'अजा एकादशी', sa: 'अजैकादशी' }, story: { en: 'King Harishchandra, who lost his kingdom, wife, and son due to his truthfulness, was advised to observe this Ekadashi by Sage Gautama. All his sufferings ended and his kingdom was restored.', hi: 'राजा हरिश्चन्द्र ने सत्यवादिता से अपना राज्य, पत्नी और पुत्र खोया। ऋषि गौतम ने इस एकादशी का व्रत बताया। सभी कष्ट समाप्त हुए।', sa: 'हरिश्चन्द्रराजा सत्यवादित्वात् सर्वं नष्टवान्।' }, benefit: { en: 'Destroys accumulated suffering, restores lost fortune and honour', hi: 'संचित कष्टों का नाश, खोया सम्मान और भाग्य वापस', sa: 'सञ्चितदुःखनाशनम्, नष्टसम्मानभाग्यप्रत्यावर्तनम्' } },
  },
  ashwina: {
    shukla: { name: { en: 'Papankusha Ekadashi', hi: 'पापांकुशा एकादशी', sa: 'पापाङ्कुशैकादशी' }, story: { en: 'Its merit acts as an Ankusha (goad/hook) to control the elephant of Papa (sin). Lord Krishna told Yudhishthira that this Ekadashi is supremely powerful during the auspicious month of Ashwina.', hi: 'इसका पुण्य पाप रूपी हाथी को नियन्त्रित करने वाले अंकुश का काम करता है।', sa: 'एतस्याः पुण्यं पापगजस्य अङ्कुशरूपेण कार्यं करोति।' }, benefit: { en: 'Controls and destroys sins. Grants Vaikuntha after death.', hi: 'पापों को नियन्त्रित और नष्ट करती है। मृत्यु के बाद वैकुण्ठ प्रदान करती है।', sa: 'पापनियन्त्रणं नाशनं च। मृत्यूपरान्तं वैकुण्ठप्रदानम्।' } },
    krishna: { name: { en: 'Indira Ekadashi', hi: 'इन्दिरा एकादशी', sa: 'इन्दिरैकादशी' }, story: { en: 'King Indrasena\'s deceased father appeared in his dream suffering in Yamaloka. Sage Narada advised the king to observe this Ekadashi to liberate his father\'s soul.', hi: 'राजा इन्द्रसेन के दिवंगत पिता उनके स्वप्न में यमलोक में कष्ट भोगते दिखे। नारद ने इस एकादशी का व्रत बताया।', sa: 'इन्द्रसेनराज्ञः दिवङ्गतपिता स्वप्ने यमलोके कष्टं भोक्तुं दृष्टः।' }, benefit: { en: 'Liberates ancestors from suffering. Grants peace to departed souls (Pitru Mukti).', hi: 'पूर्वजों को कष्ट से मुक्ति। दिवंगत आत्माओं को शान्ति (पितृ मुक्ति)।', sa: 'पितॄन् कष्टात् मोचयति। दिवंगतात्मभ्यः शान्तिः।' } },
  },
  kartika: {
    shukla: { name: { en: 'Prabodhini Ekadashi', hi: 'प्रबोधिनी एकादशी', sa: 'प्रबोधिनीएकादशी' }, story: { en: 'Lord Vishnu awakens (Prabodhini = awakening) from his four-month cosmic sleep. This ends Chaturmas, and the auspicious season for marriages and ceremonies resumes. Also called Devutthani or Dev Prabodhini Ekadashi.', hi: 'विष्णु चार मास की ब्रह्माण्डीय निद्रा से जागते हैं (प्रबोधिनी = जागरण)। चातुर्मास समाप्त होता है, विवाह आदि शुभ कार्य पुनः आरम्भ होते हैं।', sa: 'विष्णुः चातुर्मासनिद्रातः जागर्ति। शुभकार्याणि पुनः आरभ्यन्ते।' }, benefit: { en: 'Marks the end of Chaturmas. Opening of the marriage season. Extremely auspicious.', hi: 'चातुर्मास का अन्त। विवाह ऋतु का आरम्भ। अत्यन्त शुभ।', sa: 'चातुर्मासान्तः। विवाहर्तोः आरम्भः।' } },
    krishna: { name: { en: 'Rama Ekadashi', hi: 'रमा एकादशी', sa: 'रमैकादशी' }, story: { en: 'Named after Rama (another name for Goddess Lakshmi). A pious king named Muchukunda was advised by the sage Valmiki to observe this fast, which grants more merit than bathing at all pilgrimage sites.', hi: 'रमा (लक्ष्मी का एक नाम) के नाम पर। राजा मुचुकुन्द को ऋषि वाल्मीकि ने यह व्रत बताया।', sa: 'रमायाः (लक्ष्म्याः) नाम्ना। मुचुकुन्दराजा वाल्मीकिमुनेः उपदेशं प्राप्तवान्।' }, benefit: { en: 'Grants Lakshmi\'s blessings, removes poverty. More meritorious than all pilgrimages.', hi: 'लक्ष्मी का आशीर्वाद, दरिद्रता दूर करती है। सभी तीर्थयात्राओं से अधिक पुण्यदायी।', sa: 'लक्ष्म्याः आशीर्वादम्, दारिद्र्यनिवारणम्।' } },
  },
  margashirsha: {
    shukla: { name: { en: 'Mokshada Ekadashi', hi: 'मोक्षदा एकादशी', sa: 'मोक्षदैकादशी' }, story: { en: 'On this very day, Lord Krishna spoke the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra. Also called Gita Jayanti. The Ekadashi grants Moksha (liberation) — hence the name.', hi: 'इसी दिन कृष्ण ने कुरुक्षेत्र के युद्धभूमि पर अर्जुन को भगवद्गीता सुनाई। गीता जयन्ती भी कहलाती है। मोक्ष प्रदान करने वाली — इसलिए मोक्षदा।', sa: 'अस्मिन् दिने कृष्णः कुरुक्षेत्रे अर्जुनाय भगवद्गीताम् अश्रावयत्। गीताजयन्ती अपि कथ्यते।' }, benefit: { en: 'Grants Moksha (liberation from rebirth). Also celebrates Gita Jayanti. Reading Bhagavad Gita on this day is supremely meritorious.', hi: 'मोक्ष (पुनर्जन्म से मुक्ति) प्रदान करती है। इस दिन गीता पाठ सर्वोत्तम पुण्यदायी है।', sa: 'मोक्षं ददाति। गीतापाठः सर्वोत्तमपुण्यदायकः।' } },
    krishna: { name: { en: 'Utpanna Ekadashi', hi: 'उत्पन्ना एकादशी', sa: 'उत्पन्नैकादशी' }, story: { en: 'When the demon Mura attacked Vishnu, a divine female form emerged from Vishnu\'s body and slew the demon. She was named "Ekadashi" as she appeared on the 11th day. This is the origin story of all Ekadashi fasts.', hi: 'जब दैत्य मुर ने विष्णु पर आक्रमण किया, विष्णु के शरीर से एक दिव्य स्त्री रूप प्रकट हुआ और दैत्य का वध किया। 11वें दिन प्रकट होने से "एकादशी" नाम पड़ा।', sa: 'यदा मुरदैत्यः विष्णुम् आक्रामत्, विष्णोः शरीरात् दिव्यं स्त्रीरूपम् उत्पन्नम्।' }, benefit: { en: 'The "mother" of all Ekadashis. Observing this one is the foundation of all Ekadashi observances.', hi: 'सभी एकादशियों की "माता"। इसका पालन सभी एकादशी व्रतों का आधार है।', sa: 'सर्वासाम् एकादशीनां "माता"।' } },
  },
  pausha: {
    shukla: { name: { en: 'Putrada Ekadashi', hi: 'पुत्रदा एकादशी', sa: 'पुत्रदैकादशी' }, story: { en: 'Similar to Shravana Putrada but falls in Pausha. King Suketumana had no heir and observed this Ekadashi as advised by sages. He was blessed with a virtuous son.', hi: 'श्रावण पुत्रदा के समान किन्तु पौष में। राजा सुकेतुमान ने ऋषियों की सलाह पर इस एकादशी का व्रत रखा और पुत्ररत्न प्राप्त हुआ।', sa: 'श्रावणपुत्रदासमाना किन्तु पौषमासे। सुकेतुमानराजा ऋषीणाम् उपदेशेन एताम् एकादशीम् अवर्तयत्।' }, benefit: { en: 'Grants progeny, especially a virtuous son. Removes obstacles to parenthood.', hi: 'सन्तान, विशेषतः सुयोग्य पुत्र प्रदान करती है।', sa: 'सन्तानं, सद्गुणपुत्रं च ददाति।' } },
    krishna: { name: { en: 'Safala Ekadashi', hi: 'सफला एकादशी', sa: 'सफलैकादशी' }, story: { en: 'A wicked prince named Lumpaka lived an immoral life. One day, by circumstance, he stayed awake all night in a Vishnu temple on Ekadashi without food. This unintentional observance purified him completely.', hi: 'लुम्पक नामक दुष्ट राजकुमार ने अनैतिक जीवन जिया। एक दिन संयोग से एकादशी पर विष्णु मन्दिर में बिना भोजन रात भर जागा। इस अनजाने व्रत ने उसे शुद्ध कर दिया।', sa: 'लुम्पकनामा दुष्टराजकुमारः। संयोगात् एकादश्यां विष्णुमन्दिरे निराहारः सर्वां रात्रिम् अजागर्त।' }, benefit: { en: 'Grants success (Safala = fruitful) in all endeavours. Even accidental observance gives merit.', hi: 'सभी प्रयासों में सफलता (सफला) प्रदान करती है।', sa: 'सर्वप्रयासेषु सफलतां ददाति।' } },
  },
  magha: {
    shukla: { name: { en: 'Jaya Ekadashi', hi: 'जया एकादशी', sa: 'जयैकादशी' }, story: { en: 'Two celestial attendants of Lord Indra — Malyavan and Pushpavati — were cursed by Indra for embracing in his court. They became ghosts (Pishacha). By the merit of Jaya Ekadashi, they were freed from the curse.', hi: 'इन्द्र के दो सेवक — माल्यवान और पुष्पवती — इन्द्र के दरबार में आलिंगन के लिए शापित हुए और पिशाच बने। जया एकादशी के पुण्य से शाप मुक्त हुए।', sa: 'इन्द्रस्य सेवकौ — माल्यवान् पुष्पवती च — शापात् पिशाचौ अभवताम्।' }, benefit: { en: 'Grants victory (Jaya) over enemies and obstacles. Frees souls from ghostly existence.', hi: 'शत्रुओं और बाधाओं पर विजय (जया) प्रदान करती है।', sa: 'शत्रुबाधोपरि विजयं (जयाम्) ददाति।' } },
    krishna: { name: { en: 'Shattila Ekadashi', hi: 'षटतिला एकादशी', sa: 'षट्तिलैकादशी' }, story: { en: 'Named for the six (Shat) uses of sesame (Tila) on this day: bathing with sesame, applying sesame paste, offering homa with sesame, offering water with sesame, eating sesame, and donating sesame.', hi: 'इस दिन तिल (तिला) के छह (षट्) उपयोगों के नाम पर: तिल से स्नान, तिल का लेप, तिल से हवन, तिल से तर्पण, तिल खाना, तिल दान।', sa: 'षड्भिः (षट्) तिलप्रयोगैः नामितम्।' }, benefit: { en: 'Donating sesame removes poverty. Protects against cold-weather ailments.', hi: 'तिल दान दरिद्रता दूर करता है।', sa: 'तिलदानं दारिद्र्यं निवारयति।' } },
  },
  phalguna: {
    shukla: { name: { en: 'Amalaki Ekadashi', hi: 'आमलकी एकादशी', sa: 'आमलकीएकादशी' }, story: { en: 'Named after the Amalaki (Indian gooseberry/Amla) tree, which is considered a manifestation of Lord Vishnu. A hunter, despite his sinful life, once stayed awake under an Amla tree on this Ekadashi and was freed from all sins.', hi: 'आमलकी (आँवला) वृक्ष के नाम पर, जो विष्णु का स्वरूप माना जाता है। एक पापी शिकारी इस एकादशी पर आँवले के पेड़ के नीचे जागता रहा और सभी पापों से मुक्त हुआ।', sa: 'आमलकीवृक्षस्य नाम्ना, यः विष्णोः स्वरूपं मन्यते।' }, benefit: { en: 'Worshipping the Amla tree on this day equals donating a thousand cows. The tree is Vishnu incarnate.', hi: 'इस दिन आँवले के वृक्ष की पूजा सहस्र गायों के दान के बराबर है।', sa: 'अस्मिन् दिने आमलकीवृक्षपूजनं सहस्रगवां दानसमम्।' } },
    krishna: { name: { en: 'Vijaya Ekadashi', hi: 'विजया एकादशी', sa: 'विजयैकादशी' }, story: { en: 'Before building the bridge to Lanka, Lord Rama observed this Ekadashi as advised by Sage Bakadalbhya, gaining certain victory. Vijaya = victory. This Ekadashi ensures success in difficult undertakings.', hi: 'लंका पर सेतु बनाने से पहले, राम ने ऋषि बकदाल्भ्य की सलाह पर इस एकादशी का व्रत रखा और निश्चित विजय प्राप्त की। विजया = विजय।', sa: 'लङ्कासेतुनिर्माणात् पूर्वं रामः बकदाल्भ्यऋषेः उपदेशेन एताम् एकादशीम् अवर्तयत्।' }, benefit: { en: 'Guarantees victory in all battles and undertakings. Lord Rama himself observed this fast.', hi: 'सभी युद्धों और कार्यों में विजय की गारण्टी। स्वयं राम ने यह व्रत रखा था।', sa: 'सर्वयुद्धकार्येषु विजयं सुनिश्चितं करोति।' } },
  },
};

/* ═══════════════════════════════════════════
   CATEGORY-LEVEL DETAILS (Purnima, Amavasya, etc.)
   ═══════════════════════════════════════════ */

export const CATEGORY_DETAILS: Record<string, FestivalDetail> = {
  purnima: {
    name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्' },
    mythology: { en: 'The full moon is considered a manifestation of Soma (the Moon God) at peak strength. In Vedic texts, Purnima is associated with abundance, completion, and the harvest of spiritual merit. The mind (Manas) is said to be most powerfully influenced by the Moon on this night.', hi: 'पूर्णिमा को सोम (चन्द्र देव) की चरम शक्ति का प्रकटीकरण माना जाता है। वैदिक ग्रन्थों में पूर्णिमा को प्रचुरता, पूर्णता और आध्यात्मिक पुण्य से जोड़ा जाता है।', sa: 'पूर्णिमा सोमस्य चरमशक्तेः प्रकटीकरणम्।' },
    observance: { en: 'Fast from sunrise to moonrise. Perform Satyanarayan Puja. Offer water (Arghya) to the Moon. Donate food and clothes. Take a holy bath. Recite Vishnu Sahasranama.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। सत्यनारायण पूजा। चन्द्र को अर्घ्य। अन्न और वस्त्र दान।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। सत्यनारायणपूजा। चन्द्राय अर्घ्यम्।' },
    significance: { en: 'Each Purnima has a specific name and significance based on the Hindu month. The full moon amplifies the effects of prayers, meditation, and charity. Considered the best day for Satyanarayan Katha.', hi: 'प्रत्येक पूर्णिमा का हिन्दू महीने के आधार पर विशेष नाम और महत्व है। पूर्णिमा प्रार्थना, ध्यान और दान के प्रभावों को बढ़ाती है।', sa: 'प्रत्येका पूर्णिमा हिन्दुमासस्य आधारेण विशेषं नाम महत्त्वं च धारयति।' },
    deity: { en: 'Lord Vishnu / Chandra (Moon)', hi: 'भगवान विष्णु / चन्द्र', sa: 'विष्णुः / चन्द्रः' },
    isFast: true,
    fastNote: { en: 'Fast from sunrise until moonrise. Break fast after sighting the full moon and offering Arghya.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। पूर्ण चन्द्र दर्शन और अर्घ्य के बाद पारण।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। पूर्णचन्द्रदर्शनार्घ्यानन्तरं पारणम्।' },
  },
  amavasya: {
    name: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावास्या' },
    mythology: { en: 'Amavasya (new moon) is the day when the Sun and Moon are in conjunction. It is dedicated to the Pitrs (ancestors). In the Garuda Purana, Lord Vishnu describes how offerings made on Amavasya reach the departed souls and satisfy them for an entire month.', hi: 'अमावस्या (अमा = एक साथ, वस्या = निवास) वह दिन है जब सूर्य और चन्द्र युति में होते हैं। यह पितरों को समर्पित है।', sa: 'अमावास्या तद् दिनं यदा सूर्यचन्द्रौ युत्यां स्तः। पितृभ्यः समर्पिता।' },
    observance: { en: 'Perform Tarpan (offering water with sesame to ancestors). Visit Peepal tree and circumambulate. Donate food to Brahmins. Avoid starting new ventures. Recite Pitru Stotram. Some observe a full fast.', hi: 'पितरों को तिल-जल से तर्पण करें। पीपल वृक्ष की परिक्रमा करें। ब्राह्मणों को भोजन दान करें। नए कार्य आरम्भ न करें।', sa: 'पितृभ्यः तिलजलेन तर्पणं करोतु। पीपलवृक्षं परिक्रामतु।' },
    significance: { en: 'The darkest night — ideal for introspection and connecting with ancestors. Spiritual practices done on Amavasya are said to have deep, transformative effects. The energy is inward and contemplative.', hi: 'सबसे अन्धेरी रात — आत्मनिरीक्षण और पूर्वजों से जुड़ने के लिए आदर्श।', sa: 'अन्धकारतमा रात्रिः — आत्मनिरीक्षणार्थं पूर्वजसम्बन्धार्थं च आदर्शा।' },
    deity: { en: 'Pitrs (Ancestors)', hi: 'पितृ (पूर्वज)', sa: 'पितरः' },
  },
  chaturthi: {
    name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टिचतुर्थी' },
    mythology: { en: 'Sankashti means "deliverance from difficult times." Lord Ganesha promised that whoever observes this monthly fast and worships him during moonrise will be freed from all obstacles. Each month\'s Sankashti is associated with a different form of Ganesha and a specific temple.', hi: 'संकष्टी का अर्थ है "कठिन समय से मुक्ति"। गणेश ने वचन दिया कि जो इस मासिक व्रत का पालन करेगा और चन्द्रोदय पर उनकी पूजा करेगा, वह सभी बाधाओं से मुक्त होगा।', sa: 'सङ्कष्टी "कठिनकालात् मुक्तिः" इत्यर्थः।' },
    observance: { en: 'Fast from sunrise until moonrise. Prepare and offer modak and durva grass to Ganesha. Recite Sankashti Ganapati Stotra. Break fast only after sighting the moon and completing puja. If the moon is not visible due to clouds, fast until the next day.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। गणेश को मोदक और दूर्वा अर्पित करें। संकष्टी गणपति स्तोत्र का पाठ करें। चन्द्र दर्शन के बाद ही पारण करें।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। गणेशाय मोदकं दूर्वां च अर्पयतु। चन्द्रदर्शनानन्तरं पारणम्।' },
    significance: { en: 'Monthly worship of the Remover of Obstacles (Vighnaharta). Falling on Krishna Chaturthi (4th day of waning moon), it carries the energy of perseverance through the dark half of the lunar cycle.', hi: 'विघ्नहर्ता की मासिक पूजा। कृष्ण चतुर्थी (ढलते चन्द्र का 4वाँ दिन) पर।', sa: 'विघ्नहर्तुः मासिकपूजनम्।' },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'गणेशः' },
    isFast: true,
    fastNote: { en: 'Fast from sunrise until moonrise. Break fast only after sighting the moon and offering prayers.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। चन्द्र दर्शन और प्रार्थना के बाद ही पारण।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। चन्द्रदर्शनप्रार्थनानन्तरं पारणम्।' },
  },
  pradosham: {
    name: { en: 'Pradosham', hi: 'प्रदोष', sa: 'प्रदोषः' },
    mythology: { en: 'During the churning of the ocean (Samudra Manthan), the deadly poison Halahala emerged during the twilight (Pradosha) hour. Lord Shiva consumed it to save creation, and Parvati held his throat to prevent the poison from descending, turning it blue. This twilight hour became sacred to Shiva.', hi: 'समुद्र मन्थन में संध्याकाल (प्रदोष) में हलाहल विष निकला। शिव ने सृष्टि बचाने के लिए इसे पी लिया, पार्वती ने उनका कण्ठ पकड़कर विष को नीचे जाने से रोका — कण्ठ नीला हो गया।', sa: 'समुद्रमन्थने प्रदोषकाले हालाहलविषम् उद्भूतम्। शिवः सृष्टिरक्षार्थं तत् अपिबत्।' },
    observance: { en: 'Worship Lord Shiva during the Pradosha Kaal — the 1.5-hour window before and after sunset (approximately 4:30 PM to 7:30 PM). Offer Bel leaves, milk, and flowers. Recite Maha Mrityunjaya Mantra. Visit a Shiva temple if possible.', hi: 'प्रदोष काल में शिव पूजा — सूर्यास्त से पहले और बाद 1.5 घण्टे (लगभग शाम 4:30 से 7:30)। बेलपत्र, दूध और फूल अर्पित करें। महामृत्युंजय मन्त्र का जाप करें।', sa: 'प्रदोषकाले शिवपूजनम् — सूर्यास्तात् पूर्वं परं च 1.5 होरायाम्।' },
    significance: { en: 'The Trayodashi (13th tithi) combined with twilight is supremely sacred to Lord Shiva. Pradosham falling on Saturday (Shani Pradosham) is especially powerful for removing Saturn\'s afflictions.', hi: 'त्रयोदशी और संध्याकाल का संयोग शिव के लिए परम पवित्र है। शनिवार का प्रदोष (शनि प्रदोष) शनि पीड़ा निवारण में विशेष शक्तिशाली है।', sa: 'त्रयोदशीसन्ध्याकालयोः संयोगः शिवार्थं परमपवित्रः।' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'शिवः' },
  },
  ekadashi: {
    name: { en: 'Ekadashi Vrat', hi: 'एकादशी व्रत', sa: 'एकादशीव्रतम्' },
    mythology: { en: 'When the demon Mura attacked Lord Vishnu, a divine feminine power emerged from Vishnu\'s body on the 11th day (Ekadashi) of the lunar fortnight and destroyed the demon. Vishnu declared that fasting on this day would please him more than any other offering. The 24 Ekadashis are described in the Padma Purana, each with a unique name and story.', hi: 'जब मुर दैत्य ने विष्णु पर आक्रमण किया, चान्द्र पक्ष के 11वें दिन (एकादशी) पर विष्णु के शरीर से एक दिव्य स्त्री शक्ति प्रकट हुई और दैत्य का वध किया। 24 एकादशियों का वर्णन पद्म पुराण में है।', sa: 'यदा मुरदैत्यः विष्णुम् आक्रामत्, चान्द्रपक्षस्य एकादशदिने विष्णोः शरीरात् दिव्या स्त्रीशक्तिः उत्पन्ना।' },
    observance: { en: 'Complete fast from grains and beans (Anna). Most observers eat fruits, milk, and root vegetables. Nirjala (waterless) fasting gives the highest merit. Recite Vishnu Sahasranama and meditate on Lord Vishnu. Stay awake as late as possible. Break fast (Parana) on Dwadashi (12th day) morning within the prescribed window.', hi: 'अन्न और दालों से पूर्ण उपवास। अधिकांश व्रती फल, दूध और कन्दमूल खाते हैं। निर्जला (जलरहित) व्रत सर्वोच्च पुण्यदायी। विष्णु सहस्रनाम का पाठ करें। द्वादशी (12वें दिन) प्रातः पारण करें।', sa: 'अन्नदालेभ्यः पूर्णम् उपवासम्। फलं, क्षीरं, कन्दमूलानि च खादतु। द्वादश्यां प्रातः पारणम्।' },
    significance: { en: 'Ekadashi is Vishnu\'s most beloved tithi. The Padma Purana states that the merit of all pilgrimages, all charities, and all sacrifices combined is less than observing a single Ekadashi fast. Each of the 24 yearly Ekadashis has a unique name, story, and specific benefit.', hi: 'एकादशी विष्णु की सबसे प्रिय तिथि है। पद्म पुराण कहता है कि सभी तीर्थयात्राओं, दानों और यज्ञों का संयुक्त पुण्य एक एकादशी व्रत से कम है।', sa: 'एकादशी विष्णोः प्रियतमा तिथिः। पद्मपुराणं वदति सर्वतीर्थदानयज्ञानां संयुक्तपुण्यम् एकैकादशीव्रतात् न्यूनम् इति।' },
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु', sa: 'विष्णुः' },
    isFast: true,
    fastNote: { en: 'Fast on Ekadashi day (no grains/beans). Break fast (Parana) next morning on Dwadashi after sunrise, ideally before 1/3 of the day has elapsed.', hi: 'एकादशी पर उपवास (अन्न/दाल वर्जित)। अगले दिन द्वादशी पर सूर्योदय के बाद पारण, दिन के 1/3 से पहले।', sa: 'एकादश्यां व्रतम् (अन्नं दालं च वर्जितम्)। द्वादश्यां सूर्योदयानन्तरं पारणम्।' },
  },
};

/**
 * Adhika Masa (intercalary month) Ekadashi names.
 * During Adhika Masa, Ekadashis have special names dedicated to Lord Purushottama (Vishnu).
 */
export const ADHIKA_MASA_EKADASHI: { shukla: EkadashiDetail; krishna: EkadashiDetail } = {
  shukla: {
    name: { en: 'Padmini Ekadashi', hi: 'पद्मिनी एकादशी', sa: 'पद्मिनीएकादशी' },
    story: { en: 'Described in the Skanda Purana. This Ekadashi falls in the Adhika (extra) month, also called Purushottama Masa. Lord Krishna told Yudhishthira that observing this rare Ekadashi grants merit equal to performing the Ashvamedha Yagna.', hi: 'स्कन्द पुराण में वर्णित। यह अधिक मास (पुरुषोत्तम मास) की एकादशी है। कृष्ण ने युधिष्ठिर को बताया कि इस दुर्लभ एकादशी का व्रत अश्वमेध यज्ञ के समान पुण्य देता है।', sa: 'स्कन्दपुराणे वर्णिता। अधिकमासस्य (पुरुषोत्तममासस्य) एकादशी। अश्वमेधयज्ञसमपुण्यम्।' },
    benefit: { en: 'Grants merit of Ashvamedha Yagna. Removes sins accumulated over many lifetimes. Most auspicious Ekadashi of the Adhika Masa.', hi: 'अश्वमेध यज्ञ का पुण्य। अनेक जन्मों के पाप नष्ट। अधिक मास की सबसे शुभ एकादशी।', sa: 'अश्वमेधयज्ञपुण्यम्। अनेकजन्मपापनाशः।' },
  },
  krishna: {
    name: { en: 'Parama Ekadashi', hi: 'परमा एकादशी', sa: 'परमैकादशी' },
    story: { en: 'Described in the Brahma Vaivarta Purana. Lord Krishna narrated this to Arjuna. A king named Sumedha, who had committed grievous sins, observed this Ekadashi during Adhika Masa and was instantly purified. Parama = supreme.', hi: 'ब्रह्म वैवर्त पुराण में वर्णित। कृष्ण ने अर्जुन को सुनाया। सुमेध नामक राजा ने अधिक मास में इस एकादशी का व्रत किया और तुरन्त शुद्ध हुआ।', sa: 'ब्रह्मवैवर्तपुराणे वर्णिता। सुमेधनामकः राजा अधिकमासे एताम् एकादशीम् अवर्तयत्।' },
    benefit: { en: 'Supreme purification. Removes the most grievous sins. Grants liberation to even the most fallen souls.', hi: 'परम शुद्धि। गम्भीरतम पापों का नाश। पतित आत्माओं को भी मुक्ति।', sa: 'परमशुद्धिः। गुरुतमपापनाशः। पतितात्मनामपि मुक्तिः।' },
  },
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

/** Map from sidereal Sun sign (1-12) to Hindu solar month name */
const SOLAR_MONTH_MAP: Record<number, string> = {
  1: 'vaishakha', 2: 'jyeshtha', 3: 'ashadha', 4: 'shravana',
  5: 'bhadrapada', 6: 'ashwina', 7: 'kartika', 8: 'margashirsha',
  9: 'pausha', 10: 'magha', 11: 'phalguna', 12: 'chaitra',
};

/** Get the Hindu month name from the Sun's sidereal sign number (1-12) */
export function getHinduMonth(sunSign: number): string {
  return SOLAR_MONTH_MAP[sunSign] || 'chaitra';
}

/** Get the specific Ekadashi name for a given Hindu month and paksha */
export function getEkadashiName(hinduMonth: string, paksha: 'shukla' | 'krishna'): EkadashiDetail | undefined {
  return EKADASHI_NAMES[hinduMonth]?.[paksha];
}

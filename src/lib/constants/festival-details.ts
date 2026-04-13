/**
 * Rich trilingual content for festivals, vrats, and Ekadashis.
 * Keyed by slug (festival-engine generates matching slugs).
 */
import type { LocaleText,} from '@/types/panchang';

export interface FestivalDetail {
  name: LocaleText;
  mythology: LocaleText;
  observance: LocaleText;
  significance: LocaleText;
  deity?: LocaleText;
  isFast?: boolean;
  fastNote?: LocaleText;
}

/* ═══════════════════════════════════════════
   MAJOR FESTIVALS
   ═══════════════════════════════════════════ */

export const FESTIVAL_DETAILS: Record<string, FestivalDetail> = {
  // ── Major Festivals ──
  'makar-sankranti': {
    name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', sa: 'मकरसंक्रान्तिः', ta: 'மகர சங்கராந்தி', te: 'మకర సంక్రాంతి', bn: 'মকর সংক্রান্তি', kn: 'ಮಕರ ಸಂಕ್ರಾಂತಿ', gu: 'મકર સંક્રાંતિ', mr: 'मकर संक्रान्ति', mai: 'मकर संक्रान्ति' },
    mythology: {
      en: 'Makar Sankranti marks the Sun\'s northward journey (Uttarayana) — considered the beginning of the auspicious half of the year. In the Mahabharata, Bhishma Pitamah waited on his bed of arrows for this day to depart, as dying during Uttarayana is believed to lead to liberation.',
      hi: 'मकर संक्रान्ति सूर्य की उत्तरायण यात्रा का प्रतीक है — वर्ष के शुभ अर्धभाग का आरम्भ। महाभारत में भीष्म पितामह ने इस दिन की प्रतीक्षा शर-शय्या पर की, क्योंकि उत्तरायण में मृत्यु मोक्षदायिनी मानी जाती है।',
      sa: 'मकरसंक्रान्तिः सूर्यस्य उत्तरायणयात्रायाः प्रतीकः — वर्षस्य शुभार्धभागस्य आरम्भः।',
      mr: 'मकर संक्रान्ति सूर्य की उत्तरायण यात्रा का प्रतीक है — वर्ष के शुभ अर्धभाग का आरम्भ। महाभारत में भीष्म पितामह ने इस दिन की प्रतीक्षा शर-शय्या पर की, क्योंकि उत्तरायण में मृत्यु मोक्षदायिनी मानी जाती है।',
      mai: 'मकर संक्रान्ति सूर्य की उत्तरायण यात्रा का प्रतीक है — वर्ष के शुभ अर्धभाग का आरम्भ। महाभारत में भीष्म पितामह ने इस दिन की प्रतीक्षा शर-शय्या पर की, क्योंकि उत्तरायण में मृत्यु मोक्षदायिनी मानी जाती है।',
    },
    observance: {
      en: 'Take a holy bath at sunrise, offer water to the Sun (Surya Arghya), donate sesame seeds and jaggery. Fly kites (in Gujarat and Rajasthan). Prepare til-gul laddoos and khichdi. It is one of the few festivals based on the solar calendar, so it falls on nearly the same Gregorian date each year.',
      hi: 'सूर्योदय पर पवित्र स्नान, सूर्य को अर्घ्य, तिल और गुड़ का दान। पतंग उड़ाएँ। तिल-गुड़ के लड्डू और खिचड़ी बनाएँ। यह सौर कैलेंडर पर आधारित कुछ त्योहारों में से एक है।',
      sa: 'सूर्योदये पवित्रस्नानं, सूर्याय अर्घ्यं, तिलगुडदानं च। तिलगुडलड्डुकान् खिचडीं च पचतु।',
      mr: 'सूर्योदय पर पवित्र स्नान, सूर्य को अर्घ्य, तिल और गुड़ का दान। पतंग उड़ाएँ। तिल-गुड़ के लड्डू और खिचड़ी बनाएँ। यह सौर कैलेंडर पर आधारित कुछ त्योहारों में से एक है।',
      mai: 'सूर्योदय पर पवित्र स्नान, सूर्य को अर्घ्य, तिल और गुड़ का दान। पतंग उड़ाएँ। तिल-गुड़ के लड्डू और खिचड़ी बनाएँ। यह सौर कैलेंडर पर आधारित कुछ त्योहारों में से एक है।',
    },
    significance: {
      en: 'Marks the transition from Dakshinayana (southward) to Uttarayana (northward movement of the Sun). Days begin to grow longer. Auspicious for charity, penance, and new beginnings.',
      hi: 'दक्षिणायन से उत्तरायण में सूर्य के संक्रमण का प्रतीक। दिन लम्बे होने लगते हैं। दान, तपस्या और नई शुरुआत के लिए शुभ।',
      sa: 'दक्षिणायनात् उत्तरायणे सूर्यसंक्रमणस्य प्रतीकः। दिनानि दीर्घाणि भवन्ति।',
      mr: 'दक्षिणायन से उत्तरायण में सूर्य के संक्रमण का प्रतीक। दिन लम्बे होने लगते हैं। दान, तपस्या और नई शुरुआत के लिए शुभ।',
      mai: 'दक्षिणायन से उत्तरायण में सूर्य के संक्रमण का प्रतीक। दिन लम्बे होने लगते हैं। दान, तपस्या और नई शुरुआत के लिए शुभ।',
    },
    deity: { en: 'Surya (Sun God)', hi: 'सूर्य देव', sa: 'सूर्यदेवः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য দেব', kn: 'ಸೂರ್ಯ ದೇವ', gu: 'સૂર્ય દેવ', mr: 'सूर्य देव', mai: 'सूर्य देव' },
  },

  'vasant-panchami': {
    name: { en: 'Vasant Panchami', hi: 'वसन्त पञ्चमी', sa: 'वसन्तपञ्चमी', ta: 'வசந்த பஞ்சமி', te: 'వసంత పంచమి', bn: 'বসন্ত পঞ্চমী', kn: 'ವಸಂತ ಪಂಚಮಿ', gu: 'વસંત પંચમી', mr: 'वसन्त पञ्चमी', mai: 'वसन्त पञ्चमी' },
    mythology: {
      en: 'Lord Brahma created the world but found it silent and lifeless. He prayed to Goddess Saraswati, who emerged from his mouth playing the Veena. Her music filled creation with life, speech, and wisdom. This day celebrates her appearance.',
      hi: 'ब्रह्मा जी ने सृष्टि रची पर वह मूक और निर्जीव थी। उन्होंने देवी सरस्वती की प्रार्थना की, जो वीणा बजाती हुई उनके मुख से प्रकट हुईं। उनके संगीत ने सृष्टि को जीवन, वाणी और ज्ञान से भर दिया।',
      sa: 'ब्रह्मा सृष्टिम् अरचयत् किन्तु सा मूका निर्जीवा चासीत्। सरस्वतीदेवी वीणावादयन्ती तस्य मुखात् प्राकट्यत।',
      mr: 'ब्रह्मा जी ने सृष्टि रची पर वह मूक और निर्जीव थी। उन्होंने देवी सरस्वती की प्रार्थना की, जो वीणा बजाती हुई उनके मुख से प्रकट हुईं। उनके संगीत ने सृष्टि को जीवन, वाणी और ज्ञान से भर दिया।',
      mai: 'ब्रह्मा जी ने सृष्टि रची पर वह मूक और निर्जीव थी। उन्होंने देवी सरस्वती की प्रार्थना की, जो वीणा बजाती हुई उनके मुख से प्रकट हुईं। उनके संगीत ने सृष्टि को जीवन, वाणी और ज्ञान से भर दिया।',
    },
    observance: {
      en: 'Worship Goddess Saraswati with yellow flowers and sweets. Wear yellow clothes (symbolizing the mustard fields of spring). Start new learning or creative pursuits. Place books, instruments, and pens before the deity. Children are often initiated into learning (Vidyarambham) on this day.',
      hi: 'देवी सरस्वती की पीले फूलों और मिठाइयों से पूजा करें। पीले वस्त्र पहनें। नई शिक्षा या सृजनात्मक कार्य आरम्भ करें। बच्चों का विद्यारम्भ संस्कार इस दिन किया जाता है।',
      sa: 'सरस्वतीदेवीं पीतपुष्पैः मिष्टान्नैः च पूजयतु। पीतवस्त्राणि धारयतु। नवशिक्षां आरभतु।',
      mr: 'देवी सरस्वती की पीले फूलों और मिठाइयों से पूजा करें। पीले वस्त्र पहनें। नई शिक्षा या सृजनात्मक कार्य आरम्भ करें। बच्चों का विद्यारम्भ संस्कार इस दिन किया जाता है।',
      mai: 'देवी सरस्वती की पीले फूलों और मिठाइयों से पूजा करें। पीले वस्त्र पहनें। नई शिक्षा या सृजनात्मक कार्य आरम्भ करें। बच्चों का विद्यारम्भ संस्कार इस दिन किया जाता है।',
    },
    significance: {
      en: 'Marks the arrival of spring. Considered the most auspicious day for starting education, learning music, and artistic endeavours. Yellow represents knowledge and prosperity.',
      hi: 'वसन्त ऋतु के आगमन का प्रतीक। शिक्षा, संगीत और कला आरम्भ करने का सबसे शुभ दिन।',
      sa: 'वसन्तर्तोः आगमनस्य प्रतीकः। शिक्षायाः संगीतस्य कलायाः च आरम्भार्थं शुभतमं दिनम्।',
      mr: 'वसन्त ऋतु के आगमन का प्रतीक। शिक्षा, संगीत और कला आरम्भ करने का सबसे शुभ दिन।',
      mai: 'वसन्त ऋतु के आगमन का प्रतीक। शिक्षा, संगीत और कला आरम्भ करने का सबसे शुभ दिन।',
    },
    deity: { en: 'Saraswati', hi: 'सरस्वती', sa: 'सरस्वती', ta: 'சரஸ்வதி', te: 'సరస్వతి', bn: 'সরস্বতী', kn: 'ಸರಸ್ವತಿ', gu: 'સરસ્વતી', mr: 'सरस्वती', mai: 'सरस्वती' },
  },

  'maha-shivaratri': {
    name: { en: 'Maha Shivaratri', hi: 'महाशिवरात्रि', sa: 'महाशिवरात्रिः', ta: 'மகா சிவராத்திரி', te: 'మహా శివరాత్రి', bn: 'মহাশিবরাত্রি', kn: 'ಮಹಾ ಶಿವರಾತ್ರಿ', gu: 'મહા શિવરાત્રી', mr: 'महाशिवरात्रि', mai: 'महाशिवरात्रि' },
    mythology: {
      en: 'Multiple stories surround this night: It is when Lord Shiva performed the Tandava — the cosmic dance of creation and destruction. It is also when Shiva drank the Halahala poison during Samudra Manthan to save the universe, turning his throat blue (Neelakantha). Some traditions hold it as the wedding night of Shiva and Parvati.',
      hi: 'इस रात्रि से अनेक कथाएँ जुड़ी हैं: शिव ने ताण्डव नृत्य किया — सृष्टि और विनाश का ब्रह्माण्डीय नृत्य। समुद्र मन्थन में विश्व को बचाने के लिए शिव ने हलाहल विष पिया, जिससे उनका कण्ठ नीला हो गया (नीलकण्ठ)।',
      sa: 'अस्मिन् रात्रौ शिवः ताण्डवनृत्यम् अकरोत्। समुद्रमन्थने विश्वरक्षार्थं हालाहलविषम् अपिबत्, तेन तस्य कण्ठः नीलः अभवत्।',
      mr: 'इस रात्रि से अनेक कथाएँ जुड़ी हैं: शिव ने ताण्डव नृत्य किया — सृष्टि और विनाश का ब्रह्माण्डीय नृत्य। समुद्र मन्थन में विश्व को बचाने के लिए शिव ने हलाहल विष पिया, जिससे उनका कण्ठ नीला हो गया (नीलकण्ठ)।',
      mai: 'इस रात्रि से अनेक कथाएँ जुड़ी हैं: शिव ने ताण्डव नृत्य किया — सृष्टि और विनाश का ब्रह्माण्डीय नृत्य। समुद्र मन्थन में विश्व को बचाने के लिए शिव ने हलाहल विष पिया, जिससे उनका कण्ठ नीला हो गया (नीलकण्ठ)।',
    },
    observance: {
      en: 'Observe a strict fast (nirjala or with fruits). Stay awake all night (jagaran). Offer Bel leaves, milk, water, and honey to the Shiva Lingam during four Praharas (night quarters). Chant "Om Namah Shivaya". Visit Shiva temples.',
      hi: 'कठोर उपवास रखें (निर्जला या फलाहार)। रात भर जागें (जागरण)। चार प्रहरों में शिवलिंग पर बेलपत्र, दूध, जल और शहद चढ़ाएँ। "ओम नमः शिवाय" का जाप करें।',
      sa: 'कठोरं व्रतं धारयतु। सर्वां रात्रिं जागृतं तिष्ठतु। चतुर्षु प्रहरेषु शिवलिङ्गे बिल्वपत्राणि क्षीरं जलं मधु च अर्पयतु।',
      mr: 'कठोर उपवास रखें (निर्जला या फलाहार)। रात भर जागें (जागरण)। चार प्रहरों में शिवलिंग पर बेलपत्र, दूध, जल और शहद चढ़ाएँ। "ओम नमः शिवाय" का जाप करें।',
      mai: 'कठोर उपवास रखें (निर्जला या फलाहार)। रात भर जागें (जागरण)। चार प्रहरों में शिवलिंग पर बेलपत्र, दूध, जल और शहद चढ़ाएँ। "ओम नमः शिवाय" का जाप करें।',
    },
    significance: {
      en: 'The darkest night of the year — symbolizing the overcoming of darkness and ignorance. Considered the night when Shiva\'s energy is most accessible. Fasting and meditation on this night is said to be equivalent to a year of spiritual practice.',
      hi: 'वर्ष की सबसे अन्धकारमय रात्रि — अन्धकार और अज्ञान पर विजय का प्रतीक। इस रात्रि शिव की ऊर्जा सर्वाधिक सुलभ मानी जाती है।',
      sa: 'वर्षस्य अन्धकारतमा रात्रिः — अन्धकारस्य अज्ञानस्य च उपरि विजयस्य प्रतीकः।',
      mr: 'वर्ष की सबसे अन्धकारमय रात्रि — अन्धकार और अज्ञान पर विजय का प्रतीक। इस रात्रि शिव की ऊर्जा सर्वाधिक सुलभ मानी जाती है।',
      mai: 'वर्ष की सबसे अन्धकारमय रात्रि — अन्धकार और अज्ञान पर विजय का प्रतीक। इस रात्रि शिव की ऊर्जा सर्वाधिक सुलभ मानी जाती है।',
    },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'शिवः', ta: 'சிவபெருமான்', te: 'శివుడు', bn: 'শিব', kn: 'ಶಿವ', gu: 'શિવ', mr: 'भगवान शिव', mai: 'भगवान शिव' },
    isFast: true,
    fastNote: { en: 'Strict fast (nirjala or fruits only). Break fast next morning after puja.', hi: 'कठोर व्रत (निर्जला या केवल फलाहार)। अगली सुबह पूजा के बाद पारण करें।', sa: 'कठोरं व्रतम्। प्रातः पूजानन्तरं पारणम्।', mr: 'कठोर व्रत (निर्जला या केवल फलाहार)। अगली सुबह पूजा के बाद पारण करें।', mai: 'कठोर व्रत (निर्जला या केवल फलाहार)। अगली सुबह पूजा के बाद पारण करें।' },
  },

  'holi': {
    name: { en: 'Holi', hi: 'होली', sa: 'होलिका', ta: 'ஹோலி', te: 'హోళీ', bn: 'হোলি', kn: 'ಹೋಳಿ', gu: 'હોળી', mr: 'होली', mai: 'होली' },
    mythology: {
      en: 'Hiranyakashipu, a demon king, tried to kill his son Prahlad for worshipping Lord Vishnu. His sister Holika, who had a boon of fire immunity, sat with Prahlad in a bonfire. But the boon worked only when Holika sat alone — she was burned while Prahlad emerged unscathed. The bonfire (Holika Dahan) on the eve celebrates this victory.',
      hi: 'दैत्य राजा हिरण्यकशिपु ने अपने पुत्र प्रह्लाद को विष्णु की भक्ति के लिए मारने का प्रयास किया। उसकी बहन होलिका, जिसे अग्नि से प्रतिरक्षा का वरदान था, प्रह्लाद को गोद में लेकर अग्नि में बैठी। पर वरदान केवल अकेले बैठने पर काम करता था — होलिका जल गई और प्रह्लाद बच गया।',
      sa: 'हिरण्यकशिपुः स्वपुत्रं प्रह्लादं विष्णुभक्तेः कारणात् हन्तुम् अप्रयतत। तस्य भगिनी होलिका अग्निसुरक्षावरदानयुक्ता प्रह्लादं गृहीत्वा अग्नौ उपाविशत्। किन्तु होलिका दग्धा प्रह्लादः च सुरक्षितः।',
      mr: 'दैत्य राजा हिरण्यकशिपु ने अपने पुत्र प्रह्लाद को विष्णु की भक्ति के लिए मारने का प्रयास किया। उसकी बहन होलिका, जिसे अग्नि से प्रतिरक्षा का वरदान था, प्रह्लाद को गोद में लेकर अग्नि में बैठी। पर वरदान केवल अकेले बैठने पर काम करता था — होलिका जल गई और प्रह्लाद बच गया।',
      mai: 'दैत्य राजा हिरण्यकशिपु ने अपने पुत्र प्रह्लाद को विष्णु की भक्ति के लिए मारने का प्रयास किया। उसकी बहन होलिका, जिसे अग्नि से प्रतिरक्षा का वरदान था, प्रह्लाद को गोद में लेकर अग्नि में बैठी। पर वरदान केवल अकेले बैठने पर काम करता था — होलिका जल गई और प्रह्लाद बच गया।',
    },
    observance: {
      en: 'Evening before: Holika Dahan — light a bonfire, circumambulate it, offer coconut and grains. Next day: Play with colours (gulal, water balloons), drink thandai and bhang, eat gujiya and sweets. Visit friends and family.',
      hi: 'पूर्व संध्या: होलिका दहन — अलाव जलाएँ, परिक्रमा करें। अगले दिन: रंगों से खेलें (गुलाल, पिचकारी), ठण्डाई पिएँ, गुजिया खाएँ। मित्रों और परिवार से मिलें।',
      sa: 'पूर्वसन्ध्या: होलिकादहनम्। अग्रे दिने: रङ्गैः क्रीडतु। मित्रान् कुटुम्बं च मिलतु।',
      mr: 'पूर्व संध्या: होलिका दहन — अलाव जलाएँ, परिक्रमा करें। अगले दिन: रंगों से खेलें (गुलाल, पिचकारी), ठण्डाई पिएँ, गुजिया खाएँ। मित्रों और परिवार से मिलें।',
      mai: 'पूर्व संध्या: होलिका दहन — अलाव जलाएँ, परिक्रमा करें। अगले दिन: रंगों से खेलें (गुलाल, पिचकारी), ठण्डाई पिएँ, गुजिया खाएँ। मित्रों और परिवार से मिलें।',
    },
    significance: {
      en: 'Victory of good (Prahlad\'s devotion) over evil (Hiranyakashipu\'s arrogance). Celebration of spring, renewal, and the breaking of social barriers through shared joy.',
      hi: 'अच्छाई (प्रह्लाद की भक्ति) की बुराई (हिरण्यकशिपु के अहंकार) पर विजय। वसन्त, नवीनता और सामाजिक एकता का उत्सव।',
      sa: 'सत्यस्य (प्रह्लादभक्तेः) असत्योपरि (हिरण्यकशिपोः अहङ्कारोपरि) विजयः।',
      mr: 'अच्छाई (प्रह्लाद की भक्ति) की बुराई (हिरण्यकशिपु के अहंकार) पर विजय। वसन्त, नवीनता और सामाजिक एकता का उत्सव।',
      mai: 'अच्छाई (प्रह्लाद की भक्ति) की बुराई (हिरण्यकशिपु के अहंकार) पर विजय। वसन्त, नवीनता और सामाजिक एकता का उत्सव।',
    },
    deity: { en: 'Lord Vishnu (as protector of Prahlad)', hi: 'भगवान विष्णु (प्रह्लाद के रक्षक)', sa: 'विष्णुः (प्रह्लादरक्षकः)', ta: 'விஷ்ணு (பிரகலாதன் காவலர்)', te: 'విష్ణువు (ప్రహ్లాదుని రక్షకుడు)', bn: 'বিষ্ণু (প্রহ্লাদের রক্ষক)', kn: 'ವಿಷ್ಣು (ಪ್ರಹ್ಲಾದನ ರಕ್ಷಕ)', gu: 'વિષ્ણુ (પ્રહ્લાદના રક્ષક)', mr: 'भगवान विष्णु (प्रह्लाद के रक्षक)', mai: 'भगवान विष्णु (प्रह्लाद के रक्षक)' },
  },

  'ram-navami': {
    name: { en: 'Ram Navami', hi: 'रामनवमी', sa: 'रामनवमी', ta: 'ராம நவமி', te: 'శ్రీరామ నవమి', bn: 'রাম নবমী', kn: 'ಶ್ರೀರಾಮ ನವಮಿ', gu: 'રામ નવમી', mr: 'रामनवमी', mai: 'रामनवमी' },
    mythology: {
      en: 'Lord Vishnu incarnated as Rama, the prince of Ayodhya, to King Dasharatha and Queen Kausalya on Chaitra Shukla Navami. Born at noon (Madhyahna), Rama is the embodiment of Dharma — the ideal king, son, husband, and warrior. His life story is told in the Ramayana by Sage Valmiki.',
      hi: 'भगवान विष्णु ने चैत्र शुक्ल नवमी को राजा दशरथ और रानी कौशल्या के पुत्र राम के रूप में अयोध्या में अवतार लिया। मध्याह्न में जन्मे राम धर्म के मूर्तिमान रूप हैं।',
      sa: 'विष्णुः चैत्रशुक्लनवम्यां राजदशरथस्य रान्याः कौशल्यायाः च पुत्ररूपेण अवतीर्णः। मध्याह्ने जातः रामः धर्मस्य मूर्तिमान् रूपम्।',
      mr: 'भगवान विष्णु ने चैत्र शुक्ल नवमी को राजा दशरथ और रानी कौशल्या के पुत्र राम के रूप में अयोध्या में अवतार लिया। मध्याह्न में जन्मे राम धर्म के मूर्तिमान रूप हैं।',
      mai: 'भगवान विष्णु ने चैत्र शुक्ल नवमी को राजा दशरथ और रानी कौशल्या के पुत्र राम के रूप में अयोध्या में अवतार लिया। मध्याह्न में जन्मे राम धर्म के मूर्तिमान रूप हैं।',
    },
    observance: {
      en: 'Fast until noon, then break fast with fruits or a meal. Read the Ramayana (especially Sundarkand). Perform Rama Puja at home or visit a temple. Chant "Shri Ram Jai Ram Jai Jai Ram". Temples host kirtans and distribute prasad.',
      hi: 'मध्याह्न तक उपवास, फिर फलाहार या भोजन। रामायण पाठ करें (विशेषतः सुन्दरकाण्ड)। राम पूजा करें। "श्री राम जय राम जय जय राम" का जाप करें।',
      sa: 'मध्याह्नपर्यन्तं व्रतम्। रामायणं पठतु। रामपूजां करोतु।',
      mr: 'मध्याह्न तक उपवास, फिर फलाहार या भोजन। रामायण पाठ करें (विशेषतः सुन्दरकाण्ड)। राम पूजा करें। "श्री राम जय राम जय जय राम" का जाप करें।',
      mai: 'मध्याह्न तक उपवास, फिर फलाहार या भोजन। रामायण पाठ करें (विशेषतः सुन्दरकाण्ड)। राम पूजा करें। "श्री राम जय राम जय जय राम" का जाप करें।',
    },
    significance: {
      en: 'Celebrates the birth of Maryada Purushottam — the ideal man who upheld dharma at every step. Falls in the spring month of Chaitra, marking new beginnings in the Hindu calendar.',
      hi: 'मर्यादा पुरुषोत्तम के जन्म का उत्सव — जिन्होंने प्रत्येक कदम पर धर्म का पालन किया।',
      sa: 'मर्यादापुरुषोत्तमस्य जन्मोत्सवः — यः प्रत्येकं पदे धर्मम् अपालयत्।',
      mr: 'मर्यादा पुरुषोत्तम के जन्म का उत्सव — जिन्होंने प्रत्येक कदम पर धर्म का पालन किया।',
      mai: 'मर्यादा पुरुषोत्तम के जन्म का उत्सव — जिन्होंने प्रत्येक कदम पर धर्म का पालन किया।',
    },
    deity: { en: 'Lord Rama', hi: 'भगवान राम', sa: 'श्रीरामः', ta: 'ஸ்ரீ ராமர்', te: 'శ్రీరాముడు', bn: 'শ্রীরাম', kn: 'ಶ್ರೀರಾಮ', gu: 'શ્રી રામ', mr: 'भगवान राम', mai: 'भगवान राम' },
    isFast: true,
    fastNote: { en: 'Fast until noon (Madhyahna). Break fast with fruits and sattvic food.', hi: 'मध्याह्न तक उपवास। फलाहार और सात्विक भोजन से पारण करें।', sa: 'मध्याह्नपर्यन्तं व्रतम्। फलैः सात्त्विकाहारेण च पारणम्।', mr: 'मध्याह्न तक उपवास। फलाहार और सात्विक भोजन से पारण करें।', mai: 'मध्याह्न तक उपवास। फलाहार और सात्विक भोजन से पारण करें।' },
  },

  'hanuman-jayanti': {
    name: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती', sa: 'हनुमज्जयन्ती', ta: 'ஹனுமான் ஜயந்தி', te: 'హనుమాన్ జయంతి', bn: 'হনুমান জয়ন্তী', kn: 'ಹನುಮಾನ್ ಜಯಂತಿ', gu: 'હનુમાન જયંતી', mr: 'हनुमान जयन्ती', mai: 'हनुमान जयन्ती' },
    mythology: {
      en: 'Hanuman is the son of Vayu (the Wind God) and Anjana. As a child, he mistook the Sun for a ripe fruit and leapt to swallow it. Indra struck him with his Vajra, but Vayu revived him and all the gods blessed him with powers — making him immortal, invulnerable, and the greatest devotee of Lord Rama.',
      hi: 'हनुमान वायु देव और अंजना के पुत्र हैं। बचपन में उन्होंने सूर्य को पका फल समझकर निगलने का प्रयास किया। इन्द्र ने वज्र से प्रहार किया पर वायु ने उन्हें पुनर्जीवित किया और सभी देवताओं ने उन्हें वरदान दिए।',
      sa: 'हनुमान् वायोः अञ्जनायाः च पुत्रः। बाल्ये सूर्यं पक्वफलं मत्वा ग्रसितुम् अप्रयतत।',
      mr: 'हनुमान वायु देव और अंजना के पुत्र हैं। बचपन में उन्होंने सूर्य को पका फल समझकर निगलने का प्रयास किया। इन्द्र ने वज्र से प्रहार किया पर वायु ने उन्हें पुनर्जीवित किया और सभी देवताओं ने उन्हें वरदान दिए।',
      mai: 'हनुमान वायु देव और अंजना के पुत्र हैं। बचपन में उन्होंने सूर्य को पका फल समझकर निगलने का प्रयास किया। इन्द्र ने वज्र से प्रहार किया पर वायु ने उन्हें पुनर्जीवित किया और सभी देवताओं ने उन्हें वरदान दिए।',
    },
    observance: {
      en: 'Visit Hanuman temples, recite Hanuman Chalisa and Sundarkand. Offer sindoor (vermilion), oil, and flowers. Distribute prasad. Many observe a fast and break it after evening prayers.',
      hi: 'हनुमान मन्दिर जाएँ, हनुमान चालीसा और सुन्दरकाण्ड का पाठ करें। सिन्दूर, तेल और फूल अर्पित करें।',
      sa: 'हनुमन्मन्दिरं गच्छतु। हनुमच्चालीसां सुन्दरकाण्डं च पठतु।',
      mr: 'हनुमान मन्दिर जाएँ, हनुमान चालीसा और सुन्दरकाण्ड का पाठ करें। सिन्दूर, तेल और फूल अर्पित करें।',
      mai: 'हनुमान मन्दिर जाएँ, हनुमान चालीसा और सुन्दरकाण्ड का पाठ करें। सिन्दूर, तेल और फूल अर्पित करें।',
    },
    significance: {
      en: 'Celebrates the embodiment of devotion (Bhakti), strength (Shakti), and selfless service (Seva). Hanuman represents the ideal devotee — powerful yet humble.',
      hi: 'भक्ति, शक्ति और निःस्वार्थ सेवा के मूर्तिमान रूप का उत्सव। हनुमान आदर्श भक्त हैं — शक्तिशाली किन्तु विनम्र।',
      sa: 'भक्तेः शक्तेः निःस्वार्थसेवायाः च मूर्तिमतः उत्सवः।',
      mr: 'भक्ति, शक्ति और निःस्वार्थ सेवा के मूर्तिमान रूप का उत्सव। हनुमान आदर्श भक्त हैं — शक्तिशाली किन्तु विनम्र।',
      mai: 'भक्ति, शक्ति और निःस्वार्थ सेवा के मूर्तिमान रूप का उत्सव। हनुमान आदर्श भक्त हैं — शक्तिशाली किन्तु विनम्र।',
    },
    deity: { en: 'Lord Hanuman', hi: 'हनुमान जी', sa: 'हनुमान्', ta: 'ஹனுமான்', te: 'హనుమాన్', bn: 'হনুমান', kn: 'ಹನುಮಾನ್', gu: 'હનુમાન', mr: 'हनुमान जी', mai: 'हनुमान जी' },
  },

  'guru-purnima': {
    name: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा', sa: 'गुरुपूर्णिमा', ta: 'குரு பூர்ணிமா', te: 'గురు పూర్ణిమ', bn: 'গুরু পূর্ণিমা', kn: 'ಗುರು ಪೂರ್ಣಿಮಾ', gu: 'ગુરુ પૂર્ણિમા', mr: 'गुरु पूर्णिमा', mai: 'गुरु पूर्णिमा' },
    mythology: {
      en: 'This day honours Sage Vyasa (Krishna Dvaipayana), who compiled the Vedas, authored the Mahabharata, and organized the Puranas. It is also the day Lord Shiva, as Adi Guru (first teacher), began transmitting yoga to the Saptarishis (seven sages).',
      hi: 'यह दिन व्यास मुनि का सम्मान करता है, जिन्होंने वेदों का संकलन, महाभारत की रचना और पुराणों का संगठन किया। इस दिन शिव ने आदि गुरु के रूप में सप्तर्षियों को योग सिखाना आरम्भ किया।',
      sa: 'एतत् दिनं व्यासमुनिं सम्मानयति यः वेदान् संकलितवान् महाभारतम् अरचयत् पुराणानि च संगठितवान्।',
      mr: 'यह दिन व्यास मुनि का सम्मान करता है, जिन्होंने वेदों का संकलन, महाभारत की रचना और पुराणों का संगठन किया। इस दिन शिव ने आदि गुरु के रूप में सप्तर्षियों को योग सिखाना आरम्भ किया।',
      mai: 'यह दिन व्यास मुनि का सम्मान करता है, जिन्होंने वेदों का संकलन, महाभारत की रचना और पुराणों का संगठन किया। इस दिन शिव ने आदि गुरु के रूप में सप्तर्षियों को योग सिखाना आरम्भ किया।',
    },
    observance: {
      en: 'Express gratitude to your teachers and mentors. Perform Guru Puja. Offer flowers, fruits, and dakshina. Recite Guru Stotram. Many spiritual traditions hold special discourses on this day.',
      hi: 'अपने शिक्षकों और गुरुओं के प्रति कृतज्ञता व्यक्त करें। गुरु पूजा करें। फूल, फल और दक्षिणा अर्पित करें।',
      sa: 'आचार्यान् प्रति कृतज्ञतां व्यक्तीकुरुतु। गुरुपूजां करोतु।',
      mr: 'अपने शिक्षकों और गुरुओं के प्रति कृतज्ञता व्यक्त करें। गुरु पूजा करें। फूल, फल और दक्षिणा अर्पित करें।',
      mai: 'अपने शिक्षकों और गुरुओं के प्रति कृतज्ञता व्यक्त करें। गुरु पूजा करें। फूल, फल और दक्षिणा अर्पित करें।',
    },
    significance: {
      en: 'The full moon of Ashadha is dedicated to the Guru principle — the remover of darkness (Gu = darkness, Ru = remover). Also called Vyasa Purnima.',
      hi: 'आषाढ़ की पूर्णिमा गुरु तत्व को समर्पित है — अन्धकार का निवारक (गु = अन्धकार, रु = निवारक)।',
      sa: 'आषाढपूर्णिमा गुरुतत्त्वाय समर्पिता — अन्धकारस्य निवारकः (गु = अन्धकारः, रु = निवारकः)।',
      mr: 'आषाढ़ की पूर्णिमा गुरु तत्व को समर्पित है — अन्धकार का निवारक (गु = अन्धकार, रु = निवारक)।',
      mai: 'आषाढ़ की पूर्णिमा गुरु तत्व को समर्पित है — अन्धकार का निवारक (गु = अन्धकार, रु = निवारक)।',
    },
    deity: { en: 'Sage Vyasa / The Guru', hi: 'वेदव्यास / गुरु', sa: 'वेदव्यासः / गुरुः', ta: 'வியாசர் / குரு', te: 'వేదవ్యాసుడు / గురువు', bn: 'বেদব্যাস / গুরু', kn: 'ವೇದವ್ಯಾಸ / ಗುರು', gu: 'વેદવ્યાસ / ગુરુ', mr: 'वेदव्यास / गुरु', mai: 'वेदव्यास / गुरु' },
  },

  'raksha-bandhan': {
    name: { en: 'Raksha Bandhan', hi: 'रक्षाबन्धन', sa: 'रक्षाबन्धनम्', ta: 'ரக்ஷா பந்தன்', te: 'రక్షా బంధన్', bn: 'রক্ষা বন্ধন', kn: 'ರಕ್ಷಾ ಬಂಧನ', gu: 'રક્ષા બંધન', mr: 'रक्षाबन्धन', mai: 'रक्षाबन्धन' },
    mythology: {
      en: 'In the Bhagavata Purana, when Lord Vishnu won the three worlds from King Bali, Lakshmi tied a thread on Bali\'s wrist. Moved by this gesture, Bali asked for a wish — and Lakshmi asked for Vishnu\'s return. In another tradition, Draupadi tore a strip of her sari to bandage Krishna\'s wounded wrist, and he pledged to protect her.',
      hi: 'भागवत पुराण में, जब विष्णु ने राजा बलि से तीनों लोक जीते, लक्ष्मी ने बलि की कलाई पर धागा बाँधा। द्रौपदी ने कृष्ण के घायल कलाई पर अपनी साड़ी का टुकड़ा बाँधा, और कृष्ण ने उनकी रक्षा का वचन दिया।',
      sa: 'भागवतपुराणे विष्णुः राज्ञः बलेः त्रीन् लोकान् अजयत्। लक्ष्मीः बलेः कलायां सूत्रम् अबध्नात्।',
      mr: 'भागवत पुराण में, जब विष्णु ने राजा बलि से तीनों लोक जीते, लक्ष्मी ने बलि की कलाई पर धागा बाँधा। द्रौपदी ने कृष्ण के घायल कलाई पर अपनी साड़ी का टुकड़ा बाँधा, और कृष्ण ने उनकी रक्षा का वचन दिया।',
      mai: 'भागवत पुराण में, जब विष्णु ने राजा बलि से तीनों लोक जीते, लक्ष्मी ने बलि की कलाई पर धागा बाँधा। द्रौपदी ने कृष्ण के घायल कलाई पर अपनी साड़ी का टुकड़ा बाँधा, और कृष्ण ने उनकी रक्षा का वचन दिया।',
    },
    observance: {
      en: 'Sisters tie a decorative thread (Rakhi) on brothers\' wrists, apply tilak, offer sweets, and pray for their well-being. Brothers give gifts and pledge to protect their sisters. Today the festival extends beyond blood relations to all bonds of protection.',
      hi: 'बहनें भाइयों की कलाई पर राखी बाँधती हैं, तिलक लगाती हैं, मिठाई खिलाती हैं। भाई उपहार देते हैं और रक्षा का वचन देते हैं।',
      sa: 'भगिन्यः भ्रातृणां कलायां राखीं बध्नन्ति, तिलकं लगयन्ति, मिष्टान्नं यच्छन्ति।',
      mr: 'बहनें भाइयों की कलाई पर राखी बाँधती हैं, तिलक लगाती हैं, मिठाई खिलाती हैं। भाई उपहार देते हैं और रक्षा का वचन देते हैं।',
      mai: 'बहनें भाइयों की कलाई पर राखी बाँधती हैं, तिलक लगाती हैं, मिठाई खिलाती हैं। भाई उपहार देते हैं और रक्षा का वचन देते हैं।',
    },
    significance: {
      en: 'Celebrates the sacred bond between siblings and the duty of protection. The Rakhi thread symbolizes love, trust, and the sister\'s prayer for her brother\'s long life.',
      hi: 'भाई-बहन के पवित्र बन्धन और रक्षा के कर्तव्य का उत्सव।',
      sa: 'भ्रातृभगिन्योः पवित्रबन्धनस्य रक्षाकर्तव्यस्य च उत्सवः।',
      mr: 'भाई-बहन के पवित्र बन्धन और रक्षा के कर्तव्य का उत्सव।',
      mai: 'भाई-बहन के पवित्र बन्धन और रक्षा के कर्तव्य का उत्सव।',
    },
    deity: { en: 'Lakshmi / Krishna', hi: 'लक्ष्मी / कृष्ण', sa: 'लक्ष्मीः / कृष्णः', ta: 'லக்ஷ்மி / கிருஷ்ணர்', te: 'లక్ష్మీ / కృష్ణుడు', bn: 'লক্ষ্মী / কৃষ্ণ', kn: 'ಲಕ್ಷ್ಮಿ / ಕೃಷ್ಣ', gu: 'લક્ષ્મી / કૃષ્ણ', mr: 'लक्ष्मी / कृष्ण', mai: 'लक्ष्मी / कृष्ण' },
  },

  'janmashtami': {
    name: { en: 'Janmashtami', hi: 'जन्माष्टमी', sa: 'जन्माष्टमी', ta: 'ஜன்மாஷ்டமி', te: 'జన్మాష్టమి', bn: 'জন্মাষ্টমী', kn: 'ಜನ್ಮಾಷ್ಟಮಿ', gu: 'જન્માષ્ટમી', mr: 'जन्माष्टमी', mai: 'जन्माष्टमी' },
    mythology: {
      en: 'Lord Krishna was born at midnight in a prison cell in Mathura to Devaki and Vasudeva. The tyrant king Kamsa had imprisoned them after a prophecy that Devaki\'s eighth child would kill him. At Krishna\'s birth, all guards fell asleep, chains broke, and Vasudeva carried the divine baby across the flooding Yamuna river to safety in Gokul.',
      hi: 'भगवान कृष्ण का जन्म मथुरा की कारागार में मध्यरात्रि को देवकी और वसुदेव के घर हुआ। अत्याचारी कंस ने भविष्यवाणी के बाद उन्हें कैद किया था। कृष्ण के जन्म पर सभी पहरेदार सो गए, बेड़ियाँ टूट गईं।',
      sa: 'कृष्णः मथुरायां कारागारे मध्यरात्रौ देवक्याः वसुदेवस्य च गृहे जातः।',
      mr: 'भगवान कृष्ण का जन्म मथुरा की कारागार में मध्यरात्रि को देवकी और वसुदेव के घर हुआ। अत्याचारी कंस ने भविष्यवाणी के बाद उन्हें कैद किया था। कृष्ण के जन्म पर सभी पहरेदार सो गए, बेड़ियाँ टूट गईं।',
      mai: 'भगवान कृष्ण का जन्म मथुरा की कारागार में मध्यरात्रि को देवकी और वसुदेव के घर हुआ। अत्याचारी कंस ने भविष्यवाणी के बाद उन्हें कैद किया था। कृष्ण के जन्म पर सभी पहरेदार सो गए, बेड़ियाँ टूट गईं।',
    },
    observance: {
      en: 'Fast all day until midnight (when Krishna was born). Perform puja at midnight with songs and bhajans. Prepare 56 dishes (Chhappan Bhog) as offering. Swing a cradle with baby Krishna\'s idol. Break fast after midnight puja with prasad.',
      hi: 'मध्यरात्रि तक उपवास (कृष्ण का जन्म समय)। मध्यरात्रि में भजन-कीर्तन के साथ पूजा। 56 भोग तैयार करें। बाल कृष्ण की मूर्ति को झूला झुलाएँ।',
      sa: 'मध्यरात्रिपर्यन्तं व्रतम्। मध्यरात्रौ भजनकीर्तनैः सह पूजा। छप्पनभोगं सज्जयतु।',
      mr: 'मध्यरात्रि तक उपवास (कृष्ण का जन्म समय)। मध्यरात्रि में भजन-कीर्तन के साथ पूजा। 56 भोग तैयार करें। बाल कृष्ण की मूर्ति को झूला झुलाएँ।',
      mai: 'मध्यरात्रि तक उपवास (कृष्ण का जन्म समय)। मध्यरात्रि में भजन-कीर्तन के साथ पूजा। 56 भोग तैयार करें। बाल कृष्ण की मूर्ति को झूला झुलाएँ।',
    },
    significance: {
      en: 'Birth of the Supreme Being who spoke the Bhagavad Gita. Krishna embodies divine love (Prema), cosmic wisdom (Jnana), and righteous action (Karma Yoga). The midnight birth symbolizes light emerging in the darkest hour.',
      hi: 'भगवद्गीता के वक्ता परमात्मा का जन्म। कृष्ण दिव्य प्रेम, ब्रह्माण्डीय ज्ञान और कर्मयोग के प्रतीक हैं।',
      sa: 'भगवद्गीतावक्तुः परमात्मनः जन्म। कृष्णः दिव्यप्रेमस्य ज्ञानस्य कर्मयोगस्य च प्रतीकः।',
      mr: 'भगवद्गीता के वक्ता परमात्मा का जन्म। कृष्ण दिव्य प्रेम, ब्रह्माण्डीय ज्ञान और कर्मयोग के प्रतीक हैं।',
      mai: 'भगवद्गीता के वक्ता परमात्मा का जन्म। कृष्ण दिव्य प्रेम, ब्रह्माण्डीय ज्ञान और कर्मयोग के प्रतीक हैं।',
    },
    deity: { en: 'Lord Krishna', hi: 'भगवान कृष्ण', sa: 'श्रीकृष्णः', ta: 'ஸ்ரீ கிருஷ்ணர்', te: 'శ్రీకృష్ణుడు', bn: 'শ্রীকৃষ্ণ', kn: 'ಶ್ರೀಕೃಷ್ಣ', gu: 'શ્રી કૃષ્ણ', mr: 'भगवान कृष्ण', mai: 'भगवान कृष्ण' },
    isFast: true,
    fastNote: { en: 'Strict fast until midnight. Break with prasad after midnight puja and Abhishek.', hi: 'मध्यरात्रि तक कठोर व्रत। मध्यरात्रि पूजा के बाद प्रसाद से पारण।', sa: 'मध्यरात्रिपर्यन्तं कठोरव्रतम्। अभिषेकानन्तरं प्रसादेन पारणम्।', mr: 'मध्यरात्रि तक कठोर व्रत। मध्यरात्रि पूजा के बाद प्रसाद से पारण।', mai: 'मध्यरात्रि तक कठोर व्रत। मध्यरात्रि पूजा के बाद प्रसाद से पारण।' },
  },

  'ganesh-chaturthi': {
    name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', sa: 'गणेशचतुर्थी', ta: 'விநாயகர் சதுர்த்தி', te: 'వినాయక చవితి', bn: 'গণেশ চতুর্থী', kn: 'ಗಣೇಶ ಚತುರ್ಥಿ', gu: 'ગણેશ ચતુર્થી', mr: 'गणेश चतुर्थी', mai: 'गणेश चतुर्थी' },
    mythology: {
      en: 'Goddess Parvati created Ganesha from sandalwood paste and breathed life into him, setting him as guard while she bathed. When Shiva returned, Ganesha blocked his entry. Shiva, not knowing who the boy was, beheaded him in anger. To console Parvati, Shiva replaced his head with that of an elephant and declared him the leader (Ganapati) of his ganas.',
      hi: 'देवी पार्वती ने चन्दन के लेप से गणेश की रचना की और उनमें प्राण फूँके। जब शिव लौटे, गणेश ने उन्हें रोका। शिव ने क्रोध में उनका सिर काट दिया। पार्वती को शान्त करने के लिए शिव ने हाथी का सिर लगाया।',
      sa: 'पार्वतीदेवी चन्दनलेपात् गणेशम् अरचयत्। शिवः क्रोधेन तस्य शिरः अच्छिनत्। गजशिरः स्थापितवान्।',
      mr: 'देवी पार्वती ने चन्दन के लेप से गणेश की रचना की और उनमें प्राण फूँके। जब शिव लौटे, गणेश ने उन्हें रोका। शिव ने क्रोध में उनका सिर काट दिया। पार्वती को शान्त करने के लिए शिव ने हाथी का सिर लगाया।',
      mai: 'देवी पार्वती ने चन्दन के लेप से गणेश की रचना की और उनमें प्राण फूँके। जब शिव लौटे, गणेश ने उन्हें रोका। शिव ने क्रोध में उनका सिर काट दिया। पार्वती को शान्त करने के लिए शिव ने हाथी का सिर लगाया।',
    },
    observance: {
      en: 'Install a Ganesha idol (clay/eco-friendly) at home. Perform daily puja for 1.5 / 3 / 5 / 7 / 10 days. Offer modak (sweet dumplings), durva grass, and red flowers. Conclude with Visarjan (immersion) in a water body with processions.',
      hi: 'घर में गणेश प्रतिमा (मिट्टी) स्थापित करें। 1.5 / 3 / 5 / 7 / 10 दिन पूजा करें। मोदक, दूर्वा और लाल फूल चढ़ाएँ। जुलूस के साथ विसर्जन करें।',
      sa: 'गृहे गणेशप्रतिमां स्थापयतु। मोदकं दूर्वां रक्तपुष्पाणि च अर्पयतु। विसर्जनं करोतु।',
      mr: 'घर में गणेश प्रतिमा (मिट्टी) स्थापित करें। 1.5 / 3 / 5 / 7 / 10 दिन पूजा करें। मोदक, दूर्वा और लाल फूल चढ़ाएँ। जुलूस के साथ विसर्जन करें।',
      mai: 'घर में गणेश प्रतिमा (मिट्टी) स्थापित करें। 1.5 / 3 / 5 / 7 / 10 दिन पूजा करें। मोदक, दूर्वा और लाल फूल चढ़ाएँ। जुलूस के साथ विसर्जन करें।',
    },
    significance: {
      en: 'Lord of new beginnings, remover of obstacles (Vighnaharta). Worshipped before all undertakings. The festival celebrates wisdom, prosperity, and the power of devotion.',
      hi: 'नई शुरुआत के देवता, विघ्नहर्ता। सभी कार्यों से पहले पूजित। ज्ञान, समृद्धि और भक्ति की शक्ति का उत्सव।',
      sa: 'नवारम्भस्य देवः, विघ्नहर्ता। सर्वकार्याणां पूर्वं पूजितः।',
      mr: 'नई शुरुआत के देवता, विघ्नहर्ता। सभी कार्यों से पहले पूजित। ज्ञान, समृद्धि और भक्ति की शक्ति का उत्सव।',
      mai: 'नई शुरुआत के देवता, विघ्नहर्ता। सभी कार्यों से पहले पूजित। ज्ञान, समृद्धि और भक्ति की शक्ति का उत्सव।',
    },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'गणेशः', ta: 'விநாயகர்', te: 'గణేశుడు', bn: 'গণেশ', kn: 'ಗಣೇಶ', gu: 'ગણેશ', mr: 'भगवान गणेश', mai: 'भगवान गणेश' },
  },

  'navaratri': {
    name: { en: 'Navaratri (Sharad)', hi: 'शारदीय नवरात्रि', sa: 'शारदीयनवरात्रिः', ta: 'நவராத்திரி (சரத்)', te: 'నవరాత్రి (శరత్)', bn: 'নবরাত্রি (শরৎ)', kn: 'ನವರಾತ್ರಿ (ಶರದ್)', gu: 'નવરાત્રી (શરદ)', mr: 'शारदीय नवरात्रि', mai: 'शारदीय नवरात्रि' },
    mythology: {
      en: 'The demon Mahishasura, after a boon from Brahma that no man or god could kill him, conquered the three worlds. The combined energy of all gods manifested as Goddess Durga. She battled Mahishasura for nine nights and slew him on the tenth day (Vijayadashami). Each night is dedicated to a different form of the Goddess (Navadurga).',
      hi: 'महिषासुर ने ब्रह्मा से वरदान पाकर तीनों लोकों पर विजय प्राप्त की। सभी देवताओं की संयुक्त ऊर्जा से देवी दुर्गा प्रकट हुईं। उन्होंने नौ रातों तक महिषासुर से युद्ध किया और दसवें दिन उसका वध किया।',
      sa: 'महिषासुरः ब्रह्मणः वरदानं प्राप्य त्रीन् लोकान् अजयत्। सर्वदेवानां संयुक्तशक्तिः दुर्गादेवीरूपेण प्राकट्यत।',
      mr: 'महिषासुर ने ब्रह्मा से वरदान पाकर तीनों लोकों पर विजय प्राप्त की। सभी देवताओं की संयुक्त ऊर्जा से देवी दुर्गा प्रकट हुईं। उन्होंने नौ रातों तक महिषासुर से युद्ध किया और दसवें दिन उसका वध किया।',
      mai: 'महिषासुर ने ब्रह्मा से वरदान पाकर तीनों लोकों पर विजय प्राप्त की। सभी देवताओं की संयुक्त ऊर्जा से देवी दुर्गा प्रकट हुईं। उन्होंने नौ रातों तक महिषासुर से युद्ध किया और दसवें दिन उसका वध किया।',
    },
    observance: {
      en: 'Nine nights of Goddess worship with specific forms each day: Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kaalratri, Mahagauri, Siddhidatri. Fasting, Garba/Dandiya dancing (Gujarat), recitation of Durga Saptashati. Many observe strict fasting for all 9 days.',
      hi: 'नौ रातों में देवी के नौ रूपों की पूजा। उपवास, गरबा/डाण्डिया (गुजरात), दुर्गा सप्तशती का पाठ। कई लोग पूरे 9 दिन कठोर व्रत रखते हैं।',
      sa: 'नवरात्रिषु देव्याः नवरूपाणां पूजनम्। व्रतम्, दुर्गासप्तशतीपाठः।',
      mr: 'नौ रातों में देवी के नौ रूपों की पूजा। उपवास, गरबा/डाण्डिया (गुजरात), दुर्गा सप्तशती का पाठ। कई लोग पूरे 9 दिन कठोर व्रत रखते हैं।',
      mai: 'नौ रातों में देवी के नौ रूपों की पूजा। उपवास, गरबा/डाण्डिया (गुजरात), दुर्गा सप्तशती का पाठ। कई लोग पूरे 9 दिन कठोर व्रत रखते हैं।',
    },
    significance: {
      en: 'Victory of divine feminine power (Shakti) over evil. Each of the nine forms represents a different aspect of feminine energy — from ferocity to compassion.',
      hi: 'दैवी स्त्री शक्ति (शक्ति) की बुराई पर विजय। नौ रूपों में से प्रत्येक स्त्री ऊर्जा के एक भिन्न पहलू का प्रतिनिधित्व करता है।',
      sa: 'दैवीशक्तेः दुष्टतोपरि विजयः। नवरूपाणि स्त्रीशक्तेः विभिन्नपक्षान् प्रतिनिधयन्ति।',
      mr: 'दैवी स्त्री शक्ति (शक्ति) की बुराई पर विजय। नौ रूपों में से प्रत्येक स्त्री ऊर्जा के एक भिन्न पहलू का प्रतिनिधित्व करता है।',
      mai: 'दैवी स्त्री शक्ति (शक्ति) की बुराई पर विजय। नौ रूपों में से प्रत्येक स्त्री ऊर्जा के एक भिन्न पहलू का प्रतिनिधित्व करता है।',
    },
    deity: { en: 'Goddess Durga (Navadurga)', hi: 'देवी दुर्गा (नवदुर्गा)', sa: 'दुर्गादेवी (नवदुर्गा)', ta: 'துர்கா தேவி (நவதுர்கா)', te: 'దుర్గా దేవి (నవదుర్గ)', bn: 'দুর্গা দেবী (নবদুর্গা)', kn: 'ದುರ್ಗಾ ದೇವಿ (ನವದುರ್ಗಾ)', gu: 'દુર્ગા દેવી (નવદુર્ગા)', mr: 'देवी दुर्गा (नवदुर्गा)', mai: 'देवी दुर्गा (नवदुर्गा)' },
    isFast: true,
    fastNote: { en: 'Many observe a 9-day fast (fruits, sabudana, kuttu atta). Some fast only on the first and last day.', hi: 'कई लोग 9 दिन व्रत रखते हैं (फल, साबूदाना, कुट्टू)। कुछ केवल पहले और अन्तिम दिन।', sa: 'बहवः 9 दिनानि व्रतं धारयन्ति।', mr: 'कई लोग 9 दिन व्रत रखते हैं (फल, साबूदाना, कुट्टू)। कुछ केवल पहले और अन्तिम दिन।', mai: 'कई लोग 9 दिन व्रत रखते हैं (फल, साबूदाना, कुट्टू)। कुछ केवल पहले और अन्तिम दिन।' },
  },

  'dussehra': {
    name: { en: 'Dussehra', hi: 'दशहरा', sa: 'विजयादशमी', ta: 'தசரா', te: 'దసరా', bn: 'দশেরা', kn: 'ದಸರಾ', gu: 'દશેરા', mr: 'दशहरा', mai: 'दशहरा' },
    mythology: {
      en: 'Lord Rama vanquished the ten-headed Ravana on this day after a fierce battle, rescuing Sita from Lanka. In another tradition, Goddess Durga slayed the buffalo demon Mahishasura on this tenth day (Vijayadashami). Both stories celebrate the triumph of righteousness.',
      hi: 'भगवान राम ने इस दिन भयंकर युद्ध के बाद दशानन रावण का वध किया और सीता को लंका से मुक्त कराया। एक अन्य परम्परा में, देवी दुर्गा ने इसी दसवें दिन महिषासुर का वध किया।',
      sa: 'श्रीरामः अस्मिन् दिने दशाननं रावणं जघान सीतां च अमोचयत्।',
      mr: 'भगवान राम ने इस दिन भयंकर युद्ध के बाद दशानन रावण का वध किया और सीता को लंका से मुक्त कराया। एक अन्य परम्परा में, देवी दुर्गा ने इसी दसवें दिन महिषासुर का वध किया।',
      mai: 'भगवान राम ने इस दिन भयंकर युद्ध के बाद दशानन रावण का वध किया और सीता को लंका से मुक्त कराया। एक अन्य परम्परा में, देवी दुर्गा ने इसी दसवें दिन महिषासुर का वध किया।',
    },
    observance: {
      en: 'Burn effigies of Ravana, Meghanada, and Kumbhakarna. Perform Shastra Puja (worship of weapons/tools). Exchange Apta leaves (symbolizing gold). In Bengal, it marks Durga Visarjan. Ram Lila performances conclude on this day.',
      hi: 'रावण, मेघनाद और कुम्भकर्ण के पुतले जलाएँ। शस्त्र पूजा करें। आपटा पत्ते (सोने का प्रतीक) बाँटें। बंगाल में दुर्गा विसर्जन होता है।',
      sa: 'रावणमेघनादकुम्भकर्णपुत्तलिकाः दहतु। शस्त्रपूजां करोतु।',
      mr: 'रावण, मेघनाद और कुम्भकर्ण के पुतले जलाएँ। शस्त्र पूजा करें। आपटा पत्ते (सोने का प्रतीक) बाँटें। बंगाल में दुर्गा विसर्जन होता है।',
      mai: 'रावण, मेघनाद और कुम्भकर्ण के पुतले जलाएँ। शस्त्र पूजा करें। आपटा पत्ते (सोने का प्रतीक) बाँटें। बंगाल में दुर्गा विसर्जन होता है।',
    },
    significance: {
      en: 'Vijayadashami — the "tenth day of victory". Considered the most auspicious day to begin new ventures, buy property, or start learning. The burning of Ravana symbolizes the destruction of the ten vices (ego, greed, lust, etc.).',
      hi: 'विजयादशमी — "विजय का दसवाँ दिन"। नए कार्य आरम्भ करने का सर्वाधिक शुभ दिन। रावण दहन दस दुर्गुणों के नाश का प्रतीक है।',
      sa: 'विजयादशमी — "विजयस्य दशमं दिनम्"। नवकार्याणि आरम्भितुं शुभतमं दिनम्।',
      mr: 'विजयादशमी — "विजय का दसवाँ दिन"। नए कार्य आरम्भ करने का सर्वाधिक शुभ दिन। रावण दहन दस दुर्गुणों के नाश का प्रतीक है।',
      mai: 'विजयादशमी — "विजय का दसवाँ दिन"। नए कार्य आरम्भ करने का सर्वाधिक शुभ दिन। रावण दहन दस दुर्गुणों के नाश का प्रतीक है।',
    },
    deity: { en: 'Lord Rama / Goddess Durga', hi: 'भगवान राम / देवी दुर्गा', sa: 'श्रीरामः / दुर्गादेवी', ta: 'ராமர் / துர்கா தேவி', te: 'శ్రీరాముడు / దుర్గా దేవి', bn: 'শ্রীরাম / দুর্গা দেবী', kn: 'ಶ್ರೀರಾಮ / ದುರ್ಗಾ ದೇವಿ', gu: 'રામ / દુર્ગા દેવી', mr: 'भगवान राम / देवी दुर्गा', mai: 'भगवान राम / देवी दुर्गा' },
  },

  'diwali': {
    name: { en: 'Diwali', hi: 'दीपावली', sa: 'दीपावलिः', ta: 'தீபாவளி', te: 'దీపావళి', bn: 'দীপাবলি', kn: 'ದೀಪಾವಳಿ', gu: 'દિવાળી', mr: 'दीपावली', mai: 'दीपावली' },
    mythology: {
      en: 'Lord Rama returned to Ayodhya after 14 years of exile and his victory over Ravana. The citizens lit thousands of oil lamps (diyas) to welcome him, illuminating the moonless night of Kartika Amavasya. In another tradition, Lakshmi emerged from the Samudra Manthan (ocean churning) on this night and is worshipped for wealth and prosperity.',
      hi: 'भगवान राम 14 वर्ष के वनवास और रावण पर विजय के बाद अयोध्या लौटे। नागरिकों ने हज़ारों दीप जलाकर उनका स्वागत किया। एक अन्य परम्परा में, लक्ष्मी समुद्र मन्थन से इसी रात्रि प्रकट हुईं।',
      sa: 'श्रीरामः 14 वर्षाणां वनवासात् रावणविजयानन्तरं अयोध्यां प्रत्यागतः। नागरिकाः सहस्रशः दीपान् प्रज्वाल्य तम् अस्वागन्।',
      mr: 'भगवान राम 14 वर्ष के वनवास और रावण पर विजय के बाद अयोध्या लौटे। नागरिकों ने हज़ारों दीप जलाकर उनका स्वागत किया। एक अन्य परम्परा में, लक्ष्मी समुद्र मन्थन से इसी रात्रि प्रकट हुईं।',
      mai: 'भगवान राम 14 वर्ष के वनवास और रावण पर विजय के बाद अयोध्या लौटे। नागरिकों ने हज़ारों दीप जलाकर उनका स्वागत किया। एक अन्य परम्परा में, लक्ष्मी समुद्र मन्थन से इसी रात्रि प्रकट हुईं।',
    },
    observance: {
      en: 'Five-day celebration: Dhanteras (buy gold/utensils), Naraka Chaturdashi (pre-dawn oil bath), Diwali (Lakshmi Puja at night, light diyas, burst crackers), Govardhan Puja (worship food mountains), Bhai Dooj (sister-brother bond). Clean and decorate homes, make rangoli, wear new clothes.',
      hi: 'पाँच दिनों का उत्सव: धनतेरस, नरक चतुर्दशी, दीपावली (लक्ष्मी पूजा, दीप जलाएँ), गोवर्धन पूजा, भाई दूज। घर की सफाई, रंगोली, नए वस्त्र।',
      sa: 'पञ्चदिनानाम् उत्सवः: धनत्रयोदशी, नरकचतुर्दशी, दीपावलिः, गोवर्धनपूजा, भ्रातृद्वितीया।',
      mr: 'पाँच दिनों का उत्सव: धनतेरस, नरक चतुर्दशी, दीपावली (लक्ष्मी पूजा, दीप जलाएँ), गोवर्धन पूजा, भाई दूज। घर की सफाई, रंगोली, नए वस्त्र।',
      mai: 'पाँच दिनों का उत्सव: धनतेरस, नरक चतुर्दशी, दीपावली (लक्ष्मी पूजा, दीप जलाएँ), गोवर्धन पूजा, भाई दूज। घर की सफाई, रंगोली, नए वस्त्र।',
    },
    significance: {
      en: 'The festival of lights — the triumph of light over darkness, knowledge over ignorance, good over evil. The darkest night (Amavasya) is illuminated, symbolizing hope and renewal. Also marks the Hindu new year in many traditions.',
      hi: 'प्रकाश का त्योहार — अन्धकार पर प्रकाश, अज्ञान पर ज्ञान, बुराई पर अच्छाई की विजय। सबसे अन्धेरी रात (अमावस्या) को प्रकाशित किया जाता है।',
      sa: 'दीपानाम् उत्सवः — अन्धकारोपरि प्रकाशस्य, अज्ञानोपरि ज्ञानस्य, असत्योपरि सत्यस्य विजयः।',
      mr: 'प्रकाश का त्योहार — अन्धकार पर प्रकाश, अज्ञान पर ज्ञान, बुराई पर अच्छाई की विजय। सबसे अन्धेरी रात (अमावस्या) को प्रकाशित किया जाता है।',
      mai: 'प्रकाश का त्योहार — अन्धकार पर प्रकाश, अज्ञान पर ज्ञान, बुराई पर अच्छाई की विजय। सबसे अन्धेरी रात (अमावस्या) को प्रकाशित किया जाता है।',
    },
    deity: { en: 'Goddess Lakshmi, Lord Rama, Lord Ganesha', hi: 'देवी लक्ष्मी, भगवान राम, भगवान गणेश', sa: 'लक्ष्मीः, श्रीरामः, गणेशः', ta: 'லக்ஷ்மி, ராமர், விநாயகர்', te: 'లక్ష్మీ, శ్రీరాముడు, గణేశుడు', bn: 'লক্ষ্মী, রাম, গণেশ', kn: 'ಲಕ್ಷ್ಮಿ, ರಾಮ, ಗಣೇಶ', gu: 'લક્ષ્મી, રામ, ગણેશ', mr: 'देवी लक्ष्मी, भगवान राम, भगवान गणेश', mai: 'देवी लक्ष्मी, भगवान राम, भगवान गणेश' },
  },

  // ── Additional Festivals ──

  'ratha-saptami': {
    name: { en: 'Ratha Saptami', hi: 'रथ सप्तमी', sa: 'रथसप्तमी', ta: 'ரத சப்தமி', te: 'రథ సప్తమి', bn: 'রথ সপ্তমী', kn: 'ರಥ ಸಪ್ತಮಿ', gu: 'રથ સપ્તમી', mr: 'रथ सप्तमी', mai: 'रथ सप्तमी' },
    mythology: {
      en: 'Ratha Saptami celebrates the birth of Surya, the Sun God, and marks the day he began his northward chariot journey across the sky drawn by seven horses representing the seven days of the week. The Bhavishya Purana describes this as the day Surya\'s radiance first illuminated the universe, dispelling primordial darkness.',
      hi: 'रथ सप्तमी सूर्य देव के जन्म का उत्सव है। इस दिन सूर्य ने सात अश्वों वाले रथ पर उत्तर दिशा की यात्रा आरम्भ की। भविष्य पुराण के अनुसार इस दिन सूर्य की किरणों ने सर्वप्रथम ब्रह्माण्ड को प्रकाशित किया।',
      sa: 'रथसप्तमी सूर्यस्य जन्मोत्सवः। अस्मिन् दिने सूर्यः सप्ताश्वरथेन उत्तरदिशायां यात्राम् आरभत। भविष्यपुराणानुसारं सूर्यरश्मयः सर्वप्रथमं ब्रह्माण्डम् अप्रकाशयन्।',
      mr: 'रथ सप्तमी सूर्य देव के जन्म का उत्सव है। इस दिन सूर्य ने सात अश्वों वाले रथ पर उत्तर दिशा की यात्रा आरम्भ की। भविष्य पुराण के अनुसार इस दिन सूर्य की किरणों ने सर्वप्रथम ब्रह्माण्ड को प्रकाशित किया।',
      mai: 'रथ सप्तमी सूर्य देव के जन्म का उत्सव है। इस दिन सूर्य ने सात अश्वों वाले रथ पर उत्तर दिशा की यात्रा आरम्भ की। भविष्य पुराण के अनुसार इस दिन सूर्य की किरणों ने सर्वप्रथम ब्रह्माण्ड को प्रकाशित किया।',
    },
    observance: {
      en: 'Devotees rise before dawn and bathe with Arka (Calotropis) leaves placed on the head and shoulders, symbolizing purification by the Sun. Surya Namaskar is performed facing the rising sun. Offerings of red flowers, wheat, and jaggery are made. Many observe a fast and recite the Aditya Hridayam stotra.',
      hi: 'भक्त सूर्योदय से पूर्व आक के पत्ते सिर और कन्धों पर रखकर स्नान करते हैं। सूर्य नमस्कार किया जाता है। लाल फूल, गेहूँ और गुड़ अर्पित करते हैं। आदित्य हृदयम् स्तोत्र का पाठ होता है।',
      sa: 'भक्ताः प्रातः अर्कपत्रैः शिरसि स्कन्धयोः च स्थापयित्वा स्नानं कुर्वन्ति। सूर्यनमस्कारः क्रियते। रक्तपुष्पाणि गोधूमं गुडं च अर्प्यते।',
      mr: 'भक्त सूर्योदय से पूर्व आक के पत्ते सिर और कन्धों पर रखकर स्नान करते हैं। सूर्य नमस्कार किया जाता है। लाल फूल, गेहूँ और गुड़ अर्पित करते हैं। आदित्य हृदयम् स्तोत्र का पाठ होता है।',
      mai: 'भक्त सूर्योदय से पूर्व आक के पत्ते सिर और कन्धों पर रखकर स्नान करते हैं। सूर्य नमस्कार किया जाता है। लाल फूल, गेहूँ और गुड़ अर्पित करते हैं। आदित्य हृदयम् स्तोत्र का पाठ होता है।',
    },
    significance: {
      en: 'Ratha Saptami marks the symbolic birthday of Surya and the quickening of spring. It is believed that bathing with Arka leaves absolves sins of seven lifetimes. The festival underscores the Sun\'s role as the sustainer of all life and the source of health and vitality.',
      hi: 'रथ सप्तमी सूर्य के प्रतीकात्मक जन्मदिवस और वसन्त आगमन का सूचक है। आक के पत्तों से स्नान सात जन्मों के पापों का नाश करता है।',
      sa: 'रथसप्तमी सूर्यस्य प्रतीकात्मकजन्मदिनं वसन्तागमनस्य च सूचकम्। अर्कपत्रस्नानेन सप्तजन्मनां पापानि नश्यन्ति।',
      mr: 'रथ सप्तमी सूर्य के प्रतीकात्मक जन्मदिवस और वसन्त आगमन का सूचक है। आक के पत्तों से स्नान सात जन्मों के पापों का नाश करता है।',
      mai: 'रथ सप्तमी सूर्य के प्रतीकात्मक जन्मदिवस और वसन्त आगमन का सूचक है। आक के पत्तों से स्नान सात जन्मों के पापों का नाश करता है।',
    },
    deity: { en: 'Surya (Sun God)', hi: 'सूर्य देव', sa: 'सूर्यदेवः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য দেব', kn: 'ಸೂರ್ಯ ದೇವ', gu: 'સૂર્ય દેવ', mr: 'सूर्य देव', mai: 'सूर्य देव' },
  },

  'bhishma-ashtami': {
    name: { en: 'Bhishma Ashtami', hi: 'भीष्म अष्टमी', sa: 'भीष्माष्टमी', ta: 'பீஷ்ம அஷ்டமி', te: 'భీష్మ అష్టమి', bn: 'ভীষ্ম অষ্টমী', kn: 'ಭೀಷ್ಮ ಅಷ್ಟಮಿ', gu: 'ભીષ્મ અષ્ટમી', mr: 'भीष्म अष्टमी', mai: 'भीष्म अष्टमी' },
    mythology: {
      en: 'Bhishma Ashtami honours the great warrior Bhishma Pitamah of the Mahabharata, son of King Shantanu and Goddess Ganga. After being fatally wounded by Arjuna, Bhishma lay on a bed of arrows and chose to depart on this day during Uttarayana, exercising his boon of Iccha Mrityu (death at will). His selfless vow of lifelong celibacy (Bhishma Pratigya) and unwavering dharma make him one of the most revered figures in Hindu tradition.',
      hi: 'भीष्म अष्टमी महाभारत के महान योद्धा भीष्म पितामह को समर्पित है। राजा शान्तनु और गंगा देवी के पुत्र भीष्म ने शर-शय्या पर उत्तरायण की प्रतीक्षा कर इच्छा मृत्यु का वरदान प्रयोग किया। उनकी आजीवन ब्रह्मचर्य प्रतिज्ञा और धर्मनिष्ठा अतुलनीय है।',
      sa: 'भीष्माष्टमी महाभारतस्य महायोद्धारं भीष्मपितामहं सम्मानयति। शान्तनुनृपस्य गङ्गादेव्याः च पुत्रः भीष्मः शरशय्यायां उत्तरायणे इच्छामृत्युवरं प्रायुङ्क्त।',
      mr: 'भीष्म अष्टमी महाभारत के महान योद्धा भीष्म पितामह को समर्पित है। राजा शान्तनु और गंगा देवी के पुत्र भीष्म ने शर-शय्या पर उत्तरायण की प्रतीक्षा कर इच्छा मृत्यु का वरदान प्रयोग किया। उनकी आजीवन ब्रह्मचर्य प्रतिज्ञा और धर्मनिष्ठा अतुलनीय है।',
      mai: 'भीष्म अष्टमी महाभारत के महान योद्धा भीष्म पितामह को समर्पित है। राजा शान्तनु और गंगा देवी के पुत्र भीष्म ने शर-शय्या पर उत्तरायण की प्रतीक्षा कर इच्छा मृत्यु का वरदान प्रयोग किया। उनकी आजीवन ब्रह्मचर्य प्रतिज्ञा और धर्मनिष्ठा अतुलनीय है।',
    },
    observance: {
      en: 'Devotees perform Tarpan (water libation) for Bhishma, even those without departed ancestors, as he died without progeny. Sesame seeds and water are offered while facing the north. Recitation of Bhishma Stuti and Vishnu Sahasranama — which Bhishma narrated from his deathbed — is considered highly meritorious.',
      hi: 'भक्त भीष्म के लिए तर्पण करते हैं — यह बिना सन्तान के गये व्यक्ति के लिए भी किया जाता है। उत्तर दिशा की ओर मुख कर तिल और जल अर्पित करते हैं। भीष्म स्तुति और विष्णु सहस्रनाम का पाठ होता है।',
      sa: 'भक्ताः भीष्मार्थं तर्पणं कुर्वन्ति। उत्तरदिशाभिमुखाः तिलजलम् अर्पयन्ति। भीष्मस्तुतिः विष्णुसहस्रनामपाठश्च क्रियते।',
      mr: 'भक्त भीष्म के लिए तर्पण करते हैं — यह बिना सन्तान के गये व्यक्ति के लिए भी किया जाता है। उत्तर दिशा की ओर मुख कर तिल और जल अर्पित करते हैं। भीष्म स्तुति और विष्णु सहस्रनाम का पाठ होता है।',
      mai: 'भक्त भीष्म के लिए तर्पण करते हैं — यह बिना सन्तान के गये व्यक्ति के लिए भी किया जाता है। उत्तर दिशा की ओर मुख कर तिल और जल अर्पित करते हैं। भीष्म स्तुति और विष्णु सहस्रनाम का पाठ होता है।',
    },
    significance: {
      en: 'Bhishma Ashtami teaches the values of sacrifice, unwavering resolve, and adherence to one\'s vow (Pratigya). Offering Tarpan on this day is believed to be equivalent to offering it to all ancestors. It is the only day when Tarpan is offered to someone who was neither a father nor a direct ancestor.',
      hi: 'भीष्म अष्टमी त्याग, दृढ़ संकल्प और प्रतिज्ञापालन का सन्देश देती है। इस दिन तर्पण करना सभी पितरों के तर्पण के समान माना जाता है।',
      sa: 'भीष्माष्टमी त्यागस्य दृढसंकल्पस्य प्रतिज्ञापालनस्य च सन्देशं ददाति। अस्मिन् दिने तर्पणं सर्वेषां पितृणां तर्पणसमम्।',
      mr: 'भीष्म अष्टमी त्याग, दृढ़ संकल्प और प्रतिज्ञापालन का सन्देश देती है। इस दिन तर्पण करना सभी पितरों के तर्पण के समान माना जाता है।',
      mai: 'भीष्म अष्टमी त्याग, दृढ़ संकल्प और प्रतिज्ञापालन का सन्देश देती है। इस दिन तर्पण करना सभी पितरों के तर्पण के समान माना जाता है।',
    },
    deity: { en: 'Bhishma Pitamah, Lord Vishnu', hi: 'भीष्म पितामह, भगवान विष्णु', sa: 'भीष्मपितामहः, विष्णुः', ta: 'பீஷ்ம பிதாமகர், விஷ்ணு', te: 'భీష్మ పితామహుడు, విష్ణువు', bn: 'ভীষ্ম পিতামহ, বিষ্ণু', kn: 'ಭೀಷ್ಮ ಪಿತಾಮಹ, ವಿಷ್ಣು', gu: 'ભીષ્મ પિતામહ, વિષ્ણુ', mr: 'भीष्म पितामह, भगवान विष्णु', mai: 'भीष्म पितामह, भगवान विष्णु' },
  },

  'chaitra-navratri': {
    name: { en: 'Chaitra Navratri', hi: 'चैत्र नवरात्रि', sa: 'चैत्रनवरात्रिः', ta: 'சைத்ர நவராத்திரி', te: 'చైత్ర నవరాత్రి', bn: 'চৈত্র নবরাত্রি', kn: 'ಚೈತ್ರ ನವರಾತ್ರಿ', gu: 'ચૈત્ર નવરાત્રી', mr: 'चैत्र नवरात्रि', mai: 'चैत्र नवरात्रि' },
    mythology: {
      en: 'Chaitra Navratri commemorates the nine nights of worship of Goddess Durga in the month of Chaitra. According to the Devi Mahatmyam, the Goddess manifested in nine forms (Navadurga) to vanquish the demon Mahishasura. This Navratri also marks the beginning of the Hindu new year (Vikram Samvat) and is when Lord Rama\'s birth is celebrated on the ninth day (Ram Navami).',
      hi: 'चैत्र नवरात्रि चैत्र मास में देवी दुर्गा की नौ रातों की उपासना है। देवीमाहात्म्य के अनुसार देवी ने नवदुर्गा रूपों में महिषासुर का वध किया। यह हिन्दू नववर्ष (विक्रम संवत्) का आरम्भ भी है और नवमी को राम नवमी मनायी जाती है।',
      sa: 'चैत्रनवरात्रिः चैत्रमासे दुर्गादेव्याः नवरात्रोपासना। देवीमाहात्म्यानुसारं देवी नवदुर्गारूपैः महिषासुरं निहतवती। नवम्यां श्रीरामजन्म उत्सवः।',
      mr: 'चैत्र नवरात्रि चैत्र मास में देवी दुर्गा की नौ रातों की उपासना है। देवीमाहात्म्य के अनुसार देवी ने नवदुर्गा रूपों में महिषासुर का वध किया। यह हिन्दू नववर्ष (विक्रम संवत्) का आरम्भ भी है और नवमी को राम नवमी मनायी जाती है।',
      mai: 'चैत्र नवरात्रि चैत्र मास में देवी दुर्गा की नौ रातों की उपासना है। देवीमाहात्म्य के अनुसार देवी ने नवदुर्गा रूपों में महिषासुर का वध किया। यह हिन्दू नववर्ष (विक्रम संवत्) का आरम्भ भी है और नवमी को राम नवमी मनायी जाती है।',
    },
    observance: {
      en: 'On the first day (Pratipada), perform Ghatasthapana — install a sacred Kalash with mango leaves and a coconut, sow barley seeds in a pot of soil. Worship a different form of Navadurga each day. Recite Durga Saptashati. Many observe a strict nine-day fast. Conclude with Kanya Puja (honouring nine young girls) and Ram Navami celebrations.',
      hi: 'प्रतिपदा को घटस्थापना करें — कलश में आम के पत्ते और नारियल स्थापित करें, मिट्टी में जौ बोएँ। प्रतिदिन नवदुर्गा के एक रूप की पूजा करें। दुर्गा सप्तशती का पाठ करें। नौ दिन व्रत रखें। कन्या पूजन से समापन करें।',
      sa: 'प्रतिपदायां घटस्थापनं कुर्यात् — कलशे आम्रपत्राणि नारिकेलं च स्थापयेत्। प्रतिदिनं नवदुर्गायाः एकं रूपं पूजयेत्। दुर्गासप्तशतीपाठः।',
      mr: 'प्रतिपदा को घटस्थापना करें — कलश में आम के पत्ते और नारियल स्थापित करें, मिट्टी में जौ बोएँ। प्रतिदिन नवदुर्गा के एक रूप की पूजा करें। दुर्गा सप्तशती का पाठ करें। नौ दिन व्रत रखें। कन्या पूजन से समापन करें।',
      mai: 'प्रतिपदा को घटस्थापना करें — कलश में आम के पत्ते और नारियल स्थापित करें, मिट्टी में जौ बोएँ। प्रतिदिन नवदुर्गा के एक रूप की पूजा करें। दुर्गा सप्तशती का पाठ करें। नौ दिन व्रत रखें। कन्या पूजन से समापन करें।',
    },
    significance: {
      en: 'Chaitra Navratri marks the beginning of the Hindu new year and the arrival of spring (Vasanta). It is considered the most auspicious time for new beginnings, spiritual practices, and invoking the Goddess\'s blessings. The nine nights represent the triumph of Shakti (divine feminine energy) over evil.',
      hi: 'चैत्र नवरात्रि हिन्दू नववर्ष और वसन्त आगमन का प्रतीक है। नई शुरुआत, साधना और देवी कृपा के लिए सबसे शुभ समय माना जाता है।',
      sa: 'चैत्रनवरात्रिः हिन्दूनवसंवत्सरस्य वसन्तागमनस्य च प्रतीकः। नवारम्भार्थं साधनार्थं च शुभतमः कालः।',
      mr: 'चैत्र नवरात्रि हिन्दू नववर्ष और वसन्त आगमन का प्रतीक है। नई शुरुआत, साधना और देवी कृपा के लिए सबसे शुभ समय माना जाता है।',
      mai: 'चैत्र नवरात्रि हिन्दू नववर्ष और वसन्त आगमन का प्रतीक है। नई शुरुआत, साधना और देवी कृपा के लिए सबसे शुभ समय माना जाता है।',
    },
    deity: { en: 'Goddess Durga (Navadurga)', hi: 'देवी दुर्गा (नवदुर्गा)', sa: 'दुर्गादेवी (नवदुर्गा)', ta: 'துர்கா தேவி (நவதுர்கா)', te: 'దుర్గా దేవి (నవదుర్గ)', bn: 'দুর্গা দেবী (নবদুর্গা)', kn: 'ದುರ್ಗಾ ದೇವಿ (ನವದುರ್ಗಾ)', gu: 'દુર્ગા દેવી (નવદુર્ગા)', mr: 'देवी दुर्गा (नवदुर्गा)', mai: 'देवी दुर्गा (नवदुर्गा)' },
    isFast: true,
    fastNote: { en: 'Nine-day fast on fruits, sabudana, and kuttu atta. Some fast only on first and last days. Break fast after Kanya Puja on Navami.', hi: 'नौ दिन फल, साबूदाना और कुट्टू का व्रत। कुछ लोग केवल पहले और अन्तिम दिन व्रत रखते हैं।', sa: 'नवदिनानि फलैः साबूदानेन च व्रतम्। केचित् प्रथमे अन्तिमे च दिने व्रतं धारयन्ति।', mr: 'नौ दिन फल, साबूदाना और कुट्टू का व्रत। कुछ लोग केवल पहले और अन्तिम दिन व्रत रखते हैं।', mai: 'नौ दिन फल, साबूदाना और कुट्टू का व्रत। कुछ लोग केवल पहले और अन्तिम दिन व्रत रखते हैं।' },
  },

  'akshaya-tritiya': {
    name: { en: 'Akshaya Tritiya', hi: 'अक्षय तृतीया', sa: 'अक्षयतृतीया', ta: 'அக்ஷய திருதியை', te: 'అక్షయ తృతీయ', bn: 'অক্ষয় তৃতীয়া', kn: 'ಅಕ್ಷಯ ತೃತೀಯ', gu: 'અક્ષય તૃતીયા', mr: 'अक्षय तृतीया', mai: 'अक्षय तृतीया' },
    mythology: {
      en: 'On this day, Veda Vyasa began composing the Mahabharata with Lord Ganesha as his scribe. In the Puranas, this is when the Treta Yuga began and when Lord Parashurama — the sixth avatar of Vishnu — was born. It is also the day Kubera received his wealth from Lord Shiva, and Sudama visited Lord Krishna and received boundless prosperity.',
      hi: 'इस दिन वेद व्यास ने गणेश जी को लिखाते हुए महाभारत की रचना आरम्भ की। इसी दिन त्रेतायुग का आरम्भ हुआ, परशुराम का जन्म हुआ, कुबेर को शिव से धन प्राप्त हुआ और सुदामा ने कृष्ण से अक्षय ऐश्वर्य पाया।',
      sa: 'अस्मिन् दिने वेदव्यासः गणेशेन सह महाभारतरचनाम् आरभत। त्रेतायुगस्य आरम्भः, परशुरामजन्म, कुबेरस्य शिवात् धनप्राप्तिः, सुदाम्नः कृष्णात् अक्षयैश्वर्यलाभश्च अस्मिन् दिने अभवत्।',
      mr: 'इस दिन वेद व्यास ने गणेश जी को लिखाते हुए महाभारत की रचना आरम्भ की। इसी दिन त्रेतायुग का आरम्भ हुआ, परशुराम का जन्म हुआ, कुबेर को शिव से धन प्राप्त हुआ और सुदामा ने कृष्ण से अक्षय ऐश्वर्य पाया।',
      mai: 'इस दिन वेद व्यास ने गणेश जी को लिखाते हुए महाभारत की रचना आरम्भ की। इसी दिन त्रेतायुग का आरम्भ हुआ, परशुराम का जन्म हुआ, कुबेर को शिव से धन प्राप्त हुआ और सुदामा ने कृष्ण से अक्षय ऐश्वर्य पाया।',
    },
    observance: {
      en: 'Purchase gold, silver, or new property — it is believed that anything acquired on this day grows infinitely (Akshaya means imperishable). Perform charity and donate food. Begin new ventures, investments, or griha pravesh. Offer prayers to Lord Vishnu and Goddess Lakshmi.',
      hi: 'सोना, चाँदी या नयी सम्पत्ति खरीदें — इस दिन प्राप्त वस्तु अक्षय (अविनाशी) होती है। दान करें, अन्नदान करें। नए कार्य, निवेश या गृहप्रवेश आरम्भ करें।',
      sa: 'सुवर्णं रजतं नवसम्पत्तिं वा क्रीणातु — अस्मिन् दिने प्राप्तं सर्वम् अक्षयं भवति। दानं अन्नदानं च कुर्यात्।',
      mr: 'सोना, चाँदी या नयी सम्पत्ति खरीदें — इस दिन प्राप्त वस्तु अक्षय (अविनाशी) होती है। दान करें, अन्नदान करें। नए कार्य, निवेश या गृहप्रवेश आरम्भ करें।',
      mai: 'सोना, चाँदी या नयी सम्पत्ति खरीदें — इस दिन प्राप्त वस्तु अक्षय (अविनाशी) होती है। दान करें, अन्नदान करें। नए कार्य, निवेश या गृहप्रवेश आरम्भ करें।',
    },
    significance: {
      en: 'Akshaya Tritiya is one of the most auspicious days in the Hindu calendar — every moment is a Muhurta, requiring no separate auspicious time calculation. It is a self-auspicious (Swayam Siddha Muhurta) day. Any act of charity, worship, or new beginning on this day yields imperishable results.',
      hi: 'अक्षय तृतीया हिन्दू कैलेंडर के सबसे शुभ दिनों में से एक है — प्रत्येक क्षण मुहूर्त है, अलग शुभ मुहूर्त की आवश्यकता नहीं। यह स्वयंसिद्ध मुहूर्त दिवस है।',
      sa: 'अक्षयतृतीया हिन्दूपञ्चाङ्गस्य शुभतमेषु दिनेषु अन्यतमा — प्रत्येकं क्षणं मुहूर्तः। स्वयंसिद्धमुहूर्तदिनम्।',
      mr: 'अक्षय तृतीया हिन्दू कैलेंडर के सबसे शुभ दिनों में से एक है — प्रत्येक क्षण मुहूर्त है, अलग शुभ मुहूर्त की आवश्यकता नहीं। यह स्वयंसिद्ध मुहूर्त दिवस है।',
      mai: 'अक्षय तृतीया हिन्दू कैलेंडर के सबसे शुभ दिनों में से एक है — प्रत्येक क्षण मुहूर्त है, अलग शुभ मुहूर्त की आवश्यकता नहीं। यह स्वयंसिद्ध मुहूर्त दिवस है।',
    },
    deity: { en: 'Lord Vishnu, Goddess Lakshmi, Lord Parashurama', hi: 'भगवान विष्णु, देवी लक्ष्मी, परशुराम', sa: 'विष्णुः, लक्ष्मीः, परशुरामः', ta: 'விஷ்ணு, லக்ஷ்மி, பரசுராமர்', te: 'విష్ణువు, లక్ష్మీ, పరశురాముడు', bn: 'বিষ্ণু, লক্ষ্মী, পরশুরাম', kn: 'ವಿಷ್ಣು, ಲಕ್ಷ್ಮಿ, ಪರಶುರಾಮ', gu: 'વિષ્ણુ, લક્ષ્મી, પરશુરામ', mr: 'भगवान विष्णु, देवी लक्ष्मी, परशुराम', mai: 'भगवान विष्णु, देवी लक्ष्मी, परशुराम' },
  },

  'buddha-purnima': {
    name: { en: 'Buddha Purnima', hi: 'बुद्ध पूर्णिमा', sa: 'बुद्धपूर्णिमा', ta: 'புத்த பூர்ணிமா', te: 'బుద్ధ పూర్ణిమ', bn: 'বুদ্ধ পূর্ণিমা', kn: 'ಬುದ್ಧ ಪೂರ್ಣಿಮಾ', gu: 'બુદ્ધ પૂર્ણિમા', mr: 'बुद्ध पूर्णिमा', mai: 'बुद्ध पूर्णिमा' },
    mythology: {
      en: 'Buddha Purnima celebrates the three most significant events in Gautama Buddha\'s life — all of which occurred on a Vaishakha Purnima: his birth in Lumbini, his attainment of Bodhi (enlightenment) under the Bodhi tree in Bodh Gaya, and his Mahaparinirvana (passing) in Kushinagar. In Hindu tradition, Buddha is revered as the ninth avatar of Lord Vishnu.',
      hi: 'बुद्ध पूर्णिमा गौतम बुद्ध के जीवन की तीन प्रमुख घटनाओं का उत्सव है — जन्म, बोधिप्राप्ति और महापरिनिर्वाण — तीनों वैशाख पूर्णिमा को हुईं। हिन्दू परम्परा में बुद्ध को विष्णु का नवम अवतार माना जाता है।',
      sa: 'बुद्धपूर्णिमा गौतमबुद्धस्य जन्मबोधिमहापरिनिर्वाणत्रयस्य उत्सवः — सर्वाणि वैशाखपूर्णिमायां अभवन्। हिन्दूपरम्परायां बुद्धः विष्णोः नवमावतारः।',
      mr: 'बुद्ध पूर्णिमा गौतम बुद्ध के जीवन की तीन प्रमुख घटनाओं का उत्सव है — जन्म, बोधिप्राप्ति और महापरिनिर्वाण — तीनों वैशाख पूर्णिमा को हुईं। हिन्दू परम्परा में बुद्ध को विष्णु का नवम अवतार माना जाता है।',
      mai: 'बुद्ध पूर्णिमा गौतम बुद्ध के जीवन की तीन प्रमुख घटनाओं का उत्सव है — जन्म, बोधिप्राप्ति और महापरिनिर्वाण — तीनों वैशाख पूर्णिमा को हुईं। हिन्दू परम्परा में बुद्ध को विष्णु का नवम अवतार माना जाता है।',
    },
    observance: {
      en: 'Visit Buddhist temples and monasteries. Offer prayers, light lamps, and meditate on the teachings of the Buddha. Devotees observe the Pancha Shila (five precepts) with particular devotion. In Hindu practice, worship Lord Vishnu in his Buddha avatar. Acts of compassion, charity, and non-violence are emphasised.',
      hi: 'बौद्ध विहारों में दर्शन करें, दीप जलाएँ और ध्यान करें। पञ्चशील का विशेष पालन करें। हिन्दू परम्परा में बुद्ध अवतार की पूजा करें। करुणा, दान और अहिंसा पर बल दें।',
      sa: 'बौद्धविहारेषु दर्शनं, दीपप्रज्वालनं, ध्यानं च कुर्यात्। पञ्चशीलं विशेषतः पालयेत्। करुणा दानं अहिंसा च आचरेत्।',
      mr: 'बौद्ध विहारों में दर्शन करें, दीप जलाएँ और ध्यान करें। पञ्चशील का विशेष पालन करें। हिन्दू परम्परा में बुद्ध अवतार की पूजा करें। करुणा, दान और अहिंसा पर बल दें।',
      mai: 'बौद्ध विहारों में दर्शन करें, दीप जलाएँ और ध्यान करें। पञ्चशील का विशेष पालन करें। हिन्दू परम्परा में बुद्ध अवतार की पूजा करें। करुणा, दान और अहिंसा पर बल दें।',
    },
    significance: {
      en: 'Buddha Purnima celebrates the supreme embodiment of wisdom, compassion, and the middle path. It reminds humanity that enlightenment is attainable through right effort and meditation. The Vaishakha full moon is considered one of the most spiritually potent nights of the year.',
      hi: 'बुद्ध पूर्णिमा ज्ञान, करुणा और मध्यम मार्ग का परम प्रतीक है। यह स्मरण कराती है कि सम्यक् प्रयास से बोधि प्राप्त हो सकती है।',
      sa: 'बुद्धपूर्णिमा ज्ञानस्य करुणायाः मध्यममार्गस्य च परमप्रतीकः। सम्यक्प्रयासेन बोधिः प्राप्तुं शक्या इति स्मारयति।',
      mr: 'बुद्ध पूर्णिमा ज्ञान, करुणा और मध्यम मार्ग का परम प्रतीक है। यह स्मरण कराती है कि सम्यक् प्रयास से बोधि प्राप्त हो सकती है।',
      mai: 'बुद्ध पूर्णिमा ज्ञान, करुणा और मध्यम मार्ग का परम प्रतीक है। यह स्मरण कराती है कि सम्यक् प्रयास से बोधि प्राप्त हो सकती है।',
    },
    deity: { en: 'Gautama Buddha (Vishnu Avatar)', hi: 'गौतम बुद्ध (विष्णु अवतार)', sa: 'गौतमबुद्धः (विष्णावतारः)', ta: 'கௌதம புத்தர் (விஷ்ணு அவதாரம்)', te: 'గౌతమ బుద్ధుడు (విష్ణు అవతారం)', bn: 'গৌতম বুদ্ধ (বিষ্ণু অবতার)', kn: 'ಗೌತಮ ಬುದ್ಧ (ವಿಷ್ಣು ಅವತಾರ)', gu: 'ગૌતમ બુદ્ધ (વિષ્ણુ અવતાર)', mr: 'गौतम बुद्ध (विष्णु अवतार)', mai: 'गौतम बुद्ध (विष्णु अवतार)' },
  },

  'ganga-dussehra': {
    name: { en: 'Ganga Dussehra', hi: 'गंगा दशहरा', sa: 'गङ्गादशहरा', ta: 'கங்கா தசரா', te: 'గంగా దసరా', bn: 'গঙ্গা দশেরা', kn: 'ಗಂಗಾ ದಸರಾ', gu: 'ગંગા દશેરા', mr: 'गंगा दशहरा', mai: 'गंगा दशहरा' },
    mythology: {
      en: 'Ganga Dussehra commemorates the descent of the sacred river Ganga from heaven to earth. King Bhagiratha performed intense tapas for thousands of years to bring Ganga down to liberate the souls of his sixty thousand ancestors (the sons of King Sagara) who had been reduced to ashes by Sage Kapila\'s gaze. Lord Shiva caught the mighty torrent of Ganga in his matted locks (Jata) to prevent the earth from being shattered by her force.',
      hi: 'गंगा दशहरा गंगा नदी के स्वर्ग से पृथ्वी पर अवतरण का उत्सव है। राजा भगीरथ ने हज़ारों वर्ष तपस्या कर गंगा को पृथ्वी पर लाया, जिससे सगर पुत्रों की आत्माओं को मुक्ति मिले। शिव ने गंगा के प्रचण्ड प्रवाह को अपनी जटाओं में धारण किया।',
      sa: 'गङ्गादशहरा गङ्गानद्याः स्वर्गात् पृथिवीम् अवतरणस्य उत्सवः। भगीरथनृपः सहस्रवर्षं तपः कृत्वा गङ्गां पृथिवीम् आनयत्। शिवः गङ्गाप्रवाहं स्वजटासु अधारयत्।',
      mr: 'गंगा दशहरा गंगा नदी के स्वर्ग से पृथ्वी पर अवतरण का उत्सव है। राजा भगीरथ ने हज़ारों वर्ष तपस्या कर गंगा को पृथ्वी पर लाया, जिससे सगर पुत्रों की आत्माओं को मुक्ति मिले। शिव ने गंगा के प्रचण्ड प्रवाह को अपनी जटाओं में धारण किया।',
      mai: 'गंगा दशहरा गंगा नदी के स्वर्ग से पृथ्वी पर अवतरण का उत्सव है। राजा भगीरथ ने हज़ारों वर्ष तपस्या कर गंगा को पृथ्वी पर लाया, जिससे सगर पुत्रों की आत्माओं को मुक्ति मिले। शिव ने गंगा के प्रचण्ड प्रवाह को अपनी जटाओं में धारण किया।',
    },
    observance: {
      en: 'Bathe in the Ganga or any sacred river. Offer ten items (Dashahara means destroyer of ten sins): flowers, incense, lamps, sacred food, and more. Perform Ganga Aarti, especially at Haridwar, Varanasi, and Prayagraj. Donate food, clothes, and sesame seeds. Light floating diyas on the river.',
      hi: 'गंगा या किसी पवित्र नदी में स्नान करें। दस वस्तुएँ अर्पित करें (दशहरा = दस पापों का नाश)। गंगा आरती करें। अन्न, वस्त्र और तिल का दान करें। नदी में दीप प्रवाहित करें।',
      sa: 'गङ्गायां पवित्रनद्यां वा स्नानं कुर्यात्। दशवस्तूनि अर्पयेत्। गङ्गाआरतिं कुर्यात्। अन्नवस्त्रतिलदानं कुर्यात्।',
      mr: 'गंगा या किसी पवित्र नदी में स्नान करें। दस वस्तुएँ अर्पित करें (दशहरा = दस पापों का नाश)। गंगा आरती करें। अन्न, वस्त्र और तिल का दान करें। नदी में दीप प्रवाहित करें।',
      mai: 'गंगा या किसी पवित्र नदी में स्नान करें। दस वस्तुएँ अर्पित करें (दशहरा = दस पापों का नाश)। गंगा आरती करें। अन्न, वस्त्र और तिल का दान करें। नदी में दीप प्रवाहित करें।',
    },
    significance: {
      en: 'Ganga Dussehra destroys ten types of sins (Dasha-hara). Bathing in the Ganga on this day is considered equivalent to bathing at all sacred tirthas. The festival celebrates the purifying power of the Ganga, whose waters are believed to bestow moksha and cleanse even the most grievous karmic debts.',
      hi: 'गंगा दशहरा दस प्रकार के पापों का नाश करती है। इस दिन गंगा स्नान सभी तीर्थों के स्नान के समान माना जाता है। गंगा की पवित्रता और मोक्षदायिनी शक्ति का उत्सव है।',
      sa: 'गङ्गादशहरा दशविधपापानि नाशयति। अस्मिन् दिने गङ्गास्नानं सर्वतीर्थस्नानसमम्। गङ्गायाः पवित्रता मोक्षदायिनीशक्तिश्च उत्सव्यते।',
      mr: 'गंगा दशहरा दस प्रकार के पापों का नाश करती है। इस दिन गंगा स्नान सभी तीर्थों के स्नान के समान माना जाता है। गंगा की पवित्रता और मोक्षदायिनी शक्ति का उत्सव है।',
      mai: 'गंगा दशहरा दस प्रकार के पापों का नाश करती है। इस दिन गंगा स्नान सभी तीर्थों के स्नान के समान माना जाता है। गंगा की पवित्रता और मोक्षदायिनी शक्ति का उत्सव है।',
    },
    deity: { en: 'Goddess Ganga, Lord Shiva', hi: 'देवी गंगा, भगवान शिव', sa: 'गङ्गादेवी, शिवः', ta: 'கங்கா தேவி, சிவன்', te: 'గంగా దేవి, శివుడు', bn: 'গঙ্গা দেবী, শিব', kn: 'ಗಂಗಾ ದೇವಿ, ಶಿವ', gu: 'ગંગા દેવી, શિવ', mr: 'देवी गंगा, भगवान शिव', mai: 'देवी गंगा, भगवान शिव' },
  },

  'nag-panchami': {
    name: { en: 'Nag Panchami', hi: 'नाग पञ्चमी', sa: 'नागपञ्चमी', ta: 'நாக பஞ்சமி', te: 'నాగ పంచమి', bn: 'নাগ পঞ্চমী', kn: 'ನಾಗ ಪಂಚಮಿ', gu: 'નાગ પંચમી', mr: 'नाग पञ्चमी', mai: 'नाग पञ्चमी' },
    mythology: {
      en: 'Nag Panchami is rooted in the Puranic reverence for serpent deities (Nagas). In the Mahabharata, King Janamejaya performed a great Sarpa Satra (serpent sacrifice) to avenge his father Parikshit\'s death by Takshaka. The sage Astika intervened and stopped the sacrifice, saving the Naga race — this event is commemorated on Nag Panchami. Serpents are also revered as ornaments of Lord Shiva (Vasuki around his neck) and as the cosmic bed of Lord Vishnu (Shesha Naga).',
      hi: 'नाग पञ्चमी नाग देवताओं की पूजा का पर्व है। महाभारत में राजा जनमेजय ने तक्षक से बदला लेने सर्प-यज्ञ किया, जिसे ऋषि आस्तीक ने रोककर नागवंश की रक्षा की। नाग शिव के आभूषण (वासुकि) और विष्णु की शय्या (शेषनाग) हैं।',
      sa: 'नागपञ्चमी नागदेवतापूजनपर्वम्। महाभारते जनमेजयनृपः सर्पसत्रम् अकरोत्, आस्तीकमुनिः तत् अवारयत् नागवंशं च अरक्षत्। नागाः शिवस्य आभूषणं विष्णोः शय्या च।',
      mr: 'नाग पञ्चमी नाग देवताओं की पूजा का पर्व है। महाभारत में राजा जनमेजय ने तक्षक से बदला लेने सर्प-यज्ञ किया, जिसे ऋषि आस्तीक ने रोककर नागवंश की रक्षा की। नाग शिव के आभूषण (वासुकि) और विष्णु की शय्या (शेषनाग) हैं।',
      mai: 'नाग पञ्चमी नाग देवताओं की पूजा का पर्व है। महाभारत में राजा जनमेजय ने तक्षक से बदला लेने सर्प-यज्ञ किया, जिसे ऋषि आस्तीक ने रोककर नागवंश की रक्षा की। नाग शिव के आभूषण (वासुकि) और विष्णु की शय्या (शेषनाग) हैं।',
    },
    observance: {
      en: 'Offer milk, turmeric, rice, and flowers at snake anthills or Naga idols. Draw serpent images on the doorstep with turmeric or sandalwood paste. Do not dig the earth or plough fields on this day. Recite Naga Stotras. Many women observe a fast and pray for the well-being of their families. Live snakes are venerated in some regions.',
      hi: 'साँप की बाँबी या नाग प्रतिमा पर दूध, हल्दी, चावल और फूल चढ़ाएँ। द्वार पर हल्दी या चन्दन से नाग चित्र बनाएँ। इस दिन पृथ्वी न खोदें। नाग स्तोत्र पढ़ें। महिलाएँ परिवार कल्याण के लिए व्रत रखती हैं।',
      sa: 'सर्पवल्मीके नागप्रतिमायां वा क्षीरं हरिद्रां तण्डुलं पुष्पाणि च अर्पयेत्। द्वारे हरिद्रया चन्दनेन वा नागचित्रं रचयेत्। भूमिं न खनेत्।',
      mr: 'साँप की बाँबी या नाग प्रतिमा पर दूध, हल्दी, चावल और फूल चढ़ाएँ। द्वार पर हल्दी या चन्दन से नाग चित्र बनाएँ। इस दिन पृथ्वी न खोदें। नाग स्तोत्र पढ़ें। महिलाएँ परिवार कल्याण के लिए व्रत रखती हैं।',
      mai: 'साँप की बाँबी या नाग प्रतिमा पर दूध, हल्दी, चावल और फूल चढ़ाएँ। द्वार पर हल्दी या चन्दन से नाग चित्र बनाएँ। इस दिन पृथ्वी न खोदें। नाग स्तोत्र पढ़ें। महिलाएँ परिवार कल्याण के लिए व्रत रखती हैं।',
    },
    significance: {
      en: 'Nag Panchami honours the Nagas as protectors of the earth and keepers of the underworld (Patala). Snakes symbolize Kundalini energy, fertility, and cosmic power. Worshipping them is believed to protect from snakebite, grant progeny, and remove Kala Sarpa Dosha from one\'s horoscope.',
      hi: 'नाग पञ्चमी नागों को पृथ्वी के रक्षक और पाताल के अधिपति के रूप में सम्मानित करती है। नाग कुण्डलिनी शक्ति और सन्तान का प्रतीक हैं। कालसर्प दोष निवारण में सहायक।',
      sa: 'नागपञ्चमी नागान् पृथिव्याः रक्षकान् पातालाधिपतीन् च सम्मानयति। नागाः कुण्डलिनीशक्तेः सन्तानस्य च प्रतीकाः।',
      mr: 'नाग पञ्चमी नागों को पृथ्वी के रक्षक और पाताल के अधिपति के रूप में सम्मानित करती है। नाग कुण्डलिनी शक्ति और सन्तान का प्रतीक हैं। कालसर्प दोष निवारण में सहायक।',
      mai: 'नाग पञ्चमी नागों को पृथ्वी के रक्षक और पाताल के अधिपति के रूप में सम्मानित करती है। नाग कुण्डलिनी शक्ति और सन्तान का प्रतीक हैं। कालसर्प दोष निवारण में सहायक।',
    },
    deity: { en: 'Naga Devatas (Vasuki, Shesha, Takshaka)', hi: 'नाग देवता (वासुकि, शेष, तक्षक)', sa: 'नागदेवताः (वासुकिः, शेषः, तक्षकः)', ta: 'நாக தேவதைகள் (வாசுகி, சேஷன், தக்ஷகன்)', te: 'నాగ దేవతలు (వాసుకి, శేషుడు, తక్షకుడు)', bn: 'নাগ দেবতা (বাসুকি, শেষ, তক্ষক)', kn: 'ನಾಗ ದೇವತೆಗಳು (ವಾಸುಕಿ, ಶೇಷ, ತಕ್ಷಕ)', gu: 'નાગ દેવતા (વાસુકિ, શેષ, તક્ષક)', mr: 'नाग देवता (वासुकि, शेष, तक्षक)', mai: 'नाग देवता (वासुकि, शेष, तक्षक)' },
  },

  'hariyali-teej': {
    name: { en: 'Hariyali Teej', hi: 'हरियाली तीज', sa: 'हरितालिकातीजः', ta: 'ஹரியாளி தீஜ்', te: 'హరియాలీ తీజ్', bn: 'হরিয়ালি তীজ', kn: 'ಹರಿಯಾಳಿ ತೀಜ್', gu: 'હરિયાળી તીજ', mr: 'हरियाली तीज', mai: 'हरियाली तीज' },
    mythology: {
      en: 'Hariyali Teej celebrates the reunion of Goddess Parvati with Lord Shiva after her intense penance. According to the Shiva Purana, Parvati performed severe austerities for years, refusing food and water, to win Shiva as her husband. Pleased by her devotion, Shiva accepted her, and they were married during the monsoon season. The festival also celebrates the lush green (Hariyali) splendour of the rainy season.',
      hi: 'हरियाली तीज देवी पार्वती और शिव के पुनर्मिलन का उत्सव है। शिव पुराण के अनुसार पार्वती ने कठोर तपस्या कर शिव को पति रूप में प्राप्त किया। यह सावन की हरियाली और सुहाग का त्योहार है।',
      sa: 'हरितालिकातीजः पार्वत्याः शिवेन सह पुनर्मिलनस्य उत्सवः। शिवपुराणानुसारं पार्वती कठोरतपसा शिवं पतित्वेन प्राप्तवती। श्रावणस्य हरितशोभायाः उत्सवः।',
      mr: 'हरियाली तीज देवी पार्वती और शिव के पुनर्मिलन का उत्सव है। शिव पुराण के अनुसार पार्वती ने कठोर तपस्या कर शिव को पति रूप में प्राप्त किया। यह सावन की हरियाली और सुहाग का त्योहार है।',
      mai: 'हरियाली तीज देवी पार्वती और शिव के पुनर्मिलन का उत्सव है। शिव पुराण के अनुसार पार्वती ने कठोर तपस्या कर शिव को पति रूप में प्राप्त किया। यह सावन की हरियाली और सुहाग का त्योहार है।',
    },
    observance: {
      en: 'Married women dress in green attire and new bangles, apply mehndi (henna), and ride decorated swings. They observe a nirjala (waterless) fast for the longevity of their husbands. Worship Lord Shiva and Goddess Parvati with green leaves. Sing traditional Teej songs. Receive gifts (shringar) from their maternal home.',
      hi: 'सुहागिन महिलाएँ हरे वस्त्र और नई चूड़ियाँ पहनें, मेहंदी लगाएँ, झूला झूलें। पति की दीर्घायु के लिए निर्जला व्रत रखें। शिव-पार्वती की पूजा करें। तीज के गीत गाएँ। मायके से शृंगार प्राप्त करें।',
      sa: 'सुभागिन्यः हरितवस्त्राणि नवकङ्कणानि च धारयन्ति, मेहन्दीं लिम्पन्ति, दोलायां क्रीडन्ति। पत्युः दीर्घायुषे निर्जलव्रतं धारयन्ति।',
      mr: 'सुहागिन महिलाएँ हरे वस्त्र और नई चूड़ियाँ पहनें, मेहंदी लगाएँ, झूला झूलें। पति की दीर्घायु के लिए निर्जला व्रत रखें। शिव-पार्वती की पूजा करें। तीज के गीत गाएँ। मायके से शृंगार प्राप्त करें।',
      mai: 'सुहागिन महिलाएँ हरे वस्त्र और नई चूड़ियाँ पहनें, मेहंदी लगाएँ, झूला झूलें। पति की दीर्घायु के लिए निर्जला व्रत रखें। शिव-पार्वती की पूजा करें। तीज के गीत गाएँ। मायके से शृंगार प्राप्त करें।',
    },
    significance: {
      en: 'Hariyali Teej celebrates marital bliss, devotion, and the bond between husband and wife. It is one of the most important festivals for married Hindu women in North India. The green colour symbolizes fertility, renewal, and the joy of the monsoon season that brings life to the parched earth.',
      hi: 'हरियाली तीज दाम्पत्य सुख, भक्ति और पति-पत्नी के बन्धन का उत्सव है। उत्तर भारत की विवाहित महिलाओं का सबसे महत्त्वपूर्ण त्योहार। हरा रंग उर्वरता और सावन की खुशी का प्रतीक है।',
      sa: 'हरितालिकातीजः दाम्पत्यसुखस्य भक्तेः पतिपत्नीबन्धनस्य च उत्सवः। हरितवर्णः उर्वरतायाः श्रावणानन्दस्य च प्रतीकः।',
      mr: 'हरियाली तीज दाम्पत्य सुख, भक्ति और पति-पत्नी के बन्धन का उत्सव है। उत्तर भारत की विवाहित महिलाओं का सबसे महत्त्वपूर्ण त्योहार। हरा रंग उर्वरता और सावन की खुशी का प्रतीक है।',
      mai: 'हरियाली तीज दाम्पत्य सुख, भक्ति और पति-पत्नी के बन्धन का उत्सव है। उत्तर भारत की विवाहित महिलाओं का सबसे महत्त्वपूर्ण त्योहार। हरा रंग उर्वरता और सावन की खुशी का प्रतीक है।',
    },
    deity: { en: 'Goddess Parvati, Lord Shiva', hi: 'देवी पार्वती, भगवान शिव', sa: 'पार्वतीदेवी, शिवः', ta: 'பார்வதி தேவி, சிவன்', te: 'పార్వతీ దేవి, శివుడు', bn: 'পার্বতী দেবী, শিব', kn: 'ಪಾರ್ವತಿ ದೇವಿ, ಶಿವ', gu: 'પાર્વતી દેવી, શિવ', mr: 'देवी पार्वती, भगवान शिव', mai: 'देवी पार्वती, भगवान शिव' },
    isFast: true,
    fastNote: { en: 'Strict nirjala (waterless) fast observed by married women for the longevity of their husbands. Break fast the next morning after puja.', hi: 'सुहागिन महिलाएँ पति की दीर्घायु के लिए निर्जला व्रत रखती हैं। अगली सुबह पूजा के बाद पारण।', sa: 'सुभागिन्यः पत्युः दीर्घायुषे निर्जलव्रतं धारयन्ति। प्रातः पूजानन्तरं पारणम्।', mr: 'सुहागिन महिलाएँ पति की दीर्घायु के लिए निर्जला व्रत रखती हैं। अगली सुबह पूजा के बाद पारण।', mai: 'सुहागिन महिलाएँ पति की दीर्घायु के लिए निर्जला व्रत रखती हैं। अगली सुबह पूजा के बाद पारण।' },
  },

  'anant-chaturdashi': {
    name: { en: 'Anant Chaturdashi', hi: 'अनन्त चतुर्दशी', sa: 'अनन्तचतुर्दशी', ta: 'அனந்த சதுர்த்தசி', te: 'అనంత చతుర్దశి', bn: 'অনন্ত চতুর্দশী', kn: 'ಅನಂತ ಚತುರ್ದಶಿ', gu: 'અનંત ચતુર્દશી', mr: 'अनन्त चतुर्दशी', mai: 'अनन्त चतुर्दशी' },
    mythology: {
      en: 'Anant Chaturdashi is dedicated to Lord Vishnu in his Ananta (infinite) form — reclining on the cosmic serpent Shesha in the ocean of milk. In the Mahabharata, Lord Krishna narrated the Ananta Vrata Katha to Yudhishthira, explaining how King Sumanta and Queen Diksha regained their lost fortune by observing this vow. This day also marks the conclusion of the ten-day Ganesh Chaturthi festival, when Ganesh idols are immersed (Visarjan) in water.',
      hi: 'अनन्त चतुर्दशी विष्णु के अनन्त (अनन्तशेष पर विराजमान) रूप को समर्पित है। महाभारत में कृष्ण ने युधिष्ठिर को अनन्त व्रत कथा सुनाई। यह गणेश चतुर्थी के दसवें दिन गणेश विसर्जन का भी दिन है।',
      sa: 'अनन्तचतुर्दशी विष्णोः अनन्तरूपाय समर्पिता — शेषनागोपरि क्षीरसागरे शयानाय। महाभारते कृष्णः युधिष्ठिराय अनन्तव्रतकथाम् अकथयत्। गणेशविसर्जनस्यापि दिनम्।',
      mr: 'अनन्त चतुर्दशी विष्णु के अनन्त (अनन्तशेष पर विराजमान) रूप को समर्पित है। महाभारत में कृष्ण ने युधिष्ठिर को अनन्त व्रत कथा सुनाई। यह गणेश चतुर्थी के दसवें दिन गणेश विसर्जन का भी दिन है।',
      mai: 'अनन्त चतुर्दशी विष्णु के अनन्त (अनन्तशेष पर विराजमान) रूप को समर्पित है। महाभारत में कृष्ण ने युधिष्ठिर को अनन्त व्रत कथा सुनाई। यह गणेश चतुर्थी के दसवें दिन गणेश विसर्जन का भी दिन है।',
    },
    observance: {
      en: 'Tie the Ananta thread (14-knotted sacred thread dyed in turmeric) on the right wrist while reciting the Ananta Vrata Katha. Offer 14 types of flowers, fruits, and sweets to Lord Vishnu. For Ganesh Visarjan, carry the idol in a procession with drums and devotional songs to a river, lake, or sea for immersion.',
      hi: 'दाहिने हाथ पर हल्दी से रंगा 14 गाँठों वाला अनन्त धागा बाँधें। विष्णु को 14 प्रकार के फूल, फल और मिठाइयाँ अर्पित करें। गणेश प्रतिमा को ढोल-नगाड़ों के साथ जुलूस में ले जाकर जल में विसर्जित करें।',
      sa: 'दक्षिणहस्ते हरिद्रारञ्जितम् अनन्तसूत्रं (चतुर्दशग्रन्थियुक्तम्) बध्नातु। विष्णवे चतुर्दशविधपुष्पफलमिष्टान्नानि अर्पयेत्। गणेशप्रतिमां जले विसर्जयेत्।',
      mr: 'दाहिने हाथ पर हल्दी से रंगा 14 गाँठों वाला अनन्त धागा बाँधें। विष्णु को 14 प्रकार के फूल, फल और मिठाइयाँ अर्पित करें। गणेश प्रतिमा को ढोल-नगाड़ों के साथ जुलूस में ले जाकर जल में विसर्जित करें।',
      mai: 'दाहिने हाथ पर हल्दी से रंगा 14 गाँठों वाला अनन्त धागा बाँधें। विष्णु को 14 प्रकार के फूल, फल और मिठाइयाँ अर्पित करें। गणेश प्रतिमा को ढोल-नगाड़ों के साथ जुलूस में ले जाकर जल में विसर्जित करें।',
    },
    significance: {
      en: 'Anant Chaturdashi symbolizes the infinite and imperishable nature of Lord Vishnu. The 14 knots represent the 14 Lokas (realms) of the universe. Observing this vrata is said to bring enduring prosperity and remove past-life debts. The Ganesh Visarjan teaches non-attachment — accepting the cycle of arrival and departure.',
      hi: 'अनन्त चतुर्दशी विष्णु की अनन्त और अविनाशी प्रकृति का प्रतीक है। 14 गाँठें 14 लोकों का प्रतीक हैं। गणेश विसर्जन अनासक्ति और आगमन-प्रस्थान चक्र की शिक्षा देता है।',
      sa: 'अनन्तचतुर्दशी विष्णोः अनन्ताविनाशिस्वभावस्य प्रतीकः। चतुर्दशग्रन्थयः चतुर्दशलोकान् प्रतिनिधीकुर्वन्ति। गणेशविसर्जनम् अनासक्तिं शिक्षयति।',
      mr: 'अनन्त चतुर्दशी विष्णु की अनन्त और अविनाशी प्रकृति का प्रतीक है। 14 गाँठें 14 लोकों का प्रतीक हैं। गणेश विसर्जन अनासक्ति और आगमन-प्रस्थान चक्र की शिक्षा देता है।',
      mai: 'अनन्त चतुर्दशी विष्णु की अनन्त और अविनाशी प्रकृति का प्रतीक है। 14 गाँठें 14 लोकों का प्रतीक हैं। गणेश विसर्जन अनासक्ति और आगमन-प्रस्थान चक्र की शिक्षा देता है।',
    },
    deity: { en: 'Lord Vishnu (Ananta form), Lord Ganesha', hi: 'भगवान विष्णु (अनन्त रूप), भगवान गणेश', sa: 'विष्णुः (अनन्तरूपः), गणेशः', ta: 'விஷ்ணு (அனந்த ரூபம்), விநாயகர்', te: 'విష్ణువు (అనంత రూపం), గణేశుడు', bn: 'বিষ্ণু (অনন্ত রূপ), গণেশ', kn: 'ವಿಷ್ಣು (ಅನಂತ ರೂಪ), ಗಣೇಶ', gu: 'વિષ્ણુ (અનંત રૂપ), ગણેશ', mr: 'भगवान विष्णु (अनन्त रूप), भगवान गणेश', mai: 'भगवान विष्णु (अनन्त रूप), भगवान गणेश' },
  },

  'dhanteras': {
    name: { en: 'Dhanteras', hi: 'धनतेरस', sa: 'धनत्रयोदशी', ta: 'தன்தேரஸ்', te: 'ధన్‌తేరస్', bn: 'ধনতেরস', kn: 'ಧನ್‌ತೇರಸ್', gu: 'ધનતેરસ', mr: 'धनतेरस', mai: 'धनतेरस' },
    mythology: {
      en: 'Dhanteras marks the emergence of Dhanvantari — the divine physician and an avatar of Lord Vishnu — from the Samudra Manthan (churning of the cosmic ocean), carrying the pot of Amrit (nectar of immortality) and the science of Ayurveda. On this same day, Goddess Lakshmi also emerged from the ocean. Another legend tells of young Hima, whose husband was destined to die on the fourth day of marriage; she piled gold and silver coins at the door and kept lamps lit all night, dazzling Yama (Death) and saving her husband.',
      hi: 'धनतेरस पर समुद्र मन्थन से भगवान धन्वन्तरि (विष्णु अवतार) अमृत कलश और आयुर्वेद लेकर प्रकट हुए। इसी दिन लक्ष्मी भी सागर से प्रकट हुईं। एक अन्य कथा में हिमा ने सोने-चाँदी के सिक्के और दीप जलाकर यमराज को चकाचौंध कर अपने पति को बचाया।',
      sa: 'धनत्रयोदश्यां समुद्रमन्थनात् धन्वन्तरिः (विष्णावतारः) अमृतकलशेन आयुर्वेदेन च प्राकट्यत। लक्ष्मीदेवी अपि सागरात् प्राकट्यत।',
      mr: 'धनतेरस पर समुद्र मन्थन से भगवान धन्वन्तरि (विष्णु अवतार) अमृत कलश और आयुर्वेद लेकर प्रकट हुए। इसी दिन लक्ष्मी भी सागर से प्रकट हुईं। एक अन्य कथा में हिमा ने सोने-चाँदी के सिक्के और दीप जलाकर यमराज को चकाचौंध कर अपने पति को बचाया।',
      mai: 'धनतेरस पर समुद्र मन्थन से भगवान धन्वन्तरि (विष्णु अवतार) अमृत कलश और आयुर्वेद लेकर प्रकट हुए। इसी दिन लक्ष्मी भी सागर से प्रकट हुईं। एक अन्य कथा में हिमा ने सोने-चाँदी के सिक्के और दीप जलाकर यमराज को चकाचौंध कर अपने पति को बचाया।',
    },
    observance: {
      en: 'Purchase gold, silver, utensils, or new items for the home — this is considered the most auspicious shopping day. Light thirteen diyas in the evening facing south (to ward off untimely death). Worship Lord Dhanvantari for health and Lord Kubera and Goddess Lakshmi for wealth. Clean the home and adorn the entrance with rangoli.',
      hi: 'सोना, चाँदी, बर्तन या घर के नए सामान खरीदें — खरीदारी का सबसे शुभ दिन। शाम को दक्षिण दिशा में तेरह दीप जलाएँ। स्वास्थ्य के लिए धन्वन्तरि और धन के लिए लक्ष्मी-कुबेर की पूजा करें।',
      sa: 'सुवर्णं रजतं पात्राणि नवान् गृहोपकरणान् वा क्रीणातु। सायं दक्षिणदिशायां त्रयोदशदीपान् प्रज्वालयेत्। धन्वन्तरिं लक्ष्मीं कुबेरं च पूजयेत्।',
      mr: 'सोना, चाँदी, बर्तन या घर के नए सामान खरीदें — खरीदारी का सबसे शुभ दिन। शाम को दक्षिण दिशा में तेरह दीप जलाएँ। स्वास्थ्य के लिए धन्वन्तरि और धन के लिए लक्ष्मी-कुबेर की पूजा करें।',
      mai: 'सोना, चाँदी, बर्तन या घर के नए सामान खरीदें — खरीदारी का सबसे शुभ दिन। शाम को दक्षिण दिशा में तेरह दीप जलाएँ। स्वास्थ्य के लिए धन्वन्तरि और धन के लिए लक्ष्मी-कुबेर की पूजा करें।',
    },
    significance: {
      en: 'Dhanteras is the first day of the five-day Diwali festival. "Dhan" means wealth and "Teras" is the thirteenth lunar day. It celebrates health (Dhanvantari), wealth (Lakshmi-Kubera), and prosperity. Lighting lamps facing south is uniquely associated with warding off Yama and untimely death.',
      hi: 'धनतेरस दीपावली के पाँच दिवसीय उत्सव का पहला दिन है। "धन" का अर्थ सम्पत्ति और "तेरस" त्रयोदशी। यह स्वास्थ्य, धन और समृद्धि का उत्सव है।',
      sa: 'धनत्रयोदशी दीपावलेः पञ्चदिवसीयोत्सवस्य प्रथमं दिनम्। "धन" इति सम्पत्तिः "त्रयोदशी" इति तिथिः। आरोग्यधनसमृद्धीनाम् उत्सवः।',
      mr: 'धनतेरस दीपावली के पाँच दिवसीय उत्सव का पहला दिन है। "धन" का अर्थ सम्पत्ति और "तेरस" त्रयोदशी। यह स्वास्थ्य, धन और समृद्धि का उत्सव है।',
      mai: 'धनतेरस दीपावली के पाँच दिवसीय उत्सव का पहला दिन है। "धन" का अर्थ सम्पत्ति और "तेरस" त्रयोदशी। यह स्वास्थ्य, धन और समृद्धि का उत्सव है।',
    },
    deity: { en: 'Lord Dhanvantari, Goddess Lakshmi, Lord Kubera', hi: 'भगवान धन्वन्तरि, देवी लक्ष्मी, कुबेर', sa: 'धन्वन्तरिः, लक्ष्मीः, कुबेरः', ta: 'தன்வந்தரி, லக்ஷ்மி, குபேரன்', te: 'ధన్వంతరి, లక్ష్మీ, కుబేరుడు', bn: 'ধন্বন্তরি, লক্ষ্মী, কুবের', kn: 'ಧನ್ವಂತರಿ, ಲಕ್ಷ್ಮಿ, ಕುಬೇರ', gu: 'ધન્વંતરિ, લક્ષ્મી, કુબેર', mr: 'भगवान धन्वन्तरि, देवी लक्ष्मी, कुबेर', mai: 'भगवान धन्वन्तरि, देवी लक्ष्मी, कुबेर' },
  },

  'narak-chaturdashi': {
    name: { en: 'Narak Chaturdashi', hi: 'नरक चतुर्दशी', sa: 'नरकचतुर्दशी', ta: 'நரக சதுர்த்தசி', te: 'నరక చతుర్దశి', bn: 'নরক চতুর্দশী', kn: 'ನರಕ ಚತುರ್ದಶಿ', gu: 'નરક ચતુર્દશી', mr: 'नरक चतुर्दशी', mai: 'नरक चतुर्दशी' },
    mythology: {
      en: 'Narak Chaturdashi celebrates Lord Krishna\'s victory over the demon Narakasura (Bhaumasura), who had imprisoned 16,100 princesses and terrorized the three worlds. Krishna, along with his wife Satyabhama, slew the demon in a fierce battle and freed all the captives. It is said that Krishna returned home before dawn, and the women bathed him with fragrant oils to wash off the blood of battle — the origin of the pre-dawn oil bath tradition. In some regions, this day is also observed as Kali Chaudas, honouring Goddess Kali\'s fierce form.',
      hi: 'नरक चतुर्दशी कृष्ण द्वारा नरकासुर वध का उत्सव है। नरकासुर ने 16,100 राजकुमारियों को बन्दी बनाया था। कृष्ण ने सत्यभामा सहित युद्ध कर उसे मारा और सबको मुक्त किया। भोर में कृष्ण को सुगन्धित तेल से स्नान कराया गया। कुछ स्थानों पर इसे काली चौदस के रूप में मनाते हैं।',
      sa: 'नरकचतुर्दशी कृष्णेन नरकासुरवधस्य उत्सवः। नरकासुरः षोडशसहस्रशतं राजकुमारीः अबध्नात्। कृष्णः सत्यभामया सह तं निहत्य सर्वाः अमोचयत्।',
      mr: 'नरक चतुर्दशी कृष्ण द्वारा नरकासुर वध का उत्सव है। नरकासुर ने 16,100 राजकुमारियों को बन्दी बनाया था। कृष्ण ने सत्यभामा सहित युद्ध कर उसे मारा और सबको मुक्त किया। भोर में कृष्ण को सुगन्धित तेल से स्नान कराया गया। कुछ स्थानों पर इसे काली चौदस के रूप में मनाते हैं।',
      mai: 'नरक चतुर्दशी कृष्ण द्वारा नरकासुर वध का उत्सव है। नरकासुर ने 16,100 राजकुमारियों को बन्दी बनाया था। कृष्ण ने सत्यभामा सहित युद्ध कर उसे मारा और सबको मुक्त किया। भोर में कृष्ण को सुगन्धित तेल से स्नान कराया गया। कुछ स्थानों पर इसे काली चौदस के रूप में मनाते हैं।',
    },
    observance: {
      en: 'Rise before dawn and take an oil bath (Abhyanga Snan) with sesame oil and ubtan — this is one of the few days when bathing before sunrise is prescribed. Light fourteen diyas (representing the fourteen realms) in the evening. Burst firecrackers to celebrate Krishna\'s victory. Worship Lord Krishna and, in some traditions, Goddess Kali or Hanuman. Prepare special sweets.',
      hi: 'भोर से पहले उठकर तिल के तेल और उबटन से अभ्यंग स्नान करें। शाम को चौदह दीप जलाएँ। पटाखे फोड़ें। कृष्ण और कुछ परम्पराओं में काली या हनुमान की पूजा करें। विशेष मिठाइयाँ बनाएँ।',
      sa: 'प्रातः सूर्योदयात् पूर्वं तिलतैलेन उबटनेन च अभ्यङ्गस्नानं कुर्यात्। सायं चतुर्दशदीपान् प्रज्वालयेत्। कृष्णं पूजयेत्।',
      mr: 'भोर से पहले उठकर तिल के तेल और उबटन से अभ्यंग स्नान करें। शाम को चौदह दीप जलाएँ। पटाखे फोड़ें। कृष्ण और कुछ परम्पराओं में काली या हनुमान की पूजा करें। विशेष मिठाइयाँ बनाएँ।',
      mai: 'भोर से पहले उठकर तिल के तेल और उबटन से अभ्यंग स्नान करें। शाम को चौदह दीप जलाएँ। पटाखे फोड़ें। कृष्ण और कुछ परम्पराओं में काली या हनुमान की पूजा करें। विशेष मिठाइयाँ बनाएँ।',
    },
    significance: {
      en: 'Narak Chaturdashi symbolizes the destruction of evil and the liberation of the oppressed. The pre-dawn bath washes away sins, and the lighting of fourteen diyas represents illuminating all fourteen Lokas. It is the second day of the five-day Diwali festival and is considered a day of purification before the main Diwali night.',
      hi: 'नरक चतुर्दशी बुराई के नाश और पीड़ितों की मुक्ति का प्रतीक है। भोर का स्नान पापों को धोता है और चौदह दीप चौदह लोकों को प्रकाशित करते हैं। यह दीपावली से पूर्व शुद्धिकरण का दिन है।',
      sa: 'नरकचतुर्दशी दुष्टनाशस्य पीडितमोचनस्य च प्रतीकः। प्रातःस्नानं पापानि क्षालयति। चतुर्दशदीपाः चतुर्दशलोकान् प्रकाशयन्ति।',
      mr: 'नरक चतुर्दशी बुराई के नाश और पीड़ितों की मुक्ति का प्रतीक है। भोर का स्नान पापों को धोता है और चौदह दीप चौदह लोकों को प्रकाशित करते हैं। यह दीपावली से पूर्व शुद्धिकरण का दिन है।',
      mai: 'नरक चतुर्दशी बुराई के नाश और पीड़ितों की मुक्ति का प्रतीक है। भोर का स्नान पापों को धोता है और चौदह दीप चौदह लोकों को प्रकाशित करते हैं। यह दीपावली से पूर्व शुद्धिकरण का दिन है।',
    },
    deity: { en: 'Lord Krishna, Goddess Kali', hi: 'भगवान कृष्ण, देवी काली', sa: 'श्रीकृष्णः, कालीदेवी', ta: 'கிருஷ்ணர், காளி தேவி', te: 'శ్రీకృష్ణుడు, కాళీ దేవి', bn: 'কৃষ্ণ, কালী দেবী', kn: 'ಕೃಷ್ಣ, ಕಾಳಿ ದೇವಿ', gu: 'કૃષ્ણ, કાલી દેવી', mr: 'भगवान कृष्ण, देवी काली', mai: 'भगवान कृष्ण, देवी काली' },
  },

  'govardhan-puja': {
    name: { en: 'Govardhan Puja', hi: 'गोवर्धन पूजा', sa: 'गोवर्धनपूजा', ta: 'கோவர்த்தன பூஜை', te: 'గోవర్ధన పూజ', bn: 'গোবর্ধন পূজা', kn: 'ಗೋವರ್ಧನ ಪೂಜೆ', gu: 'ગોવર્ધન પૂજા', mr: 'गोवर्धन पूजा', mai: 'गोवर्धन पूजा' },
    mythology: {
      en: 'Govardhan Puja commemorates the day young Lord Krishna lifted the mighty Govardhan Hill on his little finger to shelter the people and cattle of Vrindavan from the devastating rains unleashed by an angered Indra. The people of Vraja had, at Krishna\'s urging, stopped their annual Indra Yagna and instead worshipped Govardhan Hill as the true provider of grass, water, and sustenance. Humbled, Indra acknowledged Krishna\'s supremacy and sought forgiveness.',
      hi: 'गोवर्धन पूजा उस दिन का स्मरण है जब बालकृष्ण ने गोवर्धन पर्वत को अपनी छोटी उँगली पर उठाकर वृन्दावन के लोगों और गौओं को इन्द्र की प्रलयकारी वर्षा से बचाया। कृष्ण के कहने पर व्रजवासियों ने इन्द्र यज्ञ बन्द कर गोवर्धन की पूजा की। पराजित इन्द्र ने कृष्ण से क्षमा माँगी।',
      sa: 'गोवर्धनपूजा तद्दिनं स्मरति यदा बालकृष्णः गोवर्धनगिरिं कनिष्ठिकाङ्गुल्या उदतोलयत्, वृन्दावनस्य जनान् गाश्च इन्द्रस्य प्रलयवर्षात् अरक्षत्। इन्द्रः पराजितः कृष्णं क्षमाम् अयाचत।',
      mr: 'गोवर्धन पूजा उस दिन का स्मरण है जब बालकृष्ण ने गोवर्धन पर्वत को अपनी छोटी उँगली पर उठाकर वृन्दावन के लोगों और गौओं को इन्द्र की प्रलयकारी वर्षा से बचाया। कृष्ण के कहने पर व्रजवासियों ने इन्द्र यज्ञ बन्द कर गोवर्धन की पूजा की। पराजित इन्द्र ने कृष्ण से क्षमा माँगी।',
      mai: 'गोवर्धन पूजा उस दिन का स्मरण है जब बालकृष्ण ने गोवर्धन पर्वत को अपनी छोटी उँगली पर उठाकर वृन्दावन के लोगों और गौओं को इन्द्र की प्रलयकारी वर्षा से बचाया। कृष्ण के कहने पर व्रजवासियों ने इन्द्र यज्ञ बन्द कर गोवर्धन की पूजा की। पराजित इन्द्र ने कृष्ण से क्षमा माँगी।',
    },
    observance: {
      en: 'Prepare a mountain of food (Annakut) — rice, dal, vegetables, sweets, and savouries — arranged in the shape of Govardhan Hill, and offer it to Lord Krishna. Worship cows and decorate them with garlands and colours. Some communities make cow-dung replicas of Govardhan Hill and circumambulate them. Visit temples for darshan of the Annakut display.',
      hi: 'गोवर्धन पर्वत के आकार में अन्नकूट सजाएँ — चावल, दाल, सब्ज़ियाँ, मिठाइयाँ। कृष्ण को अर्पित करें। गौओं को सजाकर पूजा करें। गोबर से गोवर्धन बनाकर परिक्रमा करें। मन्दिर में अन्नकूट दर्शन करें।',
      sa: 'गोवर्धनगिर्याकारे अन्नकूटम् — ओदनं दालं शाकानि मिष्टान्नानि च — सज्जयित्वा कृष्णाय अर्पयेत्। गाः अलङ्कृत्य पूजयेत्। गोमयेन गोवर्धनं रचयित्वा प्रदक्षिणां कुर्यात्।',
      mr: 'गोवर्धन पर्वत के आकार में अन्नकूट सजाएँ — चावल, दाल, सब्ज़ियाँ, मिठाइयाँ। कृष्ण को अर्पित करें। गौओं को सजाकर पूजा करें। गोबर से गोवर्धन बनाकर परिक्रमा करें। मन्दिर में अन्नकूट दर्शन करें।',
      mai: 'गोवर्धन पर्वत के आकार में अन्नकूट सजाएँ — चावल, दाल, सब्ज़ियाँ, मिठाइयाँ। कृष्ण को अर्पित करें। गौओं को सजाकर पूजा करें। गोबर से गोवर्धन बनाकर परिक्रमा करें। मन्दिर में अन्नकूट दर्शन करें।',
    },
    significance: {
      en: 'Govardhan Puja teaches devotion to nature and self-reliance over ritualistic appeasement. Krishna showed that the hill, cows, and the natural environment that directly sustained the community deserved worship more than a distant deity demanding sacrifice. It is the fourth day of the Diwali festival, also known as Annakut or Padwa in different regions.',
      hi: 'गोवर्धन पूजा प्रकृति-भक्ति और आत्मनिर्भरता की शिक्षा देती है। कृष्ण ने दिखाया कि समुदाय का पोषण करने वाला पर्वत और गौएँ पूजा के योग्य हैं। यह दीपावली का चौथा दिन है।',
      sa: 'गोवर्धनपूजा प्रकृतिभक्तिं स्वावलम्बनं च शिक्षयति। कृष्णः अदर्शयत् यत् समुदायं पोषयन् गिरिः गावश्च पूजार्हाः। दीपावलेः चतुर्थं दिनम्।',
      mr: 'गोवर्धन पूजा प्रकृति-भक्ति और आत्मनिर्भरता की शिक्षा देती है। कृष्ण ने दिखाया कि समुदाय का पोषण करने वाला पर्वत और गौएँ पूजा के योग्य हैं। यह दीपावली का चौथा दिन है।',
      mai: 'गोवर्धन पूजा प्रकृति-भक्ति और आत्मनिर्भरता की शिक्षा देती है। कृष्ण ने दिखाया कि समुदाय का पोषण करने वाला पर्वत और गौएँ पूजा के योग्य हैं। यह दीपावली का चौथा दिन है।',
    },
    deity: { en: 'Lord Krishna', hi: 'भगवान कृष्ण', sa: 'श्रीकृष्णः', ta: 'ஸ்ரீ கிருஷ்ணர்', te: 'శ్రీకృష్ణుడు', bn: 'শ্রীকৃষ্ণ', kn: 'ಶ್ರೀಕೃಷ್ಣ', gu: 'શ્રી કૃષ્ણ', mr: 'भगवान कृष्ण', mai: 'भगवान कृष्ण' },
  },

  'bhai-dooj': {
    name: { en: 'Bhai Dooj', hi: 'भाई दूज', sa: 'भ्रातृद्वितीया', ta: 'பாய் தூஜ்', te: 'భాయి దూజ్', bn: 'ভাই ফোঁটা', kn: 'ಭಾಯಿ ದೂಜ್', gu: 'ભાઈ દૂજ', mr: 'भाई दूज', mai: 'भाई दूज' },
    mythology: {
      en: 'Bhai Dooj is rooted in the story of Yama (the God of Death) and his twin sister Yamuna. After a long absence, Yama visited Yamuna on this day, and she welcomed him with an aarti, a tilak on his forehead, and a feast. Touched by her love, Yama granted a boon that any brother who receives a tilak from his sister on this day shall be freed from the fear of untimely death. Another tradition links it to Lord Krishna visiting his sister Subhadra after slaying Narakasura.',
      hi: 'भाई दूज यमराज और उनकी बहन यमुना की कथा पर आधारित है। यमुना ने यमराज का आरती, तिलक और भोज से स्वागत किया। प्रसन्न होकर यम ने वरदान दिया कि इस दिन बहन से तिलक पाने वाला भाई अकाल मृत्यु से मुक्त रहेगा। एक अन्य परम्परा कृष्ण-सुभद्रा मिलन से जुड़ी है।',
      sa: 'भ्रातृद्वितीया यमस्य तस्य भगिन्याः यमुनायाः कथायाम् आधृता। यमुना यमम् आरत्या तिलकेन भोजनेन च अस्वागत्। प्रसन्नः यमः वरम् अददात् — अस्मिन् दिने भगिन्याः तिलकं प्राप्तः भ्राता अकालमृत्योः मुक्तः भवति।',
      mr: 'भाई दूज यमराज और उनकी बहन यमुना की कथा पर आधारित है। यमुना ने यमराज का आरती, तिलक और भोज से स्वागत किया। प्रसन्न होकर यम ने वरदान दिया कि इस दिन बहन से तिलक पाने वाला भाई अकाल मृत्यु से मुक्त रहेगा। एक अन्य परम्परा कृष्ण-सुभद्रा मिलन से जुड़ी है।',
      mai: 'भाई दूज यमराज और उनकी बहन यमुना की कथा पर आधारित है। यमुना ने यमराज का आरती, तिलक और भोज से स्वागत किया। प्रसन्न होकर यम ने वरदान दिया कि इस दिन बहन से तिलक पाने वाला भाई अकाल मृत्यु से मुक्त रहेगा। एक अन्य परम्परा कृष्ण-सुभद्रा मिलन से जुड़ी है।',
    },
    observance: {
      en: 'Sisters apply a ceremonial tilak of kumkum, rice, and sandalwood on their brother\'s forehead, perform his aarti, and pray for his long life. Brothers give gifts and sweets in return and vow to protect their sisters. Special foods and sweets are prepared. If a sister has no brother, she may worship Yama and the moon.',
      hi: 'बहनें भाई के मस्तक पर कुमकुम, चावल और चन्दन का तिलक लगाएँ, आरती करें और दीर्घायु की कामना करें। भाई उपहार और मिठाइयाँ दें। विशेष पकवान बनाएँ।',
      sa: 'भगिन्यः भ्रातुः ललाटे कुङ्कुमतिलकं चन्दनं चावलं च स्थापयन्ति, आरतिं कुर्वन्ति, दीर्घायुषं प्रार्थयन्ति। भ्रातरः उपहारान् मिष्टान्नानि च यच्छन्ति।',
      mr: 'बहनें भाई के मस्तक पर कुमकुम, चावल और चन्दन का तिलक लगाएँ, आरती करें और दीर्घायु की कामना करें। भाई उपहार और मिठाइयाँ दें। विशेष पकवान बनाएँ।',
      mai: 'बहनें भाई के मस्तक पर कुमकुम, चावल और चन्दन का तिलक लगाएँ, आरती करें और दीर्घायु की कामना करें। भाई उपहार और मिठाइयाँ दें। विशेष पकवान बनाएँ।',
    },
    significance: {
      en: 'Bhai Dooj celebrates the sacred bond between brother and sister. It is the fifth and final day of the Diwali festival. The blessing of a sister is believed to be powerful enough to ward off Yama himself. It is observed across India by different names — Bhai Phota in Bengal, Bhai Tika in Nepal, and Bhai Bij in Gujarat.',
      hi: 'भाई दूज भाई-बहन के पवित्र बन्धन का उत्सव है। यह दीपावली का पाँचवाँ और अन्तिम दिन है। बहन का आशीर्वाद यम को भी दूर रखने में समर्थ माना जाता है।',
      sa: 'भ्रातृद्वितीया भ्रातृभगिन्योः पवित्रबन्धनस्य उत्सवः। दीपावलेः पञ्चमं अन्तिमं च दिनम्। भगिन्याः आशीर्वादः यमम् अपि निवारयितुं समर्थः।',
      mr: 'भाई दूज भाई-बहन के पवित्र बन्धन का उत्सव है। यह दीपावली का पाँचवाँ और अन्तिम दिन है। बहन का आशीर्वाद यम को भी दूर रखने में समर्थ माना जाता है।',
      mai: 'भाई दूज भाई-बहन के पवित्र बन्धन का उत्सव है। यह दीपावली का पाँचवाँ और अन्तिम दिन है। बहन का आशीर्वाद यम को भी दूर रखने में समर्थ माना जाता है।',
    },
    deity: { en: 'Yama, Yamuna', hi: 'यमराज, यमुना', sa: 'यमः, यमुना', ta: 'யமன், யமுனா', te: 'యముడు, యమున', bn: 'যম, যমুনা', kn: 'ಯಮ, ಯಮುನಾ', gu: 'યમ, યમુના', mr: 'यमराज, यमुना', mai: 'यमराज, यमुना' },
  },

  'kartik-purnima': {
    name: { en: 'Kartik Purnima', hi: 'कार्तिक पूर्णिमा', sa: 'कार्तिकपूर्णिमा', ta: 'கார்த்திக பூர்ணிமா', te: 'కార్తీక పూర్ణిమ', bn: 'কার্তিক পূর্ণিমা', kn: 'ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮಾ', gu: 'કાર્તિક પૂર્ણિમા', mr: 'कार्तिक पूर्णिमा', mai: 'कार्तिक पूर्णिमा' },
    mythology: {
      en: 'Kartik Purnima is celebrated as Dev Diwali — the festival of lights of the Gods. According to the Skanda Purana, the Devas descended to Varanasi on this night to bathe in the Ganga and celebrate Shiva\'s victory over the demon Tripurasura, whom he destroyed with a single arrow. This day also marks the birthday of Kartikeya (Skanda), the God of war, son of Shiva and Parvati. It falls in the period of Tulsi Vivah, the ceremonial marriage of Tulsi (Holy Basil) with Vishnu\'s Shaligrama form.',
      hi: 'कार्तिक पूर्णिमा को देव दीपावली मनायी जाती है — देवताओं का दीपोत्सव। स्कन्द पुराण के अनुसार शिव ने त्रिपुरासुर का वध किया और देवता वाराणसी में गंगा स्नान करने आये। यह कार्तिकेय का जन्मदिन भी है। तुलसी विवाह काल भी इसी समय आता है।',
      sa: 'कार्तिकपूर्णिमा देवदीपावलिः — देवानाम् उत्सवः। स्कन्दपुराणानुसारं शिवः त्रिपुरासुरं निजघान, देवाः वाराणस्यां गङ्गास्नानम् अकुर्वन्। कार्तिकेयस्य जन्मदिनम् अपि। तुलसीविवाहकालोऽपि।',
      mr: 'कार्तिक पूर्णिमा को देव दीपावली मनायी जाती है — देवताओं का दीपोत्सव। स्कन्द पुराण के अनुसार शिव ने त्रिपुरासुर का वध किया और देवता वाराणसी में गंगा स्नान करने आये। यह कार्तिकेय का जन्मदिन भी है। तुलसी विवाह काल भी इसी समय आता है।',
      mai: 'कार्तिक पूर्णिमा को देव दीपावली मनायी जाती है — देवताओं का दीपोत्सव। स्कन्द पुराण के अनुसार शिव ने त्रिपुरासुर का वध किया और देवता वाराणसी में गंगा स्नान करने आये। यह कार्तिकेय का जन्मदिन भी है। तुलसी विवाह काल भी इसी समय आता है।',
    },
    observance: {
      en: 'Take a sacred bath in the Ganga or any river before sunrise (Kartik Snan). Light rows of deep diyas along ghats and river banks — the ghats of Varanasi illuminate spectacularly on this night. Worship Lord Shiva as Tripurari (destroyer of Tripurasura). Perform Tulsi Vivah by ceremonially marrying a Tulsi plant to a Shaligrama stone. Observe Satyanarayan Puja.',
      hi: 'सूर्योदय से पहले गंगा या नदी में कार्तिक स्नान करें। घाटों पर दीपों की पंक्तियाँ जलाएँ — वाराणसी के घाट इस रात अलौकिक दिखते हैं। शिव की त्रिपुरारि रूप में पूजा करें। तुलसी विवाह कराएँ। सत्यनारायण पूजा करें।',
      sa: 'सूर्योदयात् पूर्वं गङ्गायां नद्यां वा कार्तिकस्नानं कुर्यात्। घट्टेषु दीपपङ्क्तीः प्रज्वालयेत्। शिवं त्रिपुरारिरूपेण पूजयेत्। तुलसीविवाहं कारयेत्।',
      mr: 'सूर्योदय से पहले गंगा या नदी में कार्तिक स्नान करें। घाटों पर दीपों की पंक्तियाँ जलाएँ — वाराणसी के घाट इस रात अलौकिक दिखते हैं। शिव की त्रिपुरारि रूप में पूजा करें। तुलसी विवाह कराएँ। सत्यनारायण पूजा करें।',
      mai: 'सूर्योदय से पहले गंगा या नदी में कार्तिक स्नान करें। घाटों पर दीपों की पंक्तियाँ जलाएँ — वाराणसी के घाट इस रात अलौकिक दिखते हैं। शिव की त्रिपुरारि रूप में पूजा करें। तुलसी विवाह कराएँ। सत्यनारायण पूजा करें।',
    },
    significance: {
      en: 'Kartik Purnima is considered the most sacred full moon of the year. A bath in the Ganga on this day earns the merit of a hundred Ashwamedha Yagyas. It is the culmination of the holy month of Kartik, during which daily Ganga baths and lamp offerings are observed. Dev Diwali signifies the Gods themselves celebrating light\'s victory over darkness.',
      hi: 'कार्तिक पूर्णिमा वर्ष की सबसे पवित्र पूर्णिमा मानी जाती है। इस दिन गंगा स्नान सौ अश्वमेध यज्ञों का पुण्य देता है। पवित्र कार्तिक मास की पूर्णाहुति और देवताओं का दीपोत्सव।',
      sa: 'कार्तिकपूर्णिमा वर्षस्य पवित्रतमा पूर्णिमा। अस्मिन् दिने गङ्गास्नानं शताश्वमेधयज्ञपुण्यसमम्। पवित्रकार्तिकमासस्य पूर्णाहुतिः देवानां दीपोत्सवश्च।',
      mr: 'कार्तिक पूर्णिमा वर्ष की सबसे पवित्र पूर्णिमा मानी जाती है। इस दिन गंगा स्नान सौ अश्वमेध यज्ञों का पुण्य देता है। पवित्र कार्तिक मास की पूर्णाहुति और देवताओं का दीपोत्सव।',
      mai: 'कार्तिक पूर्णिमा वर्ष की सबसे पवित्र पूर्णिमा मानी जाती है। इस दिन गंगा स्नान सौ अश्वमेध यज्ञों का पुण्य देता है। पवित्र कार्तिक मास की पूर्णाहुति और देवताओं का दीपोत्सव।',
    },
    deity: { en: 'Lord Shiva (Tripurari), Lord Vishnu, Kartikeya', hi: 'भगवान शिव (त्रिपुरारि), भगवान विष्णु, कार्तिकेय', sa: 'शिवः (त्रिपुरारिः), विष्णुः, कार्तिकेयः', ta: 'சிவன் (திரிபுராரி), விஷ்ணு, கார்த்திகேயன்', te: 'శివుడు (త్రిపురారి), విష్ణువు, కార్తికేయుడు', bn: 'শিব (ত্রিপুরারি), বিষ্ণু, কার্তিকেয়', kn: 'ಶಿವ (ತ್ರಿಪುರಾರಿ), ವಿಷ್ಣು, ಕಾರ್ತಿಕೇಯ', gu: 'શિવ (ત્રિપુરારિ), વિષ્ણુ, કાર્તિકેય', mr: 'भगवान शिव (त्रिपुरारि), भगवान विष्णु, कार्तिकेय', mai: 'भगवान शिव (त्रिपुरारि), भगवान विष्णु, कार्तिकेय' },
  },
};

/* ═══════════════════════════════════════════
   NAMED EKADASHIS — 24 per year
   ═══════════════════════════════════════════ */

export interface EkadashiDetail {
  name: LocaleText;
  story: LocaleText;
  benefit: LocaleText;
}

// Keyed by Hindu month name + paksha
export const EKADASHI_NAMES: Record<string, { shukla: EkadashiDetail; krishna: EkadashiDetail }> = {
  chaitra: {
    shukla: {
      name: { en: 'Kamada Ekadashi', hi: 'कामदा एकादशी', sa: 'कामदैकादशी', ta: 'காமதா ஏகாதசி', te: 'కామద ఏకాదశి', bn: 'কামদা একাদশী', kn: 'ಕಾಮದಾ ಏಕಾದಶಿ', gu: 'કામદા એકાદશી', mr: 'कामदा एकादशी', mai: 'कामदा एकादशी' },
      story: { en: 'A Gandharva named Lalit was cursed to become a demon. His wife Lalita observed this Ekadashi and the merit freed him from the curse. Lord Krishna told Yudhishthira that this Ekadashi fulfils all desires (Kama = desire, Da = giver).', hi: 'ललित नामक गन्धर्व को राक्षस बनने का शाप मिला। उसकी पत्नी ललिता ने यह एकादशी रखी और पुण्य से शाप मुक्ति हुई। कामदा = इच्छा पूर्ण करने वाली।', sa: 'ललितो नाम गन्धर्वः राक्षसत्वशापं प्राप्तवान्। तस्य पत्नी ललिता एताम् एकादशीम् अवर्तयत्।', mr: 'ललित नामक गन्धर्व को राक्षस बनने का शाप मिला। उसकी पत्नी ललिता ने यह एकादशी रखी और पुण्य से शाप मुक्ति हुई। कामदा = इच्छा पूर्ण करने वाली।', mai: 'ललित नामक गन्धर्व को राक्षस बनने का शाप मिला। उसकी पत्नी ललिता ने यह एकादशी रखी और पुण्य से शाप मुक्ति हुई। कामदा = इच्छा पूर्ण करने वाली।' },
      benefit: { en: 'Fulfils all desires, removes sins equivalent to killing a Brahmana, grants liberation', hi: 'सभी इच्छाएँ पूर्ण करती है, ब्रह्महत्या तुल्य पापों को नष्ट करती है', sa: 'सर्वान् कामान् पूरयति, ब्रह्महत्यासमपापानि नाशयति', mr: 'सभी इच्छाएँ पूर्ण करती है, ब्रह्महत्या तुल्य पापों को नष्ट करती है', mai: 'सभी इच्छाएँ पूर्ण करती है, ब्रह्महत्या तुल्य पापों को नष्ट करती है' },
    },
    krishna: {
      name: { en: 'Papamochani Ekadashi', hi: 'पापमोचनी एकादशी', sa: 'पापमोचनीएकादशी', ta: 'பாபமோசனி ஏகாதசி', te: 'పాపమోచని ఏకాదశి', bn: 'পাপমোচনী একাদশী', kn: 'ಪಾಪಮೋಚನಿ ಏಕಾದಶಿ', gu: 'પાપમોચની એકાદશી', mr: 'पापमोचनी एकादशी', mai: 'पापमोचनी एकादशी' },
      story: { en: 'The sage Medhavi was seduced by the apsara Manjughosha, losing years of penance. Both were cursed. By observing this Ekadashi, they were freed from all sins. Papa = sin, Mochani = liberator.', hi: 'ऋषि मेधावी अप्सरा मञ्जुघोषा द्वारा मोहित हुए और वर्षों की तपस्या खो दी। इस एकादशी से दोनों पापमुक्त हुए।', sa: 'मेधावीऋषिः अप्सरया मोहितः। एतया एकादश्या तौ पापमुक्तौ अभवताम्।', mr: 'ऋषि मेधावी अप्सरा मञ्जुघोषा द्वारा मोहित हुए और वर्षों की तपस्या खो दी। इस एकादशी से दोनों पापमुक्त हुए।', mai: 'ऋषि मेधावी अप्सरा मञ्जुघोषा द्वारा मोहित हुए और वर्षों की तपस्या खो दी। इस एकादशी से दोनों पापमुक्त हुए।' },
      benefit: { en: 'Destroys all sins, removes effects of broken vows and curses', hi: 'सभी पापों का नाश, टूटे व्रतों और शापों के प्रभाव को हटाती है', sa: 'सर्वपापनाशनम्, भग्नव्रतशापप्रभावनिवारणम्', mr: 'सभी पापों का नाश, टूटे व्रतों और शापों के प्रभाव को हटाती है', mai: 'सभी पापों का नाश, टूटे व्रतों और शापों के प्रभाव को हटाती है' },
    },
  },
  vaishakha: {
    shukla: {
      name: { en: 'Mohini Ekadashi', hi: 'मोहिनी एकादशी', sa: 'मोहिनीएकादशी', ta: 'மோஹினி ஏகாதசி', te: 'మోహిని ఏకాదశి', bn: 'মোহিনী একাদশী', kn: 'ಮೋಹಿನಿ ಏಕಾದಶಿ', gu: 'મોહિની એકાદશી', mr: 'मोहिनी एकादशी', mai: 'मोहिनी एकादशी' },
      story: { en: 'Named after Lord Vishnu\'s Mohini avatar, who enchanted the demons during the distribution of Amrit. A merchant named Dhanapala\'s wicked son Dhrishtabuddhi was saved from hell by the merit of this Ekadashi fast observed by his father.', hi: 'विष्णु के मोहिनी अवतार के नाम पर, जिन्होंने अमृत वितरण में दानवों को मोहित किया। धनपाल नामक व्यापारी के दुष्ट पुत्र को इस एकादशी के पुण्य से नरक से मुक्ति मिली।', sa: 'विष्णोः मोहिन्यवतारस्य नाम्ना। धनपालस्य दुष्टपुत्रः एतस्याः एकादश्याः पुण्येन नरकात् मुक्तः।', mr: 'विष्णु के मोहिनी अवतार के नाम पर, जिन्होंने अमृत वितरण में दानवों को मोहित किया। धनपाल नामक व्यापारी के दुष्ट पुत्र को इस एकादशी के पुण्य से नरक से मुक्ति मिली।', mai: 'विष्णु के मोहिनी अवतार के नाम पर, जिन्होंने अमृत वितरण में दानवों को मोहित किया। धनपाल नामक व्यापारी के दुष्ट पुत्र को इस एकादशी के पुण्य से नरक से मुक्ति मिली।' },
      benefit: { en: 'Destroys illusion (Moha), grants clarity and spiritual progress', hi: 'मोह का नाश, स्पष्टता और आध्यात्मिक प्रगति', sa: 'मोहनाशनम्, आध्यात्मिकप्रगतिः', mr: 'मोह का नाश, स्पष्टता और आध्यात्मिक प्रगति', mai: 'मोह का नाश, स्पष्टता और आध्यात्मिक प्रगति' },
    },
    krishna: {
      name: { en: 'Varuthini Ekadashi', hi: 'वरुथिनी एकादशी', sa: 'वरुथिनीएकादशी', ta: 'வருதினி ஏகாதசி', te: 'వరూథిని ఏకాదశి', bn: 'বরূথিনী একাদশী', kn: 'ವರೂಥಿನಿ ಏಕಾದಶಿ', gu: 'વરૂથિની એકાદશી', mr: 'वरुथिनी एकादशी', mai: 'वरुथिनी एकादशी' },
      story: { en: 'King Mandhata asked about this Ekadashi from the sage Dhaumya. Its merit equals donating thousands of cows, performing Ashwamedha Yagna, and donating gold equivalent to Mount Meru.', hi: 'राजा मान्धाता ने ऋषि धौम्य से इस एकादशी के बारे में पूछा। इसका पुण्य हज़ारों गायों के दान, अश्वमेध यज्ञ और मेरु पर्वत के बराबर सोने के दान के समान है।', sa: 'मान्धाताराजा धौम्यऋषिं पृष्टवान्।', mr: 'राजा मान्धाता ने ऋषि धौम्य से इस एकादशी के बारे में पूछा। इसका पुण्य हज़ारों गायों के दान, अश्वमेध यज्ञ और मेरु पर्वत के बराबर सोने के दान के समान है।', mai: 'राजा मान्धाता ने ऋषि धौम्य से इस एकादशी के बारे में पूछा। इसका पुण्य हज़ारों गायों के दान, अश्वमेध यज्ञ और मेरु पर्वत के बराबर सोने के दान के समान है।' },
      benefit: { en: 'Removes fear of Yamaraja (death), grants protection and merit', hi: 'यमराज का भय दूर करती है, रक्षा और पुण्य प्रदान करती है', sa: 'यमराजभयनिवारणम्, रक्षापुण्यप्रदानम्', mr: 'यमराज का भय दूर करती है, रक्षा और पुण्य प्रदान करती है', mai: 'यमराज का भय दूर करती है, रक्षा और पुण्य प्रदान करती है' },
    },
  },
  jyeshtha: {
    shukla: {
      name: { en: 'Nirjala Ekadashi', hi: 'निर्जला एकादशी', sa: 'निर्जलैकादशी', ta: 'நிர்ஜலா ஏகாதசி', te: 'నిర్జల ఏకాదశి', bn: 'নির্জলা একাদশী', kn: 'ನಿರ್ಜಲಾ ಏಕಾದಶಿ', gu: 'નિર્જલા એકાદશી', mr: 'निर्जला एकादशी', mai: 'निर्जला एकादशी' },
      story: { en: 'Bhima (Bhimsena of the Pandavas), unable to fast on all 24 Ekadashis due to his great hunger, asked Sage Vyasa for an alternative. Vyasa told him that fasting without even water (Nirjala) on this single Ekadashi equals the merit of all 24 combined. Also called Pandava Ekadashi or Bhimseni Ekadashi.', hi: 'भीम अपनी भारी भूख के कारण सभी 24 एकादशियों पर व्रत नहीं रख सकते थे। व्यास मुनि ने कहा कि केवल इस एक एकादशी पर बिना जल के (निर्जला) व्रत रखना सभी 24 के पुण्य के बराबर है।', sa: 'भीमः महाक्षुधायाः कारणात् सर्वासु एकादशीषु व्रतं धारयितुं न अशक्नोत्। व्यासः अवदत् एतस्याम् एकस्याम् निर्जलव्रतं सर्वासां पुण्यसमम्।', mr: 'भीम अपनी भारी भूख के कारण सभी 24 एकादशियों पर व्रत नहीं रख सकते थे। व्यास मुनि ने कहा कि केवल इस एक एकादशी पर बिना जल के (निर्जला) व्रत रखना सभी 24 के पुण्य के बराबर है।', mai: 'भीम अपनी भारी भूख के कारण सभी 24 एकादशियों पर व्रत नहीं रख सकते थे। व्यास मुनि ने कहा कि केवल इस एक एकादशी पर बिना जल के (निर्जला) व्रत रखना सभी 24 के पुण्य के बराबर है।' },
      benefit: { en: 'Equal to observing all 24 Ekadashis. Most powerful Ekadashi of the year. Grants Vaikuntha (Vishnu\'s abode).', hi: 'सभी 24 एकादशियों के बराबर। वर्ष की सबसे शक्तिशाली एकादशी। वैकुण्ठ प्रदान करती है।', sa: 'सर्वासां 24 एकादशीनां समम्। वर्षस्य शक्तिमत्तमा एकादशी।', mr: 'सभी 24 एकादशियों के बराबर। वर्ष की सबसे शक्तिशाली एकादशी। वैकुण्ठ प्रदान करती है।', mai: 'सभी 24 एकादशियों के बराबर। वर्ष की सबसे शक्तिशाली एकादशी। वैकुण्ठ प्रदान करती है।' },
    },
    krishna: {
      name: { en: 'Apara Ekadashi', hi: 'अपरा एकादशी', sa: 'अपरैकादशी', ta: 'அபரா ஏகாதசி', te: 'అపర ఏకాదశి', bn: 'অপরা একাদশী', kn: 'ಅಪರಾ ಏಕಾದಶಿ', gu: 'અપરા એકાદશી', mr: 'अपरा एकादशी', mai: 'अपरा एकादशी' },
      story: { en: 'Lord Krishna told Yudhishthira that this Ekadashi has boundless (Apara = limitless) merit. It destroys sins of warriors, protects reputation, and even redeems ghosts from their cursed state.', hi: 'कृष्ण ने युधिष्ठिर को बताया कि इस एकादशी का अपरिमित (अपरा) पुण्य है।', sa: 'कृष्णः युधिष्ठिरम् अवदत् एतस्याः एकादश्याः अपरिमितं पुण्यम् इति।', mr: 'कृष्ण ने युधिष्ठिर को बताया कि इस एकादशी का अपरिमित (अपरा) पुण्य है।', mai: 'कृष्ण ने युधिष्ठिर को बताया कि इस एकादशी का अपरिमित (अपरा) पुण्य है।' },
      benefit: { en: 'Limitless merit, removes infamy, redeems suffering souls', hi: 'अपरिमित पुण्य, अपयश दूर करती है', sa: 'अपरिमितपुण्यम्, अपयशनिवारणम्', mr: 'अपरिमित पुण्य, अपयश दूर करती है', mai: 'अपरिमित पुण्य, अपयश दूर करती है' },
    },
  },
  ashadha: {
    shukla: {
      name: { en: 'Devshayani Ekadashi', hi: 'देवशयनी एकादशी', sa: 'देवशयनीएकादशी', ta: 'தேவசயனி ஏகாதசி', te: 'దేవశయని ఏకాదశి', bn: 'দেবশয়নী একাদশী', kn: 'ದೇವಶಯನಿ ಏಕಾದಶಿ', gu: 'દેવશયની એકાદશી', mr: 'देवशयनी एकादशी', mai: 'देवशयनी एकादशी' },
      story: { en: 'Lord Vishnu goes to sleep (Yoga Nidra) on the cosmic serpent Shesha on this day, beginning Chaturmas — the four sacred months of the monsoon. He awakens on Prabodhini Ekadashi in Kartika. During this period, auspicious ceremonies like marriages are avoided.', hi: 'इस दिन विष्णु शेषनाग पर योगनिद्रा में जाते हैं, चातुर्मास आरम्भ होता है। कार्तिक में प्रबोधिनी एकादशी पर जागते हैं। इस काल में विवाह जैसे शुभ कार्य नहीं होते।', sa: 'अस्मिन् दिने विष्णुः शेषनागोपरि योगनिद्रां प्रविशति। चातुर्मासः आरभ्यते।', mr: 'इस दिन विष्णु शेषनाग पर योगनिद्रा में जाते हैं, चातुर्मास आरम्भ होता है। कार्तिक में प्रबोधिनी एकादशी पर जागते हैं। इस काल में विवाह जैसे शुभ कार्य नहीं होते।', mai: 'इस दिन विष्णु शेषनाग पर योगनिद्रा में जाते हैं, चातुर्मास आरम्भ होता है। कार्तिक में प्रबोधिनी एकादशी पर जागते हैं। इस काल में विवाह जैसे शुभ कार्य नहीं होते।' },
      benefit: { en: 'Marks the start of Chaturmas. Extremely auspicious for spiritual practices and charity.', hi: 'चातुर्मास का आरम्भ। आध्यात्मिक साधना और दान के लिए अत्यन्त शुभ।', sa: 'चातुर्मासस्य आरम्भः। आध्यात्मिकसाधनादानयोः अत्यन्तशुभम्।', mr: 'चातुर्मास का आरम्भ। आध्यात्मिक साधना और दान के लिए अत्यन्त शुभ।', mai: 'चातुर्मास का आरम्भ। आध्यात्मिक साधना और दान के लिए अत्यन्त शुभ।' },
    },
    krishna: {
      name: { en: 'Yogini Ekadashi', hi: 'योगिनी एकादशी', sa: 'योगिनीएकादशी', ta: 'யோகினி ஏகாதசி', te: 'యోగిని ఏకాదశి', bn: 'যোগিনী একাদশী', kn: 'ಯೋಗಿನಿ ಏಕಾದಶಿ', gu: 'યોગિની એકાદશી', mr: 'योगिनी एकादशी', mai: 'योगिनी एकादशी' },
      story: { en: 'A gardener named Hemamali in Kubera\'s garden neglected his duties due to his wife. He was cursed with leprosy. By observing this Ekadashi, he was cured and restored to his celestial position.', hi: 'कुबेर के उद्यान में हेमामाली नामक माली ने अपनी पत्नी के कारण कर्तव्य की अवहेलना की और कोढ़ का शाप मिला। इस एकादशी से ठीक हुआ।', sa: 'कुबेरस्य उद्याने हेमामाली उद्यानपालः कुष्ठशापं प्राप्तवान्।', mr: 'कुबेर के उद्यान में हेमामाली नामक माली ने अपनी पत्नी के कारण कर्तव्य की अवहेलना की और कोढ़ का शाप मिला। इस एकादशी से ठीक हुआ।', mai: 'कुबेर के उद्यान में हेमामाली नामक माली ने अपनी पत्नी के कारण कर्तव्य की अवहेलना की और कोढ़ का शाप मिला। इस एकादशी से ठीक हुआ।' },
      benefit: { en: 'Cures diseases, removes curses, more meritorious than charity at holy places', hi: 'रोगों से मुक्ति, शापों को हटाती है, तीर्थस्थलों पर दान से अधिक पुण्यदायी', sa: 'रोगमुक्तिः, शापनिवारणम्', mr: 'रोगों से मुक्ति, शापों को हटाती है, तीर्थस्थलों पर दान से अधिक पुण्यदायी', mai: 'रोगों से मुक्ति, शापों को हटाती है, तीर्थस्थलों पर दान से अधिक पुण्यदायी' },
    },
  },
  shravana: {
    shukla: { name: { en: 'Shravana Putrada Ekadashi', hi: 'श्रावण पुत्रदा एकादशी', sa: 'श्रावणपुत्रदैकादशी', ta: 'ஸ்ராவண புத்ரதா ஏகாதசி', te: 'శ్రావణ పుత్రదా ఏకాదశి', bn: 'শ্রাবণ পুত্রদা একাদশী', kn: 'ಶ್ರಾವಣ ಪುತ್ರದಾ ಏಕಾದಶಿ', gu: 'શ્રાવણ પુત્રદા એકાદશી', mr: 'श्रावण पुत्रदा एकादशी', mai: 'श्रावण पुत्रदा एकादशी' }, story: { en: 'King Mahijita had no heir. Sage Lomasa advised observing this Ekadashi for a son. The king and queen fasted, and were blessed with a prince. Putrada = giver of sons. Also known as Pavitropana Ekadashi.', hi: 'राजा महिजित के कोई सन्तान नहीं थी। ऋषि लोमश ने इस एकादशी का व्रत बताया। राजा-रानी ने व्रत रखा और पुत्र प्राप्त हुआ। पवित्रोपना एकादशी भी कहलाती है।', sa: 'महिजितराजा सन्तानहीनः आसीत्। लोमशऋषिः एताम् एकादशीम् अवदत्।', mr: 'राजा महिजित के कोई सन्तान नहीं थी। ऋषि लोमश ने इस एकादशी का व्रत बताया। राजा-रानी ने व्रत रखा और पुत्र प्राप्त हुआ। पवित्रोपना एकादशी भी कहलाती है।', mai: 'राजा महिजित के कोई सन्तान नहीं थी। ऋषि लोमश ने इस एकादशी का व्रत बताया। राजा-रानी ने व्रत रखा और पुत्र प्राप्त हुआ। पवित्रोपना एकादशी भी कहलाती है।' }, benefit: { en: 'Blesses with progeny, especially a son. Fulfils parental wishes.', hi: 'सन्तान, विशेषतः पुत्र का आशीर्वाद। माता-पिता की इच्छा पूर्ण करती है।', sa: 'सन्तानवरदानम्, पुत्रवरदानम्।', mr: 'सन्तान, विशेषतः पुत्र का आशीर्वाद। माता-पिता की इच्छा पूर्ण करती है।', mai: 'सन्तान, विशेषतः पुत्र का आशीर्वाद। माता-पिता की इच्छा पूर्ण करती है।' } },
    krishna: { name: { en: 'Kamika Ekadashi', hi: 'कामिका एकादशी', sa: 'कामिकैकादशी', ta: 'காமிகா ஏகாதசி', te: 'కామిక ఏకాదశి', bn: 'কামিকা একাদশী', kn: 'ಕಾಮಿಕಾ ಏಕಾದಶಿ', gu: 'કામિકા એકાદશી', mr: 'कामिका एकादशी', mai: 'कामिका एकादशी' }, story: { en: 'Lord Brahma narrated this Ekadashi\'s glory to Narada. Offering Tulsi leaves to Vishnu on this day equals donating ten million cows. Even the shadow of a Tulsi plant removes sins.', hi: 'ब्रह्मा ने नारद को इस एकादशी का महत्व बताया। इस दिन विष्णु को तुलसी पत्र अर्पण करना एक करोड़ गायों के दान के बराबर है।', sa: 'ब्रह्मा नारदाय एतस्याः एकादश्याः माहात्म्यम् अकथयत्।', mr: 'ब्रह्मा ने नारद को इस एकादशी का महत्व बताया। इस दिन विष्णु को तुलसी पत्र अर्पण करना एक करोड़ गायों के दान के बराबर है।', mai: 'ब्रह्मा ने नारद को इस एकादशी का महत्व बताया। इस दिन विष्णु को तुलसी पत्र अर्पण करना एक करोड़ गायों के दान के बराबर है।' }, benefit: { en: 'Offering Tulsi on this day multiplies merit infinitely. Removes fear of death.', hi: 'इस दिन तुलसी अर्पण करने से पुण्य अनन्तगुना बढ़ता है। मृत्यु का भय दूर होता है।', sa: 'तुलस्यर्पणेन पुण्यम् अनन्तगुणं वर्धते।', mr: 'इस दिन तुलसी अर्पण करने से पुण्य अनन्तगुना बढ़ता है। मृत्यु का भय दूर होता है।', mai: 'इस दिन तुलसी अर्पण करने से पुण्य अनन्तगुना बढ़ता है। मृत्यु का भय दूर होता है।' } },
  },
  bhadrapada: {
    shukla: { name: { en: 'Parsva Ekadashi', hi: 'पार्श्व एकादशी', sa: 'पार्श्वैकादशी', ta: 'பார்ஸ்வ ஏகாதசி', te: 'పార్శ్వ ఏకాదశి', bn: 'পার্শ্ব একাদশী', kn: 'ಪಾರ್ಶ್ವ ಏಕಾದಶಿ', gu: 'પાર્શ્વ એકાદશી', mr: 'पार्श्व एकादशी', mai: 'पार्श्व एकादशी' }, story: { en: 'Lord Vishnu turns on his side (Parivartini = turning) in his cosmic sleep. King Bali, in Patala, worships Vishnu on this day. Also called Parsva Ekadashi.', hi: 'विष्णु अपनी ब्रह्माण्डीय निद्रा में करवट बदलते हैं (परिवर्तिनी)। पाताल में राजा बलि इस दिन विष्णु की पूजा करते हैं।', sa: 'विष्णुः निद्रायां पार्श्वं परिवर्तयति।', mr: 'विष्णु अपनी ब्रह्माण्डीय निद्रा में करवट बदलते हैं (परिवर्तिनी)। पाताल में राजा बलि इस दिन विष्णु की पूजा करते हैं।', mai: 'विष्णु अपनी ब्रह्माण्डीय निद्रा में करवट बदलते हैं (परिवर्तिनी)। पाताल में राजा बलि इस दिन विष्णु की पूजा करते हैं।' }, benefit: { en: 'Grants the merit of Chaturmas vows. Lord Vishnu is especially gracious this day.', hi: 'चातुर्मास व्रतों का पुण्य प्राप्त होता है।', sa: 'चातुर्मासव्रतानां पुण्यं लभ्यते।', mr: 'चातुर्मास व्रतों का पुण्य प्राप्त होता है।', mai: 'चातुर्मास व्रतों का पुण्य प्राप्त होता है।' } },
    krishna: { name: { en: 'Aja Ekadashi', hi: 'अजा एकादशी', sa: 'अजैकादशी', ta: 'அஜா ஏகாதசி', te: 'అజ ఏకాదశి', bn: 'অজা একাদশী', kn: 'ಅಜಾ ಏಕಾದಶಿ', gu: 'અજા એકાદશી', mr: 'अजा एकादशी', mai: 'अजा एकादशी' }, story: { en: 'King Harishchandra, who lost his kingdom, wife, and son due to his truthfulness, was advised to observe this Ekadashi by Sage Gautama. All his sufferings ended and his kingdom was restored.', hi: 'राजा हरिश्चन्द्र ने सत्यवादिता से अपना राज्य, पत्नी और पुत्र खोया। ऋषि गौतम ने इस एकादशी का व्रत बताया। सभी कष्ट समाप्त हुए।', sa: 'हरिश्चन्द्रराजा सत्यवादित्वात् सर्वं नष्टवान्।', mr: 'राजा हरिश्चन्द्र ने सत्यवादिता से अपना राज्य, पत्नी और पुत्र खोया। ऋषि गौतम ने इस एकादशी का व्रत बताया। सभी कष्ट समाप्त हुए।', mai: 'राजा हरिश्चन्द्र ने सत्यवादिता से अपना राज्य, पत्नी और पुत्र खोया। ऋषि गौतम ने इस एकादशी का व्रत बताया। सभी कष्ट समाप्त हुए।' }, benefit: { en: 'Destroys accumulated suffering, restores lost fortune and honour', hi: 'संचित कष्टों का नाश, खोया सम्मान और भाग्य वापस', sa: 'सञ्चितदुःखनाशनम्, नष्टसम्मानभाग्यप्रत्यावर्तनम्', mr: 'संचित कष्टों का नाश, खोया सम्मान और भाग्य वापस', mai: 'संचित कष्टों का नाश, खोया सम्मान और भाग्य वापस' } },
  },
  ashwina: {
    shukla: { name: { en: 'Papankusha Ekadashi', hi: 'पापांकुशा एकादशी', sa: 'पापाङ्कुशैकादशी', ta: 'பாபாங்குசா ஏகாதசி', te: 'పాపాంకుశ ఏకాదశి', bn: 'পাপাঙ্কুশা একাদশী', kn: 'ಪಾಪಾಂಕುಶ ಏಕಾದಶಿ', gu: 'પાપાંકુશા એકાદશી', mr: 'पापांकुशा एकादशी', mai: 'पापांकुशा एकादशी' }, story: { en: 'Its merit acts as an Ankusha (goad/hook) to control the elephant of Papa (sin). Lord Krishna told Yudhishthira that this Ekadashi is supremely powerful during the auspicious month of Ashwina.', hi: 'इसका पुण्य पाप रूपी हाथी को नियन्त्रित करने वाले अंकुश का काम करता है।', sa: 'एतस्याः पुण्यं पापगजस्य अङ्कुशरूपेण कार्यं करोति।', mr: 'इसका पुण्य पाप रूपी हाथी को नियन्त्रित करने वाले अंकुश का काम करता है।', mai: 'इसका पुण्य पाप रूपी हाथी को नियन्त्रित करने वाले अंकुश का काम करता है।' }, benefit: { en: 'Controls and destroys sins. Grants Vaikuntha after death.', hi: 'पापों को नियन्त्रित और नष्ट करती है। मृत्यु के बाद वैकुण्ठ प्रदान करती है।', sa: 'पापनियन्त्रणं नाशनं च। मृत्यूपरान्तं वैकुण्ठप्रदानम्।', mr: 'पापों को नियन्त्रित और नष्ट करती है। मृत्यु के बाद वैकुण्ठ प्रदान करती है।', mai: 'पापों को नियन्त्रित और नष्ट करती है। मृत्यु के बाद वैकुण्ठ प्रदान करती है।' } },
    krishna: { name: { en: 'Indira Ekadashi', hi: 'इन्दिरा एकादशी', sa: 'इन्दिरैकादशी', ta: 'இந்திரா ஏகாதசி', te: 'ఇందిరా ఏకాదశి', bn: 'ইন্দিরা একাদশী', kn: 'ಇಂದಿರಾ ಏಕಾದಶಿ', gu: 'ઇન્દિરા એકાદશી', mr: 'इन्दिरा एकादशी', mai: 'इन्दिरा एकादशी' }, story: { en: 'King Indrasena\'s deceased father appeared in his dream suffering in Yamaloka. Sage Narada advised the king to observe this Ekadashi to liberate his father\'s soul.', hi: 'राजा इन्द्रसेन के दिवंगत पिता उनके स्वप्न में यमलोक में कष्ट भोगते दिखे। नारद ने इस एकादशी का व्रत बताया।', sa: 'इन्द्रसेनराज्ञः दिवङ्गतपिता स्वप्ने यमलोके कष्टं भोक्तुं दृष्टः।', mr: 'राजा इन्द्रसेन के दिवंगत पिता उनके स्वप्न में यमलोक में कष्ट भोगते दिखे। नारद ने इस एकादशी का व्रत बताया।', mai: 'राजा इन्द्रसेन के दिवंगत पिता उनके स्वप्न में यमलोक में कष्ट भोगते दिखे। नारद ने इस एकादशी का व्रत बताया।' }, benefit: { en: 'Liberates ancestors from suffering. Grants peace to departed souls (Pitru Mukti).', hi: 'पूर्वजों को कष्ट से मुक्ति। दिवंगत आत्माओं को शान्ति (पितृ मुक्ति)।', sa: 'पितॄन् कष्टात् मोचयति। दिवंगतात्मभ्यः शान्तिः।', mr: 'पूर्वजों को कष्ट से मुक्ति। दिवंगत आत्माओं को शान्ति (पितृ मुक्ति)।', mai: 'पूर्वजों को कष्ट से मुक्ति। दिवंगत आत्माओं को शान्ति (पितृ मुक्ति)।' } },
  },
  kartika: {
    shukla: { name: { en: 'Devutthana Ekadashi', hi: 'देवुत्थान एकादशी', sa: 'देवोत्थानैकादशी', ta: 'தேவுத்தான ஏகாதசி', te: 'దేవోత్థాన ఏకాదశి', bn: 'দেবোত্থান একাদশী', kn: 'ದೇವೋತ್ಥಾನ ಏಕಾದಶಿ', gu: 'દેવઉત્થાન એકાદશી', mr: 'देवुत्थान एकादशी', mai: 'देवुत्थान एकादशी' }, story: { en: 'Lord Vishnu awakens (Prabodhini = awakening) from his four-month cosmic sleep. This ends Chaturmas, and the auspicious season for marriages and ceremonies resumes. Also called Devutthani or Dev Prabodhini Ekadashi.', hi: 'विष्णु चार मास की ब्रह्माण्डीय निद्रा से जागते हैं (प्रबोधिनी = जागरण)। चातुर्मास समाप्त होता है, विवाह आदि शुभ कार्य पुनः आरम्भ होते हैं।', sa: 'विष्णुः चातुर्मासनिद्रातः जागर्ति। शुभकार्याणि पुनः आरभ्यन्ते।', mr: 'विष्णु चार मास की ब्रह्माण्डीय निद्रा से जागते हैं (प्रबोधिनी = जागरण)। चातुर्मास समाप्त होता है, विवाह आदि शुभ कार्य पुनः आरम्भ होते हैं।', mai: 'विष्णु चार मास की ब्रह्माण्डीय निद्रा से जागते हैं (प्रबोधिनी = जागरण)। चातुर्मास समाप्त होता है, विवाह आदि शुभ कार्य पुनः आरम्भ होते हैं।' }, benefit: { en: 'Marks the end of Chaturmas. Opening of the marriage season. Extremely auspicious.', hi: 'चातुर्मास का अन्त। विवाह ऋतु का आरम्भ। अत्यन्त शुभ।', sa: 'चातुर्मासान्तः। विवाहर्तोः आरम्भः।', mr: 'चातुर्मास का अन्त। विवाह ऋतु का आरम्भ। अत्यन्त शुभ।', mai: 'चातुर्मास का अन्त। विवाह ऋतु का आरम्भ। अत्यन्त शुभ।' } },
    krishna: { name: { en: 'Rama Ekadashi', hi: 'रमा एकादशी', sa: 'रमैकादशी', ta: 'ரமா ஏகாதசி', te: 'రమా ఏకాదశి', bn: 'রমা একাদশী', kn: 'ರಮಾ ಏಕಾದಶಿ', gu: 'રમા એકાદશી', mr: 'रमा एकादशी', mai: 'रमा एकादशी' }, story: { en: 'Named after Rama (another name for Goddess Lakshmi). A pious king named Muchukunda was advised by the sage Valmiki to observe this fast, which grants more merit than bathing at all pilgrimage sites.', hi: 'रमा (लक्ष्मी का एक नाम) के नाम पर। राजा मुचुकुन्द को ऋषि वाल्मीकि ने यह व्रत बताया।', sa: 'रमायाः (लक्ष्म्याः) नाम्ना। मुचुकुन्दराजा वाल्मीकिमुनेः उपदेशं प्राप्तवान्।', mr: 'रमा (लक्ष्मी का एक नाम) के नाम पर। राजा मुचुकुन्द को ऋषि वाल्मीकि ने यह व्रत बताया।', mai: 'रमा (लक्ष्मी का एक नाम) के नाम पर। राजा मुचुकुन्द को ऋषि वाल्मीकि ने यह व्रत बताया।' }, benefit: { en: 'Grants Lakshmi\'s blessings, removes poverty. More meritorious than all pilgrimages.', hi: 'लक्ष्मी का आशीर्वाद, दरिद्रता दूर करती है। सभी तीर्थयात्राओं से अधिक पुण्यदायी।', sa: 'लक्ष्म्याः आशीर्वादम्, दारिद्र्यनिवारणम्।', mr: 'लक्ष्मी का आशीर्वाद, दरिद्रता दूर करती है। सभी तीर्थयात्राओं से अधिक पुण्यदायी।', mai: 'लक्ष्मी का आशीर्वाद, दरिद्रता दूर करती है। सभी तीर्थयात्राओं से अधिक पुण्यदायी।' } },
  },
  margashirsha: {
    shukla: { name: { en: 'Mokshada Ekadashi', hi: 'मोक्षदा एकादशी', sa: 'मोक्षदैकादशी', ta: 'மோக்ஷதா ஏகாதசி', te: 'మోక్షద ఏకాదశి', bn: 'মোক্ষদা একাদশী', kn: 'ಮೋಕ್ಷದಾ ಏಕಾದಶಿ', gu: 'મોક્ષદા એકાદશી', mr: 'मोक्षदा एकादशी', mai: 'मोक्षदा एकादशी' }, story: { en: 'On this very day, Lord Krishna spoke the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra. Also called Gita Jayanti. The Ekadashi grants Moksha (liberation) — hence the name.', hi: 'इसी दिन कृष्ण ने कुरुक्षेत्र के युद्धभूमि पर अर्जुन को भगवद्गीता सुनाई। गीता जयन्ती भी कहलाती है। मोक्ष प्रदान करने वाली — इसलिए मोक्षदा।', sa: 'अस्मिन् दिने कृष्णः कुरुक्षेत्रे अर्जुनाय भगवद्गीताम् अश्रावयत्। गीताजयन्ती अपि कथ्यते।', mr: 'इसी दिन कृष्ण ने कुरुक्षेत्र के युद्धभूमि पर अर्जुन को भगवद्गीता सुनाई। गीता जयन्ती भी कहलाती है। मोक्ष प्रदान करने वाली — इसलिए मोक्षदा।', mai: 'इसी दिन कृष्ण ने कुरुक्षेत्र के युद्धभूमि पर अर्जुन को भगवद्गीता सुनाई। गीता जयन्ती भी कहलाती है। मोक्ष प्रदान करने वाली — इसलिए मोक्षदा।' }, benefit: { en: 'Grants Moksha (liberation from rebirth). Also celebrates Gita Jayanti. Reading Bhagavad Gita on this day is supremely meritorious.', hi: 'मोक्ष (पुनर्जन्म से मुक्ति) प्रदान करती है। इस दिन गीता पाठ सर्वोत्तम पुण्यदायी है।', sa: 'मोक्षं ददाति। गीतापाठः सर्वोत्तमपुण्यदायकः।', mr: 'मोक्ष (पुनर्जन्म से मुक्ति) प्रदान करती है। इस दिन गीता पाठ सर्वोत्तम पुण्यदायी है।', mai: 'मोक्ष (पुनर्जन्म से मुक्ति) प्रदान करती है। इस दिन गीता पाठ सर्वोत्तम पुण्यदायी है।' } },
    krishna: { name: { en: 'Utpanna Ekadashi', hi: 'उत्पन्ना एकादशी', sa: 'उत्पन्नैकादशी', ta: 'உத்பன்னா ஏகாதசி', te: 'ఉత్పన్న ఏకాదశి', bn: 'উৎপন্না একাদশী', kn: 'ಉತ್ಪನ್ನಾ ಏಕಾದಶಿ', gu: 'ઉત્પન્ના એકાદશી', mr: 'उत्पन्ना एकादशी', mai: 'उत्पन्ना एकादशी' }, story: { en: 'When the demon Mura attacked Vishnu, a divine female form emerged from Vishnu\'s body and slew the demon. She was named "Ekadashi" as she appeared on the 11th day. This is the origin story of all Ekadashi fasts.', hi: 'जब दैत्य मुर ने विष्णु पर आक्रमण किया, विष्णु के शरीर से एक दिव्य स्त्री रूप प्रकट हुआ और दैत्य का वध किया। 11वें दिन प्रकट होने से "एकादशी" नाम पड़ा।', sa: 'यदा मुरदैत्यः विष्णुम् आक्रामत्, विष्णोः शरीरात् दिव्यं स्त्रीरूपम् उत्पन्नम्।', mr: 'जब दैत्य मुर ने विष्णु पर आक्रमण किया, विष्णु के शरीर से एक दिव्य स्त्री रूप प्रकट हुआ और दैत्य का वध किया। 11वें दिन प्रकट होने से "एकादशी" नाम पड़ा।', mai: 'जब दैत्य मुर ने विष्णु पर आक्रमण किया, विष्णु के शरीर से एक दिव्य स्त्री रूप प्रकट हुआ और दैत्य का वध किया। 11वें दिन प्रकट होने से "एकादशी" नाम पड़ा।' }, benefit: { en: 'The "mother" of all Ekadashis. Observing this one is the foundation of all Ekadashi observances.', hi: 'सभी एकादशियों की "माता"। इसका पालन सभी एकादशी व्रतों का आधार है।', sa: 'सर्वासाम् एकादशीनां "माता"।', mr: 'सभी एकादशियों की "माता"। इसका पालन सभी एकादशी व्रतों का आधार है।', mai: 'सभी एकादशियों की "माता"। इसका पालन सभी एकादशी व्रतों का आधार है।' } },
  },
  pausha: {
    shukla: { name: { en: 'Putrada Ekadashi', hi: 'पुत्रदा एकादशी', sa: 'पुत्रदैकादशी', ta: 'புத்ரதா ஏகாதசி', te: 'పుత్రదా ఏకాదశి', bn: 'পুত্রদা একাদশী', kn: 'ಪುತ್ರದಾ ಏಕಾದಶಿ', gu: 'પુત્રદા એકાદશી', mr: 'पुत्रदा एकादशी', mai: 'पुत्रदा एकादशी' }, story: { en: 'Similar to Shravana Putrada but falls in Pausha. King Suketumana had no heir and observed this Ekadashi as advised by sages. He was blessed with a virtuous son.', hi: 'श्रावण पुत्रदा के समान किन्तु पौष में। राजा सुकेतुमान ने ऋषियों की सलाह पर इस एकादशी का व्रत रखा और पुत्ररत्न प्राप्त हुआ।', sa: 'श्रावणपुत्रदासमाना किन्तु पौषमासे। सुकेतुमानराजा ऋषीणाम् उपदेशेन एताम् एकादशीम् अवर्तयत्।', mr: 'श्रावण पुत्रदा के समान किन्तु पौष में। राजा सुकेतुमान ने ऋषियों की सलाह पर इस एकादशी का व्रत रखा और पुत्ररत्न प्राप्त हुआ।', mai: 'श्रावण पुत्रदा के समान किन्तु पौष में। राजा सुकेतुमान ने ऋषियों की सलाह पर इस एकादशी का व्रत रखा और पुत्ररत्न प्राप्त हुआ।' }, benefit: { en: 'Grants progeny, especially a virtuous son. Removes obstacles to parenthood.', hi: 'सन्तान, विशेषतः सुयोग्य पुत्र प्रदान करती है।', sa: 'सन्तानं, सद्गुणपुत्रं च ददाति।', mr: 'सन्तान, विशेषतः सुयोग्य पुत्र प्रदान करती है।', mai: 'सन्तान, विशेषतः सुयोग्य पुत्र प्रदान करती है।' } },
    krishna: { name: { en: 'Safala Ekadashi', hi: 'सफला एकादशी', sa: 'सफलैकादशी', ta: 'சபலா ஏகாதசி', te: 'సఫల ఏకాదశి', bn: 'সফলা একাদশী', kn: 'ಸಫಲಾ ಏಕಾದಶಿ', gu: 'સફલા એકાદશી', mr: 'सफला एकादशी', mai: 'सफला एकादशी' }, story: { en: 'A wicked prince named Lumpaka lived an immoral life. One day, by circumstance, he stayed awake all night in a Vishnu temple on Ekadashi without food. This unintentional observance purified him completely.', hi: 'लुम्पक नामक दुष्ट राजकुमार ने अनैतिक जीवन जिया। एक दिन संयोग से एकादशी पर विष्णु मन्दिर में बिना भोजन रात भर जागा। इस अनजाने व्रत ने उसे शुद्ध कर दिया।', sa: 'लुम्पकनामा दुष्टराजकुमारः। संयोगात् एकादश्यां विष्णुमन्दिरे निराहारः सर्वां रात्रिम् अजागर्त।', mr: 'लुम्पक नामक दुष्ट राजकुमार ने अनैतिक जीवन जिया। एक दिन संयोग से एकादशी पर विष्णु मन्दिर में बिना भोजन रात भर जागा। इस अनजाने व्रत ने उसे शुद्ध कर दिया।', mai: 'लुम्पक नामक दुष्ट राजकुमार ने अनैतिक जीवन जिया। एक दिन संयोग से एकादशी पर विष्णु मन्दिर में बिना भोजन रात भर जागा। इस अनजाने व्रत ने उसे शुद्ध कर दिया।' }, benefit: { en: 'Grants success (Safala = fruitful) in all endeavours. Even accidental observance gives merit.', hi: 'सभी प्रयासों में सफलता (सफला) प्रदान करती है।', sa: 'सर्वप्रयासेषु सफलतां ददाति।', mr: 'सभी प्रयासों में सफलता (सफला) प्रदान करती है।', mai: 'सभी प्रयासों में सफलता (सफला) प्रदान करती है।' } },
  },
  magha: {
    shukla: { name: { en: 'Jaya Ekadashi', hi: 'जया एकादशी', sa: 'जयैकादशी', ta: 'ஜயா ஏகாதசி', te: 'జయ ఏకాదశి', bn: 'জয়া একাদশী', kn: 'ಜಯಾ ಏಕಾದಶಿ', gu: 'જયા એકાદશી', mr: 'जया एकादशी', mai: 'जया एकादशी' }, story: { en: 'Two celestial attendants of Lord Indra — Malyavan and Pushpavati — were cursed by Indra for embracing in his court. They became ghosts (Pishacha). By the merit of Jaya Ekadashi, they were freed from the curse.', hi: 'इन्द्र के दो सेवक — माल्यवान और पुष्पवती — इन्द्र के दरबार में आलिंगन के लिए शापित हुए और पिशाच बने। जया एकादशी के पुण्य से शाप मुक्त हुए।', sa: 'इन्द्रस्य सेवकौ — माल्यवान् पुष्पवती च — शापात् पिशाचौ अभवताम्।', mr: 'इन्द्र के दो सेवक — माल्यवान और पुष्पवती — इन्द्र के दरबार में आलिंगन के लिए शापित हुए और पिशाच बने। जया एकादशी के पुण्य से शाप मुक्त हुए।', mai: 'इन्द्र के दो सेवक — माल्यवान और पुष्पवती — इन्द्र के दरबार में आलिंगन के लिए शापित हुए और पिशाच बने। जया एकादशी के पुण्य से शाप मुक्त हुए।' }, benefit: { en: 'Grants victory (Jaya) over enemies and obstacles. Frees souls from ghostly existence.', hi: 'शत्रुओं और बाधाओं पर विजय (जया) प्रदान करती है।', sa: 'शत्रुबाधोपरि विजयं (जयाम्) ददाति।', mr: 'शत्रुओं और बाधाओं पर विजय (जया) प्रदान करती है।', mai: 'शत्रुओं और बाधाओं पर विजय (जया) प्रदान करती है।' } },
    krishna: { name: { en: 'Shattila Ekadashi', hi: 'षटतिला एकादशी', sa: 'षट्तिलैकादशी', ta: 'ஷட்டில ஏகாதசி', te: 'షట్తిల ఏకాదశి', bn: 'ষটতিলা একাদশী', kn: 'ಷಟ್ಟಿಲ ಏಕಾದಶಿ', gu: 'ષટતિલા એકાદશી', mr: 'षटतिला एकादशी', mai: 'षटतिला एकादशी' }, story: { en: 'Named for the six (Shat) uses of sesame (Tila) on this day: bathing with sesame, applying sesame paste, offering homa with sesame, offering water with sesame, eating sesame, and donating sesame.', hi: 'इस दिन तिल (तिला) के छह (षट्) उपयोगों के नाम पर: तिल से स्नान, तिल का लेप, तिल से हवन, तिल से तर्पण, तिल खाना, तिल दान।', sa: 'षड्भिः (षट्) तिलप्रयोगैः नामितम्।', mr: 'इस दिन तिल (तिला) के छह (षट्) उपयोगों के नाम पर: तिल से स्नान, तिल का लेप, तिल से हवन, तिल से तर्पण, तिल खाना, तिल दान।', mai: 'इस दिन तिल (तिला) के छह (षट्) उपयोगों के नाम पर: तिल से स्नान, तिल का लेप, तिल से हवन, तिल से तर्पण, तिल खाना, तिल दान।' }, benefit: { en: 'Donating sesame removes poverty. Protects against cold-weather ailments.', hi: 'तिल दान दरिद्रता दूर करता है।', sa: 'तिलदानं दारिद्र्यं निवारयति।', mr: 'तिल दान दरिद्रता दूर करता है।', mai: 'तिल दान दरिद्रता दूर करता है।' } },
  },
  phalguna: {
    shukla: { name: { en: 'Amalaki Ekadashi', hi: 'आमलकी एकादशी', sa: 'आमलकीएकादशी', ta: 'ஆமலகி ஏகாதசி', te: 'ఆమలకి ఏకాదశి', bn: 'আমলকী একাদশী', kn: 'ಆಮಲಕಿ ಏಕಾದಶಿ', gu: 'આમલકી એકાદશી', mr: 'आमलकी एकादशी', mai: 'आमलकी एकादशी' }, story: { en: 'Named after the Amalaki (Indian gooseberry/Amla) tree, which is considered a manifestation of Lord Vishnu. A hunter, despite his sinful life, once stayed awake under an Amla tree on this Ekadashi and was freed from all sins.', hi: 'आमलकी (आँवला) वृक्ष के नाम पर, जो विष्णु का स्वरूप माना जाता है। एक पापी शिकारी इस एकादशी पर आँवले के पेड़ के नीचे जागता रहा और सभी पापों से मुक्त हुआ।', sa: 'आमलकीवृक्षस्य नाम्ना, यः विष्णोः स्वरूपं मन्यते।', mr: 'आमलकी (आँवला) वृक्ष के नाम पर, जो विष्णु का स्वरूप माना जाता है। एक पापी शिकारी इस एकादशी पर आँवले के पेड़ के नीचे जागता रहा और सभी पापों से मुक्त हुआ।', mai: 'आमलकी (आँवला) वृक्ष के नाम पर, जो विष्णु का स्वरूप माना जाता है। एक पापी शिकारी इस एकादशी पर आँवले के पेड़ के नीचे जागता रहा और सभी पापों से मुक्त हुआ।' }, benefit: { en: 'Worshipping the Amla tree on this day equals donating a thousand cows. The tree is Vishnu incarnate.', hi: 'इस दिन आँवले के वृक्ष की पूजा सहस्र गायों के दान के बराबर है।', sa: 'अस्मिन् दिने आमलकीवृक्षपूजनं सहस्रगवां दानसमम्।', mr: 'इस दिन आँवले के वृक्ष की पूजा सहस्र गायों के दान के बराबर है।', mai: 'इस दिन आँवले के वृक्ष की पूजा सहस्र गायों के दान के बराबर है।' } },
    krishna: { name: { en: 'Vijaya Ekadashi', hi: 'विजया एकादशी', sa: 'विजयैकादशी', ta: 'விஜயா ஏகாதசி', te: 'విజయ ఏకాదశి', bn: 'বিজয়া একাদশী', kn: 'ವಿಜಯಾ ಏಕಾದಶಿ', gu: 'વિજયા એકાદશી', mr: 'विजया एकादशी', mai: 'विजया एकादशी' }, story: { en: 'Before building the bridge to Lanka, Lord Rama observed this Ekadashi as advised by Sage Bakadalbhya, gaining certain victory. Vijaya = victory. This Ekadashi ensures success in difficult undertakings.', hi: 'लंका पर सेतु बनाने से पहले, राम ने ऋषि बकदाल्भ्य की सलाह पर इस एकादशी का व्रत रखा और निश्चित विजय प्राप्त की। विजया = विजय।', sa: 'लङ्कासेतुनिर्माणात् पूर्वं रामः बकदाल्भ्यऋषेः उपदेशेन एताम् एकादशीम् अवर्तयत्।', mr: 'लंका पर सेतु बनाने से पहले, राम ने ऋषि बकदाल्भ्य की सलाह पर इस एकादशी का व्रत रखा और निश्चित विजय प्राप्त की। विजया = विजय।', mai: 'लंका पर सेतु बनाने से पहले, राम ने ऋषि बकदाल्भ्य की सलाह पर इस एकादशी का व्रत रखा और निश्चित विजय प्राप्त की। विजया = विजय।' }, benefit: { en: 'Guarantees victory in all battles and undertakings. Lord Rama himself observed this fast.', hi: 'सभी युद्धों और कार्यों में विजय की गारण्टी। स्वयं राम ने यह व्रत रखा था।', sa: 'सर्वयुद्धकार्येषु विजयं सुनिश्चितं करोति।', mr: 'सभी युद्धों और कार्यों में विजय की गारण्टी। स्वयं राम ने यह व्रत रखा था।', mai: 'सभी युद्धों और कार्यों में विजय की गारण्टी। स्वयं राम ने यह व्रत रखा था।' } },
  },
};

/* ═══════════════════════════════════════════
   CATEGORY-LEVEL DETAILS (Purnima, Amavasya, etc.)
   ═══════════════════════════════════════════ */

export const CATEGORY_DETAILS: Record<string, FestivalDetail> = {
  purnima: {
    name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्', ta: 'பூர்ணிமா விரதம்', te: 'పూర్ణిమ వ్రతం', bn: 'পূর্ণিমা ব্রত', kn: 'ಪೂರ್ಣಿಮಾ ವ್ರತ', gu: 'પૂર્ણિમા વ્રત', mr: 'पूर्णिमा व्रत', mai: 'पूर्णिमा व्रत' },
    mythology: { en: 'The full moon is considered a manifestation of Soma (the Moon God) at peak strength. In Vedic texts, Purnima is associated with abundance, completion, and the harvest of spiritual merit. The mind (Manas) is said to be most powerfully influenced by the Moon on this night.', hi: 'पूर्णिमा को सोम (चन्द्र देव) की चरम शक्ति का प्रकटीकरण माना जाता है। वैदिक ग्रन्थों में पूर्णिमा को प्रचुरता, पूर्णता और आध्यात्मिक पुण्य से जोड़ा जाता है।', sa: 'पूर्णिमा सोमस्य चरमशक्तेः प्रकटीकरणम्।', mr: 'पूर्णिमा को सोम (चन्द्र देव) की चरम शक्ति का प्रकटीकरण माना जाता है। वैदिक ग्रन्थों में पूर्णिमा को प्रचुरता, पूर्णता और आध्यात्मिक पुण्य से जोड़ा जाता है।', mai: 'पूर्णिमा को सोम (चन्द्र देव) की चरम शक्ति का प्रकटीकरण माना जाता है। वैदिक ग्रन्थों में पूर्णिमा को प्रचुरता, पूर्णता और आध्यात्मिक पुण्य से जोड़ा जाता है।' },
    observance: { en: 'Fast from sunrise to moonrise. Perform Satyanarayan Puja. Offer water (Arghya) to the Moon. Donate food and clothes. Take a holy bath. Recite Vishnu Sahasranama.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। सत्यनारायण पूजा। चन्द्र को अर्घ्य। अन्न और वस्त्र दान।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। सत्यनारायणपूजा। चन्द्राय अर्घ्यम्।', mr: 'सूर्योदय से चन्द्रोदय तक उपवास। सत्यनारायण पूजा। चन्द्र को अर्घ्य। अन्न और वस्त्र दान।', mai: 'सूर्योदय से चन्द्रोदय तक उपवास। सत्यनारायण पूजा। चन्द्र को अर्घ्य। अन्न और वस्त्र दान।' },
    significance: { en: 'Each Purnima has a specific name and significance based on the Hindu month. The full moon amplifies the effects of prayers, meditation, and charity. Considered the best day for Satyanarayan Katha.', hi: 'प्रत्येक पूर्णिमा का हिन्दू महीने के आधार पर विशेष नाम और महत्व है। पूर्णिमा प्रार्थना, ध्यान और दान के प्रभावों को बढ़ाती है।', sa: 'प्रत्येका पूर्णिमा हिन्दुमासस्य आधारेण विशेषं नाम महत्त्वं च धारयति।', mr: 'प्रत्येक पूर्णिमा का हिन्दू महीने के आधार पर विशेष नाम और महत्व है। पूर्णिमा प्रार्थना, ध्यान और दान के प्रभावों को बढ़ाती है।', mai: 'प्रत्येक पूर्णिमा का हिन्दू महीने के आधार पर विशेष नाम और महत्व है। पूर्णिमा प्रार्थना, ध्यान और दान के प्रभावों को बढ़ाती है।' },
    deity: { en: 'Lord Vishnu / Chandra (Moon)', hi: 'भगवान विष्णु / चन्द्र', sa: 'विष्णुः / चन्द्रः', ta: 'விஷ்ணு / சந்திரன்', te: 'విష్ణువు / చంద్రుడు', bn: 'বিষ্ণু / চন্দ্র', kn: 'ವಿಷ್ಣು / ಚಂದ್ರ', gu: 'વિષ્ણુ / ચંદ્ર', mr: 'भगवान विष्णु / चन्द्र', mai: 'भगवान विष्णु / चन्द्र' },
    isFast: true,
    fastNote: { en: 'Fast from sunrise until moonrise. Break fast after sighting the full moon and offering Arghya.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। पूर्ण चन्द्र दर्शन और अर्घ्य के बाद पारण।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। पूर्णचन्द्रदर्शनार्घ्यानन्तरं पारणम्।', mr: 'सूर्योदय से चन्द्रोदय तक उपवास। पूर्ण चन्द्र दर्शन और अर्घ्य के बाद पारण।', mai: 'सूर्योदय से चन्द्रोदय तक उपवास। पूर्ण चन्द्र दर्शन और अर्घ्य के बाद पारण।' },
  },
  amavasya: {
    name: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावास्या', ta: 'அமாவாசை', te: 'అమావాస్య', bn: 'অমাবস্যা', kn: 'ಅಮಾವಾಸ್ಯೆ', gu: 'અમાવસ્યા', mr: 'अमावस्या', mai: 'अमावस्या' },
    mythology: { en: 'Amavasya (new moon) is the day when the Sun and Moon are in conjunction. It is dedicated to the Pitrs (ancestors). In the Garuda Purana, Lord Vishnu describes how offerings made on Amavasya reach the departed souls and satisfy them for an entire month.', hi: 'अमावस्या (अमा = एक साथ, वस्या = निवास) वह दिन है जब सूर्य और चन्द्र युति में होते हैं। यह पितरों को समर्पित है।', sa: 'अमावास्या तद् दिनं यदा सूर्यचन्द्रौ युत्यां स्तः। पितृभ्यः समर्पिता।', mr: 'अमावस्या (अमा = एक साथ, वस्या = निवास) वह दिन है जब सूर्य और चन्द्र युति में होते हैं। यह पितरों को समर्पित है।', mai: 'अमावस्या (अमा = एक साथ, वस्या = निवास) वह दिन है जब सूर्य और चन्द्र युति में होते हैं। यह पितरों को समर्पित है।' },
    observance: { en: 'Perform Tarpan (offering water with sesame to ancestors). Visit Peepal tree and circumambulate. Donate food to Brahmins. Avoid starting new ventures. Recite Pitru Stotram. Some observe a full fast.', hi: 'पितरों को तिल-जल से तर्पण करें। पीपल वृक्ष की परिक्रमा करें। ब्राह्मणों को भोजन दान करें। नए कार्य आरम्भ न करें।', sa: 'पितृभ्यः तिलजलेन तर्पणं करोतु। पीपलवृक्षं परिक्रामतु।', mr: 'पितरों को तिल-जल से तर्पण करें। पीपल वृक्ष की परिक्रमा करें। ब्राह्मणों को भोजन दान करें। नए कार्य आरम्भ न करें।', mai: 'पितरों को तिल-जल से तर्पण करें। पीपल वृक्ष की परिक्रमा करें। ब्राह्मणों को भोजन दान करें। नए कार्य आरम्भ न करें।' },
    significance: { en: 'The darkest night — ideal for introspection and connecting with ancestors. Spiritual practices done on Amavasya are said to have deep, transformative effects. The energy is inward and contemplative.', hi: 'सबसे अन्धेरी रात — आत्मनिरीक्षण और पूर्वजों से जुड़ने के लिए आदर्श।', sa: 'अन्धकारतमा रात्रिः — आत्मनिरीक्षणार्थं पूर्वजसम्बन्धार्थं च आदर्शा।', mr: 'सबसे अन्धेरी रात — आत्मनिरीक्षण और पूर्वजों से जुड़ने के लिए आदर्श।', mai: 'सबसे अन्धेरी रात — आत्मनिरीक्षण और पूर्वजों से जुड़ने के लिए आदर्श।' },
    deity: { en: 'Pitrs (Ancestors)', hi: 'पितृ (पूर्वज)', sa: 'पितरः', ta: 'பித்ருக்கள் (முன்னோர்)', te: 'పితృదేవతలు (పూర్వీకులు)', bn: 'পিতৃগণ (পূর্বপুরুষ)', kn: 'ಪಿತೃಗಳು (ಪೂರ್ವಜರು)', gu: 'પિતૃ (પૂર્વજ)', mr: 'पितृ (पूर्वज)', mai: 'पितृ (पूर्वज)' },
  },
  chaturthi: {
    name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टिचतुर्थी', ta: 'சங்கஷ்ட சதுர்த்தி', te: 'సంకష్ట చతుర్థి', bn: 'সংকষ্টী চতুর্থী', kn: 'ಸಂಕಷ್ಟ ಚತುರ್ಥಿ', gu: 'સંકષ્ટી ચતુર્થી', mr: 'संकष्टी चतुर्थी', mai: 'संकष्टी चतुर्थी' },
    mythology: { en: 'Sankashti means "deliverance from difficult times." Lord Ganesha promised that whoever observes this monthly fast and worships him during moonrise will be freed from all obstacles. Each month\'s Sankashti is associated with a different form of Ganesha and a specific temple.', hi: 'संकष्टी का अर्थ है "कठिन समय से मुक्ति"। गणेश ने वचन दिया कि जो इस मासिक व्रत का पालन करेगा और चन्द्रोदय पर उनकी पूजा करेगा, वह सभी बाधाओं से मुक्त होगा।', sa: 'सङ्कष्टी "कठिनकालात् मुक्तिः" इत्यर्थः।', mr: 'संकष्टी का अर्थ है "कठिन समय से मुक्ति"। गणेश ने वचन दिया कि जो इस मासिक व्रत का पालन करेगा और चन्द्रोदय पर उनकी पूजा करेगा, वह सभी बाधाओं से मुक्त होगा।', mai: 'संकष्टी का अर्थ है "कठिन समय से मुक्ति"। गणेश ने वचन दिया कि जो इस मासिक व्रत का पालन करेगा और चन्द्रोदय पर उनकी पूजा करेगा, वह सभी बाधाओं से मुक्त होगा।' },
    observance: { en: 'Fast from sunrise until moonrise. Prepare and offer modak and durva grass to Ganesha. Recite Sankashti Ganapati Stotra. Break fast only after sighting the moon and completing puja. If the moon is not visible due to clouds, fast until the next day.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। गणेश को मोदक और दूर्वा अर्पित करें। संकष्टी गणपति स्तोत्र का पाठ करें। चन्द्र दर्शन के बाद ही पारण करें।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। गणेशाय मोदकं दूर्वां च अर्पयतु। चन्द्रदर्शनानन्तरं पारणम्।', mr: 'सूर्योदय से चन्द्रोदय तक उपवास। गणेश को मोदक और दूर्वा अर्पित करें। संकष्टी गणपति स्तोत्र का पाठ करें। चन्द्र दर्शन के बाद ही पारण करें।', mai: 'सूर्योदय से चन्द्रोदय तक उपवास। गणेश को मोदक और दूर्वा अर्पित करें। संकष्टी गणपति स्तोत्र का पाठ करें। चन्द्र दर्शन के बाद ही पारण करें।' },
    significance: { en: 'Monthly worship of the Remover of Obstacles (Vighnaharta). Falling on Krishna Chaturthi (4th day of waning moon), it carries the energy of perseverance through the dark half of the lunar cycle.', hi: 'विघ्नहर्ता की मासिक पूजा। कृष्ण चतुर्थी (ढलते चन्द्र का 4वाँ दिन) पर।', sa: 'विघ्नहर्तुः मासिकपूजनम्।', mr: 'विघ्नहर्ता की मासिक पूजा। कृष्ण चतुर्थी (ढलते चन्द्र का 4वाँ दिन) पर।', mai: 'विघ्नहर्ता की मासिक पूजा। कृष्ण चतुर्थी (ढलते चन्द्र का 4वाँ दिन) पर।' },
    deity: { en: 'Lord Ganesha', hi: 'भगवान गणेश', sa: 'गणेशः', ta: 'விநாயகர்', te: 'గణేశుడు', bn: 'গণেশ', kn: 'ಗಣೇಶ', gu: 'ગણેશ', mr: 'भगवान गणेश', mai: 'भगवान गणेश' },
    isFast: true,
    fastNote: { en: 'Fast from sunrise until moonrise. Break fast only after sighting the moon and offering prayers.', hi: 'सूर्योदय से चन्द्रोदय तक उपवास। चन्द्र दर्शन और प्रार्थना के बाद ही पारण।', sa: 'सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः। चन्द्रदर्शनप्रार्थनानन्तरं पारणम्।', mr: 'सूर्योदय से चन्द्रोदय तक उपवास। चन्द्र दर्शन और प्रार्थना के बाद ही पारण।', mai: 'सूर्योदय से चन्द्रोदय तक उपवास। चन्द्र दर्शन और प्रार्थना के बाद ही पारण।' },
  },
  pradosham: {
    name: { en: 'Pradosham', hi: 'प्रदोष', sa: 'प्रदोषः', ta: 'பிரதோஷம்', te: 'ప్రదోషం', bn: 'প্রদোষ', kn: 'ಪ್ರದೋಷ', gu: 'પ્રદોષ', mr: 'प्रदोष', mai: 'प्रदोष' },
    mythology: { en: 'During the churning of the ocean (Samudra Manthan), the deadly poison Halahala emerged during the twilight (Pradosha) hour. Lord Shiva consumed it to save creation, and Parvati held his throat to prevent the poison from descending, turning it blue. This twilight hour became sacred to Shiva.', hi: 'समुद्र मन्थन में संध्याकाल (प्रदोष) में हलाहल विष निकला। शिव ने सृष्टि बचाने के लिए इसे पी लिया, पार्वती ने उनका कण्ठ पकड़कर विष को नीचे जाने से रोका — कण्ठ नीला हो गया।', sa: 'समुद्रमन्थने प्रदोषकाले हालाहलविषम् उद्भूतम्। शिवः सृष्टिरक्षार्थं तत् अपिबत्।', mr: 'समुद्र मन्थन में संध्याकाल (प्रदोष) में हलाहल विष निकला। शिव ने सृष्टि बचाने के लिए इसे पी लिया, पार्वती ने उनका कण्ठ पकड़कर विष को नीचे जाने से रोका — कण्ठ नीला हो गया।', mai: 'समुद्र मन्थन में संध्याकाल (प्रदोष) में हलाहल विष निकला। शिव ने सृष्टि बचाने के लिए इसे पी लिया, पार्वती ने उनका कण्ठ पकड़कर विष को नीचे जाने से रोका — कण्ठ नीला हो गया।' },
    observance: { en: 'Worship Lord Shiva during the Pradosha Kaal — the 1.5-hour window before and after sunset (approximately 4:30 PM to 7:30 PM). Offer Bel leaves, milk, and flowers. Recite Maha Mrityunjaya Mantra. Visit a Shiva temple if possible.', hi: 'प्रदोष काल में शिव पूजा — सूर्यास्त से पहले और बाद 1.5 घण्टे (लगभग शाम 4:30 से 7:30)। बेलपत्र, दूध और फूल अर्पित करें। महामृत्युंजय मन्त्र का जाप करें।', sa: 'प्रदोषकाले शिवपूजनम् — सूर्यास्तात् पूर्वं परं च 1.5 होरायाम्।', mr: 'प्रदोष काल में शिव पूजा — सूर्यास्त से पहले और बाद 1.5 घण्टे (लगभग शाम 4:30 से 7:30)। बेलपत्र, दूध और फूल अर्पित करें। महामृत्युंजय मन्त्र का जाप करें।', mai: 'प्रदोष काल में शिव पूजा — सूर्यास्त से पहले और बाद 1.5 घण्टे (लगभग शाम 4:30 से 7:30)। बेलपत्र, दूध और फूल अर्पित करें। महामृत्युंजय मन्त्र का जाप करें।' },
    significance: { en: 'The Trayodashi (13th tithi) combined with twilight is supremely sacred to Lord Shiva. Pradosham falling on Saturday (Shani Pradosham) is especially powerful for removing Saturn\'s afflictions.', hi: 'त्रयोदशी और संध्याकाल का संयोग शिव के लिए परम पवित्र है। शनिवार का प्रदोष (शनि प्रदोष) शनि पीड़ा निवारण में विशेष शक्तिशाली है।', sa: 'त्रयोदशीसन्ध्याकालयोः संयोगः शिवार्थं परमपवित्रः।', mr: 'त्रयोदशी और संध्याकाल का संयोग शिव के लिए परम पवित्र है। शनिवार का प्रदोष (शनि प्रदोष) शनि पीड़ा निवारण में विशेष शक्तिशाली है।', mai: 'त्रयोदशी और संध्याकाल का संयोग शिव के लिए परम पवित्र है। शनिवार का प्रदोष (शनि प्रदोष) शनि पीड़ा निवारण में विशेष शक्तिशाली है।' },
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव', sa: 'शिवः', ta: 'சிவபெருமான்', te: 'శివుడు', bn: 'শিব', kn: 'ಶಿವ', gu: 'શિવ', mr: 'भगवान शिव', mai: 'भगवान शिव' },
  },
  ekadashi: {
    name: { en: 'Ekadashi Vrat', hi: 'एकादशी व्रत', sa: 'एकादशीव्रतम्', ta: 'ஏகாதசி விரதம்', te: 'ఏకాదశి వ్రతం', bn: 'একাদশী ব্রত', kn: 'ಏಕಾದಶಿ ವ್ರತ', gu: 'એકાદશી વ્રત', mr: 'एकादशी व्रत', mai: 'एकादशी व्रत' },
    mythology: { en: 'When the demon Mura attacked Lord Vishnu, a divine feminine power emerged from Vishnu\'s body on the 11th day (Ekadashi) of the lunar fortnight and destroyed the demon. Vishnu declared that fasting on this day would please him more than any other offering. The 24 Ekadashis are described in the Padma Purana, each with a unique name and story.', hi: 'जब मुर दैत्य ने विष्णु पर आक्रमण किया, चान्द्र पक्ष के 11वें दिन (एकादशी) पर विष्णु के शरीर से एक दिव्य स्त्री शक्ति प्रकट हुई और दैत्य का वध किया। 24 एकादशियों का वर्णन पद्म पुराण में है।', sa: 'यदा मुरदैत्यः विष्णुम् आक्रामत्, चान्द्रपक्षस्य एकादशदिने विष्णोः शरीरात् दिव्या स्त्रीशक्तिः उत्पन्ना।', mr: 'जब मुर दैत्य ने विष्णु पर आक्रमण किया, चान्द्र पक्ष के 11वें दिन (एकादशी) पर विष्णु के शरीर से एक दिव्य स्त्री शक्ति प्रकट हुई और दैत्य का वध किया। 24 एकादशियों का वर्णन पद्म पुराण में है।', mai: 'जब मुर दैत्य ने विष्णु पर आक्रमण किया, चान्द्र पक्ष के 11वें दिन (एकादशी) पर विष्णु के शरीर से एक दिव्य स्त्री शक्ति प्रकट हुई और दैत्य का वध किया। 24 एकादशियों का वर्णन पद्म पुराण में है।' },
    observance: { en: 'Complete fast from grains and beans (Anna). Most observers eat fruits, milk, and root vegetables. Nirjala (waterless) fasting gives the highest merit. Recite Vishnu Sahasranama and meditate on Lord Vishnu. Stay awake as late as possible. Break fast (Parana) on Dwadashi (12th day) morning within the prescribed window.', hi: 'अन्न और दालों से पूर्ण उपवास। अधिकांश व्रती फल, दूध और कन्दमूल खाते हैं। निर्जला (जलरहित) व्रत सर्वोच्च पुण्यदायी। विष्णु सहस्रनाम का पाठ करें। द्वादशी (12वें दिन) प्रातः पारण करें।', sa: 'अन्नदालेभ्यः पूर्णम् उपवासम्। फलं, क्षीरं, कन्दमूलानि च खादतु। द्वादश्यां प्रातः पारणम्।', mr: 'अन्न और दालों से पूर्ण उपवास। अधिकांश व्रती फल, दूध और कन्दमूल खाते हैं। निर्जला (जलरहित) व्रत सर्वोच्च पुण्यदायी। विष्णु सहस्रनाम का पाठ करें। द्वादशी (12वें दिन) प्रातः पारण करें।', mai: 'अन्न और दालों से पूर्ण उपवास। अधिकांश व्रती फल, दूध और कन्दमूल खाते हैं। निर्जला (जलरहित) व्रत सर्वोच्च पुण्यदायी। विष्णु सहस्रनाम का पाठ करें। द्वादशी (12वें दिन) प्रातः पारण करें।' },
    significance: { en: 'Ekadashi is Vishnu\'s most beloved tithi. The Padma Purana states that the merit of all pilgrimages, all charities, and all sacrifices combined is less than observing a single Ekadashi fast. Each of the 24 yearly Ekadashis has a unique name, story, and specific benefit.', hi: 'एकादशी विष्णु की सबसे प्रिय तिथि है। पद्म पुराण कहता है कि सभी तीर्थयात्राओं, दानों और यज्ञों का संयुक्त पुण्य एक एकादशी व्रत से कम है।', sa: 'एकादशी विष्णोः प्रियतमा तिथिः। पद्मपुराणं वदति सर्वतीर्थदानयज्ञानां संयुक्तपुण्यम् एकैकादशीव्रतात् न्यूनम् इति।', mr: 'एकादशी विष्णु की सबसे प्रिय तिथि है। पद्म पुराण कहता है कि सभी तीर्थयात्राओं, दानों और यज्ञों का संयुक्त पुण्य एक एकादशी व्रत से कम है।', mai: 'एकादशी विष्णु की सबसे प्रिय तिथि है। पद्म पुराण कहता है कि सभी तीर्थयात्राओं, दानों और यज्ञों का संयुक्त पुण्य एक एकादशी व्रत से कम है।' },
    deity: { en: 'Lord Vishnu', hi: 'भगवान विष्णु', sa: 'विष्णुः', ta: 'விஷ்ணு', te: 'విష్ణువు', bn: 'বিষ্ণু', kn: 'ವಿಷ್ಣು', gu: 'વિષ્ણુ', mr: 'भगवान विष्णु', mai: 'भगवान विष्णु' },
    isFast: true,
    fastNote: { en: 'Fast on Ekadashi day (no grains/beans). Break fast (Parana) next morning on Dwadashi after sunrise, ideally before 1/3 of the day has elapsed.', hi: 'एकादशी पर उपवास (अन्न/दाल वर्जित)। अगले दिन द्वादशी पर सूर्योदय के बाद पारण, दिन के 1/3 से पहले।', sa: 'एकादश्यां व्रतम् (अन्नं दालं च वर्जितम्)। द्वादश्यां सूर्योदयानन्तरं पारणम्।', mr: 'एकादशी पर उपवास (अन्न/दाल वर्जित)। अगले दिन द्वादशी पर सूर्योदय के बाद पारण, दिन के 1/3 से पहले।', mai: 'एकादशी पर उपवास (अन्न/दाल वर्जित)। अगले दिन द्वादशी पर सूर्योदय के बाद पारण, दिन के 1/3 से पहले।' },
  },
};

/**
 * Adhika Masa (intercalary month) Ekadashi names.
 * During Adhika Masa, Ekadashis have special names dedicated to Lord Purushottama (Vishnu).
 */
export const ADHIKA_MASA_EKADASHI: { shukla: EkadashiDetail; krishna: EkadashiDetail } = {
  shukla: {
    name: { en: 'Padmini Ekadashi', hi: 'पद्मिनी एकादशी', sa: 'पद्मिनीएकादशी', ta: 'பத்மினி ஏகாதசி', te: 'పద్మిని ఏకాదశి', bn: 'পদ্মিনী একাদশী', kn: 'ಪದ್ಮಿನಿ ಏಕಾದಶಿ', gu: 'પદ્મિની એકાદશી', mr: 'पद्मिनी एकादशी', mai: 'पद्मिनी एकादशी' },
    story: { en: 'Described in the Skanda Purana. This Ekadashi falls in the Adhika (extra) month, also called Purushottama Masa. Lord Krishna told Yudhishthira that observing this rare Ekadashi grants merit equal to performing the Ashvamedha Yagna.', hi: 'स्कन्द पुराण में वर्णित। यह अधिक मास (पुरुषोत्तम मास) की एकादशी है। कृष्ण ने युधिष्ठिर को बताया कि इस दुर्लभ एकादशी का व्रत अश्वमेध यज्ञ के समान पुण्य देता है।', sa: 'स्कन्दपुराणे वर्णिता। अधिकमासस्य (पुरुषोत्तममासस्य) एकादशी। अश्वमेधयज्ञसमपुण्यम्।', mr: 'स्कन्द पुराण में वर्णित। यह अधिक मास (पुरुषोत्तम मास) की एकादशी है। कृष्ण ने युधिष्ठिर को बताया कि इस दुर्लभ एकादशी का व्रत अश्वमेध यज्ञ के समान पुण्य देता है।', mai: 'स्कन्द पुराण में वर्णित। यह अधिक मास (पुरुषोत्तम मास) की एकादशी है। कृष्ण ने युधिष्ठिर को बताया कि इस दुर्लभ एकादशी का व्रत अश्वमेध यज्ञ के समान पुण्य देता है।' },
    benefit: { en: 'Grants merit of Ashvamedha Yagna. Removes sins accumulated over many lifetimes. Most auspicious Ekadashi of the Adhika Masa.', hi: 'अश्वमेध यज्ञ का पुण्य। अनेक जन्मों के पाप नष्ट। अधिक मास की सबसे शुभ एकादशी।', sa: 'अश्वमेधयज्ञपुण्यम्। अनेकजन्मपापनाशः।', mr: 'अश्वमेध यज्ञ का पुण्य। अनेक जन्मों के पाप नष्ट। अधिक मास की सबसे शुभ एकादशी।', mai: 'अश्वमेध यज्ञ का पुण्य। अनेक जन्मों के पाप नष्ट। अधिक मास की सबसे शुभ एकादशी।' },
  },
  krishna: {
    name: { en: 'Parama Ekadashi', hi: 'परमा एकादशी', sa: 'परमैकादशी', ta: 'பரமா ஏகாதசி', te: 'పరమ ఏకాదశి', bn: 'পরমা একাদশী', kn: 'ಪರಮಾ ಏಕಾದಶಿ', gu: 'પરમા એકાદશી', mr: 'परमा एकादशी', mai: 'परमा एकादशी' },
    story: { en: 'Described in the Brahma Vaivarta Purana. Lord Krishna narrated this to Arjuna. A king named Sumedha, who had committed grievous sins, observed this Ekadashi during Adhika Masa and was instantly purified. Parama = supreme.', hi: 'ब्रह्म वैवर्त पुराण में वर्णित। कृष्ण ने अर्जुन को सुनाया। सुमेध नामक राजा ने अधिक मास में इस एकादशी का व्रत किया और तुरन्त शुद्ध हुआ।', sa: 'ब्रह्मवैवर्तपुराणे वर्णिता। सुमेधनामकः राजा अधिकमासे एताम् एकादशीम् अवर्तयत्।', mr: 'ब्रह्म वैवर्त पुराण में वर्णित। कृष्ण ने अर्जुन को सुनाया। सुमेध नामक राजा ने अधिक मास में इस एकादशी का व्रत किया और तुरन्त शुद्ध हुआ।', mai: 'ब्रह्म वैवर्त पुराण में वर्णित। कृष्ण ने अर्जुन को सुनाया। सुमेध नामक राजा ने अधिक मास में इस एकादशी का व्रत किया और तुरन्त शुद्ध हुआ।' },
    benefit: { en: 'Supreme purification. Removes the most grievous sins. Grants liberation to even the most fallen souls.', hi: 'परम शुद्धि। गम्भीरतम पापों का नाश। पतित आत्माओं को भी मुक्ति।', sa: 'परमशुद्धिः। गुरुतमपापनाशः। पतितात्मनामपि मुक्तिः।', mr: 'परम शुद्धि। गम्भीरतम पापों का नाश। पतित आत्माओं को भी मुक्ति।', mai: 'परम शुद्धि। गम्भीरतम पापों का नाश। पतित आत्माओं को भी मुक्ति।' },
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

/** Get the Hindu month name from a sign number (1-12, wraps for values >12) */
export function getHinduMonth(signNum: number): string {
  const wrapped = ((signNum - 1) % 12) + 1; // wrap 13→1, 14→2, etc.
  return SOLAR_MONTH_MAP[wrapped] || 'chaitra';
}

/** Ordered list of Hindu months for cycling */
const MONTH_ORDER = ['chaitra', 'vaishakha', 'jyeshtha', 'ashadha', 'shravana', 'bhadrapada', 'ashwina', 'kartika', 'margashirsha', 'pausha', 'magha', 'phalguna'];

/** Get the NEXT Hindu month name */
export function getNextHinduMonth(monthName: string): string {
  const idx = MONTH_ORDER.indexOf(monthName);
  if (idx === -1) return monthName;
  return MONTH_ORDER[(idx + 1) % 12];
}

/** Get the PREVIOUS Hindu month name */
export function getPreviousHinduMonth(monthName: string): string {
  const idx = MONTH_ORDER.indexOf(monthName);
  if (idx === -1) return monthName;
  return MONTH_ORDER[(idx + 11) % 12]; // +11 = -1 mod 12
}

/** Get the specific Ekadashi name for a given Hindu month and paksha */
export function getEkadashiName(hinduMonth: string, paksha: 'shukla' | 'krishna'): EkadashiDetail | undefined {
  return EKADASHI_NAMES[hinduMonth]?.[paksha];
}

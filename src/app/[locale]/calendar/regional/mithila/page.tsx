import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';

const LABELS = {
  title: {
    en: 'Mithila Calendar (Maithili Panchang)',
    hi: 'मिथिला कैलेंडर (मैथिली पंचांग)',
    sa: 'मिथिलापञ्चाङ्गम्',
    mai: 'मिथिला पंचांग (मैथिली पंचांग)',
    ta: 'மிதிலா நாட்காட்டி (மைதிலி பஞ்சாங்கம்)',
    te: 'మిథిలా క్యాలెండర్ (మైథిలీ పంచాంగం)',
    bn: 'মিথিলা ক্যালেন্ডার (মৈথিলী পঞ্চাঙ্গ)',
    kn: 'ಮಿಥಿಲಾ ಕ್ಯಾಲೆಂಡರ್ (ಮೈಥಿಲಿ ಪಂಚಾಂಗ)',
    mr: 'मिथिला कॅलेंडर (मैथिली पंचांग)', gu: 'મિથિલા કેલેન્ડર (મૈથિલી પંચાંગ)',
  },
  intro: {
    en: 'The Mithila calendar is the traditional almanac of the Maithil Brahmin and broader Maithili-speaking communities of Mithilanchal — a cultural region spanning northern Bihar, parts of Jharkhand, and the Terai of Nepal. Unlike the reformed Bengali or Tamil calendars, the Mithila Panchang retains the classical lunisolar system (Purnimant) where months end on the full moon. The calendar governs all religious observances, marriages, Upanayana (sacred thread) ceremonies, and agricultural cycles in the region. Maithili culture, one of the oldest literary traditions in India (the Maithili language has its own script — Tirhuta/Mithilakshara), preserves unique festivals not found elsewhere in India. Over 35 million Maithili speakers use this calendar.',
    hi: 'मिथिला कैलेंडर मैथिल ब्राह्मणों और व्यापक मैथिली-भाषी समुदायों का पारम्परिक पंचांग है — मिथिलांचल उत्तरी बिहार, झारखण्ड के कुछ भागों और नेपाल के तराई में फैला एक सांस्कृतिक क्षेत्र है। सुधारित बंगाली या तमिल कैलेंडर के विपरीत, मिथिला पंचांग शास्त्रीय चान्द्र-सौर प्रणाली (पूर्णिमान्त) को बनाए रखता है जहां मास पूर्णिमा पर समाप्त होते हैं। यह कैलेंडर क्षेत्र में सभी धार्मिक अनुष्ठानों, विवाहों, उपनयन संस्कारों और कृषि चक्रों को नियंत्रित करता है। 3.5 करोड़ से अधिक मैथिली भाषी इस कैलेंडर का उपयोग करते हैं।',
    sa: 'मिथिलापञ्चाङ्गं मैथिलब्राह्मणानां विशालमैथिलीभाषिसमुदायानां च पारम्परिकं पञ्चाङ्गम् अस्ति। मिथिलापञ्चाङ्गं शास्त्रीयां चान्द्रसौरपद्धतिं (पूर्णिमान्तम्) रक्षति।',
    mai: 'मिथिला पंचांग मैथिल ब्राह्मण आ विस्तृत मैथिली-भाषी समुदायक पारम्परिक पंचांग अछि — मिथिलांचल उत्तरी बिहार, झारखण्डक किछु भाग आ नेपालक तराई मे फैलल एक सांस्कृतिक क्षेत्र अछि। सुधारित बंगाली या तमिल कैलेंडरक विपरीत, मिथिला पंचांग शास्त्रीय चान्द्र-सौर प्रणाली (पूर्णिमान्त) केँ बनाए रखैत अछि जाहि मे मास पूर्णिमा पर समाप्त होइत अछि। ई कैलेंडर क्षेत्र मे सब धार्मिक अनुष्ठान, विवाह, उपनयन संस्कार आ कृषि चक्र केँ नियंत्रित करैत अछि। 3.5 करोड़ सँ बेसी मैथिली भाषी ई कैलेंडरक उपयोग करैत छथि।',
  },
  monthsTitle: {
    en: 'The 12 Months of the Mithila Calendar',
    hi: '12 मिथिला मास',
    sa: '१२ मिथिलामासाः',
    mai: 'मिथिला कैलेंडरक 12 मास',
    ta: '12 மிதிலா மாதங்கள்',
    te: '12 మిథిలా నెలలు',
    bn: '১২টি মিথিলা মাস',
    kn: '12 ಮಿಥಿಲಾ ತಿಂಗಳುಗಳು',
    mr: '12 मिथिला महिने', gu: '12 મિથિલા મહિના',
  },
  monthsIntro: {
    en: 'The Mithila calendar follows the Purnimant (full-moon-ending) system, where each month concludes on Purnima. This is the same system used in most of North India, but the Maithili names preserve distinct local pronunciation. The months align with the standard Hindu lunisolar months but carry the cultural weight of Mithila\'s unique festival cycle. Chaitra marks the beginning of the year, coinciding with Vasant (spring) and the preparation for Ramnavami.',
    hi: 'मिथिला कैलेंडर पूर्णिमान्त प्रणाली का पालन करता है, जहां प्रत्येक मास पूर्णिमा पर समाप्त होता है। मास मानक हिन्दू चान्द्र-सौर मासों से मेल खाते हैं लेकिन मिथिला की विशिष्ट उत्सव परम्परा का सांस्कृतिक भार वहन करते हैं। चैत्र वर्ष का आरम्भ है।',
    sa: 'मिथिलापञ्चाङ्गं पूर्णिमान्तपद्धतिम् अनुसरति यत्र प्रत्येकं मासः पूर्णिमायां समाप्यते।',
    mai: 'मिथिला कैलेंडर पूर्णिमान्त प्रणालीक पालन करैत अछि, जाहि मे प्रत्येक मास पूर्णिमा पर समाप्त होइत अछि। मास मानक हिन्दू चान्द्र-सौर मासक संग मेल खाइत अछि मुदा मिथिलाक विशिष्ट उत्सव परम्पराक सांस्कृतिक भार वहन करैत अछि। चैत मे वर्षक आरम्भ होइत अछि।',
  },
  chhathTitle: {
    en: 'Chhath Puja — The Crown Jewel of Mithila',
    hi: 'छठ पूजा — मिथिला का मुकुट रत्न',
    sa: 'छठपूजा — मिथिलायाः मुकुटरत्नम्',
    mai: 'छठि पूजा — मिथिलाक मुकुट रत्न',
    ta: 'சட் பூஜை — மிதிலாவின் மகுட ரத்தினம்',
    te: 'ఛఠ్ పూజ — మిథిలా కిరీట రత్నం',
    bn: 'ছট পূজা — মিথিলার মুকুট রত্ন',
    kn: 'ಛಠ್ ಪೂಜೆ — ಮಿಥಿಲಾ ಕಿರೀಟ ರತ್ನ',
  },
  chhathText: {
    en: 'Chhath Puja (Kartik Shukla Shashthi) is the most significant festival of Mithilanchal and the broader Bhojpuri-Maithili belt. Dedicated to Surya (the Sun God) and Chhathi Maiya (Usha, the consort of the Sun), it is one of the few Vedic festivals that survived without Puranic overlay. The 4-day observance — Nahay Khay (day 1: ritual bathing and eating lauki-chana dal), Kharna/Lohanda (day 2: 36-hour nirjala fast begins after eating kheer), Sandhya Arghya (day 3: standing waist-deep in water to offer arghya to the setting sun), and Usha Arghya (day 4: offering to the rising sun, then breaking fast with prasad) — demands extraordinary discipline. Devotees prepare traditional offerings called "thekua" (wheat-jaggery cookies) and "kasar" in "daura" (bamboo baskets). Rivers, ponds, and specially built "chhath ghats" overflow with devotees. The festival is remarkable for being entirely priest-less — the "vrati" (faster) performs all rituals themselves, making it one of the most egalitarian Hindu festivals.',
    hi: 'छठ पूजा (कार्तिक शुक्ल षष्ठी) मिथिलांचल और भोजपुरी-मैथिली बेल्ट का सबसे महत्वपूर्ण त्योहार है। सूर्य देव और छठी मइया (ऊषा) को समर्पित, यह उन दुर्लभ वैदिक त्योहारों में से है जो पौराणिक आवरण के बिना जीवित रहे। 4-दिवसीय पालन — नहाय खाय (दिन 1: स्नान और लौकी-चने की दाल), खरना/लोहंडा (दिन 2: 36 घंटे का निर्जला व्रत खीर खाकर आरम्भ), सन्ध्या अर्घ्य (दिन 3: कमर तक पानी में खड़े होकर डूबते सूर्य को अर्घ्य), और ऊषा अर्घ्य (दिन 4: उगते सूर्य को अर्घ्य, फिर प्रसाद से व्रत तोड़ना)। भक्त "ठेकुआ" और "कसार" जैसे पारम्परिक प्रसाद "दउरा" (बांस की टोकरी) में तैयार करते हैं। यह त्योहार पूर्णतः पुजारी-रहित है — "व्रती" स्वयं सभी अनुष्ठान करते हैं।',
    sa: 'छठपूजा (कार्तिकशुक्लषष्ठी) मिथिलांचलस्य महत्तमं पर्व अस्ति। सूर्यदेवाय छठीमैयायै च समर्पितम्।',
    mai: 'छठि पूजा (कार्तिक शुक्ल षष्ठी) मिथिलांचल आ भोजपुरी-मैथिली क्षेत्रक सबसँ महत्वपूर्ण पर्व अछि। सूर्य भगवान आ छठि मइया (ऊषा) केँ समर्पित, ई ओहि दुर्लभ वैदिक पर्व मे सँ अछि जे पौराणिक आवरणक बिना जीवित रहल। 4 दिनक पालन — नहाय खाय (पहिल दिन: स्नान आ लौकी-चनाक दाल), खरना/लोहंडा (दोसर दिन: खीर खाक 36 घंटाक निर्जला व्रत आरम्भ), सन्ध्या अर्घ्य (तेसर दिन: कमर तक पानी मे ठाढ़ भ कऽ डूबैत सूर्य केँ अर्घ्य), आ ऊषा अर्घ्य (चारिम दिन: उगैत सूर्य केँ अर्घ्य, तखन प्रसादसँ व्रत तोड़ब)। भक्त "ठेकुआ" आ "कसार" जेहेन पारम्परिक प्रसाद "दउरा" (बांसक टोकरी) मे तैयार करैत छथि। ई पर्व पूर्णतः पुजारी-रहित अछि — "व्रती" स्वयं सब अनुष्ठान करैत छथि।',
  },
  uniqueTitle: {
    en: 'Unique Maithil Festivals',
    hi: 'विशिष्ट मैथिल त्योहार',
    sa: 'विशिष्टमैथिलपर्वाणि',
    mai: 'विशिष्ट मैथिल पर्व',
    ta: 'தனித்துவமான மைதில் திருவிழாக்கள்',
    te: 'ప్రత్యేక మైథిల్ పండుగలు',
    bn: 'অনন্য মৈথিল উৎসব',
    kn: 'ವಿಶಿಷ್ಟ ಮೈಥಿಲ್ ಹಬ್ಬಗಳು',
  },
  uniqueText: {
    en: 'Mithila celebrates several festivals found nowhere else in India. **Sama-Chakeva** (Kartik Purnima to Kartik Shukla Saptami) is a brother-sister festival unique to Mithila where sisters create clay birds (Sama and Chakeva) and perform elaborate rituals for their brothers\' well-being — the clay figures are finally immersed on the last day. **Jitiya/Jivitputrika** (Ashwin Krishna Ashtami) is a 3-day nirjala fast by mothers for their children\'s long life — the strictest fast in the Hindu calendar, even stricter than Chhath. **Madhushravani** is a month-long observance for newly married women during Shravan, involving daily worship and storytelling. **Tusari Puja** celebrates the tussar silk weaving tradition. **Batsavitri** (Jyeshtha Purnima) sees married women fast for their husbands under banyan trees, mirroring the Savitri-Satyavan legend. These festivals carry distinct Maithili songs, folk art (Madhubani/Mithila painting), and rituals passed down through centuries.',
    hi: 'मिथिला कई ऐसे त्योहार मनाता है जो भारत में और कहीं नहीं मिलते। **सामा-चकेवा** (कार्तिक पूर्णिमा से कार्तिक शुक्ल सप्तमी) एक भाई-बहन का त्योहार है जहां बहनें मिट्टी के पक्षी बनाती हैं। **जितिया/जीवित्पुत्रिका** (आश्विन कृष्ण अष्टमी) माताओं का 3 दिन का निर्जला व्रत है। **मधुश्रावणी** नवविवाहिताओं का श्रावण भर का अनुष्ठान है। **बटसावित्री** (ज्येष्ठ पूर्णिमा) में सुहागिनें बरगद के वृक्ष के नीचे व्रत रखती हैं। इन त्योहारों में विशिष्ट मैथिली गीत, मधुबनी चित्रकला और सदियों पुरानी परम्पराएं हैं।',
    sa: 'मिथिला अनेकानि विशिष्टपर्वाणि आचरति। सामाचकेवा भ्रातृभगिनीपर्वम्, जितिया मातॄणां निर्जलव्रतम्, मधुश्रावणी नववधूनाम् अनुष्ठानम्।',
    mai: 'मिथिला कतेक एहन पर्व मनबैत अछि जे भारत मे आर कतहु नहि भेटैत अछि। **सामा-चकेवा** (कार्तिक पूर्णिमा सँ कार्तिक शुक्ल सप्तमी) एक भाय-बहिनक पर्व अछि जाहि मे बहिन माटिक चिड़ै बनबैत छथि। **जितिया/जीवित्पुत्रिका** (आश्विन कृष्ण अष्टमी) माय लोकनिक 3 दिनक निर्जला व्रत अछि — हिन्दू कैलेंडरक सबसँ कठोर व्रत। **मधुश्रावणी** नवबहुक लेल श्रावण भरिक अनुष्ठान अछि। **बटसावित्री** (ज्येष्ठ पूर्णिमा) मे सुहागिन बरगदक गाछक नीचा व्रत रखैत छथि। ई सब पर्व मे विशिष्ट मैथिली गीत, मधुबनी चित्रकला आ सदियों पुरनकी परम्परा अछि।',
  },
  madhubaniTitle: {
    en: 'Madhubani Art & the Calendar',
    hi: 'मधुबनी कला और कैलेंडर',
    sa: 'मधुबनीकला पञ्चाङ्गं च',
    mai: 'मधुबनी कला आ कैलेंडर',
  },
  madhubaniText: {
    en: 'Mithila\'s calendar is inseparable from Madhubani (Mithila) painting — one of India\'s most recognized folk art traditions. The calendar marks when walls of homes must be painted anew: Kohbar (bridal chamber) paintings are created for weddings, Aripan (floor paintings similar to Kolam/Rangoli) are drawn for festivals and auspicious occasions, and specific deities are painted for their respective festivals. The art uses natural pigments — turmeric yellow, indigo blue, lamp soot black, rice paste white — and follows an unbroken matrilineal tradition where mothers teach daughters. UNESCO recognized Madhubani art as a GI (Geographical Indication) product. The calendar\'s festival cycle thus drives an entire artistic tradition that has gained global recognition.',
    hi: 'मिथिला का कैलेंडर मधुबनी (मिथिला) चित्रकला से अविभाज्य है। कैलेंडर बताता है कि घरों की दीवारों पर कब नई चित्रकारी करनी है: विवाह के लिए कोहबर, त्योहारों के लिए अरिपन (फर्श चित्रकला), और विशिष्ट देवताओं की चित्रकारी। कला प्राकृतिक रंगद्रव्यों — हल्दी पीला, नील नीला, दीपक कालिख काला, चावल का सफेद — का उपयोग करती है। UNESCO ने मधुबनी कला को GI उत्पाद के रूप में मान्यता दी है।',
    sa: 'मिथिलापञ्चाङ्गं मधुबनीचित्रकलया अविभक्तम् अस्ति।',
    mai: 'मिथिलाक कैलेंडर मधुबनी (मिथिला) चित्रकलासँ अलग नहि कएल जा सकैत अछि। कैलेंडर बतबैत अछि जे घरक दीवार पर कहिया नव चित्रकारी करबाक अछि: विवाहक लेल कोहबर, पर्वक लेल अरिपन (भूइँ चित्रकला), आ विशिष्ट देवताक चित्रकारी। ई कला प्राकृतिक रंग — हरदीक पीयर, नीलक नीला, दीपक कालिख कारी, चाउरक सफेद — उपयोग करैत अछि। UNESCO मधुबनी कला केँ GI उत्पाद के रूप मे मान्यता देने अछि।',
  },
  festivalsTitle: {
    en: 'Major Mithila Festivals by Month',
    hi: 'मास अनुसार प्रमुख मिथिला त्योहार',
    sa: 'मासानुसारं प्रमुखमिथिलापर्वाणि',
    mai: 'मास अनुसार प्रमुख मिथिला पर्व',
    ta: 'மாதம் வாரியாக முக்கிய மிதிலா திருவிழாக்கள்',
    te: 'నెల వారీ ప్రధాన మిథిలా పండుగలు',
    bn: 'মাস অনুসারে প্রধান মিথিলা উৎসব',
    kn: 'ತಿಂಗಳ ಪ್ರಕಾರ ಪ್ರಮುಖ ಮಿಥಿಲಾ ಹಬ್ಬಗಳು',
  },
  relatedTitle: {
    en: 'Related Puja Guides & Festivals',
    hi: 'सम्बन्धित पूजा विधि और त्योहार',
    sa: 'सम्बद्धपूजाविधयः पर्वाणि च',
    mai: 'संबंधित पूजा विधि आ पर्व',
    ta: 'தொடர்புடைய பூஜை வழிகாட்டிகள்',
    te: 'సంబంధిత పూజా మార్గదర్శులు',
    bn: 'সম্পর্কিত পূজা গাইড ও উৎসব',
    kn: 'ಸಂಬಂಧಿತ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿಗಳು',
  },
};

const MITHILA_MONTHS = [
  { name: 'Chaitra', maithili: 'चैत', gregorian: 'Mar–Apr', nameHi: 'चैत्र' },
  { name: 'Vaishakh', maithili: 'बैसाख', gregorian: 'Apr–May', nameHi: 'वैशाख' },
  { name: 'Jyeshtha', maithili: 'जेठ', gregorian: 'May–Jun', nameHi: 'ज्येष्ठ' },
  { name: 'Ashadh', maithili: 'आषाढ़', gregorian: 'Jun–Jul', nameHi: 'आषाढ़' },
  { name: 'Shravan', maithili: 'सावन', gregorian: 'Jul–Aug', nameHi: 'श्रावण' },
  { name: 'Bhadra', maithili: 'भादो', gregorian: 'Aug–Sep', nameHi: 'भाद्रपद' },
  { name: 'Ashwin', maithili: 'आश्विन', gregorian: 'Sep–Oct', nameHi: 'आश्विन' },
  { name: 'Kartik', maithili: 'कातिक', gregorian: 'Oct–Nov', nameHi: 'कार्तिक' },
  { name: 'Margashirsha', maithili: 'अगहन', gregorian: 'Nov–Dec', nameHi: 'मार्गशीर्ष' },
  { name: 'Paush', maithili: 'पूस', gregorian: 'Dec–Jan', nameHi: 'पौष' },
  { name: 'Magh', maithili: 'माघ', gregorian: 'Jan–Feb', nameHi: 'माघ' },
  { name: 'Phalgun', maithili: 'फागुन', gregorian: 'Feb–Mar', nameHi: 'फाल्गुन' },
];

const FESTIVALS = [
  { month: 'Chaitra', en: 'Ramnavami (birth of Lord Rama — special significance in Mithila as Sita\'s homeland), Chaiti Chhath (spring Chhath Puja — same 4-day ritual as Kartik Chhath)', hi: 'रामनवमी (मिथिला सीता की भूमि — विशेष महत्व), चैती छठ (वसन्त छठ पूजा)' },
  { month: 'Vaishakh', en: 'Akshaya Tritiya (beginning of agricultural year — seed sowing), Sita Navami (Sita\'s appearance day — uniquely celebrated in Mithila with Sita worship)', hi: 'अक्षय तृतीया (कृषि वर्ष आरम्भ), सीता नवमी (मिथिला में विशेष सीता पूजा)' },
  { month: 'Jyeshtha', en: 'Batsavitri/Vat Savitri (Jyeshtha Purnima — married women fast under banyan trees for their husbands\' longevity, re-enacting the Savitri-Satyavan legend)', hi: 'बटसावित्री (ज्येष्ठ पूर्णिमा — सुहागिनें बरगद के नीचे पति की दीर्घायु के लिए व्रत)' },
  { month: 'Ashadh', en: 'Rath Yatra, Guru Purnima, beginning of Chaturmas (four-month monsoon period of heightened worship)', hi: 'रथ यात्रा, गुरु पूर्णिमा, चातुर्मास आरम्भ' },
  { month: 'Shravan', en: 'Madhushravani (month-long observance for newly-married women — daily worship, storytelling, and folk songs), Nag Panchami, Raksha Bandhan, Kajari Teej', hi: 'मधुश्रावणी (नवविवाहिताओं का मास-भर अनुष्ठान), नाग पंचमी, रक्षा बंधन, कजरी तीज' },
  { month: 'Bhadra', en: 'Janmashtami (Krishna\'s birth — Dahi Handi celebrations), Hartalika Teej (women\'s fast for marital bliss), Ganesh Chaturthi, Vishwakarma Puja', hi: 'जन्माष्टमी (दही हांडी), हरतालिका तीज (सुहागिनों का व्रत), गणेश चतुर्थी, विश्वकर्मा पूजा' },
  { month: 'Ashwin', en: 'Jitiya/Jivitputrika (Ashwin Krishna Ashtami — mothers\' 3-day nirjala fast for children\'s long life — strictest fast), Navaratri & Durga Puja (Mithila celebrates with Maithili Durga songs), Dussehra, Kojagara Purnima', hi: 'जितिया/जीवित्पुत्रिका (माताओं का 3 दिन निर्जला व्रत — सबसे कठोर व्रत), नवरात्रि, दशहरा, कोजागरा पूर्णिमा' },
  { month: 'Kartik', en: 'Chhath Puja (Kartik Shukla Shashthi — THE defining festival of Mithila: 4-day Sun worship), Diwali & Govardhan Puja, Sama-Chakeva (Kartik Purnima–Saptami — unique brother-sister clay bird festival), Bhai Dooj', hi: 'छठ पूजा (कार्तिक शुक्ल षष्ठी — मिथिला का परिभाषित पर्व), दीवाली, सामा-चकेवा (भाई-बहन का अनूठा मिट्टी पक्षी पर्व), भाई दूज' },
  { month: 'Margashirsha', en: 'Vivah Panchami (anniversary of Rama-Sita wedding at Janakpur — immense celebrations in Mithilanchal), Mokshada Ekadashi', hi: 'विवाह पंचमी (राम-सीता विवाह वर्षगांठ — जनकपुर में भव्य), मोक्षदा एकादशी' },
  { month: 'Paush', en: 'Makar Sankranti / Tusu Puja (harvest festival — tilkut and lai-chura distribution), Pausha Purnima', hi: 'मकर संक्रान्ति / तुसू पूजा (तिलकुट और लाई-चूड़ा वितरण), पौष पूर्णिमा' },
  { month: 'Magh', en: 'Saraswati Puja / Vasant Panchami (worship of learning — students place books at Saraswati\'s feet), Maghi Purnima', hi: 'सरस्वती पूजा / वसन्त पंचमी (विद्या की पूजा), माघी पूर्णिमा' },
  { month: 'Phalgun', en: 'Maha Shivaratri, Holi / Phaguwa (celebrated with Maithili folk songs called "phag" — unique musical tradition), Holika Dahan', hi: 'महा शिवरात्रि, होली / फगुआ (मैथिली "फाग" गीतों से — अनूठी संगीत परम्परा), होलिका दहन' },
];

const RELATED_LINKS = [
  { slug: 'chhath-puja', en: 'Chhath Puja Vidhi', hi: 'छठ पूजा विधि' },
  { slug: 'navaratri', en: 'Navaratri / Durga Puja Guide', hi: 'नवरात्रि / दुर्गा पूजा विधि' },
  { slug: 'makar-sankranti', en: 'Makar Sankranti Puja', hi: 'मकर संक्रान्ति पूजा' },
  { slug: 'holi', en: 'Holi / Phaguwa Puja', hi: 'होली / फगुआ पूजा' },
  { slug: 'janmashtami', en: 'Janmashtami Puja', hi: 'जन्माष्टमी पूजा' },
  { slug: 'ram-navami', en: 'Ramnavami Puja', hi: 'रामनवमी पूजा' },
];

export default function MithilaCalendarPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => (LABELS[key] as Record<string, string>)[locale] || (LABELS[key] as Record<string, string>).en;
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbLD(`/${locale}/calendar/regional/mithila`, locale)) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
            {L('title')}
          </h1>
          <p className="text-text-secondary leading-relaxed text-lg">{L('intro')}</p>
        </div>

        {/* Months Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('monthsTitle')}</h2>
          <p className="text-text-secondary mb-6">{L('monthsIntro')}</p>
          <div className="overflow-x-auto rounded-xl border border-gold-primary/15">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/10 text-gold-light">
                  <th className="px-4 py-3 text-left font-bold">#</th>
                  <th className="px-4 py-3 text-left font-bold">{tl({ en: 'Month', hi: 'मास', sa: 'मास' }, locale)}</th>
                  <th className="px-4 py-3 text-left font-bold">{tl({ en: 'Maithili', hi: 'मैथिली', sa: 'मैथिली' }, locale)}</th>
                  <th className="px-4 py-3 text-left font-bold">{tl({ en: 'Gregorian', hi: 'ग्रेगोरियन', sa: 'ग्रेगोरियन' }, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {MITHILA_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/30' : ''}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-gold-light font-medium">{isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-text-primary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{m.maithili}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Chhath Puja */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('chhathTitle')}</h2>
          <p className="text-text-secondary leading-relaxed">{L('chhathText')}</p>
        </section>

        {/* Unique Festivals */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('uniqueTitle')}</h2>
          <div className="text-text-secondary leading-relaxed prose-gold" dangerouslySetInnerHTML={{
            __html: L('uniqueText').replace(/\*\*(.+?)\*\*/g, '<strong class="text-gold-light">$1</strong>')
          }} />
        </section>

        {/* Madhubani */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('madhubaniTitle')}</h2>
          <p className="text-text-secondary leading-relaxed">{L('madhubaniText')}</p>
        </section>

        {/* Monthly Festivals */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={hf}>{L('festivalsTitle')}</h2>
          <div className="space-y-4">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 p-4">
                <h3 className="text-gold-primary font-bold mb-2" style={hf}>
                  {isHi ? MITHILA_MONTHS.find(m => m.name === f.month)?.nameHi || f.month : f.month}
                  <span className="text-text-secondary/50 font-normal ml-2 text-sm">
                    ({MITHILA_MONTHS.find(m => m.name === f.month)?.gregorian})
                  </span>
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{isHi ? f.hi : f.en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('relatedTitle')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <Link key={link.slug} href={`/puja/${link.slug}`}
                className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 px-4 py-3 text-sm text-gold-light hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-colors">
                {isHi ? link.hi : link.en}
              </Link>
            ))}
            <Link href="/calendar"
              className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 px-4 py-3 text-sm text-gold-light hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-colors">
              {tl({ en: 'Festival Calendar', hi: 'त्योहार कैलेंडर', sa: 'त्योहार कैलेंडर' }, locale)}
            </Link>
            <Link href="/panchang"
              className="rounded-xl border border-gold-primary/12 bg-bg-secondary/30 px-4 py-3 text-sm text-gold-light hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-colors">
              {tl({ en: "Today's Panchang", hi: "आज का पंचांग", sa: "आज का पंचांग" }, locale)}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

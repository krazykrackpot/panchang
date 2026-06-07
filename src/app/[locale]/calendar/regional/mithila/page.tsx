import { tl } from '@/lib/utils/trilingual';
import { setRequestLocale } from 'next-intl/server';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';
import { pickRegionalChrome as RC } from '@/lib/content/regional-chrome-labels';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

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
    en: 'The Mithila calendar is the traditional almanac of the Maithil Brahmin and broader Maithili-speaking communities of Mithilanchal  –  a cultural region spanning northern Bihar, parts of Jharkhand, and the Terai of Nepal. Unlike the reformed Bengali or Tamil calendars, the Mithila Panchang retains the classical lunisolar system (Purnimant) where months end on the full moon. The calendar governs all religious observances, marriages, Upanayana (sacred thread) ceremonies, and agricultural cycles in the region. Maithili culture, one of the oldest literary traditions in India (the Maithili language has its own script  –  Tirhuta/Mithilakshara), preserves unique festivals not found elsewhere in India. Over 35 million Maithili speakers use this calendar.',
    hi: 'मिथिला कैलेंडर मैथिल ब्राह्मणों और व्यापक मैथिली-भाषी समुदायों का पारम्परिक पंचांग है  –  मिथिलांचल उत्तरी बिहार, झारखण्ड के कुछ भागों और नेपाल के तराई में फैला एक सांस्कृतिक क्षेत्र है। सुधारित बंगाली या तमिल कैलेंडर के विपरीत, मिथिला पंचांग शास्त्रीय चान्द्र-सौर प्रणाली (पूर्णिमान्त) को बनाए रखता है जहां मास पूर्णिमा पर समाप्त होते हैं। यह कैलेंडर क्षेत्र में सभी धार्मिक अनुष्ठानों, विवाहों, उपनयन संस्कारों और कृषि चक्रों को नियंत्रित करता है। 3.5 करोड़ से अधिक मैथिली भाषी इस कैलेंडर का उपयोग करते हैं।',
    sa: 'मिथिलापञ्चाङ्गं मैथिलब्राह्मणानां विशालमैथिलीभाषिसमुदायानां च पारम्परिकं पञ्चाङ्गम् अस्ति। मिथिलापञ्चाङ्गं शास्त्रीयां चान्द्रसौरपद्धतिं (पूर्णिमान्तम्) रक्षति।',
    mai: 'मिथिला पंचांग मैथिल ब्राह्मण आ विस्तृत मैथिली-भाषी समुदायक पारम्परिक पंचांग अछि  –  मिथिलांचल उत्तरी बिहार, झारखण्डक किछु भाग आ नेपालक तराई मे फैलल एक सांस्कृतिक क्षेत्र अछि। सुधारित बंगाली या तमिल कैलेंडरक विपरीत, मिथिला पंचांग शास्त्रीय चान्द्र-सौर प्रणाली (पूर्णिमान्त) केँ बनाए रखैत अछि जाहि मे मास पूर्णिमा पर समाप्त होइत अछि। ई कैलेंडर क्षेत्र मे सब धार्मिक अनुष्ठान, विवाह, उपनयन संस्कार आ कृषि चक्र केँ नियंत्रित करैत अछि। 3.5 करोड़ सँ बेसी मैथिली भाषी ई कैलेंडरक उपयोग करैत छथि।',
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
    en: 'Chhath Puja  –  The Crown Jewel of Mithila',
    hi: 'छठ पूजा  –  मिथिला का मुकुट रत्न',
    sa: 'छठपूजा  –  मिथिलायाः मुकुटरत्नम्',
    mai: 'छठि पूजा  –  मिथिलाक मुकुट रत्न',
    ta: 'சட் பூஜை  –  மிதிலாவின் மகுட ரத்தினம்',
    te: 'ఛఠ్ పూజ  –  మిథిలా కిరీట రత్నం',
    bn: 'ছট পূজা  –  মিথিলার মুকুট রত্ন',
    kn: 'ಛಠ್ ಪೂಜೆ  –  ಮಿಥಿಲಾ ಕಿರೀಟ ರತ್ನ',
  },
  chhathText: {
    en: 'Chhath Puja (Kartik Shukla Shashthi) is the most significant festival of Mithilanchal and the broader Bhojpuri-Maithili belt. Dedicated to Surya (the Sun God) and Chhathi Maiya (Usha, the consort of the Sun), it is one of the few Vedic festivals that survived without Puranic overlay. The 4-day observance  –  Nahay Khay (day 1: ritual bathing and eating lauki-chana dal), Kharna/Lohanda (day 2: 36-hour nirjala fast begins after eating kheer), Sandhya Arghya (day 3: standing waist-deep in water to offer arghya to the setting sun), and Usha Arghya (day 4: offering to the rising sun, then breaking fast with prasad)  –  demands extraordinary discipline. Devotees prepare traditional offerings called "thekua" (wheat-jaggery cookies) and "kasar" in "daura" (bamboo baskets). Rivers, ponds, and specially built "chhath ghats" overflow with devotees. The festival is remarkable for being entirely priest-less  –  the "vrati" (faster) performs all rituals themselves, making it one of the most egalitarian Hindu festivals.',
    hi: 'छठ पूजा (कार्तिक शुक्ल षष्ठी) मिथिलांचल और भोजपुरी-मैथिली बेल्ट का सबसे महत्वपूर्ण त्योहार है। सूर्य देव और छठी मइया (ऊषा) को समर्पित, यह उन दुर्लभ वैदिक त्योहारों में से है जो पौराणिक आवरण के बिना जीवित रहे। 4-दिवसीय पालन  –  नहाय खाय (दिन 1: स्नान और लौकी-चने की दाल), खरना/लोहंडा (दिन 2: 36 घंटे का निर्जला व्रत खीर खाकर आरम्भ), सन्ध्या अर्घ्य (दिन 3: कमर तक पानी में खड़े होकर डूबते सूर्य को अर्घ्य), और ऊषा अर्घ्य (दिन 4: उगते सूर्य को अर्घ्य, फिर प्रसाद से व्रत तोड़ना)। भक्त "ठेकुआ" और "कसार" जैसे पारम्परिक प्रसाद "दउरा" (बांस की टोकरी) में तैयार करते हैं। यह त्योहार पूर्णतः पुजारी-रहित है  –  "व्रती" स्वयं सभी अनुष्ठान करते हैं।',
    sa: 'छठपूजा (कार्तिकशुक्लषष्ठी) मिथिलांचलस्य महत्तमं पर्व अस्ति। सूर्यदेवाय छठीमैयायै च समर्पितम्।',
    mai: 'छठि पूजा (कार्तिक शुक्ल षष्ठी) मिथिलांचल आ भोजपुरी-मैथिली क्षेत्रक सबसँ महत्वपूर्ण पर्व अछि। सूर्य भगवान आ छठि मइया (ऊषा) केँ समर्पित, ई ओहि दुर्लभ वैदिक पर्व मे सँ अछि जे पौराणिक आवरणक बिना जीवित रहल। 4 दिनक पालन  –  नहाय खाय (पहिल दिन: स्नान आ लौकी-चनाक दाल), खरना/लोहंडा (दोसर दिन: खीर खाक 36 घंटाक निर्जला व्रत आरम्भ), सन्ध्या अर्घ्य (तेसर दिन: कमर तक पानी मे ठाढ़ भ कऽ डूबैत सूर्य केँ अर्घ्य), आ ऊषा अर्घ्य (चारिम दिन: उगैत सूर्य केँ अर्घ्य, तखन प्रसादसँ व्रत तोड़ब)। भक्त "ठेकुआ" आ "कसार" जेहेन पारम्परिक प्रसाद "दउरा" (बांसक टोकरी) मे तैयार करैत छथि। ई पर्व पूर्णतः पुजारी-रहित अछि  –  "व्रती" स्वयं सब अनुष्ठान करैत छथि।',
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
    en: 'Mithila celebrates several festivals found nowhere else in India. **Sama-Chakeva** (Kartik Purnima to Kartik Shukla Saptami) is a brother-sister festival unique to Mithila where sisters create clay birds (Sama and Chakeva) and perform elaborate rituals for their brothers\' well-being  –  the clay figures are finally immersed on the last day. **Jitiya/Jivitputrika** (Ashwin Krishna Ashtami) is a 3-day nirjala fast by mothers for their children\'s long life  –  the strictest fast in the Hindu calendar, even stricter than Chhath. **Madhushravani** is a month-long observance for newly married women during Shravan, involving daily worship and storytelling. **Tusari Puja** celebrates the tussar silk weaving tradition. **Batsavitri** (Jyeshtha Purnima) sees married women fast for their husbands under banyan trees, mirroring the Savitri-Satyavan legend. These festivals carry distinct Maithili songs, folk art (Madhubani/Mithila painting), and rituals passed down through centuries.',
    hi: 'मिथिला कई ऐसे त्योहार मनाता है जो भारत में और कहीं नहीं मिलते। **सामा-चकेवा** (कार्तिक पूर्णिमा से कार्तिक शुक्ल सप्तमी) एक भाई-बहन का त्योहार है जहां बहनें मिट्टी के पक्षी बनाती हैं। **जितिया/जीवित्पुत्रिका** (आश्विन कृष्ण अष्टमी) माताओं का 3 दिन का निर्जला व्रत है। **मधुश्रावणी** नवविवाहिताओं का श्रावण भर का अनुष्ठान है। **बटसावित्री** (ज्येष्ठ पूर्णिमा) में सुहागिनें बरगद के वृक्ष के नीचे व्रत रखती हैं। इन त्योहारों में विशिष्ट मैथिली गीत, मधुबनी चित्रकला और सदियों पुरानी परम्पराएं हैं।',
    sa: 'मिथिला अनेकानि विशिष्टपर्वाणि आचरति। सामाचकेवा भ्रातृभगिनीपर्वम्, जितिया मातॄणां निर्जलव्रतम्, मधुश्रावणी नववधूनाम् अनुष्ठानम्।',
    mai: 'मिथिला कतेक एहन पर्व मनबैत अछि जे भारत मे आर कतहु नहि भेटैत अछि। **सामा-चकेवा** (कार्तिक पूर्णिमा सँ कार्तिक शुक्ल सप्तमी) एक भाय-बहिनक पर्व अछि जाहि मे बहिन माटिक चिड़ै बनबैत छथि। **जितिया/जीवित्पुत्रिका** (आश्विन कृष्ण अष्टमी) माय लोकनिक 3 दिनक निर्जला व्रत अछि  –  हिन्दू कैलेंडरक सबसँ कठोर व्रत। **मधुश्रावणी** नवबहुक लेल श्रावण भरिक अनुष्ठान अछि। **बटसावित्री** (ज्येष्ठ पूर्णिमा) मे सुहागिन बरगदक गाछक नीचा व्रत रखैत छथि। ई सब पर्व मे विशिष्ट मैथिली गीत, मधुबनी चित्रकला आ सदियों पुरनकी परम्परा अछि।',
  },
  madhubaniTitle: {
    en: 'Madhubani Art & the Calendar',
    hi: 'मधुबनी कला और कैलेंडर',
    sa: 'मधुबनीकला पञ्चाङ्गं च',
    mai: 'मधुबनी कला आ कैलेंडर',
  },
  madhubaniText: {
    en: 'Mithila\'s calendar is inseparable from Madhubani (Mithila) painting  –  one of India\'s most recognized folk art traditions. The calendar marks when walls of homes must be painted anew: Kohbar (bridal chamber) paintings are created for weddings, Aripan (floor paintings similar to Kolam/Rangoli) are drawn for festivals and auspicious occasions, and specific deities are painted for their respective festivals. The art uses natural pigments  –  turmeric yellow, indigo blue, lamp soot black, rice paste white  –  and follows an unbroken matrilineal tradition where mothers teach daughters. UNESCO recognized Madhubani art as a GI (Geographical Indication) product. The calendar\'s festival cycle thus drives an entire artistic tradition that has gained global recognition.',
    hi: 'मिथिला का कैलेंडर मधुबनी (मिथिला) चित्रकला से अविभाज्य है। कैलेंडर बताता है कि घरों की दीवारों पर कब नई चित्रकारी करनी है: विवाह के लिए कोहबर, त्योहारों के लिए अरिपन (फर्श चित्रकला), और विशिष्ट देवताओं की चित्रकारी। कला प्राकृतिक रंगद्रव्यों  –  हल्दी पीला, नील नीला, दीपक कालिख काला, चावल का सफेद  –  का उपयोग करती है। UNESCO ने मधुबनी कला को GI उत्पाद के रूप में मान्यता दी है।',
    sa: 'मिथिलापञ्चाङ्गं मधुबनीचित्रकलया अविभक्तम् अस्ति।',
    mai: 'मिथिलाक कैलेंडर मधुबनी (मिथिला) चित्रकलासँ अलग नहि कएल जा सकैत अछि। कैलेंडर बतबैत अछि जे घरक दीवार पर कहिया नव चित्रकारी करबाक अछि: विवाहक लेल कोहबर, पर्वक लेल अरिपन (भूइँ चित्रकला), आ विशिष्ट देवताक चित्रकारी। ई कला प्राकृतिक रंग  –  हरदीक पीयर, नीलक नीला, दीपक कालिख कारी, चाउरक सफेद  –  उपयोग करैत अछि। UNESCO मधुबनी कला केँ GI उत्पाद के रूप मे मान्यता देने अछि।',
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
  { month: 'Chaitra', en: 'Ramnavami (birth of Lord Rama  –  special significance in Mithila as Sita\'s homeland), Chaiti Chhath (spring Chhath Puja  –  same 4-day ritual as Kartik Chhath)', hi: 'रामनवमी (मिथिला सीता की भूमि  –  विशेष महत्व), चैती छठ (वसन्त छठ पूजा)' },
  { month: 'Vaishakh', en: 'Akshaya Tritiya (beginning of agricultural year  –  seed sowing), Sita Navami (Sita\'s appearance day  –  uniquely celebrated in Mithila with Sita worship)', hi: 'अक्षय तृतीया (कृषि वर्ष आरम्भ), सीता नवमी (मिथिला में विशेष सीता पूजा)' },
  { month: 'Jyeshtha', en: 'Batsavitri/Vat Savitri (Jyeshtha Purnima  –  married women fast under banyan trees for their husbands\' longevity, re-enacting the Savitri-Satyavan legend)', hi: 'बटसावित्री (ज्येष्ठ पूर्णिमा  –  सुहागिनें बरगद के नीचे पति की दीर्घायु के लिए व्रत)' },
  { month: 'Ashadh', en: 'Rath Yatra, Guru Purnima, beginning of Chaturmas (four-month monsoon period of heightened worship)', hi: 'रथ यात्रा, गुरु पूर्णिमा, चातुर्मास आरम्भ' },
  { month: 'Shravan', en: 'Madhushravani (month-long observance for newly-married women  –  daily worship, storytelling, and folk songs), Nag Panchami, Raksha Bandhan, Kajari Teej', hi: 'मधुश्रावणी (नवविवाहिताओं का मास-भर अनुष्ठान), नाग पंचमी, रक्षा बंधन, कजरी तीज' },
  { month: 'Bhadra', en: 'Janmashtami (Krishna\'s birth  –  Dahi Handi celebrations), Hartalika Teej (women\'s fast for marital bliss), Ganesh Chaturthi, Vishwakarma Puja', hi: 'जन्माष्टमी (दही हांडी), हरतालिका तीज (सुहागिनों का व्रत), गणेश चतुर्थी, विश्वकर्मा पूजा' },
  { month: 'Ashwin', en: 'Jitiya/Jivitputrika (Ashwin Krishna Ashtami  –  mothers\' 3-day nirjala fast for children\'s long life  –  strictest fast), Navaratri & Durga Puja (Mithila celebrates with Maithili Durga songs), Dussehra, Kojagara Purnima', hi: 'जितिया/जीवित्पुत्रिका (माताओं का 3 दिन निर्जला व्रत  –  सबसे कठोर व्रत), नवरात्रि, दशहरा, कोजागरा पूर्णिमा' },
  { month: 'Kartik', en: 'Chhath Puja (Kartik Shukla Shashthi  –  THE defining festival of Mithila: 4-day Sun worship), Diwali & Govardhan Puja, Sama-Chakeva (Kartik Purnima–Saptami  –  unique brother-sister clay bird festival), Bhai Dooj', hi: 'छठ पूजा (कार्तिक शुक्ल षष्ठी  –  मिथिला का परिभाषित पर्व), दीवाली, सामा-चकेवा (भाई-बहन का अनूठा मिट्टी पक्षी पर्व), भाई दूज' },
  { month: 'Margashirsha', en: 'Vivah Panchami (anniversary of Rama-Sita wedding at Janakpur  –  immense celebrations in Mithilanchal), Mokshada Ekadashi', hi: 'विवाह पंचमी (राम-सीता विवाह वर्षगांठ  –  जनकपुर में भव्य), मोक्षदा एकादशी' },
  { month: 'Paush', en: 'Makar Sankranti / Tusu Puja (harvest festival  –  tilkut and lai-chura distribution), Pausha Purnima', hi: 'मकर संक्रान्ति / तुसू पूजा (तिलकुट और लाई-चूड़ा वितरण), पौष पूर्णिमा' },
  { month: 'Magh', en: 'Saraswati Puja / Vasant Panchami (worship of learning  –  students place books at Saraswati\'s feet), Maghi Purnima', hi: 'सरस्वती पूजा / वसन्त पंचमी (विद्या की पूजा), माघी पूर्णिमा' },
  { month: 'Phalgun', en: 'Maha Shivaratri, Holi / Phaguwa (celebrated with Maithili folk songs called "phag"  –  unique musical tradition), Holika Dahan', hi: 'महा शिवरात्रि, होली / फगुआ (मैथिली "फाग" गीतों से  –  अनूठी संगीत परम्परा), होलिका दहन' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 2026–2027 Mithila Festival Dates
// Sources: mainstream reference panchangs reference for Darbhanga/Madhubani
// ═══════════════════════════════════════════════════════════════════════════

const FESTIVAL_DATES_2026 = [
  { en: 'Makar Sankranti (Tilkut distribution)', hi: 'मकर संक्रान्ति (तिलकुट वितरण)', mai: 'मकर संक्रान्ति (तिलकुट बांटल जाइत अछि)', date: 'Wed, 14 Jan 2026', tithi: 'Paush Krishna Pratipada' },
  { en: 'Saraswati Puja / Vasant Panchami', hi: 'सरस्वती पूजा / वसन्त पंचमी', mai: 'सरस्वती पूजा / बसन्त पंचमी', date: 'Mon, 23 Feb 2026', tithi: 'Magha Shukla Panchami' },
  { en: 'Holi / Phaguwa (Holika Dahan)', hi: 'होली / फगुआ (होलिका दहन)', mai: 'होली / फगुआ (होलिका दहन)', date: 'Tue, 3 Mar 2026', tithi: 'Phalguna Purnima' },
  { en: 'Chaiti Chhath (Nahay Khay)', hi: 'चैती छठ (नहाय खाय)', mai: 'चैती छठि (नहाय खाय)', date: 'Sun, 29 Mar 2026', tithi: 'Chaitra Shukla Chaturthi' },
  { en: 'Chaiti Chhath (Usha Arghya)', hi: 'चैती छठ (ऊषा अर्घ्य)', mai: 'चैती छठि (ऊषा अर्घ्य)', date: 'Wed, 1 Apr 2026', tithi: 'Chaitra Shukla Shashthi' },
  { en: 'Ramnavami', hi: 'रामनवमी', mai: 'रामनवमी', date: 'Sat, 4 Apr 2026', tithi: 'Chaitra Shukla Navami' },
  { en: 'Madhushravani begins (Shravan)', hi: 'मधुश्रावणी आरम्भ (श्रावण)', mai: 'मधुश्रावणी आरम्भ (सावन)', date: 'Mon, 20 Jul 2026', tithi: 'Shravan Shukla Chaturthi (approx.)' },
  { en: 'Jitiya / Jivitputrika Vrat', hi: 'जितिया / जीवित्पुत्रिका व्रत', mai: 'जितिया / जीवित्पुत्रिका व्रत', date: 'Fri, 25 Sep 2026', tithi: 'Ashwin Krishna Ashtami' },
  { en: 'Navaratri begins (Ghatasthapana)', hi: 'नवरात्रि आरम्भ (घटस्थापना)', mai: 'नवरात्रि आरम्भ (घटस्थापना)', date: 'Thu, 8 Oct 2026', tithi: 'Ashwin Shukla Pratipada' },
  { en: 'Dussehra / Vijayadashami', hi: 'दशहरा / विजयादशमी', mai: 'दशहरा / विजयादशमी', date: 'Sat, 17 Oct 2026', tithi: 'Ashwin Shukla Dashami' },
  { en: 'Sama-Chakeva begins (Kojagara Purnima)', hi: 'सामा-चकेवा आरम्भ (कोजागरा पूर्णिमा)', mai: 'सामा-चकेवा आरम्भ (कोजागरा पूर्णिमा)', date: 'Sat, 24 Oct 2026', tithi: 'Ashwin Purnima' },
  { en: 'Diwali (Lakshmi Puja)', hi: 'दीवाली (लक्ष्मी पूजा)', mai: 'दीपावली (लक्ष्मी पूजा)', date: 'Sun, 8 Nov 2026', tithi: 'Kartik Krishna Amavasya' },
  { en: 'Chhath Puja  –  Nahay Khay (Day 1)', hi: 'छठ पूजा  –  नहाय खाय (दिन 1)', mai: 'छठि पूजा  –  नहाय खाय (पहिल दिन)', date: 'Sun, 8 Nov 2026', tithi: 'Kartik Shukla Chaturthi' },
  { en: 'Chhath Puja  –  Kharna/Lohanda (Day 2)', hi: 'छठ पूजा  –  खरना/लोहंडा (दिन 2)', mai: 'छठि पूजा  –  खरना/लोहंडा (दोसर दिन)', date: 'Mon, 9 Nov 2026', tithi: 'Kartik Shukla Panchami' },
  { en: 'Chhath Puja  –  Sandhya Arghya (Day 3)', hi: 'छठ पूजा  –  सन्ध्या अर्घ्य (दिन 3)', mai: 'छठि पूजा  –  सन्ध्या अर्घ्य (तेसर दिन)', date: 'Tue, 10 Nov 2026', tithi: 'Kartik Shukla Shashthi' },
  { en: 'Chhath Puja  –  Usha Arghya (Day 4)', hi: 'छठ पूजा  –  ऊषा अर्घ्य (दिन 4)', mai: 'छठि पूजा  –  ऊषा अर्घ्य (चारिम दिन)', date: 'Wed, 11 Nov 2026', tithi: 'Kartik Shukla Saptami' },
  { en: 'Vivah Panchami (Rama-Sita wedding anniversary)', hi: 'विवाह पंचमी (राम-सीता विवाह वर्षगांठ)', mai: 'विवाह पंचमी (राम-सीता विवाहक वर्षगांठ)', date: 'Sun, 6 Dec 2026', tithi: 'Margashirsha Shukla Panchami' },
];

const FESTIVAL_DATES_2027 = [
  { en: 'Makar Sankranti (Tilkut distribution)', hi: 'मकर संक्रान्ति (तिलकुट वितरण)', mai: 'मकर संक्रान्ति (तिलकुट बांटल जाइत अछि)', date: 'Thu, 14 Jan 2027', tithi: 'Paush Shukla Dashami' },
  { en: 'Saraswati Puja / Vasant Panchami', hi: 'सरस्वती पूजा / वसन्त पंचमी', mai: 'सरस्वती पूजा / बसन्त पंचमी', date: 'Thu, 11 Feb 2027', tithi: 'Magha Shukla Panchami' },
  { en: 'Holi / Phaguwa (Holika Dahan)', hi: 'होली / फगुआ (होलिका दहन)', mai: 'होली / फगुआ (होलिका दहन)', date: 'Sun, 22 Mar 2027', tithi: 'Phalguna Purnima' },
  { en: 'Chaiti Chhath (Usha Arghya)', hi: 'चैती छठ (ऊषा अर्घ्य)', mai: 'चैती छठि (ऊषा अर्घ्य)', date: 'Sun, 21 Mar 2027', tithi: 'Chaitra Shukla Shashthi' },
  { en: 'Ramnavami', hi: 'रामनवमी', mai: 'रामनवमी', date: 'Thu, 25 Mar 2027', tithi: 'Chaitra Shukla Navami' },
  { en: 'Madhushravani begins (Shravan)', hi: 'मधुश्रावणी आरम्भ (श्रावण)', mai: 'मधुश्रावणी आरम्भ (सावन)', date: 'Fri, 9 Jul 2027', tithi: 'Shravan Shukla Chaturthi (approx.)' },
  { en: 'Jitiya / Jivitputrika Vrat', hi: 'जितिया / जीवित्पुत्रिका व्रत', mai: 'जितिया / जीवित्पुत्रिका व्रत', date: 'Tue, 14 Sep 2027', tithi: 'Ashwin Krishna Ashtami' },
  { en: 'Navaratri begins (Ghatasthapana)', hi: 'नवरात्रि आरम्भ (घटस्थापना)', mai: 'नवरात्रि आरम्भ (घटस्थापना)', date: 'Mon, 27 Sep 2027', tithi: 'Ashwin Shukla Pratipada' },
  { en: 'Dussehra / Vijayadashami', hi: 'दशहरा / विजयादशमी', mai: 'दशहरा / विजयादशमी', date: 'Wed, 6 Oct 2027', tithi: 'Ashwin Shukla Dashami' },
  { en: 'Sama-Chakeva begins (Kojagara Purnima)', hi: 'सामा-चकेवा आरम्भ (कोजागरा पूर्णिमा)', mai: 'सामा-चकेवा आरम्भ (कोजागरा पूर्णिमा)', date: 'Wed, 13 Oct 2027', tithi: 'Ashwin Purnima' },
  { en: 'Diwali (Lakshmi Puja)', hi: 'दीवाली (लक्ष्मी पूजा)', mai: 'दीपावली (लक्ष्मी पूजा)', date: 'Thu, 28 Oct 2027', tithi: 'Kartik Krishna Amavasya' },
  { en: 'Chhath Puja  –  Nahay Khay (Day 1)', hi: 'छठ पूजा  –  नहाय खाय (दिन 1)', mai: 'छठि पूजा  –  नहाय खाय (पहिल दिन)', date: 'Fri, 29 Oct 2027', tithi: 'Kartik Shukla Chaturthi' },
  { en: 'Chhath Puja  –  Kharna/Lohanda (Day 2)', hi: 'छठ पूजा  –  खरना/लोहंडा (दिन 2)', mai: 'छठि पूजा  –  खरना/लोहंडा (दोसर दिन)', date: 'Sat, 30 Oct 2027', tithi: 'Kartik Shukla Panchami' },
  { en: 'Chhath Puja  –  Sandhya Arghya (Day 3)', hi: 'छठ पूजा  –  सन्ध्या अर्घ्य (दिन 3)', mai: 'छठि पूजा  –  सन्ध्या अर्घ्य (तेसर दिन)', date: 'Sun, 31 Oct 2027', tithi: 'Kartik Shukla Shashthi' },
  { en: 'Chhath Puja  –  Usha Arghya (Day 4)', hi: 'छठ पूजा  –  ऊषा अर्घ्य (दिन 4)', mai: 'छठि पूजा  –  ऊषा अर्घ्य (चारिम दिन)', date: 'Mon, 1 Nov 2027', tithi: 'Kartik Shukla Saptami' },
  { en: 'Vivah Panchami (Rama-Sita wedding anniversary)', hi: 'विवाह पंचमी (राम-सीता विवाह वर्षगांठ)', mai: 'विवाह पंचमी (राम-सीता विवाहक वर्षगांठ)', date: 'Thu, 25 Nov 2027', tithi: 'Margashirsha Shukla Panchami' },
];

// ═══════════════════════════════════════════════════════════════════════════
// FAQ data for structured data (SEO)
// ═══════════════════════════════════════════════════════════════════════════

const FAQ_DATA = [
  {
    q: { en: 'When is Chhath Puja 2026?', hi: 'छठ पूजा 2026 कब है?', mai: 'छठि पूजा 2026 कहिया अछि?' },
    a: {
      en: 'Chhath Puja 2026 spans four days: Nahay Khay on Sunday 8 November, Kharna/Lohanda on Monday 9 November, Sandhya Arghya (offering to the setting sun) on Tuesday 10 November (Kartik Shukla Shashthi), and Usha Arghya (offering to the rising sun and breaking the fast) on Wednesday 11 November 2026. The festival is observed across Mithilanchal, Bihar, Jharkhand, eastern UP, and Nepal Terai.',
      hi: 'छठ पूजा 2026 चार दिनों तक चलेगी: नहाय खाय रविवार 8 नवम्बर, खरना/लोहंडा सोमवार 9 नवम्बर, सन्ध्या अर्घ्य (डूबते सूर्य को अर्घ्य) मंगलवार 10 नवम्बर (कार्तिक शुक्ल षष्ठी), और ऊषा अर्घ्य (उगते सूर्य को अर्घ्य और व्रत तोड़ना) बुधवार 11 नवम्बर 2026 को।',
      mai: 'छठि पूजा 2026 चारि दिन चलत: नहाय खाय रविदिन 8 नवम्बर, खरना/लोहंडा सोमदिन 9 नवम्बर, सन्ध्या अर्घ्य मंगलदिन 10 नवम्बर (कार्तिक शुक्ल षष्ठी), आ ऊषा अर्घ्य बुधदिन 11 नवम्बर 2026 केँ।',
    },
  },
  {
    q: { en: 'What is Sama-Chakeva?', hi: 'सामा-चकेवा क्या है?', mai: 'सामा-चकेवा की अछि?' },
    a: {
      en: 'Sama-Chakeva is a festival unique to Mithila, celebrated from Kartik Purnima (full moon of Kartik) through Kartik Shukla Saptami. It is a brother-sister festival where sisters mould clay birds representing Sama (a girl cursed to become a bird) and Chakeva (her brother). Over several days, sisters perform rituals, sing traditional Maithili songs, and pray for their brothers\' well-being. On the final day, the clay figures are ceremonially immersed in water. The festival has no parallel elsewhere in India and preserves one of the oldest folk narratives of Mithila.',
      hi: 'सामा-चकेवा मिथिला का एक अनूठा त्योहार है, जो कार्तिक पूर्णिमा से कार्तिक शुक्ल सप्तमी तक मनाया जाता है। यह भाई-बहन का त्योहार है जहां बहनें मिट्टी के पक्षी (सामा और चकेवा) बनाती हैं। अन्तिम दिन मिट्टी की मूर्तियों का विसर्जन होता है। भारत में कहीं और यह त्योहार नहीं मनाया जाता।',
      mai: 'सामा-चकेवा मिथिलाक एक अनूठा पर्व अछि, जे कार्तिक पूर्णिमा सँ कार्तिक शुक्ल सप्तमी तक मनाओल जाइत अछि। ई भाय-बहिनक पर्व अछि जाहि मे बहिन माटिक चिड़ै (सामा आ चकेवा) बनबैत छथि। अन्तिम दिन माटिक मूर्तिक विसर्जन होइत अछि। भारत मे आर कतहु ई पर्व नहि मनाओल जाइत अछि।',
    },
  },
  {
    q: { en: 'When is Jitiya 2026?', hi: 'जितिया 2026 कब है?', mai: 'जितिया 2026 कहिया अछि?' },
    a: {
      en: 'Jitiya (Jivitputrika Vrat) 2026 falls on Friday, 25 September 2026, on Ashwin Krishna Ashtami. It is a 3-day observance: Nahai Khai (day before, eating only after bathing), the main nirjala (waterless) fast on Jitiya day, and Paaran (breaking the fast the next morning). Mothers observe this extremely strict fast for the long life and well-being of their children. It is considered the most austere fast in the Hindu calendar, even stricter than Chhath Puja.',
      hi: 'जितिया (जीवित्पुत्रिका व्रत) 2026 शुक्रवार, 25 सितम्बर 2026 को आश्विन कृष्ण अष्टमी पर पड़ता है। 3 दिन का पालन: नहाय खाय (पहले दिन), मुख्य निर्जला व्रत जितिया के दिन, और पारण (अगली सुबह व्रत तोड़ना)। माताएं अपने बच्चों की दीर्घायु के लिए यह अत्यन्त कठोर व्रत रखती हैं।',
      mai: 'जितिया (जीवित्पुत्रिका व्रत) 2026 शुक्रदिन, 25 सितम्बर 2026 केँ आश्विन कृष्ण अष्टमी पर पड़ैत अछि। 3 दिनक पालन: नहाय खाय (पहिल दिन), मुख्य निर्जला व्रत जितियाक दिन, आ पारण (अगिला भोर मे व्रत तोड़ब)। माय लोकनि अपन बच्चाक दीर्घायुक लेल ई अत्यन्त कठोर व्रत रखैत छथि।',
    },
  },
  {
    q: { en: 'How does the Mithila calendar differ from other Hindu calendars?', hi: 'मिथिला कैलेंडर अन्य हिन्दू कैलेंडर से कैसे भिन्न है?', mai: 'मिथिला कैलेंडर दोसर हिन्दू कैलेंडरसँ कोना भिन्न अछि?' },
    a: {
      en: 'The Mithila calendar follows the Purnimant (full-moon-ending) lunisolar system, where each month concludes on Purnima. This contrasts with the Amant system used in Gujarat, Maharashtra, and South India, where months end on Amavasya (new moon). Unlike the reformed Bengali or Tamil solar calendars with fixed month lengths, the Mithila calendar retains the classical variable-length lunar months. The Mithila calendar also preserves festivals found nowhere else in India  –  Sama-Chakeva, Jitiya, Madhushravani, and the distinctive Maithili Chhath tradition. The months use Maithili pronunciation (Chait, Baisakh, Jeth, etc.) rather than Sanskritised names.',
      hi: 'मिथिला कैलेंडर पूर्णिमान्त चान्द्र-सौर प्रणाली का पालन करता है, जहां प्रत्येक मास पूर्णिमा पर समाप्त होता है। यह गुजरात, महाराष्ट्र और दक्षिण भारत में प्रयुक्त अमान्त प्रणाली से भिन्न है। सुधारित बंगाली या तमिल सौर कैलेंडर के विपरीत, मिथिला कैलेंडर शास्त्रीय परिवर्तनशील चान्द्र मास बनाए रखता है। इसमें सामा-चकेवा, जितिया, मधुश्रावणी जैसे विशिष्ट त्योहार भी हैं।',
      mai: 'मिथिला कैलेंडर पूर्णिमान्त चान्द्र-सौर प्रणालीक पालन करैत अछि, जाहि मे प्रत्येक मास पूर्णिमा पर समाप्त होइत अछि। ई गुजरात, महाराष्ट्र आ दक्षिण भारत मे प्रयुक्त अमान्त प्रणालीसँ भिन्न अछि। सुधारित बंगाली या तमिल सौर कैलेंडरक विपरीत, मिथिला कैलेंडर शास्त्रीय परिवर्तनशील चान्द्र मास बनाए रखैत अछि। एहि मे सामा-चकेवा, जितिया, मधुश्रावणी जेहेन विशिष्ट पर्व सेहो अछि।',
    },
  },
  {
    q: { en: 'What is Madhushravani?', hi: 'मधुश्रावणी क्या है?', mai: 'मधुश्रावणी की अछि?' },
    a: {
      en: 'Madhushravani is a month-long festival unique to Mithila, observed during the month of Shravan (July-August) by newly married women. The bride performs daily puja at her marital home, worshipping Shiva and Parvati with flowers, fruits, and special offerings. Each evening, the family gathers to listen to traditional stories (kathas) about marital devotion and divine love. The bride also creates Madhubani-style floor paintings (Aripan). The observance lasts the entire month of Shravan and is considered essential for the happiness and longevity of the marriage. It is one of the few month-long Hindu festivals still practised in its traditional form.',
      hi: 'मधुश्रावणी मिथिला का एक मास-भर चलने वाला विशिष्ट त्योहार है, जो श्रावण मास (जुलाई-अगस्त) में नवविवाहित महिलाओं द्वारा पालन किया जाता है। वधू अपने ससुराल में प्रतिदिन शिव-पार्वती की पूजा करती है। प्रत्येक सन्ध्या में परिवार वैवाहिक भक्ति की पारम्परिक कथाएं सुनता है। वधू मधुबनी शैली के अरिपन भी बनाती है। यह पूरे श्रावण मास तक चलता है।',
      mai: 'मधुश्रावणी मिथिलाक एक मास भरि चलय वाला विशिष्ट पर्व अछि, जे श्रावण (सावन) मास मे नवबहुक द्वारा पालन कएल जाइत अछि। बहु अपन ससुराल मे प्रतिदिन शिव-पार्वतीक पूजा करैत छथि। प्रत्येक साँझ मे परिवार वैवाहिक भक्तिक पारम्परिक कथा सुनैत अछि। बहु मधुबनी शैलीक अरिपन सेहो बनबैत छथि। ई पूरा सावन मास तक चलैत अछि।',
    },
  },
  {
    q: { en: 'When is Vivah Panchami 2026?', hi: 'विवाह पंचमी 2026 कब है?', mai: 'विवाह पंचमी 2026 कहिया अछि?' },
    a: {
      en: 'Vivah Panchami 2026 falls on Sunday, 6 December 2026, on Margashirsha Shukla Panchami. This festival commemorates the divine wedding of Lord Rama and Goddess Sita at Janakpur (in modern-day Nepal, adjacent to Mithilanchal). Grand celebrations take place at the Janaki Mandir in Janakpur and across Mithila, re-enacting the legendary wedding ceremony. In Mithila, it holds special significance as Sita (also called Janaki, daughter of King Janak of Mithila) is the most revered deity of the region.',
      hi: 'विवाह पंचमी 2026 रविवार, 6 दिसम्बर 2026 को मार्गशीर्ष शुक्ल पंचमी पर पड़ती है। यह त्योहार जनकपुर में भगवान राम और देवी सीता के दिव्य विवाह की स्मृति में मनाया जाता है। मिथिला में इसका विशेष महत्व है क्योंकि सीता (जानकी) मिथिला के राजा जनक की पुत्री हैं।',
      mai: 'विवाह पंचमी 2026 रविदिन, 6 दिसम्बर 2026 केँ मार्गशीर्ष शुक्ल पंचमी पर पड़ैत अछि। ई पर्व जनकपुर मे भगवान राम आ देवी सीताक दिव्य विवाहक स्मृति मे मनाओल जाइत अछि। मिथिला मे एकर विशेष महत्व अछि कियाकि सीता (जानकी) मिथिलाक राजा जनकक पुत्री छलथि।',
    },
  },
];

const RELATED_LINKS = [
  { slug: 'chhath-puja', en: 'Chhath Puja Vidhi', hi: 'छठ पूजा विधि' },
  { slug: 'navaratri', en: 'Navaratri / Durga Puja Guide', hi: 'नवरात्रि / दुर्गा पूजा विधि' },
  { slug: 'makar-sankranti', en: 'Makar Sankranti Puja', hi: 'मकर संक्रान्ति पूजा' },
  { slug: 'holi', en: 'Holi / Phaguwa Puja', hi: 'होली / फगुआ पूजा' },
  { slug: 'janmashtami', en: 'Janmashtami Puja', hi: 'जन्माष्टमी पूजा' },
  { slug: 'ram-navami', en: 'Ramnavami Puja', hi: 'रामनवमी पूजा' },
];

export default async function MithilaCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeStr } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => tl(LABELS[key] as LocaleText, locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const isMai = locale === ('mai' as Locale);

  // Helper to pick the best locale text from festival date entries
  const fd = (f: { en: string; hi: string; mai: string }) =>
    isMai ? f.mai : isHi ? f.hi : f.en;

  return (
    <main className="min-h-screen bg-bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD(`/${locale}/calendar/regional/mithila`, locale)) }}
      />
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((faq) => ({
              '@type': 'Question',
              name: faq.q.en,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a.en,
              },
            })),
          }),
        }}
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
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/10 text-gold-light">
                  <th className="px-4 py-3 text-left font-bold">#</th>
                  <th className="px-4 py-3 text-left font-bold">{RC('colMonth', locale)}</th>
                  <th className="px-4 py-3 text-left font-bold">{tl({ en: 'Maithili', hi: 'मैथिली', sa: 'मैथिली' }, locale)}</th>
                  <th className="px-4 py-3 text-left font-bold">{RC('colGregorian', locale)}</th>
                </tr>
              </thead>
              <tbody>
                {MITHILA_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
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
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
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
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('madhubaniTitle')}</h2>
          <p className="text-text-secondary leading-relaxed">{L('madhubaniText')}</p>
        </section>

        {/* Monthly Festivals */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-6" style={hf}>{L('festivalsTitle')}</h2>
          <div className="space-y-4">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
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

        {/* ══════════════════════════════════════════════════ */}
        {/* 2026 Mithila Festival Dates                       */}
        {/* ══════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'मिथिला त्योहार 2026 — तिथि और सटीक दिनांक' : 'Mithila Festival Dates 2026 — Tithi & Exact Dates'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isHi
              ? 'दरभंगा/मधुबनी सन्दर्भ के साथ 2026 के प्रमुख मिथिला त्योहारों की सटीक तिथियां। छठ पूजा के सभी 4 दिन, जितिया, सामा-चकेवा, विवाह पंचमी और अन्य विशिष्ट मैथिल पर्व शामिल हैं।'
              : 'Exact dates for all major Mithila festivals in 2026 with tithi (lunar day), computed for Darbhanga/Madhubani. Includes all 4 days of Chhath Puja, Jitiya, Sama-Chakeva, Vivah Panchami, and other distinctive Maithil observances. Plan your vrat and puja with these verified dates.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'तिथि' : 'Tithi'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2026.map((f, i) => (
                  <tr key={`${f.en}-2026`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{fd(f)}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2027 Mithila Festival Dates */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'मिथिला त्योहार 2027 — तिथि और सटीक दिनांक' : 'Mithila Festival Dates 2027 — Tithi & Exact Dates'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isHi
              ? '2027 में प्रमुख मिथिला त्योहार। सभी तिथियां दरभंगा/मधुबनी सन्दर्भ के लिए गणित हैं।'
              : 'Major Mithila festival dates for 2027. All dates computed for Darbhanga/Madhubani reference with tithi from the Mithila Panchang. Includes Chhath Puja (all 4 days), Jitiya, Sama-Chakeva, Madhushravani, Vivah Panchami, and Phaguwa/Holi.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'तिथि' : 'Tithi'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2027.map((f, i) => (
                  <tr key={`${f.en}-2027`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{fd(f)}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mithila Calendar History & Significance (long-form SEO) */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'मिथिला कैलेंडर का इतिहास और महत्व' : 'History & Significance of the Mithila Calendar'}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isHi
                ? 'मिथिला कैलेंडर का इतिहास वैदिक काल से जुड़ा है। मिथिलांचल  –  जिसे विदेह राज्य भी कहा जाता था  –  उपनिषदों में वर्णित राजा जनक का राज्य था, जो दार्शनिक विमर्श और वेदान्त ज्ञान के लिए प्रसिद्ध था। याज्ञवल्क्य, गार्गी और मैत्रेयी जैसे ऋषि इसी क्षेत्र से थे। इस बौद्धिक परम्परा ने मिथिला के पंचांग को विशेष सटीकता और शास्त्रीय शुद्धता प्रदान की। पंचांग गणना के लिए मिथिला के ज्योतिषी "सूर्य सिद्धान्त" और "सिद्धान्त शिरोमणि" जैसे शास्त्रीय ग्रन्थों पर निर्भर रहे हैं।'
                : 'The Mithila calendar traces its roots to the Vedic period. Mithilanchal  –  also known as the Videha Kingdom  –  was the realm of King Janak described in the Upanishads, renowned for philosophical discourse and Vedantic wisdom. Sages like Yajnavalkya, Gargi, and Maitreyi hailed from this region. This intellectual tradition endowed the Mithila Panchang with particular rigour and classical purity. Mithila\'s astronomers relied on classical treatises such as the Surya Siddhanta and Siddhanta Shiromani for their panchang computations, maintaining an unbroken tradition of astronomical observation in the region.'}
            </p>
            <p>
              {isHi
                ? 'मिथिला के पंचांग की एक विशिष्ट विशेषता यह है कि इसने पूर्णिमान्त प्रणाली को अपरिवर्तित रखा है। जबकि गुजरात और महाराष्ट्र ने अमान्त प्रणाली अपनाई और बंगाल तथा तमिलनाडु ने सौर कैलेंडर में सुधार किया, मिथिला ने शास्त्रीय चान्द्र-सौर प्रणाली बनाए रखी। पंचांग प्रत्येक दिन के लिए तिथि, नक्षत्र, योग, करण और वार की गणना करता है  –  ये पंचांग (पांच अंग) ही इसका नाम देते हैं। मिथिला के पंडित परम्परागत रूप से हस्तलिखित पंचांग (पत्रा/पत्री) तैयार करते थे, और आज भी कई परिवार मुद्रित पत्री पर निर्भर करते हैं।'
                : 'A distinctive feature of the Mithila Panchang is its unwavering retention of the Purnimant system. While Gujarat and Maharashtra adopted the Amant system and Bengal and Tamil Nadu reformed their calendars into solar systems, Mithila preserved the classical lunisolar framework. The panchang computes tithi (lunar day), nakshatra (lunar mansion), yoga (Sun-Moon angular relationship), karana (half-tithi), and vara (weekday) for each day  –  these five elements (panch-anga) give the almanac its name. Mithila\'s pandits traditionally prepared handwritten panchangs (patra/patri), and even today many families rely on printed patris alongside digital tools for determining auspicious timings for weddings, Upanayana, and other samskaras.'}
            </p>
            <p>
              {isHi
                ? 'मिथिलांचल की विवाह परम्परा पूर्णतः पंचांग पर निर्भर है। "पैनी" (पंजी प्रबन्ध) प्रणाली  –  जो 14वीं शताब्दी से चली आ रही वंशावली अभिलेख है  –  विवाह योग्यता निर्धारित करती है, और मुहूर्त पंचांग से निकाला जाता है। यह प्रणाली विश्व के सबसे पुरानी सामाजिक अभिलेख प्रणालियों में से एक है। मधुबनी चित्रकला, जो कैलेंडर चक्र से अविभाज्य है, को 2003 में GI टैग प्राप्त हुआ और यह अन्तरराष्ट्रीय स्तर पर मान्यता प्राप्त है।'
                : 'The marriage tradition of Mithilanchal is entirely dependent on the panchang. The "Paini" (Panji Prabandh) system  –  a genealogical record dating from the 14th century  –  determines marriage eligibility, and the muhurta is derived from the panchang. This system is one of the oldest social record-keeping systems in the world, predating European parish registers by centuries. Madhubani painting, which is inseparable from the calendar cycle, received its GI (Geographical Indication) tag in 2003 and has gained international recognition through exhibitions at the Smithsonian, the British Museum, and museums across Europe and Japan.'}
            </p>
          </div>
        </section>

        {/* Sita & Mithila  –  Cultural Significance */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isHi ? 'सीता और मिथिला  –  सांस्कृतिक महत्व' : 'Sita & Mithila  –  Cultural Significance'}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              {isHi
                ? 'मिथिला कैलेंडर और संस्कृति सीता (जानकी) से अविभाज्य है। रामायण के अनुसार, सीता मिथिला के राजा जनक की पुत्री थीं, और उनका विवाह अयोध्या के राजकुमार राम से जनकपुर में हुआ था  –  यह घटना प्रतिवर्ष विवाह पंचमी (मार्गशीर्ष शुक्ल पंचमी) पर मनाई जाती है। सीता नवमी (वैशाख शुक्ल नवमी) सीता के अवतरण दिवस के रूप में मनाई जाती है  –  एक त्योहार जो लगभग विशेष रूप से मिथिला में ही मनाया जाता है। जनकपुर (नेपाल) में भव्य जानकी मन्दिर इस सम्बन्ध का जीवन्त प्रतीक है।'
                : 'The Mithila calendar and culture are inseparable from Sita (Janaki). According to the Ramayana, Sita was the daughter of King Janak of Mithila, and her marriage to Prince Rama of Ayodhya took place at Janakpur  –  an event commemorated annually on Vivah Panchami (Margashirsha Shukla Panchami). Sita Navami (Vaishakh Shukla Navami) celebrates Sita\'s appearance day  –  a festival observed almost exclusively in Mithila. The grand Janaki Temple at Janakpur (Nepal) is a living symbol of this connection. Mithila\'s identity as Sita\'s homeland gives the region a unique place in Hindu cultural geography and infuses the calendar with festivals and observances that foreground feminine divinity.'}
            </p>
          </div>
        </section>

        {/* FAQ Section (visible + structured data) */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <details key={i} className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isMai ? faq.q.mai : isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isMai ? faq.a.mai : isHi ? faq.a.hi : faq.a.en}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>{L('relatedTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <Link key={link.slug} href={`/puja/${link.slug}`}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-sm text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors font-medium">
                {isHi ? link.hi : link.en}
              </Link>
            ))}
            <Link href="/calendar"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-sm text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors font-medium">
              {tl({ en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', sa: 'त्योहार कैलेंडर 2026' }, locale)}
            </Link>
            <Link href="/panchang"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-sm text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors font-medium">
              {tl({ en: "Today's Panchang", hi: "आज का पंचांग", sa: "आज का पंचांग" }, locale)}
            </Link>
            <Link href="/calendar/regional/bengali"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-sm text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors font-medium">
              {tl({ en: 'Bengali Calendar (Panjika)', hi: 'बंगाली कैलेंडर (पंजिका)', sa: 'बंगाली कैलेंडर (पंजिका)' }, locale)}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

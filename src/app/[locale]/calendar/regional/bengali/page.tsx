import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS = {
  title: {
    en: 'Bengali Calendar (Panjika)',
    hi: 'बंगाली कैलेंडर (पंजिका)',
    sa: 'बङ्गालपञ्जिका',
    ta: 'வங்காள நாள்காட்டி (பஞ்சிகா)',
    te: 'బెంగాలీ క్యాలెండర్ (పంజికా)',
    bn: 'বাংলা পঞ্জিকা',
    kn: 'ಬಂಗಾಲಿ ಕ್ಯಾಲೆಂಡರ್ (ಪಂಜಿಕಾ)',
    mr: 'बंगाली दिनदर्शिका (पंजिका)', gu: 'બંગાળી કેલેન્ડર (પંજિકા)', mai: 'बंगाली कैलेंडर (पंजिका)',
  },
  intro: {
    en: 'The Bengali calendar, known as the "Bangla Panjika" or "Bangabda," is the traditional calendar of the Bengali-speaking people of West Bengal, Bangladesh, Tripura, and the global Bengali diaspora. Revised in 1966 by a committee led by Dr. Meghnad Saha (the astrophysicist who formulated the Saha ionization equation), the modern Bengali calendar is a reformed solar calendar that maintains close alignment with the Gregorian system while preserving its ancient roots. The Panjika serves as the authoritative reference for all religious observances, festivals, and auspicious timings in Bengali Hindu culture. Over 250 million people follow the Bengali calendar today.',
    hi: 'बंगाली कैलेंडर, जिसे "बांग्ला पंजिका" या "बंगाब्द" कहा जाता है, पश्चिम बंगाल, बांग्लादेश, त्रिपुरा और वैश्विक बंगाली प्रवासी समुदाय का पारम्परिक कैलेंडर है। 1966 में डॉ. मेघनाद साहा (जिन्होंने साहा आयनन समीकरण प्रतिपादित किया) के नेतृत्व में एक समिति द्वारा संशोधित, आधुनिक बंगाली कैलेंडर एक सुधारित सौर कैलेंडर है। पंजिका बंगाली हिन्दू संस्कृति में सभी धार्मिक अनुष्ठानों, त्योहारों और शुभ समय का आधिकारिक सन्दर्भ है।',
    sa: 'बङ्गालपञ्जिका बङ्गालभाषिजनानां पारम्परिकं पञ्चाङ्गम्। १९६६ तमे वर्षे डॉ. मेघनादसाहामहोदयस्य नेतृत्वे संशोधितं आधुनिकबङ्गालपञ्चाङ्गं सुधारितसौरपञ्चाङ्गम् अस्ति।',
    ta: 'வங்காள நாள்காட்டி, "பாங்களா பஞ்சிகா" அல்லது "பங்காப்தா" என அறியப்படுவது, மேற்கு வங்காளம், வங்கதேசம், திரிபுரா மற்றும் உலகளாவிய வங்காள புலம்பெயர்ந்தோரின் பாரம்பரிய நாள்காட்டி ஆகும். 1966 இல் டாக்டர் மேகநாத் சாகா தலைமையிலான குழுவால் திருத்தப்பட்ட நவீன வங்காள நாள்காட்டி, கிரிகோரியன் முறையுடன் நெருக்கமான ஒத்திசைவைப் பேணும் சீர்திருத்தப்பட்ட சூரிய நாள்காட்டி ஆகும். பஞ்சிகா வங்காள இந்து கலாசாரத்தில் அனைத்து மத அனுஷ்டானங்கள், திருவிழாக்கள் மற்றும் சுப நேரங்களுக்கான அதிகாரபூர்வ குறிப்பாகும்.',
  },
  monthsTitle: {
    en: 'The 12 Bengali Months',
    hi: '12 बंगाली मास',
    sa: '१२ बङ्गालमासाः',
    ta: '12 வங்காள மாதங்கள்',
    te: '12 బెంగాలీ నెలలు',
    bn: '১২টি বাংলা মাস',
    kn: '12 ಬಂಗಾಲಿ ತಿಂಗಳುಗಳು',
    mr: '12 बंगाली महिने', gu: '12 બંગાળી મહિના', mai: '12 बंगाली मास',
  },
  monthsIntro: {
    en: 'After the Saha calendar reform, the first five months (Boishakh to Bhadro) have 31 days each, and the remaining seven months (Ashwin to Choitro) have 30 days each, totalling 365 days (366 in leap years, when Choitro gets an extra day). This reform eliminated the variable-length months of the older sidereal system, making date calculations predictable while preserving the traditional month names that derive from the same Nakshatras as the pan-Indian Hindu calendar.',
    hi: 'साहा कैलेंडर सुधार के बाद, पहले पांच मास (बैशाख से भाद्र) में 31 दिन और शेष सात मास (आश्विन से चैत्र) में 30 दिन होते हैं, कुल 365 दिन (लीप वर्ष में 366)। इस सुधार ने पुरानी प्रणाली के परिवर्तनशील मासों को समाप्त किया।',
    sa: 'साहापञ्चाङ्गसंशोधनानन्तरं प्रथमपञ्चमासेषु (बैशाखात् भाद्रपर्यन्तम्) ३१ दिनानि शेषसप्तमासेषु ३० दिनानि भवन्ति।',
    ta: 'சாகா நாள்காட்டி சீர்திருத்தத்திற்குப் பிறகு, முதல் ஐந்து மாதங்களில் (பைசாக் முதல் பாத்ரோ வரை) தலா 31 நாட்களும், மீதமுள்ள ஏழு மாதங்களில் (அஸ்வின் முதல் சொய்த்ரோ வரை) தலா 30 நாட்களும் உள்ளன, மொத்தம் 365 நாட்கள் (லீப் ஆண்டுகளில் 366). இந்த சீர்திருத்தம் பழைய முறையின் மாறுபட்ட நீள மாதங்களை நீக்கியது.',
  },
  durgaPujaTitle: {
    en: 'Durga Puja — The Soul of Bengal',
    hi: 'दुर्गा पूजा — बंगाल की आत्मा',
    sa: 'दुर्गापूजा — बङ्गालस्य आत्मा',
    ta: 'துர்கா பூஜை — வங்காளத்தின் ஆன்மா',
    te: 'దుర్గా పూజ — బెంగాల్ ఆత్మ',
    bn: 'দুর্গা পূজা — বাংলার আত্মা',
    kn: 'ದುರ್ಗಾ ಪೂಜೆ — ಬಂಗಾಲದ ಆತ್ಮ',
    mr: 'दुर्गा पूजा — बंगालची आत्मा', gu: 'દુર્ગા પૂજા — બંગાળનો આત્મા', mai: 'दुर्गा पूजा — बंगालक आत्मा',
  },
  durgaPujaText: {
    en: 'Durga Puja is not merely a festival in Bengal — it is the defining cultural event of the year, a 10-day celebration that transforms cities, towns, and villages into open-air art galleries and communal gathering spaces. The observances begin with Mahalaya (the Amavasya of Ashwin), when Bengalis wake before dawn to listen to Birendra Krishna Bhadra\'s legendary All India Radio recitation of "Mahishasura Mardini" — a tradition since 1931 that remains unchanged. Mahalaya marks the end of Pitru Paksha and the invocation of Goddess Durga to descend to Earth. The main puja spans Shashti through Dashami: Shashti (day 6) features the "Bodhon" or awakening of the deity; Saptami (day 7) begins with "Nabapatrika" (nine plants representing nine forms of Durga) being bathed in the Ganges; Ashtami (day 8) is the most sacred day with "Kumari Puja" (worshipping a young girl as the living Goddess) and "Sandhi Puja" at the junction of Ashtami and Navami (the precise 48-minute window when Durga slew the demons Chanda and Munda); Navami (day 9) continues with elaborate rituals; and Dashami (day 10) concludes with "Sindoor Khela" (married women apply vermillion to the Goddess and each other) and the emotional "Bisarjan" (immersion of the idol in water), accompanied by the cry "Asche bochor abar hobe!" (It will happen again next year!). Thousands of themed pandals (temporary structures) across Kolkata compete for artistic excellence, some replicating famous buildings, others showcasing social commentary through innovative installations.',
    hi: 'दुर्गा पूजा बंगाल में केवल एक त्योहार नहीं — यह वर्ष की सबसे परिभाषित सांस्कृतिक घटना है, एक 10-दिवसीय उत्सव जो शहरों और गांवों को खुली कला दीर्घाओं में बदल देता है। उत्सव महालया (आश्विन अमावस्या) से आरम्भ होता है, जब बंगाली भोर से पहले जागकर बीरेन्द्र कृष्ण भद्र की "महिषासुर मर्दिनी" सुनते हैं — 1931 से अपरिवर्तित परम्परा। मुख्य पूजा षष्ठी से दशमी तक होती है: षष्ठी में "बोधन", सप्तमी में "नबपत्रिका" स्नान, अष्टमी में "कुमारी पूजा" और "सन्धि पूजा", और दशमी में "सिन्दूर खेला" और भावुक "बिसर्जन"। कोलकाता भर में हज़ारों थीमयुक्त पंडाल कलात्मक उत्कृष्टता के लिए प्रतिस्पर्धा करते हैं।',
    sa: 'दुर्गापूजा बङ्गाले केवलं पर्व नास्ति — वर्षस्य परिभाषितसांस्कृतिकघटना अस्ति, दशदिनात्मकम् उत्सवः। महालयातः (आश्विनामावस्यायाः) दशमीपर्यन्तम् उत्सवः प्रचलति।',
    ta: 'துர்கா பூஜை வங்காளத்தில் வெறும் திருவிழா அல்ல — இது ஆண்டின் மிகச் சிறந்த கலாசார நிகழ்வு, நகரங்களையும் கிராமங்களையும் திறந்தவெளி கலைக் கூடங்களாக மாற்றும் 10 நாள் கொண்டாட்டம். மகாலயா (அஸ்வின் அமாவாசை) அன்று தொடங்கி, பீரேந்திர கிருஷ்ண பத்ராவின் "மகிஷாசுர மர்தினி" ஒலிபரப்பை வங்காளிகள் விடியலுக்கு முன் எழுந்து கேட்கிறார்கள் — 1931 முதல் மாறாத பாரம்பரியம். முக்கிய பூஜை ஷஷ்டி முதல் தசமி வரை: ஷஷ்டியில் "போதன்", சப்தமியில் "நவபத்ரிகா" நீராட்டு, அஷ்டமியில் "குமாரி பூஜை" மற்றும் "சந்தி பூஜை", தசமியில் "சிந்தூர் கேலா" மற்றும் உணர்ச்சிகரமான "பிசர்ஜன்". கொல்கத்தா முழுவதும் ஆயிரக்கணக்கான கருப்பொருள் பந்தல்கள் கலைத் திறனுக்காகப் போட்டியிடுகின்றன.',
  },
  panjikaTitle: {
    en: 'How the Bengali Panjika Differs',
    hi: 'बंगाली पंजिका कैसे भिन्न है',
    sa: 'बङ्गालपञ्जिका कथं भिन्ना',
    ta: 'வங்காள பஞ்சிகா எவ்வாறு வேறுபடுகிறது',
    te: 'బెంగాలీ పంజికా ఎలా భిన్నంగా ఉంది',
    bn: 'বাংলা পঞ্জিকা কীভাবে ভিন্ন',
    kn: 'ಬಂಗಾಲಿ ಪಂಜಿಕಾ ಹೇಗೆ ಭಿನ್ನವಾಗಿದೆ',
    mr: 'बंगाली पंजिका कशी वेगळी आहे', gu: 'બંગાળી પંજિકા કેવી રીતે અલગ છે', mai: 'बंगाली पंजिका कोना भिन्न अछि',
  },
  panjikaText: {
    en: 'The Bengali Panjika is distinguished from other Indian calendar systems in several important ways. First, the Bengali calendar year (Bangabda) begins on Poila Boishakh (1st Boishakh), which falls on April 14th or 15th — the same as the Tamil and Malayalam New Year, reflecting their shared solar basis. This contrasts with the North Indian New Year (Chaitra Shukla Pratipada) which falls on a different date each year because it follows the lunar cycle. Second, the Saha reform of 1966 made the Bengali calendar the most scientifically rationalized Hindu calendar: fixed month lengths, synchronized leap years with the Gregorian calendar, and elimination of accumulated errors from the sidereal system. Third, the Panjika traditionally published by houses like Gupta Press (est. 1875) and the Bishudha Siddhanta Panjika is far more than a calendar — it contains daily Tithi, Nakshatra, Yoga, Karana, planetary positions, muhurtas for every day, eclipse data, marriage dates, agricultural advice, and even weather predictions based on traditional almanac science. Many Bengali families consider the annual Panjika purchase an essential household tradition. Fourth, the Bengali system maintains a unique tradition of "Lagna calculation" for Durga Puja — the exact starting time of Puja is calculated astronomically based on the rising point of the Zodiac, and different Panjikas may prescribe slightly different timings based on their computational methods.',
    hi: 'बंगाली पंजिका अन्य भारतीय कैलेंडर प्रणालियों से कई महत्वपूर्ण तरीकों से भिन्न है। प्रथम, बंगाली वर्ष (बंगाब्द) पहला बैशाख (14/15 अप्रैल) से आरम्भ होता है — तमिल और मलयालम नव वर्ष के समान। द्वितीय, 1966 का साहा सुधार बंगाली कैलेंडर को सबसे वैज्ञानिक रूप से युक्तिसंगत हिन्दू कैलेंडर बनाता है। तृतीय, गुप्त प्रेस और बिशुद्ध सिद्धान्त पंजिका जैसे प्रकाशनों द्वारा प्रकाशित पंजिका केवल कैलेंडर नहीं — दैनिक तिथि, नक्षत्र, योग, करण, ग्रह स्थिति, मुहूर्त, ग्रहण, विवाह तिथियां, कृषि परामर्श और मौसम पूर्वानुमान भी शामिल होते हैं। चतुर्थ, दुर्गा पूजा के लिए "लग्न गणना" की अनूठी परम्परा है।',
    sa: 'बङ्गालपञ्जिका अन्यभारतीयपञ्चाङ्गपद्धतिभ्यः बहुविधं भिन्ना। बङ्गालवर्षं (बङ्गाब्दम्) प्रथमबैशाखे आरभ्यते। १९६६ तमस्य साहासंशोधनं बङ्गालपञ्चाङ्गं वैज्ञानिकतमं हिन्दूपञ्चाङ्गं करोति।',
    ta: 'வங்காள பஞ்சிகா பல முக்கிய வழிகளில் மற்ற இந்திய நாள்காட்டி முறைகளிலிருந்து வேறுபடுகிறது. முதலாவது, வங்காள ஆண்டு (பங்காப்தா) பொய்லா பைசாக் (ஏப்ரல் 14/15) அன்று தொடங்குகிறது — தமிழ் மற்றும் மலையாள புத்தாண்டைப் போன்றது. இரண்டாவது, 1966 சாகா சீர்திருத்தம் வங்காள நாள்காட்டியை மிகவும் அறிவியல்பூர்வமாக ஒழுங்குபடுத்தப்பட்ட இந்து நாள்காட்டியாக ஆக்குகிறது. மூன்றாவது, குப்தா பிரஸ் மற்றும் பிஷுத்த சித்தாந்த பஞ்சிகா போன்ற வெளியீடுகள் வெறும் நாள்காட்டி அல்ல — தினசரி திதி, நட்சத்திரம், யோகம், கரணம், கிரக நிலை, முகூர்த்தம், கிரகணம், திருமண தேதிகள் மற்றும் வானிலை கணிப்புகளும் அடங்கும். நான்காவது, துர்கா பூஜைக்கான "லக்னம் கணக்கீடு" என்ற தனித்துவ பாரம்பரியம் உள்ளது.',
  },
  festivalsTitle: {
    en: 'Major Bengali Festivals by Month',
    hi: 'मास अनुसार प्रमुख बंगाली त्योहार',
    sa: 'मासानुसारं प्रमुखबङ्गालपर्वाणि',
    ta: 'மாதம் வாரியாக முக்கிய வங்காள திருவிழாக்கள்',
    te: 'నెల వారీ ప్రధాన బెంగాలీ పండుగలు',
    bn: 'মাস অনুসারে প্রধান বাংলা উৎসব',
    kn: 'ತಿಂಗಳ ಪ್ರಕಾರ ಪ್ರಮುಖ ಬಂಗಾಲಿ ಹಬ್ಬಗಳು',
    mr: 'महिन्यानुसार प्रमुख बंगाली सण', gu: 'મહિના પ્રમાણે મુખ્ય બંગાળી તહેવારો', mai: 'मास अनुसार प्रमुख बंगाली पर्व',
  },
  poilaTitle: {
    en: 'Poila Boishakh — Bengali New Year',
    hi: 'पहला बैशाख — बंगाली नव वर्ष',
    sa: 'प्रथमबैशाखः — बङ्गालनववर्षम्',
    ta: 'பொய்லா பைசாக் — வங்காள புத்தாண்டு',
    te: 'పోయిలా బోయిషాఖ్ — బెంగాలీ నూతన సంవత్సరం',
    bn: 'পয়লা বৈশাখ — বাংলা নববর্ষ',
    kn: 'ಪೊಯ್ಲಾ ಬೊಯ್ಷಾಖ್ — ಬಂಗಾಲಿ ಹೊಸ ವರ್ಷ',
    mr: 'पोइला बोइशाख — बंगाली नवीन वर्ष', gu: 'પોઈલા બોઈશાખ — બંગાળી નવું વર્ષ', mai: 'पोइला बोइशाख — बंगाली नव वर्ष',
  },
  poilaText: {
    en: 'Poila Boishakh (1st Boishakh, April 14-15) is the Bengali New Year and one of the most joyous celebrations in Bengali culture. In West Bengal, the day begins with "Mangal Shobhajatra" (processions) and "Prabhat Pheri" (morning rounds with devotional songs). Shopkeepers perform "Halkhata" — the ceremonial opening of new account books, inviting customers for sweets and refreshments to begin the business year on an auspicious note. Homes are cleaned and decorated with alpona (floor art), and families wear new clothes. The traditional meal includes "Ilish Maach" (Hilsa fish) and "Panta Bhat" (fermented rice). In Shantiniketan, Rabindranath Tagore\'s university, Poila Boishakh is celebrated with special cultural programs. In Bangladesh, the celebration is even grander — Dhaka University\'s Charukala (Fine Arts) faculty organizes the famous "Mangal Shobhajatra" procession featuring colorful floats and masks, recognized by UNESCO as an Intangible Cultural Heritage of Humanity since 2016.',
    hi: 'पहला बैशाख (14-15 अप्रैल) बंगाली नव वर्ष है। पश्चिम बंगाल में दिन "मंगल शोभायात्रा" और "प्रभात फेरी" से आरम्भ होता है। दुकानदार "हालखाता" — नई बही-खातों का उद्घाटन — करते हैं। घरों को अल्पना (भूमि कला) से सजाया जाता है। पारम्परिक भोजन में "इलिश माछ" (हिल्सा मछली) और "पान्ता भात" शामिल है। शान्तिनिकेतन में विशेष सांस्कृतिक कार्यक्रम होते हैं। बांग्लादेश में ढाका विश्वविद्यालय का "मंगल शोभायात्रा" जुलूस UNESCO अमूर्त सांस्कृतिक विरासत (2016) है।',
    sa: 'प्रथमबैशाखः (एप्रिल-मासस्य १४-१५ दिनाङ्के) बङ्गालनववर्षम् अस्ति। "मङ्गलशोभायात्रा" "प्रभातफेरी" च दिनम् आरभ्यते।',
    ta: 'பொய்லா பைசாக் (ஏப்ரல் 14-15) வங்காள புத்தாண்டு ஆகும். மேற்கு வங்காளத்தில் "மங்கல் ஷோபாயாத்ரா" மற்றும் "பிரபாத் பேரி" உடன் நாள் தொடங்குகிறது. கடைக்காரர்கள் "ஹால்கதா" — புதிய கணக்கு புத்தகங்களின் சடங்கு தொடக்கம் — நடத்துகிறார்கள். வீடுகள் அல்போனா (தரைக் கலை) மூலம் அலங்கரிக்கப்படுகின்றன. பாரம்பரிய உணவில் "இலிஷ் மாச்" (ஹில்சா மீன்) மற்றும் "பாந்தா பாத்" அடங்கும். சாந்திநிகேதனில் சிறப்பு கலாசார நிகழ்ச்சிகள் நடைபெறுகின்றன. வங்கதேசத்தில் டாக்கா பல்கலைக்கழகத்தின் "மங்கல் ஷோபாயாத்ரா" ஊர்வலம் UNESCO அருவ கலாசார பாரம்பரியமாகும் (2016).',
  },
  relatedTitle: {
    en: 'Related Puja Guides & Festivals',
    hi: 'सम्बन्धित पूजा विधि और त्योहार',
    sa: 'सम्बद्धपूजाविधयः पर्वाणि च',
    ta: 'தொடர்புடைய பூஜை வழிகாட்டிகள் & திருவிழாக்கள்',
    te: 'సంబంధిత పూజా మార్గదర్శులు & పండుగలు',
    bn: 'সম্পর্কিত পূজা গাইড ও উৎসব',
    kn: 'ಸಂಬಂಧಿತ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿಗಳು & ಹಬ್ಬಗಳು',
    mr: 'संबंधित पूजा मार्गदर्शक आणि सण', gu: 'સંબંધિત પૂજા માર્ગદર્શિકાઓ અને તહેવારો', mai: 'संबंधित पूजा मार्गदर्शिका आ पर्व',
  },
};

const BENGALI_MONTHS = [
  { name: 'Boishakh', bangla: 'বৈশাখ', gregorian: 'Apr 14 – May 14', days: '31', nameHi: 'बैशाख' },
  { name: 'Joishto', bangla: 'জ্যৈষ্ঠ', gregorian: 'May 15 – Jun 14', days: '31', nameHi: 'ज्येष्ठ' },
  { name: 'Asharh', bangla: 'আষাঢ়', gregorian: 'Jun 15 – Jul 15', days: '31', nameHi: 'आषाढ़' },
  { name: 'Shrabon', bangla: 'শ্রাবণ', gregorian: 'Jul 16 – Aug 15', days: '31', nameHi: 'श्रावण' },
  { name: 'Bhadro', bangla: 'ভাদ্র', gregorian: 'Aug 16 – Sep 15', days: '31', nameHi: 'भाद्र' },
  { name: 'Ashwin', bangla: 'আশ্বিন', gregorian: 'Sep 16 – Oct 15', days: '30', nameHi: 'आश्विन' },
  { name: 'Kartik', bangla: 'কার্তিক', gregorian: 'Oct 16 – Nov 14', days: '30', nameHi: 'कार्तिक' },
  { name: 'Ogrohayon', bangla: 'অগ্রহায়ণ', gregorian: 'Nov 15 – Dec 14', days: '30', nameHi: 'अग्रहायण' },
  { name: 'Poush', bangla: 'পৌষ', gregorian: 'Dec 15 – Jan 13', days: '30', nameHi: 'पौष' },
  { name: 'Magh', bangla: 'মাঘ', gregorian: 'Jan 14 – Feb 12', days: '30', nameHi: 'माघ' },
  { name: 'Falgun', bangla: 'ফাল্গুন', gregorian: 'Feb 13 – Mar 14', days: '30', nameHi: 'फाल्गुन' },
  { name: 'Choitro', bangla: 'চৈত্র', gregorian: 'Mar 15 – Apr 13', days: '30', nameHi: 'चैत्र' },
];

const FESTIVALS = [
  { month: 'Boishakh', en: 'Poila Boishakh (Bengali New Year — Halkhata, Mangal Shobhajatra, cultural programs), Rabindra Jayanti (Tagore\'s birth anniversary, celebrated on 25 Boishakh)', hi: 'पहला बैशाख (बंगाली नव वर्ष — हालखाता, मंगल शोभायात्रा), रवीन्द्र जयन्ती (25 बैशाख)' },
  { month: 'Joishto', en: 'Jamai Shashti (son-in-law\'s day — mothers-in-law honor their daughters\' husbands with feasts), Phalaharini Kali Puja', hi: 'जामाई षष्ठी (दामाद दिवस), फलहारिणी काली पूजा' },
  { month: 'Asharh', en: 'Rath Yatra (Jagannath\'s chariot procession — massive celebrations in Kolkata, Mahesh, and Serampore), Ulto Rath (return journey)', hi: 'रथ यात्रा (जगन्नाथ रथ — कोलकाता, महेश, श्रीरामपुर में भव्य), उल्टो रथ' },
  { month: 'Shrabon', en: 'Jhulana Yatra (swing festival of Radha-Krishna), Nag Panchami, Raksha Bandhan, Manasa Puja (snake goddess)', hi: 'झूलन यात्रा, नाग पंचमी, रक्षा बंधन, मनसा पूजा (सर्प देवी)' },
  { month: 'Bhadro', en: 'Janmashtami (Krishna\'s birthday), Vishwakarma Puja (artisans\' day — factories and workshops worship tools), Ganesh Chaturthi', hi: 'जन्माष्टमी, विश्वकर्मा पूजा (कारखानों में उपकरण पूजा), गणेश चतुर्थी' },
  { month: 'Ashwin', en: 'Mahalaya (dawn recitation of Mahishasura Mardini — all Bengal listens), Durga Puja (Shashti to Dashami — Bengal\'s greatest festival, 10 days of Goddess worship, pandal-hopping, Sindoor Khela, and Bisarjan), Lakshmi Puja (Sharad Purnima)', hi: 'महालया (महिषासुर मर्दिनी पाठ), दुर्गा पूजा (षष्ठी से दशमी — बंगाल का सबसे बड़ा उत्सव), लक्ष्मी पूजा (शरद पूर्णिमा)' },
  { month: 'Kartik', en: 'Kali Puja / Diwali (Amavasya of Kartik — Bengal\'s unique Kali worship alongside the pan-Indian Diwali), Bhai Phonta (sisters bless brothers — Bengali equivalent of Bhai Dooj), Jagaddhatri Puja (especially in Chandernagore)', hi: 'काली पूजा / दीवाली, भाई फोंटा (बहन भाई को टीका), जगद्धात्री पूजा (चन्दननगर)' },
  { month: 'Ogrohayon', en: 'Nabanna (new rice festival — celebrating the harvest with freshly harvested rice dishes), Jagaddhatri Puja immersion', hi: 'नबान्न (नई धान का उत्सव), जगद्धात्री पूजा विसर्जन' },
  { month: 'Poush', en: 'Poush Sankranti / Makar Sankranti (winter harvest — Poush Mela at Shantiniketan, pithe-puli sweets), Poush Parbon (traditional Bengali sweets festival)', hi: 'पौष संक्रान्ति / मकर संक्रान्ति (पौष मेला, पीठे-पुली मिठाइयां)' },
  { month: 'Magh', en: 'Saraswati Puja (Vasant Panchami — students worship Goddess of learning, dress in yellow, place books at her feet), Maghi Purnima', hi: 'सरस्वती पूजा (वसन्त पंचमी — छात्र विद्या की देवी की पूजा, पीले वस्त्र), माघी पूर्णिमा' },
  { month: 'Falgun', en: 'Dol Yatra / Holi (festival of colors — Dol Purnima when Radha-Krishna idols are placed on swings), Maha Shivaratri', hi: 'दोल यात्रा / होली (राधा-कृष्ण झूला), महा शिवरात्रि' },
  { month: 'Choitro', en: 'Chaitra Sankranti (last day of Bengali year — Charak Puja with hook-swinging rituals), Basanti Puja (spring Durga Puja — the original timing of Durga worship before Rama\'s "Akal Bodhan")', hi: 'चैत्र संक्रान्ति (बंगाली वर्ष का अन्तिम दिन — चड़क पूजा), बासन्ती पूजा (वसन्त दुर्गा पूजा)' },
];

const RELATED_LINKS = [
  { slug: 'navaratri', en: 'Navaratri / Durga Puja Guide', hi: 'नवरात्रि / दुर्गा पूजा विधि' },
  { slug: 'diwali', en: 'Diwali / Kali Puja Guide', hi: 'दीवाली / काली पूजा विधि' },
  { slug: 'vasant-panchami', en: 'Saraswati Puja (Vasant Panchami)', hi: 'सरस्वती पूजा (वसन्त पंचमी)' },
  { slug: 'holi', en: 'Holi / Dol Yatra Puja', hi: 'होली / दोल यात्रा पूजा' },
  { slug: 'janmashtami', en: 'Janmashtami Puja', hi: 'जन्माष्टमी पूजा' },
  { slug: 'makar-sankranti', en: 'Makar Sankranti / Poush Parbon', hi: 'मकर संक्रान्ति / पौष पर्व' },
];

export default function BengaliCalendarPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => tl(LABELS[key] as LocaleText, locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-4" style={hf}>
            {L('title')}
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {L('intro')}
          </p>
        </div>

        {/* Month Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('monthsTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {L('monthsIntro')}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'বাংলা' : 'Bangla'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isHi ? 'दिन' : 'Days'}</th>
                </tr>
              </thead>
              <tbody>
                {BENGALI_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.bangla}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-center">{m.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Festivals by Month */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L('festivalsTitle')}
          </h2>
          <div className="space-y-3">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1.5">{f.month}</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Poila Boishakh */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('poilaTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('poilaText')}
          </p>
        </section>

        {/* Durga Puja */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('durgaPujaTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('durgaPujaText')}
          </p>
        </section>

        {/* How Panjika Differs */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('panjikaTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('panjikaText')}
          </p>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {L('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <a
                key={link.slug}
                href={`/${locale}/puja/${link.slug}`}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isHi ? link.hi : link.en}
              </a>
            ))}
            <a
              href={`/${locale}/calendar`}
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {isHi ? 'त्योहार कैलेंडर 2026' : 'Festival Calendar 2026'}
            </a>
            <a
              href={`/${locale}/calendar/regional/tamil`}
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {isHi ? 'तमिल कैलेंडर (पंचांगम्)' : 'Tamil Calendar (Panchangam)'}
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

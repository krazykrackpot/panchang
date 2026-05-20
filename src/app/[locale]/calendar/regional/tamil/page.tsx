import { tl } from '@/lib/utils/trilingual';
import { setRequestLocale } from 'next-intl/server';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';

const LABELS = {
  title: {
    en: 'Tamil Calendar (Panchangam)',
    hi: 'तमिल कैलेंडर (पंचांगम्)',
    sa: 'तमिलपञ्चाङ्गम्',
    ta: 'தமிழ் நாட்காட்டி (பஞ்சாங்கம்)',
    te: 'తమిళ క్యాలెండర్ (పంచాంగం)',
    bn: 'তামিল ক্যালেন্ডার (পঞ্চাঙ্গম্)',
    kn: 'ತಮಿಳು ಕ್ಯಾಲೆಂಡರ್ (ಪಂಚಾಂಗಂ)',
    mr: 'तमिळ दिनदर्शिका (पंचांगम्)', gu: 'તમિળ કેલેન્ડર (પંચાંગમ)', mai: 'तमिल कैलेंडर (पंचांगम)',
  },
  intro: {
    en: 'The Tamil calendar, known as the Tamil Panchangam, is one of the oldest continuously used calendar systems in the world. Unlike the North Indian lunisolar calendar, the Tamil calendar is primarily solar-based  –  months are determined by the Sun\'s transit through the twelve Rashis (zodiac signs). This solar foundation gives the Tamil calendar a fixed relationship with the Gregorian calendar, making Tamil month dates remarkably consistent from year to year. The Tamil Panchangam is used by over 80 million Tamil-speaking people across Tamil Nadu, Sri Lanka, Malaysia, Singapore, and the global Tamil diaspora.',
    hi: 'तमिल कैलेंडर, जिसे तमिल पंचांगम् कहा जाता है, विश्व की सबसे प्राचीन निरन्तर प्रयोग में आने वाली कैलेंडर प्रणालियों में से एक है। उत्तर भारतीय चान्द्र-सौर कैलेंडर के विपरीत, तमिल कैलेंडर मुख्य रूप से सौर आधारित है  –  मास सूर्य के बारह राशियों में गोचर से निर्धारित होते हैं। यह सौर आधार तमिल कैलेंडर को ग्रेगोरियन कैलेंडर के साथ स्थिर सम्बन्ध प्रदान करता है।',
    sa: 'तमिलपञ्चाङ्गं विश्वस्य प्राचीनतमासु निरन्तरप्रयुक्तासु पञ्चाङ्गपद्धतिषु अन्यतमम्। उत्तरभारतीयचान्द्रसौरपञ्चाङ्गात् भिन्नं तमिलपञ्चाङ्गं मुख्यतः सौराधारितम्  –  मासाः सूर्यस्य द्वादशराशिषु गोचरेण निर्धार्यन्ते।',
    ta: 'தமிழ் பஞ்சாங்கம் என்று அழைக்கப்படும் தமிழ் நாட்காட்டி, உலகில் தொடர்ந்து பயன்படுத்தப்படும் மிகப் பழமையான நாட்காட்டி முறைகளில் ஒன்றாகும். வட இந்திய சந்திர-சூரிய நாட்காட்டியைப் போலன்றி, தமிழ் நாட்காட்டி முதன்மையாக சூரிய அடிப்படையிலானது  –  மாதங்கள் சூரியன் பன்னிரண்டு ராசிகளில் கடக்கும் போக்கால் நிர்ணயிக்கப்படுகின்றன. இந்த சூரிய அடிப்படை தமிழ் நாட்காட்டிக்கு கிரிகோரியன் நாட்காட்டியுடன் நிலையான உறவை அளிக்கிறது. தமிழ் பஞ்சாங்கம் தமிழ்நாடு, இலங்கை, மலேசியா, சிங்கப்பூர் மற்றும் உலகளாவிய தமிழ் புலம்பெயர்ந்தோர் உட்பட 80 மில்லியனுக்கும் மேற்பட்ட தமிழ் பேசும் மக்களால் பயன்படுத்தப்படுகிறது.',
  },
  monthsTitle: {
    en: 'The 12 Tamil Months',
    hi: '12 तमिल मास',
    sa: '१२ तमिलमासाः',
    ta: '12 தமிழ் மாதங்கள்',
    te: '12 తమిళ నెలలు',
    bn: '১২টি তামিল মাস',
    kn: '12 ತಮಿಳು ತಿಂಗಳುಗಳು',
    mr: '12 तमिळ महिने', gu: '12 તમિળ મહિના', mai: '12 तमिल मास',
  },
  monthsIntro: {
    en: 'Each Tamil month begins when the Sun enters a new Rashi. Because the Sun\'s speed varies slightly through the year (faster near perihelion in January, slower near aphelion in July), Tamil months range from 29 to 32 days. The following table shows each month, its zodiac basis, approximate Gregorian dates, and number of days.',
    hi: 'प्रत्येक तमिल मास सूर्य के नई राशि में प्रवेश से आरम्भ होता है। चूंकि वर्ष भर सूर्य की गति थोड़ी भिन्न होती है, तमिल मास 29 से 32 दिन के होते हैं।',
    sa: 'प्रत्येकं तमिलमासः सूर्यस्य नवराशिप्रवेशेन आरभ्यते।',
    ta: 'ஒவ்வொரு தமிழ் மாதமும் சூரியன் புதிய ராசியில் நுழையும் போது தொடங்குகிறது. ஆண்டு முழுவதும் சூரியனின் வேகம் சிறிது மாறுபடுவதால், தமிழ் மாதங்கள் 29 முதல் 32 நாட்கள் வரை இருக்கும். பின்வரும் அட்டவணையில் ஒவ்வொரு மாதமும், அதன் ராசி அடிப்படை, தோராயமான கிரிகோரியன் தேதிகள் மற்றும் நாட்களின் எண்ணிக்கை காட்டப்பட்டுள்ளன.',
  },
  festivalsTitle: {
    en: 'Major Tamil Festivals by Month',
    hi: 'मास अनुसार प्रमुख तमिल त्योहार',
    sa: 'मासानुसारं प्रमुखतमिलपर्वाणि',
    ta: 'மாதவாரியாக முக்கிய தமிழ் திருவிழாக்கள்',
    te: 'నెల వారీ ప్రధాన తమిళ పండుగలు',
    bn: 'মাস অনুসারে প্রধান তামিল উৎসব',
    kn: 'ತಿಂಗಳ ಪ್ರಕಾರ ಪ್ರಮುಖ ತಮಿಳು ಹಬ್ಬಗಳು',
    mr: 'महिन्यानुसार प्रमुख तमिळ सण', gu: 'મહિના પ્રમાણે મુખ્ય તમિળ તહેવારો', mai: 'मास अनुसार प्रमुख तमिल पर्व',
  },
  puthandu: {
    en: 'Puthandu  –  Tamil New Year',
    hi: 'पुथाण्डु  –  तमिल नव वर्ष',
    sa: 'पुथाण्डु  –  तमिलनववर्षम्',
    ta: 'புத்தாண்டு  –  தமிழ் புத்தாண்டு',
  },
  puthanduText: {
    en: 'Puthandu, the Tamil New Year, falls on Chithirai 1st (typically April 14th). It marks the Sun\'s entry into Mesha Rashi (Aries). On this day, families prepare the "Kanni"  –  an auspicious arrangement of fruits, flowers, gold jewelry, coins, new clothes, raw rice, and a mirror. The first sight upon waking should be the Kanni, symbolizing an auspicious start to the year. A special dish called "Maanga Pachadi" is prepared, combining six flavors (sweet, sour, salty, bitter, pungent, and astringent) representing the six experiences of life. Temples hold special abhishekam ceremonies and recite the new year\'s Panchangam predictions.',
    hi: 'पुथाण्डु, तमिल नव वर्ष, चित्तिरै 1 (आमतौर पर 14 अप्रैल) को मनाया जाता है। यह सूर्य के मेष राशि में प्रवेश का प्रतीक है। इस दिन परिवार "कन्नि" सजाते हैं  –  फल, फूल, स्वर्ण आभूषण, सिक्के, नए वस्त्र, कच्चे चावल और दर्पण। "मांगा पचड़ी" नामक विशेष व्यंजन बनाया जाता है जिसमें छह स्वाद होते हैं  –  जीवन के छह अनुभवों का प्रतीक।',
    sa: 'पुथाण्डु तमिलनववर्षं चित्तिरै प्रथमदिने (सामान्यतः एप्रिल-मासस्य १४ दिनाङ्के) आचर्यते। एतत् सूर्यस्य मेषराशिप्रवेशं सूचयति।',
    ta: 'தமிழ் புத்தாண்டு சித்திரை 1ஆம் தேதி (பொதுவாக ஏப்ரல் 14) அன்று வருகிறது. இது சூரியன் மேஷ ராசியில் நுழைவதைக் குறிக்கிறது. இந்த நாளில் குடும்பங்கள் "கன்னி"  –  பழங்கள், பூக்கள், தங்க நகைகள், நாணயங்கள், புதிய ஆடைகள், பச்சரிசி மற்றும் கண்ணாடி ஆகியவற்றின் சுப அமைப்பை தயார் செய்கின்றனர். விழித்தெழும்போது முதலில் கன்னியைப் பார்ப்பது ஆண்டின் சுப தொடக்கத்தைக் குறிக்கிறது. "மாங்கா பச்சடி" என்ற சிறப்பு உணவு  –  இனிப்பு, புளிப்பு, உப்பு, கசப்பு, காரம், துவர்ப்பு ஆகிய ஆறு சுவைகள்  –  வாழ்வின் ஆறு அனுபவங்களைக் குறிக்கும். கோயில்களில் சிறப்பு அபிஷேகங்கள் நடைபெறும்.',
  },
  solarVsLunar: {
    en: 'Solar vs Lunisolar  –  How Tamil Panchangam Differs',
    hi: 'सौर बनाम चान्द्र-सौर  –  तमिल पंचांगम् कैसे भिन्न है',
    sa: 'सौरं चान्द्रसौरं च  –  तमिलपञ्चाङ्गं कथं भिन्नम्',
    ta: 'சூரியம் vs சந்திர-சூரியம்  –  தமிழ் பஞ்சாங்கம் எவ்வாறு வேறுபடுகிறது',
  },
  solarVsLunarText: {
    en: 'The most fundamental difference between the Tamil and North Indian calendars lies in how months are defined. In the North Indian system (used across UP, Bihar, Rajasthan, MP), months are lunisolar  –  they run from one New Moon (Amavasya) to the next in the Amanta system, or one Full Moon (Purnima) to the next in the Purnimant system. This means month boundaries shift by about 11 days each year relative to the solar calendar, requiring an intercalary month (Adhika Masa) every ~33 months to resynchronize. The Tamil system avoids this entirely by anchoring months to the Sun\'s zodiacal transit. When the Sun enters Mesha (Aries), Chithirai begins. When it enters Rishabha (Taurus), Vaikasi begins. This means Tamil dates fall on approximately the same Gregorian dates every year  –  Chithirai 1 is always April 14th (occasionally 13th or 15th due to axial precession). The Tamil calendar does incorporate lunar elements for determining Tithi, Nakshatra, and festival dates within each solar month, making it a hybrid system  –  solar for months, lunar for religious observances.',
    hi: 'तमिल और उत्तर भारतीय कैलेंडर के बीच सबसे मूलभूत अन्तर यह है कि मास कैसे परिभाषित होते हैं। उत्तर भारतीय प्रणाली में मास चान्द्र-सौर हैं  –  अमान्त प्रणाली में एक अमावस्या से अगली तक, पूर्णिमान्त में एक पूर्णिमा से अगली तक। इसका अर्थ है कि मास सीमाएं हर वर्ष सौर कैलेंडर के सापेक्ष ~11 दिन खिसकती हैं, जिसके लिए हर ~33 मास में अधिक मास की आवश्यकता होती है। तमिल प्रणाली मासों को सूर्य के राशि गोचर से जोड़कर इससे पूरी तरह बचती है। तमिल कैलेंडर तिथि, नक्षत्र और त्योहारों के लिए चन्द्र तत्वों को भी शामिल करता है।',
    sa: 'तमिलोत्तरभारतीयपञ्चाङ्गयोः मध्ये मूलभूतः भेदः मासपरिभाषायाम् अस्ति। उत्तरभारतीयपद्धत्यां मासाः चान्द्रसौराः। तमिलपद्धतिः मासान् सूर्यस्य राशिगोचरेण निबध्नाति।',
    ta: 'தமிழ் மற்றும் வட இந்திய நாட்காட்டிகளுக்கிடையேயான மிக அடிப்படையான வேறுபாடு மாதங்கள் எவ்வாறு வரையறுக்கப்படுகின்றன என்பதில் உள்ளது. வட இந்திய முறையில் மாதங்கள் சந்திர-சூரியம்  –  அமாந்த முறையில் ஒரு அமாவாசையிலிருந்து அடுத்ததுவரை, பூர்ணிமாந்த முறையில் ஒரு பௌர்ணமியிலிருந்து அடுத்ததுவரை. இதனால் மாத எல்லைகள் ஒவ்வொரு ஆண்டும் ~11 நாட்கள் மாறும், ~33 மாதங்களுக்கு ஒருமுறை அதிக மாதம் தேவை. தமிழ் முறை மாதங்களை சூரியனின் ராசி கடப்புடன் இணைத்து இதை முழுமையாகத் தவிர்க்கிறது. சூரியன் மேஷத்தில் நுழையும்போது சித்திரை தொடங்கும். ரிஷபத்தில் நுழையும்போது வைகாசி தொடங்கும். தமிழ் நாட்காட்டி திதி, நட்சத்திரம் மற்றும் திருவிழா தேதிகளுக்கு சந்திர அங்கங்களையும் உள்ளடக்கியது  –  மாதங்களுக்கு சூரியம், சமய வழிபாட்டிற்கு சந்திரம்.',
  },
  aadiTitle: {
    en: 'The Significance of Aadi Month',
    hi: 'आडि मास का महत्व',
    sa: 'आडिमासस्य महत्त्वम्',
    ta: 'ஆடி மாதத்தின் சிறப்பு',
  },
  aadiText: {
    en: 'Aadi (mid-July to mid-August) holds a paradoxical position in Tamil culture  –  it is simultaneously considered inauspicious for worldly activities yet deeply sacred for spiritual practices. No weddings, griha pravesh (housewarming), or major business ventures are initiated during Aadi. The traditional saying "Aadi-la kalyanam, aadhi-la kadesi" (a wedding in Aadi leads to ruin) reflects this deeply held belief. The reasons are both practical and spiritual: Aadi falls during the peak monsoon when floods, illness, and agricultural uncertainty are highest. Spiritually, it is considered a month when the veil between worlds is thin. However, Aadi is also when "Aadi Perukku" (the 18th of Aadi) is celebrated with great enthusiasm along river banks, honoring the swelling of rivers and the fertility of the land. Women perform special pujas near water bodies, offering fruits, flowers, and cooked food. Aadi Fridays are especially sacred  –  women worship Goddess Amman (Mariamman, Draupadi Amman) with special offerings. "Aadi Pattam" (the Aadi planting season) is when rice cultivation begins in earnest.',
    hi: 'आडि (मध्य जुलाई से मध्य अगस्त) तमिल संस्कृति में एक विरोधाभासी स्थान रखता है  –  यह सांसारिक गतिविधियों के लिए अशुभ माना जाता है फिर भी आध्यात्मिक साधनाओं के लिए अत्यन्त पवित्र है। आडि में कोई विवाह, गृह प्रवेश या बड़ा व्यापारिक उपक्रम आरम्भ नहीं किया जाता। "आडि पेरुक्कु" (आडि का 18वां दिन) नदी किनारों पर उत्साह से मनाया जाता है। आडि के शुक्रवार विशेष रूप से पवित्र हैं  –  महिलाएं देवी अम्मन की पूजा करती हैं।',
    sa: 'आडिमासः (मध्यश्रावणात् मध्यभाद्रपदपर्यन्तम्) तमिलसंस्कृतौ विरोधाभासस्थानम् आवहति  –  लौकिककार्येभ्यः अशुभः तथापि आध्यात्मिकसाधनाभ्यः अत्यन्तपवित्रः।',
    ta: 'ஆடி (ஜூலை நடுப்பகுதி முதல் ஆகஸ்ட் நடுப்பகுதி வரை) தமிழ் கலாசாரத்தில் முரண்பாடான இடத்தை வகிக்கிறது  –  உலகியல் செயல்களுக்கு அசுபமாகவும், ஆன்மீக பயிற்சிகளுக்கு மிகப் புனிதமாகவும் கருதப்படுகிறது. ஆடியில் திருமணம், கிருஹ பிரவேசம் அல்லது பெரிய வணிக முயற்சிகள் தொடங்கப்படுவதில்லை. "ஆடியில கல்யாணம், ஆதிலே கடைசி" என்ற பழமொழி இந்த ஆழமான நம்பிக்கையை பிரதிபலிக்கிறது. ஆடி பெருக்கு (ஆடி 18) ஆற்றங்கரைகளில் உற்சாகமாக கொண்டாடப்படுகிறது. ஆடி வெள்ளிக்கிழமைகள் சிறப்பாக புனிதமானவை  –  பெண்கள் அம்மன் (மாரியம்மன், திரௌபதி அம்மன்) வழிபாடு செய்கின்றனர்.',
  },
  margazhiTitle: {
    en: 'Margazhi  –  The Month of Spiritual Awakening',
    hi: 'मार्गळि  –  आध्यात्मिक जागरण का मास',
    sa: 'मार्गळि  –  आध्यात्मिकजागरणस्य मासः',
    ta: 'மார்கழி  –  ஆன்மீக விழிப்புணர்வின் மாதம்',
  },
  margazhiText: {
    en: 'Margazhi (mid-December to mid-January) is considered the most spiritually charged month in the Tamil calendar. Krishna declares in the Bhagavad Gita (10.35): "Among months, I am Margashirsha"  –  the Sanskrit equivalent of Margazhi. This month is when the divine is believed to be most accessible to devotees. The tradition of "Thiruppavai" and "Thiruvempavai" is central to Margazhi  –  women wake before dawn (typically around 4-5 AM) to sing the 30 verses of Andal\'s Thiruppavai at Vishnu temples, or Manikkavasagar\'s Thiruvempavai at Shiva temples. This pre-dawn devotional practice, called "Bhajan" or "Pagal Pattu," continues for all 30 days of Margazhi. The streets of Tamil Nadu come alive with kolam (rangoli) drawn in rice flour before sunrise, and the sound of Nadaswaram and Thavil from temples. Classical music and dance reach their zenith during the Margazhi Season (Chennai Music Season / December Season), the world\'s largest cultural festival featuring over 3,000 performances across 300+ venues over 6 weeks. Temples perform special Vaikunta Ekadashi celebrations during Margazhi, when the "Paramapada Vasal" (gateway to heaven) is opened at Vishnu temples.',
    hi: 'मार्गळि (मध्य दिसम्बर से मध्य जनवरी) तमिल कैलेंडर का सबसे आध्यात्मिक मास माना जाता है। कृष्ण भगवद्गीता (10.35) में कहते हैं: "मासों में मैं मार्गशीर्ष हूँ"। "तिरुप्पावै" और "तिरुवेम्पावै" की परम्परा मार्गळि की केन्द्रीय है  –  महिलाएं भोर से पहले जागकर आण्डाल के तिरुप्पावै के 30 पदों का गान करती हैं। चेन्नई संगीत सीज़न इसी मास में होता है  –  3,000 से अधिक प्रस्तुतियों के साथ विश्व का सबसे बड़ा सांस्कृतिक उत्सव। मन्दिरों में वैकुण्ठ एकादशी का विशेष उत्सव होता है।',
    sa: 'मार्गळिमासः (मध्यमार्गशीर्षात् मध्यपौषपर्यन्तम्) तमिलपञ्चाङ्गस्य आध्यात्मिकतमः मासः मन्यते। कृष्णः भगवद्गीतायां (१०.३५) वदति "मासानां मार्गशीर्षोऽहम्"।',
    ta: 'மார்கழி (டிசம்பர் நடுப்பகுதி முதல் ஜனவரி நடுப்பகுதி வரை) தமிழ் நாட்காட்டியில் ஆன்மீக ரீதியாக மிகவும் சக்திவாய்ந்த மாதமாக கருதப்படுகிறது. கிருஷ்ணர் பகவத் கீதையில் (10.35) "மாதங்களில் நான் மார்கழி" என்கிறார். "திருப்பாவை" மற்றும் "திருவெம்பாவை" மரபு மார்கழியின் மையமானது  –  பெண்கள் அதிகாலையில் எழுந்து ஆண்டாளின் திருப்பாவை 30 பாசுரங்களை விஷ்ணு கோயில்களிலும், மாணிக்கவாசகரின் திருவெம்பாவையை சிவன் கோயில்களிலும் பாடுகின்றனர். தமிழ்நாட்டின் தெருக்கள் சூரிய உதயத்திற்கு முன் அரிசி மாவால் வரையப்பட்ட கோலங்களால் உயிர்பெறுகின்றன. செம்பை இசை விழா (டிசம்பர் சீசன்) 300+ இடங்களில் 3,000க்கும் மேற்பட்ட நிகழ்ச்சிகளுடன் உலகின் மிகப்பெரிய கலை விழா. கோயில்களில் வைகுண்ட ஏகாதசி கொண்டாடப்படுகிறது.',
  },
  pongalTitle: {
    en: 'Thai Pongal  –  The Four-Day Harvest Festival',
    hi: 'तै पोंगल  –  चार दिवसीय फसल उत्सव',
    sa: 'तैपोङ्गल्  –  चतुर्दिनात्मकं सस्योत्सवम्',
    ta: 'தைப்பொங்கல்  –  நான்கு நாள் அறுவடைத் திருவிழா',
  },
  pongalText: {
    en: 'Thai Pongal is the most important harvest festival of Tamil Nadu and arguably the most beloved celebration in Tamil culture. Spanning four days in the Tamil month of Thai (January 14-17), it marks the Sun\'s northward journey (Uttarayana) and the end of the winter solstice period. Each day has a distinct character and set of rituals:\n\nDay 1 — Bhogi Pongal (January 14): The festival opens with Bhogi, dedicated to Lord Indra, the god of rain and clouds. Families discard old belongings and light a bonfire ("Bhogi Mantalu") at dawn, symbolising the destruction of the old and welcoming of the new. Homes are cleaned thoroughly, and cow dung cakes, old clothes, and broken household items are consigned to the flames.\n\nDay 2 — Surya Pongal (January 15): The main day of the festival, dedicated to Surya (the Sun God). The centrepiece ritual is the boiling of freshly harvested rice with milk and jaggery in a new clay pot until it overflows — the moment of overflow is greeted with joyful cries of "Pongal-O-Pongal!" The word "Pongal" literally means "boiling over" in Tamil, signifying abundance. The pot is decorated with turmeric plants and sugarcane, and the cooked Pongal is offered first to Surya, then shared among the family. Women draw elaborate kolam designs with rice flour at the entrance, and the entire household wears new clothes.\n\nDay 3 — Mattu Pongal (January 16): Dedicated to cattle, especially cows and bulls, which are integral to agrarian Tamil life. Cattle are bathed, their horns painted in bright colours, and adorned with garlands of flowers and bells. They are fed the special Pongal dish. In some regions, the famous bull-taming sport "Jallikattu" is held during Mattu Pongal — a centuries-old tradition unique to Tamil Nadu where young men attempt to tame charging bulls. Jallikattu is deeply tied to Tamil cultural identity and has been the subject of massive popular movements to preserve it.\n\nDay 4 — Kaanum Pongal (January 17): The final day is for family outings and socialising. "Kaanum" means "to visit" in Tamil. Families visit relatives, enjoy outdoor picnics, and young women perform a ritual where they pray for the prosperity of their brothers, similar to the North Indian Bhai Dooj. Leftover Pongal dishes are placed on turmeric leaves outside the home for birds and animals.',
    hi: 'तै पोंगल तमिलनाडु का सबसे महत्वपूर्ण फसल उत्सव है और तमिल संस्कृति में सबसे प्रिय उत्सव है। तमिल मास तै (14-17 जनवरी) में चार दिनों तक मनाया जाता है, यह सूर्य की उत्तरायण यात्रा और शीतकालीन संक्रान्ति काल की समाप्ति का प्रतीक है।\n\nदिन 1 — भोगी पोंगल (14 जनवरी): इन्द्र को समर्पित। परिवार पुरानी वस्तुओं को त्यागकर भोर में "भोगी मन्तलु" अग्नि जलाते हैं।\n\nदिन 2 — सूर्य पोंगल (15 जनवरी): मुख्य दिन, सूर्य देव को समर्पित। नई मिट्टी के बर्तन में चावल, दूध और गुड़ उबालकर "पोंगल-ओ-पोंगल!" के जयघोष के साथ मनाया जाता है।\n\nदिन 3 — मट्टु पोंगल (16 जनवरी): पशुओं को समर्पित। गायों और बैलों को स्नान कराया जाता है, सींगों को चमकीले रंगों से रंगा जाता है। कुछ क्षेत्रों में प्रसिद्ध "जल्लीकट्टु" बैल-वश खेल होता है।\n\nदिन 4 — कानुम पोंगल (17 जनवरी): परिवारिक सैर और मिलन का दिन। "कानुम" का अर्थ है "भेंट करना"। परिवार रिश्तेदारों से मिलते हैं।',
    sa: 'तैपोङ्गलः तमिलनाडुप्रदेशस्य महत्तमः सस्योत्सवः। तैमासे (जनवरी १४-१७) चतुर्दिनं यावत् आचर्यते। सूर्यस्य उत्तरायणं शीतसंक्रान्तिकालस्य समाप्तिं च सूचयति।',
    ta: 'தைப்பொங்கல் தமிழ்நாட்டின் மிக முக்கியமான அறுவடைத் திருவிழாவும், தமிழ் கலாசாரத்தின் மிகவும் அன்புக்குரிய கொண்டாட்டமும் ஆகும். தமிழ் மாதமான தையில் (ஜனவரி 14-17) நான்கு நாட்கள் நடைபெறுகிறது. இது சூரியனின் வடக்கு நோக்கிய பயணத்தையும் (உத்தராயணம்) குளிர்கால சங்கிராந்தி காலத்தின் முடிவையும் குறிக்கிறது.\n\nநாள் 1 — போகிப் பொங்கல் (ஜனவரி 14): இந்திரனுக்கு அர்ப்பணிக்கப்பட்டது. குடும்பங்கள் பழைய பொருட்களை அகற்றி "போகி மந்தலு" நெருப்பு மூட்டுகின்றனர்.\n\nநாள் 2 — சூரிய பொங்கல் (ஜனவரி 15): முக்கிய நாள், சூரிய பகவானுக்கு அர்ப்பணிக்கப்பட்டது. புதிய மண் பானையில் அரிசி, பால், வெல்லம் கொதிக்கும்போது "பொங்கலோ பொங்கல்!" என மகிழ்ச்சியுடன் கூவுவர்.\n\nநாள் 3 — மாட்டுப் பொங்கல் (ஜனவரி 16): கால்நடைகளுக்கு அர்ப்பணிக்கப்பட்டது. மாடுகளை குளிப்பாட்டி, கொம்புகளை வண்ணமயமாக பூசுவர். சில பகுதிகளில் புகழ்பெற்ற "ஜல்லிக்கட்டு" நடைபெறும்.\n\nநாள் 4 — காணும் பொங்கல் (ஜனவரி 17): குடும்ப வெளியீடுகளுக்கான நாள். "காணும்" என்றால் "பார்வையிடுதல்". குடும்பங்கள் உறவினர்களைச் சந்திக்கின்றனர்.',
  },
  thiruvalluvarTitle: {
    en: 'Thiruvalluvar Era  –  The Tamil Year Numbering System',
    hi: 'तिरुवल्लुवर संवत्  –  तमिल वर्ष गणना प्रणाली',
    sa: 'तिरुवल्लुवरसंवत्सरः  –  तमिलवर्षगणनापद्धतिः',
    ta: 'திருவள்ளுவர் ஆண்டு  –  தமிழ் ஆண்டு எண் முறை',
  },
  thiruvalluvarText: {
    en: 'The Thiruvalluvar Era (Thiruvalluvar Aandu) is the Tamil year numbering system, named after the revered Tamil poet and philosopher Thiruvalluvar, author of the Thirukkural  –  a masterpiece of ethical literature composed of 1,330 couplets covering virtue, wealth, and love. The era is calculated as the Gregorian year plus 31, placing Thiruvalluvar\'s birth 31 years before the Common Era. Thus, the current Tamil year is Thiruvalluvar Aandu 2057 (from Chithirai 1, i.e. 14 April 2026, to Panguni 30, i.e. 13 April 2027). The next year, Thiruvalluvar Aandu 2058, begins on 14 April 2027.\n\nThe Thiruvalluvar Era was formally adopted by the Tamil Nadu government in 1971 and is used in all official Tamil Nadu government calendars and publications. It predates both the Gregorian calendar and the Saka era (78 CE) used by the Indian national calendar. The adoption of this era was a significant cultural statement, connecting Tamil identity to its classical literary heritage rather than to religious or imperial timelines. Sri Lanka, Malaysia, and Singapore also recognise the Thiruvalluvar Era in their Tamil community calendars.\n\nThe Thirukkural itself is often called the "universal scripture" and has been translated into over 80 languages. Thiruvalluvar\'s statue stands as one of the tallest in India at Kanyakumari (133 feet), symbolising the 133 chapters of the Thirukkural.',
    hi: 'तिरुवल्लुवर संवत् (तिरुवल्लुवर आण्डु) तमिल वर्ष गणना प्रणाली है, जिसका नाम प्रतिष्ठित तमिल कवि और दार्शनिक तिरुवल्लुवर के नाम पर रखा गया है, जो तिरुक्कुरल के रचयिता हैं  –  1,330 दोहों की नैतिक साहित्य की उत्कृष्ट कृति। इस संवत् की गणना ग्रेगोरियन वर्ष में 31 जोड़कर की जाती है। अतः वर्तमान तमिल वर्ष तिरुवल्लुवर आण्डु 2057 (14 अप्रैल 2026 से 13 अप्रैल 2027) है। अगला वर्ष 2058, 14 अप्रैल 2027 से आरम्भ होगा।\n\nतिरुवल्लुवर संवत् को 1971 में तमिलनाडु सरकार ने औपचारिक रूप से अपनाया और सभी सरकारी कैलेंडरों में प्रयोग किया जाता है। श्रीलंका, मलेशिया और सिंगापुर भी अपने तमिल समुदाय कैलेंडरों में इसे मान्यता देते हैं।',
    sa: 'तिरुवल्लुवरसंवत्सरः (तिरुवल्लुवर आण्डु) तमिलवर्षगणनापद्धतिः। तमिलकवेः दार्शनिकस्य तिरुवल्लुवरस्य नाम्ना अभिहिता। ग्रेगोरियनवर्षे ३१ योजयित्वा गणना क्रियते।',
    ta: 'திருவள்ளுவர் ஆண்டு (திருவள்ளுவர் ஆண்டு) தமிழ் ஆண்டு எண் முறையாகும், போற்றப்படும் தமிழ்க் கவிஞரும் தத்துவஞானியுமான திருவள்ளுவரின் பெயரால் அழைக்கப்படுகிறது. திருக்குறளின் ஆசிரியர்  –  அறம், பொருள், இன்பம் என்ற 1,330 குறள்களைக் கொண்ட நீதி இலக்கியத்தின் தலைசிறந்த படைப்பு. கிரிகோரியன் ஆண்டுடன் 31 கூட்டி கணக்கிடப்படுகிறது. எனவே தற்போதைய தமிழ் ஆண்டு திருவள்ளுவர் ஆண்டு 2057 (சித்திரை 1, அதாவது ஏப்ரல் 14, 2026 முதல் பங்குனி 30, அதாவது ஏப்ரல் 13, 2027 வரை). அடுத்த ஆண்டு 2058, ஏப்ரல் 14, 2027 அன்று தொடங்கும்.\n\nதிருவள்ளுவர் ஆண்டு 1971 இல் தமிழ்நாடு அரசால் அதிகாரப்பூர்வமாக ஏற்றுக்கொள்ளப்பட்டது, அனைத்து அரசு நாட்காட்டிகளிலும் பயன்படுத்தப்படுகிறது. இலங்கை, மலேசியா, சிங்கப்பூர் ஆகிய நாடுகளும் தமிழ் சமூக நாட்காட்டிகளில் இதை அங்கீகரிக்கின்றன. திருக்குறள் 80க்கும் மேற்பட்ட மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளது. கன்னியாகுமரியில் திருவள்ளுவர் சிலை 133 அடி உயரத்தில் நிற்கிறது  –  திருக்குறளின் 133 அதிகாரங்களைக் குறிக்கிறது.',
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

const TAMIL_MONTHS = [
  { name: 'Chithirai', tamil: 'சித்திரை', rashi: 'Mesha (Aries)', gregorian: 'Apr 14 – May 14', days: '31', nameHi: 'चित्तिरै' },
  { name: 'Vaikasi', tamil: 'வைகாசி', rashi: 'Rishabha (Taurus)', gregorian: 'May 15 – Jun 14', days: '31', nameHi: 'वैकासि' },
  { name: 'Aani', tamil: 'ஆனி', rashi: 'Mithuna (Gemini)', gregorian: 'Jun 15 – Jul 15', days: '31', nameHi: 'आनि' },
  { name: 'Aadi', tamil: 'ஆடி', rashi: 'Kataka (Cancer)', gregorian: 'Jul 16 – Aug 16', days: '32', nameHi: 'आडि' },
  { name: 'Avani', tamil: 'ஆவணி', rashi: 'Simha (Leo)', gregorian: 'Aug 17 – Sep 16', days: '31', nameHi: 'आवणि' },
  { name: 'Purattasi', tamil: 'புரட்டாசி', rashi: 'Kanya (Virgo)', gregorian: 'Sep 17 – Oct 17', days: '31', nameHi: 'पुरट्टासि' },
  { name: 'Aippasi', tamil: 'ஐப்பசி', rashi: 'Tula (Libra)', gregorian: 'Oct 18 – Nov 15', days: '29', nameHi: 'ऐप्पसि' },
  { name: 'Karthigai', tamil: 'கார்த்திகை', rashi: 'Vrischika (Scorpio)', gregorian: 'Nov 16 – Dec 15', days: '30', nameHi: 'कार्तिगै' },
  { name: 'Margazhi', tamil: 'மார்கழி', rashi: 'Dhanus (Sagittarius)', gregorian: 'Dec 16 – Jan 13', days: '29', nameHi: 'मार्गळि' },
  { name: 'Thai', tamil: 'தை', rashi: 'Makara (Capricorn)', gregorian: 'Jan 14 – Feb 12', days: '30', nameHi: 'तै' },
  { name: 'Masi', tamil: 'மாசி', rashi: 'Kumbha (Aquarius)', gregorian: 'Feb 13 – Mar 13', days: '29', nameHi: 'मासि' },
  { name: 'Panguni', tamil: 'பங்குனி', rashi: 'Meena (Pisces)', gregorian: 'Mar 14 – Apr 13', days: '31', nameHi: 'पंगुनि' },
];

const FESTIVALS = [
  { month: 'Chithirai', monthTa: 'சித்திரை', en: 'Puthandu (Tamil New Year, Chithirai 1st), Chithirai Thiruvizha (Meenakshi Thirukalyanam at Madurai  –  10-day temple festival celebrating the divine marriage of Meenakshi and Sundareshwarar)', hi: 'पुथाण्डु (तमिल नव वर्ष), चित्तिरै तिरुविळा (मदुरै मीनाक्षी तिरुकल्याणम्)', ta: 'புத்தாண்டு (தமிழ் புத்தாண்டு, சித்திரை 1), சித்திரை திருவிழா (மதுரையில் மீனாட்சி திருக்கல்யாணம்  –  10 நாள் கோயில் திருவிழா)' },
  { month: 'Vaikasi', monthTa: 'வைகாசி', en: 'Vaikasi Visakam (Lord Murugan\'s birthday  –  celebrated with grand processions at Palani, Thiruchendur, and all Murugan temples), Agni Nakshatram begins (peak summer heat period)', hi: 'वैकासि विशाखम् (भगवान मुरुगन जयन्ती), अग्नि नक्षत्रम् आरम्भ', ta: 'வைகாசி விசாகம் (முருகப்பெருமான் பிறந்த நாள்  –  பழனி, திருச்செந்தூர் உள்ளிட்ட அனைத்து முருகன் கோயில்களில் பெரிய ஊர்வலங்கள்), அக்னி நட்சத்திரம் தொடக்கம்' },
  { month: 'Aani', monthTa: 'ஆனி', en: 'Aani Thirumanjanam (grand abhishekam of Lord Nataraja at Chidambaram  –  one of the most important temple events in Tamil Nadu)', hi: 'आनि तिरुमञ्जनम् (चिदम्बरम् में नटराज अभिषेकम्)', ta: 'ஆனி திருமஞ்சனம் (சிதம்பரத்தில் நடராஜருக்கு பெரிய அபிஷேகம்  –  தமிழ்நாட்டின் மிக முக்கிய கோயில் நிகழ்வுகளில் ஒன்று)' },
  { month: 'Aadi', monthTa: 'ஆடி', en: 'Aadi Perukku (18th of Aadi  –  river festival celebrating monsoon abundance), Aadi Pooram (Andal\'s incarnation day), Aadi Fridays (Amman worship)', hi: 'आडि पेरुक्कु (नदी उत्सव), आडि पूरम् (आण्डाल अवतार दिवस), आडि शुक्रवार (अम्मन पूजा)', ta: 'ஆடிப்பெருக்கு (ஆடி 18  –  ஆற்றுத் திருவிழா), ஆடிப்பூரம் (ஆண்டாள் அவதார நாள்), ஆடி வெள்ளிக்கிழமை (அம்மன் வழிபாடு)' },
  { month: 'Avani', monthTa: 'ஆவணி', en: 'Avani Avittam (sacred thread ceremony renewal for Brahmins  –  Upakarma), Krishna Jayanthi (Gokulashtami), Vinayakar Chaturthi', hi: 'आवणि अवित्तम् (उपकर्म), कृष्ण जयन्ती, विनायकर चतुर्थी', ta: 'ஆவணி அவிட்டம் (உபகர்மா  –  பூணூல் மாற்றும் விழா), கிருஷ்ண ஜெயந்தி (கோகுலாஷ்டமி), விநாயகர் சதுர்த்தி' },
  { month: 'Purattasi', monthTa: 'புரட்டாசி', en: 'Purattasi Saturdays (strict vegetarian observance and Vishnu/Perumal worship for all 4 Saturdays), Navaratri and Vijayadashami (Golu/Kolu display of dolls)', hi: 'पुरट्टासि शनिवार (विष्णु पूजा), नवरात्रि और विजयादशमी (गोलू/कोलू)', ta: 'புரட்டாசி சனிக்கிழமை (கடுமையான சைவ விரதம் மற்றும் பெருமாள் வழிபாடு), நவராத்திரி மற்றும் விஜயதசமி (கொலு வைப்பு)' },
  { month: 'Aippasi', monthTa: 'ஐப்பசி', en: 'Deepavali (Diwali  –  celebrated on Amavasya of Aippasi), Skanda Sashti (6-day fast honoring Lord Murugan\'s victory over Surapadman)', hi: 'दीपावली, स्कन्द षष्ठी (मुरुगन की विजय का 6-दिवसीय उत्सव)', ta: 'தீபாவளி (ஐப்பசி அமாவாசையில் கொண்டாடப்படுகிறது), ஸ்கந்த சஷ்டி (சூரபத்மனை வென்ற முருகனின் 6 நாள் விரதம்)' },
  { month: 'Karthigai', monthTa: 'கார்த்திகை', en: 'Karthigai Deepam (festival of lights  –  massive flame lit atop Tiruvannamalai hill, homes lit with rows of oil lamps), Subramanya Sashti', hi: 'कार्तिगै दीपम् (तिरुवण्णामलै शिखर पर विशाल ज्योति), सुब्रमण्य षष्ठी', ta: 'கார்த்திகை தீபம் (திருவண்ணாமலை குன்றின் மீது பெரிய ஜோதி ஏற்றுதல், வீடுகளில் நெய் விளக்குகள் வரிசையாக ஏற்றுதல்), சுப்ரமண்ய சஷ்டி' },
  { month: 'Margazhi', monthTa: 'மார்கழி', en: 'Thiruppavai/Thiruvempavai (30-day dawn devotional singing), Vaikunta Ekadashi (Paramapada Vasal opening at Vishnu temples), Arudra Darshanam (Nataraja\'s cosmic dance celebration)', hi: 'तिरुप्पावै/तिरुवेम्पावै (30 दिन भोर भजन), वैकुण्ठ एकादशी, आरुद्रा दर्शनम्', ta: 'திருப்பாவை/திருவெம்பாவை (30 நாள் அதிகாலை பக்திப் பாடல்), வைகுண்ட ஏகாதசி (விஷ்ணு கோயில்களில் பரமபத வாசல் திறப்பு), ஆருத்ரா தரிசனம் (நடராஜரின் ஆனந்த தாண்டவம்)' },
  { month: 'Thai', monthTa: 'தை', en: 'Thai Pongal (4-day harvest festival  –  Bhogi, Surya Pongal, Mattu Pongal, Kaanum Pongal), Thai Poosam (Lord Murugan  –  Kavadi offerings at Batu Caves and Palani)', hi: 'तै पोंगल (4-दिवसीय फसल उत्सव), तै पूसम् (मुरुगन  –  कावड़ी)', ta: 'தைப்பொங்கல் (4 நாள் அறுவடைத் திருவிழா  –  போகி, சூரிய பொங்கல், மாட்டுப் பொங்கல், காணும் பொங்கல்), தைப்பூசம் (முருகப்பெருமான்  –  பழனி, பத்து மலையில் காவடி)' },
  { month: 'Masi', monthTa: 'மாசி', en: 'Masi Magam (sacred bathing in the sea when Moon is in Magha nakshatra  –  major event at Mahabalipuram and Pondicherry), Maha Shivaratri', hi: 'मासि मगम् (सागर स्नान), महा शिवरात्रि', ta: 'மாசி மகம் (சந்திரன் மக நட்சத்திரத்தில் இருக்கும்போது புனித கடல் நீராட்டல்  –  மகாபலிபுரம், புதுச்சேரியில் பெரிய நிகழ்வு), மகா சிவராத்திரி' },
  { month: 'Panguni', monthTa: 'பங்குனி', en: 'Panguni Uthiram (divine marriages celebrated at major temples  –  Srirangam, Tirupati, Madurai; associated with Uttara Phalguni nakshatra)', hi: 'पंगुनि उत्तिरम् (मन्दिरों में दिव्य विवाह)', ta: 'பங்குனி உத்திரம் (முக்கிய கோயில்களில் தெய்வீகத் திருமணங்கள்  –  ஸ்ரீரங்கம், திருப்பதி, மதுரை; உத்திர பல்குனி நட்சத்திரத்துடன் தொடர்புடையது)' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 2026–2027 Tamil Festival Dates with Tithi & Nakshatra
// Sources: Prokerala / Shubh Panchang reference for Chennai
// ═══════════════════════════════════════════════════════════════════════════

const FESTIVAL_DATES_2026 = [
  { en: 'Thai Pongal (Bhogi)', hi: 'तै पोंगल (भोगी)', ta: 'தைப்பொங்கல் (போகி)', date: 'Wed, 14 Jan 2026', tithi: 'Paush Krishna Pratipada', nakshatra: 'Uttara Ashadha' },
  { en: 'Thai Pongal (Surya Pongal)', hi: 'तै पोंगल (सूर्य पोंगल)', ta: 'தைப்பொங்கல் (சூரிய பொங்கல்)', date: 'Thu, 15 Jan 2026', tithi: 'Paush Krishna Dwitiya', nakshatra: 'Shravana' },
  { en: 'Thai Pongal (Mattu Pongal)', hi: 'तै पोंगल (मट्टु पोंगल)', ta: 'தைப்பொங்கல் (மாட்டுப் பொங்கல்)', date: 'Fri, 16 Jan 2026', tithi: 'Paush Krishna Tritiya', nakshatra: 'Dhanishta' },
  { en: 'Thai Pongal (Kaanum Pongal)', hi: 'तै पोंगल (कानुम पोंगल)', ta: 'தைப்பொங்கல் (காணும் பொங்கல்)', date: 'Sat, 17 Jan 2026', tithi: 'Paush Krishna Chaturthi', nakshatra: 'Shatabhisha' },
  { en: 'Thaipusam', hi: 'तै पूसम्', ta: 'தைப்பூசம்', date: 'Wed, 11 Feb 2026', tithi: 'Magha Shukla Chaturdashi', nakshatra: 'Pushya' },
  { en: 'Puthandu (Tamil New Year)', hi: 'पुथाण्डु (तमिल नव वर्ष)', ta: 'புத்தாண்டு (தமிழ் புத்தாண்டு)', date: 'Tue, 14 Apr 2026', tithi: 'Chaitra Krishna Amavasya', nakshatra: 'Revati' },
  { en: 'Chithirai Thiruvizha (begins)', hi: 'चित्तिरै तिरुविळा (आरम्भ)', ta: 'சித்திரை திருவிழா (தொடக்கம்)', date: 'Sat, 18 Apr 2026', tithi: 'Vaishakha Shukla Chaturthi', nakshatra: 'Rohini' },
  { en: 'Aadi Perukku', hi: 'आडि पेरुक्कु', ta: 'ஆடிப்பெருக்கு', date: 'Sat, 2 Aug 2026', tithi: 'Shravana Shukla Ashtami', nakshatra: 'Uttara Phalguni' },
  { en: 'Varalakshmi Vratam', hi: 'वरलक्ष्मी व्रतम्', ta: 'வரலட்சுமி விரதம்', date: 'Fri, 7 Aug 2026', tithi: 'Shravana Shukla Trayodashi', nakshatra: 'Vishakha' },
  { en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी', ta: 'விநாயகர் சதுர்த்தி', date: 'Fri, 4 Sep 2026', tithi: 'Bhadrapada Shukla Chaturthi', nakshatra: 'Hasta' },
  { en: 'Navaratri (begins)', hi: 'नवरात्रि (आरम्भ)', ta: 'நவராத்திரி (தொடக்கம்)', date: 'Thu, 8 Oct 2026', tithi: 'Ashwin Shukla Pratipada', nakshatra: 'Chitra' },
  { en: 'Saraswati Puja', hi: 'सरस्वती पूजा', ta: 'சரஸ்வதி பூஜை', date: 'Fri, 16 Oct 2026', tithi: 'Ashwin Shukla Navami', nakshatra: 'Swati' },
  { en: 'Vijayadashami', hi: 'विजयादशमी', ta: 'விஜயதசமி', date: 'Sat, 17 Oct 2026', tithi: 'Ashwin Shukla Dashami', nakshatra: 'Vishakha' },
  { en: 'Deepavali', hi: 'दीपावली', ta: 'தீபாவளி', date: 'Sun, 8 Nov 2026', tithi: 'Kartik Krishna Amavasya', nakshatra: 'Swati' },
  { en: 'Karthigai Deepam', hi: 'कार्तिगै दीपम्', ta: 'கார்த்திகை தீபம்', date: 'Sat, 5 Dec 2026', tithi: 'Kartik Purnima', nakshatra: 'Krittika' },
  { en: 'Margazhi Season begins', hi: 'मार्गळि सीज़न आरम्भ', ta: 'மார்கழி சீசன் தொடக்கம்', date: 'Wed, 16 Dec 2026', tithi: 'Margashirsha Shukla Dwitiya', nakshatra: 'Dhanishta' },
];

const FESTIVAL_DATES_2027 = [
  { en: 'Thai Pongal (Bhogi)', hi: 'तै पोंगल (भोगी)', ta: 'தைப்பொங்கல் (போகி)', date: 'Thu, 14 Jan 2027', tithi: 'Paush Shukla Dashami', nakshatra: 'Shravana' },
  { en: 'Thai Pongal (Surya Pongal)', hi: 'तै पोंगल (सूर्य पोंगल)', ta: 'தைப்பொங்கல் (சூரிய பொங்கல்)', date: 'Fri, 15 Jan 2027', tithi: 'Paush Shukla Ekadashi', nakshatra: 'Dhanishta' },
  { en: 'Thai Pongal (Mattu Pongal)', hi: 'तै पोंगल (मट्टु पोंगल)', ta: 'தைப்பொங்கல் (மாட்டுப் பொங்கல்)', date: 'Sat, 16 Jan 2027', tithi: 'Paush Shukla Dwadashi', nakshatra: 'Shatabhisha' },
  { en: 'Thai Pongal (Kaanum Pongal)', hi: 'तै पोंगल (कानुम पोंगल)', ta: 'தைப்பொங்கல் (காணும் பொங்கல்)', date: 'Sun, 17 Jan 2027', tithi: 'Paush Shukla Trayodashi', nakshatra: 'Purva Bhadrapada' },
  { en: 'Thaipusam', hi: 'तै पूसम्', ta: 'தைப்பூசம்', date: 'Sat, 30 Jan 2027', tithi: 'Magha Shukla Trayodashi', nakshatra: 'Pushya' },
  { en: 'Puthandu (Tamil New Year)', hi: 'पुथाण्डु (तमिल नव वर्ष)', ta: 'புத்தாண்டு (தமிழ் புத்தாண்டு)', date: 'Wed, 14 Apr 2027', tithi: 'Chaitra Krishna Amavasya', nakshatra: 'Revati' },
  { en: 'Chithirai Thiruvizha (begins)', hi: 'चित्तिरै तिरुविळा (आरम्भ)', ta: 'சித்திரை திருவிழா (தொடக்கம்)', date: 'Sun, 18 Apr 2027', tithi: 'Vaishakha Shukla Chaturthi', nakshatra: 'Mrigashira' },
  { en: 'Aadi Perukku', hi: 'आडि पेरुक्कु', ta: 'ஆடிப்பெருக்கு', date: 'Sat, 2 Aug 2027', tithi: 'Shravana Shukla Navami', nakshatra: 'Uttara Phalguni' },
  { en: 'Varalakshmi Vratam', hi: 'वरलक्ष्मी व्रतम्', ta: 'வரலட்சுமி விரதம்', date: 'Fri, 27 Aug 2027', tithi: 'Shravana Purnima', nakshatra: 'Uttara Phalguni' },
  { en: 'Vinayaka Chaturthi', hi: 'विनायक चतुर्थी', ta: 'விநாயகர் சதுர்த்தி', date: 'Wed, 25 Aug 2027', tithi: 'Bhadrapada Shukla Chaturthi', nakshatra: 'Vishakha' },
  { en: 'Navaratri (begins)', hi: 'नवरात्रि (आरम्भ)', ta: 'நவராத்திரி (தொடக்கம்)', date: 'Mon, 27 Sep 2027', tithi: 'Ashwin Shukla Pratipada', nakshatra: 'Chitra' },
  { en: 'Saraswati Puja', hi: 'सरस्वती पूजा', ta: 'சரஸ்வதி பூஜை', date: 'Tue, 5 Oct 2027', tithi: 'Ashwin Shukla Navami', nakshatra: 'Swati' },
  { en: 'Vijayadashami', hi: 'विजयादशमी', ta: 'விஜயதசமி', date: 'Wed, 6 Oct 2027', tithi: 'Ashwin Shukla Dashami', nakshatra: 'Vishakha' },
  { en: 'Deepavali', hi: 'दीपावली', ta: 'தீபாவளி', date: 'Thu, 28 Oct 2027', tithi: 'Kartik Krishna Amavasya', nakshatra: 'Chitra' },
  { en: 'Karthigai Deepam', hi: 'कार्तिगै दीपम्', ta: 'கார்த்திகை தீபம்', date: 'Tue, 23 Nov 2027', tithi: 'Kartik Purnima', nakshatra: 'Krittika' },
  { en: 'Margazhi Season begins', hi: 'मार्गळि सीज़न आरम्भ', ta: 'மார்கழி சீசன் தொடக்கம்', date: 'Thu, 16 Dec 2027', tithi: 'Margashirsha Shukla Dwitiya', nakshatra: 'Dhanishta' },
];

// Tamil Month → Gregorian conversion table for 2026–2027
const MONTH_CONVERSION = [
  { tamil: 'Chithirai', tamilScript: 'சித்திரை', start2026: '14 Apr 2026', end2026: '14 May 2026', start2027: '14 Apr 2027', end2027: '14 May 2027', nameHi: 'चित्तिरै' },
  { tamil: 'Vaikasi', tamilScript: 'வைகாசி', start2026: '15 May 2026', end2026: '14 Jun 2026', start2027: '15 May 2027', end2027: '14 Jun 2027', nameHi: 'वैकासि' },
  { tamil: 'Aani', tamilScript: 'ஆனி', start2026: '15 Jun 2026', end2026: '15 Jul 2026', start2027: '15 Jun 2027', end2027: '15 Jul 2027', nameHi: 'आनि' },
  { tamil: 'Aadi', tamilScript: 'ஆடி', start2026: '16 Jul 2026', end2026: '16 Aug 2026', start2027: '16 Jul 2027', end2027: '16 Aug 2027', nameHi: 'आडि' },
  { tamil: 'Avani', tamilScript: 'ஆவணி', start2026: '17 Aug 2026', end2026: '16 Sep 2026', start2027: '17 Aug 2027', end2027: '16 Sep 2027', nameHi: 'आवणि' },
  { tamil: 'Purattasi', tamilScript: 'புரட்டாசி', start2026: '17 Sep 2026', end2026: '17 Oct 2026', start2027: '17 Sep 2027', end2027: '17 Oct 2027', nameHi: 'पुरट्टासि' },
  { tamil: 'Aippasi', tamilScript: 'ஐப்பசி', start2026: '18 Oct 2026', end2026: '15 Nov 2026', start2027: '18 Oct 2027', end2027: '15 Nov 2027', nameHi: 'ऐप्पसि' },
  { tamil: 'Karthigai', tamilScript: 'கார்த்திகை', start2026: '16 Nov 2026', end2026: '15 Dec 2026', start2027: '16 Nov 2027', end2027: '15 Dec 2027', nameHi: 'कार्तिगै' },
  { tamil: 'Margazhi', tamilScript: 'மார்கழி', start2026: '16 Dec 2026', end2026: '13 Jan 2027', start2027: '16 Dec 2027', end2027: '13 Jan 2028', nameHi: 'मार्गळि' },
  { tamil: 'Thai', tamilScript: 'தை', start2026: '14 Jan 2026', end2026: '12 Feb 2026', start2027: '14 Jan 2027', end2027: '12 Feb 2027', nameHi: 'तै' },
  { tamil: 'Masi', tamilScript: 'மாசி', start2026: '13 Feb 2026', end2026: '13 Mar 2026', start2027: '13 Feb 2027', end2027: '13 Mar 2027', nameHi: 'मासि' },
  { tamil: 'Panguni', tamilScript: 'பங்குனி', start2026: '14 Mar 2026', end2026: '13 Apr 2026', start2027: '14 Mar 2027', end2027: '13 Apr 2027', nameHi: 'पंगुनि' },
];

// FAQ data for structured data
const FAQ_DATA = [
  {
    q: { en: 'When is Tamil New Year (Puthandu) 2026?', hi: 'तमिल नव वर्ष (पुथाण्डु) 2026 कब है?', ta: 'தமிழ் புத்தாண்டு 2026 எப்போது?' },
    a: { en: 'Tamil New Year (Puthandu) 2026 falls on Tuesday, 14 April 2026 — Chithirai 1st in the Tamil calendar. It marks the Sun\'s entry into Mesha Rashi (Aries) and the beginning of Thiruvalluvar Aandu 2057. Families prepare the Kanni (auspicious arrangement) and Maanga Pachadi (six-flavour dish) on this day.', hi: 'तमिल नव वर्ष (पुथाण्डु) 2026 मंगलवार, 14 अप्रैल 2026 को पड़ता है — तमिल कैलेंडर में चित्तिरै 1। यह सूर्य के मेष राशि में प्रवेश और तिरुवल्लुवर आण्डु 2057 के आरम्भ का प्रतीक है।', ta: 'தமிழ் புத்தாண்டு 2026 செவ்வாய், ஏப்ரல் 14, 2026 அன்று வருகிறது — தமிழ் நாட்காட்டியில் சித்திரை 1. இது சூரியன் மேஷ ராசியில் நுழைவதையும் திருவள்ளுவர் ஆண்டு 2057 தொடக்கத்தையும் குறிக்கிறது.' },
  },
  {
    q: { en: 'What is the Tamil calendar system?', hi: 'तमिल कैलेंडर प्रणाली क्या है?', ta: 'தமிழ் நாட்காட்டி முறை என்ன?' },
    a: { en: 'The Tamil calendar (Tamil Panchangam) is a solar calendar where months are defined by the Sun\'s transit through the 12 zodiac signs (Rashis). Unlike the North Indian lunisolar calendar, Tamil months have a nearly fixed relationship with Gregorian dates — Chithirai 1 is always around April 14th. The calendar incorporates lunar elements (tithi, nakshatra) for determining festival dates within the solar months. It uses the Thiruvalluvar Era for year numbering (Gregorian year + 31). The Tamil calendar is used by over 80 million Tamil-speaking people worldwide.', hi: 'तमिल कैलेंडर (तमिल पंचांगम्) एक सौर कैलेंडर है जहां मास सूर्य के 12 राशियों में गोचर से निर्धारित होते हैं। उत्तर भारतीय चान्द्रसौर कैलेंडर के विपरीत, तमिल मासों का ग्रेगोरियन तिथियों से लगभग स्थिर सम्बन्ध है। कैलेंडर वर्ष गणना के लिए तिरुवल्लुवर संवत् (ग्रेगोरियन + 31) का प्रयोग करता है।', ta: 'தமிழ் நாட்காட்டி (தமிழ் பஞ்சாங்கம்) ஒரு சூரிய நாட்காட்டி, மாதங்கள் சூரியன் 12 ராசிகளில் கடக்கும் போக்கால் வரையறுக்கப்படுகின்றன. வட இந்திய சந்திர-சூரிய நாட்காட்டியைப் போலன்றி, தமிழ் மாதங்கள் கிரிகோரியன் தேதிகளுடன் கிட்டத்தட்ட நிலையான உறவைக் கொண்டுள்ளன.' },
  },
  {
    q: { en: 'When is Thai Pongal 2026?', hi: 'तै पोंगल 2026 कब है?', ta: 'தைப்பொங்கல் 2026 எப்போது?' },
    a: { en: 'Thai Pongal 2026 spans four days: Bhogi Pongal on Wednesday, 14 January; Surya Pongal (the main day) on Thursday, 15 January; Mattu Pongal on Friday, 16 January; and Kaanum Pongal on Saturday, 17 January 2026. It coincides with Makar Sankranti and marks the Sun\'s entry into Makara Rashi (Capricorn), beginning the auspicious Uttarayana period.', hi: 'तै पोंगल 2026 चार दिन चलता है: भोगी पोंगल बुधवार, 14 जनवरी; सूर्य पोंगल (मुख्य दिन) गुरुवार, 15 जनवरी; मट्टु पोंगल शुक्रवार, 16 जनवरी; और कानुम पोंगल शनिवार, 17 जनवरी 2026। यह मकर संक्रान्ति के साथ मनाया जाता है।', ta: 'தைப்பொங்கல் 2026 நான்கு நாட்கள்: போகி பொங்கல் புதன், ஜனவரி 14; சூரிய பொங்கல் (முக்கிய நாள்) வியாழன், ஜனவரி 15; மாட்டுப் பொங்கல் வெள்ளி, ஜனவரி 16; காணும் பொங்கல் சனி, ஜனவரி 17, 2026. இது மகர சங்கராந்தியுடன் ஒத்துவரும், சூரியன் மகர ராசியில் நுழைவதைக் குறிக்கிறது.' },
  },
  {
    q: { en: 'How does the Tamil calendar differ from the Hindi (North Indian) calendar?', hi: 'तमिल कैलेंडर हिन्दी (उत्तर भारतीय) कैलेंडर से कैसे भिन्न है?', ta: 'தமிழ் நாட்காட்டி இந்தி (வட இந்திய) நாட்காட்டியிலிருந்து எவ்வாறு வேறுபடுகிறது?' },
    a: { en: 'The key differences are: (1) The Tamil calendar is solar — months are defined by the Sun\'s zodiacal transit, giving nearly fixed Gregorian dates each year. The Hindi calendar is lunisolar — months run New Moon to New Moon, shifting ~11 days annually. (2) Tamil months range from 29-32 days based on solar speed; Hindi months are ~29.5 days (one lunar cycle). (3) The Tamil calendar never needs an intercalary month (Adhika Masa), while the Hindi calendar adds one every ~33 months. (4) Tamil New Year (Chithirai 1) is always around April 14th; the Hindi New Year (Chaitra Shukla Pratipada) varies by weeks. (5) Tamil uses the Thiruvalluvar Era (Gregorian + 31); Hindi uses Vikram Samvat (Gregorian + 57).', hi: 'मुख्य अन्तर: (1) तमिल कैलेंडर सौर है — मास सूर्य के राशि गोचर से निर्धारित, ग्रेगोरियन तिथियां लगभग स्थिर। हिन्दी कैलेंडर चान्द्रसौर है — मास अमावस्या से अमावस्या, हर वर्ष ~11 दिन खिसकते हैं। (2) तमिल मास 29-32 दिन; हिन्दी मास ~29.5 दिन। (3) तमिल को अधिक मास की आवश्यकता नहीं; हिन्दी में हर ~33 मास। (4) तमिल नव वर्ष सदैव ~14 अप्रैल; हिन्दी नव वर्ष हर वर्ष बदलता है। (5) तमिल में तिरुवल्लुवर संवत् (ग्रेगोरियन + 31); हिन्दी में विक्रम संवत् (ग्रेगोरियन + 57)।', ta: 'முக்கிய வேறுபாடுகள்: (1) தமிழ் நாட்காட்டி சூரிய அடிப்படை — மாதங்கள் சூரியனின் ராசி கடப்பால் நிர்ணயம், கிரிகோரியன் தேதிகள் கிட்டத்தட்ட நிலையானவை. இந்தி நாட்காட்டி சந்திர-சூரியம் — மாதங்கள் அமாவாசையிலிருந்து அமாவாசை வரை, ஆண்டுதோறும் ~11 நாட்கள் மாறும்.' },
  },
  {
    q: { en: 'What is the current Tamil year (Thiruvalluvar Aandu)?', hi: 'वर्तमान तमिल वर्ष (तिरुवल्लुवर आण्डु) क्या है?', ta: 'தற்போதைய தமிழ் ஆண்டு (திருவள்ளுவர் ஆண்டு) என்ன?' },
    a: { en: 'The current Tamil year is Thiruvalluvar Aandu 2057 (from Chithirai 1, i.e. 14 April 2026, to Panguni 30, i.e. 13 April 2027). The Thiruvalluvar Era is calculated as Gregorian year + 31, named after the Tamil poet-philosopher Thiruvalluvar, author of the Thirukkural. It was formally adopted by the Tamil Nadu government in 1971. Thiruvalluvar Aandu 2058 begins on 14 April 2027.', hi: 'वर्तमान तमिल वर्ष तिरुवल्लुवर आण्डु 2057 है (चित्तिरै 1 अर्थात् 14 अप्रैल 2026 से पंगुनि 30 अर्थात् 13 अप्रैल 2027)। तिरुवल्लुवर संवत् की गणना ग्रेगोरियन + 31 से होती है। 1971 में तमिलनाडु सरकार ने औपचारिक रूप से अपनाया। तिरुवल्लुवर आण्डु 2058, 14 अप्रैल 2027 से आरम्भ होगा।', ta: 'தற்போதைய தமிழ் ஆண்டு திருவள்ளுவர் ஆண்டு 2057 (சித்திரை 1, அதாவது ஏப்ரல் 14, 2026 முதல் பங்குனி 30, அதாவது ஏப்ரல் 13, 2027 வரை). திருவள்ளுவர் ஆண்டு கிரிகோரியன் + 31 ஆக கணக்கிடப்படுகிறது. 1971 இல் தமிழ்நாடு அரசால் அதிகாரப்பூர்வமாக ஏற்றுக்கொள்ளப்பட்டது. திருவள்ளுவர் ஆண்டு 2058, ஏப்ரல் 14, 2027 அன்று தொடங்கும்.' },
  },
  {
    q: { en: 'When is Karthigai Deepam 2026?', hi: 'कार्तिगै दीपम् 2026 कब है?', ta: 'கார்த்திகை தீபம் 2026 எப்போது?' },
    a: { en: 'Karthigai Deepam 2026 falls on Saturday, 5 December 2026, on Kartik Purnima when the Moon is in Krittika nakshatra. The most famous celebration is at the Arunachaleswarar Temple in Tiruvannamalai, where a massive flame (Maha Deepam) is lit atop the Annamalai Hill, visible for miles around. Homes across Tamil Nadu are lit with rows of oil lamps (Agal Vilakku).', hi: 'कार्तिगै दीपम् 2026 शनिवार, 5 दिसम्बर 2026 को कार्तिक पूर्णिमा पर पड़ता है जब चन्द्रमा कृत्तिका नक्षत्र में होता है। तिरुवण्णामलै के अरुणाचलेश्वर मन्दिर में अन्नामलै पहाड़ी पर विशाल महादीपम् जलाया जाता है।', ta: 'கார்த்திகை தீபம் 2026 சனிக்கிழமை, டிசம்பர் 5, 2026 அன்று கார்த்திகை பௌர்ணமியில் வருகிறது, சந்திரன் கிருத்திகை நட்சத்திரத்தில் இருக்கும்போது. திருவண்ணாமலை அருணாசலேஸ்வரர் கோயிலில் அண்ணாமலை குன்றின் மீது மகா தீபம் ஏற்றப்படும்.' },
  },
];

const RELATED_LINKS = [
  { slug: 'pongal', en: 'Pongal Puja Vidhi', hi: 'पोंगल पूजा विधि', ta: 'பொங்கல் பூஜை விதி' },
  { slug: 'navaratri', en: 'Navaratri Puja Vidhi', hi: 'नवरात्रि पूजा विधि', ta: 'நவராத்திரி பூஜை விதி' },
  { slug: 'diwali', en: 'Diwali Puja Vidhi', hi: 'दीवाली पूजा विधि', ta: 'தீபாவளி பூஜை விதி' },
  { slug: 'ganesh-chaturthi', en: 'Ganesh Chaturthi Puja', hi: 'गणेश चतुर्थी पूजा', ta: 'விநாயகர் சதுர்த்தி பூஜை' },
  { slug: 'maha-shivaratri', en: 'Maha Shivaratri Puja', hi: 'महा शिवरात्रि पूजा', ta: 'மகா சிவராத்திரி பூஜை' },
  { slug: 'makar-sankranti', en: 'Makar Sankranti / Pongal', hi: 'मकर संक्रांति / पोंगल', ta: 'மகர சங்கராந்தி / பொங்கல்' },
];

export default async function TamilCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  setRequestLocale(localeParam);
  const locale = localeParam as Locale;
  const isTamil = String(locale) === 'ta';
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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'மாதம்' : tl({ en: 'Month', hi: 'मास', sa: 'मास' }, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'தமிழ்' : tl({ en: 'Tamil', hi: 'तमिल', sa: 'तमिल' }, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'ராசி' : tl({ en: 'Rashi (Zodiac)', hi: 'राशि', sa: 'राशि' }, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'கிரிகோரியன்' : tl({ en: 'Gregorian', hi: 'ग्रेगोरियन', sa: 'ग्रेगोरियन' }, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'நாட்கள்' : tl({ en: 'Days', hi: 'दिन', sa: 'दिन' }, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {TAMIL_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isTamil ? m.tamil : isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.tamil}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.rashi}</td>
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
                <div className="text-gold-light font-semibold text-sm mb-1.5">{isTamil ? (f.monthTa || f.month) : f.month}</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isTamil ? (f.ta || f.en) : isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Puthandu */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('puthandu')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('puthanduText')}
          </p>
        </section>

        {/* Thai Pongal  –  The Four-Day Festival */}
        <section className="bg-gradient-to-br from-orange-900/15 via-bg-secondary/40 to-bg-primary border border-orange-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('pongalTitle')}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {L('pongalText')}
          </div>
        </section>

        {/* Solar vs Lunisolar */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('solarVsLunar')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('solarVsLunarText')}
          </p>
        </section>

        {/* Aadi Month */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('aadiTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('aadiText')}
          </p>
        </section>

        {/* Margazhi */}
        <section className="bg-gradient-to-br from-indigo-900/15 via-bg-secondary/40 to-bg-primary border border-indigo-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('margazhiTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('margazhiText')}
          </p>
        </section>

        {/* ══════════════════════════════════════════════════ */}
        {/* 2026 Tamil Festival Dates with Tithi & Nakshatra */}
        {/* ══════════════════════════════════════════════════ */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTamil ? 'தமிழ் திருவிழா தேதிகள் 2026 — திதி, நட்சத்திரம் & சரியான தேதிகள்' : isHi ? 'तमिल त्योहार 2026 — तिथि, नक्षत्र और दिनांक' : 'Tamil Festival Dates 2026 — Tithi, Nakshatra & Exact Dates'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isTamil
              ? 'சென்னை குறிப்புடன் 2026 ஆம் ஆண்டின் முக்கிய தமிழ் திருவிழாக்களின் சரியான தேதிகள், திதி மற்றும் நட்சத்திரம். இந்த சரிபார்க்கப்பட்ட தேதிகளுடன் உங்கள் பூஜை அட்டவணையைத் திட்டமிடுங்கள்.'
              : isHi
                ? 'चेन्नई सन्दर्भ के साथ 2026 के प्रमुख तमिल त्योहारों की सटीक तिथियां, तिथि और नक्षत्र। अपने पूजा की योजना इन सत्यापित तिथियों के साथ बनाएं।'
                : 'Exact dates for all major Tamil festivals in 2026 with tithi (lunar day) and nakshatra (lunar mansion) computed for Chennai. Plan your puja schedules with these verified dates from the Tamil Panchangam.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'திருவிழா' : isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'தேதி' : isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'திதி' : isHi ? 'तिथि' : 'Tithi'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'நட்சத்திரம்' : isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2026.map((f, i) => (
                  <tr key={f.en} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isTamil ? f.ta : isHi ? f.hi : f.en}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.nakshatra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2027 Tamil Festival Dates */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTamil ? 'தமிழ் திருவிழா தேதிகள் 2027 — திதி, நட்சத்திரம் & சரியான தேதிகள்' : isHi ? 'तमिल त्योहार 2027 — तिथि, नक्षत्र और दिनांक' : 'Tamil Festival Dates 2027 — Tithi, Nakshatra & Exact Dates'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isTamil
              ? '2027 ஆம் ஆண்டின் முக்கிய தமிழ் திருவிழா தேதிகள். திருவள்ளுவர் ஆண்டு 2058 ஏப்ரல் 14, 2027 அன்று தொடங்கும். சென்னைக்கான திதி மற்றும் நட்சத்திரத்துடன் அனைத்து தேதிகளும் கணக்கிடப்பட்டுள்ளன.'
              : isHi
                ? '2027 में प्रमुख तमिल त्योहार। तिरुवल्लुवर आण्डु 2058, 14 अप्रैल 2027 से आरम्भ होगा। चेन्नई सन्दर्भ के साथ सभी तिथियां और नक्षत्र।'
                : 'Major Tamil festival dates for 2027. Thiruvalluvar Aandu 2058 begins on 14 April 2027. All dates computed for Chennai with tithi and nakshatra from the Tamil Panchangam.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'திருவிழா' : isHi ? 'त्योहार' : 'Festival'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'தேதி' : isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'திதி' : isHi ? 'तिथि' : 'Tithi'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'நட்சத்திரம்' : isHi ? 'नक्षत्र' : 'Nakshatra'}</th>
                </tr>
              </thead>
              <tbody>
                {FESTIVAL_DATES_2027.map((f, i) => (
                  <tr key={f.en} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isTamil ? f.ta : isHi ? f.hi : f.en}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{f.date}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{f.nakshatra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tamil Month to Gregorian Conversion Table */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTamil ? 'தமிழ் மாதத்திலிருந்து கிரிகோரியன் மாற்ற அட்டவணை (2026–2027)' : isHi ? 'तमिल मास से ग्रेगोरियन रूपान्तरण तालिका (2026–2027)' : 'Tamil Month to Gregorian Conversion Table (2026–2027)'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {isTamil
              ? 'ஒவ்வொரு தமிழ் மாதத்தின் கிரிகோரியன் தொடக்க மற்றும் முடிவு தேதிகள். தமிழ் நாட்காட்டி சூரிய அடிப்படையிலானது என்பதால், மாத தேதிகள் ஆண்டுதோறும் கிட்டத்தட்ட ஒரே மாதிரியாக இருக்கும். தமிழ் ஆண்டு (திருவள்ளுவர் ஆண்டு) ஏப்ரல் நடுப்பகுதியிலிருந்து ஏப்ரல் நடுப்பகுதிவரை நடக்கும்.'
              : isHi
                ? 'प्रत्येक तमिल मास की ग्रेगोरियन प्रारम्भ और समाप्ति तिथियां। तमिल कैलेंडर सौर आधारित होने के कारण, मास तिथियां हर वर्ष लगभग समान रहती हैं। तमिल वर्ष (तिरुवल्लुवर आण्डु) मध्य-अप्रैल से मध्य-अप्रैल तक चलता है।'
                : 'Start and end dates in the Gregorian calendar for each Tamil month. Because the Tamil calendar is solar-based, month dates remain nearly identical from year to year. The Tamil year (Thiruvalluvar Aandu) runs from mid-April to mid-April.'}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'தமிழ் மாதம்' : isHi ? 'तमिल मास' : 'Tamil Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">தமிழ்</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">2026</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">2027</th>
                </tr>
              </thead>
              <tbody>
                {MONTH_CONVERSION.map((m, i) => (
                  <tr key={m.tamil} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isTamil ? m.tamilScript : isHi ? m.nameHi : m.tamil}</td>
                    <td className="px-4 py-2.5 text-amber-400/80">{m.tamilScript}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.start2026} — {m.end2026}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-xs">{m.start2027} — {m.end2027}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Thiruvalluvar Era */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('thiruvalluvarTitle')}
          </h2>
          <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {L('thiruvalluvarText')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
              <div className="text-gold-light font-semibold text-lg mb-1">2057</div>
              <div className="text-text-secondary text-xs">{isTamil ? 'திருவள்ளுவர் ஆண்டு (ஏப்ரல் 14, 2026 – ஏப்ரல் 13, 2027)' : isHi ? 'तिरुवल्लुवर आण्डु (14 अप्रैल 2026 – 13 अप्रैल 2027)' : 'Thiruvalluvar Aandu (14 Apr 2026 – 13 Apr 2027)'}</div>
            </div>
            <div className="bg-bg-primary/40 border border-gold-primary/8 rounded-xl p-4">
              <div className="text-gold-light font-semibold text-lg mb-1">2058</div>
              <div className="text-text-secondary text-xs">{isTamil ? 'திருவள்ளுவர் ஆண்டு (ஏப்ரல் 14, 2027 – ஏப்ரல் 13, 2028)' : isHi ? 'तिरुवल्लुवर आण्डु (14 अप्रैल 2027 – 13 अप्रैल 2028)' : 'Thiruvalluvar Aandu (14 Apr 2027 – 13 Apr 2028)'}</div>
            </div>
          </div>
        </section>

        {/* Tamil Calendar History & Significance (SEO long-form) */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {isTamil ? 'தமிழ் நாட்காட்டியின் வரலாறு மற்றும் முக்கியத்துவம்' : isHi ? 'तमिल कैलेंडर का इतिहास और महत्व' : 'History & Significance of the Tamil Calendar'}
          </h2>
          <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
            <p>
              {isTamil
                ? 'தமிழ் நாட்காட்டி உலகின் மிகப் பழமையான நாட்காட்டி முறைகளில் ஒன்று, சங்க இலக்கியத்தின் காலத்திலிருந்தே (கி.மு. 300 – கி.பி. 300) பயன்பாட்டில் உள்ளது. சங்க கவிதைகளில் தமிழ் மாதப் பெயர்கள் மற்றும் பருவகால அனுஷ்டானங்கள் குறிப்பிடப்படுகின்றன. ஆரியபட்டர் (கி.பி. 476) மற்றும் வராகமிகிரர் (கி.பி. 505) போன்ற இந்திய வானியலாளர்கள் சூரிய சித்தாந்தத்தின் அடிப்படையில் இந்த நாட்காட்டி முறையை செம்மைப்படுத்தினர். நவீன தமிழ் பஞ்சாங்கம் வக்கிய பஞ்சாங்கம் (வானியல் பஞ்சாங்கம்) மற்றும் திருக்கணித பஞ்சாங்கம் (கணித பஞ்சாங்கம்) என இரு பாரம்பரியங்களைத் தழுவுகிறது.'
                : isHi
                  ? 'तमिल कैलेंडर विश्व की सबसे प्राचीन कैलेंडर प्रणालियों में से एक है, जो संगम साहित्य के काल (300 ई.पू. – 300 ई.) से प्रयोग में है। संगम कविताओं में तमिल मासों के नाम और ऋतु अनुष्ठानों का उल्लेख मिलता है। आर्यभट्ट (476 ई.) और वराहमिहिर (505 ई.) जैसे भारतीय खगोलविदों ने सूर्य सिद्धान्त के आधार पर इस प्रणाली को परिष्कृत किया। आधुनिक तमिल पंचांगम् दो परम्पराओं — वाक्किय पंचांगम् (खगोलीय) और तिरुक्कणित पंचांगम् (गणितीय) — पर आधारित है।'
                  : 'The Tamil calendar is among the world\'s oldest calendrical systems, in continuous use since at least the Sangam period (300 BCE – 300 CE). Sangam-era poetry references Tamil month names and seasonal rituals, confirming that the solar month system was already well established over two millennia ago. Indian astronomers such as Aryabhata (476 CE) and Varahamihira (505 CE) refined the computational methods underlying the calendar based on the Surya Siddhanta. The modern Tamil Panchangam draws on two traditions: the Vakya Panchangam (observational, based on pre-computed astronomical tables) and the Thirukanitham Panchangam (mathematical, based on continuous calculation).'}
            </p>
            <p>
              {isTamil
                ? 'தமிழ் நாட்காட்டியின் தனித்தன்மை அதன் சூரிய அடிப்படையில் உள்ளது. வட இந்திய நாட்காட்டிகள் சந்திரனின் நிலவட்டத்தைப் பின்பற்றி மாதங்களை நிர்ணயிக்கின்றன, ஆனால் தமிழ் நாட்காட்டி சூரியனின் ராசி கடப்பை அடிப்படையாகக் கொண்டது. இது தமிழ் மாதங்களுக்கு கிரிகோரியன் நாட்காட்டியுடன் நிலையான உறவை வழங்குகிறது — சித்திரை 1 எப்போதும் ஏப்ரல் 14 அன்று அல்லது அதன் அருகில் வரும். இருப்பினும், திருவிழா தேதிகள் சந்திர திதிகள் மற்றும் நட்சத்திரங்களால் நிர்ணயிக்கப்படுகின்றன — இது சூரிய மாதங்கள் மற்றும் சந்திர சமய நிகழ்வுகளின் ஒரு கலப்பு முறை. இந்த இரட்டை அமைப்பு தமிழ் நாட்காட்டியை இந்தியாவின் மற்ற நாட்காட்டிகளிலிருந்து தனித்து நிற்கச் செய்கிறது.'
                : isHi
                  ? 'तमिल कैलेंडर की अनूठी विशेषता इसका सौर आधार है। जबकि उत्तर भारतीय कैलेंडर चन्द्रमा के चक्र से मासों को निर्धारित करते हैं, तमिल कैलेंडर सूर्य के राशि गोचर पर आधारित है। यह तमिल मासों को ग्रेगोरियन कैलेंडर के साथ स्थिर सम्बन्ध प्रदान करता है — चित्तिरै 1 सदैव 14 अप्रैल को या उसके आसपास आता है। फिर भी, त्योहारों की तिथियां चान्द्र तिथियों और नक्षत्रों से निर्धारित होती हैं — यह सौर मासों और चान्द्र धार्मिक अनुष्ठानों का एक संयुक्त प्रणाली है।'
                  : 'The distinctive character of the Tamil calendar lies in its solar foundation. While North Indian calendars define months by the Moon\'s synodic cycle (New Moon to New Moon), the Tamil calendar anchors months to the Sun\'s sidereal transit through the zodiac. This gives Tamil months a nearly fixed correspondence with Gregorian dates — Chithirai 1 always falls on or around April 14th. However, festival dates within each month are still determined by lunar tithis and nakshatras — making this a hybrid system of solar months and lunar religious observances. This dual structure makes the Tamil calendar unique among Indian calendrical traditions and gives it practical advantages: you always know roughly which Gregorian dates correspond to which Tamil month, yet the rich lunar panchanga data (tithi, yoga, karana, nakshatra) is preserved for all ritual purposes.'}
            </p>
            <p>
              {isTamil
                ? 'தமிழ் பஞ்சாங்கம் வெறும் நாட்காட்டி அல்ல — இது தமிழ் கலாசாரத்தின் ஒருங்கிணைந்த பகுதி. ஒவ்வொரு தமிழ் குடும்பமும் வருடாந்திர பஞ்சாங்கத்தை வாங்குவது அத்தியாவசிய பாரம்பரியமாகும். பஞ்சாங்கம் தினசரி திதி, நட்சத்திரம், யோகம், கரணம், கிரக நிலைகள், முகூர்த்தங்கள், கிரகண தரவு, திருமண தேதிகள், விவசாய ஆலோசனைகள் மற்றும் வானிலை கணிப்புகளையும் கொண்டுள்ளது. புத்தாண்டு நாளான சித்திரை 1 அன்று கோயில்களில் புதிய வருடத்திற்கான பஞ்சாங்க வாசிப்பு (பஞ்சாங்க சிரவணம்) சிறப்பாக நடத்தப்படுகிறது — ஜோதிடர் வரும் ஆண்டின் கிரக நிலைகள், மழை அளவு, பயிர் விளைச்சல் மற்றும் பொது நலனைப் பற்றி கணிப்புகள் கூறுவார்.'
                : isHi
                  ? 'तमिल पंचांगम् केवल कैलेंडर नहीं — यह तमिल संस्कृति का अभिन्न अंग है। प्रत्येक तमिल परिवार के लिए वार्षिक पंचांगम् खरीदना अनिवार्य परम्परा है। पंचांगम् में दैनिक तिथि, नक्षत्र, योग, करण, ग्रह स्थिति, मुहूर्त, ग्रहण, विवाह तिथियां, कृषि परामर्श और मौसम पूर्वानुमान शामिल होते हैं। नव वर्ष चित्तिरै 1 को मन्दिरों में पंचांगम् श्रवणम् (पंचांग पठन) का विशेष आयोजन होता है — ज्योतिषी आने वाले वर्ष के ग्रह स्थिति, वर्षा, फसल और जनकल्याण के बारे में भविष्यवाणी करते हैं।'
                  : 'The Tamil Panchangam is far more than a calendar — it is an integral part of Tamil cultural life. For every Tamil family, purchasing the annual Panchangam is an essential tradition. The Panchangam contains daily tithi, nakshatra, yoga, karana, planetary positions, muhurtas for every day, eclipse data, marriage dates, agricultural advice, and weather predictions. On New Year\'s Day (Chithirai 1), temples conduct a special "Panchangam Shravanam" (Panchangam reading) ceremony where the temple astrologer reads out predictions for the coming year — planetary positions, rainfall forecasts, crop yields, and general welfare. This tradition has been maintained for centuries and remains a highlight of Tamil New Year celebrations. The two major Panchangam traditions — Vakya and Thirukanitham — occasionally differ on exact timings by a few minutes, leading to lively debates among scholars and practitioners that keep the astronomical tradition intellectually vibrant.'}
            </p>
          </div>
        </section>

        {/* FAQ Section (visible + structured data) */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)' : isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <details key={faq.q.en} className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isTamil ? faq.q.ta : isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isTamil ? faq.a.ta : isHi ? faq.a.hi : faq.a.en}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* JSON-LD FAQ Schema */}
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

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {L('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELATED_LINKS.map((link) => (
              <Link
                key={link.slug}
                href={`/puja/${link.slug}`}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isTamil ? (link.ta || link.en) : isHi ? link.hi : link.en}
              </Link>
            ))}
            <Link
              href="/calendar"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {isTamil ? 'திருவிழா நாட்காட்டி 2026' : tl({ en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', sa: 'त्योहार कैलेंडर 2026' }, locale)}
            </Link>
            <Link
              href="/calendar/regional/bengali"
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {isTamil ? 'வங்காள நாட்காட்டி (பஞ்சிகா)' : tl({ en: 'Bengali Calendar (Panjika)', hi: 'बंगाली कैलेंडर (पंजिका)', sa: 'बंगाली कैलेंडर (पंजिका)' }, locale)}
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';

const LABELS = {
  title: {
    en: 'Tamil Calendar (Panchangam)',
    hi: 'तमिल कैलेंडर (पंचांगम्)',
    sa: 'तमिलपञ्चाङ्गम्',
    ta: 'தமிழ் நாட்காட்டி (பஞ்சாங்கம்)',
  },
  intro: {
    en: 'The Tamil calendar, known as the Tamil Panchangam, is one of the oldest continuously used calendar systems in the world. Unlike the North Indian lunisolar calendar, the Tamil calendar is primarily solar-based — months are determined by the Sun\'s transit through the twelve Rashis (zodiac signs). This solar foundation gives the Tamil calendar a fixed relationship with the Gregorian calendar, making Tamil month dates remarkably consistent from year to year. The Tamil Panchangam is used by over 80 million Tamil-speaking people across Tamil Nadu, Sri Lanka, Malaysia, Singapore, and the global Tamil diaspora.',
    hi: 'तमिल कैलेंडर, जिसे तमिल पंचांगम् कहा जाता है, विश्व की सबसे प्राचीन निरन्तर प्रयोग में आने वाली कैलेंडर प्रणालियों में से एक है। उत्तर भारतीय चान्द्र-सौर कैलेंडर के विपरीत, तमिल कैलेंडर मुख्य रूप से सौर आधारित है — मास सूर्य के बारह राशियों में गोचर से निर्धारित होते हैं। यह सौर आधार तमिल कैलेंडर को ग्रेगोरियन कैलेंडर के साथ स्थिर सम्बन्ध प्रदान करता है।',
    sa: 'तमिलपञ्चाङ्गं विश्वस्य प्राचीनतमासु निरन्तरप्रयुक्तासु पञ्चाङ्गपद्धतिषु अन्यतमम्। उत्तरभारतीयचान्द्रसौरपञ्चाङ्गात् भिन्नं तमिलपञ्चाङ्गं मुख्यतः सौराधारितम् — मासाः सूर्यस्य द्वादशराशिषु गोचरेण निर्धार्यन्ते।',
    ta: 'தமிழ் பஞ்சாங்கம் என்று அழைக்கப்படும் தமிழ் நாட்காட்டி, உலகில் தொடர்ந்து பயன்படுத்தப்படும் மிகப் பழமையான நாட்காட்டி முறைகளில் ஒன்றாகும். வட இந்திய சந்திர-சூரிய நாட்காட்டியைப் போலன்றி, தமிழ் நாட்காட்டி முதன்மையாக சூரிய அடிப்படையிலானது — மாதங்கள் சூரியன் பன்னிரண்டு ராசிகளில் கடக்கும் போக்கால் நிர்ணயிக்கப்படுகின்றன. இந்த சூரிய அடிப்படை தமிழ் நாட்காட்டிக்கு கிரிகோரியன் நாட்காட்டியுடன் நிலையான உறவை அளிக்கிறது. தமிழ் பஞ்சாங்கம் தமிழ்நாடு, இலங்கை, மலேசியா, சிங்கப்பூர் மற்றும் உலகளாவிய தமிழ் புலம்பெயர்ந்தோர் உட்பட 80 மில்லியனுக்கும் மேற்பட்ட தமிழ் பேசும் மக்களால் பயன்படுத்தப்படுகிறது.',
  },
  monthsTitle: {
    en: 'The 12 Tamil Months',
    hi: '12 तमिल मास',
    sa: '१२ तमिलमासाः',
    ta: '12 தமிழ் மாதங்கள்',
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
  },
  puthandu: {
    en: 'Puthandu — Tamil New Year',
    hi: 'पुथाण्डु — तमिल नव वर्ष',
    sa: 'पुथाण्डु — तमिलनववर्षम्',
    ta: 'புத்தாண்டு — தமிழ் புத்தாண்டு',
  },
  puthanduText: {
    en: 'Puthandu, the Tamil New Year, falls on Chithirai 1st (typically April 14th). It marks the Sun\'s entry into Mesha Rashi (Aries). On this day, families prepare the "Kanni" — an auspicious arrangement of fruits, flowers, gold jewelry, coins, new clothes, raw rice, and a mirror. The first sight upon waking should be the Kanni, symbolizing an auspicious start to the year. A special dish called "Maanga Pachadi" is prepared, combining six flavors (sweet, sour, salty, bitter, pungent, and astringent) representing the six experiences of life. Temples hold special abhishekam ceremonies and recite the new year\'s Panchangam predictions.',
    hi: 'पुथाण्डु, तमिल नव वर्ष, चित्तिरै 1 (आमतौर पर 14 अप्रैल) को मनाया जाता है। यह सूर्य के मेष राशि में प्रवेश का प्रतीक है। इस दिन परिवार "कन्नि" सजाते हैं — फल, फूल, स्वर्ण आभूषण, सिक्के, नए वस्त्र, कच्चे चावल और दर्पण। "मांगा पचड़ी" नामक विशेष व्यंजन बनाया जाता है जिसमें छह स्वाद होते हैं — जीवन के छह अनुभवों का प्रतीक।',
    sa: 'पुथाण्डु तमिलनववर्षं चित्तिरै प्रथमदिने (सामान्यतः एप्रिल-मासस्य १४ दिनाङ्के) आचर्यते। एतत् सूर्यस्य मेषराशिप्रवेशं सूचयति।',
    ta: 'தமிழ் புத்தாண்டு சித்திரை 1ஆம் தேதி (பொதுவாக ஏப்ரல் 14) அன்று வருகிறது. இது சூரியன் மேஷ ராசியில் நுழைவதைக் குறிக்கிறது. இந்த நாளில் குடும்பங்கள் "கன்னி" — பழங்கள், பூக்கள், தங்க நகைகள், நாணயங்கள், புதிய ஆடைகள், பச்சரிசி மற்றும் கண்ணாடி ஆகியவற்றின் சுப அமைப்பை தயார் செய்கின்றனர். விழித்தெழும்போது முதலில் கன்னியைப் பார்ப்பது ஆண்டின் சுப தொடக்கத்தைக் குறிக்கிறது. "மாங்கா பச்சடி" என்ற சிறப்பு உணவு — இனிப்பு, புளிப்பு, உப்பு, கசப்பு, காரம், துவர்ப்பு ஆகிய ஆறு சுவைகள் — வாழ்வின் ஆறு அனுபவங்களைக் குறிக்கும். கோயில்களில் சிறப்பு அபிஷேகங்கள் நடைபெறும்.',
  },
  solarVsLunar: {
    en: 'Solar vs Lunisolar — How Tamil Panchangam Differs',
    hi: 'सौर बनाम चान्द्र-सौर — तमिल पंचांगम् कैसे भिन्न है',
    sa: 'सौरं चान्द्रसौरं च — तमिलपञ्चाङ्गं कथं भिन्नम्',
    ta: 'சூரியம் vs சந்திர-சூரியம் — தமிழ் பஞ்சாங்கம் எவ்வாறு வேறுபடுகிறது',
  },
  solarVsLunarText: {
    en: 'The most fundamental difference between the Tamil and North Indian calendars lies in how months are defined. In the North Indian system (used across UP, Bihar, Rajasthan, MP), months are lunisolar — they run from one New Moon (Amavasya) to the next in the Amanta system, or one Full Moon (Purnima) to the next in the Purnimant system. This means month boundaries shift by about 11 days each year relative to the solar calendar, requiring an intercalary month (Adhika Masa) every ~33 months to resynchronize. The Tamil system avoids this entirely by anchoring months to the Sun\'s zodiacal transit. When the Sun enters Mesha (Aries), Chithirai begins. When it enters Rishabha (Taurus), Vaikasi begins. This means Tamil dates fall on approximately the same Gregorian dates every year — Chithirai 1 is always April 14th (occasionally 13th or 15th due to axial precession). The Tamil calendar does incorporate lunar elements for determining Tithi, Nakshatra, and festival dates within each solar month, making it a hybrid system — solar for months, lunar for religious observances.',
    hi: 'तमिल और उत्तर भारतीय कैलेंडर के बीच सबसे मूलभूत अन्तर यह है कि मास कैसे परिभाषित होते हैं। उत्तर भारतीय प्रणाली में मास चान्द्र-सौर हैं — अमान्त प्रणाली में एक अमावस्या से अगली तक, पूर्णिमान्त में एक पूर्णिमा से अगली तक। इसका अर्थ है कि मास सीमाएं हर वर्ष सौर कैलेंडर के सापेक्ष ~11 दिन खिसकती हैं, जिसके लिए हर ~33 मास में अधिक मास की आवश्यकता होती है। तमिल प्रणाली मासों को सूर्य के राशि गोचर से जोड़कर इससे पूरी तरह बचती है। तमिल कैलेंडर तिथि, नक्षत्र और त्योहारों के लिए चन्द्र तत्वों को भी शामिल करता है।',
    sa: 'तमिलोत्तरभारतीयपञ्चाङ्गयोः मध्ये मूलभूतः भेदः मासपरिभाषायाम् अस्ति। उत्तरभारतीयपद्धत्यां मासाः चान्द्रसौराः। तमिलपद्धतिः मासान् सूर्यस्य राशिगोचरेण निबध्नाति।',
    ta: 'தமிழ் மற்றும் வட இந்திய நாட்காட்டிகளுக்கிடையேயான மிக அடிப்படையான வேறுபாடு மாதங்கள் எவ்வாறு வரையறுக்கப்படுகின்றன என்பதில் உள்ளது. வட இந்திய முறையில் மாதங்கள் சந்திர-சூரியம் — அமாந்த முறையில் ஒரு அமாவாசையிலிருந்து அடுத்ததுவரை, பூர்ணிமாந்த முறையில் ஒரு பௌர்ணமியிலிருந்து அடுத்ததுவரை. இதனால் மாத எல்லைகள் ஒவ்வொரு ஆண்டும் ~11 நாட்கள் மாறும், ~33 மாதங்களுக்கு ஒருமுறை அதிக மாதம் தேவை. தமிழ் முறை மாதங்களை சூரியனின் ராசி கடப்புடன் இணைத்து இதை முழுமையாகத் தவிர்க்கிறது. சூரியன் மேஷத்தில் நுழையும்போது சித்திரை தொடங்கும். ரிஷபத்தில் நுழையும்போது வைகாசி தொடங்கும். தமிழ் நாட்காட்டி திதி, நட்சத்திரம் மற்றும் திருவிழா தேதிகளுக்கு சந்திர அங்கங்களையும் உள்ளடக்கியது — மாதங்களுக்கு சூரியம், சமய வழிபாட்டிற்கு சந்திரம்.',
  },
  aadiTitle: {
    en: 'The Significance of Aadi Month',
    hi: 'आडि मास का महत्व',
    sa: 'आडिमासस्य महत्त्वम्',
    ta: 'ஆடி மாதத்தின் சிறப்பு',
  },
  aadiText: {
    en: 'Aadi (mid-July to mid-August) holds a paradoxical position in Tamil culture — it is simultaneously considered inauspicious for worldly activities yet deeply sacred for spiritual practices. No weddings, griha pravesh (housewarming), or major business ventures are initiated during Aadi. The traditional saying "Aadi-la kalyanam, aadhi-la kadesi" (a wedding in Aadi leads to ruin) reflects this deeply held belief. The reasons are both practical and spiritual: Aadi falls during the peak monsoon when floods, illness, and agricultural uncertainty are highest. Spiritually, it is considered a month when the veil between worlds is thin. However, Aadi is also when "Aadi Perukku" (the 18th of Aadi) is celebrated with great enthusiasm along river banks, honoring the swelling of rivers and the fertility of the land. Women perform special pujas near water bodies, offering fruits, flowers, and cooked food. Aadi Fridays are especially sacred — women worship Goddess Amman (Mariamman, Draupadi Amman) with special offerings. "Aadi Pattam" (the Aadi planting season) is when rice cultivation begins in earnest.',
    hi: 'आडि (मध्य जुलाई से मध्य अगस्त) तमिल संस्कृति में एक विरोधाभासी स्थान रखता है — यह सांसारिक गतिविधियों के लिए अशुभ माना जाता है फिर भी आध्यात्मिक साधनाओं के लिए अत्यन्त पवित्र है। आडि में कोई विवाह, गृह प्रवेश या बड़ा व्यापारिक उपक्रम आरम्भ नहीं किया जाता। "आडि पेरुक्कु" (आडि का 18वां दिन) नदी किनारों पर उत्साह से मनाया जाता है। आडि के शुक्रवार विशेष रूप से पवित्र हैं — महिलाएं देवी अम्मन की पूजा करती हैं।',
    sa: 'आडिमासः (मध्यश्रावणात् मध्यभाद्रपदपर्यन्तम्) तमिलसंस्कृतौ विरोधाभासस्थानम् आवहति — लौकिककार्येभ्यः अशुभः तथापि आध्यात्मिकसाधनाभ्यः अत्यन्तपवित्रः।',
    ta: 'ஆடி (ஜூலை நடுப்பகுதி முதல் ஆகஸ்ட் நடுப்பகுதி வரை) தமிழ் கலாசாரத்தில் முரண்பாடான இடத்தை வகிக்கிறது — உலகியல் செயல்களுக்கு அசுபமாகவும், ஆன்மீக பயிற்சிகளுக்கு மிகப் புனிதமாகவும் கருதப்படுகிறது. ஆடியில் திருமணம், கிருஹ பிரவேசம் அல்லது பெரிய வணிக முயற்சிகள் தொடங்கப்படுவதில்லை. "ஆடியில கல்யாணம், ஆதிலே கடைசி" என்ற பழமொழி இந்த ஆழமான நம்பிக்கையை பிரதிபலிக்கிறது. ஆடி பெருக்கு (ஆடி 18) ஆற்றங்கரைகளில் உற்சாகமாக கொண்டாடப்படுகிறது. ஆடி வெள்ளிக்கிழமைகள் சிறப்பாக புனிதமானவை — பெண்கள் அம்மன் (மாரியம்மன், திரௌபதி அம்மன்) வழிபாடு செய்கின்றனர்.',
  },
  margazhiTitle: {
    en: 'Margazhi — The Month of Spiritual Awakening',
    hi: 'मार्गळि — आध्यात्मिक जागरण का मास',
    sa: 'मार्गळि — आध्यात्मिकजागरणस्य मासः',
    ta: 'மார்கழி — ஆன்மீக விழிப்புணர்வின் மாதம்',
  },
  margazhiText: {
    en: 'Margazhi (mid-December to mid-January) is considered the most spiritually charged month in the Tamil calendar. Krishna declares in the Bhagavad Gita (10.35): "Among months, I am Margashirsha" — the Sanskrit equivalent of Margazhi. This month is when the divine is believed to be most accessible to devotees. The tradition of "Thiruppavai" and "Thiruvempavai" is central to Margazhi — women wake before dawn (typically around 4-5 AM) to sing the 30 verses of Andal\'s Thiruppavai at Vishnu temples, or Manikkavasagar\'s Thiruvempavai at Shiva temples. This pre-dawn devotional practice, called "Bhajan" or "Pagal Pattu," continues for all 30 days of Margazhi. The streets of Tamil Nadu come alive with kolam (rangoli) drawn in rice flour before sunrise, and the sound of Nadaswaram and Thavil from temples. Classical music and dance reach their zenith during the Margazhi Season (Chennai Music Season / December Season), the world\'s largest cultural festival featuring over 3,000 performances across 300+ venues over 6 weeks. Temples perform special Vaikunta Ekadashi celebrations during Margazhi, when the "Paramapada Vasal" (gateway to heaven) is opened at Vishnu temples.',
    hi: 'मार्गळि (मध्य दिसम्बर से मध्य जनवरी) तमिल कैलेंडर का सबसे आध्यात्मिक मास माना जाता है। कृष्ण भगवद्गीता (10.35) में कहते हैं: "मासों में मैं मार्गशीर्ष हूँ"। "तिरुप्पावै" और "तिरुवेम्पावै" की परम्परा मार्गळि की केन्द्रीय है — महिलाएं भोर से पहले जागकर आण्डाल के तिरुप्पावै के 30 पदों का गान करती हैं। चेन्नई संगीत सीज़न इसी मास में होता है — 3,000 से अधिक प्रस्तुतियों के साथ विश्व का सबसे बड़ा सांस्कृतिक उत्सव। मन्दिरों में वैकुण्ठ एकादशी का विशेष उत्सव होता है।',
    sa: 'मार्गळिमासः (मध्यमार्गशीर्षात् मध्यपौषपर्यन्तम्) तमिलपञ्चाङ्गस्य आध्यात्मिकतमः मासः मन्यते। कृष्णः भगवद्गीतायां (१०.३५) वदति "मासानां मार्गशीर्षोऽहम्"।',
    ta: 'மார்கழி (டிசம்பர் நடுப்பகுதி முதல் ஜனவரி நடுப்பகுதி வரை) தமிழ் நாட்காட்டியில் ஆன்மீக ரீதியாக மிகவும் சக்திவாய்ந்த மாதமாக கருதப்படுகிறது. கிருஷ்ணர் பகவத் கீதையில் (10.35) "மாதங்களில் நான் மார்கழி" என்கிறார். "திருப்பாவை" மற்றும் "திருவெம்பாவை" மரபு மார்கழியின் மையமானது — பெண்கள் அதிகாலையில் எழுந்து ஆண்டாளின் திருப்பாவை 30 பாசுரங்களை விஷ்ணு கோயில்களிலும், மாணிக்கவாசகரின் திருவெம்பாவையை சிவன் கோயில்களிலும் பாடுகின்றனர். தமிழ்நாட்டின் தெருக்கள் சூரிய உதயத்திற்கு முன் அரிசி மாவால் வரையப்பட்ட கோலங்களால் உயிர்பெறுகின்றன. செம்பை இசை விழா (டிசம்பர் சீசன்) 300+ இடங்களில் 3,000க்கும் மேற்பட்ட நிகழ்ச்சிகளுடன் உலகின் மிகப்பெரிய கலை விழா. கோயில்களில் வைகுண்ட ஏகாதசி கொண்டாடப்படுகிறது.',
  },
  relatedTitle: {
    en: 'Related Puja Guides & Festivals',
    hi: 'सम्बन्धित पूजा विधि और त्योहार',
    sa: 'सम्बद्धपूजाविधयः पर्वाणि च',
    ta: 'தொடர்புடைய பூஜை வழிகாட்டிகள் & திருவிழாக்கள்',
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
  { month: 'Chithirai', monthTa: 'சித்திரை', en: 'Puthandu (Tamil New Year, Chithirai 1st), Chithirai Thiruvizha (Meenakshi Thirukalyanam at Madurai — 10-day temple festival celebrating the divine marriage of Meenakshi and Sundareshwarar)', hi: 'पुथाण्डु (तमिल नव वर्ष), चित्तिरै तिरुविळा (मदुरै मीनाक्षी तिरुकल्याणम्)', ta: 'புத்தாண்டு (தமிழ் புத்தாண்டு, சித்திரை 1), சித்திரை திருவிழா (மதுரையில் மீனாட்சி திருக்கல்யாணம் — 10 நாள் கோயில் திருவிழா)' },
  { month: 'Vaikasi', monthTa: 'வைகாசி', en: 'Vaikasi Visakam (Lord Murugan\'s birthday — celebrated with grand processions at Palani, Thiruchendur, and all Murugan temples), Agni Nakshatram begins (peak summer heat period)', hi: 'वैकासि विशाखम् (भगवान मुरुगन जयन्ती), अग्नि नक्षत्रम् आरम्भ', ta: 'வைகாசி விசாகம் (முருகப்பெருமான் பிறந்த நாள் — பழனி, திருச்செந்தூர் உள்ளிட்ட அனைத்து முருகன் கோயில்களில் பெரிய ஊர்வலங்கள்), அக்னி நட்சத்திரம் தொடக்கம்' },
  { month: 'Aani', monthTa: 'ஆனி', en: 'Aani Thirumanjanam (grand abhishekam of Lord Nataraja at Chidambaram — one of the most important temple events in Tamil Nadu)', hi: 'आनि तिरुमञ्जनम् (चिदम्बरम् में नटराज अभिषेकम्)', ta: 'ஆனி திருமஞ்சனம் (சிதம்பரத்தில் நடராஜருக்கு பெரிய அபிஷேகம் — தமிழ்நாட்டின் மிக முக்கிய கோயில் நிகழ்வுகளில் ஒன்று)' },
  { month: 'Aadi', monthTa: 'ஆடி', en: 'Aadi Perukku (18th of Aadi — river festival celebrating monsoon abundance), Aadi Pooram (Andal\'s incarnation day), Aadi Fridays (Amman worship)', hi: 'आडि पेरुक्कु (नदी उत्सव), आडि पूरम् (आण्डाल अवतार दिवस), आडि शुक्रवार (अम्मन पूजा)', ta: 'ஆடிப்பெருக்கு (ஆடி 18 — ஆற்றுத் திருவிழா), ஆடிப்பூரம் (ஆண்டாள் அவதார நாள்), ஆடி வெள்ளிக்கிழமை (அம்மன் வழிபாடு)' },
  { month: 'Avani', monthTa: 'ஆவணி', en: 'Avani Avittam (sacred thread ceremony renewal for Brahmins — Upakarma), Krishna Jayanthi (Gokulashtami), Vinayakar Chaturthi', hi: 'आवणि अवित्तम् (उपकर्म), कृष्ण जयन्ती, विनायकर चतुर्थी', ta: 'ஆவணி அவிட்டம் (உபகர்மா — பூணூல் மாற்றும் விழா), கிருஷ்ண ஜெயந்தி (கோகுலாஷ்டமி), விநாயகர் சதுர்த்தி' },
  { month: 'Purattasi', monthTa: 'புரட்டாசி', en: 'Purattasi Saturdays (strict vegetarian observance and Vishnu/Perumal worship for all 4 Saturdays), Navaratri and Vijayadashami (Golu/Kolu display of dolls)', hi: 'पुरट्टासि शनिवार (विष्णु पूजा), नवरात्रि और विजयादशमी (गोलू/कोलू)', ta: 'புரட்டாசி சனிக்கிழமை (கடுமையான சைவ விரதம் மற்றும் பெருமாள் வழிபாடு), நவராத்திரி மற்றும் விஜயதசமி (கொலு வைப்பு)' },
  { month: 'Aippasi', monthTa: 'ஐப்பசி', en: 'Deepavali (Diwali — celebrated on Amavasya of Aippasi), Skanda Sashti (6-day fast honoring Lord Murugan\'s victory over Surapadman)', hi: 'दीपावली, स्कन्द षष्ठी (मुरुगन की विजय का 6-दिवसीय उत्सव)', ta: 'தீபாவளி (ஐப்பசி அமாவாசையில் கொண்டாடப்படுகிறது), ஸ்கந்த சஷ்டி (சூரபத்மனை வென்ற முருகனின் 6 நாள் விரதம்)' },
  { month: 'Karthigai', monthTa: 'கார்த்திகை', en: 'Karthigai Deepam (festival of lights — massive flame lit atop Tiruvannamalai hill, homes lit with rows of oil lamps), Subramanya Sashti', hi: 'कार्तिगै दीपम् (तिरुवण्णामलै शिखर पर विशाल ज्योति), सुब्रमण्य षष्ठी', ta: 'கார்த்திகை தீபம் (திருவண்ணாமலை குன்றின் மீது பெரிய ஜோதி ஏற்றுதல், வீடுகளில் நெய் விளக்குகள் வரிசையாக ஏற்றுதல்), சுப்ரமண்ய சஷ்டி' },
  { month: 'Margazhi', monthTa: 'மார்கழி', en: 'Thiruppavai/Thiruvempavai (30-day dawn devotional singing), Vaikunta Ekadashi (Paramapada Vasal opening at Vishnu temples), Arudra Darshanam (Nataraja\'s cosmic dance celebration)', hi: 'तिरुप्पावै/तिरुवेम्पावै (30 दिन भोर भजन), वैकुण्ठ एकादशी, आरुद्रा दर्शनम्', ta: 'திருப்பாவை/திருவெம்பாவை (30 நாள் அதிகாலை பக்திப் பாடல்), வைகுண்ட ஏகாதசி (விஷ்ணு கோயில்களில் பரமபத வாசல் திறப்பு), ஆருத்ரா தரிசனம் (நடராஜரின் ஆனந்த தாண்டவம்)' },
  { month: 'Thai', monthTa: 'தை', en: 'Thai Pongal (4-day harvest festival — Bhogi, Surya Pongal, Mattu Pongal, Kaanum Pongal), Thai Poosam (Lord Murugan — Kavadi offerings at Batu Caves and Palani)', hi: 'तै पोंगल (4-दिवसीय फसल उत्सव), तै पूसम् (मुरुगन — कावड़ी)', ta: 'தைப்பொங்கல் (4 நாள் அறுவடைத் திருவிழா — போகி, சூரிய பொங்கல், மாட்டுப் பொங்கல், காணும் பொங்கல்), தைப்பூசம் (முருகப்பெருமான் — பழனி, பத்து மலையில் காவடி)' },
  { month: 'Masi', monthTa: 'மாசி', en: 'Masi Magam (sacred bathing in the sea when Moon is in Magha nakshatra — major event at Mahabalipuram and Pondicherry), Maha Shivaratri', hi: 'मासि मगम् (सागर स्नान), महा शिवरात्रि', ta: 'மாசி மகம் (சந்திரன் மக நட்சத்திரத்தில் இருக்கும்போது புனித கடல் நீராடல் — மகாபலிபுரம், புதுச்சேரியில் பெரிய நிகழ்வு), மகா சிவராத்திரி' },
  { month: 'Panguni', monthTa: 'பங்குனி', en: 'Panguni Uthiram (divine marriages celebrated at major temples — Srirangam, Tirupati, Madurai; associated with Uttara Phalguni nakshatra)', hi: 'पंगुनि उत्तिरम् (मन्दिरों में दिव्य विवाह)', ta: 'பங்குனி உத்திரம் (முக்கிய கோயில்களில் தெய்வீகத் திருமணங்கள் — ஸ்ரீரங்கம், திருப்பதி, மதுரை; உத்திர பல்குனி நட்சத்திரத்துடன் தொடர்புடையது)' },
];

const RELATED_LINKS = [
  { slug: 'pongal', en: 'Pongal Puja Vidhi', hi: 'पोंगल पूजा विधि', ta: 'பொங்கல் பூஜை விதி' },
  { slug: 'navaratri', en: 'Navaratri Puja Vidhi', hi: 'नवरात्रि पूजा विधि', ta: 'நவராத்திரி பூஜை விதி' },
  { slug: 'diwali', en: 'Diwali Puja Vidhi', hi: 'दीवाली पूजा विधि', ta: 'தீபாவளி பூஜை விதி' },
  { slug: 'ganesh-chaturthi', en: 'Ganesh Chaturthi Puja', hi: 'गणेश चतुर्थी पूजा', ta: 'விநாயகர் சதுர்த்தி பூஜை' },
  { slug: 'maha-shivaratri', en: 'Maha Shivaratri Puja', hi: 'महा शिवरात्रि पूजा', ta: 'மகா சிவராத்திரி பூஜை' },
  { slug: 'makar-sankranti', en: 'Makar Sankranti / Pongal', hi: 'मकर संक्रांति / पोंगल', ta: 'மகர சங்கராந்தி / பொங்கல்' },
];

export default function TamilCalendarPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  const L = (key: keyof typeof LABELS) => {
    const entry = LABELS[key] as Record<string, string>;
    if (isTamil && entry.ta) return entry.ta;
    return entry[locale] || entry.en;
  };
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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'மாதம்' : isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'தமிழ்' : isHi ? 'तमिल' : 'Tamil'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'ராசி' : isHi ? 'राशि' : 'Rashi (Zodiac)'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'கிரிகோரியன்' : isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isTamil ? 'நாட்கள்' : isHi ? 'दिन' : 'Days'}</th>
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
                {isTamil ? (link.ta || link.en) : isHi ? link.hi : link.en}
              </a>
            ))}
            <a
              href={`/${locale}/calendar`}
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {isTamil ? 'திருவிழா நாட்காட்டி 2026' : isHi ? 'त्योहार कैलेंडर 2026' : 'Festival Calendar 2026'}
            </a>
            <a
              href={`/${locale}/calendar/regional/bengali`}
              className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
            >
              {isTamil ? 'வங்காள நாட்காட்டி (பஞ்சிகா)' : isHi ? 'बंगाली कैलेंडर (पंजिका)' : 'Bengali Calendar (Panjika)'}
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

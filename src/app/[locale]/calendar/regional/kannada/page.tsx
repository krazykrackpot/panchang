'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { pickRegionalChrome as RC } from '@/lib/content/regional-chrome-labels';
import { engineDate as ed, nextUpcoming, todayInIst } from '@/lib/seo/regional-faq-dates';
import { tl } from '@/lib/utils/trilingual';

// FAQ data — page-native (kn) + en + hi. All year-specific dates
// resolve at render via ed(year, festivalKey, locale) against
// festival-generator.ts, so the FAQ schema cannot drift from the
// festival table on the page. Added 2026-06-10 as part of the
// 9-region FAQ-correctness pass.
const FAQ_DATA = [
  {
    q: { en: 'When is Ugadi 2027?', hi: 'उगादि 2027 कब है?', kn: 'ಯುಗಾದಿ 2027 ಯಾವಾಗ?' },
    a: {
      en: `Ugadi (also called Yugadi in Karnataka) 2027 falls on ${ed(2027,'Yugadi (Karnataka)','en')}, on Chaitra Shukla Pratipada. This marks the beginning of the Kannada new year. Traditional rituals include Bevu-Bella (a symbolic mix of neem and jaggery representing life's bitterness and sweetness), oil bath at dawn, new clothes, and Panchangam Sravanam (recitation of the year's almanac predictions).`,
      hi: `उगादि (कर्नाटक में युगादि भी कहा जाता है) 2027 ${ed(2027,'Yugadi (Karnataka)','hi')} को चैत्र शुक्ल प्रतिपदा पर पड़ता है। यह कन्नड़ नव वर्ष का आरम्भ है। पारम्परिक अनुष्ठान: बेवु-बेल्ला (नीम-गुड़, जीवन की कड़वाहट और मिठास का प्रतीक), तेल स्नान, नए वस्त्र, और पंचांगम् श्रवण।`,
      kn: `ಯುಗಾದಿ 2027 ${ed(2027,'Yugadi (Karnataka)','kn')} ರಂದು ಚೈತ್ರ ಶುದ್ಧ ಪಾಡ್ಯಮಿಯಲ್ಲಿ ಬರುತ್ತದೆ. ಇದು ಕನ್ನಡ ಹೊಸ ವರ್ಷದ ಆರಂಭ. ಸಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳು: ಬೇವು-ಬೆಲ್ಲ (ಬೇವು ಮತ್ತು ಬೆಲ್ಲದ ಸಾಂಕೇತಿಕ ಮಿಶ್ರಣ — ಜೀವನದ ಕಹಿ-ಸಿಹಿಯ ಪ್ರತೀಕ), ಬೆಳಗಿನ ಎಣ್ಣೆ ಸ್ನಾನ, ಹೊಸ ಬಟ್ಟೆಗಳು, ಮತ್ತು ಪಂಚಾಂಗ ಶ್ರವಣ.`,
    },
  },
  {
    q: { en: 'When is Ganesha Chaturthi 2026?', hi: 'गणेश चतुर्थी 2026 कब है?', kn: 'ಗಣೇಶ ಚತುರ್ಥಿ 2026 ಯಾವಾಗ?' },
    a: {
      en: `Ganesha Chaturthi 2026 falls on ${ed(2026,'Ganesh Chaturthi','en')}, on Bhadrapada Shukla Chaturthi. In Karnataka, the festival is observed for 11 days starting on Chaturthi and culminating in the immersion (Visarjana) procession. Bangalore, Mysore, and Hubli host major public celebrations. Traditional offerings include modaka and karjikayi.`,
      hi: `गणेश चतुर्थी 2026 ${ed(2026,'Ganesh Chaturthi','hi')} को भाद्रपद शुक्ल चतुर्थी पर पड़ती है। कर्नाटक में 11 दिनों तक मनाई जाती है। बेंगलुरु, मैसूर और हुबली में बड़े सार्वजनिक उत्सव होते हैं। मोदक और करजिकायी मुख्य भोग हैं।`,
      kn: `ಗಣೇಶ ಚತುರ್ಥಿ 2026 ${ed(2026,'Ganesh Chaturthi','kn')} ರಂದು ಭಾದ್ರಪದ ಶುದ್ಧ ಚತುರ್ಥಿಯಲ್ಲಿ ಬರುತ್ತದೆ. ಕರ್ನಾಟಕದಲ್ಲಿ 11 ದಿನಗಳವರೆಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಬೆಂಗಳೂರು, ಮೈಸೂರು ಮತ್ತು ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ ದೊಡ್ಡ ಸಾರ್ವಜನಿಕ ಉತ್ಸವಗಳಾಗುತ್ತವೆ. ಮೋದಕ ಮತ್ತು ಕರಜಿಕಾಯಿ ಮುಖ್ಯ ನೈವೇದ್ಯಗಳು.`,
    },
  },
  {
    q: { en: 'When is Deepavali 2026 in the Kannada calendar?', hi: 'कन्नड़ कैलेंडर में दीपावली 2026 कब है?', kn: 'ಕನ್ನಡ ಪಂಚಾಂಗದಲ್ಲಿ ದೀಪಾವಳಿ 2026 ಯಾವಾಗ?' },
    a: {
      en: `Deepavali 2026 falls on ${ed(2026,'Diwali','en')}, on Kartika Krishna Amavasya. In Karnataka, the celebration spans three days: Naraka Chaturdashi (day before Amavasya), Deepavali Amavasya (main day, oil bath, Lakshmi puja, fireworks), and Bali Padyami (day after). Traditional sweets include obbattu (holige), karjikayi, and chakkuli.`,
      hi: `दीपावली 2026 ${ed(2026,'Diwali','hi')} को कार्तिक कृष्ण अमावस्या पर पड़ती है। कर्नाटक में तीन दिन तक मनाई जाती है: नरक चतुर्दशी (पहले दिन), दीपावली अमावस्या (मुख्य दिन — तेल स्नान, लक्ष्मी पूजा, आतिशबाजी), और बलि पाड्यमि (अगले दिन)। ओब्बट्टु (होलिगे), करजिकायी और चकलि पारम्परिक मिठाइयां हैं।`,
      kn: `ದೀಪಾವಳಿ 2026 ${ed(2026,'Diwali','kn')} ರಂದು ಕಾರ್ತಿಕ ಕೃಷ್ಣ ಅಮಾವಾಸ್ಯೆಯಲ್ಲಿ ಬರುತ್ತದೆ. ಕರ್ನಾಟಕದಲ್ಲಿ ಮೂರು ದಿನಗಳವರೆಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ: ನರಕ ಚತುರ್ದಶಿ, ದೀಪಾವಳಿ ಅಮಾವಾಸ್ಯೆ (ಮುಖ್ಯ ದಿನ — ಎಣ್ಣೆ ಸ್ನಾನ, ಲಕ್ಷ್ಮಿ ಪೂಜೆ, ಪಟಾಕಿ), ಮತ್ತು ಬಲಿ ಪಾಡ್ಯಮಿ. ಒಬ್ಬಟ್ಟು (ಹೋಳಿಗೆ), ಕರಜಿಕಾಯಿ ಮತ್ತು ಚಕ್ಕುಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಸಿಹಿತಿಂಡಿಗಳು.`,
    },
  },
  {
    q: { en: 'When is Maha Shivaratri 2027?', hi: 'महा शिवरात्रि 2027 कब है?', kn: 'ಮಹಾ ಶಿವರಾತ್ರಿ 2027 ಯಾವಾಗ?' },
    a: {
      en: `Maha Shivaratri 2027 falls on ${ed(2027,'Maha Shivaratri','en')}, on Phalguna Krishna Chaturdashi. Devotees observe an all-night vigil at Shiva temples; in Karnataka, major celebrations take place at Murudeshwara, Gokarna, and the Sri Manjunatha Swamy temple at Dharmasthala. The night is marked by abhisheka, bilva leaves offerings, and continuous chanting.`,
      hi: `महा शिवरात्रि 2027 ${ed(2027,'Maha Shivaratri','hi')} को फाल्गुन कृष्ण चतुर्दशी पर पड़ती है। भक्त शिव मन्दिरों में रात्रि जागरण करते हैं; कर्नाटक में मुरुदेश्वर, गोकर्ण और श्री मंजुनाथ स्वामी मन्दिर (धर्मस्थल) में बड़े उत्सव होते हैं।`,
      kn: `ಮಹಾ ಶಿವರಾತ್ರಿ 2027 ${ed(2027,'Maha Shivaratri','kn')} ರಂದು ಫಾಲ್ಗುಣ ಕೃಷ್ಣ ಚತುರ್ದಶಿಯಲ್ಲಿ ಬರುತ್ತದೆ. ಭಕ್ತರು ಶಿವ ದೇವಾಲಯಗಳಲ್ಲಿ ರಾತ್ರಿ ಜಾಗರಣೆ ಮಾಡುತ್ತಾರೆ; ಕರ್ನಾಟಕದಲ್ಲಿ ಮುರುಡೇಶ್ವರ, ಗೋಕರ್ಣ ಮತ್ತು ಧರ್ಮಸ್ಥಳದ ಶ್ರೀ ಮಂಜುನಾಥ ಸ್ವಾಮಿ ದೇವಾಲಯದಲ್ಲಿ ದೊಡ್ಡ ಉತ್ಸವಗಳಾಗುತ್ತವೆ.`,
    },
  },
  {
    q: { en: 'What is the Kannada Panchanga?', hi: 'कन्नड़ पंचांग क्या है?', kn: 'ಕನ್ನಡ ಪಂಚಾಂಗ ಎಂದರೇನು?' },
    a: {
      en: 'The Kannada Panchanga is the traditional lunisolar almanac used by Kannada-speaking people. It follows the Chandramana (lunar) system — months run from one Amavasya (new moon) to the next, and the year begins on Yugadi (Chaitra Shukla Pratipada, typically late March or early April). The Panchanga tracks five daily elements: Tithi, Vara, Nakshatra, Yoga, and Karana. It is essential for determining auspicious timings (Muhurta) for weddings, housewarming, business openings, and religious observances. Famous traditional Panchangas include the Mysore Sthana Panchanga and Bangalore-published almanacs.',
      hi: 'कन्नड़ पंचांग कन्नड़ भाषियों द्वारा उपयोग किया जाने वाला पारम्परिक चान्द्रसौर पंचांग है। यह चान्द्रमान प्रणाली का अनुसरण करता है — मास अमावस्या से अमावस्या तक चलते हैं, और वर्ष युगादि (चैत्र शुक्ल प्रतिपदा) पर आरम्भ होता है। दैनिक पांच तत्व: तिथि, वार, नक्षत्र, योग, और करण। विवाह, गृहप्रवेश और सभी धार्मिक अनुष्ठानों के लिए मुहूर्त निर्धारित करने के लिए आवश्यक।',
      kn: 'ಕನ್ನಡ ಪಂಚಾಂಗವು ಕನ್ನಡ ಭಾಷಿಗರು ಬಳಸುವ ಸಾಂಪ್ರದಾಯಿಕ ಚಾಂದ್ರಮಾನ ಪಂಚಾಂಗ. ಚಾಂದ್ರಮಾನ ಪದ್ಧತಿಯನ್ನು ಅನುಸರಿಸುತ್ತದೆ — ತಿಂಗಳುಗಳು ಅಮಾವಾಸ್ಯೆಯಿಂದ ಅಮಾವಾಸ್ಯೆಗೆ ನಡೆಯುತ್ತವೆ, ಮತ್ತು ವರ್ಷ ಯುಗಾದಿಯಿಂದ (ಚೈತ್ರ ಶುದ್ಧ ಪಾಡ್ಯಮಿ) ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ದೈನಿಕ ಐದು ಅಂಶಗಳು: ತಿಥಿ, ವಾರ, ನಕ್ಷತ್ರ, ಯೋಗ, ಮತ್ತು ಕರಣ. ವಿವಾಹ, ಗೃಹ ಪ್ರವೇಶ ಮತ್ತು ಎಲ್ಲಾ ಧಾರ್ಮಿಕ ಆಚರಣೆಗಳಿಗೆ ಮುಹೂರ್ತ ನಿರ್ಧಾರಕ್ಕೆ ಅಗತ್ಯ.',
    },
  },
];

const LABELS = {
  title: {
    en: 'Kannada Calendar (Chandramana Panchangam)',
    hi: 'कन्नड़ कैलेंडर (चन्द्रमान पंचांगम्)',
    kn: 'ಕನ್ನಡ ಪಂಚಾಂಗ (ಚಂದ್ರಮಾನ ಪಂಚಾಂಗ)',
    ta: 'கன்னட நாட்காட்டி (சந்திரமான பஞ்சாங்கம்)',
    te: 'కన్నడ క్యాలెండర్ (చంద్రమాన పంచాంగం)',
    bn: 'কন্নড় ক্যালেন্ডার (চন্দ্রমান পঞ্চাঙ্গম)',
    gu: 'કન્નડ કૅલૅન્ડર (ચંદ્રમાન પંચાંગ)',
  },
  intro: {
    en: 'The Kannada Panchangam is a lunisolar calendar used by approximately 45 million Kannada speakers in Karnataka. Like the Telugu calendar, it follows the Chandramana (lunar) tradition — months run from one New Moon to the next in the Amanta system, and the year begins on Ugadi (Chaitra Shukla Pratipada), the same day as the Telugu New Year. The Kannada calendar uses the same 12 Sanskrit lunar month names as the Telugu and North Indian systems. What distinguishes Karnataka\'s calendar culture is the regional emphasis on Dasara (Mysore Dasara being one of India\'s greatest royal festivals) and Varamahalakshmi Vratam, a women\'s festival that holds special prominence in Karnataka.',
    hi: 'कन्नड़ पंचांगम् एक चान्द्र-सौर कैलेंडर है जिसका उपयोग कर्नाटक में लगभग 4.5 करोड़ कन्नड़ भाषियों द्वारा किया जाता है। तेलुगु कैलेंडर की तरह, यह चान्द्रमान (चन्द्र) परम्परा का पालन करता है — मास अमान्त प्रणाली में एक अमावस्या से अगली तक चलते हैं, और वर्ष उगादि (चैत्र शुक्ल प्रतिपदा) पर शुरू होता है। कर्नाटक की पंचांग संस्कृति में दशहरा (मैसूर दशहरा — भारत के महानतम राजसी उत्सवों में से एक) और वरमहालक्ष्मी व्रतम् का विशेष महत्व है।',
    kn: 'ಕನ್ನಡ ಪಂಚಾಂಗ ಕರ್ನಾಟಕದಲ್ಲಿ ಸುಮಾರು 4.5 ಕೋಟಿ ಕನ್ನಡ ಮಾತನಾಡುವವರು ಬಳಸುವ ಚಂದ್ರಮಾನ ಪಂಚಾಂಗ. ತೆಲುಗು ಪಂಚಾಂಗದಂತೆ, ಇದು ಚಂದ್ರಮಾನ ಸಂಪ್ರದಾಯವನ್ನು ಅನುಸರಿಸುತ್ತದೆ — ಮಾಸಗಳು ಅಮಾಂತ ಪದ್ಧತಿಯಲ್ಲಿ ಒಂದು ಅಮಾವಾಸ್ಯೆಯಿಂದ ಮುಂದಿನ ಅಮಾವಾಸ್ಯೆಯವರೆಗೆ ನಡೆಯುತ್ತವೆ, ಮತ್ತು ವರ್ಷ ಉಗಾದಿಯಲ್ಲಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
  },
  monthsTitle: {
    en: 'The 12 Kannada Months',
    hi: '12 कन्नड़ मास',
    kn: '12 ಕನ್ನಡ ತಿಂಗಳುಗಳು',
    ta: '12 கன்னட மாதங்கள்',
    te: '12 కన్నడ నెలలు',
    bn: '১২টি কন্নড় মাস',
    gu: '12 કન્નડ મહિના',
  },
  monthsIntro: {
    en: 'Kannada months use the same Sanskrit lunar month names as the broader South Indian Panchangam tradition. Each month runs from the day after Amavasya (New Moon) to the following Amavasya. An intercalary Adhika Masa is added approximately every 33 months to synchronise the lunar year with the solar cycle.',
    hi: 'कन्नड़ मास व्यापक दक्षिण भारतीय पंचांग परम्परा के समान संस्कृत चान्द्र मास नामों का उपयोग करते हैं। प्रत्येक मास अमावस्या के अगले दिन से अगली अमावस्या तक चलता है।',
    kn: 'ಕನ್ನಡ ಮಾಸಗಳು ವ್ಯಾಪಕ ದಕ್ಷಿಣ ಭಾರತದ ಪಂಚಾಂಗ ಸಂಪ್ರದಾಯದ ಅದೇ ಸಂಸ್ಕೃತ ಚಂದ್ರ ಮಾಸ ಹೆಸರುಗಳನ್ನು ಬಳಸುತ್ತವೆ. ಪ್ರತಿ ಮಾಸ ಅಮಾವಾಸ್ಯೆ ನಂತರದ ದಿನದಿಂದ ಮುಂದಿನ ಅಮಾವಾಸ್ಯೆಯವರೆಗೆ ನಡೆಯುತ್ತದೆ.',
  },
  festivalsTitle: {
    en: 'Major Kannada Festivals',
    hi: 'प्रमुख कन्नड़ त्योहार',
    kn: 'ಪ್ರಮುಖ ಕನ್ನಡ ಹಬ್ಬಗಳು',
    ta: 'முக்கிய கன்னட திருவிழாக்கள்',
    te: 'ముఖ్యమైన కన్నడ పండుగలు',
    bn: 'প্রধান কন্নড় উৎসব',
    gu: 'મુખ્ય કન્નડ તહેવારો',
  },
  ugadiTitle: {
    en: 'Ugadi — Kannada New Year',
    hi: 'उगादि — कन्नड़ नव वर्ष',
    kn: 'ಉಗಾದಿ — ಕನ್ನಡ ಹೊಸ ವರ್ಷ',
  },
  ugadiText: {
    en: 'Ugadi is celebrated identically in Karnataka and Andhra Pradesh/Telangana, both marking Chaitra Shukla Pratipada as the new year. In Karnataka, the day begins with an oil bath, prayers, and the preparation of Ugadi Pachadi — the six-taste chutney of raw mango, jaggery, neem flowers, tamarind, green chilli, and salt. The Panchangam Shravanam (new year almanac recitation) is performed at temples and homes, where priests predict the year\'s outcomes based on the reigning Samvatsara (one of 60 named years in the Jovian cycle), the ruling planet\'s influence, rainfall, and agricultural prospects. Kannada Ugadi celebrations are known for their emphasis on literary and cultural programs — poetry readings, Kannada drama performances, and concerts — reflecting Karnataka\'s deep literary tradition (the state has produced more Jnanpith Award winners than any other Indian state).',
    hi: 'उगादि कर्नाटक और आन्ध्र प्रदेश/तेलंगाना दोनों में एक ही प्रकार से मनाया जाता है। कर्नाटक में, दिन का आरम्भ तेल स्नान, प्रार्थना और उगादि पचड़ी — कच्चे आम, गुड़, नीम के फूल, इमली, हरी मिर्च और नमक की छह-स्वाद चटनी से होता है। पंचांग श्रवणम् मन्दिरों और घरों में किया जाता है। कन्नड़ उगादि उत्सव साहित्यिक और सांस्कृतिक कार्यक्रमों पर जोर देने के लिए जाने जाते हैं — कर्नाटक ने किसी भी अन्य भारतीय राज्य से अधिक ज्ञानपीठ पुरस्कार विजेता दिए हैं।',
    kn: 'ಉಗಾದಿ ಕರ್ನಾಟಕ ಮತ್ತು ಆಂಧ್ರಪ್ರದೇಶ/ತೆಲಂಗಾಣ ಎರಡರಲ್ಲೂ ಒಂದೇ ರೀತಿ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಕರ್ನಾಟಕದಲ್ಲಿ ತೈಲಾಭ್ಯಂಗ, ಪ್ರಾರ್ಥನೆ ಮತ್ತು ಉಗಾದಿ ಪಚ್ಚಡಿ — ಕಚ್ಚಾ ಮಾವು, ಬೆಲ್ಲ, ಬೇವಿನ ಹೂ, ಹುಣಸೆ, ಹಸಿ ಮೆಣಸಿನಕಾಯಿ, ಉಪ್ಪು ಇರುವ ಆರು ರುಚಿಯ ಚಟ್ನಿ. ಕನ್ನಡ ಉಗಾದಿ ಸಾಹಿತ್ಯಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಹೆಸರುವಾಸಿ — ಕರ್ನಾಟಕ ಅತ್ಯಧಿಕ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ವಿಜೇತರನ್ನು ನೀಡಿದ ರಾಜ್ಯ.',
  },
  mysoreTitle: {
    en: 'Mysore Dasara — Karnataka\'s Royal Festival',
    hi: 'मैसूर दशहरा — कर्नाटक का राजसी उत्सव',
    kn: 'ಮೈಸೂರು ದಸರಾ — ಕರ್ನಾಟಕದ ರಾಜಮನೆತನದ ಹಬ್ಬ',
  },
  mysoreText: {
    en: 'The Mysore Dasara is one of India\'s most spectacular festivals, celebrated over 10 days culminating on Vijayadashami (Ashvija Shukla Dashami — September/October). It commemorates the goddess Chamundeshwari\'s (Durga\'s) victory over the demon Mahishasura, for whom Mysore (Mahishuru) is named. The Mysore Palace is illuminated with 100,000 light bulbs every evening for 10 nights. The Jumboo Savari procession on the final day is the centrepiece: a magnificently decorated elephant carries the golden howdah (Ambari) bearing the image of Goddess Chamundeshwari through the streets of Mysore, accompanied by caparisoned elephants, cavalry, marching bands, tableaux from all districts of Karnataka, and a torchlight parade at night. The Karnataka government organises a 10-day cultural programme called "Dasara Exhibitions" with folk arts, classical music, dance performances, and the Dasara Kavi Sammelana (poets\' gathering). Dasara weekend draws over a million visitors to Mysore.',
    hi: 'मैसूर दशहरा भारत के सबसे भव्य उत्सवों में से एक है, जो 10 दिनों तक विजयादशमी (आश्विज शुक्ल दशमी) पर समाप्त होता है। मैसूर पैलेस को हर शाम 10 रातों के लिए 1,00,000 बल्बों से रोशन किया जाता है। अन्तिम दिन का जम्बू सवारी जुलूस केन्द्रबिन्दु है — एक शानदार सजे हाथी पर सोने की हौदा (अम्बारी) में देवी चामुण्डेश्वरी की प्रतिमा।',
    kn: 'ಮೈಸೂರು ದಸರಾ ಭಾರತದ ಅತ್ಯಂತ ಅದ್ಭುತ ಹಬ್ಬಗಳಲ್ಲಿ ಒಂದು, 10 ದಿನ ವಿಜಯದಶಮಿಯಂದು ಮುಕ್ತಾಯ. ಮೈಸೂರು ಅರಮನೆ ಪ್ರತಿ ಸಂಜೆ 1,00,000 ವಿದ್ಯುತ್ ದೀಪಗಳಿಂದ ಬೆಳಗುತ್ತದೆ. ಜಂಬೂ ಸವಾರಿ ಮೆರವಣಿಗೆ ಕೇಂದ್ರಬಿಂದು — ಅಲಂಕೃತ ಆನೆ ಮೇಲೆ ಚಿನ್ನದ ಅಂಬಾರಿ ಹೊತ್ತು ಚಾಮುಂಡೇಶ್ವರಿ ಮೆರವಣಿಗೆ.',
  },
  calendarTitle: {
    en: 'Calendar Characteristics',
    hi: 'कैलेंडर विशेषताएँ',
    kn: 'ಪಂಚಾಂಗ ಲಕ್ಷಣಗಳು',
    ta: 'நாட்காட்டி சிறப்பியல்புகள்',
    te: 'పంచాంగ లక్షణాలు',
    bn: 'পঞ্জিকার বৈশিষ্ট্য',
    gu: 'પંચાંગ લક્ષણો',
  },
  calendarText: {
    en: 'The Kannada Chandramana Panchangam is lunisolar: months are lunar (Amanta system, New Moon to New Moon), recalibrated with the solar cycle via Adhika Masa every ~33 months. Karnataka uses the same 60-year Jovian cycle as the rest of South India (Prabhava through Akshaya), and each year\'s character is assessed at Ugadi based on the ruling planet. The Kannada Panchangam is used for muhurta determination, tithi-based vrats, and the agricultural calendar of the Deccan. A notable feature of Karnataka\'s calendar tradition is the "Varamahalakshmi Vratam" — observed on the Friday before Shravana Purnima, when women worship Goddess Lakshmi by installing a decorated kalasha and performing elaborate puja. Unlike Maharashtra where Ganapati Utsav dominates, and unlike Tamil Nadu where the Murugan tradition is paramount, Karnataka\'s religious calendar is characterised by the balance of Shaiva (Shiva worship), Vaishnava (particularly the Madhva Brahmin tradition of Udupi), and Shakta (Chamundeshwari, Renuka Devi) traditions.',
    hi: 'कन्नड़ चन्द्रमान पंचांगम् चान्द्र-सौर है: मास चान्द्र हैं (अमान्त प्रणाली), हर ~33 माह में अधिक मास के साथ पुनर्कैलिब्रेट किया जाता है। कर्नाटक वही 60-वर्षीय गुरु चक्र का उपयोग करता है जो शेष दक्षिण भारत में है। "वरमहालक्ष्मी व्रतम्" — श्रावण पूर्णिमा से पहले शुक्रवार को मनाया जाता है। कर्नाटक का धार्मिक कैलेंडर शैव, वैष्णव (विशेष रूप से उडुपी की माधव ब्राह्मण परम्परा) और शाक्त परम्पराओं के संतुलन से चिह्नित है।',
    kn: 'ಕನ್ನಡ ಚಂದ್ರಮಾನ ಪಂಚಾಂಗ ಚಾಂದ್ರ-ಸೌರ: ಮಾಸಗಳು ಚಂದ್ರ (ಅಮಾಂತ ಪದ್ಧತಿ), ~33 ತಿಂಗಳಿಗೊಮ್ಮೆ ಅಧಿಕ ಮಾಸ ಸೇರಿಸಿ ಸೌರ ಚಕ್ರದೊಂದಿಗೆ ಮರುಹೊಂದಾಣಿಕೆ. "ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ" — ಶ್ರಾವಣ ಪೂರ್ಣಿಮೆ ಮೊದಲ ಶುಕ್ರವಾರ. ಕರ್ನಾಟಕದ ಧಾರ್ಮಿಕ ಪಂಚಾಂಗ ಶೈವ, ವೈಷ್ಣವ (ಉಡುಪಿ ಮಾಧ್ವ ಸಂಪ್ರದಾಯ) ಮತ್ತು ಶಾಕ್ತ ಸಂಪ್ರದಾಯಗಳ ಸಮತೋಲನದಿಂದ ಗುರುತಿಸಲ್ಪಡುತ್ತದೆ.',
  },
};

const KANNADA_MONTHS = [
  { name: 'Chaitra', kannada: 'ಚೈತ್ರ', nameHi: 'चैत्र', rashi: 'Mesha–Vrishabha', gregorian: 'Mar – Apr' },
  { name: 'Vaishakha', kannada: 'ವೈಶಾಖ', nameHi: 'वैशाख', rashi: 'Vrishabha–Mithuna', gregorian: 'Apr – May' },
  { name: 'Jyeshtha', kannada: 'ಜ್ಯೇಷ್ಠ', nameHi: 'ज्येष्ठ', rashi: 'Mithuna–Kataka', gregorian: 'May – Jun' },
  { name: 'Ashadha', kannada: 'ಆಷಾಢ', nameHi: 'आषाढ', rashi: 'Kataka–Simha', gregorian: 'Jun – Jul' },
  { name: 'Shravana', kannada: 'ಶ್ರಾವಣ', nameHi: 'श्रावण', rashi: 'Simha–Kanya', gregorian: 'Jul – Aug' },
  { name: 'Bhadrapada', kannada: 'ಭಾದ್ರಪದ', nameHi: 'भाद्रपद', rashi: 'Kanya–Tula', gregorian: 'Aug – Sep' },
  { name: 'Ashvija', kannada: 'ಆಶ್ವಯುಜ', nameHi: 'आश्विन', rashi: 'Tula–Vrischika', gregorian: 'Sep – Oct' },
  { name: 'Kartika', kannada: 'ಕಾರ್ತಿಕ', nameHi: 'कार्तिक', rashi: 'Vrischika–Dhanus', gregorian: 'Oct – Nov' },
  { name: 'Margashira', kannada: 'ಮಾರ್ಗಶಿರ', nameHi: 'मार्गशीर्ष', rashi: 'Dhanus–Makara', gregorian: 'Nov – Dec' },
  { name: 'Pushya', kannada: 'ಪುಷ್ಯ', nameHi: 'पौष', rashi: 'Makara–Kumbha', gregorian: 'Dec – Jan' },
  { name: 'Magha', kannada: 'ಮಾಘ', nameHi: 'माघ', rashi: 'Kumbha–Meena', gregorian: 'Jan – Feb' },
  { name: 'Phalguna', kannada: 'ಫಾಲ್ಗುಣ', nameHi: 'फाल्गुन', rashi: 'Meena–Mesha', gregorian: 'Feb – Mar' },
];

const FESTIVALS = [
  { month: 'Chaitra', en: 'Ugadi (Kannada–Telugu New Year, Chaitra Shukla Pratipada — Ugadi Pachadi, Panchangam Shravanam)', hi: 'उगादि (कन्नड़-तेलुगु नव वर्ष — उगादि पचड़ी, पंचांग श्रवणम्)', kn: 'ಉಗಾದಿ (ಕನ್ನಡ-ತೆಲುಗು ಹೊಸ ವರ್ಷ — ಉಗಾದಿ ಪಚ್ಚಡಿ, ಪಂಚಾಂಗ ಶ್ರವಣ)' },
  { month: 'Shravana', en: 'Varamahalakshmi Vratam (Friday before Shravana Purnima — Karnataka\'s most important women\'s festival; decorated kalasha worship of Goddess Lakshmi)', hi: 'वरमहालक्ष्मी व्रतम् (श्रावण पूर्णिमा से पहले शुक्रवार — देवी लक्ष्मी की अलंकृत कलश पूजा)', kn: 'ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ (ಶ್ರಾವಣ ಪೂರ್ಣಿಮೆ ಮೊದಲ ಶುಕ್ರವಾರ — ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಮಹತ್ವದ ಮಹಿಳಾ ಹಬ್ಬ)' },
  { month: 'Bhadrapada', en: 'Ganesha Chaturthi (Bhadrapada Shukla Chaturthi — 10-day festival with clay idols, immersion on Ananta Chaturdashi)', hi: 'गणेश चतुर्थी (भाद्रपद शुक्ल चतुर्थी — 10-दिवसीय उत्सव, अनन्त चतुर्दशी को विसर्जन)', kn: 'ಗಣೇಶ ಚತುರ್ಥಿ (ಭಾದ್ರಪದ ಶುಕ್ಲ ಚತುರ್ಥಿ — 10 ದಿನದ ಹಬ್ಬ)' },
  { month: 'Ashvija', en: 'Mysore Dasara / Navaratri (9-night celebration culminating in Vijayadashami — Mysore Palace illumination, Jumboo Savari elephant procession, Karnataka\'s state festival)', hi: 'मैसूर दशहरा / नवरात्रि (विजयादशमी पर समाप्त — मैसूर पैलेस रोशनी, जम्बू सवारी हाथी जुलूस, कर्नाटक का राज्य उत्सव)', kn: 'ಮೈಸೂರು ದಸರಾ / ನವರಾತ್ರಿ (ವಿಜಯದಶಮಿಯಂದು ಮುಕ್ತಾಯ — ಮೈಸೂರು ಅರಮನೆ ದೀಪಾಲಂಕಾರ, ಜಂಬೂ ಸವಾರಿ)' },
  { month: 'Kartika', en: 'Deepavali (Kartika Amavasya), Kartika Deepotsava (lamp festivals at Shaiva temples, especially Dharmasthala)', hi: 'दीपावली (कार्तिक अमावस्या), कार्तिक दीपोत्सव (धर्मस्थल सहित शैव मन्दिरों में दीप उत्सव)', kn: 'ದೀಪಾವಳಿ (ಕಾರ್ತಿಕ ಅಮಾವಾಸ್ಯೆ), ಕಾರ್ತಿಕ ದೀಪೋತ್ಸವ (ಧರ್ಮಸ್ಥಳ ಸೇರಿದಂತೆ ಶೈವ ದೇವಾಲಯಗಳಲ್ಲಿ ದೀಪ ಉತ್ಸವ)' },
];

// ═══════════════════════════════════════════════════════════════════════════
// Karnataka festival dates — resolved at render via the panchang engine so
// each entry shows its NEXT upcoming occurrence. Engine keys are matched
// (case-insensitive, exact-then-substring) against
// `src/lib/calendar/festival-defs.ts` canonical English names.
// ═══════════════════════════════════════════════════════════════════════════
interface KannadaFestival { en: string; hi: string; kn: string; engineKey: string; tithi: string }
const KANNADA_FESTIVALS: KannadaFestival[] = [
  { en: 'Makar Sankranti / Sankranthi',                hi: 'मकर संक्रान्ति / संक्रान्ति',           kn: 'ಮಕರ ಸಂಕ್ರಾಂತಿ',                            engineKey: 'Makar Sankranti',                  tithi: 'Pausha (Solar — Capricorn ingress)' },
  { en: 'Ratha Saptami',                                hi: 'रथ सप्तमी',                             kn: 'ರಥ ಸಪ್ತಮಿ',                                engineKey: 'Ratha Saptami',                    tithi: 'Magha Shukla Saptami' },
  { en: 'Maha Shivaratri',                              hi: 'महा शिवरात्रि',                          kn: 'ಮಹಾ ಶಿವರಾತ್ರಿ',                            engineKey: 'Maha Shivaratri',                  tithi: 'Phalguna Krishna Chaturdashi' },
  { en: 'Holi',                                         hi: 'होली',                                  kn: 'ಹೋಳಿ',                                      engineKey: 'Holi',                              tithi: 'Phalguna Purnima' },
  { en: 'Yugadi / Ugadi (Kannada New Year)',            hi: 'युगादि / उगादि (कन्नड़ नव वर्ष)',         kn: 'ಯುಗಾದಿ / ಉಗಾದಿ (ಕನ್ನಡ ಹೊಸ ವರ್ಷ)',           engineKey: 'Yugadi (Karnataka)',               tithi: 'Chaitra Shukla Pratipada' },
  { en: 'Sri Rama Navami',                              hi: 'श्री राम नवमी',                         kn: 'ಶ್ರೀ ರಾಮ ನವಮಿ',                            engineKey: 'Ram Navami',                       tithi: 'Chaitra Shukla Navami' },
  { en: 'Hanuman Jayanti',                              hi: 'हनुमान जयन्ती',                         kn: 'ಹನುಮಂತ ಜಯಂತಿ',                              engineKey: 'Hanuman Jayanti',                  tithi: 'Chaitra Purnima' },
  { en: 'Akshaya Tritiya',                              hi: 'अक्षय तृतीया',                          kn: 'ಅಕ್ಷಯ ತೃತೀಯ',                              engineKey: 'Akshaya Tritiya',                  tithi: 'Vaishakha Shukla Tritiya' },
  { en: 'Vat Savitri Vrat',                             hi: 'वट सावित्री व्रत',                      kn: 'ವಟ ಸಾವಿತ್ರಿ ವ್ರತ',                          engineKey: 'Vat Savitri Vrat',                 tithi: 'Jyeshtha Purnima' },
  { en: 'Naga Panchami',                                hi: 'नाग पंचमी',                             kn: 'ನಾಗ ಪಂಚಮಿ',                                engineKey: 'Nag Panchami',                     tithi: 'Shravana Shukla Panchami' },
  { en: 'Varamahalakshmi Vratam',                       hi: 'वरमहालक्ष्मी व्रतम्',                   kn: 'ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ',                        engineKey: 'Varalakshmi Vratam',               tithi: 'Friday before Shravana Purnima' },
  { en: 'Krishna Janmashtami',                          hi: 'कृष्ण जन्माष्टमी',                      kn: 'ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ',                          engineKey: 'Janmashtami',                      tithi: 'Bhadrapada Krishna Ashtami' },
  { en: 'Ganesha Chaturthi',                            hi: 'गणेश चतुर्थी',                          kn: 'ಗಣೇಶ ಚತುರ್ಥಿ',                              engineKey: 'Ganesh Chaturthi',                 tithi: 'Bhadrapada Shukla Chaturthi' },
  { en: 'Mahalaya Amavasya',                            hi: 'महालया अमावस्या',                       kn: 'ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ',                          engineKey: 'Mahalaya (Sarva Pitru Amavasya)',  tithi: 'Bhadrapada Amavasya' },
  { en: 'Navaratri begins (Ghatasthapana)',             hi: 'नवरात्रि आरम्भ (घटस्थापना)',            kn: 'ನವರಾತ್ರಿ ಆರಂಭ (ಘಟಸ್ಥಾಪನೆ)',                 engineKey: 'Ghatasthapana (Navratri Day 1)',   tithi: 'Ashvija Shukla Pratipada' },
  { en: 'Ayudha Puja (Mahanavami)',                     hi: 'आयुध पूजा (महानवमी)',                   kn: 'ಆಯುಧ ಪೂಜೆ (ಮಹಾನವಮಿ)',                      engineKey: 'Maha Navami',                      tithi: 'Ashvija Shukla Navami' },
  { en: 'Mysore Dasara / Vijayadashami',                hi: 'मैसूर दशहरा / विजयदशमी',                kn: 'ಮೈಸೂರು ದಸರಾ / ವಿಜಯದಶಮಿ',                   engineKey: 'Sindoor Khela / Vijaya Dashami',   tithi: 'Ashvija Shukla Dashami' },
  { en: 'Naraka Chaturdashi',                           hi: 'नरक चतुर्दशी',                          kn: 'ನರಕ ಚತುರ್ದಶಿ',                             engineKey: 'Narak Chaturdashi',                tithi: 'Kartika Krishna Chaturdashi' },
  { en: 'Deepavali / Lakshmi Puja',                     hi: 'दीपावली / लक्ष्मी पूजा',                 kn: 'ದೀಪಾವಳಿ / ಲಕ್ಷ್ಮಿ ಪೂಜೆ',                    engineKey: 'Diwali',                           tithi: 'Kartika Krishna Amavasya' },
  { en: 'Bali Padyami',                                 hi: 'बलि पाड्यमी',                           kn: 'ಬಲಿ ಪಾಡ್ಯಮಿ',                              engineKey: 'Bali Padyami',                     tithi: 'Kartika Shukla Pratipada' },
  { en: 'Tulsi Vivah',                                  hi: 'तुलसी विवाह',                           kn: 'ತುಳಸಿ ವಿವಾಹ',                              engineKey: 'Tulsi Vivah',                      tithi: 'Kartika Shukla Dwadashi' },
  { en: 'Karthika Pournami / Tripurari Purnima',        hi: 'कार्तिक पूर्णिमा / त्रिपुरारी पूर्णिमा',   kn: 'ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮಾ / ತ್ರಿಪುರಾರಿ ಪೂರ್ಣಿಮಾ',     engineKey: 'Tripurari Purnima',                tithi: 'Kartika Shukla Purnima' },
  { en: 'Subramanya Shashthi (Skanda Shashthi)',        hi: 'सुब्रह्मण्य षष्ठी (स्कन्द षष्ठी)',         kn: 'ಸುಬ್ರಹ್ಮಣ್ಯ ಷಷ್ಠಿ (ಸ್ಕಂದ ಷಷ್ಠಿ)',           engineKey: 'Skanda Shashthi',                  tithi: 'Margashira Shukla Shashthi' },
  { en: 'Vaikuntha Ekadashi (Gita Jayanti)',            hi: 'वैकुण्ठ एकादशी (गीता जयन्ती)',          kn: 'ವೈಕುಂಠ ಏಕಾದಶಿ (ಗೀತಾ ಜಯಂತಿ)',                engineKey: 'Gita Jayanti',                     tithi: 'Margashira Shukla Ekadashi' },
];

// ── Mysore Dasara 10-day chronology ──
const MYSORE_DASARA_DAYS: Array<{ day: string; tithi: string; observance: string }> = [
  { day: 'Day 1', tithi: 'Shukla Pratipada', observance: 'Ghatasthapana — installation of the kalasha and family deity puja inside the palace.' },
  { day: 'Days 2–3', tithi: 'Shukla Dvitiya–Tritiya', observance: 'Continuation of Devi Mahatmyam recitation; nightly palace illumination (~100,000 light bulbs).' },
  { day: 'Days 4–6', tithi: 'Shukla Chaturthi–Shashthi', observance: 'Cultural programmes — Carnatic music, classical dance, wrestling at the palace grounds.' },
  { day: 'Day 7', tithi: 'Shukla Saptami', observance: 'Saraswati Puja — the Maharaja venerates Saraswati and Mahishasuramardhini.' },
  { day: 'Day 8', tithi: 'Shukla Ashtami', observance: 'Durga Ashtami.' },
  { day: 'Day 9', tithi: 'Mahanavami', observance: 'Ayudha Puja — the royal sword is worshipped and taken out in procession.' },
  { day: 'Day 10', tithi: 'Vijayadashami', observance: 'Jamboo Savari — the great procession from the palace to Bannimantap; the Chamundeshwari idol travels in a ~750 kg golden mantapa on the back of a lead elephant; Banni mara puja at Bannimantap recalls the Pandavas’ Shami-tree concealment.' },
];

// ── Karnataka sampradaya festival emphasis ──
const KANNADA_SAMPRADAYAS: Array<{ name: string; founder: string; centre: string; signature: string; almanacs: string }> = [
  { name: 'Madhva (Dvaita)', founder: 'Madhvacharya, 13th c.', centre: 'Vishnu / Narayana with consort Lakshmi', signature: 'Madhva Navami (Magha Shukla Navami), Krishna Janmashtami, Sri Krishna Paryaya at Udupi, Madhva Jayanti.', almanacs: 'Uttaradi Matha, Sri Vyasaraja Matha, Sri Raghavendra Matha' },
  { name: 'Smarta (Pancayatana)', founder: 'Adi Shankara codification', centre: 'Five deities — Vishnu, Shiva, Durga, Surya, Ganesha — as expressions of one Brahman', signature: 'Ganesha Chaturthi, Maha Shivaratri, Navaratri / Vijayadashami, Krishna Janmashtami, Deepavali.', almanacs: 'Sringeri Panchanga' },
  { name: 'Veerashaiva (Lingayata)', founder: '12th-century vachana movement (Basavanna)', centre: 'Shiva, mediated through the ishtalinga', signature: 'Maha Shivaratri, Basava Jayanti (Vaishakha Shukla Tritiya), Allamaprabhu Jayanti, Jangama-aradhane.', almanacs: 'Various Veerashaiva matha calendars' },
];

// ── Kannada 60-year samvatsara cycle 2026–2030 ──
const KANNADA_YEARS: Array<{ year: number; samvatsara: string; shaka: string; yugadiNote: string }> = [
  { year: 2026, samvatsara: 'Parabhava', shaka: '1948', yugadiNote: '19 March 2026 — current year' },
  { year: 2027, samvatsara: 'Plavanga', shaka: '1949', yugadiNote: 'engine — Yugadi early April 2027' },
  { year: 2028, samvatsara: 'Kilaka', shaka: '1950', yugadiNote: 'engine — late March 2028' },
  { year: 2029, samvatsara: 'Saumya', shaka: '1951', yugadiNote: 'engine — mid-April 2029' },
  { year: 2030, samvatsara: 'Sadharana', shaka: '1952', yugadiNote: 'engine — early April 2030' },
];

// ── Famous Kannada calendrical scholars ──
const KANNADA_SCHOLARS: Array<{ name: string; dates: string; bio: string }> = [
  { name: 'Madhvacharya', dates: 'c. 1238–1317 CE', bio: 'Founder of the Dvaita Vedanta school and the architect of the Karnataka Vaishnava festival calendar. He established the eight Udupi mathas (the Ashta Mathas) whose worship procedures and festival timings he codified in his Tantrasara. The annual Sri Krishna Paryaya rotation among the eight mathas is one of the longest-running festival institutions in India.' },
  { name: 'Vyasatirtha (Vyasaraja)', dates: '1460–1539 CE', bio: 'The pivotal figure for Karnataka panchanga production. Patron saint of the Vijayanagara Empire and a great Madhva polymath, he founded the Sri Vyasaraja Matha, whose annual Kannada Panchanga remains in continuous circulation. His three principal works — Nyayamruta, Tatparya Chandrika and Tarka Tandava — were credited by the Advaita scholar Appayya Dikshita with “securing the melon of Madhvaism with three bands.” His samadhi at Navabrindavana, an island in the Tungabhadra near Anegundi, remains an active pilgrimage site.' },
  { name: 'Bhaskara II (Bhaskaracharya)', dates: '1114–1185 CE', bio: 'Born in Bijapur, Karnataka. His Siddhanta Shiromani is one of the foundational Sanskrit astronomical treatises that subsequent Karnataka almanac-makers built on. The Lilavati and Bijaganita portions of the work also encode the mathematical machinery — including treatment of zero, equations and the chakravala cyclic method — that the panchanga-makers of later centuries relied on for planetary mean motions.' },
  { name: 'Basavanna and Allamaprabhu', dates: '12th c.', bio: 'The Veerashaiva calendrical tradition draws on their vachana literature; the festival days Basava Jayanti (Vaishakha Shukla Tritiya) and Allamaprabhu Jayanti are integrated into the Karnataka chandramana calendar. Together they ground the Lingayata sampradaya’s liturgical year independently of any matha-issued almanac.' },
];

export default function KannadaCalendarPage() {
  const locale = useLocale() as Locale;
  const isKn = String(locale) === 'kn';
  const isHi = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => {
    const entry = LABELS[key] as Record<string, string>;
    if (isKn && entry.kn) return entry.kn;
    return entry[locale] || entry.en;
  };
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : isKn ? { fontFamily: 'var(--font-kannada-heading)' } : { fontFamily: 'var(--font-heading)' };

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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colMonth', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isKn ? 'ಕನ್ನಡ' : 'Kannada'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colRashi', locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colGregorian', locale)}</th>
                </tr>
              </thead>
              <tbody>
                {KANNADA_MONTHS.map((m, i) => (
                  <tr key={m.name} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-secondary">{i + 1}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{isKn ? m.kannada : isHi ? m.nameHi : m.name}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 font-medium">{m.kannada}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.rashi}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{m.gregorian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Festivals */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {L('festivalsTitle')}
          </h2>
          <div className="space-y-3">
            {FESTIVALS.map((f) => (
              <div key={f.month} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1.5">{f.month}</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {isKn ? (f.kn || f.en) : isHi ? f.hi : f.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Kannada Calendar + Shaka Era */}
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'The Kannada Calendar and the Salivahana Shaka Tradition', hi: 'कन्नड़ पंचांग और शालिवाहन शक परम्परा', kn: 'ಕನ್ನಡ ಪಂಚಾಂಗ ಮತ್ತು ಶಾಲಿವಾಹನ ಶಕ ಪರಂಪರೆ' }, locale)}
          </h2>
          <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
            <p>
              The Kannada calendar shares its core architecture with the Telugu calendar — both are chandramana, amanta-month, lunisolar reckonings anchored to the <strong>Salivahana Shaka era of 78 CE</strong> — but it inherits a distinctive Karnataka-specific implementation shaped by the major Karnataka sampradayas (Madhva, Smarta and Veerashaiva). The Karnataka adoption of the Shaka system is unbroken from the medieval Vijayanagara period; the saint and Madhva scholar <strong>Vyasatirtha (Vyasaraja, c. 1460–1539)</strong>, patron saint of the Vijayanagara Empire, established Panchanga-producing mathas that continue to publish authoritative Kannada Panchangas today.
            </p>
            <p>
              Karnataka’s New Year, <strong>Yugadi</strong> (ಯುಗಾದಿ — <em>yuga-adi</em>, “the beginning of an age”), falls on the same chandramana date as Telugu Ugadi: Chaitra Shukla Pratipada. Yugadi 2026 falls on <strong>19 March 2026</strong>, inaugurating the <strong>Parabhava Nama Samvatsara</strong> in Shaka 1948.
            </p>
            <p>
              The distinction from Tamil Nadu and Kerala is sharp. Tamil Puthandu and Malayali Vishu follow the <em>souramana</em> (solar) calendar, marking the day the Sun enters Mesha (Aries); these fall in mid-April, typically 14 or 15 April, and are <em>not</em> on the same day as Yugadi. There is also no equivalence with Pongal, which is the Tamil mid-January harvest festival marking Makara Sankranti; Karnataka’s parallel for Pongal is <strong>Sankranti / Suggi Habba</strong>, observed on the same Gregorian day (around 14 January) but as a harvest thanksgiving rather than as the new year.
            </p>
          </div>
        </section>

        {/* Karnataka festival cycle across three sampradayas */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'The Karnataka Festival Cycle — Three Sampradayas', hi: 'कर्नाटक का पर्व-चक्र — तीन सम्प्रदाय', kn: 'ಕರ್ನಾಟಕ ಹಬ್ಬ ಚಕ್ರ — ಮೂರು ಸಂಪ್ರದಾಯಗಳು' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {tl({ en: 'All three traditions share the same chandramana dates; the divergence is in which festivals receive principal household observance.', hi: 'तीनों परम्पराओं की चान्द्रमान तिथियाँ समान हैं; अंतर है कि कौन-से पर्व का प्रमुख गृह-अनुष्ठान होता है।', kn: 'ಎಲ್ಲಾ ಮೂರೂ ಸಂಪ್ರದಾಯಗಳು ಒಂದೇ ಚಾಂದ್ರಮಾನ ದಿನಾಂಕಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತವೆ; ವ್ಯತ್ಯಾಸವು ಯಾವ ಹಬ್ಬವನ್ನು ಪ್ರಮುಖ ಮನೆಯ ಆಚರಣೆಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ ಎಂಬುದರಲ್ಲಿದೆ.' }, locale)}
          </p>
          <div className="space-y-3">
            {KANNADA_SAMPRADAYAS.map((s) => (
              <div key={s.name} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="text-gold-light font-semibold text-sm mb-1">{s.name}</div>
                <div className="text-amber-400/70 text-xs mb-2">{s.founder} · {s.centre}</div>
                <p className="text-text-secondary text-sm leading-relaxed mb-1.5">
                  <span className="text-gold-light/80 font-medium">Signature observances:</span> {s.signature}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  <span className="text-gold-light/80 font-medium">Authoritative almanacs:</span> {s.almanacs}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mysore Dasara 10-day chronology */}
        <section className="bg-gradient-to-br from-red-900/10 via-bg-secondary/40 to-bg-primary border border-red-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Mysore Dasara — The 10-Day Navaratri Chronology', hi: 'मैसूर दशहरा — 10-दिवसीय नवरात्रि क्रम', kn: 'ಮೈಸೂರು ದಸರಾ — 10-ದಿನಗಳ ನವರಾತ್ರಿ ಕ್ರಮ' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Mysore Dasara, the official state festival of Karnataka, is the most public ceremonial expression of the Kannada chandramana calendar. The modern royal celebration was initiated by <strong>Raja Wodeyar I in mid-September 1610 at Srirangapatna</strong>, and has run almost continuously for over four centuries. The festival spans Ashvina Shukla Pratipada to Ashvina Shukla Dashami.
          </p>
          <div className="space-y-3">
            {MYSORE_DASARA_DAYS.map((d) => (
              <div key={d.day} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1.5">
                  <span className="text-gold-light font-semibold text-sm">{d.day}</span>
                  <span className="text-amber-400/70 text-xs">{d.tithi}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{d.observance}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            The <strong>Jamboo Savari</strong> procession on Vijayadashami is the climactic day: the idol of Goddess Chamundeshwari is placed inside a <strong>golden mantapa weighing approximately 750 kg of gold</strong> on the back of a decorated lead elephant. The procession features elephants, camels, horses, mounted units of the Karnataka Mounted Police, folk dance troupes from across Karnataka, and tableaux representing the state’s districts. At Bannimantap, the festival concludes with the Banni mara puja (worship of the Shami tree), recalling the Mahabharata episode where the Pandavas concealed their weapons in a Shami tree during their year of exile.
          </p>
        </section>

        {/* Kannada cultural events table 2026–2030 */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Kannada Cultural Calendar 2026–2030', hi: 'कन्नड़ सांस्कृतिक कैलेंडर 2026–2030', kn: 'ಕನ್ನಡ ಸಾಂಸ್ಕೃತಿಕ ಕ್ಯಾಲೆಂಡರ್ 2026–2030' }, locale)}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {tl({ en: 'Samvatsara numbering: Parabhava is the 40th of the 60-year Prabhavadi cycle; Plavanga, Kilaka, Saumya and Sadharana follow.', hi: 'संवत्सर क्रमांक: परावभ 60-वर्षीय प्रभवादि चक्र का 40वाँ है; प्लवंग, कीलक, सौम्य और साधारण उसके बाद आते हैं।', kn: 'ಸಂವತ್ಸರ ಸಂಖ್ಯೆ: ಪರಾಭವ 60-ವರ್ಷದ ಪ್ರಭವಾದಿ ಚಕ್ರದ 40 ನೆಯದು.' }, locale)}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Year</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{tl({ en: 'Samvatsara', hi: 'संवत्सर', kn: 'ಸಂವತ್ಸರ' }, locale)}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Shaka</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">Yugadi note</th>
                </tr>
              </thead>
              <tbody>
                {KANNADA_YEARS.map((y, i) => (
                  <tr key={y.year} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                    <td className="px-4 py-2.5 text-text-primary font-medium">{y.year}</td>
                    <td className="px-4 py-2.5 text-gold-light">{y.samvatsara}</td>
                    <td className="px-4 py-2.5 text-text-secondary">{y.shaka}</td>
                    <td className="px-4 py-2.5 text-amber-400/80 text-xs">{y.yugadiNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Famous Kannada calendrical scholars */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {tl({ en: 'Famous Kannada Calendrical Scholars', hi: 'प्रसिद्ध कन्नड़ पंचांग-विद्वान', kn: 'ಪ್ರಸಿದ್ಧ ಕನ್ನಡ ಪಂಚಾಂಗ ವಿದ್ವಾಂಸರು' }, locale)}
          </h2>
          <div className="space-y-3">
            {KANNADA_SCHOLARS.map((s) => (
              <div key={s.name} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                  <span className="text-gold-light font-semibold text-sm">{s.name}</span>
                  <span className="text-amber-400/70 text-xs">{s.dates}</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{s.bio}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mt-4">
            The modern Madhva matha lineages — <strong>Uttaradi Matha</strong>, <strong>Sri Raghavendra Matha</strong> and <strong>Sri Vyasaraja Matha</strong> — together with the Smarta <strong>Sringeri Sharada Peetham</strong>, have institutionalised Kannada panchanga publishing into an annual cycle that continues uninterrupted into the twenty-first century.
          </p>
        </section>

        {/* Upcoming festival dates — engine-driven, NEXT occurrence only */}
        {(() => {
          // Render-time "today" in IST (Asia/Kolkata) so the table always
          // shows what's coming up. Client component, but the engine output
          // is deterministic per (year, festival) so SSR & client agree.
          const nowIso = todayInIst();
          const fdLabel = (f: KannadaFestival) => (isKn ? (f.kn || f.en) : isHi ? f.hi : f.en);
          const upcoming = KANNADA_FESTIVALS
            .map((f) => {
              const hit = nextUpcoming(f.engineKey, locale, nowIso);
              return hit ? { f, iso: hit.iso, display: hit.display } : null;
            })
            .filter((x): x is { f: KannadaFestival; iso: string; display: string } => x !== null)
            .sort((a, b) => a.iso.localeCompare(b.iso));
          return (
            <section>
              <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
                {isKn
                  ? 'ಮುಂಬರುವ ಕರ್ನಾಟಕ ಹಬ್ಬಗಳು — ತಿಥಿ ಮತ್ತು ನಿಖರ ದಿನಾಂಕ'
                  : isHi
                  ? 'आगामी कर्नाटक त्योहार — तिथि और सटीक दिनांक'
                  : 'Upcoming Karnataka Festival Dates — Tithi & Exact Dates'}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                {isKn
                  ? 'ಬೆಂಗಳೂರು/ಮೈಸೂರು ಉಲ್ಲೇಖದೊಂದಿಗೆ ಪ್ರಮುಖ ಕರ್ನಾಟಕ ಹಬ್ಬಗಳ ಮುಂಬರುವ ದಿನಾಂಕಗಳು. ಯುಗಾದಿ, ವರಮಹಾಲಕ್ಷ್ಮಿ, ಗಣೇಶ ಚತುರ್ಥಿ, ಮೈಸೂರು ದಸರಾ, ದೀಪಾವಳಿ — ಎಲ್ಲಾ ದಿನಾಂಕಗಳು ಪಂಚಾಂಗ ಎಂಜಿನ್‌ನಿಂದ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ ಮತ್ತು ಪ್ರತಿದಿನ ಸ್ವಯಂ-ನವೀಕರಿಸಲಾಗುತ್ತದೆ.'
                  : isHi
                  ? 'बेंगलूरु/मैसूर सन्दर्भ के साथ प्रमुख कर्नाटक त्योहारों की आगामी तिथियां। युगादि, वरमहालक्ष्मी, गणेश चतुर्थी, मैसूर दशहरा, दीपावली — सभी तिथियां पंचांग इंजन से गणित और हर दिन स्वतः अद्यतित।'
                  : 'Upcoming dates for major Karnataka festivals with tithi (lunar day), computed for Bangalore/Mysore. Includes Yugadi, Varamahalakshmi, Ganesha Chaturthi, Mysore Dasara, Deepavali, and other observances. Dates auto-update daily from our panchang engine — never stale.'}
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gold-primary/12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bg-secondary/60 border-b border-gold-primary/12">
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colFestival', locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colDate', locale)}</th>
                      <th className="text-left px-4 py-3 text-gold-light font-semibold">{RC('colTithi', locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map(({ f, iso, display }, i) => (
                      <tr key={`${f.en}-${iso}`} className={i % 2 === 0 ? 'bg-bg-secondary/20' : 'bg-bg-secondary/40'}>
                        <td className="px-4 py-2.5 text-text-primary font-medium">{fdLabel(f)}</td>
                        <td className="px-4 py-2.5 text-amber-400/80">{display}</td>
                        <td className="px-4 py-2.5 text-text-secondary">{f.tithi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })()}

        {/* Ugadi */}
        <section className="bg-gradient-to-br from-amber-900/15 via-bg-secondary/40 to-bg-primary border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('ugadiTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('ugadiText')}
          </p>
        </section>

        {/* Mysore Dasara */}
        <section className="bg-gradient-to-br from-indigo-900/15 via-bg-secondary/40 to-bg-primary border border-indigo-500/12 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('mysoreTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('mysoreText')}
          </p>
        </section>

        {/* Calendar Characteristics */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-3" style={hf}>
            {L('calendarTitle')}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            {L('calendarText')}
          </p>
        </section>

        {/* FAQ Section — page native (kn) + en + hi. JSON-LD below for
            Google's FAQ rich-result eligibility. */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-5" style={hf}>
            {isKn ? 'ಸಾಮಾನ್ಯವಾಗಿ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)' : isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <details key={faq.q.en} className="group bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <summary className="cursor-pointer px-5 py-4 text-gold-light font-medium text-sm flex items-center justify-between hover:border-gold-primary/30">
                  <span>{isKn ? faq.q.kn : isHi ? faq.q.hi : faq.q.en}</span>
                  <span className="ml-3 text-gold-primary/50 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gold-primary/8 pt-3">
                  {isKn ? faq.a.kn : isHi ? faq.a.hi : faq.a.en}
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
            {RC('relatedHeading', locale)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: `/${locale}/calendar/regional/telugu`, labelKey: 'linkTelugu' },
              { href: `/${locale}/calendar/regional/tamil`, labelKey: 'linkTamil' },
              { href: `/${locale}/calendar/regional/malayalam`, labelKey: 'linkMalayalam' },
              { href: `/${locale}/calendar`, labelKey: 'linkFestivalCalendar' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {RC(link.labelKey, locale)}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

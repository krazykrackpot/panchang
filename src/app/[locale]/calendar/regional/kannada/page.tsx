'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isKn ? 'ತಿಂಗಳು' : isHi ? 'मास' : 'Month'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isKn ? 'ಕನ್ನಡ' : 'Kannada'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isKn ? 'ರಾಶಿ' : isHi ? 'राशि' : 'Rashi (Zodiac)'}</th>
                  <th className="text-left px-4 py-3 text-gold-light font-semibold">{isKn ? 'ಗ್ರೆಗೋರಿಯನ್' : isHi ? 'ग्रेगोरियन' : 'Gregorian'}</th>
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

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-bold text-gold-light mb-4" style={hf}>
            {isKn ? 'ಸಂಬಂಧಿತ ಪ್ರಾದೇಶಿಕ ಪಂಚಾಂಗಗಳು' : isHi ? 'सम्बन्धित कैलेंडर' : 'Related Regional Calendars'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: `/${locale}/calendar/regional/telugu`, label: { en: 'Telugu Calendar (Panchangam)', hi: 'तेलुगु कैलेंडर', kn: 'ತೆಲುಗು ಪಂಚಾಂಗ' } },
              { href: `/${locale}/calendar/regional/tamil`, label: { en: 'Tamil Calendar (Panchangam)', hi: 'तमिल कैलेंडर', kn: 'ತಮಿಳು ಪಂಚಾಂಗ' } },
              { href: `/${locale}/calendar/regional/malayalam`, label: { en: 'Malayalam Calendar (Kollavarsham)', hi: 'मलयालम कैलेंडर', kn: 'ಮಲಯಾಳಂ ಪಂಚಾಂಗ' } },
              { href: `/${locale}/calendar`, label: { en: 'Festival Calendar 2026', hi: 'त्योहार कैलेंडर 2026', kn: 'ಹಬ್ಬಗಳ ಪಂಚಾಂಗ 2026' } },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl px-4 py-3 text-gold-light hover:text-gold-primary hover:border-gold-primary/30 transition-colors text-sm font-medium"
              >
                {isKn ? (link.label.kn || link.label.en) : isHi ? link.label.hi : link.label.en}
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

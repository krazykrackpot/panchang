'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { TITHIS } from '@/lib/constants/tithis';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ─── Inline bilingual labels ─── */
const L = {
  title:        { en: 'Tithi — The Lunar Day',                    hi: 'तिथि — चान्द्र दिवस' },
  subtitle:     { en: 'The first and most important limb of the Panchang — the angular relationship between Sun and Moon that shapes every ritual, festival, and muhurta in Hindu tradition.',
                  hi: 'पञ्चाङ्ग का प्रथम और सर्वाधिक महत्वपूर्ण अंग — सूर्य और चन्द्र के बीच का कोणीय सम्बन्ध जो हिन्दू परम्परा में प्रत्येक कर्मकाण्ड, उत्सव और मुहूर्त को निर्धारित करता है।' },
  whatIs:        { en: 'What Is a Tithi?',                          hi: 'तिथि क्या है?' },
  whatIsBody: {
    en: 'A Tithi is a lunar day — the time it takes for the Moon to gain 12 degrees of angular distance ahead of the Sun. Unlike solar days which are based on Earth\'s rotation, tithis are purely luni-solar: they measure the ever-changing geometric relationship between our two luminaries. There are 30 tithis in a lunar month, 15 in the waxing half (Shukla Paksha) and 15 in the waning half (Krishna Paksha). Each tithi has its own deity, planetary ruler, category, and suitability for different activities.',
    hi: 'तिथि एक चान्द्र दिवस है — वह समय जिसमें चन्द्रमा सूर्य से 12 अंश का कोणीय अन्तर प्राप्त करता है। सौर दिनों के विपरीत जो पृथ्वी के घूर्णन पर आधारित हैं, तिथि पूर्णतः चान्द्र-सौर है: यह दो ज्योतिर्मयों के बीच सदैव परिवर्तनशील ज्यामितीय सम्बन्ध को मापती है। एक चान्द्र मास में 30 तिथि होती हैं — शुक्ल पक्ष में 15 और कृष्ण पक्ष में 15। प्रत्येक तिथि का अपना देवता, ग्रह स्वामी, वर्ग और विभिन्न कार्यों के लिए उपयुक्तता है।'
  },
  angularDist: {
    en: 'The angular distance between the Moon and Sun (Moon\u00b0 \u2212 Sun\u00b0) ranges from 0\u00b0 to 360\u00b0. Dividing this by 12\u00b0 gives the tithi number. At New Moon (Amavasya), this distance is 0\u00b0. At Full Moon (Purnima), it is 180\u00b0. The Moon moves approximately 13.2\u00b0 per day while the Sun moves about 1\u00b0, so the Moon gains roughly 12\u00b0 daily — almost exactly one tithi per day.',
    hi: 'चन्द्र और सूर्य के बीच कोणीय दूरी (चन्द्र\u00b0 \u2212 सूर्य\u00b0) 0\u00b0 से 360\u00b0 तक होती है। इसे 12\u00b0 से विभाजित करने पर तिथि संख्या प्राप्त होती है। अमावस्या पर यह दूरी 0\u00b0 और पूर्णिमा पर 180\u00b0 होती है। चन्द्रमा प्रतिदिन लगभग 13.2\u00b0 और सूर्य लगभग 1\u00b0 चलता है, अतः चन्द्र प्रतिदिन लगभग 12\u00b0 आगे बढ़ता है — लगभग ठीक एक तिथि प्रतिदिन।'
  },
  calcTitle:    { en: 'Tithi Calculation Formula',                  hi: 'तिथि गणना सूत्र' },
  workedEx:     { en: 'Worked Example',                             hi: 'उदाहरण' },
  workedExBody: {
    en: 'Suppose the Moon is at sidereal longitude 87.5\u00b0 and the Sun is at 42.3\u00b0. The angular difference = 87.5 \u2212 42.3 = 45.2\u00b0. Dividing by 12\u00b0: 45.2 / 12 = 3.767. Taking floor + 1 = 4. So the running tithi is Shukla Chaturthi (the 4th tithi). The tithi will end when the difference reaches 48\u00b0 (4 \u00d7 12\u00b0).',
    hi: 'मान लीजिए चन्द्रमा 87.5\u00b0 और सूर्य 42.3\u00b0 पर है। कोणीय अन्तर = 87.5 \u2212 42.3 = 45.2\u00b0। 12\u00b0 से विभाजन: 45.2 / 12 = 3.767। floor + 1 = 4। अतः चालू तिथि शुक्ल चतुर्थी (चौथी तिथि) है। तिथि तब समाप्त होगी जब अन्तर 48\u00b0 (4 \u00d7 12\u00b0) पहुँचेगा।'
  },
  pakshaTitle:  { en: 'The Two Pakshas',                            hi: 'दो पक्ष' },
  shuklaLabel:  { en: 'Shukla Paksha (Waxing Moon)',                hi: 'शुक्ल पक्ष (बढ़ता चन्द्रमा)' },
  krishnaLabel: { en: 'Krishna Paksha (Waning Moon)',               hi: 'कृष्ण पक्ष (घटता चन्द्रमा)' },
  shuklaDesc: {
    en: 'From New Moon to Full Moon. The Moon grows brighter each night. Angular distance: 0\u00b0 to 180\u00b0. Considered more auspicious for new beginnings, expansive activities, and celebrations.',
    hi: 'अमावस्या से पूर्णिमा तक। चन्द्र प्रत्येक रात्रि उज्ज्वल होता है। कोणीय दूरी: 0\u00b0 से 180\u00b0। नई शुरुआत, विस्तार और उत्सवों के लिए अधिक शुभ माना जाता है।'
  },
  krishnaDesc: {
    en: 'From Full Moon to New Moon. The Moon wanes each night. Angular distance: 180\u00b0 to 360\u00b0. Suited for introspective work, remedies, Pitri karmas, and dissolution-oriented activities.',
    hi: 'पूर्णिमा से अमावस्या तक। चन्द्र प्रत्येक रात्रि क्षीण होता है। कोणीय दूरी: 180\u00b0 से 360\u00b0। आत्मचिन्तन, उपचार, पितृ कर्म और विसर्जन कार्यों के लिए उपयुक्त।'
  },
  lordshipTitle: { en: 'Tithi Lordship — Deity & Planet',          hi: 'तिथि स्वामित्व — देवता एवं ग्रह' },
  lordshipDesc: {
    en: 'Each tithi has a presiding deity and a planetary lord. The deity governs the spiritual quality of the day, while the planetary lord influences its material effects. These associations are consistent across both Shukla and Krishna Paksha (e.g., Pratipada is always ruled by Agni/Sun, whether waxing or waning).',
    hi: 'प्रत्येक तिथि का एक अधिष्ठाता देवता और एक ग्रह स्वामी होता है। देवता दिन की आध्यात्मिक गुणवत्ता और ग्रह स्वामी भौतिक प्रभावों को नियन्त्रित करता है। ये सम्बन्ध शुक्ल और कृष्ण दोनों पक्षों में समान रहते हैं।'
  },
  categoriesTitle: { en: 'The Five Tithi Categories',               hi: 'तिथि के पाँच वर्ग' },
  categoriesDesc: {
    en: 'The 30 tithis are classified into five groups of six, cycling in a fixed pattern: Nanda, Bhadra, Jaya, Rikta, Purna. Every 1st/6th/11th is Nanda, every 2nd/7th/12th is Bhadra, and so on. Each category has a distinct character that profoundly affects muhurta selection.',
    hi: '30 तिथियों को छह-छह के पाँच समूहों में वर्गीकृत किया गया है, जो एक निश्चित क्रम में चक्रित होते हैं: नन्दा, भद्रा, जया, रिक्ता, पूर्णा। प्रत्येक 1/6/11 नन्दा, 2/7/12 भद्रा, इत्यादि। प्रत्येक वर्ग का विशिष्ट स्वभाव है जो मुहूर्त चयन को गहराई से प्रभावित करता है।'
  },
  specialTitle: { en: 'Special Tithis',                             hi: 'विशेष तिथियाँ' },
  kshayaTitle:  { en: 'Kshaya & Vriddhi Tithis',                   hi: 'क्षय एवं वृद्धि तिथि' },
  kshayaDesc: {
    en: 'A Kshaya Tithi (elided/skipped tithi) occurs when the Moon moves so fast that an entire 12\u00b0 segment is traversed between two consecutive sunrises — the tithi begins and ends within the same solar day, so it never "exists" at sunrise. This happens because the Moon\'s speed varies between ~11.8\u00b0/day (at apogee) and ~15.4\u00b0/day (at perigee). When the Moon is near perigee and moving rapidly, it can cover more than 12\u00b0 of elongation in one solar day, causing the next tithi to be "skipped."',
    hi: 'क्षय तिथि (लुप्त तिथि) तब होती है जब चन्द्रमा इतनी तेज़ गति से चलता है कि 12\u00b0 का पूरा खण्ड दो सूर्योदयों के बीच पार हो जाता है — तिथि एक ही सौर दिन में आरम्भ और समाप्त हो जाती है। यह इसलिए होता है क्योंकि चन्द्रमा की गति ~11.8\u00b0/दिन (अपभू पर) से ~15.4\u00b0/दिन (उपभू पर) के बीच बदलती है।'
  },
  vriddhiDesc: {
    en: 'A Vriddhi Tithi (augmented/repeated tithi) occurs when the Moon moves so slowly that the same tithi spans across three sunrises — it prevails at sunrise on two consecutive days. This happens when the Moon is near apogee. In practice, Kshaya tithis are somewhat rare (a few per year) and Vriddhi tithis occur when the Moon is at its slowest near apogee.',
    hi: 'वृद्धि तिथि (दोहरी तिथि) तब होती है जब चन्द्रमा इतनी धीमी गति से चलता है कि एक ही तिथि तीन सूर्योदयों में फैल जाती है — लगातार दो दिनों पर सूर्योदय के समय एक ही तिथि रहती है। यह चन्द्रमा के अपभू के निकट होने पर होता है।'
  },
  dwiTithiTitle: { en: 'Dwi-Tithi Rule',                           hi: 'द्वि-तिथि नियम' },
  dwiTithiDesc: {
    en: 'When a festival falls on a Vriddhi (repeated) tithi, the question arises: on which of the two days should the observance take place? The Dwi-tithi rule provides the answer. For Ekadashi, the second day is chosen (to ensure the fast extends correctly into Dwadashi for Parana). For all other tithis, the first occurrence is chosen. This rule is critical for determining the correct date of festivals like Ganesh Chaturthi, Maha Shivaratri, and all Ekadashi observances.',
    hi: 'जब कोई उत्सव वृद्धि (दोहरी) तिथि पर पड़ता है, तो प्रश्न उठता है: दो दिनों में से किस दिन पालन करें? द्वि-तिथि नियम उत्तर देता है। एकादशी के लिए दूसरा दिन चुना जाता है (जिससे व्रत द्वादशी के पारण तक सही रूप से बढ़े)। अन्य सभी तिथियों के लिए प्रथम अवसर चुना जाता है।'
  },
  muhurtaTitle: { en: 'Tithis & Muhurta Selection',                 hi: 'तिथि एवं मुहूर्त चयन' },
  muhurtaDesc: {
    en: 'Tithi is the primary factor in selecting an auspicious moment (muhurta). Different tithis are suited for different activities based on their category, deity, and inherent nature. Here is a practical guide:',
    hi: 'शुभ मुहूर्त चयन में तिथि प्राथमिक कारक है। विभिन्न तिथियाँ अपने वर्ग, देवता और स्वभाव के आधार पर भिन्न कार्यों के लिए उपयुक्त हैं। यहाँ एक व्यावहारिक मार्गदर्शिका है:'
  },
  crossRef:     { en: 'Related Modules',                            hi: 'सम्बन्धित विषय' },
  tryIt:        { en: 'Check Today\'s Tithi',                       hi: 'आज की तिथि देखें' },
};

/* ─── Tithi categories ─── */
const CATEGORIES = [
  {
    name: { en: 'Nanda', hi: 'नन्दा' },
    meaning: { en: 'Joy / Happiness', hi: 'आनन्द / प्रसन्नता' },
    tithis: '1, 6, 11',
    color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5',
    nature: { en: 'Auspicious. Good for celebrations, starting education, religious ceremonies, marriage negotiations, and joyful gatherings.', hi: 'शुभ। उत्सव, शिक्षा आरम्भ, धार्मिक अनुष्ठान, विवाह वार्ता और आनन्दमय सभाओं के लिए उत्तम।' },
  },
  {
    name: { en: 'Bhadra', hi: 'भद्रा' },
    meaning: { en: 'Prosperity / Welfare', hi: 'समृद्धि / कल्याण' },
    tithis: '2, 7, 12',
    color: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-blue-500/5',
    nature: { en: 'Benefic. Favorable for house construction, purchasing property, agriculture, long-term investments, and activities seeking stability.', hi: 'लाभकारी। गृह निर्माण, सम्पत्ति खरीद, कृषि, दीर्घकालिक निवेश और स्थिरता के कार्यों के लिए अनुकूल।' },
  },
  {
    name: { en: 'Jaya', hi: 'जया' },
    meaning: { en: 'Victory / Triumph', hi: 'विजय / जीत' },
    tithis: '3, 8, 13',
    color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5',
    nature: { en: 'Mixed to strong. Good for competitive activities, legal battles, overcoming enemies, sports, and assertive undertakings.', hi: 'मिश्रित से प्रबल। प्रतिस्पर्धा, कानूनी लड़ाई, शत्रु पर विजय, खेल और दृढ़ कार्यों के लिए उत्तम।' },
  },
  {
    name: { en: 'Rikta', hi: 'रिक्ता' },
    meaning: { en: 'Empty / Void', hi: 'शून्य / रिक्त' },
    tithis: '4, 9, 14',
    color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5',
    nature: { en: 'Inauspicious. Avoid starting new ventures, marriages, and auspicious ceremonies. Suitable for destructive activities: demolition, clearing debts, ending contracts, and tantric remedies.', hi: 'अशुभ। नए कार्य, विवाह और शुभ अनुष्ठान से बचें। विध्वंसक कार्यों के लिए उपयुक्त: ध्वंस, ऋण मुक्ति, अनुबंध समाप्ति और तान्त्रिक उपचार।' },
  },
  {
    name: { en: 'Purna', hi: 'पूर्णा' },
    meaning: { en: 'Full / Complete', hi: 'पूर्ण / सम्पूर्ण' },
    tithis: '5, 10, 15',
    color: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/5',
    nature: { en: 'Highly auspicious. Excellent for completing tasks, fulfilling promises, grand celebrations, charity, and spiritual practices. Purnima (15th) and Panchami (5th) are particularly powerful.', hi: 'अत्यन्त शुभ। कार्य पूर्ण करने, प्रतिज्ञा पूर्ति, भव्य उत्सव, दान और आध्यात्मिक साधना के लिए उत्कृष्ट। पूर्णिमा (15वीं) और पंचमी (5वीं) विशेष शक्तिशाली हैं।' },
  },
];

/* ─── Planet lordship for each tithi 1-15 ─── */
const TITHI_PLANETS: { en: string; hi: string }[] = [
  { en: 'Sun',     hi: 'सूर्य' },    // 1 Pratipada
  { en: 'Moon',    hi: 'चन्द्र' },   // 2 Dwitiya
  { en: 'Mars',    hi: 'मंगल' },     // 3 Tritiya
  { en: 'Mercury', hi: 'बुध' },      // 4 Chaturthi
  { en: 'Jupiter', hi: 'गुरु' },     // 5 Panchami
  { en: 'Venus',   hi: 'शुक्र' },    // 6 Shashthi
  { en: 'Saturn',  hi: 'शनि' },      // 7 Saptami
  { en: 'Rahu',    hi: 'राहु' },     // 8 Ashtami
  { en: 'Mars',    hi: 'मंगल' },     // 9 Navami (Mars again)
  { en: 'Sun',     hi: 'सूर्य' },    // 10 Dashami
  { en: 'Moon',    hi: 'चन्द्र' },   // 11 Ekadashi (some assign Vishnu's energy here)
  { en: 'Mercury', hi: 'बुध' },      // 12 Dwadashi
  { en: 'Jupiter', hi: 'गुरु' },     // 13 Trayodashi
  { en: 'Saturn',  hi: 'शनि' },      // 14 Chaturdashi
  { en: 'Venus',   hi: 'शुक्र' },    // 15 Purnima/Amavasya
];

/* ─── Special Tithis data ─── */
const SPECIAL_TITHIS = [
  {
    name: { en: 'Amavasya (New Moon)', hi: 'अमावस्या (नव चन्द्र)' },
    color: 'text-slate-300', border: 'border-slate-500/25',
    desc: {
      en: 'The 30th tithi when Sun and Moon are conjunct (0\u00b0 separation). The darkest night. Sacred to the Pitris (ancestors). Tarpanam (ancestral offerings), Shani and Rahu remedies, and Tantric sadhana are especially potent. New ventures and auspicious ceremonies are generally avoided. However, Deepawali Amavasya (Kartik) is an exception where Lakshmi puja is performed.',
      hi: '30वीं तिथि जब सूर्य और चन्द्र युति में होते हैं (0\u00b0 अन्तर)। सबसे अँधेरी रात्रि। पितरों को समर्पित। तर्पण, शनि-राहु उपचार और तान्त्रिक साधना विशेष प्रभावी। नए कार्य और शुभ अनुष्ठान सामान्यतः वर्जित। किन्तु दीपावली अमावस्या (कार्तिक) अपवाद है जहाँ लक्ष्मी पूजा होती है।'
    }
  },
  {
    name: { en: 'Purnima (Full Moon)', hi: 'पूर्णिमा (पूर्ण चन्द्र)' },
    color: 'text-gold-light', border: 'border-gold-primary/25',
    desc: {
      en: 'The 15th tithi of Shukla Paksha when Sun and Moon are in exact opposition (180\u00b0). The brightest night. Considered the most auspicious tithi overall. Satya Narayan Vrat, Guru Purnima, Buddha Purnima, Sharad Purnima, and Holi all fall on Purnima. Excellent for charity, spiritual practices, fasting, and community gatherings.',
      hi: 'शुक्ल पक्ष की 15वीं तिथि जब सूर्य और चन्द्र ठीक विपरीत (180\u00b0) होते हैं। सबसे उज्ज्वल रात्रि। सर्वाधिक शुभ तिथि मानी जाती है। सत्यनारायण व्रत, गुरु पूर्णिमा, बुद्ध पूर्णिमा, शरद पूर्णिमा और होली पूर्णिमा पर ही पड़ती हैं। दान, साधना, उपवास और सामुदायिक सभाओं के लिए उत्कृष्ट।'
    }
  },
  {
    name: { en: 'Ekadashi (11th Tithi)', hi: 'एकादशी (11वीं तिथि)' },
    color: 'text-blue-300', border: 'border-blue-500/25',
    desc: {
      en: 'The most revered fasting tithi, sacred to Lord Vishnu. Both Shukla and Krishna Ekadashis are observed with strict fasting (Nirjala or with fruits). There are 24 named Ekadashis in a year, each with unique significance: Nirjala Ekadashi (Jyeshtha Shukla) is the strictest, Vaikuntha Ekadashi (Margashirsha/Dhanu Shukla) opens the gates of Vaikuntha, and Devshayani/Devuthani Ekadashis mark Vishnu\'s cosmic sleep cycle. The Dwi-tithi rule applies uniquely here: if Ekadashi is Vriddhi, the second day is observed.',
      hi: 'सबसे पूजनीय उपवास तिथि, भगवान विष्णु को समर्पित। शुक्ल और कृष्ण दोनों एकादशी कड़े उपवास (निर्जला या फलाहार) से मनाई जाती हैं। वर्ष में 24 नामित एकादशी हैं: निर्जला एकादशी (ज्येष्ठ शुक्ल) सबसे कठोर, वैकुण्ठ एकादशी (मार्गशीर्ष/धनु शुक्ल) वैकुण्ठ के द्वार खोलती है। द्वि-तिथि नियम यहाँ विशेष रूप से लागू: वृद्धि एकादशी में दूसरा दिन माना जाता है।'
    }
  },
  {
    name: { en: 'Chaturthi (4th Tithi)', hi: 'चतुर्थी (4th तिथि)' },
    color: 'text-amber-400', border: 'border-amber-500/25',
    desc: {
      en: 'Sacred to Lord Ganesha. Shukla Chaturthi is auspicious (Vinayaka Chaturthi), while Krishna Chaturthi is observed as Sankashti Chaturthi (monthly Ganesha fasting day). The great Ganesh Chaturthi festival falls on Bhadrapada Shukla Chaturthi. Moon sighting on Bhadrapada Shukla Chaturthi is traditionally avoided (Chandra Dosha).',
      hi: 'भगवान गणेश को समर्पित। शुक्ल चतुर्थी शुभ (विनायक चतुर्थी) और कृष्ण चतुर्थी संकष्टी चतुर्थी (मासिक गणेश व्रत) के रूप में मनाई जाती है। महान गणेश चतुर्थी उत्सव भाद्रपद शुक्ल चतुर्थी पर पड़ता है।'
    }
  },
  {
    name: { en: 'Chaturdashi (14th Tithi)', hi: 'चतुर्दशी (14वीं तिथि)' },
    color: 'text-indigo-400', border: 'border-indigo-500/25',
    desc: {
      en: 'Sacred to Lord Shiva. Krishna Chaturdashi is Maha Shivaratri (the Great Night of Shiva), one of the most important Hindu festivals. Being a Rikta tithi, it is generally inauspicious for worldly activities but supremely powerful for Shiva worship, meditation, and spiritual transformation.',
      hi: 'भगवान शिव को समर्पित। कृष्ण चतुर्दशी महा शिवरात्रि (शिव की महारात्रि) है, जो सबसे महत्वपूर्ण हिन्दू उत्सवों में से एक है। रिक्ता तिथि होने के कारण सांसारिक कार्यों के लिए अशुभ परन्तु शिव पूजा, ध्यान और आध्यात्मिक परिवर्तन के लिए परम शक्तिशाली।'
    }
  },
];

/* ─── Muhurta Activity Guide ─── */
const MUHURTA_GUIDE = [
  { activity: { en: 'Marriage', hi: 'विवाह' }, good: '2, 3, 5, 7, 10, 11, 13', avoid: '4, 8, 9, 14, Amavasya', note: { en: 'Bhadra and Purna tithis preferred', hi: 'भद्रा और पूर्णा तिथि श्रेष्ठ' } },
  { activity: { en: 'Griha Pravesh', hi: 'गृह प्रवेश' }, good: '2, 3, 5, 7, 10, 11, 13', avoid: '4, 8, 9, 14, Amavasya', note: { en: 'Same as marriage; Dwitiya and Dashami excellent', hi: 'विवाह समान; द्वितीया और दशमी उत्कृष्ट' } },
  { activity: { en: 'Business Start', hi: 'व्यापार आरम्भ' }, good: '1, 2, 3, 5, 6, 10, 11', avoid: '4, 8, 9, 14', note: { en: 'Nanda tithis bring joy to commerce', hi: 'नन्दा तिथि व्यापार में आनन्द लाती है' } },
  { activity: { en: 'Education', hi: 'शिक्षा' }, good: '1, 2, 3, 5, 10, 11', avoid: '4, 9, 14, Amavasya', note: { en: 'Panchami (Saraswati) is ideal', hi: 'पंचमी (सरस्वती) आदर्श' } },
  { activity: { en: 'Surgery', hi: 'शल्यक्रिया' }, good: '4, 9, 14', avoid: '8, Amavasya, Purnima', note: { en: 'Rikta tithis suit cutting/removal', hi: 'रिक्ता तिथि कटाई/निष्कासन हेतु' } },
  { activity: { en: 'Fasting / Vrat', hi: 'उपवास / व्रत' }, good: '11 (Ekadashi), Purnima, Amavasya, 4, 8', avoid: '-', note: { en: 'Ekadashi for Vishnu, Chaturthi for Ganesha', hi: 'एकादशी विष्णु हेतु, चतुर्थी गणेश हेतु' } },
  { activity: { en: 'Charity / Dana', hi: 'दान' }, good: 'Purnima, 5, 10, 11, 15', avoid: '4, 9, 14', note: { en: 'Purna tithis amplify merit', hi: 'पूर्णा तिथि पुण्य बढ़ाती है' } },
];

/* ─── Cross-references ─── */
const CROSS_REFS = [
  { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र' }, desc: { en: 'The 27 lunar mansions — Moon\'s position complements Tithi', hi: '27 चान्द्र गृह — चन्द्र की स्थिति तिथि का पूरक' } },
  { href: '/learn/karanas', label: { en: 'Karanas', hi: 'करण' }, desc: { en: 'Half-tithis — each tithi contains two karanas', hi: 'अर्ध-तिथि — प्रत्येक तिथि में दो करण' } },
  { href: '/learn/yogas', label: { en: 'Yogas', hi: 'योग' }, desc: { en: 'Sun+Moon sum — the complementary Panchang anga', hi: 'सूर्य+चन्द्र योग — पूरक पञ्चाङ्ग अंग' } },
  { href: '/learn/muhurtas', label: { en: 'Muhurtas', hi: 'मुहूर्त' }, desc: { en: 'Time divisions — Tithi is the primary muhurta factor', hi: 'समय विभाजन — मुहूर्त में तिथि प्राथमिक' } },
  { href: '/learn/masa', label: { en: 'Masa (Months)', hi: 'मास' }, desc: { en: 'Lunar months defined by Purnima or Amavasya endpoints', hi: 'पूर्णिमा या अमावस्या से परिभाषित चान्द्र मास' } },
];

function getCategoryForTithi(num: number): string {
  const n = num <= 15 ? num : num - 15;
  const mod = n % 5;
  if (mod === 1) return 'Nanda';
  if (mod === 2) return 'Bhadra';
  if (mod === 3) return 'Jaya';
  if (mod === 4) return 'Rikta';
  return 'Purna'; // mod === 0
}

function getCategoryColor(cat: string): string {
  switch (cat) {
    case 'Nanda': return 'text-emerald-400';
    case 'Bhadra': return 'text-blue-300';
    case 'Jaya': return 'text-amber-400';
    case 'Rikta': return 'text-red-400';
    case 'Purna': return 'text-violet-400';
    default: return 'text-text-secondary';
  }
}

export default function LearnTithisPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: { en: string; hi: string }) => isHi ? obj.hi : obj.en;

  const shukla = TITHIS.filter(ti => ti.paksha === 'shukla');
  const krishna = TITHIS.filter(ti => ti.paksha === 'krishna');

  return (
    <div className="space-y-8">
      {/* ═══ Header ═══ */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {l(L.title)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {l(L.subtitle)}
        </p>
      </div>

      {/* ═══ 1. What Is a Tithi? ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.whatIs)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          <p>{l(L.whatIsBody)}</p>
          <p>{l(L.angularDist)}</p>

          {/* Visual: Sun-Moon angle diagram */}
          <div className="flex justify-center my-6">
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 max-w-md w-full">
              <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-4 text-center">
                {isHi ? 'तिथि = चन्द्र-सूर्य कोणीय दूरी / 12\u00b0' : 'Tithi = Moon-Sun Angular Distance / 12\u00b0'}
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { angle: '0\u00b0', tithi: { en: 'Amavasya', hi: 'अमावस्या' }, phase: '\u25cf' },
                  { angle: '12\u00b0', tithi: { en: 'Shukla 1', hi: 'शु. 1' }, phase: '\u25d1' },
                  { angle: '90\u00b0', tithi: { en: 'Shukla 8', hi: 'शु. 8' }, phase: '\u25d1' },
                  { angle: '180\u00b0', tithi: { en: 'Purnima', hi: 'पूर्णिमा' }, phase: '\u25cb' },
                  { angle: '192\u00b0', tithi: { en: 'Krishna 1', hi: 'कृ. 1' }, phase: '\u25d1' },
                  { angle: '270\u00b0', tithi: { en: 'Krishna 8', hi: 'कृ. 8' }, phase: '\u25d1' },
                  { angle: '348\u00b0', tithi: { en: 'Krishna 14', hi: 'कृ. 14' }, phase: '\u25d1' },
                  { angle: '360\u00b0', tithi: { en: 'Amavasya', hi: 'अमावस्या' }, phase: '\u25cf' },
                ].map((item, i) => (
                  <div key={i} className="px-1.5 py-2 rounded-lg border border-gold-primary/10">
                    <div className="text-lg mb-1">{item.phase}</div>
                    <div className="text-gold-primary font-mono font-bold">{item.angle}</div>
                    <div className="text-text-secondary/70 text-[10px]">{l(item.tithi)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 2. Calculation Formula ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.calcTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          <div className="p-5 bg-bg-primary/50 rounded-xl border border-gold-primary/15">
            <p className="text-gold-light font-mono text-base mb-2">D = (Moon_longitude - Sun_longitude + 360) mod 360</p>
            <p className="text-gold-light font-mono text-base mb-3">Tithi_number = floor(D / 12) + 1</p>
            <div className="text-text-secondary/60 font-mono text-xs space-y-1">
              <p>{isHi ? 'यदि Tithi 1-15 → शुक्ल पक्ष' : 'If Tithi 1-15 \u2192 Shukla Paksha'}</p>
              <p>{isHi ? 'यदि Tithi 16-30 → कृष्ण पक्ष' : 'If Tithi 16-30 \u2192 Krishna Paksha'}</p>
              <p>{isHi ? 'तिथि तब बदलती है जब D अगले 12\u00b0 के गुणज को पार करता है' : 'Tithi changes when D crosses the next multiple of 12\u00b0'}</p>
            </div>
          </div>

          {/* Worked example */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
            <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">
              {l(L.workedEx)}
            </div>
            <p className="text-sm">{l(L.workedExBody)}</p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg font-mono text-xs text-gold-light/80 space-y-1">
              <p>Moon = 87.5\u00b0, Sun = 42.3\u00b0</p>
              <p>D = (87.5 - 42.3 + 360) mod 360 = 45.2\u00b0</p>
              <p>Tithi = floor(45.2 / 12) + 1 = floor(3.767) + 1 = 3 + 1 = <span className="text-gold-primary font-bold">4 (Shukla Chaturthi)</span></p>
              <p>{isHi ? 'तिथि समाप्ति: D = 48\u00b0 (4 \u00d7 12\u00b0)' : 'Tithi ends when D = 48\u00b0 (4 \u00d7 12\u00b0)'}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 3. The 30 Tithis: Shukla & Krishna ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.pakshaTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-6">
          {/* Shukla Paksha */}
          <div>
            <h4 className="text-lg text-gold-light mb-2 font-bold" style={headingFont}>
              {l(L.shuklaLabel)}
            </h4>
            <p className="text-sm mb-4">{l(L.shuklaDesc)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {shukla.map((ti, i) => {
                const cat = getCategoryForTithi(ti.number);
                const catColor = getCategoryColor(cat);
                return (
                  <motion.div
                    key={`s-${ti.number}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center"
                  >
                    <div className="text-gold-primary text-lg font-bold">{ti.number}</div>
                    <div className="text-gold-light text-sm font-semibold">{ti.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{ti.name.en}</div>}
                    <div className="text-text-secondary/70 text-xs mt-1">{ti.deity[locale]}</div>
                    <div className={`text-[10px] mt-1 font-medium ${catColor}`}>{cat}</div>
                    <div className="text-text-tertiary text-[9px]">{TITHI_PLANETS[ti.number - 1]?.[locale === 'en' ? 'en' : 'hi']}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Krishna Paksha */}
          <div>
            <h4 className="text-lg text-indigo-300/80 mb-2 font-bold" style={headingFont}>
              {l(L.krishnaLabel)}
            </h4>
            <p className="text-sm mb-4">{l(L.krishnaDesc)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {krishna.map((ti, i) => {
                const cat = getCategoryForTithi(ti.number);
                const catColor = getCategoryColor(cat);
                return (
                  <motion.div
                    key={`k-${ti.number}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center"
                  >
                    <div className="text-indigo-300/80 text-lg font-bold">{ti.number - 15}</div>
                    <div className="text-gold-light text-sm font-semibold">{ti.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{ti.name.en}</div>}
                    <div className="text-text-secondary/70 text-xs mt-1">{ti.deity[locale]}</div>
                    <div className={`text-[10px] mt-1 font-medium ${catColor}`}>{cat}</div>
                    <div className="text-text-tertiary text-[9px]">{TITHI_PLANETS[(ti.number - 15) - 1]?.[locale === 'en' ? 'en' : 'hi']}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 4. Tithi Lordship Table ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.lordshipTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.lordshipDesc)}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">#</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'तिथि' : 'Tithi'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'देवता' : 'Deity'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'वर्ग' : 'Category'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'अंश' : 'Degrees'}</th>
              </tr>
            </thead>
            <tbody>
              {shukla.map((ti) => {
                const cat = getCategoryForTithi(ti.number);
                const catColor = getCategoryColor(cat);
                const startDeg = (ti.number - 1) * 12;
                const endDeg = ti.number * 12;
                return (
                  <tr key={ti.number} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                    <td className="py-2 px-3 text-gold-primary font-bold">{ti.number}</td>
                    <td className="py-2 px-3 text-gold-light font-medium">{ti.name[locale]}{locale !== 'en' && <span className="text-text-tertiary text-xs ml-1">({ti.name.en})</span>}</td>
                    <td className="py-2 px-3 text-text-secondary">{ti.deity[locale]}</td>
                    <td className="py-2 px-3 text-text-secondary">{TITHI_PLANETS[ti.number - 1]?.[locale === 'en' ? 'en' : 'hi']}</td>
                    <td className={`py-2 px-3 font-medium ${catColor}`}>{cat}</td>
                    <td className="py-2 px-3 text-text-tertiary font-mono text-xs">{startDeg}\u00b0\u2013{endDeg}\u00b0</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ 5. Tithi Categories ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.categoriesTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{l(L.categoriesDesc)}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name.en}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-5 border ${cat.border} ${cat.bg}`}
            >
              <div className={`text-lg font-bold ${cat.color} mb-1`} style={headingFont}>{l(cat.name)}</div>
              <div className="text-text-secondary/60 text-xs mb-2">{l(cat.meaning)}</div>
              <div className="text-text-tertiary text-[10px] font-mono mb-3">
                {isHi ? 'तिथि' : 'Tithis'}: {cat.tithis}
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{l(cat.nature)}</p>
            </motion.div>
          ))}
        </div>

        {/* Category pattern visual */}
        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3 text-center">
            {isHi ? 'चक्रीय प्रतिरूप: 1→नन्दा, 2→भद्रा, 3→जया, 4→रिक्ता, 5→पूर्णा (पुनरावर्तन)' : 'Cyclic Pattern: 1\u2192Nanda, 2\u2192Bhadra, 3\u2192Jaya, 4\u2192Rikta, 5\u2192Purna (repeats)'}
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {Array.from({ length: 15 }, (_, i) => i + 1).map(n => {
              const cat = getCategoryForTithi(n);
              const color = getCategoryColor(cat);
              return (
                <div key={n} className="flex flex-col items-center px-2 py-1.5 rounded-lg border border-gold-primary/10 min-w-[40px]">
                  <div className="text-gold-primary font-bold text-sm">{n}</div>
                  <div className={`text-[9px] font-medium ${color}`}>{cat.substring(0, 2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══ 6. Special Tithis ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {l(L.specialTitle)}
        </h3>
        <div className="space-y-5">
          {SPECIAL_TITHIS.map((st, i) => (
            <motion.div
              key={st.name.en}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-5 border ${st.border} bg-bg-secondary/20`}
            >
              <div className={`text-lg font-bold ${st.color} mb-2`} style={headingFont}>
                {l(st.name)}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{l(st.desc)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 7. Kshaya & Vriddhi Tithis ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.kshayaTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-5">
          {/* Kshaya */}
          <div className="rounded-xl p-5 border border-red-500/15 bg-red-500/5">
            <div className="text-red-400 font-bold text-base mb-2" style={headingFont}>
              {isHi ? 'क्षय तिथि (लुप्त / छूटी हुई)' : 'Kshaya Tithi (Skipped / Elided)'}
            </div>
            <p className="text-sm leading-relaxed">{l(L.kshayaDesc)}</p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg text-xs space-y-1">
              <p className="text-gold-light font-mono">
                {isHi ? 'उदाहरण: सूर्योदय पर तिथि 5 → अगले सूर्योदय पर तिथि 7 (तिथि 6 क्षय!)' : 'Example: Tithi 5 at sunrise \u2192 Tithi 7 at next sunrise (Tithi 6 skipped!)'}
              </p>
              <p className="text-text-tertiary">
                {isHi ? 'तिथि 6 दो सूर्योदयों के बीच आरम्भ और समाप्त हो गई — किसी सूर्योदय पर नहीं थी' : 'Tithi 6 began and ended between sunrises \u2014 it never existed at any sunrise'}
              </p>
            </div>
          </div>

          {/* Vriddhi */}
          <div className="rounded-xl p-5 border border-emerald-500/15 bg-emerald-500/5">
            <div className="text-emerald-400 font-bold text-base mb-2" style={headingFont}>
              {isHi ? 'वृद्धि तिथि (दोहरी / बढ़ी हुई)' : 'Vriddhi Tithi (Repeated / Augmented)'}
            </div>
            <p className="text-sm leading-relaxed">{l(L.vriddhiDesc)}</p>
            <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg text-xs space-y-1">
              <p className="text-gold-light font-mono">
                {isHi ? 'उदाहरण: सूर्योदय पर तिथि 9 → अगले सूर्योदय पर भी तिथि 9 (वृद्धि!)' : 'Example: Tithi 9 at sunrise \u2192 Tithi 9 again at next sunrise (repeated!)'}
              </p>
              <p className="text-text-tertiary">
                {isHi ? 'चन्द्र इतना धीमा चला कि 12\u00b0 पार करने में दो सूर्योदय हो गए' : 'Moon moved so slowly that two sunrises passed before 12\u00b0 was covered'}
              </p>
            </div>
          </div>

          {/* Visual: Moon speed variation */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
            <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3 text-center">
              {isHi ? 'चन्द्र गति भिन्नता — क्षय/वृद्धि का कारण' : 'Moon Speed Variation \u2014 Cause of Kshaya/Vriddhi'}
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-center text-xs">
              <div className="px-4 py-3 rounded-lg border border-red-500/15 bg-red-500/5">
                <div className="text-red-400 font-bold">{isHi ? 'उपभू (Perigee)' : 'Perigee (Closest)'}</div>
                <div className="text-text-secondary font-mono">~15.4\u00b0/day</div>
                <div className="text-text-tertiary text-[10px] mt-1">{isHi ? '→ क्षय तिथि सम्भव' : '\u2192 Kshaya possible'}</div>
              </div>
              <div className="px-4 py-3 rounded-lg border border-gold-primary/15">
                <div className="text-gold-light font-bold">{isHi ? 'औसत' : 'Average'}</div>
                <div className="text-text-secondary font-mono">~13.2\u00b0/day</div>
                <div className="text-text-tertiary text-[10px] mt-1">{isHi ? '→ सामान्य तिथि' : '\u2192 Normal tithi'}</div>
              </div>
              <div className="px-4 py-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5">
                <div className="text-emerald-400 font-bold">{isHi ? 'अपभू (Apogee)' : 'Apogee (Farthest)'}</div>
                <div className="text-text-secondary font-mono">~11.8\u00b0/day</div>
                <div className="text-text-tertiary text-[10px] mt-1">{isHi ? '→ वृद्धि तिथि सम्भव' : '\u2192 Vriddhi possible'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 8. Dwi-Tithi Rule ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.dwiTithiTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.dwiTithiDesc)}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border border-blue-500/20 bg-blue-500/5">
            <div className="text-blue-300 font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'एकादशी → दूसरा दिन' : 'Ekadashi \u2192 Second Day'}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'वृद्धि एकादशी में दूसरे दिन व्रत रखा जाता है। इससे व्रत द्वादशी में सही समय पर पारण तक फैलता है।'
                : 'When Ekadashi is Vriddhi, the fast is observed on the second day. This ensures the fast extends correctly into Dwadashi for proper Parana timing.'}
            </p>
          </div>
          <div className="rounded-xl p-4 border border-gold-primary/20 bg-gold-primary/5">
            <div className="text-gold-light font-bold text-sm mb-2" style={headingFont}>
              {isHi ? 'अन्य सभी तिथि → पहला दिन' : 'All Other Tithis \u2192 First Day'}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'गणेश चतुर्थी, शिवरात्रि, नवरात्रि आदि सभी उत्सवों में, वृद्धि तिथि होने पर प्रथम अवसर चुना जाता है।'
                : 'For Ganesh Chaturthi, Shivaratri, Navaratri, and all other festivals, the first occurrence is chosen when the tithi is Vriddhi.'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ 9. Tithis & Muhurta Selection ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.muhurtaTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.muhurtaDesc)}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'कार्य' : 'Activity'}</th>
                <th className="text-left py-2 px-3 text-emerald-400 text-xs uppercase tracking-wider">{isHi ? 'शुभ तिथि' : 'Good Tithis'}</th>
                <th className="text-left py-2 px-3 text-red-400 text-xs uppercase tracking-wider">{isHi ? 'त्याज्य' : 'Avoid'}</th>
                <th className="text-left py-2 px-3 text-text-tertiary text-xs uppercase tracking-wider">{isHi ? 'टिप्पणी' : 'Note'}</th>
              </tr>
            </thead>
            <tbody>
              {MUHURTA_GUIDE.map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-2.5 px-3 text-gold-light font-medium">{l(row.activity)}</td>
                  <td className="py-2.5 px-3 text-emerald-400/80 font-mono text-xs">{row.good}</td>
                  <td className="py-2.5 px-3 text-red-400/80 font-mono text-xs">{row.avoid}</td>
                  <td className="py-2.5 px-3 text-text-tertiary text-xs">{l(row.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ 10. Cross-References ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.crossRef)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/learn/nakshatras'}
              className="rounded-xl p-4 border border-gold-primary/10 bg-bg-secondary/20 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-bold text-sm group-hover:text-gold-primary transition-colors" style={headingFont}>
                {l(ref.label)}
              </div>
              <div className="text-text-tertiary text-xs mt-1 leading-relaxed">{l(ref.desc)}</div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══ CTA ═══ */}
      <div className="text-center pt-2">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {l(L.tryIt)}
        </Link>
      </div>
    </div>
  );
}

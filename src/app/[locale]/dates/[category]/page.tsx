'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, ArrowLeft, Clock, Moon, Sun, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, LocaleText } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { useLocationStore } from '@/stores/location-store';
import AuthorByline from '@/components/ui/AuthorByline';

// ─── Types ──────────────────────────────────────────────────────
// Festival entry from /api/calendar — single source of truth
interface FestivalEntry {
  name: LocaleText;
  date: string;
  paksha?: string;
  category: string;
  type?: string;
  slug?: string;
  description?: LocaleText;
  ekadashiStart?: string;
  ekadashiStartDate?: string;
  ekadashiEnd?: string;
  ekadashiEndDate?: string;
  paranaStart?: string;
  paranaEnd?: string;
}

// ─── Category Configuration ──────────────────────────────────────
const VALID_CATEGORIES = new Set(['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi']);

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  ekadashi: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
  purnima: { en: 'Purnima', hi: 'पूर्णिमा', sa: 'पूर्णिमा' },
  amavasya: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावस्या' },
  pradosham: { en: 'Pradosham', hi: 'प्रदोष', sa: 'प्रदोषम्' },
  chaturthi: { en: 'Chaturthi', hi: 'चतुर्थी', sa: 'चतुर्थी' },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_SHORT_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Calendar',
    completeDates: 'Complete Dates & Timings',
    next: 'Next',
    total: 'total in',
    date: 'Date',
    day: 'Day',
    name: 'Name',
    timings: 'Timings',
    paksha: 'Paksha',
    shukla: 'Shukla',
    krishna: 'Krishna',
    noEntries: 'No dates found for this month',
    jumpTo: 'Jump to month',
    loading: 'Loading...',
    aboutEkadashi: 'About Ekadashi',
    aboutEkadashiText1: 'Ekadashi is the eleventh Tithi (lunar day) of each fortnight in the Hindu calendar, falling twice every month — once during Shukla Paksha (waxing moon) and once during Krishna Paksha (waning moon). This yields approximately 24 named Ekadashis per year, each carrying a distinct spiritual narrative rooted in the Padma Purana and Bhavishya Purana. The Brihat Parashara Hora Shastra (BPHS) classifies Ekadashi as intrinsically sattvic — a day when the mind naturally inclines toward contemplation and restraint.',
    aboutEkadashiText2: 'The 24 Ekadashi cycle includes well-known observances such as Nirjala Ekadashi (Jyeshtha Shukla), considered the most austere because devotees abstain from both food and water for the entire day. Papankusha Ekadashi (Ashwin Shukla) is believed to absolve accumulated sins, while Devuthani Ekadashi (Kartik Shukla) marks the end of Chaturmas when Lord Vishnu awakens from cosmic sleep. Each Ekadashi 2026 date varies by location because the tithi boundary depends on local sunrise — this page computes exact timings for your coordinates.',
    aboutEkadashiText3: 'Ekadashi fasting rules are codified in the Hari Bhakti Vilasa. The standard practice is a complete fast from grains and beans (anna). Permitted foods include fruits, nuts, milk, root vegetables (potato, sweet potato), sabudana (tapioca), and rock salt (sendha namak). Regular table salt, rice, wheat, lentils, and mustard oil are strictly avoided. The scientific rationale aligns with modern intermittent fasting research: a 24-hour grain-free window gives the digestive system a periodic reset, reduces insulin spikes, and promotes autophagy — the body\'s cellular repair mechanism.',
    aboutEkadashiText4: 'Parana (breaking the fast) must be done the next day within the prescribed window — after sunrise but before the end of the Dwadashi tithi. If Dwadashi ends before sunrise the next day, parana should be done immediately after sunrise. Missing the parana window is considered as inauspicious as missing the fast itself. Regional variations exist: Smartha Ekadashi follows a different calendar calculation than Vaishnava Ekadashi, and in some years an extra (Adhik Masa) Ekadashi pair appears due to the intercalary month.',
    aboutPurnima: 'About Purnima',
    aboutPurnimaText1: 'Purnima is the full moon day — the fifteenth and final Tithi of Shukla Paksha when the lunar disc reaches complete illumination. It occurs once every synodic month (approximately 29.53 days) and holds a central position in Vedic timekeeping. In the Purnimant calendar system used across North India, Purnima marks the boundary between months: the month ends on the full moon day, making it the calendrical equivalent of December 31st in the Gregorian system.',
    aboutPurnimaText2: 'The Hindu year contains 12 to 13 named Purnimas, each tied to a specific observance. Guru Purnima (Ashadha) honors the guru lineage and Vyasa, the compiler of the Vedas. Sharad Purnima (Ashwin) is the harvest moon celebration when the moon is believed to shower amrit (nectar) — devotees prepare kheer left under moonlight. Kartik Purnima coincides with Dev Deepavali and is sacred for Ganga snan. Buddha Purnima (Vaishakha) celebrates the birth, enlightenment, and parinirvana of Gautama Buddha. Holi falls on Phalguna Purnima, and Raksha Bandhan on Shravana Purnima.',
    aboutPurnimaText3: 'Ayurveda and the Surya Siddhanta both document the moon\'s influence on biological rhythms. The gravitational pull at full moon measurably affects ocean tides, and traditional agricultural calendars time planting and harvesting around Purnima. The Charaka Samhita notes that kapha dosha peaks on Purnima, recommending lighter meals and meditative practice. Modern chronobiology confirms increased melatonin sensitivity and altered sleep architecture around the full moon — lending empirical weight to the ancient prescription of fasting and night vigil (jagran) on Purnima.',
    aboutPurnimaText4: 'Purnima observances typically include Satyanarayan Katha — a puja dedicated to Lord Vishnu recounted from the Skanda Purana, performed with panchamrit and offered to the community as prasad. Fasting on Purnima ranges from nirjala (waterless) to phalahari (fruit-only), depending on regional tradition. Charity (daan) given on Purnima — especially food, clothing, and sesame seeds — is considered to yield amplified spiritual merit. In 2026, each Purnima date and moonrise time is location-dependent; this page calculates them precisely for your coordinates.',
    aboutAmavasya: 'About Amavasya',
    aboutAmavasyaText1: 'Amavasya is the new moon day — the thirtieth and final Tithi of Krishna Paksha when the moon is entirely invisible. In the Amanta (Amavasyant) calendar system followed in Gujarat, Maharashtra, Karnataka, and South India, Amavasya marks the last day of the lunar month. The word derives from Sanskrit "ama" (together) and "vasya" (to dwell), signifying the conjunction of Sun and Moon — they occupy the same longitude in the sky, rendering the moon dark.',
    aboutAmavasyaText2: 'Amavasya holds paramount importance for Pitru Tarpan — ritual offerings of water, sesame seeds, and kusha grass to departed ancestors. The Garuda Purana and Markandeya Purana prescribe Amavasya as the day when the Pitru Loka (ancestral realm) is most accessible. Somvati Amavasya, falling on a Monday, is especially potent for tarpan and peepal tree worship. Mauni Amavasya (Magha) prescribes maun vrat (vow of silence) and holy river bathing — the Kumbh Mela\'s most sacred snan falls on this day.',
    aboutAmavasyaText3: 'The Diwali festival falls on Kartik Amavasya, transforming the otherwise somber new moon into the most celebrated night of the year. On this day, Lakshmi Puja is performed during the Pradosh Kaal and Nishita Kaal. Shani Amavasya (Saturday) is observed with mustard oil offerings to Lord Shani, believed to mitigate the malefic effects of Saturn in one\'s horoscope. Kali Puja, particularly in Bengal, coincides with Amavasya when the goddess Kali\'s fierce energy is honored through night-long worship.',
    aboutAmavasyaText4: 'While Amavasya is traditionally considered inauspicious for starting new ventures, marriages, or travel, it is regarded as deeply powerful for introspective and tantric practices. Meditation on Amavasya is said to penetrate deeper states of consciousness because external sensory distraction (moonlight) is absent. Ayurveda notes that Vata dosha increases on Amavasya, recommending warm, grounding foods and oil massage (abhyanga). Amavasya 2026 dates vary by timezone and location — this page provides exact timings computed for your coordinates.',
    aboutPradosham: 'About Pradosham',
    aboutPradoshamText1: 'Pradosham (Pradosh Vrat) falls on the thirteenth Tithi (Trayodashi) of each lunar fortnight — both Shukla and Krishna Paksha — yielding approximately 24 Pradosham days per year. The word "Pradosha" literally means "the first part of the night" and refers to the twilight period between sunset and nightfall. This 90-minute window, called Pradosh Kaal, is considered the most sacred time for Lord Shiva worship according to the Skanda Purana.',
    aboutPradoshamText2: 'The origin story of Pradosham comes from the Skanda Purana. When the gods and demons churned the cosmic ocean (Samudra Manthan), the deadly poison Halahala emerged during the Pradosh Kaal of Trayodashi. Lord Shiva consumed the poison to save creation, and Parvati pressed his throat to prevent it from descending — turning his throat blue (Neelakantha). Nandi, Shiva\'s divine bull, is said to have performed intense penance during this twilight hour, earning the boon that anyone who worships Shiva during Pradosh Kaal would receive swift grace.',
    aboutPradoshamText3: 'Shani Pradosham (Saturday) and Soma Pradosham (Monday) carry special significance. Shani Pradosham combines Saturn\'s karmic discipline with Shiva\'s transformative power — particularly recommended for those undergoing Sade Sati or Saturn Dasha in their horoscope. Soma Pradosham links the Moon\'s emotional healing with Shiva worship, prescribed for mental peace and emotional stability. Bhauma Pradosham (Tuesday) is observed for Mars-related remedies, especially Mangal Dosha.',
    aboutPradoshamText4: 'The Pradosham puja vidhi involves lighting a ghee lamp at twilight, offering bilva leaves, white flowers, and milk abhishekam to a Shiva Linga. Devotees observe a day-long fast, breaking it after the evening puja. The Maha Mrityunjaya Mantra and Rudram chanting during Pradosh Kaal are considered exceptionally potent. Pradosham 2026 dates and the exact Pradosh Kaal window depend on your local sunset time — this page calculates both for your location.',
    aboutChaturthi: 'About Chaturthi',
    aboutChaturthiText1: 'Chaturthi is the fourth Tithi of each lunar fortnight, sacred to Lord Ganesha — the remover of obstacles and the deity invoked at the beginning of every Hindu ceremony. The Ganapati Atharvashirsha Upanishad declares Ganesha as the primordial cosmic principle (Brahman) manifest in elephant form, and Chaturthi is his designated worship day in the Tithi cycle.',
    aboutChaturthiText2: 'Two types of Chaturthi recur monthly. Sankashti Chaturthi falls in Krishna Paksha (waning moon) and is the primary monthly Ganesha vrat. Devotees fast from sunrise until moonrise, and the fast is broken only after sighting the moon and performing Ganesh Puja. The moonrise time is therefore critical — it varies significantly by location and season. Vinayaka Chaturthi falls in Shukla Paksha (waxing moon) and is observed with morning puja and modak offerings, though it carries less austerity than Sankashti.',
    aboutChaturthiText3: 'The grand Ganesh Chaturthi festival (Bhadrapada Shukla Chaturthi, August-September) is a 10-day celebration culminating in Anant Chaturdashi. Established as a public festival by Lokmanya Tilak in 1893 to foster community unity, it features elaborate clay Ganesha installations (pandals), daily aarti, and the iconic visarjan (immersion) procession. The Chaturthi Chandra Dosha is a unique prohibition: on Bhadrapada Shukla Chaturthi, looking at the moon is said to bring false accusations (Syamantaka gem curse from the Bhagavata Purana). If seen accidentally, reciting the Syamantaka story or Krishna Stuti is the prescribed remedy.',
    aboutChaturthiText4: 'The modak (sweet dumpling) is Ganesha\'s signature offering — 21 modaks are traditionally prepared for Sankashti, representing the 21 chapters of the Ganesha Purana. Durva grass (bermuda grass) bundles of 3 or 5 blades are offered as they are believed to have cooling properties that please Ganesha. Each Chaturthi 2026 falls on a different weekday, and the moonrise time determines when the Sankashti fast can be broken — this page provides precise moonrise calculations for your location.',
    // Guide card labels
    guideTitle_ekadashi: 'Ekadashi Fasting Rules',
    guideTitle_purnima: 'Purnima Observance Guide',
    guideTitle_amavasya: 'Amavasya Dos & Don\'ts',
    guideTitle_pradosham: 'How to Observe Pradosham',
    guideTitle_chaturthi: 'Chaturthi Puja Guide',
    guide_ekadashi_1: 'Avoid all grains, beans, rice, wheat, and lentils',
    guide_ekadashi_2: 'Permitted: fruits, nuts, milk, root vegetables, sabudana, rock salt (sendha namak)',
    guide_ekadashi_3: 'Break fast (Parana) next day after sunrise but before Dwadashi tithi ends',
    guide_ekadashi_4: 'Nirjala Ekadashi: no food or water for the entire day',
    guide_ekadashi_5: 'Chant Vishnu Sahasranama or Om Namo Bhagavate Vasudevaya',
    guide_ekadashi_6: 'Avoid sleeping during daytime — stay awake for night vigil if possible',
    guide_purnima_1: 'Perform Satyanarayan Katha with panchamrit offering',
    guide_purnima_2: 'Fast options: Nirjala (waterless), Phalahari (fruit-only), or single meal',
    guide_purnima_3: 'Give daan (charity): food, clothing, sesame seeds, or cow feeding',
    guide_purnima_4: 'Observe jagran (night vigil) with kirtan and meditation',
    guide_purnima_5: 'Take holy river bath or visit temple at moonrise',
    guide_purnima_6: 'Prepare kheer and leave under moonlight on Sharad Purnima',
    guide_amavasya_do_1: 'Perform Pitru Tarpan with water, sesame, and kusha grass',
    guide_amavasya_do_2: 'Meditate — the dark moon supports deep introspection',
    guide_amavasya_do_3: 'Offer mustard oil lamp to Lord Shani (especially on Saturday)',
    guide_amavasya_do_4: 'Worship at peepal tree on Somvati Amavasya (Monday)',
    guide_amavasya_dont_1: 'Avoid starting new ventures, businesses, or journeys',
    guide_amavasya_dont_2: 'Avoid major purchases, contracts, or marriages',
    guide_amavasya_dont_3: 'Avoid cutting hair or nails (traditional prescription)',
    guide_amavasya_dont_4: 'Avoid consuming tamasic foods (meat, alcohol, stale food)',
    guide_pradosham_1: 'Begin worship during Pradosh Kaal — 90 minutes around sunset',
    guide_pradosham_2: 'Light a ghee lamp and offer bilva leaves to Shiva Linga',
    guide_pradosham_3: 'Perform milk abhishekam with white flowers',
    guide_pradosham_4: 'Chant Maha Mrityunjaya Mantra (108 times) or Sri Rudram',
    guide_pradosham_5: 'Fast from sunrise, break after evening puja',
    guide_pradosham_6: 'Shani Pradosham (Saturday): especially for Sade Sati relief',
    guide_chaturthi_1: 'Fast from sunrise until moonrise (Sankashti Chaturthi)',
    guide_chaturthi_2: 'Break fast only after sighting the moon and performing puja',
    guide_chaturthi_3: 'Offer 21 modaks and durva grass (3 or 5 blade bundles)',
    guide_chaturthi_4: 'Chant Ganapati Atharvashirsha or Om Gan Ganapataye Namaha',
    guide_chaturthi_5: 'Bhadrapada Chaturthi: do NOT look at the moon (Chandra Dosha)',
    guide_chaturthi_6: 'If moon seen accidentally on Ganesh Chaturthi, recite Syamantaka Katha',
    viewCalendar: 'View Festival Calendar',
  },
  hi: {
    back: 'कैलेंडर',
    completeDates: 'सम्पूर्ण तिथियाँ और समय',
    next: 'अगला',
    total: 'कुल',
    date: 'तिथि',
    day: 'दिन',
    name: 'नाम',
    timings: 'समय',
    paksha: 'पक्ष',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    noEntries: 'इस माह कोई तिथि नहीं मिली',
    jumpTo: 'माह पर जाएँ',
    loading: 'लोड हो रहा है...',
    aboutEkadashi: 'एकादशी के बारे में',
    aboutEkadashiText1: 'एकादशी हिन्दू पंचांग में प्रत्येक चान्द्र पक्ष की ग्यारहवीं तिथि है। प्रत्येक माह में दो एकादशियाँ होती हैं — एक शुक्ल पक्ष में और एक कृष्ण पक्ष में, जिससे वर्ष में लगभग 24 नामित एकादशियाँ आती हैं। पद्म पुराण और भविष्य पुराण में प्रत्येक एकादशी की अलग कथा वर्णित है। बृहत् पराशर होरा शास्त्र (BPHS) एकादशी को सात्विक तिथि मानता है जब मन स्वाभाविक रूप से चिन्तन और संयम की ओर प्रवृत्त होता है।',
    aboutEkadashiText2: '24 एकादशी चक्र में निर्जला एकादशी (ज्येष्ठ शुक्ल) सबसे कठोर मानी जाती है क्योंकि भक्त पूरे दिन अन्न और जल दोनों का त्याग करते हैं। पापांकुशा एकादशी (आश्विन शुक्ल) पापों के नाश के लिए प्रसिद्ध है, जबकि देवउठनी एकादशी (कार्तिक शुक्ल) चातुर्मास के अन्त में भगवान विष्णु के जागरण का पर्व है। एकादशी 2026 की तिथियाँ स्थान-आधारित हैं क्योंकि तिथि सीमा स्थानीय सूर्योदय पर निर्भर करती है।',
    aboutEkadashiText3: 'एकादशी व्रत के नियम हरि भक्ति विलास में संहिताबद्ध हैं। मुख्य नियम अन्न (अनाज और दालों) का पूर्ण त्याग है। फल, मेवे, दूध, कन्द-मूल (आलू, शकरकन्द), साबूदाना और सेंधा नमक वर्जित नहीं हैं। सामान्य नमक, चावल, गेहूँ, दालें और सरसों का तेल वर्जित हैं। आधुनिक विज्ञान इसे इन्टरमिटेन्ट फ़ास्टिंग से जोड़ता है — 24 घण्टे का अन्न-मुक्त उपवास पाचन तन्त्र को विश्राम देता है।',
    aboutEkadashiText4: 'पारण (व्रत तोड़ना) अगले दिन निर्धारित समय-सीमा में करना अनिवार्य है — सूर्योदय के बाद किन्तु द्वादशी तिथि के समाप्त होने से पहले। स्मार्त और वैष्णव एकादशी की गणना में अन्तर होता है, और अधिक मास में एक अतिरिक्त एकादशी जोड़ी आती है।',
    aboutPurnima: 'पूर्णिमा के बारे में',
    aboutPurnimaText1: 'पूर्णिमा पूर्ण चन्द्रमा का दिन है — शुक्ल पक्ष की पन्द्रहवीं और अन्तिम तिथि जब चन्द्र बिम्ब पूर्ण प्रकाशित होता है। यह प्रत्येक चान्द्र मास (लगभग 29.53 दिन) में एक बार आती है। पूर्णिमान्त पंचांग में, जो उत्तर भारत में प्रचलित है, पूर्णिमा मास की सीमा है — मास पूर्णिमा को समाप्त होता है।',
    aboutPurnimaText2: 'हिन्दू वर्ष में 12 से 13 नामित पूर्णिमाएँ होती हैं। गुरु पूर्णिमा (आषाढ़) गुरु परम्परा और वेदव्यास को समर्पित है। शरद पूर्णिमा (आश्विन) को चन्द्रमा अमृत वर्षा करता है — भक्त खीर चाँदनी में रखते हैं। कार्तिक पूर्णिमा देव दीपावली के साथ मनाई जाती है। बुद्ध पूर्णिमा (वैशाख) गौतम बुद्ध के जन्म, बोधि और परिनिर्वाण का पर्व है। होली फाल्गुन पूर्णिमा पर और रक्षा बन्धन श्रावण पूर्णिमा पर पड़ता है।',
    aboutPurnimaText3: 'आयुर्वेद और सूर्य सिद्धान्त दोनों चन्द्रमा के जैविक लय पर प्रभाव का वर्णन करते हैं। पूर्णिमा पर समुद्री ज्वार-भाटा अधिकतम होता है। चरक संहिता के अनुसार पूर्णिमा पर कफ दोष बढ़ता है, इसलिए हल्का भोजन और ध्यान की सलाह दी जाती है। आधुनिक शोध भी पूर्णिमा पर नींद के पैटर्न में बदलाव की पुष्टि करता है।',
    aboutPurnimaText4: 'पूर्णिमा पर सत्यनारायण कथा (स्कन्द पुराण) का पाठ, पंचामृत से पूजा और प्रसाद वितरण प्रमुख अनुष्ठान हैं। उपवास निर्जला से लेकर फलाहार तक हो सकता है। पूर्णिमा पर दान — विशेषकर अन्न, वस्त्र और तिल — का पुण्य बहुगुणित माना जाता है। पूर्णिमा 2026 की तिथियाँ और चन्द्रोदय का समय स्थान पर निर्भर हैं।',
    aboutAmavasya: 'अमावस्या के बारे में',
    aboutAmavasyaText1: 'अमावस्या कृष्ण पक्ष की तीसवीं और अन्तिम तिथि है जब चन्द्रमा पूर्णतः अदृश्य होता है। अमान्त (अमावस्यान्त) पंचांग में, जो गुजरात, महाराष्ट्र, कर्नाटक और दक्षिण भारत में प्रचलित है, अमावस्या मास का अन्तिम दिन है। संस्कृत में "अमा" (साथ) और "वस्य" (निवास) — सूर्य और चन्द्रमा का एक ही अंश पर संयोग।',
    aboutAmavasyaText2: 'अमावस्या पितृ तर्पण के लिए सर्वाधिक महत्वपूर्ण है — जल, तिल और कुश से पितरों को अर्पण किया जाता है। गरुड़ पुराण और मार्कण्डेय पुराण के अनुसार अमावस्या पर पितृ लोक सबसे सुलभ होता है। सोमवती अमावस्या (सोमवार) तर्पण और पीपल पूजा के लिए विशेष शुभ है। मौनी अमावस्या (माघ) पर मौन व्रत और पवित्र नदी स्नान का विधान है — कुम्भ मेले का मुख्य स्नान इसी दिन होता है।',
    aboutAmavasyaText3: 'दीपावली कार्तिक अमावस्या पर पड़ती है — अन्यथा शान्त अमावस्या वर्ष की सबसे भव्य रात्रि बन जाती है। इस दिन प्रदोष काल और निशीथ काल में लक्ष्मी पूजा होती है। शनि अमावस्या (शनिवार) पर शनि देव को सरसों का तेल अर्पित किया जाता है। बंगाल में काली पूजा अमावस्या पर रात्रि भर की जाती है।',
    aboutAmavasyaText4: 'अमावस्या नए कार्य, विवाह या यात्रा के लिए अशुभ मानी जाती है, किन्तु ध्यान और आन्तरिक साधना के लिए अत्यन्त शक्तिशाली है। आयुर्वेद के अनुसार अमावस्या पर वात दोष बढ़ता है — गर्म, पौष्टिक भोजन और तेल मालिश (अभ्यंग) की सलाह दी जाती है। अमावस्या 2026 की तिथियाँ समय क्षेत्र और स्थान पर निर्भर हैं।',
    aboutPradosham: 'प्रदोष के बारे में',
    aboutPradoshamText1: 'प्रदोष व्रत प्रत्येक चान्द्र पक्ष की त्रयोदशी (13वीं) तिथि को पड़ता है — शुक्ल और कृष्ण दोनों पक्षों में — जिससे वर्ष में लगभग 24 प्रदोष आते हैं। "प्रदोष" का शाब्दिक अर्थ "रात्रि का प्रथम भाग" है — सूर्यास्त और रात्रि के बीच का सन्ध्याकाल। स्कन्द पुराण के अनुसार यह 90 मिनट का प्रदोष काल भगवान शिव की पूजा के लिए सर्वश्रेष्ठ है।',
    aboutPradoshamText2: 'प्रदोष की कथा स्कन्द पुराण से आती है। समुद्र मन्थन में त्रयोदशी के प्रदोष काल में हालाहल विष प्रकट हुआ। भगवान शिव ने सृष्टि रक्षा हेतु विष पान किया और पार्वती ने उनका कण्ठ दबाया — जिससे वे नीलकण्ठ कहलाए। नन्दी ने इसी सन्ध्या काल में कठोर तपस्या कर वरदान प्राप्त किया कि प्रदोष काल में शिव पूजा करने वालों पर शीघ्र कृपा होगी।',
    aboutPradoshamText3: 'शनि प्रदोष (शनिवार) और सोम प्रदोष (सोमवार) विशेष महत्व रखते हैं। शनि प्रदोष शनि की कर्म-शक्ति और शिव की रूपान्तरण शक्ति का संयोग है — साढ़े साती या शनि दशा वालों के लिए विशेष रूप से अनुशंसित। सोम प्रदोष चन्द्रमा की शान्ति और मानसिक स्थिरता के लिए प्रसिद्ध है।',
    aboutPradoshamText4: 'प्रदोष पूजा विधि में सन्ध्याकाल में घी का दीपक जलाना, शिव लिंग पर बिल्व पत्र और श्वेत पुष्प अर्पित करना, तथा दुग्ध अभिषेक शामिल है। भक्त सूर्योदय से उपवास रखते हैं और सन्ध्या पूजा के बाद व्रत तोड़ते हैं। प्रदोष काल में महामृत्युञ्जय मन्त्र (108 बार) और रुद्रम् का पाठ अत्यन्त प्रभावशाली माना जाता है।',
    aboutChaturthi: 'चतुर्थी के बारे में',
    aboutChaturthiText1: 'चतुर्थी प्रत्येक चान्द्र पक्ष की चौथी तिथि है, जो विघ्नहर्ता भगवान गणेश को समर्पित है। गणपति अथर्वशीर्ष उपनिषद् गणेश को ब्रह्म का गजरूपी साक्षात्कार घोषित करता है, और चतुर्थी तिथि चक्र में उनका निर्धारित पूजा दिवस है।',
    aboutChaturthiText2: 'दो प्रकार की चतुर्थी प्रतिमास आती हैं। संकष्टी चतुर्थी कृष्ण पक्ष (ढलते चन्द्र) में पड़ती है और मुख्य मासिक गणेश व्रत है। भक्त सूर्योदय से चन्द्रोदय तक उपवास रखते हैं और चन्द्र दर्शन व गणेश पूजा के बाद ही व्रत तोड़ते हैं। चन्द्रोदय का समय स्थान और ऋतु के अनुसार बहुत भिन्न होता है। विनायक चतुर्थी शुक्ल पक्ष में पड़ती है जिसमें प्रातः पूजा और मोदक अर्पण किया जाता है।',
    aboutChaturthiText3: 'भव्य गणेश चतुर्थी महोत्सव (भाद्रपद शुक्ल चतुर्थी) 10 दिन का उत्सव है जो अनन्त चतुर्दशी पर समाप्त होता है। 1893 में लोकमान्य तिलक ने इसे सार्वजनिक उत्सव के रूप में स्थापित किया। चतुर्थी चन्द्र दोष एक विशेष निषेध है — भाद्रपद शुक्ल चतुर्थी पर चन्द्र दर्शन से मिथ्या आरोप लगने की मान्यता है (भागवत पुराण का स्यमन्तक मणि प्रसंग)।',
    aboutChaturthiText4: 'मोदक गणेश का प्रिय भोग है — संकष्टी पर 21 मोदक अर्पित किए जाते हैं जो गणेश पुराण के 21 अध्यायों का प्रतीक हैं। दूर्वा (दूब) घास की 3 या 5 पत्तियों की गुच्छी अर्पित की जाती है। चतुर्थी 2026 की प्रत्येक तिथि भिन्न वार पर पड़ती है और संकष्टी व्रत के लिए चन्द्रोदय का सटीक समय आवश्यक है।',
    guideTitle_ekadashi: 'एकादशी व्रत के नियम',
    guideTitle_purnima: 'पूर्णिमा पालन मार्गदर्शिका',
    guideTitle_amavasya: 'अमावस्या — क्या करें, क्या न करें',
    guideTitle_pradosham: 'प्रदोष व्रत कैसे करें',
    guideTitle_chaturthi: 'चतुर्थी पूजा मार्गदर्शिका',
    guide_ekadashi_1: 'सभी अनाज, दालें, चावल, गेहूँ का त्याग करें',
    guide_ekadashi_2: 'अनुमत: फल, मेवे, दूध, कन्द-मूल, साबूदाना, सेंधा नमक',
    guide_ekadashi_3: 'पारण अगले दिन सूर्योदय के बाद, द्वादशी समाप्ति से पहले करें',
    guide_ekadashi_4: 'निर्जला एकादशी: पूरे दिन अन्न और जल दोनों का त्याग',
    guide_ekadashi_5: 'विष्णु सहस्रनाम या ॐ नमो भगवते वासुदेवाय का जाप करें',
    guide_ekadashi_6: 'दिन में सोने से बचें — यथासम्भव रात्रि जागरण करें',
    guide_purnima_1: 'पंचामृत से सत्यनारायण कथा का पाठ करें',
    guide_purnima_2: 'उपवास: निर्जला, फलाहार, या एक समय भोजन',
    guide_purnima_3: 'दान करें: अन्न, वस्त्र, तिल, या गौ सेवा',
    guide_purnima_4: 'रात्रि जागरण कीर्तन और ध्यान के साथ करें',
    guide_purnima_5: 'चन्द्रोदय पर पवित्र नदी स्नान या मन्दिर दर्शन करें',
    guide_purnima_6: 'शरद पूर्णिमा पर खीर चाँदनी में रखें',
    guide_amavasya_do_1: 'जल, तिल और कुश से पितृ तर्पण करें',
    guide_amavasya_do_2: 'ध्यान करें — अन्धकार चन्द्र गहन आत्मनिरीक्षण में सहायक है',
    guide_amavasya_do_3: 'शनि देव को सरसों के तेल का दीपक अर्पित करें (विशेषकर शनिवार)',
    guide_amavasya_do_4: 'सोमवती अमावस्या पर पीपल वृक्ष की पूजा करें',
    guide_amavasya_dont_1: 'नए कार्य, व्यापार या यात्रा आरम्भ न करें',
    guide_amavasya_dont_2: 'बड़ी ख़रीदारी, अनुबन्ध या विवाह से बचें',
    guide_amavasya_dont_3: 'बाल या नाखून न कटवाएँ (पारम्परिक विधान)',
    guide_amavasya_dont_4: 'तामसिक भोजन (माँस, मद्य, बासी भोजन) का त्याग करें',
    guide_pradosham_1: 'प्रदोष काल में पूजा आरम्भ करें — सूर्यास्त के 90 मिनट',
    guide_pradosham_2: 'घी का दीपक जलाएँ और शिव लिंग पर बिल्व पत्र अर्पित करें',
    guide_pradosham_3: 'श्वेत पुष्पों के साथ दुग्ध अभिषेक करें',
    guide_pradosham_4: 'महामृत्युञ्जय मन्त्र (108 बार) या श्री रुद्रम् का पाठ करें',
    guide_pradosham_5: 'सूर्योदय से उपवास, सन्ध्या पूजा के बाद व्रत तोड़ें',
    guide_pradosham_6: 'शनि प्रदोष (शनिवार): साढ़े साती शान्ति के लिए विशेष',
    guide_chaturthi_1: 'सूर्योदय से चन्द्रोदय तक उपवास (संकष्टी चतुर्थी)',
    guide_chaturthi_2: 'चन्द्र दर्शन और पूजा के बाद ही व्रत तोड़ें',
    guide_chaturthi_3: '21 मोदक और दूर्वा घास (3 या 5 पत्तियों की गुच्छी) अर्पित करें',
    guide_chaturthi_4: 'गणपति अथर्वशीर्ष या ॐ गं गणपतये नमः का जाप करें',
    guide_chaturthi_5: 'भाद्रपद चतुर्थी: चन्द्रमा न देखें (चन्द्र दोष)',
    guide_chaturthi_6: 'गणेश चतुर्थी पर भूल से चन्द्र दर्शन हो जाए तो स्यमन्तक कथा का पाठ करें',
    viewCalendar: 'त्योहार कैलेंडर देखें',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    completeDates: 'सम्पूर्णतिथयः समयश्च',
    next: 'अग्रिम',
    total: 'कुल',
    date: 'दिनाङ्कः',
    day: 'वासरः',
    name: 'नाम',
    timings: 'कालः',
    paksha: 'पक्षः',
    shukla: 'शुक्लः',
    krishna: 'कृष्णः',
    noEntries: 'अस्मिन् मासे तिथिः न प्राप्ता',
    jumpTo: 'मासं गच्छतु',
    loading: 'लोड हो रहा है...',
    aboutEkadashi: 'एकादश्याः विषये',
    aboutEkadashiText1: 'एकादशी हिन्दूपञ्चाङ्गे प्रत्येकपक्षस्य एकादशतिथिः। प्रत्येकमासे द्वे एकादश्यौ भवतः — एका शुक्लपक्षे एका कृष्णपक्षे। एकादशीव्रतं हिन्दूधर्मस्य महत्वपूर्णव्रतेषु अन्यतमम्।',
    aboutEkadashiText2: 'निर्जलैकादशी ज्येष्ठशुक्लपक्षे कठोरतमा मन्यते। देवोत्थानैकादशी कार्तिकशुक्लपक्षे चातुर्मासान्ते विष्णोः जागरणपर्व भवति।',
    aboutEkadashiText3: 'एकादशीव्रतनियमाः हरिभक्तिविलासे संहिताबद्धाः। अन्नत्यागः मुख्यः — फलानि दुग्धं कन्दमूलानि अनुमतानि।',
    aboutEkadashiText4: 'पारणं परदिने सूर्योदयानन्तरं द्वादशीसमाप्तेः पूर्वं करणीयम्।',
    aboutPurnima: 'पूर्णिमायाः विषये',
    aboutPurnimaText1: 'पूर्णिमा पूर्णचन्द्रदिनम् शुक्लपक्षस्य पञ्चदशतिथिः। एतत् हिन्दूपञ्चाङ्गस्य शुभतमदिनेषु अन्यतमम्।',
    aboutPurnimaText2: 'गुरुपूर्णिमा व्यासदेवाय समर्पिता। शरद्पूर्णिमायां चन्द्रमाः अमृतवर्षं करोति। कार्तिकपूर्णिमा देवदीपावल्या सह मन्यते।',
    aboutPurnimaText3: 'सूर्यसिद्धान्ते चन्द्रस्य जैविकलयप्रभावः वर्णितः। चरकसंहितानुसारं पूर्णिमायां कफदोषः वर्धते।',
    aboutPurnimaText4: 'सत्यनारायणकथापाठः पञ्चामृतेन पूजा च पूर्णिमायाः प्रमुखानुष्ठानानि।',
    aboutAmavasya: 'अमावस्यायाः विषये',
    aboutAmavasyaText1: 'अमावस्या कृष्णपक्षस्य अन्तिमा तिथिः यदा चन्द्रमाः न दृश्यते। पितृतर्पणाय शनिपूजायै महत्वपूर्णा।',
    aboutAmavasyaText2: 'गरुडपुराणे अमावस्यायां पितृलोकः सुलभतमः इति वर्णितम्। सोमवत्यमावस्या तर्पणाय विशेषशुभा।',
    aboutAmavasyaText3: 'दीपावली कार्तिकामावस्यायां भवति। शन्यमावस्यायां सर्षपतैलं शनिदेवाय अर्प्यते।',
    aboutAmavasyaText4: 'अमावस्या नवकार्याय अशुभा किन्तु ध्यानाय अत्यन्तं शक्तिशालिनी मन्यते।',
    aboutPradosham: 'प्रदोषस्य विषये',
    aboutPradoshamText1: 'प्रदोषव्रतं प्रत्येकपक्षस्य त्रयोदशीतिथौ भवति। एतत् शिवदेवाय समर्पितम्।',
    aboutPradoshamText2: 'स्कन्दपुराणे समुद्रमन्थने त्रयोदश्याः प्रदोषकाले हालाहलं प्रकटितम्। शिवः विषं पीतवान्।',
    aboutPradoshamText3: 'शनिप्रदोषः शनिवासरे सोमप्रदोषः सोमवासरे च विशेषमहत्वं धारयतः।',
    aboutPradoshamText4: 'प्रदोषपूजाविधौ सन्ध्याकाले घृतदीपः बिल्वपत्राणि दुग्धाभिषेकश्च विहिताः।',
    aboutChaturthi: 'चतुर्थ्याः विषये',
    aboutChaturthiText1: 'चतुर्थी प्रत्येकपक्षस्य चतुर्थतिथिः गणेशदेवाय समर्पिता। कृष्णचतुर्थी सङ्कष्टिचतुर्थी इति कथ्यते।',
    aboutChaturthiText2: 'सङ्कष्टिचतुर्थ्यां सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः क्रियते। चन्द्रदर्शनानन्तरं व्रतभङ्गः।',
    aboutChaturthiText3: 'गणेशचतुर्थी (भाद्रपदशुक्लचतुर्थी) दशदिनात्मकम् उत्सवम्। चतुर्थीचन्द्रदोषे चन्द्रदर्शनं वर्जितम्।',
    aboutChaturthiText4: 'मोदकाः गणेशस्य प्रियभोगाः। एकविंशतिमोदकाः अर्प्यन्ते। दूर्वादलानि त्रीणि पञ्च वा अर्प्यन्ते।',
    guideTitle_ekadashi: 'एकादशीव्रतनियमाः',
    guideTitle_purnima: 'पूर्णिमापालनमार्गदर्शिका',
    guideTitle_amavasya: 'अमावस्या — कर्तव्यम् अकर्तव्यं च',
    guideTitle_pradosham: 'प्रदोषव्रतविधिः',
    guideTitle_chaturthi: 'चतुर्थीपूजामार्गदर्शिका',
    viewCalendar: 'पर्वपञ्चाङ्गं पश्यतु',
  },
};

// ─── Animation Variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────
function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

function formatDateDisplay(dateStr: string, locale: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  const months = isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES;
  return `${d} ${months[m - 1]}`;
}

// ─── Component ───────────────────────────────────────────────────
export default function DateCategoryPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const category = (params?.category as string) || 'ekadashi';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;
  const catLabel = CATEGORY_LABELS[category]?.[locale] || CATEGORY_LABELS[category]?.en || category;

  const [year, setYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<FestivalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const storeLat = useLocationStore(s => s.lat);
  const storeLng = useLocationStore(s => s.lng);
  const storeTz = useLocationStore(s => s.timezone);

  // Fetch from the SAME /api/calendar endpoint used by the festival calendar page.
  // Single source of truth — no separate tithi table computation.
  useEffect(() => {
    setLoading(true);
    const lat = storeLat ?? 28.6139;
    const lng = storeLng ?? 77.209;
    const tz = storeTz ?? 'Asia/Kolkata';
    fetch(`/api/calendar?year=${year}&lat=${lat}&lon=${lng}&timezone=${encodeURIComponent(tz)}`)
      .then(r => r.json())
      .then(data => {
        const all: FestivalEntry[] = data.festivals || [];
        // Filter by category — same data as the calendar page
        const filtered = all
          .filter(f => f.category === category)
          .sort((a, b) => a.date.localeCompare(b.date));
        setEntries(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, category, storeLat, storeLng, storeTz]);

  // Group by Gregorian month
  const monthlyGroups = useMemo(() => {
    const groups: Record<number, FestivalEntry[]> = {};
    for (let m = 1; m <= 12; m++) groups[m] = [];
    for (const e of entries) {
      const month = parseInt(e.date.split('-')[1], 10);
      if (groups[month]) groups[month].push(e);
    }
    return groups;
  }, [entries]);

  // Find next upcoming date
  const today = new Date().toISOString().slice(0, 10);
  const nextEntry = entries.find(e => e.date >= today);

  if (!VALID_CATEGORIES.has(category)) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-secondary text-lg">Category not found.</p>
      </div>
    );
  }

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/dates/${category}`, locale);

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/calendar" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-light transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {L.back}
          </Link>
        </motion.div>

        {/* H1 Title */}
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
          style={headingFont}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {catLabel} {year} — {L.completeDates}
        </motion.h1>

        {/* Year Navigator */}
        <motion.div
          className="flex items-center gap-4 mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setYear(y => y - 1)}
            className="p-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-text-secondary hover:text-gold-light"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            {[year - 1, year, year + 1].map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  y === year
                    ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                    : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <button
            onClick={() => setYear(y => y + 1)}
            className="p-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-text-secondary hover:text-gold-light"
            aria-label="Next year"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
            <span className="ml-3 text-text-secondary">{L.loading}</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Summary Stats */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary border border-gold-primary/15">
                <Calendar className="w-5 h-5 text-gold-primary" />
                <span className="text-text-primary font-semibold">{entries.length}</span>
                <span className="text-text-secondary">{catLabel} {L.total} {year}</span>
              </div>
              {nextEntry && year === new Date().getFullYear() && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">
                    {L.next}: {formatDateDisplay(nextEntry.date, locale)}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Month Quick Nav */}
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <span className="text-text-secondary text-sm self-center mr-1">{L.jumpTo}:</span>
              {MONTH_NAMES.map((m, idx) => {
                const count = monthlyGroups[idx + 1]?.length || 0;
                return (
                  <a
                    key={m}
                    href={`#month-${idx + 1}`}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      count > 0
                        ? 'bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 border border-gold-primary/15'
                        : 'bg-bg-secondary/50 text-text-secondary/50 cursor-default border border-transparent'
                    }`}
                  >
                    {(isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES)[idx].slice(0, 3)}
                    {count > 0 && <span className="ml-1 text-gold-primary/70">({count})</span>}
                  </a>
                );
              })}
            </motion.div>

            <GoldDivider className="mb-10" />

            {/* Monthly Sections */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
              const monthEntries = monthlyGroups[month] || [];
              const monthName = (isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES)[month - 1];

              return (
                <motion.section
                  key={month}
                  id={`month-${month}`}
                  className="mb-10"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  custom={0}
                >
                  <h2
                    className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2"
                    style={headingFont}
                  >
                    {month % 2 === 0 ? <Moon className="w-5 h-5 text-gold-primary/60" /> : <Sun className="w-5 h-5 text-gold-primary/60" />}
                    {monthName} {year}
                    <span className="text-sm font-normal text-text-secondary ml-2">
                      ({monthEntries.length} {catLabel})
                    </span>
                  </h2>

                  {monthEntries.length === 0 ? (
                    <p className="text-text-secondary text-sm italic pl-7">{L.noEntries}</p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gold-primary/10 bg-bg-secondary/50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gold-primary/10 text-text-secondary">
                            <th className="text-left px-4 py-3 font-medium">{L.date}</th>
                            <th className="text-left px-4 py-3 font-medium">{L.day}</th>
                            <th className="text-left px-4 py-3 font-medium">{L.name}</th>
                            <th className="text-left px-4 py-3 font-medium">{L.timings}</th>
                            <th className="text-left px-4 py-3 font-medium">{L.paksha}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthEntries.map((entry, idx) => {
                            const dow = getDayOfWeek(entry.date);
                            const dayName = isDevanagariLocale(locale) ? DAY_NAMES_SHORT_HI[dow] : DAY_NAMES_SHORT[dow];
                            const isUpcoming = entry.date >= today && entry.date === nextEntry?.date;
                            // Timings: use ekadashi-specific fields if available, otherwise show date
                            const timingStart = entry.ekadashiStart || '';
                            const timingEnd = entry.ekadashiEnd || '';
                            const timingDisplay = timingStart && timingEnd ? `${timingStart} — ${timingEnd}` : '—';
                            const paksha = entry.paksha || '';
                            return (
                              <motion.tr
                                key={`${entry.date}-${paksha}-${idx}`}
                                className={`border-b border-gold-primary/5 transition-colors hover:bg-gold-primary/5 ${
                                  isUpcoming ? 'bg-emerald-500/5' : ''
                                }`}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={idx}
                              >
                                <td className="px-4 py-3 text-text-primary font-medium whitespace-nowrap">
                                  {formatDateDisplay(entry.date, locale)}
                                  {isUpcoming && (
                                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                                      {L.next}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{dayName}</td>
                                <td className="px-4 py-3 text-text-primary font-medium">
                                  {tl(entry.name, locale)}
                                </td>
                                <td className="px-4 py-3 text-text-secondary whitespace-nowrap font-mono text-xs">
                                  {timingDisplay}
                                </td>
                                <td className="px-4 py-3">
                                  {paksha && (
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                      paksha === 'shukla'
                                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                        : 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                                    }`}>
                                      {paksha === 'shukla' ? L.shukla : L.krishna}
                                    </span>
                                  )}
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.section>
              );
            })}

            <GoldDivider className="my-10" />

            {/* Educational Section */}
            <motion.section
              className="mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <h2
                className="text-2xl font-bold text-gold-light mb-4"
                style={headingFont}
              >
                {L[`about${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof L] || `About ${catLabel}`}
              </h2>
              <div className="space-y-4 max-w-3xl">
                {[1, 2, 3, 4].map(n => {
                  const key = `about${category.charAt(0).toUpperCase() + category.slice(1)}Text${n}` as keyof typeof L;
                  const text = L[key];
                  return text ? (
                    <p key={n} className="text-text-secondary leading-relaxed">
                      {text}
                    </p>
                  ) : null;
                })}
              </div>
            </motion.section>

            {/* Guide Card */}
            <motion.section
              className="mb-10 max-w-3xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <div className="rounded-xl border border-gold-primary/20 bg-bg-secondary/80 overflow-hidden">
                <div className="px-5 py-4 border-b border-gold-primary/15 bg-gold-primary/5">
                  <h3 className="text-lg font-bold text-gold-light" style={headingFont}>
                    {L[`guideTitle_${category}` as keyof typeof L] || ''}
                  </h3>
                </div>
                <div className="px-5 py-4">
                  {category === 'amavasya' ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                          {locale === 'hi' ? 'क्या करें' : locale === 'sa' ? 'कर्तव्यम्' : 'Do'}
                        </h4>
                        <ul className="space-y-2">
                          {[1, 2, 3, 4].map(n => {
                            const text = L[`guide_amavasya_do_${n}` as keyof typeof L];
                            return text ? (
                              <li key={n} className="flex items-start gap-2 text-sm text-text-secondary">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                {text}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                          {locale === 'hi' ? 'क्या न करें' : locale === 'sa' ? 'अकर्तव्यम्' : 'Don\'t'}
                        </h4>
                        <ul className="space-y-2">
                          {[1, 2, 3, 4].map(n => {
                            const text = L[`guide_amavasya_dont_${n}` as keyof typeof L];
                            return text ? (
                              <li key={n} className="flex items-start gap-2 text-sm text-text-secondary">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                {text}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-2.5">
                      {[1, 2, 3, 4, 5, 6].map(n => {
                        const text = L[`guide_${category}_${n}` as keyof typeof L];
                        return text ? (
                          <li key={n} className="flex items-start gap-2.5 text-sm text-text-secondary">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold-primary shrink-0" />
                            {text}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </motion.section>

            <AuthorByline className="max-w-3xl" />

            {/* Link to Calendar */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 border border-gold-primary/20 hover:border-gold-primary/40 transition-all font-medium"
              >
                <Calendar className="w-5 h-5" />
                {L.viewCalendar}
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}

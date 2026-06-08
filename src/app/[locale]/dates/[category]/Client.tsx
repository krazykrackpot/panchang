"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Clock,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import { Link } from "@/lib/i18n/navigation";
import { tl } from "@/lib/utils/trilingual";
import { generateBreadcrumbLD } from "@/lib/seo/structured-data";
import type { Locale, LocaleText } from "@/types/panchang";
import { isDevanagariLocale } from "@/lib/utils/locale-fonts";
import { safeJsonLd } from "@/lib/seo/safe-jsonld";
import { useLocationStore } from "@/stores/location-store";
import AuthorByline from "@/components/ui/AuthorByline";
import VratFollowButton from "@/components/vrat/VratFollowButton";
import { fetchApiGeo } from "@/lib/utils/geo-from-api";

// ─── Types ──────────────────────────────────────────────────────
// Festival entry from /api/calendar  –  single source of truth
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
const VALID_CATEGORIES = new Set([
  "ekadashi",
  "purnima",
  "amavasya",
  "pradosham",
  "chaturthi",
]);

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  ekadashi: { en: "Ekadashi", hi: "एकादशी", sa: "एकादशी" },
  purnima: { en: "Purnima", hi: "पूर्णिमा", sa: "पूर्णिमा" },
  amavasya: { en: "Amavasya", hi: "अमावस्या", sa: "अमावस्या" },
  pradosham: { en: "Pradosham", hi: "प्रदोष", sa: "प्रदोषम्" },
  chaturthi: { en: "Chaturthi", hi: "चतुर्थी", sa: "चतुर्थी" },
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NAMES_HI = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितम्बर",
  "अक्टूबर",
  "नवम्बर",
  "दिसम्बर",
];

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_SHORT_HI = [
  "रवि",
  "सोम",
  "मंगल",
  "बुध",
  "गुरु",
  "शुक्र",
  "शनि",
];

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: "Calendar",
    completeDates: "Complete Dates & Timings",
    next: "Next",
    total: "total in",
    date: "Date",
    day: "Day",
    name: "Name",
    timings: "Timings",
    paksha: "Paksha",
    shukla: "Shukla",
    krishna: "Krishna",
    noEntries: "No dates found for this month",
    jumpTo: "Jump to month",
    loading: "Loading...",
    aboutEkadashi: "About Ekadashi",
    aboutEkadashiText1:
      "Ekadashi is the eleventh Tithi (lunar day) of each fortnight in the Hindu calendar, falling twice every month  –  once during Shukla Paksha (waxing moon) and once during Krishna Paksha (waning moon). This yields approximately 24 named Ekadashis per year, each carrying a distinct spiritual narrative rooted in the Padma Purana and Bhavishya Purana. The Brihat Parashara Hora Shastra (BPHS) classifies Ekadashi as intrinsically sattvic  –  a day when the mind naturally inclines toward contemplation and restraint.",
    aboutEkadashiText2:
      "The 24 Ekadashi cycle includes well-known observances such as Nirjala Ekadashi (Jyeshtha Shukla), considered the most austere because devotees abstain from both food and water for the entire day. Papankusha Ekadashi (Ashwin Shukla) is believed to absolve accumulated sins, while Devuthani Ekadashi (Kartik Shukla) marks the end of Chaturmas when Lord Vishnu awakens from cosmic sleep. Each Ekadashi 2026 date varies by location because the tithi boundary depends on local sunrise  –  this page computes exact timings for your coordinates.",
    aboutEkadashiText3:
      "Ekadashi fasting rules are codified in the Hari Bhakti Vilasa. The standard practice is a complete fast from grains and beans (anna). Permitted foods include fruits, nuts, milk, root vegetables (potato, sweet potato), sabudana (tapioca), and rock salt (sendha namak). Regular table salt, rice, wheat, lentils, and mustard oil are strictly avoided. The scientific rationale aligns with modern intermittent fasting research: a 24-hour grain-free window gives the digestive system a periodic reset, reduces insulin spikes, and promotes autophagy  –  the body's cellular repair mechanism.",
    aboutEkadashiText4:
      "Parana (breaking the fast) must be done the next day within the prescribed window  –  after sunrise but before the end of the Dwadashi tithi. If Dwadashi ends before sunrise the next day, parana should be done immediately after sunrise. Missing the parana window is considered as inauspicious as missing the fast itself. Regional variations exist: Smartha Ekadashi follows a different calendar calculation than Vaishnava Ekadashi, and in some years an extra (Adhik Masa) Ekadashi pair appears due to the intercalary month.",
    aboutPurnima: "About Purnima",
    aboutPurnimaText1:
      "Purnima is the full moon day  –  the fifteenth and final Tithi of Shukla Paksha when the lunar disc reaches complete illumination. It occurs once every synodic month (approximately 29.53 days) and holds a central position in Vedic timekeeping. In the Purnimant calendar system used across North India, Purnima marks the boundary between months: the month ends on the full moon day, making it the calendrical equivalent of December 31st in the Gregorian system.",
    aboutPurnimaText2:
      "The Hindu year contains 12 to 13 named Purnimas, each tied to a specific observance. Guru Purnima (Ashadha) honors the guru lineage and Vyasa, the compiler of the Vedas. Sharad Purnima (Ashwin) is the harvest moon celebration when the moon is believed to shower amrit (nectar)  –  devotees prepare kheer left under moonlight. Kartik Purnima coincides with Dev Deepavali and is sacred for Ganga snan. Buddha Purnima (Vaishakha) celebrates the birth, enlightenment, and parinirvana of Gautama Buddha. Holi falls on Phalguna Purnima, and Raksha Bandhan on Shravana Purnima.",
    aboutPurnimaText3:
      "Ayurveda and the Surya Siddhanta both document the moon's influence on biological rhythms. The gravitational pull at full moon measurably affects ocean tides, and traditional agricultural calendars time planting and harvesting around Purnima. The Charaka Samhita notes that kapha dosha peaks on Purnima, recommending lighter meals and meditative practice. Modern chronobiology confirms increased melatonin sensitivity and altered sleep architecture around the full moon  –  lending empirical weight to the ancient prescription of fasting and night vigil (jagran) on Purnima.",
    aboutPurnimaText4:
      "Purnima observances typically include Satyanarayan Katha  –  a puja dedicated to Lord Vishnu recounted from the Skanda Purana, performed with panchamrit and offered to the community as prasad. Fasting on Purnima ranges from nirjala (waterless) to phalahari (fruit-only), depending on regional tradition. Charity (daan) given on Purnima  –  especially food, clothing, and sesame seeds  –  is considered to yield amplified spiritual merit. In 2026, each Purnima date and moonrise time is location-dependent; this page calculates them precisely for your coordinates.",
    aboutAmavasya: "About Amavasya",
    aboutAmavasyaText1:
      'Amavasya is the new moon day  –  the thirtieth and final Tithi of Krishna Paksha when the moon is entirely invisible. In the Amanta (Amavasyant) calendar system followed in Gujarat, Maharashtra, Karnataka, and South India, Amavasya marks the last day of the lunar month. The word derives from Sanskrit "ama" (together) and "vasya" (to dwell), signifying the conjunction of Sun and Moon  –  they occupy the same longitude in the sky, rendering the moon dark.',
    aboutAmavasyaText2:
      "Amavasya holds paramount importance for Pitru Tarpan  –  ritual offerings of water, sesame seeds, and kusha grass to departed ancestors. The Garuda Purana and Markandeya Purana prescribe Amavasya as the day when the Pitru Loka (ancestral realm) is most accessible. Somvati Amavasya, falling on a Monday, is especially potent for tarpan and peepal tree worship. Mauni Amavasya (Magha) prescribes maun vrat (vow of silence) and holy river bathing  –  the Kumbh Mela's most sacred snan falls on this day.",
    aboutAmavasyaText3:
      "The Diwali festival falls on Kartik Amavasya, transforming the otherwise somber new moon into the most celebrated night of the year. On this day, Lakshmi Puja is performed during the Pradosh Kaal and Nishita Kaal. Shani Amavasya (Saturday) is observed with mustard oil offerings to Lord Shani, believed to mitigate the malefic effects of Saturn in one's horoscope. Kali Puja, particularly in Bengal, coincides with Amavasya when the goddess Kali's fierce energy is honored through night-long worship.",
    aboutAmavasyaText4:
      "While Amavasya is traditionally considered inauspicious for starting new ventures, marriages, or travel, it is regarded as deeply powerful for introspective and tantric practices. Meditation on Amavasya is said to penetrate deeper states of consciousness because external sensory distraction (moonlight) is absent. Ayurveda notes that Vata dosha increases on Amavasya, recommending warm, grounding foods and oil massage (abhyanga). Amavasya 2026 dates vary by timezone and location  –  this page provides exact timings computed for your coordinates.",
    aboutPradosham: "About Pradosham",
    aboutPradoshamText1:
      'Pradosham (Pradosh Vrat) falls on the thirteenth Tithi (Trayodashi) of each lunar fortnight  –  both Shukla and Krishna Paksha  –  yielding approximately 24 Pradosham days per year. The word "Pradosha" literally means "the first part of the night" and refers to the twilight period between sunset and nightfall. This 90-minute window, called Pradosh Kaal, is considered the most sacred time for Lord Shiva worship according to the Skanda Purana.',
    aboutPradoshamText2:
      "The origin story of Pradosham comes from the Skanda Purana. When the gods and demons churned the cosmic ocean (Samudra Manthan), the deadly poison Halahala emerged during the Pradosh Kaal of Trayodashi. Lord Shiva consumed the poison to save creation, and Parvati pressed his throat to prevent it from descending  –  turning his throat blue (Neelakantha). Nandi, Shiva's divine bull, is said to have performed intense penance during this twilight hour, earning the boon that anyone who worships Shiva during Pradosh Kaal would receive swift grace.",
    aboutPradoshamText3:
      "Shani Pradosham (Saturday) and Soma Pradosham (Monday) carry special significance. Shani Pradosham combines Saturn's karmic discipline with Shiva's transformative power  –  particularly recommended for those undergoing Sade Sati or Saturn Dasha in their horoscope. Soma Pradosham links the Moon's emotional healing with Shiva worship, prescribed for mental peace and emotional stability. Bhauma Pradosham (Tuesday) is observed for Mars-related remedies, especially Mangal Dosha.",
    aboutPradoshamText4:
      "The Pradosham puja vidhi involves lighting a ghee lamp at twilight, offering bilva leaves, white flowers, and milk abhishekam to a Shiva Linga. Devotees observe a day-long fast, breaking it after the evening puja. The Maha Mrityunjaya Mantra and Rudram chanting during Pradosh Kaal are considered exceptionally potent. Pradosham 2026 dates and the exact Pradosh Kaal window depend on your local sunset time  –  this page calculates both for your location.",
    aboutChaturthi: "About Chaturthi",
    aboutChaturthiText1:
      "Chaturthi is the fourth Tithi of each lunar fortnight, sacred to Lord Ganesha  –  the remover of obstacles and the deity invoked at the beginning of every Hindu ceremony. The Ganapati Atharvashirsha Upanishad declares Ganesha as the primordial cosmic principle (Brahman) manifest in elephant form, and Chaturthi is his designated worship day in the Tithi cycle.",
    aboutChaturthiText2:
      "Two types of Chaturthi recur monthly. Sankashti Chaturthi falls in Krishna Paksha (waning moon) and is the primary monthly Ganesha vrat. Devotees fast from sunrise until moonrise, and the fast is broken only after sighting the moon and performing Ganesh Puja. The moonrise time is therefore critical  –  it varies significantly by location and season. Vinayaka Chaturthi falls in Shukla Paksha (waxing moon) and is observed with morning puja and modak offerings, though it carries less austerity than Sankashti.",
    aboutChaturthiText3:
      "The grand Ganesh Chaturthi festival (Bhadrapada Shukla Chaturthi, August-September) is a 10-day celebration culminating in Anant Chaturdashi. Established as a public festival by Lokmanya Tilak in 1893 to foster community unity, it features elaborate clay Ganesha installations (pandals), daily aarti, and the iconic visarjan (immersion) procession. The Chaturthi Chandra Dosha is a unique prohibition: on Bhadrapada Shukla Chaturthi, looking at the moon is said to bring false accusations (Syamantaka gem curse from the Bhagavata Purana). If seen accidentally, reciting the Syamantaka story or Krishna Stuti is the prescribed remedy.",
    aboutChaturthiText4:
      "The modak (sweet dumpling) is Ganesha's signature offering  –  21 modaks are traditionally prepared for Sankashti, representing the 21 chapters of the Ganesha Purana. Durva grass (bermuda grass) bundles of 3 or 5 blades are offered as they are believed to have cooling properties that please Ganesha. Each Chaturthi 2026 falls on a different weekday, and the moonrise time determines when the Sankashti fast can be broken  –  this page provides precise moonrise calculations for your location.",
    // Guide card labels
    guideTitle_ekadashi: "Ekadashi Fasting Rules",
    guideTitle_purnima: "Purnima Observance Guide",
    guideTitle_amavasya: "Amavasya Dos & Don'ts",
    guideTitle_pradosham: "How to Observe Pradosham",
    guideTitle_chaturthi: "Chaturthi Puja Guide",
    guide_ekadashi_1: "Avoid all grains, beans, rice, wheat, and lentils",
    guide_ekadashi_2:
      "Permitted: fruits, nuts, milk, root vegetables, sabudana, rock salt (sendha namak)",
    guide_ekadashi_3:
      "Break fast (Parana) next day after sunrise but before Dwadashi tithi ends",
    guide_ekadashi_4: "Nirjala Ekadashi: no food or water for the entire day",
    guide_ekadashi_5:
      "Chant Vishnu Sahasranama or Om Namo Bhagavate Vasudevaya",
    guide_ekadashi_6:
      "Avoid sleeping during daytime  –  stay awake for night vigil if possible",
    guide_purnima_1: "Perform Satyanarayan Katha with panchamrit offering",
    guide_purnima_2:
      "Fast options: Nirjala (waterless), Phalahari (fruit-only), or single meal",
    guide_purnima_3:
      "Give daan (charity): food, clothing, sesame seeds, or cow feeding",
    guide_purnima_4: "Observe jagran (night vigil) with kirtan and meditation",
    guide_purnima_5: "Take holy river bath or visit temple at moonrise",
    guide_purnima_6:
      "Prepare kheer and leave under moonlight on Sharad Purnima",
    guide_amavasya_do_1:
      "Perform Pitru Tarpan with water, sesame, and kusha grass",
    guide_amavasya_do_2:
      "Meditate  –  the dark moon supports deep introspection",
    guide_amavasya_do_3:
      "Offer mustard oil lamp to Lord Shani (especially on Saturday)",
    guide_amavasya_do_4: "Worship at peepal tree on Somvati Amavasya (Monday)",
    guide_amavasya_dont_1:
      "Avoid starting new ventures, businesses, or journeys",
    guide_amavasya_dont_2: "Avoid major purchases, contracts, or marriages",
    guide_amavasya_dont_3:
      "Avoid cutting hair or nails (traditional prescription)",
    guide_amavasya_dont_4:
      "Avoid consuming tamasic foods (meat, alcohol, stale food)",
    guide_pradosham_1:
      "Begin worship during Pradosh Kaal  –  90 minutes around sunset",
    guide_pradosham_2:
      "Light a ghee lamp and offer bilva leaves to Shiva Linga",
    guide_pradosham_3: "Perform milk abhishekam with white flowers",
    guide_pradosham_4:
      "Chant Maha Mrityunjaya Mantra (108 times) or Sri Rudram",
    guide_pradosham_5: "Fast from sunrise, break after evening puja",
    guide_pradosham_6:
      "Shani Pradosham (Saturday): especially for Sade Sati relief",
    guide_chaturthi_1: "Fast from sunrise until moonrise (Sankashti Chaturthi)",
    guide_chaturthi_2:
      "Break fast only after sighting the moon and performing puja",
    guide_chaturthi_3: "Offer 21 modaks and durva grass (3 or 5 blade bundles)",
    guide_chaturthi_4:
      "Chant Ganapati Atharvashirsha or Om Gan Ganapataye Namaha",
    guide_chaturthi_5:
      "Bhadrapada Chaturthi: do NOT look at the moon (Chandra Dosha)",
    guide_chaturthi_6:
      "If moon seen accidentally on Ganesh Chaturthi, recite Syamantaka Katha",
    viewCalendar: "View Festival Calendar",
  },
  hi: {
    back: "कैलेंडर",
    completeDates: "सम्पूर्ण तिथियाँ और समय",
    next: "अगला",
    total: "कुल",
    date: "तिथि",
    day: "दिन",
    name: "नाम",
    timings: "समय",
    paksha: "पक्ष",
    shukla: "शुक्ल",
    krishna: "कृष्ण",
    noEntries: "इस माह कोई तिथि नहीं मिली",
    jumpTo: "माह पर जाएँ",
    loading: "लोड हो रहा है...",
    aboutEkadashi: "एकादशी के बारे में",
    aboutEkadashiText1:
      "एकादशी हिन्दू पंचांग में प्रत्येक चान्द्र पक्ष की ग्यारहवीं तिथि है। प्रत्येक माह में दो एकादशियाँ होती हैं  –  एक शुक्ल पक्ष में और एक कृष्ण पक्ष में, जिससे वर्ष में लगभग 24 नामित एकादशियाँ आती हैं। पद्म पुराण और भविष्य पुराण में प्रत्येक एकादशी की अलग कथा वर्णित है। बृहत् पराशर होरा शास्त्र (BPHS) एकादशी को सात्विक तिथि मानता है जब मन स्वाभाविक रूप से चिन्तन और संयम की ओर प्रवृत्त होता है।",
    aboutEkadashiText2:
      "24 एकादशी चक्र में निर्जला एकादशी (ज्येष्ठ शुक्ल) सबसे कठोर मानी जाती है क्योंकि भक्त पूरे दिन अन्न और जल दोनों का त्याग करते हैं। पापांकुशा एकादशी (आश्विन शुक्ल) पापों के नाश के लिए प्रसिद्ध है, जबकि देवउठनी एकादशी (कार्तिक शुक्ल) चातुर्मास के अन्त में भगवान विष्णु के जागरण का पर्व है। एकादशी 2026 की तिथियाँ स्थान-आधारित हैं क्योंकि तिथि सीमा स्थानीय सूर्योदय पर निर्भर करती है।",
    aboutEkadashiText3:
      "एकादशी व्रत के नियम हरि भक्ति विलास में संहिताबद्ध हैं। मुख्य नियम अन्न (अनाज और दालों) का पूर्ण त्याग है। फल, मेवे, दूध, कन्द-मूल (आलू, शकरकन्द), साबूदाना और सेंधा नमक वर्जित नहीं हैं। सामान्य नमक, चावल, गेहूँ, दालें और सरसों का तेल वर्जित हैं। आधुनिक विज्ञान इसे इन्टरमिटेन्ट फ़ास्टिंग से जोड़ता है  –  24 घण्टे का अन्न-मुक्त उपवास पाचन तन्त्र को विश्राम देता है।",
    aboutEkadashiText4:
      "पारण (व्रत तोड़ना) अगले दिन निर्धारित समय-सीमा में करना अनिवार्य है  –  सूर्योदय के बाद किन्तु द्वादशी तिथि के समाप्त होने से पहले। स्मार्त और वैष्णव एकादशी की गणना में अन्तर होता है, और अधिक मास में एक अतिरिक्त एकादशी जोड़ी आती है।",
    aboutPurnima: "पूर्णिमा के बारे में",
    aboutPurnimaText1:
      "पूर्णिमा पूर्ण चन्द्रमा का दिन है  –  शुक्ल पक्ष की पन्द्रहवीं और अन्तिम तिथि जब चन्द्र बिम्ब पूर्ण प्रकाशित होता है। यह प्रत्येक चान्द्र मास (लगभग 29.53 दिन) में एक बार आती है। पूर्णिमान्त पंचांग में, जो उत्तर भारत में प्रचलित है, पूर्णिमा मास की सीमा है  –  मास पूर्णिमा को समाप्त होता है।",
    aboutPurnimaText2:
      "हिन्दू वर्ष में 12 से 13 नामित पूर्णिमाएँ होती हैं। गुरु पूर्णिमा (आषाढ़) गुरु परम्परा और वेदव्यास को समर्पित है। शरद पूर्णिमा (आश्विन) को चन्द्रमा अमृत वर्षा करता है  –  भक्त खीर चाँदनी में रखते हैं। कार्तिक पूर्णिमा देव दीपावली के साथ मनाई जाती है। बुद्ध पूर्णिमा (वैशाख) गौतम बुद्ध के जन्म, बोधि और परिनिर्वाण का पर्व है। होली फाल्गुन पूर्णिमा पर और रक्षा बन्धन श्रावण पूर्णिमा पर पड़ता है।",
    aboutPurnimaText3:
      "आयुर्वेद और सूर्य सिद्धान्त दोनों चन्द्रमा के जैविक लय पर प्रभाव का वर्णन करते हैं। पूर्णिमा पर समुद्री ज्वार-भाटा अधिकतम होता है। चरक संहिता के अनुसार पूर्णिमा पर कफ दोष बढ़ता है, इसलिए हल्का भोजन और ध्यान की सलाह दी जाती है। आधुनिक शोध भी पूर्णिमा पर नींद के पैटर्न में बदलाव की पुष्टि करता है।",
    aboutPurnimaText4:
      "पूर्णिमा पर सत्यनारायण कथा (स्कन्द पुराण) का पाठ, पंचामृत से पूजा और प्रसाद वितरण प्रमुख अनुष्ठान हैं। उपवास निर्जला से लेकर फलाहार तक हो सकता है। पूर्णिमा पर दान  –  विशेषकर अन्न, वस्त्र और तिल  –  का पुण्य बहुगुणित माना जाता है। पूर्णिमा 2026 की तिथियाँ और चन्द्रोदय का समय स्थान पर निर्भर हैं।",
    aboutAmavasya: "अमावस्या के बारे में",
    aboutAmavasyaText1:
      'अमावस्या कृष्ण पक्ष की तीसवीं और अन्तिम तिथि है जब चन्द्रमा पूर्णतः अदृश्य होता है। अमान्त (अमावस्यान्त) पंचांग में, जो गुजरात, महाराष्ट्र, कर्नाटक और दक्षिण भारत में प्रचलित है, अमावस्या मास का अन्तिम दिन है। संस्कृत में "अमा" (साथ) और "वस्य" (निवास)  –  सूर्य और चन्द्रमा का एक ही अंश पर संयोग।',
    aboutAmavasyaText2:
      "अमावस्या पितृ तर्पण के लिए सर्वाधिक महत्वपूर्ण है  –  जल, तिल और कुश से पितरों को अर्पण किया जाता है। गरुड़ पुराण और मार्कण्डेय पुराण के अनुसार अमावस्या पर पितृ लोक सबसे सुलभ होता है। सोमवती अमावस्या (सोमवार) तर्पण और पीपल पूजा के लिए विशेष शुभ है। मौनी अमावस्या (माघ) पर मौन व्रत और पवित्र नदी स्नान का विधान है  –  कुम्भ मेले का मुख्य स्नान इसी दिन होता है।",
    aboutAmavasyaText3:
      "दीपावली कार्तिक अमावस्या पर पड़ती है  –  अन्यथा शान्त अमावस्या वर्ष की सबसे भव्य रात्रि बन जाती है। इस दिन प्रदोष काल और निशीथ काल में लक्ष्मी पूजा होती है। शनि अमावस्या (शनिवार) पर शनि देव को सरसों का तेल अर्पित किया जाता है। बंगाल में काली पूजा अमावस्या पर रात्रि भर की जाती है।",
    aboutAmavasyaText4:
      "अमावस्या नए कार्य, विवाह या यात्रा के लिए अशुभ मानी जाती है, किन्तु ध्यान और आन्तरिक साधना के लिए अत्यन्त शक्तिशाली है। आयुर्वेद के अनुसार अमावस्या पर वात दोष बढ़ता है  –  गर्म, पौष्टिक भोजन और तेल मालिश (अभ्यंग) की सलाह दी जाती है। अमावस्या 2026 की तिथियाँ समय क्षेत्र और स्थान पर निर्भर हैं।",
    aboutPradosham: "प्रदोष के बारे में",
    aboutPradoshamText1:
      'प्रदोष व्रत प्रत्येक चान्द्र पक्ष की त्रयोदशी (13वीं) तिथि को पड़ता है  –  शुक्ल और कृष्ण दोनों पक्षों में  –  जिससे वर्ष में लगभग 24 प्रदोष आते हैं। "प्रदोष" का शाब्दिक अर्थ "रात्रि का प्रथम भाग" है  –  सूर्यास्त और रात्रि के बीच का सन्ध्याकाल। स्कन्द पुराण के अनुसार यह 90 मिनट का प्रदोष काल भगवान शिव की पूजा के लिए सर्वश्रेष्ठ है।',
    aboutPradoshamText2:
      "प्रदोष की कथा स्कन्द पुराण से आती है। समुद्र मन्थन में त्रयोदशी के प्रदोष काल में हालाहल विष प्रकट हुआ। भगवान शिव ने सृष्टि रक्षा हेतु विष पान किया और पार्वती ने उनका कण्ठ दबाया  –  जिससे वे नीलकण्ठ कहलाए। नन्दी ने इसी सन्ध्या काल में कठोर तपस्या कर वरदान प्राप्त किया कि प्रदोष काल में शिव पूजा करने वालों पर शीघ्र कृपा होगी।",
    aboutPradoshamText3:
      "शनि प्रदोष (शनिवार) और सोम प्रदोष (सोमवार) विशेष महत्व रखते हैं। शनि प्रदोष शनि की कर्म-शक्ति और शिव की रूपान्तरण शक्ति का संयोग है  –  साढ़े साती या शनि दशा वालों के लिए विशेष रूप से अनुशंसित। सोम प्रदोष चन्द्रमा की शान्ति और मानसिक स्थिरता के लिए प्रसिद्ध है।",
    aboutPradoshamText4:
      "प्रदोष पूजा विधि में सन्ध्याकाल में घी का दीपक जलाना, शिव लिंग पर बिल्व पत्र और श्वेत पुष्प अर्पित करना, तथा दुग्ध अभिषेक शामिल है। भक्त सूर्योदय से उपवास रखते हैं और सन्ध्या पूजा के बाद व्रत तोड़ते हैं। प्रदोष काल में महामृत्युञ्जय मन्त्र (108 बार) और रुद्रम् का पाठ अत्यन्त प्रभावशाली माना जाता है।",
    aboutChaturthi: "चतुर्थी के बारे में",
    aboutChaturthiText1:
      "चतुर्थी प्रत्येक चान्द्र पक्ष की चौथी तिथि है, जो विघ्नहर्ता भगवान गणेश को समर्पित है। गणपति अथर्वशीर्ष उपनिषद् गणेश को ब्रह्म का गजरूपी साक्षात्कार घोषित करता है, और चतुर्थी तिथि चक्र में उनका निर्धारित पूजा दिवस है।",
    aboutChaturthiText2:
      "दो प्रकार की चतुर्थी प्रतिमास आती हैं। संकष्टी चतुर्थी कृष्ण पक्ष (ढलते चन्द्र) में पड़ती है और मुख्य मासिक गणेश व्रत है। भक्त सूर्योदय से चन्द्रोदय तक उपवास रखते हैं और चन्द्र दर्शन व गणेश पूजा के बाद ही व्रत तोड़ते हैं। चन्द्रोदय का समय स्थान और ऋतु के अनुसार बहुत भिन्न होता है। विनायक चतुर्थी शुक्ल पक्ष में पड़ती है जिसमें प्रातः पूजा और मोदक अर्पण किया जाता है।",
    aboutChaturthiText3:
      "भव्य गणेश चतुर्थी महोत्सव (भाद्रपद शुक्ल चतुर्थी) 10 दिन का उत्सव है जो अनन्त चतुर्दशी पर समाप्त होता है। 1893 में लोकमान्य तिलक ने इसे सार्वजनिक उत्सव के रूप में स्थापित किया। चतुर्थी चन्द्र दोष एक विशेष निषेध है  –  भाद्रपद शुक्ल चतुर्थी पर चन्द्र दर्शन से मिथ्या आरोप लगने की मान्यता है (भागवत पुराण का स्यमन्तक मणि प्रसंग)।",
    aboutChaturthiText4:
      "मोदक गणेश का प्रिय भोग है  –  संकष्टी पर 21 मोदक अर्पित किए जाते हैं जो गणेश पुराण के 21 अध्यायों का प्रतीक हैं। दूर्वा (दूब) घास की 3 या 5 पत्तियों की गुच्छी अर्पित की जाती है। चतुर्थी 2026 की प्रत्येक तिथि भिन्न वार पर पड़ती है और संकष्टी व्रत के लिए चन्द्रोदय का सटीक समय आवश्यक है।",
    guideTitle_ekadashi: "एकादशी व्रत के नियम",
    guideTitle_purnima: "पूर्णिमा पालन मार्गदर्शिका",
    guideTitle_amavasya: "अमावस्या  –  क्या करें, क्या न करें",
    guideTitle_pradosham: "प्रदोष व्रत कैसे करें",
    guideTitle_chaturthi: "चतुर्थी पूजा मार्गदर्शिका",
    guide_ekadashi_1: "सभी अनाज, दालें, चावल, गेहूँ का त्याग करें",
    guide_ekadashi_2: "अनुमत: फल, मेवे, दूध, कन्द-मूल, साबूदाना, सेंधा नमक",
    guide_ekadashi_3:
      "पारण अगले दिन सूर्योदय के बाद, द्वादशी समाप्ति से पहले करें",
    guide_ekadashi_4: "निर्जला एकादशी: पूरे दिन अन्न और जल दोनों का त्याग",
    guide_ekadashi_5: "विष्णु सहस्रनाम या ॐ नमो भगवते वासुदेवाय का जाप करें",
    guide_ekadashi_6: "दिन में सोने से बचें  –  यथासम्भव रात्रि जागरण करें",
    guide_purnima_1: "पंचामृत से सत्यनारायण कथा का पाठ करें",
    guide_purnima_2: "उपवास: निर्जला, फलाहार, या एक समय भोजन",
    guide_purnima_3: "दान करें: अन्न, वस्त्र, तिल, या गौ सेवा",
    guide_purnima_4: "रात्रि जागरण कीर्तन और ध्यान के साथ करें",
    guide_purnima_5: "चन्द्रोदय पर पवित्र नदी स्नान या मन्दिर दर्शन करें",
    guide_purnima_6: "शरद पूर्णिमा पर खीर चाँदनी में रखें",
    guide_amavasya_do_1: "जल, तिल और कुश से पितृ तर्पण करें",
    guide_amavasya_do_2:
      "ध्यान करें  –  अन्धकार चन्द्र गहन आत्मनिरीक्षण में सहायक है",
    guide_amavasya_do_3:
      "शनि देव को सरसों के तेल का दीपक अर्पित करें (विशेषकर शनिवार)",
    guide_amavasya_do_4: "सोमवती अमावस्या पर पीपल वृक्ष की पूजा करें",
    guide_amavasya_dont_1: "नए कार्य, व्यापार या यात्रा आरम्भ न करें",
    guide_amavasya_dont_2: "बड़ी ख़रीदारी, अनुबन्ध या विवाह से बचें",
    guide_amavasya_dont_3: "बाल या नाखून न कटवाएँ (पारम्परिक विधान)",
    guide_amavasya_dont_4: "तामसिक भोजन (माँस, मद्य, बासी भोजन) का त्याग करें",
    guide_pradosham_1:
      "प्रदोष काल में पूजा आरम्भ करें  –  सूर्यास्त के 90 मिनट",
    guide_pradosham_2: "घी का दीपक जलाएँ और शिव लिंग पर बिल्व पत्र अर्पित करें",
    guide_pradosham_3: "श्वेत पुष्पों के साथ दुग्ध अभिषेक करें",
    guide_pradosham_4:
      "महामृत्युञ्जय मन्त्र (108 बार) या श्री रुद्रम् का पाठ करें",
    guide_pradosham_5: "सूर्योदय से उपवास, सन्ध्या पूजा के बाद व्रत तोड़ें",
    guide_pradosham_6: "शनि प्रदोष (शनिवार): साढ़े साती शान्ति के लिए विशेष",
    guide_chaturthi_1: "सूर्योदय से चन्द्रोदय तक उपवास (संकष्टी चतुर्थी)",
    guide_chaturthi_2: "चन्द्र दर्शन और पूजा के बाद ही व्रत तोड़ें",
    guide_chaturthi_3:
      "21 मोदक और दूर्वा घास (3 या 5 पत्तियों की गुच्छी) अर्पित करें",
    guide_chaturthi_4: "गणपति अथर्वशीर्ष या ॐ गं गणपतये नमः का जाप करें",
    guide_chaturthi_5: "भाद्रपद चतुर्थी: चन्द्रमा न देखें (चन्द्र दोष)",
    guide_chaturthi_6:
      "गणेश चतुर्थी पर भूल से चन्द्र दर्शन हो जाए तो स्यमन्तक कथा का पाठ करें",
    viewCalendar: "त्योहार कैलेंडर देखें",
  },
  sa: {
    back: "पञ्चाङ्गम्",
    completeDates: "सम्पूर्णतिथयः समयश्च",
    next: "अग्रिम",
    total: "कुल",
    date: "दिनाङ्कः",
    day: "वासरः",
    name: "नाम",
    timings: "कालः",
    paksha: "पक्षः",
    shukla: "शुक्लः",
    krishna: "कृष्णः",
    noEntries: "अस्मिन् मासे तिथिः न प्राप्ता",
    jumpTo: "मासं गच्छतु",
    loading: "लोड हो रहा है...",
    aboutEkadashi: "एकादश्याः विषये",
    aboutEkadashiText1:
      "एकादशी हिन्दूपञ्चाङ्गे प्रत्येकपक्षस्य एकादशतिथिः। प्रत्येकमासे द्वे एकादश्यौ भवतः  –  एका शुक्लपक्षे एका कृष्णपक्षे। एकादशीव्रतं हिन्दूधर्मस्य महत्वपूर्णव्रतेषु अन्यतमम्।",
    aboutEkadashiText2:
      "निर्जलैकादशी ज्येष्ठशुक्लपक्षे कठोरतमा मन्यते। देवोत्थानैकादशी कार्तिकशुक्लपक्षे चातुर्मासान्ते विष्णोः जागरणपर्व भवति।",
    aboutEkadashiText3:
      "एकादशीव्रतनियमाः हरिभक्तिविलासे संहिताबद्धाः। अन्नत्यागः मुख्यः  –  फलानि दुग्धं कन्दमूलानि अनुमतानि।",
    aboutEkadashiText4:
      "पारणं परदिने सूर्योदयानन्तरं द्वादशीसमाप्तेः पूर्वं करणीयम्।",
    aboutPurnima: "पूर्णिमायाः विषये",
    aboutPurnimaText1:
      "पूर्णिमा पूर्णचन्द्रदिनम् शुक्लपक्षस्य पञ्चदशतिथिः। एतत् हिन्दूपञ्चाङ्गस्य शुभतमदिनेषु अन्यतमम्।",
    aboutPurnimaText2:
      "गुरुपूर्णिमा व्यासदेवाय समर्पिता। शरद्पूर्णिमायां चन्द्रमाः अमृतवर्षं करोति। कार्तिकपूर्णिमा देवदीपावल्या सह मन्यते।",
    aboutPurnimaText3:
      "सूर्यसिद्धान्ते चन्द्रस्य जैविकलयप्रभावः वर्णितः। चरकसंहितानुसारं पूर्णिमायां कफदोषः वर्धते।",
    aboutPurnimaText4:
      "सत्यनारायणकथापाठः पञ्चामृतेन पूजा च पूर्णिमायाः प्रमुखानुष्ठानानि।",
    aboutAmavasya: "अमावस्यायाः विषये",
    aboutAmavasyaText1:
      "अमावस्या कृष्णपक्षस्य अन्तिमा तिथिः यदा चन्द्रमाः न दृश्यते। पितृतर्पणाय शनिपूजायै महत्वपूर्णा।",
    aboutAmavasyaText2:
      "गरुडपुराणे अमावस्यायां पितृलोकः सुलभतमः इति वर्णितम्। सोमवत्यमावस्या तर्पणाय विशेषशुभा।",
    aboutAmavasyaText3:
      "दीपावली कार्तिकामावस्यायां भवति। शन्यमावस्यायां सर्षपतैलं शनिदेवाय अर्प्यते।",
    aboutAmavasyaText4:
      "अमावस्या नवकार्याय अशुभा किन्तु ध्यानाय अत्यन्तं शक्तिशालिनी मन्यते।",
    aboutPradosham: "प्रदोषस्य विषये",
    aboutPradoshamText1:
      "प्रदोषव्रतं प्रत्येकपक्षस्य त्रयोदशीतिथौ भवति। एतत् शिवदेवाय समर्पितम्।",
    aboutPradoshamText2:
      "स्कन्दपुराणे समुद्रमन्थने त्रयोदश्याः प्रदोषकाले हालाहलं प्रकटितम्। शिवः विषं पीतवान्।",
    aboutPradoshamText3:
      "शनिप्रदोषः शनिवासरे सोमप्रदोषः सोमवासरे च विशेषमहत्वं धारयतः।",
    aboutPradoshamText4:
      "प्रदोषपूजाविधौ सन्ध्याकाले घृतदीपः बिल्वपत्राणि दुग्धाभिषेकश्च विहिताः।",
    aboutChaturthi: "चतुर्थ्याः विषये",
    aboutChaturthiText1:
      "चतुर्थी प्रत्येकपक्षस्य चतुर्थतिथिः गणेशदेवाय समर्पिता। कृष्णचतुर्थी सङ्कष्टिचतुर्थी इति कथ्यते।",
    aboutChaturthiText2:
      "सङ्कष्टिचतुर्थ्यां सूर्योदयात् चन्द्रोदयपर्यन्तम् उपवासः क्रियते। चन्द्रदर्शनानन्तरं व्रतभङ्गः।",
    aboutChaturthiText3:
      "गणेशचतुर्थी (भाद्रपदशुक्लचतुर्थी) दशदिनात्मकम् उत्सवम्। चतुर्थीचन्द्रदोषे चन्द्रदर्शनं वर्जितम्।",
    aboutChaturthiText4:
      "मोदकाः गणेशस्य प्रियभोगाः। एकविंशतिमोदकाः अर्प्यन्ते। दूर्वादलानि त्रीणि पञ्च वा अर्प्यन्ते।",
    guideTitle_ekadashi: "एकादशीव्रतनियमाः",
    guideTitle_purnima: "पूर्णिमापालनमार्गदर्शिका",
    guideTitle_amavasya: "अमावस्या  –  कर्तव्यम् अकर्तव्यं च",
    guideTitle_pradosham: "प्रदोषव्रतविधिः",
    guideTitle_chaturthi: "चतुर्थीपूजामार्गदर्शिका",
    viewCalendar: "पर्वपञ्चाङ्गं पश्यतु",
  },
  mai: {
    back: "पंचांग",
    completeDates: "पूर्ण तिथि आ समय",
    next: "अगिला",
    total: "कुल मे",
    date: "तिथि",
    day: "दिन",
    name: "नाम",
    timings: "समय",
    paksha: "पक्ष",
    shukla: "शुक्ल",
    krishna: "कृष्ण",
    noEntries: "एहि मासक लेल कोनो तिथि नहि भेटल अछि।",
    jumpTo: "मास पर जाऊ",
    loading: "लोड भऽ रहल अछि...",
    aboutEkadashi: "एकादशीक विषय मे",
    aboutEkadashiText1:
      "एकादशी हिन्दू पंचांगक प्रत्येक पक्षक एगारहम तिथि (चान्द दिन) अछि, जे प्रत्येक मास मे दू बेर  –  एक बेर शुक्ल पक्ष (उजर चान) मे आ एक बेर कृष्ण पक्ष (करिया चान) मे  –  पड़ैत अछि। एहि सँ प्रति वर्ष लगभग २४ नामवला एकादशी होइत अछि, जाहि मे सँ प्रत्येक पद्म पुराण आ भविष्य पुराण मे निहित एकटा विशिष्ट आध्यात्मिक कथा रखैत अछि। बृहत् पाराशर होरा शास्त्र (बीपीएचएस) एकादशी केँ स्वाभाविक रूप सँ सात्विक मानैत अछि  –  एकटा दिन जखन मन स्वाभाविक रूप सँ चिन्तन आ संयमक दिस झुकैत अछि।",
    aboutEkadashiText2:
      "२४ एकादशीक चक्र मे निर्जला एकादशी (ज्येष्ठ शुक्ल) जकाँ सुप्रसिद्ध पालन शामिल अछि, जाहि केँ सबसँ कठोर मानल जाइत अछि किएक तँ भक्त लोकनि पूरा दिन भोजन आ जल दुनू सँ परहेज करैत छथि। पापांकुशा एकादशी (आश्विन शुक्ल) संचित पापक क्षमा करैत अछि, जखन कि देवोत्थानी एकादशी (कार्तिक शुक्ल) चातुर्मासक समापन केँ चिह्नित करैत अछि जखन भगवान विष्णु ब्रह्मांडीय निद्रा सँ जागृत होइत छथि। प्रत्येक एकादशी २०२६ क तिथि स्थानक अनुसार भिन्न होइत अछि किएक तँ तिथि सीमा स्थानीय सूर्योदय पर निर्भर करैत अछि  –  ई पृष्ठ अहाँक निर्देशांकक लेल सटीक समयक गणना करैत अछि।",
    aboutEkadashiText3:
      "एकादशी व्रतक नियम हरि भक्ति विलास मे संहिताबद्ध अछि। मानक अभ्यास अनाज आ दालि (अन्न) सँ पूर्ण व्रत अछि। अनुमत भोजन मे फल, मेवा, दूध, जड़ि-सब्जी (आलू, शकरकंद), साबूदाना (टैपिओका), आ सेंधा नमक शामिल अछि। सामान्य टेबल नमक, चावल, गेहूं, दालि आ सरसोंक तेल सँ सख्ती सँ परहेज कयल जाइत अछि। वैज्ञानिक तर्क आधुनिक आंतरायिक उपवास शोधक संग मेल खाइत अछि: एकटा २४-घंटाक अनाज-मुक्त अवधि पाचन तंत्र केँ एकटा आवधिक रीसेट दैत अछि, इंसुलिनक स्पाइक केँ कम करैत अछि, आ ऑटोफेगी केँ बढ़ावा दैत अछि  –  शरीरक कोशिकीय मरम्मत तंत्र।",
    aboutEkadashiText4:
      "पारणा (व्रत तोड़ब) अगिला दिन निर्धारित समय सीमाक भीतर  –  सूर्योदयक बाद मुदा द्वादशी तिथि समाप्त होमय सँ पहिने  –  कयल जेबाक चाही। यदि द्वादशी अगिला दिन सूर्योदय सँ पहिने समाप्त भऽ जाइत अछि, तँ पारणा सूर्योदयक तुरंत बाद कयल जेबाक चाही। पारणाक समय सीमा चूकब ओतबे अशुभ मानल जाइत अछि जतेक कि स्वयं व्रत चूकब। क्षेत्रीय भिन्नतासभ अछि: स्मार्त एकादशी वैष्णव एकादशी सँ भिन्न पंचांग गणनाक पालन करैत अछि, आ किछु वर्ष मे अधिक मासक कारण सँ एकटा अतिरिक्त (अधिक मास) एकादशीक जोड़ा प्रकट होइत अछि।",
    aboutPurnima: "पूर्णिमाक विषय मे",
    aboutPurnimaText1:
      "पूर्णिमा पूर्ण चानक दिन अछि  –  शुक्ल पक्षक पन्द्रहम आ अंतिम तिथि जखन चान्दक चक्र पूर्ण रूप सँ प्रकाशित होइत अछि। ई प्रत्येक सिनोडिक मास (लगभग २९.५३ दिन) मे एक बेर होइत अछि आ वैदिक समयपालन मे एकटा केंद्रीय स्थान रखैत अछि। उत्तर भारत मे प्रयुक्त पूर्णिमांत पंचांग प्रणाली मे, पूर्णिमा माससभक बीचक सीमा केँ चिह्नित करैत अछि: मास पूर्ण चानक दिन समाप्त होइत अछि, जेकरा ग्रेगोरियन प्रणाली मे ३१ दिसम्बरक पंचांगीय समकक्ष बनाबैत अछि।",
    aboutPurnimaText2:
      "हिन्दू वर्ष मे १२ सँ १३ नामवला पूर्णिमा होइत अछि, जाहि मे सँ प्रत्येक एकटा विशिष्ट पालन सँ जुड़ल अछि। गुरु पूर्णिमा (आषाढ़) गुरु परंपरा आ वेदक संकलक व्यास केँ सम्मानित करैत अछि। शरद पूर्णिमा (आश्विन) फसल चानक उत्सव अछि जखन चान अमृत (अमृत) बरसाबैत अछि  –  भक्त लोकनि चानक रौशनी मे खीर बना कऽ छोड़ि दैत छथि। कार्तिक पूर्णिमा देव दीपावलीक संग मेल खाइत अछि आ गंगा स्नानक लेल पवित्र अछि। बुद्ध पूर्णिमा (वैशाख) गौतम बुद्धक जन्म, ज्ञानोदय आ परिनिर्वाणक उत्सव मनाबैत अछि। होली फाल्गुन पूर्णिमा पर पड़ैत अछि, आ रक्षा बंधन श्रावण पूर्णिमा पर।",
    aboutPurnimaText3:
      "आयुर्वेद आ सूर्य सिद्धांत दुनू जैविक लय पर चानक प्रभाव केँ प्रलेखित करैत अछि। पूर्ण चान पर गुरुत्वाकर्षणक खिंचाव समुद्री ज्वार केँ मापनीय रूप सँ प्रभावित करैत अछि, आ पारंपरिक कृषि पंचांग पूर्णिमाक आसपास रोपण आ कटाईक समय निर्धारित करैत अछि। चरक संहिता मे कहल गेल अछि जे पूर्णिमा पर कफ दोष चरम पर होइत अछि, हल्का भोजन आ ध्यानात्मक अभ्यासक सिफारिश करैत अछि। आधुनिक क्रोनोबायोलॉजी पूर्ण चानक आसपास मेलाटोनिन संवेदनशीलता मे वृद्धि आ परिवर्तित निद्रा वास्तुकलाक पुष्टि करैत अछि  –  जे पूर्णिमा पर उपवास आ रात्रि जागरण (जागरण) क प्राचीन नुस्खा केँ अनुभवजन्य वजन दैत अछि।",
    aboutPurnimaText4:
      "पूर्णिमाक पालन मे सामान्यतः सत्यनारायण कथा  –  स्कन्द पुराण सँ वर्णित भगवान विष्णु केँ समर्पित एकटा पूजा, जे पंचामृतक संग कयल जाइत अछि आ समुदाय केँ प्रसादक रूप मे अर्पित कयल जाइत अछि  –  शामिल होइत अछि। पूर्णिमा पर व्रत निर्जला (जल-रहित) सँ फलाहारी (केवल फल) धरि होइत अछि, जे क्षेत्रीय परंपरा पर निर्भर करैत अछि। पूर्णिमा पर देल गेल दान (दान)  –  विशेष रूप सँ भोजन, वस्त्र आ तिल  –  केँ प्रवर्धित आध्यात्मिक पुण्य दैत मानल जाइत अछि। २०२६ मे, प्रत्येक पूर्णिमाक तिथि आ चान उगयबाक समय स्थान-निर्भर अछि; ई पृष्ठ अहाँक निर्देशांकक लेल ओकर सटीक गणना करैत अछि।",
    aboutAmavasya: "अमावस्याक विषय मे",
    aboutAmavasyaText1:
      "अमावस्या नव चानक दिन अछि  –  कृष्ण पक्षक तीसहम आ अंतिम तिथि जखन चान पूर्ण रूप सँ अदृश्य होइत अछि। गुजरात, महाराष्ट्र, कर्नाटक आ दक्षिण भारत मे पालन कयल जायवला अमांत (अमावस्यांत) पंचांग प्रणाली मे, अमावस्या चान्द मासक अंतिम दिन केँ चिह्नित करैत अछि। ई शब्द संस्कृतक 'अमा' (संग) आ 'वस्य' (निवास करब) सँ व्युत्पन्न अछि, जे सूर्य आ चानक युति केँ दर्शाबैत अछि  –  ओ लोकनि आकाश मे एकहि देशांतर पर रहैत छथि, जाहि सँ चान कारी भऽ जाइत अछि।",
    aboutAmavasyaText2:
      "अमावस्या पितृ तर्पणक लेल सर्वोपरि महत्व रखैत अछि  –  दिवंगत पूर्वजक लेल जल, तिल आ कुश घासक अनुष्ठानिक भेंट। गरुड़ पुराण आ मार्कण्डेय पुराण अमावस्या केँ ओहि दिनक रूप मे निर्धारित करैत अछि जखन पितृ लोक (पैतृक क्षेत्र) सबसँ बेसी सुलभ होइत अछि। सोमवती अमावस्या, जे सोमवार केँ पड़ैत अछि, तर्पण आ पीपर गाछक पूजाक लेल विशेष रूप सँ शक्तिशाली अछि। मौनी अमावस्या (माघ) मौन व्रत (मौनक प्रतिज्ञा) आ पवित्र नदी स्नानक विधान करैत अछि  –  कुंभ मेलाक सबसँ पवित्र स्नान एहि दिन पड़ैत अछि।",
    aboutAmavasyaText3:
      "दीपावलीक पर्व कार्तिक अमावस्या पर पड़ैत अछि, जे अन्यथा गंभीर नव चान केँ वर्षक सबसँ प्रसिद्ध राति मे परिवर्तित कऽ दैत अछि। एहि दिन, प्रदोष काल आ निशिता काल मे लक्ष्मी पूजा कयल जाइत अछि। शनि अमावस्या (शनिवार) भगवान शनि केँ सरसों तेलक भेंटक संग मनाओल जाइत अछि, मानल जाइत अछि जे ई व्यक्ति केँ कुंडली मे शनीक अशुभ प्रभाव केँ कम करैत अछि। काली पूजा, विशेष रूप सँ बंगाल मे, अमावस्याक संग मेल खाइत अछि जखन देवी कालीक उग्र ऊर्जा केँ राति भरिक पूजाक माध्यम सँ सम्मानित कयल जाइत अछि।",
    aboutAmavasyaText4:
      "जखन कि अमावस्या केँ पारंपरिक रूप सँ नव उद्यम, विवाह वा यात्रा शुरू करबाक लेल अशुभ मानल जाइत अछि, तथापि ई आत्मनिरीक्षण आ तांत्रिक अभ्यासक लेल गहिर रूप सँ शक्तिशाली मानल जाइत अछि। अमावस्या पर ध्यान चेतनाक गहिर अवस्था मे प्रवेश करैत कहल जाइत अछि किएक तँ बाहरी संवेदी व्याकुलता (चानक रौशनी) अनुपस्थित रहैत अछि। आयुर्वेद मे कहल गेल अछि जे अमावस्या पर वात दोष बढ़ैत अछि, गर्म, पौष्टिक भोजन आ तेल मालिश (अभ्यंग) क सिफारिश करैत अछि। अमावस्या २०२६ क तिथि समय क्षेत्र आ स्थानक अनुसार भिन्न होइत अछि  –  ई पृष्ठ अहाँक निर्देशांकक लेल गणना कयल गेल सटीक समय प्रदान करैत अछि।",
    aboutPradosham: "प्रदोषक विषय मे",
    aboutPradoshamText1:
      "प्रदोष (प्रदोष व्रत) प्रत्येक चान्द पक्षक तेरहम तिथि (त्रयोदशी) पर पड़ैत अछि  –  शुक्ल आ कृष्ण पक्ष दुनू  –  जे प्रति वर्ष लगभग २४ प्रदोष दिन दैत अछि। 'प्रदोष' शब्दक शाब्दिक अर्थ 'रातिक पहिल भाग' होइत अछि आ ई सूर्यास्त आ राति होमय क बीचक गोधूलि बेला केँ संदर्भित करैत अछि। ई ९०-मिनटक अवधि, जेकरा प्रदोष काल कहल जाइत अछि, स्कन्द पुराणक अनुसार भगवान शिवक पूजाक लेल सबसँ पवित्र समय मानल जाइत अछि।",
    aboutPradoshamText2:
      "प्रदोषक उत्पत्ति कथा स्कन्द पुराण सँ अबैत अछि। जखन देवता आ दानव ब्रह्मांडीय सागर (समुद्र मंथन) केँ मथने छलाह, तखन त्रयोदशीक प्रदोष काल मे घातक विष हलाहल प्रकट भेल। भगवान शिव सृष्टि केँ बचाबय लेल विषक सेवन केलनि, आ पार्वती हुनकर कंठ केँ नीचाँ उतरय सँ रोकबाक लेल दबा देलनि  –  जाहि सँ हुनकर कंठ नीलकंठ भऽ गेल। नंदी, शिवक दिव्य बैल, कहल जाइत अछि जे एहि गोधूलि बेला मे गहन तपस्या केलनि, आ ई वरदान प्राप्त केलनि जे कोनो व्यक्ति जे प्रदोष काल मे शिवक पूजा करत, ओकरा शीघ्र कृपा प्राप्त होयत।",
    aboutPradoshamText3:
      "शनि प्रदोष (शनिवार) आ सोम प्रदोष (सोमवार) विशेष महत्व रखैत अछि। शनि प्रदोष शनीक कर्मिक अनुशासन केँ शिवक परिवर्तनकारी शक्तिक संग जोड़ैत अछि  –  विशेष रूप सँ ओहि लोकनिक लेल अनुशंसित जे अपन कुंडली मे साढ़े साती वा शनि दशा सँ गुजरि रहल छथि। सोम प्रदोष चानक भावनात्मक उपचार केँ शिव पूजाक संग जोड़ैत अछि, मानसिक शांति आ भावनात्मक स्थिरताक लेल निर्धारित अछि। भौम प्रदोष (मंगलवार) मंगल सँ संबंधित उपचारक लेल, विशेष रूप सँ मंगल दोषक लेल मनाओल जाइत अछि।",
    aboutPradoshamText4:
      "प्रदोष पूजा विधि मे गोधूलि बेला मे घीक दीप जरायब, बेलपत्र, उजर फूल, आ शिव लिंग पर दूधक अभिषेक शामिल अछि। भक्त लोकनि दिन भरिक व्रत रखैत छथि, साँझक पूजाक बाद ओकरा तोड़ैत छथि। प्रदोष काल मे महा मृत्युंजय मंत्र आ रुद्राष्टकक जप केँ असाधारण रूप सँ शक्तिशाली मानल जाइत अछि। प्रदोष २०२६ क तिथि आ सटीक प्रदोष कालक अवधि अहाँक स्थानीय सूर्यास्तक समय पर निर्भर करैत अछि  –  ई पृष्ठ अहाँक स्थानक लेल दुनूक गणना करैत अछि।",
    aboutChaturthi: "चतुर्थीक विषय मे",
    aboutChaturthiText1:
      "चतुर्थी प्रत्येक चान्द पक्षक चारिम तिथि अछि, जे भगवान गणेशक लेल पवित्र अछि  –  बाधासभक निवारणकर्ता आ प्रत्येक हिन्दू समारोहक शुरुआत मे आह्वान कयल जायवला देवता। गणपति अथर्वशीर्ष उपनिषद गणेश केँ हाथीक रूप मे प्रकट आदि ब्रह्मांडीय सिद्धांत (ब्रह्म) घोषित करैत अछि, आ चतुर्थी तिथि चक्र मे हुनकर निर्धारित पूजाक दिन अछि।",
    aboutChaturthiText2:
      "चतुर्थीक दू प्रकार मासिक रूप सँ आवर्तित होइत अछि। संकष्टी चतुर्थी कृष्ण पक्ष (करिया चान) मे पड़ैत अछि आ ई प्राथमिक मासिक गणेश व्रत अछि। भक्त लोकनि सूर्योदय सँ चान उगयबा धरि व्रत रखैत छथि, आ चान देखलाक आ गणेश पूजा कयलाक बादे व्रत तोड़ल जाइत अछि। एहि कारण सँ चान उगयबाक समय महत्वपूर्ण अछि  –  ई स्थान आ मौसमक अनुसार महत्वपूर्ण रूप सँ भिन्न होइत अछि। विनायक चतुर्थी शुक्ल पक्ष (उजर चान) मे पड़ैत अछि आ ई प्रातःकालक पूजा आ मोदकक भेंटक संग मनाओल जाइत अछि, यद्यपि ई संकष्टी सँ कम कठोरता रखैत अछि।",
    aboutChaturthiText3:
      "भव्य गणेश चतुर्थी पर्व (भाद्रपद शुक्ल चतुर्थी, अगस्त-सितंबर) एकटा १०-दिवसीय उत्सव अछि जे अनंत चतुर्दशी मे समाप्त होइत अछि। १८९३ मे लोकमान्य तिलक द्वारा सामुदायिक एकता केँ बढ़ावा देबाक लेल एकटा सार्वजनिक पर्वक रूप मे स्थापित, एहि मे विस्तृत माटिक गणेश स्थापना (पंडाल), दैनिक आरती, आ प्रतिष्ठित विसर्जन (विसर्जन) जुलूस शामिल अछि। चतुर्थी चंद्र दोष एकटा अद्वितीय निषेध अछि: भाद्रपद शुक्ल चतुर्थी पर, चान केँ नहि देखू (चंद्र दोष) लगैत कहल जाइत अछि। यदि गलती सँ देखल जाए, तँ स्यमंतक कथा वा कृष्ण स्तुतिक पाठ निर्धारित उपचार अछि।",
    aboutChaturthiText4:
      "मोदक (मीठक पकवान) गणेशक विशिष्ट भेंट अछि  –  संकष्टीक लेल पारंपरिक रूप सँ २१ मोदक तैयार कयल जाइत अछि, जे गणेश पुराणक २१ अध्याय केँ प्रतिनिधित्व करैत अछि। दूर्वा घास (बरमूडा घास) क ३ वा ५ पत्तीक गुच्छा अर्पित कयल जाइत अछि किएक तँ मानल जाइत अछि जे ओहि मे शीतलक गुण होइत अछि जे गणेश केँ प्रसन्न करैत अछि। प्रत्येक चतुर्थी २०२६ एकटा भिन्न सप्ताहक दिन पर पड़ैत अछि, आ चान उगयबाक समय निर्धारित करैत अछि जे संकष्टी व्रत कहिया तोड़ल जा सकैत अछि  –  ई पृष्ठ अहाँक स्थानक लेल सटीक चान उगयबाक गणना प्रदान करैत अछि।",
    guideTitle_ekadashi: "एकादशी व्रत नियम",
    guideTitle_purnima: "पूर्णिमा पालन मार्गदर्शिका",
    guideTitle_amavasya: "अमावस्या: की करब आ की नहि करब",
    guideTitle_pradosham: "प्रदोषक पालन केना करब",
    guideTitle_chaturthi: "चतुर्थी पूजा मार्गदर्शिका",
    guide_ekadashi_1: "सब अनाज, दालि, चावल, गेहूं आ मसूर सँ परहेज करू",
    guide_ekadashi_2: "अनुमत: फल, मेवा, दूध, जड़ि-सब्जी, साबूदाना, सेंधा नमक",
    guide_ekadashi_3:
      "व्रत (पारणा) अगिला दिन सूर्योदयक बाद मुदा द्वादशी तिथि समाप्त होमय सँ पहिने तोड़ू",
    guide_ekadashi_4: "निर्जला एकादशी: पूरा दिन भोजन वा जल नहि",
    guide_ekadashi_5: "विष्णु सहस्रनाम वा ॐ नमो भगवते वासुदेवाय क जप करू",
    guide_ekadashi_6:
      "दिन मे सुतबा सँ बचू  –  यदि संभव हो तँ रात्रि जागरणक लेल जागल रहू",
    guide_purnima_1: "पंचामृतक भेंटक संग सत्यनारायण कथा करू",
    guide_purnima_2:
      "व्रतक विकल्प: निर्जला (जल-रहित), फलाहारी (केवल फल), वा एकटा भोजन",
    guide_purnima_3: "दान करू: भोजन, वस्त्र, तिल, वा गाय केँ भोजन कराबू",
    guide_purnima_4: "कीर्तन आ ध्यानक संग जागरण करू",
    guide_purnima_5: "पवित्र नदी मे स्नान करू वा चान उगयबा पर मंदिर जाऊ",
    guide_purnima_6: "शरद पूर्णिमा पर खीर बनाऊ आ चानक रौशनी मे छोड़ि दिअ",
    guide_amavasya_do_1: "जल, तिल आ कुश घासक संग पितृ तर्पण करू",
    guide_amavasya_do_2:
      "ध्यान करू  –  करिया चान गहिर आत्मनिरीक्षण केँ समर्थन करैत अछि",
    guide_amavasya_do_3:
      "भगवान शनि केँ सरसों तेलक दीप अर्पित करू (विशेष रूप सँ शनिवार केँ)",
    guide_amavasya_do_4: "सोमवती अमावस्या (सोमवार) पर पीपर गाछक पूजा करू",
    guide_amavasya_dont_1: "नव उद्यम, व्यवसाय वा यात्रा शुरू करबा सँ बचू",
    guide_amavasya_dont_2: "पैघ खरीददारी, अनुबंध वा विवाह सँ बचू",
    guide_amavasya_dont_3: "केस वा नोह काटबा सँ बचू (पारंपरिक नुस्खा)",
    guide_amavasya_dont_4: "तामसिक भोजन (मांस, शराब, बासी भोजन) क सेवन सँ बचू",
    guide_pradosham_1:
      "प्रदोष कालक समय पूजा शुरू करू  –  सूर्यास्त सँ ९० मिनटक आसपास",
    guide_pradosham_2: "घीक दीप जराऊ आ शिव लिंग पर बेलपत्र अर्पित करू",
    guide_pradosham_3: "उजर फूलक संग दूधक अभिषेक करू",
    guide_pradosham_4:
      "महा मृत्युंजय मंत्र (१०८ बेर) वा श्री रुद्राष्टकक जप करू",
    guide_pradosham_5: "सूर्योदय सँ व्रत करू, साँझक पूजाक बाद तोड़ू",
    guide_pradosham_6:
      "शनि प्रदोष (शनिवार): विशेष रूप सँ साढ़े साती सँ राहतक लेल",
    guide_chaturthi_1: "सूर्योदय सँ चान उगयबा धरि व्रत करू (संकष्टी चतुर्थी)",
    guide_chaturthi_2: "चान देखलाक आ पूजा कयलाक बादे व्रत तोड़ू",
    guide_chaturthi_3: "२१ मोदक आ दूर्वा घास (३ वा ५ पत्तीक गुच्छा) अर्पित करू",
    guide_chaturthi_4: "गणपति अथर्वशीर्ष वा ॐ गं गणपतये नमः क जप करू",
    guide_chaturthi_5: "भाद्रपद चतुर्थी: चान केँ नहि देखू (चंद्र दोष)",
    guide_chaturthi_6:
      "यदि गणेश चतुर्थी पर गलती सँ चान देखल जाए, तँ स्यमंतक कथाक पाठ करू",
    viewCalendar: "पर्व पंचांग देखू",
  },
  mr: {
    back: "कॅलेंडर",
    completeDates: "संपूर्ण तारखा आणि वेळा",
    next: "पुढील",
    total: "एकूण",
    date: "तारीख",
    day: "दिवस",
    name: "नाव",
    timings: "वेळा",
    paksha: "पक्ष",
    shukla: "शुक्ल",
    krishna: "कृष्ण",
    noEntries: "या महिन्यासाठी कोणतीही तारीख आढळली नाही",
    jumpTo: "महिन्यावर जा",
    loading: "लोड होत आहे...",
    aboutEkadashi: "एकादशीबद्दल",
    aboutEkadashiText1:
      "हिंदू कॅलेंडरनुसार, एकादशी ही प्रत्येक पंधरवड्यातील (पक्षातील) अकरावी तिथी (चंद्र दिवस) असते, जी महिन्यातून दोनदा येते – एकदा शुक्ल पक्षात (चंद्राची वाढ) आणि एकदा कृष्ण पक्षात (चंद्राची घट). यामुळे वर्षाला अंदाजे २४ एकादशी येतात, ज्यापैकी प्रत्येकाची पद्म पुराण आणि भविष्य पुराणात मूळ असलेली एक वेगळी आध्यात्मिक कथा आहे. बृहत् पराशर होरा शास्त्र (BPHS) एकादशीला स्वाभाविकपणे सात्त्विक मानते – हा असा दिवस आहे जेव्हा मन स्वाभाविकपणे चिंतन आणि संयमाकडे झुकते.",
    aboutEkadashiText2:
      "२४ एकादशींच्या चक्रात निर्जला एकादशी (ज्येष्ठ शुक्ल) सारख्या सुप्रसिद्ध एकादशींचा समावेश आहे, जी सर्वात कठोर मानली जाते कारण भक्त संपूर्ण दिवस अन्न आणि पाणी दोन्हीपासून दूर राहतात. पापंकुशा एकादशी (आश्विन शुक्ल) संचित पापांपासून मुक्ती देते असे मानले जाते, तर देवउठनी एकादशी (कार्तिक शुक्ल) चातुर्मासाची समाप्ती दर्शवते जेव्हा भगवान विष्णू वैश्विक निद्रेतून जागे होतात. प्रत्येक एकादशीची २०२६ मधील तारीख स्थानानुसार बदलते कारण तिथीची मर्यादा स्थानिक सूर्योदयावर अवलंबून असते – हे पृष्ठ तुमच्या निर्देशांकांसाठी अचूक वेळांची गणना करते.",
    aboutEkadashiText3:
      "एकादशीच्या उपवासाचे नियम हरिभक्ति विलासात संहिताबद्ध आहेत. धान्य आणि कडधान्यांपासून (अन्न) पूर्ण उपवास करणे ही सामान्य प्रथा आहे. फळे, सुकामेवा, दूध, कंदमुळे (बटाटा, रताळे), साबुदाणा आणि सैंधव मीठ (शेंदेलोण) यांसारखे पदार्थ सेवन करण्यास परवानगी आहे. सामान्य मीठ, तांदूळ, गहू, डाळी आणि मोहरीचे तेल पूर्णपणे टाळले जाते. यामागील वैज्ञानिक कारण आधुनिक इंटरमिटंट फास्टिंग (उपवास) संशोधनाशी जुळते: २४ तासांचा धान्यमुक्त कालावधी पचनसंस्थेला वेळोवेळी रीसेट करतो, इन्सुलिन वाढ कमी करतो आणि ऑटोफॅजीला प्रोत्साहन देतो – जी शरीराची पेशी दुरुस्त करण्याची यंत्रणा आहे.",
    aboutEkadashiText4:
      "पारण (उपवास सोडणे) दुसऱ्या दिवशी निर्धारित वेळेत – सूर्योदयानंतर परंतु द्वादशी तिथी संपण्यापूर्वी केले पाहिजे. जर द्वादशी दुसऱ्या दिवशी सूर्योदयापूर्वी संपली, तर पारण सूर्योदयानंतर लगेच केले पाहिजे. पारण करण्याची वेळ चुकणे हे उपवास चुकण्याइतकेच अशुभ मानले जाते. प्रादेशिक भिन्नता अस्तित्वात आहेत: स्मार्त एकादशी वैष्णव एकादशीपेक्षा वेगळ्या कॅलेंडर गणनेनुसार पाळली जाते आणि काही वर्षांत अधिक मासामुळे एक अतिरिक्त (अधिक मास) एकादशीची जोडी येते.",
    aboutPurnima: "पौर्णिमेबद्दल",
    aboutPurnimaText1:
      "पौर्णिमा हा पौर्णिमेचा दिवस आहे – शुक्ल पक्षाची पंधरावी आणि शेवटची तिथी जेव्हा चंद्र पूर्णपणे प्रकाशित होतो. ती प्रत्येक सिनोडिक महिन्यातून (अंदाजे २९.५३ दिवसांनी) एकदा येते आणि वैदिक कालमापनात मध्यवर्ती स्थान धारण करते. उत्तर भारतात वापरल्या जाणाऱ्या पौर्णिमांत कॅलेंडर प्रणालीमध्ये, पौर्णिमा महिन्यांची सीमा दर्शवते: महिना पौर्णिमेच्या दिवशी संपतो, ज्यामुळे ग्रेगोरियन प्रणालीतील ३१ डिसेंबरच्या कॅलेंडर समतुल्य बनते.",
    aboutPurnimaText2:
      "हिंदू वर्षात १२ ते १३ नावाच्या पौर्णिमा असतात, त्यापैकी प्रत्येक विशिष्ट उत्सवाशी संबंधित आहे. गुरुपौर्णिमा (आषाढ) गुरुपरंपरा आणि वेदांचे संकलक व्यास यांचा सन्मान करते. शरद पौर्णिमा (आश्विन) हा कापणीच्या चंद्राचा उत्सव आहे, जेव्हा चंद्र अमृत (मध) वर्षाव करतो असे मानले जाते – भक्त चंद्राच्या प्रकाशाखाली खीर तयार करतात. कार्तिक पौर्णिमा देव दिवाळीशी जुळते आणि गंगा स्नानासाठी पवित्र मानली जाते. बुद्ध पौर्णिमा (वैशाख) गौतम बुद्धांचा जन्म, ज्ञानप्राप्ती आणि परिनिर्वाण साजरे करते. होळी फाल्गुन पौर्णिमेला येते आणि रक्षाबंधन श्रावण पौर्णिमेला येते.",
    aboutPurnimaText3:
      "आयुर्वेद आणि सूर्य सिद्धांत दोन्ही जैविक लयांवर चंद्राच्या प्रभावाचे दस्तऐवजीकरण करतात. पौर्णिमेच्या दिवशी चंद्राचे गुरुत्वाकर्षण समुद्राच्या भरती-ओहोटीवर लक्षणीय परिणाम करते आणि पारंपारिक कृषी कॅलेंडर पौर्णिमेच्या आसपास पेरणी आणि कापणीची वेळ ठरवतात. चरक संहितेत असे नमूद केले आहे की पौर्णिमेला कफ दोषाची वाढ होते, त्यामुळे हलके जेवण आणि ध्यान करण्याचा सल्ला दिला जातो. आधुनिक क्रोनोबायोलॉजी पूर्ण चंद्राच्या आसपास वाढलेली मेलाटोनिन संवेदनशीलता आणि बदललेली झोपेची रचना याची पुष्टी करते – पौर्णिमेला उपवास आणि रात्रीच्या जागरणाच्या (जागरण) प्राचीन नियमांना अनुभवजन्य वजन देते.",
    aboutPurnimaText4:
      "पौर्णिमेच्या उत्सवांमध्ये सामान्यतः सत्यनारायण कथा समाविष्ट असते – स्कंद पुराणातून वर्णन केलेली भगवान विष्णूंना समर्पित पूजा, जी पंचामृताने केली जाते आणि समुदायाला प्रसाद म्हणून दिली जाते. पौर्णिमेचा उपवास प्रादेशिक परंपरेनुसार निर्जला (पाण्याशिवाय) ते फलाहारी (फक्त फळे) पर्यंत असतो. पौर्णिमेला दिलेले दान (विशेषतः अन्न, वस्त्र आणि तीळ) वाढीव आध्यात्मिक पुण्य देते असे मानले जाते. २०२६ मध्ये, प्रत्येक पौर्णिमेची तारीख आणि चंद्रोदयाची वेळ स्थानानुसार बदलते; हे पृष्ठ तुमच्या निर्देशांकांसाठी त्यांची अचूक गणना करते.",
    aboutAmavasya: "अमावस्येबद्दल",
    aboutAmavasyaText1:
      "अमावस्या हा अमावस्येचा दिवस आहे – कृष्ण पक्षाची तिसावी आणि शेवटची तिथी जेव्हा चंद्र पूर्णपणे अदृश्य असतो. गुजरात, महाराष्ट्र, कर्नाटक आणि दक्षिण भारतात पाळल्या जाणाऱ्या अमांत (अमावस्यांत) कॅलेंडर प्रणालीमध्ये, अमावस्या चंद्र महिन्याचा शेवटचा दिवस दर्शवते. हा शब्द संस्कृत 'अमा' (एकत्र) आणि 'वस्या' (राहणे) या शब्दांवरून आला आहे, जो सूर्य आणि चंद्राच्या संयोगाला सूचित करतो – ते आकाशात एकाच रेखांशावर असतात, ज्यामुळे चंद्र अंधारलेला दिसतो.",
    aboutAmavasyaText2:
      "पितृ तर्पणासाठी अमावस्येला अत्यंत महत्त्व आहे – दिवंगत पूर्वजांना पाणी, तीळ आणि कुशा गवताचे विधीपूर्वक अर्पण. गरुड पुराण आणि मार्कंडेय पुराण अमावस्येला पितृ लोक (पूर्वजांचे क्षेत्र) सर्वात जास्त सुलभ असतो असा दिवस म्हणून सांगतात. सोमवती अमावस्या, जी सोमवारी येते, तर्पण आणि पिंपळाच्या झाडाच्या पूजेसाठी विशेष फलदायी मानली जाते. मौनी अमावस्या (माघ) मौन व्रत (शांततेचे व्रत) आणि पवित्र नदी स्नानाचे विधान करते – कुंभमेळ्याचे सर्वात पवित्र स्नान याच दिवशी येते.",
    aboutAmavasyaText3:
      "दिवाळीचा सण कार्तिक अमावस्येला येतो, जो अन्यथा गंभीर असलेल्या अमावस्येला वर्षातील सर्वात मोठा उत्सव बनवतो. या दिवशी प्रदोष काळ आणि निशिता काळात लक्ष्मी पूजा केली जाते. शनि अमावस्या (शनिवार) भगवान शनीला मोहरीचे तेल अर्पण करून पाळली जाते, ज्यामुळे कुंडलीतील शनीचे अशुभ प्रभाव कमी होतात असे मानले जाते. काली पूजा, विशेषतः बंगालमध्ये, अमावस्येशी जुळते जेव्हा देवी कालीच्या तीव्र ऊर्जेचा रात्रभर पूजेद्वारे सन्मान केला जातो.",
    aboutAmavasyaText4:
      "अमावस्या पारंपारिकपणे नवीन उपक्रम, विवाह किंवा प्रवासासाठी अशुभ मानली जात असली तरी, ती आत्मनिरीक्षण आणि तांत्रिक पद्धतींसाठी अत्यंत शक्तिशाली मानली जाते. अमावस्येला ध्यान केल्याने चेतनेच्या खोलवर अवस्थांमध्ये प्रवेश होतो असे मानले जाते कारण बाह्य संवेदी विचलन (चंद्राचा प्रकाश) अनुपस्थित असतो. आयुर्वेद असे नमूद करतो की अमावस्येला वात दोषाची वाढ होते, त्यामुळे उष्ण, पौष्टिक अन्न आणि तेल मालिश (अभ्यंग) करण्याची शिफारस केली जाते. २०२६ मधील अमावस्येच्या तारखा वेळ क्षेत्र आणि स्थानानुसार बदलतात – हे पृष्ठ तुमच्या निर्देशांकांसाठी अचूक वेळा प्रदान करते.",
    aboutPradosham: "प्रदोषबद्दल",
    aboutPradoshamText1:
      "प्रदोष (प्रदोष व्रत) प्रत्येक चंद्र पंधरवड्याच्या (शुक्ल आणि कृष्ण पक्ष दोन्ही) तेराव्या तिथीला (त्रयोदशी) येतो – ज्यामुळे वर्षाला अंदाजे २४ प्रदोष दिवस येतात. 'प्रदोष' या शब्दाचा अर्थ 'रात्रीचा पहिला भाग' असा होतो आणि तो सूर्यास्तापासून रात्रीपर्यंतच्या संधिप्रकाश काळाला सूचित करतो. स्कंद पुराणानुसार, हा ९० मिनिटांचा कालावधी, ज्याला प्रदोष काळ म्हणतात, भगवान शंकराच्या पूजेसाठी सर्वात पवित्र वेळ मानला जातो.",
    aboutPradoshamText2:
      "प्रदोषाची उत्पत्ती कथा स्कंद पुराणातून येते. जेव्हा देव आणि दानवांनी cosmic ocean (समुद्रमंथन) केले, तेव्हा त्रयोदशीच्या प्रदोष काळात हलाहल नावाचे प्राणघातक विष बाहेर पडले. भगवान शंकरांनी सृष्टी वाचवण्यासाठी ते विष प्राशन केले आणि पार्वतीने ते खाली जाऊ नये म्हणून त्यांचा गळा दाबला – ज्यामुळे त्यांचा गळा निळा झाला (नीलकंठ). नंदी, शंकराचा दिव्य बैल, या संधिप्रकाश काळात तीव्र तपश्चर्या केली असे मानले जाते, ज्यामुळे त्याला असा वर मिळाला की जो कोणी प्रदोष काळात शंकराची पूजा करेल त्याला त्वरित कृपा प्राप्त होईल.",
    aboutPradoshamText3:
      "शनि प्रदोष (शनिवार) आणि सोम प्रदोष (सोमवार) यांना विशेष महत्त्व आहे. शनि प्रदोष शनीच्या कर्मिक शिस्तीला शंकराच्या परिवर्तनकारी शक्तीशी जोडतो – विशेषतः ज्यांच्या कुंडलीत साडेसाती किंवा शनीची दशा चालू आहे त्यांच्यासाठी याची शिफारस केली जाते. सोम प्रदोष चंद्राच्या भावनिक उपचारांना शंकराच्या पूजेशी जोडतो, मानसिक शांती आणि भावनिक स्थैर्यासाठी याची शिफारस केली जाते. भौम प्रदोष (मंगळवार) मंगळाशी संबंधित उपायांसाठी, विशेषतः मंगळ दोषासाठी पाळला जातो.",
    aboutPradoshamText4:
      "प्रदोष पूजा विधीमध्ये संधिप्रकाश काळात तुपाचा दिवा लावणे, बेलपत्र, पांढरी फुले आणि शिवलिंगाला दुधाचा अभिषेक करणे समाविष्ट आहे. भक्त दिवसभर उपवास करतात आणि संध्याकाळच्या पूजेनंतर तो सोडतात. प्रदोष काळात महामृत्युंजय मंत्र आणि रुद्राचे पठण अत्यंत प्रभावी मानले जाते. २०२६ मधील प्रदोषाच्या तारखा आणि प्रदोष काळाची अचूक वेळ तुमच्या स्थानिक सूर्यास्ताच्या वेळेवर अवलंबून असते – हे पृष्ठ तुमच्या स्थानासाठी दोन्हीची गणना करते.",
    aboutChaturthi: "चतुर्थीबद्दल",
    aboutChaturthiText1:
      "चतुर्थी ही प्रत्येक चंद्र पंधरवड्याची चौथी तिथी आहे, जी भगवान गणेशाला पवित्र आहे – विघ्नहर्ता आणि प्रत्येक हिंदू समारंभाच्या सुरुवातीला आवाहन केले जाणारे देवता. गणपती अथर्वशीर्ष उपनिषद गणेशाला हत्तीच्या रूपात प्रकट झालेले आदिम वैश्विक तत्त्व (ब्रह्म) घोषित करते आणि चतुर्थी हा तिथी चक्रातील त्यांचा निर्धारित पूजा दिवस आहे.",
    aboutChaturthiText2:
      "दोन प्रकारच्या चतुर्थी दरमहा येतात. संकष्टी चतुर्थी कृष्ण पक्षात (चंद्राची घट) येते आणि हे मुख्य मासिक गणेश व्रत आहे. भक्त सूर्योदयापासून चंद्रोदयापर्यंत उपवास करतात आणि चंद्रदर्शन व गणेश पूजा केल्यानंतरच उपवास सोडला जातो. म्हणून चंद्रोदयाची वेळ महत्त्वाची आहे – ती स्थान आणि ऋतूनुसार लक्षणीयरीत्या बदलते. विनायक चतुर्थी शुक्ल पक्षात (चंद्राची वाढ) येते आणि सकाळची पूजा व मोदक अर्पण करून पाळली जाते, जरी ती संकष्टीपेक्षा कमी कठोर असते.",
    aboutChaturthiText3:
      "भव्य गणेश चतुर्थी उत्सव (भाद्रपद शुक्ल चतुर्थी, ऑगस्ट-सप्टेंबर) हा १० दिवसांचा उत्सव आहे, जो अनंत चतुर्दशीला समाप्त होतो. १८९३ मध्ये लोकमान्य टिळकांनी सामुदायिक एकता वाढवण्यासाठी सार्वजनिक उत्सव म्हणून याची स्थापना केली, यात विस्तृत मातीच्या गणेश मूर्ती (पंडाल), दररोजची आरती आणि प्रतिष्ठित विसर्जन मिरवणूक (विसर्जन) यांचा समावेश असतो. चतुर्थी चंद्र दोष ही एक अनोखी मनाई आहे: भाद्रपद शुक्ल चतुर्थीला चंद्र पाहिल्याने खोटे आरोप (भागवत पुराणातील स्यमंतक मणीचा शाप) येतात असे मानले जाते. जर चुकून चंद्र दिसला, तर स्यमंतक कथा किंवा कृष्ण स्तुतीचे पठण हा निर्धारित उपाय आहे.",
    aboutChaturthiText4:
      "मोदक (गोड डंपलिंग) हे गणेशाचे खास नैवेद्य आहे – संकष्टीसाठी पारंपारिकपणे २१ मोदक तयार केले जातात, जे गणेश पुराणातील २१ अध्यायांचे प्रतिनिधित्व करतात. ३ किंवा ५ पात्यांचे दुर्वा (बर्मुडा गवत) चे गठ्ठे अर्पण केले जातात कारण त्यांना गणेशाला प्रसन्न करणारे शीतलता देणारे गुणधर्म आहेत असे मानले जाते. २०२६ मधील प्रत्येक चतुर्थी वेगवेगळ्या आठवड्याच्या दिवशी येते आणि चंद्रोदयाची वेळ संकष्टीचा उपवास कधी सोडायचा हे ठरवते – हे पृष्ठ तुमच्या स्थानासाठी अचूक चंद्रोदय गणना प्रदान करते.",
    guideTitle_ekadashi: "एकादशी उपवासाचे नियम",
    guideTitle_purnima: "पौर्णिमा पालनासाठी मार्गदर्शक",
    guideTitle_amavasya: "अमावस्येचे काय करावे आणि काय करू नये",
    guideTitle_pradosham: "प्रदोष कसे पाळावे",
    guideTitle_chaturthi: "चतुर्थी पूजा मार्गदर्शक",
    guide_ekadashi_1: "सर्व धान्ये, कडधान्ये, तांदूळ, गहू आणि डाळी टाळा",
    guide_ekadashi_2:
      "परवानगी आहे: फळे, सुकामेवा, दूध, कंदमुळे, साबुदाणा, सैंधव मीठ (शेंदेलोण)",
    guide_ekadashi_3:
      "दुसऱ्या दिवशी सूर्योदयानंतर परंतु द्वादशी तिथी संपण्यापूर्वी उपवास (पारण) सोडा",
    guide_ekadashi_4: "निर्जला एकादशी: संपूर्ण दिवस अन्न किंवा पाणी नाही",
    guide_ekadashi_5: "विष्णु सहस्रनाम किंवा ॐ नमो भगवते वासुदेवाय चा जप करा",
    guide_ekadashi_6:
      "दिवसा झोपणे टाळा – शक्य असल्यास रात्रीच्या जागरणासाठी जागे रहा",
    guide_purnima_1: "पंचामृत अर्पण करून सत्यनारायण कथा करा",
    guide_purnima_2:
      "उपवासाचे पर्याय: निर्जला (पाण्याशिवाय), फलाहारी (फक्त फळे), किंवा एक वेळचे जेवण",
    guide_purnima_3: "दान करा: अन्न, वस्त्र, तीळ किंवा गोसेवा",
    guide_purnima_4: "कीर्तन आणि ध्यानासह जागरण (रात्रीचा जागर) करा",
    guide_purnima_5:
      "पवित्र नदीत स्नान करा किंवा चंद्रोदयाच्या वेळी मंदिराला भेट द्या",
    guide_purnima_6: "शरद पौर्णिमेला खीर तयार करून चंद्राच्या प्रकाशाखाली ठेवा",
    guide_amavasya_do_1: "पाणी, तीळ आणि कुशा गवताने पितृ तर्पण करा",
    guide_amavasya_do_2: "ध्यान करा – अमावस्या खोल आत्मनिरीक्षणास मदत करते",
    guide_amavasya_do_3:
      "भगवान शनीला मोहरीच्या तेलाचा दिवा लावा (विशेषतः शनिवारी)",
    guide_amavasya_do_4:
      "सोमवती अमावस्येला (सोमवारी) पिंपळाच्या झाडाची पूजा करा",
    guide_amavasya_dont_1: "नवीन उपक्रम, व्यवसाय किंवा प्रवास सुरू करणे टाळा",
    guide_amavasya_dont_2: "मोठ्या खरेदी, करार किंवा विवाह टाळा",
    guide_amavasya_dont_3: "केस किंवा नखे कापणे टाळा (पारंपारिक नियम)",
    guide_amavasya_dont_4: "तामसिक पदार्थ (मांस, दारू, शिळे अन्न) खाणे टाळा",
    guide_pradosham_1:
      "प्रदोष काळात पूजा सुरू करा – सूर्यास्ताच्या आसपास ९० मिनिटे",
    guide_pradosham_2: "तुपाचा दिवा लावा आणि शिवलिंगाला बेलपत्र अर्पण करा",
    guide_pradosham_3: "पांढऱ्या फुलांनी दुधाचा अभिषेक करा",
    guide_pradosham_4:
      "महामृत्युंजय मंत्र (१०८ वेळा) किंवा श्री रुद्राचा जप करा",
    guide_pradosham_5: "सूर्योदयापासून उपवास करा, संध्याकाळच्या पूजेनंतर सोडा",
    guide_pradosham_6: "शनि प्रदोष (शनिवार): विशेषतः साडेसातीपासून मुक्तीसाठी",
    guide_chaturthi_1:
      "सूर्योदयापासून चंद्रोदयापर्यंत उपवास करा (संकष्टी चतुर्थी)",
    guide_chaturthi_2: "चंद्रदर्शन आणि पूजा केल्यानंतरच उपवास सोडा",
    guide_chaturthi_3:
      "२१ मोदक आणि दुर्वा (३ किंवा ५ पात्यांचे गठ्ठे) अर्पण करा",
    guide_chaturthi_4: "गणपती अथर्वशीर्ष किंवा ॐ गं गणपतये नमः चा जप करा",
    guide_chaturthi_5: "भाद्रपद चतुर्थी: चंद्र पाहू नका (चंद्र दोष)",
    guide_chaturthi_6:
      "गणेश चतुर्थीला चुकून चंद्र दिसल्यास, स्यमंतक कथा पठण करा",
    viewCalendar: "उत्सव कॅलेंडर पहा",
  },
  ta: {
    back: "நாட்காட்டி",
    completeDates: "முழுமையான தேதிகள் மற்றும் நேரங்கள்",
    next: "அடுத்து",
    total: "மொத்தம்",
    date: "தேதி",
    day: "நாள்",
    name: "பெயர்",
    timings: "நேரங்கள்",
    paksha: "பக்ஷம்",
    shukla: "சுக்ல",
    krishna: "கிருஷ்ண",
    noEntries: "இந்த மாதத்திற்கு தேதிகள் எதுவும் இல்லை",
    jumpTo: "மாதத்திற்கு செல்ல",
    loading: "ஏற்றப்படுகிறது...",
    aboutEkadashi: "ஏகாதசி பற்றி",
    aboutEkadashiText1:
      "ஏகாதசி என்பது இந்து நாட்காட்டியில் ஒவ்வொரு பக்ஷத்திலும் வரும் பதினோராம் திதி (சந்திர நாள்) ஆகும். இது ஒவ்வொரு மாதமும் இருமுறை வருகிறது – ஒருமுறை சுக்ல பக்ஷத்திலும் (வளர்பிறை) ஒருமுறை கிருஷ்ண பக்ஷத்திலும் (தேய்பிறை). இதன் மூலம் ஆண்டுக்கு சுமார் 24 பெயரிடப்பட்ட ஏகாதசிகள் வருகின்றன, ஒவ்வொன்றும் பத்ம புராணம் மற்றும் பவிஷ்ய புராணத்தில் வேரூன்றிய தனித்துவமான ஆன்மீகக் கதையைக் கொண்டுள்ளன. பிருஹத் பராசர ஹோரா சாஸ்திரம் (BPHS) ஏகாதசியை உள்ளார்ந்த சாத்வீகமானதாக வகைப்படுத்துகிறது – மனம் இயற்கையாகவே தியானம் மற்றும் கட்டுப்பாட்டை நோக்கிச் செல்லும் ஒரு நாள்.",
    aboutEkadashiText2:
      "24 ஏகாதசி சுழற்சியில் நிர்ஜல ஏகாதசி (ஜ்யேஷ்ட சுக்ல) போன்ற நன்கு அறியப்பட்ட அனுசரிப்புகள் அடங்கும், இது மிகவும் கடுமையானதாகக் கருதப்படுகிறது, ஏனெனில் பக்தர்கள் நாள் முழுவதும் உணவு மற்றும் தண்ணீர் இரண்டையும் தவிர்ப்பார்கள். பாபங்குஷா ஏகாதசி (அஸ்வின் சுக்ல) திரண்ட பாவங்களை நீக்கும் என்று நம்பப்படுகிறது, அதே நேரத்தில் தேவூத்தானி ஏகாதசி (கார்த்திக் சுக்ல) சதுர்மாஸ் முடிவைக் குறிக்கிறது, அப்போது விஷ்ணு பகவான் தனது அண்ட உறக்கத்திலிருந்து விழித்தெழுவார். ஒவ்வொரு 2026 ஏகாதசி தேதியும் இருப்பிடத்திற்கு ஏற்ப மாறுபடும், ஏனெனில் திதி எல்லை உள்ளூர் சூரிய உதயத்தைப் பொறுத்தது – இந்த பக்கம் உங்கள் ஆயத்தொலைவுகளுக்கான சரியான நேரங்களைக் கணக்கிடுகிறது.",
    aboutEkadashiText3:
      "ஏகாதசி விரத விதிகள் ஹரி பக்தி விலாசத்தில் குறியிடப்பட்டுள்ளன. தானியங்கள் மற்றும் பருப்பு வகைகளிலிருந்து (அன்னம்) முழுமையான விரதம் இருப்பது வழக்கமான நடைமுறையாகும். அனுமதிக்கப்பட்ட உணவுகளில் பழங்கள், கொட்டைகள், பால், கிழங்கு காய்கறிகள் (உருளைக்கிழங்கு, சர்க்கரைவள்ளிக்கிழங்கு), சபுதானா (மரவள்ளிக்கிழங்கு) மற்றும் இந்துப்பு (செந்தா நமக்) ஆகியவை அடங்கும். வழக்கமான சமையல் உப்பு, அரிசி, கோதுமை, பருப்பு வகைகள் மற்றும் கடுகு எண்ணெய் கண்டிப்பாக தவிர்க்கப்படுகின்றன. விஞ்ஞான ரீதியான காரணம் நவீன இடைப்பட்ட விரத ஆராய்ச்சியுடன் ஒத்துப்போகிறது: 24 மணி நேர தானியமற்ற சாளரம் செரிமான அமைப்புக்கு ஒரு குறிப்பிட்ட கால மறுசீரமைப்பை அளிக்கிறது, இன்சுலின் அதிகரிப்பைக் குறைக்கிறது மற்றும் ஆட்டோஃபேஜியை ஊக்குவிக்கிறது – இது உடலின் செல் பழுதுபார்க்கும் பொறிமுறை.",
    aboutEkadashiText4:
      "பாரணம் (விரதத்தை முடித்தல்) அடுத்த நாள் நிர்ணயிக்கப்பட்ட நேரத்திற்குள் செய்யப்பட வேண்டும் – சூரிய உதயத்திற்குப் பிறகு ஆனால் துவாதசி திதி முடிவதற்குள். துவாதசி அடுத்த நாள் சூரிய உதயத்திற்கு முன் முடிந்தால், சூரிய உதயத்திற்கு உடனடியாகப் பிறகு பாரணம் செய்யப்பட வேண்டும். பாரண நேரத்தைத் தவறவிடுவது விரதத்தைத் தவறவிடுவதற்கு சமமான அசுபமாக கருதப்படுகிறது. பிராந்திய வேறுபாடுகள் உள்ளன: ஸ்மார்த்த ஏகாதசி வைஷ்ணவ ஏகாதசியை விட வேறுபட்ட காலண்டர் கணக்கீட்டைப் பின்பற்றுகிறது, மேலும் சில ஆண்டுகளில் இடைச்செருகல் மாதம் காரணமாக ஒரு கூடுதல் (அதிக மாச) ஏகாதசி ஜோடி தோன்றுகிறது.",
    aboutPurnima: "பௌர்ணமி பற்றி",
    aboutPurnimaText1:
      "பௌர்ணமி என்பது முழு நிலவு நாள் – சுக்ல பக்ஷத்தின் பதினைந்தாவது மற்றும் இறுதி திதி, அப்போது சந்திர வட்டம் முழுமையான ஒளியை அடைகிறது. இது ஒவ்வொரு சினோடிக் மாதத்திலும் (சுமார் 29.53 நாட்கள்) ஒருமுறை நிகழ்கிறது மற்றும் வேத காலக் கணக்கீட்டில் ஒரு மைய இடத்தைப் பிடித்துள்ளது. வட இந்தியா முழுவதும் பயன்படுத்தப்படும் பௌர்ணிமாந்த் காலண்டர் அமைப்பில், பௌர்ணமி மாதங்களுக்கு இடையிலான எல்லையைக் குறிக்கிறது: மாதம் முழு நிலவு நாளில் முடிவடைகிறது, இது கிரிகோரியன் அமைப்பில் டிசம்பர் 31 க்கு சமமான காலண்டர் ஆகும்.",
    aboutPurnimaText2:
      "இந்து ஆண்டு 12 முதல் 13 பெயரிடப்பட்ட பௌர்ணமிகளைக் கொண்டுள்ளது, ஒவ்வொன்றும் ஒரு குறிப்பிட்ட அனுசரிப்புடன் பிணைக்கப்பட்டுள்ளன. குரு பௌர்ணமி (ஆஷாட) குரு பரம்பரையையும் வேதங்களின் தொகுப்பாளரான வியாசரையும் கௌரவிக்கிறது. சரத் பௌர்ணமி (அஸ்வின்) என்பது அறுவடை நிலவு கொண்டாட்டமாகும், அப்போது சந்திரன் அமிர்தத்தை (அமுதம்) பொழியும் என்று நம்பப்படுகிறது – பக்தர்கள் நிலவொளியின் கீழ் கீரை தயார் செய்கிறார்கள். கார்த்திக் பௌர்ணமி தேவ் தீபாவளியுடன் ஒத்துப்போகிறது மற்றும் கங்கா ஸ்நானத்திற்கு புனிதமானது. புத்த பௌர்ணமி (வைசாக) கௌதம புத்தரின் பிறப்பு, ஞானம் மற்றும் பரிநிர்வாணத்தைக் கொண்டாடுகிறது. ஹோலி பால்குண பௌர்ணமியிலும், ரக்ஷா பந்தன் ஸ்ராவண பௌர்ணமியிலும் வருகிறது.",
    aboutPurnimaText3:
      "ஆயுர்வேதமும் சூரிய சித்தாந்தமும் சந்திரனின் உயிரியல் தாளங்கள் மீதான செல்வாக்கை ஆவணப்படுத்துகின்றன. முழு நிலவின் ஈர்ப்பு விசை கடல் அலைகளை அளவிடக்கூடிய அளவில் பாதிக்கிறது, மேலும் பாரம்பரிய விவசாய காலண்டர்கள் பௌர்ணமியைச் சுற்றி நடவு மற்றும் அறுவடை நேரத்தை நிர்ணயிக்கின்றன. சரக சம்ஹிதை கப தோஷம் பௌர்ணமியில் உச்சத்தை அடைகிறது என்று குறிப்பிடுகிறது, இலகுவான உணவுகள் மற்றும் தியானப் பயிற்சியைப் பரிந்துரைக்கிறது. நவீன கால உயிரியல் முழு நிலவைச் சுற்றி மெலடோனின் உணர்திறன் அதிகரிப்பதையும், தூக்கக் கட்டமைப்பில் மாற்றத்தையும் உறுதிப்படுத்துகிறது – பௌர்ணமியில் விரதம் மற்றும் இரவு விழிப்பு (ஜாக்ரன்) பற்றிய பண்டைய பரிந்துரைக்கு அனுபவபூர்வமான எடையைக் கொடுக்கிறது.",
    aboutPurnimaText4:
      "பௌர்ணமி அனுசரிப்புகளில் பொதுவாக சத்யநாராயண கதை அடங்கும் – இது ஸ்கந்த புராணத்திலிருந்து விவரிக்கப்படும் விஷ்ணு பகவானுக்கு அர்ப்பணிக்கப்பட்ட ஒரு பூஜை, பஞ்சாமிர்தத்துடன் செய்யப்படுகிறது மற்றும் சமூகத்திற்கு பிரசாதமாக வழங்கப்படுகிறது. பௌர்ணமியில் விரதம் நிர்ஜல (தண்ணீர் இல்லாத) முதல் பலஹாரி (பழங்கள் மட்டும்) வரை பிராந்திய பாரம்பரியத்தைப் பொறுத்து மாறுபடும். பௌர்ணமியில் வழங்கப்படும் தானம் (தர்மம்) – குறிப்பாக உணவு, உடை மற்றும் எள் – பெருகிய ஆன்மீக நன்மைகளை அளிக்கும் என்று கருதப்படுகிறது. 2026 இல், ஒவ்வொரு பௌர்ணமி தேதியும் மற்றும் சந்திர உதய நேரமும் இருப்பிடத்தைப் பொறுத்தது; இந்த பக்கம் உங்கள் ஆயத்தொலைவுகளுக்கு அவற்றை துல்லியமாகக் கணக்கிடுகிறது.",
    aboutAmavasya: "அமாவாசை பற்றி",
    aboutAmavasyaText1:
      'அமாவாசை என்பது அமாவாசை நாள் – கிருஷ்ண பக்ஷத்தின் முப்பதாவது மற்றும் இறுதி திதி, அப்போது சந்திரன் முற்றிலும் கண்ணுக்குத் தெரியாது. குஜராத், மகாராஷ்டிரா, கர்நாடகா மற்றும் தென் இந்தியாவில் பின்பற்றப்படும் அமந்த (அமாவாஸ்யாந்த்) காலண்டர் அமைப்பில், அமாவாசை சந்திர மாதத்தின் கடைசி நாளைக் குறிக்கிறது. இந்த வார்த்தை சமஸ்கிருதத்தில் "அம" (ஒன்றாக) மற்றும் "வஸ்ய" (வாழ) என்பதிலிருந்து உருவானது, சூரியன் மற்றும் சந்திரனின் இணைப்பைக் குறிக்கிறது – அவை வானத்தில் ஒரே தீர்க்கரேகையில் அமைந்து, சந்திரனை இருண்டதாக ஆக்குகின்றன.',
    aboutAmavasyaText2:
      "அமாவாசை பித்ரு தர்ப்பணத்திற்கு (மறைந்த முன்னோர்களுக்கு நீர், எள் மற்றும் குசப் புல் ஆகியவற்றை சடங்கு ரீதியாக வழங்குதல்) மிக முக்கியத்துவம் வாய்ந்தது. கருட புராணம் மற்றும் மார்க்கண்டேய புராணம் அமாவாசையை பித்ரு லோகம் (முன்னோர் உலகம்) மிகவும் அணுகக்கூடிய நாளாகக் குறிப்பிடுகின்றன. திங்கட்கிழமை வரும் சோம்வதி அமாவாசை, தர்ப்பணம் மற்றும் அரச மர வழிபாட்டிற்கு மிகவும் சக்தி வாய்ந்தது. மௌனி அமாவாசை (மாகா) மௌன விரதம் (மௌன சபதம்) மற்றும் புனித நதி நீராடலை பரிந்துரைக்கிறது – கும்ப மேளாவின் மிகவும் புனிதமான ஸ்நானம் இந்த நாளில் வருகிறது.",
    aboutAmavasyaText3:
      "தீபாவளி பண்டிகை கார்த்திக் அமாவாசையில் வருகிறது, இது பொதுவாக சோகமான அமாவாசையை ஆண்டின் மிகவும் கொண்டாடப்படும் இரவாக மாற்றுகிறது. இந்த நாளில், பிரதோஷ காலம் மற்றும் நிஷிதா காலத்தில் லட்சுமி பூஜை செய்யப்படுகிறது. சனி அமாவாசை (சனிக்கிழமை) சனி பகவானுக்கு கடுகு எண்ணெய் படையல்களுடன் அனுசரிக்கப்படுகிறது, இது ஒருவரின் ஜாதகத்தில் சனியின் அசுப விளைவுகளைக் குறைக்கும் என்று நம்பப்படுகிறது. காளி பூஜை, குறிப்பாக வங்காளத்தில், அமாவாசையுடன் ஒத்துப்போகிறது, அப்போது காளி தேவியின் உக்கிரமான ஆற்றல் இரவு முழுவதும் வழிபாட்டின் மூலம் கௌரவிக்கப்படுகிறது.",
    aboutAmavasyaText4:
      "அமாவாசை பாரம்பரியமாக புதிய முயற்சிகள், வணிகங்கள் அல்லது பயணங்களைத் தொடங்குவதற்கு அசுபமாகக் கருதப்பட்டாலும், அது ஆழ்ந்த உள்நோக்க மற்றும் தாந்திரீக பயிற்சிகளுக்கு மிகவும் சக்தி வாய்ந்ததாகக் கருதப்படுகிறது. அமாவாசையில் தியானம் ஆழ்ந்த உணர்வு நிலைகளை அடைய உதவும் என்று கூறப்படுகிறது, ஏனெனில் வெளிப்புற உணர்ச்சித் தொந்தரவு (நிலவொளி) இல்லை. ஆயுர்வேதம் அமாவாசையில் வாத தோஷம் அதிகரிக்கிறது என்று குறிப்பிடுகிறது, சூடான, நிலத்தடி உணவுகள் மற்றும் எண்ணெய் மசாஜ் (அப்யங்கா) பரிந்துரைக்கிறது. 2026 அமாவாசை தேதிகள் நேர மண்டலம் மற்றும் இருப்பிடத்தைப் பொறுத்து மாறுபடும் – இந்த பக்கம் உங்கள் ஆயத்தொலைவுகளுக்கு கணக்கிடப்பட்ட சரியான நேரங்களை வழங்குகிறது.",
    aboutPradosham: "பிரதோஷம் பற்றி",
    aboutPradoshamText1:
      'பிரதோஷம் (பிரதோஷ விரதம்) ஒவ்வொரு சந்திர பக்ஷத்தின் பதின்மூன்றாவது திதியில் (திரயோதசி) வருகிறது – சுக்ல மற்றும் கிருஷ்ண பக்ஷம் இரண்டுமே – ஆண்டுக்கு சுமார் 24 பிரதோஷ நாட்கள் வருகின்றன. "பிரதோஷம்" என்ற வார்த்தைக்கு "இரவின் முதல் பகுதி" என்று நேரடி பொருள், மேலும் இது சூரிய அஸ்தமனத்திற்கும் இரவுக்கும் இடைப்பட்ட அந்தி நேரத்தைக் குறிக்கிறது. பிரதோஷ காலம் எனப்படும் இந்த 90 நிமிட சாளரம், ஸ்கந்த புராணத்தின்படி சிவபெருமானை வழிபடுவதற்கு மிகவும் புனிதமான நேரமாகக் கருதப்படுகிறது.',
    aboutPradoshamText2:
      "பிரதோஷத்தின் தோற்றக் கதை ஸ்கந்த புராணத்திலிருந்து வருகிறது. தேவர்களும் அசுரர்களும் அண்டப் பெருங்கடலைக் (சமுத்திர மந்தன்) கடைந்தபோது, திரயோதசியின் பிரதோஷ காலத்தில் கொடிய விஷமான ஹாலஹலம் வெளிப்பட்டது. சிவபெருமான் படைப்பைக் காப்பாற்ற விஷத்தை உட்கொண்டார், மேலும் பார்வதி அது கீழே இறங்காமல் தடுக்க அவரது தொண்டையை அழுத்தினார் – அவரது தொண்டையை நீல நிறமாக மாற்றினார் (நீலகண்டன்). சிவபெருமானின் தெய்வீக காளையான நந்தி, இந்த அந்தி நேரத்தில் தீவிர தவம் செய்ததாகக் கூறப்படுகிறது, பிரதோஷ காலத்தில் சிவபெருமானை வழிபடுபவர்கள் விரைவான அருளைப் பெறுவார்கள் என்ற வரத்தைப் பெற்றார்.",
    aboutPradoshamText3:
      "சனி பிரதோஷம் (சனிக்கிழமை) மற்றும் சோம பிரதோஷம் (திங்கட்கிழமை) சிறப்பு முக்கியத்துவம் வாய்ந்தவை. சனி பிரதோஷம் சனியின் கர்ம ஒழுக்கத்தை சிவனின் மாற்றும் சக்தியுடன் இணைக்கிறது – குறிப்பாக தங்கள் ஜாதகத்தில் சடே சதி அல்லது சனி தசை உள்ளவர்களுக்கு பரிந்துரைக்கப்படுகிறது. சோம பிரதோஷம் சந்திரனின் உணர்ச்சிபூர்வமான குணப்படுத்துதலை சிவ வழிபாட்டுடன் இணைக்கிறது, இது மன அமைதி மற்றும் உணர்ச்சி ஸ்திரத்தன்மைக்கு பரிந்துரைக்கப்படுகிறது. பௌம பிரதோஷம் (செவ்வாய்க்கிழமை) செவ்வாய் கிரக தொடர்பான பரிகாரங்களுக்காக, குறிப்பாக மங்கள் தோஷத்திற்காக அனுசரிக்கப்படுகிறது.",
    aboutPradoshamText4:
      "பிரதோஷ பூஜை விதி அந்தி நேரத்தில் நெய் விளக்கு ஏற்றுதல், வில்வ இலைகள், வெள்ளை மலர்கள் மற்றும் பால் அபிஷேகம் ஆகியவற்றை சிவலிங்கத்திற்கு வழங்குவதை உள்ளடக்கியது. பக்தர்கள் நாள் முழுவதும் விரதம் அனுசரித்து, மாலை பூஜைக்குப் பிறகு அதை முடிப்பார்கள். பிரதோஷ காலத்தில் மகா மிருத்யுஞ்சய மந்திரம் மற்றும் ருத்ரம் உச்சரிப்பது விதிவிலக்காக சக்தி வாய்ந்ததாகக் கருதப்படுகிறது. 2026 பிரதோஷ தேதிகள் மற்றும் சரியான பிரதோஷ கால சாளரம் உங்கள் உள்ளூர் சூரிய அஸ்தமன நேரத்தைப் பொறுத்தது – இந்த பக்கம் உங்கள் இருப்பிடத்திற்கான இரண்டையும் கணக்கிடுகிறது.",
    aboutChaturthi: "சதுர்த்தி பற்றி",
    aboutChaturthiText1:
      "சதுர்த்தி என்பது ஒவ்வொரு சந்திர பக்ஷத்தின் நான்காவது திதி ஆகும், இது விநாயகப் பெருமானுக்கு புனிதமானது – தடைகளை நீக்குபவர் மற்றும் ஒவ்வொரு இந்து சடங்கின் தொடக்கத்திலும் அழைக்கப்படும் தெய்வம். கணபதி அதர்வஷீர்ஷ உபநிடதம் விநாயகரை யானை வடிவில் வெளிப்படும் ஆதி அண்டக் கொள்கையாக (பிரம்மன்) அறிவிக்கிறது, மேலும் சதுர்த்தி திதி சுழற்சியில் அவருக்கு நியமிக்கப்பட்ட வழிபாட்டு நாள்.",
    aboutChaturthiText2:
      "இரண்டு வகையான சதுர்த்திகள் மாதந்தோறும் மீண்டும் வருகின்றன. சங்கடஹர சதுர்த்தி கிருஷ்ண பக்ஷத்தில் (தேய்பிறை) வருகிறது மற்றும் இது முதன்மை மாத விநாயக விரதம். பக்தர்கள் சூரிய உதயத்திலிருந்து சந்திர உதயம் வரை விரதம் இருப்பார்கள், மேலும் சந்திரன் தரிசனம் மற்றும் விநாயக பூஜை செய்த பின்னரே விரதம் முடிவடையும். எனவே சந்திர உதய நேரம் மிகவும் முக்கியமானது – இது இருப்பிடம் மற்றும் பருவத்திற்கு ஏற்ப கணிசமாக மாறுபடும். விநாயக சதுர்த்தி சுக்ல பக்ஷத்தில் (வளர்பிறை) வருகிறது மற்றும் காலை பூஜை மற்றும் மோதக படையல்களுடன் அனுசரிக்கப்படுகிறது, இருப்பினும் இது சங்கடஹரத்தை விட குறைவான கடுமையானது.",
    aboutChaturthiText3:
      "பிரமாண்டமான விநாயக சதுர்த்தி விழா (பத்ரபத சுக்ல சதுர்த்தி, ஆகஸ்ட்-செப்டம்பர்) அனந்த சதுர்த்தியில் முடிவடையும் 10 நாள் கொண்டாட்டமாகும். சமூக ஒற்றுமையை வளர்ப்பதற்காக 1893 இல் லோக்மான்ய திலகரால் ஒரு பொது விழாவாக நிறுவப்பட்டது, இது விரிவான களிமண் விநாயகர் நிறுவல்களை (பந்தல்கள்), தினசரி ஆரத்தி மற்றும் சின்னமான விசர்ஜன் (மூழ்கடித்தல்) ஊர்வலத்தைக் கொண்டுள்ளது. சதுர்த்தி சந்திர தோஷம் ஒரு தனித்துவமான தடை: பத்ரபத சுக்ல சதுர்த்தியில், சந்திரனைப் பார்ப்பது தவறான குற்றச்சாட்டுகளை (பாகவத புராணத்திலிருந்து சியமந்தக ரத்தின சாபம்) கொண்டுவரும் என்று கூறப்படுகிறது. தற்செயலாக பார்த்தால், சியமந்தக கதையை அல்லது கிருஷ்ண ஸ்துதியை உச்சரிப்பது பரிந்துரைக்கப்பட்ட பரிகாரமாகும்.",
    aboutChaturthiText4:
      "மோதகம் (இனிப்பு கொழுக்கட்டை) விநாயகரின் சிறப்பு படையல் – சங்கடஹரத்திற்காக பாரம்பரியமாக 21 மோதகங்கள் தயாரிக்கப்படுகின்றன, இது விநாயக புராணத்தின் 21 அத்தியாயங்களைக் குறிக்கிறது. துர்வா புல் (அருகம்புல்) 3 அல்லது 5 இலைகளின் கட்டுகளாக வழங்கப்படுகிறது, ஏனெனில் அவை விநாயகரை மகிழ்விக்கும் குளிர்ச்சியான பண்புகளைக் கொண்டிருப்பதாக நம்பப்படுகிறது. ஒவ்வொரு 2026 சதுர்த்தியும் ஒரு வெவ்வேறு வார நாளில் வருகிறது, மேலும் சந்திர உதய நேரம் சங்கடஹர விரதத்தை எப்போது முடிப்பது என்பதை தீர்மானிக்கிறது – இந்த பக்கம் உங்கள் இருப்பிடத்திற்கான துல்லியமான சந்திர உதய கணக்கீடுகளை வழங்குகிறது.",
    guideTitle_ekadashi: "ஏகாதசி விரத விதிகள்",
    guideTitle_purnima: "பௌர்ணமி அனுசரிப்பு வழிகாட்டி",
    guideTitle_amavasya: "அமாவாசை செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை",
    guideTitle_pradosham: "பிரதோஷத்தை எவ்வாறு அனுசரிப்பது",
    guideTitle_chaturthi: "சதுர்த்தி பூஜை வழிகாட்டி",
    guide_ekadashi_1:
      "அனைத்து தானியங்கள், பருப்பு வகைகள், அரிசி, கோதுமை மற்றும் பயறு வகைகளை தவிர்க்கவும்",
    guide_ekadashi_2:
      "அனுமதிக்கப்பட்டவை: பழங்கள், கொட்டைகள், பால், கிழங்கு காய்கறிகள், சபுதானா, இந்துப்பு (செந்தா நமக்)",
    guide_ekadashi_3:
      "அடுத்த நாள் சூரிய உதயத்திற்குப் பிறகு ஆனால் துவாதசி திதி முடிவதற்கு முன் விரதத்தை (பாரணம்) முடிக்கவும்",
    guide_ekadashi_4: "நிர்ஜல ஏகாதசி: நாள் முழுவதும் உணவு அல்லது தண்ணீர் இல்லை",
    guide_ekadashi_5:
      "விஷ்ணு சஹஸ்ரநாமம் அல்லது ஓம் நமோ பகவதே வாசுதேவாய ஜபிக்கவும்",
    guide_ekadashi_6:
      "பகலில் தூங்குவதைத் தவிர்க்கவும் – முடிந்தால் இரவு விழிப்பிற்காக விழித்திருக்கவும்",
    guide_purnima_1: "பஞ்சாமிர்த படையலுடன் சத்யநாராயண கதை செய்யவும்",
    guide_purnima_2:
      "விரத விருப்பங்கள்: நிர்ஜல (தண்ணீர் இல்லாத), பலஹாரி (பழங்கள் மட்டும்), அல்லது ஒரு வேளை உணவு",
    guide_purnima_3:
      "தானம் (தர்மம்) செய்யவும்: உணவு, உடை, எள் அல்லது பசுவிற்கு உணவளித்தல்",
    guide_purnima_4:
      "கீர்த்தனம் மற்றும் தியானத்துடன் ஜாக்ரன் (இரவு விழிப்பு) அனுசரிக்கவும்",
    guide_purnima_5:
      "புனித நதி நீராடவும் அல்லது சந்திர உதயத்தின் போது கோவிலுக்குச் செல்லவும்",
    guide_purnima_6:
      "சரத் பௌர்ணமியில் கீரை தயார் செய்து நிலவொளியின் கீழ் வைக்கவும்",
    guide_amavasya_do_1:
      "நீர், எள் மற்றும் குசப் புல் கொண்டு பித்ரு தர்ப்பணம் செய்யவும்",
    guide_amavasya_do_2:
      "தியானம் செய்யவும் – இருண்ட சந்திரன் ஆழ்ந்த உள்நோக்கத்திற்கு துணைபுரிகிறது",
    guide_amavasya_do_3:
      "சனி பகவானுக்கு கடுகு எண்ணெய் விளக்கு ஏற்றவும் (குறிப்பாக சனிக்கிழமைகளில்)",
    guide_amavasya_do_4:
      "சோம்வதி அமாவாசையில் (திங்கட்கிழமை) அரச மரத்தை வழிபடவும்",
    guide_amavasya_dont_1:
      "புதிய முயற்சிகள், வணிகங்கள் அல்லது பயணங்களைத் தொடங்குவதைத் தவிர்க்கவும்",
    guide_amavasya_dont_2:
      "முக்கிய கொள்முதல், ஒப்பந்தங்கள் அல்லது திருமணங்களைத் தவிர்க்கவும்",
    guide_amavasya_dont_3:
      "முடி அல்லது நகங்களை வெட்டுவதைத் தவிர்க்கவும் (பாரம்பரிய பரிந்துரை)",
    guide_amavasya_dont_4:
      "தாமச உணவுகளை (இறைச்சி, மது, பழைய உணவு) உட்கொள்வதைத் தவிர்க்கவும்",
    guide_pradosham_1:
      "பிரதோஷ காலத்தில் வழிபாட்டைத் தொடங்கவும் – சூரிய அஸ்தமனத்தைச் சுற்றி 90 நிமிடங்கள்",
    guide_pradosham_2:
      "நெய் விளக்கு ஏற்றி சிவலிங்கத்திற்கு வில்வ இலைகளை வழங்கவும்",
    guide_pradosham_3: "வெள்ளை மலர்களுடன் பால் அபிஷேகம் செய்யவும்",
    guide_pradosham_4:
      "மகா மிருத்யுஞ்சய மந்திரம் (108 முறை) அல்லது ஸ்ரீ ருத்ரம் ஜபிக்கவும்",
    guide_pradosham_5:
      "சூரிய உதயத்திலிருந்து விரதம் இருந்து, மாலை பூஜைக்குப் பிறகு முடிக்கவும்",
    guide_pradosham_6:
      "சனி பிரதோஷம் (சனிக்கிழமை): குறிப்பாக சடே சதி நிவாரணத்திற்காக",
    guide_chaturthi_1:
      "சூரிய உதயத்திலிருந்து சந்திர உதயம் வரை விரதம் இருக்கவும் (சங்கடஹர சதுர்த்தி)",
    guide_chaturthi_2:
      "சந்திரனை தரிசித்த பின்னரும் பூஜை செய்த பின்னரும் மட்டுமே விரதத்தை முடிக்கவும்",
    guide_chaturthi_3:
      "21 மோதகங்கள் மற்றும் துர்வா புல் (3 அல்லது 5 இலை கட்டுகள்) வழங்கவும்",
    guide_chaturthi_4:
      "கணபதி அதர்வஷீர்ஷம் அல்லது ஓம் கம் கணபதயே நமஹ ஜபிக்கவும்",
    guide_chaturthi_5:
      "பத்ரபத சதுர்த்தி: சந்திரனைப் பார்க்க வேண்டாம் (சந்திர தோஷம்)",
    guide_chaturthi_6:
      "விநாயக சதுர்த்தியில் சந்திரன் தற்செயலாக பார்க்கப்பட்டால், சியமந்தக கதை உச்சரிக்கவும்",
    viewCalendar: "விழா நாட்காட்டியைப் பார்க்கவும்",
  },
  te: {
    back: "క్యాలెండర్",
    completeDates: "పూర్తి తేదీలు & సమయాలు",
    next: "తదుపరి",
    total: "మొత్తం",
    date: "తేదీ",
    day: "రోజు",
    name: "పేరు",
    timings: "సమయాలు",
    paksha: "పక్షం",
    shukla: "శుక్ల",
    krishna: "కృష్ణ",
    noEntries: "ఈ నెలకు తేదీలు కనుగొనబడలేదు",
    jumpTo: "నెలకు వెళ్ళు",
    loading: "లోడ్ అవుతోంది...",
    aboutEkadashi: "ఏకాదశి గురించి",
    aboutEkadashiText1:
      "ఏకాదశి అనేది హిందూ క్యాలెండర్‌లో ప్రతి పక్షంలో పదకొండవ తిథి (చంద్ర దినం), ప్రతి నెలా రెండుసార్లు వస్తుంది – ఒకసారి శుక్ల పక్షంలో (వృద్ది చెందుతున్న చంద్రుడు) మరియు ఒకసారి కృష్ణ పక్షంలో (క్షీణిస్తున్న చంద్రుడు). ఇది సంవత్సరానికి సుమారు 24 ఏకాదశులను ఇస్తుంది, ప్రతి ఒక్కటి పద్మ పురాణం మరియు భవిష్య పురాణాలలో పాతుకుపోయిన విభిన్న ఆధ్యాత్మిక కథనాన్ని కలిగి ఉంటుంది. బృహత్ పరాశర హోరా శాస్త్రం (BPHS) ఏకాదశిని అంతర్గతంగా సాత్వికమైనదిగా వర్గీకరిస్తుంది – మనస్సు సహజంగా ధ్యానం మరియు సంయమనం వైపు మొగ్గు చూపే రోజు.",
    aboutEkadashiText2:
      "24 ఏకాదశి చక్రంలో నిర్జల ఏకాదశి (జ్యేష్ఠ శుక్ల) వంటి ప్రసిద్ధ ఆచారాలు ఉన్నాయి, ఇది అత్యంత కఠినమైనదిగా పరిగణించబడుతుంది, ఎందుకంటే భక్తులు రోజంతా ఆహారం మరియు నీరు రెండింటినీ త్యజిస్తారు. పాపన్కుశ ఏకాదశి (ఆశ్వీయుజ శుక్ల) సంచిత పాపాలను పోగొడుతుందని నమ్ముతారు, అయితే దేవూత్తాని ఏకాదశి (కార్తీక శుక్ల) చాతుర్మాసం ముగింపును సూచిస్తుంది, అప్పుడు శ్రీ మహావిష్ణువు విశ్వ నిద్ర నుండి మేల్కొంటాడు. ప్రతి ఏకాదశి 2026 తేదీ స్థానాన్ని బట్టి మారుతుంది, ఎందుకంటే తిథి సరిహద్దు స్థానిక సూర్యోదయంపై ఆధారపడి ఉంటుంది – ఈ పేజీ మీ అక్షాంశరేఖాంశాలకు ఖచ్చితమైన సమయాలను లెక్కిస్తుంది.",
    aboutEkadashiText3:
      "ఏకాదశి ఉపవాస నియమాలు హరి భక్తి విలాసంలో క్రోడీకరించబడ్డాయి. ధాన్యాలు మరియు పప్పుధాన్యాల (అన్నం) నుండి పూర్తి ఉపవాసం ఉండటం ప్రామాణిక పద్ధతి. అనుమతించబడిన ఆహారాలలో పండ్లు, గింజలు, పాలు, దుంప కూరగాయలు (బంగాళదుంప, చిలగడదుంప), సగ్గుబియ్యం (టపియోకా) మరియు రాతి ఉప్పు (సైంధవ లవణం) ఉన్నాయి. సాధారణ టేబుల్ సాల్ట్, బియ్యం, గోధుమలు, పప్పులు మరియు ఆవాల నూనె ఖచ్చితంగా నివారించబడతాయి. శాస్త్రీయ హేతువు ఆధునిక అంతరాయ ఉపవాస పరిశోధనతో సరిపోలుతుంది: 24 గంటల ధాన్యం లేని విండో జీర్ణవ్యవస్థకు ఆవర్తన రీసెట్‌ను ఇస్తుంది, ఇన్సులిన్ స్పైక్‌లను తగ్గిస్తుంది మరియు ఆటోఫాగిని ప్రోత్సహిస్తుంది – శరీర కణ మరమ్మత్తు యంత్రాంగం.",
    aboutEkadashiText4:
      "పారణ (ఉపవాసం విరమించడం) మరుసటి రోజు నిర్దేశించిన సమయం లోపల చేయాలి – సూర్యోదయం తర్వాత కానీ ద్వాదశి తిథి ముగియడానికి ముందు. మరుసటి రోజు సూర్యోదయం కంటే ముందే ద్వాదశి ముగిసినట్లయితే, సూర్యోదయం అయిన వెంటనే పారణ చేయాలి. పారణ సమయాన్ని కోల్పోవడం ఉపవాసం కోల్పోయినంత అశుభకరమైనదిగా పరిగణించబడుతుంది. ప్రాంతీయ వైవిధ్యాలు ఉన్నాయి: స్మార్త ఏకాదశి వైష్ణవ ఏకాదశి కంటే భిన్నమైన క్యాలెండర్ గణనను అనుసరిస్తుంది, మరియు కొన్ని సంవత్సరాలలో అధిక మాసం కారణంగా అదనపు (అధిక మాసం) ఏకాదశి జత కనిపిస్తుంది.",
    aboutPurnima: "పౌర్ణమి గురించి",
    aboutPurnimaText1:
      "పౌర్ణమి అనేది పౌర్ణమి రోజు – శుక్ల పక్షంలో పదిహేనవ మరియు చివరి తిథి, అప్పుడు చంద్రుడు పూర్తిగా ప్రకాశిస్తాడు. ఇది ప్రతి సైనోడిక్ నెలలో (సుమారు 29.53 రోజులు) ఒకసారి సంభవిస్తుంది మరియు వేద కాలమానంలో కేంద్ర స్థానాన్ని కలిగి ఉంది. ఉత్తర భారతదేశంలో ఉపయోగించే పూర్ణిమాంత క్యాలెండర్ వ్యవస్థలో, పౌర్ణమి నెలల మధ్య సరిహద్దును సూచిస్తుంది: నెల పౌర్ణమి రోజున ముగుస్తుంది, ఇది గ్రెగోరియన్ వ్యవస్థలో డిసెంబర్ 31కి క్యాలెండర్ సమానం.",
    aboutPurnimaText2:
      "హిందూ సంవత్సరంలో 12 నుండి 13 పౌర్ణమిలు ఉంటాయి, ప్రతి ఒక్కటి ఒక నిర్దిష్ట ఆచారానికి ముడిపడి ఉంటుంది. గురు పౌర్ణమి (ఆషాఢం) గురు పరంపరను మరియు వేదాల సంకలనకర్త వ్యాసుడిని గౌరవిస్తుంది. శరద్ పౌర్ణమి (ఆశ్వీయుజం) అనేది పంట కోత చంద్రోత్సవం, అప్పుడు చంద్రుడు అమృతాన్ని (తేనె) కురిపిస్తాడని నమ్ముతారు – భక్తులు చంద్రకాంతి కింద ఉంచిన క్షీరాన్ని తయారుచేస్తారు. కార్తీక పౌర్ణమి దేవ దీపావళితో ఏకీభవిస్తుంది మరియు గంగా స్నానానికి పవిత్రమైనది. బుద్ధ పౌర్ణమి (వైశాఖం) గౌతమ బుద్ధుని జననం, జ్ఞానోదయం మరియు పరినిర్వాణాన్ని జరుపుకుంటుంది. హోలీ ఫాల్గుణ పౌర్ణమి నాడు వస్తుంది, మరియు రక్షా బంధన్ శ్రావణ పౌర్ణమి నాడు వస్తుంది.",
    aboutPurnimaText3:
      "ఆయుర్వేదం మరియు సూర్య సిద్ధాంతం రెండూ జీవ లయలపై చంద్రుని ప్రభావాన్ని నమోదు చేస్తాయి. పౌర్ణమి నాడు గురుత్వాకర్షణ శక్తి సముద్ర అలలను గణనీయంగా ప్రభావితం చేస్తుంది, మరియు సాంప్రదాయ వ్యవసాయ క్యాలెండర్లు పౌర్ణమి చుట్టూ నాటడం మరియు కోయడం సమయాన్ని నిర్ణయిస్తాయి. చరక సంహిత కఫ దోషం పౌర్ణమి నాడు గరిష్ట స్థాయికి చేరుకుంటుందని పేర్కొంది, తేలికపాటి భోజనం మరియు ధ్యాన అభ్యాసాన్ని సిఫార్సు చేస్తుంది. ఆధునిక క్రోనోబయాలజీ పౌర్ణమి చుట్టూ పెరిగిన మెలటోనిన్ సున్నితత్వం మరియు మారిన నిద్ర నిర్మాణాన్ని నిర్ధారిస్తుంది – పౌర్ణమి నాడు ఉపవాసం మరియు రాత్రి జాగరణ (జాగరణ) యొక్క ప్రాచీన సూచనకు అనుభవపూర్వక బరువును ఇస్తుంది.",
    aboutPurnimaText4:
      "పౌర్ణమి ఆచారాలలో సాధారణంగా సత్యనారాయణ కథ ఉంటుంది – స్కంద పురాణం నుండి వివరించబడిన శ్రీ మహావిష్ణువుకు అంకితం చేయబడిన పూజ, పంచామృతంతో నిర్వహించబడుతుంది మరియు సమాజానికి ప్రసాదంగా అందించబడుతుంది. పౌర్ణమి నాడు ఉపవాసం ప్రాంతీయ సంప్రదాయాన్ని బట్టి నిర్జల (నీరు లేకుండా) నుండి ఫలాహారి (పండ్లు మాత్రమే) వరకు ఉంటుంది. పౌర్ణమి నాడు ఇచ్చే దానం (దానం) – ముఖ్యంగా ఆహారం, వస్త్రాలు మరియు నువ్వులు – విస్తరించిన ఆధ్యాత్మిక పుణ్యాన్ని ఇస్తుందని పరిగణించబడుతుంది. 2026లో, ప్రతి పౌర్ణమి తేదీ మరియు చంద్రోదయ సమయం స్థానాన్ని బట్టి ఉంటుంది; ఈ పేజీ మీ అక్షాంశరేఖాంశాలకు వాటిని ఖచ్చితంగా లెక్కిస్తుంది.",
    aboutAmavasya: "అమావాస్య గురించి",
    aboutAmavasyaText1:
      'అమావాస్య అనేది అమావాస్య రోజు – కృష్ణ పక్షంలో ముప్పైవ మరియు చివరి తిథి, అప్పుడు చంద్రుడు పూర్తిగా కనిపించడు. గుజరాత్, మహారాష్ట్ర, కర్ణాటక మరియు దక్షిణ భారతదేశంలో అనుసరించే అమాంత (అమావాస్యాంత) క్యాలెండర్ వ్యవస్థలో, అమావాస్య చంద్ర మాసం చివరి రోజును సూచిస్తుంది. ఈ పదం సంస్కృతంలోని "అమ" (కలిసి) మరియు "వస్య" (నివసించు) నుండి ఉద్భవించింది, సూర్య చంద్రుల సంయోగాన్ని సూచిస్తుంది – అవి ఆకాశంలో ఒకే రేఖాంశంలో ఉంటాయి, చంద్రుడిని చీకటిగా మారుస్తాయి.',
    aboutAmavasyaText2:
      "అమావాస్య పితృ తర్పణానికి అత్యంత ప్రాముఖ్యతను కలిగి ఉంది – మరణించిన పూర్వీకులకు నీరు, నువ్వులు మరియు కుశ గడ్డితో చేసే ఆచారబద్ధమైన సమర్పణలు. గరుడ పురాణం మరియు మార్కండేయ పురాణం అమావాస్యను పితృ లోకం (పూర్వీకుల లోకం) అత్యంత అందుబాటులో ఉండే రోజుగా సూచిస్తాయి. సోమవారం వచ్చే సోమవతి అమావాస్య తర్పణానికి మరియు రావి చెట్టు పూజకు ప్రత్యేకంగా శక్తివంతమైనది. మౌని అమావాస్య (మాఘం) మౌన వ్రతం (మౌన ప్రతిజ్ఞ) మరియు పవిత్ర నది స్నానాన్ని సూచిస్తుంది – కుంభమేళా యొక్క అత్యంత పవిత్ర స్నానం ఈ రోజున వస్తుంది.",
    aboutAmavasyaText3:
      "దీపావళి పండుగ కార్తీక అమావాస్య నాడు వస్తుంది, లేకపోతే నిశ్శబ్దంగా ఉండే అమావాస్యను సంవత్సరంలో అత్యంత ప్రసిద్ధ రాత్రిగా మారుస్తుంది. ఈ రోజున, ప్రదోష కాలం మరియు నిశిత కాలంలో లక్ష్మీ పూజ నిర్వహిస్తారు. శని అమావాస్య (శనివారం) నాడు శని దేవునికి ఆవాల నూనె సమర్పణలతో ఆచరిస్తారు, ఇది ఒకరి జాతకంలో శని యొక్క దుష్ప్రభావాలను తగ్గిస్తుందని నమ్ముతారు. కాళీ పూజ, ముఖ్యంగా బెంగాల్‌లో, అమావాస్యతో ఏకీభవిస్తుంది, అప్పుడు కాళీ దేవత యొక్క భయంకరమైన శక్తి రాత్రిపూట పూజ ద్వారా గౌరవించబడుతుంది.",
    aboutAmavasyaText4:
      "అమావాస్య సాంప్రదాయకంగా కొత్త వ్యాపారాలు, వివాహాలు లేదా ప్రయాణాలకు అశుభకరమైనదిగా పరిగణించబడుతున్నప్పటికీ, ఇది ఆత్మపరిశీలన మరియు తాంత్రిక అభ్యాసాలకు లోతైన శక్తివంతమైనదిగా పరిగణించబడుతుంది. అమావాస్య నాడు ధ్యానం బాహ్య ఇంద్రియ పరధ్యానం (చంద్రకాంతి) లేనందున లోతైన చేతన స్థితులలోకి చొచ్చుకుపోతుందని చెప్పబడింది. ఆయుర్వేదం అమావాస్య నాడు వాత దోషం పెరుగుతుందని పేర్కొంది, వెచ్చని, భూమికి సంబంధించిన ఆహారాలు మరియు తైల మర్దన (అభ్యంగం) సిఫార్సు చేస్తుంది. అమావాస్య 2026 తేదీలు సమయ మండలం మరియు స్థానాన్ని బట్టి మారుతాయి – ఈ పేజీ మీ అక్షాంశరేఖాంశాలకు ఖచ్చితమైన సమయాలను అందిస్తుంది.",
    aboutPradosham: "ప్రదోషం గురించి",
    aboutPradoshamText1:
      'ప్రదోషం (ప్రదోష వ్రతం) ప్రతి చంద్ర పక్షంలో పదమూడవ తిథి (త్రయోదశి) నాడు వస్తుంది – శుక్ల మరియు కృష్ణ పక్షాలు రెండింటిలోనూ – సంవత్సరానికి సుమారు 24 ప్రదోష దినాలను ఇస్తుంది. "ప్రదోష" అనే పదానికి అక్షరాలా "రాత్రి మొదటి భాగం" అని అర్థం మరియు సూర్యాస్తమయం మరియు చీకటి పడటానికి మధ్య ఉన్న సంధ్యా కాలాన్ని సూచిస్తుంది. ప్రదోష కాలం అని పిలువబడే ఈ 90 నిమిషాల సమయం, స్కంద పురాణం ప్రకారం శివారాధనకు అత్యంత పవిత్రమైన సమయంగా పరిగణించబడుతుంది.',
    aboutPradoshamText2:
      "ప్రదోషం యొక్క మూల కథ స్కంద పురాణం నుండి వచ్చింది. దేవతలు మరియు రాక్షసులు పాల సముద్రాన్ని (సముద్ర మథనం) మథించినప్పుడు, త్రయోదశి ప్రదోష కాలంలో హాలాహలం అనే ప్రాణాంతక విషం ఉద్భవించింది. సృష్టిని రక్షించడానికి శివుడు ఆ విషాన్ని సేవించాడు, మరియు పార్వతి అది క్రిందికి దిగకుండా అతని గొంతును నొక్కింది – అతని గొంతు నీలం రంగులోకి మారింది (నీలకంఠుడు). శివుని దివ్య వృషభం నంది ఈ సంధ్యా సమయంలో తీవ్ర తపస్సు చేసిందని, ప్రదోష కాలంలో శివుడిని పూజించే ఎవరైనా తక్షణ అనుగ్రహాన్ని పొందుతారని వరం పొందిందని చెప్పబడింది.",
    aboutPradoshamText3:
      "శని ప్రదోషం (శనివారం) మరియు సోమ ప్రదోషం (సోమవారం) ప్రత్యేక ప్రాముఖ్యతను కలిగి ఉన్నాయి. శని ప్రదోషం శని యొక్క కర్మ క్రమశిక్షణను శివుని పరివర్తన శక్తితో కలుపుతుంది – ముఖ్యంగా వారి జాతకంలో సడే సతి లేదా శని దశను అనుభవిస్తున్న వారికి సిఫార్సు చేయబడింది. సోమ ప్రదోషం చంద్రుని భావోద్వేగ వైద్యంను శివారాధనతో అనుసంధానిస్తుంది, మానసిక శాంతి మరియు భావోద్వేగ స్థిరత్వం కోసం సూచించబడింది. భౌమ ప్రదోషం (మంగళవారం) అంగారకుడికి సంబంధించిన నివారణల కోసం, ముఖ్యంగా మంగళ దోషం కోసం ఆచరిస్తారు.",
    aboutPradoshamText4:
      "ప్రదోష పూజా విధిలో సంధ్యా సమయంలో నెయ్యి దీపం వెలిగించడం, బిల్వ పత్రాలు, తెల్లని పువ్వులు మరియు శివలింగానికి పాల అభిషేకం సమర్పించడం ఉంటాయి. భక్తులు రోజంతా ఉపవాసం పాటిస్తారు, సాయంత్రం పూజ తర్వాత దానిని విరమిస్తారు. ప్రదోష కాలంలో మహా మృత్యుంజయ మంత్రం మరియు రుద్రం జపించడం అత్యంత శక్తివంతమైనవిగా పరిగణించబడతాయి. ప్రదోషం 2026 తేదీలు మరియు ఖచ్చితమైన ప్రదోష కాలం మీ స్థానిక సూర్యాస్తమయం సమయంపై ఆధారపడి ఉంటాయి – ఈ పేజీ మీ స్థానానికి రెండింటినీ లెక్కిస్తుంది.",
    aboutChaturthi: "చతుర్థి గురించి",
    aboutChaturthiText1:
      "చతుర్థి అనేది ప్రతి చంద్ర పక్షంలో నాల్గవ తిథి, శ్రీ గణేశుడికి పవిత్రమైనది – ఆటంకాలను తొలగించేవాడు మరియు ప్రతి హిందూ వేడుక ప్రారంభంలో ఆవాహనం చేయబడే దేవత. గణపతి అథర్వశీర్ష ఉపనిషత్తు గణేశుడిని ఏనుగు రూపంలో వ్యక్తమైన ఆదిమ విశ్వ సూత్రం (బ్రహ్మ) గా ప్రకటిస్తుంది, మరియు చతుర్థి తిథి చక్రంలో ఆయనకు కేటాయించిన పూజా దినం.",
    aboutChaturthiText2:
      "రెండు రకాల చతుర్థులు ప్రతి నెలా వస్తాయి. సంకష్టి చతుర్థి కృష్ణ పక్షంలో (క్షీణిస్తున్న చంద్రుడు) వస్తుంది మరియు ఇది ప్రాథమిక నెలవారీ గణేశ వ్రతం. భక్తులు సూర్యోదయం నుండి చంద్రోదయం వరకు ఉపవాసం ఉంటారు, మరియు చంద్రుడిని చూసి గణేశ పూజ చేసిన తర్వాత మాత్రమే ఉపవాసం విరమిస్తారు. కాబట్టి చంద్రోదయ సమయం చాలా కీలకమైనది – ఇది స్థానం మరియు రుతువును బట్టి గణనీయంగా మారుతుంది. వినాయక చతుర్థి శుక్ల పక్షంలో (వృద్ది చెందుతున్న చంద్రుడు) వస్తుంది మరియు ఉదయం పూజ మరియు మోదక సమర్పణలతో ఆచరిస్తారు, అయినప్పటికీ ఇది సంకష్టి కంటే తక్కువ కఠినమైనది.",
    aboutChaturthiText3:
      "మహా గణేష్ చతుర్థి పండుగ (భాద్రపద శుక్ల చతుర్థి, ఆగస్టు-సెప్టెంబర్) అనంత చతుర్దశిలో ముగిసే 10 రోజుల వేడుక. 1893లో లోకమాన్య తిలక్ చేత సమాజ ఐక్యతను పెంపొందించడానికి ఒక ప్రజా పండుగగా స్థాపించబడింది, ఇది విస్తృతమైన మట్టి గణేశ ప్రతిమలు (పండల్స్), రోజువారీ హారతి మరియు ఐకానిక్ విసర్జన (నిమజ్జనం) ఊరేగింపును కలిగి ఉంటుంది. చతుర్థి చంద్ర దోషం ఒక ప్రత్యేక నిషేధం: భాద్రపద శుక్ల చతుర్థి నాడు, చంద్రుడిని చూడటం తప్పుడు ఆరోపణలను (భాగవత పురాణం నుండి శ్యమంతక రత్న శాపం) తెస్తుందని చెప్పబడింది. అనుకోకుండా చూసినట్లయితే, శ్యమంతక కథ లేదా కృష్ణ స్తుతిని పఠించడం సూచించిన నివారణ.",
    aboutChaturthiText4:
      "మోదకం (తీపి కుడుము) గణేశుడికి ప్రత్యేక సమర్పణ – సంకష్టి కోసం సాంప్రదాయకంగా 21 మోదకాలు తయారుచేస్తారు, ఇవి గణేశ పురాణంలోని 21 అధ్యాయాలను సూచిస్తాయి. 3 లేదా 5 ఆకుల దూర్వా గడ్డి (గరిక) కట్టలు సమర్పించబడతాయి, ఎందుకంటే అవి గణేశుడిని సంతోషపెట్టే శీతలీకరణ లక్షణాలను కలిగి ఉన్నాయని నమ్ముతారు. ప్రతి చతుర్థి 2026 వేర్వేరు వారపు రోజున వస్తుంది, మరియు చంద్రోదయ సమయం సంకష్టి ఉపవాసాన్ని ఎప్పుడు విరమించాలో నిర్ణయిస్తుంది – ఈ పేజీ మీ స్థానానికి ఖచ్చితమైన చంద్రోదయ గణనలను అందిస్తుంది.",
    guideTitle_ekadashi: "ఏకాదశి ఉపవాస నియమాలు",
    guideTitle_purnima: "పౌర్ణమి ఆచార మార్గదర్శి",
    guideTitle_amavasya: "అమావాస్య చేయవలసినవి & చేయకూడనివి",
    guideTitle_pradosham: "ప్రదోషాన్ని ఎలా ఆచరించాలి",
    guideTitle_chaturthi: "చతుర్థి పూజా మార్గదర్శి",
    guide_ekadashi_1:
      "అన్ని ధాన్యాలు, పప్పులు, బియ్యం, గోధుమలు మరియు కాయధాన్యాలను నివారించండి",
    guide_ekadashi_2:
      "అనుమతించబడినవి: పండ్లు, గింజలు, పాలు, దుంప కూరగాయలు, సగ్గుబియ్యం, సైంధవ లవణం (రాతి ఉప్పు)",
    guide_ekadashi_3:
      "మరుసటి రోజు సూర్యోదయం తర్వాత కానీ ద్వాదశి తిథి ముగియడానికి ముందు ఉపవాసం విరమించండి (పారణ)",
    guide_ekadashi_4: "నిర్జల ఏకాదశి: రోజంతా ఆహారం లేదా నీరు లేదు",
    guide_ekadashi_5: "విష్ణు సహస్రనామం లేదా ఓం నమో భగవతే వాసుదేవాయ జపించండి",
    guide_ekadashi_6:
      "పగటిపూట నిద్రపోవడం మానుకోండి – వీలైతే రాత్రి జాగరణ కోసం మేల్కొని ఉండండి",
    guide_purnima_1: "పంచామృత సమర్పణతో సత్యనారాయణ కథను నిర్వహించండి",
    guide_purnima_2:
      "ఉపవాస ఎంపికలు: నిర్జల (నీరు లేకుండా), ఫలాహారి (పండ్లు మాత్రమే), లేదా ఒకే భోజనం",
    guide_purnima_3:
      "దానం (దానం) ఇవ్వండి: ఆహారం, వస్త్రాలు, నువ్వులు, లేదా గోవులకు ఆహారం",
    guide_purnima_4: "కీర్తన మరియు ధ్యానంతో జాగరణ (రాత్రి జాగరణ) పాటించండి",
    guide_purnima_5:
      "పవిత్ర నది స్నానం చేయండి లేదా చంద్రోదయం వద్ద ఆలయాన్ని సందర్శించండి",
    guide_purnima_6:
      "శరద్ పౌర్ణమి నాడు క్షీరాన్ని తయారుచేసి చంద్రకాంతి కింద ఉంచండి",
    guide_amavasya_do_1: "నీరు, నువ్వులు మరియు కుశ గడ్డితో పితృ తర్పణం చేయండి",
    guide_amavasya_do_2:
      "ధ్యానం చేయండి – చీకటి చంద్రుడు లోతైన ఆత్మపరిశీలనకు మద్దతు ఇస్తుంది",
    guide_amavasya_do_3:
      "శని దేవునికి ఆవాల నూనె దీపం సమర్పించండి (ముఖ్యంగా శనివారం)",
    guide_amavasya_do_4:
      "సోమవతి అమావాస్య (సోమవారం) నాడు రావి చెట్టు వద్ద పూజించండి",
    guide_amavasya_dont_1:
      "కొత్త వ్యాపారాలు, సంస్థలు లేదా ప్రయాణాలను ప్రారంభించడం మానుకోండి",
    guide_amavasya_dont_2:
      "ప్రధాన కొనుగోళ్లు, ఒప్పందాలు లేదా వివాహాలను నివారించండి",
    guide_amavasya_dont_3:
      "జుట్టు లేదా గోర్లు కత్తిరించడం మానుకోండి (సాంప్రదాయ సూచన)",
    guide_amavasya_dont_4:
      "తామసిక ఆహారాలను (మాంసం, మద్యం, నిల్వ ఉన్న ఆహారం) తినడం మానుకోండి",
    guide_pradosham_1:
      "ప్రదోష కాలంలో పూజ ప్రారంభించండి – సూర్యాస్తమయం చుట్టూ 90 నిమిషాలు",
    guide_pradosham_2:
      "నెయ్యి దీపం వెలిగించి శివలింగానికి బిల్వ పత్రాలు సమర్పించండి",
    guide_pradosham_3: "తెల్లని పువ్వులతో పాల అభిషేకం చేయండి",
    guide_pradosham_4:
      "మహా మృత్యుంజయ మంత్రం (108 సార్లు) లేదా శ్రీ రుద్రం జపించండి",
    guide_pradosham_5: "సూర్యోదయం నుండి ఉపవాసం, సాయంత్రం పూజ తర్వాత విరమించండి",
    guide_pradosham_6: "శని ప్రదోషం (శనివారం): ముఖ్యంగా సడే సతి నివారణ కోసం",
    guide_chaturthi_1:
      "సూర్యోదయం నుండి చంద్రోదయం వరకు ఉపవాసం (సంకష్టి చతుర్థి)",
    guide_chaturthi_2:
      "చంద్రుడిని చూసి పూజ చేసిన తర్వాత మాత్రమే ఉపవాసం విరమించండి",
    guide_chaturthi_3:
      "21 మోదకాలు మరియు దూర్వా గడ్డి (3 లేదా 5 ఆకుల కట్టలు) సమర్పించండి",
    guide_chaturthi_4: "గణపతి అథర్వశీర్ష లేదా ఓం గం గణపతయే నమః జపించండి",
    guide_chaturthi_5: "భాద్రపద చతుర్థి: చంద్రుడిని చూడవద్దు (చంద్ర దోషం)",
    guide_chaturthi_6:
      "గణేష్ చతుర్థి నాడు అనుకోకుండా చంద్రుడు కనిపించినట్లయితే, శ్యమంతక కథను పఠించండి",
    viewCalendar: "పండుగల క్యాలెండర్ చూడండి",
  },
  bn: {
    back: "পঞ্জিকা",
    completeDates: "সম্পূর্ণ তারিখ ও সময়",
    next: "পরবর্তী",
    total: "মোট",
    date: "তারিখ",
    day: "দিন",
    name: "নাম",
    timings: "সময়",
    paksha: "পক্ষ",
    shukla: "শুক্ল",
    krishna: "কৃষ্ণ",
    noEntries: "এই মাসের জন্য কোনো তারিখ পাওয়া যায়নি",
    jumpTo: "মাসে যান",
    loading: "লোড হচ্ছে...",
    aboutEkadashi: "একাদশী সম্পর্কে",
    aboutEkadashiText1:
      "একাদশী হল হিন্দু পঞ্জিকার প্রতিটি পক্ষের একাদশ তিথি (চন্দ্র দিন), যা প্রতি মাসে দুবার আসে – একবার শুক্লপক্ষে (চাঁদের বৃদ্ধি) এবং একবার কৃষ্ণপক্ষে (চাঁদের হ্রাস)। এর ফলে প্রতি বছর প্রায় ২৪টি একাদশী হয়, যার প্রতিটির নিজস্ব আধ্যাত্মিক তাৎপর্য পদ্মপুরাণ ও ভবিষ্যপুরাণে বর্ণিত আছে। বৃহৎ পরাশর হোরা শাস্ত্র (BPHS) একাদশী তিথিকে সহজাতভাবে সাত্ত্বিক বলে শ্রেণীবদ্ধ করে – এমন একটি দিন যখন মন স্বাভাবিকভাবেই ধ্যান ও সংযমের দিকে ঝুঁকে পড়ে।",
    aboutEkadashiText2:
      "২৪টি একাদশী চক্রের মধ্যে সুপরিচিত ব্রতগুলি হল নির্জলা একাদশী (জ্যৈষ্ঠ শুক্ল), যা সবচেয়ে কঠোর বলে বিবেচিত হয় কারণ ভক্তরা সারা দিন খাদ্য ও জল উভয়ই ত্যাগ করেন। পাপঙ্কুশা একাদশী (আশ্বিন শুক্ল) সঞ্চিত পাপ মোচন করে বলে বিশ্বাস করা হয়, যখন দেবুত্থানী একাদশী (কার্তিক শুক্ল) চাতুর্মাস শেষ হওয়ার ইঙ্গিত দেয় যখন ভগবান বিষ্ণু তাঁর মহাজাগতিক নিদ্রা থেকে জাগ্রত হন। প্রতিটি ২০২৬ সালের একাদশীর তারিখ স্থানভেদে পরিবর্তিত হয় কারণ তিথির সীমা স্থানীয় সূর্যোদয়ের উপর নির্ভর করে – এই পৃষ্ঠাটি আপনার স্থানাঙ্কের জন্য সঠিক সময় গণনা করে।",
    aboutEkadashiText3:
      "একাদশী ব্রতের নিয়মাবলী হরি ভক্তি বিলাসে সংহিতাবদ্ধ করা হয়েছে। প্রচলিত প্রথা হল শস্য ও ডাল (অন্ন) থেকে সম্পূর্ণ উপবাস। অনুমোদিত খাবারগুলির মধ্যে রয়েছে ফল, বাদাম, দুধ, কন্দমূল (আলু, মিষ্টি আলু), সাবুদানা (ট্যাপিওকা) এবং সৈন্ধব লবণ (সেন্ধা নুন)। সাধারণ টেবিল লবণ, চাল, গম, ডাল এবং সরিষার তেল কঠোরভাবে পরিহার করা হয়। এর বৈজ্ঞানিক যুক্তি আধুনিক ইন্টারমিটেন্ট ফাস্টিং গবেষণার সাথে সামঞ্জস্যপূর্ণ: একটি ২৪-ঘণ্টার শস্য-মুক্ত সময়কাল হজমতন্ত্রকে পর্যায়ক্রমিক বিশ্রাম দেয়, ইনসুলিনের মাত্রা বৃদ্ধি কমায় এবং অটোফ্যাজিকে উৎসাহিত করে – যা শরীরের কোষীয় মেরামত প্রক্রিয়া।",
    aboutEkadashiText4:
      "পারণ (উপবাস ভঙ্গ) অবশ্যই পরের দিন নির্ধারিত সময়ের মধ্যে করতে হবে – সূর্যোদয়ের পর কিন্তু দ্বাদশী তিথি শেষ হওয়ার আগে। যদি পরের দিন সূর্যোদয়ের আগে দ্বাদশী শেষ হয়, তবে সূর্যোদয়ের পরপরই পারণ করা উচিত। পারণের সময়সীমা মিস করা উপবাস মিস করার মতোই অশুভ বলে বিবেচিত হয়। আঞ্চলিক ভিন্নতা বিদ্যমান: স্মার্ত একাদশী বৈষ্ণব একাদশীর চেয়ে ভিন্ন পঞ্জিকা গণনা অনুসরণ করে, এবং কিছু বছর অতিরিক্ত (অধিমাস) একাদশী যুগল দেখা যায় অধিমাসের কারণে।",
    aboutPurnima: "পূর্ণিমা সম্পর্কে",
    aboutPurnimaText1:
      "পূর্ণিমা হল পূর্ণিমা তিথি – শুক্লপক্ষের পঞ্চদশ ও শেষ তিথি যখন চন্দ্রের চাকতি সম্পূর্ণ আলোকিত হয়। এটি প্রতি সিনোডিক মাসে (প্রায় ২৯.৫৩ দিন) একবার ঘটে এবং বৈদিক সময় গণনায় একটি কেন্দ্রীয় স্থান ধারণ করে। উত্তর ভারত জুড়ে ব্যবহৃত পূর্ণিমান্ত পঞ্জিকা পদ্ধতিতে, পূর্ণিমা মাসগুলির মধ্যে সীমানা চিহ্নিত করে: মাস পূর্ণিমা তিথিতে শেষ হয়, যা গ্রেগরিয়ান পদ্ধতিতে ৩১শে ডিসেম্বরের পঞ্জিকাগত সমতুল্য।",
    aboutPurnimaText2:
      "হিন্দু বছরে ১২ থেকে ১৩টি পূর্ণিমা থাকে, যার প্রতিটি একটি নির্দিষ্ট ব্রতের সাথে যুক্ত। গুরু পূর্ণিমা (আষাঢ়) গুরু পরম্পরা এবং বেদের সংকলক ব্যাসকে সম্মান জানায়। শারদ পূর্ণিমা (আশ্বিন) হল ফসল কাটার চাঁদের উৎসব যখন চাঁদ অমৃত বর্ষণ করে বলে বিশ্বাস করা হয় – ভক্তরা চাঁদের আলোয় ক্ষীর তৈরি করে রাখেন। কার্তিক পূর্ণিমা দেব দীপাবলির সাথে মিলে যায় এবং গঙ্গা স্নানের জন্য পবিত্র। বুদ্ধ পূর্ণিমা (বৈশাখ) গৌতম বুদ্ধের জন্ম, জ্ঞানার্জন এবং পরিনির্বাণ উদযাপন করে। ফাল্গুন পূর্ণিমায় হোলি এবং শ্রাবণ পূর্ণিমায় রক্ষা বন্ধন হয়।",
    aboutPurnimaText3:
      "আয়ুর্বেদ এবং সূর্যসিদ্ধান্ত উভয়ই জৈবিক ছন্দের উপর চাঁদের প্রভাব নথিভুক্ত করে। পূর্ণিমার সময় মহাকর্ষীয় টান সমুদ্রের জোয়ারকে পরিমাপযোগ্যভাবে প্রভাবিত করে, এবং ঐতিহ্যবাহী কৃষি পঞ্জিকা পূর্ণিমার আশেপাশে রোপণ ও ফসল কাটার সময় নির্ধারণ করে। চরক সংহিতা উল্লেখ করে যে পূর্ণিমায় কফ দোষ শীর্ষে থাকে, হালকা খাবার এবং ধ্যান অনুশীলনের সুপারিশ করে। আধুনিক ক্রোনোবায়োলজি পূর্ণিমার আশেপাশে মেলাটোনিনের সংবেদনশীলতা বৃদ্ধি এবং ঘুমের কাঠামোর পরিবর্তন নিশ্চিত করে – যা পূর্ণিমায় উপবাস এবং রাত্রি জাগরণের (জাগরণ) প্রাচীন বিধানকে প্রায়োগিক গুরুত্ব দেয়।",
    aboutPurnimaText4:
      "পূর্ণিমা ব্রতগুলির মধ্যে সাধারণত সত্যনারায়ণ কথা অন্তর্ভুক্ত থাকে – স্কন্দপুরাণ থেকে বর্ণিত ভগবান বিষ্ণুকে উৎসর্গীকৃত একটি পূজা, যা পঞ্চামৃত দিয়ে সম্পন্ন করা হয় এবং সম্প্রদায়কে প্রসাদ হিসাবে নিবেদন করা হয়। পূর্ণিমায় উপবাস নির্জলা (জলহীন) থেকে ফলাহারী (কেবল ফল) পর্যন্ত হতে পারে, যা আঞ্চলিক ঐতিহ্যের উপর নির্ভর করে। পূর্ণিমায় প্রদত্ত দান (দান) – বিশেষ করে খাদ্য, বস্ত্র এবং তিল – বর্ধিত আধ্যাত্মিক পুণ্য প্রদান করে বলে মনে করা হয়। ২০২৬ সালে, প্রতিটি পূর্ণিমার তারিখ এবং চন্দ্রোদয়ের সময় স্থান-নির্ভর; এই পৃষ্ঠাটি আপনার স্থানাঙ্কের জন্য সেগুলিকে সঠিকভাবে গণনা করে।",
    aboutAmavasya: "অমাবস্যা সম্পর্কে",
    aboutAmavasyaText1:
      "অমাবস্যা হল অমাবস্যা তিথি – কৃষ্ণপক্ষের ত্রিংশ ও শেষ তিথি যখন চাঁদ সম্পূর্ণ অদৃশ্য থাকে। গুজরাট, মহারাষ্ট্র, কর্ণাটক এবং দক্ষিণ ভারতে অনুসৃত অমন্ত (অমাবস্যান্ত) পঞ্জিকা পদ্ধতিতে, অমাবস্যা চন্দ্র মাসের শেষ দিন চিহ্নিত করে। শব্দটি সংস্কৃত 'অম' (একসাথে) এবং 'বস্য' (বাস করা) থেকে উদ্ভূত, যা সূর্য ও চন্দ্রের সংযোগকে বোঝায় – তারা আকাশে একই দ্রাঘিমাংশে অবস্থান করে, যার ফলে চাঁদ অন্ধকার থাকে।",
    aboutAmavasyaText2:
      "অমাবস্যা পিতৃ তর্পণের জন্য অত্যন্ত গুরুত্বপূর্ণ – প্রয়াত পূর্বপুরুষদের উদ্দেশ্যে জল, তিল এবং কুশ ঘাসের আনুষ্ঠানিক নিবেদন। গরুড় পুরাণ এবং মার্কণ্ডেয় পুরাণ অমাবস্যাকে এমন দিন হিসাবে নির্দেশ করে যখন পিতৃ লোক (পূর্বপুরুষদের রাজ্য) সবচেয়ে বেশি সহজলভ্য হয়। সোমবার পড়া সোমবতী অমাবস্যা তর্পণ এবং অশ্বত্থ গাছের পূজার জন্য বিশেষভাবে শক্তিশালী। মৌনী অমাবস্যা (মাঘ) মৌন ব্রত (নীরবতার ব্রত) এবং পবিত্র নদীতে স্নানের বিধান দেয় – কুম্ভ মেলার সবচেয়ে পবিত্র স্নান এই দিনে পড়ে।",
    aboutAmavasyaText3:
      "দীপাবলি উৎসব কার্তিক অমাবস্যায় পড়ে, যা অন্যথায় গম্ভীর অমাবস্যাকে বছরের সবচেয়ে উদযাপিত রাতে রূপান্তরিত করে। এই দিনে, প্রদোষ কাল এবং নিশীথ কালে লক্ষ্মী পূজা করা হয়। শনি অমাবস্যা (শনিবার) ভগবান শনিকে সরিষার তেল নিবেদনের মাধ্যমে পালন করা হয়, যা একজনের কোষ্ঠীতে শনির অশুভ প্রভাব প্রশমিত করে বলে বিশ্বাস করা হয়। বিশেষ করে বাংলায় কালী পূজা অমাবস্যার সাথে মিলে যায় যখন দেবী কালীর উগ্র শক্তি রাতভর পূজার মাধ্যমে সম্মানিত হয়।",
    aboutAmavasyaText4:
      "যদিও অমাবস্যা ঐতিহ্যগতভাবে নতুন উদ্যোগ, বিবাহ বা ভ্রমণের জন্য অশুভ বলে বিবেচিত হয়, এটি আত্মদর্শনমূলক এবং তান্ত্রিক অনুশীলনের জন্য গভীরভাবে শক্তিশালী বলে মনে করা হয়। অমাবস্যায় ধ্যান গভীরতর চেতনার স্তরে প্রবেশ করে বলে বলা হয় কারণ বাহ্যিক সংবেদনশীল বিভ্রান্তি (চাঁদের আলো) অনুপস্থিত থাকে। আয়ুর্বেদ উল্লেখ করে যে অমাবস্যায় বাত দোষ বৃদ্ধি পায়, উষ্ণ, পুষ্টিকর খাবার এবং তেল মালিশ (অভ্যঙ্গ) সুপারিশ করে। ২০২৬ সালের অমাবস্যার তারিখগুলি সময় অঞ্চল এবং স্থানভেদে পরিবর্তিত হয় – এই পৃষ্ঠাটি আপনার স্থানাঙ্কের জন্য সঠিক সময় গণনা করে।",
    aboutPradosham: "প্রদোষ সম্পর্কে",
    aboutPradoshamText1:
      "প্রদোষ (প্রদোষ ব্রত) প্রতিটি চন্দ্র পক্ষের ত্রয়োদশী তিথিতে (ত্রয়োদশী) পড়ে – শুক্ল ও কৃষ্ণ উভয় পক্ষেই – যার ফলে প্রতি বছর প্রায় ২৪টি প্রদোষ দিন হয়। 'প্রদোষ' শব্দের আক্ষরিক অর্থ হল 'রাতের প্রথম অংশ' এবং এটি সূর্যাস্ত ও রাতের আগমনের মধ্যবর্তী গোধূলি সময়কে বোঝায়। এই ৯০ মিনিটের সময়কাল, যাকে প্রদোষ কাল বলা হয়, স্কন্দপুরাণ অনুসারে ভগবান শিবের পূজার জন্য সবচেয়ে পবিত্র সময় বলে বিবেচিত হয়।",
    aboutPradoshamText2:
      "প্রদোষের উৎপত্তির গল্প স্কন্দপুরাণ থেকে এসেছে। যখন দেব ও অসুররা মহাজাগতিক সমুদ্র মন্থন (সমুদ্র মন্থন) করেছিলেন, তখন ত্রয়োদশীর প্রদোষ কালে মারাত্মক বিষ হলাহল উৎপন্ন হয়েছিল। ভগবান শিব সৃষ্টিকে বাঁচাতে বিষ পান করেছিলেন, এবং পার্বতী তাঁর গলা চেপে ধরেছিলেন যাতে বিষ নিচে না নামে – ফলে তাঁর গলা নীল হয়ে গিয়েছিল (নীলকণ্ঠ)। নন্দী, শিবের দিব্য ষাঁড়, এই গোধূলি লগ্নে তীব্র তপস্যা করেছিলেন বলে কথিত আছে, এই বর লাভ করে যে যে কেউ প্রদোষ কালে শিবের পূজা করবে সে দ্রুত কৃপা লাভ করবে।",
    aboutPradoshamText3:
      "শনি প্রদোষ (শনিবার) এবং সোম প্রদোষ (সোমবার) বিশেষ তাৎপর্য বহন করে। শনি প্রদোষ শনির কর্মফলগত শৃঙ্খলাকে শিবের রূপান্তরকারী শক্তির সাথে একত্রিত করে – বিশেষ করে যাদের কোষ্ঠীতে সাড়ে সাতি বা শনি দশা চলছে তাদের জন্য এটি সুপারিশ করা হয়। সোম প্রদোষ চাঁদের মানসিক নিরাময়কে শিব পূজার সাথে সংযুক্ত করে, যা মানসিক শান্তি এবং আবেগিক স্থিতিশীলতার জন্য নির্ধারিত। ভৌমা প্রদোষ (মঙ্গলবার) মঙ্গল-সম্পর্কিত প্রতিকারের জন্য, বিশেষ করে মঙ্গল দোষের জন্য পালন করা হয়।",
    aboutPradoshamText4:
      "প্রদোষ পূজা বিধিতে গোধূলি লগ্নে ঘিয়ের প্রদীপ জ্বালানো, বিল্বপত্র, সাদা ফুল এবং শিবলিঙ্গে দুগ্ধ অভিষেক নিবেদন করা হয়। ভক্তরা দিনব্যাপী উপবাস পালন করেন, যা সন্ধ্যার পূজার পর ভঙ্গ করা হয়। প্রদোষ কালে মহামৃত্যুঞ্জয় মন্ত্র এবং রুদ্রম জপ অত্যন্ত শক্তিশালী বলে বিবেচিত হয়। ২০২৬ সালের প্রদোষের তারিখ এবং সঠিক প্রদোষ কালের সময় আপনার স্থানীয় সূর্যাস্তের উপর নির্ভর করে – এই পৃষ্ঠাটি আপনার অবস্থানের জন্য উভয়ই গণনা করে।",
    aboutChaturthi: "চতুর্থী সম্পর্কে",
    aboutChaturthiText1:
      "চতুর্থী হল প্রতিটি চন্দ্র পক্ষের চতুর্থ তিথি, যা ভগবান গণেশের জন্য পবিত্র – যিনি বিঘ্নহর্তা এবং প্রতিটি হিন্দু অনুষ্ঠানের শুরুতে যাঁর আহ্বান করা হয়। গণপতি অথর্বশীর্ষ উপনিষদ গণেশকে হস্তী রূপে প্রকাশিত আদিম মহাজাগতিক নীতি (ব্রহ্ম) হিসাবে ঘোষণা করে, এবং চতুর্থী হল তিথি চক্রে তাঁর নির্ধারিত পূজার দিন।",
    aboutChaturthiText2:
      "দু'ধরনের চতুর্থী প্রতি মাসে পুনরাবৃত্ত হয়। সংকষ্টী চতুর্থী কৃষ্ণপক্ষে (চাঁদের হ্রাস) পড়ে এবং এটি প্রধান মাসিক গণেশ ব্রত। ভক্তরা সূর্যোদয় থেকে চন্দ্রোদয় পর্যন্ত উপবাস করেন, এবং চাঁদ দেখার পর ও গণেশ পূজা করার পরেই উপবাস ভঙ্গ করা হয়। তাই চন্দ্রোদয়ের সময় অত্যন্ত গুরুত্বপূর্ণ – এটি স্থান ও ঋতুভেদে উল্লেখযোগ্যভাবে পরিবর্তিত হয়। বিনায়ক চতুর্থী শুক্লপক্ষে (চাঁদের বৃদ্ধি) পড়ে এবং সকালের পূজা ও মোদক নিবেদনের মাধ্যমে পালন করা হয়, যদিও এটি সংকষ্টীর চেয়ে কম কঠোরতা বহন করে।",
    aboutChaturthiText3:
      "মহৎ গণেশ চতুর্থী উৎসব (ভাদ্রপদ শুক্ল চতুর্থী, আগস্ট-সেপ্টেম্বর) একটি ১০ দিনের উদযাপন যা অনন্ত চতুর্দশীতে শেষ হয়। ১৮৯৩ সালে লোকমান্য তিলক কর্তৃক সম্প্রদায়গত ঐক্য বৃদ্ধির জন্য একটি জনউৎসব হিসাবে প্রতিষ্ঠিত, এতে বিস্তারিত মাটির গণেশ স্থাপন (প্যান্ডেল), প্রতিদিনের আরতি এবং প্রতীকী বিসর্জন (নিমজ্জন) শোভাযাত্রা থাকে। চতুর্থী চন্দ্র দোষ একটি অনন্য নিষেধাজ্ঞা: ভাদ্রপদ শুক্ল চতুর্থীতে চাঁদ দেখলে মিথ্যা অভিযোগ (ভাগবত পুরাণ থেকে স্যমন্তক মণির অভিশাপ) আসে বলে বলা হয়। যদি দুর্ঘটনাক্রমে দেখা যায়, তবে স্যমন্তক গল্প বা কৃষ্ণ স্তুতি পাঠ করা নির্ধারিত প্রতিকার।",
    aboutChaturthiText4:
      "মোদক (মিষ্টি ডাম্পলিং) গণেশের বিশেষ নিবেদন – সংকষ্টীর জন্য ঐতিহ্যগতভাবে ২১টি মোদক প্রস্তুত করা হয়, যা গণেশ পুরাণের ২১টি অধ্যায়কে প্রতিনিধিত্ব করে। ৩ বা ৫টি ব্লেডের দূর্বা ঘাস (বারমুডা ঘাস) নিবেদন করা হয় কারণ বিশ্বাস করা হয় যে এর শীতল গুণাবলী গণেশকে সন্তুষ্ট করে। ২০২৬ সালের প্রতিটি চতুর্থী ভিন্ন ভিন্ন সপ্তাহের দিনে পড়ে, এবং চন্দ্রোদয়ের সময় নির্ধারণ করে কখন সংকষ্টী ব্রত ভঙ্গ করা যেতে পারে – এই পৃষ্ঠাটি আপনার অবস্থানের জন্য সঠিক চন্দ্রোদয় গণনা প্রদান করে।",
    guideTitle_ekadashi: "একাদশী ব্রতের নিয়মাবলী",
    guideTitle_purnima: "পূর্ণিমা পালনের নির্দেশিকা",
    guideTitle_amavasya: "অমাবস্যার করণীয় ও বর্জনীয়",
    guideTitle_pradosham: "প্রদোষ পালনের পদ্ধতি",
    guideTitle_chaturthi: "চতুর্থী পূজা নির্দেশিকা",
    guide_ekadashi_1: "সমস্ত শস্য, ডাল, চাল, গম এবং মসুর ডাল পরিহার করুন",
    guide_ekadashi_2:
      "অনুমোদিত: ফল, বাদাম, দুধ, কন্দমূল, সাবুদানা, সৈন্ধব লবণ (সেন্ধা নুন)",
    guide_ekadashi_3:
      "পরের দিন সূর্যোদয়ের পর কিন্তু দ্বাদশী তিথি শেষ হওয়ার আগে পারণ (উপবাস ভঙ্গ) করুন",
    guide_ekadashi_4: "নির্জলা একাদশী: সারা দিন খাদ্য বা জল গ্রহণ করা যাবে না",
    guide_ekadashi_5: "বিষ্ণু সহস্রনাম বা ওঁ নমো ভগবতে বাসুদেবায় জপ করুন",
    guide_ekadashi_6:
      "দিনের বেলায় ঘুমানো পরিহার করুন – সম্ভব হলে রাত্রি জাগরণ করুন",
    guide_purnima_1: "পঞ্চামৃত নিবেদন সহ সত্যনারায়ণ কথা পাঠ করুন",
    guide_purnima_2:
      "উপবাসের বিকল্প: নির্জলা (জলহীন), ফলাহারী (কেবল ফল), অথবা একবেলা আহার",
    guide_purnima_3: "দান (দাতব্য) করুন: খাদ্য, বস্ত্র, তিল, অথবা গো-সেবা",
    guide_purnima_4: "কীর্তন ও ধ্যানের সাথে জাগরণ (রাত্রি জাগরণ) পালন করুন",
    guide_purnima_5:
      "পবিত্র নদীতে স্নান করুন অথবা চন্দ্রোদয়ের সময় মন্দির দর্শন করুন",
    guide_purnima_6: "শারদ পূর্ণিমায় ক্ষীর তৈরি করে চাঁদের আলোয় রাখুন",
    guide_amavasya_do_1: "জল, তিল এবং কুশ ঘাস দিয়ে পিতৃ তর্পণ করুন",
    guide_amavasya_do_2:
      "ধ্যান করুন – অন্ধকার চাঁদ গভীর আত্মদর্শনকে সমর্থন করে",
    guide_amavasya_do_3:
      "ভগবান শনিকে সরিষার তেলের প্রদীপ নিবেদন করুন (বিশেষ করে শনিবার)",
    guide_amavasya_do_4: "সোমবতী অমাবস্যায় (সোমবার) অশ্বত্থ গাছের পূজা করুন",
    guide_amavasya_dont_1: "নতুন উদ্যোগ, ব্যবসা বা যাত্রা শুরু করা পরিহার করুন",
    guide_amavasya_dont_2: "বড় কেনাকাটা, চুক্তি বা বিবাহ পরিহার করুন",
    guide_amavasya_dont_3: "চুল বা নখ কাটা পরিহার করুন (ঐতিহ্যগত বিধান)",
    guide_amavasya_dont_4:
      "তামসিক খাবার (মাংস, মদ, বাসি খাবার) গ্রহণ পরিহার করুন",
    guide_pradosham_1:
      "প্রদোষ কালে পূজা শুরু করুন – সূর্যাস্তের আশেপাশে ৯০ মিনিট",
    guide_pradosham_2:
      "ঘিয়ের প্রদীপ জ্বালান এবং শিবলিঙ্গে বিল্বপত্র নিবেদন করুন",
    guide_pradosham_3: "সাদা ফুল দিয়ে দুগ্ধ অভিষেক করুন",
    guide_pradosham_4: "মহামৃত্যুঞ্জয় মন্ত্র (১০৮ বার) বা শ্রী রুদ্রম জপ করুন",
    guide_pradosham_5: "সূর্যোদয় থেকে উপবাস করুন, সন্ধ্যার পূজার পর ভঙ্গ করুন",
    guide_pradosham_6:
      "শনি প্রদোষ (শনিবার): বিশেষ করে সাড়ে সাতি থেকে মুক্তির জন্য",
    guide_chaturthi_1:
      "সূর্যোদয় থেকে চন্দ্রোদয় পর্যন্ত উপবাস করুন (সংকষ্টী চতুর্থী)",
    guide_chaturthi_2: "চাঁদ দেখার পর এবং পূজা করার পরেই উপবাস ভঙ্গ করুন",
    guide_chaturthi_3:
      "২১টি মোদক এবং দূর্বা ঘাস (৩ বা ৫টি ব্লেডের আঁটি) নিবেদন করুন",
    guide_chaturthi_4: "গণপতি অথর্বশীর্ষ বা ওঁ গং গণপতয়ে নমঃ জপ করুন",
    guide_chaturthi_5: "ভাদ্রপদ চতুর্থী: চাঁদ দেখবেন না (চন্দ্র দোষ)",
    guide_chaturthi_6:
      "যদি গণেশ চতুর্থীতে দুর্ঘটনাক্রমে চাঁদ দেখা যায়, তবে স্যমন্তক কথা পাঠ করুন",
    viewCalendar: "উৎসব পঞ্জিকা দেখুন",
  },
  gu: {
    back: "કેલેન્ડર",
    completeDates: "સંપૂર્ણ તારીખો અને સમય",
    next: "આગળ",
    total: "કુલ",
    date: "તારીખ",
    day: "દિવસ",
    name: "નામ",
    timings: "સમય",
    paksha: "પક્ષ",
    shukla: "શુક્લ",
    krishna: "કૃષ્ણ",
    noEntries: "આ મહિના માટે કોઈ તારીખો મળી નથી",
    jumpTo: "મહિના પર જાઓ",
    loading: "લોડ કરી રહ્યું છે...",
    aboutEkadashi: "એકાદશી વિશે",
    aboutEkadashiText1:
      "એકાદશી એ હિંદુ કેલેન્ડરમાં દરેક પખવાડિયાની અગિયારમી તિથિ (ચંદ્ર દિવસ) છે, જે દર મહિને બે વાર આવે છે – એકવાર શુક્લ પક્ષ (વધતો ચંદ્ર) દરમિયાન અને એકવાર કૃષ્ણ પક્ષ (ઘટતો ચંદ્ર) દરમિયાન. આનાથી દર વર્ષે આશરે 24 નામવાળી એકાદશીઓ મળે છે, જેમાંની દરેક પદ્મ પુરાણ અને ભવિષ્ય પુરાણમાં મૂળ ધરાવતી એક વિશિષ્ટ આધ્યાત્મિક કથા ધરાવે છે. બૃહત્ પરાશર હોરા શાસ્ત્ર (BPHS) એકાદશીને આંતરિક રીતે સાત્વિક તરીકે વર્ગીકૃત કરે છે – એક એવો દિવસ જ્યારે મન સ્વાભાવિક રીતે ચિંતન અને સંયમ તરફ વળે છે.",
    aboutEkadashiText2:
      "24 એકાદશી ચક્રમાં નિર્જળા એકાદશી (જ્યેષ્ઠ શુક્લ) જેવા જાણીતા વ્રતોનો સમાવેશ થાય છે, જેને સૌથી કઠોર માનવામાં આવે છે કારણ કે ભક્તો આખો દિવસ ભોજન અને પાણી બંનેનો ત્યાગ કરે છે. પાપંકુશા એકાદશી (આશ્વિન શુક્લ) સંચિત પાપોને ધોઈ નાખે છે એમ માનવામાં આવે છે, જ્યારે દેવઉઠી એકાદશી (કાર્તિક શુક્લ) ચતુર્માસના અંતને ચિહ્નિત કરે છે જ્યારે ભગવાન વિષ્ણુ કોસ્મિક નિદ્રામાંથી જાગૃત થાય છે. દરેક એકાદશી 2026 ની તારીખ સ્થાન પ્રમાણે બદલાય છે કારણ કે તિથિની સીમા સ્થાનિક સૂર્યોદય પર આધાર રાખે છે – આ પૃષ્ઠ તમારા કોઓર્ડિનેટ્સ માટે ચોક્કસ સમયની ગણતરી કરે છે.",
    aboutEkadashiText3:
      "એકાદશી વ્રતના નિયમો હરિ ભક્તિ વિલાસમાં સંહિતાબદ્ધ છે. પ્રમાણભૂત પ્રથા અનાજ અને કઠોળ (અન્ન) થી સંપૂર્ણ ઉપવાસ કરવાની છે. અનુમતિ પ્રાપ્ત ખોરાકમાં ફળો, બદામ, દૂધ, કંદમૂળ (બટાકા, શક્કરિયા), સાબુદાણા અને સિંધવ મીઠું (સેંધા નમક) નો સમાવેશ થાય છે. નિયમિત ટેબલ સોલ્ટ, ચોખા, ઘઉં, દાળ અને સરસવનું તેલ સખત રીતે ટાળવામાં આવે છે. વૈજ્ઞાનિક તર્ક આધુનિક ઇન્ટરમિટન્ટ ફાસ્ટિંગ સંશોધન સાથે સુસંગત છે: 24-કલાકની અનાજ-મુક્ત વિન્ડો પાચનતંત્રને સમયાંતરે રીસેટ આપે છે, ઇન્સ્યુલિન સ્પાઇક્સ ઘટાડે છે અને ઓટોફેજીને પ્રોત્સાહન આપે છે – શરીરની સેલ્યુલર રિપેર મિકેનિઝમ.",
    aboutEkadashiText4:
      "પારણા (વ્રત તોડવું) બીજા દિવસે નિર્ધારિત સમયગાળામાં થવું જોઈએ – સૂર્યોદય પછી પરંતુ દ્વાદશી તિથિ સમાપ્ત થાય તે પહેલાં. જો દ્વાદશી બીજા દિવસે સૂર્યોદય પહેલાં સમાપ્ત થાય, તો પારણા સૂર્યોદય પછી તરત જ કરવું જોઈએ. પારણાનો સમય ચૂકી જવું એ વ્રત ચૂકી જવા જેટલું જ અશુભ માનવામાં આવે છે. પ્રાદેશિક ભિન્નતાઓ અસ્તિત્વમાં છે: સ્માર્ત એકાદશી વૈષ્ણવ એકાદશી કરતાં અલગ કેલેન્ડર ગણતરીને અનુસરે છે, અને કેટલાક વર્ષોમાં અધિક માસને કારણે એક વધારાની (અધિક માસ) એકાદશી જોડી દેખાય છે.",
    aboutPurnima: "પૂર્ણિમા વિશે",
    aboutPurnimaText1:
      "પૂર્ણિમા એ પૂનમનો દિવસ છે – શુક્લ પક્ષની પંદરમી અને અંતિમ તિથિ જ્યારે ચંદ્ર સંપૂર્ણપણે પ્રકાશિત થાય છે. તે દર સિનોડિક મહિને (આશરે 29.53 દિવસ) એકવાર થાય છે અને વૈદિક સમયગણનામાં કેન્દ્રીય સ્થાન ધરાવે છે. ઉત્તર ભારતમાં ઉપયોગમાં લેવાતી પૂર્ણિમાંત કેલેન્ડર સિસ્ટમમાં, પૂર્ણિમા મહિનાઓ વચ્ચેની સીમાને ચિહ્નિત કરે છે: મહિનો પૂનમના દિવસે સમાપ્ત થાય છે, જે તેને ગ્રેગોરિયન સિસ્ટમમાં 31મી ડિસેમ્બરના કેલેન્ડર સમકક્ષ બનાવે છે.",
    aboutPurnimaText2:
      "હિંદુ વર્ષમાં 12 થી 13 નામવાળી પૂર્ણિમાઓ હોય છે, જેમાંની દરેક એક વિશિષ્ટ વ્રત સાથે જોડાયેલી હોય છે. ગુરુ પૂર્ણિમા (આષાઢ) ગુરુ પરંપરા અને વેદોના સંકલનકર્તા વ્યાસનું સન્માન કરે છે. શરદ પૂર્ણિમા (આશ્વિન) એ લણણીના ચંદ્રનો ઉત્સવ છે જ્યારે ચંદ્ર અમૃત (અમૃત) વરસાવે છે એમ માનવામાં આવે છે – ભક્તો ચંદ્રપ્રકાશ હેઠળ ખીર તૈયાર કરે છે. કાર્તિક પૂર્ણિમા દેવ દિવાળી સાથે સુસંગત છે અને ગંગા સ્નાન માટે પવિત્ર છે. બુદ્ધ પૂર્ણિમા (વૈશાખ) ગૌતમ બુદ્ધના જન્મ, જ્ઞાન અને પરિનિર્વાણની ઉજવણી કરે છે. હોળી ફાલ્ગુન પૂર્ણિમા પર આવે છે, અને રક્ષાબંધન શ્રાવણ પૂર્ણિમા પર આવે છે.",
    aboutPurnimaText3:
      "આયુર્વેદ અને સૂર્ય સિદ્ધાંત બંને જૈવિક લય પર ચંદ્રના પ્રભાવનું દસ્તાવેજીકરણ કરે છે. પૂનમ પર ગુરુત્વાકર્ષણ બળ સમુદ્રના ભરતી-ઓટને માપી શકાય તે રીતે અસર કરે છે, અને પરંપરાગત કૃષિ કેલેન્ડર પૂર્ણિમાની આસપાસ વાવણી અને લણણીનો સમય નક્કી કરે છે. ચરક સંહિતા નોંધે છે કે પૂર્ણિમા પર કફ દોષ ચરમસીમા પર હોય છે, હળવા ભોજન અને ધ્યાનનો અભ્યાસ કરવાની ભલામણ કરે છે. આધુનિક ક્રોનોબાયોલોજી પૂનમની આસપાસ મેલાટોનિન સંવેદનશીલતામાં વધારો અને બદલાયેલી ઊંઘની રચનાની પુષ્ટિ કરે છે – પૂર્ણિમા પર ઉપવાસ અને રાત્રિ જાગરણ (જાગરણ) ના પ્રાચીન પ્રિસ્ક્રિપ્શનને પ્રાયોગિક વજન આપે છે.",
    aboutPurnimaText4:
      "પૂર્ણિમાના વ્રતોમાં સામાન્ય રીતે સત્યનારાયણ કથાનો સમાવેશ થાય છે – સ્કંદ પુરાણમાંથી વર્ણવેલ ભગવાન વિષ્ણુને સમર્પિત પૂજા, જે પંચામૃત સાથે કરવામાં આવે છે અને સમુદાયને પ્રસાદ તરીકે અર્પણ કરવામાં આવે છે. પૂર્ણિમા પર ઉપવાસ નિર્જળા (પાણી વિના) થી લઈને ફળાહારી (ફક્ત ફળ) સુધીના હોય છે, જે પ્રાદેશિક પરંપરા પર આધાર રાખે છે. પૂર્ણિમા પર આપવામાં આવેલું દાન (દાન) – ખાસ કરીને ભોજન, વસ્ત્રો અને તલ – વિસ્તૃત આધ્યાત્મિક પુણ્ય આપે છે એમ માનવામાં આવે છે. 2026 માં, દરેક પૂર્ણિમાની તારીખ અને ચંદ્રદયનો સમય સ્થાન-આધારિત છે; આ પૃષ્ઠ તમારા કોઓર્ડિનેટ્સ માટે તેમની ચોક્કસ ગણતરી કરે છે.",
    aboutAmavasya: "અમાવસ્યા વિશે",
    aboutAmavasyaText1:
      'અમાવસ્યા એ અમાસનો દિવસ છે – કૃષ્ણ પક્ષની ત્રીસમી અને અંતિમ તિથિ જ્યારે ચંદ્ર સંપૂર્ણપણે અદ્રશ્ય હોય છે. ગુજરાત, મહારાષ્ટ્ર, કર્ણાટક અને દક્ષિણ ભારતમાં અનુસરવામાં આવતી અમાન્ત (અમાવસ્યાંત) કેલેન્ડર સિસ્ટમમાં, અમાવસ્યા ચંદ્ર મહિનાના છેલ્લા દિવસને ચિહ્નિત કરે છે. આ શબ્દ સંસ્કૃત "અમ" (સાથે) અને "વસ્ય" (રહેવું) પરથી આવ્યો છે, જે સૂર્ય અને ચંદ્રના સંયોગને દર્શાવે છે – તેઓ આકાશમાં સમાન રેખાંશ પર કબજો કરે છે, જેના કારણે ચંદ્ર અંધારું રહે છે.',
    aboutAmavasyaText2:
      "અમાવસ્યા પિતૃ તર્પણ માટે સર્વોચ્ચ મહત્વ ધરાવે છે – મૃત પૂર્વજોને પાણી, તલ અને કુશ ઘાસની વિધિપૂર્વક અર્પણ. ગરુડ પુરાણ અને માર્કંડેય પુરાણ અમાવસ્યાને એવા દિવસ તરીકે નિર્ધારિત કરે છે જ્યારે પિતૃ લોક (પૂર્વજોનું ક્ષેત્ર) સૌથી વધુ સુલભ હોય છે. સોમવતી અમાવસ્યા, જે સોમવારે આવે છે, તે તર્પણ અને પીપળાના વૃક્ષની પૂજા માટે ખાસ કરીને શક્તિશાળી છે. મૌની અમાવસ્યા (માઘ) મૌન વ્રત (મૌનનો સંકલ્પ) અને પવિત્ર નદી સ્નાન સૂચવે છે – કુંભ મેળાનું સૌથી પવિત્ર સ્નાન આ દિવસે આવે છે.",
    aboutAmavasyaText3:
      "દિવાળીનો તહેવાર કાર્તિક અમાવસ્યા પર આવે છે, જે અન્યથા ગંભીર અમાસને વર્ષની સૌથી ઉજવણીવાળી રાત્રિમાં પરિવર્તિત કરે છે. આ દિવસે, પ્રદોષ કાળ અને નિશિતા કાળ દરમિયાન લક્ષ્મી પૂજા કરવામાં આવે છે. શનિ અમાવસ્યા (શનિવાર) ભગવાન શનિને સરસવના તેલના અર્પણ સાથે ઉજવવામાં આવે છે, જે વ્યક્તિની કુંડળીમાં શનિના અશુભ પ્રભાવોને ઘટાડવા માટે માનવામાં આવે છે. કાલી પૂજા, ખાસ કરીને બંગાળમાં, અમાવસ્યા સાથે સુસંગત છે જ્યારે દેવી કાલીની ભયાનક ઊર્જા રાત્રિભરની પૂજા દ્વારા સન્માનિત થાય છે.",
    aboutAmavasyaText4:
      "જ્યારે અમાવસ્યા પરંપરાગત રીતે નવા સાહસો, લગ્ન અથવા મુસાફરી શરૂ કરવા માટે અશુભ માનવામાં આવે છે, ત્યારે તે આત્મનિરીક્ષણ અને તાંત્રિક પ્રથાઓ માટે ઊંડાણપૂર્વક શક્તિશાળી માનવામાં આવે છે. અમાવસ્યા પર ધ્યાન ચેતનાની ઊંડી અવસ્થાઓમાં પ્રવેશ કરે છે એમ કહેવાય છે કારણ કે બાહ્ય સંવેદનાત્મક વિક્ષેપ (ચંદ્રપ્રકાશ) ગેરહાજર હોય છે. આયુર્વેદ નોંધે છે કે અમાવસ્યા પર વાયુ દોષ વધે છે, ગરમ, પૌષ્ટિક ખોરાક અને તેલ માલિશ (અભ્યાંગ) ની ભલામણ કરે છે. અમાવસ્યા 2026 ની તારીખો સમય ઝોન અને સ્થાન પ્રમાણે બદલાય છે – આ પૃષ્ઠ તમારા કોઓર્ડિનેટ્સ માટે ગણતરી કરેલ ચોક્કસ સમય પ્રદાન કરે છે.",
    aboutPradosham: "પ્રદોષમ વિશે",
    aboutPradoshamText1:
      'પ્રદોષમ (પ્રદોષ વ્રત) દરેક ચંદ્ર પખવાડિયાની તેરમી તિથિ (ત્રયોદશી) પર આવે છે – શુક્લ અને કૃષ્ણ પક્ષ બંને – જેનાથી દર વર્ષે આશરે 24 પ્રદોષમ દિવસો મળે છે. "પ્રદોષ" શબ્દનો શાબ્દિક અર્થ "રાત્રિનો પ્રથમ ભાગ" થાય છે અને તે સૂર્યાસ્ત અને રાત્રિના આગમન વચ્ચેના સંધિકાળનો ઉલ્લેખ કરે છે. આ 90-મિનિટનો સમયગાળો, જેને પ્રદોષ કાળ કહેવાય છે, તે સ્કંદ પુરાણ અનુસાર ભગવાન શિવની પૂજા માટે સૌથી પવિત્ર સમય માનવામાં આવે છે.',
    aboutPradoshamText2:
      "પ્રદોષમની ઉત્પત્તિ કથા સ્કંદ પુરાણમાંથી આવે છે. જ્યારે દેવો અને દાનવોએ કોસ્મિક સમુદ્ર (સમુદ્ર મંથન) નું મંથન કર્યું, ત્યારે ત્રયોદશીના પ્રદોષ કાળ દરમિયાન જીવલેણ ઝેર હલાહલ બહાર આવ્યું. ભગવાન શિવે સૃષ્ટિને બચાવવા માટે ઝેરનું સેવન કર્યું, અને પાર્વતીએ તેને નીચે ઉતરતું અટકાવવા માટે તેમનું ગળું દબાવ્યું – જેનાથી તેમનું ગળું વાદળી (નીલકંઠ) થઈ ગયું. નંદી, શિવના દિવ્ય બળદે, આ સંધિકાળ દરમિયાન તીવ્ર તપસ્યા કરી હોવાનું કહેવાય છે, જેનાથી તેમને વરદાન મળ્યું કે જે કોઈ પ્રદોષ કાળ દરમિયાન શિવની પૂજા કરશે તેને ઝડપથી કૃપા પ્રાપ્ત થશે.",
    aboutPradoshamText3:
      "શનિ પ્રદોષમ (શનિવાર) અને સોમ પ્રદોષમ (સોમવાર) વિશેષ મહત્વ ધરાવે છે. શનિ પ્રદોષમ શનિના કર્મિક અનુશાસનને શિવની પરિવર્તનકારી શક્તિ સાથે જોડે છે – ખાસ કરીને તેમની કુંડળીમાં સાડાસાતી અથવા શનિ દશામાંથી પસાર થતા લોકો માટે ભલામણ કરવામાં આવે છે. સોમ પ્રદોષમ ચંદ્રના ભાવનાત્મક ઉપચારને શિવ પૂજા સાથે જોડે છે, જે માનસિક શાંતિ અને ભાવનાત્મક સ્થિરતા માટે સૂચવવામાં આવે છે. ભૌમ પ્રદોષમ (મંગળવાર) મંગળ-સંબંધિત ઉપચારો માટે, ખાસ કરીને મંગળ દોષ માટે ઉજવવામાં આવે છે.",
    aboutPradoshamText4:
      "પ્રદોષમ પૂજા વિધિમાં સંધિકાળે ઘીનો દીવો પ્રગટાવવો, બિલ્વ પત્રો, સફેદ ફૂલો અને શિવલિંગને દૂધનો અભિષેક કરવો શામેલ છે. ભક્તો દિવસભર ઉપવાસ કરે છે, અને સાંજે પૂજા પછી તેને તોડે છે. પ્રદોષ કાળ દરમિયાન મહા મૃત્યુંજય મંત્ર અને રુદ્રમનો જાપ અત્યંત શક્તિશાળી માનવામાં આવે છે. પ્રદોષમ 2026 ની તારીખો અને ચોક્કસ પ્રદોષ કાળનો સમયગાળો તમારા સ્થાનિક સૂર્યાસ્તના સમય પર આધાર રાખે છે – આ પૃષ્ઠ તમારા સ્થાન માટે બંનેની ગણતરી કરે છે.",
    aboutChaturthi: "ચતુર્થી વિશે",
    aboutChaturthiText1:
      "ચતુર્થી એ દરેક ચંદ્ર પખવાડિયાની ચોથી તિથિ છે, જે ભગવાન ગણેશને પવિત્ર છે – જે વિઘ્નોના હર્તા અને દરેક હિંદુ સમારંભની શરૂઆતમાં આહ્વાન કરાયેલા દેવતા છે. ગણપતિ અથર્વશીર્ષ ઉપનિષદ ગણેશને હાથીના રૂપમાં પ્રગટ થયેલા આદિ કોસ્મિક સિદ્ધાંત (બ્રહ્મ) તરીકે જાહેર કરે છે, અને ચતુર્થી એ તિથિ ચક્રમાં તેમનો નિયુક્ત પૂજા દિવસ છે.",
    aboutChaturthiText2:
      "ચતુર્થીના બે પ્રકાર માસિક ધોરણે પુનરાવર્તિત થાય છે. સંકષ્ટી ચતુર્થી કૃષ્ણ પક્ષ (ઘટતો ચંદ્ર) માં આવે છે અને તે મુખ્ય માસિક ગણેશ વ્રત છે. ભક્તો સૂર્યોદયથી ચંદ્રદય સુધી ઉપવાસ કરે છે, અને ચંદ્રના દર્શન અને ગણેશ પૂજા કર્યા પછી જ ઉપવાસ તોડવામાં આવે છે. તેથી ચંદ્રદયનો સમય નિર્ણાયક છે – તે સ્થાન અને ઋતુ પ્રમાણે નોંધપાત્ર રીતે બદલાય છે. વિનાયક ચતુર્થી શુક્લ પક્ષ (વધતો ચંદ્ર) માં આવે છે અને સવારની પૂજા અને મોદકના અર્પણ સાથે ઉજવવામાં આવે છે, જોકે તે સંકષ્ટી કરતાં ઓછી કઠોરતા ધરાવે છે.",
    aboutChaturthiText3:
      "ભવ્ય ગણેશ ચતુર્થી ઉત્સવ (ભાદ્રપદ શુક્લ ચતુર્થી, ઓગસ્ટ-સપ્ટેમ્બર) એ 10-દિવસીય ઉજવણી છે જે અનંત ચતુર્દશી પર સમાપ્ત થાય છે. 1893 માં લોકમાન્ય ટિળક દ્વારા સમુદાયની એકતાને પ્રોત્સાહન આપવા માટે જાહેર ઉત્સવ તરીકે સ્થાપિત, તેમાં વિસ્તૃત માટીના ગણેશ સ્થાપનો (પંડાલ), દૈનિક આરતી અને પ્રતિકાત્મક વિસર્જન (વિસર્જન) શોભાયાત્રાનો સમાવેશ થાય છે. ચતુર્થી ચંદ્ર દોષ એક અનોખો પ્રતિબંધ છે: ભાદ્રપદ શુક્લ ચતુર્થી પર, ચંદ્રને જોવાથી ખોટા આરોપો (ભાગવત પુરાણમાંથી સ્યમંતક રત્નનો શાપ) આવે છે એમ કહેવાય છે. જો આકસ્મિક રીતે જોવામાં આવે, તો સ્યમંતક કથા અથવા કૃષ્ણ સ્તુતિનું પઠન એ નિર્ધારિત ઉપાય છે.",
    aboutChaturthiText4:
      "મોદક (મીઠી કચોરી) એ ગણેશનું વિશિષ્ટ અર્પણ છે – સંકષ્ટી માટે પરંપરાગત રીતે 21 મોદક તૈયાર કરવામાં આવે છે, જે ગણેશ પુરાણના 21 અધ્યાયોનું પ્રતિનિધિત્વ કરે છે. 3 અથવા 5 પાંદડાના દૂર્વા ઘાસના (બર્મુડા ઘાસ) બંડલ અર્પણ કરવામાં આવે છે કારણ કે તે શીતળ ગુણધર્મો ધરાવે છે જે ગણેશને પ્રસન્ન કરે છે એમ માનવામાં આવે છે. દરેક ચતુર્થી 2026 અલગ-અલગ અઠવાડિયાના દિવસે આવે છે, અને ચંદ્રદયનો સમય નક્કી કરે છે કે સંકષ્ટી વ્રત ક્યારે તોડી શકાય – આ પૃષ્ઠ તમારા સ્થાન માટે ચોક્કસ ચંદ્રદયની ગણતરીઓ પ્રદાન કરે છે.",
    guideTitle_ekadashi: "એકાદશી વ્રતના નિયમો",
    guideTitle_purnima: "પૂર્ણિમા વ્રત માર્ગદર્શિકા",
    guideTitle_amavasya: "અમાવસ્યા: શું કરવું અને શું ન કરવું",
    guideTitle_pradosham: "પ્રદોષમ કેવી રીતે ઉજવવું",
    guideTitle_chaturthi: "ચતુર્થી પૂજા માર્ગદર્શિકા",
    guide_ekadashi_1: "તમામ અનાજ, કઠોળ, ચોખા, ઘઉં અને દાળ ટાળો",
    guide_ekadashi_2:
      "અનુમતિ પ્રાપ્ત: ફળો, બદામ, દૂધ, કંદમૂળ, સાબુદાણા, સિંધવ મીઠું (સેંધા નમક)",
    guide_ekadashi_3:
      "બીજા દિવસે સૂર્યોદય પછી પરંતુ દ્વાદશી તિથિ સમાપ્ત થાય તે પહેલાં વ્રત (પારણા) તોડો",
    guide_ekadashi_4: "નિર્જળા એકાદશી: આખો દિવસ ભોજન કે પાણી નહીં",
    guide_ekadashi_5: "વિષ્ણુ સહસ્રનામ અથવા ૐ નમો ભગવતે વાસુદેવાય નો જાપ કરો",
    guide_ekadashi_6:
      "દિવસ દરમિયાન ઊંઘવાનું ટાળો – શક્ય હોય તો રાત્રિ જાગરણ માટે જાગતા રહો",
    guide_purnima_1: "પંચામૃત અર્પણ સાથે સત્યનારાયણ કથા કરો",
    guide_purnima_2:
      "વ્રતના વિકલ્પો: નિર્જળા (પાણી વિના), ફળાહારી (ફક્ત ફળ), અથવા એક ભોજન",
    guide_purnima_3: "દાન આપો: ભોજન, વસ્ત્રો, તલ, અથવા ગાયને ખવડાવો",
    guide_purnima_4: "કીર્તન અને ધ્યાન સાથે જાગરણ (રાત્રિ જાગરણ) કરો",
    guide_purnima_5:
      "પવિત્ર નદીમાં સ્નાન કરો અથવા ચંદ્રદય સમયે મંદિરની મુલાકાત લો",
    guide_purnima_6: "શરદ પૂર્ણિમા પર ખીર તૈયાર કરો અને ચંદ્રપ્રકાશ હેઠળ રાખો",
    guide_amavasya_do_1: "પાણી, તલ અને કુશ ઘાસ સાથે પિતૃ તર્પણ કરો",
    guide_amavasya_do_2: "ધ્યાન કરો – અમાસ ઊંડા આત્મનિરીક્ષણને ટેકો આપે છે",
    guide_amavasya_do_3:
      "ભગવાન શનિને સરસવના તેલનો દીવો અર્પણ કરો (ખાસ કરીને શનિવારે)",
    guide_amavasya_do_4: "સોમવતી અમાવસ્યા (સોમવાર) પર પીપળાના વૃક્ષની પૂજા કરો",
    guide_amavasya_dont_1: "નવા સાહસો, વ્યવસાયો અથવા યાત્રાઓ શરૂ કરવાનું ટાળો",
    guide_amavasya_dont_2: "મોટી ખરીદીઓ, કરારો અથવા લગ્ન ટાળો",
    guide_amavasya_dont_3: "વાળ કે નખ કાપવાનું ટાળો (પરંપરાગત સૂચન)",
    guide_amavasya_dont_4: "તામસિક ભોજન (માંસ, દારૂ, વાસી ખોરાક) નું સેવન ટાળો",
    guide_pradosham_1:
      "પ્રદોષ કાળ દરમિયાન પૂજા શરૂ કરો – સૂર્યાસ્તની આસપાસ 90 મિનિટ",
    guide_pradosham_2: "ઘીનો દીવો પ્રગટાવો અને શિવલિંગને બિલ્વ પત્રો અર્પણ કરો",
    guide_pradosham_3: "સફેદ ફૂલો સાથે દૂધનો અભિષેક કરો",
    guide_pradosham_4:
      "મહા મૃત્યુંજય મંત્ર (108 વાર) અથવા શ્રી રુદ્રમનો જાપ કરો",
    guide_pradosham_5: "સૂર્યોદયથી ઉપવાસ કરો, સાંજની પૂજા પછી તોડો",
    guide_pradosham_6: "શનિ પ્રદોષમ (શનિવાર): ખાસ કરીને સાડાસાતીની રાહત માટે",
    guide_chaturthi_1: "સૂર્યોદયથી ચંદ્રદય સુધી ઉપવાસ કરો (સંકષ્ટી ચતુર્થી)",
    guide_chaturthi_2: "ચંદ્રના દર્શન અને પૂજા કર્યા પછી જ ઉપવાસ તોડો",
    guide_chaturthi_3:
      "21 મોદક અને દૂર્વા ઘાસ (3 અથવા 5 પાંદડાના બંડલ) અર્પણ કરો",
    guide_chaturthi_4: "ગણપતિ અથર્વશીર્ષ અથવા ૐ ગં ગણપતયે નમઃ નો જાપ કરો",
    guide_chaturthi_5: "ભાદ્રપદ ચતુર્થી: ચંદ્રને જોશો નહીં (ચંદ્ર દોષ)",
    guide_chaturthi_6:
      "જો ગણેશ ચતુર્થી પર આકસ્મિક રીતે ચંદ્ર દેખાય, તો સ્યમંતક કથાનું પઠન કરો",
    viewCalendar: "ઉત્સવ કેલેન્ડર જુઓ",
  },
  kn: {
    back: "ಕ್ಯಾಲೆಂಡರ್",
    completeDates: "ಸಂಪೂರ್ಣ ದಿನಾಂಕಗಳು ಮತ್ತು ಸಮಯಗಳು",
    next: "ಮುಂದೆ",
    total: "ಒಟ್ಟು",
    date: "ದಿನಾಂಕ",
    day: "ದಿನ",
    name: "ಹೆಸರು",
    timings: "ಸಮಯಗಳು",
    paksha: "ಪಕ್ಷ",
    shukla: "ಶುಕ್ಲ",
    krishna: "ಕೃಷ್ಣ",
    noEntries: "ಈ ತಿಂಗಳಿಗೆ ಯಾವುದೇ ದಿನಾಂಕಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    jumpTo: "ತಿಂಗಳಿಗೆ ಹೋಗಿ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    aboutEkadashi: "ಏಕಾದಶಿ ಬಗ್ಗೆ",
    aboutEkadashiText1:
      "ಏಕಾದಶಿಯು ಹಿಂದೂ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಪ್ರತಿ ಪಕ್ಷದ ಹನ್ನೊಂದನೇ ತಿಥಿ (ಚಂದ್ರ ದಿನ) ಆಗಿದ್ದು, ಪ್ರತಿ ತಿಂಗಳು ಎರಡು ಬಾರಿ ಬರುತ್ತದೆ – ಒಮ್ಮೆ ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ (ಬೆಳದಿಂಗಳ) ಮತ್ತು ಒಮ್ಮೆ ಕೃಷ್ಣ ಪಕ್ಷದಲ್ಲಿ (ಕತ್ತಲಾದ ಚಂದ್ರ). ಇದು ವರ್ಷಕ್ಕೆ ಸುಮಾರು 24 ಹೆಸರಿನ ಏಕಾದಶಿಗಳನ್ನು ನೀಡುತ್ತದೆ, ಪ್ರತಿಯೊಂದೂ ಪದ್ಮ ಪುರಾಣ ಮತ್ತು ಭವಿಷ್ಯ ಪುರಾಣಗಳಲ್ಲಿ ಬೇರೂರಿರುವ ವಿಶಿಷ್ಟ ಆಧ್ಯಾತ್ಮಿಕ ನಿರೂಪಣೆಯನ್ನು ಹೊಂದಿದೆ. ಬೃಹತ್ ಪರಾಶರ ಹೋರಾ ಶಾಸ್ತ್ರ (BPHS) ಏಕಾದಶಿಯನ್ನು ಅಂತರ್ಗತವಾಗಿ ಸಾತ್ವಿಕ ಎಂದು ವರ್ಗೀಕರಿಸುತ್ತದೆ – ಮನಸ್ಸು ಸಹಜವಾಗಿ ಚಿಂತನೆ ಮತ್ತು ಸಂಯಮದ ಕಡೆಗೆ ಒಲವು ತೋರುವ ದಿನ.",
    aboutEkadashiText2:
      "24 ಏಕಾದಶಿ ಚಕ್ರದಲ್ಲಿ ನಿರ್ಜಲ ಏಕಾದಶಿ (ಜ್ಯೇಷ್ಠ ಶುಕ್ಲ) ನಂತಹ ಪ್ರಸಿದ್ಧ ಆಚರಣೆಗಳು ಸೇರಿವೆ, ಇದನ್ನು ಅತ್ಯಂತ ಕಠಿಣವೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ ಏಕೆಂದರೆ ಭಕ್ತರು ಇಡೀ ದಿನ ಆಹಾರ ಮತ್ತು ನೀರು ಎರಡನ್ನೂ ತ್ಯಜಿಸುತ್ತಾರೆ. ಪಾಪಂಕುಶ ಏಕಾದಶಿ (ಅಶ್ವಿನ ಶುಕ್ಲ) ಸಂಚಿತ ಪಾಪಗಳನ್ನು ನಿವಾರಿಸುತ್ತದೆ ಎಂದು ನಂಬಲಾಗಿದೆ, ಆದರೆ ದೇವೂಥಾನಿ ಏಕಾದಶಿ (ಕಾರ್ತಿಕ ಶುಕ್ಲ) ಚಾತುರ್ಮಾಸದ ಅಂತ್ಯವನ್ನು ಗುರುತಿಸುತ್ತದೆ, ಆಗ ಭಗವಾನ್ ವಿಷ್ಣುವು ಕಾಸ್ಮಿಕ್ ನಿದ್ರೆಯಿಂದ ಎಚ್ಚರಗೊಳ್ಳುತ್ತಾನೆ. ಪ್ರತಿ ಏಕಾದಶಿ 2026 ರ ದಿನಾಂಕವು ಸ್ಥಳದಿಂದ ಸ್ಥಳಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ ಏಕೆಂದರೆ ತಿಥಿ ಗಡಿಯು ಸ್ಥಳೀಯ ಸೂರ್ಯೋದಯವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ – ಈ ಪುಟವು ನಿಮ್ಮ ನಿರ್ದೇಶಾಂಕಗಳಿಗೆ ನಿಖರವಾದ ಸಮಯಗಳನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    aboutEkadashiText3:
      "ಏಕಾದಶಿ ಉಪವಾಸದ ನಿಯಮಗಳನ್ನು ಹರಿ ಭಕ್ತಿ ವಿಲಾಸದಲ್ಲಿ ಸಂಹಿತೆಗೊಳಿಸಲಾಗಿದೆ. ಧಾನ್ಯಗಳು ಮತ್ತು ಬೇಳೆಕಾಳುಗಳಿಂದ (ಅನ್ನ) ಸಂಪೂರ್ಣ ಉಪವಾಸ ಮಾಡುವುದು ಸಾಮಾನ್ಯ ಅಭ್ಯಾಸ. ಅನುಮತಿಸಲಾದ ಆಹಾರಗಳಲ್ಲಿ ಹಣ್ಣುಗಳು, ಬೀಜಗಳು, ಹಾಲು, ಗೆಡ್ಡೆ ತರಕಾರಿಗಳು (ಆಲೂಗಡ್ಡೆ, ಸಿಹಿ ಆಲೂಗಡ್ಡೆ), ಸಾಬುದಾನ (ಟಪಿಯೋಕಾ) ಮತ್ತು ಕಲ್ಲು ಉಪ್ಪು (ಸೇಂಧಾ ನಮಕ್) ಸೇರಿವೆ. ಸಾಮಾನ್ಯ ಟೇಬಲ್ ಉಪ್ಪು, ಅಕ್ಕಿ, ಗೋಧಿ, ಬೇಳೆಕಾಳುಗಳು ಮತ್ತು ಸಾಸಿವೆ ಎಣ್ಣೆಯನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ತ್ಯಜಿಸಲಾಗುತ್ತದೆ. ವೈಜ್ಞಾನಿಕ ತರ್ಕವು ಆಧುನಿಕ ಮಧ್ಯಂತರ ಉಪವಾಸ ಸಂಶೋಧನೆಯೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ: 24-ಗಂಟೆಗಳ ಧಾನ್ಯ-ಮುಕ್ತ ವಿಂಡೋ ಜೀರ್ಣಾಂಗ ವ್ಯವಸ್ಥೆಗೆ ಆವರ್ತಕ ಮರುಹೊಂದಿಕೆಯನ್ನು ನೀಡುತ್ತದೆ, ಇನ್ಸುಲಿನ್ ಸ್ಪೈಕ್‌ಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಆಟೋಫ್ಯಾಜಿಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ – ದೇಹದ ಸೆಲ್ಯುಲಾರ್ ದುರಸ್ತಿ ಕಾರ್ಯವಿಧಾನ.",
    aboutEkadashiText4:
      "ಪಾರಣ (ಉಪವಾಸ ಮುರಿಯುವುದು) ಮರುದಿನ ನಿಗದಿತ ಸಮಯದೊಳಗೆ ಮಾಡಬೇಕು – ಸೂರ್ಯೋದಯದ ನಂತರ ಆದರೆ ದ್ವಾದಶಿ ತಿಥಿ ಮುಗಿಯುವ ಮೊದಲು. ಮರುದಿನ ಸೂರ್ಯೋದಯದ ಮೊದಲು ದ್ವಾದಶಿ ಮುಗಿದರೆ, ಸೂರ್ಯೋದಯದ ತಕ್ಷಣ ಪಾರಣ ಮಾಡಬೇಕು. ಪಾರಣ ಸಮಯವನ್ನು ತಪ್ಪಿಸುವುದು ಉಪವಾಸವನ್ನು ತಪ್ಪಿಸಿದಷ್ಟೇ ಅಶುಭವೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ಪ್ರಾದೇಶಿಕ ವ್ಯತ್ಯಾಸಗಳು ಅಸ್ತಿತ್ವದಲ್ಲಿವೆ: ಸ್ಮಾರ್ತ ಏಕಾದಶಿಯು ವೈಷ್ಣವ ಏಕಾದಶಿಗಿಂತ ವಿಭಿನ್ನ ಕ್ಯಾಲೆಂಡರ್ ಲೆಕ್ಕಾಚಾರವನ್ನು ಅನುಸರಿಸುತ್ತದೆ, ಮತ್ತು ಕೆಲವು ವರ್ಷಗಳಲ್ಲಿ ಅಧಿಕ ಮಾಸದ ಕಾರಣದಿಂದ ಹೆಚ್ಚುವರಿ (ಅಧಿಕ ಮಾಸ) ಏಕಾದಶಿ ಜೋಡಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ.",
    aboutPurnima: "ಪೂರ್ಣಿಮಾ ಬಗ್ಗೆ",
    aboutPurnimaText1:
      "ಪೂರ್ಣಿಮಾ ಎಂದರೆ ಹುಣ್ಣಿಮೆಯ ದಿನ – ಶುಕ್ಲ ಪಕ್ಷದ ಹದಿನೈದನೇ ಮತ್ತು ಅಂತಿಮ ತಿಥಿ, ಆಗ ಚಂದ್ರನ ಬಿಲ್ಲೆಯು ಸಂಪೂರ್ಣವಾಗಿ ಪ್ರಕಾಶಿತವಾಗಿರುತ್ತದೆ. ಇದು ಪ್ರತಿ ಸೈನೋಡಿಕ್ ತಿಂಗಳಿಗೆ (ಸುಮಾರು 29.53 ದಿನಗಳು) ಒಮ್ಮೆ ಸಂಭವಿಸುತ್ತದೆ ಮತ್ತು ವೈದಿಕ ಕಾಲಗಣನೆಯಲ್ಲಿ ಕೇಂದ್ರ ಸ್ಥಾನವನ್ನು ಹೊಂದಿದೆ. ಉತ್ತರ ಭಾರತದಾದ್ಯಂತ ಬಳಸಲಾಗುವ ಪೂರ್ಣಿಮಾಂತ ಕ್ಯಾಲೆಂಡರ್ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ, ಪೂರ್ಣಿಮಾ ತಿಂಗಳುಗಳ ನಡುವಿನ ಗಡಿಯನ್ನು ಗುರುತಿಸುತ್ತದೆ: ತಿಂಗಳು ಹುಣ್ಣಿಮೆಯ ದಿನದಂದು ಕೊನೆಗೊಳ್ಳುತ್ತದೆ, ಇದು ಗ್ರೆಗೋರಿಯನ್ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಡಿಸೆಂಬರ್ 31 ರ ಕ್ಯಾಲೆಂಡರ್ ಸಮಾನವಾಗಿದೆ.",
    aboutPurnimaText2:
      "ಹಿಂದೂ ವರ್ಷದಲ್ಲಿ 12 ರಿಂದ 13 ಹೆಸರಿನ ಪೂರ್ಣಿಮಾಗಳಿವೆ, ಪ್ರತಿಯೊಂದೂ ನಿರ್ದಿಷ್ಟ ಆಚರಣೆಗೆ ಸಂಬಂಧಿಸಿದೆ. ಗುರು ಪೂರ್ಣಿಮಾ (ಆಷಾಢ) ಗುರು ಪರಂಪರೆ ಮತ್ತು ವೇದಗಳ ಸಂಕಲನಕಾರರಾದ ವ್ಯಾಸರನ್ನು ಗೌರವಿಸುತ್ತದೆ. ಶರದ್ ಪೂರ್ಣಿಮಾ (ಅಶ್ವಿನ) ಸುಗ್ಗಿಯ ಚಂದ್ರನ ಆಚರಣೆಯಾಗಿದ್ದು, ಚಂದ್ರನು ಅಮೃತವನ್ನು (ಮಕರಂದ) ಸುರಿಸುತ್ತಾನೆ ಎಂದು ನಂಬಲಾಗಿದೆ – ಭಕ್ತರು ಚಂದ್ರನ ಬೆಳಕಿನಲ್ಲಿ ಇಟ್ಟ ಖೀರ್ ಅನ್ನು ತಯಾರಿಸುತ್ತಾರೆ. ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮಾ ದೇವ ದೀಪಾವಳಿಯೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ ಮತ್ತು ಗಂಗಾ ಸ್ನಾನಕ್ಕೆ ಪವಿತ್ರವಾಗಿದೆ. ಬುದ್ಧ ಪೂರ್ಣಿಮಾ (ವೈಶಾಖ) ಗೌತಮ ಬುದ್ಧನ ಜನನ, ಜ್ಞಾನೋದಯ ಮತ್ತು ಪರಿನಿರ್ವಾಣವನ್ನು ಆಚರಿಸುತ್ತದೆ. ಹೋಳಿ ಫಾಲ್ಗುಣ ಪೂರ್ಣಿಮಾದಂದು ಬರುತ್ತದೆ, ಮತ್ತು ರಕ್ಷಾ ಬಂಧನ ಶ್ರಾವಣ ಪೂರ್ಣಿಮಾದಂದು ಬರುತ್ತದೆ.",
    aboutPurnimaText3:
      "ಆಯುರ್ವೇದ ಮತ್ತು ಸೂರ್ಯ ಸಿದ್ಧಾಂತ ಎರಡೂ ಜೈವಿಕ ಲಯಗಳ ಮೇಲೆ ಚಂದ್ರನ ಪ್ರಭಾವವನ್ನು ದಾಖಲಿಸುತ್ತವೆ. ಹುಣ್ಣಿಮೆಯ ಗುರುತ್ವಾಕರ್ಷಣೆಯು ಸಾಗರಗಳ ಉಬ್ಬರವಿಳಿತಗಳ ಮೇಲೆ ಗಮನಾರ್ಹವಾಗಿ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ, ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್‌ಗಳು ಪೂರ್ಣಿಮಾದ ಸುತ್ತ ಬಿತ್ತನೆ ಮತ್ತು ಕೊಯ್ಲು ಸಮಯವನ್ನು ನಿರ್ಧರಿಸುತ್ತವೆ. ಚರಕ ಸಂಹಿತೆಯು ಕಫ ದೋಷವು ಪೂರ್ಣಿಮಾದಂದು ಉತ್ತುಂಗಕ್ಕೇರುತ್ತದೆ ಎಂದು ಹೇಳುತ್ತದೆ, ಹಗುರವಾದ ಊಟ ಮತ್ತು ಧ್ಯಾನ ಅಭ್ಯಾಸವನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ. ಆಧುನಿಕ ಕ್ರೋನೋಬಯಾಲಜಿ ಹುಣ್ಣಿಮೆಯ ಸುತ್ತ ಮೆಲಟೋನಿನ್ ಸಂವೇದನೆ ಹೆಚ್ಚಳ ಮತ್ತು ನಿದ್ರೆಯ ರಚನೆಯ ಬದಲಾವಣೆಯನ್ನು ದೃಢಪಡಿಸುತ್ತದೆ – ಪೂರ್ಣಿಮಾದಂದು ಉಪವಾಸ ಮತ್ತು ರಾತ್ರಿ ಜಾಗರಣೆ (ಜಾಗರಣೆ) ಯ ಪ್ರಾಚೀನ ಶಿಫಾರಸಿಗೆ ಪ್ರಾಯೋಗಿಕ ತೂಕವನ್ನು ನೀಡುತ್ತದೆ.",
    aboutPurnimaText4:
      "ಪೂರ್ಣಿಮಾ ಆಚರಣೆಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಸತ್ಯನಾರಾಯಣ ಕಥೆಯನ್ನು ಒಳಗೊಂಡಿರುತ್ತವೆ – ಸ್ಕಂದ ಪುರಾಣದಿಂದ ವಿವರಿಸಿದ ಭಗವಾನ್ ವಿಷ್ಣುವಿಗೆ ಸಮರ್ಪಿತವಾದ ಪೂಜೆ, ಪಂಚಾಮೃತದೊಂದಿಗೆ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಪ್ರಸಾದವಾಗಿ ಸಮುದಾಯಕ್ಕೆ ನೀಡಲಾಗುತ್ತದೆ. ಪೂರ್ಣಿಮಾದಂದು ಉಪವಾಸವು ನಿರ್ಜಲ (ನೀರಲ್ಲದೆ) ದಿಂದ ಫಲಾಹಾರಿ (ಹಣ್ಣು ಮಾತ್ರ) ವರೆಗೆ ಇರುತ್ತದೆ, ಇದು ಪ್ರಾದೇಶಿಕ ಸಂಪ್ರದಾಯವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ. ಪೂರ್ಣಿಮಾದಂದು ನೀಡಿದ ದಾನ (ದಾನ) – ವಿಶೇಷವಾಗಿ ಆಹಾರ, ಬಟ್ಟೆ ಮತ್ತು ಎಳ್ಳು – ವರ್ಧಿತ ಆಧ್ಯಾತ್ಮಿಕ ಪುಣ್ಯವನ್ನು ನೀಡುತ್ತದೆ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. 2026 ರಲ್ಲಿ, ಪ್ರತಿ ಪೂರ್ಣಿಮಾ ದಿನಾಂಕ ಮತ್ತು ಚಂದ್ರೋದಯದ ಸಮಯವು ಸ್ಥಳ-ಅವಲಂಬಿತವಾಗಿದೆ; ಈ ಪುಟವು ನಿಮ್ಮ ನಿರ್ದೇಶಾಂಕಗಳಿಗೆ ಅವುಗಳನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    aboutAmavasya: "ಅಮಾವಾಸ್ಯೆ ಬಗ್ಗೆ",
    aboutAmavasyaText1:
      'ಅಮಾವಾಸ್ಯೆ ಎಂದರೆ ಅಮಾವಾಸ್ಯೆಯ ದಿನ – ಕೃಷ್ಣ ಪಕ್ಷದ ಮೂವತ್ತನೇ ಮತ್ತು ಅಂತಿಮ ತಿಥಿ, ಆಗ ಚಂದ್ರನು ಸಂಪೂರ್ಣವಾಗಿ ಅಗೋಚರನಾಗಿರುತ್ತಾನೆ. ಗುಜರಾತ್, ಮಹಾರಾಷ್ಟ್ರ, ಕರ್ನಾಟಕ ಮತ್ತು ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ ಅನುಸರಿಸುವ ಅಮಾಂತ (ಅಮಾವಾಸ್ಯಾಂತ) ಕ್ಯಾಲೆಂಡರ್ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ, ಅಮಾವಾಸ್ಯೆಯು ಚಂದ್ರ ಮಾಸದ ಕೊನೆಯ ದಿನವನ್ನು ಗುರುತಿಸುತ್ತದೆ. ಈ ಪದವು ಸಂಸ್ಕೃತದ "ಅಮ" (ಒಟ್ಟಿಗೆ) ಮತ್ತು "ವಸ್ಯ" (ವಾಸಿಸಲು) ದಿಂದ ಬಂದಿದೆ, ಇದು ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರರ ಸಂಯೋಗವನ್ನು ಸೂಚಿಸುತ್ತದೆ – ಅವು ಆಕಾಶದಲ್ಲಿ ಒಂದೇ ರೇಖಾಂಶವನ್ನು ಆಕ್ರಮಿಸುತ್ತವೆ, ಚಂದ್ರನನ್ನು ಕತ್ತಲನ್ನಾಗಿ ಮಾಡುತ್ತವೆ.',
    aboutAmavasyaText2:
      "ಅಮಾವಾಸ್ಯೆಯು ಪಿತೃ ತರ್ಪಣಕ್ಕೆ ಪರಮ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಹೊಂದಿದೆ – ಮೃತ ಪೂರ್ವಜರಿಗೆ ನೀರು, ಎಳ್ಳು ಮತ್ತು ಕುಶ ಹುಲ್ಲಿನ ಆಚರಣೆಯ ಅರ್ಪಣೆಗಳು. ಗರುಡ ಪುರಾಣ ಮತ್ತು ಮಾರ್ಕಂಡೇಯ ಪುರಾಣಗಳು ಅಮಾವಾಸ್ಯೆಯನ್ನು ಪಿತೃ ಲೋಕ (ಪೂರ್ವಜರ ಲೋಕ) ಅತ್ಯಂತ ಸುಲಭವಾಗಿ ಪ್ರವೇಶಿಸಬಹುದಾದ ದಿನವೆಂದು ಸೂಚಿಸುತ್ತವೆ. ಸೋಮವಾರ ಬರುವ ಸೋಮವತಿ ಅಮಾವಾಸ್ಯೆಯು ತರ್ಪಣ ಮತ್ತು ಅಶ್ವತ್ಥ ಮರದ ಪೂಜೆಗೆ ವಿಶೇಷವಾಗಿ ಶಕ್ತಿಶಾಲಿಯಾಗಿದೆ. ಮೌನಿ ಅಮಾವಾಸ್ಯೆ (ಮಾಘ) ಮೌನ ವ್ರತ (ಮೌನದ ಪ್ರತಿಜ್ಞೆ) ಮತ್ತು ಪವಿತ್ರ ನದಿ ಸ್ನಾನವನ್ನು ಸೂಚಿಸುತ್ತದೆ – ಕುಂಭಮೇಳದ ಅತ್ಯಂತ ಪವಿತ್ರ ಸ್ನಾನವು ಈ ದಿನದಂದು ಬರುತ್ತದೆ.",
    aboutAmavasyaText3:
      "ದೀಪಾವಳಿ ಹಬ್ಬವು ಕಾರ್ತಿಕ ಅಮಾವಾಸ್ಯೆಯಂದು ಬರುತ್ತದೆ, ಇಲ್ಲದಿದ್ದರೆ ಗಂಭೀರವಾದ ಅಮಾವಾಸ್ಯೆಯನ್ನು ವರ್ಷದ ಅತ್ಯಂತ ಆಚರಿಸುವ ರಾತ್ರಿಯನ್ನಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ. ಈ ದಿನ, ಪ್ರದೋಷ ಕಾಲ ಮತ್ತು ನಿಶಿತ ಕಾಲದಲ್ಲಿ ಲಕ್ಷ್ಮಿ ಪೂಜೆಯನ್ನು ಮಾಡಲಾಗುತ್ತದೆ. ಶನಿ ಅಮಾವಾಸ್ಯೆ (ಶನಿವಾರ) ಭಗವಾನ್ ಶನಿಗೆ ಸಾಸಿವೆ ಎಣ್ಣೆಯ ಅರ್ಪಣೆಗಳೊಂದಿಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ, ಇದು ಜಾತಕದಲ್ಲಿ ಶನಿಯ ದುಷ್ಪರಿಣಾಮಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಎಂದು ನಂಬಲಾಗಿದೆ. ಕಾಳಿ ಪೂಜೆ, ವಿಶೇಷವಾಗಿ ಬಂಗಾಳದಲ್ಲಿ, ಅಮಾವಾಸ್ಯೆಯೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ, ಆಗ ದೇವತೆ ಕಾಳಿಯ ಉಗ್ರ ಶಕ್ತಿಯನ್ನು ರಾತ್ರಿಯಿಡೀ ಪೂಜೆಯ ಮೂಲಕ ಗೌರವಿಸಲಾಗುತ್ತದೆ.",
    aboutAmavasyaText4:
      "ಅಮಾವಾಸ್ಯೆಯನ್ನು ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ಹೊಸ ಉದ್ಯಮಗಳು, ವಿವಾಹಗಳು ಅಥವಾ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಅಶುಭವೆಂದು ಪರಿಗಣಿಸಲಾಗಿದ್ದರೂ, ಇದು ಆತ್ಮಾವಲೋಕನ ಮತ್ತು ತಾಂತ್ರಿಕ ಅಭ್ಯಾಸಗಳಿಗೆ ಆಳವಾಗಿ ಶಕ್ತಿಶಾಲಿ ಎಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ. ಅಮಾವಾಸ್ಯೆಯಂದು ಧ್ಯಾನವು ಪ್ರಜ್ಞೆಯ ಆಳವಾದ ಸ್ಥಿತಿಗಳನ್ನು ಭೇದಿಸುತ್ತದೆ ಎಂದು ಹೇಳಲಾಗುತ್ತದೆ ಏಕೆಂದರೆ ಬಾಹ್ಯ ಸಂವೇದನಾ ವಿಚಲನ (ಚಂದ್ರನ ಬೆಳಕು) ಇರುವುದಿಲ್ಲ. ಆಯುರ್ವೇದವು ಅಮಾವಾಸ್ಯೆಯಂದು ವಾತ ದೋಷವು ಹೆಚ್ಚಾಗುತ್ತದೆ ಎಂದು ಹೇಳುತ್ತದೆ, ಬೆಚ್ಚಗಿನ, ನೆಲದ ಆಹಾರಗಳು ಮತ್ತು ತೈಲ ಮಸಾಜ್ (ಅಭ್ಯಂಗ) ಅನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ. ಅಮಾವಾಸ್ಯೆ 2026 ರ ದಿನಾಂಕಗಳು ಸಮಯ ವಲಯ ಮತ್ತು ಸ್ಥಳದಿಂದ ಬದಲಾಗುತ್ತವೆ – ಈ ಪುಟವು ನಿಮ್ಮ ನಿರ್ದೇಶಾಂಕಗಳಿಗೆ ಲೆಕ್ಕಹಾಕಿದ ನಿಖರವಾದ ಸಮಯಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    aboutPradosham: "ಪ್ರದೋಷದ ಬಗ್ಗೆ",
    aboutPradoshamText1:
      'ಪ್ರದೋಷ (ಪ್ರದೋಷ ವ್ರತ) ಪ್ರತಿ ಚಂದ್ರ ಪಕ್ಷದ ಹದಿಮೂರನೇ ತಿಥಿ (ತ್ರಯೋದಶಿ) ಯಂದು ಬರುತ್ತದೆ – ಶುಕ್ಲ ಮತ್ತು ಕೃಷ್ಣ ಪಕ್ಷ ಎರಡರಲ್ಲೂ – ವರ್ಷಕ್ಕೆ ಸುಮಾರು 24 ಪ್ರದೋಷ ದಿನಗಳನ್ನು ನೀಡುತ್ತದೆ. "ಪ್ರದೋಷ" ಎಂಬ ಪದವು ಅಕ್ಷರಶಃ "ರಾತ್ರಿಯ ಮೊದಲ ಭಾಗ" ಎಂದರ್ಥ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ರಾತ್ರಿ ಬೀಳುವ ನಡುವಿನ ಸಂಧ್ಯಾಕಾಲವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಪ್ರದೋಷ ಕಾಲ ಎಂದು ಕರೆಯಲ್ಪಡುವ ಈ 90 ನಿಮಿಷಗಳ ಅವಧಿಯನ್ನು ಸ್ಕಂದ ಪುರಾಣದ ಪ್ರಕಾರ ಭಗವಾನ್ ಶಿವನ ಪೂಜೆಗೆ ಅತ್ಯಂತ ಪವಿತ್ರ ಸಮಯವೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ.',
    aboutPradoshamText2:
      "ಪ್ರದೋಷದ ಮೂಲ ಕಥೆಯು ಸ್ಕಂದ ಪುರಾಣದಿಂದ ಬಂದಿದೆ. ದೇವರುಗಳು ಮತ್ತು ರಾಕ್ಷಸರು ಕಾಸ್ಮಿಕ್ ಸಾಗರವನ್ನು (ಸಮುದ್ರ ಮಂಥನ) ಮಥಿಸಿದಾಗ, ತ್ರಯೋದಶಿಯ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಮಾರಣಾಂತಿಕ ವಿಷ ಹಾಲಾಹಲ ಹೊರಹೊಮ್ಮಿತು. ಭಗವಾನ್ ಶಿವನು ಸೃಷ್ಟಿಯನ್ನು ಉಳಿಸಲು ವಿಷವನ್ನು ಸೇವಿಸಿದನು, ಮತ್ತು ಪಾರ್ವತಿಯು ಅದನ್ನು ಕೆಳಗೆ ಇಳಿಯದಂತೆ ತಡೆಯಲು ಅವನ ಗಂಟಲನ್ನು ಒತ್ತಿದಳು – ಅವನ ಗಂಟಲನ್ನು ನೀಲಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿಸಿತು (ನೀಲಕಂಠ). ಶಿವನ ದೈವಿಕ ಎತ್ತು ನಂದಿಯು ಈ ಸಂಧ್ಯಾಕಾಲದಲ್ಲಿ ತೀವ್ರ ತಪಸ್ಸು ಮಾಡಿದೆ ಎಂದು ಹೇಳಲಾಗುತ್ತದೆ, ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಶಿವನನ್ನು ಪೂಜಿಸುವ ಯಾರಾದರೂ ಶೀಘ್ರ ಅನುಗ್ರಹವನ್ನು ಪಡೆಯುತ್ತಾರೆ ಎಂಬ ವರವನ್ನು ಗಳಿಸಿತು.",
    aboutPradoshamText3:
      "ಶನಿ ಪ್ರದೋಷ (ಶನಿವಾರ) ಮತ್ತು ಸೋಮ ಪ್ರದೋಷ (ಸೋಮವಾರ) ವಿಶೇಷ ಮಹತ್ವವನ್ನು ಹೊಂದಿವೆ. ಶನಿ ಪ್ರದೋಷವು ಶನಿಯ ಕರ್ಮ ಶಿಸ್ತನ್ನು ಶಿವನ ಪರಿವರ್ತಕ ಶಕ್ತಿಯೊಂದಿಗೆ ಸಂಯೋಜಿಸುತ್ತದೆ – ವಿಶೇಷವಾಗಿ ತಮ್ಮ ಜಾತಕದಲ್ಲಿ ಸಾಡೆ ಸಾತಿ ಅಥವಾ ಶನಿ ದಶಾವನ್ನು ಅನುಭವಿಸುತ್ತಿರುವವರಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಸೋಮ ಪ್ರದೋಷವು ಚಂದ್ರನ ಭಾವನಾತ್ಮಕ ಗುಣಪಡಿಸುವಿಕೆಯನ್ನು ಶಿವ ಪೂಜೆಯೊಂದಿಗೆ ಜೋಡಿಸುತ್ತದೆ, ಮಾನಸಿಕ ಶಾಂತಿ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆಗೆ ಸೂಚಿಸಲಾಗುತ್ತದೆ. ಭೌಮ ಪ್ರದೋಷ (ಮಂಗಳವಾರ) ಮಂಗಳ-ಸಂಬಂಧಿತ ಪರಿಹಾರಗಳಿಗಾಗಿ, ವಿಶೇಷವಾಗಿ ಮಂಗಳ ದೋಷಕ್ಕಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ.",
    aboutPradoshamText4:
      "ಪ್ರದೋಷ ಪೂಜಾ ವಿಧಿಯು ಸಂಧ್ಯಾಕಾಲದಲ್ಲಿ ತುಪ್ಪದ ದೀಪವನ್ನು ಬೆಳಗಿಸುವುದು, ಬಿಲ್ವ ಪತ್ರೆ, ಬಿಳಿ ಹೂವುಗಳು ಮತ್ತು ಹಾಲು ಅಭಿಷೇಕವನ್ನು ಶಿವಲಿಂಗಕ್ಕೆ ಅರ್ಪಿಸುವುದನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ. ಭಕ್ತರು ದಿನವಿಡೀ ಉಪವಾಸವನ್ನು ಆಚರಿಸುತ್ತಾರೆ, ಸಂಜೆ ಪೂಜೆಯ ನಂತರ ಅದನ್ನು ಮುರಿಯುತ್ತಾರೆ. ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಮತ್ತು ರುದ್ರಂ ಜಪಿಸುವುದು ಅಸಾಧಾರಣವಾಗಿ ಶಕ್ತಿಶಾಲಿ ಎಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ. ಪ್ರದೋಷ 2026 ರ ದಿನಾಂಕಗಳು ಮತ್ತು ನಿಖರವಾದ ಪ್ರದೋಷ ಕಾಲದ ಅವಧಿಯು ನಿಮ್ಮ ಸ್ಥಳೀಯ ಸೂರ್ಯಾಸ್ತದ ಸಮಯವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ – ಈ ಪುಟವು ನಿಮ್ಮ ಸ್ಥಳಕ್ಕಾಗಿ ಎರಡನ್ನೂ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.",
    aboutChaturthi: "ಚತುರ್ಥಿ ಬಗ್ಗೆ",
    aboutChaturthiText1:
      "ಚತುರ್ಥಿಯು ಪ್ರತಿ ಚಂದ್ರ ಪಕ್ಷದ ನಾಲ್ಕನೇ ತಿಥಿಯಾಗಿದ್ದು, ಭಗವಾನ್ ಗಣೇಶನಿಗೆ ಪವಿತ್ರವಾಗಿದೆ – ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸುವವನು ಮತ್ತು ಪ್ರತಿ ಹಿಂದೂ ಸಮಾರಂಭದ ಆರಂಭದಲ್ಲಿ ಆಹ್ವಾನಿಸುವ ದೇವತೆ. ಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ ಉಪನಿಷತ್ತು ಗಣೇಶನನ್ನು ಆನೆಯ ರೂಪದಲ್ಲಿ ಪ್ರಕಟವಾದ ಆದಿ ಕಾಸ್ಮಿಕ್ ತತ್ವ (ಬ್ರಹ್ಮನ್) ಎಂದು ಘೋಷಿಸುತ್ತದೆ, ಮತ್ತು ಚತುರ್ಥಿಯು ತಿಥಿ ಚಕ್ರದಲ್ಲಿ ಅವನ ಗೊತ್ತುಪಡಿಸಿದ ಪೂಜಾ ದಿನವಾಗಿದೆ.",
    aboutChaturthiText2:
      "ಎರಡು ರೀತಿಯ ಚತುರ್ಥಿಗಳು ಮಾಸಿಕವಾಗಿ ಮರುಕಳಿಸುತ್ತವೆ. ಸಂಕಷ್ಟಿ ಚತುರ್ಥಿಯು ಕೃಷ್ಣ ಪಕ್ಷದಲ್ಲಿ (ಕತ್ತಲಾದ ಚಂದ್ರ) ಬರುತ್ತದೆ ಮತ್ತು ಇದು ಪ್ರಾಥಮಿಕ ಮಾಸಿಕ ಗಣೇಶ ವ್ರತವಾಗಿದೆ. ಭಕ್ತರು ಸೂರ್ಯೋದಯದಿಂದ ಚಂದ್ರೋದಯದವರೆಗೆ ಉಪವಾಸ ಮಾಡುತ್ತಾರೆ, ಮತ್ತು ಚಂದ್ರನನ್ನು ನೋಡಿದ ನಂತರ ಮತ್ತು ಗಣೇಶ ಪೂಜೆಯನ್ನು ಮಾಡಿದ ನಂತರವೇ ಉಪವಾಸವನ್ನು ಮುರಿಯಲಾಗುತ್ತದೆ. ಆದ್ದರಿಂದ ಚಂದ್ರೋದಯದ ಸಮಯವು ನಿರ್ಣಾಯಕವಾಗಿದೆ – ಇದು ಸ್ಥಳ ಮತ್ತು ಋತುವಿನ ಪ್ರಕಾರ ಗಮನಾರ್ಹವಾಗಿ ಬದಲಾಗುತ್ತದೆ. ವಿನಾಯಕ ಚತುರ್ಥಿಯು ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ (ಬೆಳದಿಂಗಳ) ಬರುತ್ತದೆ ಮತ್ತು ಬೆಳಗಿನ ಪೂಜೆ ಮತ್ತು ಮೋದಕ ಅರ್ಪಣೆಗಳೊಂದಿಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ, ಆದರೂ ಇದು ಸಂಕಷ್ಟಿಗಿಂತ ಕಡಿಮೆ ಕಠಿಣತೆಯನ್ನು ಹೊಂದಿದೆ.",
    aboutChaturthiText3:
      "ಭವ್ಯವಾದ ಗಣೇಶ ಚತುರ್ಥಿ ಹಬ್ಬ (ಭಾದ್ರಪದ ಶುಕ್ಲ ಚತುರ್ಥಿ, ಆಗಸ್ಟ್-ಸೆಪ್ಟೆಂಬರ್) ಅನಂತ ಚತುರ್ದಶಿಯಲ್ಲಿ ಕೊನೆಗೊಳ್ಳುವ 10 ದಿನಗಳ ಆಚರಣೆಯಾಗಿದೆ. 1893 ರಲ್ಲಿ ಲೋಕಮಾನ್ಯ ತಿಲಕ್ ಅವರು ಸಮುದಾಯದ ಏಕತೆಯನ್ನು ಬೆಳೆಸಲು ಸಾರ್ವಜನಿಕ ಹಬ್ಬವಾಗಿ ಸ್ಥಾಪಿಸಿದರು, ಇದು ವಿಸ್ತಾರವಾದ ಮಣ್ಣಿನ ಗಣೇಶ ಪ್ರತಿಷ್ಠಾಪನೆಗಳು (ಪಂಡಲ್‌ಗಳು), ದೈನಂದಿನ ಆರತಿ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ವಿಸರ್ಜನೆ (ಮುಳುಗಿಸುವಿಕೆ) ಮೆರವಣಿಗೆಯನ್ನು ಒಳಗೊಂಡಿದೆ. ಚತುರ್ಥಿ ಚಂದ್ರ ದೋಷವು ಒಂದು ವಿಶಿಷ್ಟ ನಿಷೇಧವಾಗಿದೆ: ಭಾದ್ರಪದ ಶುಕ್ಲ ಚತುರ್ಥಿಯಂದು, ಚಂದ್ರನನ್ನು ನೋಡುವುದು ಸುಳ್ಳು ಆರೋಪಗಳನ್ನು ತರುತ್ತದೆ ಎಂದು ಹೇಳಲಾಗುತ್ತದೆ (ಭಾಗವತ ಪುರಾಣದಿಂದ ಶ್ಯಮಂತಕ ರತ್ನ ಶಾಪ). ಆಕಸ್ಮಿಕವಾಗಿ ನೋಡಿದರೆ, ಶ್ಯಮಂತಕ ಕಥೆ ಅಥವಾ ಕೃಷ್ಣ ಸ್ತುತಿಯನ್ನು ಪಠಿಸುವುದು ಸೂಚಿಸಲಾದ ಪರಿಹಾರವಾಗಿದೆ.",
    aboutChaturthiText4:
      "ಮೋದಕ (ಸಿಹಿ ಕಡುಬು) ಗಣೇಶನ ವಿಶಿಷ್ಟ ಅರ್ಪಣೆಯಾಗಿದೆ – ಸಂಕಷ್ಟಿಗಾಗಿ ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ 21 ಮೋದಕಗಳನ್ನು ತಯಾರಿಸಲಾಗುತ್ತದೆ, ಇದು ಗಣೇಶ ಪುರಾಣದ 21 ಅಧ್ಯಾಯಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ. 3 ಅಥವಾ 5 ಎಲೆಗಳ ದುರ್ವಾ ಹುಲ್ಲು (ಬರ್ಮುಡಾ ಹುಲ್ಲು) ಕಟ್ಟುಗಳನ್ನು ಅರ್ಪಿಸಲಾಗುತ್ತದೆ ಏಕೆಂದರೆ ಅವು ಗಣೇಶನನ್ನು ಮೆಚ್ಚಿಸುವ ತಂಪಾಗಿಸುವ ಗುಣಗಳನ್ನು ಹೊಂದಿವೆ ಎಂದು ನಂಬಲಾಗಿದೆ. ಪ್ರತಿ ಚತುರ್ಥಿ 2026 ವಿಭಿನ್ನ ವಾರದ ದಿನದಂದು ಬರುತ್ತದೆ, ಮತ್ತು ಚಂದ್ರೋದಯದ ಸಮಯವು ಸಂಕಷ್ಟಿ ಉಪವಾಸವನ್ನು ಯಾವಾಗ ಮುರಿಯಬಹುದು ಎಂಬುದನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ – ಈ ಪುಟವು ನಿಮ್ಮ ಸ್ಥಳಕ್ಕಾಗಿ ನಿಖರವಾದ ಚಂದ್ರೋದಯ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    guideTitle_ekadashi: "ಏಕಾದಶಿ ಉಪವಾಸ ನಿಯಮಗಳು",
    guideTitle_purnima: "ಪೂರ್ಣಿಮಾ ಆಚರಣೆ ಮಾರ್ಗದರ್ಶಿ",
    guideTitle_amavasya: "ಅಮಾವಾಸ್ಯೆ ಮಾಡಬೇಕಾದ್ದು ಮತ್ತು ಮಾಡಬಾರದು",
    guideTitle_pradosham: "ಪ್ರದೋಷವನ್ನು ಹೇಗೆ ಆಚರಿಸುವುದು",
    guideTitle_chaturthi: "ಚತುರ್ಥಿ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿ",
    guide_ekadashi_1:
      "ಎಲ್ಲಾ ಧಾನ್ಯಗಳು, ಬೇಳೆಕಾಳುಗಳು, ಅಕ್ಕಿ, ಗೋಧಿ ಮತ್ತು ಮಸೂರಗಳನ್ನು ತಪ್ಪಿಸಿ",
    guide_ekadashi_2:
      "ಅನುಮತಿಸಲಾಗಿದೆ: ಹಣ್ಣುಗಳು, ಬೀಜಗಳು, ಹಾಲು, ಗೆಡ್ಡೆ ತರಕಾರಿಗಳು, ಸಾಬುದಾನ, ಕಲ್ಲು ಉಪ್ಪು (ಸೇಂಧಾ ನಮಕ್)",
    guide_ekadashi_3:
      "ಉಪವಾಸವನ್ನು (ಪಾರಣ) ಮರುದಿನ ಸೂರ್ಯೋದಯದ ನಂತರ ಆದರೆ ದ್ವಾದಶಿ ತಿಥಿ ಮುಗಿಯುವ ಮೊದಲು ಮುರಿಯಿರಿ",
    guide_ekadashi_4: "ನಿರ್ಜಲ ಏಕಾದಶಿ: ಇಡೀ ದಿನ ಆಹಾರ ಅಥವಾ ನೀರಿಲ್ಲ",
    guide_ekadashi_5: "ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಅಥವಾ ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ ಜಪಿಸಿ",
    guide_ekadashi_6:
      "ಹಗಲಿನಲ್ಲಿ ಮಲಗುವುದನ್ನು ತಪ್ಪಿಸಿ – ಸಾಧ್ಯವಾದರೆ ರಾತ್ರಿ ಜಾಗರಣೆಗಾಗಿ ಎಚ್ಚರವಾಗಿರಿ",
    guide_purnima_1: "ಪಂಚಾಮೃತ ಅರ್ಪಣೆಯೊಂದಿಗೆ ಸತ್ಯನಾರಾಯಣ ಕಥೆಯನ್ನು ನಿರ್ವಹಿಸಿ",
    guide_purnima_2:
      "ಉಪವಾಸ ಆಯ್ಕೆಗಳು: ನಿರ್ಜಲ (ನೀರಲ್ಲದೆ), ಫಲಾಹಾರಿ (ಹಣ್ಣು ಮಾತ್ರ), ಅಥವಾ ಒಂದು ಊಟ",
    guide_purnima_3: "ದಾನ (ದಾನ) ನೀಡಿ: ಆಹಾರ, ಬಟ್ಟೆ, ಎಳ್ಳು, ಅಥವಾ ಗೋವುಗಳಿಗೆ ಆಹಾರ",
    guide_purnima_4: "ಕೀರ್ತನೆ ಮತ್ತು ಧ್ಯಾನದೊಂದಿಗೆ ಜಾಗರಣೆ (ರಾತ್ರಿ ಜಾಗರಣೆ) ಆಚರಿಸಿ",
    guide_purnima_5:
      "ಪವಿತ್ರ ನದಿ ಸ್ನಾನ ಮಾಡಿ ಅಥವಾ ಚಂದ್ರೋದಯದ ಸಮಯದಲ್ಲಿ ದೇವಸ್ಥಾನಕ್ಕೆ ಭೇಟಿ ನೀಡಿ",
    guide_purnima_6: "ಶರದ್ ಪೂರ್ಣಿಮಾದಂದು ಖೀರ್ ತಯಾರಿಸಿ ಚಂದ್ರನ ಬೆಳಕಿನಲ್ಲಿ ಇಡಿ",
    guide_amavasya_do_1:
      "ನೀರು, ಎಳ್ಳು ಮತ್ತು ಕುಶ ಹುಲ್ಲಿನೊಂದಿಗೆ ಪಿತೃ ತರ್ಪಣವನ್ನು ನಿರ್ವಹಿಸಿ",
    guide_amavasya_do_2:
      "ಧ್ಯಾನ ಮಾಡಿ – ಕತ್ತಲಾದ ಚಂದ್ರನು ಆಳವಾದ ಆತ್ಮಾವಲೋಕನವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ",
    guide_amavasya_do_3:
      "ಭಗವಾನ್ ಶನಿಗೆ ಸಾಸಿವೆ ಎಣ್ಣೆಯ ದೀಪವನ್ನು ಅರ್ಪಿಸಿ (ವಿಶೇಷವಾಗಿ ಶನಿವಾರದಂದು)",
    guide_amavasya_do_4: "ಸೋಮವತಿ ಅಮಾವಾಸ್ಯೆಯಂದು (ಸೋಮವಾರ) ಅಶ್ವತ್ಥ ಮರದಲ್ಲಿ ಪೂಜಿಸಿ",
    guide_amavasya_dont_1:
      "ಹೊಸ ಉದ್ಯಮಗಳು, ವ್ಯವಹಾರಗಳು ಅಥವಾ ಪ್ರಯಾಣಗಳನ್ನು ಪ್ರಾರಂಭಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ",
    guide_amavasya_dont_2:
      "ಪ್ರಮುಖ ಖರೀದಿಗಳು, ಒಪ್ಪಂದಗಳು ಅಥವಾ ವಿವಾಹಗಳನ್ನು ತಪ್ಪಿಸಿ",
    guide_amavasya_dont_3:
      "ಕೂದಲು ಅಥವಾ ಉಗುರುಗಳನ್ನು ಕತ್ತರಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ (ಸಾಂಪ್ರದಾಯಿಕ ಸೂಚನೆ)",
    guide_amavasya_dont_4:
      "ತಾಮಸಿಕ ಆಹಾರಗಳನ್ನು (ಮಾಂಸ, ಮದ್ಯ, ಹಳಸಿದ ಆಹಾರ) ಸೇವಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ",
    guide_pradosham_1:
      "ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಪೂಜೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ – ಸೂರ್ಯಾಸ್ತದ ಸುತ್ತ 90 ನಿಮಿಷಗಳು",
    guide_pradosham_2:
      "ತುಪ್ಪದ ದೀಪವನ್ನು ಬೆಳಗಿಸಿ ಮತ್ತು ಶಿವಲಿಂಗಕ್ಕೆ ಬಿಲ್ವ ಪತ್ರೆಗಳನ್ನು ಅರ್ಪಿಸಿ",
    guide_pradosham_3: "ಬಿಳಿ ಹೂವುಗಳೊಂದಿಗೆ ಹಾಲು ಅಭಿಷೇಕವನ್ನು ನಿರ್ವಹಿಸಿ",
    guide_pradosham_4: "ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ (108 ಬಾರಿ) ಅಥವಾ ಶ್ರೀ ರುದ್ರಂ ಜಪಿಸಿ",
    guide_pradosham_5: "ಸೂರ್ಯೋದಯದಿಂದ ಉಪವಾಸ ಮಾಡಿ, ಸಂಜೆ ಪೂಜೆಯ ನಂತರ ಮುರಿಯಿರಿ",
    guide_pradosham_6: "ಶನಿ ಪ್ರದೋಷ (ಶನಿವಾರ): ವಿಶೇಷವಾಗಿ ಸಾಡೆ ಸಾತಿ ಪರಿಹಾರಕ್ಕಾಗಿ",
    guide_chaturthi_1:
      "ಸೂರ್ಯೋದಯದಿಂದ ಚಂದ್ರೋದಯದವರೆಗೆ ಉಪವಾಸ ಮಾಡಿ (ಸಂಕಷ್ಟಿ ಚತುರ್ಥಿ)",
    guide_chaturthi_2:
      "ಚಂದ್ರನನ್ನು ನೋಡಿದ ನಂತರ ಮತ್ತು ಪೂಜೆಯನ್ನು ಮಾಡಿದ ನಂತರವೇ ಉಪವಾಸವನ್ನು ಮುರಿಯಿರಿ",
    guide_chaturthi_3:
      "21 ಮೋದಕಗಳು ಮತ್ತು ದುರ್ವಾ ಹುಲ್ಲು (3 ಅಥವಾ 5 ಎಲೆಗಳ ಕಟ್ಟುಗಳು) ಅರ್ಪಿಸಿ",
    guide_chaturthi_4: "ಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ ಅಥವಾ ಓಂ ಗಂ ಗಣಪತಯೇ ನಮಃ ಜಪಿಸಿ",
    guide_chaturthi_5: "ಭಾದ್ರಪದ ಚತುರ್ಥಿ: ಚಂದ್ರನನ್ನು ನೋಡಬೇಡಿ (ಚಂದ್ರ ದೋಷ)",
    guide_chaturthi_6:
      "ಗಣೇಶ ಚತುರ್ಥಿಯಂದು ಆಕಸ್ಮಿಕವಾಗಿ ಚಂದ್ರನನ್ನು ನೋಡಿದರೆ, ಶ್ಯಮಂತಕ ಕಥೆಯನ್ನು ಪಠಿಸಿ",
    viewCalendar: "ಹಬ್ಬಗಳ ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಿಸಿ",
  },
};

// ─── Animation Variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────
function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function formatDateDisplay(dateStr: string, locale: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  const months = isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES;
  return `${d} ${months[m - 1]}`;
}

// ─── Component ───────────────────────────────────────────────────
export default function DateCategoryClient() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const category = (params?.category as string) || "ekadashi";
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: "var(--font-devanagari-heading)" }
    : { fontFamily: "var(--font-heading)" };
  const L = LABELS[locale] || LABELS.en;
  const catLabel =
    CATEGORY_LABELS[category]?.[locale] ||
    CATEGORY_LABELS[category]?.en ||
    category;

  const [year, setYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<FestivalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const storeLat = useLocationStore((s) => s.lat);
  const storeLng = useLocationStore((s) => s.lng);
  const storeTz = useLocationStore((s) => s.timezone);

  // Fetch from the SAME /api/calendar endpoint used by the festival calendar page.
  // Single source of truth  –  no separate tithi table computation.
  // Auto-detect location via IP if store is empty (no hardcoded Delhi fallback).
  useEffect(() => {
    const fetchWithLocation = (lat: number, lng: number, tz: string) => {
      setLoading(true);
      fetch(
        `/api/calendar?year=${year}&lat=${lat}&lon=${lng}&timezone=${encodeURIComponent(tz)}`,
      )
        .then((r) => r.json())
        .then((data) => {
          const all: FestivalEntry[] = data.festivals || [];
          const filtered = all
            .filter((f) => f.category === category)
            .sort((a, b) => a.date.localeCompare(b.date));
          setEntries(filtered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    if (storeLat && storeLng && storeTz) {
      fetchWithLocation(storeLat, storeLng, storeTz);
      return;
    }

    // No location in store — try server-side edge geo via /api/geo (was
    // ipapi.co; replaced after CORS failure May 2026).
    setLoading(true);
    fetchApiGeo()
      .then((data) => {
        if (data && data.latitude !== null && data.longitude !== null) {
          const tz =
            data.timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            "UTC";
          fetchWithLocation(data.latitude, data.longitude, tz);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("[dates] geo lookup failed:", err);
        setLoading(false);
      });
  }, [year, category, storeLat, storeLng, storeTz]);

  // Group by Gregorian month
  const monthlyGroups = useMemo(() => {
    const groups: Record<number, FestivalEntry[]> = {};
    for (let m = 1; m <= 12; m++) groups[m] = [];
    for (const e of entries) {
      const month = parseInt(e.date.split("-")[1], 10);
      if (groups[month]) groups[month].push(e);
    }
    return groups;
  }, [entries]);

  // Find next upcoming date
  const today = new Date().toISOString().slice(0, 10);
  const nextEntry = entries.find((e) => e.date >= today);

  if (!VALID_CATEGORIES.has(category)) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-secondary text-lg">Category not found.</p>
      </div>
    );
  }

  const breadcrumbLD = generateBreadcrumbLD(
    `/${locale}/dates/${category}`,
    locale,
  );

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/calendar"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-light transition-colors mb-6"
          >
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
          {catLabel} {year} – {L.completeDates}
        </motion.h1>

        {/* Year Navigator */}
        <motion.div
          className="flex items-center gap-4 mt-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setYear((y) => y - 1)}
            className="p-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/50 hover:bg-gold-primary/5 transition-all text-text-secondary hover:text-gold-light"
            aria-label="Previous year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            {[year - 1, year, year + 1].map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  y === year
                    ? "bg-gold-primary/20 text-gold-light border border-gold-primary/40"
                    : "text-text-secondary hover:text-gold-light hover:bg-gold-primary/5"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <button
            onClick={() => setYear((y) => y + 1)}
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
                <span className="text-text-primary font-semibold">
                  {entries.length}
                </span>
                <span className="text-text-secondary">
                  {catLabel} {L.total} {year}
                </span>
              </div>
              {nextEntry && year === new Date().getFullYear() && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">
                    {L.next}: {formatDateDisplay(nextEntry.date, locale)}
                  </span>
                </div>
              )}
              {/* Follow button for this vrat category */}
              <VratFollowButton
                slug={category as string}
                name={catLabel}
                size="sm"
              />
            </motion.div>

            {/* Month Quick Nav */}
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <span className="text-text-secondary text-sm self-center mr-1">
                {L.jumpTo}:
              </span>
              {MONTH_NAMES.map((m, idx) => {
                const count = monthlyGroups[idx + 1]?.length || 0;
                return (
                  <a
                    key={m}
                    href={`#month-${idx + 1}`}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      count > 0
                        ? "bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20 border border-gold-primary/15"
                        : "bg-bg-secondary/50 text-text-secondary/50 cursor-default border border-transparent"
                    }`}
                  >
                    {(isDevanagariLocale(locale)
                      ? MONTH_NAMES_HI
                      : MONTH_NAMES)[idx].slice(0, 3)}
                    {count > 0 && (
                      <span className="ml-1 text-gold-primary/70">
                        ({count})
                      </span>
                    )}
                  </a>
                );
              })}
            </motion.div>

            <GoldDivider className="mb-10" />

            {/* Monthly Sections */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const monthEntries = monthlyGroups[month] || [];
              const monthName = (
                isDevanagariLocale(locale) ? MONTH_NAMES_HI : MONTH_NAMES
              )[month - 1];

              return (
                <motion.section
                  key={month}
                  id={`month-${month}`}
                  className="mb-10"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={0}
                >
                  <h2
                    className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2"
                    style={headingFont}
                  >
                    {month % 2 === 0 ? (
                      <Moon className="w-5 h-5 text-gold-primary/60" />
                    ) : (
                      <Sun className="w-5 h-5 text-gold-primary/60" />
                    )}
                    {monthName} {year}
                    <span className="text-sm font-normal text-text-secondary ml-2">
                      ({monthEntries.length} {catLabel})
                    </span>
                  </h2>

                  {monthEntries.length === 0 ? (
                    <p className="text-text-secondary text-sm italic pl-7">
                      {L.noEntries}
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gold-primary/10 bg-bg-secondary/50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gold-primary/10 text-text-secondary">
                            <th className="text-left px-4 py-3 font-medium">
                              {L.date}
                            </th>
                            <th className="text-left px-4 py-3 font-medium">
                              {L.day}
                            </th>
                            <th className="text-left px-4 py-3 font-medium">
                              {L.name}
                            </th>
                            <th className="text-left px-4 py-3 font-medium">
                              {L.timings}
                            </th>
                            <th className="text-left px-4 py-3 font-medium">
                              {L.paksha}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthEntries.map((entry, idx) => {
                            const dow = getDayOfWeek(entry.date);
                            const dayName = isDevanagariLocale(locale)
                              ? DAY_NAMES_SHORT_HI[dow]
                              : DAY_NAMES_SHORT[dow];
                            const isUpcoming =
                              entry.date >= today &&
                              entry.date === nextEntry?.date;
                            // Timings: use ekadashi-specific fields if available, otherwise show date
                            const timingStart = entry.ekadashiStart || "";
                            const timingEnd = entry.ekadashiEnd || "";
                            const timingDisplay =
                              timingStart && timingEnd
                                ? `${timingStart}  –  ${timingEnd}`
                                : " – ";
                            const paksha = entry.paksha || "";
                            return (
                              <motion.tr
                                key={`${entry.date}-${paksha}-${idx}`}
                                className={`border-b border-gold-primary/5 transition-colors hover:bg-gold-primary/5 ${
                                  isUpcoming ? "bg-emerald-500/5" : ""
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
                                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                                  {dayName}
                                </td>
                                <td className="px-4 py-3 text-text-primary font-medium">
                                  {tl(entry.name, locale)}
                                </td>
                                <td className="px-4 py-3 text-text-secondary whitespace-nowrap font-mono text-xs">
                                  {timingDisplay}
                                </td>
                                <td className="px-4 py-3">
                                  {paksha && (
                                    <span
                                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                        paksha === "shukla"
                                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                                          : "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                                      }`}
                                    >
                                      {paksha === "shukla"
                                        ? L.shukla
                                        : L.krishna}
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
                {L[
                  `about${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof L
                ] || `About ${catLabel}`}
              </h2>
              <div className="space-y-4 max-w-3xl">
                {[1, 2, 3, 4].map((n) => {
                  const key =
                    `about${category.charAt(0).toUpperCase() + category.slice(1)}Text${n}` as keyof typeof L;
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
                  <h3
                    className="text-lg font-bold text-gold-light"
                    style={headingFont}
                  >
                    {L[`guideTitle_${category}` as keyof typeof L] || ""}
                  </h3>
                </div>
                <div className="px-5 py-4">
                  {category === "amavasya" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                          {locale === "hi" ? "क्या करें" : "Do"}
                        </h4>
                        <ul className="space-y-2">
                          {[1, 2, 3, 4].map((n) => {
                            const text =
                              L[`guide_amavasya_do_${n}` as keyof typeof L];
                            return text ? (
                              <li
                                key={n}
                                className="flex items-start gap-2 text-sm text-text-secondary"
                              >
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                {text}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                          {locale === "hi" ? "क्या न करें" : "Don't"}
                        </h4>
                        <ul className="space-y-2">
                          {[1, 2, 3, 4].map((n) => {
                            const text =
                              L[`guide_amavasya_dont_${n}` as keyof typeof L];
                            return text ? (
                              <li
                                key={n}
                                className="flex items-start gap-2 text-sm text-text-secondary"
                              >
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
                      {[1, 2, 3, 4, 5, 6].map((n) => {
                        const text =
                          L[`guide_${category}_${n}` as keyof typeof L];
                        return text ? (
                          <li
                            key={n}
                            className="flex items-start gap-2.5 text-sm text-text-secondary"
                          >
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

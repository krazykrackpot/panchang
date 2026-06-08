'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { SIGN_LORDS, EXALTATION_SIGNS, DEBILITATION_SIGNS } from '@/lib/constants/dignities';
import { tl } from '@/lib/utils/trilingual';
import { Link } from '@/lib/i18n/navigation';
import { pickByLocale } from "@/lib/utils/locale-fonts";

/* ──────────────────────────────────────────────────────────────────────────
 * LABELS — inline i18n for this page
 * ────────────────────────────────────────────────────────────────────────── */
const LABELS = {
  title: { en: 'Planet Lordship & Karakas', hi: 'ग्रह स्वामित्व एवं कारक', ta: 'கிரக அதிபத்தியம் & காரகங்கள்', bn: 'গ্রহ স্বামিত্ব ও কারক' },
  subtitle: { en: 'A complete reference for sign lordship, dignities, natural house karakas, and functional status per lagna.', hi: 'राशि स्वामित्व, गरिमा, प्राकृतिक भाव कारक और लग्नानुसार कार्यात्मक स्थिति का सम्पूर्ण संदर्भ।', ta: 'ராசி அதிபத்தியம், கௌரவங்கள், இயற்கை பாவ காரகங்கள், மற்றும் லக்னம் வாரியான செயல்பாட்டு நிலை பற்றிய முழுமையான குறிப்பு.', bn: 'রাশি স্বামিত্ব, মর্যাদা, প্রাকৃতিক ভাব কারক এবং লগ্ন অনুসারে কার্যকরী অবস্থানের সম্পূর্ণ তথ্যসূত্র।' },
  signLordshipTitle: { en: 'Sign Lordship Table', hi: 'राशि स्वामित्व सारणी', ta: 'ராசி அதிபத்திய அட்டவணை', bn: 'রাশি স্বামিত্ব সারণী' },
  signLordshipDesc: { en: 'Each of the 12 signs is ruled by one of the seven visible planets. This lordship determines which planet "owns" a house in your chart.', hi: 'प्रत्येक 12 राशि का स्वामी सात दृश्य ग्रहों में से एक है। यह स्वामित्व निर्धारित करता है कि आपकी कुण्डली में कौन सा ग्रह किस भाव का "मालिक" है।', ta: 'ஒவ்வொரு 12 ராசிகளும் ஏழு கிரகங்களில் ஒன்றால் ஆளப்படுகின்றன. இந்த அதிபத்தியம் உங்கள் ஜாதகத்தில் எந்த கிரகம் எந்த பாவத்தை "சொந்தமாக" கொண்டுள்ளது என்பதை தீர்மானிக்கிறது.', bn: 'প্রতিটি 12 রাশি সাতটি দৃশ্যমান গ্রহের একটি দ্বারা শাসিত। এই স্বামিত্ব নির্ধারণ করে আপনার জাতকে কোন গ্রহ কোন ভাবের "মালিক"।' },
  colSign: { en: 'Sign', hi: 'राशि', ta: 'ராசி', bn: 'রাশি' },
  colLord: { en: 'Lord', hi: 'स्वामी', ta: 'அதிபதி', bn: 'স্বামী' },
  colNature: { en: 'Lord Nature', hi: 'स्वामी स्वभाव', ta: 'அதிபதி இயல்பு', bn: 'স্বামী স্বভাব' },
  colExalted: { en: 'Exalted Here', hi: 'उच्च ग्रह', ta: 'உச்சம் இங்கே', bn: 'উচ্চ গ্রহ' },
  colDebilitated: { en: 'Debilitated Here', hi: 'नीच ग्रह', ta: 'நீசம் இங்கே', bn: 'নীচ গ্রহ' },
  houseKarakaTitle: { en: 'Natural House Karakas', hi: 'प्राकृतिक भाव कारक', ta: 'இயற்கை பாவ காரகங்கள்', bn: 'প্রাকৃতিক ভাব কারক' },
  houseKarakaDesc: { en: 'Each house has a natural significator (karaka) — the planet whose inherent nature aligns with that house\'s significations. The karaka acts as a secondary ruler regardless of which sign occupies the house.', hi: 'प्रत्येक भाव का एक प्राकृतिक कारक होता है — वह ग्रह जिसका स्वाभाविक स्वभाव उस भाव के अर्थों से मेल खाता है।', ta: 'ஒவ்வொரு பாவத்திற்கும் ஒரு இயற்கை காரகம் உள்ளது — அந்த பாவத்தின் குறிப்பீடுகளுடன் ஒத்துவரும் கிரகம்.', bn: 'প্রতিটি ভাবের একটি প্রাকৃতিক কারক আছে — সেই গ্রহ যার স্বভাব ভাবের অর্থের সাথে মেলে।' },
  colHouse: { en: 'House', hi: 'भाव', ta: 'பாவம்', bn: 'ভাব' },
  colKaraka: { en: 'Karaka', hi: 'कारक', ta: 'காரகம்', bn: 'কারক' },
  colSignifies: { en: 'Signifies', hi: 'अर्थ', ta: 'குறிப்பீடுகள்', bn: 'অর্থ' },
  functionalTitle: { en: 'Functional Status Per Lagna', hi: 'लग्नानुसार कार्यात्मक स्थिति', ta: 'லக்னம் வாரியான செயல்பாட்டு நிலை', bn: 'লগ্ন অনুসারে কার্যকরী অবস্থা' },
  functionalDesc: { en: 'A planet\'s functional role changes based on which houses it lords from the ascendant. A natural benefic can become a functional malefic, and vice versa. Select your lagna below.', hi: 'ग्रह की कार्यात्मक भूमिका लग्न से उसके भाव स्वामित्व पर निर्भर करती है। एक नैसर्गिक शुभ ग्रह कार्यात्मक पापी बन सकता है और इसके विपरीत।', ta: 'ஒரு கிரகத்தின் செயல்பாட்டுப் பங்கு லக்னத்திலிருந்து எந்த பாவங்களை ஆள்கிறது என்பதைப் பொறுத்து மாறுகிறது.', bn: 'একটি গ্রহের কার্যকরী ভূমিকা লগ্ন থেকে কোন ভাবগুলি শাসন করে তার উপর নির্ভর করে।' },
  selectLagna: { en: 'Select Lagna', hi: 'लग्न चुनें', ta: 'லக்னம் தேர்வு செய்யவும்', bn: 'লগ্ন নির্বাচন করুন' },
  yogakaraka: { en: 'Yogakaraka', hi: 'योगकारक', ta: 'யோககாரகம்', bn: 'যোগকারক' },
  benefics: { en: 'Functional Benefics', hi: 'कार्यात्मक शुभ ग्रह', ta: 'செயல்பாட்டு சுபகிரகங்கள்', bn: 'কার্যকরী শুভ গ্রহ' },
  malefics: { en: 'Functional Malefics', hi: 'कार्यात्मक पापी ग्रह', ta: 'செயல்பாட்டு பாபகிரகங்கள்', bn: 'কার্যকরী পাপ গ্রহ' },
  neutrals: { en: 'Neutral', hi: 'तटस्थ ग्रह', ta: 'நடுநிலை', bn: 'নিরপেক্ষ গ্রহ' },
  howToUseTitle: { en: 'How Lordship Affects Your Chart', hi: 'स्वामित्व आपकी कुण्डली को कैसे प्रभावित करता है', ta: 'அதிபத்தியம் உங்கள் ஜாதகத்தை எவ்வாறு பாதிக்கிறது', bn: 'স্বামিত্ব আপনার জাতককে কীভাবে প্রভাবিত করে' },
  howToUse1: { en: 'Lordship is the backbone of chart interpretation. When you see a planet in a house, ask two questions: (1) Which houses does this planet lord? (2) What is the functional nature of those houses for my lagna?', hi: 'स्वामित्व कुण्डली व्याख्या की रीढ़ है। जब आप किसी भाव में ग्रह देखें, तो दो प्रश्न पूछें: (1) यह ग्रह किन भावों का स्वामी है? (2) मेरे लग्न के लिए उन भावों की कार्यात्मक प्रकृति क्या है?', ta: 'அதிபத்தியம் ஜாதக விளக்கத்தின் முதுகெலும்பு. ஒரு பாவத்தில் கிரகத்தைக் காணும்போது, இரண்டு கேள்விகளைக் கேளுங்கள்: (1) இந்த கிரகம் எந்த பாவங்களை ஆள்கிறது? (2) என் லக்னத்திற்கு அந்த பாவங்களின் செயல்பாட்டு இயல்பு என்ன?', bn: 'স্বামিত্ব জাতক ব্যাখ্যার মেরুদণ্ড। যখন একটি ভাবে গ্রহ দেখবেন, দুটি প্রশ্ন করুন: (1) এই গ্রহ কোন ভাবগুলির স্বামী? (2) আমার লগ্নের জন্য সেই ভাবগুলির কার্যকরী প্রকৃতি কী?' },
  howToUse2: { en: 'A 9th lord (trikona — fortune) placed in the 10th house (kendra — career) creates a powerful Raja Yoga. But a 6th lord (dusthana — enemies/disease) in the 7th house (kendra — marriage) brings conflict to partnerships.', hi: '9वें भाव का स्वामी (त्रिकोण — भाग्य) 10वें भाव (केन्द्र — कर्म) में स्थित हो तो शक्तिशाली राजयोग बनता है। लेकिन 6ठे भाव का स्वामी (दुःस्थान — शत्रु/रोग) 7वें भाव (केन्द्र — विवाह) में साझेदारी में संघर्ष लाता है।', ta: '9வது அதிபதி (திரிகோணம் — பாக்கியம்) 10வது பாவத்தில் (கேந்திரம் — தொழில்) இருந்தால் சக்திவாய்ந்த ராஜயோகம் உருவாகிறது. ஆனால் 6வது அதிபதி (துஷ்டானம் — எதிரிகள்/நோய்) 7வது பாவத்தில் (கேந்திரம் — திருமணம்) இருந்தால் கூட்டாண்மையில் மோதல் வருகிறது.', bn: '9ম ভাবের স্বামী (ত্রিকোণ — ভাগ্য) 10ম ভাবে (কেন্দ্র — কর্ম) স্থিত হলে শক্তিশালী রাজযোগ হয়। কিন্তু 6ষ্ঠ ভাবের স্বামী (দুঃস্থান — শত্রু/রোগ) 7ম ভাবে (কেন্দ্র — বিবাহ) থাকলে অংশীদারিত্বে সংঘর্ষ আনে।' },
  howToUse3: { en: 'The Yogakaraka planet is the single most beneficial planet for a lagna because it lords both a kendra and a trikona simultaneously. For Taurus lagna, Saturn lords the 9th (Capricorn) and 10th (Aquarius), making it the yogakaraka. Strengthening the yogakaraka through remedies and timing activities during its dasha brings the best results.', hi: 'योगकारक ग्रह लग्न के लिए सबसे लाभकारी ग्रह है क्योंकि यह एक साथ केन्द्र और त्रिकोण दोनों का स्वामी होता है। वृषभ लग्न के लिए शनि 9वें (मकर) और 10वें (कुम्भ) का स्वामी है, इसलिए योगकारक है।', ta: 'யோககாரக கிரகம் ஒரு லக்னத்திற்கு மிகவும் நன்மை பயக்கும் கிரகம், ஏனெனில் அது ஒரே நேரத்தில் கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆள்கிறது.', bn: 'যোগকারক গ্রহ লগ্নের জন্য সবচেয়ে উপকারী গ্রহ কারণ এটি একই সাথে কেন্দ্র ও ত্রিকোণ উভয়ের স্বামী।' },
  none: { en: 'None', hi: 'कोई नहीं', ta: 'இல்லை', bn: 'নেই' },
  because: { en: 'because', hi: 'क्योंकि', ta: 'ஏனெனில்', bn: 'কারণ' },
} as const;

/* ──────────────────────────────────────────────────────────────────────────
 * Planet nature descriptions (for sign lordship table)
 * ────────────────────────────────────────────────────────────────────────── */
const PLANET_NATURES: Record<number, { en: string; hi: string; ta: string; bn: string }> = {
  0: { en: 'Soul, authority, vitality', hi: 'आत्मा, अधिकार, प्राणशक्ति', ta: 'ஆன்மா, அதிகாரம், உயிர்ச்சக்தி', bn: 'আত্মা, কর্তৃত্ব, প্রাণশক্তি' },
  1: { en: 'Mind, emotions, nurture', hi: 'मन, भावनाएँ, पोषण', ta: 'மனம், உணர்வுகள், பராமரிப்பு', bn: 'মন, আবেগ, পরিচর্যা' },
  2: { en: 'Courage, energy, action', hi: 'साहस, ऊर्जा, कर्म', ta: 'தைரியம், ஆற்றல், செயல்', bn: 'সাহস, শক্তি, কর্ম' },
  3: { en: 'Intellect, speech, trade', hi: 'बुद्धि, वाणी, व्यापार', ta: 'அறிவு, பேச்சு, வணிகம்', bn: 'বুদ্ধি, বাণী, ব্যবসা' },
  4: { en: 'Wisdom, expansion, dharma', hi: 'ज्ञान, विस्तार, धर्म', ta: 'ஞானம், விரிவாக்கம், தர்மம்', bn: 'জ্ঞান, সম্প্রসারণ, ধর্ম' },
  5: { en: 'Beauty, luxury, love', hi: 'सौन्दर्य, विलास, प्रेम', ta: 'அழகு, ஆடம்பரம், காதல்', bn: 'সৌন্দর্য, বিলাস, প্রেম' },
  6: { en: 'Discipline, endurance, karma', hi: 'अनुशासन, धैर्य, कर्म', ta: 'ஒழுக்கம், பொறுமை, கர்மம்', bn: 'শৃঙ্খলা, ধৈর্য, কর্ম' },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Natural House Karakas (BPHS)
 * ────────────────────────────────────────────────────────────────────────── */
const HOUSE_KARAKAS: {
  house: number;
  karakaIds: number[];
  signifies: { en: string; hi: string; ta: string; bn: string };
}[] = [
  { house: 1,  karakaIds: [0],    signifies: { en: 'Self, body, personality, health', hi: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य', ta: 'சுயம், உடல், ஆளுமை, ஆரோக்கியம்', bn: 'আত্ম, শরীর, ব্যক্তিত্ব, স্বাস্থ্য' } },
  { house: 2,  karakaIds: [4],    signifies: { en: 'Wealth, family, speech, food', hi: 'धन, परिवार, वाणी, भोजन', ta: 'செல்வம், குடும்பம், பேச்சு, உணவு', bn: 'ধন, পরিবার, বাণী, খাদ্য' } },
  { house: 3,  karakaIds: [2],    signifies: { en: 'Courage, siblings, short travel, communication', hi: 'साहस, भाई-बहन, लघु यात्रा, संवाद', ta: 'தைரியம், உடன்பிறப்புகள், குறுகிய பயணம்', bn: 'সাহস, ভাই-বোন, স্বল্প ভ্রমণ' } },
  { house: 4,  karakaIds: [1],    signifies: { en: 'Mother, home, happiness, vehicles, land', hi: 'माता, गृह, सुख, वाहन, भूमि', ta: 'தாய், வீடு, மகிழ்ச்சி, வாகனங்கள், நிலம்', bn: 'মাতা, গৃহ, সুখ, যানবাহন, ভূমি' } },
  { house: 5,  karakaIds: [4],    signifies: { en: 'Children, intelligence, creativity, purva punya', hi: 'सन्तान, बुद्धि, रचनात्मकता, पूर्वपुण्य', ta: 'குழந்தைகள், அறிவு, படைப்பாற்றல்', bn: 'সন্তান, বুদ্ধি, সৃজনশীলতা' } },
  { house: 6,  karakaIds: [6, 2], signifies: { en: 'Enemies, disease, debt, service, litigation', hi: 'शत्रु, रोग, ऋण, सेवा, मुकदमा', ta: 'எதிரிகள், நோய், கடன், சேவை', bn: 'শত্রু, রোগ, ঋণ, সেবা' } },
  { house: 7,  karakaIds: [5],    signifies: { en: 'Marriage, partnerships, business, public image', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि', ta: 'திருமணம், கூட்டாண்மை, வணிகம்', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা' } },
  { house: 8,  karakaIds: [6],    signifies: { en: 'Longevity, transformation, occult, inheritance', hi: 'आयु, रूपान्तरण, गूढ़ विद्या, विरासत', ta: 'ஆயுள், உருமாற்றம், மறைவிஞ்ஞானம்', bn: 'আয়ু, রূপান্তর, গূঢ় বিদ্যা' } },
  { house: 9,  karakaIds: [4],    signifies: { en: 'Father, dharma, fortune, higher learning, pilgrimage', hi: 'पिता, धर्म, भाग्य, उच्च शिक्षा, तीर्थ', ta: 'தந்தை, தர்மம், பாக்கியம், உயர்கல்வி', bn: 'পিতা, ধর্ম, ভাগ্য, উচ্চশিক্ষা' } },
  { house: 10, karakaIds: [0, 3], signifies: { en: 'Career, status, karma, authority, public life', hi: 'कर्म, पद, कार्य, अधिकार, सार्वजनिक जीवन', ta: 'தொழில், பதவி, கர்மம், அதிகாரம்', bn: 'কর্ম, পদ, কার্য, কর্তৃত্ব' } },
  { house: 11, karakaIds: [4],    signifies: { en: 'Gains, aspirations, elder siblings, social networks', hi: 'लाभ, आकांक्षाएँ, बड़े भाई-बहन, सामाजिक नेटवर्क', ta: 'லாபம், விருப்பங்கள், மூத்த உடன்பிறப்புகள்', bn: 'লাভ, আকাঙ্ক্ষা, বড় ভাই-বোন' } },
  { house: 12, karakaIds: [6, 8], signifies: { en: 'Losses, moksha, foreign lands, expenses, sleep', hi: 'हानि, मोक्ष, विदेश, व्यय, निद्रा', ta: 'இழப்புகள், மோட்சம், வெளிநாடு, செலவுகள்', bn: 'ক্ষতি, মোক্ষ, বিদেশ, ব্যয়' } },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Functional benefic/malefic per lagna (BPHS Ch.34)
 *
 * Each entry: yogakaraka (planet ID or null), benefics, malefics, neutrals
 * with reason strings explaining WHY.
 * ────────────────────────────────────────────────────────────────────────── */
interface FunctionalEntry {
  yogakaraka: number | null;
  yogakarakaReason: { en: string; hi: string; ta: string; bn: string };
  benefics: { id: number; reason: { en: string; hi: string; ta: string; bn: string } }[];
  malefics: { id: number; reason: { en: string; hi: string; ta: string; bn: string } }[];
  neutrals: { id: number; reason: { en: string; hi: string; ta: string; bn: string } }[];
}

// Helper to build reason strings concisely
const r = (en: string, hi: string, ta: string, bn: string) => ({ en, hi, ta, bn });

const FUNCTIONAL_STATUS: Record<number, FunctionalEntry> = {
  // 1 = Aries lagna
  1: {
    yogakaraka: null,
    yogakarakaReason: r('No single planet lords both a kendra and trikona', 'कोई एक ग्रह केन्द्र और त्रिकोण दोनों का स्वामी नहीं', 'ஒரே கிரகம் கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆளவில்லை', 'একটি গ্রহও কেন্দ্র ও ত্রিকোণ উভয়ের স্বামী নয়'),
    benefics: [
      { id: 0, reason: r('Lords 5th (Leo) — trikona lord', '5वें भाव (सिंह) का स्वामी — त्रिकोण', '5வது பாவ (சிம்மம்) அதிபதி — திரிகோணம்', '5ম ভাব (সিংহ) স্বামী — ত্রিকোণ') },
      { id: 4, reason: r('Lords 9th (Sagittarius) — trikona lord', '9वें भाव (धनु) का स्वामी — त्रिकोण', '9வது பாவ (தனுசு) அதிபதி — திரிகோணம்', '9ম ভাব (ধনু) স্বামী — ত্রিকোণ') },
    ],
    malefics: [
      { id: 3, reason: r('Lords 3rd & 6th — dusthana lord', '3रे और 6ठे भाव का स्वामी — दुःस्थान', '3வது & 6வது பாவ அதிபதி — துஷ்டானம்', '3য় ও 6ষ্ঠ ভাব স্বামী — দুঃস্থান') },
      { id: 5, reason: r('Lords 2nd (maraka) & 7th (maraka + kendra)', '2रे (मारक) और 7वें (मारक + केन्द्र) का स्वामी', '2வது (மாரகம்) & 7வது (மாரகம் + கேந்திரம்) அதிபதி', '2য় (মারক) ও 7ম (মারক + কেন্দ্র) স্বামী') },
      { id: 6, reason: r('Lords 10th & 11th — kendra lord who is a natural malefic', '10वें और 11वें का स्वामी — नैसर्गिक पापी केन्द्र स्वामी', '10வது & 11வது அதிபதி — இயற்கை பாபி கேந்திர அதிபதி', '10ম ও 11শ স্বামী — প্রাকৃতিক পাপী কেন্দ্র স্বামী') },
    ],
    neutrals: [
      { id: 2, reason: r('Lagna lord — always beneficial but also 8th lord', 'लग्नेश — सदैव शुभ पर 8वें का भी स्वामी', 'லக்னாதிபதி — எப்போதும் நன்மை ஆனால் 8வது அதிபதியும்', 'লগ্নেশ — সর্বদা শুভ তবে 8ম ভাবেরও স্বামী') },
      { id: 1, reason: r('Lords 4th (kendra) — neutral as a natural benefic in kendra', '4थे (केन्द्र) का स्वामी — केन्द्र में नैसर्गिक शुभ तटस्थ', '4வது (கேந்திரம்) அதிபதி — கேந்திரத்தில் இயற்கை சுபம் நடுநிலை', '4র্থ (কেন্দ্র) স্বামী — কেন্দ্রে প্রাকৃতিক শুভ নিরপেক্ষ') },
    ],
  },
  // 2 = Taurus lagna
  2: {
    yogakaraka: 6,
    yogakarakaReason: r('Saturn lords 9th (Capricorn, trikona) and 10th (Aquarius, kendra)', 'शनि 9वें (मकर, त्रिकोण) और 10वें (कुम्भ, केन्द्र) का स्वामी', 'சனி 9வது (மகரம், திரிகோணம்) மற்றும் 10வது (கும்பம், கேந்திரம்) அதிபதி', 'শনি 9ম (মকর, ত্রিকোণ) ও 10ম (কুম্ভ, কেন্দ্র) স্বামী'),
    benefics: [
      { id: 6, reason: r('Yogakaraka — lords 9th & 10th', 'योगकारक — 9वें और 10वें का स्वामी', 'யோககாரகம் — 9வது & 10வது அதிபதி', 'যোগকারক — 9ম ও 10ম স্বামী') },
      { id: 0, reason: r('Lords 4th (Leo) — kendra lord', '4थे (सिंह) का स्वामी — केन्द्र', '4வது (சிம்மம்) அதிபதி — கேந்திரம்', '4র্থ (সিংহ) স্বামী — কেন্দ্র') },
      { id: 3, reason: r('Lords 2nd & 5th (trikona)', '2रे और 5वें (त्रिकोण) का स्वामी', '2வது & 5வது (திரிகோணம்) அதிபதி', '2য় ও 5ম (ত্রিকোণ) স্বামী') },
    ],
    malefics: [
      { id: 4, reason: r('Lords 8th & 11th — dusthana', '8वें और 11वें का स्वामी — दुःस्थान', '8வது & 11வது அதிபதி — துஷ்டானம்', '8ম ও 11শ স্বামী — দুঃস্থান') },
      { id: 2, reason: r('Lords 7th (maraka) & 12th (loss)', '7वें (मारक) और 12वें (हानि) का स्वामी', '7வது (மாரகம்) & 12வது (இழப்பு) அதிபதி', '7ম (মারক) ও 12শ (ক্ষতি) স্বামী') },
    ],
    neutrals: [
      { id: 5, reason: r('Lagna lord — always auspicious', 'लग्नेश — सदैव शुभ', 'லக்னாதிபதி — எப்போதும் சுபம்', 'লগ্নেশ — সর্বদা শুভ') },
      { id: 1, reason: r('Lords 3rd — mild dusthana but natural benefic', '3रे का स्वामी — हल्का दुःस्थान पर नैसर्गिक शुभ', '3வது அதிபதி — மென்மையான துஷ்டானம்', '3য় স্বামী — মৃদু দুঃস্থান') },
    ],
  },
  // 3 = Gemini lagna
  3: {
    yogakaraka: null,
    yogakarakaReason: r('No single planet lords both a kendra and trikona', 'कोई एक ग्रह केन्द्र और त्रिकोण दोनों का स्वामी नहीं', 'ஒரே கிரகம் கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆளவில்லை', 'একটি গ্রহও কেন্দ্র ও ত্রিকোণ উভয়ের স্বামী নয়'),
    benefics: [
      { id: 5, reason: r('Lords 5th (Libra, trikona) & 12th', '5वें (तुला, त्रिकोण) और 12वें का स्वामी', '5வது (துலாம், திரிகோணம்) & 12வது அதிபதி', '5ম (তুলা, ত্রিকোণ) ও 12শ স্বামী') },
      { id: 6, reason: r('Lords 8th & 9th (trikona)', '8वें और 9वें (त्रिकोण) का स्वामी', '8வது & 9வது (திரிகோணம்) அதிபதி', '8ম ও 9ম (ত্রিকোণ) স্বামী') },
    ],
    malefics: [
      { id: 2, reason: r('Lords 6th & 11th — dusthana + upachaya', '6ठे और 11वें का स्वामी — दुःस्थान', '6வது & 11வது அதிபதி — துஷ்டானம்', '6ষ্ঠ ও 11শ স্বামী — দুঃস্থান') },
      { id: 0, reason: r('Lords 3rd — dusthana', '3रे का स्वामी — दुःस्थान', '3வது அதிபதி — துஷ்டானம்', '3য় স্বামী — দুঃস্থান') },
    ],
    neutrals: [
      { id: 3, reason: r('Lagna lord (1st & 4th) — always auspicious', 'लग्नेश (1 और 4) — सदैव शुभ', 'லக்னாதிபதி (1 & 4) — எப்போதும் சுபம்', 'লগ্নেশ (1ম ও 4র্থ) — সর্বদা শুভ') },
      { id: 4, reason: r('Lords 7th (kendra) & 10th (kendra)', '7वें (केन्द्र) और 10वें (केन्द्र) का स्वामी', '7வது (கேந்திரம்) & 10வது (கேந்திரம்) அதிபதி', '7ম (কেন্দ্র) ও 10ম (কেন্দ্র) স্বামী') },
      { id: 1, reason: r('Lords 2nd — neutral maraka', '2रे का स्वामी — तटस्थ मारक', '2வது அதிபதி — நடுநிலை மாரகம்', '2য় স্বামী — নিরপেক্ষ মারক') },
    ],
  },
  // 4 = Cancer lagna
  4: {
    yogakaraka: 2,
    yogakarakaReason: r('Mars lords 5th (Scorpio, trikona) and 10th (Aries, kendra)', 'मंगल 5वें (वृश्चिक, त्रिकोण) और 10वें (मेष, केन्द्र) का स्वामी', 'செவ்வாய் 5வது (விருச்சிகம், திரிகோணம்) மற்றும் 10வது (மேஷம், கேந்திரம்) அதிபதி', 'মঙ্গল 5ম (বৃশ্চিক, ত্রিকোণ) ও 10ম (মেষ, কেন্দ্র) স্বামী'),
    benefics: [
      { id: 2, reason: r('Yogakaraka — lords 5th & 10th', 'योगकारक — 5वें और 10वें का स्वामी', 'யோககாரகம் — 5வது & 10வது அதிபதி', 'যোগকারক — 5ম ও 10ম স্বামী') },
      { id: 4, reason: r('Lords 6th & 9th — trikona lord outweighs dusthana', '6ठे और 9वें का स्वामी — त्रिकोण प्रबल', '6வது & 9வது அதிபதி — திரிகோணம் மேலோங்கும்', '6ষ্ঠ ও 9ম স্বামী — ত্রিকোণ প্রবল') },
    ],
    malefics: [
      { id: 5, reason: r('Lords 4th (kendra) & 11th — natural benefic in kendra loses strength, 11th is trishadaya', '4थे (केन्द्र) और 11वें का स्वामी', '4வது (கேந்திரம்) & 11வது அதிபதி', '4র্থ (কেন্দ্র) ও 11শ স্বামী') },
      { id: 3, reason: r('Lords 3rd & 12th — dusthana', '3रे और 12वें का स्वामी — दुःस्थान', '3வது & 12வது அதிபதி — துஷ்டானம்', '3য় ও 12শ স্বামী — দুঃস্থান') },
      { id: 6, reason: r('Lords 7th (maraka) & 8th (dusthana)', '7वें (मारक) और 8वें (दुःस्थान) का स्वामी', '7வது (மாரகம்) & 8வது (துஷ்டானம்) அதிபதி', '7ম (মারক) ও 8ম (দুঃস্থান) স্বামী') },
    ],
    neutrals: [
      { id: 1, reason: r('Lagna lord — always auspicious', 'लग्नेश — सदैव शुभ', 'லக்னாதிபதி — எப்போதும் சுபம்', 'লগ্নেশ — সর্বদা শুভ') },
      { id: 0, reason: r('Lords 2nd — neutral maraka', '2रे का स्वामी — तटस्थ मारक', '2வது அதிபதி — நடுநிலை மாரகம்', '2য় স্বামী — নিরপেক্ষ মারক') },
    ],
  },
  // 5 = Leo lagna
  5: {
    yogakaraka: 2,
    yogakarakaReason: r('Mars lords 4th (Scorpio, kendra) and 9th (Aries, trikona)', 'मंगल 4थे (वृश्चिक, केन्द्र) और 9वें (मेष, त्रिकोण) का स्वामी', 'செவ்வாய் 4வது (விருச்சிகம், கேந்திரம்) மற்றும் 9வது (மேஷம், திரிகோணம்) அதிபதி', 'মঙ্গল 4র্থ (বৃশ্চিক, কেন্দ্র) ও 9ম (মেষ, ত্রিকোণ) স্বামী'),
    benefics: [
      { id: 2, reason: r('Yogakaraka — lords 4th & 9th', 'योगकारक — 4थे और 9वें का स्वामी', 'யோககாரகம் — 4வது & 9வது அதிபதி', 'যোগকারক — 4র্থ ও 9ম স্বামী') },
      { id: 4, reason: r('Lords 5th (Sagittarius, trikona) & 8th', '5वें (धनु, त्रिकोण) और 8वें का स्वामी', '5வது (தனுசு, திரிகோணம்) & 8வது அதிபதி', '5ম (ধনু, ত্রিকোণ) ও 8ম স্বামী') },
    ],
    malefics: [
      { id: 3, reason: r('Lords 2nd (maraka) & 11th (trishadaya)', '2रे (मारक) और 11वें का स्वामी', '2வது (மாரகம்) & 11வது அதிபதி', '2য় (মারক) ও 11শ স্বামী') },
      { id: 5, reason: r('Lords 3rd & 10th — natural benefic in kendra + trishadaya', '3रे और 10वें का स्वामी', '3வது & 10வது அதிபதி', '3য় ও 10ম স্বামী') },
      { id: 6, reason: r('Lords 6th (dusthana) & 7th (maraka)', '6ठे (दुःस्थान) और 7वें (मारक) का स्वामी', '6வது (துஷ்டானம்) & 7வது (மாரகம்) அதிபதி', '6ষ্ঠ (দুঃস্থান) ও 7ম (মারক) স্বামী') },
    ],
    neutrals: [
      { id: 0, reason: r('Lagna lord — always auspicious', 'लग्नेश — सदैव शुभ', 'லக்னாதிபதி — எப்போதும் சுபம்', 'লগ্নেশ — সর্বদা শুভ') },
      { id: 1, reason: r('Lords 12th — mild loss house', '12वें का स्वामी — हल्का व्यय भाव', '12வது அதிபதி — மென்மையான இழப்பு பாவம்', '12শ স্বামী — মৃদু ব্যয় ভাব') },
    ],
  },
  // 6 = Virgo lagna
  6: {
    yogakaraka: null,
    yogakarakaReason: r('No single planet lords both a kendra and trikona', 'कोई एक ग्रह केन्द्र और त्रिकोण दोनों का स्वामी नहीं', 'ஒரே கிரகம் கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆளவில்லை', 'একটি গ্রহও কেন্দ্র ও ত্রিকোণ উভয়ের স্বামী নয়'),
    benefics: [
      { id: 5, reason: r('Lords 2nd & 9th (trikona)', '2रे और 9वें (त्रिकोण) का स्वामी', '2வது & 9வது (திரிகோணம்) அதிபதி', '2য় ও 9ম (ত্রিকোণ) স্বামী') },
    ],
    malefics: [
      { id: 0, reason: r('Lords 12th — loss house', '12वें का स्वामी — व्यय भाव', '12வது அதிபதி — இழப்பு பாவம்', '12শ স্বামী — ব্যয় ভাব') },
      { id: 2, reason: r('Lords 3rd & 8th — dusthana lord', '3रे और 8वें का स्वामी — दुःस्थान', '3வது & 8வது அதிபதி — துஷ்டானம்', '3য় ও 8ম স্বামী — দুঃস্থান') },
      { id: 1, reason: r('Lords 11th — trishadaya', '11वें का स्वामी — त्रिषडाय', '11வது அதிபதி — திரிஷடாயம்', '11শ স্বামী — ত্রিষডায়') },
    ],
    neutrals: [
      { id: 3, reason: r('Lagna lord (1st & 10th) — always auspicious', 'लग्नेश (1 और 10) — सदैव शुभ', 'லக்னாதிபதி (1 & 10) — எப்போதும் சுபம்', 'লগ্নেশ (1ম ও 10ম) — সর্বদা শুভ') },
      { id: 4, reason: r('Lords 4th & 7th (kendra) — mixed as natural benefic', '4थे और 7वें (केन्द्र) का स्वामी — मिश्र', '4வது & 7வது (கேந்திரம்) அதிபதி — கலப்பு', '4র্থ ও 7ম (কেন্দ্র) স্বামী — মিশ্র') },
      { id: 6, reason: r('Lords 5th (trikona) & 6th (dusthana) — mixed', '5वें (त्रिकोण) और 6ठे (दुःस्थान) का स्वामी — मिश्र', '5வது (திரிகோணம்) & 6வது (துஷ்டானம்) அதிபதி — கலப்பு', '5ম (ত্রিকোণ) ও 6ষ্ঠ (দুঃস্থান) স্বামী — মিশ্র') },
    ],
  },
  // 7 = Libra lagna
  7: {
    yogakaraka: 6,
    yogakarakaReason: r('Saturn lords 4th (Capricorn, kendra) and 5th (Aquarius, trikona)', 'शनि 4थे (मकर, केन्द्र) और 5वें (कुम्भ, त्रिकोण) का स्वामी', 'சனி 4வது (மகரம், கேந்திரம்) மற்றும் 5வது (கும்பம், திரிகோணம்) அதிபதி', 'শনি 4র্থ (মকর, কেন্দ্র) ও 5ম (কুম্ভ, ত্রিকোণ) স্বামী'),
    benefics: [
      { id: 6, reason: r('Yogakaraka — lords 4th & 5th', 'योगकारक — 4थे और 5वें का स्वामी', 'யோககாரகம் — 4வது & 5வது அதிபதி', 'যোগকারক — 4র্থ ও 5ম স্বামী') },
      { id: 3, reason: r('Lords 9th (Gemini, trikona) & 12th', '9वें (मिथुन, त्रिकोण) और 12वें का स्वामी', '9வது (மிதுனம், திரிகோணம்) & 12வது அதிபதி', '9ম (মিথুন, ত্রিকোণ) ও 12শ স্বামী') },
    ],
    malefics: [
      { id: 4, reason: r('Lords 3rd & 6th — dusthana', '3रे और 6ठे का स्वामी — दुःस्थान', '3வது & 6வது அதிபதி — துஷ்டானம்', '3য় ও 6ষ্ঠ স্বামী — দুঃস্থান') },
      { id: 0, reason: r('Lords 11th — trishadaya', '11वें का स्वामी — त्रिषडाय', '11வது அதிபதி — திரிஷடாயம்', '11শ স্বামী — ত্রিষডায়') },
      { id: 2, reason: r('Lords 2nd (maraka) & 7th (maraka)', '2रे (मारक) और 7वें (मारक) का स्वामी', '2வது (மாரகம்) & 7வது (மாரகம்) அதிபதி', '2য় (মারক) ও 7ম (মারক) স্বামী') },
    ],
    neutrals: [
      { id: 5, reason: r('Lagna lord (1st & 8th) — lagna lordship protects', 'लग्नेश (1 और 8) — लग्नेश सुरक्षा देता है', 'லக்னாதிபதி (1 & 8) — லக்னாதிபத்தியம் பாதுகாக்கிறது', 'লগ্নেশ (1ম ও 8ম) — লগ্নেশ সুরক্ষা দেয়') },
      { id: 1, reason: r('Lords 10th (kendra) — natural benefic in kendra, mixed', '10वें (केन्द्र) का स्वामी — मिश्र', '10வது (கேந்திரம்) அதிபதி — கலப்பு', '10ম (কেন্দ্র) স্বামী — মিশ্র') },
    ],
  },
  // 8 = Scorpio lagna
  8: {
    yogakaraka: null,
    yogakarakaReason: r('No single planet lords both a kendra and trikona', 'कोई एक ग्रह केन्द्र और त्रिकोण दोनों का स्वामी नहीं', 'ஒரே கிரகம் கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆளவில்லை', 'একটি গ্রহও কেন্দ্র ও ত্রিকোণ উভয়ের স্বামী নয়'),
    benefics: [
      { id: 1, reason: r('Lords 9th (Cancer, trikona)', '9वें (कर्क, त्रिकोण) का स्वामी', '9வது (கடகம், திரிகோணம்) அதிபதி', '9ম (কর্কট, ত্রিকোণ) স্বামী') },
      { id: 0, reason: r('Lords 10th (Leo, kendra)', '10वें (सिंह, केन्द्र) का स्वामी', '10வது (சிம்மம், கேந்திரம்) அதிபதி', '10ম (সিংহ, কেন্দ্র) স্বামী') },
      { id: 4, reason: r('Lords 2nd & 5th (trikona)', '2रे और 5वें (त्रिकोण) का स्वामी', '2வது & 5வது (திரிகோணம்) அதிபதி', '2য় ও 5ম (ত্রিকোণ) স্বামী') },
    ],
    malefics: [
      { id: 3, reason: r('Lords 8th & 11th — dusthana + trishadaya', '8वें और 11वें का स्वामी — दुःस्थान', '8வது & 11வது அதிபதி — துஷ்டானம்', '8ম ও 11শ স্বামী — দুঃস্থান') },
      { id: 5, reason: r('Lords 7th (maraka) & 12th (loss)', '7वें (मारक) और 12वें (हानि) का स्वामी', '7வது (மாரகம்) & 12வது (இழப்பு) அதிபதி', '7ম (মারক) ও 12শ (ক্ষতি) স্বামী') },
      { id: 6, reason: r('Lords 3rd & 4th — 3rd is trishadaya; mixed', '3रे और 4थे का स्वामी — 3रा त्रिषडाय', '3வது & 4வது அதிபதி — 3வது திரிஷடாயம்', '3য় ও 4র্থ স্বামী — 3য় ত্রিষডায়') },
    ],
    neutrals: [
      { id: 2, reason: r('Lagna lord (1st & 6th) — lagna lordship protects', 'लग्नेश (1 और 6) — लग्नेश सुरक्षा', 'லக்னாதிபதி (1 & 6) — லக்னாதிபத்தியம் பாதுகாக்கிறது', 'লগ্নেশ (1ম ও 6ষ্ঠ) — লগ্নেশ সুরক্ষা') },
    ],
  },
  // 9 = Sagittarius lagna
  9: {
    yogakaraka: null,
    yogakarakaReason: r('No single planet lords both a kendra and trikona', 'कोई एक ग्रह केन्द्र और त्रिकोण दोनों का स्वामी नहीं', 'ஒரே கிரகம் கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆளவில்லை', 'একটি গ্রহও কেন্দ্র ও ত্রিকোণ উভয়ের স্বামী নয়'),
    benefics: [
      { id: 0, reason: r('Lords 9th (Leo, trikona)', '9वें (सिंह, त्रिकोण) का स्वामी', '9வது (சிம்மம், திரிகோணம்) அதிபதி', '9ম (সিংহ, ত্রিকোণ) স্বামী') },
      { id: 2, reason: r('Lords 5th (Aries, trikona) & 12th', '5वें (मेष, त्रिकोण) और 12वें का स्वामी', '5வது (மேஷம், திரிகோணம்) & 12வது அதிபதி', '5ম (মেষ, ত্রিকোণ) ও 12শ স্বামী') },
    ],
    malefics: [
      { id: 5, reason: r('Lords 6th & 11th — dusthana + trishadaya', '6ठे और 11वें का स्वामी — दुःस्थान', '6வது & 11வது அதிபதி — துஷ்டானம்', '6ষ্ঠ ও 11শ স্বামী — দুঃস্থান') },
      { id: 6, reason: r('Lords 2nd (maraka) & 3rd (trishadaya)', '2रे (मारक) और 3रे का स्वामी', '2வது (மாரகம்) & 3வது அதிபதி', '2য় (মারক) ও 3য় স্বামী') },
    ],
    neutrals: [
      { id: 4, reason: r('Lagna lord (1st & 4th) — always auspicious', 'लग्नेश (1 और 4) — सदैव शुभ', 'லக்னாதிபதி (1 & 4) — எப்போதும் சுபம்', 'লগ্নেশ (1ম ও 4র্থ) — সর্বদা শুভ') },
      { id: 3, reason: r('Lords 7th & 10th (kendra) — natural benefic in kendra, mixed', '7वें और 10वें (केन्द्र) का स्वामी — मिश्र', '7வது & 10வது (கேந்திரம்) அதிபதி — கலப்பு', '7ম ও 10ম (কেন্দ্র) স্বামী — মিশ্র') },
      { id: 1, reason: r('Lords 8th — mild dusthana', '8वें का स्वामी — हल्का दुःस्थान', '8வது அதிபதி — மென்மையான துஷ்டானம்', '8ম স্বামী — মৃদু দুঃস্থান') },
    ],
  },
  // 10 = Capricorn lagna
  10: {
    yogakaraka: 5,
    yogakarakaReason: r('Venus lords 5th (Taurus, trikona) and 10th (Libra, kendra)', 'शुक्र 5वें (वृषभ, त्रिकोण) और 10वें (तुला, केन्द्र) का स्वामी', 'சுக்கிரன் 5வது (ரிஷபம், திரிகோணம்) மற்றும் 10வது (துலாம், கேந்திரம்) அதிபதி', 'শুক্র 5ম (বৃষ, ত্রিকোণ) ও 10ম (তুলা, কেন্দ্র) স্বামী'),
    benefics: [
      { id: 5, reason: r('Yogakaraka — lords 5th & 10th', 'योगकारक — 5वें और 10वें का स्वामी', 'யோககாரகம் — 5வது & 10வது அதிபதி', 'যোগকারক — 5ম ও 10ম স্বামী') },
      { id: 3, reason: r('Lords 6th & 9th — trikona lord outweighs dusthana', '6ठे और 9वें का स्वामी — त्रिकोण प्रबल', '6வது & 9வது அதிபதி — திரிகோணம் மேலோங்கும்', '6ষ্ঠ ও 9ম স্বামী — ত্রিকোণ প্রবল') },
    ],
    malefics: [
      { id: 2, reason: r('Lords 4th (kendra) & 11th (trishadaya) — mixed but 11th dominates', '4थे (केन्द्र) और 11वें का स्वामी', '4வது (கேந்திரம்) & 11வது அதிபதி', '4র্থ (কেন্দ্র) ও 11শ স্বামী') },
      { id: 1, reason: r('Lords 7th — maraka', '7वें का स्वामी — मारक', '7வது அதிபதி — மாரகம்', '7ম স্বামী — মারক') },
      { id: 4, reason: r('Lords 3rd & 12th — dusthana', '3रे और 12वें का स्वामी — दुःस्थान', '3வது & 12வது அதிபதி — துஷ்டானம்', '3য় ও 12শ স্বামী — দুঃস্থান') },
    ],
    neutrals: [
      { id: 6, reason: r('Lagna lord (1st & 2nd) — always auspicious', 'लग्नेश (1 और 2) — सदैव शुभ', 'லக்னாதிபதி (1 & 2) — எப்போதும் சுபம்', 'লগ্নেশ (1ম ও 2য়) — সর্বদা শুভ') },
      { id: 0, reason: r('Lords 8th — mild dusthana', '8वें का स्वामी — हल्का दुःस्थान', '8வது அதிபதி — மென்மையான துஷ்டானம்', '8ম স্বামী — মৃদু দুঃস্থান') },
    ],
  },
  // 11 = Aquarius lagna
  11: {
    yogakaraka: 5,
    yogakarakaReason: r('Venus lords 4th (Taurus, kendra) and 9th (Libra, trikona)', 'शुक्र 4थे (वृषभ, केन्द्र) और 9वें (तुला, त्रिकोण) का स्वामी', 'சுக்கிரன் 4வது (ரிஷபம், கேந்திரம்) மற்றும் 9வது (துலாம், திரிகோணம்) அதிபதி', 'শুক্র 4র্থ (বৃষ, কেন্দ্র) ও 9ম (তুলা, ত্রিকোণ) স্বামী'),
    benefics: [
      { id: 5, reason: r('Yogakaraka — lords 4th & 9th', 'योगकारक — 4थे और 9वें का स्वामी', 'யோககாரகம் — 4வது & 9வது அதிபதி', 'যোগকারক — 4র্থ ও 9ম স্বামী') },
      { id: 0, reason: r('Lords 7th (kendra) — natural malefic gains in kendra', '7वें (केन्द्र) का स्वामी — केन्द्र में नैसर्गिक पापी शुभ', '7வது (கேந்திரம்) அதிபதி — கேந்திரத்தில் இயற்கை பாபி சுபம்', '7ম (কেন্দ্র) স্বামী — কেন্দ্রে প্রাকৃতিক পাপী শুভ') },
    ],
    malefics: [
      { id: 1, reason: r('Lords 6th — dusthana', '6ठे का स्वामी — दुःस्थान', '6வது அதிபதி — துஷ்டானம்', '6ষ্ঠ স্বামী — দুঃস্থান') },
      { id: 4, reason: r('Lords 2nd (maraka) & 11th (trishadaya)', '2रे (मारक) और 11वें का स्वामी', '2வது (மாரகம்) & 11வது அதிபதி', '2য় (মারক) ও 11শ স্বামী') },
      { id: 2, reason: r('Lords 3rd & 10th — trishadaya + kendra but 3rd dominates', '3रे और 10वें का स्वामी', '3வது & 10வது அதிபதி', '3য় ও 10ম স্বামী') },
    ],
    neutrals: [
      { id: 6, reason: r('Lagna lord (1st & 12th) — lagna lordship protects', 'लग्नेश (1 और 12) — लग्नेश सुरक्षा', 'லக்னாதிபதி (1 & 12) — லக்னாதிபத்தியம் பாதுகாக்கிறது', 'লগ্নেশ (1ম ও 12শ) — লগ্নেশ সুরক্ষা') },
      { id: 3, reason: r('Lords 5th (trikona) & 8th (dusthana) — mixed', '5वें (त्रिकोण) और 8वें (दुःस्थान) का स्वामी — मिश्र', '5வது (திரிகோணம்) & 8வது (துஷ்டானம்) அதிபதி — கலப்பு', '5ম (ত্রিকোণ) ও 8ম (দুঃস্থান) স্বামী — মিশ্র') },
    ],
  },
  // 12 = Pisces lagna
  12: {
    yogakaraka: 2,
    yogakarakaReason: r('Mars lords 2nd & 9th — while not classic kendra+trikona, Mars is the most beneficial as 9th lord (trikona) for Pisces', 'मंगल 2रे और 9वें का स्वामी — 9वें (त्रिकोण) स्वामी होने से सर्वाधिक शुभ', 'செவ்வாய் 2வது & 9வது அதிபதி — 9வது (திரிகோணம்) அதிபதியாக மிகவும் சுபம்', 'মঙ্গল 2য় ও 9ম স্বামী — 9ম (ত্রিকোণ) স্বামী হওয়ায় সর্বাধিক শুভ'),
    benefics: [
      { id: 2, reason: r('Lords 2nd & 9th (trikona) — strongest benefic', '2रे और 9वें (त्रिकोण) का स्वामी — सबसे शुभ', '2வது & 9வது (திரிகோணம்) அதிபதி — மிகவும் சுபம்', '2য় ও 9ম (ত্রিকোণ) স্বামী — সবচেয়ে শুভ') },
      { id: 1, reason: r('Lords 5th (Cancer, trikona)', '5वें (कर्क, त्रिकोण) का स्वामी', '5வது (கடகம், திரிகோணம்) அதிபதி', '5ম (কর্কট, ত্রিকোণ) স্বামী') },
    ],
    malefics: [
      { id: 0, reason: r('Lords 6th — dusthana', '6ठे का स्वामी — दुःस्थान', '6வது அதிபதி — துஷ்டானம்', '6ষ্ঠ স্বামী — দুঃস্থান') },
      { id: 6, reason: r('Lords 11th & 12th — trishadaya + loss', '11वें और 12वें का स्वामी — त्रिषडाय + हानि', '11வது & 12வது அதிபதி — திரிஷடாயம் + இழப்பு', '11শ ও 12শ স্বামী — ত্রিষডায় + ক্ষতি') },
      { id: 3, reason: r('Lords 4th (kendra) & 7th (maraka) — natural benefic in kendra + maraka', '4थे (केन्द्र) और 7वें (मारक) का स्वामी', '4வது (கேந்திரம்) & 7வது (மாரகம்) அதிபதி', '4র্থ (কেন্দ্র) ও 7ম (মারক) স্বামী') },
      { id: 5, reason: r('Lords 3rd & 8th — dusthana', '3रे और 8वें का स्वामी — दुःस्थान', '3வது & 8வது அதிபதி — துஷ்டானம்', '3য় ও 8ম স্বামী — দুঃস্থান') },
    ],
    neutrals: [
      { id: 4, reason: r('Lagna lord (1st & 10th) — always auspicious', 'लग्नेश (1 और 10) — सदैव शुभ', 'லக்னாதிபதி (1 & 10) — எப்போதும் சுபம்', 'লগ্নেশ (1ম ও 10ম) — সর্বদা শুভ') },
    ],
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * Helper: build reverse lookup — which planets are exalted/debilitated in
 * each sign.
 * ────────────────────────────────────────────────────────────────────────── */
function exaltedInSign(signId: number): number[] {
  return Object.entries(EXALTATION_SIGNS)
    .filter(([, s]) => s === signId)
    .map(([pid]) => Number(pid));
}
function debilitatedInSign(signId: number): number[] {
  return Object.entries(DEBILITATION_SIGNS)
    .filter(([, s]) => s === signId)
    .map(([pid]) => Number(pid));
}

function planetName(id: number, locale: string): string {
  const g = GRAHAS.find((g) => g.id === id);
  return g ? tl(g.name, locale) : '—';
}

/* ──────────────────────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────────────────────── */
export default function LearnLordshipPage() {
  const locale = useLocale();
  const l = (obj: Record<string, string>) => (obj as Record<string, string>)[locale] || obj.en || '';
  const [selectedLagna, setSelectedLagna] = useState(1);

  const selectedEntry = FUNCTIONAL_STATUS[selectedLagna];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {l(LABELS.title)}
        </h1>
        <p className="text-text-secondary">{l(LABELS.subtitle)}</p>
      </div>

      {/* ── Section 1: Sign Lordship Table ──────────────────────────────── */}
      <LessonSection number={1} title={l(LABELS.signLordshipTitle)}>
        <p>{l(LABELS.signLordshipDesc)}</p>

        <div className="mt-4 overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colSign)}</th>
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colLord)}</th>
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colNature)}</th>
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colExalted)}</th>
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colDebilitated)}</th>
              </tr>
            </thead>
            <tbody>
              {RASHIS.map((rashi) => {
                const lordId = SIGN_LORDS[rashi.id];
                const exalted = exaltedInSign(rashi.id);
                const debilitated = debilitatedInSign(rashi.id);
                return (
                  <tr key={rashi.id} className="border-b border-gold-primary/8 hover:bg-gold-primary/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-gold-light font-medium">{rashi.symbol}</span>{' '}
                      <span className="text-text-primary">{tl(rashi.name, locale)}</span>
                    </td>
                    <td className="py-3 px-2 text-text-primary">{planetName(lordId, locale)}</td>
                    <td className="py-3 px-2 text-text-secondary text-xs">{l(PLANET_NATURES[lordId])}</td>
                    <td className="py-3 px-2">
                      {exalted.length > 0
                        ? exalted.map((pid) => (
                            <span key={pid} className="text-emerald-400">{planetName(pid, locale)}</span>
                          ))
                        : <span className="text-text-secondary/40">—</span>}
                    </td>
                    <td className="py-3 px-2">
                      {debilitated.length > 0
                        ? debilitated.map((pid) => (
                            <span key={pid} className="text-red-400">{planetName(pid, locale)}</span>
                          ))
                        : <span className="text-text-secondary/40">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Section 2: Natural House Karakas ─────────────────────────────── */}
      <LessonSection number={2} title={l(LABELS.houseKarakaTitle)}>
        <p>{l(LABELS.houseKarakaDesc)}</p>

        <div className="mt-4 overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[540px] text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left text-gold-light py-3 px-2 font-semibold w-16">{l(LABELS.colHouse)}</th>
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colKaraka)}</th>
                <th className="text-left text-gold-light py-3 px-2 font-semibold">{l(LABELS.colSignifies)}</th>
              </tr>
            </thead>
            <tbody>
              {HOUSE_KARAKAS.map((hk) => (
                <tr key={hk.house} className="border-b border-gold-primary/8 hover:bg-gold-primary/5 transition-colors">
                  <td className="py-3 px-2 text-gold-light font-mono font-bold">{hk.house}</td>
                  <td className="py-3 px-2 text-text-primary">
                    {hk.karakaIds.map((pid, i) => (
                      <span key={pid}>
                        {i > 0 && <span className="text-text-secondary/40"> / </span>}
                        {planetName(pid, locale)}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-2 text-text-secondary">{l(hk.signifies)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Section 3: Functional Status Per Lagna ──────────────────────── */}
      <LessonSection number={3} title={l(LABELS.functionalTitle)}>
        <p>{l(LABELS.functionalDesc)}</p>

        {/* Lagna Selector — tabs on desktop, dropdown on mobile */}
        <div className="mt-6">
          {/* Mobile dropdown */}
          <div className="sm:hidden mb-4">
            <label className="text-text-secondary text-sm mb-1 block">{l(LABELS.selectLagna)}</label>
            <select
              value={selectedLagna}
              onChange={(e) => setSelectedLagna(Number(e.target.value))}
              className="w-full bg-bg-primary border border-gold-primary/20 rounded-lg px-3 py-2.5 text-text-primary focus:border-gold-primary/50 focus:outline-none"
            >
              {RASHIS.map((rashi) => (
                <option key={rashi.id} value={rashi.id}>
                  {rashi.symbol} {tl(rashi.name, locale)}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop tabs */}
          <div className="hidden sm:flex flex-wrap gap-1.5 mb-6">
            {RASHIS.map((rashi) => (
              <button
                key={rashi.id}
                onClick={() => setSelectedLagna(rashi.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedLagna === rashi.id
                    ? 'bg-gold-primary/20 border border-gold-primary/50 text-gold-light'
                    : 'bg-bg-primary/50 border border-gold-primary/10 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
                }`}
              >
                {rashi.symbol} {tl(rashi.name, locale)}
              </button>
            ))}
          </div>

          {/* Results card */}
          {selectedEntry && (
            <motion.div
              key={selectedLagna}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Yogakaraka */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20">
                <h4 className="text-gold-light font-bold text-sm uppercase tracking-wider mb-2">{l(LABELS.yogakaraka)}</h4>
                {selectedEntry.yogakaraka !== null ? (
                  <div>
                    <span className="text-lg text-gold-light font-bold">
                      {planetName(selectedEntry.yogakaraka, locale)}
                    </span>
                    <p className="text-text-secondary text-sm mt-1">
                      {l(selectedEntry.yogakarakaReason)}
                    </p>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">{l(LABELS.none)} — {l(selectedEntry.yogakarakaReason)}</p>
                )}
              </div>

              {/* Benefics */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">{l(LABELS.benefics)}</h4>
                <div className="space-y-2">
                  {selectedEntry.benefics.map(({ id, reason }) => (
                    <div key={id} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-medium min-w-[80px]">{planetName(id, locale)}</span>
                      <span className="text-text-secondary text-sm">— {l(reason)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Malefics */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2">{l(LABELS.malefics)}</h4>
                <div className="space-y-2">
                  {selectedEntry.malefics.map(({ id, reason }) => (
                    <div key={id} className="flex items-start gap-2">
                      <span className="text-red-400 font-medium min-w-[80px]">{planetName(id, locale)}</span>
                      <span className="text-text-secondary text-sm">— {l(reason)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neutrals */}
              <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/10">
                <h4 className="text-gold-light/70 font-bold text-sm uppercase tracking-wider mb-2">{l(LABELS.neutrals)}</h4>
                <div className="space-y-2">
                  {selectedEntry.neutrals.map(({ id, reason }) => (
                    <div key={id} className="flex items-start gap-2">
                      <span className="text-text-primary font-medium min-w-[80px]">{planetName(id, locale)}</span>
                      <span className="text-text-secondary text-sm">— {l(reason)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </LessonSection>

      {/* ── Section 4: How Lordship Affects Your Chart ───────────────────── */}
      <LessonSection number={4} title={l(LABELS.howToUseTitle)}>
        <p>{l(LABELS.howToUse1)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{l(LABELS.howToUse2)}</p>
        </div>
        <p className="mt-4">{l(LABELS.howToUse3)}</p>
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12">
          <p className="text-text-secondary text-sm">
            {pickByLocale({ en: 'Related pages: ', hi: 'सम्बन्धित पृष्ठ: ', ta: 'தொடர்புடைய பக்கங்கள்: ', bn: 'সম্পর্কিত পৃষ্ঠা: ' }, locale)}
            <Link href="/learn/bhavas" className="text-gold-light hover:text-gold-primary transition-colors underline underline-offset-2">
              {pickByLocale({ en: '12 Bhavas (Houses)', hi: '12 भाव', ta: '12 பாவங்கள்', bn: '12 ভাব' }, locale)}
            </Link>
            {' · '}
            <Link href="/learn/rashis" className="text-gold-light hover:text-gold-primary transition-colors underline underline-offset-2">
              {pickByLocale({ en: '12 Rashis (Signs)', hi: '12 राशियाँ', ta: '12 ராசிகள்', bn: '12 রাশি' }, locale)}
            </Link>
            {' · '}
            <Link href="/learn/grahas" className="text-gold-light hover:text-gold-primary transition-colors underline underline-offset-2">
              {pickByLocale({ en: 'Nine Grahas', hi: 'नवग्रह', ta: 'நவகிரகங்கள்', bn: 'নবগ্রহ' }, locale)}
            </Link>
          </p>
        </div>
      </LessonSection>
    </div>
  );
}

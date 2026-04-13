'use client';
import { tl } from '@/lib/utils/trilingual';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { dateToJD, moonLongitude, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Your Week Ahead',
    subheading: 'Moon transit forecast based on your birth chart',
    today: 'Today',
    moonIn: 'Moon in',
    noChart: 'Generate your birth chart to unlock your weekly forecast',
    generateChart: 'Generate Chart',
    house: 'H',
  },
  hi: {
    heading: 'आपका आगामी सप्ताह',
    subheading: 'आपकी जन्म कुण्डली पर आधारित चन्द्र गोचर पूर्वानुमान',
    today: 'आज',
    moonIn: 'चन्द्र',
    noChart: 'साप्ताहिक पूर्वानुमान के लिए अपनी जन्म कुण्डली बनाएँ',
    generateChart: 'कुण्डली बनाएँ',
    house: 'भ',
  },
  sa: {
    heading: 'भवतः आगामिसप्ताहः',
    subheading: 'भवतः जन्मकुण्डल्याः आधारेण चन्द्रगोचरपूर्वानुमानम्',
    today: 'अद्य',
    moonIn: 'चन्द्रः',
    noChart: 'साप्ताहिकपूर्वानुमानार्थं जन्मकुण्डलीं रचयतु',
    generateChart: 'कुण्डलीं रचयतु',
    house: 'भा',
  },
  ta: {
    heading: 'உங்கள் வரவிருக்கும் வாரம்',
    subheading: 'உங்கள் ஜாதகத்தின் அடிப்படையில் சந்திர பெயர்ச்சி முன்னறிவிப்பு',
    today: 'இன்று',
    moonIn: 'சந்திரன்',
    noChart: 'வாராந்திர முன்னறிவிப்புக்கு உங்கள் ஜாதகத்தை உருவாக்கவும்',
    generateChart: 'ஜாதகம் உருவாக்கு',
    house: 'பா',
  },
  te: {
    heading: 'మీ రాబోయే వారం',
    subheading: 'మీ జన్మ చార్ట్ ఆధారంగా చంద్ర గోచార అంచనా',
    today: 'ఈరోజు',
    moonIn: 'చంద్రుడు',
    noChart: 'వారపు అంచనా కోసం మీ జన్మ చార్ట్ రూపొందించండి',
    generateChart: 'చార్ట్ రూపొందించు',
    house: 'భా',
  },
  bn: {
    heading: 'আপনার আগামী সপ্তাহ',
    subheading: 'আপনার জন্ম কুণ্ডলীর ভিত্তিতে চন্দ্র গোচর পূর্বাভাস',
    today: 'আজ',
    moonIn: 'চন্দ্র',
    noChart: 'সাপ্তাহিক পূর্বাভাসের জন্য আপনার জন্ম কুণ্ডলী তৈরি করুন',
    generateChart: 'কুণ্ডলী তৈরি করুন',
    house: 'ভা',
  },
  kn: {
    heading: 'ನಿಮ್ಮ ಮುಂಬರುವ ವಾರ',
    subheading: 'ನಿಮ್ಮ ಜನ್ಮ ಜಾತಕದ ಆಧಾರದ ಮೇಲೆ ಚಂದ್ರ ಗೋಚಾರ ಮುನ್ಸೂಚನೆ',
    today: 'ಇಂದು',
    moonIn: 'ಚಂದ್ರ',
    noChart: 'ವಾರದ ಮುನ್ಸೂಚನೆಗಾಗಿ ನಿಮ್ಮ ಜಾತಕ ರಚಿಸಿ',
    generateChart: 'ಜಾತಕ ರಚಿಸಿ',
    house: 'ಭಾ',
  },
  mr: {
    heading: 'आपला आगामी आठवडा',
    subheading: 'आपल्या जन्म कुंडलीवर आधारित चंद्र गोचर अंदाज',
    today: 'आज',
    moonIn: 'चंद्र',
    noChart: 'साप्ताहिक अंदाजासाठी आपली जन्म कुंडली तयार करा',
    generateChart: 'कुंडली तयार करा',
    house: 'भा',
  },
  gu: {
    heading: 'તમારું આગામી સપ્તાહ',
    subheading: 'તમારી જન્મ કુંડળીના આધારે ચંદ્ર ગોચર આગાહી',
    today: 'આજે',
    moonIn: 'ચંદ્ર',
    noChart: 'સાપ્તાહિક આગાહી માટે તમારી જન્મ કુંડળી બનાવો',
    generateChart: 'કુંડળી બનાવો',
    house: 'ભા',
  },
  mai: {
    heading: 'अहाँक आगामी सप्ताह',
    subheading: 'अहाँक जन्म कुंडलीक आधार पर चंद्र गोचर पूर्वानुमान',
    today: 'आइ',
    moonIn: 'चंद्र',
    noChart: 'साप्ताहिक पूर्वानुमानक लेल अपन जन्म कुंडली बनाउ',
    generateChart: 'कुंडली बनाउ',
    house: 'भा',
  },
};

// ---------------------------------------------------------------------------
// Moon-house forecast texts (trilingual)
// ---------------------------------------------------------------------------
const HOUSE_FORECASTS: Record<number, LocaleText> = {
  1:  { en: 'Focus on self, health, personal projects', hi: 'स्वास्थ्य, व्यक्तिगत परियोजनाओं पर ध्यान', sa: 'आत्मनः आरोग्यं व्यक्तिगतकार्याणि च', ta: 'சுயம், ஆரோக்கியம், தனிப்பட்ட திட்டங்களில் கவனம்', te: 'ఆత్మధ్యానం, ఆరోగ్యం, వ్యక్తిగత ప్రాజెక్టులు', bn: 'আত্মনিবেদন, স্বাস্থ্য, ব্যক্তিগত প্রকল্প', kn: 'ಸ್ವಯಂ, ಆರೋಗ್ಯ, ವೈಯಕ್ತಿಕ ಯೋಜನೆಗಳ ಮೇಲೆ ಗಮನ', mr: 'आत्मलक्ष, आरोग्य, वैयक्तिक प्रकल्प', gu: 'સ્વ, આરોગ્ય, અંગત પ્રોજેક્ટ્સ પર ધ્યાન', mai: 'स्वास्थ्य, व्यक्तिगत कार्यपर ध्यान' },
  2:  { en: 'Good for finances, family matters, speech', hi: 'धन, परिवार और वाणी के लिए शुभ', sa: 'धनं कुटुम्बं वाक् च शुभम्', ta: 'நிதி, குடும்ப விவகாரங்கள், பேச்சுக்கு நல்லது', te: 'ఆర్థికం, కుటుంబ విషయాలు, వాక్కుకు శుభం', bn: 'অর্থ, পারিবারিক বিষয়, বাক্যের জন্য শুভ', kn: 'ಹಣಕಾಸು, ಕುಟುಂಬ ವಿಷಯಗಳು, ವಾಕ್ಕಿಗೆ ಶುಭ', mr: 'आर्थिक, कौटुंबिक बाबी, वाणीसाठी शुभ', gu: 'નાણાકીય, પારિવારિક બાબતો, વાણી માટે શુભ', mai: 'धन, परिवार आ वाणीक लेल शुभ' },
  3:  { en: 'Communication, short trips, courage', hi: 'संवाद, लघु यात्रा, साहस', sa: 'सम्वादः लघुयात्रा पराक्रमश्च', ta: 'தொடர்பாடல், குறுகிய பயணங்கள், தைரியம்', te: 'సంభాషణ, చిన్న ప్రయాణాలు, ధైర్యం', bn: 'যোগাযোগ, ছোট ভ্রমণ, সাহস', kn: 'ಸಂವಹನ, ಸಣ್ಣ ಪ್ರಯಾಣಗಳು, ಧೈರ್ಯ', mr: 'संवाद, लहान प्रवास, धाडस', gu: 'સંવાદ, ટૂંકા પ્રવાસ, સાહસ', mai: 'संवाद, छोट यात्रा, साहस' },
  4:  { en: 'Home, mother, emotional peace, property', hi: 'गृह, माता, मानसिक शान्ति, सम्पत्ति', sa: 'गृहं माता मानसिकशान्तिः सम्पत्तिश्च', ta: 'வீடு, தாய், உணர்ச்சி அமைதி, சொத்து', te: 'గృహం, తల్లి, మానసిక ప్రశాంతత, ఆస్తి', bn: 'গৃহ, মাতা, মানসিক শান্তি, সম্পত্তি', kn: 'ಮನೆ, ತಾಯಿ, ಮಾನಸಿಕ ಶಾಂತಿ, ಆಸ್ತಿ', mr: 'गृह, माता, मानसिक शांती, मालमत्ता', gu: 'ઘર, માતા, ભાવનાત્મક શાંતિ, સંપત્તિ', mai: 'गृह, माता, मानसिक शांति, संपत्ति' },
  5:  { en: 'Creativity, children, education, romance', hi: 'रचनात्मकता, सन्तान, शिक्षा, प्रेम', sa: 'सृजनशीलता सन्तानाः शिक्षा प्रेम च', ta: 'படைப்பாற்றல், குழந்தைகள், கல்வி, காதல்', te: 'సృజనాత్మకత, సంతానం, విద్య, ప్రేమ', bn: 'সৃজনশীলতা, সন্তান, শিক্ষা, প্রেম', kn: 'ಸೃಜನಶೀಲತೆ, ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಪ್ರೇಮ', mr: 'सर्जनशीलता, संतती, शिक्षण, प्रेम', gu: 'સર્જનાત્મકતા, સંતાન, શિક્ષણ, પ્રેમ', mai: 'रचनात्मकता, संतान, शिक्षा, प्रेम' },
  6:  { en: 'Health challenges, competition, service', hi: 'स्वास्थ्य चुनौतियाँ, प्रतिस्पर्धा, सेवा', sa: 'आरोग्यआह्वानानि प्रतिस्पर्धा सेवा च', ta: 'ஆரோக்கிய சவால்கள், போட்டி, சேவை', te: 'ఆరోగ్య సవాళ్లు, పోటీ, సేవ', bn: 'স্বাস্থ্য চ্যালেঞ্জ, প্রতিযোগিতা, সেবা', kn: 'ಆರೋಗ್ಯ ಸವಾಲುಗಳು, ಸ್ಪರ್ಧೆ, ಸೇವೆ', mr: 'आरोग्य आव्हाने, स्पर्धा, सेवा', gu: 'આરોગ્ય પડકારો, સ્પર્ધા, સેવા', mai: 'स्वास्थ्य चुनौती, प्रतिस्पर्धा, सेवा' },
  7:  { en: 'Partnerships, marriage, business deals', hi: 'साझेदारी, विवाह, व्यापारिक सौदे', sa: 'साझेदारी विवाहः वाणिज्यसौदाश्च', ta: 'கூட்டாண்மை, திருமணம், வணிக ஒப்பந்தங்கள்', te: 'భాగస్వామ్యం, వివాహం, వ్యాపార ఒప్పందాలు', bn: 'অংশীদারত্ব, বিবাহ, ব্যবসায়িক চুক্তি', kn: 'ಪಾಲುದಾರಿಕೆ, ವಿವಾಹ, ವ್ಯಾಪಾರ ಒಪ್ಪಂದಗಳು', mr: 'भागीदारी, विवाह, व्यापारी करार', gu: 'ભાગીદારી, લગ્ન, વ્યાપારિક સોદા', mai: 'साझेदारी, विवाह, व्यापारिक सौदा' },
  8:  { en: 'Transformation, occult, unexpected events', hi: 'परिवर्तन, गूढ़ विद्या, अप्रत्याशित घटनाएँ', sa: 'परिवर्तनं गूढविद्या अप्रत्याशितघटनाश्च', ta: 'மாற்றம், மறை கலை, எதிர்பாராத நிகழ்வுகள்', te: 'పరివర్తన, గూఢవిద్య, ఊహించని సంఘటనలు', bn: 'রূপান্তর, গূঢ়বিদ্যা, অপ্রত্যাশিত ঘটনা', kn: 'ಪರಿವರ್ತನೆ, ಗೂಢವಿದ್ಯೆ, ಅನಿರೀಕ್ಷಿತ ಘಟನೆಗಳು', mr: 'परिवर्तन, गूढविद्या, अनपेक्षित घटना', gu: 'પરિવર્તન, ગૂઢવિદ્યા, અણધાર્યા બનાવો', mai: 'परिवर्तन, गूढ़ विद्या, अप्रत्याशित घटना' },
  9:  { en: 'Fortune, dharma, travel, spiritual growth', hi: 'भाग्य, धर्म, यात्रा, आध्यात्मिक वृद्धि', sa: 'भाग्यं धर्मः यात्रा आध्यात्मिकवृद्धिश्च', ta: 'அதிர்ஷ்டம், தர்மம், பயணம், ஆன்மிக வளர்ச்சி', te: 'అదృష్టం, ధర్మం, ప్రయాణం, ఆధ్యాత్మిక వృద్ధి', bn: 'ভাগ্য, ধর্ম, ভ্রমণ, আধ্যাত্মিক বৃদ্ধি', kn: 'ಅದೃಷ್ಟ, ಧರ್ಮ, ಪ್ರಯಾಣ, ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ', mr: 'भाग्य, धर्म, प्रवास, आध्यात्मिक वाढ', gu: 'ભાગ્ય, ધર્મ, પ્રવાસ, આધ્યાત્મિક વૃદ્ધિ', mai: 'भाग्य, धर्म, यात्रा, आध्यात्मिक वृद्धि' },
  10: { en: 'Career, reputation, authority', hi: 'करियर, प्रतिष्ठा, अधिकार', sa: 'वृत्तिः प्रतिष्ठा अधिकारश्च', ta: 'தொழில், புகழ், அதிகாரம்', te: 'వృత్తి, ప్రతిష్ఠ, అధికారం', bn: 'কর্মজীবন, খ্যাতি, কর্তৃত্ব', kn: 'ವೃತ್ತಿ, ಖ್ಯಾತಿ, ಅಧಿಕಾರ', mr: 'करिअर, प्रतिष्ठा, अधिकार', gu: 'કારકિર્દી, પ્રતિષ્ઠા, સત્તા', mai: 'करियर, प्रतिष्ठा, अधिकार' },
  11: { en: 'Gains, friendships, wish fulfillment', hi: 'लाभ, मित्रता, इच्छा पूर्ति', sa: 'लाभः मैत्री इच्छापूर्तिश्च', ta: 'ஆதாயங்கள், நட்பு, விருப்ப நிறைவேற்றம்', te: 'లాభాలు, స్నేహం, కోరికల నెరవేర్పు', bn: 'লাভ, বন্ধুত্ব, ইচ্ছাপূরণ', kn: 'ಲಾಭ, ಸ್ನೇಹ, ಇಚ್ಛಾಪೂರ್ತಿ', mr: 'लाभ, मैत्री, इच्छापूर्ती', gu: 'લાભ, મિત્રતા, ઇચ્છાપૂર્તિ', mai: 'लाभ, मित्रता, इच्छा पूर्ति' },
  12: { en: 'Expenses, moksha, foreign, rest', hi: 'व्यय, मोक्ष, विदेश, विश्राम', sa: 'व्ययः मोक्षः विदेशः विश्रामश्च', ta: 'செலவுகள், மோட்சம், வெளிநாடு, ஓய்வு', te: 'ఖర్చులు, మోక్షం, విదేశం, విశ్రాంతి', bn: 'ব্যয়, মোক্ষ, বিদেশ, বিশ্রাম', kn: 'ಖರ್ಚುಗಳು, ಮೋಕ್ಷ, ವಿದೇಶ, ವಿಶ್ರಾಂತಿ', mr: 'खर्च, मोक्ष, परदेश, विश्रांती', gu: 'ખર્ચ, મોક્ષ, વિદેશ, આરામ', mai: 'व्यय, मोक्ष, विदेश, विश्राम' },
};

// ---------------------------------------------------------------------------
// Auspiciousness by house number
// ---------------------------------------------------------------------------
type Auspiciousness = 'good' | 'neutral' | 'caution';

function getAuspiciousness(house: number): Auspiciousness {
  // Benefic houses: 1, 2, 4, 5, 7, 9, 10, 11
  if ([1, 2, 4, 5, 7, 9, 10, 11].includes(house)) return 'good';
  // Challenging houses: 6, 8, 12
  if ([6, 8, 12].includes(house)) return 'caution';
  return 'neutral';
}

const AUSP_STYLES: Record<Auspiciousness, { dot: string; bg: string }> = {
  good:    { dot: 'bg-emerald-400', bg: 'bg-emerald-500/8' },
  neutral: { dot: 'bg-amber-400',   bg: 'bg-amber-500/8' },
  caution: { dot: 'bg-red-400',     bg: 'bg-red-500/8' },
};

// ---------------------------------------------------------------------------
// Day name helpers
// ---------------------------------------------------------------------------
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
const DAY_NAMES_SA = ['रविः', 'सोमः', 'मङ्गलः', 'बुधः', 'गुरुः', 'शुक्रः', 'शनिः'];

function getDayName(date: Date, locale: Locale): string {
  const dow = date.getDay();
  if (locale === 'sa') return DAY_NAMES_SA[dow];
  if (isDevanagariLocale(locale)) return DAY_NAMES_HI[dow];
  return DAY_NAMES_EN[dow];
}

function formatDate(date: Date, locale: Locale): string {
  const months_en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = date.getDate();
  if (!isDevanagariLocale(locale)) return `${months_en[date.getMonth()]} ${d}`;
  // For Devanagari locales, use numeric
  return `${d}/${date.getMonth() + 1}`;
}

// ---------------------------------------------------------------------------
// Compute week data
// ---------------------------------------------------------------------------
interface WeekDay {
  date: Date;
  dayName: string;
  dateLabel: string;
  isToday: boolean;
  moonSign: number;        // 1-12
  moonSignName: string;
  houseFromAsc: number;    // 1-12
  forecast: string;
  auspiciousness: Auspiciousness;
}

function computeWeekForecast(ascendantSign: number, locale: Locale): WeekDay[] {
  const now = new Date();
  const days: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    // Compute JD for noon UTC on that day
    const jd = dateToJD(date.getFullYear(), date.getMonth() + 1, date.getDate(), 12);
    // Get sidereal Moon longitude
    const tropMoon = moonLongitude(jd);
    const sidMoon = toSidereal(tropMoon, jd);
    const moonSign = getRashiNumber(sidMoon); // 1-12

    // House from ascendant: if Moon is in ascendant sign, it's house 1
    let houseFromAsc = moonSign - ascendantSign + 1;
    if (houseFromAsc <= 0) houseFromAsc += 12;

    const rashi = RASHIS[moonSign - 1];
    const moonSignName = rashi?.name?.[locale] || rashi?.name?.en || '';
    const forecast = HOUSE_FORECASTS[houseFromAsc]?.[locale] || HOUSE_FORECASTS[houseFromAsc]?.en || '';
    const auspiciousness = getAuspiciousness(houseFromAsc);

    days.push({
      date,
      dayName: getDayName(date, locale),
      dateLabel: formatDate(date, locale),
      isToday: i === 0,
      moonSign,
      moonSignName,
      houseFromAsc,
      forecast,
      auspiciousness,
    });
  }

  return days;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface WeekAheadProps {
  ascendantSign: number;   // 1-12, user's natal lagna
  locale: Locale;
  hasBirthData: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function WeekAhead({ ascendantSign, locale, hasBirthData }: WeekAheadProps) {
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;

  const weekDays = useMemo(() => {
    if (!hasBirthData || !ascendantSign) return [];
    return computeWeekForecast(ascendantSign, locale);
  }, [ascendantSign, locale, hasBirthData]);

  // No birth data — show CTA
  if (!hasBirthData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="mb-8 p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-purple-900/15 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.heading}
          </h3>
        </div>
        <p className="text-text-secondary text-sm mb-4">{L.noChart}</p>
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl text-sm hover:brightness-110 transition-all"
        >
          {L.generateChart}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  if (weekDays.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
      className="mb-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-purple-900/15 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.heading}
          </h3>
        </div>
        <p className="text-text-secondary text-xs">{L.subheading}</p>
      </div>

      {/* 7-day list */}
      <div className="px-4 pb-4">
        {weekDays.map((day, idx) => {
          const ausp = AUSP_STYLES[day.auspiciousness];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + idx * 0.04, ease: 'easeOut' as const }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                day.isToday
                  ? 'bg-gold-primary/10 border border-gold-primary/30'
                  : 'border border-transparent hover:bg-purple-500/5'
              } ${idx > 0 ? 'mt-1' : ''}`}
            >
              {/* Auspiciousness dot */}
              <span className={`w-2 h-2 rounded-full shrink-0 ${ausp.dot}`} />

              {/* Day + date */}
              <div className="w-[72px] shrink-0">
                <span className={`text-sm font-semibold ${day.isToday ? 'text-gold-light' : 'text-text-primary'}`}>
                  {day.isToday ? L.today : day.dayName}
                </span>
                <span className="text-[10px] text-text-secondary block leading-tight">
                  {day.dateLabel}
                </span>
              </div>

              {/* Moon sign pill */}
              <div className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md ${ausp.bg}`}>
                <Moon className="w-3 h-3 text-purple-300" />
                <span className="text-[11px] text-purple-200 font-medium whitespace-nowrap">
                  {day.moonSignName}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {L.house}{day.houseFromAsc}
                </span>
              </div>

              {/* Forecast text */}
              <p className={`text-xs leading-snug ${day.isToday ? 'text-text-primary' : 'text-text-secondary'} hidden sm:block`}>
                {day.forecast}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

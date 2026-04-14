'use client';

import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LT from '@/messages/learn/gochar.json';

/* Labels migrated to src/messages/learn/gochar.json — accessed via LT + t() */

const TRANSIT_SPEEDS = [
  { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, speed: '~2.25 days/sign', effect: { en: 'Daily mood, short-term events', hi: 'दैनिक मनोदशा, अल्पकालिक घटनाएँ', sa: 'दैनिकमनोदशा, अल्पकालिकघटनाः' }, color: '#e2e8f0' },
  { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, speed: '~1 month/sign', effect: { en: 'Monthly themes, seasonal patterns', hi: 'मासिक विषय, मौसमी स्वरूप', sa: 'मासिकविषयाः, ऋतुस्वरूपाणि' }, color: '#f59e0b' },
  { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, speed: '~1 month/sign', effect: { en: 'Communication, trade, learning', hi: 'संवाद, व्यापार, अध्ययन', sa: 'संवादः, व्यापारः, अध्ययनम्' }, color: '#22c55e' },
  { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, speed: '~1 month/sign', effect: { en: 'Relationships, luxury, art', hi: 'सम्बन्ध, विलासिता, कला', sa: 'सम्बन्धाः, विलासिता, कला' }, color: '#ec4899' },
  { planet: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, speed: '~1.5 months/sign', effect: { en: 'Energy, conflict, property', hi: 'ऊर्जा, संघर्ष, सम्पत्ति', sa: 'ऊर्जा, संघर्षः, सम्पत्तिः' }, color: '#ef4444' },
  { planet: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, speed: '~1 year/sign', effect: { en: 'Growth, wisdom, fortune — major life themes', hi: 'विकास, ज्ञान, भाग्य — प्रमुख जीवन विषय', sa: 'विकासः, ज्ञानं, भाग्यम्' }, color: '#f0d48a' },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, speed: '~2.5 years/sign', effect: { en: 'Karma, structure, discipline — long-term transformation', hi: 'कर्म, संरचना, अनुशासन — दीर्घकालिक परिवर्तन', sa: 'कर्म, संरचना, अनुशासनम्' }, color: '#3b82f6' },
  { planet: { en: 'Rahu/Ketu', hi: 'राहु/केतु', sa: 'राहुः/केतुः' }, speed: '~1.5 years/sign', effect: { en: 'Obsessions, past-life patterns, karmic shifts', hi: 'आसक्ति, पूर्वजन्म स्वरूप, कार्मिक परिवर्तन', sa: 'आसक्तिः, पूर्वजन्मस्वरूपाणि' }, color: '#6366f1' },
];

const TRANSIT_HOUSES = [
  { house: 1, saturn: { en: 'Stress, health issues, identity crisis', hi: 'तनाव, स्वास्थ्य, पहचान संकट', sa: 'तनाव, स्वास्थ्य, पहचान संकट', mai: 'तनाव, स्वास्थ्य, पहचान संकट', mr: 'तनाव, स्वास्थ्य, पहचान संकट', ta: 'மன அழுத்தம், உடல்நல பிரச்சனைகள்', te: 'ఒత్తిడి, ఆరోగ్య సమస్యలు', bn: 'চাপ, স্বাস্থ্য সমস্যা', kn: 'ಒತ್ತಡ, ಆರೋಗ್ಯ ಸಮಸ್ಯೆ', gu: 'તણાવ, સ્વાસ્થ્ય સમસ્યા' }, jupiter: { en: 'Confidence, new beginnings, weight gain', hi: 'आत्मविश्वास, नई शुरुआत', sa: 'आत्मविश्वास, नई शुरुआत', mai: 'आत्मविश्वास, नई शुरुआत', mr: 'आत्मविश्वास, नई शुरुआत', ta: 'நம்பிக்கை, புதிய தொடக்கம்', te: 'ఆత్మవిశ్వాసం, కొత్త ప్రారంభం', bn: 'আত্মবিশ্বাস, নতুন শুরু', kn: 'ಆತ್ಮವಿಶ್ವಾಸ, ಹೊಸ ಆರಂಭ', gu: 'આત્મવિશ્વાસ, નવી શરૂઆત' }, nature: 'mixed' },
  { house: 2, saturn: { en: 'Financial pressure, family tensions', hi: 'आर्थिक दबाव, पारिवारिक तनाव', sa: 'आर्थिक दबाव, पारिवारिक तनाव', mai: 'आर्थिक दबाव, पारिवारिक तनाव', mr: 'आर्थिक दबाव, पारिवारिक तनाव', ta: 'நிதி அழுத்தம், குடும்ப பதற்றம்', te: 'ఆర్థిక ఒత్తిడి, కుటుంబ ఉద్రిక్తత', bn: 'আর্থিক চাপ, পারিবারিক উত্তেজনা', kn: 'ಆರ್ಥಿಕ ಒತ್ತಡ, ಕೌಟುಂಬಿಕ ಉದ್ವೇಗ', gu: 'આર્થિક દબાણ, પારિવારિક તણાવ' }, jupiter: { en: 'Wealth increase, good speech, family harmony', hi: 'धन वृद्धि, मधुर वाणी', sa: 'धन वृद्धि, मधुर वाणी', mai: 'धन वृद्धि, मधुर वाणी', mr: 'धन वृद्धि, मधुर वाणी', ta: 'செல்வ விருத்தி, நல்ல பேச்சு', te: 'ధన వృద్ధి, మంచి వాక్కు', bn: 'ধন বৃদ্ধি, মধুর বাণী', kn: 'ಧನ ವೃದ್ಧಿ, ಮಧುರ ವಾಣಿ', gu: 'ધન વૃદ્ધિ, મધુર વાણી' }, nature: 'mixed' },
  { house: 3, saturn: { en: 'Courage, effort rewarded, short travels', hi: 'साहस, प्रयास फलित, छोटी यात्राएँ', sa: 'साहस, प्रयास फलित, छोटी यात्राएँ', mai: 'साहस, प्रयास फलित, छोटी यात्राएँ', mr: 'साहस, प्रयास फलित, छोटी यात्राएँ', ta: 'தைரியம், முயற்சி பலன், சிறு பயணம்', te: 'ధైర్యం, ప్రయత్నం ఫలితం, చిన్న ప్రయాణం', bn: 'সাহস, প্রচেষ্টা ফলদায়ক, ছোট যাত্রা', kn: 'ಧೈರ್ಯ, ಪ್ರಯತ್ನ ಫಲ, ಚಿಕ್ಕ ಪ್ರಯಾಣ', gu: 'સાહસ, પ્રયત્ન ફળદાયી, ટૂંકી યાત્રા' }, jupiter: { en: 'Reduced initiative, lethargy, elder sibling issues', hi: 'पहल में कमी, आलस्य', sa: 'पहल में कमी, आलस्य', mai: 'पहल में कमी, आलस्य', mr: 'पहल में कमी, आलस्य', ta: 'முன்முயற்சி குறைவு, சோம்பல்', te: 'చొరవ తగ్గుదల, సోమరితనం', bn: 'উদ্যোগ হ্রাস, আলস্য', kn: 'ಉಪಕ್ರಮ ಕಡಿಮೆ, ಆಲಸ್ಯ', gu: 'પહેલ ઘટે, આળસ' }, nature: 'mixed' },
  { house: 4, saturn: { en: 'Domestic unrest, mother\'s health, property issues', hi: 'घरेलू अशान्ति, माता स्वास्थ्य' }, jupiter: { en: 'Home comforts, vehicle, maternal happiness', hi: 'गृह सुख, वाहन, मातृ सुख', sa: 'गृह सुख, वाहन, मातृ सुख', mai: 'गृह सुख, वाहन, मातृ सुख', mr: 'गृह सुख, वाहन, मातृ सुख', ta: 'இல்ல சுகம், வாகனம், தாய் சுகம்', te: 'గృహ సుఖం, వాహనం, మాతృ సుఖం', bn: 'গৃহ সুখ, যানবাহন, মাতৃ সুখ', kn: 'ಗೃಹ ಸುಖ, ವಾಹನ, ಮಾತೃ ಸುಖ', gu: 'ગૃહ સુખ, વાહન, માતૃ સુખ' }, nature: 'mixed' },
  { house: 5, saturn: { en: 'Children issues, reduced creativity, speculation loss', hi: 'संतान समस्या, रचनात्मकता में कमी', sa: 'संतान समस्या, रचनात्मकता में कमी', mai: 'संतान समस्या, रचनात्मकता में कमी', mr: 'संतान समस्या, रचनात्मकता में कमी', ta: 'குழந்தை பிரச்சனை, படைப்பாற்றல் குறைவு', te: 'సంతాన సమస్య, సృజనాత్మకత తగ్గుదల', bn: 'সন্তান সমস্যা, সৃজনশীলতা হ্রাস', kn: 'ಸಂತಾನ ಸಮಸ್ಯೆ, ಸೃಜನಶೀಲತೆ ಕಡಿಮೆ', gu: 'સંતાન સમસ્યા, સર્જનાત્મકતા ઘટે' }, jupiter: { en: 'Children, education, romance, spiritual growth', hi: 'संतान, शिक्षा, प्रेम, आध्यात्मिक वृद्धि', sa: 'संतान, शिक्षा, प्रेम, आध्यात्मिक वृद्धि', mai: 'संतान, शिक्षा, प्रेम, आध्यात्मिक वृद्धि', mr: 'संतान, शिक्षा, प्रेम, आध्यात्मिक वृद्धि', ta: 'குழந்தை, கல்வி, காதல், ஆன்மீக வளர்ச்சி', te: 'సంతానం, విద్య, ప్రేమ, ఆధ్యాత్మిక వృద్ధి', bn: 'সন্তান, শিক্ষা, প্রেম, আধ্যাত্মিক বৃদ্ধি', kn: 'ಸಂತಾನ, ಶಿಕ್ಷಣ, ಪ್ರೇಮ, ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ', gu: 'સંતાન, શિક્ષણ, પ્રેમ, આધ્યાત્મિક વૃદ્ધિ' }, nature: 'mixed' },
  { house: 6, saturn: { en: 'Victory over enemies, health improvement', hi: 'शत्रुओं पर विजय, स्वास्थ्य सुधार', sa: 'शत्रुओं पर विजय, स्वास्थ्य सुधार', mai: 'शत्रुओं पर विजय, स्वास्थ्य सुधार', mr: 'शत्रुओं पर विजय, स्वास्थ्य सुधार', ta: 'எதிரிகள் மீது வெற்றி, உடல்நல மேம்பாடு', te: 'శత్రువులపై విజయం, ఆరోగ్యం మెరుగు', bn: 'শত্রুর উপর বিজয়, স্বাস্থ্য উন্নতি', kn: 'ಶತ್ರುಗಳ ಮೇಲೆ ಜಯ, ಆರೋಗ್ಯ ಸುಧಾರಣೆ', gu: 'શત્રુઓ પર વિજય, સ્વાસ્થ્ય સુધારો' }, jupiter: { en: 'Debt/disease issues, legal troubles', hi: 'ऋण/रोग, कानूनी परेशानी', sa: 'ऋण/रोग, कानूनी परेशानी', mai: 'ऋण/रोग, कानूनी परेशानी', mr: 'ऋण/रोग, कानूनी परेशानी', ta: 'கடன்/நோய் பிரச்சனை, சட்ட தொல்லை', te: 'ఋణ/రోగ సమస్య, న్యాయ కష్టాలు', bn: 'ঋণ/রোগ সমস্যা, আইনি সমস্যা', kn: 'ಋಣ/ರೋಗ ಸಮಸ್ಯೆ, ಕಾನೂನು ತೊಂದರೆ', gu: 'ઋણ/રોગ સમસ્યા, કાનૂની મુશ્કેલી' }, nature: 'mixed' },
  { house: 7, saturn: { en: 'Relationship strain, partnership issues', hi: 'सम्बन्ध तनाव, साझेदारी समस्या', sa: 'सम्बन्ध तनाव, साझेदारी समस्या', mai: 'सम्बन्ध तनाव, साझेदारी समस्या', mr: 'सम्बन्ध तनाव, साझेदारी समस्या', ta: 'உறவு பதற்றம், கூட்டாண்மை பிரச்சனை', te: 'సంబంధ ఒత్తిడి, భాగస్వామ్య సమస్య', bn: 'সম্পর্কে চাপ, অংশীদারি সমস্যা', kn: 'ಸಂಬಂಧ ಒತ್ತಡ, ಪಾಲುದಾರಿಕೆ ಸಮಸ್ಯೆ', gu: 'સંબંધ તણાવ, ભાગીદારી સમસ્યા' }, jupiter: { en: 'Marriage, partnerships, travel, expansion', hi: 'विवाह, साझेदारी, यात्रा', sa: 'विवाह, साझेदारी, यात्रा', mai: 'विवाह, साझेदारी, यात्रा', mr: 'विवाह, साझेदारी, यात्रा', ta: 'திருமணம், கூட்டாண்மை, பயணம்', te: 'వివాహం, భాగస్వామ్యం, ప్రయాణం', bn: 'বিবাহ, অংশীদারি, যাত্রা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ಪ್ರಯಾಣ', gu: 'વિવાહ, ભાગીદારી, યાત્રા' }, nature: 'mixed' },
  { house: 8, saturn: { en: 'Chronic illness, accidents, transformation', hi: 'दीर्घ रोग, दुर्घटना, परिवर्तन', sa: 'दीर्घ रोग, दुर्घटना, परिवर्तन', mai: 'दीर्घ रोग, दुर्घटना, परिवर्तन', mr: 'दीर्घ रोग, दुर्घटना, परिवर्तन', ta: 'நீண்ட நோய், விபத்து, மாற்றம்', te: 'దీర్ఘ రోగం, ప్రమాదం, పరివర్తన', bn: 'দীর্ঘ রোগ, দুর্ঘটনা, পরিবর্তন', kn: 'ದೀರ್ಘ ರೋಗ, ಅಪಘಾತ, ಪರಿವರ್ತನೆ', gu: 'લાંબી બીમારી, અકસ્માત, પરિવર્તન' }, jupiter: { en: 'Sudden events, inheritance, occult interest', hi: 'अचानक घटनाएँ, विरासत', sa: 'अचानक घटनाएँ, विरासत', mai: 'अचानक घटनाएँ, विरासत', mr: 'अचानक घटनाएँ, विरासत', ta: 'திடீர் நிகழ்வுகள், பரம்பரை சொத்து', te: 'ఆకస్మిక సంఘటనలు, వారసత్వం', bn: 'আকস্মিক ঘটনা, উত্তরাধিকার', kn: 'ಆಕಸ್ಮಿಕ ಘಟನೆ, ಪಿತ್ರಾರ್ಜಿತ', gu: 'અચાનક ઘટના, વારસો' }, nature: 'mixed' },
  { house: 9, saturn: { en: 'Father issues, dharma questioning, delayed fortune', hi: 'पिता समस्या, धर्म प्रश्न, विलम्बित भाग्य', sa: 'पिता समस्या, धर्म प्रश्न, विलम्बित भाग्य', mai: 'पिता समस्या, धर्म प्रश्न, विलम्बित भाग्य', mr: 'पिता समस्या, धर्म प्रश्न, विलम्बित भाग्य', ta: 'தந்தை பிரச்சனை, தர்ம கேள்வி, தாமதமான அதிர்ஷ்டம்', te: 'తండ్రి సమస్య, ధర్మ ప్రశ్న, ఆలస్యమైన అదృష్టం', bn: 'পিতা সমস্যা, ধর্ম প্রশ্ন, বিলম্বিত ভাগ্য', kn: 'ತಂದೆ ಸಮಸ್ಯೆ, ಧರ್ಮ ಪ್ರಶ್ನೆ, ವಿಳಂಬಿತ ಭಾಗ್ಯ', gu: 'પિતા સમસ્યા, ધર્મ પ્રશ્ન, વિલંબિત ભાગ્ય' }, jupiter: { en: 'Fortune, pilgrimage, guru\'s grace, promotion', hi: 'भाग्य, तीर्थयात्रा, गुरु कृपा' }, nature: 'mixed' },
  { house: 10, saturn: { en: 'Career restructuring, heavy responsibility', hi: 'करियर पुनर्गठन, भारी ज़िम्मेदारी', sa: 'करियर पुनर्गठन, भारी ज़िम्मेदारी', mai: 'करियर पुनर्गठन, भारी ज़िम्मेदारी', mr: 'करियर पुनर्गठन, भारी ज़िम्मेदारी', ta: 'தொழில் மறுசீரமைப்பு, பெரும் பொறுப்பு', te: 'వృత్తి పునర్నిర్మాణం, భారీ బాధ్యత', bn: 'কর্মজীবন পুনর্গঠন, ভারী দায়িত্ব', kn: 'ವೃತ್ತಿ ಪುನರ್ರಚನೆ, ಭಾರಿ ಜವಾಬ್ದಾರಿ', gu: 'કારકિર્દી પુનર્ગઠન, ભારે જવાબદારી' }, jupiter: { en: 'Career peak, recognition, authority', hi: 'करियर शिखर, मान्यता, अधिकार', sa: 'करियर शिखर, मान्यता, अधिकार', mai: 'करियर शिखर, मान्यता, अधिकार', mr: 'करियर शिखर, मान्यता, अधिकार', ta: 'தொழில் உச்சம், அங்கீகாரம், அதிகாரம்', te: 'వృత్తి శిఖరం, గుర్తింపు, అధికారం', bn: 'কর্মজীবন শীর্ষ, স্বীকৃতি, কর্তৃত্ব', kn: 'ವೃತ್ತಿ ಶಿಖರ, ಮನ್ನಣೆ, ಅಧಿಕಾರ', gu: 'કારકિર્દી શિખર, માન્યતા, અધિકાર' }, nature: 'mixed' },
  { house: 11, saturn: { en: 'Gains through hard work, elder sibling support', hi: 'कठिन परिश्रम से लाभ', sa: 'कठिन परिश्रम से लाभ', mai: 'कठिन परिश्रम से लाभ', mr: 'कठिन परिश्रम से लाभ', ta: 'கடின உழைப்பால் லாபம், மூத்த சகோதர ஆதரவு', te: 'కఠిన శ్రమ ద్వారా లాభం, అన్న ఆదరణ', bn: 'কঠিন পরিশ্রমে লাভ, জ্যেষ্ঠ ভাই সহায়তা', kn: 'ಕಠಿಣ ಶ್ರಮದಿಂದ ಲಾಭ, ಹಿರಿಯ ಸಹೋದರ ಬೆಂಬಲ', gu: 'કઠિન પરિશ્રમથી લાભ, મોટા ભાઈનો ટેકો' }, jupiter: { en: 'Maximum gains, fulfilled desires, social expansion', hi: 'अधिकतम लाभ, इच्छा पूर्ति', sa: 'अधिकतम लाभ, इच्छा पूर्ति', mai: 'अधिकतम लाभ, इच्छा पूर्ति', mr: 'अधिकतम लाभ, इच्छा पूर्ति', ta: 'அதிகபட்ச லாபம், விருப்பம் நிறைவேறுதல்', te: 'గరిష్ఠ లాభం, కోరికలు నెరవేరడం', bn: 'সর্বাধিক লাভ, ইচ্ছা পূর্ণ', kn: 'ಗರಿಷ್ಠ ಲಾಭ, ಆಸೆ ಪೂರ್ಣ', gu: 'મહત્તમ લાભ, ઇચ્છા પૂર્તિ' }, nature: 'good' },
  { house: 12, saturn: { en: 'Expenditure, isolation, foreign travel, spiritual retreat', hi: 'व्यय, एकांत, विदेश यात्रा', sa: 'व्यय, एकांत, विदेश यात्रा', mai: 'व्यय, एकांत, विदेश यात्रा', mr: 'व्यय, एकांत, विदेश यात्रा', ta: 'செலவு, தனிமை, வெளிநாட்டு பயணம்', te: 'ఖర్చు, ఒంటరితనం, విదేశ ప్రయాణం', bn: 'ব্যয়, একাকীত্ব, বিদেশ যাত্রা', kn: 'ವ್ಯಯ, ಏಕಾಂತ, ವಿದೇಶ ಪ್ರಯಾಣ', gu: 'ખર્ચ, એકાંત, વિદેશ યાત્રા' }, jupiter: { en: 'Expenses, spiritual growth, foreign settlement', hi: 'व्यय, आध्यात्मिक वृद्धि, विदेश', sa: 'व्यय, आध्यात्मिक वृद्धि, विदेश', mai: 'व्यय, आध्यात्मिक वृद्धि, विदेश', mr: 'व्यय, आध्यात्मिक वृद्धि, विदेश', ta: 'செலவு, ஆன்மீக வளர்ச்சி, வெளிநாடு', te: 'ఖర్చు, ఆధ్యాత్మిక వృద్ధి, విదేశం', bn: 'ব্যয়, আধ্যাত্মিক বৃদ্ধি, বিদেশ', kn: 'ವ್ಯಯ, ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ, ವಿದೇಶ', gu: 'ખર્ચ, આધ્યાત્મિક વૃદ્ધિ, વિદેશ' }, nature: 'mixed' },
];

export default function LearnGocharPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((LT as unknown as Record<string, LocaleText>)[key], locale);
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <SanskritTermCard term="Gochar" devanagari="गोचर" transliteration="Gocara" meaning="Transit / Planetary movement" />
        <SanskritTermCard term="Janma Rashi" devanagari="जन्म राशि" transliteration="Janma Rasi" meaning="Birth Moon sign" />
        <SanskritTermCard term="Sade Sati" devanagari="साढ़ेसाती" transliteration="Sadhesati" meaning="Saturn's 7.5 year transit" />
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Ashtakavarga" meaning="8-fold transit strength" />
        <SanskritTermCard term="Vedha" devanagari="वेध" transliteration="Vedha" meaning="Transit obstruction" />
        <SanskritTermCard term="Bindu" devanagari="बिन्दु" transliteration="Bindu" meaning="Ashtakavarga point" />
      </div>

      {/* Section 1: What is Gochar */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p style={bodyFont}>{t('whatContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent2')}</p>
      </LessonSection>

      {/* Section 2: Moon sign */}
      <LessonSection number={2} title={t('moonTitle')}>
        <p style={bodyFont}>{t('moonContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('moonContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {tl({ en: 'Transit house = Current planet sign - Birth Moon sign + 1', hi: 'गोचर भाव = ग्रह की वर्तमान राशि - जन्म चन्द्र राशि + 1', sa: 'गोचर भाव = ग्रह की वर्तमान राशि - जन्म चन्द्र राशि + 1', ta: 'Transit house = Current planet sign - Birth Moon sign + 1', te: 'Transit house = Current planet sign - Birth Moon sign + 1', bn: 'Transit house = Current planet sign - Birth Moon sign + 1', kn: 'Transit house = Current planet sign - Birth Moon sign + 1', gu: 'Transit house = Current planet sign - Birth Moon sign + 1', mai: 'गोचर भाव = ग्रह की वर्तमान राशि - जन्म चन्द्र राशि + 1', mr: 'गोचर भाव = ग्रह की वर्तमान राशि - जन्म चन्द्र राशि + 1' }, locale)}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en'
              ? 'Example: If birth Moon is Taurus (2) and Saturn is currently in Cancer (4) → Saturn transit in 3rd house from Moon'
              : 'उदाहरण: यदि जन्म चन्द्र वृषभ (2) में है और शनि वर्तमान में कर्क (4) में → चन्द्र से 3रे भाव में शनि गोचर'}
          </p>
        </div>
      </LessonSection>

      {/* Section 3: Transit Speeds */}
      <LessonSection number={3} title={t('speedTitle')}>
        <div className="space-y-2">
          {TRANSIT_SPEEDS.map((ts, i) => (
            <motion.div
              key={ts.planet.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3"
            >
              <div className="w-16 text-right text-sm font-semibold flex-shrink-0" style={{ color: ts.color }}>
                {tl(ts.planet, locale)}
              </div>
              <div className="w-40 text-text-secondary text-xs font-mono flex-shrink-0">{ts.speed}</div>
              <div className="text-text-secondary/70 text-xs" style={bodyFont}>{tl(ts.effect, locale)}</div>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-text-secondary/75 text-sm italic" style={bodyFont}>
          {locale === 'en'
            ? 'Slower planets (Jupiter, Saturn, Rahu/Ketu) have the most profound and lasting effects since they influence a house for months or years. Fast-moving planets (Moon, Sun, Mercury, Venus) are used for fine-tuning predictions within the framework set by the slow movers.'
            : 'धीमे ग्रह (गुरु, शनि, राहु/केतु) सबसे गहरे और स्थायी प्रभाव डालते हैं क्योंकि वे महीनों या वर्षों तक एक भाव को प्रभावित करते हैं। तीव्र ग्रह (चन्द्र, सूर्य, बुध, शुक्र) धीमे ग्रहों द्वारा निर्धारित ढाँचे के भीतर भविष्यवाणियों को सूक्ष्म-समायोजित करते हैं।'}
        </p>
      </LessonSection>

      {/* Section 4: Sade Sati */}
      <LessonSection number={4} title={t('saturnTitle')}>
        <p style={bodyFont}>{t('saturnContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('saturnContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-blue-400/20">
          <p className="text-blue-300 font-mono text-sm mb-2">
            {tl({ en: 'Three Phases of Sade Sati:', hi: 'साढ़े साती के तीन चरण:', sa: 'साढ़े साती के तीन चरण:', ta: 'Three Phases of Sade Sati:', te: 'Three Phases of Sade Sati:', bn: 'Three Phases of Sade Sati:', kn: 'Three Phases of Sade Sati:', gu: 'Three Phases of Sade Sati:', mai: 'साढ़े साती के तीन चरण:', mr: 'साढ़े साती के तीन चरण:' }, locale)}
          </p>
          <div className="space-y-1">
            <p className="text-blue-200/80 font-mono text-xs">
              {tl({ en: '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction', hi: 'प्रथम चरण (चन्द्र से 12वाँ): उदय चरण — मानसिक तनाव, आर्थिक दबाव, दिशा पर संदेह', sa: 'प्रथम चरण (चन्द्र से 12वाँ): उदय चरण — मानसिक तनाव, आर्थिक दबाव, दिशा पर संदेह', ta: '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction', te: '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction', bn: '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction', kn: '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction', gu: '1st Phase (12th from Moon): Rising phase — mental stress, financial pressure, doubt about direction', mai: 'प्रथम चरण (चन्द्र से 12वाँ): उदय चरण — मानसिक तनाव, आर्थिक दबाव, दिशा पर संदेह', mr: 'प्रथम चरण (चन्द्र से 12वाँ): उदय चरण — मानसिक तनाव, आर्थिक दबाव, दिशा पर संदेह' }, locale)}
            </p>
            <p className="text-blue-200/80 font-mono text-xs">
              {tl({ en: '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval', hi: 'द्वितीय चरण (चन्द्र से 1ला): चरम तीव्रता — पहचान परिवर्तन, स्वास्थ्य चुनौती, करियर उथल-पुथल', sa: 'द्वितीय चरण (चन्द्र से 1ला): चरम तीव्रता — पहचान परिवर्तन, स्वास्थ्य चुनौती, करियर उथल-पुथल', ta: '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval', te: '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval', bn: '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval', kn: '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval', gu: '2nd Phase (1st from Moon): Peak intensity — identity transformation, health challenges, career upheaval', mai: 'द्वितीय चरण (चन्द्र से 1ला): चरम तीव्रता — पहचान परिवर्तन, स्वास्थ्य चुनौती, करियर उथल-पुथल', mr: 'द्वितीय चरण (चन्द्र से 1ला): चरम तीव्रता — पहचान परिवर्तन, स्वास्थ्य चुनौती, करियर उथल-पुथल' }, locale)}
            </p>
            <p className="text-blue-200/80 font-mono text-xs">
              {tl({ en: '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments', hi: 'तृतीय चरण (चन्द्र से 2रा): अस्त चरण — आर्थिक पुनर्गठन, वाणी सम्बन्धी, पारिवारिक समायोजन', sa: 'तृतीय चरण (चन्द्र से 2रा): अस्त चरण — आर्थिक पुनर्गठन, वाणी सम्बन्धी, पारिवारिक समायोजन', ta: '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments', te: '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments', bn: '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments', kn: '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments', gu: '3rd Phase (2nd from Moon): Setting phase — financial restructuring, speech issues, family adjustments', mai: 'तृतीय चरण (चन्द्र से 2रा): अस्त चरण — आर्थिक पुनर्गठन, वाणी सम्बन्धी, पारिवारिक समायोजन', mr: 'तृतीय चरण (चन्द्र से 2रा): अस्त चरण — आर्थिक पुनर्गठन, वाणी सम्बन्धी, पारिवारिक समायोजन' }, locale)}
            </p>
          </div>
          <p className="text-blue-200/50 font-mono text-xs mt-2">
            {tl({ en: 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life', hi: 'शनि कक्षा: 29.46 वर्ष → हर व्यक्ति जीवन में 2-3 बार साढ़े साती का सामना करता है', sa: 'शनि कक्षा: 29.46 वर्ष → हर व्यक्ति जीवन में 2-3 बार साढ़े साती का सामना करता है', ta: 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life', te: 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life', bn: 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life', kn: 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life', gu: 'Saturn orbit: 29.46 years → everyone faces Sade Sati 2-3 times in life', mai: 'शनि कक्षा: 29.46 वर्ष → हर व्यक्ति जीवन में 2-3 बार साढ़े साती का सामना करता है', mr: 'शनि कक्षा: 29.46 वर्ष → हर व्यक्ति जीवन में 2-3 बार साढ़े साती का सामना करता है' }, locale)}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Jupiter Transit */}
      <LessonSection number={5} title={t('jupiterTitle')}>
        <p style={bodyFont}>{t('jupiterContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">
              {tl({ en: 'Auspicious Jupiter transit houses', hi: 'शुभ गुरु गोचर भाव', sa: 'शुभ गुरु गोचर भाव', ta: 'Auspicious Jupiter transit houses', te: 'Auspicious Jupiter transit houses', bn: 'Auspicious Jupiter transit houses', kn: 'Auspicious Jupiter transit houses', gu: 'Auspicious Jupiter transit houses', mai: 'शुभ गुरु गोचर भाव', mr: 'शुभ गुरु गोचर भाव' }, locale)}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {locale === 'en'
                ? '2nd (wealth), 5th (children/education), 7th (marriage/partnership), 9th (fortune/dharma), 11th (gains/desires fulfilled)'
                : '2रा (धन), 5वाँ (संतान/शिक्षा), 7वाँ (विवाह/साझेदारी), 9वाँ (भाग्य/धर्म), 11वाँ (लाभ/इच्छा पूर्ति)'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
            <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">
              {tl({ en: 'Challenging Jupiter transit houses', hi: 'कठिन गुरु गोचर भाव', sa: 'कठिन गुरु गोचर भाव', ta: 'Challenging Jupiter transit houses', te: 'Challenging Jupiter transit houses', bn: 'Challenging Jupiter transit houses', kn: 'Challenging Jupiter transit houses', gu: 'Challenging Jupiter transit houses', mai: 'कठिन गुरु गोचर भाव', mr: 'कठिन गुरु गोचर भाव' }, locale)}
            </div>
            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
              {locale === 'en'
                ? '3rd (reduced initiative), 6th (debt/health), 8th (sudden events), 10th (heavy workload), 12th (expenses/loss)'
                : '3रा (पहल में कमी), 6ठा (ऋण/स्वास्थ्य), 8वाँ (अचानक घटनाएँ), 10वाँ (भारी कार्यभार), 12वाँ (व्यय/हानि)'}
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Double Transit Theory */}
      <LessonSection number={6} title={t('doubleTransitTitle')} variant="highlight">
        <p style={bodyFont}>{t('doubleTransitContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('doubleTransitContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Double Transit Examples:', hi: 'दोहरा गोचर उदाहरण:', sa: 'दोहरा गोचर उदाहरण:', ta: 'Double Transit Examples:', te: 'Double Transit Examples:', bn: 'Double Transit Examples:', kn: 'Double Transit Examples:', gu: 'Double Transit Examples:', mai: 'दोहरा गोचर उदाहरण:', mr: 'दोहरा गोचर उदाहरण:' }, locale)}
          </p>
          <div className="space-y-1.5 text-gold-light/80 font-mono text-xs">
            <p>{tl({ en: 'Marriage: Jupiter + Saturn both aspect 7th house from Moon', hi: 'विवाह: गुरु + शनि दोनों चन्द्र से 7वें भाव को दृष्टि करें', sa: 'विवाह: गुरु + शनि दोनों चन्द्र से 7वें भाव को दृष्टि करें', ta: 'Marriage: Jupiter + Saturn both aspect 7th house from Moon', te: 'Marriage: Jupiter + Saturn both aspect 7th house from Moon', bn: 'Marriage: Jupiter + Saturn both aspect 7th house from Moon', kn: 'Marriage: Jupiter + Saturn both aspect 7th house from Moon', gu: 'Marriage: Jupiter + Saturn both aspect 7th house from Moon', mai: 'विवाह: गुरु + शनि दोनों चन्द्र से 7वें भाव को दृष्टि करें', mr: 'विवाह: गुरु + शनि दोनों चन्द्र से 7वें भाव को दृष्टि करें' }, locale)}</p>
            <p>{tl({ en: 'Job change: Jupiter + Saturn both aspect 10th house from Moon', hi: 'नौकरी परिवर्तन: गुरु + शनि दोनों 10वें भाव को दृष्टि करें', sa: 'नौकरी परिवर्तन: गुरु + शनि दोनों 10वें भाव को दृष्टि करें', ta: 'Job change: Jupiter + Saturn both aspect 10th house from Moon', te: 'Job change: Jupiter + Saturn both aspect 10th house from Moon', bn: 'Job change: Jupiter + Saturn both aspect 10th house from Moon', kn: 'Job change: Jupiter + Saturn both aspect 10th house from Moon', gu: 'Job change: Jupiter + Saturn both aspect 10th house from Moon', mai: 'नौकरी परिवर्तन: गुरु + शनि दोनों 10वें भाव को दृष्टि करें', mr: 'नौकरी परिवर्तन: गुरु + शनि दोनों 10वें भाव को दृष्टि करें' }, locale)}</p>
            <p>{tl({ en: 'Child birth: Jupiter + Saturn both aspect 5th house from Moon', hi: 'संतान जन्म: गुरु + शनि दोनों 5वें भाव को दृष्टि करें', sa: 'संतान जन्म: गुरु + शनि दोनों 5वें भाव को दृष्टि करें', ta: 'Child birth: Jupiter + Saturn both aspect 5th house from Moon', te: 'Child birth: Jupiter + Saturn both aspect 5th house from Moon', bn: 'Child birth: Jupiter + Saturn both aspect 5th house from Moon', kn: 'Child birth: Jupiter + Saturn both aspect 5th house from Moon', gu: 'Child birth: Jupiter + Saturn both aspect 5th house from Moon', mai: 'संतान जन्म: गुरु + शनि दोनों 5वें भाव को दृष्टि करें', mr: 'संतान जन्म: गुरु + शनि दोनों 5वें भाव को दृष्टि करें' }, locale)}</p>
            <p>{tl({ en: 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon', hi: 'सम्पत्ति खरीद: गुरु + शनि दोनों 4वें भाव को दृष्टि करें', sa: 'सम्पत्ति खरीद: गुरु + शनि दोनों 4वें भाव को दृष्टि करें', ta: 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon', te: 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon', bn: 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon', kn: 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon', gu: 'Property purchase: Jupiter + Saturn both aspect 4th house from Moon', mai: 'सम्पत्ति खरीद: गुरु + शनि दोनों 4वें भाव को दृष्टि करें', mr: 'सम्पत्ति खरीद: गुरु + शनि दोनों 4वें भाव को दृष्टि करें' }, locale)}</p>
          </div>
          <p className="text-gold-light/50 font-mono text-xs mt-2 italic">
            {tl({ en: 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.', hi: 'नोट: घटना को चल रही दशा का समर्थन भी होना चाहिए — दोहरा गोचर समय विंडो देता है, दशा वादा देती है।', sa: 'नोट: घटना को चल रही दशा का समर्थन भी होना चाहिए — दोहरा गोचर समय विंडो देता है, दशा वादा देती है।', ta: 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.', te: 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.', bn: 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.', kn: 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.', gu: 'Note: The event must also be supported by the running Dasha — double transit provides the timing window, Dasha provides the promise.', mai: 'नोट: घटना को चल रही दशा का समर्थन भी होना चाहिए — दोहरा गोचर समय विंडो देता है, दशा वादा देती है।', mr: 'नोट: घटना को चल रही दशा का समर्थन भी होना चाहिए — दोहरा गोचर समय विंडो देता है, दशा वादा देती है।' }, locale)}
          </p>
        </div>
      </LessonSection>

      {/* Section 7: Rahu-Ketu */}
      <LessonSection number={7} title={t('rahuKetuTitle')}>
        <p style={bodyFont}>{t('rahuKetuContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('rahuKetuContent2')}</p>
      </LessonSection>

      {/* Section 8: Ashtakavarga */}
      <LessonSection number={8} title={t('ashtakavargaTitle')}>
        <p style={bodyFont}>{t('ashtakavargaContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('ashtakavargaContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Ashtakavarga Scoring:', hi: 'अष्टकवर्ग अंकन:', sa: 'अष्टकवर्ग अंकन:', ta: 'Ashtakavarga Scoring:', te: 'Ashtakavarga Scoring:', bn: 'Ashtakavarga Scoring:', kn: 'Ashtakavarga Scoring:', gu: 'Ashtakavarga Scoring:', mai: 'अष्टकवर्ग अंकन:', mr: 'अष्टकवर्ग अंकन:' }, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-red-400/10 border border-red-400/15">
              <span className="text-red-400 font-mono font-bold">0-2</span>
              <span className="text-text-secondary ml-2">{tl({ en: 'Very weak', hi: 'अत्यन्त दुर्बल', sa: 'अत्यन्त दुर्बल', ta: 'Very weak', te: 'Very weak', bn: 'Very weak', kn: 'Very weak', gu: 'Very weak', mai: 'अत्यन्त दुर्बल', mr: 'अत्यन्त दुर्बल' }, locale)}</span>
            </div>
            <div className="p-2 rounded bg-amber-400/10 border border-amber-400/15">
              <span className="text-amber-400 font-mono font-bold">3</span>
              <span className="text-text-secondary ml-2">{tl({ en: 'Below average', hi: 'औसत से नीचे', sa: 'औसत से नीचे', ta: 'Below average', te: 'Below average', bn: 'Below average', kn: 'Below average', gu: 'Below average', mai: 'औसत से नीचे', mr: 'औसत से नीचे' }, locale)}</span>
            </div>
            <div className="p-2 rounded bg-blue-400/10 border border-blue-400/15">
              <span className="text-blue-400 font-mono font-bold">4-5</span>
              <span className="text-text-secondary ml-2">{tl({ en: 'Good', hi: 'शुभ', sa: 'शुभ', ta: 'Good', te: 'Good', bn: 'Good', kn: 'Good', gu: 'Good', mai: 'शुभ', mr: 'शुभ' }, locale)}</span>
            </div>
            <div className="p-2 rounded bg-emerald-400/10 border border-emerald-400/15">
              <span className="text-emerald-400 font-mono font-bold">6-8</span>
              <span className="text-text-secondary ml-2">{tl({ en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्ट', ta: 'Excellent', te: 'Excellent', bn: 'Excellent', kn: 'Excellent', gu: 'Excellent', mai: 'उत्कृष्ट', mr: 'उत्कृष्ट' }, locale)}</span>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 9: Transit through houses table */}
      <LessonSection number={9} title={t('transitHouseTitle')}>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark w-12">{tl({ en: 'House', hi: 'भाव', sa: 'भाव', ta: 'House', te: 'House', bn: 'House', kn: 'House', gu: 'House', mai: 'भाव', mr: 'भाव' }, locale)}</th>
                <th className="text-left py-2 px-2 text-blue-400">{tl({ en: 'Saturn Transit Effect', hi: 'शनि गोचर प्रभाव', sa: 'शनि गोचर प्रभाव', ta: 'Saturn Transit Effect', te: 'Saturn Transit Effect', bn: 'Saturn Transit Effect', kn: 'Saturn Transit Effect', gu: 'Saturn Transit Effect', mai: 'शनि गोचर प्रभाव', mr: 'शनि गोचर प्रभाव' }, locale)}</th>
                <th className="text-left py-2 px-2 text-amber-400">{tl({ en: 'Jupiter Transit Effect', hi: 'गुरु गोचर प्रभाव', sa: 'गुरु गोचर प्रभाव', ta: 'Jupiter Transit Effect', te: 'Jupiter Transit Effect', bn: 'Jupiter Transit Effect', kn: 'Jupiter Transit Effect', gu: 'Jupiter Transit Effect', mai: 'गुरु गोचर प्रभाव', mr: 'गुरु गोचर प्रभाव' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {TRANSIT_HOUSES.map((th) => (
                <tr key={th.house} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 text-gold-light font-mono font-bold">{th.house}</td>
                  <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{isHi ? th.saturn.hi : th.saturn.en}</td>
                  <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{isHi ? th.jupiter.hi : th.jupiter.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 10: Chandra Balam & Tara Balam */}
      <LessonSection number={10} title={t('balamTitle')}>
        <p style={bodyFont}>{t('balamContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Chandra Balam (Moon Strength):', hi: 'चन्द्र बलम (चन्द्र शक्ति):', sa: 'चन्द्र बलम (चन्द्र शक्ति):', ta: 'Chandra Balam (Moon Strength):', te: 'Chandra Balam (Moon Strength):', bn: 'Chandra Balam (Moon Strength):', kn: 'Chandra Balam (Moon Strength):', gu: 'Chandra Balam (Moon Strength):', mai: 'चन्द्र बलम (चन्द्र शक्ति):', mr: 'चन्द्र बलम (चन्द्र शक्ति):' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Favourable houses from birth Moon: 3, 6, 7, 10, 11'
              : 'जन्म चन्द्र से शुभ भाव: 3, 6, 7, 10, 11'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Unfavourable: 1, 2, 4, 5, 8, 9, 12'
              : 'अशुभ: 1, 2, 4, 5, 8, 9, 12'}
          </p>
          <p className="text-gold-light font-mono text-sm mb-2 mt-3">
            {tl({ en: 'Tara Balam (Star Strength):', hi: 'तारा बलम (तारा शक्ति):', sa: 'तारा बलम (तारा शक्ति):', ta: 'Tara Balam (Star Strength):', te: 'Tara Balam (Star Strength):', bn: 'Tara Balam (Star Strength):', kn: 'Tara Balam (Star Strength):', gu: 'Tara Balam (Star Strength):', mai: 'तारा बलम (तारा शक्ति):', mr: 'तारा बलम (तारा शक्ति):' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? '9 Taras: Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Parama Mitra'
              : '9 तारा: जन्म, सम्पत्, विपत्, क्षेम, प्रत्यरि, साधक, वध, मित्र, परम मित्र'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Favourable Taras: 2 (Sampat), 4 (Kshema), 6 (Sadhaka), 8 (Mitra), 9 (Parama Mitra)'
              : 'शुभ तारा: 2 (सम्पत्), 4 (क्षेम), 6 (साधक), 8 (मित्र), 9 (परम मित्र)'}
          </p>
        </div>
      </LessonSection>

      {/* Section 11: Related modules and tools */}
      <LessonSection number={11} title={t('modulesTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/12-1', label: { en: 'Lesson 12-1: Introduction to Transits', hi: 'पाठ 12-1: गोचर परिचय', sa: 'पाठ 12-1: गोचर परिचय', mai: 'पाठ 12-1: गोचर परिचय', mr: 'पाठ 12-1: गोचर परिचय', ta: 'பாடம் 12-1: கோசாரம் அறிமுகம்', te: 'పాఠం 12-1: గోచార పరిచయం', bn: 'পাঠ 12-1: গোচর পরিচিতি', kn: 'ಪಾಠ 12-1: ಗೋಚಾರ ಪರಿಚಯ', gu: 'પાઠ 12-1: ગોચર પરિચય' } },
            { href: '/learn/modules/12-2', label: { en: 'Lesson 12-2: Saturn & Jupiter Transits', hi: 'पाठ 12-2: शनि और गुरु गोचर', sa: 'पाठ 12-2: शनि और गुरु गोचर', mai: 'पाठ 12-2: शनि और गुरु गोचर', mr: 'पाठ 12-2: शनि और गुरु गोचर', ta: 'பாடம் 12-2: சனி & வியாழன் கோசாரம்', te: 'పాఠం 12-2: శని & గురు గోచారం', bn: 'পাঠ 12-2: শনি ও বৃহস্পতি গোচর', kn: 'ಪಾಠ 12-2: ಶನಿ ಮತ್ತು ಗುರು ಗೋಚಾರ', gu: 'પાઠ 12-2: શનિ અને ગુરુ ગોચર' } },
            { href: '/learn/modules/12-3', label: { en: 'Lesson 12-3: Ashtakavarga System', hi: 'पाठ 12-3: अष्टकवर्ग प्रणाली', sa: 'पाठ 12-3: अष्टकवर्ग प्रणाली', mai: 'पाठ 12-3: अष्टकवर्ग प्रणाली', mr: 'पाठ 12-3: अष्टकवर्ग प्रणाली', ta: 'பாடம் 12-3: அஷ்டகவர்க்க முறை', te: 'పాఠం 12-3: అష్టకవర్గ పద్ధతి', bn: 'পাঠ 12-3: অষ্টকবর্গ পদ্ধতি', kn: 'ಪಾಠ 12-3: ಅಷ್ಟಕವರ್ಗ ಪದ್ಧತಿ', gu: 'પાઠ 12-3: અષ્ટકવર્ગ પદ્ધતિ' } },
            { href: '/transits', label: { en: 'Current Transit Positions', hi: 'वर्तमान गोचर स्थितियाँ', sa: 'वर्तमान गोचर स्थितियाँ', mai: 'वर्तमान गोचर स्थितियाँ', mr: 'वर्तमान गोचर स्थितियाँ', ta: 'தற்போதைய கோசார நிலைகள்', te: 'ప్రస్తుత గోచార స్థానాలు', bn: 'বর্তমান গোচর অবস্থান', kn: 'ಪ್ರಸ್ತುತ ಗೋಚಾರ ಸ್ಥಾನಗಳು', gu: 'વર્તમાન ગોચર સ્થિતિઓ' }, tool: true },
            { href: '/sade-sati', label: { en: 'Sade Sati Calculator', hi: 'साढ़े साती कैलकुलेटर', sa: 'साढ़े साती कैलकुलेटर', mai: 'साढ़े साती कैलकुलेटर', mr: 'साढ़े साती कैलकुलेटर', ta: 'சாடே சாதி கணிப்பான்', te: 'సాడే సాతి కాల్క్యులేటర్', bn: 'সাড়ে সাতি ক্যালকুলেটর', kn: 'ಸಾಡೆ ಸಾತಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್', gu: 'સાડા સાતી કેલ્ક્યુલેટર' }, tool: true },
            { href: '/calendar', label: { en: 'Transit Calendar', hi: 'गोचर कैलेंडर', sa: 'गोचर कैलेंडर', mai: 'गोचर कैलेंडर', mr: 'गोचर कैलेंडर', ta: 'கோசார நாட்காட்டி', te: 'గోచార క్యాలెండర్', bn: 'গোচর ক্যালেন্ডার', kn: 'ಗೋಚಾರ ಕ್ಯಾಲೆಂಡರ್', gu: 'ગોચર કેલેન્ડર' }, tool: true },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border hover:border-gold-primary/30 transition-colors block ${
                'tool' in mod ? 'border-blue-400/15 bg-blue-400/3' : 'border-gold-primary/10'
              }`}
            >
              <span className={`text-xs font-medium ${'tool' in mod ? 'text-blue-300' : 'text-gold-light'}`} style={headingFont}>
                {isHi ? mod.label.hi : mod.label.en}
              </span>
              {'tool' in mod && (
                <span className="text-text-tertiary text-xs block mt-0.5">
                  {tl({ en: 'Tool', hi: 'उपकरण', sa: 'उपकरण', ta: 'Tool', te: 'Tool', bn: 'Tool', kn: 'Tool', gu: 'Tool', mai: 'उपकरण', mr: 'उपकरण' }, locale)} →
                </span>
              )}
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/transits"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')} →
        </Link>
      </div>
    </div>
  );
}

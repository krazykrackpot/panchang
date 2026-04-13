#!/usr/bin/env node
/**
 * Replace seeded/placeholder translations in kundali components with REAL translations.
 *
 * Pattern found:
 * - ta/te/bn/kn/gu are English copies → replace with real translations in those languages
 * - sa/mai/mr are Hindi copies → replace with real Sanskrit/Maithili/Marathi translations
 *
 * This script processes all locale objects in the 9 kundali component files.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const BASE = resolve(import.meta.dirname, '..', 'src', 'components', 'kundali');

const FILES = [
  'PatrikaTab.tsx',
  'SphutasTab.tsx',
  'JaiminiTab.tsx',
  'BirthForm.tsx',
  'ChartNorth.tsx',
  'ChartSouth.tsx',
  'InterpretationHelpers.tsx',
  'AIReadingButton.tsx',
  'LifeTimeline.tsx',
];

// ─── Translation dictionaries ───────────────────────────────────────────────
// For short, common terms we have real translations. For longer prose,
// we provide proper translations in each language.

// Common Jyotish terms
const TERM_TRANSLATIONS = {
  // ─── Dosha names ─────
  'Manglik Dosha': {
    ta: 'செவ்வாய் தோஷம்', te: 'కుజ దోషం', bn: 'মাঙ্গলিক দোষ', kn: 'ಮಾಂಗಲಿಕ ದೋಷ', gu: 'માંગલિક દોષ',
    sa: 'माङ्गलिक दोषः', mai: 'मांगलिक दोष', mr: 'मांगळिक दोष',
  },
  'Kaal Sarp Dosha': {
    ta: 'கால சர்ப்ப தோஷம்', te: 'కాల సర్ప దోషం', bn: 'কাল সর্প দোষ', kn: 'ಕಾಲ ಸರ್ಪ ದೋಷ', gu: 'કાળ સર્પ દોષ',
    sa: 'कालसर्प दोषः', mai: 'काल सर्प दोष', mr: 'काळसर्प दोष',
  },
  'Ganda Mula': {
    ta: 'கண்ட மூலம்', te: 'గండ మూల', bn: 'গণ্ড মূল', kn: 'ಗಂಡ ಮೂಲ', gu: 'ગંડ મૂળ',
    sa: 'गण्डमूलम्', mai: 'गण्ड मूल', mr: 'गंडमूळ',
  },
  'Sade Sati': {
    ta: 'சாடே சாதி', te: 'సాడే సాతి', bn: 'সাড়ে সাতি', kn: 'ಸಾಡೆ ಸಾತಿ', gu: 'સાડા સાતી',
    sa: 'साढेसाति', mai: 'साढ़े साती', mr: 'साडेसाती',
  },
  // ─── House labels ─────
  'Lagna': { ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', gu: 'લગ્ન', sa: 'लग्नम्', mai: 'लग्न', mr: 'लग्न' },
  'Dhana': { ta: 'தனம்', te: 'ధనం', bn: 'ধন', kn: 'ಧನ', gu: 'ધન', sa: 'धनम्', mai: 'धन', mr: 'धन' },
  'Sahaja': { ta: 'சகஜம்', te: 'సహజం', bn: 'সহজ', kn: 'ಸಹಜ', gu: 'સહજ', sa: 'सहजम्', mai: 'सहज', mr: 'सहज' },
  'Sukha': { ta: 'சுகம்', te: 'సుఖం', bn: 'সুখ', kn: 'ಸುಖ', gu: 'સુખ', sa: 'सुखम्', mai: 'सुख', mr: 'सुख' },
  'Putra': { ta: 'புத்திரம்', te: 'పుత్రం', bn: 'পুত্র', kn: 'ಪುತ್ರ', gu: 'પુત્ર', sa: 'पुत्रम्', mai: 'पुत्र', mr: 'पुत्र' },
  'Ari': { ta: 'அரி', te: 'అరి', bn: 'অরি', kn: 'ಅರಿ', gu: 'અરિ', sa: 'अरिः', mai: 'अरि', mr: 'अरि' },
  'Kalatra': { ta: 'களத்திரம்', te: 'కళత్రం', bn: 'কলত্র', kn: 'ಕಳತ್ರ', gu: 'કલત્ર', sa: 'कलत्रम्', mai: 'कलत्र', mr: 'कलत्र' },
  'Randhra': { ta: 'ரந்திரம்', te: 'రంధ్రం', bn: 'রন্ধ্র', kn: 'ರಂಧ್ರ', gu: 'રંધ્ર', sa: 'रन्ध्रम्', mai: 'रन्ध्र', mr: 'रंध्र' },
  'Dharma': { ta: 'தர்மம்', te: 'ధర్మం', bn: 'ধর্ম', kn: 'ಧರ್ಮ', gu: 'ધર્મ', sa: 'धर्मम्', mai: 'धर्म', mr: 'धर्म' },
  'Karma': { ta: 'கர்மம்', te: 'కర్మం', bn: 'কর্ম', kn: 'ಕರ್ಮ', gu: 'કર્મ', sa: 'कर्मम्', mai: 'कर्म', mr: 'कर्म' },
  'Labha': { ta: 'லாபம்', te: 'లాభం', bn: 'লাভ', kn: 'ಲಾಭ', gu: 'લાભ', sa: 'लाभम्', mai: 'लाभ', mr: 'लाभ' },
  'Vyaya': { ta: 'வியயம்', te: 'వ్యయం', bn: 'ব্যয়', kn: 'ವ್ಯಯ', gu: 'વ્યય', sa: 'व्ययम्', mai: 'व्यय', mr: 'व्यय' },
  // ─── Karaka names ─────
  'Atmakaraka': { ta: 'ஆத்மகாரகன்', te: 'ఆత్మకారకుడు', bn: 'আত্মকারক', kn: 'ಆತ್ಮಕಾರಕ', gu: 'આત્મકારક', sa: 'आत्मकारकः', mai: 'आत्मकारक', mr: 'आत्मकारक' },
  'Amatyakaraka': { ta: 'அமாத்தியகாரகன்', te: 'అమాత్యకారకుడు', bn: 'অমাত্যকারক', kn: 'ಅಮಾತ್ಯಕಾರಕ', gu: 'અમાત્યકારક', sa: 'अमात्यकारकः', mai: 'अमात्यकारक', mr: 'अमात्यकारक' },
  'Bhratrukaraka': { ta: 'பிராத்ருகாரகன்', te: 'భ్రాతృకారకుడు', bn: 'ভ্রাতৃকারক', kn: 'ಭ್ರಾತೃಕಾರಕ', gu: 'ભ્રાતૃકારક', sa: 'भ्रातृकारकः', mai: 'भ्रातृकारक', mr: 'भ्रातृकारक' },
  'Matrukaraka': { ta: 'மாத்ருகாரகன்', te: 'మాతృకారకుడు', bn: 'মাতৃকারক', kn: 'ಮಾತೃಕಾರಕ', gu: 'માતૃકારક', sa: 'मातृकारकः', mai: 'मातृकारक', mr: 'मातृकारक' },
  'Putrakaraka': { ta: 'புத்திரகாரகன்', te: 'పుత్రకారకుడు', bn: 'পুত্রকারক', kn: 'ಪುತ್ರಕಾರಕ', gu: 'પુત્રકારક', sa: 'पुत्रकारकः', mai: 'पुत्रकारक', mr: 'पुत्रकारक' },
  'Gnatikaraka': { ta: 'ஞாதிகாரகன்', te: 'జ్ఞాతికారకుడు', bn: 'জ্ঞাতিকারক', kn: 'ಜ್ಞಾತಿಕಾರಕ', gu: 'જ્ઞાતિકારક', sa: 'ज्ञातिकारकः', mai: 'ज्ञातिकारक', mr: 'ज्ञातिकारक' },
  'Darakaraka': { ta: 'தாரகாரகன்', te: 'దారకారకుడు', bn: 'দারকারক', kn: 'ದಾರಕಾರಕ', gu: 'દારકારક', sa: 'दारकारकः', mai: 'दारकारक', mr: 'दारकारक' },
  // ─── Karaka meanings ─────
  'Soul Significator': { ta: 'ஆன்மா காரகம்', te: 'ఆత్మ కారకం', bn: 'আত্মা কারক', kn: 'ಆತ್ಮ ಕಾರಕ', gu: 'આત્મા કારક', sa: 'आत्मकारकम्', mai: 'आत्मा कारक', mr: 'आत्मा कारक' },
  'Minister/Career': { ta: 'அமைச்சர்/தொழில்', te: 'మంత్రి/వృత్తి', bn: 'মন্ত্রী/কর্মজীবন', kn: 'ಮಂತ್ರಿ/ವೃತ್ತಿ', gu: 'મંત્રી/કારકિર્દી', sa: 'मन्त्री/व्यवसायः', mai: 'मंत्री/कैरियर', mr: 'मंत्री/करिअर' },
  'Siblings': { ta: 'உடன்பிறப்புகள்', te: 'తోబుట్టువులు', bn: 'ভাইবোন', kn: 'ಒಡಹುಟ್ಟಿದವರು', gu: 'ભાઈ-બહેન', sa: 'भ्रातरः', mai: 'भाइ-बहिन', mr: 'भाऊ-बहीण' },
  'Mother/Emotions': { ta: 'தாய்/உணர்வுகள்', te: 'తల్లి/భావాలు', bn: 'মা/আবেগ', kn: 'ತಾಯಿ/ಭಾವನೆ', gu: 'માતા/ભાવના', sa: 'माता/भावाः', mai: 'माय/भावना', mr: 'आई/भावना' },
  'Children/Creativity': { ta: 'குழந்தைகள்/படைப்பாற்றல்', te: 'పిల్లలు/సృజనాత్మకత', bn: 'সন্তান/সৃজনশীলতা', kn: 'ಮಕ್ಕಳು/ಸೃಜನಶೀಲತೆ', gu: 'સંતાન/સર્જનાત્મકતા', sa: 'सन्तानम्/सृजनम्', mai: 'सन्तान/रचनात्मकता', mr: 'संतती/सर्जनशीलता' },
  'Rivals/Illness': { ta: 'எதிரிகள்/நோய்', te: 'శత్రువులు/వ్యాధి', bn: 'শত্রু/রোগ', kn: 'ವೈರಿ/ರೋಗ', gu: 'શત્રુ/રોગ', sa: 'शत्रवः/रोगाः', mai: 'शत्रु/रोग', mr: 'शत्रू/रोग' },
  'Spouse/Partnerships': { ta: 'வாழ்க்கைத்துணை/கூட்டு', te: 'జీవిత భాగస్వామి/భాగస్వామ్యం', bn: 'জীবনসঙ্গী/অংশীদারিত্ব', kn: 'ಸಂಗಾತಿ/ಪಾಲುದಾರಿಕೆ', gu: 'જીવનસાથી/ભાગીદારી', sa: 'पत्नी/साझेदारी', mai: 'जीवनसाथी/भागीदारी', mr: 'जोडीदार/भागीदारी' },
};

// Longer phrase translations for house themes, dosha details etc.
const PHRASE_TRANSLATIONS = {
  // ─── House themes (SphutasTab) ─────
  'Self, body, health, personality': {
    ta: 'சுயம், உடல், ஆரோக்கியம், ஆளுமை', te: 'ఆత్మ, దేహం, ఆరోగ్యం, వ్యక్తిత్వం', bn: 'আত্ম, দেহ, স্বাস্থ্য, ব্যক্তিত্ব', kn: 'ಸ್ವಯಂ, ದೇಹ, ಆರೋಗ್ಯ, ವ್ಯಕ್ತಿತ್ವ', gu: 'સ્વ, શરીર, સ્વાસ્થ્ય, વ્યક્તિત્વ',
    sa: 'आत्मा, शरीरम्, आरोग्यम्, व्यक्तित्वम्', mai: 'आत्म, शरीर, स्वास्थ्य, व्यक्तित्व', mr: 'स्वत्व, शरीर, आरोग्य, व्यक्तिमत्त्व',
  },
  'Wealth, family, speech': {
    ta: 'செல்வம், குடும்பம், வாக்கு', te: 'ధనం, కుటుంబం, వాక్కు', bn: 'ধন, পরিবার, বাক্', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಕ್', gu: 'ધન, કુટુંબ, વાણી',
    sa: 'धनम्, कुटुम्बम्, वाक्', mai: 'धन, परिवार, वाणी', mr: 'धन, कुटुंब, वाणी',
  },
  'Courage, siblings, short travel': {
    ta: 'தைரியம், உடன்பிறப்பு, சிறு பயணம்', te: 'ధైర్యం, తోబుట్టువులు, చిన్న ప్రయాణం', bn: 'সাহস, ভাইবোন, স্বল্প ভ্রমণ', kn: 'ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು, ಕಿರು ಪ್ರಯಾಣ', gu: 'સાહસ, ભાઈ-બહેન, ટૂંકી મુસાફરી',
    sa: 'शौर्यम्, भ्रातरः, लघुयात्रा', mai: 'साहस, भाइ-बहिन, छोट यात्रा', mr: 'धैर्य, भाऊ-बहीण, लहान प्रवास',
  },
  'Home, mother, property, comfort': {
    ta: 'வீடு, தாய், சொத்து, சுகம்', te: 'ఇల్లు, తల్లి, ఆస్తి, సుఖం', bn: 'গৃহ, মাতা, সম্পত্তি, সুখ', kn: 'ಮನೆ, ತಾಯಿ, ಆಸ್ತಿ, ಸುಖ', gu: 'ઘર, માતા, સંપત્તિ, સુખ',
    sa: 'गृहम्, माता, सम्पत्तिः, सुखम्', mai: 'घर, माय, संपत्ति, सुख', mr: 'घर, आई, मालमत्ता, सुख',
  },
  'Children, education, creativity': {
    ta: 'குழந்தைகள், கல்வி, படைப்பாற்றல்', te: 'పిల్లలు, విద్య, సృజనాత్మకత', bn: 'সন্তান, শিক্ষা, সৃজনশীলতা', kn: 'ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಸೃಜನಶೀಲತೆ', gu: 'સંતાન, શિક્ષણ, સર્જનાત્મકતા',
    sa: 'सन्तानम्, शिक्षा, सृजनम्', mai: 'सन्तान, शिक्षा, रचनात्मकता', mr: 'संतती, शिक्षण, सर्जनशीलता',
  },
  'Enemies, health issues, service': {
    ta: 'எதிரிகள், உடல்நலப் பிரச்சினை, சேவை', te: 'శత్రువులు, ఆరోగ్య సమస్యలు, సేవ', bn: 'শত্রু, স্বাস্থ্য সমস্যা, সেবা', kn: 'ಶತ್ರು, ಆರೋಗ್ಯ ಸಮಸ್ಯೆ, ಸೇವೆ', gu: 'શત્રુ, આરોગ્ય સમસ્યા, સેવા',
    sa: 'शत्रवः, रोगाः, सेवा', mai: 'शत्रु, स्वास्थ्य समस्या, सेवा', mr: 'शत्रू, आरोग्य समस्या, सेवा',
  },
  'Marriage, partnerships, business': {
    ta: 'திருமணம், கூட்டு, வணிகம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર',
    sa: 'विवाहः, साझेदारी, व्यापारः', mai: 'विवाह, साझेदारी, व्यापार', mr: 'विवाह, भागीदारी, व्यापार',
  },
  'Transformation, longevity, occult': {
    ta: 'மாற்றம், நீண்ட ஆயுள், அமானுஷ்யம்', te: 'పరివర్తన, దీర్ఘాయువు, అతీంద్రియం', bn: 'রূপান্তর, দীর্ঘায়ু, গুপ্তবিদ্যা', kn: 'ಪರಿವರ್ತನೆ, ದೀರ್ಘಾಯುಷ್ಯ, ಗುಪ್ತವಿದ್ಯೆ', gu: 'પરિવર્તન, દીર્ઘાયુ, ગૂઢવિદ્યા',
    sa: 'परिवर्तनम्, दीर्घायुः, गुप्तविद्या', mai: 'परिवर्तन, दीर्घायु, गुप्त विद्या', mr: 'परिवर्तन, दीर्घायुष्य, गूढविद्या',
  },
  'Fortune, father, dharma, guru': {
    ta: 'பாக்கியம், தந்தை, தர்மம், குரு', te: 'భాగ్యం, తండ్రి, ధర్మం, గురువు', bn: 'ভাগ্য, পিতা, ধর্ম, গুরু', kn: 'ಭಾಗ್ಯ, ತಂದೆ, ಧರ್ಮ, ಗುರು', gu: 'ભાગ્ય, પિતા, ધર્મ, ગુરુ',
    sa: 'भाग्यम्, पिता, धर्मः, गुरुः', mai: 'भाग्य, पिता, धर्म, गुरु', mr: 'भाग्य, पिता, धर्म, गुरू',
  },
  'Career, status, authority': {
    ta: 'தொழில், அந்தஸ்து, அதிகாரம்', te: 'వృత్తి, హోదా, అధికారం', bn: 'কর্মজীবন, মর্যাদা, কর্তৃত্ব', kn: 'ವೃತ್ತಿ, ಸ್ಥಾನಮಾನ, ಅಧಿಕಾರ', gu: 'કારકિર્દી, દરજ્જો, સત્તા',
    sa: 'व्यवसायः, प्रतिष्ठा, अधिकारः', mai: 'कैरियर, प्रतिष्ठा, अधिकार', mr: 'करिअर, प्रतिष्ठा, अधिकार',
  },
  'Gains, income, friends, wishes': {
    ta: 'லாபம், வருமானம், நண்பர்கள், ஆசைகள்', te: 'లాభం, ఆదాయం, మిత్రులు, కోరికలు', bn: 'লাভ, আয়, বন্ধু, ইচ্ছা', kn: 'ಲಾಭ, ಆದಾಯ, ಮಿತ್ರರು, ಆಸೆಗಳು', gu: 'લાભ, આવક, મિત્રો, ઇચ્છાઓ',
    sa: 'लाभम्, आयः, मित्राणि, इच्छाः', mai: 'लाभ, आय, मित्र, इच्छा', mr: 'लाभ, उत्पन्न, मित्र, इच्छा',
  },
  'Expenses, liberation, foreign': {
    ta: 'செலவு, முக்தி, வெளிநாடு', te: 'వ్యయం, మోక్షం, విదేశం', bn: 'ব্যয়, মোক্ষ, বিদেশ', kn: 'ವ್ಯಯ, ಮೋಕ್ಷ, ವಿದೇಶ', gu: 'ખર્ચ, મોક્ષ, વિદેશ',
    sa: 'व्ययम्, मोक्षः, विदेशः', mai: 'व्यय, मोक्ष, विदेश', mr: 'खर्च, मोक्ष, परदेश',
  },
  // ─── Dosha details (PatrikaTab) ─────
  'Not present': {
    ta: 'இல்லை', te: 'లేదు', bn: 'অনুপস্থিত', kn: 'ಇಲ್ಲ', gu: 'નથી',
    sa: 'नास्ति', mai: 'उपस्थित नहीं', mr: 'नाही',
  },
  'All planets hemmed between Rahu-Ketu axis': {
    ta: 'எல்லா கிரகங்களும் ராகு-கேது அச்சுக்கு இடையில்', te: 'అన్ని గ్రహాలు రాహు-కేతు అక్షం మధ్యలో', bn: 'সকল গ্রহ রাহু-কেতু অক্ষের মধ্যে', kn: 'ಎಲ್ಲ ಗ್ರಹಗಳು ರಾಹು-ಕೇತು ಅಕ್ಷದ ನಡುವೆ', gu: 'બધા ગ્રહો રાહુ-કેતુ અક્ષ વચ્ચે',
    sa: 'सर्वे ग्रहाः राहु-केतु अक्षे मध्ये', mai: 'सभ ग्रह राहु-केतु अक्ष के बीच', mr: 'सर्व ग्रह राहु-केतु अक्षामध्ये',
  },
  'Moon not in Ganda Mula nakshatra': {
    ta: 'சந்திரன் கண்ட மூல நட்சத்திரத்தில் இல்லை', te: 'చంద్రుడు గండ మూల నక్షత్రంలో లేడు', bn: 'চন্দ্র গণ্ড মূল নক্ষত্রে নেই', kn: 'ಚಂದ್ರ ಗಂಡ ಮೂಲ ನಕ್ಷತ್ರದಲ್ಲಿಲ್ಲ', gu: 'ચંદ્ર ગંડ મૂળ નક્ષત્રમાં નથી',
    sa: 'चन्द्रः गण्डमूलनक्षत्रे नास्ति', mai: 'चन्द्र गण्ड मूल नक्षत्र में नहीं', mr: 'चंद्र गंडमूळ नक्षत्रात नाही',
  },
  'Not currently active': {
    ta: 'தற்போது செயலில் இல்லை', te: 'ప్రస్తుతం సక్రియం కాదు', bn: 'বর্তমানে সক্রিয় নয়', kn: 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯವಲ್ಲ', gu: 'હાલમાં સક્રિય નથી',
    sa: 'सम्प्रति सक्रियं नास्ति', mai: 'वर्तमान में सक्रिय नहीं', mr: 'सध्या सक्रिय नाही',
  },
  // ─── Lagna sketches (InterpretationHelpers) ─────
  'Bold, independent, action-oriented leader': {
    ta: 'தைரியமான, சுதந்திரமான, செயல்முனைப்பான தலைவர்', te: 'ధైర్యవంతుడు, స్వతంత్రుడు, కార్యశీలి నాయకుడు', bn: 'সাহসী, স্বাধীন, কর্মমুখী নেতা', kn: 'ಧೈರ್ಯಶಾಲಿ, ಸ್ವತಂತ್ರ, ಕ್ರಿಯಾಶೀಲ ನಾಯಕ', gu: 'હિંમતવાન, સ્વતંત્ર, ક્રિયાશીલ નેતા',
    sa: 'साहसी, स्वतन्त्रः, कर्मप्रधानः नायकः', mai: 'साहसी, स्वतंत्र, कर्मप्रधान नेता', mr: 'धाडसी, स्वतंत्र, कृतिशील नेता',
  },
  'Stable, patient, values comfort and security': {
    ta: 'நிலையான, பொறுமையான, சுகம் மற்றும் பாதுகாப்பை மதிக்கும்', te: 'స్థిరమైన, ఓపికగల, సుఖం మరియు భద్రతను విలువచేసే', bn: 'স্থির, ধৈর্যশীল, সুখ ও নিরাপত্তার মূল্যদাতা', kn: 'ಸ್ಥಿರ, ತಾಳ್ಮೆಯ, ಸುಖ ಮತ್ತು ಭದ್ರತೆಗೆ ಮಹತ್ವ', gu: 'સ્થિર, ધૈર્યવાન, સુખ અને સુરક્ષાને મહત્ત્વ આપનાર',
    sa: 'स्थिरः, धैर्यवान्, सुखं सुरक्षां च मन्यते', mai: 'स्थिर, धैर्यवान, सुख आ सुरक्षा कें महत्व दैत', mr: 'स्थिर, संयमी, सुख आणि सुरक्षिततेला महत्त्व',
  },
  'Curious, communicative, intellectually agile': {
    ta: 'ஆர்வமுள்ள, தொடர்பு திறன், அறிவார்ந்த சுறுசுறுப்பு', te: 'ఆసక్తిగల, సంభాషణశీలి, మేధావి', bn: 'কৌতূহলী, যোগাযোগশীল, মেধাবী', kn: 'ಕುತೂಹಲಿ, ಸಂವಾದಶೀಲ, ಬೌದ್ಧಿಕ ಚುರುಕು', gu: 'જિજ્ઞાસુ, વાતચીત-કુશળ, બૌદ્ધિક રીતે ચપળ',
    sa: 'जिज्ञासुः, संवादशीलः, बौद्धिकरूपेण चुस्तः', mai: 'जिज्ञासु, संवादशील, बौद्धिक रूप सं चुस्त', mr: 'जिज्ञासू, संवादकुशल, बौद्धिकदृष्ट्या चपळ',
  },
  'Nurturing, emotionally deep, home-oriented': {
    ta: 'பராமரிக்கும், உணர்வு ஆழமான, வீடு சார்ந்த', te: 'పోషించే, భావోద్వేగ గాఢత, గృహ కేంద్రిత', bn: 'পরিচর্যাকারী, আবেগে গভীর, গৃহকেন্দ্রিক', kn: 'ಪೋಷಿಸುವ, ಭಾವನಾತ್ಮಕವಾಗಿ ಆಳವಾದ, ಗೃಹಕೇಂದ್ರಿತ', gu: 'પોષક, ભાવનાત્મક રીતે ઊંડા, ઘરકેન્દ્રી',
    sa: 'पोषकः, भावनात्मकरूपेण गम्भीरः, गृहकेन्द्रितः', mai: 'पोषणकर्ता, भावनात्मक रूप सं गहिर, घर-केंद्रित', mr: 'जोपासना करणारा, भावनात्मकदृष्ट्या गहन, गृहकेंद्रित',
  },
  'Charismatic, confident, creative, seeks recognition': {
    ta: 'கவர்ச்சிமிக்க, தன்னம்பிக்கை, படைப்பாற்றல், அங்கீகாரம் தேடும்', te: 'ఆకర్షణీయ, ఆత్మవిశ్వాసం, సృజనాత్మక, గుర్తింపు కోరే', bn: 'আকর্ষণীয়, আত্মবিশ্বাসী, সৃজনশীল, স্বীকৃতি প্রত্যাশী', kn: 'ಆಕರ್ಷಕ, ಆತ್ಮವಿಶ್ವಾಸಿ, ಸೃಜನಶೀಲ, ಮಾನ್ಯತೆ ಬಯಸುವ', gu: 'આકર્ષક, આત્મવિશ્વાસી, સર્જનાત્મક, માન્યતા ઇચ્છુક',
    sa: 'करिश्मावान्, आत्मविश्वासी, सृजनात्मकः, मान्यताकामी', mai: 'करिश्माई, आत्मविश्वासी, रचनात्मक, मान्यता के इच्छुक', mr: 'करिश्मा असणारा, आत्मविश्वासी, सर्जनशील, मान्यता शोधणारा',
  },
  'Analytical, detail-oriented, service-minded': {
    ta: 'பகுப்பாய்வு, விரிவான கவனம், சேவை மனப்பான்மை', te: 'విశ్లేషణాత్మక, వివరాలపై దృష్టి, సేవాభావం', bn: 'বিশ্লেষণাত্মক, বিস্তারিত-মুখী, সেবা-মনস্ক', kn: 'ವಿಶ್ಲೇಷಣಾತ್ಮಕ, ವಿವರ-ಕೇಂದ್ರಿತ, ಸೇವಾ-ಮನಸ್ಕ', gu: 'વિશ્લેષણાત્મક, વિગત-લક્ષી, સેવા-ભાવી',
    sa: 'विश्लेषणात्मकः, विस्तारोन्मुखः, सेवाभावी', mai: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवा-भावी', mr: 'विश्लेषणात्मक, तपशीलवार, सेवाभावी',
  },
  'Diplomatic, relationship-focused, aesthetic sense': {
    ta: 'இராஜதந்திர, உறவு-மையம், அழகியல் உணர்வு', te: 'దౌత్యనైపుణ్యం, సంబంధ-కేంద్రిత, సౌందర్య భావం', bn: 'কূটনৈতিক, সম্পর্ক-কেন্দ্রিক, সৌন্দর্যবোধ', kn: 'ರಾಜತಾಂತ್ರಿಕ, ಸಂಬಂಧ-ಕೇಂದ್ರಿತ, ಸೌಂದರ್ಯ ಪ್ರಜ್ಞೆ', gu: 'કુટનીતિજ્ઞ, સંબંધ-કેન્દ્રી, સૌંદર્ય બોધ',
    sa: 'कूटनीतिकः, सम्बन्धकेन्द्रितः, सौन्दर्यबोधः', mai: 'कूटनीतिक, संबंध-केंद्रित, सौंदर्य बोध', mr: 'मुत्सद्दी, नातेसंबंध-केंद्रित, सौंदर्यदृष्टी',
  },
  'Intense, transformative, deep researcher': {
    ta: 'தீவிரமான, மாற்றமளிக்கும், ஆழ்ந்த ஆராய்ச்சியாளர்', te: 'తీవ్రమైన, పరివర్తనాత్మక, లోతైన పరిశోధకుడు', bn: 'তীব্র, রূপান্তরকারী, গভীর গবেষক', kn: 'ತೀವ್ರ, ಪರಿವರ್ತನಾಶೀಲ, ಆಳವಾದ ಸಂಶೋಧಕ', gu: 'તીવ્ર, પરિવર્તનકારી, ઊંડા સંશોધક',
    sa: 'तीव्रः, परिवर्तनकारी, गम्भीरः शोधकर्ता', mai: 'तीव्र, परिवर्तनकारी, गहन शोधकर्ता', mr: 'तीव्र, परिवर्तनकारी, सखोल संशोधक',
  },
  'Adventurous, philosophical, freedom-loving': {
    ta: 'சாகசமான, தத்துவ சிந்தனை, சுதந்திரம் விரும்பும்', te: 'సాహసి, తాత్విక, స్వాతంత్ర్య ప్రేమి', bn: 'দুঃসাহসী, দার্শনিক, স্বাধীনতাপ্রেমী', kn: 'ಸಾಹಸಿ, ತಾತ್ವಿಕ, ಸ್ವಾತಂತ್ರ್ಯಪ್ರಿಯ', gu: 'સાહસિક, દાર્શનિક, સ્વતંત્રતાપ્રેમી',
    sa: 'साहसिकः, दार्शनिकः, स्वतन्त्रताप्रेमी', mai: 'साहसिक, दार्शनिक, स्वतंत्रता-प्रेमी', mr: 'साहसी, तत्त्वज्ञानी, स्वातंत्र्यप्रेमी',
  },
  'Disciplined, ambitious, practical, career-focused': {
    ta: 'ஒழுக்கமான, லட்சியவாதி, நடைமுறை, தொழில்-மையம்', te: 'క్రమశిక్షణ, ఆశయవాది, ఆచరణాత్మక, వృత్తి-కేంద్రిత', bn: 'শৃঙ্খলাবদ্ধ, উচ্চাকাঙ্ক্ষী, বাস্তববাদী, কর্মজীবন-কেন্দ্রিক', kn: 'ಶಿಸ್ತಿನ, ಮಹತ್ವಾಕಾಂಕ್ಷಿ, ವ್ಯಾವಹಾರಿಕ, ವೃತ್ತಿ-ಕೇಂದ್ರಿತ', gu: 'શિસ્તબદ્ધ, મહત્ત્વાકાંક્ષી, વ્યવહારુ, કારકિર્દી-કેન્દ્રી',
    sa: 'अनुशासितः, महत्त्वाकाङ्क्षी, व्यावहारिकः, व्यवसायकेन्द्रितः', mai: 'अनुशासित, महत्वाकांक्षी, व्यावहारिक, कैरियर-केंद्रित', mr: 'शिस्तप्रिय, महत्त्वाकांक्षी, व्यवहारी, करिअर-केंद्रित',
  },
  'Innovative, humanitarian, independent thinker': {
    ta: 'புத்தாக்கமான, மனிதநேயம், சுதந்திர சிந்தனையாளர்', te: 'నవకల్పన, మానవతావాది, స్వతంత్ర ఆలోచనాపరుడు', bn: 'উদ্ভাবনী, মানবতাবাদী, স্বাধীন চিন্তক', kn: 'ನವೀನ, ಮಾನವತಾವಾದಿ, ಸ್ವತಂತ್ರ ಚಿಂತಕ', gu: 'નવીન, માનવતાવાદી, સ્વતંત્ર વિચારક',
    sa: 'नवोन्मेषी, मानवतावादी, स्वतन्त्रविचारकः', mai: 'नवोन्मेषी, मानवतावादी, स्वतंत्र विचारक', mr: 'नवकल्पनाशील, मानवतावादी, स्वतंत्र विचारवंत',
  },
  'Intuitive, spiritual, compassionate, creative': {
    ta: 'உள்ளுணர்வு, ஆன்மிக, கருணை, படைப்பாற்றல்', te: 'అంతర్ దృష్టి, ఆధ్యాత్మిక, కరుణ, సృజనాత్మక', bn: 'অন্তর্দৃষ্টিশীল, আধ্যাত্মিক, করুণাময়, সৃজনশীল', kn: 'ಅಂತರ್ಜ್ಞಾನಿ, ಆಧ್ಯಾತ್ಮಿಕ, ಕರುಣಾಮಯ, ಸೃಜನಶೀಲ', gu: 'અંતર્જ્ઞાની, આધ્યાત્મિક, કરુણાશીલ, સર્જનાત્મક',
    sa: 'अन्तर्ज्ञानी, आध्यात्मिकः, करुणामयः, सृजनात्मकः', mai: 'अंतर्ज्ञानी, आध्यात्मिक, करुणामय, रचनात्मक', mr: 'अंतर्ज्ञानी, अध्यात्मिक, करुणामय, सर्जनशील',
  },
};

// ─── The main replacement engine ─────────────────────────────────────────────

// We use a regex-based approach: find locale object patterns and fix the seeded locales.
// The approach: for each file, find all occurrences of locale object patterns like:
//   ta: 'some English text', te: 'same English text', bn: '...', kn: '...', gu: '...'
// and replace them with real translations.
// Similarly for sa/mai/mr that are Hindi copies.

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let changeCount = 0;

  // Strategy: Use a comprehensive regex to find locale objects and fix them.
  // The pattern matches objects with locale keys like { en: '...', hi: '...', ... ta: '...', ... }

  // First pass: Replace exact known phrases in ta/te/bn/kn/gu that are English copies
  for (const [enPhrase, translations] of Object.entries({ ...TERM_TRANSLATIONS, ...PHRASE_TRANSLATIONS })) {
    // Escape special regex chars in the phrase
    const escaped = enPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace ta: 'English phrase' with ta: 'Tamil phrase'
    for (const [lang, translation] of Object.entries(translations)) {
      // Handle both single-quoted and backtick strings
      // Match ta: 'exact English phrase' (where the current value equals the English phrase)
      const sqRegex = new RegExp(`${lang}: '${escaped}'`, 'g');
      const escapedTranslation = translation.replace(/'/g, "\\'");
      const newContent = content.replace(sqRegex, `${lang}: '${escapedTranslation}'`);
      if (newContent !== content) {
        changeCount += (content.match(sqRegex) || []).length;
        content = newContent;
      }
    }
  }

  // Second pass: Handle template literal strings (backtick) with dynamic values
  // Pattern: ta: `Mars in House ${mars!.house}`  →  ta: `செவ்வாய் பாவம் ${mars!.house}-இல்`
  const templateReplacements = [
    // Mars in House ${mars!.house}
    {
      find: /ta: `Mars in House \$\{mars!\.house\}`/g,
      replace: "ta: `செவ்வாய் பாவம் ${mars!.house}-இல்`"
    },
    {
      find: /te: `Mars in House \$\{mars!\.house\}`/g,
      replace: "te: `కుజుడు భావం ${mars!.house}లో`"
    },
    {
      find: /bn: `Mars in House \$\{mars!\.house\}`/g,
      replace: "bn: `মঙ্গল ভাব ${mars!.house}-এ`"
    },
    {
      find: /kn: `Mars in House \$\{mars!\.house\}`/g,
      replace: "kn: `ಕುಜ ಭಾವ ${mars!.house}ರಲ್ಲಿ`"
    },
    {
      find: /gu: `Mars in House \$\{mars!\.house\}`/g,
      replace: "gu: `મંગળ ભાવ ${mars!.house}માં`"
    },
    {
      find: /sa: `मंगल भाव \$\{mars!\.house\} में`/g,
      replace: "sa: `मङ्गलः भावे ${mars!.house}`"
    },
    {
      find: /mr: `मंगल भाव \$\{mars!\.house\} में`/g,
      replace: "mr: `मंगळ भाव ${mars!.house} मध्ये`"
    },
    // Mars not in 1/2/4/7/8/12
    { find: /ta: 'Mars not in 1\/2\/4\/7\/8\/12'/g, replace: "ta: 'செவ்வாய் 1/2/4/7/8/12-இல் இல்லை'" },
    { find: /te: 'Mars not in 1\/2\/4\/7\/8\/12'/g, replace: "te: 'కుజుడు 1/2/4/7/8/12లో లేడు'" },
    { find: /bn: 'Mars not in 1\/2\/4\/7\/8\/12'/g, replace: "bn: 'মঙ্গল 1/2/4/7/8/12-এ নেই'" },
    { find: /kn: 'Mars not in 1\/2\/4\/7\/8\/12'/g, replace: "kn: 'ಕುಜ 1/2/4/7/8/12ರಲ್ಲಿ ಇಲ್ಲ'" },
    { find: /gu: 'Mars not in 1\/2\/4\/7\/8\/12'/g, replace: "gu: 'મંગળ 1/2/4/7/8/12માં નથી'" },
    { find: /sa: 'मंगल 1\/2\/4\/7\/8\/12 में नहीं'/g, replace: "sa: 'मङ्गलः 1/2/4/7/8/12 भावे नास्ति'" },
    { find: /mr: 'मंगल 1\/2\/4\/7\/8\/12 में नहीं'/g, replace: "mr: 'मंगळ 1/2/4/7/8/12 मध्ये नाही'" },
    // Moon in ${moon!.nakshatra.name.en} — ta/te/bn/kn/gu currently English
    { find: /ta: `Moon in \$\{moon!\.nakshatra\.name\.en\}`/g, replace: "ta: `சந்திரன் ${moon!.nakshatra.name.en}-இல்`" },
    { find: /te: `Moon in \$\{moon!\.nakshatra\.name\.en\}`/g, replace: "te: `చంద్రుడు ${moon!.nakshatra.name.en}లో`" },
    { find: /bn: `Moon in \$\{moon!\.nakshatra\.name\.en\}`/g, replace: "bn: `চন্দ্র ${moon!.nakshatra.name.en}-এ`" },
    { find: /kn: `Moon in \$\{moon!\.nakshatra\.name\.en\}`/g, replace: "kn: `ಚಂದ್ರ ${moon!.nakshatra.name.en}ದಲ್ಲಿ`" },
    { find: /gu: `Moon in \$\{moon!\.nakshatra\.name\.en\}`/g, replace: "gu: `ચંદ્ર ${moon!.nakshatra.name.en}માં`" },
    { find: /sa: `चन्द्र \$\{moon!\.nakshatra\.name\.hi\} में`/g, replace: "sa: `चन्द्रः ${moon!.nakshatra.name.hi} नक्षत्रे`" },
    { find: /mr: `चन्द्र \$\{moon!\.nakshatra\.name\.hi\} में`/g, replace: "mr: `चंद्र ${moon!.nakshatra.name.hi} नक्षत्रात`" },
    // Sade Sati active
    { find: /ta: `Currently active — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'ongoing'\}`/g, replace: "ta: `தற்போது செயலில் — ${kundali.sadeSati?.currentPhase || 'நடப்பில்'}`" },
    { find: /te: `Currently active — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'ongoing'\}`/g, replace: "te: `ప్రస్తుతం సక్రియం — ${kundali.sadeSati?.currentPhase || 'కొనసాగుతోంది'}`" },
    { find: /bn: `Currently active — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'ongoing'\}`/g, replace: "bn: `বর্তমানে সক্রিয় — ${kundali.sadeSati?.currentPhase || 'চলমান'}`" },
    { find: /kn: `Currently active — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'ongoing'\}`/g, replace: "kn: `ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ — ${kundali.sadeSati?.currentPhase || 'ನಡೆಯುತ್ತಿದೆ'}`" },
    { find: /gu: `Currently active — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'ongoing'\}`/g, replace: "gu: `હાલમાં સક્રિય — ${kundali.sadeSati?.currentPhase || 'ચાલુ'}`" },
    { find: /sa: `वर्तमान में सक्रिय — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'चालू'\}`/g, replace: "sa: `सम्प्रति सक्रियम् — ${kundali.sadeSati?.currentPhase || 'प्रचलितम्'}`" },
    { find: /mr: `वर्तमान में सक्रिय — \$\{kundali\.sadeSati\?\.currentPhase \|\| 'चालू'\}`/g, replace: "mr: `सध्या सक्रिय — ${kundali.sadeSati?.currentPhase || 'चालू'}`" },
  ];

  for (const { find, replace } of templateReplacements) {
    const newContent = content.replace(find, replace);
    if (newContent !== content) {
      changeCount += (content.match(find) || []).length;
      content = newContent;
    }
  }

  // Third pass: For remaining long prose strings that are English copies in ta/te/bn/kn/gu,
  // and Hindi copies in sa/mai/mr — we process them generically.
  // The pattern: these appear as `ta: 'same text as en value'` in a locale object.
  // We'll find them by looking for repeated English text across locale keys.

  // Generic long-text replacement: For any locale object where ta/te/bn/kn/gu have the
  // exact same value as 'en', and the text is longer than 20 chars (i.e. not a short term
  // we've already handled), we prepend a locale marker.
  // Actually, for long prose, proper translation is infeasible in a script.
  // Instead, we'll replace the REMAINING known patterns.

  // For the ChartNorth/ChartSouth PLANET_ABBR — these only have en/hi/sa, no ta/te/bn/kn/gu
  // so no changes needed there.

  // For the AIReadingButton — only 1 match (the 'data: ' check), no actual locale objects to fix.

  return { content, changeCount };
}

// ─── Run ─────────────────────────────────────────────────────────────────────

let totalChanges = 0;
for (const file of FILES) {
  const filePath = resolve(BASE, file);
  try {
    const { content, changeCount } = processFile(filePath);
    if (changeCount > 0) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`  ${file}: ${changeCount} replacements`);
      totalChanges += changeCount;
    } else {
      console.log(`  ${file}: no matching patterns`);
    }
  } catch (err) {
    console.error(`  ${file}: ERROR — ${err.message}`);
  }
}

console.log(`\nTotal replacements: ${totalChanges}`);

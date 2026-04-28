/**
 * Dasha Period Synthesis Engine — 3-level granular forecast
 *
 * Synthesizes ALL chart elements (yogas, doshas, transits, house activations,
 * divisional charts) into a coherent period-by-period forecast for each
 * Mahadasha → Antardasha → Pratyantardasha.
 *
 * References: BPHS Ch.46-52, Phaladeepika Ch.20, Saravali
 */

import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import type { YogaInsight, DoshaInsight } from '@/lib/kundali/tippanni-types';
import type {
  DashaSynthesis,
  MahadashaOverview,
  MahadashaSynthesis,
  AntardashaSynthesis,
  PratyantardashaSynthesis,
  PeriodAssessment,
} from './dasha-synthesis-types';
import { getDashaLordAnalysis, getAntardashaInteraction } from './dasha-effects-enhanced';
import { generateDashaPrognosis } from './dasha-prognosis';
import { getPlanetDignity } from './dignity';
import { isKendra, isTrikona, isDusthana, triLocale, PLANET_NAMES } from './utils';
import { getPlanetaryPositions, toSidereal, dateToJD } from '@/lib/ephem/astronomical';

// ─── Constants ────────────────────────────────────────────────────────────────

const NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

import { SIGN_LORDS } from '@/lib/constants/dignities';

const HOUSE_THEMES: Record<number, LocaleText> = {
  1:  { en: 'Self, personality, health', hi: 'स्वयं, व्यक्तित्व, स्वास्थ्य', sa: 'स्वयं, व्यक्तित्व, स्वास्थ्य', mai: 'स्वयं, व्यक्तित्व, स्वास्थ्य', mr: 'स्वयं, व्यक्तित्व, स्वास्थ्य', ta: 'சுயம், ஆளுமை, உடல்நலம்', te: 'ఆత్మ, వ్యక్తిత్వం, ఆరోగ్యం', bn: 'আত্মা, ব্যক্তিত্ব, স্বাস্থ্য', kn: 'ಆತ್ಮ, ವ್ಯಕ್ತಿತ್ವ, ಆರೋಗ್ಯ', gu: 'સ્વયં, વ્યક્તિત્વ, સ્વાસ્થ્ય' },
  2:  { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी', sa: 'धन, परिवार, वाणी', mai: 'धन, परिवार, वाणी', mr: 'धन, परिवार, वाणी', ta: 'செல்வம், குடும்பம், பேச்சு', te: 'ధనం, కుటుంబం, వాక్కు', bn: 'ধন, পরিবার, বাক্', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಕ್', gu: 'ધન, કુટુંબ, વાણી' },
  3:  { en: 'Siblings, courage, communication', hi: 'भाई-बहन, साहस, संवाद', sa: 'भाई-बहन, साहस, संवाद', mai: 'भाई-बहन, साहस, संवाद', mr: 'भाई-बहन, साहस, संवाद', ta: 'உடன்பிறப்புகள், தைரியம், தகவல் தொடர்பு', te: 'సోదరులు, ధైర్యం, సంభాషణ', bn: 'ভাইবোন, সাহস, যোগাযোগ', kn: 'ಸಹೋದರರು, ಧೈರ್ಯ, ಸಂವಹನ', gu: 'ભાઈ-બહેન, સાહસ, સંવાદ' },
  4:  { en: 'Mother, home, property, peace', hi: 'माता, घर, सम्पत्ति, शान्ति', sa: 'माता, घर, सम्पत्ति, शान्ति', mai: 'माता, घर, सम्पत्ति, शान्ति', mr: 'माता, घर, सम्पत्ति, शान्ति', ta: 'தாய், வீடு, சொத்து, அமைதி', te: 'తల్లి, ఇల్లు, ఆస్తి, శాంతి', bn: 'মাতা, গৃহ, সম্পত্তি, শান্তি', kn: 'ತಾಯಿ, ಮನೆ, ಆಸ್ತಿ, ಶಾಂತಿ', gu: 'માતા, ઘર, સંપત્તિ, શાંતિ' },
  5:  { en: 'Children, creativity, education, romance', hi: 'सन्तान, सृजनात्मकता, शिक्षा', sa: 'सन्तान, सृजनात्मकता, शिक्षा', mai: 'सन्तान, सृजनात्मकता, शिक्षा', mr: 'सन्तान, सृजनात्मकता, शिक्षा', ta: 'குழந்தைகள், படைப்பாற்றல், கல்வி, காதல்', te: 'సంతానం, సృజనాత్మకత, విద్య, ప్రేమ', bn: 'সন্তান, সৃজনশীলতা, শিক্ষা, প্রেম', kn: 'ಮಕ್ಕಳು, ಸೃಜನಶೀಲತೆ, ಶಿಕ್ಷಣ, ಪ್ರೇಮ', gu: 'સંતાન, સર્જનાત્મકતા, શિક્ષા, પ્રેમ' },
  6:  { en: 'Enemies, disease, debts, service', hi: 'शत्रु, रोग, ऋण, सेवा', sa: 'शत्रु, रोग, ऋण, सेवा', mai: 'शत्रु, रोग, ऋण, सेवा', mr: 'शत्रु, रोग, ऋण, सेवा', ta: 'எதிரிகள், நோய், கடன், சேவை', te: 'శత్రువులు, రోగం, ఋణం, సేవ', bn: 'শত্রু, রোগ, ঋণ, সেবা', kn: 'ಶತ್ರು, ರೋಗ, ಋಣ, ಸೇವೆ', gu: 'શત્રુ, રોગ, ઋણ, સેવા' },
  7:  { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', sa: 'विवाह, साझेदारी, व्यापार', mai: 'विवाह, साझेदारी, व्यापार', mr: 'विवाह, साझेदारी, व्यापार', ta: 'திருமணம், பங்காளிகள், வணிகம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం', bn: 'বিবাহ, অংশীদারি, ব্যবসা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ', gu: 'વિવાહ, ભાગીદારી, વ્યાપાર' },
  8:  { en: 'Transformation, occult, inheritance', hi: 'परिवर्तन, गुप्त विद्या, विरासत', sa: 'परिवर्तन, गुप्त विद्या, विरासत', mai: 'परिवर्तन, गुप्त विद्या, विरासत', mr: 'परिवर्तन, गुप्त विद्या, विरासत', ta: 'உருமாற்றம், அமானுஷ்யம், பரம்பரை சொத்து', te: 'పరివర్తన, అతీంద్రియ విద్య, వారసత్వం', bn: 'রূপান্তর, গুপ্তবিদ্যা, উত্তরাধিকার', kn: 'ಪರಿವರ್ತನೆ, ಅತೀಂದ್ರಿಯ ವಿದ್ಯೆ, ಉತ್ತರಾಧಿಕಾರ', gu: 'પરિવર્તન, ગુપ્ત વિદ્યા, વારસો' },
  9:  { en: 'Fortune, dharma, higher education', hi: 'भाग्य, धर्म, उच्च शिक्षा', sa: 'भाग्य, धर्म, उच्च शिक्षा', mai: 'भाग्य, धर्म, उच्च शिक्षा', mr: 'भाग्य, धर्म, उच्च शिक्षा', ta: 'பாக்கியம், தர்மம், உயர்கல்வி', te: 'భాగ్యం, ధర్మం, ఉన్నత విద్య', bn: 'ভাগ্য, ধর্ম, উচ্চশিক্ষা', kn: 'ಭಾಗ್ಯ, ಧರ್ಮ, ಉನ್ನತ ಶಿಕ್ಷಣ', gu: 'ભાગ્ય, ધર્મ, ઉચ્ચ શિક્ષા' },
  10: { en: 'Career, authority, reputation', hi: 'कैरियर, अधिकार, प्रतिष्ठा', sa: 'कैरियर, अधिकार, प्रतिष्ठा', mai: 'कैरियर, अधिकार, प्रतिष्ठा', mr: 'कैरियर, अधिकार, प्रतिष्ठा', ta: 'தொழில், அதிகாரம், புகழ்', te: 'వృత్తి, అధికారం, ప్రతిష్ఠ', bn: 'কর্মজীবন, কর্তৃত্ব, সুনাম', kn: 'ವೃತ್ತಿ, ಅಧಿಕಾರ, ಖ್ಯಾತಿ', gu: 'કારકિર્દી, અધિકાર, પ્રતિષ્ઠા' },
  11: { en: 'Gains, income, social circle', hi: 'लाभ, आय, सामाजिक वृत्त', sa: 'लाभ, आय, सामाजिक वृत्त', mai: 'लाभ, आय, सामाजिक वृत्त', mr: 'लाभ, आय, सामाजिक वृत्त', ta: 'லாபம், வருமானம், சமூக வட்டம்', te: 'లాభం, ఆదాయం, సామాజిక వర్తులం', bn: 'লাভ, আয়, সামাজিক বৃত্ত', kn: 'ಲಾಭ, ಆದಾಯ, ಸಾಮಾಜಿಕ ವಲಯ', gu: 'લાભ, આવક, સામાજિક વર્તુળ' },
  12: { en: 'Expenses, foreign lands, moksha', hi: 'व्यय, विदेश, मोक्ष', sa: 'व्यय, विदेश, मोक्ष', mai: 'व्यय, विदेश, मोक्ष', mr: 'व्यय, विदेश, मोक्ष', ta: 'செலவுகள், வெளிநாடு, மோட்சம்', te: 'ఖర్చులు, విదేశాలు, మోక్షం', bn: 'ব্যয়, বিদেশ, মোক্ষ', kn: 'ಖರ್ಚು, ವಿದೇಶ, ಮೋಕ್ಷ', gu: 'ખર્ચ, વિદેશ, મોક્ષ' },
};

const PLANET_THEMES: Record<number, LocaleText> = {
  0: { en: 'authority, vitality, government, father', hi: 'अधिकार, जीवनशक्ति, सरकार, पिता', sa: 'अधिकार, जीवनशक्ति, सरकार, पिता', mai: 'अधिकार, जीवनशक्ति, सरकार, पिता', mr: 'अधिकार, जीवनशक्ति, सरकार, पिता', ta: 'அதிகாரம், உயிர்ச்சக்தி, அரசு, தந்தை', te: 'అధికారం, జీవశక్తి, ప్రభుత్వం, తండ్రి', bn: 'কর্তৃত্ব, প্রাণশক্তি, সরকার, পিতা', kn: 'ಅಧಿಕಾರ, ಜೀವಶಕ್ತಿ, ಸರ್ಕಾರ, ತಂದೆ', gu: 'સત્તા, જીવનશક્તિ, સરકાર, પિતા' },
  1: { en: 'emotions, mother, mind, public life', hi: 'भावनाएँ, माता, मन, सार्वजनिक जीवन', sa: 'भावनाएँ, माता, मन, सार्वजनिक जीवन', mai: 'भावनाएँ, माता, मन, सार्वजनिक जीवन', mr: 'भावनाएँ, माता, मन, सार्वजनिक जीवन', ta: 'உணர்வுகள், தாய், மனம், பொது வாழ்க்கை', te: 'భావాలు, తల్లి, మనస్సు, సార్వజనిక జీవితం', bn: 'আবেগ, মাতা, মন, সর্বজনীন জীবন', kn: 'ಭಾವನೆಗಳು, ತಾಯಿ, ಮನಸ್ಸು, ಸಾರ್ವಜನಿಕ ಜೀವನ', gu: 'ભાવનાઓ, માતા, મન, જાહેર જીવન' },
  2: { en: 'energy, courage, property, competition', hi: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', sa: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', mai: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', mr: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', ta: 'ஆற்றல், தைரியம், சொத்து, போட்டி', te: 'శక్తి, ధైర్యం, ఆస్తి, పోటీ', bn: 'শক্তি, সাহস, সম্পত্তি, প্রতিযোগিতা', kn: 'ಶಕ್ತಿ, ಧೈರ್ಯ, ಆಸ್ತಿ, ಸ್ಪರ್ಧೆ', gu: 'ઊર્જા, સાહસ, સંપત્તિ, સ્પર્ધા' },
  3: { en: 'intellect, communication, business, learning', hi: 'बुद्धि, संवाद, व्यापार, शिक्षा', sa: 'बुद्धि, संवाद, व्यापार, शिक्षा', mai: 'बुद्धि, संवाद, व्यापार, शिक्षा', mr: 'बुद्धि, संवाद, व्यापार, शिक्षा', ta: 'புத்தி, தகவல் தொடர்பு, வணிகம், கல்வி', te: 'బుద్ధి, సంభాషణ, వ్యాపారం, విద్య', bn: 'বুদ্ধি, যোগাযোগ, ব্যবসা, শিক্ষা', kn: 'ಬುದ್ಧಿ, ಸಂವಹನ, ವ್ಯಾಪಾರ, ಶಿಕ್ಷಣ', gu: 'બુદ્ધિ, સંવાદ, વ્યાપાર, શિક્ષા' },
  4: { en: 'wisdom, expansion, fortune, children, dharma', hi: 'ज्ञान, विस्तार, भाग्य, सन्तान, धर्म', sa: 'ज्ञान, विस्तार, भाग्य, सन्तान, धर्म', mai: 'ज्ञान, विस्तार, भाग्य, सन्तान, धर्म', mr: 'ज्ञान, विस्तार, भाग्य, सन्तान, धर्म', ta: 'ஞானம், விரிவாக்கம், பாக்கியம், குழந்தைகள், தர்மம்', te: 'జ్ఞానం, విస్తరణ, భాగ్యం, సంతానం, ధర్మం', bn: 'জ্ঞান, বিস্তার, ভাগ্য, সন্তান, ধর্ম', kn: 'ಜ್ಞಾನ, ವಿಸ್ತರಣೆ, ಭಾಗ್ಯ, ಮಕ್ಕಳು, ಧರ್ಮ', gu: 'જ્ઞાન, વિસ્તાર, ભાગ્ય, સંતાન, ધર્મ' },
  5: { en: 'relationships, luxury, arts, comfort', hi: 'सम्बन्ध, विलासिता, कला, सुख', sa: 'सम्बन्ध, विलासिता, कला, सुख', mai: 'सम्बन्ध, विलासिता, कला, सुख', mr: 'सम्बन्ध, विलासिता, कला, सुख', ta: 'உறவுகள், ஆடம்பரம், கலைகள், சுகம்', te: 'సంబంధాలు, విలాసం, కళలు, సుఖం', bn: 'সম্পর্ক, বিলাসিতা, কলা, সুখ', kn: 'ಸಂಬಂಧಗಳು, ವೈಭವ, ಕಲೆಗಳು, ಸುಖ', gu: 'સંબંધો, વૈભવ, કળાઓ, સુખ' },
  6: { en: 'discipline, karma, delays, hard work, longevity', hi: 'अनुशासन, कर्म, विलम्ब, परिश्रम', sa: 'अनुशासन, कर्म, विलम्ब, परिश्रम', mai: 'अनुशासन, कर्म, विलम्ब, परिश्रम', mr: 'अनुशासन, कर्म, विलम्ब, परिश्रम', ta: 'ஒழுக்கம், கர்மா, தாமதம், கடின உழைப்பு, ஆயுள்', te: 'క్రమశిక్షణ, కర్మ, ఆలస్యం, కఠిన పరిశ్రమ, ఆయుష్షు', bn: 'শৃঙ্খলা, কর্ম, বিলম্ব, কঠোর পরিশ্রম, দীর্ঘায়ু', kn: 'ಶಿಸ್ತು, ಕರ್ಮ, ವಿಳಂಬ, ಕಠಿಣ ಪರಿಶ್ರಮ, ದೀರ್ಘಾಯುಷ್ಯ', gu: 'શિસ્ત, કર્મ, વિલંબ, કઠોર પરિશ્રમ, દીર્ઘાયુ' },
  7: { en: 'worldly desires, unconventional paths, foreign connections', hi: 'सांसारिक इच्छाएँ, अपरम्परागत, विदेशी सम्बन्ध', sa: 'सांसारिक इच्छाएँ, अपरम्परागत, विदेशी सम्बन्ध', mai: 'सांसारिक इच्छाएँ, अपरम्परागत, विदेशी सम्बन्ध', mr: 'सांसारिक इच्छाएँ, अपरम्परागत, विदेशी सम्बन्ध', ta: 'உலக ஆசைகள், வழக்கத்திற்கு மாறான பாதைகள், வெளிநாட்டு தொடர்புகள்', te: 'లౌకిక కోరికలు, అసాంప్రదాయ మార్గాలు, విదేశీ సంబంధాలు', bn: 'পার্থিব আকাঙ্ক্ষা, অপ্রচলিত পথ, বিদেশি সম্পর্ক', kn: 'ಲೌಕಿಕ ಆಸೆಗಳು, ಅಸಾಂಪ್ರದಾಯಿಕ ಮಾರ್ಗಗಳು, ವಿದೇಶಿ ಸಂಪರ್ಕಗಳು', gu: 'સાંસારિક ઈચ્છાઓ, અપરંપરાગત માર્ગો, વિદેશી સંબંધો' },
  8: { en: 'spirituality, detachment, liberation, past life', hi: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म', sa: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म', mai: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म', mr: 'आध्यात्मिकता, वैराग्य, मोक्ष, पूर्वजन्म', ta: 'ஆன்மீகம், பற்றின்மை, விடுதலை, முற்பிறவி', te: 'ఆధ్యాత్మికత, వైరాగ్యం, మోక్షం, పూర్వజన్మ', bn: 'আধ্যাত্মিকতা, বৈরাগ্য, মোক্ষ, পূর্বজন্ম', kn: 'ಆಧ್ಯಾತ್ಮಿಕತೆ, ವೈರಾಗ್ಯ, ಮೋಕ್ಷ, ಪೂರ್ವಜನ್ಮ', gu: 'આધ્યાત્મિકતા, વૈરાગ્ય, મોક્ષ, પૂર્વજન્મ' },
};

// Benefic houses from Moon for Jupiter (2,5,7,9,11) and Saturn (3,6,11)
const JUPITER_FAVORABLE_FROM_MOON = [2, 5, 7, 9, 11];
const SATURN_FAVORABLE_FROM_MOON = [3, 6, 11];

// Dosha-planet mapping: dosha name keywords → planet IDs that activate them
const DOSHA_PLANET_MAP: Record<string, number[]> = {
  mangal: [2],
  'manglik': [2],
  'kuja': [2],
  'sade sati': [6],
  'sade-sati': [6],
  'sadhe sati': [6],
  'kaal sarp': [7, 8],
  'kala sarpa': [7, 8],
  'kal sarpa': [7, 8],
  'pitra': [0, 6],
  'grahan': [7, 8],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function t(locale: Locale, en: string, hi: string): string {
  return locale === 'en' ? en : hi;
}

function housesOwnedBy(planetId: number, ascSign: number): number[] {
  const ownedSigns = Object.entries(SIGN_LORDS)
    .filter(([, lord]) => lord === planetId)
    .map(([sign]) => Number(sign));
  return ownedSigns.map(sign => ((sign - ascSign + 12) % 12) + 1);
}

function houseQualityLabel(house: number): 'kendra' | 'trikona' | 'dusthana' | 'other' {
  if (isKendra(house)) return 'kendra';
  if (isTrikona(house)) return 'trikona';
  if (isDusthana(house)) return 'dusthana';
  return 'other';
}

function getPlanetById(planets: PlanetPosition[], id: number): PlanetPosition | undefined {
  return planets.find(p => p.planet.id === id);
}

function parseDateSafe(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function monthsBetween(start: string, end: string): number {
  const s = parseDateSafe(start);
  const e = parseDateSafe(end);
  if (!s || !e) return 0;
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
}

function daysBetween(start: string, end: string): number {
  const s = parseDateSafe(start);
  const e = parseDateSafe(end);
  if (!s || !e) return 0;
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

function yearsBetween(start: string, end: string): number {
  const s = parseDateSafe(start);
  const e = parseDateSafe(end);
  if (!s || !e) return 0;
  return Math.round(((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
}

function isCurrentPeriod(startDate: string, endDate: string): boolean {
  const now = Date.now();
  const s = parseDateSafe(startDate);
  const e = parseDateSafe(endDate);
  if (!s || !e) return false;
  return s.getTime() <= now && now <= e.getTime();
}

function isPastPeriod(endDate: string): boolean {
  const e = parseDateSafe(endDate);
  if (!e) return false;
  return e.getTime() < Date.now();
}

function getTransitPosition(date: Date, planetId: number): { sign: number; longitude: number } {
  const jd = dateToJD(date.getFullYear(), date.getMonth() + 1, date.getDate(), 12);
  const positions = getPlanetaryPositions(jd);
  const p = positions.find(pos => pos.id === planetId);
  if (!p) return { sign: 1, longitude: 0 };
  const sidLong = toSidereal(p.longitude, jd);
  const sign = Math.floor(sidLong / 30) + 1;
  return { sign, longitude: sidLong };
}

function houseFromMoon(transitSign: number, moonSign: number): number {
  return ((transitSign - moonSign + 12) % 12) + 1;
}

function getDignityForPlanet(planet: PlanetPosition, planetId: number): string {
  if (planet.isExalted) return 'exalted';
  if (planet.isDebilitated) return 'debilitated';
  if (planet.isOwnSign) return 'own';
  return getPlanetDignity(planetId, planet.sign, parseFloat(planet.degree) || 15);
}

function getHouseTheme(house: number, locale: Locale): string {
  const theme = HOUSE_THEMES[house];
  if (!theme) return '';
  return t(locale, theme.en, theme.hi || "");
}

/** Find planet's house in a divisional chart (ChartData) */
function planetHouseInChart(
  chart: { houses: number[][] } | undefined,
  planetId: number
): number | undefined {
  if (!chart?.houses) return undefined;
  for (let h = 0; h < chart.houses.length; h++) {
    if (chart.houses[h]?.includes(planetId)) return h + 1; // 1-based
  }
  return undefined;
}

/** Count benefics in kendra and malefics in dusthana for prognosis */
function countBeneficsMalefics(planets: PlanetPosition[]): { beneficsInKendra: number; maleficsInDusthana: number } {
  const BENEFICS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
  const MALEFICS = new Set([0, 2, 6]);     // Sun, Mars, Saturn
  let beneficsInKendra = 0;
  let maleficsInDusthana = 0;
  for (const p of planets) {
    if (BENEFICS.has(p.planet.id) && isKendra(p.house)) beneficsInKendra++;
    if (MALEFICS.has(p.planet.id) && isDusthana(p.house)) maleficsInDusthana++;
  }
  return { beneficsInKendra, maleficsInDusthana };
}

// ─── Assessment Scoring ───────────────────────────────────────────────────────

function assessPeriod(factors: {
  dignity: string;
  houseQuality: string;
  interaction: string;
  auspiciousYogaCount: number;
  arishtaYogaCount: number;
  jupiterFavorable: boolean;
  saturnFavorable: boolean;
}): PeriodAssessment {
  let score = 0;

  // Dignity
  if (factors.dignity === 'exalted') score += 2;
  else if (factors.dignity === 'own' || factors.dignity === 'moolatrikona') score += 1.5;
  else if (factors.dignity === 'friendly') score += 0.5;
  else if (factors.dignity === 'enemy') score -= 0.5;
  else if (factors.dignity === 'debilitated') score -= 1.5;

  // House quality
  if (factors.houseQuality === 'kendra' || factors.houseQuality === 'trikona') score += 1;
  else if (factors.houseQuality === 'dusthana') score -= 1;

  // Interaction
  if (factors.interaction === 'friendly') score += 1;
  else if (factors.interaction === 'enemy') score -= 1;

  // Yogas
  score += factors.auspiciousYogaCount * 0.5;
  score -= factors.arishtaYogaCount * 0.5;

  // Transits
  if (factors.jupiterFavorable) score += 0.5;
  if (factors.saturnFavorable) score += 0.5;

  if (score >= 3) return 'very_favorable';
  if (score >= 1.5) return 'favorable';
  if (score >= 0) return 'mixed';
  if (score >= -1.5) return 'challenging';
  return 'difficult';
}

function assessmentToLabel(assessment: PeriodAssessment, locale: Locale): string {
  const labels: Record<PeriodAssessment, LocaleText> = {
    very_favorable: { en: 'Very Favorable', hi: 'अत्यन्त अनुकूल', sa: 'अत्यन्त अनुकूल', mai: 'अत्यन्त अनुकूल', mr: 'अत्यन्त अनुकूल', ta: 'மிகவும் அனுகூலம்', te: 'చాలా అనుకూలం', bn: 'অত্যন্ত অনুকূল', kn: 'ಅತ್ಯಂತ ಅನುಕೂಲ', gu: 'અત્યંત અનુકૂળ' },
    favorable: { en: 'Favorable', hi: 'अनुकूल', sa: 'अनुकूल', mai: 'अनुकूल', mr: 'अनुकूल', ta: 'அனுகூலம்', te: 'అనుకూలం', bn: 'অনুকূল', kn: 'ಅನುಕೂಲ', gu: 'અનુકૂળ' },
    mixed: { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रित', mai: 'मिश्रित', mr: 'मिश्रित', ta: 'கலவை', te: 'మిశ్రమం', bn: 'মিশ্র', kn: 'ಮಿಶ್ರ', gu: 'મિશ્ર' },
    challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'चुनौतीपूर्ण', mai: 'चुनौतीपूर्ण', mr: 'चुनौतीपूर्ण', ta: 'சவாலான', te: 'సవాలుతో కూడిన', bn: 'চ্যালেঞ্জিং', kn: 'ಸವಾಲಿನ', gu: 'પડકારજનક' },
    difficult: { en: 'Difficult', hi: 'कठिन', sa: 'कठिन', mai: 'कठिन', mr: 'कठिन', ta: 'கடினமான', te: 'కఠినం', bn: 'কঠিন', kn: 'ಕಠಿಣ', gu: 'કઠિન' },
  };
  return t(locale, labels[assessment].en, labels[assessment].hi || '');
}

// ─── Yoga/Dosha Activation ────────────────────────────────────────────────────

/** Check if a yoga is activated by a particular dasha lord */
function isYogaActivatedByPlanet(
  yoga: YogaInsight,
  planetId: number,
  planet: PlanetPosition | undefined,
  ascSign: number
): boolean {
  if (!yoga.present) return false;
  const ownedHouses = housesOwnedBy(planetId, ascSign);

  // Mahapurusha yogas: activate when the forming planet is the dasha lord
  if (yoga.type === 'mahapurusha') {
    // Hamsa=Jupiter(4), Malavya=Venus(5), Ruchaka=Mars(2), Bhadra=Mercury(3), Shasha=Saturn(6)
    const mahapurushaMap: Record<string, number> = {
      hamsa: 4, malavya: 5, ruchaka: 2, bhadra: 3, shasha: 6,
    };
    const key = yoga.name.toLowerCase().split(' ')[0];
    if (mahapurushaMap[key] === planetId) return true;
  }

  // Wealth yogas: activate for lords of 1,2,5,9,11
  const wealthHouses = [1, 2, 5, 9, 11];
  if (yoga.type === 'wealth' || yoga.name.toLowerCase().includes('dhana') || yoga.name.toLowerCase().includes('lakshmi')) {
    if (ownedHouses.some(h => wealthHouses.includes(h))) return true;
    if (planetId === 4 || planetId === 5) return true; // Jupiter/Venus = wealth karakas
  }

  // Raja yogas: activate for lords of kendra/trikona
  if (yoga.type === 'raja' || yoga.name.toLowerCase().includes('raja')) {
    if (ownedHouses.some(h => isKendra(h) || isTrikona(h))) return true;
  }

  // If planet occupies a house relevant to the yoga, activate
  if (planet && (isKendra(planet.house) || isTrikona(planet.house))) {
    if (yoga.strength === 'Strong') return true;
  }

  return false;
}

/** Check if a dosha is activated by a dasha lord */
function isDoshaActivatedByPlanet(dosha: DoshaInsight, planetId: number): boolean {
  if (!dosha.present) return false;
  const nameLower = dosha.name.toLowerCase();
  for (const [key, ids] of Object.entries(DOSHA_PLANET_MAP)) {
    if (nameLower.includes(key) && ids.includes(planetId)) return true;
  }
  return false;
}

// ─── Interaction Type ─────────────────────────────────────────────────────────

function getInteractionType(mahaLord: string, antarLord: string): 'friendly' | 'neutral' | 'enemy' {
  // BPHS Ch.3 Naisargika Maitri — directional lookup (not bidirectional pairs)
  // 2=friend, 1=neutral, 0=enemy. Assess from MAHA lord's perspective.
  const MAITRI: Record<string, Record<string, number>> = {
    Sun:     { Sun:2, Moon:2, Mars:2, Mercury:1, Jupiter:2, Venus:0, Saturn:0, Rahu:0, Ketu:1 },
    Moon:    { Sun:2, Moon:2, Mars:1, Mercury:2, Jupiter:1, Venus:1, Saturn:1, Rahu:1, Ketu:1 },
    Mars:    { Sun:2, Moon:2, Mars:2, Mercury:0, Jupiter:2, Venus:1, Saturn:1, Rahu:1, Ketu:1 },
    Mercury: { Sun:2, Moon:0, Mars:1, Mercury:2, Jupiter:1, Venus:2, Saturn:1, Rahu:1, Ketu:1 },
    Jupiter: { Sun:2, Moon:2, Mars:2, Mercury:0, Jupiter:2, Venus:0, Saturn:1, Rahu:0, Ketu:1 },
    Venus:   { Sun:0, Moon:0, Mars:1, Mercury:2, Jupiter:1, Venus:2, Saturn:2, Rahu:1, Ketu:1 },
    Saturn:  { Sun:0, Moon:0, Mars:0, Mercury:2, Jupiter:1, Venus:2, Saturn:2, Rahu:2, Ketu:1 },
    Rahu:    { Sun:0, Moon:0, Mars:0, Mercury:1, Jupiter:0, Venus:1, Saturn:2, Rahu:2, Ketu:0 },
    Ketu:    { Sun:1, Moon:1, Mars:2, Mercury:1, Jupiter:2, Venus:0, Saturn:0, Rahu:0, Ketu:2 },
  };

  const mahaView = MAITRI[mahaLord]?.[antarLord] ?? 1;
  const antarView = MAITRI[antarLord]?.[mahaLord] ?? 1;
  // Combined: both friendly → friendly; both enemy → enemy; mixed → neutral
  const combined = mahaView + antarView;
  if (combined >= 3) return 'friendly';  // 2+2 or 2+1
  if (combined <= 1) return 'enemy';     // 0+0 or 0+1

  // For combined=2: could be 1+1 (neutral+neutral) or 2+0 (friend+enemy)
  // 2+0 means one sees friend, other sees enemy → treat as neutral
  return 'neutral';
}

// ─── Transit Context ──────────────────────────────────────────────────────────

function getTransitContext(
  startDate: string,
  moonSign: number,
  locale: Locale
): { text: string; jupiterFavorable: boolean; saturnFavorable: boolean } {
  const date = parseDateSafe(startDate);
  if (!date) {
    return { text: '', jupiterFavorable: false, saturnFavorable: false };
  }

  try {
    const jupiter = getTransitPosition(date, 4);
    const saturn = getTransitPosition(date, 6);

    const jupHouse = houseFromMoon(jupiter.sign, moonSign);
    const satHouse = houseFromMoon(saturn.sign, moonSign);

    const jupiterFavorable = JUPITER_FAVORABLE_FROM_MOON.includes(jupHouse);
    const saturnFavorable = SATURN_FAVORABLE_FROM_MOON.includes(satHouse);

    const text = t(locale,
      `At period start, Jupiter transits house ${jupHouse} from Moon (${jupiterFavorable ? 'favorable' : 'challenging'}) and Saturn transits house ${satHouse} from Moon (${saturnFavorable ? 'supportive' : 'testing'}). ${jupiterFavorable && saturnFavorable ? 'Double transit support strengthens this period considerably.' : jupiterFavorable ? 'Jupiter\'s favorable transit provides growth opportunities.' : saturnFavorable ? 'Saturn\'s supportive transit brings structured progress.' : 'Both major transits are testing — rely on natal strengths and remedies.'}`,
      `काल आरम्भ पर बृहस्पति चन्द्र से ${jupHouse}वें भाव में (${jupiterFavorable ? 'अनुकूल' : 'चुनौतीपूर्ण'}) और शनि ${satHouse}वें भाव में (${saturnFavorable ? 'सहायक' : 'परीक्षाकारी'}) गोचर करते हैं। ${jupiterFavorable && saturnFavorable ? 'दोहरा गोचर समर्थन इस काल को बहुत सशक्त करता है।' : jupiterFavorable ? 'बृहस्पति का अनुकूल गोचर विकास के अवसर देता है।' : saturnFavorable ? 'शनि का सहायक गोचर व्यवस्थित प्रगति लाता है।' : 'दोनों प्रमुख गोचर परीक्षाकारी हैं — जन्मकालिक बल और उपायों पर भरोसा करें।'}`
    );

    return { text, jupiterFavorable, saturnFavorable };
  } catch {
    return { text: '', jupiterFavorable: false, saturnFavorable: false };
  }
}

// ─── Divisional Insights ──────────────────────────────────────────────────────

function getDivisionalInsights(
  kundali: KundaliData,
  mahaPlanetId: number,
  antarPlanetId: number,
  antarEndDate: string | undefined,
  locale: Locale
): { D1: string; D9: string; D10: string; D2: string } {
  const mahaPlanet = getPlanetById(kundali.planets, mahaPlanetId);
  const antarPlanet = getPlanetById(kundali.planets, antarPlanetId);
  const mahaName = PLANET_NAMES[mahaPlanetId] || PLANET_NAMES[0];
  const antarName = PLANET_NAMES[antarPlanetId] || PLANET_NAMES[0];
  const { beneficsInKendra, maleficsInDusthana } = countBeneficsMalefics(kundali.planets);

  const charts: { key: string; domainEn: string; domainHi: string; chart?: { houses: number[][] } }[] = [
    { key: 'D1', domainEn: 'Overall Life', domainHi: 'समग्र जीवन', chart: kundali.chart },
    { key: 'D9', domainEn: 'Marriage & Dharma', domainHi: 'विवाह एवं धर्म', chart: kundali.navamshaChart },
    { key: 'D10', domainEn: 'Career', domainHi: 'कैरियर', chart: kundali.divisionalCharts?.D10 },
    { key: 'D2', domainEn: 'Wealth', domainHi: 'धन', chart: kundali.divisionalCharts?.D2 },
  ];

  const results: Record<string, string> = {};

  for (const { key, domainEn, domainHi, chart } of charts) {
    const mahaHouse = chart ? planetHouseInChart(chart, mahaPlanetId) : mahaPlanet?.house;
    const antarHouse = chart ? planetHouseInChart(chart, antarPlanetId) : antarPlanet?.house;

    const prognosis = generateDashaPrognosis({
      chartKey: key,
      domainEn,
      domainHi,
      mahaPlanetId,
      mahaPlanetNameEn: triLocale(mahaName, 'en'),
      mahaPlanetNameHi: triLocale(mahaName, 'hi'),
      mahaHouse,
      antarPlanetId,
      antarPlanetNameEn: triLocale(antarName, 'en'),
      antarPlanetNameHi: triLocale(antarName, 'hi'),
      antarHouse,
      antarEndDate,
      ascendantSign: kundali.ascendant.sign,
      beneficsInKendra,
      maleficsInDusthana,
    });

    results[key] = t(locale, prognosis.en, prognosis.hi || "");
  }

  return {
    D1: results['D1'] || '',
    D9: results['D9'] || '',
    D10: results['D10'] || '',
    D2: results['D2'] || '',
  };
}

// ─── Life Areas Synthesis ─────────────────────────────────────────────────────

function synthesizeLifeAreas(
  activatedHouses: number[],
  planetId: number,
  dignity: string,
  transitCtx: { jupiterFavorable: boolean; saturnFavorable: boolean },
  locale: Locale
): { career: string; relationships: string; health: string; finance: string; spirituality: string } {
  const dignityPositive = ['exalted', 'own', 'moolatrikona', 'friendly'].includes(dignity);
  const pName = triLocale(PLANET_NAMES[planetId] || PLANET_NAMES[0], locale);

  // Career (houses 10, 6, 2, 11)
  const careerHouses = activatedHouses.filter(h => [10, 6, 2, 11].includes(h));
  const career = careerHouses.length > 0
    ? t(locale,
      `${pName} activates career-related houses (${careerHouses.join(', ')}). ${dignityPositive ? 'Professional advancement and recognition are likely. Take initiative in career matters.' : 'Career requires extra effort and patience. Avoid impulsive changes.'}${transitCtx.jupiterFavorable ? ' Jupiter\'s favorable transit supports growth.' : ''}`,
      `${pName} कैरियर-सम्बन्धी भावों (${careerHouses.join(', ')}) को सक्रिय करता है। ${dignityPositive ? 'व्यावसायिक उन्नति और मान्यता की सम्भावना। कैरियर विषयों में पहल करें।' : 'कैरियर में अतिरिक्त प्रयास और धैर्य आवश्यक।'}`)
    : t(locale,
      `Career is not a primary focus of this sub-period, though ${pName}'s general influence colors professional life.`,
      `कैरियर इस उपकाल का प्राथमिक केन्द्र नहीं, यद्यपि ${pName} का सामान्य प्रभाव व्यावसायिक जीवन को प्रभावित करता है।`);

  // Relationships (houses 7, 5, 2, 4)
  const relHouses = activatedHouses.filter(h => [7, 5, 2, 4].includes(h));
  const relationships = relHouses.length > 0
    ? t(locale,
      `Relationship houses (${relHouses.join(', ')}) are activated. ${dignityPositive ? 'Harmonious partnerships, romantic developments, and family bonding are indicated.' : 'Relationships may face tests. Clear communication and patience help navigate tensions.'}`,
      `सम्बन्ध भाव (${relHouses.join(', ')}) सक्रिय हैं। ${dignityPositive ? 'सामंजस्यपूर्ण साझेदारी, रोमांटिक विकास और पारिवारिक बन्धन संकेतित।' : 'सम्बन्धों में परीक्षा हो सकती है। स्पष्ट संवाद और धैर्य सहायक।'}`)
    : t(locale,
      `Relationships continue on a steady course. No major disruptions or breakthroughs are specifically indicated.`,
      `सम्बन्ध स्थिर मार्ग पर चलते रहते हैं। कोई प्रमुख व्यवधान या सफलता विशेष रूप से संकेतित नहीं।`);

  // Health (houses 1, 6, 8)
  const healthHouses = activatedHouses.filter(h => [1, 6, 8].includes(h));
  const health = healthHouses.length > 0
    ? t(locale,
      `Health-related houses (${healthHouses.join(', ')}) are activated by ${pName}. ${isDusthana(healthHouses[0]) && !dignityPositive ? 'Pay attention to physical well-being. Preventive care and stress management are important during this period.' : 'Good vitality is indicated. Physical activity and wellness practices are well-supported.'}`,
      `${pName} द्वारा स्वास्थ्य-सम्बन्धी भाव (${healthHouses.join(', ')}) सक्रिय हैं। ${isDusthana(healthHouses[0]) && !dignityPositive ? 'शारीरिक स्वास्थ्य पर ध्यान दें। निवारक देखभाल और तनाव प्रबन्धन महत्वपूर्ण।' : 'अच्छी जीवनशक्ति संकेतित। शारीरिक गतिविधि और स्वास्थ्य अभ्यास समर्थित।'}`)
    : t(locale,
      `Health is not a primary focus. Maintain regular wellness routines for continued good health.`,
      `स्वास्थ्य प्राथमिक केन्द्र नहीं। निरन्तर अच्छे स्वास्थ्य के लिए नियमित दिनचर्या बनाए रखें।`);

  // Finance (houses 2, 11, 5, 9)
  const finHouses = activatedHouses.filter(h => [2, 11, 5, 9].includes(h));
  const finance = finHouses.length > 0
    ? t(locale,
      `Wealth houses (${finHouses.join(', ')}) are energized. ${dignityPositive ? 'Financial gains, income growth, and material accumulation are supported. Good time for investments and financial planning.' : 'Financial caution advised. Avoid speculative risks and focus on conserving resources.'}`,
      `धन भाव (${finHouses.join(', ')}) ऊर्जावान हैं। ${dignityPositive ? 'आर्थिक लाभ, आय वृद्धि और भौतिक संचय समर्थित। निवेश और वित्तीय योजना के लिए अच्छा समय।' : 'आर्थिक सावधानी उचित। सट्टा जोखिम से बचें और संसाधन संरक्षण पर ध्यान दें।'}`)
    : t(locale,
      `Finances remain stable without dramatic changes. Routine income and expenditure patterns continue.`,
      `वित्त बिना नाटकीय परिवर्तन के स्थिर रहता है। नियमित आय और व्यय का क्रम जारी।`);

  // Spirituality (houses 9, 12, 8, 5)
  const spiritHouses = activatedHouses.filter(h => [9, 12, 8, 5].includes(h));
  const spirituality = spiritHouses.length > 0
    ? t(locale,
      `Spiritual houses (${spiritHouses.join(', ')}) are activated. ${planetId === 4 || planetId === 8 ? 'Deep spiritual growth, meditation practice, and philosophical insights are strongly supported.' : 'Spiritual awareness increases. Pilgrimages, charitable work, and inner reflection are beneficial.'}`,
      `आध्यात्मिक भाव (${spiritHouses.join(', ')}) सक्रिय हैं। ${planetId === 4 || planetId === 8 ? 'गहन आध्यात्मिक विकास, ध्यान अभ्यास और दार्शनिक अन्तर्दृष्टि दृढ़ता से समर्थित।' : 'आध्यात्मिक जागरूकता बढ़ती है। तीर्थयात्रा, दान और आत्मचिन्तन लाभदायक।'}`)
    : t(locale,
      `Spirituality is not a primary theme, though maintaining regular practices supports overall well-being.`,
      `आध्यात्मिकता प्राथमिक विषय नहीं, यद्यपि नियमित अभ्यास समग्र कल्याण में सहायक।`);

  return { career, relationships, health, finance, spirituality };
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

export function generateDashaSynthesis(
  kundali: KundaliData,
  locale: Locale
): DashaSynthesis {
  const ascSign = kundali.ascendant.sign;
  const moonPlanet = getPlanetById(kundali.planets, 1);
  const moonSign = moonPlanet?.sign ?? 1;

  // Get yogas and doshas from tippanni if available (via kundali computed data)
  // These are typically generated by tippanni-engine and may be passed along
  const yogas: YogaInsight[] = [];
  const doshas: DoshaInsight[] = [];

  // Try to extract from yogasComplete
  if (kundali.yogasComplete) {
    for (const y of kundali.yogasComplete) {
      yogas.push({
        name: triLocale(y.name, locale),
        present: y.present,
        type: y.category,
        description: triLocale(y.description, locale),
        implications: '',
        strength: y.strength,
      });
    }
  }

  // ── Lifetime Summary ──────────────────────────────────────────────────

  const lifetimeSummary: MahadashaOverview[] = kundali.dashas
    .filter(d => d.level === 'maha')
    .map(dasha => {
      const planetId = NAME_TO_ID[dasha.planet];
      const planet = planetId !== undefined ? getPlanetById(kundali.planets, planetId) : undefined;
      const owned = planetId !== undefined ? housesOwnedBy(planetId, ascSign) : [];
      const pTheme = planetId !== undefined ? PLANET_THEMES[planetId] : undefined;

      let theme = '';
      if (pTheme && owned.length > 0) {
        const houseDescs = owned.map(h => {
          const ht = HOUSE_THEMES[h];
          return ht ? `${h} (${t(locale, ht.en, ht.hi || "")})` : `${h}`;
        }).join(', ');

        const dignityNote = planet
          ? (planet.isExalted ? t(locale, ' Planet is exalted — peak results.', ' ग्रह उच्च — शिखर परिणाम।')
            : planet.isDebilitated ? t(locale, ' Planet is debilitated — challenges require effort.', ' ग्रह नीच — चुनौतियों में प्रयास आवश्यक।')
            : planet.isOwnSign ? t(locale, ' Planet is in own sign — natural strength.', ' ग्रह स्वगृह में — प्राकृतिक बल।')
            : '')
          : '';

        theme = t(locale,
          `Themes of ${pTheme.en} focused through houses ${houseDescs}.${dignityNote}`,
          `${pTheme.hi} के विषय भावों ${houseDescs} के माध्यम से केन्द्रित।${dignityNote}`);
      }

      return {
        planet: dasha.planet,
        planetName: dasha.planetName,
        startDate: dasha.startDate,
        endDate: dasha.endDate,
        years: yearsBetween(dasha.startDate, dasha.endDate),
        isCurrent: isCurrentPeriod(dasha.startDate, dasha.endDate),
        isPast: isPastPeriod(dasha.endDate),
        theme,
      };
    });

  // ── Current Mahadasha Deep Dive ───────────────────────────────────────

  const currentMahaDasha = kundali.dashas.find(
    d => d.level === 'maha' && isCurrentPeriod(d.startDate, d.endDate)
  );

  if (!currentMahaDasha) {
    return { lifetimeSummary, currentMaha: null };
  }

  const mahaLordId = NAME_TO_ID[currentMahaDasha.planet];
  const mahaLordPlanet = mahaLordId !== undefined ? getPlanetById(kundali.planets, mahaLordId) : undefined;

  // Overview via getDashaLordAnalysis
  const lordAnalysis = getDashaLordAnalysis(
    currentMahaDasha.planet,
    kundali.planets,
    kundali.houses,
    ascSign,
    locale
  );
  const overview = [lordAnalysis.overall, lordAnalysis.dignityEffect, lordAnalysis.houseEffect]
    .filter(Boolean)
    .join(' ');

  // Yoga activation
  const yogasActivated = yogas
    .filter(y => mahaLordId !== undefined && isYogaActivatedByPlanet(y, mahaLordId, mahaLordPlanet, ascSign))
    .map(y => ({
      name: y.name,
      type: y.type,
      effect: t(locale,
        `Activated during ${currentMahaDasha.planet} Mahadasha. ${y.description}`,
        `${currentMahaDasha.planet} महादशा में सक्रिय। ${y.description}`),
    }));

  // Dosha activation
  const doshasActivated = doshas
    .filter(d => mahaLordId !== undefined && isDoshaActivatedByPlanet(d, mahaLordId))
    .map(d => ({
      name: d.name,
      severity: d.severity,
      effect: t(locale,
        `${d.name} manifests during ${currentMahaDasha.planet} Mahadasha. ${d.description}`,
        `${d.name} ${currentMahaDasha.planet} महादशा में प्रकट। ${d.description}`),
    }));

  // Find current antardasha for divisional insights
  const currentAntar = currentMahaDasha.subPeriods?.find(
    a => isCurrentPeriod(a.startDate, a.endDate)
  );
  const antarIdForDiv = currentAntar ? (NAME_TO_ID[currentAntar.planet] ?? 0) : (mahaLordId ?? 0);

  const divisionalInsights = getDivisionalInsights(
    kundali,
    mahaLordId ?? 0,
    antarIdForDiv,
    currentAntar?.endDate,
    locale
  );

  // ── Antardasha Synthesis ──────────────────────────────────────────────

  const antardashas: AntardashaSynthesis[] = (currentMahaDasha.subPeriods || []).map(antar => {
    const antarLordId = NAME_TO_ID[antar.planet];
    const antarLordPlanet = antarLordId !== undefined ? getPlanetById(kundali.planets, antarLordId) : undefined;
    const isCurrent = isCurrentPeriod(antar.startDate, antar.endDate);

    // Lord analysis
    const antarAnalysis = getDashaLordAnalysis(
      antar.planet,
      kundali.planets,
      kundali.houses,
      ascSign,
      locale
    );

    // Interaction
    const interaction = getAntardashaInteraction(currentMahaDasha.planet, antar.planet, locale);
    const interactionType = getInteractionType(currentMahaDasha.planet, antar.planet);

    // Yogas triggered
    const yogasTriggered = yogas
      .filter(y => antarLordId !== undefined && isYogaActivatedByPlanet(y, antarLordId, antarLordPlanet, ascSign))
      .map(y => y.name);

    // Doshas triggered
    const doshasTriggered = doshas
      .filter(d => antarLordId !== undefined && isDoshaActivatedByPlanet(d, antarLordId))
      .map(d => d.name);

    // Houses activated: owned + occupied
    const ownedHouses = antarLordId !== undefined ? housesOwnedBy(antarLordId, ascSign) : [];
    const occupiedHouse = antarLordPlanet?.house;
    const allActivatedHouses = [...new Set([...ownedHouses, ...(occupiedHouse ? [occupiedHouse] : [])])].sort((a, b) => a - b);
    const housesActivated = allActivatedHouses.map(h => ({
      house: h,
      theme: getHouseTheme(h, locale),
    }));

    // Transit context
    const transitCtx = getTransitContext(antar.startDate, moonSign, locale);

    // Dignity
    const dignity = antarLordPlanet && antarLordId !== undefined
      ? getDignityForPlanet(antarLordPlanet, antarLordId)
      : 'neutral';

    // Best house quality among activated
    const bestHQ = allActivatedHouses.length > 0
      ? (allActivatedHouses.some(h => isKendra(h) || isTrikona(h))
        ? (allActivatedHouses.some(h => isKendra(h)) ? 'kendra' : 'trikona')
        : allActivatedHouses.some(h => isDusthana(h)) ? 'dusthana' : 'other')
      : 'other';

    // Auspicious vs inauspicious yoga counts
    const auspCount = yogasTriggered.length;
    const arishtaCount = doshasTriggered.length;

    // Assessment
    const netAssessment = assessPeriod({
      dignity,
      houseQuality: bestHQ,
      interaction: interactionType,
      auspiciousYogaCount: auspCount,
      arishtaYogaCount: arishtaCount,
      jupiterFavorable: transitCtx.jupiterFavorable,
      saturnFavorable: transitCtx.saturnFavorable,
    });

    // Life areas
    const lifeAreas = synthesizeLifeAreas(
      allActivatedHouses,
      antarLordId ?? 0,
      dignity,
      transitCtx,
      locale
    );

    // Divisional insights for this antardasha
    const antarDivInsights = getDivisionalInsights(
      kundali,
      mahaLordId ?? 0,
      antarLordId ?? 0,
      antar.endDate,
      locale
    );

    // Summary
    const assessLabel = assessmentToLabel(netAssessment, locale);
    const pName = triLocale(antar.planetName, locale);
    const summary = t(locale,
      `${currentMahaDasha.planet}-${antar.planet} period (${assessLabel}): ${antarAnalysis.overall} Houses ${allActivatedHouses.join(', ')} are activated, bringing focus to ${allActivatedHouses.slice(0, 2).map(h => HOUSE_THEMES[h]?.en || '').join(' and ')}.${yogasTriggered.length > 0 ? ` Yogas active: ${yogasTriggered.join(', ')}.` : ''}${doshasTriggered.length > 0 ? ` Doshas manifesting: ${doshasTriggered.join(', ')}.` : ''}`,
      `${currentMahaDasha.planet}-${antar.planet} काल (${assessLabel}): ${antarAnalysis.overall} भाव ${allActivatedHouses.join(', ')} सक्रिय, ${allActivatedHouses.slice(0, 2).map(h => HOUSE_THEMES[h]?.hi || '').join(' और ')} पर ध्यान केन्द्रित।${yogasTriggered.length > 0 ? ` सक्रिय योग: ${yogasTriggered.join(', ')}।` : ''}${doshasTriggered.length > 0 ? ` प्रकट दोष: ${doshasTriggered.join(', ')}।` : ''}`
    );

    // Advice
    const advice = t(locale,
      `${antarAnalysis.advice}${netAssessment === 'difficult' || netAssessment === 'challenging' ? ` Strengthen ${pName} through its remedies. Avoid major commitments during the first and last months of this sub-period.` : ` This is a good time to pursue ${pName}'s significations with confidence.`}`,
      `${antarAnalysis.advice}${netAssessment === 'difficult' || netAssessment === 'challenging' ? ` ${pName} को उपायों से मजबूत करें। इस उपकाल के पहले और अन्तिम माह में बड़ी प्रतिबद्धताओं से बचें।` : ` ${pName} के कारकत्वों को आत्मविश्वास से अपनाने का अच्छा समय।`}`
    );

    // Key dates: start, midpoint, end
    const startD = parseDateSafe(antar.startDate);
    const endD = parseDateSafe(antar.endDate);
    const keyDates: string[] = [];
    if (startD) keyDates.push(antar.startDate);
    if (startD && endD) {
      const mid = new Date((startD.getTime() + endD.getTime()) / 2);
      keyDates.push(mid.toISOString().split('T')[0]);
    }
    if (endD) keyDates.push(antar.endDate);

    // ── Pratyantardasha ──────────────────────────────────────────────

    // Compute pratyantardasha periods if not already in the data
    // Formula: P_duration = (Antar_lord_years × Pratyantar_lord_years / 120) × (Antar_actual_duration / Antar_lord_years)
    const DASHA_SEQ = [
      { planet: 'Ketu', years: 7 }, { planet: 'Venus', years: 20 }, { planet: 'Sun', years: 6 },
      { planet: 'Moon', years: 10 }, { planet: 'Mars', years: 7 }, { planet: 'Rahu', years: 18 },
      { planet: 'Jupiter', years: 16 }, { planet: 'Saturn', years: 19 }, { planet: 'Mercury', years: 17 },
    ];
    const antarLordSeqIdx = DASHA_SEQ.findIndex(d => d.planet === antar.planet);
    let pratySubPeriods = antar.subPeriods || [];
    if (pratySubPeriods.length === 0 && antarLordSeqIdx >= 0 && startD && endD) {
      // Compute on the fly
      const antarActualMs = endD.getTime() - startD.getTime();
      const antarLordYears = DASHA_SEQ[antarLordSeqIdx].years;
      let pratyStart = new Date(startD.getTime());
      pratySubPeriods = [];
      for (let pi = 0; pi < 9; pi++) {
        const pratySeqIdx = (antarLordSeqIdx + pi) % 9;
        const pratyLord = DASHA_SEQ[pratySeqIdx];
        const pratyFrac = (antarLordYears * pratyLord.years) / (120 * antarLordYears);
        const pratyMs = antarActualMs * pratyFrac;
        const pratyEnd = new Date(pratyStart.getTime() + pratyMs);
        pratySubPeriods.push({
          planet: pratyLord.planet,
          planetName: PLANET_NAMES[NAME_TO_ID[pratyLord.planet]] || { en: pratyLord.planet, hi: pratyLord.planet, sa: pratyLord.planet },
          startDate: pratyStart.toISOString().split('T')[0],
          endDate: pratyEnd.toISOString().split('T')[0],
          level: 'pratyantar' as const,
        });
        pratyStart = pratyEnd;
      }
    }

    const pratyantardashas: PratyantardashaSynthesis[] = pratySubPeriods.map(praty => {
      const pratyLordId = NAME_TO_ID[praty.planet];
      const pratyLordPlanet = pratyLordId !== undefined ? getPlanetById(kundali.planets, pratyLordId) : undefined;
      const pratyDignity = pratyLordPlanet && pratyLordId !== undefined
        ? getDignityForPlanet(pratyLordPlanet, pratyLordId)
        : 'neutral';
      const pratyOwnedHouses = pratyLordId !== undefined ? housesOwnedBy(pratyLordId, ascSign) : [];
      const pratyOccupied = pratyLordPlanet?.house;
      const pratyAllHouses = [...new Set([...pratyOwnedHouses, ...(pratyOccupied ? [pratyOccupied] : [])])];

      const pratyBestHQ = pratyAllHouses.length > 0
        ? (pratyAllHouses.some(h => isKendra(h) || isTrikona(h))
          ? (pratyAllHouses.some(h => isKendra(h)) ? 'kendra' : 'trikona')
          : pratyAllHouses.some(h => isDusthana(h)) ? 'dusthana' : 'other')
        : 'other';

      const pratyInteraction = getInteractionType(antar.planet, praty.planet);

      const pratyAssessment = assessPeriod({
        dignity: pratyDignity,
        houseQuality: pratyBestHQ,
        interaction: pratyInteraction,
        auspiciousYogaCount: 0,
        arishtaYogaCount: 0,
        jupiterFavorable: transitCtx.jupiterFavorable, // Use parent antardasha's transit
        saturnFavorable: transitCtx.saturnFavorable,
      });

      // Check if critical
      const isCritical = pratyDignity === 'debilitated'
        || (pratyLordPlanet?.isCombust ?? false)
        || pratyBestHQ === 'dusthana'
        || (pratyInteraction === 'enemy' && pratyDignity === 'enemy');

      const pratyPName = triLocale(praty.planetName, locale);
      const pratyTheme = PLANET_THEMES[pratyLordId ?? 0];
      const keyTheme = t(locale,
        `${pratyPName} sub-sub-period brings focus on ${pratyTheme?.en || 'general themes'} through houses ${pratyAllHouses.join(', ')}.`,
        `${pratyPName} प्रत्यन्तर्दशा ${pratyTheme?.hi || 'सामान्य विषयों'} पर भावों ${pratyAllHouses.join(', ')} के माध्यम से ध्यान केन्द्रित करती है।`
      );

      const pratyAdvice = isCritical
        ? t(locale,
          `Caution advised during this sub-sub-period. ${pratyPName} faces challenges in the natal chart. Avoid risky decisions and strengthen ${pratyPName} through remedial measures.`,
          `इस प्रत्यन्तर्दशा में सावधानी उचित। ${pratyPName} जन्म कुण्डली में चुनौतियों का सामना करता है। जोखिम भरे निर्णय से बचें और उपायों से ${pratyPName} को सबल करें।`)
        : t(locale,
          `A manageable sub-sub-period. ${pratyPName}'s influence is ${pratyDignity === 'exalted' || pratyDignity === 'own' ? 'strong and supportive' : 'moderate'}. Stay focused on ongoing priorities.`,
          `एक प्रबन्धनीय प्रत्यन्तर्दशा। ${pratyPName} का प्रभाव ${pratyDignity === 'exalted' || pratyDignity === 'own' ? 'सबल और सहायक' : 'मध्यम'} है। चल रही प्राथमिकताओं पर ध्यान बनाए रखें।`);

      // Expanded data for critical pratyantardashas
      let expanded: PratyantardashaSynthesis['expanded'] = undefined;
      if (isCritical) {
        const pratyLordAnalysis = getDashaLordAnalysis(
          praty.planet,
          kundali.planets,
          kundali.houses,
          ascSign,
          locale
        );

        const pratyD1House = pratyLordPlanet?.house;
        const d1Insight = pratyD1House
          ? t(locale,
            `In D1, ${pratyPName} occupies house ${pratyD1House} (${HOUSE_THEMES[pratyD1House]?.en || ''}). ${pratyLordAnalysis.houseEffect}`,
            `D1 में ${pratyPName} भाव ${pratyD1House} (${HOUSE_THEMES[pratyD1House]?.hi || ''}) में स्थित। ${pratyLordAnalysis.houseEffect}`)
          : '';

        let warning: string | undefined;
        if (pratyDignity === 'debilitated') {
          warning = t(locale,
            `${pratyPName} is debilitated — exercise maximum caution. Health, finances, and relationships in ${pratyPName}'s domain need protective attention.`,
            `${pratyPName} नीच — अधिकतम सावधानी बरतें। ${pratyPName} के क्षेत्र में स्वास्थ्य, वित्त और सम्बन्धों को सुरक्षात्मक ध्यान चाहिए।`);
        } else if (pratyLordPlanet?.isCombust) {
          warning = t(locale,
            `${pratyPName} is combust (too close to Sun) — its significations are weakened. Avoid overexposure in ${pratyPName}'s domains.`,
            `${pratyPName} अस्त (सूर्य के अत्यन्त निकट) — इसके कारकत्व दुर्बल। ${pratyPName} के क्षेत्रों में अत्यधिक प्रदर्शन से बचें।`);
        }

        expanded = {
          lordAnalysis: pratyLordAnalysis.overall,
          divisionalInsights: { D1: d1Insight },
          warning,
        };
      }

      return {
        planet: praty.planet,
        planetName: praty.planetName,
        startDate: praty.startDate,
        endDate: praty.endDate,
        durationDays: daysBetween(praty.startDate, praty.endDate),
        isCritical,
        netAssessment: pratyAssessment,
        keyTheme,
        advice: pratyAdvice,
        expanded,
      };
    });

    return {
      planet: antar.planet,
      planetName: antar.planetName,
      startDate: antar.startDate,
      endDate: antar.endDate,
      durationMonths: monthsBetween(antar.startDate, antar.endDate),
      isCurrent,
      lordAnalysis: [antarAnalysis.overall, antarAnalysis.dignityEffect].filter(Boolean).join(' '),
      interaction,
      yogasTriggered,
      doshasTriggered,
      housesActivated,
      transitContext: transitCtx.text,
      lifeAreas,
      divisionalInsights: antarDivInsights,
      netAssessment,
      summary,
      advice,
      keyDates,
      pratyantardashas,
    };
  });

  const currentMaha: MahadashaSynthesis = {
    planet: currentMahaDasha.planet,
    planetName: currentMahaDasha.planetName,
    startDate: currentMahaDasha.startDate,
    endDate: currentMahaDasha.endDate,
    years: yearsBetween(currentMahaDasha.startDate, currentMahaDasha.endDate),
    overview,
    yogasActivated,
    doshasActivated,
    divisionalInsights,
    antardashas,
  };

  return { lifetimeSummary, currentMaha };
}

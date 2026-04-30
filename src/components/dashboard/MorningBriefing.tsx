'use client';
import { tl } from '@/lib/utils/trilingual';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles, Clock, AlertTriangle, Orbit } from 'lucide-react';
import type { PanchangData, Locale, HoraSlot , LocaleText} from '@/types/panchang';
import type { PersonalizedDay } from '@/lib/personalization/types';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Labels (en / hi)
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: "Today's Cosmic Weather",
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    vara: 'Vara',
    hora: 'Hora Now',
    rahuKaal: 'Rahu Kaal',
    moonTransit: 'Moon Transit',
    shukla: 'Shukla',
    krishna: 'Krishna',
    fastDay: 'fast day',
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    neutral: 'Neutral',
    rulingPlanet: 'Ruling planet',
    rahuActive: 'Rahu Kaal active now!',
    rahuUpcoming: 'Rahu Kaal',
    bestHora: 'Best hora now',
    wisdom: 'wisdom, education',
    wealth: 'wealth, finance',
    energy: 'energy, action',
    communication: 'intellect, trade',
    beauty: 'love, luxury',
    discipline: 'patience, karma',
    emotions: 'mind, intuition',
    houseLabel: 'house',
    moonInYour: 'Moon transiting your',
    masa: 'Masa',
    samvatsara: 'Samvatsara',
  },
  hi: {
    heading: 'आज का ब्रह्माण्डीय मौसम',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    vara: 'वार',
    hora: 'वर्तमान होरा',
    rahuKaal: 'राहु काल',
    moonTransit: 'चन्द्र गोचर',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    fastDay: 'व्रत दिवस',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    rulingPlanet: 'स्वामी ग्रह',
    rahuActive: 'राहु काल अभी सक्रिय!',
    rahuUpcoming: 'राहु काल',
    bestHora: 'वर्तमान शुभ होरा',
    wisdom: 'ज्ञान, शिक्षा',
    wealth: 'धन, वित्त',
    energy: 'शक्ति, क्रिया',
    communication: 'बुद्धि, व्यापार',
    beauty: 'प्रेम, विलास',
    discipline: 'धैर्य, कर्म',
    emotions: 'मन, अन्तर्ज्ञान',
    houseLabel: 'भाव',
    moonInYour: 'चन्द्र आपके',
    masa: 'मास',
    samvatsara: 'सम्वत्सर',
  },
  sa: {
    heading: 'अद्य ब्रह्माण्डवातावरणम्',
    tithi: 'तिथिः',
    nakshatra: 'नक्षत्रम्',
    yoga: 'योगः',
    vara: 'वारः',
    hora: 'वर्तमानहोरा',
    rahuKaal: 'राहुकालः',
    moonTransit: 'चन्द्रगोचरः',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    fastDay: 'व्रतदिवसः',
    auspicious: 'शुभम्',
    inauspicious: 'अशुभम्',
    neutral: 'सामान्यम्',
    rulingPlanet: 'स्वामिग्रहः',
    rahuActive: 'राहुकालः अधुना सक्रियः!',
    rahuUpcoming: 'राहुकालः',
    bestHora: 'वर्तमानशुभहोरा',
    wisdom: 'ज्ञानम्, शिक्षा',
    wealth: 'धनम्, वित्तम्',
    energy: 'शक्तिः, क्रिया',
    communication: 'बुद्धिः, वाणिज्यम्',
    beauty: 'प्रेम, विलासः',
    discipline: 'धैर्यम्, कर्म',
    emotions: 'मनः, अन्तर्ज्ञानम्',
    houseLabel: 'भावः',
    moonInYour: 'चन्द्रः भवतः',
    masa: 'मासः',
    samvatsara: 'सम्वत्सरः',
  },
  ta: {
    heading: 'இன்றைய அண்ட வானிலை',
    tithi: 'திதி',
    nakshatra: 'நட்சத்திரம்',
    yoga: 'யோகம்',
    vara: 'வாரம்',
    hora: 'தற்போதைய ஹோரை',
    rahuKaal: 'ராகு காலம்',
    moonTransit: 'சந்திர பெயர்ச்சி',
    shukla: 'சுக்ல',
    krishna: 'கிருஷ்ண',
    fastDay: 'விரத நாள்',
    auspicious: 'சுபம்',
    inauspicious: 'அசுபம்',
    neutral: 'சாதாரணம்',
    rulingPlanet: 'அதிபதி கிரகம்',
    rahuActive: 'ராகு காலம் இப்போது செயலில்!',
    rahuUpcoming: 'ராகு காலம்',
    bestHora: 'தற்போதைய நல்ல ஹோரை',
    wisdom: 'ஞானம், கல்வி',
    wealth: 'செல்வம், நிதி',
    energy: 'ஆற்றல், செயல்',
    communication: 'அறிவு, வணிகம்',
    beauty: 'காதல், ஆடம்பரம்',
    discipline: 'பொறுமை, கர்மா',
    emotions: 'மனம், உள்ளுணர்வு',
    houseLabel: 'பாவம்',
    moonInYour: 'சந்திரன் உங்கள்',
    masa: 'மாதம்',
    samvatsara: 'சம்வத்சரம்',
  },
  te: {
    heading: 'నేటి విశ్వ వాతావరణం',
    tithi: 'తిథి',
    nakshatra: 'నక్షత్రం',
    yoga: 'యోగం',
    vara: 'వారం',
    hora: 'ప్రస్తుత హోర',
    rahuKaal: 'రాహు కాలం',
    moonTransit: 'చంద్ర గోచారం',
    shukla: 'శుక్ల',
    krishna: 'కృష్ణ',
    fastDay: 'వ్రత దినం',
    auspicious: 'శుభం',
    inauspicious: 'అశుభం',
    neutral: 'సాధారణం',
    rulingPlanet: 'అధిపతి గ్రహం',
    rahuActive: 'రాహు కాలం ఇప్పుడు సక్రియం!',
    rahuUpcoming: 'రాహు కాలం',
    bestHora: 'ప్రస్తుత మంచి హోర',
    wisdom: 'జ్ఞానం, విద్య',
    wealth: 'సంపద, ఆర్థికం',
    energy: 'శక్తి, చర్య',
    communication: 'బుద్ధి, వ్యాపారం',
    beauty: 'ప్రేమ, విలాసం',
    discipline: 'ఓర్పు, కర్మ',
    emotions: 'మనస్సు, అంతర్దృష్టి',
    houseLabel: 'భావం',
    moonInYour: 'చంద్రుడు మీ',
    masa: 'మాసం',
    samvatsara: 'సంవత్సరం',
  },
  bn: {
    heading: 'আজকের মহাজাগতিক আবহাওয়া',
    tithi: 'তিথি',
    nakshatra: 'নক্ষত্র',
    yoga: 'যোগ',
    vara: 'বার',
    hora: 'বর্তমান হোরা',
    rahuKaal: 'রাহু কাল',
    moonTransit: 'চন্দ্র গোচর',
    shukla: 'শুক্ল',
    krishna: 'কৃষ্ণ',
    fastDay: 'ব্রত দিবস',
    auspicious: 'শুভ',
    inauspicious: 'অশুভ',
    neutral: 'সাধারণ',
    rulingPlanet: 'অধিপতি গ্রহ',
    rahuActive: 'রাহু কাল এখন সক্রিয়!',
    rahuUpcoming: 'রাহু কাল',
    bestHora: 'বর্তমান শুভ হোরা',
    wisdom: 'জ্ঞান, শিক্ষা',
    wealth: 'সম্পদ, অর্থ',
    energy: 'শক্তি, ক্রিয়া',
    communication: 'বুদ্ধি, ব্যবসা',
    beauty: 'প্রেম, বিলাসিতা',
    discipline: 'ধৈর্য, কর্ম',
    emotions: 'মন, অন্তর্জ্ঞান',
    houseLabel: 'ভাব',
    moonInYour: 'চন্দ্র আপনার',
    masa: 'মাস',
    samvatsara: 'সংবৎসর',
  },
  kn: {
    heading: 'ಇಂದಿನ ವಿಶ್ವ ಹವಾಮಾನ',
    tithi: 'ತಿಥಿ',
    nakshatra: 'ನಕ್ಷತ್ರ',
    yoga: 'ಯೋಗ',
    vara: 'ವಾರ',
    hora: 'ಪ್ರಸ್ತುತ ಹೋರಾ',
    rahuKaal: 'ರಾಹು ಕಾಲ',
    moonTransit: 'ಚಂದ್ರ ಗೋಚಾರ',
    shukla: 'ಶುಕ್ಲ',
    krishna: 'ಕೃಷ್ಣ',
    fastDay: 'ವ್ರತ ದಿನ',
    auspicious: 'ಶುಭ',
    inauspicious: 'ಅಶುಭ',
    neutral: 'ಸಾಮಾನ್ಯ',
    rulingPlanet: 'ಅಧಿಪತಿ ಗ್ರಹ',
    rahuActive: 'ರಾಹು ಕಾಲ ಈಗ ಸಕ್ರಿಯ!',
    rahuUpcoming: 'ರಾಹು ಕಾಲ',
    bestHora: 'ಪ್ರಸ್ತುತ ಶುಭ ಹೋರಾ',
    wisdom: 'ಜ್ಞಾನ, ಶಿಕ್ಷಣ',
    wealth: 'ಸಂಪತ್ತು, ಹಣಕಾಸು',
    energy: 'ಶಕ್ತಿ, ಕ್ರಿಯೆ',
    communication: 'ಬುದ್ಧಿ, ವ್ಯಾಪಾರ',
    beauty: 'ಪ್ರೀತಿ, ಐಷಾರಾಮ',
    discipline: 'ತಾಳ್ಮೆ, ಕರ್ಮ',
    emotions: 'ಮನಸ್ಸು, ಅಂತರ್ಜ್ಞಾನ',
    houseLabel: 'ಭಾವ',
    moonInYour: 'ಚಂದ್ರ ನಿಮ್ಮ',
    masa: 'ಮಾಸ',
    samvatsara: 'ಸಂವತ್ಸರ',
  },
  mr: {
    heading: 'आजचे ब्रह्मांडीय हवामान',
    tithi: 'तिथी',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    vara: 'वार',
    hora: 'सध्याची होरा',
    rahuKaal: 'राहू काळ',
    moonTransit: 'चंद्र गोचर',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    fastDay: 'व्रत दिवस',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    rulingPlanet: 'स्वामी ग्रह',
    rahuActive: 'राहू काळ आता सक्रिय!',
    rahuUpcoming: 'राहू काळ',
    bestHora: 'सध्याची शुभ होरा',
    wisdom: 'ज्ञान, शिक्षण',
    wealth: 'संपत्ती, अर्थ',
    energy: 'शक्ती, क्रिया',
    communication: 'बुद्धी, व्यापार',
    beauty: 'प्रेम, ऐश्वर्य',
    discipline: 'धैर्य, कर्म',
    emotions: 'मन, अंतर्ज्ञान',
    houseLabel: 'भाव',
    moonInYour: 'चंद्र आपल्या',
    masa: 'मास',
    samvatsara: 'संवत्सर',
  },
  gu: {
    heading: 'આજનું બ્રહ્માંડીય હવામાન',
    tithi: 'તિથિ',
    nakshatra: 'નક્ષત્ર',
    yoga: 'યોગ',
    vara: 'વાર',
    hora: 'વર્તમાન હોરા',
    rahuKaal: 'રાહુ કાળ',
    moonTransit: 'ચંદ્ર ગોચર',
    shukla: 'શુક્લ',
    krishna: 'કૃષ્ણ',
    fastDay: 'વ્રત દિવસ',
    auspicious: 'શુભ',
    inauspicious: 'અશુભ',
    neutral: 'સામાન્ય',
    rulingPlanet: 'સ્વામી ગ્રહ',
    rahuActive: 'રાહુ કાળ હવે સક્રિય!',
    rahuUpcoming: 'રાહુ કાળ',
    bestHora: 'વર્તમાન શુભ હોરા',
    wisdom: 'જ્ઞાન, શિક્ષણ',
    wealth: 'સંપત્તિ, નાણાં',
    energy: 'શક્તિ, ક્રિયા',
    communication: 'બુદ્ધિ, વ્યાપાર',
    beauty: 'પ્રેમ, વૈભવ',
    discipline: 'ધીરજ, કર્મ',
    emotions: 'મન, અંતર્જ્ઞાન',
    houseLabel: 'ભાવ',
    moonInYour: 'ચંદ્ર તમારા',
    masa: 'માસ',
    samvatsara: 'સંવત્સર',
  },
  mai: {
    heading: 'आइक ब्रह्मांडीय मौसम',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    vara: 'वार',
    hora: 'वर्तमान होरा',
    rahuKaal: 'राहु काल',
    moonTransit: 'चंद्र गोचर',
    shukla: 'शुक्ल',
    krishna: 'कृष्ण',
    fastDay: 'व्रत दिवस',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    rulingPlanet: 'स्वामी ग्रह',
    rahuActive: 'राहु काल अखन सक्रिय!',
    rahuUpcoming: 'राहु काल',
    bestHora: 'वर्तमान शुभ होरा',
    wisdom: 'ज्ञान, शिक्षा',
    wealth: 'धन, वित्त',
    energy: 'शक्ति, क्रिया',
    communication: 'बुद्धि, व्यापार',
    beauty: 'प्रेम, विलास',
    discipline: 'धैर्य, कर्म',
    emotions: 'मन, अंतर्ज्ञान',
    houseLabel: 'भाव',
    moonInYour: 'चंद्र अहाँक',
    masa: 'मास',
    samvatsara: 'संवत्सर',
  },
};

// ---------------------------------------------------------------------------
// Hora domain descriptions keyed by planet english name (lowercase)
// ---------------------------------------------------------------------------
const HORA_DOMAINS: Record<string, LocaleText> = {
  jupiter: { en: 'wisdom, education', hi: 'ज्ञान, शिक्षा', sa: 'ज्ञानम्, शिक्षा' },
  venus: { en: 'love, luxury, arts', hi: 'प्रेम, विलास, कला', sa: 'प्रेम, विलासः, कला' },
  mercury: { en: 'intellect, trade', hi: 'बुद्धि, व्यापार', sa: 'बुद्धिः, वाणिज्यम्' },
  sun: { en: 'authority, vitality', hi: 'अधिकार, ऊर्जा', sa: 'अधिकारः, ऊर्जा' },
  moon: { en: 'mind, intuition', hi: 'मन, अन्तर्ज्ञान', sa: 'मनः, अन्तर्ज्ञानम्' },
  mars: { en: 'energy, action', hi: 'शक्ति, क्रिया', sa: 'शक्तिः, क्रिया' },
  saturn: { en: 'patience, discipline', hi: 'धैर्य, अनुशासन', sa: 'धैर्यम्, अनुशासनम्' },
};

// Ekadashi tithi numbers (both shukla and krishna)
const EKADASHI_TITHIS = [11, 26]; // 11 = Shukla Ekadashi, 26 = Krishna Ekadashi
const FAST_TITHIS = [11, 26, 4, 19, 8, 23, 14, 29, 30]; // Ekadashi, Chaturthi, Ashtami, Chaturdashi, Amavasya, Purnima

// ---------------------------------------------------------------------------
// Helper: is time "HH:MM" within a range
// ---------------------------------------------------------------------------
function isTimeInRange(nowHHMM: string, start: string, end: string): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const n = toMin(nowHHMM);
  const s = toMin(start);
  const e = toMin(end);
  return n >= s && n < e;
}

function getCurrentHora(horas: HoraSlot[] | undefined, nowHHMM: string): HoraSlot | null {
  if (!horas || horas.length === 0) return null;
  return horas.find(h => isTimeInRange(nowHHMM, h.startTime, h.endTime)) || null;
}

// House transit implications (1-12)
const HOUSE_IMPLICATIONS: Record<number, LocaleText> = {
  1: { en: 'focus on self, new beginnings', hi: 'आत्म-ध्यान, नई शुरुआत', sa: 'आत्मध्यानम्, नवारम्भः', mai: 'आत्म-ध्यान, नव शुरुआत', mr: 'आत्मलक्ष, नवी सुरुवात', ta: 'சுய கவனம், புதிய தொடக்கங்கள்', te: 'ఆత్మధ్యానం, కొత్త ఆరంభాలు', bn: 'আত্মনিবেদন, নতুন শুরু', kn: 'ಸ್ವಯಂ ಗಮನ, ಹೊಸ ಆರಂಭಗಳು', gu: 'સ્વ પર ધ્યાન, નવી શરૂઆત' },
  2: { en: 'finances and family matters', hi: 'धन और परिवार के मामले', sa: 'धनम् कुटुम्बविषयाश्च', mai: 'धन आ परिवारक मामला', mr: 'आर्थिक आणि कौटुंबिक बाबी', ta: 'நிதி மற்றும் குடும்ப விவகாரங்கள்', te: 'ఆర్థిక మరియు కుటుంబ విషయాలు', bn: 'আর্থিক ও পারিবারিক বিষয়', kn: 'ಹಣಕಾಸು ಮತ್ತು ಕುಟುಂಬ ವಿಷಯಗಳು', gu: 'નાણાકીય અને પારિવારિક બાબતો' },
  3: { en: 'communication and courage', hi: 'संवाद और साहस', sa: 'सम्वादः साहसं च', mai: 'संवाद आ साहस', mr: 'संवाद आणि धाडस', ta: 'தொடர்பாடல் மற்றும் தைரியம்', te: 'సంభాషణ మరియు ధైర్యం', bn: 'যোগাযোগ ও সাহস', kn: 'ಸಂವಹನ ಮತ್ತು ಧೈರ್ಯ', gu: 'સંવાદ અને સાહસ' },
  4: { en: 'home comfort and inner peace', hi: 'घरेलू सुख और मानसिक शान्ति', sa: 'गृहसुखम् आन्तरिकशान्तिश्च', mai: 'घरक सुख आ मानसिक शांति', mr: 'गृहसुख आणि मानसिक शांती', ta: 'வீட்டு வசதி மற்றும் உள் அமைதி', te: 'గృహ సౌఖ్యం మరియు అంతర్ శాంతి', bn: 'গৃহসুখ ও মানসিক শান্তি', kn: 'ಮನೆ ಆರಾಮ ಮತ್ತು ಆಂತರಿಕ ಶಾಂತಿ', gu: 'ઘરનું સુખ અને આંતરિક શાંતિ' },
  5: { en: 'creativity and romance', hi: 'रचनात्मकता और प्रेम', sa: 'सृजनशीलता प्रेम च', mai: 'रचनात्मकता आ प्रेम', mr: 'सर्जनशीलता आणि प्रेम', ta: 'படைப்பாற்றல் மற்றும் காதல்', te: 'సృజనాత్మకత మరియు ప్రేమ', bn: 'সৃজনশীলতা ও প্রেম', kn: 'ಸೃಜನಶೀಲತೆ ಮತ್ತು ಪ್ರೇಮ', gu: 'સર્જનાત્મકતા અને પ્રેમ' },
  6: { en: 'health and overcoming challenges', hi: 'स्वास्थ्य और चुनौतियों पर विजय', sa: 'आरोग्यम् आह्वानजयश्च', mai: 'स्वास्थ्य आ चुनौतीपर विजय', mr: 'आरोग्य आणि आव्हानांवर मात', ta: 'ஆரோக்கியம் மற்றும் சவால்களை வெல்லுதல்', te: 'ఆరోగ్యం మరియు సవాళ్లను అధిగమించడం', bn: 'স্বাস্থ্য ও চ্যালেঞ্জ জয়', kn: 'ಆರೋಗ್ಯ ಮತ್ತು ಸವಾಲುಗಳನ್ನು ಜಯಿಸುವುದು', gu: 'આરોગ્ય અને પડકારો પર વિજય' },
  7: { en: 'partnerships and relationships', hi: 'साझेदारी और सम्बन्ध', sa: 'साझेदारी सम्बन्धाश्च', mai: 'साझेदारी आ संबंध', mr: 'भागीदारी आणि नातेसंबंध', ta: 'கூட்டாண்மை மற்றும் உறவுகள்', te: 'భాగస్వామ్యం మరియు సంబంధాలు', bn: 'অংশীদারত্ব ও সম্পর্ক', kn: 'ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಸಂಬಂಧಗಳು', gu: 'ભાગીદારી અને સંબંધો' },
  8: { en: 'transformation and hidden matters', hi: 'परिवर्तन और गुप्त मामले', sa: 'परिवर्तनम् गुप्तविषयाश्च', mai: 'परिवर्तन आ गुप्त मामला', mr: 'परिवर्तन आणि गुप्त बाबी', ta: 'மாற்றம் மற்றும் மறைந்த விவகாரங்கள்', te: 'పరివర్తన మరియు రహస్య విషయాలు', bn: 'রূপান্তর ও গুপ্ত বিষয়', kn: 'ಪರಿವರ್ತನೆ ಮತ್ತು ಗುಪ್ತ ವಿಷಯಗಳು', gu: 'પરિવર્તન અને છુપી બાબતો' },
  9: { en: 'luck, dharma, and higher learning', hi: 'भाग्य, धर्म और उच्च शिक्षा', sa: 'भाग्यम्, धर्मः, उच्चशिक्षा च', mai: 'भाग्य, धर्म आ उच्च शिक्षा', mr: 'भाग्य, धर्म आणि उच्च शिक्षण', ta: 'அதிர்ஷ்டம், தர்மம் மற்றும் உயர் கல்வி', te: 'అదృష్టం, ధర్మం మరియు ఉన్నత విద్య', bn: 'ভাগ্য, ধর্ম ও উচ্চশিক্ষা', kn: 'ಅದೃಷ್ಟ, ಧರ್ಮ ಮತ್ತು ಉನ್ನತ ಶಿಕ್ಷಣ', gu: 'ભાગ્ય, ધર્મ અને ઉચ્ચ શિક્ષણ' },
  10: { en: 'career and public recognition', hi: 'करियर और सार्वजनिक मान्यता', sa: 'वृत्तिः सार्वजनिकमान्यता च', mai: 'करियर आ सार्वजनिक मान्यता', mr: 'करिअर आणि सार्वजनिक मान्यता', ta: 'தொழில் மற்றும் பொது அங்கீகாரம்', te: 'వృత్తి మరియు ప్రజా గుర్తింపు', bn: 'কর্মজীবন ও জনস্বীকৃতি', kn: 'ವೃತ್ತಿ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಮನ್ನಣೆ', gu: 'કારકિર્દી અને જાહેર માન્યતા' },
  11: { en: 'gains and social connections', hi: 'लाभ और सामाजिक सम्पर्क', sa: 'लाभः सामाजिकसम्पर्काश्च', mai: 'लाभ आ सामाजिक संपर्क', mr: 'लाभ आणि सामाजिक संपर्क', ta: 'ஆதாயங்கள் மற்றும் சமூக தொடர்புகள்', te: 'లాభాలు మరియు సామాజిక సంబంధాలు', bn: 'লাভ ও সামাজিক সংযোগ', kn: 'ಲಾಭ ಮತ್ತು ಸಾಮಾಜಿಕ ಸಂಪರ್ಕಗಳು', gu: 'લાભ અને સામાજિક સંપર્ક' },
  12: { en: 'rest, spirituality, and letting go', hi: 'विश्राम, अध्यात्म और त्याग', sa: 'विश्रामः, आध्यात्मिकता, त्यागश्च', mai: 'विश्राम, अध्यात्म आ त्याग', mr: 'विश्रांती, अध्यात्म आणि त्याग', ta: 'ஓய்வு, ஆன்மிகம் மற்றும் விட்டுவிடுதல்', te: 'విశ్రాంతి, ఆధ్యాత్మికత మరియు వదలివేయడం', bn: 'বিশ্রাম, আধ্যাত্মিকতা ও ত্যাগ', kn: 'ವಿಶ್ರಾಂತಿ, ಆಧ್ಯಾತ್ಮಿಕತೆ ಮತ್ತು ಬಿಟ್ಟುಕೊಡುವಿಕೆ', gu: 'આરામ, આધ್યાત્મિકતા અને ત્યાગ' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface MorningBriefingProps {
  panchangData: PanchangData;
  personalizedDay: PersonalizedDay | null;
  locale: Locale;
}

export default function MorningBriefing({ panchangData, personalizedDay, locale }: MorningBriefingProps) {
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;

  // Current time as HH:MM
  const nowHHMM = useMemo(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }, []);

  // Rahu Kaal status
  const rahuKaal = panchangData.rahuKaal;
  const rahuActive = rahuKaal ? isTimeInRange(nowHHMM, rahuKaal.start, rahuKaal.end) : false;

  // Current Hora
  const currentHora = getCurrentHora(panchangData.hora, nowHHMM);
  const horaDomain = currentHora
    ? HORA_DOMAINS[currentHora.planet.en.toLowerCase()] || null
    : null;

  // Fast day check
  const isFastDay = FAST_TITHIS.includes(panchangData.tithi.number);
  const isEkadashi = EKADASHI_TITHIS.includes(panchangData.tithi.number);

  // Moon transit house (from personalized data)
  const moonHouse = personalizedDay?.chandraBala?.houseFromMoon || null;
  const moonImplication = moonHouse ? (HOUSE_IMPLICATIONS[moonHouse] || null) : null;

  // Paksha label
  const pakshaLabel = panchangData.tithi.paksha === 'shukla' ? L.shukla : L.krishna;

  // Yoga nature label
  const yogaNatureLabel = panchangData.yoga.nature === 'auspicious'
    ? L.auspicious
    : panchangData.yoga.nature === 'inauspicious'
      ? L.inauspicious
      : L.neutral;

  // Gregorian date display
  const gregDate = panchangData.date; // "YYYY-MM-DD"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.5 }}
      className="mb-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0f0d2e]/80 backdrop-blur-sm overflow-hidden"
    >
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-purple-500/15 via-purple-400/10 to-gold-primary/10 border-b border-purple-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.heading}
          </h3>
        </div>
        <span className="text-xs text-text-secondary/70 font-mono">{gregDate}</span>
      </div>

      {/* Hindu calendar line */}
      {(panchangData.masa || panchangData.samvatsara) && (
        <div className="px-5 py-2 bg-gold-primary/[0.04] border-b border-purple-500/10 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary/80">
          {panchangData.samvatsara && (
            <span>
              <span className="text-gold-primary/70 font-semibold">{L.samvatsara}:</span>{' '}
              {panchangData.samvatsara[locale] || panchangData.samvatsara.en}
            </span>
          )}
          {panchangData.masa && (
            <span>
              <span className="text-gold-primary/70 font-semibold">{L.masa}:</span>{' '}
              {panchangData.masa[locale] || panchangData.masa.en}
            </span>
          )}
          {panchangData.vikramSamvat && (
            <span>
              <span className="text-gold-primary/70 font-semibold">VS:</span> {panchangData.vikramSamvat}
            </span>
          )}
        </div>
      )}

      {/* Main grid */}
      <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Tithi */}
        <BriefingCell
          label={L.tithi}
          icon={<Moon className="w-4 h-4" />}
          value={panchangData.tithi.name[locale] || panchangData.tithi.name.en}
          sub={
            <>
              {pakshaLabel}
              {(isEkadashi || isFastDay) && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400">
                  {L.fastDay}
                </span>
              )}
            </>
          }
        />

        {/* 2. Nakshatra */}
        <BriefingCell
          label={L.nakshatra}
          icon={<Sparkles className="w-4 h-4" />}
          value={panchangData.nakshatra.name[locale] || panchangData.nakshatra.name.en}
          sub={`${L.rulingPlanet}: ${panchangData.nakshatra.rulerName[locale] || panchangData.nakshatra.rulerName.en}`}
        />

        {/* 3. Yoga */}
        <BriefingCell
          label={L.yoga}
          icon={<Orbit className="w-4 h-4" />}
          value={panchangData.yoga.name[locale] || panchangData.yoga.name.en}
          sub={
            <span className={
              panchangData.yoga.nature === 'auspicious'
                ? 'text-emerald-400'
                : panchangData.yoga.nature === 'inauspicious'
                  ? 'text-red-400'
                  : 'text-text-secondary'
            }>
              {yogaNatureLabel}
            </span>
          }
        />

        {/* 4. Vara */}
        <BriefingCell
          label={L.vara}
          icon={<Sun className="w-4 h-4" />}
          value={panchangData.vara.name[locale] || panchangData.vara.name.en}
          sub={`${L.rulingPlanet}: ${panchangData.vara.ruler[locale] || panchangData.vara.ruler.en}`}
        />

        {/* 5. Hora suggestion */}
        {currentHora && (
          <BriefingCell
            label={L.hora}
            icon={<Clock className="w-4 h-4" />}
            value={currentHora.planet[locale] || currentHora.planet.en}
            sub={
              horaDomain
                ? (horaDomain as Record<string, string>)[locale] || horaDomain.en
                : `${currentHora.startTime} - ${currentHora.endTime}`
            }
            highlight={currentHora.nature === 'auspicious'}
          />
        )}

        {/* 6. Rahu Kaal */}
        {rahuKaal && (
          <BriefingCell
            label={L.rahuKaal}
            icon={<AlertTriangle className="w-4 h-4" />}
            value={`${rahuKaal.start} - ${rahuKaal.end}`}
            sub={rahuActive ? L.rahuActive : L.rahuUpcoming}
            warning={rahuActive}
          />
        )}

        {/* 7. Moon transit (personal) */}
        {moonHouse && moonImplication && (
          <BriefingCell
            label={L.moonTransit}
            icon={<Moon className="w-4 h-4" />}
            value={`${moonHouse}${!isDevanagariLocale(locale) ? ordinalSuffix(moonHouse) : ''} ${L.houseLabel}`}
            sub={(moonImplication as Record<string, string>)[locale] || moonImplication.en}
            className="col-span-2 lg:col-span-1"
            personal
          />
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: individual cell
// ---------------------------------------------------------------------------
interface BriefingCellProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  sub: React.ReactNode;
  highlight?: boolean;
  warning?: boolean;
  personal?: boolean;
  className?: string;
}

function BriefingCell({ label, icon, value, sub, highlight, warning, personal, className }: BriefingCellProps) {
  const borderClass = warning
    ? 'border-amber-500/30 bg-amber-500/[0.06]'
    : highlight
      ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
      : personal
        ? 'border-purple-400/20 bg-purple-500/[0.04]'
        : 'border-white/[0.06] bg-white/[0.02]';

  const iconColor = warning
    ? 'text-amber-400'
    : highlight
      ? 'text-emerald-400'
      : personal
        ? 'text-purple-400'
        : 'text-gold-primary/70';

  return (
    <div className={`rounded-xl border p-3.5 ${borderClass} ${className || ''}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={iconColor}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary/60">
          {label}
        </span>
      </div>
      <p className="text-base font-semibold text-text-primary leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
        {value}
      </p>
      <p className="text-xs text-text-secondary mt-1 leading-snug">
        {sub}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ordinal suffix for English house numbers
// ---------------------------------------------------------------------------
function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

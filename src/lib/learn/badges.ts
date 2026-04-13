/**
 * Learning Badges & Levels system for the Jyotish curriculum.
 * No React dependencies — safe to import in stores and server utilities.
 */

import type { ModuleProgress, StreakData } from '@/stores/learning-progress-store';
import { MODULE_SEQUENCE, getPhaseModules, PHASE_INFO } from './module-sequence';

// ── Levels ──────────────────────────────────────────────────────────────────

export type JyotishLevel = 'beginner' | 'student' | 'practitioner' | 'vidwan' | 'pandit';

interface LevelDef {
  level: JyotishLevel;
  label: Record<string, string>;
  minModules: number;
  description: Record<string, string>;
}

const LEVEL_DEFS: LevelDef[] = [
  {
    level: 'beginner',
    label: { en: 'Beginner', hi: 'शिष्य', sa: 'शिष्य', mai: 'शिष्य', mr: 'शिष्य', ta: 'தொடக்கநிலை', te: 'ప్రారంభకుడు', bn: 'শিক্ষানবিশ', kn: 'ಆರಂಭಿಕ', gu: 'શરૂઆતકર્તા' },
    minModules: 0,
    description: {
      en: "You're just starting — every journey begins with a single step",
      hi: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      sa: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      mai: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      mr: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      ta: 'நீங்கள் இப்போதுதான் தொடங்குகிறீர்கள் — ஒவ்வொரு பயணமும் ஒரு அடியில் தொடங்குகிறது',
      te: 'మీరు ఇప్పుడే మొదలుపెడుతున్నారు — ప్రతి ప్రయాణం ఒక్క అడుగుతో మొదలవుతుంది',
      bn: 'আপনি এইমাত্র শুরু করছেন — প্রতিটি যাত্রা একটি পদক্ষেপ দিয়ে শুরু হয়',
      kn: 'ನೀವು ಈಗಷ್ಟೇ ಪ್ರಾರಂಭಿಸುತ್ತಿದ್ದೀರಿ — ಪ್ರತಿ ಪ್ರಯಾಣವೂ ಒಂದು ಹೆಜ್ಜೆಯಿಂದ ಆರಂಭವಾಗುತ್ತದೆ',
      gu: 'તમે હમણાં જ શરૂ કરી રહ્યા છો — દરેક યાત્રા એક પગલાથી શરૂ થાય છે',
    },
  },
  {
    level: 'student',
    label: { en: 'Student', hi: 'छात्र', sa: 'छात्र', mai: 'छात्र', mr: 'छात्र', ta: 'மாணவர்', te: 'విద్యార్థి', bn: 'ছাত্র', kn: 'ವಿದ್ಯಾರ್ಥಿ', gu: 'વિદ્યાર્થી' },
    minModules: 11,
    description: {
      en: "You're building a solid foundation",
      hi: 'आप एक मजबूत नींव बना रहे हैं',
      sa: 'आप एक मजबूत नींव बना रहे हैं',
      mai: 'आप एक मजबूत नींव बना रहे हैं',
      mr: 'आप एक मजबूत नींव बना रहे हैं',
      ta: 'நீங்கள் ஒரு உறுதியான அடித்தளத்தை உருவாக்குகிறீர்கள்',
      te: 'మీరు పటిష్టమైన పునాది నిర్మిస్తున్నారు',
      bn: 'আপনি একটি মজবুত ভিত্তি তৈরি করছেন',
      kn: 'ನೀವು ಗಟ್ಟಿಯಾದ ಅಡಿಪಾಯವನ್ನು ನಿರ್ಮಿಸುತ್ತಿದ್ದೀರಿ',
      gu: 'તમે એક મજબૂત પાયો બનાવી રહ્યા છો',
    },
  },
  {
    level: 'practitioner',
    label: { en: 'Practitioner', hi: 'साधक', sa: 'साधक', mai: 'साधक', mr: 'साधक', ta: 'பயிற்சியாளர்', te: 'సాధకుడు', bn: 'সাধক', kn: 'ಸಾಧಕ', gu: 'સાધક' },
    minModules: 31,
    description: {
      en: 'You can read a basic chart and understand daily panchang',
      hi: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      sa: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      mai: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      mr: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      ta: 'நீங்கள் அடிப்படை ஜாதகத்தைப் படிக்கவும் தினசரி பஞ்சாங்கத்தைப் புரிந்துகொள்ளவும் முடியும்',
      te: 'మీరు ప్రాథమిక జాతకాన్ని చదవగలరు మరియు దైనిక పంచాంగాన్ని అర్థం చేసుకోగలరు',
      bn: 'আপনি একটি মৌলিক জাতক পড়তে এবং দৈনিক পঞ্চাঙ্গ বুঝতে পারেন',
      kn: 'ನೀವು ಮೂಲ ಜಾತಕವನ್ನು ಓದಬಹುದು ಮತ್ತು ದೈನಿಕ ಪಂಚಾಂಗವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಹುದು',
      gu: 'તમે મૂળભૂત જાતક વાંચી શકો છો અને દૈનિક પંચાંગ સમજી શકો છો',
    },
  },
  {
    level: 'vidwan',
    label: { en: 'Vidwan', hi: 'विद्वान', sa: 'विद्वान', mai: 'विद्वान', mr: 'विद्वान', ta: 'வித்வான்', te: 'విద్వాంసుడు', bn: 'বিদ্বান', kn: 'ವಿದ್ವಾನ್', gu: 'વિદ્વાન' },
    minModules: 61,
    description: {
      en: 'Advanced understanding — you can analyze dashas and transits',
      hi: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      sa: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      mai: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      mr: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      ta: 'உயர்நிலை புரிதல் — நீங்கள் தசை மற்றும் கோசாரத்தை பகுப்பாய்வு செய்யலாம்',
      te: 'ఉన్నత అవగాహన — మీరు దశలు మరియు గోచారాలను విశ్లేషించగలరు',
      bn: 'উন্নত বোধগম্যতা — আপনি দশা ও গোচর বিশ্লেষণ করতে পারেন',
      kn: 'ಉನ್ನತ ತಿಳುವಳಿಕೆ — ನೀವು ದಶೆ ಮತ್ತು ಗೋಚಾರವನ್ನು ವಿಶ್ಲೇಷಿಸಬಹುದು',
      gu: 'ઉન્નત સમજ — તમે દશા અને ગોચરનું વિશ્લેષણ કરી શકો છો',
    },
  },
  {
    level: 'pandit',
    label: { en: 'Pandit', hi: 'पण्डित', sa: 'पण्डित', mai: 'पण्डित', mr: 'पण्डित', ta: 'பண்டிதர்', te: 'పండితుడు', bn: 'পণ্ডিত', kn: 'ಪಂಡಿತ', gu: 'પંડિત' },
    minModules: 91,
    description: {
      en: 'Master level — you understand the full depth of Jyotish',
      hi: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      sa: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      mai: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      mr: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      ta: 'மாஸ்டர் நிலை — நீங்கள் ஜோதிடத்தின் முழு ஆழத்தையும் புரிந்துகொள்கிறீர்கள்',
      te: 'మాస్టర్ స్థాయి — మీరు జ్యోతిష్యం యొక్క పూర్తి లోతును అర్థం చేసుకుంటారు',
      bn: 'মাস্টার স্তর — আপনি জ্যোতিষের পূর্ণ গভীরতা বোঝেন',
      kn: 'ಮಾಸ್ಟರ್ ಮಟ್ಟ — ನೀವು ಜ್ಯೋತಿಷ್ಯದ ಪೂರ್ಣ ಆಳವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೀರಿ',
      gu: 'માસ્ટર સ્તર — તમે જ્યોતિષની સંપૂર્ણ ઊંડાઈ સમજો છો',
    },
  },
];

export function getLevel(masteredCount: number): {
  level: JyotishLevel;
  label: Record<string, string>;
  description: Record<string, string>;
  minModules: number;
  nextLevel: { label: Record<string, string>; modulesNeeded: number } | null;
} {
  let currentIdx = 0;
  for (let i = LEVEL_DEFS.length - 1; i >= 0; i--) {
    if (masteredCount >= LEVEL_DEFS[i].minModules) {
      currentIdx = i;
      break;
    }
  }

  const current = LEVEL_DEFS[currentIdx];
  const next = currentIdx < LEVEL_DEFS.length - 1 ? LEVEL_DEFS[currentIdx + 1] : null;

  return {
    level: current.level,
    label: current.label,
    description: current.description,
    minModules: current.minModules,
    nextLevel: next
      ? { label: next.label, modulesNeeded: next.minModules - masteredCount }
      : null,
  };
}

// ── Badges ──────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  icon: string;
  label: Record<string, string>;
  description: Record<string, string>;
  condition: (progress: Record<string, ModuleProgress>, streak: StreakData) => boolean;
}

/** Check if ALL modules in a specific phase are mastered */
function isPhaseComplete(progress: Record<string, ModuleProgress>, phase: number): boolean {
  const modules = getPhaseModules(phase);
  return modules.length > 0 && modules.every(m => progress[m.id]?.status === 'mastered');
}

/** Count mastered modules */
function countMastered(progress: Record<string, ModuleProgress>): number {
  return MODULE_SEQUENCE.filter(m => progress[m.id]?.status === 'mastered').length;
}

/** Check if any module has a perfect quiz score of 5 */
function hasPerfectQuiz(progress: Record<string, ModuleProgress>): boolean {
  return Object.values(progress).some(p => p.quizScore !== null && p.quizScore >= 5);
}

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    icon: '\u{1F31F}', // star
    label: { en: 'First Step', hi: 'पहला कदम', sa: 'पहला कदम', mai: 'पहला कदम', mr: 'पहला कदम', ta: 'முதல் அடி', te: 'మొదటి అడుగు', bn: 'প্রথম পদক্ষেপ', kn: 'ಮೊದಲ ಹೆಜ್ಜೆ', gu: 'પહેલું પગલું' },
    description: { en: 'Complete 1 module', hi: '1 मॉड्यूल पूर्ण करें', sa: '1 मॉड्यूल पूर्ण करें', mai: '1 मॉड्यूल पूर्ण करें', mr: '1 मॉड्यूल पूर्ण करें', ta: '1 தொகுதியை நிறைவு செய்யுங்கள்', te: '1 మాడ్యూల్ పూర్తి చేయండి', bn: '1টি মডিউল সম্পূর্ণ করুন', kn: '1 ಮಾಡ್ಯೂಲ್ ಪೂರ್ಣಗೊಳಿಸಿ', gu: '1 મોડ્યુલ પૂર્ણ કરો' },
    condition: (progress) => countMastered(progress) >= 1,
  },
  {
    id: 'phase-0-complete',
    icon: '\u{1F4DA}', // books
    label: { en: 'Phase 0 Complete', hi: 'चरण 0 पूर्ण', sa: 'चरण 0 पूर्ण', mai: 'चरण 0 पूर्ण', mr: 'चरण 0 पूर्ण', ta: 'கட்டம் 0 நிறைவு', te: 'దశ 0 పూర్తి', bn: 'পর্যায় 0 সম্পূর্ণ', kn: 'ಹಂತ 0 ಪೂರ್ಣ', gu: 'તબક્કો 0 પૂર્ણ' },
    description: { en: 'All Pre-Foundation modules mastered', hi: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', sa: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', mai: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', mr: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', ta: 'அனைத்து முன்-அடித்தள தொகுதிகளும் தேர்ச்சி பெற்றன', te: 'అన్ని ప్రాథమిక-పూర్వ మాడ్యూళ్లు నేర్చుకోబడ్డాయి', bn: 'সকল প্রাক-ভিত্তি মডিউল আয়ত্ত করা হয়েছে', kn: 'ಎಲ್ಲಾ ಪೂರ್ವ-ಅಡಿಪಾಯ ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಲಾಗಿದೆ', gu: 'બધા પૂર્વ-પાયાના મોડ્યુલ પૂર્ણ' },
    condition: (progress) => isPhaseComplete(progress, 0),
  },
  {
    id: 'week-warrior',
    icon: '\u{1F525}', // fire
    label: { en: 'Week Warrior', hi: 'सप्ताह योद्धा', sa: 'सप्ताह योद्धा', mai: 'सप्ताह योद्धा', mr: 'सप्ताह योद्धा', ta: 'வாரப் போர்வீரர்', te: 'వారం యోధుడు', bn: 'সপ্তাহের যোদ্ধা', kn: 'ವಾರದ ಯೋಧ', gu: 'સપ્તાહનો યોદ્ધા' },
    description: { en: '7-day learning streak', hi: '7 दिन की शिक्षा लय', sa: '7 दिन की शिक्षा लय', mai: '7 दिन की शिक्षा लय', mr: '7 दिन की शिक्षा लय', ta: '7 நாள் கற்றல் தொடர்', te: '7 రోజుల అధ్యయన సిరీస్', bn: '7 দিনের শিক্ষা ধারা', kn: '7 ದಿನದ ಕಲಿಕೆ ಸರಣಿ', gu: '7 દિવસની શીખવાની શ્રેણી' },
    condition: (_, streak) => streak.streakDays >= 7 || streak.longestStreak >= 7,
  },
  {
    id: 'fortnight-fire',
    icon: '\u{1F525}\u{1F525}', // fire fire
    label: { en: 'Fortnight Fire', hi: 'पखवाड़ा अग्नि', sa: 'पखवाड़ा अग्नि', mai: 'पखवाड़ा अग्नि', mr: 'पखवाड़ा अग्नि', ta: 'பக்ஷ அக்னி', te: 'పక్షం అగ్ని', bn: 'পক্ষের আগুন', kn: 'ಪಕ್ಷದ ಅಗ್ನಿ', gu: 'પખવાડાની અગ્નિ' },
    description: { en: '14-day learning streak', hi: '14 दिन की शिक्षा लय', sa: '14 दिन की शिक्षा लय', mai: '14 दिन की शिक्षा लय', mr: '14 दिन की शिक्षा लय', ta: '14 நாள் கற்றல் தொடர்', te: '14 రోజుల అధ్యయన సిరీస్', bn: '14 দিনের শিক্ষা ধারা', kn: '14 ದಿನದ ಕಲಿಕೆ ಸರಣಿ', gu: '14 દિવસની શીખવાની શ્રેણી' },
    condition: (_, streak) => streak.streakDays >= 14 || streak.longestStreak >= 14,
  },
  {
    id: 'quiz-master',
    icon: '\u{26A1}', // lightning
    label: { en: 'Quiz Master', hi: 'परीक्षा गुरु', sa: 'परीक्षा गुरु', mai: 'परीक्षा गुरु', mr: 'परीक्षा गुरु', ta: 'வினாடி வினா நிபுணர்', te: 'క్విజ్ మాస్టర్', bn: 'কুইজ মাস্টার', kn: 'ಕ್ವಿಜ್ ಮಾಸ್ಟರ್', gu: 'ક્વિઝ માસ્ટર' },
    description: { en: 'Score 5/5 on any quiz', hi: 'किसी भी परीक्षा में 5/5 स्कोर करें', sa: 'किसी भी परीक्षा में 5/5 स्कोर करें', mai: 'किसी भी परीक्षा में 5/5 स्कोर करें', mr: 'किसी भी परीक्षा में 5/5 स्कोर करें', ta: 'ஏதேனும் ஒரு வினாடி வினாவில் 5/5 பெறுங்கள்', te: 'ఏదైనా క్విజ్‌లో 5/5 స్కోర్ చేయండి', bn: 'যেকোনো কুইজে 5/5 স্কোর করুন', kn: 'ಯಾವುದೇ ಕ್ವಿಜ್‌ನಲ್ಲಿ 5/5 ಸ್ಕೋರ್ ಮಾಡಿ', gu: 'કોઈપણ ક્વિઝમાં 5/5 સ્કોર કરો' },
    condition: (progress) => hasPerfectQuiz(progress),
  },
  {
    id: 'math-explorer',
    icon: '\u{1F9EE}', // abacus
    label: { en: 'Math Explorer', hi: 'गणित अन्वेषक', sa: 'गणित अन्वेषक', mai: 'गणित अन्वेषक', mr: 'गणित अन्वेषक', ta: 'கணித ஆய்வாளர்', te: 'గణిత అన్వేషకుడు', bn: 'গণিত অন্বেষক', kn: 'ಗಣಿತ ಅನ್ವೇಷಕ', gu: 'ગણિત સંશોધક' },
    description: { en: 'Complete any India contributions module', hi: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', sa: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', mai: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', mr: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', ta: 'இந்தியாவின் பங்களிப்பு தொகுதிகளில் ஏதேனும் ஒன்றை நிறைவு செய்யுங்கள்', te: 'భారతదేశ సహకారం మాడ్యూళ్లలో ఏదైనా పూర్తి చేయండి', bn: 'ভারতের অবদান মডিউলগুলির যেকোনো একটি সম্পূর্ণ করুন', kn: 'ಭಾರತದ ಕೊಡುಗೆ ಮಾಡ್ಯೂಲ್‌ಗಳಲ್ಲಿ ಯಾವುದನ್ನಾದರೂ ಪೂರ್ಣಗೊಳಿಸಿ', gu: 'ભારતના યોગદાન મોડ્યુલમાંથી કોઈપણ પૂર્ણ કરો' },
    condition: (progress) =>
      MODULE_SEQUENCE
        .filter(m => m.id.startsWith('25-') || m.id.startsWith('26-'))
        .some(m => progress[m.id]?.status === 'mastered'),
  },
  {
    id: 'eclipse-scholar',
    icon: '\u{1F319}', // crescent moon
    label: { en: 'Eclipse Scholar', hi: 'ग्रहण विद्वान', sa: 'ग्रहण विद्वान', mai: 'ग्रहण विद्वान', mr: 'ग्रहण विद्वान', ta: 'கிரகண அறிஞர்', te: 'గ్రహణ పండితుడు', bn: 'গ্রহণ পণ্ডিত', kn: 'ಗ್ರಹಣ ವಿದ್ವಾಂಸ', gu: 'ગ્રહણ વિદ્વાન' },
    description: { en: 'Complete the Eclipses module (13-4)', hi: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', sa: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', mai: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', mr: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', ta: 'கிரகணம் தொகுதியை (13-4) நிறைவு செய்யுங்கள்', te: 'గ్రహణాల మాడ్యూల్ (13-4) పూర్తి చేయండి', bn: 'গ্রহণ মডিউল (13-4) সম্পূর্ণ করুন', kn: 'ಗ್ರಹಣ ಮಾಡ್ಯೂಲ್ (13-4) ಪೂರ್ಣಗೊಳಿಸಿ', gu: 'ગ્રહણ મોડ્યુલ (13-4) પૂર્ણ કરો' },
    condition: (progress) => progress['13-4']?.status === 'mastered',
  },
  {
    id: 'hora-expert',
    icon: '\u{2600}\u{FE0F}', // sun
    label: { en: 'Hora Expert', hi: 'होरा विशेषज्ञ', sa: 'होरा विशेषज्ञ', mai: 'होरा विशेषज्ञ', mr: 'होरा विशेषज्ञ', ta: 'ஹோரா நிபுணர்', te: 'హోరా నిపుణుడు', bn: 'হোরা বিশেষজ্ঞ', kn: 'ಹೋರಾ ತಜ್ಞ', gu: 'હોરા નિષ્ણાત' },
    description: { en: 'Complete the Hora/Chaldean module (7-4)', hi: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', sa: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', mai: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', mr: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', ta: 'ஹோரா/கால்டியன் தொகுதியை (7-4) நிறைவு செய்யுங்கள்', te: 'హోరా/కాల్డియన్ మాడ్యూల్ (7-4) పూర్తి చేయండి', bn: 'হোরা/ক্যালডীয় মডিউল (7-4) সম্পূর্ণ করুন', kn: 'ಹೋರಾ/ಕಾಲ್ಡಿಯನ್ ಮಾಡ್ಯೂಲ್ (7-4) ಪೂರ್ಣಗೊಳಿಸಿ', gu: 'હોરા/કેલ્ડિયન મોડ્યુલ (7-4) પૂર્ણ કરો' },
    condition: (progress) => progress['7-4']?.status === 'mastered',
  },
  {
    id: 'perfect-phase',
    icon: '\u{1F3AF}', // target
    label: { en: 'Perfect Phase', hi: 'पूर्ण चरण', sa: 'पूर्ण चरण', mai: 'पूर्ण चरण', mr: 'पूर्ण चरण', ta: 'சரியான கட்டம்', te: 'పరిపూర్ణ దశ', bn: 'নিখুঁত পর্যায়', kn: 'ಪರಿಪೂರ್ಣ ಹಂತ', gu: 'સંપૂર્ણ તબક્કો' },
    description: { en: 'Master ALL modules in any single phase', hi: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', sa: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', mai: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', mr: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', ta: 'ஏதேனும் ஒரு கட்டத்தில் அனைத்து தொகுதிகளிலும் தேர்ச்சி பெறுங்கள்', te: 'ఏదైనా ఒక దశలో అన్ని మాడ్యూళ్లలో నైపుణ్యం సాధించండి', bn: 'যেকোনো একটি পর্যায়ের সমস্ত মডিউলে দক্ষতা অর্জন করুন', kn: 'ಯಾವುದೇ ಒಂದು ಹಂತದಲ್ಲಿ ಎಲ್ಲಾ ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ', gu: 'કોઈપણ એક તબક્કામાં બધા મોડ્યુલમાં નિપુણતા મેળવો' },
    condition: (progress) =>
      PHASE_INFO.some(p => isPhaseComplete(progress, p.phase)),
  },
  {
    id: 'pandit-badge',
    icon: '\u{1F451}', // crown
    label: { en: 'Pandit', hi: 'पण्डित', sa: 'पण्डित', mai: 'पण्डित', mr: 'पण्डित', ta: 'பண்டிதர்', te: 'పండితుడు', bn: 'পণ্ডিত', kn: 'ಪಂಡಿತ', gu: 'પંડિત' },
    description: { en: 'Reach Pandit level (91+ modules)', hi: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', sa: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', mai: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', mr: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', ta: 'பண்டிதர் நிலையை அடையுங்கள் (91+ தொகுதிகள்)', te: 'పండిత స్థాయికి చేరుకోండి (91+ మాడ్యూళ్లు)', bn: 'পণ্ডিত স্তরে পৌঁছান (91+ মডিউল)', kn: 'ಪಂಡಿತ ಮಟ್ಟವನ್ನು ತಲುಪಿ (91+ ಮಾಡ್ಯೂಲ್‌ಗಳು)', gu: 'પંડિત સ્તર સુધી પહોંચો (91+ મોડ્યુલ)' },
    condition: (progress) => countMastered(progress) >= 91,
  },
];

// ── Earned badge utilities ──────────────────────────────────────────────────

const BADGES_STORAGE_KEY = 'dekho-panchang-badges';

/** Read earned badge IDs from localStorage */
export function getEarnedBadgeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(BADGES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Write earned badge IDs to localStorage */
function writeEarnedBadgeIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage quota exceeded
  }
}

/**
 * Check all badges against current progress and streak.
 * Returns { earned: Badge[], newlyEarned: Badge[] }.
 * newlyEarned contains badges that were just earned for the first time
 * (not yet in localStorage). Also persists newly earned badges.
 */
export function checkBadges(
  progress: Record<string, ModuleProgress>,
  streak: StreakData,
): { earned: Badge[]; newlyEarned: Badge[] } {
  const previouslyEarned = new Set(getEarnedBadgeIds());

  const earned: Badge[] = [];
  const newlyEarned: Badge[] = [];

  for (const badge of BADGES) {
    if (badge.condition(progress, streak)) {
      earned.push(badge);
      if (!previouslyEarned.has(badge.id)) {
        newlyEarned.push(badge);
      }
    }
  }

  // Persist newly earned
  if (newlyEarned.length > 0) {
    const allIds = [...previouslyEarned, ...newlyEarned.map(b => b.id)];
    writeEarnedBadgeIds(allIds);
  }

  return { earned, newlyEarned };
}

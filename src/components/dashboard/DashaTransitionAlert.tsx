'use client';
import { tl } from '@/lib/utils/trilingual';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { DashaEntry } from '@/types/kundali';
import type { Locale,  LocaleText} from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Planet interpretations (brief, for the alert card)
// ---------------------------------------------------------------------------
const PLANET_INTERPRETATIONS: Record<string, LocaleText> = {
  sun:     { en: 'Authority, career recognition, vitality', hi: 'अधिकार, करियर में मान्यता, जीवन शक्ति', sa: 'अधिकारः, वृत्तौ मान्यता, जीवनशक्तिः', mai: 'अधिकार, करियरमे मान्यता, जीवन शक्ति', mr: 'अधिकार, करिअरमधील मान्यता, जीवनशक्ती', ta: 'அதிகாரம், தொழில் அங்கீகாரம், உயிர்ச்சக்தி', te: 'అధికారం, వృత్తి గుర్తింపు, జీవశక్తి', bn: 'কর্তৃত্ব, কর্মজীবনে স্বীকৃতি, জীবনীশক্তি', kn: 'ಅಧಿಕಾರ, ವೃತ್ತಿ ಮನ್ನಣೆ, ಜೀವಶಕ್ತಿ', gu: 'સત્તા, કારકિર્દીમાં માન્યતા, જીવનશક્તિ' },
  moon:    { en: 'Emotional peace, public image, mother\'s blessings', hi: 'मानसिक शान्ति, सार्वजनिक छवि, माता का आशीर्वाद', sa: 'मानसिकशान्तिः, सार्वजनिकप्रतिमा, मातुः आशीर्वादः', mai: 'मानसिक शांति, सार्वजनिक छवि, माताक आशीर्वाद', mr: 'मानसिक शांती, सार्वजनिक प्रतिमा, मातेचा आशीर्वाद', ta: 'உணர்ச்சி அமைதி, பொது அடையாளம், தாயின் ஆசி', te: 'మానసిక ప్రశాంతత, ప్రజా ప్రతిష్ఠ, తల్లి ఆశీర్వాదం', bn: 'মানসিক শান্তি, জনমানস, মায়ের আশীর্বাদ', kn: 'ಮಾನಸಿಕ ಶಾಂತಿ, ಸಾರ್ವಜನಿಕ ಪ್ರತಿಮೆ, ತಾಯಿಯ ಆಶೀರ್ವಾದ', gu: 'ભાવનાત્મક શાંતિ, જાહેર છબી, માતાના આશીર્વાદ' },
  mars:    { en: 'Energy, courage, property matters, competition', hi: 'ऊर्जा, साहस, सम्पत्ति, प्रतिस्पर्धा', sa: 'ऊर्जा, साहसम्, सम्पत्तिः, प्रतिस्पर्धा', mai: 'ऊर्जा, साहस, संपत्ति, प्रतिस्पर्धा', mr: 'ऊर्जा, धाडस, मालमत्ता, स्पर्धा', ta: 'ஆற்றல், தைரியம், சொத்து விவகாரங்கள், போட்டி', te: 'శక్తి, ధైర్యం, ఆస్తి వ్యవహారాలు, పోటీ', bn: 'শক্তি, সাহস, সম্পত্তি, প্রতিযোগিতা', kn: 'ಶಕ್ತಿ, ಧೈರ್ಯ, ಆಸ್ತಿ ವಿಷಯಗಳು, ಸ್ಪರ್ಧೆ', gu: 'ઊર્જા, સાહસ, સંપત્તિ, સ્પર્ધા' },
  mercury: { en: 'Communication, business, intellect, education', hi: 'संवाद, व्यापार, बुद्धि, शिक्षा', sa: 'सम्वादः, वाणिज्यम्, बुद्धिः, शिक्षा', mai: 'संवाद, व्यापार, बुद्धि, शिक्षा', mr: 'संवाद, व्यापार, बुद्धी, शिक्षण', ta: 'தொடர்பாடல், வணிகம், அறிவு, கல்வி', te: 'సంభాషణ, వ్యాపారం, బుద్ధి, విద్య', bn: 'যোগাযোগ, ব্যবসা, বুদ্ধি, শিক্ষা', kn: 'ಸಂವಹನ, ವ್ಯಾಪಾರ, ಬುದ್ಧಿ, ಶಿಕ್ಷಣ', gu: 'સંવાદ, વ્યાપાર, બુદ્ધિ, શિક્ષણ' },
  jupiter: { en: 'Wisdom, expansion, wealth, spiritual growth', hi: 'ज्ञान, विस्तार, धन, आध्यात्मिक वृद्धि', sa: 'ज्ञानम्, विस्तारः, धनम्, आध्यात्मिकवृद्धिः', mai: 'ज्ञान, विस्तार, धन, आध्यात्मिक वृद्धि', mr: 'ज्ञान, विस्तार, संपत्ती, आध्यात्मिक वाढ', ta: 'ஞானம், விரிவாக்கம், செல்வம், ஆன்மிக வளர்ச்சி', te: 'జ్ఞానం, విస్తరణ, సంపద, ఆధ్యాత్మిక వృద్ధి', bn: 'জ্ঞান, সম্প্রসারণ, সম্পদ, আধ্যাত্মিক বৃদ্ধি', kn: 'ಜ್ಞಾನ, ವಿಸ್ತರಣೆ, ಸಂಪತ್ತು, ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ', gu: 'જ્ઞાન, વિસ્તાર, સંપત્તિ, આધ્યાત્મિક વૃદ્ધિ' },
  venus:   { en: 'Love, luxury, arts, marriage, material comfort', hi: 'प्रेम, विलासिता, कला, विवाह, भौतिक सुख', sa: 'प्रेम, विलासिता, कला, विवाहः, भौतिकसुखम्', mai: 'प्रेम, विलासिता, कला, विवाह, भौतिक सुख', mr: 'प्रेम, ऐश्वर्य, कला, विवाह, भौतिक सुख', ta: 'காதல், ஆடம்பரம், கலை, திருமணம், பொருள் வசதி', te: 'ప్రేమ, విలాసం, కళలు, వివాహం, భౌతిక సుఖం', bn: 'প্রেম, বিলাসিতা, শিল্পকলা, বিবাহ, ভৌতিক সুখ', kn: 'ಪ್ರೀತಿ, ಐಷಾರಾಮ, ಕಲೆ, ವಿವಾಹ, ಭೌತಿಕ ಸುಖ', gu: 'પ્રેમ, વૈભવ, કળા, લગ્ન, ભૌતિક સુખ' },
  saturn:  { en: 'Discipline, hard work, karma, restructuring', hi: 'अनुशासन, कठोर परिश्रम, कर्म, पुनर्गठन', sa: 'अनुशासनम्, कठोरपरिश्रमः, कर्म, पुनर्गठनम्', mai: 'अनुशासन, कठोर परिश्रम, कर्म, पुनर्गठन', mr: 'शिस्त, कठोर परिश्रम, कर्म, पुनर्रचना', ta: 'ஒழுக்கம், கடின உழைப்பு, கர்மா, மறுகட்டமைப்பு', te: 'క్రమశిక్షణ, కఠోర శ్రమ, కర్మ, పునర్వ్యవస్థీకరణ', bn: 'শৃঙ্খলা, কঠোর পরিশ্রম, কর্ম, পুনর্গঠন', kn: 'ಶಿಸ್ತು, ಕಠಿಣ ಪರಿಶ್ರಮ, ಕರ್ಮ, ಪುನರ್ರಚನೆ', gu: 'શિસ્ત, કઠોર પરિશ્રમ, કર્મ, પુનર્ગઠન' },
  rahu:    { en: 'Ambition, foreign connections, technology, unconventional paths', hi: 'महत्वाकांक्षा, विदेशी सम्बन्ध, प्रौद्योगिकी, अपरम्परागत मार्ग', sa: 'महत्त्वाकाङ्क्षा, विदेशसम्बन्धाः, प्रौद्योगिकी, अपरम्परागतमार्गाः', mai: 'महत्वाकांक्षा, विदेशी संबंध, प्रौद्योगिकी, अपरंपरागत मार्ग', mr: 'महत्त्वाकांक्षा, परदेशी संबंध, तंत्रज्ञान, अपारंपरिक मार्ग', ta: 'லட்சியம், வெளிநாட்டு தொடர்புகள், தொழில்நுட்பம், வழக்கத்திற்கு மாறான பாதைகள்', te: 'ఆశయం, విదేశీ సంబంధాలు, సాంకేతికత, అసాంప్రదాయ మార్గాలు', bn: 'উচ্চাকাঙ্ক্ষা, বিদেশি সংযোগ, প্রযুক্তি, অপ্রচলিত পথ', kn: 'ಮಹತ್ವಾಕಾಂಕ್ಷೆ, ವಿದೇಶಿ ಸಂಪರ್ಕಗಳು, ತಂತ್ರಜ್ಞಾನ, ಅಸಂಪ್ರದಾಯಿಕ ಹಾದಿಗಳು', gu: 'મહત્વાકાંક્ષા, વિદેશી સંપર્ક, ટેકનોલોજી, અપરંપરાગત માર્ગો' },
  ketu:    { en: 'Spirituality, detachment, past-life karma, liberation', hi: 'आध्यात्मिकता, वैराग्य, पूर्वजन्म कर्म, मोक्ष', sa: 'आध्यात्मिकता, वैराग्यम्, पूर्वजन्मकर्म, मोक्षः', mai: 'आध्यात्मिकता, वैराग्य, पूर्वजन्म कर्म, मोक्ष', mr: 'अध्यात्म, वैराग्य, पूर्वजन्म कर्म, मोक्ष', ta: 'ஆன்மிகம், பற்றின்மை, முற்பிறவி வினை, விடுதலை', te: 'ఆధ్యాత్మికత, వైరాగ్యం, పూర్వజన్మ కర్మ, మోక్షం', bn: 'আধ্যাত্মিকতা, বৈরাগ্য, পূর্বজন্ম কর্ম, মোক্ষ', kn: 'ಆಧ್ಯಾತ್ಮಿಕತೆ, ವೈರಾಗ್ಯ, ಪೂರ್ವಜನ್ಮ ಕರ್ಮ, ಮೋಕ್ಷ', gu: 'આધ્યાત્મિકતા, વૈરાગ્ય, પૂર્વજન્મ કર્મ, મોક્ષ' },
};

// ---------------------------------------------------------------------------
// Planet accent colors
// ---------------------------------------------------------------------------
const PLANET_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  sun:     { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'shadow-orange-500/15' },
  moon:    { border: 'border-sky-400/30', bg: 'bg-sky-400/10', text: 'text-sky-300', glow: 'shadow-sky-400/15' },
  mars:    { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/15' },
  mercury: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/15' },
  jupiter: { border: 'border-amber-400/30', bg: 'bg-amber-400/10', text: 'text-amber-300', glow: 'shadow-amber-400/15' },
  venus:   { border: 'border-pink-400/30', bg: 'bg-pink-400/10', text: 'text-pink-300', glow: 'shadow-pink-400/15' },
  saturn:  { border: 'border-indigo-400/30', bg: 'bg-indigo-400/10', text: 'text-indigo-300', glow: 'shadow-indigo-400/15' },
  rahu:    { border: 'border-slate-400/30', bg: 'bg-slate-400/10', text: 'text-slate-300', glow: 'shadow-slate-400/15' },
  ketu:    { border: 'border-violet-400/30', bg: 'bg-violet-400/10', text: 'text-violet-300', glow: 'shadow-violet-400/15' },
};

const DEFAULT_COLOR = { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-300', glow: 'shadow-purple-500/15' };

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Upcoming Dasha Transition',
    headingPlural: 'Upcoming Dasha Transitions',
    mahadasha: 'Mahadasha',
    antardasha: 'Antardasha',
    beginsIn: (n: number) => n === 0 ? 'Begins today' : n === 1 ? 'Begins tomorrow' : `Begins in ${n} days`,
    viewDasha: 'View Dasha Timeline',
    noTransitions: 'No dasha transitions in the next 90 days',
  },
  hi: {
    heading: 'आगामी दशा परिवर्तन',
    headingPlural: 'आगामी दशा परिवर्तन',
    mahadasha: 'महादशा',
    antardasha: 'अन्तर्दशा',
    beginsIn: (n: number) => n === 0 ? 'आज आरम्भ' : n === 1 ? 'कल आरम्भ' : `${n} दिनों में आरम्भ`,
    viewDasha: 'दशा समयरेखा देखें',
    noTransitions: 'अगले 90 दिनों में कोई दशा परिवर्तन नहीं',
  },
  sa: {
    heading: 'आगामिदशापरिवर्तनम्',
    headingPlural: 'आगामिदशापरिवर्तनानि',
    mahadasha: 'महादशा',
    antardasha: 'अन्तर्दशा',
    beginsIn: (n: number) => n === 0 ? 'अद्य आरम्भः' : n === 1 ? 'श्वः आरम्भः' : `${n} दिनेषु आरम्भः`,
    viewDasha: 'दशासमयरेखां पश्यतु',
    noTransitions: 'आगामिषु ९० दिनेषु दशापरिवर्तनं नास्ति',
  },
  ta: {
    heading: 'வரவிருக்கும் தசா மாற்றம்',
    headingPlural: 'வரவிருக்கும் தசா மாற்றங்கள்',
    mahadasha: 'மகா தசா',
    antardasha: 'அந்தர் தசா',
    beginsIn: (n: number) => n === 0 ? 'இன்று தொடங்குகிறது' : n === 1 ? 'நாளை தொடங்குகிறது' : `${n} நாட்களில் தொடங்குகிறது`,
    viewDasha: 'தசா காலவரிசையைக் காண்க',
    noTransitions: 'அடுத்த 90 நாட்களில் தசா மாற்றங்கள் இல்லை',
  },
  te: {
    heading: 'రాబోయే దశ మార్పు',
    headingPlural: 'రాబోయే దశ మార్పులు',
    mahadasha: 'మహాదశ',
    antardasha: 'అంతర్దశ',
    beginsIn: (n: number) => n === 0 ? 'ఈరోజు ప్రారంభం' : n === 1 ? 'రేపు ప్రారంభం' : `${n} రోజుల్లో ప్రారంభం`,
    viewDasha: 'దశ కాలక్రమం చూడండి',
    noTransitions: 'తదుపరి 90 రోజుల్లో దశ మార్పులు లేవు',
  },
  bn: {
    heading: 'আসন্ন দশা পরিবর্তন',
    headingPlural: 'আসন্ন দশা পরিবর্তনসমূহ',
    mahadasha: 'মহাদশা',
    antardasha: 'অন্তর্দশা',
    beginsIn: (n: number) => n === 0 ? 'আজ শুরু' : n === 1 ? 'আগামীকাল শুরু' : `${n} দিনে শুরু`,
    viewDasha: 'দশা সময়রেখা দেখুন',
    noTransitions: 'পরবর্তী ৯০ দিনে কোনো দশা পরিবর্তন নেই',
  },
  kn: {
    heading: 'ಮುಂಬರುವ ದಶಾ ಪರಿವರ್ತನೆ',
    headingPlural: 'ಮುಂಬರುವ ದಶಾ ಪರಿವರ್ತನೆಗಳು',
    mahadasha: 'ಮಹಾದಶಾ',
    antardasha: 'ಅಂತರ್ದಶಾ',
    beginsIn: (n: number) => n === 0 ? 'ಇಂದು ಪ್ರಾರಂಭ' : n === 1 ? 'ನಾಳೆ ಪ್ರಾರಂಭ' : `${n} ದಿನಗಳಲ್ಲಿ ಪ್ರಾರಂಭ`,
    viewDasha: 'ದಶಾ ಕಾಲಾನುಕ್ರಮ ನೋಡಿ',
    noTransitions: 'ಮುಂದಿನ ೯೦ ದಿನಗಳಲ್ಲಿ ದಶಾ ಪರಿವರ್ತನೆ ಇಲ್ಲ',
  },
  mr: {
    heading: 'आगामी दशा परिवर्तन',
    headingPlural: 'आगामी दशा परिवर्तने',
    mahadasha: 'महादशा',
    antardasha: 'अंतर्दशा',
    beginsIn: (n: number) => n === 0 ? 'आज सुरुवात' : n === 1 ? 'उद्या सुरुवात' : `${n} दिवसांत सुरुवात`,
    viewDasha: 'दशा कालक्रम पहा',
    noTransitions: 'पुढील ९० दिवसांत दशा परिवर्तन नाही',
  },
  gu: {
    heading: 'આગામી દશા પરિવર્તન',
    headingPlural: 'આગામી દશા પરિવર્તનો',
    mahadasha: 'મહાદશા',
    antardasha: 'અંતર્દશા',
    beginsIn: (n: number) => n === 0 ? 'આજે શરૂ' : n === 1 ? 'આવતીકાલે શરૂ' : `${n} દિવસમાં શરૂ`,
    viewDasha: 'દશા સમયરેખા જુઓ',
    noTransitions: 'આગામી ૯૦ દિવસમાં કોઈ દશા પરિવર્તન નથી',
  },
  mai: {
    heading: 'आगामी दशा परिवर्तन',
    headingPlural: 'आगामी दशा परिवर्तन सभ',
    mahadasha: 'महादशा',
    antardasha: 'अंतर्दशा',
    beginsIn: (n: number) => n === 0 ? 'आइ आरम्भ' : n === 1 ? 'काल्हि आरम्भ' : `${n} दिनमे आरम्भ`,
    viewDasha: 'दशा समयरेखा देखू',
    noTransitions: 'अगिला ९० दिनमे कोनो दशा परिवर्तन नहि अछि',
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UpcomingTransition {
  planet: string;
  planetName: LocaleText;
  level: 'maha' | 'antar';
  startDate: string;
  daysUntil: number;
}

// ---------------------------------------------------------------------------
// Find upcoming transitions
// ---------------------------------------------------------------------------
function findUpcomingTransitions(dashaTimeline: DashaEntry[]): UpcomingTransition[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const limit = new Date(today.getTime() + 90 * 86400000);
  const transitions: UpcomingTransition[] = [];

  for (const maha of dashaTimeline) {
    const mahaStart = new Date(maha.startDate);
    // Check mahadasha start
    if (mahaStart >= today && mahaStart <= limit) {
      const diffMs = mahaStart.getTime() - today.getTime();
      const daysUntil = Math.round(diffMs / 86400000);
      transitions.push({
        planet: maha.planet,
        planetName: maha.planetName,
        level: 'maha',
        startDate: maha.startDate,
        daysUntil,
      });
    }

    // Check antardasha starts
    if (maha.subPeriods) {
      for (const antar of maha.subPeriods) {
        const antarStart = new Date(antar.startDate);
        if (antarStart >= today && antarStart <= limit) {
          const diffMs = antarStart.getTime() - today.getTime();
          const daysUntil = Math.round(diffMs / 86400000);
          transitions.push({
            planet: antar.planet,
            planetName: antar.planetName,
            level: 'antar',
            startDate: antar.startDate,
            daysUntil,
          });
        }
      }
    }
  }

  // Sort by soonest first
  transitions.sort((a, b) => a.daysUntil - b.daysUntil);
  // Return first 3 max
  return transitions.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface DashaTransitionAlertProps {
  dashaTimeline: DashaEntry[];
  locale: Locale;
  kundaliId?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashaTransitionAlert({ dashaTimeline, locale, kundaliId }: DashaTransitionAlertProps) {
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || (isDevanagariLocale(locale) ? LABELS.hi : LABELS.en);
  const isHi = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);

  const transitions = useMemo(() => {
    if (!dashaTimeline || dashaTimeline.length === 0) return [];
    return findUpcomingTransitions(dashaTimeline);
  }, [dashaTimeline]);

  if (transitions.length === 0) return null;

  const dashaLink = kundaliId
    ? `/kundali/${kundaliId}#dasha` as const
    : '/dashboard/dashas' as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/40 to-[#0a0e27] backdrop-blur-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={headingFont}>
            {transitions.length === 1 ? L.heading : L.headingPlural}
          </h3>
        </div>

        {/* Transition cards */}
        <div className="space-y-3 mt-4">
          {transitions.map((tr, i) => {
            const planetKey = tr.planet.toLowerCase();
            const colors = PLANET_COLORS[planetKey] || DEFAULT_COLOR;
            const interp = PLANET_INTERPRETATIONS[planetKey];
            const isUrgent = tr.daysUntil <= 7;
            const dateFormatted = new Date(tr.startDate).toLocaleDateString(
              tl({ en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN' }, locale),
              { month: 'short', day: 'numeric', year: 'numeric' }
            );

            return (
              <motion.div
                key={`${tr.level}-${tr.planet}-${tr.startDate}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className={`relative p-4 rounded-xl border ${colors.border} ${isUrgent ? `shadow-lg ${colors.glow}` : ''} transition-all`}
                style={{
                  background: isUrgent
                    ? 'linear-gradient(135deg, rgba(127,29,29,0.12), rgba(30,20,60,0.5))'
                    : 'linear-gradient(135deg, rgba(45,27,105,0.25), rgba(10,14,39,0.5))',
                }}
              >
                {/* Urgency glow ring for <= 7 days */}
                {isUrgent && (
                  <div className="absolute inset-0 rounded-xl ring-1 ring-red-500/25 animate-pulse pointer-events-none" />
                )}

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Planet color accent + countdown */}
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                      <Clock className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : `${colors.bg} ${colors.text} border ${colors.border}`
                    }`}>
                      {tr.daysUntil}d
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-sm font-bold ${colors.text}`} style={bodyFont}>
                        {tr.planetName[locale] || tr.planetName.en}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                        tr.level === 'maha'
                          ? 'bg-gold-primary/15 text-gold-light border-gold-primary/25'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                      }`}>
                        {tr.level === 'maha' ? L.mahadasha : L.antardasha}
                      </span>
                    </div>

                    <p className="text-text-primary text-sm font-medium" style={bodyFont}>
                      {L.beginsIn(tr.daysUntil)} ({dateFormatted})
                    </p>

                    {interp && (
                      <p className="text-text-secondary text-xs mt-1 leading-relaxed" style={bodyFont}>
                        {isHi ? interp.hi : interp.en}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Link to dasha page */}
        <div className="mt-4 text-center">
          <Link
            href={dashaLink}
            className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
            style={bodyFont}
          >
            {L.viewDasha}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

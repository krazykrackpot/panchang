'use client';

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import KMSG from '@/messages/pages/kundali-inline.json';

// Module-level msg helper — resolves inline locale labels from JSON
const msg = (key: string, locale: string): string =>
  lt((KMSG as unknown as Record<string, LocaleText>)[key], locale);

import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import dynamic from 'next/dynamic';
import BirthForm from '@/components/kundali/BirthForm';
import ConvergenceSummary from '@/components/kundali/ConvergenceSummary';
import GoldDivider from '@/components/ui/GoldDivider';
import ShareButton from '@/components/ui/ShareButton';
// PrintButton removed — consolidated into DownloadReportButton (full HTML report via /api/kundali-report)
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Save, Check, ScrollText, Sparkles, Share2, X, ArrowRightLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { generateKundaliPrintHtml } from '@/lib/pdf/kundali-pdf';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { getPlanetaryPositions, toSidereal, dateToJD, normalizeDeg } from '@/lib/ephem/astronomical';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { trackKundaliGenerated, trackTabViewed } from '@/lib/analytics';
import type { TippanniContent, PlanetInsight } from '@/lib/kundali/tippanni-types';
import type { MahadashaOverview, AntardashaSynthesis, PratyantardashaSynthesis, PeriodAssessment } from '@/lib/tippanni/dasha-synthesis-types';
import { detectAfflictedPlanets, type AfflictedPlanet } from '@/lib/puja/affliction-detector';
import { computeSignShift, encodeSignShiftParams } from '@/lib/shareable/sign-shift';
import type { KundaliData, BirthData, ChartStyle, PlanetPosition, AshtakavargaData, DivisionalChart, GrahaDetail, UpagrahaPosition, DashaEntry } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { Locale , LocaleText} from '@/types/panchang';
import type { SadeSatiAnalysis, NakshatraTransitEntry } from '@/lib/kundali/sade-sati-analysis';
import type { PersonalReading, DomainType } from '@/lib/kundali/domain-synthesis/types';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import { getSavedQuestionChoice, clearQuestionChoice } from '@/components/kundali/QuestionEntry';
import { computeKeyDates, type KeyDate } from '@/lib/kundali/domain-synthesis/key-dates';
import { KeyDatesSection } from '@/components/kundali/SummaryCurrentPeriod';
import { generateVedicProfile } from '@/lib/kundali/vedic-profile';
import type { VedicProfile as VedicProfileType } from '@/lib/kundali/vedic-profile';
import { useAIReading } from '@/lib/kundali/domain-synthesis/use-ai-reading';
import { useTrajectory } from '@/lib/kundali/domain-synthesis/use-trajectory';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { generateVargaTippanni, type VargaChartTippanni, type VargaSynthesis } from '@/lib/tippanni/varga-tippanni';
import PaywallGate from '@/components/ui/PaywallGate';
import InfoBlock from '@/components/ui/InfoBlock';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { findDashaSandhiPeriods } from '@/lib/kundali/dasha-sandhi';
import { assembleBirthPosterData } from '@/lib/shareable/birth-poster';
import { generateCosmicBlueprint, type CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import { getNarayanaInterpretation } from '@/lib/constants/narayana-interpretations';
import DownloadReportButton from '@/components/kundali/DownloadReportButton';

// Dynamic imports — only loaded after chart generation or on specific tab activation
const ChartNorth = dynamic(() => import('@/components/kundali/ChartNorth'), { ssr: false });
const ChartSouth = dynamic(() => import('@/components/kundali/ChartSouth'), { ssr: false });
const AIReadingButton = dynamic(() => import('@/components/kundali/AIReadingButton'), { ssr: false });
const JaiminiTab = dynamic(() => import('@/components/kundali/JaiminiTab'), { ssr: false });
const SphutasTab = dynamic(() => import('@/components/kundali/SphutasTab'), { ssr: false });
const ShareableKundaliCard = dynamic(() => import('@/components/kundali/ShareableKundaliCard'), { ssr: false });
const TransitRadar = dynamic(() => import('@/components/kundali/TransitRadar'), { ssr: false });
const ChartChatTab = dynamic(() => import('@/components/kundali/ChartChatTab'), { ssr: false });
const LifeTimeline = dynamic(() => import('@/components/kundali/LifeTimeline'), { ssr: false });
const PatrikaTab = dynamic(() => import('@/components/kundali/PatrikaTab'), { ssr: false });
const RemediesTab = dynamic(() => import('@/components/kundali/RemediesTab'), { ssr: false });
const SudarshanaTab = dynamic(() => import('@/components/kundali/SudarshanaTab'), { ssr: false });
const NadiAmshaTab = dynamic(() => import('@/components/kundali/NadiAmshaTab'), { ssr: false });
const VargasTab = dynamic(() => import('@/components/kundali/VargasTab'), { ssr: false });
const AshtakavargaTab = dynamic(() => import('@/components/kundali/AshtakavargaTab'), { ssr: false });
const TippanniTab = dynamic(() => import('@/components/kundali/TippanniTab'), { ssr: false });
const VargaAnalysisTab = dynamic(() => import('@/components/kundali/VargaAnalysisTab'), { ssr: false });
const GrahaTab = dynamic(() => import('@/components/kundali/GrahaTab'), { ssr: false });
const DashaTimeline = dynamic(() => import('@/components/kundali/DashaTimeline'), { ssr: false });
const YogasTab = dynamic(() => import('@/components/kundali/YogasTab'), { ssr: false });
const ShadbalaTab = dynamic(() => import('@/components/kundali/ShadbalaTab'), { ssr: false });
const BhavabalaTab = dynamic(() => import('@/components/kundali/BhavabalaTab'), { ssr: false });
const SadeSatiTab = dynamic(() => import('@/components/kundali/SadeSatiTab'), { ssr: false });
const ShadbalaInterpretation = dynamic(() => import('@/components/kundali/InterpretationHelpers').then(mod => ({ default: mod.ShadbalaInterpretation })), { ssr: false });
const YogasInterpretation = dynamic(() => import('@/components/kundali/InterpretationHelpers').then(mod => ({ default: mod.YogasInterpretation })), { ssr: false });
const AvasthasInterpretation = dynamic(() => import('@/components/kundali/InterpretationHelpers').then(mod => ({ default: mod.AvasthasInterpretation })), { ssr: false });
const BhavabalaInterpretation = dynamic(() => import('@/components/kundali/InterpretationHelpers').then(mod => ({ default: mod.BhavabalaInterpretation })), { ssr: false });
const PlanetsInterpretation = dynamic(() => import('@/components/kundali/InterpretationHelpers').then(mod => ({ default: mod.PlanetsInterpretation })), { ssr: false });
const DashaInterpretation = dynamic(() => import('@/components/kundali/InterpretationHelpers').then(mod => ({ default: mod.DashaInterpretation })), { ssr: false });
const LifeReadingDashboard = dynamic(() => import('@/components/kundali/LifeReadingDashboard'), { ssr: false });
const DomainDeepDive = dynamic(() => import('@/components/kundali/DomainDeepDive'), { ssr: false });
const KeyDatesTimeline = dynamic(() => import('@/components/kundali/KeyDatesTimeline'), { ssr: false });
const QuestionEntry = dynamic(() => import('@/components/kundali/QuestionEntry'), { ssr: false });
const SummaryView = dynamic(() => import('@/components/kundali/SummaryView'), { ssr: false });
const TrajectoryCard = dynamic(() => import('@/components/kundali/TrajectoryCard'), { ssr: false });
const VedicProfileComponent = dynamic(() => import('@/components/kundali/VedicProfile'), { ssr: false });
const BirthPosterCard = dynamic(() => import('@/components/shareable/BirthPosterCard'), { ssr: false });
const BlueprintTab = dynamic(() => import('@/components/kundali/BlueprintTab'), { ssr: false });
const UnifiedTimeline = dynamic(() => import('@/components/kundali/UnifiedTimeline'), { ssr: false });
const BhavaChalitTab = dynamic(() => import('@/components/kundali/BhavaChalitTab'), { ssr: false });
const ELI5Panel = dynamic(() => import('@/components/kundali/ELI5Panel'), { ssr: false });
const AyanamshaComparison = dynamic(() => import('@/components/kundali/AyanamshaComparison'), { ssr: false });
const KPTab = dynamic(() => import('@/components/kundali/KPTab'), { ssr: false });

// Planet colors for table highlights
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

// Extracted to module level to avoid recreation on every render
const HOUSE_THEMES: Record<number, LocaleText> = {
  1: { en: 'Self, body, health, personality', hi: 'आत्म, शरीर, स्वास्थ्य', sa: 'आत्मा, शरीरम्, आरोग्यम्, व्यक्तित्वम्', mai: 'आत्मा, शरीर, स्वास्थ्य, व्यक्तित्व', mr: 'आत्म, शरीर, आरोग्य, व्यक्तिमत्त्व', ta: 'ஆத்மா, உடல், ஆரோக்கியம், ஆளுமை', te: 'ఆత్మ, శరీరం, ఆరోగ్యం, వ్యక్తిత్వం', bn: 'আত্ম, শরীর, স্বাস্থ্য, ব্যক্তিত্ব', kn: 'ಆತ್ಮ, ದೇಹ, ಆರೋಗ್ಯ, ವ್ಯಕ್ತಿತ್ವ', gu: 'આત્મ, શરીર, આરોગ્ય, વ્યક્તિત્વ' },
  2: { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी', sa: 'धनम्, कुटुम्बम्, वाक्', mai: 'धन, परिवार, बोली', mr: 'धन, कुटुंब, वाणी', ta: 'செல்வம், குடும்பம், பேச்சு', te: 'ధనం, కుటుంబం, వాక్కు', bn: 'ধন, পরিবার, বাক্', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಣಿ', gu: 'ધન, કુટુંબ, વાણી' },
  3: { en: 'Courage, siblings, short travel', hi: 'साहस, भाई-बहन, लघु यात्रा', sa: 'शौर्यम्, भ्रातरः, लघुयात्रा', mai: 'साहस, भाय-बहिन, छोट यात्रा', mr: 'धैर्य, भावंडे, लहान प्रवास', ta: 'தைரியம், உடன்பிறப்புகள், குறு பயணம்', te: 'ధైర్యం, తోబుట్టువులు, చిన్న ప్రయాణం', bn: 'সাহস, ভাইবোন, স্বল্প যাত্রা', kn: 'ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು, ಸಣ್ಣ ಪ್ರಯಾಣ', gu: 'સાહસ, ભાઈ-બહેન, ટૂંકી મુસાફરી' },
  4: { en: 'Home, mother, property, comfort', hi: 'घर, माता, सम्पत्ति, सुख', sa: 'गृहम्, माता, सम्पत्तिः, सुखम्', mai: 'घर, माय, संपत्ति, सुख', mr: 'घर, आई, मालमत्ता, सुख', ta: 'வீடு, தாய், சொத்து, சுகம்', te: 'ఇల్లు, తల్లి, ఆస్తి, సుఖం', bn: 'গৃহ, মাতা, সম্পত্তি, সুখ', kn: 'ಮನೆ, ತಾಯಿ, ಆಸ್ತಿ, ಸುಖ', gu: 'ઘર, માતા, મિલકત, સુખ' },
  5: { en: 'Children, education, creativity', hi: 'सन्तान, शिक्षा, रचनात्मकता', sa: 'सन्तानम्, शिक्षा, सृजनशीलता', mai: 'संतान, शिक्षा, रचनात्मकता', mr: 'संतती, शिक्षण, सर्जनशीलता', ta: 'குழந்தைகள், கல்வி, படைப்பாற்றல்', te: 'సంతానం, విద్య, సృజనాత్మకత', bn: 'সন্তান, শিক্ষা, সৃজনশীলতা', kn: 'ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಸೃಜನಶೀಲತೆ', gu: 'સંતાન, શિક્ષણ, સર્જનાત્મકતા' },
  6: { en: 'Enemies, health issues, service', hi: 'शत्रु, स्वास्थ्य, सेवा', sa: 'शत्रवः, रोगः, सेवा', mai: 'शत्रु, रोग, सेवा', mr: 'शत्रू, आरोग्य समस्या, सेवा', ta: 'எதிரிகள், உடல்நலப் பிரச்சினைகள், சேவை', te: 'శత్రువులు, ఆరోగ్య సమస్యలు, సేవ', bn: 'শত্রু, স্বাস্থ্য সমস্যা, সেবা', kn: 'ಶತ್ರುಗಳು, ಆರೋಗ್ಯ ಸಮಸ್ಯೆ, ಸೇವೆ', gu: 'શત્રુ, આરોગ્ય સમસ્યા, સેવા' },
  7: { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', sa: 'विवाहः, साझेदारी, वाणिज्यम्', mai: 'बियाह, साझेदारी, व्यापार', mr: 'विवाह, भागीदारी, व्यापार', ta: 'திருமணம், கூட்டாண்மை, வணிகம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર' },
  8: { en: 'Transformation, longevity, occult', hi: 'परिवर्तन, दीर्घायु, गुप्त विद्या', sa: 'परिवर्तनम्, दीर्घायुः, गुप्तविद्या', mai: 'परिवर्तन, दीर्घायु, गुप्त विद्या', mr: 'परिवर्तन, दीर्घायुष्य, गूढविद्या', ta: 'மாற்றம், நீண்ட ஆயுள், மறைவிద்யை', te: 'పరివర్తన, దీర్ఘాయువు, రహస్య విద్య', bn: 'পরিবর্তন, দীর্ঘায়ু, গুপ্তবিদ্যা', kn: 'ಪರಿವರ್ತನೆ, ದೀರ್ಘಾಯುಷ್ಯ, ಗುಪ್ತವಿದ್ಯೆ', gu: 'પરિવર્તન, દીર્ઘાયુ, ગુપ્તવિદ્યા' },
  9: { en: 'Fortune, father, dharma, guru', hi: 'भाग्य, पिता, धर्म, गुरु', sa: 'भाग्यम्, पिता, धर्मः, गुरुः', mai: 'भाग्य, पिता, धर्म, गुरु', mr: 'भाग्य, पिता, धर्म, गुरू', ta: 'அதிர்ஷ்டம், தந்தை, தர்மம், குரு', te: 'భాగ్యం, తండ్రి, ధర్మం, గురువు', bn: 'ভাগ্য, পিতা, ধর্ম, গুরু', kn: 'ಭಾಗ್ಯ, ತಂದೆ, ಧರ್ಮ, ಗುರು', gu: 'ભાગ્ય, પિતા, ધર્મ, ગુરુ' },
  10: { en: 'Career, status, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार', sa: 'वृत्तिः, प्रतिष्ठा, अधिकारः', mai: 'नौकरी, प्रतिष्ठा, अधिकार', mr: 'व्यवसाय, प्रतिष्ठा, अधिकार', ta: 'தொழில், அந்தஸ்து, அதிகாரம்', te: 'వృత్తి, హోదా, అధికారం', bn: 'পেশা, মর্যাদা, কর্তৃত্ব', kn: 'ವೃತ್ತಿ, ಸ್ಥಾನಮಾನ, ಅಧಿಕಾರ', gu: 'વ્યવસાય, પ્રતિષ્ઠા, અધિકાર' },
  11: { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ', sa: 'लाभः, आयः, मित्राणि, इच्छाः', mai: 'लाभ, आय, मित्र, इच्छा', mr: 'लाभ, उत्पन्न, मित्र, इच्छा', ta: 'லாபம், வருமானம், நண்பர்கள், ஆசைகள்', te: 'లాభం, ఆదాయం, మిత్రులు, కోరికలు', bn: 'লাভ, আয়, বন্ধু, ইচ্ছা', kn: 'ಲಾಭ, ಆದಾಯ, ಮಿತ್ರರು, ಆಸೆಗಳು', gu: 'લાભ, આવક, મિત્રો, ઇચ્છાઓ' },
  12: { en: 'Expenses, liberation, foreign', hi: 'व्यय, मोक्ष, विदेश', sa: 'व्ययः, मोक्षः, विदेशः', mai: 'खर्च, मोक्ष, विदेश', mr: 'खर्च, मोक्ष, परदेश', ta: 'செலவுகள், முக்தி, வெளிநாடு', te: 'ఖర్చులు, మోక్షం, విదేశం', bn: 'ব্যয়, মোক্ষ, বিদেশ', kn: 'ವೆಚ್ಚ, ಮೋಕ್ಷ, ವಿದೇಶ', gu: 'ખર્ચ, મોક્ષ, વિદેશ' },
};

const NARAYANA_SIGN_PROFILES: Record<number, LocaleText> = {
  1:  { en: 'Aries Dasha — dynamic, pioneering period. New ventures launch; courage is tested. Competitive environments, conflicts, and breakthroughs in tandem. Events come suddenly; decisions must be made swiftly. Body, head, and Mars-ruled matters are activated. If Mars is well-placed, decisive victories; if afflicted, accidents or surgeries are possible.', hi: 'मेष दशा — गतिशील, अग्रणी काल। नए उद्यम प्रारंभ; साहस की परीक्षा। प्रतिस्पर्धा, संघर्ष और सफलता साथ-साथ। घटनाएं अचानक; त्वरित निर्णय आवश्यक। यदि मंगल बलवान हो तो विजय; पीड़ित हो तो दुर्घ���ना संभव।', sa: 'मेषदशा — गतिशीलं अग्रगामि कालखण्डम्। नूतनानि उद्यमानि प्रारभन्ते; शौर्यस्य परीक्षा भवति। प्रतिस्पर्धा, संघर्षः, सफलता च युगपत्। घटनाः अकस्मात्; त्वरितनिर्णयाः आवश्यकाः। यदि मङ्गलः बलवान् तर्हि विजयः; पीडितः चेत् दुर्घटना सम्भवा।', mai: 'मेष दशा — गतिशील, अगुआ काल। नव उद्यम शुरू होइत अछि; साहसक परीक्षा। प्रतिस्पर्धा, संघर्ष आ सफलता संगे-संग। घटना अचानक; जल्दी निर्णय जरूरी। जौं मंगल बलवान त विजय; पीड़ित त दुर्घटना संभव।', mr: 'मेष दशा — गतिशील, अग्रगामी कालखंड। नवे उपक्रम सुरू होतात; धाडसाची परीक्षा. स्पर्धा, संघर्ष आणि यश एकत्र. घटना अचानक; त्वरित निर्णय आवश्यक. मंगळ बलवान असल्यास विजय; पीडित असल्यास अपघात शक्य.', ta: 'மேஷ தசை — ஆற்றல்மிக்க, முன்னோடிக் காலம். புதிய முயற்சிகள் தொடங்கும்; தைரியம் சோதிக்கப்படும். போட்டி, மோதல், வெற்றி ஒரே நேரத்தில். நிகழ்வுகள் திடீரென; முடிவுகள் விரைவாக எடுக்க வேண்டும். செவ்வாய் பலமாக இருந்தால் வெற்றி; பாதிக்கப்பட்டிருந்தால் விபத்து சாத்தியம்.', te: 'మేష దశ — చైతన్యవంతమైన, అగ్రగామి కాలం. కొత్త ప్రయత్నాలు ప్రారంభమవుతాయి; ధైర్యం పరీక్షించబడుతుంది. పోటీ, సంఘర్షణ, విజయం ఏకకాలంలో. సంఘటనలు అకస్మాత్తుగా; నిర్ణయాలు త్వరగా తీసుకోవాలి. కుజుడు బలంగా ఉంటే విజయం; బాధితుడైతే ప్రమాదాలు సాధ్యం.', bn: 'মেষ দশা — গতিশীল, অগ্রগামী কাল। নতুন উদ্যোগ শুরু হয়; সাহসের পরীক্ষা। প্রতিযোগিতা, সংঘর্ষ ও সাফল্য একসাথে। ঘটনা হঠাৎ; দ্রুত সিদ্ধান্ত প্রয়োজন। মঙ্গল বলবান হলে বিজয়; পীড়িত হলে দুর্ঘটনা সম্ভব।', kn: 'ಮೇಷ ದಶೆ — ಚೈತನ್ಯಶೀಲ, ಮುಂಚೂಣಿ ಅವಧಿ. ಹೊಸ ಉದ್ಯಮಗಳು ಆರಂಭವಾಗುತ್ತವೆ; ಧೈರ್ಯ ಪರೀಕ್ಷೆಗೊಳಗಾಗುತ್ತದೆ. ಸ್ಪರ್ಧೆ, ಸಂಘರ್ಷ ಮತ್ತು ಯಶಸ್ಸು ಒಟ್ಟಿಗೆ. ಘಟನೆಗಳು ಅಕಸ್ಮಾತ್; ತ್ವರಿತ ನಿರ್ಧಾರಗಳು ಅಗತ್ಯ. ಕುಜ ಬಲಶಾಲಿಯಾಗಿದ್ದರೆ ವಿಜಯ; ಪೀಡಿತನಾಗಿದ್ದರೆ ಅಪಘಾತ ಸಾಧ್ಯ.', gu: 'મેષ દશા — ગતિશીલ, અગ્રણી કાળ. નવા ઉપક્રમો શરૂ થાય; સાહસની કસોટી. સ્પર્ધા, સંઘર્ષ અને સફળતા સાથે-સાથે. ઘટનાઓ અચાનક; ઝડપી નિર્ણયો જરૂરી. મંગળ બળવાન હોય તો વિજય; પીડિત હોય તો અકસ્માત શક્ય.' },
  2:  { en: 'Taurus Dasha — stable, accumulative period. Financial matters dominate; property, land, and fixed assets are acquired or transacted. Marriage and partnerships come into focus. Pleasures and comforts increase. Progress is slow but steady; patience is rewarded with lasting prosperity. Venus-ruled arts and aesthetic pursuits flourish.', hi: 'वृष दशा — स्थिर, संचयशील काल। वित्तीय मामले प्रमुख; सम्पत्ति, भूमि अर्जित या हस्तांतरित। विवाह और साझेदारियां केंद्र में। सुख-सुविधाएं बढ़ती हैं। धीमी किन्तु स्थिर प्रगति; धैर्य से स्थायी समृद्धि।', sa: 'वृषभदशा — स्थिरं सञ्चयशीलं कालखण्डम्। वित्तीयविषयाः प्रमुखाः; सम्पत्तिः भूमिश्च अर्ज्यते। विवाहः साझेदारी च केन्द्रे। सुखसुविधाः वर्धन्ते। मन्दा किन्तु स्थिरा प्रगतिः; धैर्येण स्थायिसमृद्धिः।', mai: 'वृष दशा — स्थिर, संचय काल। आर्थिक मामला प्रमुख; संपत्ति, जमीन अर्जित वा हस्तांतरित। बियाह आ साझेदारी केंद्र मे। सुख-सुविधा बढ़ैत अछि। धीमा मुदा स्थिर प्रगति; धैर्यसँ स्थायी समृद्धि।', mr: 'वृषभ दशा — स्थिर, संचयशील कालखंड. आर्थिक बाबी प्रमुख; मालमत्ता, जमीन मिळवली जाते. विवाह आणि भागीदारी केंद्रस्थानी. सुखसोयी वाढतात. संथ पण स्थिर प्रगती; संयमाने शाश्वत समृद्धी.', ta: 'ரிஷப தசை — நிலையான, சேகரிப்புக் காலம். நிதி விஷயங்கள் முதன்மை; சொத்து, நிலம் பெறப்படும். திருமணம், கூட்டாண்மை கவனத்தில். சுகங்கள் அதிகரிக்கும். மெதுவான ஆனால் நிலையான முன்னேற்றம்; பொறுமை நிலையான செழிப்பைத் தரும்.', te: 'వృషభ దశ — స్థిరమైన, సంచయ కాలం. ఆర్థిక విషయాలు ప్రధానం; ఆస్తి, భూమి సంపాదించబడుతుంది. వివాహం, భాగస్వామ్యం కేంద్రంలో. సుఖాలు పెరుగుతాయి. నెమ్మదైన కానీ స్థిరమైన ప్రగతి; ఓర్పుతో శాశ్వత సమృద్ధి.', bn: 'বৃষ দশা — স্থিতিশীল, সঞ্চয়শীল কাল। আর্থিক বিষয় প্রধান; সম্পত্তি, ভূমি অর্জিত হয়। বিবাহ ও অংশীদারিত্ব কেন্দ্রে। সুখ-সুবিধা বাড়ে। ধীর কিন্তু স্থির অগ্রগতি; ধৈর্যে স্থায়ী সমৃদ্ধি।', kn: 'ವೃಷಭ ದಶೆ — ಸ್ಥಿರ, ಸಂಚಯಶೀಲ ಅವಧಿ. ಆರ್ಥಿಕ ವಿಷಯಗಳು ಪ್ರಮುಖ; ಆಸ್ತಿ, ಭೂಮಿ ಗಳಿಸಲಾಗುತ್ತದೆ. ವಿವಾಹ ಮತ್ತು ಪಾಲುದಾರಿಕೆ ಕೇಂದ್ರದಲ್ಲಿ. ಸುಖಸೌಕರ್ಯ ಹೆಚ್ಚಾಗುತ್ತವೆ. ನಿಧಾನ ಆದರೆ ಸ್ಥಿರ ಪ್ರಗತಿ; ತಾಳ್ಮೆಯಿಂದ ಶಾಶ್ವತ ಸಮೃದ್ಧಿ.', gu: 'વૃષભ દશા — સ્થિર, સંચયશીલ કાળ. આર્થિક બાબતો મુખ્ય; મિલકત, જમીન મેળવાય. લગ્ન અને ભાગીદારી કેન્દ્રમાં. સુખસગવડો વધે. ધીમી પણ સ્થિર પ્રગતિ; ધીરજથી કાયમી સમૃદ્ધિ.' },
  3:  { en: 'Gemini Dasha — intellectual, communicative period. Education, writing, and short journeys multiply. Siblings play a significant role. Two paths or dual involvements are common. Business dealings and negotiations succeed. The mind is sharp and restless — channelled well, it achieves brilliance; scattered, it produces anxiety.', hi: 'मिथुन दशा — बौद्धिक, ���ंचार-प्रधान काल। शिक्षा, लेखन और लघु यात्राएं बढ़ती हैं। भाई-बहनों की भूमिका महत्वपूर्ण। दोहरी राहें सामान्य। व्यापार और वार्ता में सफलता। मन तीव्र और बेचैन — सुनिर्देशित हो तो प्रतिभाशाली।', sa: 'मिथुनदशा — बौद्धिकं सञ्चारप्रधानं कालखण्डम्। शिक्षा, लेखनं, लघुयात्राश्च वर्धन्ते। भ्रातॄणां भूमिका महत्त्वपूर्णा। द्विमार्गाः सामान्याः। वाणिज्यं वार्ता च सफला। मनः तीक्ष्णं चञ्चलं च — सुनिर्दिष्टं चेत् प्रतिभाशालि।', mai: 'मिथुन दशा — बौद्धिक, संचार-प्रधान काल। शिक्षा, लेखन आ छोट यात्रा बढ़ैत अछि। भाय-बहिनक भूमिका महत्वपूर्ण। दू राह सामान्य। व्यापार आ वार्ता मे सफलता। मन तेज आ बेचैन — सही दिशा मे त प्रतिभाशाली।', mr: 'मिथुन दशा — बौद्धिक, संवादप्रधान कालखंड. शिक्षण, लेखन आणि लहान प्रवास वाढतात. भावंडांची भूमिका महत्त्वाची. दुहेरी मार्ग सामान्य. व्यापार आणि वाटाघाटींमध्ये यश. मन तीक्ष्ण आणि अस्वस्थ — योग्य दिशेने प्रतिभाशाली.', ta: 'மிதுன தசை — அறிவார்ந்த, தகவல்தொடர்புக் காலம். கல்வி, எழுத்து, குறு பயணங்கள் பெருகும். உடன்பிறப்புகளின் பங்கு முக்கியம். இரட்டை வழிகள் சாதாரணம். வணிகம், பேச்சுவார்த்தைகளில் வெற்றி. மனம் கூர்மையும் அமைதியின்மையும் — சரியாக வழிநடத்தினால் மேதாவிதனம்.', te: 'మిథున దశ — బౌద్ధిక, సంభాషణ ప్రధాన కాలం. విద్య, రచన, చిన్న ప్రయాణాలు పెరుగుతాయి. తోబుట్టువుల పాత్ర ముఖ్యం. ద్వంద్వ మార్గాలు సాధారణం. వ్యాపారం, చర్చలలో విజయం. మనసు తీక్షణం, చంచలం — సరిగా మళ్ళించినట్లయితే ప్రతిభ.', bn: 'মিথুন দশা — বৌদ্ধিক, যোগাযোগ-প্রধান কাল। শিক্ষা, লেখা ও স্বল্প যাত্রা বাড়ে। ভাইবোনের ভূমিকা গুরুত্বপূর্ণ। দ্বৈত পথ সাধারণ। ব্যবসা ও আলোচনায় সাফল্য। মন তীক্ষ্ণ ও অস্থির — সঠিক দিশায় প্রতিভাশালী।', kn: 'ಮಿಥುನ ದಶೆ — ಬೌದ್ಧಿಕ, ಸಂವಹನ ಪ್ರಧಾನ ಅವಧಿ. ಶಿಕ್ಷಣ, ಬರವಣಿಗೆ, ಸಣ್ಣ ಪ್ರಯಾಣಗಳು ಹೆಚ್ಚಾಗುತ್ತವೆ. ಒಡಹುಟ್ಟಿದವರ ಪಾತ್ರ ಮಹತ್ವದ್ದು. ಜೋಡಿ ಮಾರ್ಗಗಳು ಸಾಮಾನ್ಯ. ವ್ಯಾಪಾರ ಮತ್ತು ಮಾತುಕತೆಯಲ್ಲಿ ಯಶಸ್ಸು. ಮನಸ್ಸು ತೀಕ್ಷ್ಣ ಮತ್ತು ಚಂಚಲ — ಸರಿಯಾಗಿ ನಿರ್ದೇಶಿಸಿದರೆ ಪ್ರತಿಭೆ.', gu: 'મિથુન દશા — બૌદ્ધિક, સંવાદ-પ્રધાન કાળ. શિક્ષણ, લેખન અને ટૂંકી મુસાફરીઓ વધે. ભાઈ-બહેનોની ભૂમિકા મહત્વપૂર્ણ. બેવડા માર્ગો સામાન્ય. વ્યાપાર અને વાટાઘાટોમાં સફળતા. મન તીક્ષ્ણ અને અસ્થિર — યોગ્ય દિશામાં પ્રતિભાશાળી.' },
  4:  { en: 'Cancer Dasha — domestic, emotional period. Home, mother, and property matters dominate. Residential changes or renovations are common. Emotional sensitivity peaks — intuition is strong. Real estate deals are favourable. Mother\'s health may require attention. Psychic experiences and vivid dreams are possible.', hi: 'कर्क दशा — गृह, भावनात्मक काल। घर, माता और सम्पत्ति मामले प्रमुख। आवासीय परिवर्तन सामान्य। भावनात्मक संवेदनशीलता शिखर पर। अचल सम्पत्ति अनुकूल। माता का स्वास्थ्य ध्यान योग्य। अतींद्रिय अनुभव संभव।' },
  5:  { en: 'Leo Dasha — authoritative, prestigious period. Career advancement and social recognition are prominent. Father\'s influence is strong. Dealings with government or authority figures feature. Children may be a central theme. Creative expression and leadership roles come naturally. Pride and dignity are tested — humility prevents falls.', hi: 'सिंह दशा — अधिकार, प्रतिष्ठा काल। कैरियर उन्नति और सामाजिक मान्यता प्रमुख। पिता का प्रभाव बलवान। सरकार या अधिकारियों से व्यवहार। संतान केंद्रीय विषय। रचनात्मक अभिव्यक्ति स्वाभाविक। अहंकार की परीक्षा — विनम्रता आवश्यक।' },
  6:  { en: 'Virgo Dasha — service, health-focused period. Work routines and employment matters are central. Health issues may arise and be resolved. Enemies or disputes surface — detailed attention to contracts and agreements is crucial. Debts are settled. Service-oriented activities succeed. The native works harder than usual, with tangible rewards.', hi: 'कन्या दशा — सेवा, स्वास्थ्य-केंद्रित काल। कार्य दिनचर्या और रोजगार मामले केंद्रीय। स्वास्थ्य समस्याएं उठ सकती और सुलझ सकती हैं। शत्रु या विवाद उभरते हैं। ऋण चुकाए जाते हैं। सेवा-कार्य सफल होते हैं।', sa: 'कन्यादशा — सेवा, आरोग्यकेन्द्रितं कालखण्डम्। कार्यदिनचर्या रोजगारविषयाश्च केन्द्रीयाः। आरोग्यसमस्याः उद्भवन्ति समाधीयन्ते च। शत्रवः विवादाश्च उद्भवन्ति। ऋणानि परिशोध्यन्ते। सेवाकार्याणि सफलानि।', mai: 'कन्या दशा — सेवा, स्वास्थ्य-केंद्रित काल। काम-धंधा आ रोजगार मामला केंद्रीय। स्वास्थ्य समस्या उठि सकैत अछि आ सुलझि सकैत अछि। शत्रु वा विवाद उभरैत अछि। कर्ज चुकाओल जाइत अछि। सेवा-कार्य सफल होइत अछि।', mr: 'कन्या दशा — सेवा, आरोग्य-केंद्रित कालखंड. कामाचे दैनंदिन आणि रोजगार बाबी केंद्रस्थानी. आरोग्य समस्या उद्भवू शकतात आणि सुटू शकतात. शत्रू किंवा वाद उद्भवतात. कर्जे फेडली जातात. सेवाकार्य यशस्वी होते.', ta: 'கன்னி தசை — சேவை, ஆரோக்கிய-மையக் காலம். பணி நடைமுறைகள், வேலைவாய்ப்பு விஷயங்கள் மையமானவை. உடல்நலப் பிரச்சினைகள் எழலாம், தீர்க்கப்படலாம். எதிரிகள், தகராறுகள் வெளிப்படும். கடன்கள் தீர்க்கப்படும். சேவை நடவடிக்கைகள் வெற்றி பெறும்.', te: 'కన్య దశ — సేవ, ఆరోగ్య-కేంద్రిత కాలం. పని దినచర్యలు, ఉద్యోగ విషయాలు కేంద్రంలో. ఆరోగ్య సమస్యలు తలెత్తవచ్చు, పరిష్కారమవచ్చు. శత్రువులు, వివాదాలు ఉద్భవిస్తాయి. అప్పులు తీర్చబడతాయి. సేవా కార్యకలాపాలు విజయవంతమవుతాయి.', bn: 'কন্যা দশা — সেবা, স্বাস্থ্য-কেন্দ্রিক কাল। কাজের দৈনন্দিন ও কর্মসংস্থান বিষয় কেন্দ্রীয়। স্বাস্থ্য সমস্যা দেখা দিতে ও সমাধান হতে পারে। শত্রু বা বিবাদ উদ্ভূত হয়। ঋণ পরিশোধ হয়। সেবামূলক কাজ সফল হয়।', kn: 'ಕನ್ಯಾ ದಶೆ — ಸೇವೆ, ಆರೋಗ್ಯ-ಕೇಂದ್ರಿತ ಅವಧಿ. ಕೆಲಸದ ದಿನಚರಿ ಮತ್ತು ಉದ್ಯೋಗ ವಿಷಯಗಳು ಕೇಂದ್ರದಲ್ಲಿ. ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು ಉದ್ಭವಿಸಬಹುದು ಮತ್ತು ಪರಿಹಾರವಾಗಬಹುದು. ಶತ್ರುಗಳು, ವಿವಾದಗಳು ಹುಟ್ಟುತ್ತವೆ. ಸಾಲಗಳು ತೀರಿಸಲಾಗುತ್ತವೆ. ಸೇವಾ ಚಟುವಟಿಕೆಗಳು ಯಶಸ್ವಿ.', gu: 'કન્યા દશા — સેવા, આરોગ્ય-કેન્દ્રિત કાળ. કામકાજની દિનચર્યા અને રોજગાર બાબતો કેન્દ્રમાં. આરોગ્ય સમસ્યાઓ ઊભી થઈ શકે અને ઉકેલાઈ શકે. શત્રુ કે વિવાદ ઊભા થાય. દેવું ચૂકવાય. સેવાકાર્ય સફળ થાય.' },
  7:  { en: 'Libra Dasha — partnership, justice-seeking period. Marriage, business partnerships, and legal agreements dominate. Travel is prominent. Balance and fairness are sought in all dealings. Collaborative ventures succeed; solo efforts struggle. Venus-ruled pleasures abound. Legal settlements or court matters may conclude.', hi: 'तुला दशा — साझेदारी, न्याय-साधना काल। विवाह, व्यापारिक साझेदारी और कानूनी समझौते प्रमुख। यात्रा महत्वपूर्ण। सहयोगी उद्यम सफल। वीनस-प्रभावित सुख प्रचुर। कानूनी निपटान संभव।', sa: 'तुलादशा — साझेदारी, न्यायसाधनं कालखण्डम्। विवाहः, वाणिज्यसाझेदारी, विधिसमझौताश्च प्रमुखाः। यात्रा महत्त्वपूर्णा। सहयोगिउद्यमाः सफलाः। शुक्रशासितसुखानि प्रचुराणि। विधिनिपटानं सम्भवम्।', mai: 'तुला दशा — साझेदारी, न्याय-साधना काल। बियाह, व्यापारिक साझेदारी आ कानूनी समझौता प्रमुख। यात्रा महत्वपूर्ण। सहयोगी उद्यम सफल। शुक्र-प्रभावित सुख प्रचुर। कानूनी निपटान संभव।', mr: 'तुला दशा — भागीदारी, न्यायसाधना कालखंड. विवाह, व्यापारी भागीदारी आणि कायदेशीर करार प्रमुख. प्रवास महत्त्वाचा. सहयोगी उपक्रम यशस्वी. शुक्र-प्रभावित सुखे मुबलक. कायदेशीर निपटारा शक्य.', ta: 'துலா தசை — கூட்டாண்மை, நீதி-நாடும் காலம். திருமணம், வணிகக் கூட்டாண்மை, சட்ட ஒப்பந்தங்கள் முதன்மை. பயணம் முக்கியம். கூட்டு முயற்சிகள் வெற்றி. சுக்கிரன் ஆளும் இன்பங்கள் நிறைவு. சட்ட நிவாரணங்கள் முடிவடையலாம்.', te: 'తులా దశ — భాగస్వామ్యం, న్యాయసాధన కాలం. వివాహం, వ్యాపార భాగస్వామ్యం, చట్టపరమైన ఒప్పందాలు ప్రధానం. ప్రయాణం ముఖ్యం. సహకార ప్రయత్నాలు విజయవంతం. శుక్ర-పాలిత సుఖాలు సమృద్ధి. చట్టపరమైన పరిష్కారాలు సాధ్యం.', bn: 'তুলা দশা — অংশীদারিত্ব, ন্যায়সাধনা কাল। বিবাহ, ব্যবসায়িক অংশীদারিত্ব ও আইনি চুক্তি প্রধান। যাত্রা গুরুত্বপূর্ণ। সহযোগী উদ্যোগ সফল। শুক্র-শাসিত সুখ প্রচুর। আইনি নিষ্পত্তি সম্ভব।', kn: 'ತುಲಾ ದಶೆ — ಪಾಲುದಾರಿಕೆ, ನ್ಯಾಯಸಾಧನೆ ಅವಧಿ. ವಿವಾಹ, ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆ, ಕಾನೂನು ಒಪ್ಪಂದಗಳು ಪ್ರಮುಖ. ಪ್ರಯಾಣ ಮಹತ್ವದ್ದು. ಸಹಯೋಗಿ ಉದ್ಯಮಗಳು ಯಶಸ್ವಿ. ಶುಕ್ರ-ಆಡಳಿತದ ಸುಖಗಳು ಸಮೃದ್ಧ. ಕಾನೂನು ಪರಿಹಾರ ಸಾಧ್ಯ.', gu: 'તુલા દશા — ભાગીદારી, ન્યાય-સાધના કાળ. લગ્ન, વ્યાપારી ભાગીદારી અને કાયદાકીય કરારો મુખ્ય. મુસાફરી મહત્વપૂર્ણ. સહયોગી ઉપક્રમો સફળ. શુક્ર-પ્રભાવિત સુખ પ્રચુર. કાયદાકીય નિવારણ શક્ય.' },
  8:  { en: 'Scorpio Dasha — transformative, crisis-prone period. Hidden matters surface; secrets are revealed. Inheritance, insurance, or joint finances may be involved. Accidents, surgeries, or near-death experiences are possible if 8th lord is afflicted. Occult research and spiritual depth are favoured. Profound inner transformation accompanies outer disruption.', hi: 'वृश्चिक दशा — परिवर्तनकारी, संकट-सम्भावित काल। छिपे विषय उजागर; रहस्य प्रकट। विरासत, बीमा या संयुक्त वित्त जुड़ा। दुर्घटना या शल्य संभव। आध्यात���मिक गहराई अनुकूल। बाहरी उथल-पुथल के साथ गहरा आंतरिक परिवर्तन।', sa: 'वृश्चिकदशा — परिवर्तनशीलं संकटसम्भावितं कालखण्डम्। गुप्तविषयाः उद्घाट्यन्ते; रहस्यानि प्रकटीभवन्ति। दायभागः, विमा, संयुक्तवित्तं सम्बद्धम्। दुर्घटना शल्यं वा सम्भवम्। गूढविद्याध्ययनम् आध्यात्मिकगम्भीरता च अनुकूला।', mai: 'वृश्चिक दशा — परिवर्तनकारी, संकट-संभावित काल। छिपल विषय उजागर; रहस्य प्रकट। विरासत, बीमा वा संयुक्त वित्तसँ जुड़ल। दुर्घटना वा शल्य संभव। आध्यात्मिक गहराई अनुकूल। बाहरी उथल-पुथलक संग गहन आंतरिक परिवर्तन।', mr: 'वृश्चिक दशा — परिवर्तनकारी, संकट-शक्य कालखंड. लपलेल्या बाबी उघडकीस येतात; रहस्ये उघड होतात. वारसा, विमा किंवा संयुक्त आर्थिक व्यवहार. अपघात किंवा शस्त्रक्रिया शक्य. गूढविद्या आणि आध्यात्मिक खोली अनुकूल. बाह्य गोंधळासोबत सखोल आंतरिक परिवर्तन.', ta: 'விருச்சிக தசை — உருமாற்ற, நெருக்கடிக் காலம். மறைந்த விஷயங்கள் வெளிவரும்; இரகசியங்கள் தெரியவரும். பரம்பரைச் சொத்து, காப்பீடு, கூட்டு நிதி தொடர்புடையது. விபத்து, அறுவை சிகிச்சை சாத்தியம். மறை ஆய்வும் ஆன்மிக ஆழமும் சாதகம். வெளிப்புற குழப்பத்துடன் ஆழமான உள்நிலை மாற்றம்.', te: 'వృశ్చిక దశ — పరివర్తనాత్మక, సంక్షోభ-సంభావిత కాలం. దాగిన విషయాలు బయటపడతాయి; రహస్యాలు వెల్లడవుతాయి. వారసత్వం, బీమా, సంయుక్త ఆర్థిక వ్యవహారాలు సంబంధం. ప్రమాదాలు, శస్త్రచికిత్సలు సాధ్యం. రహస్య విద్య, ఆధ్యాత్మిక లోతు అనుకూలం.', bn: 'বৃশ্চিক দশা — পরিবর্তনশীল, সংকট-সম্ভাবিত কাল। লুকানো বিষয় প্রকাশিত হয়; রহস্য উন্মোচিত। উত্তরাধিকার, বিমা বা যৌথ অর্থনীতি জড়িত। দুর্ঘটনা বা অস্ত্রোপচার সম্ভব। গোপনবিদ্যা ও আধ্যাত্মিক গভীরতা অনুকূল।', kn: 'ವೃಶ್ಚಿಕ ದಶೆ — ಪರಿವರ್ತನಾತ್ಮಕ, ಸಂಕಷ್ಟ-ಸಂಭಾವ್ಯ ಅವಧಿ. ಅಡಗಿದ ವಿಷಯಗಳು ಬೆಳಕಿಗೆ ಬರುತ್ತವೆ; ರಹಸ್ಯಗಳು ಬಹಿರಂಗವಾಗುತ್ತವೆ. ಉತ್ತರಾಧಿಕಾರ, ವಿಮೆ, ಜಂಟಿ ಹಣಕಾಸು ಸಂಬಂಧಿತ. ಅಪಘಾತ ಅಥವಾ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಸಾಧ್ಯ. ಗುಪ್ತವಿದ್ಯೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಆಳ ಅನುಕೂಲ.', gu: 'વૃશ્ચિક દશા — પરિવર્તનકારી, સંકટ-સંભાવિત કાળ. છુપાયેલી બાબતો ઉજાગર થાય; રહસ્યો પ્રગટ થાય. વારસો, વીમો કે સંયુક્ત નાણાં સંબંધિત. અકસ્માત કે શસ્ત્રક્રિયા શક્ય. ગૂઢવિદ્યા અને આધ્યાત્મિક ઊંડાણ અનુકૂળ.' },
  9:  { en: 'Sagittarius Dasha — expansive, dharmic period. Higher education, philosophy, and long-distance travel feature prominently. Father\'s health and teacher/guru influence are strong. Religious activities, foreign journeys, and charitable work flourish. Optimism expands; fortune smiles. The native reaches beyond familiar boundaries and grows.', hi: 'धनु दशा — विस्तारशील, धार्मिक काल। उच्च शिक्षा, दर्शन और दूर यात्राएं प्रमुख। पिता का स्वास्थ्य और गुरु का प्रभाव बलवान। धार्मिक कार्य, विदेश यात्रा फलती है। आशावाद बढ़ता है। परिचित सीमाओं से परे जाना।' },
  10: { en: 'Capricorn Dasha — career-peak, ambition-activated period. Professional life demands maximum effort and delivers maximum reward when Saturn is strong. Government dealings, structured work, and long-term projects bear fruit. Property gains are possible. Discipline and perseverance are the keys — karmic lessons from past effort arrive as results.', hi: 'मकर दशा — कैरियर शिखर, महत्वाकांक्षा-सक्रिय काल। व्यावसायिक जी���न अधिकतम प्रयास मांगता और देता है। सरकारी कार्य, दीर्घकालिक परियोजनाएं फलती हैं। अनुशासन और अध्यवसाय मुख्य कुंजी।', sa: 'मकरदशा — वृत्तिशिखरं महत्त्वाकाङ्क्षासक्रियं कालखण्डम्। व्यावसायिकजीवनं अधिकतमप्रयत्नं याचते अधिकतमफलं च ददाति। शासकीयकार्याणि, दीर्घकालिकपरियोजनाः फलन्ति। अनुशासनं अध्यवसायश्च मुख्यकुञ्जिका।', mai: 'मकर दशा — कैरियर शिखर, महत्वाकांक्षा-सक्रिय काल। पेशेवर जीवन अधिकतम प्रयास माँगैत अछि आ देत अछि। सरकारी काज, दीर्घकालिक परियोजना फलैत अछि। अनुशासन आ अध्यवसाय मुख्य कुंजी।', mr: 'मकर दशा — व्यवसायाची शिखरे, महत्त्वाकांक्षा-सक्रिय कालखंड. व्यावसायिक जीवन जास्तीत जास्त प्रयत्नांची मागणी करते आणि देते. सरकारी कामे, दीर्घकालीन प्रकल्प फळतात. शिस्त आणि चिकाटी ही मुख्य किल्ली.', ta: 'மகர தசை — தொழில் உச்சம், லட்சிய-செயல்பாட்டுக் காலம். தொழில் வாழ்க்கை அதிகபட்ச முயற்சியைக் கோருகிறது, வெகுமதி அளிக்கிறது. அரசாங்க வேலைகள், நீண்டகால திட்டங்கள் பலன் தரும். ஒழுக்கமும் விடாமுயற்சியும் முக்கிய திறவுகோல்.', te: 'మకర దశ — వృత్తి శిఖరం, ఆశయ-సక్రియ కాలం. వృత్తిపరమైన జీవితం గరిష్ట ప్రయత్నాన్ని కోరుతుంది, ఫలితాన్ని ఇస్తుంది. ప్రభుత్వ వ్యవహారాలు, దీర్ఘకాలిక ప్రాజెక్టులు ఫలిస్తాయి. క్రమశిక్షణ, పట్టుదల కీలకం.', bn: 'মকর দশা — পেশার শীর্ষ, উচ্চাকাঙ্ক্ষা-সক্রিয় কাল। পেশাগত জীবন সর্বোচ্চ প্রচেষ্টা দাবি করে ও ফল দেয়। সরকারি কাজ, দীর্ঘমেয়াদি প্রকল্প ফলে। শৃঙ্খলা ও অধ্যবসায় মূল চাবিকাঠি।', kn: 'ಮಕರ ದಶೆ — ವೃತ್ತಿ ಶಿಖರ, ಮಹತ್ವಾಕಾಂಕ್ಷೆ-ಸಕ್ರಿಯ ಅವಧಿ. ವೃತ್ತಿಪರ ಜೀವನ ಗರಿಷ್ಠ ಪ್ರಯತ್ನವನ್ನು ಕೋರುತ್ತದೆ ಮತ್ತು ಫಲವನ್ನು ನೀಡುತ್ತದೆ. ಸರ್ಕಾರಿ ಕೆಲಸಗಳು, ದೀರ್ಘಕಾಲಿಕ ಯೋಜನೆಗಳು ಫಲಿಸುತ್ತವೆ. ಶಿಸ್ತು ಮತ್ತು ಪರಿಶ್ರಮ ಪ್ರಮುಖ ಕೀಲಿಕೈ.', gu: 'મકર દશા — વ્યવસાયની ટોચ, મહત્વાકાંક્ષા-સક્રિય કાળ. વ્યાવસાયિક જીવન મહત્તમ પ્રયત્ન માગે અને ફળ આપે. સરકારી કામ, લાંબા ગાળાના પ્રોજેક્ટ ફળે. શિસ્ત અને ખંત મુખ્ય ચાવી.' },
  11: { en: 'Aquarius Dasha — social, gain-oriented period. Community involvement, friendship networks, and collective causes are activated. Gains from groups, elder siblings, and unexpected sources arrive. Unconventional events and sudden opportunities appear. Technology and innovation benefit the native. Ambitions find fulfilment through social means.', hi: '��ुंभ दशा — सामाजिक, लाभ-उन्मुख काल। समुदाय, मित्र नेटवर्क और सामूहिक कारण सक्रि��। समूहों से लाभ। अप्रत्याशित घटनाएं और अवसर। प्रौद्योगिकी और नवाचार लाभकारी। सामाजिक साधनों से महत्वाकांक्षा पूरी।', sa: 'कुम्भदशा — सामाजिकं लाभोन्मुखं कालखण्डम्। समुदायसहभागिता, मित्रजालं, सामूहिककारणानि सक्रियाणि। समूहेभ्यः लाभः। अप्रत्याशितघटनाः अवसराश्च। प्रौद्योगिकी नवाचारश्च लाभकराः।', mai: 'कुम्भ दशा — सामाजिक, लाभ-उन्मुख काल। समुदाय, मित्र नेटवर्क आ सामूहिक कारण सक्रिय। समूहसँ लाभ। अप्रत्याशित घटना आ अवसर। प्रौद्योगिकी आ नवाचार लाभकारी।', mr: 'कुंभ दशा — सामाजिक, लाभ-उन्मुख कालखंड. समुदाय, मित्र जाळे आणि सामूहिक कारणे सक्रिय. गटांकडून लाभ. अनपेक्षित घटना आणि संधी. तंत्रज्ञान आणि नवकल्पना लाभदायक.', ta: 'கும்ப தசை — சமூக, லாப-நோக்குக் காலம். சமூக ஈடுபாடு, நட்பு வலையமைப்பு, கூட்டு நோக்கங்கள் செயல்படும். குழுக்களிலிருந்து லாபம். எதிர்பாராத நிகழ்வுகளும் வாய்ப்புகளும். தொழில்நுட்பம், புதுமை பயனளிக்கும்.', te: 'కుంభ దశ — సామాజిక, లాభ-ఆధారిత కాలం. సమాజ భాగస్వామ్యం, స్నేహ నెట్‌వర్క్‌లు, సమిష్టి కారణాలు సక్రియం. సమూహాల నుండి లాభం. అనూహ్య సంఘటనలు, అవకాశాలు. సాంకేతికత, ఆవిష్కరణ ప్రయోజనకరం.', bn: 'কুম্ভ দশা — সামাজিক, লাভ-মুখী কাল। সম্প্রদায়, বন্ধু নেটওয়ার্ক ও সমষ্টিগত কারণ সক্রিয়। দল থেকে লাভ। অপ্রত্যাশিত ঘটনা ও সুযোগ। প্রযুক্তি ও উদ্ভাবন লাভজনক।', kn: 'ಕುಂಭ ದಶೆ — ಸಾಮಾಜಿಕ, ಲಾಭ-ಆಧಾರಿತ ಅವಧಿ. ಸಮುದಾಯ ಭಾಗವಹಿಸುವಿಕೆ, ಸ್ನೇಹ ಜಾಲ, ಸಮಷ್ಟಿ ಕಾರಣಗಳು ಸಕ್ರಿಯ. ಗುಂಪುಗಳಿಂದ ಲಾಭ. ಅನಿರೀಕ್ಷಿತ ಘಟನೆಗಳು ಮತ್ತು ಅವಕಾಶಗಳು. ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ನಾವೀನ್ಯತೆ ಲಾಭಕರ.', gu: 'કુંભ દશા — સામાજિક, લાભ-લક્ષી કાળ. સમુદાય, મિત્ર નેટવર્ક અને સામૂહિક કારણો સક્રિય. જૂથોમાંથી લાભ. અણધાર્યા ઘટનાઓ અને તકો. ટેકનોલોજી અને નવીનતા લાભકારી.' },
  12: { en: 'Pisces Dasha — spiritual, introspective period. Foreign travel, ashrams, hospitals, and retreats feature. Intuition and psychic gifts peak. Hidden losses are possible but offset by spiritual gains. Charitable work and service to the suffering are favoured. The soul turns inward — those who embrace this find liberation; those who resist find confusion.', hi: 'मीन दशा — आध्यात्मिक, आत्मनिरीक्षण काल। विदेश, आश्रम, अस्पताल और एकांत प्रमुख। अंतर्ज्ञान शिखर पर। छिपे नुकसान संभव। दान और पीड़ितों की सेवा अनुकूल। आत्मा अंतर्मुखी होती है — जो स्वीकारते हैं उन्हें मुक्ति, जो विरोध करते हैं उन्हें भ्रम।', sa: 'मीनदशा — आध्यात्मिकं आत्मनिरीक्षणं कालखण्डम्। विदेशयात्रा, आश्रमः, चिकित्सालयः, एकान्तश्च प्रमुखाः। अन्तर्ज्ञानं शिखरे। गुप्तहानिः सम्भवा किन्तु आध्यात्मिकलाभेन प्रतिपूरिता। दानं पीडितसेवा च अनुकूला।', mai: 'मीन दशा — आध्यात्मिक, आत्मनिरीक्षण काल। विदेश, आश्रम, अस्पताल आ एकान्त प्रमुख। अन्तर्ज्ञान शिखर पर। छिपल नुकसान सम्भव। दान आ पीड़ितक सेवा अनुकूल। जे स्वीकार करैत छथि ओकरा मुक्ति; जे विरोध करैत छथि ओकरा भ्रम।', mr: 'मीन दशा — आध्यात्मिक, आत्मपरीक्षण कालखंड. परदेश, आश्रम, रुग्णालय आणि एकांत प्रमुख. अंतर्ज्ञान शिखरावर. छुपे नुकसान शक्य. दान आणि पीडितांची सेवा अनुकूल. जे स्वीकारतात त्यांना मुक्ती; जे विरोध करतात त्यांना गोंधळ.', ta: 'மீன தசை — ஆன்மிக, சுய ஆய்வுக் காலம். வெளிநாட்டுப் பயணம், ஆசிரமம், மருத்துவமனை, தனிமை முதன்மை. உள்ளுணர்வு உச்சத்தில். மறைவான இழப்புகள் சாத்தியம் ஆனால் ஆன்மிக ஆதாயத்தால் ஈடுசெய்யப்படும். தானம், துன்பப்படுவோருக்கு சேவை சாதகம்.', te: 'మీన దశ — ఆధ్యాత్మిక, ఆత్మపరిశీలన కాలం. విదేశ ప్రయాణం, ఆశ్రమం, ఆసుపత్రి, ఏకాంతం ప్రధానం. అంతర్దృష్టి శిఖరంలో. దాగిన నష్టాలు సాధ్యం కానీ ఆధ్యాత్మిక లాభంతో భర్తీ. దానం, బాధితుల సేవ అనుకూలం.', bn: 'মীন দশা — আধ্যাত্মিক, আত্মনিরীক্ষণ কাল। বিদেশ, আশ্রম, হাসপাতাল ও নির্জনতা প্রধান। অন্তর্জ্ঞান শীর্ষে। গোপন ক্ষতি সম্ভব কিন্তু আধ্যাত্মিক লাভে পূরিত। দান ও দুঃখীদের সেবা অনুকূল।', kn: 'ಮೀನ ದಶೆ — ಆಧ್ಯಾತ್ಮಿಕ, ಆತ್ಮಪರಿಶೀಲನೆ ಅವಧಿ. ವಿದೇಶ ಪ್ರಯಾಣ, ಆಶ್ರಮ, ಆಸ್ಪತ್ರೆ ಮತ್ತು ಏಕಾಂತ ಪ್ರಮುಖ. ಅಂತರ್ಜ್ಞಾನ ಉತ್ತುಂಗದಲ್ಲಿ. ಗುಪ್ತ ನಷ್ಟ ಸಾಧ್ಯ ಆದರೆ ಆಧ್ಯಾತ್ಮಿಕ ಲಾಭದಿಂದ ಸರಿತೂಗಿಸಲಾಗುತ್ತದೆ. ದಾನ ಮತ್ತು ನೊಂದವರ ಸೇವೆ ಅನುಕೂಲ.', gu: 'મીન દશા — આધ્યાત્મિક, આત્મનિરીક્ષણ કાળ. વિદેશ, આશ્રમ, હોસ્પિટલ અને એકાંત મુખ્ય. અંતર્જ્ઞાન ટોચ પર. છુપાયેલું નુકસાન શક્ય પણ આધ્યાત્મિક લાભથી વળતર. દાન અને પીડિતોની સેવા અનુકૂળ.' },
};

const GANDA_MULA_DATA: Record<number, { type: LocaleText; affected: LocaleText; procedure: LocaleText }> = {
  1:  { type: { en: 'Ketu-ruled (Ashwini)', hi: 'केतु-शासित (अश्विनी)', sa: 'केतु-शासित (अश्विनी)', mai: 'केतु-शासित (अश्विनी)', mr: 'केतु-शासित (अश्विनी)', ta: 'கேது ஆட்சி (அஸ்வினி)', te: 'కేతు పాలిత (అశ్విని)', bn: 'কেতু শাসিত (অশ্বিনী)', kn: 'ಕೇತು ಆಳ್ವಿಕೆ (ಅಶ್ವಿನಿ)', gu: 'કેતુ શાસિત (અશ્વિની)' }, affected: { en: 'Father', hi: 'पिता', sa: 'पिता', mai: 'पिता', mr: 'पिता', ta: 'தந்தை', te: 'తండ్రి', bn: 'পিতা', kn: 'ತಂದೆ', gu: 'પિતા' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा', sa: '27वें दिन शांति पूजा', mai: '27वें दिन शांति पूजा', mr: '27वें दिन शांति पूजा', ta: '27வது நாள் சாந்தி பூஜை', te: '27వ రోజు శాంతి పూజ', bn: '27তম দিনে শান্তি পূজা', kn: '27ನೇ ದಿನ ಶಾಂತಿ ಪೂಜೆ', gu: '27મા દિવસે શાંતિ પૂજા' } },
  10: { type: { en: 'Ketu-ruled (Magha)', hi: 'केतु-शासित (मघा)', sa: 'केतु-शासित (मघा)', mai: 'केतु-शासित (मघा)', mr: 'केतु-शासित (मघा)', ta: 'கேது ஆட்சி (மகம்)', te: 'కేతు పాలిత (మఘ)', bn: 'কেতু শাসিত (মঘা)', kn: 'ಕೇತು ಆಳ್ವಿಕೆ (ಮಘಾ)', gu: 'કેતુ શાસિત (મઘા)' }, affected: { en: 'Father', hi: 'पिता', sa: 'पिता', mai: 'पिता', mr: 'पिता', ta: 'தந்தை', te: 'తండ్రి', bn: 'পিতা', kn: 'ತಂದೆ', gu: 'પિતા' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा', sa: '27वें दिन शांति पूजा', mai: '27वें दिन शांति पूजा', mr: '27वें दिन शांति पूजा', ta: '27வது நாள் சாந்தி பூஜை', te: '27వ రోజు శాంతి పూజ', bn: '27তম দিনে শান্তি পূজা', kn: '27ನೇ ದಿನ ಶಾಂತಿ ಪೂಜೆ', gu: '27મા દિવસે શાંતિ પૂજા' } },
  19: { type: { en: 'Ketu-ruled (Moola)', hi: 'केतु-शासित (मूल)', sa: 'केतु-शासित (मूल)', mai: 'केतु-शासित (मूल)', mr: 'केतु-शासित (मूल)', ta: 'கேது ஆட்சி (மூலம்)', te: 'కేతు పాలిత (మూల)', bn: 'কেতু শাসিত (মূলা)', kn: 'ಕೇತು ಆಳ್ವಿಕೆ (ಮೂಲಾ)', gu: 'કેતુ શાસિત (મૂળ)' }, affected: { en: 'Father-in-law', hi: 'ससुर', sa: 'ससुर', mai: 'ससुर', mr: 'ससुर', ta: 'மாமனார்', te: 'మామగారు', bn: 'শ্বশুর', kn: 'ಮಾವ', gu: 'સસરા' }, procedure: { en: 'Most intense Ganda Mula. Shanti havan recommended within 27 days.', hi: 'सबसे तीव्र गण्ड मूल। 27 दिनों के भीतर शांति हवन अनुशंसित।', sa: 'सबसे तीव्र गण्ड मूल। 27 दिनों के भीतर शांति हवन अनुशंसित।', mai: 'सबसे तीव्र गण्ड मूल। 27 दिनों के भीतर शांति हवन अनुशंसित।', mr: 'सबसे तीव्र गण्ड मूल। 27 दिनों के भीतर शांति हवन अनुशंसित।', ta: 'மிகத் தீவிர கண்ட மூலம். 27 நாட்களுக்குள் சாந்தி ஹவன் பரிந்துரைக்கப்படுகிறது.', te: 'అత్యంత తీవ్ర గండ మూల. 27 రోజులలో శాంతి హవనం సిఫార్సు.', bn: 'সবচেয়ে তীব্র গণ্ড মূল। 27 দিনের মধ্যে শান্তি হবন অনুশংসিত।', kn: 'ಅತ್ಯಂತ ತೀವ್ರ ಗಂಡ ಮೂಲ. 27 ದಿನಗಳೊಳಗೆ ಶಾಂತಿ ಹವನ ಶಿಫಾರಸು.', gu: 'સૌથી તીવ્ર ગંડ મૂળ. 27 દિવસમાં શાંતિ હવન ભલામણ.' } },
  9:  { type: { en: 'Mercury-ruled (Ashlesha)', hi: 'बुध-शासित (आश्लेषा)', sa: 'बुध-शासित (आश्लेषा)', mai: 'बुध-शासित (आश्लेषा)', mr: 'बुध-शासित (आश्लेषा)', ta: 'புதன் ஆட்சி (ஆயில்யம்)', te: 'బుధ పాలిత (ఆశ్లేష)', bn: 'বুধ শাসিত (আশ্লেষা)', kn: 'ಬುಧ ಆಳ್ವಿಕೆ (ಆಶ್ಲೇಷಾ)', gu: 'બુધ શાસિત (આશ્લેષા)' }, affected: { en: 'Mother-in-law', hi: 'सास', sa: 'सास', mai: 'सास', mr: 'सास', ta: 'மாமியார்', te: 'అత్తగారు', bn: 'শাশুড়ি', kn: 'ಅತ್ತೆ', gu: 'સાસુ' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा', sa: '27वें दिन शांति पूजा', mai: '27वें दिन शांति पूजा', mr: '27वें दिन शांति पूजा', ta: '27வது நாள் சாந்தி பூஜை', te: '27వ రోజు శాంతి పూజ', bn: '27তম দিনে শান্তি পূজা', kn: '27ನೇ ದಿನ ಶಾಂತಿ ಪೂಜೆ', gu: '27મા દિવસે શાંતિ પૂજા' } },
  18: { type: { en: 'Mercury-ruled (Jyeshtha)', hi: 'बुध-शासित (ज्येष्ठा)', sa: 'बुध-शासित (ज्येष्ठा)', mai: 'बुध-शासित (ज्येष्ठा)', mr: 'बुध-शासित (ज्येष्ठा)', ta: 'புதன் ஆட்சி (கேட்டை)', te: 'బుధ పాలిత (జ్యేష్ఠ)', bn: 'বুধ শাসিত (জ্যেষ্ঠা)', kn: 'ಬುಧ ಆಳ್ವಿಕೆ (ಜ್ಯೇಷ್ಠಾ)', gu: 'બુધ શાસિત (જ્યેષ્ઠા)' }, affected: { en: 'Elder brother', hi: 'बड़ा भाई', sa: 'बड़ा भाई', mai: 'बड़ा भाई', mr: 'बड़ा भाई', ta: 'மூத்த சகோதரன்', te: 'అన్న', bn: 'বড় ভাই', kn: 'ಅಣ್ಣ', gu: 'મોટો ભાઈ' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा', sa: '27वें दिन शांति पूजा', mai: '27वें दिन शांति पूजा', mr: '27वें दिन शांति पूजा', ta: '27வது நாள் சாந்தி பூஜை', te: '27వ రోజు శాంతి పూజ', bn: '27তম দিনে শান্তি পূজা', kn: '27ನೇ ದಿನ ಶಾಂತಿ ಪೂಜೆ', gu: '27મા દિવસે શાંતિ પૂજા' } },
  27: { type: { en: 'Mercury-ruled (Revati)', hi: 'बुध-शासित (रेवती)', sa: 'बुध-शासित (रेवती)', mai: 'बुध-शासित (रेवती)', mr: 'बुध-शासित (रेवती)', ta: 'புதன் ஆட்சி (ரேவதி)', te: 'బుధ పాలిత (రేవతి)', bn: 'বুধ শাসিত (রেবতী)', kn: 'ಬುಧ ಆಳ್ವಿಕೆ (ರೇವತಿ)', gu: 'બુધ શાસિત (રેવતી)' }, affected: { en: 'Mother', hi: 'माता', sa: 'माता', mai: 'माता', mr: 'माता', ta: 'தாய்', te: 'తల్లి', bn: 'মাতা', kn: 'ತಾಯಿ', gu: 'માતા' }, procedure: { en: 'Generally mild; simple Ganesha puja suffices.', hi: 'सामान्यतः सौम्य; साधारण गणेश पूजा पर्याप्त।', sa: 'सामान्यतः सौम्य; साधारण गणेश पूजा पर्याप्त।', mai: 'सामान्यतः सौम्य; साधारण गणेश पूजा पर्याप्त।', mr: 'सामान्यतः सौम्य; साधारण गणेश पूजा पर्याप्त।', ta: 'பொதுவாக லேசானது; எளிய கணேஷ பூஜை போதுமானது.', te: 'సాధారణంగా తేలిక; సాధారణ గణేశ పూజ సరిపోతుంది.', bn: 'সাধারণত মৃদু; সাধারণ গণেশ পূজা যথেষ্ট।', kn: 'ಸಾಮಾನ್ಯವಾಗಿ ಸೌಮ್ಯ; ಸರಳ ಗಣೇಶ ಪೂಜೆ ಸಾಕು.', gu: 'સામાન્ય રીતે હળવું; સાદી ગણેશ પૂજા પર્યાપ્ત.' } },
};

const PLANET_COLORS_SPHUTA: Record<number, string> = {
  0: 'text-amber-400', 1: 'text-slate-300', 2: 'text-red-400', 3: 'text-emerald-400',
  4: 'text-yellow-300', 5: 'text-pink-300', 6: 'text-blue-400', 7: 'text-purple-400', 8: 'text-gray-400',
};

const SIGN_ELEMENTS: Record<number, string> = {
  1: 'Fire', 2: 'Earth', 3: 'Air', 4: 'Water', 5: 'Fire', 6: 'Earth',
  7: 'Air', 8: 'Water', 9: 'Fire', 10: 'Earth', 11: 'Air', 12: 'Water',
};

const SIGN_ELEMENTS_HI: Record<number, string> = {
  1: 'अग्नि', 2: 'पृथ्वी', 3: 'वायु', 4: 'जल', 5: 'अग्नि', 6: 'पृथ्वी',
  7: 'वायु', 8: 'जल', 9: 'अग्नि', 10: 'पृथ्वी', 11: 'वायु', 12: 'जल',
};

function HouseDetailPanel({
  houseNum,
  kundali,
  locale,
  isDevanagari,
  onClose,
}: {
  houseNum: number;
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  onClose: () => void;
}) {
  const isTamil = String(locale) === 'ta';
  const house = kundali.houses.find(h => h.house === houseNum);
  const planetsInHouse = kundali.planets.filter(p => p.house === houseNum);
  const signNum = house?.sign || 1;
  const rashi = RASHIS[signNum - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <RashiIconById id={signNum} size={48} />
          <div>
            <h3 className="text-gold-light text-xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
              {locale === 'en' || isTamil ? `House ${houseNum}` : `भाव ${houseNum}`}
              {houseNum === 1 && <span className="text-gold-primary ml-2 text-sm">({locale === 'en' || isTamil ? 'Ascendant' : 'लग्न'})</span>}
            </h3>
            <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(rashi?.name, locale)} &mdash; {locale === 'en' || isTamil ? 'Lord' : 'स्वामी'}: {tl(house?.lordName, locale)}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-gold-light transition-colors text-xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      {planetsInHouse.length > 0 ? (
        <div className="space-y-3">
          {planetsInHouse.map((p) => (
            <PlanetDetailRow key={p.planet.id} planet={p} locale={locale} isDevanagari={isDevanagari} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary/70 text-center py-4">
          {locale === 'en' || isTamil ? 'No planets in this house' : 'इस भाव में कोई ग्रह नहीं'}
        </p>
      )}

      {/* House significations + layperson personal implication */}
      <div className="mt-4 pt-4 border-t border-gold-primary/10 space-y-3">
        <div>
          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Life Area' : 'जीवन क्षेत्र'}</p>
          <p className="text-text-secondary text-sm">{getHouseSignifications(houseNum, locale)}</p>
        </div>
        <div className="rounded-lg bg-gold-primary/5 border border-gold-primary/15 p-3">
          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1.5">{locale === 'en' || isTamil ? 'What this means for you' : 'आपके लिए इसका अर्थ'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">
            {locale === 'en' || isTamil
              ? planetsInHouse.length === 0
                ? `House ${houseNum} has no planets — its results depend primarily on the condition of its lord (${house?.lordName.en}). Trace ${house?.lordName.en}'s sign and house to understand how this life area performs for you.`
                : planetsInHouse.length === 1
                ? `${planetsInHouse[0].planet.name.en} occupies this house, making it the dominant force in your ${getHouseSignifications(houseNum, 'en').split(',')[0].trim().toLowerCase()} area. ${planetsInHouse[0].isExalted ? `${planetsInHouse[0].planet.name.en} is exalted here — this is a major strength.` : planetsInHouse[0].isDebilitated ? `${planetsInHouse[0].planet.name.en} is debilitated here — this area requires extra effort and attention.` : planetsInHouse[0].isRetrograde ? `${planetsInHouse[0].planet.name.en} is retrograde — results come through reflection, revisiting, and internal processing rather than direct action.` : `${planetsInHouse[0].planet.name.en} directs its themes (${planetsInHouse[0].planet.name.en === 'Sun' ? 'authority, recognition' : planetsInHouse[0].planet.name.en === 'Moon' ? 'emotions, instincts' : planetsInHouse[0].planet.name.en === 'Mars' ? 'drive, courage' : planetsInHouse[0].planet.name.en === 'Mercury' ? 'intellect, communication' : planetsInHouse[0].planet.name.en === 'Jupiter' ? 'wisdom, expansion' : planetsInHouse[0].planet.name.en === 'Venus' ? 'relationships, pleasure' : planetsInHouse[0].planet.name.en === 'Saturn' ? 'discipline, karmic lessons' : planetsInHouse[0].planet.name.en === 'Rahu' ? 'ambition, obsession' : 'spirituality, detachment'}) into this life area.`}`
                : `Multiple planets (${planetsInHouse.map(p => p.planet.name.en).join(', ')}) occupy this house — this life area is highly activated and complex. Expect significant activity, both opportunities and challenges, related to ${getHouseSignifications(houseNum, 'en').split(',').slice(0, 2).join(' and ').toLowerCase()}.`
              : planetsInHouse.length === 0
                ? `भाव ${houseNum} में कोई ग्रह नहीं है — परिणाम मुख्यतः इसके स्वामी (${house?.lordName.hi}) की स्थिति पर निर्भर करते हैं।`
                : planetsInHouse.length === 1
                ? `${planetsInHouse[0].planet.name.hi} इस भाव में है, जो इस जीवन क्षेत्र की प्रमुख शक्ति है। ${planetsInHouse[0].isExalted ? `${planetsInHouse[0].planet.name.hi} उच्च में है — यह एक प्रमुख शक्ति है।` : planetsInHouse[0].isDebilitated ? `${planetsInHouse[0].planet.name.hi} नीच में है — इस क्षेत्र में अतिरिक्त प्रयास चाहिए।` : planetsInHouse[0].isRetrograde ? `${planetsInHouse[0].planet.name.hi} वक्री है — परिणाम आत्म-विचार और पुनरावलोकन से आते हैं।` : `${planetsInHouse[0].planet.name.hi} अपने विषय इस जीवन क्षेत्र में लाता है।`}`
                : `एकाधिक ग्रह (${planetsInHouse.map(p => p.planet.name.hi).join(', ')}) इस भाव में हैं — यह जीवन क्षेत्र अत्यंत सक्रिय और जटिल है।`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PlanetDetailRow({ planet: p, locale, isDevanagari }: { planet: PlanetPosition; locale: Locale; isDevanagari: boolean }) {
  const isTamil = String(locale) === 'ta';
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:border-gold-primary/25 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
      >
        <GrahaIconById id={p.planet.id} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
              {tl(p.planet.name, locale)}
            </span>
            {p.isRetrograde && <span className="text-red-400 text-xs font-bold px-1.5 py-0.5 bg-red-500/10 rounded">R</span>}
            {p.isExalted && <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">{locale === 'en' || isTamil ? 'Exalted' : 'उच्च'}</span>}
            {p.isDebilitated && <span className="text-orange-400 text-xs font-bold px-1.5 py-0.5 bg-orange-500/10 rounded">{locale === 'en' || isTamil ? 'Debilitated' : 'नीच'}</span>}
            {p.isOwnSign && <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">{locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह'}</span>}
            {p.isVargottama && <span className="text-gold-light text-xs font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30" title={locale === 'en' || isTamil ? 'Strength equal to double exaltation — same sign in D1 and D9' : 'वर्गोत्तम — D1 और D9 में एक ही राशि'}>Vgm</span>}
            {p.isMrityuBhaga && <span className="text-rose-400 text-xs font-bold px-1.5 py-0.5 bg-rose-500/10 rounded" title={locale === 'en' || isTamil ? 'At or near Mrityu Bhaga — dangerous degree, severely weakened' : 'मृत्यु भाग — खतरनाक अंश, बल में गिरावट'}>MB</span>}
            {p.isPushkarNavamsha && <span className="text-sky-300 text-xs font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20" title={locale === 'en' || isTamil ? 'Pushkar Navamsha — supremely auspicious navamsha position' : 'पुष्कर नवांश — अत्यंत शुभ नवांश स्थिति'}>Pushkar Nav.</span>}
            {p.isPushkarBhaga && <span className="text-emerald-300 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-400/20" title={locale === 'en' || isTamil ? 'Pushkar Bhaga — most auspicious degree in the sign. Greatly strengthens this planet.' : 'पुष्कर भाग — राशि में सर्वाधिक शुभ अंश। ग्रह को अत्यंत बल मिलता है।'}>Pushkar Bh.</span>}
          </div>
          <div className="text-text-secondary text-xs mt-0.5">
            <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(p.signName, locale)}</span>
            <span className="mx-1.5 text-gold-dark/30">|</span>
            <span className="font-mono">{p.degree}</span>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 ml-12 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Nakshatra' : 'नक्षत्र'}</span>
                <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(p.nakshatra.name, locale)} ({locale === 'en' || isTamil ? 'Pada' : 'पाद'} {p.pada})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Speed' : 'गति'}</span>
                <span className="text-text-secondary font-mono">{p.speed.toFixed(4)}°/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Longitude' : 'अंश'}</span>
                <span className="text-text-secondary font-mono">{p.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getHouseSignifications(house: number, locale: Locale): string {
  const isTamil = String(locale) === 'ta';
  const sigs: Record<number, LocaleText> = {
    1: { en: 'Self, personality, physical body, appearance, vitality', hi: 'आत्म, व्यक्तित्व, शरीर, रूप, जीवन शक्ति', sa: 'आत्म, व्यक्तित्व, शरीर, रूप, जीवन शक्ति', mai: 'आत्म, व्यक्तित्व, शरीर, रूप, जीवन शक्ति', mr: 'आत्म, व्यक्तित्व, शरीर, रूप, जीवन शक्ति', ta: 'சுயம், ஆளுமை, உடல், தோற்றம், உயிர்ச்சக்தி', te: 'ఆత్మ, వ్యక్తిత్వం, శరీరం, రూపం, జీవశక్తి', bn: 'আত্ম, ব্যক্তিত্ব, শরীর, রূপ, প্রাণশক্তি', kn: 'ಸ್ವಯಂ, ವ್ಯಕ್ತಿತ್ವ, ದೇಹ, ರೂಪ, ಜೀವಶಕ್ತಿ', gu: 'સ્વ, વ્યક્તિત્વ, શરીર, દેખાવ, જીવનશક્તિ' },
    2: { en: 'Wealth, family, speech, food, early education', hi: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा', sa: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा', mai: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा', mr: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा', ta: 'செல்வம், குடும்பம், பேச்சு, உணவு, ஆரம்பக் கல்வி', te: 'ధనం, కుటుంబం, వాక్కు, ఆహారం, ప్రాథమిక విద్య', bn: 'ধন, পরিবার, বাক্, খাদ্য, প্রাথমিক শিক্ষা', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಕ್, ಆಹಾರ, ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣ', gu: 'ધન, કુટુંબ, વાણી, ભોજન, પ્રારંભિક શિક્ષણ' },
    3: { en: 'Courage, siblings, communication, short journeys', hi: 'साहस, भाई-बहन, संवाद, छोटी यात्राएँ', sa: 'साहस, भाई-बहन, संवाद, छोटी यात्राएँ', mai: 'साहस, भाई-बहन, संवाद, छोटी यात्राएँ', mr: 'साहस, भाई-बहन, संवाद, छोटी यात्राएँ', ta: 'தைரியம், உடன்பிறப்புகள், தகவல்தொடர்பு, குறுகிய பயணங்கள்', te: 'ధైర్యం, తోబుట్టువులు, సంభాషణ, చిన్న ప్రయాణాలు', bn: 'সাহস, ভাইবোন, যোগাযোগ, ছোট যাত্রা', kn: 'ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು, ಸಂವಹನ, ಸಣ್ಣ ಪ್ರಯಾಣ', gu: 'સાહસ, ભાઈ-બહેન, સંવાદ, ટૂંકી મુસાફરી' },
    4: { en: 'Mother, home, property, vehicles, emotional peace', hi: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति', sa: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति', mai: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति', mr: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति', ta: 'தாய், வீடு, சொத்து, வாகனம், மன அமைதி', te: 'తల్లి, ఇల్లు, ఆస్తి, వాహనం, మానసిక శాంతి', bn: 'মাতা, গৃহ, সম্পত্তি, যান, মানসিক শান্তি', kn: 'ತಾಯಿ, ಮನೆ, ಆಸ್ತಿ, ವಾಹನ, ಮಾನಸಿಕ ಶಾಂತಿ', gu: 'માતા, ઘર, સંપત્તિ, વાહન, માનસિક શાંતિ' },
    5: { en: 'Children, intelligence, creativity, romance, past merit', hi: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वपुण्य', sa: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वपुण्य', mai: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वपुण्य', mr: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वपुण्य', ta: 'குழந்தைகள், புத்திசாலித்தனம், படைப்பாற்றல், காதல், முன்வினைப் பயன்', te: 'సంతానం, బుద్ధి, సృజనాత్మకత, ప్రణయం, పూర్వపుణ్యం', bn: 'সন্তান, বুদ্ধি, সৃজনশীলতা, প্রণয়, পূর্বপুণ্য', kn: 'ಮಕ್ಕಳು, ಬುದ್ಧಿ, ಸೃಜನಶೀಲತೆ, ಪ್ರಣಯ, ಪೂರ್ವಪುಣ್ಯ', gu: 'સંતાન, બુદ્ધિ, સર્જનાત્મકતા, પ્રણય, પૂર્વપુણ્ય' },
    6: { en: 'Enemies, disease, debts, service, daily work', hi: 'शत्रु, रोग, ऋण, सेवा, दैनिक कार्य', sa: 'शत्रु, रोग, ऋण, सेवा, दैनिक कार्य', mai: 'शत्रु, रोग, ऋण, सेवा, दैनिक कार्य', mr: 'शत्रु, रोग, ऋण, सेवा, दैनिक कार्य', ta: 'எதிரிகள், நோய், கடன், சேவை, அன்றாட வேலை', te: 'శత్రువులు, రోగం, ఋణం, సేవ, దైనందిన కార్యం', bn: 'শত্রু, রোগ, ঋণ, সেবা, দৈনন্দিন কাজ', kn: 'ಶತ್ರು, ರೋಗ, ಋಣ, ಸೇವೆ, ದೈನಂದಿನ ಕೆಲಸ', gu: 'શત્રુ, રોગ, ઋણ, સેવા, રોજિંદું કાર્ય' },
    7: { en: 'Marriage, partnerships, business, public dealings', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार', sa: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार', mai: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार', mr: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार', ta: 'திருமணம், கூட்டு, வணிகம், பொது வியவகாரம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం, సార్వజనిక వ్యవహారం', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা, জনসম্পর্ক', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ, ಸಾರ್ವಜನಿಕ ವ್ಯವಹಾರ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર, જાહેર વ્યવહાર' },
    8: { en: 'Longevity, transformation, occult, inheritance, obstacles', hi: 'आयु, परिवर्तन, गुप्त विद्या, विरासत, बाधाएँ', sa: 'आयु, परिवर्तन, गुप्त विद्या, विरासत, बाधाएँ', mai: 'आयु, परिवर्तन, गुप्त विद्या, विरासत, बाधाएँ', mr: 'आयु, परिवर्तन, गुप्त विद्या, विरासत, बाधाएँ', ta: 'ஆயுள், மாற்றம், அமானுஷ்யம், வாரிசுரிமை, தடைகள்', te: 'ఆయుష్షు, పరివర్తన, అతీంద్రియం, వారసత్వం, అడ్డంకులు', bn: 'দীর্ঘায়ু, রূপান্তর, গুপ্তবিদ্যা, উত্তরাধিকার, বাধা', kn: 'ಆಯುಷ್ಯ, ಪರಿವರ್ತನೆ, ಗುಪ್ತವಿದ್ಯೆ, ಉತ್ತಾರಾಧಿಕಾರ, ಅಡ್ಡಿ', gu: 'આયુષ્ય, પરિવર્તન, ગૂઢવિદ્યા, વારસો, અવરોધ' },
    9: { en: 'Fortune, dharma, father, higher education, pilgrimage', hi: 'भाग्य, धर्म, पिता, उच्च शिक्षा, तीर्थयात्रा', sa: 'भाग्य, धर्म, पिता, उच्च शिक्षा, तीर्थयात्रा', mai: 'भाग्य, धर्म, पिता, उच्च शिक्षा, तीर्थयात्रा', mr: 'भाग्य, धर्म, पिता, उच्च शिक्षा, तीर्थयात्रा', ta: 'பாக்கியம், தர்மம், தந்தை, உயர்கல்வி, புனித யாத்திரை', te: 'భాగ్యం, ధర్మం, తండ్రి, ఉన్నత విద్య, తీర్థయాత్ర', bn: 'ভাগ্য, ধর্ম, পিতা, উচ্চশিক্ষা, তীর্থযাত্রা', kn: 'ಭಾಗ್ಯ, ಧರ್ಮ, ತಂದೆ, ಉನ್ನತ ಶಿಕ್ಷಣ, ತೀರ್ಥಯಾತ್ರೆ', gu: 'ભાગ્ય, ધર્મ, પિતા, ઉચ્ચ શિક્ષણ, તીર્થયાત્રા' },
    10: { en: 'Career, fame, authority, government, public image', hi: 'करियर, यश, अधिकार, शासन, सार्वजनिक छवि', sa: 'करियर, यश, अधिकार, शासन, सार्वजनिक छवि', mai: 'करियर, यश, अधिकार, शासन, सार्वजनिक छवि', mr: 'करियर, यश, अधिकार, शासन, सार्वजनिक छवि', ta: 'தொழில், புகழ், அதிகாரம், அரசு, பொது அடையாளம்', te: 'వృత్తి, కీర్తి, అధికారం, ప్రభుత్వం, బహిరంగ ప్రతిష్ఠ', bn: 'কর্মজীবন, যশ, কর্তৃত্ব, সরকার, জনমানস', kn: 'ವೃತ್ತಿ, ಕೀರ್ತಿ, ಅಧಿಕಾರ, ಸರ್ಕಾರ, ಸಾರ್ವಜನಿಕ ಮುಖ', gu: 'કારકિર્દી, યશ, સત્તા, સરકાર, જાહેર છબી' },
    11: { en: 'Gains, income, elder siblings, wishes fulfilled', hi: 'लाभ, आय, बड़े भाई-बहन, इच्छा पूर्ति', sa: 'लाभ, आय, बड़े भाई-बहन, इच्छा पूर्ति', mai: 'लाभ, आय, बड़े भाई-बहन, इच्छा पूर्ति', mr: 'लाभ, आय, बड़े भाई-बहन, इच्छा पूर्ति', ta: 'லாபம், வருமானம், மூத்த உடன்பிறப்பு, விருப்ப நிறைவு', te: 'లాభం, ఆదాయం, అన్నదమ్ములు, కోరికల నెరవేర్పు', bn: 'লাভ, আয়, বড় ভাইবোন, ইচ্ছাপূরণ', kn: 'ಲಾಭ, ಆದಾಯ, ಹಿರಿಯ ಒಡಹುಟ್ಟಿದವರು, ಇಷ್ಟ ಸಿದ್ಧಿ', gu: 'લાભ, આવક, મોટા ભાઈ-બહેન, ઇચ્છાપૂર્તિ' },
    12: { en: 'Expenses, losses, foreign lands, liberation, sleep', hi: 'व्यय, हानि, विदेश, मोक्ष, निद्रा', sa: 'व्यय, हानि, विदेश, मोक्ष, निद्रा', mai: 'व्यय, हानि, विदेश, मोक्ष, निद्रा', mr: 'व्यय, हानि, विदेश, मोक्ष, निद्रा', ta: 'செலவு, நஷ்டம், வெளிநாடு, முக்தி, தூக்கம்', te: 'వ్యయం, నష్టం, విదేశం, మోక్షం, నిద్ర', bn: 'ব্যয়, ক্ষতি, বিদেশ, মোক্ষ, নিদ্রা', kn: 'ವ್ಯಯ, ನಷ್ಟ, ವಿದೇಶ, ಮೋಕ್ಷ, ನಿದ್ರೆ', gu: 'ખર્ચ, ખોટ, વિદેશ, મોક્ષ, ઊંઘ' },
  };
  return sigs[house]?.[locale === 'en' || isTamil ? 'en' : 'hi'] || '';
}

export default function KundaliPage() {
  const t = useTranslations('kundali');
  const tTip = useTranslations('tippanni');
  const locale = useLocale() as Locale;
  const isTamil = (locale as string) === 'ta';
  const isBengali = (locale as string) === 'bn';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const L3 = (en: string, hi: string, ta?: string) => isTamil ? (ta || en) : locale === 'en' ? en : hi;

  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [vedicProfile, setVedicProfile] = useState<VedicProfileType | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [savedCharts, setSavedCharts] = useState<Array<{ id: string; label: string; birth_data: { name?: string; date: string; time: string; place: string; lat: number; lng: number; relationship?: string } }>>([]);
  const user = useAuthStore(s => s.user);

  const handleSaveChart = async () => {
    if (!user || !kundali) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    try {
      // Dedupe: skip insert if an identical chart (same name + date + time +
      // location within ~11m) is already saved for this user. The client-side
      // check avoids needless rows and gives immediate "Saved" feedback.
      const normalizedName = (kundali.birthData.name || 'Chart').trim().toLowerCase();
      const { data: existing } = await supabase
        .from('saved_charts')
        .select('id, label, birth_data')
        .eq('user_id', user.id);

      type Row = { id: string; label: string; birth_data: { name?: string; date: string; time: string; lat: number; lng: number } };
      const dup = (existing as Row[] | null)?.find((row) => {
        const bd = row.birth_data;
        if (!bd) return false;
        const rowName = (row.label || bd.name || '').trim().toLowerCase();
        return (
          rowName === normalizedName &&
          bd.date === kundali.birthData.date &&
          bd.time === kundali.birthData.time &&
          Math.abs((bd.lat ?? 0) - kundali.birthData.lat) < 0.0001 &&
          Math.abs((bd.lng ?? 0) - kundali.birthData.lng) < 0.0001
        );
      });

      if (dup) {
        // Already saved — show the "Saved" state without creating a duplicate.
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setSaving(false);
        return;
      }

      // Extract moon sign for horoscope use
      const moonPlanet = kundali.planets?.find((p: { planet: { id: number }; sign: number }) => p.planet.id === 1);
      const moonSign = moonPlanet?.sign || undefined;
      const relationship = kundali.birthData.relationship || 'self';
      const isSelf = relationship === 'self';

      // If saving self chart, unset existing primary first
      if (isSelf) {
        await supabase
          .from('saved_charts')
          .update({ is_primary: false })
          .eq('user_id', user.id)
          .eq('is_primary', true);
      }

      const { error } = await supabase.from('saved_charts').insert({
        user_id: user.id,
        label: kundali.birthData.name || 'Chart',
        birth_data: {
          name: kundali.birthData.name,
          date: kundali.birthData.date,
          time: kundali.birthData.time,
          place: kundali.birthData.place,
          lat: kundali.birthData.lat,
          lng: kundali.birthData.lng,
          timezone: kundali.birthData.timezone,
          relationship,
          moonSign,
        },
        is_primary: isSelf,
        relationship: relationship || 'self',
      });
      if (error) {
        console.error('[kundali] save failed:', error);
        alert(`Could not save chart: ${error.message}`);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error('[kundali] save threw:', e);
      alert(`Could not save chart: ${e instanceof Error ? e.message : 'unknown error'}`);
    }
    setSaving(false);
  };
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'ashtakavarga' | 'varga' | 'chat' | 'jaimini' | 'graha' | 'yogas' | 'shadbala' | 'bhavabala' | 'avasthas' | 'argala' | 'sphutas' | 'sadesati' | 'patrika' | 'timeline' | 'remedies' | 'sudarshana' | 'nadi' | 'blueprint' | 'bhavachalit' | 'ayanamsha' | 'kp'>('chart');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<string>('D1');
  const [dashaSystem, setDashaSystem] = useState('vimshottari');
  const [showTransits, setShowTransits] = useState(false);
  // showAyanamshaCompare removed — ayanamsha comparison now lives in its own tab
  const [transitData, setTransitData] = useState<{ planets: { id: number; name: LocaleText; rashi: number; longitude: number; isRetrograde: boolean }[] } | null>(null);

  // Personal Pandit dashboard state
  const [view, setView] = useState<'summary' | 'deepDive' | 'technical'>('summary');
  const [activeDomain, setActiveDomain] = useState<DomainType | null>(null);
  const [personalReading, setPersonalReading] = useState<PersonalReading | null>(null);
  const [keyDates, setKeyDates] = useState<KeyDate[]>([]);
  const [dashaViewMode, setDashaViewMode] = useState<'dashas' | 'unified'>('unified');
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
  const [eli5Mode, setEli5Mode] = useState(false);

  // AI Reading hook — manages comprehensive single-call AI readings with Supabase caching
  const aiReadingHook = useAIReading();

  // Trajectory hook — syncs domain scores to the server and computes trends
  const trajectoryHook = useTrajectory();

  /** After synthesizing a reading, check if user previously chose a focus domain. */
  const resolveInitialView = useCallback(() => {
    // Unified reading is always the default — no question entry needed
    setView('summary');
    setQuestionAnswered(true);
  }, []);

  // On mount: URL query params take priority over sessionStorage. This lets
  // saved-kundali cards on the dashboard open the correct chart — previously
  // the cached "last kundali" always won, so every card opened the same one.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get('n');
    const d = params.get('d');
    const t = params.get('t');
    const la = params.get('la');
    const lo = params.get('lo');
    const p = params.get('p');
    const editMode = params.get('edit') === '1';

    if (n && d && t && la && lo) {
      // Resolve timezone from birth coordinates — never use browser timezone.
      // See: feedback_timezone_rule.md
      const latNum = parseFloat(la);
      const lngNum = parseFloat(lo);
      // Purge the stale cache so the signature matcher later doesn't short-circuit.
      try { sessionStorage.removeItem('kundali_last_result'); } catch { /* ignore */ }
      setLoading(true);
      setChartStyle('north');
      resolveTimezoneFromCoords(latNum, lngNum)
        .then(resolvedTz => {
          const birthData: BirthData = {
            name: n,
            date: d,
            time: t,
            place: p || '',
            lat: latNum,
            lng: lngNum,
            timezone: resolvedTz || 'UTC',
            ayanamsha: 'lahiri',
          };
          return authedFetch('/api/kundali', { method: 'POST', body: JSON.stringify(birthData) });
        })
        .then(r => r.json())
        .then(data => {
          if (data?.planets) {
            setKundali(data);
            try {
              const reading = synthesizeReading(data, locale);
              setPersonalReading(reading);
              setKeyDates(computeKeyDates({ kundali: data }));
              setVedicProfile(generateVedicProfile(data, locale));
              resolveInitialView();
              // Trajectory sync handled by the dedicated useEffect that watches user + personalReading
            } catch { setPersonalReading(null); setView('technical'); }
            try {
              sessionStorage.setItem('kundali_last_result', JSON.stringify({
                kundali: data,
                chartStyle: 'north',
                sig: `${latNum}|${lngNum}|${d}|${t}|${data.birthData?.timezone || 'UTC'}`,
              }));
            } catch { /* quota */ }
            if (editMode) setEditing(true);
          } else {
            console.error('[kundali] query-param load failed:', data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('[kundali] query-param load threw:', err);
          setLoading(false);
        });
      return;
    }

    // No URL params — show saved chart picker (if logged in) or the birth form.
    // Don't auto-restore from sessionStorage on bare /kundali navigation so
    // users with multiple saved charts can pick which one to open.
  }, []);

  // Fetch saved charts for the picker when user is logged in and no chart is loaded
  useEffect(() => {
    if (!user || kundali) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from('saved_charts')
      .select('id, label, birth_data')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[kundali] saved charts fetch failed:', error); return; }
        if (data && data.length > 0) setSavedCharts(data);
      });
  }, [user, kundali]);

  // When auth restores after the session-restore effect already ran,
  // user was null so syncTrajectory was skipped. Retry once user arrives.
  useEffect(() => {
    if (user && personalReading && !trajectoryHook.trajectory && !trajectoryHook.loading) {
      trajectoryHook.syncTrajectory(personalReading, locale).catch((err: unknown) => {
        console.error('[trajectory] catch-up sync failed:', err);
      });
    }
  }, [user, personalReading, trajectoryHook.trajectory, trajectoryHook.loading, locale]);

  // Fetch current transits when toggled on
  useEffect(() => {
    if (showTransits && !transitData) {
      fetch('/api/panchang').then(r => r.json()).then(data => {
        if (data.planets) setTransitData({ planets: data.planets });
      }).catch(() => {});
    }
  }, [showTransits, transitData]);

  // Tippanni insights for planet commentary in Planets & Graha tabs
  const tip = useMemo(() => kundali ? generateTippanni(kundali, locale) : null, [kundali, locale]);

  // Cosmic Blueprint — synthesized from Shadbala, Dasha, Yogas, Ascendant
  const cosmicBlueprint = useMemo<CosmicBlueprint | null>(() => {
    if (!kundali?.fullShadbala || !kundali.dashas || !kundali.yogasComplete || !kundali.ascendant) return null;
    try {
      const dashasWithDates = kundali.dashas
        .filter(d => d.level === 'maha')
        .map(d => ({
          planet: d.planet,
          startDate: new Date(d.startDate),
          endDate: new Date(d.endDate),
          years: (new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / (365.25 * 24 * 3600 * 1000),
        }));
      const yogasForBlueprint = kundali.yogasComplete.map(y => ({
        id: y.id,
        name: y.name,
        present: y.present,
        strength: y.strength,
        isAuspicious: y.isAuspicious,
      }));
      const planetsForBlueprint = kundali.planets.map(p => ({ id: p.planet.id, longitude: p.longitude }));
      const rahuP = kundali.planets.find(p => p.planet.id === 7);
      const ketuP = kundali.planets.find(p => p.planet.id === 8);
      const moonP = kundali.planets.find(p => p.planet.id === 1);
      // Lagna lord: lord of the ascendant sign
      const SIGN_LORDS: Record<number, number> = { 1:2, 2:5, 3:3, 4:1, 5:0, 6:3, 7:5, 8:2, 9:4, 10:6, 11:6, 12:4 };
      const lagnaLordId = SIGN_LORDS[kundali.ascendant.sign];
      return generateCosmicBlueprint({
        shadbala: kundali.fullShadbala,
        dashas: dashasWithDates,
        yogas: yogasForBlueprint,
        ascendantSign: kundali.ascendant.sign,
        planets: planetsForBlueprint,
        rahuLongitude: rahuP?.longitude,
        ketuLongitude: ketuP?.longitude,
        lagnaLordId,
        moonLongitude: moonP?.longitude,
      });
    } catch (err) {
      console.error('[kundali] blueprint generation failed:', err);
      return null;
    }
  }, [kundali]);

  // Retrograde and combust planet sets for chart rendering
  const retrogradeIds = useMemo(() => kundali ? new Set(kundali.planets.filter(p => p.isRetrograde).map(p => p.planet.id)) : new Set<number>(), [kundali]);
  const combustIds = useMemo(() => kundali ? new Set(kundali.planets.filter(p => p.isCombust).map(p => p.planet.id)) : new Set<number>(), [kundali]);

  // Build transit ChartData for chart overlay
  const transitChartData = useMemo(() => {
    if (!kundali || !transitData || !showTransits) return undefined;
    const ascSign = kundali.ascendant.sign;
    const houses: number[][] = Array.from({ length: 12 }, () => []);
    for (const tp of transitData.planets) {
      // Only overlay slow planets (Jupiter, Saturn, Rahu, Ketu) — fast planets change too quickly
      if (tp.id < 4 || tp.id === 5) continue; // skip Sun, Moon, Mars, Mercury, Venus
      const houseIdx = ((tp.rashi - ascSign + 12) % 12);
      houses[houseIdx].push(tp.id);
    }
    return { houses, ascendantDeg: kundali.ascendant.degree, ascendantSign: ascSign } as import('@/types/kundali').ChartData;
  }, [kundali, transitData, showTransits]);

  // ── Sphuta transit windows ────────────────────────────────────────────────
  // Estimates when key planets will next cross each sensitive sphuta degree.
  // Uses average daily motions + birth positions; retrograde adds ~4-6 week variance.
  const sphuataTransitData = useMemo(() => {
    if (!kundali?.sphutas || !kundali.julianDay || !kundali.planets) return null;
    const today = new Date();
    const todayJD = dateToJD(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const daysSince = todayJD - kundali.julianDay;

    const AVG_SPEEDS: Record<number, number> = {
      0: 0.9856, 1: 13.176, 2: 0.524,  3: 1.383,
      4: 0.0831, 5: 1.2,    6: 0.0335, 7: -0.0529, 8: -0.0529,
    };
    const PLANET_NAMES_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
    const PERIOD_YEARS: Record<number, string> = { 0:'~1 yr',1:'~27 days',2:'~2 yrs',3:'~1 yr',4:'~12 yrs',5:'~1 yr',6:'~29.5 yrs',7:'~18 yrs',8:'~18 yrs' };

    const approxCurrentLong = (pid: number): number => {
      const p = kundali.planets.find(pl => pl.planet.id === pid);
      const bLong = p ? p.longitude : 0;
      const speed = AVG_SPEEDS[pid] ?? 0;
      return normalizeDeg(bLong + speed * daysSince);
    };

    const nextTransit = (targetDeg: number, pid: number): {
      label: string; labelHi: string; daysAway: number; isActive: boolean; planetName: string; period: string;
    } => {
      const speed = AVG_SPEEDS[pid];
      if (!speed) return { label: '—', labelHi: '—', daysAway: 9999, isActive: false, planetName: PLANET_NAMES_EN[pid] || 'Unknown', period: '' };
      const curr = approxCurrentLong(pid);
      let delta = speed > 0 ? normalizeDeg(targetDeg - curr) : normalizeDeg(curr - targetDeg);
      const isActive = delta <= 5 || delta >= 355;
      if (isActive) delta = 0;
      const daysAway = isActive ? 0 : delta / Math.abs(speed);
      const centerDate = new Date();
      centerDate.setDate(centerDate.getDate() + Math.round(daysAway));

      // Window = ±5° around target. halfWindowDays = 5 / speed.
      const halfWindowDays = Math.round(5 / Math.abs(speed));
      const showRange = halfWindowDays >= 7; // skip range for Sun (~5d) and Moon (~9h)
      const fmtShort = (d: Date, loc: string) => d.toLocaleDateString(loc, { month: 'short', year: 'numeric' });

      let label: string;
      let labelHi: string;
      if (isActive) {
        // Show how long the window remains
        if (showRange) {
          const exitDate = new Date();
          exitDate.setDate(exitDate.getDate() + halfWindowDays);
          label   = `Active – ${fmtShort(exitDate, 'en-US')}`;
          labelHi = `सक्रिय – ${fmtShort(exitDate, 'hi-IN')}`;
        } else {
          label = 'Active now!'; labelHi = 'अभी सक्रिय!';
        }
      } else if (daysAway < 30) {
        label = `~${Math.round(daysAway)} days`; labelHi = `~${Math.round(daysAway)} दिन`;
      } else if (showRange) {
        const startDate = new Date(); startDate.setDate(startDate.getDate() + Math.max(0, Math.round(daysAway - halfWindowDays)));
        const endDate   = new Date(); endDate.setDate(endDate.getDate()   + Math.round(daysAway + halfWindowDays));
        label   = `${fmtShort(startDate,'en-US')} – ${fmtShort(endDate,'en-US')}`;
        labelHi = `${fmtShort(startDate,'hi-IN')} – ${fmtShort(endDate,'hi-IN')}`;
      } else {
        label   = centerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        labelHi = centerDate.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
      }
      return { label, labelHi, daysAway: Math.round(daysAway), isActive, planetName: PLANET_NAMES_EN[pid] || '', period: PERIOD_YEARS[pid] || '' };
    };

    const sp = kundali.sphutas;

    const yogiJupiter    = nextTransit(sp.yogiPoint.degree, 4);
    const yogiPlanetTx   = sp.yogiPoint.yogiPlanet !== 4 ? nextTransit(sp.yogiPoint.degree, sp.yogiPoint.yogiPlanet) : null;
    const avayogiSaturn  = nextTransit(sp.avayogiPoint.degree, 6);
    const avayogiPlanTx  = sp.avayogiPoint.avayogiPlanet !== 6 ? nextTransit(sp.avayogiPoint.degree, sp.avayogiPoint.avayogiPlanet) : null;
    const pranaSun       = nextTransit(sp.pranaSphuta.degree, 0);
    const pranaJupiter   = nextTransit(sp.pranaSphuta.degree, 4);
    const dehaMoon       = nextTransit(sp.dehaSphuta.degree, 1);
    const dehaSaturn     = nextTransit(sp.dehaSphuta.degree, 6);
    const mrityuSaturn   = nextTransit(sp.mrityuSphuta.degree, 6);
    const mrityuMars     = nextTransit(sp.mrityuSphuta.degree, 2);
    const triSun         = nextTransit(sp.triSphuta.degree, 0);
    const bijaJupiter    = sp.bijaSphuta ? nextTransit(sp.bijaSphuta.degree, 4) : null;
    const kshetraJupiter = sp.kshetraSphuta ? nextTransit(sp.kshetraSphuta.degree, 4) : null;

    // Build unified timeline for synthesis — top upcoming events
    type TEvent = { date: Date; daysAway: number; planet: number; sphutalabel: string; isBenefic: boolean; action: string; actionHi: string };
    const timeline: TEvent[] = [];
    const addEv = (t: ReturnType<typeof nextTransit>, pid: number, sl: string, benef: boolean, act: string, actHi: string) => {
      if (!t.isActive) {
        const d = new Date(); d.setDate(d.getDate() + t.daysAway);
        timeline.push({ date: d, daysAway: t.daysAway, planet: pid, sphutalabel: sl, isBenefic: benef, action: act, actionHi: actHi });
      }
    };
    addEv(yogiJupiter, 4, 'Yogi Point', true, 'Major positive event window — start new ventures', 'शुभ घटना की खिड़की — नए कार्य आरम्भ करें');
    if (yogiPlanetTx) addEv(yogiPlanetTx, sp.yogiPoint.yogiPlanet, 'Yogi Point', true, `${PLANET_NAMES_EN[sp.yogiPoint.yogiPlanet]} activates your lucky degree`, `योगी ग्रह आपके शुभ बिंदु को सक्रिय करेगा`);
    addEv(avayogiSaturn, 6, 'Avayogi Point', false, 'Saturn stress window — avoid major decisions', 'शनि का चुनौतीपूर्ण गोचर — बड़े निर्णय टालें');
    if (avayogiPlanTx) addEv(avayogiPlanTx, sp.avayogiPoint.avayogiPlanet, 'Avayogi Point', false, 'Avayogi planet transits — exercise caution', 'अवयोगी ग्रह गोचर — सावधानी बरतें');
    addEv(pranaSun, 0, 'Prana Sphuta', true, 'Sun energises your vitality point — good for health actions', 'सूर्य आपकी जीवनशक्ति को ऊर्जित करेगा');
    addEv(mrityuSaturn, 6, 'Mrityu Sphuta', false, 'Saturn over longevity point — health checkup advised', 'शनि दीर्घायु बिंदु पर — स्वास्थ्य परीक्षण कराएं');
    addEv(mrityuMars, 2, 'Mrityu Sphuta', false, 'Mars over longevity point — avoid risky activities', 'मंगल दीर्घायु बिंदु पर — जोखिम से बचें');
    if (bijaJupiter) addEv(bijaJupiter, 4, 'Bija Sphuta', true, 'Jupiter activates male fertility point', 'बृहस्पति बीज स्फुट को सक्रिय करेगा');
    if (kshetraJupiter) addEv(kshetraJupiter, 4, 'Kshetra Sphuta', true, 'Jupiter activates female fertility point', 'बृहस्पति क्षेत्र स्फुट को सक्रिय करेगा');
    timeline.sort((a, b) => a.daysAway - b.daysAway);

    return { yogiJupiter, yogiPlanetTx, avayogiSaturn, avayogiPlanTx, pranaSun, pranaJupiter, dehaMoon, dehaSaturn, mrityuSaturn, mrityuMars, triSun, bijaJupiter, kshetraJupiter, timeline: timeline.slice(0, 7) };
  }, [kundali]);

  const handleGenerate = async (birthData: BirthData, style: ChartStyle) => {
    setLoading(true);
    setChartStyle(style);
    setSelectedHouse(null);
    setSelectedPlanet(null);
    try {
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify(birthData),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.planets) {
        console.error('Kundali API error:', data.error || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      setKundali(data);
      // Compute Personal Pandit reading + Key Dates (synchronous, <500ms)
      try {
        const reading = synthesizeReading(data, locale);
        setPersonalReading(reading);
        setKeyDates(computeKeyDates({ kundali: data }));
        setVedicProfile(generateVedicProfile(data, locale));
        resolveInitialView();
        if (user) trajectoryHook.syncTrajectory(reading, locale);
      } catch (synthErr) {
        console.error('Personal reading synthesis failed — falling back to technical view:', synthErr);
        setPersonalReading(null);
        setView('technical');
      }
      try {
        sessionStorage.setItem('kundali_last_result', JSON.stringify({ kundali: data, chartStyle: style, sig: `${birthData.lat}|${birthData.lng}|${birthData.date}|${birthData.time}|${birthData.timezone}` }));
      } catch { /* quota exceeded or private browsing */ }
      trackKundaliGenerated({ location: birthData.place || 'unknown', hasBirthTime: !!birthData.time });
      // Persist Moon nakshatra & rashi ONLY for self charts — not for family members.
      // This data drives horoscope auto-select and Chandrabalam/Tarabalam on panchang page.
      if (data.planets && (!birthData.relationship || birthData.relationship === 'self')) {
        const moon = data.planets.find((p: { planet: { id: number }; sign: number; nakshatra: { id: number } }) => p.planet.id === 1);
        if (moon) {
          const nakId = typeof moon.nakshatra === 'number' ? moon.nakshatra : moon.nakshatra?.id || 0;
          useBirthDataStore.getState().setBirthData(nakId, moon.sign, birthData.name || '');
        }
      }
    } catch (e) {
      console.error('Kundali generation failed:', e);
    }
    setLoading(false);
  };

  const handleSelectHouse = (house: number) => {
    setSelectedHouse(prev => prev === house ? null : house);
    setSelectedPlanet(null);
  };

  const handleSelectPlanet = (planetId: number) => {
    setSelectedPlanet(prev => prev === planetId ? null : planetId);
    if (kundali) {
      const p = kundali.planets.find(pl => pl.planet.id === planetId);
      if (p) setSelectedHouse(p.house);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg">{t('subtitle')}</p>
      </motion.div>

      {/* Saved Charts Picker — shows when user has saved charts and no chart is loaded */}
      {!kundali && !editing && savedCharts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-text-primary mb-4" style={headingFont}>
            {tl({ en: 'Your Saved Charts', hi: 'आपकी सहेजी कुण्डलियाँ', ta: 'உங்கள் சேமித்த ஜாதகங்கள்', bn: 'আপনার সংরক্ষিত কুণ্ডলী' }, locale)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedCharts.map((c) => {
              const cName = c.birth_data.name || c.label;
              const rel = c.birth_data.relationship;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    resolveTimezoneFromCoords(c.birth_data.lat, c.birth_data.lng).then(tz => {
                      handleGenerate({
                        name: cName,
                        date: c.birth_data.date,
                        time: c.birth_data.time,
                        place: c.birth_data.place,
                        lat: c.birth_data.lat,
                        lng: c.birth_data.lng,
                        timezone: tz || 'UTC',
                        relationship: (c.birth_data.relationship || undefined) as 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'other' | undefined,
                        ayanamsha: 'lahiri',
                      }, 'north');
                    });
                  }}
                  className="rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-4 hover:border-gold-primary/40 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-light font-bold text-sm truncate" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {cName}
                    </span>
                    {rel && rel !== 'self' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-medium capitalize shrink-0">
                        {rel}
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs font-mono">{c.birth_data.date} | {c.birth_data.time}</p>
                  <p className="text-text-secondary/60 text-xs truncate">{c.birth_data.place}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 border-t border-gold-primary/10 pt-4">
            <p className="text-text-secondary text-sm text-center">
              {tl({ en: 'Or generate a new chart below', hi: 'या नीचे नई कुण्डली बनाएँ', ta: 'அல்லது கீழே புதிய ஜாதகம் உருவாக்கவும்', bn: 'অথবা নীচে নতুন কুণ্ডলী তৈরি করুন' }, locale)}
            </p>
          </div>
        </div>
      )}

      {(!kundali || editing) && (
        <BirthForm
          onSubmit={(data, style) => {
            setEditing(false);
            handleGenerate(data, style);
          }}
          loading={loading}
          initialData={editing && kundali ? {
            name: kundali.birthData.name,
            date: kundali.birthData.date,
            time: kundali.birthData.time,
            place: kundali.birthData.place,
            lat: kundali.birthData.lat,
            lng: kundali.birthData.lng,
            timezone: kundali.birthData.timezone,
            relationship: kundali.birthData.relationship,
            ayanamsha: kundali.birthData.ayanamsha,
          } : undefined}
        />
      )}

      {kundali && !editing && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-16">
          <GoldDivider />

          {/* Birth details header */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 mb-8 text-center">
            <h2 className="text-gold-light text-2xl font-semibold mb-2" style={headingFont}>
              {kundali.birthData.name || (locale === 'en' || isTamil ? 'Birth Chart' : 'जन्म कुण्डली')}
            </h2>
            <p className="text-text-secondary text-sm">
              {kundali.birthData.date} | {kundali.birthData.time} | {kundali.birthData.place}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <RashiIconById id={kundali.ascendant.sign} size={28} />
              <span className="text-gold-primary text-base font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {locale === 'en' || isTamil ? 'Lagna (Ascendant)' : 'लग्न'}: {tl(kundali.ascendant.signName, locale)} ({kundali.ascendant.degree.toFixed(2)}°)
              </span>
            </div>
            {/* Key birth details — nakshatra, tithi, yoga, masa */}
            {(() => {
              const moonP = kundali.planets.find(p => p.planet.id === 1);
              const { calculateTithi, calculateYoga, sunLongitude: sunLon, toSidereal: toSid, getMasa, MASA_NAMES } = require('@/lib/ephem/astronomical');
              const { TITHIS } = require('@/lib/constants/tithis');
              const { YOGAS } = require('@/lib/constants/yogas');
              const jd = kundali.julianDay;
              const tR = calculateTithi(jd);
              const tD = TITHIS[tR.number - 1];
              const yN = calculateYoga(jd);
              const yD = YOGAS[yN - 1];
              const sS = toSid(sunLon(jd), jd);
              const mI = getMasa(sS);
              const mD = MASA_NAMES[mI];
              return (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs">
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Rashi' : 'राशि'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(moonP?.signName, locale) || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Nakshatra' : 'नक्षत्र'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(moonP?.nakshatra?.name, locale) || '—'} ({locale === 'en' || isTamil ? 'Pada' : 'पाद'} {moonP?.pada || '—'})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Tithi' : 'तिथि'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(tD?.name, locale) || '—'} ({tD?.paksha === 'shukla' ? (locale === 'en' || isTamil ? 'Shukla' : 'शुक्ल') : (locale === 'en' || isTamil ? 'Krishna' : 'कृष्ण')})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Yoga' : 'योग'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(yD?.name, locale) || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Masa' : 'मास'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(mD, locale) || '—'}</span></span>
                </div>
              );
            })()}
            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                {locale === 'en' || isTamil ? 'Edit Details' : isDevanagari ? 'विवरण सम्पादित करें' : 'विवरणं सम्पादयतु'}
              </button>
              {user && (
                <button
                  onClick={handleSaveChart}
                  disabled={saving || saved}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
                    saved
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                      : 'border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60'
                  }`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved
                    ? (locale === 'en' || isTamil ? 'Saved' : 'सहेजा गया')
                    : saving
                      ? (locale === 'en' || isTamil ? 'Saving...' : 'सहेज रहे...')
                      : (locale === 'en' || isTamil ? 'Save Chart' : 'चार्ट सहेजें')
                  }
                </button>
              )}
              <button
                onClick={() => { setKundali(null); setEditing(false); setPersonalReading(null); setView('summary'); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              >
                {locale === 'en' || isTamil ? 'New Chart' : 'नया चार्ट'}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={() => { setActiveTab('patrika'); setView('technical'); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/40 text-gold-light bg-gold-primary/8 hover:bg-gold-primary/15 hover:border-gold-primary/70 transition-all duration-300"
              >
                <ScrollText className="w-4 h-4" />
                {locale === 'en' || isTamil ? 'Generate Patrika' : 'पत्रिका बनाएं'}
              </button>
              <DownloadReportButton
                birthData={{
                  name: kundali.birthData.name,
                  date: kundali.birthData.date,
                  time: kundali.birthData.time,
                  lat: kundali.birthData.lat,
                  lng: kundali.birthData.lng,
                  timezone: kundali.birthData.timezone,
                  place: kundali.birthData.place,
                }}
                locale={locale}
              />
              <ShareableKundaliCard kundali={kundali} locale={locale as Locale} />
              <ShareButton
                title={`${kundali.birthData.name || 'Kundali'} — Birth Chart`}
                text={`${kundali.birthData.name ? kundali.birthData.name + "'s Kundali" : 'Kundali'} — ${tl(kundali.ascendant.signName, locale)} ${locale === 'en' || isTamil ? 'Lagna' : 'लग्न'}, ${tl(kundali.planets.find(p => p.planet.id === 1)?.signName, locale) || ''} ${locale === 'en' || isTamil ? 'Moon' : 'चन्द्र'} | dekhopanchang.com`}
                url={`https://dekhopanchang.com/${locale}/kundali`}
                locale={locale as Locale}
              />
              <button
                onClick={() => setShowPoster(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-primary/20 to-amber-500/10 border border-gold-primary/40 text-gold-light hover:from-gold-primary/30 hover:to-amber-500/20 hover:border-gold-primary/60 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                {locale === 'en' || isTamil ? 'Birth Poster' : 'जन्म पोस्टर'}
              </button>
              <Link
                href={(() => {
                  const shiftData = computeSignShift(kundali);
                  const encoded = encodeSignShiftParams(shiftData);
                  return `/${locale}/sign-shift?data=${encodeURIComponent(encoded)}`;
                })()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300"
              >
                <ArrowRightLeft className="w-4 h-4" />
                {locale === 'en' || isTamil ? 'Western vs Vedic' : 'पश्चिमी बनाम वैदिक'}
              </Link>
            </div>
          </div>

          {/* ── Birth Poster Modal ── */}
          <AnimatePresence>
            {showPoster && (() => {
              const posterData = assembleBirthPosterData(kundali, locale);
              return (
                <motion.div
                  key="birth-poster-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                  onClick={() => setShowPoster(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative max-h-[90vh] overflow-auto rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => setShowPoster(false)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                      aria-label="Close poster preview"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    {/* Poster preview — scaled down to fit viewport */}
                    <div className="origin-top-left" style={{ transform: 'scale(0.45)', width: 1080, height: 1920 }}>
                      <BirthPosterCard data={posterData} format="story" locale={locale} />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Ganda Mula Alert — visible on ALL tabs */}
          {(() => {
            const moonP = kundali.planets.find(p => p.planet.id === 1);
            // 6 Ganda Mula nakshatras: 1=Ashwini, 9=Ashlesha, 10=Magha, 18=Jyestha, 19=Moola, 27=Revati
            const moonNakId = moonP?.nakshatra?.id;
            if (!moonNakId || !GANDA_MULA_DATA[moonNakId]) return null;
            const gm = GANDA_MULA_DATA[moonNakId];
            const nakName = moonP?.nakshatra?.name?.[locale] || moonP?.nakshatra?.name?.en;
            const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;
            return (
              <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-amber-400 text-xl font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-amber-300 font-bold text-base mb-1" style={headingFont}>
                      {lk === 'en' ? `Ganda Mula — Moon in ${nakName} (Pada ${moonP?.pada})` : `गण्ड मूल — चन्द्रमा ${nakName} (पाद ${moonP?.pada})`}
                    </h4>
                    <div className="text-amber-200/80 text-xs font-semibold mb-2">{gm.type[lk === 'en' ? 'en' : 'hi']}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="rounded-lg bg-amber-500/8 p-3">
                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                          {lk === 'en' ? 'Who is affected' : 'किसे प्रभाव'}
                        </div>
                        <p className="text-text-secondary/80 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {gm.affected[lk === 'en' ? 'en' : 'hi']}
                        </p>
                      </div>
                      <div className="rounded-lg bg-amber-500/8 p-3">
                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                          {lk === 'en' ? 'Shanti procedure' : 'शान्ति विधि'}
                        </div>
                        <p className="text-text-secondary/80 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {gm.procedure[lk === 'en' ? 'en' : 'hi']}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-secondary/70 text-xs mt-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {lk === 'en'
                        ? 'Annual shanti: perform Ganda Mula Puja on your birth nakshatra day each year. Shanti timing: when the Moon transits your birth nakshatra.'
                        : 'वार्षिक शान्ति: प्रत्येक वर्ष अपने जन्म नक्षत्र के दिन गण्ड मूल पूजा करें। शान्ति काल: जब चन्द्रमा आपके जन्म नक्षत्र से गुजरे।'}
                    </p>
                    <Link href="/learn/modules/24-1" className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2" tabIndex={-1}>
                      {lk === 'en' ? 'Learn about Ganda Mula Nakshatras →' : 'गण्ड मूल नक्षत्रों के बारे में जानें →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Manglik Dosha Banner — visible on ALL tabs */}
          {tip?.doshas?.some(d => d.present && d.name.toLowerCase().includes('manglik')) && (() => {
            const manglik = tip.doshas.find(d => d.present && d.name.toLowerCase().includes('manglik'));
            if (!manglik) return null;
            const isCancelled = manglik.effectiveSeverity === 'cancelled';
            const isPartial = manglik.effectiveSeverity === 'partial';
            return (
              <div className={`mb-6 rounded-2xl border ${isCancelled ? 'border-green-500/30 bg-gradient-to-br from-green-900/20 to-[#0a0e27]' : 'border-red-500/30 bg-gradient-to-br from-red-900/20 via-[#1a1040]/30 to-[#0a0e27]'} p-5`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${isCancelled ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center shrink-0`}>
                    <span className="text-lg">{'\u2642'}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm ${isCancelled ? 'text-green-400' : 'text-red-400'}`}>
                      {manglik.name}
                      {isCancelled && <span className="ml-2 text-green-400/70 text-xs font-normal">(Cancelled)</span>}
                      {isPartial && <span className="ml-2 text-amber-400/70 text-xs font-normal">(Partially Mitigated)</span>}
                    </h3>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">{manglik.description}</p>

                    {/* Cancellation conditions */}
                    {manglik.cancellationConditions && manglik.cancellationConditions.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {manglik.cancellationConditions.map((c, i) => (
                          <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${c.met ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-white/[0.06] text-text-secondary'}`}>
                            {c.met ? '\u2713' : '\u2717'} {c.condition}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Remedies */}
                    {manglik.remedies && (
                      <div className="mt-3 text-xs text-[#d4a853]/80 bg-[#d4a853]/5 rounded-lg px-3 py-2 border border-[#d4a853]/10">
                        <span className="font-semibold text-[#d4a853]">Remedies: </span>{manglik.remedies}
                      </div>
                    )}

                    {/* Active dasha warning */}
                    {manglik.activeDasha && (
                      <p className="text-xs text-amber-400/70 mt-2 italic">{manglik.activeDasha}</p>
                    )}

                    {/* Learn more link */}
                    <Link href="/learn/modules/33-1" className="inline-flex items-center gap-1 mt-3 text-xs text-red-400 hover:text-red-300 transition-colors">
                      Learn more about Manglik Dosha →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Kaal Sarpa Dosha Banner — visible on ALL tabs */}
          {tip?.doshas?.some(d => d.present && d.name.toLowerCase().includes('kaal sarp')) && (() => {
            const kaalSarp = tip.doshas.find(d => d.present && d.name.toLowerCase().includes('kaal sarp'));
            if (!kaalSarp) return null;
            const isCancelled = kaalSarp.effectiveSeverity === 'cancelled';
            const isPartial = kaalSarp.effectiveSeverity === 'partial';

            return (
              <div className={`mb-6 rounded-2xl border ${isCancelled ? 'border-green-500/30 bg-gradient-to-br from-green-900/20 to-[#0a0e27]' : 'border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-[#1a1040]/30 to-[#0a0e27]'} p-5`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${isCancelled ? 'bg-green-500/20' : 'bg-purple-500/20'} flex items-center justify-center shrink-0`}>
                    <span className="text-lg">{'\u260A'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-sm ${isCancelled ? 'text-green-400' : 'text-purple-400'}`}>
                        {kaalSarp.name}
                      </h3>
                      {isCancelled && <span className="text-green-400/70 text-xs bg-green-500/10 px-2 py-0.5 rounded-full">Cancelled</span>}
                      {isPartial && <span className="text-amber-400/70 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full">Partially Mitigated</span>}
                      {!isCancelled && !isPartial && <span className="text-red-400/70 text-xs bg-red-500/10 px-2 py-0.5 rounded-full">Active</span>}
                    </div>

                    <p className="text-text-secondary text-xs mt-2 leading-relaxed">{kaalSarp.description}</p>

                    {/* Cancellation conditions */}
                    {kaalSarp.cancellationConditions && kaalSarp.cancellationConditions.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {kaalSarp.cancellationConditions.map((c, i) => (
                          <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${c.met ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-white/[0.06] text-text-secondary'}`}>
                            {c.met ? '\u2713' : '\u2717'} {c.condition} {c.source && <span className="text-text-secondary/50 ml-1">({c.source})</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Remedies */}
                    {kaalSarp.remedies && (
                      <div className="mt-3 text-xs text-[#d4a853]/80 bg-[#d4a853]/5 rounded-lg px-3 py-2 border border-[#d4a853]/10">
                        <span className="font-semibold text-[#d4a853]">Remedies: </span>{kaalSarp.remedies}
                      </div>
                    )}

                    {/* Active dasha warning */}
                    {kaalSarp.activeDasha && (
                      <p className="text-xs text-amber-400/70 mt-2 italic">{kaalSarp.activeDasha}</p>
                    )}

                    {/* Link to learn more */}
                    <Link href="/learn/modules/32-1" className="inline-flex items-center gap-1 mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                      Learn more about Kaal Sarpa Dosha →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ===== UNIFIED TIPPANNI / LIFE SUMMARY ===== */}
          {tip && view === 'summary' && (
            <SummaryView
              tip={tip}
              personalReading={personalReading}
              keyDates={keyDates}
              trajectory={trajectoryHook.trajectory}
              isLoggedIn={!!user}
              locale={locale}
              kundali={kundali ?? undefined}
              onDeepDive={(domain) => {
                setActiveDomain(domain as DomainType);
                setView('deepDive');
              }}
              onTechnical={() => setView('technical')}
            />
          )}

          {/* QuestionEntry and Dashboard views removed — Summary replaces both */}

          {/* ===== LAYER 2: DOMAIN DEEP DIVE ===== */}
          {personalReading && view === 'deepDive' && activeDomain && kundali && (
            <DomainDeepDive
              reading={personalReading.domains.find(d => d.domain === activeDomain)!}
              locale={locale}
              onBack={() => {
                setActiveDomain(null);
                setView('summary');
              }}
              aiReading={aiReadingHook.getReading(activeDomain)}
              aiLoading={aiReadingHook.loading}
              aiError={aiReadingHook.error}
              onRequestAIReading={() => {
                const age = Math.floor((Date.now() - new Date(kundali.birthData.date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                aiReadingHook.fetchReadings(kundali, personalReading, age);
              }}
              onRegenerateAIReading={() => {
                const age = Math.floor((Date.now() - new Date(kundali.birthData.date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                aiReadingHook.regenerate(kundali, personalReading, age);
              }}
            />
          )}

          {/* ===== LAYER 3: TECHNICAL TABS (existing) ===== */}
          {(view === 'technical' || !personalReading) && (
          <>
            {/* Back to summary button */}
            {tip && (
              <button
                onClick={() => setView('summary')}
                className="inline-flex items-center gap-1.5 text-gold-primary text-sm hover:text-gold-light mb-4 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {locale === 'en' || String(locale) === 'ta' ? 'Back to Life Summary' : 'जीवन सारांश पर वापस'}
              </button>
            )}

          {/* Beginner / Expert mode toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setEli5Mode(true)}
              className={`px-4 py-2 rounded-l-xl text-xs sm:text-sm font-semibold transition-all border ${
                eli5Mode
                  ? 'bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] text-gold-light border-gold-primary/40 shadow-lg shadow-gold-primary/5'
                  : 'text-text-secondary/70 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border-gold-primary/8 hover:border-gold-primary/25 hover:text-gold-light'
              }`}
            >
              {locale === 'en' || isTamil ? 'Beginner' : 'सरल'}
            </button>
            <button
              onClick={() => setEli5Mode(false)}
              className={`px-4 py-2 rounded-r-xl text-xs sm:text-sm font-semibold transition-all border ${
                !eli5Mode
                  ? 'bg-gradient-to-br from-[#2d1b69]/60 to-[#0a0e27] text-gold-light border-gold-primary/40 shadow-lg shadow-gold-primary/5'
                  : 'text-text-secondary/70 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border-gold-primary/8 hover:border-gold-primary/25 hover:text-gold-light'
              }`}
            >
              {locale === 'en' || isTamil ? 'Expert' : 'विशेषज्ञ'}
            </button>
          </div>

          {/* ELI5 Beginner Panel */}
          {eli5Mode && kundali && (
            <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
              <ELI5Panel kundali={kundali} locale={locale} />
            </Suspense>
          )}

          {/* Tab navigation + tab content — hidden in beginner mode */}
          <div className={eli5Mode ? 'hidden' : ''}>
          {/* Tab navigation — horizontal scroll strip */}
          <div className="relative mb-8">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-1.5 sm:gap-2 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0">
                {([
                  { key: 'chart' as const, label: t('birthChart') },
                  { key: 'blueprint' as const, label: locale === 'en' || isTamil ? 'Blueprint' : 'ब्लूप्रिंट' },
                  { key: 'planets' as const, label: t('planetPositions') },
                  { key: 'dasha' as const, label: t('dashaTimeline') },
                  { key: 'ashtakavarga' as const, label: t('ashtakavarga') },
                  // Tippanni tab removed — content is in the Summary view
                  { key: 'varga' as const, label: locale === 'en' || isTamil ? 'Varga Analysis' : 'वर्ग विश्लेषण' },
                  { key: 'chat' as const, label: locale === 'en' || isTamil ? 'Chat' : 'चैट' },
                  { key: 'graha' as const, label: locale === 'en' || isTamil ? 'Graha' : 'ग्रह' },
                  { key: 'yogas' as const, label: locale === 'en' || isTamil ? 'Yogas' : 'योग' },
                  { key: 'avasthas' as const, label: locale === 'en' || isTamil ? 'Avasthas' : 'अवस्था' },
                  { key: 'argala' as const, label: locale === 'en' || isTamil ? 'Argala' : 'अर्गला' },
                  { key: 'sphutas' as const, label: locale === 'en' || isTamil ? 'Sphutas' : 'स्फुट' },
                  { key: 'shadbala' as const, label: locale === 'en' || isTamil ? 'Shadbala' : 'षड्बल' },
                  { key: 'bhavabala' as const, label: locale === 'en' || isTamil ? 'Bhavabala' : 'भावबल' },
                  { key: 'bhavachalit' as const, label: locale === 'en' || isTamil ? 'Bhava Chalit' : 'भाव चलित' },
                  { key: 'ayanamsha' as const, label: locale === 'en' || isTamil ? 'Ayanamsha' : 'अयनांश' },
                  { key: 'kp' as const, label: locale === 'en' || isTamil ? 'KP System' : 'केपी पद्धति' },
                  { key: 'sadesati' as const, label: locale === 'en' || isTamil ? 'Sade Sati' : 'साढ़े साती' },
                  { key: 'jaimini' as const, label: locale === 'en' || isTamil ? 'Jaimini' : 'जैमिनी' },
                  { key: 'timeline' as const, label: locale === 'en' || isTamil ? 'Life Timeline' : 'जीवन-रेखा' },
                  { key: 'remedies' as const, label: locale === 'en' || isTamil ? 'Remedies' : 'उपाय' },
                  { key: 'sudarshana' as const, label: locale === 'en' || isTamil ? 'Sudarshana' : 'सुदर्शन' },
                  { key: 'nadi' as const, label: locale === 'en' || isTamil ? 'Nadi Amsha' : 'नाडी अंश' },
                  { key: 'patrika' as const, label: locale === 'en' || isTamil ? 'Patrika' : 'पत्रिका' },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedHouse(null); setSelectedPlanet(null); trackTabViewed({ tab: tab.key }); }}
                    className={`px-3 py-2.5 sm:px-5 sm:py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border border-gold-primary/40 shadow-lg shadow-gold-primary/5'
                        : 'text-text-secondary/70 hover:text-gold-light bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/25 hover:bg-[#1a1040]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== BLUEPRINT TAB ===== */}
          {activeTab === 'blueprint' && cosmicBlueprint && (
            <div className="space-y-5">
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <BlueprintTab
                  blueprint={cosmicBlueprint}
                  locale={locale}
                  onNavigateToDasha={() => { setActiveTab('dasha'); trackTabViewed({ tab: 'dasha' }); }}
                />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/learn/birth-chart`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Learn More: Reading Your Birth Chart →' : 'और जानें: जन्म कुण्डली पठन →'}
                </a>
              </div>
            </div>
          )}

          {/* ===== CHART TAB ===== */}
          {activeTab === 'chart' && (
            <div>
              <a href={`/${locale}/learn/birth-chart`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Birth Charts \u2192' : 'जन्म कुण्डली के बारे में जानें \u2192'}
              </a>
              <details className="mb-4 bg-white/[0.02] border border-gold-primary/10 rounded-xl group">
                <summary className="px-5 py-3 cursor-pointer text-sm text-gold-primary hover:text-gold-light transition-colors">
                  {locale === 'en' || isTamil ? 'What is a Birth Chart?' : 'जन्म कुण्डली क्या है?'}
                </summary>
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed space-y-2">
                  <p>{locale === 'en' || isTamil ? 'Your birth chart (Kundali/Rashi chart/D1) is a snapshot of the sky at the exact moment and location of your birth. The 12 houses represent different life areas, and the planets placed within them reveal your innate tendencies, strengths, and challenges.' : 'जन्म कुण्डली आपके जन्म के सटीक क्षण और स्थान पर आकाश का चित्र है। 12 भाव जीवन के विभिन्न क्षेत्रों का प्रतिनिधित्व करते हैं, और उनमें स्थित ग्रह आपकी सहज प्रवृत्तियों, शक्तियों और चुनौतियों को प्रकट करते हैं।'}</p>
                  <p>{locale === 'en' || isTamil ? 'How to read: The top diamond is House 1 (your personality). Moving clockwise: House 2 (wealth), House 3 (courage), and so on. Planet abbreviations (Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu) show where each planet was at your birth.' : 'कैसे पढ़ें: ऊपर का हीरा भाव 1 (व्यक्तित्व) है। दक्षिणावर्त: भाव 2 (धन), भाव 3 (साहस), इत्यादि। ग्रह संक्षेप बताते हैं कि आपके जन्म के समय कौन-सा ग्रह कहाँ था।'}</p>
                </div>
              </details>
              {/* Chart type selector — all Parashara vargas */}
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
              <div className="flex sm:flex-wrap sm:justify-center gap-1.5 min-w-max sm:min-w-0">
                {([
                  { key: 'D1', label: locale === 'en' || isTamil ? 'D1 Rashi' : isDevanagari ? 'D1 राशि' : 'D1 राशिः' },
                  { key: 'bhav_chalit', label: locale === 'en' || isTamil ? 'Bhav Chalit' : 'भाव चलित' },
                  { key: 'D9', label: locale === 'en' || isTamil ? 'D9 Navamsha' : isDevanagari ? 'D9 नवांश' : 'D9 नवांशः' },
                  ...(kundali.divisionalCharts ? Object.entries(kundali.divisionalCharts).map(([key, dc]) => ({
                    key,
                    label: dc.label[locale as Locale] || dc.label.en || key,
                  })) : []),
                ]).map(c => (
                  <button key={c.key} onClick={() => setActiveChart(c.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeChart === c.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
              </div>

              {/* Chart meaning description */}
              {activeChart !== 'D1' && activeChart !== 'bhav_chalit' && activeChart !== 'D9' && kundali.divisionalCharts?.[activeChart] && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{kundali.divisionalCharts[activeChart].label[locale as Locale]}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{(kundali.divisionalCharts[activeChart] as DivisionalChart & { meaning?: LocaleText }).meaning?.[isDevanagari ? 'hi' : 'en'] || ''}</span>
                </div>
              )}
              {activeChart === 'D9' && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{t('navamsha')}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{locale === 'en' || isTamil ? 'Marriage, dharma & inner self — the most important divisional chart' : 'विवाह, धर्म एवं आंतरिक स्वरूप — सर्वाधिक महत्वपूर्ण वर्ग चार्ट'}</span>
                </div>
              )}
              {activeChart === 'bhav_chalit' && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{t('bhavChalit')}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{locale === 'en' || isTamil ? 'Mid-cusp house system — planets may shift houses compared to D1' : 'मध्य-शिखर भाव पद्धति — D1 की तुलना में ग्रह भाव बदल सकते हैं'}</span>
                </div>
              )}

              {/* Style toggle */}
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setChartStyle('north')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('north')}
                </button>
                <button onClick={() => setChartStyle('south')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('south')}
                </button>
              </div>

              <InfoBlock
                id="kundali-chart"
                title={locale === 'en' || isTamil ? 'What is a Birth Chart (Kundali)?' : 'जन्म कुण्डली क्या है?'}
                defaultOpen={true}
              >
                {locale === 'en' || isTamil
                  ? 'A birth chart is a map of the sky at the exact moment you were born. It shows where all 9 planets were positioned across 12 zodiac signs and 12 houses (life areas). This map reveals your personality, career path, relationships, health patterns, and life timing — think of it as your cosmic DNA. The diamond shape is the traditional North Indian format. Each triangle is one \'house.\' Planet abbreviations: Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu.'
                  : 'जन्म कुण्डली आपके जन्म के सटीक क्षण में आकाश का नक्शा है। यह दर्शाती है कि 9 ग्रह 12 राशियों और 12 भावों (जीवन क्षेत्रों) में कहाँ थे। यह आपके व्यक्तित्व, कैरियर, सम्बन्ध, स्वास्थ्य और जीवन समय को प्रकट करती है। हीरे का आकार पारम्परिक उत्तर भारतीय प्रारूप है। प्रत्येक त्रिभुज एक \'भाव\' है।'}
              </InfoBlock>

              <div className="flex justify-center gap-3 mb-4 flex-wrap">
                <button onClick={() => setShowTransits(!showTransits)}
                  className={`px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${showTransits ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
                  <span className={`w-2 h-2 rounded-full ${showTransits ? 'bg-emerald-400' : 'bg-text-secondary/30'}`} />
                  {locale === 'en' || isTamil ? 'Show Current Transits' : 'वर्तमान गोचर दिखाएं'}
                </button>
                <button onClick={() => setActiveTab('ayanamsha')}
                  className="px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 text-text-secondary border border-gold-primary/10 hover:bg-violet-500/15 hover:text-violet-300 hover:border-violet-500/30">
                  <span className="w-2 h-2 rounded-full bg-violet-400/50" />
                  {locale === 'en' || isTamil ? 'Compare Ayanamshas →' : 'अयनांश तुलना →'}
                </button>
              </div>
              {showTransits && (
                <div className="mb-4">
                  <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-3">
                    <div className="text-emerald-400 text-xs font-medium mb-1">{locale === 'en' || isTamil ? 'Current Transit Positions' : 'वर्तमान गोचर स्थितियाँ'}</div>
                    <div className="text-text-tertiary text-xs" suppressHydrationWarning>{locale === 'en' || isTamil ? `As of ${new Date().toLocaleDateString()}` : `${new Date().toLocaleDateString('hi-IN')}`}</div>
                  </div>
                  {transitData && (
                    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                        {transitData.planets?.map((p: { id: number; name: LocaleText; rashi: number; longitude: number; isRetrograde: boolean }, i: number) => {
                          const rashiName = RASHIS[p.rashi - 1]?.name[locale as Locale] || '';
                          const natalPlanet = kundali.planets.find(np => np.planet.id === p.id);
                          const isSameSign = natalPlanet && natalPlanet.sign === p.rashi;
                          return (
                            <div key={i} className={`text-center p-2 rounded-lg ${isSameSign ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]'}`}>
                              <div className="text-gold-light text-xs font-bold">{p.name[locale as Locale]}</div>
                              <div className="text-emerald-400 text-xs font-medium mt-0.5">{rashiName}</div>
                              {p.isRetrograde && <div className="text-red-400 text-xs">℞</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Ayanamsha comparison moved to dedicated tab */}
              <p className="text-text-secondary/70 text-xs text-center mb-6">
                {locale === 'en' || isTamil ? 'Click on any house to see details' : 'विवरण देखने के लिए किसी भाव पर क्लिक करें'}
              </p>

              {/* Chart display */}
              {(() => {
                const chartData = activeChart === 'D1' ? kundali.chart
                  : activeChart === 'D9' ? kundali.navamshaChart
                  : activeChart === 'bhav_chalit' ? (kundali.bhavChalitChart || kundali.chart)
                  : kundali.divisionalCharts?.[activeChart]
                    ? kundali.divisionalCharts[activeChart]
                    : kundali.chart;

                const chartTitle = activeChart === 'D1' ? t('birthChart')
                  : activeChart === 'D9' ? t('navamsha')
                  : activeChart === 'bhav_chalit' ? t('bhavChalit')
                  : tl(kundali.divisionalCharts?.[activeChart]?.label, locale) || activeChart;

                // Show selected chart + D1 side by side (unless D1 is already selected)
                const showD1Companion = activeChart !== 'D1';

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
                    {chartStyle === 'north' ? (
                      <>
                        {showD1Companion && <ChartNorth data={kundali.chart} title={t('birthChart')} size={500} selectedHouse={selectedHouse} onSelectHouse={handleSelectHouse} retrogradeIds={retrogradeIds} combustIds={combustIds} transitData={transitChartData} />}
                        <ChartNorth data={chartData} title={chartTitle} size={500} selectedHouse={showD1Companion ? null : selectedHouse} onSelectHouse={showD1Companion ? undefined : handleSelectHouse} transitData={!showD1Companion ? transitChartData : undefined} />
                        {!showD1Companion && <ChartNorth data={kundali.navamshaChart} title={t('navamsha')} size={500} selectedHouse={null} />}
                      </>
                    ) : (
                      <>
                        {showD1Companion && <ChartSouth data={kundali.chart} title={t('birthChart')} size={500} selectedHouse={selectedHouse} onSelectHouse={handleSelectHouse} retrogradeIds={retrogradeIds} combustIds={combustIds} transitData={transitChartData} />}
                        <ChartSouth data={chartData} title={chartTitle} size={500} selectedHouse={showD1Companion ? null : selectedHouse} onSelectHouse={showD1Companion ? undefined : handleSelectHouse} transitData={!showD1Companion ? transitChartData : undefined} />
                        {!showD1Companion && <ChartSouth data={kundali.navamshaChart} title={t('navamsha')} size={500} selectedHouse={null} />}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* ── Key Dates — right below the chart ── */}
              {keyDates.length > 0 && (
                <div className="my-6">
                  <KeyDatesSection keyDates={keyDates} locale={locale} />
                </div>
              )}

              {/* ── Inline Birth Poster (always visible) ── */}
              {kundali && (() => {
                const posterData = assembleBirthPosterData(kundali, locale);
                return (
                  <div className="my-8 flex flex-col lg:flex-row gap-6 items-start">
                    {/* Poster card — square format scaled to fit */}
                    <div className="w-full lg:w-80 shrink-0 rounded-2xl overflow-hidden border border-gold-primary/15" style={{ aspectRatio: '1/1' }}>
                      <div style={{ transform: 'scale(0.296)', transformOrigin: 'top left', width: 1080, height: 1080 }}>
                        <BirthPosterCard data={posterData} format="square" locale={locale} />
                      </div>
                    </div>
                    {/* Summary + share */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-gold-light text-lg font-bold" style={headingFont}>{posterData.name}</h3>
                        <p className="text-text-secondary text-sm">{posterData.date} · {posterData.time} · {posterData.place}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-3 text-center">
                          <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">Rising</div>
                          <div className="text-gold-light font-bold text-sm mt-0.5">{posterData.risingSign}</div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-3 text-center">
                          <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">Moon</div>
                          <div className="text-gold-light font-bold text-sm mt-0.5">{posterData.moonSign}</div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-3 text-center">
                          <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">Sun</div>
                          <div className="text-gold-light font-bold text-sm mt-0.5">{posterData.sunSign}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-sm font-bold ${posterData.elementDist.dominant === 'Fire' ? 'text-amber-400' : posterData.elementDist.dominant === 'Earth' ? 'text-emerald-400' : posterData.elementDist.dominant === 'Air' ? 'text-sky-400' : 'text-indigo-400'}`}>
                          {posterData.elementDist.percentage}% {posterData.elementDist.dominant}
                        </div>
                        <div className="text-text-secondary text-sm italic">{locale === 'hi' ? posterData.elementDist.archetype.hi : posterData.elementDist.archetype.en}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => setShowPoster(true)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-gold-primary/15 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/25 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          {locale === 'hi' ? 'पूरा पोस्टर देखें' : 'View Full Poster'}
                        </button>
                        <button
                          onClick={async () => {
                            const cardParams = new URLSearchParams({
                              name: posterData.name,
                              date: posterData.date,
                              time: posterData.time,
                              place: posterData.place,
                              rising: posterData.risingSign,
                              moon: posterData.moonSign,
                              sun: posterData.sunSign,
                              dasha: posterData.currentDasha,
                              houses: JSON.stringify(posterData.chartHouses),
                              format: 'story',
                            });
                            const cardUrl = `/api/card/birth-poster?${cardParams.toString()}`;
                            try {
                              // Fetch the image as a blob
                              const res = await fetch(cardUrl);
                              if (!res.ok) throw new Error(`Card fetch failed: ${res.status}`);
                              const blob = await res.blob();
                              const file = new File([blob], `${posterData.name}-birth-chart.png`, { type: 'image/png' });

                              // Try native share with image file (mobile)
                              if (navigator.share && navigator.canShare?.({ files: [file] })) {
                                await navigator.share({
                                  title: `${posterData.name}'s Vedic Birth Chart`,
                                  text: `${posterData.name} — ${posterData.risingSign} Rising, ${posterData.moonSign} Moon, ${posterData.sunSign} Sun\n\nCreate yours at dekhopanchang.com`,
                                  files: [file],
                                });
                              } else {
                                // Desktop fallback: download the image
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${posterData.name}-birth-chart.png`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }
                            } catch (err) {
                              if (err instanceof Error && err.name === 'AbortError') return;
                              console.error('[kundali] share image failed:', err);
                              // Final fallback: copy link
                              const linkUrl = `${window.location.origin}${cardUrl.replace('format=story', 'format=og')}`;
                              navigator.clipboard.writeText(linkUrl).catch(() => {});
                            }
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg bg-gradient-to-r from-gold-primary/20 to-amber-500/20 border border-gold-primary/40 text-gold-light hover:from-gold-primary/30 hover:to-amber-500/30 hover:border-gold-primary/60 transition-all shadow-lg shadow-gold-primary/5"
                        >
                          <Share2 className="w-4 h-4" />
                          {locale === 'hi' ? 'चार्ट शेयर करें' : 'Share Your Chart'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Inline Chart Commentary ── */}
              {(() => {
                const vargaData = generateVargaTippanni(kundali, locale as Locale);
                const chartInsight = vargaData.vargaInsights.find(v =>
                  v.chart === activeChart || (activeChart === 'bhav_chalit' && v.chart === 'BC')
                );
                if (!chartInsight) return null;
                const isHi = isDevanagariLocale(locale);
                const sC: Record<string, string> = { strong: 'border-emerald-500/20', moderate: 'border-amber-500/20', weak: 'border-red-500/20' };
                const sL: Record<string, string> = { strong: msg('strongLabel', locale), moderate: msg('moderateLabel', locale), weak: msg('weakLabel', locale) };
                const sClr: Record<string, string> = { strong: 'text-emerald-400', moderate: 'text-amber-400', weak: 'text-red-400' };
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeChart}
                    className={`mt-8 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border ${sC[chartInsight.strength]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gold-light font-bold text-sm" style={headingFont}>
                        {chartInsight.chart} — {tl(chartInsight.meaning, locale)}
                      </h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sC[chartInsight.strength]} ${sClr[chartInsight.strength]}`}>
                        {sL[chartInsight.strength]}
                      </span>
                    </div>

                    {/* Overall Commentary */}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3 whitespace-pre-line">
                      {tl(chartInsight.overallCommentary, locale)}
                    </div>

                    {/* Key Findings */}
                    {chartInsight.keyFindings.length > 0 && (
                      <div className="mb-3">
                        <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1.5">
                          {msg('keyFindings', locale)}
                        </div>
                        <div className="space-y-1">
                          {chartInsight.keyFindings.map((f, j) => (
                            <div key={j} className="text-text-secondary text-xs leading-relaxed flex gap-2">
                              <span className="text-gold-dark mt-0.5 shrink-0">•</span>
                              <span>{tl(f, locale)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prognosis */}
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                      <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-1">
                        {msg('yearPrognosis', locale)}
                      </div>
                      <div className="text-text-secondary text-xs leading-relaxed">
                        {tl(chartInsight.prognosis, locale)}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Planet legend below charts */}
              <div className="mt-8 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
                <h4 className="text-gold-dark text-xs uppercase tracking-wider mb-4 text-center">{locale === 'en' || isTamil ? 'Planets in Chart' : 'कुण्डली में ग्रह'}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {kundali.planets.map((p) => (
                    <motion.button
                      key={p.planet.id}
                      onClick={() => handleSelectPlanet(p.planet.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                        selectedPlanet === p.planet.id
                          ? 'border-gold-primary/50 bg-gold-primary/10'
                          : 'border-gold-primary/10 hover:border-gold-primary/25 bg-bg-primary/40'
                      }`}
                    >
                      <GrahaIconById id={p.planet.id} size={28} />
                      <div className="text-left">
                        <div className="text-sm font-bold" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>
                          {tl(p.planet.name, locale)}
                        </div>
                        <div className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tl(p.signName, locale)} &middot; H{p.house}
                          {p.isRetrograde ? ' (R)' : ''}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Selected house detail panel */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {selectedHouse && (
                    <HouseDetailPanel
                      key={selectedHouse}
                      houseNum={selectedHouse}
                      kundali={kundali}
                      locale={locale}
                      isDevanagari={isDevanagari}
                      onClose={() => { setSelectedHouse(null); setSelectedPlanet(null); }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* JYOTISH-16: Transit Activation of Natal Promise */}
              {(() => {
                const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;
                // Current Mahadasha lord
                const currentMaha = kundali.dashas.find(d => {
                  const now = new Date();
                  return d.level === 'maha' && new Date(d.startDate) <= now && new Date(d.endDate) >= now;
                });
                if (!currentMaha || !transitData) return null;

                const mahaLordId = ['Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus']
                  .indexOf(typeof currentMaha.planet === 'string' ? currentMaha.planet : (currentMaha.planet as { en: string }).en);
                const mahaHouse = kundali.planets.find(p => p.planet.id === mahaLordId)?.house ?? 0;
                const mahaOwnedHouses = kundali.houses
                  .filter(h => {
                    const lordSign = h.sign;
                    const SIGN_LORD_MAP: Record<number,number> = {1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4};
                    return SIGN_LORD_MAP[lordSign] === mahaLordId;
                  })
                  .map(h => h.house);

                // Life area checks — 5 core domains
                const LIFE_AREAS = [
                  {
                    area: { en: 'Marriage / Partnership', hi: 'विवाह / साझेदारी', sa: 'विवाह / साझेदारी', mai: 'विवाह / साझेदारी', mr: 'विवाह / साझेदारी', ta: 'திருமணம் / கூட்டு', te: 'వివాహం / భాగస్వామ్యం', bn: 'বিবাহ / অংশীদারিত্ব', kn: 'ವಿವಾಹ / ಪಾಲುದಾರಿಕೆ', gu: 'લગ્ન / ભાગીદારી' },
                    natHouse: 7, // Natal 7H lord in kendra/trikona = natal promise
                    transitPlanet: 4, // Jupiter transiting 7H = transit confirmation
                    dashaHouses: [7, 2], // Dasha activating 7H or 2H
                  },
                  {
                    area: { en: 'Career / Authority', hi: 'कैरियर / अधिकार', sa: 'कैरियर / अधिकार', mai: 'कैरियर / अधिकार', mr: 'कैरियर / अधिकार', ta: 'தொழில் / அதிகாரம்', te: 'వృత్తి / అధికారం', bn: 'কর্মজীবন / কর্তৃত্ব', kn: 'ವೃತ್ತಿ / ಅಧಿಕಾರ', gu: 'કારકિર્દી / સત્તા' },
                    natHouse: 10,
                    transitPlanet: 4, // Jupiter on 10H
                    dashaHouses: [10, 1, 9],
                  },
                  {
                    area: { en: 'Children / Creativity', hi: 'संतान / रचनात्मकता', sa: 'संतान / रचनात्मकता', mai: 'संतान / रचनात्मकता', mr: 'संतान / रचनात्मकता', ta: 'குழந்தைகள் / படைப்பாற்றல்', te: 'సంతానం / సృజనాత్మకత', bn: 'সন্তান / সৃজনশীলতা', kn: 'ಮಕ್ಕಳು / ಸೃಜನಶೀಲತೆ', gu: 'સંતાન / સર્જનાત્મકતા' },
                    natHouse: 5,
                    transitPlanet: 4, // Jupiter on 5H
                    dashaHouses: [5, 9],
                  },
                  {
                    area: { en: 'Wealth / Gains', hi: 'धन / लाभ', sa: 'धन / लाभ', mai: 'धन / लाभ', mr: 'धन / लाभ', ta: 'செல்வம் / லாபம்', te: 'ధనం / లాభం', bn: 'ধন / লাভ', kn: 'ಧನ / ಲಾಭ', gu: 'ધન / લાભ' },
                    natHouse: 11,
                    transitPlanet: 4, // Jupiter on 2H or 11H
                    dashaHouses: [2, 11],
                  },
                  {
                    area: { en: 'Relocation / Abroad', hi: 'स्थानान्तरण / विदेश', sa: 'स्थानान्तरण / विदेश', mai: 'स्थानान्तरण / विदेश', mr: 'स्थानान्तरण / विदेश', ta: 'இடமாற்றம் / வெளிநாடு', te: 'స్థలమార్పు / విదేశం', bn: 'স্থানান্তর / বিদেশ', kn: 'ಸ್ಥಳಾಂತರ / ವಿದೇಶ', gu: 'સ્થળાંતર / વિદેશ' },
                    natHouse: 12,
                    transitPlanet: 6, // Saturn on 12H or Rahu
                    dashaHouses: [12, 9, 3],
                  },
                ];

                const results = LIFE_AREAS.map(la => {
                  // 1. Natal promise — lord of natHouse in kendra (1,4,7,10) or trikona (1,5,9)
                  const houseData = kundali.houses.find(h => h.house === la.natHouse);
                  const lordSign = houseData?.sign ?? 0;
                  const SIGN_LORD: Record<number,number> = {1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4};
                  const lordId = SIGN_LORD[lordSign];
                  const lordPlanet = kundali.planets.find(p => p.planet.id === lordId);
                  const lordHouse = lordPlanet?.house ?? 0;
                  const kendraTrikona = new Set([1, 4, 5, 7, 9, 10]);
                  const natalPromise = kendraTrikona.has(lordHouse);

                  // 2. Dasha activation — current Mahadasha lord owns or occupies relevant house
                  const dashaConfirm = la.dashaHouses.includes(mahaHouse) ||
                    la.dashaHouses.some(h => mahaOwnedHouses.includes(h));

                  // 3. Transit — relevant planet in the target house
                  const transitPlanetData = transitData?.planets.find(p => p.id === la.transitPlanet);
                  const transitSign = transitPlanetData?.rashi ?? 0;
                  // House of transit planet = which house (from lagna) that sign occupies
                  const lagnaSign = kundali.ascendant.sign;
                  const transitHouseFromLagna = transitSign > 0 ? ((transitSign - lagnaSign + 12) % 12) + 1 : 0;
                  const transitConfirm = la.dashaHouses.includes(transitHouseFromLagna);

                  const confirmCount = [natalPromise, dashaConfirm, transitConfirm].filter(Boolean).length;

                  return { ...la, natalPromise, dashaConfirm, transitConfirm, confirmCount, lordPlanet, lordHouse };
                }).sort((a, b) => b.confirmCount - a.confirmCount);

                const highProbability = results.filter(r => r.confirmCount >= 3);
                const moderate = results.filter(r => r.confirmCount === 2);
                const showing = [...highProbability, ...moderate].slice(0, 5);

                return (
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-5">
                    <h3 className="text-gold-gradient text-lg font-bold mb-1 text-center" style={headingFont}>
                      {lk === 'en' ? 'Transit Activation of Natal Promise' : 'गोचर द्वारा जन्म वादे की सक्रियता'}
                    </h3>
                    <p className="text-text-secondary/70 text-xs text-center mb-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {lk === 'en'
                        ? `Current Mahadasha: ${typeof currentMaha.planet === 'string' ? currentMaha.planet : (currentMaha.planet as { en: string }).en} — events manifest when Natal Promise + Dasha + Transit align. Source: Nadi tradition, BPHS transit chapters.`
                        : `वर्तमान महादशा — नटाल वादा + दशा + गोचर एकसाथ होने पर घटनाएँ घटित होती हैं।`}
                    </p>
                    <div className="space-y-3">
                      {showing.map((r, i) => (
                        <div key={i} className={`rounded-xl p-3 border ${r.confirmCount >= 3 ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 bg-bg-primary/20'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gold-light font-semibold text-sm" style={headingFont}>{r.area[lk === 'en' ? 'en' : 'hi']}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.confirmCount >= 3 ? 'bg-gold-primary/20 text-gold-light' : 'bg-amber-500/15 text-amber-400'}`}>
                              {r.confirmCount}/3 {lk === 'en' ? 'confirmed' : 'पुष्ट'}
                            </span>
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded ${r.natalPromise ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary/55 bg-bg-primary/20'}`}>
                              {lk === 'en' ? 'Natal Promise' : 'जन्म वादा'} {r.natalPromise ? '✓' : '✗'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${r.dashaConfirm ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary/55 bg-bg-primary/20'}`}>
                              {lk === 'en' ? `Dasha (${typeof currentMaha.planet === 'string' ? currentMaha.planet : (currentMaha.planet as { en: string }).en})` : 'दशा'} {r.dashaConfirm ? '✓' : '✗'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${r.transitConfirm ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary/55 bg-bg-primary/20'}`}>
                              {lk === 'en' ? 'Transit' : 'गोचर'} {r.transitConfirm ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {showing.length === 0 && (
                        <p className="text-text-secondary/70 text-xs text-center py-4">
                          {lk === 'en' ? 'No life areas currently show triple alignment. Enable transit overlay for real-time data.' : 'कोई क्षेत्र तीनों शर्तें पूरी नहीं करता। गोचर ओवरले सक्षम करें।'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Transit Radar — Gochara with Vedha + Double Transit (inside chart tab for visibility) */}
              {kundali.ashtakavarga && (
                <div className="mt-8">
                  <a href={`/${locale}/learn/transits`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-2">
                    {locale === 'en' || isTamil ? 'Current Transits (Gochara) \u2192' : 'वर्तमान गोचर \u2192'}
                  </a>
                  <Suspense fallback={<div className="text-center py-8 text-text-secondary">Loading...</div>}>
                    <TransitRadar
                      ascendantSign={kundali.ascendant.sign}
                      savTable={kundali.ashtakavarga.savTable}
                      locale={locale}
                      natalMoonSign={kundali.planets.find(p => p.planet.id === 1)?.sign}
                      reducedBav={kundali.ashtakavarga.reducedBpiTable}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          )}

          {/* ===== PLANETS TAB ===== */}
          {activeTab === 'planets' && (
            <div className="space-y-3">
              <a href={`/${locale}/learn/planets`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Planets \u2192' : 'ग्रहों के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-planets"
                title={locale === 'en' || isTamil ? 'What do Planet Positions mean?' : 'ग्रह स्थितियों का क्या अर्थ है?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil
                  ? 'Each planet represents a force in your life: Sun=ego/authority/father, Moon=mind/emotions/mother, Mars=energy/courage/property, Mercury=communication/business/intellect, Jupiter=wisdom/children/wealth, Venus=love/marriage/luxury, Saturn=discipline/karma/hard work, Rahu=ambition/foreign/technology, Ketu=spirituality/detachment/liberation. The SIGN a planet is in colors its expression. The HOUSE it occupies determines which life area it affects. Retrograde (R) planets work inwardly — their effects are felt more internally.'
                  : 'प्रत्येक ग्रह आपके जीवन में एक शक्ति का प्रतिनिधित्व करता है: सूर्य=अहंकार/अधिकार/पिता, चंद्र=मन/भावनाएं/माता, मंगल=ऊर्जा/साहस/संपत्ति, बुध=संचार/व्यापार/बुद्धि, गुरु=ज्ञान/संतान/धन, शुक्र=प्रेम/विवाह/विलास, शनि=अनुशासन/कर्म/परिश्रम, राहु=महत्वाकांक्षा/विदेश/तकनीक, केतु=आध्यात्म/वैराग्य/मोक्ष। ग्रह जिस राशि में हो वह उसकी अभिव्यक्ति रंगती है। जिस भाव में हो वह जीवन क्षेत्र प्रभावित होता है। वक्री (R) ग्रह अंतर्मुखी होकर कार्य करते हैं।'}
              </InfoBlock>
              {/* Badge Legend */}
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/10 p-4">
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2.5">
                  {locale === 'en' || isTamil ? 'Badge Guide' : 'बैज मार्गदर्शिका'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold px-1.5 py-0.5 bg-red-500/10 rounded shrink-0">R</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Retrograde — planet appears to move backward; its energy turns inward, causing delays but deeper insight' : 'वक्री — ग्रह पीछे चलता दिखता है; ऊर्जा अंतर्मुखी, विलम्ब पर गहन अंतर्दृष्टि'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded shrink-0">{locale === 'en' || isTamil ? 'Exalted' : 'उच्च'}</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Planet at peak strength — delivers its best results with full confidence' : 'ग्रह चरम शक्ति पर — पूर्ण आत्मविश्वास से सर्वोत्तम फल'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 font-bold px-1.5 py-0.5 bg-orange-500/10 rounded shrink-0">{locale === 'en' || isTamil ? 'Debilitated' : 'नीच'}</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Planet at weakest expression — struggles to deliver, needs remedial support' : 'ग्रह सबसे कमज़ोर — फल देने में संघर्ष, उपचार आवश्यक'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded shrink-0">{locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह'}</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Planet in its own sign — comfortable and reliable, like being at home' : 'ग्रह अपनी राशि में — सहज और विश्वसनीय, अपने घर जैसा'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-light font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30 shrink-0">Vgm</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Vargottama — same sign in birth chart & navamsha; exceptionally strong and reliable' : 'वर्गोत्तम — D1 और D9 में समान राशि; अत्यंत बलवान और विश्वसनीय'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded shrink-0">MB</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Mrityu Bhaga — planet at a vulnerable degree; health and that planet\'s themes need extra care' : 'मृत्यु भाग — संवेदनशील अंश; स्वास्थ्य और उस ग्रह के विषयों पर ध्यान दें'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-300 font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20 shrink-0">Pushkar Nav.</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Pushkar Navamsha — planet in a supremely auspicious navamsha; greatly amplifies positive results' : 'पुष्कर नवांश — अत्यंत शुभ नवांश; सकारात्मक फलों में भारी वृद्धि'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-400/20 shrink-0">Pushkar Bh.</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Pushkar Bhaga — most auspicious degree in the sign; greatly strengthens this planet' : 'पुष्कर भाग — राशि में सर्वाधिक शुभ अंश; ग्रह को अत्यंत बल'}</span>
                  </div>
                </div>
              </div>
              {kundali.planets.map((p) => (
                <motion.div
                  key={p.planet.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: p.planet.id * 0.04 }}
                  onClick={() => handleSelectPlanet(p.planet.id)}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 cursor-pointer transition-all border ${
                    selectedPlanet === p.planet.id
                      ? 'border-gold-primary/40 bg-gold-primary/5'
                      : 'border-transparent hover:border-gold-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <GrahaIconById id={p.planet.id} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                          {tl(p.planet.name, locale)}
                        </span>
                        {p.isRetrograde && <span className="text-red-400 text-xs font-bold px-1.5 py-0.5 bg-red-500/10 rounded">R</span>}
                        {p.isExalted && <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">{locale === 'en' || isTamil ? 'Exalted' : 'उच्च'}</span>}
                        {p.isDebilitated && <span className="text-orange-400 text-xs font-bold px-1.5 py-0.5 bg-orange-500/10 rounded">{locale === 'en' || isTamil ? 'Debilitated' : 'नीच'}</span>}
                        {p.isOwnSign && <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">{locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह'}</span>}
                        {p.isVargottama && <span className="text-gold-light text-xs font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30" title={locale === 'en' || isTamil ? 'Same sign in D1 & D9 — strength equal to double exaltation' : 'वर्गोत्तम — D1 और D9 में एक ही राशि'}>Vgm</span>}
                        {p.isMrityuBhaga && <span className="text-rose-400 text-xs font-bold px-1.5 py-0.5 bg-rose-500/10 rounded" title={locale === 'en' || isTamil ? 'At or near Mrityu Bhaga — dangerous degree, severely weakened' : 'मृत्यु भाग — खतरनाक अंश, बल में गिरावट'}>MB</span>}
                        {p.isPushkarNavamsha && <span className="text-sky-300 text-xs font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20" title={locale === 'en' || isTamil ? 'Pushkar Navamsha — supremely auspicious navamsha position' : 'पुष्कर नवांश — अत्यंत शुभ नवांश स्थिति'}>Pushkar Nav.</span>}
            {p.isPushkarBhaga && <span className="text-emerald-300 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-400/20" title={locale === 'en' || isTamil ? 'Pushkar Bhaga — most auspicious degree in the sign. Greatly strengthens this planet.' : 'पुष्कर भाग — राशि में सर्वाधिक शुभ अंश। ग्रह को अत्यंत बल मिलता है।'}>Pushkar Bh.</span>}
                      </div>
                      <div className="text-text-secondary text-sm mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Sign:' : 'राशि:'}</span>{' '}
                          <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(p.signName, locale)}</span>
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || isTamil ? 'House:' : 'भाव:'}</span> {p.house}
                          <span className="text-text-secondary/60 text-xs ml-1">({getHouseSignifications(p.house, locale).split(',').slice(0, 2).join(',')})</span>
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Degree:' : 'अंश:'}</span>{' '}
                          <span className="font-mono">{p.degree}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {tl(p.nakshatra.name, locale)}
                      </div>
                      <div className="text-gold-dark/60 text-xs">
                        {locale === 'en' || isTamil ? 'Pada' : 'पाद'} {p.pada}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPlanet === p.planet.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gold-primary/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Nakshatra' : 'नक्षत्र'}</span>
                            <p className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {tl(p.nakshatra.name, locale)} (P{p.pada})
                            </p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Longitude' : 'अंश'}</span>
                            <p className="text-text-secondary font-mono">{p.longitude.toFixed(4)}°</p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Speed' : 'गति'}</span>
                            <p className="text-text-secondary font-mono">{p.speed.toFixed(4)}°/d</p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Latitude' : 'अक्षांश'}</span>
                            <p className="text-text-secondary font-mono">{p.latitude.toFixed(4)}°</p>
                          </div>
                        </div>
                        {/* Commentary from tippanni */}
                        {tip && (() => {
                          const insight = tip.planetInsights.find(pi => pi.planetId === p.planet.id);
                          if (!insight) return null;
                          return (
                            <div className="mt-4 space-y-3">
                              <p className="text-text-secondary text-sm leading-relaxed">{insight.description}</p>
                              {insight.dignity && (
                                <div className="p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                                  <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Dignity' : 'गरिमा'}</p>
                                  <p className="text-text-secondary text-sm">{insight.dignity}</p>
                                </div>
                              )}
                              {insight.retrogradeEffect && (
                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                  <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Retrograde Effect' : 'वक्री प्रभाव'}</p>
                                  <p className="text-text-secondary text-sm">{insight.retrogradeEffect}</p>
                                </div>
                              )}
                              {insight.implications && (
                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                  <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Life Impact' : 'जीवन प्रभाव'}</p>
                                  <p className="text-text-secondary text-sm">{insight.implications}</p>
                                </div>
                              )}
                              {insight.prognosis && (
                                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                                  <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Prognosis' : 'पूर्वानुमान'}</p>
                                  <p className="text-text-secondary text-sm">{insight.prognosis}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <PlanetsInterpretation planets={kundali.planets} ascendant={kundali.ascendant} locale={locale} />

              {/* ── Functional Nature per Lagna ── */}
              {kundali.functionalNature && (() => {
                const fn = kundali.functionalNature!;
                const COLOR: Record<string, string> = {
                  yogaKaraka:  'bg-gold-primary/25 text-gold-light border-gold-primary/30',
                  funcBenefic: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
                  neutral:     'bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] text-text-secondary/70 border-gold-primary/8',
                  funcMalefic: 'bg-red-500/12 text-red-400 border-red-500/20',
                  maraka:      'bg-orange-500/15 text-orange-300 border-orange-500/20',
                  badhak:      'bg-purple-500/15 text-purple-300 border-purple-500/20',
                };
                return (
                  <div className="mt-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-5">
                    <div className="text-gold-primary/80 text-xs uppercase tracking-wider font-bold mb-1">
                      {locale === 'en' || isTamil ? 'Functional Nature per Lagna (Laghu Parashari)' : 'लग्न अनुसार क्रियात्मक स्वभाव'}
                    </div>
                    <p className="text-text-secondary/65 text-[11px] mb-1">
                      {locale === 'en' || isTamil
                        ? `For ${kundali.ascendant.signName.en} lagna — based on which houses each planet rules`
                        : `${kundali.ascendant.signName.hi} लग्न के लिए — प्रत्येक ग्रह किस भाव का स्वामी है`}
                    </p>
                    <p className="text-text-secondary/55 text-[10px] mb-4 italic">
                      {locale === 'en' || isTamil
                        ? 'Lords = houses this planet rules · In = house where it is placed in your birth chart (these are different things)'
                        : 'भावेश = ग्रह किस भाव का स्वामी है · स्थान = ग्रह किस भाव में है (ये दो अलग बातें हैं)'}
                    </p>
                    {/* Summary badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {fn.yogaKaraka !== null && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gold-primary/20 text-gold-light border border-gold-primary/30 font-bold">
                          {locale === 'en' || isTamil ? 'Yoga Karaka:' : 'योगकारक:'} {GRAHAS.find(g => g.id === fn.yogaKaraka)?.name.en || '—'}
                        </span>
                      )}
                      {fn.marakaLords.map(id => (
                        <span key={id} className="text-xs px-2 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20 font-semibold">
                          {locale === 'en' || isTamil ? 'Maraka:' : 'मारक:'} {GRAHAS.find(g => g.id === id)?.name.en || '—'}
                        </span>
                      ))}
                      {fn.badhakLord !== null && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-semibold">
                          {locale === 'en' || isTamil ? `Badhak (${fn.badhakHouse}H):` : `बाधक (${fn.badhakHouse}वाँ):`} {GRAHAS.find(g => g.id === fn.badhakLord)?.name.en || '—'}
                        </span>
                      )}
                    </div>
                    {/* Grid of all 7 planets */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {fn.planets.map(p => {
                        const placedInHouse = kundali.planets.find(pl => pl.planet.id === p.planetId)?.house;
                        return (
                          <div key={p.planetId} className={`rounded-lg border p-2.5 ${COLOR[p.nature] || COLOR.neutral}`}>
                            <div className="font-bold text-sm mb-0.5" style={headingFont}>
                              {locale === 'en' || isTamil ? p.planetName.en : p.planetName.hi}
                            </div>
                            <div className="text-[10px] font-semibold mb-1 opacity-80">
                              {p.label[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </div>
                            <div className="text-[10px] opacity-60 font-mono">
                              {locale === 'en' || isTamil ? `Lords ${p.houseRulership.join(', ')}H` : `${p.houseRulership.join(', ')}वें भाव`}
                            </div>
                            {placedInHouse !== undefined && (
                              <div className="text-[10px] opacity-45 font-mono mt-0.5">
                                {locale === 'en' || isTamil ? `Placed in ${placedInHouse}H` : `${placedInHouse}वें भाव में`}
                              </div>
                            )}
                            {p.note && (
                              <div className="text-[10px] opacity-55 mt-1 leading-tight" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {p.note[locale === 'en' || isTamil ? 'en' : 'hi']}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ── Graha Yuddha (Planetary War) ── */}
              {kundali.grahaYuddha && kundali.grahaYuddha.length > 0 && (
                <div className="mt-4 rounded-xl bg-gradient-to-br from-red-900/20 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/30 p-5">
                  <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-3">
                    {locale === 'en' || isTamil ? '⚔ Graha Yuddha — Planetary War' : '⚔ ग्रह युद्ध'}
                  </div>
                  <div className="space-y-4">
                    {kundali.grahaYuddha.map((gy, i) => (
                      <div key={i} className="border-t border-red-500/15 pt-3 first:border-0 first:pt-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-gold-light font-bold text-sm">{gy.planet1Name[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-red-400 font-bold">⚔</span>
                          <span className="text-gold-light font-bold text-sm">{gy.planet2Name[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-text-secondary/70 text-xs font-mono">({gy.separation.toFixed(2)}°)</span>
                          <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs rounded-full font-bold border border-emerald-500/20">
                            {locale === 'en' || isTamil ? 'Winner:' : 'विजयी:'} {gy.winnerName[locale as 'en' | 'hi' | 'sa']}
                          </span>
                          <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs rounded-full font-bold border border-red-500/20">
                            {locale === 'en' || isTamil ? 'Loser:' : 'पराजित:'} {gy.loserName[locale as 'en' | 'hi' | 'sa']}
                          </span>
                        </div>
                        <p className="text-text-secondary/80 text-xs leading-relaxed">
                          {gy.interpretation[locale as 'en' | 'hi' | 'sa']}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== DASHA TAB ===== */}
          {activeTab === 'dasha' && (
            <div className="space-y-3">
              <details className="mb-1 bg-white/[0.02] border border-gold-primary/10 rounded-xl group" open>
                <summary className="px-5 py-3 cursor-pointer text-sm text-gold-primary hover:text-gold-light transition-colors">
                  {locale === 'en' || isTamil ? 'What are Dashas?' : 'दशाएँ क्या हैं?'}
                </summary>
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                  {locale === 'en' || isTamil
                    ? 'Dashas are planetary time periods unique to your chart — a cosmic timetable showing which planet rules each phase of your life. The Vimshottari system divides life into 120 years across 9 planetary periods (Mahadasha), each subdivided into Antardasha and Pratyantardasha. During a planet\'s dasha, that planet\'s themes, houses, and significations become dominant in your life. The timeline below shows your complete dasha sequence — the highlighted band is your current period.'
                    : 'दशाएँ आपकी कुण्डली के अनुसार ग्रहीय समय-खण्ड हैं — एक ब्रह्माण्डीय समय-सारणी जो बताती है कि जीवन के किस चरण पर कौन-सा ग्रह शासन करता है। विंशोत्तरी पद्धति जीवन को 120 वर्षों में 9 ग्रहीय महादशाओं में विभाजित करती है। किसी ग्रह की दशा में उस ग्रह के विषय प्रबल होते हैं।'}
                </div>
              </details>
              {/* Timeline mode toggle: Dashas Only vs Unified (Dashas + Transits) */}
              {kundali.dashas && kundali.dashas.length > 0 && (
                <>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.06] w-fit">
                    <button
                      onClick={() => setDashaViewMode('dashas')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        dashaViewMode === 'dashas'
                          ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {locale === 'en' || isTamil ? 'Dashas Only' : 'केवल दशा'}
                    </button>
                    <button
                      onClick={() => setDashaViewMode('unified')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        dashaViewMode === 'unified'
                          ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {locale === 'en' || isTamil ? 'Unified (Dashas + Transits)' : 'एकीकृत (दशा + गोचर)'}
                    </button>
                  </div>

                  {dashaViewMode === 'dashas' ? (
                    <DashaTimeline
                      dashas={kundali.dashas}
                      birthDate={kundali.birthData.date}
                      locale={locale}
                    />
                  ) : (
                    <UnifiedTimeline
                      dashas={kundali.dashas}
                      keyDates={keyDates}
                      locale={locale}
                    />
                  )}
                </>
              )}
              <a href={`/${locale}/learn/dashas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Dashas \u2192' : 'दशा के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-dasha"
                title={locale === 'en' || isTamil ? 'What is a Dasha? (Your Life Chapters)' : 'दशा क्या है? (आपके जीवन के अध्याय)'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p>A <strong>Dasha</strong> is a planetary period — a specific chunk of time when one planet &quot;runs the show&quot; in your life. Think of it like chapters in a book: during a Jupiter Dasha, your life chapter is about wisdom, growth, and expansion; during a Saturn Dasha, the chapter is about hard work, discipline, and karmic lessons.</p>
                    <p><strong>How is it calculated?</strong> Vimshottari Dasha (the most widely used system) is based on your <em>Moon nakshatra at birth</em>. The system assigns each of 9 planets a fixed number of years: Ketu 7yr, Venus 20yr, Sun 6yr, Moon 10yr, Mars 7yr, Rahu 18yr, Jupiter 16yr, Saturn 19yr, Mercury 17yr — totaling 120 years. Within each Mahadasha (main period), there are sub-periods called Antardasha, and within those, Pratyantardasha — increasingly fine time slices.</p>
                    <p><strong>What this means for you:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li>Your <strong className="text-gold-light">current Mahadasha</strong> defines the main theme of this phase of your life. Check which planet you&apos;re under and read its forecast.</li>
                      <li>Your <strong className="text-gold-light">current Antardasha</strong> (sub-period) fine-tunes the energy — a beneficial Antardasha within a difficult Mahadasha can still bring relief.</li>
                      <li>Planets that are <strong className="text-emerald-400">strong in your chart</strong> give excellent results during their Dasha. Weak planets give challenging periods but also the most growth.</li>
                      <li>You cannot change your Dasha timing, but you CAN change how you respond — Dashas point to themes, not fixed outcomes.</li>
                    </ul>
                    <p className="text-text-secondary/70 text-xs"><strong>Which system to use?</strong> Start with <em>Vimshottari</em> (most tested, most widely used). Use other systems for additional confirmation once you understand the basics.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>दशा</strong> एक ग्रह काल है — एक विशिष्ट समय जब एक ग्रह आपके जीवन को चलाता है। इसे किसी किताब के अध्यायों की तरह सोचें: बृहस्पति दशा में जीवन ज्ञान और विस्तार का अध्याय है; शनि दशा में कठिन परिश्रम और कर्म पाठों का।</p>
                    <p><strong>गणना कैसे होती है?</strong> विंशोत्तरी दशा आपके जन्म चन्द्र नक्षत्र पर आधारित है। 9 ग्रहों को निश्चित वर्ष मिलते हैं — कुल 120 वर्ष। महादशा में अन्तर्दशा और प्रत्यन्तर्दशा होती हैं।</p>
                    <p><strong>आपके लिए इसका अर्थ:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li>आपकी वर्तमान <strong className="text-gold-light">महादशा</strong> इस जीवन चरण का मुख्य विषय है।</li>
                      <li>वर्तमान <strong className="text-gold-light">अन्तर्दशा</strong> ऊर्जा को सूक्ष्म बनाती है।</li>
                      <li>कुण्डली में <strong className="text-emerald-400">बलवान ग्रह</strong> अपनी दशा में उत्कृष्ट परिणाम देते हैं।</li>
                      <li>दशा का समय नहीं बदल सकते, पर अपनी प्रतिक्रिया बदल सकते हैं।</li>
                    </ul>
                  </div>
                )}
              </InfoBlock>

              {/* Dasha system selector */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {[
                  { key: 'vimshottari', label: locale === 'en' || isTamil ? 'Vimshottari' : 'विंशोत्तरी', desc: locale === 'en' || isTamil ? '120yr cycle based on Moon nakshatra — most widely used' : 'चन्द्र नक्षत्र आधारित 120 वर्ष — सर्वाधिक प्रचलित' },
                  ...(kundali.yoginiDashas ? [{ key: 'yogini', label: locale === 'en' || isTamil ? 'Yogini' : 'योगिनी', desc: locale === 'en' || isTamil ? '36yr cycle — fast-moving, good for timing events' : '36 वर्ष — तीव्र, घटनाओं के समय हेतु' }] : []),
                  ...(kundali.ashtottariDashas ? [{ key: 'ashtottari', label: locale === 'en' || isTamil ? 'Ashtottari' : 'अष्टोत्तरी', desc: locale === 'en' || isTamil ? '108yr cycle — used when Rahu is in a kendra/trikona' : '108 वर्ष — राहु केन्द्र/त्रिकोण में हो तब' }] : []),
                  ...(kundali.narayanaDasha ? [{ key: 'narayana', label: locale === 'en' || isTamil ? 'Narayana' : 'नारायण', desc: locale === 'en' || isTamil ? 'Sign-based — shows external life events and environment' : 'राशि आधारित — बाह्य जीवन घटनाएँ' }] : []),
                  ...(kundali.kalachakraDasha ? [{ key: 'kalachakra', label: locale === 'en' || isTamil ? 'Kalachakra' : 'कालचक्र', desc: locale === 'en' || isTamil ? 'Wheel of Time — navamsha-based, complex and precise' : 'कालचक्र — नवांश आधारित, सूक्ष्म' }] : []),
                  ...(kundali.sthiraDasha ? [{ key: 'sthira', label: locale === 'en' || isTamil ? 'Sthira' : 'स्थिर', desc: locale === 'en' || isTamil ? 'Fixed sign dasha — for longevity analysis' : 'स्थिर राशि — आयु विश्लेषण हेतु' }] : []),
                  ...(kundali.shoolaDasha ? [{ key: 'shoola', label: locale === 'en' || isTamil ? 'Shoola' : 'शूल', desc: locale === 'en' || isTamil ? 'Pain/death indicator — used in medical astrology' : 'कष्ट/मृत्यु सूचक — चिकित्सा ज्योतिष' }] : []),
                  { key: 'shodasottari', label: locale === 'en' || isTamil ? 'Shodasottari' : 'षोडशोत्तरी', desc: locale === 'en' || isTamil ? '116yr — for night births in Krishna Paksha' : '116 वर्ष — कृष्ण पक्ष रात्रि जन्म हेतु' },
                  { key: 'dwadasottari', label: locale === 'en' || isTamil ? 'Dwadasottari' : 'द्वादशोत्तरी', desc: locale === 'en' || isTamil ? '112yr — for Shukla Paksha births with Venus in lagna' : '112 वर्ष — शुक्ल पक्ष, शुक्र लग्न में' },
                  { key: 'panchottari', label: locale === 'en' || isTamil ? 'Panchottari' : 'पंचोत्तरी', desc: locale === 'en' || isTamil ? '105yr — for Cancer lagna births' : '105 वर्ष — कर्क लग्न हेतु' },
                  { key: 'satabdika', label: locale === 'en' || isTamil ? 'Satabdika' : 'शताब्दिका', desc: locale === 'en' || isTamil ? '100yr — for Vargottama lagna births' : '100 वर्ष — वर्गोत्तम लग्न हेतु' },
                  { key: 'chaturaaseethi', label: locale === 'en' || isTamil ? 'Chaturaaseethi' : 'चतुराशीति', desc: locale === 'en' || isTamil ? '84yr — for day births in Shukla Paksha' : '84 वर्ष — शुक्ल पक्ष दिवस जन्म' },
                  { key: 'shashtihayani', label: locale === 'en' || isTamil ? 'Shashtihayani' : 'षष्ठीहायनी', desc: locale === 'en' || isTamil ? '60yr — Sun in lagna, alternative timing' : '60 वर्ष — सूर्य लग्न में' },
                  { key: 'mandooka', label: locale === 'en' || isTamil ? 'Mandooka' : 'मण्डूक', desc: locale === 'en' || isTamil ? 'Frog leap dasha — signs jump in sequence' : 'मण्डूक — राशियाँ कूदकर चलतीं' },
                  { key: 'drig', label: locale === 'en' || isTamil ? 'Drig' : 'दृग्', desc: locale === 'en' || isTamil ? 'Aspect-based — signs with most aspects activate' : 'दृष्टि आधारित — सर्वाधिक दृष्ट राशि' },
                  { key: 'moola', label: locale === 'en' || isTamil ? 'Moola' : 'मूल', desc: locale === 'en' || isTamil ? '121yr — based on Moola Trikona positions' : '121 वर्ष — मूल त्रिकोण आधारित' },
                  { key: 'navamsha_dasha', label: locale === 'en' || isTamil ? 'Navamsha' : 'नवांश', desc: locale === 'en' || isTamil ? 'D9 chart based — for marriage and dharma timing' : 'D9 आधारित — विवाह और धर्म समय' },
                  { key: 'naisargika', label: locale === 'en' || isTamil ? 'Naisargika' : 'नैसर्गिक', desc: locale === 'en' || isTamil ? 'Natural order — fixed planetary periods by nature' : 'प्राकृतिक क्रम — नैसर्गिक ग्रह काल' },
                  { key: 'tara', label: locale === 'en' || isTamil ? 'Tara' : 'तारा', desc: locale === 'en' || isTamil ? 'Star-based — nakshatra lord sequences' : 'तारा — नक्षत्र स्वामी क्रम' },
                  { key: 'tithi_ashtottari', label: locale === 'en' || isTamil ? 'Tithi Ashtottari' : 'तिथि अष्टोत्तरी', desc: locale === 'en' || isTamil ? '108yr — based on birth tithi lord' : '108 वर्ष — जन्म तिथि स्वामी आधारित' },
                  { key: 'yoga_vimsottari', label: locale === 'en' || isTamil ? 'Yoga Vimsottari' : 'योग विंशोत्तरी', desc: locale === 'en' || isTamil ? 'Based on birth yoga — Sun+Moon combination' : 'जन्म योग आधारित — सूर्य+चन्द्र' },
                  { key: 'buddhi_gathi', label: locale === 'en' || isTamil ? 'Buddhi Gathi' : 'बुद्धि गति', desc: locale === 'en' || isTamil ? '100yr — intellectual development timing' : '100 वर्ष — बौद्धिक विकास समय' },
                ].map(dt => (
                  <button key={dt.key} onClick={() => setDashaSystem(dt.key)} title={dt.desc}
                    className={`px-4 py-1.5 rounded-lg text-xs transition-all ${dashaSystem === dt.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>
                    {dt.label}
                  </button>
                ))}
              </div>
              {/* Selected dasha description */}
              {(() => {
                const allSystems: { key: string; desc: LocaleText }[] = [
                  { key: 'vimshottari', desc: { en: 'The most widely used dasha system (BPHS Ch.20). Based on Moon\'s nakshatra at birth, it divides life into 9 planetary periods totaling 120 years. Each planet\'s dasha activates its significations — this is your primary life timeline.', hi: 'सर्वाधिक प्रचलित दशा पद्धति (BPHS अ.20)। जन्म नक्षत्र पर आधारित, 120 वर्षों में 9 ग्रह काल। यह आपकी प्राथमिक जीवन समयरेखा है।' } },
                  { key: 'yogini', desc: { en: 'A fast 36-year cycle with 8 yogini periods (Saravali). Excellent for timing short-term events — job changes, health episodes, travel. Repeats ~3 times in a lifetime, so each period carries different weight depending on age.', hi: '8 योगिनी कालों का 36 वर्षीय चक्र (सरावली)। लघु घटनाओं — नौकरी, स्वास्थ्य, यात्रा — के समय निर्धारण में उत्कृष्ट।', sa: '8 योगिनी कालों का 36 वर्षीय चक्र (सरावली)। लघु घटनाओं — नौकरी, स्वास्थ्य, यात्रा — के समय निर्धारण में उत्कृष्ट।', mai: '8 योगिनी कालों का 36 वर्षीय चक्र (सरावली)। लघु घटनाओं — नौकरी, स्वास्थ्य, यात्रा — के समय निर्धारण में उत्कृष्ट।', mr: '8 योगिनी कालों का 36 वर्षीय चक्र (सरावली)। लघु घटनाओं — नौकरी, स्वास्थ्य, यात्रा — के समय निर्धारण में उत्कृष्ट।', ta: '8 யோகினி காலங்களைக் கொண்ட 36 ஆண்டு வேக சுழற்சி (சாராவளி). குறுகிய கால நிகழ்வுகளான வேலை மாற்றம், உடல்நலம், பயணம் ஆகியவற்றுக்கு சிறந்தது. வாழ்நாளில் ~3 முறை மீண்டும் வருவதால், வயதுக்கேற்ப ஒவ்வொரு காலமும் வேறுபட்ட எடையைக் கொண்டிருக்கும்.', te: '8 యోగిని కాలాలతో 36 సంవత్సరాల వేగ చక్రం (సారావళి). ఉద్యోగ మార్పులు, ఆరోగ్య సంఘటనలు, ప్రయాణం వంటి స్వల్పకాలిక సమయ నిర్ణయానికి అద్భుతం. జీవితకాలంలో ~3 సార్లు పునరావృతమవుతుంది.', bn: '৮ যোগিনী কাল সহ ৩৬ বছরের দ্রুত চক্র (সারাবলী)। চাকরি পরিবর্তন, স্বাস্থ্য, ভ্রমণের মতো স্বল্পমেয়াদী ঘটনার সময় নির্ণয়ে চমৎকার। জীবদ্দশায় ~৩ বার পুনরাবৃত্ত হয়।', kn: '8 ಯೋಗಿನಿ ಅವಧಿಗಳೊಂದಿಗೆ 36 ವರ್ಷದ ವೇಗದ ಚಕ್ರ (ಸಾರಾವಳಿ). ಉದ್ಯೋಗ ಬದಲಾವಣೆ, ಆರೋಗ್ಯ, ಪ್ರಯಾಣದಂತಹ ಅಲ್ಪಾವಧಿ ಘಟನೆಗಳ ಸಮಯ ನಿರ್ಧಾರಕ್ಕೆ ಅತ್ಯುತ್ತಮ.', gu: '8 યોગિની કાળ સાથે 36 વર્ષનું ઝડપી ચક્ર (સારાવલી). નોકરી બદલાવ, આરોગ્ય, મુસાફરી જેવી ટૂંકા ગાળાની ઘટનાઓના સમય નિર્ધારણ માટે ઉત્તમ.' } },
                  { key: 'ashtottari', desc: { en: '108-year cycle using 8 planets (excludes Ketu). Applied when Rahu is in a kendra/trikona from lagna lord. Gives a second opinion on life timing — compare with Vimshottari to find overlapping themes.', hi: '108 वर्षीय चक्र, 8 ग्रह (केतु रहित)। जब राहु लग्नेश से केन्द्र/त्रिकोण में हो तब लागू। विंशोत्तरी से तुलना करके समान विषय खोजें।', sa: '108 वर्षीय चक्र, 8 ग्रह (केतु रहित)। जब राहु लग्नेश से केन्द्र/त्रिकोण में हो तब लागू। विंशोत्तरी से तुलना करके समान विषय खोजें।', mai: '108 वर्षीय चक्र, 8 ग्रह (केतु रहित)। जब राहु लग्नेश से केन्द्र/त्रिकोण में हो तब लागू। विंशोत्तरी से तुलना करके समान विषय खोजें।', mr: '108 वर्षीय चक्र, 8 ग्रह (केतु रहित)। जब राहु लग्नेश से केन्द्र/त्रिकोण में हो तब लागू। विंशोत्तरी से तुलना करके समान विषय खोजें।', ta: '8 கிரகங்களைப் பயன்படுத்தும் 108 ஆண்டு சுழற்சி (கேதுவைத் தவிர). லக்ன அதிபதியிலிருந்து ராகு கேந்திரம்/திரிகோணத்தில் இருக்கும்போது பயன்படும். விம்ஷோத்தரியுடன் ஒப்பிட்டு பொருந்தும் கருப்பொருள்களைக் கண்டறியுங்கள்.', te: '8 గ్రహాలతో 108 సంవత్సరాల చక్రం (కేతు మినహా). లగ్నాధిపతి నుండి రాహు కేంద్ర/త్రికోణంలో ఉన్నప్పుడు వర్తిస్తుంది. విమ్శోత్తరితో పోల్చి అతివ్యాప్తి విషయాలు కనుగొనండి.', bn: '৮ গ্রহ ব্যবহার করে ১০৮ বছরের চক্র (কেতু বাদে)। লগ্নেশ থেকে রাহু কেন্দ্র/ত্রিকোণে থাকলে প্রযোজ্য। বিংশোত্তরীর সাথে তুলনা করে সমান্তরাল বিষয় খুঁজুন।', kn: '8 ಗ್ರಹಗಳನ್ನು ಬಳಸುವ 108 ವರ್ಷದ ಚಕ್ರ (ಕೇತು ಹೊರತು). ಲಗ್ನಾಧಿಪತಿಯಿಂದ ರಾಹು ಕೇಂದ್ರ/ತ್ರಿಕೋಣದಲ್ಲಿ ಇರುವಾಗ ಅನ್ವಯ. ವಿಂಶೋತ್ತರಿಯೊಂದಿಗೆ ಹೋಲಿಸಿ.', gu: '8 ગ્રહો સાથે 108 વર્ષનું ચક્ર (કેતુ સિવાય). લગ્નેશથી રાહુ કેન્દ્ર/ત્રિકોણમાં હોય ત્યારે લાગુ. વિંશોત્તરી સાથે સરખાવીને સમાન વિષયો શોધો.' } },
                  { key: 'narayana', desc: { en: 'Sign-based dasha from Jaimini astrology (Jaimini Sutras 2.1). Shows external life events — career changes, relocations, relationship milestones — based on which sign is activated. Best for predicting visible life changes.', hi: 'जैमिनी ज्योतिष से राशि दशा (जैमिनी सूत्र 2.1)। बाह्य जीवन घटनाएँ — कैरियर, स्थानान्तरण, सम्बन्ध — कौन सी राशि सक्रिय है।', sa: 'जैमिनी ज्योतिष से राशि दशा (जैमिनी सूत्र 2.1)। बाह्य जीवन घटनाएँ — कैरियर, स्थानान्तरण, सम्बन्ध — कौन सी राशि सक्रिय है।', mai: 'जैमिनी ज्योतिष से राशि दशा (जैमिनी सूत्र 2.1)। बाह्य जीवन घटनाएँ — कैरियर, स्थानान्तरण, सम्बन्ध — कौन सी राशि सक्रिय है।', mr: 'जैमिनी ज्योतिष से राशि दशा (जैमिनी सूत्र 2.1)। बाह्य जीवन घटनाएँ — कैरियर, स्थानान्तरण, सम्बन्ध — कौन सी राशि सक्रिय है।', ta: 'ஜைமினி ஜோதிடத்தின் ராசி அடிப்படை தசா (ஜைமினி சூத்திரம் 2.1). எந்த ராசி செயல்படுகிறது என்பதன் அடிப்படையில் தொழில் மாற்றம், இடமாற்றம், உறவு மைல்கல் போன்ற வெளிப்புற வாழ்க்கை நிகழ்வுகளைக் காட்டுகிறது.', te: 'జైమిని జ్యోతిషం నుండి రాశి ఆధారిత దశ (జైమిని సూత్రాలు 2.1). ఏ రాశి సక్రియమో దాని ఆధారంగా వృత్తి మార్పులు, స్థలమార్పులు, సంబంధ మైలురాళ్లు వంటి బాహ్య జీవిత సంఘటనలను చూపుతుంది.', bn: 'জৈমিনি জ্যোতিষের রাশি ভিত্তিক দশা (জৈমিনি সূত্র ২.১)। কোন রাশি সক্রিয় তার ভিত্তিতে কর্মজীবন পরিবর্তন, স্থানান্তর, সম্পর্কের মাইলফলক দেখায়।', kn: 'ಜೈಮಿನಿ ಜ್ಯೋತಿಷದ ರಾಶಿ ಆಧಾರಿತ ದಶಾ (ಜೈಮಿನಿ ಸೂತ್ರ 2.1). ಯಾವ ರಾಶಿ ಸಕ್ರಿಯವೋ ಅದರ ಆಧಾರದ ಮೇಲೆ ವೃತ್ತಿ ಬದಲಾವಣೆ, ಸ್ಥಳಾಂತರ, ಸಂಬಂಧ ಮೈಲಿಗಲ್ಲುಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.', gu: 'જૈમિની જ્યોતિષની રાશી આધારિત દશા (જૈમિની સૂત્ર 2.1). કઈ રાશી સક્રિય છે તેના આધારે કારકિર્દી ફેરફાર, સ્થળાંતર, સંબંધ સીમાચિહ્ન દર્શાવે છે.' } },
                  { key: 'kalachakra', desc: { en: 'The "Time Wheel" dasha (BPHS Ch.21). Based on Moon\'s nakshatra pada, it follows a specific sign sequence (Savya or Apasavya). Considered very accurate by Parasara for timing karmic events. Complex but powerful.', hi: '"काल चक्र" दशा (BPHS अ.21)। चन्द्र नक्षत्र पद पर आधारित। कार्मिक घटनाओं के समय निर्धारण में पराशर द्वारा अत्यंत सटीक माना गया।' } },
                  { key: 'sthira', desc: { en: 'Fixed-duration sign dasha (Jaimini). Each sign runs for a fixed number of years regardless of planetary placement. Used alongside Narayana for cross-verification of life event timing.', hi: 'स्थिर अवधि राशि दशा (जैमिनी)। प्रत्येक राशि निश्चित वर्षों तक चलती है। नारायण दशा के साथ जीवन घटनाओं की पुष्टि हेतु।', sa: 'स्थिर अवधि राशि दशा (जैमिनी)। प्रत्येक राशि निश्चित वर्षों तक चलती है। नारायण दशा के साथ जीवन घटनाओं की पुष्टि हेतु।', mai: 'स्थिर अवधि राशि दशा (जैमिनी)। प्रत्येक राशि निश्चित वर्षों तक चलती है। नारायण दशा के साथ जीवन घटनाओं की पुष्टि हेतु।', mr: 'स्थिर अवधि राशि दशा (जैमिनी)। प्रत्येक राशि निश्चित वर्षों तक चलती है। नारायण दशा के साथ जीवन घटनाओं की पुष्टि हेतु।', ta: 'நிலையான கால ராசி தசா (ஜைமினி). ஒவ்வொரு ராசியும் கிரக நிலைகளைப் பொருட்படுத்தாமல் குறிப்பிட்ட ஆண்டுகள் நடக்கும். நாராயண தசாவுடன் சேர்த்து வாழ்க்கை நிகழ்வு நேர சரிபார்ப்புக்கு பயன்படுத்தப்படுகிறது.', te: 'స్థిర కాల రాశి దశ (జైమిని). ప్రతి రాశి గ్రహ స్థానాలతో సంబంధం లేకుండా నిర్ణీత సంవత్సరాలు నడుస్తుంది. నారాయణ దశతో పాటు జీవిత సంఘటన సమయ ధృవీకరణకు ఉపయోగిస్తారు.', bn: 'নির্দিষ্ট সময়কালের রাশি দশা (জৈমিনি)। প্রতিটি রাশি গ্রহ অবস্থান নির্বিশেষে নির্দিষ্ট বছর চলে। নারায়ণ দশার সাথে জীবন ঘটনার সময় যাচাইয়ে ব্যবহৃত।', kn: 'ನಿಶ್ಚಿತ ಅವಧಿಯ ರಾಶಿ ದಶಾ (ಜೈಮಿನಿ). ಪ್ರತಿ ರಾಶಿ ಗ್ರಹ ಸ್ಥಾನಗಳನ್ನು ಲೆಕ್ಕಿಸದೆ ನಿರ್ದಿಷ್ಟ ವರ್ಷಗಳು ನಡೆಯುತ್ತದೆ. ನಾರಾಯಣ ದಶಾದೊಂದಿಗೆ ಜೀವನ ಘಟನೆ ಸಮಯ ಪರಿಶೀಲನೆಗೆ ಬಳಸಲಾಗುತ್ತದೆ.', gu: 'નિશ્ચિત સમયગાળાની રાશિ દશા (જૈમિની). દરેક રાશિ ગ્રહ સ્થિતિ ધ્યાનમાં લીધા વિના ચોક્કસ વર્ષ ચાલે. નારાયણ દશા સાથે જીવન ઘટના સમય ચકાસણી માટે વપરાય છે.' } },
                  { key: 'shoola', desc: { en: '"Trident" dasha (Jaimini) — used exclusively for longevity and health crisis analysis. Each activated sign can indicate periods of acute pain or transformative endings. Cross-reference with 8th house lord and Rudra. NOT for general prediction.', hi: '"शूल" दशा (जैमिनी) — केवल दीर्घायु और स्वास्थ्य संकट विश्लेषण हेतु। सामान्य भविष्यवाणी के लिए नहीं।', sa: '"शूल" दशा (जैमिनी) — केवल दीर्घायु और स्वास्थ्य संकट विश्लेषण हेतु। सामान्य भविष्यवाणी के लिए नहीं।', mai: '"शूल" दशा (जैमिनी) — केवल दीर्घायु और स्वास्थ्य संकट विश्लेषण हेतु। सामान्य भविष्यवाणी के लिए नहीं।', mr: '"शूल" दशा (जैमिनी) — केवल दीर्घायु और स्वास्थ्य संकट विश्लेषण हेतु। सामान्य भविष्यवाणी के लिए नहीं।', ta: '"ત்ரிசூல" தசா (ஜைமினி) — நீண்ட ஆயுள் மற்றும் உடல்நல நெருக்கடி பகுப்பாய்வுக்கு மட்டுமே பயன்படும். ஒவ்வொரு செயல்படும் ராசியும் கடுமையான வலி அல்லது மாற்றமான முடிவுகளின் காலங்களைக் குறிக்கலாம்.', te: '"త్రిశూల" దశ (జైమిని) — దీర్ఘాయువు మరియు ఆరోగ్య సంక్షోభ విశ్లేషణకు మాత్రమే ఉపయోగించబడుతుంది. ప్రతి సక్రియ రాశి తీవ్రమైన నొప్పి లేదా పరివర్తన ముగింపుల కాలాలను సూచించవచ్చు.', bn: '"ত্রিশূল" দশা (জৈমিনি) — কেবল দীর্ঘায়ু ও স্বাস্থ্য সংকট বিশ্লেষণে ব্যবহৃত। প্রতিটি সক্রিয় রাশি তীব্র যন্ত্রণা বা রূপান্তরমূলক সমাপ্তির কাল নির্দেশ করতে পারে।', kn: '"ತ್ರಿಶೂಲ" ದಶಾ (ಜೈಮಿನಿ) — ದೀರ್ಘಾಯುಷ್ಯ ಮತ್ತು ಆರೋಗ್ಯ ಸಂಕಷ್ಟ ವಿಶ್ಲೇಷಣೆಗೆ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ಪ್ರತಿ ಸಕ್ರಿಯ ರಾಶಿ ತೀವ್ರ ನೋವು ಅಥವಾ ಪರಿವರ್ತನೆಯ ಅಂತ್ಯಗಳ ಅವಧಿಯನ್ನು ಸೂಚಿಸಬಹುದು.', gu: '"ત્રિશૂળ" દશા (જૈમિની) — ફક્ત દીર્ઘાયુ અને આરોગ્ય સંકટ વિશ્લેષણ માટે. દરેક સક્રિય રાશિ તીવ્ર પીડા અથવા પરિવર્તનકારી સમાપ્તિના કાળ દર્શાવી શકે.' } },
                  { key: 'shodasottari', desc: { en: '116-year cycle. Applied when lagna is in Krishna Paksha and birth is at night. An alternative to Vimshottari for specific birth conditions — if applicable, it may give more accurate timing than the standard system.', hi: '116 वर्षीय चक्र। कृष्ण पक्ष लग्न और रात्रि जन्म पर लागू। विशिष्ट जन्म स्थितियों के लिए विंशोत्तरी का विकल्प।', sa: '116 वर्षीय चक्र। कृष्ण पक्ष लग्न और रात्रि जन्म पर लागू। विशिष्ट जन्म स्थितियों के लिए विंशोत्तरी का विकल्प।', mai: '116 वर्षीय चक्र। कृष्ण पक्ष लग्न और रात्रि जन्म पर लागू। विशिष्ट जन्म स्थितियों के लिए विंशोत्तरी का विकल्प।', mr: '116 वर्षीय चक्र। कृष्ण पक्ष लग्न और रात्रि जन्म पर लागू। विशिष्ट जन्म स्थितियों के लिए विंशोत्तरी का विकल्प।', ta: '116 ஆண்டு சுழற்சி. லக்னம் கிருஷ்ண பக்ஷத்திலும் இரவு ஜனனமாகவும் இருக்கும்போது பயன்படும். குறிப்பிட்ட பிறப்பு நிபந்தனைகளுக்கான விம்ஷோத்தரிக்கு மாற்று — பொருந்தினால் நிலையான அமைப்பை விட துல்லியமான நேரத்தை அளிக்கலாம்.', te: '116 సంవత్సరాల చక్రం. లగ్నం కృష్ణ పక్షంలో మరియు రాత్రి జననమైనప్పుడు వర్తిస్తుంది. నిర్దిష్ట జన్మ పరిస్థితులకు విమ్శోత్తరికి ప్రత్యామ్నాయం — వర్తిస్తే ప్రామాణిక వ్యవస్థ కంటే ఖచ్చితమైన సమయాన్ని ఇవ్వవచ్చు.', bn: '১১৬ বছরের চক্র। লগ্ন কৃষ্ণ পক্ষে এবং রাতে জন্ম হলে প্রযোজ্য। নির্দিষ্ট জন্ম শর্তের জন্য বিংশোত্তরীর বিকল্প — প্রযোজ্য হলে প্রমিত পদ্ধতির চেয়ে নির্ভুল সময় দিতে পারে।', kn: '116 ವರ್ಷದ ಚಕ್ರ. ಲಗ್ನ ಕೃಷ್ಣ ಪಕ್ಷದಲ್ಲಿ ಮತ್ತು ರಾತ್ರಿ ಜನನವಾದಾಗ ಅನ್ವಯ. ನಿರ್ದಿಷ್ಟ ಜನ್ಮ ಷರತ್ತುಗಳಿಗೆ ವಿಂಶೋತ್ತರಿಗೆ ಪರ್ಯಾಯ — ಅನ್ವಯಿಸಿದರೆ ಪ್ರಮಾಣಿತ ವ್ಯವಸ್ಥೆಗಿಂತ ನಿಖರ ಸಮಯ ನೀಡಬಹುದು.', gu: '116 વર્ષનું ચક્ર. લગ્ન કૃષ્ણ પક્ષમાં અને રાત્રે જન્મ હોય ત્યારે લાગુ. ચોક્કસ જન્મ શરતો માટે વિંશોત્તરીનો વિકલ્પ — લાગુ હોય તો પ્રમાણભૂત પદ્ધતિ કરતાં વધુ ચોક્કસ સમય આપી શકે.' } },
                  { key: 'dwadasottari', desc: { en: '112-year cycle. Applied when lagna is in Shukla Paksha and Venus is in a kendra. Emphasizes Venus-related themes — relationships, comforts, artistic pursuits, and material prosperity.', hi: '112 वर्षीय चक्र। शुक्ल पक्ष लग्न और शुक्र केन्द्र में हो तब लागू। शुक्र विषय — सम्बन्ध, सुख, कला पर बल।', sa: '112 वर्षीय चक्र। शुक्ल पक्ष लग्न और शुक्र केन्द्र में हो तब लागू। शुक्र विषय — सम्बन्ध, सुख, कला पर बल।', mai: '112 वर्षीय चक्र। शुक्ल पक्ष लग्न और शुक्र केन्द्र में हो तब लागू। शुक्र विषय — सम्बन्ध, सुख, कला पर बल।', mr: '112 वर्षीय चक्र। शुक्ल पक्ष लग्न और शुक्र केन्द्र में हो तब लागू। शुक्र विषय — सम्बन्ध, सुख, कला पर बल।', ta: '112 ஆண்டு சுழற்சி. லக்னம் சுக்ல பக்ஷத்திலும் சுக்கிரன் கேந்திரத்திலும் இருக்கும்போது பயன்படும். சுக்கிரன் தொடர்பான கருப்பொருள்களை வலியுறுத்துகிறது — உறவுகள், வசதிகள், கலை முயற்சிகள், பொருள் செழிப்பு.', te: '112 సంవత్సరాల చక్రం. లగ్నం శుక్ల పక్షంలో మరియు శుక్రుడు కేంద్రంలో ఉన్నప్పుడు వర్తిస్తుంది. శుక్ర సంబంధిత అంశాలను నొక్కి చెబుతుంది — సంబంధాలు, సౌకర్యాలు, కళాత్మక కార్యక్రమాలు, భౌతిక సమృద్ధి.', bn: '১১২ বছরের চক্র। লগ্ন শুক্ল পক্ষে এবং শুক্র কেন্দ্রে থাকলে প্রযোজ্য। শুক্র সম্পর্কিত বিষয় জোর দেয় — সম্পর্ক, আরাম, শিল্পচর্চা ও বৈষয়িক সমৃদ্ধি।', kn: '112 ವರ್ಷದ ಚಕ್ರ. ಲಗ್ನ ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ ಮತ್ತು ಶುಕ್ರ ಕೇಂದ್ರದಲ್ಲಿ ಇರುವಾಗ ಅನ್ವಯ. ಶುಕ್ರ ಸಂಬಂಧಿ ವಿಷಯಗಳನ್ನು ಒತ್ತಿಹೇಳುತ್ತದೆ — ಸಂಬಂಧಗಳು, ಸೌಕರ್ಯ, ಕಲಾತ್ಮಕ ಚಟುವಟಿಕೆ, ಭೌತಿಕ ಸಮೃದ್ಧಿ.', gu: '112 વર્ષનું ચક્ર. લગ્ન શુક્લ પક્ષમાં અને શુક્ર કેન્દ્રમાં હોય ત્યારે લાગુ. શુક્ર સંબંધિત વિષયો પર ભાર — સંબંધો, આરામ, કલાત્મક પ્રવૃત્તિ, ભૌતિક સમૃદ્ધિ.' } },
                  { key: 'panchottari', desc: { en: '105-year cycle. Applied when lagna is in Dhanishtha nakshatra or Cancer sign. A rare conditional dasha — if your birth conditions match, compare its periods with Vimshottari for confirmation.', hi: '105 वर्षीय चक्र। धनिष्ठा नक्षत्र या कर्क लग्न पर लागू। दुर्लभ सशर्त दशा।', sa: '105 वर्षीय चक्र। धनिष्ठा नक्षत्र या कर्क लग्न पर लागू। दुर्लभ सशर्त दशा।', mai: '105 वर्षीय चक्र। धनिष्ठा नक्षत्र या कर्क लग्न पर लागू। दुर्लभ सशर्त दशा।', mr: '105 वर्षीय चक्र। धनिष्ठा नक्षत्र या कर्क लग्न पर लागू। दुर्लभ सशर्त दशा।', ta: '105 ஆண்டு சுழற்சி. லக்னம் அவிட்ட நட்சத்திரம் அல்லது கடக ராசியில் இருக்கும்போது பயன்படும். அரிய நிபந்தனை தசா — பிறப்பு நிபந்தனைகள் பொருந்தினால் விம்ஷோத்தரியுடன் ஒப்பிட்டு உறுதிப்படுத்துங்கள்.', te: '105 సంవత్సరాల చక్రం. లగ్నం ధనిష్ఠ నక్షత్రం లేదా కర్కాటక రాశిలో ఉన్నప్పుడు వర్తిస్తుంది. అరుదైన షరతు దశ — జన్మ షరతులు సరిపోతే విమ్శోత్తరితో దాని కాలాలను పోల్చండి.', bn: '১০৫ বছরের চক্র। লগ্ন ধনিষ্ঠা নক্ষত্র বা কর্কট রাশিতে থাকলে প্রযোজ্য। বিরল শর্তসাপেক্ষ দশা — জন্ম শর্ত মিললে বিংশোত্তরীর সাথে তুলনা করুন।', kn: '105 ವರ್ಷದ ಚಕ್ರ. ಲಗ್ನ ಧನಿಷ್ಠಾ ನಕ್ಷತ್ರ ಅಥವಾ ಕರ್ಕಾಟಕ ರಾಶಿಯಲ್ಲಿ ಇರುವಾಗ ಅನ್ವಯ. ಅಪರೂಪದ ಷರತ್ತಿನ ದಶಾ — ಜನ್ಮ ಷರತ್ತುಗಳು ಹೊಂದಿದರೆ ವಿಂಶೋತ್ತರಿಯೊಂದಿಗೆ ಹೋಲಿಸಿ.', gu: '105 વર્ષનું ચક્ર. લગ્ન ધનિષ્ઠા નક્ષત્ર કે કર્ક રાશિમાં હોય ત્યારે લાગુ. દુર્લભ શરતી દશા — જન્મ શરતો મળે તો વિંશોત્તરી સાથે સરખાવો.' } },
                  { key: 'satabdika', desc: { en: '100-year cycle. Applied when lagna is in Vargottama (same sign in D1 and D9). Emphasizes the soul\'s deeper evolutionary journey — spiritual milestones and inner transformation.', hi: '100 वर्षीय चक्र। वर्गोत्तम लग्न पर लागू। आत्मा की गहन विकास यात्रा — आध्यात्मिक उपलब्धियाँ।' } },
                  { key: 'chaturaaseethi', desc: { en: '84-year cycle. Applied when the 10th lord is in the 10th house. Focuses on career and public life timing — when you rise, when you face professional challenges, and when recognition comes.', hi: '84 वर्षीय चक्र। दशमेश दशम में हो तब लागू। कैरियर और सार्वजनिक जीवन — उत्थान, चुनौती और मान्यता का समय।', sa: '84 वर्षीय चक्र। दशमेश दशम में हो तब लागू। कैरियर और सार्वजनिक जीवन — उत्थान, चुनौती और मान्यता का समय।', mai: '84 वर्षीय चक्र। दशमेश दशम में हो तब लागू। कैरियर और सार्वजनिक जीवन — उत्थान, चुनौती और मान्यता का समय।', mr: '84 वर्षीय चक्र। दशमेश दशम में हो तब लागू। कैरियर और सार्वजनिक जीवन — उत्थान, चुनौती और मान्यता का समय।', ta: '84 ஆண்டு சுழற்சி. 10ம் அதிபதி 10ம் வீட்டில் இருக்கும்போது பயன்படும். தொழில் மற்றும் பொது வாழ்க்கை நேரத்தில் கவனம் — நீங்கள் எப்போது உயர்கிறீர்கள், எப்போது தொழில்முறை சவால்களை எதிர்கொள்கிறீர்கள், எப்போது அங்கீகாரம் வருகிறது.', te: '84 సంవత్సరాల చక్రం. 10వ అధిపతి 10వ భావంలో ఉన్నప్పుడు వర్తిస్తుంది. వృత్తి మరియు బహిరంగ జీవిత సమయంపై దృష్టి — మీరు ఎప్పుడు ఎదుగుతారు, ఎప్పుడు వృత్తిపరమైన సవాళ్లను ఎదుర్కొంటారు, ఎప్పుడు గుర్తింపు వస్తుంది.', bn: '৮৪ বছরের চক্র। দশম অধিপতি দশম ভাবে থাকলে প্রযোজ্য। কর্মজীবন ও জনজীবনের সময়ে মনোযোগ — কখন উন্নতি হবে, কখন পেশাগত চ্যালেঞ্জ আসবে, কখন স্বীকৃতি মিলবে।', kn: '84 ವರ್ಷದ ಚಕ್ರ. 10ನೇ ಅಧಿಪತಿ 10ನೇ ಭಾವದಲ್ಲಿ ಇರುವಾಗ ಅನ್ವಯ. ವೃತ್ತಿ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಜೀವನ ಸಮಯದ ಮೇಲೆ ಗಮನ — ಯಾವಾಗ ಏಳಿಗೆ, ಯಾವಾಗ ವೃತ್ತಿಪರ ಸವಾಲು, ಯಾವಾಗ ಮನ್ನಣೆ ಬರುತ್ತದೆ.', gu: '84 વર્ષનું ચક્ર. 10મો અધિપતિ 10મા ભાવમાં હોય ત્યારે લાગુ. કારકિર્દી અને જાહેર જીવન સમય પર ધ્યાન — ક્યારે ઉન્નતિ, ક્યારે વ્યાવસાયિક પડકાર, ક્યારે માન્યતા મળે.' } },
                  { key: 'shashtihayani', desc: { en: '60-year cycle. Applied when Sun is in the lagna. Solar-focused timing — leadership opportunities, authority, government interactions, and health vitality through life.', hi: '60 वर्षीय चक्र। सूर्य लग्न में हो तब लागू। नेतृत्व, अधिकार, सरकारी संबंध और स्वास्थ्य शक्ति।', sa: '60 वर्षीय चक्र। सूर्य लग्न में हो तब लागू। नेतृत्व, अधिकार, सरकारी संबंध और स्वास्थ्य शक्ति।', mai: '60 वर्षीय चक्र। सूर्य लग्न में हो तब लागू। नेतृत्व, अधिकार, सरकारी संबंध और स्वास्थ्य शक्ति।', mr: '60 वर्षीय चक्र। सूर्य लग्न में हो तब लागू। नेतृत्व, अधिकार, सरकारी संबंध और स्वास्थ्य शक्ति।', ta: '60 ஆண்டு சுழற்சி. சூரியன் லக்னத்தில் இருக்கும்போது பயன்படும். சூரிய மையமான நேரம் — தலைமை வாய்ப்புகள், அதிகாரம், அரசு தொடர்புகள், வாழ்நாள் முழுவதும் உடல் உயிர்ச்சக்தி.', te: '60 సంవత్సరాల చక్రం. సూర్యుడు లగ్నంలో ఉన్నప్పుడు వర్తిస్తుంది. సూర్య కేంద్రిత సమయం — నాయకత్వ అవకాశాలు, అధికారం, ప్రభుత్వ పరస్పర చర్యలు, జీవితాంతం ఆరోగ్య శక్తి.', bn: '৬০ বছরের চক্র। সূর্য লগ্নে থাকলে প্রযোজ্য। সৌর-কেন্দ্রিক সময় — নেতৃত্বের সুযোগ, কর্তৃত্ব, সরকারি যোগাযোগ এবং জীবনব্যাপী স্বাস্থ্য প্রাণশক্তি।', kn: '60 ವರ್ಷದ ಚಕ್ರ. ಸೂರ್ಯ ಲಗ್ನದಲ್ಲಿ ಇರುವಾಗ ಅನ್ವಯ. ಸೂರ್ಯ ಕೇಂದ್ರಿತ ಸಮಯ — ನಾಯಕತ್ವ ಅವಕಾಶಗಳು, ಅಧಿಕಾರ, ಸರ್ಕಾರಿ ಸಂವಹನ, ಜೀವಮಾನದುದ್ದಕ್ಕೂ ಆರೋಗ್ಯ ಚೈತನ್ಯ.', gu: '60 વર્ષનું ચક્ર. સૂર્ય લગ્નમાં હોય ત્યારે લાગુ. સૂર્ય કેન્દ્રિત સમય — નેતૃત્વ તકો, સત્તા, સરકારી સંપર્ક, જીવનભર આરોગ્ય ઉર્જા.' } },
                  { key: 'mandooka', desc: { en: '"Frog" dasha — signs jump in a specific pattern (like a frog hops). A Jaimini sign-based system that reveals sudden life changes, relocations, and unexpected turns of fortune.', hi: '"मण्डूक" दशा — राशियाँ विशिष्ट पैटर्न में कूदती हैं। अचानक जीवन परिवर्तन, स्थानान्तरण और अप्रत्याशित भाग्य-मोड़।', sa: '"मण्डूक" दशा — राशियाँ विशिष्ट पैटर्न में कूदती हैं। अचानक जीवन परिवर्तन, स्थानान्तरण और अप्रत्याशित भाग्य-मोड़।', mai: '"मण्डूक" दशा — राशियाँ विशिष्ट पैटर्न में कूदती हैं। अचानक जीवन परिवर्तन, स्थानान्तरण और अप्रत्याशित भाग्य-मोड़।', mr: '"मण्डूक" दशा — राशियाँ विशिष्ट पैटर्न में कूदती हैं। अचानक जीवन परिवर्तन, स्थानान्तरण और अप्रत्याशित भाग्य-मोड़।', ta: '"தவளை" தசா — ராசிகள் குறிப்பிட்ட வடிவத்தில் குதிக்கின்றன (தவளை குதிப்பது போல). திடீர் வாழ்க்கை மாற்றங்கள், இடமாற்றங்கள் மற்றும் எதிர்பாராத அதிர்ஷ்ட திருப்பங்களை வெளிப்படுத்தும் ஜைமினி ராசி தசா.', te: '"కప్ప" దశ — రాశులు నిర్దిష్ట నమూనాలో దూకుతాయి (కప్ప దూకినట్లు). ఆకస్మిక జీవిత మార్పులు, స్థలమార్పులు మరియు అనూహ్య అదృష్ట మలుపులను బయల్పరిచే జైమిని రాశి ఆధారిత దశ.', bn: '"ব্যাঙ" দশা — রাশিগুলি নির্দিষ্ট ধরনে লাফ দেয় (ব্যাঙের লাফের মতো)। হঠাৎ জীবন পরিবর্তন, স্থানান্তর এবং অপ্রত্যাশিত ভাগ্য পরিবর্তন প্রকাশকারী জৈমিনি রাশি দশা।', kn: '"ಕಪ್ಪೆ" ದಶಾ — ರಾಶಿಗಳು ನಿರ್ದಿಷ್ಟ ಮಾದರಿಯಲ್ಲಿ ಜಿಗಿಯುತ್ತವೆ (ಕಪ್ಪೆ ಜಿಗಿಯುವಂತೆ). ಹಠಾತ್ ಜೀವನ ಬದಲಾವಣೆಗಳು, ಸ್ಥಳಾಂತರಗಳು ಮತ್ತು ಅನಿರೀಕ್ಷಿತ ಅದೃಷ್ಟ ತಿರುವುಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸುವ ಜೈಮಿನಿ ರಾಶಿ ದಶಾ.', gu: '"દેડકા" દશા — રાશિઓ ચોક્કસ પેટર્નમાં કૂદે છે (દેડકાની જેમ). અચાનક જીવન ફેરફાર, સ્થળાંતર અને અનપેક્ષિત ભાગ્ય વળાંક પ્રગટ કરતી જૈમિની રાશિ દશા.' } },
                  { key: 'drig', desc: { en: '"Sight" dasha — based on planetary aspects (drishti) to signs. Shows which life areas receive active planetary attention during each period. Useful for understanding why certain themes intensify.', hi: '"दृग" दशा — राशियों पर ग्रह दृष्टि आधारित। कौन से जीवन क्षेत्र प्रत्येक अवधि में सक्रिय ग्रह ध्यान प्राप्त करते हैं।', sa: '"दृग" दशा — राशियों पर ग्रह दृष्टि आधारित। कौन से जीवन क्षेत्र प्रत्येक अवधि में सक्रिय ग्रह ध्यान प्राप्त करते हैं।', mai: '"दृग" दशा — राशियों पर ग्रह दृष्टि आधारित। कौन से जीवन क्षेत्र प्रत्येक अवधि में सक्रिय ग्रह ध्यान प्राप्त करते हैं।', mr: '"दृग" दशा — राशियों पर ग्रह दृष्टि आधारित। कौन से जीवन क्षेत्र प्रत्येक अवधि में सक्रिय ग्रह ध्यान प्राप्त करते हैं।', ta: '"பார்வை" தசா — ராசிகளுக்கான கிரக பார்வை (திருஷ்டி) அடிப்படையில். ஒவ்வொரு காலகட்டத்திலும் எந்த வாழ்க்கைப் பகுதிகள் செயலில் கிரக கவனத்தைப் பெறுகின்றன என்பதைக் காட்டுகிறது.', te: '"దృష్టి" దశ — రాశులకు గ్రహ దృష్టి ఆధారంగా. ప్రతి కాలంలో ఏ జీవిత రంగాలు సక్రియ గ్రహ శ్రద్ధను పొందుతాయో చూపుతుంది. నిర్దిష్ట అంశాలు ఎందుకు తీవ్రమవుతాయో అర్థం చేసుకోవడానికి ఉపయోగకరం.', bn: '"দৃষ্টি" দশা — রাশিগুলিতে গ্রহের দৃষ্টি ভিত্তিক। প্রতিটি কালে কোন জীবনের ক্ষেত্র সক্রিয় গ্রহ মনোযোগ পায় তা দেখায়। নির্দিষ্ট বিষয় কেন তীব্র হয় বুঝতে সহায়ক।', kn: '"ದೃಷ್ಟಿ" ದಶಾ — ರಾಶಿಗಳಿಗೆ ಗ್ರಹ ದೃಷ್ಟಿ (ದೃಷ್ಟಿ) ಆಧಾರಿತ. ಪ್ರತಿ ಅವಧಿಯಲ್ಲಿ ಯಾವ ಜೀವನ ಕ್ಷೇತ್ರಗಳು ಸಕ್ರಿಯ ಗ್ರಹ ಗಮನ ಪಡೆಯುತ್ತವೆ ಎಂದು ತೋರಿಸುತ್ತದೆ.', gu: '"દૃષ્ટિ" દશા — રાશિઓ પર ગ્રહ દૃષ્ટિ આધારિત. દરેક કાળમાં કયા જીવન ક્ષેત્રો સક્રિય ગ્રહ ધ્યાન મેળવે છે તે દર્શાવે છે. ચોક્કસ વિષયો શા માટે તીવ્ર થાય છે તે સમજવામાં ઉપયોગી.' } },
                  { key: 'moola', desc: { en: 'Root dasha — traces back to the fundamental nakshatra lord chain. Reveals the deepest karmic patterns operating beneath the surface of more visible dasha systems.', hi: 'मूल दशा — मूल नक्षत्र स्वामी श्रृंखला। दृश्य दशाओं के नीचे संचालित गहनतम कार्मिक पैटर्न।', sa: 'मूल दशा — मूल नक्षत्र स्वामी श्रृंखला। दृश्य दशाओं के नीचे संचालित गहनतम कार्मिक पैटर्न।', mai: 'मूल दशा — मूल नक्षत्र स्वामी श्रृंखला। दृश्य दशाओं के नीचे संचालित गहनतम कार्मिक पैटर्न।', mr: 'मूल दशा — मूल नक्षत्र स्वामी श्रृंखला। दृश्य दशाओं के नीचे संचालित गहनतम कार्मिक पैटर्न।', ta: 'மூல தசா — அடிப்படை நட்சத்திர அதிபதி சங்கிலியை மீண்டும் கண்டறியும். மிகவும் தெளிவான தசா அமைப்புகளின் மேற்பரப்பின் கீழ் இயங்கும் ஆழமான கர்ம வடிவங்களை வெளிப்படுத்துகிறது.', te: 'మూల దశ — ప్రాథమిక నక్షత్ర అధిపతి శృంఖలను తిరిగి గుర్తిస్తుంది. మరింత కనిపించే దశ వ్యవస్థల ఉపరితలం క్రింద పనిచేసే లోతైన కర్మ నమూనాలను బయల్పరుస్తుంది.', bn: 'মূল দশা — মৌলিক নক্ষত্র অধিপতি শৃঙ্খলে ফিরে যায়। আরও দৃশ্যমান দশা পদ্ধতির পৃষ্ঠের নীচে কার্যকর গভীরতম কর্মফল নমুনা প্রকাশ করে।', kn: 'ಮೂಲ ದಶಾ — ಮೂಲ ನಕ್ಷತ್ರ ಅಧಿಪತಿ ಸರಪಣಿಯನ್ನು ಹಿಂತಿರುಗಿ ಕಂಡುಹಿಡಿಯುತ್ತದೆ. ಹೆಚ್ಚು ಗೋಚರ ದಶಾ ವ್ಯವಸ್ಥೆಗಳ ಮೇಲ್ಮೈ ಕೆಳಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಅತ್ಯಂತ ಆಳವಾದ ಕರ್ಮ ಮಾದರಿಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತದೆ.', gu: 'મૂળ દશા — મૂળભૂત નક્ષત્ર અધિપતિ શૃંખલાને શોધે છે. વધુ દૃશ્યમાન દશા પ્રણાલીઓની સપાટી નીચે કાર્યરત ગહન કર્મ પેટર્ન પ્રગટ કરે છે.' } },
                  { key: 'navamsha_dasha', desc: { en: 'Dasha based on Navamsha (D9) chart positions. Since D9 represents the soul\'s deeper purpose and marriage, this system times spiritual evolution, partnership changes, and dharmic milestones.', hi: 'नवांश (D9) कुण्डली स्थितियों पर आधारित दशा। D9 आत्मा और विवाह का प्रतिनिधित्व करता है — आध्यात्मिक विकास और धार्मिक उपलब्धियों का समय।' } },
                  { key: 'naisargika', desc: { en: 'Natural planetary periods based on each planet\'s innate nature, not birth-specific. Shows universal developmental stages — childhood (Moon), education (Mercury), marriage (Venus), career (Sun), etc. Same for everyone.', hi: 'प्रत्येक ग्रह के स्वाभाविक स्वभाव पर आधारित। सार्वभौमिक विकास चरण — बचपन (चन्द्र), शिक्षा (बुध), विवाह (शुक्र), कैरियर (सूर्य)।' } },
                  { key: 'tara', desc: { en: 'Star-based dasha using the 27 nakshatra lords in sequence. Times events through the nakshatras\' intrinsic qualities — each nakshatra activates its specific life themes (health, wealth, relationships, spirituality).', hi: 'तारा दशा — 27 नक्षत्र स्वामियों के क्रम में। प्रत्येक नक्षत्र अपने विशिष्ट जीवन विषयों को सक्रिय करता है।' } },
                  { key: 'tithi_ashtottari', desc: { en: '108-year cycle based on the tithi lord at birth. If you were born on Dvitiya (Moon\'s tithi), Moon dominates. Reveals how the lunar day of birth shapes your life\'s rhythmic pattern.', hi: 'जन्म तिथि स्वामी पर आधारित 108 वर्षीय चक्र। जन्म तिथि जीवन की लयबद्ध पैटर्न कैसे आकार देती है।' } },
                  { key: 'yoga_vimsottari', desc: { en: 'Based on the birth yoga (Sun + Moon combination). The yoga active at birth determines the starting dasha lord. Reveals how the Sun-Moon dynamic — your conscious will vs emotional nature — plays out over time.', hi: 'जन्म योग (सूर्य+चन्द्र) पर आधारित। सचेतन इच्छा बनाम भावनात्मक स्वभाव का गतिशील जीवन भर कैसे प्रकट होता है।', sa: 'जन्म योग (सूर्य+चन्द्र) पर आधारित। सचेतन इच्छा बनाम भावनात्मक स्वभाव का गतिशील जीवन भर कैसे प्रकट होता है।', mai: 'जन्म योग (सूर्य+चन्द्र) पर आधारित। सचेतन इच्छा बनाम भावनात्मक स्वभाव का गतिशील जीवन भर कैसे प्रकट होता है।', mr: 'जन्म योग (सूर्य+चन्द्र) पर आधारित। सचेतन इच्छा बनाम भावनात्मक स्वभाव का गतिशील जीवन भर कैसे प्रकट होता है।', ta: 'பிறப்பு யோகத்தின் (சூரியன் + சந்திரன் சேர்க்கை) அடிப்படையில். பிறப்பின் போது செயலில் உள்ள யோகம் தொடக்க தசா அதிபதியை நிர்ணயிக்கிறது. சூரிய-சந்திர இயக்கம் — உங்கள் நனவான விருப்பம் எதிர் உணர்ச்சி இயல்பு — காலப்போக்கில் எவ்வாறு வெளிப்படுகிறது என்பதை வெளிப்படுத்துகிறது.', te: 'జన్మ యోగం (సూర్యుడు + చంద్రుడు కలయిక) ఆధారంగా. జన్మ సమయంలో సక్రియంగా ఉన్న యోగం ప్రారంభ దశాధిపతిని నిర్ణయిస్తుంది. సూర్య-చంద్ర డైనమిక్ — మీ స్పృహ సంకల్పం వర్సెస్ భావోద్వేగ స్వభావం — కాలక్రమంలో ఎలా వ్యక్తమవుతుందో తెలియజేస్తుంది.', bn: 'জন্ম যোগের (সূর্য + চন্দ্র সংযোগ) উপর ভিত্তি করে। জন্মের সময় সক্রিয় যোগ প্রারম্ভিক দশাধিপতি নির্ধারণ করে। সূর্য-চন্দ্র গতিশীলতা — আপনার সচেতন ইচ্ছা বনাম আবেগপূর্ণ প্রকৃতি — সময়ের সাথে কীভাবে প্রকাশ পায় তা প্রকাশ করে।', kn: 'ಜನ್ಮ ಯೋಗದ (ಸೂರ್ಯ + ಚಂದ್ರ ಸಂಯೋಜನೆ) ಆಧಾರದ ಮೇಲೆ. ಜನನ ಸಮಯದಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿರುವ ಯೋಗ ಪ್ರಾರಂಭ ದಶಾಧಿಪತಿಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ. ಸೂರ್ಯ-ಚಂದ್ರ ಚಲನಶೀಲತೆ — ನಿಮ್ಮ ಜಾಗೃತ ಇಚ್ಛೆ vs ಭಾವನಾತ್ಮಕ ಸ್ವಭಾವ — ಕಾಲಕ್ರಮೇಣ ಹೇಗೆ ವ್ಯಕ್ತವಾಗುತ್ತದೆ ಎಂದು ತೋರಿಸುತ್ತದೆ.', gu: 'જન્મ યોગ (સૂર્ય + ચંદ્ર સંયોજન) આધારિત. જન્મ સમયે સક્રિય યોગ પ્રારંભિક દશાધિપતિ નક્કી કરે છે. સૂર્ય-ચંદ્ર ગતિશીલતા — તમારી સભાન ઇચ્છા vs ભાવનાત્મક સ્વભાવ — સમય જતાં કેવી રીતે પ્રગટ થાય છે તે દર્શાવે છે.' } },
                  { key: 'buddhi_gathi', desc: { en: '100-year cycle tracking intellectual and wisdom development. Shows when mental faculties peak, when learning opportunities arise, and when accumulated wisdom bears fruit in practical life.', hi: '100 वर्षीय चक्र — बौद्धिक और ज्ञान विकास। मानसिक क्षमताएँ कब चरम पर, सीखने के अवसर कब, संचित ज्ञान कब फलित।', sa: '100 वर्षीय चक्र — बौद्धिक और ज्ञान विकास। मानसिक क्षमताएँ कब चरम पर, सीखने के अवसर कब, संचित ज्ञान कब फलित।', mai: '100 वर्षीय चक्र — बौद्धिक और ज्ञान विकास। मानसिक क्षमताएँ कब चरम पर, सीखने के अवसर कब, संचित ज्ञान कब फलित।', mr: '100 वर्षीय चक्र — बौद्धिक और ज्ञान विकास। मानसिक क्षमताएँ कब चरम पर, सीखने के अवसर कब, संचित ज्ञान कब फलित।', ta: 'புத்தி மற்றும் ஞான வளர்ச்சியைக் கண்காணிக்கும் 100 ஆண்டு சுழற்சி. மனத் திறன்கள் எப்போது உச்சத்தில் இருக்கும், கற்றல் வாய்ப்புகள் எப்போது எழும், திரட்டிய ஞானம் நடைமுறை வாழ்க்கையில் எப்போது பலன் தரும் என்பதைக் காட்டுகிறது.', te: 'బుద్ధి మరియు జ్ఞాన అభివృద్ధిని ట్రాక్ చేసే 100 సంవత్సరాల చక్రం. మానసిక సామర్థ్యాలు ఎప్పుడు శిఖరాగ్రంలో ఉంటాయి, అభ్యాస అవకాశాలు ఎప్పుడు వస్తాయి, సేకరించిన జ్ఞానం ఆచరణాత్మక జీవితంలో ఎప్పుడు ఫలిస్తుందో చూపుతుంది.', bn: 'বুদ্ধি ও জ্ঞান বিকাশ ট্র্যাক করা ১০০ বছরের চক্র। মানসিক সক্ষমতা কখন শীর্ষে, শেখার সুযোগ কখন আসে এবং সঞ্চিত জ্ঞান কখন ব্যবহারিক জীবনে ফল দেয় তা দেখায়।', kn: 'ಬುದ್ಧಿ ಮತ್ತು ಜ್ಞಾನ ಅಭಿವೃದ್ಧಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವ 100 ವರ್ಷದ ಚಕ್ರ. ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯಗಳು ಯಾವಾಗ ಉತ್ತುಂಗದಲ್ಲಿರುತ್ತವೆ, ಕಲಿಕೆಯ ಅವಕಾಶಗಳು ಯಾವಾಗ ಬರುತ್ತವೆ, ಸಂಗ್ರಹಿತ ಜ್ಞಾನ ಪ್ರಾಯೋಗಿಕ ಜೀವನದಲ್ಲಿ ಯಾವಾಗ ಫಲ ನೀಡುತ್ತದೆ ಎಂದು ತೋರಿಸುತ್ತದೆ.', gu: 'બુદ્ધિ અને જ્ઞાન વિકાસને ટ્રેક કરતું 100 વર્ષનું ચક્ર. માનસિક ક્ષમતાઓ ક્યારે ટોચ પર, શીખવાની તકો ક્યારે આવે, અને સંચિત જ્ઞાન વ્યવહારિક જીવનમાં ક્યારે ફળ આપે તે દર્શાવે છે.' } },
                ];
                const found = allSystems.find(s => s.key === dashaSystem);
                if (!found) return null;
                return <p className="text-text-secondary/75 text-xs text-center mb-4 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{found.desc[locale === 'en' || isTamil ? 'en' : 'hi']}</p>;
              })()}
              <h3 className="text-gold-gradient text-xl font-bold mb-6 text-center" style={headingFont}>{t('dashaTimeline')}</h3>
              {(() => {
                // Rasi dashas use signName instead of planetName
                const rasiDashaKeysLocal = ['narayana', 'kalachakra', 'sthira', 'shoola', 'mandooka', 'drig', 'navamsha_dasha'];
                if (rasiDashaKeysLocal.includes(dashaSystem)) {
                  const rasiData = dashaSystem === 'narayana' ? kundali.narayanaDasha
                    : dashaSystem === 'kalachakra' ? kundali.kalachakraDasha
                    : dashaSystem === 'sthira' ? kundali.sthiraDasha
                    : dashaSystem === 'mandooka' ? kundali.mandookaDasha
                    : dashaSystem === 'drig' ? kundali.drigDasha
                    : dashaSystem === 'navamsha_dasha' ? kundali.navamshaDasha
                    : kundali.shoolaDasha;
                  const SIGN_NAMES_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
                  const lagnaSign = kundali.ascendant.sign;
                  const getNarayanaHouseTheme = (dashSign: number): LocaleText | null => {
                    if (dashaSystem !== 'narayana') return null;
                    const fatherSign = ((dashSign - 1 + 8) % 12) + 1; // 9th from dasha sign
                    const childSign  = ((dashSign - 1 + 4) % 12) + 1; // 5th
                    const spouseSign = ((dashSign - 1 + 6) % 12) + 1; // 7th
                    const motherSign = ((dashSign - 1 + 3) % 12) + 1; // 4th
                    const careerSign = ((dashSign - 1 + 9) % 12) + 1; // 10th
                    const houseFromLagna = ((dashSign - lagnaSign + 12) % 12) + 1;
                    const sn = (s: number) => SIGN_NAMES_EN[s - 1];
                    return {
                      en: `H${houseFromLagna} from Lagna activated. Father: ${sn(fatherSign)} | Children: ${sn(childSign)} | Spouse: ${sn(spouseSign)} | Mother: ${sn(motherSign)} | Career: ${sn(careerSign)}`,
                      hi: `लग्न से भाव ${houseFromLagna} सक्रिय। पिता: ${sn(fatherSign)} | सन्तान: ${sn(childSign)} | जीवनसाथी: ${sn(spouseSign)} | माता: ${sn(motherSign)} | कैरियर: ${sn(careerSign)}`,
                    };
                  };
                  return (rasiData || []).map((d: { sign: number; signName: LocaleText; years: number; startDate: string; endDate: string }, i: number) => {
                    const now = new Date();
                    const start = new Date(d.startDate);
                    const end = new Date(d.endDate);
                    const isCurrent = now >= start && now <= end;
                    const isPast = now > end;
                    const houseFromLagna = ((d.sign - lagnaSign + 12) % 12) + 1;
                    const theme = getNarayanaHouseTheme(d.sign);
                    // Sign profiles apply to ALL sign-based dashas, not just Narayana
                    const signProfile = NARAYANA_SIGN_PROFILES[d.sign] || null;
                    const houseTheme = HOUSE_THEMES[houseFromLagna];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/50'}`} />
                            <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{d.signName[locale as 'en' | 'hi' | 'sa']}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isCurrent ? 'bg-gold-primary/15 text-gold-light' : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] text-text-tertiary'}`}>
                              H{houseFromLagna} — {houseTheme?.[locale === 'en' || isTamil ? 'en' : 'hi'] || ''}
                            </span>
                            <span className="text-text-tertiary text-xs">{d.years} {locale === 'en' || isTamil ? 'yrs' : 'वर्ष'}</span>
                          </div>
                          <span className="text-text-secondary text-xs font-mono">{d.startDate} → {d.endDate}</span>
                        </div>
                        {signProfile && (isCurrent || !isPast) && (
                          <div className="mt-2 pt-2 border-t border-gold-primary/10">
                            <p className={`text-xs leading-relaxed ${isCurrent ? 'text-text-secondary/80' : 'text-text-secondary/50'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {signProfile[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </p>
                          </div>
                        )}
                        {isCurrent && theme && (
                          <div className="mt-1 pt-1 border-t border-gold-primary/8">
                            <p className="text-text-secondary/70 text-xs leading-relaxed font-mono" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {theme[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </p>
                          </div>
                        )}
                        {/* Narayana Dasha sign interpretation — themes, focus, caution */}
                        {dashaSystem === 'narayana' && (isCurrent || !isPast) && (() => {
                          const interp = getNarayanaInterpretation(d.sign);
                          if (!interp) return null;
                          const lk = (locale === 'en' || isTamil) ? 'en' : 'hi';
                          return (
                            <div className={`mt-2 pt-2 border-t border-gold-primary/8 space-y-1.5 ${isCurrent ? '' : 'opacity-70'}`}>
                              <p className="text-text-secondary/80 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {interp.themes[lk]}
                              </p>
                              <p className="text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                <span className="text-emerald-400/70 font-medium">{lk === 'en' ? 'Focus: ' : 'ध्यान: '}</span>
                                <span className="text-text-secondary/70">{interp.focus[lk]}</span>
                              </p>
                              <p className="text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                <span className="text-amber-400/70 font-medium">{lk === 'en' ? 'Caution: ' : 'सावधानी: '}</span>
                                <span className="text-text-secondary/70">{interp.caution[lk]}</span>
                              </p>
                            </div>
                          );
                        })()}
                      </motion.div>
                    );
                  });
                }
                return null;
              })()}
              {!['narayana', 'kalachakra', 'sthira', 'shoola', 'mandooka', 'drig', 'navamsha_dasha'].includes(dashaSystem) && (() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const grahaDashaMap: Record<string, any[]> = {
                  vimshottari: kundali.dashas || [],
                  yogini: kundali.yoginiDashas || [],
                  ashtottari: kundali.ashtottariDashas || [],
                  shodasottari: kundali.shodasottariDasha || [],
                  dwadasottari: kundali.dwadasottariDasha || [],
                  panchottari: kundali.panchottariDasha || [],
                  satabdika: kundali.satabdikaDasha || [],
                  chaturaaseethi: kundali.chaturaaseethiDasha || [],
                  shashtihayani: kundali.shashtihayaniDasha || [],
                  moola: kundali.moolaDasha || [],
                  naisargika: kundali.naisargikaDasha || [],
                  tara: kundali.taraDasha || [],
                  tithi_ashtottari: kundali.tithiAshtottariDasha || [],
                  yoga_vimsottari: kundali.yogaVimsottariDasha || [],
                  buddhi_gathi: kundali.buddhiGathiDasha || [],
                };
                const dashaList = grahaDashaMap[dashaSystem] || kundali.dashas || [];

                // Planet colors and dasha significations
                const PLANET_COLORS: Record<string, string> = {
                  Sun: '#e67e22', Moon: '#ecf0f1', Mars: '#e74c3c', Mercury: '#2ecc71',
                  Jupiter: '#f39c12', Venus: '#e8e6e3', Saturn: '#3498db', Rahu: '#8e44ad', Ketu: '#95a5a6',
                };
                const DASHA_MEANING: Record<string, LocaleText> = {
                  Sun: { en: 'Authority, career, father, government, health vitality, soul purpose', hi: 'अधिकार, कैरियर, पिता, सरकार, स्वास्थ्य, आत्म उद्देश्य', sa: 'अधिकार, कैरियर, पिता, सरकार, स्वास्थ्य, आत्म उद्देश्य', mai: 'अधिकार, कैरियर, पिता, सरकार, स्वास्थ्य, आत्म उद्देश्य', mr: 'अधिकार, कैरियर, पिता, सरकार, स्वास्थ्य, आत्म उद्देश्य', ta: 'அதிகாரம், தொழில், தந்தை, அரசு, உடல் உயிர்ச்சக்தி, ஆன்ம நோக்கம்', te: 'అధికారం, వృత్తి, తండ్రి, ప్రభుత్వం, ఆరోగ్య శక్తి, ఆత్మ ఉద్దేశ్యం', bn: 'কর্তৃত্ব, কর্মজীবন, পিতা, সরকার, স্বাস্থ্য প্রাণশক্তি, আত্মার উদ্দেশ্য', kn: 'ಅಧಿಕಾರ, ವೃತ್ತಿ, ತಂದೆ, ಸರ್ಕಾರ, ಆರೋಗ್ಯ ಚೈತನ್ಯ, ಆತ್ಮ ಉದ್ದೇಶ', gu: 'સત્તા, કારકિર્દી, પિતા, સરકાર, આરોગ્ય ઉર્જા, આત્મા ઉદ્દેશ' },
                  Moon: { en: 'Mind, emotions, mother, home, public life, mental peace', hi: 'मन, भावनाएँ, माता, घर, सार्वजनिक जीवन, मानसिक शान्ति', sa: 'मन, भावनाएँ, माता, घर, सार्वजनिक जीवन, मानसिक शान्ति', mai: 'मन, भावनाएँ, माता, घर, सार्वजनिक जीवन, मानसिक शान्ति', mr: 'मन, भावनाएँ, माता, घर, सार्वजनिक जीवन, मानसिक शान्ति', ta: 'மனம், உணர்ச்சிகள், தாய், வீடு, பொது வாழ்க்கை, மன அமைதி', te: 'మనస్సు, భావోద్వేగాలు, తల్లి, ఇల్లు, బహిరంగ జీవితం, మానసిక శాంతి', bn: 'মন, আবেগ, মাতা, গৃহ, জনজীবন, মানসিক শান্তি', kn: 'ಮನಸ್ಸು, ಭಾವನೆಗಳು, ತಾಯಿ, ಮನೆ, ಸಾರ್ವಜನಿಕ ಜೀವನ, ಮಾನಸಿಕ ಶಾಂತಿ', gu: 'મન, લાગણીઓ, માતા, ઘર, જાહેર જીવન, માનસિક શાંતિ' },
                  Mars: { en: 'Energy, courage, property, siblings, surgery, disputes', hi: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्य, विवाद', sa: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्य, विवाद', mai: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्य, विवाद', mr: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्य, विवाद', ta: 'ஆற்றல், தைரியம், சொத்து, உடன்பிறப்புகள், அறுவை சிகிச்சை, வழக்குகள்', te: 'శక్తి, ధైర్యం, ఆస్తి, తోబుట్టువులు, శస్త్రచికిత్స, వివాదాలు', bn: 'শক্তি, সাহস, সম্পত্তি, ভাইবোন, শল্যচিকিৎসা, বিবাদ', kn: 'ಶಕ್ತಿ, ಧೈರ್ಯ, ಆಸ್ತಿ, ಒಡಹುಟ್ಟಿದವರು, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ವಿವಾದ', gu: 'શક્તિ, સાહસ, સંપત્તિ, ભાઈ-બહેન, શસ્ત્રક્રિયા, વિવાદ' },
                  Mercury: { en: 'Intellect, communication, business, education, skills', hi: 'बुद्धि, संवाद, व्यापार, शिक्षा, कौशल', sa: 'बुद्धि, संवाद, व्यापार, शिक्षा, कौशल', mai: 'बुद्धि, संवाद, व्यापार, शिक्षा, कौशल', mr: 'बुद्धि, संवाद, व्यापार, शिक्षा, कौशल', ta: 'புத்திசாலித்தனம், தகவல்தொடர்பு, வணிகம், கல்வி, திறன்கள்', te: 'బుద్ధి, సంభాషణ, వ్యాపారం, విద్య, నైపుణ్యాలు', bn: 'বুদ্ধি, যোগাযোগ, ব্যবসা, শিক্ষা, দক্ষতা', kn: 'ಬುದ್ಧಿ, ಸಂವಹನ, ವ್ಯಾಪಾರ, ಶಿಕ್ಷಣ, ಕೌಶಲ', gu: 'બુદ્ધિ, સંવાદ, વ્યાપાર, શિક્ષણ, કૌશલ્ય' },
                  Jupiter: { en: 'Wisdom, children, wealth, spirituality, guru, expansion', hi: 'ज्ञान, सन्तान, धन, आध्यात्मिकता, गुरु, विस्तार', sa: 'ज्ञान, सन्तान, धन, आध्यात्मिकता, गुरु, विस्तार', mai: 'ज्ञान, सन्तान, धन, आध्यात्मिकता, गुरु, विस्तार', mr: 'ज्ञान, सन्तान, धन, आध्यात्मिकता, गुरु, विस्तार', ta: 'ஞானம், குழந்தைகள், செல்வம், ஆன்மிகம், குரு, விரிவாக்கம்', te: 'జ్ఞానం, సంతానం, సంపద, ఆధ్యాత్మికత, గురువు, విస్తరణ', bn: 'জ্ঞান, সন্তান, সম্পদ, আধ্যাত্মিকতা, গুরু, প্রসার', kn: 'ಜ್ಞಾನ, ಮಕ್ಕಳು, ಸಂಪತ್ತು, ಅಧ್ಯಾತ್ಮ, ಗುರು, ವಿಸ್ತರಣೆ', gu: 'જ્ઞાન, સંતાન, સંપત્તિ, આધ્યાત્મિકતા, ગુરુ, વિસ્તરણ' },
                  Venus: { en: 'Love, marriage, luxury, arts, vehicles, comfort', hi: 'प्रेम, विवाह, विलासिता, कला, वाहन, सुख', sa: 'प्रेम, विवाह, विलासिता, कला, वाहन, सुख', mai: 'प्रेम, विवाह, विलासिता, कला, वाहन, सुख', mr: 'प्रेम, विवाह, विलासिता, कला, वाहन, सुख', ta: 'காதல், திருமணம், ஆடம்பரம், கலைகள், வாகனம், சுகம்', te: 'ప్రేమ, వివాహం, విలాసం, కళలు, వాహనం, సుఖం', bn: 'প্রেম, বিবাহ, বিলাসিতা, কলা, যান, সুখ', kn: 'ಪ್ರೇಮ, ವಿವಾಹ, ವೈಭವ, ಕಲೆಗಳು, ವಾಹನ, ಸುಖ', gu: 'પ્રેમ, લગ્ન, વૈભવ, કળાઓ, વાહન, સુખ' },
                  Saturn: { en: 'Discipline, karma, delays, service, longevity, hard work', hi: 'अनुशासन, कर्म, विलम्ब, सेवा, दीर्घायु, परिश्रम', sa: 'अनुशासन, कर्म, विलम्ब, सेवा, दीर्घायु, परिश्रम', mai: 'अनुशासन, कर्म, विलम्ब, सेवा, दीर्घायु, परिश्रम', mr: 'अनुशासन, कर्म, विलम्ब, सेवा, दीर्घायु, परिश्रम', ta: 'ஒழுக்கம், கர்மம், தாமதம், சேவை, நீண்ட ஆயுள், கடின உழைப்பு', te: 'క్రమశిక్షణ, కర్మ, ఆలస్యం, సేవ, దీర్ఘాయువు, కఠోర శ్రమ', bn: 'শৃঙ্খলা, কর্ম, বিলম্ব, সেবা, দীর্ঘায়ু, কঠোর পরিশ্রম', kn: 'ಶಿಸ್ತು, ಕರ್ಮ, ವಿಳಂಬ, ಸೇವೆ, ದೀರ್ಘಾಯುಷ್ಯ, ಕಠಿಣ ಪರಿಶ್ರಮ', gu: 'શિસ્ત, કર્મ, વિલંબ, સેવા, દીર્ઘાયુ, સખત પરિશ્રમ' },
                  Rahu: { en: 'Ambition, foreign, unconventional, obsession, technology', hi: 'महत्वाकांक्षा, विदेश, अपारम्परिक, जुनून, प्रौद्योगिकी', sa: 'महत्वाकांक्षा, विदेश, अपारम्परिक, जुनून, प्रौद्योगिकी', mai: 'महत्वाकांक्षा, विदेश, अपारम्परिक, जुनून, प्रौद्योगिकी', mr: 'महत्वाकांक्षा, विदेश, अपारम्परिक, जुनून, प्रौद्योगिकी', ta: 'லட்சியம், வெளிநாடு, வழக்கத்திற்கு மாறான, ஆவேசம், தொழில்நுட்பம்', te: 'ఆకాంక్ష, విదేశం, అసాంప్రదాయం, మోహం, సాంకేతికత', bn: 'উচ্চাকাঙ্ক্ষা, বিদেশ, অপ্রচলিত, আবেশ, প্রযুক্তি', kn: 'ಮಹತ್ವಾಕಾಂಕ್ಷೆ, ವಿದೇಶ, ಅಸಾಂಪ್ರದಾಯಿಕ, ವ್ಯಾಮೋಹ, ತಂತ್ರಜ್ಞಾನ', gu: 'મહત્ત્વાકાંક્ષા, વિદેશ, અપરંપરાગત, ઝનૂન, ટેક્નોલોજી' },
                  Ketu: { en: 'Spirituality, detachment, past karma, liberation, isolation', hi: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष, एकान्त', sa: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष, एकान्त', mai: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष, एकान्त', mr: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष, एकान्त', ta: 'ஆன்மிகம், பற்றின்மை, முன்வினை, முக்தி, தனிமை', te: 'ఆధ్యాత్మికత, వైరాగ్యం, పూర్వకర్మ, మోక్షం, ఏకాంతం', bn: 'আধ্যাত্মিকতা, বৈরাগ্য, পূর্বকর্ম, মোক্ষ, একাকীত্ব', kn: 'ಅಧ್ಯಾತ್ಮ, ವೈರಾಗ್ಯ, ಪೂರ್ವಕರ್ಮ, ಮೋಕ್ಷ, ಏಕಾಂತ', gu: 'આધ્યાત્મિકતા, વૈરાગ્ય, પૂર્વકર્મ, મોક્ષ, એકાંત' },
                };

                // Calculate full timeline span for the progress bar
                const firstStart = dashaList.length > 0 ? new Date(dashaList[0].startDate).getTime() : 0;
                const lastEnd = dashaList.length > 0 ? new Date(dashaList[dashaList.length - 1].endDate).getTime() : 1;
                const totalSpan = lastEnd - firstStart;
                const nowMs = Date.now();

                return (
                  <>
                    {/* Visual timeline bar */}
                    <div className="rounded-lg overflow-hidden h-10 sm:h-8 flex mb-8 border border-gold-primary/10">
                      {dashaList.map((d: { planetName: Record<string, string>; startDate: string; endDate: string; planet?: string }, idx: number) => {
                        const s = new Date(d.startDate).getTime();
                        const e = new Date(d.endDate).getTime();
                        const widthPct = ((e - s) / totalSpan) * 100;
                        const isCur = nowMs >= s && nowMs <= e;
                        const planetEn = d.planetName?.en || d.planet || '';
                        const color = PLANET_COLORS[planetEn] || '#d4a853';
                        return (
                          <div key={idx} className="relative group cursor-pointer" style={{ width: `${widthPct}%`, backgroundColor: `${color}${isCur ? '40' : '18'}`, borderRight: '1px solid rgba(10,14,39,0.5)' }}>
                            {isCur && (
                              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${color}30, ${color}50)` }}>
                                <div className="absolute left-0 top-0 bottom-0 bg-gold-primary/30" style={{ width: `${Math.min(100, ((nowMs - s) / (e - s)) * 100)}%` }} />
                              </div>
                            )}
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/70 truncate px-1">
                              {widthPct > 4 ? (planetEn.substring(0, 3)) : ''}
                            </span>
                            {/* Tooltip — visible on hover (desktop) and focus-within (touch tap) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-bg-primary/95 border border-gold-primary/20 rounded text-xs text-gold-light whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 active:opacity-100 transition-opacity pointer-events-none z-10" role="tooltip">
                              {tl(d.planetName, locale)} ({d.startDate.substring(0, 4)}–{d.endDate.substring(0, 4)})
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dasha cards with meaning */}
                    {dashaList.map((dasha: { planetName: Record<string, string>; planet?: string; startDate: string; endDate: string; subPeriods?: { planetName: Record<string, string>; planet?: string; startDate: string; endDate: string }[] }, i: number) => {
                      const now = new Date();
                      const start = new Date(dasha.startDate);
                      const end = new Date(dasha.endDate);
                      const isCurrent = now >= start && now <= end;
                      const isPast = now > end;
                      // Dasha Sandhi — within 3 months of boundary
                      const THREE_MONTHS_MS = 90 * 24 * 3600 * 1000;
                      const isEndingSoon = isCurrent && (end.getTime() - now.getTime()) <= THREE_MONTHS_MS;
                      const isStartingSoon = !isCurrent && !isPast && (start.getTime() - now.getTime()) <= THREE_MONTHS_MS;
                      const planetEn = dasha.planetName?.en || dasha.planet || '';
                      const color = PLANET_COLORS[planetEn] || '#d4a853';
                      const meaning = DASHA_MEANING[planetEn];
                      const durationYears = ((end.getTime() - start.getTime()) / (365.25 * 24 * 3600000)).toFixed(1);
                      const progressPct = isCurrent ? Math.min(100, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100) : isPast ? 100 : 0;

                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden ${isCurrent ? 'border-2 ring-1 ring-gold-primary/20' : ''} ${isPast ? 'opacity-40' : ''}`}
                          style={{ borderColor: isCurrent ? `${color}60` : undefined }}>
                          {/* Progress bar at top */}
                          <div className="h-1" style={{ backgroundColor: `${color}15` }}>
                            <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: color }} />
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color, opacity: isPast ? 0.3 : 0.8 }} />
                                <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                  {tl(dasha.planetName, locale)}
                                </span>
                                <span className="text-text-secondary/70 text-xs">{durationYears} {locale === 'en' || isTamil ? 'yrs' : 'वर्ष'}</span>
                                {isCurrent && <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-xs rounded-full font-bold animate-pulse">{locale === 'en' || isTamil ? 'NOW' : 'अभी'}</span>}
                                {(isEndingSoon || isStartingSoon) && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-bold border border-amber-500/30" title={locale === 'en' || isTamil ? 'Dasha Sandhi — junction zone, 3-6 months of instability. Avoid major commitments.' : 'दशा संधि — अस्थिर काल, नए कार्यों से बचें'}>
                                    {locale === 'en' || isTamil ? 'Sandhi' : 'संधि'}
                                  </span>
                                )}
                              </div>
                              <span className="text-text-secondary text-xs font-mono">{dasha.startDate.substring(0, 7)} → {dasha.endDate.substring(0, 7)}</span>
                            </div>

                            {/* Sandhi warning */}
                            {(isEndingSoon || isStartingSoon) && (
                              <div className="mt-2 ml-7 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 text-xs leading-relaxed">
                                  {locale === 'en' || isTamil
                                    ? isEndingSoon
                                      ? `Dasha Sandhi — this Mahadasha ends in ${Math.ceil((end.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} months. The junction zone brings instability; avoid irreversible decisions until the new dasha establishes.`
                                      : `Dasha Sandhi — this Mahadasha begins in ${Math.ceil((start.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} months. Prepare for a significant shift in life themes.`
                                    : isEndingSoon
                                      ? `दशा संधि — यह महादशा ${Math.ceil((end.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} माह में समाप्त। संधि काल में महत्वपूर्ण निर्णय टालें।`
                                      : `दशा संधि — यह महादशा ${Math.ceil((start.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} माह में प्रारम्भ। नए जीवन-विषयों की तैयारी करें।`}
                                </p>
                              </div>
                            )}

                            {/* Dasha meaning — generic keywords + chart-specific context */}
                            {meaning && !isPast && (() => {
                              // Chart-specific: where is this planet in YOUR chart?
                              const planetData = kundali.planets.find(p => p.planet.name.en === planetEn);
                              const HOUSE_KEYWORDS: Record<number, LocaleText> = {
                                1: { en: 'self, health, personality', hi: 'आत्म, स्वास्थ्य, व्यक्तित्व', sa: 'आत्म, स्वास्थ्य, व्यक्तित्व', mai: 'आत्म, स्वास्थ्य, व्यक्तित्व', mr: 'आत्म, स्वास्थ्य, व्यक्तित्व', ta: 'சுயம், ஆரோக்கியம், ஆளுமை', te: 'ఆత్మ, ఆరోగ్యం, వ్యక్తిత్వం', bn: 'আত্ম, স্বাস্থ্য, ব্যক্তিত্ব', kn: 'ಸ್ವಯಂ, ಆರೋಗ್ಯ, ವ್ಯಕ್ತಿತ್ವ', gu: 'સ્વ, આરોગ્ય, વ્યક્તિત્વ' },
                                2: { en: 'wealth, family, speech', hi: 'धन, परिवार, वाणी', sa: 'धन, परिवार, वाणी', mai: 'धन, परिवार, वाणी', mr: 'धन, परिवार, वाणी', ta: 'செல்வம், குடும்பம், பேச்சு', te: 'ధనం, కుటుంబం, వాక్కు', bn: 'ধন, পরিবার, বাক্', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಕ್', gu: 'ધન, કુટુંબ, વાણી' },
                                3: { en: 'courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद', sa: 'साहस, भाई-बहन, संवाद', mai: 'साहस, भाई-बहन, संवाद', mr: 'साहस, भाई-बहन, संवाद', ta: 'தைரியம், உடன்பிறப்புகள், தகவல்தொடர்பு', te: 'ధైర్యం, తోబుట్టువులు, సంభాషణ', bn: 'সাহস, ভাইবোন, যোগাযোগ', kn: 'ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು, ಸಂವಹನ', gu: 'સાહસ, ભાઈ-બહેન, સંવાદ' },
                                4: { en: 'home, mother, comfort', hi: 'घर, माता, सुख', sa: 'घर, माता, सुख', mai: 'घर, माता, सुख', mr: 'घर, माता, सुख', ta: 'வீடு, தாய், சுகம்', te: 'ఇల్లు, తల్లి, సుఖం', bn: 'গৃহ, মাতা, সুখ', kn: 'ಮನೆ, ತಾಯಿ, ಸುಖ', gu: 'ઘર, માતા, સુખ' },
                                5: { en: 'children, education, creativity', hi: 'सन्तान, शिक्षा, रचनात्मकता', sa: 'सन्तान, शिक्षा, रचनात्मकता', mai: 'सन्तान, शिक्षा, रचनात्मकता', mr: 'सन्तान, शिक्षा, रचनात्मकता', ta: 'குழந்தைகள், கல்வி, படைப்பாற்றல்', te: 'సంతానం, విద్య, సృజనాత్మకత', bn: 'সন্তান, শিক্ষা, সৃজনশীলতা', kn: 'ಮಕ್ಕಳು, ಶಿಕ್ಷಣ, ಸೃಜನಶೀಲತೆ', gu: 'સંતાન, શિક્ષણ, સર્જનાત્મકતા' },
                                6: { en: 'health challenges, competition, service', hi: 'स्वास्थ्य चुनौतियाँ, प्रतिस्पर्धा, सेवा', sa: 'स्वास्थ्य चुनौतियाँ, प्रतिस्पर्धा, सेवा', mai: 'स्वास्थ्य चुनौतियाँ, प्रतिस्पर्धा, सेवा', mr: 'स्वास्थ्य चुनौतियाँ, प्रतिस्पर्धा, सेवा', ta: 'உடல்நலச் சவால்கள், போட்டி, சேவை', te: 'ఆరోగ్య సవాళ్లు, పోటీ, సేవ', bn: 'স্বাস্থ্য চ্যালেঞ্জ, প্রতিযোগিতা, সেবা', kn: 'ಆರೋಗ್ಯ ಸವಾಲು, ಸ್ಪರ್ಧೆ, ಸೇವೆ', gu: 'આરોગ્ય પડકાર, સ્પર્ધા, સેવા' },
                                7: { en: 'marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', sa: 'विवाह, साझेदारी, व्यापार', mai: 'विवाह, साझेदारी, व्यापार', mr: 'विवाह, साझेदारी, व्यापार', ta: 'திருமணம், கூட்டு, வணிகம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર' },
                                8: { en: 'transformation, longevity, hidden matters', hi: 'परिवर्तन, दीर्घायु, गुप्त विषय', sa: 'परिवर्तन, दीर्घायु, गुप्त विषय', mai: 'परिवर्तन, दीर्घायु, गुप्त विषय', mr: 'परिवर्तन, दीर्घायु, गुप्त विषय', ta: 'மாற்றம், நீண்ட ஆயுள், மறைவான விஷயங்கள்', te: 'పరివర్తన, దీర్ఘాయువు, దాగిన విషయాలు', bn: 'রূপান্তর, দীর্ঘায়ু, গোপন বিষয়', kn: 'ಪರಿವರ್ತನೆ, ದೀರ್ಘಾಯುಷ್ಯ, ಗುಪ್ತ ವಿಷಯ', gu: 'પરિવર્તન, દીર્ઘાયુ, છુપાયેલી બાબતો' },
                                9: { en: 'fortune, dharma, guru, father', hi: 'भाग्य, धर्म, गुरु, पिता', sa: 'भाग्य, धर्म, गुरु, पिता', mai: 'भाग्य, धर्म, गुरु, पिता', mr: 'भाग्य, धर्म, गुरु, पिता', ta: 'பாக்கியம், தர்மம், குரு, தந்தை', te: 'భాగ్యం, ధర్మం, గురువు, తండ్రి', bn: 'ভাগ্য, ধর্ম, গুরু, পিতা', kn: 'ಭಾಗ್ಯ, ಧರ್ಮ, ಗುರು, ತಂದೆ', gu: 'ભાગ્ય, ધર્મ, ગુરુ, પિતા' },
                                10: { en: 'career, status, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार', sa: 'कैरियर, प्रतिष्ठा, अधिकार', mai: 'कैरियर, प्रतिष्ठा, अधिकार', mr: 'कैरियर, प्रतिष्ठा, अधिकार', ta: 'தொழில், அந்தஸ்து, அதிகாரம்', te: 'వృత్తి, హోదా, అధికారం', bn: 'কর্মজীবন, মর্যাদা, কর্তৃত্ব', kn: 'ವೃತ್ತಿ, ಸ್ಥಾನಮಾನ, ಅಧಿಕಾರ', gu: 'કારકિર્દી, દરજ્જો, સત્તા' },
                                11: { en: 'gains, income, friends', hi: 'लाभ, आय, मित्र', sa: 'लाभ, आय, मित्र', mai: 'लाभ, आय, मित्र', mr: 'लाभ, आय, मित्र', ta: 'லாபம், வருமானம், நண்பர்கள்', te: 'లాభం, ఆదాయం, మిత్రులు', bn: 'লাভ, আয়, বন্ধু', kn: 'ಲಾಭ, ಆದಾಯ, ಮಿತ್ರರು', gu: 'લાભ, આવક, મિત્રો' },
                                12: { en: 'expenses, liberation, foreign', hi: 'व्यय, मोक्ष, विदेश', sa: 'व्यय, मोक्ष, विदेश', mai: 'व्यय, मोक्ष, विदेश', mr: 'व्यय, मोक्ष, विदेश', ta: 'செலவு, முக்தி, வெளிநாடு', te: 'వ్యయం, మోక్షం, విదేశం', bn: 'ব্যয়, মোক্ষ, বিদেশ', kn: 'ವ್ಯಯ, ಮೋಕ್ಷ, ವಿದೇಶ', gu: 'ખર્ચ, મોક્ષ, વિદેશ' },
                              };
                              const houseKw = planetData ? HOUSE_KEYWORDS[planetData.house] : null;
                              const dignity = planetData?.isExalted ? (locale === 'en' || isTamil ? 'exalted (very strong)' : 'उच्च (अत्यन्त बलवान)')
                                : planetData?.isDebilitated ? (locale === 'en' || isTamil ? 'debilitated (weakened)' : 'नीच (दुर्बल)')
                                : planetData?.isOwnSign ? (locale === 'en' || isTamil ? 'in own sign (comfortable)' : 'स्वगृही (सहज)')
                                : null;
                              return (
                                <div className="mt-2 ml-7 space-y-1">
                                  <p className="text-text-secondary/60 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                    {locale === 'en' || isTamil ? meaning.en : meaning.hi}
                                  </p>
                                  {planetData && houseKw && (
                                    <p className={`text-xs leading-relaxed ${isCurrent ? 'text-gold-light/70' : 'text-text-secondary/50'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                      {locale === 'en' || isTamil
                                        ? <>{planetEn} is in your <strong>house {planetData.house}</strong> ({houseKw.en}) in {planetData.signName.en}.{dignity ? ` ${planetEn} is ${dignity}.` : ''} This dasha activates these life areas most strongly.</>
                                        : <>{dasha.planetName.hi} आपके <strong>भाव {planetData.house}</strong> ({houseKw.hi}) में {planetData.signName.hi} राशि में है।{dignity ? ` ${dasha.planetName.hi} ${dignity}।` : ''} यह दशा इन जीवन क्षेत्रों को सबसे अधिक सक्रिय करती है।</>
                                      }
                                    </p>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Current dasha progress detail */}
                            {isCurrent && (
                              <div className="mt-3 ml-7 text-xs text-gold-primary/70">
                                {Math.round(progressPct)}% {locale === 'en' || isTamil ? 'complete' : 'पूर्ण'} — {locale === 'en' || isTamil ? 'ends' : 'समाप्ति'} {end.toLocaleDateString(locale === 'en' || isTamil ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'short' })}
                              </div>
                            )}

                            {/* Sub-periods (Antar Dasha) — show for current maha dasha */}
                            {isCurrent && dasha.subPeriods && (
                              <div className="mt-4 ml-2 pl-2 sm:ml-4 sm:pl-4 border-l-2 space-y-1.5" style={{ borderColor: `${color}30` }}>
                                <div className="text-xs uppercase tracking-wider text-text-secondary/65 mb-2">{locale === 'en' || isTamil ? 'Antar Dasha (Sub-periods)' : 'अन्तर दशा'}</div>
                                {dasha.subPeriods.map((sub, j) => {
                                  const subStart = new Date(sub.startDate);
                                  const subEnd = new Date(sub.endDate);
                                  const isSubCurrent = now >= subStart && now <= subEnd;
                                  const isSubPast = now > subEnd;
                                  const subPlanetEn = sub.planetName?.en || sub.planet || '';
                                  const subColor = PLANET_COLORS[subPlanetEn] || '#d4a853';
                                  const subMeaning = DASHA_MEANING[subPlanetEn];
                                  return (
                                    <div key={j} className={`rounded-lg p-2.5 ${isSubCurrent ? 'bg-gold-primary/5 border border-gold-primary/15' : isSubPast ? 'opacity-30' : ''}`}>
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSubCurrent ? subColor : `${subColor}40` }} />
                                          <span className={`text-sm ${isSubCurrent ? 'text-gold-light font-semibold' : 'text-text-secondary'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                            {tl(sub.planetName, locale)}
                                          </span>
                                          {isSubCurrent && <span className="text-xs px-1.5 py-0.5 bg-gold-primary/15 text-gold-primary rounded-full">{locale === 'en' || isTamil ? 'active' : 'सक्रिय'}</span>}
                                        </span>
                                        <span className="font-mono text-xs text-text-secondary/70">{sub.startDate.substring(0, 7)} → {sub.endDate.substring(0, 7)}</span>
                                      </div>
                                      {isSubCurrent && subMeaning && (
                                        <p className="text-text-secondary/75 text-xs mt-1 ml-5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                          {planetEn}–{subPlanetEn}: {locale === 'en' || isTamil ? subMeaning.en : subMeaning.hi}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                );
              })()}
              {/* Dasha Sandhi (Junction Periods) */}
              {(() => {
                const sandhiPeriods = findDashaSandhiPeriods(kundali.dashas);
                if (sandhiPeriods.length === 0) return null;
                // Find current or upcoming sandhi
                const now = new Date().toISOString().split('T')[0];
                const upcoming = sandhiPeriods.filter(s => s.sandhiEnd >= now).slice(0, 3);
                if (upcoming.length === 0) return null;
                return (
                  <div className="mt-6 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 p-5">
                    <h4 className="text-amber-300 font-bold text-sm mb-3">
                      {locale === 'bn' ? 'দশা সন্ধি (সংক্রমণ কাল)' : locale === 'en' || isTamil ? 'Dasha Sandhi (Transition Periods)' : 'दशा सन्धि (संक्रमण काल)'}
                    </h4>
                    <p className="text-text-secondary text-xs mb-3">
                      {locale === 'bn' ? 'মহাদশার মধ্যবর্তী সংক্রমণ কাল — পরিবর্তন ও সমন্বয়ের সময়।'
                        : locale === 'en' || isTamil
                        ? 'Junction periods between Maha Dashas — times of transition and adjustment.'
                        : 'महादशाओं के बीच संक्रमण काल — परिवर्तन और समायोजन का समय।'}
                    </p>
                    <div className="space-y-3">
                      {upcoming.map((s, i) => {
                        const intensityColor = s.intensity === 'intense' ? 'border-red-500/20 bg-red-500/5' : s.intensity === 'moderate' ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5';
                        const intensityLabel = s.intensity === 'intense' ? (locale === 'hi' ? 'तीव्र' : locale === 'bn' ? 'তীব্র' : 'Intense') : s.intensity === 'moderate' ? (locale === 'hi' ? 'मध्यम' : locale === 'bn' ? 'মধ্যম' : 'Moderate') : (locale === 'hi' ? 'सौम्य' : locale === 'bn' ? 'সৌম্য' : 'Mild');
                        return (
                          <div key={i} className={`rounded-lg border p-3 ${intensityColor}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gold-light text-sm font-medium">
                                {s.outgoingPlanet} → {s.incomingPlanet}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border border-current opacity-70">
                                {intensityLabel}
                              </span>
                            </div>
                            <div className="text-text-secondary text-xs">
                              {s.sandhiStart} to {s.sandhiEnd} ({s.durationMonths} months)
                            </div>
                            <div className="text-text-secondary/60 text-[10px] mt-1">{tl(s.description, locale)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              <DashaInterpretation dashas={kundali.dashas} planets={kundali.planets} locale={locale} />
            </div>
          )}

          {/* ===== ASHTAKAVARGA TAB ===== */}
          {activeTab === 'ashtakavarga' && kundali.ashtakavarga && (
            <>
              {/* Educational intro */}
              <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5 space-y-3 mb-4">
                <h3 className="text-gold-light font-semibold text-sm">
                  {locale === 'en' || isTamil ? 'What is Ashtakavarga?' : 'अष्टकवर्ग क्या है?'}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {locale === 'en' || isTamil
                    ? 'Ashtakavarga is a unique Vedic scoring system where each planet assigns benefic points (bindus) to houses based on its position relative to other planets and the ascendant. Each house receives 0-8 points from each planet (8 contributors = "ashta"). Higher scores (5-8) indicate strength and favorable results; lower scores (0-2) suggest challenges. The Sarvashtakavarga (total across all planets) shows the overall strength of each house in your life — houses with 28+ total points are particularly strong.'
                    : 'अष्टकवर्ग एक अद्वितीय वैदिक अंक प्रणाली है जिसमें प्रत्येक ग्रह अन्य ग्रहों और लग्न के सापेक्ष अपनी स्थिति के आधार पर भावों को शुभ अंक (बिन्दु) प्रदान करता है। प्रत्येक भाव को प्रत्येक ग्रह से 0-8 अंक मिलते हैं (8 योगदानकर्ता = "अष्ट")। उच्च अंक (5-8) बल और अनुकूल फल दर्शाते हैं; न्यून अंक (0-2) चुनौतियाँ सूचित करते हैं। सर्वाष्टकवर्ग (सभी ग्रहों का कुल) आपके जीवन में प्रत्येक भाव की समग्र शक्ति दिखाता है — 28+ कुल अंक वाले भाव विशेष रूप से बलवान हैं।'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                    <p className="text-gold-light font-medium mb-1">{locale === 'en' || isTamil ? 'Bindus (0-8)' : 'बिन्दु (0-8)'}</p>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Points from each planet. 8 is maximum strength; 0 means no support from that planet.' : 'प्रत्येक ग्रह से अंक। 8 अधिकतम बल है; 0 का अर्थ उस ग्रह से कोई सहयोग नहीं।'}</p>
                  </div>
                  <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                    <p className="text-gold-light font-medium mb-1">{locale === 'en' || isTamil ? 'Sarvashtakavarga' : 'सर्वाष्टकवर्ग'}</p>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Total points per house across all 7 planets. 28+ is strong; below 22 needs attention.' : 'सभी 7 ग्रहों के कुल अंक प्रति भाव। 28+ बलवान; 22 से कम ध्यान योग्य।'}</p>
                  </div>
                  <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                    <p className="text-gold-light font-medium mb-1">{locale === 'en' || isTamil ? 'Transit Use' : 'गोचर उपयोग'}</p>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'When a planet transits a house with high bindus, results are favorable. Low-bindu transits bring challenges.' : 'जब कोई ग्रह उच्च बिन्दु वाले भाव में गोचर करता है तो फल अनुकूल होते हैं। न्यून बिन्दु वाले गोचर चुनौतियाँ लाते हैं।'}</p>
                  </div>
                </div>
              </div>
              <a href={`/${locale}/learn/ashtakavarga`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Ashtakavarga \u2192' : 'अष्टकवर्ग के बारे में जानें \u2192'}
              </a>
              <AshtakavargaTab ashtakavarga={kundali.ashtakavarga} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} t={t} lagnaSign={kundali.ascendant.sign} />
            </>
          )}

          {/* ===== TIPPANNI TAB ===== */}
          {/* Tippanni tab removed — content is in the Summary view */}

          {/* ===== VARGA ANALYSIS TAB ===== */}
          {activeTab === 'varga' && (
            <>
              <a href={`/${locale}/learn/vargas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Varga Charts \u2192' : 'वर्ग चार्ट के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-varga"
                title={locale === 'en' || isTamil ? 'What are Divisional Charts (Varga)?' : 'विभागीय चार्ट (वर्ग) क्या हैं?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil
                  ? 'Your birth chart (D1) shows the big picture. Divisional charts zoom into specific life areas by mathematically dividing each sign: D9 (Navamsha)=marriage/dharma/soul\'s true nature (most important after D1), D10 (Dashamsha)=career/profession, D2 (Hora)=wealth, D3 (Drekkana)=siblings, D7 (Saptamsha)=children, D12 (Dwadashamsha)=parents. If a planet is strong in BOTH D1 and D9, its results are confirmed and powerful.'
                  : 'आपकी जन्म कुण्डली (D1) व्यापक चित्र दिखाती है। विभागीय चार्ट प्रत्येक राशि को गणितीय रूप से विभाजित करके विशिष्ट जीवन क्षेत्रों में ज़ूम करते हैं: D9 (नवांश)=विवाह/धर्म/आत्मा का सच्चा स्वरूप (D1 के बाद सर्वाधिक महत्वपूर्ण), D10 (दशमांश)=कैरियर/व्यवसाय, D2 (होरा)=धन, D3 (द्रेष्काण)=भाई-बहन, D7 (सप्तांश)=संतान, D12 (द्वादशांश)=माता-पिता। यदि कोई ग्रह D1 और D9 दोनों में बलवान है तो उसके फल निश्चित और शक्तिशाली होते हैं।'}
              </InfoBlock>
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <VargasTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
              </Suspense>
              <VargaAnalysisTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
            </>
          )}

          {/* ===== GRAHA TAB ===== */}
          {activeTab === 'graha' && kundali.grahaDetails && (
            <>
              <a href={`/${locale}/learn/grahas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Grahas \u2192' : 'ग्रहों के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-graha"
                title={isDevanagari ? 'ग्रह विश्लेषण क्या है?' : 'What is Graha Analysis?'}
                defaultOpen={false}
              >
                {isDevanagari
                  ? 'विस्तृत ग्रह डेटा जिसमें सटीक निर्देशांक, गति, क्रांति और प्रत्येक ग्रह जिस नक्षत्र पाद (चतुर्थांश) में है वह शामिल हैं। उपग्रह (गुलिका और मंदी जैसे छाया उप-ग्रह) और सूक्ष्मता जोड़ते हैं। गति बताती है कि ग्रह कितना सक्रिय है — धीमे ग्रह (वक्री के निकट) विलंबित लेकिन गहरे परिणाम देते हैं। अक्षांश दर्शाता है कि ग्रह क्रांतिवृत्त से कितना दूर है — अत्यधिक अक्षांश ग्रह के प्रभाव को कमज़ोर करता है।'
                  : 'Extended planetary data including exact coordinates, speed, declination, and the nakshatra pada (quarter) each planet occupies. Upagrahas (shadow sub-planets like Gulika and Mandi) add nuance. Speed tells you how active a planet is — slow planets (near retrograde) give delayed but deep results. Latitude shows how far a planet is from the ecliptic — extreme latitudes weaken a planet\'s influence.'}
              </InfoBlock>
              <GrahaTab grahaDetails={kundali.grahaDetails} upagrahas={kundali.upagrahas || []} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} planetInsights={tip?.planetInsights} />
            </>
          )}

          {/* ===== YOGAS TAB ===== */}
          {activeTab === 'yogas' && kundali.yogasComplete && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/yogas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Yogas \u2192' : 'योगों के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-yogas"
                title={locale === 'en' || isTamil ? 'What are Yogas and why do they matter for your life?' : 'योग क्या हैं और वे आपके जीवन के लिए क्यों मायने रखते हैं?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p>A <strong>Yoga</strong> (literally &quot;union&quot;) is a special planetary combination that, when formed, creates a distinct life theme or talent. Think of them as <em>bonus features</em> installed at birth — certain yogas give natural wealth, others give fame, spiritual gifts, or leadership abilities.</p>
                    <p><strong>Key types of Yogas and what they mean for you:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">Raj Yogas</strong> (royal combinations) — Planets owning trikona (1st/5th/9th) and kendra (1st/4th/7th/10th) houses are conjunct or mutually aspect. Effect: authority, success, high social status, career breakthroughs. The more Raj Yogas you have, the more natural momentum towards achievement.</li>
                      <li><strong className="text-amber-300">Dhana Yogas</strong> (wealth combinations) — 1st, 2nd, 5th, 9th, 11th house lords linking together. Effect: financial gains, prosperity, material comfort. Strong Dhana Yogas mean money flows more easily.</li>
                      <li><strong className="text-sky-300">Viparita Raj Yogas</strong> — Lords of the challenging houses (6th, 8th, 12th) weakening each other. Effect: transformation through adversity — what seems like misfortune turns into a hidden advantage. These people bounce back stronger from setbacks.</li>
                      <li><strong className="text-gold-light">Pancha Mahapurusha Yogas</strong> — A strong planet in its own or exaltation sign in a kendra house. Creates an exceptional person in that planet&apos;s domain (e.g., Ruchaka = warrior/Mars energy; Hamsa = wisdom/Jupiter energy; Malavya = beauty/Venus energy).</li>
                      <li><strong className="text-red-400">Arishta Yogas</strong> — Challenging combinations. These are obstacles, but also opportunities for growth. Many great people have significant Arishta Yogas.</li>
                    </ul>
                    <p><strong>Important:</strong> A Yoga&apos;s strength depends on: (1) whether both planets are strong, (2) whether they are aspected by malefics, (3) whether the dasha of those planets is active. A yoga in a chart gives its results fully during its planet&apos;s dasha period.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>योग</strong> एक विशेष ग्रह संयोजन है जो जन्म से एक विशिष्ट जीवन विषय या प्रतिभा बनाता है — जैसे <em>बोनस सुविधाएं</em> जन्म में स्थापित। कुछ योग स्वाभाविक धन देते हैं, कुछ यश, आध्यात्मिक शक्ति या नेतृत्व।</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">राज योग</strong> — त्रिकोण और केन्द्र भाव के स्वामी एक साथ। प्रभाव: अधिकार, सफलता, उच्च सामाजिक स्थिति।</li>
                      <li><strong className="text-amber-300">धन योग</strong> — 1, 2, 5, 9, 11 भाव के स्वामी जुड़े हों। प्रभाव: आर्थिक समृद्धि।</li>
                      <li><strong className="text-sky-300">विपरीत राज योग</strong> — कठिन भावों (6, 8, 12) के स्वामी एक-दूसरे को कमज़ोर करें। प्रभाव: प्रतिकूलता से सफलता।</li>
                      <li><strong className="text-gold-light">पंचमहापुरुष योग</strong> — स्वगृह या उच्च में केन्द्र भाव में बलवान ग्रह। उस ग्रह के क्षेत्र में असाधारण व्यक्ति।</li>
                    </ul>
                    <p><strong>महत्वपूर्ण:</strong> योग का फल उसके ग्रहों की दशा में सबसे अधिक मिलता है।</p>
                  </div>
                )}
              </InfoBlock>
              <YogasTab yogas={kundali.yogasComplete} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              <YogasInterpretation yogas={kundali.yogasComplete} locale={locale} />
            </div>
          )}


          {/* ===== SHADBALA TAB ===== */}
          {activeTab === 'shadbala' && kundali.fullShadbala && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/shadbala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Shadbala \u2192' : 'षड्बल के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-shadbala"
                title={isDevanagari ? 'षड्बल क्या है?' : 'What is Shadbala (Six-fold Strength)?'}
                defaultOpen={false}
              >
                {isDevanagari
                  ? 'आपकी कुण्डली के सभी ग्रह समान रूप से शक्तिशाली नहीं होते। षड्बल 6 स्रोतों से प्रत्येक ग्रह की शक्ति मापता है: स्थानीय (कौन सी राशि), दिशात्मक (कौन सा भाव), कालिक (जन्म का समय), गतिज (गति), नैसर्गिक (जन्मजात शक्ति), और दृग् (अन्य ग्रहों का प्रभाव)। 1.0 रूप से ऊपर अंक पाने वाला ग्रह पर्याप्त बलवान है। उससे नीचे वह अपने वादे पूरे करने में संघर्ष करता है। सबसे बलवान ग्रह अक्सर आपके प्रमुख व्यक्तित्व लक्षण को परिभाषित करता है।'
                  : 'Not all planets in your chart are equally powerful. Shadbala measures each planet\'s strength from 6 sources: positional (which sign), directional (which house), temporal (time of birth), motional (speed), natural (inherent strength), and aspectual (other planets\' influence). A planet scoring above 1.0 Rupa is adequately strong. Below that, it struggles to deliver its promises. The strongest planet often defines your dominant personality trait.'}
              </InfoBlock>
              <ShadbalaInterpretation shadbala={kundali.fullShadbala} planets={kundali.planets} dashas={kundali.dashas || []} locale={locale} />
              <ShadbalaTab shadbala={kundali.fullShadbala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
            </div>
          )}

          {/* ===== BHAVABALA TAB ===== */}
          {activeTab === 'bhavabala' && kundali.bhavabala && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/bhavabala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Bhavabala \u2192' : 'भावबल के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-bhavabala"
                title={isDevanagari ? 'भावबल क्या है?' : 'What is Bhavabala (House Strength)?'}
                defaultOpen={false}
              >
                {isDevanagari
                  ? 'आपकी कुण्डली के 12 भावों में से प्रत्येक का एक शक्ति स्कोर होता है। बलवान भाव सहजता से अपने वादे पूरे करते हैं — एक बलवान 10वाँ भाव का अर्थ है कि करियर की सफलता स्वाभाविक रूप से आती है। कमज़ोर भाव उन क्षेत्रों को इंगित करते हैं जिनमें अधिक प्रयास की आवश्यकता है। यह स्कोर भावेश की शक्ति, उसमें स्थित ग्रहों और प्राप्त दृष्टियों का संयोजन है। आपका सबसे बलवान भाव अक्सर आपकी सबसे बड़ी जीवन संपदा बन जाता है।'
                  : 'Each of the 12 houses in your chart has a strength score. Strong houses deliver their promises easily — a strong 10th house means career success comes naturally. Weak houses indicate areas requiring more effort. The score combines the lord\'s strength, occupant planets, and aspects received. Your strongest house often becomes your greatest life asset.'}
              </InfoBlock>
              <BhavabalaTab bhavabala={kundali.bhavabala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              <BhavabalaInterpretation bhavabala={kundali.bhavabala} locale={locale} />
            </div>
          )}

          {/* ===== AVASTHAS TAB ===== */}
          {activeTab === 'avasthas' && kundali.avasthas && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/avasthas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Avasthas \u2192' : 'अवस्थाओं के बारे में जानें \u2192'}
              </a>
              <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                {locale === 'en' || isTamil ? 'Planetary Avasthas (States)' : 'ग्रह अवस्थाएं'}
              </h3>

              <InfoBlock
                id="kundali-avasthas"
                title={locale === 'en' || isTamil ? 'What are Avasthas and why do they matter?' : 'अवस्थाएं क्या हैं और वे क्यों मायने रखती हैं?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p>Think of <strong>Avasthas</strong> as the <em>mood and energy level</em> of each planet. A planet can be very powerful (high Shadbala) but still express itself awkwardly — like a strong person who is embarrassed or sleepy. Avasthas explain exactly HOW each planet is feeling and delivering its results.</p>
                    <p><strong>The 5 Avastha systems (each measures a different dimension):</strong></p>
                    <ul className="list-disc ml-4 space-y-2 text-xs">
                      <li><strong className="text-gold-light">Baladi (Age State)</strong> — Is the planet young and eager, middle-aged and settled, or old and tired? <em>Bala</em> (infant) = still developing its potential; <em>Kumara</em> (youth) = active and learning; <em>Yuva</em> (young adult) = full power and giving best results; <em>Vriddha</em> (old) = slowing down; <em>Mrita</em> (dead) = blocked, giving minimal results. <strong>Impact on you:</strong> Planets in Yuva state are your biggest assets right now.</li>
                      <li><strong className="text-gold-light">Jagradadi (Alertness)</strong> — Is the planet awake, dreaming, or asleep? <em>Jaagrit</em> (awake) = giving 100% of promised results; <em>Swapna</em> (dreaming) = giving 50%; <em>Sushupti</em> (deep sleep) = giving only 25%. <strong>Impact on you:</strong> An awake planet actively shapes your life; a sleeping one underperforms despite its placement.</li>
                      <li><strong className="text-gold-light">Deeptadi (Brightness)</strong> — How brightly is the planet shining? <em>Deepta</em> (radiant) = expressing fully and positively; <em>Swastha</em> (comfortable) = at ease; <em>Mudita</em> (pleased) = happy; <em>Shanta</em> (calm); <em>Dina</em> (dim); <em>Dukhita</em> (distressed) = struggling to express; <em>Vikala</em> (defective) = giving erratic results. <strong>Impact on you:</strong> Radiant planets perform with confidence; distressed ones give unpredictable or painful results.</li>
                      <li><strong className="text-gold-light">Lajjitadi (Emotional State)</strong> — Is the planet in a dignified or compromised emotional state? <em>Lajjita</em> (ashamed) = in a difficult sign with enemy planets; <em>Garvita</em> (proud) = exalted or own sign; <em>Kshudita</em> (hungry) = with enemies; <em>Trishita</em> (thirsty) = in a watery sign with enemy; <em>Mudita</em> (happy) = with friends; <em>Kshobhita</em> (agitated). <strong>Impact on you:</strong> Proud planets deliver results you can be proud of; ashamed planets create obstacles in their domain.</li>
                      <li><strong className="text-gold-light">Shayanadi (Activity Mode)</strong> — Is the planet active or resting? <em>Shayan</em> (sleeping/resting) = in a long resting phase, results come slowly; <em>Upaveshan</em> (seated) = stable; <em>Netrapani</em> (alert); <em>Prakashana</em> (radiant); <em>Gaman</em> (moving/active) = actively delivering results. <strong>Impact on you:</strong> Active (Gaman) planets are bringing their themes into your life right now.</li>
                    </ul>
                    <p className="text-text-secondary/70 text-xs"><strong>How to read the table:</strong> Green = positive/strong, Amber = mixed/moderate, Red = challenging. The AvasthaInterpretation section below gives you the combined personal meaning.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>अवस्थाएं</strong> प्रत्येक ग्रह का <em>मूड और ऊर्जा स्तर</em> हैं। एक शक्तिशाली ग्रह भी असहज तरीके से काम कर सकता है — जैसे एक ताकतवर व्यक्ति जो शर्मिंदा या नींद में हो। अवस्थाएं बताती हैं कि हर ग्रह ठीक कैसा महसूस कर रहा है।</p>
                    <p><strong>5 अवस्था पद्धतियाँ:</strong></p>
                    <ul className="list-disc ml-4 space-y-2 text-xs">
                      <li><strong className="text-gold-light">बालादि (आयु अवस्था)</strong> — बाल (शिशु) = क्षमता विकसित हो रही है; कुमार (युवा) = सक्रिय; युव (युवा वयस्क) = पूर्ण शक्ति; वृद्ध (वृद्ध) = धीमा; मृत = अवरुद्ध। <strong>आपके लिए:</strong> युव अवस्था में ग्रह आपकी सबसे बड़ी संपत्ति हैं।</li>
                      <li><strong className="text-gold-light">जागृतादि (सजगता)</strong> — जाग्रत = 100% परिणाम; स्वप्न = 50%; सुषुप्ति = केवल 25%। <strong>आपके लिए:</strong> जाग्रत ग्रह आपके जीवन को सक्रिय रूप से आकार देता है।</li>
                      <li><strong className="text-gold-light">दीप्तादि (प्रकाश)</strong> — दीप्त = पूरी तरह चमकता है; सुस्थ = सहज; मुदित = प्रसन्न; दीन = मंद; दुःखित = संघर्षशील। <strong>आपके लिए:</strong> दीप्त ग्रह आत्मविश्वास से परिणाम देते हैं।</li>
                      <li><strong className="text-gold-light">लज्जितादि (भावनात्मक)</strong> — गर्वित (गर्व) = उच्च/स्वगृह; लज्जित (शर्मिंदा) = शत्रु के साथ; मुदित (प्रसन्न) = मित्रों के साथ। <strong>आपके लिए:</strong> गर्वित ग्रह ऐसे परिणाम देते हैं जिन पर गर्व हो।</li>
                      <li><strong className="text-gold-light">शयनादि (गतिविधि)</strong> — गमन (सक्रिय) = अभी परिणाम दे रहा है; शयन (विश्राम) = परिणाम धीरे आते हैं। <strong>आपके लिए:</strong> गमन ग्रह अभी आपके जीवन में अपने विषय ला रहे हैं।</li>
                    </ul>
                    <p className="text-text-secondary/70 text-xs"><strong>तालिका पढ़ने का तरीका:</strong> हरा = सकारात्मक, पीला = मिश्रित, लाल = चुनौतीपूर्ण।</p>
                  </div>
                )}
              </InfoBlock>

              <p className="text-text-secondary text-xs text-center mb-4">
                {locale === 'en' || isTamil ? 'HOW each planet expresses its energy — 5 classification systems from BPHS Ch.44-45' : 'प्रत्येक ग्रह अपनी ऊर्जा कैसे व्यक्त करता है — BPHS अ.44-45 से 5 वर्गीकरण'}
              </p>
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gold-primary/15">
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Planet' : 'ग्रह'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Baladi (Age)' : 'बालादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Jagradadi (Wakefulness)' : 'जागृतादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Deeptadi (Luminosity)' : 'दीप्तादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Lajjitadi (Emotional)' : 'लज्जितादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Shayanadi (Activity)' : 'शयनादि'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/5">
                    {kundali.avasthas.map((av) => {
                      const pName = kundali.planets.find(p => p.planet.id === av.planetId)?.planet.name[locale as Locale] || `P${av.planetId}`;
                      return (
                        <tr key={av.planetId} className="hover:bg-gold-primary/3">
                          <td className="py-2.5 px-3 text-gold-light font-bold" style={headingFont}>{pName}</td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.baladi.strength >= 70 ? 'bg-emerald-500/10 text-emerald-300' : av.baladi.strength >= 40 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.baladi.name[locale as Locale] || av.baladi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.jagradadi.quality === 'full' ? 'bg-emerald-500/10 text-emerald-300' : av.jagradadi.quality === 'half' ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.jagradadi.name[locale as Locale] || av.jagradadi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.deeptadi.luminosity >= 60 ? 'bg-emerald-500/10 text-emerald-300' : av.deeptadi.luminosity >= 30 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.deeptadi.name[locale as Locale] || av.deeptadi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.lajjitadi.effect === 'benefic' ? 'bg-emerald-500/10 text-emerald-300' : av.lajjitadi.effect === 'malefic' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-300'}`}>{av.lajjitadi.name[locale as Locale] || av.lajjitadi.name.en}</span></td>
                          <td className="py-2.5 px-3 text-text-secondary">{av.shayanadi.name[locale as Locale] || av.shayanadi.name.en}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <AvasthasInterpretation avasthas={kundali.avasthas} planets={kundali.planets} locale={locale} />
            </div>
          )}

          {/* ===== ARGALA TAB ===== */}
          {activeTab === 'argala' && kundali.argala && (
            <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5 space-y-3 mb-4">
              <h3 className="text-gold-light font-semibold text-sm">
                {locale === 'en' || isTamil ? 'What is Argala?' : 'अर्गला क्या है?'}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {locale === 'en' || isTamil
                  ? 'Argala ("bolt" or "intervention") is a Jaimini concept describing how planets in certain houses intervene in the affairs of other houses. A planet in the 2nd, 4th, or 11th from any house creates an argala (positive intervention) on that house, strengthening its results. However, planets in the 3rd, 10th, or 12th can create virodha-argala (obstruction), blocking the intervention. Understanding argala reveals which planets actively support or block the potential of each house in your chart.'
                  : 'अर्गला ("बोल्ट" या "हस्तक्षेप") एक जैमिनी अवधारणा है जो बताती है कि कुछ भावों में स्थित ग्रह अन्य भावों के मामलों में कैसे हस्तक्षेप करते हैं। किसी भाव से 2, 4, या 11वें स्थान में ग्रह उस भाव पर अर्गला (सकारात्मक हस्तक्षेप) बनाता है। लेकिन 3, 10, या 12वें स्थान के ग्रह विरोध-अर्गला (बाधा) बना सकते हैं। अर्गला समझने से पता चलता है कि कौन से ग्रह आपकी कुंडली के प्रत्येक भाव की क्षमता को सक्रिय रूप से सहयोग या अवरुद्ध करते हैं।'}
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                  <p className="text-gold-light font-medium mb-1">{locale === 'en' || isTamil ? 'Primary Argala' : 'प्राथमिक अर्गला'}</p>
                  <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Planets in 2nd, 4th, 11th from a house boost that house\'s results.' : 'किसी भाव से 2, 4, 11वें स्थान के ग्रह उस भाव के फलों को बढ़ाते हैं।'}</p>
                </div>
                <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                  <p className="text-gold-light font-medium mb-1">{locale === 'en' || isTamil ? 'Virodha (Obstruction)' : 'विरोध (बाधा)'}</p>
                  <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Planets in 3rd, 10th, 12th from a house can block the argala.' : '3, 10, 12वें स्थान के ग्रह अर्गला को अवरुद्ध कर सकते हैं।'}</p>
                </div>
                <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                  <p className="text-gold-light font-medium mb-1">{locale === 'en' || isTamil ? 'Practical Use' : 'व्यावहारिक उपयोग'}</p>
                  <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Strong unobstructed argala = that house\'s matters flow easily. Obstructed argala = effort needed.' : 'मजबूत अबाधित अर्गला = उस भाव के कार्य सहजता से चलते हैं। बाधित अर्गला = प्रयास आवश्यक।'}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'argala' && kundali.argala && (<a href={`/${locale}/learn/argala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Argala \u2192' : 'अर्गला के बारे में जानें \u2192'}</a>)}
          {activeTab === 'argala' && kundali.argala && (() => {
            const HOUSE_SIGNIFICATIONS: LocaleText[] = [
              { en: 'Self, body, personality, health', hi: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य', sa: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य', mai: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य', mr: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य', ta: 'சுயம், உடல், ஆளுமை, ஆரோக்கியம்', te: 'ఆత్మ, శరీరం, వ్యక్తిత్వం, ఆరోగ్యం', bn: 'আত্ম, শরীর, ব্যক্তিত্ব, স্বাস্থ্য', kn: 'ಸ್ವಯಂ, ದೇಹ, ವ್ಯಕ್ತಿತ್ವ, ಆರೋಗ್ಯ', gu: 'સ્વ, શરીર, વ્યક્તિત્વ, આરોગ્ય' },
              { en: 'Wealth, family, speech, food', hi: 'धन, परिवार, वाणी, भोजन', sa: 'धन, परिवार, वाणी, भोजन', mai: 'धन, परिवार, वाणी, भोजन', mr: 'धन, परिवार, वाणी, भोजन', ta: 'செல்வம், குடும்பம், பேச்சு, உணவு', te: 'ధనం, కుటుంబం, వాక్కు, ఆహారం', bn: 'ধন, পরিবার, বাক্, খাদ্য', kn: 'ಧನ, ಕುಟುಂಬ, ವಾಕ್, ಆಹಾರ', gu: 'ધન, કુટુંબ, વાણી, ભોજન' },
              { en: 'Courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद', sa: 'साहस, भाई-बहन, संवाद', mai: 'साहस, भाई-बहन, संवाद', mr: 'साहस, भाई-बहन, संवाद', ta: 'தைரியம், உடன்பிறப்புகள், தகவல்தொடர்பு', te: 'ధైర్యం, తోబుట్టువులు, సంభాషణ', bn: 'সাহস, ভাইবোন, যোগাযোগ', kn: 'ಧೈರ್ಯ, ಒಡಹುಟ್ಟಿದವರು, ಸಂವಹನ', gu: 'સાહસ, ભાઈ-બહેન, સંવાદ' },
              { en: 'Home, mother, comfort, property', hi: 'घर, माता, सुख, सम्पत्ति', sa: 'घर, माता, सुख, सम्पत्ति', mai: 'घर, माता, सुख, सम्पत्ति', mr: 'घर, माता, सुख, सम्पत्ति', ta: 'வீடு, தாய், சுகம், சொத்து', te: 'ఇల్లు, తల్లి, సుఖం, ఆస్తి', bn: 'গৃহ, মাতা, সুখ, সম্পত্তি', kn: 'ಮನೆ, ತಾಯಿ, ಸುಖ, ಆಸ್ತಿ', gu: 'ઘર, માતા, સુખ, સંપત્તિ' },
              { en: 'Children, intelligence, education', hi: 'सन्तान, बुद्धि, शिक्षा', sa: 'सन्तान, बुद्धि, शिक्षा', mai: 'सन्तान, बुद्धि, शिक्षा', mr: 'सन्तान, बुद्धि, शिक्षा', ta: 'குழந்தைகள், புத்திசாலித்தனம், கல்வி', te: 'సంతానం, బుద్ధి, విద్య', bn: 'সন্তান, বুদ্ধি, শিক্ষা', kn: 'ಮಕ್ಕಳು, ಬುದ್ಧಿ, ಶಿಕ್ಷಣ', gu: 'સંતાન, બુદ્ધિ, શિક્ષણ' },
              { en: 'Enemies, disease, debts, service', hi: 'शत्रु, रोग, ऋण, सेवा', sa: 'शत्रु, रोग, ऋण, सेवा', mai: 'शत्रु, रोग, ऋण, सेवा', mr: 'शत्रु, रोग, ऋण, सेवा', ta: 'எதிரிகள், நோய், கடன், சேவை', te: 'శత్రువులు, రోగం, ఋణం, సేవ', bn: 'শত্রু, রোগ, ঋণ, সেবা', kn: 'ಶತ್ರು, ರೋಗ, ಋಣ, ಸೇವೆ', gu: 'શત્રુ, રોગ, ઋણ, સેવા' },
              { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार', sa: 'विवाहः, साझेदारी, वाणिज्यम्', mai: 'बियाह, साझेदारी, व्यापार', mr: 'विवाह, भागीदारी, व्यापार', ta: 'திருமணம், கூட்டாண்மை, வணிகம்', te: 'వివాహం, భాగస్వామ్యం, వ్యాపారం', bn: 'বিবাহ, অংশীদারিত্ব, ব্যবসা', kn: 'ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ, ವ್ಯಾಪಾರ', gu: 'લગ્ન, ભાગીદારી, વ્યાપાર' },
              { en: 'Longevity, transformation, occult', hi: 'दीर्घायु, परिवर्तन, गुप्त', sa: 'दीर्घायु, परिवर्तन, गुप्त', mai: 'दीर्घायु, परिवर्तन, गुप्त', mr: 'दीर्घायु, परिवर्तन, गुप्त', ta: 'ஆயுள், மாற்றம், அமானுஷ்யம்', te: 'ఆయుష్షు, పరివర్తన, అతీంద్రియం', bn: 'দীর্ঘায়ু, রূপান্তর, গুপ্তবিদ্যা', kn: 'ಆಯುಷ್ಯ, ಪರಿವರ್ತನೆ, ಗುಪ್ತವಿದ್ಯೆ', gu: 'આયુષ્ય, પરિવર્તન, ગૂઢવિદ્યા' },
              { en: 'Dharma, father, fortune, guru', hi: 'धर्म, पिता, भाग्य, गुरु', sa: 'धर्म, पिता, भाग्य, गुरु', mai: 'धर्म, पिता, भाग्य, गुरु', mr: 'धर्म, पिता, भाग्य, गुरु', ta: 'தர்மம், தந்தை, பாக்கியம், குரு', te: 'ధర్మం, తండ్రి, భాగ్యం, గురువు', bn: 'ধর্ম, পিতা, ভাগ্য, গুরু', kn: 'ಧರ್ಮ, ತಂದೆ, ಭಾಗ್ಯ, ಗುರು', gu: 'ધર્મ, પિતા, ભાગ્ય, ગુરુ' },
              { en: 'Career, status, authority, fame', hi: 'कैरियर, प्रतिष्ठा, अधिकार, यश', sa: 'कैरियर, प्रतिष्ठा, अधिकार, यश', mai: 'कैरियर, प्रतिष्ठा, अधिकार, यश', mr: 'कैरियर, प्रतिष्ठा, अधिकार, यश', ta: 'தொழில், அந்தஸ்து, அதிகாரம், புகழ்', te: 'వృత్తి, హోదా, అధికారం, కీర్తి', bn: 'কর্মজীবন, মর্যাদা, কর্তৃত্ব, যশ', kn: 'ವೃತ್ತಿ, ಸ್ಥಾನಮಾನ, ಅಧಿಕಾರ, ಕೀರ್ತಿ', gu: 'કારકિર્દી, દરજ્જો, સત્તા, યશ' },
              { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ', sa: 'लाभः, आयः, मित्राणि, इच्छाः', mai: 'लाभ, आय, मित्र, इच्छा', mr: 'लाभ, उत्पन्न, मित्र, इच्छा', ta: 'லாபம், வருமானம், நண்பர்கள், ஆசைகள்', te: 'లాభం, ఆదాయం, మిత్రులు, కోరికలు', bn: 'লাভ, আয়, বন্ধু, ইচ্ছা', kn: 'ಲಾಭ, ಆದಾಯ, ಮಿತ್ರರು, ಆಸೆಗಳು', gu: 'લાભ, આવક, મિત્રો, ઇચ્છાઓ' },
              { en: 'Expenses, liberation, foreign, loss', hi: 'व्यय, मोक्ष, विदेश, हानि', sa: 'व्यय, मोक्ष, विदेश, हानि', mai: 'व्यय, मोक्ष, विदेश, हानि', mr: 'व्यय, मोक्ष, विदेश, हानि', ta: 'செலவு, முக்தி, வெளிநாடு, நஷ்டம்', te: 'వ్యయం, మోక్షం, విదేశం, నష్టం', bn: 'ব্যয়, মোক্ষ, বিদেশ, ক্ষতি', kn: 'ವ್ಯಯ, ಮೋಕ್ಷ, ವಿದೇಶ, ನಷ್ಟ', gu: 'ખર્ચ, મોક્ષ, વિદેશ, ખોટ' },
            ];
            const OBSTRUCTION_REMEDIES: LocaleText[] = [
              { en: 'Strengthen lagna lord — wear its gemstone, chant its mantra', hi: 'लग्नेश को बलवान करें — रत्न धारण, मन्त्र जाप', sa: 'लग्नेश को बलवान करें — रत्न धारण, मन्त्र जाप', mai: 'लग्नेश को बलवान करें — रत्न धारण, मन्त्र जाप', mr: 'लग्नेश को बलवान करें — रत्न धारण, मन्त्र जाप', ta: 'லக்ன அதிபதியை பலப்படுத்துங்கள் — அதன் ரத்தினம் அணியுங்கள், அதன் மந்திரம் ஜபியுங்கள்', te: 'లగ్నాధిపతిని బలపరచండి — దాని రత్నం ధరించండి, దాని మంత్రం జపించండి', bn: 'লগ্নেশকে শক্তিশালী করুন — তার রত্ন পরুন, তার মন্ত্র জপ করুন', kn: 'ಲಗ್ನಾಧಿಪತಿಯನ್ನು ಬಲಪಡಿಸಿ — ಅದರ ರತ್ನ ಧರಿಸಿ, ಅದರ ಮಂತ್ರ ಜಪಿಸಿ', gu: 'લગ્નેશને બળવાન કરો — તેનું રત્ન ધારણ કરો, તેનો મંત્ર જાપ કરો' },
              { en: 'Donate food and support family harmony', hi: 'भोजन दान करें, पारिवारिक सामंजस्य बनाएँ', sa: 'भोजन दान करें, पारिवारिक सामंजस्य बनाएँ', mai: 'भोजन दान करें, पारिवारिक सामंजस्य बनाएँ', mr: 'भोजन दान करें, पारिवारिक सामंजस्य बनाएँ', ta: 'உணவு தானம் செய்யுங்கள், குடும்ப நல்லிணக்கத்தை ஆதரியுங்கள்', te: 'ఆహారం దానం చేయండి, కుటుంబ సామరస్యాన్ని పెంపొందించండి', bn: 'খাদ্য দান করুন এবং পারিবারিক সম্প্রীতি বজায় রাখুন', kn: 'ಆಹಾರ ದಾನ ಮಾಡಿ ಮತ್ತು ಕುಟುಂಬ ಸಾಮರಸ್ಯವನ್ನು ಬೆಂಬಲಿಸಿ', gu: 'ભોજન દાન કરો અને કુટુંબ સુમેળને ટેકો આપો' },
              { en: 'Practice courage, support siblings, write/communicate more', hi: 'साहस का अभ्यास, भाई-बहनों का समर्थन, लेखन/संवाद', sa: 'साहस का अभ्यास, भाई-बहनों का समर्थन, लेखन/संवाद', mai: 'साहस का अभ्यास, भाई-बहनों का समर्थन, लेखन/संवाद', mr: 'साहस का अभ्यास, भाई-बहनों का समर्थन, लेखन/संवाद', ta: 'தைரியத்தைப் பயிற்சி செய்யுங்கள், உடன்பிறப்புகளை ஆதரியுங்கள், எழுதுங்கள்/தொடர்பு கொள்ளுங்கள்', te: 'ధైర్యం అభ్యసించండి, తోబుట్టువులకు మద్దతు ఇవ్వండి, ఎక్కువగా రాయండి/సంభాషించండి', bn: 'সাহস অভ্যাস করুন, ভাইবোনদের সমর্থন করুন, বেশি লিখুন/যোগাযোগ করুন', kn: 'ಧೈರ್ಯ ಅಭ್ಯಾಸ ಮಾಡಿ, ಒಡಹುಟ್ಟಿದವರನ್ನು ಬೆಂಬಲಿಸಿ, ಹೆಚ್ಚು ಬರೆಯಿರಿ/ಸಂವಹಿಸಿ', gu: 'સાહસ કેળવો, ભાઈ-બહેનને ટેકો આપો, વધુ લખો/સંવાદ કરો' },
              { en: 'Serve mother, maintain home sanctity, perform Vastu puja', hi: 'माता की सेवा, घर की पवित्रता, वास्तु पूजा', sa: 'माता की सेवा, घर की पवित्रता, वास्तु पूजा', mai: 'माता की सेवा, घर की पवित्रता, वास्तु पूजा', mr: 'माता की सेवा, घर की पवित्रता, वास्तु पूजा', ta: 'தாயின் சேவை செய்யுங்கள், வீட்டின் புனிதத்தைப் பேணுங்கள், வாஸ்து பூஜை செய்யுங்கள்', te: 'తల్లికి సేవ చేయండి, ఇంటి పవిత్రత కాపాడండి, వాస్తు పూజ చేయండి', bn: 'মাতার সেবা করুন, গৃহের পবিত্রতা রক্ষা করুন, বাস্তু পূজা করুন', kn: 'ತಾಯಿಯ ಸೇವೆ ಮಾಡಿ, ಮನೆಯ ಪವಿತ್ರತೆ ಕಾಪಾಡಿ, ವಾಸ್ತು ಪೂಜೆ ಮಾಡಿ', gu: 'માતાની સેવા કરો, ઘરની પવિત્રતા જાળવો, વાસ્તુ પૂજા કરો' },
              { en: 'Worship Saraswati/Jupiter, educate children, creative pursuits', hi: 'सरस्वती/गुरु पूजा, सन्तान शिक्षा, सृजनात्मक कार्य', sa: 'सरस्वती/गुरु पूजा, सन्तान शिक्षा, सृजनात्मक कार्य', mai: 'सरस्वती/गुरु पूजा, सन्तान शिक्षा, सृजनात्मक कार्य', mr: 'सरस्वती/गुरु पूजा, सन्तान शिक्षा, सृजनात्मक कार्य', ta: 'சரஸ்வதி/குருவை வழிபடுங்கள், குழந்தைகளுக்கு கல்வி கற்பியுங்கள், படைப்பாற்றல் முயற்சிகள்', te: 'సరస్వతి/గురువును పూజించండి, పిల్లలకు విద్య నేర్పండి, సృజనాత్మక కార్యక్రమాలు', bn: 'সরস্বতী/বৃহস্পতি পূজা করুন, সন্তানদের শিক্ষা দিন, সৃজনশীল কার্যকলাপ', kn: 'ಸರಸ್ವತಿ/ಗುರುವನ್ನು ಪೂಜಿಸಿ, ಮಕ್ಕಳಿಗೆ ಶಿಕ್ಷಣ ನೀಡಿ, ಸೃಜನಾತ್ಮಕ ಚಟುವಟಿಕೆ', gu: 'સરસ્વતી/ગુરુની પૂજા કરો, બાળકોને શિક્ષણ આપો, સર્જનાત્મક પ્રવૃત્તિ' },
              { en: 'Serve the sick/poor, chant Hanuman Chalisa, stay debt-free', hi: 'रोगी/गरीबों की सेवा, हनुमान चालीसा, ऋणमुक्त रहें', sa: 'रोगी/गरीबों की सेवा, हनुमान चालीसा, ऋणमुक्त रहें', mai: 'रोगी/गरीबों की सेवा, हनुमान चालीसा, ऋणमुक्त रहें', mr: 'रोगी/गरीबों की सेवा, हनुमान चालीसा, ऋणमुक्त रहें', ta: 'நோயாளிகள்/ஏழைகளுக்கு சேவை செய்யுங்கள், ஹனுமான் சாலீசா ஜபியுங்கள், கடனின்றி இருங்கள்', te: 'రోగులు/పేదలకు సేవ చేయండి, హనుమాన్ చాలీసా జపించండి, అప్పు లేకుండా ఉండండి', bn: 'রোগী/দরিদ্রদের সেবা করুন, হনুমান চালিসা পাঠ করুন, ঋণমুক্ত থাকুন', kn: 'ರೋಗಿಗಳು/ಬಡವರಿಗೆ ಸೇವೆ ಮಾಡಿ, ಹನುಮಾನ್ ಚಾಲೀಸಾ ಜಪಿಸಿ, ಋಣಮುಕ್ತರಾಗಿರಿ', gu: 'બીમાર/ગરીબોની સેવા કરો, હનુમાન ચાલીસા જાપ કરો, દેવામુક્ત રહો' },
              { en: 'Strengthen Venus, respect spouse, practice compromise', hi: 'शुक्र को बलवान करें, जीवनसाथी का सम्मान, समझौता', sa: 'शुक्र को बलवान करें, जीवनसाथी का सम्मान, समझौता', mai: 'शुक्र को बलवान करें, जीवनसाथी का सम्मान, समझौता', mr: 'शुक्र को बलवान करें, जीवनसाथी का सम्मान, समझौता', ta: 'சுக்கிரனை பலப்படுத்துங்கள், துணைவரை மதியுங்கள், சமரசம் பயிற்சி செய்யுங்கள்', te: 'శుక్రుడిని బలపరచండి, భాగస్వామిని గౌరవించండి, రాజీ అభ్యసించండి', bn: 'শুক্রকে শক্তিশালী করুন, স্ত্রী/স্বামীকে সম্মান করুন, আপোষ অভ্যাস করুন', kn: 'ಶುಕ್ರನನ್ನು ಬಲಪಡಿಸಿ, ಸಂಗಾತಿಯನ್ನು ಗೌರವಿಸಿ, ರಾಜಿ ಅಭ್ಯಾಸ ಮಾಡಿ', gu: 'શુક્રને બળવાન કરો, જીવનસાથીનું સન્માન કરો, સમાધાન કેળવો' },
              { en: 'Chant Maha Mrityunjaya, embrace change, study occult wisely', hi: 'महामृत्युंजय जाप, परिवर्तन स्वीकार, गुप्त विद्या', sa: 'महामृत्युंजय जाप, परिवर्तन स्वीकार, गुप्त विद्या', mai: 'महामृत्युंजय जाप, परिवर्तन स्वीकार, गुप्त विद्या', mr: 'महामृत्युंजय जाप, परिवर्तन स्वीकार, गुप्त विद्या', ta: 'மகா மிருத்யுஞ்ஜய மந்திரம் ஜபியுங்கள், மாற்றத்தை ஏற்றுக்கொள்ளுங்கள், அமானுஷ்யத்தை விவேகமாக கற்றுக்கொள்ளுங்கள்', te: 'మహా మృత్యుంజయ జపించండి, మార్పును స్వీకరించండి, అతీంద్రియ విద్యను వివేకంతో అధ్యయనం చేయండి', bn: 'মহা মৃত্যুঞ্জয় জপ করুন, পরিবর্তন মেনে নিন, গুপ্তবিদ্যা বিবেচনার সাথে অধ্যযন করুন', kn: 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಜಪಿಸಿ, ಬದಲಾವಣೆಯನ್ನು ಸ್ವೀಕರಿಸಿ, ಗುಪ್ತವಿದ್ಯೆಯನ್ನು ವಿವೇಕದಿಂದ ಅಧ್ಯಯನ ಮಾಡಿ', gu: 'મહા મૃત્યુંજય જાપ કરો, પરિવર્તન સ્વીકારો, ગૂઢવિદ્યા વિવેકપૂર્વક અભ્યાસ કરો' },
              { en: 'Respect guru/father, visit temples, practice dharma', hi: 'गुरु/पिता का सम्मान, मन्दिर दर्शन, धर्म आचरण', sa: 'गुरु/पिता का सम्मान, मन्दिर दर्शन, धर्म आचरण', mai: 'गुरु/पिता का सम्मान, मन्दिर दर्शन, धर्म आचरण', mr: 'गुरु/पिता का सम्मान, मन्दिर दर्शन, धर्म आचरण', ta: 'குரு/தந்தையை மதியுங்கள், கோயில் செல்லுங்கள், தர்மம் பயிற்சி செய்யுங்கள்', te: 'గురువు/తండ్రిని గౌరవించండి, దేవాలయాలు సందర్శించండి, ధర్మం ఆచరించండి', bn: 'গুরু/পিতাকে সম্মান করুন, মন্দির দর্শন করুন, ধর্ম পালন করুন', kn: 'ಗುರು/ತಂದೆಯನ್ನು ಗೌರವಿಸಿ, ದೇವಸ್ಥಾನಗಳಿಗೆ ಭೇಟಿ ನೀಡಿ, ಧರ್ಮ ಆಚರಿಸಿ', gu: 'ગુરુ/પિતાનું સન્માન કરો, મંદિર દર્શન કરો, ધર્મ આચરો' },
              { en: 'Work diligently, respect authority, perform Surya Namaskar', hi: 'परिश्रम, अधिकार का सम्मान, सूर्य नमस्कार', sa: 'परिश्रम, अधिकार का सम्मान, सूर्य नमस्कार', mai: 'परिश्रम, अधिकार का सम्मान, सूर्य नमस्कार', mr: 'परिश्रम, अधिकार का सम्मान, सूर्य नमस्कार', ta: 'கடினமாக உழையுங்கள், அதிகாரத்தை மதியுங்கள், சூரிய நமஸ்காரம் செய்யுங்கள்', te: 'శ్రద్ధగా పనిచేయండి, అధికారాన్ని గౌరవించండి, సూర్య నమస్కారం చేయండి', bn: 'পরিশ্রমের সাথে কাজ করুন, কর্তৃত্ব সম্মান করুন, সূর্য নমস্কার করুন', kn: 'ಶ್ರದ್ಧೆಯಿಂದ ಕೆಲಸ ಮಾಡಿ, ಅಧಿಕಾರವನ್ನು ಗೌರವಿಸಿ, ಸೂರ್ಯ ನಮಸ್ಕಾರ ಮಾಡಿ', gu: 'ખંતથી કામ કરો, સત્તાનું સન્માન કરો, સૂર્ય નમસ્કાર કરો' },
              { en: 'Donate to charities, network wisely, support friends', hi: 'दान, बुद्धिमत्ता से सम्बन्ध, मित्रों का समर्थन', sa: 'दान, बुद्धिमत्ता से सम्बन्ध, मित्रों का समर्थन', mai: 'दान, बुद्धिमत्ता से सम्बन्ध, मित्रों का समर्थन', mr: 'दान, बुद्धिमत्ता से सम्बन्ध, मित्रों का समर्थन', ta: 'தர்ம நிறுவனங்களுக்கு தானம் செய்யுங்கள், புத்திசாலித்தனமாக நெட்வொர்க் செய்யுங்கள், நண்பர்களை ஆதரியுங்கள்', te: 'దాతృత్వ సంస్థలకు దానం చేయండి, తెలివిగా నెట్వర్క్ చేయండి, మిత్రులకు మద్దతు ఇవ్వండి', bn: 'দাতব্য সংস্থায় দান করুন, বিচক্ষণতার সাথে নেটওয়ার্ক করুন, বন্ধুদের সমর্থন করুন', kn: 'ದಾನ ಸಂಸ್ಥೆಗಳಿಗೆ ದಾನ ಮಾಡಿ, ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಸಂಪರ್ಕ ಬೆಳೆಸಿ, ಮಿತ್ರರನ್ನು ಬೆಂಬಲಿಸಿ', gu: 'દાન સંસ્થાઓને દાન કરો, સમજદારીથી નેટવર્ક કરો, મિત્રોને ટેકો આપો' },
              { en: 'Practice detachment, meditate, visit pilgrimages', hi: 'वैराग्य, ध्यान, तीर्थ यात्रा', sa: 'वैराग्य, ध्यान, तीर्थ यात्रा', mai: 'वैराग्य, ध्यान, तीर्थ यात्रा', mr: 'वैराग्य, ध्यान, तीर्थ यात्रा', ta: 'பற்றின்மை பயிற்சி செய்யுங்கள், தியானம் செய்யுங்கள், புனித யாத்திரை செல்லுங்கள்', te: 'వైరాగ్యం అభ్యసించండి, ధ్యానం చేయండి, తీర్థయాత్రలు చేయండి', bn: 'বৈরাগ্য অভ্যাস করুন, ধ্যান করুন, তীর্থযাত্রা করুন', kn: 'ವೈರಾಗ್ಯ ಅಭ್ಯಾಸ ಮಾಡಿ, ಧ್ಯಾನ ಮಾಡಿ, ತೀರ್ಥಯಾತ್ರೆ ಮಾಡಿ', gu: 'વૈરાગ્ય કેળવો, ધ્યાન કરો, તીર્થયાત્રા કરો' },
            ];
            const supported = kundali.argala.filter(a => a.netEffect === 'supported');
            const obstructed = kundali.argala.filter(a => a.netEffect === 'obstructed');

            return (
            <div className="space-y-6">
              <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                {locale === 'en' || isTamil ? 'Argala — Planetary Intervention' : 'अर्गला — ग्रह हस्तक्षेप'}
              </h3>

              <InfoBlock id="kundali-argala" title={locale === 'en' || isTamil ? 'What is Argala and how to read it?' : 'अर्गला क्या है और इसे कैसे पढ़ें?'}>
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p><strong>Argala</strong> (from Jaimini Sutras, BPHS Ch.31) reveals which planets actively <strong>push</strong> or <strong>block</strong> each area of your life. Unlike Bhavabala (which measures a house&apos;s built-in strength), Argala shows <strong>external forces</strong> acting on each house.</p>
                    <p><strong>How it works:</strong> Planets positioned in the 2nd, 4th, 5th, 8th, and 11th houses from any house create <strong>Argala</strong> (support). Planets in the 12th, 10th, 9th, 6th, and 3rd houses respectively create <strong>Virodha</strong> (counter). Not all interventions carry equal weight — <strong>only strong support and strong opposition</strong> determine the verdict. A house can have more total opponents than supporters yet still be &quot;Supported&quot; if the supporters are stronger (well-placed, benefic, or in key positions). The bar chart below each house shows this effective balance, not just raw planet counts.</p>
                    <p><strong>Why Bhavabala and Argala can differ:</strong> A house can be inherently strong (high Bhavabala) yet face external obstruction (Argala). For example, a strong 7th house with Argala obstruction means: your marriage capacity is excellent, but outside circumstances create friction. Conversely, a weak house with strong Argala support means: external help compensates for inherent weakness.</p>
                    <p><strong>How to use it:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">Supported houses</strong> — Life areas where planets actively help you. Lean into these — efforts here get cosmic tailwind.</li>
                      <li><strong className="text-red-400">Obstructed houses</strong> — Life areas facing planetary resistance. Not blocked permanently — the upayas (remedies) shown can reduce friction.</li>
                      <li><strong className="text-amber-400">Neutral houses</strong> — Balanced forces. Results depend more on your own effort than planetary push/pull.</li>
                    </ul>
                    <p className="text-gold-primary/50 text-xs">Special rules: 3+ malefics in the 3rd create unobstructable Argala. For Ketu&apos;s house, the argala directions are reversed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>अर्गला</strong> (जैमिनी सूत्र, BPHS अ.31) दर्शाती है कि कौन से ग्रह आपके जीवन के प्रत्येक क्षेत्र को सक्रिय रूप से <strong>बढ़ावा</strong> या <strong>अवरुद्ध</strong> करते हैं। भावबल (जो भाव की अन्तर्निहित शक्ति मापता है) से भिन्न, अर्गला <strong>बाह्य शक्तियों</strong> को दर्शाती है।</p>
                    <p><strong>कैसे काम करती है:</strong> किसी भाव से 2, 4, 5, 8, 11वें भाव के ग्रह <strong>अर्गला</strong> (समर्थन) बनाते हैं। 12, 10, 9, 6, 3वें भाव के ग्रह <strong>विरोध अर्गला</strong> बनाते हैं। सभी हस्तक्षेप समान नहीं — <strong>केवल बलवान समर्थन और बलवान विरोध</strong> निर्णय निर्धारित करते हैं। एक भाव में विरोधी अधिक हो सकते हैं फिर भी &quot;समर्थित&quot; हो यदि समर्थक अधिक बलवान हैं।</p>
                    <p><strong>भावबल और अर्गला में अन्तर क्यों:</strong> एक भाव अन्तर्निहित रूप से बलवान (उच्च भावबल) हो सकता है फिर भी बाह्य अवरोध (अर्गला) झेल सकता है। उदाहरण: बलवान 7वाँ भाव + अर्गला अवरोध = विवाह की क्षमता उत्कृष्ट, पर बाहरी परिस्थितियाँ बाधा डालती हैं।</p>
                    <p><strong>उपयोग:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">समर्थित भाव</strong> — जहाँ ग्रह सक्रिय रूप से सहायता करते हैं। इन क्षेत्रों में प्रयास करें।</li>
                      <li><strong className="text-red-400">अवरुद्ध भाव</strong> — ग्रह प्रतिरोध। स्थायी नहीं — उपायों से घर्षण कम होता है।</li>
                      <li><strong className="text-amber-400">तटस्थ भाव</strong> — सन्तुलित। परिणाम आपके प्रयास पर निर्भर।</li>
                    </ul>
                  </div>
                )}
              </InfoBlock>

              {/* ── Narrative Synthesis ── */}
              {(() => {
                const neutral = kundali.argala.filter(a => a.netEffect === 'neutral');
                const LIFE_AREAS: Record<number, LocaleText> = {
                  1: { en: 'health and personality', hi: 'स्वास्थ्य और व्यक्तित्व', sa: 'स्वास्थ्य और व्यक्तित्व', mai: 'स्वास्थ्य और व्यक्तित्व', mr: 'स्वास्थ्य और व्यक्तित्व', ta: 'ஆரோக்கியம் மற்றும் ஆளுமை', te: 'ఆరోగ్యం మరియు వ్యక్తిత్వం', bn: 'স্বাস্থ্য এবং ব্যক্তিত্ব', kn: 'ಆರೋಗ್ಯ ಮತ್ತು ವ್ಯಕ್ತಿತ್ವ', gu: 'આરોગ્ય અને વ્યક્તિત્વ' },
                  2: { en: 'wealth and family', hi: 'धन और परिवार', sa: 'धन और परिवार', mai: 'धन और परिवार', mr: 'धन और परिवार', ta: 'செல்வம் மற்றும் குடும்பம்', te: 'ధనం మరియు కుటుంబం', bn: 'ধন এবং পরিবার', kn: 'ಧನ ಮತ್ತು ಕುಟುಂಬ', gu: 'ધન અને કુટુંબ' },
                  3: { en: 'courage and communication', hi: 'साहस और संवाद', sa: 'शौर्यं च सम्भाषणम्', mai: 'साहस आ संवाद', mr: 'धाडस आणि संवाद', ta: 'தைரியம் மற்றும் தகவல்தொடர்பு', te: 'ధైర్యం మరియు సంభాషణ', bn: 'সাহস এবং যোগাযোগ', kn: 'ಧೈರ್ಯ ಮತ್ತು ಸಂವಹನ', gu: 'સાહસ અને સંવાદ' },
                  4: { en: 'home and emotional peace', hi: 'घर और मानसिक शान्ति', sa: 'गृहं च मानसशान्तिः', mai: 'घर आ मानसिक शान्ति', mr: 'घर आणि मानसिक शांती', ta: 'வீடு மற்றும் மன அமைதி', te: 'ఇల్లు మరియు మానసిక శాంతి', bn: 'গৃহ এবং মানসিক শান্তি', kn: 'ಮನೆ ಮತ್ತು ಮಾನಸಿಕ ಶಾಂತಿ', gu: 'ઘર અને માનસિક શાંતિ' },
                  5: { en: 'children and education', hi: 'सन्तान और शिक्षा', sa: 'सन्तानाः च शिक्षा', mai: 'सन्तान आ शिक्षा', mr: 'संतती आणि शिक्षण', ta: 'குழந்தைகள் மற்றும் கல்வி', te: 'సంతానం మరియు విద్య', bn: 'সন্তান এবং শিক্ষা', kn: 'ಮಕ್ಕಳು ಮತ್ತು ಶಿಕ್ಷಣ', gu: 'સંતાન અને શિક્ષણ' },
                  6: { en: 'health challenges and competition', hi: 'स्वास्थ्य चुनौतियाँ और प्रतिस्पर्धा', sa: 'स्वास्थ्य चुनौतियाँ और प्रतिस्पर्धा', mai: 'स्वास्थ्य चुनौतियाँ और प्रतिस्पर्धा', mr: 'स्वास्थ्य चुनौतियाँ और प्रतिस्पर्धा', ta: 'உடல்நலச் சவால்கள் மற்றும் போட்டி', te: 'ఆరోగ్య సవాళ్లు మరియు పోటీ', bn: 'স্বাস্থ্য চ্যালেঞ্জ এবং প্রতিযোগিতা', kn: 'ಆರೋಗ್ಯ ಸವಾಲು ಮತ್ತು ಸ್ಪರ್ಧೆ', gu: 'આરોગ્ય પડકાર અને સ્પર્ધા' },
                  7: { en: 'marriage and partnerships', hi: 'विवाह और साझेदारी', sa: 'विवाहः च साझेदारी', mai: 'विवाह आ साझेदारी', mr: 'विवाह आणि भागीदारी', ta: 'திருமணம் மற்றும் கூட்டு', te: 'వివాహం మరియు భాగస్వామ్యం', bn: 'বিবাহ এবং অংশীদারিত্ব', kn: 'ವಿವಾಹ ಮತ್ತು ಪಾಲುದಾರಿಕೆ', gu: 'લગ્ન અને ભાગીદારી' },
                  8: { en: 'longevity and transformation', hi: 'दीर्घायु और परिवर्तन', sa: 'दीर्घायुः च परिवर्तनम्', mai: 'दीर्घायु आ परिवर्तन', mr: 'दीर्घायुष्य आणि परिवर्तन', ta: 'நீண்ட ஆயுள் மற்றும் மாற்றம்', te: 'దీర్ఘాయువు మరియు పరివర్తన', bn: 'দীর্ঘায়ু এবং রূপান্তর', kn: 'ದೀರ್ಘಾಯುಷ್ಯ ಮತ್ತು ಪರಿವರ್ತನೆ', gu: 'દીર્ઘાયુ અને પરિવર્તન' },
                  9: { en: 'fortune and spiritual growth', hi: 'भाग्य और आध्यात्मिक विकास', sa: 'भाग्य और आध्यात्मिक विकास', mai: 'भाग्य और आध्यात्मिक विकास', mr: 'भाग्य और आध्यात्मिक विकास', ta: 'பாக்கியம் மற்றும் ஆன்மிக வளர்ச்சி', te: 'భాగ్యం మరియు ఆధ్యాత్మిక అభివృద్ధి', bn: 'ভাগ্য এবং আধ্যাত্মিক বিকাশ', kn: 'ಭಾಗ್ಯ ಮತ್ತು ಅಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ', gu: 'ભાગ્ય અને આધ્યાત્મિક વિકાસ' },
                  10: { en: 'career and public reputation', hi: 'कैरियर और सार्वजनिक प्रतिष्ठा', sa: 'कैरियर और सार्वजनिक प्रतिष्ठा', mai: 'कैरियर और सार्वजनिक प्रतिष्ठा', mr: 'कैरियर और सार्वजनिक प्रतिष्ठा', ta: 'தொழில் மற்றும் பொது புகழ்', te: 'వృత్తి మరియు బహిరంగ ప్రతిష్ఠ', bn: 'কর্মজীবন এবং জনসম্মান', kn: 'ವೃತ್ತಿ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಖ್ಯಾತಿ', gu: 'કારકિર્દી અને જાહેર પ્રતિષ્ઠા' },
                  11: { en: 'income and fulfillment of desires', hi: 'आय और इच्छापूर्ति', sa: 'आयः च इच्छापूर्तिः', mai: 'आय आ इच्छापूर्ति', mr: 'उत्पन्न आणि इच्छापूर्ती', ta: 'வருமானம் மற்றும் ஆசைகளின் நிறைவு', te: 'ఆదాయం మరియు కోరికల నెరవేర్పు', bn: 'আয় এবং ইচ্ছাপূরণ', kn: 'ಆದಾಯ ಮತ್ತು ಆಸೆಗಳ ಈಡೇರಿಕೆ', gu: 'આવક અને ઇચ્છાપૂર્તિ' },
                  12: { en: 'spiritual liberation and foreign connections', hi: 'मोक्ष और विदेश सम्बन्ध', sa: 'मोक्ष और विदेश सम्बन्ध', mai: 'मोक्ष और विदेश सम्बन्ध', mr: 'मोक्ष और विदेश सम्बन्ध', ta: 'ஆன்மிக முக்தி மற்றும் வெளிநாட்டு தொடர்புகள்', te: 'ఆధ్యాత్మిక మోక్షం మరియు విదేశీ సంబంధాలు', bn: 'আধ্যাত্মিক মোক্ষ এবং বিদেশ সংযোগ', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಮೋಕ್ಷ ಮತ್ತು ವಿದೇಶ ಸಂಪರ್ಕ', gu: 'આધ્યાત્મિક મોક્ષ અને વિદેશ સંપર્ક' },
                };
                const lk = locale === 'en' || isTamil ? 'en' : 'hi';
                const supportedAreas = supported.map(a => LIFE_AREAS[a.house][lk]).slice(0, 4);
                const obstructedAreas = obstructed.map(a => LIFE_AREAS[a.house][lk]).slice(0, 3);

                return (
                  <div className="rounded-xl border border-gold-primary/20 bg-gradient-to-br from-[#1a1040]/60 to-[#0a0e27] p-5 sm:p-6">
                    <h4 className="text-gold-light text-base font-bold mb-3" style={headingFont}>
                      {locale === 'en' || isTamil ? 'Your Argala Summary' : 'आपका अर्गला सारांश'}
                    </h4>

                    {/* Counts */}
                    <div className="flex justify-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-400">{supported.length}</div>
                        <div className="text-xs text-emerald-400/70">{locale === 'en' || isTamil ? 'Supported' : 'समर्थित'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">{neutral.length}</div>
                        <div className="text-xs text-amber-400/70">{locale === 'en' || isTamil ? 'Neutral' : 'तटस्थ'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-400">{obstructed.length}</div>
                        <div className="text-xs text-red-400/70">{locale === 'en' || isTamil ? 'Obstructed' : 'अवरुद्ध'}</div>
                      </div>
                    </div>

                    {/* Narrative */}
                    <div className="text-sm text-text-secondary leading-relaxed space-y-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {supported.length > 0 && (
                        <p>
                          {locale === 'en' || isTamil
                            ? <>Your chart shows <span className="text-emerald-400 font-semibold">strong planetary support</span> for {supportedAreas.join(', ')}. Planets positioned around these houses actively push energy toward them — efforts in these areas get natural cosmic momentum. These are your strengths; lean into them.</>
                            : <>आपकी कुण्डली में <span className="text-emerald-400 font-semibold">मजबूत ग्रह समर्थन</span> है — {supportedAreas.join(', ')} के लिए। इन भावों के आसपास स्थित ग्रह सक्रिय रूप से ऊर्जा देते हैं। ये आपकी शक्तियाँ हैं; इन पर ध्यान दें।</>
                          }
                        </p>
                      )}
                      {obstructed.length > 0 && (
                        <p>
                          {locale === 'en' || isTamil
                            ? <>However, <span className="text-red-400 font-semibold">{obstructedAreas.join(', ')}</span> face planetary resistance — counter-forces outweigh the support. This does not mean failure; it means these areas require <span className="text-gold-light">conscious effort, patience, and the specific remedies</span> listed below for each house.</>
                            : <>लेकिन <span className="text-red-400 font-semibold">{obstructedAreas.join(', ')}</span> को ग्रह प्रतिरोध का सामना है। इसका अर्थ विफलता नहीं; बल्कि इन क्षेत्रों में <span className="text-gold-light">सचेत प्रयास, धैर्य और नीचे दिए गए विशिष्ट उपायों</span> की आवश्यकता है।</>
                          }
                        </p>
                      )}
                      {obstructed.length === 0 && (
                        <p>
                          {locale === 'en' || isTamil
                            ? <><span className="text-emerald-400 font-semibold">No houses face net obstruction</span> — a rare and fortunate pattern. All life areas either receive active support or are neutrally balanced.</>
                            : <><span className="text-emerald-400 font-semibold">किसी भी भाव को शुद्ध अवरोध नहीं</span> — दुर्लभ और भाग्यशाली स्थिति। सभी जीवन क्षेत्र सक्रिय समर्थन या तटस्थता में हैं।</>
                          }
                        </p>
                      )}
                      <p className="text-text-tertiary text-xs">
                        {locale === 'en' || isTamil
                          ? 'Scroll down for house-by-house details with supporting/countering planets and specific remedies.'
                          : 'समर्थक/प्रतिकारक ग्रहों और विशिष्ट उपायों के साथ भाव-वार विवरण नीचे देखें।'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Visual house cards with force balance bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kundali.argala.map((ar) => {
                  const sig = HOUSE_SIGNIFICATIONS[ar.house - 1];
                  const remedy = OBSTRUCTION_REMEDIES[ar.house - 1];
                  const total = ar.argalas.length + ar.virodha.length;
                  const supportPct = total > 0 ? Math.round((ar.argalas.length / total) * 100) : 50;
                  const borderColor = ar.netEffect === 'supported' ? 'border-emerald-500/30' : ar.netEffect === 'obstructed' ? 'border-red-500/30' : 'border-gold-primary/15';
                  const glowColor = ar.netEffect === 'supported' ? 'shadow-emerald-500/5' : ar.netEffect === 'obstructed' ? 'shadow-red-500/5' : '';

                  return (
                  <motion.div key={ar.house}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ar.house * 0.04 }}
                    className={`rounded-xl border ${borderColor} ${glowColor} shadow-lg overflow-hidden bg-gradient-to-b from-[#1a1040]/60 to-[#0a0e27]`}
                  >
                    {/* House number + status badge */}
                    <div className="px-4 pt-4 pb-2 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${ar.netEffect === 'supported' ? 'text-emerald-400' : ar.netEffect === 'obstructed' ? 'text-red-400' : 'text-gold-light'}`}>
                            {ar.house}
                          </span>
                          <div>
                            <div className="text-gold-light text-sm font-semibold">{locale === 'en' || isTamil ? `House ${ar.house}` : `भाव ${ar.house}`}</div>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {(sig[locale === 'en' || isTamil ? 'en' : 'hi'] ?? '').split(',').map((item, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold-primary/8 text-text-secondary/70 border border-gold-primary/10" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                  {item.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${ar.netEffect === 'supported' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : ar.netEffect === 'obstructed' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                        {ar.netEffect === 'supported' ? '✓' : ar.netEffect === 'obstructed' ? '✗' : '='} {ar.netEffect === 'supported' ? (locale === 'en' || isTamil ? 'Supported' : 'समर्थित') : ar.netEffect === 'obstructed' ? (locale === 'en' || isTamil ? 'Blocked' : 'अवरुद्ध') : (locale === 'en' || isTamil ? 'Neutral' : 'तटस्थ')}
                      </span>
                    </div>

                    {/* Force balance bar — effective strength, not raw count */}
                    {total > 0 && (() => {
                      const effS = ar.argalas.filter(a => a.strength !== 'weak').length;
                      const effO = ar.virodha.filter(v => v.strength === 'strong').length;
                      const effT = effS + effO;
                      const effPct = effT > 0 ? Math.round((effS / effT) * 100) : 50;
                      return (
                      <div className="px-4 py-2">
                        <div className="flex items-center gap-2 text-[10px] text-text-secondary/50 mb-1">
                          <span className="text-emerald-400 font-semibold">{effS} {locale === 'en' || isTamil ? 'strong support' : 'बलवान समर्थन'}</span>
                          <span className="flex-1 text-center text-text-tertiary/40">{ar.argalas.length} vs {ar.virodha.length} {locale === 'en' || isTamil ? 'total' : 'कुल'}</span>
                          <span className="text-red-400 font-semibold">{effO} {locale === 'en' || isTamil ? 'strong oppose' : 'बलवान प्रतिकार'}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-red-500/20 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500/60 transition-all duration-700" style={{ width: `${effPct}%` }} />
                        </div>
                      </div>
                      );
                    })()}

                    {/* Planet icons — support vs opposition */}
                    <div className="px-4 py-2 space-y-1.5">
                      {ar.argalas.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-emerald-500/50 text-[10px]">▲</span>
                          {ar.argalas.map((a, idx) => (
                            <span key={idx} className="inline-flex items-center gap-0.5">
                              <GrahaIconById id={a.planetId} size={16} />
                              <span className="text-emerald-300 text-[10px] font-medium">{(a.planetName[locale as Locale] || a.planetName.en).slice(0, 3)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {ar.virodha.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-red-500/50 text-[10px]">▼</span>
                          {ar.virodha.map((v, idx) => (
                            <span key={idx} className="inline-flex items-center gap-0.5">
                              <GrahaIconById id={v.planetId} size={16} />
                              <span className="text-red-400/70 text-[10px] font-medium">{(v.planetName[locale as Locale] || v.planetName.en).slice(0, 3)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {total === 0 && (
                        <div className="text-text-tertiary text-xs py-1">{locale === 'en' || isTamil ? 'No intervention' : 'कोई हस्तक्षेप नहीं'}</div>
                      )}
                    </div>

                    {/* Remedy for obstructed */}
                    {ar.netEffect === 'obstructed' && (
                      <div className="px-4 pb-3 pt-1 border-t border-red-500/10">
                        <p className="text-amber-400/60 text-[10px] leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          <span className="font-bold">{locale === 'en' || isTamil ? 'Remedy: ' : 'उपाय: '}</span>{remedy[locale === 'en' || isTamil ? 'en' : 'hi']}
                        </p>
                      </div>
                    )}
                  </motion.div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* ===== SPHUTAS TAB ===== */}
          {activeTab === 'sphutas' && kundali.sphutas && (<a href={`/${locale}/learn/sphutas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Sphutas \u2192' : 'स्फुट के बारे में जानें \u2192'}</a>)}
          {activeTab === 'sphutas' && kundali.sphutas && (
            <SphutasTab kundali={kundali} locale={locale as Locale} isDevanagari={isDevanagari} headingFont={headingFont} sphuataTransitData={sphuataTransitData} />
          )}

          {/* ===== CHAT TAB ===== */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500/8 via-[#1a1040]/40 to-[#0a0e27] border border-cyan-500/15 p-4">
                <h3 className="text-cyan-300 text-sm font-bold mb-2" style={headingFont}>
                  {locale === 'en' || isTamil ? 'Ask the Rishi: AI Chart Consultation' : 'ऋषि से पूछें: AI कुण्डली परामर्श'}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {locale === 'en' || isTamil
                    ? 'Ask any question about YOUR chart — the AI reads your actual planetary positions, dashas, and yogas to give personalized answers. Try: "When is my best period for career growth?", "What does my Moon-Jupiter conjunction mean?", or "Is this year good for starting a business?"'
                    : 'अपनी कुण्डली के बारे में कोई भी प्रश्न पूछें — AI आपकी वास्तविक ग्रह स्थितियों, दशाओं और योगों को पढ़कर व्यक्तिगत उत्तर देता है। "कैरियर वृद्धि के लिए सर्वश्रेष्ठ अवधि कब है?", "मेरे चन्द्र-गुरु युति का क्या अर्थ है?" जैसे प्रश्न पूछें।'}
                </p>
              </div>
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <ChartChatTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
              </Suspense>
            </div>
          )}

          {/* ===== SADE SATI TAB ===== */}
          {activeTab === 'sadesati' && kundali.sadeSati && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/sade-sati`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Sade Sati \u2192' : 'साढ़े साती के बारे में जानें \u2192'}
              </a>
              <InfoBlock id="kundali-sadesati" title={locale === 'en' || isTamil ? 'What is Sade Sati and why 7.5 years?' : 'साढ़े साती क्या है और 7.5 वर्ष क्यों?'}>
                {locale === 'en' || isTamil ? (
                  <div className="space-y-2">
                    <p><strong>Sade Sati</strong> (&quot;seven and a half&quot;) is the ~7.5-year period when Saturn transits three consecutive signs around your Moon — the 12th (before), 1st (over), and 2nd (after) from your natal Moon sign. Saturn takes ~2.5 years per sign, totaling ~7.5 years.</p>
                    <p><strong>Why the Moon?</strong> Your Moon sign represents your mind and emotions. Saturn&apos;s transit over it pressures your emotional foundation — not as punishment, but as deep maturation.</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>Rising (12th)</strong> — Financial pressures, hidden anxieties, sleep issues</li>
                      <li><strong>Peak (over Moon)</strong> — Most intense: mental pressure, relationship tests, but deepest growth</li>
                      <li><strong>Setting (2nd)</strong> — Easing strain, family/speech matters, Saturn leaves wisdom behind</li>
                    </ul>
                    <p className="text-xs text-gold-primary/50">Not always negative — effects depend on Saturn&apos;s natal position, Moon&apos;s strength, and current dasha. Many achieve breakthroughs during Sade Sati. Occurs 2-3 times in a lifetime (~every 30 years).</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>साढ़े साती</strong> वह ~7.5 वर्ष की अवधि है जब शनि चन्द्र राशि के आसपास तीन राशियों से गुजरता है — 12वीं, 1ली और 2री। शनि ~2.5 वर्ष प्रति राशि लेता है।</p>
                    <p><strong>चन्द्रमा क्यों?</strong> चन्द्र राशि मन और भावनाओं का प्रतिनिधित्व करती है। शनि का गोचर भावनात्मक नींव पर दबाव डालता है — दण्ड नहीं, गहन परिपक्वता।</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>आरम्भ (12वाँ)</strong> — आर्थिक दबाव, छिपी चिन्ताएँ</li>
                      <li><strong>चरम (चन्द्र पर)</strong> — सबसे तीव्र: मानसिक दबाव, किन्तु सबसे गहन विकास</li>
                      <li><strong>अवसान (2रा)</strong> — दबाव कम, शनि ज्ञान छोड़कर जाता है</li>
                    </ul>
                    <p className="text-xs text-gold-primary/50">सदैव नकारात्मक नहीं — प्रभाव शनि की जन्म स्थिति और दशा पर निर्भर। जीवन में 2-3 बार आती है।</p>
                  </div>
                )}
              </InfoBlock>
              <SadeSatiTab sadeSati={kundali.sadeSati} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
            </div>
          )}

          {/* ===== JAIMINI TAB ===== */}
          {activeTab === 'jaimini' && kundali.jaimini && (<a href={`/${locale}/learn/jaimini`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Jaimini \u2192' : 'जैमिनी के बारे में जानें \u2192'}</a>)}
          {activeTab === 'jaimini' && kundali.jaimini && (
            <JaiminiTab kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
          )}

          {/* ===== LIFE TIMELINE TAB ===== */}
          {activeTab === 'timeline' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-[#1a1040]/50 to-[#0a0e27] border border-violet-500/20 p-5 sm:p-6">
                <h3 className="text-violet-300 text-lg font-bold mb-3" style={headingFont}>
                  {locale === 'en' || isTamil ? 'Your Life Timeline: The Map of Your Decades' : 'आपकी जीवन-रेखा: दशकों का मानचित्र'}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {locale === 'en' || isTamil
                    ? 'This timeline visualizes the Vimshottari Dasha — a 120-year planetary cycle that divides your life into chapters, each ruled by a different planet. Think of it as your life\'s screenplay: each planet brings its own themes, opportunities, and challenges when its period is active.'
                    : 'यह समय-रेखा विंशोत्तरी दशा का दृश्य है — एक 120 वर्ष का ग्रह-चक्र जो आपके जीवन को अध्यायों में बाँटता है, प्रत्येक एक भिन्न ग्रह द्वारा शासित। इसे अपने जीवन की पटकथा समझें।'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'How to Read It' : 'कैसे पढ़ें'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'The top band shows Maha Dasha (major periods of 6-20 years). The bottom band shows Antar Dasha (sub-periods within each major period). The gold "NOW" marker shows where you are today.' : 'ऊपरी पट्टी महादशा (6-20 वर्ष की प्रमुख अवधि) दिखाती है। निचली पट्टी अन्तर्दशा दिखाती है। सुनहरा "अभी" चिह्न आज की स्थिति दिखाता है।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'What Changes at Transitions' : 'संक्रमण पर क्या बदलता है'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'When a new Maha Dasha begins, the dominant themes of your life shift. Career focus may give way to spiritual seeking, or a period of struggle may resolve into abundance. The transition itself (Dasha Sandhi) can feel turbulent.' : 'जब नई महादशा आरम्भ होती है, जीवन के प्रमुख विषय बदलते हैं। कैरियर से आध्यात्मिक खोज, या संघर्ष से समृद्धि। संक्रमण (दशा सन्धि) अशान्त अनुभव हो सकता है।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Why This Matters for You' : 'आपके लिए क्यों महत्वपूर्ण'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Look at which planet rules your current period and which one is coming next. Your current planet shapes what\'s happening now. The next planet previews the upcoming chapter — you can prepare for it.' : 'देखें कि कौन-सा ग्रह आपकी वर्तमान अवधि पर शासन कर रहा है और अगला कौन-सा है। वर्तमान ग्रह अभी की घटनाओं को आकार देता है। अगला ग्रह आगामी अध्याय की झलक देता है।'}</p>
                  </div>
                </div>
              </div>
              <Suspense fallback={<div className="text-center py-8 text-text-secondary">Loading timeline...</div>}>
                <LifeTimeline kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/learn/dashas`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Deep Dive: Understanding Dashas →' : 'विस्तृत अध्ययन: दशा को समझें →'}
                </a>
              </div>
            </div>
          )}

          {/* ===== REMEDIES TAB ===== */}
          {activeTab === 'remedies' && kundali && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20 p-5 sm:p-6">
                <h3 className="text-emerald-300 text-lg font-bold mb-3" style={headingFont}>
                  {locale === 'en' || isTamil ? 'Personalized Remedies: Strengthening Your Chart' : 'व्यक्तिगत उपाय: अपनी कुण्डली को सशक्त बनाना'}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {locale === 'en' || isTamil
                    ? 'Vedic remedies work by strengthening weak planets or pacifying afflicted ones in your specific chart. They are NOT one-size-fits-all — the remedies below are generated from YOUR planetary positions, dignities, and afflictions. A planet that is debilitated or combust in your chart needs different treatment than one that is simply in an enemy sign.'
                    : 'वैदिक उपाय आपकी विशिष्ट कुण्डली में कमज़ोर ग्रहों को सशक्त करने या पीड़ित ग्रहों को शान्त करने का कार्य करते हैं। ये सबके लिए एक जैसे नहीं हैं — नीचे दिए गए उपाय आपकी ग्रह स्थितियों, बलाबल और पीड़ाओं से उत्पन्न हैं।'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Gemstones' : 'रत्न'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Worn on specific fingers on specific days, gemstones amplify a planet\'s energy. Only recommended for planets that are benefic lords in your chart — wearing a gemstone for a malefic lord can intensify problems.' : 'विशिष्ट उँगलियों पर विशिष्ट दिनों में पहने जाने वाले रत्न ग्रह की ऊर्जा को बढ़ाते हैं। केवल शुभ स्वामी ग्रहों के लिए — अशुभ स्वामी का रत्न समस्याएँ बढ़ा सकता है।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Mantras & Rituals' : 'मन्त्र और अनुष्ठान'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Planetary mantras and specific pujas pacify afflicted planets. These are especially effective during difficult dasha periods or when a planet is combust, debilitated, or in a planetary war in your chart.' : 'ग्रह मन्त्र और विशिष्ट पूजाएँ पीड़ित ग्रहों को शान्त करती हैं। कठिन दशा या जब ग्रह अस्त, नीच या ग्रह युद्ध में हो, तब ये विशेष प्रभावी हैं।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Lifestyle & Charity' : 'जीवनशैली और दान'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Fasting on specific weekdays, donating items associated with a planet, and behavioral adjustments. Often the most practical and immediately actionable remedies.' : 'विशिष्ट वारों पर उपवास, ग्रह से सम्बन्धित वस्तुओं का दान, और व्यवहारिक समायोजन। अक्सर सबसे व्यावहारिक और तुरन्त करने योग्य उपाय।'}</p>
                  </div>
                </div>
              </div>
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <RemediesTab kundali={kundali} locale={locale} />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/learn/remedies`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Deep Dive: Understanding Vedic Remedies →' : 'विस्तृत अध्ययन: वैदिक उपाय समझें →'}
                </a>
              </div>
            </div>
          )}

          {/* ===== SUDARSHANA TAB ===== */}
          {activeTab === 'sudarshana' && kundali && (
            <div className="space-y-5">
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <SudarshanaTab kundali={kundali} locale={locale} />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/learn/kundali`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Learn More: Chart Reading Techniques →' : 'और जानें: कुण्डली पठन तकनीक →'}
                </a>
              </div>
            </div>
          )}

          {activeTab === 'nadi' && kundali && (
            <div className="space-y-5">
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <NadiAmshaTab kundali={kundali} locale={locale} />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/learn/nadi-amsha`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Deep Dive: Nadi Amsha System →' : 'विस्तृत अध्ययन: नाडी अंश पद्धति →'}
                </a>
              </div>
            </div>
          )}

          {/* ===== BHAVA CHALIT TAB ===== */}
          {activeTab === 'bhavachalit' && kundali && (
            <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
              <BhavaChalitTab
                ascendant={kundali.ascendant.degree}
                planets={kundali.planets.map(p => ({ id: p.planet.id, longitude: p.longitude, name: p.planet.name }))}
                locale={locale}
              />
            </Suspense>
          )}

          {/* ===== AYANAMSHA TAB ===== */}
          {activeTab === 'ayanamsha' && kundali && (
            <div className="space-y-6">
              {/* Hero intro */}
              <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-[#1a1040]/50 to-[#0a0e27] border border-violet-500/20 p-5 sm:p-6">
                <h3 className="text-violet-300 text-lg sm:text-xl font-bold mb-3" style={headingFont}>
                  {locale === 'en' || isTamil ? 'Ayanamsha: The Hidden Variable in Your Chart' : 'अयनांश: आपकी कुण्डली का छिपा हुआ कारक'}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {locale === 'en' || isTamil
                    ? 'Ayanamsha is the angular difference between the tropical zodiac (used in Western astrology) and the sidereal zodiac (used in Vedic astrology). This single number — currently around 24° — determines where every planet falls in your chart. Different schools of Jyotish use slightly different ayanamsha values, and for planets near sign boundaries, this can mean entirely different sign placements.'
                    : 'अयनांश उष्णकटिबन्धीय राशिचक्र (पश्चिमी ज्योतिष) और निरायन राशिचक्र (वैदिक ज्योतिष) के बीच का कोणीय अन्तर है। यह एकल संख्या — वर्तमान में लगभग 24° — निर्धारित करती है कि आपकी कुण्डली में प्रत्येक ग्रह कहाँ स्थित होगा। ज्योतिष के विभिन्न सम्प्रदाय भिन्न-भिन्न अयनांश मानों का प्रयोग करते हैं।'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-3">
                    <div className="text-gold-light text-xs font-bold mb-1">Lahiri (Chitrapaksha)</div>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {locale === 'en' || isTamil
                        ? 'India\'s official standard, adopted by the Calendar Reform Committee in 1957. Anchored to the star Spica (Chitra) at exactly 0° Libra. Used by the vast majority of Indian astrologers.'
                        : 'भारत सरकार का आधिकारिक मानक, 1957 में कैलेंडर सुधार समिति द्वारा अपनाया गया। चित्रा तारे पर आधारित। अधिकांश भारतीय ज्योतिषी इसका प्रयोग करते हैं।'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-3">
                    <div className="text-gold-light text-xs font-bold mb-1">B.V. Raman</div>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {locale === 'en' || isTamil
                        ? 'Developed by the legendary astrologer B.V. Raman, based on his research into the Surya Siddhanta. Differs from Lahiri by about 1.5°. Particularly popular in South India and among Raman\'s followers worldwide.'
                        : 'प्रसिद्ध ज्योतिषी बी.वी. रमन द्वारा विकसित, सूर्य सिद्धान्त के अनुसन्धान पर आधारित। लाहिरी से लगभग 1.5° भिन्न। दक्षिण भारत में विशेष रूप से लोकप्रिय।'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-3">
                    <div className="text-gold-light text-xs font-bold mb-1">Krishnamurti (KP)</div>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {locale === 'en' || isTamil
                        ? 'Used in the Krishnamurti Paddhati (KP) system — a sub-divisional approach where nakshatra sub-lords matter more than signs. Very close to Lahiri (differs by ~6 arcminutes). Essential for KP practitioners.'
                        : 'कृष्णमूर्ति पद्धति (KP) में प्रयुक्त — एक उप-विभाजन दृष्टिकोण जहाँ नक्षत्र उप-स्वामी राशियों से अधिक महत्वपूर्ण हैं। लाहिरी से बहुत निकट (लगभग 6 आर्क-मिनट का अन्तर)।'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Practical "why it matters" callout */}
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-4 text-center">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {locale === 'en' || isTamil
                    ? 'For most people, all three systems agree on sign placements. When they don\'t (shown in amber below), your chart interpretation depends on which system your astrologer uses. Planets within 1-2\u00b0 of a sign boundary are the most affected.'
                    : 'अधिकांश लोगों के लिए, तीनों पद्धतियाँ राशि स्थानों पर सहमत होती हैं। जब वे नहीं होतीं (नीचे एम्बर में दिखाया गया), तो आपकी कुण्डली की व्याख्या इस बात पर निर्भर करती है कि आपके ज्योतिषी कौन-सी पद्धति का प्रयोग करते हैं।'}
                </p>
              </div>

              {/* The comparison table + commentary */}
              <AyanamshaComparison kundali={kundali} locale={locale} />

              {/* Learn more + cross-link to KP tab */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={`/${locale}/learn/ayanamsha`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/20 hover:border-violet-500/30 transition-colors">
                  {locale === 'en' || isTamil ? 'Deep Dive: Understanding Ayanamsha \u2192' : '\u0935\u093f\u0938\u094d\u0924\u0943\u0924 \u0905\u0927\u094d\u092f\u092f\u0928: \u0905\u092f\u0928\u093e\u0902\u0936 \u0915\u094b \u0938\u092e\u091d\u0947\u0902 \u2192'}
                </a>
                <button
                  onClick={() => { setActiveTab('kp'); trackTabViewed({ tab: 'kp' }); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
                >
                  {locale === 'en' || isTamil ? 'Full KP Analysis \u2192' : '\u092a\u0942\u0930\u094d\u0923 \u0915\u0947\u092a\u0940 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923 \u2192'}
                </button>
              </div>
            </div>
          )}

          {/* ===== KP SYSTEM TAB ===== */}
          {activeTab === 'kp' && kundali && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 via-[#1a1040]/50 to-[#0a0e27] border border-cyan-500/20 p-5 sm:p-6">
                <h3 className="text-cyan-300 text-lg font-bold mb-3" style={headingFont}>
                  {locale === 'en' || isTamil ? 'KP System: Sub-Lord Based Prediction' : 'केपी पद्धति: उप-स्वामी आधारित भविष्यवाणी'}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {locale === 'en' || isTamil
                    ? 'The Krishnamurti Paddhati (KP) system uses Placidus house cusps instead of whole-sign houses, and the sub-lord of each cusp determines whether that house\'s promise will manifest. Unlike Parashara where the sign lord matters most, in KP the sub-lord is the deciding factor — it acts as the final "gatekeeper" for every prediction.'
                    : 'कृष्णमूर्ति पद्धति (केपी) प्लासिडस भाव-शीर्ष का प्रयोग करती है, और प्रत्येक भाव-शीर्ष का उप-स्वामी निर्धारित करता है कि उस भाव का वादा पूरा होगा या नहीं। पराशर के विपरीत जहाँ राशि स्वामी सर्वाधिक महत्वपूर्ण है, केपी में उप-स्वामी निर्णायक कारक है।'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Sub-Lord Chain' : 'उप-स्वामी श्रृंखला'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Every degree has a Sign Lord → Star Lord → Sub Lord → Sub-Sub Lord. The Sub Lord is the key — it determines the final outcome for any house it controls.' : 'प्रत्येक अंश में राशि स्वामी → नक्षत्र स्वामी → उप स्वामी → उप-उप स्वामी। उप स्वामी कुंजी है — वह किसी भी भाव के अन्तिम परिणाम को निर्धारित करता है।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Significators' : 'कारकत्व'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Four levels (L1-L4) identify which planets can activate a house: star-lord of occupants, occupants, star-lord of owner, and the owner itself. The combined list gives the strongest significators.' : 'चार स्तर (L1-L4) पहचानते हैं कि कौन-से ग्रह किसी भाव को सक्रिय कर सकते हैं।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-gold-primary/10 p-3">
                    <div className="text-gold-light font-bold mb-1">{locale === 'en' || isTamil ? 'Ruling Planets' : 'शासक ग्रह'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Five ruling planets at the moment of analysis (Asc sign lord, Asc star lord, Moon sign lord, Moon star lord, weekday lord) confirm or deny predictions. Events happen when dasha lords match significators AND ruling planets.' : 'विश्लेषण के क्षण के पाँच शासक ग्रह भविष्यवाणियों की पुष्टि करते हैं। घटनाएँ तब होती हैं जब दशा स्वामी कारकत्व और शासक ग्रहों दोनों से मिलते हैं।'}</p>
                  </div>
                </div>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-primary border-t-transparent" /></div>}>
                <KPTab birthData={kundali.birthData} locale={locale} />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/kp-system`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Open Full KP Analysis Page →' : 'पूर्ण केपी विश्लेषण पृष्ठ खोलें →'}
                </a>
              </div>
            </div>
          )}

          {/* ===== PATRIKA TAB ===== */}
          {activeTab === 'patrika' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 p-5 sm:p-6">
                <h3 className="text-amber-300 text-lg font-bold mb-3" style={headingFont}>
                  {locale === 'en' || isTamil ? 'Patrika: Your Traditional Kundali Document' : 'पत्रिका: आपकी पारम्परिक कुण्डली दस्तावेज़'}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">
                  {locale === 'en' || isTamil
                    ? 'A Patrika is the traditional format of a Kundali — the document an astrologer would prepare by hand for a newborn. It contains the birth chart, Vimshottari Dasha periods, and dosha analysis (Mangal Dosha, Kaal Sarpa, Pitru Dosha). This is what families exchange during marriage discussions for Kundali matching. Below is your complete Patrika with dosha assessment and their significance for your life.'
                    : 'पत्रिका कुण्डली का पारम्परिक प्रारूप है — वह दस्तावेज़ जो ज्योतिषी नवजात के लिए हाथ से बनाते थे। इसमें जन्म कुण्डली, विंशोत्तरी दशा अवधि, और दोष विश्लेषण (मंगल दोष, काल सर्प, पितृ दोष) होता है। यही परिवार विवाह चर्चा में कुण्डली मिलान के लिए आदान-प्रदान करते हैं।'}
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-bg-secondary/40 border border-red-500/10 p-3">
                    <div className="text-red-300 font-bold mb-1">{locale === 'en' || isTamil ? 'Mangal Dosha' : 'मंगल दोष'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Mars in houses 1, 2, 4, 7, 8, or 12 from Lagna. Affects marriage compatibility and partner\'s wellbeing. Severity varies — some placements have classical cancellation rules.' : 'लग्न से 1, 2, 4, 7, 8 या 12वें भाव में मंगल। विवाह अनुकूलता और साथी के कल्याण को प्रभावित करता है।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-violet-500/10 p-3">
                    <div className="text-violet-300 font-bold mb-1">{locale === 'en' || isTamil ? 'Kaal Sarpa' : 'काल सर्प'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'All planets hemmed between Rahu and Ketu. Creates a karmic concentration — intense focus in one hemisphere of life, with the Rahu-Ketu axis defining your primary life theme.' : 'सभी ग्रह राहु-केतु के बीच। एक कर्मिक एकाग्रता — जीवन के एक गोलार्ध में तीव्र ध्यान।'}</p>
                  </div>
                  <div className="rounded-lg bg-bg-secondary/40 border border-amber-500/10 p-3">
                    <div className="text-amber-300 font-bold mb-1">{locale === 'en' || isTamil ? 'Pitru Dosha' : 'पितृ दोष'}</div>
                    <p className="text-text-secondary">{locale === 'en' || isTamil ? 'Sun conjunct/aspected by malefics, or 9th house affliction. Indicates karmic debts from paternal lineage — manifests as obstacles in father-related matters, authority, or government dealings.' : 'सूर्य पर पाप ग्रहों का प्रभाव या 9वें भाव की पीड़ा। पितृ वंश से कर्म ऋण — पिता, सत्ता या सरकारी मामलों में बाधा।'}</p>
                  </div>
                </div>
              </div>
              <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
                <PatrikaTab kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tip={tip} chartStyle={chartStyle} retrogradeIds={retrogradeIds} combustIds={combustIds} />
              </Suspense>
              <div className="text-center">
                <a href={`/${locale}/learn/patrika`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/20 transition-colors">
                  {locale === 'en' || isTamil ? 'Deep Dive: Understanding Your Patrika →' : 'विस्तृत अध्ययन: पत्रिका समझें →'}
                </a>
              </div>
            </div>
          )}

          </div>{/* end eli5Mode hide wrapper */}

          </>
          )}

        </motion.div>
      )}

      {/* SEO cross-links */}
      <RelatedLinks type="learn" links={getLearnLinksForTool('/kundali')} locale={locale} />
    </div>
  );
}


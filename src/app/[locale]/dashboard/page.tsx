'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Star, Moon, TrendingUp, AlertTriangle,
  ArrowRight, Loader2, Calendar, Settings, Eye, Compass, Globe, Shield, Clock, Flame,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { computeGochar } from '@/lib/personalization/gochar';
import { computeTransitAlerts } from '@/lib/personalization/transit-alerts';
import { scoreFestivalRelevance } from '@/lib/personalization/festival-relevance';
import type { GocharResult } from '@/lib/personalization/gochar';
import type { PersonalFestival } from '@/lib/personalization/festival-relevance';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import EclipseAlert from '@/components/dashboard/EclipseAlert';
import FestivalCountdown from '@/components/dashboard/FestivalCountdown';
import MorningBriefing from '@/components/dashboard/MorningBriefing';
import PushPermission from '@/components/notifications/PushPermission';
import PersonalizedHoroscope from '@/components/dashboard/PersonalizedHoroscope';
import DailyHoroscopeWidget from '@/components/dashboard/DailyHoroscopeWidget';
import WeekAhead from '@/components/dashboard/WeekAhead';
import DashaTransitionAlert from '@/components/dashboard/DashaTransitionAlert';
import EclipseWatchCard from '@/components/dashboard/EclipseWatchCard';
import RemedySpotlightCard from '@/components/dashboard/RemedySpotlightCard';
import CalendarSyncCard from '@/components/dashboard/CalendarSyncCard';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { checkBadges } from '@/lib/learn/badges';
import LevelBadge from '@/components/learn/LevelBadge';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import ChartNorth from '@/components/kundali/ChartNorth';
import type { Locale, PanchangData , LocaleText} from '@/types/panchang';
import type { PersonalizedDay, UserSnapshot, TransitAlert } from '@/lib/personalization/types';
import type { ChartData, DashaEntry } from '@/types/kundali';
import { computeKeyDates, type KeyDate } from '@/lib/kundali/domain-synthesis/key-dates';
import KeyDatesTimeline from '@/components/kundali/KeyDatesTimeline';
import { Trash2, Plus } from 'lucide-react';

interface SavedChart {
  id: string;
  label: string;
  birth_data: { name?: string; date: string; time: string; place: string; lat: number; lng: number };
  is_primary: boolean;
  created_at: string;
}
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'My Dashboard',
    subtitle: 'Your personalized Vedic astrology overview',
    loading: 'Loading your cosmic profile...',
    notSignedIn: 'Sign in to see your personalized dashboard',
    signIn: 'Sign In',
    noBirthData: 'Set up your birth details to unlock personalized insights',
    setupProfile: 'Set Up Profile',
    welcome: 'Welcome back',
    mahadasha: 'You are in',
    mahadashaOf: 'Mahadasha',
    todayQuality: "Today's Quality",
    taraBala: 'Tara Bala',
    chandraBala: 'Chandra Bala',
    tara: 'Tara',
    houseFromMoon: 'House from Moon',
    favorable: 'Favorable',
    unfavorable: 'Unfavorable',
    currentDasha: 'Current Dasha',
    mahadashaLabel: 'Mahadasha',
    antardashaLabel: 'Antardasha',
    progress: 'Progress',
    birthChart: 'Your Birth Chart (D1)',
    transitAlerts: 'Transit Alerts',
    noAlerts: 'No significant transit alerts at this time',
    quickLinks: 'Quick Links',
    fullChart: 'Full Birth Chart',
    sadeSati: 'Sade Sati Check',
    settings: 'Edit Profile',
    transitAnalysis: 'Transit Analysis',
    yourRemedies: 'Your Remedies',
    from: 'From',
    to: 'To',
    gocharTitle: 'Gochar (Planetary Transits)',
    gocharSubtitle: 'Current planetary positions relative to your birth chart',
    planet: 'Planet',
    transitSignCol: 'Transit Sign',
    yourHouse: 'Your House',
    effectCol: 'Effect',
    retrograde: 'R',
    enhancedAlerts: 'Transit Alerts',
    recommendedFestivals: 'Recommended Festivals',
    recommendedFestivalsSubtitle: 'Festivals most relevant to your chart',
    relevance: 'Relevance',
    positive: 'Positive',
    mixed: 'Mixed',
    streakTitle: 'Learning Streak',
    dayStreak: 'Day Streak',
    longestStreak: 'Longest',
    days: 'days',
    todayActive: 'Today: Active',
    todayVisitLearn: 'Visit Learn to keep your streak!',
    goToLearn: 'Go to Learn',
    startStreak: 'Start a learning streak today!',
  },
  hi: {
    title: 'मेरा डैशबोर्ड',
    subtitle: 'आपका व्यक्तिगत वैदिक ज्योतिष अवलोकन',
    loading: 'आपकी ब्रह्माण्डीय प्रोफ़ाइल लोड हो रही है...',
    notSignedIn: 'अपना व्यक्तिगत डैशबोर्ड देखने के लिए साइन इन करें',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगत अंतर्दृष्टि के लिए अपना जन्म विवरण सेट करें',
    setupProfile: 'प्रोफ़ाइल सेट करें',
    welcome: 'पुनः स्वागत है',
    mahadasha: 'आप',
    mahadashaOf: 'महादशा में हैं',
    todayQuality: 'आज की गुणवत्ता',
    taraBala: 'तारा बल',
    chandraBala: 'चन्द्र बल',
    tara: 'तारा',
    houseFromMoon: 'चन्द्र से भाव',
    favorable: 'शुभ',
    unfavorable: 'अशुभ',
    currentDasha: 'वर्तमान दशा',
    mahadashaLabel: 'महादशा',
    antardashaLabel: 'अन्तर्दशा',
    progress: 'प्रगति',
    birthChart: 'आपकी जन्म कुण्डली (D1)',
    transitAlerts: 'गोचर सूचनाएँ',
    noAlerts: 'इस समय कोई महत्वपूर्ण गोचर सूचना नहीं',
    quickLinks: 'त्वरित लिंक',
    fullChart: 'पूर्ण जन्म कुण्डली',
    sadeSati: 'साढ़े साती जाँच',
    settings: 'प्रोफ़ाइल संपादित करें',
    transitAnalysis: 'गोचर विश्लेषण',
    yourRemedies: 'आपके उपाय',
    from: 'से',
    to: 'तक',
    gocharTitle: 'गोचर (ग्रह गोचर)',
    gocharSubtitle: 'आपकी जन्म कुण्डली के सापेक्ष वर्तमान ग्रह स्थितियाँ',
    planet: 'ग्रह',
    transitSignCol: 'गोचर राशि',
    yourHouse: 'आपका भाव',
    effectCol: 'प्रभाव',
    retrograde: 'व',
    enhancedAlerts: 'गोचर सूचनाएँ',
    recommendedFestivals: 'अनुशंसित त्योहार',
    recommendedFestivalsSubtitle: 'आपकी कुण्डली के अनुसार सर्वाधिक प्रासंगिक त्योहार',
    relevance: 'प्रासंगिकता',
    positive: 'शुभ',
    mixed: 'मिश्र',
    streakTitle: 'शिक्षा लय',
    dayStreak: 'दिन की लय',
    longestStreak: 'सर्वोच्च',
    days: 'दिन',
    todayActive: 'आज: सक्रिय',
    todayVisitLearn: 'अपनी लय बनाए रखने के लिए शिक्षा पर जाएँ!',
    goToLearn: 'शिक्षा पर जाएँ',
    startStreak: 'आज शिक्षा लय शुरू करें!',
  },
  sa: {
    title: 'मम पटलम्',
    subtitle: 'भवतः व्यक्तिगतं वैदिकज्योतिषावलोकनम्',
    loading: 'भवतः ब्रह्माण्डीयं प्रोफ़ाइलं लोड् भवति...',
    notSignedIn: 'स्वव्यक्तिगतं पटलं द्रष्टुं साइन इन कुर्वन्तु',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगतान्तर्दृष्ट्यर्थं जन्मविवरणं स्थापयतु',
    setupProfile: 'प्रोफ़ाइलं स्थापयतु',
    welcome: 'पुनः स्वागतम्',
    mahadasha: 'भवान्',
    mahadashaOf: 'महादशायां वर्तते',
    todayQuality: 'अद्य गुणः',
    taraBala: 'तारा बलम्',
    chandraBala: 'चन्द्र बलम्',
    tara: 'तारा',
    houseFromMoon: 'चन्द्रात् भावः',
    favorable: 'शुभम्',
    unfavorable: 'अशुभम्',
    currentDasha: 'वर्तमानदशा',
    mahadashaLabel: 'महादशा',
    antardashaLabel: 'अन्तर्दशा',
    progress: 'प्रगतिः',
    birthChart: 'भवतः जन्मकुण्डली (D1)',
    transitAlerts: 'गोचरसूचनाः',
    noAlerts: 'अस्मिन् समये महत्त्वपूर्णा गोचरसूचना नास्ति',
    quickLinks: 'त्वरितसम्पर्काः',
    fullChart: 'पूर्णा जन्मकुण्डली',
    sadeSati: 'साढ़ेसाती परीक्षा',
    settings: 'प्रोफ़ाइलसम्पादनम्',
    transitAnalysis: 'गोचरविश्लेषणम्',
    yourRemedies: 'भवतः उपायाः',
    from: 'आरभ्य',
    to: 'पर्यन्तम्',
    gocharTitle: 'गोचरः (ग्रहगोचरः)',
    gocharSubtitle: 'भवतः जन्मकुण्डल्याः सापेक्षं वर्तमानग्रहस्थितयः',
    planet: 'ग्रहः',
    transitSignCol: 'गोचरराशिः',
    yourHouse: 'भवतः भावः',
    effectCol: 'प्रभावः',
    retrograde: 'व',
    enhancedAlerts: 'गोचरसूचनाः',
    recommendedFestivals: 'अनुशंसिताः उत्सवाः',
    recommendedFestivalsSubtitle: 'भवतः कुण्डल्यनुसारं सर्वाधिकप्रासंगिकाः उत्सवाः',
    relevance: 'प्रासंगिकता',
    positive: 'शुभम्',
    mixed: 'मिश्रम्',
    streakTitle: 'शिक्षालयः',
    dayStreak: 'दिनलयः',
    longestStreak: 'सर्वोच्चम्',
    days: 'दिनानि',
    todayActive: 'अद्य: सक्रियम्',
    todayVisitLearn: 'स्वलयं रक्षितुं शिक्षां गच्छतु!',
    goToLearn: 'शिक्षां गच्छतु',
    startStreak: 'अद्य शिक्षालयं आरभतु!',
  },
  ta: {
    title: 'எனது டாஷ்போர்டு',
    subtitle: 'உங்கள் தனிப்பயனாக்கப்பட்ட வேத ஜோதிட கண்ணோட்டம்',
    loading: 'உங்கள் அண்டவியல் சுயவிவரம் ஏற்றப்படுகிறது...',
    notSignedIn: 'உங்கள் தனிப்பயனாக்கப்பட்ட டாஷ்போர்டைக் காண உள்நுழையவும்',
    signIn: 'உள்நுழை',
    noBirthData: 'தனிப்பயனாக்கப்பட்ட நுண்ணறிவுகளுக்கு உங்கள் பிறப்பு விவரங்களை அமைக்கவும்',
    setupProfile: 'சுயவிவரத்தை அமை',
    welcome: 'மீண்டும் வரவேற்கிறோம்',
    mahadasha: 'நீங்கள்',
    mahadashaOf: 'மகா தசையில் உள்ளீர்கள்',
    todayQuality: 'இன்றைய தரம்',
    taraBala: 'தாரா பலம்',
    chandraBala: 'சந்திர பலம்',
    tara: 'தாரா',
    houseFromMoon: 'சந்திரனிலிருந்து பாவம்',
    favorable: 'சாதகமான',
    unfavorable: 'பாதகமான',
    currentDasha: 'தற்போதைய தசா',
    mahadashaLabel: 'மகா தசா',
    antardashaLabel: 'அந்தர் தசா',
    progress: 'முன்னேற்றம்',
    birthChart: 'உங்கள் ஜாதகம் (D1)',
    transitAlerts: 'பெயர்ச்சி எச்சரிக்கைகள்',
    noAlerts: 'இப்போது குறிப்பிடத்தக்க பெயர்ச்சி எச்சரிக்கைகள் இல்லை',
    quickLinks: 'விரைவு இணைப்புகள்',
    fullChart: 'முழு ஜாதகம்',
    sadeSati: 'சாடே சாதி சோதனை',
    settings: 'சுயவிவரத்தைத் திருத்து',
    transitAnalysis: 'பெயர்ச்சி பகுப்பாய்வு',
    yourRemedies: 'உங்கள் பரிகாரங்கள்',
    from: 'முதல்',
    to: 'வரை',
    gocharTitle: 'கோசாரம் (கிரக பெயர்ச்சிகள்)',
    gocharSubtitle: 'உங்கள் ஜாதகத்திற்கு சார்பான தற்போதைய கிரக நிலைகள்',
    planet: 'கிரகம்',
    transitSignCol: 'பெயர்ச்சி ராசி',
    yourHouse: 'உங்கள் பாவம்',
    effectCol: 'விளைவு',
    retrograde: 'வ',
    enhancedAlerts: 'பெயர்ச்சி எச்சரிக்கைகள்',
    recommendedFestivals: 'பரிந்துரைக்கப்பட்ட திருவிழாக்கள்',
    recommendedFestivalsSubtitle: 'உங்கள் ஜாதகத்திற்கு மிகவும் பொருத்தமான திருவிழாக்கள்',
    relevance: 'பொருத்தம்',
    positive: 'சாதகமான',
    mixed: 'கலப்பு',
    streakTitle: 'கற்றல் தொடர்',
    dayStreak: 'நாள் தொடர்',
    longestStreak: 'நீண்ட',
    days: 'நாட்கள்',
    todayActive: 'இன்று: செயலில்',
    todayVisitLearn: 'உங்கள் தொடரைத் தொடர கற்றலுக்குச் செல்லுங்கள்!',
    goToLearn: 'கற்றலுக்குச் செல்',
    startStreak: 'இன்று கற்றல் தொடரைத் தொடங்குங்கள்!',
  },
  te: {
    title: 'నా డాష్‌బోర్డ్',
    subtitle: 'మీ వ్యక్తిగత వేద జ్యోతిష అవలోకనం',
    loading: 'మీ విశ్వ ప్రొఫైల్ లోడ్ అవుతోంది...',
    notSignedIn: 'మీ వ్యక్తిగత డాష్‌బోర్డ్ చూడటానికి సైన్ ఇన్ చేయండి',
    signIn: 'సైన్ ఇన్',
    noBirthData: 'వ్యక్తిగత అంతర్దృష్టుల కోసం మీ జన్మ వివరాలను సెట్ చేయండి',
    setupProfile: 'ప్రొఫైల్ సెట్ చేయండి',
    welcome: 'తిరిగి స్వాగతం',
    mahadasha: 'మీరు',
    mahadashaOf: 'మహాదశలో ఉన్నారు',
    todayQuality: 'నేటి నాణ్యత',
    taraBala: 'తారా బలం',
    chandraBala: 'చంద్ర బలం',
    tara: 'తారా',
    houseFromMoon: 'చంద్రుని నుండి భావం',
    favorable: 'శుభం',
    unfavorable: 'అశుభం',
    currentDasha: 'ప్రస్తుత దశ',
    mahadashaLabel: 'మహాదశ',
    antardashaLabel: 'అంతర్దశ',
    progress: 'పురోగతి',
    birthChart: 'మీ జన్మ చార్ట్ (D1)',
    transitAlerts: 'గోచార హెచ్చరికలు',
    noAlerts: 'ప్రస్తుతం ముఖ్యమైన గోచార హెచ్చరికలు లేవు',
    quickLinks: 'త్వరిత లింక్‌లు',
    fullChart: 'పూర్తి జన్మ చార్ట్',
    sadeSati: 'సాడే సాతి తనిఖీ',
    settings: 'ప్రొఫైల్ సవరించండి',
    transitAnalysis: 'గోచార విశ్లేషణ',
    yourRemedies: 'మీ పరిహారాలు',
    from: 'నుండి',
    to: 'వరకు',
    gocharTitle: 'గోచారం (గ్రహ గోచారాలు)',
    gocharSubtitle: 'మీ జన్మ చార్ట్‌కు సంబంధించి ప్రస్తుత గ్రహ స్థానాలు',
    planet: 'గ్రహం',
    transitSignCol: 'గోచార రాశి',
    yourHouse: 'మీ భావం',
    effectCol: 'ప్రభావం',
    retrograde: 'వ',
    enhancedAlerts: 'గోచార హెచ్చరికలు',
    recommendedFestivals: 'సిఫార్సు చేసిన పండుగలు',
    recommendedFestivalsSubtitle: 'మీ చార్ట్‌కు అత్యంత సంబంధిత పండుగలు',
    relevance: 'ప్రాసంగికత',
    positive: 'శుభం',
    mixed: 'మిశ్రమం',
    streakTitle: 'అభ్యాస స్ట్రీక్',
    dayStreak: 'రోజు స్ట్రీక్',
    longestStreak: 'గరిష్టం',
    days: 'రోజులు',
    todayActive: 'ఈరోజు: యాక్టివ్',
    todayVisitLearn: 'మీ స్ట్రీక్ కొనసాగించడానికి Learn కి వెళ్ళండి!',
    goToLearn: 'Learn కి వెళ్ళు',
    startStreak: 'ఈరోజు అభ్యాస స్ట్రీక్ ప్రారంభించండి!',
  },
  bn: {
    title: 'আমার ড্যাশবোর্ড',
    subtitle: 'আপনার ব্যক্তিগত বৈদিক জ্যোতিষ সংক্ষিপ্ত বিবরণ',
    loading: 'আপনার মহাজাগতিক প্রোফাইল লোড হচ্ছে...',
    notSignedIn: 'আপনার ব্যক্তিগত ড্যাশবোর্ড দেখতে সাইন ইন করুন',
    signIn: 'সাইন ইন',
    noBirthData: 'ব্যক্তিগত অন্তর্দৃষ্টির জন্য আপনার জন্ম বিবরণ সেট করুন',
    setupProfile: 'প্রোফাইল সেট করুন',
    welcome: 'আবার স্বাগতম',
    mahadasha: 'আপনি',
    mahadashaOf: 'মহাদশায় আছেন',
    todayQuality: 'আজকের মান',
    taraBala: 'তারা বল',
    chandraBala: 'চন্দ্র বল',
    tara: 'তারা',
    houseFromMoon: 'চন্দ্র থেকে ভাব',
    favorable: 'শুভ',
    unfavorable: 'অশুভ',
    currentDasha: 'বর্তমান দশা',
    mahadashaLabel: 'মহাদশা',
    antardashaLabel: 'অন্তর্দশা',
    progress: 'অগ্রগতি',
    birthChart: 'আপনার জন্ম কুণ্ডলী (D1)',
    transitAlerts: 'গোচর সতর্কতা',
    noAlerts: 'এই মুহূর্তে কোনো উল্লেখযোগ্য গোচর সতর্কতা নেই',
    quickLinks: 'দ্রুত লিংক',
    fullChart: 'পূর্ণ জন্ম কুণ্ডলী',
    sadeSati: 'সাড়ে সাতি পরীক্ষা',
    settings: 'প্রোফাইল সম্পাদনা',
    transitAnalysis: 'গোচর বিশ্লেষণ',
    yourRemedies: 'আপনার প্রতিকার',
    from: 'থেকে',
    to: 'পর্যন্ত',
    gocharTitle: 'গোচর (গ্রহ গোচর)',
    gocharSubtitle: 'আপনার জন্ম কুণ্ডলীর সাপেক্ষে বর্তমান গ্রহ অবস্থান',
    planet: 'গ্রহ',
    transitSignCol: 'গোচর রাশি',
    yourHouse: 'আপনার ভাব',
    effectCol: 'প্রভাব',
    retrograde: 'ব',
    enhancedAlerts: 'গোচর সতর্কতা',
    recommendedFestivals: 'প্রস্তাবিত উৎসব',
    recommendedFestivalsSubtitle: 'আপনার কুণ্ডলীর সাথে সবচেয়ে প্রাসঙ্গিক উৎসব',
    relevance: 'প্রাসঙ্গিকতা',
    positive: 'শুভ',
    mixed: 'মিশ্র',
    streakTitle: 'শেখার ধারা',
    dayStreak: 'দিনের ধারা',
    longestStreak: 'সর্বোচ্চ',
    days: 'দিন',
    todayActive: 'আজ: সক্রিয়',
    todayVisitLearn: 'আপনার ধারা বজায় রাখতে শেখায় যান!',
    goToLearn: 'শেখায় যান',
    startStreak: 'আজ শেখার ধারা শুরু করুন!',
  },
  kn: {
    title: 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    subtitle: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ ಅವಲೋಕನ',
    loading: 'ನಿಮ್ಮ ವಿಶ್ವ ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    notSignedIn: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
    signIn: 'ಸೈನ್ ಇನ್',
    noBirthData: 'ವೈಯಕ್ತಿಕ ಒಳನೋಟಗಳಿಗಾಗಿ ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಹೊಂದಿಸಿ',
    setupProfile: 'ಪ್ರೊಫೈಲ್ ಹೊಂದಿಸಿ',
    welcome: 'ಮರಳಿ ಸ್ವಾಗತ',
    mahadasha: 'ನೀವು',
    mahadashaOf: 'ಮಹಾದಶೆಯಲ್ಲಿದ್ದೀರಿ',
    todayQuality: 'ಇಂದಿನ ಗುಣಮಟ್ಟ',
    taraBala: 'ತಾರಾ ಬಲ',
    chandraBala: 'ಚಂದ್ರ ಬಲ',
    tara: 'ತಾರಾ',
    houseFromMoon: 'ಚಂದ್ರನಿಂದ ಭಾವ',
    favorable: 'ಶುಭ',
    unfavorable: 'ಅಶುಭ',
    currentDasha: 'ಪ್ರಸ್ತುತ ದಶೆ',
    mahadashaLabel: 'ಮಹಾದಶಾ',
    antardashaLabel: 'ಅಂತರ್ದಶಾ',
    progress: 'ಪ್ರಗತಿ',
    birthChart: 'ನಿಮ್ಮ ಜನ್ಮ ಜಾತಕ (D1)',
    transitAlerts: 'ಗೋಚಾರ ಎಚ್ಚರಿಕೆಗಳು',
    noAlerts: 'ಪ್ರಸ್ತುತ ಮಹತ್ವದ ಗೋಚಾರ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ',
    quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
    fullChart: 'ಪೂರ್ಣ ಜನ್ಮ ಜಾತಕ',
    sadeSati: 'ಸಾಡೆ ಸಾತಿ ಪರಿಶೀಲನೆ',
    settings: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    transitAnalysis: 'ಗೋಚಾರ ವಿಶ್ಲೇಷಣೆ',
    yourRemedies: 'ನಿಮ್ಮ ಪರಿಹಾರಗಳು',
    from: 'ಇಂದ',
    to: 'ವರೆಗೆ',
    gocharTitle: 'ಗೋಚಾರ (ಗ್ರಹ ಗೋಚಾರಗಳು)',
    gocharSubtitle: 'ನಿಮ್ಮ ಜನ್ಮ ಜಾತಕಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಸ್ತುತ ಗ್ರಹ ಸ್ಥಾನಗಳು',
    planet: 'ಗ್ರಹ',
    transitSignCol: 'ಗೋಚಾರ ರಾಶಿ',
    yourHouse: 'ನಿಮ್ಮ ಭಾವ',
    effectCol: 'ಪ್ರಭಾವ',
    retrograde: 'ವ',
    enhancedAlerts: 'ಗೋಚಾರ ಎಚ್ಚರಿಕೆಗಳು',
    recommendedFestivals: 'ಶಿಫಾರಸು ಮಾಡಿದ ಹಬ್ಬಗಳು',
    recommendedFestivalsSubtitle: 'ನಿಮ್ಮ ಜಾತಕಕ್ಕೆ ಅತ್ಯಂತ ಸಂಬಂಧಿತ ಹಬ್ಬಗಳು',
    relevance: 'ಪ್ರಸ್ತುತತೆ',
    positive: 'ಶುಭ',
    mixed: 'ಮಿಶ್ರ',
    streakTitle: 'ಕಲಿಕೆ ಸ್ಟ್ರೀಕ್',
    dayStreak: 'ದಿನ ಸ್ಟ್ರೀಕ್',
    longestStreak: 'ಗರಿಷ್ಠ',
    days: 'ದಿನಗಳು',
    todayActive: 'ಇಂದು: ಸಕ್ರಿಯ',
    todayVisitLearn: 'ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಮುಂದುವರಿಸಲು Learn ಗೆ ಹೋಗಿ!',
    goToLearn: 'Learn ಗೆ ಹೋಗಿ',
    startStreak: 'ಇಂದು ಕಲಿಕೆ ಸ್ಟ್ರೀಕ್ ಪ್ರಾರಂಭಿಸಿ!',
  },
  mr: {
    title: 'माझे डॅशबोर्ड',
    subtitle: 'आपले वैयक्तिक वैदिक ज्योतिष अवलोकन',
    loading: 'आपली ब्रह्मांडीय प्रोफाइल लोड होत आहे...',
    notSignedIn: 'आपले वैयक्तिक डॅशबोर्ड पाहण्यासाठी साइन इन करा',
    signIn: 'साइन इन',
    noBirthData: 'वैयक्तिक अंतर्दृष्टीसाठी आपले जन्म तपशील सेट करा',
    setupProfile: 'प्रोफाइल सेट करा',
    welcome: 'पुन्हा स्वागत',
    mahadasha: 'आपण',
    mahadashaOf: 'महादशेत आहात',
    todayQuality: 'आजची गुणवत्ता',
    taraBala: 'तारा बल',
    chandraBala: 'चंद्र बल',
    tara: 'तारा',
    houseFromMoon: 'चंद्रापासून भाव',
    favorable: 'शुभ',
    unfavorable: 'अशुभ',
    currentDasha: 'सध्याची दशा',
    mahadashaLabel: 'महादशा',
    antardashaLabel: 'अंतर्दशा',
    progress: 'प्रगती',
    birthChart: 'आपली जन्म कुंडली (D1)',
    transitAlerts: 'गोचर सूचना',
    noAlerts: 'सध्या कोणत्याही महत्त्वपूर्ण गोचर सूचना नाहीत',
    quickLinks: 'द्रुत दुवे',
    fullChart: 'पूर्ण जन्म कुंडली',
    sadeSati: 'साडेसाती तपासणी',
    settings: 'प्रोफाइल संपादित करा',
    transitAnalysis: 'गोचर विश्लेषण',
    yourRemedies: 'आपले उपाय',
    from: 'पासून',
    to: 'पर्यंत',
    gocharTitle: 'गोचर (ग्रह गोचर)',
    gocharSubtitle: 'आपल्या जन्म कुंडलीच्या संदर्भात सध्याची ग्रह स्थिती',
    planet: 'ग्रह',
    transitSignCol: 'गोचर राशी',
    yourHouse: 'आपला भाव',
    effectCol: 'प्रभाव',
    retrograde: 'व',
    enhancedAlerts: 'गोचर सूचना',
    recommendedFestivals: 'शिफारस केलेले सण',
    recommendedFestivalsSubtitle: 'आपल्या कुंडलीशी सर्वाधिक संबंधित सण',
    relevance: 'प्रासंगिकता',
    positive: 'शुभ',
    mixed: 'मिश्र',
    streakTitle: 'शिक्षण लय',
    dayStreak: 'दिवस लय',
    longestStreak: 'सर्वोच्च',
    days: 'दिवस',
    todayActive: 'आज: सक्रिय',
    todayVisitLearn: 'आपली लय कायम ठेवण्यासाठी शिक्षणाला भेट द्या!',
    goToLearn: 'शिक्षणाला जा',
    startStreak: 'आज शिक्षण लय सुरू करा!',
  },
  gu: {
    title: 'મારું ડૅશબોર્ડ',
    subtitle: 'તમારું વ્યક્તિગત વૈદિક જ્યોતિષ અવલોકન',
    loading: 'તમારી બ્રહ્માંડીય પ્રોફાઇલ લોડ થઈ રહી છે...',
    notSignedIn: 'તમારું વ્યક્તિગત ડૅશબોર્ડ જોવા સાઇન ઇન કરો',
    signIn: 'સાઇન ઇન',
    noBirthData: 'વ્યક્તિગત આંતરદૃષ્ટિ માટે તમારી જન્મ વિગતો સેટ કરો',
    setupProfile: 'પ્રોફાઇલ સેટ કરો',
    welcome: 'ફરીથી સ્વાગત',
    mahadasha: 'તમે',
    mahadashaOf: 'મહાદશામાં છો',
    todayQuality: 'આજની ગુણવત્તા',
    taraBala: 'તારા બળ',
    chandraBala: 'ચંદ્ર બળ',
    tara: 'તારા',
    houseFromMoon: 'ચંદ્રથી ભાવ',
    favorable: 'શુભ',
    unfavorable: 'અશુભ',
    currentDasha: 'વર્તમાન દશા',
    mahadashaLabel: 'મહાદશા',
    antardashaLabel: 'અંતર્દશા',
    progress: 'પ્રગતિ',
    birthChart: 'તમારી જન્મ કુંડળી (D1)',
    transitAlerts: 'ગોચર સૂચનાઓ',
    noAlerts: 'હાલમાં કોઈ મહત્વપૂર્ણ ગોચર સૂચના નથી',
    quickLinks: 'ઝડપી લિંક્સ',
    fullChart: 'પૂર્ણ જન્મ કુંડળી',
    sadeSati: 'સાડાસાતી તપાસ',
    settings: 'પ્રોફાઇલ સંપાદિત કરો',
    transitAnalysis: 'ગોચર વિશ્લેષણ',
    yourRemedies: 'તમારા ઉપાયો',
    from: 'થી',
    to: 'સુધી',
    gocharTitle: 'ગોચર (ગ્રહ ગોચર)',
    gocharSubtitle: 'તમારી જન્મ કુંડળીના સંદર્ભમાં વર્તમાન ગ્રહ સ્થિતિ',
    planet: 'ગ્રહ',
    transitSignCol: 'ગોચર રાશિ',
    yourHouse: 'તમારો ભાવ',
    effectCol: 'પ્રભાવ',
    retrograde: 'વ',
    enhancedAlerts: 'ગોચર સૂચનાઓ',
    recommendedFestivals: 'ભલામણ કરેલા તહેવારો',
    recommendedFestivalsSubtitle: 'તમારી કુંડળી સાથે સૌથી વધુ સંબંધિત તહેવારો',
    relevance: 'પ્રાસંગિકતા',
    positive: 'શુભ',
    mixed: 'મિશ્ર',
    streakTitle: 'શીખવાની લય',
    dayStreak: 'દિવસ લય',
    longestStreak: 'સર્વોચ્ચ',
    days: 'દિવસ',
    todayActive: 'આજે: સક્રિય',
    todayVisitLearn: 'તમારી લય જાળવવા શીખો પર જાઓ!',
    goToLearn: 'શીખો પર જાઓ',
    startStreak: 'આજે શીખવાની લય શરૂ કરો!',
  },
  mai: {
    title: 'हमर डैशबोर्ड',
    subtitle: 'अहाँक व्यक्तिगत वैदिक ज्योतिष अवलोकन',
    loading: 'अहाँक ब्रह्मांडीय प्रोफाइल लोड भऽ रहल अछि...',
    notSignedIn: 'अपन व्यक्तिगत डैशबोर्ड देखबाक लेल साइन इन करू',
    signIn: 'साइन इन',
    noBirthData: 'व्यक्तिगत अंतर्दृष्टिक लेल अपन जन्म विवरण सेट करू',
    setupProfile: 'प्रोफाइल सेट करू',
    welcome: 'फेर स्वागत अछि',
    mahadasha: 'अहाँ',
    mahadashaOf: 'महादशामे छी',
    todayQuality: 'आइक गुणवत्ता',
    taraBala: 'तारा बल',
    chandraBala: 'चंद्र बल',
    tara: 'तारा',
    houseFromMoon: 'चंद्रसँ भाव',
    favorable: 'शुभ',
    unfavorable: 'अशुभ',
    currentDasha: 'वर्तमान दशा',
    mahadashaLabel: 'महादशा',
    antardashaLabel: 'अंतर्दशा',
    progress: 'प्रगति',
    birthChart: 'अहाँक जन्म कुंडली (D1)',
    transitAlerts: 'गोचर सूचना',
    noAlerts: 'एहि समय कोनो महत्वपूर्ण गोचर सूचना नहि अछि',
    quickLinks: 'त्वरित लिंक',
    fullChart: 'पूर्ण जन्म कुंडली',
    sadeSati: 'साढ़ेसाती जाँच',
    settings: 'प्रोफाइल संपादित करू',
    transitAnalysis: 'गोचर विश्लेषण',
    yourRemedies: 'अहाँक उपाय',
    from: 'सँ',
    to: 'तक',
    gocharTitle: 'गोचर (ग्रह गोचर)',
    gocharSubtitle: 'अहाँक जन्म कुंडलीक सापेक्ष वर्तमान ग्रह स्थिति',
    planet: 'ग्रह',
    transitSignCol: 'गोचर राशि',
    yourHouse: 'अहाँक भाव',
    effectCol: 'प्रभाव',
    retrograde: 'व',
    enhancedAlerts: 'गोचर सूचना',
    recommendedFestivals: 'अनुशंसित पर्व',
    recommendedFestivalsSubtitle: 'अहाँक कुंडलीक अनुसार सर्वाधिक प्रासंगिक पर्व',
    relevance: 'प्रासंगिकता',
    positive: 'शुभ',
    mixed: 'मिश्र',
    streakTitle: 'शिक्षा लय',
    dayStreak: 'दिन लय',
    longestStreak: 'सर्वोच्च',
    days: 'दिन',
    todayActive: 'आइ: सक्रिय',
    todayVisitLearn: 'अपन लय बनाए रखबाक लेल शिक्षा पर जाउ!',
    goToLearn: 'शिक्षा पर जाउ',
    startStreak: 'आइ शिक्षा लय शुरू करू!',
  },
};

// ---------------------------------------------------------------------------
// Quality color mapping
// ---------------------------------------------------------------------------
const QUALITY_COLORS: Record<PersonalizedDay['dayQuality'], { bg: string; border: string; text: string; glow: string }> = {
  excellent: { bg: 'from-emerald-500/20 to-emerald-700/10', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  good: { bg: 'from-gold-primary/20 to-gold-primary/10', border: 'border-gold-primary/40', text: 'text-gold-light', glow: 'shadow-gold-primary/20' },
  neutral: { bg: 'from-slate-400/15 to-slate-500/10', border: 'border-slate-400/30', text: 'text-text-secondary', glow: 'shadow-slate-400/10' },
  caution: { bg: 'from-amber-500/20 to-amber-700/10', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  challenging: { bg: 'from-red-500/20 to-red-700/10', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-red-500/20' },
};

const QUALITY_LABEL: Record<PersonalizedDay['dayQuality'], LocaleText> = {
  excellent: { en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्टम्' },
  good: { en: 'Good', hi: 'शुभ', sa: 'शुभम्' },
  neutral: { en: 'Neutral', hi: 'सामान्य', sa: 'सामान्यम्' },
  caution: { en: 'Caution', hi: 'सावधान', sa: 'सावधानम्' },
  challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'आह्वानपूर्णम्' },
};

// ---------------------------------------------------------------------------
// Daily Panchang Insight Card (lightweight — no PersonalReading needed)
// ---------------------------------------------------------------------------

/** Classify yoga quality from yoga number (1-27) */
function classifyYogaQuality(yogaNum: number): 'very_auspicious' | 'auspicious' | 'neutral' | 'inauspicious' {
  const veryAuspicious = [21, 25, 27]; // Siddhi, Shiva, Siddha
  const auspicious = [2, 3, 4, 7];     // Priti, Ayushman, Shobhana, Sukarma
  const inauspicious = [1, 6, 13, 15, 19]; // Vishkambha, Atiganda, Vyaghata, Vajra, Parigha
  if (veryAuspicious.includes(yogaNum)) return 'very_auspicious';
  if (auspicious.includes(yogaNum)) return 'auspicious';
  if (inauspicious.includes(yogaNum)) return 'inauspicious';
  return 'neutral';
}

/** Classify tithi quality */
function classifyTithiQuality(tithiNum: number, paksha: string): 'good' | 'neutral' | 'challenging' {
  // Rikta tithis (4, 9, 14) are generally challenging
  if ([4, 9, 14].includes(tithiNum)) return 'challenging';
  // Nanda (1,6,11), Bhadra (2,7,12), Jaya (3,8,13) in Shukla are good
  if (paksha === 'shukla' && [1, 2, 3, 6, 7, 8, 11, 12, 13].includes(tithiNum)) return 'good';
  // Purnima and auspicious tithis
  if (tithiNum === 15 && paksha === 'shukla') return 'good';
  return 'neutral';
}

/** Nakshatra quality label from id */
function getNakshatraQualityTip(nakshatraId: number, loc: string): string {
  // Swift nakshatras (1, 8, 13) — quick actions favored
  const swift = [1, 8, 13];
  // Fierce (2, 10, 11, 20, 25) — bold actions
  const fierce = [2, 10, 11, 20, 25];
  // Fixed (4, 12, 21, 26) — long-term plans
  const fixed = [4, 12, 21, 26];
  // Soft (5, 14, 17, 27) — relationships and creativity
  const soft = [5, 14, 17, 27];

  const isHi = loc === 'hi' || loc === 'sa' || loc === 'mr' || loc === 'mai';
  if (swift.includes(nakshatraId)) return isHi ? 'त्वरित कार्य और निर्णयों के लिए अनुकूल' : 'Favourable for quick actions and decisions';
  if (fierce.includes(nakshatraId)) return isHi ? 'साहसिक कार्यों और प्रतिस्पर्धा के लिए अनुकूल' : 'Favourable for bold actions and competition';
  if (fixed.includes(nakshatraId)) return isHi ? 'दीर्घकालिक योजनाओं और स्थिरता के लिए अनुकूल' : 'Favourable for long-term plans and stability';
  if (soft.includes(nakshatraId)) return isHi ? 'संबंधों और रचनात्मकता के लिए अनुकूल' : 'Favourable for relationships and creativity';
  return isHi ? 'संतुलित ऊर्जा — सामान्य गतिविधियों के लिए उपयुक्त' : 'Balanced energy — suitable for general activities';
}

function DailyPanchangInsightCard({ panchang, locale }: { panchang: PanchangData; locale: string }) {
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const yogaNum = panchang.yoga?.number ?? 14;
  const yogaQuality = classifyYogaQuality(yogaNum);

  const tithiNum = panchang.tithi?.number ?? 1;
  const tithiPaksha = panchang.tithi?.paksha ?? 'shukla';
  const tithiQuality = classifyTithiQuality(tithiNum, tithiPaksha);

  const nakshatraId = panchang.nakshatra?.id ?? 1;
  const nakshatraTip = getNakshatraQualityTip(nakshatraId, locale);

  // Overall day quality from yoga + tithi
  let overallDay: 'excellent' | 'good' | 'mixed' | 'challenging';
  if (yogaQuality === 'very_auspicious' && tithiQuality === 'good') overallDay = 'excellent';
  else if (yogaQuality === 'inauspicious' || tithiQuality === 'challenging') overallDay = 'challenging';
  else if (yogaQuality === 'auspicious' || tithiQuality === 'good') overallDay = 'good';
  else overallDay = 'mixed';

  const DAY_RATING_STYLES: Record<string, { bg: string; border: string; text: string; label: string; labelHi: string }> = {
    excellent:   { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', label: 'Excellent Day', labelHi: 'उत्तम दिन' },
    good:        { bg: 'bg-gold-primary/15', border: 'border-gold-primary/40', text: 'text-gold-light', label: 'Good Day', labelHi: 'शुभ दिन' },
    mixed:       { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-400', label: 'Mixed Day', labelHi: 'मिश्रित दिन' },
    challenging: { bg: 'bg-red-500/15', border: 'border-red-500/40', text: 'text-red-400', label: 'Challenging Day', labelHi: 'चुनौतीपूर्ण दिन' },
  };

  const dayStyle = DAY_RATING_STYLES[overallDay];

  // Rahu Kaal caution
  const rahuKaal = panchang.rahuKaal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="mb-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold-light text-sm font-bold uppercase tracking-widest">
          {isHi ? 'आज का मार्गदर्शन' : "Today's Guidance"}
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${dayStyle.bg} ${dayStyle.border} ${dayStyle.text}`}>
          {isHi ? dayStyle.labelHi : dayStyle.label}
        </span>
      </div>

      {/* Nakshatra quality tip */}
      <p className="text-text-primary text-sm leading-relaxed mb-3">{nakshatraTip}</p>

      {/* Rahu Kaal caution */}
      {rahuKaal && (
        <div className="flex items-center gap-2 text-xs text-red-400/80 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isHi ? 'राहु काल' : 'Rahu Kaal'}: {rahuKaal.start} &ndash; {rahuKaal.end}
            {' '}&mdash;{' '}
            {isHi ? 'नए कार्य शुरू करने से बचें' : 'Avoid starting new ventures'}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const L = LABELS[locale] || LABELS.en;
  const { user, initialized } = useAuthStore();

  // Learning streak & badges
  const { streak, isActiveToday, hydrateFromStorage: hydrateLearn, hydrated: learnHydrated, progress: learnProgress, getOverallProgress: getLearnOverall } = useLearningProgressStore();

  useEffect(() => { hydrateLearn(); }, [hydrateLearn]);

  const [loading, setLoading] = useState(true);
  const [personalizedDay, setPersonalizedDay] = useState<PersonalizedDay | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [keyDates, setKeyDates] = useState<KeyDate[]>([]);
  const [gocharResults, setGocharResults] = useState<GocharResult[]>([]);
  const [enhancedAlerts, setEnhancedAlerts] = useState<TransitAlert[]>([]);
  const [recommendedFestivals, setRecommendedFestivals] = useState<PersonalFestival[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [hasBirthData, setHasBirthData] = useState(false);
  const [ascendantSign, setAscendantSign] = useState<number>(0);
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [dashaTimeline, setDashaTimeline] = useState<DashaEntry[]>([]);
  const [birthLat, setBirthLat] = useState<number | null>(null);
  const [birthLng, setBirthLng] = useState<number | null>(null);
  const [userMoonSign, setUserMoonSign] = useState<number>(0);
  const [userMoonNakshatra, setUserMoonNakshatra] = useState<number>(0);
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [planetPositions, setPlanetPositions] = useState<unknown[]>([]);

  const loadDashboard = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch profile + snapshot
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;

      const { profile, snapshot } = await res.json();
      setDisplayName(profile?.display_name || user.user_metadata?.name || '');
      if (profile?.birth_lat != null) setBirthLat(profile.birth_lat);
      if (profile?.birth_lng != null) setBirthLng(profile.birth_lng);

      if (!snapshot || !snapshot.moon_sign) {
        setHasBirthData(false);
        setLoading(false);
        return;
      }
      setHasBirthData(true);
      setAscendantSign(snapshot.ascendant_sign || 0);
      setUserMoonSign(snapshot.moon_sign || 0);
      setUserMoonNakshatra(snapshot.moon_nakshatra || 0);

      // Fetch full snapshot (with JSONB fields) for dasha + chart
      const { data: fullSnap } = await supabase
        .from('kundali_snapshots')
        .select('planet_positions, dasha_timeline, sade_sati, chart_data')
        .eq('user_id', user.id)
        .single();

      // Fetch today's panchang
      const lat = profile?.birth_lat || 28.6139;
      const lng = profile?.birth_lng || 77.209;
      const panchangRes = await fetch(`/api/panchang?lat=${lat}&lng=${lng}`);
      const fetchedPanchang = panchangRes.ok ? await panchangRes.json() : null;
      if (fetchedPanchang) setPanchangData(fetchedPanchang as PanchangData);

      // Extract today's nakshatra and moon sign from panchang
      const todayNakshatra = fetchedPanchang?.nakshatra?.id || 1;
      const todayMoonSign = fetchedPanchang?.moonSign?.rashi || fetchedPanchang?.moonSign || 1;

      // Build UserSnapshot
      const userSnapshot: UserSnapshot = {
        moonSign: snapshot.moon_sign,
        moonNakshatra: snapshot.moon_nakshatra,
        moonNakshatraPada: snapshot.moon_nakshatra_pada,
        sunSign: snapshot.sun_sign,
        ascendantSign: snapshot.ascendant_sign,
        planetPositions: fullSnap?.planet_positions || [],
        dashaTimeline: fullSnap?.dasha_timeline || [],
        sadeSati: fullSnap?.sade_sati || {},
      };

      // Compute personalized day
      const result = computePersonalizedDay(userSnapshot, todayNakshatra, todayMoonSign);
      setPersonalizedDay(result);

      // Set planet positions for remedy spotlight
      if (fullSnap?.planet_positions) {
        setPlanetPositions(fullSnap.planet_positions as unknown[]);
      }

      // Set chart data + compute key dates
      if (fullSnap?.chart_data) {
        setChartData(fullSnap.chart_data as ChartData);
        // Build minimal KundaliData for key dates from snapshot
        try {
          const kd = computeKeyDates({
            kundali: {
              planets: fullSnap.planet_positions || [],
              dashas: fullSnap.dasha_timeline || [],
              ascendant: { sign: snapshot.ascendant_sign },
              houses: Array.from({ length: 12 }, (_, i) => ({
                house: i + 1,
                sign: ((snapshot.ascendant_sign - 1 + i) % 12) + 1,
              })),
            } as any,
          });
          setKeyDates(kd);
        } catch { /* key dates are non-critical */ }
      }

      // Set dasha timeline for transition alerts
      if (fullSnap?.dasha_timeline) {
        setDashaTimeline(fullSnap.dasha_timeline as DashaEntry[]);
      }

      // Compute Gochar (transit overlay)
      try {
        const gochar = computeGochar(userSnapshot.ascendantSign, userSnapshot.moonSign);
        setGocharResults(gochar);
      } catch { /* gochar computation is non-critical */ }

      // Compute enhanced transit alerts
      try {
        const alerts = computeTransitAlerts(userSnapshot);
        setEnhancedAlerts(alerts);
      } catch { /* transit alerts are non-critical */ }

      // Fetch saved charts — rendered inline below so the user doesn't have to
      // navigate to a separate page just to see their list.
      try {
        const { data: scData, error: scErr } = await supabase
          .from('saved_charts')
          .select('id, label, birth_data, is_primary, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (scErr) console.error('[dashboard] saved_charts load failed:', scErr);
        else if (scData) setSavedCharts(scData as SavedChart[]);
      } catch (e) { console.error('[dashboard] saved_charts threw:', e); }

      // Score festival relevance
      try {
        const festivalSlugs = [
          { slug: 'maha-shivaratri', category: 'shiva' },
          { slug: 'hanuman-jayanti', category: 'mars' },
          { slug: 'guru-purnima', category: 'jupiter' },
          { slug: 'vasant-panchami', category: 'venus' },
          { slug: 'makar-sankranti', category: 'sun' },
          { slug: 'karva-chauth', category: 'moon' },
          { slug: 'ganesh-chaturthi', category: 'ketu' },
          { slug: 'pradosham', category: 'shiva' },
          { slug: 'chhath-puja', category: 'sun' },
          { slug: 'nag-panchami', category: 'rahu' },
        ];
        const scored = festivalSlugs
          .map(f => scoreFestivalRelevance(f.slug, f.category, userSnapshot))
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 5);
        setRecommendedFestivals(scored);
      } catch { /* festival scoring is non-critical */ }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized && user) {
      loadDashboard();
    } else if (initialized && !user) {
      setLoading(false);
    }
  }, [initialized, user, loadDashboard]);

  // Delete a saved chart inline (used by the Saved Kundalis section).
  const handleDeleteSavedChart = async (id: string) => {
    if (!user) return;
    const confirmMsg = tl(
      { en: 'Delete this saved kundali?', hi: 'क्या यह कुण्डली हटाएं?', sa: 'इदं चक्रं विलोपयतु?', mr: 'ही पत्रिका हटवायची?', mai: 'इ कुण्डली हटाउ?', ta: 'இந்த ஜாதகத்தை நீக்கவா?', te: 'ఈ కుండలిని తొలగించాలా?', bn: 'এই কুণ্ডলী মুছবেন?', kn: 'ಈ ಕುಂಡಲಿ ಅಳಿಸಬೇಕೇ?', gu: 'આ કુંડળી કાઢી નાખવી?' },
      locale,
    );
    if (!confirm(confirmMsg)) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { error: delErr } = await supabase.from('saved_charts').delete().eq('id', id);
    if (delErr) {
      console.error('[dashboard] delete saved_chart failed:', delErr);
      alert(delErr.message);
      return;
    }
    setSavedCharts(prev => prev.filter(c => c.id !== id));
  };

  // Not signed in
  if (initialized && !user) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <LayoutDashboard className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.notSignedIn}
            </h1>
            <button
              onClick={() => router.push(`/${locale}/settings`)}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.signIn}
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gold-primary animate-spin mx-auto mb-3" />
          <p className="text-text-secondary">{L.loading}</p>
        </div>
      </main>
    );
  }

  // No birth data
  if (!hasBirthData) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <Calendar className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {L.noBirthData}
            </h1>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              {L.setupProfile}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const pd = personalizedDay;
  if (!pd) return null;

  const qc = QUALITY_COLORS[pd.dayQuality];
  const ql = QUALITY_LABEL[pd.dayQuality];
  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  // Compute dasha progress percentage
  let mahaProgress = 0;
  let antarProgress = 0;
  if (pd.currentDasha) {
    const now = Date.now();
    const mahaStart = new Date(pd.currentDasha.maha.startDate).getTime();
    const mahaEnd = new Date(pd.currentDasha.maha.endDate).getTime();
    mahaProgress = Math.min(100, Math.max(0, ((now - mahaStart) / (mahaEnd - mahaStart)) * 100));
    if (pd.currentDasha.antar) {
      const aStart = new Date(pd.currentDasha.antar.startDate).getTime();
      const aEnd = new Date(pd.currentDasha.antar.endDate).getTime();
      antarProgress = Math.min(100, Math.max(0, ((now - aStart) / (aEnd - aStart)) * 100));
    }
  }

  // Helper to find planet name by key
  const getPlanetName = (key: string) => {
    const g = GRAHAS.find((g) => g.name.en.toLowerCase() === key.toLowerCase());
    return g?.name?.[locale] || key;
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {L.title}
          </h1>
          <p className="text-text-secondary">{L.subtitle}</p>
        </motion.div>

        {/* Welcome Banner */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-6 px-6 py-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-r from-gold-primary/[0.04] via-transparent to-gold-primary/[0.04] backdrop-blur-sm"
        >
          <p className="text-xs uppercase tracking-widest text-text-secondary/70 mb-1">{L.welcome}</p>
          <h2 className="text-xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
            {displayName || user?.email?.split('@')[0] || ''}
          </h2>
          {pd.currentDasha && (
            <p className="text-text-secondary/70 text-sm mt-1">
              {L.mahadasha}{' '}
              <span className="text-gold-primary font-semibold">
                {pd.currentDasha.maha.planetName[locale] || pd.currentDasha.maha.planetName.en}
              </span>{' '}
              {L.mahadashaOf}
            </p>
          )}
        </motion.div>

        {/* Push Notification Permission */}
        <PushPermission locale={locale} />

        {/* Today's Guidance — lightweight panchang insight card */}
        {panchangData && <DailyPanchangInsightCard panchang={panchangData} locale={locale} />}

        {/* Morning Briefing — today's cosmic weather at a glance */}
        {panchangData && (
          <MorningBriefing
            panchangData={panchangData}
            personalizedDay={pd}
            locale={locale}
          />
        )}

        {/* Personalized Daily Horoscope */}
        <PersonalizedHoroscope
          locale={locale}
          lat={birthLat ?? undefined}
          lng={birthLng ?? undefined}
        />

        {/* Daily Horoscope Widget — transit-based, no LLM */}
        {userMoonSign > 0 && (
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mb-6">
            <DailyHoroscopeWidget
              moonSign={userMoonSign}
              nakshatra={userMoonNakshatra || undefined}
              locale={locale}
            />
          </motion.div>
        )}

        {/* Key Dates — upcoming significant astrological events */}
        {keyDates.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/10">
            <KeyDatesTimeline dates={keyDates} locale={locale} compact />
          </div>
        )}

        {/* Your Week Ahead — 7-day Moon transit forecast */}
        <WeekAhead
          ascendantSign={ascendantSign}
          locale={locale}
          hasBirthData={hasBirthData}
        />

        {/* Learning Streak Card */}
        {learnHydrated && (streak.streakDays > 0 || streak.longestStreak > 0) && (() => {
          const learnOverall = getLearnOverall();
          const { earned: earnedBadges } = checkBadges(learnProgress, streak);
          return (
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.12 }}
              className="mb-6 p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] via-transparent to-amber-500/[0.06] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.min(3, streak.streakDays >= 14 ? 3 : streak.streakDays >= 7 ? 2 : 1) }, (_, i) => (
                      <Flame key={i} className={`w-5 h-5 ${streak.streakDays > 0 ? 'text-amber-400 fill-amber-400/60' : 'text-text-secondary/30'}`} />
                    ))}
                  </div>
                  <div>
                    <span className="text-xl font-bold text-amber-400">
                      {streak.streakDays}
                    </span>
                    <span className="text-sm text-text-secondary ml-1.5">{L.dayStreak}</span>
                    {streak.longestStreak > streak.streakDays && (
                      <span className="text-xs text-text-secondary/60 ml-3">
                        {L.longestStreak}: {streak.longestStreak} {L.days}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isActiveToday() ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">
                      {L.todayActive}
                    </span>
                  ) : (
                    <Link
                      href="/learn"
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors"
                    >
                      {L.todayVisitLearn}
                    </Link>
                  )}
                </div>
              </div>

              {/* Level badge */}
              {learnOverall.mastered > 0 && (
                <div className="mt-4 pt-3 border-t border-amber-500/10">
                  <LevelBadge masteredCount={learnOverall.mastered} locale={locale} variant="full" />
                </div>
              )}

              {/* Recently earned badges */}
              {earnedBadges.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-500/10">
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-2">
                    {tl({ en: 'Badges Earned', hi: 'अर्जित बैज', sa: 'अर्जिताः चिह्नाः', ta: 'பெற்ற பதக்கங்கள்', te: 'సాధించిన బ్యాడ్జులు', bn: 'অর্জিত ব্যাজ', kn: 'ಗಳಿಸಿದ ಬ್ಯಾಡ್ಜ್‌ಗಳು', gu: 'મેળવેલ બેજ', mai: 'अर्जित बैज', mr: 'मिळवलेले बॅज' }, locale)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {earnedBadges.map(badge => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold-primary/8 border border-gold-primary/15"
                        title={tl(badge.description, locale)}
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-[11px] text-text-primary font-medium">
                          {tl(badge.label, locale)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/learn#badges"
                    className="inline-block mt-2 text-[11px] text-gold-primary hover:text-gold-light transition-colors font-medium"
                  >
                    {tl({ en: 'View All Badges \u2192', hi: 'सभी बैज देखें \u2192', sa: 'सर्वान् बैजान् पश्यतु \u2192', ta: 'அனைத்து பேட்ஜ்களையும் காண \u2192', te: 'అన్ని బ్యాడ్జ్‌లు చూడండి \u2192', bn: 'সব ব্যাজ দেখুন \u2192', kn: 'ಎಲ್ಲಾ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ನೋಡಿ \u2192', gu: 'બધા બેજ જુઓ \u2192', mai: 'सभी बैज देखू \u2192', mr: 'सर्व बॅज पहा \u2192' }, locale)}
                  </Link>
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Day Quality Card */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15 }}
          className={`mb-8 p-6 md:p-8 rounded-2xl border ${qc.border} bg-gradient-to-br ${qc.bg} backdrop-blur-sm shadow-lg ${qc.glow}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Star className={`w-6 h-6 ${qc.text}`} />
            <h3 className="text-lg font-semibold text-text-secondary">{L.todayQuality}</h3>
          </div>
          <p className={`text-3xl md:text-4xl font-bold ${qc.text} mb-2`} style={{ fontFamily: 'var(--font-heading)' }}>
            {ql[locale] || ql.en}
          </p>
          <p className="text-text-secondary text-sm md:text-base">
            {pd.dayQualityDescription[locale] || pd.dayQualityDescription.en}
          </p>
        </motion.div>

        {/* Tara Bala + Chandra Bala — side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tara Bala */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.taraBala}</h3>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary/60 border border-gold-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-gold-light">{pd.taraBala.taraNumber}</span>
              </div>
              <div>
                <p className="text-gold-light font-semibold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {pd.taraBala.taraName[locale] || pd.taraBala.taraName.en}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${pd.taraBala.isFavorable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {pd.taraBala.isFavorable ? L.favorable : L.unfavorable}
                </span>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {pd.taraBala.description[locale] || pd.taraBala.description.en}
            </p>
          </motion.div>

          {/* Chandra Bala */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.25 }}
            className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.chandraBala}</h3>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary/60 border border-gold-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-gold-light">{pd.chandraBala.houseFromMoon || '—'}</span>
              </div>
              <div>
                <p className="text-text-secondary/75 text-xs">{L.houseFromMoon}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${pd.chandraBala.isFavorable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {pd.chandraBala.isFavorable ? L.favorable : L.unfavorable}
                </span>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {pd.chandraBala.description[locale] || pd.chandraBala.description.en}
            </p>
          </motion.div>
        </div>

        {/* Current Dasha Card */}
        {pd.currentDasha && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.currentDasha}</h3>
            </div>

            {/* Mahadasha */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{L.mahadashaLabel}</span>
                  <span className="text-lg font-bold text-gold-light">
                    {getPlanetName(pd.currentDasha.maha.planet)}
                  </span>
                </div>
                <span className="text-xs text-text-secondary">
                  {new Date(pd.currentDasha.maha.startDate).toLocaleDateString()} - {new Date(pd.currentDasha.maha.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="w-full h-2 bg-bg-primary/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mahaProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' as const }}
                  className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">{L.progress}: {mahaProgress.toFixed(1)}%</p>
            </div>

            {/* Antardasha */}
            {pd.currentDasha.antar && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{L.antardashaLabel}</span>
                    <span className="text-lg font-bold text-gold-light">
                      {getPlanetName(pd.currentDasha.antar.planet)}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {new Date(pd.currentDasha.antar.startDate).toLocaleDateString()} - {new Date(pd.currentDasha.antar.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-bg-primary/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${antarProgress}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' as const }}
                    className="h-full bg-gradient-to-r from-gold-primary/70 to-gold-light/70 rounded-full"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">{L.progress}: {antarProgress.toFixed(1)}%</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Gochar (Transit Overlay) */}
        {gocharResults.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.33 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.gocharTitle}</h3>
            </div>
            <p className="text-text-secondary text-xs mb-4">{L.gocharSubtitle}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-primary/15">
                    <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 pr-3">{L.planet}</th>
                    <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2 pr-3">{L.transitSignCol}</th>
                    <th className="text-center text-gold-dark text-xs uppercase tracking-wider py-2 pr-3">{L.yourHouse}</th>
                    <th className="text-left text-gold-dark text-xs uppercase tracking-wider py-2">{L.effectCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {gocharResults.map((g) => (
                    <tr key={g.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                      <td className="py-2.5 pr-3">
                        <span className="text-text-primary font-medium">{g.planetName[locale] || g.planetName.en}</span>
                        {g.isRetrograde && <span className="ml-1 text-red-400 text-xs font-bold">({L.retrograde})</span>}
                      </td>
                      <td className="py-2.5 pr-3 text-gold-light">{g.transitSignName[locale] || g.transitSignName.en}</td>
                      <td className="py-2.5 pr-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${g.isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {g.natalHouse}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-secondary text-xs">{g.effect[locale] || g.effect.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Dasha Transition Alert — upcoming maha/antar dasha changes */}
        {dashaTimeline.length > 0 && (
          <DashaTransitionAlert
            dashaTimeline={dashaTimeline}
            locale={locale}
          />
        )}

        {/* Upcoming Eclipse Alert */}
        <EclipseAlert />

        {/* Upcoming Festival Countdown */}
        <FestivalCountdown />

        {/* Enhanced Transit Alerts */}
        {(enhancedAlerts.length > 0 || pd.transitAlerts.length > 0) && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.35 }}
            className="mb-8 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-text-primary">{L.enhancedAlerts}</h3>
            </div>
            <div className="space-y-3">
              {/* Show enhanced alerts first, then fall back to basic ones */}
              {(enhancedAlerts.length > 0 ? enhancedAlerts : pd.transitAlerts).map((alert, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border ${
                    alert.severity === 'significant' ? 'border-red-500/30 bg-red-500/10' :
                    alert.severity === 'notable' ? 'border-amber-500/30 bg-amber-500/10' :
                    'border-blue-500/20 bg-blue-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      alert.severity === 'significant' ? 'bg-red-400' :
                      alert.severity === 'notable' ? 'bg-amber-400' :
                      'bg-blue-400'
                    }`} />
                    <p className="text-sm text-text-primary">
                      {alert.description[locale] || alert.description.en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Festivals */}
        {recommendedFestivals.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.37 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.recommendedFestivals}</h3>
            </div>
            <p className="text-text-secondary text-xs mb-4">{L.recommendedFestivalsSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedFestivals.map((f) => (
                <div
                  key={f.festivalSlug}
                  className={`p-4 rounded-xl border ${f.isRecommended ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-gold-primary/10 bg-bg-primary/30'} transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-semibold text-sm capitalize">
                      {f.festivalSlug.replace(/-/g, ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      f.relevanceScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                      f.relevanceScore >= 50 ? 'bg-gold-primary/20 text-gold-light' :
                      'bg-slate-500/15 text-text-secondary'
                    }`}>
                      {f.relevanceScore}%
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {f.relevanceReason[locale] || f.relevanceReason.en}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Birth Chart */}
        {chartData && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.4 }}
            className="mb-8 p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">{L.birthChart}</h3>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ChartNorth data={chartData} title={L.birthChart} size={400} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Kundalis — inline list so users don't have to drill into a
             separate page to find their charts. Visible on every dashboard load. */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.42 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gold-primary" />
              <h3 className="text-lg font-semibold text-text-primary">
                {tl({ en: 'My Saved Kundalis', hi: 'मेरी सहेजी कुण्डलियाँ', sa: 'मम सञ्चितानि चक्राणि', mr: 'माझ्या जतन केलेल्या कुण्डल्या', mai: 'हमर सहेजल कुण्डली', ta: 'எனது சேமித்த ஜாதகங்கள்', te: 'నా సేవ్ చేసిన కుండలులు', bn: 'আমার সংরক্ষিত কুণ্ডলী', kn: 'ನನ್ನ ಉಳಿಸಿದ ಕುಂಡಲಿಗಳು', gu: 'મારી સાચવેલ કુંડળીઓ' }, locale)}
              </h3>
              {savedCharts.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary font-semibold">
                  {savedCharts.length}
                </span>
              )}
            </div>
            <Link
              href={'/kundali' as const}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-xs font-bold hover:bg-gold-primary/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {tl({ en: 'New', hi: 'नया', sa: 'नवीन', mr: 'नवीन', mai: 'नव', ta: 'புதியது', te: 'కొత్తది', bn: 'নতুন', kn: 'ಹೊಸದು', gu: 'નવું' }, locale)}
            </Link>
          </div>

          {savedCharts.length === 0 ? (
            <div className="rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-8 text-center">
              <Star className="w-10 h-10 text-gold-primary/30 mx-auto mb-3" />
              <p className="text-text-secondary text-sm mb-3">
                {tl({ en: 'No saved kundalis yet. Generate a kundali and press Save Chart to see it here.', hi: 'अभी तक कोई कुण्डली सहेजी नहीं है। कुण्डली बनाएँ और "Save Chart" दबाएँ।', sa: 'अद्य यावत् न किमपि चक्रं सञ्चितम्। चक्रं सृष्ट्वा "Save Chart" नोद्यताम्।', mr: 'अजून कोणतीही पत्रिका जतन केलेली नाही. पत्रिका बनवा आणि Save Chart दाबा.', mai: 'आबतक कोनो कुण्डली सहेजल नहि। कुण्डली बनाऊ आ Save Chart दबाऊ।', ta: 'இதுவரை எந்த ஜாதகமும் சேமிக்கப்படவில்லை. ஒரு ஜாதகத்தை உருவாக்கி Save Chart அழுத்தவும்.', te: 'ఇంకా ఏ కుండలి సేవ్ చేయలేదు. కుండలిని రూపొందించి Save Chart నొక్కండి.', bn: 'এখনো কোন কুণ্ডলী সংরক্ষণ করা হয়নি। একটি কুণ্ডলী তৈরি করে Save Chart চাপুন।', kn: 'ಇಲ್ಲಿಯವರೆಗೆ ಯಾವುದೇ ಕುಂಡಲಿ ಉಳಿಸಿಲ್ಲ. ಒಂದು ಕುಂಡಲಿ ರಚಿಸಿ Save Chart ಒತ್ತಿರಿ.', gu: 'હજુ સુધી કોઈ કુંડળી સાચવેલી નથી. કુંડળી બનાવો અને Save Chart દબાવો.' }, locale)}
              </p>
              <Link
                href={'/kundali' as const}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                {tl({ en: 'Create Kundali', hi: 'कुण्डली बनाएँ', sa: 'चक्रं सृजतु', mr: 'पत्रिका बनवा', mai: 'कुण्डली बनाऊ', ta: 'ஜாதகம் உருவாக்கு', te: 'కుండలి సృష్టించండి', bn: 'কুণ্ডলী তৈরি করুন', kn: 'ಕುಂಡಲಿ ರಚಿಸಿ', gu: 'કુંડળી બનાવો' }, locale)}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCharts.map((c) => {
                const name = c.birth_data.name || c.label;
                const viewHref = `/kundali?n=${encodeURIComponent(name)}&d=${c.birth_data.date}&t=${c.birth_data.time}&la=${c.birth_data.lat}&lo=${c.birth_data.lng}&p=${encodeURIComponent(c.birth_data.place)}`;
                return (
                  <div
                    key={c.id}
                    className="relative rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4 hover:border-gold-primary/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-gold-light font-bold text-sm truncate" style={isDevanagariLocale(locale) ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                          {name}
                        </h4>
                        {c.is_primary && (
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-primary font-bold uppercase tracking-wide">
                            {tl({ en: 'Primary', hi: 'मुख्य', sa: 'मुख्यम्', mr: 'मुख्य', mai: 'मुख्य', ta: 'முதன்மை', te: 'ప్రాథమిక', bn: 'প্রধান', kn: 'ಮುಖ್ಯ', gu: 'મુખ્ય' }, locale)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSavedChart(c.id)}
                        className="text-text-secondary/50 hover:text-red-400 transition-colors p-1 -mr-1 -mt-1"
                        aria-label="Delete"
                        title={tl({ en: 'Delete', hi: 'हटाएँ', sa: 'विलोपयतु', mr: 'हटवा', mai: 'हटाऊ', ta: 'நீக்கு', te: 'తొలగించు', bn: 'মুছুন', kn: 'ಅಳಿಸಿ', gu: 'કાઢી નાખો' }, locale)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-text-secondary text-xs font-mono mb-1">{c.birth_data.date} | {c.birth_data.time}</p>
                    <p className="text-text-secondary/70 text-xs mb-3 truncate">{c.birth_data.place}</p>
                    <Link
                      href={viewHref as '/kundali'}
                      className="inline-flex items-center gap-1.5 text-gold-primary text-xs font-bold hover:text-gold-light transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {tl({ en: 'Open Kundali', hi: 'कुण्डली खोलें', sa: 'चक्रं उद्घाटयतु', mr: 'पत्रिका उघडा', mai: 'कुण्डली खोलू', ta: 'ஜாதகத்தை திற', te: 'కుండలి తెరవండి', bn: 'কুণ্ডলী খুলুন', kn: 'ಕುಂಡಲಿ ತೆರೆಯಿರಿ', gu: 'કુંડળી ખોલો' }, locale)}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Eclipse Watch — next eclipse + house impact */}
        {hasBirthData && ascendantSign > 0 && (
          <div className="mb-8">
            <EclipseWatchCard ascendantSign={ascendantSign} locale={locale} />
          </div>
        )}

        {/* Remedy Spotlight — weakest planet + gemstone */}
        {hasBirthData && planetPositions.length > 0 && (
          <div className="mb-8">
            <RemedySpotlightCard planetPositions={planetPositions} locale={locale} />
          </div>
        )}

        {/* Calendar Sync — download .ics */}
        <div className="mb-8">
          <CalendarSyncCard locale={locale} />
        </div>

        {/* Quick Links */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">{L.quickLinks}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/dashboard/chart' as const, label: tl({ en: 'Birth Chart', hi: 'जन्म कुण्डली', sa: 'जन्म-कुण्डली', ta: 'ஜன்ம ஜாதகம்', te: 'జన్మ కుండలి', bn: 'জন্ম কুণ্ডলী', kn: 'ಜನ್ಮ ಕುಂಡಲಿ', gu: 'જન્મ કુંડળી', mai: 'जन्म-कुण्डली', mr: 'जन्मकुंडली' }, locale), icon: Eye },
              { href: '/dashboard/dashas' as const, label: tl({ en: 'Dasha Timeline', hi: 'दशा समयरेखा', sa: 'दशा-कालरेखा', ta: 'தசா காலவரிசை', te: 'దశా కాలరేఖ', bn: 'দশা সময়রেখা', kn: 'ದಶಾ ಕಾಲಮಾಲೆ', gu: 'દશા સમયરેખા', mai: 'दशा समयरेखा', mr: 'दशा कालरेखा' }, locale), icon: TrendingUp },
              { href: '/dashboard/muhurta' as const, label: tl({ en: 'Personal Muhurta', hi: 'व्यक्तिगत मुहूर्त', sa: 'व्यक्तिगतः मुहूर्तः', ta: 'தனிப்பட்ட முஹூர்த்தம்', te: 'వ్యక్తిగత ముహూర్తం', bn: 'ব্যক্তিগত মুহূর্ত', kn: 'ವ್ಯಕ್ತಿಗತ ಮುಹೂರ್ತ', gu: 'વ્યક્તિગત મુહૂર્ત', mai: 'व्यक्तिगत मुहूर्त', mr: 'वैयक्तिक मुहूर्त' }, locale), icon: Clock },
              { href: '/dashboard/transits' as const, label: L.transitAnalysis, icon: Globe },
              { href: '/dashboard/remedies' as const, label: L.yourRemedies, icon: Shield },
              { href: '/dashboard/saved-charts' as const, label: tl({ en: 'Saved Charts', hi: 'सहेजे गए चार्ट', sa: 'सञ्चितानि चक्राणि', ta: 'சேமித்த விளக்கப்படங்கள்', te: 'సేవ్ చేసిన చార్ట్‌లు', bn: 'সংরক্ষিত চার্ট', kn: 'ಉಳಿಸಿದ ಚಾರ್ಟ್‌ಗಳು', gu: 'સાચવેલ ચાર્ટ', mai: 'सहेजल चार्ट', mr: 'जतन केलेले चार्ट' }, locale), icon: Star },
              { href: '/sade-sati' as const, label: L.sadeSati, icon: TrendingUp },
              { href: '/settings' as const, label: L.settings, icon: Settings },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
              >
                <link.icon className="w-5 h-5 text-gold-primary" />
                <span className="text-text-secondary group-hover:text-gold-light transition-colors text-sm font-medium">
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-text-secondary/65 group-hover:text-gold-light ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

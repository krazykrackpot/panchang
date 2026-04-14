'use client';

import { tl } from '@/lib/utils/trilingual';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Star, Moon, Sun, Sparkles, Shield, Settings, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import type { Locale , LocaleText} from '@/types/panchang';
import type { ChartData } from '@/types/kundali';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

type Trilingual = LocaleText;

interface SnapshotData {
  ascendant_sign: number;
  moon_sign: number;
  moon_nakshatra: number;
  moon_nakshatra_pada: number;
  sun_sign: number;
  chart_data: ChartData | null;
  sade_sati: {
    isActive: boolean;
    currentPhase: 'rising' | 'peak' | 'setting' | null;
    overallIntensity: number;
    cycleStart: string;
    cycleEnd: string;
    interpretation?: { summary?: LocaleText };
  } | null;
  moonRashiName: LocaleText | null;
  sunRashiName: LocaleText | null;
  lagnaRashiName: LocaleText | null;
  moonNakshatraName: LocaleText | null;
  moonNakshatraRuler: LocaleText | null;
  currentDasha: {
    maha: { planet: string; planetName: LocaleText; startDate: string; endDate: string };
    antar: { planet: string; planetName: LocaleText; startDate: string; endDate: string } | null;
  } | null;
  computed_at: string;
}

interface BirthPanchang {
  tithi: { number: number; name: LocaleText; paksha: string };
  yoga: { number: number; name: LocaleText; meaning: LocaleText };
  masa: { index: number; name: LocaleText };
}

interface ProfileInfo {
  display_name: string;
  date_of_birth: string;
  time_of_birth: string;
  birth_time_known: boolean;
  birth_place: string;
  chart_style: string;
}

const L = {
  en: {
    title: 'My Vedic Profile',
    backHome: 'Back to Home',
    lagna: 'Lagna (Ascendant)',
    chandraRashi: 'Chandra Rashi',
    suryaRashi: 'Surya Rashi',
    nakshatra: 'Birth Nakshatra',
    pada: 'Pada',
    tithi: 'Birth Tithi',
    paksha: 'Paksha',
    shukla: 'Shukla Paksha',
    krishna: 'Krishna Paksha',
    yoga: 'Birth Yoga',
    masa: 'Birth Masa (Hindu Month)',
    birthChart: 'Birth Chart (Rashi Kundali)',
    currentDasha: 'Current Dasha Period',
    mahaDasha: 'Maha Dasha',
    antarDasha: 'Antar Dasha',
    sadeSati: 'Sade Sati',
    sadeSatiActive: 'Currently Active',
    sadeSatiInactive: 'Not active currently',
    phase: 'Phase',
    rising: 'Rising (12th from Moon)',
    peak: 'Peak (Over Moon)',
    setting: 'Setting (2nd from Moon)',
    intensity: 'Intensity',
    dashaEnds: 'ends',
    birthDetails: 'Birth Details',
    born: 'Born',
    at: 'at',
    in: 'in',
    editProfile: 'Edit Profile & Settings',
    noBirthData: 'Your Vedic birth profile will appear here once you add your birth details.',
    addBirthData: 'பிறப்பு விவரங்கள் சேர்க்கவும்',
    notSignedIn: 'Sign in to view your Vedic profile.',
    signIn: 'Sign In',
  },
  hi: {
    title: 'मेरी वैदिक कुंडली',
    backHome: 'मुख्य पृष्ठ',
    lagna: 'लग्न',
    chandraRashi: 'चन्द्र राशि',
    suryaRashi: 'सूर्य राशि',
    nakshatra: 'जन्म नक्षत्र',
    pada: 'पाद',
    tithi: 'जन्म तिथि',
    paksha: 'पक्ष',
    shukla: 'शुक्ल पक्ष',
    krishna: 'कृष्ण पक्ष',
    yoga: 'जन्म योग',
    masa: 'जन्म मास (हिन्दू मास)',
    birthChart: 'जन्म कुंडली (राशि कुंडली)',
    currentDasha: 'वर्तमान दशा काल',
    mahaDasha: 'महा दशा',
    antarDasha: 'अन्तर दशा',
    sadeSati: 'साढ़े साती',
    sadeSatiActive: 'वर्तमान में सक्रिय',
    sadeSatiInactive: 'वर्तमान में सक्रिय नहीं',
    phase: 'चरण',
    rising: 'उदय (चन्द्र से 12वाँ)',
    peak: 'शिखर (चन्द्र पर)',
    setting: 'अस्त (चन्द्र से 2रा)',
    intensity: 'तीव्रता',
    dashaEnds: 'समाप्ति',
    birthDetails: 'जन्म विवरण',
    born: 'जन्म',
    at: 'समय',
    in: 'स्थान',
    editProfile: 'प्रोफ़ाइल और सेटिंग्स',
    noBirthData: 'जन्म विवरण जोड़ने पर आपकी वैदिक कुंडली यहाँ दिखेगी।',
    addBirthData: 'जन्म विवरण जोड़ें',
    notSignedIn: 'वैदिक प्रोफ़ाइल देखने के लिए साइन इन करें।',
    signIn: 'साइन इन',
  },
  sa: {
    title: 'मम वैदिककुण्डली',
    backHome: 'मुख्यपृष्ठम्',
    lagna: 'लग्नम्',
    chandraRashi: 'चन्द्रराशिः',
    suryaRashi: 'सूर्यराशिः',
    nakshatra: 'जन्मनक्षत्रम्',
    pada: 'पादः',
    tithi: 'जन्मतिथिः',
    paksha: 'पक्षः',
    shukla: 'शुक्लपक्षः',
    krishna: 'कृष्णपक्षः',
    yoga: 'जन्मयोगः',
    masa: 'जन्ममासः (हिन्दुमासः)',
    birthChart: 'जन्मकुण्डली (राशिकुण्डली)',
    currentDasha: 'वर्तमानदशाकालः',
    mahaDasha: 'महादशा',
    antarDasha: 'अन्तर्दशा',
    sadeSati: 'साढ़ेसाती',
    sadeSatiActive: 'सक्रिया अस्ति',
    sadeSatiInactive: 'सक्रिया नास्ति',
    phase: 'चरणम्',
    rising: 'उदयः',
    peak: 'शिखरम्',
    setting: 'अस्तम्',
    intensity: 'तीव्रता',
    dashaEnds: 'समाप्तिः',
    birthDetails: 'जन्मविवरणम्',
    born: 'जन्म',
    at: 'समये',
    in: 'स्थाने',
    editProfile: 'सम्पादनम् तथा सेटिंग्स',
    noBirthData: 'जन्मविवरणं योजयित्वा भवतः वैदिककुण्डली अत्र दृश्यते।',
    addBirthData: 'जन्मविवरणं योजयतु',
    notSignedIn: 'वैदिकप्रोफ़ाइलदर्शनाय प्रवेशः आवश्यकः।',
    signIn: 'प्रवेशः',
  },
  ta: {
    title: 'எனது வேத சுயவிவரம்',
    backHome: 'முகப்புக்குத் திரும்பு',
    lagna: 'லக்னம்',
    chandraRashi: 'சந்திர ராசி',
    suryaRashi: 'சூரிய ராசி',
    nakshatra: 'ஜன்ம நட்சத்திரம்',
    pada: 'பாதம்',
    tithi: 'ஜன்ம திதி',
    paksha: 'பக்ஷம்',
    shukla: 'சுக்ல பக்ஷம்',
    krishna: 'கிருஷ்ண பக்ஷம்',
    yoga: 'ஜன்ம யோகம்',
    masa: 'ஜன்ம மாசம் (இந்து மாதம்)',
    birthChart: 'ஜாதக வரைபடம் (ராசி குண்டலி)',
    currentDasha: 'தற்போதைய தசா காலம்',
    mahaDasha: 'மகா தசா',
    antarDasha: 'அந்தர் தசா',
    sadeSati: 'சனிப்பெயர்ச்சி',
    sadeSatiActive: 'தற்போது செயலில் உள்ளது',
    sadeSatiInactive: 'தற்போது செயலில் இல்லை',
    phase: 'கட்டம்',
    rising: 'உதயம் (சந்திரனிலிருந்து 12வது)',
    peak: 'உச்சம் (சந்திரன் மேல்)',
    setting: 'அஸ்தமனம் (சந்திரனிலிருந்து 2வது)',
    intensity: 'தீவிரம்',
    dashaEnds: 'முடிவு',
    birthDetails: 'பிறப்பு விவரங்கள்',
    born: 'பிறப்பு',
    at: 'நேரம்',
    in: 'இடம்',
    editProfile: 'சுயவிவரம் & அமைப்புகள்',
    noBirthData: 'பிறப்பு விவரங்களைச் சேர்த்தவுடன் உங்கள் வேத சுயவிவரம் இங்கே தோன்றும்.',
    addBirthData: 'பிறப்பு விவரங்களைச் சேர்',
    notSignedIn: 'வேத சுயவிவரத்தைக் காண உள்நுழையவும்.',
    signIn: 'உள்நுழை',
  },
  te: {
    title: 'నా వేద ప్రొఫైల్',
    backHome: 'హోమ్‌కు తిరిగి',
    lagna: 'లగ్నం',
    chandraRashi: 'చంద్ర రాశి',
    suryaRashi: 'సూర్య రాశి',
    nakshatra: 'జన్మ నక్షత్రం',
    pada: 'పాదం',
    tithi: 'జన్మ తిథి',
    paksha: 'పక్షం',
    shukla: 'శుక్ల పక్షం',
    krishna: 'కృష్ణ పక్షం',
    yoga: 'జన్మ యోగం',
    masa: 'జన్మ మాసం (హిందూ మాసం)',
    birthChart: 'జన్మ చార్ట్ (రాశి కుండలి)',
    currentDasha: 'ప్రస్తుత దశ కాలం',
    mahaDasha: 'మహా దశ',
    antarDasha: 'అంతర్ దశ',
    sadeSati: 'సాడే సాతి',
    sadeSatiActive: 'ప్రస్తుతం సక్రియం',
    sadeSatiInactive: 'ప్రస్తుతం సక్రియం కాదు',
    phase: 'దశ',
    rising: 'ఉదయం (చంద్రుడి నుండి 12వ)',
    peak: 'శిఖరం (చంద్రుడిపై)',
    setting: 'అస్తమయం (చంద్రుడి నుండి 2వ)',
    intensity: 'తీవ్రత',
    dashaEnds: 'ముగింపు',
    birthDetails: 'జన్మ వివరాలు',
    born: 'జన్మ',
    at: 'సమయం',
    in: 'ప్రదేశం',
    editProfile: 'ప్రొఫైల్ & సెట్టింగ్‌లు',
    noBirthData: 'జన్మ వివరాలు జోడించిన తర్వాత మీ వేద ప్రొఫైల్ ఇక్కడ కనిపిస్తుంది.',
    addBirthData: 'జన్మ వివరాలు జోడించు',
    notSignedIn: 'వేద ప్రొఫైల్ చూడటానికి సైన్ ఇన్ చేయండి.',
    signIn: 'సైన్ ఇన్',
  },
  bn: {
    title: 'আমার বৈদিক প্রোফাইল',
    backHome: 'হোমে ফিরুন',
    lagna: 'লগ্ন',
    chandraRashi: 'চন্দ্র রাশি',
    suryaRashi: 'সূর্য রাশি',
    nakshatra: 'জন্ম নক্ষত্র',
    pada: 'পদ',
    tithi: 'জন্ম তিথি',
    paksha: 'পক্ষ',
    shukla: 'শুক্ল পক্ষ',
    krishna: 'কৃষ্ণ পক্ষ',
    yoga: 'জন্ম যোগ',
    masa: 'জন্ম মাস (হিন্দু মাস)',
    birthChart: 'জন্ম চার্ট (রাশি কুণ্ডলী)',
    currentDasha: 'বর্তমান দশা কাল',
    mahaDasha: 'মহা দশা',
    antarDasha: 'অন্তর দশা',
    sadeSati: 'সাড়ে সাতি',
    sadeSatiActive: 'বর্তমানে সক্রিয়',
    sadeSatiInactive: 'বর্তমানে সক্রিয় নয়',
    phase: 'পর্ব',
    rising: 'উদয় (চন্দ্র থেকে ১২তম)',
    peak: 'শীর্ষ (চন্দ্রের উপর)',
    setting: 'অস্ত (চন্দ্র থেকে ২য়)',
    intensity: 'তীব্রতা',
    dashaEnds: 'সমাপ্তি',
    birthDetails: 'জন্ম বিবরণ',
    born: 'জন্ম',
    at: 'সময়',
    in: 'স্থান',
    editProfile: 'প্রোফাইল ও সেটিংস',
    noBirthData: 'জন্ম বিবরণ যোগ করলে আপনার বৈদিক প্রোফাইল এখানে দেখা যাবে।',
    addBirthData: 'জন্ম বিবরণ যোগ করুন',
    notSignedIn: 'বৈদিক প্রোফাইল দেখতে সাইন ইন করুন।',
    signIn: 'সাইন ইন',
  },
  kn: {
    title: 'ನನ್ನ ವೈದಿಕ ಪ್ರೊಫೈಲ್',
    backHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    lagna: 'ಲಗ್ನ',
    chandraRashi: 'ಚಂದ್ರ ರಾಶಿ',
    suryaRashi: 'ಸೂರ್ಯ ರಾಶಿ',
    nakshatra: 'ಜನ್ಮ ನಕ್ಷತ್ರ',
    pada: 'ಪಾದ',
    tithi: 'ಜನ್ಮ ತಿಥಿ',
    paksha: 'ಪಕ್ಷ',
    shukla: 'ಶುಕ್ಲ ಪಕ್ಷ',
    krishna: 'ಕೃಷ್ಣ ಪಕ್ಷ',
    yoga: 'ಜನ್ಮ ಯೋಗ',
    masa: 'ಜನ್ಮ ಮಾಸ (ಹಿಂದೂ ತಿಂಗಳು)',
    birthChart: 'ಜನ್ಮ ಜಾತಕ (ರಾಶಿ ಕುಂಡಲಿ)',
    currentDasha: 'ಪ್ರಸ್ತುತ ದಶಾ ಅವಧಿ',
    mahaDasha: 'ಮಹಾ ದಶಾ',
    antarDasha: 'ಅಂತರ ದಶಾ',
    sadeSati: 'ಸಾಡೆ ಸಾತಿ',
    sadeSatiActive: 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ',
    sadeSatiInactive: 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯವಲ್ಲ',
    phase: 'ಹಂತ',
    rising: 'ಉದಯ (ಚಂದ್ರನಿಂದ 12ನೇ)',
    peak: 'ಶಿಖರ (ಚಂದ್ರನ ಮೇಲೆ)',
    setting: 'ಅಸ್ತ (ಚಂದ್ರನಿಂದ 2ನೇ)',
    intensity: 'ತೀವ್ರತೆ',
    dashaEnds: 'ಅಂತ್ಯ',
    birthDetails: 'ಜನ್ಮ ವಿವರ',
    born: 'ಜನ್ಮ',
    at: 'ಸಮಯ',
    in: 'ಸ್ಥಳ',
    editProfile: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    noBirthData: 'ಜನ್ಮ ವಿವರಗಳನ್ನು ಸೇರಿಸಿದ ನಂತರ ನಿಮ್ಮ ವೈದಿಕ ಪ್ರೊಫೈಲ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.',
    addBirthData: 'ಜನ್ಮ ವಿವರ ಸೇರಿಸಿ',
    notSignedIn: 'ವೈದಿಕ ಪ್ರೊಫೈಲ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.',
    signIn: 'ಸೈನ್ ಇನ್',
  },
  mr: {
    title: 'माझी वैदिक कुंडली',
    backHome: 'मुख्य पृष्ठावर परत',
    lagna: 'लग्न',
    chandraRashi: 'चंद्र राशी',
    suryaRashi: 'सूर्य राशी',
    nakshatra: 'जन्म नक्षत्र',
    pada: 'पाद',
    tithi: 'जन्म तिथी',
    paksha: 'पक्ष',
    shukla: 'शुक्ल पक्ष',
    krishna: 'कृष्ण पक्ष',
    yoga: 'जन्म योग',
    masa: 'जन्म मास (हिंदू महिना)',
    birthChart: 'जन्म कुंडली (राशी कुंडली)',
    currentDasha: 'सध्याचा दशा काळ',
    mahaDasha: 'महा दशा',
    antarDasha: 'अंतर दशा',
    sadeSati: 'साडेसाती',
    sadeSatiActive: 'सध्या सक्रिय',
    sadeSatiInactive: 'सध्या सक्रिय नाही',
    phase: 'टप्पा',
    rising: 'उदय (चंद्रापासून 12वा)',
    peak: 'शिखर (चंद्रावर)',
    setting: 'अस्त (चंद्रापासून 2रा)',
    intensity: 'तीव्रता',
    dashaEnds: 'समाप्ती',
    birthDetails: 'जन्म तपशील',
    born: 'जन्म',
    at: 'वेळ',
    in: 'ठिकाण',
    editProfile: 'प्रोफाइल आणि सेटिंग्ज',
    noBirthData: 'जन्म तपशील जोडल्यानंतर आपली वैदिक कुंडली इथे दिसेल.',
    addBirthData: 'जन्म तपशील जोडा',
    notSignedIn: 'वैदिक प्रोफाइल पाहण्यासाठी साइन इन करा.',
    signIn: 'साइन इन',
  },
  gu: {
    title: 'મારું વૈદિક પ્રોફાઇલ',
    backHome: 'હોમ પર પાછા',
    lagna: 'લગ્ન',
    chandraRashi: 'ચંદ્ર રાશિ',
    suryaRashi: 'સૂર્ય રાશિ',
    nakshatra: 'જન્મ નક્ષત્ર',
    pada: 'પાદ',
    tithi: 'જન્મ તિથિ',
    paksha: 'પક્ષ',
    shukla: 'શુક્લ પક્ષ',
    krishna: 'કૃષ્ણ પક્ષ',
    yoga: 'જન્મ યોગ',
    masa: 'જન્મ માસ (હિંદુ મહિનો)',
    birthChart: 'જન્મ ચાર્ટ (રાશિ કુંડળી)',
    currentDasha: 'વર્તમાન દશા સમય',
    mahaDasha: 'મહા દશા',
    antarDasha: 'અંતર દશા',
    sadeSati: 'સાડાસાતી',
    sadeSatiActive: 'હાલ સક્રિય',
    sadeSatiInactive: 'હાલ સક્રિય નથી',
    phase: 'તબક્કો',
    rising: 'ઉદય (ચંદ્રથી 12મું)',
    peak: 'શિખર (ચંદ્ર પર)',
    setting: 'અસ્ત (ચંદ્રથી 2જું)',
    intensity: 'તીવ્રતા',
    dashaEnds: 'સમાપ્તિ',
    birthDetails: 'જન્મ વિગતો',
    born: 'જન્મ',
    at: 'સમય',
    in: 'સ્થાન',
    editProfile: 'પ્રોફાઇલ અને સેટિંગ્સ',
    noBirthData: 'જન્મ વિગતો ઉમેર્યા પછી તમારું વૈદિક પ્રોફાઇલ અહીં દેખાશે.',
    addBirthData: 'જન્મ વિગતો ઉમેરો',
    notSignedIn: 'વૈદિક પ્રોફાઇલ જોવા સાઇન ઇન કરો.',
    signIn: 'સાઇન ઇન',
  },
  mai: {
    title: 'हमर वैदिक कुंडली',
    backHome: 'मुख्य पृष्ठ पर वापस',
    lagna: 'लग्न',
    chandraRashi: 'चंद्र राशि',
    suryaRashi: 'सूर्य राशि',
    nakshatra: 'जन्म नक्षत्र',
    pada: 'पाद',
    tithi: 'जन्म तिथि',
    paksha: 'पक्ष',
    shukla: 'शुक्ल पक्ष',
    krishna: 'कृष्ण पक्ष',
    yoga: 'जन्म योग',
    masa: 'जन्म मास (हिन्दू मास)',
    birthChart: 'जन्म कुंडली (राशि कुंडली)',
    currentDasha: 'वर्तमान दशा काल',
    mahaDasha: 'महा दशा',
    antarDasha: 'अन्तर दशा',
    sadeSati: 'साढ़ेसाती',
    sadeSatiActive: 'वर्तमानमे सक्रिय',
    sadeSatiInactive: 'वर्तमानमे सक्रिय नहि',
    phase: 'चरण',
    rising: 'उदय (चंद्रसँ 12वाँ)',
    peak: 'शिखर (चंद्र पर)',
    setting: 'अस्त (चंद्रसँ 2रा)',
    intensity: 'तीव्रता',
    dashaEnds: 'समाप्ति',
    birthDetails: 'जन्म विवरण',
    born: 'जन्म',
    at: 'समय',
    in: 'स्थान',
    editProfile: 'प्रोफ़ाइल आ सेटिंग्स',
    noBirthData: 'जन्म विवरण जोड़ला पर अहाँक वैदिक कुंडली एतय देखाएत।',
    addBirthData: 'जन्म विवरण जोड़ू',
    notSignedIn: 'वैदिक प्रोफ़ाइल देखबाक लेल साइन इन करू।',
    signIn: 'साइन इन',
  },
};

export default function ProfilePage() {
  const locale = useLocale() as Locale;
  const T = (L as Record<string, typeof L.en>)[locale] || L.en;
  const { user, initialized } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [birthPanchang, setBirthPanchang] = useState<BirthPanchang | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  const fetchProfile = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setLoading(false); return; }
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.snapshot) setSnapshot(data.snapshot);
        if (data.birthPanchang) setBirthPanchang(data.birthPanchang);
        if (data.profile) setProfileInfo({
          display_name: data.profile.display_name || '',
          date_of_birth: data.profile.date_of_birth || '',
          time_of_birth: data.profile.time_of_birth || '',
          birth_time_known: data.profile.birth_time_known ?? true,
          birth_place: data.profile.birth_place || '',
          chart_style: data.profile.chart_style || 'north',
        });
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!initialized || !user) { setLoading(false); return; }
    fetchProfile();
  }, [initialized, user, fetchProfile]);

  if (!initialized) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-gold-primary mx-auto" />
          <p className="text-text-secondary text-lg">{T.notSignedIn}</p>
          <a href={`/${locale}`} className="inline-block px-6 py-2 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all">
            {T.signIn}
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
      </div>
    );
  }

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'en-IN' }, locale), { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const hasData = snapshot && profileInfo?.date_of_birth;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <a href={`/${locale}`} className="text-sm text-text-secondary hover:text-gold-light transition-colors">
            &larr; {T.backHome}
          </a>
          <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent">
            {T.title}
          </h1>
        </motion.div>

        <AnimatePresence>
          {hasData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Birth Details Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="px-5 py-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">{T.birthDetails}</p>
                <p className="text-text-primary text-sm">
                  <span className="text-gold-light font-semibold">{profileInfo?.display_name}</span>
                  {profileInfo?.date_of_birth && <> &mdash; {T.born} {formatDate(profileInfo.date_of_birth)}</>}
                  {profileInfo?.time_of_birth && profileInfo?.birth_time_known && <>, {T.at} {profileInfo.time_of_birth}</>}
                  {profileInfo?.birth_place && <>, {T.in} {profileInfo.birth_place}</>}
                </p>
              </motion.div>

              {/* Sade Sati Banner */}
              {snapshot.sade_sati?.isActive && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500/12 via-orange-500/8 to-red-500/12 border border-amber-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-amber-300">{T.sadeSati} &mdash; {T.sadeSatiActive}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                        <span>{T.phase}: <span className="text-amber-400 font-medium">
                          {snapshot.sade_sati.currentPhase === 'rising' ? T.rising :
                           snapshot.sade_sati.currentPhase === 'peak' ? T.peak : T.setting}
                        </span></span>
                        <span>{T.intensity}: <span className="text-amber-400 font-medium">
                          {Math.round(snapshot.sade_sati.overallIntensity * 10) / 10}/10
                        </span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rashi Grid — 3 columns */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="grid grid-cols-3 gap-3"
              >
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm">
                  <div className="flex justify-center mb-2"><RashiIconById id={snapshot.ascendant_sign} size={40} /></div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-0.5">{T.lagna}</p>
                  <p className="text-base font-bold text-gold-light">{snapshot.lagnaRashiName?.[locale] || snapshot.lagnaRashiName?.en}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm">
                  <div className="flex justify-center mb-2"><RashiIconById id={snapshot.moon_sign} size={40} /></div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-0.5">{T.chandraRashi}</p>
                  <p className="text-base font-bold text-gold-light">{snapshot.moonRashiName?.[locale] || snapshot.moonRashiName?.en}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm">
                  <div className="flex justify-center mb-2"><RashiIconById id={snapshot.sun_sign} size={40} /></div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-0.5">{T.suryaRashi}</p>
                  <p className="text-base font-bold text-gold-light">{snapshot.sunRashiName?.[locale] || snapshot.sunRashiName?.en}</p>
                </div>
              </motion.div>

              {/* Birth Panchang — Tithi, Nakshatra, Yoga, Masa */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {/* Birth Nakshatra */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                  <NakshatraIconById id={snapshot.moon_nakshatra} size={36} />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-text-secondary">{T.nakshatra}</p>
                    <p className="text-base font-bold text-gold-light">{snapshot.moonNakshatraName?.[locale] || snapshot.moonNakshatraName?.en}</p>
                    <p className="text-xs text-text-secondary">{T.pada} {snapshot.moon_nakshatra_pada}</p>
                  </div>
                </div>

                {/* Birth Tithi */}
                {birthPanchang?.tithi ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Moon className="w-9 h-9 text-gold-primary/60 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.tithi}</p>
                      <p className="text-base font-bold text-gold-light">{birthPanchang.tithi.name?.[locale] || birthPanchang.tithi.name?.en}</p>
                      <p className="text-xs text-text-secondary">{birthPanchang.tithi.paksha === 'shukla' ? T.shukla : T.krishna}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Moon className="w-9 h-9 text-gold-primary/30 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.tithi}</p>
                      <p className="text-sm text-text-secondary/70">&mdash;</p>
                    </div>
                  </div>
                )}

                {/* Birth Yoga */}
                {birthPanchang?.yoga && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Star className="w-9 h-9 text-gold-primary/60 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.yoga}</p>
                      <p className="text-base font-bold text-gold-light">{birthPanchang.yoga.name?.[locale] || birthPanchang.yoga.name?.en}</p>
                      <p className="text-xs text-text-secondary">{birthPanchang.yoga.meaning?.[locale] || birthPanchang.yoga.meaning?.en}</p>
                    </div>
                  </div>
                )}

                {/* Birth Masa */}
                {birthPanchang?.masa && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Sun className="w-9 h-9 text-gold-primary/60 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.masa}</p>
                      <p className="text-base font-bold text-gold-light">{birthPanchang.masa.name?.[locale] || birthPanchang.masa.name?.en}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Current Dasha */}
              {snapshot.currentDasha && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm"
                >
                  <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-4">{T.currentDasha}</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-text-secondary/75">{T.mahaDasha}</p>
                      <p className="text-2xl font-bold text-gold-light">{snapshot.currentDasha.maha.planetName?.[locale] || snapshot.currentDasha.maha.planet}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {T.dashaEnds} {new Date(snapshot.currentDasha.maha.endDate).toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'en-IN' }, locale), { year: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {snapshot.currentDasha.antar && (
                      <>
                        <div className="w-px h-14 bg-gold-primary/15" />
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-text-secondary/75">{T.antarDasha}</p>
                          <p className="text-2xl font-bold text-gold-light">{snapshot.currentDasha.antar.planetName?.[locale] || snapshot.currentDasha.antar.planet}</p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {T.dashaEnds} {new Date(snapshot.currentDasha.antar.endDate).toLocaleDateString(tl({ en: 'en-IN', hi: 'hi-IN', sa: 'en-IN' }, locale), { year: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Birth Chart */}
              {snapshot.chart_data && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm overflow-hidden"
                >
                  <div className="px-5 pt-4">
                    <h3 className="text-xs uppercase tracking-widest text-text-secondary">{T.birthChart}</h3>
                  </div>
                  <div className="flex justify-center py-4">
                    {profileInfo?.chart_style === 'south' ? (
                      <ChartSouth data={snapshot.chart_data} title="" size={300} />
                    ) : (
                      <ChartNorth data={snapshot.chart_data} title="" size={300} />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Edit Settings Link */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <a
                  href={`/${locale}/settings`}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  {T.editProfile}
                </a>
              </motion.div>
            </motion.div>
          ) : (
            /* No birth data state */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-6 rounded-2xl border border-dashed border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27]"
            >
              <Sparkles className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
              <p className="text-lg text-text-secondary mb-4">{T.noBirthData}</p>
              <a
                href={`/${locale}/settings`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all"
              >
                <Settings className="w-4 h-4" />
                {T.addBirthData}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

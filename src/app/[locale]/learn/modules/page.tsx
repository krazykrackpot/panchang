'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { useEffect } from 'react';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import ProgressIndicator from '@/components/learn/ProgressIndicator';
import LevelBadge from '@/components/learn/LevelBadge';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LI from '@/messages/learn/modules-index.json';

const PHASES = [
  { phase: 0, label: { en: 'Pre-Foundation', hi: 'पूर्व-आधार', sa: 'पूर्व-आधार', mai: 'पूर्व-आधार', mr: 'पूर्व-आधार', ta: 'பூர்வ-ஆधார', te: 'పూర్వ-ఆధార', bn: 'পূর্ব-আধার', kn: 'ಪೂರ್ವ-ಆಧಾರ', gu: 'પૂર્વ-આધાર' }, color: 'border-gold-primary/20', topics: [
    { topic: 'Getting Started', modules: [
      { id: '0-1', title: { en: 'What is Jyotish? (And What It Isn\'t)', hi: 'ज्योतिष क्या है?' } },
      { id: '0-2', title: { en: 'The Hindu Calendar — Why It\'s Different', hi: 'हिन्दू पंचांग — यह अलग क्यों है' } },
      { id: '0-3', title: { en: 'Your Cosmic Address — Sun, Moon, Nakshatra', hi: 'आपका ब्रह्माण्डीय पता', sa: 'आपका ब्रह्माण्डीय पता', mai: 'आपका ब्रह्माण्डीय पता', mr: 'आपका ब्रह्माण्डीय पता', ta: 'ஆபகா ப்ரஹ்மாண்டீய பதா', te: 'ఆపకా బ్రహ్మాణ్డీయ పతా', bn: 'আপকা ব্রহ্মাণ্ডীয পতা', kn: 'ಆಪಕಾ ಬ್ರಹ್ಮಾಣ್ಡೀಯ ಪತಾ', gu: 'આપકા બ્રહ્માણ્ડીય પતા' } },
      { id: '0-4', title: { en: 'Reading Today\'s Panchang', hi: 'आज का पंचांग पढ़ना' } },
      { id: '0-5', title: { en: 'What is a Kundali?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली क्या है?', mai: 'कुण्डली क्या है?', mr: 'कुण्डली क्या है?', ta: 'குண்டலீ க்யா ஹை?', te: 'కుణ్డలీ క్యా హై?', bn: 'কুণ্ডলী ক্যা হৈ?', kn: 'ಕುಣ್ಡಲೀ ಕ್ಯಾ ಹೈ?', gu: 'કુણ્ડલી ક્યા હૈ?' } },
    ]},
  ]},
  { phase: 1, label: { en: 'The Sky', hi: 'आकाश', sa: 'आकाश', mai: 'आकाश', mr: 'आकाश', ta: 'ஆகாஶ', te: 'ఆకాశ', bn: 'আকাশ', kn: 'ಆಕಾಶ', gu: 'આકાશ' }, color: 'border-blue-500/20', topics: [
    { topic: 'Foundations', modules: [
      { id: '1-1', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त', sa: 'रात्रि आकाश एवं क्रान्तिवृत्त', mai: 'रात्रि आकाश एवं क्रान्तिवृत्त', mr: 'रात्रि आकाश एवं क्रान्तिवृत्त', ta: 'ராத்ரி ஆகாஶ எவம் க்ராந்திவிருத்த', te: 'రాత్రి ఆకాశ ఏవం క్రాన్తివృత్త', bn: 'রাত্রি আকাশ এবং ক্রান্তিবৃত্ত', kn: 'ರಾತ್ರಿ ಆಕಾಶ ಏವಂ ಕ್ರಾನ್ತಿವೃತ್ತ', gu: 'રાત્રિ આકાશ એવં ક્રાન્તિવૃત્ત' } },
      { id: '1-2', title: { en: 'Measuring the Sky — Degrees, Signs & Nakshatras', hi: 'आकाश मापन', sa: 'आकाश मापन', mai: 'आकाश मापन', mr: 'आकाश मापन', ta: 'ஆகாஶ மாபந', te: 'ఆకాశ మాపన', bn: 'আকাশ মাপন', kn: 'ಆಕಾಶ ಮಾಪನ', gu: 'આકાશ માપન' } },
      { id: '1-3', title: { en: 'The Zodiac Belt — Fixed Stars vs Moving Planets', hi: 'राशिचक्र पट्टी', sa: 'राशिचक्र पट्टी', mai: 'राशिचक्र पट्टी', mr: 'राशिचक्र पट्टी', ta: 'ராஶிசக்ர பட்டீ', te: 'రాశిచక్ర పట్టీ', bn: 'রাশিচক্র পট্টী', kn: 'ರಾಶಿಚಕ್ರ ಪಟ್ಟೀ', gu: 'રાશિચક્ર પટ્ટી' } },
    ]},
    { topic: 'Grahas', modules: [
      { id: '2-1', title: { en: 'The Nine Grahas — Nature & Karakatva', hi: 'नवग्रह — प्रकृति एवं कारकत्व', sa: 'नवग्रह — प्रकृति एवं कारकत्व', mai: 'नवग्रह — प्रकृति एवं कारकत्व', mr: 'नवग्रह — प्रकृति एवं कारकत्व', ta: 'நவக்ரஹ — ப்ரகிருதி எவம் காரகத்வ', te: 'నవగ్రహ — ప్రకృతి ఏవం కారకత్వ', bn: 'নবগ্রহ — প্রকৃতি এবং কারকত্ব', kn: 'ನವಗ್ರಹ — ಪ್ರಕೃತಿ ಏವಂ ಕಾರಕತ್ವ', gu: 'નવગ્રહ — પ્રકૃતિ એવં કારકત્વ' } },
      { id: '2-2', title: { en: 'Planetary Relationships — Friendship Matrix', hi: 'ग्रह संबंध — मित्रता सारणी', sa: 'ग्रह संबंध — मित्रता सारणी', mai: 'ग्रह संबंध — मित्रता सारणी', mr: 'ग्रह संबंध — मित्रता सारणी', ta: 'க்ரஹ ஸம்பம்ध — மித்ரதா ஸாரணீ', te: 'గ్రహ సంబంధ — మిత్రతా సారణీ', bn: 'গ্রহ সংবংধ — মিত্রতা সারণী', kn: 'ಗ್ರಹ ಸಂಬಂಧ — ಮಿತ್ರತಾ ಸಾರಣೀ', gu: 'ગ્રહ સંબંધ — મિત્રતા સારણી' } },
      { id: '2-3', title: { en: 'Dignities — Where Planets Thrive & Suffer', hi: 'ग्रह गरिमा', sa: 'ग्रह गरिमा', mai: 'ग्रह गरिमा', mr: 'ग्रह गरिमा', ta: 'க்ரஹ கரிமா', te: 'గ్రహ గరిమా', bn: 'গ্রহ গরিমা', kn: 'ಗ್ರಹ ಗರಿಮಾ', gu: 'ગ્રહ ગરિમા' } },
      { id: '2-4', title: { en: 'Retrograde, Combustion & Planetary War', hi: 'वक्री, अस्त एवं ग्रह युद्ध', sa: 'वक्री, अस्त एवं ग्रह युद्ध', mai: 'वक्री, अस्त एवं ग्रह युद्ध', mr: 'वक्री, अस्त एवं ग्रह युद्ध', ta: 'வக்ரீ, அஸ்த எவம் க்ரஹ யுத்ध', te: 'వక్రీ, అస్త ఏవం గ్రహ యుద్ధ', bn: 'বক্রী, অস্ত এবং গ্রহ যুদ্ধ', kn: 'ವಕ್ರೀ, ಅಸ್ತ ಏವಂ ಗ್ರಹ ಯುದ್ಧ', gu: 'વક્રી, અસ્ત એવં ગ્રહ યુદ્ધ' } },
    ]},
    { topic: 'Rashis', modules: [
      { id: '3-1', title: { en: "The 12 Rashis — Parashara's Description", hi: '12 राशियाँ', sa: '12 राशियाँ', mai: '12 राशियाँ', mr: '12 राशियाँ', ta: "The 12 Rashis — Parashara's Description", te: "The 12 Rashis — Parashara's Description", bn: "The 12 Rashis — Parashara's Description", kn: "The 12 Rashis — Parashara's Description", gu: "The 12 Rashis — Parashara's Description" } },
      { id: '3-2', title: { en: 'Sign Qualities — Chara, Sthira, Dwiswabhava', hi: 'राशि गुण', sa: 'राशि गुण', mai: 'राशि गुण', mr: 'राशि गुण', ta: 'ராஶி குண', te: 'రాశి గుణ', bn: 'রাশি গুণ', kn: 'ರಾಶಿ ಗುಣ', gu: 'રાશિ ગુણ' } },
      { id: '3-3', title: { en: 'Sign Lordship & Luminaries', hi: 'राशि स्वामित्व', sa: 'राशि स्वामित्व', mai: 'राशि स्वामित्व', mr: 'राशि स्वामित्व', ta: 'ராஶி ஸ்வாமித்வ', te: 'రాశి స్వామిత్వ', bn: 'রাশি স্বামিত্ব', kn: 'ರಾಶಿ ಸ್ವಾಮಿತ್ವ', gu: 'રાશિ સ્વામિત્વ' } },
    ]},
    { topic: 'Ayanamsha', modules: [
      { id: '4-1', title: { en: 'Earth Wobble — Precession Physics', hi: 'अयनगति भौतिकी', sa: 'अयनगति भौतिकी', mai: 'अयनगति भौतिकी', mr: 'अयनगति भौतिकी', ta: 'அயநகதி भௌதிகீ', te: 'అయనగతి భౌతికీ', bn: 'অযনগতি ভৌতিকী', kn: 'ಅಯನಗತಿ ಭೌತಿಕೀ', gu: 'અયનગતિ ભૌતિકી' } },
      { id: '4-2', title: { en: 'Two Zodiacs — Tropical vs Sidereal', hi: 'दो राशिचक्र', sa: 'दो राशिचक्र', mai: 'दो राशिचक्र', mr: 'दो राशिचक्र', ta: 'தோ ராஶிசக்ர', te: 'దో రాశిచక్ర', bn: 'দো রাশিচক্র', kn: 'ದೋ ರಾಶಿಚಕ್ರ', gu: 'દો રાશિચક્ર' } },
      { id: '4-3', title: { en: 'Ayanamsha Systems — The Great Debate', hi: 'अयनांश पद्धतियाँ', sa: 'अयनांश पद्धतियाँ', mai: 'अयनांश पद्धतियाँ', mr: 'अयनांश पद्धतियाँ', ta: 'அயநாம்ஶ பத்धதியாँ', te: 'అయనాంశ పద్ధతియాఁ', bn: 'অযনাংশ পদ্ধতিযাঁ', kn: 'ಅಯನಾಂಶ ಪದ್ಧತಿಯಾಁ', gu: 'અયનાંશ પદ્ધતિયાઁ' } },
    ]},
  ]},
  { phase: 2, label: { en: 'Pancha Anga', hi: 'पंच अंग', sa: 'पंच अंग', mai: 'पंच अंग', mr: 'पंच अंग', ta: 'பம்ச அம்க', te: 'పంచ అంగ', bn: 'পংচ অংগ', kn: 'ಪಂಚ ಅಂಗ', gu: 'પંચ અંગ' }, color: 'border-amber-500/20', topics: [
    { topic: 'Tithi', modules: [
      { id: '5-1', title: { en: 'What Is a Tithi?', hi: 'तिथि क्या है?', sa: 'तिथि क्या है?', mai: 'तिथि क्या है?', mr: 'तिथि क्या है?', ta: 'திथி க்யா ஹை?', te: 'తిథి క్యా హై?', bn: 'তিথি ক্যা হৈ?', kn: 'ತಿಥಿ ಕ್ಯಾ ಹೈ?', gu: 'તિથિ ક્યા હૈ?' } },
      { id: '5-2', title: { en: 'Shukla & Krishna Paksha', hi: 'शुक्ल एवं कृष्ण पक्ष', sa: 'शुक्ल एवं कृष्ण पक्ष', mai: 'शुक्ल एवं कृष्ण पक्ष', mr: 'शुक्ल एवं कृष्ण पक्ष', ta: 'ஶுக்ல எவம் கிருஷ்ண பக்ஷ', te: 'శుక్ల ఏవం కృష్ణ పక్ష', bn: 'শুক্ল এবং কৃষ্ণ পক্ষ', kn: 'ಶುಕ್ಲ ಏವಂ ಕೃಷ್ಣ ಪಕ್ಷ', gu: 'શુક્લ એવં કૃષ્ણ પક્ષ' } },
      { id: '5-3', title: { en: 'Special Tithis & Vrat Calendar', hi: 'विशेष तिथियाँ', sa: 'विशेष तिथियाँ', mai: 'विशेष तिथियाँ', mr: 'विशेष तिथियाँ', ta: 'விஶேஷ திथியாँ', te: 'విశేష తిథియాఁ', bn: 'বিশেষ তিথিযাঁ', kn: 'ವಿಶೇಷ ತಿಥಿಯಾಁ', gu: 'વિશેષ તિથિયાઁ' } },
    ]},
    { topic: 'Nakshatra', modules: [
      { id: '6-1', title: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र', sa: '27 नक्षत्र', mai: '27 नक्षत्र', mr: '27 नक्षत्र', ta: '27 நக்ஷத்ர', te: '27 నక్షత్ర', bn: '27 নক্ষত্র', kn: '27 ನಕ್ಷತ್ರ', gu: '27 નક્ષત્ર' } },
      { id: '6-2', title: { en: 'Padas & Navamsha Connection', hi: 'पाद एवं नवांश', sa: 'पाद एवं नवांश', mai: 'पाद एवं नवांश', mr: 'पाद एवं नवांश', ta: 'பாத எவம் நவாம்ஶ', te: 'పాద ఏవం నవాంశ', bn: 'পাদ এবং নবাংশ', kn: 'ಪಾದ ಏವಂ ನವಾಂಶ', gu: 'પાદ એવં નવાંશ' } },
      { id: '6-3', title: { en: 'Nakshatra Dasha Lords', hi: 'दशा स्वामी', sa: 'दशा स्वामी', mai: 'दशा स्वामी', mr: 'दशा स्वामी', ta: 'தஶா ஸ்வாமீ', te: 'దశా స్వామీ', bn: 'দশা স্বামী', kn: 'ದಶಾ ಸ್ವಾಮೀ', gu: 'દશા સ્વામી' } },
      { id: '6-4', title: { en: 'Gana, Yoni, Nadi & Compatibility', hi: 'गण, योनि, नाडी', sa: 'गण, योनि, नाडी', mai: 'गण, योनि, नाडी', mr: 'गण, योनि, नाडी', ta: 'கண, யோநி, நாடீ', te: 'గణ, యోని, నాడీ', bn: 'গণ, যোনি, নাডী', kn: 'ಗಣ, ಯೋನಿ, ನಾಡೀ', gu: 'ગણ, યોનિ, નાડી' } },
    ]},
    { topic: 'Yoga, Karana & Vara', modules: [
      { id: '7-1', title: { en: 'Panchang Yoga — Sun-Moon Sum', hi: 'पंचांग योग', sa: 'पंचांग योग', mai: 'पंचांग योग', mr: 'पंचांग योग', ta: 'பம்சாம்க யோக', te: 'పంచాంగ యోగ', bn: 'পংচাংগ যোগ', kn: 'ಪಂಚಾಂಗ ಯೋಗ', gu: 'પંચાંગ યોગ' } },
      { id: '7-2', title: { en: 'Karana — Half-Tithi System', hi: 'करण', sa: 'करण', mai: 'करण', mr: 'करण', ta: 'கரண', te: 'కరణ', bn: 'করণ', kn: 'ಕರಣ', gu: 'કરણ' } },
      { id: '7-3', title: { en: 'Vara & the Hora System', hi: 'वार एवं होरा', sa: 'वार एवं होरा', mai: 'वार एवं होरा', mr: 'वार एवं होरा', ta: 'வார எவம் ஹோரா', te: 'వార ఏవం హోరా', bn: 'বার এবং হোরা', kn: 'ವಾರ ಏವಂ ಹೋರಾ', gu: 'વાર એવં હોરા' } },
      { id: '7-4', title: { en: 'Why 7 Days? — Chaldean Order & Indian Origins', hi: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', sa: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', mai: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', mr: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', ta: '7 திந க்யோம்? — கைல்டியந க்ரம ஔர भாரதீய உத்பத்தி', te: '7 దిన క్యోం? — కైల్డియన క్రమ ఔర భారతీయ ఉత్పత్తి', bn: '7 দিন ক্যোং? — কৈল্ডিযন ক্রম ঔর ভারতীয উত্পত্তি', kn: '7 ದಿನ ಕ್ಯೋಂ? — ಕೈಲ್ಡಿಯನ ಕ್ರಮ ಔರ ಭಾರತೀಯ ಉತ್ಪತ್ತಿ', gu: '7 દિન ક્યોં? — કૈલ્ડિયન ક્રમ ઔર ભારતીય ઉત્પત્તિ' } },
    ]},
    { topic: 'Muhurta', modules: [
      { id: '8-1', title: { en: '30 Muhurtas Per Day', hi: '30 मुहूर्त', sa: '30 मुहूर्त', mai: '30 मुहूर्त', mr: '30 मुहूर्त', ta: '30 முஹூர்த', te: '30 ముహూర్త', bn: '30 মুহূর্ত', kn: '30 ಮುಹೂರ್ತ', gu: '30 મુહૂર્ત' } },
    ]},
  ]},
  { phase: 3, label: { en: 'The Chart', hi: 'कुण्डली', sa: 'कुण्डली', mai: 'कुण्डली', mr: 'कुण्डली', ta: 'குண்டலீ', te: 'కుణ్డలీ', bn: 'কুণ্ডলী', kn: 'ಕುಣ್ಡಲೀ', gu: 'કુણ્ડલી' }, color: 'border-emerald-500/20', topics: [
    { topic: 'Kundali', modules: [
      { id: '9-1', title: { en: 'What Is a Birth Chart?', hi: 'जन्म कुण्डली', sa: 'जन्म कुण्डली', mai: 'जन्म कुण्डली', mr: 'जन्म कुण्डली', ta: 'ஜந்ம குண்டலீ', te: 'జన్మ కుణ్డలీ', bn: 'জন্ম কুণ্ডলী', kn: 'ಜನ್ಮ ಕುಣ್ಡಲೀ', gu: 'જન્મ કુણ્ડલી' } },
      { id: '9-2', title: { en: 'Computing the Lagna', hi: 'लग्न गणना', sa: 'लग्न गणना', mai: 'लग्न गणना', mr: 'लग्न गणना', ta: 'லக்ந கணநா', te: 'లగ్న గణనా', bn: 'লগ্ন গণনা', kn: 'ಲಗ್ನ ಗಣನಾ', gu: 'લગ્ન ગણના' } },
      { id: '9-3', title: { en: 'Placing Planets', hi: 'ग्रह स्थापन', sa: 'ग्रह स्थापन', mai: 'ग्रह स्थापन', mr: 'ग्रह स्थापन', ta: 'க்ரஹ ஸ்थாபந', te: 'గ్రహ స్థాపన', bn: 'গ্রহ স্থাপন', kn: 'ಗ್ರಹ ಸ್ಥಾಪನ', gu: 'ગ્રહ સ્થાપન' } },
      { id: '9-4', title: { en: 'Reading a Chart', hi: 'कुण्डली पठन', sa: 'कुण्डली पठन', mai: 'कुण्डली पठन', mr: 'कुण्डली पठन', ta: 'குண்டலீ பठந', te: 'కుణ్డలీ పఠన', bn: 'কুণ্ডলী পঠন', kn: 'ಕುಣ್ಡಲೀ ಪಠನ', gu: 'કુણ્ડલી પઠન' } },
    ]},
    { topic: 'Bhavas', modules: [
      { id: '10-1', title: { en: '12 Houses — Significations', hi: '12 भाव', sa: '12 भाव', mai: '12 भाव', mr: '12 भाव', ta: '12 भாவ', te: '12 భావ', bn: '12 ভাব', kn: '12 ಭಾವ', gu: '12 ભાવ' } },
      { id: '10-2', title: { en: 'Kendra, Trikona, Dusthana', hi: 'केंद्र, त्रिकोण, दुःस्थान', sa: 'केंद्र, त्रिकोण, दुःस्थान', mai: 'केंद्र, त्रिकोण, दुःस्थान', mr: 'केंद्र, त्रिकोण, दुःस्थान', ta: 'கேம்த்ர, த்ரிகோண, துஃஸ்थாந', te: 'కేంద్ర, త్రికోణ, దుఃస్థాన', bn: 'কেংদ্র, ত্রিকোণ, দুঃস্থান', kn: 'ಕೇಂದ್ರ, ತ್ರಿಕೋಣ, ದುಃಸ್ಥಾನ', gu: 'કેંદ્ર, ત્રિકોણ, દુઃસ્થાન' } },
      { id: '10-3', title: { en: 'House Lords', hi: 'भावेश', sa: 'भावेश', mai: 'भावेश', mr: 'भावेश', ta: 'भாவேஶ', te: 'భావేశ', bn: 'ভাবেশ', kn: 'ಭಾವೇಶ', gu: 'ભાવેશ' } },
    ]},
    { topic: 'Vargas', modules: [
      { id: '11-1', title: { en: 'Why Divisional Charts?', hi: 'विभागीय चार्ट', sa: 'विभागीय चार्ट', mai: 'विभागीय चार्ट', mr: 'विभागीय चार्ट', ta: 'விभாகீய சார்ட', te: 'విభాగీయ చార్ట', bn: 'বিভাগীয চার্ট', kn: 'ವಿಭಾಗೀಯ ಚಾರ್ಟ', gu: 'વિભાગીય ચાર્ટ' } },
      { id: '11-2', title: { en: 'Navamsha (D9)', hi: 'नवांश', sa: 'नवांश', mai: 'नवांश', mr: 'नवांश', ta: 'நவாம்ஶ', te: 'నవాంశ', bn: 'নবাংশ', kn: 'ನವಾಂಶ', gu: 'નવાંશ' } },
      { id: '11-3', title: { en: 'Key Vargas D2-D60', hi: 'प्रमुख वर्ग', sa: 'प्रमुख वर्ग', mai: 'प्रमुख वर्ग', mr: 'प्रमुख वर्ग', ta: 'ப்ரமுख வர்க', te: 'ప్రముఖ వర్గ', bn: 'প্রমুখ বর্গ', kn: 'ಪ್ರಮುಖ ವರ್ಗ', gu: 'પ્રમુખ વર્ગ' } },
    ]},
    { topic: 'Dashas', modules: [
      { id: '12-1', title: { en: 'Vimshottari — 120-Year Cycle', hi: 'विंशोत्तरी', sa: 'विंशोत्तरी', mai: 'विंशोत्तरी', mr: 'विंशोत्तरी', ta: 'விம்ஶோத்தரீ', te: 'వింశోత్తరీ', bn: 'বিংশোত্তরী', kn: 'ವಿಂಶೋತ್ತರೀ', gu: 'વિંશોત્તરી' } },
      { id: '12-2', title: { en: 'Reading Dasha Periods', hi: 'दशा पठन', sa: 'दशा पठन', mai: 'दशा पठन', mr: 'दशा पठन', ta: 'தஶா பठந', te: 'దశా పఠన', bn: 'দশা পঠন', kn: 'ದಶಾ ಪಠನ', gu: 'દશા પઠન' } },
      { id: '12-3', title: { en: 'Timing Events', hi: 'घटना समय', sa: 'घटना समय', mai: 'घटना समय', mr: 'घटना समय', ta: 'घடநா ஸமய', te: 'ఘటనా సమయ', bn: 'ঘটনা সময', kn: 'ಘಟನಾ ಸಮಯ', gu: 'ઘટના સમય' } },
    ]},
    { topic: 'Transits', modules: [
      { id: '13-1', title: { en: 'How Transits Work', hi: 'गोचर', sa: 'गोचर', mai: 'गोचर', mr: 'गोचर', ta: 'கோசர', te: 'గోచర', bn: 'গোচর', kn: 'ಗೋಚರ', gu: 'ગોચર' } },
      { id: '13-2', title: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढ़े साती', mai: 'साढ़े साती', mr: 'साढ़े साती', ta: 'ஸாढ़ே ஸாதீ', te: 'సాఢ़ే సాతీ', bn: 'সাঢ়ে সাতী', kn: 'ಸಾಢ़ೇ ಸಾತೀ', gu: 'સાઢ़ે સાતી' } },
      { id: '13-3', title: { en: 'Ashtakavarga Transit Scoring', hi: 'अष्टकवर्ग गोचर', sa: 'अष्टकवर्ग गोचर', mai: 'अष्टकवर्ग गोचर', mr: 'अष्टकवर्ग गोचर', ta: 'அஷ்டகவர்க கோசர', te: 'అష్టకవర్గ గోచర', bn: 'অষ্টকবর্গ গোচর', kn: 'ಅಷ್ಟಕವರ್ಗ ಗೋಚರ', gu: 'અષ્ટકવર્ગ ગોચર' } },
      { id: '13-4', title: { en: 'Eclipses — Grahan & the Rahu-Ketu Axis', hi: 'ग्रहण — राहु-केतु अक्ष', sa: 'ग्रहण — राहु-केतु अक्ष', mai: 'ग्रहण — राहु-केतु अक्ष', mr: 'ग्रहण — राहु-केतु अक्ष', ta: 'க்ரஹண — ராஹு-கேது அக்ஷ', te: 'గ్రహణ — రాహు-కేతు అక్ష', bn: 'গ্রহণ — রাহু-কেতু অক্ষ', kn: 'ಗ್ರಹಣ — ರಾಹು-ಕೇತು ಅಕ್ಷ', gu: 'ગ્રહણ — રાહુ-કેતુ અક્ષ' } },
    ]},
  ]},
  { phase: 4, label: { en: 'Applied Jyotish', hi: 'प्रयुक्त ज्योतिष', sa: 'प्रयुक्त ज्योतिष', mai: 'प्रयुक्त ज्योतिष', mr: 'प्रयुक्त ज्योतिष', ta: 'ப்ரயுக்த ஜ்யோதிஷ', te: 'ప్రయుక్త జ్యోతిష', bn: 'প্রযুক্ত জ্যোতিষ', kn: 'ಪ್ರಯುಕ್ತ ಜ್ಯೋತಿಷ', gu: 'પ્રયુક્ત જ્યોતિષ' }, color: 'border-pink-500/20', topics: [
    { topic: 'Compatibility', modules: [
      { id: '14-1', title: { en: 'Ashta Kuta — 8-Factor Matching', hi: 'अष्ट कूट', sa: 'अष्ट कूट', mai: 'अष्ट कूट', mr: 'अष्ट कूट', ta: 'அஷ்ட கூட', te: 'అష్ట కూట', bn: 'অষ্ট কূট', kn: 'ಅಷ್ಟ ಕೂಟ', gu: 'અષ્ટ કૂટ' } },
      { id: '14-2', title: { en: 'Key Kutas & Doshas', hi: 'प्रमुख कूट', sa: 'प्रमुख कूट', mai: 'प्रमुख कूट', mr: 'प्रमुख कूट', ta: 'ப்ரமுख கூட', te: 'ప్రముఖ కూట', bn: 'প্রমুখ কূট', kn: 'ಪ್ರಮುಖ ಕೂಟ', gu: 'પ્રમુખ કૂટ' } },
      { id: '14-3', title: { en: 'Beyond Kuta — Chart Analysis', hi: 'कूट से परे', sa: 'कूट से परे', mai: 'कूट से परे', mr: 'कूट से परे', ta: 'கூட ஸே பரே', te: 'కూట సే పరే', bn: 'কূট সে পরে', kn: 'ಕೂಟ ಸೇ ಪರೇ', gu: 'કૂટ સે પરે' } },
    ]},
    { topic: 'Yogas & Doshas', modules: [
      { id: '15-1', title: { en: 'Pancha Mahapurusha Yogas', hi: 'पंच महापुरुष', sa: 'पंच महापुरुष', mai: 'पंच महापुरुष', mr: 'पंच महापुरुष', ta: 'பம்ச மஹாபுருஷ', te: 'పంచ మహాపురుష', bn: 'পংচ মহাপুরুষ', kn: 'ಪಂಚ ಮಹಾಪುರುಷ', gu: 'પંચ મહાપુરુષ' } },
      { id: '15-2', title: { en: 'Raja & Dhana Yogas', hi: 'राज एवं धन योग', sa: 'राज एवं धन योग', mai: 'राज एवं धन योग', mr: 'राज एवं धन योग', ta: 'ராஜ எவம் धந யோக', te: 'రాజ ఏవం ధన యోగ', bn: 'রাজ এবং ধন যোগ', kn: 'ರಾಜ ಏವಂ ಧನ ಯೋಗ', gu: 'રાજ એવં ધન યોગ' } },
      { id: '15-3', title: { en: 'Common Doshas', hi: 'प्रमुख दोष', sa: 'प्रमुख दोष', mai: 'प्रमुख दोष', mr: 'प्रमुख दोष', ta: 'ப்ரமுख தோஷ', te: 'ప్రముఖ దోష', bn: 'প্রমুখ দোষ', kn: 'ಪ್ರಮುಖ ದೋಷ', gu: 'પ્રમુખ દોષ' } },
      { id: '15-4', title: { en: 'Remedial Measures', hi: 'उपाय', sa: 'उपाय', mai: 'उपाय', mr: 'उपाय', ta: 'உபாய', te: 'ఉపాయ', bn: 'উপায', kn: 'ಉಪಾಯ', gu: 'ઉપાય' } },
    ]},
  ]},
  { phase: 5, label: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान', sa: 'शास्त्रीय ज्ञान', mai: 'शास्त्रीय ज्ञान', mr: 'शास्त्रीय ज्ञान', ta: 'ஶாஸ்த்ரீய ஜ்ஞாந', te: 'శాస్త్రీయ జ్ఞాన', bn: 'শাস্ত্রীয জ্ঞান', kn: 'ಶಾಸ್ತ್ರೀಯ ಜ್ಞಾನ', gu: 'શાસ્ત્રીય જ્ઞાન' }, color: 'border-gold-primary/20', topics: [
    { topic: 'Classical Texts', modules: [
      { id: '16-1', title: { en: 'Astronomical Texts', hi: 'खगोलशास्त्रीय', sa: 'खगोलशास्त्रीय', mai: 'खगोलशास्त्रीय', mr: 'खगोलशास्त्रीय', ta: 'खகோலஶாஸ்த்ரீய', te: 'ఖగోలశాస్త్రీయ', bn: 'খগোলশাস্ত্রীয', kn: 'ಖಗೋಲಶಾಸ್ತ್ರೀಯ', gu: 'ખગોલશાસ્ત્રીય' } },
      { id: '16-2', title: { en: 'Hora Texts', hi: 'होरा ग्रंथ', sa: 'होरा ग्रंथ', mai: 'होरा ग्रंथ', mr: 'होरा ग्रंथ', ta: 'ஹோரா க்ரம்थ', te: 'హోరా గ్రంథ', bn: 'হোরা গ্রংথ', kn: 'ಹೋರಾ ಗ್ರಂಥ', gu: 'હોરા ગ્રંથ' } },
      { id: '16-3', title: { en: "India's Contributions", hi: 'भारत का योगदान', sa: 'भारत का योगदान', mai: 'भारत का योगदान', mr: 'भारत का योगदान', ta: "India's Contributions", te: "India's Contributions", bn: "India's Contributions", kn: "India's Contributions", gu: "India's Contributions" } },
    ]},
  ]},
  { phase: 6, label: { en: "India's Contributions to Science", hi: 'विज्ञान में भारत का योगदान', sa: 'विज्ञान में भारत का योगदान', mai: 'विज्ञान में भारत का योगदान', mr: 'विज्ञान में भारत का योगदान', ta: "India's Contributions to Science", te: "India's Contributions to Science", bn: "India's Contributions to Science", kn: "India's Contributions to Science", gu: "India's Contributions to Science" }, color: 'border-emerald-500/20', topics: [
    { topic: 'Mathematics', modules: [
      { id: '25-1', title: { en: 'Zero — The Most Dangerous Idea in History', hi: 'शून्य — इतिहास का सबसे खतरनाक विचार', sa: 'शून्य — इतिहास का सबसे खतरनाक विचार', mai: 'शून्य — इतिहास का सबसे खतरनाक विचार', mr: 'शून्य — इतिहास का सबसे खतरनाक विचार', ta: 'ஶூந்ய — இதிஹாஸ கா ஸபஸே खதரநாக விசார', te: 'శూన్య — ఇతిహాస కా సబసే ఖతరనాక విచార', bn: 'শূন্য — ইতিহাস কা সবসে খতরনাক বিচার', kn: 'ಶೂನ್ಯ — ಇತಿಹಾಸ ಕಾ ಸಬಸೇ ಖತರನಾಕ ವಿಚಾರ', gu: 'શૂન્ય — ઇતિહાસ કા સબસે ખતરનાક વિચાર' } },
      { id: '25-2', title: { en: "Did You Know 'Sine' Is Sanskrit?", hi: "क्या आप जानते हैं 'Sine' संस्कृत है?", sa: "क्या आप जानते हैं 'Sine' संस्कृत है?", mai: "क्या आप जानते हैं 'Sine' संस्कृत है?", mr: "क्या आप जानते हैं 'Sine' संस्कृत है?", ta: "Did You Know 'Sine' Is Sanskrit?", te: "Did You Know 'Sine' Is Sanskrit?", bn: "Did You Know 'Sine' Is Sanskrit?", kn: "Did You Know 'Sine' Is Sanskrit?", gu: "Did You Know 'Sine' Is Sanskrit?" } },
      { id: '25-3', title: { en: 'π = 3.1416 — How Aryabhata Nailed It', hi: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', sa: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', mai: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', mr: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', ta: 'π = 3.1416 — ஆர்யभட நே கைஸே ஸடீக கணநா கீ', te: 'π = 3.1416 — ఆర్యభట నే కైసే సటీక గణనా కీ', bn: 'π = 3.1416 — আর্যভট নে কৈসে সটীক গণনা কী', kn: 'π = 3.1416 — ಆರ್ಯಭಟ ನೇ ಕೈಸೇ ಸಟೀಕ ಗಣನಾ ಕೀ', gu: 'π = 3.1416 — આર્યભટ ને કૈસે સટીક ગણના કી' } },
      { id: '25-4', title: { en: 'Negative Numbers — Less Than Nothing', hi: 'ऋणात्मक संख्याएँ — शून्य से कम', sa: 'ऋणात्मक संख्याएँ — शून्य से कम', mai: 'ऋणात्मक संख्याएँ — शून्य से कम', mr: 'ऋणात्मक संख्याएँ — शून्य से कम', ta: 'ऋணாத்மக ஸம்ख்யாஎँ — ஶூந்ய ஸே கம', te: 'ఋణాత్మక సంఖ్యాఏఁ — శూన్య సే కమ', bn: 'ঋণাত্মক সংখ্যাএঁ — শূন্য সে কম', kn: 'ಋಣಾತ್ಮಕ ಸಂಖ್ಯಾಏಁ — ಶೂನ್ಯ ಸೇ ಕಮ', gu: 'ઋણાત્મક સંખ્યાએઁ — શૂન્ય સે કમ' } },
      { id: '25-5', title: { en: 'Binary Code — 1,800 Years Before Computers', hi: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', sa: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', mai: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', mr: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', ta: 'த்விஆधாரீ — கம்ப்யூடர ஸே 1,800 வர்ஷ பஹலே', te: 'ద్విఆధారీ — కమ్ప్యూటర సే 1,800 వర్ష పహలే', bn: 'দ্বিআধারী — কম্প্যূটর সে 1,800 বর্ষ পহলে', kn: 'ದ್ವಿಆಧಾರೀ — ಕಮ್ಪ್ಯೂಟರ ಸೇ 1,800 ವರ್ಷ ಪಹಲೇ', gu: 'દ્વિઆધારી — કમ્પ્યૂટર સે 1,800 વર્ષ પહલે' } },
      { id: '25-6', title: { en: "Fibonacci Was Indian — It Started With Music", hi: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', sa: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', mai: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', mr: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', ta: "ஃபிபொனாச்சி இந்தியரே — இது இசையிலிருந்து தொடங்கியது", te: "ఫిబొనాచి భారతీయుడు — ఇది సంగీతంతో మొదలైంది", bn: "ফিবোনাচি ভারতীয় ছিলেন — এটা সংগীত দিয়ে শুরু হয়েছিল", kn: "ಫಿಬೊನಾಚಿ ಭಾರತೀಯ — ಇದು ಸಂಗೀತದಿಂದ ಪ್ರಾರಂಭವಾಯಿತು", gu: "ફિબોનાચી ભારતીય હતા — તે સંગીતથી શરૂ થયું" } },
      { id: '25-7', title: { en: 'Calculus — Invented in Kerala, Not Cambridge', hi: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', sa: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', mai: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', mr: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', ta: 'கைலகுலஸ — கேரல மேம் खோஜா, கைம்ப்ரிஜ மேம் நஹீம்', te: 'కైలకులస — కేరల మేం ఖోజా, కైమ్బ్రిజ మేం నహీం', bn: 'কৈলকুলস — কেরল মেং খোজা, কৈম্ব্রিজ মেং নহীং', kn: 'ಕೈಲಕುಲಸ — ಕೇರಲ ಮೇಂ ಖೋಜಾ, ಕೈಮ್ಬ್ರಿಜ ಮೇಂ ನಹೀಂ', gu: 'કૈલકુલસ — કેરલ મેં ખોજા, કૈમ્બ્રિજ મેં નહીં' } },
      { id: '25-8', title: { en: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", hi: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", sa: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", mai: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", mr: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", ta: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", te: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", bn: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", kn: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", gu: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras" } },
    ]},
    { topic: 'Astronomy & Physics', modules: [
      { id: '26-1', title: { en: 'Earth Rotates — 1,000 Years Before Europe', hi: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', sa: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', mai: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', mr: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', ta: 'பிருथ்வீ घூமதீ ஹை — யூரோப ஸே 1,000 வர்ஷ பஹலே', te: 'పృథ్వీ ఘూమతీ హై — యూరోప సే 1,000 వర్ష పహలే', bn: 'পৃথ্বী ঘূমতী হৈ — যূরোপ সে 1,000 বর্ষ পহলে', kn: 'ಪೃಥ್ವೀ ಘೂಮತೀ ಹೈ — ಯೂರೋಪ ಸೇ 1,000 ವರ್ಷ ಪಹಲೇ', gu: 'પૃથ્વી ઘૂમતી હૈ — યૂરોપ સે 1,000 વર્ષ પહલે' } },
      { id: '26-2', title: { en: 'Gravity — 500 Years Before Newton', hi: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', sa: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', mai: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', mr: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', ta: 'குருத்வாகர்ஷண — ந்யூடந ஸே 500 வர்ஷ பஹலே', te: 'గురుత్వాకర్షణ — న్యూటన సే 500 వర్ష పహలే', bn: 'গুরুত্বাকর্ষণ — ন্যূটন সে 500 বর্ষ পহলে', kn: 'ಗುರುತ್ವಾಕರ್ಷಣ — ನ್ಯೂಟನ ಸೇ 500 ವರ್ಷ ಪಹಲೇ', gu: 'ગુરુત્વાકર્ષણ — ન્યૂટન સે 500 વર્ષ પહલે' } },
      { id: '26-3', title: { en: 'Speed of Light — In a 14th Century Text', hi: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', sa: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', mai: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', mr: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', ta: 'ப்ரகாஶ கீ கதி — 14வீம் ஶதாப்தீ கே க்ரந்थ மேம்', te: 'ప్రకాశ కీ గతి — 14వీం శతాబ్దీ కే గ్రన్థ మేం', bn: 'প্রকাশ কী গতি — 14বীং শতাব্দী কে গ্রন্থ মেং', kn: 'ಪ್ರಕಾಶ ಕೀ ಗತಿ — 14ವೀಂ ಶತಾಬ್ದೀ ಕೇ ಗ್ರನ್ಥ ಮೇಂ', gu: 'પ્રકાશ કી ગતિ — 14વીં શતાબ્દી કે ગ્રન્થ મેં' } },
      { id: '26-4', title: { en: '4.32 Billion Years — How Did They Know?', hi: '4.32 अरब वर्ष — उन्हें कैसे पता था?', sa: '4.32 अरब वर्ष — उन्हें कैसे पता था?', mai: '4.32 अरब वर्ष — उन्हें कैसे पता था?', mr: '4.32 अरब वर्ष — उन्हें कैसे पता था?', ta: '4.32 அரப வர்ஷ — உந்ஹேம் கைஸே பதா थா?', te: '4.32 అరబ వర్ష — ఉన్హేం కైసే పతా థా?', bn: '4.32 অরব বর্ষ — উন্হেং কৈসে পতা থা?', kn: '4.32 ಅರಬ ವರ್ಷ — ಉನ್ಹೇಂ ಕೈಸೇ ಪತಾ ಥಾ?', gu: '4.32 અરબ વર્ષ — ઉન્હેં કૈસે પતા થા?' } },
    ]},
  ]},
  { phase: 12, title: { en: 'Festival Calendar Science', hi: 'त्योहार कैलेंडर विज्ञान' }, topics: [
    { topic: 'Festival Calendar Science', modules: [
      { id: '27-1', title: { en: 'Festival Timing Rules (Kala-Vyapti)', hi: 'त्योहार समय नियम (काल-व्याप्ति)', sa: 'उत्सवकालव्याप्तिनियमाः', mai: 'त्योहार समय नियम', mr: 'सण समय नियम', ta: 'திருவிழா நேர விதிகள்', te: 'పండుగ సమయ నియమాలు', bn: 'উৎসব সময় নিয়ম', kn: 'ಹಬ್ಬದ ಸಮಯ ನಿಯಮಗಳು', gu: 'તહેવાર સમય નિયમો' } },
      { id: '27-2', title: { en: 'Adhika Masa — The Intercalary Month', hi: 'अधिक मास — अन्तर्वेशी मास', sa: 'अधिकमासः', mai: 'अधिक मास', mr: 'अधिक मास', ta: 'அதிக மாசம்', te: 'అధిక మాసం', bn: 'অধিক মাস', kn: 'ಅಧಿಕ ಮಾಸ', gu: 'અધિક માસ' } },
      { id: '27-3', title: { en: 'Smarta & Vaishnava: Two Traditions, One Sky', hi: 'स्मार्त और वैष्णव: दो परम्पराएँ, एक आकाश', sa: 'स्मार्तवैष्णवौ', mai: 'स्मार्त और वैष्णव', mr: 'स्मार्त और वैष्णव', ta: 'ஸ்மார்த & வைஷ்ணவ', te: 'స్మార్త & వైష్ణవ', bn: 'স্মার্ত ও বৈষ্ণব', kn: 'ಸ್ಮಾರ್ತ & ವೈಷ್ಣವ', gu: 'સ્માર્ત & વૈષ્ણવ' } },
    ]},
  ]},
];

export default function ModuleIndexPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  let moduleCount = 0;
  PHASES.forEach(p => p.topics.forEach(t => { moduleCount += t.modules.length; }));

  const { hydrated, hydrateFromStorage, getModuleStatus, getPhaseProgress, getOverallProgress, getNextModule } = useLearningProgressStore();

  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  const overall = hydrated ? getOverallProgress() : null;
  const nextModuleId = hydrated ? getNextModule() : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {lt(LI.pageTitle as LocaleText, locale)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
          {lt(LI.pageSubtitle as LocaleText, locale)}
        </p>
      </div>

      {/* Overall progress */}
      {hydrated && overall && overall.mastered > 0 && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-light font-bold text-lg" style={hf}>
              {lt(LI.yourProgress as LocaleText, locale)}
            </span>
            <span className="text-gold-primary text-sm font-mono">{overall.mastered}/{overall.total}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: `${overall.percent}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-secondary/60 text-xs">
              {`${overall.percent}% ${lt(LI.percentComplete as LocaleText, locale)}`}
            </p>
            <LevelBadge masteredCount={overall.mastered} locale={locale} variant="compact" />
          </div>
        </div>
      )}

      {/* Start button */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 bg-gradient-to-r from-gold-primary/5 to-indigo-500/5 flex items-center justify-between">
        <div>
          <div className="text-gold-light font-bold text-lg" style={hf}>{lt(LI.startLearning as LocaleText, locale)}</div>
          <p className="text-text-secondary text-xs mt-1">{lt(LI.startSubtitle as LocaleText, locale)}</p>
        </div>
        <Link href="/learn/modules/1-1" className="shrink-0 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors">
          {lt(LI.begin as LocaleText, locale)}
        </Link>
      </div>

      {/* Phase sections */}
      {PHASES.map((phase) => (
        <div key={phase.phase}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-xs text-gold-primary font-bold">{phase.phase}</span>
            <h3 className="text-gold-light font-bold text-lg" style={hf}>{lt(phase.label, locale)}</h3>
            {hydrated && (() => {
              const pp = getPhaseProgress(phase.phase);
              return pp.mastered > 0 ? (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pp.mastered === pp.total ? 'bg-emerald-500' : 'bg-gold-primary'}`}
                      style={{ width: `${pp.percent}%` }} />
                  </div>
                  <span className="text-[10px] text-text-secondary/40">{pp.mastered}/{pp.total}</span>
                </div>
              ) : null;
            })()}
          </div>

          <div className="space-y-3">
            {phase.topics.map((topic) => (
              <div key={topic.topic} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border ${phase.color} overflow-hidden`}>
                <div className="px-4 py-2 border-b border-gold-primary/5">
                  <span className="text-gold-dark text-xs uppercase tracking-widest font-bold">{topic.topic}</span>
                </div>
                <div className="divide-y divide-gold-primary/5">
                  {topic.modules.map((mod, i) => (
                    <motion.div key={mod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <Link href={`/learn/modules/${mod.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          {hydrated && <ProgressIndicator status={getModuleStatus(mod.id)} size={14} />}
                          <span className="text-text-tertiary text-xs font-mono w-8">{mod.id.replace('-', '.')}</span>
                          <span className={`text-sm group-hover:text-gold-light transition-colors ${
                            hydrated && getModuleStatus(mod.id) === 'mastered' ? 'text-text-secondary/60' : 'text-text-primary'
                          }`} style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {lt(mod.title, locale)}
                          </span>
                          {mod.id === nextModuleId && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-bold">
                              {lt(LI.next as LocaleText, locale)}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-primary transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

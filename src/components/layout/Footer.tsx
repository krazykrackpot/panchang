'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { COMPETITORS } from '@/lib/seo/competitors';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { classifyPath, sectionsForVariant } from './Footer.routes';

// ---------------------------------------------------------------------------
// Footer link sections  –  ~35 links for SEO link equity distribution
// ---------------------------------------------------------------------------

const SECTIONS = [
  {
    title: { en: 'Tools', hi: 'उपकरण', ta: 'கருவிகள்', bn: 'সরঞ্জাম', te: 'సాధనాలు', gu: 'સાધનો', kn: 'ಉಪಕರಣಗಳು', mr: 'साधने', mai: 'उपकरण', sa: 'उपकरणानि' },
    links: [
      { href: '/kundali', label: { en: 'Kundali', hi: 'कुण्डली', ta: 'குண்டலி', bn: 'কুণ্ডলি', te: 'కుండలి', gu: 'કુંડળી', kn: 'ಜಾತಕ', mr: 'कुंडली', mai: 'कुण्डली निर्माण' } },
      { href: '/matching', label: { en: 'Matching', hi: 'गुण मिलान', ta: 'பொருத்தம்', bn: 'গুণ মিলন', te: 'జాతక పొందిక', gu: 'ગુણ મેળાપ', kn: 'ಗುಣ ಮಿಲನ', mr: 'गुणमेलन', mai: 'विवाह मिलान' } },
      { href: '/sign-calculator', label: { en: 'Sign Calculator', hi: 'राशि खोजें', ta: 'ராசி கணிப்பான்', bn: 'রাশি ক্যালকুলেটর', te: 'రాశి కాలిక్యులేటర్', gu: 'રાશિ કૅલ્ક્યુલેટર', kn: 'ರಾಶಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್', mr: 'राशी कॅल्क्युलेटर', mai: 'राशि कैलकुलेटर' } },
      { href: '/muhurta-ai', label: { en: 'Muhurta Finder', hi: 'मुहूर्त खोजक', ta: 'முகூர்த்தம் கண்டுபிடி', bn: 'মুহূর্ত খোঁজক', te: 'ముహూర్తం వెతుకు', gu: 'મુહૂર્ત શોધક', kn: 'ಮುಹೂರ್ತ ಹುಡುಕಾಟ', mr: 'मुहूर्त शोधक', mai: 'मुहूर्त खोजनिहार' } },
      { href: '/varshaphal', label: { en: 'Varshaphal', hi: 'वर्षफल', ta: 'வர்ஷபலன்', bn: 'বর্ষফল', te: 'వర్షఫలం', gu: 'વર્ષફળ', kn: 'ವರ್ಷಫಲ', mr: 'वर्षफळ', mai: 'वर्षफल विवरण' } },
      { href: '/kp-system', label: { en: 'KP System', hi: 'KP पद्धति', ta: 'KP முறை', bn: 'KP পদ্ধতি', te: 'KP పద్ధతి', gu: 'KP પદ્ધતિ', kn: 'KP ಪದ್ಧತಿ', mr: 'KP पद्धती', mai: 'KP प्रणाली' } },
      { href: '/kp/prashna', label: { en: 'KP Prashna', hi: 'केपी प्रश्न', ta: 'KP பிரசினா', bn: 'KP প্রশ্ন', te: 'KP ప్రశ్న', gu: 'KP પ્રશ્ન', kn: 'KP ಪ್ರಶ್ನ', mr: 'KP प्रश्न', mai: 'केपी प्रश्न' } },
      { href: '/kp/transits', label: { en: 'KP Transits', hi: 'केपी गोचर', ta: 'KP கோச்சாரம்', bn: 'KP গোচর', te: 'KP గోచారం', gu: 'KP ગોચર', kn: 'KP ಗೋಚಾರ', mr: 'KP गोचर', mai: 'केपी गोचर' } },
      { href: '/prashna', label: { en: 'Prashna', hi: 'प्रश्न', ta: 'பிரச்சினை', bn: 'প্রশ্ন', te: 'ప్రశ్న', gu: 'પ્રશ્ન', kn: 'ಪ್ರಶ್ನೆ', mr: 'प्रश्न ज्योतिष', mai: 'प्रश्न शास्त्र' } },
      { href: '/baby-names', label: { en: 'Baby Names', hi: 'बच्चों के नाम', ta: 'குழந்தை பெயர்கள்', bn: 'শিশুর নাম', te: 'శిశు పేర్లు', gu: 'શિશુ નામો', kn: 'ಶಿಶು ಹೆಸರುಗಳು', mr: 'बाळाची नावे', mai: 'बच्चाक नाम' } },
      { href: '/sade-sati', label: { en: 'Sade Sati', hi: 'साढ़े साती', ta: 'சனிப்பெயர்ச்சி', bn: 'সাড়ে সাতি', te: 'సాడే సాతి', gu: 'સાડે સાતી', kn: 'ಸಾಡೆ ಸಾತಿ', mr: 'साडेसाती', mai: 'साढ़े सातीक प्रभाव' } },
      { href: '/cosmic-blueprint', label: { en: 'Cosmic Blueprint', hi: 'ब्रह्मांडीय नक्शा', ta: 'கோள வரைபடம்', bn: 'মহাজাগতিক ব্লুপ্রিন্ট', te: 'విశ్వ నమూనా', gu: 'બ્રહ્માંડ નકશા', kn: 'ಬ್ರಹ್ಮಾಂಡ ನಕ್ಷೆ', mr: 'ब्रह्मांडीय नकाशा', mai: 'ब्रह्माण्ड चित्र' } },
      { href: '/tropical-compare', label: { en: 'Vedic vs Tropical', hi: 'वैदिक vs सायन', ta: 'வேதம் vs சாயனம்', bn: 'বৈদিক vs সায়ন', te: 'వేద vs సాయన', gu: 'વૈદિક vs સાયન', kn: 'ವೈದಿಕ vs ಸಾಯನ', mr: 'वैदिक विरुद्ध सायन', mai: 'वैदिक बनाम सायन' } },
      { href: '/sign-shift', label: { en: 'Sign Shift', hi: 'राशि परिवर्तन', ta: 'ராசி மாற்றம்', bn: 'রাশি পরিবর্তন', te: 'రాశి మార్పు', gu: 'રાશિ પરિવર્તન', kn: 'ರಾಶಿ ಬದಲಾವಣೆ', mr: 'राशी बदल', mai: 'राशि बदलाव' } },
      // Audit 2026-05-25 §D4 — high-traffic hubs/legal that were absent.
      { href: '/charts', label: { en: 'Charts Hub', hi: 'चार्ट केंद्र', ta: 'அட்டவணை மையம்', bn: 'চার্ট হাব', te: 'చార్ట్ కేంద్రం', gu: 'ચાર્ટ કેન્દ્ર', kn: 'ಚಾರ್ಟ್ ಕೇಂದ್ರ', mr: 'चार्ट संग्रह', mai: 'चार्ट केन्द्र' } },
      // Pandit CRM landing — 2026-06-04. Footer placement per
      // feedback_orphan_links_in_footer rule (no main-nav for a B2B
      // surface aimed at jyotishis, not general seekers).
      { href: '/for-pandits', label: { en: 'For Pandits', hi: 'पंडितों के लिए', ta: 'பண்டிதர்களுக்கு', bn: 'পণ্ডিতদের জন্য', te: 'పండితుల కోసం', gu: 'પંડિતો માટે', kn: 'ಪಂಡಿತರಿಗಾಗಿ', mr: 'पंडितांसाठी', mai: 'पण्डितक लेल' } },
    ],
  },
  {
    title: { en: 'Calendars', hi: 'कैलेंडर', ta: 'நாள்காட்டிகள்', bn: 'ক্যালেন্ডার', te: 'క్యాలెండర్లు', gu: 'કૅલેન્ડર', kn: 'ಕ್ಯಾಲೆಂಡರ್‌ಗಳು', mr: 'दिनदर्शिका', mai: 'कैलेंडर', sa: 'पञ्चाङ्गानि' },
    links: [
      { href: '/panchang', label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग', ta: 'தினசரி பஞ்சாங்கம்', bn: 'দৈনিক পঞ্জিকা', te: 'రోజువారీ పంచాంగం', gu: 'દૈનિક પંચાંગ', kn: 'ದೈನಂದಿನ ಪಂಚಾಂಗ', mr: 'रोजचे पंचांग', mai: 'रोजुक पंचांग' } },
      { href: '/calendar', label: { en: 'Festival Calendar', hi: 'त्योहार कैलेंडर', ta: 'பண்டிகை நாட்காட்டி', bn: 'উৎসব ক্যালেন্ডার', te: 'పండుగ క్యాలెండర్', gu: 'તહેવાર કૅલેન્ડર', kn: 'ಹಬ್ಬದ ಕ್ಯಾಲೆಂಡರ್', mr: 'सण दिनदर्शिका', mai: 'पाबनि कैलेण्डर' } },
      { href: '/ekadashi', label: { en: 'Ekadashi', hi: 'एकादशी', ta: 'ஏகாதசி', bn: 'একাদশী', te: 'ఏకాదశి', gu: 'એકાદશી', kn: 'ಏಕಾದಶಿ', mr: 'एकादशी तिथी', mai: 'एकादशी व्रत' } },
      { href: '/transits', label: { en: 'Transit Calendar', hi: 'गोचर कैलेंडर', ta: 'கோசார நாள்காட்டி', bn: 'গোচর ক্যালেন্ডার', te: 'గోచర క్యాలెండర్', gu: 'ગોચર કૅલેન્ડર', kn: 'ಗೋಚರ ಕ್ಯಾಲೆಂಡರ್', mr: 'गोचर दिनदर्शिका', mai: 'गोचर कैलेण्डर' } },
      { href: '/retrograde', label: { en: 'Retrograde Calendar', hi: 'वक्री कैलेंडर', ta: 'வக்கிர நாள்காட்டி', bn: 'বক্র ক্যালেন্ডার', te: 'వక్రి క్యాలెండర్', gu: 'વક્રી કૅલેન્ડર', kn: 'ವಕ್ರಿ ಕ್ಯಾಲೆಂಡರ್', mr: 'वक्री दिनदर्शिका', mai: 'वक्री कैलेण्डर' } },
      { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण कैलेंडर', ta: 'கிரகண நாள்காட்டி', bn: 'গ্রহণ ক্যালেন্ডার', te: 'గ్రహణ క్యాలెండర్', gu: 'ગ્રહણ કૅલેન્ડર', kn: 'ಗ್ರಹಣ ಕ್ಯಾಲೆಂಡರ್', mr: 'ग्रहण दिनदर्शिका', mai: 'ग्रहण कैलेण्डर' } },
      { href: '/events', label: { en: 'Celestial Events', hi: 'खगोलीय घटनाएँ', ta: 'வான் நிகழ்வுகள்', bn: 'জ্যোতির্বিদ্যা ঘটনা', te: 'ఖగోళ ఘటనలు', gu: 'ખગોળ ઘટનાઓ', kn: 'ಖಗೋಳ ಘಟನೆಗಳು', mr: 'खगोलीय घडामोडी', mai: 'खगोलीय घटना सब' } },
      { href: '/muhurta-ai', label: { en: 'Muhurat Calendar', hi: 'मुहूर्त कैलेंडर', ta: 'முகூர்த்த நாள்காட்டி', bn: 'মুহূর্ত ক্যালেন্ডার', te: 'ముహూర్త క్యాలెండర్', gu: 'મુહૂર્ત કૅલેન્ડર', kn: 'ಮುಹೂರ್ತ ಕ್ಯಾಲೆಂಡರ್', mr: 'मुहूर्त दिनदर्शिका', mai: 'मुहूर्त कैलेण्डर' } },
      { href: '/choghadiya', label: { en: 'Choghadiya', hi: 'चौघड़िया', ta: 'சோகடியா', bn: 'চৌঘড়িয়া', te: 'చౌఘడియా', gu: 'ચોઘડિયું', kn: 'ಚೌಘಡಿಯ', mr: 'चौघडिया', mai: 'चौघड़िया मुहूर्त' } },
      { href: '/gauri-panchang', label: { en: 'Gauri Panchang', hi: 'गौरी पंचांग', ta: 'கௌரி பஞ்சாங்கம்', bn: 'গৌরী পঞ্চাঙ্গ', te: 'గౌరి పంచాంగం', gu: 'ગૌરી પંચાંગ', kn: 'ಗೌರಿ ಪಂಚಾಂಗ', mr: 'गौरी पञ्चाङ्ग', mai: 'गौरी पंचांगक विवरण' } },
      { href: '/career-muhurta', label: { en: 'Career Muhurta', hi: 'करियर मुहूर्त', ta: 'தொழில் முகூர்த்தம்', bn: 'কেরিয়ার মুহূর্ত', te: 'వృత్తి ముహూర్తం', gu: 'કારકિર્દી મુહૂર્ત', kn: 'ವೃತ್ತಿ ಮುಹೂರ್ತ', mr: 'करिअर मुहूर्त', mai: 'करियर क मुहूर्त' } },
      { href: '/rahu-kaal', label: { en: 'Rahu Kaal', hi: 'राहु काल', ta: 'ராகு காலம்', bn: 'রাহু কাল', te: 'రాహు కాలం', gu: 'રાહુ કાળ', kn: 'ರಾಹು ಕಾಲ', mr: 'राहु काळ', mai: 'राहु कालक समय' } },
      { href: '/lunar-calendar', label: { en: 'Lunar Calendar', hi: 'चंद्र कैलेंडर', ta: 'சந்திர நாட்காட்டி', bn: 'চন্দ্র ক্যালেন্ডার', te: 'చంద్ర క్యాలెండర్', gu: 'ચંદ્ર કૅલેન્ડર', kn: 'ಚಂದ್ರ ಕ್ಯಾಲೆಂಡರ್', mr: 'चंद्र दिनदर्शिका', mai: 'चन्द्र कैलेण्डर' } },
      // Round 2 UI-2 / UI-4 — wire previously-orphaned vrat-calendar +
      // /daily content stream into the footer Calendars column. Lesson D
      // ("an unlinked page is a dead page").
      { href: '/vrat-calendar', label: { en: 'Vrat Calendar', hi: 'व्रत कैलेंडर', ta: 'விரத நாள்காட்டி', bn: 'ব্রত ক্যালেন্ডার', te: 'వ్రత క్యాలెండర్', gu: 'વ્રત કૅલેન્ડર', kn: 'ವ್ರತ ಕ್ಯಾಲೆಂಡರ್', mr: 'व्रत दिनदर्शिका', mai: 'व्रत कैलेण्डर' } },
      { href: '/daily', label: { en: 'Daily Articles', hi: 'दैनिक लेख', ta: 'தினசரி கட்டுரைகள்', bn: 'দৈনিক প্রবন্ধ', te: 'రోజువారీ వ్యాసాలు', gu: 'દૈનિક લેખો', kn: 'ದೈನಂದಿನ ಲೇಖನಗಳು', mr: 'रोजचे लेख', mai: 'रोजुक लेख' } },
      // Audit 2026-05-25 §B — rescue these orphan SEO landings from the dead-page bucket.
      { href: '/muhurat', label: { en: 'Muhurat Hub', hi: 'मुहूर्त केंद्र', ta: 'முகூர்த்த மையம்', bn: 'মুহূর্ত হাব', te: 'ముహూర్త కేంద్రం', gu: 'મુહૂર્ત કેન્દ્ર', kn: 'ಮುಹೂರ್ತ ಕೇಂದ್ರ', mr: 'मुहूर्त संकलन', mai: 'मुहूर्त केन्द्र' } },
      // 2026-06-01 §2.2 — /muhurta hub closes the 12-landing orphan
      // (annaprashan, wedding, vehicle-purchase, ...). Footer-only per
      // feedback_orphan_links_in_footer — do NOT add to main nav.
      { href: '/muhurta', label: { en: 'Muhurta Library', hi: 'मुहूर्त संग्रह', ta: 'முகூர்த்த நூலகம்', bn: 'মুহূর্ত গ্রন্থাগার', te: 'ముహూర్త గ్రంథాలయం', gu: 'મુહૂર્ત પુસ્તકાલય', kn: 'ಮುಹೂರ್ತ ಗ್ರಂಥಾಲಯ', mr: 'मुहूर्त ग्रंथालय', mai: 'मुहूर्त पुस्तकालय' } },
      { href: '/rituals', label: { en: 'Rituals', hi: 'अनुष्ठान', ta: 'சடங்குகள்', bn: 'অনুষ্ঠান', te: 'అనుష్ఠానాలు', gu: 'વિધિ', kn: 'ಆಚರಣೆಗಳು', mr: 'विधी', mai: 'अनुष्ठान आ विधि' } },
    ],
  },
  {
    title: { en: 'Learn', hi: 'सीखें', ta: 'கற்றுக்கொள்', bn: 'শিখুন', te: 'నేర్చుకోండి', gu: 'શીખો', kn: 'ಕಲಿಯಿರಿ', mr: 'शिका', mai: 'सीखू', sa: 'अध्ययनम्' },
    links: [
      { href: '/learn', label: { en: 'All Topics', hi: 'सभी विषय', ta: 'அனைத்து தலைப்புகள்', bn: 'সব বিষয়', te: 'అన్ని విషయాలు', gu: 'બધા વિષયો', kn: 'ಎಲ್ಲಾ ವಿಷಯಗಳು', mr: 'सर्व विषय', mai: 'सब विषय' } },
      // 2026-06-02 — capability catalog. Canonical surface we point LLMs
      // at (cited from /llms.txt). Footer placement keeps main nav clean
      // per feedback_orphan_links_in_footer.
      { href: '/features', label: { en: 'Features', hi: 'विशेषताएँ', ta: 'அம்சங்கள்', bn: 'বৈশিষ্ট্য', te: 'ఫీచర్లు', gu: 'વિશેષતાઓ', kn: 'ವೈಶಿಷ್ಟ್ಯಗಳು', mr: 'वैशिष्ट्ये', mai: 'विशेषता' } },
      { href: '/learn/grahas', label: { en: 'Grahas', hi: 'ग्रह', ta: 'கிரகங்கள்', bn: 'গ্রহ', te: 'గ్రహాలు', gu: 'ગ્રહો', kn: 'ಗ್ರಹಗಳು', mr: 'नवग्रह', mai: 'नवग्रहक परिचय' } },
      { href: '/learn/rashis', label: { en: 'Rashis', hi: 'राशियाँ', ta: 'ராசிகள்', bn: 'রাশি', te: 'రాశులు', gu: 'રાશિઓ', kn: 'ರಾಶಿಗಳು', mr: 'राशी', mai: 'राशि' } },
      { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', ta: 'நட்சத்திரங்கள்', bn: 'নক্ষত্র', te: 'నక్షత్రాలు', gu: 'નક્ષત્રો', kn: 'ನಕ್ಷತ್ರಗಳು', mr: 'नक्षत्रे', mai: '27 नक्षत्रक विवरण' } },
      { href: '/learn/tithis', label: { en: 'Tithis', hi: 'तिथियाँ', ta: 'திதிகள்', bn: 'তিথি', te: 'తిథులు', gu: 'તિથિઓ', kn: 'ತಿಥಿಗಳು', mr: 'तिथी', mai: 'तिथि' } },
      { href: '/learn/yoga', label: { en: 'Yogas', hi: 'योग', ta: 'யோகங்கள்', bn: 'যোগ', te: 'యోగాలు', gu: 'યોગો', kn: 'ಯೋಗಗಳು', mr: 'योग प्रकार', mai: 'योगक विवरण' } },
      { href: '/learn/karanas', label: { en: 'Karanas', hi: 'करण', ta: 'கரணங்கள்', bn: 'করণ', te: 'కరణాలు', gu: 'કરણો', kn: 'ಕರಣಗಳು', mr: 'करण प्रकार', mai: 'करणक विवरण' } },
      { href: '/learn/kundali', label: { en: 'Kundali Reading', hi: 'कुण्डली पठन', ta: 'குண்டலி படிப்பு', bn: 'কুণ্ডলি পাঠ', te: 'కుండలి అధ్యయనం', gu: 'કુંડળી વાંચન', kn: 'ಜಾತಕ ಓದುವಿಕೆ', mr: 'कुंडली वाचन', mai: 'कुण्डली पठन विधि' } },
      { href: '/glossary', label: { en: 'Glossary', hi: 'शब्दकोश', ta: 'சொற்பொருள்', bn: 'শব্দকোষ', te: 'పదకోశం', gu: 'શબ્દકોશ', kn: 'ಪದಕೋಶ', mr: 'शब्दसंग्रह', mai: 'शब्दावली' } },
      { href: '/accuracy', label: { en: 'Accuracy', hi: 'सटीकता', ta: 'துல்லியம்', bn: 'নির্ভুলতা', te: 'ఖచ్చితత్వం', gu: 'ચોકસાઈ', kn: 'ನಿಖರತೆ', mr: 'अचूकता', mai: 'सटीकता क मान' } },
      { href: '/videos', label: { en: 'Videos', hi: 'वीडियो', ta: 'காணொளிகள்', bn: 'ভিডিও', te: 'వీడియోలు', gu: 'વિડિઓ', kn: 'ವೀಡಿಯೊಗಳು', mr: 'व्हिडिओ', mai: 'वीडियो सङ्ग्रह' } },
    ],
  },
  {
    title: { en: 'Deep Dives', hi: 'गहन अध्ययन', ta: 'ஆழ்ந்த பகுப்பாய்வு', bn: 'গভীর বিশ্লেষণ', te: 'లోతైన విశ్లేషణ', gu: 'ઊંડો અભ્યાસ', kn: 'ಆಳವಾದ ವಿಶ್ಲೇಷಣೆ', mr: 'सखोल अभ्यास', mai: 'गहन अध्ययन', sa: 'गहनाध्ययनम्' },
    links: [
      { href: '/panchang/tithi', label: { en: 'Tithi', hi: 'तिथि', ta: 'திதி', bn: 'তিথি', te: 'తిథి', gu: 'તિથિ', kn: 'ತಿಥಿ', mr: 'तिथी', mai: 'तिथि विवरण' } },
      { href: '/panchang/nakshatra', label: { en: 'Nakshatra', hi: 'नक्षत्र', ta: 'நட்சத்திரம்', bn: 'নক্ষত্র', te: 'నక్షత్రం', gu: 'નક્ષત્ર', kn: 'ನಕ್ಷತ್ರ', mr: 'नक्षत्रे', mai: 'नक्षत्र विवरण' } },
      { href: '/panchang/yoga', label: { en: 'Yoga', hi: 'योग', ta: 'யோகம்', bn: 'যোগ', te: 'యోగం', gu: 'યોગ', kn: 'ಯೋಗ', mr: 'पंचांग योग', mai: 'योग विवरण' } },
      { href: '/panchang/karana', label: { en: 'Karana', hi: 'करण', ta: 'கரணம்', bn: 'করণ', te: 'కరణం', gu: 'કરણ', kn: 'ಕರಣ', mr: 'करण भेद', mai: 'करण विवरण' } },
      { href: '/panchang/muhurta', label: { en: 'Muhurta', hi: 'मुहूर्त', ta: 'முகூர்த்தம்', bn: 'মুহূর্ত', te: 'ముహూర్తం', gu: 'મુહૂર્ત', kn: 'ಮುಹೂರ್ತ', mr: 'मुहूर्त वेळ', mai: 'मुहूर्त समय' } },
      { href: '/panchang/rashi', label: { en: 'Rashi', hi: 'राशि', ta: 'ராசி', bn: 'রাশি', te: 'రాశి', gu: 'રાશિ', kn: 'ರಾಶಿ', mr: 'राशी', mai: 'राशि विवरण' } },
      { href: '/panchang/masa', label: { en: 'Masa', hi: 'मास', ta: 'மாதம்', bn: 'মাস', te: 'మాసం', gu: 'માસ', kn: 'ಮಾಸ', mr: 'मास महिना', mai: 'मास परिचय' } },
      { href: '/panchang/grahan', label: { en: 'Grahan', hi: 'ग्रहण', ta: 'கிரகணம்', bn: 'গ্রহণ', te: 'గ్రహణం', gu: 'ગ્રહણ', kn: 'ಗ್ರಹಣ', mr: 'ग्रहण काळ', mai: 'ग्रहण विवरण' } },
      { href: '/panchang/samvatsara', label: { en: 'Samvatsara', hi: 'संवत्सर', ta: 'சம்வத்சரம்', bn: 'সংবৎসর', te: 'సంవత్సరం', gu: 'સંવત્સર', kn: 'ಸಂವತ್ಸರ', mr: 'संवत्सर चक्र', mai: 'संवत्सर परिचय' } },
    ],
  },
];

// Route → footer-variant classifier extracted to ./Footer.routes.ts for
// unit-testability — see that file for the design notes on chrome-density
// mitigation (Vector 4 of the May 31 demotion follow-ups).

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function t(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || '';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Footer() {
  const locale = useLocale();
  const pathname = usePathname() ?? '/';
  const variant = classifyPath(pathname);
  const visibleSectionIndices = sectionsForVariant(variant);
  const visibleSections = visibleSectionIndices.map(i => SECTIONS[i]);
  // Compare strip only on the genuinely-comparing surfaces — home, /about,
  // and the /vs/* pages themselves. Elsewhere it was redundant chrome.
  const showCompareStrip = variant === 'all';
  const gridCols = visibleSections.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2';

  return (
    <footer className="relative z-10 mt-16 border-t border-gold-primary/15 bg-gradient-to-b from-[#0d1130] to-[#080b1e]">
      {/* Subtle top texture line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Link grid — full 4 columns on hubs, 2 topical columns elsewhere */}
        <div className={`grid grid-cols-2 ${gridCols} gap-8 mb-10`}>
          {visibleSections.map((section) => (
            <div key={t(section.title, 'en')}>
              <h3 className="text-gold-primary text-xs font-bold uppercase tracking-widest mb-4">
                {t(section.title, locale)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-xs hover:text-gold-light transition-colors py-1 inline-block"
                    >
                      {t(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Compare strip — kept only on home / /about / /vs/* pages where
            the comparison is contextually relevant. Previously rendered
            sitewide as duplicate chrome. */}
        {showCompareStrip && (
          <div className="border-t border-gold-primary/10 pt-5 pb-5 mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="text-gold-dark uppercase tracking-widest font-semibold">
              {t({ en: 'Compare', hi: 'तुलना', sa: 'तुलना', ta: 'ஒப்பீடு', bn: 'তুলনা', te: 'పోలిక', gu: 'સરખામણી', kn: 'ಹೋಲಿಕೆ', mr: 'तुलना', mai: 'तुलना' }, locale)}:
            </span>
            {COMPETITORS.map(c => (
              <Link
                key={c.slug}
                href={`/vs/${c.slug}`}
                className="text-text-secondary hover:text-gold-light transition-colors py-1 inline-block"
              >
                {isDevanagariLocale(locale) ? c.hiName : c.displayName}
              </Link>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-gold-primary/12 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gold-primary text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                Dekho Panchang
              </span>
              <span className="text-text-secondary text-xs">&copy; {new Date().getFullYear()}</span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a href="https://x.com/dekhopanchang" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)" className="text-text-secondary hover:text-gold-light transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.youtube.com/@DekhoPanchang" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" className="text-text-secondary hover:text-[#ff0000] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.instagram.com/dekhopanchang/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="text-text-secondary hover:text-[#e4405f] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Bottom-bar links. The first row (essentials) renders on every
              page — legal pages need to be sitewide-reachable. The second
              row (extras: Festivals, Stories, Embed) is contextual chrome
              that previously inflated per-page literal-text duplication;
              rendered only on the high-authority hub variant where the
              extra link equity actually buys something. /widget/Embed
              stays in the variant-gated set per UI-3 (single entry-point
              for the embed-demo redirect target). */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
            <Link href="/about" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'About', hi: 'परिचय', ta: 'பற்றி', bn: 'সম্পর্কে', te: 'గురించి', gu: 'વિશે', kn: 'ಕುರಿತು', mr: 'परिचय', mai: 'परिचय', sa: 'परिचयः' }, locale)}
            </Link>
            {/* Citation-friendly label per Jun 2026 citation-gravity work.
                URL kept stable at /about/methodology so existing inbound
                links + JSON-LD don't break. Devanagari cluster (hi/mai/mr)
                gets a closer rendering of "Calculation Standards";
                other locales retain their accurate "methodology" gloss. */}
            <Link href="/about/methodology" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Calculation Standards', hi: 'गणना मानक', ta: 'முறையியல்', bn: 'পদ্ধতি', te: 'పద్ధతి', gu: 'પદ્ધતિ', kn: 'ವಿಧಾನ', mr: 'गणन मानके', mai: 'गणना मानक', sa: 'गणनप्रमाणानि' }, locale)}
            </Link>
            <Link href="/privacy" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Privacy', hi: 'गोपनीयता', ta: 'தனியுரிமை', bn: 'গোপনীয়তা', te: 'గోప్యత', gu: 'ગોપનીયતા', kn: 'ಗೌಪ್ಯತೆ', mr: 'गोपनीयता', mai: 'गोपनीयता', sa: 'गोपनीयता' }, locale)}
            </Link>
            <Link href="/terms" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Terms', hi: 'शर्तें', ta: 'விதிமுறைகள்', bn: 'শর্তাবলী', te: 'నిబంధనలు', gu: 'શરતો', kn: 'ನಿಯಮಗಳು', mr: 'अटी', mai: 'शर्तें', sa: 'नियमाः' }, locale)}
            </Link>
            <Link href="/refunds" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Refunds', hi: 'धन वापसी', ta: 'பணம் திரும்ப', bn: 'ফেরত', te: 'వాపసు', gu: 'રિફંડ', kn: 'ಮರುಪಾವತಿ', mr: 'परतावा', mai: 'धन वापसी' }, locale)}
            </Link>
            <Link href="/pricing" className="hover:text-gold-light transition-colors py-1 inline-block">
              {t({ en: 'Pricing', hi: 'मूल्य', ta: 'விலை', bn: 'মূল্য', te: 'ధర', gu: 'કિંમત', kn: 'ಬೆಲೆ', mr: 'किंमत', mai: 'मूल्य' }, locale)}
            </Link>
            {variant === 'all' && (
              <>
                <Link href="/about#contact" className="hover:text-gold-light transition-colors py-1 inline-block">
                  {t({ en: 'Contact', hi: 'संपर्क', ta: 'தொடர்பு', bn: 'যোগাযোগ', te: 'సంప్రదించండి', gu: 'સંપર્ક', kn: 'ಸಂಪರ್ಕ', mr: 'संपर्क', mai: 'संपर्क', sa: 'सम्पर्कः' }, locale)}
                </Link>
                <Link href="/festivals" className="hover:text-gold-light transition-colors py-1 inline-block">
                  {t({ en: 'Festivals', hi: 'त्योहार', ta: 'பண்டிகைகள்', bn: 'উৎসব', te: 'పండుగలు', gu: 'તહેવારો', kn: 'ಹಬ್ಬಗಳು', mr: 'सण', mai: 'पाबनि' }, locale)}
                </Link>
                <Link href="/stories" className="hover:text-gold-light transition-colors py-1 inline-block">
                  {t({ en: 'Stories', hi: 'कथाएँ', ta: 'கதைகள்', bn: 'কথা', te: 'కథలు', gu: 'કથાઓ', kn: 'ಕಥೆಗಳು', mr: 'कथा', mai: 'कथा' }, locale)}
                </Link>
                <Link href="/widget" className="hover:text-gold-light transition-colors py-1 inline-block">
                  {t({ en: 'Embed', hi: 'एम्बेड', ta: 'உட்பொதி', bn: 'এমবেড', te: 'ఎంబెడ్', gu: 'એમ્બેડ', kn: 'ಎಂಬೆಡ್', mai: 'एम्बेड' }, locale)}
                </Link>
              </>
            )}
          </div>

          <p className="text-gold-dark/60 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            ॐ ज्योतिषां ज्योतिः
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { tl } from '@/lib/utils/trilingual';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crosshair, Star, HeartPulse, Baby, Compass, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/sphutas.json';

/* ── Inline data arrays (not in JSON) ───────────────────────────── */
const YOGI_DETAILS = [
  { label: { en: 'Yogi Planet', hi: 'योगी ग्रह', sa: 'योगी ग्रह', mai: 'योगी ग्रह', mr: 'योगी ग्रह', ta: 'யோகி கிரகம்', te: 'యోగి గ్రహం', bn: 'যোগী গ্রহ', kn: 'ಯೋಗಿ ಗ್ರಹ', gu: 'યોગી ગ્રહ' }, desc: { en: 'The planet ruling the Nakshatra where the Yogi Point falls. This planet becomes a powerful benefic for the native — its dasha/antardasha brings fortune, recognition, and ease.', hi: 'नक्षत्र का स्वामी जहाँ योगी बिन्दु पड़ता है। यह ग्रह जातक के लिए शक्तिशाली शुभ बन जाता है — इसकी दशा/अन्तर्दशा भाग्य, मान्यता और सुख लाती है।', sa: 'नक्षत्र का स्वामी जहाँ योगी बिन्दु पड़ता है। यह ग्रह जातक के लिए शक्तिशाली शुभ बन जाता है — इसकी दशा/अन्तर्दशा भाग्य, मान्यता और सुख लाती है।', mai: 'नक्षत्र का स्वामी जहाँ योगी बिन्दु पड़ता है। यह ग्रह जातक के लिए शक्तिशाली शुभ बन जाता है — इसकी दशा/अन्तर्दशा भाग्य, मान्यता और सुख लाती है।', mr: 'नक्षत्र का स्वामी जहाँ योगी बिन्दु पड़ता है। यह ग्रह जातक के लिए शक्तिशाली शुभ बन जाता है — इसकी दशा/अन्तर्दशा भाग्य, मान्यता और सुख लाती है।', ta: 'The planet ruling the Nakshatra where the Yogi Point falls. This planet becomes a powerful benefic for the native — its dasha/antardasha brings fortune, recognition, and ease.', te: 'The planet ruling the Nakshatra where the Yogi Point falls. This planet becomes a powerful benefic for the native — its dasha/antardasha brings fortune, recognition, and ease.', bn: 'The planet ruling the Nakshatra where the Yogi Point falls. This planet becomes a powerful benefic for the native — its dasha/antardasha brings fortune, recognition, and ease.', kn: 'The planet ruling the Nakshatra where the Yogi Point falls. This planet becomes a powerful benefic for the native — its dasha/antardasha brings fortune, recognition, and ease.', gu: 'The planet ruling the Nakshatra where the Yogi Point falls. This planet becomes a powerful benefic for the native — its dasha/antardasha brings fortune, recognition, and ease.' } },
  { label: { en: 'Duplicate Yogi', hi: 'अनुयोगी', sa: 'अनुयोगी', mai: 'अनुयोगी', mr: 'अनुयोगी', ta: 'நகல் யோகி', te: 'డూప్లికేట్ యోగి', bn: 'ডুপ্লিকেট যোগী', kn: 'ಡ್ಯೂಪ್ಲಿಕೇಟ್ ಯೋಗಿ', gu: 'ડુપ્લિકેટ યોગી' }, desc: { en: 'The lord of the sign where the Yogi Point falls. A secondary benefic — helpful when conjunct or aspecting the Yogi Planet. Its periods bring mild but steady support.', hi: 'राशि का स्वामी जहाँ योगी बिन्दु पड़ता है। एक द्वितीयक शुभ — योगी ग्रह के साथ युति या दृष्टि में सहायक। इसकी अवधि सौम्य परन्तु स्थिर सहायता लाती है।', sa: 'राशि का स्वामी जहाँ योगी बिन्दु पड़ता है। एक द्वितीयक शुभ — योगी ग्रह के साथ युति या दृष्टि में सहायक। इसकी अवधि सौम्य परन्तु स्थिर सहायता लाती है।', mai: 'राशि का स्वामी जहाँ योगी बिन्दु पड़ता है। एक द्वितीयक शुभ — योगी ग्रह के साथ युति या दृष्टि में सहायक। इसकी अवधि सौम्य परन्तु स्थिर सहायता लाती है।', mr: 'राशि का स्वामी जहाँ योगी बिन्दु पड़ता है। एक द्वितीयक शुभ — योगी ग्रह के साथ युति या दृष्टि में सहायक। इसकी अवधि सौम्य परन्तु स्थिर सहायता लाती है।', ta: 'The lord of the sign where the Yogi Point falls. A secondary benefic — helpful when conjunct or aspecting the Yogi Planet. Its periods bring mild but steady support.', te: 'The lord of the sign where the Yogi Point falls. A secondary benefic — helpful when conjunct or aspecting the Yogi Planet. Its periods bring mild but steady support.', bn: 'The lord of the sign where the Yogi Point falls. A secondary benefic — helpful when conjunct or aspecting the Yogi Planet. Its periods bring mild but steady support.', kn: 'The lord of the sign where the Yogi Point falls. A secondary benefic — helpful when conjunct or aspecting the Yogi Planet. Its periods bring mild but steady support.', gu: 'The lord of the sign where the Yogi Point falls. A secondary benefic — helpful when conjunct or aspecting the Yogi Planet. Its periods bring mild but steady support.' } },
];

const AVAYOGI_DETAILS = [
  { label: { en: 'Avayogi Planet', hi: 'अवयोगी ग्रह', sa: 'अवयोगी ग्रह', mai: 'अवयोगी ग्रह', mr: 'अवयोगी ग्रह', ta: 'அவயோகி கிரகம்', te: 'అవయోగి గ్రహం', bn: 'অবযোগী গ্রহ', kn: 'ಅವಯೋಗಿ ಗ್ರಹ', gu: 'અવયોગી ગ્રહ' }, desc: { en: 'The planet ruling the Nakshatra where the Avayogi Point falls. This planet acts as a functional malefic — its dasha brings obstacles, losses, and health issues.', hi: 'नक्षत्र का स्वामी जहाँ अवयोगी बिन्दु पड़ता है। यह ग्रह कार्यात्मक पापी के रूप में कार्य करता है — इसकी दशा बाधाएं, हानि और स्वास्थ्य समस्याएं लाती है।', sa: 'नक्षत्र का स्वामी जहाँ अवयोगी बिन्दु पड़ता है। यह ग्रह कार्यात्मक पापी के रूप में कार्य करता है — इसकी दशा बाधाएं, हानि और स्वास्थ्य समस्याएं लाती है।', mai: 'नक्षत्र का स्वामी जहाँ अवयोगी बिन्दु पड़ता है। यह ग्रह कार्यात्मक पापी के रूप में कार्य करता है — इसकी दशा बाधाएं, हानि और स्वास्थ्य समस्याएं लाती है।', mr: 'नक्षत्र का स्वामी जहाँ अवयोगी बिन्दु पड़ता है। यह ग्रह कार्यात्मक पापी के रूप में कार्य करता है — इसकी दशा बाधाएं, हानि और स्वास्थ्य समस्याएं लाती है।', ta: 'The planet ruling the Nakshatra where the Avayogi Point falls. This planet acts as a functional malefic — its dasha brings obstacles, losses, and health issues.', te: 'The planet ruling the Nakshatra where the Avayogi Point falls. This planet acts as a functional malefic — its dasha brings obstacles, losses, and health issues.', bn: 'The planet ruling the Nakshatra where the Avayogi Point falls. This planet acts as a functional malefic — its dasha brings obstacles, losses, and health issues.', kn: 'The planet ruling the Nakshatra where the Avayogi Point falls. This planet acts as a functional malefic — its dasha brings obstacles, losses, and health issues.', gu: 'The planet ruling the Nakshatra where the Avayogi Point falls. This planet acts as a functional malefic — its dasha brings obstacles, losses, and health issues.' } },
];

const YOGI_TRANSITS = [
  { trigger: { en: 'Jupiter transits Yogi Nakshatra', hi: 'गुरु योगी नक्षत्र में गोचर', sa: 'गुरु योगी नक्षत्र में गोचर', mai: 'गुरु योगी नक्षत्र में गोचर', mr: 'गुरु योगी नक्षत्र में गोचर', ta: 'Jupiter transits Yogi Nakshatra', te: 'Jupiter transits Yogi Nakshatra', bn: 'Jupiter transits Yogi Nakshatra', kn: 'Jupiter transits Yogi Nakshatra', gu: 'Jupiter transits Yogi Nakshatra' }, effect: { en: 'Peak luck window. When Jupiter crosses the Yogi Nakshatra, the native\'s fortune peaks for ~13 months.', hi: 'चरम भाग्य काल। जब गुरु योगी नक्षत्र पार करता है, जातक का भाग्य ~13 माह चरम पर।' }, color: 'text-emerald-400' },
  { trigger: { en: 'Saturn transits Avayogi Nakshatra', hi: 'शनि अवयोगी नक्षत्र में गोचर', sa: 'शनि अवयोगी नक्षत्र में गोचर', mai: 'शनि अवयोगी नक्षत्र में गोचर', mr: 'शनि अवयोगी नक्षत्र में गोचर', ta: 'Saturn transits Avayogi Nakshatra', te: 'Saturn transits Avayogi Nakshatra', bn: 'Saturn transits Avayogi Nakshatra', kn: 'Saturn transits Avayogi Nakshatra', gu: 'Saturn transits Avayogi Nakshatra' }, effect: { en: 'Difficult 2.5-year period. Saturn sitting on the Avayogi point amplifies its obstructive effect.', hi: 'कठिन 2.5 वर्ष। शनि का अवयोगी बिन्दु पर बैठना इसके बाधक प्रभाव को बढ़ाता है।', sa: 'कठिन 2.5 वर्ष। शनि का अवयोगी बिन्दु पर बैठना इसके बाधक प्रभाव को बढ़ाता है।', mai: 'कठिन 2.5 वर्ष। शनि का अवयोगी बिन्दु पर बैठना इसके बाधक प्रभाव को बढ़ाता है।', mr: 'कठिन 2.5 वर्ष। शनि का अवयोगी बिन्दु पर बैठना इसके बाधक प्रभाव को बढ़ाता है।', ta: 'Difficult 2.5-year period. Saturn sitting on the Avayogi point amplifies its obstructive effect.', te: 'Difficult 2.5-year period. Saturn sitting on the Avayogi point amplifies its obstructive effect.', bn: 'Difficult 2.5-year period. Saturn sitting on the Avayogi point amplifies its obstructive effect.', kn: 'Difficult 2.5-year period. Saturn sitting on the Avayogi point amplifies its obstructive effect.', gu: 'Difficult 2.5-year period. Saturn sitting on the Avayogi point amplifies its obstructive effect.' }, color: 'text-red-400' },
  { trigger: { en: 'Dasha of Yogi Planet', hi: 'योगी ग्रह की दशा', sa: 'योगी ग्रह की दशा', mai: 'योगी ग्रह की दशा', mr: 'योगी ग्रह की दशा', ta: 'Dasha of Yogi Planet', te: 'Dasha of Yogi Planet', bn: 'Dasha of Yogi Planet', kn: 'Dasha of Yogi Planet', gu: 'Dasha of Yogi Planet' }, effect: { en: 'The most prosperous dasha of the entire Vimshottari cycle. Career, wealth, health all peak.', hi: 'सम्पूर्ण विंशोत्तरी चक्र की सबसे समृद्ध दशा। करियर, धन, स्वास्थ्य सब चरम पर।', sa: 'सम्पूर्ण विंशोत्तरी चक्र की सबसे समृद्ध दशा। करियर, धन, स्वास्थ्य सब चरम पर।', mai: 'सम्पूर्ण विंशोत्तरी चक्र की सबसे समृद्ध दशा। करियर, धन, स्वास्थ्य सब चरम पर।', mr: 'सम्पूर्ण विंशोत्तरी चक्र की सबसे समृद्ध दशा। करियर, धन, स्वास्थ्य सब चरम पर।', ta: 'The most prosperous dasha of the entire Vimshottari cycle. Career, wealth, health all peak.', te: 'The most prosperous dasha of the entire Vimshottari cycle. Career, wealth, health all peak.', bn: 'The most prosperous dasha of the entire Vimshottari cycle. Career, wealth, health all peak.', kn: 'The most prosperous dasha of the entire Vimshottari cycle. Career, wealth, health all peak.', gu: 'The most prosperous dasha of the entire Vimshottari cycle. Career, wealth, health all peak.' }, color: 'text-amber-400' },
  { trigger: { en: 'Dasha of Avayogi Planet', hi: 'अवयोगी ग्रह की दशा', sa: 'अवयोगी ग्रह की दशा', mai: 'अवयोगी ग्रह की दशा', mr: 'अवयोगी ग्रह की दशा', ta: 'Dasha of Avayogi Planet', te: 'Dasha of Avayogi Planet', bn: 'Dasha of Avayogi Planet', kn: 'Dasha of Avayogi Planet', gu: 'Dasha of Avayogi Planet' }, effect: { en: 'The most challenging dasha. Requires remedies, patience, and awareness of the weak period.', hi: 'सबसे चुनौतीपूर्ण दशा। उपचार, धैर्य और कमजोर काल की जागरूकता आवश्यक।', sa: 'सबसे चुनौतीपूर्ण दशा। उपचार, धैर्य और कमजोर काल की जागरूकता आवश्यक।', mai: 'सबसे चुनौतीपूर्ण दशा। उपचार, धैर्य और कमजोर काल की जागरूकता आवश्यक।', mr: 'सबसे चुनौतीपूर्ण दशा। उपचार, धैर्य और कमजोर काल की जागरूकता आवश्यक।', ta: 'The most challenging dasha. Requires remedies, patience, and awareness of the weak period.', te: 'The most challenging dasha. Requires remedies, patience, and awareness of the weak period.', bn: 'The most challenging dasha. Requires remedies, patience, and awareness of the weak period.', kn: 'The most challenging dasha. Requires remedies, patience, and awareness of the weak period.', gu: 'The most challenging dasha. Requires remedies, patience, and awareness of the weak period.' }, color: 'text-violet-400' },
];

const CONSTITUTIONAL_SPHUTAS = [
  { name: { en: 'Prana Sphuta (Vitality)', hi: 'प्राण स्फुट (जीवनशक्ति)', sa: 'प्राण स्फुट (जीवनशक्ति)', mai: 'प्राण स्फुट (जीवनशक्ति)', mr: 'प्राण स्फुट (जीवनशक्ति)', ta: 'பிராண ஸ்புடம் (உயிர்)', te: 'ప్రాణ స్ఫుటం (ప్రాణశక్తి)', bn: 'প্রাণ স্ফুট (প্রাণশক্তি)', kn: 'ಪ್ರಾಣ ಸ್ಫುಟ (ಪ್ರಾಣಶಕ್ತಿ)', gu: 'પ્રાણ સ્ફુટ (પ્રાણશક્તિ)' }, formula: { en: 'Lagna° + Sun° + Moon°', hi: 'लग्न° + सूर्य° + चन्द्र°', sa: 'लग्न° + सूर्य° + चन्द्र°', mai: 'लग्न° + सूर्य° + चन्द्र°', mr: 'लग्न° + सूर्य° + चन्द्र°', ta: 'Lagna° + Sun° + Moon°', te: 'Lagna° + Sun° + Moon°', bn: 'Lagna° + Sun° + Moon°', kn: 'Lagna° + Sun° + Moon°', gu: 'Lagna° + Sun° + Moon°' }, interpretation: { en: 'Your core life force. The Nakshatra it falls in reveals your constitutional vitality — which planet\'s energy sustains your physical body. A strong Prana Sphuta in a benefic Nakshatra grants robust health and recovery power.', hi: 'आपकी मूल जीवन शक्ति। जिस नक्षत्र में यह पड़ता है वह आपकी शारीरिक जीवनशक्ति प्रकट करता है। शुभ नक्षत्र में मजबूत प्राण स्फुट सशक्त स्वास्थ्य और पुनर्प्राप्ति शक्ति प्रदान करता है।' }, color: 'text-amber-400' },
  { name: { en: 'Deha Sphuta (Body)', hi: 'देह स्फुट (शरीर)', sa: 'देह स्फुट (शरीर)', mai: 'देह स्फुट (शरीर)', mr: 'देह स्फुट (शरीर)', ta: 'தேக ஸ்புடம் (உடல்)', te: 'దేహ స్ఫుటం (శరీరం)', bn: 'দেহ স্ফুট (শরীর)', kn: 'ದೇಹ ಸ್ಫುಟ (ಶರೀರ)', gu: 'દેહ સ્ફુટ (શરીર)' }, formula: { en: 'Lagna° + Moon° + Gulika°', hi: 'लग्न° + चन्द्र° + गुलिक°', sa: 'लग्न° + चन्द्र° + गुलिक°', mai: 'लग्न° + चन्द्र° + गुलिक°', mr: 'लग्न° + चन्द्र° + गुलिक°', ta: 'Lagna° + Moon° + Gulika°', te: 'Lagna° + Moon° + Gulika°', bn: 'Lagna° + Moon° + Gulika°', kn: 'Lagna° + Moon° + Gulika°', gu: 'Lagna° + Moon° + Gulika°' }, interpretation: { en: 'Your physical constitution and vulnerability pattern. Indicates which body systems are inherently strong or weak. Medical astrologers use this to predict disease timing.', hi: 'आपकी शारीरिक संरचना और कमजोरी पैटर्न। बताता है कि कौन सी शरीर प्रणालियां स्वाभाविक रूप से मजबूत या कमजोर हैं।', sa: 'आपकी शारीरिक संरचना और कमजोरी पैटर्न। बताता है कि कौन सी शरीर प्रणालियां स्वाभाविक रूप से मजबूत या कमजोर हैं।', mai: 'आपकी शारीरिक संरचना और कमजोरी पैटर्न। बताता है कि कौन सी शरीर प्रणालियां स्वाभाविक रूप से मजबूत या कमजोर हैं।', mr: 'आपकी शारीरिक संरचना और कमजोरी पैटर्न। बताता है कि कौन सी शरीर प्रणालियां स्वाभाविक रूप से मजबूत या कमजोर हैं।', ta: 'Your physical constitution and vulnerability pattern. Indicates which body systems are inherently strong or weak. Medical astrologers use this to predict disease timing.', te: 'Your physical constitution and vulnerability pattern. Indicates which body systems are inherently strong or weak. Medical astrologers use this to predict disease timing.', bn: 'Your physical constitution and vulnerability pattern. Indicates which body systems are inherently strong or weak. Medical astrologers use this to predict disease timing.', kn: 'Your physical constitution and vulnerability pattern. Indicates which body systems are inherently strong or weak. Medical astrologers use this to predict disease timing.', gu: 'Your physical constitution and vulnerability pattern. Indicates which body systems are inherently strong or weak. Medical astrologers use this to predict disease timing.' }, color: 'text-blue-400' },
  { name: { en: 'Mrityu Sphuta (Mortality)', hi: 'मृत्यु स्फुट (मृत्यु)', sa: 'मृत्यु स्फुट (मृत्यु)', mai: 'मृत्यु स्फुट (मृत्यु)', mr: 'मृत्यु स्फुट (मृत्यु)', ta: 'ம்ருத்யு ஸ்புடம் (மரணம்)', te: 'మృత్యు స్ఫుటం (మరణం)', bn: 'মৃত্যু স্ফুট (মৃত্যু)', kn: 'ಮೃತ್ಯು ಸ್ಫುಟ (ಮರಣ)', gu: 'મૃત્યુ સ્ફુટ (મૃત્યુ)' }, formula: { en: 'Lagna° + Moon° + Mandi°', hi: 'लग्न° + चन्द्र° + मान्दि°', sa: 'लग्न° + चन्द्र° + मान्दि°', mai: 'लग्न° + चन्द्र° + मान्दि°', mr: 'लग्न° + चन्द्र° + मान्दि°', ta: 'Lagna° + Moon° + Mandi°', te: 'Lagna° + Moon° + Mandi°', bn: 'Lagna° + Moon° + Mandi°', kn: 'Lagna° + Moon° + Mandi°', gu: 'Lagna° + Moon° + Mandi°' }, interpretation: { en: 'The sensitive degree related to health crises and life-threatening episodes. When transiting malefics (Saturn, Rahu) cross this degree, the native faces health challenges. NOT a death prediction — a vulnerability marker.', hi: 'स्वास्थ्य संकटों और जीवन-खतरनाक प्रसंगों से सम्बन्धित संवेदनशील अंश। जब गोचरी पापी ग्रह इस अंश को पार करें, जातक स्वास्थ्य चुनौतियों का सामना करता है।', sa: 'स्वास्थ्य संकटों और जीवन-खतरनाक प्रसंगों से सम्बन्धित संवेदनशील अंश। जब गोचरी पापी ग्रह इस अंश को पार करें, जातक स्वास्थ्य चुनौतियों का सामना करता है।', mai: 'स्वास्थ्य संकटों और जीवन-खतरनाक प्रसंगों से सम्बन्धित संवेदनशील अंश। जब गोचरी पापी ग्रह इस अंश को पार करें, जातक स्वास्थ्य चुनौतियों का सामना करता है।', mr: 'स्वास्थ्य संकटों और जीवन-खतरनाक प्रसंगों से सम्बन्धित संवेदनशील अंश। जब गोचरी पापी ग्रह इस अंश को पार करें, जातक स्वास्थ्य चुनौतियों का सामना करता है।', ta: 'The sensitive degree related to health crises and life-threatening episodes. When transiting malefics (Saturn, Rahu) cross this degree, the native faces health challenges. NOT a death prediction — a vulnerability marker.', te: 'The sensitive degree related to health crises and life-threatening episodes. When transiting malefics (Saturn, Rahu) cross this degree, the native faces health challenges. NOT a death prediction — a vulnerability marker.', bn: 'The sensitive degree related to health crises and life-threatening episodes. When transiting malefics (Saturn, Rahu) cross this degree, the native faces health challenges. NOT a death prediction — a vulnerability marker.', kn: 'The sensitive degree related to health crises and life-threatening episodes. When transiting malefics (Saturn, Rahu) cross this degree, the native faces health challenges. NOT a death prediction — a vulnerability marker.', gu: 'The sensitive degree related to health crises and life-threatening episodes. When transiting malefics (Saturn, Rahu) cross this degree, the native faces health challenges. NOT a death prediction — a vulnerability marker.' }, color: 'text-red-400' },
  { name: { en: 'Tri Sphuta (Triple Point)', hi: 'त्रि स्फुट (तिगुना बिन्दु)', sa: 'त्रि स्फुट (तिगुना बिन्दु)', mai: 'त्रि स्फुट (तिगुना बिन्दु)', mr: 'त्रि स्फुट (तिगुना बिन्दु)', ta: 'த்ரி ஸ்புடம் (முப்புள்ளி)', te: 'త్రి స్ఫుటం (త్రిబిందువు)', bn: 'ত্রি স্ফুট (ত্রিবিন্দু)', kn: 'ತ್ರಿ ಸ್ಫುಟ (ತ್ರಿಬಿಂದು)', gu: 'ત્રિ સ્ફુટ (ત્રિબિંદુ)' }, formula: { en: 'Prana° + Deha° + Mrityu°', hi: 'प्राण° + देह° + मृत्यु°', sa: 'प्राण° + देह° + मृत्यु°', mai: 'प्राण° + देह° + मृत्यु°', mr: 'प्राण° + देह° + मृत्यु°', ta: 'Prana° + Deha° + Mrityu°', te: 'Prana° + Deha° + Mrityu°', bn: 'Prana° + Deha° + Mrityu°', kn: 'Prana° + Deha° + Mrityu°', gu: 'Prana° + Deha° + Mrityu°' }, interpretation: { en: 'The grand synthesis of all three constitutional points. A master indicator of overall physical resilience and life force. In a benefic Nakshatra with benefic planetary ruler = extraordinary constitution.', hi: 'तीनों संवैधानिक बिन्दुओं का महासंश्लेषण। समग्र शारीरिक लचीलेपन और जीवन शक्ति का मुख्य सूचक। शुभ नक्षत्र में शुभ ग्रह स्वामी = असाधारण संविधान।', sa: 'तीनों संवैधानिक बिन्दुओं का महासंश्लेषण। समग्र शारीरिक लचीलेपन और जीवन शक्ति का मुख्य सूचक। शुभ नक्षत्र में शुभ ग्रह स्वामी = असाधारण संविधान।', mai: 'तीनों संवैधानिक बिन्दुओं का महासंश्लेषण। समग्र शारीरिक लचीलेपन और जीवन शक्ति का मुख्य सूचक। शुभ नक्षत्र में शुभ ग्रह स्वामी = असाधारण संविधान।', mr: 'तीनों संवैधानिक बिन्दुओं का महासंश्लेषण। समग्र शारीरिक लचीलेपन और जीवन शक्ति का मुख्य सूचक। शुभ नक्षत्र में शुभ ग्रह स्वामी = असाधारण संविधान।', ta: 'The grand synthesis of all three constitutional points. A master indicator of overall physical resilience and life force. In a benefic Nakshatra with benefic planetary ruler = extraordinary constitution.', te: 'The grand synthesis of all three constitutional points. A master indicator of overall physical resilience and life force. In a benefic Nakshatra with benefic planetary ruler = extraordinary constitution.', bn: 'The grand synthesis of all three constitutional points. A master indicator of overall physical resilience and life force. In a benefic Nakshatra with benefic planetary ruler = extraordinary constitution.', kn: 'The grand synthesis of all three constitutional points. A master indicator of overall physical resilience and life force. In a benefic Nakshatra with benefic planetary ruler = extraordinary constitution.', gu: 'The grand synthesis of all three constitutional points. A master indicator of overall physical resilience and life force. In a benefic Nakshatra with benefic planetary ruler = extraordinary constitution.' }, color: 'text-violet-400' },
];

const FERTILITY_SPHUTAS = [
  { name: { en: 'Bija Sphuta (Seed — Male)', hi: 'बीज स्फुट (पुरुष)', sa: 'बीज स्फुट (पुरुष)', mai: 'बीज स्फुट (पुरुष)', mr: 'बीज स्फुट (पुरुष)', ta: 'பீஜ ஸ்புடம் (விதை — ஆண்)', te: 'బీజ స్ఫుటం (బీజం — పురుష)', bn: 'বীজ স্ফুট (বীজ — পুরুষ)', kn: 'ಬೀಜ ಸ್ಫುಟ (ಬೀಜ — ಪುರುಷ)', gu: 'બીજ સ્ફુટ (બીજ — પુરુષ)' }, formula: { en: 'Sun° + Venus° + Jupiter°', hi: 'सूर्य° + शुक्र° + गुरु°', sa: 'सूर्य° + शुक्र° + गुरु°', mai: 'सूर्य° + शुक्र° + गुरु°', mr: 'सूर्य° + शुक्र° + गुरु°', ta: 'Sun° + Venus° + Jupiter°', te: 'Sun° + Venus° + Jupiter°', bn: 'Sun° + Venus° + Jupiter°', kn: 'Sun° + Venus° + Jupiter°', gu: 'Sun° + Venus° + Jupiter°' }, interpretation: { en: 'Male fertility indicator. Odd sign + benefic Nakshatra = strong male fertility. Even sign + malefic Nakshatra = potential difficulty requiring medical support.', hi: 'पुरुष प्रजनन सूचक। विषम राशि + शुभ नक्षत्र = सशक्त पुरुष प्रजनन। सम राशि + पाप नक्षत्र = सम्भव कठिनाई।', sa: 'पुरुष प्रजनन सूचक। विषम राशि + शुभ नक्षत्र = सशक्त पुरुष प्रजनन। सम राशि + पाप नक्षत्र = सम्भव कठिनाई।', mai: 'पुरुष प्रजनन सूचक। विषम राशि + शुभ नक्षत्र = सशक्त पुरुष प्रजनन। सम राशि + पाप नक्षत्र = सम्भव कठिनाई।', mr: 'पुरुष प्रजनन सूचक। विषम राशि + शुभ नक्षत्र = सशक्त पुरुष प्रजनन। सम राशि + पाप नक्षत्र = सम्भव कठिनाई।', ta: 'Male fertility indicator. Odd sign + benefic Nakshatra = strong male fertility. Even sign + malefic Nakshatra = potential difficulty requiring medical support.', te: 'Male fertility indicator. Odd sign + benefic Nakshatra = strong male fertility. Even sign + malefic Nakshatra = potential difficulty requiring medical support.', bn: 'Male fertility indicator. Odd sign + benefic Nakshatra = strong male fertility. Even sign + malefic Nakshatra = potential difficulty requiring medical support.', kn: 'Male fertility indicator. Odd sign + benefic Nakshatra = strong male fertility. Even sign + malefic Nakshatra = potential difficulty requiring medical support.', gu: 'Male fertility indicator. Odd sign + benefic Nakshatra = strong male fertility. Even sign + malefic Nakshatra = potential difficulty requiring medical support.' }, color: 'text-blue-400' },
  { name: { en: 'Kshetra Sphuta (Field — Female)', hi: 'क्षेत्र स्फुट (स्त्री)', sa: 'क्षेत्र स्फुट (स्त्री)', mai: 'क्षेत्र स्फुट (स्त्री)', mr: 'क्षेत्र स्फुट (स्त्री)', ta: 'க்ஷேத்ர ஸ்புடம் (க்ஷேத்திரம் — பெண்)', te: 'క్షేత్ర స్ఫుటం (క్షేత్రం — స్త్రీ)', bn: 'ক্ষেত্র স্ফুট (ক্ষেত্র — স্ত্রী)', kn: 'ಕ್ಷೇತ್ರ ಸ್ಫುಟ (ಕ್ಷೇತ್ರ — ಸ್ತ್ರೀ)', gu: 'ક્ષેત્ર સ્ફુટ (ક્ષેત્ર — સ્ત્રી)' }, formula: { en: 'Moon° + Mars° + Jupiter°', hi: 'चन्द्र° + मंगल° + गुरु°', sa: 'चन्द्र° + मंगल° + गुरु°', mai: 'चन्द्र° + मंगल° + गुरु°', mr: 'चन्द्र° + मंगल° + गुरु°', ta: 'Moon° + Mars° + Jupiter°', te: 'Moon° + Mars° + Jupiter°', bn: 'Moon° + Mars° + Jupiter°', kn: 'Moon° + Mars° + Jupiter°', gu: 'Moon° + Mars° + Jupiter°' }, interpretation: { en: 'Female fertility indicator. Even sign + benefic Nakshatra = strong female fertility. Odd sign + malefic Nakshatra = potential difficulty. Both Sphutas assessed together for couple compatibility.', hi: 'स्त्री प्रजनन सूचक। सम राशि + शुभ नक्षत्र = सशक्त स्त्री प्रजनन। विषम राशि + पाप नक्षत्र = सम्भव कठिनाई।', sa: 'स्त्री प्रजनन सूचक। सम राशि + शुभ नक्षत्र = सशक्त स्त्री प्रजनन। विषम राशि + पाप नक्षत्र = सम्भव कठिनाई।', mai: 'स्त्री प्रजनन सूचक। सम राशि + शुभ नक्षत्र = सशक्त स्त्री प्रजनन। विषम राशि + पाप नक्षत्र = सम्भव कठिनाई।', mr: 'स्त्री प्रजनन सूचक। सम राशि + शुभ नक्षत्र = सशक्त स्त्री प्रजनन। विषम राशि + पाप नक्षत्र = सम्भव कठिनाई।', ta: 'Female fertility indicator. Even sign + benefic Nakshatra = strong female fertility. Odd sign + malefic Nakshatra = potential difficulty. Both Sphutas assessed together for couple compatibility.', te: 'Female fertility indicator. Even sign + benefic Nakshatra = strong female fertility. Odd sign + malefic Nakshatra = potential difficulty. Both Sphutas assessed together for couple compatibility.', bn: 'Female fertility indicator. Even sign + benefic Nakshatra = strong female fertility. Odd sign + malefic Nakshatra = potential difficulty. Both Sphutas assessed together for couple compatibility.', kn: 'Female fertility indicator. Even sign + benefic Nakshatra = strong female fertility. Odd sign + malefic Nakshatra = potential difficulty. Both Sphutas assessed together for couple compatibility.', gu: 'Female fertility indicator. Even sign + benefic Nakshatra = strong female fertility. Odd sign + malefic Nakshatra = potential difficulty. Both Sphutas assessed together for couple compatibility.' }, color: 'text-pink-400' },
];

const HOW_TO_POINTS = [
  { point: { en: 'Check Yogi/Avayogi first', hi: 'पहले योगी/अवयोगी जांचें', sa: 'पहले योगी/अवयोगी जांचें', mai: 'पहले योगी/अवयोगी जांचें', mr: 'पहले योगी/अवयोगी जांचें', ta: 'Check Yogi/Avayogi first', te: 'Check Yogi/Avayogi first', bn: 'Check Yogi/Avayogi first', kn: 'Check Yogi/Avayogi first', gu: 'Check Yogi/Avayogi first' }, detail: { en: 'Identify your Yogi Planet and its current transit position. When it\'s strong by transit (in own sign, exalted, or aspected by Jupiter), expect windfalls.', hi: 'अपने योगी ग्रह और उसकी वर्तमान गोचर स्थिति पहचानें। जब यह गोचर से बलवान हो, अप्रत्याशित लाभ की अपेक्षा करें।' } },
  { point: { en: 'Map constitutional Sphutas to Nakshatras', hi: 'संवैधानिक स्फुटों को नक्षत्रों से मिलाएं', sa: 'संवैधानिक स्फुटों को नक्षत्रों से मिलाएं', mai: 'संवैधानिक स्फुटों को नक्षत्रों से मिलाएं', mr: 'संवैधानिक स्फुटों को नक्षत्रों से मिलाएं', ta: 'Map constitutional Sphutas to Nakshatras', te: 'Map constitutional Sphutas to Nakshatras', bn: 'Map constitutional Sphutas to Nakshatras', kn: 'Map constitutional Sphutas to Nakshatras', gu: 'Map constitutional Sphutas to Nakshatras' }, detail: { en: 'Each Sphuta falls in a Nakshatra. The Nakshatra lord becomes the governing planet for that life dimension. Strengthen it if weak.', hi: 'प्रत्येक स्फुट एक नक्षत्र में पड़ता है। नक्षत्र स्वामी उस जीवन आयाम का शासक ग्रह बन जाता है। यदि कमजोर है तो बलवान करें।', sa: 'प्रत्येक स्फुट एक नक्षत्र में पड़ता है। नक्षत्र स्वामी उस जीवन आयाम का शासक ग्रह बन जाता है। यदि कमजोर है तो बलवान करें।', mai: 'प्रत्येक स्फुट एक नक्षत्र में पड़ता है। नक्षत्र स्वामी उस जीवन आयाम का शासक ग्रह बन जाता है। यदि कमजोर है तो बलवान करें।', mr: 'प्रत्येक स्फुट एक नक्षत्र में पड़ता है। नक्षत्र स्वामी उस जीवन आयाम का शासक ग्रह बन जाता है। यदि कमजोर है तो बलवान करें।', ta: 'Each Sphuta falls in a Nakshatra. The Nakshatra lord becomes the governing planet for that life dimension. Strengthen it if weak.', te: 'Each Sphuta falls in a Nakshatra. The Nakshatra lord becomes the governing planet for that life dimension. Strengthen it if weak.', bn: 'Each Sphuta falls in a Nakshatra. The Nakshatra lord becomes the governing planet for that life dimension. Strengthen it if weak.', kn: 'Each Sphuta falls in a Nakshatra. The Nakshatra lord becomes the governing planet for that life dimension. Strengthen it if weak.', gu: 'Each Sphuta falls in a Nakshatra. The Nakshatra lord becomes the governing planet for that life dimension. Strengthen it if weak.' } },
  { point: { en: 'Watch transits over Sphuta degrees', hi: 'स्फुट अंशों पर गोचर देखें', sa: 'स्फुट अंशों पर गोचर देखें', mai: 'स्फुट अंशों पर गोचर देखें', mr: 'स्फुट अंशों पर गोचर देखें', ta: 'Watch transits over Sphuta degrees', te: 'Watch transits over Sphuta degrees', bn: 'Watch transits over Sphuta degrees', kn: 'Watch transits over Sphuta degrees', gu: 'Watch transits over Sphuta degrees' }, detail: { en: 'Slow planets (Jupiter, Saturn, Rahu) crossing your Sphuta degrees trigger events related to that Sphuta\'s domain. Mark these transits on your calendar.', hi: 'धीमे ग्रह (गुरु, शनि, राहु) आपके स्फुट अंशों को पार करते समय सम्बन्धित क्षेत्र की घटनाएं उत्प्रेरित करते हैं। इन गोचरों को कैलेंडर पर चिह्नित करें।' } },
  { point: { en: 'Use in dasha analysis', hi: 'दशा विश्लेषण में प्रयोग करें', sa: 'दशा विश्लेषण में प्रयोग करें', mai: 'दशा विश्लेषण में प्रयोग करें', mr: 'दशा विश्लेषण में प्रयोग करें', ta: 'Use in dasha analysis', te: 'Use in dasha analysis', bn: 'Use in dasha analysis', kn: 'Use in dasha analysis', gu: 'Use in dasha analysis' }, detail: { en: 'During the dasha of your Yogi Planet, expect the best results. During the dasha of Avayogi Planet, apply remedies proactively.', hi: 'योगी ग्रह की दशा में सर्वोत्तम परिणाम अपेक्षित। अवयोगी ग्रह की दशा में सक्रिय रूप से उपचार करें।', sa: 'योगी ग्रह की दशा में सर्वोत्तम परिणाम अपेक्षित। अवयोगी ग्रह की दशा में सक्रिय रूप से उपचार करें।', mai: 'योगी ग्रह की दशा में सर्वोत्तम परिणाम अपेक्षित। अवयोगी ग्रह की दशा में सक्रिय रूप से उपचार करें।', mr: 'योगी ग्रह की दशा में सर्वोत्तम परिणाम अपेक्षित। अवयोगी ग्रह की दशा में सक्रिय रूप से उपचार करें।', ta: 'During the dasha of your Yogi Planet, expect the best results. During the dasha of Avayogi Planet, apply remedies proactively.', te: 'During the dasha of your Yogi Planet, expect the best results. During the dasha of Avayogi Planet, apply remedies proactively.', bn: 'During the dasha of your Yogi Planet, expect the best results. During the dasha of Avayogi Planet, apply remedies proactively.', kn: 'During the dasha of your Yogi Planet, expect the best results. During the dasha of Avayogi Planet, apply remedies proactively.', gu: 'During the dasha of your Yogi Planet, expect the best results. During the dasha of Avayogi Planet, apply remedies proactively.' } },
];

export default function LearnSphutasPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const tl = (obj: LocaleText | Record<string, string>) => ((obj as Record<string, string>)[locale] || (obj as Record<string, string>).en || '');
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedConst, setExpandedConst] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{t('subtitle')}</p>
      </motion.div>

      {/* ═══ What are Sphutas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('whatTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{t('whatP1')}</p>
        <p className="text-text-secondary leading-relaxed">{t('whatP2')}</p>
      </motion.section>

      {/* ═══ Yogi & Avayogi ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t('yogiTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{t('yogiDesc')}</p>

        {/* Yogi Point */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-400" style={headingFont}>{t('yogiPointTitle')}</h3>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('yogiPointDesc')}</p>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-emerald-500/10">
            <p className="text-emerald-400 font-mono text-sm">{t('yogiFormula')}</p>
          </div>
          {YOGI_DETAILS.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/10">
              <div className="text-emerald-400 font-bold text-sm mb-1">{tl(d.label)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{tl(d.desc)}</div>
            </div>
          ))}
        </div>

        {/* Avayogi Point */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-red-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-bold text-red-400" style={headingFont}>{t('avayogiTitle')}</h3>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('avayogiDesc')}</p>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-red-500/10">
            <p className="text-red-400 font-mono text-sm">{t('avayogiFormula')}</p>
          </div>
          {AVAYOGI_DETAILS.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/10">
              <div className="text-red-400 font-bold text-sm mb-1">{tl(d.label)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{tl(d.desc)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Transit Triggers ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('yogiTransitTitle')}</h2>
        <div className="space-y-3">
          {YOGI_TRANSITS.map((tr, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <div className={`font-bold text-sm mb-1 ${tr.color}`}>{tl(tr.trigger)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{tl(tr.effect)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Constitutional Sphutas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t('constitutionalTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{t('constitutionalDesc')}</p>
        {CONSTITUTIONAL_SPHUTAS.map((sp, i) => {
          const isExp = expandedConst === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedConst(isExp ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <HeartPulse className={`w-5 h-5 ${sp.color}`} />
                  <span className={`font-bold ${sp.color}`} style={headingFont}>{tl(sp.name)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isExp ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-5 space-y-3 border-t border-gold-primary/10 pt-4">
                      <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
                        <span className="text-gold-dark text-xs uppercase tracking-widest font-bold">{isHi ? 'सूत्र' : 'Formula'}: </span>
                        <span className="text-gold-light font-mono text-sm">{tl(sp.formula)}</span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{tl(sp.interpretation)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Fertility Sphutas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Baby className="w-6 h-6 text-pink-400" />
          <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('fertilityTitle')}</h2>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{t('fertilityDesc')}</p>
        {FERTILITY_SPHUTAS.map((sp, i) => (
          <div key={i} className={`p-4 rounded-xl border ${sp.color === 'text-blue-400' ? 'border-blue-500/15 bg-blue-500/5' : 'border-pink-500/15 bg-pink-500/5'}`}>
            <div className={`font-bold text-sm mb-1 ${sp.color}`}>{tl(sp.name)}</div>
            <div className="p-2 bg-bg-primary/30 rounded-lg mb-2">
              <span className="text-gold-dark text-xs uppercase tracking-widest font-bold">{isHi ? 'सूत्र' : 'Formula'}: </span>
              <span className="text-gold-light font-mono text-xs">{tl(sp.formula)}</span>
            </div>
            <div className="text-text-secondary text-xs leading-relaxed">{tl(sp.interpretation)}</div>
          </div>
        ))}
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
          <p className="text-amber-400 text-xs leading-relaxed">
            {isHi
              ? 'नोट: विषम राशि + शुभ नक्षत्र = अनुकूल (बीज); सम राशि + शुभ नक्षत्र = अनुकूल (क्षेत्र)। दोनों स्फुट अनुकूल होने पर दम्पति की प्रजनन क्षमता प्रबल मानी जाती है।'
              : 'Note: Odd sign + benefic Nakshatra = favorable (Bija); Even sign + benefic Nakshatra = favorable (Kshetra). When both Sphutas are favorable, the couple\'s collective fertility is considered strong.'}
          </p>
        </div>
      </motion.section>

      {/* ═══ How to Use ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('howToTitle')}</h2>
        <div className="space-y-3">
          {HOW_TO_POINTS.map((hp, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-gold-primary font-bold text-sm">{i + 1}.</span>
                <span className="text-gold-light font-bold text-sm">{tl(hp.point)}</span>
              </div>
              <div className="text-text-secondary text-xs leading-relaxed pl-5">{tl(hp.detail)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Practical Example ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('exampleTitle')}</h2>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-text-secondary text-sm leading-relaxed">{t('exampleContent')}</p>
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं', sa: 'कुण्डली बनाएं', mai: 'कुण्डली बनाएं', mr: 'कुण्डली बनाएं', ta: 'குண்டலி உருவாக்கு', te: 'కుండలి తయారు చేయండి', bn: 'কুণ্ডলী তৈরি করুন', kn: 'ಕುಂಡಲಿ ತಯಾರಿಸಿ', gu: 'કુંડળી બનાવો' } },
            { href: '/learn/modules/23-4', label: { en: 'Module 23-4: Sphutas Deep Dive', hi: 'मॉड्यूल 23-4: स्फुट विस्तार', sa: 'मॉड्यूल 23-4: स्फुट विस्तार', mai: 'मॉड्यूल 23-4: स्फुट विस्तार', mr: 'मॉड्यूल 23-4: स्फुट विस्तार', ta: 'தொகுதி 23-4: ஸ்புடங்கள் ஆழ ஆய்வு', te: 'మాడ్యూల్ 23-4: స్ఫుటాల లోతైన అధ్యయనం', bn: 'মডিউল ২৩-৪: স্ফুট গভীর অধ্যয়ন', kn: 'ಮಾಡ್ಯೂಲ್ 23-4: ಸ್ಫುಟಗಳ ಆಳ ಅಧ್ಯಯನ', gu: 'મોડ્યુલ 23-4: સ્ફુટ ઊંડાણ અભ્યાસ' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala (Planet Strength)', hi: 'षड्बल (ग्रह शक्ति)', sa: 'षड्बल (ग्रह शक्ति)', mai: 'षड्बल (ग्रह शक्ति)', mr: 'षड्बल (ग्रह शक्ति)', ta: 'ஷட்பலம் (கிரக வலிமை)', te: 'షడ్బల (గ్రహ బలం)', bn: 'ষড়বল (গ্রহ বল)', kn: 'ಷಡ್ಬಲ (ಗ್ರಹ ಶಕ್ತಿ)', gu: 'ષડ્બલ (ગ્રહ બળ)' } },
            { href: '/learn/avasthas', label: { en: 'Avasthas (Planet States)', hi: 'अवस्थाएं (ग्रह दशाएं)', sa: 'अवस्थाएं (ग्रह दशाएं)', mai: 'अवस्थाएं (ग्रह दशाएं)', mr: 'अवस्थाएं (ग्रह दशाएं)', ta: 'அவஸ்தைகள் (கிரக நிலைகள்)', te: 'అవస్థలు (గ్రహ స్థితులు)', bn: 'অবস্থা (গ্রহ অবস্থা)', kn: 'ಅವಸ್ಥೆಗಳು (ಗ್ರಹ ಸ್ಥಿತಿಗಳು)', gu: 'અવસ્થાઓ (ગ્રહ સ્થિતિઓ)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {tl(link.label)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

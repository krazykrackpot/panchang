'use client';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/hora.json';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ── Planet speed data ────────────────────────────────────────────── */
const SPEED_TABLE = [
  {
    rank: 1, label: { en: 'Slowest', hi: 'सबसे धीमा', sa: 'मन्दतमः', mai: 'सभसँ धीमा', mr: 'सर्वात मंद', ta: 'மெதுவான', te: 'నెమ్మదిగా', bn: 'সবচেয়ে ধীর', kn: 'ಅತಿ ನಿಧಾನ', gu: 'સૌથી ધીમું' },
    planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
    period: { en: '29.46 years', hi: '29.46 वर्ष', sa: '29.46 वर्षाणि', mai: '29.46 वर्ष', mr: '29.46 वर्षे', ta: '29.46 வருடங்கள்', te: '29.46 సంవత్సరాలు', bn: '29.46 বছর', kn: '29.46 ವರ್ಷಗಳು', gu: '29.46 વર્ષ' },
    note: { en: 'Takes longest to traverse the entire zodiac', hi: 'राशिचक्र पूरा करने में सबसे अधिक समय', sa: 'राशिचक्रं पूरयितुं सर्वाधिकः कालः', mai: 'राशिचक्र पूरा करबामे सभसँ बेसी समय', mr: 'राशीचक्र पूर्ण करण्यास सर्वाधिक वेळ', ta: 'முழு ராசி வட்டத்தையும் கடக்க அதிக நேரம் எடுக்கும்', te: 'మొత్తం రాశిచక్రాన్ని దాటడానికి ఎక్కువ సమయం పడుతుంది', bn: 'সম্পূর্ণ রাশিচক্র অতিক্রম করতে সবচেয়ে বেশি সময় লাগে', kn: 'ಸಂಪೂರ್ಣ ರಾಶಿಚಕ್ರವನ್ನು ಸುತ್ತಲು ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ', gu: 'સમગ્ર રાશિચક્ર પૂરું કરવામાં સૌથી વધુ સમય લે છે' },
    color: '#60a5fa', border: 'border-blue-500/30', bg: 'bg-blue-500/8',
  },
  {
    rank: 2, label: { en: '', hi: '', sa: '', mai: '', mr: '', ta: '', te: '', bn: '', kn: '', gu: '' },
    planet: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', mai: 'बृहस्पति', mr: 'बृहस्पती', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
    period: { en: '11.86 years', hi: '11.86 वर्ष', sa: '11.86 वर्षाणि', mai: '11.86 वर्ष', mr: '11.86 वर्षे', ta: '11.86 வருடங்கள்', te: '11.86 సంవత్సరాలు', bn: '11.86 বছর', kn: '11.86 ವರ್ಷಗಳು', gu: '11.86 વર્ષ' },
    note: { en: 'Completes ~2.4 circuits in Saturn\'s one orbit', hi: 'शनि के एक चक्र में ~2.4 परिक्रमाएँ' },
    color: '#facc15', border: 'border-yellow-500/30', bg: 'bg-yellow-500/8',
  },
  {
    rank: 3, label: { en: '', hi: '', sa: '', mai: '', mr: '', ta: '', te: '', bn: '', kn: '', gu: '' },
    planet: { en: 'Mars', hi: 'मंगल', sa: 'कुजः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
    period: { en: '1.88 years', hi: '1.88 वर्ष', sa: '1.88 वर्षाणि', mai: '1.88 वर्ष', mr: '1.88 वर्षे', ta: '1.88 வருடங்கள்', te: '1.88 సంవత్సరాలు', bn: '1.88 বছর', kn: '1.88 ವರ್ಷಗಳು', gu: '1.88 વર્ષ' },
    note: { en: 'Completes ~2 years per zodiac circuit', hi: 'राशिचक्र में ~2 वर्ष प्रति परिक्रमा', sa: 'राशिचक्रे ~2 वर्षे प्रतिपरिक्रमणम्', mai: 'राशिचक्रमे ~2 वर्ष प्रति परिक्रमा', mr: 'राशीचक्रात ~2 वर्षे प्रति परिक्रमा', ta: 'ராசி வட்டத்திற்கு ~2 ஆண்டுகள்', te: 'రాశిచక్ర పరిక్రమణకు ~2 సంవత్సరాలు', bn: 'রাশিচক্র প্রদক্ষিণে ~2 বছর', kn: 'ರಾಶಿಚಕ್ರ ಪ್ರದಕ್ಷಿಣೆಗೆ ~2 ವರ್ಷಗಳು', gu: 'રાશિચક્ર પ્રદક્ષિણામાં ~2 વર્ષ' },
    color: '#ef4444', border: 'border-red-500/30', bg: 'bg-red-500/8',
  },
  {
    rank: 4, label: { en: '', hi: '', sa: '', mai: '', mr: '', ta: '', te: '', bn: '', kn: '', gu: '' },
    planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
    period: { en: '1 year', hi: '1 वर्ष', sa: '1 वर्षम्', mai: '1 वर्ष', mr: '1 वर्ष', ta: '1 வருடம்', te: '1 సంవత్సరం', bn: '1 বছর', kn: '1 ವರ್ಷ', gu: '1 વર્ષ' },
    note: { en: 'Earth\'s orbit defines the tropical year', hi: 'पृथ्वी की कक्षा उष्णकटिबंधीय वर्ष परिभाषित करती है' },
    color: '#f59e0b', border: 'border-amber-500/30', bg: 'bg-amber-500/8',
  },
  {
    rank: 5, label: { en: '', hi: '', sa: '', mai: '', mr: '', ta: '', te: '', bn: '', kn: '', gu: '' },
    planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
    period: { en: '224.7 days', hi: '224.7 दिन', sa: '224.7 दिनानि', mai: '224.7 दिन', mr: '224.7 दिवस', ta: '224.7 நாட்கள்', te: '224.7 రోజులు', bn: '224.7 দিন', kn: '224.7 ದಿನಗಳು', gu: '224.7 દિવસ' },
    note: { en: 'Completes ~1.6 orbits per Earth year', hi: 'प्रति पृथ्वी वर्ष ~1.6 कक्षाएँ', sa: 'प्रतिपृथिवीवर्षं ~1.6 कक्षाः', mai: 'प्रति पृथ्वी वर्ष ~1.6 कक्षा', mr: 'पृथ्वी वर्षात ~1.6 कक्षा', ta: 'பூமி ஆண்டுக்கு ~1.6 சுற்றுகள்', te: 'భూమి సంవత్సరానికి ~1.6 కక్ష్యలు', bn: 'পৃথিবী বছরে ~1.6 কক্ষপথ', kn: 'ಭೂಮಿ ವರ್ಷಕ್ಕೆ ~1.6 ಕಕ್ಷೆಗಳು', gu: 'પૃથ્વી વર્ષ દીઠ ~1.6 ભ્રમણ' },
    color: '#f472b6', border: 'border-pink-500/30', bg: 'bg-pink-500/8',
  },
  {
    rank: 6, label: { en: '', hi: '', sa: '', mai: '', mr: '', ta: '', te: '', bn: '', kn: '', gu: '' },
    planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
    period: { en: '87.97 days', hi: '87.97 दिन', sa: '87.97 दिनानि', mai: '87.97 दिन', mr: '87.97 दिवस', ta: '87.97 நாட்கள்', te: '87.97 రోజులు', bn: '87.97 দিন', kn: '87.97 ದಿನಗಳು', gu: '87.97 દિવસ' },
    note: { en: 'Fastest of the classical planets; ~4 orbits per year', hi: 'शास्त्रीय ग्रहों में सबसे तेज़; ~4 कक्षाएँ प्रति वर्ष', sa: 'शास्त्रीयग्रहेषु द्रुततमः; प्रतिवर्षं ~4 कक्षाः', mai: 'शास्त्रीय ग्रहमे सभसँ तेज़; प्रतिवर्ष ~4 कक्षा', mr: 'शास्त्रीय ग्रहांमध्ये सर्वात जलद; दरवर्षी ~4 कक्षा', ta: 'பாரம்பரிய கிரகங்களில் வேகமானது; ஆண்டுக்கு ~4 சுற்றுகள்', te: 'శాస్త్రీయ గ్రహాలలో వేగవంతమైనది; సంవత్సరానికి ~4 కక్ష్యలు', bn: 'শাস্ত্রীয় গ্রহগুলির মধ্যে দ্রুততম; বছরে ~4 কক্ষপথ', kn: 'ಶಾಸ್ತ್ರೀಯ ಗ್ರಹಗಳಲ್ಲಿ ವೇಗವಾದದ್ದು; ವರ್ಷಕ್ಕೆ ~4 ಕಕ್ಷೆಗಳು', gu: 'શાસ્ત્રીય ગ્રહોમાં સૌથી ઝડપી; વર્ષ દીઠ ~4 ભ્રમણ' },
    color: '#4ade80', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8',
  },
  {
    rank: 7, label: { en: 'Fastest', hi: 'सबसे तेज़', sa: 'द्रुततमः', mai: 'सभसँ तेज़', mr: 'सर्वात जलद', ta: 'மிகவும் வேகமான', te: 'అత్యంత వేగం', bn: 'সবচেয়ে দ্রুত', kn: 'ಅತ್ಯಂತ ವೇಗ', gu: 'સૌથી ઝડપી' },
    planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
    period: { en: '27.32 days', hi: '27.32 दिन', sa: '27.32 दिनानि', mai: '27.32 दिन', mr: '27.32 दिवस', ta: '27.32 நாட்கள்', te: '27.32 రోజులు', bn: '27.32 দিন', kn: '27.32 ದಿನಗಳು', gu: '27.32 દિવસ' },
    note: { en: 'Completes one orbit in under a month', hi: 'एक महीने से कम में एक कक्षा पूरी करता है', sa: 'एकस्मात् मासात् न्यूनकाले एकां कक्षां पूरयति', mai: 'एक मासक कम समयमे एक कक्षा पूरा करैत अछि', mr: 'एका महिन्यापेक्षा कमी वेळात एक कक्षा पूर्ण करतो', ta: 'ஒரு மாதத்திற்குள் ஒரு சுற்று முடிக்கிறது', te: 'ఒక నెలలోపు ఒక కక్ష్య పూర్తి చేస్తుంది', bn: 'এক মাসেরও কম সময়ে একটি কক্ষপথ সম্পন্ন করে', kn: 'ಒಂದು ತಿಂಗಳೊಳಗೆ ಒಂದು ಕಕ್ಷೆ ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ', gu: 'એક મહિનાથી ઓછા સમયમાં એક ભ્રમણ પૂર્ણ કરે છે' },
    color: '#94a3b8', border: 'border-slate-400/30', bg: 'bg-slate-400/8',
  },
];

/* ── Hora → weekday derivation ────────────────────────────────────── */
const WEEKDAY_DERIVATION = [
  {
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', mai: 'शनिदिन', mr: 'शनिवार', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ', gu: 'શનિવાર' },
    lord: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
    color: '#60a5fa',
    hora25: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
    next: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', mai: 'रविदिन', mr: 'रविवार', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ', gu: 'રવિવાર' },
    nextColor: '#f59e0b',
  },
  {
    day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', mai: 'रविदिन', mr: 'रविवार', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ', gu: 'રવિવાર' },
    lord: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' },
    color: '#f59e0b',
    hora25: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
    next: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', mai: 'सोमदिन', mr: 'सोमवार', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ', gu: 'સોમવાર' },
    nextColor: '#94a3b8',
  },
  {
    day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', mai: 'सोमदिन', mr: 'सोमवार', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ', gu: 'સોમવાર' },
    lord: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' },
    color: '#94a3b8',
    hora25: { en: 'Mars', hi: 'मंगल', sa: 'कुजः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
    next: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मंगलवासरः', mai: 'मंगलदिन', mr: 'मंगळवार', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ', gu: 'મંગળવાર' },
    nextColor: '#ef4444',
  },
  {
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मंगलवासरः', mai: 'मंगलदिन', mr: 'मंगळवार', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ', gu: 'મંગળવાર' },
    lord: { en: 'Mars', hi: 'मंगल', sa: 'कुजः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' },
    color: '#ef4444',
    hora25: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
    next: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', mai: 'बुधदिन', mr: 'बुधवार', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', gu: 'બુધવાર' },
    nextColor: '#4ade80',
  },
  {
    day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', mai: 'बुधदिन', mr: 'बुधवार', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', gu: 'બુધવાર' },
    lord: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' },
    color: '#4ade80',
    hora25: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः', mai: 'गुरु', mr: 'गुरु', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
    next: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', mai: 'गुरुदिन', mr: 'गुरुवार', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', gu: 'ગુરુવાર' },
    nextColor: '#facc15',
  },
  {
    day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', mai: 'गुरुदिन', mr: 'गुरुवार', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', gu: 'ગુરુવાર' },
    lord: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः', mai: 'गुरु', mr: 'गुरु', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' },
    color: '#facc15',
    hora25: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
    next: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', mai: 'शुक्रदिन', mr: 'शुक्रवार', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ', gu: 'શુક્રવાર' },
    nextColor: '#f472b6',
  },
  {
    day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', mai: 'शुक्रदिन', mr: 'शुक्रवार', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ', gu: 'શુક્રવાર' },
    lord: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' },
    color: '#f472b6',
    hora25: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
    next: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', mai: 'शनिदिन', mr: 'शनिवार', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ', gu: 'શનિવાર' },
    nextColor: '#60a5fa',
  },
];

/* ── Weekday names comparison ─────────────────────────────────────── */
const WEEKDAYS = [
  {
    num: 1,
    sanskrit: 'Ravivara', hi: 'रविवार', en: 'Sunday', latin: 'Dies Solis',
    planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, color: '#f59e0b',
    norse: { en: '(Sun\'s day)', hi: '(सूर्य का दिन)' },
  },
  {
    num: 2,
    sanskrit: 'Somavara', hi: 'सोमवार', en: 'Monday', latin: 'Dies Lunae',
    planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', mai: 'चन्द्र', mr: 'चंद्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, color: '#94a3b8',
    norse: { en: '(Moon\'s day)', hi: '(चंद्र का दिन)' },
  },
  {
    num: 3,
    sanskrit: 'Mangalavara', hi: 'मंगलवार', en: 'Tuesday', latin: 'Dies Martis',
    planet: { en: 'Mars', hi: 'मंगल', sa: 'कुजः', mai: 'मंगल', mr: 'मंगळ', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, color: '#ef4444',
    norse: { en: '(Tyr\'s day = Mars)', hi: '(Tyr = मंगल)' },
  },
  {
    num: 4,
    sanskrit: 'Budhavara', hi: 'बुधवार', en: 'Wednesday', latin: 'Dies Mercurii',
    planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, color: '#4ade80',
    norse: { en: '(Woden\'s day = Mercury)', hi: '(Woden = बुध)' },
  },
  {
    num: 5,
    sanskrit: 'Brihaspativara', hi: 'बृहस्पतिवार / गुरुवार', en: 'Thursday', latin: 'Dies Jovis',
    planet: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः', mai: 'बृहस्पति', mr: 'बृहस्पती', ta: 'வியாழன்', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, color: '#facc15',
    norse: { en: '(Thor\'s day = Jupiter)', hi: '(Thor = बृहस्पति)' },
  },
  {
    num: 6,
    sanskrit: 'Shukravara', hi: 'शुक्रवार', en: 'Friday', latin: 'Dies Veneris',
    planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, color: '#f472b6',
    norse: { en: '(Freya\'s day = Venus)', hi: '(Freya = शुक्र)' },
  },
  {
    num: 7,
    sanskrit: 'Shanivara', hi: 'शनिवार', en: 'Saturday', latin: 'Dies Saturni',
    planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः', mai: 'शनि', mr: 'शनी', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, color: '#60a5fa',
    norse: { en: '(Saturn\'s day)', hi: '(शनि का दिन)' },
  },
];

/* ── Hora practice data ───────────────────────────────────────────── */
const HORA_PRACTICE = [
  {
    planet: { en: 'Sun Hora', hi: 'सूर्य होरा', sa: 'सूर्य होरा', mai: 'सूर्य होरा', mr: 'सूर्य होरा', ta: 'Sun Hora', te: 'Sun Hora', bn: 'Sun Hora', kn: 'Sun Hora', gu: 'Sun Hora' }, color: '#f59e0b', bg: 'bg-amber-500/8', border: 'border-amber-500/25',
    activities: {
      en: 'Authority, government work, meetings with officials, leadership tasks, father-related matters, self-expression and command',
      hi: 'अधिकार, सरकारी कार्य, अधिकारियों से मिलना, नेतृत्व, पिता सम्बन्धित, आत्म-अभिव्यक्ति',
    },
  },
  {
    planet: { en: 'Moon Hora', hi: 'चन्द्र होरा', sa: 'चन्द्र होरा', mai: 'चन्द्र होरा', mr: 'चन्द्र होरा', ta: 'Moon Hora', te: 'Moon Hora', bn: 'Moon Hora', kn: 'Moon Hora', gu: 'Moon Hora' }, color: '#94a3b8', bg: 'bg-slate-400/8', border: 'border-slate-400/25',
    activities: {
      en: 'Travel, emotional conversations, mother-related, public dealings, water work, starting creative projects',
      hi: 'यात्रा, भावनात्मक बातचीत, माता सम्बन्धित, सार्वजनिक व्यवहार, जल कार्य, रचनात्मक परियोजना',
    },
  },
  {
    planet: { en: 'Mars Hora', hi: 'मंगल होरा', sa: 'मंगल होरा', mai: 'मंगल होरा', mr: 'मंगल होरा', ta: 'Mars Hora', te: 'Mars Hora', bn: 'Mars Hora', kn: 'Mars Hora', gu: 'Mars Hora' }, color: '#ef4444', bg: 'bg-red-500/8', border: 'border-red-500/25',
    activities: {
      en: 'Surgery, property work, sports, engineering and machinery, military or police matters, unavoidable confrontation',
      hi: 'शल्यक्रिया, सम्पत्ति कार्य, खेल, यन्त्र-अभियान्त्रिकी, सेना/पुलिस, अपरिहार्य संघर्ष',
    },
  },
  {
    planet: { en: 'Mercury Hora', hi: 'बुध होरा', sa: 'बुध होरा', mai: 'बुध होरा', mr: 'बुध होरा', ta: 'Mercury Hora', te: 'Mercury Hora', bn: 'Mercury Hora', kn: 'Mercury Hora', gu: 'Mercury Hora' }, color: '#4ade80', bg: 'bg-emerald-500/8', border: 'border-emerald-500/25',
    activities: {
      en: 'Business deals, contract signing, communication, education, writing, accounting, banking, technology, short trips',
      hi: 'व्यापारिक सौदे, अनुबन्ध, संचार, शिक्षा, लेखन, लेखांकन, बैंकिंग, प्रौद्योगिकी, छोटी यात्रा',
    },
  },
  {
    planet: { en: 'Jupiter Hora', hi: 'गुरु होरा', sa: 'गुरु होरा', mai: 'गुरु होरा', mr: 'गुरु होरा', ta: 'Jupiter Hora', te: 'Jupiter Hora', bn: 'Jupiter Hora', kn: 'Jupiter Hora', gu: 'Jupiter Hora' }, color: '#facc15', bg: 'bg-yellow-500/8', border: 'border-yellow-500/25',
    activities: {
      en: 'Spiritual work, teaching, consulting advisors, charity, legal proceedings, religious ceremonies, financial expansion',
      hi: 'आध्यात्मिक कार्य, अध्यापन, सलाहकार परामर्श, दान, कानूनी कार्यवाही, धार्मिक अनुष्ठान, वित्त',
    },
  },
  {
    planet: { en: 'Venus Hora', hi: 'शुक्र होरा', sa: 'शुक्र होरा', mai: 'शुक्र होरा', mr: 'शुक्र होरा', ta: 'Venus Hora', te: 'Venus Hora', bn: 'Venus Hora', kn: 'Venus Hora', gu: 'Venus Hora' }, color: '#f472b6', bg: 'bg-pink-500/8', border: 'border-pink-500/25',
    activities: {
      en: 'Romance, marriage-related, arts and music, buying luxury items, beauty treatments, fashion, jewelry purchase',
      hi: 'प्रेम-प्रणय, विवाह सम्बन्धित, कला-संगीत, विलासिता वस्तुएँ, सौन्दर्य उपचार, आभूषण',
    },
  },
  {
    planet: { en: 'Saturn Hora', hi: 'शनि होरा', sa: 'शनि होरा', mai: 'शनि होरा', mr: 'शनि होरा', ta: 'Saturn Hora', te: 'Saturn Hora', bn: 'Saturn Hora', kn: 'Saturn Hora', gu: 'Saturn Hora' }, color: '#60a5fa', bg: 'bg-blue-500/8', border: 'border-blue-500/25',
    activities: {
      en: 'Completing unfinished work, agriculture, iron/steel, deep meditation, dealing with laborers, mining, oil — AVOID starting new ventures',
      hi: 'अधूरा कार्य पूरा करें, कृषि, लोहा/इस्पात, गहन ध्यान, श्रमिकों से व्यवहार — नई शुरुआत से बचें',
    },
  },
];

/* ── Main Page ────────────────────────────────────────────────────── */
export default function HoraChaldeanPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const isDevanagari = isHi;
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto" style={bodyFont}>

      {/* ═══ Header ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-indigo-300 text-sm font-medium">{t('badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('title')}
        </h1>
        <p className="text-xl text-gold-light/70 mb-4" style={headingFont}>
          {t('titleSub')}
        </p>
        <p className="text-text-secondary max-w-3xl mx-auto text-base leading-relaxed">
          {t('intro')}
        </p>
      </motion.div>

      {/* ═══ Section 1: Indian Origin ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            1
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t('s1Title')}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t('s1p1')}</p>
          <p>{t('s1p2')}</p>

          {/* 7 Grahas visual row */}
          <div className="bg-black/20 border border-gold-primary/10 rounded-xl p-4 my-4">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
              {isHi ? 'सात दृश्य ग्रह (सप्तग्रह)' : 'The Seven Visible Grahas (Saptagraha)'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { en: 'Sun', hi: 'सूर्य', sa: 'Surya', color: '#f59e0b' },
                { en: 'Moon', hi: 'चन्द्र', sa: 'Chandra', color: '#94a3b8' },
                { en: 'Mars', hi: 'मंगल', sa: 'Mangala', color: '#ef4444' },
                { en: 'Mercury', hi: 'बुध', sa: 'Budha', color: '#4ade80' },
                { en: 'Jupiter', hi: 'बृहस्पति', sa: 'Brihaspati', color: '#facc15' },
                { en: 'Venus', hi: 'शुक्र', sa: 'Shukra', color: '#f472b6' },
                { en: 'Saturn', hi: 'शनि', sa: 'Shani', color: '#60a5fa' },
              ].map((g, i) => (
                <div key={i} className="flex flex-col items-center px-3 py-2 rounded-lg border border-white/10 bg-white/3 min-w-[72px] text-center">
                  <span className="text-sm font-bold" style={{ color: g.color }}>{isHi ? g.hi : g.en}</span>
                  <span className="text-text-tertiary text-xs mt-0.5">{g.sa}</span>
                </div>
              ))}
            </div>
          </div>

          <p>{t('s1p3')}</p>

          {/* Navagraha note */}
          <div className="flex gap-3 p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <div className="flex-shrink-0 w-1 rounded-full bg-purple-400/50" />
            <div>
              <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">
                {isHi ? 'नवग्रह = सप्त + राहु + केतु' : 'Navagraha = Sapta + Rahu + Ketu'}
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                {isHi
                  ? 'भारतीय नवग्रह पद्धति सात कैल्डियन ग्रहों को राहु और केतु के साथ जोड़ती है — कुल 9 ग्रह। यह विस्तार अन्य किसी प्राचीन संस्कृति में नहीं मिलता।'
                  : 'The Indian Navagraha system extends the seven Chaldean planets with Rahu and Ketu — totaling 9. This extension is not found in any other ancient astronomical tradition.'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 2: Speed Ranking Table ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            2
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t('s2Title')}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t('s2p1')}</p>

          {/* Speed table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'क्रम' : 'Rank'}
                  </th>
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'ग्रह' : 'Planet'}
                  </th>
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'परिक्रमण काल' : 'Sidereal Period'}
                  </th>
                  <th className="text-left py-2.5 px-3 text-gold-dark text-xs uppercase tracking-widest font-bold hidden sm:table-cell">
                    {isHi ? 'विशेषता' : 'Note'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPEED_TABLE.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0e27]"
                          style={{ backgroundColor: row.color }}
                        >
                          {row.rank}
                        </span>
                        {row.label.en && (
                          <span className="text-xs text-text-tertiary hidden lg:inline">
                            {lt(row.label as LocaleText, locale)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold" style={{ color: row.color }}>
                        {lt(row.planet as LocaleText, locale)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-text-primary">
                      {lt(row.period as LocaleText, locale)}
                    </td>
                    <td className="py-3 px-3 text-text-tertiary text-xs hidden sm:table-cell">
                      {lt(row.note as LocaleText, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-gold-primary/6 border border-gold-primary/20">
            <p className="text-text-secondary text-sm leading-relaxed">{t('s2note')}</p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 3: How the Hora System Works ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            3
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t('s3Title')}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t('s3p1')}</p>
          <p>{t('s3p2')}</p>

          {/* Chaldean cycle visual */}
          <div className="bg-black/25 border border-gold-primary/15 rounded-xl p-4 my-2">
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
              {isHi ? 'कैल्डियन चक्र (होरा क्रम)' : 'Chaldean Cycle (Hora Sequence)'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-1.5">
              {[
                { en: 'Saturn', hi: 'शनि', color: '#60a5fa' },
                { en: 'Jupiter', hi: 'गुरु', color: '#facc15' },
                { en: 'Mars', hi: 'मंगल', color: '#ef4444' },
                { en: 'Sun', hi: 'सूर्य', color: '#f59e0b' },
                { en: 'Venus', hi: 'शुक्र', color: '#f472b6' },
                { en: 'Mercury', hi: 'बुध', color: '#4ade80' },
                { en: 'Moon', hi: 'चन्द्र', color: '#94a3b8' },
              ].map((p, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: p.color + '25', color: p.color, border: `1px solid ${p.color}40` }}
                  >
                    {isHi ? p.hi : p.en}
                  </span>
                  {i < 6 && <span className="text-text-tertiary text-sm">→</span>}
                  {i === 6 && <span className="text-text-tertiary text-sm">↺</span>}
                </span>
              ))}
            </div>
            <p className="text-text-tertiary text-xs text-center mt-2">
              {isHi ? '24 होराएँ = 3 पूर्ण चक्र + 3 अतिरिक्त → अगले दिन का स्वामी' : '24 horas = 3 full cycles + 3 extra → determines next day\'s lord'}
            </p>
          </div>

          {/* Weekday derivation step-by-step */}
          <div>
            <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 mt-4">
              {t('s3weekLabel')}
            </p>
            <div className="space-y-2">
              {WEEKDAY_DERIVATION.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-white/3 border border-white/6 text-sm"
                >
                  <span className="font-bold min-w-[90px]" style={{ color: row.color }}>
                    {lt(row.day as LocaleText, locale)}
                  </span>
                  <span className="text-text-tertiary text-xs">
                    ({isHi ? 'स्वामी:' : 'lord:'}{' '}
                    <span style={{ color: row.color }}>{lt(row.lord as LocaleText, locale)}</span>)
                  </span>
                  <span className="text-text-tertiary mx-1">→</span>
                  <span className="text-text-tertiary text-xs">
                    {isHi ? '25वीं होरा =' : '25th hora ='}
                  </span>
                  <span className="font-bold text-xs" style={{ color: row.nextColor }}>
                    {lt(row.hora25 as LocaleText, locale)}
                  </span>
                  <span className="text-text-tertiary mx-1">→</span>
                  <span className="font-bold text-xs" style={{ color: row.nextColor }}>
                    {lt(row.next as LocaleText, locale)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Highlight callout */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 mt-4">
            <p className="text-indigo-200 text-sm leading-relaxed font-medium">
              {isHi
                ? 'यह संयोग नहीं है। इन विशेष ग्रह-दिन नियुक्तियों वाला 7-दिवसीय सप्ताह कैल्डियन क्रम पर लागू होरा पद्धति का प्रत्यक्ष गणितीय परिणाम है।'
                : 'This is NOT a coincidence. The 7-day week with these specific day-planet assignments is a DIRECT mathematical consequence of the hora system applied to the Chaldean order.'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 4: Weekday Names Comparison ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t('s4Title')}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t('s4p1')}</p>

          {/* Weekday comparison table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">#</th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'संस्कृत' : 'Sanskrit'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'हिन्दी' : 'Hindi'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold hidden sm:table-cell">
                    {isHi ? 'अंग्रेज़ी' : 'English'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold hidden md:table-cell">
                    {isHi ? 'लैटिन' : 'Latin'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'ग्रह' : 'Planet'}
                  </th>
                  <th className="text-left py-2.5 px-2 text-gold-dark text-xs uppercase tracking-widest font-bold hidden lg:table-cell">
                    {isHi ? 'अंग्रेज़ी व्युत्पत्ति' : 'English etymology'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {WEEKDAYS.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-2 text-text-tertiary text-xs">{row.num}</td>
                    <td className="py-3 px-2 text-text-primary font-medium text-xs">{row.sanskrit}</td>
                    <td className="py-3 px-2 font-bold text-sm" style={{ color: row.color, fontFamily: isDevanagari ? 'var(--font-devanagari-body)' : undefined }}>{row.hi}</td>
                    <td className="py-3 px-2 text-text-primary text-xs hidden sm:table-cell">{row.en}</td>
                    <td className="py-3 px-2 text-text-tertiary text-xs italic hidden md:table-cell">{row.latin}</td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-xs px-2 py-1 rounded-full" style={{ backgroundColor: row.color + '20', color: row.color }}>
                        {lt(row.planet as LocaleText, locale)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-text-tertiary text-xs hidden lg:table-cell">{lt(row.norse as LocaleText, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>{t('s4p2')}</p>

          <div className="p-4 rounded-xl bg-gold-primary/6 border border-gold-primary/20">
            <p className="text-gold-light/90 text-sm leading-relaxed">
              {isHi
                ? 'संस्कृत नाम सीधे ग्रह नाम + "वार" का उपयोग करते हैं। अंग्रेज़ी नाम नॉर्स/जर्मनिक देवताओं का उपयोग करते हैं जिन्हें उन्हीं ग्रहों से मैप किया गया था। सभी संस्कृतियों में अन्तर्निहित ग्रह नियुक्ति समान है — क्योंकि वे सभी एक ही होरा पद्धति से उत्पन्न हैं।'
                : 'Sanskrit names directly use the planet name + "vara" (वार = day). English names use Norse/Germanic gods mapped to the same planets. The underlying planetary assignment is identical across all cultures — because they all derive from the same hora system.'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 5: Hora in Practice ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            5
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t('s5Title')}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t('s5p1')}</p>

          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            {HORA_PRACTICE.map((hp, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.015 }}
                className={`rounded-xl p-4 border ${hp.border} ${hp.bg} transition-colors`}
              >
                <h4 className="font-bold text-sm mb-2" style={{ color: hp.color }}>
                  {lt(hp.planet as LocaleText, locale)}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">{lt(hp.activities as LocaleText, locale)}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/vedic-time"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {isHi ? 'वैदिक समय उपकरण' : 'Vedic Time Tool'}
            </Link>
            <Link
              href="/muhurta-ai"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {isHi ? 'मुहूर्त AI' : 'Muhurta AI Tool'}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 6: Rahu & Ketu ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-6 sm:p-8 mb-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            6
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {t('s6Title')}
          </h2>
        </div>
        <div className="ml-12 space-y-4 text-text-secondary text-base leading-relaxed">
          <p>{t('s6p1')}</p>
          <p>{t('s6p2')}</p>

          {/* Rahu / Ketu visual cards */}
          <div className="grid sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
              <h4 className="text-purple-300 font-bold text-sm mb-2">
                {isHi ? 'राहु (Rahu)' : 'Rahu — Ascending Node'}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'आरोही चंद्र पात — वह बिन्दु जहाँ चंद्रमा दक्षिण से उत्तर की ओर क्रान्तिवृत्त को पार करता है। उत्तर नोड। ~18.6 वर्षीय चक्र। राहु काल प्रत्येक दिन होरा अनुक्रम से व्युत्पन्न होता है।'
                  : 'The ascending lunar node — where the Moon crosses the ecliptic moving northward. The North Node. ~18.6-year cycle. Rahu Kaal each day is derived from the hora sequence.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/8 border border-slate-500/20">
              <h4 className="text-slate-300 font-bold text-sm mb-2">
                {isHi ? 'केतु (Ketu)' : 'Ketu — Descending Node'}
              </h4>
              <p className="text-text-secondary text-xs leading-relaxed">
                {isHi
                  ? 'अवरोही चंद्र पात — वह बिन्दु जहाँ चंद्रमा उत्तर से दक्षिण की ओर क्रान्तिवृत्त को पार करता है। दक्षिण नोड। राहु के ठीक सामने (180° विपरीत)। दोनों सदा विपरीत दिशाओं में होते हैं।'
                  : 'The descending lunar node — where the Moon crosses the ecliptic moving southward. South Node. Always exactly opposite Rahu (180° apart). Eclipses require the Moon near a node at new/full Moon.'}
              </p>
            </div>
          </div>

          <p>{t('s6p3')}</p>

          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/learn/eclipses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200 text-sm hover:bg-purple-500/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {isHi ? 'ग्रहण के बारे में जानें' : 'Learn about Eclipses'}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ═══ Section 7: Classical Sources ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('s7Title')}
        </h3>
        <div className="space-y-5">
          {[
            { label: { en: 'Surya Siddhanta (Ch. 12)', hi: 'सूर्य सिद्धान्त (अ.12)', sa: 'सूर्य सिद्धान्त (अ.12)', mai: 'सूर्य सिद्धान्त (अ.12)', mr: 'सूर्य सिद्धान्त (अ.12)', ta: 'Surya Siddhanta (Ch. 12)', te: 'Surya Siddhanta (Ch. 12)', bn: 'Surya Siddhanta (Ch. 12)', kn: 'Surya Siddhanta (Ch. 12)', gu: 'Surya Siddhanta (Ch. 12)' }, text: L.srcSurya, color: 'border-amber-500/20' },
            { label: { en: 'Aryabhatiya (499 CE)', hi: 'आर्यभटीय (499 ई.)', sa: 'आर्यभटीय (499 ई.)', mai: 'आर्यभटीय (499 ई.)', mr: 'आर्यभटीय (499 ई.)', ta: 'Aryabhatiya (499 CE)', te: 'Aryabhatiya (499 CE)', bn: 'Aryabhatiya (499 CE)', kn: 'Aryabhatiya (499 CE)', gu: 'Aryabhatiya (499 CE)' }, text: L.srcAryabhata, color: 'border-emerald-500/20' },
            { label: { en: 'Brihat Samhita (Ch. 2)', hi: 'बृहत् संहिता (अ.2)', sa: 'बृहत् संहिता (अ.2)', mai: 'बृहत् संहिता (अ.2)', mr: 'बृहत् संहिता (अ.2)', ta: 'Brihat Samhita (Ch. 2)', te: 'Brihat Samhita (Ch. 2)', bn: 'Brihat Samhita (Ch. 2)', kn: 'Brihat Samhita (Ch. 2)', gu: 'Brihat Samhita (Ch. 2)' }, text: L.srcBrihat, color: 'border-violet-500/20' },
            { label: { en: 'Arthashastra (~300 BCE)', hi: 'अर्थशास्त्र (~300 ई.पू.)', sa: 'अर्थशास्त्र (~300 ई.पू.)', mai: 'अर्थशास्त्र (~300 ई.पू.)', mr: 'अर्थशास्त्र (~300 ई.पू.)', ta: 'Arthashastra (~300 BCE)', te: 'Arthashastra (~300 BCE)', bn: 'Arthashastra (~300 BCE)', kn: 'Arthashastra (~300 BCE)', gu: 'Arthashastra (~300 BCE)' }, text: L.srcArthashastra, color: 'border-blue-500/20' },
            { label: { en: 'Yajnavalkya Smriti (Ch. 1)', hi: 'याज्ञवल्क्य स्मृति (अ.1)', sa: 'याज्ञवल्क्य स्मृति (अ.1)', mai: 'याज्ञवल्क्य स्मृति (अ.1)', mr: 'याज्ञवल्क्य स्मृति (अ.1)', ta: 'Yajnavalkya Smriti (Ch. 1)', te: 'Yajnavalkya Smriti (Ch. 1)', bn: 'Yajnavalkya Smriti (Ch. 1)', kn: 'Yajnavalkya Smriti (Ch. 1)', gu: 'Yajnavalkya Smriti (Ch. 1)' }, text: L.srcYajnavalkya, color: 'border-gold-primary/20' },
            { label: { en: 'Romaka Siddhanta', hi: 'रोमक सिद्धान्त', sa: 'रोमक सिद्धान्त', mai: 'रोमक सिद्धान्त', mr: 'रोमक सिद्धान्त', ta: 'Romaka Siddhanta', te: 'Romaka Siddhanta', bn: 'Romaka Siddhanta', kn: 'Romaka Siddhanta', gu: 'Romaka Siddhanta' }, text: L.srcRomaka, color: 'border-red-500/20' },
          ].map((src, i) => (
            <div key={i} className={`border ${src.color} rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]`}>
              <div className="text-gold-light font-bold text-sm mb-2" style={headingFont}>{lt(src.label as LocaleText, locale)}</div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{lt(src.text as LocaleText, locale)}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Cross-references ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2" style={headingFont}>
          <BookOpen className="w-5 h-5 text-gold-light flex-shrink-0" />
          {t('related')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/vedic-time', label: { en: 'Vedic Time', hi: 'वैदिक समय', sa: 'वैदिक समय', mai: 'वैदिक समय', mr: 'वैदिक समय', ta: 'Vedic Time', te: 'Vedic Time', bn: 'Vedic Time', kn: 'Vedic Time', gu: 'Vedic Time' } },
            { href: '/learn/vara', label: { en: 'Learn: Vara (Weekdays)', hi: 'सीखें: वार', sa: 'सीखें: वार', mai: 'सीखें: वार', mr: 'सीखें: वार', ta: 'Learn: Vara (Weekdays)', te: 'Learn: Vara (Weekdays)', bn: 'Learn: Vara (Weekdays)', kn: 'Learn: Vara (Weekdays)', gu: 'Learn: Vara (Weekdays)' } },
            { href: '/learn/muhurtas', label: { en: 'Learn: Muhurtas', hi: 'सीखें: मुहूर्त', sa: 'सीखें: मुहूर्त', mai: 'सीखें: मुहूर्त', mr: 'सीखें: मुहूर्त', ta: 'Learn: Muhurtas', te: 'Learn: Muhurtas', bn: 'Learn: Muhurtas', kn: 'Learn: Muhurtas', gu: 'Learn: Muhurtas' } },
            { href: '/learn/eclipses', label: { en: 'Learn: Eclipses', hi: 'सीखें: ग्रहण', sa: 'सीखें: ग्रहण', mai: 'सीखें: ग्रहण', mr: 'सीखें: ग्रहण', ta: 'Learn: Eclipses', te: 'Learn: Eclipses', bn: 'Learn: Eclipses', kn: 'Learn: Eclipses', gu: 'Learn: Eclipses' } },
            { href: '/learn/grahas', label: { en: 'Learn: The Nine Grahas', hi: 'सीखें: नवग्रह', sa: 'सीखें: नवग्रह', mai: 'सीखें: नवग्रह', mr: 'सीखें: नवग्रह', ta: 'Learn: The Nine Grahas', te: 'Learn: The Nine Grahas', bn: 'Learn: The Nine Grahas', kn: 'Learn: The Nine Grahas', gu: 'Learn: The Nine Grahas' } },
            { href: '/muhurta-ai', label: { en: 'Muhurta AI', hi: 'मुहूर्त AI', sa: 'मुहूर्त AI', mai: 'मुहूर्त AI', mr: 'मुहूर्त AI', ta: 'Muhurta AI', te: 'Muhurta AI', bn: 'Muhurta AI', kn: 'Muhurta AI', gu: 'Muhurta AI' } },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href as '/'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              {lt(link.label as LocaleText, locale)}
            </Link>
          ))}
        </div>
      </motion.div>

    </main>
  );
}

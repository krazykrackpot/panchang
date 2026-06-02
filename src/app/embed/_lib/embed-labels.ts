/**
 * Static UI labels for /embed/* widgets — "Tithi", "Nakshatra", "Sunrise"
 * etc. NOT the data values themselves; those come from the panchang
 * engine's Trilingual objects via `tl()`.
 *
 * All 9 visible locales filled in directly. NO Hindi fallback for
 * Devanagari locales — the 2026-05-31 Marathi duplicate-content
 * de-rank was triggered by exactly that fallback. The discipline
 * established for the homepage capability strip extends here.
 *
 * Locale not in the table falls back to English (NOT to Hindi) via the
 * `tl()` helper at the call site. Anything you change here, also change
 * in `feature-catalog.ts` and the homepage chips — the three surfaces
 * must stay editorially consistent.
 */

import type { VisibleLocale } from './params';

export interface EmbedLabels {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string;
  sunrise: string;
  sunset: string;
  until: string;
  configError: string;
  upcomingFestivals: string;
  noFestivals: string;
  poweredBy: string;
}

const LABELS: Record<VisibleLocale, EmbedLabels> = {
  en: {
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    vara: 'Vara',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    until: 'until',
    configError: 'Configuration Error',
    upcomingFestivals: 'Upcoming Festivals',
    noFestivals: 'No festivals in this window',
    poweredBy: 'Powered by',
  },
  hi: {
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    vara: 'वार',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    until: 'तक',
    configError: 'सेटअप त्रुटि',
    upcomingFestivals: 'आगामी त्योहार',
    noFestivals: 'इस अवधि में कोई त्योहार नहीं',
    poweredBy: 'द्वारा संचालित',
  },
  mr: {
    tithi: 'तिथी',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    vara: 'वार',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    until: 'पर्यंत',
    configError: 'सेटअप त्रुटी',
    upcomingFestivals: 'येणारे सण',
    noFestivals: 'या कालावधीत सण नाहीत',
    poweredBy: 'संचालित',
  },
  mai: {
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    vara: 'वार',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    until: 'धरि',
    configError: 'सेटअप त्रुटि',
    upcomingFestivals: 'आबय बाला पाबनि',
    noFestivals: 'एहि अवधि मे कोनो पाबनि नहि',
    poweredBy: 'द्वारा संचालित',
  },
  ta: {
    tithi: 'திதி',
    nakshatra: 'நட்சத்திரம்',
    yoga: 'யோகம்',
    karana: 'கரணம்',
    vara: 'வாரம்',
    sunrise: 'சூரிய உதயம்',
    sunset: 'சூரிய அஸ்தமனம்',
    until: 'வரை',
    configError: 'அமைப்புப் பிழை',
    upcomingFestivals: 'வரவிருக்கும் பண்டிகைகள்',
    noFestivals: 'இந்த காலகட்டத்தில் பண்டிகைகள் இல்லை',
    poweredBy: 'இயக்கப்படுகிறது',
  },
  te: {
    tithi: 'తిథి',
    nakshatra: 'నక్షత్రం',
    yoga: 'యోగం',
    karana: 'కరణం',
    vara: 'వారం',
    sunrise: 'సూర్యోదయం',
    sunset: 'సూర్యాస్తమయం',
    until: 'వరకు',
    configError: 'సెటప్ లోపం',
    upcomingFestivals: 'రాబోయే పండుగలు',
    noFestivals: 'ఈ కాలవ్యవధిలో పండుగలు లేవు',
    poweredBy: 'శక్తినిచ్చేది',
  },
  bn: {
    tithi: 'তিথি',
    nakshatra: 'নক্ষত্র',
    yoga: 'যোগ',
    karana: 'করণ',
    vara: 'বার',
    sunrise: 'সূর্যোদয়',
    sunset: 'সূর্যাস্ত',
    until: 'পর্যন্ত',
    configError: 'সেটআপ ত্রুটি',
    upcomingFestivals: 'আসন্ন উৎসব',
    noFestivals: 'এই সময়ে কোনো উৎসব নেই',
    poweredBy: 'চালিত',
  },
  gu: {
    tithi: 'તિથિ',
    nakshatra: 'નક્ષત્ર',
    yoga: 'યોગ',
    karana: 'કરણ',
    vara: 'વાર',
    sunrise: 'સૂર્યોદય',
    sunset: 'સૂર્યાસ્ત',
    until: 'સુધી',
    configError: 'સેટઅપ ભૂલ',
    upcomingFestivals: 'આગામી તહેવારો',
    noFestivals: 'આ સમયગાળામાં કોઈ તહેવાર નથી',
    poweredBy: 'સંચાલિત',
  },
  kn: {
    tithi: 'ತಿಥಿ',
    nakshatra: 'ನಕ್ಷತ್ರ',
    yoga: 'ಯೋಗ',
    karana: 'ಕರಣ',
    vara: 'ವಾರ',
    sunrise: 'ಸೂರ್ಯೋದಯ',
    sunset: 'ಸೂರ್ಯಾಸ್ತ',
    until: 'ತನಕ',
    configError: 'ಸೆಟಪ್ ದೋಷ',
    upcomingFestivals: 'ಮುಂಬರುವ ಹಬ್ಬಗಳು',
    noFestivals: 'ಈ ಅವಧಿಯಲ್ಲಿ ಹಬ್ಬಗಳಿಲ್ಲ',
    poweredBy: 'ಶಕ್ತಿಯಿಂದ',
  },
};

export function getEmbedLabels(locale: VisibleLocale): EmbedLabels {
  return LABELS[locale] ?? LABELS.en;
}

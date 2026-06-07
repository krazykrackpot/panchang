/**
 * "Today's Significance" — server-rendered section dropped onto the three
 * date-keyed page templates (/choghadiya/[date], /panchang/date/[date],
 * /gauri-panchang/[date]) to break the per-date duplicate-content signal.
 *
 * Two stacked content blocks:
 *   1. Tithi-observance paragraph (from tithi-observances data; ~60-90
 *      words per tithi; varies across all 30 tithis × 9 locales).
 *   2. "Next festival" callout (from getNextFestival; computed per date
 *      with full festival-defs lookup).
 *
 * Both blocks render in the user's locale — no client-side i18n, no
 * mid-render fetch. SSR-safe; never reads `new Date()` (Lesson ZD).
 */
import { getTithiObservance } from '@/lib/constants/tithi-observances';
import { getWeekdaySignificance } from '@/lib/constants/weekday-significance';
import { getNextFestival } from '@/lib/calendar/next-festival';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import Link from 'next/link';
import { Sparkles, CalendarDays, Sun } from 'lucide-react';

// Tithi name lookup (1-30 → LocaleText). Mirrors src/lib/constants/tithis.ts
// inline so we don't pull the full TITHIS array into the bundle for a
// single field. Kept in sync with tithis.ts — both update in one commit.
const TITHI_NAMES: Record<number, Record<string, string>> = {
  1:  { en: 'Pratipada',   hi: 'प्रतिपदा',   mai: 'प्रतिपदा',   mr: 'प्रतिपदा',  ta: 'பிரதமை',  te: 'ప్రతిపద',  bn: 'প্রতিপদ',  kn: 'ಪ್ರತಿಪದ',  gu: 'પ્રતિપદા' },
  2:  { en: 'Dwitiya',     hi: 'द्वितीया',    mai: 'द्वितीया',    mr: 'द्वितीया',   ta: 'துவிதியை', te: 'విదియ',    bn: 'দ্বিতীয়া', kn: 'ದ್ವಿತೀಯ',   gu: 'દ્વિતીયા' },
  3:  { en: 'Tritiya',     hi: 'तृतीया',     mai: 'तृतीया',     mr: 'तृतीया',    ta: 'திருதியை', te: 'తదియ',    bn: 'তৃতীয়া',  kn: 'ತೃತೀಯ',    gu: 'તૃતીયા' },
  4:  { en: 'Chaturthi',   hi: 'चतुर्थी',    mai: 'चतुर्थी',    mr: 'चतुर्थी',   ta: 'சதுர்த்தி', te: 'చవితి',    bn: 'চতুর্থী',   kn: 'ಚತುರ್ಥಿ',   gu: 'ચતુર્થી' },
  5:  { en: 'Panchami',    hi: 'पंचमी',     mai: 'पंचमी',     mr: 'पंचमी',    ta: 'பஞ்சமி',   te: 'పంచమి',    bn: 'পঞ্চমী',   kn: 'ಪಂಚಮಿ',     gu: 'પંચમી' },
  6:  { en: 'Shashthi',    hi: 'षष्ठी',     mai: 'षष्ठी',     mr: 'षष्ठी',    ta: 'சஷ்டி',   te: 'షష్ఠి',     bn: 'ষষ্ঠী',    kn: 'ಷಷ್ಠಿ',     gu: 'ષષ્ઠી' },
  7:  { en: 'Saptami',     hi: 'सप्तमी',    mai: 'सप्तमी',    mr: 'सप्तमी',   ta: 'சப்தமி',  te: 'సప్తమి',    bn: 'সপ্তমী',   kn: 'ಸಪ್ತಮಿ',    gu: 'સપ્તમી' },
  8:  { en: 'Ashtami',     hi: 'अष्टमी',    mai: 'अष्टमी',    mr: 'अष्टमी',   ta: 'அஷ்டமி',  te: 'అష్టమి',    bn: 'অষ্টমী',   kn: 'ಅಷ್ಟಮಿ',    gu: 'અષ્ટમી' },
  9:  { en: 'Navami',      hi: 'नवमी',     mai: 'नवमी',     mr: 'नवमी',    ta: 'நவமி',   te: 'నవమి',    bn: 'নবমী',    kn: 'ನವಮಿ',     gu: 'નવમી' },
  10: { en: 'Dashami',     hi: 'दशमी',     mai: 'दशमी',     mr: 'दशमी',    ta: 'தசமி',   te: 'దశమి',    bn: 'দশমী',    kn: 'ದಶಮಿ',     gu: 'દશમી' },
  11: { en: 'Ekadashi',    hi: 'एकादशी',    mai: 'एकादशी',    mr: 'एकादशी',   ta: 'ஏகாதசி',  te: 'ఏకాదశి',   bn: 'একাদশী',  kn: 'ಏಕಾದಶಿ',    gu: 'એકાદશી' },
  12: { en: 'Dwadashi',    hi: 'द्वादशी',   mai: 'द्वादशी',   mr: 'द्वादशी',  ta: 'துவாதசி', te: 'ద్వాదశి',   bn: 'দ্বাদশী',  kn: 'ದ್ವಾದಶಿ',   gu: 'દ્વાદશી' },
  13: { en: 'Trayodashi',  hi: 'त्रयोदशी',  mai: 'त्रयोदशी',  mr: 'त्रयोदशी', ta: 'திரயோதசி', te: 'త్రయోదశి',  bn: 'ত্রয়োদশী', kn: 'ತ್ರಯೋದಶಿ', gu: 'ત્રયોદશી' },
  14: { en: 'Chaturdashi', hi: 'चतुर्दशी',  mai: 'चतुर्दशी',  mr: 'चतुर्दशी', ta: 'சதுர்த்தசி',te: 'చతుర్దశి',  bn: 'চতুর্দশী', kn: 'ಚತುರ್ದಶಿ', gu: 'ચતુર્દશી' },
  15: { en: 'Purnima',     hi: 'पूर्णिमा',   mai: 'पूर्णिमा',   mr: 'पौर्णिमा',  ta: 'பௌர்ணமி',  te: 'పూర్ణిమ',   bn: 'পূর্ণিমা',  kn: 'ಪೂರ್ಣಿಮೆ',   gu: 'પૂર્ણિમા' },
  16: { en: 'Pratipada',   hi: 'प्रतिपदा',   mai: 'प्रतिपदा',   mr: 'प्रतिपदा',  ta: 'பிரதமை',  te: 'ప్రతిపద',  bn: 'প্রতিপদ',  kn: 'ಪ್ರತಿಪದ',  gu: 'પ્રતિપદા' },
  17: { en: 'Dwitiya',     hi: 'द्वितीया',    mai: 'द्वितीया',    mr: 'द्वितीया',   ta: 'துவிதியை', te: 'విదియ',    bn: 'দ্বিতীয়া', kn: 'ದ್ವಿತೀಯ',   gu: 'દ્વિતીયા' },
  18: { en: 'Tritiya',     hi: 'तृतीया',     mai: 'तृतीया',     mr: 'तृतीया',    ta: 'திருதியை', te: 'తదియ',    bn: 'তৃতীয়া',  kn: 'ತೃತೀಯ',    gu: 'તૃતીયા' },
  19: { en: 'Chaturthi',   hi: 'चतुर्थी',    mai: 'चतुर्थी',    mr: 'चतुर्थी',   ta: 'சதுர்த்தி', te: 'చవితి',    bn: 'চতুর্থী',   kn: 'ಚತುರ್ಥಿ',   gu: 'ચતુર્થી' },
  20: { en: 'Panchami',    hi: 'पंचमी',     mai: 'पंचमी',     mr: 'पंचमी',    ta: 'பஞ்சமி',   te: 'పంచమి',    bn: 'পঞ্চমী',   kn: 'ಪಂಚಮಿ',     gu: 'પંચમી' },
  21: { en: 'Shashthi',    hi: 'षष्ठी',     mai: 'षष्ठी',     mr: 'षष्ठी',    ta: 'சஷ்டி',   te: 'షష్ఠి',     bn: 'ষষ্ঠী',    kn: 'ಷಷ್ಠಿ',     gu: 'ષષ્ઠી' },
  22: { en: 'Saptami',     hi: 'सप्तमी',    mai: 'सप्तमी',    mr: 'सप्तमी',   ta: 'சப்தமி',  te: 'సప్తమి',    bn: 'সপ্তমী',   kn: 'ಸಪ್ತಮಿ',    gu: 'સપ્તમી' },
  23: { en: 'Ashtami',     hi: 'अष्टमी',    mai: 'अष्टमी',    mr: 'अष्टमी',   ta: 'அஷ்டமி',  te: 'అష్టమి',    bn: 'অষ্টমী',   kn: 'ಅಷ್ಟಮಿ',    gu: 'અષ્ટમી' },
  24: { en: 'Navami',      hi: 'नवमी',     mai: 'नवमी',     mr: 'नवमी',    ta: 'நவமி',   te: 'నవమి',    bn: 'নবমী',    kn: 'ನವಮಿ',     gu: 'નવમી' },
  25: { en: 'Dashami',     hi: 'दशमी',     mai: 'दशमी',     mr: 'दशमी',    ta: 'தசமி',   te: 'దశమి',    bn: 'দশমী',    kn: 'ದಶಮಿ',     gu: 'દશમી' },
  26: { en: 'Ekadashi',    hi: 'एकादशी',    mai: 'एकादशी',    mr: 'एकादशी',   ta: 'ஏகாதசி',  te: 'ఏకాదశి',   bn: 'একাদশী',  kn: 'ಏಕಾದಶಿ',    gu: 'એકાદશી' },
  27: { en: 'Dwadashi',    hi: 'द्वादशी',   mai: 'द्वादशी',   mr: 'द्वादशी',  ta: 'துவாதசி', te: 'ద్వాదశి',   bn: 'দ্বাদশী',  kn: 'ದ್ವಾದಶಿ',   gu: 'દ્વાદશી' },
  28: { en: 'Trayodashi',  hi: 'त्रयोदशी',  mai: 'त्रयोदशी',  mr: 'त्रयोदशी', ta: 'திரயோதசி', te: 'త్రయోదశి',  bn: 'ত্রয়োদশী', kn: 'ತ್ರಯೋದಶಿ', gu: 'ત્રયોદશી' },
  29: { en: 'Chaturdashi', hi: 'चतुर्दशी',  mai: 'चतुर्दशी',  mr: 'चतुर्दशी', ta: 'சதுர்த்தசி',te: 'చతుర్దశి',  bn: 'চতুর্দশী', kn: 'ಚತುರ್ದಶಿ', gu: 'ચતુર્દશી' },
  30: { en: 'Amavasya',    hi: 'अमावस्या',   mai: 'अमावस्या',   mr: 'अमावस्या',  ta: 'அமாவாசை', te: 'అమావాస్య', bn: 'অমাবস্যা', kn: 'ಅಮಾವಾಸ್ಯೆ', gu: 'અમાવસ્યા' },
};

// Heading labels per locale. Inline because this is a single-purpose
// component; if more locale strings accumulate, migrate to JSON.
const HEADING_TITHI: Record<string, string> = {
  en: "Today's Tithi & Significance",
  hi: 'आज की तिथि और महत्व',
  mai: 'आजुक तिथि आ महत्व',
  mr: 'आजची तिथी आणि महत्त्व',
  ta: 'இன்றைய திதி & முக்கியத்துவம்',
  te: 'నేటి తిథి & ప్రాముఖ్యత',
  bn: 'আজকের তিথি ও তাৎপর্য',
  kn: 'ಇಂದಿನ ತಿಥಿ ಮತ್ತು ಪ್ರಾಮುಖ್ಯತೆ',
  gu: 'આજની તિથિ અને મહત્ત્વ',
};

const HEADING_NEXT: Record<string, string> = {
  en: 'Next Major Festival',
  hi: 'अगला प्रमुख पर्व',
  mai: 'अगिला प्रमुख पर्व',
  mr: 'पुढील प्रमुख सण',
  ta: 'அடுத்த முக்கிய பண்டிகை',
  te: 'తదుపరి ప్రధాన పండుగ',
  bn: 'পরবর্তী প্রধান উৎসব',
  kn: 'ಮುಂದಿನ ಪ್ರಮುಖ ಹಬ್ಬ',
  gu: 'આગામી મુખ્ય તહેવાર',
};

// 0=Sun .. 6=Sat — name + ruling planet displayed in the weekday-character heading.
const WEEKDAY_NAMES: Record<number, Record<string, string>> = {
  0: { en: 'Sunday',    hi: 'रविवार',   mai: 'रविदिन',  mr: 'रविवार',   ta: 'ஞாயிறு',     te: 'ఆదివారం',  bn: 'রবিবার',    kn: 'ಭಾನುವಾರ',  gu: 'રવિવાર' },
  1: { en: 'Monday',    hi: 'सोमवार',   mai: 'सोमदिन',  mr: 'सोमवार',   ta: 'திங்கள்',    te: 'సోమవారం',  bn: 'সোমবার',    kn: 'ಸೋಮವಾರ',  gu: 'સોમવાર' },
  2: { en: 'Tuesday',   hi: 'मंगलवार',  mai: 'मंगलदिन', mr: 'मंगळवार',  ta: 'செவ்வாய்',  te: 'మంగళవారం', bn: 'মঙ্গলবার',  kn: 'ಮಂಗಳವಾರ', gu: 'મંગળવાર' },
  3: { en: 'Wednesday', hi: 'बुधवार',   mai: 'बुधदिन',  mr: 'बुधवार',   ta: 'புதன்',     te: 'బుధవారం',  bn: 'বুধবার',    kn: 'ಬುಧವಾರ',  gu: 'બુધવાર' },
  4: { en: 'Thursday',  hi: 'गुरुवार',  mai: 'गुरुदिन', mr: 'गुरुवार',  ta: 'வியாழன்',  te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', gu: 'ગુરુવાર' },
  5: { en: 'Friday',    hi: 'शुक्रवार', mai: 'शुक्रदिन',mr: 'शुक्रवार', ta: 'வெள்ளி',   te: 'శుక్రవారం', bn: 'শুক্রবার',  kn: 'ಶುಕ್ರವಾರ', gu: 'શુક્રવાર' },
  6: { en: 'Saturday',  hi: 'शनिवार',   mai: 'शनिदिन',  mr: 'शनिवार',   ta: 'சனி',       te: 'శనివారం',  bn: 'শনিবার',    kn: 'ಶನಿವಾರ',   gu: 'શનિવાર' },
};

const HEADING_WEEKDAY: Record<string, string> = {
  en: "Today's Weekday Character",
  hi: 'आज के वार का स्वभाव',
  mai: 'आजुक वारक स्वभाव',
  mr: 'आजच्या वाराचे स्वरूप',
  ta: 'இன்றைய வாரத்தின் தன்மை',
  te: 'నేటి వార స్వభావం',
  bn: 'আজকের বারের চরিত্র',
  kn: 'ಇಂದಿನ ವಾರದ ಸ್ವಭಾವ',
  gu: 'આજના વારનો સ્વભાવ',
};

function daysAwayLabel(n: number, locale: string): string {
  if (n === 0) {
    const today: Record<string, string> = {
      en: 'today', hi: 'आज', mai: 'आजु', mr: 'आज', ta: 'இன்று',
      te: 'ఈరోజు', bn: 'আজ', kn: 'ಇಂದು', gu: 'આજે',
    };
    return today[locale] ?? today.en;
  }
  if (n === 1) {
    const tom: Record<string, string> = {
      en: 'tomorrow', hi: 'कल', mai: 'काल्हि', mr: 'उद्या', ta: 'நாளை',
      te: 'రేపు', bn: 'আগামীকাল', kn: 'ನಾಳೆ', gu: 'આવતીકાલે',
    };
    return tom[locale] ?? tom.en;
  }
  const inN: Record<string, (n: number) => string> = {
    en:  n => `in ${n} days`,
    hi:  n => `${n} दिन में`,
    mai: n => `${n} दिनक बाद`,
    mr:  n => `${n} दिवसांत`,
    ta:  n => `${n} நாட்களில்`,
    te:  n => `${n} రోజుల్లో`,
    bn:  n => `${n} দিনে`,
    kn:  n => `${n} ದಿನಗಳಲ್ಲಿ`,
    gu:  n => `${n} દિવસમાં`,
  };
  return (inN[locale] ?? inN.en)(n);
}

export interface TodaySignificanceSectionProps {
  /** Tithi number 1-30 (1-15 shukla, 16-30 krishna) for the page's date. */
  tithiNumber: number;
  /** JS-style weekday number 0=Sunday..6=Saturday for the page's date. */
  weekday: number;
  /** The date being displayed, YYYY-MM-DD. */
  dateStr: string;
  /** City lat/lng/timezone for the festival-proximity computation. */
  lat: number;
  lng: number;
  timezone: string;
  locale: string;
}

export default function TodaySignificanceSection({
  tithiNumber,
  weekday,
  dateStr,
  lat,
  lng,
  timezone,
  locale,
}: TodaySignificanceSectionProps) {
  const observance = getTithiObservance(tithiNumber);
  const weekdaySig = getWeekdaySignificance(weekday);
  const nextFestival = getNextFestival(dateStr, lat, lng, timezone);
  const isHi = isDevanagariLocale(locale);
  const tithiName = TITHI_NAMES[tithiNumber]?.[locale] ?? TITHI_NAMES[tithiNumber]?.en ?? '';
  const weekdayName = WEEKDAY_NAMES[weekday]?.[locale] ?? WEEKDAY_NAMES[weekday]?.en ?? '';
  const tithiHeading = HEADING_TITHI[locale] ?? HEADING_TITHI.en;
  const weekdayHeading = HEADING_WEEKDAY[locale] ?? HEADING_WEEKDAY.en;
  const festivalHeading = HEADING_NEXT[locale] ?? HEADING_NEXT.en;

  // If no block has content, render nothing — never a hollow card.
  if (!observance && !weekdaySig && !nextFestival) return null;

  const introText = observance?.intro?.[locale as keyof typeof observance.intro]
    ?? observance?.intro?.en;
  const weekdayText = weekdaySig?.intro?.[locale as keyof typeof weekdaySig.intro]
    ?? weekdaySig?.intro?.en;

  // Bottom-margin helper — each block needs mb-6 only if SOMETHING follows it.
  const hasWeekday = !!(weekdaySig && weekdayText);
  const hasFestival = !!nextFestival;

  return (
    <section className="mt-8 mb-8 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-7">
      {observance && introText ? (
        <div className={hasWeekday || hasFestival ? 'mb-6' : ''}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-gold-primary" />
            <h2 className="text-gold-light text-lg sm:text-xl font-semibold" style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
              {tithiHeading}{tithiName ? ` — ${tithiName}` : ''}
            </h2>
          </div>
          <p className="text-text-primary/85 text-sm sm:text-[0.95rem] leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {introText}
          </p>
        </div>
      ) : null}

      {hasWeekday ? (
        <div className={hasFestival ? 'mb-6' : ''}>
          <div className="flex items-center gap-2 mb-2">
            <Sun size={18} className="text-gold-primary" />
            <h2 className="text-gold-light text-base font-semibold" style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
              {weekdayHeading}{weekdayName ? ` — ${weekdayName}` : ''}
            </h2>
          </div>
          <p className="text-text-primary/85 text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {weekdayText}
          </p>
        </div>
      ) : null}

      {hasFestival && nextFestival ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={18} className="text-gold-primary" />
            <h2 className="text-gold-light text-base font-semibold" style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
              {festivalHeading}
            </h2>
          </div>
          <p className="text-text-primary/85 text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {nextFestival.festival.slug ? (
              <Link
                href={`/${locale}/festivals/${nextFestival.festival.slug}`}
                className="text-gold-light hover:text-gold-primary underline-offset-4 hover:underline transition-colors font-medium"
              >
                {tl(nextFestival.festival.name, locale)}
              </Link>
            ) : (
              <span className="text-gold-light font-medium">{tl(nextFestival.festival.name, locale)}</span>
            )}
            {' — '}
            <span className="text-text-secondary">{daysAwayLabel(nextFestival.daysAway, locale)}</span>
          </p>
        </div>
      ) : null}
    </section>
  );
}

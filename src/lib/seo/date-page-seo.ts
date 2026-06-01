/**
 * Per-locale SEO metadata for date-based pages (panchang/date, choghadiya,
 * horoscope). Lives here so the three page templates share one source of
 * truth and — critically — so adding a new locale to `Locale` triggers a
 * TypeScript error in three places until the new case is handled
 * explicitly.
 *
 * Why this module exists
 * ----------------------
 *
 * The pre-2026-06-01 templates used a boolean `isDevanagariLocale()` gate
 * to pick between "Hindi text" and "English text". When `mr` (Marathi)
 * and `mai` (Maithili) were added to the Devanagari union, they silently
 * routed into the Hindi branch — every Marathi date page emitted byte-
 * identical Hindi titles. Google's duplicate-content algorithm noticed
 * on 2026-05-31 14:00 UTC and dropped the affected locales out of
 * results (-76% Marathi clicks in 24h; Maithili crashed proportionally).
 *
 * The fix in PR #329 patched the Hindi fallback with explicit
 * `locale === 'mr'` / `locale === 'mai'` checks inside each template.
 * That works for those two locales but doesn't structurally prevent the
 * next "we added a locale and forgot the SEO copy" bug. The remaining
 * `else { English }` branch ALSO routes bn/te/gu/kn/ta into identical
 * English titles — the same duplicate-content time bomb, just less
 * visible because those locales draw less traffic.
 *
 * This module is the structural fix: every locale gets its own native-
 * script copy via an exhaustive `switch (locale)`. If `Locale` ever
 * grows a new member, the three callers fail to compile until each
 * adds a new `case`. No silent fallback into Hindi or English ever
 * again.
 *
 * Tests in __tests__/date-page-seo.test.ts assert all locales produce
 * pairwise-distinct titles + descriptions for the same date — the
 * exact invariant that would have failed before the hotfix and that
 * any future regression would break.
 */

import type { Locale } from '@/lib/i18n/config';

// ──────────────────────────────────────────────────────────────
// Compile-time exhaustiveness helper. `assertNever` errors if any
// `case` is missing from the switch — the TypeScript guarantee that
// makes this module the structural fix it claims to be.
// ──────────────────────────────────────────────────────────────

function assertNever(x: never): never {
  throw new Error(`[date-page-seo] unhandled locale: ${JSON.stringify(x)}`);
}

// ──────────────────────────────────────────────────────────────
// Shared inputs.
// `humanDate` is the locale-formatted date string (e.g. "1 जून 2026"
// for hi, "1 मे, 2026" for mr, "1 June 2026" for en) — produced by
// `formatSeoDate` in locale-fonts.ts. It's already locale-correct;
// these functions just wrap it with the per-locale SEO copy.
// ──────────────────────────────────────────────────────────────

export interface DateSeoInput {
  locale: Locale;
  humanDate: string;
}

export interface DateSeoOutput {
  title: string;
  description: string;
  keywords: string[];
}

// ──────────────────────────────────────────────────────────────
// /panchang/date/[date]
// ──────────────────────────────────────────────────────────────

export function panchangDateSeo({ locale, humanDate }: DateSeoInput): DateSeoOutput {
  switch (locale) {
    case 'en': return {
      title:       `${humanDate} Panchang — Tithi, Nakshatra, Sunrise, Rahu Kaal`,
      description: `Full Panchang for ${humanDate}. Tithi, Nakshatra, Yoga, Karana, Vara, sunrise, sunset, Rahu Kaal, Abhijit Muhurta — for Delhi. Accurate Vedic calculation.`,
      keywords:    ['panchang', `panchang ${humanDate}`, `${humanDate} panchang`, 'aaj ka panchang', 'today panchang', 'tithi', 'nakshatra', 'rahu kaal'],
    };
    case 'hi': return {
      title:       `${humanDate} का पंचांग — तिथि, नक्षत्र, राहु काल, सूर्योदय`,
      description: `${humanDate} का पूर्ण पंचांग। तिथि, नक्षत्र, योग, करण, वार, सूर्योदय, सूर्यास्त, राहु काल, अभिजित मुहूर्त — दिल्ली के लिए। सटीक वैदिक गणना।`,
      keywords:    ['पंचांग', `पंचांग ${humanDate}`, `${humanDate} पंचांग`, 'आज का पंचांग', 'तिथि', 'नक्षत्र', 'राहु काल'],
    };
    case 'mr': return {
      title:       `${humanDate} चे पंचांग — तिथी, नक्षत्र, राहू काळ, सूर्योदय`,
      description: `${humanDate} चे पूर्ण पंचांग. तिथी, नक्षत्र, योग, करण, वार, सूर्योदय, सूर्यास्त, राहू काळ, अभिजित मुहूर्त — दिल्लीसाठी. अचूक वैदिक गणना.`,
      keywords:    ['पंचांग', `पंचांग ${humanDate}`, `${humanDate} पंचांग`, 'आजचे पंचांग', 'तिथी', 'नक्षत्र', 'राहू काळ'],
    };
    case 'mai': return {
      title:       `${humanDate} क पंचांग — तिथि, नक्षत्र, राहु काल, सूर्योदय`,
      description: `${humanDate} क पूर्ण पंचांग। तिथि, नक्षत्र, योग, करण, वार, सूर्योदय, सूर्यास्त, राहु काल, अभिजित मुहूर्त — दिल्लीक लेल। सटीक वैदिक गणना।`,
      keywords:    ['पंचांग', `पंचांग ${humanDate}`, `${humanDate} पंचांग`, 'आजुक पंचांग', 'तिथि', 'नक्षत्र', 'राहु काल'],
    };
    case 'bn': return {
      title:       `${humanDate} এর পঞ্জিকা — তিথি, নক্ষত্র, রাহু কাল, সূর্যোদয়`,
      description: `${humanDate} এর সম্পূর্ণ পঞ্জিকা। তিথি, নক্ষত্র, যোগ, করণ, বার, সূর্যোদয়, সূর্যাস্ত, রাহু কাল, অভিজিৎ মুহূর্ত — দিল্লির জন্য। নির্ভুল বৈদিক গণনা।`,
      keywords:    ['পঞ্জিকা', `পঞ্জিকা ${humanDate}`, `${humanDate} পঞ্জিকা`, 'আজকের পঞ্জিকা', 'তিথি', 'নক্ষত্র', 'রাহু কাল'],
    };
    case 'te': return {
      title:       `${humanDate} పంచాంగం — తిథి, నక్షత్రం, రాహు కాలం, సూర్యోదయం`,
      description: `${humanDate} యొక్క పూర్తి పంచాంగం. తిథి, నక్షత్రం, యోగం, కరణం, వారం, సూర్యోదయం, సూర్యాస్తం, రాహు కాలం, అభిజిత్ ముహూర్తం — ఢిల్లీ కోసం. ఖచ్చితమైన వేద గణన.`,
      keywords:    ['పంచాంగం', `పంచాంగం ${humanDate}`, `${humanDate} పంచాంగం`, 'నేటి పంచాంగం', 'తిథి', 'నక్షత్రం', 'రాహు కాలం'],
    };
    case 'gu': return {
      title:       `${humanDate} નું પંચાંગ — તિથિ, નક્ષત્ર, રાહુ કાળ, સૂર્યોદય`,
      description: `${humanDate} નું સંપૂર્ણ પંચાંગ. તિથિ, નક્ષત્ર, યોગ, કરણ, વાર, સૂર્યોદય, સૂર્યાસ્ત, રાહુ કાળ, અભિજિત મુહૂર્ત — દિલ્હી માટે. ચોક્કસ વૈદિક ગણના.`,
      keywords:    ['પંચાંગ', `પંચાંગ ${humanDate}`, `${humanDate} પંચાંગ`, 'આજનું પંચાંગ', 'તિથિ', 'નક્ષત્ર', 'રાહુ કાળ'],
    };
    case 'kn': return {
      title:       `${humanDate} ರ ಪಂಚಾಂಗ — ತಿಥಿ, ನಕ್ಷತ್ರ, ರಾಹು ಕಾಲ, ಸೂರ್ಯೋದಯ`,
      description: `${humanDate} ರ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ. ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ, ವಾರ, ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ, ರಾಹು ಕಾಲ, ಅಭಿಜಿತ್ ಮುಹೂರ್ತ — ದೆಹಲಿಗಾಗಿ. ನಿಖರವಾದ ವೈದಿಕ ಲೆಕ್ಕಾಚಾರ.`,
      keywords:    ['ಪಂಚಾಂಗ', `ಪಂಚಾಂಗ ${humanDate}`, `${humanDate} ಪಂಚಾಂಗ`, 'ಇಂದಿನ ಪಂಚಾಂಗ', 'ತಿಥಿ', 'ನಕ್ಷತ್ರ', 'ರಾಹು ಕಾಲ'],
    };
    case 'ta': return {
      title:       `${humanDate} பஞ்சாங்கம் — திதி, நட்சத்திரம், ராகு காலம், சூரிய உதயம்`,
      description: `${humanDate} இன் முழு பஞ்சாங்கம். திதி, நட்சத்திரம், யோகம், கரணம், வாரம், சூரிய உதயம், சூரிய அஸ்தமனம், ராகு காலம், அபிஜித் முகூர்த்தம் — டெல்லிக்கு. துல்லியமான வேத கணக்கீடு.`,
      keywords:    ['பஞ்சாங்கம்', `பஞ்சாங்கம் ${humanDate}`, `${humanDate} பஞ்சாங்கம்`, 'இன்றைய பஞ்சாங்கம்', 'திதி', 'நட்சத்திரம்', 'ராகு காலம்'],
    };
  }
  return assertNever(locale);
}

// ──────────────────────────────────────────────────────────────
// /choghadiya/[date]
// ──────────────────────────────────────────────────────────────

export function choghadiyaDateSeo({ locale, humanDate }: DateSeoInput): DateSeoOutput {
  // hi/mr/mai content mirrors the prior inline production strings —
  // those went through Gemini PR #329 cycles 8 and 9 for Marathi
  // grammar (oblique `सूर्योदय-सूर्यास्तावर`, no-space `दिल्लीचे`) and
  // are tuned. New locales (bn/te/gu/kn/ta) get fresh native-script
  // copy; they previously fell into the English fallback which was
  // the latent duplicate-content time bomb this refactor closes.
  switch (locale) {
    case 'en': return {
      title:       `${humanDate} Choghadiya — Day & Night Auspicious Timings | Dekho Panchang`,
      description: `Choghadiya for ${humanDate} in Delhi. All 16 day and night slots — Shubh, Labh, Amrit, Char, Rog, Kaal, Udveg — computed from sunrise and sunset.`,
      keywords:    ['choghadiya', `choghadiya ${humanDate}`, 'day choghadiya', 'night choghadiya', 'shubh muhurat'],
    };
    case 'hi': return {
      title:       `${humanDate} का चौघड़िया — दिन और रात के शुभ-अशुभ समय | देखो पंचांग`,
      description: `${humanDate} के लिए दिल्ली का चौघड़िया (चोगडिया)। शुभ, लाभ, अमृत, चर, रोग, काल, उद्वेग — सभी 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`,
      keywords:    [
        'चौघड़िया', 'चोगडिया', 'चौगडिया', 'चोघडिया', 'चोगड़िया',
        `चौघड़िया ${humanDate}`, 'दिन का चौघड़िया', 'रात का चौघड़िया',
        'आज का चौघड़िया', 'शुभ मुहूर्त चौघड़िया',
      ],
    };
    case 'mr': return {
      title:       `${humanDate} चे चौघड़िया — दिवस आणि रात्रीची शुभ-अशुभ वेळ | देखो पंचांग`,
      description: `${humanDate} साठी दिल्लीचे चौघड़िया (चोगडिया). शुभ, लाभ, अमृत, चर, रोग, काल, उद्वेग — सर्व 16 स्लॉट सूर्योदय-सूर्यास्तावर आधारित.`,
      keywords:    [
        'चौघड़िया', 'चोगडिया', 'चौगडिया', 'चोघडिया', 'चोगड़िया',
        `चौघड़िया ${humanDate}`, 'दिवसाचे चौघड्या', 'रात्रीचे चौघड्या',
        'आजचे चौघड्या', 'शुभ मुहूर्त चौघड्या',
      ],
    };
    case 'mai': return {
      title:       `${humanDate} क चौघड़िया — दिन ओ रातिक शुभ-अशुभ समय | देखो पंचांग`,
      description: `${humanDate} के लेल दिल्ली क चौघड़िया (चोगडिया)। शुभ, लाभ, अमृत, चर, रोग, काल, उद्वेग — सभ 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`,
      keywords:    [
        'चौघड़िया', 'चोगडिया', 'चौगडिया', 'चोघडिया', 'चोगड़िया',
        `चौघड़िया ${humanDate}`, 'दिनक चौघड़िया', 'रातिक चौघड़िया',
        'आजुक चौघड़िया', 'शुभ मुहूर्त चौघड़िया',
      ],
    };
    case 'bn': return {
      title:       `${humanDate} এর চৌঘড়িয়া — দিন ও রাতের শুভ-অশুভ সময় | দেখো পঞ্জিকা`,
      description: `${humanDate} এর চৌঘড়িয়া মুহূর্ত। শুভ, লাভ, অমৃত, চর এবং অশুভ কাল, রোগ, উদ্বেগের সময় — দিন ও রাত দিল্লির জন্য। বৈদিক সময় নির্বাচন।`,
      keywords:    ['চৌঘড়িয়া', `চৌঘড়িয়া ${humanDate}`, `${humanDate} চৌঘড়িয়া`, 'শুভ মুহূর্ত', 'অমৃত কাল'],
    };
    case 'te': return {
      title:       `${humanDate} చౌఘడియా — పగలు మరియు రాత్రి శుభ-అశుభ సమయాలు | చూడు పంచాంగం`,
      description: `${humanDate} యొక్క చౌఘడియా ముహూర్తం. శుభ, లాభ, అమృత, చర మరియు అశుభ కాల, రోగ, ఉద్వేగ సమయాలు — పగలు మరియు రాత్రి ఢిల్లీ కోసం. వేద కాల ఎంపిక.`,
      keywords:    ['చౌఘడియా', `చౌఘడియా ${humanDate}`, `${humanDate} చౌఘడియా`, 'శుభ ముహూర్తం', 'అమృత కాలం'],
    };
    case 'gu': return {
      title:       `${humanDate} નું ચોઘડિયું — દિવસ અને રાત્રિના શુભ-અશુભ સમય | દેખો પંચાંગ`,
      description: `${humanDate} નું ચોઘડિયું મુહૂર્ત. શુભ, લાભ, અમૃત, ચર અને અશુભ કાળ, રોગ, ઉદ્વેગ ના સમય — દિવસ અને રાત્રિ દિલ્હી માટે. વૈદિક સમય પસંદગી.`,
      keywords:    ['ચોઘડિયું', `ચોઘડિયું ${humanDate}`, `${humanDate} ચોઘડિયું`, 'શુભ મુહૂર્ત', 'અમૃત કાળ'],
    };
    case 'kn': return {
      title:       `${humanDate} ರ ಚೌಘಡಿಯ — ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯ ಶುಭ-ಅಶುಭ ಸಮಯಗಳು | ದೇಖೋ ಪಂಚಾಂಗ`,
      description: `${humanDate} ರ ಚೌಘಡಿಯ ಮುಹೂರ್ತ. ಶುಭ, ಲಾಭ, ಅಮೃತ, ಚರ ಮತ್ತು ಅಶುಭ ಕಾಲ, ರೋಗ, ಉದ್ವೇಗ ಸಮಯಗಳು — ಹಗಲು ಮತ್ತು ರಾತ್ರಿ ದೆಹಲಿಗಾಗಿ. ವೈದಿಕ ಸಮಯ ಆಯ್ಕೆ.`,
      keywords:    ['ಚೌಘಡಿಯ', `ಚೌಘಡಿಯ ${humanDate}`, `${humanDate} ಚೌಘಡಿಯ`, 'ಶುಭ ಮುಹೂರ್ತ', 'ಅಮೃತ ಕಾಲ'],
    };
    case 'ta': return {
      title:       `${humanDate} சௌகடியா — பகல் மற்றும் இரவின் சுப-அசுப நேரங்கள் | தேக்கோ பஞ்சாங்கம்`,
      description: `${humanDate} சௌகடியா முகூர்த்தம். சுப, லாப, அமிர்த, சர மற்றும் அசுப கால, ரோக, உத்வேக நேரங்கள் — பகல் மற்றும் இரவு டெல்லிக்கு. வேத கால தேர்வு.`,
      keywords:    ['சௌகடியா', `சௌகடியா ${humanDate}`, `${humanDate} சௌகடியா`, 'சுப முகூர்த்தம்', 'அமிர்த காலம்'],
    };
  }
  return assertNever(locale);
}

// ──────────────────────────────────────────────────────────────
// /gauri-panchang/[date]
//
// Tamil-South-Indian variant of the daily auspicious-time table. The
// pre-refactor template branched on `isTa || isHi || else-english` —
// same isHi-fallback pattern that crashed mr/mai. GSC Coverage
// Validation (2026-06-01 export) confirmed 34 of these URLs were
// flagged as "Duplicate, Google chose different canonical than user".
// English content for hi/mr/mai/sa/bn/te/gu/kn locales is the
// duplicate-content signal — fixed here with the same exhaustive
// switch shape as panchangDateSeo + choghadiyaDateSeo.
// Title structure for the en/ta/hi/mai legacy paths is byte-identical
// to the prior production strings.
// ──────────────────────────────────────────────────────────────

export function gauriPanchangDateSeo({ locale, humanDate }: DateSeoInput): DateSeoOutput {
  switch (locale) {
    case 'en': return {
      title:       `${humanDate} Gauri Panchang — Day & Night Gowri Nalla Neram | Dekho Panchang`,
      description: `Gauri Panchang for ${humanDate} in Chennai. All 16 day and night periods — Amritha, Siddha, Laabha, Dhanam, Sugam (auspicious) and Marana, Rogam, Sokam (inauspicious) — computed from sunrise and sunset.`,
      keywords:    [
        'gauri panchang', 'gowri panchangam', 'gowri nalla neram',
        `gauri panchang ${humanDate}`, 'south indian muhurat', 'tamil auspicious time',
        'amritha siddha laabha', 'gauri panchang today',
      ],
    };
    case 'ta': return {
      title:       `${humanDate} கௌரி பஞ்சாங்கம் — பகல் மற்றும் இரவு நல்ல நேரம் | Dekho Panchang`,
      description: `${humanDate} சென்னைக்கான கௌரி பஞ்சாங்கம் — அமிர்தம், சித்தம், லாபம், தனம், சுகம் (நல்ல) மற்றும் மரணம், ரோகம், சோகம் (கெட்ட) நேரங்கள் சூரிய உதயம்-அஸ்தமனம் அடிப்படையில் கணக்கிடப்பட்டது.`,
      keywords:    [
        'கௌரி பஞ்சாங்கம்', 'கௌரி நல்ல நேரம்', 'gowri panchangam', 'gauri panchang',
        `கௌரி பஞ்சாங்கம் ${humanDate}`, 'நல்ல நேரம் இன்று', 'gowri nalla neram',
      ],
    };
    case 'hi': return {
      title:       `${humanDate} का गौरी पंचांग — दिन और रात के शुभ-अशुभ काल | देखो पंचांग`,
      description: `${humanDate} के लिए चेन्नई का गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम (शुभ) और मरण, रोग, शोक (अशुभ) — सभी 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`,
      keywords:    [
        'गौरी पंचांग', 'गौरी नल्ल नेरम', 'गोवरी पंचांग',
        `गौरी पंचांग ${humanDate}`, 'दिन का गौरी पंचांग', 'रात का गौरी पंचांग',
      ],
    };
    case 'mai': return {
      title:       `${humanDate} क गौरी पंचांग — दिन ओ रातिक शुभ-अशुभ काल | देखो पंचांग`,
      description: `${humanDate} के लेल चेन्नई क गौरी पंचांग। अमृत, सिद्ध, लाभ, धन, सुगम (शुभ) आ मरण, रोग, शोक (अशुभ) — सभ 16 स्लॉट सूर्योदय-सूर्यास्त पर आधारित।`,
      keywords:    ['गौरी पंचांग', `गौरी पंचांग ${humanDate}`, 'आजुक गौरी पंचांग'],
    };
    case 'mr': return {
      title:       `${humanDate} चे गौरी पंचांग — दिवस आणि रात्रीचे शुभ-अशुभ काळ | देखो पंचांग`,
      description: `${humanDate} साठी चेन्नईचे गौरी पंचांग. अमृत, सिद्ध, लाभ, धन, सुगम (शुभ) आणि मरण, रोग, शोक (अशुभ) — सर्व 16 स्लॉट सूर्योदय-सूर्यास्तावर आधारित.`,
      keywords:    ['गौरी पंचांग', `गौरी पंचांग ${humanDate}`, 'आजचे गौरी पंचांग'],
    };
    case 'bn': return {
      title:       `${humanDate} এর গৌরী পঞ্জিকা — দিন ও রাতের শুভ-অশুভ সময় | দেখো পঞ্জিকা`,
      description: `${humanDate} এর জন্য চেন্নাই গৌরী পঞ্জিকা। অমৃত, সিদ্ধ, লাভ, ধন, সুগম (শুভ) এবং মরণ, রোগ, শোক (অশুভ) — সকল 16 স্লট সূর্যোদয়-সূর্যাস্তের উপর ভিত্তি করে।`,
      keywords:    ['গৌরী পঞ্জিকা', `গৌরী পঞ্জিকা ${humanDate}`, 'আজকের গৌরী পঞ্জিকা'],
    };
    case 'te': return {
      title:       `${humanDate} గౌరి పంచాంగం — పగలు మరియు రాత్రి శుభ-అశుభ సమయాలు | చూడు పంచాంగం`,
      description: `${humanDate} కోసం చెన్నైలో గౌరి పంచాంగం. అమృత, సిద్ధ, లాభ, ధన, సుగమ (శుభ) మరియు మరణ, రోగ, శోక (అశుభ) — అన్ని 16 స్లాట్‌లు సూర్యోదయ-సూర్యాస్త ఆధారంగా.`,
      keywords:    ['గౌరి పంచాంగం', `గౌరి పంచాంగం ${humanDate}`, 'నేటి గౌరి పంచాంగం'],
    };
    case 'gu': return {
      title:       `${humanDate} નું ગૌરી પંચાંગ — દિવસ અને રાત્રિના શુભ-અશુભ સમય | દેખો પંચાંગ`,
      description: `${humanDate} માટે ચેન્નાઈનું ગૌરી પંચાંગ. અમૃત, સિદ્ધ, લાભ, ધન, સુગમ (શુભ) અને મરણ, રોગ, શોક (અશુભ) — બધા 16 સ્લોટ સૂર્યોદય-સૂર્યાસ્ત પર આધારિત.`,
      keywords:    ['ગૌરી પંચાંગ', `ગૌરી પંચાંગ ${humanDate}`, 'આજનું ગૌરી પંચાંગ'],
    };
    case 'kn': return {
      title:       `${humanDate} ರ ಗೌರಿ ಪಂಚಾಂಗ — ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯ ಶುಭ-ಅಶುಭ ಸಮಯಗಳು | ದೇಖೋ ಪಂಚಾಂಗ`,
      description: `${humanDate} ಗಾಗಿ ಚೆನ್ನೈನ ಗೌರಿ ಪಂಚಾಂಗ. ಅಮೃತ, ಸಿದ್ಧ, ಲಾಭ, ಧನ, ಸುಗಮ (ಶುಭ) ಮತ್ತು ಮರಣ, ರೋಗ, ಶೋಕ (ಅಶುಭ) — ಎಲ್ಲಾ 16 ಸ್ಲಾಟ್‌ಗಳು ಸೂರ್ಯೋದಯ-ಸೂರ್ಯಾಸ್ತ ಆಧಾರಿತ.`,
      keywords:    ['ಗೌರಿ ಪಂಚಾಂಗ', `ಗೌರಿ ಪಂಚಾಂಗ ${humanDate}`, 'ಇಂದಿನ ಗೌರಿ ಪಂಚಾಂಗ'],
    };
  }
  return assertNever(locale);
}

// ──────────────────────────────────────────────────────────────
// /horoscope/[rashi]/[date]
//
// Adds rashi name. The rashi name should already be locale-correct
// (from RASHIS constants); we just compose around it. Title shape
// matches the existing template — only the dispatch becomes exhaustive.
// ──────────────────────────────────────────────────────────────

export interface HoroscopeSeoInput extends DateSeoInput {
  rashiName: string; // locale-correct rashi (Aries / मेष / মেষ / মேஷம் / …)
}

export function horoscopeDateSeo({ locale, humanDate, rashiName }: HoroscopeSeoInput): DateSeoOutput {
  // en/hi/mr title structure preserved BYTE-IDENTICAL to the prior
  // production strings — changing the title shape during a GSC recovery
  // window would cause another algorithmic re-rank. mai gets a proper
  // Maithili-specific title (previously fell into the Hindi `isHi`
  // branch and emitted Hindi-grammar text). bn/te/gu/kn/ta get fresh
  // native-script copy; they previously fell into the English fallback.
  switch (locale) {
    case 'en': return {
      title:       `${rashiName} Horoscope ${humanDate} | Daily Vedic Forecast`,
      description: `${rashiName} horoscope for ${humanDate}. Based on real Vedic planetary transits.`,
      keywords:    [`${rashiName.toLowerCase()} horoscope ${humanDate.toLowerCase()}`, `${rashiName.toLowerCase()} horoscope today`, 'vedic horoscope', 'daily rashifal'],
    };
    case 'hi': return {
      title:       `${rashiName} राशिफल ${humanDate} | दैनिक राशिफल`,
      description: `${humanDate} के लिए ${rashiName} राशिफल। वास्तविक ग्रह गोचर पर आधारित।`,
      keywords:    [`${rashiName} राशिफल`, `${rashiName} ${humanDate}`, 'आज का राशिफल', 'दैनिक राशिफल'],
    };
    case 'mr': return {
      title:       `${humanDate} चे ${rashiName} राशीफल | दैनिक राशीफल`,
      description: `${humanDate} साठी ${rashiName} राशीफल. वास्तविक ग्रह गोचरावर आधारित.`,
      keywords:    [`${rashiName} राशीफल`, `${rashiName} ${humanDate}`, 'आजचे राशीफल', 'दैनिक राशीफल'],
    };
    case 'mai': return {
      title:       `${humanDate} क ${rashiName} राशिफल | दैनिक राशिफल`,
      description: `${humanDate} क ${rashiName} राशिफल। वास्तविक ग्रह गोचर पर आधारित।`,
      keywords:    [`${rashiName} राशिफल`, `${rashiName} ${humanDate}`, 'आजुक राशिफल', 'दैनिक राशिफल'],
    };
    case 'bn': return {
      title:       `${rashiName} রাশিফল — ${humanDate} এর দৈনিক ভবিষ্যৎবাণী`,
      description: `${humanDate} এর ${rashiName} রাশিফল। প্রেম, ক্যারিয়ার, স্বাস্থ্য, অর্থের দৈনিক ভবিষ্যৎবাণী — বৈদিক জ্যোতিষ এবং গোচর বিশ্লেষণের উপর ভিত্তি করে।`,
      keywords:    [`${rashiName} রাশিফল`, `${rashiName} ${humanDate}`, 'আজকের রাশিফল', 'দৈনিক রাশিফল'],
    };
    case 'te': return {
      title:       `${rashiName} రాశిఫలాలు — ${humanDate} యొక్క దైనందిన అంచనాలు`,
      description: `${humanDate} యొక్క ${rashiName} రాశిఫలాలు. ప్రేమ, కెరీర్, ఆరోగ్యం, ధనం గురించి దైనందిన అంచనాలు — వేద జ్యోతిష్యం మరియు గోచర విశ్లేషణ ఆధారంగా.`,
      keywords:    [`${rashiName} రాశిఫలాలు`, `${rashiName} ${humanDate}`, 'నేటి రాశిఫలాలు', 'దైనందిన రాశిఫలాలు'],
    };
    case 'gu': return {
      title:       `${rashiName} રાશિફળ — ${humanDate} નું દૈનિક ભવિષ્ય`,
      description: `${humanDate} નું ${rashiName} રાશિફળ. પ્રેમ, કારકિર્દી, સ્વાસ્થ્ય, ધન વિશે દૈનિક ભવિષ્ય — વૈદિક જ્યોતિષ અને ગોચર વિશ્લેષણ પર આધારિત.`,
      keywords:    [`${rashiName} રાશિફળ`, `${rashiName} ${humanDate}`, 'આજનું રાશિફળ', 'દૈનિક રાશિફળ'],
    };
    case 'kn': return {
      title:       `${rashiName} ರಾಶಿಭವಿಷ್ಯ — ${humanDate} ರ ದೈನಂದಿನ ಭವಿಷ್ಯ`,
      description: `${humanDate} ರ ${rashiName} ರಾಶಿಭವಿಷ್ಯ. ಪ್ರೀತಿ, ವೃತ್ತಿ, ಆರೋಗ್ಯ, ಹಣದ ಬಗ್ಗೆ ದೈನಂದಿನ ಭವಿಷ್ಯ — ವೈದಿಕ ಜ್ಯೋತಿಷ ಮತ್ತು ಗೋಚರ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ.`,
      keywords:    [`${rashiName} ರಾಶಿಭವಿಷ್ಯ`, `${rashiName} ${humanDate}`, 'ಇಂದಿನ ರಾಶಿಭವಿಷ್ಯ', 'ದೈನಂದಿನ ರಾಶಿಭವಿಷ್ಯ'],
    };
    case 'ta': return {
      title:       `${rashiName} ராசிபலன் — ${humanDate} இன் தினசரி கணிப்புகள்`,
      description: `${humanDate} இன் ${rashiName} ராசிபலன். காதல், தொழில், ஆரோக்கியம், பணம் பற்றிய தினசரி கணிப்புகள் — வேத ஜோதிடம் மற்றும் கோசார பகுப்பாய்வின் அடிப்படையில்.`,
      keywords:    [`${rashiName} ராசிபலன்`, `${rashiName} ${humanDate}`, 'இன்றைய ராசிபலன்', 'தினசரி ராசிபலன்'],
    };
  }
  return assertNever(locale);
}

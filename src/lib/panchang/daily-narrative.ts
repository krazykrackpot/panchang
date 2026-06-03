/**
 * Daily Cosmic Briefing — narrative engine
 *
 * Translates today's panchang into a 3-4 sentence actionable narrative
 * plus do/don't lists. Two registers per the persona mode v1 spec
 * (docs/superpowers/specs/2026-06-03-persona-mode-setting-v1-design.md):
 *
 *   • 'enthusiast' (default) and 'beginner' — friendly narrative,
 *     metaphors, "favourable day for progress" style. Today's
 *     production output.
 *   • 'acharya' — classical register, terse, vocabulary-heavy. No
 *     metaphors, no narrative framing. Reads like a panchang
 *     readout rather than a briefing. PR-3 of persona mode v1.
 *
 * Pure function — no side effects, no external API calls.
 */

import type { PanchangData, LocaleText } from '@/types/panchang';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import type { PersonaMode } from '@/lib/persona/types';

// ─── Helpers ───

function lt(obj: LocaleText | Record<string, string> | null | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || (obj as Record<string, string>).en || '';
}

function isHindiLike(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
}

// ─── Tithi category (1-based tithi number within the paksha, 1-15) ───

// ─── Deity guidance map ───

const DEITY_GUIDANCE: Record<string, { en: string; hi: string }> = {
  'Agni': { en: 'new beginnings and purification rituals', hi: 'नए आरम्भ और शुद्धि अनुष्ठान' },
  'Brahma': { en: 'creative projects and knowledge pursuits', hi: 'रचनात्मक कार्य और ज्ञान की खोज' },
  'Gauri': { en: 'domestic harmony and relationships', hi: 'पारिवारिक सामंजस्य और रिश्ते' },
  'Ganesha': { en: 'removing obstacles and starting ventures', hi: 'बाधा निवारण और नए उद्यम' },
  'Sarpa (Nagas)': { en: 'spiritual practices and ancestral worship', hi: 'आध्यात्मिक अभ्यास और पितृ पूजा' },
  'Sarpa': { en: 'spiritual practices and ancestral worship', hi: 'आध्यात्मिक अभ्यास और पितृ पूजा' },
  'Kartikeya': { en: 'courage, competition, and leadership', hi: 'साहस, प्रतिस्पर्धा और नेतृत्व' },
  'Surya': { en: 'authority, health, and vitality', hi: 'अधिकार, स्वास्थ्य और जीवन शक्ति' },
  'Rudra': { en: 'transformation and releasing what no longer serves', hi: 'परिवर्तन और अनावश्यक से मुक्ति' },
  'Durga': { en: 'protection, courage, and overcoming difficulties', hi: 'रक्षा, साहस और कठिनाइयों पर विजय' },
  'Dharma': { en: 'righteous action and ethical decisions', hi: 'धर्मपरायण कर्म और नैतिक निर्णय' },
  'Vishnu': { en: 'preservation, devotion, and fasting', hi: 'संरक्षण, भक्ति और उपवास' },
  'Kamadeva': { en: 'love, beauty, and artistic expression', hi: 'प्रेम, सौन्दर्य और कलात्मक अभिव्यक्ति' },
  'Shiva': { en: 'meditation, asceticism, and deep inner work', hi: 'ध्यान, तपस्या और गहन आन्तरिक कार्य' },
  'Chandra': { en: 'celebration, community, and fulfilment', hi: 'उत्सव, समुदाय और पूर्णता' },
  'Pitris': { en: 'honouring ancestors and introspection', hi: 'पितरों का सम्मान और आत्मनिरीक्षण' },
};

// ─── Main export ───

export interface DailyNarrative {
  narrative: string;
  doList: string[];
  dontList: string[];
}

export function generateDailyNarrative(
  panchang: PanchangData,
  locale: string,
  mode: PersonaMode = 'enthusiast',
): DailyNarrative {
  if (mode === 'acharya') {
    return generateAcharyaBriefing(panchang, locale);
  }
  const hi = isHindiLike(locale);
  const nakshatraId = panchang.nakshatra.id;
  const detail = NAKSHATRA_DETAILS.find(d => d.id === nakshatraId);

  // ── Sentence 1: Moon's journey ──
  const nakshatraName = lt(panchang.nakshatra.name, locale);
  const nakshatraMeaning = detail ? lt(detail.meaning, locale) : '';
  const characteristic = detail ? lt(detail.characteristics, locale) : '';
  // Take first sentence of characteristics for brevity
  const charShort = characteristic.split(/[.।]/)[0].trim();

  let s1: string;
  if (hi) {
    s1 = `आज चन्द्रमा ${nakshatraName} नक्षत्र में भ्रमण कर रहा है — ${nakshatraMeaning}। ${charShort}।`;
  } else {
    s1 = `The Moon transits through ${nakshatraName} today — ${nakshatraMeaning}. ${charShort}.`;
  }

  // ── Sentence 2: Day's energy (yoga + tithi) ──
  const yogaName = lt(panchang.yoga.name, locale);
  const yogaMeaning = lt(panchang.yoga.meaning, locale);
  const yogaNature = panchang.yoga.nature;
  let s2: string;

  if (yogaNature === 'auspicious') {
    if (hi) {
      s2 = `${yogaName} योग (${yogaMeaning}) सकारात्मक ऊर्जा को बढ़ाता है — यह दिन नए कार्यों और प्रगति के लिए अनुकूल है।`;
    } else {
      s2 = `The ${yogaName} yoga (${yogaMeaning}) amplifies positive energy — a favourable day for progress and new undertakings.`;
    }
  } else if (yogaNature === 'inauspicious') {
    if (hi) {
      s2 = `${yogaName} योग (${yogaMeaning}) सावधानी की माँग करता है — बड़े नए उद्यम आरम्भ करने से बचें।`;
    } else {
      s2 = `The ${yogaName} yoga (${yogaMeaning}) demands caution — avoid initiating major new ventures today.`;
    }
  } else {
    if (hi) {
      s2 = `${yogaName} योग (${yogaMeaning}) मिश्रित ऊर्जा लाता है — सोच-समझकर कार्य करें।`;
    } else {
      s2 = `The ${yogaName} yoga (${yogaMeaning}) brings mixed energy — proceed with deliberation.`;
    }
  }

  // ── Sentence 3: Practical timing ──
  const abhijitStart = panchang.abhijitMuhurta?.start || '';
  const abhijitEnd = panchang.abhijitMuhurta?.end || '';
  const rahuStart = panchang.rahuKaal?.start || '';
  const rahuEnd = panchang.rahuKaal?.end || '';
  // Abhijit Muhurta is classically excluded on Wednesdays (Muhurta
  // Chintamani; Dharma Sindhu). The panchang engine already flags
  // this via `abhijitMuhurta.available === false` on Wednesdays
  // (src/lib/ephem/panchang-calc.ts:1253). BestWindowsCard and
  // DayTimeline already honour this flag; daily-narrative previously
  // did not (user report 2026-06-03 — Wednesday narrative showed
  // Abhijit as "Best window").
  const abhijitAvailable = panchang.abhijitMuhurta?.available !== false;

  let s3Parts: string[] = [];
  if (abhijitStart && abhijitEnd) {
    if (!abhijitAvailable) {
      if (hi) {
        s3Parts.push(`अभिजित मुहूर्त (${abhijitStart}–${abhijitEnd}) आज बुधवार को मान्य नहीं — मुहूर्त चिन्तामणि के अनुसार शास्त्रीय अपवर्जन`);
      } else {
        s3Parts.push(`Abhijit Muhurta (${abhijitStart}–${abhijitEnd}) does not apply today — classical Wednesday exclusion per Muhurta Chintamani`);
      }
    } else {
      if (hi) {
        s3Parts.push(`सर्वोत्तम समय: ${abhijitStart}–${abhijitEnd} (अभिजित मुहूर्त)`);
      } else {
        s3Parts.push(`Best window: ${abhijitStart}–${abhijitEnd} (Abhijit Muhurta)`);
      }
    }
  }
  if (rahuStart && rahuEnd) {
    if (hi) {
      s3Parts.push(`${rahuStart}–${rahuEnd} (राहु काल) से बचें`);
    } else {
      s3Parts.push(`Avoid ${rahuStart}–${rahuEnd} (Rahu Kaal)`);
    }
  }

  // Panchak warning
  if (panchang.panchakInfo?.isActive || panchang.panchaka?.active) {
    if (hi) {
      s3Parts.push('पंचक सक्रिय है — दक्षिण दिशा की यात्रा से बचें');
    } else {
      s3Parts.push('Panchak is active — avoid southward travel');
    }
  }

  // Varjyam warning
  if (panchang.varjyam?.start && panchang.varjyam?.end) {
    if (hi) {
      s3Parts.push(`वर्ज्यम सक्रिय — ${panchang.varjyam.start}–${panchang.varjyam.end} में महत्वपूर्ण निर्णय टालें`);
    } else {
      s3Parts.push(`Varjyam active — avoid important decisions during ${panchang.varjyam.start}–${panchang.varjyam.end}`);
    }
  }

  const s3 = s3Parts.join(hi ? '। ' : '. ') + (hi ? '।' : '.');

  // ── Sentence 4: Tithi deity connection ──
  const deityName = lt(panchang.tithi.deity, locale);
  const deityNameEn = lt(panchang.tithi.deity, 'en');
  const tithiName = lt(panchang.tithi.name, locale);
  const guidance = DEITY_GUIDANCE[deityNameEn];
  const guidanceText = guidance ? (hi ? guidance.hi : guidance.en) : (hi ? 'आध्यात्मिक चिन्तन' : 'spiritual contemplation');

  let s4: string;
  if (hi) {
    s4 = `${deityName} के प्रभाव में (${tithiName} तिथि), यह दिन ${guidanceText} के लिए अनुकूल है।`;
  } else {
    s4 = `Under ${deityName}'s influence (${tithiName} tithi), the day favours ${guidanceText}.`;
  }

  const narrative = `${s1} ${s2} ${s3} ${s4}`;

  // ── Do list ──
  const doList: string[] = [];
  if (detail) {
    // Parse compatible activities — take first 2-3
    const activities = lt(detail.compatibleActivities, locale);
    const actList = activities.split(',').map(a => a.trim()).filter(Boolean);
    doList.push(...actList.slice(0, 2));
  }
  if (yogaNature === 'auspicious' && doList.length < 3) {
    doList.push(hi ? 'नए कार्य आरम्भ करें' : 'Start new projects');
  }
  // Skip the Abhijit recommendation on Wednesday — slot is classically
  // ineffective (Muhurta Chintamani). Same flag as s3 above.
  if (abhijitStart && abhijitAvailable) {
    doList.push(hi ? `${abhijitStart}–${abhijitEnd} में शुभ कार्य करें` : `Schedule important tasks during ${abhijitStart}–${abhijitEnd}`);
  }
  // Cap at 3
  const finalDo = doList.slice(0, 3);

  // ── Don't list ──
  const dontList: string[] = [];
  if (rahuStart && rahuEnd) {
    dontList.push(hi ? `${rahuStart}–${rahuEnd} में शुभ कार्य न करें` : `Avoid auspicious activities during ${rahuStart}–${rahuEnd}`);
  }
  if (panchang.panchakInfo?.isActive || panchang.panchaka?.active) {
    dontList.push(hi ? 'दक्षिण दिशा की यात्रा टालें' : 'Avoid southward travel');
  }
  // Vishti (Bhadra) karana
  if (panchang.karana.name.en === 'Vishti') {
    dontList.push(hi ? 'विष्टि करण — शुभ कार्य टालें' : 'Vishti (Bhadra) karana — postpone auspicious activities');
  }
  if (panchang.varjyam?.start) {
    dontList.push(hi ? `${panchang.varjyam.start}–${panchang.varjyam.end} में निर्णय टालें` : `Avoid decisions during ${panchang.varjyam.start}–${panchang.varjyam.end}`);
  }
  if (yogaNature === 'inauspicious' && dontList.length < 3) {
    dontList.push(hi ? 'बड़े निवेश या अनुबन्ध टालें' : 'Avoid major investments or signing contracts');
  }
  // Cap at 3
  const finalDont = dontList.slice(0, 3);

  return {
    narrative,
    doList: finalDo,
    dontList: finalDont,
  };
}

// ─── Acharya register ─────────────────────────────────────────────────
// Classical, terse, vocabulary-heavy. No metaphors. No "favourable day
// for progress" framing. Reads like a panchang readout, not a briefing.
// Assumes the reader knows the vocabulary (Tithi, Nakshatra, Yoga,
// Karana, Vishti, Panchaka, Abhijit, Rahu Kaal, Varjyam). Aimed at
// working pandits + advanced practitioners.

function generateAcharyaBriefing(
  panchang: PanchangData,
  locale: string,
): DailyNarrative {
  const hi = isHindiLike(locale);
  const tithiName = lt(panchang.tithi.name, locale);
  const tithiDeity = lt(panchang.tithi.deity, locale);
  const nakshatraName = lt(panchang.nakshatra.name, locale);
  const yogaName = lt(panchang.yoga.name, locale);
  const karanaName = lt(panchang.karana.name, locale);
  const yogaNature = panchang.yoga.nature;

  // Per CLAUDE.md Lesson R / "Abhijit availability (not Wednesdays)":
  // the engine flags abhijitMuhurta.available = false on Wednesdays.
  const abhijitStart = panchang.abhijitMuhurta?.start || '';
  const abhijitEnd = panchang.abhijitMuhurta?.end || '';
  const abhijitAvailable = panchang.abhijitMuhurta?.available !== false;
  const rahuStart = panchang.rahuKaal?.start || '';
  const rahuEnd = panchang.rahuKaal?.end || '';
  const varjyamStart = panchang.varjyam?.start || '';
  const varjyamEnd = panchang.varjyam?.end || '';
  const panchakActive = !!(panchang.panchakInfo?.isActive || panchang.panchaka?.active);
  const vishtiActive = panchang.karana.name.en === 'Vishti';

  // ── Sentence 1 — Tithi + Deity + Karana ──
  const s1 = hi
    ? `तिथि: ${tithiName}, देवता ${tithiDeity}। करण: ${karanaName}।`
    : `Tithi: ${tithiName}, devata ${tithiDeity}. Karana: ${karanaName}.`;

  // ── Sentence 2 — Nakshatra + Yoga (with nature in brackets) ──
  const natureToken = hi
    ? (yogaNature === 'auspicious' ? 'शुभ' : yogaNature === 'inauspicious' ? 'अशुभ' : 'मिश्र')
    : (yogaNature === 'auspicious' ? 'auspicious' : yogaNature === 'inauspicious' ? 'inauspicious' : 'mixed');
  const s2 = hi
    ? `नक्षत्र: ${nakshatraName}। योग: ${yogaName} (${natureToken})।`
    : `Nakshatra: ${nakshatraName}. Yoga: ${yogaName} (${natureToken}).`;

  // ── Sentence 3 — Timing windows ──
  const s3Parts: string[] = [];
  if (abhijitStart && abhijitEnd) {
    if (!abhijitAvailable) {
      s3Parts.push(
        hi
          ? `अभिजित ${abhijitStart}–${abhijitEnd} (बुधवार अपवर्जित)`
          : `Abhijit ${abhijitStart}–${abhijitEnd} (Wednesday exclusion)`,
      );
    } else {
      s3Parts.push(
        hi
          ? `अभिजित ${abhijitStart}–${abhijitEnd}`
          : `Abhijit ${abhijitStart}–${abhijitEnd}`,
      );
    }
  }
  if (rahuStart && rahuEnd) {
    s3Parts.push(
      hi
        ? `राहु काल ${rahuStart}–${rahuEnd}`
        : `Rahu Kaal ${rahuStart}–${rahuEnd}`,
    );
  }
  if (varjyamStart && varjyamEnd) {
    s3Parts.push(
      hi
        ? `वर्ज्य ${varjyamStart}–${varjyamEnd}`
        : `Varjyam ${varjyamStart}–${varjyamEnd}`,
    );
  }
  if (panchakActive) {
    s3Parts.push(hi ? 'पञ्चक सक्रिय' : 'Panchaka active');
  }
  if (vishtiActive) {
    s3Parts.push(hi ? 'विष्टि करण' : 'Vishti karana');
  }
  const s3 = s3Parts.length > 0
    ? s3Parts.join(hi ? '। ' : '. ') + (hi ? '।' : '.')
    : '';

  const narrative = s3 ? `${s1} ${s2} ${s3}` : `${s1} ${s2}`;

  // ── Do list — terse classical windows ──
  const doList: string[] = [];
  if (abhijitStart && abhijitAvailable) {
    doList.push(
      hi
        ? `अभिजित मुहूर्त ${abhijitStart}–${abhijitEnd}`
        : `Abhijit Muhurta ${abhijitStart}–${abhijitEnd}`,
    );
  }
  if (yogaNature === 'auspicious' && doList.length < 3) {
    doList.push(
      hi
        ? `शुभ योग — मुहूर्त-कार्य अनुकूल`
        : `Auspicious yoga — muhurta-work favoured`,
    );
  }

  // ── Don't list — classical exclusions, ordered by criticality ──
  // Cap is 3 (below). The order MUST surface the strictest daily
  // windows first so they don't get sliced away when 4+ exclusions
  // fire on the same day:
  //   1. Varjyam       — strict daily avoid window (~90 min)
  //   2. Vishti / Bhadra — daily karana, classical postpone-class
  //   3. Rahu Kaal     — daily ~90 min avoid window
  //   4. Panchaka      — 5-day advisory, only specific activities
  //   5. Abhijit Wed   — already cited in s3 narrative, redundant here
  // Gemini PR #388 cycle-2 MED.
  const dontList: string[] = [];
  if (varjyamStart && varjyamEnd) {
    dontList.push(
      hi
        ? `वर्ज्य ${varjyamStart}–${varjyamEnd}`
        : `Varjyam ${varjyamStart}–${varjyamEnd}`,
    );
  }
  if (vishtiActive) {
    dontList.push(
      hi
        ? `विष्टि (भद्रा) करण`
        : `Vishti (Bhadra) karana`,
    );
  }
  if (rahuStart && rahuEnd) {
    dontList.push(
      hi
        ? `राहु काल ${rahuStart}–${rahuEnd}`
        : `Rahu Kaal ${rahuStart}–${rahuEnd}`,
    );
  }
  if (panchakActive) {
    dontList.push(
      hi
        ? `पञ्चक — दक्षिण यात्रा निषिद्ध`
        : `Panchaka — southward travel proscribed`,
    );
  }
  if (!abhijitAvailable) {
    dontList.push(
      hi
        ? `अभिजित बुधवार अपवर्जित (मुहूर्त चिन्तामणि)`
        : `Abhijit Wednesday exclusion (Muhurta Chintamani)`,
    );
  }

  // Fallback when neither list has any classical content — most
  // commonly happens on Wednesdays with neutral/inauspicious yoga
  // (no Abhijit, yoga doesn't qualify as auspicious). Without these
  // fallbacks the UI renders an empty "Favourable" or "Avoid" column
  // under just its heading, which reads as broken. Gemini PR #388
  // cycle-1 MED.
  if (doList.length === 0) {
    doList.push(
      hi
        ? 'नित्य-कर्म एवं नैमित्तिक साधना'
        : 'Nitya-karma and routine sadhana',
    );
  }
  if (dontList.length === 0) {
    dontList.push(
      hi
        ? 'कोई विशेष शास्त्रीय निषेध नहीं'
        : 'No major classical exclusions',
    );
  }

  return {
    narrative,
    doList: doList.slice(0, 3),
    dontList: dontList.slice(0, 3),
  };
}

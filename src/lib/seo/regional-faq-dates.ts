/**
 * Engine-derived date strings for regional calendar FAQ schemas.
 *
 * Background: 2026-06-10 GSC URL Inspection on
 * /en/calendar/regional/bengali surfaced an internally-inconsistent FAQ
 * schema (Mahalaya Oct 3 + Shashti Oct 13 for 2026 — impossible since
 * Mahalaya → Shashti is ~6 tithis apart). Auditing all 9 regional
 * calendars showed 115/146 hand-coded date entries had drifted from
 * what festival-generator.ts computes.
 *
 * The structural fix: replace hand-coded date strings in FAQ_DATA with
 * `engineDate(year, festivalKey, locale)` calls. The function looks up
 * the festival in the engine output at module load and returns a
 * locale-formatted date string. Drift becomes impossible — if the
 * engine ever changes, FAQ schema follows automatically.
 *
 * Engine output is locale-INDEPENDENT (festival.name is en-keyed). The
 * helper formats the date according to the FAQ's target locale.
 *
 * Usage:
 *   import { engineDate } from '@/lib/seo/regional-faq-dates';
 *
 *   const FAQ_DATA = [
 *     {
 *       q: { en: 'When is Durga Puja 2026?', ... },
 *       a: {
 *         en: `Durga Puja 2026 runs from Shashti (${engineDate(2026,'Durga Puja Shashti','en')}) to Dashami (${engineDate(2026,'Vijaya Dashami','en')}). Mahalaya falls on ${engineDate(2026,'Mahalaya','en')}.`,
 *         hi: `दुर्गा पूजा 2026 षष्ठी (${engineDate(2026,'Durga Puja Shashti','hi')}) से ... `,
 *       },
 *     },
 *   ];
 *
 * If the engine has no match for the festival key in the given year,
 * the function returns a clear `(festivalKey: not in engine)` marker
 * that's visible in the rendered HTML — surfaces drift loudly instead
 * of shipping silent fallbacks.
 */
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

// Canonical IST reference: Ujjain (Mahakaleshwar) — the traditional Hindu
// prime meridian per Surya Siddhanta. Already used as the project's
// IST-anchor in cron/social-post/route.ts, horoscope/daily-article.ts,
// the /hi/ locale's SEO_CITY_BY_LOCALE, and the WhatsApp API default;
// coordinates here match cities.ts so all paths agree to the digit.
//
// (Initial commit on this file picked Kolkata, which broke tithi-boundary
// festivals via a longitude-edge bug in tithi-table.ts' sunriseJdForDate:
// the function calls sunriseUTHoursOr with tzOffset=0 and then stamps the
// returned UT-hours back onto the *input* Gregorian date. For longitudes
// east of ~85°E the local sunrise occurs at UT ~23:5x of the *previous*
// UT day, so the reconstructed sunrise JD is mis-labelled and the wrong
// sunriseDate gets pushed into the tithi entry. Net effect at Kolkata
// coords: Hanuman Jayanti 2026 = Apr 1 instead of Drik's Apr 2, plus a
// few other tithi-boundary festivals shift by one day. Ujjain at 75.78°E
// is well west of the bug zone, AND it's already the project-wide
// canonical Jyotish anchor — should have been the default from the start.
// The underlying engine bug in sunriseJdForDate is tracked separately;
// fixing it doesn't ride this PR.)
import { UJJAIN_REFERENCE } from '@/lib/constants/jyotish-reference';

const UJJAIN_LAT = UJJAIN_REFERENCE.lat;
const UJJAIN_LNG = UJJAIN_REFERENCE.lng;
const IST = UJJAIN_REFERENCE.ianaZone;

// Module-load memo so each year only runs the engine once.
const _enginePerYear = new Map<number, ReturnType<typeof generateFestivalCalendarV2>>();
function engineEntries(year: number) {
  let entries = _enginePerYear.get(year);
  if (!entries) {
    entries = generateFestivalCalendarV2(year, UJJAIN_LAT, UJJAIN_LNG, IST);
    _enginePerYear.set(year, entries);
  }
  return entries;
}

const WEEKDAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as const;
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'] as const;

const WEEKDAYS_HI = ['रविवार','सोमवार','मंगलवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'] as const;
const MONTHS_HI = ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'] as const;

const WEEKDAYS_MAI = ['रविदिन','सोमदिन','मंगलदिन','बुधदिन','गुरुदिन','शुक्रदिन','शनिदिन'] as const;

const WEEKDAYS_MR = ['रविवार','सोमवार','मंगळवार','बुधवार','गुरुवार','शुक्रवार','शनिवार'] as const;
const MONTHS_MR = ['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'] as const;

const WEEKDAYS_BN = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'] as const;
const MONTHS_BN = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'] as const;

const WEEKDAYS_GU = ['રવિવાર','સોમવાર','મંગળવાર','બુધવાર','ગુરુવાર','શુક્રવાર','શનિવાર'] as const;
const MONTHS_GU = ['જાન્યુઆરી','ફેબ્રુઆરી','માર્ચ','એપ્રિલ','મે','જૂન','જુલાઈ','ઓગસ્ટ','સપ્ટેમ્બર','ઓક્ટોબર','નવેમ્બર','ડિસેમ્બર'] as const;

const WEEKDAYS_TA = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி'] as const;
const MONTHS_TA = ['ஜனவரி','பிப்ரவரி','மார்ச்','ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்'] as const;

const WEEKDAYS_TE = ['ఆదివారం','సోమవారం','మంగళవారం','బుధవారం','గురువారం','శుక్రవారం','శనివారం'] as const;
const MONTHS_TE = ['జనవరి','ఫిబ్రవరి','మార్చి','ఏప్రిల్','మే','జూన్','జులై','ఆగస్టు','సెప్టెంబర్','అక్టోబర్','నవంబర్','డిసెంబర్'] as const;

const WEEKDAYS_KN = ['ಭಾನುವಾರ','ಸೋಮವಾರ','ಮಂಗಳವಾರ','ಬುಧವಾರ','ಗುರುವಾರ','ಶುಕ್ರವಾರ','ಶನಿವಾರ'] as const;
const MONTHS_KN = ['ಜನವರಿ','ಫೆಬ್ರವರಿ','ಮಾರ್ಚ್','ಏಪ್ರಿಲ್','ಮೇ','ಜೂನ್','ಜುಲೈ','ಆಗಸ್ಟ್','ಸೆಪ್ಟೆಂಬರ್','ಅಕ್ಟೋಬರ್','ನವೆಂಬರ್','ಡಿಸೆಂಬರ್'] as const;

const WEEKDAYS_OR = ['ରବିବାର','ସୋମବାର','ମଙ୍ଗଳବାର','ବୁଧବାର','ଗୁରୁବାର','ଶୁକ୍ରବାର','ଶନିବାର'] as const;
const MONTHS_OR = ['ଜାନୁଆରୀ','ଫେବୃଆରୀ','ମାର୍ଚ୍ଚ','ଅପ୍ରେଲ','ମଇ','ଜୁନ','ଜୁଲାଇ','ଅଗଷ୍ଟ','ସେପ୍ଟେମ୍ବର','ଅକ୍ଟୋବର','ନଭେମ୍ବର','ଡିସେମ୍ବର'] as const;

function format(iso: string, locale: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  const dow = d.getUTCDay();
  const day = d.getUTCDate();
  const month = d.getUTCMonth();
  const year = d.getUTCFullYear();
  switch (locale) {
    case 'hi': return `${WEEKDAYS_HI[dow]}, ${day} ${MONTHS_HI[month]} ${year}`;
    case 'mai': return `${WEEKDAYS_MAI[dow]}, ${day} ${MONTHS_HI[month]} ${year}`;
    case 'mr': return `${WEEKDAYS_MR[dow]}, ${day} ${MONTHS_MR[month]} ${year}`;
    case 'bn': return `${WEEKDAYS_BN[dow]}, ${day} ${MONTHS_BN[month]} ${year}`;
    case 'gu': return `${WEEKDAYS_GU[dow]}, ${day} ${MONTHS_GU[month]} ${year}`;
    case 'ta': return `${WEEKDAYS_TA[dow]}, ${day} ${MONTHS_TA[month]} ${year}`;
    case 'te': return `${WEEKDAYS_TE[dow]}, ${day} ${MONTHS_TE[month]} ${year}`;
    case 'kn': return `${WEEKDAYS_KN[dow]}, ${day} ${MONTHS_KN[month]} ${year}`;
    case 'or': return `${WEEKDAYS_OR[dow]}, ${day} ${MONTHS_OR[month]} ${year}`;
    case 'en':
    default:   return `${WEEKDAYS_EN[dow]}, ${day} ${MONTHS_EN[month]} ${year}`;
  }
}

/**
 * Returns the engine's date for the given festival key formatted in the
 * target locale. Match order: exact case-insensitive, then word-boundary
 * regex (so "Diwali" doesn't match "Diwalish"-style partial-word entries
 * even though it intentionally still matches inside multi-word names
 * like "Diwali (Lakshmi Puja)" — drop down to exact-name keys if you
 * specifically need to disambiguate "Diwali" from "Dev Diwali").
 *
 * Examples:
 *   engineDate(2026, 'Durga Puja Shashti', 'en')   → "Friday, 16 October 2026"
 *   engineDate(2026, 'Mahalaya', 'hi')              → "शनिवार, 10 अक्टूबर 2026"
 *   engineDate(2026, 'Vijaya Dashami', 'en')        → "Wednesday, 21 October 2026"
 *
 * If no festival matches the key for that year, returns a visible
 * marker like `(Durga Puja Shashti: not in engine)` so drift surfaces
 * loudly in the rendered HTML.
 */

// Regex escape for arbitrary user-supplied needle text — shared by the
// engineDate + nextUpcoming fallback paths so they stay in lockstep.
function escapeRegex(s: string): string {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Word-boundary fallback search. Prevents partial-word false matches
 * like "yoga" matching "yogasana" (no real engine entry, but defensive).
 * Word boundaries still allow whole-word matches inside multi-word
 * festival names — exact-match handles the Diwali / Dev Diwali split
 * earlier in the pipeline. Gemini PR #672 review 2026-06-11 MED.
 */
function wordBoundaryMatch(name: string, needleLower: string): boolean {
  const re = new RegExp(`\\b${escapeRegex(needleLower)}\\b`, 'i');
  return re.test(name);
}

export function engineDate(year: number, festivalKey: string, locale: string): string {
  const needle = festivalKey.toLowerCase();
  const entries = engineEntries(year);
  // Prefer exact-name match. Fall back to word-boundary regex search
  // rather than substring contains — see wordBoundaryMatch above.
  let hit = entries.find((f) => (f.name?.en ?? '').toLowerCase() === needle);
  if (!hit) {
    hit = entries.find((f) => wordBoundaryMatch(f.name?.en ?? '', needle));
  }
  if (!hit) return `(${festivalKey}: not in engine)`;
  return format(hit.date, locale);
}

/**
 * Finds the NEXT upcoming occurrence of a festival, looking at the
 * current year and the next year. Filters out past dates so the
 * regional calendar pages show "what's coming up" — not stale 2026 H1
 * entries when you're viewing the page in November 2026.
 *
 * Returns { iso, display } where:
 *   - iso     — YYYY-MM-DD (used for client-side sorting)
 *   - display — formatted in the target locale ("Friday, 16 October 2026")
 *
 * Returns null if the festival has no match within the next ~15 months
 * (the engine produces ≤14 months of forward window).
 *
 * Caller is responsible for "today" — accepts a `nowIso` so the page can
 * inject `new Date().toISOString().slice(0,10)` at render time and stay
 * SSR-stable per request.
 */
/**
 * "Today" in IST as YYYY-MM-DD. Use this for the `nowIso` argument to
 * nextUpcoming() on the regional calendar pages instead of
 * `new Date().toISOString().slice(0, 10)` — the latter is UTC, which
 * falls a day BEHIND IST between 18:30 UTC and midnight UTC every day
 * (Gemini PR #669 review, 2026-06-11). For a page rendered at 04:00 IST
 * on Nov 11, UTC slice gives "Nov 10" and the upcoming-festival
 * sort would include a festival that already passed in IST.
 *
 * `toLocaleDateString('en-CA', ...)` returns ISO YYYY-MM-DD because the
 * en-CA locale's date format is the ISO one — same output as
 * Intl.DateTimeFormat with year/month/day in 4-2-2 with hyphens, but
 * a single-call form that's easier to spot at the call site.
 */
export function todayInIst(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: IST });
}

export function nextUpcoming(
  festivalKey: string,
  locale: string,
  nowIso: string,
): { iso: string; display: string } | null {
  const needle = festivalKey.toLowerCase();
  const currentYear = Number(nowIso.slice(0, 4));
  // Recurring festivals (e.g. Skanda Shashthi, Sankashti Chaturthi) appear
  // ~12 times per year. `entries.find()` would grab January's row, which is
  // typically already past; we need the FIRST match whose date is ≥ today.
  for (const yr of [currentYear, currentYear + 1]) {
    const entries = engineEntries(yr);
    const exact = entries.filter((f) => (f.name?.en ?? '').toLowerCase() === needle);
    // Word-boundary fallback (same rationale as engineDate). Gemini PR
    // #672 review 2026-06-11 MED — substring-contains could prefer
    // longer-name matches over the intended key in pathological cases.
    const candidates = exact.length > 0
      ? exact
      : entries.filter((f) => wordBoundaryMatch(f.name?.en ?? '', needle));
    if (candidates.length === 0) continue;
    // Ascending by ISO date, then find first ≥ nowIso.
    candidates.sort((a, b) => a.date.localeCompare(b.date));
    const hit = candidates.find((c) => c.date >= nowIso);
    if (hit) return { iso: hit.date, display: format(hit.date, locale) };
  }
  return null;
}

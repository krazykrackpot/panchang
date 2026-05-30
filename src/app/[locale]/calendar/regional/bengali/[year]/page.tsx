/**
 * Bangla Calendar [year] — Server Component
 *
 * SEO-targeting page for "bangla calendar 2026", "bengali calendar 2027",
 * "bengali panjika 2026" etc. Currently the bare `/calendar/regional/bengali`
 * page ranks #2 on Google for "bangla calendar" (May 2026 SERP audit) but we
 * have no per-year landing pages, so year-suffixed queries
 * ("bangla calendar 2026" — 128 impr/day, "bengali calendar 2026" — 40/day)
 * dilute into the un-dated parent. This route captures those.
 *
 * Renders all Bengali-region festivals for the given Gregorian year
 * (durga puja, kali puja, poila boishakh, etc.) by filtering
 * generateFestivalCalendarV2() against a curated slug allowlist —
 * `region` isn't currently part of FestivalEntry; lifting it into the
 * type would be the structural fix but is out of scope here.
 *
 * The Bengali year (1432/1433 etc.) is shown prominently in copy;
 * the URL stays Gregorian because that's what users search for.
 */

import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import { CalendarDays, Star, Moon, MapPin, ChevronRight, Share2 } from 'lucide-react';

// ── Valid years ────────────────────────────────────────────────
// Generated statically for the three most-searched Bangla calendar years
// in the current window. Older + future years fall through to ISR.
const VALID_YEARS = [2025, 2026, 2027, 2028];

// ── Kolkata coordinates — canonical for Bengali panjika ─────────
const KOLKATA_LAT = 22.5726;
const KOLKATA_LNG = 88.3639;
const KOLKATA_TZ = 'Asia/Kolkata';

// ── Bengali-region festival slug allowlist ──────────────────────
// Source of truth: src/lib/calendar/festival-defs.ts (region: 'bengali').
// Kept here as an explicit list because FestivalEntry doesn't carry the
// `region` tag through generation. If you add/remove a Bengali festival
// def, mirror the change here.
const BENGALI_FESTIVAL_SLUGS = new Set([
  'poila-boishakh',
  'durga-puja-shashti',
  'durga-puja-saptami',
  'durga-puja-ashtami',
  'durga-puja-navami',
  'sindoor-khela',
  'lakshmi-puja-bengali',
  'kali-puja',
  'saraswati-puja-bengali',
  'subho-noboborsho-prep',
  'sitala-ashtami',
]);

// ── Bangla year correlation ─────────────────────────────────────
// The Bangla New Year (Poila Boishakh) falls around April 14-15. A
// Gregorian year therefore spans two Bangla years. For display purposes
// we report both: the year active before Poila Boishakh, and the one
// that begins on it.
function bengaliYearsForGregorian(year: number): { early: number; late: number } {
  return { early: year - 594, late: year - 593 };
}

// ── Number localisation ────────────────────────────────────────
// Bengali-script searchers expect Bengali numerals in body copy (the
// static metadata in PAGE_META already uses ২০২৬ etc.). Other locales
// fall through unchanged.
const BENGALI_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'] as const;
function localizeNumber(val: number | string, locale: string): string {
  const str = String(val);
  if (locale === 'bn') return str.replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
  return str;
}

// Strict 4-digit year — prevents `/bengali/2026-foo` etc. from passing
// parseInt and rendering as 2026 (duplicate content / canonical risk).
const YEAR_RE = /^\d{4}$/;

// `Intl.DateTimeFormat` produces localised month + weekday names for every
// locale Node knows — no need to maintain hand-rolled tables per language,
// and dropping the hardcoded arrays means Tamil / Telugu / Kannada /
// Marathi automatically get correct labels instead of falling through to
// the English defaults.
function monthName(locale: string, monthIndex: number): string {
  // 2026-01-15 ... 2026-12-15 (mid-month avoids any DST edge case)
  const date = new Date(Date.UTC(2026, monthIndex, 15));
  return new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(date);
}

const LABELS: Record<string, LocaleText> = {
  h1: {
    en: 'Bangla Calendar {gregYear} | বাংলা পঞ্জিকা {banglaYear}/{banglaLate} — Festival Dates',
    hi: 'बंगाली कैलेंडर {gregYear} | বাংলা পঞ্জিকা {banglaYear}/{banglaLate} — त्यौहार तिथियाँ',
    bn: 'বাংলা ক্যালেন্ডার {gregYear} | বঙ্গাব্দ {banglaYear}/{banglaLate} — উৎসবের তারিখ',
    ta: 'வங்காள நாள்காட்டி {gregYear} — பாங்களா பஞ்சிகா {banglaYear}/{banglaLate}',
  },
  intro: {
    en: 'Bangla calendar for {gregYear} (Bengali Sambat {banglaYear}/{banglaLate}) with every Bengali festival — Durga Puja, Kali Puja, Saraswati Puja, Poila Boishakh, Lakshmi Puja — computed from classical panjika rules. Dates use Kolkata coordinates which are within ±1 minute for the entire Bengal region.',
    hi: '{gregYear} (बंगाब्द {banglaYear}/{banglaLate}) के लिए बंगाली कैलेंडर — दुर्गा पूजा, काली पूजा, सरस्वती पूजा, पोइला बोइशाख, लक्ष्मी पूजा सहित प्रत्येक बंगाली त्योहार। कोलकाता निर्देशांकों से शास्त्रीय पंजिका नियमों द्वारा गणित।',
    bn: '{gregYear} (বঙ্গাব্দ {banglaYear}/{banglaLate}) এর জন্য সম্পূর্ণ বাংলা পঞ্জিকা — দুর্গা পূজা, কালী পূজা, সরস্বতী পূজা, পয়লা বৈশাখ, লক্ষ্মী পূজা সহ প্রতিটি বাঙালি উৎসব। কলকাতার স্থানাঙ্ক থেকে শাস্ত্রীয় পঞ্জিকা নিয়মে গণনা করা।',
    ta: '{gregYear} (வங்காப்தம் {banglaYear}/{banglaLate}) க்கான வங்காள நாள்காட்டி — துர்கா பூஜை, காளி பூஜை, சரஸ்வதி பூஜை, பயிலா பைசாக் உள்ளிட்ட அனைத்து வங்காள பண்டிகைகளும்.',
  },
  totalFestivals: {
    en: '{count} festivals in {gregYear}',
    hi: '{gregYear} में {count} त्योहार',
    bn: '{gregYear} এ {count} টি উৎসব',
    ta: '{gregYear} இல் {count} பண்டிகைகள்',
  },
  jumpTo: { en: 'Jump to month', hi: 'मास पर जाएँ', bn: 'মাসে যান', ta: 'மாதத்திற்குச் செல்' },
  noEvents: { en: 'No Bengali festivals this month.', hi: 'इस मास में कोई बंगाली त्योहार नहीं।', bn: 'এই মাসে কোনো বাঙালি উৎসব নেই।', ta: 'இந்த மாதம் வங்காள பண்டிகைகள் இல்லை.' },
  shareText: { en: 'Share', hi: 'शेयर', bn: 'শেয়ার', ta: 'பகிர்' },
  backToParent: { en: 'Bengali Panjika home', hi: 'बंगाली पंजिका मुखपृष्ठ', bn: 'বাংলা পঞ্জিকা হোম', ta: 'வங்காள பஞ்சிகா முகப்பு' },
  otherYears: { en: 'Other years', hi: 'अन्य वर्ष', bn: 'অন্যান্য বছর', ta: 'மற்ற ஆண்டுகள்' },
};

function l(key: string, locale: string, replacements?: Record<string, string>): string {
  const label = LABELS[key];
  if (!label) return key;
  let text = tl(label, locale);
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) text = text.replaceAll(`{${k}}`, v);
  }
  return text;
}

function groupByMonth(festivals: FestivalEntry[]): Map<number, FestivalEntry[]> {
  const map = new Map<number, FestivalEntry[]>();
  for (let m = 0; m < 12; m++) map.set(m, []);
  for (const f of festivals) {
    const [, monthStr] = f.date.split('-');
    const idx = parseInt(monthStr, 10) - 1;
    map.get(idx)?.push(f);
  }
  for (const [, entries] of map) entries.sort((a, b) => a.date.localeCompare(b.date));
  return map;
}

function formatDate(dateStr: string, locale: string): { day: string; weekday: string } {
  const [y, m, d] = dateStr.split('-').map(Number);
  // `Date.UTC` + `timeZone: 'UTC'` — never let the server's local TZ shift
  // the weekday (Lesson L + Lesson O).
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(date);
  return { day: String(d), weekday };
}

function TypeBadge({ type, locale }: { type: string; locale: string }) {
  const styles: Record<string, string> = {
    major: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    vrat: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    regional: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  const labels: Record<string, LocaleText> = {
    major: { en: 'Major', hi: 'प्रमुख', bn: 'প্রধান', ta: 'முக்கிய' },
    vrat: { en: 'Vrat', hi: 'व्रत', bn: 'ব্রত', ta: 'விரதம்' },
    regional: { en: 'Bengali', hi: 'बंगाली', bn: 'বাঙালি', ta: 'வங்காள' },
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[type] || styles.regional}`}>
      {type === 'major' && <Star className="w-3 h-3" />}
      {type === 'vrat' && <Moon className="w-3 h-3" />}
      {type === 'regional' && <MapPin className="w-3 h-3" />}
      {tl(labels[type] || labels.regional, locale)}
    </span>
  );
}

export default async function BengaliCalendarYearPage({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year: yearStr } = await params;
  // Strict 4-digit check first — without this, `/bengali/2026-foo` would
  // pass `parseInt` as 2026 and render duplicate content under a malformed
  // URL (Gemini #290 flagged this as a high-priority SEO risk).
  if (!YEAR_RE.test(yearStr)) notFound();
  setRequestLocale(locale);

  const year = parseInt(yearStr, 10);
  // Restrict the dynamic range to 5 years either side of the build window so
  // a crawler can't pollute the cache with /bengali/9999.
  if (year < 2020 || year > 2035) notFound();

  const all = generateFestivalCalendarV2(year, KOLKATA_LAT, KOLKATA_LNG, KOLKATA_TZ);
  const bengali = all.filter((f) => f.slug && BENGALI_FESTIVAL_SLUGS.has(f.slug));
  const byMonth = groupByMonth(bengali);
  const total = bengali.length;
  const bengaliYr = bengaliYearsForGregorian(year);

  // Localised numerals for bn (২০২৬ instead of 2026). Matches the static
  // PAGE_META so on-page numerals and the SERP listing agree. All other
  // locales pass through unchanged.
  const banglaYear = localizeNumber(bengaliYr.early, locale);
  const banglaLate = localizeNumber(bengaliYr.late, locale);
  const localizedGregYear = localizeNumber(year, locale);
  const localizedTotal = localizeNumber(total, locale);

  const monthNames: string[] = Array.from({ length: 12 }, (_, i) => monthName(locale, i));
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const shareUrl = `https://dekhopanchang.com/${locale}/calendar/regional/bengali/${year}`;
  const whatsappText = encodeURIComponent(
    `${l('h1', locale, { gregYear: localizedGregYear, banglaYear, banglaLate })} — ${shareUrl}`,
  );

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <nav className="mb-6 text-sm text-text-secondary">
          <Link href="/calendar/regional/bengali" className="hover:text-gold-light transition-colors">
            {l('backToParent', locale)}
          </Link>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <span className="text-gold-light">{localizedGregYear}</span>
        </nav>

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light mb-4 leading-tight" style={headingFont}>
            {l('h1', locale, { gregYear: localizedGregYear, banglaYear, banglaLate })}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-4">
            {l('intro', locale, { gregYear: localizedGregYear, banglaYear, banglaLate })}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1.5 bg-gold-primary/10 text-gold-primary px-3 py-1 rounded-full border border-gold-primary/20">
              <CalendarDays className="w-4 h-4" />
              {l('totalFestivals', locale, { count: localizedTotal, gregYear: localizedGregYear })}
            </span>
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {l('shareText', locale)}
            </a>
          </div>
        </header>

        {/* ── Other years navigation ──────────────────────────── */}
        <nav className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <p className="text-text-secondary text-sm mb-2 font-medium">{l('otherYears', locale)}</p>
          <div className="flex flex-wrap gap-2">
            {VALID_YEARS.map((y) => (
              <Link
                key={y}
                href={`/calendar/regional/bengali/${y}` as `/calendar/regional/bengali/${number}`}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  y === year
                    ? 'bg-gold-primary/25 text-gold-light border-gold-primary/50'
                    : 'bg-gold-primary/8 text-gold-light border-gold-primary/15 hover:bg-gold-primary/20 hover:border-gold-primary/40'
                }`}
              >
                {localizeNumber(y, locale)}
              </Link>
            ))}
          </div>
        </nav>

        {/* ── Month jump nav ──────────────────────────────────── */}
        <nav className="mb-10 p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
          <p className="text-text-secondary text-sm mb-3 font-medium">{l('jumpTo', locale)}</p>
          <div className="flex flex-wrap gap-2">
            {monthNames.map((name, idx) => (
              <a
                key={idx}
                href={`#month-${idx}`}
                className="px-3 py-1.5 text-sm rounded-lg bg-gold-primary/8 text-gold-light border border-gold-primary/15 hover:bg-gold-primary/20 hover:border-gold-primary/40 transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
        </nav>

        {/* ── Month sections ──────────────────────────────────── */}
        {Array.from(byMonth.entries()).map(([monthIdx, entries]) => (
          <section key={monthIdx} id={`month-${monthIdx}`} className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-6 h-6 text-gold-primary flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
                {monthNames[monthIdx]} {localizedGregYear}
              </h2>
            </div>
            {entries.length === 0 ? (
              <p className="text-text-secondary italic pl-9">{l('noEvents', locale)}</p>
            ) : (
              <ul className="space-y-3 pl-9">
                {entries.map((f, i) => {
                  const fd = formatDate(f.date, locale);
                  return (
                    <li
                      key={`${f.slug ?? 'f'}-${i}`}
                      className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10"
                    >
                      <div className="flex-shrink-0 sm:w-20 text-center sm:text-left">
                        <div className="text-2xl font-bold text-gold-light">{fd.day}</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wider">{fd.weekday}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gold-light">{tl(f.name, locale)}</h3>
                          <TypeBadge type={f.type} locale={locale} />
                        </div>
                        {tl(f.description, locale) && (
                          <p className="text-sm text-text-secondary leading-relaxed">{tl(f.description, locale)}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}

        {/* ── Footer cross-link back to parent ───────────────── */}
        <footer className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 text-center">
          <Link
            href="/calendar/regional/bengali"
            className="inline-flex items-center gap-2 text-gold-light hover:text-gold-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            {l('backToParent', locale)}
          </Link>
        </footer>
      </div>
    </main>
  );
}

/**
 * Hindu Calendar [year]  –  Server Component
 *
 * SEO-targeting page for "hindu calendar 2027", "hindu panchang 2027", etc.
 * Generates all festivals at build time using generateFestivalCalendarV2()
 * with Ujjain coordinates (traditional Hindu prime meridian).
 * Renders a month-by-month list of every major festival, vrat, and eclipse.
 *
 * ISR with daily revalidation (set in layout.tsx).
 */

import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { tl } from '@/lib/utils/trilingual';
import {
  CalendarDays, Star, Moon, Eclipse, MapPin, ChevronRight, Share2,
} from 'lucide-react';
import CrossSellCTA from '@/components/cta/CrossSellCTA';

// ─── Valid years ────────────────────────────────────────────────
const VALID_YEARS = [2026, 2027];

// ─── Ujjain  –  canonical location for pan-Indian Hindu calendar ──
// Ujjain (ancient Ujjayini) is the traditional prime meridian of Hindu astronomy.
// Within ±30 min of any Indian city for tithi boundaries.
const UJJAIN_LAT = 23.1765;
const UJJAIN_LNG = 75.7885;
const UJJAIN_TZ = 'Asia/Kolkata';

// ─── Month names ────────────────────────────────────────────────
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

// ─── Labels ─────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  h1: {
    en: 'Hindu Calendar {year}  –  Complete Festival, Vrat & Eclipse Dates',
    hi: 'हिन्दू कैलेंडर {year}  –  सम्पूर्ण त्योहार, व्रत एवं ग्रहण तिथियाँ',
    ta: 'இந்து நாட்காட்டி {year}  –  முழுமையான பண்டிகை, விரத மற்றும் கிரகண தேதிகள்',
    bn: 'হিন্দু ক্যালেন্ডার {year}  –  সম্পূর্ণ উৎসব, ব্রত ও গ্রহণ তারিখ',
  },
  intro: {
    en: 'The complete Hindu calendar for {year} with all major festivals, Ekadashi vrat dates, eclipses, Purnima, and Amavasya  –  computed using classical Vedic astronomical algorithms from Ujjain (the traditional prime meridian of Hindu astronomy). Dates are accurate for all Indian cities.',
    hi: '{year} का सम्पूर्ण हिन्दू पंचांग  –  सभी प्रमुख त्योहार, एकादशी व्रत तिथियाँ, ग्रहण, पूर्णिमा और अमावस्या। उज्जैन (हिन्दू खगोल विज्ञान की पारम्परिक प्रधान याम्योत्तर) से शास्त्रीय वैदिक गणनाओं द्वारा गणित। सभी भारतीय नगरों के लिए सटीक।',
    ta: '{year} முழுமையான இந்து நாட்காட்டி  –  அனைத்து முக்கிய பண்டிகைகள், ஏகாதசி விரத தேதிகள், கிரகணங்கள், பௌர்ணமி மற்றும் அமாவாசை.',
    bn: '{year} এর সম্পূর্ণ হিন্দু পঞ্চাঙ্গ  –  সমস্ত প্রধান উৎসব, একাদশী ব্রত তারিখ, গ্রহণ, পূর্ণিমা এবং অমাবস্যা।',
  },
  jumpTo: {
    en: 'Jump to month',
    hi: 'महीने पर जाएँ',
    ta: 'மாதத்திற்குச் செல்லுங்கள்',
    bn: 'মাসে যান',
  },
  noEvents: {
    en: 'No festivals or vrats in this month.',
    hi: 'इस महीने में कोई त्योहार या व्रत नहीं।',
    ta: 'இந்த மாதத்தில் பண்டிகைகள் அல்லது விரதங்கள் இல்லை.',
    bn: 'এই মাসে কোনো উৎসব বা ব্রত নেই।',
  },
  totalFestivals: {
    en: '{count} festivals & vrats',
    hi: '{count} त्योहार एवं व्रत',
    ta: '{count} பண்டிகைகள் மற்றும் விரதங்கள்',
    bn: '{count}টি উৎসব ও ব্রত',
  },
  crossCalendar: {
    en: 'Interactive Festival Calendar',
    hi: 'इंटरैक्टिव त्योहार कैलेंडर',
    ta: 'ஊடாடும் பண்டிகை நாட்காட்டி',
    bn: 'ইন্টারেক্টিভ উৎসব ক্যালেন্ডার',
  },
  crossVivah: {
    en: 'Vivah Muhurat {year}',
    hi: 'विवाह मुहूर्त {year}',
    ta: 'விவாஹ முகூர்த்தம் {year}',
    bn: 'বিবাহ মুহূর্ত {year}',
  },
  crossEclipses: {
    en: 'Eclipse Calendar',
    hi: 'ग्रहण कैलेंडर',
    ta: 'கிரகண நாட்காட்டி',
    bn: 'গ্রহণ ক্যালেন্ডার',
  },
  crossEkadashi: {
    en: 'All Ekadashi Dates',
    hi: 'सभी एकादशी तिथियाँ',
    ta: 'அனைத்து ஏகாதசி தேதிகள்',
    bn: 'সমস্ত একাদশী তারিখ',
  },
  ujjainNote: {
    en: 'Dates computed for Ujjain (23.18°N, 75.79°E)  –  the traditional Hindu prime meridian. Tithi boundaries are within ±30 minutes for all Indian cities.',
    hi: 'तिथियाँ उज्जैन (23.18°N, 75.79°E) के लिए गणित  –  पारम्परिक हिन्दू प्रधान याम्योत्तर। सभी भारतीय नगरों के लिए ±30 मिनट के भीतर सटीक।',
    ta: 'உஜ்ஜைன் (23.18°N, 75.79°E)  –  பாரம்பரிய இந்து முதன்மை மெரிடியனுக்காக கணக்கிடப்பட்டது.',
    bn: 'উজ্জয়িনী (23.18°N, 75.79°E) এর জন্য গণনা  –  ঐতিহ্যবাহী হিন্দু প্রাইম মেরিডিয়ান।',
  },
  shareText: {
    en: 'Share this calendar',
    hi: 'यह कैलेंडर शेयर करें',
    ta: 'இந்த நாட்காட்டியைப் பகிரவும்',
    bn: 'এই ক্যালেন্ডার শেয়ার করুন',
  },
  major: { en: 'Major', hi: 'प्रमुख', ta: 'முக்கிய', bn: 'প্রধান' },
  vrat: { en: 'Vrat', hi: 'व्रत', ta: 'விரதம்', bn: 'ব্রত' },
  eclipse: { en: 'Eclipse', hi: 'ग्रहण', ta: 'கிரகணம்', bn: 'গ্রহণ' },
  regional: { en: 'Regional', hi: 'क्षेत्रीय', ta: 'பிராந்திய', bn: 'আঞ্চলিক' },
};

function l(key: string, locale: string, replacements?: Record<string, string>): string {
  const label = LABELS[key];
  if (!label) return key;
  let text = label[locale] || label.en || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}

// ─── Type badge config ──────────────────────────────────────────
const TYPE_BADGE_STYLES: Record<string, string> = {
  major: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  vrat: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  eclipse: 'bg-red-500/15 text-red-400 border-red-500/30',
  regional: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

function TypeBadge({ type, locale }: { type: string; locale: string }) {
  const style = TYPE_BADGE_STYLES[type] || TYPE_BADGE_STYLES.regional;
  const label = l(type, locale);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {type === 'major' && <Star className="w-3 h-3" />}
      {type === 'vrat' && <Moon className="w-3 h-3" />}
      {type === 'eclipse' && <Eclipse className="w-3 h-3" />}
      {type === 'regional' && <MapPin className="w-3 h-3" />}
      {label}
    </span>
  );
}

// ─── Group festivals by month ───────────────────────────────────
function groupByMonth(festivals: FestivalEntry[]): Map<number, FestivalEntry[]> {
  const map = new Map<number, FestivalEntry[]>();
  for (let m = 0; m < 12; m++) map.set(m, []);

  for (const f of festivals) {
    const [, monthStr] = f.date.split('-');
    const monthIdx = parseInt(monthStr, 10) - 1; // 0-based
    map.get(monthIdx)?.push(f);
  }

  // Sort each month by date
  for (const [, entries] of map) {
    entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  return map;
}

// ─── Format date for display ────────────────────────────────────
function formatDate(dateStr: string, locale: string): { day: string; weekday: string; monthDay: string } {
  const [y, m, d] = dateStr.split('-').map(Number);
  // Use Date.UTC to avoid timezone issues (Lesson L)
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekdayIdx = date.getUTCDay(); // 0=Sun (Lesson O)
  const weekdays = locale === 'hi' ? WEEKDAY_HI : WEEKDAY_EN;
  return {
    day: d.toString(),
    weekday: weekdays[weekdayIdx],
    monthDay: `${weekdays[weekdayIdx]}, ${d} ${locale === 'hi' ? MONTH_NAMES_HI[m - 1] : MONTH_NAMES_EN[m - 1]}`,
  };
}

// ─── Page Component ─────────────────────────────────────────────
export default async function HinduCalendarPage({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (!VALID_YEARS.includes(year)) {
    notFound();
  }

  // Generate all festivals for the year at build time
  const festivals = generateFestivalCalendarV2(year, UJJAIN_LAT, UJJAIN_LNG, UJJAIN_TZ);
  const byMonth = groupByMonth(festivals);
  const totalCount = festivals.length;

  const monthNames = locale === 'hi' ? MONTH_NAMES_HI : MONTH_NAMES_EN;

  const shareUrl = `https://dekhopanchang.com/${locale}/hindu-calendar/${year}`;
  const whatsappText = encodeURIComponent(
    `${l('h1', locale, { year: yearStr })}  –  ${shareUrl}`
  );

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* ─── Header ─────────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light mb-4 leading-tight">
            {l('h1', locale, { year: yearStr })}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-4">
            {l('intro', locale, { year: yearStr })}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1.5 bg-gold-primary/10 text-gold-primary px-3 py-1 rounded-full border border-gold-primary/20">
              <CalendarDays className="w-4 h-4" />
              {l('totalFestivals', locale, { count: totalCount.toString() })}
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

        {/* ─── Month Quick Jump ────────────────────────────────── */}
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

        {/* ─── Month Sections ──────────────────────────────────── */}
        {Array.from(byMonth.entries()).map(([monthIdx, entries]) => (
          <section key={monthIdx} id={`month-${monthIdx}`} className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="w-6 h-6 text-gold-primary flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gold-light">
                {monthNames[monthIdx]} {year}
              </h2>
              <span className="text-text-secondary text-sm ml-auto">
                {entries.length} {locale === 'hi' ? 'तिथियाँ' : 'events'}
              </span>
            </div>

            {entries.length === 0 ? (
              <p className="text-text-secondary italic pl-9">{l('noEvents', locale)}</p>
            ) : (
              <div className="space-y-3">
                {entries.map((festival, fIdx) => {
                  const { monthDay } = formatDate(festival.date, locale);
                  const name = tl(festival.name, locale);
                  const desc = tl(festival.description, locale);

                  return (
                    <article
                      key={`${festival.date}-${fIdx}`}
                      className="group p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                        {/* Date column */}
                        <div className="flex-shrink-0 text-sm text-gold-primary font-medium min-w-[140px]">
                          {monthDay}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                              {name}
                            </h3>
                            <TypeBadge type={festival.type} locale={locale} />
                            {festival.eclipseType && (
                              <span className="text-xs text-red-400">
                                ({festival.eclipseType === 'solar' ? (locale === 'hi' ? 'सूर्य' : 'Solar') : (locale === 'hi' ? 'चन्द्र' : 'Lunar')})
                              </span>
                            )}
                          </div>
                          {desc && (
                            <p className="text-sm text-text-secondary line-clamp-2">{desc}</p>
                          )}
                          {festival.masa && (
                            <p className="text-xs text-text-secondary/70 mt-1">
                              {festival.masa.amanta} {festival.paksha === 'shukla' ? (locale === 'hi' ? 'शुक्ल' : 'Shukla') : (locale === 'hi' ? 'कृष्ण' : 'Krishna')}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        ))}

        {/* ─── Ujjain Note ─────────────────────────────────────── */}
        <div className="mb-10 p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15 text-sm text-text-secondary">
          <p>{l('ujjainNote', locale)}</p>
        </div>

        {/* ─── Cross Links ─────────────────────────────────────── */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link
            href="/calendar"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors group"
          >
            <CalendarDays className="w-5 h-5 text-gold-primary flex-shrink-0" />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {l('crossCalendar', locale)}
            </span>
            <ChevronRight className="w-4 h-4 text-text-secondary ml-auto" />
          </Link>
          <Link
            href={`/vivah-muhurat/${year}` as '/vivah-muhurat/2026'}
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors group"
          >
            <Star className="w-5 h-5 text-gold-primary flex-shrink-0" />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {l('crossVivah', locale, { year: yearStr })}
            </span>
            <ChevronRight className="w-4 h-4 text-text-secondary ml-auto" />
          </Link>
          <Link
            href="/eclipses"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors group"
          >
            <Eclipse className="w-5 h-5 text-gold-primary flex-shrink-0" />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {l('crossEclipses', locale)}
            </span>
            <ChevronRight className="w-4 h-4 text-text-secondary ml-auto" />
          </Link>
          <Link
            href="/ekadashi"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-colors group"
          >
            <Moon className="w-5 h-5 text-gold-primary flex-shrink-0" />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {l('crossEkadashi', locale)}
            </span>
            <ChevronRight className="w-4 h-4 text-text-secondary ml-auto" />
          </Link>
        </nav>

        {/* ─── Personalised Panchang CTA (guests only) ──────────── */}
        <div className="mb-10">
          <CrossSellCTA
            headline={locale === 'hi'
              ? 'अपने शहर का व्यक्तिगत पंचांग + राशिफल पाएँ'
              : 'Get daily panchang for YOUR city + personalised rashifal'}
            subtext={locale === 'hi'
              ? 'मुफ़्त खाता बनाएँ  –  सूर्योदय पर ईमेल से दैनिक पंचांग प्राप्त करें'
              : 'Free account  –  daily panchang delivered to your inbox at sunrise'}
            href={`/${locale}/dashboard`}
            buttonLabel={locale === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard'}
            triggerAuth
          />
        </div>

        {/* ─── Other Year Link ──────────────────────────────────── */}
        <div className="text-center">
          {VALID_YEARS.filter(y => y !== year).map(otherYear => (
            <Link
              key={otherYear}
              href={`/hindu-calendar/${otherYear}` as '/hindu-calendar/2026'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 text-gold-light border border-gold-primary/20 hover:bg-gold-primary/20 hover:border-gold-primary/40 transition-colors font-medium"
            >
              <CalendarDays className="w-5 h-5" />
              {l('h1', locale, { year: otherYear.toString() })}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

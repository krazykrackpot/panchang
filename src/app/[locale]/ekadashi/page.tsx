import { setRequestLocale } from 'next-intl/server';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { resolveEkadashiDetail } from '@/lib/constants/festival-details-with-overlay';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import Link from 'next/link';
import { pickByScript } from "@/lib/utils/locale-fonts";

// ─── Static labels (EN + HI) ───

const LABELS = {
  title: { en: 'Ekadashi 2026  –  All 24 Sacred Fasting Dates', hi: 'एकादशी 2026  –  सभी 24 पवित्र व्रत तिथियाँ' },
  subtitle: {
    en: 'Complete list of all 24 Ekadashi dates in 2026 with names, stories from Padma Purana & Bhavishya Purana, and spiritual benefits. Each Ekadashi is dedicated to Lord Vishnu.',
    hi: '2026 की सभी 24 एकादशी तिथियों की सम्पूर्ण सूची  –  पद्म पुराण और भविष्य पुराण की कथाओं और आध्यात्मिक लाभों सहित। प्रत्येक एकादशी भगवान विष्णु को समर्पित है।',
  },
  shukla: { en: 'Shukla Paksha', hi: 'शुक्ल पक्ष' } as LocaleText,
  krishna: { en: 'Krishna Paksha', hi: 'कृष्ण पक्ष' } as LocaleText,
  brightHalf: { en: 'Bright Half (Waxing Moon)', hi: 'शुक्ल (बढ़ता चन्द्र)' } as LocaleText,
  darkHalf: { en: 'Dark Half (Waning Moon)', hi: 'कृष्ण (घटता चन्द्र)' } as LocaleText,
  story: { en: 'Story', hi: 'कथा' } as LocaleText,
  benefit: { en: 'Spiritual Benefit', hi: 'आध्यात्मिक लाभ' } as LocaleText,
  readStory: { en: 'Read the story', hi: 'कथा पढ़ें' } as LocaleText,
  quickTip: { en: 'What to do', hi: 'क्या करें' } as LocaleText,
  quickTipText: {
    en: 'Fast from sunrise, worship Lord Vishnu with Tulsi leaves, chant "Om Namo Bhagavate Vasudevaya", break fast next morning during Parana window.',
    hi: 'सूर्योदय से व्रत रखें, तुलसी पत्र से विष्णु की पूजा करें, "ॐ नमो भगवते वासुदेवाय" का जाप करें, अगली सुबह पारण काल में व्रत खोलें।',
  } as LocaleText,
  viewCalendar: { en: 'View Full Festival Calendar', hi: 'सम्पूर्ण त्योहार कैलेंडर देखें' } as LocaleText,
  aboutEkadashi: { en: 'About Ekadashi', hi: 'एकादशी के बारे में' } as LocaleText,
  aboutText: {
    en: 'Ekadashi (Sanskrit: एकादशी, "the eleventh") falls on the 11th tithi of each lunar fortnight  –  twice a month, once in Shukla Paksha (bright half) and once in Krishna Paksha (dark half). There are 24 named Ekadashis in a regular year, each with a unique story from the Padma Purana, Bhavishya Purana, or Brahma Vaivarta Purana. Fasting on Ekadashi is considered the most important of all Vaishnava observances, dedicated to Lord Vishnu.',
    hi: 'एकादशी (संस्कृत: एकादशी, "ग्यारहवीं") प्रत्येक चन्द्र पक्ष की 11वीं तिथि पर आती है  –  महीने में दो बार, एक शुक्ल पक्ष में और एक कृष्ण पक्ष में। सामान्य वर्ष में 24 नामित एकादशियाँ होती हैं, प्रत्येक की पद्म पुराण, भविष्य पुराण या ब्रह्म वैवर्त पुराण से एक अनूठी कथा है।',
  } as LocaleText,
  nirjalaNote: {
    en: 'Nirjala Ekadashi (Jyeshtha Shukla) is the most powerful  –  fasting without even water on this single day equals the merit of all 24 Ekadashis combined.',
    hi: 'निर्जला एकादशी (ज्येष्ठ शुक्ल) सबसे शक्तिशाली है  –  केवल इस एक दिन बिना जल के व्रत रखना सभी 24 एकादशियों के पुण्य के बराबर है।',
  } as LocaleText,
  // Hero ribbon + quick stats chrome — moved out of inline ternaries.
  // The other 7 locales arrive via the pre-commit Gemini overlay sync
  // (chore #589) on the next i18n-batch.
  vishnuVrata: { en: 'Vishnu Vrata', hi: 'विष्णु व्रत' } as LocaleText,
  ekadashisCount: { en: 'Ekadashis', hi: 'एकादशियाँ' } as LocaleText,
  monthsCount: { en: 'Months', hi: 'मास' } as LocaleText,
  perMonth: { en: 'Per Month', hi: 'प्रति मास' } as LocaleText,
  adhikPrefix: { en: 'Adhik ', hi: 'अधिक ' } as LocaleText,
} as const;

// Month display order for the calendar
const MONTH_ORDER = [
  'chaitra', 'vaishakha', 'jyeshtha', 'ashadha',
  'shravana', 'bhadrapada', 'ashwina', 'kartika',
  'margashirsha', 'pausha', 'magha', 'phalguna',
] as const;

const MONTH_LABELS: Record<string, LocaleText> = {
  chaitra:      { en: 'Chaitra',      hi: 'चैत्र' },
  vaishakha:    { en: 'Vaishakha',    hi: 'वैशाख' },
  jyeshtha:     { en: 'Jyeshtha',     hi: 'ज्येष्ठ' },
  ashadha:      { en: 'Ashadha',      hi: 'आषाढ़' },
  shravana:     { en: 'Shravana',     hi: 'श्रावण' },
  bhadrapada:   { en: 'Bhadrapada',   hi: 'भाद्रपद' },
  ashwina:      { en: 'Ashwina',      hi: 'आश्विन' },
  kartika:      { en: 'Kartika',      hi: 'कार्तिक' },
  margashirsha: { en: 'Margashirsha', hi: 'मार्गशीर्ष' },
  pausha:       { en: 'Pausha',       hi: 'पौष' },
  magha:        { en: 'Magha',        hi: 'माघ' },
  phalguna:     { en: 'Phalguna',     hi: 'फाल्गुन' },
};

/** Resolve the section label, prefixing with "Adhik" / "अधिक" when the
 *  bucket key is `adhik:<masa>`. Adhik Maas (Purushottama Masa) is the
 *  intercalary month — its Ekadashis (Padmini, Parama) are distinct from
 *  the regular month's Nirjala/Apara/etc. */
function monthLabel(bucketKey: string, locale: string): string {
  const isAdhik = bucketKey.startsWith('adhik:');
  const base = isAdhik ? bucketKey.slice('adhik:'.length) : bucketKey;
  const baseLabel = tl(MONTH_LABELS[base] || { en: base }, locale);
  if (!isAdhik) return baseLabel;
  return `${tl(LABELS.adhikPrefix, locale)}${baseLabel}`;
}

interface EkadashiCard {
  name: LocaleText;
  date: string;
  paksha: 'shukla' | 'krishna';
  masa: string;
  isAdhika: boolean;
  story: LocaleText;
  benefit: LocaleText;
  slug: string;
}

/**
 * Compute 2026 Ekadashi dates using the festival generator.
 * Uses a neutral reference location (0,0 UTC)  –  Ekadashi date is the same
 * across all locations (tithi 11 sunrise date varies by at most 1 day at
 * extreme longitudes, but the canonical date is universal).
 */
function getEkadashiData(): EkadashiCard[] {
  // Use Delhi coordinates as a reference for date computation
  // Ekadashi tithi dates are essentially the same across India (+/- 0 days)
  const festivals = generateFestivalCalendarV2(2026, 28.6139, 77.209, 'Asia/Kolkata');
  const ekadashis = festivals.filter(f => f.category === 'ekadashi');

  const cards: EkadashiCard[] = [];

  for (const ek of ekadashis) {
    const paksha = ek.paksha || 'shukla';
    const masaName = ek.masa?.amanta || '';
    const isAdhika = ek.masa?.isAdhika ?? false;

    // Canonical Ekadashi resolution — handles Adhik Maas correctly
    // (Padmini/Parama) instead of falling back to the regular-month
    // Nirjala/Apara. Lesson ZA: shared with the festival generator so
    // /ekadashi and /festivals never diverge. Pass ek.masa directly so
    // both amanta and purnimanta reach the resolver — EKADASHI_NAMES is
    // Purnimant-keyed and needs both fields present for Krishna paksha.
    // PR #738 Gemini review.
    const detail = resolveEkadashiDetail(ek.masa, paksha);
    if (!detail) continue;

    cards.push({
      name: detail.name,
      date: ek.date,
      paksha,
      masa: masaName,
      isAdhika,
      story: detail.story,
      benefit: detail.benefit,
      slug: ek.slug || 'ekadashi',
    });
  }

  // Sort by date
  cards.sort((a, b) => a.date.localeCompare(b.date));
  return cards;
}

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const lang = pickByScript('en-GB', 'hi-IN', locale);
  return date.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Group by month, separating Adhik Maas from the regular month it
 * extends. Adhik Jyeshtha's Padmini/Parama Ekadashis must NOT appear in
 * the same section as Jyeshtha's Nirjala/Apara — they're a distinct
 * intercalary month with their own dedicated Ekadashi names.
 *
 * Keys: `'jyeshtha'` for regular, `'adhik:jyeshtha'` for Adhik Jyeshtha.
 *
 * **Ordering**: in the Hindu calendar the Adhik (intercalary) month
 * ALWAYS PRECEDES the Nija (regular) month it doubles. For 2026:
 * Adhik Jyeshtha (May-June) runs before regular Jyeshtha (June-July).
 * The page must read in calendar order, so the Adhik bucket emits
 * FIRST, then the regular bucket. This mirrors how Prokerala and Drik
 * Panchang display the same months.
 */
function groupByMonth(cards: EkadashiCard[]): Map<string, EkadashiCard[]> {
  const grouped = new Map<string, EkadashiCard[]>();
  for (const month of MONTH_ORDER) {
    const adhik = cards.filter(c => c.masa === month && c.isAdhika);
    if (adhik.length > 0) grouped.set(`adhik:${month}`, adhik);
    const regular = cards.filter(c => c.masa === month && !c.isAdhika);
    if (regular.length > 0) grouped.set(month, regular);
  }
  return grouped;
}

// ─── Moon Phase SVG Icons ───

function ShuklaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1a1040" stroke="#d4a853" strokeWidth="1" />
      <path d="M12 2a10 10 0 0 1 0 20" fill="#f0d48a" />
    </svg>
  );
}

function KrishnaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f0d48a" stroke="#d4a853" strokeWidth="1" />
      <path d="M12 2a10 10 0 0 1 0 20" fill="#1a1040" />
    </svg>
  );
}

// ─── Ornamental Border SVG ───

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-primary/50">
        <path d="M12 2l2.09 6.26L21 9.27l-5 4.87L17.18 21 12 17.27 6.82 21 8 14.14l-5-4.87 6.91-1.01L12 2z" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />
    </div>
  );
}

// ─── Ekadashi Card Component ───

function EkadashiCardComponent({
  card,
  locale,
  index,
}: {
  card: EkadashiCard;
  locale: string;
  index: number;
}) {
  const isShukla = card.paksha === 'shukla';

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-all duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top accent line */}
      <div className={`h-1 w-full ${isShukla ? 'bg-gradient-to-r from-gold-primary/60 via-gold-light/40 to-gold-primary/60' : 'bg-gradient-to-r from-purple-500/40 via-indigo-400/30 to-purple-500/40'}`} />

      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            {/* Serial number + Paksha badge */}
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-mono text-text-secondary/60">#{index + 1}</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${isShukla ? 'bg-gold-primary/15 text-gold-light' : 'bg-purple-500/15 text-purple-300'}`}>
                {isShukla ? <ShuklaIcon /> : <KrishnaIcon />}
                {tl(isShukla ? LABELS.brightHalf : LABELS.darkHalf, locale)}
              </span>
            </div>

            {/* Name */}
            <h3 className="text-xl sm:text-2xl font-bold text-gold-light group-hover:text-gold-primary transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl(card.name, locale)}
            </h3>
          </div>

          {/* Large moon icon */}
          <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gold-primary/8 border border-gold-primary/15">
            {isShukla ? (
              <svg viewBox="0 0 32 32" className="w-7 h-7">
                <circle cx="16" cy="16" r="13" fill="#1a1040" stroke="#d4a853" strokeWidth="0.8" />
                <path d="M16 3a13 13 0 0 1 0 26" fill="#f0d48a" opacity="0.9" />
              </svg>
            ) : (
              <svg viewBox="0 0 32 32" className="w-7 h-7">
                <circle cx="16" cy="16" r="13" fill="#f0d48a" stroke="#d4a853" strokeWidth="0.8" opacity="0.9" />
                <path d="M16 3a13 13 0 0 1 0 26" fill="#1a1040" />
              </svg>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mb-5">
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-gold-primary/60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="14" height="14" rx="2" />
            <path d="M3 8h14M7 2v4M13 2v4" />
          </svg>
          <time dateTime={card.date} className="text-sm font-medium text-text-primary">
            {formatDate(card.date, locale)}
          </time>
        </div>

        {/* Story */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-primary/60 mb-1.5">
            {tl(LABELS.story, locale)}
          </h4>
          <p className="text-sm leading-relaxed text-text-secondary">
            {tl(card.story, locale)}
          </p>
        </div>

        {/* Benefit */}
        <div className="px-4 py-3 rounded-xl bg-gold-primary/8 border border-gold-primary/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-primary/70 mb-1">
            {tl(LABELS.benefit, locale)}
          </h4>
          <p className="text-sm font-medium text-gold-light/90">
            {tl(card.benefit, locale)}
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── Page Component (Server Component) ───

export default async function EkadashiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ekadashis = getEkadashiData();
  const grouped = groupByMonth(ekadashis);

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-gold-primary/8 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-purple-500/6 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Ornamental top */}
          <div className="flex items-center justify-center gap-2 mb-4" aria-hidden="true">
            <svg viewBox="0 0 40 20" className="w-10 h-5 text-gold-primary/40">
              <path d="M0 10 Q10 0 20 10 Q30 20 40 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-gold-primary/50 text-xs tracking-[0.3em] uppercase font-medium">
              {tl(LABELS.vishnuVrata, locale)}
            </span>
            <svg viewBox="0 0 40 20" className="w-10 h-5 text-gold-primary/40 scale-x-[-1]">
              <path d="M0 10 Q10 0 20 10 Q30 20 40 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl(LABELS.title, locale)}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {tl(LABELS.subtitle, locale)}
          </p>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-gold-primary">{ekadashis.length}</span>
              <span className="text-xs text-text-secondary mt-0.5">{tl(LABELS.ekadashisCount, locale)}</span>
            </div>
            <div className="w-px h-10 bg-gold-primary/20" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-gold-primary">12</span>
              <span className="text-xs text-text-secondary mt-0.5">{tl(LABELS.monthsCount, locale)}</span>
            </div>
            <div className="w-px h-10 bg-gold-primary/20" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-gold-primary">2</span>
              <span className="text-xs text-text-secondary mt-0.5">{tl(LABELS.perMonth, locale)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Ekadashi section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl(LABELS.aboutEkadashi, locale)}
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary mb-4">
            {tl(LABELS.aboutText, locale)}
          </p>
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-gold-primary/8 border border-gold-primary/10">
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" fill="currentColor">
              <path d="M10 2l2.09 6.26L19 9.27l-5 4.87L15.18 19 10 15.77 4.82 19 6 14.14l-5-4.87 6.91-1.01L10 2z" />
            </svg>
            <p className="text-sm font-medium text-gold-light/90">
              {tl(LABELS.nirjalaNote, locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Tip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-[#2d1b69]/20 via-[#1a1040]/30 to-[#2d1b69]/20 border border-gold-primary/8 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gold-primary/10">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gold-light mb-1">{tl(LABELS.quickTip, locale)}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{tl(LABELS.quickTipText, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <OrnamentalDivider />

      {/* Month-by-month Ekadashi cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {Array.from(grouped.entries()).map(([month, cards]) => (
          <div key={month} className="mb-12 last:mb-0">
            {/* Month header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gold-primary/20 to-gold-dark/10 border border-gold-primary/20">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
                {monthLabel(month, locale)}
              </h2>
              <div className="h-px flex-1 bg-gold-primary/15" />
            </div>

            {/* Two cards per month */}
            <div className="grid gap-5 sm:grid-cols-2">
              {cards.map((card, i) => {
                // Find global index for numbering
                const globalIndex = ekadashis.findIndex(e => e.date === card.date && e.paksha === card.paksha);
                return (
                  <EkadashiCardComponent
                    key={card.slug}
                    card={card}
                    locale={locale}
                    index={globalIndex >= 0 ? globalIndex : i}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <OrnamentalDivider />

      {/* CTA  –  Link to festival calendar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-primary/20 to-gold-dark/10 border border-gold-primary/25 hover:border-gold-primary/50 text-gold-light font-medium transition-all duration-300 hover:shadow-lg hover:shadow-gold-primary/10"
        >
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="14" height="14" rx="2" />
            <path d="M3 8h14M7 2v4M13 2v4" />
          </svg>
          {tl(LABELS.viewCalendar, locale)}
        </Link>
      </section>
    </main>
  );
}

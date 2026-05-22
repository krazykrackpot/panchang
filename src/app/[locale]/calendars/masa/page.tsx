'use client';

/**
 * Hindu Months Calendar (`/[locale]/calendars/masa`).
 *
 * Twelve (or thirteen — adhika years) lunar-month cards for the current
 * Hindu year. Each card surfaces:
 *   - Masa name (trilingual; Devanagari for hi/sa locales, transliterated
 *     English otherwise)
 *   - Start → end date in the Gregorian calendar (computed by
 *     `computeHinduMonths` / `computePurnimantMonths`)
 *   - ADHIK badge when intercalary
 *   - Ritu (season) + Ayana (solar direction)
 *   - Up to four major festivals/vrats observed in the month, pulled from
 *     `ALL_FESTIVAL_DEFS` indexed by purnimant masa name (def.masa)
 *
 * Amanta / Purnimanta toggle mirrors `/calendars/tithi`. Default = Amanta
 * (matches Prokerala). The two diverge by one masa during Krishna Paksha,
 * so the same card may be labelled differently under each convention.
 */

import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { computeHinduMonths, computePurnimantMonths } from '@/lib/calendar/hindu-months';
import { ALL_FESTIVAL_DEFS, type FestivalDef } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format YYYY-MM-DD → localised short date ("17 May 2026"). */
function formatDate(dateStr: string, locale: string): string {
  // YYYY-MM-DD parses unambiguously across timezones as UTC midnight,
  // but for display we want the calendar date as written — using local
  // construction is safe here because we never do arithmetic on the
  // result.
  const [y, m, d] = dateStr.split('-').map(Number);
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(y, m - 1, d));
  } catch {
    return dateStr;
  }
}

/** Build a festival display-name from a FestivalDef. Prefers FESTIVAL_DETAILS,
 *  falls back to def.name, falls back to a humanised slug. */
function festivalName(def: FestivalDef, locale: string): string {
  const fromDetails = FESTIVAL_DETAILS[def.slug]?.name;
  if (fromDetails) return tl(fromDetails, locale);
  if (def.name) return tl(def.name, locale);
  return def.slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/** Pick up to N major-tier festivals for a given purnimant masa name. */
function festivalsForMasa(purnimantName: string, n = 4): FestivalDef[] {
  const target = purnimantName.toLowerCase().replace(/^adhika /, '');
  const matches = ALL_FESTIVAL_DEFS.filter(
    (def) => def.masa?.toLowerCase() === target && (def.type === 'major' || def.category === 'festival'),
  );
  // De-duplicate by slug (multi-day festivals share a family).
  const seen = new Set<string>();
  const unique: FestivalDef[] = [];
  for (const def of matches) {
    if (seen.has(def.slug)) continue;
    seen.add(def.slug);
    unique.push(def);
    if (unique.length >= n) break;
  }
  return unique;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HINDU_YEAR_RANGE = { min: 2024, max: 2030 };

export default function HinduMonthsCalendar() {
  const locale = useLocale();
  const headingFont = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-cinzel)' };

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [convention, setConvention] = useState<'amanta' | 'purnimanta'>('amanta');

  // ── Months + sandwich expansion ──
  // For Purnimant: expand Adhika+Nija into a 3-layer sandwich. Ported
  // verbatim from src/app/[locale]/panchang/masa/page.tsx (commit
  // da335420). DO NOT reinvent this — it's the single source of truth
  // for adhika date ranges and any drift breaks user trust.
  interface DisplayRow {
    n: number | string;
    en: string;
    hi: string;
    sa: string;
    startDate: string;
    endDate: string;
    ritu: { en: string; hi: string; sa: string } & Record<string, string>;
    ayana: { en: string; hi: string; sa: string } & Record<string, string>;
    isAdhika: boolean;
    sandwichLayer?: 'top' | 'filling' | 'bottom';
  }

  const rows: DisplayRow[] = useMemo(() => {
    const months =
      convention === 'purnimanta' ? computePurnimantMonths(year) : computeHinduMonths(year);
    const out: DisplayRow[] = [];
    const skipNext = new Set<number>();
    const amantData = convention === 'purnimanta' ? computeHinduMonths(year) : [];

    for (let idx = 0; idx < months.length; idx++) {
      if (skipNext.has(idx)) continue;
      const m = months[idx];
      const nextM = months[idx + 1];

      if (convention === 'purnimanta' && m.isAdhika && nextM && !nextM.isAdhika) {
        const baseName = m.en.replace('Adhika ', '');
        const baseHi = m.hi.replace('अधिक ', '');
        const baseSa = m.sa.replace('अधिक ', '');
        const amAdhika = amantData.find((a) => a.isAdhika);
        const adhikaStart = amAdhika?.startDate || m.startDate;
        const adhikaEnd = amAdhika?.endDate || m.endDate;

        // Layer 1: Nija Krishna Paksha (Purnima → Amavasya)
        out.push({
          n: '',
          en: `${baseName} Krishna`,
          hi: `${baseHi} कृष्ण`,
          sa: `${baseSa} कृष्ण`,
          startDate: m.startDate,
          endDate: adhikaStart,
          ritu: m.ritu as DisplayRow['ritu'],
          ayana: m.ayana as DisplayRow['ayana'],
          isAdhika: false,
          sandwichLayer: 'top',
        });
        // Layer 2: Adhika full month (Amavasya → Amavasya)
        out.push({
          n: '',
          en: m.en,
          hi: m.hi,
          sa: m.sa,
          startDate: adhikaStart,
          endDate: adhikaEnd,
          ritu: m.ritu as DisplayRow['ritu'],
          ayana: m.ayana as DisplayRow['ayana'],
          isAdhika: true,
          sandwichLayer: 'filling',
        });
        // Layer 3: Nija Shukla Paksha (Amavasya → Purnima)
        out.push({
          n: '',
          en: `${baseName} Shukla`,
          hi: `${baseHi} शुक्ल`,
          sa: `${baseSa} शुक्ल`,
          startDate: adhikaEnd,
          endDate: nextM.endDate,
          ritu: nextM.ritu as DisplayRow['ritu'],
          ayana: nextM.ayana as DisplayRow['ayana'],
          isAdhika: false,
          sandwichLayer: 'bottom',
        });
        skipNext.add(idx + 1);
      } else {
        out.push({
          n: m.n,
          en: m.en,
          hi: m.hi,
          sa: m.sa,
          startDate: m.startDate,
          endDate: m.endDate,
          ritu: m.ritu as DisplayRow['ritu'],
          ayana: m.ayana as DisplayRow['ayana'],
          isAdhika: m.isAdhika,
        });
      }
    }

    // Rotate so the Hindu year starts with Chaitra (masa #1). The
    // engine returns months in Gregorian order, so for input year=2026
    // we get Pausha 2025-Dec → … → Margashirsha 2026-Dec. Users expect
    // the Hindu calendar to read Chaitra → Phalguna, so we rotate
    // anything before the first Chaitra to the end as a "Next-year
    // tail". Detection: base name starts with "Chaitra" and isn't the
    // adhika filling.
    const chaitraIdx = out.findIndex(
      (r) => r.en.replace(/^Adhika /, '').startsWith('Chaitra') && r.sandwichLayer !== 'filling',
    );
    const ordered = chaitraIdx > 0 ? [...out.slice(chaitraIdx), ...out.slice(0, chaitraIdx)] : out;

    // Renumber after rotation + sandwich expansion. Filling layers keep
    // an empty number so the visual hierarchy stays clean.
    let counter = 1;
    for (const r of ordered) {
      if (r.sandwichLayer === 'filling') r.n = '';
      else r.n = counter++;
    }
    return ordered;
  }, [year, convention]);

  const firstRow = rows.find((r) => !r.isAdhika && !r.sandwichLayer);
  const lastRow = rows[rows.length - 1];
  const yearRangeLabel = firstRow && lastRow
    ? `${formatDate(firstRow.startDate, locale)} – ${formatDate(lastRow.endDate, locale)}`
    : '';
  const hasAdhika = rows.some((r) => r.isAdhika);

  return (
    <main className="relative z-10 min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light mb-2 leading-tight"
            style={headingFont}
          >
            {isDevanagariLocale(locale) ? 'हिन्दू मास कैलेण्डर' : 'Hindu Months Calendar'}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            {isDevanagariLocale(locale)
              ? 'चैत्र से फाल्गुन तक — १२ चन्द्र मास, उनकी तिथियाँ, ऋतु एवं प्रमुख त्यौहार।'
              : 'Chaitra to Phalguna — 12 lunar months with their dates, ritu, ayana, and key festivals.'}
          </p>
          {yearRangeLabel && (
            <p className="text-xs sm:text-sm text-gold-primary/80 font-medium tracking-wide mt-2">
              {yearRangeLabel}
            </p>
          )}
        </div>

        {/* ── Hero wheel — the twelve-masa ornamental wheel sits above
            the grid as a navigation-friendly overview. Wrapped in a
            soft glow to lift it off the navy background. */}
        <div className="flex justify-center my-6 sm:my-8">
          <div className="relative w-full max-w-[480px] aspect-square rounded-full overflow-hidden shadow-[0_0_60px_rgba(212,168,83,0.18)]">
            <Image
              src="/festivals/hindu-months-wheel.png"
              alt="Hindu Months — twelve lunar masa wheel with iconic festivals per month"
              fill
              sizes="(max-width: 640px) 90vw, 480px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Year nav ── */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setYear((y) => Math.max(HINDU_YEAR_RANGE.min, y - 1))}
            disabled={year <= HINDU_YEAR_RANGE.min}
            aria-label="Previous year"
            className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-gold-light text-xl font-bold min-w-[120px] text-center" style={headingFont}>
            {year}
          </h2>
          <button
            onClick={() => setYear((y) => Math.min(HINDU_YEAR_RANGE.max, y + 1))}
            disabled={year >= HINDU_YEAR_RANGE.max}
            aria-label="Next year"
            className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Convention toggle ── */}
        <div className="flex justify-center mb-3">
          <div
            role="radiogroup"
            aria-label="Masa convention"
            className="inline-flex items-center gap-1 p-1 rounded-xl border border-gold-primary/25 bg-bg-secondary/40 backdrop-blur-sm"
          >
            {(['amanta', 'purnimanta'] as const).map((opt) => (
              <button
                key={opt}
                role="radio"
                aria-checked={convention === opt}
                onClick={() => setConvention(opt)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  convention === opt
                    ? 'bg-gold-primary/30 text-gold-light border border-gold-primary/60 shadow-[inset_0_0_8px_rgba(212,168,83,0.25)]'
                    : 'text-text-secondary hover:text-gold-light border border-transparent'
                }`}
              >
                {opt === 'amanta' ? 'Amanta' : 'Purnimanta'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-[11px] text-text-secondary/70 max-w-md mx-auto mb-6">
          {convention === 'amanta'
            ? 'Amanta — month boundaries at new-moon (Amavasya). Default for South/West India.'
            : 'Purnimanta — month boundaries at full-moon (Purnima). Default for North India.'}
        </p>

        {/* ── Adhika year callout ── */}
        {hasAdhika && (
          <div className="mb-6 p-4 rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/15 via-emerald-700/10 to-transparent flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-100/95">
              <span className="font-bold uppercase tracking-wider text-emerald-200">Adhika Masa year.</span>{' '}
              {year} contains an intercalary month — an extra lunar month inserted to keep the lunar
              and solar calendars in sync. It happens roughly once every 32–33 months. Adhik months
              are sacred for devotional practice but inauspicious for new ventures (no marriages,
              housewarmings, or major life events).
            </div>
          </div>
        )}

        {/* ── Grid of month cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {rows.map((row) => {
            // Festival lookup keys off the base masa name (strip "Adhika "
            // and any "Krishna"/"Shukla" paksha suffix the sandwich layers
            // added). FESTIVAL_DEFS use purnimant naming.
            const festivalKey = row.en
              .replace(/^Adhika /, '')
              .replace(/ (Krishna|Shukla)$/, '');
            const festivals = festivalsForMasa(festivalKey, 4);
            const nameForLocale =
              locale === 'hi' ? row.hi : locale === 'sa' ? row.sa : row.en;
            const baseName = row.en.replace(/^Adhika /, '');

            // Visual treatment: adhika = emerald glow; sandwich top/bottom
            // (Nija paksha halves) = amber accent; everything else =
            // standard gold-bordered card.
            const cardCls = row.isAdhika
              ? 'bg-gradient-to-br from-emerald-700/30 via-emerald-900/20 to-[#0a0e27] border-emerald-400/55 shadow-[0_0_24px_rgba(16,185,129,0.25)]'
              : row.sandwichLayer
                ? 'bg-gradient-to-br from-amber-500/15 via-[#1a1040]/55 to-[#0a0e27] border-amber-400/40'
                : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-gold-primary/20 hover:border-gold-primary/45';

            return (
              <article
                key={`${row.n}-${row.startDate}-${row.isAdhika}-${row.sandwichLayer ?? 'std'}`}
                className={`rounded-2xl p-5 border transition-all ${cardCls}`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    {row.isAdhika && (
                      <div className="inline-block mb-1.5 px-2 py-0.5 rounded bg-emerald-500/35 text-emerald-100 border border-emerald-400/60 text-[10px] font-black uppercase tracking-widest">
                        Adhik · Intercalary
                      </div>
                    )}
                    {row.sandwichLayer === 'top' && (
                      <div className="inline-block mb-1.5 px-2 py-0.5 rounded bg-amber-500/25 text-amber-100 border border-amber-400/55 text-[10px] font-black uppercase tracking-widest">
                        Before Adhik · Nija Krishna
                      </div>
                    )}
                    {row.sandwichLayer === 'bottom' && (
                      <div className="inline-block mb-1.5 px-2 py-0.5 rounded bg-amber-500/25 text-amber-100 border border-amber-400/55 text-[10px] font-black uppercase tracking-widest">
                        After Adhik · Nija Shukla
                      </div>
                    )}
                    <h3
                      className={`text-xl sm:text-2xl font-bold leading-tight ${
                        row.isAdhika
                          ? 'text-emerald-100'
                          : row.sandwichLayer
                            ? 'text-amber-200'
                            : 'text-gold-light'
                      }`}
                      style={headingFont}
                    >
                      {nameForLocale}
                    </h3>
                    {locale !== 'en' && (
                      <div className="text-xs text-text-secondary/80 mt-0.5">{baseName}</div>
                    )}
                  </div>
                  <div className={`text-xs font-bold tracking-widest uppercase px-2 py-1 rounded ${
                    row.isAdhika
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                      : row.sandwichLayer
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                        : 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                  }`}>
                    {row.n === '' ? '·' : `#${row.n}`}
                  </div>
                </div>

                {/* Date range */}
                <div className="text-sm text-text-primary/95 mb-3 font-mono">
                  {formatDate(row.startDate, locale)}
                  <span className="text-text-secondary/60 mx-1.5">→</span>
                  {formatDate(row.endDate, locale)}
                </div>

                {/* Ritu + Ayana chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-200 border border-amber-400/30">
                    {tl(row.ritu, locale)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-200 border border-cyan-400/30">
                    {tl(row.ayana, locale)}
                  </span>
                </div>

                {/* Festivals — hide on the Adhika filling card (no
                    auspicious festivals are observed during an adhika
                    month by convention). */}
                {row.isAdhika ? (
                  <div className="pt-3 mt-2 border-t border-emerald-400/20 text-[11px] text-emerald-200/85 italic">
                    No major festivals — Adhika months are reserved for
                    devotional practice; new ventures are inauspicious.
                  </div>
                ) : festivals.length > 0 ? (
                  <div className="pt-3 mt-2 border-t border-gold-primary/15">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gold-primary/70 mb-1.5">
                      Key Festivals
                    </div>
                    <ul className="space-y-1">
                      {festivals.map((def) => (
                        <li key={def.slug} className="text-xs text-text-primary/85 flex items-start gap-1.5">
                          <span className="text-gold-primary/60 mt-0.5">•</span>
                          <span>{festivalName(def, locale)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="pt-3 mt-2 border-t border-gold-primary/15 text-[11px] text-text-secondary/60 italic">
                    No major festivals catalogued for this masa.
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ── Footer / cross-links ── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link
            href={`/${locale}/calendars/tithi`}
            className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 transition-colors"
          >
            ← Tithi Calendar
          </Link>
          <Link
            href={`/${locale}/calendar`}
            className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 transition-colors"
          >
            Festival Calendar →
          </Link>
          <Link
            href={`/${locale}/panchang/masa`}
            className="px-4 py-2 rounded-xl border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 transition-colors"
          >
            Learn about each Masa
          </Link>
        </div>
      </div>
    </main>
  );
}

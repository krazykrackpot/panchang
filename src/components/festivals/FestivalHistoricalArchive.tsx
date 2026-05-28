/**
 * Historical festival dates table — 2020-2030 (server component).
 *
 * Past years (2020-2025) render as plain text rows from a static
 * fixture. Current valid years (2026-2030) link to their year-page.
 * Picks up "diwali 2024 date" / "holi 2023 date" long-tail SEO.
 *
 * Wraps the table in @type: ItemList JSON-LD via a script tag below
 * (caller-emitted; this component only renders the visible table).
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4G
 */

import { Link } from '@/lib/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';

interface Props {
  /** Festival slug */
  slug: string;
  /** Display name (English) for the section header */
  festivalNameEn: string;
  /** Display name (Hindi) */
  festivalNameHi: string;
  /** Currently-viewed year — highlighted in the table */
  currentYear: number;
  /** Historical fixture for this festival: { year: 'YYYY-MM-DD' } */
  historicalDates: Record<number, string>;
  /** Future-year valid range (e.g. [2026, 2027, 2028, 2029, 2030]) — these become linkable */
  futureYears: readonly number[];
  locale: Locale;
}

const MONTH_NAMES_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_NAMES_HI = ['जन','फर','मार्च','अप्रै','मई','जून','जुल','अग','सित','अक्टू','नव','दिस'];

function formatDate(iso: string, locale: Locale): string {
  const [, mm, dd] = iso.split('-');
  const monthIdx = parseInt(mm, 10) - 1;
  const day = parseInt(dd, 10);
  const month = locale === 'hi' ? MONTH_NAMES_HI[monthIdx] : MONTH_NAMES_EN[monthIdx];
  return locale === 'hi' ? `${day} ${month}` : `${month} ${day}`;
}

export default function FestivalHistoricalArchive({
  slug,
  festivalNameEn,
  festivalNameHi,
  currentYear,
  historicalDates,
  futureYears,
  locale,
}: Props) {
  const sectionTitle = locale === 'hi'
    ? `${festivalNameHi} वर्षों में — २०२०-२०३०`
    : `${festivalNameEn} Across the Years — 2020-2030`;

  const subtitle = locale === 'hi'
    ? 'पिछले एवं भविष्य के वर्षों की तिथियाँ — एक स्थान पर।'
    : 'Past and future dates — one place.';

  const pastYears = Object.keys(historicalDates)
    .map(Number)
    .sort((a, b) => a - b);

  // Filter out any future-year that overlaps with a past-year — guards
  // against React duplicate-key warnings if the historical fixture is
  // ever extended into the future-valid range (e.g. 2026 lands in
  // HISTORICAL_FESTIVAL_DATES while still being in FESTIVAL_VALID_YEARS).
  const allYears = [...pastYears, ...futureYears.filter((y) => !historicalDates[y])];

  return (
    <section className="mb-10" aria-labelledby="archive-heading">
      <div className="mb-4">
        <h2
          id="archive-heading"
          className="text-xl sm:text-2xl font-bold text-gold-light mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {sectionTitle}
        </h2>
        <p className="text-text-secondary text-xs">{subtitle}</p>
      </div>

      <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gold-primary/10">
            <tr>
              <th className="text-left px-4 py-2 text-gold-light font-semibold text-xs uppercase tracking-wider">
                {locale === 'hi' ? 'वर्ष' : 'Year'}
              </th>
              <th className="text-left px-4 py-2 text-gold-light font-semibold text-xs uppercase tracking-wider">
                {locale === 'hi' ? 'तिथि' : 'Date'}
              </th>
              <th className="text-right px-4 py-2 text-gold-light font-semibold text-xs uppercase tracking-wider">
                {locale === 'hi' ? 'विवरण' : 'Detail'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-primary/8">
            {allYears.map((year) => {
              const dateStr = historicalDates[year];
              const isFuture = futureYears.includes(year);
              const isCurrent = year === currentYear;
              const rowClass = isCurrent
                ? 'bg-gold-primary/10 text-gold-light font-semibold'
                : 'text-text-primary hover:bg-gold-primary/5';
              return (
                <tr key={year} className={rowClass}>
                  <td className="px-4 py-2.5 text-sm">{year}</td>
                  <td className="px-4 py-2.5 text-sm">
                    {dateStr ? formatDate(dateStr, locale) : (
                      isFuture
                        ? <span className="text-text-secondary italic">{locale === 'hi' ? '(गणना की जा रही है)' : '(computed)'}</span>
                        : <span className="text-text-secondary italic">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {isFuture ? (
                      <Link
                        href={`/festivals/${slug}/${year}`}
                        className="inline-flex items-center gap-1 text-xs text-gold-primary hover:text-gold-light"
                      >
                        {locale === 'hi' ? 'देखें' : 'View'} <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-[10px] text-text-secondary/60 italic">
                        {locale === 'hi' ? 'पिछली तिथि' : 'Past date'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

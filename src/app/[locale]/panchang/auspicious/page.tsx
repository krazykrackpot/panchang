import { setRequestLocale } from 'next-intl/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getSeoCityForLocale } from '@/lib/constants/cities';
import { tl } from '@/lib/utils/trilingual';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import Link from 'next/link';
import AuspiciousClient from './Client';
import {
  pickAuspiciousLabel as AL,
  formatAuspiciousLabel,
  auspiciousWeekday,
} from '@/lib/content/panchang-auspicious-labels';

export const revalidate = 86400;

// SEO city resolved per-locale via getSeoCityForLocale() inside the
// handler; see cities.ts SEO_CITY_BY_LOCALE map.

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

interface TimeWindow { start: string; end: string }

interface AuspiciousRow {
  nameKey: string;          // e.g. 'brahmaName' — resolves via AL(key, locale)
  descKey: string;          // e.g. 'brahmaDesc'
  time: string;
  nature: 'auspicious' | 'inauspicious';
}

export default async function AuspiciousPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const city = getSeoCityForLocale(locale);
  const cityName = tl(city.name, locale);

  const rows: AuspiciousRow[] = [];
  let weekday = now.getUTCDay();

  // city is guaranteed non-null by getSeoCityForLocale. try/catch
  // protects against engine failures only.
  try {
    const tzOffset = getUTCOffsetForDate(year, month, day, city.timezone);
    const panchang = computePanchang({
      year, month, day,
      lat: city.lat, lng: city.lng, tzOffset,
      timezone: city.timezone,
    });
    weekday = panchang.vara?.day ?? weekday;

    const fmtWindow = (w: TimeWindow) => `${fmt12(w.start)} – ${fmt12(w.end)}`;

    // Auspicious timings
    if (panchang.brahmaMuhurta) {
      rows.push({
        nameKey: 'brahmaName', descKey: 'brahmaDesc',
        time: fmtWindow(panchang.brahmaMuhurta), nature: 'auspicious',
      });
    }

    {
      const abh = panchang.abhijitMuhurta;
      const isWed = weekday === 3;
      rows.push({
        nameKey: 'abhijitName',
        // Wednesday flips Abhijit from auspicious to inauspicious; pick the
        // matching description variant. Both name + paragraph reflect this.
        descKey: isWed ? 'abhijitDescWed' : 'abhijitDesc',
        time: fmtWindow(abh), nature: isWed ? 'inauspicious' : 'auspicious',
      });
    }

    if (panchang.amritKalamAll && panchang.amritKalamAll.length > 0) {
      panchang.amritKalamAll.forEach((w: TimeWindow) => {
        rows.push({
          nameKey: 'amritKalamName', descKey: 'amritKalamDesc',
          time: fmtWindow(w), nature: 'auspicious',
        });
      });
    } else if (panchang.amritKalam) {
      rows.push({
        nameKey: 'amritKalamName', descKey: 'amritKalamDescShort',
        time: fmtWindow(panchang.amritKalam), nature: 'auspicious',
      });
    }

    // Inauspicious timings
    rows.push({
      nameKey: 'rahuKaalName', descKey: 'rahuKaalDesc',
      time: fmtWindow(panchang.rahuKaal), nature: 'inauspicious',
    });
    rows.push({
      nameKey: 'yamagandaName', descKey: 'yamagandaDesc',
      time: fmtWindow(panchang.yamaganda), nature: 'inauspicious',
    });
    rows.push({
      nameKey: 'gulikaKaalName', descKey: 'gulikaKaalDesc',
      time: fmtWindow(panchang.gulikaKaal), nature: 'inauspicious',
    });

    if (panchang.varjyamAll && panchang.varjyamAll.length > 0) {
      panchang.varjyamAll.forEach((w: TimeWindow) => {
        rows.push({
          nameKey: 'varjyamName', descKey: 'varjyamDesc',
          time: fmtWindow(w), nature: 'inauspicious',
        });
      });
    } else if (panchang.varjyam) {
      rows.push({
        nameKey: 'varjyamName', descKey: 'varjyamDesc',
        time: fmtWindow(panchang.varjyam), nature: 'inauspicious',
      });
    }

    if (panchang.durMuhurtam && panchang.durMuhurtam.length > 0) {
      panchang.durMuhurtam.forEach((w: TimeWindow) => {
        rows.push({
          nameKey: 'durMuhurtamName', descKey: 'durMuhurtamDesc',
          time: fmtWindow(w), nature: 'inauspicious',
        });
      });
    }
  } catch (err) {
    console.error('[auspicious] SSR panchang computation failed:', err);
  }

  const weekdayName = auspiciousWeekday(weekday, locale);
  const auspiciousRows = rows.filter(r => r.nature === 'auspicious');
  const inauspiciousRows = rows.filter(r => r.nature === 'inauspicious');

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content — visible to Google, renders without JS ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {formatAuspiciousLabel('h1Template', locale, {
            CITY: cityName,
            WEEKDAY: weekdayName,
            DATE: dateStr,
          })}
        </h1>

        <p className="text-text-primary text-lg mt-4" suppressHydrationWarning>
          {formatAuspiciousLabel('introTemplate', locale, {
            CITY: cityName,
            WEEKDAY: weekdayName,
          })}
        </p>

        {/* ═══ Auspicious Timings Table ═══ */}
        {auspiciousRows.length > 0 && (
          <>
            <h2 className="text-gold-light text-xl font-semibold mt-8 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {formatAuspiciousLabel('auspiciousSectionTemplate', locale, { CITY: cityName })}
            </h2>
            <div className="rounded-xl border border-emerald-500/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-500/[0.06] border-b border-emerald-500/12">
                    <th className="text-left py-2.5 px-4 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      {AL('colMuhurta', locale)}
                    </th>
                    <th className="text-left py-2.5 px-4 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                      {AL('colTime', locale)}
                    </th>
                    <th className="text-left py-2.5 px-4 text-emerald-400 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                      {AL('colDescription', locale)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auspiciousRows.map((row, i) => (
                    <tr key={`a-${i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-2 px-4 text-text-primary font-medium">{AL(row.nameKey, locale)}</td>
                      <td className="py-2 px-4 text-emerald-400 font-mono font-semibold">{row.time}</td>
                      <td className="py-2 px-4 text-text-secondary text-xs hidden sm:table-cell">{AL(row.descKey, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═══ Inauspicious Timings Table ═══ */}
        {inauspiciousRows.length > 0 && (
          <>
            <h2 className="text-red-400 text-xl font-semibold mt-8 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {formatAuspiciousLabel('inauspiciousSectionTemplate', locale, { CITY: cityName })}
            </h2>
            <div className="rounded-xl border border-red-500/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-500/[0.06] border-b border-red-500/12">
                    <th className="text-left py-2.5 px-4 text-red-400 text-xs font-semibold uppercase tracking-wider">
                      {AL('colPeriod', locale)}
                    </th>
                    <th className="text-left py-2.5 px-4 text-red-400 text-xs font-semibold uppercase tracking-wider">
                      {AL('colTime', locale)}
                    </th>
                    <th className="text-left py-2.5 px-4 text-red-400 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                      {AL('colDescription', locale)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inauspiciousRows.map((row, i) => (
                    <tr key={`i-${i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="py-2 px-4 text-text-primary font-medium">{AL(row.nameKey, locale)}</td>
                      <td className="py-2 px-4 text-red-400 font-mono font-semibold">{row.time}</td>
                      <td className="py-2 px-4 text-text-secondary text-xs hidden sm:table-cell">{AL(row.descKey, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Explanatory content for SEO */}
        <div className="mt-8 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {AL('whatAreHeading', locale)}
          </h2>
          <p>{AL('whatArePara', locale)}</p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {AL('abhijitHeading', locale)}
          </h2>
          <p>{AL('abhijitPara', locale)}</p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {AL('rahuYamaGulikaHeading', locale)}
          </h2>
          <p>{AL('rahuYamaGulikaPara', locale)}</p>

          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {AL('varjyamAmritHeading', locale)}
          </h2>
          <p>{AL('varjyamAmritPara', locale)}</p>
        </div>

        {/* Internal links for SEO */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          <Link href="/panchang" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {AL('linkTodaysPanchang', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/rahu-kaal" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {AL('linkRahuKaal', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/choghadiya" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {AL('linkChoghadiya', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/hora" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {AL('linkHoraChart', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/muhurta-ai" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {AL('linkMuhurtaAi', locale)}
          </Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/calendar" className="text-gold-primary/70 hover:text-gold-light transition-colors">
            {AL('linkFestivalCalendar', locale)}
          </Link>
        </nav>
      </div>

      {/* ═══ Client Island: interactive date/location selector, full card grid ═══ */}
      <AuspiciousClient />
    </main>
  );
}

/**
 * Embeddable current-transits widget — snapshot of all 9 graha
 * positions (sidereal sign + degree + retrograde) for a date.
 *
 * Pattern-matched to `/embed/panchang`. Astrology bloggers and forum
 * posters quote "current planetary positions" constantly; one
 * iframe makes Dekho the cited source instead of a screenshot.
 *
 * Embed URL contract:
 *   /embed/transits                          (defaults to today, UTC)
 *   /embed/transits?date=2026-06-15
 *   /embed/transits?...&theme=light|dark|auto
 *   /embed/transits?...&size=narrow|default|wide
 *   /embed/transits?...&locale=en|hi|ta|te|bn|gu|kn|mr|mai
 *   /embed/transits?...&ref=astroweekly
 *
 * No location param — transits are geocentric and the same worldwide
 * at a given instant. Day-resolution snapshot uses noon UT of the
 * given date.
 */

import type { Metadata } from 'next';
import { dateToJD, getPlanetaryPositions, toSidereal } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import AttributionFooter from '../_components/AttributionFooter';
import { buildWidgetCss } from '../_lib/build-widget-css';
import {
  parseEmbedTheme,
  parseEmbedSize,
  parseEmbedLocale,
  parseEmbedRef,
  type VisibleLocale,
} from '../_lib/params';
import type { EmbedTheme, EmbedSize } from '../_lib/embed-theme';

export const revalidate = 86400;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface SearchParams {
  date?: string;
  theme?: string;
  size?: string;
  locale?: string;
  ref?: string;
}

const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export default async function EmbedTransitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size: EmbedSize = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const css = buildWidgetCss({ theme, size });

  // Date: caller-supplied or "today" in UTC. Transits are geocentric,
  // so a single global "today" is the right default.
  let year: number, month: number, day: number;
  if (params.date && DATE_RE.test(params.date)) {
    [year, month, day] = params.date.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getUTCFullYear(); month = now.getUTCMonth() + 1; day = now.getUTCDate();
  }

  // Snapshot at noon UT — matches the "transits-today" convention used
  // across the project; close enough for the slow planets we care about,
  // and stable across a day for the cache key. `dateToJD` takes
  // (year, month, day, fractional-hour); pass 12 for noon UT.
  const jd = dateToJD(year, month, day, 12);
  const positions = getPlanetaryPositions(jd);

  // Sidereal conversion + sign + degree-in-sign + retrograde flag.
  const rows = positions.map(p => {
    const sidLng = toSidereal(p.longitude, jd);
    const signIdx = Math.floor(sidLng / 30); // 0..11
    const degInSign = sidLng - signIdx * 30;
    return {
      id: p.id,
      signId: signIdx + 1, // 1-12
      degStr: `${Math.floor(degInSign)}° ${String(Math.floor((degInSign % 1) * 60)).padStart(2, '0')}'`,
      retrograde: p.isRetrograde,
    };
  });

  const dateStr = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  );

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>Current transits — {dateStr}</title>
        <style dangerouslySetInnerHTML={{ __html: css + EMBED_TRANSIT_CSS }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">Current transits</div>
            <div className="widget-date">{dateStr} · noon UT</div>
          </div>
          <div className="transit-list">
            {rows.map(r => {
              const planet = GRAHAS[r.id];
              const rashi = RASHIS[r.signId - 1];
              if (!planet || !rashi) return null;
              return (
                <div key={r.id} className="transit-row">
                  <span className="transit-glyph" aria-hidden="true">{planet.symbol}</span>
                  <span className="transit-planet">{tl(planet.name, locale)}</span>
                  <span className="transit-sign">{tl(rashi.name, locale)}</span>
                  <span className="transit-deg">{r.degStr}</span>
                  {r.retrograde && <span className="transit-retro" title="Retrograde">℞</span>}
                </div>
              );
            })}
          </div>
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

const EMBED_TRANSIT_CSS = `
.transit-list { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; }
.transit-row { display: grid; grid-template-columns: 24px max-content 1fr auto auto; align-items: baseline;
  gap: 8px; padding: 6px 10px; border-bottom: 1px solid var(--w-border); font-size: 13px; }
.transit-row:last-child { border-bottom: none; }
.transit-glyph { font-size: 16px; color: var(--w-accent); }
.transit-planet { font-weight: 600; color: var(--w-text); }
.transit-sign { color: var(--w-text-muted); }
.transit-deg { color: var(--w-text); font-variant-numeric: tabular-nums; font-size: 12px; }
.transit-retro { color: #c0392b; font-size: 12px; font-weight: 600; }
`;

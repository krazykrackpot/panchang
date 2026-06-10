/**
 * Embeddable kundali (Vedic birth chart) widget.
 *
 * Pattern-matched to `/embed/panchang` (see that file's header for the
 * full embed-route conventions): full <html> document, ISR-cached,
 * AttributionFooter at the bottom, Lesson ZD safe (no client clock
 * reads at render time).
 *
 * The highest-backlink-potential surface of the embed catalogue —
 * astrology bloggers and YouTubers routinely show "look at X's birth
 * chart" and currently screenshot from other tools because no
 * embeddable chart exists. This iframe gives them a one-liner.
 *
 * Embed URL contract — all params are required unless marked optional:
 *   /embed/kundali?date=1879-03-14&time=11:30&lat=48.40&lng=9.99
 *   /embed/kundali?...&name=Einstein               (optional)
 *   /embed/kundali?...&tz=Europe/Berlin            (optional — derived from lat/lng if absent)
 *   /embed/kundali?...&style=north|south           (default: north)
 *   /embed/kundali?...&theme=light|dark|auto       (default: light)
 *   /embed/kundali?...&size=narrow|default|wide    (default: default)
 *   /embed/kundali?...&locale=en|hi|ta|te|bn|gu|kn|mr|mai
 *   /embed/kundali?...&ref=astrosphere             (attribution id)
 *
 * Compute happens server-side once per (URL → 24h) and is shared
 * across all visitors of the same iframe via Next's full route cache.
 */

import type { Metadata } from 'next';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { validateBirthData } from '@/lib/kundali/validate-birth-data';
import { resolveBirthTimezone, isValidTimezone } from '@/lib/utils/timezone';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { NORTH_DIAMOND_HOUSE_PATHS, NORTH_DIAMOND_VIEWBOX } from '@/lib/constants/chart-geometry';
import { tl } from '@/lib/utils/trilingual';
import type { BirthData } from '@/types/kundali';
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
  time?: string;
  lat?: string;
  lng?: string;
  name?: string;
  tz?: string;
  style?: string;
  theme?: string;
  size?: string;
  locale?: string;
  ref?: string;
}

// Centroids for the 12 North-Indian-diamond houses, scaled to the
// shared 500×500 viewBox. Used to place rashi-id + planet glyphs
// inside each house. Computed once by averaging path vertices —
// inlined here to avoid an SVG parse at runtime.
const NORTH_HOUSE_CENTROIDS: Record<number, { cx: number; cy: number }> = {
  1:  { cx: 250, cy: 140 },
  2:  { cx: 140, cy: 70  },
  3:  { cx: 70,  cy: 140 },
  4:  { cx: 140, cy: 250 },
  5:  { cx: 70,  cy: 360 },
  6:  { cx: 140, cy: 430 },
  7:  { cx: 250, cy: 360 },
  8:  { cx: 360, cy: 430 },
  9:  { cx: 430, cy: 360 },
  10: { cx: 360, cy: 250 },
  11: { cx: 430, cy: 140 },
  12: { cx: 360, cy: 70  },
};

// South-Indian chart: fixed 4×4 grid; rashi → cell is a fixed
// convention (Pisces top-left, Aries next, … clockwise around the
// perimeter). The two interior cells stay blank — only perimeter cells
// hold rashis. Lagna is marked in whichever rashi cell it falls into,
// and planets sit in the cell of their occupied rashi.
const SOUTH_CELL_GRID = 4;
const SOUTH_CELL_PX = 110;
// rashiId (1-12, Aries=1) → { row, col } on the 4×4 perimeter.
const SOUTH_RASHI_POSITION: Record<number, { row: number; col: number }> = {
  12: { row: 0, col: 0 }, // Pisces
  1:  { row: 0, col: 1 }, // Aries
  2:  { row: 0, col: 2 }, // Taurus
  3:  { row: 0, col: 3 }, // Gemini
  4:  { row: 1, col: 3 }, // Cancer
  5:  { row: 2, col: 3 }, // Leo
  6:  { row: 3, col: 3 }, // Virgo
  7:  { row: 3, col: 2 }, // Libra
  8:  { row: 3, col: 1 }, // Scorpio
  9:  { row: 3, col: 0 }, // Sagittarius
  10: { row: 2, col: 0 }, // Capricorn
  11: { row: 1, col: 0 }, // Aquarius
};

type ChartStyle = 'north' | 'south';
function parseChartStyle(raw: string | undefined): ChartStyle {
  return raw === 'south' ? 'south' : 'north';
}

export default async function EmbedKundaliPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size: EmbedSize = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const style: ChartStyle = parseChartStyle(params.style);
  const css = buildWidgetCss({ theme, size });

  // Validate lat/lng first because we need them to resolve a timezone.
  const lat = params.lat ? parseFloat(params.lat) : NaN;
  const lng = params.lng ? parseFloat(params.lng) : NaN;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return (
      <ErrorPage theme={theme} locale={locale} ref={ref} css={css}
        message="Missing or invalid coordinates. Use ?lat=…&lng=… (lat -90..90, lng -180..180)." />
    );
  }

  // Timezone: caller-provided wins (after validation); otherwise derived
  // from coordinates per CLAUDE.md "Timezone from coordinates only".
  let timezone: string;
  if (params.tz && isValidTimezone(params.tz)) {
    timezone = params.tz;
  } else {
    try {
      timezone = await resolveBirthTimezone(lat, lng);
    } catch (err) {
      console.error('[embed/kundali] timezone resolution failed:', err);
      timezone = 'UTC';
    }
  }

  const birthData: BirthData = {
    name: params.name?.slice(0, 64) || 'Birth Chart',
    date: params.date || '',
    time: params.time || '',
    place: params.name?.slice(0, 64) || `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
    lat,
    lng,
    timezone,
    ayanamsha: 'lahiri',
  };

  // Single source-of-truth validation — same helper /api/kundali uses.
  const check = validateBirthData(birthData);
  if (!check.ok) {
    return <ErrorPage theme={theme} locale={locale} ref={ref} css={css} message={check.error} />;
  }

  let kundali;
  try {
    kundali = generateKundali(birthData);
  } catch (err) {
    console.error('[embed/kundali] generateKundali threw:', err);
    return (
      <ErrorPage theme={theme} locale={locale} ref={ref} css={css}
        message="Chart computation failed. Check that date/time/coordinates are correct." />
    );
  }

  const chart = kundali.chart;
  const lagnaSign = chart.ascendantSign; // 1-12

  // Locale-aware "Born on …" line, Latin numerals to render across all 9 locales.
  const [y, m, d] = birthData.date.split('-').map(Number);
  const dateStr = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
    locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  );

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>Kundali — {birthData.name}</title>
        <style dangerouslySetInnerHTML={{ __html: css + EMBED_KUNDALI_CSS }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{birthData.name}</div>
            <div className="widget-date">{dateStr} · {birthData.time}</div>
          </div>

          {style === 'north'
            ? <NorthDiamond chart={chart} locale={locale} />
            : <SouthGrid    chart={chart} locale={locale} />}

          <div className="kundali-meta">
            <span className="meta-label">Lagna</span>
            <span className="meta-value">{tl(RASHIS[lagnaSign - 1].name, locale)}</span>
          </div>

          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

// ─── North Indian diamond chart (server-rendered SVG) ───────────────────

function NorthDiamond({ chart, locale }: { chart: { houses: number[][]; ascendantSign: number }; locale: VisibleLocale }) {
  const vb = NORTH_DIAMOND_VIEWBOX;
  const lagnaSign = chart.ascendantSign;
  return (
    <svg viewBox={`0 0 ${vb} ${vb}`} role="img" aria-label="Birth chart (North Indian style)" className="kundali-svg">
      {/* House outlines */}
      {Object.entries(NORTH_DIAMOND_HOUSE_PATHS).map(([h, dPath]) => (
        <path key={h} d={dPath as string} className="house-outline" />
      ))}
      {/* Per-house contents */}
      {Object.entries(NORTH_HOUSE_CENTROIDS).map(([h, { cx, cy }]) => {
        const houseNum = Number(h);
        const rashiId = ((lagnaSign - 1 + houseNum - 1) % 12) + 1;
        const planetsInHouse = chart.houses[houseNum - 1] || [];
        return (
          <g key={h}>
            <text x={cx} y={cy - 14} textAnchor="middle" className="rashi-num">
              {rashiId}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="planet-glyphs">
              {planetsInHouse.map(pid => GRAHAS[pid]?.symbol || '').join(' ')}
            </text>
          </g>
        );
      })}
      {/* Lagna marker — first house gets a small "Lg" label. */}
      <text x={NORTH_HOUSE_CENTROIDS[1].cx} y={28} textAnchor="middle" className="lagna-marker">
        Lg
      </text>
      <title>{`Lagna in ${tl(RASHIS[lagnaSign - 1].name, locale)}`}</title>
    </svg>
  );
}

// ─── South Indian fixed-grid chart (server-rendered SVG) ────────────────

function SouthGrid({ chart, locale }: { chart: { houses: number[][]; ascendantSign: number }; locale: VisibleLocale }) {
  const lagnaSign = chart.ascendantSign;
  const side = SOUTH_CELL_GRID * SOUTH_CELL_PX;
  // Build rashiId → planetIds. chart.houses is indexed by HOUSE (1=Lagna),
  // not by rashi. Re-key by rashi so the South cell can read it directly.
  const planetsByRashi: number[][] = Array.from({ length: 12 }, () => []);
  for (let house = 1; house <= 12; house++) {
    const rashiId = ((lagnaSign - 1 + house - 1) % 12) + 1;
    planetsByRashi[rashiId - 1] = chart.houses[house - 1] || [];
  }
  return (
    <svg viewBox={`0 0 ${side} ${side}`} role="img" aria-label="Birth chart (South Indian style)" className="kundali-svg">
      {/* 4×4 grid frame */}
      {Array.from({ length: SOUTH_CELL_GRID + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * SOUTH_CELL_PX} x2={side} y2={i * SOUTH_CELL_PX} className="house-outline" />
      ))}
      {Array.from({ length: SOUTH_CELL_GRID + 1 }, (_, i) => (
        <line key={`v${i}`} y1={0} x1={i * SOUTH_CELL_PX} y2={side} x2={i * SOUTH_CELL_PX} className="house-outline" />
      ))}
      {/* Rashi cells */}
      {(Object.entries(SOUTH_RASHI_POSITION) as [string, { row: number; col: number }][]).map(([r, { row, col }]) => {
        const rashiId = Number(r);
        const x = col * SOUTH_CELL_PX;
        const y = row * SOUTH_CELL_PX;
        const cx = x + SOUTH_CELL_PX / 2;
        const isLagna = rashiId === lagnaSign;
        return (
          <g key={r}>
            {isLagna && (
              <rect x={x + 2} y={y + 2} width={SOUTH_CELL_PX - 4} height={SOUTH_CELL_PX - 4}
                    className="south-lagna-cell" />
            )}
            <text x={x + 6} y={y + 16} className="rashi-num">{rashiId}</text>
            <text x={cx} y={y + SOUTH_CELL_PX / 2 + 4} textAnchor="middle" className="planet-glyphs">
              {planetsByRashi[rashiId - 1].map(pid => GRAHAS[pid]?.symbol || '').join(' ')}
            </text>
          </g>
        );
      })}
      <title>{`Lagna in ${tl(RASHIS[lagnaSign - 1].name, locale)}`}</title>
    </svg>
  );
}

// ─── Error page (re-used pattern from /embed/panchang) ──────────────────

interface ErrorPageProps {
  theme: EmbedTheme;
  locale: VisibleLocale;
  ref?: string;
  css: string;
  message: string;
}

function ErrorPage({ theme, locale, ref, css, message }: ErrorPageProps) {
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>Kundali — Configuration error</title>
        <style dangerouslySetInnerHTML={{ __html: css + EMBED_KUNDALI_CSS }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">Kundali</div>
          </div>
          <div className="widget-error">{message}</div>
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

// ─── Chart-specific CSS (appended to the shared widget CSS) ─────────────

const EMBED_KUNDALI_CSS = `
.kundali-svg { width: 100%; max-width: 380px; height: auto; display: block; margin: 12px auto; }
.house-outline { fill: none; stroke: var(--w-border); stroke-width: 1.5; }
.rashi-num { fill: var(--w-text-muted); font-size: 14px; font-weight: 600; }
.planet-glyphs { fill: var(--w-accent); font-size: 18px; letter-spacing: 1px; }
.lagna-marker { fill: var(--w-accent-soft); font-size: 12px; font-weight: 700; }
.south-lagna-cell { fill: var(--w-accent-soft); fill-opacity: 0.15; stroke: var(--w-accent); stroke-width: 1.5; }
.kundali-meta { display: flex; justify-content: center; gap: 8px; padding: 6px 0; font-size: 12px; }
.kundali-meta .meta-label { color: var(--w-text-muted); }
.kundali-meta .meta-value { color: var(--w-accent); font-weight: 600; }
`;

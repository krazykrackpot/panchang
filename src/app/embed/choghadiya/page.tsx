/**
 * Embeddable choghadiya widget — day's 8 day + 8 night choghadiya slots.
 *
 * Pattern-matched to `/embed/panchang`. Useful for muhurta-focused
 * blogs and temple sites that quote auspicious / inauspicious time
 * windows for specific dates.
 *
 * Embed URL contract:
 *   /embed/choghadiya?city=varanasi
 *   /embed/choghadiya?lat=25.31&lng=82.97&name=Varanasi
 *   /embed/choghadiya?...&date=2026-06-15   (defaults to today in the location's tz)
 *   /embed/choghadiya?...&theme=light|dark|auto
 *   /embed/choghadiya?...&size=narrow|default|wide
 *   /embed/choghadiya?...&locale=en|hi|ta|te|bn|gu|kn|mr|mai
 *   /embed/choghadiya?...&ref=mybiz
 */

import type { Metadata } from 'next';
import { computePanchang, computeChoghadiya } from '@/lib/ephem/panchang-calc';
import { getCityBySlug, type CityData } from '@/lib/constants/cities';
import { getUTCOffsetForDate, resolveBirthTimezone } from '@/lib/utils/timezone';
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
  city?: string;
  lat?: string;
  lng?: string;
  name?: string;
  date?: string;
  theme?: string;
  size?: string;
  locale?: string;
  ref?: string;
}

const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export default async function EmbedChoghadiyaPage({
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

  // Resolve location (same contract as /embed/panchang).
  let cityData: CityData | undefined;
  let lat: number, lng: number, locationName: string, timezone: string;
  if (params.city) {
    cityData = getCityBySlug(params.city);
    if (!cityData) {
      return <ErrorPage theme={theme} locale={locale} ref={ref} css={css}
        message={`City "${params.city}" not found. Use ?city=varanasi or ?lat=…&lng=…&name=…`} />;
    }
    lat = cityData.lat; lng = cityData.lng;
    // Localise the city name. cityData.name is a LocaleText with all 9
    // visible-locale entries; falling back to `.en` produced "Varanasi"
    // in every script. Gemini #651 MED.
    locationName = tl(cityData.name, locale);
    timezone = cityData.timezone;
  } else if (params.lat && params.lng) {
    lat = parseFloat(params.lat); lng = parseFloat(params.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return <ErrorPage theme={theme} locale={locale} ref={ref} css={css}
        message="Invalid lat/lng. Latitude: -90 to 90, Longitude: -180 to 180." />;
    }
    locationName = params.name?.slice(0, 64) || `${lat.toFixed(2)}N, ${lng.toFixed(2)}E`;
    // Resolve the timezone from coordinates instead of hard-coding
    // Asia/Kolkata. Choghadiya slots are anchored to local sunrise +
    // sunset; using the wrong tz shifts every slot by hours and makes
    // the widget unusable for any non-Indian location. Gemini #651 HIGH.
    try {
      timezone = await resolveBirthTimezone(lat, lng);
    } catch (err) {
      console.error('[embed/choghadiya] timezone resolution failed:', err);
      // Fall through to UTC as the least-wrong default. The widget will
      // still render; sunrise/sunset will be UTC clock values, which is
      // visibly wrong but doesn't crash.
      timezone = 'UTC';
    }
  } else {
    return <ErrorPage theme={theme} locale={locale} ref={ref} css={css}
      message="Missing location. Use ?city=varanasi or ?lat=25.31&lng=82.97&name=Varanasi" />;
  }

  // Resolve date — caller-supplied YYYY-MM-DD, or today in the location's tz.
  let year: number, month: number, day: number;
  if (params.date && DATE_RE.test(params.date)) {
    [year, month, day] = params.date.split('-').map(Number);
  } else {
    const now = new Date();
    const tzOffset = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), timezone);
    const local = new Date(now.getTime() + tzOffset * 3600 * 1000);
    year = local.getUTCFullYear(); month = local.getUTCMonth() + 1; day = local.getUTCDate();
  }

  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);

  // Reuse computePanchang to get the day's sunrise/sunset (it does the
  // heavy lifting), then call computeChoghadiya with the UT times.
  const panchang = computePanchang({ year, month, day, lat, lng, tzOffset, timezone, locationName });

  // computeChoghadiya wants UT instants in fractional hours; the panchang
  // output gives local "HH:MM" strings. Convert via the panchang's
  // raw fields if present, otherwise reparse — defensive cast since
  // older shapes of PanchangData didn't expose the UT fields.
  const raw = panchang as unknown as Record<string, number>;
  const sunriseUT = typeof raw.sunriseUT === 'number' ? raw.sunriseUT
    : hhmmToHours(panchang.sunrise) - tzOffset;
  const sunsetUT  = typeof raw.sunsetUT  === 'number' ? raw.sunsetUT
    : hhmmToHours(panchang.sunset)  - tzOffset;

  // weekday: 0=Sun, 1=Mon, … 6=Sat. Matches Date.getUTCDay() and the
  // formula `Math.floor(jd + 1.5) % 7` per Lesson O.
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const slots = computeChoghadiya(sunriseUT, sunsetUT, weekday, tzOffset);

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
        <title>Choghadiya — {locationName}</title>
        <style dangerouslySetInnerHTML={{ __html: css + EMBED_CHOG_CSS }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{locationName}</div>
            <div className="widget-date">{dateStr}</div>
          </div>
          <div className="chog-list">
            {slots.map((s, i) => (
              <div key={i} className={`chog-row chog-${s.nature}`}>
                <span className="chog-name">{tl(s.name, locale)}</span>
                <span className="chog-time">{s.startTime}–{s.endTime}</span>
                <span className="chog-period">{s.period === 'day' ? '☀' : '☾'}</span>
              </div>
            ))}
          </div>
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

function hhmmToHours(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h + (m || 0) / 60;
}

function ErrorPage({ theme, locale, ref, css, message }: {
  theme: EmbedTheme; locale: VisibleLocale; ref?: string; css: string; message: string;
}) {
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>Choghadiya — Configuration error</title>
        <style dangerouslySetInnerHTML={{ __html: css + EMBED_CHOG_CSS }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header"><div className="widget-location">Choghadiya</div></div>
          <div className="widget-error">{message}</div>
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

const EMBED_CHOG_CSS = `
.chog-list { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; }
.chog-row { display: grid; grid-template-columns: 1fr auto auto; align-items: baseline; gap: 8px;
  padding: 6px 10px; border-radius: 6px; font-size: 13px; }
.chog-name { font-weight: 600; color: var(--w-text); }
.chog-time { color: var(--w-text-muted); font-variant-numeric: tabular-nums; font-size: 12px; }
.chog-period { font-size: 14px; color: var(--w-text-muted); }
.chog-auspicious  { background: rgba(212,168,83,0.08); border-left: 3px solid var(--w-accent); }
.chog-inauspicious{ background: rgba(231,76,60,0.06); border-left: 3px solid #c0392b; }
.chog-neutral     { background: transparent;          border-left: 3px solid var(--w-border); }
`;

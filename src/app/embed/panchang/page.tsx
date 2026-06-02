/**
 * Embeddable panchang widget — drop-on-any-site iframe surface.
 *
 * Why this exists (recovery-plan workstream 1 of the 2026-06-01 backlink
 * strategy): each embed deployed on a temple or community site becomes a
 * permanent backlink + brand impression. The widget is fully server-
 * rendered (Lesson ZD compliant — no clock-reading client mounts),
 * carries no analytics or auth, and emits its own complete HTML document
 * because the root layout (src/app/layout.tsx) is a passthrough.
 *
 * Embed URL contract — every param is optional unless noted:
 *   /embed/panchang?city=varanasi             (location: REQUIRED; one of city / lat+lng)
 *   /embed/panchang?lat=25.31&lng=82.97&name=Varanasi
 *   /embed/panchang?...&theme=light|dark|auto
 *   /embed/panchang?...&size=narrow|default|wide
 *   /embed/panchang?...&locale=en|hi|mr|mai|ta|te|bn|gu|kn
 *   /embed/panchang?...&ref=iskcondelhi       (attribution ID — appears in utm_campaign)
 *
 * Frame headers (in next.config.ts) set X-Frame-Options: ALLOWALL +
 * frame-ancestors *, so any site can embed it.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getCityBySlug, type CityData } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import AttributionFooter from '../_components/AttributionFooter';
import { buildWidgetCss } from '../_lib/build-widget-css';
import { getEmbedLabels } from '../_lib/embed-labels';
import {
  parseEmbedTheme,
  parseEmbedSize,
  parseEmbedLocale,
  parseEmbedRef,
  type VisibleLocale,
} from '../_lib/params';
import type { EmbedTheme, EmbedSize } from '../_lib/embed-theme';

export const revalidate = 86400; // Daily — panchang changes once per day

export const metadata: Metadata = {
  title: 'Panchang Widget — Dekho Panchang',
  robots: { index: false, follow: false },
};

interface SearchParams {
  city?: string;
  lat?: string;
  lng?: string;
  name?: string;
  theme?: string;
  size?: string;
  locale?: string;
  ref?: string;
}

export default async function EmbedPanchangPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size: EmbedSize = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const labels = getEmbedLabels(locale);
  const css = buildWidgetCss({ theme, size });

  // `tl()` reads en/hi/sa from Trilingual data. For non-English locales
  // that aren't hi/sa, fall back to English content here so we don't
  // silently emit Hindi text for Marathi users (the 2026-05-31 bug).
  const dataLocale = locale === 'hi' ? 'hi' : 'en';

  let cityData: CityData | undefined;
  let lat: number;
  let lng: number;
  let locationName: string;
  let timezone: string;

  if (params.city) {
    cityData = getCityBySlug(params.city);
    if (!cityData) {
      return (
        <WidgetError
          theme={theme}
          locale={locale}
          ref={ref}
          css={css}
          message={`City "${params.city}" not found. Use ?city=varanasi or ?lat=...&lng=...&name=...`}
        />
      );
    }
    lat = cityData.lat;
    lng = cityData.lng;
    locationName = cityData.name.en;
    timezone = cityData.timezone;
  } else if (params.lat && params.lng) {
    lat = parseFloat(params.lat);
    lng = parseFloat(params.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return (
        <WidgetError
          theme={theme}
          locale={locale}
          ref={ref}
          css={css}
          message="Invalid lat/lng. Latitude: -90 to 90, Longitude: -180 to 180."
        />
      );
    }
    locationName = params.name || `${lat.toFixed(2)}N, ${lng.toFixed(2)}E`;
    // Approximate timezone — users should prefer city slugs for accuracy.
    timezone = 'Asia/Kolkata';
  } else {
    return (
      <WidgetError
        theme={theme}
        locale={locale}
        ref={ref}
        css={css}
        message="Missing location. Use ?city=varanasi or ?lat=25.31&lng=82.97&name=Varanasi"
      />
    );
  }

  // Resolve "today" in the location's timezone (panchang is local).
  const now = new Date();
  const tzOffset = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), timezone);
  const localMs = now.getTime() + tzOffset * 3600 * 1000;
  const localDate = new Date(localMs);
  const year = localDate.getUTCFullYear();
  const month = localDate.getUTCMonth() + 1;
  const day = localDate.getUTCDate();

  const panchang = computePanchang({
    year,
    month,
    day,
    lat,
    lng,
    tzOffset,
    timezone,
    locationName,
  });

  // Today's festivals — best-effort, swallow engine errors so the widget
  // still renders core panchang data even if festival lookup throws.
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  let festivals: FestivalEntry[] = [];
  try {
    const allFestivals = generateFestivalCalendarV2(year, lat, lng, timezone);
    festivals = allFestivals.filter((f) => f.date === todayStr);
    clearTithiTableCache();
  } catch (err) {
    console.error('[embed/panchang] festival lookup failed:', err);
  }

  // Locale-aware date string with Latin numerals.
  const dateStr = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    },
  );

  const tithiEnd = panchang.tithiTransition?.endTime;
  const nakEnd = panchang.nakshatraTransition?.endTime;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>Panchang — {locationName}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{locationName}</div>
            <div className="widget-date">{dateStr}</div>
          </div>

          {festivals.length > 0 && (
            <div className="widget-festivals">
              {festivals.map((f, i) => (
                <div key={i} className="festival-badge">
                  {tl(f.name, dataLocale)}
                </div>
              ))}
            </div>
          )}

          <div className="widget-grid">
            <WidgetRow
              label={labels.tithi}
              value={tl(panchang.tithi.name, dataLocale)}
              time={tithiEnd ? `${labels.until} ${tithiEnd}` : undefined}
            />
            <WidgetRow
              label={labels.nakshatra}
              value={tl(panchang.nakshatra.name, dataLocale)}
              time={nakEnd ? `${labels.until} ${nakEnd}` : undefined}
            />
            <WidgetRow label={labels.yoga} value={tl(panchang.yoga.name, dataLocale)} />
            <WidgetRow label={labels.karana} value={tl(panchang.karana.name, dataLocale)} />
            <WidgetRow label={labels.vara} value={tl(panchang.vara.name, dataLocale)} />
          </div>

          <div className="widget-sun">
            <div className="sun-item">
              <span className="sun-icon">&#9728;</span>
              <span className="sun-label">{labels.sunrise}</span>
              <span className="sun-time">{panchang.sunrise}</span>
            </div>
            <div className="sun-item">
              <span className="sun-icon">&#9790;</span>
              <span className="sun-label">{labels.sunset}</span>
              <span className="sun-time">{panchang.sunset}</span>
            </div>
          </div>

          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

function WidgetRow({ label, value, time }: { label: string; value: string; time?: string }) {
  return (
    <div className="grid-row">
      <span className="grid-label">{label}</span>
      <span className="grid-value">
        {value}
        {time && <span className="grid-time">{time}</span>}
      </span>
    </div>
  );
}

interface WidgetErrorProps {
  theme: EmbedTheme;
  locale: VisibleLocale;
  ref?: string;
  css: string;
  message: string;
}

function WidgetError({ theme, locale, ref, css, message }: WidgetErrorProps) {
  const labels = getEmbedLabels(locale);
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>Panchang — {labels.configError}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{labels.configError}</div>
          </div>
          <div className="widget-error">{message}</div>
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

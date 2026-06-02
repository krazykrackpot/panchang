/**
 * Embeddable festivals widget — upcoming Hindu festivals for any
 * location, in any of the 9 visible locales, light/dark/auto themed.
 *
 * Why this exists: festival pages are top-impression surfaces with very
 * low CTR (per §1.3 inventory, hartalika-teej-2026 gets 11k impressions
 * at 0.14% CTR). A free festival widget temple sites and diaspora
 * communities can embed sends users who already care to a deeper
 * surface, and each embed is a permanent backlink. Workstream 1 of
 * the backlink strategy.
 *
 * URL contract — every param is optional except location:
 *   /embed/festivals?city=varanasi             (location: REQUIRED)
 *   /embed/festivals?lat=25.31&lng=82.97&name=Varanasi
 *   /embed/festivals?...&theme=light|dark|auto
 *   /embed/festivals?...&size=narrow|default|wide
 *   /embed/festivals?...&locale=en|hi|mr|mai|ta|te|bn|gu|kn
 *   /embed/festivals?...&days=7                (1-30, default 7)
 *   /embed/festivals?...&ref=iskcondelhi       (attribution ID)
 */

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
  parseEmbedDays,
  type VisibleLocale,
} from '../_lib/params';
import type { EmbedTheme } from '../_lib/embed-theme';

export const revalidate = 86400; // Daily — festival list changes as time rolls

// The <title> is rendered dynamically inside the embed document below
// (`<title>{labels.upcomingFestivals} — {locationName}</title>`), so the
// static metadata export only carries the noindex directive — leaving
// a static title here too would duplicate it in the head. Gemini PR
// #360 MEDIUM.
export const metadata: Metadata = {
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
  days?: string;
}

export default async function EmbedFestivalsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const days = parseEmbedDays(params.days);
  const labels = getEmbedLabels(locale);
  const css = buildWidgetCss({ theme, size });

  // `tl()` only reads en/hi/sa. Fall back to English for any locale
  // outside that set so we don't silently emit Hindi text for non-Hindi
  // users (the 2026-05-31 bug pattern).
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

  // Resolve "today" in the location's timezone.
  const now = new Date();
  const tzOffset = getUTCOffsetForDate(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    timezone,
  );
  const localMs = now.getTime() + tzOffset * 3600 * 1000;
  const localDate = new Date(localMs);
  const year = localDate.getUTCFullYear();
  const month = localDate.getUTCMonth() + 1;
  const day = localDate.getUTCDate();
  const todayJD = Date.UTC(year, month - 1, day);

  // Filter window. The festival generator returns ISO date strings; we
  // window by parsing back to UTC ms and comparing against todayJD plus
  // the `days` horizon.
  const upcoming = collectUpcoming({ year, lat, lng, timezone, todayJD, days });

  const todayStr = new Date(todayJD).toLocaleDateString(
    locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  );

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>{labels.upcomingFestivals} — {locationName}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{labels.upcomingFestivals} · {locationName}</div>
            <div className="widget-date">{todayStr}</div>
          </div>

          <div className="widget-grid">
            {upcoming.length === 0 ? (
              <div className="fest-empty">{labels.noFestivals}</div>
            ) : (
              upcoming.map((f, i) => (
                <div className="fest-row" key={`${f.date}-${i}`}>
                  <span className="fest-date">{formatShortDate(f.date, locale)}</span>
                  <span className="fest-name">{tl(f.name, dataLocale)}</span>
                </div>
              ))
            )}
          </div>

          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

interface CollectArgs {
  year: number;
  lat: number;
  lng: number;
  timezone: string;
  todayJD: number;
  days: number;
}

/**
 * Build the upcoming-festival list. We may need to peek into next year
 * if the window straddles Jan 1 (a 30-day horizon on Dec 20 covers
 * up to Jan 19 of the next year). The generator caches per-year, so
 * we call it for both years and concatenate.
 */
function collectUpcoming(args: CollectArgs): FestivalEntry[] {
  const { year, lat, lng, timezone, todayJD, days } = args;
  const windowEndJD = todayJD + days * 86400_000;

  const out: FestivalEntry[] = [];
  try {
    out.push(...generateFestivalCalendarV2(year, lat, lng, timezone));
    if (new Date(windowEndJD).getUTCFullYear() !== year) {
      out.push(...generateFestivalCalendarV2(year + 1, lat, lng, timezone));
    }
  } catch (err) {
    console.error('[embed/festivals] festival lookup failed:', err);
    return [];
  } finally {
    // Always drain the per-year tithi table cache, even when the
    // generator threw — otherwise a failure path leaks the populated
    // cache into the next request. Gemini PR #360 MEDIUM.
    clearTithiTableCache();
  }

  return out
    .filter((f) => {
      const [y, m, d] = f.date.split('-').map(Number);
      if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;
      const t = Date.UTC(y, m - 1, d);
      return t >= todayJD && t <= windowEndJD;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

function formatShortDate(iso: string, locale: VisibleLocale): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
    locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
    { day: 'numeric', month: 'short', timeZone: 'UTC' },
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
        <title>Festivals — {labels.configError}</title>
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

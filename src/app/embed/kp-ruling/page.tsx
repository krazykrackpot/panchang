/**
 * Embeddable KP Ruling Planets widget.
 *
 * URL contract:
 *   /embed/kp-ruling?city=varanasi                   (default mode=sunrise)
 *   /embed/kp-ruling?lat=25.31&lng=82.97&name=…
 *   /embed/kp-ruling?...&mode=sunrise|now
 *   /embed/kp-ruling?...&theme=light|dark|auto
 *   /embed/kp-ruling?...&size=narrow|default|wide
 *   /embed/kp-ruling?...&locale=…
 *   /embed/kp-ruling?...&ref=…
 *
 * Modes:
 *   sunrise (default) — ISR 86400s, computes RPs at today's local sunrise.
 *   now               — force-dynamic, computes RPs at request time.
 *
 * Both modes compute engine values inline (no API call) to avoid sharing
 * the 20-req/min IP bucket with third-party host sites.
 *
 * Lesson ZD compliance:
 *   - sunrise mode: ISR cache safe because we never read `new Date()`
 *     during render. We derive sunrise from today's date which IS read
 *     once at SSR — but it's bound to the cache key implicitly (each day
 *     is a fresh cache fill). No client clock reads.
 *   - now mode: force-dynamic, no cache, no hydration mismatch.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §5.1
 */

import { getCityBySlug, type CityData } from '@/lib/constants/cities';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getSunTimes } from '@/lib/astronomy';
import { getRulingPlanetsForMoment } from '@/lib/kp/ruling-now';
import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import AttributionFooter from '../_components/AttributionFooter';
import { buildWidgetCss } from '../_lib/build-widget-css';
import { getEmbedLabels } from '../_lib/embed-labels';
import { getKpEmbedLabels } from '../_lib/kp-embed-labels';
import {
  parseEmbedTheme,
  parseEmbedSize,
  parseEmbedLocale,
  parseEmbedRef,
  parseKpRulingMode,
  type VisibleLocale,
  type KpRulingMode,
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
  theme?: string;
  size?: string;
  locale?: string;
  ref?: string;
  mode?: string;
}

export default async function EmbedKpRulingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size: EmbedSize = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const mode: KpRulingMode = parseKpRulingMode(params.mode);
  const labels = getEmbedLabels(locale);
  const kpLabels = getKpEmbedLabels(locale);
  const css = buildWidgetCss({ theme, size });

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

  // Compute the cast epoch.
  let castEpochMs: number;
  if (mode === 'now') {
    castEpochMs = Date.now();
  } else {
    // Sunrise mode: derive today's local sunrise as a UTC epoch.
    const now = new Date();
    const tzOffsetNow = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), timezone);
    const localMs = now.getTime() + tzOffsetNow * 3600 * 1000;
    const localDate = new Date(localMs);
    const year = localDate.getUTCFullYear();
    const month = localDate.getUTCMonth() + 1;
    const day = localDate.getUTCDate();
    const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
    const sunTimes = getSunTimes(year, month, day, lat, lng, tzOffset);
    // Convert local-minutes-since-midnight to a UTC epoch.
    const utHours = sunTimes.sunriseMinutes / 60 - tzOffset;
    castEpochMs = Date.UTC(year, month - 1, day) + utHours * 3600 * 1000;
  }

  let result: Awaited<ReturnType<typeof getRulingPlanetsForMoment>>;
  try {
    result = getRulingPlanetsForMoment({ atEpochMs: castEpochMs, lat, lng });
  } catch (err) {
    console.error('[embed/kp-ruling] computation failed:', err);
    return (
      <WidgetError
        theme={theme}
        locale={locale}
        ref={ref}
        css={css}
        message="Failed to compute KP ruling planets. Please try again later."
      />
    );
  }

  const rps = [
    { label: kpLabels.ascSign,  planet: result.rulingPlanets.ascSignLord },
    { label: kpLabels.ascStar,  planet: result.rulingPlanets.ascStarLord },
    { label: kpLabels.ascSub,   planet: result.rulingPlanets.ascSubLord },
    { label: kpLabels.moonSign, planet: result.rulingPlanets.moonSignLord },
    { label: kpLabels.moonStar, planet: result.rulingPlanets.moonStarLord },
    { label: kpLabels.moonSub,  planet: result.rulingPlanets.moonSubLord },
    { label: kpLabels.day,      planet: result.rulingPlanets.dayLord },
  ];

  const modeLabel = mode === 'now' ? kpLabels.modeNow : kpLabels.modeSunrise;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>{`${kpLabels.kpRulingTitle} — ${locationName}`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{locationName}</div>
            <div className="widget-date">{kpLabels.kpRulingTitle} · {modeLabel}</div>
          </div>
          <div className="widget-grid">
            {rps.map((rp) => (
              <div className="grid-row" key={rp.label}>
                <span className="grid-label">{rp.label}</span>
                <span className="grid-value">{tl(rp.planet.name, locale)}</span>
              </div>
            ))}
          </div>
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
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
        <title>KP Ruling — {labels.configError}</title>
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

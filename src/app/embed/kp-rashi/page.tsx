/**
 * Embeddable KP Rashi forecast strip — 12-rashi gateway tiles with a
 * one-line KP-derived insight per rashi for today.
 *
 * URL contract:
 *   /embed/kp-rashi                           (en, light, default)
 *   /embed/kp-rashi?city=varanasi&theme=dark
 *   /embed/kp-rashi?...&size=narrow|default|wide
 *   /embed/kp-rashi?...&locale=…
 *   /embed/kp-rashi?...&ref=…
 *
 * Computation: derives today's RPs at the location's sunrise (or fallback
 * to Asia/Kolkata if no location supplied). The per-rashi "insight" is
 * a templated string based on whether the rashi's natural ruler appears
 * in the day's RPs — a lean proxy because we don't have visitor natal
 * data on a public embed.
 *
 * Lesson ZD: ISR 86400s, no client clock reads. Same shape as kp-ruling
 * sunrise mode (one cache entry per day per (city, locale, theme, size)).
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §5.2
 */

import { RASHIS } from '@/lib/constants/rashis';
import { getCityBySlug } from '@/lib/constants/cities';
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
  type VisibleLocale,
} from '../_lib/params';
import type { EmbedTheme, EmbedSize } from '../_lib/embed-theme';

export const revalidate = 86400;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Sign lord per rashi (1-based — Aries=Mars, Taurus=Venus, …)
// Imported from canonical dignities table — audit P4 #12.
import { SIGN_LORDS as SIGN_LORD_IDS } from '@/lib/constants/dignities';

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

const INSIGHT_TEMPLATES: Record<VisibleLocale, { active: string; quiet: string }> = {
  en: { active: 'Your ruler is in today\'s ruling planets — act decisively.', quiet: 'Your ruler is quiet today — focus on inner work.' },
  hi: { active: 'आपका स्वामी आज के शासक ग्रहों में है — निर्णायक रूप से कार्य करें।', quiet: 'आपका स्वामी आज शान्त है — आन्तरिक कार्य पर ध्यान दें।' },
  mr: { active: 'तुमचा स्वामी आजच्या शासक ग्रहांत आहे — निर्णायक कृती करा.', quiet: 'तुमचा स्वामी आज शांत आहे — अंतर्मुख कामावर लक्ष द्या.' },
  mai: { active: 'अहांक स्वामी आजुक शासक ग्रहक मे अछि — निर्णायक रूप सँ कार्य करू।', quiet: 'अहांक स्वामी आजु शान्त अछि — आन्तरिक कार्य पर ध्यान दिअ।' },
  ta: { active: 'Your ruler is in today\'s ruling planets — act decisively.', quiet: 'Your ruler is quiet today — focus on inner work.' },
  te: { active: 'Your ruler is in today\'s ruling planets — act decisively.', quiet: 'Your ruler is quiet today — focus on inner work.' },
  bn: { active: 'Your ruler is in today\'s ruling planets — act decisively.', quiet: 'Your ruler is quiet today — focus on inner work.' },
  gu: { active: 'Your ruler is in today\'s ruling planets — act decisively.', quiet: 'Your ruler is quiet today — focus on inner work.' },
  kn: { active: 'Your ruler is in today\'s ruling planets — act decisively.', quiet: 'Your ruler is quiet today — focus on inner work.' },
};

export default async function EmbedKpRashiPage({
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
  const kpLabels = getKpEmbedLabels(locale);
  const css = buildWidgetCss({ theme, size });

  // Location: use Varanasi as the default daily-energy anchor when the
  // embedder doesn't pass one — temple sites often want "today's energy
  // from a sacred reference point."
  let lat = 25.31;
  let lng = 82.97;
  let locationName = 'Varanasi';
  let timezone = 'Asia/Kolkata';

  if (params.city) {
    const city = getCityBySlug(params.city);
    if (city) {
      lat = city.lat;
      lng = city.lng;
      locationName = city.name.en;
      timezone = city.timezone;
    }
  } else if (params.lat && params.lng) {
    const pLat = parseFloat(params.lat);
    const pLng = parseFloat(params.lng);
    if (
      !isNaN(pLat) && !isNaN(pLng) &&
      pLat >= -90 && pLat <= 90 && pLng >= -180 && pLng <= 180
    ) {
      lat = pLat;
      lng = pLng;
      locationName = params.name || `${pLat.toFixed(2)}N, ${pLng.toFixed(2)}E`;
    }
  }

  // Cast at today's sunrise for the chosen location.
  const now = new Date();
  const tzOffsetNow = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), timezone);
  const localMs = now.getTime() + tzOffsetNow * 3600 * 1000;
  const localDate = new Date(localMs);
  const year = localDate.getUTCFullYear();
  const month = localDate.getUTCMonth() + 1;
  const day = localDate.getUTCDate();
  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);
  const sunTimes = getSunTimes(year, month, day, lat, lng, tzOffset);
  const utHours = sunTimes.sunriseMinutes / 60 - tzOffset;
  const castEpochMs = Date.UTC(year, month - 1, day) + utHours * 3600 * 1000;

  let result;
  try {
    result = getRulingPlanetsForMoment({ atEpochMs: castEpochMs, lat, lng });
  } catch (err) {
    console.error('[embed/kp-rashi] computation failed:', err);
    return (
      <html lang={locale}>
        <head>
          <meta charSet="utf-8" />
          <title>KP Rashi — {labels.configError}</title>
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </head>
        <body>
          <div className="widget">
            <div className="widget-error">Failed to compute today&rsquo;s KP energies.</div>
            <AttributionFooter locale={locale} ref={ref} />
          </div>
        </body>
      </html>
    );
  }

  // Active planet IDs today
  const activeIds = new Set([
    result.rulingPlanets.ascSignLord.id,
    result.rulingPlanets.ascStarLord.id,
    result.rulingPlanets.ascSubLord.id,
    result.rulingPlanets.moonSignLord.id,
    result.rulingPlanets.moonStarLord.id,
    result.rulingPlanets.moonSubLord.id,
    result.rulingPlanets.dayLord.id,
  ]);

  const templates = INSIGHT_TEMPLATES[locale] ?? INSIGHT_TEMPLATES.en;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>{`${kpLabels.kpRashiTitle} — ${locationName}`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{locationName}</div>
            <div className="widget-date">{kpLabels.rashiForecast}</div>
          </div>
          <div className="widget-grid">
            {RASHIS.map((rashi) => {
              const lordId = SIGN_LORD_IDS[rashi.id];
              const insight = activeIds.has(lordId) ? templates.active : templates.quiet;
              return (
                <div className="grid-row" key={rashi.id}>
                  <span className="grid-label">{tl(rashi.name, locale)}</span>
                  <span className="grid-value">{insight}</span>
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

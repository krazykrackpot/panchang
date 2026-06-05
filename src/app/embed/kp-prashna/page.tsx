/**
 * Embeddable KP Prashna widget — number → verdict.
 *
 * Number-only (Krishnamurti tradition). Text mode lives on the full
 * /kp/prashna page; the widget at 320×480 is too cramped for textarea
 * + verdict explanation. Widget always links to the full page so an
 * embedder's visitor can deepen the experience.
 *
 * URL contract:
 *   /embed/kp-prashna                                  (form, no preselect)
 *   /embed/kp-prashna?number=100                       (pre-cast with number)
 *   /embed/kp-prashna?city=varanasi&number=100         (with location)
 *   /embed/kp-prashna?theme=…&size=…&locale=…&ref=…
 *
 * force-dynamic because every cast moment is unique.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §5.3
 */

import { getCityBySlug } from '@/lib/constants/cities';
import { castKPPrashna } from '@/lib/kp/prashna';
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
  parseEmbedKpNumber,
  type VisibleLocale,
} from '../_lib/params';
import type { EmbedTheme, EmbedSize } from '../_lib/embed-theme';

export const dynamic = 'force-dynamic';

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
  number?: string;
}

export default async function EmbedKpPrashnaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size: EmbedSize = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const number = parseEmbedKpNumber(params.number);
  const labels = getEmbedLabels(locale);
  const kpLabels = getKpEmbedLabels(locale);
  const css = buildWidgetCss({ theme, size });

  // Default location: Varanasi.
  let lat = 25.31;
  let lng = 82.97;
  let locationName = 'Varanasi';

  if (params.city) {
    const city = getCityBySlug(params.city);
    if (city) {
      lat = city.lat;
      lng = city.lng;
      locationName = city.name.en;
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

  let verdictBlock: React.ReactNode;
  let titleSuffix = '';

  if (number == null) {
    // No number → show the input form.
    verdictBlock = (
      <form method="get" action="" className="widget-grid">
        <div className="grid-row">
          <label htmlFor="kp-emb-num" className="grid-label">{kpLabels.enterNumber}</label>
          <input
            id="kp-emb-num"
            name="number"
            type="number"
            min={1}
            max={249}
            required
            className="grid-value"
            style={{ width: '100%', padding: '6px 8px', borderRadius: 6 }}
          />
        </div>
        <button type="submit" className="grid-row" style={{ background: 'var(--primary, #d4a853)', color: '#0a0e27', borderRadius: 8, padding: '8px 12px', marginTop: 8, fontWeight: 600 }}>
          {kpLabels.cast}
        </button>
      </form>
    );
    titleSuffix = '';
  } else {
    try {
      const r = castKPPrashna({
        mode: 'number',
        number,
        submissionEpochMs: Date.now(),
        lat,
        lng,
        timezone: '+00:00',
      });
      const verdictLabel = {
        favourable: kpLabels.favourable,
        adverse: kpLabels.adverse,
        mixed: kpLabels.mixed,
      }[r.verdict];
      verdictBlock = (
        <>
          <div className="widget-grid">
            <div className="grid-row">
              <span className="grid-label">#{number}</span>
              <span className="grid-value">{tl(r.nakshatra.name, locale)} · {tl(r.sub.name, locale)}</span>
            </div>
            <div className="grid-row" style={{ marginTop: 8, fontSize: '1.2em', fontWeight: 700, justifyContent: 'center' }}>
              <span className="grid-value">{kpLabels.verdict}: {verdictLabel}</span>
            </div>
            <div className="grid-row">
              <span className="grid-value" style={{ fontSize: '0.85em' }}>
                {tl(r.verdictReason, locale)}
              </span>
            </div>
          </div>
        </>
      );
      titleSuffix = ` — ${verdictLabel}`;
    } catch (err) {
      console.error('[embed/kp-prashna] cast failed:', err);
      verdictBlock = (
        <div className="widget-error">{kpLabels.invalidNumber}</div>
      );
    }
  }

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>{`${kpLabels.kpPrashnaTitle}${titleSuffix}`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{locationName}</div>
            <div className="widget-date">{kpLabels.kpPrashnaTitle}</div>
          </div>
          {verdictBlock}
          {/* Silence unused-var lint without runtime effect */}
          <div data-config={labels.configError ? '1' : '0'} style={{ display: 'none' }} />
          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

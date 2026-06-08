/**
 * Embeddable horoscope widget — daily rashi forecasts in two layouts.
 *
 * Why this exists: extends the embed-widget surface (panchang +
 * festivals shipped in PR #360) with the highest-volume use case
 * called out in the dev.to launch post — a 12-rashi gateway strip
 * that any host site can drop in and instantly become a daily-update
 * destination. Each rashi tile is a link back to the full forecast
 * on dekhopanchang.com, so the widget earns its keep by sending
 * qualified clicks rather than by holding readers on the host page.
 *
 * URL contract:
 *   /embed/horoscope                                     (strip, en, light)
 *   /embed/horoscope?theme=dark&size=wide&locale=hi
 *   /embed/horoscope?mode=single&highlight=vrishchik     (single-rashi feature)
 *   /embed/horoscope?...&ref=mybloggsite                 (attribution tag)
 *
 * Layout modes:
 *   strip  (default) — 12 compact gateway tiles in a horizontal grid.
 *                      Each tile shows: symbol, locale-aware name,
 *                      2-dot intensity glyph, single-word vibe.
 *   single           — one featured rashi (selected via `highlight`,
 *                      defaults to mesh) with full insight + scores,
 *                      plus an 11-tile nav strip to switch context
 *                      without leaving the embed.
 *
 * ISR + clock safety: the page is a pure server component. The date
 * is derived from `new Date()` once at SSR time and frozen into the
 * cached HTML; the client never re-reads the clock at hydration,
 * so the page is safe under `revalidate = 86400` (Lesson ZD —
 * client-side clock reads in ISR pages cause React hydration
 * mismatches and silent analytics breakage).
 */

import { RASHIS } from '@/lib/constants/rashis';
import { generateDailyHoroscope, type DailyHoroscope } from '@/lib/horoscope/daily-engine';
import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import AttributionFooter from '../_components/AttributionFooter';
import { buildWidgetCss } from '../_lib/build-widget-css';
import { getEmbedLabels, type EmbedLabels } from '../_lib/embed-labels';
import {
  parseEmbedTheme,
  parseEmbedSize,
  parseEmbedLocale,
  parseEmbedRef,
  parseEmbedMode,
  parseEmbedHighlight,
  type VisibleLocale,
  type EmbedHoroscopeMode,
  type RashiSlug,
} from '../_lib/params';
import type { EmbedTheme } from '../_lib/embed-theme';
import { pickByScript } from "@/lib/utils/locale-fonts";

export const revalidate = 86400; // Daily — horoscope rolls every midnight

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface SearchParams {
  theme?: string;
  size?: string;
  locale?: string;
  ref?: string;
  mode?: string;
  highlight?: string;
}

interface VibeBucket {
  dots: '●●' | '●○' | '○○';
  label: string;
}

/**
 * Map a 1-10 overallScore to a 2-dot intensity glyph + a localised
 * single-word vibe. The thresholds mirror the site-wide
 * `scoreLabel`/`getScoreBgClass` thresholds in `score-utils.ts` so
 * the widget agrees with the main horoscope page about what counts
 * as a strong day.
 */
function scoreToVibe(score: number, labels: EmbedLabels): VibeBucket {
  if (score >= 8) return { dots: '●●', label: labels.vibeStrong };
  if (score >= 6.5) return { dots: '●●', label: labels.vibeGood };
  if (score >= 4) return { dots: '●○', label: labels.vibeMixed };
  return { dots: '○○', label: labels.vibeChallenging };
}

/**
 * Translate a Trilingual / multi-locale value to the active embed
 * locale, with a hard fallback to English. `tl()` only reads en/hi/sa,
 * but the rashi name objects include all 9 locales — read those
 * directly when present, else fall through `tl()`.
 */
function localeText(
  obj: Record<string, string | undefined>,
  locale: VisibleLocale,
): string {
  const exact = obj[locale];
  if (exact) return exact;
  // tl() expects { en, hi, sa } — pass the whole map through anyway;
  // tl reads only the keys it knows, and the en key is guaranteed.
  return tl(obj as { en: string; hi: string; sa: string }, pickByScript('en', 'hi', locale));
}

export default async function EmbedHoroscopePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const theme: EmbedTheme = parseEmbedTheme(params.theme);
  const size = parseEmbedSize(params.size);
  const locale: VisibleLocale = parseEmbedLocale(params.locale);
  const ref = parseEmbedRef(params.ref);
  const mode: EmbedHoroscopeMode = parseEmbedMode(params.mode);
  const highlight: RashiSlug | undefined = parseEmbedHighlight(params.highlight);
  const labels = getEmbedLabels(locale);
  const css = buildWidgetCss({ theme, size });

  // Derive "today" once on the server. ISR-safe because every client
  // hydrates against the cached HTML; no second clock read after mount.
  const now = new Date();
  const today = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;

  const dateStr = new Date(today + 'T00:00:00Z').toLocaleDateString(
    locale === 'en' ? 'en-IN' : `${locale}-IN-u-nu-latn`,
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  );

  // Generate horoscopes for every rashi. The engine is pure and cheap
  // (deterministic seed from date + moonSign), and the page itself is
  // ISR-cached for 24h so this only runs once per day per renderer.
  const allHoroscopes: DailyHoroscope[] = RASHIS.map((r) =>
    generateDailyHoroscope({ moonSign: r.id, date: today }),
  );

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content={theme === 'auto' ? 'light dark' : theme} />
        <title>{labels.todaysHoroscope}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div className="widget">
          <div className="widget-header">
            <div className="widget-location">{labels.todaysHoroscope}</div>
            <div className="widget-date">{dateStr}</div>
          </div>

          {mode === 'single' ? (
            <SingleMode
              highlight={highlight ?? 'mesh'}
              horoscopes={allHoroscopes}
              today={today}
              labels={labels}
              locale={locale}
              ref={ref}
            />
          ) : (
            <StripMode
              horoscopes={allHoroscopes}
              today={today}
              labels={labels}
              locale={locale}
              ref={ref}
            />
          )}

          <AttributionFooter locale={locale} ref={ref} />
        </div>
      </body>
    </html>
  );
}

interface StripProps {
  horoscopes: DailyHoroscope[];
  today: string;
  labels: EmbedLabels;
  locale: VisibleLocale;
  ref?: string;
}

/**
 * 12 gateway tiles. Each is a `target="_top"` link to the full daily
 * forecast on dekhopanchang.com with UTM attribution.
 */
function StripMode({ horoscopes, today, labels, locale, ref }: StripProps) {
  return (
    <div className="horo-strip">
      {RASHIS.map((rashi, i) => {
        const horo = horoscopes[i];
        const vibe = scoreToVibe(horo.overallScore, labels);
        return (
          <a
            key={rashi.slug}
            href={buildRashiUrl(rashi.slug, today, locale, ref)}
            target="_top"
            rel="noopener"
            className="horo-tile"
          >
            <span className="horo-glyph" aria-hidden="true">{rashi.symbol}</span>
            <span className="horo-name">{localeText(rashi.name, locale)}</span>
            <span className="horo-dots" aria-hidden="true">{vibe.dots}</span>
            <span className="horo-vibe">{vibe.label}</span>
          </a>
        );
      })}
    </div>
  );
}

interface SingleProps {
  highlight: RashiSlug;
  horoscopes: DailyHoroscope[];
  today: string;
  labels: EmbedLabels;
  locale: VisibleLocale;
  ref?: string;
}

/**
 * One featured rashi (full insight + score), with all 12 below as
 * an inline switcher so a reader can see the other rashis without
 * leaving the embed. Each switcher tile is a `target="_top"` link
 * — keeps the embed pure-SSR with no client interactivity.
 */
function SingleMode({ highlight, horoscopes, today, labels, locale, ref }: SingleProps) {
  const featured = RASHIS.find((r) => r.slug === highlight) ?? RASHIS[0];
  const horo = horoscopes[featured.id - 1];
  const vibe = scoreToVibe(horo.overallScore, labels);
  const insight = tl(horo.insight, pickByScript('en', 'hi', locale));

  return (
    <>
      <div className="horo-feature">
        <div className="horo-feature-head">
          <span className="horo-feature-glyph" aria-hidden="true">{featured.symbol}</span>
          <div>
            <div className="horo-feature-name">{localeText(featured.name, locale)}</div>
            <div className="horo-feature-sub">{localeText(featured.rulerName, locale)} · {localeText(featured.element, locale)}</div>
          </div>
        </div>
        <p className="horo-feature-insight">{insight}</p>
        <div className="horo-feature-scores">
          <span>{labels.strength} {vibe.dots}</span>
          <span>{vibe.label}</span>
        </div>
        <a
          href={buildRashiUrl(featured.slug, today, locale, ref)}
          target="_top"
          rel="noopener"
          className="horo-feature-cta"
        >
          {labels.readFullForecast} →
        </a>
      </div>
      <div className="horo-nav" aria-label={labels.todaysHoroscope}>
        {RASHIS.map((rashi) => (
          <a
            key={rashi.slug}
            href={buildRashiUrl(rashi.slug, today, locale, ref)}
            target="_top"
            rel="noopener"
            className={`horo-nav-tile${rashi.slug === featured.slug ? ' horo-nav-tile-current' : ''}`}
            aria-current={rashi.slug === featured.slug ? 'page' : undefined}
            title={localeText(rashi.name, locale)}
          >
            <span aria-hidden="true">{rashi.symbol}</span>
          </a>
        ))}
      </div>
    </>
  );
}

/**
 * Build the per-rashi destination URL with embed UTM tagging.
 * `ref` is pre-validated by `parseEmbedRef` so the value here is
 * safe to interpolate into a URL.
 */
function buildRashiUrl(
  slug: string,
  date: string,
  locale: VisibleLocale,
  ref: string | undefined,
): string {
  const search = new URLSearchParams({
    utm_source: 'embed',
    utm_medium: 'iframe',
    ...(ref ? { utm_campaign: ref } : {}),
  });
  return `https://dekhopanchang.com/${locale}/horoscope/${slug}/${date}?${search.toString()}`;
}

/**
 * Attribution footer for every /embed/* widget. Renders the standard
 * "Powered by Dekho Panchang" line with a link back to the site.
 *
 * Two non-obvious details:
 *
 *   1. `target="_top"` — clicking the attribution link must navigate the
 *      parent window, NOT the iframe. Without `_top`, the click loads
 *      dekhopanchang.com inside the (typically tiny) embed iframe,
 *      breaking the UX. Always render this.
 *
 *   2. UTM-on-click tagging — every attribution click appends
 *      `utm_source=embed` + `utm_medium=iframe` + optional
 *      `utm_campaign=<ref>`. This lets us track which embedded sites
 *      generate which referral traffic in GA + our own UTM tracking via
 *      `/api/track-utm`. The `ref` param is pre-validated by
 *      `parseEmbedRef` so the value here is always safe.
 *
 * Pure server component — no hooks, no client APIs. Safe to render
 * anywhere in an embed page.
 */

import type { VisibleLocale } from '../_lib/params';

interface Props {
  /** Page's resolved locale, used for the destination URL prefix. */
  locale: VisibleLocale;
  /** Validated embedder identifier from `?ref=…`. May be undefined. */
  ref?: string;
}

export default function AttributionFooter({ locale, ref }: Props) {
  const search = new URLSearchParams({
    utm_source: 'embed',
    utm_medium: 'iframe',
    ...(ref ? { utm_campaign: ref } : {}),
  });
  const href = `https://dekhopanchang.com/${locale}?${search.toString()}`;

  return (
    <div className="widget-footer">
      <a href={href} target="_top" rel="noopener">
        Powered by <strong>Dekho Panchang</strong>
      </a>
    </div>
  );
}

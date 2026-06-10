/**
 * Small "Embed this widget" entry point displayed inline on each live
 * tool page (/kundali, /panchang, /choghadiya, /transits). Links to
 * /widget with the matching `?type=` so the configurator opens on the
 * right tab and the visitor doesn't have to hunt.
 *
 * Pure structural component — i18n is handled by the consumer page
 * passing a localised `label`. We don't bake English in the component
 * so the same render path works across all 9 visible locales.
 */

import { Link2 } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface EmbedThisLinkProps {
  /** The /widget tab to open on landing. Matches the WidgetType union
   *  in WidgetConfigurator — kundali / panchang / choghadiya / transits
   *  / festivals / horoscope / kp-rashi / kp-ruling / kp-prashna. */
  type:
    | 'kundali'
    | 'panchang'
    | 'choghadiya'
    | 'transits'
    | 'festivals'
    | 'horoscope'
    | 'kp-rashi'
    | 'kp-ruling'
    | 'kp-prashna';
  /** Visible link text. Caller localises. e.g. "Embed this widget". */
  label: string;
  /** The page's active locale. Set as `lang` on the anchor so screen
   *  readers pick the right pronunciation + the browser selects the
   *  correct script-specific font for the label. Gemini #655 MED. */
  locale: string;
}

export default function EmbedThisLink({ type, label, locale }: EmbedThisLinkProps) {
  return (
    <Link
      href={{ pathname: '/widget', query: { type } }}
      lang={locale}
      className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-light transition-colors px-2 py-1 rounded border border-gold-primary/15 hover:border-gold-primary/40"
    >
      <Link2 className="w-3 h-3" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

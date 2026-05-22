/**
 * Shared event bus contract between BrihaspatiProvider and any component
 * that wants to open the Brihaspati panel but lives OUTSIDE the
 * Provider's React subtree (e.g. <BrihaspatiHomeBanner> on the locale
 * homepage, which renders inside <main>{children} — a sibling, not a
 * descendant, of the ClientShell where the Provider mounts).
 *
 * Provider listens; surfaces dispatch.
 */

import type { PanelEntry } from './BrihaspatiProvider';

/** Window-event name that opens the Brihaspati panel. */
export const BRIHASPATI_OPEN_EVENT = 'brihaspati:open';

export interface BrihaspatiOpenEventDetail {
  /** Pre-fill the panel's question input with this text. */
  question?: string;
  /** Telemetry source for `trackBrihaspatiPanelOpened({ entry })`. */
  entry?: PanelEntry;
}

export type BrihaspatiOpenEvent = CustomEvent<BrihaspatiOpenEventDetail>;

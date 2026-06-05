'use client';

/**
 * Pandit dashboard view switcher.
 *
 * A pandit user has two equally-important workspaces on `/dashboard`:
 *
 *   • **Client** — the CRM home (PanditDashboardHome) with their roster,
 *     alerts inbox, and the workflows that make their pandit business run.
 *   • **Personal** — the full seeker dashboard (SeekerDashboardImpl) for
 *     their OWN chart, family kundalis, daily panchang, learning streak,
 *     etc. A pandit is also a practitioner of jyotish and uses the same
 *     surfaces every seeker does.
 *
 * The current behaviour (before this component) hid the personal dashboard
 * the moment a user flipped account_type=pandit — they lost access to
 * their own chart, family cards, transits, and learning progress. This
 * component restores both as a single dashboard with a toggle.
 *
 * Defaults to 'client' on first visit (preserves the prior pandit-first
 * landing) and persists the choice in localStorage so the next visit lands
 * on whichever view the pandit was last using.
 *
 * Only mounts the SELECTED child to avoid double data fetches —
 * SeekerDashboardImpl fetches kundali snapshot, gochar, festival counts;
 * PanditDashboardHome fetches client roster + alerts. Switching is fast
 * enough that the mount cost is acceptable.
 */

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';

type View = 'client' | 'personal';

const STORAGE_KEY = 'pandit-dashboard-view';
const DEFAULT_VIEW: View = 'client';

interface Props {
  clientView: React.ReactNode;
  personalView: React.ReactNode;
}

const LABELS: Record<string, { client: string; personal: string; aria: string }> = {
  en: {
    client: 'Client',
    personal: 'Personal',
    aria: 'Dashboard view',
  },
  hi: {
    client: 'क्लाइंट',
    personal: 'व्यक्तिगत',
    aria: 'डैशबोर्ड दृश्य',
  },
};

function readStoredView(): View {
  if (typeof window === 'undefined') return DEFAULT_VIEW;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'personal' || stored === 'client' ? stored : DEFAULT_VIEW;
  } catch (err) {
    // localStorage can throw in private mode / cookie-blocked browsers.
    // Fall back to the default rather than crash the dashboard.
    console.error('[PanditDashboardSwitcher] localStorage read failed:', err);
    return DEFAULT_VIEW;
  }
}

export default function PanditDashboardSwitcher({ clientView, personalView }: Props) {
  const locale = useLocale() as Locale;
  const L = LABELS[locale] || LABELS.en;

  // Server-render the default view to keep SSR HTML stable; rehydrate to
  // the stored preference inside an effect. This avoids a hydration
  // mismatch (Lesson ZD).
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setView(readStoredView());
    setHydrated(true);
  }, []);

  function selectView(next: View) {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      console.error('[PanditDashboardSwitcher] localStorage write failed:', err);
    }
  }

  // Until rehydrated, render the default (client) view — matches the
  // SSR-served HTML. The toggle is rendered too but in its default state.
  const activeView = hydrated ? view : DEFAULT_VIEW;

  // A single tabpanel always lives at the same DOM id so the inactive
  // tab's `aria-controls` still points at a real node — assistive tech
  // doesn't see a dangling reference between selections. The panel's
  // `aria-labelledby` mirrors the currently-active tab's id.
  const PANEL_ID = 'pandit-dashboard-panel';
  const tabId = (option: View) => `pandit-dashboard-tab-${option}`;

  return (
    <>
      <div className="px-4 sm:px-6 pt-4 pb-2">
        <div
          role="tablist"
          aria-label={L.aria}
          className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-pandit-violet)]/25 bg-bg-secondary/40 p-1 backdrop-blur-sm"
        >
          {(['client', 'personal'] as const).map((option) => {
            const isActive = activeView === option;
            return (
              <button
                key={option}
                id={tabId(option)}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={PANEL_ID}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectView(option)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[color:var(--color-pandit-violet)]/30 text-white shadow-inner shadow-[color:var(--color-pandit-violet)]/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-[color:var(--color-pandit-violet)]/10'
                }`}
              >
                {L[option]}
              </button>
            );
          })}
        </div>
      </div>
      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={tabId(activeView)}
      >
        {activeView === 'client' ? clientView : personalView}
      </div>
    </>
  );
}

/**
 * Preview-only namespace for the Pandit CRM prototypes.
 *
 * Routes under /dashboard-preview/pandit/* render the design prototypes
 * with mocked fixtures (src/lib/pandit/mock-fixtures.ts). NO backend
 * wiring, NO auth gating, NO supabase. This entire subtree is for
 * design + UX review before production implementation lands in P1+.
 *
 * Production routes will live under /dashboard/* with real wiring.
 */

import Link from 'next/link';
import { MOCK_PANDIT } from '@/lib/pandit/mock-fixtures';

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Preview banner — makes it obvious this is a design-review namespace */}
      <div className="bg-[color:var(--color-pandit-violet)]/15 border-b border-[color:var(--color-pandit-violet)]/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[color:var(--color-pandit-violet)]/40 text-white font-bold uppercase tracking-wider text-[10px]">
              Preview
            </span>
            <span className="text-text-secondary">
              Pandit CRM — design review with mocked data. Not the production
              dashboard.
            </span>
          </div>
          <div className="flex gap-3 text-text-secondary">
            <Link href="/en/dashboard-preview/pandit" className="hover:text-gold-light transition">
              Home
            </Link>
            <span className="text-text-tertiary">·</span>
            <Link
              href="/en/dashboard-preview/pandit/clients"
              className="hover:text-gold-light transition"
            >
              Roster
            </Link>
            <span className="text-text-tertiary">·</span>
            <Link
              href="/en/dashboard-preview/pandit/clients/client-001"
              className="hover:text-gold-light transition"
            >
              Client detail
            </Link>
            <span className="text-text-tertiary">·</span>
            <Link
              href="/en/dashboard-preview/pandit/alerts"
              className="hover:text-gold-light transition"
            >
              Alerts inbox
            </Link>
            <span className="text-text-tertiary">·</span>
            <Link
              href="/en/dashboard-preview/pandit/tippanni"
              className="hover:text-gold-light transition"
            >
              Tippanni editor
            </Link>
            <span className="text-text-tertiary">·</span>
            <Link
              href="/en/dashboard-preview/pandit/add-client"
              className="hover:text-gold-light transition"
            >
              Add client
            </Link>
          </div>
        </div>
      </div>

      {/* Simulated Pandit nav strip (since we're bypassing the real navbar) */}
      <header className="border-b border-gold-primary/12 bg-bg-secondary/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: MOCK_PANDIT.accent_color, fontFamily: 'var(--font-devanagari-heading)' }}
            >
              {MOCK_PANDIT.logo_initial}
            </div>
            <Link
              href="/en/dashboard-preview/pandit"
              className="flex flex-col"
            >
              <span
                className="text-sm font-bold text-gold-light leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Dekho Panchang
              </span>
              <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
                Pandit workspace
              </span>
            </Link>
          </div>

          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <NavLink href="/en/dashboard-preview/pandit">Today</NavLink>
            <NavLink href="/en/dashboard-preview/pandit/clients">Clients</NavLink>
            <NavLink href="/en/dashboard-preview/pandit/alerts">
              <span className="flex items-center gap-1.5">
                Alerts
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-[color:var(--color-alert-critical)] text-white font-bold">
                  3
                </span>
              </span>
            </NavLink>
            <NavLink href="/en/dashboard-preview/pandit/calendar">Calendar</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-[color:var(--color-state-active)]/15 text-[10px] uppercase tracking-wider text-[color:var(--color-state-active)] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-state-active)]" />
              Online
            </span>
            <div className="text-right">
              <p
                className="text-[12px] text-gold-light font-medium leading-tight"
                style={{ fontFamily: 'var(--font-devanagari-body)' }}
              >
                {MOCK_PANDIT.full_name_hi}
              </p>
              <p className="text-[10px] text-text-tertiary">{MOCK_PANDIT.letterhead_subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href as never}
      className="
        px-3 py-1.5 rounded-md text-text-secondary
        hover:text-gold-light hover:bg-gold-primary/8 transition
      "
    >
      {children}
    </Link>
  );
}

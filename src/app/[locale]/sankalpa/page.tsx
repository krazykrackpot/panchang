import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { ScrollText } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';
import { SANKALPA_LABELS } from './sankalpa-labels';
import SankalpaClient from './SankalpaClient';

/**
 * Server-rendered Sankalpa page.
 *
 * Why this is a server component (and SankalpaClient is the client one):
 * the original page called `useSearchParams()` at module scope, which
 * (per the Next 16 dynamic-rendering rules) opts the entire route out of
 * SSR. Bingbot — which has limited / inconsistent JS execution — saw an
 * empty page with no <h1>, no body copy, only the navbar and animated
 * starfield. Result: the URL was flagged in Bing Webmaster Tools for
 * "Missing <h1>" on 2026-05-29.
 *
 * Fix (Next 16 idiomatic): split the page. The static SEO surface — h1,
 * subtitle, description, hero icon — is server-rendered here, so it ends
 * up in the SSR HTML regardless of what hooks the client uses. The
 * interactive form (state, useSearchParams, framer-motion, Supabase
 * stores, etc.) lives in SankalpaClient.tsx and is mounted below the
 * header inside a <Suspense> boundary.
 *
 * The Suspense wrapper is REQUIRED, not cosmetic. Without it, the
 * `useSearchParams()` call inside SankalpaClient bubbles a
 * "BAILOUT_TO_CLIENT_SIDE_RENDERING" up to the nearest dynamic boundary,
 * which is the entire <main> tree. The bailout replaces the server
 * output with a "Loading…" spinner — including our brand-new h1 — and
 * Bingbot sees nothing. With Suspense around the client child, the
 * bailout is contained: the server header stays in the SSR HTML, and
 * only the form subtree CSR-hydrates.
 */
export default async function SankalpaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = SANKALPA_LABELS[locale] || SANKALPA_LABELS.en;
  const isDevanagari = isDevanagariLocale(locale as Locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;

  return (
    <>
      {/* Server-rendered header — the SEO-critical content. Identical
          visual layout to the pre-split version, minus the framer-motion
          fade-in (a one-shot mount animation that's not worth blocking
          SSR over). */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-primary/10 border border-gold-primary/20 mb-6">
          <ScrollText className="w-10 h-10 text-gold-primary" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-gold-primary/70 text-lg mb-2" style={bodyFont}>{t.subtitle}</p>
        <p className="text-text-secondary text-sm max-w-2xl mx-auto" style={bodyFont}>{t.desc}</p>
      </header>

      <Suspense fallback={<SankalpaClientFallback />}>
        <SankalpaClient />
      </Suspense>
    </>
  );
}

/**
 * Minimal skeleton shown while SankalpaClient hydrates. Visually similar
 * to the form card layout so there's no jarring shift, but server-safe.
 */
function SankalpaClientFallback() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      aria-label="Loading form"
    >
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8 h-96 animate-pulse" />
    </div>
  );
}

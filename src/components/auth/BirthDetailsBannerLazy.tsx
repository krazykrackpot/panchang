'use client';

/**
 * Client-component boundary for `dynamic(() => …, { ssr: false })`.
 *
 * `next/dynamic` with `ssr: false` is disallowed inside Server Components
 * in Next 16 / Turbopack — the daily Vercel build failed on this on
 * 2026-05-28 with: "`ssr: false` is not allowed with `next/dynamic` in
 * Server Components. Please move it into a Client Component."
 *
 * This shim is the recommended fix: a tiny `'use client'` wrapper that
 * holds the dynamic() call. The parent server layout imports this wrapper
 * directly. SSR-skip + bundle-split semantics from PR #277 are preserved
 * verbatim — the banner code is still in its own chunk, still skipped at
 * SSR, still gated to logged-in users via the inner component's auth
 * check. Only the *location* of the dynamic() call changes.
 */

import dynamic from 'next/dynamic';

const BirthDetailsBanner = dynamic(() => import('./BirthDetailsBanner'), { ssr: false });

interface Props {
  locale: string;
}

export default function BirthDetailsBannerLazy({ locale }: Props) {
  return <BirthDetailsBanner locale={locale} />;
}

'use client';

import dynamic from 'next/dynamic';

const ServiceWorkerRegistrar = dynamic(() => import('@/components/layout/ServiceWorkerRegistrar'), { ssr: false });
const InstallPrompt = dynamic(() => import('@/components/pwa/InstallPrompt'), { ssr: false });
const OfflineBanner = dynamic(() => import('@/components/pwa/OfflineBanner'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/cookie-consent/CookieConsent'), { ssr: false });

/**
 * Client-only shell components (SW, PWA, cookies).
 * Extracted from layout.tsx because Next.js 16 disallows `ssr: false`
 * in Server Components.
 */
export default function ClientShell({ locale }: { locale?: string }) {
  return (
    <>
      <ServiceWorkerRegistrar />
      <InstallPrompt />
      <OfflineBanner />
      <CookieConsent locale={locale ?? 'en'} />
    </>
  );
}

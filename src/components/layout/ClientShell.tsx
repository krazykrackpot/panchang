'use client';

import dynamic from 'next/dynamic';

const ServiceWorkerRegistrar = dynamic(() => import('@/components/layout/ServiceWorkerRegistrar'), { ssr: false });
const InstallPrompt = dynamic(() => import('@/components/pwa/InstallPrompt'), { ssr: false });
const OfflineBanner = dynamic(() => import('@/components/pwa/OfflineBanner'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/cookie-consent/CookieConsent'), { ssr: false });
const VratScheduler = dynamic(() => import('@/components/vrat/VratScheduler'), { ssr: false });
const ClientErrorHandler = dynamic(() => import('@/components/layout/ClientErrorHandler'), { ssr: false });
const SignupBanner = dynamic(() => import('@/components/auth/SignupBanner'), { ssr: false });
const SignupPrompt = dynamic(() => import('@/components/auth/SignupPrompt'), { ssr: false });
const TimezoneMismatchBanner = dynamic(() => import('@/components/location/TimezoneMismatchBanner'), { ssr: false });
const BrihaspatiShell = dynamic(() => import('@/components/brihaspati/BrihaspatiShell'), { ssr: false });

/**
 * Client-only shell components (SW, PWA, cookies).
 * Extracted from layout.tsx because Next.js 16 disallows `ssr: false`
 * in Server Components.
 */
export default function ClientShell({ locale, country }: { locale?: string; country?: string }) {
  return (
    <>
      <ServiceWorkerRegistrar />
      <InstallPrompt />
      <OfflineBanner />
      <CookieConsent locale={locale ?? 'en'} />
      <VratScheduler />
      <ClientErrorHandler />
      <SignupBanner />
      <SignupPrompt />
      <TimezoneMismatchBanner />
      <BrihaspatiShell locale={locale ?? 'en'} country={country} />
    </>
  );
}

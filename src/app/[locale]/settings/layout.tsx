import type { Metadata } from 'next';

// Per-user settings page — explicit noindex defence-in-depth alongside
// robots.txt `Disallow: /*/settings/`. Audit 2026-05-25 §I.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

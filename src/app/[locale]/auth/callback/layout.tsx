import type { Metadata } from 'next';

// OAuth callback URL — should never be indexed. Belt-and-suspenders
// alongside robots.txt `Disallow: /*/auth/`. Audit 2026-05-25 §I.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

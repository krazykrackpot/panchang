import type { Metadata } from 'next';

// Stripe/Razorpay checkout return landing — transactional URL with
// session-bound state. Should never appear in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BrihaspatiReturnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

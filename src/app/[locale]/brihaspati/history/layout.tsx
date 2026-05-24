import type { Metadata } from 'next';

// Authenticated user's chat history. Inherits title from parent /brihaspati
// layout's generateMetadata cascade; overrides robots to keep the personal
// chat archive out of search indices.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BrihaspatiHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classical Jyotish Library — Free Texts & Downloads | Dekho Panchang',
  description: 'Curated collection of classical Vedic astrology and astronomy texts — Parashara, Varahamihira, Jaimini, Surya Siddhanta and more. Free to read and download via archive.org.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

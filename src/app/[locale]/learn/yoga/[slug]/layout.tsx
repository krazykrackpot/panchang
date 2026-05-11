import type { Metadata } from 'next';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const yoga = YOGA_DETAIL_DATA[slug];
  if (!yoga) return { title: 'Yoga — Dekho Panchang' };

  const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
  const name = locale === 'hi' ? yoga.name.hi : yoga.name.en;
  const desc = locale === 'hi' ? yoga.detailedDescription.hi[0] : yoga.detailedDescription.en[0];

  return {
    title: `${name} — Formation, Effects & Remedies | Dekho Panchang`,
    description: desc.slice(0, 155),
    openGraph: {
      title: name,
      description: desc.slice(0, 155),
      url: `${BASE_URL}/${locale}/learn/yoga/${slug}`,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/yoga/${slug}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

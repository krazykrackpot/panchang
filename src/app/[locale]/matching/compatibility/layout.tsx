import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = getPageMetadata('/matching/compatibility', locale);
  return {
    ...meta,
    alternates: {
      canonical: `${BASE_URL}/${locale}/matching/compatibility`,
      languages: {
        en: `${BASE_URL}/en/matching/compatibility`,
        hi: `${BASE_URL}/hi/matching/compatibility`,
        sa: `${BASE_URL}/sa/matching/compatibility`,
        'x-default': `${BASE_URL}/en/matching/compatibility`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/modules/13-2`,
      languages: {
        en: `${BASE_URL}/en/learn/modules/13-2`,
        hi: `${BASE_URL}/hi/learn/modules/13-2`,
        sa: `${BASE_URL}/sa/learn/modules/13-2`,
        'x-default': `${BASE_URL}/en/learn/modules/13-2`,
      },
    },
  };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

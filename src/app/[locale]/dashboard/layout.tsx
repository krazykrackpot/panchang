import type { Metadata } from 'next';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHi = isDevanagariLocale(locale);
  const title = isHi ? 'मेरा डैशबोर्ड — देखो पंचांग' : 'My Dashboard — Dekho Panchang';
  const description = isHi
    ? 'आपकी व्यक्तिगत ज्योतिष डैशबोर्ड — सहेजे गए चार्ट, दशा अवलोकन, गोचर और उपाय।'
    : 'Your personal astrology dashboard — saved charts, dasha overview, transits, and remedies.';
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard`,
      languages: {
        en: `${BASE_URL}/en/dashboard`,
        hi: `${BASE_URL}/hi/dashboard`,
        sa: `${BASE_URL}/sa/dashboard`,
      },
    },
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHi = isDevanagariLocale(locale);
  const title = tl({ en: 'My Dashboard — Dekho Panchang', hi: 'मेरा डैशबोर्ड — देखो पंचांग', sa: 'मेरा डैशबोर्ड — देखो पंचांग' }, locale);
  const description = tl({ en: 'Your personal astrology dashboard — saved charts, dasha overview, transits, and remedies.', hi: 'आपकी व्यक्तिगत ज्योतिष डैशबोर्ड — सहेजे गए चार्ट, दशा अवलोकन, गोचर और उपाय।', sa: 'आपकी व्यक्तिगत ज्योतिष डैशबोर्ड — सहेजे गए चार्ट, दशा अवलोकन, गोचर और उपाय।' }, locale);
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

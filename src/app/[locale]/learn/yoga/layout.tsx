import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

  const title = locale === 'hi'
    ? 'योग विश्वकोश — 104 वैदिक ज्योतिष योग | Dekho Panchang'
    : 'Yoga Encyclopedia — 104 Vedic Astrology Yogas | Dekho Panchang';
  const description = locale === 'hi'
    ? 'गजकेसरी, बुधादित्य, मंगल दोष, काल सर्प, पंच महापुरुष और 99 अन्य योगों का विस्तृत विवरण — निर्माण नियम, प्रभाव, उपाय और शास्त्रीय सन्दर्भ।'
    : 'Comprehensive guide to 104 Vedic astrology yogas — Gajakesari, Budhaditya, Mangal Dosha, Kaal Sarpa, Pancha Mahapurusha and more. Formation rules, effects, remedies, and classical references.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/learn/yoga`,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/yoga`,
      languages: { en: `${BASE_URL}/en/learn/yoga`, hi: `${BASE_URL}/hi/learn/yoga` },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

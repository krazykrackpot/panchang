import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const route = `/kundali/${id}`;
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      languages: {
        en: `${BASE_URL}/en${route}`,
        hi: `${BASE_URL}/hi${route}`,
        sa: `${BASE_URL}/sa${route}`,
        'x-default': `${BASE_URL}/en${route}`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

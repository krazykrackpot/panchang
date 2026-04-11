import type { Metadata } from 'next';
import { MODULE_SEQUENCE } from '@/lib/learn/module-sequence';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';
const MOD_ID = '21-4';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const mod = MODULE_SEQUENCE.find(m => m.id === MOD_ID);
  const loc = locale as 'en' | 'hi' | 'sa';
  const title = mod ? `${((mod.title as Record<string, string>)[loc] || mod.title.en)} — Learn Jyotish` : `Module ${MOD_ID} — Learn Jyotish`;
  const description = mod ? `${mod.topic} · Module ${MOD_ID} — Interactive Vedic astrology lesson` : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/modules/${MOD_ID}`,
      languages: {
        en: `${BASE_URL}/en/learn/modules/${MOD_ID}`,
        hi: `${BASE_URL}/hi/learn/modules/${MOD_ID}`,
        sa: `${BASE_URL}/sa/learn/modules/${MOD_ID}`,
        'x-default': `${BASE_URL}/en/learn/modules/${MOD_ID}`,
      },
    },
    openGraph: { title, description },
  };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

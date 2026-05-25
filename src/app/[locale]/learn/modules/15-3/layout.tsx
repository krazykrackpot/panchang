import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { MODULE_SEQUENCE } from '@/lib/learn/module-sequence';
import { buildHreflangMap } from '@/lib/seo/hreflang';
import { ModuleArticleLD } from '@/components/seo/ModuleArticleLD';
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
const MOD_ID = '15-3';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const mod = MODULE_SEQUENCE.find(m => m.id === MOD_ID);
  const title = mod ? `${((mod.title as Record<string, string>)[locale] || mod.title.en)}  –  Learn Jyotish` : `Module ${MOD_ID}  –  Learn Jyotish`;
  const description = mod ? `${mod.topic} · Module ${MOD_ID}  –  Interactive Vedic astrology lesson` : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/modules/${MOD_ID}`,
      languages: buildHreflangMap(`/learn/modules/${MOD_ID}`),
    },
    openGraph: { title, description },
  };
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ModuleArticleLD modId={MOD_ID} locale={locale} />
      {children}
    </>
  );
}

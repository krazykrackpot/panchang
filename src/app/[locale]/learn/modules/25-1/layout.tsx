import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getModuleRef } from '@/lib/learn/module-sequence';
import { buildHreflangMap } from '@/lib/seo/hreflang';
import { ModuleArticleLD } from '@/components/seo/ModuleArticleLD';
// Strip trailing slash so the canonical URL never produces a double
// slash if NEXT_PUBLIC_SITE_URL ends with /. Matches buildHreflangMap.
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/$/, '');
const MOD_ID = '25-1';
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  // O(1) Map-based lookup instead of O(N) MODULE_SEQUENCE.find.
  const mod = getModuleRef(MOD_ID);
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

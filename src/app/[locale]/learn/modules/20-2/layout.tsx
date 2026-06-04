import type { Metadata } from 'next';
import { generateModuleMetadata } from '@/lib/seo/module-metadata';
import { ModuleArticleLD } from '@/components/seo/ModuleArticleLD';

const MOD_ID = '20-2';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateModuleMetadata(MOD_ID, locale);
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

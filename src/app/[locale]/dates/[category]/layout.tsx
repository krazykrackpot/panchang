import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();
const VALID_CATEGORIES = ['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!VALID_CATEGORIES.includes(category)) return {};
  const route = `/dates/${category}`;
  const meta = getPageMetadata(route, locale);
  return {
    ...meta,
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

export function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }));
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD(`/dates/${category}`, locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}

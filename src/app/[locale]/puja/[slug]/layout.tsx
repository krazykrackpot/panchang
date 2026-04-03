import type { Metadata } from 'next';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';

export function generateStaticParams() {
  return Object.keys(PUJA_VIDHIS).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const puja = PUJA_VIDHIS[slug];

  if (!puja) {
    return { title: 'Puja Vidhi — Dekho Panchang' };
  }

  const loc = locale as 'en' | 'hi' | 'sa';
  const deity = puja.deity[loc] || puja.deity.en;
  const deityEn = puja.deity.en;
  const title = `${deity} Puja Vidhi — Step by Step with Mantras | Dekho Panchang`;
  const description = `Complete ${deityEn} puja vidhi with step-by-step procedure, mantras in Devanagari & IAST, samagri list, and auspicious timing. ${puja.muhurtaDescription.en}`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.dekhopanchang.com/${locale}/puja/${slug}`,
      siteName: 'Dekho Panchang',
      locale: locale === 'hi' ? 'hi_IN' : locale === 'sa' ? 'sa_IN' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.dekhopanchang.com/en/puja/${slug}`,
      languages: {
        en: `/en/puja/${slug}`,
        hi: `/hi/puja/${slug}`,
        sa: `/sa/puja/${slug}`,
      },
    },
  };
}

export default function PujaSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  // We need to resolve params synchronously in the render — use a wrapper
  return <PujaSlugLayoutInner params={params}>{children}</PujaSlugLayoutInner>;
}

async function PujaSlugLayoutInner({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const puja = PUJA_VIDHIS[slug];

  if (!puja) {
    return <>{children}</>;
  }

  const deity = puja.deity.en;
  const description = `Complete ${deity} puja vidhi with step-by-step procedure, mantras, samagri list, and auspicious timing. ${puja.muhurtaDescription.en}`.slice(0, 160);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${deity} Puja Vidhi`,
    description,
    step: puja.vidhiSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title.en,
      text: s.description.en,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

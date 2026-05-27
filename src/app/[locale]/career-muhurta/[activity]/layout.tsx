import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { CAREER_CONTENT, SLUG_TO_ACTIVITY } from '@/lib/career/career-content';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

export async function generateMetadata({ params }: { params: Promise<{ locale: string; activity: string }> }): Promise<Metadata> {
  const { locale, activity: slug } = await params;
  setRequestLocale(locale);
  const activityId = SLUG_TO_ACTIVITY[slug];
  if (!activityId) return { title: 'Career Muhurta — Dekho Panchang' };
  const c = CAREER_CONTENT[activityId];
  const name = tl(c.name, locale);

  const isTa = locale === 'ta';
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

  // Title patterns include the native-script name first for South-Indian
  // locales, English fallback otherwise. Mirrors the bilingual SEO title
  // pattern used by /gauri-panchang (see feedback_bilingual_titles).
  const title = isTa
    ? `${name}க்கு நல்ல நேரம் — Career Muhurta | Dekho Panchang`
    : isHi
      ? `${name} के लिए शुभ मुहूर्त — Career Muhurta | Dekho Panchang`
      : `Best Time for ${name} — Career Muhurta | Dekho Panchang`;

  const description = tl(c.oneLiner, locale);

  return {
    title,
    description,
    keywords: [
      `${name.toLowerCase()} muhurta`,
      `best time for ${name.toLowerCase()}`,
      `${name.toLowerCase()} auspicious time`,
      `${c.classicalName.transliteration.toLowerCase()} muhurta`,
      'career muhurta',
      'vedic timing career',
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/career-muhurta/${slug}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}/career-muhurta/${slug}`])),
        'x-default': `${BASE_URL}/en/career-muhurta/${slug}`,
      },
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; activity: string }> }) {
  const { locale, activity: slug } = await params;
  setRequestLocale(locale);
  const activityId = SLUG_TO_ACTIVITY[slug];

  // Per-activity FAQPage JSON-LD — pulls from the activity's faqs array
  // so each landing page advertises its own questions to Google.
  let faqLD: unknown = null;
  if (activityId) {
    const c = CAREER_CONTENT[activityId];
    faqLD = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faqs.map((f) => ({
        '@type': 'Question',
        name: tl(f.q, locale),
        acceptedAnswer: { '@type': 'Answer', text: tl(f.a, locale) },
      })),
    };
  }

  return (
    <>
      {faqLD ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} /> : null}
      {children}
    </>
  );
}

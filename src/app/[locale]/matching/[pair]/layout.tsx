import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAllPairSlugs, getRashiBySlug, canonicalPairSlug } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';

import { BASE_URL } from '@/lib/seo/base-url';

export function generateStaticParams() {
  return getAllPairSlugs().map(pair => ({ pair }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; pair: string }> }): Promise<Metadata> {
  const { locale, pair } = await params;
  setRequestLocale(locale);
  const parts = pair.split('-and-');
  if (parts.length !== 2) return {};
  const r1 = getRashiBySlug(parts[0]);
  const r2 = getRashiBySlug(parts[1]);
  if (!r1 || !r2) return {};

  // Redirect non-canonical order
  const canonical = canonicalPairSlug(parts[0], parts[1]);
  if (pair !== canonical) {
    redirect(`/${locale}/matching/${canonical}`);
  }

  const name1 = tl(r1.name, locale);
  const name2 = tl(r2.name, locale);
  const western1 = r1.name.en;
  const western2 = r2.name.en;

  // Title under 60 chars: "Aries & Scorpio  –  36-Point Vedic Match Score"
  const title = tl({
    en: `${western1} & ${western2}  –  36-Point Vedic Match Score`,
    hi: `${name1} और ${name2}  –  36 अंक वैदिक मिलान`,
    sa: `${name1} ${name2} च  –  ३६ अङ्कवैदिकमेलनम्`,
    mai: `${name1} आ ${name2}  –  36 अंक वैदिक मिलान`,
    mr: `${name1} आणि ${name2}  –  36 अंक वैदिक मिलान`,
    ta: `${name1} & ${name2}  –  36 புள்ளி வைதிக பொருத்தம்`,
    te: `${name1} & ${name2}  –  36 పాయింట్ల వైదిక మ్యాచ్`,
    kn: `${name1} & ${name2}  –  36 ಪಾಯಿಂಟ್ ವೈದಿಕ ಹೊಂದಾಣಿಕೆ`,
    gu: `${name1} & ${name2}  –  36 પોઈન્ટ વૈદિક મેળાપક`,
    bn: `${name1} ও ${name2}  –  36 পয়েন্ট বৈদিক মিলন`,
  }, locale);

  // Description under 155 chars
  const description = tl({
    en: `Free ${western1}-${western2} compatibility: Ashta Kuta 36-point score, Nadi, Bhakut, Gana & 5 more factors. Instant Vedic matching analysis.`,
    hi: `${name1}-${name2} संगतता: अष्ट कूट 36 अंक, नाड़ी, भकूट, गण व 5 अन्य कारक। तुरन्त वैदिक मिलान।`,
    sa: `${name1}-${name2} संगतता: अष्टकूट ३६ अङ्काः नाडी भकूटं गणं च। वैदिकमेलनविश्लेषणम्।`,
    mai: `${name1}-${name2} अनुकूलता: अष्ट कूट 36 अंक, नाड़ी, भकूट, गण आ 5 आन कारक। तुरंत वैदिक मिलान।`,
    mr: `${name1}-${name2} अनुकूलता: अष्ट कूट 36 अंक, नाडी, भकूट, गण व 5 इतर घटक. तत्काळ वैदिक मिलान.`,
    ta: `${name1}-${name2} பொருத்தம்: அஷ்ட கூட 36 புள்ளி, நாடி, பகூட, கண & 5 கூடுதல் காரணி. உடனடி வைதிக ஆய்வு.`,
    te: `${name1}-${name2} అనుకూలత: అష్ట కూట 36 పాయింట్లు, నాడి, భకూట, గణ & మరో 5 అంశాలు. తక్షణ వైదిక విశ్లేషణ.`,
    kn: `${name1}-${name2} ಹೊಂದಾಣಿಕೆ: ಅಷ್ಟ ಕೂಟ 36 ಅಂಕ, ನಾಡಿ, ಭಕೂಟ, ಗಣ ಮತ್ತು 5 ಇತರ ಅಂಶಗಳು. ತಕ್ಷಣದ ವೈದಿಕ ವಿಶ್ಲೇಷಣೆ.`,
    gu: `${name1}-${name2} સંગતતા: અષ્ટ કૂટ 36 અંક, નાડી, ભકૂટ, ગણ અને 5 અન્ય ઘટકો. તાત્કાલિક વૈદિક મેળાપક.`,
    bn: `${name1}-${name2} সামঞ্জস্য: অষ্ট কূট 36 পয়েন্ট, নাড়ি, ভকূট, গণ ও আরও 5 উপাদান। তাত্ক্ষণিক বৈদিক বিশ্লেষণ।`,
  }, locale);

  const route = `/matching/${canonical}`;
  const isIndexable = isLocaleIndexable(route, locale);

  return {
    title,
    description,
    keywords: [
      `${western1.toLowerCase()} ${western2.toLowerCase()} compatibility`,
      `${western1.toLowerCase()} and ${western2.toLowerCase()} match`,
      `${r1.slug} ${r2.slug} compatibility`,
      `${name1} ${name2} vedic matching`,
      'ashta kuta score',
      'vedic compatibility',
      'rashi matching',
    ],
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: buildCanonicalUrl(route, locale),
      languages: buildIndexableHreflang(route),
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; pair: string }> }) {
  const { locale, pair } = await params;
  setRequestLocale(locale);
  const parts = pair.split('-and-');
  const r1 = getRashiBySlug(parts[0]);
  const r2 = getRashiBySlug(parts[1]);
  const name1 = r1 ? tl(r1.name, locale) : parts[0];
  const name2 = r2 ? tl(r2.name, locale) : parts[1];

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/matching/${pair}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: `${name1} and ${name2} Compatibility`,
        description: `Vedic compatibility analysis for ${name1} and ${name2} with Ashta Kuta scoring.`,
        url: `${BASE_URL}/${locale}/matching/${pair}`,
      }) }} />
      {children}
    </>
  );
}

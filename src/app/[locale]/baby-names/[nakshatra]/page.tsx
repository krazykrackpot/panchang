import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES } from '@/lib/constants/nakshatra-syllables';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableHreflang, buildCanonicalUrl } from '@/lib/seo/hreflang';

export const revalidate = false; // Static — nakshatra data never changes

import { BASE_URL } from '@/lib/seo/base-url';

// Slug → nakshatra ID mapping
const SLUG_TO_ID: Record<string, number> = {
  ashwini: 1, bharani: 2, krittika: 3, rohini: 4, mrigashira: 5,
  ardra: 6, punarvasu: 7, pushya: 8, ashlesha: 9, magha: 10,
  'purva-phalguni': 11, 'uttara-phalguni': 12, hasta: 13, chitra: 14,
  swati: 15, vishakha: 16, anuradha: 17, jyeshtha: 18, mula: 19,
  'purva-ashadha': 20, 'uttara-ashadha': 21, shravana: 22, dhanishta: 23,
  shatabhisha: 24, 'purva-bhadrapada': 25, 'uttara-bhadrapada': 26, revati: 27,
};

const ALL_SLUGS = Object.keys(SLUG_TO_ID);

export function generateStaticParams() {
  return ['en', 'hi'].flatMap(locale =>
    ALL_SLUGS.map(nakshatra => ({ locale, nakshatra }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; nakshatra: string }> }): Promise<Metadata> {
  const { locale, nakshatra: slug } = await params;
  setRequestLocale(locale);
  const nakId = SLUG_TO_ID[slug];
  if (!nakId) return { title: 'Baby Names — Dekho Panchang' };

  const nak = NAKSHATRAS[nakId - 1];
  const nakName = tl(nak.name, locale);
  const isHi = isDevanagariLocale(locale);
  const route = `/baby-names/${slug}`;
  const isIndexable = isLocaleIndexable(route, locale);
  const url = buildCanonicalUrl(route, locale);

  const syllables = NAKSHATRA_SYLLABLES[nakId];
  const syllableList = syllables?.map(s => s.en).join(', ') ?? '';

  return {
    title: isHi
      ? `${nakName} नक्षत्र बेबी नेम — शिशु के नाम के अक्षर | देखो पंचांग`
      : `${nakName} Nakshatra Baby Names — Starting Syllables & Letters | Dekho Panchang`,
    description: isHi
      ? `${nakName} नक्षत्र में जन्मे बच्चे के नाम ${syllableList} अक्षरों से शुरू होने चाहिए। चारों पदों के अक्षर, अर्थ और सुझाए गए नाम।`
      : `Baby names for ${nakName} nakshatra should start with ${syllableList}. Starting syllables for all 4 padas with meanings and name suggestions.`,
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: url,
      languages: buildIndexableHreflang(route),
    },
    keywords: [
      `${nak.name.en} baby names`, `${nak.name.en} nakshatra names`,
      `${nak.name.hi || ''} नाम`, `baby names starting with ${syllableList}`,
      'nakshatra baby names', 'vedic baby names',
    ].filter(Boolean),
  };
}

export default async function NakshatraBabyNamePage({ params }: { params: Promise<{ locale: string; nakshatra: string }> }) {
  const { locale, nakshatra: slug } = await params;
  setRequestLocale(locale);
  const nakId = SLUG_TO_ID[slug];
  if (!nakId) notFound();

  const nak = NAKSHATRAS[nakId - 1];
  const nakName = tl(nak.name, locale);
  const isHi = isDevanagariLocale(locale);
  const syllables = NAKSHATRA_SYLLABLES[nakId] ?? [];
  const rulerName = tl(nak.rulerName, locale);
  const deityName = tl(nak.deity, locale);

  // Adjacent nakshatras for navigation
  const prevId = nakId > 1 ? nakId - 1 : 27;
  const nextId = nakId < 27 ? nakId + 1 : 1;
  const prevSlug = ALL_SLUGS[prevId - 1];
  const nextSlug = ALL_SLUGS[nextId - 1];
  const prevName = tl(NAKSHATRAS[prevId - 1].name, locale);
  const nextName = tl(NAKSHATRAS[nextId - 1].name, locale);

  // FAQ for schema
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isHi ? `${nakName} नक्षत्र में जन्मे बच्चे का नाम किस अक्षर से रखें?` : `What letter should ${nakName} nakshatra baby names start with?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isHi
            ? `${nakName} नक्षत्र के चार पदों के अक्षर हैं: ${syllables.map(s => s.hi).join(', ')}। इन अक्षरों से शुरू होने वाले नाम शुभ माने जाते हैं।`
            : `${nakName} nakshatra has 4 padas with starting syllables: ${syllables.map(s => s.en).join(', ')}. Names beginning with these sounds are considered auspicious.`,
        },
      },
      {
        '@type': 'Question',
        name: isHi ? `${nakName} नक्षत्र का स्वामी ग्रह कौन है?` : `Which planet rules ${nakName} nakshatra?`,
        acceptedAnswer: { '@type': 'Answer', text: isHi ? `${nakName} नक्षत्र का स्वामी ${rulerName} है।` : `${nakName} nakshatra is ruled by ${rulerName}.` },
      },
    ],
  };

  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/baby-names/${slug}`, locale);

  return (
    <main className="min-h-screen bg-bg-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <div className="max-w-4xl mx-auto px-4 pt-10 pb-12 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-6 text-sm">
          <Link href={`/${locale}/baby-names/${prevSlug}`} className="text-gold-primary hover:text-gold-light transition-colors">← {prevName}</Link>
          <Link href={`/${locale}/baby-names`} className="text-text-secondary hover:text-gold-light transition-colors">{isHi ? 'सभी नक्षत्र' : 'All Nakshatras'}</Link>
          <Link href={`/${locale}/baby-names/${nextSlug}`} className="text-gold-primary hover:text-gold-light transition-colors">{nextName} →</Link>
        </nav>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? `${nakName} नक्षत्र — शिशु नाम` : `${nakName} Nakshatra — Baby Names`}
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          {isHi
            ? `${nakName} (${nak.name.en}) नक्षत्र के स्वामी ${rulerName} हैं। देवता: ${deityName}।`
            : `${nakName} nakshatra is ruled by ${rulerName}. Deity: ${deityName}.`}
        </p>

        {/* Syllable table */}
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 mb-8">
          <h2 className="text-gold-light text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'पद-वार नाम के अक्षर' : 'Starting Syllables by Pada'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {syllables.map((syl, i) => (
              <div key={i} className="rounded-xl bg-bg-secondary/60 border border-gold-primary/10 p-4 text-center">
                <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">{isHi ? `पद ${i + 1}` : `Pada ${i + 1}`}</div>
                <div className="text-3xl font-bold text-gold-light mb-1">{isHi ? syl.hi : syl.en}</div>
                {locale !== 'en' && <div className="text-text-secondary text-xs">{syl.en}</div>}
                {locale === 'en' && syl.hi && <div className="text-text-secondary text-xs">{syl.hi}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Multi-script display */}
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 mb-8">
          <h2 className="text-gold-light text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'अन्य लिपियों में अक्षर' : 'Syllables in Other Scripts'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/12">
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">{isHi ? 'पद' : 'Pada'}</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">English</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">हिन्दी</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">தமிழ்</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">తెలుగు</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">বাংলা</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">ಕನ್ನಡ</th>
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">ગુજરાતી</th>
                </tr>
              </thead>
              <tbody>
                {syllables.map((syl, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-2 px-3 text-text-secondary">{i + 1}</td>
                    <td className="py-2 px-3 text-gold-light font-semibold">{syl.en}</td>
                    <td className="py-2 px-3 text-text-primary">{syl.hi}</td>
                    <td className="py-2 px-3 text-text-primary">{syl.ta}</td>
                    <td className="py-2 px-3 text-text-primary">{syl.te}</td>
                    <td className="py-2 px-3 text-text-primary">{syl.bn}</td>
                    <td className="py-2 px-3 text-text-primary">{syl.kn}</td>
                    <td className="py-2 px-3 text-text-primary">{syl.gu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Educational content */}
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? `${nakName} नक्षत्र में जन्मे बच्चे का नाम कैसे चुनें?` : `How to Choose a Name for ${nakName} Nakshatra?`}
          </h2>
          <p>
            {isHi
              ? `वैदिक परम्परा के अनुसार, बच्चे का नाम जन्म नक्षत्र के पद के अनुसार रखा जाता है। ${nakName} नक्षत्र में जन्मे बच्चे का नाम ऊपर दिए गए अक्षरों से शुरू होना चाहिए। नाम का पहला अक्षर बच्चे की जन्म कुण्डली के चन्द्र नक्षत्र पद से निर्धारित होता है।`
              : `According to Vedic tradition, a child's name should begin with the syllable associated with their birth nakshatra pada. For babies born in ${nakName} nakshatra, the first letter of the name is determined by the pada (quarter) of the Moon's nakshatra at the time of birth. This practice, called Namakarana, aligns the child's name with their cosmic vibration.`}
          </p>
          <p>
            {isHi
              ? `सही अक्षर जानने के लिए आपको बच्चे की जन्म तिथि, समय और स्थान की आवश्यकता होती है। इससे चन्द्र नक्षत्र और पद की सटीक गणना की जा सकती है। हमारा कुण्डली टूल यह गणना स्वचालित रूप से करता है।`
              : `To determine the exact syllable, you need the child's birth date, time, and location — this allows precise calculation of the Moon's nakshatra and pada. Our Kundali tool computes this automatically.`}
          </p>
        </div>

        {/* Cross-links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label="Related pages">
          <Link href="/baby-names" className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'नक्षत्र नाम खोजक' : 'Nakshatra Name Finder'}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/kundali" className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'कुण्डली बनाएँ' : 'Generate Kundali'}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/panchang/nakshatra/${nakId}`} className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? `${nakName} विस्तार` : `${nakName} Details`}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/learn/nakshatra-pada/${slug}-pada-1`} className="text-gold-primary/70 hover:text-gold-light transition-colors">{isHi ? 'पद विश्लेषण' : 'Pada Analysis'}</Link>
        </nav>
      </div>
    </main>
  );
}

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
import { pickBabyLabel, formatBabyLabel } from '@/lib/content/baby-names-labels';

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

/**
 * Per-locale metadata templates. Each locale gets a native-script
 * title + description; missing locales fall back to en. Title shape
 * mirrors the original isHi branch but extended to all 9 locales.
 */
const METADATA: Record<string, { title: (n: string, s: string) => string; description: (n: string, s: string) => string }> = {
  en: {
    title: (n, s) => `${n} Nakshatra Baby Names — Starting Syllables & Letters | Dekho Panchang`,
    description: (n, s) => `Baby names for ${n} nakshatra should start with ${s}. Starting syllables for all 4 padas with meanings and name suggestions.`,
  },
  hi: {
    title: (n) => `${n} नक्षत्र बेबी नेम — शिशु के नाम के अक्षर | देखो पंचांग`,
    description: (n, s) => `${n} नक्षत्र में जन्मे बच्चे के नाम ${s} अक्षरों से शुरू होने चाहिए। चारों पदों के अक्षर, अर्थ और सुझाए गए नाम।`,
  },
  mai: {
    title: (n) => `${n} नक्षत्रक शिशु नाम — पदक प्रारम्भिक अक्षर | देखो पंचांग`,
    description: (n, s) => `${n} नक्षत्रमे जन्म लेल बच्चाक नाम ${s} अक्षरसँ शुरू होइ। चारो पादक अक्षर, अर्थ आ सुझाएल नाम।`,
  },
  mr: {
    title: (n) => `${n} नक्षत्र बाळ नावे — सुरुवातीचे अक्षर | देखो पंचांग`,
    description: (n, s) => `${n} नक्षत्रात जन्मलेल्या बाळाच्या नावाची सुरुवात ${s} अक्षरांनी झाली पाहिजे. चारही पदांचे अक्षर, अर्थ आणि सुचवलेली नावे.`,
  },
  ta: {
    title: (n) => `${n} நட்சத்திர குழந்தை பெயர்கள் — ஆரம்ப எழுத்துக்கள் | தேக்கோ பஞ்சாங்கம்`,
    description: (n, s) => `${n} நட்சத்திரத்தில் பிறந்த குழந்தைகளுக்கான பெயர்கள் ${s} எழுத்துக்களில் தொடங்க வேண்டும். நான்கு பாதங்களின் எழுத்துக்கள், அர்த்தம் மற்றும் பெயர் பரிந்துரைகள்.`,
  },
  te: {
    title: (n) => `${n} నక్షత్రం శిశు పేర్లు — ప్రారంభ అక్షరాలు | చూడు పంచాంగం`,
    description: (n, s) => `${n} నక్షత్రంలో జన్మించిన పిల్లల పేర్లు ${s} అక్షరాలతో ప్రారంభం కావాలి. నాలుగు పదముల అక్షరాలు, అర్థాలు మరియు సూచించిన పేర్లు.`,
  },
  kn: {
    title: (n) => `${n} ನಕ್ಷತ್ರ ಶಿಶು ಹೆಸರುಗಳು — ಪ್ರಾರಂಭಿಕ ಅಕ್ಷರಗಳು | ದೇಖೋ ಪಂಚಾಂಗ`,
    description: (n, s) => `${n} ನಕ್ಷತ್ರದಲ್ಲಿ ಜನಿಸಿದ ಶಿಶುಗಳ ಹೆಸರು ${s} ಅಕ್ಷರಗಳಿಂದ ಪ್ರಾರಂಭವಾಗಬೇಕು. ನಾಲ್ಕು ಪಾದಗಳ ಅಕ್ಷರಗಳು, ಅರ್ಥ ಮತ್ತು ಸೂಚಿಸಲಾದ ಹೆಸರುಗಳು.`,
  },
  gu: {
    title: (n) => `${n} નક્ષત્ર બાળ નામ — પ્રારંભિક અક્ષરો | દેખો પંચાંગ`,
    description: (n, s) => `${n} નક્ષત્રમાં જન્મેલા બાળકના નામ ${s} અક્ષરોથી શરૂ થવા જોઈએ. ચારે પાદના અક્ષરો, અર્થ અને સૂચવેલા નામો.`,
  },
  bn: {
    title: (n) => `${n} নক্ষত্র শিশুর নাম — প্রারম্ভিক অক্ষর | দেখো পঞ্জিকা`,
    description: (n, s) => `${n} নক্ষত্রে জন্ম নেওয়া শিশুর নাম ${s} অক্ষর দিয়ে শুরু হওয়া উচিত। চারটি পদের অক্ষর, অর্থ এবং প্রস্তাবিত নাম।`,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; nakshatra: string }> }): Promise<Metadata> {
  const { locale, nakshatra: slug } = await params;
  setRequestLocale(locale);
  const nakId = SLUG_TO_ID[slug];
  if (!nakId) return { title: 'Baby Names — Dekho Panchang' };

  const nak = NAKSHATRAS[nakId - 1];
  const nakName = tl(nak.name, locale);
  const route = `/baby-names/${slug}`;
  const isIndexable = isLocaleIndexable(route, locale);
  const url = buildCanonicalUrl(route, locale);

  const syllables = NAKSHATRA_SYLLABLES[nakId] ?? [];
  // Use the locale-specific syllables for the description when available,
  // falling back to EN. The metadata-helper signature takes (name, syllableList).
  const syllableList = syllables
    .map((s) => (s as Record<string, string | undefined>)[locale] ?? s.en)
    .join(', ');

  const meta = METADATA[locale] ?? METADATA.en;
  const title = meta.title(nakName, syllableList);
  const description = meta.description(nakName, syllableList);

  return {
    title,
    description,
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
  void isHi;
  const syllables = NAKSHATRA_SYLLABLES[nakId] ?? [];
  const rulerName = tl(nak.rulerName, locale);
  const deityName = tl(nak.deity, locale);

  // Per-locale syllable display: prefer the current locale's script,
  // fall back to en for unsupported locales (defensive — every locale
  // is populated in NAKSHATRA_SYLLABLES today).
  const sylFor = (s: typeof syllables[number]): string =>
    (s as Record<string, string | undefined>)[locale] ?? s.en ?? '';
  const sylEn = (s: typeof syllables[number]): string => s.en ?? '';

  // Adjacent nakshatras for navigation
  const prevId = nakId > 1 ? nakId - 1 : 27;
  const nextId = nakId < 27 ? nakId + 1 : 1;
  const prevSlug = ALL_SLUGS[prevId - 1];
  const nextSlug = ALL_SLUGS[nextId - 1];
  const prevName = tl(NAKSHATRAS[prevId - 1].name, locale);
  const nextName = tl(NAKSHATRAS[nextId - 1].name, locale);

  // FAQ for schema (locale-aware Q&A so the schema reflects user's locale)
  const syllableListLocale = syllables.map(sylFor).join(', ');
  const syllableListEn = syllables.map(sylEn).join(', ');
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: locale === 'en'
          ? `What letter should ${nakName} nakshatra baby names start with?`
          : formatBabyLabel('howToChoose', locale, { NAK: nakName }),
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'en'
            ? `${nakName} nakshatra has 4 padas with starting syllables: ${syllableListEn}. Names beginning with these sounds are considered auspicious.`
            : `${nakName} ${pickBabyLabel('nakshatraSuffix', locale) || 'nakshatra'} — ${syllableListLocale}.`,
        },
      },
      {
        '@type': 'Question',
        name: locale === 'en'
          ? `Which planet rules ${nakName} nakshatra?`
          : `${nakName} — ${rulerName}`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'en'
            ? `${nakName} nakshatra is ruled by ${rulerName}.`
            : formatBabyLabel('detailDeityLine', locale, { NAK: nakName, NAK_EN: nak.name.en, RULER: rulerName, DEITY: deityName }),
        },
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
          <Link href={`/${locale}/baby-names`} className="text-text-secondary hover:text-gold-light transition-colors">{pickBabyLabel('allNakshatras', locale)}</Link>
          <Link href={`/${locale}/baby-names/${nextSlug}`} className="text-gold-primary hover:text-gold-light transition-colors">{nextName} →</Link>
        </nav>

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en'
            ? `${nakName} Nakshatra — Baby Names`
            : `${nakName} ${pickBabyLabel('detailHeroSuffix', locale)}`}
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          {locale === 'en'
            ? `${nakName} nakshatra is ruled by ${rulerName}. Deity: ${deityName}.`
            : formatBabyLabel('detailDeityLine', locale, { NAK: nakName, NAK_EN: nak.name.en, RULER: rulerName, DEITY: deityName })}
        </p>

        {/* Syllable table */}
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 mb-8">
          <h2 className="text-gold-light text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {pickBabyLabel('padaSyllables', locale)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {syllables.map((syl, i) => (
              <div key={i} className="rounded-xl bg-bg-secondary/60 border border-gold-primary/10 p-4 text-center">
                <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">{pickBabyLabel('pada', locale)} {i + 1}</div>
                <div className="text-3xl font-bold text-gold-light mb-1">{sylFor(syl)}</div>
                {locale !== 'en' && sylEn(syl) && <div className="text-text-secondary text-xs">{sylEn(syl)}</div>}
                {locale === 'en' && syl.hi && <div className="text-text-secondary text-xs">{syl.hi}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Multi-script display */}
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 mb-8">
          <h2 className="text-gold-light text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {pickBabyLabel('otherScripts', locale)}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/12">
                  <th className="text-left py-2 px-3 text-gold-light text-xs font-semibold">{pickBabyLabel('pada', locale)}</th>
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
            {formatBabyLabel('howToChoose', locale, { NAK: nakName })}
          </h2>
          <p>
            {formatBabyLabel('detailEdu1', locale, { NAK: nakName })}
          </p>
          <p>
            {pickBabyLabel('detailEdu2', locale)}
          </p>
        </div>

        {/* Cross-links */}
        <nav className="flex flex-wrap gap-2 mt-8 text-xs" aria-label="Related pages">
          <Link href="/baby-names" className="text-gold-primary/70 hover:text-gold-light transition-colors">{pickBabyLabel('nameFinderLink', locale)}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href="/kundali" className="text-gold-primary/70 hover:text-gold-light transition-colors">{pickBabyLabel('generateKundaliLink', locale)}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/panchang/nakshatra/${nakId}`} className="text-gold-primary/70 hover:text-gold-light transition-colors">{nakName} {pickBabyLabel('detailsSuffix', locale)}</Link>
          <span className="text-text-secondary/30">·</span>
          <Link href={`/learn/nakshatra-pada/${slug}-pada-1`} className="text-gold-primary/70 hover:text-gold-light transition-colors">{pickBabyLabel('padaAnalysisLink', locale)}</Link>
        </nav>
      </div>
    </main>
  );
}

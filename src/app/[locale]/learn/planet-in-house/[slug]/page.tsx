import { PLANET_HOUSE_VERSES, type PlanetHouseVerse } from '@/lib/constants/planet-in-house-verses';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Hash, ExternalLink, ChevronRight } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

/* ── Planet metadata ── */
const PLANET_META: Record<number, { en: string; hi: string; slug: string; color: string; bgClass: string; borderClass: string }> = {
  0: { en: 'Sun',     hi: 'सूर्य',  slug: 'sun',     color: '#e67e22', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/25' },
  1: { en: 'Moon',    hi: 'चन्द्र', slug: 'moon',    color: '#94a3b8', bgClass: 'bg-slate-400/10',  borderClass: 'border-slate-400/25' },
  2: { en: 'Mars',    hi: 'मङ्गल',  slug: 'mars',    color: '#ef4444', bgClass: 'bg-red-500/10',    borderClass: 'border-red-500/25' },
  3: { en: 'Mercury', hi: 'बुध',    slug: 'mercury', color: '#22c55e', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/25' },
  4: { en: 'Jupiter', hi: 'गुरु',   slug: 'jupiter', color: '#f59e0b', bgClass: 'bg-amber-500/10',  borderClass: 'border-amber-500/25' },
  5: { en: 'Venus',   hi: 'शुक्र',  slug: 'venus',   color: '#e8e6e3', bgClass: 'bg-white/10',      borderClass: 'border-white/25' },
  6: { en: 'Saturn',  hi: 'शनि',   slug: 'saturn',  color: '#3b82f6', bgClass: 'bg-blue-500/10',   borderClass: 'border-blue-500/25' },
};

const HOUSE_LABELS: Record<number, { en: string; hi: string; suffix: string; signification: string }> = {
  1:  { en: '1st House',  hi: 'प्रथम भाव',    suffix: '1st',  signification: 'Self & Personality' },
  2:  { en: '2nd House',  hi: 'द्वितीय भाव',   suffix: '2nd',  signification: 'Wealth & Speech' },
  3:  { en: '3rd House',  hi: 'तृतीय भाव',    suffix: '3rd',  signification: 'Courage & Siblings' },
  4:  { en: '4th House',  hi: 'चतुर्थ भाव',    suffix: '4th',  signification: 'Home & Mother' },
  5:  { en: '5th House',  hi: 'पंचम भाव',     suffix: '5th',  signification: 'Children & Intellect' },
  6:  { en: '6th House',  hi: 'षष्ठ भाव',     suffix: '6th',  signification: 'Enemies & Disease' },
  7:  { en: '7th House',  hi: 'सप्तम भाव',    suffix: '7th',  signification: 'Marriage & Partnership' },
  8:  { en: '8th House',  hi: 'अष्टम भाव',    suffix: '8th',  signification: 'Longevity & Occult' },
  9:  { en: '9th House',  hi: 'नवम भाव',     suffix: '9th',  signification: 'Fortune & Dharma' },
  10: { en: '10th House', hi: 'दशम भाव',     suffix: '10th', signification: 'Career & Status' },
  11: { en: '11th House', hi: 'एकादश भाव',   suffix: '11th', signification: 'Gains & Desires' },
  12: { en: '12th House', hi: 'द्वादश भाव',    suffix: '12th', signification: 'Loss & Liberation' },
};

/** Build slug from planetId and house number */
function makeSlug(planetId: number, house: number): string {
  const planet = PLANET_META[planetId];
  const h = HOUSE_LABELS[house];
  if (!planet || !h) return '';
  return `${planet.slug}-in-${h.suffix}-house`;
}

/** Parse slug back to planetId + house */
function parseSlug(slug: string): { planetId: number; house: number } | null {
  const match = slug.match(/^(sun|moon|mars|mercury|jupiter|venus|saturn)-in-(\d+)(?:st|nd|rd|th)-house$/);
  if (!match) return null;
  const planetSlug = match[1];
  const house = parseInt(match[2], 10);
  if (house < 1 || house > 12) return null;
  const planetId = Object.entries(PLANET_META).find(([, m]) => m.slug === planetSlug)?.[0];
  if (planetId === undefined) return null;
  return { planetId: Number(planetId), house };
}

/** Generate all 84 slugs x locales for static generation */
export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (let planetId = 0; planetId <= 6; planetId++) {
    for (let house = 1; house <= 12; house++) {
      params.push({ slug: makeSlug(planetId, house) });
    }
  }
  return params;
}

/** Labels object for inline i18n */
const LABELS = {
  classicalVerse: { en: 'Classical Verse', hi: 'शास्त्रीय श्लोक' },
  modernInterpretation: { en: 'Modern Interpretation', hi: 'आधुनिक व्याख्या' },
  viewSource: { en: 'View Classical Source', hi: 'शास्त्रीय स्रोत देखें' },
  keywords: { en: 'Keywords', hi: 'कुंजी शब्द' },
  samePlanet: { en: 'in Other Houses', hi: 'अन्य भावों में' },
  sameHouse: { en: 'Other Planets in the', hi: 'अन्य ग्रह' },
  backToIndex: { en: 'All Planet-in-House Combinations', hi: 'सभी ग्रह-भाव संयोजन' },
  bphsInterpretation: { en: 'BPHS Interpretation', hi: 'बृहत् पाराशर होराशास्त्र व्याख्या' },
  houseSignification: { en: 'House Signification', hi: 'भाव तात्पर्य' },
  breadcrumbLearn: { en: 'Learn', hi: 'सीखें' },
  breadcrumbPiH: { en: 'Planet in House', hi: 'ग्रह भाव में' },
} as const;

export default async function PlanetInHouseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const { planetId, house } = parsed;
  const verse = PLANET_HOUSE_VERSES.find(
    (v) => v.planetId === planetId && v.house === house,
  );
  if (!verse) notFound();

  const planet = PLANET_META[planetId];
  const houseLabel = HOUSE_LABELS[house];
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  const planetName = tl(planet, locale);
  const houseName = tl(houseLabel, locale);

  // ── JSON-LD: Article ──
  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${planet.en} in the ${houseLabel.suffix} House — BPHS Vedic Astrology`,
    description: verse.interpretation.en.slice(0, 160),
    author: { '@type': 'Organization', name: 'Dekho Panchang' },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    mainEntityOfPage: `${BASE_URL}/${locale}/learn/planet-in-house/${slug}`,
    citation: {
      '@type': 'CreativeWork',
      name: 'Brihat Parashara Hora Shastra',
      author: { '@type': 'Person', name: 'Maharishi Parashara' },
    },
    keywords: verse.keywords.join(', '),
  };

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: `${BASE_URL}/${locale}/learn` },
      { '@type': 'ListItem', position: 3, name: 'Planet in House', item: `${BASE_URL}/${locale}/learn/planet-in-house` },
      { '@type': 'ListItem', position: 4, name: `${planet.en} in ${houseLabel.suffix} House` },
    ],
  };

  // Related: same planet, other houses
  const samePlanetVerses = PLANET_HOUSE_VERSES.filter(
    (v) => v.planetId === planetId && v.house !== house,
  );
  // Related: same house, other planets
  const sameHouseVerses = PLANET_HOUSE_VERSES.filter(
    (v) => v.house === house && v.planetId !== planetId,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <article className="space-y-8">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-gold-primary/60">
          <Link href={`/${locale}/learn`} className="hover:text-gold-primary transition-colors">
            {tl(LABELS.breadcrumbLearn, locale)}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${locale}/learn/planet-in-house`} className="hover:text-gold-primary transition-colors">
            {tl(LABELS.breadcrumbPiH, locale)}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gold-primary">{planetName}</span>
        </nav>

        {/* ── Hero ── */}
        <div className="text-center space-y-4">
          {/* Planet color accent bar */}
          <div className="mx-auto w-16 h-1 rounded-full" style={{ backgroundColor: planet.color }} />

          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-light leading-tight"
            style={headingStyle}
          >
            {planetName}{' '}
            <span className="text-text-secondary">
              {tl({ en: 'in the', hi: '' }, locale)}
            </span>{' '}
            {houseName}
          </h1>
          <p className="text-text-secondary text-sm">
            {tl(LABELS.bphsInterpretation, locale)}
          </p>
          {/* House signification badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary text-xs font-medium">
              <Hash className="w-3 h-3" />
              {houseLabel.signification}
            </span>
          </div>
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Classical Verse Card ── */}
        <div className={`rounded-2xl border-2 ${planet.borderClass} ${planet.bgClass} p-5 sm:p-6 space-y-4`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: planet.color }} />
            <h2 className="text-gold-light font-bold text-lg" style={headingStyle}>
              {tl(LABELS.classicalVerse, locale)}
            </h2>
          </div>

          <blockquote
            className="text-text-primary text-base leading-relaxed italic border-l-2 pl-4"
            style={{ borderColor: planet.color, ...(bodyStyle || {}) }}
          >
            {tl(verse.verse, locale)}
          </blockquote>

          {/* Source citation */}
          <div className="flex items-center gap-2 text-xs text-text-secondary/60">
            <ExternalLink className="w-3.5 h-3.5" style={{ color: planet.color }} />
            <span>
              {tl(LABELS.viewSource, locale)}: <span className="font-medium" style={{ color: planet.color }}>{verse.source}</span>
            </span>
          </div>
        </div>

        {/* ── Modern Interpretation ── */}
        <div className="space-y-3">
          <h2 className="text-gold-light font-bold text-lg" style={headingStyle}>
            {tl(LABELS.modernInterpretation, locale)}
          </h2>
          <div className="bg-bg-secondary rounded-xl border border-gold-primary/10 p-5">
            <p
              className="text-text-primary text-base leading-relaxed"
              style={bodyStyle || undefined}
            >
              {tl(verse.interpretation, locale)}
            </p>
          </div>
        </div>

        {/* ── Keywords ── */}
        <div className="space-y-3">
          <h2 className="text-gold-light font-bold text-sm uppercase tracking-wider">
            {tl(LABELS.keywords, locale)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {verse.keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  backgroundColor: planet.color + '15',
                  borderColor: planet.color + '30',
                  color: planet.color,
                }}
              >
                {kw.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Same Planet in Other Houses ── */}
        <div className="space-y-4">
          <h2 className="text-gold-light font-bold text-lg" style={headingStyle}>
            {planetName} {tl(LABELS.samePlanet, locale)}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {samePlanetVerses.map((v) => {
              const hl = HOUSE_LABELS[v.house];
              return (
                <Link
                  key={v.house}
                  href={`/${locale}/learn/planet-in-house/${makeSlug(v.planetId, v.house)}`}
                  className="px-3 py-2.5 rounded-lg border text-center text-sm transition-colors hover:border-gold-primary/40"
                  style={{
                    backgroundColor: planet.color + '08',
                    borderColor: planet.color + '20',
                  }}
                >
                  <span className="block font-bold" style={{ color: planet.color }}>
                    H{v.house}
                  </span>
                  <span className="block text-xs text-text-secondary mt-0.5">
                    {hl.signification.split(' & ')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Other Planets in Same House ── */}
        <div className="space-y-4">
          <h2 className="text-gold-light font-bold text-lg" style={headingStyle}>
            {tl(LABELS.sameHouse, locale)} {houseName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sameHouseVerses.map((v) => {
              const pm = PLANET_META[v.planetId];
              return (
                <Link
                  key={v.planetId}
                  href={`/${locale}/learn/planet-in-house/${makeSlug(v.planetId, v.house)}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors hover:border-gold-primary/40"
                  style={{
                    backgroundColor: pm.color + '08',
                    borderColor: pm.color + '20',
                  }}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: pm.color }}
                  />
                  <span className="text-sm font-medium" style={{ color: pm.color }}>
                    {tl(pm, locale)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gold-primary/15" />

        {/* ── Back to Index ── */}
        <div className="text-center pt-2">
          <Link
            href={`/${locale}/learn/planet-in-house`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-primary text-sm font-medium hover:bg-gold-primary/20 hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {tl(LABELS.backToIndex, locale)}
          </Link>
        </div>
      </article>
    </div>
  );
}

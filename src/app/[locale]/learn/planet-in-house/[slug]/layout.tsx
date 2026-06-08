import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PLANET_HOUSE_VERSES } from '@/lib/constants/planet-in-house-verses-with-overlay';
import { buildHreflangMap } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' },
  1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मङ्गल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
};

const HOUSE_SUFFIXES: Record<number, string> = {
  1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th',
  7: '7th', 8: '8th', 9: '9th', 10: '10th', 11: '11th', 12: '12th',
};

const PLANET_SLUGS: Record<string, number> = {
  sun: 0, moon: 1, mars: 2, mercury: 3, jupiter: 4, venus: 5, saturn: 6,
};

function parseSlug(slug: string): { planetId: number; house: number } | null {
  const match = slug.match(/^(sun|moon|mars|mercury|jupiter|venus|saturn)-in-(\d+)(?:st|nd|rd|th)-house$/);
  if (!match) return null;
  const planetId = PLANET_SLUGS[match[1]];
  const house = parseInt(match[2], 10);
  if (planetId === undefined || house < 1 || house > 12) return null;
  return { planetId, house };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const parsed = parseSlug(slug);

  if (!parsed) {
    return { title: 'Not Found' };
  }

  const { planetId, house } = parsed;
  const planet = PLANET_NAMES[planetId];
  const suffix = HOUSE_SUFFIXES[house];
  if (!planet || !suffix) return { title: 'Not Found' };

  const verse = PLANET_HOUSE_VERSES.find(
    (v) => v.planetId === planetId && v.house === house,
  );

  // `sa` is retired (HTTP 410 via proxy.ts) — never reaches this code
  // path in production. Drop it from the isHi check so a hypothetical
  // bypassed /sa/ request doesn't get a Hindi title. Gemini PR #550
  // cycle-1 HIGH.
  const isHi = locale === 'hi';
  const planetName = isHi ? planet.hi : planet.en;

  const title = isHi
    ? `${planetName} ${suffix} भाव में  –  बृहत् पाराशर होराशास्त्र | Dekho Panchang`
    : `${planetName} in the ${suffix} House  –  BPHS Vedic Astrology | Dekho Panchang`;

  // Locale-aware description — falls through to en for non-en/hi locales
  // not yet in the overlay. As planet-in-house-verses-with-overlay.ts
  // fills the 7 regional locales (PR shipping this), the `verse.interpretation`
  // LocaleText carries the locale's translation; tl() handles fallback
  // for any locale still missing.
  const interp = verse?.interpretation as Record<string, string> | undefined;
  // Belt-and-braces fallback chain: locale → en → generic. Without the
  // generic terminator, an overlay missing both interp[locale] AND
  // interp.en (shouldn't happen given the authored corpus, but defence)
  // produces `undefined.slice()` → runtime TypeError. Gemini PR #550
  // cycle-2 MED.
  const genericFallback =
    `${planet.en} in the ${suffix} house  –  classical verse and modern interpretation from Brihat Parashara Hora Shastra.`;
  const descText = interp
    ? (interp[locale] ?? interp.en ?? genericFallback)
    : genericFallback;
  const description = descText.slice(0, 160);

  const url = `${BASE_URL}/${locale}/learn/planet-in-house/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
    alternates: {
      canonical: url,
      languages: buildHreflangMap(`/learn/planet-in-house/${slug}`),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

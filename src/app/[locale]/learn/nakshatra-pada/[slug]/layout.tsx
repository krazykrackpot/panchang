import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { NAKSHATRA_PADA_PROFILES } from '@/lib/constants/nakshatra-pada-profiles-with-overlay';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import { buildIndexableHreflang } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

const NAK_SLUGS = ['ashwini','bharani','krittika','rohini','mrigashira','ardra','punarvasu','pushya','ashlesha','magha','purva-phalguni','uttara-phalguni','hasta','chitra','swati','vishakha','anuradha','jyeshtha','mula','purva-ashadha','uttara-ashadha','shravana','dhanishta','shatabhisha','purva-bhadrapada','uttara-bhadrapada','revati'];

function parseSlug(slug: string): { nakshatraId: number; pada: number } | null {
  const match = slug.match(/^(.+)-pada-(\d)$/);
  if (!match) return null;
  const nakIdx = NAK_SLUGS.indexOf(match[1]);
  const pada = parseInt(match[2]);
  if (nakIdx < 0 || pada < 1 || pada > 4) return null;
  return { nakshatraId: nakIdx + 1, pada };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const profile = NAKSHATRA_PADA_PROFILES.find(p => p.nakshatraId === parsed.nakshatraId && p.pada === parsed.pada);
  if (!profile) return {};
  const nakData = NAKSHATRAS[parsed.nakshatraId - 1];
  const nakName = tl(nakData?.name, locale) || NAK_SLUGS[parsed.nakshatraId - 1];
  const title = `${nakName} Pada ${parsed.pada}  –  ${profile.syllable} | Vedic Nakshatra Analysis`;
  // Locale-aware description — fans into the overlay-supplied locale
  // strings post-PR shipping this. Fallback to en if a locale-specific
  // personality string is missing.
  const desc = tl(profile.personality, locale).slice(0, 155);
  const route = `/learn/nakshatra-pada/${slug}`;
  return {
    title,
    description: desc,
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      // hreflang now fans out to every visible locale whose overlay is
      // populated (central policy via buildIndexableHreflang); previous
      // map was hardcoded en+hi from the bilingual era.
      languages: buildIndexableHreflang(route),
    },
    openGraph: { title, description: desc, url: `${BASE_URL}/${locale}${route}`, type: 'article' },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

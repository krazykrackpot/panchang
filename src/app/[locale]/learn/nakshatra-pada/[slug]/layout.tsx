import type { Metadata } from 'next';
import { NAKSHATRA_PADA_PROFILES } from '@/lib/constants/nakshatra-pada-profiles';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

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
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const profile = NAKSHATRA_PADA_PROFILES.find(p => p.nakshatraId === parsed.nakshatraId && p.pada === parsed.pada);
  if (!profile) return {};
  const nakData = NAKSHATRAS[parsed.nakshatraId - 1];
  const nakName = tl(nakData?.name, locale) || NAK_SLUGS[parsed.nakshatraId - 1];
  const title = `${nakName} Pada ${parsed.pada} — ${profile.syllable} | Vedic Nakshatra Analysis`;
  const desc = profile.personality.en.slice(0, 155);
  const route = `/learn/nakshatra-pada/${slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE_URL}/${locale}${route}`, languages: { en: `${BASE_URL}/en${route}`, hi: `${BASE_URL}/hi${route}`, 'x-default': `${BASE_URL}/en${route}` } },
    openGraph: { title, description: desc, url: `${BASE_URL}/${locale}${route}`, type: 'article' },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

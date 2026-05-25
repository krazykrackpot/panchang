import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'Planetary Transit Calendar 2026';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle('/transits', locale, 'Planetary Transits 2026'),
    tagline: 'GOCHAR CALENDAR',
    footer: 'Jupiter · Saturn · Rahu-Ketu · Daily transits',
  });
}

import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'KP Transits — Live Ruling Planets';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle('/kp/transits', locale, 'KP Transits'),
    tagline: 'LIVE RP TRACKER',
    footer: '7 ruling planets · Refreshes every minute',
  });
}

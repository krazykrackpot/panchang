import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = 'KP Prashna — Krishnamurti Horary Astrology';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle('/kp/prashna', locale, 'KP Prashna'),
    tagline: 'HORARY VERDICT',
    footer: 'Number or text · Cuspal sub-lord of 11th house',
  });
}

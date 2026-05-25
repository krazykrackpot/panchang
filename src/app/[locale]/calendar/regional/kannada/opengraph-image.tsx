import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Kannada Panchanga 2026";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/calendar/regional/kannada", locale, "Kannada Panchanga 2026"),
    tagline: "KANNADA PANCHANGA",
    footer: "Ugadi · Festivals · Muhurtas · Lunar months",
  });
}

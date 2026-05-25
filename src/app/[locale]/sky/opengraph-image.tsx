import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Live Sky — Real-time Planetary Positions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/sky", locale, "Live Sky View"),
    tagline: "LIVE SKY",
    footer: "Real-time graha positions · Signs · Nakshatras",
  });
}

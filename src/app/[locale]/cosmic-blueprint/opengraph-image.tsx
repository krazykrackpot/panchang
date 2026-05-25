import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Cosmic Blueprint — Your Celestial Signature";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/cosmic-blueprint", locale, "Cosmic Blueprint"),
    tagline: "CELESTIAL SIGNATURE",
    footer: "Sun · Moon · Lagna · Dasha lord · Life-domain scores",
  });
}

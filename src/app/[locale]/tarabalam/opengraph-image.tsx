import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Tarabalam — Star Strength Calculator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/tarabalam", locale, "Tarabalam"),
    tagline: "STAR STRENGTH",
    footer: "27-nakshatra Tara cycle · 9 Tara phases",
  });
}

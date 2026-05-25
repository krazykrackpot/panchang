import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Chandrabalam — Moon Strength Calculator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/chandrabalam", locale, "Chandrabalam"),
    tagline: "MOON STRENGTH",
    footer: "12-sign Moon transit · Daily Chandrabala for your Rashi",
  });
}

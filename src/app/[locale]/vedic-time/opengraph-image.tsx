import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Vedic Time — Ghati Pala Vipala";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/vedic-time", locale, "Vedic Time Converter"),
    tagline: "ANCIENT TIME UNITS",
    footer: "Ghati · Pala · Vipala · Muhurta · Prahara",
  });
}

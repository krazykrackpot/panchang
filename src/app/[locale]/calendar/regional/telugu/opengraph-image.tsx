import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Telugu Panchangam 2026";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/calendar/regional/telugu", locale, "Telugu Panchangam 2026"),
    tagline: "TELUGU PANCHANGAM",
    footer: "Ugadi · Bhogi · Sankranti · Festivals",
  });
}

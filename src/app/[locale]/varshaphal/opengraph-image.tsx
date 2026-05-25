import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Varshaphal — Solar Return Annual Chart";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/varshaphal", locale, "Varshaphal — Annual Forecast"),
    tagline: "TAJIKA SOLAR RETURN",
    footer: "Muntha · Sahams · Mudda Dasha",
  });
}

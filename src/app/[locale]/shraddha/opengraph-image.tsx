import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Shraddha — Ancestral Tithi Calculator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/shraddha", locale, "Shraddha Calculator"),
    tagline: "ANCESTRAL TITHI",
    footer: "Death tithi · Annual Shraddha date · Pitru Paksha",
  });
}

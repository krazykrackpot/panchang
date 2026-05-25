import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Ashtamangala Prashna — Kerala Horary";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/prashna-ashtamangala", locale, "Ashtamangala Prashna"),
    tagline: "KERALA HORARY",
    footer: "8 ritual signs · 12 houses · Classical method",
  });
}

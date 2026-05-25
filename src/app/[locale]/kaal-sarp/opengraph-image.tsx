import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Kaal Sarpa Dosha — Rahu-Ketu Axis Analysis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/kaal-sarp", locale, "Kaal Sarpa Dosha"),
    tagline: "RAHU–KETU AXIS",
    footer: "12 serpent formations · Cancellation conditions",
  });
}

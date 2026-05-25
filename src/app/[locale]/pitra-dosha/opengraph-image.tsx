import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Pitra Dosha — Ancestral Karma Analysis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/pitra-dosha", locale, "Pitra Dosha"),
    tagline: "ANCESTRAL KARMA",
    footer: "Detection · Shraddha rites · Remedies",
  });
}

import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Mangal Dosha — Mars Affliction Check";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/mangal-dosha", locale, "Mangal Dosha Check"),
    tagline: "MANGLIK CHECK",
    footer: "Severity · Cancellation · Remedies",
  });
}

import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Mithila Panchang 2026";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/calendar/regional/mithila", locale, "Mithila Panchang 2026"),
    tagline: "MITHILA PANCHANG",
    footer: "Maithili festivals · Sama Chakeva · Chhath",
  });
}

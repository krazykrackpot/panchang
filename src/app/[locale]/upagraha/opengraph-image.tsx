import { renderOgImage, resolveOgTitle, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/seo/og-template';

export const runtime = 'edge';
export const alt = "Upagraha — Shadow Planet Sphutas";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage({
    title: resolveOgTitle("/upagraha", locale, "Upagraha Calculator"),
    tagline: "SHADOW PLANETS",
    footer: "Mandi · Gulika · Dhuma · Vyatipata",
  });
}

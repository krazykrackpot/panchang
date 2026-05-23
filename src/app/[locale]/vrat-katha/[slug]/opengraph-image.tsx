import { renderDekhoOG } from '@/lib/og/dekho-og';

export const runtime = 'edge';
export const alt = 'Vrat Katha — Sacred Story & Puja Vidhi | Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function titleCase(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const name = titleCase(slug);
  return renderDekhoOG({
    eyebrow: 'Vrat Katha',
    titleLines: [name, 'Vrat Katha'],
    subtitle: 'The sacred story, puja vidhi, and significance — read in your language.',
  });
}

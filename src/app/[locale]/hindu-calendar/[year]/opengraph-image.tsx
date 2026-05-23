import { renderDekhoOG } from '@/lib/og/dekho-og';

export const runtime = 'edge';
export const alt = 'Hindu Calendar — Vrat, Festivals, Vikram Samvat | Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ locale: string; year: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { year } = await params;
  const yearStr = year || new Date().getFullYear().toString();
  return renderDekhoOG({
    eyebrow: 'Hindu Calendar',
    titleLines: [`Hindu Calendar ${yearStr}`, `Vikram Samvat ${parseInt(yearStr, 10) + 57}`],
    subtitle: 'All vrats, festivals, masa, sankrantis — 12 lunar months, location-aware timings.',
  });
}

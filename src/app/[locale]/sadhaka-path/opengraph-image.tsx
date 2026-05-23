import { renderDekhoOG } from '@/lib/og/dekho-og';

export const runtime = 'edge';
export const alt = 'Sadhaka Path — Gamified Vedic Astrology Learning | Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderDekhoOG({
    eyebrow: 'Sadhaka Path',
    titleLines: ['Become a Sadhaka', 'in Vedic Astrology'],
    subtitle: 'Daily streaks, level portraits, badges — your Jyotish learning, structured and tracked.',
  });
}

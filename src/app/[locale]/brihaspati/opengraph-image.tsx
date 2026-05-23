import { renderDekhoOG } from '@/lib/og/dekho-og';

export const runtime = 'edge';
export const alt = 'Ask Brihaspati — AI Vedic Astrologer | Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderDekhoOG({
    eyebrow: 'AI Vedic Astrologer',
    titleLines: ['Ask Brihaspati'],
    subtitle: 'Personal Jyotish answers grounded in your chart — every reading cites the rule it applies.',
  });
}

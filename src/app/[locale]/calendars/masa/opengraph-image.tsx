import { renderDekhoOG } from '@/lib/og/dekho-og';

export const runtime = 'edge';
export const alt = 'Hindu Months (Masa) 2026 — Amanta & Purnimanta Calendar | Dekho Panchang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderDekhoOG({
    eyebrow: 'Hindu Months · 2026',
    titleLines: ['Chaitra to Phalguna', '12 Lunar Months'],
    subtitle: 'Amanta + Purnimanta conventions. Adhika Masa marked. Deity, festivals, exact start/end times.',
  });
}

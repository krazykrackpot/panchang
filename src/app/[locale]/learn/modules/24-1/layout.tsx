import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ganda Mula Nakshatras — Effects, Significance & Remedies | Dekho Panchang',
  description: 'Learn about the 6 Ganda Mula Nakshatras in Vedic astrology — Ashwini, Ashlesha, Magha, Jyeshtha, Moola, Revati. Understand their effects on family members, critical padas, and specific upayas (remedies) including Shanti Puja, Beej Mantras, and donations.',
  keywords: ['ganda mula', 'mula nakshatra', 'ashwini', 'ashlesha', 'magha', 'jyeshtha', 'moola', 'revati', 'vedic astrology', 'nakshatra dosha', 'shanti puja', 'remedies'],
};

export default function GandaMulaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

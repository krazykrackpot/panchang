import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = tl(
    {
      en: 'Life Events — Dekho Panchang',
      hi: 'जीवन घटनाएं — देखो पंचांग',
      sa: 'जीवन-घटनाः — देखो पंचांग',
      ta: 'வாழ்க்கை நிகழ்வுகள் — தேக்கோ பஞ்சாங்கம்',
      bn: 'জীবন ঘটনা — দেখো পঞ্চাঙ্গ',
    },
    locale,
  );

  const description = tl(
    {
      en: 'Record major life events and see the planetary alignments at the time of each event.',
      hi: 'प्रमुख जीवन घटनाओं को दर्ज करें और प्रत्येक घटना के समय की ग्रहीय स्थितियाँ देखें।',
      sa: 'प्रमुखाः जीवन-घटनाः अभिलिखयतु तत्समये च ग्रहस्थितिं पश्यतु।',
      ta: 'முக்கிய வாழ்க்கை நிகழ்வுகளை பதிவு செய்து, ஒவ்வொரு நிகழ்வின் போதும் கோளங்களின் நிலைகளை காணுங்கள்.',
      bn: 'প্রধান জীবন ঘটনা রেকর্ড করুন এবং প্রতিটি ঘটনার সময় গ্রহীয় অবস্থান দেখুন।',
    },
    locale,
  );

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard/life-events`,
    },
  };
}

export default function LifeEventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

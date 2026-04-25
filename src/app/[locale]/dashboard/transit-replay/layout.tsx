import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'Transit Replay — Dekho Panchang',
    hi: 'गोचर रिप्ले — देखो पंचांग',
    ta: 'கோசார ரீப்ளே — தேக்கோ பஞ்சாங்கம்',
    bn: 'গোচর রিপ্লে — দেখো পঞ্চাং',
  };
  const descs: Record<string, string> = {
    en: 'See the exact planetary positions on any date and how they aspect your natal chart.',
    hi: 'किसी भी तिथि पर ग्रहों की सटीक स्थिति और आपकी जन्म कुण्डली पर उनका प्रभाव देखें।',
    ta: 'எந்த தேதியிலும் கோளங்களின் சரியான நிலையை கண்டு உங்கள் ஜாதகத்துடன் எவ்வாறு தொடர்புடையதென்று அறிவீர்கள்.',
    bn: 'যেকোনো তারিখে গ্রহদের সঠিক অবস্থান এবং আপনার জন্মকুণ্ডলীতে তাদের প্রভাব দেখুন।',
  };
  const title = titles[locale] ?? titles.en;
  const description = descs[locale] ?? descs.en;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${BASE_URL}/${locale}/dashboard/transit-replay`,
      languages: {
        en: `${BASE_URL}/en/dashboard/transit-replay`,
        hi: `${BASE_URL}/hi/dashboard/transit-replay`,
        ta: `${BASE_URL}/ta/dashboard/transit-replay`,
        bn: `${BASE_URL}/bn/dashboard/transit-replay`,
      },
    },
  };
}

export default function TransitReplayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

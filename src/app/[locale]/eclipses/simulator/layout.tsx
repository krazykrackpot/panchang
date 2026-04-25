import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'Eclipse Simulator — Interactive Solar & Lunar Eclipse Visualizer',
    hi: 'ग्रहण अनुकर्त्ता — सूर्य एवं चन्द्र ग्रहण दृश्य प्रदर्शन',
    ta: 'கிரகண உருவகப்படுத்தி — சூரிய மற்றும் சந்திர கிரகண காட்சி',
    bn: 'গ্রহণ সিমুলেটর — সূর্য ও চন্দ্রগ্রহণের দৃশ্য প্রদর্শন',
  };

  const descriptions: Record<string, string> = {
    en: 'Interactive Canvas 2D simulation of solar and lunar eclipses. Understand the geometry of Rahu-Ketu nodes and how Earth\'s shadow creates the Blood Moon.',
    hi: 'सूर्य और चन्द्र ग्रहण का इंटरैक्टिव अनुकरण। राहु-केतु नोड्स की ज्यामिति और पृथ्वी की छाया से रक्तिम चन्द्र का निर्माण समझें।',
    ta: 'சூரிய மற்றும் சந்திர கிரகணங்களின் ஊடாடும் உருவகப்படுத்தல். ராகு-கேது நோட்கள் மற்றும் ரத்த நில சந்திரன் உருவாவதை புரிந்துகொள்ளுங்கள்.',
    bn: 'সূর্য ও চন্দ্রগ্রহণের ইন্টারেক্টিভ সিমুলেশন। রাহু-কেতু নোড এবং পৃথিবীর ছায়ায় রক্তচাঁদ তৈরির জ্যামিতি বুঝুন।',
  };

  const title = titles[locale] || titles.en;
  const description = descriptions[locale] || descriptions.en;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `/${locale}/eclipses/simulator`,
      languages: {
        en: '/en/eclipses/simulator',
        hi: '/hi/eclipses/simulator',
        ta: '/ta/eclipses/simulator',
        bn: '/bn/eclipses/simulator',
      },
    },
  };
}

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}

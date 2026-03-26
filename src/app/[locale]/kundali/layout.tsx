import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jyotishpanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'Kundali Generator — Vedic Birth Chart & Tippanni',
    hi: 'कुण्डली जनक — वैदिक जन्म कुण्डली एवं टिप्पणी',
    sa: 'कुण्डली जनकम् — वैदिकं जन्मपत्रम् टिप्पणी च',
  };
  const descriptions: Record<string, string> = {
    en: 'Generate your Vedic birth chart (Kundali) with planetary positions, Dasha periods, Shadbala, Ashtakavarga, and detailed interpretive Tippanni commentary.',
    hi: 'अपनी वैदिक जन्म कुण्डली बनाएं — ग्रह स्थिति, दशा, षड्बल, अष्टकवर्ग, और विस्तृत टिप्पणी।',
    sa: 'वैदिकं जन्मपत्रं रचयतु — ग्रहस्थितयः, दशाकालाः, षड्बलम्, अष्टकवर्गः, टिप्पणी च।',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${BASE_URL}/${locale}/kundali`,
    },
  };
}

export default function KundaliLayout({ children }: { children: React.ReactNode }) {
  return children;
}

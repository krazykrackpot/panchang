import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Live Sky Map — Current Sidereal Planetary Positions',
    description:
      'Real-time polar sky map showing all 9 Vedic grahas at their current sidereal positions (Lahiri ayanamsha). Includes rashi, nakshatra, retrograde status and daily speed.',
  },
  hi: {
    title: 'लाइव आकाश मानचित्र — वर्तमान ग्रह स्थितियाँ',
    description:
      'लाहिरी अयनांश के साथ सभी 9 वैदिक ग्रहों की वर्तमान पाक्षिक स्थिति दर्शाने वाला रियल-टाइम आकाश मानचित्र।',
  },
  ta: {
    title: 'நேரடி வானவியல் வரைபடம் — தற்போதைய கிரக நிலைகள்',
    description:
      'லாஹிரி அயனாம்சத்துடன் அனைத்து 9 வேத கிரகங்களின் தற்போதைய நாக்ஷத்ர நிலைகளை காட்டும் நேர்நேர வான வரைபடம்.',
  },
  bn: {
    title: 'লাইভ আকাশ মানচিত্র — বর্তমান গ্রহ অবস্থান',
    description:
      'লাহিরি অয়নাংশ সহ সমস্ত ৯টি বৈদিক গ্রহের বর্তমান নক্ষত্র অবস্থান দেখানো রিয়েল-টাইম আকাশ মানচিত্র।',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;

  const locales = ['en', 'hi', 'ta', 'bn'];
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}/sky`;
  }

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/sky`,
      languages,
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE_URL}/${locale}/sky`,
      siteName: 'Dekho Panchang',
      type: 'website',
    },
  };
}

export default function SkyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jyotishpanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'Kundali Matching — Ashta Kuta Gun Milan',
    hi: 'कुण्डली मिलान — अष्टकूट गुण मिलान',
    sa: 'कुण्डलीमेलनम् — अष्टकूटगुणमेलनम्',
  };
  const descriptions: Record<string, string> = {
    en: 'Check horoscope compatibility with Ashta Kuta (36 Gunas) matching system — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi.',
    hi: 'अष्टकूट (36 गुण) प्रणाली से कुण्डली मिलान — वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाडी।',
    sa: 'अष्टकूटप्रणालया कुण्डलीमेलनम् — वर्णः, वश्यम्, तारा, योनिः, ग्रहमैत्री, गणः, भकूटम्, नाडी।',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${BASE_URL}/${locale}/matching`,
    },
  };
}

export default function MatchingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

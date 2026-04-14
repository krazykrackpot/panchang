import { tl } from '@/lib/utils/trilingual';
import type { Metadata } from 'next';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHi = isDevanagariLocale(locale);
  const title = tl({ en: 'Classical Jyotish Library — Free Texts & Downloads | Dekho Panchang', hi: 'शास्त्रीय ज्योतिष ग्रन्थालय — निःशुल्क ग्रन्थ | देखो पंचांग', sa: 'शास्त्रीय ज्योतिष ग्रन्थालय — निःशुल्क ग्रन्थ | देखो पंचांग' }, locale);
  const description = tl({ en: 'Curated collection of classical Vedic astrology and astronomy texts — Parashara, Varahamihira, Jaimini, Surya Siddhanta and more. Free to read and download via archive.org.', hi: 'प्राचीन वैदिक ज्योतिष एवं खगोलशास्त्र ग्रन्थों का संकलन — पराशर, वराहमिहिर, जैमिनी, सूर्य सिद्धान्त आदि। archive.org से निःशुल्क पठन एवं डाउनलोड।', sa: 'प्राचीन वैदिक ज्योतिष एवं खगोलशास्त्र ग्रन्थों का संकलन — पराशर, वराहमिहिर, जैमिनी, सूर्य सिद्धान्त आदि। archive.org से निःशुल्क पठन एवं डाउनलोड।' }, locale);
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/library`,
      languages: {
        en: `${BASE_URL}/en/learn/library`,
        hi: `${BASE_URL}/hi/learn/library`,
        sa: `${BASE_URL}/sa/learn/library`,
        'x-default': `${BASE_URL}/en/learn/library`,
      },
    },
    openGraph: { title, description },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

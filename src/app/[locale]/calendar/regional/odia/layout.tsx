import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

const META = {
  title: {
    en: 'Odia Calendar (ଓଡ଼ିଆ ପଞ୍ଜି) 2026-2027 — Festivals, Rath Yatra Dates',
    hi: 'ओड़िआ कैलेंडर (ଓଡ଼ିଆ ପଞ୍ଜି) 2026-2027 — त्योहार, रथ यात्रा तिथियां',
  },
  description: {
    en: 'Complete Odia Panji 2026-2027: 12 solar months from Baisakha to Chaitra, Rath Yatra (Jun 29), Raja Parba, Pana Sankranti (Odia New Year), Kumar Purnima, Manabasa Gurubar. Surya Siddhanta calendar for 50M+ Odia speakers.',
    hi: 'सम्पूर्ण ओड़िआ पंजी 2026-2027: बैशाख से चैत्र तक 12 सौर मास, रथ यात्रा (29 जून), रज पर्व, पना संक्रान्ति (ओड़िआ नव वर्ष), कुमार पूर्णिमा, मानबसा गुरुबार।',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === 'hi';
  return {
    title: isHi ? META.title.hi : META.title.en,
    description: isHi ? META.description.hi : META.description.en,
    keywords: ['odia calendar', 'odia panji', 'rath yatra 2026', 'raja parba', 'pana sankranti', 'odia festivals', 'odia months', 'ଓଡ଼ିଆ ପଞ୍ଜି', 'ରଥଯାତ୍ରା', 'odisha calendar'],
    alternates: {
      canonical: `/${locale}/calendar/regional/odia`,
      languages: {
        en: '/en/calendar/regional/odia',
        hi: '/hi/calendar/regional/odia',
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dekhopanchang.com' },
              { '@type': 'ListItem', position: 2, name: 'Calendar', item: 'https://dekhopanchang.com/en/calendar' },
              { '@type': 'ListItem', position: 3, name: 'Regional', item: 'https://dekhopanchang.com/en/calendar/regional' },
              { '@type': 'ListItem', position: 4, name: 'Odia Calendar (Panji)' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}

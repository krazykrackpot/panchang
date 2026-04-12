import { generateDailyArticle } from '@/lib/horoscope/daily-article';
import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';
  return {
    title: isHi ? 'दैनिक पंचांग लेख — देखो पंचांग' : 'Daily Panchang Articles — Dekho Panchang',
    description: isHi
      ? 'प्रतिदिन का वैदिक पंचांग विश्लेषण — तिथि, नक्षत्र, योग, शुभ-अशुभ काल और मार्गदर्शन।'
      : 'Daily Vedic panchang analysis — tithi, nakshatra, yoga, auspicious/inauspicious windows, and guidance.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily`,
      languages: { en: `${BASE_URL}/en/daily`, hi: `${BASE_URL}/hi/daily` },
    },
  };
}

export default async function DailyIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isHi = locale === 'hi';

  // Generate articles for last 7 days + today
  const today = new Date();
  const articles = [];
  for (let i = 0; i < 8; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    articles.push(generateDailyArticle(d));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
          {isHi ? 'दैनिक पंचांग' : 'Daily Panchang'}
        </p>
        <h1 className="text-3xl font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दैनिक पंचांग लेख' : 'Daily Panchang Articles'}
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          {isHi ? 'प्रतिदिन का वैदिक पंचांग विश्लेषण और मार्गदर्शन' : 'Daily Vedic panchang analysis and guidance'}
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/${locale}/daily/${article.date}`}
            className={`block rounded-xl p-5 border transition-colors ${
              i === 0
                ? 'bg-gold-primary/10 border-gold-primary/30 hover:bg-gold-primary/15'
                : 'bg-[#111633]/50 border-gold-primary/10 hover:border-gold-primary/25'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-gold-light font-bold text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
                  {isHi ? article.title.hi : article.title.en}
                </h2>
                <p className="text-text-secondary text-xs mt-1 line-clamp-2">
                  {isHi ? article.description.hi : article.description.en}
                </p>
              </div>
              {i === 0 && (
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gold-primary/20 text-gold-light flex-shrink-0">
                  {isHi ? 'आज' : 'Today'}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

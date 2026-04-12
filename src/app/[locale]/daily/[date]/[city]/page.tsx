import { generateDailyArticle, type ArticleCityConfig } from '@/lib/horoscope/daily-article';
import { getCityBySlug } from '@/lib/constants/cities';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

const DAILY_CITIES = ['mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'varanasi'];

function parseDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  if (Math.abs(d.getFullYear() - now.getFullYear()) > 1) return null;
  return d;
}

export default async function CityDailyPanchangArticle({ params }: { params: Promise<{ locale: string; date: string; city: string }> }) {
  const { locale, date, city } = await params;
  const parsed = parseDate(date);
  if (!parsed) notFound();

  const cityData = getCityBySlug(city);
  if (!cityData) notFound();

  const cityConfig: ArticleCityConfig = {
    name: cityData.name.en,
    nameHi: cityData.name.hi,
    lat: cityData.lat,
    lng: cityData.lng,
    timezone: cityData.timezone,
  };

  const article = generateDailyArticle(parsed, cityConfig);
  const loc = (locale === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
  const isHi = loc === 'hi';
  const body = article.body[loc];
  const title = article.title[loc];
  const cityName = isHi ? cityData.name.hi : cityData.name.en;

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: article.description[loc],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/apple-touch-icon.png` } },
    mainEntityOfPage: `${BASE_URL}/${locale}/daily/${date}/${city}`,
    inLanguage: locale,
    contentLocation: {
      '@type': 'Place',
      name: cityData.name.en,
      geo: { '@type': 'GeoCoordinates', latitude: cityData.lat, longitude: cityData.lng },
    },
  };

  // Other cities (exclude current city)
  const otherCities = DAILY_CITIES.filter(s => s !== city);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLD) }} />

      <article className="prose prose-invert prose-gold max-w-none">
        <div className="text-center mb-8">
          <p className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
            {isHi ? `${cityData.name.hi} दैनिक पंचांग` : `${cityData.name.en} Daily Panchang`}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gold-light leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h1>
          <p className="text-text-secondary text-sm mt-3">{article.description[loc]}</p>
          <time className="text-text-secondary/60 text-xs mt-1 block" dateTime={article.publishedAt}>
            {parsed.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>

        <div className="border-t border-gold-primary/15 my-6" />

        {/* Render markdown-ish body as HTML sections */}
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {body.split('\n').map((line, i) => {
            if (line.startsWith('### ')) return <h3 key={i} className="text-gold-light font-bold text-lg mt-6 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{line.slice(4)}</h3>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-gold-primary text-xs uppercase tracking-widest font-bold mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith('- **')) return <div key={i} className="flex gap-2"><span className="text-gold-dark">&#9670;</span><span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-light">$1</strong>') }} /></div>;
            if (line.startsWith('**')) return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-light">$1</strong>') }} />;
            if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-text-secondary/60 text-xs italic mt-4" dangerouslySetInnerHTML={{ __html: line.slice(1, -1).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gold-primary hover:text-gold-light">$1</a>') }} />;
            if (line.trim() === '') return null;
            return <p key={i}>{line}</p>;
          })}
        </div>

        <div className="border-t border-gold-primary/15 my-8" />

        {/* CTA */}
        <div className="text-center space-y-3">
          <Link href={`/${locale}/daily/${date}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-bold text-sm hover:bg-gold-primary/25 transition-colors">
            {isHi ? 'दिल्ली (डिफ़ॉल्ट) पंचांग देखें' : 'View Default (Delhi) Panchang'}
          </Link>
          <br />
          <Link href={`/${locale}/panchang`} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-gold-primary text-sm hover:text-gold-light transition-colors">
            {isHi ? 'अपने स्थान का पंचांग देखें' : 'View Panchang for Your Location'}
          </Link>
        </div>

        {/* Other city links */}
        {otherCities.length > 0 && (
          <div className="mt-12">
            <h2 className="text-gold-light font-bold text-lg mb-4 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              {isHi ? 'अन्य शहरों का पंचांग' : 'Panchang for Other Cities'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {otherCities.map(slug => {
                const cd = getCityBySlug(slug);
                if (!cd) return null;
                const cn = isHi ? cd.name.hi : cd.name.en;
                return (
                  <Link
                    key={slug}
                    href={`/${locale}/daily/${date}/${slug}`}
                    className="px-3 py-2 rounded-lg bg-bg-secondary border border-gold-primary/15 text-text-secondary text-sm text-center hover:text-gold-light hover:border-gold-primary/30 transition-colors"
                  >
                    {cn}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

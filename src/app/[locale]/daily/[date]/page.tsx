import { generateDailyArticle } from '@/lib/horoscope/daily-article';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tl } from '@/lib/utils/trilingual';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; date: string }> }): Promise<Metadata> {
  const { locale, date } = await params;
  const parsed = parseDate(date);
  if (!parsed) return {};
  const article = generateDailyArticle(parsed);
  const loc = locale as 'en' | 'hi';
  const title = article.title[loc] || article.title.en;
  const description = article.description[loc] || article.description.en;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily/${date}`,
      languages: {
        en: `${BASE_URL}/en/daily/${date}`,
        hi: `${BASE_URL}/hi/daily/${date}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['Dekho Panchang'],
      tags: ['panchang', 'vedic astrology', 'daily horoscope', 'tithi', 'nakshatra'],
    },
  };
}

function parseDate(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  if (isNaN(d.getTime())) return null;
  // Only allow dates within reasonable range (current year ± 1)
  const now = new Date();
  if (Math.abs(d.getFullYear() - now.getFullYear()) > 1) return null;
  return d;
}

export default async function DailyPanchangArticle({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date } = await params;
  const parsed = parseDate(date);
  if (!parsed) notFound();

  const article = generateDailyArticle(parsed);
  const loc = (locale === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
  const isHi = loc === 'hi';
  const body = article.body[loc];
  const title = article.title[loc];

  // JSON-LD Article structured data
  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: article.description[loc],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/apple-touch-icon.png` } },
    mainEntityOfPage: `${BASE_URL}/${locale}/daily/${date}`,
    inLanguage: locale,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLD) }} />

      <article className="prose prose-invert prose-gold max-w-none">
        <div className="text-center mb-8">
          <p className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
            {isHi ? 'दैनिक पंचांग' : 'Daily Panchang'}
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
        <div className="text-center">
          <a href={`/${locale}/panchang`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-bold text-sm hover:bg-gold-primary/25 transition-colors">
            {isHi ? 'अपने स्थान का पंचांग देखें' : 'View Panchang for Your Location'}
          </a>
        </div>
      </article>
    </div>
  );
}

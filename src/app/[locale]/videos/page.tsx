import { getAllVideos } from '@/lib/youtube/latest-video';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const videos = await getAllVideos();
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1
        className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2 text-center"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {isHi ? 'वीडियो — देखो पंचांग' : 'Videos — Dekho Panchang'}
      </h1>
      <p className="text-text-secondary text-center mb-10">
        {isHi ? 'वैदिक ज्योतिष, पंचांग और आध्यात्मिक ज्ञान' : 'Vedic astrology, daily panchang, and spiritual knowledge'}
      </p>

      <div className="space-y-10">
        {videos.map((v) => (
          <article key={v.videoId} className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden">
            {/* Video embed — primary content (required for Google "watch page" recognition) */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${v.videoId}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <h2 className="text-gold-light text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                {v.title}
              </h2>
              <time className="text-text-secondary text-xs" dateTime={v.published}>
                {new Date(v.published).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
            </div>

            {/* VideoObject JSON-LD — one per video, on a page where video is primary content */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: safeJsonLd({
                  '@context': 'https://schema.org',
                  '@type': 'VideoObject',
                  name: v.title,
                  description: v.title,
                  thumbnailUrl: v.thumbnail,
                  uploadDate: v.published,
                  contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
                  embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
                  duration: v.title.includes('Shorts') || v.title.includes('#Shorts') ? 'PT60S' : 'PT180S',
                  publisher: {
                    '@type': 'Organization',
                    name: 'Dekho Panchang',
                    logo: { '@type': 'ImageObject', url: 'https://dekhopanchang.com/icon-512.png' },
                  },
                }),
              }}
            />
          </article>
        ))}
      </div>

      {videos.length === 0 && (
        <p className="text-text-secondary text-center py-20">
          {isHi ? 'वीडियो लोड नहीं हो सके' : 'No videos available'}
        </p>
      )}
    </main>
  );
}

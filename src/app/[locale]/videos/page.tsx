import { setRequestLocale } from 'next-intl/server';
import { getAllVideos } from '@/lib/youtube/latest-video';
import { pickByScript } from "@/lib/utils/locale-fonts";

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const videos = await getAllVideos();
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1
        className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2 text-center"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {isHi ? 'वीडियो  –  देखो पंचांग' : 'Videos  –  Dekho Panchang'}
      </h1>
      <p className="text-text-secondary text-center mb-10">
        {isHi ? 'वैदिक ज्योतिष, पंचांग और आध्यात्मिक ज्ञान' : 'Vedic astrology, daily panchang, and spiritual knowledge'}
      </p>

      <div className="space-y-10">
        {videos.map((v) => (
          <article key={v.videoId} className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden">
            {/* Video embed  –  primary content (required for Google "watch page" recognition) */}
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
                {new Date(v.published).toLocaleDateString(pickByScript('en-GB', 'hi-IN', locale), {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </time>
            </div>

            {/* VideoObject JSON-LD removed — gallery page with multiple videos is not a "watch page".
                Google requires one video per page as primary content. Videos are indexed on YouTube. */}
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

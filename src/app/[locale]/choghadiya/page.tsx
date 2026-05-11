import ChoghadiyaClient from './Client';

export const revalidate = 86400;

export default async function ChoghadiyaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const today = new Date().toISOString().slice(0, 10);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* SSR shell: H1 + description for Google indexing */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-2 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `आज का चौघड़िया — ${today}` : `Choghadiya Today — ${today}`}
        </h1>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'आज के दिन और रात के चौघड़िया समय — शुभ, लाभ, अमृत, चर, रोग, काल, उद्वेग। अपने शहर के अनुसार सटीक समय देखें।'
            : 'Today\'s day and night Choghadiya timings — Shubh, Labh, Amrit, Char, Rog, Kaal, Udveg. View accurate slot times based on your city\'s sunrise and sunset.'}
        </p>
      </div>

      {/* Client island: interactive city selector, day/night slots, educational content */}
      <ChoghadiyaClient />
    </main>
  );
}

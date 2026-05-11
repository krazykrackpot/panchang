import RahuKaalClient from './Client';

export const revalidate = 86400;

export default async function RahuKaalPage({ params }: { params: Promise<{ locale: string }> }) {
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
          {isHi ? `आज का राहु काल — ${today}` : `Rahu Kaal Today — ${today}`}
        </h1>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'आज का राहु काल, यमगण्ड और गुलिक काल का सटीक समय। अपना शहर चुनें और अशुभ समय से बचें। सभी समय स्थानीय सूर्योदय/सूर्यास्त से गणना किए जाते हैं।'
            : 'Accurate Rahu Kaal, Yamaganda & Gulika Kaal timings for today. Select your city and avoid inauspicious periods. All times are calculated from local sunrise and sunset.'}
        </p>
      </div>

      {/* Client island: interactive city selector, timeline, countdown */}
      <RahuKaalClient />
    </main>
  );
}

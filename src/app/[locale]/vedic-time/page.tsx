import VedicTimeClient from './Client';

export const revalidate = 86400;

export default async function VedicTimePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const today = new Date().toISOString().slice(0, 10);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* SSR shell: H1 + description for Google indexing */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-2 sm:px-6 lg:px-8">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `वैदिक समय — ${today}` : `Vedic Time — ${today}`}
        </h1>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl mx-auto text-center leading-relaxed">
          {isHi
            ? 'प्राचीन भारतीय समय पद्धति — घटी, पल, विपल। वैदिक दिन सूर्योदय से प्रारम्भ होता है और 30 मुहूर्तों, 8 प्रहरों में विभाजित होता है। अपने स्थान का वर्तमान वैदिक समय देखें।'
            : 'The ancient Indian time system — Ghati, Pala, Vipala. The Vedic day begins at sunrise and is divided into 30 Muhurtas and 8 Praharas. View the current Vedic time for your location.'}
        </p>
      </div>

      {/* Client island: live clock, gauges, prahar/muhurta display */}
      <VedicTimeClient />
    </main>
  );
}

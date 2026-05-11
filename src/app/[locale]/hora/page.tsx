import HoraClient from './Client';

export const revalidate = 86400;

export default async function HoraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const today = new Date().toISOString().slice(0, 10);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* SSR shell: H1 + description for Google indexing */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-2 sm:px-6">
        <h1
          suppressHydrationWarning
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `होरा — ग्रह घण्टे — ${today}` : `Hora — Planetary Hours — ${today}`}
        </h1>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'आज के ग्रह होरा का पूर्ण कार्यक्रम। दिन का प्रत्येक घंटा एक ग्रह द्वारा शासित है — अपने कार्यों के लिए सही होरा चुनें।'
            : 'Today\'s complete planetary hora schedule. Each hour of the day is ruled by a planet in the Chaldean sequence — choose the right hora for your activities.'}
        </p>
      </div>

      {/* Client island: interactive hora timeline, current hora, best-for table */}
      <HoraClient />
    </main>
  );
}

import UpagrahaClient from './Client';

export const revalidate = 86400;

export default async function UpagrahaPage({ params }: { params: Promise<{ locale: string }> }) {
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
          {isHi ? `उपग्रह — छाया ग्रह — ${today}` : `Upagraha — Shadow Planets — ${today}`}
        </h1>

        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed">
          {isHi
            ? 'धूम, व्यतीपात, परिवेश, इन्द्रचाप और उपकेतु — पाँच उपग्रहों की वर्तमान स्थिति और उनका आपकी कुण्डली पर प्रभाव। ये सूर्य की स्थिति से गणना किए जाते हैं।'
            : 'Current positions and chart effects of the five Upagrahas — Dhuma, Vyatipata, Parivesha, Indrachapa, and Upaketu. These shadow sub-planets are calculated from the Sun\'s longitude.'}
        </p>
      </div>

      {/* Client island: interactive upagraha cards, chart positions */}
      <UpagrahaClient />
    </main>
  );
}

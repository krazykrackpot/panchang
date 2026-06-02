import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { RASHIS } from '@/lib/constants/rashis';
import { HubClient } from './HubClient';
import type { LocaleText } from '@/types/panchang';
import { pickByScript } from '@/lib/utils/locale-fonts';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}

export default async function HoroscopePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const today = new Date().toISOString().slice(0, 10);

  // FAQ schema lives on the hub PAGE (not the layout) so it only
  // appears here and not on every nested /horoscope/{rashi}/... route.
  // Moving from layout → page closes the GSC "Duplicate field
  // 'FAQPage'" issue affecting 859 dated horoscope URLs.
  const faqLD = generateFAQLD('/horoscope', locale);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary">
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        {/* SSR: H1 with today's date  –  Google indexes this */}
        <h1 suppressHydrationWarning className="text-3xl sm:text-4xl font-bold text-gold-light text-center">
          {pickByScript(`Daily Horoscope  –  ${today}`, `दैनिक राशिफल  –  ${today}`, locale)}
        </h1>

        {/* SSR: Intro paragraph  –  indexable content explaining methodology */}
        <p className="text-text-secondary text-sm text-center mt-4 max-w-2xl mx-auto leading-relaxed">
          {pickByScript(
            'Today\'s horoscope for all 12 zodiac signs based on real Vedic planetary transits. Select your Moon sign to see your daily forecast. Each prediction is computed from actual planetary positions  –  not generic content.',
            'वास्तविक वैदिक ग्रह गोचर पर आधारित सभी 12 राशियों का आज का राशिफल। अपनी चन्द्र राशि चुनें और आज का फल देखें। प्रत्येक राशिफल वास्तविक ग्रहों की स्थिति से गणना किया जाता है  –  सामान्य भविष्यवाणी नहीं।',
            locale,
          )}
        </p>

        {/* SSR: Philosophical context  –  Siddhantic foundation */}
        <p className="text-text-secondary text-sm text-center mt-3 max-w-2xl mx-auto leading-relaxed">
          {pickByScript(
            'Your Vedic horoscope is computed from the actual sidereal positions of the nine grahas — not seasonal approximations. The daily forecast is driven by real planetary transits computed using algorithms from the Surya Siddhanta, verified against modern ephemeris data. This is Siddhantic Jyotish — mathematical astronomy — applied to daily life guidance.',
            'आपका वैदिक राशिफल नवग्रहों की वास्तविक नाक्षत्रिक स्थितियों से गणना किया जाता है — मौसमी अनुमानों से नहीं। दैनिक फल वास्तविक ग्रह गोचर द्वारा संचालित है, जिनकी गणना सूर्य सिद्धान्त के एल्गोरिदम से होती है और जो आधुनिक पंचांग डेटा से सत्यापित हैं। यह सिद्धान्तिक ज्योतिष है — गणितीय खगोल विज्ञान — जो दैनिक जीवन मार्गदर्शन पर लागू किया गया है।',
            locale,
          )}
        </p>

        {/* SSR: All 12 rashi links  –  Google follows these to every rashi page */}
        <nav
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-8"
          aria-label="Zodiac signs"
        >
          {RASHIS.map(r => (
            <Link
              key={r.id}
              href={`/${locale}/horoscope/${r.slug}`}
              className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 hover:border-gold-primary/40 transition-colors"
            >
              <span className="text-2xl" role="img" aria-label={tl(r.name, 'en')}>
                {r.symbol}
              </span>
              <span className="text-xs text-gold-light font-medium text-center">
                {tl(r.name, locale)}
              </span>
              {locale !== 'en' && (
                <span className="text-[10px] text-text-secondary">
                  {tl(r.name, 'en')}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Client island: person switcher, cosmic weather, interactive TarotCard grid, result panel */}
      <HubClient locale={locale} />

      {/* Editorial prose — SSR'd into HTML, indexed by Google. Sprint 10 §D8. */}
      <section className="max-w-3xl mx-auto px-4 pb-16 space-y-6 text-text-secondary text-sm leading-relaxed">
        <h2 className="text-2xl font-bold text-gold-light pt-8" style={{ fontFamily: 'var(--font-heading)' }}>
          {pickByScript('How Vedic Horoscope Differs from Western', 'वैदिक राशिफल पाश्चात्य से कैसे भिन्न है', locale)}
        </h2>
        <p>
          {pickByScript(
            'Most online horoscopes use the tropical zodiac — the Sun-sign system inherited from Hellenistic astrology, anchored to the spring equinox. Vedic Jyotish uses the sidereal (Nirayana) zodiac, anchored to the actual fixed stars. Because of precession (a slow wobble in Earth\'s axis), the two systems drift apart by roughly one degree every 72 years. The current offset — the ayanamsha — is around 24°, large enough that almost a third of Western Sun-sign readers belong to the previous Vedic Rashi.',
            'अधिकांश ऑनलाइन राशिफल सायन (पाश्चात्य) राशि-व्यवस्था का प्रयोग करते हैं — हेलेनिस्टिक ज्योतिष से वंशागत सूर्य-राशि प्रणाली, वसन्त विषुव पर आधारित। वैदिक ज्योतिष निरयण (नक्षत्र-स्थिर) राशि-व्यवस्था का प्रयोग करता है, जो वास्तविक स्थिर तारों पर केन्द्रित है। पृथ्वी की अक्ष के अयन-चलन (precession) के कारण, दोनों प्रणालियाँ प्रति 72 वर्ष में लगभग एक डिग्री विचलित हो जाती हैं। वर्तमान अयनांश लगभग 24° है — इतना कि लगभग एक-तिहाई पाश्चात्य सूर्य-राशि पाठकों की वैदिक राशि पिछली राशि होती है।',
            locale,
          )}
        </p>
        <p>
          {pickByScript(
            'In Jyotish the Moon, not the Sun, is the primary reference. Your "Rashi" in a Vedic context is the sign occupied by the Moon at birth (Janma Rashi). It changes roughly every 2.25 days, governs emotional rhythm, and is the basis for predictive systems like Vimshottari Dasha, Sade Sati, and Chandra Ashtama. To find yours, use the ',
            'ज्योतिष में चन्द्रमा प्रमुख सन्दर्भ है, सूर्य नहीं। वैदिक सन्दर्भ में आपकी "राशि" वह राशि है जिसमें जन्म-समय पर चन्द्रमा था (जन्म राशि)। यह लगभग प्रति 2.25 दिन बदलती है, भावनात्मक लय का संचालन करती है, और विम्शोत्तरी दशा, साढ़े साती, तथा चन्द्र अष्टम जैसी पूर्वानुमान प्रणालियों का आधार है। अपनी राशि जानने के लिए ',
            locale,
          )}
          <Link href={`/${locale}/sign-calculator`} className="text-gold-light hover:underline">
            {pickByScript('Vedic Sign Calculator', 'वैदिक राशि कैल्कुलेटर', locale)}
          </Link>
          {pickByScript(' or compare both systems on the ', ' प्रयोग करें या ', locale)}
          <Link href={`/${locale}/tropical-compare`} className="text-gold-light hover:underline">
            {pickByScript('Sidereal vs Tropical', 'निरायन बनाम सायन', locale)}
          </Link>
          {pickByScript(' page.', ' पृष्ठ पर दोनों प्रणालियों की तुलना करें।', locale)}
        </p>
        <p>
          {pickByScript(
            'Every reading on this page is generated from real planetary positions at the moment of request — not pre-written text rotated by month. We compute the live transit of all nine grahas (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, Ketu), check their aspects to your Janma Rashi, and apply the classical Phaladeepika rules for daily prediction. To see today\'s sky in detail, visit ',
            'इस पृष्ठ का प्रत्येक फल अनुरोध के क्षण की वास्तविक ग्रह-स्थिति से बनाया गया है — पहले से लिखे मासिक रोटेशन से नहीं। हम नवग्रहों (सूर्य, चन्द्र, बुध, शुक्र, मंगल, बृहस्पति, शनि, राहु, केतु) के गोचर की गणना करते हैं, आपकी जन्म राशि पर उनके दृष्टि-सम्बन्ध जाँचते हैं, और दैनिक फल के लिए शास्त्रीय फलदीपिका नियम लागू करते हैं। आज के आकाश का विस्तृत विवरण देखने के लिए ',
            locale,
          )}
          <Link href={`/${locale}/panchang`} className="text-gold-light hover:underline">
            {pickByScript("today's Panchang", 'आज का पंचांग', locale)}
          </Link>
          {pickByScript(' or the ', ' या ', locale)}
          <Link href={`/${locale}/transits`} className="text-gold-light hover:underline">
            {pickByScript('Transit Tracker', 'गोचर ट्रैकर', locale)}
          </Link>
          {pickByScript('.', ' देखें।', locale)}
        </p>
        <p>
          {pickByScript(
            'For a deeper personal reading, generate your full ',
            'अधिक गहन व्यक्तिगत फल के लिए, अपनी पूर्ण ',
            locale,
          )}
          <Link href={`/${locale}/kundali`} className="text-gold-light hover:underline">
            {pickByScript('birth chart (Kundali)', 'जन्म कुण्डली', locale)}
          </Link>
          {pickByScript(
            ' — the daily horoscope only uses your Moon sign, but the full Kundali reads all nine grahas, twelve houses, and your active Dasha period. To learn the underlying system, browse the ',
            ' बनाएँ — दैनिक राशिफल केवल आपकी चन्द्र राशि का उपयोग करता है, परन्तु पूर्ण कुण्डली नवों ग्रहों, बारह भावों, एवं आपकी सक्रिय दशा-अवधि को पढ़ती है। मूलभूत प्रणाली सीखने के लिए ',
            locale,
          )}
          <Link href={`/${locale}/learn/grahas`} className="text-gold-light hover:underline">
            {pickByScript('Grahas curriculum', 'ग्रह पाठ्यक्रम', locale)}
          </Link>
          {pickByScript(' or the ', ' या ', locale)}
          <Link href={`/${locale}/learn/dashas`} className="text-gold-light hover:underline">
            {pickByScript('Dasha module', 'दशा मॉड्यूल', locale)}
          </Link>
          {pickByScript('.', ' पढ़ें।', locale)}
        </p>
      </section>
    </main>
  );
}

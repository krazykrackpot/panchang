import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import ShraddhaClient from './Client';

export const revalidate = 86400;

export default async function ShraddhaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <>
      {/* ── Server-rendered SEO content ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {isHi ? (<>
            <h2 className="text-gold-light text-xl font-bold">श्राद्ध क्या है?</h2>
            <p>श्राद्ध (संस्कृत: श्रद्धा से, अर्थात् विश्वास और भक्ति) हिन्दू धर्म का पवित्र अनुष्ठान है जिसमें दिवंगत पूर्वजों (पितरों) को भोजन, जल और प्रार्थना अर्पित की जाती है। यह केवल एक अनुष्ठान नहीं, बल्कि कृतज्ञता का कर्म है &mdash; मान्यता है कि सही तिथि पर श्राद्ध करने से दिवंगत आत्मा को शांति मिलती है और परिवार को पितरों का आशीर्वाद प्राप्त होता है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">श्राद्ध में तिथि का महत्व</h3>
            <p>श्राद्ध की तिथि ग्रेगोरियन कैलेंडर पर नहीं, बल्कि हिन्दू चन्द्र पंचांग की तिथि पर आधारित होती है। जिस चन्द्र तिथि पर व्यक्ति का निधन हुआ, प्रतिवर्ष उसी तिथि पर श्राद्ध किया जाता है। चूँकि चन्द्र मास ग्रेगोरियन मास से भिन्न होता है, इसलिए श्राद्ध की तारीख हर वर्ष बदलती रहती है। यही कारण है कि श्राद्ध तिथि गणक (कैलकुलेटर) की आवश्यकता होती है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">पितृ पक्ष &mdash; वार्षिक पितृ काल</h3>
            <p>पितृ पक्ष भाद्रपद मास (सितम्बर-अक्टूबर) में पूर्णिमा से अमावस्या तक 16 दिन का काल है। इस अवधि में ऐसा माना जाता है कि पितृ लोक और भू-लोक के बीच की सीमा सबसे पतली होती है, जिससे पूर्वजों तक अर्पण सबसे प्रभावी ढंग से पहुँचता है। पितृ पक्ष 2026 के अनुमानित तिथि: 22 सितम्बर &ndash; 6 अक्टूबर 2026 (कृष्ण पक्ष, भाद्रपद/आश्विन)।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">श्राद्ध विधि (संक्षेप में)</h3>
            <p>पारम्परिक श्राद्ध में विशेष भोजन (खीर, चावल, दाल, काले तिल) पकाना, पूर्वजों को अर्पित करना, ब्राह्मणों या जरूरतमंदों को भोजन कराना, और मन्त्र पाठ शामिल है। यदि विस्तृत अनुष्ठान सम्भव न हो, तो सच्चे हृदय से जल का तर्पण (जल अर्पण) भी सार्थक माना जाता है। श्राद्ध दोपहर (कुतप काल) में करना सर्वोत्तम है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">किस तिथि पर श्राद्ध करें?</h3>
            <p>प्रतिपदा (1) से अमावस्या (30) तक &mdash; जिस तिथि पर पूर्वज का निधन हुआ, उसी तिथि पर। यदि मृत्यु तिथि ज्ञात न हो, तो सर्वपितृ अमावस्या (पितृ पक्ष की अन्तिम तिथि) पर सभी पूर्वजों का श्राद्ध किया जा सकता है। नीचे दिए गए गणक में मृत्यु तिथि और पक्ष चुनें &mdash; हम आपको इस वर्ष और अगले वर्ष की ग्रेगोरियन तारीख बता देंगे।</p>
          </>) : (<>
            <h2 className="text-gold-light text-xl font-bold">What is Shraddha?</h2>
            <p>Shraddha (from Sanskrit <em>shraddha</em>, meaning faith and devotion) is the sacred Hindu ceremony of honouring departed ancestors (Pitru). It involves offering food, water, and prayers to the deceased on the anniversary of their passing &mdash; calculated by the Hindu lunar calendar, not the Gregorian date. The belief is that performing Shraddha on the correct tithi allows the offerings to reach the departed soul, bringing them peace and earning blessings for the living family.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">Why Tithis Matter for Shraddha</h3>
            <p>The Shraddha date follows the lunar tithi (phase of the Moon) on which the person passed away, not the Western calendar date. Since the lunar month does not align with the Gregorian month, the Shraddha date shifts every year. For example, if someone passed on Krishna Panchami (the 5th tithi of the dark fortnight), their annual Shraddha falls on every recurring Krishna Panchami &mdash; which could land on different Gregorian dates each year. This is why a Shraddha tithi calculator is essential for families.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">Pitru Paksha &mdash; The Annual Ancestor Period</h3>
            <p>Pitru Paksha is the 16-day period from Purnima to Amavasya in Bhadrapada month (September&ndash;October). During this time, the boundary between the ancestral realm and the earthly realm is believed to be at its thinnest, making Shraddha rituals especially powerful. <strong>Pitru Paksha 2026</strong> is estimated to fall around 22 September &ndash; 6 October 2026 (Krishna Paksha of Bhadrapada/Ashwina). Each of the 16 days corresponds to a specific tithi, and families perform Shraddha on the day matching their ancestor&apos;s death tithi.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">How to Perform Shraddha</h3>
            <p>Traditional Shraddha involves cooking specific foods (kheer/rice pudding, plain rice, dal, black sesame), offering them to ancestors, feeding Brahmins or those in need, and chanting mantras. The ideal time is during Kutapa Kaal (midday, approximately 11:36 AM to 12:24 PM local time). If an elaborate ritual is not possible, even a simple tarpana (water offering with black sesame) performed with sincere remembrance is considered meaningful and effective.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">Which Tithi Should You Choose?</h3>
            <p>From Pratipada (1st) to Amavasya (30th) &mdash; select the tithi on which the ancestor passed away. If the death tithi is unknown, Sarva Pitru Amavasya (the final day of Pitru Paksha) is the universal date when Shraddha can be performed for all ancestors regardless of their death tithi. Use the calculator below: select the death paksha and tithi, and we will compute this year&apos;s and next year&apos;s Gregorian dates for you.</p>
          </>)}

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/calendar`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'त्योहार कैलेंडर \u2192' : 'Festival Calendar \u2192'}</Link>
            <Link href={`/${locale}/panchang`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'आज का पंचांग \u2192' : "Today\u2019s Panchang \u2192"}</Link>
            <Link href={`/${locale}/learn/tithis`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'तिथियों के बारे में जानें \u2192' : 'Learn about Tithis \u2192'}</Link>
          </div>
        </article>
      </section>

      {/* ── Interactive client component ── */}
      <ShraddhaClient />
    </>
  );
}

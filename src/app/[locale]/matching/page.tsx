import Link from 'next/link';
import MatchingClient from './Client';

export const revalidate = 86400;

export default async function MatchingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  const KUTAS = [
    { name: 'Varna', nameHi: 'वर्ण', pts: 1, desc: 'Spiritual compatibility and ego levels. Based on the caste/class nature of each Moon sign (Brahmin, Kshatriya, Vaishya, Shudra). Full point when the groom\u2019s Varna is equal or higher.', descHi: 'आध्यात्मिक अनुकूलता और अहंकार स्तर। चन्द्र राशि के वर्ण (ब्राह्मण, क्षत्रिय, वैश्य, शूद्र) पर आधारित। वर का वर्ण समान या ऊपर हो तो पूर्ण अंक।' },
    { name: 'Vashya', nameHi: 'वश्य', pts: 2, desc: 'Mutual attraction and influence between partners. Determines who holds more sway in the relationship. Categories include Chatushpada (quadruped), Manava (human), Jalachara (aquatic), Vanachara (wild), and Keeta (insect).', descHi: 'परस्पर आकर्षण और प्रभाव। सम्बन्ध में कौन अधिक प्रभावशाली रहेगा, यह निर्धारित करता है।' },
    { name: 'Tara', nameHi: 'तारा', pts: 3, desc: 'Birth star harmony and general fortune of the couple together. Computed from the count between the two nakshatras modulo 9. If the remainder falls in an auspicious tara (1, 2, 4, 6, 8), full points are given.', descHi: 'जन्म नक्षत्र सामंजस्य और दम्पति का सामान्य भाग्य। दो नक्षत्रों के बीच की गिनती 9 से विभाजित कर शेष से निर्धारित।' },
    { name: 'Yoni', nameHi: 'योनि', pts: 4, desc: 'Physical and sexual compatibility. Each nakshatra is assigned an animal symbol (horse, elephant, deer, serpent, etc.) and gender. Matching animals score highest; enemy pairs (e.g. snake\u2013mongoose) score zero.', descHi: 'शारीरिक और यौन अनुकूलता। प्रत्येक नक्षत्र को एक पशु प्रतीक (अश्व, गज, मृग, सर्प आदि) और लिंग दिया जाता है।' },
    { name: 'Graha Maitri', nameHi: 'ग्रह मैत्री', pts: 5, desc: 'Mental wavelength and intellectual compatibility. Based on the friendship between the lords of each person\u2019s Moon sign. If both sign lords are friends, full 5 points. Neutral gets partial points. Enemies score low.', descHi: 'मानसिक तालमेल और बौद्धिक अनुकूलता। प्रत्येक व्यक्ति की चन्द्र राशि के स्वामी ग्रहों की मैत्री पर आधारित।' },
    { name: 'Gana', nameHi: 'गण', pts: 6, desc: 'Temperament and nature match. Three ganas: Deva (gentle, spiritual), Manushya (balanced, worldly), Rakshasa (intense, independent). Same gana = best match. Deva\u2013Rakshasa pairing can cause friction.', descHi: 'स्वभाव और प्रकृति मिलान। तीन गण: देव (सौम्य), मनुष्य (संतुलित), राक्षस (तीव्र)। समान गण = सर्वोत्तम।' },
    { name: 'Bhakut', nameHi: 'भकूट', pts: 7, desc: 'Overall prosperity, health, and happiness of the married life. Determined by the relative position of both Moon signs. Certain combinations (2\u201312, 6\u20138, 5\u20139) are considered inauspicious and score 0, though cancellation rules exist.', descHi: 'विवाहित जीवन की समग्र समृद्धि, स्वास्थ्य और सुख। दोनों चन्द्र राशियों की सापेक्ष स्थिति से निर्धारित। 2-12, 6-8, 5-9 संयोग अशुभ माने जाते हैं।' },
    { name: 'Nadi', nameHi: 'नाड़ी', pts: 8, desc: 'Health and genetic compatibility \u2014 the single most important kuta with 8 points. Three nadis: Aadi (Vata), Madhya (Pitta), Antya (Kapha). If both partners have the same Nadi, it is a serious dosha (Nadi Dosha) scoring 0, with potential health implications for offspring.', descHi: 'स्वास्थ्य और आनुवंशिक अनुकूलता \u2014 8 अंकों का सबसे महत्वपूर्ण कूट। तीन नाड़ी: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाड़ी = गम्भीर दोष।' },
  ];

  return (
    <>
      {/* ── Server-rendered SEO content ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {isHi ? (<>
            <h2 className="text-gold-light text-xl font-bold">अष्ट कूट गुण मिलान क्या है?</h2>
            <p>अष्ट कूट (आठ-गुण) मिलान उत्तर भारतीय वैदिक ज्योतिष की सबसे प्रचलित विवाह अनुकूलता पद्धति है। यह दोनों साथियों की जन्म कुण्डली से चन्द्र नक्षत्र और चन्द्र राशि लेकर 8 आयामों पर संगतता को अंकित करती है। अधिकतम अंक 36 होता है। 18 से अधिक अंक सामान्यतः स्वीकार्य माना जाता है, 28 से अधिक उत्तम, और 18 से कम चुनौतीपूर्ण &mdash; हालाँकि ये दिशानिर्देश हैं, निर्णय नहीं।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">8 कूट विस्तार से</h3>
          </>) : (<>
            <h2 className="text-gold-light text-xl font-bold">What is Ashta Kuta Kundali Matching?</h2>
            <p>Ashta Kuta (eight-fold) matching is the most widely used marriage compatibility system in North Indian Vedic astrology. It takes the Moon nakshatra (birth star) and Moon sign from both partners&apos; birth charts and scores compatibility across 8 dimensions. The maximum score is 36 points. A score above 18 is generally considered acceptable, above 28 is excellent, and below 18 requires careful consideration &mdash; though these are guidelines, not verdicts.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">The 8 Kutas Explained</h3>
          </>)}

          {/* Kuta table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'कूट' : 'Kuta'}</th>
                  <th className="text-center py-2 px-3 text-gold-dark font-bold">{isHi ? 'अंक' : 'Points'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'विवरण' : 'What It Measures'}</th>
                </tr>
              </thead>
              <tbody>
                {KUTAS.map((k, i) => (
                  <tr key={i} className="border-b border-gold-primary/5">
                    <td className="py-2 px-3 text-gold-light font-bold whitespace-nowrap">{isHi ? k.nameHi : k.name}</td>
                    <td className="py-2 px-3 text-center text-text-primary">{k.pts}</td>
                    <td className="py-2 px-3 text-text-secondary text-xs leading-relaxed">{isHi ? k.descHi : k.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isHi ? (<>
            <h3 className="text-gold-light text-lg font-bold mt-6">अंकों की व्याख्या</h3>
            <p><strong>28&ndash;36 अंक (उत्तम):</strong> दोनों साथियों के बीच उत्कृष्ट संगतता। सभी प्रमुख कूटों में अच्छा मिलान। विवाह की दृढ़ अनुशंसा।</p>
            <p><strong>18&ndash;27 अंक (अच्छा):</strong> सन्तोषजनक संगतता। कुछ क्षेत्रों में कमी हो सकती है किन्तु सम्पूर्ण मिलान शुभ। विशेष दोषों (नाड़ी, भकूट) की जाँच आवश्यक।</p>
            <p><strong>18 से कम (चुनौतीपूर्ण):</strong> कम अंक चिन्ता का विषय हो सकता है, किन्तु अनेक सफल विवाह कम अंकों के साथ भी हुए हैं। किसी अनुभवी ज्योतिषी से विस्तृत कुण्डली मिलान करवाना उचित है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">दक्षिण भारतीय दशकूट पद्धति</h3>
            <p>दक्षिण भारत में 10-गुण (दशकूट) पद्धति प्रचलित है जो 10 अंकों पर आधारित है। इसमें रज्जु (विवाह स्थिरता) और वेध (नक्षत्र पीड़ा) जैसे अतिरिक्त कूट शामिल होते हैं जो उत्तर भारतीय पद्धति में नहीं हैं। हमारा गणक दोनों पद्धतियों का समर्थन करता है।</p>
          </>) : (<>
            <h3 className="text-gold-light text-lg font-bold mt-6">Interpreting the Score</h3>
            <p><strong>28&ndash;36 points (Excellent):</strong> Outstanding compatibility between partners. Strong harmony across all major kutas. Marriage is highly recommended from an astrological standpoint.</p>
            <p><strong>18&ndash;27 points (Good):</strong> Satisfactory compatibility. Some areas may need attention, but the overall match is favourable. Check for specific doshas (Nadi Dosha, Bhakut Dosha) even if the total score is good, as a zero in a major kuta can be significant.</p>
            <p><strong>Below 18 (Challenging):</strong> A lower score raises concerns, but many successful marriages exist with low Ashta Kuta scores. A detailed chart analysis by an experienced astrologer is recommended, as the kuta system only considers Moon-based factors and misses planetary yogas, dasha compatibility, and other important dimensions.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">South Indian Dasha Koota System</h3>
            <p>Southern India uses a 10-fold (Dasha Koota) matching system scored out of 10 points. It includes additional dimensions like Rajju (marriage durability) and Vedha (nakshatra affliction) that are not part of the North Indian system. Our tool supports both systems &mdash; toggle between them below.</p>
          </>)}

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/matching/compatibility`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'राशि संगतता चार्ट \u2192' : 'Rashi Compatibility Chart \u2192'}</Link>
            <Link href={`/${locale}/kundali`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'कुण्डली बनाएँ \u2192' : 'Generate Birth Chart \u2192'}</Link>
            <Link href={`/${locale}/learn/matching`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'गुण मिलान के बारे में जानें \u2192' : 'Learn about Matching \u2192'}</Link>
            <Link href={`/${locale}/learn/nakshatras`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'नक्षत्रों के बारे में जानें \u2192' : 'Learn about Nakshatras \u2192'}</Link>
          </div>
        </article>
      </section>

      {/* ── Interactive client component ── */}
      <MatchingClient />
    </>
  );
}

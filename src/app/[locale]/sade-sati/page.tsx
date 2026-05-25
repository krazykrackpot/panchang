import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getCurrentSaturnSign } from '@/lib/kundali/sade-sati-analysis';
import { RASHIS } from '@/lib/constants/rashis';
import SadeSatiClient from './Client';

// Saturn moves ~0.03°/day — revalidate daily to keep SSR position fresh
export const revalidate = 86400;

export default async function SadeSatiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  // Pre-compute Saturn's current position for SSR
  const saturnNow = getCurrentSaturnSign();
  const saturnSign = RASHIS.find(r => r.id === saturnNow.sign);
  const saturnSignName = saturnSign ? (isHi ? saturnSign.name.hi : saturnSign.name.en) : '';

  // Determine which Moon signs are currently affected
  const affectedSigns = [
    ((saturnNow.sign - 2 + 12) % 12) + 1, // 12th from Moon = rising phase
    saturnNow.sign,                         // over Moon sign = peak phase
    (saturnNow.sign % 12) + 1,             // 2nd from Moon = setting phase
  ];
  const affectedNames = affectedSigns.map(id => {
    const r = RASHIS.find(x => x.id === id);
    return r ? (isHi ? r.name.hi : r.name.en) : '';
  });

  // Saturn transit dates (approximate ingress dates for nearby signs).
  // Historical 2023-2025 entry dropped May 2026 — inception year is 2026 and
  // the Aquarius transit is past. Audit 2026-05-25 §A10.
  const SATURN_TRANSITS = [
    { sign: 'Pisces / मीन', entry: '29 Mar 2025', exit: '2 Jun 2027' },
    { sign: 'Aries / मेष', entry: '2 Jun 2027', exit: '20 Aug 2029' },
    { sign: 'Taurus / वृषभ', entry: '20 Aug 2029', exit: '5 Oct 2031' },
    { sign: 'Gemini / मिथुन', entry: '5 Oct 2031', exit: '6 Nov 2033' },
  ];

  return (
    <>
      {/* ── Server-rendered SEO content ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Current Saturn position banner */}
        <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-6 mb-8 text-center">
          <p className="text-gold-dark text-xs uppercase tracking-[0.2em] font-bold mb-2">
            {isHi ? 'शनि गोचर 2026' : 'Saturn Transit 2026'}
          </p>
          <p className="text-gold-light text-2xl font-bold">
            {isHi ? `शनि वर्तमान में ${saturnSignName} राशि में (${saturnNow.degree.toFixed(1)}°)` : `Saturn is currently in ${saturnSignName} (${saturnNow.degree.toFixed(1)}°)`}
          </p>
          <p className="text-text-secondary text-sm mt-2">
            {isHi
              ? `वर्तमान में ${affectedNames[0]}, ${affectedNames[1]} और ${affectedNames[2]} चन्द्र राशि वालों पर साढ़े साती का प्रभाव है।`
              : `Moon signs currently under Sade Sati: ${affectedNames[0]} (rising), ${affectedNames[1]} (peak), and ${affectedNames[2]} (setting).`}
          </p>
        </div>

        {/* What is Sade Sati */}
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {isHi ? (<>
            <h2 className="text-gold-light text-xl font-bold">साढ़े साती क्या है?</h2>
            <p>साढ़े साती (शाब्दिक अर्थ &quot;साढ़े सात&quot;) वैदिक ज्योतिष का सबसे महत्वपूर्ण गोचर काल है। जब शनि ग्रह आपकी जन्म चन्द्र राशि के पहले, उस पर, और उसके बाद की राशि से गुजरता है, तो यह ~7.5 वर्ष की अवधि साढ़े साती कहलाती है। शनि को प्रत्येक राशि पार करने में लगभग 2.5 वर्ष लगते हैं, इसलिए तीन राशियों का कुल काल ~7.5 वर्ष होता है।</p>
            <h3 className="text-gold-light text-lg font-bold mt-6">तीन चरण</h3>
            <p><strong>1. उदय चरण (चन्द्र से 12वीं राशि):</strong> शनि जब चन्द्र राशि से पूर्व की राशि में प्रवेश करता है, तब आरम्भ होता है। इस चरण में आर्थिक दबाव, नींद में बाधा, छिपी चिन्ताएँ और अनावश्यक व्यय हो सकते हैं। यह पूर्व-चेतावनी काल है जब शनि आपके मन की ओर बढ़ रहा होता है।</p>
            <p><strong>2. चरम चरण (चन्द्र राशि पर):</strong> सबसे तीव्र अवधि। शनि सीधे आपकी चन्द्र राशि पर से गुजरता है, जिससे मानसिक दबाव, सम्बन्ध परीक्षा, कैरियर चुनौतियाँ और स्वास्थ्य सम्बन्धी विषय सामने आ सकते हैं। किन्तु यही काल सबसे गहन आत्म-विकास और परिपक्वता का भी होता है।</p>
            <p><strong>3. अवसान चरण (चन्द्र से 2री राशि):</strong> शनि अब दूर जा रहा है। आर्थिक दबाव कम होता है, किन्तु पारिवारिक विषय, वाणी सम्बन्धी समस्याएँ और धन-संचय में कठिनाई हो सकती है। शनि पीछे ज्ञान और अनुभव छोड़कर जाता है।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">जीवनकाल में कितनी बार आती है?</h3>
            <p>शनि को सम्पूर्ण राशिचक्र की परिक्रमा में ~29.5 वर्ष लगते हैं, इसलिए साढ़े साती प्रत्येक 29-30 वर्ष में लौटती है। सामान्यतः जीवन में 2-3 बार आती है: पहली बचपन में (प्रभाव माता-पिता पर), दूसरी 28-37 वर्ष की आयु में (सर्वाधिक प्रभावशाली), तीसरी 57-66 वर्ष में (आध्यात्मिक गहनता)।</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">क्या साढ़े साती सदैव बुरी होती है?</h3>
            <p>नहीं। शनि कर्म और अनुशासन का ग्रह है। यदि आपकी कुण्डली में शनि शुभ भावों का स्वामी है, चन्द्रमा बलवान है, या आप शुभ दशा में हैं, तो साढ़े साती करियर में उन्नति, आध्यात्मिक जागृति और जीवन में आवश्यक सुधार ला सकती है। अनेक सफल व्यक्तियों ने अपनी सबसे बड़ी उपलब्धियाँ इसी काल में प्राप्त कीं।</p>
          </>) : (<>
            <h2 className="text-gold-light text-xl font-bold">What is Sade Sati?</h2>
            <p>Sade Sati (literally &quot;seven and a half&quot;) is the most significant transit period in Vedic astrology. It occurs when Saturn transits through three consecutive signs: the sign before your birth Moon sign, your Moon sign itself, and the sign after it. Since Saturn takes approximately 2.5 years to traverse each sign, the total duration spans roughly 7.5 years.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">The Three Phases</h3>
            <p><strong>1. Rising Phase (12th from Moon):</strong> Saturn enters the sign preceding your Moon sign. This phase often brings financial pressures, sleep disturbances, hidden anxieties, and unexpected expenses. Think of it as Saturn&apos;s approaching shadow &mdash; the pressure builds gradually before reaching its peak.</p>
            <p><strong>2. Peak Phase (over Moon sign):</strong> The most intense period. Saturn transits directly over your natal Moon, creating mental pressure, relationship tests, career challenges, and potential health concerns. However, this is also the phase of deepest personal growth, self-discovery, and maturation. Many people report their most transformative life experiences during this phase.</p>
            <p><strong>3. Setting Phase (2nd from Moon):</strong> Saturn moves into the sign after your Moon. Financial strain typically eases, but family matters, speech-related issues, and difficulties in accumulating wealth may surface. Saturn leaves behind hard-won wisdom and resilience.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">How Often Does Sade Sati Occur?</h3>
            <p>Saturn takes approximately 29.5 years to complete one orbit of the zodiac, so Sade Sati returns every 29&ndash;30 years. Most people experience it 2&ndash;3 times in their lifetime: the first in childhood (primarily affecting parents), the second around age 28&ndash;37 (the most impactful), and the third around age 57&ndash;66 (bringing spiritual depth and philosophical acceptance).</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">Is Sade Sati Always Bad?</h3>
            <p>Not at all. Saturn is the planet of karma, discipline, and hard-earned rewards. If Saturn rules beneficial houses in your chart, your Moon is strong, or you are running a favourable dasha, Sade Sati can bring career breakthroughs, spiritual awakening, and overdue life corrections. Many historically successful individuals &mdash; including business leaders, artists, and spiritual teachers &mdash; achieved their greatest milestones during Sade Sati.</p>

            <h3 className="text-gold-light text-lg font-bold mt-6">Factors That Modify Sade Sati&apos;s Impact</h3>
            <p>The actual experience varies greatly depending on: Saturn&apos;s natal house and sign, Moon&apos;s strength (sign placement, aspects, nakshatra), the current Vimshottari dasha period, Saturn&apos;s Ashtakavarga score in the transiting sign, and whether Saturn is retrograde during transit (retrograde stations are when effects peak). Our full analysis tool below considers all these factors.</p>
          </>)}

          {/* Saturn transit schedule */}
          <h3 className="text-gold-light text-lg font-bold mt-6">
            {isHi ? 'शनि गोचर अनुसूची (2023-2032)' : 'Saturn Transit Schedule (2023\u20132032)'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'राशि' : 'Sign'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'प्रवेश' : 'Enters'}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{isHi ? 'निर्गमन' : 'Exits'}</th>
                </tr>
              </thead>
              <tbody>
                {SATURN_TRANSITS.map((t, i) => (
                  <tr key={i} className="border-b border-gold-primary/5">
                    <td className="py-2 px-3 text-text-primary font-medium">{isHi ? t.sign.split(' / ')[1] : t.sign.split(' / ')[0]}</td>
                    <td className="py-2 px-3 text-text-secondary">{t.entry}</td>
                    <td className="py-2 px-3 text-text-secondary">{t.exit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Which Moon signs are affected now */}
          <h3 className="text-gold-light text-lg font-bold mt-6">
            {isHi ? 'वर्तमान में कौन सी चन्द्र राशियाँ प्रभावित हैं?' : 'Which Moon Signs Are Currently in Sade Sati?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {[
              { label: isHi ? 'उदय चरण' : 'Rising Phase', sign: affectedNames[0], desc: isHi ? 'आर्थिक दबाव, छिपी चिन्ताएँ' : 'Financial pressure, hidden anxieties' },
              { label: isHi ? 'चरम चरण' : 'Peak Phase', sign: affectedNames[1], desc: isHi ? 'सर्वाधिक तीव्र — मानसिक दबाव, परिवर्तन' : 'Most intense \u2014 mental pressure, transformation' },
              { label: isHi ? 'अवसान चरण' : 'Setting Phase', sign: affectedNames[2], desc: isHi ? 'पारिवारिक विषय, वाणी सम्बन्धी' : 'Family matters, speech-related issues' },
            ].map((phase, i) => (
              <div key={i} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] p-4">
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{phase.label}</div>
                <div className="text-gold-light text-lg font-bold">{phase.sign}</div>
                <div className="text-text-secondary text-xs mt-1">{phase.desc}</div>
              </div>
            ))}
          </div>

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/learn/grahas`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'ग्रह के बारे में जानें \u2192' : 'Learn about Grahas \u2192'}</Link>
            <Link href={`/${locale}/kundali`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'कुण्डली बनाएँ \u2192' : 'Generate Birth Chart \u2192'}</Link>
            <Link href={`/${locale}/panchang`} className="text-gold-primary hover:text-gold-light transition-colors">{isHi ? 'आज का पंचांग \u2192' : "Today\u2019s Panchang \u2192"}</Link>
          </div>
        </article>
      </section>

      {/* ── Interactive client component ── */}
      <SadeSatiClient />
    </>
  );
}

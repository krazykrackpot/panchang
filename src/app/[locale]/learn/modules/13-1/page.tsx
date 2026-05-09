'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/13-1.json';

const META: ModuleMeta = {
  id: 'mod_13_1', phase: 3, topic: 'Yogas', moduleNumber: '13.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What is a Yoga?', hi: 'योग क्या है?', sa: 'योग क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष में &quot;योग&quot; (शाब्दिक अर्थ &quot;संयोग&quot; या &quot;मिलन&quot;) एक विशिष्ट ग्रह विन्यास है जो निश्चित, पूर्वानुमेय फल उत्पन्न करता है। पश्चिमी ज्योतिष के विपरीत जो मुख्यतः व्यक्तिगत दृष्टियों (ग्रहों के बीच कोण) का विश्लेषण करता है, वैदिक योग ग्रहों के भाव स्वामित्व पर विचार करते हैं — लग्न के अनुसार ग्रह किन भावों का स्वामी है — जिससे समान ग्रह कोण भिन्न लग्नों के लिए पूर्णतः भिन्न फल देते हैं।</> : <>In Vedic astrology, a &quot;yoga&quot; (literally &quot;union&quot; or &quot;combination&quot;) is a specific planetary configuration that produces defined, predictable results. Unlike Western astrology which primarily analyzes individual aspects (angles between planets), Vedic yogas consider the house lordship of planets — which houses a planet rules based on the Ascendant — making identical planetary angles produce entirely different results for different rising signs. This lordship-based approach is what gives Jyotish its remarkable predictive specificity.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Major Yoga Categories', hi: 'प्रमुख योग श्रेणियाँ', sa: 'प्रमुख योग श्रेणियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Raja Yogas (Power):</span> Formed by Kendra-Trikona lord combinations. These confer authority, leadership, social status, and influence. From political power to corporate leadership to spiritual authority — Raja Yogas elevate a person above the ordinary.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Dhana Yogas (Wealth):</span> Combinations involving the 2nd, 5th, 9th, and 11th house lords with benefic influences. These bring financial prosperity, material accumulation, and resource abundance.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Arishta Yogas (Suffering):</span> Configurations indicating health challenges, accidents, or life difficulties. These involve malefic afflictions to sensitive points — especially the Moon, Lagna, and 8th house.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Nabhasa Yogas (Celestial Patterns):</span> Based on overall planetary distribution across the chart — how many planets are in kendras, trikonas, or specific formations. Examples include Gaja Kesari (Jupiter-Moon in kendras) and various Sankhya yogas.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Pancha Mahapurusha Yogas                                  */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Pancha Mahapurusha Yogas', hi: 'पञ्च महापुरुष योग', sa: 'पञ्च महापुरुष योग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पाँच &quot;महान व्यक्ति&quot; योग वैदिक ज्योतिष में सर्वाधिक प्रसिद्ध हैं। प्रत्येक तब बनता है जब पाँच सत्य ग्रहों (मंगल, बुध, गुरु, शुक्र, शनि) में से एक अपनी स्वराशि या उच्च राशि में लग्न या चन्द्र से केन्द्र भाव (1, 4, 7 या 10वें) में हो। सूर्य और चन्द्रमा ज्योति होने से महापुरुष योग नहीं बनाते। राहु और केतु छाया ग्रह होने से भी बहिष्कृत हैं।</> : <>The five &quot;Great Person&quot; yogas are among the most celebrated in Vedic astrology. Each is formed when one of the five true planets (Mars, Mercury, Jupiter, Venus, Saturn) occupies its own sign or exaltation sign in a Kendra house (1st, 4th, 7th, or 10th) from the Lagna or Moon. The Sun and Moon, being luminaries, do not form Mahapurusha Yogas. Rahu and Ketu, being shadow planets, are also excluded.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Five Yogas', hi: 'पाँच योग', sa: 'पाँच योग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1. Ruchaka (Mars):</span> The Warrior. Mars in Aries, Scorpio, or Capricorn in a Kendra. Produces courageous leaders, military commanders, athletes, surgeons. Physical strength, fearlessness, and commanding presence.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2. Bhadra (Mercury):</span> The Scholar. Mercury in Gemini or Virgo in a Kendra. Produces intellectuals, writers, orators, analysts. Sharp mind, eloquent speech, skill in mathematics and commerce.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">3. Hamsa (Jupiter):</span> The Sage. Jupiter in Sagittarius, Pisces, or Cancer in a Kendra. Produces spiritual leaders, teachers, judges, philanthropists. Wisdom, righteousness, and universal respect.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4. Malavya (Venus):</span> The Artist. Venus in Taurus, Libra, or Pisces in a Kendra. Produces artists, diplomats, luxury lovers. Refined aesthetic sense, charm, material comfort, and sensual enjoyment.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">5. Shasha (Saturn):</span> The Authority. Saturn in Capricorn, Aquarius, or Libra in a Kendra. Produces administrators, judges, leaders of organizations. Discipline, endurance, organizational ability, and earned authority through hard work.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Conditions for Full Strength', hi: 'पूर्ण बल की शर्तें', sa: 'पूर्ण बल की शर्तें' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A Mahapurusha Yoga reaches full strength when: (1) the planet is not combust (too close to the Sun), (2) it is not aspected by or conjoined with malefics that weaken it, (3) it is not in retrograde motion (debatable — some texts consider retrogrades strengthening), and (4) the dasha of the yoga-forming planet activates during the native&apos;s productive years. A technically present but weakened Mahapurusha Yoga may manifest partially — the promise exists but delivery is diminished.
        </p>
      </section>

      {/* Expected Frequency */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Expected Frequency — Sanity-Checking Yoga Detection', hi: 'अपेक्षित आवृत्ति — योग पहचान की जाँच', sa: 'अपेक्षित आवृत्ति — योग पहचान की जाँच' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक योग की एक स्वाभाविक आवृत्ति होती है। यदि कोई &quot;दुर्लभ&quot; योग 80% कुण्डलियों में दिखे, तो पहचान शर्त में त्रुटि है। सन्दर्भ आवृत्तियाँ:</> : <>Every yoga has a natural frequency of occurrence. If a &quot;rare&quot; yoga appears in 80% of charts, the detection condition is wrong. Reference frequencies:</>}</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="space-y-2 text-text-secondary text-xs">
            <p><span className="text-gold-light font-medium">{isHi ? 'गजकेसरी (~25%):' : 'Gajakesari (~25%):'}</span> {isHi ? 'गुरु चन्द्र से केन्द्र में — अपेक्षाकृत सामान्य।' : 'Jupiter in Kendra from Moon — relatively common.'}</p>
            <p><span className="text-gold-light font-medium">{isHi ? 'चन्द्र-मंगल (~8%):' : 'Chandra-Mangala (~8%):'}</span> {isHi ? 'चन्द्र-मंगल युति — मध्यम आवृत्ति।' : 'Moon-Mars conjunction — moderate frequency.'}</p>
            <p><span className="text-gold-light font-medium">{isHi ? 'महापुरुष (<10%):' : 'Mahapurusha (<10%):'}</span> {isHi ? 'प्रत्येक प्रकार दुर्लभ — पाँचों मिलकर ~15-20% कुण्डलियों में कम से कम एक।' : 'Each type is rare individually — collectively ~15-20% of charts have at least one.'}</p>
            <p><span className="text-gold-light font-medium">{isHi ? 'राजयोग (5-15%):' : 'Raja Yoga (5-15%):'}</span> {isHi ? 'केन्द्र-त्रिकोण स्वामी संयोग — मध्यम।' : 'Kendra-Trikona lord conjunction — moderate. Strong Raja Yogas are rarer.'}</p>
            <p><span className="text-red-400 font-medium">{isHi ? 'वसुमति (<5%):' : 'Vasumati (<5%):'}</span> {isHi ? 'सभी शुभ ग्रह उपचय में — यदि >20% में दिखे तो शर्त गलत है।' : 'All benefics in upachaya — if it triggers in >20% of charts, the condition is wrong.'}</p>
          </div>
        </div>
      </section>

      {/* Yoga Cancellation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Yoga Cancellation (Bhanga)', hi: 'योग भंग', sa: 'योग भंग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कई योगों की भंग (निरस्तीकरण) शर्तें होती हैं जो शुभ फल को क्षीण या समाप्त कर देती हैं:</> : <>Many yogas have Bhanga (cancellation) conditions that weaken or nullify their auspicious effects:</>}</p>
        <div className="space-y-2 text-text-secondary text-xs">
          <p><span className="text-gold-light font-medium">{isHi ? 'अस्तत्व (दहन):' : 'Combustion:'}</span> {isHi ? 'सूर्य से अत्यन्त निकट ग्रह &quot;अस्त&quot; हो जाता है — उसकी योग-शक्ति नष्ट। शुक्र 10° के भीतर, बुध 14° के भीतर।' : 'A planet too close to the Sun becomes "combust" — its yoga-forming power is destroyed. Venus within 10 degrees, Mercury within 14 degrees.'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'नीचभंग राजयोग:' : 'Neechabhanga Raja Yoga:'}</span> {isHi ? 'नीच ग्रह का भंग (निरस्तीकरण) — जब नीच राशि का स्वामी केन्द्र में हो, तो नीच ग्रह राजयोग में परिवर्तित हो जाता है।' : 'Cancellation of debilitation — when the lord of the debilitation sign is in a Kendra, the debilitated planet transforms into a Raja Yoga. From weakness comes unexpected power.'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'पाप कर्तरी:' : 'Papa Kartari:'}</span> {isHi ? 'शुभ ग्रह दोनों ओर से पाप ग्रहों से घिरा — योग का शुभ फल बाधित।' : 'A benefic planet hemmed between malefics on both sides — the yoga\'s auspicious result is blocked.'}</p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Raja Yogas                                                */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Raja Yogas — The Royal Combinations', hi: 'राज योग — राजकीय संयोग', sa: 'राज योग — राजकीय संयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राज योग केन्द्र स्वामियों (1, 4, 7, 10) और त्रिकोण स्वामियों (1, 5, 9) के संयोग, परस्पर दृष्टि या राशि विनिमय (परिवर्तन) से बनते हैं। केन्द्र अभिव्यक्ति के स्तम्भ हैं — स्वयं, गृह, साझेदारी और करियर। त्रिकोण धर्म और भाग्य का प्रतिनिधि हैं — उद्देश्य, सृजनात्मकता और दैवी कृपा। जब ये दोनों शक्तियाँ अपने शासक ग्रहों के माध्यम से मिलती हैं, परिणाम सामान्य परिस्थितियों से ऊपर उठना होता है।</> : <>Raja Yogas are formed by the conjunction, mutual aspect, or sign exchange (Parivartana) of Kendra lords (1st, 4th, 7th, 10th) with Trikona lords (1st, 5th, 9th). Kendras represent the pillars of manifestation — self, home, partnerships, and career. Trikonas represent dharma and fortune — purpose, creativity, and divine grace. When these two forces unite through their ruling planets, the result is elevation beyond ordinary circumstances.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Key Raja Yoga Combinations', hi: 'प्रमुख राज योग संयोग', sa: 'प्रमुख राज योग संयोग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1st + 5th lords:</span> Self-expression through creativity and intelligence. Success in education, speculation, and leadership through wisdom.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1st + 9th lords:</span> Personality aligned with fortune. The native is naturally lucky — opportunities seem to find them. Strong dharmic orientation.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4th + 5th lords:</span> Domestic happiness combined with intelligence. Success in education, property, and maternal blessings.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4th + 9th lords:</span> Home and fortune unite. Inherited property, land wealth, academic success, and comfortable life supported by luck.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">10th + 5th lords:</span> Career success through intelligence. Professional recognition, creative career achievements, and leadership roles.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">10th + 9th lords (Dharma-Karma Adhipati):</span> The supreme Raja Yoga. Career becomes dharma. The native achieves great professional heights that serve a higher purpose. Kings, prime ministers, and spiritual leaders often have this yoga.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">7th + 9th lords:</span> Fortune through partnerships and marriage. Business partnerships that bring wealth, or marriage that elevates social status.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Activation Principle', hi: 'सक्रियण सिद्धान्त', sa: 'सक्रियण सिद्धान्त' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A Raja Yoga remains a latent promise until the Mahadasha or Antardasha of one of the yoga-forming planets arrives. A person with a powerful 9th+10th lord Raja Yoga born during an unrelated dasha (say, Mercury) may live an ordinary life until Jupiter or Saturn dasha begins (if those are the 9th and 10th lords). This is why timing (dasha analysis) is inseparable from yoga analysis — the chart shows WHAT is possible, the dasha shows WHEN it manifests.
        </p>
      </section>

      {/* Vimshottari Dasha connection */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Yoga Timing Through Vimshottari Dasha', hi: 'विंशोत्तरी दशा द्वारा योग का समय', sa: 'विंशोत्तरी दशा द्वारा योग का समय' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विंशोत्तरी दशा पद्धति 120 वर्षों का एक पूर्ण चक्र है जो 9 ग्रहों में विभाजित है। प्रत्येक ग्रह की महादशा अवधि:</> : <>The Vimshottari Dasha system is a complete 120-year cycle divided among 9 planets. Each planet&apos;s Mahadasha duration:</>}</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-gold-light text-xs py-2 pr-3">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left text-text-tertiary text-xs py-2 pr-3">{isHi ? 'वर्ष' : 'Years'}</th>
                <th className="text-left text-text-tertiary text-xs py-2">{isHi ? 'सामान्य विषय' : 'Typical Theme'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              {[
                { p: isHi ? 'सूर्य' : 'Sun', y: '6', t: isHi ? 'आत्मविश्वास, अधिकार, पिता' : 'Confidence, authority, father' },
                { p: isHi ? 'चन्द्र' : 'Moon', y: '10', t: isHi ? 'भावनाएँ, माता, जनसम्पर्क' : 'Emotions, mother, public connection' },
                { p: isHi ? 'मंगल' : 'Mars', y: '7', t: isHi ? 'ऊर्जा, सम्पत्ति, साहस' : 'Energy, property, courage' },
                { p: isHi ? 'राहु' : 'Rahu', y: '18', t: isHi ? 'भौतिक इच्छाएँ, विदेश, अप्रत्याशित' : 'Material desires, foreign, unexpected' },
                { p: isHi ? 'गुरु' : 'Jupiter', y: '16', t: isHi ? 'ज्ञान, विस्तार, सन्तान, धर्म' : 'Wisdom, expansion, children, dharma' },
                { p: isHi ? 'शनि' : 'Saturn', y: '19', t: isHi ? 'अनुशासन, कर्म, दीर्घकालिक संरचना' : 'Discipline, karma, long-term structure' },
                { p: isHi ? 'बुध' : 'Mercury', y: '17', t: isHi ? 'संवाद, व्यापार, बुद्धि' : 'Communication, business, intellect' },
                { p: isHi ? 'केतु' : 'Ketu', y: '7', t: isHi ? 'आध्यात्मिकता, वैराग्य, मुक्ति' : 'Spirituality, detachment, liberation' },
                { p: isHi ? 'शुक्र' : 'Venus', y: '20', t: isHi ? 'प्रेम, कला, विलासिता, विवाह' : 'Love, art, luxury, marriage' },
              ].map(r => (
                <tr key={r.p} className="border-b border-white/5">
                  <td className="py-1.5 pr-3 text-gold-light font-medium">{r.p}</td>
                  <td className="py-1.5 pr-3 font-medium">{r.y}</td>
                  <td className="py-1.5">{r.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">{isHi ? <>कुल = 120 वर्ष, जो वैदिक परम्परा में पूर्ण मानव आयु मानी जाती है। योग-निर्माता ग्रह की महादशा या अन्तर्दशा में ही योग पूर्ण रूप से फलित होता है। यही कारण है कि दो व्यक्ति जिनकी कुण्डली में समान योग हो, बहुत भिन्न समय पर सफलता प्राप्त कर सकते हैं।</> : <>Total = 120 years, considered a full human lifespan in Vedic tradition. A yoga fully manifests only during the Mahadasha or Antardasha of its forming planet. This is why two people with the same yoga in their charts may achieve success at vastly different ages — it depends on when the relevant dasha arrives in their life.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;अधिक योग = बेहतर कुण्डली।&quot; वास्तविकता: एक शक्तिशाली योग जो सही दशा में सक्रिय हो, दर्जनों कमज़ोर योगों से अधिक प्रभावशाली है।</> : <>&quot;More yogas = better chart.&quot; Reality: one powerful yoga that activates during the right dasha is more impactful than dozens of weak, never-activated ones.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;राजयोग = राजा बनना।&quot; वास्तविकता: आधुनिक संदर्भ में राजयोग = पेशेवर उत्कृष्टता, नेतृत्व, प्रभाव — आवश्यक रूप से राजनीतिक शक्ति नहीं।</> : <>&quot;Raja Yoga = becoming a king.&quot; Reality: in modern context, Raja Yoga = professional excellence, leadership, influence — not necessarily political power.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;अरिष्ट योग = निश्चित विनाश।&quot; वास्तविकता: अधिकांश अरिष्ट योगों में भंग (निरस्तीकरण) शर्तें होती हैं। शुभ ग्रहों की दृष्टि या स्थिति अरिष्ट को शमित कर सकती है।</> : <>&quot;Arishta Yoga = certain doom.&quot; Reality: most Arishta Yogas have Bhanga (cancellation) conditions. Benefic aspects or placements can mitigate them significantly.</>}</p>
      </section>
    </div>
  );
}

export default function Module13_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


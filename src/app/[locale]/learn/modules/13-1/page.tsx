'use client';

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
          {isHi ? 'योग क्या है?' : 'What is a Yoga?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष में &quot;योग&quot; (शाब्दिक अर्थ &quot;संयोग&quot; या &quot;मिलन&quot;) एक विशिष्ट ग्रह विन्यास है जो निश्चित, पूर्वानुमेय फल उत्पन्न करता है। पश्चिमी ज्योतिष के विपरीत जो मुख्यतः व्यक्तिगत दृष्टियों (ग्रहों के बीच कोण) का विश्लेषण करता है, वैदिक योग ग्रहों के भाव स्वामित्व पर विचार करते हैं — लग्न के अनुसार ग्रह किन भावों का स्वामी है — जिससे समान ग्रह कोण भिन्न लग्नों के लिए पूर्णतः भिन्न फल देते हैं।</> : <>In Vedic astrology, a &quot;yoga&quot; (literally &quot;union&quot; or &quot;combination&quot;) is a specific planetary configuration that produces defined, predictable results. Unlike Western astrology which primarily analyzes individual aspects (angles between planets), Vedic yogas consider the house lordship of planets — which houses a planet rules based on the Ascendant — making identical planetary angles produce entirely different results for different rising signs. This lordship-based approach is what gives Jyotish its remarkable predictive specificity.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख योग श्रेणियाँ' : 'Major Yoga Categories'}</h4>
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
          {isHi ? 'पञ्च महापुरुष योग' : 'Pancha Mahapurusha Yogas'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पाँच &quot;महान व्यक्ति&quot; योग वैदिक ज्योतिष में सर्वाधिक प्रसिद्ध हैं। प्रत्येक तब बनता है जब पाँच सत्य ग्रहों (मंगल, बुध, गुरु, शुक्र, शनि) में से एक अपनी स्वराशि या उच्च राशि में लग्न या चन्द्र से केन्द्र भाव (1, 4, 7 या 10वें) में हो। सूर्य और चन्द्रमा ज्योति होने से महापुरुष योग नहीं बनाते। राहु और केतु छाया ग्रह होने से भी बहिष्कृत हैं।</> : <>The five &quot;Great Person&quot; yogas are among the most celebrated in Vedic astrology. Each is formed when one of the five true planets (Mars, Mercury, Jupiter, Venus, Saturn) occupies its own sign or exaltation sign in a Kendra house (1st, 4th, 7th, or 10th) from the Lagna or Moon. The Sun and Moon, being luminaries, do not form Mahapurusha Yogas. Rahu and Ketu, being shadow planets, are also excluded.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पाँच योग' : 'The Five Yogas'}</h4>
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
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पूर्ण बल की शर्तें' : 'Conditions for Full Strength'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A Mahapurusha Yoga reaches full strength when: (1) the planet is not combust (too close to the Sun), (2) it is not aspected by or conjoined with malefics that weaken it, (3) it is not in retrograde motion (debatable — some texts consider retrogrades strengthening), and (4) the dasha of the yoga-forming planet activates during the native&apos;s productive years. A technically present but weakened Mahapurusha Yoga may manifest partially — the promise exists but delivery is diminished.
        </p>
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
          {isHi ? 'राज योग — राजकीय संयोग' : 'Raja Yogas — The Royal Combinations'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राज योग केन्द्र स्वामियों (1, 4, 7, 10) और त्रिकोण स्वामियों (1, 5, 9) के संयोग, परस्पर दृष्टि या राशि विनिमय (परिवर्तन) से बनते हैं। केन्द्र अभिव्यक्ति के स्तम्भ हैं — स्वयं, गृह, साझेदारी और करियर। त्रिकोण धर्म और भाग्य का प्रतिनिधि हैं — उद्देश्य, सृजनात्मकता और दैवी कृपा। जब ये दोनों शक्तियाँ अपने शासक ग्रहों के माध्यम से मिलती हैं, परिणाम सामान्य परिस्थितियों से ऊपर उठना होता है।</> : <>Raja Yogas are formed by the conjunction, mutual aspect, or sign exchange (Parivartana) of Kendra lords (1st, 4th, 7th, 10th) with Trikona lords (1st, 5th, 9th). Kendras represent the pillars of manifestation — self, home, partnerships, and career. Trikonas represent dharma and fortune — purpose, creativity, and divine grace. When these two forces unite through their ruling planets, the result is elevation beyond ordinary circumstances.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख राज योग संयोग' : 'Key Raja Yoga Combinations'}</h4>
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
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सक्रियण सिद्धान्त' : 'Activation Principle'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A Raja Yoga remains a latent promise until the Mahadasha or Antardasha of one of the yoga-forming planets arrives. A person with a powerful 9th+10th lord Raja Yoga born during an unrelated dasha (say, Mercury) may live an ordinary life until Jupiter or Saturn dasha begins (if those are the 9th and 10th lords). This is why timing (dasha analysis) is inseparable from yoga analysis — the chart shows WHAT is possible, the dasha shows WHEN it manifests.
        </p>
      </section>
    </div>
  );
}

export default function Module13_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


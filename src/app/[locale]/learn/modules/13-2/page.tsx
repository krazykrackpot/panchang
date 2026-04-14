'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/13-2.json';

const META: ModuleMeta = {
  id: 'mod_13_2', phase: 3, topic: 'Yogas', moduleNumber: '13.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
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
          {tl({ en: 'Dhana Yogas — Wealth Combinations', hi: 'धन योग — सम्पत्ति संयोग', sa: 'धन योग — सम्पत्ति संयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>धन योग विशिष्ट ग्रह संयोग हैं जो धन संचय, आर्थिक समृद्धि और भौतिक प्रचुरता इंगित करते हैं। ये मुख्यतः धन अक्ष के स्वामियों की परस्पर क्रिया से बनते हैं — 2रा (संचित धन, पारिवारिक संसाधन), 5वाँ (सट्टा लाभ, पूर्वजन्म पुण्य, बुद्धि), 9वाँ (भाग्य, दैवी कृपा, पैतृक धन), और 11वाँ (आय, लाभ, इच्छापूर्ति) भाव। जब इन भावों के स्वामी संयोग, परस्पर दृष्टि या राशि विनिमय बनाते हैं, तो जातक के जीवन में धन प्रवाह की नलिकाएँ बनती हैं।</> : <>Dhana Yogas are specific planetary combinations that indicate wealth accumulation, financial prosperity, and material abundance. They are formed primarily by the interaction of lords of the wealth axis — the 2nd (stored wealth, family resources), 5th (speculative gains, past-life merit, intellect), 9th (fortune, divine grace, father&apos;s wealth), and 11th (income, gains, fulfillment) houses. When these lords form conjunctions, mutual aspects, or sign exchanges, they create pipelines for wealth to flow into the native&apos;s life.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Key Dhana Yogas', hi: 'प्रमुख धन योग', sa: 'प्रमुख धन योग' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2nd + 11th lords in mutual Kendras:</span> When the lord of stored wealth and the lord of income occupy each other&apos;s Kendra positions, wealth flows both ways — savings grow and income increases. This is a classic prosperity indicator.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Lakshmi Yoga:</span> The 9th lord in strong dignity (own/exalted sign) placed in a Kendra, with the Lagna lord also strong. Named after the goddess of wealth, this yoga bestows not just money but lasting prosperity supported by divine grace and good fortune.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Jupiter-Mercury in 2nd or 11th:</span> Jupiter (expansion, wisdom) and Mercury (commerce, calculation) together in wealth houses create exceptional financial intelligence. The native has a natural ability to grow wealth through business, investments, or intellectual pursuits.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Venus in own/exalted in 2nd:</span> Venus (luxury, material comfort) strong in the 2nd house (accumulated wealth) produces a life of material abundance, fine possessions, good food, and aesthetic living. The native attracts wealth through charm, art, or social connections.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Daridra Yogas                                             */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Daridra Yogas — Poverty Indicators', hi: 'दारिद्र योग — दरिद्रता सूचक', sa: 'दारिद्र योग — दरिद्रता सूचक' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दारिद्र योग आर्थिक कठिनाई, संसाधन अभाव और भौतिक संघर्ष की प्रवृत्तियाँ इंगित करते हैं। यह समझना अत्यन्त महत्वपूर्ण है कि ये योग प्रतिमान बताते हैं, स्थायी दण्डादेश नहीं। ये विशिष्ट दशा कालों में सक्रिय होते हैं और शुभ प्रभावों, विशेषकर गुरु की दृष्टि से काफी शमित हो सकते हैं। अनेक सफल लोगों की कुण्डली में दारिद्र योग हैं — उन्होंने बस अधिक परिश्रम किया या अन्य प्रतिकारी योगों ने कठिनाई पर विजय पाई।</> : <>Daridra Yogas indicate tendencies toward financial difficulty, resource scarcity, and material struggle. It is crucial to understand that these yogas describe patterns, not permanent sentences. They activate during specific dasha periods and can be significantly mitigated by benefic influences, especially Jupiter&apos;s aspect. Many successful people have Daridra Yogas in their charts — they simply worked harder or had other compensating yogas that overcame the difficulty.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Formations', hi: 'सामान्य निर्माण', sa: 'सामान्य निर्माण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">11th lord in 6/8/12:</span> The lord of gains trapped in houses of debt (6th), obstacles (8th), or expenses (12th). Income is earned but immediately consumed by debts, crises, or excessive spending.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Malefics in 2nd without benefic aspect:</span> Natural malefics (Saturn, Mars, Rahu, Sun) occupying the 2nd house without the protective gaze of Jupiter or Venus damage accumulated wealth, family harmony, and financial stability.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">2nd lord debilitated or in 6/8/12:</span> The custodian of wealth is weakened or misplaced, making it difficult to save, invest wisely, or maintain family resources.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Cancellation & Mitigation', hi: 'निरसन एवं शमन', sa: 'निरसन एवं शमन' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Jupiter&apos;s aspect:</span> A strong Jupiter aspecting the afflicted house or planet can substantially cancel Daridra Yoga. Jupiter brings wisdom, expansion, and divine protection to whatever it touches.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Favorable Dasha:</span> Even with Daridra Yoga, the dasha of a well-placed benefic (especially if it forms a Dhana Yoga elsewhere in the chart) can bring temporary but significant financial relief.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Neecha Bhanga:</span> If the debilitated planet causing the yoga has cancellation of debilitation (Neecha Bhanga), the initial struggle transforms into eventual prosperity — the native earns wealth through overcoming adversity.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Arishta Yogas                                             */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Arishta Yogas — Health & Danger', hi: 'अरिष्ट योग — स्वास्थ्य एवं संकट', sa: 'अरिष्ट योग — स्वास्थ्य एवं संकट' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अरिष्ट योग स्वास्थ्य, शारीरिक सुरक्षा या जीवन आयु में सम्वेदनशीलता इंगित करते हैं। ये तब बनते हैं जब पापी ग्रह कुण्डली के संवेदनशील बिन्दुओं को पीड़ित करते हैं — विशेषकर चन्द्रमा (मन, पोषण), लग्न (शरीर, जीवनशक्ति) और 8वाँ भाव (आयु, जीर्ण स्थिति)। अरिष्ट मूल्यांकन फलित और उपचारात्मक ज्योतिष दोनों के लिए आवश्यक है, क्योंकि सम्वेदनशीलता पहचानना निवारक उपायों की अनुमति देता है।</> : <>Arishta Yogas indicate vulnerabilities in health, physical safety, or life longevity. They are formed when malefic planets afflict sensitive chart points — particularly the Moon (mind, nurturing), Lagna (body, vitality), and the 8th house (longevity, chronic conditions). Arishta assessment is essential for both predictive and remedial astrology, as identifying vulnerabilities allows for preventive measures.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Key Arishta Configurations', hi: 'प्रमुख अरिष्ट विन्यास', sa: 'प्रमुख अरिष्ट विन्यास' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Balarishta (infant danger):</span> Moon afflicted by malefics without benefic aspect — vulnerable early childhood health. Saturn-Moon (emotional suppression), Mars-Moon (fevers, inflammation), Rahu-Moon (unexplained anxieties). Jupiter&apos;s aspect is the primary protector.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">8th lord in Lagna:</span> The lord of chronic disease and sudden events placed directly in the house of self and body. Creates a lifelong vulnerability to health issues, especially during the dasha of the 8th lord.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Saturn-Mars in 8th house:</span> Two powerful malefics combining in the house of longevity. Saturn brings chronic conditions; Mars brings acute crises (accidents, surgeries, inflammation). Together they indicate periods requiring extreme health vigilance.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Severity Assessment', hi: 'तीव्रता मूल्यांकन', sa: 'तीव्रता मूल्यांकन' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>अरिष्ट तीव्रता निर्भर करती है: (1) कितने पापी ग्रह सम्मिलित हैं — एक सम्भालने योग्य है, दो या अधिक गम्भीर। (2) शुभ प्रतिसन्तुलन — गुरु या शुक्र की दृष्टि पीड़ित बिन्दु पर तीव्रता नाटकीय रूप से कम करती है। (3) लग्न स्वामी बल — बलवान लग्न स्वामी पीड़ाओं को सहने की शारीरिक सहनशक्ति देता है। (4) दशा समय — अरिष्ट योग केवल सम्बन्धित ग्रहों की दशा में सक्रिय होते हैं।</> : <>Arishta severity depends on: (1) How many malefics are involved — one malefic is manageable, two or more is serious. (2) Benefic counterbalance — Jupiter or Venus aspecting the afflicted point reduces severity dramatically. (3) Lagna lord strength — a strong Lagna lord gives physical resilience to withstand afflictions. (4) Dasha timing — Arishta Yogas activate only during the dasha of involved planets.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Remedial Perspective', hi: 'उपचारात्मक दृष्टिकोण', sa: 'उपचारात्मक दृष्टिकोण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Identifying Arishta Yogas is not meant to create fear but to enable prevention. Jyotish tradition prescribes specific remedies: strengthening benefics through gemstones (yellow sapphire for Jupiter, diamond/white sapphire for Venus), mantras for the afflicting planets, charitable acts associated with the malefic (e.g., feeding crows for Saturn, donating red items for Mars), and spiritual practices. Modern health awareness — regular checkups during vulnerable dasha periods — is the practical application of Arishta analysis.
        </p>
      </section>
    </div>
  );
}

export default function Module13_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


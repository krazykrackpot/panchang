'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/12-3.json';

const META: ModuleMeta = {
  id: 'mod_12_3', phase: 3, topic: 'Transits', moduleNumber: '12.3',
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
          {tl({ en: 'Jupiter Transit', hi: 'गुरु गोचर', sa: 'गुरुगोचरः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>गुरु (बृहस्पति) वैदिक ज्योतिष में सबसे बड़ा नैसर्गिक शुभ ग्रह है। राशिचक्र में इसका गोचर — लगभग प्रत्येक 13 मास में राशि परिवर्तन — सर्वाधिक महत्वपूर्ण वार्षिक ज्योतिषीय घटनाओं में से एक है। गुरु जो भी छूता है उसे विस्तारित करता है: धन, ज्ञान, आध्यात्मिकता, सम्बन्ध या सन्तान। इसका राशि परिवर्तन प्रायः आपके जीवन के प्रमुख विषय में दृश्य बदलाव से सहसम्बद्ध होता है।</> : <>Jupiter (Guru/Brihaspati) is the greatest natural benefic in Vedic astrology. Its transit through the zodiac — changing signs approximately every 13 months — is one of the most significant annual astrological events. Jupiter expands whatever it touches: wealth, knowledge, spirituality, relationships, or children. Its sign change often correlates with a visible shift in the dominant theme of your life.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Transit Results from Moon', hi: 'चन्द्र से गोचर फल', sa: 'चन्द्रात् गोचरफलानि' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Highly Auspicious — Trikona (1, 5, 9):</span> Jupiter in the 1st brings personal growth, optimism, and new beginnings. In the 5th, it enhances intelligence, creativity, romance, and children&apos;s well-being. In the 9th, it brings fortune, dharma, long-distance travel, guru blessings, and spiritual elevation. These are Jupiter&apos;s most powerful positions.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Good — Wealth Houses (2, 7, 11):</span> Jupiter in the 2nd brings financial improvement and family harmony. In the 7th, it supports marriage, partnerships, and business deals. In the 11th, it brings income, social connections, and fulfillment of long-held desires.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-red-400 font-medium">Challenging (3, 4, 6, 8, 10, 12):</span> Jupiter in these houses brings comparatively muted results. However, Jupiter is a natural benefic — even in unfavorable houses, it rarely causes severe harm. It may slow progress or create lethargy rather than active damage.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Jupiter&apos;s Special Aspects', hi: 'गुरु की विशेष दृष्टि', sa: 'गुरु की विशेष दृष्टि' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Unlike other planets that only aspect the 7th house from their position, Jupiter has special aspects (Vishesh Drishti) on the 5th, 7th, and 9th houses from where it sits. This means Jupiter activates 4 houses simultaneously during transit — the house it occupies plus three aspected houses. This quadruple activation is why Jupiter transits are so impactful. For example, Jupiter in the 3rd from Moon (not ideal by transit rules) still aspects the 7th (marriage), 9th (fortune), and 11th (gains) — providing beneficial influence to those areas.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Rahu-Ketu Transit                                        */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Rahu-Ketu Transit', hi: 'राहु-केतु गोचर', sa: 'राहु-केतुगोचरः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राहु (उत्तर पात) और केतु (दक्षिण पात) छाया ग्रह हैं — गणितीय बिन्दु जहाँ चन्द्रमा का कक्षा तल क्रान्तिवृत्त को काटता है। ये सदैव वक्री गति (राशिचक्र में पीछे की ओर) से गोचर करते हैं, प्रत्येक राशि में लगभग 18 मास रहते हैं और पूर्ण चक्र लगभग 18 वर्षों में पूरा करते हैं। इनका गोचर अद्वितीय रूप से कार्मिक है — ये प्रभावित भावों में इच्छाएँ (राहु) और विमोचन (केतु) जगाते हैं।</> : <>Rahu (North Node) and Ketu (South Node) are the shadow planets — mathematical points where the Moon&apos;s orbital plane intersects the ecliptic. They always transit in retrograde motion (backward through the zodiac), spending approximately 18 months in each sign and completing a full cycle in about 18 years. Their transits are uniquely karmic — they stir desires (Rahu) and trigger release (Ketu) in the houses they affect.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Rahu Transit Results', hi: 'राहु गोचर फल', sa: 'राहुगोचरफलानि' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-emerald-400 font-medium">शुभ (चन्द्र से 1, 3, 6, 10, 11):</span> 1ले में राहु व्यक्तिगत आकर्षण और महत्वाकांक्षा देता है। 3वें में साहस, रोमांच और मीडिया/संचार में सफलता। 6वें में शत्रुओं और रोग पर विजय। 10वें में करियर उन्नति और सार्वजनिक मान्यता। 11वें में बड़ा आर्थिक लाभ और प्रभावशाली सम्पर्क।</> : <><span className="text-emerald-400 font-medium">Favorable (1, 3, 6, 10, 11 from Moon):</span> Rahu in the 1st gives personal magnetism and ambition. In the 3rd, it brings courage, adventure, and success in media/communication. In the 6th, it gives victory over enemies and disease. In the 10th, career rise and public recognition. In the 11th, large financial gains and powerful connections.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-red-400 font-medium">Challenging (2, 4, 5, 7, 8, 9, 12):</span> Rahu in these houses creates confusion, obsessive desires, and sudden disruptions. Rahu in the 8th is especially intense — bringing sudden transformations, hidden dangers, or occult experiences. Rahu in the 7th can create relationship turbulence and attraction to unconventional partners.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Karmic Activation', hi: 'कार्मिक सक्रियता', sa: 'कार्मिक सक्रियता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">नोडल वापसी (~18 वर्ष):</span> जब गोचरी राहु अपनी जन्मकालिक स्थिति पर लौटता है (और केतु अपनी पर), एक प्रमुख कार्मिक चक्र पूर्ण होता है। यह लगभग 18-19, 36-37, 54-55 और 72-73 वर्ष की आयु में होता है। ये निर्णायक वर्ष हैं जब जीवन दिशा नाटकीय रूप से बदलती है।</> : <><span className="text-gold-light font-medium">Nodal Return (~18 years):</span> When transiting Rahu returns to its natal position (and Ketu to its natal position), a major karmic cycle completes. This happens around ages 18-19, 36-37, 54-55, and 72-73. These are pivotal years when life direction shifts dramatically — the universe recalibrates your karmic trajectory.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Eclipse Seasons:</span> When the transiting Sun and Moon come near the Rahu-Ketu axis, solar and lunar eclipses occur. These 2-3 week windows (happening twice yearly) are karmically charged — initiations, endings, and fateful encounters cluster around eclipses. In Jyotish, no auspicious work is begun during eclipse periods.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Double Transit Theory                                     */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Double Transit Theory', hi: 'दोहरा गोचर सिद्धान्त', sa: 'दोहरा गोचर सिद्धान्त' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोहरा गोचर (द्विग्रह गोचर) सिद्धान्त वैदिक ज्योतिष की सर्वाधिक विश्वसनीय समय निर्धारण तकनीकों में से एक है। यह कहता है कि किसी भाव के फल वास्तविक जीवन में प्रकट होने के लिए, गुरु और शनि दोनों को एक साथ उस भाव को प्रभावित (दृष्टि या अधिवास द्वारा) करना चाहिए — चाहे चन्द्र राशि से गिना जाए या लग्न से। यह सिद्धान्त सुन्दर ढंग से दो सबसे धीमे दृश्य ग्रहों को जोड़ता है जिनका संयुक्त प्रभाव ब्रह्माण्डीय समय की सहमति दर्शाता है।</> : <>The Double Transit (Dwigraha Gochar) theory is one of the most reliable timing techniques in Vedic astrology. It states that for any house&apos;s significations to manifest in real life, BOTH Jupiter AND Saturn must simultaneously influence (by aspect or occupation) that house — whether counted from the Moon sign or from the Lagna. This theory elegantly combines the two slowest visible planets whose combined influence represents the consensus of cosmic timing.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'How It Works', hi: 'यह कैसे काम करता है', sa: 'यह कैसे काम करता है' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 1:</span> Identify which house&apos;s signification you want to time (e.g., 7th house for marriage, 10th for career rise, 5th for children). Check if the natal chart promises this event (yogas, dasha period supporting it).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 2:</span> Check Jupiter&apos;s current transit — which houses does it aspect or occupy from Moon/Lagna? Remember Jupiter aspects the 5th, 7th, and 9th from its position, plus the house it occupies.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 3:</span> Check Saturn&apos;s current transit — which houses does it aspect or occupy from Moon/Lagna? Saturn aspects the 3rd, 7th, and 10th from its position, plus the house it occupies.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Step 4:</span> If both Jupiter and Saturn simultaneously influence the target house, the event&apos;s timing window is open. Within this window, the exact date is often triggered by a fast planet (Sun, Moon, or Mars) activating the same point.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example — Marriage Timing', hi: 'उदाहरण — विवाह समय', sa: 'उदाहरण — विवाह समय' }, locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 1: [1], 7: [4, 6] }}
          title={tl({ en: 'Aries Lagna — Moon in 1st, Jupiter & Saturn aspecting 7th', hi: 'मेष लग्न — चन्द्र प्रथम में, बृहस्पति और शनि सप्तम में', sa: 'मेष लग्न — चन्द्र प्रथम में, बृहस्पति और शनि सप्तम में' }, locale)}
          highlight={[1, 7]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>एक जातक पर विचार करें जिसका चन्द्रमा मेष में है। विवाह के लिए हमें गुरु और शनि दोनों को 7वें भाव (तुला) को प्रभावित करने की आवश्यकता है। मिथुन में गुरु अपनी 5वीं दृष्टि से तुला को देखता है। कुम्भ में शनि अपनी 10वीं दृष्टि (शनि की विशेष दृष्टि) से तुला को देखता है। चूँकि दोनों ग्रह एक साथ 7वें भाव को प्रभावित करते हैं, यह काल विवाह की सम्भावना खोलता है — बशर्ते दशा भी समर्थन करे।</> : <>Consider a native with Moon in Aries (Mesha). For marriage, we need Jupiter and Saturn to both influence the 7th house (Libra/Tula) from Moon. Jupiter in Gemini (Mithuna) aspects Libra with its 5th aspect. Saturn in Aquarius (Kumbha) aspects Libra with its 10th aspect (Saturn&apos;s special Vishesh Drishti). Since both planets simultaneously influence the 7th house, this period opens a marriage window — provided the dasha also supports it.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Important Caveat', hi: 'महत्वपूर्ण सावधानी', sa: 'महत्वपूर्ण सावधानी' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The double transit opens a window of possibility, but the natal chart must promise the event (through appropriate yogas), and the dasha period must support it. All three layers — natal promise, dasha activation, and transit timing — must align for a significant event to occur. This is the &quot;triple condition&quot; of Vedic prediction: promise (chart) + activation (dasha) + timing (transit) = event manifestation.
        </p>
      </section>
    </div>
  );
}

export default function Module12_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


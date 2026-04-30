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
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>गुरु गोचर की विशेषता यह है कि यह शनि की तरह दबाव नहीं डालता बल्कि विस्तार और अवसर लाता है। जिस भाव से गुरु गुज़रता है, उस जीवन क्षेत्र में संभावनाओं के द्वार खुलते हैं — लेकिन क्या आप उन अवसरों का लाभ उठा पाते हैं, यह आपकी जन्म कुण्डली में गुरु की स्थिति और चल रही दशा पर निर्भर करता है।</> : <>What makes Jupiter transits unique is that unlike Saturn, Jupiter does not apply pressure but rather brings expansion and opportunity. The life area governed by the house Jupiter transits sees doors of possibility opening — but whether you capitalize on those opportunities depends on Jupiter&apos;s natal position and your running dasha. Jupiter in the 2nd from Moon during Jupiter dasha, for instance, can bring extraordinary wealth; the same transit during Rahu dasha may bring only modest gains.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Transit Results from Moon', hi: 'चन्द्र से गोचर फल', sa: 'चन्द्रात् गोचरफलानि' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Highly Auspicious — Trikona (1, 5, 9):</span> Jupiter in the 1st brings personal growth and optimism. In the 5th, it enhances intelligence, creativity, romance, and children&apos;s well-being. In the 9th, it brings fortune, dharma, guru blessings, and spiritual elevation.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Good — Wealth Houses (2, 7, 11):</span> Jupiter in the 2nd brings financial improvement and family harmony. In the 7th, it supports marriage and partnerships. In the 11th, it brings income, social connections, and fulfillment of desires.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-red-400 font-medium">Challenging (3, 4, 6, 8, 10, 12):</span> Jupiter here brings comparatively muted results. However, Jupiter is a natural benefic — even in unfavorable houses, it rarely causes severe harm.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Jupiter&apos;s Special Aspects', hi: 'गुरु की विशेष दृष्टि', sa: 'गुरु की विशेष दृष्टि' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>सामान्य ग्रहों की तरह केवल 7वें भाव पर दृष्टि न डालते हुए, गुरु 5वें, 7वें और 9वें भावों पर विशेष दृष्टि रखता है। इसका अर्थ है गोचर में गुरु एक साथ 4 भावों को सक्रिय करता है। उदाहरण: चन्द्र से 3वें में गुरु (सामान्यतः शुभ नहीं) फिर भी 7वें (विवाह), 9वें (भाग्य) और 11वें (लाभ) को दृष्टि से शुभ प्रभावित करता है।</> : <>Unlike other planets that only aspect the 7th house, Jupiter has special aspects on the 5th, 7th, and 9th houses from where it sits. This means Jupiter activates 4 houses simultaneously during transit. For example, Jupiter in the 3rd from Moon (not ideal) still aspects the 7th (marriage), 9th (fortune), and 11th (gains) — providing beneficial influence to those areas.</>}</p>
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
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राहु और केतु छाया ग्रह हैं — गणितीय बिन्दु जहाँ चन्द्रमा की कक्षा क्रान्तिवृत्त को काटती है। ये सदैव वक्री गति से गोचर करते हैं, प्रत्येक राशि में लगभग 18 मास रहते हैं। इनका गोचर कार्मिक है — राहु इच्छाएँ और केतु विमोचन जगाता है।</> : <>Rahu (North Node) and Ketu (South Node) are shadow planets — mathematical points where the Moon&apos;s orbital plane intersects the ecliptic. They always transit in retrograde motion, spending approximately 18 months in each sign. Their transits are uniquely karmic — Rahu stirs desires and Ketu triggers release.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राहु और केतु को समझने का सबसे सरल तरीका: राहु वह है जो आपको अभी चाहिए (भौतिक इच्छा, महत्वाकांक्षा, अतृप्त वासना), जबकि केतु वह है जो आपने पहले अनुभव कर लिया है (विरक्ति, आध्यात्मिक ज्ञान, त्याग)। जिस भाव में राहु गोचर करता है वहाँ नई इच्छाएँ जागती हैं; जिस भाव में केतु गोचर करता है वहाँ से विरक्ति होती है।</> : <>The simplest way to understand Rahu and Ketu: Rahu represents what you crave NOW (material desire, ambition, unfulfilled longing), while Ketu represents what you have already experienced (detachment, spiritual wisdom, renunciation). The house Rahu transits sees new desires arise; the house Ketu transits sees detachment and letting go.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Rahu Transit Results', hi: 'राहु गोचर फल', sa: 'राहुगोचरफलानि' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-emerald-400 font-medium">शुभ (चन्द्र से 1, 3, 6, 10, 11):</span> 1ले में व्यक्तिगत आकर्षण; 3वें में साहस और मीडिया सफलता; 6वें में शत्रुओं पर विजय; 10वें में करियर उन्नति; 11वें में बड़ा आर्थिक लाभ।</> : <><span className="text-emerald-400 font-medium">Favorable (1, 3, 6, 10, 11 from Moon):</span> Rahu in the 1st gives personal magnetism; 3rd brings courage and media success; 6th gives victory over enemies; 10th brings career rise; 11th brings large financial gains.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-red-400 font-medium">Challenging (2, 4, 5, 7, 8, 9, 12):</span> Rahu here creates confusion, obsessive desires, and sudden disruptions. Rahu in the 8th is especially intense — sudden transformations, hidden dangers, or occult experiences.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Karmic Activation — Nodal Return', hi: 'कार्मिक सक्रियता — नोडल वापसी', sa: 'कार्मिक सक्रियता — नोडल वापसी' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">नोडल वापसी (~18 वर्ष):</span> राहु अपनी जन्मकालिक स्थिति पर लौटता है — ~18-19, 36-37, 54-55, 72-73 वर्ष। ये निर्णायक वर्ष हैं जब जीवन दिशा नाटकीय रूप से बदलती है।</> : <><span className="text-gold-light font-medium">Nodal Return (~18 years):</span> When transiting Rahu returns to its natal position, a major karmic cycle completes. This happens around ages 18-19, 36-37, 54-55, and 72-73. These are pivotal years when life direction shifts dramatically.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'ग्रहण काल:' : 'Eclipse Seasons:'}</span> {isHi ? <>जब गोचरी सूर्य-चन्द्र राहु-केतु अक्ष के निकट आते हैं, ग्रहण होते हैं। ये 2-3 सप्ताह कार्मिक रूप से आवेशित हैं — आरम्भ, समाप्ति और भाग्यपूर्ण मुलाकातें ग्रहणों के आसपास होती हैं।</> : <>When the transiting Sun and Moon come near the Rahu-Ketu axis, eclipses occur. These 2-3 week windows are karmically charged — initiations, endings, and fateful encounters cluster around eclipses. No auspicious work is begun during eclipse periods.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;राहु सदैव बुरा है।&quot; वास्तविकता: राहु 3, 6, 10, 11 में अत्यन्त शुभ है। राहु उन भावों को शक्ति देता है जहाँ महत्वाकांक्षा और अपरम्परागत दृष्टिकोण लाभदायक है।</> : <>&quot;Rahu is always bad.&quot; Reality: Rahu in 3, 6, 10, 11 is highly auspicious. Rahu empowers houses where ambition and unconventional approaches are beneficial.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;केतु आध्यात्मिक ग्रह है इसलिए शुभ है।&quot; वास्तविकता: केतु भौतिक क्षेत्रों में विरक्ति लाता है — 2वें में धन हानि, 7वें में संबंध विच्छेद। आध्यात्मिक लाभ तभी है जब जातक आध्यात्मिक रूप से तैयार हो।</> : <>&quot;Ketu is spiritual so it is always good.&quot; Reality: Ketu brings detachment in material areas — in the 2nd it can cause financial loss, in the 7th relationship dissolution. Spiritual benefit only accrues when the native is spiritually ready.</>}</p>
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
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोहरा गोचर सिद्धान्त वैदिक ज्योतिष की सर्वाधिक विश्वसनीय समय निर्धारण तकनीकों में से एक है। यह कहता है कि किसी भाव के फल वास्तविक जीवन में प्रकट होने के लिए, गुरु और शनि दोनों को एक साथ उस भाव को प्रभावित करना चाहिए। यह सिद्धान्त दो सबसे धीमे दृश्य ग्रहों को जोड़ता है जिनका संयुक्त प्रभाव ब्रह्माण्डीय समय की सहमति दर्शाता है।</> : <>The Double Transit (Dwigraha Gochar) theory is one of the most reliable timing techniques in Vedic astrology. It states that for any house&apos;s significations to manifest in real life, BOTH Jupiter AND Saturn must simultaneously influence (by aspect or occupation) that house. This theory elegantly combines the two slowest visible planets whose combined influence represents the consensus of cosmic timing.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>यह सिद्धान्त इसलिए इतना विश्वसनीय है क्योंकि गुरु और शनि विपरीत ऊर्जाएँ हैं — गुरु विस्तार करता है, शनि संकुचित करता है। जब दोनों एक ही भाव पर सहमत हों, तो वह सहमति एक शक्तिशाली संकेत है कि उस भाव के विषय अब साकार होने के लिए तैयार हैं। यह एक &quot;ब्रह्माण्डीय मतैक्य&quot; है।</> : <>This theory is so reliable because Jupiter and Saturn represent opposing energies — Jupiter expands, Saturn contracts. When both agree on the same house, that consensus is a powerful signal that the house&apos;s themes are ripe for manifestation. It is a &quot;cosmic consensus&quot; — like two very different committee members both voting yes on the same proposal.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'How It Works', hi: 'यह कैसे काम करता है', sa: 'यह कैसे काम करता है' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 1:</span> Identify the target house (e.g., 7th for marriage, 10th for career, 5th for children). Verify the natal chart promises this event.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 2:</span> Check Jupiter&apos;s transit — which houses does it aspect or occupy? Jupiter aspects 5th, 7th, 9th from its position plus the house it occupies (4 houses total).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 3:</span> Check Saturn&apos;s transit — Saturn aspects 3rd, 7th, 10th from its position plus its occupied house (4 houses total).</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Step 4:</span> If both influence the target house simultaneously, the event&apos;s timing window is open. Fast planets (Sun, Moon, Mars) often trigger the exact date within this window.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example — Marriage Timing', hi: 'उदाहरण — विवाह समय', sa: 'उदाहरण — विवाह समय' }, locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 1: [1], 7: [4, 6] }}
          title={tl({ en: 'Aries Lagna — Jupiter & Saturn aspecting 7th', hi: 'मेष लग्न — गुरु और शनि सप्तम पर दृष्टि', sa: 'मेष लग्न — गुरु और शनि सप्तम पर दृष्टि' }, locale)}
          highlight={[1, 7]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रमा मेष में। विवाह के लिए 7वें भाव (तुला) पर दोनों का प्रभाव चाहिए। मिथुन में गुरु 5वीं दृष्टि से तुला देखता है। कुम्भ में शनि 10वीं दृष्टि से तुला देखता है। दोनों एक साथ 7वें को प्रभावित करते हैं — विवाह की सम्भावना खुलती है, बशर्ते दशा भी समर्थन करे।</> : <>Moon in Aries. For marriage we need both planets influencing the 7th house (Libra). Jupiter in Gemini aspects Libra with its 5th aspect. Saturn in Aquarius aspects Libra with its 10th aspect. Both simultaneously influence the 7th — this opens a marriage window, provided the dasha also supports it.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Triple Condition', hi: 'त्रिगुण शर्त', sa: 'त्रिगुण शर्त' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>वैदिक भविष्यवाणी की &quot;त्रिगुण शर्त&quot;: प्रतिज्ञा (जन्म कुण्डली में योग) + सक्रियण (दशा) + समय (गोचर) = घटना प्रकटीकरण। तीनों परतें मिलनी चाहिए। दोहरा गोचर बिना दशा समर्थन के केवल सम्भावना का संकेत है, घटना की गारंटी नहीं।</> : <>The &quot;triple condition&quot; of Vedic prediction: promise (natal chart yogas) + activation (dasha period) + timing (transit) = event manifestation. All three layers must align. Double transit without dasha support is merely a possibility signal, not a guarantee.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;दोहरा गोचर होने पर घटना निश्चित है।&quot; वास्तविकता: दोहरा गोचर आवश्यक शर्त है, पर्याप्त नहीं। जन्म कुण्डली में प्रतिज्ञा और दशा समर्थन भी चाहिए।</> : <>&quot;If double transit is active, the event is guaranteed.&quot; Reality: double transit is a necessary condition, not sufficient. The natal chart must promise the event and the dasha must support it.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;केवल लग्न से गिनना पर्याप्त है।&quot; वास्तविकता: लग्न और चन्द्र दोनों से जाँचें। जब दोनों से दोहरा गोचर सक्रिय हो, तो संभावना सर्वाधिक प्रबल है।</> : <>&quot;Counting only from Lagna is sufficient.&quot; Reality: check from both Lagna and Moon. When double transit is active from both reference points, the probability is strongest.</>}</p>
      </section>
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Practical Transit Analysis — Year Ahead', hi: 'व्यावहारिक गोचर विश्लेषण — आगामी वर्ष', sa: 'व्यावहारिक गोचर विश्लेषण — आगामी वर्ष' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वार्षिक गोचर विश्लेषण के लिए एक व्यवस्थित ढाँचा: पहले गुरु की वर्तमान राशि और अगले राशि परिवर्तन की तिथि नोट करें। फिर शनि की राशि। फिर राहु-केतु अक्ष। ये तीन धीमी गोचर वर्ष का ढाँचा तय करते हैं। तीव्र ग्रह (सूर्य, मंगल, बुध, शुक्र) विशिष्ट सप्ताह या मास में घटनाओं को ट्रिगर करते हैं।</> : <>A systematic framework for annual transit analysis: First, note Jupiter&rsquo;s current sign and next sign-change date. Then Saturn&rsquo;s sign. Then the Rahu-Ketu axis. These three slow transits establish the year&rsquo;s framework. Fast planets (Sun, Mars, Mercury, Venus) trigger specific events within the broad framework during particular weeks or months.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed">{isHi ? <>प्रत्येक गोचर को अपनी जन्म कुण्डली पर चन्द्र से गिनकर मूल्यांकन करें। गुरु चन्द्र से 1, 5, 9 में सर्वश्रेष्ठ (त्रिकोण)। शनि चन्द्र से 3, 6, 11 में सर्वश्रेष्ठ (उपचय)। राहु 3, 6, 10, 11 में शुभ। जब गुरु और शनि दोनों एक साथ किसी भाव पर प्रभावी हों, वह दोहरा गोचर उस भाव की घटनाओं के लिए खिड़की खोलता है। हमारा गोचर रडार पृष्ठ इसे दृश्य रूप में प्रस्तुत करता है।</> : <>Evaluate each transit by counting from your natal Moon. Jupiter is best in 1, 5, 9 from Moon (trikona). Saturn is best in 3, 6, 11 from Moon (upachaya). Rahu is favourable in 3, 6, 10, 11. When both Jupiter and Saturn simultaneously influence a house, that double transit opens a window for events related to that house. Our Transit Radar page visualizes this with an interactive timeline.</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Additional Misconceptions', hi: 'अतिरिक्त भ्रान्तियाँ', sa: 'अतिरिक्त भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;गोचर जन्म कुण्डली को अधिभावी कर सकता है।&quot; गोचर जन्म कुण्डली के वचनों को सक्रिय करता है, अधिभावी नहीं। यदि जन्म कुण्डली में विवाह का कोई वचन नहीं (7वाँ भाव गम्भीर रूप से पीड़ित), तो 7वें पर सर्वश्रेष्ठ दोहरा गोचर भी विवाह नहीं देगा।</> : <>&quot;Transits can override the birth chart.&quot; Transits ACTIVATE the birth chart&rsquo;s promises, they do not override them. If the birth chart has no marriage promise (7th house severely afflicted), even the best double transit over the 7th will not produce marriage.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रान्ति:' : 'Myth:'}</span> {isHi ? <>&quot;नोडल गोचर (राहु-केतु) अन्य गोचरों से कम महत्वपूर्ण है।&quot; 18-मास की अवधि और कार्मिक प्रकृति के कारण नोडल गोचर प्रायः गुरु या शनि से अधिक परिवर्तनकारी होते हैं। जिस भाव से राहु गोचर करता है वहाँ जुनून और इच्छा उभरती है; केतु का भाव विरक्ति और मोक्ष अनुभव करता है।</> : <>&quot;Nodal transits (Rahu-Ketu) are less important than other transits.&quot; Because of their 18-month duration and karmic nature, nodal transits are often MORE transformative than Jupiter or Saturn. The house Rahu transits experiences obsession and desire; the house Ketu transits experiences detachment and liberation.</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Cross-References', hi: 'सम्बन्धित मॉड्यूल', sa: 'सम्बन्धित मॉड्यूल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>शनि गोचर (साढ़े साती) के विस्तृत विश्लेषण के लिए <span className="text-gold-light">मॉड्यूल 12.1</span> देखें। गुरु गोचर और गोचर बल के लिए <span className="text-gold-light">मॉड्यूल 12.2</span> देखें। दशा-गोचर एकीकरण के लिए <span className="text-gold-light">मॉड्यूल 11.3</span> देखें। अष्टकवर्ग बिन्दुओं से गोचर गुणवत्ता मूल्यांकन के लिए <span className="text-gold-light">मॉड्यूल 18.3</span> देखें।</> : <>For detailed Saturn transit (Sade Sati) analysis, see <span className="text-gold-light">Module 12.1</span>. For Jupiter transit and transit strength, see <span className="text-gold-light">Module 12.2</span>. For dasha-transit integration, see <span className="text-gold-light">Module 11.3</span>. For Ashtakavarga bindu-based transit quality assessment, see <span className="text-gold-light">Module 18.3</span>.</>}</p>
      </section>
    </div>
  );
}

export default function Module12_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

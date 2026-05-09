'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/23-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_23_2', phase: 10, topic: 'Prediction', moduleNumber: '23.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 16,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

/* ─── Page 1: Retrograde Mechanics ─────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Retrograde planets appear to move backward due to orbital mechanics — in Jyotish, retrograde gives a planet intensified and internalized energy.',
          'Combustion occurs when a planet is within a few degrees of the Sun and becomes invisible — it loses its ability to express its significations externally.',
          'BPHS specifies different combustion orbs for retrograde Mercury (12°) and Venus (8°) — reduced from their direct-motion thresholds.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'वक्री — दृश्य पश्चगामी नृत्य' : 'Retrograde — The Apparent Backward Dance'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वक्री गति कक्षीय यांत्रिकी के कारण एक दृष्टि भ्रम है। कोई भी ग्रह वास्तव में दिशा नहीं बदलता। राजमार्ग पर दो कारों की कल्पना करें: जब आप धीमी कार को पार करते हैं, तो वह कार दूर के पर्वतों की तुलना में पीछे जाती दिखती है। वही सिद्धान्त ग्रहों पर लागू होता है।</> : <>Retrograde motion is an optical illusion caused by orbital mechanics. No planet actually reverses direction. Think of two cars on a highway: when you overtake a slower car, that car seems to move backward relative to the distant mountains. The same principle applies to planets.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>भौतिक प्रक्रिया स्पष्ट है: जब पृथ्वी अपनी तीव्र आन्तरिक कक्षा में किसी बाह्य ग्रह (मंगल, बृहस्पति, शनि) को पार करती है, तो वह ग्रह तारकीय पृष्ठभूमि पर पीछे चलता दिखता है। आन्तरिक ग्रहों (बुध, शुक्र) के लिए प्रभाव विपरीत है — वे पृथ्वी से तेज़ हैं, अतः जब वे अवर युति (पृथ्वी और सूर्य के बीच) से गुज़रते हैं तब वक्री दिखते हैं। प्रत्येक ग्रह के लिए वक्री अवधि उसकी कक्षा यांत्रिकी द्वारा निश्चित है।</> : <>The physical process is clear: when Earth in its faster inner orbit overtakes an outer planet (Mars, Jupiter, Saturn), that planet appears to move backward against the stellar background. For inner planets (Mercury, Venus), the effect is reversed — they are faster than Earth, so they appear retrograde when they pass between Earth and the Sun at inferior conjunction. Each planet&apos;s retrograde period is fixed by its orbital mechanics.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Mercury (Budha Vakri)', hi: 'बुध वक्री', sa: 'बुधवक्रता' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>वर्ष में 3-4 बार, प्रत्येक ~21 दिन। सांस्कृतिक रूप से सबसे कुख्यात। बुध संवाद, प्रौद्योगिकी, वाणिज्य का शासक है।</> : <>3-4 times per year, ~21 days each. The most culturally notorious retrograde. Mercury rules communication, technology, commerce.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Venus (Shukra Vakri)', hi: 'शुक्र वक्री', sa: 'शुक्रवक्रता' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हर 18 महीने, ~40 दिन। शुक्र प्रेम, सौन्दर्य, विलासिता और वित्त का शासक है। पुराने प्रेमी पुनः प्रकट, सम्बन्ध पुनर्मूल्यांकन।</> : <>Every 18 months, ~40 days. Venus rules love, beauty, luxury, and finance. Old lovers resurface, relationship re-evaluation.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Mars (Mangal Vakri)', hi: 'मंगल वक्री', sa: 'मंगलवक्रता' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हर 26 महीने, ~72 दिन। मंगल कर्म, ऊर्जा, आक्रामकता का शासक है। विलम्बित कार्रवाई, पुनर्विचारित संघर्ष।</> : <>Every 26 months, ~72 days. Mars rules action, energy, aggression. Delayed action, revisiting old conflicts.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Jupiter & Saturn', hi: 'बृहस्पति और शनि', sa: 'बृहस्पति-शनिवक्रताः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>दोनों प्रतिवर्ष ~4-5 महीनों के लिए वक्री होते हैं (~30-40% समय)। बृहस्पति: आन्तरिक विकास। शनि: कार्मिक पाठ पुनः प्रकट। चूँकि वे इतनी बार वक्री होते हैं, ये व्यक्तिगत रूप से कम नाटकीय हैं लेकिन पृष्ठभूमि ऊर्जा बदलते हैं।</> : <>Both retrograde annually for ~4-5 months (~30-40% of the time). Jupiter: internal growth. Saturn: karmic lessons resurface. Since they retrograde so often, these are less dramatic individually but shift background energy.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Key Insight: Retrograde = Closer, Not Weaker', hi: 'मुख्य अन्तर्दृष्टि: वक्री = निकट, दुर्बल नहीं', sa: 'मुख्यः अन्तर्बोधः: वक्री = निकट, न दुर्बलः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>वक्री ग्रह पृथ्वी के अधिक निकट होते हैं, दूर नहीं। वक्री ग्रह आकाश में अधिक चमकीला दिखता है, अधिक शक्तिशाली (दुर्बल नहीं) होता है, और इसके प्रभाव अधिक आन्तरिक और तीव्र होते हैं। &quot;पुनः-&quot; उपसर्ग वक्री को पूर्ण रूप से व्यक्त करता है: पुनर्समीक्षा, पुनर्संशोधन, पुनर्विचार, पुनर्सम्पर्क, पुनः करना।</> : <>Retrograde planets are CLOSER to Earth, not farther. A retrograde planet appears brighter in the sky, is stronger (not weaker), and its effects are more internalized and intense. The &quot;re-&quot; prefix captures retrogrades perfectly: review, revise, reconsider, reconnect, redo.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Combustion (Asta) with BPHS Degrees ────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'अस्त — सूर्य की चमक में लुप्त होना' : 'Combustion (Asta) — Vanishing in the Sun\'s Glare'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अस्त तब होता है जब कोई ग्रह सूर्य के बहुत निकट आ जाता है और अदृश्य हो जाता है — सूर्य के तेज प्रकाश से अभिभूत। वैदिक ज्योतिष में, अस्त ग्रह दुर्बल माना जाता है: इसके कारकत्व दबे, भ्रमित या जले हुए हो जाते हैं।</> : <>Combustion occurs when a planet gets too close to the Sun and becomes invisible — overwhelmed by the Sun&apos;s brilliant light. In Vedic astrology, a combust planet is considered weakened: its significations become suppressed, confused, or burned away.</>}</p>

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
          <p className="text-red-400 font-bold text-sm mb-2">{tl({ en: 'BPHS Combustion Orbs (Ch. 6)', hi: 'BPHS अस्त दूरियाँ (अध्याय 6)', sa: 'BPHS अस्तदूरताः' }, locale)}</p>
          <div className="text-text-secondary text-xs mt-2 space-y-1">{isHi ? <><p><strong className="text-gold-light">चन्द्र:</strong> 12° — भावनात्मक स्पष्टता मन्द, मानसिक धुंध</p>
            <p><strong className="text-gold-light">मंगल:</strong> 17° — साहस/कर्म दबा हुआ, छिपी आक्रामकता</p>
            <p><strong className="text-gold-light">बुध:</strong> 14° सामान्य / <span className="text-emerald-400">12° वक्री होने पर</span> — संवाद भ्रम</p>
            <p><strong className="text-gold-light">बृहस्पति:</strong> 11° — दुर्बल ज्ञान, खराब मार्गदर्शन वृत्ति</p>
            <p><strong className="text-gold-light">शुक्र:</strong> 10° सामान्य / <span className="text-emerald-400">8° वक्री होने पर</span> — सम्बन्ध भ्रम</p>
            <p><strong className="text-gold-light">शनि:</strong> 15° — अनुशासन टूटता है, संरचना विफल</p></> : <><p><strong className="text-gold-light">Moon (Chandra):</strong> 12° — emotional clarity dimmed, mental fog</p>
            <p><strong className="text-gold-light">Mars (Mangal):</strong> 17° — courage/action suppressed, hidden aggression</p>
            <p><strong className="text-gold-light">Mercury (Budha):</strong> 14° direct / <span className="text-emerald-400">12° when retrograde</span> — communication confusion</p>
            <p><strong className="text-gold-light">Jupiter (Guru):</strong> 11° — weakened wisdom, poor guidance instincts</p>
            <p><strong className="text-gold-light">Venus (Shukra):</strong> 10° direct / <span className="text-emerald-400">8° when retrograde</span> — relationship confusion</p>
            <p><strong className="text-gold-light">Saturn (Shani):</strong> 15° — discipline breaks down, structure fails</p></>}</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why Retrograde Reduces Combustion Orbs', hi: 'वक्री क्यों अस्त दूरी कम करता है', sa: 'वक्री क्यों अस्त दूरी कम करता है' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>बुध और शुक्र वक्री होने पर सूर्य के समान दिशा में लौटते दिखते हैं — किन्तु वे अवर युति पर होते हैं (सूर्य और पृथ्वी के बीच), पृथ्वी के निकट। निकटता उन्हें प्रभावी रूप से &quot;उज्ज्वल&quot; बनाती है, जिससे वे सूर्य की चमक में भी कुछ अधिक दृश्य रहते हैं। BPHS इसे कम अस्त दूरी के रूप में व्यक्त करता है: बुध 14° → 12°, शुक्र 10° → 8°। हमारा computeCombust() फ़ंक्शन ग्रह की वक्री स्थिति जाँचता है और तदनुसार सही सीमा लगाता है।</> : <>When Mercury and Venus are retrograde, they are moving back toward the Sun — but they are at inferior conjunction (between the Sun and Earth), closer to us. This proximity makes them effectively &quot;brighter,&quot; so they remain somewhat more visible even in the Sun&apos;s glare. BPHS expresses this as reduced combustion orbs: Mercury 14° → 12°, Venus 10° → 8°. Our computeCombust() function checks the planet&apos;s retrograde status and applies the correct threshold accordingly.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
        <p className="text-gold-light font-bold text-sm">{tl({ en: 'Asta & Udaya — Heliacal Setting & Rising', hi: 'अस्त और उदय — सान्ध्य अस्त और उदय', sa: 'अस्तः उदयश्च' }, locale)}</p>
        <p className="text-text-secondary text-xs mt-1">{isHi ? <>अस्त (हेलियाकल सेटिंग) वह तिथि है जब ग्रह सूर्य के बहुत निकट होने से सान्ध्य आकाश में अन्तिम बार दिखता है। उदय (हेलियाकल राइज़िंग) वह तिथि है जब ग्रह अस्त अवधि के बाद प्रभात आकाश में पहली बार पुनः दिखता है। प्राचीन मेसोपोटामिया, मिस्र और भारत में हेलियाकल उदय का विशेष महत्त्व था — शुक्र का उदय युद्ध और शान्ति के शगुन के रूप में देखा जाता था। वैदिक ज्योतिष में, ग्रह का अस्त से उदय तक का संक्रमण &quot;पुनर्जन्म&quot; माना जाता है — जैसे अग्नि में तपकर ग्रह शुद्ध होकर लौटता है।</> : <>Asta (heliacal setting) is the date when a planet is last visible in the evening sky before becoming too close to the Sun. Udaya (heliacal rising) is the date when the planet first becomes visible again in the morning sky after the combustion period. In ancient Mesopotamia, Egypt, and India, heliacal risings held special significance — Venus&apos;s rising was seen as an omen of war and peace. In Vedic astrology, the transition from Asta to Udaya is considered a &quot;rebirth&quot; — the planet returns purified, as if tempered by fire.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
        <p className="text-gold-light font-bold text-sm">{tl({ en: 'Combust vs. Cazimi — The Exception', hi: 'अस्त बनाम काज़िमी — अपवाद', sa: 'अस्तः विरुद्धं काज़िमी' }, locale)}</p>
        <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब कोई ग्रह सूर्य के अत्यन्त निकट (1° या सूर्य की डिस्क के भीतर) हो, तो इसे &quot;काज़िमी&quot; — सूर्य के हृदय में माना जाता है। यह विरोधाभासी रूप से सबसे शक्तिशाली स्थिति है। ग्रह जला नहीं बल्कि सूर्य के सिंहासन पर बैठकर सशक्त है। यह दुर्लभ और अत्यन्त शुभ है।</> : <>When a planet is extremely close to the Sun (within ~1° or the Sun&apos;s disk), it is considered &quot;cazimi&quot; — in the heart of the Sun. This is paradoxically the most powerful position. The planet is not burned but empowered by sitting on the Sun&apos;s throne. This is rare and highly auspicious.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Natal vs Transit + Shadbala ─────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'जन्म कुण्डली बनाम गोचर में प्रभाव' : 'Effects in Natal Chart vs Transit'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वक्री और अस्त का प्रभाव जन्म कुण्डली और गोचर में भिन्न होता है। <span className="text-gold-light font-medium">जन्म कुण्डली में वक्री:</span> ग्रह के कारकत्वों में आजीवन आन्तरिकता और गहनता। वक्री बुध वाले जातक उत्कृष्ट सम्पादक/शोधकर्ता हो सकते हैं (पुनर्विचार, पुनर्समीक्षा में कुशल) किन्तु तात्कालिक संवाद में कठिनाई अनुभव कर सकते हैं। वक्री शुक्र वाले जातक प्रेम में गहरी भावनात्मक जटिलता अनुभव करते हैं — सतही सम्बन्ध सन्तुष्ट नहीं करते।</> : <>The effects of retrograde and combustion differ between natal charts and transits. <span className="text-gold-light font-medium">Retrograde in natal:</span> lifelong internalization and intensity of the planet&apos;s significations. A native with retrograde Mercury may be an excellent editor/researcher (skilled at re-thinking, re-examining) but may struggle with spontaneous communication. A native with retrograde Venus experiences deep emotional complexity in love — surface relationships do not satisfy.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <><span className="text-gold-light font-medium">गोचर में वक्री:</span> अस्थायी ऊर्जा परिवर्तन जो सभी को प्रभावित करता है। बुध वक्री गोचर में संवाद भूलें, तकनीकी त्रुटियाँ, यात्रा विलम्ब — ये 21 दिनों तक रहती हैं फिर सामान्य हो जाती हैं। <span className="text-gold-light font-medium">जन्म कुण्डली में अस्त:</span> ग्रह के कारकत्व जीवन भर आत्मविश्वास की कमी, अस्पष्टता या दमन अनुभव करते हैं। अस्त बृहस्पति वाला जातक ज्ञान और मार्गदर्शन में आत्मविश्वास की कमी अनुभव कर सकता है — उन्हें सक्रिय रूप से इन गुणों को विकसित करना होगा।</> : <><span className="text-gold-light font-medium">Retrograde in transit:</span> a temporary energy shift affecting everyone. Mercury retrograde in transit brings communication mishaps, tech glitches, travel delays — these last 21 days then normalize. <span className="text-gold-light font-medium">Combustion in natal:</span> the planet&apos;s significations experience lifelong lack of confidence, ambiguity, or suppression. A native with combust Jupiter may struggle with confidence in wisdom and guidance — they must actively cultivate these qualities.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Vakri in Shadbala — Cheshta Bala', hi: 'षड्बल में वक्री — चेष्टा बल', sa: 'षड्बले वक्री — चेष्टा बल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>वक्री अवस्था षड्बल प्रणाली में चेष्टा बल (गतिजन्य शक्ति) देती है। वक्री ग्रह को अधिकतम 60 विरूप मिलते हैं — यह चेष्टा बल की 8 अवस्थाओं में सर्वोच्च है। तुलना: मार्गी (सामान्य गति) = 45 विरूप, मन्दगति = 30, स्थानक (स्थिर) = 15, अस्त = 0। वक्री ग्रह शाब्दिक रूप से &quot;सबसे कठिन परिश्रम करने वाला&quot; माना जाता है — इसके फलादेश सबसे तीव्र और अपरिहार्य होते हैं।</> : <>The Vakri (retrograde) state gives Cheshta Bala (motional strength) in the Shadbala system. A retrograde planet receives the maximum 60 virupas — the highest of the 8 Cheshta Bala states. Compare: Margi (direct motion) = 45 virupas, Mandagati (slow) = 30, Sthanaka (stationary) = 15, Asta (combust) = 0. A retrograde planet literally &quot;works the hardest&quot; — its results are the most intense and inescapable.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-light text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Engine Tracking', hi: 'इंजन ट्रैकिंग', sa: 'इञ्जिन-अनुसरणम्' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा वक्री और अस्त इंजन प्रत्येक ग्रह के लिए सटीक अवधियों को ट्रैक करता है — कब वे वक्री या अस्त में प्रवेश और निकास करते हैं। यह डेटा वक्री पंचांग पृष्ठ पर उपलब्ध है। मुहूर्त इंजन भी इस डेटा का उपयोग करता है — अस्त ग्रह की दशा में शुभ मुहूर्त स्कोर कम हो जाता है।</> : <>Our retrograde and combustion engine tracks exact windows for each planet — when they enter and exit retrograde or combustion. This data is available on the Retrograde Calendar page. The muhurta engine also uses this data — auspicious muhurta scores are reduced during combust planet dashas.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

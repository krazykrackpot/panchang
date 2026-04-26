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
  estimatedMinutes: 13,
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
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'वक्री — दृश्य पश्चगामी नृत्य' : 'Retrograde — The Apparent Backward Dance'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वक्री गति कक्षीय यांत्रिकी के कारण एक दृष्टि भ्रम है। कोई भी ग्रह वास्तव में दिशा नहीं बदलता — यह केवल पृथ्वी के परिप्रेक्ष्य से ऐसा दिखता है। राजमार्ग पर दो कारों की कल्पना करें: जब आप धीमी कार को पार करते हैं, तो वह कार दूर के पर्वतों की तुलना में पीछे जाती दिखती है। वही सिद्धान्त ग्रहों पर लागू होता है।</> : <>Retrograde motion is an optical illusion caused by orbital mechanics. No planet actually reverses direction — it only appears to from Earth&apos;s perspective. Think of two cars on a highway: when you overtake a slower car, that car seems to move backward relative to the distant mountains. The same principle applies to planets.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Mercury Retrograde (Budha Vakri)', hi: 'बुध वक्री', sa: 'बुधवक्रता (बुधवक्री)' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>वर्ष में 3-4 बार, प्रत्येक ~21 दिन। सबसे अधिक बार और सांस्कृतिक रूप से सबसे कुख्यात वक्री। बुध संवाद, प्रौद्योगिकी, वाणिज्य और लघु यात्रा का शासक है। वक्री के दौरान: संवाद भ्रम, तकनीकी त्रुटियाँ, अनुबन्ध गलतियाँ, यात्रा विलम्ब। सुझाव: समीक्षा करें, संशोधन करें और पुनः जुड़ें — नये प्रकल्प आरम्भ न करें।</> : <>3-4 times per year, ~21 days each. The most frequent and culturally notorious retrograde. Mercury rules communication, technology, commerce, and short travel. During retrograde: miscommunications, tech glitches, contract errors, travel delays. Tip: review, revise, and reconnect — don&apos;t start new projects.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Venus Retrograde (Shukra Vakri)', hi: 'शुक्र वक्री', sa: 'शुक्रवक्रता (शुक्रवक्री)' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हर 18 महीने, ~40 दिन। शुक्र प्रेम, सौन्दर्य, विलासिता और वित्त का शासक है। वक्री के दौरान: पुराने प्रेमी पुनः प्रकट होते हैं, सम्बन्ध पुनर्मूल्यांकन, सौन्दर्यशास्त्र से असन्तोष, सौन्दर्य प्रसाधन खरीद या विवाह के लिए खराब समय। यह पुनर्मूल्यांकन का समय है कि आप वास्तव में क्या (और किसे) महत्व देते हैं।</> : <>Every 18 months, ~40 days. Venus rules love, beauty, luxury, and finance. During retrograde: old lovers resurface, relationship re-evaluation, dissatisfaction with aesthetics, poor timing for cosmetic purchases or weddings. It&apos;s a time to reassess what (and whom) you truly value.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Mars Retrograde (Mangal Vakri)', hi: 'मंगल वक्री', sa: 'मंगलवक्रता (मंगलवक्री)' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हर 26 महीने, ~72 दिन। मंगल कर्म, ऊर्जा, आक्रामकता और साहस का शासक है। वक्री के दौरान: विलम्बित कार्रवाई, पुराने संघर्षों पर पुनर्विचार, कुण्ठित ऊर्जा, पुनर्निर्देशित महत्वाकांक्षा। शारीरिक ऊर्जा कम अनुभव हो सकती है। लड़ाई (कानूनी, प्रतिस्पर्धी या शारीरिक) शुरू करने के लिए आदर्श नहीं — रणनीतिक योजना के लिए बेहतर।</> : <>Every 26 months, ~72 days. Mars rules action, energy, aggression, and courage. During retrograde: delayed action, revisiting old conflicts, frustrated energy, redirected ambition. Physical energy may feel lower. Not ideal for starting battles (legal, competitive, or physical) — better for strategic planning.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Jupiter & Saturn Retrogrades', hi: 'बृहस्पति और शनि वक्री', sa: 'बृहस्पति-शनिवक्रताः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>दोनों प्रतिवर्ष ~4-5 महीनों के लिए वक्री होते हैं। बृहस्पति वक्री: आन्तरिक विकास, दार्शनिक पुनर्मूल्यांकन, विश्वासों पर प्रश्न। शनि वक्री: उत्तरदायित्वों पर पुनर्विचार, कार्मिक पाठ पुनः प्रकट, विलम्बित लेकिन अन्ततः जवाबदेही। चूँकि वे इतनी बार वक्री होते हैं (~30-40% समय), ये व्यक्तिगत रूप से कम नाटकीय हैं लेकिन पृष्ठभूमि ऊर्जा बदलाव बनाते हैं।</> : <>Both retrograde annually for ~4-5 months. Jupiter retrograde: internal growth, philosophical re-evaluation, questioning beliefs. Saturn retrograde: revisiting responsibilities, karmic lessons resurface, delayed but eventual accountability. Since they retrograde so often (~30-40% of the time), these are less dramatic individually but create a background energy shift.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Key Insight', hi: 'मुख्य अन्तर्दृष्टि', sa: 'मुख्यः अन्तर्बोधः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>वक्री ग्रह पृथ्वी के अधिक निकट होते हैं, दूर नहीं। यह प्रतिकूल ज्ञान है लेकिन महत्वपूर्ण: वक्री ग्रह आकाश में अधिक चमकीला दिखता है, अधिक शक्तिशाली (दुर्बल नहीं) होता है, और इसके प्रभाव अधिक आन्तरिक और तीव्र होते हैं। &quot;पुनः-&quot; उपसर्ग वक्री को पूर्ण रूप से व्यक्त करता है: पुनर्समीक्षा, पुनर्संशोधन, पुनर्विचार, पुनर्सम्पर्क, पुनः करना।</> : <>Retrograde planets are CLOSER to Earth, not farther. This is counterintuitive but critical: a retrograde planet appears brighter in the sky, is stronger (not weaker), and its effects are more internalized and intense. The &quot;re-&quot; prefix captures retrogrades perfectly: review, revise, reconsider, reconnect, redo.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Combustion (Asta) ────────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'अस्त — सूर्य की चमक में लुप्त होना' : 'Combustion (Asta) — Vanishing in the Sun&apos;s Glare'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अस्त तब होता है जब कोई ग्रह सूर्य के बहुत निकट आ जाता है और अदृश्य हो जाता है — सूर्य के तेज प्रकाश से अभिभूत। वैदिक ज्योतिष में, अस्त ग्रह दुर्बल माना जाता है: इसके कारकत्व दबे, भ्रमित या जले हुए हो जाते हैं। प्रत्येक ग्रह की विशिष्ट अस्त दूरी सीमा है।</> : <>Combustion occurs when a planet gets too close to the Sun and becomes invisible — overwhelmed by the Sun&apos;s brilliant light. In Vedic astrology, a combust planet is considered weakened: its significations become suppressed, confused, or burned away. Each planet has a specific combustion distance threshold.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{tl({ en: 'Combustion Distances', hi: 'अस्त दूरियाँ', sa: 'अस्तदूरताः' }, locale)}</p>
            <div className="text-text-secondary text-xs mt-2 space-y-1">{isHi ? <><p><strong className="text-gold-light">चन्द्र:</strong> 12° — भावनात्मक स्पष्टता मन्द, मानसिक धुंध</p>
              <p><strong className="text-gold-light">मंगल:</strong> 17° — साहस/कर्म दबा हुआ, छिपी आक्रामकता</p>
              <p><strong className="text-gold-light">बुध:</strong> 14° (वक्री होने पर 12°) — संवाद भ्रम</p>
              <p><strong className="text-gold-light">बृहस्पति:</strong> 11° — दुर्बल ज्ञान, खराब मार्गदर्शन वृत्ति</p>
              <p><strong className="text-gold-light">शुक्र:</strong> 10° (वक्री होने पर 8°) — सम्बन्ध भ्रम, मन्द सौन्दर्यबोध</p>
              <p><strong className="text-gold-light">शनि:</strong> 15° — अनुशासन टूटता है, संरचना विफल</p></> : <><p><strong className="text-gold-light">Moon (Chandra):</strong> 12° — emotional clarity dimmed, mental fog</p>
              <p><strong className="text-gold-light">Mars (Mangal):</strong> 17° — courage/action suppressed, hidden aggression</p>
              <p><strong className="text-gold-light">Mercury (Budha):</strong> 14° (12° if retrograde) — communication confusion</p>
              <p><strong className="text-gold-light">Jupiter (Guru):</strong> 11° — weakened wisdom, poor guidance instincts</p>
              <p><strong className="text-gold-light">Venus (Shukra):</strong> 10° (8° if retrograde) — relationship confusion, dulled aesthetics</p>
              <p><strong className="text-gold-light">Saturn (Shani):</strong> 15° — discipline breaks down, structure fails</p></>}</div>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Combust vs. Cazimi', hi: 'अस्त बनाम काज़िमी', sa: 'अस्तः विरुद्धं काज़िमी' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>एक विशेष अपवाद है: जब कोई ग्रह सूर्य के अत्यन्त निकट (1° या सूर्य की डिस्क के भीतर) हो, तो इसे &quot;काज़िमी&quot; — सूर्य के हृदय में माना जाता है। यह विरोधाभासी रूप से सबसे शक्तिशाली स्थिति है। ग्रह जला नहीं बल्कि सूर्य के सिंहासन पर बैठकर सशक्त है। यह दुर्लभ और अत्यन्त शुभ है।</> : <>There is a special exception: when a planet is extremely close to the Sun (within ~1° or the Sun&apos;s disk), it is considered &quot;cazimi&quot; — in the heart of the Sun. This is paradoxically the most powerful position. The planet is not burned but empowered by sitting on the Sun&apos;s throne. This is rare and highly auspicious.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-light text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Engine Tracking', hi: 'इंजन ट्रैकिंग', sa: 'इञ्जिन-अनुसरणम्' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा वक्री और अस्त इंजन प्रत्येक ग्रह के लिए सटीक अवधियों को ट्रैक करता है — कब वे वक्री या अस्त में प्रवेश और निकास करते हैं। यह डेटा वक्री पंचांग पृष्ठ पर उपलब्ध है, जो सटीक तिथियाँ और प्रभावित राशि अंश दिखाता है। आप एक नज़र में देख सकते हैं कि कौन से ग्रह वर्तमान में वक्री या अस्त हैं।</> : <>Our retrograde and combustion engine tracks exact windows for each planet — when they enter and exit retrograde or combustion. This data is available on the Retrograde Calendar page, showing precise dates and the affected zodiac degrees. You can see at a glance which planets are currently retrograde or combust.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Practical Impact ─────────────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'वक्री और अस्त का व्यावहारिक प्रभाव' : 'Practical Impact of Retrogrades & Combustion'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वक्री और अस्त अवधियों को समझना आपको ब्रह्माण्डीय लय के साथ योजना बनाने की अनुमति देता है, न कि इसके विरुद्ध। हालाँकि ये घटनाएँ कार्यों को असम्भव नहीं बनातीं, वे ऊर्जा को बदलती हैं — जैसे धारा के साथ या विरुद्ध तैरना।</> : <>Understanding retrograde and combustion windows allows you to plan with the cosmic rhythm rather than against it. While these phenomena don&apos;t make events impossible, they shift the energy — like swimming with or against a current.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Mercury Retrograde: Real Effects', hi: 'बुध वक्री: वास्तविक प्रभाव', sa: 'बुधवक्री: वास्तविकाः प्रभावाः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>बुध वक्री प्रभावों का सांख्यिकीय आधार विवादित है, लेकिन प्रतिमान सामान्यतः देखा जाता है: संवाद भूलें, प्रौद्योगिकी विफलताएँ, अनुबन्ध गलतफहमियाँ और यात्रा व्यवधान। व्यावहारिक रूप से: डेटा बैकअप लें, अनुबन्ध दोबारा जाँचें, यदि सम्भव हो तो महत्वपूर्ण दस्तावेज़ों पर हस्ताक्षर से बचें। सर्वोत्तम उपयोग: पुराने कार्य की समीक्षा, लोगों से पुनर्सम्पर्क, रचना के बजाय सम्पादन।</> : <>While the statistical basis for Mercury retrograde effects is debated, the pattern is commonly observed: communication mishaps, technology failures, contract misunderstandings, and travel disruptions. Practically: back up data, double-check contracts, avoid signing important documents if possible. Best used for: reviewing old work, reconnecting with people, editing rather than creating.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Mars Retrograde: Redirected Fire', hi: 'मंगल वक्री: पुनर्निर्देशित अग्नि', sa: 'मंगलवक्री: पुनर्निर्दिष्टोऽग्निः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>मंगल वक्री विलम्बित कार्रवाई और पुनर्विचारित संघर्ष लाता है। पुराने विवाद समाधान की माँग करते हुए पुनः प्रकट हो सकते हैं। शारीरिक ऊर्जा कम या गलत दिशा में अनुभव हो सकती है। लड़ाई (कानूनी, प्रतिस्पर्धी या शारीरिक) शुरू करने के लिए आदर्श नहीं। सर्वोत्तम उपयोग: रणनीतिक योजना, पुराने संघर्षों का समाधान, आन्तरिक शक्ति-निर्माण, आक्रामक नई दिनचर्या शुरू करने के बजाय फिटनेस दिनचर्या की समीक्षा।</> : <>Mars retrograde brings delayed action and revisited conflicts. Old disputes may resurface demanding resolution. Physical energy may feel lower or misdirected. Not ideal for starting battles (legal, competitive, or physical). Best used for: strategic planning, resolving old conflicts, internal strength-building, reviewing fitness routines rather than starting aggressive new ones.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{tl({ en: 'Combust Venus: Relationship Fog', hi: 'अस्त शुक्र: सम्बन्ध धुंध', sa: 'अस्तशुक्रः: सम्बन्धकुहासः' }, locale)}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब शुक्र अस्त होता है, सम्बन्ध स्पष्टता पीड़ित होती है। लोग खराब रोमांटिक या वित्तीय निर्णय ले सकते हैं। सौन्दर्य और सौन्दर्यशास्त्र &quot;गलत&quot; लगते हैं। यह विवाह, प्रमुख खरीद या नये सम्बन्ध शुरू करने का समय नहीं है। मौजूदा सम्बन्ध अस्पष्ट या तनावपूर्ण लग सकते हैं। अवधि समाप्त हो जाती है जब शुक्र सूर्य से अस्त दूरी से आगे बढ़ जाता है।</> : <>When Venus is combust, relationship clarity suffers. People may make poor romantic or financial decisions. Beauty and aesthetics feel &quot;off.&quot; This is not the time for weddings, major purchases, or starting new relationships. Existing relationships may feel unclear or strained. The period passes once Venus moves beyond the combustion distance from the Sun.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Vakri Planets in Shadbala', hi: 'षड्बल में वक्री ग्रह', sa: 'षड्बले वक्रिग्रहाः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>वक्री अवस्था षड्बल प्रणाली में चेष्टा बल (गतिजन्य शक्ति) देती है। वक्री ग्रह अधिक परिश्रम करता है — यह तीव्र, दृढ़ और माँग करने वाला होता है। जन्म कुण्डली में, वक्री ग्रह अक्सर जीवन के उस क्षेत्र को दर्शाता है जहाँ जातक को अतिरिक्त प्रयास करना, पिछले कर्म पर पुनर्विचार करना, या अपरम्परागत माध्यमों से विकास करना होता है। हमारे ऐप का वक्री पंचांग पृष्ठ वर्ष भर के सभी ग्रहीय वक्री और अस्त अवधियों की सटीक तिथियाँ दिखाता है।</> : <>The Vakri (retrograde) state gives Cheshta Bala (motional strength) in the Shadbala system. A retrograde planet works harder — it is intense, determined, and demanding. In a birth chart, a retrograde planet often indicates an area of life where the native must put in extra effort, revisit past karma, or develop through unconventional means. Our app&apos;s Retrograde Calendar page shows exact dates for all planetary retrogrades and combustion windows throughout the year.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

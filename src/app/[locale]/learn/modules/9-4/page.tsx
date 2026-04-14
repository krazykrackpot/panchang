'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/9-4.json';

const META: ModuleMeta = {
  id: 'mod_9_4', phase: 3, topic: 'Kundali', moduleNumber: '9.4',
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
          {tl({ en: 'The 5-Step Systematic Approach', hi: '5-चरणीय व्यवस्थित दृष्टिकोण', sa: '5-चरणीय व्यवस्थित दृष्टिकोण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कुण्डली पढ़ना पहली नाटकीय विशेषता पर कूद पड़ने के बारे में नहीं है। इसके लिए एक अनुशासित, व्यवस्थित दृष्टिकोण आवश्यक है — जैसे एक डॉक्टर एक लक्षण से अनुमान लगाने के बजाय व्यवस्थित रूप से रोगी की जाँच करता है। यहाँ अनुभवी ज्योतिषियों द्वारा उपयोग किया जाने वाला ढाँचा है:</> : <>Reading a Kundali is not about jumping to the first dramatic feature you notice. It requires a disciplined, systematic approach — just as a doctor examines a patient methodically rather than guessing from one symptom. Here is the framework used by experienced Jyotishis:</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Step 1: Note the Lagna sign and its lord / चरण 1: लग्न राशि और उसका स्वामी</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>कौन सी राशि उदय हो रही है? उसका स्वामी कहाँ स्थित है (भाव, राशि, गरिमा)? स्वामी बलवान है या दुर्बल? लग्न स्वामी की स्थिति पूरे जीवन का स्वर निर्धारित करती है। सशक्त, सुस्थित लग्न स्वामी = लचीला, आत्मनिर्देशित जातक। दुर्बल, पीड़ित स्वामी = अतिरिक्त प्रयास की आवश्यकता वाली जीवन चुनौतियाँ।</> : <>Which sign is rising? Where is its lord placed (house, sign, dignity)? Is the lord strong or weak? The Lagna lord&apos;s condition sets the tone for the entire life. A strong, well-placed Lagna lord = resilient, self-directed native. A weak, afflicted lord = life challenges requiring extra effort.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Step 2: Check each planet / चरण 2: प्रत्येक ग्रह की जाँच</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>9 ग्रहों में से प्रत्येक के लिए नोट करें: कौन सा भाव, कौन सी राशि, कौन सी गरिमा (उच्च/स्व/नीच/मित्र/शत्रु), क्या वक्री है, क्या अस्त है (सूर्य के बहुत निकट), कौन से ग्रह दृष्टि डालते हैं, और कौन से ग्रह युक्त हैं। यह व्याख्या से पहले आपका कच्चा डेटा बनाता है।</> : <>For each of the 9 grahas, note: which house, which sign, what dignity (exalted/own/debilitated/friend/enemy), is it retrograde, is it combust (too close to Sun), which planets aspect it, and which planets conjoin it. This builds your raw data before interpretation.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Step 3: Identify yogas / चरण 3: योगों की पहचान</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>राजयोग (केन्द्र-त्रिकोण स्वामी संयोजन), धनयोग, पंच महापुरुष योग (मंगल/बुध/बृहस्पति/शुक्र/शनि केन्द्र में स्व/उच्च राशि में), और दोष (मंगल दोष, कालसर्प आदि) खोजें। योग व्यक्तिगत ग्रह स्थितियों से परे कुण्डली का विशेष वादा प्रकट करते हैं।</> : <>Look for Raja Yogas (Kendra-Trikona lord combinations), Dhana Yogas (wealth), Pancha Mahapurusha Yogas (Mars/Mercury/Jupiter/Venus/Saturn in Kendras in own/exalted signs), and doshas (Mangal Dosha, Kaal Sarpa, etc.). Yogas reveal the chart&apos;s special promise beyond individual planet placements.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Step 4: Check dasha sequence / चरण 4: दशा क्रम जाँचें</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>विंशोत्तरी दशा प्रणाली प्रकट करती है कि कुण्डली के वादे कब सक्रिय होते हैं। राजयोग केवल योगकारक ग्रहों की महादशा या अन्तर्दशा में ही फलित होता है। वर्तमान दशा काल और आने वाले वर्षों में कौन से ग्रह सक्रिय होंगे, इसकी पहचान करें।</> : <>The Vimshottari Dasha system reveals WHEN the chart&apos;s promises activate. A Raja Yoga only delivers results during the Maha Dasha or Antar Dasha of the yoga-forming planets. Identify the current dasha period and which planets will be activated in the coming years.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">Step 5: Apply transit overlay / चरण 5: गोचर आच्छादन</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>वर्तमान ग्रह स्थितियाँ (गोचर) जन्म कुण्डली के संकेतों को संशोधित करती हैं। शनि का जन्म चन्द्र पर गोचर (साढ़ेसाती), बृहस्पति का केन्द्र पर गोचर, या राहु-केतु का प्रमुख भावों पर गोचर विशिष्ट घटनाओं का समय निर्धारित करता है। दशा दशक बताती है, गोचर महीना बताता है।</> : <>Current planetary positions (transits/gochar) modify the birth chart&apos;s indications. Saturn transiting over the natal Moon (Sade Sati), Jupiter transiting a Kendra, or Rahu-Ketu transiting key houses all time specific events. Dasha tells the decade, transit tells the month.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><strong className="text-gold-light">भ्रांति:</strong> &quot;मैं सप्तम भाव में शनि देख रहा हूँ, तो विवाह में विलम्ब/कठिनाई होगी।&quot; यह एक शास्त्रीय शुरुआती गलती है — एक कारक से निष्कर्ष पर पहुँचना। सप्तम में शनि का अर्थ हो सकता है: विलम्बित लेकिन स्थिर विवाह (शनि = धीमा लेकिन स्थायी), परिपक्व/बड़ी उम्र का साथी, शनि-संबंधित पेशे में भागीदार, या साझेदारियों में अनुशासन। आपको शनि की गरिमा, स्वामित्व, शुभ ग्रहों की दृष्टि, सप्तम स्वामी की स्थिति, शुक्र (विवाह कारक), नवमांश सप्तम भाव, और दशा काल की जाँच करनी चाहिए। तभी आप निष्कर्ष का संश्लेषण कर सकते हैं।</> : <><strong className="text-gold-light">Misconception:</strong> &quot;I see Saturn in the 7th house, so marriage will be delayed/troubled.&quot; This is a classic beginner error — jumping to conclusions from one factor. Saturn in the 7th could mean: delayed but stable marriage (Saturn = slow but lasting), a mature/older spouse, a partner in a Saturn-related profession, or discipline in partnerships. You must check Saturn&apos;s dignity, lordship, aspects from benefics, the 7th lord&apos;s condition, Venus (karaka for marriage), Navamsha 7th house, and the dasha period. Only then can you synthesize a conclusion.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Shadbala — The Six Strengths ───────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Shadbala — The Six Strengths', hi: 'षड्बल — छह शक्तियाँ', sa: 'षड्बल — छह शक्तियाँ' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>षड्बल BPHS से व्यापक शक्ति मूल्यांकन प्रणाली है जो मापता है कि किसी कुण्डली में प्रत्येक ग्रह कितना शक्तिशाली है। ग्रह गरिमा से उच्च (शक्तिशाली) हो सकता है लेकिन अन्य मापदंडों से दुर्बल। षड्बल छह स्वतंत्र शक्ति गणनाओं को रूप (इकाई) में मापे गए एकल अंक में संयोजित करता है।</> : <>Shadbala is the comprehensive strength assessment system from BPHS that quantifies how powerful each planet is in a given chart. A planet may be exalted (strong by dignity) but weak by other measures. Shadbala combines six independent strength calculations into a single score measured in Rupas (units).</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">1. Sthana Bala (Positional) / स्थान बल</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>राशि स्थिति से शक्ति — उच्च, स्वराशि, मूलत्रिकोण, मित्र/शत्रु स्थिति। इसमें सप्तवर्गज बल (7 वर्ग कुण्डलियों में गरिमा) भी शामिल है। यह मॉड्यूल 9.3 में कवर की गई गरिमा-आधारित शक्ति है।</> : <>Strength from sign placement — exaltation, own sign, Moolatrikona, friend/enemy status. Also includes Saptavargaja Bala (dignity across 7 divisional charts). This is the dignity-based strength we covered in Module 9.3.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">2. Dig Bala (Directional) / दिग् बल</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रत्येक ग्रह एक विशिष्ट दिशा (केन्द्र भाव) में अधिकतम शक्ति प्राप्त करता है। बृहस्पति और बुध प्रथम भाव (पूर्व) में सबसे बलवान। सूर्य और मंगल दशम (दक्षिण) में। शनि सप्तम (पश्चिम) में। चन्द्र और शुक्र चतुर्थ (उत्तर) में सर्वोत्तम।</> : <>Each planet gains maximum strength in a specific direction (Kendra house). Jupiter and Mercury are strongest in the 1st house (East). Sun and Mars thrive in the 10th (South). Saturn dominates in the 7th (West). Moon and Venus excel in the 4th (North).</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">3. Kala Bala (Temporal) / काल बल</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जन्म समय पर आधारित शक्ति। दिवसचर ग्रह (सूर्य, बृहस्पति, शुक्र) दिन के जन्म में शक्ति प्राप्त करते हैं। रात्रिचर ग्रह (चन्द्र, मंगल, शनि) रात के जन्म में। इसमें वार, मास, वर्ष और होरा (घंटा) से शक्ति भी शामिल है।</> : <>Strength based on time of birth. Diurnal planets (Sun, Jupiter, Venus) gain strength in daytime births. Nocturnal planets (Moon, Mars, Saturn) gain strength in nighttime births. Also includes strength from the weekday, month, year, and hora (hour) of birth.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">4. Cheshta Bala (Motional) / चेष्टा बल</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ग्रह गति से शक्ति। वक्री ग्रह चेष्टा बल प्राप्त करते हैं (वे अधिक चमकीले और पृथ्वी के निकट दिखते हैं)। अधिकतम गति से चलने वाले ग्रह भी शक्ति प्राप्त करते हैं। अस्त ग्रह (सूर्य के बहुत निकट) चेष्टा बल खो देते हैं।</> : <>Strength from planetary motion. Retrograde planets gain Cheshta Bala (they appear brighter and closer to Earth). Planets moving at maximum speed also gain strength. Combust planets (too close to Sun) lose Cheshta Bala.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">5. Naisargika Bala (Natural) / नैसर्गिक बल</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>अंतर्निहित शक्ति जो कभी नहीं बदलती: सूर्य (60) &gt; चन्द्र (51.4) &gt; शुक्र (42.8) &gt; बृहस्पति (34.3) &gt; मंगल (25.7) &gt; बुध (17.1) &gt; शनि (8.6)। यह प्रत्यक्ष चमक पर आधारित है। सूर्य के पास कुण्डली स्थिति की परवाह किए बिना शनि से हमेशा अधिक कच्ची शक्ति होती है।</> : <>Inherent strength that never changes: Sun (60) &gt; Moon (51.4) &gt; Venus (42.8) &gt; Jupiter (34.3) &gt; Mars (25.7) &gt; Mercury (17.1) &gt; Saturn (8.6). This is based on apparent luminosity. The Sun always has more raw power than Saturn, regardless of chart placement.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">6. Drig Bala (Aspectual) / दृग् बल</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>दृष्टियों से प्राप्त या खोई शक्ति। शुभ दृष्टि (बृहस्पति, शुक्र, सुस्थित बुध/चन्द्र) दृग् बल जोड़ती है। पाप दृष्टि (शनि, मंगल, राहु) इसे घटाती है। बृहस्पति की दृष्टि प्राप्त ग्रह अन्य दुर्बलताओं के बावजूद महत्वपूर्ण समर्थन प्राप्त करता है।</> : <>Strength gained or lost from aspects. Benefic aspects (Jupiter, Venus, well-placed Mercury/Moon) add Drig Bala. Malefic aspects (Saturn, Mars, Rahu) reduce it. A planet aspected by Jupiter gains significant support regardless of other weaknesses.</>}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Page 3: Worked Example — Scorpio Lagna Chart ───────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Worked Example: Scorpio Lagna Chart', hi: 'कार्यान्वित उदाहरण: वृश्चिक लग्न कुण्डली', sa: 'कार्यान्वित उदाहरण: वृश्चिक लग्न कुण्डली' }, locale)}
        </h3>
        <ExampleChart
          ascendant={8}
          planets={{ 10: [0], 5: [4], 7: [6], 6: [1], 3: [2] }}
          title={tl({ en: 'Scorpio Lagna — Sun 10th, Jupiter 5th, Saturn 7th, Moon 6th, Mars 3rd', hi: 'वृश्चिक लग्न — सूर्य दशम, बृहस्पति पंचम, शनि सप्तम, चन्द्र षष्ठ, मंगल तृतीय', sa: 'वृश्चिक लग्न — सूर्य दशम, बृहस्पति पंचम, शनि सप्तम, चन्द्र षष्ठ, मंगल तृतीय' }, locale)}
          highlight={[10, 5, 7, 3]}
        />
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>हमारे 5-चरणीय ढाँचे का उपयोग करके एक पूर्ण कुण्डली पठन करते हैं। विचार करें: <strong className="text-gold-light">वृश्चिक लग्न</strong>, सूर्य सिंह (दशम भाव) में, बृहस्पति मीन (पंचम भाव) में, शनि वृषभ (सप्तम भाव) में, चन्द्र मेष (षष्ठ भाव) में, मंगल मकर (तृतीय भाव) में।</> : <>Let us walk through a complete chart reading using our 5-step framework. Consider a chart with: <strong className="text-gold-light">Scorpio (Vrishchika) Lagna</strong>, Sun in Leo (10th house), Jupiter in Pisces (5th house), Saturn in Taurus (7th house), Moon in Aries (6th house), Mars in Capricorn (3rd house).</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Step-by-Step Analysis', hi: 'चरण-दर-चरण विश्लेषण', sa: 'चरण-दर-चरण विश्लेषण' }, locale)}</h4>

        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चरण 1 — लग्न:</span> वृश्चिक लग्न, स्वामी मंगल। मंगल मकर (तृतीय भाव) में — उसकी <strong className="text-gold-light">उच्च</strong> राशि। यह उत्कृष्ट है: लग्न स्वामी उपचय भाव (तृतीय = साहस, पहल) में शिखर शक्ति पर है। जातक साहसी, स्वनिर्मित है और बोल्ड कार्रवाई करता है।</> : <><span className="text-gold-light font-medium">Step 1 — Lagna:</span> Scorpio Lagna, ruled by Mars. Mars is in Capricorn (3rd house) — its sign of <strong className="text-gold-light">exaltation</strong>. This is excellent: the Lagna lord is at peak strength in an Upachaya house (3rd = courage, initiative). The native is courageous, self-made, and takes bold action.</>}</p>

        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चरण 2 — ग्रह:</span> सूर्य सिंह (दशम) में — स्वराशि, शक्तिशाली कैरियर स्थिति। दशम स्वामी दशम में व्यावसायिक अधिकार की पहचान है। बृहस्पति मीन (पंचम) में — स्वराशि, संतान, शिक्षा, रचनात्मकता और आध्यात्मिक ज्ञान के लिए उत्कृष्ट। शनि वृषभ (सप्तम) में — मित्र राशि (शनि शुक्र का मित्र), स्थिर लेकिन अनुशासित विवाह साथी का संकेत।</> : <><span className="text-gold-light font-medium">Step 2 — Planets:</span> Sun in Leo (10th) — own sign, powerful career placement. The 10th lord in the 10th is a signature of professional authority. Jupiter in Pisces (5th) — own sign, excellent for children, education, creativity, and spiritual wisdom. Saturn in Taurus (7th) — friendly sign (Saturn is friendly with Venus), indicates a stable but disciplined marriage partner.</>}</p>

        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चरण 3 — योग:</span> बृहस्पति (पंचम स्वामी, त्रिकोण) पंचम से लग्न पर दृष्टि डालता है (9वीं दृष्टि प्रथम पर)। पंचम में स्वराशि में बृहस्पति आंशिक <strong className="text-gold-light">हंस योग</strong> (महापुरुष) है। सूर्य दशम स्वामी स्वराशि में केन्द्र में एक और शक्ति चिह्न बनाता है। सबसे महत्वपूर्ण: बृहस्पति (पंचम स्वामी = त्रिकोण) और सूर्य (दशम स्वामी = केन्द्र) परस्पर त्रिकोण में हैं — यह भाग्य को कैरियर से जोड़ने वाला <strong className="text-gold-light">राजयोग</strong> है।</> : <><span className="text-gold-light font-medium">Step 3 — Yogas:</span> Jupiter (5th lord, Trikona) aspects the Lagna from the 5th house (9th aspect hits the 1st). Jupiter in the 5th in own sign is a partial <strong className="text-gold-light">Hamsa Yoga</strong> (Mahapurusha). Sun as 10th lord in own sign in Kendra forms another strength signature. Most importantly: Jupiter (5th lord = Trikona) and Sun (10th lord = Kendra) are in mutual trine — this is a <strong className="text-gold-light">Raja Yoga</strong> connecting fortune with career.</>}</p>

        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चरण 4 — शनि की सप्तम दृष्टि:</span> सप्तम में शनि लग्न पर (7वीं दृष्टि), नवम भाव पर (3री दृष्टि), और चतुर्थ भाव पर (10वीं दृष्टि) दृष्टि डालता है। शनि की लग्न पर दृष्टि अनुशासन और दीर्घायु लाती है लेकिन व्यक्तित्व में कुछ गम्भीरता भी। जातक अपनी उम्र से अधिक परिपक्व होता है।</> : <><span className="text-gold-light font-medium">Step 4 — Saturn&apos;s 7th house aspect:</span> Saturn in the 7th aspects the Lagna (7th aspect), the 9th house (3rd aspect), and the 4th house (10th aspect). Saturn&apos;s aspect on the Lagna brings discipline and longevity but also some seriousness to personality. The native is mature beyond their years.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Synthesis — Putting It All Together', hi: 'संश्लेषण — सब कुछ मिलाकर', sa: 'संश्लेषण — सब कुछ मिलाकर' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>यह कुण्डली एक साहसी, स्वनिर्मित व्यक्ति (उच्च मंगल लग्न स्वामी) की है जिसके पास सशक्त कैरियर अधिकार (सूर्य स्वराशि दशम में), संतान/शिक्षा में ज्ञान और सौभाग्य (बृहस्पति स्वराशि पंचम में), और स्थिर, परिपक्व विवाह (शनि मित्र सप्तम में) है। पंचम और दशम स्वामियों के बीच राजयोग दर्शाता है कि भाग्य, शिक्षा और कैरियर सफलता गहराई से जुड़े हैं — शायद एक सफल शिक्षाविद्, आध्यात्मिक गुरु, या रचनात्मक नेता। शनि की लग्न पर दृष्टि गम्भीरता और सहनशक्ति जोड़ती है।</> : <>This chart belongs to a courageous, self-made individual (exalted Mars Lagna lord) with strong career authority (Sun in own 10th), wisdom and good fortune in children/education (Jupiter in own 5th), and a stable, mature marriage (Saturn in friendly 7th). The Raja Yoga between the 5th and 10th lords indicates that fortune, education, and career success are deeply connected — perhaps a successful academic, spiritual teacher, or creative leader. Saturn&apos;s aspect on the Lagna adds gravitas and endurance.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा ऐप यह सम्पूर्ण विश्लेषण स्वचालित रूप से करता है। जब आप कुण्डली बनाते हैं, तो टिप्पणी इंजन प्रत्येक ग्रह की गरिमा का मूल्यांकन करता है, सभी प्रमुख योगों और दोषों की पहचान करता है, षड्बल अंकों की गणना करता है, और एक व्यापक व्याख्यात्मक वर्णन का संश्लेषण करता है। इस मॉड्यूल में वर्णित व्यवस्थित ढाँचा ठीक वही है जो हमारे एल्गोरिदम लागू करते हैं — वही शास्त्रीय नियम, अब आधुनिक सटीकता के साथ गणित।</> : <>Our app performs this entire analysis automatically. When you generate a Kundali, the tippanni engine evaluates every planet&apos;s dignity, identifies all major yogas and doshas, calculates Shadbala scores, and synthesizes a comprehensive interpretive narrative. The systematic framework described in this module is exactly what our algorithms implement — the same classical rules, now computed with modern precision.</>}</p>
      </section>
    </div>
  );
}

export default function Module9_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


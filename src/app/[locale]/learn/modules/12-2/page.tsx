'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/12-2.json';

const META: ModuleMeta = {
  id: 'mod_12_2', phase: 3, topic: 'Transits', moduleNumber: '12.2',
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
          {tl({ en: 'What is Sade Sati?', hi: 'साढ़े साती क्या है?', sa: 'साढ़े साती क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>साढ़े साती (शाब्दिक अर्थ &quot;साढ़े सात&quot;) वैदिक ज्योतिष में सर्वाधिक भयप्रद और चर्चित गोचर है। यह तब होती है जब शनि तीन क्रमागत राशियों से गोचर करता है: जन्म चन्द्र राशि से 12वाँ, 1ला (चन्द्रमा पर) और 2रा भाव। चूँकि शनि प्रत्येक राशि में लगभग 2.5 वर्ष रहता है, कुल अवधि लगभग 7.5 वर्ष है। चन्द्रमा — मन, भावनाओं और सुख के ग्रह — पर शनि के इस दीर्घकालिक दबाव से रूपान्तरण की विस्तारित भट्ठी बनती है।</> : <>Sade Sati (literally &quot;seven and a half&quot;) is the most feared and discussed transit in Vedic astrology. It occurs when Saturn (Shani) transits through three consecutive signs: the 12th, 1st (over the Moon), and 2nd houses from the natal Moon sign. Since Saturn spends approximately 2.5 years in each sign, the total duration is about 7.5 years. This prolonged period of Saturnian pressure on the Moon — the planet of mind, emotions, and comfort — creates an extended crucible of transformation.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example — Sade Sati Timeline', hi: 'उदाहरण — साढ़े साती समयरेखा', sa: 'उदाहरण — साढ़े साती समयरेखा' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> जन्म चन्द्रमा मिथुन में। शनि वृषभ (मिथुन से 12वाँ) में प्रवेश ≈ जून 2030 — आरोही चरण आरम्भ। शनि मिथुन (चन्द्रमा पर) में ≈ जुलाई 2032 — शिखर चरण। शनि कर्क (मिथुन से 2रा) में ≈ अगस्त 2034 — अवरोही चरण। शनि सिंह में ≈ अक्टूबर 2036 — साढ़े साती समाप्त।</> : <><span className="text-gold-light font-medium">Example:</span> Natal Moon in Gemini. Saturn enters Taurus (12th from Gemini) around June 2030 — rising phase begins. Saturn enters Gemini (over Moon) around July 2032 — peak phase. Saturn enters Cancer (2nd from Gemini) around August 2034 — setting phase. Saturn enters Leo around October 2036 — Sade Sati ends. Total duration approximately 6 years 4 months.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Three Phases', hi: 'तीन चरण', sa: 'तीन चरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">आरोही चरण (चन्द्र से 12वाँ):</span> शनि आपकी चन्द्र राशि से पहली राशि में प्रवेश करता है। 12वाँ भाव हानि, व्यय, निद्रा और अवचेतन का शासक है। यह चरण बढ़ती चिन्ता, अनिद्रा और बदलाव की अनुभूति लाता है।</> : <><span className="text-gold-light font-medium">Rising Phase (12th from Moon):</span> Saturn enters the sign before your Moon sign. The 12th house governs losses, expenses, sleep, and the subconscious. This phase brings growing anxiety, disturbed sleep, increased expenses, and a nagging sense that something is about to change.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-red-400 font-medium">शिखर चरण (चन्द्रमा पर):</span> शनि सीधे जन्म चन्द्रमा पर गोचर करता है। यह सर्वाधिक तीव्र चरण है — अधिकतम भावनात्मक दबाव, बाध्य रूपान्तरण और गहन कार्मिक सामना।</> : <><span className="text-red-400 font-medium">Peak Phase (over the Moon):</span> Saturn directly transits over your natal Moon. This is the most intense phase — maximum emotional pressure, forced transformation, potential health issues, career upheavals, and deep karmic confrontations.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-emerald-400 font-medium">अवरोही चरण (चन्द्र से 2रा):</span> शनि आपकी चन्द्र राशि के बाद की राशि में जाता है। आर्थिक दबाव और पारिवारिक तनाव धीरे-धीरे समाधान की ओर बढ़ते हैं। यह पुनर्प्राप्ति चरण है।</> : <><span className="text-emerald-400 font-medium">Setting Phase (2nd from Moon):</span> Saturn moves to the sign after your Moon sign. The 2nd house governs wealth, family, and speech. Financial pressures and family tensions gradually resolve. This is the recovery phase.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Severity Factors                                          */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Determines Severity?', hi: 'तीव्रता किससे निर्धारित होती है?', sa: 'तीव्रता किससे निर्धारित होती है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सभी साढ़े साती समान रूप से कठोर नहीं होतीं। तीव्रता अनेक कुण्डली कारकों के आधार पर अत्यधिक भिन्न होती है। इन कारकों को समझना साढ़े साती को सामान्य भय से एक सूक्ष्म भविष्यसूचक उपकरण में बदल देता है।</> : <>Not all Sade Satis are equally harsh. The severity varies enormously based on multiple chart factors. Understanding these factors transforms Sade Sati from a blanket fear into a nuanced predictive tool. The same transit that devastates one person may catalyze greatness in another.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Key Severity Factors', hi: 'प्रमुख तीव्रता कारक', sa: 'प्रमुख तीव्रता कारक' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">1. Natal Saturn&apos;s Dignity:</span> If Saturn is exalted (Libra), in own sign (Capricorn/Aquarius), or in a friendly sign, Sade Sati produces discipline and growth. Debilitated (Aries) or afflicted Saturn makes effects harsher.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">2. Moon&apos;s Strength:</span> A strong Moon (exalted in Taurus, own sign Cancer, waxing, conjunct benefics) withstands Saturn&apos;s pressure better. A weak Moon amplifies suffering.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">3. Ashtakavarga Bindus:</span> Saturn&apos;s bindus in the three transit signs (12th, 1st, 2nd from Moon) directly modulate intensity. High bindus (5-8) = mild. Low bindus (0-2) = severe.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">4. Current Dasha:</span> Saturn dasha + Sade Sati = double Saturn effect (most difficult). Jupiter or Venus dasha provides a protective buffer.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">5. Saturn&apos;s Functional Role:</span> For Taurus and Libra lagnas, Saturn is Yoga Karaka — even during Sade Sati it delivers career breakthroughs. For Cancer and Leo lagnas, Saturn rules dusthanas and the transit tends harsher.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Remedial Measures', hi: 'उपचार', sa: 'उपचार' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>शास्त्रीय उपचार जो शनि की ऊर्जा को शांत करने के लिए बताये गये हैं: शनिवार को तेल, काले तिल, लोहे की वस्तुएँ दान करना। हनुमान चालीसा या शनि स्तोत्र का पाठ। सेवा कार्य (निम्नवर्गीय लोगों की सहायता) — शनि सेवा का ग्रह है।</> : <>Classical remedies prescribed for Saturn&apos;s energy: donating oil, black sesame, iron items on Saturdays. Recitation of Hanuman Chalisa or Shani Stotra. Service work (helping underprivileged people) — Saturn is the planet of service. These remedies work by aligning the native&apos;s actions with Saturn&apos;s fundamental nature: discipline, humility, and compassion for the suffering.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>सबसे शक्तिशाली &quot;उपचार&quot; शनि के सिद्धांतों के अनुरूप जीना है: कठिन परिश्रम, ईमानदारी, धैर्य, और जिम्मेदारी स्वीकार करना। शनि उन्हें पुरस्कृत करता है जो उसके मार्ग पर चलते हैं।</> : <>The most powerful &quot;remedy&quot; is living in alignment with Saturn&apos;s principles: hard work, honesty, patience, and accepting responsibility. Saturn rewards those who walk his path willingly rather than being dragged along it.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Historical Patterns                                       */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Life Cycle Patterns', hi: 'जीवन चक्र प्रतिमान', sa: 'जीवन चक्र प्रतिमान' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>शनि की लगभग 29.5 वर्ष की कक्षा अवधि का अर्थ है कि साढ़े साती लगभग 30 वर्ष के चक्र में पुनरावृत्त होती है। अधिकांश लोग जीवन में 2-3 साढ़े साती अनुभव करते हैं, प्रत्येक एक विशिष्ट विकास चरण से सम्बद्ध।</> : <>Saturn&apos;s orbital period of approximately 29.5 years means Sade Sati recurs in a roughly 30-year cycle. Most people experience 2-3 Sade Satis in their lifetime, each corresponding to a distinct developmental stage. Understanding which Sade Sati you are in reveals the specific life lessons being demanded.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Three Life Sade Satis', hi: 'तीन जीवनकालीन साढ़े साती', sa: 'तीन जीवनकालीन साढ़े साती' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">{isHi ? <><span className="text-gold-light font-medium">पहली (~आयु 22-30):</span> शनि की प्रथम वापसी — सच्ची प्रौढ़ता। करियर स्थापना, जिम्मेदारी, ठोस नींव निर्माण की माँग।</> : <><span className="text-gold-light font-medium">First (~Age 22-30):</span> Saturn&apos;s first return — true adulthood. The universe demands career establishment, responsibility, and building foundations. Those who embrace discipline emerge with a lasting identity.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">{isHi ? <><span className="text-gold-light font-medium">दूसरी (~आयु 52-60):</span> सर्वाधिक भावनात्मक — स्वास्थ्य चिन्ताएँ, माता-पिता का वियोग, मृत्यु और विरासत का सामना।</> : <><span className="text-gold-light font-medium">Second (~Age 52-60):</span> The most emotionally intense. Health concerns emerge, parents may pass away, career peaks or plateaus. Forces a reckoning with what truly matters.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'तीसरी (~आयु 82-90):' : 'Third (~Age 82-90):'}</span> {isHi ? <>बन्द होना, स्वीकृति और आध्यात्मिक समर्पण। शनि उन्हें पुरस्कृत करता है जिन्होंने पिछले चक्रों में उसके पाठ सीखे हैं।</> : <>Closure, acceptance, and spiritual surrender. Physical limitations increase, but those with strong spiritual practices often find this period peaceful — Saturn rewards those who have learned his lessons.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Hidden Gift', hi: 'छिपा हुआ वरदान', sa: 'छिपा हुआ वरदान' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Despite its fearsome reputation, Sade Sati is ultimately Saturn&apos;s gift of maturity. Many of history&apos;s greatest achievements — career breakthroughs, spiritual awakenings, masterworks of art — have occurred during Sade Sati. Saturn does not destroy; he removes what is false so that what is true can emerge. What survives Sade Sati becomes unshakable.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रांतियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;साढ़े साती में शुभ कार्य वर्जित है।&quot; वास्तविकता: शुभ मुहूर्त चुनने से शनि का प्रभाव शमित होता है। जीवन 7.5 वर्ष नहीं रुकता।</> : <>&quot;No auspicious work during Sade Sati.&quot; Reality: millions marry and start businesses during Sade Sati. Choosing auspicious Muhurtas mitigates Saturn&apos;s influence.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;साढ़े साती सदैव तबाही लाती है।&quot; वास्तविकता: उच्च शनि वालों के लिए यह करियर उन्नति का काल होती है।</> : <>&quot;Sade Sati always brings devastation.&quot; Reality: for natives with strong natal Saturn, Sade Sati is often a period of career advancement.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">{isHi ? 'भ्रांति:' : 'Myth:'}</span> {isHi ? <>&quot;ढैय्या कम प्रभावशाली है।&quot; वास्तविकता: शनि चन्द्र से 8वें में कभी-कभी अधिक तीव्र होती है।</> : <>&quot;Dhaiyya is less impactful.&quot; Reality: Saturn in the 8th from Moon can be more intense than Sade Sati itself.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>हमारे ऐप का साढ़े साती उपकरण शनि के गोचर की गणना करता है और बताता है कि आप किस चरण में हैं। अष्टकवर्ग बिन्दुओं के आधार पर तीव्रता मूल्यांकन भी होता है। मॉड्यूल 12.1 में अष्टकवर्ग और 12.3 में गुरु-राहु-केतु गोचर देखें।</> : <>Our Sade Sati tool calculates Saturn&apos;s transit relative to your natal Moon and tells you which phase you are in. It evaluates intensity based on Ashtakavarga bindus. See Module 12.1 for Ashtakavarga scoring and Module 12.3 for Jupiter and Rahu-Ketu transit details.</>}</p>
      </section>
    </div>
  );
}

export default function Module12_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

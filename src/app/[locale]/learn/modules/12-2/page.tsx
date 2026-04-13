'use client';

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
          {isHi ? 'साढ़े साती क्या है?' : 'What is Sade Sati?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>साढ़े साती (शाब्दिक अर्थ &quot;साढ़े सात&quot;) वैदिक ज्योतिष में सर्वाधिक भयप्रद और चर्चित गोचर है। यह तब होती है जब शनि तीन क्रमागत राशियों से गोचर करता है: जन्म चन्द्र राशि से 12वाँ, 1ला (चन्द्रमा पर) और 2रा भाव। चूँकि शनि प्रत्येक राशि में लगभग 2.5 वर्ष रहता है, कुल अवधि लगभग 7.5 वर्ष है। चन्द्रमा — मन, भावनाओं और सुख के ग्रह — पर शनि के इस दीर्घकालिक दबाव से रूपान्तरण की विस्तारित भट्ठी बनती है।</> : <>Sade Sati (literally &quot;seven and a half&quot;) is the most feared and discussed transit in Vedic astrology. It occurs when Saturn (Shani) transits through three consecutive signs: the 12th, 1st (over the Moon), and 2nd houses from the natal Moon sign. Since Saturn spends approximately 2.5 years in each sign, the total duration is about 7.5 years. This prolonged period of Saturnian pressure on the Moon — the planet of mind, emotions, and comfort — creates an extended crucible of transformation.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'तीन चरण' : 'The Three Phases'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">आरोही चरण (चन्द्र से 12वाँ):</span> शनि आपकी चन्द्र राशि से पहली राशि में प्रवेश करता है। 12वाँ भाव हानि, व्यय, निद्रा और अवचेतन का शासक है। यह चरण बढ़ती चिन्ता, अनिद्रा, बढ़ा हुआ व्यय और बदलाव की अनुभूति लाता है। यह तैयारी है — बारिश से पहले बादलों का जमाव।</> : <><span className="text-gold-light font-medium">Rising Phase (12th from Moon):</span> Saturn enters the sign before your Moon sign. The 12th house governs losses, expenses, sleep, and the subconscious. This phase brings growing anxiety, disturbed sleep, increased expenses, and a nagging sense that something is about to change. It is the preparation — the storm clouds gathering before the rain.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-red-400 font-medium">शिखर चरण (चन्द्रमा पर):</span> शनि सीधे जन्म चन्द्रमा पर गोचर करता है। यह सर्वाधिक तीव्र चरण है — अधिकतम भावनात्मक दबाव, बाध्य रूपान्तरण, सम्भावित स्वास्थ्य समस्याएँ, करियर उथल-पुथल और गहन कार्मिक सामना। यह अप्रामाणिक को छीन लेता है और सत्य से पुनर्निर्माण के लिए बाध्य करता है।</> : <><span className="text-red-400 font-medium">Peak Phase (over the Moon):</span> Saturn directly transits over your natal Moon. This is the most intense phase — maximum emotional pressure, forced transformation, potential health issues, career upheavals, and deep karmic confrontations. It strips away what is not authentic and forces you to rebuild from a place of truth.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-emerald-400 font-medium">अवरोही चरण (चन्द्र से 2रा):</span> शनि आपकी चन्द्र राशि के बाद की राशि में जाता है। 2रा भाव धन, परिवार, वाणी और संचित संसाधनों का शासक है। आर्थिक दबाव और पारिवारिक तनाव धीरे-धीरे समाधान की ओर बढ़ते हैं। यह पुनर्प्राप्ति चरण है — तूफान गुजरता है और आप अपनी सहनशीलता के फल देखने लगते हैं।</> : <><span className="text-emerald-400 font-medium">Setting Phase (2nd from Moon):</span> Saturn moves to the sign after your Moon sign. The 2nd house governs wealth, family, speech, and accumulated resources. Financial pressures and family tensions gradually resolve. This is the recovery phase — the storm passes and you begin to see the fruits of your endurance.</>}</p>
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
          {isHi ? 'तीव्रता किससे निर्धारित होती है?' : 'What Determines Severity?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सभी साढ़े साती समान रूप से कठोर नहीं होतीं। तीव्रता अनेक कुण्डली कारकों के आधार पर अत्यधिक भिन्न होती है। इन कारकों को समझना साढ़े साती को सामान्य भय से एक सूक्ष्म भविष्यसूचक उपकरण में बदल देता है। वही गोचर जो एक व्यक्ति को तबाह करता है, दूसरे में महानता को प्रेरित कर सकता है।</> : <>Not all Sade Satis are equally harsh. The severity varies enormously based on multiple chart factors. Understanding these factors transforms Sade Sati from a blanket fear into a nuanced predictive tool. The same transit that devastates one person may catalyze greatness in another.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख तीव्रता कारक' : 'Key Severity Factors'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1. Natal Saturn&apos;s Dignity:</span> If Saturn is exalted (Libra), in own sign (Capricorn/Aquarius), or in a friendly sign in the birth chart, Sade Sati produces discipline and growth. If debilitated (Aries) or afflicted, the effects are harsher. A strong natal Saturn means the native already has Saturnian coping mechanisms built into their psyche.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2. Moon&apos;s Strength:</span> A strong Moon (exalted in Taurus, own sign Cancer, waxing/bright, conjunct benefics) can withstand Saturn&apos;s pressure better. A weak Moon (debilitated in Scorpio, waning/dark, afflicted by malefics) amplifies suffering — the emotional core is fragile.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">3. Ashtakavarga Bindus:</span> Saturn&apos;s bindus in the three transit signs (12th, 1st, 2nd from Moon) directly modulate the intensity. High bindus (5-8) in all three signs = mild Sade Sati. Low bindus (0-2) = severe.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">4. Current Dasha:</span> The running Mahadasha and Antardasha interact crucially with Sade Sati. Saturn Mahadasha + Sade Sati = double Saturn effect (most difficult). Rahu dasha amplifies Saturn&apos;s harshness. Jupiter or Venus dasha provides a protective buffer, softening the transit considerably.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'दशा पारस्परिक क्रिया' : 'Dasha Interaction'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">शनि या राहु दशा:</span> शनि या राहु महादशा में साढ़े साती सर्वाधिक कठिन होती है। दोहरा शनि प्रभाव (दशा + गोचर) अत्यधिक दबाव, विलम्ब और कार्मिक तीव्रता लाता है। राहु दशा भ्रम और अनिश्चितता जोड़ती है।
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">गुरु दशा:</span> गुरु महादशा में साढ़े साती काफी शमित होती है। गुरु का शुभ स्वभाव, ज्ञान और विस्तार शनि की संकुचन ऊर्जा को सन्तुलित करता है। जातक चुनौतियों में भी अवसर और अर्थ खोज लेता है।
        </p>
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
          {isHi ? 'जीवन चक्र प्रतिमान' : 'Life Cycle Patterns'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>शनि की लगभग 29.5 वर्ष की कक्षा अवधि का अर्थ है कि साढ़े साती लगभग 30 वर्ष के चक्र में पुनरावृत्त होती है। अधिकांश लोग जीवन में 2-3 साढ़े साती अनुभव करते हैं, प्रत्येक एक विशिष्ट विकास चरण से सम्बद्ध। आप कौन-सी साढ़े साती में हैं यह समझना माँगे जा रहे विशिष्ट जीवन पाठों को प्रकट करता है।</> : <>Saturn&apos;s orbital period of approximately 29.5 years means Sade Sati recurs in a roughly 30-year cycle. Most people experience 2-3 Sade Satis in their lifetime, each corresponding to a distinct developmental stage. Understanding which Sade Sati you are in reveals the specific life lessons being demanded.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'तीन जीवनकालीन साढ़े साती' : 'The Three Life Sade Satis'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">{isHi ? <><span className="text-gold-light font-medium">पहली साढ़े साती (~आयु 22-30):</span> यह शनि की प्रथम वापसी के साथ आती है — सच्ची प्रौढ़ता का ज्योतिषीय चिह्न। ब्रह्माण्ड माँग करता है कि आप करियर स्थापित करें, जिम्मेदारी लें और ठोस नींव बनाएँ। सम्बन्ध परीक्षित होते हैं। लापरवाह युवावस्था समाप्त होती है।</> : <><span className="text-gold-light font-medium">First Sade Sati (~Age 22-30):</span> This coincides with Saturn&apos;s first return — the astrological marker of true adulthood. The universe demands that you establish your career, take responsibility, and build a solid foundation. Relationships are tested. The carefree youth phase ends. Those who resist Saturn&apos;s discipline face prolonged struggle; those who embrace it emerge with a career and identity that can last decades.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">{isHi ? <><span className="text-gold-light font-medium">दूसरी साढ़े साती (~आयु 52-60):</span> सर्वाधिक भावनात्मक रूप से तीव्र चक्र। स्वास्थ्य चिन्ताएँ उभरती हैं, माता-पिता और बड़ों का वियोग हो सकता है, मृत्यु और विरासत का सीधा सामना होता है। करियर शिखर या ठहराव पर हो सकता है।</> : <><span className="text-gold-light font-medium">Second Sade Sati (~Age 52-60):</span> The most emotionally intense cycle. Health concerns emerge, parents and elders may pass away, and one confronts mortality and legacy directly. Career may peak or plateau. This Sade Sati forces a reckoning with what truly matters — stripping away ambition-driven pursuits in favor of meaning-driven ones.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Third Sade Sati (~Age 82-90):</span> If one lives to experience it, this final Sade Sati is about closure, acceptance, and spiritual surrender. Physical limitations increase, but those with strong spiritual practices often find this period peaceful — Saturn rewards those who have learned his lessons in previous cycles.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'छिपा हुआ वरदान' : 'The Hidden Gift'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Despite its fearsome reputation, Sade Sati is ultimately Saturn&apos;s gift of maturity. Many of history&apos;s greatest achievements — career breakthroughs, spiritual awakenings, masterworks of art — have occurred during Sade Sati. Saturn does not destroy; he removes what is false so that what is true can emerge. The key is to work with Saturn rather than against him: embrace discipline, accept responsibility, serve others, and maintain patience. What survives Sade Sati becomes unshakable.
        </p>
      </section>
    </div>
  );
}

export default function Module12_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}


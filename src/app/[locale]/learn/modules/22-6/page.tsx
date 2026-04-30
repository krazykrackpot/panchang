'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-6.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_22_6', phase: 9, topic: 'Astronomy', moduleNumber: '22.6',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'The Equation of Time is the gap between clock time and sundial time — it varies by up to 16 minutes through the year.',
          'Two factors cause it: Earth\'s elliptical orbit (eccentricity) and the tilt of Earth\'s axis (obliquity) — both affect apparent solar noon.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Sundial Time vs Clock Time', hi: 'धूपघड़ी समय बनाम घड़ी समय', sa: 'धूपघड़ी समय बनाम घड़ी समय' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>धूपघड़ी &quot;दृश्य सौर समय&quot; बताती है — जब छाया सबसे छोटी हो, वह सौर मध्याह्न है, अर्थात सूर्य अपने उच्चतम बिन्दु पर और ठीक दक्षिण दिशा में (उत्तरी गोलार्ध में)। घड़ी &quot;माध्य सौर समय&quot; बताती है — समान 24-घण्टे के दिन, प्रत्येक मिनट ठीक समान लम्बाई। ये दोनों 16 मिनट तक असहमत होते हैं क्योंकि वास्तविक सूर्य आकाश में स्थिर गति से नहीं चलता। समय का समीकरण (EoT) इस विसंगति को मापता है: EoT = दृश्य सौर समय - माध्य सौर समय। जब EoT धनात्मक हो, धूपघड़ी घड़ी से आगे है (सूर्य 12:00 माध्य समय से पहले अपने उच्चतम बिन्दु पर पहुँचता है)।</> : <>A sundial tells &quot;apparent solar time&quot; — when the shadow is shortest, it is solar noon, meaning the Sun is at its highest point and exactly due south (in the Northern Hemisphere). A clock tells &quot;mean solar time&quot; — uniform 24-hour days, every minute exactly the same length. These two disagree by up to 16 minutes because the real Sun does not move at constant speed across the sky. The Equation of Time (EoT) quantifies this discrepancy: EoT = Apparent Solar Time - Mean Solar Time. When EoT is positive, the sundial is ahead of the clock (the Sun reaches its highest point before 12:00 mean time).</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दो पूर्णतया स्वतन्त्र भौतिक प्रभाव यह विसंगति बनाते हैं। प्रभाव 1 — तिर्यकता: क्रान्तिवृत्त (सूर्य का दृश्य पथ) खगोलीय विषुवत से 23.4° झुका है। यदि सूर्य क्रान्तिवृत्त पर पूर्णतया स्थिर गति से चलता भी, तो विषुवत पर इसका प्रक्षेप (जो विषुवांश और इसलिए घड़ी समय निर्धारित करता है) असमान होगा। अयनान्तों के निकट, क्रान्तिवृत्त विषुवत से लगभग समान्तर है, अतः 1° क्रान्तिवृत्तीय गति ≈ 1° विषुवांश। विषुवों के निकट, क्रान्तिवृत्त विषुवत को एक कोण पर काटता है, अतः 1° क्रान्तिवृत्तीय गति केवल ~0.92° विषुवांश परिवर्तन उत्पन्न करती है। यह EoT में अर्ध-वार्षिक दोलन बनाता है।</> : <>Two completely independent physical effects create this discrepancy. Effect 1 — Obliquity: The ecliptic (the Sun&apos;s apparent path) is tilted 23.4° to the celestial equator. Even if the Sun moved at perfectly constant speed along the ecliptic, its projection onto the equator (which determines right ascension and hence clock time) would be non-uniform. Near the solstices, the ecliptic is nearly parallel to the equator, so 1° of ecliptic motion ≈ 1° of right ascension. Near the equinoxes, the ecliptic crosses the equator at an angle, so 1° of ecliptic motion produces only ~0.92° of right ascension change. This creates a semi-annual oscillation in the EoT.</>}</p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Formula', hi: 'सूत्र', sa: 'सूत्र' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रभाव 2 — उत्केन्द्रता: पृथ्वी की कक्षा वृत्त नहीं बल्कि दीर्घवृत्त (e ≈ 0.017) है। केप्लर के द्वितीय नियम से पृथ्वी उपसौर (जनवरी) के निकट तेज़ और अपसौर (जुलाई) के निकट धीमी चलती है। इससे सूर्य क्रान्तिवृत्त पर तेज़ या धीमा गतिमान दिखता है, EoT में ~7.7 मिनट आयाम का वार्षिक दोलन बनाता है। तिर्यकता प्रभाव (~9.9 मिनट अर्ध-वार्षिक) के साथ मिलकर, दोनों विशिष्ट विषम द्वि-शिखर EoT वक्र बनाते हैं।</> : <>Effect 2 — Eccentricity: Earth&apos;s orbit is not a circle but an ellipse (e ≈ 0.017). By Kepler&apos;s second law, Earth moves faster near perihelion (January) and slower near aphelion (July). This makes the Sun appear to move faster or slower along the ecliptic, creating an annual oscillation in the EoT with amplitude ~7.7 minutes. Combined with the obliquity effect (~9.9 minutes semi-annual), the two produce the characteristic asymmetric double-peaked EoT curve.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Mathematical Expression', hi: 'गणितीय अभिव्यक्ति', sa: 'गणितीय अभिव्यक्ति' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Let y = tan²(ε/2) where ε ≈ 23.44° is the obliquity. Let e ≈ 0.01671 be the eccentricity. Let L₀ be the Sun&apos;s mean longitude and M be the mean anomaly. Then:
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2 font-mono">
          EoT = y·sin(2L₀) - 2e·sin(M) + 4ey·sin(M)·cos(2L₀) - 0.5y²·sin(4L₀) - 1.25e²·sin(2M)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>y = tan²(ε/2) जहाँ ε ≈ 23.44° तिर्यकता है। e ≈ 0.01671 उत्केन्द्रता। L₀ सूर्य का माध्य भोगांश और M माध्य विलम्बिका। परिणाम रेडियन में है। मिनटों में बदलने के लिए: EoT_minutes = EoT × (180/π) × 4। गुणक 4 इसलिए क्योंकि सूर्य 1440 मिनट (24 × 60) में 360° पार करता है, अतः 1° = 4 मिनट समय।</> : <>This result is in radians. To convert to minutes: EoT_minutes = EoT × (180/π) × 4. The factor 4 comes from the Sun traversing 360° in 1440 minutes (24 × 60), so 1° = 4 minutes of time.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Term by term:</span> y·sin(2L₀) is the obliquity effect (semi-annual, ~±9.9 min). -2e·sin(M) is the eccentricity effect (annual, ~±7.7 min). The remaining terms are cross-coupling and higher-order corrections (&lt;1 minute each).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Analemma', hi: 'एनालेम्मा', sa: 'एनालेम्मा' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>यदि आप प्रतिदिन एक ही घड़ी समय पर पूरे वर्ष सूर्य का चित्र लें, तो यह उसी स्थान पर नहीं लौटता। इसके बजाय, यह एनालेम्मा नामक अंक-8 आकृति बनाता है। पूर्व-पश्चिम विस्थापन EoT है (EoT &gt; 0 होने पर सूर्य अपनी माध्य स्थिति से पूर्व में, EoT &lt; 0 होने पर पश्चिम में)। उत्तर-दक्षिण विस्थापन बदलती क्रान्ति है (ग्रीष्म में ऊँचा, शीत में नीचा)। एनालेम्मा विषम है क्योंकि उत्केन्द्रता और तिर्यकता प्रभावों की भिन्न अवधियाँ हैं — एक पाश दूसरे से बड़ा है।</> : <>If you photograph the Sun at the same clock time every day for a year, it does NOT return to the same spot. Instead, it traces a figure-8 pattern called the analemma. The east-west displacement is the EoT (the Sun is east of its mean position when EoT &gt; 0, west when EoT &lt; 0). The north-south displacement is the changing declination (high in summer, low in winter). The analemma is asymmetric because the eccentricity and obliquity effects have different periods — one loop is larger than the other.</>}</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Why This Matters for Jyotish', hi: 'ज्योतिष के लिए यह क्यों महत्त्वपूर्ण है', sa: 'ज्योतिष के लिए यह क्यों महत्त्वपूर्ण है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सौर मध्याह्न घड़ी पर 12:00 नहीं है। यह 12:00 है जो (1) समयक्षेत्र केन्द्रीय याम्योत्तर से प्रेक्षक का देशान्तर अन्तर, और (2) समय का समीकरण द्वारा सुधारित है। कोर्सो (6.80°E, 15°E पर केन्द्रित CET/CEST समयक्षेत्र) में केवल देशान्तर सौर मध्याह्न ~33 मिनट देर करता है। EoT (+14 से -16 मिनट) जोड़ने पर, कोर्सो में सौर मध्याह्न लगभग 12:50 CET (दिसम्बर) से 13:50 CEST (जुलाई) तक भिन्न होता है। सूर्योदय का सन्दर्भ लेने वाला प्रत्येक पंचांग तत्व यह सुधार विरासत में लेता है।</> : <>Solar noon is not 12:00 on the clock. It is 12:00 corrected by (1) the observer&apos;s longitude offset from the timezone central meridian, and (2) the Equation of Time. In Corseaux (6.80°E, CET/CEST timezone centered on 15°E), the longitude alone shifts solar noon ~33 minutes late. Adding EoT (which ranges from +14 to -16 minutes), solar noon in Corseaux varies from about 12:50 CET (December) to 13:50 CEST (July). Every Panchang element that references sunrise inherits this correction.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विशिष्ट प्रभाव: अभिजित मुहूर्त सौर मध्याह्न पर केन्द्रित दो घटिका (48 मिनट) है — दिन का सर्वाधिक शुभ समय। EoT सुधार के बिना यह मुहूर्त 16 मिनट तक विस्थापित होगा। होरा गणनाएँ दिन (सूर्योदय से सूर्योदय) को 24 ग्रह घण्टों में विभक्त करती हैं। गलत सूर्योदय सभी होरा सीमाओं को खिसकाता है। राहु काल सूर्योदय के बाद दिन के विशिष्ट अंश से आरम्भ 1.5 घण्टे की खिड़की है — यदि सूर्योदय 4 मिनट गलत हो (EoT के बिना एकल-पास गणना की त्रुटि), तो राहु काल सीमाएँ 4 मिनट खिसकती हैं। हमारा इंजन सूर्योदय और सूर्यास्त दोनों गणनाओं में EoT लागू करता है, जिससे सभी अधोप्रवाह समय सटीक रहें।</> : <>Specific impacts: Abhijit Muhurta is defined as the two ghatikas (48 minutes) centered on solar noon — the most auspicious time of day. Without EoT correction, this muhurta would be misplaced by up to 16 minutes. Hora calculations divide the day (sunrise to sunrise) into 24 planetary hours. An incorrect sunrise shifts all hora boundaries. Rahu Kaal is computed as the 1.5-hour window starting at a specific fraction of the day after sunrise — if sunrise is wrong by 4 minutes (the error from a single-pass calculation without EoT), Rahu Kaal boundaries shift by 4 minutes. Our engine applies EoT in both the sunrise and sunset calculations, ensuring all downstream timings are accurate.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;समय का समीकरण केवल समयक्षेत्रों के बारे में है।&quot; समयक्षेत्र राजनीतिक/प्रशासनिक व्यवस्था है। EoT एक मूलभूत खगोलीय घटना है जो समयक्षेत्रों से स्वतन्त्र विद्यमान है। यदि आप अपने समयक्षेत्र के केन्द्रीय याम्योत्तर पर ठीक रहते भी, तो तिर्यकता और उत्केन्द्रता प्रभावों के कारण आपकी धूपघड़ी अभी भी आपकी घड़ी से 16 मिनट तक असहमत होगी।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The Equation of Time is just about timezones.&quot; Timezones are a political/administrative system. The EoT is a fundamental astronomical phenomenon that exists regardless of timezones. Even if you lived exactly on the central meridian of your timezone, your sundial would still disagree with your clock by up to 16 minutes because of the obliquity and eccentricity effects.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>EoT को समझना प्राचीन भारतीय खगोलशास्त्र को आधुनिक संगणक अभ्यास से जोड़ता है। सूर्य सिद्धान्त पहले से ही अपने मन्दफल (केन्द्र समीकरण) सुधार द्वारा उत्केन्द्रता प्रभाव का लेखा-जोखा रखता है। तिर्यकता प्रभाव क्रान्तिवृत्तीय और विषुवतीय निर्देशांकों के बीच रूपान्तरण (क्रान्ति गणना) में प्रकट होता है। हमारा इंजन दोनों प्रभावों को संक्षिप्त EoT सूत्र में संयोजित करता है, जब भी सूर्योदय या सूर्यास्त गणित करता है इसे लागू करता है — वे आधारभूत सन्दर्भ समय जिन पर सम्पूर्ण पंचांग संरचना टिकी है।</> : <>Understanding the EoT connects ancient Indian astronomy with modern computational practice. The Surya Siddhanta already accounts for the eccentricity effect through its mandaphala (equation of center) correction. The obliquity effect appears in the conversion between ecliptic and equatorial coordinates (kranti calculation). Our engine combines both effects in the compact EoT formula, applying it every time it computes sunrise or sunset — the foundational reference times upon which the entire Panchang structure rests.</>}</p>
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
          {tl({ en: 'Worked Example: EoT for April 2, 2026', hi: 'कार्यान्वित उदाहरण: 2 अप्रैल 2026 के लिए EoT', sa: 'कार्यान्वित उदाहरण: 2 अप्रैल 2026 के लिए EoT' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>2 अप्रैल, 2026 के लिए (T = 0.26246): L₀ ≈ 8.97° (mod 360), M ≈ 85.73°। ε ≈ 23.44°, y = tan²(23.44°/2) = tan²(11.72°) = 0.04304। e = 0.01671। तिर्यकता पद: y × sin(2 × 8.97°) = 0.04304 × sin(17.94°) = 0.04304 × 0.308 = 0.01326 rad। उत्केन्द्रता पद: -2 × 0.01671 × sin(85.73°) = -0.03342 × 0.9972 = -0.03333 rad। मिनटों में बदलें: EoT ≈ (0.01326 - 0.03333) × (180/π) × 4 = (-0.02007) × 229.18 = -4.6 मिनट।</> : <>For April 2, 2026 (T = 0.26246): L₀ ≈ 8.97° (mod 360), M ≈ 85.73°. Obliquity ε ≈ 23.44°, y = tan²(23.44°/2) = tan²(11.72°) = 0.04304. Eccentricity e = 0.01671. Obliquity term: y x sin(2 x 8.97°) = 0.04304 x sin(17.94°) = 0.04304 x 0.308 = 0.01326 rad. Eccentricity term: -2 x 0.01671 x sin(85.73°) = -0.03342 x 0.9972 = -0.03333 rad. Convert to minutes: EoT ≈ (0.01326 - 0.03333) x (180/pi) x 4 = (-0.02007) x 229.18 = -4.6 minutes.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अर्थ: 2 अप्रैल को धूपघड़ी घड़ी से लगभग 4.6 मिनट पीछे है — सौर मध्याह्न 12:04:36 माध्य सौर समय पर आता है। कोर्सो के लिए, देशान्तर सुधार (6.80°E बनाम 15°E) 32.8 मिनट जोड़ता है, और CEST (UTC+2) 60 मिनट जोड़ता है। अन्तिम सौर मध्याह्न ≈ 12:00 + 32.8 + 4.6 + 60 = 13:37 CEST। यह &quot;दोपहर&quot; का सूर्य वास्तव में दोपहर 1:37 बजे अपने उच्चतम बिन्दु पर है!<br/><br/>यह गणना स्पष्ट करती है कि EoT को नज़रअन्दाज़ करने पर ~4.6 मिनट की सूर्योदय त्रुटि होती — जो राहु काल और सभी होरा सीमाओं को प्रभावित करती।</> : <>Interpretation: on April 2, the sundial is about 4.6 minutes behind the clock — solar noon falls at 12:04:36 mean solar time. For Corseaux, the longitude correction (6.80°E vs 15°E) adds 32.8 minutes, and CEST (UTC+2) adds 60 minutes. Final solar noon ≈ 12:00 + 32.8 + 4.6 + 60 = 13:37 CEST. The &quot;noon&quot; Sun is actually at its highest point at 1:37 PM!<br/><br/>This calculation makes clear why ignoring EoT would cause a ~4.6 minute sunrise error — cascading into Rahu Kaal and all hora boundaries.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Additional Misconceptions', hi: 'अतिरिक्त भ्रान्तियाँ', sa: 'अतिरिक्त भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;एनालेम्मा एक सैद्धान्तिक अवधारणा है — वास्तव में कोई इसे नहीं देखता।&quot; वास्तव में, कई फोटोग्राफरों ने पूरे वर्ष एक ही समय पर एक ही स्थान से बहु-प्रदर्शन चित्र लेकर एनालेम्मा को दस्तावेज़ित किया है। परिणामी अंक-8 आकृति EoT का प्रत्यक्ष दृश्य प्रमाण है। प्राचीन धूपघड़ी निर्माता भी एनालेम्मा जानते थे — परिष्कृत धूपघड़ियों पर अंकित सुधार तालिकाएँ इसकी पुष्टि करती हैं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The analemma is a theoretical concept — nobody actually observes it.&quot; In fact, many photographers have documented the analemma by taking multiple-exposure photographs from the same location at the same clock time throughout the year. The resulting figure-8 is direct visual evidence of the EoT. Ancient sundial makers also knew the analemma — correction tables engraved on sophisticated sundials confirm this.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;दिवालोक बचत समय (DST) EoT का भाग है।&quot; DST एक राजनीतिक/प्रशासनिक घड़ी समायोजन है — इसका खगोलशास्त्र से कोई सम्बन्ध नहीं। EoT पूर्णतया भौतिक है: कक्षीय उत्केन्द्रता और अक्षीय झुकाव। हमारा इंजन EoT और DST/समयक्षेत्र सुधार को अलग-अलग लागू करता है, फिर अन्तिम प्रदर्शन समय प्राप्त करने के लिए संयोजित करता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Daylight saving time (DST) is part of the EoT.&quot; DST is a political/administrative clock adjustment — it has nothing to do with astronomy. The EoT is purely physical: orbital eccentricity and axial tilt. Our engine applies EoT and DST/timezone corrections separately, then combines them to arrive at the final display time.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Cross-References', hi: 'सम्बन्धित मॉड्यूल', sa: 'सम्बन्धित मॉड्यूल' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>EoT सूर्योदय/सूर्यास्त गणना में कैसे प्रयुक्त होता है इसके लिए <span className="text-gold-light">मॉड्यूल 22.4 (सूर्योदय/सूर्यास्त)</span> देखें। सूर्य भोगांश गणना (जो L₀ और M प्रदान करती है) के लिए <span className="text-gold-light">मॉड्यूल 22.2 (सूर्य भोगांश)</span> देखें। JD और T चर की मूल बातों के लिए <span className="text-gold-light">मॉड्यूल 22.1 (जूलियन दिवस)</span> देखें। अभिजित मुहूर्त, होरा और राहु काल कैसे सूर्योदय पर निर्भर करते हैं, इसके लिए <span className="text-gold-light">मॉड्यूल 8.1 (मुहूर्त)</span> देखें।</> : <>For how EoT feeds into sunrise/sunset computation, see <span className="text-gold-light">Module 22.4 (Sunrise/Sunset)</span>. For the Sun longitude calculation that provides L₀ and M, see <span className="text-gold-light">Module 22.2 (Sun Longitude)</span>. For the fundamentals of JD and T, see <span className="text-gold-light">Module 22.1 (Julian Day)</span>. For how Abhijit Muhurta, Hora, and Rahu Kaal depend on sunrise, see <span className="text-gold-light">Module 8.1 (Muhurta)</span>.</>}</p>
      </section>
    </div>
  );
}

function Page5() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Practical Application — EoT Throughout the Year', hi: 'व्यावहारिक अनुप्रयोग — वर्ष भर EoT', sa: 'व्यावहारिक अनुप्रयोग — वर्ष भर EoT' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>EoT ज्ञान का सबसे प्रत्यक्ष अनुप्रयोग अभिजित मुहूर्त निर्धारण में है। अभिजित = सौर मध्याह्न पर केन्द्रित 48 मिनट। फरवरी में EoT = +14 मिनट, अतः कोर्सो में अभिजित ~12:48-13:36 CET। नवम्बर में EoT = -16 मिनट, अतः अभिजित ~13:22-14:10 CET। यह 30+ मिनट का अन्तर केवल EoT से आता है, और इसे अनदेखा करने पर अभिजित गलत घण्टे में पड़ेगा।</> : <>The most direct application of EoT knowledge is in determining Abhijit Muhurta. Abhijit = 48 minutes centered on solar noon. In February, EoT = +14 minutes, so in Corseaux, Abhijit falls around 12:48-13:36 CET. In November, EoT = -16 minutes, so Abhijit shifts to around 13:22-14:10 CET. This 30+ minute difference comes solely from EoT, and ignoring it would place Abhijit in the wrong hour.</>}</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Additional Misconceptions', hi: 'अतिरिक्त भ्रान्तियाँ', sa: 'अतिरिक्त भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;EoT केवल गणितीय रुचि है &mdash; व्यावहारिक प्रभाव नगण्य है।&quot; 16 मिनट का EoT सीधे सूर्योदय, सूर्यास्त, अभिजित मुहूर्त, होरा सीमाओं और राहु काल को प्रभावित करता है। 4 मिनट की सूर्योदय त्रुटि (EoT अनदेखा करने पर) सभी समय-आधारित पंचांग तत्वों में 4 मिनट की त्रुटि प्रसारित करती है। हमारे इंजन का 2-पास एल्गोरिदम (मॉड्यूल 22.4) इसीलिए EoT को दोनों पासों में शामिल करता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;EoT is only of mathematical interest &mdash; the practical impact is negligible.&quot; The 16-minute EoT directly affects sunrise, sunset, Abhijit Muhurta, Hora boundaries, and Rahu Kaal. A 4-minute sunrise error (from ignoring EoT) cascades into 4-minute errors in all time-based Panchang elements. Our engine&rsquo;s 2-pass algorithm (Module 22.4) includes EoT in both passes for exactly this reason.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_6Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />, <Page5 key="p5" />]} questions={QUESTIONS} />;
}
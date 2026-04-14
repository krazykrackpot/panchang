'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/19-1.json';

const META: ModuleMeta = {
  id: 'mod_19_1', phase: 6, topic: 'Jaimini', moduleNumber: '19.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 14,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Jaimini&apos;s Variable Significators', hi: 'जैमिनी के परिवर्तनशील कारक', sa: 'जैमिनी के परिवर्तनशील कारक' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाराशरी ज्योतिष में कारक स्थिर हैं: सूर्य सदैव पिता, चन्द्रमा सदैव माता, मंगल सदैव भाई-बहन, इत्यादि का प्रतिनिधित्व करता है। महर्षि जैमिनी ने एक क्रान्तिकारी विकल्प प्रस्तुत किया — चर कारक (&quot;परिवर्तनशील कारक&quot;) पद्धति — जहाँ प्रत्येक ग्रह की भूमिका उसके स्वाभाविक स्वरूप से नहीं बल्कि उसकी राशि में अंश से निर्धारित होती है। किसी भी राशि में सर्वाधिक अंश वाला ग्रह आत्मकारक (आत्म-कारक) बनता है, अगला अमात्यकारक (जीविका), और इसी प्रकार सातवाँ दारकारक (पत्नी/पति) बनता है।</>
            : <>In Parashari astrology, significators are fixed: the Sun always represents the father, the Moon always represents the mother, Mars always represents siblings, and so on. Maharishi Jaimini introduced a revolutionary alternative — the Chara Karaka (&quot;variable significator&quot;) system — where the role each planet plays is determined not by its inherent nature but by its degree within its sign. The planet at the highest degree in any sign becomes the Atmakaraka (self-significator), the next highest becomes the Amatyakaraka (career), and so on down to the seventh, which becomes the Darakaraka (spouse).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अवरोही अंश क्रम में सात चर कारक हैं: <strong>आत्मकारक (AK)</strong> — आत्मा, आत्मा की इच्छा; <strong>अमात्यकारक (AmK)</strong> — जीविका, मन्त्री, सलाहकार; <strong>भ्रातृकारक (BK)</strong> — भाई-बहन, साहस; <strong>मातृकारक (MK)</strong> — माता, भावनात्मक पोषण; <strong>पुत्रकारक (PK)</strong> — सन्तान, सृजनशीलता, पुण्य; <strong>ज्ञातिकारक (GK)</strong> — शत्रु, रोग, बाधाएँ; <strong>दारकारक (DK)</strong> — पत्नी/पति, साझेदारी।</>
            : <>The seven Chara Karakas in descending order of degree are: <strong>Atmakaraka (AK)</strong> — the self, soul&apos;s desire; <strong>Amatyakaraka (AmK)</strong> — career, minister, advisor; <strong>Bhratrikaraka (BK)</strong> — siblings, courage; <strong>Matrikaraka (MK)</strong> — mother, emotional nourishment; <strong>Putrakaraka (PK)</strong> — children, creativity, merit; <strong>Gnatikaraka (GK)</strong> — enemies, disease, obstacles; <strong>Darakaraka (DK)</strong> — spouse, partnerships.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Rahu&apos;s Special Treatment', hi: 'राहु का विशेष नियम', sa: 'राहु का विशेष नियम' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>कुछ जैमिनी विद्वान 8-कारक पद्धति प्रयोग करते हैं जिसमें राहु सम्मिलित है। चूँकि राहु वक्री गति से चलता है, उसका अंश 30° ऋण राशि में उसका वास्तविक अंश गणित किया जाता है। उदाहरणार्थ, किसी राशि में 22° पर राहु को कारक क्रम में 8° माना जाता है। यह उल्टी गणना राहु की सदा वक्री प्रकृति का ध्यान रखती है। 8-कारक पद्धति में एक अतिरिक्त कारक — पितृकारक (पिता) — मातृकारक और पुत्रकारक के बीच जोड़ा जाता है।</>
            : <>Some Jaimini scholars use an 8-karaka scheme that includes Rahu. Since Rahu moves in retrograde motion, its degree is calculated as 30° minus its actual degree within the sign. For example, Rahu at 22° in a sign is treated as having 8° for karaka sorting purposes. This reversed calculation accounts for Rahu&apos;s perpetually retrograde nature. In the 8-karaka scheme, an additional karaka — Pitrikaraka (father) — is inserted between Matrikaraka and Putrakaraka.</>}
        </p>
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
          {tl({ en: 'Computing Chara Karakas', hi: 'चर कारक गणना', sa: 'चर कारक गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गणना सरल है: सभी 7 ग्रह (सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि) लें और प्रत्येक ग्रह का अपनी राशि में अंश (0° से 29°59&apos;) नोट करें। केवल राशि में अंश ही महत्त्वपूर्ण है — इस क्रम के लिए राशि स्वयं अप्रासंगिक है। सातों ग्रहों को सर्वाधिक से न्यूनतम अंश में क्रमित करें। शीर्ष पर ग्रह आत्मकारक है, अगला अमात्यकारक, इत्यादि।</>
            : <>The calculation is straightforward: take all 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) and note each planet&apos;s degree within its sign (0° to 29°59&apos;). Only the degree within the sign matters — the sign itself is irrelevant for this sorting. Sort all seven planets from highest degree to lowest. The planet at the top is Atmakaraka, the next is Amatyakaraka, and so on.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Given positions:</span> Sun at 25°14&apos; Aries, Moon at 18°07&apos; Gemini, Mars at 22°45&apos; Leo, Mercury at 10°33&apos; Virgo, Jupiter at 28°02&apos; Taurus, Venus at 15°21&apos; Libra, Saturn at 8°48&apos; Capricorn.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 1 — Extract degrees within sign:</span> Sun = 25°14&apos;, Moon = 18°07&apos;, Mars = 22°45&apos;, Mercury = 10°33&apos;, Jupiter = 28°02&apos;, Venus = 15°21&apos;, Saturn = 8°48&apos;.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 2 — Sort highest to lowest:</span> Jupiter (28°02&apos;) → Sun (25°14&apos;) → Mars (22°45&apos;) → Moon (18°07&apos;) → Venus (15°21&apos;) → Mercury (10°33&apos;) → Saturn (8°48&apos;).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">कारक नियुक्ति:</span> बृहस्पति(28°02&apos;) = AK (आत्मकारक), सूर्य(25°14&apos;) = AmK (अमात्यकारक), मंगल(22°45&apos;) = BK (भ्रातृकारक), चन्द्र(18°07&apos;) = MK (मातृकारक), शुक्र(15°21&apos;) = PK (पुत्रकारक), बुध(10°33&apos;) = GK (ज्ञातिकारक), शनि(8°48&apos;) = DK (दारकारक)।</>
            : <><span className="text-gold-light font-medium">Step 3 — Assign karakas:</span> Jupiter = AK (Atmakaraka), Sun = AmK (Amatyakaraka), Mars = BK (Bhratrikaraka), Moon = MK (Matrikaraka), Venus = PK (Putrakaraka), Mercury = GK (Gnatikaraka), Saturn = DK (Darakaraka).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चर कारक के लिए ग्रह का कुल भोगांश (राशिचक्र में निरपेक्ष अंश) प्रयोग होता है।&quot; यह गलत है। केवल अपनी राशि में अंश (0° से 30°) ही मायने रखता है। मेष में 5° (निरपेक्ष 5°) का ग्रह और वृश्चिक में 5° (निरपेक्ष 215°) का ग्रह समान माना जाता है — दोनों अपनी राशि में 5° पर हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The planet&apos;s total longitude (absolute degree in the zodiac) is used for Chara Karaka.&quot; This is wrong. Only the degree within its own sign (0° to 30°) matters. A planet at 5° Aries (absolute 5°) and a planet at 5° Scorpio (absolute 215°) are treated equally — both are at 5° within their sign.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>चर कारकों ने आधुनिक ज्योतिष अभ्यासकर्ताओं में नवीन रुचि प्राप्त की है क्योंकि वे कुण्डली व्याख्या में गहन व्यक्तिगत परत जोड़ते हैं। जहाँ पाराशरी स्थिर कारक सामान्य सिद्धान्त देते हैं, वहीं चर कारक प्रकट करते हैं कि प्रत्येक व्यक्ति के लिए विशिष्ट रूप से क्या महत्त्वपूर्ण है। सॉफ्टवेयर इन्हें तत्काल गणित कर सकता है, जिससे जैमिनी तकनीकें पहले से कहीं अधिक सुलभ हो गयी हैं।</>
            : <>Chara Karakas have gained renewed interest among modern Jyotish practitioners because they add a deeply personalized layer to chart interpretation. While Parashari fixed karakas give general principles, Chara Karakas reveal what is uniquely significant for each individual. Software can compute these instantly, making Jaimini techniques more accessible than ever.</>}
        </p>
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
          {tl({ en: 'The Atmakaraka&apos;s Supreme Significance', hi: 'आत्मकारक का सर्वोच्च महत्त्व', sa: 'आत्मकारक का सर्वोच्च महत्त्व' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आत्मकारक — सर्वाधिक अंश वाला ग्रह — इस जन्म में आत्मा की इच्छा का प्रतिनिधित्व करता है। जैमिनी ज्योतिष में यह कुण्डली का राजा है। जहाँ लग्न भौतिक अवतार दिखाता है और चन्द्रमा मन दिखाता है, वहीं AK प्रकट करता है कि आत्मा वास्तव में क्या अनुभव करना, सीखना या पूर्ण करना चाहती है। सूर्य AK होने पर मान्यता और नेतृत्व की खोज; चन्द्र AK होने पर भावनात्मक तृप्ति और पोषण की लालसा; शनि AK होने पर कठिनाइयों द्वारा वैराग्य और अनुशासन सीखने वाली आत्मा।</>
            : <>The Atmakaraka — the planet with the highest degree — represents the soul&apos;s desire in this life. It is the king of the chart in Jaimini astrology. While the Lagna shows the physical incarnation and the Moon shows the mind, the AK reveals what the soul truly seeks to experience, learn, or accomplish. A Sun as AK seeks recognition and leadership; a Moon as AK craves emotional fulfillment and nurturing; a Saturn as AK indicates a soul learning detachment and discipline through hardship.</>}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Karakamsha — The AK in D9', hi: 'कारकांश — D9 में AK', sa: 'कारकांश — D9 में AK' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आत्मकारक की नवांश (D9) राशि कारकांश कहलाती है। जब इस राशि को जन्म कुण्डली (D1) में सन्दर्भ लग्न के रूप में प्रयोग किया जाता है, तो यह कारकांश लग्न बनती है — जैमिनी ज्योतिष का सर्वाधिक शक्तिशाली विश्लेषण उपकरण। कारकांश में और उसे दृष्ट करने वाले ग्रह जातक का आध्यात्मिक पथ, गहनतम व्यावसायिक आह्वान और मोक्ष यात्रा की प्रकृति प्रकट करते हैं। बृहस्पति कारकांश में या दृष्ट करे तो विष्णु भक्ति या सात्त्विक आध्यात्मिक पथ; शुक्र हो तो लक्ष्मी पूजा या तान्त्रिक मार्ग; शनि हो तो उग्र देवताओं की उपासना या गहन तपस्या।</>
            : <>The Navamsha (D9) sign of the Atmakaraka is called the Karakamsha. When this sign is used as the reference lagna in the birth chart (D1), it becomes the Karakamsha Lagna — one of the most powerful analytical tools in Jaimini astrology. Planets in and aspecting the Karakamsha reveal the native&apos;s spiritual path, deepest career calling, and the nature of their moksha journey. Jupiter in or aspecting Karakamsha suggests devotion to Vishnu or a sattvic spiritual path; Venus suggests worship of Lakshmi or tantric paths; Saturn suggests worship of dark deities or deep austerity practices.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">उदाहरण:</span> बृहस्पति AK है 28° वृषभ में। D9 में बृहस्पति मकर में पड़ता है। अतः कारकांश मकर है। D1 कुण्डली में मकर को लग्न मानकर देखें: यदि शुक्र मकर (कारकांश) में हो, तो जातक में कलात्मक प्रतिभा है और वह स्त्री देवताओं की उपासना कर सकता है। यदि मंगल कर्क से मकर को दृष्ट करे (सप्तम दृष्टि), तो जातक का अनुशासित, योद्धा-सदृश आध्यात्मिक अभ्यास है। कारकांश से दशम (तुला) आत्मा की सच्ची व्यावसायिक पुकार निर्धारित करता है।</>
            : <><span className="text-gold-light font-medium">Case:</span> Jupiter is AK at 28° Taurus. In the D9 chart, Jupiter falls in Capricorn. Therefore, the Karakamsha is Capricorn. Looking at the D1 chart from Capricorn as lagna: if Venus is in Capricorn (Karakamsha), the native has artistic talent and may pursue worship of feminine deities. If Mars aspects Capricorn from Cancer (7th aspect), the native has a disciplined, warrior-like spiritual practice. The 10th from Karakamsha (Libra) determines the soul&apos;s true career calling.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Why AK Can Surpass the Lagna Lord', hi: 'AK लग्नेश से ऊपर क्यों', sa: 'AK लग्नेश से ऊपर क्यों' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>लग्नेश दिखाता है कि जातक संसार से कैसे अन्तर्क्रिया करता है — शारीरिक रूप, स्वास्थ्य और व्यक्तित्व प्रक्षेपण। किन्तु आत्मकारक गहन &quot;क्यों&quot; प्रकट करता है — वह कार्मिक उद्देश्य जो आत्मा ने इस अवतार में पूर्ण करने के लिए चुना। समान लग्न किन्तु भिन्न आत्मकारक वाले दो व्यक्तियों के जीवन पथ बहुत भिन्न होंगे। लग्नेश बाह्य संसार में मार्गदर्शन करता है; आत्मकारक आन्तरिक दिशासूचक चलाता है। जैमिनी अभ्यास में AK और कारकांश का विश्लेषण प्रायः उन अस्पष्टताओं को सुलझाता है जो पाराशरी विधियों से अनुत्तरित रहती हैं।</>
            : <>The Lagna lord shows how the native interacts with the world — their physical appearance, health, and personality projection. But the Atmakaraka reveals the deeper &quot;why&quot; — the karmic purpose the soul chose this incarnation to fulfill. Two people with the same Lagna but different Atmakarakas will have very different life trajectories. The Lagna lord navigates the external world; the Atmakaraka drives the internal compass. In Jaimini practice, analyzing the AK and Karakamsha often resolves ambiguities that Parashari methods leave unanswered.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

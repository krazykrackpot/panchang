'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/30-3.json';

const META: ModuleMeta = {
  id: 'mod_30_3', phase: 9, topic: 'Classical Texts', moduleNumber: '30.3',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/30-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/30-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q30_3_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q30_3_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q30_3_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Saravali — The Essence Collection', hi: 'सारावली — सार संग्रह', sa: 'सारावली — सार संग्रह' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सारावली (Saravali) कल्याण वर्मा द्वारा 9वीं शताब्दी ई. में रचित एक विशिष्ट होरा ग्रन्थ है। कल्याण वर्मा मध्य भारत के व्यल वंश के राजा थे — एक शासक जो ज्योतिष विद्वान भी थे। "सारावली" = "सार (essence) + आवली (collection)" — अर्थात "ज्योतिष के सार का संग्रह।" इसका सबसे मूल्यवान योगदान 108 ग्रह-राशि वर्णन हैं — प्रत्येक ग्रह (9) × प्रत्येक राशि (12) का विस्तृत फल।</>
            : <>Saravali, written by Kalyana Varma in the 9th century CE, is a distinctive hora text. Kalyana Varma was a king of the Vyala dynasty of central India — a ruler who was also an astrology scholar. &quot;Saravali&quot; = &quot;Sara (essence) + Avali (collection)&quot; — meaning &quot;A Collection of the Essence of Astrology.&quot; Its most valuable contribution is the 108 planet-in-sign descriptions — detailed results for each planet (9) in each sign (12).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'What Makes Saravali Unique', hi: 'सारावली को क्या अनूठा बनाता है', sa: 'सारावली को क्या अनूठा बनाता है' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Planet-in-Sign depth:', hi: 'ग्रह-राशि गहराई:', sa: 'ग्रह-राशि गहराई:' }, locale)}</span>{' '}
            {tl({ en: 'Where BPHS gives 1-2 lines per combination, Saravali gives full paragraphs — physical description, temperament, career, relationships, health, and spiritual inclination for each of the 108 combinations.', hi: 'जहाँ BPHS प्रति संयोजन 1-2 पंक्तियाँ देता है, सारावली पूर्ण अनुच्छेद देती है — 108 संयोजनों में से प्रत्येक का शारीरिक वर्णन, स्वभाव, कैरियर, सम्बन्ध, स्वास्थ्य और आध्यात्मिक झुकाव।', sa: 'जहाँ BPHS प्रति संयोजन 1-2 पंक्तियाँ देता है, सारावली पूर्ण अनुच्छेद देती है।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Practical examples:', hi: 'व्यावहारिक उदाहरण:', sa: 'व्यावहारिक उदाहरण:' }, locale)}</span>{' '}
            {tl({ en: 'Kalyana Varma frequently illustrates rules with chart examples from royal courts, making abstract principles concrete.', hi: 'कल्याण वर्मा बार-बार राजदरबार के कुण्डली उदाहरणों से नियमों को स्पष्ट करते हैं, जिससे अमूर्त सिद्धान्त ठोस बनते हैं।', sa: 'कल्याण वर्मा बार-बार राजदरबार के कुण्डली उदाहरणों से नियमों को स्पष्ट करते हैं।' }, locale)}
          </p>
        </div>
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
          {tl({ en: 'Jataka Parijata — The Celestial Coral Tree', hi: 'जातक पारिजात — दिव्य पारिजात वृक्ष', sa: 'जातक पारिजात — दिव्य पारिजात वृक्ष' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जातक पारिजात (Jataka Parijata) वैद्यनाथ दीक्षित द्वारा 14वीं शताब्दी में रचित एक महत्वपूर्ण होरा ग्रन्थ है। "जातक" = जन्म कुण्डली, "पारिजात" = पारिजात (कल्पवृक्ष) — अर्थात "ज्योतिष का कल्पवृक्ष" जो सभी इच्छित ज्ञान प्रदान करता है। यह ग्रन्थ अनेक पूर्ववर्ती ग्रन्थों (BPHS, सारावली, फलदीपिका, और अन्य) को संश्लेषित करता है और योगों तथा आयुर्दाय (आयु गणना) पर विशेष रूप से विस्तृत है।</>
            : <>Jataka Parijata, written by Vaidyanatha Dikshita in the 14th century, is a major hora text. &quot;Jataka&quot; = horoscope, &quot;Parijata&quot; = the celestial coral tree (Kalpavriksha) — meaning &quot;The Wish-Fulfilling Tree of Horoscopy&quot; that provides all desired knowledge. This text synthesizes multiple earlier works (BPHS, Saravali, Phaladeepika, and others) and is especially detailed on yogas and Ayurdaya (longevity calculation).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Key Contributions of Jataka Parijata', hi: 'जातक पारिजात का प्रमुख योगदान', sa: 'जातक पारिजात का प्रमुख योगदान' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Yoga compilation:', hi: 'योग संकलन:', sa: 'योग संकलन:' }, locale)}</span>{' '}
            {tl({ en: 'The most systematic classification of yogas of any classical text — Rajayogas, Dhana Yogas, Arishta Yogas, and cancellation conditions are all organized logically.', hi: 'किसी भी शास्त्रीय ग्रन्थ का सबसे व्यवस्थित योग वर्गीकरण — राजयोग, धनयोग, अरिष्ट योग और निरस्तीकरण शर्तें सभी तार्किक रूप से व्यवस्थित हैं।', sa: 'किसी भी शास्त्रीय ग्रन्थ का सबसे व्यवस्थित योग वर्गीकरण।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Longevity methods:', hi: 'आयु गणना विधियाँ:', sa: 'आयु गणना विधियाँ:' }, locale)}</span>{' '}
            {tl({ en: 'Multiple methods of Ayurdaya calculation compared and evaluated — Vaidyanatha shows when different methods apply and how to reconcile conflicting results.', hi: 'आयुर्दाय गणना की अनेक विधियों की तुलना और मूल्यांकन — वैद्यनाथ दिखाते हैं कि विभिन्न विधियाँ कब लागू होती हैं और परस्पर विरोधी परिणामों को कैसे सामंजस्य करें।', sa: 'आयुर्दाय गणना की अनेक विधियों की तुलना और मूल्यांकन।' }, locale)}
          </p>
        </div>
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
          {tl({ en: 'Comparative Reading — The Master Skill', hi: 'तुलनात्मक अध्ययन — मास्टर कौशल', sa: 'तुलनात्मक अध्ययन — मास्टर कौशल' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ज्योतिष में प्रवीणता का सबसे महत्वपूर्ण कौशल तुलनात्मक अध्ययन है — एक ही विषय पर BPHS, फलदीपिका, सारावली और जातक पारिजात क्या कहते हैं, इसकी तुलना करना। जब चारों ग्रन्थ सहमत हों, तो नियम अत्यन्त विश्वसनीय है। जब विसंगति हो, तो प्रत्येक ग्रन्थ की विशेषज्ञता पर ध्यान दें — ग्रह स्वभाव के लिए BPHS, भाव फल के लिए फलदीपिका, राशि फल के लिए सारावली, और योगों के लिए जातक पारिजात।</>
            : <>The most important skill in Jyotish mastery is comparative reading — comparing what BPHS, Phaladeepika, Saravali, and Jataka Parijata say on the same topic. When all four agree, the rule is highly reliable. When there is disagreement, note each text&apos;s specialization — BPHS for planetary nature, Phaladeepika for house results, Saravali for sign results, and Jataka Parijata for yogas. Then test against real charts.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The 4-Text Reading Order', hi: '4-ग्रन्थ पठन क्रम', sa: '4-ग्रन्थ पठन क्रम' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">1.</span>{' '}
            {tl({ en: 'BPHS Ch.3-4 first — establish the foundation (planetary nature, dignities, friendships).', hi: 'पहले BPHS अ.3-4 — नींव स्थापित करें (ग्रह स्वभाव, गरिमा, मैत्री)।', sa: 'पहले BPHS अ.3-4 — नींव स्थापित करें।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">2.</span>{' '}
            {tl({ en: 'Phaladeepika Ch.3-4 — learn planet-in-house results for practical analysis.', hi: 'फलदीपिका अ.3-4 — व्यावहारिक विश्लेषण के लिए भाव-ग्रह फल सीखें।', sa: 'फलदीपिका अ.3-4 — व्यावहारिक विश्लेषण के लिए भाव-ग्रह फल सीखें।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">3.</span>{' '}
            {tl({ en: 'Saravali — deepen understanding with exhaustive planet-in-sign descriptions.', hi: 'सारावली — विस्तृत ग्रह-राशि वर्णनों से समझ को गहरा करें।', sa: 'सारावली — विस्तृत ग्रह-राशि वर्णनों से समझ को गहरा करें।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">4.</span>{' '}
            {tl({ en: 'Jataka Parijata — master yogas and advanced synthesis.', hi: 'जातक पारिजात — योगों और उन्नत संश्लेषण में प्रवीणता प्राप्त करें।', sa: 'जातक पारिजात — योगों और उन्नत संश्लेषण में प्रवीणता प्राप्त करें।' }, locale)}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Module30_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

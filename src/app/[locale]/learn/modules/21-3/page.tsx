'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-3.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_21_3', phase: 8, topic: 'Varshaphal', moduleNumber: '21.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
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
          'Mudda Dasha compresses the 120-year Vimshottari cycle into one solar year — each planet\'s period lasts days to weeks instead of years.',
          'This micro-dasha system allows month-by-month and week-by-week timing within the annual Varshaphal chart.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Vimshottari Compressed: 120 Years in 365 Days', hi: 'विंशोत्तरी संकुचित: 120 वर्ष 365 दिनों में', sa: 'विंशोत्तरी संकुचित: 120 वर्ष 365 दिनों में' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Mudda Dasha takes the familiar Vimshottari dasha cycle — which normally spans 120 years — and compresses it into a single solar year of 365.25 days. The proportional allocation to each planet remains identical: Sun gets 6/120 of the year (18.26 days), Moon gets 10/120 (30.44 days), Mars 7/120 (21.31 days), Rahu 18/120 (54.79 days), Jupiter 16/120 (48.70 days), Saturn 19/120 (57.83 days), Mercury 17/120 (51.74 days), Ketu 7/120 (21.31 days), and Venus 20/120 (60.88 days).', hi: 'मुद्दा दशा परिचित विंशोत्तरी दशा चक्र — जो सामान्यतः 120 वर्षों में फैला है — को एक सौर वर्ष के 365.25 दिनों में संकुचित करती है। प्रत्येक ग्रह को आनुपातिक आवंटन समान रहता है: सूर्य को वर्ष का 6/120 (18.26 दिन), चन्द्र को 10/120 (30.44 दिन), मंगल 7/120 (21.31 दिन), राहु 18/120 (54.79 दिन), गुरु 16/120 (48.70 दिन), शनि 19/120 (57.83 दिन), बुध 17/120 (51.74 दिन), केतु 7/120 (21.31 दिन), और शुक्र 20/120 (60.88 दिन)।', sa: 'मुद्दा दशा परिचित विंशोत्तरी दशा चक्र — जो सामान्यतः 120 वर्षों में फैला है — को एक सौर वर्ष के 365.25 दिनों में संकुचित करती है। प्रत्येक ग्रह को आनुपातिक आवंटन समान रहता है: सूर्य को वर्ष का 6/120 (18.26 दिन), चन्द्र को 10/120 (30.44 दिन), मंगल 7/120 (21.31 दिन), राहु 18/120 (54.79 दिन), गुरु 16/120 (48.70 दिन), शनि 19/120 (57.83 दिन), बुध 17/120 (51.74 दिन), केतु 7/120 (21.31 दिन), और शुक्र 20/120 (60.88 दिन)।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This compression allows month-level prediction within the annual chart. While the natal Vimshottari tells you which planet dominates your life across years or decades, Mudda Dasha tells you which planet dominates each MONTH of the specific year, giving a granular timeline for when annual promises will manifest.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The concept of compressed dashas for annual charts appears in Tajika Neelakanthi and other Tajika texts. The underlying logic is elegant: if the Vimshottari proportions govern the 120-year life cycle, the same proportions should govern the 1-year micro-cycle. This principle of self-similar scaling (the year mirrors the life) is reminiscent of fractal patterns in nature. Indian astrologers also use Yogini Dasha compressed into a year as an alternative, but Mudda Dasha (Vimshottari-based) remains the most widely used annual dasha system.', hi: 'वार्षिक कुण्डलियों के लिए संकुचित दशाओं की अवधारणा ताजिक नीलकण्ठी और अन्य ताजिक ग्रन्थों में आती है। अन्तर्निहित तर्क सुन्दर है: यदि विंशोत्तरी अनुपात 120 वर्ष के जीवन चक्र को नियन्त्रित करते हैं, तो वही अनुपात 1 वर्ष के सूक्ष्म-चक्र को भी नियन्त्रित करने चाहिए। स्व-समान मापन का यह सिद्धान्त (वर्ष जीवन को प्रतिबिम्बित करता है) प्रकृति में भग्नगणित (फ्रैक्टल) प्रतिमानों की स्मृति दिलाता है। भारतीय ज्योतिषी विकल्प के रूप में योगिनी दशा को भी एक वर्ष में संकुचित करते हैं, किन्तु मुद्दा दशा (विंशोत्तरी-आधारित) सर्वाधिक प्रचलित वार्षिक दशा पद्धति बनी हुई है।', sa: 'वार्षिक कुण्डलियों के लिए संकुचित दशाओं की अवधारणा ताजिक नीलकण्ठी और अन्य ताजिक ग्रन्थों में आती है। अन्तर्निहित तर्क सुन्दर है: यदि विंशोत्तरी अनुपात 120 वर्ष के जीवन चक्र को नियन्त्रित करते हैं, तो वही अनुपात 1 वर्ष के सूक्ष्म-चक्र को भी नियन्त्रित करने चाहिए। स्व-समान मापन का यह सिद्धान्त (वर्ष जीवन को प्रतिबिम्बित करता है) प्रकृति में भग्नगणित (फ्रैक्टल) प्रतिमानों की स्मृति दिलाता है। भारतीय ज्योतिषी विकल्प के रूप में योगिनी दशा को भी एक वर्ष में संकुचित करते हैं, किन्तु मुद्दा दशा (विंशोत्तरी-आधारित) सर्वाधिक प्रचलित वार्षिक दशा पद्धति बनी हुई है।' }, locale)}
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
          {tl({ en: 'Computing the Starting Point', hi: 'आरम्भिक बिन्दु गणना', sa: 'आरम्भिक बिन्दु गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जन्म विंशोत्तरी से महत्त्वपूर्ण अन्तर: मुद्दा दशा का आरम्भिक ग्रह वार्षिक लग्न के नक्षत्र से निर्धारित होता है, जन्म चन्द्रमा के नक्षत्र से नहीं। ज्ञात करें कि वर्षफल लग्न अंश किस नक्षत्र में पड़ता है, और उस नक्षत्र का स्वामी प्रथम मुद्दा दशा ग्रह बनता है। उस दशा का शेष अंश लग्न ने नक्षत्र में कितनी प्रगति की है उससे गणित होता है।</>
            : <>The crucial difference from natal Vimshottari: the starting planet of Mudda Dasha is determined by the ANNUAL LAGNA&apos;s nakshatra, not the birth Moon&apos;s nakshatra. Find which nakshatra the Varshaphal Ascendant degree falls in, and the lord of that nakshatra becomes the first Mudda Dasha planet. The remaining balance of that dasha is computed from how far the lagna has progressed through the nakshatra.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          After the first planet&apos;s remaining period expires, the sequence follows standard Vimshottari order: Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury, and back to Ketu if the year hasn&apos;t ended. Each planet&apos;s full Mudda Dasha period applies for subsequent entries.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">वर्षफल लग्न 25 अंश कर्क पर:</span> 25 अंश कर्क = 115 अंश निरपेक्ष। नक्षत्र = floor(115 / 13.333) + 1 = floor(8.625) + 1 = 8 + 1 = 9वाँ नक्षत्र = आश्लेषा (16.667 से 30 अंश कर्क)। आश्लेषा स्वामी = बुध। अतः बुध मुद्दा दशा पहले आरम्भ होती है। आश्लेषा में स्थिति = 115 - 106.667 = 8.333 अंश। पार किया भाग = 8.333 / 13.333 = 0.625 (62.5% पूर्ण)। शेष बुध मुद्दा दशा = (1 - 0.625) x 51.74 दिन = 19.4 दिन। बुध समाप्ति के बाद केतु मुद्दा दशा (21.31 दिन), फिर शुक्र (60.88 दिन), इत्यादि वर्ष भर।</>
            : <><span className="text-gold-light font-medium">Varshaphal lagna at 25 degrees Cancer:</span> 25 degrees Cancer = 115 degrees absolute. Nakshatra = floor(115 / 13.333) + 1 = floor(8.625) + 1 = 8 + 1 = 9th nakshatra = Ashlesha (16.667 degrees to 30 degrees Cancer). Ashlesha lord = Mercury. So Mercury Mudda Dasha starts first. Position within Ashlesha = 115 - 106.667 = 8.333 degrees. Fraction traversed = 8.333 / 13.333 = 0.625 (62.5% done). Remaining Mercury Mudda Dasha = (1 - 0.625) x 51.74 days = 19.4 days. After Mercury expires, Ketu Mudda Dasha begins (21.31 days), then Venus (60.88 days), and so on through the year.</>}
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
          {tl({ en: 'Month-Level Prediction with Mudda Dasha', hi: 'मुद्दा दशा से मास-स्तरीय फलादेश', sa: 'मुद्दा दशा से मास-स्तरीय फलादेश' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>मुद्दा दशा की वास्तविक शक्ति ताजिक योगों के साथ संयोजित होने पर प्रकट होती है। ताजिक विश्लेषण बताता है कि घटना होगी या नहीं (इत्थशाल = हाँ, ईषराफ = नहीं)। मुद्दा दशा बताती है कि वर्ष में कब — किस ग्रह की अवधि में। यदि शुक्र का सप्तम स्वामी से इत्थशाल है (इस वर्ष विवाह), और शुक्र मुद्दा दशा 15 मार्च से 14 मई तक चलती है, तो मार्च-मई विवाह की खिड़की है।</>
            : <>The real power of Mudda Dasha emerges when combined with Tajika yogas. The Tajika analysis tells you IF an event will happen (Ithasala = yes, Easarapha = no). Mudda Dasha tells you WHEN within the year — during which planet&apos;s period. If Venus has Ithasala with the 7th lord (marriage this year), and Venus Mudda Dasha runs from March 15 to May 14, then March-May is the marriage window.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          For convergent validation, cross-check with the natal Vimshottari. If the natal chart is also running Venus dasha/bhukti during the same period, confidence is very high. This convergence of annual and natal timing is one of the strongest prediction techniques in Indian astrology — when both the macro (natal dasha) and micro (Mudda Dasha) cycles align on the same planet for the same event, the prediction becomes near-certain.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;मुद्दा दशा जन्म विंशोत्तरी को प्रतिस्थापित या अधिभावी करती है।&quot; मुद्दा दशा केवल वार्षिक कुण्डली में कार्य करती है और उस विशिष्ट वर्ष के लिए मास-स्तरीय समय प्रदान करती है। यह जन्म विंशोत्तरी को प्रतिस्थापित नहीं करती जो जीवन-स्तरीय समयरेखा को नियन्त्रित करती है। दोनों साथ प्रयुक्त होती हैं — जन्म दशा दशक-स्तरीय चित्र के लिए, मुद्दा दशा मास-स्तरीय परिशोधन के लिए। सर्वोच्च विश्वास के लिए घटना को दोनों पद्धतियों का समर्थन मिलना चाहिए।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Mudda Dasha replaces or overrides the natal Vimshottari.&quot; Mudda Dasha operates ONLY within the annual chart and provides month-level timing for that specific year. It does NOT replace the natal Vimshottari which governs the life-level timeline. Both are used together — natal dasha for the decade-level picture, Mudda Dasha for the month-level refinement. An event must be supported by BOTH systems for highest confidence.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>हमारा वर्षफल उपकरण वर्ष की सम्पूर्ण मुद्दा दशा समयरेखा गणित करता है, प्रत्येक ग्रह की अवधि की सटीक आरम्भ और समाप्ति तिथियाँ दिखाता है। यह उन मुद्दा दशा अवधियों को भी उजागर करता है जो अनुकूल ताजिक योगों के साथ मेल खाती हैं, जिससे उपयोगकर्ताओं को करियर, सम्बन्ध, स्वास्थ्य और अन्य जीवन क्षेत्रों के &quot;सक्रिय माहों&quot; की दृश्य समयरेखा मिलती है। अभिसारी प्रमाणीकरण सुविधा मुद्दा दशा को जन्म विंशोत्तरी से क्रॉस-रेफरेंस करती है, उन अवधियों को चिह्नित करती है जहाँ दोनों पद्धतियाँ मेल खाती हैं — ये सर्वोच्च विश्वास की फलादेश खिड़कियाँ हैं।</>
            : <>Our Varshaphal tool computes the complete Mudda Dasha timeline for the year, showing exact start and end dates for each planet&apos;s period. It also highlights which Mudda Dasha periods coincide with favorable Tajika yogas, giving users a visual timeline of &quot;hot months&quot; for career, relationships, health, and other life areas. The convergent validation feature cross-references Mudda Dasha with the natal Vimshottari, flagging periods where both systems align — these are the highest-confidence prediction windows.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

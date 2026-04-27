'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/31-1.json';

const META: ModuleMeta = {
  id: 'mod_31_1', phase: 9, topic: 'Muhurta', moduleNumber: '31.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/17-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/17-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/muhurta-ai' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q31_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q31_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q31_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q31_1_04', type: 'true_false',
    question: L.questions[3].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
];

/* ---- Sarvartha Siddhi examples (hoisted) ---- */
const SARVARTHA_EXAMPLES = [
  { day: 'Sunday', dayHi: 'रविवार', nakshatras: 'Pushya, Hasta, Ashwini, Mrigashira, Punarvasu, Shravan', nakshatrasHi: 'पुष्य, हस्त, अश्विनी, मृगशिरा, पुनर्वसु, श्रवण' },
  { day: 'Monday', dayHi: 'सोमवार', nakshatras: 'Rohini, Mrigashira, Pushya, Anuradha, Hasta, Shravan', nakshatrasHi: 'रोहिणी, मृगशिरा, पुष्य, अनुराधा, हस्त, श्रवण' },
  { day: 'Tuesday', dayHi: 'मंगलवार', nakshatras: 'Ashwini, Uttara Phalguni, Krittika, Chitra', nakshatrasHi: 'अश्विनी, उत्तर फाल्गुनी, कृत्तिका, चित्रा' },
  { day: 'Wednesday', dayHi: 'बुधवार', nakshatras: 'Rohini, Anuradha, Hasta, Jyeshtha, Shravan', nakshatrasHi: 'रोहिणी, अनुराधा, हस्त, ज्येष्ठा, श्रवण' },
  { day: 'Thursday', dayHi: 'गुरुवार', nakshatras: 'Ashwini, Pushya, Punarvasu, Revati, Anuradha, Shravan', nakshatrasHi: 'अश्विनी, पुष्य, पुनर्वसु, रेवती, अनुराधा, श्रवण' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Sarvartha Siddhi Yoga', hi: 'सर्वार्थ सिद्धि योग', sa: 'सर्वार्थ सिद्धि योग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सर्वार्थ सिद्धि योग मुहूर्त शास्त्र के सबसे शक्तिशाली और व्यावहारिक योगों में से एक है। "सर्वार्थ" = सभी उद्देश्य, "सिद्धि" = सफलता — जब विशिष्ट वार (सप्ताह का दिन) विशिष्ट नक्षत्रों के साथ संयोग करते हैं, तो यह योग बनता है। इस योग में प्रारम्भ किए गए कार्य सफल होने की अधिक सम्भावना रखते हैं। यह अन्य अशुभ कारकों (विष्टि करण, कुछ अशुभ योगों) को भी कम कर सकता है।</>
            : <>Sarvartha Siddhi Yoga is one of the most powerful and practical yogas in muhurta shastra. &quot;Sarvartha&quot; = all purposes, &quot;Siddhi&quot; = success — when specific weekdays combine with specific nakshatras, this yoga forms. Activities initiated during this yoga have a higher probability of success. It can even mitigate certain negative factors like Vishti Karana or some inauspicious yogas.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Sarvartha Siddhi Combinations', hi: 'सर्वार्थ सिद्धि संयोजन', sa: 'सर्वार्थ सिद्धि संयोजन' }, locale)}
        </h4>
        <div className="space-y-1.5">
          {SARVARTHA_EXAMPLES.map((row, i) => (
            <p key={i} className="text-text-secondary text-xs leading-relaxed">
              <span className="text-gold-light font-semibold">{isHi ? row.dayHi : row.day}:</span>{' '}
              {isHi ? row.nakshatrasHi : row.nakshatras}
            </p>
          ))}
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
          {tl({ en: 'Amrita Siddhi & Siddha Yoga', hi: 'अमृत सिद्धि और सिद्ध योग', sa: 'अमृत सिद्धि और सिद्ध योग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अमृत सिद्धि योग वार और तिथि के विशिष्ट संयोजन से बनता है — जैसे रविवार + द्वितीया, सोमवार + सप्तमी, मंगलवार + षष्ठी, बुधवार + द्वादशी, गुरुवार + एकादशी, शुक्रवार + दशमी, शनिवार + नवमी। "अमृत" = अमृत/अमरत्व — इस योग में प्रारम्भ किए गए कार्यों पर अमृत जैसी सफलता बरसती है। सिद्ध योग एक अन्य शुभ संयोजन है जो वार, तिथि, और नक्षत्र तीनों की अनुकूलता से बनता है।</>
            : <>Amrita Siddhi Yoga forms from specific weekday-tithi combinations — Sunday + Dvitiya, Monday + Saptami, Tuesday + Shashthi, Wednesday + Dvadashi, Thursday + Ekadashi, Friday + Dashami, Saturday + Navami. &quot;Amrita&quot; = nectar/immortality — activities initiated during this yoga receive nectar-like success. Siddha Yoga is another auspicious combination formed from the favorability of weekday, tithi, AND nakshatra together.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Absolute Prohibitions (Tyajya)', hi: 'पूर्ण निषेध (त्याज्य)', sa: 'पूर्ण निषेध (त्याज्य)' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>कुछ अशुभ योग इतने प्रबल हैं कि कोई भी शुभ योग उन्हें नहीं काट सकता। इनमें शामिल हैं: (1) ग्रहण काल — सूर्य या चन्द्र ग्रहण के दौरान कोई शुभ कार्य नहीं; (2) पंचक — चन्द्र धनिष्ठा से रेवती (नक्षत्र 23-27) में हो; (3) विष्टि/भद्रा करण — अत्यन्त अशुभ, विशेषकर यात्रा और विवाह के लिए; (4) राहु काल — रोज़ाना का अशुभ कालखण्ड।</>
            : <>Certain inauspicious yogas are so powerful that no positive yoga can override them. These include: (1) Eclipse period — no auspicious work during solar or lunar eclipse; (2) Panchaka — Moon in Dhanishtha to Revati (nakshatras 23-27); (3) Vishti/Bhadra Karana — extremely inauspicious, especially for travel and marriage; (4) Rahu Kala — the daily inauspicious period that must always be avoided for important beginnings.</>}
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
          {tl({ en: 'Marriage Muhurta Deep Dive', hi: 'विवाह मुहूर्त गहन अध्ययन', sa: 'विवाह मुहूर्त गहन अध्ययन' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>विवाह मुहूर्त सबसे जटिल मुहूर्त है क्योंकि इसमें सबसे अधिक शर्तें एक साथ पूरी होनी चाहिए। शास्त्रीय नियम: (1) तिथि — रिक्त तिथियाँ (4/9/14) वर्जित, अमावस्या वर्जित; (2) नक्षत्र — भरणी, कृत्तिका, आर्द्रा, आश्लेषा, मघा, विशाखा, ज्येष्ठा, मूल वर्जित; (3) वार — मंगलवार और शनिवार वर्जित; (4) योग — व्याघात, वज्र, परिघ, विष्कम्भ वर्जित; (5) मुहूर्त लग्न में सप्तम भाव पाप ग्रहों से मुक्त; (6) चन्द्र शुक्ल पक्ष में हो।</>
            : <>Marriage muhurta is the most complex because the greatest number of conditions must be simultaneously satisfied. Classical rules: (1) Tithi — Rikta tithis (4/9/14) forbidden, Amavasya forbidden; (2) Nakshatra — Bharani, Krittika, Ardra, Ashlesha, Magha, Vishakha, Jyeshtha, Moola forbidden; (3) Vara — Tuesday and Saturday forbidden; (4) Yoga — Vyaghata, Vajra, Parigha, Vishkambha forbidden; (5) The 7th house in the muhurta lagna must be free of malefics; (6) Moon should be in Shukla Paksha.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Advanced Marriage Conditions', hi: 'उन्नत विवाह शर्तें', sa: 'उन्नत विवाह शर्तें' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Tarabala:', hi: 'तारा बल:', sa: 'तारा बल:' }, locale)}</span>{' '}
            {tl({ en: 'The Moon\'s nakshatra at the muhurta moment must be in a favorable Tara position from both the bride\'s and groom\'s birth nakshatras.', hi: 'मुहूर्त क्षण में चन्द्र का नक्षत्र वधू और वर दोनों के जन्म नक्षत्र से अनुकूल तारा स्थिति में होना चाहिए।', sa: 'मुहूर्त क्षण में चन्द्र का नक्षत्र अनुकूल तारा स्थिति में होना चाहिए।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Chandrabala:', hi: 'चन्द्र बल:', sa: 'चन्द्र बल:' }, locale)}</span>{' '}
            {tl({ en: 'The transit Moon should be in houses 1, 3, 6, 7, 10, or 11 from the natal Moon of the bride. Houses 2, 5, 8, 9, 12 from natal Moon should be avoided.', hi: 'गोचर चन्द्रमा वधू के जन्म चन्द्र से 1, 3, 6, 7, 10, या 11वें भाव में होना चाहिए। जन्म चन्द्र से 2, 5, 8, 9, 12वें भाव से बचना चाहिए।', sa: 'गोचर चन्द्रमा वधू के जन्म चन्द्र से अनुकूल भाव में होना चाहिए।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Try It: Muhurta AI Tool', hi: 'इसे आज़माएँ: मुहूर्त AI उपकरण', sa: 'इसे आज़माएँ: मुहूर्त AI उपकरण' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Our Muhurta AI tool applies all these classical rules automatically — it scores potential muhurtas across 20+ activity types including marriage, weighing tithi, nakshatra, yoga, karana, vara, Rahu Kala, Yamaganda, and Panchaka. It finds the optimal windows within your specified date range and explains why each factor is favorable or unfavorable.', hi: 'हमारा मुहूर्त AI उपकरण इन सभी शास्त्रीय नियमों को स्वचालित रूप से लागू करता है — यह विवाह सहित 20+ गतिविधि प्रकारों में सम्भावित मुहूर्तों को तिथि, नक्षत्र, योग, करण, वार, राहु काल, यमगण्ड, और पंचक के आधार पर मूल्यांकित करता है।', sa: 'हमारा मुहूर्त AI उपकरण इन सभी शास्त्रीय नियमों को स्वचालित रूप से लागू करता है।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module31_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

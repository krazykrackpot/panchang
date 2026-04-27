'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/29-2.json';

const META: ModuleMeta = {
  id: 'mod_29_2', phase: 8, topic: 'Medical Jyotish', moduleNumber: '29.2',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/29-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/7-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q29_2_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q29_2_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q29_2_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

/* ---- Dosha-Planet mapping (hoisted) ---- */
const DOSHA_MAP = [
  { dosha: 'Vata (Wind)', doshaHi: 'वात (वायु)', planets: 'Saturn, Rahu', planetsHi: 'शनि, राहु', qualities: 'Cold, dry, light, mobile', qualitiesHi: 'शीत, शुष्क, हल्का, चंचल' },
  { dosha: 'Pitta (Fire)', doshaHi: 'पित्त (अग्नि)', planets: 'Sun, Mars, Ketu', planetsHi: 'सूर्य, मंगल, केतु', qualities: 'Hot, sharp, oily, intense', qualitiesHi: 'उष्ण, तीक्ष्ण, स्निग्ध, तीव्र' },
  { dosha: 'Kapha (Water)', doshaHi: 'कफ (जल)', planets: 'Moon, Jupiter, Venus', planetsHi: 'चन्द्र, गुरु, शुक्र', qualities: 'Heavy, slow, cool, stable', qualitiesHi: 'भारी, मन्द, शीतल, स्थिर' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Prakriti from the Birth Chart', hi: 'जन्म कुण्डली से प्रकृति', sa: 'जन्म कुण्डली से प्रकृति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आयुर्वेद में प्रकृति (शारीरिक-मानसिक संरचना) व्यक्ति के स्वास्थ्य का मूल आधार है। ज्योतिष से प्रकृति निर्धारण सम्भव है क्योंकि प्रत्येक ग्रह एक विशिष्ट दोष (वात, पित्त, कफ) से सम्बन्धित है। लग्न राशि, लग्नेश, चन्द्र राशि और सबसे प्रबल ग्रहों के आधार पर व्यक्ति की प्राथमिक प्रकृति निर्धारित की जाती है।</>
            : <>In Ayurveda, Prakriti (constitutional type) is the foundation of individual health. Jyotish can determine Prakriti because each planet corresponds to a specific dosha (Vata, Pitta, Kapha). Based on the Lagna sign, Lagna lord, Moon sign, and the strongest planets in the chart, the native&apos;s primary Prakriti can be determined.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Dosha-Planet Correspondences', hi: 'दोष-ग्रह सम्बन्ध', sa: 'दोष-ग्रह सम्बन्ध' }, locale)}
        </h4>
        <div className="space-y-3">
          {DOSHA_MAP.map((row, i) => (
            <div key={i} className="text-text-secondary text-xs leading-relaxed">
              <span className="text-gold-light font-semibold">{isHi ? row.doshaHi : row.dosha}:</span>{' '}
              {isHi ? row.planetsHi : row.planets}
              <br />
              <span className="text-text-secondary/60">{isHi ? row.qualitiesHi : row.qualities}</span>
            </div>
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
          {tl({ en: 'Hora-Based Daily Routine', hi: 'होरा-आधारित दैनिक दिनचर्या', sa: 'होरा-आधारित दैनिक दिनचर्या' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आयुर्वेदिक दिनचर्या (दैनिक दिनचर्या) को ज्योतिषीय होरा (ग्रहीय घण्टे) के साथ संयोजित करने पर एक शक्तिशाली समय-आधारित स्वास्थ्य प्रणाली बनती है। प्रत्येक होरा का एक शासक ग्रह होता है, और उस ग्रह की प्रकृति के अनुरूप गतिविधियाँ उस समय सबसे प्रभावी होती हैं। ब्रह्म मुहूर्त (सूर्योदय से 96 मिनट पहले) आध्यात्मिक साधना और अध्ययन के लिए आदर्श है।</>
            : <>When Ayurvedic Dinacharya (daily routine) is combined with Jyotish hora (planetary hours), a powerful time-based health system emerges. Each hora has a ruling planet, and activities matching that planet&apos;s nature are most effective during its time. Brahma Muhurta (96 minutes before sunrise) is ideal for spiritual practice and study. Sun hora is best for authority-related activities, Moon hora for nurturing, Mars hora for physical exercise.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Dosha Timing Through the Day', hi: 'दिन भर दोष का समय', sa: 'दिन भर दोष का समय' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Kapha (6 AM - 10 AM):', hi: 'कफ (प्रातः 6 - 10):', sa: 'कफ (प्रातः 6 - 10):' }, locale)}</span>{' '}
            {tl({ en: 'Heavy, stable energy. Best for grounding activities, routine work. Avoid heavy meals.', hi: 'भारी, स्थिर ऊर्जा। स्थिरता वाले कार्यों के लिए सर्वोत्तम। भारी भोजन से बचें।', sa: 'भारी, स्थिर ऊर्जा।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Pitta (10 AM - 2 PM):', hi: 'पित्त (10 AM - 2 PM):', sa: 'पित्त (10 AM - 2 PM):' }, locale)}</span>{' '}
            {tl({ en: 'Peak digestive fire. Eat the largest meal of the day. Best for intellectual work.', hi: 'पाचक अग्नि चरम पर। दिन का सबसे बड़ा भोजन करें। बौद्धिक कार्य के लिए सर्वोत्तम।', sa: 'पाचक अग्नि चरम पर।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Vata (2 PM - 6 PM):', hi: 'वात (2 PM - 6 PM):', sa: 'वात (2 PM - 6 PM):' }, locale)}</span>{' '}
            {tl({ en: 'Light, creative energy. Best for creative work, communication, and movement.', hi: 'हल्की, सृजनात्मक ऊर्जा। सृजनात्मक कार्य, संवाद और गतिविधि के लिए सर्वोत्तम।', sa: 'हल्की, सृजनात्मक ऊर्जा।' }, locale)}
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
          {tl({ en: 'Tithi-Aligned Nutrition & Fasting', hi: 'तिथि-अनुरूप पोषण और उपवास', sa: 'तिथि-अनुरूप पोषण और उपवास' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वैदिक परम्परा में विशिष्ट तिथियों पर उपवास और आहार नियम हैं जो चन्द्र चक्र के शारीरिक प्रभावों पर आधारित हैं। एकादशी (11वीं तिथि) सबसे महत्वपूर्ण उपवास दिन है — इस दिन पाचक अग्नि प्राकृतिक रूप से मन्द होती है, जिससे उपवास शारीरिक रूप से लाभकारी होता है। पूर्णिमा पर शरीर में जल प्रतिधारण बढ़ती है (चन्द्र का ज्वारीय प्रभाव), इसलिए हल्का भोजन श्रेष्ठ है। अमावस्या पर विषहरण (डिटॉक्स) उपयुक्त है।</>
            : <>Vedic tradition prescribes specific fasting and dietary rules on particular tithis, based on the Moon cycle&apos;s physical effects on the body. Ekadashi (11th tithi) is the most important fasting day — digestive fire is naturally low on this day, making fasting physically beneficial. On Purnima (Full Moon), water retention in the body increases (lunar tidal effect), so light meals are recommended. Amavasya (New Moon) is suitable for detoxification.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Weekday-Food Associations', hi: 'वार-आहार सम्बन्ध', sa: 'वार-आहार सम्बन्ध' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>प्रत्येक वार के शासक ग्रह के अनुरूप कुछ खाद्य पदार्थ विशेष रूप से लाभकारी माने जाते हैं। रविवार (सूर्य) — गेहूँ, गुड़। सोमवार (चन्द्र) — चावल, दूध। मंगलवार (मंगल) — दाल, मसूर। बुधवार (बुध) — मूँग, हरी सब्जियाँ। गुरुवार (गुरु) — चना, घी। शुक्रवार (शुक्र) — खीर, मिठाई। शनिवार (शनि) — तिल, सरसों का तेल। यह "ग्रहीय पोषण" का सिद्धान्त है।</>
            : <>Each weekday&apos;s ruling planet is associated with foods that are especially beneficial. Sunday (Sun) — wheat, jaggery. Monday (Moon) — rice, milk. Tuesday (Mars) — lentils, masoor dal. Wednesday (Mercury) — moong, green vegetables. Thursday (Jupiter) — chickpeas, ghee. Friday (Venus) — kheer, sweets. Saturday (Saturn) — sesame, mustard oil. This is the principle of &quot;planetary nutrition&quot; — aligning diet with cosmic rhythms.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module29_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

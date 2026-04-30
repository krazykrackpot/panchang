'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-4.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_21_4', phase: 8, topic: 'Varshaphal', moduleNumber: '21.4',
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
          'Tithi Pravesha occurs when the Sun-Moon angle at your birth repeats each year — the exact moment creates a powerful annual prediction chart.',
          'Unlike the solar return (same Sun position), Tithi Pravesha uses the same lunisolar relationship, making it unique to Vedic astrology.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Tithi Pravesha?', hi: 'तिथि प्रवेश क्या है?', sa: 'तिथि प्रवेश क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तिथि प्रवेश एक वार्षिक कुण्डली है जो उस क्षण के लिए बनाई जाती है जब जन्म का सूर्य-चन्द्र कोणीय सम्बन्ध (जन्म तिथि) प्रत्येक वर्ष पुनरावृत्त होता है। जहाँ वर्षफल (सौर प्रत्यावर्तन) सूर्य के अपने यथार्थ जन्म भोगांश पर लौटने को ट्रैक करता है, वहीं तिथि प्रवेश सूर्य-चन्द्र सम्बन्ध के लौटने को — वही तिथि, उसी सौर मास में। यह हिन्दू परम्परा में गहराई से निहित है जहाँ व्यक्ति का &quot;वास्तविक&quot; जन्मदिन उसकी जन्म तिथि है, ग्रेगोरियन तिथि नहीं।</>
            : <>Tithi Pravesha is an annual chart cast for the moment when the Sun-Moon angular relationship at birth (the natal tithi) recurs each year. While Varshaphal (solar return) tracks the Sun&apos;s return to its exact natal longitude, Tithi Pravesha tracks the return of the Sun-Moon RELATIONSHIP — the same tithi, in the same solar month. This is deeply rooted in Hindu tradition where a person&apos;s &quot;real&quot; birthday is their Janma Tithi (birth tithi), not the Gregorian date.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'For example, if you were born on Shukla Panchami (5th tithi of the bright half) when the Sun was in Taurus, your Tithi Pravesha each year is the moment when the Moon-Sun elongation again reaches the Panchami value (48-60 degrees) while the Sun is in Taurus. This moment may fall a few days before or after your Gregorian birthday.', hi: 'उदाहरणार्थ, यदि आपका जन्म शुक्ल पंचमी (शुक्ल पक्ष की 5वीं तिथि) पर हुआ जब सूर्य वृषभ में था, तो आपका प्रत्येक वर्ष का तिथि प्रवेश वह क्षण है जब चन्द्र-सूर्य विस्तार पुनः पंचमी मान (48-60 अंश) पर पहुँचता है जबकि सूर्य वृषभ में हो। यह क्षण आपके ग्रेगोरियन जन्मदिन से कुछ दिन पहले या बाद में पड़ सकता है।', sa: 'उदाहरणार्थ, यदि आपका जन्म शुक्ल पंचमी (शुक्ल पक्ष की 5वीं तिथि) पर हुआ जब सूर्य वृषभ में था, तो आपका प्रत्येक वर्ष का तिथि प्रवेश वह क्षण है जब चन्द्र-सूर्य विस्तार पुनः पंचमी मान (48-60 अंश) पर पहुँचता है जबकि सूर्य वृषभ में हो। यह क्षण आपके ग्रेगोरियन जन्मदिन से कुछ दिन पहले या बाद में पड़ सकता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Tithi Pravesha has deep roots in the Vedic tradition of celebrating birthdays by tithi rather than solar date. The Dharmashastra texts prescribe rituals on the Janma Tithi (birth tithi) each year. The astrological application — casting a predictive chart for the TP moment — was championed by Sanjay Rath and other modern Jyotish scholars who argued that the tithi-based return honors the lunar essence of Vedic astrology better than the purely solar Varshaphal. The TP technique draws from both Parashari principles (houses, lordships) and Tajika methodology (annual chart interpretation).', hi: 'तिथि प्रवेश की जड़ें सौर तिथि के बजाय तिथि द्वारा जन्मदिन मनाने की वैदिक परम्परा में गहरी हैं। धर्मशास्त्र ग्रन्थ प्रत्येक वर्ष जन्म तिथि पर अनुष्ठान निर्धारित करते हैं। ज्योतिषीय अनुप्रयोग — TP क्षण के लिए भविष्यवाणी कुण्डली बनाना — संजय रथ और अन्य आधुनिक ज्योतिष विद्वानों द्वारा प्रचारित किया गया जिन्होंने तर्क दिया कि तिथि-आधारित प्रत्यावर्तन विशुद्ध सौर वर्षफल से बेहतर वैदिक ज्योतिष के चान्द्र सार का सम्मान करता है। TP तकनीक पाराशरी सिद्धान्तों (भाव, स्वामित्व) और ताजिक पद्धति (वार्षिक कुण्डली व्याख्या) दोनों से ग्रहण करती है।', sa: 'तिथि प्रवेश की जड़ें सौर तिथि के बजाय तिथि द्वारा जन्मदिन मनाने की वैदिक परम्परा में गहरी हैं। धर्मशास्त्र ग्रन्थ प्रत्येक वर्ष जन्म तिथि पर अनुष्ठान निर्धारित करते हैं। ज्योतिषीय अनुप्रयोग — TP क्षण के लिए भविष्यवाणी कुण्डली बनाना — संजय रथ और अन्य आधुनिक ज्योतिष विद्वानों द्वारा प्रचारित किया गया जिन्होंने तर्क दिया कि तिथि-आधारित प्रत्यावर्तन विशुद्ध सौर वर्षफल से बेहतर वैदिक ज्योतिष के चान्द्र सार का सम्मान करता है। TP तकनीक पाराशरी सिद्धान्तों (भाव, स्वामित्व) और ताजिक पद्धति (वार्षिक कुण्डली व्याख्या) दोनों से ग्रहण करती है।' }, locale)}
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
          {tl({ en: 'Computing Tithi Pravesha', hi: 'तिथि प्रवेश गणना', sa: 'तिथि प्रवेश गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तिथि प्रवेश क्षण की गणना के लिए वह जूलियन दिन (JD) ज्ञात करना आवश्यक है जब दो शर्तें एक साथ पूरी हों: (1) चन्द्र-सूर्य विस्तार (चन्द्र भोगांश घटा सूर्य भोगांश) जन्म विस्तार के बराबर हो, और (2) सूर्य जन्म की ही राशि में हो। पहली शर्त वही तिथि सुनिश्चित करती है; दूसरी सुनिश्चित करती है कि यह सही वार्षिक चक्र में घटे (वर्ष में किसी भी यादृच्छिक समय पर जब तिथि पुनरावृत्त हो, वहाँ नहीं)।</>
            : <>Computing the Tithi Pravesha moment requires finding the Julian Day (JD) when two conditions simultaneously hold: (1) the Moon-Sun elongation (Moon&apos;s longitude minus Sun&apos;s longitude) equals the natal elongation, AND (2) the Sun is within the same zodiacal sign as at birth. The first condition ensures the same tithi; the second ensures it occurs in the correct annual cycle (not at any random time during the year when the tithi recurs).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Since the tithi recurs roughly every lunar month (~29.5 days), there are about 12-13 occurrences of your birth tithi each year. The Sun-sign condition filters this down to exactly ONE occurrence — the one when the Sun is in the same sign as at your birth. This is your annual Tithi Pravesha moment.', hi: 'चूँकि तिथि लगभग प्रत्येक चान्द्र मास (~29.5 दिन) में पुनरावृत्त होती है, वर्ष में आपकी जन्म तिथि के लगभग 12-13 अवसर होते हैं। सूर्य-राशि शर्त इसे ठीक एक अवसर तक सीमित करती है — वह जब सूर्य जन्म की ही राशि में हो। यह आपका वार्षिक तिथि प्रवेश क्षण है।', sa: 'चूँकि तिथि लगभग प्रत्येक चान्द्र मास (~29.5 दिन) में पुनरावृत्त होती है, वर्ष में आपकी जन्म तिथि के लगभग 12-13 अवसर होते हैं। सूर्य-राशि शर्त इसे ठीक एक अवसर तक सीमित करती है — वह जब सूर्य जन्म की ही राशि में हो। यह आपका वार्षिक तिथि प्रवेश क्षण है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">15 अप्रैल को जन्म — सूर्य 1 अंश मेष, चन्द्र 55 अंश (25 अंश वृषभ):</span> जन्म विस्तार = 55 - 1 = 54 अंश (शुक्ल पंचमी)। 2026 तिथि प्रवेश के लिए: वह क्षण ज्ञात करें जब (क) चन्द्र - सूर्य = 54 अंश और (ख) सूर्य मेष (0-30 अंश) में हो। सूर्य लगभग 14 अप्रैल को मेष में प्रवेश करता है और लगभग 14 मई को निकलता है। इस खिड़की में 54 अंश का चन्द्र-सूर्य विस्तार एक बार होगा — सम्भवतः 17 अप्रैल प्रातः 3:42 पर। यही TP क्षण है। जातक के स्थान पर उस क्षण की कुण्डली बनाएँ।</>
            : <><span className="text-gold-light font-medium">Born April 15 — Sun at 1 degree Aries, Moon at 55 degrees (25 degrees Taurus):</span> Natal elongation = 55 - 1 = 54 degrees (Shukla Panchami). For the 2026 Tithi Pravesha: find the moment when (a) Moon - Sun = 54 degrees AND (b) Sun is in Aries (0-30 degrees). The Sun enters Aries around April 14 and leaves around May 14. During this window, the Moon-Sun elongation of 54 degrees will occur once — perhaps on April 17 at 3:42 AM. That&apos;s the TP moment. Cast the chart for that moment at the native&apos;s location.</>}
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
          {tl({ en: 'TP vs Varshaphal: Complementary Perspectives', hi: 'TP बनाम वर्षफल: पूरक दृष्टिकोण', sa: 'TP बनाम वर्षफल: पूरक दृष्टिकोण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वर्षफल सूर्य के प्रत्यावर्तन को — विशुद्ध सौर ऊर्जा को ट्रैक करता है। सूर्य आत्मा, करियर, अधिकार और स्व के बाह्य प्रक्षेपण का प्रतिनिधित्व करता है। अतः वर्षफल करियर परिवर्तन, सार्वजनिक मान्यता, अधिकार परिवर्तन और बाह्य जीवन घटनाओं की भविष्यवाणी में उत्कृष्ट है। तिथि प्रवेश सूर्य-चन्द्र सम्बन्ध — सौर और चान्द्र ऊर्जा की परस्पर क्रिया को ट्रैक करता है। चन्द्रमा मन (मनस), भावनाओं, माता और घरेलू क्षेत्र का प्रतिनिधित्व करता है। अतः TP भावनात्मक कल्याण, पारिवारिक गतिशीलता, सम्बन्ध परिवर्तन, मानसिक स्वास्थ्य और घरेलू विषयों की भविष्यवाणी में उत्कृष्ट है।</>
            : <>Varshaphal tracks the Sun&apos;s return — pure solar energy. The Sun represents the soul (atma), career, authority, and the external projection of self. Therefore, Varshaphal excels at predicting career changes, public recognition, authority shifts, and external life events. Tithi Pravesha tracks the Sun-Moon relationship — the interplay of solar and lunar energy. The Moon represents the mind (mana), emotions, mother, and domestic sphere. Therefore, TP excels at predicting emotional wellbeing, family dynamics, relationship changes, mental health, and domestic matters.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Many modern astrologers use BOTH charts for a comprehensive annual forecast. When both Varshaphal and TP independently point to the same event (e.g., both indicate a change of residence), the prediction confidence is very high. Our engine computes both charts, allowing users to see where the solar and lunar annual perspectives converge and diverge.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;तिथि प्रवेश वर्षफल के समान ही है।&quot; ये मूलभूत रूप से भिन्न हैं। वर्षफल तब बनता है जब सूर्य अपने जन्म अंश पर लौटता है (सौर घटना)। तिथि प्रवेश तब बनता है जब सूर्य-चन्द्र विस्तार अपने जन्म मान पर लौटता है (सौर-चान्द्र घटना)। ये भिन्न तिथियों पर घटते हैं, भिन्न कुण्डलियाँ बनाते हैं, और भिन्न जीवन क्षेत्रों पर बल देते हैं। इन्हें मिलाने से फलादेश गड्डमड्ड होते हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Tithi Pravesha is the same as Varshaphal.&quot; They are fundamentally different. Varshaphal is cast when the Sun returns to its natal degree (a solar event). Tithi Pravesha is cast when the Sun-Moon elongation returns to its natal value (a lunisolar event). They occur on DIFFERENT dates, produce DIFFERENT charts, and emphasize DIFFERENT life areas. Confusing them leads to mixing up predictions.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>तिथि प्रवेश के सटीक क्षण की मैनुअल गणना के लिए पुनरावर्ती गणना आवश्यक है — ज्ञात करना कि चन्द्र-सूर्य विस्तार जन्म मान से कब यथार्थतः मेल खाता है जबकि सूर्य सही राशि में हो। यह गणितीय रूप से गहन है। हमारा इंजन उसी मीयस-आधारित चान्द्र और सौर स्थिति एल्गोरिदम का उपयोग करके स्वचालित रूप से हल करता है जो दैनिक पंचांग को शक्ति प्रदान करता है, TP क्षण को कला-विकला सटीकता तक ज्ञात करता है। उपयोगकर्ताओं को वर्षफल और तिथि प्रवेश दोनों कुण्डलियाँ साथ-साथ मिलती हैं, भाव-दर-भाव तुलना सहित जो दिखाती है कि सौर और चान्द्र वार्षिक दृष्टिकोण कहाँ सहमत हैं — ये अभिसरण बिन्दु वर्ष के सबसे विश्वसनीय फलादेश हैं।</>
            : <>Computing the exact Tithi Pravesha moment manually requires iterative calculation — finding when the Moon-Sun elongation precisely matches the natal value while the Sun is in the correct sign. This is mathematically intensive. Our engine solves this automatically using the same Meeus-based lunar and solar position algorithms that power the daily Panchang, finding the TP moment to arc-second precision. Users get both the Varshaphal and Tithi Pravesha charts side by side, with house-by-house comparison showing where the solar and lunar annual perspectives agree — these convergence points are the year&apos;s most reliable predictions.</>}
        </p>
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
          {tl({ en: 'Five Key Indicators in a Tithi Pravesha Chart', hi: 'तिथि प्रवेश कुण्डली में पाँच प्रमुख सूचक', sa: 'तिथि प्रवेश कुण्डली में पाँच प्रमुख सूचक' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi ? <>तिथि प्रवेश कुण्डली की व्याख्या पाँच प्रमुख सूचकों पर केन्द्रित होती है: (1) TP लग्न और उसका स्वामी &mdash; वर्ष का सामान्य स्वर और दृष्टिकोण। (2) TP में चन्द्रमा का भाव &mdash; भावनात्मक केन्द्र बिन्दु। (3) TP में सूर्य का भाव &mdash; करियर और आत्मा की दिशा। (4) TP में जन्म लग्न स्वामी कहाँ गिरता है &mdash; जातक की व्यक्तिगत ऊर्जा कहाँ केन्द्रित होगी। (5) TP कुण्डली में योग &mdash; विशेष शुभ/अशुभ संयोग जो वर्ष की विशिष्ट घटनाओं का संकेत देते हैं।</> : <>Tithi Pravesha chart interpretation focuses on five key indicators: (1) TP Lagna and its lord &mdash; the general tone and outlook for the year. (2) Moon&rsquo;s house in TP &mdash; emotional focus point. (3) Sun&rsquo;s house in TP &mdash; career and soul direction. (4) Where the natal Lagna lord falls in TP &mdash; where the native&rsquo;s personal energy will concentrate. (5) Yogas in the TP chart &mdash; special benefic/malefic combinations indicating specific events for the year.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Additional Misconceptions', hi: 'अतिरिक्त भ्रान्तियाँ', sa: 'अतिरिक्त भ्रान्तियाँ' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;तिथि प्रवेश केवल हिन्दू जन्मतिथि के लिए कार्य करता है।&quot; TP किसी भी जन्म तिथि के लिए काम करता है। सूत्र सार्वभौमिक है: किसी भी जन्म तिथि पर सूर्य-चन्द्र विस्तार को ज्ञात करें, फिर प्रत्येक वर्ष उसकी पुनरावृत्ति का क्षण खोजें। धर्म या संस्कृति से स्वतन्त्र।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Tithi Pravesha only works for Hindu birthdays.&quot; TP works for any birth date. The formula is universal: find the Sun-Moon elongation at any birth date, then find the moment each year when it recurs. Independent of religion or culture.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;TP कुण्डली जन्म कुण्डली को प्रतिस्थापित करती है।&quot; TP केवल उस विशिष्ट वर्ष का चित्र है। जन्म कुण्डली सम्पूर्ण जीवन का नक्शा बनी रहती है। TP (और वर्षफल) वार्षिक &quot;मौसम पूर्वानुमान&quot; हैं, जबकि जन्म कुण्डली &quot;भूभाग&quot; (स्थायी जीवन संरचना) है।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The TP chart replaces the birth chart.&quot; TP is only a picture of that specific year. The birth chart remains the map of the entire life. TP (and Varshaphal) are annual &ldquo;weather forecasts,&rdquo; while the birth chart is the &ldquo;terrain&rdquo; (permanent life structure).</>}
        </p>
      </section>
    </div>
  );
}

export default function Module21_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/5-3.json';

const META: ModuleMeta = {
  id: 'mod_5_3', phase: 2, topic: 'Tithi', moduleNumber: '5.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'तिथि की अवधि क्यों बदलती है' : 'Why Tithi Duration Varies'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'A tithi is completed when the Moon gains 12 degrees of elongation over the Sun. The time this takes depends entirely on how fast the Moon is moving relative to the Sun at that moment. The Moon&apos;s speed is not constant — it follows Kepler&apos;s second law, sweeping out equal areas in equal times along its elliptical orbit. Near perigee (closest to Earth, about 356,500 km), the Moon races at roughly 15.4 degrees per day. Near apogee (farthest, about 406,700 km), it crawls at roughly 11.8 degrees per day. Meanwhile, the Sun&apos;s apparent motion is approximately 0.9 to 1.0 degrees per day.', hi: 'एक तिथि तब पूर्ण होती है जब चन्द्रमा सूर्य से 12 अंश की कोणीय दूरी अर्जित करता है। इसमें लगने वाला समय पूर्णतः इस पर निर्भर करता है कि उस क्षण चन्द्रमा सूर्य की तुलना में कितनी तीव्रता से चल रहा है। चन्द्रमा की गति स्थिर नहीं है — वह केपलर के द्वितीय नियम का पालन करता है, अपनी दीर्घवृत्ताकार कक्षा में समान समय में समान क्षेत्रफल को आच्छादित करता है। उपभू (पृथ्वी से निकटतम, लगभग 3,56,500 किमी) के निकट चन्द्रमा लगभग 15.4 अंश प्रतिदिन चलता है। अपभू (दूरस्थतम, लगभग 4,06,700 किमी) के निकट यह मात्र 11.8 अंश प्रतिदिन चलता है। इसी बीच सूर्य की दृश्य गति लगभग 0.9 से 1.0 अंश प्रतिदिन होती है।', sa: 'एक तिथि तब पूर्ण होती है जब चन्द्रमा सूर्य से 12 अंश की कोणीय दूरी अर्जित करता है। इसमें लगने वाला समय पूर्णतः इस पर निर्भर करता है कि उस क्षण चन्द्रमा सूर्य की तुलना में कितनी तीव्रता से चल रहा है। चन्द्रमा की गति स्थिर नहीं है — वह केपलर के द्वितीय नियम का पालन करता है, अपनी दीर्घवृत्ताकार कक्षा में समान समय में समान क्षेत्रफल को आच्छादित करता है। उपभू (पृथ्वी से निकटतम, लगभग 3,56,500 किमी) के निकट चन्द्रमा लगभग 15.4 अंश प्रतिदिन चलता है। अपभू (दूरस्थतम, लगभग 4,06,700 किमी) के निकट यह मात्र 11.8 अंश प्रतिदिन चलता है। इसी बीच सूर्य की दृश्य गति लगभग 0.9 से 1.0 अंश प्रतिदिन होती है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The net relative speed (Moon minus Sun) thus ranges from about 10.8 to 14.5 degrees per day. A tithi at maximum speed takes 12 / 14.5 = approximately 19.9 hours. A tithi at minimum speed takes 12 / 10.8 = approximately 26.7 hours. This is why no two consecutive tithis are identical in length, and why the Panchang must be computed fresh for every day and location rather than simply following a fixed schedule.', hi: 'अतः शुद्ध सापेक्ष गति (चन्द्र घटा सूर्य) लगभग 10.8 से 14.5 अंश प्रतिदिन तक होती है। अधिकतम गति पर एक तिथि 12 / 14.5 = लगभग 19.9 घण्टे लेती है। न्यूनतम गति पर 12 / 10.8 = लगभग 26.7 घण्टे। यही कारण है कि कोई भी दो क्रमागत तिथियाँ समान अवधि की नहीं होतीं, और पंचांग को निश्चित अनुसूची का पालन करने के बजाय प्रत्येक दिन और स्थान हेतु नये सिरे से गणना करना पड़ता है।', sa: 'अतः शुद्ध सापेक्ष गति (चन्द्र घटा सूर्य) लगभग 10.8 से 14.5 अंश प्रतिदिन तक होती है। अधिकतम गति पर एक तिथि 12 / 14.5 = लगभग 19.9 घण्टे लेती है। न्यूनतम गति पर 12 / 10.8 = लगभग 26.7 घण्टे। यही कारण है कि कोई भी दो क्रमागत तिथियाँ समान अवधि की नहीं होतीं, और पंचांग को निश्चित अनुसूची का पालन करने के बजाय प्रत्येक दिन और स्थान हेतु नये सिरे से गणना करना पड़ता है।' }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'सूर्योदय की तिथि' : 'Tithi at Sunrise'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The Hindu calendar day (divasa) is reckoned from one sunrise to the next. The tithi prevailing at the moment of local sunrise determines that day&apos;s official tithi. In the most common scenario, a tithi starts after one sunrise and ends before the next — that tithi is present at the first sunrise but not the second, and the day bears its name. When a tithi spans two sunrises (is present at both), we have a Vriddhi situation. When a tithi fits entirely between two sunrises (present at neither), we have a Kshaya situation.', hi: 'हिन्दू दिनांक (दिवस) एक सूर्योदय से अगले सूर्योदय तक गिना जाता है। स्थानीय सूर्योदय के क्षण जो तिथि चल रही हो वही उस दिन की अधिकृत तिथि होती है। सबसे सामान्य स्थिति में एक तिथि एक सूर्योदय के बाद आरम्भ होकर अगले से पहले समाप्त हो जाती है — वह तिथि पहले सूर्योदय पर उपस्थित होती है किन्तु दूसरे पर नहीं, और दिन उसके नाम पर होता है। जब कोई तिथि दो सूर्योदयों तक फैली हो (दोनों पर उपस्थित) तो वृद्धि की स्थिति होती है। जब कोई तिथि दो सूर्योदयों के बीच पूर्णतया समा जाए (किसी पर उपस्थित न हो) तो क्षय की स्थिति होती है।', sa: 'हिन्दू दिनांक (दिवस) एक सूर्योदय से अगले सूर्योदय तक गिना जाता है। स्थानीय सूर्योदय के क्षण जो तिथि चल रही हो वही उस दिन की अधिकृत तिथि होती है। सबसे सामान्य स्थिति में एक तिथि एक सूर्योदय के बाद आरम्भ होकर अगले से पहले समाप्त हो जाती है — वह तिथि पहले सूर्योदय पर उपस्थित होती है किन्तु दूसरे पर नहीं, और दिन उसके नाम पर होता है। जब कोई तिथि दो सूर्योदयों तक फैली हो (दोनों पर उपस्थित) तो वृद्धि की स्थिति होती है। जब कोई तिथि दो सूर्योदयों के बीच पूर्णतया समा जाए (किसी पर उपस्थित न हो) तो क्षय की स्थिति होती है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The rules for handling Kshaya and Vriddhi tithis are codified in Dharmashastra texts like the Nirnaya Sindhu (17th century) and Dharma Sindhu, which serve as authoritative guides for festival and ritual scheduling. Surya Siddhanta provides the mathematical foundation, while texts like Muhurta Chintamani elaborate on the practical implications for electional astrology. The sunrise-reckoning convention is universal across all Hindu Panchang traditions.', hi: 'क्षय और वृद्धि तिथियों के नियम धर्मशास्त्र ग्रन्थों जैसे निर्णय सिन्धु (17वीं शताब्दी) और धर्म सिन्धु में संहिताबद्ध हैं, जो त्योहारों और अनुष्ठानों के निर्धारण के लिए प्रामाणिक मार्गदर्शक हैं। सूर्य सिद्धान्त गणितीय आधार प्रदान करता है, जबकि मुहूर्त चिन्तामणि जैसे ग्रन्थ मुहूर्त ज्योतिष के लिए व्यावहारिक निहितार्थों का विस्तार करते हैं। सूर्योदय-आधारित गणना की परम्परा सभी हिन्दू पंचांग पद्धतियों में सार्वभौमिक है।', sa: 'क्षय और वृद्धि तिथियों के नियम धर्मशास्त्र ग्रन्थों जैसे निर्णय सिन्धु (17वीं शताब्दी) और धर्म सिन्धु में संहिताबद्ध हैं, जो त्योहारों और अनुष्ठानों के निर्धारण के लिए प्रामाणिक मार्गदर्शक हैं। सूर्य सिद्धान्त गणितीय आधार प्रदान करता है, जबकि मुहूर्त चिन्तामणि जैसे ग्रन्थ मुहूर्त ज्योतिष के लिए व्यावहारिक निहितार्थों का विस्तार करते हैं। सूर्योदय-आधारित गणना की परम्परा सभी हिन्दू पंचांग पद्धतियों में सार्वभौमिक है।' }, locale)}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'वृद्धि तिथि एवं पारण समय' : 'Vriddhi (Extra) Tithi & Parana Timing'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'A Vriddhi (also called Adhika or repeated) tithi occurs when the Moon moves so slowly that a single tithi spans three consecutive sunrises. For example, if Ekadashi begins before Sunrise A and ends after Sunrise C, then both Day A-to-B and Day B-to-C have Ekadashi at their respective sunrises. In the calendar, this appears as Ekadashi being listed on two consecutive days. The Nirnaya Sindhu provides detailed rules for which of the two days should be used for specific observances.', hi: 'वृद्धि (अधिक या दोहरी) तिथि तब होती है जब चन्द्रमा इतना मन्द चलता है कि एक तिथि तीन क्रमागत सूर्योदयों तक फैल जाती है। उदाहरणार्थ, यदि एकादशी सूर्योदय अ से पहले आरम्भ हो और सूर्योदय स के बाद समाप्त हो, तो दिवस अ-ब और दिवस ब-स दोनों के सूर्योदय पर एकादशी होगी। पंचांग में यह दो लगातार दिनों पर एकादशी के रूप में दिखता है। निर्णय सिन्धु विस्तृत नियम प्रदान करता है कि किन अनुष्ठानों हेतु किस दिन का प्रयोग करना चाहिए।', sa: 'वृद्धि (अधिक या दोहरी) तिथि तब होती है जब चन्द्रमा इतना मन्द चलता है कि एक तिथि तीन क्रमागत सूर्योदयों तक फैल जाती है। उदाहरणार्थ, यदि एकादशी सूर्योदय अ से पहले आरम्भ हो और सूर्योदय स के बाद समाप्त हो, तो दिवस अ-ब और दिवस ब-स दोनों के सूर्योदय पर एकादशी होगी। पंचांग में यह दो लगातार दिनों पर एकादशी के रूप में दिखता है। निर्णय सिन्धु विस्तृत नियम प्रदान करता है कि किन अनुष्ठानों हेतु किस दिन का प्रयोग करना चाहिए।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Parana refers to the act of breaking an Ekadashi fast. The timing is critical: one must break the fast after Ekadashi tithi has ended (i.e., Dwadashi has begun) but before Dwadashi tithi itself ends. If Dwadashi ends before one can eat, the fast must be broken before a specific cutoff time (typically one-fourth of the day after sunrise). Additionally, Parana must not be done during Hari Vasara — the first quarter of Dwadashi tithi — according to some traditions. These rules make Parana timing one of the most complex calculations in practical Panchang usage.', hi: 'पारण एकादशी उपवास तोड़ने की क्रिया है। इसका समय अत्यन्त महत्वपूर्ण है: उपवास एकादशी तिथि समाप्त होने के बाद (अर्थात् द्वादशी आरम्भ होने पर) किन्तु द्वादशी तिथि स्वयं समाप्त होने से पहले तोड़ना चाहिए। यदि द्वादशी भोजन से पहले ही समाप्त हो जाए तो उपवास एक विशिष्ट अन्तिम समय (सामान्यतः सूर्योदय के बाद दिन का एक-चौथाई) से पहले तोड़ना अनिवार्य है। इसके अतिरिक्त, कुछ परम्पराओं के अनुसार पारण हरि वासर — द्वादशी तिथि के प्रथम चतुर्थांश — में नहीं करना चाहिए। ये नियम पारण समय-निर्धारण को व्यावहारिक पंचांग उपयोग की सबसे जटिल गणनाओं में से एक बनाते हैं।', sa: 'पारण एकादशी उपवास तोड़ने की क्रिया है। इसका समय अत्यन्त महत्वपूर्ण है: उपवास एकादशी तिथि समाप्त होने के बाद (अर्थात् द्वादशी आरम्भ होने पर) किन्तु द्वादशी तिथि स्वयं समाप्त होने से पहले तोड़ना चाहिए। यदि द्वादशी भोजन से पहले ही समाप्त हो जाए तो उपवास एक विशिष्ट अन्तिम समय (सामान्यतः सूर्योदय के बाद दिन का एक-चौथाई) से पहले तोड़ना अनिवार्य है। इसके अतिरिक्त, कुछ परम्पराओं के अनुसार पारण हरि वासर — द्वादशी तिथि के प्रथम चतुर्थांश — में नहीं करना चाहिए। ये नियम पारण समय-निर्धारण को व्यावहारिक पंचांग उपयोग की सबसे जटिल गणनाओं में से एक बनाते हैं।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">वृद्धि उदाहरण:</span> मान लें सप्तमी तिथि सोमवार प्रातः 4:30 (सूर्योदय 6:15 से पहले) आरम्भ होकर बुधवार प्रातः 7:45 पर समाप्त होती है। सप्तमी सोमवार और मंगलवार दोनों के सूर्योदय पर उपस्थित है। सोमवार प्रथम सप्तमी और मंगलवार वृद्धि (दोहरी) सप्तमी है। सप्तमी से जुड़े अधिकांश त्योहारों हेतु प्रथम दिन (सोमवार) प्रयुक्त होता है।</> : <><span className="text-gold-light font-medium">Vriddhi Example:</span> Suppose Saptami tithi begins at 4:30 AM (before sunrise at 6:15 AM) on Monday and ends at 7:45 AM on Wednesday. Saptami is present at sunrise on both Monday and Tuesday. Monday is the first Saptami day and Tuesday is the Vriddhi (repeated) Saptami day. For most festivals tied to Saptami, the first day (Monday) is used.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">पारण उदाहरण:</span> एकादशी तिथि बुधवार प्रातः 9:42 पर समाप्त होती है। द्वादशी तिथि बुधवार 9:42 से गुरुवार 11:15 तक चलती है। बुधवार सूर्योदय 6:10 है। पारण का समय 9:42 (जब द्वादशी आरम्भ हो) पर खुलता है और भक्त को 9:42 से गुरुवार 11:15 के बीच उपवास तोड़ना चाहिए — आदर्श रूप से बुधवार प्रातः 9:42 के तुरन्त बाद।</> : <><span className="text-gold-light font-medium">Parana Example:</span> Ekadashi tithi ends at 9:42 AM on Wednesday. Dwadashi tithi runs from 9:42 AM Wednesday to 11:15 AM Thursday. Sunrise Wednesday is 6:10 AM. The Parana window opens at 9:42 AM (when Dwadashi begins) and the devotee should break the fast between 9:42 AM and 11:15 AM Thursday — ideally on Wednesday morning itself after 9:42 AM.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> "पारण एकादशी के अगले दिन सुबह कभी भी किया जा सकता है।" यह गलत है और एकादशी तिथि चलते हुए (यदि एकादशी देर सुबह समाप्त हो) उपवास तोड़ सकता है। सदैव एकादशी समाप्ति का सटीक समय देखें। यदि यह प्रातः 10:30 पर समाप्त होती है तो 7:00 बजे भोजन करना एकादशी के दौरान ही उपवास तोड़ना होगा, जिससे व्रत का पुण्य नष्ट हो जाएगा।</> : <><span className="text-gold-light font-medium">Misconception:</span> "Parana can be done any time the next morning after Ekadashi." This is incorrect and can lead to breaking the fast while Ekadashi tithi is still running (if Ekadashi ends late morning). Always check the exact Ekadashi end time. If it ends at 10:30 AM, eating at 7 AM would break the fast during Ekadashi itself, losing the vrat&apos;s merit.</>}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'कार्यान्वित गणना: भोगांश से तिथि निकालना' : 'Worked Calculation: Computing Tithi from Longitudes'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Let us work through a complete tithi calculation step by step. At sunrise on a given day, our astronomical engine reports: Moon&apos;s true longitude = 167 degrees, Sun&apos;s true longitude = 348 degrees. Step 1: Compute elongation. Elongation = Moon - Sun = 167 - 348 = -181 degrees. Since this is negative, add 360: -181 + 360 = 179 degrees. Step 2: Compute tithi number. Tithi = floor(179 / 12) + 1 = floor(14.9167) + 1 = 14 + 1 = 15. Tithi 15 in Shukla Paksha is Purnima. The Moon is nearly opposite the Sun — consistent with a full Moon.', hi: 'आइए एक पूर्ण तिथि गणना चरणबद्ध रूप से करें। किसी दिन सूर्योदय पर हमारा खगोलीय इंजन बताता है: चन्द्रमा का स्पष्ट भोगांश = 167 अंश, सूर्य का स्पष्ट भोगांश = 348 अंश। चरण 1: कोणीय दूरी निकालें। कोणीय दूरी = चन्द्र - सूर्य = 167 - 348 = -181 अंश। चूँकि यह ऋणात्मक है, 360 जोड़ें: -181 + 360 = 179 अंश। चरण 2: तिथि संख्या निकालें। तिथि = floor(179 / 12) + 1 = floor(14.9167) + 1 = 14 + 1 = 15। शुक्ल पक्ष में 15वीं तिथि पूर्णिमा है। चन्द्रमा सूर्य के लगभग विपरीत है — पूर्ण चन्द्र के अनुरूप।', sa: 'आइए एक पूर्ण तिथि गणना चरणबद्ध रूप से करें। किसी दिन सूर्योदय पर हमारा खगोलीय इंजन बताता है: चन्द्रमा का स्पष्ट भोगांश = 167 अंश, सूर्य का स्पष्ट भोगांश = 348 अंश। चरण 1: कोणीय दूरी निकालें। कोणीय दूरी = चन्द्र - सूर्य = 167 - 348 = -181 अंश। चूँकि यह ऋणात्मक है, 360 जोड़ें: -181 + 360 = 179 अंश। चरण 2: तिथि संख्या निकालें। तिथि = floor(179 / 12) + 1 = floor(14.9167) + 1 = 14 + 1 = 15। शुक्ल पक्ष में 15वीं तिथि पूर्णिमा है। चन्द्रमा सूर्य के लगभग विपरीत है — पूर्ण चन्द्र के अनुरूप।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Step 3: When does Purnima end? Purnima spans 168 to 180 degrees. The current elongation is 179 degrees — very close to 180. We need to find the exact moment when elongation = 180 degrees. Using binary search: check the elongation at successive half-intervals. If at 2 hours later elongation = 181.5 degrees, the crossing happened between now and then. Bisect again: at 1 hour, elongation = 180.3 degrees — still past. At 30 minutes: 179.6 degrees — not yet. Continue bisecting until precision reaches one minute. Suppose the answer is 47 minutes from sunrise. Then Purnima ends at sunrise + 47 minutes.', hi: 'चरण 3: पूर्णिमा कब समाप्त होती है? पूर्णिमा 168 से 180 अंश तक फैली है। वर्तमान कोणीय दूरी 179 अंश है — 180 के बहुत निकट। हमें ठीक वह क्षण ज्ञात करना है जब कोणीय दूरी = 180 अंश हो। द्विभाजन खोज से: क्रमिक अर्ध-अन्तरालों पर कोणीय दूरी जाँचें। यदि 2 घण्टे बाद कोणीय दूरी = 181.5 अंश, तो सीमा-पार अभी और तब के बीच हुआ। पुनः द्विभाजन: 1 घण्टे पर कोणीय दूरी = 180.3 अंश — अभी भी पार। 30 मिनट पर: 179.6 अंश — अभी नहीं। द्विभाजन जारी रखें जब तक सटीकता एक मिनट न हो जाए। मान लें उत्तर सूर्योदय से 47 मिनट है। तब पूर्णिमा सूर्योदय + 47 मिनट पर समाप्त होती है।', sa: 'चरण 3: पूर्णिमा कब समाप्त होती है? पूर्णिमा 168 से 180 अंश तक फैली है। वर्तमान कोणीय दूरी 179 अंश है — 180 के बहुत निकट। हमें ठीक वह क्षण ज्ञात करना है जब कोणीय दूरी = 180 अंश हो। द्विभाजन खोज से: क्रमिक अर्ध-अन्तरालों पर कोणीय दूरी जाँचें। यदि 2 घण्टे बाद कोणीय दूरी = 181.5 अंश, तो सीमा-पार अभी और तब के बीच हुआ। पुनः द्विभाजन: 1 घण्टे पर कोणीय दूरी = 180.3 अंश — अभी भी पार। 30 मिनट पर: 179.6 अंश — अभी नहीं। द्विभाजन जारी रखें जब तक सटीकता एक मिनट न हो जाए। मान लें उत्तर सूर्योदय से 47 मिनट है। तब पूर्णिमा सूर्योदय + 47 मिनट पर समाप्त होती है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Examples', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">क्षय उदाहरण:</span> मान लें नवमी मंगलवार प्रातः 8:15 (सूर्योदय 6:20 के बाद) आरम्भ होती है और चन्द्रमा उपभू के निकट 15.2 अंश/दिन चल रहा है। शुद्ध सापेक्ष गति = 15.2 - 1.0 = 14.2 अंश/दिन। तिथि अवधि = 12 / 14.2 = 20.3 घण्टे। नवमी 8:15 + 20.3 घण्टे = बुधवार प्रातः 4:33 (सूर्योदय 6:20 से पहले) समाप्त। परिणाम: नवमी किसी सूर्योदय पर उपस्थित नहीं। यह क्षय तिथि है। मंगलवार को सूर्योदय पर अष्टमी और बुधवार को दशमी — नवमी पंचांग से छूट गई।</> : <><span className="text-gold-light font-medium">Kshaya Example:</span> Suppose Navami begins at 8:15 AM Tuesday (after sunrise at 6:20 AM) and the Moon is near perigee, moving at 15.2 degrees/day. Net relative speed = 15.2 - 1.0 = 14.2 degrees/day. Tithi duration = 12 / 14.2 = 20.3 hours. Navami ends at 8:15 AM + 20.3 hours = 4:33 AM Wednesday (before sunrise at 6:20 AM). Result: Navami is not present at any sunrise. It is a Kshaya tithi. Tuesday has Ashtami at sunrise, and Wednesday has Dashami at sunrise — Navami is skipped in the calendar.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> "तिथि समाप्ति समय 12 अंश को चन्द्रमा की औसत गति से भाग देकर निकाला जा सकता है।" यह एक सन्निकटन तो देता है किन्तु एक घण्टे से अधिक की त्रुटि हो सकती है क्योंकि चन्द्रमा की गति दिनभर निरन्तर बदलती रहती है। द्विभाजन खोज विधि प्रत्येक चरण पर चन्द्र और सूर्य की स्थिति पुनः गणना करती है, वास्तविक-समय गति परिवर्तन को पकड़ती है, यही कारण है कि आधुनिक पंचांग सॉफ्टवेयर मिनट-स्तर की सटीकता प्राप्त करता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> "You can compute tithi end time by simply dividing 12 degrees by the average Moon speed." While this gives an approximation, it can be off by over an hour because the Moon&apos;s speed changes continuously throughout the day. The binary search method recomputes Moon and Sun positions at each iteration, capturing the real-time speed variation, which is why modern Panchang software achieves minute-level accuracy.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Our Panchang engine implements precisely this binary search approach in the tithi-table module. For each day, it computes Moon and Sun longitudes at sunrise using Meeus algorithms, derives the elongation, identifies the tithi, then uses iterative bisection to find the exact start and end times to within one minute. Kshaya and Vriddhi tithis are automatically detected and flagged. The Parana window for Ekadashi fasts is computed by finding the exact Dwadashi start and end times, then intersecting with the sunrise-to-sunset window.', hi: 'हमारा पंचांग इंजन तिथि-तालिका मॉड्यूल में ठीक यही द्विभाजन खोज विधि लागू करता है। प्रत्येक दिन के लिए यह मीयस एल्गोरिदम से सूर्योदय पर चन्द्र और सूर्य भोगांश गणना करता है, कोणीय दूरी निकालता है, तिथि पहचानता है, फिर पुनरावर्ती द्विभाजन से एक मिनट के भीतर सटीक आरम्भ और समाप्ति समय ज्ञात करता है। क्षय और वृद्धि तिथियाँ स्वचालित रूप से पहचानी और चिह्नित की जाती हैं। एकादशी व्रत हेतु पारण समय द्वादशी के सटीक आरम्भ और समाप्ति समय ज्ञात कर सूर्योदय-सूर्यास्त खिड़की से प्रतिच्छेदन द्वारा निकाला जाता है।', sa: 'हमारा पंचांग इंजन तिथि-तालिका मॉड्यूल में ठीक यही द्विभाजन खोज विधि लागू करता है। प्रत्येक दिन के लिए यह मीयस एल्गोरिदम से सूर्योदय पर चन्द्र और सूर्य भोगांश गणना करता है, कोणीय दूरी निकालता है, तिथि पहचानता है, फिर पुनरावर्ती द्विभाजन से एक मिनट के भीतर सटीक आरम्भ और समाप्ति समय ज्ञात करता है। क्षय और वृद्धि तिथियाँ स्वचालित रूप से पहचानी और चिह्नित की जाती हैं। एकादशी व्रत हेतु पारण समय द्वादशी के सटीक आरम्भ और समाप्ति समय ज्ञात कर सूर्योदय-सूर्यास्त खिड़की से प्रतिच्छेदन द्वारा निकाला जाता है।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module5_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

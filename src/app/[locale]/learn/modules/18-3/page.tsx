'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/18-3.json';

const META: ModuleMeta = {
  id: 'mod_18_3', phase: 5, topic: 'Strength', moduleNumber: '18.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
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
          {tl({ en: 'What is Ashtakavarga?', hi: 'अष्टकवर्ग क्या है?', sa: 'अष्टकवर्गः किम् अस्ति?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अष्टकवर्ग एक अद्वितीय वैदिक पद्धति है जो प्रत्येक ग्रह के लिए सभी 12 राशियों में शुभ प्रभाव का संख्यात्मक मानचित्र बनाती है। शब्द का अर्थ है &ldquo;आठ विभाजन&rdquo; &mdash; 8 स्रोतों (7 ग्रह और लग्न) को सन्दर्भित करते हुए जो 12 राशियों में &ldquo;बिन्दु&rdquo; (शुभ अंक, 0 या 1) योगदान करते हैं। प्रत्येक ग्रह के लिए यह 12-राशि तालिका बनाता है जो दिखाती है कि ग्रह का गोचर कहाँ समर्थित और कहाँ चुनौतीपूर्ण होगा।</>
            : <>Ashtakavarga is a unique Vedic system that creates a numerical map of benefic influence across all 12 signs for each planet. The word means &ldquo;eight divisions&rdquo; &mdash; referring to the 8 sources (7 planets plus the Lagna) that contribute &ldquo;bindus&rdquo; (beneficial points, either 0 or 1) to each of the 12 signs. For every planet, this creates a 12-sign table showing where that planet&apos;s transit will be supported and where it will be challenged.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भिन्न अष्टकवर्ग (BAV)</strong> व्यक्तिगत ग्रह की तालिका है &mdash; 7 ग्रहों में से प्रत्येक का अपना BAV है जिसमें प्रति राशि 0-8 अंक। <strong>सर्वाष्टकवर्ग (SAV)</strong> सभी 7 BAV तालिकाओं का संयुक्त कुल है, प्रति राशि 0-56 अंक देता है। BAV किसी विशिष्ट ग्रह के गोचर गुणवत्ता के बारे में बताता है; SAV कुण्डली में किसी राशि की समग्र शक्ति बताता है।</>
            : <><strong>Bhinna Ashtakavarga (BAV)</strong> is the individual planet&apos;s table &mdash; each of the 7 planets has its own BAV with scores 0-8 per sign. <strong>Sarvashtakavarga (SAV)</strong> is the combined total of all 7 BAV tables, giving a score of 0-56 per sign. BAV tells you about a specific planet&apos;s transit quality; SAV tells you about the overall strength of a sign in the chart.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उद्गम', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>अष्टकवर्ग का विस्तृत वर्णन बृहत् पाराशर होरा शास्त्र (अध्याय 66-72) में है और वराहमिहिर की बृहत् जातक में इसे और विस्तृत किया गया। यह पद्धति कम्प्यूटर-युग के एल्गोरिदम से दो सहस्राब्दी से अधिक पुरानी है, फिर भी ग्रह प्रभाव अंकन के प्रति इसका मैट्रिक्स-आधारित दृष्टिकोण आधुनिक गणनात्मक विधियों की पूर्वकल्पना करता है।</>
            : <>Ashtakavarga is described in detail in Brihat Parashara Hora Shastra (chapters 66-72) and further elaborated in Varahamihira&apos;s Brihat Jataka. The system predates computer-era algorithms by over two millennia, yet its matrix-based approach to scoring planetary influence anticipates modern computational methods. Parashara prescribed specific rules for which positions (counted from each source) generate a bindu &mdash; these rules encode empirical observations about when planets in certain relative positions produce beneficial effects.</>}
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
          {tl({ en: 'Reading BAV and SAV Tables', hi: 'BAV और SAV तालिकाएँ पढ़ना', sa: 'BAV SAV तालिकयोः पठनम्' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>BAV व्याख्या:</strong> जब ग्रह उस राशि में गोचर करता है जहाँ उसके अपने BAV में 4 या अधिक बिन्दु हैं, परिणाम सामान्यतः अनुकूल होते हैं। 4 से कम बिन्दुओं पर उस राशि से गोचर चुनौतीपूर्ण होता है। उदाहरण: यदि शनि के BAV में मिथुन में 6 और वृषभ में 2 बिन्दु हैं, तो मिथुन से गोचर उत्पादक और वृषभ से कठिन होगा।</>
            : <><strong>BAV interpretation:</strong> When a planet transits a sign where it has 4 or more bindus in its own BAV, results are generally favorable. Below 4 bindus, the transit through that sign tends to be challenging. For example, if Saturn&apos;s BAV shows 6 bindus in Gemini and 2 in Taurus, Saturn&apos;s transit through Gemini will be productive while its transit through Taurus will be difficult.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><strong>SAV व्याख्या:</strong> 28+ कुल SAV बिन्दु वाली राशियाँ बलवान स्थान हैं &mdash; उनमें गोचर करने वाला कोई भी ग्रह सामान्यतः सहायक वातावरण से लाभान्वित होता है। 28 से कम कुण्डली में अपेक्षाकृत दुर्बल राशि इंगित करता है। SAV एक अवलोकन देता है कि राशिचक्र के कौन-से भाग जातक के लिए शक्तिशाली हैं।</>
            : <><strong>SAV interpretation:</strong> Signs with 28+ total SAV points are strong locations &mdash; any planet transiting them benefits from a generally supportive environment. Below 28 indicates a relatively weak sign in the chart. The SAV gives an overview of which parts of the zodiac are powerful for the native.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example: Saturn&apos;s BAV', hi: 'कार्यरत उदाहरण: शनि का BAV', sa: 'कार्यरत उदाहरण: शनि का BAV' }, locale)}</h4>
        <ExampleChart
          ascendant={4}
          planets={{ 7: [6], 1: [0, 3], 4: [1], 9: [4], 11: [5] }}
          title={tl({ en: 'Cancer Lagna — Saturn in Capricorn (7th) — BAV Analysis', hi: 'कर्क लग्न — शनि मकर (7वें) में — BAV विश्लेषण', sa: 'कर्कलग्नम् — मकरे शनिः (सप्तमे) — BAV विश्लेषणम्' }, locale)}
          highlight={[7]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Saturn&apos;s Bhinna Ashtakavarga for a sample chart:</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Aries: 3 | Taurus: 2 | Gemini: 6 | Cancer: 4 | Leo: 3 | Virgo: 5</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">Libra: 4 | Scorpio: 2 | Sagittarius: 5 | Capricorn: 3 | Aquarius: 4 | Pisces: 3</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light">व्याख्या:</span> शनि मिथुन गोचर (6 बिन्दु) = अत्यन्त उत्पादक 2.5 वर्ष। करियर प्रगति, अनुशासन का फल। शनि वृषभ गोचर (2 बिन्दु) = विलम्ब, स्वास्थ्य चिन्ता, करियर बाधाओं सहित कठिन अवधि। शनि कर्क, तुला, कुम्भ (4-4 बिन्दु) = तटस्थ, प्रबन्धनीय अवधि।</>
            : <><span className="text-gold-light font-medium">Interpretation:</span> Saturn transiting Gemini (6 bindus) = highly productive 2.5-year period. Career progress, discipline paying off. Saturn transiting Taurus (2 bindus) = difficult period with delays, health concerns, career obstacles. Saturn in Cancer, Libra, Aquarius (4 bindus each) = neutral, manageable periods.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रम', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>कई छात्र BAV और SAV को भ्रमित करते हैं और परस्पर विनिमय से प्रयोग करते हैं। BAV ग्रह-विशिष्ट है &mdash; यह एक ग्रह के गोचर गुणवत्ता के बारे में बताता है। SAV समग्र है और एक राशि की समग्र शुभ शक्ति बताता है। एक अन्य सामान्य त्रुटि त्रिकोण शोधन और एकाधिपति शोधन (न्यूनीकरण तकनीकें) की उपेक्षा करना है। कच्चा BAV/SAV प्रथम अनुमान देता है, पर शोधन प्रक्रिया सूक्ष्म प्रतिरूप दर्शाती है।</>
            : <>Many students confuse BAV with SAV and use them interchangeably. BAV is planet-specific &mdash; it tells you about ONE planet&apos;s transit quality. SAV is the aggregate and tells you about the overall benefic strength of a SIGN. Another common error is ignoring Trikona Shodhana and Ekadhipati Shodhana (reduction techniques). Raw BAV/SAV gives a first approximation, but the shodhana (purification) process reveals subtler patterns &mdash; much like how raw data needs statistical refinement.</>}
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
          {tl({ en: 'Transit Prediction with Ashtakavarga', hi: 'अष्टकवर्ग से गोचर भविष्यवाणी', sa: 'अष्टकवर्गेण गोचरभविष्यवाणी' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अष्टकवर्ग की वास्तविक शक्ति गोचर विश्लेषण में प्रकट होती है। जब शनि प्रत्येक 2.5 वर्ष में नई राशि में जाता है, उस राशि का BAV अंक तुरन्त बताता है कि अवधि उत्पादक होगी या कष्टकारी। शनि मिथुन में 6 बिन्दु = अनुशासित विकास और ठोस उपलब्धियों की अवधि। शनि वृषभ में 2 बिन्दु = विलम्ब, निराशा, स्वास्थ्य समस्याएँ और करियर बाधाएँ जो धैर्य की माँग करती हैं।</>
            : <>The real power of Ashtakavarga emerges in transit analysis. When Saturn moves into a new sign every 2.5 years, the BAV score for that sign immediately tells you whether the period will be productive or painful. Saturn in Gemini with 6 bindus = a period of disciplined growth and tangible achievements. Saturn in Taurus with 2 bindus = delays, frustrations, health issues, and career obstacles that demand patience.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>कक्षा पद्धति</strong> इसे और आगे ले जाती है। प्रत्येक 30-अंश राशि 3.75 अंश की 8 उप-खण्डों (कक्षाओं) में विभाजित होती है, शासित: सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि और लग्न (इसी क्रम में)। जैसे ग्रह धीरे-धीरे राशि से गोचर करता है, वह प्रत्येक कक्षा से गुजरता है। जब वह उस स्रोत की कक्षा में प्रवेश करता है जिसने बिन्दु दिया, वह उप-अवधि अनुकूल है। जब 0 देने वाले स्रोत की कक्षा में प्रवेश करता है, वह उप-अवधि चुनौतीपूर्ण है। यह 2.5-वर्षीय शनि गोचर में विशिष्ट महीनों को इंगित करता है।</>
            : <>The <strong>Kaksha system</strong> takes this further. Each 30-degree sign is divided into 8 sub-sections (Kakshas) of 3.75 degrees each, ruled by: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and Lagna (in that order). As a planet slowly transits a sign, it passes through each Kaksha. When it enters the Kaksha of a source that contributed a bindu, that sub-period is favorable. When it enters a Kaksha whose source gave 0, that sub-period is challenging. This pinpoints specific months within a 2.5-year Saturn transit.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>अष्टकवर्ग का पुनर्जागरण ठीक इसलिए हो रहा है क्योंकि यह अन्तर्निहित रूप से गणनात्मक है। बिन्दु तालिकाएँ मूलतः 12 (राशि) गुणा 8 (स्रोत) आकार के 7 मैट्रिक्स हैं, गणना में अत्यन्त तीव्र। हमारा कुण्डली इंजन पूर्ण BAV और SAV तालिकाएँ मिलीसेकण्ड में उत्पन्न करता है। यह गोचर भविष्यवाणियों को विशिष्ट और सत्यापन-योग्य बनाता है। अष्टकवर्ग बिन्दुओं को विंशोत्तरी दशा अवधियों के साथ संयोजित करने से ज्योतिष में सबसे सटीक समय ढाँचा प्राप्त होता है: दशा बताती है क्या; अष्टकवर्ग बताता है कहाँ; मिलकर वे बताते हैं कब।</>
            : <>Ashtakavarga is experiencing a renaissance precisely because it is inherently computational. The bindu tables are essentially 7 matrices of size 12 (signs) by 8 (sources), trivially fast to compute. Our Kundali engine generates complete BAV and SAV tables in milliseconds. This makes transit predictions specific and falsifiable &mdash; &ldquo;Saturn&apos;s transit through Gemini (6 bindus) will be better than its transit through Taurus (2 bindus)&rdquo; is a concrete, verifiable claim. Combining Ashtakavarga bindus with Vimshottari Dasha periods produces the most accurate timing framework in Jyotish: dasha tells you WHAT; Ashtakavarga tells you WHERE; together they tell you WHEN.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module18_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

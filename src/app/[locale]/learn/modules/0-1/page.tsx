'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-1.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_0_1',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 10,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

// ─── Content Pages ──────────────────────────────────────────────────────────

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={
          isHi
            ? [
                'ज्योतिष का अर्थ है "प्रकाश का विज्ञान"  –  यह अवलोकन खगोल विज्ञान है जो जीवन मार्गदर्शन से जुड़ा है, भाग्य-कथन नहीं',
                'वैदिक ज्योतिष नक्षत्र-आधारित राशिचक्र (सायन) का उपयोग करता है, जबकि पश्चिमी ज्योतिष ऋतु-आधारित (निरयन)  –  दोनों में ~24° का अन्तर है',
              ]
            : [
                'Jyotish means "science of light"  –  it is observational astronomy intertwined with life guidance, not fortune-telling',
                'Vedic astrology uses the sidereal zodiac (actual star positions), while Western uses the tropical zodiac (seasons)  –  they differ by ~24\u00B0',
              ]
        }
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theScienceOfLight', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theWordJyotishComesFrom', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('jyotishHasThreeBranchesAnd', locale)}
        </p>
        <BeginnerNote term="Jyotish" explanation="Literally 'science of light'  –  the Vedic system of astronomy and astrology, one of the six Vedangas (limbs of the Vedas)." />
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-bold">{t('siddhanta', locale)}</span>{' '}
            {t('mathematicalAstronomyPlanetaryPositionsEclipses', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('hora', locale)}</span>{' '}
            {t('birthChartInterpretationThisIs', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('samhita', locale)}</span>{' '}
            {t('mundaneAstrologyWeatherAgricultureNational', locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {t('thinkOfItThisWay', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('hereSAMindBlowing', locale)}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <BeginnerNote term="Sidereal zodiac" explanation="A zodiac anchored to actual star positions, as opposed to the tropical zodiac which is tied to the seasons." />
          <BeginnerNote term="Vedanga" explanation="One of six auxiliary disciplines attached to the Vedas  –  Jyotish is the 'eye' of the Vedas." />
        </div>
        <WhyItMatters locale={locale}>Jyotish is not fortune-telling  –  it is a mathematical framework built on real astronomy. Understanding this distinction is the foundation for everything that follows.</WhyItMatters>
      </section>

      {/* Classical Origin  –  Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {t('classicalOrigin', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('indianAstronomicalAchievementsAreStaggering', locale)}
        </p>
        <ul className="text-text-secondary text-sm space-y-3 ml-2">
          <li>
            <span className="text-gold-light font-bold">{t('aryabhata476Ce', locale)}</span>{' '}
            {t('calculatedEarthSCircumferenceAs', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('trigonometrySSine', locale)}</span>{' '}
            {t('theWordSineComesFrom', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('varahamihira505Ce', locale)}</span>{' '}
            {t('wrotePanchaSiddhantikaComparing5', locale)}
          </li>
          <li>
            <span className="text-gold-light font-bold">{t('brahmagupta628Ce', locale)}</span>{' '}
            {t('gaveTheFirstRulesFor', locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-4">
          {t('aryabhataDidnTJustCalculate', locale)}
        </p>
      </section>

      <QuickCheck
        question="Which zodiac system does Vedic astrology use?"
        options={['Tropical (seasons)', 'Sidereal (stars)', 'Both equally', 'Neither']}
        correctIndex={1}
        explanation="Sidereal means star-based  –  Vedic astrology tracks actual star positions, unlike Western astrology which tracks seasons."
      />
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
          {t('jyotishVsWesternAstrology', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('whenSomeoneInTheWest', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('westernAstrologyUsesTheTropical', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('butTheDifferencesGoFar', locale)}
        </p>

        {/* Comparison table */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary text-xs py-2 pr-3">{t('aspect', locale)}</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">{t('vedicJyotish', locale)}</th>
                <th className="text-left text-blue-300 text-xs py-2">{t('western', locale)}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('zodiac', locale)}</td>
                <td className="py-2 pr-3">{t('siderealStarFixed', locale)}</td>
                <td className="py-2">{t('tropicalSeasonFixed', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('primaryLuminary', locale)}</td>
                <td className="py-2 pr-3">{t('moonMind', locale)}</td>
                <td className="py-2">{t('sunEgo', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('divergence', locale)}</td>
                <td className="py-2 pr-3" colSpan={2}>{t('about24DegreesTodayYour', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('nakshatras', locale)}</td>
                <td className="py-2 pr-3">{t('k27LunarMansions', locale)}</td>
                <td className="py-2">{t('noEquivalent', locale)}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3 text-text-tertiary">{t('timingSystem', locale)}</td>
                <td className="py-2 pr-3">{t('dashaWhenEventsHappen', locale)}</td>
                <td className="py-2">{t('transitsOnly', locale)}</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-text-tertiary">{t('muhurta', locale)}</td>
                <td className="py-2 pr-3">{t('auspiciousTimeSelectionElaborate', locale)}</td>
                <td className="py-2">{t('noEquivalent', locale)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {t('hereSThePracticalDifference', locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {t('theKeralaSchoolOfMathematics', locale)}
        </p>
      </section>

      {/* Emerald fact card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('astonishingFacts', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>
            <span className="text-emerald-300 font-bold">{t('suryaSiddhantaC400Ce', locale)}</span>{' '}
            {t('calculatedTheSiderealYearAs', locale)}
          </p>
          <p>
            <span className="text-emerald-300 font-bold">{t('jantarMantarObservatories', locale)}</span>{' '}
            {t('maharajaJaiSinghIiBuilt', locale)}
          </p>
        </div>
      </section>

      <QuickCheck
        question="How many 'wandering stars' (grahas) did ancient Indian astronomers identify?"
        options={['5', '7', '9', '12']}
        correctIndex={2}
        explanation="9 grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, plus Rahu and Ketu (the lunar nodes)."
      />
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
          {t('whatThisCourseWillTeach', locale)}
        </h3>
        <ul className="text-text-secondary text-sm space-y-2 ml-4">
          <li>
            <span className="text-gold-light font-medium">{t('readingADailyPanchang', locale)}</span>{' '}
             –  {t('yourCosmicWeatherReportFor', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('understandingABirthChart', locale)}</span>{' '}
             –  {t('yourCosmicDna', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('theMathematicsBehindTheCalculations', locale)}</span>{' '}
             –  {t('realAlgorithmsNotMysticism', locale)}
          </li>
          <li>
            <span className="text-gold-light font-medium">{t('culturalContext', locale)}</span>{' '}
             –  {t('forHinduRitualsAndFestivals', locale)}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">
          <span className="text-red-300 font-bold">{t('whatThisCourseWillNot', locale)}</span>{' '}
          {t('deterministicFatePredictionReplacementFor', locale)}
        </p>
      </section>

      {/* Red  –  Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('commonMisconceptions', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('jyotishIsJustSuperstition', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theAstronomicalCalculationsAreScience', locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('jyotishWasCopiedFromGreek', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theRigvedaC1500Bce', locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('jyotishAndWesternAstrologyAre', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('theyUseDifferentZodiacsDifferent', locale)}
          </p>
          <p className="mt-3">
            <span className="text-red-300 font-bold">{t('misconception', locale)}</span>{' '}
            {t('theCalculationsAreUnscientific', locale)}
            <br />
            <span className="text-emerald-300">{t('reality', locale)}</span>{' '}
            {t('hereSATestOur', locale)}
          </p>
        </div>
      </section>

      {/* Blue  –  Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('modernRelevance', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {t('theMathematicsOfJyotishIs', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {t('billionsOfHindusWorldwideUse', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {t('the2017NobelPrizeIn', locale)}
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
      <KeyTakeaway
        points={
          isHi
            ? [
                'ज्योतिष दो स्तम्भों पर खड़ा है: सिद्धान्तिक ज्योतिष (गणितीय खगोल विज्ञान) और फलित ज्योतिष (व्याख्यात्मक ज्योतिष)',
                'ज्योतिष एक वेदाङ्ग है  –  वेद का नेत्र  –  जो चेतना, काल और अस्तित्व की प्रकृति को समझने का साधन है',
                'पञ्चाङ्ग के पाँच अंग कोई रहस्यमय संख्या नहीं  –  यह सूर्य, चन्द्र और ब्रह्माण्ड के बीच ठीक पाँच स्वतन्त्र अवलोकनीय सम्बन्ध हैं',
              ]
            : [
                'Jyotish stands on two pillars: Siddhantic Jyotish (mathematical astronomy) and Phalit Jyotish (interpretive astrology)',
                'Jyotish is a Vedanga  –  the eye of the Veda  –  a tool for understanding consciousness, time, and existence',
                'The five limbs of Panchang are not a mystical number  –  they are exactly five independent observable relationships between Sun, Moon, and cosmos',
              ]
        }
        locale={locale}
      />

      {/* Section A: The Two Pillars */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दो स्तम्भ' : 'The Two Pillars'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'ज्योतिष दो स्तम्भों पर खड़ा है। पहला है सिद्धान्तिक ज्योतिष  –  शुद्ध गणितीय खगोल विज्ञान। सूर्य सिद्धान्त, आर्यभटीय और पञ्च सिद्धान्तिका खगोलीय ग्रन्थ हैं जो ग्रहों की स्थिति की गणना करते हैं, ग्रहणों की भविष्यवाणी करते हैं, और विषुवों की अयन गति मापते हैं। ये रहस्यवादी ग्रन्थ नहीं हैं  –  ये गणित की पुस्तकें हैं।'
            : 'Jyotish stands on two pillars. The first is Siddhantic Jyotish  –  pure mathematical astronomy. The Surya Siddhanta, Aryabhatiya, and Pancha Siddhantika are astronomical treatises that compute planetary positions, predict eclipses, and measure the precession of equinoxes. These are not mystical texts  –  they are mathematics textbooks.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'जब हम कहते हैं कि सूर्य सिद्धान्त ने शनि की कक्षा अवधि 29.4 वर्ष गणित की (NASA कहता है 29.46), तो वह सिद्धान्तिक ज्योतिष है। जब आर्यभट ने प्रस्तावित किया कि पृथ्वी अपनी धुरी पर घूमती है  –  कॉपरनिकस से एक सहस्राब्दी पहले  –  वह सिद्धान्तिक ज्योतिष है। यह परत अनुभवजन्य रूप से परीक्षण योग्य है, और यह परीक्षा उत्तीर्ण करती है।'
            : 'When we say the Surya Siddhanta calculated Saturn\'s orbital period as 29.4 years (NASA says 29.46), that is Siddhantic Jyotish. When Aryabhata proposed that the Earth rotates on its axis  –  a millennium before Copernicus  –  that is Siddhantic Jyotish. This layer is empirically testable, and it passes the test.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'दूसरा स्तम्भ है फलित ज्योतिष  –  भविष्यकथन और व्याख्यात्मक ज्योतिष। यहाँ ग्रहों की स्थिति को भावों, दशाओं, योगों और गोचर के माध्यम से मानव जीवन से जोड़ा जाता है। फलित ज्योतिष गणितीय आधार पर निर्मित एक भव्य स्मारक है। खगोल विज्ञान के बिना, यह निराधार अटकलबाज़ी होती। इसके साथ, यह ब्रह्माण्डीय चक्रों और मानव अनुभव के बीच सम्बन्ध को समझने का एक व्यवस्थित ढाँचा है।'
            : 'The second pillar is Phalit Jyotish  –  predictive and interpretive astrology. This is where planetary positions are mapped to human life through houses, dashas, yogas, and transits. Phalit Jyotish is the grand monument built on the mathematical foundation. Without the astronomy, it would be baseless speculation. With it, it is a systematic framework for understanding the relationship between cosmic cycles and human experience.'}
        </p>
        <BeginnerNote term={isHi ? 'सिद्धान्तिक ज्योतिष' : 'Siddhantic Jyotish'} explanation={isHi ? 'शुद्ध गणितीय खगोल विज्ञान  –  ग्रह गणना, ग्रहण भविष्यवाणी, अयन गति। अनुभवजन्य रूप से सत्यापन योग्य।' : 'Pure mathematical astronomy  –  planetary computation, eclipse prediction, precession. Empirically verifiable.'} />
        <BeginnerNote term={isHi ? 'फलित ज्योतिष' : 'Phalit Jyotish'} explanation={isHi ? 'व्याख्यात्मक ज्योतिष  –  दशा, योग, भाव, गोचर। गणितीय आधार पर निर्मित अर्थ का ढाँचा।' : 'Interpretive astrology  –  dashas, yogas, houses, transits. The framework of meaning built on the mathematical foundation.'} />
      </section>

      {/* Section B: Jyotish as Vedanga */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'वेदाङ्ग के रूप में ज्योतिष' : 'Jyotish as Vedanga'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'ज्योतिष छह वेदाङ्गों में से एक है  –  वेद के अंग। इसे वेदों का "नेत्र" (चक्षु) कहा जाता है। परन्तु इसका अर्थ क्या है?'
            : 'Jyotish is one of six Vedangas  –  limbs of the Veda. It is called the "eye" (chakshu) of the Vedas. But what does this mean?'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'वेद एक आवश्यक सत्य का वर्णन करते हैं: "अहं ब्रह्मास्मि" (मैं ब्रह्म हूँ) और "तत् त्वम् असि" (वह तू है)। वेद अन्ततः चेतना को समझने के बारे में हैं  –  आत्मा की प्रकृति और ब्रह्माण्ड से उसके सम्बन्ध के बारे में।'
            : 'The Vedas describe one essential truth: "Aham Brahmasmi" (I am Brahman) and "Tat Tvam Asi" (That thou art). The Vedas are ultimately about understanding consciousness  –  the nature of the Self and its relationship to the cosmos.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'ज्योतिष, इस ज्ञान-काय का नेत्र होकर, आपको देखने में सहायता करता है  –  काल के प्रतिरूप देखना, खगोलीय पिण्डों का वह लयबद्ध नृत्य देखना जो जीवन और मृत्यु की लय को प्रतिबिम्बित करता है। यह भाग्य-कथन नहीं है। यह ब्रह्माण्डीय पैमाने पर प्रतिरूप पहचान है, जो गणित पर आधारित है।'
            : 'Jyotish, as the eye of this body of knowledge, helps you see  –  see the patterns of time, see the rhythmic dance of celestial bodies that mirrors the rhythms of life and death. It is not fortune-telling. It is pattern recognition on a cosmic scale, grounded in mathematics.'}
        </p>
      </section>

      {/* Section C: The Panchang  –  Time Made Visible */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पञ्चाङ्ग  –  दृश्यमान काल' : 'The Panchang  –  Time Made Visible'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'दैनिक पञ्चाङ्ग (पञ्च + अंग = पाँच अंग) प्रतिदिन को सूर्य, चन्द्रमा और ब्रह्माण्ड के बीच पाँच अवलोकनीय सम्बन्धों में विभाजित करता है:'
            : 'The daily Panchang (pancha + anga = five limbs) breaks each day into five observable relationships between the Sun, Moon, and the cosmos:'}
        </p>
        <ul className="text-text-secondary text-sm space-y-2 ml-4 mb-4">
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'तिथि' : 'Tithi'}</span>{' '}
            {isHi ? '— सूर्य और चन्द्रमा के बीच कोणीय सम्बन्ध (चेतना और मन)' : '— the angular relationship between Sun and Moon (consciousness and mind)'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'नक्षत्र' : 'Nakshatra'}</span>{' '}
            {isHi ? '— स्थिर तारों के सापेक्ष चन्द्रमा की स्थिति (ब्रह्माण्ड में मन का स्थान)' : '— the Moon\'s position against the fixed stars (mind\'s place in the cosmos)'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'योग' : 'Yoga'}</span>{' '}
            {isHi ? '— सूर्य और चन्द्रमा का संयुक्त देशान्तर (चेतना और मन का मिलन)' : '— the combined longitude of Sun and Moon (the union of consciousness and mind)'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'करण' : 'Karana'}</span>{' '}
            {isHi ? '— अर्ध-तिथि (सूर्य-चन्द्र सम्बन्ध की सूक्ष्म स्पन्दन)' : '— the half-tithi (the finer pulse of the Sun-Moon relationship)'}
          </li>
          <li>
            <span className="text-gold-light font-bold">{isHi ? 'वार' : 'Vara'}</span>{' '}
            {isHi ? '— सप्ताह का दिन, ग्रह होरा क्रम से व्युत्पन्न' : '— the weekday, derived from the planetary hour sequence'}
          </li>
        </ul>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'ये मनमाने विभाजन नहीं हैं। ये दो खगोलीय सन्दर्भ बिन्दुओं (सूर्य और चन्द्रमा) तथा पृष्ठभूमि ब्रह्माण्ड के बीच एकमात्र पाँच व्युत्पन्न सम्बन्ध हैं। पाँच यहाँ कोई रहस्यमय संख्या नहीं  –  यह एक गणितीय तथ्य है: इस त्रि-पिण्ड प्रणाली में ठीक पाँच स्वतन्त्र अवलोकनीय राशियाँ हैं।'
            : 'These are not arbitrary divisions. They are the five  –  and ONLY five  –  derivable relationships between two celestial reference points (Sun and Moon) and the background cosmos (Brahmanda). Five is not a mystical number here  –  it is a mathematical fact: there are exactly five independent observable quantities in this three-body system.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'तो पञ्चाङ्ग दृश्यमान काल है। यह प्रत्येक दिन को एक अद्वितीय ब्रह्माण्डीय अंगुलि-छाप देता है  –  और इसके साथ, मानव कर्म को ब्रह्माण्डीय लय से संरेखित करने का एक ढाँचा।'
            : 'The Panchang, then, is time made visible. It gives each day a unique cosmic fingerprint  –  and with it, a framework for aligning human action with cosmic rhythm.'}
        </p>
      </section>

      {/* Section D: Why It Matters */}
      <WhyItMatters locale={locale}>
        {isHi
          ? 'ज्योतिष छद्म-विज्ञान नहीं है  –  यह एक कठोर गणितीय ढाँचा है जिसके ऊपर एक दार्शनिक अधिरचना है। खगोल विज्ञान NASA-स्तर का है। दर्शन वेदान्तिक है। मिलकर, ये कुछ ऐसा प्रदान करते हैं जो न पश्चिमी खगोल विज्ञान और न पश्चिमी ज्योतिष दे सकता है: एक एकीकृत प्रणाली जहाँ वही गणित जो ग्रहणों की भविष्यवाणी करता है, मानव अनुभव के भू-दृश्य का भी मानचित्रण करता है।'
          : 'Jyotish is not pseudoscience  –  it is a rigorous mathematical framework with a philosophical superstructure. The astronomy is NASA-grade. The philosophy is Vedantic. Together, they offer something neither Western astronomy nor Western astrology can: a unified system where the same mathematics that predicts eclipses also maps the terrain of human experience.'}
      </WhyItMatters>

      <QuickCheck
        question={isHi ? 'सिद्धान्तिक ज्योतिष और फलित ज्योतिष में क्या सम्बन्ध है?' : 'What is the relationship between Siddhantic and Phalit Jyotish?'}
        options={isHi
          ? ['वे असम्बद्ध विषय हैं', 'फलित गणितीय आधार पर निर्मित है', 'सिद्धान्तिक फलित से व्युत्पन्न है', 'वे एक ही चीज़ हैं']
          : ['They are unrelated disciplines', 'Phalit is built on the mathematical foundation', 'Siddhantic is derived from Phalit', 'They are the same thing']}
        correctIndex={1}
        explanation={isHi
          ? 'फलित ज्योतिष (व्याख्या) सिद्धान्तिक ज्योतिष (गणित) पर निर्मित है। गणित के बिना, व्याख्या निराधार है। दोनों मिलकर ज्योतिष बनाते हैं।'
          : 'Phalit Jyotish (interpretation) is built upon Siddhantic Jyotish (mathematics). Without the maths, the interpretation is groundless. Together, they form Jyotish.'}
      />
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_1Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]}
      questions={QUESTIONS}
    />
  );
}

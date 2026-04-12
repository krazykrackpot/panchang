'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_4_2', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.2',
  title: { en: "Ayanamsha Systems Compared", hi: "अयनांश पद्धतियों की तुलना" },
  subtitle: { en: "Lahiri, Raman, KP, Fagan-Bradley — why they differ, how to choose, and numerical comparison", hi: "लाहिरी, रमण, केपी, फगन-ब्रैडली — अन्तर क्यों, कैसे चुनें, और संख्यात्मक तुलना" },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Precession Physics', hi: 'अयनगति भौतिकी' }, href: '/learn/modules/4-1' },
    { label: { en: 'Tropical vs Sidereal', hi: 'सायन बनाम निरयन' }, href: '/learn/modules/4-3' },
    { label: { en: 'Rashis', hi: 'राशियाँ' }, href: '/learn/rashis' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q4_2_01', type: 'mcq',
    question: { en: "Which star does the Lahiri (Chitrapaksha) ayanamsha use as its reference anchor?", hi: "लाहिरी (चित्रापक्ष) अयनांश किस तारे को संदर्भ बिन्दु मानता है?" },
    options: [
      { en: "Polaris (Dhruva)", hi: "पोलारिस (ध्रुव)" },
      { en: "Spica (Chitra) at 180°", hi: "स्पाइका (चित्रा) 180° पर" },
      { en: "Aldebaran (Rohini) at 15° Taurus", hi: "ऐल्डेबरान (रोहिणी) 15° वृषभ पर" },
      { en: "Regulus (Magha) at 0° Leo", hi: "रेगुलस (मघा) 0° सिंह पर" },
    ],
    correctAnswer: 1,
    explanation: { en: "Lahiri defines Spica (Chitra, Alpha Virginis) at exactly 180° sidereal longitude — the start of Tula (Libra). This was adopted by the Indian Calendar Reform Committee in 1956.", hi: "लाहिरी पद्धति स्पाइका (चित्रा, अल्फा वर्जिनिस) को 180° निरयन देशान्तर पर — तुला राशि के आरम्भ पर — निर्धारित करती है। इसे 1956 में भारतीय पञ्चाङ्ग सुधार समिति ने अपनाया।" },
    classicalRef: 'Indian Calendar Reform Committee, 1956',
  },
  {
    id: 'q4_2_02', type: 'true_false',
    question: { en: "The KP (Krishnamurti) ayanamsha differs from Lahiri by approximately 6 arcminutes.", hi: "केपी (कृष्णमूर्ति) अयनांश लाहिरी से लगभग 6 कलांश (आर्कमिनट) भिन्न है।" },
    correctAnswer: true,
    explanation: { en: "Correct. The KP ayanamsha is very close to Lahiri — typically about 6 arcminutes (0.1°) less. This small difference rarely changes the sign of a planet, but can occasionally shift sub-lord allocations in KP astrology.", hi: "सही। केपी अयनांश लाहिरी के बहुत निकट है — सामान्यतः लगभग 6 कलांश (0.1°) कम। यह छोटा अन्तर प्रायः ग्रह की राशि नहीं बदलता, पर कभी-कभी केपी ज्योतिष में उपनक्षत्र-स्वामी बदल सकता है।" },
  },
  {
    id: 'q4_2_03', type: 'mcq',
    question: { en: "The Fagan-Bradley ayanamsha is primarily used in which tradition?", hi: "फगन-ब्रैडली अयनांश मुख्यतः किस परम्परा में प्रयुक्त होता है?" },
    options: [
      { en: "North Indian Parashari", hi: "उत्तर भारतीय पाराशरी" },
      { en: "South Indian Jaimini", hi: "दक्षिण भारतीय जैमिनी" },
      { en: "Western Sidereal astrology", hi: "पाश्चात्य निरयन ज्योतिष" },
      { en: "Tibetan astrology", hi: "तिब्बती ज्योतिष" },
    ],
    correctAnswer: 2,
    explanation: { en: "Fagan-Bradley is the standard ayanamsha for Western Sidereal astrology, developed by Cyril Fagan and Donald Bradley in the mid-20th century. It anchors Aldebaran (Rohini) near 15° Taurus and Antares near 15° Scorpio.", hi: "फगन-ब्रैडली पाश्चात्य निरयन ज्योतिष का मानक अयनांश है, जिसे सिरिल फगन और डोनाल्ड ब्रैडली ने बीसवीं शताब्दी के मध्य में विकसित किया। यह ऐल्डेबरान (रोहिणी) को वृषभ 15° के निकट और ऐन्टेयर्स को वृश्चिक 15° के निकट स्थिर करता है।" },
  },
  {
    id: 'q4_2_04', type: 'mcq',
    question: { en: "The B.V. Raman ayanamsha for J2000.0 is approximately:", hi: "J2000.0 के लिए बी.वी. रमण अयनांश लगभग कितना है?" },
    options: [
      { en: "23.85°", hi: "23.85°" },
      { en: "22.37°", hi: "22.37°" },
      { en: "24.04°", hi: "24.04°" },
      { en: "21.00°", hi: "21.00°" },
    ],
    correctAnswer: 1,
    explanation: { en: "The B.V. Raman ayanamsha is approximately 22.37° at J2000.0 — about 1.5° less than Lahiri. This places the zero-ayanamsha year around 397 CE rather than Lahiri's ~285 CE.", hi: "बी.वी. रमण अयनांश J2000.0 पर लगभग 22.37° है — लाहिरी से लगभग 1.5° कम। इससे शून्य-अयनांश वर्ष लाहिरी के ~285 ई. की बजाय लगभग 397 ई. में आता है।" },
  },
  {
    id: 'q4_2_05', type: 'true_false',
    question: { en: "All ayanamsha systems agree on the rate of precession (~50.3 arcsec/year) — they only disagree on the zero-point epoch.", hi: "सभी अयनांश पद्धतियाँ अयनगति दर (~50.3 कलासेकण्ड/वर्ष) पर सहमत हैं — वे केवल शून्य-बिन्दु युग पर असहमत हैं।" },
    correctAnswer: true,
    explanation: { en: "Correct. All major ayanamsha systems use the same precession rate from modern astronomy. The difference lies in when they place the zero-ayanamsha epoch — the year when tropical and sidereal zodiacs were aligned. Lahiri: ~285 CE, Raman: ~397 CE, Fagan-Bradley: ~221 CE.", hi: "सही। सभी प्रमुख अयनांश पद्धतियाँ आधुनिक खगोलविज्ञान की वही अयनगति दर प्रयोग करती हैं। अन्तर इसमें है कि वे शून्य-अयनांश युग — जब सायन और निरयन राशिचक्र समरेखित थे — कब मानती हैं। लाहिरी: ~285 ई., रमण: ~397 ई., फगन-ब्रैडली: ~221 ई.।" },
  },
  {
    id: 'q4_2_06', type: 'mcq',
    question: { en: "If a planet is at 45° tropical longitude and the Lahiri ayanamsha is 24.2°, what is the sidereal longitude?", hi: "यदि कोई ग्रह 45° सायन देशान्तर पर है और लाहिरी अयनांश 24.2° है, तो निरयन देशान्तर क्या होगा?" },
    options: [
      { en: "69.2° (Gemini 9.2°)", hi: "69.2° (मिथुन 9.2°)" },
      { en: "20.8° (Aries 20.8°)", hi: "20.8° (मेष 20.8°)" },
      { en: "45° (Taurus 15°)", hi: "45° (वृषभ 15°)" },
      { en: "24.2° (Aries 24.2°)", hi: "24.2° (मेष 24.2°)" },
    ],
    correctAnswer: 1,
    explanation: { en: "Sidereal = Tropical - Ayanamsha = 45° - 24.2° = 20.8°. Since 20.8° falls within 0-30° (Aries range), the planet is at Aries 20.8° in Lahiri sidereal.", hi: "निरयन = सायन - अयनांश = 45° - 24.2° = 20.8°। चूँकि 20.8° मेष सीमा (0-30°) में है, ग्रह लाहिरी निरयन में मेष 20.8° पर है।" },
  },
  {
    id: 'q4_2_07', type: 'mcq',
    question: { en: "Using the same tropical position (45°), what sign would the planet occupy in the Raman system (ayanamsha ~22.4°)?", hi: "उसी सायन स्थिति (45°) पर, रमण पद्धति (अयनांश ~22.4°) में ग्रह किस राशि में होगा?" },
    options: [
      { en: "Pisces", hi: "मीन" },
      { en: "Aries", hi: "मेष" },
      { en: "Taurus", hi: "वृषभ" },
      { en: "Gemini", hi: "मिथुन" },
    ],
    correctAnswer: 1,
    explanation: { en: "Sidereal (Raman) = 45° - 22.4° = 22.6°. Still within 0-30° = Aries. In this case, both Lahiri and Raman give the same sign. The sign only changes for planets near sign boundaries (within ~2° of a cusp).", hi: "निरयन (रमण) = 45° - 22.4° = 22.6°। अभी भी 0-30° = मेष में। इस स्थिति में लाहिरी और रमण दोनों एक ही राशि देते हैं। राशि तभी बदलती है जब ग्रह राशि-सन्धि के निकट (~2° के भीतर) हो।" },
  },
  {
    id: 'q4_2_08', type: 'true_false',
    question: { en: "The Indian Government officially uses the Raman ayanamsha for its national calendar (Rashtriya Panchang).", hi: "भारत सरकार अपने राष्ट्रीय पञ्चाङ्ग (राष्ट्रीय पञ्चाङ्ग) के लिए आधिकारिक रूप से रमण अयनांश का उपयोग करती है।" },
    correctAnswer: false,
    explanation: { en: "False. The Indian Government uses the Lahiri (Chitrapaksha) ayanamsha, adopted on the recommendation of the Calendar Reform Committee (1956) chaired by physicist Meghnad Saha. The Rashtriya Panchang published by the India Meteorological Department uses Lahiri.", hi: "गलत। भारत सरकार लाहिरी (चित्रापक्ष) अयनांश का उपयोग करती है, जो भौतिकविद् मेघनाद साहा की अध्यक्षता में पञ्चाङ्ग सुधार समिति (1956) की सिफ़ारिश पर अपनाया गया। भारत मौसम विज्ञान विभाग द्वारा प्रकाशित राष्ट्रीय पञ्चाङ्ग लाहिरी का उपयोग करता है।" },
  },
  {
    id: 'q4_2_09', type: 'mcq',
    question: { en: "If someone's Moon is at 29.9° Aries in Lahiri, what sign might the Raman system place it in?", hi: "यदि किसी की चन्द्रमा लाहिरी में मेष 29.9° पर है, तो रमण पद्धति में वह किस राशि में हो सकती है?" },
    options: [
      { en: "Pisces — pushed back one more sign", hi: "मीन — एक और राशि पीछे" },
      { en: "Taurus — pushed forward by ~1.5°", hi: "वृषभ — ~1.5° आगे" },
      { en: "Aries — stays the same", hi: "मेष — वही रहती है" },
      { en: "Cannot determine without birth time", hi: "जन्म-समय के बिना निर्धारित नहीं कर सकते" },
    ],
    correctAnswer: 1,
    explanation: { en: "Raman ayanamsha is ~1.5° less than Lahiri, so sidereal positions are ~1.5° higher. Moon at 29.9° Aries (Lahiri) becomes ~31.4° = 1.4° Taurus in Raman. The sign changes! This illustrates why boundary planets are sensitive to ayanamsha choice.", hi: "रमण अयनांश लाहिरी से ~1.5° कम है, अतः निरयन स्थितियाँ ~1.5° अधिक होती हैं। चन्द्रमा मेष 29.9° (लाहिरी) से ~31.4° = वृषभ 1.4° (रमण) हो जाती है। राशि बदल जाती है! यह दर्शाता है कि राशि-सन्धि के निकट ग्रह अयनांश चयन के प्रति संवेदनशील होते हैं।" },
  },
  {
    id: 'q4_2_10', type: 'mcq',
    question: { en: "Which committee recommended Lahiri as India's official ayanamsha, and in which year?", hi: "किस समिति ने लाहिरी को भारत का आधिकारिक अयनांश सुझाया, और किस वर्ष?" },
    options: [
      { en: "Indian Astronomical Society, 1947", hi: "भारतीय खगोलीय समाज, 1947" },
      { en: "Calendar Reform Committee, 1956", hi: "पञ्चाङ्ग सुधार समिति, 1956" },
      { en: "Royal Astronomical Society, 1900", hi: "रॉयल एस्ट्रोनॉमिकल सोसायटी, 1900" },
      { en: "ISRO Advisory Board, 1972", hi: "इसरो सलाहकार मण्डल, 1972" },
    ],
    correctAnswer: 1,
    explanation: { en: "The Calendar Reform Committee, chaired by physicist Meghnad Saha and established by the Indian Government's Council of Scientific and Industrial Research (CSIR) in 1952, published its report in 1955. The Lahiri ayanamsha was officially adopted in 1956.", hi: "पञ्चाङ्ग सुधार समिति, जिसकी अध्यक्षता भौतिकविद् मेघनाद साहा ने की और जो 1952 में भारत सरकार की वैज्ञानिक एवं औद्योगिक अनुसन्धान परिषद् (CSIR) द्वारा स्थापित हुई, ने 1955 में अपनी रिपोर्ट प्रकाशित की। लाहिरी अयनांश 1956 में आधिकारिक रूप से अपनाया गया।" },
    classicalRef: 'Report of the Calendar Reform Committee, CSIR, 1955',
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {META.title.en}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          If the sidereal zodiac is anchored to fixed stars, you might expect there to be only one correct ayanamsha value. But here lies the crux: which fixed star do you anchor to, and at what exact ecliptic longitude? Different astronomers across centuries chose slightly different reference stars and calibration dates, producing ayanamsha values that diverge by 1 to 3 degrees. This seemingly small gap can change a planet&apos;s sign for positions near a rashi boundary, cascading into different dasha sequences, different house lordships, and entirely different predictions.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The four most widely used systems are: <strong className="text-gold-light">Lahiri (Chitrapaksha)</strong>, the Indian Government standard that anchors Spica at 180°; <strong className="text-gold-light">B.V. Raman</strong>, popularized by the legendary Bangalore astrologer, placing the zero-point around 397 CE; <strong className="text-gold-light">KP (Krishnamurti)</strong>, nearly identical to Lahiri but fine-tuned for the Krishnamurti Paddhati sub-lord system; and <strong className="text-gold-light">Fagan-Bradley</strong>, the Western sidereal standard that anchors Aldebaran and Antares on the Taurus-Scorpio axis.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          All four systems agree on the physics — precession advances at approximately 50.3 arcseconds per year. Where they disagree is the epoch: the exact year when the tropical and sidereal zodiacs coincided (zero ayanamsha). Lahiri places this around 285 CE, Raman around 397 CE, and Fagan-Bradley around 221 CE. Since all then apply the same precession rate forward, the differences remain constant across centuries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The &quot;reference star debate&quot; is fundamentally a question of convention rather than correctness. The ecliptic does not have a physically marked zero point among the stars. Ancient Indian astronomers used the nakshatra Chitra (Spica) as their primary reference because it lies almost exactly on the ecliptic and is one of the brightest stars in the sky — making it easy to observe. Western siderealists preferred the Aldebaran-Antares axis because those two bright stars sit nearly 180° apart, providing a self-checking baseline.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Surya Siddhanta and early siddhantas did not specify a single precise ayanamsha value — they used approximate corrections or the trepidation model. The concept of a fixed, monotonically increasing ayanamsha anchored to a specific star emerged in the modern era. Nyanatiloka Chattopadhyaya (later known as N.C. Lahiri) computed his ayanamsha tables in the 1930s-40s. The 1955 Calendar Reform Committee report, chaired by the great physicist Meghnad Saha, evaluated 30+ ayanamsha proposals and selected Lahiri as best matching observable star positions and traditional Indian calendar conventions. Meanwhile, Cyril Fagan derived his system from Babylonian star catalogues in the 1940s, and B.V. Raman published his independent calculations based on his interpretation of classical texts.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Numerical Comparison &amp; Conversion
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          At the J2000.0 epoch (1 January 2000, 12:00 TT), the four major ayanamsha values are: <strong className="text-gold-light">Lahiri: 23.853°</strong>, <strong className="text-gold-light">KP (Krishnamurti): 23.749°</strong>, <strong className="text-gold-light">B.V. Raman: 22.370°</strong>, and <strong className="text-gold-light">Fagan-Bradley: 24.042°</strong>. The spread from smallest (Raman) to largest (Fagan-Bradley) is 1.672° — enough to shift a boundary planet into a different sign.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For 2026 (T = 0.26 centuries from J2000.0), applying the standard precession rate to each: Lahiri ≈ 24.22°, KP ≈ 24.11°, Raman ≈ 22.73°, Fagan-Bradley ≈ 24.41°. The formula for Lahiri specifically is: A = 23.85306 + 1.39722×T + 0.00018×T² - 0.000005×T³, where T is Julian centuries from J2000.0. Other systems use the same precession polynomial but with a different initial constant.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          How do you choose which system to use? For traditional Parashari or Jaimini Vedic astrology, Lahiri is the safe default — it has the largest practitioner base, the most validated predictions, and official Indian Government backing. For KP (Krishnamurti Paddhati) astrology specifically, use the KP ayanamsha since the sub-lord tables were computed with it. For Western sidereal astrology, use Fagan-Bradley. If you follow B.V. Raman&apos;s interpretive methods, use his ayanamsha for internal consistency.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key principle: always be consistent within a single chart reading. Never mix Lahiri positions with KP sub-lord tables, or Raman positions with Lahiri-based dasha calculations. The system is self-consistent — the interpretive rules were developed and tested under a specific ayanamsha, and switching mid-analysis introduces errors.
        </p>
      </section>
      <ExampleChart
        ascendant={1}
        planets={{ 1: [0], 4: [1], 10: [4] }}
        title="Ayanamsha Comparison — Same Planets, Different Systems"
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 1 — Sign change across systems:</span> Suppose the Sun is at 45° tropical (Taurus 15°) on a given date in 2026. Lahiri sidereal: 45° - 24.22° = 20.78° = Aries 20°47&apos;. Raman sidereal: 45° - 22.73° = 22.27° = Aries 22°16&apos;. KP sidereal: 45° - 24.11° = 20.89° = Aries 20°53&apos;. Fagan-Bradley: 45° - 24.41° = 20.59° = Aries 20°35&apos;. All four systems agree: Aries. No sign change here because 45° is well within one sign of the nearest cusp.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 2 — Boundary case with sign change:</span> Now suppose Moon is at 54.5° tropical (Taurus 24.5°). Lahiri: 54.5° - 24.22° = 30.28° = Taurus 0°17&apos; (just entered Taurus). Raman: 54.5° - 22.73° = 31.77° = Taurus 1°46&apos;. But if Moon were at 53.9° tropical: Lahiri gives 29.68° = Aries 29°41&apos; (still in Aries!), while Raman gives 31.17° = Taurus 1°10&apos; (already in Taurus). Different sign, different house lord, different dasha.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example 3 — Lahiri polynomial for 2026:</span> T = (2026.0 - 2000.0)/100 = 0.26. A = 23.85306 + 1.39722×0.26 + 0.00018×(0.26)² - 0.000005×(0.26)³ = 23.85306 + 0.36328 + 0.00001 - 0.00000 = 24.2164°. This matches published Lahiri values for 2026.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <strong>Misconception:</strong> &quot;Lahiri is the only correct ayanamsha and all others are wrong.&quot; <strong className="text-red-300">Reality:</strong> No ayanamsha can be mathematically proven &quot;correct&quot; in an absolute sense — the choice of anchor star is a human convention. Lahiri is the most widely used and officially recognized, giving it the largest empirical validation base. But competent astrologers get excellent results with KP, Raman, and other systems.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <strong>Misconception:</strong> &quot;The difference between systems is negligible and does not matter.&quot; <strong className="text-red-300">Reality:</strong> The ~1.5° gap between Lahiri and Raman may seem small, but for any planet within 2° of a sign boundary (statistically, about 13% of all planets), the sign changes. Different sign means different house lordship, different natural benefic/malefic status, different dasha sequence — the entire reading can diverge.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app defaults to the Lahiri ayanamsha (Indian Government standard) for all calculations. The internal pipeline works as follows: Meeus algorithms compute tropical planetary longitudes to sub-degree accuracy, then the Lahiri polynomial subtracts the ayanamsha to produce sidereal positions. For KP practitioners, the app&apos;s KP module uses the Krishnamurti ayanamsha with its own sub-lord tables. The difference between systems is purely in the constant offset — the underlying astronomical engine remains identical. When in doubt, use Lahiri: it has 70+ years of institutional backing, the largest corpus of validated predictions, and is what the Rashtriya Panchang uses.
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          The Lahiri System — Deep Dive
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Lahiri ayanamsha owes its name to Nirmala Chandra Lahiri (1906-1980), an astronomer and mathematician who served as the head of the Positional Astronomy Centre in Kolkata. Lahiri computed precise ayanamsha tables by defining the bright star Spica (Alpha Virginis, known as Chitra in the nakshatra system) at exactly 180° sidereal ecliptic longitude — the first point of Tula (Libra). This definition is called &quot;Chitrapaksha&quot; because it takes the Chitra nakshatra as its reference.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In 1952, the Indian Government established the Calendar Reform Committee under the Council of Scientific and Industrial Research (CSIR), chaired by the Nobel-nominated physicist Meghnad Saha. The committee surveyed over 30 different ayanamsha proposals from various regional panchangs across India. Their 1955 report concluded that the Chitrapaksha (Lahiri) system best reconciled astronomical observation with traditional calendar practices. The recommendation was adopted in 1956, and the Rashtriya Panchang (National Calendar) has used Lahiri ever since.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Why Spica? It is the 15th brightest star in the sky (magnitude +1.04), lies within 2° of the ecliptic plane (making it an excellent zodiacal reference), and has been used as a fiducial star in Indian astronomy for millennia. The word &quot;Chitra&quot; itself means &quot;bright&quot; or &quot;brilliant&quot; in Sanskrit. Spica&apos;s proper motion is only about 43 milliarcseconds per year — negligible over human timescales, ensuring the reference remains stable for centuries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Lahiri polynomial formula is: A(T) = 23.85306 + 1.39722×T + 0.00018×T² - 0.000005×T³, where T is Julian centuries from J2000.0. The linear term (1.39722°/century = 50.3 arcsec/year) represents the precession rate. The quadratic and cubic terms capture tiny accelerations in precession caused by planetary perturbations on Earth&apos;s orbit. At current rates, Lahiri ayanamsha crosses 25° around the year 2080 and will reach 30° (a full sign offset) around approximately 2440 CE.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          While the BPHS (Brihat Parashara Hora Shastra) does not specify a numerical ayanamsha, the Surya Siddhanta (circa 400 CE) places the Chitra star in a manner consistent with the Chitrapaksha framework. The concept of using Chitra/Spica as the primary reference star has roots going back to the Vedanga Jyotisha period. The modern Lahiri formalization simply quantified what was already implicit in the Indian astronomical tradition. The Calendar Reform Committee drew on this heritage while applying modern observational precision.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Example 1 — Lahiri across centuries:</span> For year 1900 (T = -1.0): A = 23.85306 - 1.39722 + 0.00018 + 0.000005 = 22.456°. For year 2000 (T = 0): A = 23.853°. For year 2100 (T = 1.0): A = 23.85306 + 1.39722 + 0.00018 - 0.000005 = 25.250°. The ayanamsha grew by 2.794° over 200 years, averaging 1.397° per century.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example 2 — Finding the zero-ayanamsha year:</span> We need A(T) = 0. Using the linear approximation: 0 = 23.853 + 1.397×T, so T = -17.07 centuries = year 2000 - 1707 = ~293 CE. The full polynomial gives ~285 CE, the commonly cited epoch when the tropical vernal equinox coincided with sidereal 0° Aries under the Lahiri system. This is why the two zodiacs diverged — from ~285 CE onward, the gap grew by ~1.4° per century.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <strong>Misconception:</strong> &quot;Lahiri ayanamsha has been used since ancient times.&quot; <strong className="text-red-300">Reality:</strong> The modern Lahiri formulation dates to the 20th century. Ancient Indian astronomers used approximate corrections or trepidation models. Lahiri systematized what was a scattered tradition into a precise, computable formula.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <strong>Misconception:</strong> &quot;Since Spica has proper motion, the Lahiri system drifts over time.&quot; <strong className="text-red-300">Reality:</strong> Spica&apos;s proper motion is ~43 milliarcseconds/year — it takes about 84 years to accumulate a single arcsecond of drift. Over a human lifetime, this is completely negligible. Over 10,000 years it would be about 7 arcminutes — still smaller than the uncertainty in any ancient text. The Lahiri system is stable for all practical astrological purposes.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Lahiri ayanamsha is used by the Indian Government&apos;s Rashtriya Panchang, the India Meteorological Department, virtually all North Indian panchangs, most South Indian panchangs, and the vast majority of practicing Jyotishis worldwide. When software like this app, Jagannatha Hora, or Parashara&apos;s Light defaults to &quot;Lahiri,&quot; they are implementing the same polynomial. The institutional consensus means that Lahiri-based predictions have been tested across millions of charts for over 70 years — a validation corpus no other ayanamsha can match. For this reason, Lahiri is the recommended default for anyone beginning Vedic astrology study.
        </p>
      </section>
    </div>
  );
}

export default function Module4_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

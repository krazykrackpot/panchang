'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_1_2', phase: 1, topic: 'Foundations', moduleNumber: '1.2',
  title: { en: 'Measuring the Sky — Degrees, Signs & Nakshatras', hi: 'आकाश मापन — अंश, राशि एवं नक्षत्र' },
  subtitle: { en: 'The dual coordinate grid that makes Jyotish calculations possible', hi: 'वह दोहरा निर्देशांक जाल जो ज्योतिष गणनाओं को संभव बनाता है' },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: '1.1 Night Sky & Ecliptic', hi: '1.1 रात्रि आकाश' }, href: '/learn/modules/1-1' },
    { label: { en: 'Nakshatras', hi: 'नक्षत्र' }, href: '/learn/nakshatras' },
    { label: { en: 'Rashis', hi: 'राशियाँ' }, href: '/learn/rashis' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q1_2_01', type: 'mcq', question: { en: 'How many degrees make up one Rashi (zodiac sign)?', hi: 'एक राशि में कितने अंश होते हैं?' }, options: [{ en: '12°', hi: '12°' }, { en: '13°20\'', hi: '13°20\'' }, { en: '30°', hi: '30°' }, { en: '360°', hi: '360°' }], correctAnswer: 2, explanation: { en: '360° ÷ 12 signs = 30° per sign. This equal division is fundamental — signs are mathematical divisions, not physical constellations (which have unequal spans).', hi: '360° ÷ 12 राशि = 30° प्रति राशि। यह समान विभाजन मूलभूत है — राशियाँ गणितीय विभाजन हैं, भौतिक नक्षत्रमंडल (जिनका विस्तार असमान है) नहीं।' }, classicalRef: 'BPHS Ch.1 v.4' },
  { id: 'q1_2_02', type: 'mcq', question: { en: 'How many degrees span one Nakshatra?', hi: 'एक नक्षत्र कितने अंश का होता है?' }, options: [{ en: '12°', hi: '12°' }, { en: '13°20\'', hi: '13°20\'' }, { en: '30°', hi: '30°' }, { en: '3°20\'', hi: '3°20\'' }], correctAnswer: 1, explanation: { en: '360° ÷ 27 nakshatras = 13°20\' (13.333°) per nakshatra. Each nakshatra is further divided into 4 padas of 3°20\' each. Total: 27 × 4 = 108 padas = the sacred number.', hi: '360° ÷ 27 = 13°20\' प्रति नक्षत्र। प्रत्येक नक्षत्र 4 पादों (3°20\') में विभाजित। कुल: 27 × 4 = 108 पाद = पवित्र संख्या।' }, classicalRef: 'Surya Siddhanta' },
  { id: 'q1_2_03', type: 'mcq', question: { en: 'If the Moon is at 47° sidereal longitude, which sign is it in?', hi: 'चंद्रमा 47° निरयन देशांतर पर हो तो किस राशि में है?' }, options: [{ en: 'Aries (0-30°)', hi: 'मेष' }, { en: 'Taurus (30-60°)', hi: 'वृषभ' }, { en: 'Gemini (60-90°)', hi: 'मिथुन' }, { en: 'Cancer (90-120°)', hi: 'कर्क' }], correctAnswer: 1, explanation: { en: '47° falls in 30-60° range = Taurus (2nd sign). Formula: sign = floor(47/30) + 1 = floor(1.566) + 1 = 1 + 1 = 2 = Taurus. The Moon is at 17° within Taurus (47 - 30 = 17°).', hi: '47° 30-60° सीमा में = वृषभ (2nd राशि)। सूत्र: floor(47/30) + 1 = 2 = वृषभ। वृषभ में 17° (47-30=17°)।' } },
  { id: 'q1_2_04', type: 'mcq', question: { en: 'If the Moon is at 47°, which Nakshatra is it in?', hi: 'चंद्रमा 47° पर हो तो कौन सा नक्षत्र?' }, options: [{ en: 'Ashwini (1st)', hi: 'अश्विनी' }, { en: 'Bharani (2nd)', hi: 'भरणी' }, { en: 'Krittika (3rd)', hi: 'कृत्तिका' }, { en: 'Rohini (4th)', hi: 'रोहिणी' }], correctAnswer: 3, explanation: { en: 'Nakshatra = floor(47 / 13.333) + 1 = floor(3.525) + 1 = 3 + 1 = 4 = Rohini. Rohini spans 40°00\' to 53°20\'. The Moon at 47° is in the 3rd pada of Rohini (7° into Rohini, pada = floor(7/3.333) + 1 = 3).', hi: 'नक्षत्र = floor(47/13.333) + 1 = 4 = रोहिणी। रोहिणी 40°-53°20\' तक। 47° पर रोहिणी का 3rd पाद।' } },
  { id: 'q1_2_05', type: 'true_false', question: { en: '27 nakshatras × 4 padas = 108 — and this is why 108 is sacred in Hinduism.', hi: '27 नक्षत्र × 4 पाद = 108 — और यही कारण है कि 108 हिंदू धर्म में पवित्र है।' }, correctAnswer: true, explanation: { en: 'Correct. 108 is the total number of Navamsha divisions (padas) in the zodiac. A mala (rosary) has 108 beads. The Sun\'s diameter is approximately 108 times Earth\'s. The Sun-Earth distance is approximately 108 Sun-diameters. This astronomical convergence was recognized by ancient Indian mathematicians.', hi: 'सही। 108 राशिचक्र में नवांश (पाद) विभाजनों की कुल संख्या है। एक माला में 108 मनके होते हैं। सूर्य का व्यास पृथ्वी का ~108 गुना है।' } },
  { id: 'q1_2_06', type: 'mcq', question: { en: 'Why does the Jyotish system use EQUAL 30° signs instead of the unequal constellations?', hi: 'ज्योतिष में असमान तारामंडलों के बजाय समान 30° राशियाँ क्यों हैं?' }, options: [{ en: 'Because ancient Indians didn\'t know constellations had different sizes', hi: 'क्योंकि प्राचीन भारतीयों को नहीं पता था कि तारामंडल अलग-अलग आकार के हैं' }, { en: 'For mathematical convenience — equal divisions enable precise computation', hi: 'गणितीय सुविधा — समान विभाजन सटीक गणना संभव बनाते हैं' }, { en: 'Because the Greeks told them to', hi: 'क्योंकि ग्रीकों ने कहा' }, { en: 'It was an error that stuck', hi: 'यह एक त्रुटि थी जो बनी रही' }], correctAnswer: 1, explanation: { en: 'The equal 30° division is INTENTIONAL. Ancient Indians were fully aware that star patterns have unequal spans. But computation requires a uniform coordinate system. The 12 × 30° grid and the 27 × 13°20\' grid are mathematical frameworks overlaid on the ecliptic — like longitude lines on Earth.', hi: 'समान 30° विभाजन जानबूझकर है। प्राचीन भारतीयों को पता था कि तारा-पैटर्न असमान हैं। लेकिन गणना के लिए एकसमान निर्देशांक आवश्यक है।' }, classicalRef: 'Surya Siddhanta Ch.1' },
  { id: 'q1_2_07', type: 'mcq', question: { en: 'How many Nakshatras fit in one Rashi?', hi: 'एक राशि में कितने नक्षत्र आते हैं?' }, options: [{ en: 'Exactly 2', hi: 'ठीक 2' }, { en: '2.25 (2 and a quarter)', hi: '2.25 (सवा दो)' }, { en: 'Exactly 3', hi: 'ठीक 3' }, { en: '2.5', hi: '2.5' }], correctAnswer: 1, explanation: { en: '30° per sign ÷ 13.333° per nakshatra = 2.25 nakshatras per sign. This means nakshatra boundaries do NOT align with sign boundaries. A nakshatra can span two signs. This offset creates the rich pada-navamsha mapping system.', hi: '30° ÷ 13.333° = 2.25 नक्षत्र प्रति राशि। नक्षत्र सीमाएं राशि सीमाओं से मेल नहीं खातीं। यह विस्थापन पाद-नवांश मानचित्रण प्रणाली बनाता है।' } },
  { id: 'q1_2_08', type: 'true_false', question: { en: 'One pada of a Nakshatra spans exactly 3°20\' (3.333°).', hi: 'एक नक्षत्र पाद ठीक 3°20\' (3.333°) का होता है।' }, correctAnswer: true, explanation: { en: 'Correct. 13°20\' per nakshatra ÷ 4 padas = 3°20\' per pada. Since each pada maps to exactly one Navamsha (D9) sign, and there are 108 padas total (27 × 4), the pada is the fundamental unit connecting the nakshatra system to the divisional chart system.', hi: 'सही। 13°20\' ÷ 4 = 3°20\' प्रति पाद। प्रत्येक पाद एक नवांश (D9) राशि से मानचित्रित, कुल 108 पाद।' } },
  { id: 'q1_2_09', type: 'mcq', question: { en: 'What is 1 degree of arc divided into?', hi: '1 अंश (degree) को किसमें विभाजित करते हैं?' }, options: [{ en: '60 seconds', hi: '60 सेकंड' }, { en: '60 minutes, each of 60 seconds', hi: '60 कला (minutes), प्रत्येक 60 विकला (seconds)' }, { en: '100 centidegrees', hi: '100 शतांश' }, { en: '24 hours', hi: '24 घंटे' }], correctAnswer: 1, explanation: { en: '1° = 60\' (arcminutes, called "Kala" कला in Sanskrit) = 3600" (arcseconds, called "Vikala" विकला). This sexagesimal system (base-60) was used by both Indian and Babylonian astronomers. The same system gives us 60 minutes per hour and 60 seconds per minute.', hi: '1° = 60\' (कला) = 3600" (विकला)। यह षष्ट्यंश (base-60) प्रणाली भारतीय और बेबीलोनियन दोनों खगोलशास्त्रियों ने प्रयोग की।' } },
  { id: 'q1_2_10', type: 'mcq', question: { en: 'The LCM of 12 (signs) and 27 (nakshatras) is 108. What does 108 represent in the zodiac?', hi: '12 (राशि) और 27 (नक्षत्र) का LCM 108 है। राशिचक्र में 108 क्या दर्शाता है?' }, options: [{ en: 'The number of yogas', hi: 'योगों की संख्या' }, { en: 'The total number of navamsha divisions (padas)', hi: 'नवांश विभाजनों (पादों) की कुल संख्या' }, { en: 'The number of days in a season', hi: 'एक ऋतु में दिनों की संख्या' }, { en: 'The number of tithis in a year', hi: 'एक वर्ष में तिथियों की संख्या' }], correctAnswer: 1, explanation: { en: '108 = 27 nakshatras × 4 padas = 12 signs × 9 navamshas. Each pada IS a navamsha. This is why 108 appears everywhere in Hindu tradition: 108 beads in a mala, 108 Upanishads, 108 names of deities. The astronomical origin is this zodiacal factorization.', hi: '108 = 27 × 4 = 12 × 9। प्रत्येक पाद एक नवांश है। 108 की माला, 108 उपनिषद, 108 नाम — मूल यह राशिचक्रीय गुणनखंड है।' } },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 360° Circle — Why 360?</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In Module 1.1, we learned that the ecliptic is a great circle — the Sun's apparent annual path through the sky. Now we need to measure positions along this circle. The ancient world settled on dividing the circle into <span className="text-gold-light font-bold">360 degrees</span> (अंश, Amsha).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Why 360? Because it's extraordinarily divisible. 360 has 24 divisors: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360. This makes it easy to divide the sky into equal parts. The Babylonians may have originated this choice (their year was ~360 days), but Indian astronomers adopted and perfected it.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each degree is further divided into <span className="text-gold-light">60 arcminutes</span> (called <span className="text-gold-light font-bold">Kala</span>, कला in Sanskrit) and each arcminute into <span className="text-gold-light">60 arcseconds</span> (<span className="text-gold-light font-bold">Vikala</span>, विकला). This sexagesimal (base-60) subdivision is shared between Indian and Mesopotamian astronomy.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Surya Siddhanta (Ch.1) defines the Bhachakra (भचक्र) — the "star circle" or zodiac — as a 360° circle centered on the ecliptic. The term <span className="text-gold-light font-bold">Amsha</span> (अंश) means "part" or "degree" — literally a 1/360th part of the circle. Parashara (BPHS Ch.1) opens with: <em>"The zodiac comprises 360 degrees, 12 signs of 30° each, and 27 nakshatras..."</em> — establishing both coordinate grids in the very first chapter.
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Dual Grid — Signs AND Nakshatras</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Here is the key insight that distinguishes Indian astronomy: the same 360° ecliptic circle is measured by <span className="text-gold-light font-bold">two overlapping grids simultaneously</span>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
            <div className="text-amber-400 font-bold text-sm mb-2">Solar Grid: 12 Rashis</div>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">360° ÷ 12 = <span className="text-gold-light font-bold">30° per sign</span></p>
            <p className="text-text-secondary text-xs">Based on the Sun's monthly movement (~1° per day × ~30 days = ~30°). The Sun spends approximately one month in each sign. This is the <span className="text-gold-light">solar</span> measurement.</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold text-sm mb-2">Lunar Grid: 27 Nakshatras</div>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">360° ÷ 27 = <span className="text-gold-light font-bold">13°20' per nakshatra</span></p>
            <p className="text-text-secondary text-xs">Based on the Moon's daily movement (~13° per day). The Moon spends approximately one day in each nakshatra. This is the <span className="text-gold-light">lunar</span> measurement.</p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This is NOT arbitrary. The Sun moves ~1°/day, so it crosses 30° in ~30 days (one month). The Moon moves ~13°/day, so it crosses 13°20' in ~1 day. The solar grid (Rashis) divides the year into 12 months. The lunar grid (Nakshatras) divides the month into 27 days. Together, they form the <span className="text-gold-light font-bold">Panchanga</span> — the complete measurement of celestial time.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Sacred Number 108 — Where Signs Meet Nakshatras</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each nakshatra is divided into 4 <span className="text-gold-light font-bold">Padas</span> (पाद, quarters) of 3°20' each. Total padas: 27 × 4 = <span className="text-gold-light font-bold">108</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each sign contains 9 navamshas (sub-divisions of 3°20' each). Total navamshas: 12 × 9 = <span className="text-gold-light font-bold">108</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This is not a coincidence — <span className="text-gold-light">one pada IS one navamsha</span>. The LCM of 12 and 27 is 108, and this mathematical convergence is why the number 108 pervades Hindu culture: 108 beads in a japa mala, 108 Upanishads, 108 names of each deity. The astronomical origin is this elegant factorization of the zodiac.
        </p>

        {/* Conversion formulas */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/10 mb-4">
          <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">Conversion Formulas</h4>
          <div className="font-mono text-xs space-y-2 text-emerald-300">
            <div>Sign number = floor(longitude / 30) + 1 <span className="text-text-tertiary">// 1=Aries, 12=Pisces</span></div>
            <div>Degree in sign = longitude mod 30 <span className="text-text-tertiary">// 0-29.99°</span></div>
            <div>Nakshatra = floor(longitude / 13.333) + 1 <span className="text-text-tertiary">// 1=Ashwini, 27=Revati</span></div>
            <div>Pada = floor((longitude mod 13.333) / 3.333) + 1 <span className="text-text-tertiary">// 1-4</span></div>
            <div>Navamsha sign = ((element × 9 + pada_in_nak) mod 12) + 1 <span className="text-text-tertiary">// D9 sign</span></div>
          </div>
        </div>
      </section>

      {/* Worked examples */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <div className="space-y-4">
          <div>
            <p className="text-gold-light text-sm font-medium mb-1">Example 1: Moon at 247.5° sidereal</p>
            <div className="text-text-secondary text-xs leading-relaxed font-mono space-y-1">
              <div>Sign = floor(247.5 / 30) + 1 = floor(8.25) + 1 = 8 + 1 = <span className="text-gold-light font-bold">9 = Sagittarius (धनु)</span></div>
              <div>Degree in sign = 247.5 mod 30 = <span className="text-gold-light">7.5° Sagittarius</span></div>
              <div>Nakshatra = floor(247.5 / 13.333) + 1 = floor(18.56) + 1 = <span className="text-gold-light font-bold">19 = Moola (मूल)</span></div>
              <div>Pada = floor((247.5 mod 13.333) / 3.333) + 1 = floor(7.5 / 3.333) + 1 = floor(2.25) + 1 = <span className="text-gold-light font-bold">Pada 3</span></div>
            </div>
          </div>
          <div>
            <p className="text-gold-light text-sm font-medium mb-1">Example 2: Mars at 125° sidereal</p>
            <div className="text-text-secondary text-xs leading-relaxed font-mono space-y-1">
              <div>Sign = floor(125/30) + 1 = 4 + 1 = <span className="text-gold-light font-bold">5 = Leo (सिंह)</span></div>
              <div>Degree = 125 mod 30 = <span className="text-gold-light">5° Leo</span></div>
              <div>Nakshatra = floor(125/13.333) + 1 = 9 + 1 = <span className="text-gold-light font-bold">10 = Magha (मघा)</span></div>
              <div>Pada = floor((125 mod 13.333)/3.333) + 1 = <span className="text-gold-light font-bold">Pada 2</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-Nakshatra misalignment */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Why Boundaries Don't Align</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A critical subtlety: 30° (sign) and 13°20' (nakshatra) do NOT divide evenly into each other. 30 ÷ 13.333 = 2.25, meaning <span className="text-gold-light font-bold">2¼ nakshatras fit in each sign</span>. This means nakshatra boundaries do not align with sign boundaries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For example: Ashwini nakshatra spans 0° to 13°20' — entirely within Aries (0°-30°). Bharani spans 13°20' to 26°40' — also in Aries. But Krittika spans 26°40' to 40° — starting in Aries and ending in Taurus! This cross-sign spanning is not a bug — it's a feature. It creates a richer, more nuanced coordinate system than either grid alone.
        </p>
      </section>

      {/* Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Signs correspond to constellations."<br />
          <span className="text-emerald-300">Reality:</span> Signs are equal 30° mathematical divisions. Constellations (physical star patterns) have wildly unequal spans — Virgo covers ~44° while Cancer covers only ~20°. Jyotish uses signs, not constellations.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "There are 28 nakshatras, not 27."<br />
          <span className="text-emerald-300">Reality:</span> The standard system uses 27. Abhijit (a portion between Uttara Ashadha and Shravana) is sometimes used as the 28th for muhurta purposes, but NOT for standard Jyotish calculations. Adding it would break the 13°20' equal division.</p>
        </div>
      </section>

      {/* Modern relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully valid.</span> The degree system, sign divisions, and nakshatra divisions are mathematical constructs — they don't depend on physical accuracy. Our app computes planetary longitudes to 0.01° precision using Meeus algorithms, then maps them to signs and nakshatras using exactly these formulas. The 108 pada/navamsha system underpins the entire divisional chart (varga) engine.
        </p>
      </section>
    </div>
  );
}

export default function Module1_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

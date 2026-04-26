'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/1-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';

const META: ModuleMeta = {
  id: 'mod_1_2',
  phase: 1,
  topic: 'Foundations',
  moduleNumber: '1.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 13,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'The zodiac is divided two ways: 12 signs of 30 degrees each AND 27 nakshatras of 13°20\' each — both systems are used simultaneously.',
          'This dual coordinate system is unique to Vedic astrology and enables more precise analysis than signs alone.',
        ]}
        locale={locale}
      />
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

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Surya Siddhanta (Ch.1) defines the Bhachakra (भचक्र) — the "star circle" or zodiac — as a 360° circle centered on the ecliptic. The term <span className="text-gold-light font-bold">Amsha</span> (अंश) means "part" or "degree" — literally a 1/360th part of the circle. Parashara (BPHS Ch.1) opens with: <em>"The zodiac comprises 360 degrees, 12 signs of 30° each, and 27 nakshatras..."</em> — establishing both coordinate grids in the very first chapter.
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Dual Grid — Signs AND Nakshatras</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Here is the key insight that distinguishes Indian astronomy: the same 360° ecliptic circle is measured by <span className="text-gold-light font-bold">two overlapping grids simultaneously</span>:
        </p>
        <div className="flex flex-wrap gap-3 my-2">
          <BeginnerNote term="Sidereal vs Tropical" explanation="Sidereal = anchored to fixed stars (used in Jyotish). Tropical = anchored to the spring equinox (used in Western astrology). They drift apart by ~1 degree every 72 years." />
          <BeginnerNote term="Precession" explanation="Earth's axis slowly wobbles like a spinning top, completing one full cycle every ~25,772 years. This causes the sidereal and tropical zodiacs to diverge over time." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
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
        <WhyItMatters locale={locale}>This dual coordinate system — signs AND nakshatras measured simultaneously — is unique to Vedic astrology and is what gives it finer resolution than any other astrological tradition.</WhyItMatters>
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
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-4">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Conversion Formulas</h4>
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
      <ExampleChart
        ascendant={9}
        planets={{ 1: [1], 5: [2] }}
        title="Moon at 247.5° (Sagittarius) & Mars at 125° (Leo)"
        highlight={[1, 5]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
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
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Signs correspond to constellations."<br />
          <span className="text-emerald-300">Reality:</span> Signs are equal 30° mathematical divisions. Constellations (physical star patterns) have wildly unequal spans — Virgo covers ~44° while Cancer covers only ~20°. Jyotish uses signs, not constellations.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "There are 28 nakshatras, not 27."<br />
          <span className="text-emerald-300">Reality:</span> The standard system uses 27. Abhijit (a portion between Uttara Ashadha and Shravana) is sometimes used as the 28th for muhurta purposes, but NOT for standard Jyotish calculations. Adding it would break the 13°20' equal division.</p>
        </div>
      </section>

      {/* Modern relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
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

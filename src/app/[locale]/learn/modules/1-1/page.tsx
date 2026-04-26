'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/1-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';

const META: ModuleMeta = {
  id: 'mod_1_1',
  phase: 1,
  topic: 'Foundations',
  moduleNumber: '1.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
        points={[
          'The ecliptic is the Sun\'s apparent path through the sky — it\'s the "stage" on which all Jyotish calculations happen.',
          'All planets, signs, and nakshatras are measured along this single 360-degree circle.',
        ]}
        locale={locale}
      />
      {/* 1. Conceptual Introduction */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>What Did Ancient Indians See?</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Imagine standing in an open field in ancient Bharatavarsha, 3,000 years ago. No light pollution, no buildings — just the immense dome of the night sky. You see thousands of stars, apparently fixed in their positions night after night, slowly wheeling around the sky as the night progresses.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          But if you watch carefully over weeks and months, you notice something extraordinary: a handful of "stars" — five of them, plus the Sun and Moon — <span className="text-gold-light font-medium">move</span> against this fixed backdrop. They wander through the star field, sometimes speeding up, sometimes slowing down, and occasionally even appearing to move <span className="text-gold-light font-medium">backward</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The ancient Sanskrit word for these wanderers is <span className="text-gold-light font-bold">Graha</span> (ग्रह) — literally "that which grasps or seizes." Not just "planet" — a Graha <em>seizes</em> your fate. This is not casual naming. The Greeks called them "planetes" (πλανήτης) — "wanderers." The Indian term is more active, more intentional. A Graha doesn't just wander — it <em>acts on you</em>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          But here's the critical observation that underpins ALL of Jyotish: these Grahas don't wander randomly across the entire sky. They are confined to a <span className="text-gold-light font-medium">narrow belt</span> — a highway approximately 16° wide. This belt is defined by the <span className="text-gold-light font-bold">ecliptic</span>, and understanding it is the absolute first step in learning Jyotish.
        </p>
        <div className="flex flex-wrap gap-3 my-2">
          <BeginnerNote term="Ecliptic" explanation="The Sun's apparent path across the sky over one year — a great circle tilted 23.5 degrees from the celestial equator. All planets stay within about 8 degrees of this line." />
          <BeginnerNote term="Celestial sphere" explanation="An imaginary sphere surrounding Earth onto which all stars and planets appear projected — the 'dome' of the sky that ancient observers used as their coordinate system." />
        </div>
        <WhyItMatters locale={locale}>The ecliptic is the stage on which all planetary drama plays out. Every calculation in Jyotish — every sign, every nakshatra, every dasha — starts here.</WhyItMatters>
      </section>

      {/* 2. Classical Origin */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The ecliptic is called <span className="text-gold-light font-bold">Kranti-vritta</span> (क्रान्तिवृत्त) in Sanskrit — <em>Kranti</em> means inclination or declination, <em>Vritta</em> means circle. The "circle of inclination" — named for its 23.5° tilt relative to the celestial equator.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The <span className="text-gold-light">Surya Siddhanta</span> (Chapter 1) opens with the concept of the Bhagola (sphere of stars) and the Kranti-vritta within it. The <span className="text-gold-light">Aryabhatiya</span> (499 CE) refined the measurement, and Aryabhata correctly stated that the apparent motion of stars is due to Earth's rotation — a millennium before Copernicus.
        </p>
        <p className="text-text-secondary text-xs text-text-tertiary">
          The celestial sphere itself is called <span className="text-gold-light">Khagola</span> (खगोल) — Kha = sky/space, Gola = sphere. The word "Khagol-shastra" (खगोलशास्त्र) — the science of the celestial sphere — is the Sanskrit term for astronomy.
        </p>
      </section>

      <QuickCheck
        question="What is the ecliptic?"
        options={["The Moon's orbit around Earth", "The Sun's apparent annual path through the sky", 'The boundary between constellations', "Earth's equator projected onto the sky"]}
        correctIndex={1}
        explanation="The ecliptic is the Sun's apparent path — really Earth's orbital plane projected onto the celestial sphere. All planets stay within about 8 degrees of this line."
      />
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* 3. Detailed Explanation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Ecliptic — Earth's Orbital Plane Projected Onto the Sky</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The ecliptic is the <span className="text-gold-light font-medium">apparent path of the Sun</span> across the sky over the course of one year. "Apparent" because it's actually Earth that moves — we orbit the Sun, and from our perspective, the Sun appears to travel through the background stars, completing one full circuit in ~365.25 days.
        </p>

        {/* Diagram: Ecliptic vs Equator */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-4">
          <svg viewBox="0 0 500 280" className="w-full max-w-lg mx-auto">
            {/* Celestial equator */}
            <ellipse cx="250" cy="140" rx="220" ry="60" fill="none" stroke="#4a9eff" strokeWidth="1.5" opacity="0.4" />
            <text x="470" y="145" fill="#4a9eff" fontSize="9" textAnchor="end">Celestial Equator</text>

            {/* Ecliptic - tilted */}
            <ellipse cx="250" cy="140" rx="220" ry="60" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.6"
              transform="rotate(-23.5, 250, 140)" />
            <text x="420" y="60" fill="#f0d48a" fontSize="9">Ecliptic (Kranti-vritta)</text>

            {/* Tilt angle */}
            <line x1="250" y1="140" x2="250" y2="80" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <line x1="250" y1="140" x2="270" y2="85" stroke="#f0d48a" strokeWidth="0.5" opacity="0.5" />
            <path d="M 250 100 Q 255 95 260 92" fill="none" stroke="#ff6b6b" strokeWidth="0.8" />
            <text x="265" y="100" fill="#ff6b6b" fontSize="8">23.5°</text>

            {/* Equinox points */}
            <circle cx="470" cy="140" r="4" fill="#2ecc71" />
            <text x="470" y="130" textAnchor="middle" fill="#2ecc71" fontSize="7">Vernal Equinox</text>
            <circle cx="30" cy="140" r="4" fill="#e74c3c" />
            <text x="30" y="130" textAnchor="middle" fill="#e74c3c" fontSize="7">Autumnal Equinox</text>

            {/* Sun on ecliptic */}
            <circle cx="380" cy="95" r="8" fill="#e67e22" opacity="0.8" />
            <text x="380" y="85" textAnchor="middle" fill="#e67e22" fontSize="7">Sun</text>

            {/* Zodiac belt */}
            <text x="250" y="220" textAnchor="middle" fill="#f0d48a" fontSize="8" opacity="0.4">← 16° wide zodiac belt →</text>

            {/* Planet dots near ecliptic */}
            <circle cx="150" cy="155" r="3" fill="#e74c3c" opacity="0.7" /><text x="160" y="160" fill="#e74c3c" fontSize="6">Mars</text>
            <circle cx="300" cy="108" r="3" fill="#f39c12" opacity="0.7" /><text x="310" y="113" fill="#f39c12" fontSize="6">Jupiter</text>
          </svg>
          <p className="text-text-tertiary text-xs text-center mt-1">The ecliptic (gold) tilted 23.5° from the celestial equator (blue). Planets stay within ~8° of the ecliptic.</p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Why 23.5°?</span> Earth's axis of rotation is tilted 23.5° relative to its orbital plane. This means the plane of Earth's orbit (projected onto the sky as the ecliptic) is tilted 23.5° from the celestial equator (the projection of Earth's equator). This tilt is called the <span className="text-gold-light">obliquity of the ecliptic</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">The consequences are profound:</span>
        </p>
        <ul className="text-text-secondary text-sm space-y-1.5 ml-4">
          <li>• <span className="text-gold-light">Seasons</span> — Different hemispheres receive different amounts of sunlight throughout the year</li>
          <li>• <span className="text-gold-light">Uttarayana & Dakshinayana</span> — The Sun's apparent northward and southward journeys, which define the Hindu year's two halves</li>
          <li>• <span className="text-gold-light">Precession</span> — The 23.5° tilt slowly wobbles over 25,772 years, causing the Ayanamsha to change</li>
          <li>• <span className="text-gold-light">Variable day length</span> — Dinamana (day duration) changes throughout the year, affecting muhurta calculations</li>
        </ul>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      {/* The Zodiac Belt */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Zodiac Belt — A 16° Highway in the Sky</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The solar system formed from a flat rotating disk of gas and dust about 4.6 billion years ago. Because of this common origin, all planets orbit the Sun in approximately the same plane — deviating at most 7° from the ecliptic (Mercury has the highest inclination at 7°, most others are within 2-3°).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This means that from Earth's perspective, all planets are confined to a band about <span className="text-gold-light font-bold">8° on either side of the ecliptic</span> — a 16°-wide belt. This belt is the <span className="text-gold-light font-bold">zodiac</span> (राशिचक्र, Rashi-chakra). Every planet, the Sun, and the Moon are ALWAYS found within this belt. You will never see Mars in Ursa Major or Jupiter near Polaris — they are physically constrained to the zodiac highway.
        </p>
      </section>

      {/* 5. Worked Examples */}
      <ExampleChart
        ascendant={1}
        planets={{ 1: [2], 4: [1], 10: [0] }}
        title="Ecliptic Demonstration — Sun, Moon & Mars Positions"
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>

        <div className="space-y-4">
          <div>
            <p className="text-gold-light text-sm font-medium mb-1">Example 1: Where is the Sun in April?</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              In mid-April, the Sun is at roughly 0° sidereal Aries (after subtracting the ~24° ayanamsha from its tropical position of ~24° Aries). The Sun rises in the east, crosses overhead, and sets in the west — but against the background stars, it's positioned among the stars of the constellation Pisces/Aries (remember, constellations and signs are offset by the ayanamsha). At dawn and dusk, the zodiacal constellations adjacent to the Sun's position are visible.
            </p>
          </div>

          <div>
            <p className="text-gold-light text-sm font-medium mb-1">Example 2: Why can't a planet be in Ursa Major?</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              Ursa Major (Saptarishi Mandal/सप्तर्षि मंडल) is located at about +55° to +65° declination — roughly 60° north of the ecliptic. Since planets never deviate more than ~8° from the ecliptic, they physically cannot appear there. If someone claims to have seen Venus "in the Big Dipper," they've either misidentified the star or the constellation. This is a fundamental constraint that ancient astronomers understood perfectly.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Common Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Planets move across the entire sky."<br />
          <span className="text-emerald-300">Reality:</span> Planets are confined to the ~16° zodiac belt. They NEVER appear more than ~8° from the ecliptic.</p>

          <p><span className="text-red-300 font-bold">Misconception:</span> "Seasons are caused by Earth being closer to the Sun in summer."<br />
          <span className="text-emerald-300">Reality:</span> Earth is actually closest to the Sun in January (northern winter)! Seasons are caused by the 23.5° axial tilt.</p>

          <p><span className="text-red-300 font-bold">Misconception:</span> "The ecliptic was discovered by the Greeks."<br />
          <span className="text-emerald-300">Reality:</span> The ecliptic (Kranti-vritta) was independently described in the Surya Siddhanta and Vedanga Jyotisha, predating or contemporaneous with Greek sources.</p>
        </div>
      </section>

      {/* 7. Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">Still completely valid.</span> The ecliptic is a fundamental astronomical concept used by NASA, ESA, and every space agency. The obliquity of 23.5° is measured with sub-arcsecond precision by modern instruments. The Surya Siddhanta's description of the ecliptic is physically correct — only its precession model (trepidation instead of steady precession) was incorrect.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app uses the ecliptic as the foundation for ALL calculations. When we compute the Sun's longitude, Moon's longitude, or any planet's position, we're computing their position <em>along the ecliptic</em>. The 360° circle of Jyotish IS the ecliptic circle, divided into 12 Rashis of 30° each and 27 Nakshatras of 13°20' each.
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module1_1Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/1-3.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';

const META: ModuleMeta = {
  id: 'mod_1_3',
  phase: 1,
  topic: 'Foundations',
  moduleNumber: '1.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
          'Stars are fixed reference points while planets move — the 27 nakshatras are named after fixed star groups that mark the Moon\'s nightly journey.',
          'The sidereal zodiac used in Jyotish is anchored to these fixed stars, unlike the tropical zodiac used in Western astrology.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Sky as a Stage — Two Types of Actors</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Look up at the night sky and you see two fundamentally different types of objects. First, the <span className="text-gold-light font-bold">fixed stars</span> (Tara, तारा) — thousands of points of light that maintain their relative positions night after night, year after year, century after century. The Big Dipper (Saptarishi) looked essentially the same to your ancestors 5,000 years ago. These are the <span className="text-gold-light">backdrop</span> — the stage set that doesn't change.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Second, the <span className="text-gold-light font-bold">Grahas</span> — the seven "wanderers" (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) plus the two shadow points (Rahu, Ketu). These move against the fixed star backdrop, each at its own speed: the Moon races through ~13° per day, Saturn crawls at ~0.03° per day. These are the <span className="text-gold-light">actors</span> performing on the stage.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Jyotish is fundamentally about the <span className="text-gold-light font-bold">relationship between the moving actors and the fixed stage</span>. The Nakshatra system is how ancient Indians <em>labeled</em> the stage — dividing it into 27 marked sections so they could precisely describe where each actor was at any given moment.
        </p>
        <div className="flex flex-wrap gap-3 my-2">
          <BeginnerNote term="Nakshatra" explanation="A lunar mansion — one of 27 equal divisions of the ecliptic, each spanning 13 degrees 20 minutes. Named after prominent fixed star groups." />
          <BeginnerNote term="Yogtara" explanation="The 'junction star' — the brightest or most prominent star that identifies each nakshatra. Example: Aldebaran is the yogtara of Rohini." />
        </div>
        <WhyItMatters locale={locale}>The fixed stars are the reference frame that makes the sidereal zodiac possible. Without them, there would be no way to anchor the zodiac to actual positions in the sky.</WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          The word <span className="text-gold-light font-bold">Nakshatra</span> (नक्षत्र) is debated etymologically: some derive it from <em>naksha</em> (नक्ष, to approach) + <em>tra</em> (त्र, protector) = "that which approaches and protects." Others from <em>na</em> (न, not) + <em>kshatra</em> (क्षत्र, destructible) = "indestructible" — referring to the fixed stars' permanence. The Rig Veda (one of the oldest texts in any language) mentions nakshatras, placing their use at least 3,500 years ago. The Vedanga Jyotisha (~1200 BCE) gives the earliest systematic nakshatra list.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Each nakshatra is identified by a <span className="text-gold-light font-bold">Yogtara</span> (योगतारा) — a "junction star" or "identifying star." This is the brightest or most prominent star within that nakshatra's span. The Surya Siddhanta (Ch.8) gives the celestial coordinates of all 27 yogtaras, enabling precise identification thousands of years later.
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 27 Yogtaras — India's Star Catalog</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The identification of specific stars with specific nakshatras is one of India's great astronomical achievements. Here are some key yogtara identifications that connect the ancient Sanskrit names to modern stellar catalogs:
        </p>

        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Nakshatra</th>
              <th className="text-left py-2 px-2 text-gold-dark">Sanskrit</th>
              <th className="text-left py-2 px-2 text-gold-dark">Yogtara (Modern)</th>
              <th className="text-left py-2 px-2 text-gold-dark">Magnitude</th>
              <th className="text-left py-2 px-2 text-gold-dark">Significance</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { nak: 'Ashwini', sa: 'अश्विनी', star: 'β Arietis (Sheratan)', mag: '2.6', sig: 'First nakshatra — beginning of the zodiac' },
                { nak: 'Rohini', sa: 'रोहिणी', star: 'Aldebaran (α Tauri)', mag: '0.85', sig: 'Red giant — name means "red/reddish"' },
                { nak: 'Ardra', sa: 'आर्द्रा', star: 'Betelgeuse (α Orionis)', mag: '0.42', sig: 'Red supergiant, one of largest known stars' },
                { nak: 'Pushya', sa: 'पुष्य', star: 'δ Cancri (Asellus Australis)', mag: '3.9', sig: 'Most auspicious nakshatra for muhurta' },
                { nak: 'Magha', sa: 'मघा', star: 'Regulus (α Leonis)', mag: '1.35', sig: '"The great one" — royal star' },
                { nak: 'Chitra', sa: 'चित्रा', star: 'Spica (α Virginis)', mag: '0.97', sig: 'ANCHORS the Lahiri ayanamsha at 180°' },
                { nak: 'Swati', sa: 'स्वाति', star: 'Arcturus (α Boötis)', mag: '-0.05', sig: '4th brightest star in the sky' },
                { nak: 'Jyeshtha', sa: 'ज्येष्ठा', star: 'Antares (α Scorpii)', mag: '1.06', sig: 'Red supergiant — "rival of Mars" in color' },
                { nak: 'Shravana', sa: 'श्रवण', star: 'Altair (α Aquilae)', mag: '0.77', sig: '"The listener" — associated with learning' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-medium">{row.nak}</td>
                  <td className="py-1.5 px-2 text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.sa}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.star}</td>
                  <td className="py-1.5 px-2 text-text-secondary font-mono">{row.mag}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Signs ≠ Constellations — A Critical Distinction</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          One of the most common sources of confusion in astrology — and one that Jyotish handles better than Western astrology — is the <span className="text-gold-light font-bold">difference between signs and constellations</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Constellations</span> (Tara Mandal, तारा मण्डल) are physical groupings of stars in the sky. They have <span className="text-red-400">irregular, unequal sizes</span>. The International Astronomical Union (IAU) defines 88 constellations with precise boundaries — and along the ecliptic, the constellation sizes vary wildly: Virgo spans ~44°, Scorpius only ~7° of ecliptic longitude, and there's even a 13th constellation (Ophiuchus) that the ecliptic passes through.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Signs</span> (Rashi, राशि) are <span className="text-emerald-400">equal 30° mathematical divisions</span>. They are a coordinate system, not a physical entity. Think of longitude lines on Earth — they don't correspond to physical features, they're a grid system for specifying location. Similarly, when we say "Jupiter is in Leo," we mean Jupiter is in the 5th 30° sector of the ecliptic — regardless of where the physical constellation Leo's stars are.
        </p>
      </section>

      <ExampleChart
        ascendant={6}
        planets={{ 1: [3] }}
        title="Planet at 175° — Virgo 25° (Chitra Nakshatra)"
        highlight={[1]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: The Zodiacal Position Problem</h4>
        <div className="space-y-3">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">Scenario:</span> A planet is at 175° sidereal longitude. Where is it?
          </p>
          <div className="font-mono text-xs text-emerald-300 space-y-1">
            <div>Sign = floor(175/30) + 1 = floor(5.833) + 1 = 5 + 1 = <span className="text-gold-light font-bold">6 = Virgo (Kanya)</span></div>
            <div>Position in sign = 175 mod 30 = <span className="text-gold-light">25°</span> Virgo</div>
            <div>Nakshatra = floor(175/13.333) + 1 = floor(13.125) + 1 = <span className="text-gold-light font-bold">14 = Chitra</span></div>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Now, the physical star Spica (Chitra yogtara) is at exactly 180° sidereal by definition (Lahiri). Our planet at 175° is 5° before Spica — it's approaching the Chitra yogtara. This is a case where the mathematical system and the physical stars agree beautifully.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "There should be 13 signs because the Sun passes through Ophiuchus."<br />
          <span className="text-emerald-300">Reality:</span> Signs are 30° mathematical sectors, not constellation boundaries. Ophiuchus is a constellation, not a sign. Adding it would break the 12 × 30° = 360° framework. This "13th sign" claim misunderstands what signs ARE.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Nakshatras are Indian constellations."<br />
          <span className="text-emerald-300">Reality:</span> Nakshatras are EQUAL 13°20' sectors — not constellations. Each is identified by a yogtara, but the nakshatra's span is mathematical, not defined by the physical star pattern's extent.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Fixed stars don't move at all."<br />
          <span className="text-emerald-300">Reality:</span> Stars have "proper motion" — they do move, but so slowly that it takes thousands of years to be noticeable. Barnard's Star (fastest proper motion) moves 10.3" per year. For practical Jyotish, stars are effectively fixed over human timescales.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">The sign system is fully valid</span> — it's a mathematical coordinate system, and math doesn't expire. The yogtara identifications are <span className="text-blue-300 font-bold">mostly valid</span> — a few identifications are debated (especially for faint nakshatras like Anuradha and Dhanishtha), but the major ones (Rohini=Aldebaran, Chitra=Spica, Magha=Regulus, Jyeshtha=Antares) are certain.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our app uses Swiss Ephemeris / Meeus algorithms for planet positions, but the coordinate mapping (degree → sign, degree → nakshatra) uses exactly the ancient formulas: <code className="text-emerald-300">sign = floor(longitude/30) + 1</code>.
        </p>
      </section>
    </div>
  );
}

export default function Module1_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

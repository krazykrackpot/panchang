'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/2-4.json';

const META: ModuleMeta = {
  id: 'mod_2_4',
  phase: 1,
  topic: 'Grahas',
  moduleNumber: '2.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Retrograde Motion (Vakri Gati) — The Great Illusion</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Vakri</span> (वक्री) means "crooked" or "curved." When a planet is Vakri, it appears to move <span className="text-gold-light">backward</span> (from east to west) against the background stars, instead of its normal west-to-east motion. This is entirely an <span className="text-gold-light font-bold">optical illusion</span> caused by the relative orbital speeds of Earth and the planet.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-medium">The highway analogy:</span> Imagine you're driving on a highway and passing a slower car. As you pull alongside and overtake it, the slower car seems to move <em>backward</em> relative to the distant hills — even though it's still moving forward. This is exactly what happens when Earth overtakes Mars, Jupiter, or Saturn in their orbits.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          For <span className="text-gold-light">inner planets</span> (Mercury, Venus), retrograde happens when THEY overtake Earth from our perspective — they swing between us and the Sun, appearing to reverse direction.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Surya Siddhanta describes retrograde motion as part of the Sighra correction (Ch.2) — the difference between a planet's mean position and its true position as seen from Earth. Ancient Indian astronomers understood this was an observational effect, not a real reversal. The term <span className="text-gold-light font-bold">Vakri</span> (crooked) itself implies something that appears bent from the observer's perspective, not truly reversed.
        </p>
      </section>

      {/* Retrograde frequency table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>How Often Each Planet Goes Retrograde</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-2 text-gold-dark">Frequency</th>
              <th className="text-left py-2 px-2 text-gold-dark">Duration</th>
              <th className="text-left py-2 px-2 text-gold-dark">% of Time Retrograde</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Mercury', freq: '~3 times/year', dur: '~3 weeks each', pct: '~19%' },
                { p: 'Venus', freq: '~every 18 months', dur: '~6 weeks', pct: '~7%' },
                { p: 'Mars', freq: '~every 26 months', dur: '~2.5 months', pct: '~9%' },
                { p: 'Jupiter', freq: '~once/year', dur: '~4 months', pct: '~30%' },
                { p: 'Saturn', freq: '~once/year', dur: '~4.5 months', pct: '~36%' },
                { p: 'Rahu/Ketu', freq: 'ALWAYS', dur: 'Permanent', pct: '100%' },
              ].map((r, i) => (
                <tr key={i}><td className="py-1.5 px-2 text-gold-light font-medium">{r.p}</td><td className="py-1.5 px-2 text-text-secondary">{r.freq}</td><td className="py-1.5 px-2 text-text-secondary">{r.dur}</td><td className="py-1.5 px-2 text-text-secondary font-mono">{r.pct}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-2">Sun and Moon NEVER go retrograde. Outer planets (Jupiter, Saturn) are retrograde ~1/3 of the time — so retrograde Jupiter/Saturn is very common, not alarming.</p>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Retrograde Paradox in Jyotish</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Here's the beautiful paradox: a retrograde planet is <span className="text-gold-light font-bold">closer to Earth</span> (and therefore brighter) than when it's in direct motion. Jyotish recognizes this by giving retrograde planets extra <span className="text-gold-light">Cheshta Bala</span> (motional strength in Shadbala).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          But the energy is <span className="text-gold-light font-bold">internalized</span>. A direct planet expresses outwardly; a retrograde planet expresses <em>inwardly</em>. Think of it as the difference between speaking your thoughts aloud (direct) versus deep internal reflection (retrograde). Neither is better — they're different modes of expression.
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Retrograde Effects Summary</div>
          <ul className="text-text-secondary text-xs space-y-1.5">
            <li>• <span className="text-gold-light">Retrograde Saturn:</span> Karmic lessons intensified but internalized. Delays become more pronounced. Discipline deepened.</li>
            <li>• <span className="text-gold-light">Retrograde Jupiter:</span> Wisdom directed inward — philosophical, less social. May struggle with conventional education but excels at self-study.</li>
            <li>• <span className="text-gold-light">Retrograde Mars:</span> Courage internalized — less aggressive externally, but immense inner drive. May suppress anger.</li>
            <li>• <span className="text-gold-light">Retrograde Mercury:</span> Famous for communication mix-ups in pop astrology. In Jyotish: deeper thinking, may revisit old ideas, unconventional communication style.</li>
            <li>• <span className="text-gold-light">Retrograde Venus:</span> Love and relationships approached differently — unconventional partnerships, revisiting past relationships.</li>
          </ul>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Combustion (Asta) — Planets Burned by the Sun</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When a planet gets too close to the Sun, it becomes invisible — overwhelmed by the Sun's brightness. This is called <span className="text-gold-light font-bold">Asta</span> (अस्त, literally "setting" or "disappearing"). In Jyotish, a combust planet's significations are <span className="text-gold-light">weakened</span> — the Sun's ego/authority energy overshadows the planet's own expression.
        </p>

        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-4">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Combustion Orbs (BPHS Ch.3 v.42)</h4>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-2 text-gold-dark">Normal Orb</th>
              <th className="text-left py-2 px-2 text-gold-dark">Retrograde Orb</th>
              <th className="text-left py-2 px-2 text-gold-dark">Karakatva Impact</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Moon', normal: '12°', retro: 'N/A', impact: 'Mind, emotions, mother — weakened' },
                { p: 'Mars', normal: '17°', retro: '17°', impact: 'Courage, siblings, property — diminished' },
                { p: 'Mercury', normal: '14°', retro: '12°', impact: 'Intellect, speech, commerce — overshadowed' },
                { p: 'Jupiter', normal: '11°', retro: '11°', impact: 'Wisdom, children, dharma — suppressed' },
                { p: 'Venus', normal: '10°', retro: '8°', impact: 'Marriage, arts, luxury — reduced' },
                { p: 'Saturn', normal: '15°', retro: '15°', impact: 'Longevity, karma, servants — afflicted' },
              ].map((r, i) => (
                <tr key={i}><td className="py-1.5 px-2 text-gold-light font-bold">{r.p}</td><td className="py-1.5 px-2 text-text-secondary">{r.normal}</td><td className="py-1.5 px-2 text-text-secondary">{r.retro}</td><td className="py-1.5 px-2 text-text-secondary">{r.impact}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Planetary War (Graha Yuddha)</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When two true planets (Mars, Mercury, Jupiter, Venus, Saturn) are within <span className="text-gold-light font-bold">1° of each other</span>, they are in <span className="text-gold-light font-bold">Graha Yuddha</span> (ग्रह युद्ध, planetary war). The planet with <span className="text-gold-light">higher northern latitude</span> (closer to the north celestial pole) is the <span className="text-emerald-400">winner</span>; the other is the <span className="text-red-400">loser</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The winner's significations are strengthened by the conquest; the loser's are damaged. If the loser rules important houses in your chart, those life areas may suffer during the period when this war occurred or when dashas activate those planets.
        </p>
        <p className="text-text-secondary text-xs text-text-tertiary">
          Note: Sun, Moon, Rahu, and Ketu do NOT participate in Graha Yuddha. Sun is too powerful to "war" (conjunction with Sun = combustion instead). Moon, Rahu, Ketu have different interaction dynamics.
        </p>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 2: [0, 3], 9: [2, 4] }}
        title="Mercury Combust (near Sun) + Mars-Jupiter War"
        highlight={[2, 9]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <div>
            <p className="text-gold-light font-medium mb-1">Example 1: Is Mercury combust?</p>
            <p>Sun at 45° sidereal, Mercury at 37° sidereal. Distance = |45 - 37| = 8°. Mercury's combustion orb = 14°. Since 8° &lt; 14°, Mercury IS combust. Impact: native's intellect, speech, and commercial abilities may be overshadowed by ego/authority issues.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium mb-1">Example 2: Are Mars and Jupiter at war?</p>
            <p>Mars at 120.3°, Jupiter at 120.8°. Distance = |120.8 - 120.3| = 0.5° &lt; 1° → YES, Graha Yuddha! The planet with higher celestial latitude wins. If Jupiter has +1.2° latitude and Mars +0.8°, Jupiter wins → Jupiter strengthened, Mars weakened.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Mercury retrograde ruins everything."<br />
          <span className="text-emerald-300">Reality:</span> This is pop astrology exaggeration. Mercury is retrograde ~19% of the time — that's ~70 days per year. If it truly "ruined everything," 1/5th of all days would be catastrophic. In Jyotish, retrograde Mercury simply indicates a different communication style — more reflective, less spontaneous.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Combust planets become completely useless."<br />
          <span className="text-emerald-300">Reality:</span> Combustion weakens but doesn't eliminate. Mercury is always near the Sun (never more than 28° away), so it's frequently combust — yet Mercury-ruled individuals (Gemini/Virgo Lagna) still thrive. Context matters.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Astronomically correct.</span> Retrograde, combustion, and planetary conjunctions are all real, observable phenomena. Our app tracks retrograde status for all planets and displays it on the Panchang and Transit Calendar pages. The combustion orbs from BPHS correspond roughly to the angular distances at which planets become invisible to the naked eye — an observational fact.
        </p>
      </section>
    </div>
  );
}

export default function Module2_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

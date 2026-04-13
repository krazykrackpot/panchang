'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/2-2.json';

const META: ModuleMeta = {
  id: 'mod_2_2',
  phase: 1,
  topic: 'Grahas',
  moduleNumber: '2.2',
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Why Planets Have Relationships</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In Module 2.1, we learned each Graha's individual nature. But planets don't act in isolation — they interact. A planet's strength depends significantly on <span className="text-gold-light font-bold">whose sign it occupies</span>. Just as a person performs differently in a friend's house versus an enemy's territory, a planet's expression changes based on the sign lord's relationship with it.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Jyotish defines <span className="text-gold-light font-bold">two types</span> of planetary relationships:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
            <div className="text-amber-400 font-bold text-sm mb-1">Naisargika (Natural/Permanent)</div>
            <p className="text-text-secondary text-xs">Fixed relationships based on the planet's inherent nature. The Sun is ALWAYS a natural friend of Moon, regardless of the chart. These never change.</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold text-sm mb-1">Tatkalika (Temporary/Chart-specific)</div>
            <p className="text-text-secondary text-xs">Relationships based on where planets are placed in a specific chart. If Mars is in the 3rd house from Jupiter, Mars is Jupiter's temporary friend — but only in THIS chart.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin — Parashara's Derivation Method</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Parashara doesn't just LIST friends and enemies — he provides the <span className="text-gold-light">mathematical rule</span> for deriving them (BPHS Ch.3, v.55):
        </p>
        <div className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10 font-mono text-xs text-emerald-300 mb-3">
          <div>From a planet's MOOLATRIKONA sign:</div>
          <div>→ Lords of 2nd, 4th, 5th, 8th, 9th, 12th signs = <span className="text-gold-light">FRIENDS</span></div>
          <div>→ Remaining lords that are NOT friends = <span className="text-red-400">ENEMIES</span></div>
          <div>→ Neither friend nor enemy = <span className="text-amber-400">NEUTRAL</span></div>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Example for Sun:</span> Sun's moolatrikona is Leo (5th sign). From Leo: 2nd=Virgo (Mercury), 4th=Scorpio (Mars), 5th=Sagittarius (Jupiter), 8th=Pisces (Jupiter), 9th=Aries (Mars), 12th=Cancer (Moon). So Sun's friends = Moon, Mars, Jupiter. Mercury appears only once (2nd) — some texts count it as friend, others neutral. Saturn and Venus don't appear → enemies.
        </p>
      </section>

      {/* Full Natural Friendship Matrix */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Natural Friendship Matrix</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-1.5 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-1.5 text-emerald-400">Friends</th>
              <th className="text-left py-2 px-1.5 text-amber-400">Neutral</th>
              <th className="text-left py-2 px-1.5 text-red-400">Enemies</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Sun', f: 'Moon, Mars, Jupiter', n: 'Mercury', e: 'Venus, Saturn' },
                { p: 'Moon', f: 'Sun, Mercury', n: 'Mars, Jupiter, Venus, Saturn', e: '—' },
                { p: 'Mars', f: 'Sun, Moon, Jupiter', n: 'Venus, Saturn', e: 'Mercury' },
                { p: 'Mercury', f: 'Sun, Venus', n: 'Mars, Jupiter, Saturn', e: 'Moon' },
                { p: 'Jupiter', f: 'Sun, Moon, Mars', n: 'Saturn', e: 'Mercury, Venus' },
                { p: 'Venus', f: 'Mercury, Saturn', n: 'Mars, Jupiter', e: 'Sun, Moon' },
                { p: 'Saturn', f: 'Mercury, Venus', n: 'Jupiter', e: 'Sun, Moon, Mars' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="py-1.5 px-1.5 text-gold-light font-bold">{r.p}</td>
                  <td className="py-1.5 px-1.5 text-emerald-300">{r.f}</td>
                  <td className="py-1.5 px-1.5 text-amber-300">{r.n}</td>
                  <td className="py-1.5 px-1.5 text-red-300">{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-2">Note: Relationships are NOT always reciprocal. Sun considers Mercury neutral, but Mercury considers Sun a friend.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Temporary Friendship — Chart-Specific Dynamics</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          While natural friendships are universal, <span className="text-gold-light font-bold">temporary (Tatkalika) friendships</span> depend on the specific birth chart. The rule is simple:
        </p>
        <div className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10 font-mono text-xs mb-4">
          <div className="text-emerald-300">Planets in houses 2, 3, 4, 10, 11, 12 from a planet = <span className="text-gold-light">Temporary FRIEND</span></div>
          <div className="text-red-300">Planets in houses 1, 5, 6, 7, 8, 9 from a planet = <span className="text-gold-light">Temporary ENEMY</span></div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Think of it this way: planets "nearby" (2-4 houses away or 10-12 houses away) are like neighbors — they become temporary allies. Planets "across" the chart (5-9 houses away) are distant and become temporary rivals.
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 5-Level Compound (Panchda) System</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The final relationship between two planets in a chart combines natural + temporary:
        </p>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Natural</th>
              <th className="text-left py-2 px-2 text-gold-dark">Temporary</th>
              <th className="text-left py-2 px-2 text-gold-dark">Compound</th>
              <th className="text-left py-2 px-2 text-gold-dark">Dignity Effect</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              <tr><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-emerald-400 font-bold">Adhimitra (Great Friend)</td><td className="py-1.5 px-2 text-text-secondary">Very strong in this sign</td></tr>
              <tr><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-amber-300">Sama (Neutral)</td><td className="py-1.5 px-2 text-text-secondary">Average strength</td></tr>
              <tr><td className="py-1.5 px-2 text-amber-300">Neutral</td><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-emerald-300">Mitra (Friend)</td><td className="py-1.5 px-2 text-text-secondary">Good strength</td></tr>
              <tr><td className="py-1.5 px-2 text-amber-300">Neutral</td><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-red-300">Shatru (Enemy)</td><td className="py-1.5 px-2 text-text-secondary">Weakened</td></tr>
              <tr><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-emerald-300">Friend</td><td className="py-1.5 px-2 text-amber-300">Sama (Neutral)</td><td className="py-1.5 px-2 text-text-secondary">Conflict mitigated</td></tr>
              <tr><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-red-300">Enemy</td><td className="py-1.5 px-2 text-red-400 font-bold">Adhishatru (Great Enemy)</td><td className="py-1.5 px-2 text-text-secondary">Very weak in this sign</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 12: [5], 2: [2] }}
        title="Venus in Aries (12th), Mars in 2nd — Compound Friendship"
        highlight={[12, 2]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> In a chart, Venus is in Aries (Mars's sign), and Mars is in the 3rd house from Venus.
        </p>
        <div className="font-mono text-xs text-text-secondary space-y-1">
          <div>1. Natural relationship: Mars → Venus = <span className="text-amber-300">Neutral</span></div>
          <div>2. Temporary: Mars in 3rd from Venus = <span className="text-emerald-300">Temp Friend</span> (3rd is friendly house)</div>
          <div>3. Compound: Neutral + Temp Friend = <span className="text-emerald-400 font-bold">Mitra (Friend)</span></div>
          <div>4. Venus in Aries: Venus has <span className="text-emerald-300">Mitra Kshetra</span> dignity — decent strength</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "Planetary relationships are reciprocal — if A is B's friend, B must be A's friend."<br />
          <span className="text-emerald-300">Reality:</span> NOT always! Sun considers Mercury neutral, but Mercury considers Sun a FRIEND. This asymmetry is intentional and adds nuance.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Benefic planets are always friends with each other."<br />
          <span className="text-emerald-300">Reality:</span> Jupiter and Venus — both strong benefics — are ENEMIES. Their rivalry (Deva Guru vs Asura Guru) creates the Guru Chandal dynamic when they interact.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully used in modern Jyotish.</span> The friendship matrix is essential for computing planetary dignity (Module 2.3) and Shadbala. Our app's Vimshopaka Bala calculation uses compound relationships to determine dignity scores across all 16+ divisional charts. The mathematical derivation from moolatrikona signs means this system is internally consistent, not arbitrary.
        </p>
      </section>
    </div>
  );
}

export default function Module2_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/2-3.json';

const META: ModuleMeta = {
  id: 'mod_2_3',
  phase: 1,
  topic: 'Grahas',
  moduleNumber: '2.3',
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 7-Level Dignity Hierarchy</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          A planet's <span className="text-gold-light font-bold">dignity</span> (गरिमा) describes how strong or weak it is based on the sign it occupies. Parashara uses a powerful metaphor in BPHS: <em>"A king in his own kingdom commands respect; a king in exile is powerless."</em> A planet in its exaltation sign is like a king on his throne. The same planet in its debilitation sign is like a king imprisoned in enemy territory.
        </p>

        {/* Dignity Tower */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mb-4">
          <div className="space-y-2">
            {[
              { level: 1, name: { en: 'Exalted (Uchcha)', hi: 'उच्च', sa: 'उच्च', mai: 'उच्च', mr: 'उच्च', ta: 'Exalted (Uchcha)', te: 'Exalted (Uchcha)', bn: 'Exalted (Uchcha)', kn: 'Exalted (Uchcha)', gu: 'Exalted (Uchcha)' }, desc: 'Peak power — planet at its absolute strongest', color: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400', strength: '100%' },
              { level: 2, name: { en: 'Moolatrikona', hi: 'मूलत्रिकोण', sa: 'मूलत्रिकोण', mai: 'मूलत्रिकोण', mr: 'मूलत्रिकोण', ta: 'Moolatrikona', te: 'Moolatrikona', bn: 'Moolatrikona', kn: 'Moolatrikona', gu: 'Moolatrikona' }, desc: 'Special strong zone within own sign (0°-20° typically)', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', strength: '90%' },
              { level: 3, name: { en: 'Own Sign (Swakshetra)', hi: 'स्वक्षेत्र', sa: 'स्वक्षेत्र', mai: 'स्वक्षेत्र', mr: 'स्वक्षेत्र', ta: 'Own Sign (Swakshetra)', te: 'Own Sign (Swakshetra)', bn: 'Own Sign (Swakshetra)', kn: 'Own Sign (Swakshetra)', gu: 'Own Sign (Swakshetra)' }, desc: 'Planet in its own ruled sign — comfortable and effective', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300', strength: '80%' },
              { level: 4, name: { en: "Friend's Sign (Mitrakshetra)", hi: 'मित्रक्षेत्र', sa: 'मित्रक्षेत्र', mai: 'मित्रक्षेत्र', mr: 'मित्रक्षेत्र', ta: "Friend's Sign (Mitrakshetra)", te: "Friend's Sign (Mitrakshetra)", bn: "Friend's Sign (Mitrakshetra)", kn: "Friend's Sign (Mitrakshetra)", gu: "Friend's Sign (Mitrakshetra)" }, desc: "Planet in a friendly planet's sign — supported", color: 'bg-blue-500/5 border-blue-500/15 text-blue-200', strength: '60%' },
              { level: 5, name: { en: 'Neutral Sign (Samakshetra)', hi: 'समक्षेत्र', sa: 'समक्षेत्र', mai: 'समक्षेत्र', mr: 'समक्षेत्र', ta: 'Neutral Sign (Samakshetra)', te: 'Neutral Sign (Samakshetra)', bn: 'Neutral Sign (Samakshetra)', kn: 'Neutral Sign (Samakshetra)', gu: 'Neutral Sign (Samakshetra)' }, desc: 'Planet in a neutral sign — average performance', color: 'bg-amber-500/5 border-amber-500/15 text-amber-300', strength: '50%' },
              { level: 6, name: { en: "Enemy's Sign (Shatrukshetra)", hi: 'शत्रुक्षेत्र', sa: 'शत्रुक्षेत्र', mai: 'शत्रुक्षेत्र', mr: 'शत्रुक्षेत्र', ta: "Enemy's Sign (Shatrukshetra)", te: "Enemy's Sign (Shatrukshetra)", bn: "Enemy's Sign (Shatrukshetra)", kn: "Enemy's Sign (Shatrukshetra)", gu: "Enemy's Sign (Shatrukshetra)" }, desc: "Planet in an enemy's sign — weakened, struggling", color: 'bg-red-500/5 border-red-500/15 text-red-300', strength: '25%' },
              { level: 7, name: { en: 'Debilitated (Neecha)', hi: 'नीच', sa: 'नीच', mai: 'नीच', mr: 'नीच', ta: 'Debilitated (Neecha)', te: 'Debilitated (Neecha)', bn: 'Debilitated (Neecha)', kn: 'Debilitated (Neecha)', gu: 'Debilitated (Neecha)' }, desc: 'Weakest point — planet at its lowest expression', color: 'bg-red-500/10 border-red-500/25 text-red-400', strength: '5%' },
            ].map((d) => (
              <div key={d.level} className={`flex items-center gap-3 p-2.5 rounded-lg border ${d.color}`}>
                <span className={`text-lg font-black w-6 text-center ${d.color.split(' ')[2]}`}>{d.level}</span>
                <div className="flex-1">
                  <span className={`font-bold text-xs ${d.color.split(' ')[2]}`}>{d.name.en} <span className="font-normal text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({d.name.hi})</span></span>
                  <div className="text-text-secondary text-xs">{d.desc}</div>
                </div>
                <span className="text-xs font-mono text-text-tertiary">{d.strength}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          BPHS Ch.3 v.18-20 defines exaltation, debilitation, and moolatrikona for each planet. The term <span className="text-gold-light font-bold">Uchcha</span> (उच्च) means "high/elevated," <span className="text-gold-light font-bold">Neecha</span> (नीच) means "low/fallen," and <span className="text-gold-light font-bold">Moolatrikona</span> means "root triangle" — the foundational zone of power. Parashara explicitly states that a planet's exaltation and debilitation points are always 180° apart — this is not coincidence but cosmic symmetry.
        </p>
      </section>

      {/* Exaltation/Debilitation table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Complete Exaltation & Debilitation Table</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
              <th className="text-left py-2 px-2 text-emerald-400">Exaltation Sign (Degree)</th>
              <th className="text-left py-2 px-2 text-red-400">Debilitation Sign (Degree)</th>
              <th className="text-left py-2 px-2 text-blue-300">Moolatrikona</th>
              <th className="text-left py-2 px-2 text-amber-300">Own Sign(s)</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Sun', ex: 'Aries (10°)', deb: 'Libra (10°)', mt: 'Leo 0°-20°', own: 'Leo' },
                { p: 'Moon', ex: 'Taurus (3°)', deb: 'Scorpio (3°)', mt: 'Taurus 4°-30°', own: 'Cancer' },
                { p: 'Mars', ex: 'Capricorn (28°)', deb: 'Cancer (28°)', mt: 'Aries 0°-12°', own: 'Aries, Scorpio' },
                { p: 'Mercury', ex: 'Virgo (15°)', deb: 'Pisces (15°)', mt: 'Virgo 16°-20°', own: 'Gemini, Virgo' },
                { p: 'Jupiter', ex: 'Cancer (5°)', deb: 'Capricorn (5°)', mt: 'Sagittarius 0°-10°', own: 'Sagittarius, Pisces' },
                { p: 'Venus', ex: 'Pisces (27°)', deb: 'Virgo (27°)', mt: 'Libra 0°-15°', own: 'Taurus, Libra' },
                { p: 'Saturn', ex: 'Libra (20°)', deb: 'Aries (20°)', mt: 'Aquarius 0°-20°', own: 'Capricorn, Aquarius' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-bold">{r.p}</td>
                  <td className="py-1.5 px-2 text-emerald-300">{r.ex}</td>
                  <td className="py-1.5 px-2 text-red-300">{r.deb}</td>
                  <td className="py-1.5 px-2 text-blue-200">{r.mt}</td>
                  <td className="py-1.5 px-2 text-amber-200">{r.own}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-xs mt-2">Note: Mercury is unique — exalted in its OWN sign (Virgo). Moolatrikona range is the narrow 16°-20° zone within Virgo.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Neecha Bhanga Raja Yoga — The Phoenix Principle</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          One of the most powerful principles in Jyotish: a <span className="text-gold-light font-bold">debilitated planet whose debilitation is cancelled</span> doesn't just become normal — it becomes <span className="text-gold-light font-bold">extraordinarily strong</span>. This is called <span className="text-gold-light">Neecha Bhanga Raja Yoga</span> (नीच भंग राज योग) — literally "debilitation-breaking royal yoga."
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The metaphor is a <span className="text-gold-light">phoenix</span> — rising from the ashes of adversity to achieve greatness. Or a leader who comes from poverty and, having overcome every obstacle, leads with greater strength than someone born into privilege. Many highly successful people have Neecha Bhanga yogas in their charts.
        </p>

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-emerald-500/15 mb-4">
          <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">The 4 Classical Cancellation Conditions (BPHS Ch.34 v.22)</h4>
          <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
            <p><span className="text-emerald-300 font-bold">Condition 1:</span> The lord of the DEBILITATION sign is in a kendra (1/4/7/10) from Lagna or Moon. <span className="text-text-tertiary">(Example: Moon debilitated in Scorpio → Mars (Scorpio's lord) in kendra from Lagna)</span></p>
            <p><span className="text-emerald-300 font-bold">Condition 2:</span> The lord of the EXALTATION sign of the debilitated planet is in a kendra. <span className="text-text-tertiary">(Example: Moon debilitated → Venus (lord of Taurus, Moon's exaltation sign) in kendra)</span></p>
            <p><span className="text-emerald-300 font-bold">Condition 3:</span> The debilitated planet ITSELF is in a kendra from Lagna. <span className="text-text-tertiary">(Debilitated planet in 1st, 4th, 7th, or 10th house)</span></p>
            <p><span className="text-emerald-300 font-bold">Condition 4:</span> The debilitated planet is RETROGRADE (Vakri). <span className="text-text-tertiary">(Retrograde adds internal intensity that overcomes the weakness)</span></p>
          </div>
          <p className="text-gold-light text-xs font-medium mt-3">ANY ONE of these 4 conditions is sufficient for cancellation → Neecha Bhanga Raja Yoga.</p>
        </div>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vargottama — Double Confirmation</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Vargottama</span> (वर्गोत्तम = वर्ग + उत्तम = "best division") is when a planet occupies the <span className="text-gold-light">same sign in both the D1 (Rashi) and D9 (Navamsha)</span> charts. This "double confirmation" significantly strengthens the planet — it's genuinely in that sign at both the gross and subtle levels.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          When does Vargottama happen? Each sign has 9 navamshas (3°20' each). The FIRST navamsha of movable signs, the MIDDLE (5th) of fixed signs, and the LAST (9th) of dual signs map back to the same sign. So Vargottama occurs in: Aries 0°-3°20', Taurus 13°20'-16°40', Gemini 26°40'-30°, Cancer 0°-3°20', etc.
        </p>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 10: [4], 7: [2] }}
        title="Jupiter Debilitated in Capricorn (10th) — Neecha Bhanga Check"
        highlight={[10, 7]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: Complete Dignity Assessment</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> Jupiter at 8° Capricorn in a chart where Mars is in the 7th house from Lagna.
        </p>
        <div className="font-mono text-xs text-text-secondary space-y-1">
          <div>1. Jupiter's sign: Capricorn → Jupiter is <span className="text-red-400 font-bold">DEBILITATED</span> (peak debilitation at 5°)</div>
          <div>2. Check Neecha Bhanga conditions:</div>
          <div>   - Lord of Capricorn = Saturn → Is Saturn in kendra? <span className="text-text-tertiary">(check chart)</span></div>
          <div>   - Lord of Cancer (Jupiter's exaltation) = Moon → Is Moon in kendra? <span className="text-text-tertiary">(check chart)</span></div>
          <div>   - Jupiter itself in kendra? <span className="text-text-tertiary">(check which house Capricorn falls in)</span></div>
          <div>   - Jupiter retrograde? <span className="text-text-tertiary">(check if speed is negative)</span></div>
          <div>3. If ANY condition is met → <span className="text-emerald-400 font-bold">Neecha Bhanga Raja Yoga!</span></div>
          <div>4. Jupiter's karakatvas (children, wisdom, dharma) initially suffer but ultimately flourish through adversity.</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "A debilitated planet is always harmful."<br />
          <span className="text-emerald-300">Reality:</span> With Neecha Bhanga, a debilitated planet can produce GREATER success than an exalted one. Abraham Lincoln, Steve Jobs, and many leaders had Neecha Bhanga yogas.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Moolatrikona is the same as own sign."<br />
          <span className="text-emerald-300">Reality:</span> Moolatrikona is STRONGER than own sign. It's a specific degree range (e.g., Sun: Leo 0°-20° is moolatrikona, Leo 20°-30° is regular own sign). This distinction affects Shadbala calculation.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully used in all Jyotish software.</span> Our app computes dignity for every planet in every chart — it's the foundation of Shadbala (Sthana Bala component), Vimshopaka Bala, and chart strength assessment. The Neecha Bhanga detection is part of our 55+ yoga engine. The exaltation/debilitation degrees are from BPHS — unchanged in 1,000+ years.
        </p>
      </section>
    </div>
  );
}

export default function Module2_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

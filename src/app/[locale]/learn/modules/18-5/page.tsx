'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/18-5.json';

const META: ModuleMeta = {
  id: 'mod_18_5', phase: 5, topic: 'Strength', moduleNumber: '18.5',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
          What Is Vimshopaka Bala?
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Vimshopaka means &ldquo;twenty-pointed&rdquo; — a scoring system that checks a planet&rsquo;s dignity across 16 divisional charts (the Shodasvarga set) and sums the weighted results to a maximum of 20 points. It answers a fundamental question: <em>Is this planet consistently dignified, or does its dignity in the birth chart (D1) mask weakness in deeper dimensions?</em>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 16 vargas and their weights are: <strong className="text-gold-light">D1</strong> (Rashi) = 3.5, <strong className="text-gold-light">D2</strong> (Hora) = 0.5, <strong className="text-gold-light">D3</strong> (Drekkana) = 1.0, <strong className="text-gold-light">D7</strong> (Saptamsha) = 0.5, <strong className="text-gold-light">D9</strong> (Navamsha) = 3.0, <strong className="text-gold-light">D10</strong> (Dashamsha) = 0.5, <strong className="text-gold-light">D12</strong> (Dwadashamsha) = 0.5, <strong className="text-gold-light">D16</strong> (Shodashamsha) = 2.0, <strong className="text-gold-light">D20</strong> (Vimshamsha) = 0.5, <strong className="text-gold-light">D24</strong> (Chaturvimshamsha) = 0.5, <strong className="text-gold-light">D27</strong> (Saptavimshamsha) = 0.5, <strong className="text-gold-light">D30</strong> (Trimshamsha) = 1.0, <strong className="text-gold-light">D40</strong> (Khavedamsha) = 1.0, <strong className="text-gold-light">D45</strong> (Akshavedamsha) = 0.5, <strong className="text-gold-light">D60</strong> (Shashtiamsha) = 4.0. Total = 20.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Notice the weight distribution: D60 leads at 4.0, followed by D1 at 3.5, D9 at 3.0, and D16 at 2.0. These four alone account for 12.5 of the 20 points. The remaining 12 vargas share just 7.5 points. This weighting encodes a hierarchy: past-life karma (D60), present-life sign placement (D1), soul-level dharma (D9), and comforts/vehicles (D16) matter most.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Vimshopaka Bala is described in BPHS (Brihat Parashara Hora Shastra), chapter 16. Parashara specifies three varga schemes — Shadvarga (6 vargas), Saptavarga (7), and Shodasvarga (16) — each with its own weight set summing to 20. The Shodasvarga scheme is the most comprehensive and is the standard used by serious practitioners. The system predates Shadbala and represents Parashara&rsquo;s original strength assessment method.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed">
          Jupiter at 5&deg; Cancer. In D1, Jupiter is exalted in Cancer = full 3.5 points. In D9 (Navamsha), 5&deg; Cancer falls in the first navamsha pada, which maps to Cancer itself — still exalted = full 3.0 points. Already 6.5 out of 20 from just two vargas. If Jupiter is also well-placed in D60, that adds up to 4.0 more. Three favourable vargas alone could yield 10.5/20 — already in the &ldquo;good&rdquo; range before checking the other 13.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Many students assume that a planet exalted in D1 will automatically score high in Vimshopaka. This is not true. Exaltation in D1 contributes at most 3.5 out of 20 points. The planet could be debilitated or in enemy signs across many of the remaining 15 vargas, resulting in a mediocre total score. Vimshopaka&rsquo;s power lies precisely in this: it reveals whether D1 dignity is &ldquo;deep&rdquo; or &ldquo;superficial.&rdquo;
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Vimshopaka calculation is tedious by hand (checking dignity in 16 charts for each planet) but trivial for software. Modern Jyotish programs compute it instantly. This has made Vimshopaka accessible to every practitioner, not just scholars with the patience for manual divisional chart construction. It is now one of the first strength metrics checked in computerised chart analysis.
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
          Scoring Per Varga — The Dignity Multiplier
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In each of the 16 vargas, the planet&rsquo;s dignity determines what fraction of that varga&rsquo;s weight it earns. The scoring hierarchy is precise:
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Exalted</strong> = full weight (1x). <strong className="text-gold-light">Moolatrikona</strong> = 3/4 weight. <strong className="text-gold-light">Own sign</strong> = 3/4 weight. <strong className="text-gold-light">Great friend&rsquo;s sign</strong> = 1/2 weight. <strong className="text-gold-light">Friend&rsquo;s sign</strong> = 1/2 weight. <strong className="text-text-secondary">Neutral sign</strong> = 1/4 weight. <strong className="text-red-400">Enemy sign</strong> = 1/8 weight. <strong className="text-red-400">Great enemy&rsquo;s sign</strong> = 1/16 weight. <strong className="text-red-400">Debilitated</strong> = 0.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The scoring is applied independently in each varga. A planet could be exalted in D1 (full 3.5), in a friend&rsquo;s sign in D9 (half of 3.0 = 1.5), neutral in D60 (quarter of 4.0 = 1.0), and so on across all 16 charts. The final Vimshopaka score is the sum of all 16 contributions.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The dignity multipliers follow the Panchadha Maitri (five-fold relationship) system from BPHS. This system first determines natural friendship between planets, then modifies it based on temporary friendship (chart-specific positions), yielding five relationship grades: great friend, friend, neutral, enemy, great enemy. These same grades drive the Vimshopaka scoring, creating a direct link between planetary relationship theory and strength assessment.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example — Full Calculation</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Jupiter in Cancer at 5&deg;. Let us trace the major vargas:
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D1 (weight 3.5):</span> Cancer = exalted. Score: 3.5 x 1 = 3.50</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D9 (weight 3.0):</span> 5&deg; Cancer = Cancer navamsha = exalted. Score: 3.0 x 1 = 3.00</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D2 (weight 0.5):</span> 5&deg; = Moon&rsquo;s Hora (Cancer ruled by Moon, friend). Score: 0.5 x 1/2 = 0.25</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">D3 (weight 1.0):</span> 5&deg; Cancer = first drekkana = Cancer itself = exalted. Score: 1.0 x 1 = 1.00</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Running subtotal from 4 vargas:</span> 7.75 out of 20. The remaining 12 vargas add their contributions similarly.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Students sometimes apply Moolatrikona and own-sign scoring incorrectly — treating them as the same as exaltation. While both score 3/4 (which is good), they are notably less than the full weight that exaltation receives. The difference matters in close cases. Also, &ldquo;great friend&rdquo; and &ldquo;friend&rdquo; both score 1/2, and &ldquo;enemy&rdquo; and &ldquo;great enemy&rdquo; differ (1/8 vs 1/16) — these fine gradations are often overlooked.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Vimshopaka scoring system is essentially a weighted average — a concept familiar in data science and statistics. Modern practitioners appreciate its mathematical elegance: 16 independent assessments, each weighted by importance, collapsed into a single 0-20 score. It is arguably the most &ldquo;modern&rdquo; of classical Jyotish tools in its design philosophy, anticipating multi-factor scoring systems by millennia.
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
          Interpretation — Reading the Score
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Vimshopaka score falls into four broad bands: <strong className="text-gold-light">15-20</strong> = highly auspicious (planet is dignified across most vargas, delivering consistent quality), <strong className="text-gold-light">10-15</strong> = good (reliable planet with some dimensional weaknesses), <strong className="text-text-secondary">5-10</strong> = mixed (inconsistent dignity, results vary by life area), <strong className="text-red-400">below 5</strong> = weak across vargas (the planet&rsquo;s significations face systemic challenges).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The critical distinction is between Vimshopaka and Shadbala. <strong className="text-gold-light">Vimshopaka measures inherent quality</strong> — is the planet dignified when viewed through multiple divisional lenses? <strong className="text-gold-light">Shadbala measures functional ability</strong> — does the planet have positional power, directional strength, temporal advantage, and motional strength in the birth chart? These are independent axes.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A planet can be dignified (high Vimshopaka) but poorly placed (low Shadbala) — like a nobleman in exile: inherently worthy but unable to exercise power. Conversely, a planet can be functionally strong (high Shadbala) but of poor quality (low Vimshopaka) — like a powerful official of questionable character. The most auspicious planets score high on both measures. Complete strength assessment requires both Vimshopaka and Shadbala.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara presents Vimshopaka before Shadbala in BPHS, suggesting he considered it the primary strength metric. Later commentators like Balabhadra (Hora Ratnam) and modern scholars like Sanjay Rath have emphasised that Vimshopaka reveals the &ldquo;essence&rdquo; of a planet while Shadbala reveals its &ldquo;circumstances.&rdquo; Together they form a complete picture — like knowing both a person&rsquo;s character and their current situation.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example — Vimshopaka vs Shadbala</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Saturn exalted in Libra (D1) at 20&deg;, also exalted in D9, D3, well-placed in D60 — Vimshopaka score: 16.2/20 (excellent). But this Saturn is in the 12th house, has low Dig Bala (directional strength, Saturn is strong in 7th not 12th), low Kala Bala (born during daytime when Saturn prefers night), and lost the planetary war with Mars nearby. Shadbala: only 85% of required minimum. This Saturn has superb inherent quality but difficult circumstances — during its dasha, the native achieves outcomes of lasting value but through struggle, isolation, or foreign lands (12th house themes).
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Some practitioners treat Vimshopaka as a replacement for Shadbala, or vice versa. This is a fundamental error. They measure different things and can diverge significantly for the same planet. A chart analysis that uses only one is incomplete. Additionally, neither Vimshopaka nor Shadbala accounts for house lordship — a planet with excellent scores can still produce challenging results if it lords over dusthana houses (6th, 8th, 12th).
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Vimshopaka-Shadbala distinction maps elegantly to modern psychological concepts. Vimshopaka is like measuring someone&rsquo;s &ldquo;trait&rdquo; — their stable, inherent character across contexts. Shadbala is like measuring their &ldquo;state&rdquo; — their current abilities given life circumstances. This dual-axis model of planetary strength, articulated thousands of years ago, anticipates modern personality psychology&rsquo;s trait-state distinction. For predictive work, high Vimshopaka with low Shadbala often manifests as &ldquo;potential waiting for the right dasha or transit to unlock it.&rdquo;
        </p>
      </section>
    </div>
  );
}

export default function Module18_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

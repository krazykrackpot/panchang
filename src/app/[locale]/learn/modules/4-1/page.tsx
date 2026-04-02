'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_4_1', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.1',
  title: { en: "Earth Wobble — Precession Physics", hi: "अयनगति भौतिकी" },
  subtitle: { en: "Why Earth axis traces a cone over 25772 years changing the pole star and ayanamsha", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q4_1_01', type: 'mcq', question: { en: "What is the primary cause of precession?", hi: '' }, options: [{ en: "Earth magnetic field", hi: '' }, { en: "Sun and Moon gravity on Earth equatorial bulge", hi: '' }, { en: "Jupiter orbit", hi: '' }, { en: "Solar wind", hi: '' }], correctAnswer: 1, explanation: { en: "Sun and Moon gravitational pull on the equatorial bulge creates the torque that drives precession.", hi: '' } },
  { id: 'q4_1_02', type: 'true_false', question: { en: "Precession completes one cycle in approximately 25772 years.", hi: '' }, correctAnswer: true, explanation: { en: "Correct. At 50.3 arcseconds per year, one full 360 degree precession takes about 25772 years — the Platonic Year.", hi: '' } },
  { id: 'q4_1_03', type: 'mcq', question: { en: "The current Lahiri Ayanamsha (2026) is approximately:", hi: '' }, options: [{ en: "12 degrees", hi: '' }, { en: "24.2 degrees", hi: '' }, { en: "36 degrees", hi: '' }, { en: "0 degrees", hi: '' }], correctAnswer: 1, explanation: { en: "Lahiri Ayanamsha in 2026 is approximately 24.22 degrees — the accumulated precession since the zodiacs were aligned.", hi: '' } },
  { id: 'q4_1_04', type: 'true_false', question: { en: "The Surya Siddhanta correctly described precession as a steady one-directional increase.", hi: '' }, correctAnswer: false, explanation: { en: "False. The Surya Siddhanta used a trepidation (oscillating) model. The correct model is monotonic — precession increases steadily at about 50.3 arcseconds per year.", hi: '' } },
  { id: 'q4_1_05', type: 'mcq', question: { en: "To convert tropical longitude to sidereal, you:", hi: '' }, options: [{ en: "Add ayanamsha", hi: '' }, { en: "Subtract ayanamsha", hi: '' }, { en: "Multiply", hi: '' }, { en: "Divide", hi: '' }], correctAnswer: 1, explanation: { en: "Sidereal = Tropical - Ayanamsha. The tropical equinox has moved forward, so sidereal positions are behind by the ayanamsha amount.", hi: '' } }
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Imagine a spinning top on a table. As it spins, its axis slowly traces a circle in the air. Earth does exactly this — its rotation axis traces a cone in space, completing one full circle every 25,772 years. This is called precession, and it is the single most important astronomical phenomenon for Jyotish.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The cause is gravitational: the Sun and Moon pull on Earth equatorial bulge (Earth is ~43km wider at the equator than pole-to-pole). This torque slowly tilts the rotation axis, causing it to precess like a gyroscope. The rate is about 50.3 arcseconds per year — roughly 1 degree every 71.6 years.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The practical consequence: the point where the Sun crosses the celestial equator (the equinox) slowly shifts westward along the ecliptic. This means the tropical zodiac (tied to the equinox) drifts relative to the stars. Today the gap is about 24.2 degrees — the ayanamsha.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The Surya Siddhanta (Ch.3) describes precession but used a trepidation model (oscillating back and forth) rather than the correct steady increase. This was its one major error. Varahamihira in Pancha Siddhantika also discussed precession. The Indian discovery was independent of the Greek discovery by Hipparchus (~150 BCE).</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Detailed Analysis</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Precession changes the pole star over millennia. Today Polaris (Dhruva Tara) marks north. Around 2700 BCE when the pyramids were built, Thuban (Alpha Draconis) was the pole star. By ~14000 CE, Vega will become the pole star. Then Polaris will return around 26000 CE. This cycle repeats endlessly.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">For Jyotish, precession means the sidereal and tropical zodiacs diverge by about 1 degree every 72 years. In 2000 years, they will differ by a full sign (30 degrees). This is why your Western zodiac sign (tropical) may differ from your Vedic sign (sidereal) — currently by about 24 degrees.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> If precession rate is 50.3 arcseconds/year, how much does the ayanamsha change in 100 years? Answer: 50.3 x 100 = 5030 arcseconds = 1.397 degrees. So ayanamsha increases by about 1.4 degrees per century.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 2:</span> The pyramids of Giza were aligned to Thuban (then the pole star) around 2700 BCE. Today Polaris is the pole star. The angular distance between them is about 26 degrees — matching the precession that occurred over ~4700 years (4700 x 50.3 arcseconds = 65.7 degrees of precession around the cone).</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Precession is an oscillation that reverses direction every few centuries. REALITY: Precession is monotonically increasing — the equinox moves steadily westward at ~50.3 arcseconds/year. The Surya Siddhanta trepidation model was wrong. Modern measurements confirm steady precession with tiny second-order variations.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">This is established astronomical science. NASA uses precession in all orbital calculations. Our app applies the Lahiri ayanamsha polynomial (based on precession rate) to convert tropical planetary positions to sidereal. The formula: Ayanamsha = 23.85306 + 1.39722*T + 0.00018*T*T where T = centuries from J2000.0.</p>
      </section>
    </div>
  );
}

export default function Module4_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

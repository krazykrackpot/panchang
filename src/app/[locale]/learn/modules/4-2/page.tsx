'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_4_2', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.2',
  title: { en: "Two Zodiacs — Tropical vs Sidereal", hi: "दो राशिचक्र" },
  subtitle: { en: "Why Western astrology uses one zodiac and Vedic another — detailed conversion with examples", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q4_2_01', type: 'mcq', question: { en: "What is the primary cause of precession?", hi: '' }, options: [{ en: "Earth magnetic field", hi: '' }, { en: "Sun and Moon gravity on Earth equatorial bulge", hi: '' }, { en: "Jupiter orbit", hi: '' }, { en: "Solar wind", hi: '' }], correctAnswer: 1, explanation: { en: "Sun and Moon gravitational pull on the equatorial bulge creates the torque that drives precession.", hi: '' } },
  { id: 'q4_2_02', type: 'true_false', question: { en: "Precession completes one cycle in approximately 25772 years.", hi: '' }, correctAnswer: true, explanation: { en: "Correct. At 50.3 arcseconds per year, one full 360 degree precession takes about 25772 years — the Platonic Year.", hi: '' } },
  { id: 'q4_2_03', type: 'mcq', question: { en: "The current Lahiri Ayanamsha (2026) is approximately:", hi: '' }, options: [{ en: "12 degrees", hi: '' }, { en: "24.2 degrees", hi: '' }, { en: "36 degrees", hi: '' }, { en: "0 degrees", hi: '' }], correctAnswer: 1, explanation: { en: "Lahiri Ayanamsha in 2026 is approximately 24.22 degrees — the accumulated precession since the zodiacs were aligned.", hi: '' } },
  { id: 'q4_2_04', type: 'true_false', question: { en: "The Surya Siddhanta correctly described precession as a steady one-directional increase.", hi: '' }, correctAnswer: false, explanation: { en: "False. The Surya Siddhanta used a trepidation (oscillating) model. The correct model is monotonic — precession increases steadily at about 50.3 arcseconds per year.", hi: '' } },
  { id: 'q4_2_05', type: 'mcq', question: { en: "To convert tropical longitude to sidereal, you:", hi: '' }, options: [{ en: "Add ayanamsha", hi: '' }, { en: "Subtract ayanamsha", hi: '' }, { en: "Multiply", hi: '' }, { en: "Divide", hi: '' }], correctAnswer: 1, explanation: { en: "Sidereal = Tropical - Ayanamsha. The tropical equinox has moved forward, so sidereal positions are behind by the ayanamsha amount.", hi: '' } }
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">There are two ways to define 0 degrees Aries — and this single choice creates the fundamental split between Western and Vedic astrology. The tropical zodiac defines 0 degrees Aries as the Vernal Equinox point (where the Sun is on March 20-21). The sidereal zodiac defines 0 degrees Aries relative to fixed background stars.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">About 1700 years ago (~285 CE by most estimates), these two starting points were aligned — both zodiacs agreed. But because of precession, the equinox point has since moved about 24.2 degrees westward along the ecliptic. This means that what the Western system calls 24 degrees Aries, the Vedic system calls 0 degrees Aries.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The practical consequence is striking: approximately 80 percent of people have a different Sun sign in Western astrology versus Vedic astrology. If your Western Sun is in early Aries (say 15 degrees), your Vedic Sun is actually in Pisces (15 minus 24.2 = negative 9.2 = 350.8 degrees = 20.8 degrees Pisces).</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The tropical zodiac was championed by Ptolemy (2nd century CE) in his Tetrabiblos, which became the foundation of Western astrology. Indian astrology always used the sidereal zodiac, anchored to the nakshatra system which requires fixed star references. The Surya Siddhanta and BPHS both operate in the sidereal framework.</p>
      </section>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Detailed Analysis</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Neither zodiac is wrong — they measure different things. The tropical zodiac measures the Sun position relative to Earth seasons (equinoxes and solstices). The sidereal zodiac measures the Sun position relative to the fixed stars and constellations. Tropical = WHEN in the seasonal cycle. Sidereal = WHERE in the cosmic backdrop.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The conversion is simple subtraction: Sidereal longitude = Tropical longitude minus Ayanamsha. For 2026, Lahiri ayanamsha is approximately 24.22 degrees. So if NASA tells you Mars is at 120 degrees tropical (0 degrees Leo), in Vedic terms Mars is at 120 minus 24.22 = 95.78 degrees sidereal (5.78 degrees Cancer).</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Convert 45 degrees tropical to sidereal (2026): 45 minus 24.22 = 20.78 degrees sidereal = 20.78 degrees Aries (still in Aries since 20.78 is less than 30). But 15 degrees Aries tropical = 15 minus 24.22 = negative 9.22 = 350.78 = 20.78 degrees Pisces sidereal — sign changes!</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 2:</span> Someone born on April 5 has Sun at ~15 degrees Aries in Western astrology. In Vedic: 15 minus 24.2 = Pisces! Their Western horoscope says Aries (fire, initiative, leadership) but their Vedic chart says Pisces (water, intuition, spirituality). Both are astronomically correct — they just measure from different reference points.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed">One zodiac is right and the other is wrong. REALITY: Both are mathematically valid coordinate systems. Tropical measures seasonal position (useful for agricultural calendars). Sidereal measures stellar position (required for nakshatra-based systems like Vimshottari Dasha). The choice depends on what you want to measure.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Both zodiacs are real astronomical coordinate systems. Our app uses Meeus algorithms for tropical positions (like NASA), then subtracts the Lahiri ayanamsha to get sidereal positions. This gives us sub-degree accuracy while maintaining compatibility with the classical Jyotish interpretive framework.</p>
      </section>
    </div>
  );
}

export default function Module4_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

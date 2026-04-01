'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_4_3', phase: 1, topic: 'Ayanamsha', moduleNumber: '4.3',
  title: { en: "Ayanamsha Systems — The Great Debate", hi: "अयनांश पद्धतियाँ" },
  subtitle: { en: "Why multiple ayanamsha values exist and which one India officially uses", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q4_3_01', type: 'mcq', question: { en: "What is the primary cause of precession?", hi: '' }, options: [{ en: "Earth magnetic field", hi: '' }, { en: "Sun and Moon gravity on Earth equatorial bulge", hi: '' }, { en: "Jupiter orbit", hi: '' }, { en: "Solar wind", hi: '' }], correctAnswer: 1, explanation: { en: "Sun and Moon gravitational pull on the equatorial bulge creates the torque that drives precession.", hi: '' } },
  { id: 'q4_3_02', type: 'true_false', question: { en: "Precession completes one cycle in approximately 25772 years.", hi: '' }, correctAnswer: true, explanation: { en: "Correct. At 50.3 arcseconds per year, one full 360 degree precession takes about 25772 years — the Platonic Year.", hi: '' } },
  { id: 'q4_3_03', type: 'mcq', question: { en: "The current Lahiri Ayanamsha (2026) is approximately:", hi: '' }, options: [{ en: "12 degrees", hi: '' }, { en: "24.2 degrees", hi: '' }, { en: "36 degrees", hi: '' }, { en: "0 degrees", hi: '' }], correctAnswer: 1, explanation: { en: "Lahiri Ayanamsha in 2026 is approximately 24.22 degrees — the accumulated precession since the zodiacs were aligned.", hi: '' } },
  { id: 'q4_3_04', type: 'true_false', question: { en: "The Surya Siddhanta correctly described precession as a steady one-directional increase.", hi: '' }, correctAnswer: false, explanation: { en: "False. The Surya Siddhanta used a trepidation (oscillating) model. The correct model is monotonic — precession increases steadily at about 50.3 arcseconds per year.", hi: '' } },
  { id: 'q4_3_05', type: 'mcq', question: { en: "To convert tropical longitude to sidereal, you:", hi: '' }, options: [{ en: "Add ayanamsha", hi: '' }, { en: "Subtract ayanamsha", hi: '' }, { en: "Multiply", hi: '' }, { en: "Divide", hi: '' }], correctAnswer: 1, explanation: { en: "Sidereal = Tropical - Ayanamsha. The tropical equinox has moved forward, so sidereal positions are behind by the ayanamsha amount.", hi: '' } }
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">If the sidereal zodiac is anchored to fixed stars, you would think there is only one correct ayanamsha value. But here is the problem: WHICH fixed star do you anchor to? Different astronomers chose slightly different reference stars, leading to ayanamsha values that differ by 1-2 degrees.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Lahiri (Chitrapaksha) system defines the star Spica (Chitra yogtara, Alpha Virginis) as being at exactly 180 degrees sidereal longitude — the beginning of Libra. This was adopted as the official standard by the Indian Government Calendar Reform Committee in 1956, led by the physicist Meghnad Saha.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Other systems include: KP/Krishnamurti (differs from Lahiri by only about 6 arcminutes), Raman (about 1.4 degrees less than Lahiri), BV Raman (similar to Raman), Yukteshwar (significantly different, based on his yuga theory), and Fagan-Bradley (Western sidereal, anchors Aldebaran at 15 degrees Taurus).</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">BPHS does not specify a numerical ayanamsha value — the concept of precise ayanamsha measurement came later. The 1956 Calendar Reform Committee reconciled various traditions and settled on Lahiri as the most consistent with observable star positions and traditional Indian calendar practices.</p>
      </section>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Detailed Analysis</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The differences seem small — Lahiri is about 24.22 degrees while KP is about 24.13 degrees in 2026. But for planets near sign boundaries, even 0.1 degrees can change the sign. If your Moon is at 29.95 degrees Aries in Lahiri, it might be at 0.05 degrees Taurus in Raman. Different sign means different chart interpretation, different dasha sequence, different predictions.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Lahiri formula is a polynomial: Ayanamsha = 23.85306 + 1.39722*T + 0.00018*T*T - 0.000005*T*T*T, where T = centuries from J2000.0 (January 1, 2000, 12:00 TT). For 2026: T = 0.26, giving ayanamsha = 23.85306 + 0.36327 + 0.00001 = 24.2164 degrees.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Compute Lahiri for year 2000 (T=0): 23.85306 + 0 + 0 = 23.853 degrees. For year 2100 (T=1.0): 23.85306 + 1.39722 + 0.00018 = 25.250 degrees. Difference over 100 years: 1.397 degrees, consistent with the ~50.3 arcseconds/year precession rate.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 2:</span> An astrologer using Raman ayanamsha reads your Moon in Taurus. Another using Lahiri reads it in Aries. Who is right? Both are self-consistent within their system — but if one gives better predictions for you, that system is empirically better for your chart. Most Indian astrologers use Lahiri because it has the largest validation base.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Lahiri is the only correct system and all others are wrong. REALITY: No ayanamsha can be proven correct in an absolute sense — the choice of anchor star is a convention. Lahiri is the most widely used and officially recognized, giving it the largest empirical validation base. But some practitioners get excellent results with KP or Raman.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Our app defaults to Lahiri (Indian Government standard) but supports 6 ayanamsha systems: Lahiri, KP, Raman, BV Raman, Yukteshwar, and JN Bhasin. The choice can be switched in settings. For most users, Lahiri is recommended as it has the widest practitioner base and is the most thoroughly tested.</p>
      </section>
    </div>
  );
}

export default function Module4_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

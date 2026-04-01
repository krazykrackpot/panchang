'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_3', phase: 3, topic: 'Kundali', moduleNumber: '9.3',
  title: { en: "Placing Planets", hi: "ग्रह स्थापन" },
  subtitle: { en: "Full pipeline birth time to house placement", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q9_3_01', type: 'mcq', question: { en: "Equal House?", hi: '' }, options: [{ en: "It only applies to Sun signs", hi: '' }, { en: "It is based on systematic astronomical observation", hi: '' }, { en: "It was invented in the 20th century", hi: '' }, { en: "It has no practical application", hi: '' }], correctAnswer: 1, explanation: { en: "30d from Lagna", hi: '' } },
  { id: 'q9_3_02', type: 'true_false', question: { en: "This topic is covered in BPHS (Brihat Parashara Hora Shastra).", hi: '' }, correctAnswer: true, explanation: { en: "Correct. BPHS is the foundational text of Parashari Jyotish and covers virtually every topic in Vedic astrology.", hi: '' } },
  { id: 'q9_3_03', type: 'mcq', question: { en: "The purpose of studying Placing Planets is to:", hi: '' }, options: [{ en: "Memorize arbitrary rules", hi: '' }, { en: "Understand how planetary positions create life patterns and enable prediction", hi: '' }, { en: "Replace modern science", hi: '' }, { en: "None of the above", hi: '' }], correctAnswer: 1, explanation: { en: "Jyotish is a systematic framework for understanding how celestial positions correlate with terrestrial events. It combines astronomy (where planets are) with interpretation (what it means).", hi: '' } },
  { id: 'q9_3_04', type: 'true_false', question: { en: "Jyotish results are completely deterministic and cannot be modified.", hi: '' }, correctAnswer: false, explanation: { en: "False. Jyotish describes tendencies and karmic patterns. Remedial measures (gemstones, mantras, charity), conscious effort, and spiritual practice can modify outcomes. The chart is a map, not a prison.", hi: '' } },
  { id: 'q9_3_05', type: 'mcq', question: { en: "Our app implements Placing Planets using:", hi: '' }, options: [{ en: "Random number generators", hi: '' }, { en: "Swiss Ephemeris precision with BPHS interpretive framework", hi: '' }, { en: "Only Western astrology rules", hi: '' }, { en: "No computation at all", hi: '' }], correctAnswer: 1, explanation: { en: "We use modern astronomical computation (Meeus algorithms, Swiss Ephemeris precision) combined with classical Jyotish interpretation from BPHS, Phaladeepika, and other foundational texts.", hi: '' } }
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">This module covers Placing Planets — a core concept in Kundali within Vedic Jyotish. Understanding this topic is essential for reading birth charts, making predictions, and applying the wisdom of classical texts like BPHS and Phaladeepika.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Full pipeline birth time to house placement. This concept has been practiced for over 2000 years and remains the foundation of modern Jyotish practice. Every chart reading, dasha interpretation, and transit analysis relies on this knowledge.</p>
        <p className="text-text-secondary text-sm leading-relaxed">As we explore Placing Planets, pay attention to the underlying mathematical structure — Jyotish is built on precise astronomical observations encoded into systematic frameworks. The beauty of this system is that the same rules apply whether you are reading a chart from 500 BCE or 2026 CE.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">This topic is extensively covered in BPHS (Brihat Parashara Hora Shastra) and Phaladeepika. Parashara laid the foundational framework that all subsequent texts built upon. The classical approach combines astronomical precision with interpretive depth — computation tells us WHERE planets are, tradition tells us what it MEANS.</p>
      </section>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Detailed Analysis</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The detailed mechanics of Placing Planets involve understanding how planetary positions, sign placements, and house occupancies interact to produce specific life outcomes. This is not arbitrary — it follows systematic rules that have been refined over millennia of observation and codification.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">In practice, applying Placing Planets requires both theoretical knowledge (which you are building here) and chart-reading experience. The questions below will test your understanding of the key principles. As you progress through more modules, you will see how this topic connects to dashas, transits, and predictive techniques.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Consider a chart where the key planet for Placing Planets is well-placed in a kendra (angular house) in its own sign. This would indicate strong positive results in the life area governed by this topic — the native experiences natural support and favorable outcomes.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 2:</span> Now consider the opposite: the key planet is debilitated in a dusthana (6th, 8th, or 12th house). This creates challenges in the related life area. However, if Neecha Bhanga conditions are met, the initial difficulty transforms into extraordinary achievement — the phoenix principle.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed">A common misconception about Placing Planets is that results are deterministic and unchangeable. In reality, Jyotish describes tendencies and karmic patterns that can be modified through conscious effort, remedial measures (gemstones, mantras, charity), and spiritual practice. The chart shows the map — you choose the path.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">This concept is fully used in modern Jyotish practice and is implemented in our app calculations. Our engine applies these classical principles using modern computational precision — Swiss Ephemeris accuracy combined with BPHS interpretive framework.</p>
      </section>
    </div>
  );
}

export default function Module9_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

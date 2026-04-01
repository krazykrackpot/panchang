'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_15_4', phase: 4, topic: 'Yogas Doshas', moduleNumber: '15.4',
  title: { en: "Remedial Measures", hi: "उपाय" },
  subtitle: { en: "Gemstones mantras charity per planet", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q15_4_01', type: 'mcq', question: { en: "Jupiter gem?", hi: '' }, options: [{ en: "Ruby", hi: '' }, { en: "Pearl", hi: '' }, { en: "Yellow Sapphire", hi: '' }, { en: "Blue Sapphire", hi: '' }], correctAnswer: 2, explanation: { en: "Pukhraj Thursday", hi: '' } },
  { id: 'q15_4_02', type: 'true_false', question: { en: "Safe without consult", hi: '' }, correctAnswer: false, explanation: { en: "NEVER without analysis", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Sun=Ruby Moon=Pearl Mars=Coral Jupiter=Pukhraj</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Sun=Ruby Moon=Pearl Mars=Coral Jupiter=Pukhraj</p>
      </section>
    </div>
  );
}

export default function Module15_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

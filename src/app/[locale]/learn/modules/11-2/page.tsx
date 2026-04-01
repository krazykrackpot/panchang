'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_11_2', phase: 3, topic: 'Vargas', moduleNumber: '11.2',
  title: { en: "Navamsha D9", hi: "नवांश" },
  subtitle: { en: "How D9 calculated marriage and soul purpose", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q11_2_01', type: 'mcq', question: { en: "D9 depends on?", hi: '' }, options: [{ en: "Degree only", hi: '' }, { en: "Element+position", hi: '' }, { en: "Random", hi: '' }, { en: "Moon", hi: '' }], correctAnswer: 1, explanation: { en: "Element determines mapping", hi: '' } },
  { id: 'q11_2_02', type: 'true_false', question: { en: "Vargottama strengthens", hi: '' }, correctAnswer: true, explanation: { en: "Same sign D1 and D9", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">9 parts of 3d20m D9 depends on parent element</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">9 parts of 3d20m D9 depends on parent element</p>
      </section>
    </div>
  );
}

export default function Module11_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_14_1', phase: 4, topic: 'Compatibility', moduleNumber: '14.1',
  title: { en: "Ashta Kuta Matching", hi: "अष्ट कूट" },
  subtitle: { en: "8 factors 36 points", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q14_1_01', type: 'mcq', question: { en: "Max score?", hi: '' }, options: [{ en: "12", hi: '' }, { en: "24", hi: '' }, { en: "36", hi: '' }, { en: "100", hi: '' }], correctAnswer: 2, explanation: { en: "1+2+3+4+5+6+7+8=36", hi: '' } },
  { id: 'q14_1_02', type: 'true_false', question: { en: "Nadi highest 8pts", hi: '' }, correctAnswer: true, explanation: { en: "Most important", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Varna Vashya Tara Yoni Maitri Gana Bhakut Nadi</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Varna Vashya Tara Yoni Maitri Gana Bhakut Nadi</p>
      </section>
    </div>
  );
}

export default function Module14_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

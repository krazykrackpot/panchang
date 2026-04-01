'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_14_2', phase: 4, topic: 'Compatibility', moduleNumber: '14.2',
  title: { en: "Key Kutas Doshas", hi: "प्रमुख कूट" },
  subtitle: { en: "Nadi Bhakut Gana deep dive", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q14_2_01', type: 'mcq', question: { en: "Nadi Dosha?", hi: '' }, options: [{ en: "Different", hi: '' }, { en: "Same Nadi", hi: '' }, { en: "Moon match", hi: '' }, { en: "Gana match", hi: '' }], correctAnswer: 1, explanation: { en: "Same = Dosha", hi: '' } },
  { id: 'q14_2_02', type: 'true_false', question: { en: "Bhakut if lords friends", hi: '' }, correctAnswer: true, explanation: { en: "Standard check", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Same Nadi = concern. Each has cancellation</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Same Nadi = concern. Each has cancellation</p>
      </section>
    </div>
  );
}

export default function Module14_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_15_1', phase: 4, topic: 'Yogas Doshas', moduleNumber: '15.1',
  title: { en: "Pancha Mahapurusha", hi: "पंच महापुरुष" },
  subtitle: { en: "5 great yogas", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q15_1_01', type: 'mcq', question: { en: "Hamsa?", hi: '' }, options: [{ en: "Mars", hi: '' }, { en: "Mercury", hi: '' }, { en: "Jupiter", hi: '' }, { en: "Venus", hi: '' }], correctAnswer: 2, explanation: { en: "Jupiter own/exalted kendra", hi: '' } },
  { id: 'q15_1_02', type: 'true_false', question: { en: "All need kendra", hi: '' }, correctAnswer: true, explanation: { en: "Mandatory", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Own/exalted in kendra produces extraordinary</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Own/exalted in kendra produces extraordinary</p>
      </section>
    </div>
  );
}

export default function Module15_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

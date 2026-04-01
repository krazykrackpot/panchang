'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_10_1', phase: 3, topic: 'Bhavas', moduleNumber: '10.1',
  title: { en: "12 Houses Significations", hi: "12 भाव" },
  subtitle: { en: "What each house governs", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q10_1_01', type: 'mcq', question: { en: "7th house?", hi: '' }, options: [{ en: "Children", hi: '' }, { en: "Career", hi: '' }, { en: "Marriage", hi: '' }, { en: "Health", hi: '' }], correctAnswer: 2, explanation: { en: "7th = marriage", hi: '' } },
  { id: 'q10_1_02', type: 'true_false', question: { en: "12th = losses AND moksha", hi: '' }, correctAnswer: true, explanation: { en: "Both expenditure+liberation", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">1st=self 2nd=wealth 7th=marriage 10th=career 12th=moksha</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">1st=self 2nd=wealth 7th=marriage 10th=career 12th=moksha</p>
      </section>
    </div>
  );
}

export default function Module10_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_10_3', phase: 3, topic: 'Bhavas', moduleNumber: '10.3',
  title: { en: "House Lords", hi: "भावेश" },
  subtitle: { en: "Lord carries energy. 144 combinations", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q10_3_01', type: 'mcq', question: { en: "10th in 12th?", hi: '' }, options: [{ en: "Failure", hi: '' }, { en: "Foreign career", hi: '' }, { en: "No career", hi: '' }, { en: "Change yearly", hi: '' }], correctAnswer: 1, explanation: { en: "12th adds distance", hi: '' } },
  { id: 'q10_3_02', type: 'true_false', question: { en: "Own house strengthens", hi: '' }, correctAnswer: true, explanation: { en: "Strong results", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Lord of 7th in 6th = discord. Exchange = Parivartana</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Lord of 7th in 6th = discord. Exchange = Parivartana</p>
      </section>
    </div>
  );
}

export default function Module10_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

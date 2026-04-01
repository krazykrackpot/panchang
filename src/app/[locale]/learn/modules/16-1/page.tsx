'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_16_1', phase: 5, topic: 'Classical', moduleNumber: '16.1',
  title: { en: "Astronomical Texts", hi: "खगोलशास्त्रीय" },
  subtitle: { en: "Surya Siddhanta Aryabhatiya analysis", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q16_1_01', type: 'mcq', question: { en: "Earth rotation?", hi: '' }, options: [{ en: "After Copernicus", hi: '' }, { en: "1000yr before", hi: '' }, { en: "Same time", hi: '' }, { en: "Never", hi: '' }], correctAnswer: 1, explanation: { en: "499 vs 1543 CE", hi: '' } },
  { id: 'q16_1_02', type: 'true_false', question: { en: "Synodic 0.08sec", hi: '' }, correctAnswer: true, explanation: { en: "29.530588 vs .589", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Synodic month 0.08sec Aryabhata Earth rotates</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Synodic month 0.08sec Aryabhata Earth rotates</p>
      </section>
    </div>
  );
}

export default function Module16_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

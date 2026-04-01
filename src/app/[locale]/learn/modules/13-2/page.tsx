'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_13_2', phase: 3, topic: 'Transits', moduleNumber: '13.2',
  title: { en: "Sade Sati", hi: "साढ़े साती" },
  subtitle: { en: "Saturn 7.5yr 12th 1st 2nd from Moon", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q13_2_01', type: 'mcq', question: { en: "Sade Sati is?", hi: '' }, options: [{ en: "Sun sign", hi: '' }, { en: "12th 1st 2nd Moon", hi: '' }, { en: "All 12", hi: '' }, { en: "Retrograde only", hi: '' }], correctAnswer: 1, explanation: { en: "Three phases", hi: '' } },
  { id: 'q13_2_02', type: 'true_false', question: { en: "2-3 times per life", hi: '' }, correctAnswer: true, explanation: { en: "~30yr cycle", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Three phases 2.5yr each</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Three phases 2.5yr each</p>
      </section>
    </div>
  );
}

export default function Module13_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

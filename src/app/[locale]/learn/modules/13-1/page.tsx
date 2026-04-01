'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_13_1', phase: 3, topic: 'Transits', moduleNumber: '13.1',
  title: { en: "How Transits Work", hi: "गोचर" },
  subtitle: { en: "Current sky vs birth chart", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q13_1_01', type: 'mcq', question: { en: "Saturn per sign?", hi: '' }, options: [{ en: "1 month", hi: '' }, { en: "1 year", hi: '' }, { en: "2.5 years", hi: '' }, { en: "7.5 years", hi: '' }], correctAnswer: 2, explanation: { en: "~2.5yr per sign", hi: '' } },
  { id: 'q13_1_02', type: 'true_false', question: { en: "From Moon sign", hi: '' }, correctAnswer: true, explanation: { en: "Chandra Lagna", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Slow planets lasting Fast planets daily</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Slow planets lasting Fast planets daily</p>
      </section>
    </div>
  );
}

export default function Module13_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

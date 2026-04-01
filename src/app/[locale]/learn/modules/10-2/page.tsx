'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_10_2', phase: 3, topic: 'Bhavas', moduleNumber: '10.2',
  title: { en: "House Classifications", hi: "भाव वर्गीकरण" },
  subtitle: { en: "Kendra Trikona Dusthana groupings", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q10_2_01', type: 'mcq', question: { en: "Kendras?", hi: '' }, options: [{ en: "1,5,9", hi: '' }, { en: "1,4,7,10", hi: '' }, { en: "6,8,12", hi: '' }, { en: "3,6,10,11", hi: '' }], correctAnswer: 1, explanation: { en: "Angular 4 pillars", hi: '' } },
  { id: 'q10_2_02', type: 'true_false', question: { en: "Raja=Kendra+Trikona", hi: '' }, correctAnswer: true, explanation: { en: "Fundamental principle", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Kendras(1,4,7,10) Trikonas(1,5,9) Dusthanas(6,8,12)</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Kendras(1,4,7,10) Trikonas(1,5,9) Dusthanas(6,8,12)</p>
      </section>
    </div>
  );
}

export default function Module10_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

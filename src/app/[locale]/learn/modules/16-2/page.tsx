'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_16_2', phase: 5, topic: 'Classical', moduleNumber: '16.2',
  title: { en: "Hora Texts", hi: "होरा ग्रंथ" },
  subtitle: { en: "BPHS Phaladeepika Brihat Jataka", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q16_2_01', type: 'mcq', question: { en: "BPHS dashas?", hi: '' }, options: [{ en: "5", hi: '' }, { en: "10", hi: '' }, { en: "40+", hi: '' }, { en: "100+", hi: '' }], correctAnswer: 2, explanation: { en: "Most of any text", hi: '' } },
  { id: 'q16_2_02', type: 'true_false', question: { en: "Parashara is father", hi: '' }, correctAnswer: true, explanation: { en: "Named after him", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">BPHS=Bible 97ch. Phaladeepika=textbook</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">BPHS=Bible 97ch. Phaladeepika=textbook</p>
      </section>
    </div>
  );
}

export default function Module16_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

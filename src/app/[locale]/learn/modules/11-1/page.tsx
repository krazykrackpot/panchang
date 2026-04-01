'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_11_1', phase: 3, topic: 'Vargas', moduleNumber: '11.1',
  title: { en: "Why Divisional Charts", hi: "विभागीय चार्ट" },
  subtitle: { en: "D1 whole picture vargas zoom in", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q11_1_01', type: 'mcq', question: { en: "After D1?", hi: '' }, options: [{ en: "D3", hi: '' }, { en: "D10", hi: '' }, { en: "D9", hi: '' }, { en: "D60", hi: '' }], correctAnswer: 2, explanation: { en: "Navamsha most important", hi: '' } },
  { id: 'q11_1_02', type: 'true_false', question: { en: "16 vargas in BPHS", hi: '' }, correctAnswer: true, explanation: { en: "Shodashavarga Ch.6", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">D9=marriage D10=career 16 vargas Shodashavarga</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">D9=marriage D10=career 16 vargas Shodashavarga</p>
      </section>
    </div>
  );
}

export default function Module11_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

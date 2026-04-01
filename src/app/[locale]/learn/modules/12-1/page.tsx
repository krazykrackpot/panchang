'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_12_1', phase: 3, topic: 'Dashas', moduleNumber: '12.1',
  title: { en: "Vimshottari 120yr", hi: "विंशोत्तरी" },
  subtitle: { en: "9 planets divide life from Moon nakshatra", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q12_1_01', type: 'mcq', question: { en: "Total?", hi: '' }, options: [{ en: "100yr", hi: '' }, { en: "108yr", hi: '' }, { en: "120yr", hi: '' }, { en: "144yr", hi: '' }], correctAnswer: 2, explanation: { en: "Sum=120", hi: '' } },
  { id: 'q12_1_02', type: 'true_false', question: { en: "From Moon nakshatra", hi: '' }, correctAnswer: true, explanation: { en: "Nakshatra lord starts", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Birth nakshatra lord = starting dasha</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Birth nakshatra lord = starting dasha</p>
      </section>
    </div>
  );
}

export default function Module12_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

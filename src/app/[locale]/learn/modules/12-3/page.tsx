'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_12_3', phase: 3, topic: 'Dashas', moduleNumber: '12.3',
  title: { en: "Timing Events", hi: "घटना समय" },
  subtitle: { en: "Triple: promise + dasha + transit = event", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q12_3_01', type: 'mcq', question: { en: "Need?", hi: '' }, options: [{ en: "Dasha only", hi: '' }, { en: "Transit only", hi: '' }, { en: "All three", hi: '' }, { en: "Ayanamsha", hi: '' }], correctAnswer: 2, explanation: { en: "Triple must align", hi: '' } },
  { id: 'q12_3_02', type: 'true_false', question: { en: "Without promise still works", hi: '' }, correctAnswer: false, explanation: { en: "No promise=nothing", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Without promise nothing manifests</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Without promise nothing manifests</p>
      </section>
    </div>
  );
}

export default function Module12_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

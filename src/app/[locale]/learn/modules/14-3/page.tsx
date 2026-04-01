'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_14_3', phase: 4, topic: 'Compatibility', moduleNumber: '14.3',
  title: { en: "Beyond Kuta", hi: "कूट से परे" },
  subtitle: { en: "Chart analysis needed beyond Kuta", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q14_3_01', type: 'mcq', question: { en: "Kuta uses?", hi: '' }, options: [{ en: "Sun", hi: '' }, { en: "Moon", hi: '' }, { en: "Venus", hi: '' }, { en: "Jupiter", hi: '' }], correctAnswer: 1, explanation: { en: "Only Moon nakshatra", hi: '' } },
  { id: 'q14_3_02', type: 'true_false', question: { en: "High score = happy", hi: '' }, correctAnswer: false, explanation: { en: "Chart can override", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">7th house Venus Jupiter D9 also essential</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">7th house Venus Jupiter D9 also essential</p>
      </section>
    </div>
  );
}

export default function Module14_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

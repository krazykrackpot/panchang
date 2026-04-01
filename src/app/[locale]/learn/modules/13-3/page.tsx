'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_13_3', phase: 3, topic: 'Transits', moduleNumber: '13.3',
  title: { en: "Ashtakavarga Transit", hi: "अष्टकवर्ग गोचर" },
  subtitle: { en: "SAV 4+ good 0-3 poor", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q13_3_01', type: 'mcq', question: { en: "Favorable?", hi: '' }, options: [{ en: "0-3", hi: '' }, { en: "4+", hi: '' }, { en: "Exactly 8", hi: '' }, { en: "No matter", hi: '' }], correctAnswer: 1, explanation: { en: "4+ majority favorable", hi: '' } },
  { id: 'q13_3_02', type: 'true_false', question: { en: "SAV sums 7 planets", hi: '' }, correctAnswer: true, explanation: { en: "Max 56 per sign", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Bindus 0-8 per planet per sign</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Bindus 0-8 per planet per sign</p>
      </section>
    </div>
  );
}

export default function Module13_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_7_1', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.1',
  title: { en: "Panchang Yoga", hi: "पंचांग योग" },
  subtitle: { en: "27 yogas from Sun+Moon sum", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q7_1_01', type: 'mcq', question: { en: "Yoga uses?", hi: '' }, options: [{ en: "Difference", hi: '' }, { en: "Sum", hi: '' }, { en: "Product", hi: '' }, { en: "Ratio", hi: '' }], correctAnswer: 1, explanation: { en: "SUM not difference", hi: '' } },
  { id: 'q7_1_02', type: 'true_false', question: { en: "Same formula as Tithi", hi: '' }, correctAnswer: false, explanation: { en: "Tithi=diff Yoga=sum", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Yoga = floor((Sun+Moon)/13.333)+1</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Yoga = floor((Sun+Moon)/13.333)+1</p>
      </section>
    </div>
  );
}

export default function Module7_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

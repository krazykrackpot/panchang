'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_4', phase: 3, topic: 'Kundali', moduleNumber: '9.4',
  title: { en: "Reading a Chart", hi: "कुण्डली पठन" },
  subtitle: { en: "Complete worked example", hi: '' },
  estimatedMinutes: 15,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q9_4_01', type: 'mcq', question: { en: "Most important?", hi: '' }, options: [{ en: "Moon", hi: '' }, { en: "Sun", hi: '' }, { en: "Lagna", hi: '' }, { en: "10th house", hi: '' }], correctAnswer: 2, explanation: { en: "Lagna = foundation", hi: '' } },
  { id: 'q9_4_02', type: 'true_false', question: { en: "Start with Lagna lord", hi: '' }, correctAnswer: true, explanation: { en: "Sets the tone", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Identify Lagna lord assess dignity find yogas</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Identify Lagna lord assess dignity find yogas</p>
      </section>
    </div>
  );
}

export default function Module9_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_15_2', phase: 4, topic: 'Yogas Doshas', moduleNumber: '15.2',
  title: { en: "Raja Dhana Yogas", hi: "राज धन" },
  subtitle: { en: "Power and wealth combinations", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q15_2_01', type: 'mcq', question: { en: "Most powerful?", hi: '' }, options: [{ en: "Moon kendra", hi: '' }, { en: "Sun exalted", hi: '' }, { en: "9th+10th lords", hi: '' }, { en: "All one sign", hi: '' }], correctAnswer: 2, explanation: { en: "Purpose meets action", hi: '' } },
  { id: 'q15_2_02', type: 'true_false', question: { en: "Dhana 2nd+11th", hi: '' }, correctAnswer: true, explanation: { en: "Wealth+income", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">9th+10th = most powerful. 2nd+11th = wealth</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">9th+10th = most powerful. 2nd+11th = wealth</p>
      </section>
    </div>
  );
}

export default function Module15_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

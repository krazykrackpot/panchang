'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_1', phase: 3, topic: 'Kundali', moduleNumber: '9.1',
  title: { en: "What Is a Birth Chart", hi: "जन्म कुण्डली" },
  subtitle: { en: "Kundali freezes sky at birth", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q9_1_01', type: 'mcq', question: { en: "Lagna changes?", hi: '' }, options: [{ en: "24hr", hi: '' }, { en: "12hr", hi: '' }, { en: "~2hr", hi: '' }, { en: "30min", hi: '' }], correctAnswer: 2, explanation: { en: "12/24=~2hr", hi: '' } },
  { id: 'q9_1_02', type: 'true_false', question: { en: "Needs only date+time", hi: '' }, correctAnswer: false, explanation: { en: "Place essential", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Lagna changes ~2hr birth place affects calculations</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Lagna changes ~2hr birth place affects calculations</p>
      </section>
    </div>
  );
}

export default function Module9_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_7_3', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.3',
  title: { en: "Vara and Hora", hi: "वार एवं होरा" },
  subtitle: { en: "India weekday order from orbital speed Hora system", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q7_3_01', type: 'mcq', question: { en: "Skip how many?", hi: '' }, options: [{ en: "1", hi: '' }, { en: "2", hi: '' }, { en: "3", hi: '' }, { en: "5", hi: '' }], correctAnswer: 2, explanation: { en: "24 mod 7 = 3", hi: '' } },
  { id: 'q7_3_02', type: 'true_false', question: { en: "Sine from jya", hi: '' }, correctAnswer: true, explanation: { en: "jya>jiba>sinus>sine", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">24 mod 7 = 3 gives skip-3 pattern</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">24 mod 7 = 3 gives skip-3 pattern</p>
      </section>
    </div>
  );
}

export default function Module7_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

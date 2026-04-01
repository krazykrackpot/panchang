'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_7_2', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.2',
  title: { en: "Karana Half-Tithi", hi: "करण" },
  subtitle: { en: "11 karanas 7 chara + 4 sthira", hi: '' },
  estimatedMinutes: 11,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q7_2_01', type: 'mcq', question: { en: "Per tithi?", hi: '' }, options: [{ en: "1", hi: '' }, { en: "2", hi: '' }, { en: "3", hi: '' }, { en: "4", hi: '' }], correctAnswer: 1, explanation: { en: "12d/6d = 2", hi: '' } },
  { id: 'q7_2_02', type: 'true_false', question: { en: "11 types total", hi: '' }, correctAnswer: true, explanation: { en: "7+4=11", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Karana = floor((Moon-Sun)/6)+1 each tithi = 2</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Karana = floor((Moon-Sun)/6)+1 each tithi = 2</p>
      </section>
    </div>
  );
}

export default function Module7_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

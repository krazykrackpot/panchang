'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_2', phase: 3, topic: 'Kundali', moduleNumber: '9.2',
  title: { en: "Computing the Lagna", hi: "लग्न गणना" },
  subtitle: { en: "Local Sidereal Time oblique ascension", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q9_2_01', type: 'mcq', question: { en: "At equator?", hi: '' }, options: [{ en: "1hr", hi: '' }, { en: "2hr", hi: '' }, { en: "4hr", hi: '' }, { en: "6hr", hi: '' }], correctAnswer: 1, explanation: { en: "24/12=2hr", hi: '' } },
  { id: 'q9_2_02', type: 'true_false', question: { en: "Requires latitude", hi: '' }, correctAnswer: true, explanation: { en: "Affects oblique ascension", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">At equator each sign = 2hr exactly</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">At equator each sign = 2hr exactly</p>
      </section>
    </div>
  );
}

export default function Module9_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

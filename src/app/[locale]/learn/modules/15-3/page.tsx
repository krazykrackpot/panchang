'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_15_3', phase: 4, topic: 'Yogas Doshas', moduleNumber: '15.3',
  title: { en: "Common Doshas", hi: "प्रमुख दोष" },
  subtitle: { en: "Mangal Kala Sarpa formation effects remedies", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q15_3_01', type: 'mcq', question: { en: "Mangal from?", hi: '' }, options: [{ en: "Lagna only", hi: '' }, { en: "Moon only", hi: '' }, { en: "Lagna Moon Venus", hi: '' }, { en: "7th only", hi: '' }], correctAnswer: 2, explanation: { en: "All three", hi: '' } },
  { id: 'q15_3_02', type: 'true_false', question: { en: "Kala Sarpa all between", hi: '' }, correctAnswer: true, explanation: { en: "All 7 hemmed", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Mars 1,2,4,7,8,12. All between Rahu-Ketu</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Mars 1,2,4,7,8,12. All between Rahu-Ketu</p>
      </section>
    </div>
  );
}

export default function Module15_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

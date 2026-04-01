'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_11_3', phase: 3, topic: 'Vargas', moduleNumber: '11.3',
  title: { en: "Key Vargas D2 to D60", hi: "प्रमुख वर्ग" },
  subtitle: { en: "All 16+ divisional charts overview", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q11_3_01', type: 'mcq', question: { en: "D60 for?", hi: '' }, options: [{ en: "Career", hi: '' }, { en: "Past life karma", hi: '' }, { en: "Marriage", hi: '' }, { en: "Daily", hi: '' }], correctAnswer: 1, explanation: { en: "Most subtle chart", hi: '' } },
  { id: 'q11_3_02', type: 'true_false', question: { en: "App 17+ charts", hi: '' }, correctAnswer: true, explanation: { en: "19 total", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">D2=Wealth D7=Children D10=Career D60=Past karma</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">D2=Wealth D7=Children D10=Career D60=Past karma</p>
      </section>
    </div>
  );
}

export default function Module11_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

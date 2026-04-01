'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_9_3', phase: 3, topic: 'Kundali', moduleNumber: '9.3',
  title: { en: "Placing Planets", hi: "ग्रह स्थापन" },
  subtitle: { en: "Full pipeline birth time to house placement", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q9_3_01', type: 'mcq', question: { en: "Equal House?", hi: '' }, options: [{ en: "Variable", hi: '' }, { en: "30d", hi: '' }, { en: "13d20m", hi: '' }, { en: "60d", hi: '' }], correctAnswer: 1, explanation: { en: "30d from Lagna", hi: '' } },
  { id: 'q9_3_02', type: 'true_false', question: { en: "Bhav Chalit midpoint", hi: '' }, correctAnswer: true, explanation: { en: "Midpoint not start", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Equal House = 30d Bhav Chalit = midpoint system</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Equal House = 30d Bhav Chalit = midpoint system</p>
      </section>
    </div>
  );
}

export default function Module9_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

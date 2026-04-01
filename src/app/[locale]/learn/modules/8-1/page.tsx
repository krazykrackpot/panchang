'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_8_1', phase: 2, topic: 'Muhurta', moduleNumber: '8.1',
  title: { en: "30 Muhurtas Per Day", hi: "30 मुहूर्त" },
  subtitle: { en: "15 day + 15 night muhurtas each ~48min", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q8_1_01', type: 'mcq', question: { en: "Brahma Muhurta?", hi: '' }, options: [{ en: "Noon", hi: '' }, { en: "Before sunrise", hi: '' }, { en: "Sunset", hi: '' }, { en: "Midnight", hi: '' }], correctAnswer: 1, explanation: { en: "~96 min before sunrise", hi: '' } },
  { id: 'q8_1_02', type: 'true_false', question: { en: "30 per day", hi: '' }, correctAnswer: true, explanation: { en: "15+15=30", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Brahma ~96min before sunrise Abhijit at noon</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Brahma ~96min before sunrise Abhijit at noon</p>
      </section>
    </div>
  );
}

export default function Module8_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

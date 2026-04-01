'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_16_3', phase: 5, topic: 'Classical', moduleNumber: '16.3',
  title: { en: "India Contributions", hi: "भारत का योगदान" },
  subtitle: { en: "Sine weekdays zero pi", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q16_3_01', type: 'mcq', question: { en: "Weekday from?", hi: '' }, options: [{ en: "Bible", hi: '' }, { en: "Random", hi: '' }, { en: "Hora system", hi: '' }, { en: "Greek", hi: '' }], correctAnswer: 2, explanation: { en: "Skip-3 orbital speed", hi: '' } },
  { id: 'q16_3_02', type: 'true_false', question: { en: "Pi 3.1416 Aryabhata", hi: '' }, correctAnswer: true, explanation: { en: "Most precise ancient", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">jya→jiba→sinus→sine. Hora skip-3. Pi 3.1416</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">jya→jiba→sinus→sine. Hora skip-3. Pi 3.1416</p>
      </section>
    </div>
  );
}

export default function Module16_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

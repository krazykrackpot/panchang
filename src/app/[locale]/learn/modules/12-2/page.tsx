'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_12_2', phase: 3, topic: 'Dashas', moduleNumber: '12.2',
  title: { en: "Reading Dasha Periods", hi: "दशा पठन" },
  subtitle: { en: "Mahadasha theme Antardasha modulates", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q12_2_01', type: 'mcq', question: { en: "Antardasha?", hi: '' }, options: [{ en: "Instead of", hi: '' }, { en: "Within Mahadasha", hi: '' }, { en: "Eclipses", hi: '' }, { en: "12yr", hi: '' }], correctAnswer: 1, explanation: { en: "Within not instead", hi: '' } },
  { id: 'q12_2_02', type: 'true_false', question: { en: "Activates ruled houses", hi: '' }, correctAnswer: true, explanation: { en: "Rules AND occupies", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Events when dasha transit natal align</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Events when dasha transit natal align</p>
      </section>
    </div>
  );
}

export default function Module12_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

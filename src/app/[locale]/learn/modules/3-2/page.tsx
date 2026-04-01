'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_3_2', phase: 2, topic: 'Nakshatra', moduleNumber: '3.2',
  title: { en: "The 27 Nakshatras", hi: "27 नक्षत्र" },
  subtitle: { en: "Each nakshatra spans 13d20m identified by a yogtara", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q3_2_01', type: 'mcq', question: { en: "Span?", hi: '' }, options: [{ en: "30d", hi: '' }, { en: "13d20m", hi: '' }, { en: "12d", hi: '' }, { en: "27d", hi: '' }], correctAnswer: 1, explanation: { en: "360/27=13d20m", hi: '' } },
  { id: 'q3_2_02', type: 'true_false', question: { en: "Moon ~1 day per nakshatra", hi: '' }, correctAnswer: true, explanation: { en: "Sidereal ~27.3 days", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Nakshatra = floor(Moon/13.333)+1</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Nakshatra = floor(Moon/13.333)+1</p>
      </section>
    </div>
  );
}

export default function Module3_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

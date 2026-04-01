'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_6_2', phase: 2, topic: 'Nakshatra', moduleNumber: '6.2',
  title: { en: "Padas and Navamsha", hi: "पाद एवं नवांश" },
  subtitle: { en: "4 padas per nakshatra 108 total = navamsha count", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q6_2_01', type: 'mcq', question: { en: "Padas per nak?", hi: '' }, options: [{ en: "3", hi: '' }, { en: "4", hi: '' }, { en: "9", hi: '' }, { en: "12", hi: '' }], correctAnswer: 1, explanation: { en: "13d20m/4 = 3d20m", hi: '' } },
  { id: 'q6_2_02', type: 'true_false', question: { en: "One pada = one navamsha", hi: '' }, correctAnswer: true, explanation: { en: "108 padas = 108 navamshas", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Pada determines naming syllable and navamsha sign</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Pada determines naming syllable and navamsha sign</p>
      </section>
    </div>
  );
}

export default function Module6_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

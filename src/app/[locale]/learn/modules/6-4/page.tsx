'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_6_4', phase: 2, topic: 'Nakshatra', moduleNumber: '6.4',
  title: { en: "Gana Yoni Nadi", hi: "गण योनि नाडी" },
  subtitle: { en: "Nakshatra attributes drive Ashta Kuta matching", hi: '' },
  estimatedMinutes: 13,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q6_4_01', type: 'mcq', question: { en: "Nadi points?", hi: '' }, options: [{ en: "1", hi: '' }, { en: "4", hi: '' }, { en: "8", hi: '' }, { en: "12", hi: '' }], correctAnswer: 2, explanation: { en: "Nadi=8pts highest", hi: '' } },
  { id: 'q6_4_02', type: 'true_false', question: { en: "All 27 have Gana", hi: '' }, correctAnswer: true, explanation: { en: "9+9+9=27", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Deva/Manushya/Rakshasa 14 Yoni types Nadi=8pts</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Deva/Manushya/Rakshasa 14 Yoni types Nadi=8pts</p>
      </section>
    </div>
  );
}

export default function Module6_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

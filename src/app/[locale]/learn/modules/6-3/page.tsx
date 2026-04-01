'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_6_3', phase: 2, topic: 'Nakshatra', moduleNumber: '6.3',
  title: { en: "Nakshatra Dasha Lords", hi: "दशा स्वामी" },
  subtitle: { en: "Birth nakshatra determines starting Vimshottari dasha", hi: '' },
  estimatedMinutes: 14,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q6_3_01', type: 'mcq', question: { en: "Total cycle?", hi: '' }, options: [{ en: "100yr", hi: '' }, { en: "108yr", hi: '' }, { en: "120yr", hi: '' }, { en: "144yr", hi: '' }], correctAnswer: 2, explanation: { en: "7+20+6+10+7+18+16+19+17=120", hi: '' } },
  { id: 'q6_3_02', type: 'true_false', question: { en: "Venus longest 20yr", hi: '' }, correctAnswer: true, explanation: { en: "Venus=20yr", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{META.subtitle.en}</p>
        <p className="text-text-secondary text-sm leading-relaxed">Ketu→Venus→Sun→Moon→Mars→Rahu→Jup→Sat→Merc=120yr</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Key Concepts</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Ketu→Venus→Sun→Moon→Mars→Rahu→Jup→Sat→Merc=120yr</p>
      </section>
    </div>
  );
}

export default function Module6_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

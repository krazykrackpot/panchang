'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/16-2.json';

const META: ModuleMeta = {
  id: 'mod_16_2', phase: 5, topic: 'Classical', moduleNumber: '16.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Phaladeepika — The Practitioner&rsquo;s Handbook
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Phaladeepika (&ldquo;The Lamp of Results&rdquo;) was composed by Mantreshwara in the 13th century CE. With 28 chapters, it condenses the vast ocean of BPHS into a practical, working reference. Where BPHS is an encyclopedia, Phaladeepika is a handbook — every verse is directly usable in chart interpretation.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text is celebrated for its clear yoga descriptions. When a modern astrologer says &ldquo;Gajakesari Yoga gives fame and learning,&rdquo; that concise formulation often traces to Phaladeepika rather than BPHS. Mantreshwara had a gift for compression — stating in two lines what Parashara took a chapter to elaborate.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Planet-in-house results in Phaladeepika are particularly valued. Each chapter on bhava results gives crisp, memorable predictions for every planet placed there. These are the verses that astrologers memorize and apply in consultations — practical, testable, and time-proven over seven centuries of use.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Why Phaladeepika Endures</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Three qualities make Phaladeepika indispensable: brevity (no wasted verses), clarity (unambiguous language), and completeness within its scope (all essential topics covered). A student who masters Phaladeepika can read any birth chart competently. Many traditional gurukuls use it as the primary teaching text, introducing BPHS only for advanced topics.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Jataka Parijata — The Systematic Classifier
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Jataka Parijata (&ldquo;The Celestial Tree of Horoscopy&rdquo;) was composed by Vaidyanatha Dikshita in the 14th century. Its 18 chapters provide what is arguably the most systematic classification of planetary yogas in all Jyotish literature. While BPHS scatters yoga definitions across multiple chapters, Jataka Parijata organizes them into clean, hierarchical categories.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The text is particularly famous for its Raja Yoga definitions — the combinations that confer power, authority, and success. Vaidyanatha provides precise conditions: which house lords must combine, what aspects are required, and which additional factors strengthen or cancel the yoga. This precision makes the text invaluable for yoga identification in chart analysis.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Jataka Parijata also gives the most thorough treatment of Nabhasa Yogas — 32 pattern-based yogas determined by how planets distribute across houses. These include Yupa (all planets in 4 consecutive houses), Shara (planets in 4 alternate houses), and Chakra (planets in all odd or all even signs). These macro-patterns provide the overarching life theme before examining individual planet placements.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Key Jataka Parijata Contributions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Raja Yoga hierarchy:</span> Not all Raja Yogas are equal. Vaidyanatha ranks them by the houses involved — 1-9, 1-5, 4-10 lords combining produce different grades of power and fame.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Nabhasa Yogas:</span> 32 celestial patterns based on planetary distribution. These tell you the overall &ldquo;shape&rdquo; of a life before examining individual placements.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Cancellation rules:</span> Detailed conditions under which a yoga is cancelled (bhanga) by adverse factors — essential for accurate prediction.</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Comparative Analysis — When Texts Disagree
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Classical texts sometimes contradict each other. BPHS may call a planet a natural benefic while Phaladeepika adds conditions. A Raja Yoga defined broadly in BPHS may have stricter requirements in Jataka Parijata. These are not errors — they reflect different schools, different eras, and different observational emphases accumulated over centuries.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The working principle among experienced practitioners: use BPHS for foundational rules (planetary nature, house significations, dasha calculations). Use Phaladeepika for practical interpretation (what does this placement actually mean in daily life). Use Jataka Parijata for yoga identification (is this combination really a Raja Yoga or not). When all three agree, the prediction is strong. When they disagree, verify against the native&rsquo;s actual life events.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Myth:</span> &ldquo;If it is in BPHS, it must be exactly followed without question.&rdquo; Reality: BPHS has multiple recensions (manuscript versions), and some chapters were likely added later. Critical reading — comparing versions and checking internal consistency — is necessary.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Myth:</span> &ldquo;Newer texts are improvements over older ones.&rdquo; Reality: Phaladeepika and Jataka Parijata complement BPHS, they do not supersede it. Each text has domains where it excels. A skilled astrologer draws from all three as context demands.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Our App&rsquo;s Approach</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our yoga detection engine implements definitions from all three texts, prioritizing BPHS for foundational rules and cross-referencing Phaladeepika and Jataka Parijata for yoga classification. When texts disagree on a yoga condition, we follow the stricter definition — it is better to miss a marginal yoga than to flag a false one. The tippanni commentary notes which text supports each interpretation.
        </p>
      </section>
    </div>
  );
}

export default function Module16_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

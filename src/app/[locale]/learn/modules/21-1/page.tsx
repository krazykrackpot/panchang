'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/21-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';

const META: ModuleMeta = {
  id: 'mod_21_1', phase: 8, topic: 'Varshaphal', moduleNumber: '21.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Tajika aspects are unique to Varshaphal — Ithasala (applying aspect) means the event will happen; Easarapha (separating) means it already passed.',
          'Nakta (transferred aspect via a third planet) can save a failed Ithasala — the middleman planet carries the promise forward.',
          'Tajika uses degree-based orbs with application/separation — fundamentally different from Parashari fixed-sign aspects.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Tajika: The Perso-Arabic Layer of Indian Astrology', hi: 'ताजिक: भारतीय ज्योतिष की फारसी-अरबी परत', sa: 'ताजिकम्: भारतीयज्योतिषस्य फारसी-अरबी-स्तरः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Tajika is a system of annual horoscopy (Varshaphal) absorbed into Indian astrology around the 12th century CE through Perso-Arabic scholarly exchanges. The word &quot;Tajika&quot; derives from &quot;Tajik&quot; (Persian). While Parashari astrology uses fixed aspects — the 7th house opposition is always full-strength, the 5th/9th trine aspects are always operative — Tajika uses APPLYING and SEPARATING aspects with degree-based orbs, much like the Western horary tradition from which it partly derives.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The key question Tajika answers is: &quot;Will the event promised in the annual chart actually come to pass THIS YEAR?&quot; Five Tajika yogas provide the answer: Ithasala (application — yes), Easarapha (separation — opportunity passed), Nakta (transfer of light — event via intermediary), Yamaya (prohibition — event blocked), and Manaoo (no application — event will not happen).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'How Tajika Differs from Parashari Aspects', hi: 'ताजिक पाराशरी दृष्टियों से कैसे भिन्न है', sa: 'ताजिक-पाराशरी-दृष्टि-भेदः' }, locale)}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary py-1 pr-3">Feature</th>
                <th className="text-left text-gold-light py-1 pr-3">Parashari</th>
                <th className="text-left text-gold-light py-1">Tajika</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Aspect type</td><td className="py-1 pr-3">Sign-based (fixed)</td><td className="py-1">Degree-based (with orbs)</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Direction</td><td className="py-1 pr-3">Always active</td><td className="py-1">Applying vs Separating</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Speed matters?</td><td className="py-1 pr-3">No</td><td className="py-1">Yes — faster planet applies</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Chart type</td><td className="py-1 pr-3">Natal (birth)</td><td className="py-1">Annual (Varshaphal)</td></tr>
              <tr><td className="py-1 pr-3">Answer</td><td className="py-1 pr-3">Tendency</td><td className="py-1">Yes/No for this year</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The foundational Indian text on Tajika is the &quot;Tajika Neelakanthi&quot; by Neelakantha Daivagnya (16th century CE). Earlier, Samarasimha&apos;s &quot;Karmaprakasha&quot; (13th century) was among the first Indian works to incorporate Tajika principles. The system has parallels to the Arabic &quot;al-Qabisi&quot; and the Hellenistic application/separation doctrines found in Ptolemy and Dorotheus. Indian astrologers fully assimilated these techniques while maintaining the Parashari dasha framework.
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
          {tl({ en: 'The Five Tajika Yogas — Complete Guide', hi: 'पाँच ताजिक योग — सम्पूर्ण मार्गदर्शिका', sa: 'पञ्च ताजिकयोगाः — सम्पूर्णमार्गदर्शिका' }, locale)}
        </h3>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20 rounded-xl p-4">
            <h5 className="text-emerald-400 text-sm font-bold mb-2">1. Ithasala (Application) — &quot;Yes, the event WILL happen&quot;</h5>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">A faster planet is approaching a slower planet within their mutual orb of aspect. The faster planet must be at a LOWER degree than the slower planet. When Ithasala forms between two significator planets, the event they promise WILL manifest during the year. The closer the application, the sooner the event.</p>
            <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example:</span> Venus (1°/day) at 10° Taurus applying to Jupiter (0.08°/day) at 15° Taurus. Gap = 5°, within orb. Clear Ithasala — the event Jupiter signifies WILL happen.</p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/20 rounded-xl p-4">
            <h5 className="text-red-400 text-sm font-bold mb-2">2. Easarapha (Separation) — &quot;Opportunity has passed&quot;</h5>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">The two planets have already passed their exact aspect and are moving apart. The faster planet is at a HIGHER degree than the slower planet. The window existed but has closed.</p>
            <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example:</span> Venus at 17° Taurus, Jupiter at 15° Taurus. Venus has already passed Jupiter. The opportunity was there but the native missed it or it resolved before the year began.</p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 rounded-xl p-4">
            <h5 className="text-amber-400 text-sm font-bold mb-2">3. Nakta (Transfer of Light) — &quot;Event via intermediary&quot;</h5>
            <p className="text-text-secondary text-xs leading-relaxed">Two significator planets cannot directly aspect each other, but a third planet separates from one and applies to the other, &quot;transferring the light.&quot; The event happens but through a mediator — a friend, agent, or unexpected channel.</p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/20 rounded-xl p-4">
            <h5 className="text-red-400 text-sm font-bold mb-2">4. Yamaya (Prohibition) — &quot;Event blocked&quot;</h5>
            <p className="text-text-secondary text-xs leading-relaxed">A third planet interposes between two applying planets, blocking the Ithasala before it perfects. The blocking planet&apos;s nature indicates what causes the obstruction — Saturn = delays, Mars = conflict, Rahu = deception.</p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 rounded-xl p-4">
            <h5 className="text-text-secondary text-sm font-bold mb-2">5. Manaoo (Refusal) — &quot;No event this year&quot;</h5>
            <p className="text-text-secondary text-xs leading-relaxed">Neither planet applies to the other — no aspect is forming. The event simply will not manifest this year. No drama, no near-miss — it is not on the cosmic agenda for this annual cycle.</p>
          </div>
        </div>
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
          {tl({ en: 'Applying Tajika in Varshaphal Analysis', hi: 'वर्षफल विश्लेषण में ताजिक का अनुप्रयोग', sa: 'वर्षफलविश्लेषणे ताजिकस्य प्रयोगः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In practice, the astrologer examines the Varshaphal (annual return) chart and identifies which Tajika yogas form between the year lord (Varsheshvara) and other planets. The year lord is the planet with the highest Pancha-vargiya Bala (five-fold strength). If the year lord forms Ithasala with the 7th lord, it is a marriage/partnership year. Ithasala with 10th lord signals career advancement. Easarapha with 5th lord means an educational opportunity was missed.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The timing within the year is refined using Mudda Dasha (Module 21-3). The Tajika yoga tells you IF the event will happen; the Mudda Dasha tells you WHICH MONTH. Together with Sahams (Module 21-2), this creates a comprehensive annual prediction framework.
        </p>
        <WhyItMatters locale={locale}>
          Tajika yogas transform the annual chart from a static snapshot into a dynamic prediction of what will and will not manifest. Without them, you see potential but cannot determine fulfilment. With them, you can give clients specific yes/no answers for their year ahead — the most valued form of astrological guidance.
        </WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          Worked Example
        </h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Varshaphal chart:</span> Year lord Venus at 10° Taurus, Jupiter at 15° Taurus. Venus moves ~1°/day, Jupiter ~0.08°/day — Venus is faster. Venus at lower degree (10°) applying to Jupiter (15°). Gap = 5°, within standard orb. Clear Ithasala.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Result:</span> If Jupiter rules the 10th house in the annual chart, career advancement is promised this year. The Ithasala will perfect when Venus reaches 15° — approximately 5 days after the solar return, suggesting the career event happens early in the year.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">What if Saturn at 12° Taurus?</span> Saturn interposes between Venus (10°) and Jupiter (15°). Venus must pass Saturn before reaching Jupiter. This is Yamaya (prohibition) — career advancement is blocked or delayed by Saturn-related factors (bureaucracy, senior opposition, systemic obstacles).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;Tajika aspects replace Parashari aspects.&quot; They do not. Tajika aspects are used ONLY within the Varshaphal (annual chart) framework. For the natal chart, Parashari aspects remain the standard.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;Easarapha always means failure.&quot; Easarapha means the exact opportunity window has passed, but it does not mean the life area is permanently closed. A new annual chart next year may show Ithasala for the same houses.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Our <span className="text-gold-light">Varshaphal tool</span> automatically computes all Tajika yogas between every planet pair in the annual chart, highlighting Ithasala formations (events that WILL happen) and Easarapha formations (missed opportunities). See <span className="text-gold-light">Module 21-2 (Sahams)</span> for sensitive points and <span className="text-gold-light">Module 21-3 (Mudda Dasha)</span> for monthly timing within the annual cycle.
        </p>
      </section>

      <QuickCheck
        question="In Tajika, what does Ithasala (applying aspect) between two significator planets indicate?"
        options={['The event happened in the past', 'The event will happen this year', 'The event is blocked', 'The event will happen via a third party']}
        correctIndex={1}
        explanation="Ithasala (application) means a faster planet is approaching a slower planet within orb. When this forms between event significators, the promised event WILL manifest during the annual period."
      />
    </div>
  );
}

export default function Module21_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

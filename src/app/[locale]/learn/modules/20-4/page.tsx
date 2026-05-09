'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-4.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import QuickCheck from '@/components/learn/QuickCheck';

const META: ModuleMeta = {
  id: 'mod_20_4', phase: 7, topic: 'KP System', moduleNumber: '20.4',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
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
          'Ruling planets at the moment of judgment (current Lagna lord, Moon sign lord, Moon star lord, day lord) confirm and time predictions.',
          'If a significator\'s dasha sub-period lord matches a ruling planet, the event is likely to manifest during that exact sub-period.',
          'Ruling planets that repeat across multiple roles (e.g., both Moon star lord AND Lagna sign lord) carry extra weight.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Are Ruling Planets?', hi: 'शासक ग्रह क्या हैं?', sa: 'शासक ग्रह क्या हैं?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Ruling planets are KP&apos;s elegant solution to the most important question in astrology: WHEN will a predicted event actually happen? At the exact moment when an astrologer sits down to analyse a chart or when a querent asks a question, the cosmos provides five pointers — five ruling planets — that indicate which planetary periods will deliver the event. These are derived from the current sky, not from the birth chart.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The five ruling planets are: (1) <strong className="text-gold-light">Moon&apos;s Sign Lord</strong> — the planet ruling the rashi the Moon is currently transiting. (2) <strong className="text-gold-light">Moon&apos;s Star Lord</strong> — the planet ruling the nakshatra the Moon is currently in. (3) <strong className="text-gold-light">Lagna Sign Lord</strong> — the planet ruling the rashi rising on the eastern horizon at that moment. (4) <strong className="text-gold-light">Lagna Star Lord</strong> — the planet ruling the nakshatra of the current Ascendant degree. (5) <strong className="text-gold-light">Day Lord</strong> — the planet that rules the current weekday.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">How to Compute Ruling Planets</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 1:</span> Note the exact moment (date, time, location) when you begin analysing the question.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 2:</span> Compute the Moon&apos;s current sidereal longitude. From this, derive the sign (rashi lord = Moon sign lord) and nakshatra (star lord = Moon star lord).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 3:</span> Compute the current Ascendant (Lagna) degree. Derive the rashi lord (Lagna sign lord) and nakshatra lord (Lagna star lord).</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Step 4:</span> Identify the day lord from the weekday (Sun for Sunday, Moon for Monday, etc.). You now have 5 ruling planets — some may repeat, which strengthens them.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The idea that the moment of a question carries its own answer is rooted in the ancient Prashna (horary) tradition. Krishnamurti refined this into the ruling planets concept — extracting five key planetary pointers from the query moment and using them as a filter to narrow down dasha timing from the birth chart. This synthesis of horary principles with natal dasha analysis is uniquely KP.
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
          {tl({ en: 'Using Ruling Planets for Timing', hi: 'समय-निर्धारण हेतु शासक ग्रहों का उपयोग', sa: 'समय-निर्धारण हेतु शासक ग्रहों का उपयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The process works in three steps. First, cast a chart for the current moment and compute the five ruling planets. Second, compare these ruling planets against the significator table from the birth chart — find which ruling planets are also significators of the relevant event houses. Third, the dasha/bhukti/antara sequence that involves the most ruling-planet-significator matches is the timing window for the event.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          If a ruling planet appears multiple times (e.g., it is both the Moon&apos;s star lord and the Lagna sign lord), it carries extra weight. If 3 or more of the 5 ruling planets also signify the event&apos;s houses, the prediction carries high confidence. If fewer than 2 match, the astrologer may need to wait for a more favourable moment to re-analyse, or the event may be denied.
        </p>
        <WhyItMatters locale={locale}>
          Ruling planets bridge the gap between &quot;this event is promised in your chart&quot; and &quot;this event will happen in March 2027.&quot; Without ruling planets, KP can identify WHAT is promised but not WHEN with precision. With them, timing accuracy reaches weeks or even days.
        </WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          Worked Example — Marriage Timing
        </h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Query: &quot;When will I get married?&quot;</span> Analysis moment: Tuesday at 10:15 AM. Moon at 22° Taurus (Rohini nakshatra). Ascendant at 8° Cancer (Pushya nakshatra).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Ruling planets:</span> (1) Moon sign lord = Venus (Taurus). (2) Moon star lord = Moon (Rohini). (3) Lagna sign lord = Moon (Cancer). (4) Lagna star lord = Saturn (Pushya). (5) Day lord = Mars (Tuesday). <strong>Result:</strong> Venus, Moon (repeated twice), Saturn, Mars.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Cross-check with birth chart:</span> Venus signifies 7th house (Level 1 — occupies 7th) and 2nd house (Level 3 — owns Taurus on 2nd cusp). Venus is both a ruling planet AND a Level 1 significator of the 7th house (marriage) = highest confidence.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Timing:</span> Marriage will occur during Venus-Moon or Moon-Venus dasha/bhukti period. The Moon repeating twice among ruling planets adds further confirmation.
        </p>
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
          {tl({ en: 'Refining with Transits and Prashna Use', hi: 'गोचर और प्रश्न में प्रयोग', sa: 'गोचर और प्रश्न में प्रयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Once the dasha/bhukti period is identified, KP uses one final technique to pinpoint the exact date: transit of ruling planets over the relevant cusp sub-lord positions. The event manifests when one or more ruling planets transit over the star or sub of the relevant house cusp sub-lord. This three-layer approach — significators (what), ruling planets (who/when at dasha level), and transits (when at date level) — gives KP its reputation for precise event timing.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Ruling planets in Prashna (horary):</strong> In pure Prashna practice, there is no birth chart at all. The querent picks a number between 1-249 (KP number), and the astrologer casts a chart for that moment. The ruling planets of the Prashna moment serve double duty — they confirm whether the answer is affirmative AND indicate timing. If the ruling planets do not signify the queried house, the answer is &quot;no&quot; or &quot;not now.&quot;
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This makes ruling planets the most versatile tool in KP — they work for natal chart timing, horary questions, and even for verifying whether the chart is fit for reading (if the ruling planets are incoherent with the question topic, some KP practitioners advise waiting and re-casting).
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          Common Misconceptions
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;Ruling planets alone can predict events without a birth chart.&quot; Ruling planets are a TIMING FILTER, not a standalone prediction system. You still need the birth chart&apos;s significator table to know WHAT events are promised. Ruling planets only tell you WHEN.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;If a planet appears as a ruling planet, it must be strong.&quot; A ruling planet can be weak, debilitated, or retrograde. Its role as a ruling planet indicates timing relevance, not inherent strength. The birth chart still determines whether the planet delivers positive or negative results.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          Modern Relevance
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The ruling planets technique has made KP especially popular for live consultation sessions. When a client asks &quot;When will I get a job?&quot;, the astrologer computes ruling planets for that exact moment, cross-references with the birth chart significators, and can often give a specific month or week. Our <span className="text-gold-light">KP System tool</span> computes ruling planets in real-time, showing their match percentage with the birth chart&apos;s significator table. See <span className="text-gold-light">Module 20.1 (Placidus Houses)</span> for house computation, and <span className="text-gold-light">Module 20.2 (Sub-Lords)</span> for the significator table that ruling planets are matched against.
        </p>
      </section>

      <QuickCheck
        question="How many ruling planets does KP derive from the moment of analysis?"
        options={['3 (Moon lord, Lagna lord, Day lord)', '5 (Moon sign/star, Lagna sign/star, Day lord)', '7 (one for each classical planet)', '9 (one for each graha)']}
        correctIndex={1}
        explanation="KP derives 5 ruling planets: Moon's sign lord, Moon's star lord, Lagna sign lord, Lagna star lord, and the Day lord. Some may repeat, which strengthens their significance."
      />
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Advanced Ruling Planet Techniques
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Eliminating retrograde ruling planets:</strong> Some KP practitioners exclude retrograde planets from the ruling planet list. If a ruling planet is retrograde at the moment of analysis, it may delay rather than deliver the event. However, this is debated — the original Krishnamurti texts do not explicitly exclude retrogrades, and many practitioners include them with a note of caution.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Sub-lord of ruling planets:</strong> Advanced KP takes the analysis one level deeper — instead of just using the ruling planet itself, check which sub it occupies. If a ruling planet&apos;s sub-lord does not signify the queried houses, that ruling planet is weakened as a timing indicator. This filtering creates a shorter, more precise list of active timing planets.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Ruling planets for date selection:</strong> Beyond prediction, ruling planets can be used proactively. If you want to start a business, find a date when the ruling planets match the significators of houses 2 (income), 7 (partnership), 10 (career), and 11 (gains) from your birth chart. This turns KP into a muhurta selection tool — more precise than classical Panchang-based muhurta because it is personalised to your birth chart.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Ruling Planets vs Classical Muhurta</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Classical muhurta:</span> Based on Panchang elements (nakshatra, tithi, yoga, karana, vara). Same for everyone on a given day. Good for general auspiciousness.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">KP ruling planet muhurta:</span> Based on matching ruling planets to YOUR birth chart significators. Different for each person. Good for personalised event timing. Both approaches are valid — ideally, use classical muhurta as a baseline and refine with ruling planet matching for the individual.</p>
      </section>
    </div>
  );
}

export default function Module20_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

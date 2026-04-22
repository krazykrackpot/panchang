'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/7-2.json';

const META: ModuleMeta = {
  id: 'mod_7_2', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 13,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Karana — The Half-Tithi</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">A karana is the smallest temporal unit in the Panchang system. It represents half of a tithi — 6° of Moon-Sun elongation. Since a lunar month contains 30 tithis and each tithi has two karanas, there are 60 karanas per month. Despite being the finest subdivision, the karana carries distinct astrological significance, especially when it comes to avoiding inauspicious windows.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">There are 11 named karanas in total, divided into two categories. The 7 Chara (movable) karanas cycle repeatedly through the month: Bava, Balava, Kaulava, Taitila, Gara, Vanija, and Vishti (also called Bhadra). These 7 names cycle through 8 complete rounds to fill 56 of the 60 slots. The remaining 4 are Sthira (fixed) karanas that appear only once each: Kimstughna (slot 1, first half of Shukla Pratipada), and Shakuni, Chatushpada, Naga (slots 58, 59, 60, at the end of Krishna Amavasya).</p>
        <p className="text-text-secondary text-sm leading-relaxed">Among the Chara karanas, each has a distinct character: Bava brings strength, Balava brings auspiciousness, Kaulava friendship, Taitila worldly success, Gara agricultural prosperity, and Vanija commercial gain. Vishti (Bhadra), however, is the notorious exception — it is considered deeply inauspicious for all new beginnings.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">Karanas are described in the Surya Siddhanta and elaborated in Muhurta Chintamani and BPHS. The Vishti (Bhadra) karana receives special attention in Dharmashastra texts — the Dharmasindhu devotes an entire section to determining whether Bhadra is in its &quot;mukha&quot; (face, heavenly position) or &quot;puchha&quot; (tail, earthly position), as this distinction modulates the intensity of its malefic effects. The four-fold Sthira karana system reflects the ancient recognition that certain lunar phases at the month&apos;s edges carry unique energy.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vishti (Bhadra) — The Critical Karana</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Vishti, popularly known as Bhadra, is the seventh Chara karana and the most feared element in the karana system. It appears approximately 8 times each lunar month (once in every cycle of 7 Chara karanas across the 56 Chara slots). During Bhadra, classical texts strongly advise against starting journeys, marriages, new businesses, griha-pravesha (housewarming), and religious ceremonies.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">However, Bhadra is not uniformly malefic. The tradition distinguishes between Bhadra Mukha (face) and Bhadra Puchha (tail). When Bhadra is in Swarga (heaven) or Patala (nether world), the inauspicious effects are diminished or even neutralized. When Bhadra is on Prithvi (earth), the malefic effects are at full strength. The position depends on the specific tithi during which Vishti occurs — texts provide tables mapping each Vishti occurrence to its celestial, terrestrial, or nether position.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Certain activities are actually suited to Bhadra: antagonistic actions such as filing legal battles, breaking alliances, demolition work, or removing obstacles are considered empowered during Vishti. This reflects the Jyotish principle that no time is universally bad — the character of the time should match the character of the action.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Moon-Sun elongation = 179°. Karana index = floor(179 / 6) = 29. Mapping: index 0 = Kimstughna (fixed). Indices 1-56 cycle through the 7 Chara karanas. For index 29: (29 - 1) mod 7 = 0, mapping to Bava (the 1st Chara karana). Bava is auspicious — suitable for new ventures.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2:</span> Elongation = 42°. Index = floor(42 / 6) = 7. (7 - 1) mod 7 = 6, mapping to Vishti (Bhadra, the 7th Chara karana). Check the tithi: 42° / 12° = Tithi 4 (Chaturthi). During Shukla Chaturthi, Bhadra is said to be in Patala — effects diminished. Nonetheless, caution is advised.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3:</span> Elongation = 354°. Index = floor(354 / 6) = 59. Index 59 is slot 60 (0-based 59) = Naga (fixed karana). Naga appears only once per month, near the end of Krishna Amavasya. It is considered neutral to mildly inauspicious.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Calculation Details and Modern Practice</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The karana calculation derives directly from the Moon-Sun elongation used for tithis. Compute the sidereal elongation (Moon longitude minus Sun longitude, normalized to 0-360°), then divide by 6° to get the karana index (0-59). The mapping to karana names follows this pattern: index 0 = Kimstughna (fixed), indices 1-56 cycle through {'{'}Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti{'}'} using (index - 1) mod 7, and indices 57-59 map to Shakuni, Chatushpada, Naga (fixed).</p>
        <p className="text-text-secondary text-sm leading-relaxed">In our app, the karana is computed alongside the tithi from the same elongation value. Start and end times are found by determining when the elongation crosses each 6° boundary. Because the Moon&apos;s speed varies (roughly 12-15° per day), karana durations range from about 9 to 13 hours — roughly half a day, but never exactly half.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Karana is too small to matter — only Tithi and Nakshatra count.&quot; While Karana is the finest Panchang subdivision, Vishti (Bhadra) is one of the strongest prohibitive factors in muhurta selection. Ignoring it can undermine an otherwise well-chosen window.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;All Bhadra periods are equally bad.&quot; The Bhadra mukha/puchha distinction is critical. Classical texts are clear that Bhadra in heaven or Patala is far less harmful than Bhadra on earth.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;There are only 7 karanas.&quot; There are 11 named karanas in total — 7 Chara and 4 Sthira. The Sthira karanas are easily overlooked because they appear only once each per month at the edges of the cycle.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Every printed Panchang in India lists the karana alongside the other four elements. In digital muhurta engines — including our Muhurta AI — Vishti karana triggers an automatic penalty in the scoring algorithm. Wedding planners, business consultants using Jyotish, and temple priests routinely check for Bhadra before finalizing ceremony times. The karana provides the last layer of temporal refinement in the five-limb system.</p>
      </section>
    </div>
  );
}

export default function Module7_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

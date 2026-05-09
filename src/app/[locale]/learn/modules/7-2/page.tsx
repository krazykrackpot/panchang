'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/7-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import ClassicalReference from '@/components/learn/ClassicalReference';
import BeginnerNote from '@/components/learn/BeginnerNote';
import QuickCheck from '@/components/learn/QuickCheck';

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
      <KeyTakeaway
        points={[
          'Karanas are the half-tithis — 60 per lunar month, cycling through 7 moving (Chara) + 4 fixed (Sthira) types.',
          'Vishti (Bhadra) karana is the most feared time window in muhurta selection — avoid all new beginnings during it.',
          'Each Chara karana has a distinct quality: Bava = strength, Balava = auspiciousness, Kaulava = friendship, Taitila = worldly success.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Karana — The Half-Tithi</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">A karana is the smallest temporal unit in the Panchang system. It represents half of a tithi — 6° of Moon-Sun elongation. Since a lunar month contains 30 tithis and each tithi has two karanas, there are 60 karanas per month. Despite being the finest subdivision, the karana carries distinct astrological significance, especially when it comes to avoiding inauspicious windows.</p>
        <div className="text-text-secondary text-sm leading-relaxed mb-3">
          <p className="mb-2">There are 11 named karanas in total, divided into two categories:</p>
          <p className="mb-2"><strong className="text-gold-light">The Karana Cycle Pattern:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
            <li><BeginnerNote term="Kimstughna" explanation="The first fixed karana. Appears only once per month at the very start — first half of Shukla Pratipada. Considered neutral." /> (Sthira, slot 1)</li>
            <li>Slots 2-57: The 7 <BeginnerNote term="Chara Karana" explanation="Movable karanas that cycle repeatedly. The 7 names (Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti) repeat 8 times to fill 56 slots." /> names cycle 8 times: Bava, Balava, Kaulava, Taitila, Gara, Vanija, <BeginnerNote term="Vishti" explanation="Also called Bhadra. The 7th Chara karana, considered deeply inauspicious for new beginnings. Appears ~8 times per month." /> (Bhadra)</li>
            <li>Shakuni, Chatushpada, Naga (<BeginnerNote term="Sthira Karana" explanation="Fixed karanas that appear only once per lunar month, at the very end of the cycle (slots 58-60). They mark the edges of Krishna Amavasya." />, slots 58-60)</li>
          </ul>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">Among the Chara karanas, each has a distinct character: Bava brings strength, Balava brings auspiciousness, Kaulava friendship, Taitila worldly success, Gara agricultural prosperity, and Vanija commercial gain. Vishti (<BeginnerNote term="Bhadra" explanation="Another name for Vishti karana. From the word 'Bhadra' meaning 'auspicious' — used ironically, as this karana is the opposite. Distinguished from Bhadra Tithi which IS auspicious." />), however, is the notorious exception — it is considered deeply inauspicious for all new beginnings.</p>
        <WhyItMatters locale={locale}>
          Karanas determine the quality of time for activities — Vishti (Bhadra) is avoided for all auspicious work, while Bava and Balava are considered beneficial. In muhurta selection, karana is the last checkpoint: an otherwise perfect time window is rejected if it falls during Bhadra.
        </WhyItMatters>
      </section>
      <ClassicalReference shortName="SS" topic="Karanas — the half-tithi system and its 11 named types" />
      <ClassicalReference shortName="MC" topic="Vishti (Bhadra) karana — when to avoid and when its destructive energy can be channeled" />

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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Complete Karana Table — All 11 Types</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Understanding karana requires knowing all 11 types, their nature, and which activities they favour. The following table summarises the complete system.</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary text-xs py-2 pr-3">Karana</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">Type</th>
                <th className="text-left text-gold-light text-xs py-2 pr-3">Deity</th>
                <th className="text-left text-gold-light text-xs py-2">Nature &amp; Suited Activities</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-xs">
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Bava</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Indra</td><td className="py-1.5">Strength — government work, authority matters, bold initiatives</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Balava</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Brahma</td><td className="py-1.5">Auspiciousness — religious ceremonies, marriages, sacred rituals</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Kaulava</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Mitra</td><td className="py-1.5">Friendship — forming alliances, social gatherings, reconciliation</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Taitila</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Aryama</td><td className="py-1.5">Worldly success — business ventures, property, material pursuits</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Gara</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Prithvi</td><td className="py-1.5">Agriculture — planting, harvesting, land-related activities</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Vanija</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Lakshmi</td><td className="py-1.5">Commerce — trade, buying/selling, financial transactions</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-red-400">Vishti</td><td className="py-1.5 pr-3">Chara</td><td className="py-1.5 pr-3">Yama</td><td className="py-1.5">Inauspicious — avoid new beginnings; suited only for destructive actions</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-gold-light">Kimstughna</td><td className="py-1.5 pr-3">Sthira</td><td className="py-1.5 pr-3">Maruts</td><td className="py-1.5">Neutral — appears only at cycle start (Shukla Pratipada 1st half)</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-amber-400">Shakuni</td><td className="py-1.5 pr-3">Sthira</td><td className="py-1.5 pr-3">Garuda</td><td className="py-1.5">Mildly inauspicious — slot 58, near end of Krishna Paksha</td></tr>
              <tr className="border-b border-white/5"><td className="py-1.5 pr-3 text-amber-400">Chatushpada</td><td className="py-1.5 pr-3">Sthira</td><td className="py-1.5 pr-3">Vrishabha</td><td className="py-1.5">Mildly inauspicious — slot 59, penalised in muhurta scoring</td></tr>
              <tr><td className="py-1.5 pr-3 text-amber-400">Naga</td><td className="py-1.5 pr-3">Sthira</td><td className="py-1.5 pr-3">Naga</td><td className="py-1.5">Mildly inauspicious — slot 60, final karana before Amavasya ends</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">The Sthira karanas (Shakuni, Chatushpada, Naga) are often overlooked because they appear only once each per month. However, muhurta engines — including our Muhurta AI — penalise these periods alongside Vishti. The penalty for Sthira karanas is lighter than for Vishti, but they are not considered favourable for auspicious beginnings.</p>
      </section>
      <QuickCheck
        question="How many Chara (movable) karanas exist in the system?"
        options={['4', '7', '11', '30']}
        correctIndex={1}
        explanation="There are 7 Chara karanas (Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti) that cycle 8 times to fill 56 of the 60 slots. The remaining 4 are Sthira (fixed) karanas."
      />
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vishti (Bhadra) — The Critical Karana</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Vishti, popularly known as Bhadra, is the seventh Chara karana and the most feared element in the karana system. It appears approximately 8 times each lunar month (once in every cycle of 7 Chara karanas across the 56 Chara slots). During Bhadra, classical texts strongly advise against starting journeys, marriages, new businesses, griha-pravesha (housewarming), and religious ceremonies.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">However, Bhadra is not uniformly malefic. The tradition distinguishes between Bhadra Mukha (face) and Bhadra Puchha (tail). When Bhadra is in Swarga (heaven) or Patala (nether world), the inauspicious effects are diminished or even neutralised. When Bhadra is on Prithvi (earth), the malefic effects are at full strength. The position depends on the specific tithi during which Vishti occurs — texts provide tables mapping each Vishti occurrence to its celestial, terrestrial, or nether position.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Certain activities are actually suited to Bhadra: antagonistic actions such as filing legal battles, breaking alliances, demolition work, or removing obstacles are considered empowered during Vishti. This reflects the Jyotish principle that no time is universally bad — the character of the time should match the character of the action.</p>
        <WhyItMatters locale={locale}>
          Bhadra is not uniformly malefic — the mukha/puchha distinction is critical. When Bhadra is in heaven or Patala (netherworld), the inauspicious effects are significantly diminished. Only Bhadra on Earth carries full malefic force. This nuance separates a casual panchang reader from a serious muhurta practitioner.
        </WhyItMatters>
      </section>

      {/* Vishti Rules Table */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Vishti Karana Rules for Muhurta</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-red-400 font-medium">Absolute avoid:</span> Marriage, griha-pravesha, mundan (first haircut), naming ceremony, business launch, journey commencement, signing contracts, beginning education.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-amber-400 font-medium">Conditionally acceptable:</span> If Bhadra is in Swarga or Patala (not Earth), some texts permit minor activities with strong compensating factors (excellent nakshatra + yoga).</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-emerald-400 font-medium">Actually suited:</span> Litigation, demolition, debt collection, removing enemies, breaking partnerships, aggressive medical procedures, clearing obstacles.</p>
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

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Calculation Details and Modern Practice</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The karana calculation derives directly from the Moon-Sun elongation used for tithis. Compute the sidereal elongation (Moon longitude minus Sun longitude, normalised to 0-360°), then divide by 6° to get the karana index (0-59). The mapping to karana names follows this pattern: index 0 = Kimstughna (fixed), indices 1-56 cycle through {'{'}Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti{'}'} using (index - 1) mod 7, and indices 57-59 map to Shakuni, Chatushpada, Naga (fixed).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">In our app, the karana is computed alongside the tithi from the same elongation value. Start and end times are found by determining when the elongation crosses each 6° boundary. Because the Moon&apos;s speed varies (roughly 12-15° per day), karana durations range from about 9 to 13 hours — roughly half a day, but never exactly half.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The formula for finding the karana name from any Moon-Sun elongation is deterministic and simple to implement:</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 mt-3">
          <p className="text-text-secondary text-xs font-mono leading-relaxed mb-1">index = floor(elongation / 6)</p>
          <p className="text-text-secondary text-xs font-mono leading-relaxed mb-1">if index == 0: return &quot;Kimstughna&quot;</p>
          <p className="text-text-secondary text-xs font-mono leading-relaxed mb-1">if index &lt;= 56: return CHARA_NAMES[(index - 1) % 7]</p>
          <p className="text-text-secondary text-xs font-mono leading-relaxed">if index &gt;= 57: return STHIRA_NAMES[index - 57]</p>
        </div>
        <WhyItMatters locale={locale}>
          The calculation is straightforward once you understand tithis: a karana is simply the finer 6-degree grid overlaid on the same Moon-Sun elongation. The mapping formula — index 0 = Kimstughna, indices 1-56 cycle through 7 Chara names, indices 57-59 = fixed karanas — is the key to implementing karana computation in any panchang engine.
        </WhyItMatters>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Karana is too small to matter — only Tithi and Nakshatra count.&quot; While Karana is the finest Panchang subdivision, Vishti (Bhadra) is one of the strongest prohibitive factors in muhurta selection. Ignoring it can undermine an otherwise well-chosen window.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;All Bhadra periods are equally bad.&quot; The Bhadra mukha/puchha distinction is critical. Classical texts are clear that Bhadra in heaven or Patala is far less harmful than Bhadra on earth.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;There are only 7 karanas.&quot; There are 11 named karanas in total — 7 Chara and 4 Sthira. The Sthira karanas are easily overlooked because they appear only once each per month at the edges of the cycle.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Every printed Panchang in India lists the karana alongside the other four elements. In digital muhurta engines — including our Muhurta AI — Vishti karana triggers an automatic penalty in the scoring algorithm. The Sthira karanas (Shakuni, Chatushpada, Naga) also receive a lighter penalty. Wedding planners, business consultants using Jyotish, and temple priests routinely check for Bhadra before finalising ceremony times. The karana provides the last layer of temporal refinement in the five-limb system. Explore the <span className="text-gold-light">Muhurta AI tool</span> to see how karana scoring works in practice, or check <span className="text-gold-light">Module 7.1 (Yoga)</span> and <span className="text-gold-light">Module 8.1 (Muhurta Basics)</span> for related Panchang elements.</p>
      </section>

      <QuickCheck
        question="Which karana is considered inauspicious and appears ~8 times per lunar month?"
        options={['Kimstughna', 'Balava', 'Vishti (Bhadra)', 'Naga']}
        correctIndex={2}
        explanation="Vishti (also called Bhadra) is the 7th Chara karana and appears once per cycle of 7 across 56 Chara slots = 8 times per month. It is the most feared karana for new beginnings."
      />
    </div>
  );
}

export default function Module7_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

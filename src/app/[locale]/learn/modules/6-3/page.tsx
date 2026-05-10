'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/6-3.json';
import QuickCheck from '@/components/learn/QuickCheck';
import WhyItMatters from '@/components/learn/WhyItMatters';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_6_3', phase: 2, topic: 'Nakshatra', moduleNumber: '6.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 16,
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
          'Each nakshatra has a dasha lord from the Vimshottari cycle: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury  –  repeating 3 times across 27 nakshatras.',
          'Your birth nakshatra determines which Mahadasha is active at birth and the entire 120-year dasha sequence.',
          'The Moon\'s exact position within the nakshatra determines how much of the initial dasha remains at birth.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'विंशोत्तरी नक्षत्र-स्वामी सारणी' : 'Vimshottari Nakshatra-Lord Mapping Table'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 9 planets cycle in a fixed order across all 27 nakshatras. This table is the foundation of the Vimshottari dasha system  –  the most widely used predictive timing tool in Vedic astrology.
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary py-1 pr-2">#</th>
                <th className="text-left text-gold-light py-1 pr-2">Nakshatra</th>
                <th className="text-left text-gold-light py-1 pr-2">Lord</th>
                <th className="text-left text-gold-light py-1 pr-2">Years</th>
                <th className="text-left text-text-tertiary py-1 pr-2">#</th>
                <th className="text-left text-gold-light py-1 pr-2">Nakshatra</th>
                <th className="text-left text-gold-light py-1 pr-2">Lord</th>
                <th className="text-left text-gold-light py-1">Years</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-2">1</td><td className="py-1 pr-2">Ashwini</td><td className="py-1 pr-2">Ketu</td><td className="py-1 pr-2">7</td><td className="py-1 pr-2">10</td><td className="py-1 pr-2">Magha</td><td className="py-1 pr-2">Ketu</td><td className="py-1">7</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">2</td><td className="py-1 pr-2">Bharani</td><td className="py-1 pr-2">Venus</td><td className="py-1 pr-2">20</td><td className="py-1 pr-2">11</td><td className="py-1 pr-2">P.Phalguni</td><td className="py-1 pr-2">Venus</td><td className="py-1">20</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">3</td><td className="py-1 pr-2">Krittika</td><td className="py-1 pr-2">Sun</td><td className="py-1 pr-2">6</td><td className="py-1 pr-2">12</td><td className="py-1 pr-2">U.Phalguni</td><td className="py-1 pr-2">Sun</td><td className="py-1">6</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">4</td><td className="py-1 pr-2">Rohini</td><td className="py-1 pr-2">Moon</td><td className="py-1 pr-2">10</td><td className="py-1 pr-2">13</td><td className="py-1 pr-2">Hasta</td><td className="py-1 pr-2">Moon</td><td className="py-1">10</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">5</td><td className="py-1 pr-2">Mrigashira</td><td className="py-1 pr-2">Mars</td><td className="py-1 pr-2">7</td><td className="py-1 pr-2">14</td><td className="py-1 pr-2">Chitra</td><td className="py-1 pr-2">Mars</td><td className="py-1">7</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">6</td><td className="py-1 pr-2">Ardra</td><td className="py-1 pr-2">Rahu</td><td className="py-1 pr-2">18</td><td className="py-1 pr-2">15</td><td className="py-1 pr-2">Swati</td><td className="py-1 pr-2">Rahu</td><td className="py-1">18</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">7</td><td className="py-1 pr-2">Punarvasu</td><td className="py-1 pr-2">Jupiter</td><td className="py-1 pr-2">16</td><td className="py-1 pr-2">16</td><td className="py-1 pr-2">Vishakha</td><td className="py-1 pr-2">Jupiter</td><td className="py-1">16</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">8</td><td className="py-1 pr-2">Pushya</td><td className="py-1 pr-2">Saturn</td><td className="py-1 pr-2">19</td><td className="py-1 pr-2">17</td><td className="py-1 pr-2">Anuradha</td><td className="py-1 pr-2">Saturn</td><td className="py-1">19</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">9</td><td className="py-1 pr-2">Ashlesha</td><td className="py-1 pr-2">Mercury</td><td className="py-1 pr-2">17</td><td className="py-1 pr-2">18</td><td className="py-1 pr-2">Jyeshtha</td><td className="py-1 pr-2">Mercury</td><td className="py-1">17</td></tr>
            </tbody>
          </table>
          <p className="text-text-secondary text-xs mt-2">The 3rd cycle (nakshatras 19-27: Mula through Revati) follows the same lord sequence: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury.</p>
        </div>
        <WhyItMatters locale={locale}>
          This table is the single most important reference in Vimshottari dasha computation. Memorising the 9-planet sequence (Ke-Ve-Su-Mo-Ma-Ra-Ju-Sa-Me) and knowing it repeats 3 times across 27 nakshatras gives you the ability to determine any person&apos;s dasha lord from their birth nakshatra.
        </WhyItMatters>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'शेष दशा सन्तुलन की गणना' : 'Calculating Dasha Balance at Birth'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          At the moment of birth, the Moon is rarely at the exact start of a nakshatra. It has usually traversed some portion, which means that much of the corresponding Mahadasha has already &quot;elapsed&quot; (conceptually consumed). The remaining balance is what the native actually experiences from birth.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The calculation: (1) Find Moon&apos;s position within its nakshatra: Position = Moon_longitude - nakshatra_start. (2) Fraction elapsed = Position / 13.333°. (3) Remaining fraction = 1 - Fraction. (4) Remaining dasha years = Mahadasha_total x Remaining_fraction.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example  –  Complete Dasha Calculation</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Given:</span> Birth Moon at 167.3° sidereal longitude.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 1  –  Find nakshatra:</span> 167.3° / 13.333° = 12.55. Floor(12.55) = 12 (0-indexed). The 13th nakshatra (1-indexed) is Hasta. Lord = Moon (4th in the cycle: Ke=1, Ve=2, Su=3, Mo=4).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 2  –  Position within nakshatra:</span> Hasta starts at 160° (12 x 13.333°). Position = 167.3° - 160° = 7.3°. Fraction elapsed = 7.3 / 13.333 = 0.5475 = 54.75%.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 3  –  Remaining dasha:</span> Moon dasha total = 10 years. Remaining = 10 x (1 - 0.5475) = 10 x 0.4525 = 4.525 years = 4 years, 6 months, 9 days.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Step 4  –  Full life sequence:</span> Moon (4y 6m 9d remaining) then Mars (7y), Rahu (18y), Jupiter (16y), Saturn (19y), Mercury (17y), Ketu (7y), Venus (20y), Sun (6y). The sequence always follows the fixed Vimshottari order, picking up from the birth nakshatra&apos;s lord.
        </p>
      </section>
      <QuickCheck
        question="If a person is born with Moon at the exact START of Pushya nakshatra, what is their birth dasha?"
        options={['Jupiter (Pushya sounds like Jupiter)', 'Saturn (Pushya\'s Vimshottari lord)', 'Moon (always the default)', 'Depends on the Sun\'s position']}
        correctIndex={1}
        explanation="Pushya is the 8th nakshatra, ruled by Saturn in the Vimshottari cycle. If the Moon is at the exact start, the full 19 years of Saturn dasha remain at birth."
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? '120-वर्षीय विंशोत्तरी चक्र' : 'The 120-Year Vimshottari Cycle'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The name &quot;Vimshottari&quot; literally means &quot;of 120&quot;. The total cycle spans exactly 120 years: Ketu (7) + Venus (20) + Sun (6) + Moon (10) + Mars (7) + Rahu (18) + Jupiter (16) + Saturn (19) + Mercury (17) = 120 years. This was conceived as the maximum possible human lifespan in the Vedic tradition, ensuring the dasha system covers an entire life without repetition.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The 9-planet sequence repeats 3 times across 27 nakshatras, creating a beautiful symmetry: the first cycle covers Ashwini through Ashlesha (nakshatras 1-9, Aries through Cancer), the second covers Magha through Jyeshtha (10-18, Leo through Scorpio), and the third covers Mula through Revati (19-27, Sagittarius through Pisces). Each round spans exactly 120° of the zodiac.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          The Vimshottari dasha system is attributed to Sage Parashara and detailed in BPHS. It is the most widely used among 40+ dasha systems described in classical texts. Parashara states that among all dasha systems, Vimshottari is most applicable in the current Kali Yuga. The specific year durations (7, 20, 6, 10, 7, 18, 16, 19, 17) are considered divinely revealed.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;The dasha lord of your birth nakshatra is the most important planet in your chart.&quot; The birth dasha lord simply indicates which planetary period you&apos;re born into  –  it does not necessarily mean that planet is the chart&apos;s strongest. A person born in the last minutes of a nakshatra might have only days of that dasha remaining.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Misconception:</span> &quot;Saturn Mahadasha (19 years) is always terrible.&quot; The quality of any dasha depends entirely on the planet&apos;s placement, dignity, aspects, and lordship in the individual birth chart. A well-placed Saturn can give tremendous career success during its 19-year period.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Accurate dasha balance calculation requires knowing the Moon&apos;s longitude to high precision. Even a 0.5° error can shift the balance by several months. Our Kundali tool computes the complete dasha-antardasha-pratyantardasha hierarchy from the birth Moon&apos;s nakshatra position. Explore the <span className="text-gold-light">Kundali tool</span> to see your complete dasha timeline, or see <span className="text-gold-light">Module 6.4 (Gana, Yoni, Nadi)</span> for how nakshatras are used in compatibility matching.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'विंशोत्तरी अनुक्रम याद रखने की विधि' : 'Memorising the Vimshottari Sequence'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Mnemonic:</span> &quot;Ke-Ve-Su-Mo-Ma-Ra-Ju-Sa-Me&quot;  –  Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury. This 9-planet sequence repeats 3 times across the 27 nakshatras.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Year durations:</span> 7, 20, 6, 10, 7, 18, 16, 19, 17 = 120 years total. Notice Venus (20) and Saturn (19) get the longest periods; Sun (6) and Ketu/Mars (7 each) get the shortest.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Quick lookup:</span> Nakshatra number mod 9 gives the planet position in the cycle. Ashwini (1) → 1 mod 9 = 1 → Ketu. Bharani (2) → 2 → Venus. Magha (10) → 10 mod 9 = 1 → Ketu again (second cycle begins). This formula works for all 27 nakshatras.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Complete Dasha Timeline Example</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Person born with Moon at 167.3° (Hasta, Moon-ruled). Remaining Moon dasha: 4.53 years (age 0 to ~4.5). Then Mars: 7 years (age ~4.5 to ~11.5). Rahu: 18 years (age ~11.5 to ~29.5). Jupiter: 16 years (age ~29.5 to ~45.5). Saturn: 19 years (age ~45.5 to ~64.5). Mercury: 17 years (age ~64.5 to ~81.5). Ketu: 7 years (age ~81.5 to ~88.5). Venus: 20 years (age ~88.5 to ~108.5). Sun: 6 years (age ~108.5 to ~114.5). Then Moon again to complete the 120-year cycle.
        </p>
      </section>
    </div>
  );
}

export default function Module6_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

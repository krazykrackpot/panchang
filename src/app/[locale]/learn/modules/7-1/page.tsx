'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/7-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import dynamic from 'next/dynamic';

const TryYogaCalc = dynamic(() => import('@/components/learn/TryYogaCalc'), { ssr: false });

const META: ModuleMeta = {
  id: 'mod_7_1', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 14,
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
          'A yoga is calculated by adding the Sun and Moon\'s sidereal longitudes — the sum divided into 27 segments gives the day\'s yoga.',
          'Each of the 27 yogas has a distinct quality (auspicious, neutral, or inauspicious) that colors the energy of the day.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Yoga — The 27 Sun-Moon Combinations</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">In Panchang, the word &quot;yoga&quot; does not refer to asanas or meditation. It is a purely astronomical measure: take the sidereal longitude of the Sun, add the sidereal longitude of the Moon, reduce the sum modulo 360°, and then divide the result into 27 equal segments of 13°20&prime; each. The segment the sum falls into determines the prevailing yoga.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each of the 27 yogas carries a distinct name and nature — auspicious, inauspicious, or mixed. The sequence runs from Vishkambha (1) through Vaidhriti (27). Some yogas like Siddhi, Shubha, and Shukla are regarded as highly favourable, while Vyatipata and Vaidhriti are considered deeply inauspicious and are avoided for all new beginnings.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The complete list of 27 yogas in order: (1) Vishkambha, (2) Priti, (3) Ayushman, (4) Saubhagya, (5) Shobhana, (6) Atiganda, (7) Sukarma, (8) Dhriti, (9) Shula, (10) Ganda, (11) Vriddhi, (12) Dhruva, (13) Vyaghata, (14) Harshana, (15) Vajra, (16) Siddhi, (17) Vyatipata, (18) Variyan, (19) Parigha, (20) Shiva, (21) Siddha, (22) Sadhya, (23) Shubha, (24) Shukla, (25) Brahma, (26) Indra, (27) Vaidhriti.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The 27 yogas are enumerated in the Surya Siddhanta and detailed in Brihat Samhita by Varahamihira (6th century CE). Parashara mentions them in BPHS as an essential element of Panchang. The system predates the common era and reflects the ancient insight that the combined luminaries (Sun + Moon) create a distinct quality of time beyond what either body produces individually. The word &quot;yoga&quot; here literally means &quot;union&quot; or &quot;sum&quot; — the joining of two celestial arcs.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Classification and Practical Use</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The 27 yogas divide into three broad categories. Auspicious yogas include Priti, Ayushman, Saubhagya, Shobhana, Sukarma, Dhriti, Vriddhi, Dhruva, Harshana, Siddhi, Shiva, Siddha, Sadhya, Shubha, Shukla, Brahma, and Indra. These are suitable for initiating ventures, ceremonies, travel, and celebrations.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Inauspicious yogas include Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, and Vaidhriti. Among these, Vyatipata and Vaidhriti are considered the worst — classical texts compare their effect to an eclipse on the day&apos;s energy. Activities begun during these yogas are said to face obstacles, delays, and reversals.</p>
        <p className="text-text-secondary text-sm leading-relaxed">In daily Panchang practice, the prevailing yoga is listed alongside Tithi, Nakshatra, Vara, and Karana. When selecting a muhurta (auspicious time window), an astrologer checks that the yoga is favourable for the intended activity. For example, Dhruva (&quot;steady&quot;) suits permanent actions like housewarming, while Shubha (&quot;auspicious&quot;) is universally favourable. Yoga alone does not determine auspiciousness — it works in concert with the other four Panchang elements.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> Sun sidereal = 348°, Moon sidereal = 167°. Sum = 515°. Mod 360 = 155°. Yoga index = floor(155 / 13.333) = 11. Yoga number = 11 + 1 = 12. The 12th yoga is Dhruva (&quot;fixed/steady&quot;) — auspicious for stable endeavors like purchasing property or planting trees.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2:</span> Sun = 45°, Moon = 280°. Sum = 325°. Mod 360 = 325°. Index = floor(325 / 13.333) = 24. Yoga = 24 + 1 = 25 (Brahma). Brahma yoga is highly auspicious — ideal for learning, initiations, and spiritual practices.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3:</span> Sun = 120°, Moon = 100°. Sum = 220°. Index = floor(220 / 13.333) = 16. Yoga = 17 (Vyatipata). This is inauspicious — avoid starting new ventures, journeys, or ceremonies during this yoga.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Calculation, Misconceptions, and Modern Practice</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The yoga calculation is straightforward: obtain the sidereal (nirayana) longitude of both the Sun and Moon using Lahiri Ayanamsa. Add the two longitudes. If the sum exceeds 360°, subtract 360°. Divide the result by 13.333° (equivalently 13°20&prime;). The integer part plus one gives the yoga number. Because both luminaries are constantly moving, the yoga changes roughly once a day, though durations vary from about 18 to 27 hours depending on the combined angular speeds.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Our app computes the yoga in real time from the Meeus solar and lunar position algorithms, applying Lahiri Ayanamsa. The yoga start and end times are determined by finding the exact moment the Sun-Moon sum crosses each 13°20&prime; boundary — this requires iterative computation since both bodies move at variable speeds.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Panchang Yoga is related to Yoga asanas.&quot; These are entirely different uses of the Sanskrit word &quot;yoga.&quot; Panchang Yoga is astronomical; yogic practices are spiritual/physical disciplines.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Yoga is the same as Nakshatra because both have 27 divisions.&quot; While both divide into 27 segments of 13°20&prime;, they measure different things — Nakshatra tracks the Moon&apos;s sidereal position alone, while Yoga tracks the combined Sun+Moon sum.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;A bad yoga ruins the entire day regardless of other factors.&quot; In practice, an unfavourable yoga can be mitigated by strong Nakshatra, good Tithi, and auspicious Vara. The Panchang is a five-factor system — no single element is absolute.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Yoga remains a standard element in every printed and digital Panchang across India, Nepal, and Sri Lanka. Modern muhurta-selection software — including our own Muhurta AI engine — factors the yoga into its multi-criteria scoring. Vyatipata and Vaidhriti are automatically flagged as unfavourable windows. For users who consult the daily Panchang, the yoga provides a quick read on the day&apos;s general cosmic flavour alongside the four other limbs.</p>
      </section>

      <TryYogaCalc />
    </div>
  );
}

function Page4() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Yoga Duration and Transition Boundaries</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Unlike the calendar day which has a fixed 24-hour duration, a yoga&apos;s duration varies considerably. The combined angular speed of the Sun (~1°/day) and Moon (~13.2°/day) averages ~14.2°/day. Since each yoga spans 13.333°, the average duration is 13.333° / 14.2° x 24 hours ≈ 22.5 hours. However, the Moon&apos;s speed varies from ~11.5° to ~15.4°/day due to its elliptical orbit. This means yoga durations range from approximately 18 to 27 hours — a spread of nearly 50%.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">This variability has important practical consequences. A short yoga (~18 hours) might begin and end within the same calendar day, meaning two different yogas could be active at different times. A long yoga (~27 hours) spans more than a full day, so the same yoga is active for two consecutive sunrises. When consulting the Panchang, always check the yoga transition time, not just the yoga name. Our app displays both the active yoga and its start/end times for exactly this reason.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Finding the exact yoga transition time requires iterative computation. We need to find the moment when (Sun sidereal longitude + Moon sidereal longitude) mod 360° crosses a 13.333° boundary. Since both bodies move at variable speeds, there is no closed-form solution — we use the same binary search technique applied to tithi boundaries: bracket the crossing in a 30-minute scan, then refine with 15 iterations of bisection to achieve sub-second precision.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Practical Application: Yoga-Based Daily Planning</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Morning check:</span> Consult the Panchang to see which yoga is active at sunrise. If it is Siddhi, Shubha, or Shiva, the day carries a naturally auspicious energy — a good day for important meetings, financial decisions, or ceremonies. If Vyatipata or Vaidhriti is active, consider postponing new initiatives to the next day.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Transition awareness:</span> If the yoga transitions during working hours (say, from Shubha to Vishkambha at 2 PM), schedule important actions in the morning under the favorable yoga. The transition itself is considered a sensitive moment — avoid beginning anything in the 30 minutes surrounding the changeover.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Yoga + Nakshatra synergy:</span> When a favorable yoga coincides with a favorable nakshatra, the combined effect is amplified. For example, Siddhi yoga + Pushya nakshatra creates one of the most auspicious windows possible — suitable for virtually any positive endeavor. Classical texts call these &quot;Maha Yogas&quot; (great combinations) that override minor negative factors elsewhere in the Panchang.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Cross-References</h4>
        <p className="text-text-secondary text-xs leading-relaxed">For related Panchang elements, see <span className="text-gold-light">Module 7.2 (Karana)</span> for half-tithi divisions, <span className="text-gold-light">Module 7.3 (Vara)</span> for weekday astrology, and <span className="text-gold-light">Module 8.1 (Muhurta)</span> for how all five limbs integrate. For the computational details of how the Sun and Moon positions are determined (which underlie yoga calculation), see <span className="text-gold-light">Module 22.2 (Sun)</span> and <span className="text-gold-light">Module 22.3 (Moon)</span>. For the distinction between Panchang yoga and chart-based yogas (like Gajakesari or Raja Yoga), see <span className="text-gold-light">Module 10 (Yogas in Charts)</span>.</p>
      </section>
    </div>
  );
}

function Page5() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Yoga and the Other Four Panchang Elements</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The yoga provides the &ldquo;cosmic flavour&rdquo; of a time period, but it works in concert with the other four Panchang elements. A day with Siddhi yoga (favourable) but Vishti karana (unfavourable) and Vyatipata yoga simultaneously requires careful interpretation &mdash; the yoga name itself might be &ldquo;Siddhi&rdquo; but the karana penalty creates a mixed result. In our Muhurta scoring system, all five elements are weighted independently: Nakshatra (35%), Tithi (25%), Yoga (20%), Vara (12%), Karana (8%).</p>
        <p className="text-text-secondary text-sm leading-relaxed">Understanding these weights helps explain why some &ldquo;good yoga&rdquo; days still score low in the Muhurta tool &mdash; the nakshatra or tithi might be unfavourable, overriding the yoga&rsquo;s contribution. Conversely, a neutral yoga during Pushya nakshatra and Dvitiya tithi can still produce an excellent overall Muhurta score. The five limbs are a system, not individual verdicts.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Additional Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Yoga changes at a fixed time every day, like sunrise.&quot; Unlike the calendar day (sunrise to sunrise), yoga transitions are governed by the combined motion of two celestial bodies. The transition time varies from 18 to 27 hours and can occur at any hour of the day or night. Always check the exact transition time, not just the yoga name.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;There are only 27 yogas, so the system is too simple to be useful.&quot; While there are 27 yogas, each combines with 30 tithis, 27 nakshatras, 7 varas, and 11 karanas. The total number of unique Panchang combinations is 27 x 30 x 27 x 7 x 11 = over 5.6 million. The five-limb system encodes enormous variety in compact form.</p>
      </section>
    </div>
  );
}

export default function Module7_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />, <Page5 key="p5" />]} questions={QUESTIONS} />;
}

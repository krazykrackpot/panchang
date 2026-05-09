'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/8-1.json';
import QuickCheck from '@/components/learn/QuickCheck';
import WhyItMatters from '@/components/learn/WhyItMatters';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_8_1', phase: 2, topic: 'Muhurta', moduleNumber: '8.1',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs.map(cr => ({ label: cr.label as unknown as Record<string, string>, href: cr.href })),
};

const QUESTIONS = (L.questions as unknown) as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'A Vedic day (sunrise to sunrise) is divided into 30 muhurtas, each ~48 minutes. Each muhurta has a presiding deity and inherent nature.',
          'Brahma Muhurta (the 14th, ~96 min before sunrise) is considered the supreme time for spiritual practice and study.',
          'Abhijit Muhurta (~midday, 24 min before and after local noon) is universally auspicious — except on Wednesdays.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Panchang — The Five Limbs Working Together</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The word &quot;Panchang&quot; comes from Pancha (five) + Anga (limb). These five elements together form a multi-dimensional framework for assessing the quality of any given moment. Each limb captures a distinct astronomical reality: Tithi measures the Moon-Sun angular separation (the lunar phase), Vara identifies the weekday and its ruling planet, Nakshatra locates the Moon among the 27 stellar mansions, Yoga sums the Sun and Moon sidereal longitudes, and Karana divides the tithi into two halves for finer temporal resolution.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The genius of the Panchang system is that no single element tells the whole story. Tithi reveals the relationship between the two luminaries (waxing/waning energy). Vara colours the day with planetary flavour (Jupiter&apos;s wisdom on Thursday, Mars&apos;s aggression on Tuesday). Nakshatra indicates the Moon&apos;s stellar backdrop — which of 27 cosmic archetypes is active. Yoga captures the combined radiance of both luminaries. Karana adds the final layer of precision.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Together, these five elements create what modern systems would call a &quot;feature vector&quot; for time quality. A complete Panchang entry for any moment includes all five limbs plus supplementary data: Rahu Kaal (inauspicious Rahu period), Yamaganda (death-lord period), Gulika Kaal (Saturn&apos;s toxic period), and Choghadiya (alternating good/bad time blocks). Sunrise and sunset anchor the calculations, as the Vedic day begins at sunrise rather than midnight.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">The five-limb Panchang system is described in the Surya Siddhanta (one of the oldest astronomical texts), codified in BPHS, and practically elaborated in Muhurta Chintamani, Dharmasindhu, and Nirnaya Sindhu. The Arthashastra of Kautilya (4th century BCE) references Panchang consultation for state decisions.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The hierarchy of importance is generally: Nakshatra &gt; Tithi &gt; Yoga &gt; Vara &gt; Karana — but a strong negative in any element (especially Vishti karana or Vyatipata yoga) demands attention regardless of how favourable the others are. The 30-muhurta system adds a further layer of time-quality assessment within each day.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 30 Muhurtas — A Complete Table</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">A Vedic day (sunrise to sunrise) is divided into 30 muhurtas, each lasting approximately 48 minutes (2 ghatikas = 1 muhurta). The first 15 muhurtas cover the daytime (sunrise to sunset) and the second 15 cover the night. Each muhurta has a name, a presiding deity, and an inherent quality — auspicious (Shubha), inauspicious (Ashubha), or mixed.</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <h5 className="text-gold-light text-xs font-bold mb-2">Daytime Muhurtas (1-15, sunrise to sunset)</h5>
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary py-1 pr-2">#</th>
                <th className="text-left text-gold-light py-1 pr-2">Name</th>
                <th className="text-left text-gold-light py-1 pr-2">Deity</th>
                <th className="text-left text-gold-light py-1">Nature</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-2">1</td><td className="py-1 pr-2">Rudra</td><td className="py-1 pr-2">Rudra (Shiva)</td><td className="py-1 text-red-400">Inauspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">2</td><td className="py-1 pr-2">Ahi</td><td className="py-1 pr-2">Sarpa (Serpent)</td><td className="py-1 text-red-400">Inauspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">3</td><td className="py-1 pr-2">Mitra</td><td className="py-1 pr-2">Mitra</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">4</td><td className="py-1 pr-2">Pitri</td><td className="py-1 pr-2">Pitris (Ancestors)</td><td className="py-1 text-red-400">Inauspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">5</td><td className="py-1 pr-2">Vasu</td><td className="py-1 pr-2">Vasu</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">6</td><td className="py-1 pr-2">Vara</td><td className="py-1 pr-2">Apas (Water)</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">7</td><td className="py-1 pr-2">Vishvedeva</td><td className="py-1 pr-2">Vishvedevas</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">8</td><td className="py-1 pr-2 text-gold-light font-medium">Abhijit</td><td className="py-1 pr-2">Brahma</td><td className="py-1 text-emerald-400 font-medium">Most Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">9</td><td className="py-1 pr-2">Vidhata</td><td className="py-1 pr-2">Vidhata</td><td className="py-1 text-amber-400">Mixed</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">10</td><td className="py-1 pr-2">Puruhuta</td><td className="py-1 pr-2">Indra</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">11</td><td className="py-1 pr-2">Indra-Agni</td><td className="py-1 pr-2">Indragni</td><td className="py-1 text-amber-400">Mixed</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">12</td><td className="py-1 pr-2">Nirriti</td><td className="py-1 pr-2">Nirriti</td><td className="py-1 text-red-400">Inauspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">13</td><td className="py-1 pr-2">Varuna</td><td className="py-1 pr-2">Varuna</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">14</td><td className="py-1 pr-2">Aryama</td><td className="py-1 pr-2">Aryaman</td><td className="py-1 text-amber-400">Mixed</td></tr>
              <tr><td className="py-1 pr-2">15</td><td className="py-1 pr-2">Bhaga</td><td className="py-1 pr-2">Bhaga</td><td className="py-1 text-emerald-400">Auspicious</td></tr>
            </tbody>
          </table>
          <p className="text-text-secondary text-xs leading-relaxed">The nighttime muhurtas (16-30) follow a similar pattern, with the 29th muhurta known as &quot;Brahma Muhurta&quot; — approximately 96 minutes before sunrise — considered supreme for spiritual practice, meditation, and study.</p>
        </div>
      </section>
      <QuickCheck
        question="Which muhurta is considered the most universally auspicious during daytime?"
        options={['Rudra (1st)', 'Abhijit (8th)', 'Varuna (13th)', 'Brahma (29th)']}
        correctIndex={1}
        explanation="Abhijit Muhurta, the 8th muhurta centred around local noon, is considered universally auspicious. Brahma Muhurta (29th) is supreme for spiritual practice but falls at night."
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Brahma Muhurta and Abhijit Muhurta</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3"><strong className="text-gold-light">Brahma Muhurta</strong> is the 29th of the 30 muhurtas, falling approximately 96 minutes before sunrise (the second-to-last muhurta of the night). Named after Brahma, the creator deity, it is considered the most potent window for spiritual activities: meditation, mantra chanting, Vedic study, and yoga practice. The Ayurvedic tradition (Ashtanga Hridaya) explicitly recommends waking during Brahma Muhurta for optimal health. The atmosphere is calm, the mind is fresh from sleep, and the transition from darkness to light symbolises the awakening of consciousness.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3"><strong className="text-gold-light">Abhijit Muhurta</strong> is the 8th daytime muhurta, centred around local noon. It spans approximately 24 minutes before and 24 minutes after the local solar noon (midday). Abhijit means &quot;the victorious one&quot; — named after the Abhijit nakshatra (Vega). This muhurta is considered universally auspicious for virtually all positive activities: starting a business, beginning a journey, signing contracts, and initiating any important work.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3"><strong className="text-red-400">The Wednesday exception:</strong> Classical texts like the Muhurta Chintamani specifically state that Abhijit Muhurta should be avoided on Wednesdays. The reason given is that Abhijit nakshatra and Wednesday&apos;s lord Mercury create an unfavourable combination. Our Muhurta AI engine encodes this rule — Abhijit Muhurta receives a bonus on all days except Wednesday, where it is treated as neutral.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3"><strong className="text-gold-light">Practical tip:</strong> Brahma Muhurta occurs at different times depending on your location and the season. At 46°N latitude (Switzerland) in summer, sunrise is around 5:45 AM, so Brahma Muhurta falls at approximately 4:09-4:57 AM. In winter with sunrise at 8:00 AM, it falls at approximately 6:24-7:12 AM. Always compute from your local sunrise, never from a fixed clock time.</p>
        <WhyItMatters locale={locale}>
          Brahma Muhurta and Abhijit Muhurta are the two most powerful time windows in the daily cycle. Brahma Muhurta for spiritual practices, Abhijit for worldly activities. Knowing these two alone gives you practical muhurta awareness for daily life — no complex calculations needed.
        </WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: Finding Abhijit Muhurta</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Location:</span> Vevey, Switzerland (46.46°N). Date: 15 April 2026. Sunrise: 06:42, Sunset: 20:12.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 1:</span> Day length = 20:12 - 06:42 = 13h 30m = 810 minutes. Each daytime muhurta = 810 / 15 = 54 minutes.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Step 2:</span> Abhijit is the 8th muhurta. Start = sunrise + 7 x 54m = 06:42 + 378m = 12:00. End = 12:00 + 54m = 12:54.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Step 3:</span> Check the vara: 15 April 2026 is Wednesday. Abhijit Muhurta is NOT auspicious on Wednesday — use a different auspicious window instead. On Thursday, the same window would be doubly powerful (Jupiter day + Abhijit).</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Muhurta Selection Algorithm</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Muhurta selection integrates all five Panchang limbs into a decision framework. For a major ceremony like marriage, the classical requirements are: (1) Nakshatra must be a Shubha type — Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, or Revati. (2) Tithi must not be Rikta (4th, 9th, 14th) or Amavasya/Purnima for some ceremonies. (3) Yoga must be auspicious — avoid Vyatipata, Vaidhriti, Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, and Parigha. (4) Vara should be Monday, Wednesday, Thursday, or Friday. (5) Karana must not be Vishti (Bhadra).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The balancing principle states: mild negatives can be compensated by strong positives. A slightly unfavourable yoga can be overridden by an excellent nakshatra and vara combination. However, certain elements act as absolute vetoes — Vishti karana on earth and Vyatipata/Vaidhriti yoga are &quot;hard stops&quot; that no amount of positivity in other elements can compensate.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Our Muhurta AI engine implements this logic computationally: it scans a time range, evaluates each moment on all five Panchang dimensions, applies bonuses for special combinations (Sarvartha Siddhi, Amrita Siddhi, Abhijit Muhurta), applies penalties for inauspicious elements (Rahu Kaal, Vishti, Vyatipata, Panchaka, Sthira karanas), and ranks candidate windows by composite score.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Only Nakshatra and Tithi matter — the other three elements are filler.&quot; While Nakshatra and Tithi are the most weighted, Yoga and Karana carry real veto power. Vishti karana has ruined many otherwise perfect windows.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;A Panchang is just a calendar.&quot; A calendar tells you the date. A Panchang tells you the cosmic quality of that date across five independent dimensions plus supplementary periods.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;Abhijit Muhurta is always the best time.&quot; Abhijit is universally auspicious EXCEPT on Wednesdays. Additionally, if other Panchang elements are severely negative during Abhijit (e.g., Vishti karana active), the overall window remains unfavourable.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">The Panchang remains the single most consulted astrological document in India. Over 80% of Hindu weddings are timed using Panchang-based muhurta selection. Our app provides a fully computed Panchang with all five limbs, the 30 muhurtas mapped to local sunrise, Brahma Muhurta and Abhijit Muhurta highlighted, supplementary periods computed, and an AI-powered muhurta recommender. Explore the <span className="text-gold-light">Muhurta AI tool</span> to find the best windows for your activities, or see <span className="text-gold-light">Module 7.2 (Karana)</span> and <span className="text-gold-light">Module 7.3 (Vara &amp; Hora)</span> for individual Panchang elements.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Activity-Specific Panchang Rules Summary</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Marriage:</span> Dhruva/Mridhu nakshatra + Nanda/Bhadra/Jaya tithi + auspicious yoga + Mon/Wed/Thu/Fri + no Vishti karana. Lagna must be strong and free from malefic aspects.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Travel:</span> Ashwini/Mrigashira/Pushya/Hasta/Anuradha/Revati nakshatras + Mon/Wed/Thu/Fri + avoid Vishti + avoid Rahu Kaal at departure.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Business launch:</span> 2nd/3rd/5th/7th/10th/11th/13th tithis + Thu/Fri + Pushya nakshatra ideal + Siddhi/Siddha yoga bonus. Avoid Rahu Kaal and Yamaganda entirely.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Spiritual practice:</span> Ekadashi/Purnima tithis + any day + Shravana/Pushya/Ashwini nakshatras. Brahma Muhurta is the supreme window regardless of other Panchang elements.</p>
      </section>

      <QuickCheck
        question="Why is Abhijit Muhurta avoided on Wednesdays?"
        options={['Mercury is always weak on Wednesdays', 'Abhijit nakshatra + Mercury create an unfavourable combination', 'Wednesday has no planetary ruler', 'It is an arbitrary traditional rule']}
        correctIndex={1}
        explanation="Classical texts (Muhurta Chintamani) specify that Abhijit Muhurta's connection to Abhijit nakshatra creates an unfavourable combination with Wednesday's lord Mercury. On all other days, Abhijit Muhurta is universally auspicious."
      />
    </div>
  );
}

export default function Module8_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/7-3.json';
import QuickCheck from '@/components/learn/QuickCheck';
import WhyItMatters from '@/components/learn/WhyItMatters';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_7_3', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.3',
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
          'The weekday order (Sun, Mon, Mars, Mer, Jup, Ven, Sat) derives mathematically from the Chaldean hora cycle — it is not arbitrary.',
          'Each of the 24 hours of a day has a planetary ruler (hora lord), cycling in Chaldean order from the day ruler.',
          'Matching an activity to its natural hora lord amplifies success — Jupiter hora for education, Venus hora for arts.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vara — The Weekday and the Hora System</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The seven weekdays (varas) are the most familiar time-division in both Eastern and Western cultures, yet few people know why the days follow the order Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn rather than the orbital speed sequence. The answer lies in the Hora system — an ancient planetary-hour framework shared between Vedic and Hellenistic astronomy.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Chaldean order ranks the seven classical planets by decreasing orbital period: Saturn (slowest), Jupiter, Mars, Sun, Venus, Mercury, Moon (fastest). Each of the 24 hours of a day is assigned to the next planet in this Chaldean sequence. The ruler of the first hora becomes the ruler of the entire day. After 24 horas, we have cycled through 3 complete rounds of 7 (= 21) plus 3 extra steps — so the next day&apos;s ruler is 3 positions forward in the Chaldean order. Starting from Saturn: skip 3 forward gives Sun; from Sun skip 3 gives Moon; from Moon skip 3 gives Mars — producing the familiar weekday order.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The Sanskrit names directly reflect planetary rulership: Ravivara (Ravi = Sun), Somavara (Soma = Moon), Mangalavara (Mangal = Mars), Budhavara (Budha = Mercury), Guruvara (Guru = Jupiter), Shukravara (Shukra = Venus), Shanivara (Shani = Saturn). Every European language encodes the same planetary assignments (e.g., Saturday = Saturn&apos;s day, Sunday = Sun&apos;s day).</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">The Hora system is described in Varahamihira&apos;s Brihat Jataka (6th century CE) and in the Surya Siddhanta. The word &quot;hora&quot; itself derives from the Greek &quot;hora&quot; (hour), pointing to the shared Greco-Indian astronomical heritage. BPHS discusses vara as one of the five essential Panchang limbs.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The Muhurta Chintamani provides extensive tables of Vara-Nakshatra and Vara-Tithi combinations that create special yogas like Sarvartha Siddhi and Amrita Siddhi. These compound yogas are among the most powerful auspicious windows in the entire muhurta tradition — they can override minor negatives in other Panchang elements. Our Muhurta AI engine checks for all documented Sarvartha Siddhi and Amrita Siddhi combinations automatically.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Planetary Hora Table — Hour-by-Hour Rulers</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The hora lord for any hour of any day can be computed from the Chaldean sequence. The first hora of each day belongs to the day lord. Subsequent horas follow the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. The table below shows the first 12 horas (sunrise to sunset) for each weekday.</p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary py-1 pr-2">Hour</th>
                <th className="text-left text-gold-light py-1 pr-2">Sun</th>
                <th className="text-left text-gold-light py-1 pr-2">Mon</th>
                <th className="text-left text-gold-light py-1 pr-2">Tue</th>
                <th className="text-left text-gold-light py-1 pr-2">Wed</th>
                <th className="text-left text-gold-light py-1 pr-2">Thu</th>
                <th className="text-left text-gold-light py-1 pr-2">Fri</th>
                <th className="text-left text-gold-light py-1">Sat</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-2">1st</td><td className="py-1 pr-2">Sun</td><td className="py-1 pr-2">Moon</td><td className="py-1 pr-2">Mars</td><td className="py-1 pr-2">Mer</td><td className="py-1 pr-2">Jup</td><td className="py-1 pr-2">Ven</td><td className="py-1">Sat</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">2nd</td><td className="py-1 pr-2">Ven</td><td className="py-1 pr-2">Sat</td><td className="py-1 pr-2">Sun</td><td className="py-1 pr-2">Moon</td><td className="py-1 pr-2">Mars</td><td className="py-1 pr-2">Mer</td><td className="py-1">Jup</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">3rd</td><td className="py-1 pr-2">Mer</td><td className="py-1 pr-2">Jup</td><td className="py-1 pr-2">Ven</td><td className="py-1 pr-2">Sat</td><td className="py-1 pr-2">Sun</td><td className="py-1 pr-2">Moon</td><td className="py-1">Mars</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">4th</td><td className="py-1 pr-2">Moon</td><td className="py-1 pr-2">Mars</td><td className="py-1 pr-2">Mer</td><td className="py-1 pr-2">Jup</td><td className="py-1 pr-2">Ven</td><td className="py-1 pr-2">Sat</td><td className="py-1">Sun</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">5th</td><td className="py-1 pr-2">Sat</td><td className="py-1 pr-2">Sun</td><td className="py-1 pr-2">Moon</td><td className="py-1 pr-2">Mars</td><td className="py-1 pr-2">Mer</td><td className="py-1 pr-2">Jup</td><td className="py-1">Ven</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">6th</td><td className="py-1 pr-2">Jup</td><td className="py-1 pr-2">Ven</td><td className="py-1 pr-2">Sat</td><td className="py-1 pr-2">Sun</td><td className="py-1 pr-2">Moon</td><td className="py-1 pr-2">Mars</td><td className="py-1">Mer</td></tr>
              <tr><td className="py-1 pr-2">7th</td><td className="py-1 pr-2">Mars</td><td className="py-1 pr-2">Mer</td><td className="py-1 pr-2">Jup</td><td className="py-1 pr-2">Ven</td><td className="py-1 pr-2">Sat</td><td className="py-1 pr-2">Sun</td><td className="py-1">Moon</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">Note: Each hora duration equals (sunrise-to-sunset / 12) for daytime horas and (sunset-to-next-sunrise / 12) for night horas. Horas are NOT exactly 60 minutes — they vary with the season and latitude. In Switzerland at midsummer, a daytime hora is about 72 minutes; at midwinter, about 37 minutes. This is why hora calculations must use actual sunrise/sunset times, not fixed clock hours.</p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2"><span className="text-gold-light font-medium">Computing the hora lord:</span> From the weekday (which gives the day lord = 1st hora lord), count forward through the Chaldean sequence (Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon) to reach the desired hora number. Formula: hora_lord_index = (day_lord_chaldean_position + hora_number - 1) mod 7.</p>
        <WhyItMatters locale={locale}>
          The hora table is the practical tool behind muhurta fine-tuning. Once you know which activity suits which planet, you can select the exact hour of the day for optimal timing. Jupiter hora on Thursday is doubly powerful; Saturn hora on Saturday intensifies Shani energy.
        </WhyItMatters>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Which Activities Suit Which Hora</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each vara carries the energy of its ruling planet. Thursday (Guruvara), ruled by Jupiter, is considered the most universally auspicious — suited for education, marriage, religious ceremonies, and business initiation. Monday (Somavara, Moon) is good for domestic affairs, travel, and meeting people. Wednesday (Budhavara, Mercury) favours communication, learning, and trade. Friday (Shukravara, Venus) is ideal for arts, romance, and luxury purchases.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Tuesday (Mangalavara, Mars) and Saturday (Shanivara, Saturn) are generally avoided for new beginnings because Mars and Saturn are natural malefics. However, they are powerful for activities aligned with their energy: Tuesday suits courage-demanding actions, surgery, and property disputes; Saturday suits discipline, penance, removal of obstacles, and Shani-related remedies. Sunday (Ravivara, Sun) carries authority energy — good for government matters and leadership roles but considered too fierce for gentle ceremonies.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Hora-Activity Matching Guide</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Sun hora:</span> Government work, meeting authorities, health matters (heart/eyes), leadership decisions.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Moon hora:</span> Travel, domestic matters, public dealings, starting medications, meeting women.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Mars hora:</span> Surgery, property disputes, courage-demanding actions, military matters, cooking.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Mercury hora:</span> Study, writing, communication, trade, signing documents, learning new skills.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Jupiter hora:</span> Education, marriage discussions, religious rituals, financial planning, charity.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Venus hora:</span> Arts, music, romance, luxury purchases, beauty treatments, entertainment.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Saturn hora:</span> Discipline, penance, clearing debts, iron/oil work, removing obstacles, meditation.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [0], 4: [1], 9: [4] }}
          title="Aries Lagna — Sun in 10th, Moon in 4th, Jupiter in 9th"
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1 (Vara from JD):</span> JD = 2460400.5 (a specific date). floor(2460400.5 + 1.5) mod 7 = floor(2460402) mod 7 = 2460402 mod 7 = 0. // 0=Sun, so this is Ravivara (Sunday) — suited for authority matters.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2 (Hora calculation):</span> It is Wednesday, sunrise at 6:00 AM. Day length = 12 hours, so each hora = 60 minutes. 1st hora (6-7 AM) = Mercury. You want to sign a contract at 3 PM = 9th hora. Counting from Mercury through Chaldean order: Mer(1), Moon(2), Sat(3), Jup(4), Mars(5), Sun(6), Ven(7), Mer(8), Moon(9). The 9th hora is Moon — favourable for public agreements.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3 (Sarvartha Siddhi):</span> Thursday + Pushya nakshatra = Sarvartha Siddhi Yoga. This compound yoga means &quot;all-purpose success&quot; — auspicious for virtually any positive activity. These special Vara-Nakshatra pairs are checked automatically by our Muhurta AI engine.</p>
      </section>
      <QuickCheck
        question="Why do the weekdays follow the order Sun-Mon-Mars-Mercury-Jupiter-Venus-Saturn?"
        options={['Alphabetical in Sanskrit', '24 mod 7 = 3 skip pattern in Chaldean order', 'Brightness of the planets', 'Distance from Earth']}
        correctIndex={1}
        explanation="Each planet rules one hora (hour). After 24 horas (24 mod 7 = 3 remainder), the next day's ruler is 3 steps forward in the Chaldean order, producing the familiar weekday sequence."
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Vara Combinations and Muhurta Scoring</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The true power of Vara emerges when combined with other Panchang elements. Two important compound yogas arise from Vara combinations. Sarvartha Siddhi Yoga is formed when specific Vara + Nakshatra pairs align — for example, Sunday + Pushya, Monday + Hasta, Tuesday + Ashwini, Wednesday + Anuradha, Thursday + Revati, Friday + Anuradha, Saturday + Pushya. These create universally auspicious windows.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Amrita Siddhi Yoga is formed by specific Vara + Tithi combinations — for instance, Sunday + Dvadashi, Monday + Ekadashi, Wednesday + Dashami. Amrita means &quot;nectar&quot; — these windows are considered potent enough to neutralise many other negative factors in the Panchang.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">In our Muhurta AI engine, Vara contributes to the scoring in three ways: (1) direct day quality (benefic/malefic day lord), (2) compound yoga bonuses (Sarvartha Siddhi and Amrita Siddhi), and (3) hora-level fine-tuning within the selected day. A Jupiter hora on Thursday receives the highest possible hora bonus; a Saturn hora on Tuesday receives a penalty.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Computing the vara is trivially simple: floor(JD + 1.5) mod 7, where 0 = Sunday, 1 = Monday, and so on. This makes vara the easiest of the five Panchang elements to compute — no planetary position calculations needed, just modular arithmetic on the Julian Day Number. Despite its computational simplicity, vara carries significant weight in muhurta decisions.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Tuesday and Saturday are always bad.&quot; These days are inauspicious for gentle beginnings, but they are powerful for Mars-type and Saturn-type activities respectively. Surgery on Tuesday, discipline on Saturday — matching the day&apos;s energy to the action&apos;s nature is the correct approach.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Vara alone determines whether a day is good or bad.&quot; Vara is just one of five Panchang limbs. A Thursday with Vyatipata yoga and Vishti karana is not automatically auspicious. The five elements must be evaluated together.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;The weekday order is arbitrary or culturally imposed.&quot; The sequence follows rigorously from the Hora system: 24 mod 7 = 3, producing the skip-three pattern in the Chaldean sequence. This mathematical derivation is shared across civilisations.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">Vara is universally present in every Panchang, calendar, and almanac. In our app, the vara is displayed prominently on the daily Panchang page, and the Muhurta AI engine uses Vara-Nakshatra and Vara-Tithi lookup tables to detect Sarvartha Siddhi and Amrita Siddhi windows. The planetary hora calculator provides hour-by-hour planetary rulership for any given day. Explore the <span className="text-gold-light">Hora tool</span> for real-time hora computation, <span className="text-gold-light">Module 7.2 (Karana)</span> for half-tithi divisions, and <span className="text-gold-light">Module 8.1 (Muhurta Basics)</span> for how all five Panchang limbs integrate into muhurta selection.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Vara in Natal Chart Interpretation</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">The birth vara (weekday of birth) carries subtle significance in natal astrology. A person born on Thursday (Guruvara) has a natural affinity with Jupiter&apos;s qualities — wisdom, generosity, and spiritual inclination. Birth on Saturday (Shanivara) suggests one who faces Saturn&apos;s lessons early but develops remarkable resilience.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">In daily practice, vara awareness guides simple but effective timing decisions. Starting a course of study on Wednesday aligns with Mercury. Visiting Hanuman temple on Tuesday, Shani Dev on Saturday, Lakshmi on Friday — all rooted in vara logic.</p>
        <p className="text-text-secondary text-xs leading-relaxed">The vara also determines the starting Choghadiya period. The eight Choghadiya segments (Udveg, Char, Labh, Amrit, Kaal, Shubh, Rog, Chal) rotate in fixed order, but the starting segment changes with each weekday — shifting the distribution of auspicious and inauspicious 90-minute blocks through the day.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Weekly Remedies by Vara</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Sunday (Ravivara):</span> Offer water to the Sun at sunrise. Wear ruby or red. Donate wheat. Best for government work and leadership.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Monday (Somavara):</span> Fast or eat white foods. Offer milk to Shiva Linga. Best for domestic decisions and travel.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1"><span className="text-gold-light font-medium">Thursday (Guruvara):</span> Wear yellow. Donate turmeric or bananas. Visit a temple. The most universally auspicious day.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Saturday (Shanivara):</span> Donate black sesame seeds or mustard oil. Serve the underprivileged. Best for clearing debts and removing obstacles.</p>
      </section>
    </div>
  );
}

export default function Module7_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

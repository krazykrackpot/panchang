'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/7-4.json';

const META: ModuleMeta = {
  id: 'mod_7_4', phase: 2, topic: 'Yoga Karana', moduleNumber: '7.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Hora from Ahoratra — Etymology & the Seven Visible Planets</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The Sanskrit word &quot;Ahoratra&quot; is a compound of &quot;Aha&quot; (day) and &quot;Ratra&quot; (night) — it denotes one complete cycle of daylight and darkness. By a well-attested etymological process, the first syllable (a-) and the last portion (-ratra) were dropped, yielding the middle portion: &quot;hora.&quot; This word entered Greek as &quot;hora&quot; (ὥρα), passed through Latin, and eventually became the English &quot;hour.&quot; Whether the borrowing went from India to Greece or vice versa is debated, but the linguistic kinship is undeniable.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">A hora is 1/24th of an Ahoratra — one planetary hour. Each hora is ruled by one of the seven classical &quot;planets&quot; (grahas) visible to the naked eye. These seven are ranked by their apparent orbital period as seen from Earth, from slowest to fastest: Saturn (~29.5 years), Jupiter (~12 years), Mars (~2 years), Sun (~1 year), Venus (~225 days), Mercury (~88 days), Moon (~27 days). This ranking is called the Chaldean order, after the Babylonian astronomers who first systematized it.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Crucially, Rahu and Ketu are excluded from this system. They are not visible celestial bodies — they are mathematical points (lunar nodes) where the Moon&apos;s orbital plane intersects the ecliptic. While they are central to Indian astrology as part of the Navagraha (nine planets), they play no role in the hora-weekday derivation. Only the seven bodies observable with the naked eye participate in the Chaldean sequence.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The Chaldean Sequence</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Slowest to fastest orbital period:</p>
        <p className="text-gold-light text-sm font-medium tracking-wide text-center py-2">Saturn &rarr; Jupiter &rarr; Mars &rarr; Sun &rarr; Venus &rarr; Mercury &rarr; Moon</p>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">This sequence is the seed from which the entire 7-day week grows. The ordering by speed was empirically determined by ancient observers tracking how quickly each body moved against the fixed stars. Saturn, barely crawling through the zodiac, sits at the top; the Moon, completing its cycle in under a month, sits at the bottom.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The 24-Hora System & the &quot;Jump of 3&quot;</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each Ahoratra (day-night cycle) is divided into exactly 24 horas. The first hora of any day is ruled by that day&apos;s planetary lord. Subsequent horas cycle through the Chaldean order: Saturn &rarr; Jupiter &rarr; Mars &rarr; Sun &rarr; Venus &rarr; Mercury &rarr; Moon, repeating endlessly.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The key insight is arithmetic: 24 divided by 7 gives 3 complete cycles (3 &times; 7 = 21) with a remainder of 3. That remainder — <span className="text-gold-light font-semibold">24 mod 7 = 3</span> — is the engine of the weekday sequence. After 24 horas, the next day&apos;s first hora ruler is exactly 3 steps forward in the Chaldean order from the current day&apos;s ruler.</p>
        <p className="text-text-secondary text-sm leading-relaxed">This &quot;jump of 3&quot; transforms the speed-ranked Chaldean order into the familiar weekday order. It is not arbitrary, not culturally imposed, and not mythological — it is a strict mathematical consequence of dividing 24 hours among 7 planets.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: Saturday &rarr; Sunday &rarr; Monday &rarr; ...</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Chaldean order:</span> [0] Saturn, [1] Jupiter, [2] Mars, [3] Sun, [4] Venus, [5] Mercury, [6] Moon</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Saturday (Shanivara):</span> Day starts with Saturn (position 0). After 24 horas, jump 3 forward: position (0+3) mod 7 = 3 = <span className="text-emerald-400 font-semibold">Sun</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Sunday (Ravivara):</span> Day starts with Sun (position 3). Jump 3: (3+3) mod 7 = 6 = <span className="text-emerald-400 font-semibold">Moon</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Monday (Somavara):</span> Starts with Moon (position 6). Jump 3: (6+3) mod 7 = 2 = <span className="text-emerald-400 font-semibold">Mars</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Tuesday (Mangalavara):</span> Starts with Mars (position 2). Jump 3: (2+3) mod 7 = 5 = <span className="text-emerald-400 font-semibold">Mercury</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Wednesday (Budhavara):</span> Starts with Mercury (position 5). Jump 3: (5+3) mod 7 = 1 = <span className="text-emerald-400 font-semibold">Jupiter</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Thursday (Guruvara):</span> Starts with Jupiter (position 1). Jump 3: (1+3) mod 7 = 4 = <span className="text-emerald-400 font-semibold">Venus</span>.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Friday (Shukravara):</span> Starts with Venus (position 4). Jump 3: (4+3) mod 7 = 0 = <span className="text-emerald-400 font-semibold">Saturn</span>. The cycle is complete!</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Sanskrit &rarr; Latin &rarr; English: Weekday Names Across Civilizations</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The seven weekday names encode the same planetary assignments across Sanskrit, Latin, and English — powerful evidence that the Hora system was a shared framework of the ancient world, not a local invention.</p>
      </section>
      <section className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-gold-light text-left py-2 px-3 font-semibold">Planet</th>
              <th className="text-gold-light text-left py-2 px-3 font-semibold">Sanskrit</th>
              <th className="text-gold-light text-left py-2 px-3 font-semibold">Latin</th>
              <th className="text-gold-light text-left py-2 px-3 font-semibold">English</th>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Sun</td><td className="py-1.5 px-3">Ravivara</td><td className="py-1.5 px-3">Dies Solis</td><td className="py-1.5 px-3">Sunday</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Moon</td><td className="py-1.5 px-3">Somavara</td><td className="py-1.5 px-3">Dies Lunae</td><td className="py-1.5 px-3">Monday</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Mars</td><td className="py-1.5 px-3">Mangalavara</td><td className="py-1.5 px-3">Dies Martis</td><td className="py-1.5 px-3">Tuesday (Tiw = Norse Mars)</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Mercury</td><td className="py-1.5 px-3">Budhavara</td><td className="py-1.5 px-3">Dies Mercurii</td><td className="py-1.5 px-3">Wednesday (Woden = Norse Mercury)</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Jupiter</td><td className="py-1.5 px-3">Guruvara</td><td className="py-1.5 px-3">Dies Jovis</td><td className="py-1.5 px-3">Thursday (Thor = Norse Jupiter)</td></tr>
            <tr className="border-b border-gold-primary/8"><td className="py-1.5 px-3">Venus</td><td className="py-1.5 px-3">Shukravara</td><td className="py-1.5 px-3">Dies Veneris</td><td className="py-1.5 px-3">Friday (Frigg = Norse Venus)</td></tr>
            <tr><td className="py-1.5 px-3">Saturn</td><td className="py-1.5 px-3">Shanivara</td><td className="py-1.5 px-3">Dies Saturni</td><td className="py-1.5 px-3">Saturday</td></tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3 mt-4" style={{ fontFamily: 'var(--font-heading)' }}>Classical Sources</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The hora-weekday derivation appears in multiple ancient Indian texts. The <span className="text-gold-light font-medium">Surya Siddhanta</span> (likely 4th-5th century CE) describes the division of the day into 24 horas and the Chaldean ordering of planets. <span className="text-gold-light font-medium">Varahamihira&apos;s Brihat Samhita</span> (6th century CE) explicitly states the principle &quot;horeshvaro dineshvarah&quot; — the lord of the first hora is the lord of the day.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Even earlier, <span className="text-gold-light font-medium">Kautilya&apos;s Arthashastra</span> (c. 3rd century BCE) references the seven-day week and planetary time-keeping in the context of state administration, suggesting the system was well-established in India centuries before Varahamihira formalized it astronomically.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Key Takeaway</h4>
        <p className="text-text-secondary text-xs leading-relaxed">The 7-day week is not arbitrary. It is a mathematical inevitability arising from two facts: there are 7 visible &quot;wandering stars&quot; (planets), and the day is divided into 24 hours. The remainder 24 mod 7 = 3 generates the skip pattern that converts the speed-ranked Chaldean order into the weekday sequence. Sanskrit, Latin, and English weekday names all encode the same planetary assignments — testimony to a shared astronomical heritage spanning India, Babylon, Greece, and Rome.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Hora in Practical Muhurta Selection</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The hora system is not merely a theoretical derivation — it is a practical timing tool used daily by millions. Each of the 24 horas in a day carries the energy of its ruling planet, and practitioners select activities to align with the appropriate hora. The duration of each hora is not a fixed 60 minutes. Because the Vedic day begins at sunrise (not midnight), the daytime is divided into 12 equal horas from sunrise to sunset, and the nighttime into 12 equal horas from sunset to next sunrise. In summer at mid-latitudes, a daytime hora might last 80 minutes while a nighttime hora lasts only 40 minutes. This unequal division is called &quot;temporal hours&quot; and differs from the equal 60-minute hours used in modern timekeeping.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">For example, in Corseaux on April 2, 2026: sunrise ~07:10, sunset ~19:50. Day length = 12h 40m = 760 minutes. Each daytime hora = 760/12 = 63.3 minutes. Night length = 11h 20m = 680 minutes. Each nighttime hora = 680/12 = 56.7 minutes. Wednesday starts with Mercury hora at sunrise (07:10). The Mercury hora runs until 07:10 + 63.3 min = 08:13. Then Moon hora until 09:17, then Saturn until 10:20, then Jupiter until 11:23, and so on through the Chaldean sequence.</p>
        <p className="text-text-secondary text-sm leading-relaxed">This unequal hora duration creates a subtle but important effect: during summer, beneficial daytime horas are longer (more time to act), while during winter they are shorter. The converse holds for nighttime horas. Ancient astrologers considered this seasonally-adjusted timing to be more &quot;natural&quot; than fixed hours, as it respects the actual rhythm of light and darkness at each location.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;The Hora system is unique to India.&quot; The identical 24-hora planetary-hour system appears in Hellenistic astrology (Paulus Alexandrinus, 4th century CE), medieval European astrology, and Islamic astronomical texts. Whether it originated in Babylon, India, or Egypt — or arose independently in multiple places — is debated, but the mathematical structure is universal.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Each hora is exactly one hour (60 minutes).&quot; This is only true at the equinoxes when day and night are equal. At other times of year, daytime horas and nighttime horas have different lengths. Our app computes the exact unequal hora durations based on the actual sunrise and sunset for the user&apos;s location, ensuring accurate hora boundaries year-round.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;The &apos;jump of 3&apos; is a coincidence that happens to work.&quot; It is a strict mathematical necessity. For any system with P planets and H hours per day, the daily ruler advances by (H mod P) positions. Since H=24 and P=7, the advance is always 3. If there were 25 hours in a day, the advance would be 4, producing a different weekday sequence. If there were 8 visible planets, the entire system would restructure. The 7-day week is not culturally arbitrary — it is the unique mathematical consequence of 7 visible planets and 24 hours.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Practical Application: Choosing the Right Hora</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Sun hora:</span> Government work, meeting authority figures, medical treatments, gaining recognition. Avoid for secret activities.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Moon hora:</span> Travel, meeting people, public relations, agriculture, water-related activities. Best for activities involving the public.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Mars hora:</span> Surgery, sports, property purchase, military matters, courage-demanding actions. Avoid for peaceful negotiations.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Mercury hora:</span> Business communication, contracts, learning, writing, trade. The best hora for intellectual work.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Jupiter hora:</span> Spiritual practices, teaching, legal matters, charity, religious ceremonies. The most universally auspicious hora.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Venus hora:</span> Marriage, romance, arts, music, luxury purchases, beauty treatments. Best for all pleasurable activities.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Saturn hora:</span> Discipline, penance, dealing with servants, mining, agriculture, removal of obstacles. Powerful for karmic work.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Cross-References</h4>
        <p className="text-text-secondary text-xs leading-relaxed">For how Vara combines with Nakshatra and Tithi for muhurta selection, see <span className="text-gold-light">Module 7.3 (Vara)</span> and <span className="text-gold-light">Module 8.1 (Muhurta)</span>. For the astronomical computation of sunrise and sunset (which determines hora durations), see <span className="text-gold-light">Module 22.4 (Sunrise/Sunset)</span>. For the Choghadiya system (another time-division scheme based on Vara), see <span className="text-gold-light">Module 8.2 (Choghadiya)</span>. Our app&apos;s <span className="text-gold-light">Hora Calculator</span> tool provides real-time hora boundaries for any location worldwide.</p>
      </section>
    </div>
  );
}

export default function Module7_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]} questions={QUESTIONS} />;
}

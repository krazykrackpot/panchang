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

export default function Module7_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

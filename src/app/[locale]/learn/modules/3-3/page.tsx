'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/3-3.json';

const META: ModuleMeta = {
  id: 'mod_3_3',
  phase: 1,
  topic: 'Rashis',
  moduleNumber: '3.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Planetary Ownership of Signs</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each of the 12 signs is &quot;owned&quot; by one of the 7 true planets (Sun through Saturn). This ownership is called Swamitva (lordship). The lord of a sign is responsible for the affairs of that sign — wherever it sits in the chart, it carries the responsibilities of its owned houses with it.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Sun and Moon each rule ONE sign (Leo and Cancer respectively). The remaining 5 planets — Mercury, Venus, Mars, Jupiter, Saturn — each rule TWO signs, one odd-numbered and one even-numbered. Rahu and Ketu, being shadow planets (mathematical points where the Moon&apos;s orbit crosses the ecliptic), do NOT own any sign in the classical Parashari system.</p>
      </section>

      <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-gold-primary/15">
            <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
            <th className="text-left py-2 px-2 text-gold-dark">Sign(s) Owned</th>
            <th className="text-left py-2 px-2 text-gold-dark">Sign Number(s)</th>
            <th className="text-left py-2 px-2 text-gold-dark">Notes</th>
          </tr></thead>
          <tbody className="divide-y divide-gold-primary/5">
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-amber-400">Sun</td><td className="py-2 px-2 text-text-secondary">Leo</td><td className="py-2 px-2 text-text-secondary">5</td><td className="py-2 px-2 text-text-secondary text-xs">Only 1 sign — the royal luminary</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-blue-300">Moon</td><td className="py-2 px-2 text-text-secondary">Cancer</td><td className="py-2 px-2 text-text-secondary">4</td><td className="py-2 px-2 text-text-secondary text-xs">Only 1 sign — the nurturing luminary</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-red-400">Mars</td><td className="py-2 px-2 text-text-secondary">Aries, Scorpio</td><td className="py-2 px-2 text-text-secondary">1, 8</td><td className="py-2 px-2 text-text-secondary text-xs">Fire + Water — action meets depth</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-emerald-400">Mercury</td><td className="py-2 px-2 text-text-secondary">Gemini, Virgo</td><td className="py-2 px-2 text-text-secondary">3, 6</td><td className="py-2 px-2 text-text-secondary text-xs">Both Dual signs — adaptable</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-yellow-400">Jupiter</td><td className="py-2 px-2 text-text-secondary">Sagittarius, Pisces</td><td className="py-2 px-2 text-text-secondary">9, 12</td><td className="py-2 px-2 text-text-secondary text-xs">Dharma + Moksha — wisdom signs</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-pink-400">Venus</td><td className="py-2 px-2 text-text-secondary">Taurus, Libra</td><td className="py-2 px-2 text-text-secondary">2, 7</td><td className="py-2 px-2 text-text-secondary text-xs">Wealth + Relationships — pleasure signs</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-indigo-400">Saturn</td><td className="py-2 px-2 text-text-secondary">Capricorn, Aquarius</td><td className="py-2 px-2 text-text-secondary">10, 11</td><td className="py-2 px-2 text-text-secondary text-xs">Outermost planet — outermost signs</td></tr>
          </tbody>
        </table>
      </div>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The Symmetric Pattern</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The lordship pattern is beautifully symmetric around the Leo-Cancer axis (the two luminary signs). Moving outward from this center:</p>
        <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 font-mono text-xs text-text-secondary space-y-1">
          <p className="text-center text-gold-light">... Saturn | Jupiter | Mars | Venus | Mercury | <span className="text-amber-400">Moon</span> | <span className="text-amber-400">Sun</span> | Mercury | Venus | Mars | Jupiter | Saturn ...</p>
          <p className="text-center text-text-secondary/70">Cap | Sag | Sco | Lib | Vir | <span className="text-amber-300">Can</span> | <span className="text-amber-300">Leo</span> | Gem | Tau | Ari | Pis | Aqu</p>
          <p className="text-center text-text-secondary/55 text-xs">10 | 9 | 8 | 7 | 6 | 4 | 5 | 3 | 2 | 1 | 12 | 11</p>
        </div>
        <p className="text-text-secondary text-xs mt-3 leading-relaxed">This mirrors the solar system: Mercury (closest planet) rules signs adjacent to the luminaries. Saturn (farthest visible planet) rules the outermost signs. The ancients encoded the structure of the solar system into the zodiac.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">Rahu &amp; Ketu — No Ownership, But Affinity</h4>
        <p className="text-text-secondary text-sm leading-relaxed">While Rahu and Ketu do not own signs in classical Parashara, they have sign affinities used by some practitioners: Rahu has affinity with Aquarius (Saturn&apos;s sign, where Rahu behaves like Saturn) and some consider Virgo. Ketu has affinity with Scorpio (Mars&apos;s sign, where Ketu behaves like Mars) and some consider Pisces. These are NOT ownership — just behavioral similarity. In chart analysis, Rahu/Ketu give results based on their sign lord, star lord, and conjunctions.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Moolatrikona — The Planet&apos;s &quot;Home Office&quot;</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Moolatrikona is a specific degree range within a sign where a planet functions at near-peak efficiency. It is stronger than own sign (Swakshetra) but not quite as powerful as exaltation (Uchcha). Think of it as the planet&apos;s &quot;home office&quot; — it&apos;s in familiar territory AND in its most productive zone.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The hierarchy of planetary dignity, from strongest to weakest: Exaltation &gt; Moolatrikona &gt; Own Sign &gt; Friendly Sign &gt; Neutral Sign &gt; Enemy Sign &gt; Debilitation. A planet in Moolatrikona gives excellent results — reliable, productive, and authoritative.</p>
      </section>

      <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-gold-primary/15">
            <th className="text-left py-2 px-2 text-gold-dark">Planet</th>
            <th className="text-left py-2 px-2 text-gold-dark">Moolatrikona Sign</th>
            <th className="text-left py-2 px-2 text-gold-dark">Degree Range</th>
            <th className="text-left py-2 px-2 text-gold-dark">Own Sign Range</th>
          </tr></thead>
          <tbody className="divide-y divide-gold-primary/5">
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-amber-400">Sun</td><td className="py-2 px-2 text-text-secondary">Leo</td><td className="py-2 px-2 text-gold-light font-mono">0° - 20°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">20° - 30°</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-blue-300">Moon</td><td className="py-2 px-2 text-text-secondary">Taurus</td><td className="py-2 px-2 text-gold-light font-mono">3° - 30°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">Cancer 0° - 30°</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-red-400">Mars</td><td className="py-2 px-2 text-text-secondary">Aries</td><td className="py-2 px-2 text-gold-light font-mono">0° - 12°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">12° - 30° Aries + all Scorpio</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-emerald-400">Mercury</td><td className="py-2 px-2 text-text-secondary">Virgo</td><td className="py-2 px-2 text-gold-light font-mono">15° - 20°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">Rest of Virgo + all Gemini</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-yellow-400">Jupiter</td><td className="py-2 px-2 text-text-secondary">Sagittarius</td><td className="py-2 px-2 text-gold-light font-mono">0° - 10°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">10° - 30° Sag + all Pisces</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-pink-400">Venus</td><td className="py-2 px-2 text-text-secondary">Libra</td><td className="py-2 px-2 text-gold-light font-mono">0° - 15°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">15° - 30° Libra + all Taurus</td></tr>
            <tr className="hover:bg-gold-primary/3"><td className="py-2 px-2 text-indigo-400">Saturn</td><td className="py-2 px-2 text-text-secondary">Aquarius</td><td className="py-2 px-2 text-gold-light font-mono">0° - 20°</td><td className="py-2 px-2 text-text-secondary/70 font-mono">20° - 30° Aqu + all Capricorn</td></tr>
          </tbody>
        </table>
      </div>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-300 text-xs uppercase tracking-widest font-bold mb-3">Key Observations</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">Mercury&apos;s narrow range:</span> Only 5° of Moolatrikona (Virgo 15°-20°). This reflects Mercury&apos;s nature — it&apos;s the most adaptable planet, comfortable almost everywhere, so its &quot;peak zone&quot; is very focused.</p>
          <p><span className="text-gold-light font-medium">Moon in Taurus (not Cancer):</span> Moon&apos;s own sign is Cancer, but Moolatrikona is Taurus — where Moon is also exalted at 3°. This makes early Taurus the single most powerful position for the Moon in the entire zodiac.</p>
          <p><span className="text-gold-light font-medium">All Moolatrikonas are in one of the planet&apos;s own signs</span> except Moon (Taurus is not Moon&apos;s own sign but its exaltation sign). This exception makes Moon unique among the 7 planets.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Dignity Hierarchy — Complete Ranking</h4>
        <div className="space-y-1 text-text-secondary text-xs font-mono">
          <p><span className="text-emerald-400">1. Exaltation (Uchcha)</span> — Peak power, maximum dignity</p>
          <p><span className="text-emerald-300">2. Moolatrikona</span> — Home office, near-peak productive zone</p>
          <p><span className="text-green-300">3. Own Sign (Swakshetra)</span> — Comfortable, reliable, at home</p>
          <p><span className="text-amber-300">4. Friendly Sign (Mitra Kshetra)</span> — Guest at a friend&apos;s house, comfortable</p>
          <p><span className="text-amber-400">5. Neutral Sign (Sama Kshetra)</span> — Average, neither helped nor hindered</p>
          <p><span className="text-red-300">6. Enemy Sign (Shatru Kshetra)</span> — Uncomfortable, restricted, weakened</p>
          <p><span className="text-red-400">7. Debilitation (Neecha)</span> — Lowest dignity, maximum weakness</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The House Lord Concept — THE Foundation of Vedic Prediction</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">This is arguably the single most important concept in Vedic astrology. Once you understand it, everything else falls into place. The principle is simple but profound:</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 ring-1 ring-gold-primary/15">
        <p className="text-gold-light text-sm font-bold leading-relaxed text-center">
          &quot;The SIGN on a house cusp determines the LORD of that house. The lord&apos;s condition (sign, house, aspects, conjunctions) determines the OUTCOME of that house&apos;s affairs.&quot;
        </p>
      </section>

      <section>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">For example: If Aries is on the 5th house cusp, then Mars (lord of Aries) becomes the &quot;5th lord.&quot; The 5th house governs children, education, creativity, intelligence, and past-life merit. To predict 5th house outcomes, you analyze Mars: What sign is Mars in? (dignity) What house is Mars in? (area of life activated) What planets aspect Mars? (influences) What planets conjoin Mars? (modification) Is Mars retrograde, combust, or in planetary war? (condition)</p>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 12: [5], 7: [2] }}
        title="Aries Lagna — Venus (7th Lord) Exalted in 12th"
        highlight={[7, 12]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <div className="space-y-4 text-text-secondary text-xs leading-relaxed">
          <div>
            <p className="text-gold-light font-medium mb-1">Example 1: Aries Lagna, Venus (7th lord) in Pisces (12th house)</p>
            <p>7th house = Libra, lord = Venus. Venus is in Pisces (EXALTED) in the 12th house. The 7th house (marriage, partnerships) is ruled by an exalted planet — this is excellent for marriage quality. But it&apos;s in the 12th (foreign lands, expenses, bed pleasures, isolation). Prediction: The spouse may be from another country/culture, the relationship has a deeply spiritual dimension, or the couple may live abroad. Venus being exalted means the marriage is ultimately fulfilling despite 12th house challenges.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium mb-1">Example 2: Cancer Lagna, Mars (10th lord) in Capricorn (7th house)</p>
            <p>10th house = Aries, lord = Mars. Mars is in Capricorn (EXALTED) in the 7th house. Career (10th) is ruled by an exalted planet — this is excellent for professional success. But it&apos;s in the 7th (partnerships, spouse, public dealing). Prediction: Career success comes through partnerships, business collaboration, or public engagement. The person is likely a powerful business leader or public figure. Exalted Mars in 7th also means the spouse is strong-willed and assertive.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium mb-1">Example 3: Virgo Lagna, Saturn (5th lord) in Aries (8th house, debilitated)</p>
            <p>5th house = Capricorn, lord = Saturn. Saturn is in Aries (DEBILITATED) in the 8th house. 5th house matters (children, education, creativity) are ruled by a debilitated planet in a difficult house. Prediction: Delays or difficulties in having children, interrupted education, creativity blocked by fear or circumstances. The 8th house placement adds sudden changes and transformation to 5th house matters. However, if Neecha Bhanga (debilitation cancellation) applies, these difficulties eventually transform into strengths.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Why This Matters — The Core Algorithm</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Every prediction in Vedic astrology follows this algorithm:</p>
        <div className="space-y-1 text-text-secondary text-xs font-mono">
          <p>1. Identify the HOUSE for the life topic (e.g., 7th = marriage)</p>
          <p>2. Find the SIGN on that house cusp</p>
          <p>3. Find the LORD of that sign</p>
          <p>4. Analyze the lord&apos;s DIGNITY (sign placement)</p>
          <p>5. Analyze the lord&apos;s HOUSE position (which life area it connects to)</p>
          <p>6. Check ASPECTS on the lord (benefic = support, malefic = challenge)</p>
          <p>7. Check CONJUNCTIONS (planets sharing the same house modify results)</p>
          <p>8. Check the lord&apos;s DASHA timing (when will this house activate?)</p>
        </div>
        <p className="text-text-secondary text-xs mt-3 leading-relaxed">This is why the lordship table is not just a reference — it is THE fundamental lookup that drives ALL Vedic chart interpretation. Our app&apos;s Tippanni (interpretive commentary) follows exactly this algorithm for every house in your chart.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Planets IN a house are more important than the house lord.&apos;</span><br />
          <span className="text-emerald-300">REALITY: The house lord is the PRIMARY determinant. Planets IN the house modify and color the results, but the lord sets the foundation. A strong lord with no planets in the house still gives good results. A weak lord with benefics in the house gives mixed results.</span></p>
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Rahu/Ketu can be house lords.&apos;</span><br />
          <span className="text-emerald-300">REALITY: In classical Parashara, only the 7 true planets (Sun-Saturn) are house lords. Rahu/Ketu in a house influence it, but the lord is always the sign&apos;s true planetary ruler.</span></p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Dig Bala — Directional Strength</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Each planet gains maximum directional strength (Dig Bala) in a specific house:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mt-2">
          <p><span className="text-amber-400">Sun + Mars:</span> 10th house (south/zenith)</p>
          <p><span className="text-blue-300">Moon + Venus:</span> 4th house (north/nadir)</p>
          <p><span className="text-emerald-400">Mercury + Jupiter:</span> 1st house (east/ascendant)</p>
          <p><span className="text-indigo-400">Saturn:</span> 7th house (west/descendant)</p>
        </div>
        <p className="text-text-secondary text-xs mt-3 leading-relaxed">A house lord WITH Dig Bala in its position is doubly strong — it has both the authority of lordship and the power of directional strength.</p>
      </section>
    </div>
  );
}

export default function Module3_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

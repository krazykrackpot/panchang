'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_3_2', phase: 1, topic: 'Rashis', moduleNumber: '3.2',
  title: { en: "Sign Qualities — Chara, Sthira, Dwiswabhava", hi: "राशि गुण — चर, स्थिर, द्विस्वभाव" },
  subtitle: { en: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns", hi: '' },
  estimatedMinutes: 12,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q3_2_01', type: 'mcq', question: { en: "Which signs are Movable (Chara)?", hi: '' }, options: [{ en: "Taurus, Leo, Scorpio, Aquarius", hi: '' }, { en: "Aries, Cancer, Libra, Capricorn", hi: '' }, { en: "Gemini, Virgo, Sagittarius, Pisces", hi: '' }, { en: "All fire signs", hi: '' }], correctAnswer: 1, explanation: { en: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras.", hi: '' }, classicalRef: "BPHS Ch.4 v.7" },
  { id: 'q3_2_02', type: 'mcq', question: { en: "What element is Aquarius?", hi: '' }, options: [{ en: "Fire", hi: '' }, { en: "Earth", hi: '' }, { en: "Air", hi: '' }, { en: "Water", hi: '' }], correctAnswer: 2, explanation: { en: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius.", hi: '' } },
  { id: 'q3_2_03', type: 'true_false', question: { en: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal.", hi: '' }, correctAnswer: true, explanation: { en: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance.", hi: '' }, classicalRef: "BPHS Ch.4" },
  { id: 'q3_2_04', type: 'mcq', question: { en: "Shirshodaya signs manifest events:", hi: '' }, options: [{ en: "Slowly", hi: '' }, { en: "Quickly (head rises first)", hi: '' }, { en: "Only at night", hi: '' }, { en: "Never", hi: '' }], correctAnswer: 1, explanation: { en: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly.", hi: '' } },
  { id: 'q3_2_05', type: 'mcq', question: { en: "3 Qualities × 4 Elements = ?", hi: '' }, options: [{ en: "8 combinations", hi: '' }, { en: "10 combinations", hi: '' }, { en: "12 unique combinations (= 12 signs)", hi: '' }, { en: "16 combinations", hi: '' }], correctAnswer: 2, explanation: { en: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac.", hi: '' } },
  { id: 'q3_2_06', type: 'true_false', question: { en: "Cancer is a Movable Water sign.", hi: '' }, correctAnswer: true, explanation: { en: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy.", hi: '' } },
  { id: 'q3_2_07', type: 'mcq', question: { en: "Which house positions do the Fixed signs occupy?", hi: '' }, options: [{ en: "1, 4, 7, 10", hi: '' }, { en: "2, 5, 8, 11", hi: '' }, { en: "3, 6, 9, 12", hi: '' }, { en: "1, 2, 3, 4", hi: '' }], correctAnswer: 1, explanation: { en: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima).", hi: '' } },
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Three Qualities × Four Elements = 12 Signs</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Every sign has two fundamental classifications: its QUALITY (how it acts) and its ELEMENT (what energy it carries). Quality determines whether a sign initiates (Chara/Movable), sustains (Sthira/Fixed), or adapts (Dwiswabhava/Dual). Element determines the type of energy: Fire (action), Earth (material), Air (intellect), Water (emotion).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The 12 signs are organized in a repeating pattern: Movable-Fixed-Dual, cycling through 4 times. Each cycle runs through one element group. This creates 12 unique quality-element combinations — no two signs have the same combination.</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Detailed Explanation</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">MOVABLE (Chara) signs — Aries, Cancer, Libra, Capricorn (houses 1,4,7,10 = Kendras)
These signs INITIATE. They start things, pioneer new territory, and don't like staying still. Aries initiates with fire (action), Cancer initiates with water (emotion), Libra initiates with air (relationships), Capricorn initiates with earth (structures).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">FIXED (Sthira) signs — Taurus, Leo, Scorpio, Aquarius (houses 2,5,8,11)
These signs SUSTAIN. They hold, preserve, and resist change. Taurus sustains earth (wealth), Leo sustains fire (creativity), Scorpio sustains water (intensity), Aquarius sustains air (ideas).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">DUAL (Dwiswabhava) signs — Gemini, Virgo, Sagittarius, Pisces (houses 3,6,9,12)
These signs ADAPT. They are flexible, mutable, and can go either way. Gemini adapts with air (communication), Virgo adapts with earth (service), Sagittarius adapts with fire (philosophy), Pisces adapts with water (spirituality).</p>
      </section>
        <div className="overflow-x-auto glass-card rounded-xl p-4 border border-gold-primary/10 mt-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">Element</th>
              <th className="text-left py-2 px-2 text-gold-dark">Movable</th>
              <th className="text-left py-2 px-2 text-gold-dark">Fixed</th>
              <th className="text-left py-2 px-2 text-gold-dark">Dual</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              <tr className="hover:bg-gold-primary/3"><td className="py-1.5 px-2 text-text-secondary">Fire (Agni)</td><td className="py-1.5 px-2 text-text-secondary">Aries (Movable)</td><td className="py-1.5 px-2 text-text-secondary">Leo (Fixed)</td><td className="py-1.5 px-2 text-text-secondary">Sagittarius (Dual)</td></tr>              <tr className="hover:bg-gold-primary/3"><td className="py-1.5 px-2 text-text-secondary">Earth (Prithvi)</td><td className="py-1.5 px-2 text-text-secondary">Capricorn (Movable)</td><td className="py-1.5 px-2 text-text-secondary">Taurus (Fixed)</td><td className="py-1.5 px-2 text-text-secondary">Virgo (Dual)</td></tr>              <tr className="hover:bg-gold-primary/3"><td className="py-1.5 px-2 text-text-secondary">Air (Vayu)</td><td className="py-1.5 px-2 text-text-secondary">Libra (Movable)</td><td className="py-1.5 px-2 text-text-secondary">Aquarius (Fixed)</td><td className="py-1.5 px-2 text-text-secondary">Gemini (Dual)</td></tr>              <tr className="hover:bg-gold-primary/3"><td className="py-1.5 px-2 text-text-secondary">Water (Jal)</td><td className="py-1.5 px-2 text-text-secondary">Cancer (Movable)</td><td className="py-1.5 px-2 text-text-secondary">Scorpio (Fixed)</td><td className="py-1.5 px-2 text-text-secondary">Pisces (Dual)</td></tr>
            </tbody>
          </table>
        </div>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Additional Classifications — Gender, Rising Type, Day/Night</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">ODD signs (1,3,5,7,9,11) = Male (Purusha), Diurnal (day-strong), Cruel (Krura)
EVEN signs (2,4,6,8,10,12) = Female (Stri), Nocturnal (night-strong), Gentle (Saumya)</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">SHIRSHODAYA (head-first rising) signs: Gemini, Leo, Virgo, Libra, Scorpio, Aquarius — these signs rise HEAD first on the eastern horizon. Events predicted from these signs manifest QUICKLY.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">PRISHTODAYA (back-first rising) signs: Aries, Taurus, Cancer, Sagittarius, Capricorn — these rise BACK first. Events manifest SLOWLY.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">UBHAYODAYA (both ways): Pisces — can go either way.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">This classification directly affects prediction timing in Prashna (horary) astrology.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">MISCONCEPTION: 'Aquarius is a water sign because of the water-bearer symbol.'</span><br />
          <span className="text-emerald-300">REALITY: Aquarius is an AIR sign. The water-bearer represents the distribution of knowledge and humanitarian ideals — NOT the water element. Water signs are Cancer, Scorpio, Pisces (all water creatures).</span></p>          <p><span className="text-red-300 font-bold">MISCONCEPTION: 'Fixed signs never change.'</span><br />
          <span className="text-emerald-300">REALITY: Fixed signs resist change but CAN change — they just take longer. Saturn (the planet of slow change) rules two fixed signs (Taurus via exaltation, Aquarius via lordship).</span></p>
        </div>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">These classifications from BPHS remain the foundation of sign interpretation in all modern Jyotish practice and are used in our app&apos;s chart analysis.</p>
      </section>
    </div>
  );
}
export default function Module3_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

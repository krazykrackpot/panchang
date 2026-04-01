'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_3_3', phase: 1, topic: 'Rashis', moduleNumber: '3.3',
  title: { en: "Sign Lordship and the Luminaries", hi: "राशि स्वामित्व" },
  subtitle: { en: "The symmetric lordship pattern, why Sun and Moon each rule one sign, and directional strength", hi: '' },
  estimatedMinutes: 11,
  crossRefs: [],
};

const QUESTIONS: ModuleQuestion[] = [
  { id: 'q3_3_01', type: 'mcq', question: { en: "How many signs does Saturn rule?", hi: '' }, options: [{ en: "1", hi: '' }, { en: "2", hi: '' }, { en: "3", hi: '' }, { en: "4", hi: '' }], correctAnswer: 1, explanation: { en: "Saturn rules Capricorn (10th) and Aquarius (11th). Only Sun and Moon rule 1 sign each.", hi: '' }, classicalRef: "BPHS Ch.3" },
  { id: 'q3_3_02', type: 'mcq', question: { en: "Sun has Dig Bala (directional strength) in which house?", hi: '' }, options: [{ en: "1st", hi: '' }, { en: "4th", hi: '' }, { en: "7th", hi: '' }, { en: "10th", hi: '' }], correctAnswer: 3, explanation: { en: "Sun is strongest in 10th — at the zenith, like noon when the Sun is overhead.", hi: '' }, classicalRef: "BPHS Ch.27" },
  { id: 'q3_3_03', type: 'true_false', question: { en: "Rahu and Ketu own signs in the zodiac.", hi: '' }, correctAnswer: false, explanation: { en: "False. Rahu and Ketu are shadow planets (mathematical points) and do NOT own any sign. Some modern practitioners assign co-rulership, but classical Parashara does not.", hi: '' } },
  { id: 'q3_3_04', type: 'mcq', question: { en: "The lordship pattern is symmetric around which two signs?", hi: '' }, options: [{ en: "Aries-Libra", hi: '' }, { en: "Leo-Cancer", hi: '' }, { en: "Sagittarius-Gemini", hi: '' }, { en: "Capricorn-Aquarius", hi: '' }], correctAnswer: 1, explanation: { en: "Leo (Sun) and Cancer (Moon) are the center. Mercury rules adjacent signs, then Venus, Mars, Jupiter, Saturn outward.", hi: '' } },
  { id: 'q3_3_05', type: 'true_false', question: { en: "A house lord in its own sign strengthens that house.", hi: '' }, correctAnswer: true, explanation: { en: "Correct. Lord in own sign = comfortable, effective, well-supported. The house affairs thrive.", hi: '' } },
  { id: 'q3_3_06', type: 'mcq', question: { en: "Mercury rules which two signs?", hi: '' }, options: [{ en: "Aries and Scorpio", hi: '' }, { en: "Gemini and Virgo", hi: '' }, { en: "Taurus and Libra", hi: '' }, { en: "Sagittarius and Pisces", hi: '' }], correctAnswer: 1, explanation: { en: "Mercury rules Gemini (3rd, air, dual) and Virgo (6th, earth, dual). Both are dual signs — reflecting Mercury's adaptable nature.", hi: '' }, classicalRef: "BPHS Ch.3" }
];

function Page1() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{META.title.en}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Each of the 12 signs is ruled by one of the 7 true planets (Sun through Saturn). Rahu and Ketu, being shadow planets without physical bodies, do not own any sign. This creates a beautiful symmetric pattern centered on the two luminaries.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Sun rules Leo (the hottest, most royal sign) and Moon rules Cancer (the most nurturing, emotional sign). These two luminaries sit at the center of the lordship pattern. Moving outward from this center: Mercury rules the adjacent signs (Gemini and Virgo), Venus rules the next pair (Taurus and Libra), Mars rules Aries and Scorpio, Jupiter rules Sagittarius and Pisces, and Saturn rules the outermost signs (Capricorn and Aquarius).</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">BPHS Ch.3 establishes these lordships as fundamental to chart interpretation. The concept of Dig Bala (directional strength) is defined in BPHS Ch.27: each planet has maximum strength in a specific house direction.</p>
      </section>
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Detailed Explanation</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The symmetric pattern mirrors planetary distance from the Sun. Mercury, the closest true planet, rules signs adjacent to the luminaries. Saturn, the most distant visible planet, rules signs opposite to the luminaries. This is not coincidence — it reflects the ancient understanding of the solar system structure.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Dig Bala (directional strength) assigns each planet maximum power in a specific house: Sun and Mars are strongest in the 10th (south/zenith), Moon and Venus in the 4th (north/nadir), Mercury and Jupiter in the 1st (east/ascendant), Saturn in the 7th (west/descendant). This means the same planet can perform very differently depending on which house it occupies.</p>
        <p className="text-text-secondary text-sm leading-relaxed">When a house lord is strong (in own sign, exalted, or in a friendly sign), the affairs of that house thrive. When the lord is weak (debilitated, combust, in enemy sign), the house affairs suffer. This is why lordship analysis is the ENGINE of prediction — you don&apos;t just look at what&apos;s IN a house, but where the house&apos;s LORD has gone.</p>
      </section>
    </div>
  );
}

function Page2() {
  return (
    <div className="space-y-6">
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1:</span> For Aries Lagna: 7th house is Libra, lord is Venus. If Venus is in Pisces (exalted in the 12th house), it means relationships have a spiritual/foreign dimension — the partner may be from another culture or the relationship has karmic undertones.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 2:</span> For Cancer Lagna: 10th house is Aries, lord is Mars. If Mars is in Capricorn (exalted in the 7th), career success comes through partnerships, public dealing, and assertive engagement — a powerful placement for business leaders.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-red-300 font-bold">Misconception:</span> All planets rule two signs each, so benefics rule one of every sign pair.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-emerald-300">Reality:</span> Sun and Moon each rule ONE sign. Sun=Leo, Moon=Cancer. All other true planets (Mercury through Saturn) rule exactly TWO signs each — one odd-numbered and one even-numbered. This creates perfect mathematical balance.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">The lordship system is the backbone of all prediction. Our app uses it for every analysis — from Varga charts to Dasha interpretation to yoga detection.</p>
      </section>
    </div>
  );
}

export default function Module3_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />]} questions={QUESTIONS} />;
}

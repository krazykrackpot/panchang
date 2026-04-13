'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/18-4.json';

const META: ModuleMeta = {
  id: 'mod_18_4', phase: 5, topic: 'Strength', moduleNumber: '18.4',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 13,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Bala-Panchaka — The Five Age States
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Every planet occupies a specific degree within its sign (0-30&deg;), and this degree determines its &ldquo;age&rdquo; — a metaphor for how effectively it can deliver results. The Bala-Panchaka (&ldquo;five-fold age&rdquo;) system assigns one of five life stages to every planet based on where its degree falls within the sign.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          In odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): <strong className="text-gold-light">Bala</strong> (infant) = 0-6&deg;, <strong className="text-gold-light">Kumara</strong> (youth) = 6-12&deg;, <strong className="text-gold-light">Yuva</strong> (prime) = 12-18&deg;, <strong className="text-gold-light">Vriddha</strong> (old) = 18-24&deg;, <strong className="text-gold-light">Mrita</strong> (dead) = 24-30&deg;. In even signs, the order reverses completely: Mrita at 0-6&deg; through Bala at 24-30&deg;.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Yuva is the strongest.</strong> A planet at 15&deg; of an odd sign is at its peak — like a person in the prime of life, fully capable of producing results. Bala (infant) shows potential that hasn&rsquo;t matured yet. Mrita (dead) indicates the planet&rsquo;s significations are effectively inert — present in the chart but unable to deliver. Kumara and Vriddha fall in between with moderate capacity.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Bala-Panchaka system appears in Brihat Parashara Hora Shastra (BPHS), chapter 45. Parashara uses the human lifecycle metaphor deliberately: just as a child cannot do an adult&rsquo;s work and an elderly person lacks youthful vigour, a planet&rsquo;s degree within its sign determines its functional capacity. The reversal in even signs reflects the Vedic principle of alternation (vishama-sama) that pervades Indian astronomical thinking.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart
          ascendant={5}
          planets={{ 1: [4] }}
          title="Leo Lagna — Jupiter at 15° Leo (Yuva Avastha)"
          highlight={[1]}
        />
        <p className="text-text-secondary text-xs leading-relaxed">
          Jupiter at 15&deg; Leo (odd sign): degree falls in 12-18&deg; range = Yuva (prime). This Jupiter is at full strength by age-state. Now consider Jupiter at 15&deg; Virgo (even sign): in even signs the ranges reverse, so 12-18&deg; = Vriddha (old). Same degree, different sign type, completely different avastha. Always check whether the sign is odd or even first.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Many beginners confuse Bala-Panchaka with Shadbala or assume that a Mrita planet is &ldquo;dead&rdquo; in the sense of producing no results at all. In practice, Mrita means the planet&rsquo;s results are severely diminished and delayed — not that they vanish entirely. A well-dignified planet in Mrita avastha (e.g., exalted but at 28&deg; of an odd sign) still delivers, just with less vigour and more struggle than the same planet in Yuva.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Software-generated charts typically show planetary degrees but rarely flag the Bala-Panchaka state automatically. Knowing this system lets you instantly assess any planet&rsquo;s &ldquo;vitality&rdquo; from the degree alone — no special calculation needed. It is one of the fastest assessments an astrologer can make: glance at the degree, check odd/even sign, and you know the planet&rsquo;s age-state in seconds.
        </p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Deeptadi Avasthas — Nine States of Dignity
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Where Bala-Panchaka measures age (degree), Deeptadi measures &ldquo;dignity context&rdquo; — what kind of sign or condition the planet finds itself in. There are nine Deeptadi states, each named for the planet&rsquo;s emotional or functional condition:
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Deepta</strong> (brilliant) — exalted, maximum dignity. <strong className="text-gold-light">Swastha</strong> (content) — in own sign, comfortable and self-sufficient. <strong className="text-gold-light">Mudita</strong> (happy) — in a friend&rsquo;s sign, well-supported. <strong className="text-gold-light">Shanta</strong> (peaceful) — in a benefic varga/subdivision, quietly favourable. <strong className="text-gold-light">Shakta</strong> (powerful) — retrograde, intensified influence due to proximity to Earth.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-red-400">Dina</strong> (miserable) — in an enemy&rsquo;s sign, uncomfortable and weakened. <strong className="text-red-400">Vikala</strong> (disabled) — combust (too close to the Sun), unable to function independently. <strong className="text-red-400">Khala</strong> (wicked) — debilitated, producing distorted or harmful results. <strong className="text-red-400">Bhita</strong> (fearful) — in planetary war (graha yuddha), anxious and unstable.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Deeptadi system is described in BPHS and elaborated by Varahamihira in Brihat Jataka. The nine states form a hierarchy from Deepta (best) to Bhita (most troubled). Unlike Bala-Panchaka which is purely mathematical, Deeptadi requires knowing the planet&rsquo;s dignity (exalted, own sign, friend&rsquo;s sign, etc.) as well as special conditions like combustion, retrogression, and planetary war.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [2] }}
          title="Aries Lagna — Mars at 28° Capricorn (10th) — Deepta + Bala"
          highlight={[10]}
        />
        <p className="text-text-secondary text-xs leading-relaxed">
          Mars at 28&deg; Capricorn: Mars is exalted in Capricorn, so its Deeptadi state is Deepta (brilliant). But check the Bala-Panchaka: Capricorn is an even sign, so 24-30&deg; = Bala (infant). This Mars is dignified but young — powerful in quality but immature in delivery. This is exactly why multiple avastha systems exist: they capture different dimensions of a planet&rsquo;s condition that a single system would miss.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Shakta (retrograde = powerful) surprises many students who expect retrogression to weaken a planet. In Western astrology, retrograde often carries negative connotations. In Vedic astrology, retrogression is a source of strength — the planet is physically closest to Earth and its energy is most concentrated. However, &ldquo;powerful&rdquo; does not mean &ldquo;benefic&rdquo;: a retrograde malefic is powerfully malefic.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The Deeptadi framework gives practitioners a quick emotional vocabulary for planets. Instead of saying &ldquo;Venus is in its enemy sign,&rdquo; you say &ldquo;Venus is Dina (miserable)&rdquo; — which immediately conveys both the technical condition and the quality of results. This language is especially useful in client consultations where vivid metaphors communicate more effectively than technical jargon.
        </p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Lajjitadi Avasthas — Six Complex States from BPHS
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Lajjitadi system is the most nuanced of the three. These six states depend not just on sign placement but on house position, conjunctions, and aspects — making them context-dependent and chart-specific. They describe the &ldquo;quality&rdquo; of a planet&rsquo;s output with remarkable psychological precision.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <strong className="text-gold-light">Lajjita</strong> (ashamed) — planet in the 5th house conjoined with Rahu, Ketu, Saturn, or Mars. The creative/intellectual house is compromised by malefic company, producing shame or embarrassment in matters of children, romance, or education. <strong className="text-gold-light">Garvita</strong> (proud) — planet in exaltation or moolatrikona, delivering results with confidence and authority. <strong className="text-gold-light">Kshudhita</strong> (hungry) — planet in an enemy sign or aspected by an enemy, starved of resources and producing results marked by want.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <strong className="text-gold-light">Trushita</strong> (thirsty) — planet in a watery sign (Cancer, Scorpio, Pisces) aspected by an enemy, producing emotional craving and chronic dissatisfaction. <strong className="text-gold-light">Mudita</strong> (delighted) — planet in a friend&rsquo;s sign conjoined with Jupiter, producing joyful and expansive results. <strong className="text-gold-light">Kshobhita</strong> (agitated) — planet conjoined with the Sun and aspected by a malefic, producing restless, disturbed results with inner conflict.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Parashara devotes significant attention to Lajjitadi avasthas in BPHS, treating them as predictive tools for the &ldquo;flavour&rdquo; of results. While Bala-Panchaka tells you how much a planet delivers and Deeptadi tells you the planet&rsquo;s inherent dignity, Lajjitadi tells you the emotional texture — whether results come with pride, shame, hunger, thirst, delight, or agitation. This three-layered approach is uniquely Parashari.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">Worked Example</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 4: [5, 4] }}
          title="Aries Lagna — Venus + Jupiter in Cancer (4th) — Mudita"
          highlight={[4]}
        />
        <p className="text-text-secondary text-xs leading-relaxed">
          Venus in Cancer (a friend&rsquo;s sign for Venus) conjoined with Jupiter: this is Mudita (delighted). Venus is happy, well-supported, and Jupiter&rsquo;s benefic presence amplifies the joy. If this Venus rules the 7th house, relationships come with genuine happiness and mutual growth. Now consider Venus in Cancer conjoined with Saturn instead, aspected by Mars — the friend&rsquo;s sign advantage is overshadowed, and Venus becomes Kshudhita (hungry): relationships feel starved of warmth despite potential.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Common Misconception</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A frequent error is applying Lajjitadi states mechanically without considering the full chart. A planet can technically satisfy the conditions for Lajjita (in 5th with Rahu) but if Rahu is very well-disposed (in a friendly sign, aspected by Jupiter), the &ldquo;shame&rdquo; effect is greatly reduced. Lajjitadi states describe tendencies, not absolutes — they must be weighed alongside other strength measures like Shadbala and Vimshopaka.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Lajjitadi avasthas are gaining renewed interest among modern Jyotish practitioners because they bridge the gap between technical chart analysis and psychological astrology. The six emotional states (ashamed, proud, hungry, thirsty, delighted, agitated) map remarkably well to how people actually experience planetary periods. During a Lajjita planet&rsquo;s dasha, the native often literally feels embarrassed about the areas that planet governs — a level of experiential prediction that purely mathematical systems cannot capture.
        </p>
      </section>
    </div>
  );
}

export default function Module18_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

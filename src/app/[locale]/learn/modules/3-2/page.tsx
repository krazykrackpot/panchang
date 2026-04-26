'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/3-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';

const META: ModuleMeta = {
  id: 'mod_3_2',
  phase: 1,
  topic: 'Rashis',
  moduleNumber: '3.2',
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
      <KeyTakeaway
        points={[
          'Signs are classified as Movable (Chara), Fixed (Sthira), or Dual (Dwiswabhava) — this quality shapes how the sign expresses energy.',
          'Combining modality (movable/fixed/dual) with element (fire/earth/air/water) creates 12 unique personality-energy patterns.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Three Qualities (Gunas): How Signs Act</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Every sign has a fundamental quality that determines HOW it operates. Quality is the engine of behavior — it tells you whether a sign initiates, sustains, or adapts. Understanding quality is essential for both personality reading and muhurta (timing) work.</p>
        <div className="flex flex-wrap gap-3 my-2">
          <BeginnerNote term="Tattva (Element)" explanation="One of four fundamental energies — Fire (Agni), Earth (Prithvi), Air (Vayu), or Water (Jala) — that defines what kind of energy a sign carries." />
          <BeginnerNote term="Guna (Quality)" explanation="A sign's mode of action — Chara (movable/cardinal) initiates, Sthira (fixed) sustains, Dwiswabhava (dual/mutable) adapts." />
          <BeginnerNote term="Chara / Sthira / Dwiswabhava" explanation="The three modalities: Chara signs (Aries, Cancer, Libra, Capricorn) start things; Sthira signs (Taurus, Leo, Scorpio, Aquarius) hold things; Dwiswabhava signs (Gemini, Virgo, Sagittarius, Pisces) change things." />
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Chara (Cardinal / Movable)</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-gold-light font-bold">Signs: Aries, Cancer, Libra, Capricorn</span> (houses 1, 4, 7, 10 = Kendras)
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Chara signs INITIATE. They are the starters, the pioneers, the ones who get things moving. Aries initiates with fire (bold action), Cancer initiates with water (emotional bonding), Libra initiates with air (relationships and diplomacy), Capricorn initiates with earth (structures and ambitions). In muhurta, Chara signs are ideal for starting journeys, beginning new ventures, and anything requiring forward momentum.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-amber-400 text-xs font-bold">PERSONALITY:</span> People with many planets in Chara signs are restless, ambitious, always starting new projects. Their weakness: they may not finish what they start.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Sthira (Fixed)</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-gold-light font-bold">Signs: Taurus, Leo, Scorpio, Aquarius</span> (houses 2, 5, 8, 11 = Panapharas)
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Sthira signs SUSTAIN. They hold, preserve, and resist change. Taurus sustains earth (wealth, possessions), Leo sustains fire (creativity, authority), Scorpio sustains water (intensity, secrets), Aquarius sustains air (ideals, networks). In muhurta, Sthira signs are ideal for laying foundations, installing things meant to last, and ceremonies of permanence (like housewarming).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-amber-400 text-xs font-bold">PERSONALITY:</span> People with many planets in Sthira signs are determined, reliable, stubborn. Their weakness: resistance to necessary change, getting stuck.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Dwiswabhava (Dual / Mutable)</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-gold-light font-bold">Signs: Gemini, Virgo, Sagittarius, Pisces</span> (houses 3, 6, 9, 12 = Apoklimas)
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Dwiswabhava signs ADAPT. They are flexible, versatile, and can switch between modes. Gemini adapts with air (communication, learning), Virgo adapts with earth (analysis, service), Sagittarius adapts with fire (philosophy, exploration), Pisces adapts with water (spirituality, imagination). In muhurta, Dual signs suit learning, teaching, healing, and any activity requiring flexibility.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-amber-400 text-xs font-bold">PERSONALITY:</span> People with many Dual sign planets are adaptable, versatile, and multitalented. Their weakness: indecisiveness, scattered energy, lack of focus.
        </p>
      </section>

      <WhyItMatters locale={locale}>The modality-element combination is not just theory — it directly affects muhurta selection. Starting a business under a movable sign, laying a foundation under a fixed sign, or beginning studies under a dual sign can make a real difference in outcome.</WhyItMatters>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15 mt-4">
        <h4 className="text-amber-300 text-xs uppercase tracking-widest font-bold mb-3">Quality and Activity Timing</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">Starting a business?</span> Choose a Chara (Movable) Lagna — Aries, Cancer, Libra, or Capricorn rising at the muhurta moment.</p>
          <p><span className="text-gold-light font-medium">Laying a foundation?</span> Choose a Sthira (Fixed) Lagna — Taurus, Leo, Scorpio, or Aquarius for permanence.</p>
          <p><span className="text-gold-light font-medium">Starting a course?</span> Choose a Dwiswabhava (Dual) Lagna — Gemini, Virgo, Sagittarius, or Pisces for learning and growth.</p>
        </div>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Four Elements (Tattvas): What Energy Signs Carry</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">While quality tells you HOW a sign acts, the element tells you WHAT kind of energy it carries. The four Tattvas (elements) are fundamental to Indian philosophy — they appear in Ayurveda, Yoga, and Tantra as well as Jyotish. Each element contains 3 signs, one of each quality.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Agni (Fire) — Action and Transformation</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-red-300 font-bold">Signs: Aries (Cardinal), Leo (Fixed), Sagittarius (Mutable)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Fire is the energy of action, courage, leadership, and transformation. Fire signs are visible, dynamic, and assertive. They are the doers of the zodiac.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Aggression, anger, impatience, burnout, domineering behavior. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Lack of motivation, passivity, fear, inability to lead.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Prithvi (Earth) — Material and Stability</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-amber-300 font-bold">Signs: Taurus (Fixed), Virgo (Mutable), Capricorn (Cardinal)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Earth is the energy of material reality, structure, practicality, and endurance. Earth signs build, accumulate, and ground abstract ideas into tangible results.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Materialism, stubbornness, heaviness, resistance to spiritual growth. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Impractical, ungrounded, financially unstable, lacks follow-through.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-cyan-500/15">
        <h4 className="text-cyan-400 text-xs uppercase tracking-widest font-bold mb-3">Vayu (Air) — Intellect and Connection</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-cyan-300 font-bold">Signs: Gemini (Mutable), Libra (Cardinal), Aquarius (Fixed)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Air is the energy of intellect, communication, ideas, and social connection. Air signs think, analyze, relate, and conceptualize. They are the connectors of the zodiac.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Overthinking, anxiety, detachment from emotions, superficiality. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Poor communication, social isolation, narrow thinking, inability to see others&apos; viewpoints.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-400 text-xs uppercase tracking-widest font-bold mb-3">Jala (Water) — Emotion and Intuition</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">Signs: Cancer (Cardinal), Scorpio (Fixed), Pisces (Mutable)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Water is the energy of emotion, intuition, nurturing, and depth. Water signs feel deeply, connect emotionally, and have strong psychic sensitivity. They are the feelers of the zodiac.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Emotional overwhelm, moodiness, dependency, escapism, inability to set boundaries. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Emotional coldness, disconnection, inability to empathize, dry personality.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mt-4">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Reading Element Balance in a Chart</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Count how many of the 9 planets fall in each element group. A balanced chart has planets spread across all 4 elements. Most charts are imbalanced — and that imbalance IS the person&apos;s temperament:</p>
        <div className="space-y-1 text-text-secondary text-xs leading-relaxed mt-2">
          <p><span className="text-gold-light font-medium">4+ planets in Fire:</span> Dominant leader, high energy, needs to learn patience and empathy</p>
          <p><span className="text-gold-light font-medium">4+ planets in Earth:</span> Material achiever, practical builder, needs to develop spiritual awareness</p>
          <p><span className="text-gold-light font-medium">4+ planets in Air:</span> Intellectual communicator, social butterfly, needs to develop emotional depth</p>
          <p><span className="text-gold-light font-medium">4+ planets in Water:</span> Emotional empath, intuitive healer, needs to develop practical grounding</p>
          <p><span className="text-gold-light font-medium">0 planets in an element:</span> That element&apos;s qualities are the person&apos;s blindspot — the area they must consciously develop</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Quality-Element Matrix — 12 Unique Combinations</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Every sign is a unique combination of one quality and one element. 3 qualities x 4 elements = exactly 12, which is why there are exactly 12 signs. This is the fundamental mathematical structure of the zodiac, not an arbitrary choice.</p>
      </section>

      <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-gold-primary/15">
            <th className="text-left py-2 px-2 text-gold-dark">Element / Quality</th>
            <th className="text-left py-2 px-2 text-gold-dark">Chara (Cardinal)</th>
            <th className="text-left py-2 px-2 text-gold-dark">Sthira (Fixed)</th>
            <th className="text-left py-2 px-2 text-gold-dark">Dwiswabhava (Dual)</th>
          </tr></thead>
          <tbody className="divide-y divide-gold-primary/5">
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-red-400 font-bold">Agni (Fire)</td>
              <td className="py-2 px-2 text-text-secondary">Aries — initiates action</td>
              <td className="py-2 px-2 text-text-secondary">Leo — sustains authority</td>
              <td className="py-2 px-2 text-text-secondary">Sagittarius — adapts philosophy</td>
            </tr>
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-amber-400 font-bold">Prithvi (Earth)</td>
              <td className="py-2 px-2 text-text-secondary">Capricorn — initiates structures</td>
              <td className="py-2 px-2 text-text-secondary">Taurus — sustains wealth</td>
              <td className="py-2 px-2 text-text-secondary">Virgo — adapts through service</td>
            </tr>
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-cyan-400 font-bold">Vayu (Air)</td>
              <td className="py-2 px-2 text-text-secondary">Libra — initiates relationships</td>
              <td className="py-2 px-2 text-text-secondary">Aquarius — sustains ideals</td>
              <td className="py-2 px-2 text-text-secondary">Gemini — adapts communication</td>
            </tr>
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-blue-400 font-bold">Jala (Water)</td>
              <td className="py-2 px-2 text-text-secondary">Cancer — initiates nurturing</td>
              <td className="py-2 px-2 text-text-secondary">Scorpio — sustains intensity</td>
              <td className="py-2 px-2 text-text-secondary">Pisces — adapts spiritually</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">How to Read Chart Distribution</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">To assess temperament, count planets in each quality AND each element separately:</p>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">Quality distribution:</span> Most planets in Cardinal = initiator/leader. Most in Fixed = determined/stubborn. Most in Mutable = adaptable/scattered. This tells you the person&apos;s MODE of operation.</p>
          <p><span className="text-gold-light font-medium">Element distribution:</span> Dominant Fire = active/aggressive. Dominant Earth = practical/materialistic. Dominant Air = intellectual/social. Dominant Water = emotional/intuitive. This tells you the person&apos;s ENERGY type.</p>
          <p><span className="text-gold-light font-medium">Combined reading:</span> Cardinal Fire (Aries dominance) = aggressive pioneer. Fixed Water (Scorpio dominance) = deeply intense, emotionally unyielding. Mutable Earth (Virgo dominance) = adaptable analyst, service-oriented perfectionist. Each combination paints a unique portrait.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Additional Classifications</h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <div>
            <p className="text-gold-light font-medium text-xs mb-1">Gender (Linga)</p>
            <p className="text-xs">ODD signs (1,3,5,7,9,11) = Male/Purusha/Diurnal/Cruel. EVEN signs (2,4,6,8,10,12) = Female/Stri/Nocturnal/Gentle.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs mb-1">Rising Type (Udaya)</p>
            <p className="text-xs">Shirshodaya (head-first, quick results): Gemini, Leo, Virgo, Libra, Scorpio, Aquarius. Prishtodaya (back-first, slow results): Aries, Taurus, Cancer, Sagittarius, Capricorn. Ubhayodaya (both ways): Pisces only.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs mb-1">Fruitfulness</p>
            <p className="text-xs">Water signs (Cancer, Scorpio, Pisces) are Fruitful — favorable for conception and fertility questions. Fire signs are Barren. Earth and Air signs are Semi-fruitful.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Aquarius is a water sign because of the water-bearer symbol.&apos;</span><br />
          <span className="text-emerald-300">REALITY: Aquarius is an AIR sign. The water-bearer represents the distribution of knowledge and humanitarian ideals — NOT the water element.</span></p>
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Fixed signs never change.&apos;</span><br />
          <span className="text-emerald-300">REALITY: Fixed signs resist change but CAN change — they just take longer. Think of them as having high inertia, not immobility.</span></p>
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Mutable signs are weak.&apos;</span><br />
          <span className="text-emerald-300">REALITY: Mutable signs are adaptable, not weak. Flexibility is a strength — these signs survive by evolving. The greatest teachers (Sagittarius) and healers (Virgo) are Mutable.</span></p>
        </div>
      </section>
    </div>
  );
}

export default function Module3_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

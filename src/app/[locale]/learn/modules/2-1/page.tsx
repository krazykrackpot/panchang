'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/2-1.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import BeginnerNote from '@/components/learn/BeginnerNote';
import WhyItMatters from '@/components/learn/WhyItMatters';

const META: ModuleMeta = {
  id: 'mod_2_1',
  phase: 1,
  topic: 'Grahas',
  moduleNumber: '2.1',
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
          'Each of the 9 grahas (planets) has a distinct nature — benefic or malefic — and governs specific life areas called karakatvas.',
          'A planet\'s inherent nature never changes, but its effects vary based on where it sits in your chart.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>What Is a Graha? More Than Just a Planet</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The Western word "planet" comes from Greek <em>planetes</em> (πλανήτης) — "wanderer." It's a passive, descriptive term. The Sanskrit word <span className="text-gold-light font-bold">Graha</span> (ग्रह) comes from the root <em>grah</em> (ग्रह्) — to <span className="text-gold-light">seize, grasp, eclipse, or take possession of</span>. This is an <em>active</em> term. A Graha doesn't just exist in the sky — it <span className="text-gold-light font-bold">acts on you</span>.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This etymological difference reveals a fundamental philosophical distinction. In Western astronomy, planets are objects to be studied. In Jyotish, Grahas are <span className="text-gold-light">forces that influence</span> — cosmic agents that "grasp" aspects of your life. When we say "Saturn is in your 7th house," we mean Saturn is <em>acting on</em> your relationships, <em>seizing</em> them with its characteristic energy of delay, discipline, and karma.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          There are <span className="text-gold-light font-bold">9 Grahas</span> in Jyotish — not 7, not 8, not 10. This number is not arbitrary: 27 nakshatras ÷ 9 grahas = 3 nakshatras per graha, forming the Vimshottari Dasha system. 9 × 9 = 81, the number of possible Mahadasha-Antardasha combinations. The entire predictive timing framework of Jyotish is built on this 9-fold structure.
        </p>
        <div className="flex flex-wrap gap-3 my-2">
          <BeginnerNote term="Navagraha" explanation="The nine cosmic influencers of Jyotish: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu (north lunar node), and Ketu (south lunar node)." />
          <BeginnerNote term="Benefic / Malefic" explanation="Natural classification of planets. Benefics (Jupiter, Venus, waxing Moon) tend to support; malefics (Saturn, Mars, Sun, Rahu, Ketu) tend to challenge. Neither is 'good' or 'bad' — they describe the quality of energy." />
          <BeginnerNote term="Karaka" explanation="A planet's natural signification — the life areas it inherently represents. E.g., Venus is the karaka of marriage; Jupiter is the karaka of wisdom and children." />
        </div>
        <WhyItMatters locale={locale}>The nine grahas are not just planets — they are the cosmic forces that the entire dasha and transit system is built on. Every prediction in Jyotish traces back to these nine.</WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Parashara opens BPHS Chapter 3 with: <em>"O Brahmin, I shall now tell you about the Grahas."</em> He describes each Graha's nature (Prakriti), appearance (Swarupa), ruling deity (Devata), element (Tattva), gender (Linga), caste (Varna), direction (Disha), and natural significations (Karakatva). This chapter is the foundation — without understanding each Graha's inherent nature, no chart can be read correctly.
        </p>
      </section>

      {/* Graha Classification Table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Nine Grahas — Complete Classification</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-1.5 text-gold-dark">Graha</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Sanskrit</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Nature</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Guna</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Gender</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Element</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Day</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Gem</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { name: 'Sun', sa: 'सूर्य', nature: 'Malefic', guna: 'Sattvic', gender: 'Male', element: 'Fire', day: 'Sunday', gem: 'Ruby', color: 'text-amber-400' },
                { name: 'Moon', sa: 'चन्द्र', nature: 'Benefic*', guna: 'Sattvic', gender: 'Female', element: 'Water', day: 'Monday', gem: 'Pearl', color: 'text-blue-300' },
                { name: 'Mars', sa: 'मंगल', nature: 'Malefic', guna: 'Tamasic', gender: 'Male', element: 'Fire', day: 'Tuesday', gem: 'Red Coral', color: 'text-red-400' },
                { name: 'Mercury', sa: 'बुध', nature: 'Neutral**', guna: 'Rajasic', gender: 'Neuter', element: 'Earth', day: 'Wednesday', gem: 'Emerald', color: 'text-emerald-400' },
                { name: 'Jupiter', sa: 'गुरु', nature: 'Benefic', guna: 'Sattvic', gender: 'Male', element: 'Ether', day: 'Thursday', gem: 'Yellow Sapphire', color: 'text-yellow-400' },
                { name: 'Venus', sa: 'शुक्र', nature: 'Benefic', guna: 'Rajasic', gender: 'Female', element: 'Water', day: 'Friday', gem: 'Diamond', color: 'text-pink-300' },
                { name: 'Saturn', sa: 'शनि', nature: 'Malefic', guna: 'Tamasic', gender: 'Neuter', element: 'Air', day: 'Saturday', gem: 'Blue Sapphire', color: 'text-slate-300' },
                { name: 'Rahu', sa: 'राहु', nature: 'Malefic', guna: 'Tamasic', gender: '—', element: '—', day: '—', gem: 'Hessonite', color: 'text-violet-400' },
                { name: 'Ketu', sa: 'केतु', nature: 'Malefic', guna: 'Tamasic', gender: '—', element: '—', day: '—', gem: "Cat's Eye", color: 'text-gray-400' },
              ].map((g, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className={`py-1.5 px-1.5 font-bold ${g.color}`}>{g.name}</td>
                  <td className="py-1.5 px-1.5 text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{g.sa}</td>
                  <td className={`py-1.5 px-1.5 ${g.nature.includes('Benefic') ? 'text-emerald-400' : g.nature === 'Neutral**' ? 'text-amber-400' : 'text-red-400'}`}>{g.nature}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.guna}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.gender}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.element}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.day}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{g.gem}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-text-tertiary text-xs mt-2 space-y-0.5">
            <p>* Moon is benefic when waxing (Shukla Paksha) and malefic when waning (Krishna Paksha, specifically after K.Ashtami)</p>
            <p>** Mercury is neutral — adopts the nature of planets it associates with</p>
          </div>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Karakatva — What Each Graha Signifies</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Karakatva</span> (कारकत्व) means "signification" — the things a planet naturally represents regardless of which house it occupies. These are <span className="text-gold-light">Naisargika</span> (natural) Karakatvas, fixed by the planet's intrinsic nature. They differ from <span className="text-gold-light">Bhava</span> (house) Karakatvas, which depend on house placement.
        </p>

        <div className="space-y-3">
          {[
            { name: 'Sun (Surya)', sa: 'सूर्य', color: 'text-amber-400', border: 'border-amber-500/15', karakatva: 'Soul (Atma), father, authority, government, bones, heart, right eye, ego, vitality, copper, wheat, forest, temple, east direction', karakatvahi: 'आत्मा, पिता, अधिकार, सरकार, अस्थि, हृदय, दाहिना नेत्र, अहंकार, जीवनशक्ति' },
            { name: 'Moon (Chandra)', sa: 'चन्द्र', color: 'text-blue-300', border: 'border-blue-500/15', karakatva: 'Mind (Manas), mother, emotions, public, blood, left eye, fluids, travel, silver, rice, northwest direction', karakatvahi: 'मन, माता, भावनाएं, जनता, रक्त, बायां नेत्र, तरल, यात्रा, चांदी' },
            { name: 'Mars (Mangal)', sa: 'मंगल', color: 'text-red-400', border: 'border-red-500/15', karakatva: 'Courage, siblings (younger), land/property, energy, surgery, military, fire, red coral, south direction', karakatvahi: 'साहस, छोटे भाई-बहन, भूमि/संपत्ति, ऊर्जा, शल्यक्रिया, सेना, अग्नि' },
            { name: 'Mercury (Budha)', sa: 'बुध', color: 'text-emerald-400', border: 'border-emerald-500/15', karakatva: 'Intellect, speech, commerce, writing, mathematics, skin, nervous system, maternal uncle, north direction', karakatvahi: 'बुद्धि, वाणी, वाणिज्य, लेखन, गणित, त्वचा, मातुल (मामा)' },
            { name: 'Jupiter (Guru)', sa: 'गुरु', color: 'text-yellow-400', border: 'border-yellow-500/15', karakatva: 'Wisdom, dharma, children, teacher, husband (in female chart), liver, fat, gold, northeast direction, sacred texts', karakatvahi: 'ज्ञान, धर्म, संतान, गुरु, पति (स्त्री कुण्डली), यकृत, स्वर्ण, शास्त्र' },
            { name: 'Venus (Shukra)', sa: 'शुक्र', color: 'text-pink-300', border: 'border-pink-500/15', karakatva: 'Marriage, wife (in male chart), beauty, arts, music, luxury, vehicles, semen, diamond, southeast direction', karakatvahi: 'विवाह, पत्नी (पुरुष कुण्डली), सौंदर्य, कला, संगीत, विलासिता, वाहन, हीरा' },
            { name: 'Saturn (Shani)', sa: 'शनि', color: 'text-slate-300', border: 'border-slate-500/15', karakatva: 'Longevity, karma, servants, labor, iron, oil, chronic disease, delay, discipline, democracy, west direction', karakatvahi: 'दीर्घायु, कर्म, सेवक, श्रम, लोहा, तेल, दीर्घ रोग, विलम्ब, अनुशासन, लोकतंत्र' },
          ].map((g, i) => (
            <div key={i} className={`p-3 rounded-xl border ${g.border}`}>
              <div className={`font-bold text-sm ${g.color} mb-1`}>{g.name} <span className="text-text-tertiary font-normal text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({g.sa})</span></div>
              <p className="text-text-secondary text-xs leading-relaxed">{g.karakatva}</p>
            </div>
          ))}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Rahu & Ketu — The Shadow Grahas</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Rahu and Ketu deserve special attention because they are unique to Indian astronomy — no other civilization treated the lunar nodes as "planets" with astrological significance.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Astronomically:</span> The Moon's orbit is tilted ~5° to the ecliptic. It crosses the ecliptic at two points: the <span className="text-violet-400">ascending node</span> (Rahu — where the Moon crosses from south to north) and the <span className="text-gray-400">descending node</span> (Ketu — north to south). These points are always exactly 180° apart and move retrograde (backward through the zodiac) at about 19.4° per year, completing one full cycle in ~18.6 years.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          <span className="text-gold-light font-bold">Why they cause eclipses:</span> When the Sun or Moon is near a node (within ~18° for solar eclipses, ~12° for lunar eclipses), an eclipse occurs. This is why they're called <span className="text-gold-light">Chaya Graha</span> (छाया ग्रह) — shadow planets. The mythology of the serpent Svarbhanu being cut in two (head = Rahu, tail = Ketu) by Vishnu's Sudarshana Chakra is a narrative encoding of this astronomical fact.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "The Sun is a benefic planet because sunlight is good."<br />
          <span className="text-emerald-300">Reality:</span> In Jyotish, the Sun is a NATURAL MALEFIC (Papa Graha). Its energy is powerful but harsh — it burns (combustion), it demands (ego/authority), and its heat is scorching. Benefic/malefic doesn't mean good/bad — it describes the quality of energy.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Saturn is always bad."<br />
          <span className="text-emerald-300">Reality:</span> Saturn is the planet of KARMA — it gives you what you deserve, for better or worse. Saturn in the 10th house can give extraordinary career success through discipline. Saturn is the most democratic planet — he treats kings and beggars equally. He delays but ultimately delivers.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Rahu and Ketu are imaginary, so they can't affect you."<br />
          <span className="text-emerald-300">Reality:</span> They cause ECLIPSES — the most dramatic astronomical events visible from Earth. If they can block the Sun and Moon, the idea that they influence earthly affairs is at least astronomically grounded. They represent the karmic axis — Rahu = material desire (what you chase), Ketu = spiritual detachment (what you release).</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">The 7 visible Grahas</span> are real astronomical bodies whose positions are computed to sub-arcsecond precision by modern ephemerides. <span className="text-blue-300 font-bold">Rahu and Ketu</span> are mathematically precise points — the mean lunar node is computed analytically, the true node accounts for perturbations. NASA uses the same nodal calculations for eclipse prediction.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          What's <span className="text-amber-400">debatable</span> is whether these astronomical positions have the MEANINGS Jyotish assigns (karakatva). That's beyond the scope of astronomy — it's the interpretive layer. Our app computes positions with modern precision, then applies the classical interpretive framework from BPHS.
        </p>
      </section>

      <ExampleChart
        ascendant={1}
        planets={{ 6: [6], 10: [0], 4: [1], 1: [2] }}
        title="Saturn in 6th House — Karakatva Alignment"
        highlight={[6]}
      />
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Worked Example: Reading Karakatvas in a Chart</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Scenario:</span> Saturn (karaka of servants, labor, chronic disease) is in the 6th house (house of enemies, disease, daily work). What does this indicate?
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Analysis:</span> Saturn's karakatva (labor, discipline, chronic conditions) aligns with the 6th house's significations (daily work, health challenges, service). This is a case where the karaka is in a "friendly" house — Saturn can actually do well here. The native may overcome enemies through patience, excel in service-oriented work (healthcare, social work, legal aid), but must watch for chronic health conditions (Saturn = slow, 6th = disease → slow-developing ailments). This is actually considered a good placement (malefic in dusthana = protective, per Viparita Raja Yoga logic).
        </p>
      </section>
    </div>
  );
}

export default function Module2_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

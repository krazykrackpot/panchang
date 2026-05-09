'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/6-4.json';
import QuickCheck from '@/components/learn/QuickCheck';
import WhyItMatters from '@/components/learn/WhyItMatters';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_6_4', phase: 2, topic: 'Nakshatra', moduleNumber: '6.4',
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
          'Gana (temperament): Deva (divine), Manushya (human), Rakshasa (demonic) — 9 nakshatras each. Scores 6 points in matching.',
          'Yoni (animal nature): 14 animal pairs representing sexual and instinctual compatibility. Scores 4 points.',
          'Nadi (constitution): Aadi/Madhya/Antya cycling through nakshatras. Scores 8 points — the highest single kuta.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'गण वर्गीकरण — देव, मनुष्य, राक्षस' : 'Gana Classification — Deva, Manushya, Rakshasa'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each of the 27 nakshatras is assigned to one of three ganas (temperaments), with 9 nakshatras per gana. This classification reflects the fundamental nature and disposition of a person born under that nakshatra.
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Deva Gana (Divine):</span> Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati. Gentle, spiritual, generous temperament. Naturally inclined towards dharma and social harmony.</p>
          <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Manushya Gana (Human):</span> Bharani, Rohini, Ardra, Purva Phalguni, Uttara Phalguni, Purva Ashadha, Uttara Ashadha, Purva Bhadrapada, Uttara Bhadrapada. Balanced, practical, worldly temperament. Mix of spiritual and material inclinations.</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Rakshasa Gana (Demonic):</span> Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Mula, Dhanishtha, Shatabhisha. Intense, independent, fierce temperament. Strong-willed, unconventional, and direct. NOT evil — the term &quot;Rakshasa&quot; here means assertive power, not malevolence.</p>
        </div>
        <WhyItMatters locale={locale}>
          Gana compatibility is crucial in marriage matching. Deva-Deva and Manushya-Manushya matches score full points. Deva-Manushya is acceptable. Deva-Rakshasa is challenging. Rakshasa-Rakshasa can actually work well — two intense personalities may understand each other better than a gentle-fierce pairing.
        </WhyItMatters>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Gana Scoring in Ashta Kuta (6 points maximum)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-text-tertiary py-1 pr-3">Bride \ Groom</th>
                <th className="text-left text-gold-light py-1 pr-3">Deva</th>
                <th className="text-left text-gold-light py-1 pr-3">Manushya</th>
                <th className="text-left text-gold-light py-1">Rakshasa</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-3 text-gold-light">Deva</td><td className="py-1 pr-3 text-emerald-400">6</td><td className="py-1 pr-3">6</td><td className="py-1 text-red-400">0</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3 text-gold-light">Manushya</td><td className="py-1 pr-3">5</td><td className="py-1 pr-3 text-emerald-400">6</td><td className="py-1 text-red-400">0</td></tr>
              <tr><td className="py-1 pr-3 text-gold-light">Rakshasa</td><td className="py-1 pr-3 text-red-400">1</td><td className="py-1 pr-3 text-red-400">0</td><td className="py-1 text-emerald-400">6</td></tr>
            </tbody>
          </table>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'योनि सारणी — 14 पशु प्रतीक' : 'Yoni Table — 14 Animal Symbols'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Each nakshatra is assigned a Yoni (animal symbol) representing sexual and instinctual compatibility. There are 14 animal types, each appearing in a male-female pair across 2 nakshatras (14 x 2 = 28, but only 27 nakshatras exist — Abhijit, the 28th, is omitted in the standard system). Matching yonis of the same animal scores full 4 points. Friendly animals score well; enemy animals score 0.
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-gold-light py-1 pr-2">Animal</th>
                <th className="text-left text-gold-light py-1 pr-2">Male Nakshatra</th>
                <th className="text-left text-gold-light py-1 pr-2">Female Nakshatra</th>
                <th className="text-left text-gold-light py-1">Enemy</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Horse</td><td className="py-1 pr-2">Ashwini</td><td className="py-1 pr-2">Shatabhisha</td><td className="py-1">Buffalo</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Elephant</td><td className="py-1 pr-2">Bharani</td><td className="py-1 pr-2">Revati</td><td className="py-1">Lion</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Sheep</td><td className="py-1 pr-2">Pushya</td><td className="py-1 pr-2">Krittika</td><td className="py-1">Monkey</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Serpent</td><td className="py-1 pr-2">Rohini</td><td className="py-1 pr-2">Mrigashira</td><td className="py-1">Mongoose</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Dog</td><td className="py-1 pr-2">Mula</td><td className="py-1 pr-2">Ardra</td><td className="py-1">Hare</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Cat</td><td className="py-1 pr-2">Ashlesha</td><td className="py-1 pr-2">Punarvasu</td><td className="py-1">Rat</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Rat</td><td className="py-1 pr-2">Magha</td><td className="py-1 pr-2">P.Phalguni</td><td className="py-1">Cat</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Cow</td><td className="py-1 pr-2">U.Phalguni</td><td className="py-1 pr-2">U.Bhadrapada</td><td className="py-1">Tiger</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Buffalo</td><td className="py-1 pr-2">Hasta</td><td className="py-1 pr-2">Swati</td><td className="py-1">Horse</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Tiger</td><td className="py-1 pr-2">Chitra</td><td className="py-1 pr-2">Vishakha</td><td className="py-1">Cow</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Hare</td><td className="py-1 pr-2">Anuradha</td><td className="py-1 pr-2">Jyeshtha</td><td className="py-1">Dog</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Monkey</td><td className="py-1 pr-2">P.Ashadha</td><td className="py-1 pr-2">Shravana</td><td className="py-1">Sheep</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-2">Mongoose</td><td className="py-1 pr-2">U.Ashadha</td><td className="py-1 pr-2">—</td><td className="py-1">Serpent</td></tr>
              <tr><td className="py-1 pr-2">Lion</td><td className="py-1 pr-2">Dhanishtha</td><td className="py-1 pr-2">P.Bhadrapada</td><td className="py-1">Elephant</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">Scoring: Same animal = 4 pts. Friendly animals = 3. Neutral = 2. Unfriendly = 1. Enemy animals = 0.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'नाड़ी सारणी — आदि, मध्य, अन्त्य' : 'Nadi Table — Aadi, Madhya, Antya'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Nadi Kuta carries the highest weight of 8 out of 36 points. The 27 nakshatras are divided into three nadis corresponding to Ayurvedic body constitutions. The assignment cycles in groups of three: Aadi (Vata), Madhya (Pitta), Antya (Kapha), repeating across all 27.
        </p>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Aadi Nadi (Vata):</span> Ashwini, Ardra, Punarvasu, U.Phalguni, Hasta, Jyeshtha, Mula, Shatabhisha, P.Bhadrapada. Air/ether constitution — restless, creative, variable energy.</p>
          <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Madhya Nadi (Pitta):</span> Bharani, Mrigashira, Pushya, P.Phalguni, Chitra, Anuradha, P.Ashadha, Dhanishtha, U.Bhadrapada. Fire/water constitution — intense, driven, sharp intellect.</p>
          <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Antya Nadi (Kapha):</span> Krittika, Rohini, Ashlesha, Magha, Swati, Vishakha, U.Ashadha, Shravana, Revati. Earth/water constitution — stable, nurturing, enduring.</p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">When both partners share the same nadi, it scores 0 points and triggers Nadi Dosha — the most feared incompatibility. The Ayurvedic logic is that identical constitutions amplify imbalances rather than complement them. However, Nadi Dosha has well-documented cancellation conditions: same rashi but different nakshatras, same nakshatra but different rashis, or friendly rashi lords.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example — Full Kuta Scoring'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Bride:</span> Rohini (4th nakshatra) — Manushya gana, Serpent yoni, Antya nadi.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Groom:</span> Hasta (13th nakshatra) — Deva gana, Buffalo yoni, Aadi nadi.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Gana:</span> Manushya-Deva = 5/6 points. <span className="text-gold-light font-medium">Yoni:</span> Serpent-Buffalo = neutral = 2/4 points. <span className="text-gold-light font-medium">Nadi:</span> Antya-Aadi = different = 8/8 points (full score, no Nadi Dosha).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          These three kutas alone contribute 15/18 points. Combined with the other 5 kutas (Varna, Vashya, Tara, Graha Maitri, Bhakoot), the total determines overall compatibility. Our <span className="text-gold-light">Kundali Matching tool</span> computes all 8 kutas automatically.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Myth:</span> &quot;Rakshasa gana people are evil.&quot; &quot;Rakshasa&quot; in this context means intense, independent, and fiercely self-determined — not malevolent. Many leaders, innovators, and artists have Rakshasa gana nakshatras.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Myth:</span> &quot;Nadi Dosha absolutely prevents marriage.&quot; Nadi Dosha affects roughly 1 in 3 random matches. Millions of successful marriages exist despite it. The cancellation conditions are well-documented and widely accepted.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Myth:</span> &quot;Only the total score matters.&quot; The pattern across all 8 kutas matters more than the total. A score of 20/36 with 0 in Nadi (8 pts) and Bhakoot (7 pts) is far more concerning than 18/36 with balanced distribution.
        </p>
      </section>

      <QuickCheck
        question="How many points does Nadi Kuta carry in the Ashta Kuta system?"
        options={['3 points', '5 points', '7 points', '8 points']}
        correctIndex={3}
        explanation="Nadi Kuta carries 8 out of 36 points — the highest single kuta. When both partners share the same nadi, it scores 0 and triggers Nadi Dosha."
      />

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Complete Ashta Kuta Point Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left text-gold-light py-1 pr-3">Kuta</th>
                <th className="text-left text-gold-light py-1 pr-3">Max Points</th>
                <th className="text-left text-gold-light py-1">What It Measures</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Varna</td><td className="py-1 pr-3">1</td><td className="py-1">Spiritual/ego compatibility</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Vashya</td><td className="py-1 pr-3">2</td><td className="py-1">Dominance/attraction dynamics</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Tara</td><td className="py-1 pr-3">3</td><td className="py-1">Star positional relationship</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Yoni</td><td className="py-1 pr-3">4</td><td className="py-1">Sexual/instinctual compatibility</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Graha Maitri</td><td className="py-1 pr-3">5</td><td className="py-1">Planetary friendship (Moon lords)</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Gana</td><td className="py-1 pr-3">6</td><td className="py-1">Temperament (Deva/Manushya/Rakshasa)</td></tr>
              <tr className="border-b border-white/5"><td className="py-1 pr-3">Bhakoot</td><td className="py-1 pr-3">7</td><td className="py-1">Moon-sign lord relationship</td></tr>
              <tr><td className="py-1 pr-3 font-bold">Nadi</td><td className="py-1 pr-3 font-bold">8</td><td className="py-1">Constitutional/genetic compatibility</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">Total: 36 points. Minimum 18 (50%) traditionally required. Above 25 is considered excellent. Our <span className="text-gold-light">Kundali Matching tool</span> computes all 8 kutas with cancellation checks.</p>
      </section>
    </div>
  );
}

export default function Module6_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

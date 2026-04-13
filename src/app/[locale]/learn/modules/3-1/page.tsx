'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/3-1.json';

const META: ModuleMeta = {
  id: 'mod_3_1',
  phase: 1,
  topic: 'Rashis',
  moduleNumber: '3.1',
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
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Kalapurusha — The Cosmic Body</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Parashara begins his description of the Rashis (BPHS Ch.4) with a remarkable concept: the entire zodiac is the body of the <span className="text-gold-light font-bold">Kalapurusha</span> (कालपुरुष) — the "Cosmic Person" or "Time Being." Each sign corresponds to a specific body part, creating a direct bridge between astrology and the physical body.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This is not just a poetic metaphor — it has practical consequences. When a sign is afflicted in your chart (malefic planets, lord in dusthana), the corresponding body part may be vulnerable to disease or injury. This is the foundation of <span className="text-gold-light">Medical Astrology</span> (Vaidya Jyotish) and its connection to Ayurveda.
        </p>

        {/* Kalapurusha body mapping */}
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Kalapurusha Body Map</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {[
              { sign: 'Aries (मेष)', body: 'Head, Brain', num: 1, color: 'text-red-400' },
              { sign: 'Taurus (वृषभ)', body: 'Face, Throat, Neck', num: 2, color: 'text-emerald-400' },
              { sign: 'Gemini (मिथुन)', body: 'Arms, Shoulders', num: 3, color: 'text-sky-400' },
              { sign: 'Cancer (कर्क)', body: 'Chest, Lungs', num: 4, color: 'text-blue-300' },
              { sign: 'Leo (सिंह)', body: 'Heart, Stomach', num: 5, color: 'text-amber-400' },
              { sign: 'Virgo (कन्या)', body: 'Waist, Intestines', num: 6, color: 'text-emerald-300' },
              { sign: 'Libra (तुला)', body: 'Lower Abdomen', num: 7, color: 'text-pink-300' },
              { sign: 'Scorpio (वृश्चिक)', body: 'Genitals', num: 8, color: 'text-red-300' },
              { sign: 'Sagittarius (धनु)', body: 'Thighs', num: 9, color: 'text-amber-300' },
              { sign: 'Capricorn (मकर)', body: 'Knees', num: 10, color: 'text-slate-300' },
              { sign: 'Aquarius (कुम्भ)', body: 'Calves, Shins', num: 11, color: 'text-indigo-300' },
              { sign: 'Pisces (मीन)', body: 'Feet', num: 12, color: 'text-violet-300' },
            ].map(s => (
              <div key={s.num} className="p-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/5">
                <span className={`font-bold ${s.color}`}>{s.num}. {s.sign}</span>
                <div className="text-text-tertiary mt-0.5">{s.body}</div>
              </div>
            ))}
          </div>
          <p className="text-text-tertiary text-xs mt-2">The body flows from head (Aries) to feet (Pisces) — initiative to dissolution, action to surrender.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          BPHS Ch.4 opens: <em>"O Brahmin, now I tell you about the nature of the Rashis."</em> Parashara describes each sign's physical form (Ram, Bull, Twins...), the direction it faces, the terrain it inhabits (forest, water, market, etc.), its caste (Brahmana, Kshatriya, Vaishya, Shudra), and its gender. These aren't arbitrary — each detail encodes the sign's fundamental energy pattern. A "forest-dwelling" sign (Aries, Leo) has different energy from a "water-dwelling" sign (Cancer, Pisces).
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Parashara's Sign Descriptions — Complete Table</h3>
        <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-1.5 text-gold-dark">#</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Sign</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Form</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Lord</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Gender</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Nature</th>
              <th className="text-left py-2 px-1.5 text-gold-dark">Habitat</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { n: 1, sign: 'Aries / मेष', form: 'Ram', lord: 'Mars', gender: 'M', nature: 'Movable/Fire', hab: 'Forest, hills' },
                { n: 2, sign: 'Taurus / वृषभ', form: 'Bull', lord: 'Venus', gender: 'F', nature: 'Fixed/Earth', hab: 'Agricultural land' },
                { n: 3, sign: 'Gemini / मिथुन', form: 'Couple', lord: 'Mercury', gender: 'M', nature: 'Dual/Air', hab: 'Bedroom, garden' },
                { n: 4, sign: 'Cancer / कर्क', form: 'Crab', lord: 'Moon', gender: 'F', nature: 'Movable/Water', hab: 'Water, rivers' },
                { n: 5, sign: 'Leo / सिंह', form: 'Lion', lord: 'Sun', gender: 'M', nature: 'Fixed/Fire', hab: 'Forest, cave' },
                { n: 6, sign: 'Virgo / कन्या', form: 'Maiden+boat', lord: 'Mercury', gender: 'F', nature: 'Dual/Earth', hab: 'Market, office' },
                { n: 7, sign: 'Libra / तुला', form: 'Man+scales', lord: 'Venus', gender: 'M', nature: 'Movable/Air', hab: 'Market, trade' },
                { n: 8, sign: 'Scorpio / वृश्चिक', form: 'Scorpion', lord: 'Mars', gender: 'F', nature: 'Fixed/Water', hab: 'Holes, caves' },
                { n: 9, sign: 'Sagittarius / धनु', form: 'Centaur+bow', lord: 'Jupiter', gender: 'M', nature: 'Dual/Fire', hab: 'War field, stable' },
                { n: 10, sign: 'Capricorn / मकर', form: 'Crocodile', lord: 'Saturn', gender: 'F', nature: 'Movable/Earth', hab: 'Water+forest' },
                { n: 11, sign: 'Aquarius / कुम्भ', form: 'Man+pot', lord: 'Saturn', gender: 'M', nature: 'Fixed/Air', hab: 'Potter\'s workshop' },
                { n: 12, sign: 'Pisces / मीन', form: 'Two fish', lord: 'Jupiter', gender: 'F', nature: 'Dual/Water', hab: 'Ocean, temple' },
              ].map(r => (
                <tr key={r.n} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-1.5 text-text-tertiary">{r.n}</td>
                  <td className="py-1.5 px-1.5 text-gold-light font-medium">{r.sign}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.form}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.lord}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.gender}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.nature}</td>
                  <td className="py-1.5 px-1.5 text-text-secondary">{r.hab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">Misconception:</span> "The sign descriptions are just poetic metaphors with no practical use."<br />
          <span className="text-emerald-300">Reality:</span> Each attribute has practical application. Prashna (horary) astrology uses sign habitats to determine WHERE lost objects might be found — an object lost during a Cancer Lagna may be near water. Medical astrology uses the body mapping for health predictions.</p>
          <p><span className="text-red-300 font-bold">Misconception:</span> "Aquarius is a water sign because it's the 'water bearer'."<br />
          <span className="text-emerald-300">Reality:</span> Aquarius is an AIR sign. The water bearer (man pouring water from a pot) represents the distribution of knowledge, not the water element itself. The water signs are Cancer, Scorpio, and Pisces — all depicted as water creatures.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-blue-300 font-bold">Fully used.</span> Sign descriptions from BPHS are used in every chart interpretation. The Kalapurusha body mapping is the basis of medical astrology. Sign habitats are used in Prashna. The form descriptions (biped/quadruped/insect/water) affect how signs express — a human-form sign (Gemini, Virgo, Libra) produces more intellectual expression than an animal-form sign (Aries, Taurus, Leo).
        </p>
      </section>
    </div>
  );
}

export default function Module3_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />]} questions={QUESTIONS} />;
}

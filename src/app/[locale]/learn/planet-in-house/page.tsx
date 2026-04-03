'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Star } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

/* ── Planet & House Data ──────────────────────────────────────────── */
const PLANETS = [
  { id: 0, name: 'Sun',     sa: 'सूर्य',    color: '#e67e22' },
  { id: 1, name: 'Moon',    sa: 'चन्द्र',   color: '#ecf0f1' },
  { id: 2, name: 'Mars',    sa: 'मङ्गल',    color: '#e74c3c' },
  { id: 3, name: 'Mercury', sa: 'बुध',      color: '#2ecc71' },
  { id: 4, name: 'Jupiter', sa: 'गुरु',     color: '#f39c12' },
  { id: 5, name: 'Venus',   sa: 'शुक्र',    color: '#e8e6e3' },
  { id: 6, name: 'Saturn',  sa: 'शनि',     color: '#3498db' },
  { id: 7, name: 'Rahu',    sa: 'राहु',     color: '#8e44ad' },
  { id: 8, name: 'Ketu',    sa: 'केतु',     color: '#95a5a6' },
];

const HOUSES = [
  { num: 1,  sign: 'Self',        sa: 'तनु' },
  { num: 2,  sign: 'Wealth',      sa: 'धन' },
  { num: 3,  sign: 'Courage',     sa: 'सहज' },
  { num: 4,  sign: 'Home',        sa: 'सुख' },
  { num: 5,  sign: 'Children',    sa: 'पुत्र' },
  { num: 6,  sign: 'Enemies',     sa: 'रिपु' },
  { num: 7,  sign: 'Spouse',      sa: 'कलत्र' },
  { num: 8,  sign: 'Longevity',   sa: 'आयु' },
  { num: 9,  sign: 'Fortune',     sa: 'धर्म' },
  { num: 10, sign: 'Career',      sa: 'कर्म' },
  { num: 11, sign: 'Gains',       sa: 'लाभ' },
  { num: 12, sign: 'Liberation',  sa: 'व्यय' },
];

/* ── 108 Interpretations ─────────────────────────────────────────── */
const DATA: Record<string, string> = {
  // Sun (0) in Houses 1-12
  '0-1': 'Strong personality, leadership, self-confidence. May be dominating. Government or authority career suits well.',
  '0-2': 'Wealth through authority or government. Strong family pride, sometimes harsh speech. Good earning capacity.',
  '0-3': 'Courageous and bold. Good relations with younger siblings. Success through communication and self-effort.',
  '0-4': 'Strained domestic peace, ego clashes with parents. May own property but emotional dissatisfaction at home.',
  '0-5': 'Intelligent, creative, leadership in education. Few children or difficulty with firstborn. Good for politics and speculation.',
  '0-6': 'Victory over enemies, strong constitution. Good for government medical or legal service. Can defeat competitors.',
  '0-7': 'Dominating spouse or late marriage. Partner may be proud and independent. Business partnerships need care.',
  '0-8': 'Interest in occult, inheritance possible. Health issues related to bones or heart. Transformative life events.',
  '0-9': 'Strained relations with father or guru. Independent spiritual path. Luck comes through authority positions.',
  '0-10': 'Powerful career position, fame and recognition. Natural leader. Government or administrative roles. Father influential.',
  '0-11': 'High income, influential social circle. Gains through government or authority figures. Wishes fulfilled easily.',
  '0-12': 'Expenses on government matters or hospitals. Weak eyesight possible. Spiritual inclination, foreign settlement.',

  // Moon (1) in Houses 1-12
  '1-1': 'Emotional, caring personality with fluctuating mind. Attractive appearance. Public-facing career suits well.',
  '1-2': 'Wealth fluctuates like tides. Sweet speech, love for food and family. Income through public or liquid assets.',
  '1-3': 'Emotionally close to siblings. Creative communication skills. Short travels bring mental peace.',
  '1-4': 'Very attached to mother and home. Owns property and vehicles. Emotional contentment, especially after mid-life.',
  '1-5': 'Emotional intelligence, creative mind. Devoted to children. Success in arts, entertainment, or education.',
  '1-6': 'Emotional disturbances from enemies or illness. Digestive issues. Service-oriented career heals the mind.',
  '1-7': 'Spouse is nurturing and emotional. Marriage brings emotional fulfillment. May be influenced by mother figure.',
  '1-8': 'Emotional turbulence, anxiety prone. Interest in psychology and occult. Inheritance from mother possible.',
  '1-9': 'Deeply spiritual, devotional nature. Mother is dharmic. Luck through travel, especially overseas.',
  '1-10': 'Public fame, career in caring professions. Fluctuating career path. Popularity with masses, good for politics.',
  '1-11': 'Large social circle, many female friends. Gains through public dealings. Emotional fulfillment through community.',
  '1-12': 'Vivid dreams, spiritual visions. Expenses on comfort. Foreign residence likely. Hidden emotional world.',

  // Mars (2) in Houses 1-12
  '2-1': 'Manglik dosha. Aggressive, athletic, courageous personality. Scar on head or face likely. Natural fighter and leader.',
  '2-2': 'Harsh speech, family conflicts. Wealth through engineering, military, or surgery. Eats hot and spicy food.',
  '2-3': 'Extremely courageous. Dominates siblings. Success in sports, military, writing. Bold communicator.',
  '2-4': 'Property disputes, domestic unrest. Strong real estate holdings but emotional turbulence. Powerful vehicles.',
  '2-5': 'Sharp intellect but argumentative children. Success in competitive exams and sports. Speculative risks.',
  '2-6': 'Excellent placement — destroys enemies, wins competitions. Strong health, success in surgery, military, or law.',
  '2-7': 'Manglik dosha — passionate but argumentative marriage. Spouse is energetic. Business partnerships are combative.',
  '2-8': 'Accident-prone, surgery likely. Interest in tantra and occult. Sudden inheritance. Chronic health issues.',
  '2-9': 'Fights for dharma, aggressive in beliefs. Conflict with father or guru. Travel to war zones or adventurous places.',
  '2-10': 'Powerful career in engineering, military, police, surgery. Action-oriented professional. Quick rise through boldness.',
  '2-11': 'High income through technical skills. Ambitious friend circle. Gains through property and competition.',
  '2-12': 'Hospitalization, expenses on surgery. Secret enemies. Foreign travel for work. Suppressed anger leads to issues.',

  // Mercury (3) in Houses 1-12
  '3-1': 'Witty, youthful, communicative personality. Business acumen. Looks younger than age. Good writer or speaker.',
  '3-2': 'Wealth through intellect, trade, or writing. Sweet and clever speech. Family of educated people.',
  '3-3': 'Excellent placement — brilliant communicator. Success in media, writing, marketing. Strong bond with siblings.',
  '3-4': 'Intellectual home environment. Real estate through clever deals. Multiple residences or frequent home changes.',
  '3-5': 'Sharp intellect, good at mathematics and analysis. Talented children. Success in education, writing, and speculation.',
  '3-6': 'Solves problems analytically. Health issues from stress. Good for accounting, law, or medical diagnosis.',
  '3-7': 'Spouse is intelligent and communicative. Business partnerships thrive. Trade and commerce in marriage life.',
  '3-8': 'Research mind, interest in mysteries. Nervous disorders possible. Good for astrology, detective work, insurance.',
  '3-9': 'Scholar, love of learning and travel. Multiple degrees. Teaching and publishing bring luck. Rational spirituality.',
  '3-10': 'Career in communication, IT, accounting, or trade. Versatile professional. Known for intelligence at work.',
  '3-11': 'Gains through networking, intellect, and trade. Tech-savvy friends. Multiple income sources through cleverness.',
  '3-12': 'Overthinking leads to anxiety. Expenses on education. Writing in seclusion. Interest in foreign languages.',

  // Jupiter (4) in Houses 1-12
  '4-1': 'Wise, optimistic, generous personality. Good health and reputation. Natural teacher and counselor. Stout body.',
  '4-2': 'Wealth accumulates steadily. Eloquent and truthful speech. Strong, dharmic family. Excellent for finance.',
  '4-3': 'Wise communication, philosophical siblings. Success in teaching, publishing, or advisory roles.',
  '4-4': 'Very auspicious — happy home, devoted mother, property wealth. Inner peace and emotional stability.',
  '4-5': 'Best placement (Putra Karaka in Putra Bhava). Brilliant children, spiritual wisdom, success in education and mantras.',
  '4-6': 'Defeats enemies through wisdom. Health generally good but watch weight. Service through teaching or law.',
  '4-7': 'Wise, dharmic spouse. Happy marriage, respected partner. Success in partnerships and counseling.',
  '4-8': 'Long life, interest in metaphysics. Inheritance and sudden gains. Deep occult knowledge. Smooth transformations.',
  '4-9': 'Most auspicious placement. Great fortune, spiritual guru, pilgrimage. Father is wise. Success in dharma and law.',
  '4-10': 'Highly respected career, position of authority. Teaching, law, finance, or priesthood. Fame through wisdom.',
  '4-11': 'Massive gains, wealthy social circle. Wishes fulfilled through divine grace. Generous and philanthropic.',
  '4-12': 'Spiritual liberation, Moksha karaka in Moksha house. Expenses on charity. Foreign residence. Quiet wisdom.',

  // Venus (5) in Houses 1-12
  '5-1': 'Attractive, charming, artistic personality. Love of luxury and beauty. Diplomatic nature. Magnetic presence.',
  '5-2': 'Wealth through arts, beauty, or luxury goods. Sweet and poetic speech. Beautiful family life. Gourmet tastes.',
  '5-3': 'Artistic communication, media success. Loving siblings. Short travels for pleasure. Creative writing talent.',
  '5-4': 'Beautiful home, luxury vehicles, loving mother. Property accumulation. Domestic harmony and aesthetic surroundings.',
  '5-5': 'Romantic, creative, talented children. Success in entertainment, arts, fashion. Love affairs and speculative gains.',
  '5-6': 'Conflict in love life, health issues from overindulgence. Can succeed in beauty, hospitality, or healthcare.',
  '5-7': 'Beautiful, artistic spouse. Happy marriage with luxury. Success in fashion, beauty, or diplomatic partnerships.',
  '5-8': 'Hidden love affairs, sudden windfalls. Interest in tantric arts. Spouse may bring inheritance. Sensual secrets.',
  '5-9': 'Love for philosophy, art, and culture. Foreign travel for pleasure. Guru may be female. Dharmic artist.',
  '5-10': 'Career in arts, entertainment, fashion, or diplomacy. Well-liked at work. Success through charm and aesthetics.',
  '5-11': 'Gains through arts, women, or luxury trade. Large social circle of artists. Wishes fulfilled through relationships.',
  '5-12': 'Expenses on luxury, foreign pleasures. Bed pleasures prominent. Secret romances. Spiritual through devotion.',

  // Saturn (6) in Houses 1-12
  '6-1': 'Serious, disciplined, lean personality. Health issues in youth but strong after 30. Hard worker with stoic nature.',
  '6-2': 'Slow wealth accumulation, harsh or measured speech. Family responsibilities heavy. Gains after persistent effort.',
  '6-3': 'Disciplined communication. Younger siblings face hardships. Courageous after delays. Success in technical writing.',
  '6-4': 'Difficult childhood, burdens from property or mother. Domestic unhappiness early. Stability comes after 36.',
  '6-5': 'Delayed children, pessimistic thinking. Strict with education. Success in traditional or structured learning fields.',
  '6-6': 'Excellent placement — crushes enemies and disease through endurance. Long-lived. Success in labor, law, or service.',
  '6-7': 'Delayed marriage, older or serious spouse. Marriage improves with time. Business partnerships require patience.',
  '6-8': 'Long life but chronic ailments. Deep karmic debts. Interest in death and rebirth topics. Inheritance delayed.',
  '6-9': 'Strained luck, irreligious or unconventional dharma. Father faces hardships. Late-blooming fortune after 36.',
  '6-10': 'Career success through discipline and hard work. Slow but steady rise. Authority position after mid-life.',
  '6-11': 'Consistent gains over time. Older or fewer friends. Large income through persistent effort and organization.',
  '6-12': 'Expenses from chronic issues, possible imprisonment or isolation. Foreign residence through necessity. Spiritual detachment.',

  // Rahu (7) in Houses 1-12
  '7-1': 'Unconventional personality, magnetic and mysterious. Foreign connections strong. Obsessive self-image. Smoky appearance.',
  '7-2': 'Wealth through foreign or unconventional sources. Speech may be deceptive. Family has unusual dynamics.',
  '7-3': 'Bold and fearless communication. Success in media, technology, or foreign trade. Unusual siblings.',
  '7-4': 'Unusual home life, foreign property. Mother has unique qualities. Restlessness at home. Haunting dreams.',
  '7-5': 'Obsessive creativity, unusual children. Success in technology, film, or speculation. Unorthodox intelligence.',
  '7-6': 'Powerful over enemies, immune to poison and snakes (traditional). Success in foreign healthcare or technology.',
  '7-7': 'Spouse from different culture or background. Passionate but unstable marriage. Unconventional partnerships.',
  '7-8': 'Deep interest in occult and taboo subjects. Sudden transformations. Research into hidden knowledge. Long life.',
  '7-9': 'Unconventional spirituality, foreign guru. Pilgrimage to foreign lands. Father has unusual life path.',
  '7-10': 'Career in technology, foreign companies, or politics. Sudden rise to fame. Unconventional professional path.',
  '7-11': 'Large gains through foreign connections or technology. Vast network of unusual friends. Ambitious desires.',
  '7-12': 'Foreign settlement likely. Vivid dreams, psychic experiences. Expenses on foreign travel. Moksha through detachment.',

  // Ketu (8) in Houses 1-12
  '8-1': 'Spiritual, detached personality. Mysterious aura. Health issues in head area. Past-life wisdom. Ascetic tendencies.',
  '8-2': 'Detached from family and wealth. Speech is cryptic or spiritual. Unexpected financial fluctuations.',
  '8-3': 'Courageous in unusual ways. Siblings are spiritually inclined. Communication is intuitive rather than logical.',
  '8-4': 'Detachment from homeland, mother, or material comforts. Spiritual peace through renunciation. Unusual property.',
  '8-5': 'Past-life merit, spiritual intelligence. Difficulty with children or unconventional offspring. Mantra siddhi.',
  '8-6': 'Excellent for spiritual healing. Defeats enemies mysteriously. Immune to black magic. Service through detachment.',
  '8-7': 'Spouse is spiritual or unusual. Detachment in marriage. Past-life karmic relationships dominate partnerships.',
  '8-8': 'Powerful placement for occult mastery. Sudden spiritual awakening. Interest in death and liberation. Long life.',
  '8-9': 'Deeply spiritual, may renounce organized religion. Father is spiritual. Past-life dharmic merit manifests.',
  '8-10': 'Unconventional career, detachment from status. Success in spiritual, healing, or research professions.',
  '8-11': 'Gains are unpredictable. Spiritual friend circle. Desires are for liberation, not material. Sudden windfalls.',
  '8-12': 'Ultimate Moksha placement. Deep meditation ability. Foreign spiritual journeys. Complete material detachment.',
};

/* ── House Classification ────────────────────────────────────────── */
const CLASSIFICATIONS = [
  { name: 'Kendra', houses: [1, 4, 7, 10], color: '#d4a853', desc: 'Pillars of life. Benefic planets here give a strong foundation.' },
  { name: 'Trikona', houses: [1, 5, 9], color: '#2ecc71', desc: 'Fortune triangle. Most auspicious placements for any planet.' },
  { name: 'Dusthana', houses: [6, 8, 12], color: '#e74c3c', desc: 'Challenge houses. Malefics can thrive here (Viparita Raja Yoga).' },
  { name: 'Upachaya', houses: [3, 6, 10, 11], color: '#3498db', desc: 'Growth houses. Malefics improve with age in these houses.' },
  { name: 'Maraka', houses: [2, 7], color: '#e67e22', desc: 'Can indicate health crises during that planet\'s dasha period.' },
];

/* ── Component ───────────────────────────────────────────────────── */
export default function PlanetInHousePage() {
  const locale = useLocale() as 'en' | 'hi' | 'sa';
  const [selPlanet, setSelPlanet] = useState<number | null>(null);
  const [selHouse, setSelHouse] = useState<number | null>(null);

  const key = selPlanet !== null && selHouse !== null ? `${selPlanet}-${selHouse}` : null;
  const interp = key ? DATA[key] : null;
  const planet = selPlanet !== null ? PLANETS[selPlanet] : null;
  const house = selHouse !== null ? HOUSES[selHouse - 1] : null;

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#d4a853]/60">
          <Link href="/learn" className="hover:text-[#d4a853]">Learn</Link>
          <span>/</span>
          <span className="text-[#d4a853]">Planet in House</span>
        </nav>

        <h1 className="mb-2 text-4xl font-bold text-[#d4a853]">
          Planet in House
          <span className="ml-3 text-xl text-[#d4a853]/50">ग्रह-भाव फल</span>
        </h1>
        <p className="mb-10 max-w-2xl text-base text-gray-400">
          The foundation of chart interpretation. Select a planet and a house to see its effect.
          Each of the 108 combinations reveals how a graha colors the affairs of a bhava.
        </p>

        {/* Planet Selector */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Select Planet</h2>
          <div className="flex flex-wrap gap-2">
            {PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelPlanet(p.id)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all
                  ${selPlanet === p.id
                    ? 'border-transparent shadow-lg scale-105'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                style={selPlanet === p.id ? {
                  backgroundColor: p.color + '22',
                  borderColor: p.color,
                  color: p.color,
                  boxShadow: `0 0 20px ${p.color}33`,
                } : undefined}
              >
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
                <span className="text-xs opacity-50">{p.sa}</span>
              </button>
            ))}
          </div>
        </div>

        {/* House Selector */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Select House</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {HOUSES.map(h => {
              const isSelected = selHouse === h.num;
              // Determine classification color
              const cls = CLASSIFICATIONS.find(c => c.houses.includes(h.num));
              const clsColor = cls?.color ?? '#ffffff';
              return (
                <button
                  key={h.num}
                  onClick={() => setSelHouse(h.num)}
                  className={`rounded-lg border px-3 py-2.5 text-left transition-all
                    ${isSelected
                      ? 'border-[#d4a853] bg-[#d4a853]/15 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`text-lg font-bold ${isSelected ? 'text-[#d4a853]' : 'text-white/80'}`}>
                      H{h.num}
                    </span>
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: clsColor }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{h.sign}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {interp && planet && house ? (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' as const }}
              className="mb-12 overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              {/* Color strip */}
              <div className="h-1.5" style={{ backgroundColor: planet.color }} />
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold"
                    style={{ backgroundColor: planet.color + '22', color: planet.color }}
                  >
                    {planet.name[0]}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {planet.name} in House {house.num}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {planet.sa} — {house.sign} ({house.sa})
                    </span>
                  </div>
                  <span className="ml-auto rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-gray-400">
                    H{house.num}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-gray-300">{interp}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12 flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center text-gray-600"
            >
              <div>
                <Star className="mx-auto mb-3 h-8 w-8 opacity-30" />
                <p>Select a planet and a house above to see the interpretation</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* House Classification Diagram */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-[#d4a853]">
            House Classifications
            <span className="ml-2 text-sm font-normal text-[#d4a853]/40">भाव वर्गीकरण</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CLASSIFICATIONS.map(cls => (
              <div
                key={cls.name}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: cls.color }}
                  />
                  <h3 className="text-sm font-bold" style={{ color: cls.color }}>{cls.name}</h3>
                  <div className="ml-auto flex gap-1">
                    {cls.houses.map(h => (
                      <span
                        key={h}
                        className="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold"
                        style={{ backgroundColor: cls.color + '22', color: cls.color }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-gray-400">{cls.desc}</p>
              </div>
            ))}
          </div>

          {/* Visual house wheel */}
          <div className="mt-8 flex justify-center">
            <svg viewBox="0 0 320 320" className="h-64 w-64 sm:h-80 sm:w-80">
              {HOUSES.map((h, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const cx = 160 + 120 * Math.cos(angle);
                const cy = 160 + 120 * Math.sin(angle);
                // Get primary classification color
                const cls = CLASSIFICATIONS.find(c => c.houses.includes(h.num));
                const col = cls?.color ?? '#444';
                const isActive = selHouse === h.num;
                return (
                  <g key={h.num} onClick={() => setSelHouse(h.num)} className="cursor-pointer">
                    <circle
                      cx={cx} cy={cy} r={isActive ? 22 : 18}
                      fill={isActive ? col + '44' : col + '18'}
                      stroke={col}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text
                      x={cx} y={cy + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-bold"
                      fill={isActive ? '#fff' : col}
                    >
                      {h.num}
                    </text>
                  </g>
                );
              })}
              {/* Center label */}
              <text x="160" y="155" textAnchor="middle" fill="#d4a853" className="text-xs font-medium opacity-60">
                Bhava
              </text>
              <text x="160" y="172" textAnchor="middle" fill="#d4a853" className="text-[10px] opacity-40">
                Chakra
              </text>
            </svg>
          </div>
        </section>
      </div>
    </main>
  );
}

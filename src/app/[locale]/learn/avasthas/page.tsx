'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Eye, Flame, Heart, Activity, RefreshCw } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/avasthas.json';

// ─── Planet Implications per State ───────────────────────────────────────────
// keyed by stateKey (set on each state object above)
const PLANET_IMPLICATIONS: Record<string, { planet: string; symbol: string; en: string }[]> = {
  yuva: [
    { planet: 'Sun', symbol: '☀️', en: 'Confidence, career recognition, leadership roles, father supportive — at full force' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional clarity, public success, strong intuition, close and happy bond with mother' },
    { planet: 'Mars', symbol: '♂', en: 'Athletic ability, fearlessness, property gains, competitions won, sibling bonds strong' },
    { planet: 'Mercury', symbol: '☿', en: 'Sharp intellect, eloquent communication, business acumen, quick learner, youthful energy' },
    { planet: 'Jupiter', symbol: '♃', en: 'Wealth flows, children blessed, wise teachers appear, spiritual and financial growth together' },
    { planet: 'Venus', symbol: '♀', en: 'Love returned freely, marriage prospects excellent, artistic gifts shine, financial comfort' },
    { planet: 'Saturn', symbol: '♄', en: 'Hard work rewarded, long-term projects succeed, discipline pays, justice rules in their favour' },
  ],
  mrita: [
    { planet: 'Sun', symbol: '☀️', en: 'Career stagnation, authority always contested, confidence hollow, father absent or harmful' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional numbness or anxiety, disturbed sleep, poor mental health, maternal bond strained' },
    { planet: 'Mars', symbol: '♂', en: 'Drive absent, accidents from recklessness, property disputes, anger misdirected inward' },
    { planet: 'Mercury', symbol: '☿', en: 'Learning difficulties, chronic miscommunication, nervous system issues, business failures' },
    { planet: 'Jupiter', symbol: '♃', en: 'Wealth blocked despite effort, children troubled, lack of mentors, poor judgment in key decisions' },
    { planet: 'Venus', symbol: '♀', en: 'Love withheld, delayed or unhappy marriage, financial holes, body image issues, arts blocked' },
    { planet: 'Saturn', symbol: '♄', en: 'Unrelenting delays, poverty tendency, chronic health drain (bones/joints), heavy karmic load' },
  ],
  jagrat: [
    { planet: 'Sun', symbol: '☀️', en: 'Radiant confidence, clear career arc, natural authority, paternal blessings active (Leo/Aries)' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional stability, public popularity, excellent memory, deep connection with mother (Cancer/Taurus)' },
    { planet: 'Mars', symbol: '♂', en: 'Full physical vitality, courageous decisions, property gains, healthy competition (Aries/Scorpio/Capricorn)' },
    { planet: 'Mercury', symbol: '☿', en: 'Analytical brilliance, public speaking confidence, writing talent, successful business (Gemini/Virgo)' },
    { planet: 'Jupiter', symbol: '♃', en: 'Abundance in all areas — wealth, children, wisdom, optimism, spirituality (Sagittarius/Pisces/Cancer)' },
    { planet: 'Venus', symbol: '♀', en: 'Loving relationships, harmonious marriage, aesthetic refinement, financial comfort (Taurus/Libra/Pisces)' },
    { planet: 'Saturn', symbol: '♄', en: 'Systematic success, karmic debts repaid gracefully, discipline rewarded, community respect (Capricorn/Aquarius/Libra)' },
  ],
  swapna: [
    { planet: 'Sun', symbol: '☀️', en: 'Some confidence, career moves forward but slowly, father helpful but not fully present' },
    { planet: 'Moon', symbol: '🌙', en: 'Moderate emotional ease, some public recognition, decent relationship with mother' },
    { planet: 'Mars', symbol: '♂', en: 'Adequate energy, minor property gains, some competitive success, mild sibling friction' },
    { planet: 'Mercury', symbol: '☿', en: 'Decent intellect, communicates well enough, business average, learning comes with effort' },
    { planet: 'Jupiter', symbol: '♃', en: 'Some financial growth, children present, teachers available but not inspiring — comfortable mediocrity' },
    { planet: 'Venus', symbol: '♀', en: 'Relationships pleasant but not deeply fulfilling, marriage workable, finances adequate' },
    { planet: 'Saturn', symbol: '♄', en: 'Work steadily progresses, delays are manageable, discipline there but tested often' },
  ],
  sushupti: [
    { planet: 'Sun', symbol: '☀️', en: 'Identity suppressed, career ceilings hit repeatedly, authority conflicts, father-figure distant or damaging' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional turmoil, anxiety disorders, disturbed sleep, psychic overwhelm, mother-estrangement' },
    { planet: 'Mars', symbol: '♂', en: 'Aggression bottled then explosive, accident-prone, property losses, competitive defeats, sibling tension' },
    { planet: 'Mercury', symbol: '☿', en: 'Nervous chatter, chronic miscommunication, difficulty focusing, anxiety, misread in business' },
    { planet: 'Jupiter', symbol: '♃', en: 'Financial scarcity despite effort, progeny delayed or troubled, no trustworthy mentors, poor judgment' },
    { planet: 'Venus', symbol: '♀', en: 'Unfulfilling relationships, delayed or broken marriage, body dissatisfaction, financial instability' },
    { planet: 'Saturn', symbol: '♄', en: 'Burdens feel unrelenting, chronic delays in everything, isolation, structural problems and health issues' },
  ],
  deepta: [
    { planet: 'Sun', symbol: '☀️', en: 'Peak career, political or social fame, father celebrated, confidence effortless (exalted in Aries)' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional fulfilment, psychic gifts bloom, public adulation, motherhood blessed (exalted in Taurus)' },
    { planet: 'Mars', symbol: '♂', en: 'Maximum physical power, decisive victories in competition, property wealth (exalted in Capricorn)' },
    { planet: 'Mercury', symbol: '☿', en: 'Genius-level intelligence, authoritative voice in field, trading mastery (exalted in Virgo)' },
    { planet: 'Jupiter', symbol: '♃', en: 'The most fortunate Jupiter possible — wealth, wisdom, children, spirituality all at their best (exalted in Cancer)' },
    { planet: 'Venus', symbol: '♀', en: 'Deep love, a beautiful and lasting marriage, artistic renown, luxury without guilt (exalted in Pisces)' },
    { planet: 'Saturn', symbol: '♄', en: 'Slow but monumental success, legendary discipline, an enduring legacy (exalted in Libra)' },
  ],
  khala: [
    { planet: 'Sun', symbol: '☀️', en: 'Chronic low confidence, authority always questioned, career setbacks feel personal, ego wounds deep' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional volatility at its worst, possible mood disorders, mother as source of pain rather than comfort' },
    { planet: 'Mars', symbol: '♂', en: 'Violence-prone or accident-prone, property forever disputed, physical energy wasted on wrong battles' },
    { planet: 'Mercury', symbol: '☿', en: 'Anxiety pervades thinking, restless unfocused mind, communication always misread or misused' },
    { planet: 'Jupiter', symbol: '♃', en: 'Poverty despite effort, no lasting wisdom gained, children bring sorrow rather than joy' },
    { planet: 'Venus', symbol: '♀', en: 'Repeated heartbreak, broken or impossible marriages, financial holes, beauty feels mocking' },
    { planet: 'Saturn', symbol: '♄', en: 'The heaviest karma — poverty, illness, isolation — unless Neecha Bhanga cancellation applies' },
  ],
  shakta: [
    { planet: 'Sun', symbol: '☀️', en: 'Leadership arrives but via unconventional routes; past-life authority karma surfaces for reckoning' },
    { planet: 'Moon', symbol: '🌙', en: 'Deep emotional processing, vivid imagination, strong past-life emotional patterns resurface to heal' },
    { planet: 'Mars', symbol: '♂', en: 'Energy initially redirected inward; then bursts explosively outward; old conflicts revisited and resolved' },
    { planet: 'Mercury', symbol: '☿', en: 'Inner dialogue intense; writing and research excellent; speaking less reliable than in forward motion' },
    { planet: 'Jupiter', symbol: '♃', en: 'Wisdom deeply internalized before shared; generous eventually; questions conventional religious authority' },
    { planet: 'Venus', symbol: '♀', en: 'Old love returns or old values resurface; beauty appreciated inwardly before expressed; reassesses relationships' },
    { planet: 'Saturn', symbol: '♄', en: 'Karmic intensity amplified; past-life obligations surface; discipline turns inward before outer results come' },
  ],
  vikala: [
    { planet: 'Moon', symbol: '🌙', en: 'Emotional sensitivity overwhelmed by solar glare; confidence in feelings eclipsed; mother-sun conflict theme' },
    { planet: 'Mars', symbol: '♂', en: 'Drive and courage absorbed into solar ego; assertiveness confused with arrogance; accidents from hubris' },
    { planet: 'Mercury', symbol: '☿', en: 'Intelligence serves ego rather than truth; communication bent to impress rather than inform' },
    { planet: 'Jupiter', symbol: '♃', en: 'Wisdom overtaken by pride; teachings become self-serving; mentors eclipse students' },
    { planet: 'Venus', symbol: '♀', en: 'Love subordinated to status; relationships become performances; beauty used as power rather than gift' },
    { planet: 'Saturn', symbol: '♄', en: 'Discipline becomes authoritarianism; karma hidden behind authority; the ego won\'t accept Saturn\'s lessons' },
  ],
  shayana: [
    { planet: 'Sun', symbol: '☀️', en: 'Recognition comes slowly; leadership is quiet and backstage; career builds while waiting' },
    { planet: 'Moon', symbol: '🌙', en: 'Deeply contemplative emotional life; retreats restore; vivid dream life; introspection over expression' },
    { planet: 'Mars', symbol: '♂', en: 'Energy conserved; physical goals require patience; action happens in bursts after long preparation' },
    { planet: 'Mercury', symbol: '☿', en: 'Thoughts are rich but communication is slow; better at writing than speaking; latent intelligence not yet expressed' },
    { planet: 'Jupiter', symbol: '♃', en: 'Wisdom deep but not yet shared; spiritual seeking more than teaching; wealth accumulates quietly and slowly' },
    { planet: 'Venus', symbol: '♀', en: 'Love felt deeply but not shown; artistic inspiration private; relationships introverted and slow to bloom' },
    { planet: 'Saturn', symbol: '♄', en: 'Karma processed quietly; discipline applied inwardly; results appear only after extended periods of patient work' },
  ],
  gaman: [
    { planet: 'Sun', symbol: '☀️', en: 'Career actively advancing; travel for leadership; publicly visible momentum' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotionally fluid; frequent positive change of environments; travel oriented; popular in motion' },
    { planet: 'Mars', symbol: '♂', en: 'Physical activity at peak; athletic performance excellent; quick decisions yield results' },
    { planet: 'Mercury', symbol: '☿', en: 'Ideas flying; communication fast and effective; business deals moving; travels for trade' },
    { planet: 'Jupiter', symbol: '♃', en: 'Wisdom actively shared; teaching, guiding, traveling; wealth in motion and multiplying' },
    { planet: 'Venus', symbol: '♀', en: 'Love actively sought and found; social outings fruitful; artistic tours and performances; financial momentum' },
    { planet: 'Saturn', symbol: '♄', en: 'Work progressing steadily; movement within constraints; karma being actively and productively resolved' },
  ],
  lajjita: [
    { planet: 'Sun', symbol: '☀️', en: 'Father ashamed of child or vice versa; leadership tainted by embarrassing episodes; authority figures cause shame' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional sensitivity causes embarrassment; overly receptive in romantic contexts; maternal shame themes' },
    { planet: 'Mars', symbol: '♂', en: 'Courage blocked by social shame; physical expression constrained by embarrassment; sports achievement sabotaged' },
    { planet: 'Mercury', symbol: '☿', en: 'Intellectual expression embarrassed; says the wrong thing at the wrong moment; education disrupted by social judgment' },
    { planet: 'Jupiter', symbol: '♃', en: 'Guru or teacher humiliated; progeny bring embarrassment; religious advice given in shame; wealth hidden' },
    { planet: 'Venus', symbol: '♀', en: 'Love affairs cause social embarrassment; marriage ashamed by families; beauty mocked or hidden; arts suppressed' },
    { planet: 'Saturn', symbol: '♄', en: 'Hard work mocked; discipline causes isolation; karmic burdens are publicly visible sources of shame' },
  ],
  garvita: [
    { planet: 'Sun', symbol: '☀️', en: 'Confidence expressed boldly, sometimes to the point of arrogance; leadership demanded, not just assumed' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional pride; the person is proud of their sensitivity; maternal connections celebrated' },
    { planet: 'Mars', symbol: '♂', en: 'Physical courage celebrated; competitive wins bring pride; property achievements shown off' },
    { planet: 'Mercury', symbol: '☿', en: 'Intellectual pride; proud of their learning and communication; possible know-it-all tendency' },
    { planet: 'Jupiter', symbol: '♃', en: 'Proud of their wisdom and generosity; teacher energy strong; can become spiritually arrogant' },
    { planet: 'Venus', symbol: '♀', en: 'Proud of beauty, love, and refined taste; relationships celebrated; artistic achievements displayed' },
    { planet: 'Saturn', symbol: '♄', en: 'Proud of their discipline and endurance; hard-won karma celebrated; can be rigid in principles' },
  ],
  kshudhita: [
    { planet: 'Sun', symbol: '☀️', en: 'Perpetual hunger for recognition and authority; never feels acknowledged enough; career appetite insatiable' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional hunger; seeking comfort and nurturing that never fully satisfies; maternal love felt as insufficient' },
    { planet: 'Mars', symbol: '♂', en: 'Hunger for victory and property; competitive to the point of aggression; physical appetite excessive' },
    { planet: 'Mercury', symbol: '☿', en: 'Intellectual hunger; constantly seeking more information; mind never settled; communication compulsive' },
    { planet: 'Jupiter', symbol: '♃', en: 'Hunger for wealth and wisdom; never feels rich or learned enough; guru-seeking becomes obsessive' },
    { planet: 'Venus', symbol: '♀', en: 'Hunger for love and beauty; relationships feel incomplete; material desires multiply; financial insatiability' },
    { planet: 'Saturn', symbol: '♄', en: 'Hunger for security and structure; discipline never feels sufficient; karmic load always feels heavier than it is' },
  ],
  trushita: [
    { planet: 'Sun', symbol: '☀️', en: 'Recognition feels emotionally empty even when received; authority achieved but doesn\'t nourish' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional depletion; care given and received but the inner cup remains empty; thirst for emotional depth' },
    { planet: 'Mars', symbol: '♂', en: 'Physical victories feel hollow; courage depleted by emotional strain; action doesn\'t satisfy inner drive' },
    { planet: 'Mercury', symbol: '☿', en: 'Information consumed endlessly but wisdom elusive; communication lacks emotional depth or satisfaction' },
    { planet: 'Jupiter', symbol: '♃', en: 'Spiritual thirsting; rituals performed but peace absent; wealth obtained but inner poverty remains' },
    { planet: 'Venus', symbol: '♀', en: 'Love sought desperately but remains somehow just out of reach; beauty admired but never owned; financial thirst' },
    { planet: 'Saturn', symbol: '♄', en: 'Work done but never enough; discipline practiced but results don\'t quench the inner thirst; loneliness despite structure' },
  ],
  mudita_l: [
    { planet: 'Sun', symbol: '☀️', en: 'Confidence is joyful and unforced; career brings genuine delight; father-relationship warm and celebratory' },
    { planet: 'Moon', symbol: '🌙', en: 'Emotional joy; nurturing given and received gracefully; maternal bonds filled with happiness' },
    { planet: 'Mars', symbol: '♂', en: 'Physical vitality expressed with joy; competition is fun rather than anxious; victories celebrated freely' },
    { planet: 'Mercury', symbol: '☿', en: 'Joyful intellect; learning and teaching both pleasurable; communication light and effective' },
    { planet: 'Jupiter', symbol: '♃', en: 'Grace-filled abundance; wisdom shared joyfully; children and students bring delight' },
    { planet: 'Venus', symbol: '♀', en: 'Love expressed freely and received beautifully; marriage filled with delight; arts bring joy to others' },
    { planet: 'Saturn', symbol: '♄', en: 'Discipline becomes joyful routine; karmic work feels meaningful not burdensome; community brings happiness' },
  ],
  kshobhita: [
    { planet: 'Moon', symbol: '🌙', en: 'Emotional volatility severe; anxiety and mood swings; maternal relationships turbulent; mental agitation' },
    { planet: 'Mars', symbol: '♂', en: 'Aggression explosive and misdirected; accident-prone; volatile in conflict; physical agitation' },
    { planet: 'Mercury', symbol: '☿', en: 'Anxious racing mind; communication erratic and regretted; nervous system agitated; decisions impulsive' },
    { planet: 'Jupiter', symbol: '♃', en: 'Spiritual agitation; teachings contradicted; wealth unstable; children or students in crisis' },
    { planet: 'Venus', symbol: '♀', en: 'Relationship drama and instability; love affairs turbulent; financial volatility; beauty obsession' },
    { planet: 'Saturn', symbol: '♄', en: 'Structure collapses repeatedly; discipline undermined by anxiety; karma feels overwhelming and chaotic' },
  ],
};

// ─── How States Change ────────────────────────────────────────────────────────
const HOW_STATES_CHANGE = [
  {
    system: 'Baladi (Age)',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/8 border-amber-500/20',
    changes: [
      {
        heading: 'In the natal chart — fixed forever',
        text: 'A planet\'s Baladi state is set at birth by its exact degree within its sign. It never changes in the natal chart. A planet born at 27° of an odd sign is in Mrita (dead degree) for life.',
      },
      {
        heading: 'In transits — changes every 6°',
        text: 'As a transiting planet moves through a sign, its Baladi state shifts every 6°. In an odd sign: Bala (0–6°), Kumara (6–12°), Yuva (12–18°), Vriddha (18–24°), Mrita (24–30°). In an even sign the order reverses. When transiting Jupiter is in the Yuva zone (12–18° of an odd sign), that sign\'s house themes flourish maximally for you. When it passes through the Mrita zone, those same themes stagnate temporarily.',
      },
      {
        heading: 'Practical use',
        text: 'Watch transiting benefics (Jupiter, Venus) entering the Yuva zone of signs that rule your important houses. That 6° window is when their benefits peak. Similarly, when your dasha lord transits through its own Yuva zone, the dasha period activates most powerfully.',
      },
    ],
  },
  {
    system: 'Jagradadi (Wakefulness)',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/8 border-emerald-500/20',
    changes: [
      {
        heading: 'Sushupti is fixed in the natal chart',
        text: 'A planet in Sushupti is placed in an enemy or debilitation sign at birth and will remain there throughout life. There is no mechanism in the birth chart itself that automatically moves a planet from Sushupti to Swapna or Jagrat.',
      },
      {
        heading: 'Neecha Bhanga — the great exception',
        text: 'Debilitation cancellation (Neecha Bhanga) can functionally lift a Sushupti planet. Key rules: (1) The dispositor of the debilitation sign occupies a kendra (1st, 4th, 7th, 10th house) from the Lagna or Moon. (2) The exaltation lord of the debilitated planet is in a kendra. (3) The planet that would be debilitated in that sign is also in a kendra. A planet with Neecha Bhanga still carries Sushupti\'s struggle, but delivers results despite it — often dramatically after initial setbacks.',
      },
      {
        heading: 'Transits bring temporary wakefulness',
        text: 'When a natal Sushupti planet transits (moves in the sky) to its own sign or exaltation sign, it temporarily becomes Jagrat in that transit chart. Auspicious events governed by that planet often cluster during these transit windows. Example: natal Saturn in Aries (debilitated, Sushupti) becomes Jagrat when it transits Capricorn or Aquarius — career and discipline suddenly click into place during those years.',
      },
      {
        heading: 'Dasha support',
        text: 'During the dasha of a planet that is a powerful friend of the natal Sushupti planet, or that aspects it beneficially, the sleeping planet\'s results can be partially activated through borrowed strength.',
      },
      {
        heading: 'Remedies',
        text: 'Mantras, gemstones, fasting on the planet\'s day, and charitable acts specific to the planet do not change its Sushupti state, but they strengthen the planet\'s ability to deliver results from within that state — like coaching someone with a disadvantage rather than removing it.',
      },
    ],
  },
  {
    system: 'Deeptadi (Luminosity)',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/8 border-orange-500/20',
    changes: [
      {
        heading: 'Three states are temporary and transit-driven',
        text: 'Unlike most Deeptadi states (which are natal), three are fundamentally dynamic:',
      },
      {
        heading: 'Vikala (combust) — clears automatically',
        text: 'Vikala clears when the planet separates from the Sun beyond its combustion orb: Moon ±12°, Mars ±17°, Mercury ±14°, Jupiter ±11°, Venus ±10°, Saturn ±15°. In transit analysis, watch for when a combust planet crosses its combustion threshold — that is when its significations suddenly activate. A combust Mercury going stationary retrograde and separating from the Sun is a powerful "awakening" moment for intellect and communication.',
      },
      {
        heading: 'Shakta (retrograde) — clears at station direct',
        text: 'Shakta clears the moment a planet stations direct. This station-direct moment is consistently one of the most powerful timing triggers in Jyotish — results that were internally building and externally blocked suddenly manifest. Retrograde Jupiter going direct can unleash months of accumulated wisdom and financial opportunity within days. Note: retrograde energy is not "bad" — it is intense, internalized, and delayed.',
      },
      {
        heading: 'Bhita (planetary war) — clears in days',
        text: 'Two planets in Graha Yuddha are within 1° of each other. They separate within days or weeks as they move. The Bhita state is short-lived but intense while it lasts. In a natal chart, a planet that was within 1° of another at birth carries Bhita energy permanently.',
      },
      {
        heading: 'Khala and Deepta — natal, but Neecha Bhanga applies',
        text: 'Khala (debilitated) and Deepta (exalted) are natal states. Khala can be partially lifted by Neecha Bhanga (same rules as Jagradadi Sushupti above). In transit, a natal Khala planet becomes Deepta when it transits to its own exaltation sign.',
      },
    ],
  },
  {
    system: 'Lajjitadi (Emotional)',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/8 border-pink-500/20',
    changes: [
      {
        heading: 'The most transit-responsive system',
        text: 'Lajjitadi is unique: because it depends on which planets are aspecting or conjoining the natal planet, it shifts whenever transiting planets move into or out of those aspect relationships. Natal Lajjitadi is mostly fixed, but transit-activated Lajjitadi changes constantly.',
      },
      {
        heading: 'Lajjita → relief',
        text: 'If Jupiter transits to aspect or conjoin the lord of the 5th house, or aspects the Lajjita planet directly, the shame eases. A natal Lajjita planet with a benefic (Jupiter, Venus) also in the 5th house has built-in partial relief — the malefic shames but the benefic soothes.',
      },
      {
        heading: 'Kshudhita → Mudita',
        text: 'If Jupiter transits to aspect the natal Kshudhita planet, the hunger eases temporarily. In the natal chart, if Jupiter aspected an enemy-sign planet at birth, that planet carries partial Mudita within its Kshudhita — a mixed but workable state.',
      },
      {
        heading: 'Kshobhita → recovery',
        text: 'Two conditions must lift simultaneously: the combustion must end (planet separates from Sun) AND the malefic aspect must end (malefic transits away). When both clear, the planet often has a pronounced "recovery" phase — calm replaces agitation rapidly.',
      },
      {
        heading: 'Mudita — maintained by Jupiter\'s aspect',
        text: 'Mudita requires Jupiter to be actively aspecting. If transiting Jupiter moves away from the aspecting position, Mudita may revert to the planet\'s baseline natal state. This is why Jupiter transit years feel distinctly different — they activate Mudita across multiple natal planets simultaneously.',
      },
    ],
  },
  {
    system: 'Shayanadi (Activity)',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/8 border-cyan-500/20',
    changes: [
      {
        heading: 'The most dynamic system — changes by the degree',
        text: 'Shayanadi depends on divisional chart positions (Navamsha, Drekkana, etc.), which change as a planet moves through a sign. A planet moves through different activity states as it travels — each degree can place it in a different Navamsha, shifting its Shayanadi state.',
      },
      {
        heading: 'From Shayana to Gaman — the journey within a sign',
        text: 'Broadly, planets in the early and late degrees of a sign (near ingress and egress) tend toward Shayana (resting) or Upavesha (sitting) — inactive, dormant. As the planet moves toward the middle degrees, it passes through Netrapani (alert), Prakasha (illuminating), and Gaman (moving). This is why Jupiter at 14° of a sign is more active than Jupiter at 1° or 28°. The planet "wakes up" and "moves" through the sign.',
      },
      {
        heading: 'In the natal chart — fixed by divisional positions at birth',
        text: 'A natal planet\'s Shayanadi is fixed by which Navamsha or Drekkana it occupied at birth. Unlike Jagradadi, there is no "Neecha Bhanga equivalent" to lift a natal Shayana planet. However, since Shayanadi describes delivery speed rather than quality (a Shayana Jupiter still delivers wisdom — just quietly and slowly), it is considered less damaging than Sushupti or Mrita.',
      },
      {
        heading: 'Agaman (returning) — the retrograde echo',
        text: 'Agaman is often activated when a planet is approaching a sign it recently left, or when it is retrograde and "returning" to previously covered degrees. This state is associated with completing unfinished business — often second chances, delayed results finally arriving, or reworking past mistakes.',
      },
    ],
  },
];

// ─── Planet Implications Component ──────────────────────────────────────────
function PlanetImplicationsGrid({ stateKey }: { stateKey: string | null }) {
  const [open, setOpen] = useState(false);
  if (!stateKey || !PLANET_IMPLICATIONS[stateKey]) return null;
  const items = PLANET_IMPLICATIONS[stateKey];
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        {open ? 'Hide' : 'Show'} per-planet implications
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {items.map((imp, k) => (
                <div key={k} className="flex gap-2 items-start p-2 rounded-lg bg-bg-primary/50 border border-gold-primary/6">
                  <span className="text-base leading-none mt-0.5 shrink-0">{imp.symbol}</span>
                  <div>
                    <span className="text-gold-dark text-xs font-bold">{imp.planet}: </span>
                    <span className="text-text-tertiary text-xs leading-relaxed">{imp.en}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SYSTEM_ICONS = [User, Eye, Flame, Heart, Activity];
const SYSTEM_COLORS = ['text-amber-400', 'text-emerald-400', 'text-orange-400', 'text-pink-400', 'text-cyan-400'];

export default function LearnAvasthasPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedSystem, setExpandedSystem] = useState<number | null>(0);
  const [expandedChange, setExpandedChange] = useState<number | null>(null);

  const BALADI_STATES = [
    { name: { en: 'Bala (Infant)', hi: 'बाल (शिशु)', sa: 'बाल (शिशु)', mai: 'बाल (शिशु)', mr: 'बाल (शिशु)', ta: 'பால (சிசு)', te: 'బాల (శిశువు)', bn: 'বাল (শিশু)', kn: 'ಬಾಲ (ಶಿಶು)', gu: 'બાલ (શિશુ)' }, condition: { en: '0-6° (odd sign) / 24-30° (even sign)', hi: '0-6° (विषम राशि) / 24-30° (सम राशि)', sa: '0-6° (विषम राशि) / 24-30° (सम राशि)', mai: '0-6° (विषम राशि) / 24-30° (सम राशि)', mr: '0-6° (विषम राशि) / 24-30° (सम राशि)', ta: '0-6° (odd sign) / 24-30° (even sign)', te: '0-6° (odd sign) / 24-30° (even sign)', bn: '0-6° (odd sign) / 24-30° (even sign)', kn: '0-6° (odd sign) / 24-30° (even sign)', gu: '0-6° (odd sign) / 24-30° (even sign)' }, result: { en: 'Planet is immature — gives results but erratically, like a child.', hi: 'ग्रह अपरिपक्व — फल देता है परन्तु अनियमित।', sa: 'ग्रह अपरिपक्व — फल देता है परन्तु अनियमित।', mai: 'ग्रह अपरिपक्व — फल देता है परन्तु अनियमित।', mr: 'ग्रह अपरिपक्व — फल देता है परन्तु अनियमित।', ta: 'Planet is immature — gives results but erratically, like a child.', te: 'Planet is immature — gives results but erratically, like a child.', bn: 'Planet is immature — gives results but erratically, like a child.', kn: 'Planet is immature — gives results but erratically, like a child.', gu: 'Planet is immature — gives results but erratically, like a child.' }, color: 'text-cyan-400', tier: 'mixed', stateKey: null },
    { name: { en: 'Kumara (Youth)', hi: 'कुमार (युवा)', sa: 'कुमार (युवा)', mai: 'कुमार (युवा)', mr: 'कुमार (युवा)', ta: 'குமார (யுவன்)', te: 'కుమార (యువకుడు)', bn: 'কুমার (যুবক)', kn: 'ಕುಮಾರ (ಯುವಕ)', gu: 'કુમાર (યુવાન)' }, condition: { en: '6-12° (odd) / 18-24° (even)', hi: '6-12° (विषम) / 18-24° (सम)', sa: '6-12° (विषम) / 18-24° (सम)', mai: '6-12° (विषम) / 18-24° (सम)', mr: '6-12° (विषम) / 18-24° (सम)', ta: '6-12° (odd) / 18-24° (even)', te: '6-12° (odd) / 18-24° (even)', bn: '6-12° (odd) / 18-24° (even)', kn: '6-12° (odd) / 18-24° (even)', gu: '6-12° (odd) / 18-24° (even)' }, result: { en: 'Planet is growing — gives results with increasing strength.', hi: 'ग्रह बढ़ रहा है — बढ़ती शक्ति से फल देता है।', sa: 'ग्रह बढ़ रहा है — बढ़ती शक्ति से फल देता है।', mai: 'ग्रह बढ़ रहा है — बढ़ती शक्ति से फल देता है।', mr: 'ग्रह बढ़ रहा है — बढ़ती शक्ति से फल देता है।', ta: 'Planet is growing — gives results with increasing strength.', te: 'Planet is growing — gives results with increasing strength.', bn: 'Planet is growing — gives results with increasing strength.', kn: 'Planet is growing — gives results with increasing strength.', gu: 'Planet is growing — gives results with increasing strength.' }, color: 'text-emerald-400', tier: 'good', stateKey: null },
    { name: { en: 'Yuva (Prime)', hi: 'युवा (पूर्ण)', sa: 'युवा (पूर्ण)', mai: 'युवा (पूर्ण)', mr: 'युवा (पूर्ण)', ta: 'யுவ (முழுமை)', te: 'యువ (యువకుడు)', bn: 'যুব (পূর্ণ)', kn: 'ಯುವ (ಪ್ರೌಢ)', gu: 'યુવ (પૂર્ણ)' }, condition: { en: '12-18° (odd) / 12-18° (even)', hi: '12-18° (विषम) / 12-18° (सम)', sa: '12-18° (विषम) / 12-18° (सम)', mai: '12-18° (विषम) / 12-18° (सम)', mr: '12-18° (विषम) / 12-18° (सम)', ta: '12-18° (odd) / 12-18° (even)', te: '12-18° (odd) / 12-18° (even)', bn: '12-18° (odd) / 12-18° (even)', kn: '12-18° (odd) / 12-18° (even)', gu: '12-18° (odd) / 12-18° (even)' }, result: { en: 'Planet at peak — gives full, powerful results. The best Baladi state.', hi: 'ग्रह चरम पर — पूर्ण, शक्तिशाली फल। सर्वश्रेष्ठ बालादि अवस्था।', sa: 'ग्रह चरम पर — पूर्ण, शक्तिशाली फल। सर्वश्रेष्ठ बालादि अवस्था।', mai: 'ग्रह चरम पर — पूर्ण, शक्तिशाली फल। सर्वश्रेष्ठ बालादि अवस्था।', mr: 'ग्रह चरम पर — पूर्ण, शक्तिशाली फल। सर्वश्रेष्ठ बालादि अवस्था।', ta: 'Planet at peak — gives full, powerful results. The best Baladi state.', te: 'Planet at peak — gives full, powerful results. The best Baladi state.', bn: 'Planet at peak — gives full, powerful results. The best Baladi state.', kn: 'Planet at peak — gives full, powerful results. The best Baladi state.', gu: 'Planet at peak — gives full, powerful results. The best Baladi state.' }, color: 'text-amber-400', tier: 'excellent', stateKey: 'yuva' },
    { name: { en: 'Vriddha (Old)', hi: 'वृद्ध (प्रौढ़)', sa: 'वृद्ध (प्रौढ़)', mai: 'वृद्ध (प्रौढ़)', mr: 'वृद्ध (प्रौढ़)', ta: 'வ்ருத்த (வயோதிகம்)', te: 'వృద్ధ (వృద్ధుడు)', bn: 'বৃদ্ধ (বৃদ্ধ)', kn: 'ವೃದ್ಧ (ವೃದ್ಧ)', gu: 'વૃદ્ધ (વૃદ્ધ)' }, condition: { en: '18-24° (odd) / 6-12° (even)', hi: '18-24° (विषम) / 6-12° (सम)', sa: '18-24° (विषम) / 6-12° (सम)', mai: '18-24° (विषम) / 6-12° (सम)', mr: '18-24° (विषम) / 6-12° (सम)', ta: '18-24° (odd) / 6-12° (even)', te: '18-24° (odd) / 6-12° (even)', bn: '18-24° (odd) / 6-12° (even)', kn: '18-24° (odd) / 6-12° (even)', gu: '18-24° (odd) / 6-12° (even)' }, result: { en: 'Planet declining — gives results with decreasing enthusiasm.', hi: 'ग्रह क्षीण — घटते उत्साह से फल देता है।', sa: 'ग्रह क्षीण — घटते उत्साह से फल देता है।', mai: 'ग्रह क्षीण — घटते उत्साह से फल देता है।', mr: 'ग्रह क्षीण — घटते उत्साह से फल देता है।', ta: 'Planet declining — gives results with decreasing enthusiasm.', te: 'Planet declining — gives results with decreasing enthusiasm.', bn: 'Planet declining — gives results with decreasing enthusiasm.', kn: 'Planet declining — gives results with decreasing enthusiasm.', gu: 'Planet declining — gives results with decreasing enthusiasm.' }, color: 'text-violet-400', tier: 'mixed', stateKey: null },
    { name: { en: 'Mrita (Dead)', hi: 'मृत', sa: 'मृत', mai: 'मृत', mr: 'मृत', ta: 'ம்ருத (மரணம்)', te: 'మృత (మరణం)', bn: 'মৃত (মৃত)', kn: 'ಮೃತ (ಮೃತ)', gu: 'મૃત (મૃત)' }, condition: { en: '24-30° (odd) / 0-6° (even)', hi: '24-30° (विषम) / 0-6° (सम)', sa: '24-30° (विषम) / 0-6° (सम)', mai: '24-30° (विषम) / 0-6° (सम)', mr: '24-30° (विषम) / 0-6° (सम)', ta: '24-30° (odd) / 0-6° (even)', te: '24-30° (odd) / 0-6° (even)', bn: '24-30° (odd) / 0-6° (even)', kn: '24-30° (odd) / 0-6° (even)', gu: '24-30° (odd) / 0-6° (even)' }, result: { en: 'Planet at minimum power — gives weak or denied results in its significations.', hi: 'ग्रह न्यूनतम शक्ति पर — अपने कारकत्वों में कमजोर या अस्वीकृत फल।', sa: 'ग्रह न्यूनतम शक्ति पर — अपने कारकत्वों में कमजोर या अस्वीकृत फल।', mai: 'ग्रह न्यूनतम शक्ति पर — अपने कारकत्वों में कमजोर या अस्वीकृत फल।', mr: 'ग्रह न्यूनतम शक्ति पर — अपने कारकत्वों में कमजोर या अस्वीकृत फल।', ta: 'Planet at minimum power — gives weak or denied results in its significations.', te: 'Planet at minimum power — gives weak or denied results in its significations.', bn: 'Planet at minimum power — gives weak or denied results in its significations.', kn: 'Planet at minimum power — gives weak or denied results in its significations.', gu: 'Planet at minimum power — gives weak or denied results in its significations.' }, color: 'text-red-400', tier: 'denied', stateKey: 'mrita' },
  ];

  const JAGRA_STATES = [
    { name: { en: 'Jagrat (Awake)', hi: 'जाग्रत', sa: 'जाग्रत', mai: 'जाग्रत', mr: 'जाग्रत', ta: 'ஜாக்ரத் (விழிப்பு)', te: 'జాగ్రత్ (మెలకువ)', bn: 'জাগ্রত (জাগ্রত)', kn: 'ಜಾಗ್ರತ್ (ಎಚ್ಚರ)', gu: 'જાગ્રત (જાગૃત)' }, condition: { en: 'Planet in own sign or exaltation', hi: 'ग्रह स्वराशि या उच्च में', sa: 'ग्रह स्वराशि या उच्च में', mai: 'ग्रह स्वराशि या उच्च में', mr: 'ग्रह स्वराशि या उच्च में', ta: 'Planet in own sign or exaltation', te: 'Planet in own sign or exaltation', bn: 'Planet in own sign or exaltation', kn: 'Planet in own sign or exaltation', gu: 'Planet in own sign or exaltation' }, result: { en: 'Fully awake and delivering 100% results. The planet is in its most comfortable position.', hi: 'पूर्ण जागृत और 100% फल। ग्रह अपनी सबसे आरामदायक स्थिति में।', sa: 'पूर्ण जागृत और 100% फल। ग्रह अपनी सबसे आरामदायक स्थिति में।', mai: 'पूर्ण जागृत और 100% फल। ग्रह अपनी सबसे आरामदायक स्थिति में।', mr: 'पूर्ण जागृत और 100% फल। ग्रह अपनी सबसे आरामदायक स्थिति में।', ta: 'Fully awake and delivering 100% results. The planet is in its most comfortable position.', te: 'Fully awake and delivering 100% results. The planet is in its most comfortable position.', bn: 'Fully awake and delivering 100% results. The planet is in its most comfortable position.', kn: 'Fully awake and delivering 100% results. The planet is in its most comfortable position.', gu: 'Fully awake and delivering 100% results. The planet is in its most comfortable position.' }, color: 'text-emerald-400', tier: 'excellent', stateKey: 'jagrat' },
    { name: { en: 'Swapna (Dreaming)', hi: 'स्वप्न', sa: 'स्वप्न', mai: 'स्वप्न', mr: 'स्वप्न', ta: 'ஸ்வப்ன (கனவு)', te: 'స్వప్న (కల)', bn: 'স্বপ্ন (স্বপ্ন)', kn: 'ಸ್ವಪ್ನ (ಕನಸು)', gu: 'સ્વપ્ન (સ્વપ્ન)' }, condition: { en: 'Planet in friendly sign', hi: 'ग्रह मित्र राशि में', sa: 'ग्रह मित्र राशि में', mai: 'ग्रह मित्र राशि में', mr: 'ग्रह मित्र राशि में', ta: 'Planet in friendly sign', te: 'Planet in friendly sign', bn: 'Planet in friendly sign', kn: 'Planet in friendly sign', gu: 'Planet in friendly sign' }, result: { en: 'Moderately active — delivers results but not at full capacity. Like working in a comfortable guest room.', hi: 'मध्यम सक्रिय — फल देता है परन्तु पूर्ण क्षमता से नहीं।', sa: 'मध्यम सक्रिय — फल देता है परन्तु पूर्ण क्षमता से नहीं।', mai: 'मध्यम सक्रिय — फल देता है परन्तु पूर्ण क्षमता से नहीं।', mr: 'मध्यम सक्रिय — फल देता है परन्तु पूर्ण क्षमता से नहीं।', ta: 'Moderately active — delivers results but not at full capacity. Like working in a comfortable guest room.', te: 'Moderately active — delivers results but not at full capacity. Like working in a comfortable guest room.', bn: 'Moderately active — delivers results but not at full capacity. Like working in a comfortable guest room.', kn: 'Moderately active — delivers results but not at full capacity. Like working in a comfortable guest room.', gu: 'Moderately active — delivers results but not at full capacity. Like working in a comfortable guest room.' }, color: 'text-amber-400', tier: 'good', stateKey: 'swapna' },
    { name: { en: 'Sushupti (Deep Sleep)', hi: 'सुषुप्ति', sa: 'सुषुप्ति', mai: 'सुषुप्ति', mr: 'सुषुप्ति', ta: 'சுஷுப்தி (ஆழ்நிலை)', te: 'సుషుప్తి (గాఢనిద్ర)', bn: 'সুষুপ্তি (গভীর নিদ্রা)', kn: 'ಸುಷುಪ್ತಿ (ಗಾಢ ನಿದ್ರೆ)', gu: 'સુષુપ્તિ (ગાઢ નિદ્રા)' }, condition: { en: 'Planet in enemy sign or debilitation', hi: 'ग्रह शत्रु राशि या नीच में', sa: 'ग्रह शत्रु राशि या नीच में', mai: 'ग्रह शत्रु राशि या नीच में', mr: 'ग्रह शत्रु राशि या नीच में', ta: 'Planet in enemy sign or debilitation', te: 'Planet in enemy sign or debilitation', bn: 'Planet in enemy sign or debilitation', kn: 'Planet in enemy sign or debilitation', gu: 'Planet in enemy sign or debilitation' }, result: { en: 'Dormant — significations suppressed, results blocked or severely delayed. The planet struggles to express itself.', hi: 'सुप्त — कारकत्व दबे, फल अवरुद्ध या अत्यधिक विलम्बित।', sa: 'सुप्त — कारकत्व दबे, फल अवरुद्ध या अत्यधिक विलम्बित।', mai: 'सुप्त — कारकत्व दबे, फल अवरुद्ध या अत्यधिक विलम्बित।', mr: 'सुप्त — कारकत्व दबे, फल अवरुद्ध या अत्यधिक विलम्बित।', ta: 'Dormant — significations suppressed, results blocked or severely delayed. The planet struggles to express itself.', te: 'Dormant — significations suppressed, results blocked or severely delayed. The planet struggles to express itself.', bn: 'Dormant — significations suppressed, results blocked or severely delayed. The planet struggles to express itself.', kn: 'Dormant — significations suppressed, results blocked or severely delayed. The planet struggles to express itself.', gu: 'Dormant — significations suppressed, results blocked or severely delayed. The planet struggles to express itself.' }, color: 'text-red-400', tier: 'denied', stateKey: 'sushupti' },
  ];

  const DEEPTA_STATES = [
    { name: { en: 'Deepta (Exalted)', hi: 'दीप्त (उच्च)', sa: 'दीप्त (उच्च)', mai: 'दीप्त (उच्च)', mr: 'दीप्त (उच्च)', ta: 'தீப்த (உச்சம்)', te: 'దీప్త (ఉచ్చం)', bn: 'দীপ্ত (উচ্চ)', kn: 'ದೀಪ್ತ (ಉಚ್ಚ)', gu: 'દીપ્ત (ઉચ્ચ)' }, condition: { en: 'Planet in exaltation sign', hi: 'ग्रह उच्च राशि में', sa: 'ग्रह उच्च राशि में', mai: 'ग्रह उच्च राशि में', mr: 'ग्रह उच्च राशि में', ta: 'Planet in exaltation sign', te: 'Planet in exaltation sign', bn: 'Planet in exaltation sign', kn: 'Planet in exaltation sign', gu: 'Planet in exaltation sign' }, result: { en: 'Maximum luminosity — planet shines at its absolute brightest. Results are extraordinary and effortless.', hi: 'अधिकतम दीप्ति — ग्रह अपनी पूर्ण चमक पर। फल असाधारण और सहज।', sa: 'अधिकतम दीप्ति — ग्रह अपनी पूर्ण चमक पर। फल असाधारण और सहज।', mai: 'अधिकतम दीप्ति — ग्रह अपनी पूर्ण चमक पर। फल असाधारण और सहज।', mr: 'अधिकतम दीप्ति — ग्रह अपनी पूर्ण चमक पर। फल असाधारण और सहज।', ta: 'Maximum luminosity — planet shines at its absolute brightest. Results are extraordinary and effortless.', te: 'Maximum luminosity — planet shines at its absolute brightest. Results are extraordinary and effortless.', bn: 'Maximum luminosity — planet shines at its absolute brightest. Results are extraordinary and effortless.', kn: 'Maximum luminosity — planet shines at its absolute brightest. Results are extraordinary and effortless.', gu: 'Maximum luminosity — planet shines at its absolute brightest. Results are extraordinary and effortless.' }, color: 'text-amber-400', tier: 'excellent', stateKey: 'deepta' },
    { name: { en: 'Swastha (Own sign)', hi: 'स्वस्थ (स्वराशि)', sa: 'स्वस्थ (स्वराशि)', mai: 'स्वस्थ (स्वराशि)', mr: 'स्वस्थ (स्वराशि)', ta: 'ஸ்வஸ்த (சொந்த ராசி)', te: 'స్వస్థ (స్వరాశి)', bn: 'স্বস্থ (স্বরাশি)', kn: 'ಸ್ವಸ್ಥ (ಸ್ವರಾಶಿ)', gu: 'સ્વસ્થ (સ્વરાશિ)' }, condition: { en: 'Planet in own sign', hi: 'ग्रह स्वराशि में', sa: 'ग्रह स्वराशि में', mai: 'ग्रह स्वराशि में', mr: 'ग्रह स्वराशि में', ta: 'Planet in own sign', te: 'Planet in own sign', bn: 'Planet in own sign', kn: 'Planet in own sign', gu: 'Planet in own sign' }, result: { en: 'Healthy and comfortable — delivers strong, reliable results. At home.', hi: 'स्वस्थ और सहज — मजबूत, विश्वसनीय फल। अपने घर में।', sa: 'स्वस्थ और सहज — मजबूत, विश्वसनीय फल। अपने घर में।', mai: 'स्वस्थ और सहज — मजबूत, विश्वसनीय फल। अपने घर में।', mr: 'स्वस्थ और सहज — मजबूत, विश्वसनीय फल। अपने घर में।', ta: 'Healthy and comfortable — delivers strong, reliable results. At home.', te: 'Healthy and comfortable — delivers strong, reliable results. At home.', bn: 'Healthy and comfortable — delivers strong, reliable results. At home.', kn: 'Healthy and comfortable — delivers strong, reliable results. At home.', gu: 'Healthy and comfortable — delivers strong, reliable results. At home.' }, color: 'text-emerald-400', tier: 'excellent', stateKey: null },
    { name: { en: 'Mudita (Friendly sign)', hi: 'मुदित (मित्र राशि)', sa: 'मुदित (मित्र राशि)', mai: 'मुदित (मित्र राशि)', mr: 'मुदित (मित्र राशि)', ta: 'முதித (நட்பு ராசி)', te: 'ముదిత (మిత్రరాశి)', bn: 'মুদিত (মিত্ররাশি)', kn: 'ಮುದಿತ (ಮಿತ್ರರಾಶಿ)', gu: 'મુદિત (મિત્રરાશિ)' }, condition: { en: 'Planet in friendly sign', hi: 'ग्रह मित्र राशि में', sa: 'ग्रह मित्र राशि में', mai: 'ग्रह मित्र राशि में', mr: 'ग्रह मित्र राशि में', ta: 'Planet in friendly sign', te: 'Planet in friendly sign', bn: 'Planet in friendly sign', kn: 'Planet in friendly sign', gu: 'Planet in friendly sign' }, result: { en: 'Happy and willing — good results, cooperative energy.', hi: 'प्रसन्न और सहायक — अच्छे फल, सहयोगी ऊर्जा।', sa: 'प्रसन्न और सहायक — अच्छे फल, सहयोगी ऊर्जा।', mai: 'प्रसन्न और सहायक — अच्छे फल, सहयोगी ऊर्जा।', mr: 'प्रसन्न और सहायक — अच्छे फल, सहयोगी ऊर्जा।', ta: 'Happy and willing — good results, cooperative energy.', te: 'Happy and willing — good results, cooperative energy.', bn: 'Happy and willing — good results, cooperative energy.', kn: 'Happy and willing — good results, cooperative energy.', gu: 'Happy and willing — good results, cooperative energy.' }, color: 'text-blue-300', tier: 'good', stateKey: null },
    { name: { en: 'Shanta (Neutral)', hi: 'शान्त (सम)', sa: 'शान्त (सम)', mai: 'शान्त (सम)', mr: 'शान्त (सम)', ta: 'சாந்த (நடுநிலை)', te: 'శాంత (సమరాశి)', bn: 'শান্ত (সমরাশি)', kn: 'ಶಾಂತ (ಸಮರಾಶಿ)', gu: 'શાંત (સમરાશિ)' }, condition: { en: 'Planet in neutral sign', hi: 'ग्रह सम राशि में', sa: 'ग्रह सम राशि में', mai: 'ग्रह सम राशि में', mr: 'ग्रह सम राशि में', ta: 'Planet in neutral sign', te: 'Planet in neutral sign', bn: 'Planet in neutral sign', kn: 'Planet in neutral sign', gu: 'Planet in neutral sign' }, result: { en: 'Calm but uninspired — average results, neither helped nor hindered.', hi: 'शांत पर प्रेरणाहीन — औसत फल, न सहायक न बाधक।', sa: 'शांत पर प्रेरणाहीन — औसत फल, न सहायक न बाधक।', mai: 'शांत पर प्रेरणाहीन — औसत फल, न सहायक न बाधक।', mr: 'शांत पर प्रेरणाहीन — औसत फल, न सहायक न बाधक।', ta: 'Calm but uninspired — average results, neither helped nor hindered.', te: 'Calm but uninspired — average results, neither helped nor hindered.', bn: 'Calm but uninspired — average results, neither helped nor hindered.', kn: 'Calm but uninspired — average results, neither helped nor hindered.', gu: 'Calm but uninspired — average results, neither helped nor hindered.' }, color: 'text-text-secondary', tier: 'mixed', stateKey: null },
    { name: { en: 'Khala (Debilitated)', hi: 'खल (नीच)', sa: 'खल (नीच)', mai: 'खल (नीच)', mr: 'खल (नीच)', ta: 'கல (நீசம்)', te: 'ఖల (నీచం)', bn: 'খল (নীচ)', kn: 'ಖಲ (ನೀಚ)', gu: 'ખલ (નીચ)' }, condition: { en: 'Planet in debilitation sign', hi: 'ग्रह नीच राशि में', sa: 'ग्रह नीच राशि में', mai: 'ग्रह नीच राशि में', mr: 'ग्रह नीच राशि में', ta: 'Planet in debilitation sign', te: 'Planet in debilitation sign', bn: 'Planet in debilitation sign', kn: 'Planet in debilitation sign', gu: 'Planet in debilitation sign' }, result: { en: 'Minimum luminosity — planet at its weakest. Results severely compromised unless Neecha Bhanga applies.', hi: 'न्यूनतम दीप्ति — ग्रह सबसे कमजोर। फल गम्भीर रूप से प्रभावित जब तक नीच भंग न हो।', sa: 'न्यूनतम दीप्ति — ग्रह सबसे कमजोर। फल गम्भीर रूप से प्रभावित जब तक नीच भंग न हो।', mai: 'न्यूनतम दीप्ति — ग्रह सबसे कमजोर। फल गम्भीर रूप से प्रभावित जब तक नीच भंग न हो।', mr: 'न्यूनतम दीप्ति — ग्रह सबसे कमजोर। फल गम्भीर रूप से प्रभावित जब तक नीच भंग न हो।', ta: 'Minimum luminosity — planet at its weakest. Results severely compromised unless Neecha Bhanga applies.', te: 'Minimum luminosity — planet at its weakest. Results severely compromised unless Neecha Bhanga applies.', bn: 'Minimum luminosity — planet at its weakest. Results severely compromised unless Neecha Bhanga applies.', kn: 'Minimum luminosity — planet at its weakest. Results severely compromised unless Neecha Bhanga applies.', gu: 'Minimum luminosity — planet at its weakest. Results severely compromised unless Neecha Bhanga applies.' }, color: 'text-red-400', tier: 'denied', stateKey: 'khala' },
    { name: { en: 'Vikala (Combust)', hi: 'विकल (अस्त)', sa: 'विकल (अस्त)', mai: 'विकल (अस्त)', mr: 'विकल (अस्त)', ta: 'விகல (அஸ்தமனம்)', te: 'వికల (అస్తంగతం)', bn: 'বিকল (অস্তঙ্গত)', kn: 'ವಿಕಲ (ಅಸ್ತಂಗತ)', gu: 'વિકલ (અસ્તંગત)' }, condition: { en: 'Planet within combustion range of Sun', hi: 'ग्रह सूर्य से अस्त सीमा में', sa: 'ग्रह सूर्य से अस्त सीमा में', mai: 'ग्रह सूर्य से अस्त सीमा में', mr: 'ग्रह सूर्य से अस्त सीमा में', ta: 'Planet within combustion range of Sun', te: 'Planet within combustion range of Sun', bn: 'Planet within combustion range of Sun', kn: 'Planet within combustion range of Sun', gu: 'Planet within combustion range of Sun' }, result: { en: 'Burnt by Sun\'s rays — significations overshadowed by ego, authority, or father figure.', hi: 'सूर्य की किरणों से दग्ध — कारकत्व अहंकार, सत्ता या पितृ आकृति से आच्छादित।' }, color: 'text-orange-400', tier: 'weak', stateKey: 'vikala' },
    { name: { en: 'Shakta (Retrograde)', hi: 'शक्त (वक्री)', sa: 'शक्त (वक्री)', mai: 'शक्त (वक्री)', mr: 'शक्त (वक्री)', ta: 'சக்த (வக்கிரம்)', te: 'శక్త (వక్రం)', bn: 'শক্ত (বক্র)', kn: 'ಶಕ್ತ (ವಕ್ರ)', gu: 'શક્ત (વક્ર)' }, condition: { en: 'Planet in retrograde motion', hi: 'ग्रह वक्री गति में', sa: 'ग्रह वक्री गति में', mai: 'ग्रह वक्री गति में', mr: 'ग्रह वक्री गति में', ta: 'Planet in retrograde motion', te: 'Planet in retrograde motion', bn: 'Planet in retrograde motion', kn: 'Planet in retrograde motion', gu: 'Planet in retrograde motion' }, result: { en: 'Powerful but internalized — energy directed inward. Past-life themes surface. Closer to Earth = stronger.', hi: 'शक्तिशाली पर आन्तरिक — ऊर्जा अन्दर निर्देशित। पूर्वजन्म विषय उभरते हैं।', sa: 'शक्तिशाली पर आन्तरिक — ऊर्जा अन्दर निर्देशित। पूर्वजन्म विषय उभरते हैं।', mai: 'शक्तिशाली पर आन्तरिक — ऊर्जा अन्दर निर्देशित। पूर्वजन्म विषय उभरते हैं।', mr: 'शक्तिशाली पर आन्तरिक — ऊर्जा अन्दर निर्देशित। पूर्वजन्म विषय उभरते हैं।', ta: 'Powerful but internalized — energy directed inward. Past-life themes surface. Closer to Earth = stronger.', te: 'Powerful but internalized — energy directed inward. Past-life themes surface. Closer to Earth = stronger.', bn: 'Powerful but internalized — energy directed inward. Past-life themes surface. Closer to Earth = stronger.', kn: 'Powerful but internalized — energy directed inward. Past-life themes surface. Closer to Earth = stronger.', gu: 'Powerful but internalized — energy directed inward. Past-life themes surface. Closer to Earth = stronger.' }, color: 'text-violet-400', tier: 'good', stateKey: 'shakta' },
  ];

  const LAJJITA_STATES = [
    { name: { en: 'Lajjita (Ashamed)', hi: 'लज्जित', sa: 'लज्जित', mai: 'लज्जित', mr: 'लज्जित', ta: 'லஜ்ஜித (வெட்கம்)', te: 'లజ్జిత (సిగ్గు)', bn: 'লজ্জিত (লজ্জা)', kn: 'ಲಜ್ಜಿತ (ನಾಚಿಕೆ)', gu: 'લજ્જિત (લજ્જા)' }, condition: { en: 'Planet in 5th house conjunct Rahu/Ketu/Saturn/Mars', hi: 'ग्रह 5वें भाव में राहु/केतु/शनि/मंगल से युत', sa: 'ग्रह 5वें भाव में राहु/केतु/शनि/मंगल से युत', mai: 'ग्रह 5वें भाव में राहु/केतु/शनि/मंगल से युत', mr: 'ग्रह 5वें भाव में राहु/केतु/शनि/मंगल से युत', ta: 'Planet in 5th house conjunct Rahu/Ketu/Saturn/Mars', te: 'Planet in 5th house conjunct Rahu/Ketu/Saturn/Mars', bn: 'Planet in 5th house conjunct Rahu/Ketu/Saturn/Mars', kn: 'Planet in 5th house conjunct Rahu/Ketu/Saturn/Mars', gu: 'Planet in 5th house conjunct Rahu/Ketu/Saturn/Mars' }, effect: { en: 'Shame, embarrassment in the planet\'s significations. Social judgment themes.', hi: 'ग्रह के कारकत्वों में लज्जा, शर्मिंदगी। सामाजिक निर्णय।' }, color: 'text-pink-400', stateKey: 'lajjita' },
    { name: { en: 'Garvita (Proud)', hi: 'गर्वित', sa: 'गर्वित', mai: 'गर्वित', mr: 'गर्वित', ta: 'கர்வித (கர்வம்)', te: 'గర్విత (గర్వం)', bn: 'গর্বিত (গর্ব)', kn: 'ಗರ್ವಿತ (ಗರ್ವ)', gu: 'ગર્વિત (ગર્વ)' }, condition: { en: 'Planet in exaltation or own moolatrikona', hi: 'ग्रह उच्च या स्वमूलत्रिकोण में', sa: 'ग्रह उच्च या स्वमूलत्रिकोण में', mai: 'ग्रह उच्च या स्वमूलत्रिकोण में', mr: 'ग्रह उच्च या स्वमूलत्रिकोण में', ta: 'Planet in exaltation or own moolatrikona', te: 'Planet in exaltation or own moolatrikona', bn: 'Planet in exaltation or own moolatrikona', kn: 'Planet in exaltation or own moolatrikona', gu: 'Planet in exaltation or own moolatrikona' }, effect: { en: 'Pride and confidence in the planet\'s domain. Can tip into arrogance.', hi: 'ग्रह के क्षेत्र में गर्व और आत्मविश्वास। अहंकार में बदल सकता है।' }, color: 'text-amber-400', stateKey: 'garvita' },
    { name: { en: 'Kshudhita (Hungry)', hi: 'क्षुधित', sa: 'क्षुधित', mai: 'क्षुधित', mr: 'क्षुधित', ta: 'க்ஷுதித (பசி)', te: 'క్షుధిత (ఆకలి)', bn: 'ক্ষুধিত (ক্ষুধার্ত)', kn: 'ಕ್ಷುಧಿತ (ಹಸಿವು)', gu: 'ક્ષુધિત (ભૂખ)' }, condition: { en: 'Planet in enemy sign or conjunct enemy planet', hi: 'ग्रह शत्रु राशि में या शत्रु ग्रह से युत', sa: 'ग्रह शत्रु राशि में या शत्रु ग्रह से युत', mai: 'ग्रह शत्रु राशि में या शत्रु ग्रह से युत', mr: 'ग्रह शत्रु राशि में या शत्रु ग्रह से युत', ta: 'Planet in enemy sign or conjunct enemy planet', te: 'Planet in enemy sign or conjunct enemy planet', bn: 'Planet in enemy sign or conjunct enemy planet', kn: 'Planet in enemy sign or conjunct enemy planet', gu: 'Planet in enemy sign or conjunct enemy planet' }, effect: { en: 'Insatiable hunger for the planet\'s significations. Never enough.', hi: 'ग्रह के कारकत्वों की अतृप्त भूख। कभी पर्याप्त नहीं।' }, color: 'text-orange-400', stateKey: 'kshudhita' },
    { name: { en: 'Trushita (Thirsty)', hi: 'तृषित', sa: 'तृषित', mai: 'तृषित', mr: 'तृषित', ta: 'த்ருஷித (தாகம்)', te: 'తృషిత (దాహం)', bn: 'তৃষিত (তৃষ্ণার্ত)', kn: 'ತೃಷಿತ (ಬಾಯಾರಿಕೆ)', gu: 'તૃષિત (તરસ)' }, condition: { en: 'Planet in watery sign aspected by enemy or in 6th/12th', hi: 'ग्रह जल राशि में शत्रु दृष्टि या 6/12 में', sa: 'ग्रह जल राशि में शत्रु दृष्टि या 6/12 में', mai: 'ग्रह जल राशि में शत्रु दृष्टि या 6/12 में', mr: 'ग्रह जल राशि में शत्रु दृष्टि या 6/12 में', ta: 'Planet in watery sign aspected by enemy or in 6th/12th', te: 'Planet in watery sign aspected by enemy or in 6th/12th', bn: 'Planet in watery sign aspected by enemy or in 6th/12th', kn: 'Planet in watery sign aspected by enemy or in 6th/12th', gu: 'Planet in watery sign aspected by enemy or in 6th/12th' }, effect: { en: 'Emotional depletion despite having resources. Inner emptiness.', hi: 'संसाधन होने के बावजूद भावनात्मक रिक्तता। आन्तरिक शून्यता।', sa: 'संसाधन होने के बावजूद भावनात्मक रिक्तता। आन्तरिक शून्यता।', mai: 'संसाधन होने के बावजूद भावनात्मक रिक्तता। आन्तरिक शून्यता।', mr: 'संसाधन होने के बावजूद भावनात्मक रिक्तता। आन्तरिक शून्यता।', ta: 'Emotional depletion despite having resources. Inner emptiness.', te: 'Emotional depletion despite having resources. Inner emptiness.', bn: 'Emotional depletion despite having resources. Inner emptiness.', kn: 'Emotional depletion despite having resources. Inner emptiness.', gu: 'Emotional depletion despite having resources. Inner emptiness.' }, color: 'text-blue-400', stateKey: 'trushita' },
    { name: { en: 'Mudita (Delighted)', hi: 'मुदित', sa: 'मुदित', mai: 'मुदित', mr: 'मुदित', ta: 'முதித (மகிழ்ச்சி)', te: 'ముదిత (ఆనందం)', bn: 'মুদিত (আনন্দ)', kn: 'ಮುದಿತ (ಆನಂದ)', gu: 'મુદિત (આનંદ)' }, condition: { en: 'Planet in friendly sign aspected by Jupiter', hi: 'ग्रह मित्र राशि में गुरु दृष्टि', sa: 'ग्रह मित्र राशि में गुरु दृष्टि', mai: 'ग्रह मित्र राशि में गुरु दृष्टि', mr: 'ग्रह मित्र राशि में गुरु दृष्टि', ta: 'Planet in friendly sign aspected by Jupiter', te: 'Planet in friendly sign aspected by Jupiter', bn: 'Planet in friendly sign aspected by Jupiter', kn: 'Planet in friendly sign aspected by Jupiter', gu: 'Planet in friendly sign aspected by Jupiter' }, effect: { en: 'Joy and delight in the planet\'s significations. Grace and ease.', hi: 'ग्रह के कारकत्वों में आनन्द। कृपा और सहजता।' }, color: 'text-emerald-400', stateKey: 'mudita_l' },
    { name: { en: 'Kshobhita (Agitated)', hi: 'क्षोभित', sa: 'क्षोभित', mai: 'क्षोभित', mr: 'क्षोभित', ta: 'க்ஷோபித (கலக்கம்)', te: 'క్షోభిత (కలత)', bn: 'ক্ষোভিত (ক্ষুব্ধ)', kn: 'ಕ್ಷೋಭಿತ (ಕಲಕಿ)', gu: 'ક્ષોભિત (ક્ષુબ્ધ)' }, condition: { en: 'Planet conjunct Sun and aspected by malefic', hi: 'ग्रह सूर्य से युत और पापी दृष्टि', sa: 'ग्रह सूर्य से युत और पापी दृष्टि', mai: 'ग्रह सूर्य से युत और पापी दृष्टि', mr: 'ग्रह सूर्य से युत और पापी दृष्टि', ta: 'Planet conjunct Sun and aspected by malefic', te: 'Planet conjunct Sun and aspected by malefic', bn: 'Planet conjunct Sun and aspected by malefic', kn: 'Planet conjunct Sun and aspected by malefic', gu: 'Planet conjunct Sun and aspected by malefic' }, effect: { en: 'Severe agitation, anxiety, and volatility. Double affliction.', hi: 'तीव्र क्षोभ, चिन्ता और अस्थिरता। दोहरा कष्ट।', sa: 'तीव्र क्षोभ, चिन्ता और अस्थिरता। दोहरा कष्ट।', mai: 'तीव्र क्षोभ, चिन्ता और अस्थिरता। दोहरा कष्ट।', mr: 'तीव्र क्षोभ, चिन्ता और अस्थिरता। दोहरा कष्ट।', ta: 'Severe agitation, anxiety, and volatility. Double affliction.', te: 'Severe agitation, anxiety, and volatility. Double affliction.', bn: 'Severe agitation, anxiety, and volatility. Double affliction.', kn: 'Severe agitation, anxiety, and volatility. Double affliction.', gu: 'Severe agitation, anxiety, and volatility. Double affliction.' }, color: 'text-red-400', stateKey: 'kshobhita' },
  ];

  const SHAYANA_STATES = [
    { name: { en: 'Shayana (Sleeping)', hi: 'शयन', sa: 'शयन', mai: 'शयन', mr: 'शयन', ta: 'சயன (உறக்கம்)', te: 'శయన (నిద్ర)', bn: 'শয়ন (শয়ন)', kn: 'ಶಯನ (ನಿದ್ರೆ)', gu: 'શયન (નિદ્રા)' }, desc: { en: 'Planet dormant — results delayed, internal processing. Like a seed underground.', hi: 'ग्रह सुप्त — फल विलम्बित, आन्तरिक प्रसंस्करण। भूमिगत बीज जैसा।', sa: 'ग्रह सुप्त — फल विलम्बित, आन्तरिक प्रसंस्करण। भूमिगत बीज जैसा।', mai: 'ग्रह सुप्त — फल विलम्बित, आन्तरिक प्रसंस्करण। भूमिगत बीज जैसा।', mr: 'ग्रह सुप्त — फल विलम्बित, आन्तरिक प्रसंस्करण। भूमिगत बीज जैसा।', ta: 'Planet dormant — results delayed, internal processing. Like a seed underground.', te: 'Planet dormant — results delayed, internal processing. Like a seed underground.', bn: 'Planet dormant — results delayed, internal processing. Like a seed underground.', kn: 'Planet dormant — results delayed, internal processing. Like a seed underground.', gu: 'Planet dormant — results delayed, internal processing. Like a seed underground.' }, color: 'text-blue-400', stateKey: 'shayana' },
    { name: { en: 'Upavesha (Sitting)', hi: 'उपवेश', sa: 'उपवेश', mai: 'उपवेश', mr: 'उपवेश', ta: 'உபவேச (அமர்வு)', te: 'ఉపవేశ (కూర్చునిన)', bn: 'উপবেশ (উপবিষ্ট)', kn: 'ಉಪವೇಶ (ಕುಳಿತ)', gu: 'ઉપવેશ (બેઠેલું)' }, desc: { en: 'Planet aware but not yet moving — preparation phase. Ready to act but waiting for the signal.', hi: 'ग्रह जागरूक पर अभी गतिशील नहीं — तैयारी चरण। कार्य के लिए तैयार पर संकेत की प्रतीक्षा।', sa: 'ग्रह जागरूक पर अभी गतिशील नहीं — तैयारी चरण। कार्य के लिए तैयार पर संकेत की प्रतीक्षा।', mai: 'ग्रह जागरूक पर अभी गतिशील नहीं — तैयारी चरण। कार्य के लिए तैयार पर संकेत की प्रतीक्षा।', mr: 'ग्रह जागरूक पर अभी गतिशील नहीं — तैयारी चरण। कार्य के लिए तैयार पर संकेत की प्रतीक्षा।', ta: 'Planet aware but not yet moving — preparation phase. Ready to act but waiting for the signal.', te: 'Planet aware but not yet moving — preparation phase. Ready to act but waiting for the signal.', bn: 'Planet aware but not yet moving — preparation phase. Ready to act but waiting for the signal.', kn: 'Planet aware but not yet moving — preparation phase. Ready to act but waiting for the signal.', gu: 'Planet aware but not yet moving — preparation phase. Ready to act but waiting for the signal.' }, color: 'text-cyan-400', stateKey: null },
    { name: { en: 'Netrapani (Alert)', hi: 'नेत्रपाणि', sa: 'नेत्रपाणि', mai: 'नेत्रपाणि', mr: 'नेत्रपाणि', ta: 'நேத்ரபாணி (விழிப்பு)', te: 'నేత్రపాణి (అప్రమత్తం)', bn: 'নেত্রপাণি (সতর্ক)', kn: 'ನೇತ್ರಪಾಣಿ (ಎಚ್ಚರ)', gu: 'નેત્રપાણિ (સજાગ)' }, desc: { en: 'Planet actively scanning — watchful, receptive, gathering information before acting.', hi: 'ग्रह सक्रिय रूप से देखता है — सतर्क, ग्रहणशील, कार्य से पूर्व सूचना एकत्र।', sa: 'ग्रह सक्रिय रूप से देखता है — सतर्क, ग्रहणशील, कार्य से पूर्व सूचना एकत्र।', mai: 'ग्रह सक्रिय रूप से देखता है — सतर्क, ग्रहणशील, कार्य से पूर्व सूचना एकत्र।', mr: 'ग्रह सक्रिय रूप से देखता है — सतर्क, ग्रहणशील, कार्य से पूर्व सूचना एकत्र।', ta: 'Planet actively scanning — watchful, receptive, gathering information before acting.', te: 'Planet actively scanning — watchful, receptive, gathering information before acting.', bn: 'Planet actively scanning — watchful, receptive, gathering information before acting.', kn: 'Planet actively scanning — watchful, receptive, gathering information before acting.', gu: 'Planet actively scanning — watchful, receptive, gathering information before acting.' }, color: 'text-emerald-400', stateKey: null },
    { name: { en: 'Prakasha (Illuminating)', hi: 'प्रकाश', sa: 'प्रकाश', mai: 'प्रकाश', mr: 'प्रकाश', ta: 'பிரகாச (ஒளிர்வு)', te: 'ప్రకాశ (ప్రకాశవంతం)', bn: 'প্রকাশ (প্রদীপ্ত)', kn: 'ಪ್ರಕಾಶ (ಪ್ರಕಾಶಮಾನ)', gu: 'પ્રકાશ (પ્રકાશિત)' }, desc: { en: 'Planet shining — results becoming visible, influence radiating outward.', hi: 'ग्रह प्रकाशमान — फल दृश्य, प्रभाव बाहर विकिरित।', sa: 'ग्रह प्रकाशमान — फल दृश्य, प्रभाव बाहर विकिरित।', mai: 'ग्रह प्रकाशमान — फल दृश्य, प्रभाव बाहर विकिरित।', mr: 'ग्रह प्रकाशमान — फल दृश्य, प्रभाव बाहर विकिरित।', ta: 'Planet shining — results becoming visible, influence radiating outward.', te: 'Planet shining — results becoming visible, influence radiating outward.', bn: 'Planet shining — results becoming visible, influence radiating outward.', kn: 'Planet shining — results becoming visible, influence radiating outward.', gu: 'Planet shining — results becoming visible, influence radiating outward.' }, color: 'text-amber-400', stateKey: null },
    { name: { en: 'Gaman (Moving)', hi: 'गमन', sa: 'गमन', mai: 'गमन', mr: 'गमन', ta: 'கமன (இயக்கம்)', te: 'గమన (చలనం)', bn: 'গমন (গতিশীল)', kn: 'ಗಮನ (ಚಲನೆ)', gu: 'ગમન (ગતિશીલ)' }, desc: { en: 'Planet at peak activity — results delivered swiftly and strongly. Maximum output.', hi: 'ग्रह चरम सक्रियता पर — फल शीघ्र और प्रबल। अधिकतम उत्पादन।', sa: 'ग्रह चरम सक्रियता पर — फल शीघ्र और प्रबल। अधिकतम उत्पादन।', mai: 'ग्रह चरम सक्रियता पर — फल शीघ्र और प्रबल। अधिकतम उत्पादन।', mr: 'ग्रह चरम सक्रियता पर — फल शीघ्र और प्रबल। अधिकतम उत्पादन।', ta: 'Planet at peak activity — results delivered swiftly and strongly. Maximum output.', te: 'Planet at peak activity — results delivered swiftly and strongly. Maximum output.', bn: 'Planet at peak activity — results delivered swiftly and strongly. Maximum output.', kn: 'Planet at peak activity — results delivered swiftly and strongly. Maximum output.', gu: 'Planet at peak activity — results delivered swiftly and strongly. Maximum output.' }, color: 'text-amber-400', stateKey: 'gaman' },
    { name: { en: 'Agaman (Returning)', hi: 'आगमन', sa: 'आगमन', mai: 'आगमन', mr: 'आगमन', ta: 'ஆகமன (மீள்வு)', te: 'ఆగమన (తిరిగి వచ్చుట)', bn: 'আগমন (প্রত্যাবর্তন)', kn: 'ಆಗಮನ (ಮರಳುವಿಕೆ)', gu: 'આગમન (પરત આવવું)' }, desc: { en: 'Planet revisiting — completing unfinished business, second chances, reworking past themes.', hi: 'ग्रह पुनरागमन — अधूरे कार्य पूर्ण, दूसरा अवसर, पुराने विषयों का पुनर्कार्य।', sa: 'ग्रह पुनरागमन — अधूरे कार्य पूर्ण, दूसरा अवसर, पुराने विषयों का पुनर्कार्य।', mai: 'ग्रह पुनरागमन — अधूरे कार्य पूर्ण, दूसरा अवसर, पुराने विषयों का पुनर्कार्य।', mr: 'ग्रह पुनरागमन — अधूरे कार्य पूर्ण, दूसरा अवसर, पुराने विषयों का पुनर्कार्य।', ta: 'Planet revisiting — completing unfinished business, second chances, reworking past themes.', te: 'Planet revisiting — completing unfinished business, second chances, reworking past themes.', bn: 'Planet revisiting — completing unfinished business, second chances, reworking past themes.', kn: 'Planet revisiting — completing unfinished business, second chances, reworking past themes.', gu: 'Planet revisiting — completing unfinished business, second chances, reworking past themes.' }, color: 'text-violet-400', stateKey: null },
  ];

  const systems = [
    { titleKey: 'baladiTitle', descKey: 'baladiDesc', states: BALADI_STATES, type: 'baladi' },
    { titleKey: 'jagraTitle', descKey: 'jagraDesc', states: JAGRA_STATES, type: 'jagra' },
    { titleKey: 'deeptaTitle', descKey: 'deeptaDesc', states: DEEPTA_STATES, type: 'deepta' },
    { titleKey: 'lajjitaTitle', descKey: 'lajjitaDesc', states: LAJJITA_STATES, type: 'lajjita' },
    { titleKey: 'shayanaTitle', descKey: 'shayanaDesc', states: SHAYANA_STATES, type: 'shayana' },
  ];

  const tierColor = (tier: string) => {
    switch (tier) {
      case 'excellent': return 'bg-emerald-500/10 text-emerald-400';
      case 'good': return 'bg-blue-500/10 text-blue-300';
      case 'mixed': return 'bg-amber-500/10 text-amber-400';
      case 'weak': return 'bg-red-500/10 text-red-400';
      case 'denied': return 'bg-red-500/15 text-red-500';
      default: return 'bg-gold-primary/10 text-gold-light';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{t('subtitle')}</p>
      </motion.div>

      {/* ═══ What are Avasthas ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('whatTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{t('whatP1')}</p>
        <p className="text-text-secondary leading-relaxed">{t('whatP2')}</p>
      </motion.section>

      {/* ═══ The 5 Systems ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t('fiveTitle')}</h2>
        {systems.map((sys, i) => {
          const Icon = SYSTEM_ICONS[i];
          const color = SYSTEM_COLORS[i];
          const isExpanded = expandedSystem === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedSystem(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${color}`} />
                  <span className={`font-bold text-lg ${color}`} style={headingFont}>{t(sys.titleKey)}</span>
                  <span className="text-text-tertiary text-xs">{sys.states.length} {isHi ? 'दशाएं' : 'states'}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 space-y-4 border-t border-gold-primary/10 pt-4">
                      <p className="text-text-secondary leading-relaxed text-sm">{t(sys.descKey)}</p>
                      <div className="space-y-2">
                        {sys.states.map((state: any, j: number) => (
                          <div key={j} className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/8">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`font-bold text-sm ${state.color}`}>{lt(state.name as LocaleText, locale)}</span>
                              {state.tier && <span className={`text-xs px-1.5 py-0.5 rounded ml-auto ${tierColor(state.tier)}`}>{state.tier}</span>}
                            </div>
                            {state.condition && <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-0.5">{isHi ? 'स्थिति' : 'Condition'}: <span className="normal-case tracking-normal text-text-secondary font-normal">{lt(state.condition as LocaleText, locale)}</span></div>}
                            {state.result && <div className="text-text-secondary text-xs leading-relaxed">{lt(state.result as LocaleText, locale)}</div>}
                            {state.effect && <div className="text-text-secondary text-xs leading-relaxed">{lt(state.effect as LocaleText, locale)}</div>}
                            {state.desc && <div className="text-text-secondary text-xs leading-relaxed">{lt(state.desc as LocaleText, locale)}</div>}
                            <PlanetImplicationsGrid stateKey={state.stateKey ?? null} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ How Avasthas Change ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <RefreshCw className="w-6 h-6 text-violet-400" />
          <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>
            {isHi ? 'अवस्थाएं कैसे बदलती हैं?' : 'How Do Avasthas Change?'}
          </h2>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'जन्म कुण्डली में अधिकांश अवस्थाएं स्थायी हैं। लेकिन तीन कारकों से वे बदल सकती हैं: गोचर (ग्रहों का वर्तमान भ्रमण), नीच भंग (नीचता रद्दीकरण), और स्थिति-बद्ध अस्थायी दशाएं (अस्त, वक्री, ग्रहयुद्ध)।'
            : 'Most avasthas are fixed in the natal chart. But three forces can shift them: transits (where planets are moving now), Neecha Bhanga (debilitation cancellation), and position-bound temporary states (combustion, retrograde, planetary war).'}
        </p>

        {HOW_STATES_CHANGE.map((section, i) => {
          const isExpanded = expandedChange === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedChange(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <RefreshCw className={`w-5 h-5 ${section.color}`} />
                  <span className={`font-bold text-base ${section.color}`} style={headingFont}>{section.system}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-gold-primary/10 pt-4 space-y-3">
                      {section.changes.map((change, j) => (
                        <div key={j} className={`p-4 rounded-xl border ${section.bgColor}`}>
                          <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${section.color}`}>{change.heading}</div>
                          <p className="text-text-secondary text-sm leading-relaxed">{change.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Interpretation Table ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('interpretTitle')}</h2>
        <p className="text-text-secondary text-sm">{t('interpretDesc')}</p>
        <div className="space-y-3">
          {[
            { tier: { en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्ट', mai: 'उत्कृष्ट', mr: 'उत्कृष्ट', ta: 'மிகச்சிறந்த', te: 'అద్భుతం', bn: 'চমৎকার', kn: 'ಅತ್ಯುತ್ತಮ', gu: 'ઉત્તમ' }, pct: '80-100%', examples: { en: 'Yuva + Jagrat + Deepta + Mudita + Gaman', hi: 'युवा + जाग्रत + दीप्त + मुदित + गमन', sa: 'युवा + जाग्रत + दीप्त + मुदित + गमन', mai: 'युवा + जाग्रत + दीप्त + मुदित + गमन', mr: 'युवा + जाग्रत + दीप्त + मुदित + गमन', ta: 'Yuva + Jagrat + Deepta + Mudita + Gaman', te: 'Yuva + Jagrat + Deepta + Mudita + Gaman', bn: 'Yuva + Jagrat + Deepta + Mudita + Gaman', kn: 'Yuva + Jagrat + Deepta + Mudita + Gaman', gu: 'Yuva + Jagrat + Deepta + Mudita + Gaman' }, desc: { en: 'The planet delivers its best results effortlessly. Life areas it governs flourish naturally.', hi: 'ग्रह अपने सर्वोत्तम फल सहज रूप से देता है। जिन जीवन क्षेत्रों पर शासन करता है वे स्वाभाविक रूप से फलते-फूलते हैं।', sa: 'ग्रह अपने सर्वोत्तम फल सहज रूप से देता है। जिन जीवन क्षेत्रों पर शासन करता है वे स्वाभाविक रूप से फलते-फूलते हैं।', mai: 'ग्रह अपने सर्वोत्तम फल सहज रूप से देता है। जिन जीवन क्षेत्रों पर शासन करता है वे स्वाभाविक रूप से फलते-फूलते हैं।', mr: 'ग्रह अपने सर्वोत्तम फल सहज रूप से देता है। जिन जीवन क्षेत्रों पर शासन करता है वे स्वाभाविक रूप से फलते-फूलते हैं।', ta: 'The planet delivers its best results effortlessly. Life areas it governs flourish naturally.', te: 'The planet delivers its best results effortlessly. Life areas it governs flourish naturally.', bn: 'The planet delivers its best results effortlessly. Life areas it governs flourish naturally.', kn: 'The planet delivers its best results effortlessly. Life areas it governs flourish naturally.', gu: 'The planet delivers its best results effortlessly. Life areas it governs flourish naturally.' }, color: 'border-emerald-500/20' },
            { tier: { en: 'Good', hi: 'अच्छा', sa: 'अच्छा', mai: 'अच्छा', mr: 'अच्छा', ta: 'நல்லது', te: 'మంచిది', bn: 'ভালো', kn: 'ಒಳ್ಳೆಯದು', gu: 'સારું' }, pct: '60-79%', examples: { en: 'Kumara + Swapna + Swastha + Garvita + Prakasha', hi: 'कुमार + स्वप्न + स्वस्थ + गर्वित + प्रकाश', sa: 'कुमार + स्वप्न + स्वस्थ + गर्वित + प्रकाश', mai: 'कुमार + स्वप्न + स्वस्थ + गर्वित + प्रकाश', mr: 'कुमार + स्वप्न + स्वस्थ + गर्वित + प्रकाश', ta: 'Kumara + Swapna + Swastha + Garvita + Prakasha', te: 'Kumara + Swapna + Swastha + Garvita + Prakasha', bn: 'Kumara + Swapna + Swastha + Garvita + Prakasha', kn: 'Kumara + Swapna + Swastha + Garvita + Prakasha', gu: 'Kumara + Swapna + Swastha + Garvita + Prakasha' }, desc: { en: 'Strong results with some effort required. The planet is well-positioned but not at its absolute peak.', hi: 'कुछ प्रयास से मजबूत फल। ग्रह अच्छी स्थिति में पर पूर्ण चरम पर नहीं।', sa: 'कुछ प्रयास से मजबूत फल। ग्रह अच्छी स्थिति में पर पूर्ण चरम पर नहीं।', mai: 'कुछ प्रयास से मजबूत फल। ग्रह अच्छी स्थिति में पर पूर्ण चरम पर नहीं।', mr: 'कुछ प्रयास से मजबूत फल। ग्रह अच्छी स्थिति में पर पूर्ण चरम पर नहीं।', ta: 'Strong results with some effort required. The planet is well-positioned but not at its absolute peak.', te: 'Strong results with some effort required. The planet is well-positioned but not at its absolute peak.', bn: 'Strong results with some effort required. The planet is well-positioned but not at its absolute peak.', kn: 'Strong results with some effort required. The planet is well-positioned but not at its absolute peak.', gu: 'Strong results with some effort required. The planet is well-positioned but not at its absolute peak.' }, color: 'border-blue-500/20' },
            { tier: { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रित', mai: 'मिश्रित', mr: 'मिश्रित', ta: 'கலப்பு', te: 'మిశ్రమం', bn: 'মিশ্র', kn: 'ಮಿಶ್ರ', gu: 'મિશ્ર' }, pct: '40-59%', examples: { en: 'Bala/Vriddha + Shanta + Upavesha/Netrapani', hi: 'बाल/वृद्ध + शान्त + उपवेश/नेत्रपाणि', sa: 'बाल/वृद्ध + शान्त + उपवेश/नेत्रपाणि', mai: 'बाल/वृद्ध + शान्त + उपवेश/नेत्रपाणि', mr: 'बाल/वृद्ध + शान्त + उपवेश/नेत्रपाणि', ta: 'Bala/Vriddha + Shanta + Upavesha/Netrapani', te: 'Bala/Vriddha + Shanta + Upavesha/Netrapani', bn: 'Bala/Vriddha + Shanta + Upavesha/Netrapani', kn: 'Bala/Vriddha + Shanta + Upavesha/Netrapani', gu: 'Bala/Vriddha + Shanta + Upavesha/Netrapani' }, desc: { en: 'Average results — the planet functions but without distinction. Some areas work, others don\'t.', hi: 'औसत फल — ग्रह कार्य करता है पर बिना विशिष्टता। कुछ क्षेत्र काम करते हैं, कुछ नहीं।' }, color: 'border-amber-500/20' },
            { tier: { en: 'Weak', hi: 'दुर्बल', sa: 'दुर्बल', mai: 'दुर्बल', mr: 'दुर्बल', ta: 'பலவீனம்', te: 'బలహీనం', bn: 'দুর্বল', kn: 'ದುರ್ಬಲ', gu: 'નબળું' }, pct: '20-39%', examples: { en: 'Vikala + Kshudhita/Trushita + Shayana', hi: 'विकल + क्षुधित/तृषित + शयन', sa: 'विकल + क्षुधित/तृषित + शयन', mai: 'विकल + क्षुधित/तृषित + शयन', mr: 'विकल + क्षुधित/तृषित + शयन', ta: 'Vikala + Kshudhita/Trushita + Shayana', te: 'Vikala + Kshudhita/Trushita + Shayana', bn: 'Vikala + Kshudhita/Trushita + Shayana', kn: 'Vikala + Kshudhita/Trushita + Shayana', gu: 'Vikala + Kshudhita/Trushita + Shayana' }, desc: { en: 'Compromised results — the planet struggles to deliver. Remedies strongly recommended.', hi: 'प्रभावित फल — ग्रह फल देने में संघर्ष। उपचार दृढ़ता से अनुशंसित।', sa: 'प्रभावित फल — ग्रह फल देने में संघर्ष। उपचार दृढ़ता से अनुशंसित।', mai: 'प्रभावित फल — ग्रह फल देने में संघर्ष। उपचार दृढ़ता से अनुशंसित।', mr: 'प्रभावित फल — ग्रह फल देने में संघर्ष। उपचार दृढ़ता से अनुशंसित।', ta: 'Compromised results — the planet struggles to deliver. Remedies strongly recommended.', te: 'Compromised results — the planet struggles to deliver. Remedies strongly recommended.', bn: 'Compromised results — the planet struggles to deliver. Remedies strongly recommended.', kn: 'Compromised results — the planet struggles to deliver. Remedies strongly recommended.', gu: 'Compromised results — the planet struggles to deliver. Remedies strongly recommended.' }, color: 'border-red-500/20' },
            { tier: { en: 'Denied', hi: 'निषेध', sa: 'निषेध', mai: 'निषेध', mr: 'निषेध', ta: 'மறுக்கப்பட்டது', te: 'నిరాకరించబడింది', bn: 'প্রত্যাখ্যাত', kn: 'ನಿರಾಕರಿಸಲಾಗಿದೆ', gu: 'નકારવામાં' }, pct: '0-19%', examples: { en: 'Mrita + Sushupti + Khala + Kshobhita', hi: 'मृत + सुषुप्ति + खल + क्षोभित', sa: 'मृत + सुषुप्ति + खल + क्षोभित', mai: 'मृत + सुषुप्ति + खल + क्षोभित', mr: 'मृत + सुषुप्ति + खल + क्षोभित', ta: 'Mrita + Sushupti + Khala + Kshobhita', te: 'Mrita + Sushupti + Khala + Kshobhita', bn: 'Mrita + Sushupti + Khala + Kshobhita', kn: 'Mrita + Sushupti + Khala + Kshobhita', gu: 'Mrita + Sushupti + Khala + Kshobhita' }, desc: { en: 'Severely blocked — the planet\'s significations are suppressed or reversed. Intense remedies and patience required.', hi: 'गम्भीर रूप से अवरुद्ध — ग्रह के कारकत्व दबे या विपरीत। तीव्र उपचार और धैर्य आवश्यक।' }, color: 'border-red-500/30' },
          ].map((tier, i) => (
            <div key={i} className={`p-4 rounded-xl border ${tier.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">{lt(tier.tier as LocaleText, locale)}</span>
                <span className="font-mono text-xs opacity-70">{tier.pct}</span>
              </div>
              <div className="text-text-tertiary text-xs uppercase tracking-widest mb-1">{isHi ? 'उदाहरण' : 'Examples'}: {lt(tier.examples as LocaleText, locale)}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{lt(tier.desc as LocaleText, locale)}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ Synthesis ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('synthesisTitle')}</h2>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
          <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'उदाहरण: बलवान गुरु' : 'Example: Strong Jupiter'}</div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('synthesisP1')}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
          <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'उदाहरण: दुर्बल शुक्र' : 'Example: Weak Venus'}</div>
          <p className="text-text-secondary text-sm leading-relaxed">{t('synthesisP2')}</p>
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं', sa: 'कुण्डली बनाएं', mai: 'कुण्डली बनाएं', mr: 'कुण्डली बनाएं', ta: 'குண்டலி உருவாக்கு', te: 'కుండలి తయారు చేయండి', bn: 'কুণ্ডলী তৈরি করুন', kn: 'ಕುಂಡಲಿ ತಯಾರಿಸಿ', gu: 'કુંડળી બનાવો' } },
            { href: '/learn/modules/18-4', label: { en: 'Module 18-4: Avasthas Deep Dive', hi: 'मॉड्यूल 18-4: अवस्था विस्तार', sa: 'मॉड्यूल 18-4: अवस्था विस्तार', mai: 'मॉड्यूल 18-4: अवस्था विस्तार', mr: 'मॉड्यूल 18-4: अवस्था विस्तार', ta: 'தொகுதி 18-4: அவஸ்தைகள் ஆழ ஆய்வு', te: 'మాడ్యూల్ 18-4: అవస్థల లోతైన అధ్యయనం', bn: 'মডিউল ১৮-৪: অবস্থা গভীর অধ্যয়ন', kn: 'ಮಾಡ್ಯೂಲ್ 18-4: ಅವಸ್ಥೆಗಳ ಆಳ ಅಧ್ಯಯನ', gu: 'મોડ્યુલ 18-4: અવસ્થા ઊંડાણ અભ્યાસ' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala (Planet Strength)', hi: 'षड्बल (ग्रह शक्ति)', sa: 'षड्बल (ग्रह शक्ति)', mai: 'षड्बल (ग्रह शक्ति)', mr: 'षड्बल (ग्रह शक्ति)', ta: 'ஷட்பலம் (கிரக வலிமை)', te: 'షడ్బల (గ్రహ బలం)', bn: 'ষড়বল (গ্রহ বল)', kn: 'ಷಡ್ಬಲ (ಗ್ರಹ ಶಕ್ತಿ)', gu: 'ષડ્બલ (ગ્રહ બળ)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {lt(link.label as LocaleText, locale)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

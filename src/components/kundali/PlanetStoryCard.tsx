'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { getPlanetDignity, type DignityState } from '@/lib/tippanni/dignity';
import { getPlanetAspects } from '@/lib/kundali/graha-drishti';
import { HOUSE_MEANINGS } from '@/lib/i18n/house-meanings';
import { pickByScript } from '@/lib/utils/locale-fonts';
import type { KundaliData, PlanetPosition } from '@/types/kundali';

interface Props {
  planetId: number;
  kundali: KundaliData;
  locale: string;
  onClose: () => void;
}

const DIGNITY_CHIP: Record<DignityState | 'parama-ucha', { color: string; en: string; hi: string }> = {
  'parama-ucha':  { color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',     en: 'Peak exaltation', hi: 'परम उच्च' },
  exalted:        { color: 'bg-amber-500/15 text-amber-200 border-amber-500/30',     en: 'Exalted',         hi: 'उच्च' },
  moolatrikona:   { color: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30',  en: 'Moolatrikona',    hi: 'मूलत्रिकोण' },
  own:            { color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', en: 'Own sign',        hi: 'स्वगृह' },
  friendly:       { color: 'bg-green-500/10 text-green-300 border-green-500/20',     en: 'Friendly sign',   hi: 'मित्र राशि' },
  neutral:        { color: 'bg-white/5 text-text-secondary border-white/10',          en: 'Neutral',         hi: 'सम' },
  enemy:          { color: 'bg-orange-500/10 text-orange-300 border-orange-500/30',  en: 'Enemy sign',      hi: 'शत्रु राशि' },
  debilitated:    { color: 'bg-red-500/15 text-red-300 border-red-500/40',           en: 'Debilitated',     hi: 'नीच' },
};

const DIGNITY_NARRATIVE: Record<DignityState | 'parama-ucha', { en: string; hi: string }> = {
  'parama-ucha':  { en: 'At its exact degree of greatest joy. Pure, undiluted strength.',         hi: 'अपनी सर्वोच्च उच्चता पर। शुद्ध बल।' },
  exalted:        { en: 'In its favourite sign. Strong, confident, expressive.',                   hi: 'अपनी प्रिय राशि में। बलवान, आत्मविश्वासी।' },
  moolatrikona:   { en: 'In its seat of office. Pure quality, formal authority.',                  hi: 'अपने मूल त्रिकोण में। शुद्ध गुण, औपचारिक अधिकार।' },
  own:            { en: 'In a sign it rules. Comfortable, productive, at home.',                   hi: 'अपनी ही राशि में। सहज, उत्पादक, घर पर।' },
  friendly:       { en: 'In friendly territory. Supportive backdrop, easy expression.',            hi: 'मित्र राशि में। सहयोगी पृष्ठभूमि।' },
  neutral:        { en: 'In neutral territory. Neither helped nor hindered by the sign lord.',     hi: 'सम राशि में। न मदद, न बाधा।' },
  enemy:          { en: 'In enemy territory. Has to work harder; effort over flow.',               hi: 'शत्रु राशि में। प्रयास से फल।' },
  debilitated:    { en: 'In its sign of greatest discomfort. Themes feel awkward, untrained.',      hi: 'अपनी नीच राशि में। विषय कठिन, अप्रशिक्षित।' },
};

function pad2(n: number): string { return n < 10 ? '0' + n : '' + n; }

/**
 * Convert ecliptic longitude to D°M'S" inside the sign — same convention
 * the PlanetPosition.degree string uses, but we sometimes need to re-derive
 * for the Pada calculation. Kept local; not worth adding to a utility.
 */
function formatDegreeInSign(longitude: number): string {
  const deg = longitude % 30;
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  return `${pad2(d)}°${pad2(m)}'`;
}

export default function PlanetStoryCard({ planetId, kundali, locale, onClose }: Props) {
  const planet = useMemo<PlanetPosition | undefined>(
    () => kundali.planets.find(p => p.planet.id === planetId),
    [planetId, kundali.planets],
  );

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!planet) return null;

  const graha = GRAHAS.find(g => g.id === planetId);
  const grahaName = graha ? tl(graha.name, locale) : 'Planet';
  const grahaSymbol = graha?.symbol ?? '◇';
  const grahaColor = graha?.color ?? '#d4a853';

  const sign = planet.sign; // 1-12
  const signName = tl(planet.signName, locale);

  const nakshatra = NAKSHATRAS.find(n => n.id === planet.nakshatra.id);
  const nakshatraName = nakshatra ? tl(nakshatra.name, locale) : '';
  const nakRulerName = nakshatra ? tl(nakshatra.rulerName, locale) : '';

  const dignity: DignityState | 'parama-ucha' =
    planetId <= 6
      ? getPlanetDignity(planetId, sign, planet.longitude % 30)
      : 'neutral';
  const dignityInfo = DIGNITY_CHIP[dignity];
  const dignityNarrative = DIGNITY_NARRATIVE[dignity];

  // Houses this planet aspects (drishti). Sun/Moon/Mercury/Venus only have
  // the universal 7th; Mars/Jupiter/Saturn/Rahu/Ketu have their specials.
  const aspectedHouses = useMemo(
    () => getPlanetAspects(planetId, planet.house),
    [planetId, planet.house],
  );

  // Who aspects THIS planet? Walk all other planets, compute their aspect
  // set, check if the current planet's house lands in it.
  const aspectedBy = useMemo(() => {
    return kundali.planets
      .filter(p => p.planet.id !== planetId)
      .filter(p => getPlanetAspects(p.planet.id, p.house).includes(planet.house))
      .map(p => p.planet.id);
  }, [kundali.planets, planetId, planet.house]);

  // Shadbala — `kundali.shadbala[i].totalStrength` is `strengthRatio × 50`
  // where strengthRatio = rupas / minRequiredRupas (kundali-calc.ts:1248).
  // So 50 ≈ "meets BPHS minimum" and 100 ≈ "twice the minimum". Display
  // as 0-100% (clamped) — 50% is the canonical passing mark.
  const shadbala = kundali.shadbala.find(s => s.planet === graha?.name.en);
  const shadbalaPct = shadbala
    ? Math.max(0, Math.min(100, shadbala.totalStrength))
    : null;

  const house = planet.house;
  const houseMeaning = HOUSE_MEANINGS[house - 1];
  const houseLong = houseMeaning?.longName[locale] ?? houseMeaning?.longName.en ?? '';

  // Flag chips — only render those that apply
  const flags: Array<{ label: string; tone: 'amber' | 'red' | 'emerald' | 'blue' | 'purple' }> = [];
  if (planet.isRetrograde)        flags.push({ label: pickByScript('Retrograde',      'वक्री',          locale), tone: 'amber' });
  if (planet.isCombust)           flags.push({ label: pickByScript('Combust',         'अस्त',           locale), tone: 'red' });
  if (planet.isVargottama)        flags.push({ label: pickByScript('Vargottama',      'वर्गोत्तम',       locale), tone: 'emerald' });
  if (planet.isPushkarNavamsha)   flags.push({ label: pickByScript('Pushkar Navamsha','पुष्कर नवांश',   locale), tone: 'blue' });
  if (planet.isPushkarBhaga)      flags.push({ label: pickByScript('Pushkar Bhaga',   'पुष्कर भाग',     locale), tone: 'blue' });
  if (planet.isMrityuBhaga)       flags.push({ label: pickByScript('Mrityu Bhaga',    'मृत्यु भाग',     locale), tone: 'red' });

  const flagToneClass: Record<typeof flags[number]['tone'], string> = {
    amber:   'bg-amber-500/15 text-amber-300 border-amber-500/30',
    red:     'bg-red-500/15 text-red-300 border-red-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    blue:    'bg-blue-500/15 text-blue-300 border-blue-500/30',
    purple:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };

  return (
    <AnimatePresence>
      <>
        {/* Click-catcher — closes the card when the user clicks anywhere
            outside it. Transparent so the chart underneath stays fully
            visible (planet selection drives the drishti animation on the
            chart, and the user needs to see that while reading the panel).
            Plain `<div>` instead of `motion.div`: opacity-fade animation
            is a no-op on a transparent element. */}
        <div
          onClick={onClose}
          className="fixed inset-0 z-40"
          aria-hidden="true"
        />

        {/* Card — slides up from bottom on mobile, in from right on desktop */}
        <motion.aside
          key="planet-card-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="planet-card-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="fixed z-50 inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto sm:top-0 sm:w-[420px] sm:h-full overflow-y-auto bg-gradient-to-br from-[#2d1b69]/95 via-[#1a1040]/95 to-[#0a0e27]/98 border-t sm:border-t-0 sm:border-l border-gold-primary/30 rounded-t-2xl sm:rounded-none p-5 sm:p-6"
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label={pickByScript('Close', 'बंद करें', locale)}
            className="absolute top-3 right-3 p-1.5 rounded-full text-text-secondary hover:text-gold-light hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-3xl leading-none"
              style={{ color: grahaColor }}
              aria-hidden="true"
            >
              {grahaSymbol}
            </span>
            <div>
              <h3 id="planet-card-title" className="text-gold-light text-xl font-semibold">
                {grahaName}
              </h3>
              <p className="text-text-secondary text-xs">
                {signName} · {formatDegreeInSign(planet.longitude)} · {pickByScript('House', 'भाव', locale)} {house}
              </p>
            </div>
          </div>

          {/* Flag chips */}
          {flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {flags.map((f, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${flagToneClass[f.tone]}`}
                >
                  {f.label}
                </span>
              ))}
            </div>
          )}

          {/* House area */}
          <Section title={pickByScript('Life area', 'जीवन क्षेत्र', locale)}>
            <p className="text-text-primary text-sm">
              {pickByScript('House', 'भाव', locale)} {house}
              {houseLong && <span className="text-text-secondary"> — {houseLong}</span>}
            </p>
          </Section>

          {/* Nakshatra */}
          {nakshatraName && (
            <Section title={pickByScript('Nakshatra', 'नक्षत्र', locale)}>
              <p className="text-text-primary text-sm">
                {nakshatraName} · {pickByScript('Pada', 'पाद', locale)} {planet.pada}
              </p>
              {nakRulerName && (
                <p className="text-text-secondary text-xs mt-0.5">
                  {pickByScript('Ruled by', 'स्वामी', locale)} {nakRulerName}
                </p>
              )}
            </Section>
          )}

          {/* Dignity */}
          {planetId <= 6 && (
            <Section title={pickByScript('Dignity', 'अवस्था', locale)}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${dignityInfo.color}`}>
                  {pickByScript(dignityInfo.en, dignityInfo.hi, locale)}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">
                {pickByScript(dignityNarrative.en, dignityNarrative.hi, locale)}
              </p>
            </Section>
          )}

          {/* Shadbala bar */}
          {shadbalaPct !== null && (
            <Section title={pickByScript('Six-fold strength (Shadbala)', 'षड्बल', locale)}>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light"
                    style={{ width: `${shadbalaPct}%` }}
                  />
                </div>
                <span className="text-gold-light text-xs font-medium tabular-nums">
                  {shadbalaPct}%
                </span>
              </div>
              <p className="text-text-secondary/70 text-[10px] mt-1">
                {pickByScript('50% meets BPHS minimum', '५०% न्यूनतम बल', locale)}
              </p>
            </Section>
          )}

          {/* Aspects out (what this planet sees) */}
          <Section title={pickByScript('Aspects', 'दृष्टि', locale)}>
            <p className="text-text-primary text-sm">
              {pickByScript('Sees houses', 'दृष्टि भाव', locale)}:{' '}
              <span className="text-gold-light font-medium">
                {aspectedHouses.sort((a, b) => a - b).join(', ')}
              </span>
            </p>
            {aspectedBy.length > 0 && (
              <p className="text-text-secondary text-xs mt-1.5">
                {pickByScript('Aspected by', 'द्वारा देखा गया', locale)}:{' '}
                {aspectedBy
                  .map(id => {
                    const g = GRAHAS.find(gr => gr.id === id);
                    return g ? tl(g.name, locale) : '?';
                  })
                  .join(', ')}
              </p>
            )}
          </Section>
        </motion.aside>
      </>
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 pb-3 border-b border-gold-primary/10 last:border-b-0">
      <h4 className="text-gold-dark text-[10px] uppercase tracking-wider font-semibold mb-1.5">
        {title}
      </h4>
      {children}
    </div>
  );
}

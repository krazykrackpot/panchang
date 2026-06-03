'use client';

import { useRef, useEffect } from 'react';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import type { KundaliData } from '@/types/kundali';
import ArchetypeIcon from '@/components/icons/ArchetypeIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RASHI_ARCHETYPES } from '@/lib/constants/rashi-archetypes';
import { NAKSHATRA_ARCHETYPES } from '@/lib/constants/nakshatra-archetypes';
import { GRAHAS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import { computeAtmakaraka, getSoulArchetype } from '@/lib/kundali/atmakaraka';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';
import ChartHeadline from './ChartHeadline';

interface Props {
  blueprint: CosmicBlueprint;
  kundali: KundaliData;
  locale: string;
  /** Optional. When provided, the 4-tile vital-sign strip renders below
   *  the archetype description (Strongest Domain · Current Period ·
   *  Top Yoga · Watch-Out). Kept optional so existing callers that only
   *  pass blueprint+kundali continue to work without changes. */
  personalReading?: PersonalReading | null;
}

// Labels for the four faces. Section now hosts Mask + Heart + Star
// + Soul (Atmakaraka added to give the classical Jaimini soul anchor
// alongside the existing Lagna/Moon-sign/Moon-nakshatra trio).
const LABELS = {
  mask:  { en: 'Your Mask', hi: 'आपका मुखौटा', sa: 'तव मुखावरणम्' },
  heart: { en: 'Your Heart', hi: 'आपका हृदय', sa: 'तव हृदयम्' },
  star:  { en: 'Your Star', hi: 'आपका नक्षत्र', sa: 'तव नक्षत्रम्' },
  soul:  { en: 'Your Soul', hi: 'आपकी आत्मा', sa: 'तव आत्मा' },
  rising: { en: 'Rising', hi: 'लग्न', sa: 'लग्नम्' },
  moon:   { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  atmakaraka: { en: 'Atmakaraka', hi: 'आत्मकारक', sa: 'आत्मकारकः' },
  fourFaces: { en: 'Your Four Faces', hi: 'आपके चार रूप', sa: 'तव चत्वारि रूपाणि' },
} as const;

const STAR_DIVIDER = '✦ · · ✦ · · ✦';

export default function CosmicIdentityCard({ blueprint, kundali, locale, personalReading = null }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Moon planet data
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moonPlanet?.sign ?? 1;
  const moonNakshatraId = moonPlanet?.nakshatra.id ?? 1;
  const ascendantSign = kundali.ascendant.sign;

  // Archetype lookups
  const risingArchetype = RASHI_ARCHETYPES.find(r => r.rashiId === ascendantSign);
  const moonArchetype = RASHI_ARCHETYPES.find(r => r.rashiId === moonSign);
  const nakshatraArchetype = NAKSHATRA_ARCHETYPES.find(n => n.nakshatraId === moonNakshatraId);

  // Sign/Nakshatra names from kundali data
  const ascendantName = tl(kundali.ascendant.signName, locale);
  const moonSignName = moonPlanet ? tl(moonPlanet.signName, locale) : '';
  const moonNakshatraName = moonPlanet ? tl(moonPlanet.nakshatra.name, locale) : '';

  // Atmakaraka — Jaimini soul significator (planet at highest deg in
  // own sign among Sun–Saturn). Falls back to Sun (id 0) if planets
  // missing — preserves the 4-face layout in that edge case.
  const atmakarakaId = computeAtmakaraka(kundali.planets) ?? 0;
  const atmakarakaPlanet = kundali.planets.find((p) => p.planet.id === atmakarakaId);
  const atmakarakaPlanetName = atmakarakaPlanet
    ? tl(atmakarakaPlanet.planet.name, locale)
    : tl(GRAHAS[atmakarakaId].name, locale);
  const soulArchetype = getSoulArchetype(atmakarakaId);

  // Scroll to centre card (Moon) on mobile mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Only auto-scroll on small screens
    if (window.innerWidth >= 640) return;
    const centreCard = el.children[1] as HTMLElement | undefined;
    if (centreCard) {
      // scrollIntoView can be janky; use scrollLeft for precise centering
      const scrollLeft = centreCard.offsetLeft - (el.clientWidth - centreCard.clientWidth) / 2;
      el.scrollTo({ left: scrollLeft, behavior: 'instant' });
    }
  }, []);

  const devanagariStyle = locale === 'hi' || locale === 'sa'
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : undefined;

  const oneLinePick = (en: string, hi: string) =>
    locale === 'hi' || locale === 'sa' ? hi : en;

  // Three faces data
  const faces = [
    {
      label: tl(LABELS.mask, locale),
      sublabel: tl(LABELS.rising, locale),
      icon: <RashiIconById id={ascendantSign} size={64} />,
      name: ascendantName,
      archetype: risingArchetype?.archetype ?? '',
      oneLiner: risingArchetype
        ? oneLinePick(risingArchetype.oneLineEn, risingArchetype.oneLineHi)
        : '',
      glowColor: risingArchetype?.glowColor ?? '#ef4444',
      elevated: false,
    },
    {
      label: tl(LABELS.heart, locale),
      sublabel: tl(LABELS.moon, locale),
      icon: <RashiIconById id={moonSign} size={64} />,
      name: moonSignName,
      archetype: moonArchetype?.archetype ?? '',
      oneLiner: moonArchetype
        ? oneLinePick(moonArchetype.oneLineEn, moonArchetype.oneLineHi)
        : '',
      glowColor: moonArchetype?.glowColor ?? '#22c55e',
      elevated: true,
    },
    {
      label: tl(LABELS.star, locale),
      sublabel: tl(LABELS.nakshatra, locale),
      icon: <NakshatraIconById id={moonNakshatraId} size={64} />,
      name: moonNakshatraName,
      archetype: nakshatraArchetype?.archetype ?? '',
      oneLiner: nakshatraArchetype
        ? oneLinePick(nakshatraArchetype.oneLineEn, nakshatraArchetype.oneLineHi)
        : '',
      glowColor: '#d4a853', // Nakshatra archetypes don't have glowColor — gold is always correct
      elevated: false,
    },
    {
      // Soul (Atmakaraka) — Jaimini's classical "soul significator".
      // Sits alongside the Lagna/Moon-sign/Moon-nakshatra trio to give
      // the user an answer to "what is my soul here to learn?" that
      // doesn't compete with the Shadbala-driven archetype-engine
      // headline (which answers a different question: "which planet
      // dominates by raw strength right now?").
      label: tl(LABELS.soul, locale),
      sublabel: tl(LABELS.atmakaraka, locale),
      icon: <GrahaIconById id={atmakarakaId} size={64} />,
      name: atmakarakaPlanetName,
      archetype: tl(soulArchetype.name, locale),
      oneLiner: tl(soulArchetype.oneLiner, locale),
      glowColor: soulArchetype.glowColor,
      elevated: false,
    },
  ];

  return (
    <section className="space-y-8">
      {/* ── Section 1: Synthesis Hero Card ── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-gold-primary/30
          bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
          p-6 sm:p-8 text-center"
      >
        {/* Radial glow behind icon */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2
            h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d4a853 0%, transparent 70%)' }}
        />

        {/* Person's name + birth details */}
        {kundali.birthData.name && (
          <p className="text-text-primary text-lg font-semibold mb-1" style={devanagariStyle}>
            {kundali.birthData.name}
          </p>
        )}
        <p className="text-text-secondary text-xs mb-4">
          {kundali.birthData.date} · {kundali.birthData.time} · {kundali.birthData.place}
        </p>

        {/* Archetype Icon */}
        <div className="relative mx-auto mb-4 flex justify-center">
          <ArchetypeIcon archetype={blueprint.primary.archetype} size={128} />
        </div>

        {/* Archetype Name */}
        <h2
          className="text-3xl font-bold text-gold-light mb-2"
          style={devanagariStyle}
        >
          {tl(blueprint.primary.name, locale)}
        </h2>

        {/* Rising / Moon / Star summary line */}
        <p className="text-text-secondary text-sm mb-4">
          {tl(LABELS.rising, locale)}: {ascendantName} · {tl(LABELS.moon, locale)}: {moonSignName} · {tl(LABELS.star, locale)}: {moonNakshatraName}
        </p>

        {/* Poetic description — archetype engine produces English only,
            so for non-English locales show traits list instead */}
        <p className="text-text-primary text-sm leading-relaxed italic max-w-xl mx-auto mb-3">
          {blueprint.primary.description}
        </p>

        {/* Traits */}
        <p className="text-text-secondary text-xs mb-3">
          {blueprint.primary.traits.join(' · ')}
        </p>

        {/* Vital-sign tiles — 4 at-a-glance data points under the
            archetype block (Strongest Domain · Current Period · Top
            Yoga · Watch-Out). Renders only when personalReading is
            available; otherwise this slot collapses. */}
        <ChartHeadline blueprint={blueprint} personalReading={personalReading} locale={locale} />
      </div>

      {/* ── Section 2: Four Faces (Mask · Heart · Star · Soul) ── */}
      <div className="text-center mb-2">
        <h3
          className="text-xl font-bold text-gold-light"
          style={devanagariStyle}
        >
          {tl(LABELS.fourFaces, locale)}
        </h3>
      </div>

      {/* Desktop: equal-width row filling container. Mobile: horizontal scroll with snap. */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5
          overflow-x-auto snap-x snap-mandatory pb-2
          sm:overflow-x-visible sm:snap-none
          scrollbar-hide"
      >
        {faces.map((face) => (
          <div
            key={face.label}
            className={`
              snap-center flex-shrink-0
              min-w-[200px] w-[220px]
              sm:w-auto sm:flex-1
              rounded-xl border border-gold-primary/20
              bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]
              p-5 text-center
              transition-all duration-300 hover:border-gold-primary/40
              ${face.elevated ? 'sm:-translate-y-2' : ''}
            `}
          >
            {/* Label */}
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
              {face.sublabel}
            </p>
            <p
              className="text-gold-primary text-lg font-semibold mb-2"
              style={devanagariStyle}
            >
              {face.label}
            </p>

            {/* Star divider */}
            <p className="text-gold-dark text-xs mb-3 select-none" aria-hidden="true">
              {STAR_DIVIDER}
            </p>

            {/* Icon with glow */}
            <div className="relative mx-auto mb-3 flex justify-center">
              <div
                className="pointer-events-none absolute inset-0 m-auto h-16 w-16 rounded-full opacity-25 blur-xl"
                style={{ backgroundColor: face.glowColor }}
              />
              <div className="relative">{face.icon}</div>
            </div>

            {/* Sign / Nakshatra name */}
            <p
              className="text-gold-light text-lg font-semibold mb-1"
              style={devanagariStyle}
            >
              {face.name}
            </p>

            {/* Archetype sub-name */}
            <p className="text-gold-primary text-sm font-medium mb-2">
              {face.archetype}
            </p>

            {/* One-liner */}
            <p className="text-text-primary/80 italic text-xs leading-relaxed">
              {face.oneLiner}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

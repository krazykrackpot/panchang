'use client';

import { useRef, useEffect } from 'react';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import type { KundaliData } from '@/types/kundali';
import ArchetypeIcon from '@/components/icons/ArchetypeIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { RASHI_ARCHETYPES } from '@/lib/constants/rashi-archetypes';
import { NAKSHATRA_ARCHETYPES } from '@/lib/constants/nakshatra-archetypes';
import { tl } from '@/lib/utils/trilingual';

interface Props {
  blueprint: CosmicBlueprint;
  kundali: KundaliData;
  locale: string;
}

// Labels for the three faces
const LABELS = {
  mask:  { en: 'Your Mask', hi: 'आपका मुखौटा', sa: 'तव मुखावरणम्' },
  heart: { en: 'Your Heart', hi: 'आपका हृदय', sa: 'तव हृदयम्' },
  star:  { en: 'Your Star', hi: 'आपका नक्षत्र', sa: 'तव नक्षत्रम्' },
  rising: { en: 'Rising', hi: 'लग्न', sa: 'लग्नम्' },
  moon:   { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  threeFaces: { en: 'Your Three Faces', hi: 'आपके तीन रूप', sa: 'तव त्रीणि रूपाणि' },
} as const;

const STAR_DIVIDER = '✦ · · ✦ · · ✦';

export default function CosmicIdentityCard({ blueprint, kundali, locale }: Props) {
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
      glowColor: '#ef4444',
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
      glowColor: '#22c55e',
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
      glowColor: '#d4a853',
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

        {/* Poetic description */}
        <p className="text-text-primary text-sm leading-relaxed italic max-w-xl mx-auto mb-3">
          {blueprint.primary.description}
        </p>

        {/* Headline */}
        <p className="text-gold-primary text-base font-semibold">
          {blueprint.headline}
        </p>
      </div>

      {/* ── Section 2: Three Faces ── */}
      <div className="text-center mb-2">
        <h3
          className="text-xl font-bold text-gold-light"
          style={devanagariStyle}
        >
          {tl(LABELS.threeFaces, locale)}
        </h3>
      </div>

      {/* Desktop: flex row. Mobile: horizontal scroll with snap. */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 sm:justify-center
          overflow-x-auto snap-x snap-mandatory pb-2
          scrollbar-none"
      >
        {faces.map((face) => (
          <div
            key={face.label}
            className={`
              snap-center flex-shrink-0
              min-w-[200px] w-[220px] sm:w-[240px]
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

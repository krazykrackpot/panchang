# Transits Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat transit event list with a visual dashboard: sky-map-inspired hero card + horizontal swimlane timeline (desktop) / vertical timeline (mobile).

**Architecture:** Single-file modification to `src/app/[locale]/transits/page.tsx`. The hero card uses an inline SVG zodiac wheel matching `LiveSkyMap.tsx` visual language. The swimlane uses CSS flex for proportional bar widths. Both views derive from the existing `TransitEvent[]` API data — no backend changes.

**Tech Stack:** Next.js App Router, React, Framer Motion, SVG, CSS flex, existing `GrahaIconById` / `RashiIconById` icon components.

**Spec:** `docs/superpowers/specs/2026-04-29-transits-page-redesign.md`

---

### Task 1: Add swimlane bar computation utility

**Files:**
- Modify: `src/app/[locale]/transits/page.tsx` (add after line ~36, before the component function)

This utility transforms the flat `TransitEvent[]` array into per-planet bar segments for the swimlane.

- [ ] **Step 1: Add the `SwimlanePlanetBar` interface and `buildSwimlaneBars` function**

Add after the `PLANET_NAMES_HI` constant (line ~36):

```tsx
// ─── Swimlane bar computation ───

/** Planet colors matching LiveSkyMap.tsx palette */
const PLANET_COLORS: Record<number, string> = {
  0: '#FF9500', 1: '#C0C0C0', 2: '#DC143C', 3: '#50C878',
  4: '#FFD700', 5: '#FF69B4', 6: '#6B8DD6', 7: '#B8860B', 8: '#808080',
};

const PLANET_SHORT: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

/** Planets shown in the swimlane (exclude Sun=0 and Moon=1 — they change signs every 1-2.5 days) */
const SWIMLANE_PLANET_IDS = [4, 6, 7, 8, 2, 5, 3]; // Jupiter, Saturn, Rahu, Ketu, Mars, Venus, Mercury
const SLOW_PLANET_IDS = new Set([4, 6, 7, 8]); // tall rows

interface SwimlanePlanetBar {
  signId: number;
  signName: LocaleText;
  /** Flex proportion (0-12 scale, representing months) */
  flex: number;
  /** Start date ISO string */
  startDate: string;
  /** End date ISO string */
  endDate: string;
  isRetrograde: boolean;
}

interface SwimlanePlanet {
  planetId: number;
  planetName: LocaleText;
  color: string;
  bars: SwimlanePlanetBar[];
  isSlow: boolean;
}

/** One-line house effect descriptions for personal insight */
const HOUSE_EFFECTS: Record<number, string> = {
  1: 'identity and vitality activated',
  2: 'finances and family in focus',
  3: 'communication and courage boosted',
  4: 'home, comfort, and inner peace affected',
  5: 'creativity, children, and speculation activated',
  6: 'health challenges but enemy defeat',
  7: 'relationships and partnerships highlighted',
  8: 'transformation and hidden matters stirred',
  9: 'fortune, dharma, and long journeys favored',
  10: 'career and public standing in focus',
  11: 'gains, social networks, and aspirations grow',
  12: 'expenses, spirituality, and foreign lands active',
};

function buildSwimlaneBars(events: TransitEvent[], year: number): SwimlanePlanet[] {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  return SWIMLANE_PLANET_IDS.map(pid => {
    const planetEvents = events
      .filter(e => e.planetId === pid)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (planetEvents.length === 0) return null;

    const bars: SwimlanePlanetBar[] = [];

    // First bar: Jan 1 → first event date, sign = first event's fromSign
    if (planetEvents[0].date > yearStart) {
      bars.push({
        signId: planetEvents[0].fromSign,
        signName: planetEvents[0].fromSignName,
        flex: daysBetween(yearStart, planetEvents[0].date) / daysInYear(year) * 12,
        startDate: yearStart,
        endDate: planetEvents[0].date,
        isRetrograde: false,
      });
    }

    // Middle bars: each event → next event
    for (let i = 0; i < planetEvents.length; i++) {
      const ev = planetEvents[i];
      const nextDate = i + 1 < planetEvents.length ? planetEvents[i + 1].date : yearEnd;
      bars.push({
        signId: ev.toSign,
        signName: ev.toSignName,
        flex: daysBetween(ev.date, nextDate) / daysInYear(year) * 12,
        startDate: ev.date,
        endDate: nextDate,
        isRetrograde: false,
      });
    }

    return {
      planetId: pid,
      planetName: planetEvents[0].planetName,
      color: PLANET_COLORS[pid] || '#888',
      bars,
      isSlow: SLOW_PLANET_IDS.has(pid),
    };
  }).filter(Boolean) as SwimlanePlanet[];
}

function daysBetween(a: string, b: string): number {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function daysInYear(year: number): number {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
}
```

- [ ] **Step 2: Verify type check passes**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v ".next/"`
Expected: no errors from transits/page.tsx

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/transits/page.tsx
git commit -m "feat(transits): add swimlane bar computation utility"
```

---

### Task 2: Build the hero card with mini zodiac wheel

**Files:**
- Modify: `src/app/[locale]/transits/page.tsx` — replace the "Current Planetary Positions" grid (lines ~256-306) with the new hero card

- [ ] **Step 1: Add the `TransitHeroCard` inline component**

Add this component before the `return (` statement of `TransitsPage` (around line ~200). It receives the data it needs as props from the parent's existing `useMemo` hooks:

```tsx
  // ─── Hero Card: Mini Zodiac Wheel + Info Panel ───
  function TransitHeroCard() {
    const RASHI_ABBR = ['Ari','Tau','Gem','Can','Leo','Vir','Lib','Sco','Sag','Cap','Aqu','Pis'];
    const CX = 200, CY = 200, R_OUTER = 175, R_INNER = 130, R_TRACK = 152;

    function polarToXY(deg: number, r: number) {
      // 0° = top (Aries), clockwise
      const rad = ((deg - 90) * Math.PI) / 180;
      return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
    }

    // Position each planet at the midpoint of its current sign's 30° arc
    const planetDots = currentTransits.map(ct => {
      const midDeg = (ct.sign - 1) * 30 + 15;
      const pos = polarToXY(midDeg, R_TRACK);
      return { ...ct, cx: pos.x, cy: pos.y };
    });

    // Next major transit countdown
    const today = new Date().toISOString().split('T')[0];
    const nextMajor = events.find(e => e.significance === 'major' && e.date > today);
    const daysUntilNext = nextMajor
      ? Math.ceil((new Date(nextMajor.date).getTime() - Date.now()) / 86400000)
      : null;

    // Personal insight: Jupiter's house from birth Moon
    const jupiterInsight = hasBirthData && birthRashi > 0
      ? (() => {
          const jup = currentTransits.find(c => c.planetId === 4);
          if (!jup) return null;
          const house = ((jup.sign - birthRashi + 12) % 12) + 1;
          return { house, effect: HOUSE_EFFECTS[house] || '' };
        })()
      : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Left: Mini zodiac wheel */}
          <a href={`/${locale}/sky-map`} className="flex-shrink-0 w-[240px] h-[240px] md:w-[280px] md:h-[280px] hover:opacity-90 transition-opacity" title="Open Live Sky Map">
            <svg viewBox="0 0 400 400" width="100%" height="100%">
              <defs>
                <radialGradient id="heroGlow">
                  <stop offset="0%" stopColor="#1a1f45" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0a0e27" stopOpacity="0" />
                </radialGradient>
                {/* Planet glow filters */}
                {planetDots.map(p => (
                  <filter key={`gf-${p.planetId}`} id={`hg-${p.planetId}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feComposite in="blur" in2="SourceGraphic" operator="over" />
                  </filter>
                ))}
              </defs>

              {/* Background */}
              <rect width="400" height="400" fill="#0a0e27" rx="16" />
              <circle cx={CX} cy={CY} r="180" fill="url(#heroGlow)" />

              {/* Rashi ring */}
              <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#8a6d2b" strokeOpacity="0.25" strokeWidth="0.8" />
              <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="#8a6d2b" strokeOpacity="0.15" strokeWidth="0.6" />
              <circle cx={CX} cy={CY} r={R_TRACK} fill="none" stroke="#d4a853" strokeOpacity="0.08" strokeWidth="1" />

              {/* 12 divider lines + labels */}
              {RASHI_ABBR.map((name, i) => {
                const startDeg = i * 30;
                const p1 = polarToXY(startDeg, R_INNER);
                const p2 = polarToXY(startDeg, R_OUTER);
                const labelPos = polarToXY(startDeg + 15, (R_INNER + R_OUTER) / 2);
                return (
                  <g key={name}>
                    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#8a6d2b" strokeOpacity="0.2" strokeWidth="0.5" />
                    <text x={labelPos.x} y={labelPos.y + 3} textAnchor="middle" fontSize="9" fill="#d4a853" fillOpacity="0.6" fontWeight="600">{name}</text>
                  </g>
                );
              })}

              {/* Center earth cross */}
              <circle cx={CX} cy={CY} r="18" fill="none" stroke="#d4a853" strokeOpacity="0.2" strokeWidth="0.8" />
              <line x1={CX} y1={CY - 15} x2={CX} y2={CY + 15} stroke="#d4a853" strokeOpacity="0.2" strokeWidth="0.6" />
              <line x1={CX - 15} y1={CY} x2={CX + 15} y2={CY} stroke="#d4a853" strokeOpacity="0.2" strokeWidth="0.6" />

              {/* Planet dots */}
              {planetDots.map(p => (
                <g key={p.planetId} filter={`url(#hg-${p.planetId})`}>
                  <circle cx={p.cx} cy={p.cy} r="12" fill={PLANET_COLORS[p.planetId]} fillOpacity="0.15" />
                  <circle cx={p.cx} cy={p.cy} r="9" fill={PLANET_COLORS[p.planetId]} stroke="#0a0e27" strokeWidth="1.5" />
                  <text x={p.cx} y={p.cy + 3} textAnchor="middle" fontSize="7" fill="#0a0e27" fontWeight="700">
                    {PLANET_SHORT[p.planetId]}
                  </text>
                </g>
              ))}
            </svg>
          </a>

          {/* Right: Info panel */}
          <div className="flex-1 min-w-0 w-full">
            <h2 className="text-lg text-gold-gradient font-bold mb-1 text-center md:text-left" style={headingFont}>
              {msg('currentPlanetaryPositions', locale)}
            </h2>
            <p className="text-text-secondary text-xs mb-4 text-center md:text-left">
              {new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' — Gochara'}
            </p>

            {/* Planet list grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {currentTransits.map(ct => (
                <div key={ct.planetId} className="flex items-center gap-2 px-2.5 py-1.5 bg-bg-primary/30 border border-gold-primary/8 rounded-lg">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PLANET_COLORS[ct.planetId] }} />
                  <span className="text-xs font-semibold text-text-primary truncate" style={headingFont}>{tl(ct.planetName, locale)}</span>
                  <span className="text-xs text-text-secondary ml-auto truncate">{tl(ct.signName, locale)}</span>
                </div>
              ))}
            </div>

            {/* Next major transit countdown */}
            {nextMajor && daysUntilNext !== null && daysUntilNext > 0 && (
              <div className="flex items-center gap-3 bg-gold-primary/6 border border-gold-primary/18 rounded-xl p-3 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-gold-light leading-none">{daysUntilNext}</div>
                  <div className="text-[10px] text-gold-dark font-semibold">{locale === 'hi' ? 'दिन' : 'days'}</div>
                </div>
                <div>
                  <div className="text-[9px] text-text-secondary uppercase tracking-wider">{msg('nextMajorTransit', locale)}</div>
                  <div className="text-sm text-gold-light font-bold">{tl(nextMajor.planetName, locale)} → {tl(nextMajor.toSignName, locale)}</div>
                </div>
              </div>
            )}

            {/* Personal insight */}
            {jupiterInsight && (
              <div className="bg-[#6366f1]/6 border border-[#6366f1]/15 rounded-xl p-3">
                <p className="text-xs text-[#c4b5fd] leading-relaxed">
                  <strong className="text-[#e0d4ff]">
                    {locale === 'hi' ? `गुरु आपके ${jupiterInsight.house}वें भाव में` : `Jupiter in your ${jupiterInsight.house}${jupiterInsight.house === 1 ? 'st' : jupiterInsight.house === 2 ? 'nd' : jupiterInsight.house === 3 ? 'rd' : 'th'} house`}
                  </strong>
                  {' — '}{jupiterInsight.effect}
                </p>
              </div>
            )}

            {/* Jupiter Vedha warning (moved here from below) */}
            {jupiterVedha && (
              <div className="mt-3 rounded-xl bg-amber-500/8 border border-amber-500/25 p-3 flex items-start gap-2">
                <span className="text-amber-400 text-sm mt-0.5">⚠</span>
                <p className="text-text-secondary/80 text-xs leading-relaxed" style={bodyFont}>
                  <span className="text-amber-400 font-bold">{msg('jupiterVedhaActive', locale)}</span>
                  {' '}{locale === 'en'
                    ? `Jupiter in ${jupiterVedha.jupiterSign.en} is Vedha-blocked by Saturn in ${jupiterVedha.saturnSign.en}.`
                    : `${jupiterVedha.jupiterSign.hi} में गुरु को ${jupiterVedha.saturnSign.hi} में शनि का वेध है।`}
                </p>
              </div>
            )}

            {/* Ashtama Shani warning (moved here from below) */}
            {ashtamaShani && (
              <div className="mt-3 rounded-xl bg-red-500/8 border border-red-500/30 p-3 flex items-start gap-2">
                <span className="text-red-400 text-sm mt-0.5">⚠</span>
                <p className="text-text-secondary/80 text-xs leading-relaxed" style={bodyFont}>
                  <span className="text-red-400 font-bold">{msg('ashtamaShaniActive', locale)}</span>
                  {' '}{locale === 'en'
                    ? `Saturn in ${ashtamaShani.saturnSign.en} is 8th from your Moon — intense karmic pressure.`
                    : `शनि ${ashtamaShani.saturnSign.hi} में आपके चन्द्र से 8वें भाव में — गहन कार्मिक दबाव।`}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
```

- [ ] **Step 2: Replace the old current-positions grid**

Delete the old `{/* Current transits summary */}` block (lines ~256-306 in the original, the `motion.div` containing the `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7` and the Vedha/Ashtama warnings below it).

Replace with:

```tsx
      {/* Hero card — current planetary positions */}
      {year === new Date().getFullYear() && currentTransits.length > 0 && (
        <TransitHeroCard />
      )}
```

- [ ] **Step 3: Add the `nextMajorTransit` message key to transits.json**

Check `src/messages/pages/transits.json` for existing keys and add if missing:

```json
"nextMajorTransit": { "en": "Next Major Transit", "hi": "अगला प्रमुख गोचर" }
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:3000/en/transits`. Confirm:
- Zodiac wheel renders with planet dots in correct sign sectors
- Planet list shows all 7 slow planets with sign names
- "Next Major Transit" countdown displays
- Vedha / Ashtama Shani warnings appear in the info panel (if applicable)
- Clicking the wheel navigates to `/en/sky-map`
- Mobile: wheel stacks above info panel

- [ ] **Step 5: Type check + commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v ".next/"
git add src/app/\[locale\]/transits/page.tsx src/messages/pages/transits.json
git commit -m "feat(transits): hero card with mini zodiac wheel + info panel"
```

---

### Task 3: Build the horizontal swimlane (desktop)

**Files:**
- Modify: `src/app/[locale]/transits/page.tsx` — replace the flat event list (lines ~386-465) with the swimlane

- [ ] **Step 1: Add the swimlane data useMemo**

Inside the component function, add after the existing `eventsByMonth` useMemo:

```tsx
  // Swimlane bars for desktop timeline
  const swimlaneData = useMemo(() => buildSwimlaneBars(filteredEvents.length > 0 ? events : [], year), [events, year]);
```

Note: swimlane always shows all events (not filtered) — the filter applies to which bars are highlighted/dimmed.

- [ ] **Step 2: Compute the TODAY line position**

Add after swimlaneData:

```tsx
  // TODAY line position (fraction of year elapsed)
  const todayFraction = useMemo(() => {
    if (year !== new Date().getFullYear()) return null;
    const now = new Date();
    const start = new Date(year, 0, 1);
    return (now.getTime() - start.getTime()) / (daysInYear(year) * 86400000);
  }, [year]);
```

- [ ] **Step 3: Add the desktop swimlane JSX**

Replace the entire `{/* Content */}` section (the `loading ? spinner : filteredEvents.length === 0 ? empty : month list` block) with:

```tsx
      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-text-secondary" style={bodyFont}>
          {msg('noTransitEvents', locale)}
        </div>
      ) : (
        <>
          {/* ═══ Desktop: Horizontal Swimlane ═══ */}
          <div className="hidden md:block mt-8">
            <div className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/10 rounded-2xl p-5 overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Month headers */}
                <div className="flex items-center mb-3">
                  <div className="w-[90px] flex-shrink-0" />
                  <div className="flex-1 flex justify-between px-1">
                    {(isDevanagari ? MONTH_NAMES_HI : MONTH_NAMES_EN).map((m, i) => (
                      <span key={i} className="text-[11px] text-text-secondary font-semibold" style={bodyFont}>
                        {m.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Planet rows */}
                <div className="relative">
                  {/* TODAY line */}
                  {todayFraction !== null && (
                    <>
                      <div
                        className="absolute top-0 bottom-0 w-[2px] z-10 pointer-events-none"
                        style={{
                          left: `calc(90px + (100% - 90px) * ${todayFraction})`,
                          background: 'linear-gradient(to bottom, #f0d48a, rgba(240, 212, 138, 0))',
                        }}
                      />
                      <div
                        className="absolute z-10 text-[9px] text-gold-light bg-bg-primary border border-gold-primary/40 px-1.5 py-0.5 rounded font-bold tracking-wider pointer-events-none"
                        style={{
                          left: `calc(90px + (100% - 90px) * ${todayFraction})`,
                          top: '-18px',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        {locale === 'hi' ? 'आज' : 'TODAY'}
                      </div>
                    </>
                  )}

                  {swimlaneData.map((planet, idx) => {
                    const isFiltered = planetFilter !== null && planetFilter !== planet.planetId;
                    // Add gap between slow and fast planets
                    const gapBefore = idx > 0 && planet.isSlow !== swimlaneData[idx - 1].isSlow;
                    return (
                      <div
                        key={planet.planetId}
                        className={`flex items-center ${gapBefore ? 'mt-3' : 'mt-1'} ${isFiltered ? 'opacity-20' : ''} transition-opacity`}
                      >
                        <div className="w-[90px] flex-shrink-0 text-right pr-4">
                          <span className="text-[13px] font-bold" style={{ color: planet.color, ...headingFont }}>
                            {tl(planet.planetName, locale)}
                          </span>
                        </div>
                        <div className={`flex-1 flex gap-[2px] ${planet.isSlow ? 'h-[32px]' : 'h-[22px]'}`}>
                          {planet.bars.map((bar, bi) => {
                            const signAbbr = tl(bar.signName, locale).substring(0, planet.isSlow ? 10 : 3);
                            return (
                              <div
                                key={bi}
                                className={`flex items-center justify-center rounded-md px-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-default transition-all hover:brightness-130 hover:scale-y-[1.15] ${bar.isRetrograde ? 'retrograde-hatch' : ''}`}
                                style={{
                                  flex: bar.flex,
                                  background: `${planet.color}15`,
                                  border: `1px solid ${planet.color}30`,
                                  color: planet.color,
                                  fontSize: planet.isSlow ? '10px' : '9px',
                                  fontWeight: 600,
                                  height: '100%',
                                }}
                                title={`${tl(bar.signName, locale)}: ${bar.startDate} → ${bar.endDate}`}
                              >
                                {bar.flex > 0.8 ? signAbbr : ''}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Mobile: Vertical Timeline (next task) ═══ */}
          <div className="md:hidden mt-8">
            {/* Placeholder — Task 4 fills this in */}
          </div>
        </>
      )}
```

- [ ] **Step 4: Add retrograde hatch CSS**

Add this `<style>` tag inside the component's return JSX (after the opening `<div>`):

```tsx
      <style jsx global>{`
        .retrograde-hatch {
          background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.06) 3px,
            rgba(255,255,255,0.06) 5px
          ) !important;
        }
      `}</style>
```

Note: `style jsx global` is supported by Next.js out of the box via styled-jsx.

- [ ] **Step 5: Verify in browser (desktop)**

Open `http://localhost:3000/en/transits` on desktop (≥768px wide). Confirm:
- 7 planet rows render (Jupiter through Mercury)
- Slow planets (top 4) have taller bars than fast planets (bottom 3)
- Gap between slow and fast groups
- TODAY line appears at correct position for current year
- Hover shows exact date range tooltip
- Planet filter dims non-selected rows
- Bar widths are proportional to transit duration

- [ ] **Step 6: Type check + commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v ".next/"
git add src/app/\[locale\]/transits/page.tsx
git commit -m "feat(transits): horizontal swimlane timeline for desktop"
```

---

### Task 4: Build the vertical timeline (mobile)

**Files:**
- Modify: `src/app/[locale]/transits/page.tsx` — replace the mobile placeholder from Task 3

- [ ] **Step 1: Replace the mobile placeholder with vertical timeline**

Replace `{/* Placeholder — Task 4 fills this in */}` and its parent `<div className="md:hidden mt-8">` with:

```tsx
          {/* ═══ Mobile: Vertical Timeline ═══ */}
          <div className="md:hidden mt-8">
            <div className="relative pl-10">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-[2px]" style={{ background: 'linear-gradient(to bottom, rgba(212,168,83,0.3), rgba(212,168,83,0.05))' }} />

              {Array.from({ length: 12 }, (_, monthIdx) => {
                const monthEvents = eventsByMonth[monthIdx];
                if (!monthEvents || monthEvents.length === 0) return null;
                const monthName = (isDevanagari ? MONTH_NAMES_HI : MONTH_NAMES_EN)[monthIdx];
                const isCurrentMonth = year === new Date().getFullYear() && monthIdx === new Date().getMonth();

                return (
                  <motion.div
                    key={monthIdx}
                    className="mb-6 relative"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Month dot + label */}
                    <div className="flex items-center gap-2 mb-2 -ml-10">
                      <div
                        className="w-3 h-3 rounded-full border-2 border-bg-primary flex-shrink-0 relative left-[10px]"
                        style={{ background: isCurrentMonth ? '#f0d48a' : '#8a8478' }}
                      />
                      <span className={`text-sm font-bold ml-2 ${isCurrentMonth ? 'text-gold-light' : 'text-text-primary'}`} style={headingFont}>
                        {monthName}
                      </span>
                      {isCurrentMonth && (
                        <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-[10px] rounded-full font-bold">
                          {msg('now', locale)}
                        </span>
                      )}
                    </div>

                    {/* Event cards */}
                    <div className="space-y-2">
                      {monthEvents.map((e) => {
                        const dateObj = new Date(e.date + 'T00:00:00');
                        const dayNum = dateObj.getDate();
                        const isMajor = e.significance === 'major';
                        const isPast = e.date < new Date().toISOString().split('T')[0];

                        return (
                          <div
                            key={`${e.date}-${e.planetId}`}
                            className={`rounded-xl p-3 border transition-all ${
                              isMajor
                                ? 'bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/40 to-[#0a0e27] border-gold-primary/25'
                                : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border-gold-primary/10'
                            } ${isPast ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <GrahaIconById id={e.planetId} size={32} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold" style={{ color: PLANET_COLORS[e.planetId], ...headingFont }}>
                                    {tl(e.planetName, locale)} → {tl(e.toSignName, locale)}
                                  </span>
                                </div>
                                <div className="text-xs text-text-secondary mt-0.5" style={bodyFont}>
                                  {isDevanagari
                                    ? `${dayNum} ${monthName}`
                                    : `${monthName.substring(0, 3)} ${dayNum}`
                                  }
                                </div>
                              </div>
                              {isMajor && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light flex-shrink-0">
                                  {tl(sigLabel.major, locale)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
```

- [ ] **Step 2: Verify in browser (mobile)**

Open `http://localhost:3000/en/transits` and resize to <768px. Confirm:
- Vertical gold line on left edge
- Month dots and labels
- Transit cards with planet icons, planet-colored title, date, MAJOR badge
- Past events dimmed at 50% opacity
- "NOW" badge on current month
- Swimlane is hidden on mobile

- [ ] **Step 3: Type check + commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v ".next/"
git add src/app/\[locale\]/transits/page.tsx
git commit -m "feat(transits): vertical timeline for mobile"
```

---

### Task 5: Clean up removed sections + final polish

**Files:**
- Modify: `src/app/[locale]/transits/page.tsx`

- [ ] **Step 1: Remove the old Vedha/Ashtama Shani sections**

These were moved into the hero card in Task 2. Delete the standalone `{/* Jupiter Vedha warning */}` and `{/* QW-12: Ashtama Shani warning */}` blocks that were inside the old current-positions `motion.div` — they should already be gone if Task 2 deleted the whole block. If any orphaned duplicates remain, remove them.

- [ ] **Step 2: Remove the old footer count**

The `{/* Footer count */}` section at the bottom (showing "Showing X of Y transit events") is no longer needed — the swimlane shows everything visually. Delete it.

- [ ] **Step 3: Verify complete page in browser**

Desktop (≥768px):
- [ ] Hero card: zodiac wheel + info panel renders
- [ ] Swimlane: 7 planet rows with proportional bars
- [ ] TODAY line at correct position
- [ ] Year selector works (change year → swimlane updates)
- [ ] Significance filter works (filter by major → swimlane highlights only major-planet rows)
- [ ] Planet filter works (select Jupiter → other rows dim)
- [ ] Mesha Sankranti section still renders at bottom
- [ ] InfoBlock accordion still works
- [ ] No console errors

Mobile (<768px):
- [ ] Hero card: wheel stacks above panel
- [ ] Vertical timeline with month dots and event cards
- [ ] Swimlane is hidden
- [ ] Filters work

Hindi locale:
- [ ] Open `/hi/transits` — all labels in Hindi, Devanagari fonts applied

- [ ] **Step 4: Run type check + tests + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v ".next/"
npx vitest run
npx next build 2>&1 | tail -10
```

All must pass with zero errors.

- [ ] **Step 5: Final commit + push**

```bash
git add src/app/\[locale\]/transits/page.tsx
git commit -m "fix(transits): clean up old sections, final polish"
git push origin main
```

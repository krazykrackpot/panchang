'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

/* ── Orbital data (simplified circular orbits) ───────────────────── */
const PLANETS = {
  Mercury: { period: 0.241, dist: 0.39, color: '#50C878', label: { en: 'Mercury', hi: 'बुध', ta: 'புதன்', bn: 'বুধ' } },
  Venus:   { period: 0.615, dist: 0.72, color: '#FF69B4', label: { en: 'Venus',   hi: 'शुक्र', ta: 'சுக்கிரன்', bn: 'শুক্র' } },
  Mars:    { period: 1.881, dist: 1.52, color: '#DC143C', label: { en: 'Mars',    hi: 'मंगल', ta: 'செவ்வாய்', bn: 'মঙ্গল' } },
  Jupiter: { period: 11.86, dist: 5.20, color: '#FFD700', label: { en: 'Jupiter', hi: 'बृहस्पति', ta: 'வியாழன்', bn: 'বৃহস্পতি' } },
  Saturn:  { period: 29.46, dist: 9.54, color: '#4169E1', label: { en: 'Saturn',  hi: 'शनि', ta: 'சனி', bn: 'শনি' } },
} as const;
type PlanetKey = keyof typeof PLANETS;
const EARTH = { period: 1.0, dist: 1.0 };

/* ── UI string labels ─────────────────────────────────────────────── */
const UI = {
  fromAbove:  { en: 'From Above',      hi: 'ऊपर से',          ta: 'மேலிருந்து',       bn: 'উপর থেকে' },
  fromEarth:  { en: 'From Earth',      hi: 'पृथ्वी से',       ta: 'பூமியிலிருந்து',  bn: 'পৃথিবী থেকে' },
  play:       { en: 'Play',            hi: 'चलाएं',           ta: 'இயக்கு',           bn: 'চালু' },
  pause:      { en: 'Pause',           hi: 'रुकें',           ta: 'நிறுத்து',         bn: 'থামো' },
  reset:      { en: 'Reset',           hi: 'रीसेट',           ta: 'மீட்டமை',          bn: 'রিসেট' },
  speed:      { en: 'Speed',           hi: 'गति',             ta: 'வேகம்',             bn: 'গতি' },
  planet:     { en: 'Planet',          hi: 'ग्रह',            ta: 'கிரகம்',           bn: 'গ্রহ' },
  directTrail:{ en: 'Direct',          hi: 'सीधी गति',        ta: 'நேரான இயக்கம்',    bn: 'সরাসরি' },
  retroTrail: { en: 'Retrograde',      hi: 'वक्री',           ta: 'வக்ர',              bn: 'বক্রগতি' },
  sightLine:  { en: 'Sight line',      hi: 'दृष्टि रेखा',    ta: 'பார்வை கோடு',      bn: 'দর্শন রেখা' },
};

const ANNOTATIONS = {
  overtaking: {
    en: (p: string) => `Earth overtaking ${p} — apparent slowdown begins`,
    hi: (p: string) => `पृथ्वी ${p} को पार कर रही है — स्पष्ट मंदी शुरू होती है`,
    ta: (p: string) => `பூமி ${p}-ஐ முந்துகிறது — மந்தமாகத் தெரிகிறது`,
    bn: (p: string) => `পৃথিবী ${p}-কে অতিক্রম করছে — আপাত মন্দন শুরু`,
  },
  station1: {
    en: (p: string) => `Station: ${p} appears to stop`,
    hi: (p: string) => `स्थिर: ${p} रुकता प्रतीत होता है`,
    ta: (p: string) => `நிலை: ${p} நிற்பது போல் தெரிகிறது`,
    bn: (p: string) => `স্থির: ${p} থামছে বলে মনে হচ্ছে`,
  },
  retrograde: {
    en: (p: string) => `Retrograde: ${p} appears to move backward`,
    hi: (p: string) => `वक्री: ${p} पीछे की ओर चलता प्रतीत होता है`,
    ta: (p: string) => `வக்ர: ${p} பின்நோக்கி நகர்வது போல் தெரிகிறது`,
    bn: (p: string) => `বক্রগতি: ${p} পেছনে যাচ্ছে বলে মনে হচ্ছে`,
  },
  station2: {
    en: (p: string) => `Station: ${p} appears to stop again`,
    hi: (p: string) => `स्थिर: ${p} फिर से रुकता प्रतीत होता है`,
    ta: (p: string) => `நிலை: ${p} மீண்டும் நிற்பது போல் தெரிகிறது`,
    bn: (p: string) => `স্থির: ${p} আবার থামছে বলে মনে হচ্ছে`,
  },
  direct: {
    en: (_p: string) => `Direct motion resumes`,
    hi: (_p: string) => `सीधी गति पुनः आरंभ`,
    ta: (_p: string) => `நேரான இயக்கம் மீண்டும் தொடங்குகிறது`,
    bn: (_p: string) => `সরাসরি গতি পুনরায় শুরু`,
  },
};

type Locale = 'en' | 'hi' | 'ta' | 'bn';
type View = 'helio' | 'geo';
type SpeedKey = '1x' | '10x' | '50x';

const SPEED_MAP: Record<SpeedKey, number> = { '1x': 1, '10x': 10, '50x': 50 };

/* ── Trail entry ──────────────────────────────────────────────────── */
interface TrailPoint { x: number; y: number; retro: boolean; age: number }

/* ── Canvas rendering helpers ─────────────────────────────────────── */
function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, glow?: string) {
  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = 14;
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

function drawOrbit(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(138,109,43,0.18)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.save();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function labelText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 11, color = '#f0d48a') {
  ctx.font = `${size}px system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}

/* ── Main component ───────────────────────────────────────────────── */
interface Props { locale?: string }

export default function RetrogradeVisualizer({ locale = 'en' }: Props) {
  const loc = (['en', 'hi', 'ta', 'bn'].includes(locale) ? locale : 'en') as Locale;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef<number>(0);  // simulation time in years

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>('Mars');
  const [speed, setSpeed]   = useState<SpeedKey>('10x');
  const [playing, setPlaying] = useState(true);
  const [view, setView]     = useState<View>('helio');
  const [annotation, setAnnotation] = useState<string>('');

  // Mutable refs for render loop (avoids stale closure issues)
  const playingRef = useRef(playing);
  const speedRef   = useRef(SPEED_MAP[speed]);
  const viewRef    = useRef(view);
  const planetRef  = useRef(selectedPlanet);
  const trailRef   = useRef<TrailPoint[]>([]);
  const geoTrailRef = useRef<{ x: number; retro: boolean; age: number }[]>([]);
  const annotationRef = useRef('');
  const lastGeoAngleRef = useRef<number | null>(null);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { speedRef.current = SPEED_MAP[speed]; }, [speed]);
  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => {
    planetRef.current = selectedPlanet;
    trailRef.current = [];
    geoTrailRef.current = [];
    lastGeoAngleRef.current = null;
    timeRef.current = 0;
  }, [selectedPlanet]);

  // Sync annotation state from ref for React render (throttled via rAF)
  const updateAnnotation = useCallback((text: string) => {
    if (text !== annotationRef.current) {
      annotationRef.current = text;
      setAnnotation(text);
    }
  }, []);

  /* ── Animation loop ─────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = 0;
    // ~0.04 real years per second at 1x → full earth orbit in 25s at 1x; comfortable at 10x
    const BASE_YEARS_PER_SEC = 0.04;
    const MAX_TRAIL = 180;
    const MAX_GEO_TRAIL = 220;

    function render(ts: number) {
      if (!canvas || !ctx) return;

      const dt = lastTimestamp ? Math.min((ts - lastTimestamp) / 1000, 0.05) : 0;
      lastTimestamp = ts;

      if (playingRef.current) {
        timeRef.current += dt * BASE_YEARS_PER_SEC * speedRef.current;
      }

      const W = canvas.width;
      const H = canvas.height;
      const t = timeRef.current;
      const pKey = planetRef.current;
      const planet = PLANETS[pKey];

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, W, H);

      if (viewRef.current === 'helio') {
        renderHelio(ctx, W, H, t, planet, pKey, loc, MAX_TRAIL, updateAnnotation);
      } else {
        renderGeo(ctx, W, H, t, planet, pKey, loc, MAX_GEO_TRAIL, updateAnnotation);
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc]);

  /* ── Helpers for annotation determination ───────────────────────── */
  function renderHelio(
    ctx: CanvasRenderingContext2D,
    W: number, H: number,
    t: number,
    planet: typeof PLANETS[PlanetKey],
    pKey: PlanetKey,
    locale: Locale,
    maxTrail: number,
    onAnnotation: (s: string) => void,
  ) {
    const cx = W / 2, cy = H / 2;
    // Scale so outer orbit of Saturn fits within canvas with margin
    // We display up to the selected planet orbit only
    const maxDist = planet.dist;
    const scale = (Math.min(W, H) / 2 - 28) / (maxDist * 1.15);

    // Earth orbit radius in px
    const earthR = EARTH.dist * scale;
    // Planet orbit radius in px
    const planetR = planet.dist * scale;

    // Draw star field (random fixed dots)
    drawStarField(ctx, W, H);

    // Orbit rings
    drawOrbit(ctx, cx, cy, earthR);
    drawOrbit(ctx, cx, cy, planetR);
    // Outer "projected" ring (star projection plane)
    const outerR = planetR * 1.22;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240,212,138,0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Angular positions (in radians)
    const earthAngle  = (2 * Math.PI * t) / EARTH.period;
    const planetAngle = (2 * Math.PI * t) / planet.period;

    // Positions in canvas coords
    const ex = cx + earthR  * Math.cos(earthAngle);
    const ey = cy + earthR  * Math.sin(earthAngle);
    const px = cx + planetR * Math.cos(planetAngle);
    const py = cy + planetR * Math.sin(planetAngle);

    // Extend sight line from Earth through planet to outer ring
    const dx = px - ex, dy = py - ey;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len, ny = dy / len;
    // Intersect with outerR circle (solve quadratic from cx,cy)
    const fx = ex - cx, fy = ey - cy;
    const a2 = nx * nx + ny * ny; // =1
    const b2 = 2 * (fx * nx + fy * ny);
    const c2 = fx * fx + fy * fy - outerR * outerR;
    const disc = b2 * b2 - 4 * a2 * c2;
    let projX = px, projY = py;
    if (disc >= 0) {
      const tPos = (-b2 + Math.sqrt(disc)) / (2 * a2);
      projX = ex + nx * tPos;
      projY = ey + ny * tPos;
    }

    // Determine retrograde: geocentric angle of planet is moving backward
    // Geocentric angle = atan2(py-ey, px-ex)
    const geoAngle = Math.atan2(py - ey, px - ex);
    const prevGeo = lastGeoAngleRef.current;
    let isRetro = false;
    if (prevGeo !== null) {
      let dAngle = geoAngle - prevGeo;
      // Normalise to [-π, π]
      while (dAngle >  Math.PI) dAngle -= 2 * Math.PI;
      while (dAngle < -Math.PI) dAngle += 2 * Math.PI;
      isRetro = dAngle < 0;
    }
    lastGeoAngleRef.current = geoAngle;

    // Trail on outer ring
    const trail = trailRef.current;
    if (playingRef.current) {
      trail.push({ x: projX, y: projY, retro: isRetro, age: 0 });
      if (trail.length > maxTrail) trail.shift();
      for (const pt of trail) pt.age++;
    }

    // Draw trail
    for (let i = 0; i < trail.length; i++) {
      const pt = trail[i];
      const alpha = 1 - pt.age / maxTrail;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.retro
        ? `rgba(220,20,60,${alpha})`
        : `rgba(80,200,120,${alpha})`;
      ctx.fill();
    }

    // Sight line (dashed gold)
    drawDashedLine(ctx, ex, ey, projX, projY, 'rgba(212,168,83,0.55)');

    // Sun
    drawCircle(ctx, cx, cy, 10, '#FFD700', '#FFD700');
    labelText(ctx, '☀', cx, cy + 22, 10, '#FFD700');

    // Earth
    drawCircle(ctx, ex, ey, 6, '#4169E1', '#4169E1');
    labelText(ctx, 'Earth', ex, ey - 12, 9, '#c0cfff');

    // Planet
    drawCircle(ctx, px, py, 5, planet.color, planet.color);
    labelText(ctx, planet.label[locale], px, py - 12, 9, planet.color);

    // Projected point on outer ring
    ctx.beginPath();
    ctx.arc(projX, projY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isRetro ? '#DC143C' : '#50C878';
    ctx.fill();

    // Annotation
    const pName = planet.label[locale];
    let ann = '';
    if (isRetro) {
      ann = ANNOTATIONS.retrograde[locale](pName);
    } else if (prevGeo !== null) {
      let dAngle = geoAngle - prevGeo;
      while (dAngle >  Math.PI) dAngle -= 2 * Math.PI;
      while (dAngle < -Math.PI) dAngle += 2 * Math.PI;
      if (Math.abs(dAngle) < 0.002) {
        ann = ANNOTATIONS.station1[locale](pName);
      } else {
        ann = ANNOTATIONS.direct[locale](pName);
      }
    }
    onAnnotation(ann);

    // Legend
    const lx = 10, ly = H - 50;
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#50C878'; ctx.fillRect(lx, ly, 12, 3); ctx.fillStyle = '#8a8478'; ctx.fillText(UI.directTrail[locale], lx + 16, ly + 4);
    ctx.fillStyle = '#DC143C'; ctx.fillRect(lx, ly + 12, 12, 3); ctx.fillStyle = '#8a8478'; ctx.fillText(UI.retroTrail[locale], lx + 16, ly + 16);
  }

  function renderGeo(
    ctx: CanvasRenderingContext2D,
    W: number, H: number,
    t: number,
    planet: typeof PLANETS[PlanetKey],
    pKey: PlanetKey,
    locale: Locale,
    maxTrail: number,
    onAnnotation: (s: string) => void,
  ) {
    // Star field background
    drawStarField(ctx, W, H);

    // Star-field band in middle
    const bandY = H / 2;
    const bandH = H * 0.28;
    const grad = ctx.createLinearGradient(0, bandY - bandH / 2, 0, bandY + bandH / 2);
    grad.addColorStop(0, 'rgba(45,27,105,0)');
    grad.addColorStop(0.5, 'rgba(45,27,105,0.18)');
    grad.addColorStop(1, 'rgba(45,27,105,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, bandY - bandH / 2, W, bandH);

    // Ecliptic line
    ctx.beginPath();
    ctx.moveTo(20, bandY);
    ctx.lineTo(W - 20, bandY);
    ctx.strokeStyle = 'rgba(138,109,43,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    labelText(ctx, 'ecliptic', W - 46, bandY - 6, 9, 'rgba(138,109,43,0.5)');

    // Geocentric angle
    const earthAngle  = (2 * Math.PI * t) / EARTH.period;
    const planetAngle = (2 * Math.PI * t) / planet.period;
    const ex = Math.cos(earthAngle);
    const ey = Math.sin(earthAngle);
    const px = planet.dist * Math.cos(planetAngle);
    const py = planet.dist * Math.sin(planetAngle);
    const geoAngle = Math.atan2(py - ey, px - ex);

    // Map geocentric angle to X position on canvas
    // Normalise to [0, 2π]
    const normAngle = ((geoAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const geoX = (normAngle / (2 * Math.PI)) * (W - 60) + 30;
    const geoY = bandY;

    // Detect retrograde
    const prevGeo = lastGeoAngleRef.current;
    let isRetro = false;
    if (prevGeo !== null) {
      let dAngle = geoAngle - prevGeo;
      while (dAngle >  Math.PI) dAngle -= 2 * Math.PI;
      while (dAngle < -Math.PI) dAngle += 2 * Math.PI;
      isRetro = dAngle < 0;
    }
    lastGeoAngleRef.current = geoAngle;

    // Trail
    const trail = geoTrailRef.current;
    if (playingRef.current) {
      trail.push({ x: geoX, retro: isRetro, age: 0 });
      if (trail.length > maxTrail) trail.shift();
      for (const pt of trail) pt.age++;
    }

    // Draw trail as connected path segments
    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        const prev = trail[i - 1];
        const curr = trail[i];
        // Skip segments that wrap across canvas edge
        if (Math.abs(curr.x - prev.x) > W * 0.4) continue;
        const alpha = 1 - curr.age / maxTrail;
        ctx.beginPath();
        ctx.moveTo(prev.x, bandY);
        ctx.lineTo(curr.x, bandY);
        ctx.strokeStyle = curr.retro
          ? `rgba(220,20,60,${alpha * 0.9})`
          : `rgba(80,200,120,${alpha * 0.9})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    // Earth fixed label at left
    const earthX = 30;
    const earthY = H - 36;
    drawCircle(ctx, earthX, earthY, 7, '#4169E1', '#4169E1');
    labelText(ctx, 'Earth (fixed)', earthX + 4, earthY - 14, 9, '#c0cfff');
    // Sight-line arrow hint
    ctx.beginPath();
    ctx.moveTo(earthX + 10, earthY - 4);
    ctx.lineTo(geoX, geoY + 16);
    ctx.strokeStyle = 'rgba(212,168,83,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Planet dot
    drawCircle(ctx, geoX, geoY, 6, planet.color, planet.color);
    labelText(ctx, planet.label[locale], geoX, geoY - 16, 10, planet.color);

    // Direction arrow
    if (prevGeo !== null) {
      const arrowDir = isRetro ? -1 : 1;
      const ax = geoX + arrowDir * 18;
      ctx.beginPath();
      ctx.moveTo(ax, geoY - 5);
      ctx.lineTo(ax + arrowDir * 8, geoY);
      ctx.lineTo(ax, geoY + 5);
      ctx.strokeStyle = isRetro ? '#DC143C' : '#50C878';
      ctx.lineWidth = 1.8;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Annotation
    const pName = planet.label[locale];
    let ann = '';
    if (isRetro) {
      ann = ANNOTATIONS.retrograde[locale](pName);
    } else if (prevGeo !== null) {
      let dAngle = geoAngle - (prevGeo ?? geoAngle);
      while (dAngle >  Math.PI) dAngle -= 2 * Math.PI;
      while (dAngle < -Math.PI) dAngle += 2 * Math.PI;
      if (Math.abs(dAngle) < 0.002) {
        ann = ANNOTATIONS.station1[locale](pName);
      } else {
        ann = ANNOTATIONS.direct[locale](pName);
      }
    }
    onAnnotation(ann);

    // Legend
    const lx = 10, ly = H - 50;
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#50C878'; ctx.fillRect(lx, ly, 12, 3); ctx.fillStyle = '#8a8478'; ctx.fillText(UI.directTrail[locale], lx + 16, ly + 4);
    ctx.fillStyle = '#DC143C'; ctx.fillRect(lx, ly + 12, 12, 3); ctx.fillStyle = '#8a8478'; ctx.fillText(UI.retroTrail[locale], lx + 16, ly + 16);
  }

  /* ── Button styles ──────────────────────────────────────────────── */
  const btnBase = 'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer';
  const btnActive = 'bg-gold-primary/15 text-gold-light border-gold-primary/40';
  const btnInactive = 'bg-transparent text-text-secondary border-gold-primary/15 hover:border-gold-primary/30 hover:text-gold-light';
  const btnControl = 'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border border-gold-primary/20 bg-transparent text-text-secondary hover:text-gold-light hover:border-gold-primary/35 transition-all cursor-pointer';

  return (
    <div className="w-full space-y-4">
      {/* View toggle */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => { setView('helio'); trailRef.current = []; geoTrailRef.current = []; lastGeoAngleRef.current = null; }}
          className={`${btnBase} ${view === 'helio' ? btnActive : btnInactive}`}
        >
          {UI.fromAbove[loc]}
        </button>
        <button
          onClick={() => { setView('geo'); trailRef.current = []; geoTrailRef.current = []; lastGeoAngleRef.current = null; }}
          className={`${btnBase} ${view === 'geo' ? btnActive : btnInactive}`}
        >
          {UI.fromEarth[loc]}
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full" style={{ maxWidth: 600, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={560}
          height={520}
          className="w-full rounded-2xl border border-gold-primary/12"
          style={{ background: '#0a0e27', display: 'block' }}
        />
        {/* Annotation overlay */}
        {annotation && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] text-center">
            <span className="inline-block px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-gold-light bg-[#0a0e27]/80 border border-gold-primary/20 backdrop-blur-sm">
              {annotation}
            </span>
          </div>
        )}
      </div>

      {/* Planet selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(PLANETS) as PlanetKey[]).map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPlanet(p)}
            className={`${btnBase} ${selectedPlanet === p ? btnActive : btnInactive}`}
            style={selectedPlanet === p ? { color: PLANETS[p].color, borderColor: PLANETS[p].color + '60' } : {}}
          >
            {PLANETS[p].label[loc]}
          </button>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex flex-wrap justify-center items-center gap-3">
        <button onClick={() => setPlaying(p => !p)} className={btnControl}>
          {playing ? UI.pause[loc] : UI.play[loc]}
        </button>
        <button onClick={() => {
          timeRef.current = 0;
          trailRef.current = [];
          geoTrailRef.current = [];
          lastGeoAngleRef.current = null;
          setPlaying(true);
        }} className={btnControl}>
          {UI.reset[loc]}
        </button>

        <span className="text-text-secondary text-xs">{UI.speed[loc]}:</span>
        {(['1x', '10x', '50x'] as SpeedKey[]).map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`${btnBase} ${speed === s ? btnActive : btnInactive}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Static star field (seeded pseudo-random) ───────────────────── */
let _stars: { x: number; y: number; r: number; a: number }[] | null = null;
function getStars(W: number, H: number) {
  if (!_stars || _stars.length === 0) {
    _stars = [];
    // Simple LCG for deterministic stars
    let seed = 42;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    for (let i = 0; i < 80; i++) {
      _stars.push({ x: rand(), y: rand(), r: rand() * 1.2 + 0.3, a: rand() * 0.5 + 0.2 });
    }
  }
  return _stars.map(s => ({ ...s, x: s.x * W, y: s.y * H }));
}

function drawStarField(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const stars = getStars(W, H);
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  }
}

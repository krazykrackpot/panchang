'use client';

/**
 * EclipseSimulator — Canvas 2D educational animation of solar and lunar eclipses.
 *
 * Rendering is simplified/geometric (not based on Besselian elements).
 * Purpose: illustrate the geometric concept for educational & Jyotish context.
 *
 * Cleanup: rAF is cancelled on unmount. Canvas is scaled for retina (devicePixelRatio).
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type EclipseMode = 'solar' | 'lunar';
type SimSpeed = 1 | 10 | 50;

interface EclipsePhase {
  label: string;
  // progress range [0, 1] when this phase is active
  start: number;
  end: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Labels for all 4 active locales (en, hi, ta, bn)
const LABELS: Record<string, Record<string, string>> = {
  en: {
    solar: 'Solar Eclipse',
    lunar: 'Lunar Eclipse',
    play: 'Play',
    pause: 'Pause',
    reset: 'Reset',
    speed: 'Speed',
    phase: 'Phase',
    penumbralStart: 'Penumbral start',
    partialStart: 'Partial start',
    totality: 'Totality',
    partialEnd: 'Partial end',
    penumbralEnd: 'Penumbral end',
    contact1: 'First contact',
    annularity: 'Maximum eclipse',
    contact4: 'Last contact',
    sun: 'Sun',
    moon: 'Moon',
    earth: 'Earth',
    shadow: 'Shadow',
    umbra: 'Umbra',
    penumbra: 'Penumbra',
    rahu: 'Rahu (north node)',
    ketu: 'Ketu (south node)',
  },
  hi: {
    solar: 'सूर्य ग्रहण',
    lunar: 'चन्द्र ग्रहण',
    play: 'चलाएँ',
    pause: 'रोकें',
    reset: 'पुनः आरम्भ',
    speed: 'गति',
    phase: 'चरण',
    penumbralStart: 'उपच्छाया आरम्भ',
    partialStart: 'खंड ग्रहण आरम्भ',
    totality: 'पूर्ण ग्रहण',
    partialEnd: 'खंड ग्रहण समाप्ति',
    penumbralEnd: 'उपच्छाया समाप्ति',
    contact1: 'प्रथम स्पर्श',
    annularity: 'अधिकतम ग्रहण',
    contact4: 'अन्तिम स्पर्श',
    sun: 'सूर्य',
    moon: 'चन्द्र',
    earth: 'पृथ्वी',
    shadow: 'छाया',
    umbra: 'छाया केन्द्र',
    penumbra: 'उपच्छाया',
    rahu: 'राहु (उत्तर नोड)',
    ketu: 'केतु (दक्षिण नोड)',
  },
  ta: {
    solar: 'சூரிய கிரகணம்',
    lunar: 'சந்திர கிரகணம்',
    play: 'இயக்கு',
    pause: 'நிறுத்து',
    reset: 'மீட்டமை',
    speed: 'வேகம்',
    phase: 'நிலை',
    penumbralStart: 'மறைநிழல் தொடக்கம்',
    partialStart: 'பகுதி கிரகணம் தொடக்கம்',
    totality: 'முழு கிரகணம்',
    partialEnd: 'பகுதி கிரகணம் முடிவு',
    penumbralEnd: 'மறைநிழல் முடிவு',
    contact1: 'முதல் தொடர்பு',
    annularity: 'அதிகபட்ச கிரகணம்',
    contact4: 'கடைசி தொடர்பு',
    sun: 'சூரியன்',
    moon: 'சந்திரன்',
    earth: 'பூமி',
    shadow: 'நிழல்',
    umbra: 'உம்ப்ரா',
    penumbra: 'பெனம்ப்ரா',
    rahu: 'ராகு (வட கோளம்)',
    ketu: 'கேது (தென் கோளம்)',
  },
  bn: {
    solar: 'সূর্যগ্রহণ',
    lunar: 'চন্দ্রগ্রহণ',
    play: 'চালান',
    pause: 'বিরতি',
    reset: 'পুনরায় শুরু',
    speed: 'গতি',
    phase: 'পর্যায়',
    penumbralStart: 'উপচ্ছায়া শুরু',
    partialStart: 'আংশিক শুরু',
    totality: 'পূর্ণ গ্রহণ',
    partialEnd: 'আংশিক সমাপ্তি',
    penumbralEnd: 'উপচ্ছায়া সমাপ্তি',
    contact1: 'প্রথম স্পর্শ',
    annularity: 'সর্বোচ্চ গ্রহণ',
    contact4: 'শেষ স্পর্শ',
    sun: 'সূর্য',
    moon: 'চন্দ্র',
    earth: 'পৃথিবী',
    shadow: 'ছায়া',
    umbra: 'উম্ব্রা',
    penumbra: 'পেনাম্ব্রা',
    rahu: 'রাহু (উত্তর নোড)',
    ketu: 'কেতু (দক্ষিণ নোড)',
  },
};

const SOLAR_PHASES: EclipsePhase[] = [
  { label: 'contact1', start: 0, end: 0.2 },
  { label: 'partialStart', start: 0.2, end: 0.4 },
  { label: 'annularity', start: 0.4, end: 0.6 },
  { label: 'partialEnd', start: 0.6, end: 0.8 },
  { label: 'contact4', start: 0.8, end: 1.0 },
];

const LUNAR_PHASES: EclipsePhase[] = [
  { label: 'penumbralStart', start: 0, end: 0.15 },
  { label: 'partialStart', start: 0.15, end: 0.35 },
  { label: 'totality', start: 0.35, end: 0.65 },
  { label: 'partialEnd', start: 0.65, end: 0.85 },
  { label: 'penumbralEnd', start: 0.85, end: 1.0 },
];

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 1.6);
  grad.addColorStop(0, color + 'aa');
  grad.addColorStop(1, color + '00');
  ctx.beginPath();
  ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Glow
  drawGlow(ctx, x, y, r, '#FFD700');
  // Sun body
  const grad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
  grad.addColorStop(0, '#FFF7A0');
  grad.addColorStop(0.4, '#FFD700');
  grad.addColorStop(1, '#FF6B35');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, eclipseRatio: number) {
  // eclipseRatio 0 = normal silver, 1 = blood red
  const r0 = Math.floor(0xC0 + (0xCD - 0xC0) * eclipseRatio);
  const g0 = Math.floor(0xC0 + (0x5C - 0xC0) * eclipseRatio);
  const b0 = Math.floor(0xC0 + (0x5C - 0xC0) * eclipseRatio);
  const baseColor = `rgb(${r0},${g0},${b0})`;

  // subtle glow in red tones when eclipsed
  if (eclipseRatio > 0.05) {
    drawGlow(ctx, x, y, r, `rgba(${r0},${g0 * 0.4},0`);
  }

  const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.05, x, y, r);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, baseColor);
  grad.addColorStop(1, eclipseRatio > 0.3 ? '#5C1010' : '#888888');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // crater marks for realism
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#000000';
  [
    [x + r * 0.2, y - r * 0.3, r * 0.08],
    [x - r * 0.35, y + r * 0.15, r * 0.1],
    [x + r * 0.1, y + r * 0.4, r * 0.06],
  ].forEach(([cx, cy, cr]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1.0;
}

function drawEarth(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  drawGlow(ctx, x, y, r, '#4169E1');
  const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
  grad.addColorStop(0, '#6BB8FF');
  grad.addColorStop(0.4, '#4169E1');
  grad.addColorStop(1, '#1A3A7A');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Continent-like patches
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#3A8A3A';
  [
    [x - r * 0.1, y - r * 0.2, r * 0.3, r * 0.22],
    [x + r * 0.25, y + r * 0.15, r * 0.22, r * 0.28],
    [x - r * 0.3, y + r * 0.3, r * 0.18, r * 0.15],
  ].forEach(([ex, ey, ew, eh]) => {
    ctx.beginPath();
    ctx.ellipse(ex, ey, ew, eh, 0.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1.0;
}

// ─── Main draw functions ──────────────────────────────────────────────────────

function drawSolarEclipse(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number, // 0..1, 0.5 = totality
  L: Record<string, string>
) {
  // Clear
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0e27';
  ctx.fillRect(0, 0, w, h);

  const sunR = h * 0.18;
  const moonR = h * 0.14;
  const earthR = h * 0.12;

  // Layout: Sun left, Earth right, Moon moves between
  const sunX = w * 0.22;
  const sunY = h * 0.42;
  const earthX = w * 0.78;
  const earthY = h * 0.42;

  // Moon travel: starts far left of Sun, ends far right of Sun, at totality covers Sun centre
  // progress 0 → Moon at sunX - sunR*3, progress 0.5 → Moon at sunX, progress 1 → sunX + sunR*3
  const moonTravelStart = sunX - sunR * 3.5;
  const moonTravelEnd = sunX + sunR * 3.5;
  const moonX = moonTravelStart + (moonTravelEnd - moonTravelStart) * progress;
  const moonY = sunY + moonR * 0.1; // slight offset for partial eclipses

  // Coverage ratio (0 = no overlap, 1 = full coverage at p=0.5)
  const dist = Math.abs(moonX - sunX);
  const overlapDist = sunR + moonR - dist;
  const coverageRatio = Math.max(0, Math.min(1, overlapDist / (moonR * 2)));

  // Draw shadow cone from Moon to Earth (penumbra + umbra)
  if (overlapDist > -sunR) {
    // Penumbra cone — wide
    ctx.beginPath();
    ctx.moveTo(moonX - moonR, moonY - moonR * 0.8);
    ctx.lineTo(earthX - earthR * 1.5, earthY - earthR * 2.2);
    ctx.lineTo(earthX - earthR * 1.5, earthY + earthR * 2.2);
    ctx.lineTo(moonX - moonR, moonY + moonR * 0.8);
    ctx.closePath();
    ctx.fillStyle = 'rgba(100, 80, 0, 0.12)';
    ctx.fill();

    // Umbra cone — narrow
    const umbraWidth = moonR * (0.3 + coverageRatio * 0.4);
    ctx.beginPath();
    ctx.moveTo(moonX, moonY - umbraWidth);
    ctx.lineTo(earthX - earthR * 0.5, earthY - earthR * 0.6 * coverageRatio);
    ctx.lineTo(earthX - earthR * 0.5, earthY + earthR * 0.6 * coverageRatio);
    ctx.lineTo(moonX, moonY + umbraWidth);
    ctx.closePath();
    ctx.fillStyle = `rgba(0,0,0,${0.3 + coverageRatio * 0.35})`;
    ctx.fill();

    // Darkness patch on Earth surface during eclipse
    if (coverageRatio > 0.1) {
      const cx = earthX - earthR * 0.3;
      const cy = earthY;
      const patchR = earthR * 0.4 * coverageRatio;
      const darkGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, patchR);
      darkGrad.addColorStop(0, `rgba(0,0,0,${0.7 * coverageRatio})`);
      darkGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, patchR, 0, Math.PI * 2);
      ctx.fillStyle = darkGrad;
      ctx.fill();
    }
  }

  // Draw Sun (behind Moon)
  drawSun(ctx, sunX, sunY, sunR);

  // Draw Earth
  drawEarth(ctx, earthX, earthY, earthR);

  // Draw Moon on top of Sun
  ctx.save();
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  const moonFill = ctx.createRadialGradient(moonX - moonR * 0.2, moonY - moonR * 0.2, moonR * 0.1, moonX, moonY, moonR);
  moonFill.addColorStop(0, '#444444');
  moonFill.addColorStop(1, '#111111');
  ctx.fillStyle = moonFill;
  ctx.fill();
  ctx.restore();

  // Corona effect during totality
  if (coverageRatio > 0.9) {
    const coronaAlpha = (coverageRatio - 0.9) * 10; // 0..1
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const len = sunR * (0.4 + Math.random() * 0 + 0.3); // deterministic
      ctx.beginPath();
      ctx.moveTo(
        moonX + Math.cos(angle) * sunR * 0.98,
        moonY + Math.sin(angle) * sunR * 0.98
      );
      ctx.lineTo(
        moonX + Math.cos(angle) * (sunR + len),
        moonY + Math.sin(angle) * (sunR + len)
      );
      ctx.strokeStyle = `rgba(255, 200, 50, ${coronaAlpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Labels
  ctx.fillStyle = '#f0d48a';
  ctx.font = `bold ${Math.floor(h * 0.028)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(L.sun, sunX, sunY + sunR + h * 0.06);
  ctx.fillText(L.moon, moonX, moonY + moonR + h * 0.06);
  ctx.fillText(L.earth, earthX, earthY + earthR + h * 0.06);

  // Phase label
  drawPhaseLabel(ctx, w, h, progress, SOLAR_PHASES, L);
}

function drawLunarEclipse(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  L: Record<string, string>
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0e27';
  ctx.fillRect(0, 0, w, h);

  const earthR = h * 0.16;
  const moonR = h * 0.1;

  // Sun is off-screen left — show rays only
  const earthX = w * 0.42;
  const earthY = h * 0.44;

  // Shadow circles centred on the point opposite the Sun (right side of Earth)
  const shadowX = earthX;
  const shadowY = earthY;
  const umbraR = earthR * 1.05;
  const penumbraR = earthR * 2.2;

  // Moon travels from right to left, entering from far right, exiting far left
  const moonTravelStart = w * 0.92;
  const moonTravelEnd = w * 0.08;
  const moonX = moonTravelStart + (moonTravelEnd - moonTravelStart) * progress;
  const moonY = earthY + moonR * 0.05;

  // How deep is the Moon in the umbra?
  const distFromShadow = Math.sqrt((moonX - shadowX) ** 2 + (moonY - shadowY) ** 2);
  const inUmbra = Math.max(0, Math.min(1, 1 - (distFromShadow - umbraR) / (moonR * 2)));
  const inPenumbra = Math.max(0, Math.min(1, 1 - (distFromShadow - penumbraR) / (moonR * 2)));

  // Sun rays from left edge
  ctx.save();
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 0.5 - Math.PI * 0.25;
    const len = w * 0.35;
    ctx.beginPath();
    ctx.moveTo(0, earthY + Math.tan(angle) * earthX);
    ctx.lineTo(earthX - earthR * 1.1, earthY + Math.tan(angle) * (earthX - earthR * 1.1 - 0));
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();

  // Penumbra shadow (large, lighter)
  const penGrad = ctx.createRadialGradient(shadowX, shadowY, umbraR, shadowX, shadowY, penumbraR);
  penGrad.addColorStop(0, 'rgba(0,0,60,0.55)');
  penGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(shadowX, shadowY, penumbraR, 0, Math.PI * 2);
  ctx.fillStyle = penGrad;
  ctx.fill();

  // Umbra shadow (small, darker)
  const umbGrad = ctx.createRadialGradient(shadowX, shadowY, 0, shadowX, shadowY, umbraR);
  umbGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
  umbGrad.addColorStop(0.7, 'rgba(0,0,0,0.75)');
  umbGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.beginPath();
  ctx.arc(shadowX, shadowY, umbraR, 0, Math.PI * 2);
  ctx.fillStyle = umbGrad;
  ctx.fill();

  // Umbra label
  ctx.fillStyle = 'rgba(240,212,138,0.5)';
  ctx.font = `${Math.floor(h * 0.022)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(L.umbra, shadowX, shadowY + umbraR * 0.55);
  ctx.fillText(L.penumbra, shadowX, shadowY + penumbraR * 0.75);

  // Draw Earth
  drawEarth(ctx, earthX, earthY, earthR);

  // Draw Moon with blood-red tint based on umbra depth
  drawMoon(ctx, moonX, moonY, moonR, inUmbra);

  // Penumbra darkening overlay on Moon when in penumbra
  if (inPenumbra > 0 && inUmbra < 1) {
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${inPenumbra * 0.35})`;
    ctx.fill();
  }

  // Labels
  ctx.fillStyle = '#f0d48a';
  ctx.font = `bold ${Math.floor(h * 0.028)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(L.earth, earthX, earthY + earthR + h * 0.06);
  ctx.fillText(L.moon, moonX, moonY + moonR + h * 0.06);

  // Rahu/Ketu directional hints
  ctx.fillStyle = 'rgba(180,100,255,0.55)';
  ctx.font = `${Math.floor(h * 0.021)}px sans-serif`;
  ctx.fillText('↑ ' + L.rahu, w * 0.75, h * 0.12);
  ctx.fillText('↓ ' + L.ketu, w * 0.75, h * 0.12 + h * 0.035);

  drawPhaseLabel(ctx, w, h, progress, LUNAR_PHASES, L);
}

function drawPhaseLabel(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  phases: EclipsePhase[],
  L: Record<string, string>
) {
  const current = phases.find(p => progress >= p.start && progress < p.end) || phases[phases.length - 1];
  const label = L[current.label] || current.label;

  ctx.fillStyle = 'rgba(10,14,39,0.7)';
  ctx.beginPath();
  ctx.roundRect(w * 0.5 - 130, h * 0.83, 260, h * 0.1, 8);
  ctx.fill();

  ctx.fillStyle = '#f0d48a';
  ctx.font = `bold ${Math.floor(h * 0.038)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(label, w * 0.5, h * 0.83 + h * 0.065);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface EclipseSimulatorProps {
  initialMode?: EclipseMode;
  locale?: string;
}

export default function EclipseSimulator({ initialMode = 'solar', locale = 'en' }: EclipseSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);

  const [mode, setMode] = useState<EclipseMode>(initialMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimSpeed>(10);
  const [progress, setProgress] = useState(0);

  const L = LABELS[locale] || LABELS.en;

  // Draw to canvas at given progress
  const draw = useCallback(
    (prog: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mode === 'solar') {
        drawSolarEclipse(ctx, w, h, prog, L);
      } else {
        drawLunarEclipse(ctx, w, h, prog, L);
      }
    },
    [mode, L]
  );

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      draw(progress);
      return;
    }

    lastTimestampRef.current = 0;

    const tick = (ts: number) => {
      if (lastTimestampRef.current === 0) lastTimestampRef.current = ts;
      const delta = (ts - lastTimestampRef.current) / 1000; // seconds
      lastTimestampRef.current = ts;

      // Full cycle = 6s at 1x
      const step = (delta / 6) * speed;
      progressRef.current = progressRef.current + step;
      if (progressRef.current >= 1) {
        progressRef.current = 1;
        setProgress(1);
        setIsPlaying(false);
        draw(1);
        return;
      }
      setProgress(progressRef.current);
      draw(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed, draw, progress]);

  // Redraw when mode changes (even when paused)
  useEffect(() => {
    draw(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Resize observer: keep canvas pixel size correct
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      draw(progressRef.current);
    });
    observer.observe(canvas);
    // Initial size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      draw(0);
    }

    return () => observer.disconnect();
  }, [draw]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    setProgress(0);
    setIsPlaying(false);
    draw(0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    progressRef.current = val;
    setProgress(val);
    draw(val);
  };

  const handleModeChange = (newMode: EclipseMode) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    setProgress(0);
    setIsPlaying(false);
    setMode(newMode);
  };

  const currentPhaseLabel = (() => {
    const phases = mode === 'solar' ? SOLAR_PHASES : LUNAR_PHASES;
    const current = phases.find(p => progress >= p.start && progress < p.end) || phases[phases.length - 1];
    return L[current.label] || current.label;
  })();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 justify-center">
        <button
          onClick={() => handleModeChange('solar')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
            mode === 'solar'
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
              : 'border-gold-primary/20 text-text-secondary hover:border-gold-primary/40 hover:text-gold-primary'
          }`}
        >
          {L.solar}
        </button>
        <button
          onClick={() => handleModeChange('lunar')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
            mode === 'lunar'
              ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300'
              : 'border-gold-primary/20 text-text-secondary hover:border-gold-primary/40 hover:text-gold-primary'
          }`}
        >
          {L.lunar}
        </button>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-gold-primary/15 bg-[#0a0e27]"
           style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
          aria-label={mode === 'solar' ? L.solar : L.lunar}
        />
      </div>

      {/* Phase indicator */}
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-text-secondary/60">{L.phase}: </span>
        <span className="text-sm font-semibold text-gold-light">{currentPhaseLabel}</span>
      </div>

      {/* Timeline scrubber */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        onChange={handleScrub}
        className="w-full accent-gold-primary cursor-pointer"
        aria-label="Timeline"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="px-6 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-semibold hover:bg-gold-primary/25 transition-all"
        >
          {isPlaying ? L.pause : L.play}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl border border-gold-primary/20 text-text-secondary hover:border-gold-primary/40 hover:text-gold-primary transition-all text-sm"
        >
          {L.reset}
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary/70">{L.speed}:</span>
          {([1, 10, 50] as SimSpeed[]).map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                speed === s
                  ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                  : 'border-gold-primary/15 text-text-secondary/60 hover:text-gold-primary'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

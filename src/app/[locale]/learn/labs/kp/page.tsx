'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import { GRAHAS } from '@/lib/constants/grahas';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale } from '@/types/panchang';

// ── Labels ──────────────────────────────────────────────────────
const L = {
  title: { en: 'Lab: KP Sub-Lord Lookup', hi: 'प्रयोगशाला: KP उप-स्वामी खोज', sa: 'प्रयोगशाला: KP उपस्वामिअन्वेषणम्' },
  subtitle: { en: 'Enter any degree (0-360) and see the three-level KP hierarchy: Sign Lord, Star Lord, Sub Lord', hi: 'कोई भी अंश (0-360) दर्ज करें और KP त्रिस्तरीय पदानुक्रम देखें', sa: 'कमपि अंशं (0-360) प्रविष्ट कृत्वा KP त्रिस्तरपदानुक्रमं पश्यतु' },
  degree: { en: 'Degree', hi: 'अंश', sa: 'अंशः' },
  step1: { en: 'Step 1: Sign Lord', hi: 'चरण 1: राशि स्वामी', sa: 'सोपानम् 1: राशिस्वामी' },
  step2: { en: 'Step 2: Star Lord (Nakshatra)', hi: 'चरण 2: नक्षत्र स्वामी', sa: 'सोपानम् 2: नक्षत्रस्वामी' },
  step3: { en: 'Step 3: Sub Lord', hi: 'चरण 3: उप स्वामी', sa: 'सोपानम् 3: उपस्वामी' },
  signLord: { en: 'Sign Lord', hi: 'राशि स्वामी', sa: 'राशिस्वामी' },
  starLord: { en: 'Star Lord', hi: 'नक्षत्र स्वामी', sa: 'नक्षत्रस्वामी' },
  subLord: { en: 'Sub Lord', hi: 'उप स्वामी', sa: 'उपस्वामी' },
  sign: { en: 'Sign', hi: 'राशि', sa: 'राशिः' },
  nakshatra: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  degRange: { en: 'Degree Range', hi: 'अंश सीमा', sa: 'अंशसीमा' },
  ruler: { en: 'Ruler', hi: 'स्वामी', sa: 'स्वामी' },
  proportion: { en: 'Proportion', hi: 'अनुपात', sa: 'अनुपातम्' },
  subTable: { en: 'Sub-Lord Divisions within this Nakshatra', hi: 'इस नक्षत्र में उप-स्वामी विभाजन', sa: 'अस्मिन् नक्षत्रे उपस्वामिविभाजनम्' },
  vimshottari: { en: 'Vimshottari Proportions (Total = 120 years)', hi: 'विंशोत्तरी अनुपात (कुल = 120 वर्ष)', sa: 'विंशोत्तरी अनुपातम् (कुलम् = 120 वर्षाणि)' },
  posInNak: { en: 'Position in Nakshatra', hi: 'नक्षत्र में स्थिति', sa: 'नक्षत्रे स्थितिः' },
  posInSign: { en: 'Position in Sign', hi: 'राशि में स्थिति', sa: 'राश्यां स्थितिः' },
};

// ── Vimshottari data ────────────────────────────────────────────
const VIMSHOTTARI = [
  { id: 8, years: 7,  label: 'Ke' },
  { id: 5, years: 20, label: 'Ve' },
  { id: 0, years: 6,  label: 'Su' },
  { id: 1, years: 10, label: 'Mo' },
  { id: 2, years: 7,  label: 'Ma' },
  { id: 7, years: 18, label: 'Ra' },
  { id: 4, years: 16, label: 'Ju' },
  { id: 6, years: 19, label: 'Sa' },
  { id: 3, years: 17, label: 'Me' },
];

const TOTAL_YEARS = 120;
const NAK_SPAN = 360 / 27;

// Ruler name to Vimshottari index
const RULER_TO_IDX: Record<string, number> = {
  Ketu: 0, Venus: 1, Sun: 2, Moon: 3, Mars: 4, Rahu: 5, Jupiter: 6, Saturn: 7, Mercury: 8,
};

// Sign ruler name to planet id
const SIGN_RULER_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6,
};

interface SubDivision {
  planetId: number;
  startDeg: number;
  endDeg: number;
  spanDeg: number;
  isCurrent: boolean;
}

function computeSubDivisions(nakStart: number, starLordIdx: number, posInNak: number): SubDivision[] {
  // Sub-divisions cycle through Vimshottari starting from the star lord
  const subs: SubDivision[] = [];
  let cursor = nakStart;
  let idx = starLordIdx;
  for (let i = 0; i < 9; i++) {
    const planet = VIMSHOTTARI[idx];
    const span = (planet.years / TOTAL_YEARS) * NAK_SPAN;
    const startDeg = cursor;
    const endDeg = cursor + span;
    const localStart = startDeg - nakStart;
    const localEnd = endDeg - nakStart;
    subs.push({
      planetId: planet.id,
      startDeg,
      endDeg,
      spanDeg: span,
      isCurrent: posInNak >= localStart && posInNak < localEnd,
    });
    cursor = endDeg;
    idx = (idx + 1) % 9;
  }
  return subs;
}

export default function KPSubLordLabPage() {
  const locale = useLocale() as Locale;
  const [degree, setDegree] = useState(45);

  const result = useMemo(() => {
    const deg = ((degree % 360) + 360) % 360;

    // Step 1: Sign
    const signIdx = Math.floor(deg / 30);
    const sign = RASHIS[signIdx];
    const signLordId = SIGN_RULER_TO_ID[sign.ruler];
    const posInSign = deg - signIdx * 30;

    // Step 2: Star (Nakshatra)
    const nakIdx = Math.floor(deg / NAK_SPAN);
    const nak = NAKSHATRAS[nakIdx];
    const nakStart = nakIdx * NAK_SPAN;
    const posInNak = deg - nakStart;
    const starLordIdx = RULER_TO_IDX[nak.ruler];

    // Step 3: Sub Lord
    const subs = computeSubDivisions(nakStart, starLordIdx, posInNak);
    const currentSub = subs.find(s => s.isCurrent) || subs[0];

    return { deg, signIdx, sign, signLordId, posInSign, nakIdx, nak, nakStart, posInNak, starLordIdx, subs, currentSub };
  }, [degree]);

  // 360-degree ring SVG
  const ringSize = 320;
  const cx = ringSize / 2;
  const cy = ringSize / 2;
  const outerR = 145;
  const innerR = 105;
  const needleR = 138;

  function degToXY(d: number, r: number) {
    const rad = ((d - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const SIGN_COLORS = ['#e74c3c', '#2ecc71', '#f39c12', '#3498db', '#e67e22', '#8e44ad', '#e74c3c', '#3498db', '#e67e22', '#2ecc71', '#f39c12', '#8e44ad'];

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
            <Crosshair className="w-4 h-4" />
            <span>Lab 5</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-200 via-purple-100 to-violet-200 bg-clip-text text-transparent mb-3">
            {L.title[locale]}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">{L.subtitle[locale]}</p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 mb-8"
        >
          <label className="block text-sm text-white/50 mb-3">{L.degree[locale]}: <span className="text-violet-300 font-mono text-lg">{degree.toFixed(2)}&deg;</span></label>
          <input
            type="range"
            min={0}
            max={360}
            step={0.01}
            value={degree}
            onChange={(e) => setDegree(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-violet-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/30 mt-2 font-mono">
            <span>0&deg;</span>
            <span>90&deg;</span>
            <span>180&deg;</span>
            <span>270&deg;</span>
            <span>360&deg;</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="number"
              min={0}
              max={360}
              step={0.01}
              value={degree}
              onChange={(e) => setDegree(Math.min(360, Math.max(0, parseFloat(e.target.value) || 0)))}
              className="w-32 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-center focus:border-violet-500/50 focus:outline-none"
            />
            <span className="text-white/40 text-sm">{L.degree[locale]}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: 360-degree ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex items-center justify-center"
          >
            <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
              {/* Sign segments */}
              {RASHIS.map((r, i) => {
                const startAngle = i * 30;
                const endAngle = (i + 1) * 30;
                const s1 = degToXY(startAngle, outerR);
                const s2 = degToXY(endAngle, outerR);
                const s3 = degToXY(endAngle, innerR);
                const s4 = degToXY(startAngle, innerR);
                const isActive = i === result.signIdx;
                const mid = degToXY(startAngle + 15, (outerR + innerR) / 2);
                return (
                  <g key={i}>
                    <path
                      d={`M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 0 1 ${s2.x} ${s2.y} L ${s3.x} ${s3.y} A ${innerR} ${innerR} 0 0 0 ${s4.x} ${s4.y} Z`}
                      fill={isActive ? SIGN_COLORS[i] + '40' : SIGN_COLORS[i] + '15'}
                      stroke={isActive ? SIGN_COLORS[i] : 'rgba(255,255,255,0.1)'}
                      strokeWidth={isActive ? 2 : 0.5}
                    />
                    <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="central" fill={isActive ? '#fff' : 'rgba(255,255,255,0.3)'} fontSize={11}>
                      {r.symbol}
                    </text>
                  </g>
                );
              })}
              {/* Nakshatra ticks */}
              {Array.from({ length: 27 }, (_, i) => {
                const angle = i * NAK_SPAN;
                const p1 = degToXY(angle, innerR);
                const p2 = degToXY(angle, innerR - 8);
                const isActive = i === result.nakIdx;
                return (
                  <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={isActive ? '#a78bfa' : 'rgba(255,255,255,0.1)'} strokeWidth={isActive ? 2 : 0.5} />
                );
              })}
              {/* Needle */}
              {(() => {
                const tip = degToXY(result.deg, needleR);
                const base1 = degToXY(result.deg - 2, 20);
                const base2 = degToXY(result.deg + 2, 20);
                return (
                  <>
                    <polygon points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${base2.x},${base2.y}`} fill="#a78bfa" opacity={0.8} />
                    <circle cx={cx} cy={cy} r={6} fill="#a78bfa" />
                    <circle cx={tip.x} cy={tip.y} r={3} fill="#fff" />
                  </>
                );
              })()}
              {/* Center text */}
              <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={10}>KP</text>
              <text x={cx} y={cy + 8} textAnchor="middle" fill="#a78bfa" fontSize={13} fontWeight="bold" fontFamily="monospace">{result.deg.toFixed(2)}&deg;</text>
            </svg>
          </motion.div>

          {/* Right: Three-level hierarchy */}
          <div className="space-y-4">
            {/* Step 1: Sign Lord */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5"
            >
              <h3 className="text-sm font-bold text-violet-300 mb-3">{L.step1[locale]}</h3>
              <div className="text-xs text-white/40 font-mono mb-2">
                floor({result.deg.toFixed(2)} / 30) = sign #{result.signIdx + 1}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                  {result.sign.symbol}
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">{result.sign.name[locale]}</div>
                  <div className="text-sm text-white/50">
                    {L.signLord[locale]}: <span className="text-violet-300">{GRAHAS[result.signLordId].symbol} {GRAHAS[result.signLordId].name[locale]}</span>
                  </div>
                  <div className="text-xs text-white/30 font-mono mt-1">
                    {L.posInSign[locale]}: {result.posInSign.toFixed(2)}&deg; / 30&deg;
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Star Lord */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5"
            >
              <h3 className="text-sm font-bold text-violet-300 mb-3">{L.step2[locale]}</h3>
              <div className="text-xs text-white/40 font-mono mb-2">
                floor({result.deg.toFixed(2)} / {NAK_SPAN.toFixed(4)}) = nak #{result.nakIdx + 1}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                  {GRAHAS[VIMSHOTTARI[result.starLordIdx].id].symbol}
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">{result.nak.name[locale]}</div>
                  <div className="text-sm text-white/50">
                    {L.starLord[locale]}: <span className="text-violet-300">{GRAHAS[VIMSHOTTARI[result.starLordIdx].id].name[locale]}</span>
                  </div>
                  <div className="text-xs text-white/30 font-mono mt-1">
                    {L.posInNak[locale]}: {result.posInNak.toFixed(2)}&deg; / {NAK_SPAN.toFixed(2)}&deg;
                  </div>
                </div>
              </div>
              {/* Position bar in nakshatra */}
              <div className="mt-3 relative h-4 rounded-full bg-white/5 overflow-hidden">
                <div className="absolute left-0 top-0 h-full rounded-full bg-violet-500/30" style={{ width: `${(result.posInNak / NAK_SPAN) * 100}%` }} />
                <div className="absolute top-0 h-full w-0.5 bg-violet-400" style={{ left: `${(result.posInNak / NAK_SPAN) * 100}%` }} />
              </div>
            </motion.div>

            {/* Step 3: Sub Lord */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="rounded-2xl border border-violet-500/20 bg-violet-500/5 backdrop-blur-md p-5"
            >
              <h3 className="text-sm font-bold text-violet-300 mb-3">{L.step3[locale]}</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-2xl">
                  {GRAHAS[result.currentSub.planetId].symbol}
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">{GRAHAS[result.currentSub.planetId].name[locale]}</div>
                  <div className="text-sm text-white/50">
                    {L.subLord[locale]}
                  </div>
                  <div className="text-xs text-white/30 font-mono mt-1">
                    {result.currentSub.startDeg.toFixed(4)}&deg; &mdash; {result.currentSub.endDeg.toFixed(4)}&deg;
                    ({result.currentSub.spanDeg.toFixed(4)}&deg;)
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary: three levels */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              {[
                { label: L.signLord[locale], id: result.signLordId },
                { label: L.starLord[locale], id: VIMSHOTTARI[result.starLordIdx].id },
                { label: L.subLord[locale], id: result.currentSub.planetId },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/20 text-lg">&rarr;</span>}
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl mx-auto mb-1">
                      {GRAHAS[item.id].symbol}
                    </div>
                    <div className="text-[10px] text-white/40">{item.label}</div>
                    <div className="text-xs text-white font-semibold">{GRAHAS[item.id].name[locale]}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Sub-division table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
        >
          <h2 className="text-lg font-bold text-violet-300 mb-4">{L.subTable[locale]}: {result.nak.name[locale]}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs border-b border-white/5">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">{L.ruler[locale]}</th>
                  <th className="text-left py-2 px-3">{L.degRange[locale]}</th>
                  <th className="text-right py-2 px-3">{L.proportion[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {result.subs.map((sub, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 transition-all ${
                      sub.isCurrent ? 'bg-violet-500/10' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-white/30">{i + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{GRAHAS[sub.planetId].symbol}</span>
                        <span className={sub.isCurrent ? 'text-violet-300 font-semibold' : 'text-white'}>
                          {GRAHAS[sub.planetId].name[locale]}
                        </span>
                        {sub.isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">ACTIVE</span>}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-white/60">
                      {sub.startDeg.toFixed(4)}&deg; &mdash; {sub.endDeg.toFixed(4)}&deg;
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-xs text-white/50">
                      {VIMSHOTTARI.find(v => v.id === sub.planetId)?.years}/{TOTAL_YEARS} = {sub.spanDeg.toFixed(4)}&deg;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Vimshottari proportions reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
        >
          <h2 className="text-lg font-bold text-violet-300 mb-4">{L.vimshottari[locale]}</h2>
          <div className="flex rounded-xl overflow-hidden h-10 border border-white/10 mb-4">
            {VIMSHOTTARI.map((v, i) => {
              const pct = (v.years / TOTAL_YEARS) * 100;
              return (
                <div
                  key={i}
                  className="relative flex items-center justify-center text-xs font-bold overflow-hidden"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: GRAHAS[v.id].color + '55',
                    borderRight: i < 8 ? '1px solid rgba(255,255,255,0.1)' : undefined,
                  }}
                  title={`${GRAHAS[v.id].name.en}: ${v.years} years`}
                >
                  {pct > 5 && <span className="text-white/70">{v.label}</span>}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center">
            {VIMSHOTTARI.map((v, i) => (
              <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="text-lg">{GRAHAS[v.id].symbol}</div>
                <div className="text-xs text-white/50">{v.label}</div>
                <div className="text-sm font-mono text-white font-bold">{v.years}yr</div>
                <div className="text-[10px] text-white/30">{((v.years / TOTAL_YEARS) * NAK_SPAN).toFixed(3)}&deg;</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

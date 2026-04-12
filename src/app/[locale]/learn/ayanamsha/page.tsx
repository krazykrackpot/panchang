'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { getHeadingFont } from '@/lib/utils/locale-fonts';
import L from '@/messages/learn/ayanamsha.json';

const T = L as unknown as Record<string, LocaleText>;

export default function AyanamshaPage() {
  const locale = useLocale();
  const t = (key: string) => lt(T[key], locale);
  const hf = getHeadingFont(locale);

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {t('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {t('subtitle')}
        </p>
      </div>

      {/* ═══ WHAT IS PRECESSION? ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {t('precessionTitle')}
        </h3>

        {/* Spinning top analogy + SVG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {t('precessionAnalogy')}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-text-secondary">{t('rateLabel')}</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-text-secondary">{t('fullCycleLabel')}</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-text-secondary">{t('causeLabel')}</span></div>
            </div>
          </div>

          {/* Precession cone SVG */}
          <div className="flex justify-center">
            <svg viewBox="0 0 300 280" className="w-full max-w-[280px]">
              {/* Background */}
              <defs>
                <linearGradient id="axisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f0d48a" />
                  <stop offset="100%" stopColor="#8a6d2b" />
                </linearGradient>
                <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4a9eff" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Earth */}
              <circle cx="150" cy="180" r="35" fill="none" stroke="#4a9eff" strokeWidth="1.5" opacity="0.4" />
              <ellipse cx="150" cy="180" rx="35" ry="10" fill="none" stroke="#2ecc71" strokeWidth="0.8" opacity="0.3" />
              <text x="150" y="184" textAnchor="middle" fill="#4a9eff" fontSize="8" opacity="0.6">Earth</text>

              {/* Precession cone */}
              <ellipse cx="150" cy="50" rx="60" ry="20" fill="none" stroke="#f0d48a" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

              {/* Current axis */}
              <line x1="150" y1="180" x2="120" y2="30" stroke="url(#axisGrad)" strokeWidth="2" />
              <circle cx="120" cy="30" r="4" fill="#f0d48a" />
              <text x="105" y="22" fill="#f0d48a" fontSize="8" fontWeight="bold">North Pole</text>

              {/* Cone lines */}
              <line x1="150" y1="180" x2="90" y2="50" stroke="#f0d48a" strokeWidth="0.5" opacity="0.2" />
              <line x1="150" y1="180" x2="210" y2="50" stroke="#f0d48a" strokeWidth="0.5" opacity="0.2" />

              {/* Arrow on ellipse showing direction */}
              <path d="M 175 35 L 185 40 L 178 44" fill="none" stroke="#f0d48a" strokeWidth="1" />

              {/* Labels */}
              <text x="150" y="72" textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.7">Precession circle</text>
              <text x="150" y="82" textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.5">~25,772 years</text>

              {/* Tilt angle */}
              <line x1="150" y1="180" x2="150" y2="120" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
              <path d="M 150 140 Q 145 135 140 132" fill="none" stroke="#ff6b6b" strokeWidth="0.8" />
              <text x="132" y="140" fill="#ff6b6b" fontSize="7">23.5°</text>

              {/* Polaris marker */}
              <text x="118" y="12" fill="#f0d48a" fontSize="6" opacity="0.5">{t('polarisSvg')}</text>

              {/* Vega marker (future pole star) */}
              <circle cx="180" cy="38" r="2" fill="#4a9eff" opacity="0.4" />
              <text x="192" y="42" fill="#4a9eff" fontSize="6" opacity="0.5">{t('vegaSvg')}</text>
            </svg>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-indigo-500/15">
          <p className="text-text-secondary text-xs leading-relaxed">
            {t('precessionNote')}
          </p>
        </div>
      </div>

      {/* ═══ THE TWO ZODIACS ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {t('twoZodiacsTitle')}
        </h3>

        {/* Enhanced Ayanamsha diagram */}
        <svg viewBox="0 0 600 320" className="w-full max-w-2xl mx-auto mb-6">
          {/* Tropical zodiac ring */}
          <circle cx="300" cy="160" r="130" fill="none" stroke="#4a9eff" strokeWidth="2" opacity="0.3" />
          <text x="300" y="20" textAnchor="middle" fill="#4a9eff" fontSize="12" fontWeight="bold">{t('tropicalSvgLabel')}</text>
          <text x="300" y="34" textAnchor="middle" fill="#4a9eff" fontSize="9" opacity="0.6">{t('tropicalSvgSub')}</text>

          {/* Sidereal zodiac ring (slightly rotated) */}
          <g transform="rotate(-24, 300, 160)">
            <circle cx="300" cy="160" r="120" fill="none" stroke="#f0d48a" strokeWidth="2" opacity="0.3" />
          </g>
          <text x="300" y="300" textAnchor="middle" fill="#f0d48a" fontSize="12" fontWeight="bold">{t('siderealSvgLabel')}</text>
          <text x="300" y="314" textAnchor="middle" fill="#f0d48a" fontSize="9" opacity="0.6">{t('siderealSvgSub')}</text>

          {/* Sign markers - Tropical */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = 300 + 130 * Math.cos(angle);
            const y = 160 + 130 * Math.sin(angle);
            const signs = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
            return <text key={i} x={x} y={y} textAnchor="middle" fill="#4a9eff" fontSize="7" opacity="0.5">{signs[i]}</text>;
          })}

          {/* Ayanamsha arc */}
          <path d="M 430 160 A 130 130 0 0 0 420 105" fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
          <text x="445" y="130" fill="#ff6b6b" fontSize="13" fontWeight="bold">~24°</text>
          <text x="445" y="145" fill="#ff6b6b" fontSize="9">{t('ayanamshaSvg')}</text>

          {/* Equinox point */}
          <circle cx="430" cy="160" r="5" fill="#4a9eff" />
          <text x="455" y="165" fill="#4a9eff" fontSize="8">{t('equinoxSvg')}</text>

          {/* Example: "Your Sun" */}
          <g>
            <circle cx="360" cy="60" r="8" fill="#e67e22" opacity="0.8" />
            <text x="360" y="64" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">☉</text>
            <line x1="370" y1="65" x2="420" y2="80" stroke="#e67e22" strokeWidth="0.5" strokeDasharray="3 2" />
            <text x="430" y="75" fill="#e67e22" fontSize="8">{t('sunTropicalSvg')}</text>
            <text x="430" y="87" fill="#f0d48a" fontSize="8">{t('sunSiderealSvg')}</text>
          </g>
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-400 font-bold text-sm mb-2">{t('tropicalCardTitle')}</div>
            <ul className="text-text-secondary text-xs space-y-1.5 leading-relaxed">
              <li>• {t('tropicalBullet1')}</li>
              <li>• {t('tropicalBullet2')}</li>
              <li>• {t('tropicalBullet3')}</li>
              <li>• {t('tropicalBullet4')}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
            <div className="text-gold-light font-bold text-sm mb-2">{t('siderealCardTitle')}</div>
            <ul className="text-text-secondary text-xs space-y-1.5 leading-relaxed">
              <li>• {t('siderealBullet1')}</li>
              <li>• {t('siderealBullet2')}</li>
              <li>• {t('siderealBullet3')}</li>
              <li>• {t('siderealBullet4')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══ THE FORMULA ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {t('calculationTitle')}
        </h3>

        <div className="p-4 bg-bg-primary/80 rounded-xl border border-gold-primary/10 font-mono text-sm mb-6">
          <div className="text-gold-light mb-2">{t('formulaComment')}</div>
          <div className="text-emerald-300">T = (JD − 2451545.0) / 36525.0  <span className="text-text-tertiary">// centuries from J2000.0</span></div>
          <div className="text-emerald-300 mt-1">Ayanamsha = 23.85306° + 1.39722° × T + 0.00018° × T² − 0.000005° × T³</div>
          <div className="text-text-tertiary text-xs mt-3">{t('formulaJ2000')}</div>
          <div className="text-text-tertiary text-xs">{t('formulaRate')}</div>
        </div>

        {/* Worked example */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 mb-6">
          <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">{t('workedExampleTitle')}</div>
          <div className="font-mono text-xs text-text-secondary space-y-1.5">
            <div>1. JD for Jan 1, 2026 = 2461041.5</div>
            <div>2. T = (2461041.5 − 2451545.0) / 36525.0 = <span className="text-gold-light">0.26003</span></div>
            <div>3. Ayanamsha = 23.85306 + 1.39722 × 0.26003 + 0.00018 × 0.26003²</div>
            <div>   = 23.85306 + 0.36330 + 0.00001</div>
            <div>   = <span className="text-gold-light font-bold">24.2164°</span></div>
            <div className="text-emerald-300 mt-2">{t('workedExampleResult')}</div>
          </div>
        </div>

        {/* Your sign might be different! */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
          <div className="text-red-400 font-bold text-sm mb-2">
            {t('signChangeWarning')}
          </div>
          <p className="text-text-secondary text-xs leading-relaxed mb-3">
            {t('signChangeDesc')}
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12">
              <div className="text-blue-400 font-bold">Western</div>
              <div className="text-text-secondary">Aries ♈ (15°)</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10">
              <div className="text-red-400 font-bold">−24.2°</div>
              <div className="text-text-tertiary">Ayanamsha</div>
            </div>
            <div className="p-2 rounded-lg bg-gold-primary/10">
              <div className="text-gold-light font-bold">Vedic</div>
              <div className="text-text-secondary">Pisces ♓ (20.8°)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ AYANAMSHA SYSTEMS ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {t('systemsTitle')}
        </h3>
        <p className="text-text-secondary text-xs mb-4 leading-relaxed">
          {t('systemsIntro')}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark">{t('tableSystem')}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{t('tableValue')}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{t('tableReference')}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{t('tableUsage')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { name: 'Lahiri (Chitrapaksha)', value: '24.22°', refKey: 'lahiriRef', useKey: 'lahiriUse', highlight: true },
                { name: 'KP (Krishnamurti)', value: '24.13°', refKey: 'kpRef', useKey: 'kpUse', highlight: false },
                { name: 'Raman', value: '22.82°', refKey: 'ramanRef', useKey: 'ramanUse', highlight: false },
                { name: 'BV Raman', value: '22.73°', refKey: 'bvRamanRef', useKey: 'bvRamanUse', highlight: false },
                { name: 'Yukteshwar', value: '22.09°', refKey: 'yukteshwarRef', useKey: 'yukteshwarUse', highlight: false },
                { name: 'Fagan-Bradley', value: '24.87°', refKey: 'faganRef', useKey: 'faganUse', highlight: false },
              ].map((sys, i) => (
                <tr key={i} className={`hover:bg-gold-primary/3 ${sys.highlight ? 'bg-gold-primary/5' : ''}`}>
                  <td className={`py-2 px-3 font-medium ${sys.highlight ? 'text-gold-light' : 'text-text-primary'}`}>{sys.name}</td>
                  <td className="py-2 px-3 text-gold-light font-mono">{sys.value}</td>
                  <td className="py-2 px-3 text-text-secondary">{t(sys.refKey)}</td>
                  <td className="py-2 px-3 text-text-secondary">{t(sys.useKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-text-tertiary text-xs mt-3">
          {t('systemsNote')}
        </p>
      </div>

      {/* ═══ HISTORICAL TIMELINE ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>
          {t('historyTitle')}
        </h3>
        <div className="space-y-3">
          {[
            { year: '~500 BCE', eventKey: 'history500bce', color: 'border-emerald-500/20' },
            { year: '~285 CE', eventKey: 'history285ce', color: 'border-amber-500/20' },
            { year: '505 CE', eventKey: 'history505ce', color: 'border-amber-500/20' },
            { year: '1956 CE', eventKey: 'history1956ce', color: 'border-gold-primary/30' },
            { year: '2026 CE', eventKey: 'history2026ce', color: 'border-blue-500/20' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className={`flex gap-4 p-3 rounded-xl border ${item.color}`}>
              <div className="text-gold-light font-mono text-xs font-bold w-20 shrink-0">{item.year}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{t(item.eventKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ WHY IT MATTERS ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={hf}>
          {t('impactTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
            <div className="text-gold-light font-bold text-sm mb-2">{t('impactPlanetsTitle')}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('impactPlanetsDesc')}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
            <div className="text-gold-light font-bold text-sm mb-2">{t('impactLagnaTitle')}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('impactLagnaDesc')}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
            <div className="text-gold-light font-bold text-sm mb-2">{t('impactDashaTitle')}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{t('impactDashaDesc')}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a href={`/${locale}/panchang`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors text-sm">
          {t('ctaButton')}
        </a>
      </div>
    </div>
  );
}

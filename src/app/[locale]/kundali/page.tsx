'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import BirthForm from '@/components/kundali/BirthForm';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { KundaliData, BirthData, ChartStyle, PlanetPosition, AshtakavargaData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

// Planet colors for table highlights
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

function HouseDetailPanel({
  houseNum,
  kundali,
  locale,
  isDevanagari,
  onClose,
}: {
  houseNum: number;
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  onClose: () => void;
}) {
  const house = kundali.houses.find(h => h.house === houseNum);
  const planetsInHouse = kundali.planets.filter(p => p.house === houseNum);
  const signNum = house?.sign || 1;
  const rashi = RASHIS[signNum - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="glass-card rounded-xl p-6 border border-gold-primary/30"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <RashiIconById id={signNum} size={48} />
          <div>
            <h3 className="text-gold-light text-xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
              {locale === 'en' ? `House ${houseNum}` : `भाव ${houseNum}`}
              {houseNum === 1 && <span className="text-gold-primary ml-2 text-sm">({locale === 'en' ? 'Ascendant' : 'लग्न'})</span>}
            </h3>
            <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {rashi?.name[locale]} &mdash; {locale === 'en' ? 'Lord' : 'स्वामी'}: {house?.lordName[locale]}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-gold-light transition-colors text-xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      {planetsInHouse.length > 0 ? (
        <div className="space-y-3">
          {planetsInHouse.map((p) => (
            <PlanetDetailRow key={p.planet.id} planet={p} locale={locale} isDevanagari={isDevanagari} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary/50 text-center py-4">
          {locale === 'en' ? 'No planets in this house' : 'इस भाव में कोई ग्रह नहीं'}
        </p>
      )}

      {/* House significations */}
      <div className="mt-4 pt-4 border-t border-gold-primary/10">
        <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Significations' : 'कारकत्व'}</p>
        <p className="text-text-secondary text-sm">{getHouseSignifications(houseNum, locale)}</p>
      </div>
    </motion.div>
  );
}

function PlanetDetailRow({ planet: p, locale, isDevanagari }: { planet: PlanetPosition; locale: Locale; isDevanagari: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:border-gold-primary/25 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
      >
        <GrahaIconById id={p.planet.id} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
              {p.planet.name[locale]}
            </span>
            {p.isRetrograde && <span className="text-red-400 text-xs font-bold px-1.5 py-0.5 bg-red-500/10 rounded">R</span>}
            {p.isExalted && <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">{locale === 'en' ? 'Exalted' : 'उच्च'}</span>}
            {p.isDebilitated && <span className="text-orange-400 text-xs font-bold px-1.5 py-0.5 bg-orange-500/10 rounded">{locale === 'en' ? 'Debilitated' : 'नीच'}</span>}
            {p.isOwnSign && <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">{locale === 'en' ? 'Own Sign' : 'स्वगृह'}</span>}
          </div>
          <div className="text-text-secondary text-xs mt-0.5">
            <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.signName[locale]}</span>
            <span className="mx-1.5 text-gold-dark/30">|</span>
            <span className="font-mono">{p.degree}</span>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 ml-12 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' ? 'Nakshatra' : 'नक्षत्र'}</span>
                <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {p.nakshatra.name[locale]} ({locale === 'en' ? 'Pada' : 'पाद'} {p.pada})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' ? 'Speed' : 'गति'}</span>
                <span className="text-text-secondary font-mono">{p.speed.toFixed(4)}°/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' ? 'Longitude' : 'अंश'}</span>
                <span className="text-text-secondary font-mono">{p.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getHouseSignifications(house: number, locale: Locale): string {
  const sigs: Record<number, { en: string; hi: string }> = {
    1: { en: 'Self, personality, physical body, appearance, vitality', hi: 'आत्म, व्यक्तित्व, शरीर, रूप, जीवन शक्ति' },
    2: { en: 'Wealth, family, speech, food, early education', hi: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा' },
    3: { en: 'Courage, siblings, communication, short journeys', hi: 'साहस, भाई-बहन, संवाद, छोटी यात्राएँ' },
    4: { en: 'Mother, home, property, vehicles, emotional peace', hi: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति' },
    5: { en: 'Children, intelligence, creativity, romance, past merit', hi: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वपुण्य' },
    6: { en: 'Enemies, disease, debts, service, daily work', hi: 'शत्रु, रोग, ऋण, सेवा, दैनिक कार्य' },
    7: { en: 'Marriage, partnerships, business, public dealings', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार' },
    8: { en: 'Longevity, transformation, occult, inheritance, obstacles', hi: 'आयु, परिवर्तन, गुप्त विद्या, विरासत, बाधाएँ' },
    9: { en: 'Fortune, dharma, father, higher education, pilgrimage', hi: 'भाग्य, धर्म, पिता, उच्च शिक्षा, तीर्थयात्रा' },
    10: { en: 'Career, fame, authority, government, public image', hi: 'करियर, यश, अधिकार, शासन, सार्वजनिक छवि' },
    11: { en: 'Gains, income, elder siblings, wishes fulfilled', hi: 'लाभ, आय, बड़े भाई-बहन, इच्छा पूर्ति' },
    12: { en: 'Expenses, losses, foreign lands, liberation, sleep', hi: 'व्यय, हानि, विदेश, मोक्ष, निद्रा' },
  };
  return sigs[house]?.[locale === 'en' ? 'en' : 'hi'] || '';
}

export default function KundaliPage() {
  const t = useTranslations('kundali');
  const tTip = useTranslations('tippanni');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'ashtakavarga' | 'tippanni'>('chart');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<'D1' | 'D9' | 'bhav_chalit' | 'D3' | 'D10' | 'D12'>('D1');

  const handleGenerate = async (birthData: BirthData, style: ChartStyle) => {
    setLoading(true);
    setChartStyle(style);
    setSelectedHouse(null);
    setSelectedPlanet(null);
    try {
      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData),
      });
      const data = await res.json();
      setKundali(data);
    } catch (e) {
      console.error('Kundali generation failed:', e);
    }
    setLoading(false);
  };

  const handleSelectHouse = (house: number) => {
    setSelectedHouse(prev => prev === house ? null : house);
    setSelectedPlanet(null);
  };

  const handleSelectPlanet = (planetId: number) => {
    setSelectedPlanet(prev => prev === planetId ? null : planetId);
    if (kundali) {
      const p = kundali.planets.find(pl => pl.planet.id === planetId);
      if (p) setSelectedHouse(p.house);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg">{t('subtitle')}</p>
      </motion.div>

      <BirthForm onSubmit={handleGenerate} loading={loading} />

      {kundali && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-16">
          <GoldDivider />

          {/* Birth details header */}
          <div className="glass-card rounded-xl p-6 mb-8 text-center">
            <h2 className="text-gold-light text-2xl font-semibold mb-2" style={headingFont}>
              {kundali.birthData.name || (locale === 'en' ? 'Birth Chart' : 'जन्म कुण्डली')}
            </h2>
            <p className="text-text-secondary text-sm">
              {kundali.birthData.date} | {kundali.birthData.time} | {kundali.birthData.place}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <RashiIconById id={kundali.ascendant.sign} size={28} />
              <span className="text-gold-primary text-base font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {locale === 'en' ? 'Ascendant' : 'लग्न'}: {kundali.ascendant.signName[locale]} ({kundali.ascendant.degree.toFixed(2)}°)
              </span>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {([
              { key: 'chart' as const, label: t('birthChart') },
              { key: 'planets' as const, label: t('planetPositions') },
              { key: 'dasha' as const, label: t('dashaTimeline') },
              { key: 'ashtakavarga' as const, label: t('ashtakavarga') },
              { key: 'tippanni' as const, label: t('tippanni') },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedHouse(null); setSelectedPlanet(null); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                    : 'text-text-secondary hover:text-text-primary border border-transparent hover:border-gold-primary/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ===== CHART TAB ===== */}
          {activeTab === 'chart' && (
            <div>
              {/* Chart type selector */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {([
                  { key: 'D1' as const, label: t('birthChart') },
                  { key: 'D9' as const, label: t('navamsha') },
                  { key: 'bhav_chalit' as const, label: t('bhavChalit') },
                  { key: 'D3' as const, label: t('drekkana') },
                  { key: 'D10' as const, label: t('dasamsa') },
                  { key: 'D12' as const, label: t('dwadasamsa') },
                ]).map(c => (
                  <button key={c.key} onClick={() => setActiveChart(c.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeChart === c.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Style toggle */}
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setChartStyle('north')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('north')}
                </button>
                <button onClick={() => setChartStyle('south')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('south')}
                </button>
              </div>

              <p className="text-text-secondary/50 text-xs text-center mb-6">
                {locale === 'en' ? 'Click on any house to see details' : 'विवरण देखने के लिए किसी भाव पर क्लिक करें'}
              </p>

              {/* Chart display */}
              {(() => {
                const chartData = activeChart === 'D1' ? kundali.chart
                  : activeChart === 'D9' ? kundali.navamshaChart
                  : activeChart === 'bhav_chalit' ? (kundali.bhavChalitChart || kundali.chart)
                  : kundali.divisionalCharts?.[activeChart]
                    ? kundali.divisionalCharts[activeChart]
                    : kundali.chart;

                const chartTitle = activeChart === 'D1' ? t('birthChart')
                  : activeChart === 'D9' ? t('navamsha')
                  : activeChart === 'bhav_chalit' ? t('bhavChalit')
                  : kundali.divisionalCharts?.[activeChart]?.label[locale] || activeChart;

                // Show selected chart + D1 side by side (unless D1 is already selected)
                const showD1Companion = activeChart !== 'D1';

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
                    {chartStyle === 'north' ? (
                      <>
                        {showD1Companion && <ChartNorth data={kundali.chart} title={t('birthChart')} size={500} selectedHouse={selectedHouse} onSelectHouse={handleSelectHouse} />}
                        <ChartNorth data={chartData} title={chartTitle} size={500} selectedHouse={showD1Companion ? null : selectedHouse} onSelectHouse={showD1Companion ? undefined : handleSelectHouse} />
                        {!showD1Companion && <ChartNorth data={kundali.navamshaChart} title={t('navamsha')} size={500} selectedHouse={null} />}
                      </>
                    ) : (
                      <>
                        {showD1Companion && <ChartSouth data={kundali.chart} title={t('birthChart')} size={500} selectedHouse={selectedHouse} onSelectHouse={handleSelectHouse} />}
                        <ChartSouth data={chartData} title={chartTitle} size={500} selectedHouse={showD1Companion ? null : selectedHouse} onSelectHouse={showD1Companion ? undefined : handleSelectHouse} />
                        {!showD1Companion && <ChartSouth data={kundali.navamshaChart} title={t('navamsha')} size={500} selectedHouse={null} />}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Planet legend below charts */}
              <div className="mt-8 glass-card rounded-xl p-5">
                <h4 className="text-gold-dark text-xs uppercase tracking-wider mb-4 text-center">{locale === 'en' ? 'Planets in Chart' : 'कुण्डली में ग्रह'}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {kundali.planets.map((p) => (
                    <motion.button
                      key={p.planet.id}
                      onClick={() => handleSelectPlanet(p.planet.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                        selectedPlanet === p.planet.id
                          ? 'border-gold-primary/50 bg-gold-primary/10'
                          : 'border-gold-primary/10 hover:border-gold-primary/25 bg-bg-primary/40'
                      }`}
                    >
                      <GrahaIconById id={p.planet.id} size={28} />
                      <div className="text-left">
                        <div className="text-sm font-bold" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>
                          {p.planet.name[locale]}
                        </div>
                        <div className="text-text-secondary text-[10px]" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {p.signName[locale]} &middot; H{p.house}
                          {p.isRetrograde ? ' (R)' : ''}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Selected house detail panel */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {selectedHouse && (
                    <HouseDetailPanel
                      key={selectedHouse}
                      houseNum={selectedHouse}
                      kundali={kundali}
                      locale={locale}
                      isDevanagari={isDevanagari}
                      onClose={() => { setSelectedHouse(null); setSelectedPlanet(null); }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ===== PLANETS TAB ===== */}
          {activeTab === 'planets' && (
            <div className="space-y-3">
              {kundali.planets.map((p) => (
                <motion.div
                  key={p.planet.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: p.planet.id * 0.04 }}
                  onClick={() => handleSelectPlanet(p.planet.id)}
                  className={`glass-card rounded-xl p-4 cursor-pointer transition-all border ${
                    selectedPlanet === p.planet.id
                      ? 'border-gold-primary/40 bg-gold-primary/5'
                      : 'border-transparent hover:border-gold-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <GrahaIconById id={p.planet.id} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                          {p.planet.name[locale]}
                        </span>
                        {p.isRetrograde && <span className="text-red-400 text-xs font-bold px-1.5 py-0.5 bg-red-500/10 rounded">R</span>}
                        {p.isExalted && <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">{locale === 'en' ? 'Exalted' : 'उच्च'}</span>}
                        {p.isDebilitated && <span className="text-orange-400 text-xs font-bold px-1.5 py-0.5 bg-orange-500/10 rounded">{locale === 'en' ? 'Debilitated' : 'नीच'}</span>}
                        {p.isOwnSign && <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">{locale === 'en' ? 'Own Sign' : 'स्वगृह'}</span>}
                      </div>
                      <div className="text-text-secondary text-sm mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                        <span>
                          <span className="text-gold-dark">{locale === 'en' ? 'Sign:' : 'राशि:'}</span>{' '}
                          <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.signName[locale]}</span>
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' ? 'House:' : 'भाव:'}</span> {p.house}
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' ? 'Degree:' : 'अंश:'}</span>{' '}
                          <span className="font-mono">{p.degree}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {p.nakshatra.name[locale]}
                      </div>
                      <div className="text-gold-dark/60 text-xs">
                        {locale === 'en' ? 'Pada' : 'पाद'} {p.pada}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPlanet === p.planet.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gold-primary/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' ? 'Nakshatra' : 'नक्षत्र'}</span>
                            <p className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {p.nakshatra.name[locale]} (P{p.pada})
                            </p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' ? 'Longitude' : 'अंश'}</span>
                            <p className="text-text-secondary font-mono">{p.longitude.toFixed(4)}°</p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' ? 'Speed' : 'गति'}</span>
                            <p className="text-text-secondary font-mono">{p.speed.toFixed(4)}°/d</p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' ? 'Latitude' : 'अक्षांश'}</span>
                            <p className="text-text-secondary font-mono">{p.latitude.toFixed(4)}°</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {/* ===== DASHA TAB ===== */}
          {activeTab === 'dasha' && (
            <div className="space-y-3">
              <h3 className="text-gold-gradient text-xl font-bold mb-6 text-center" style={headingFont}>{t('dashaTimeline')}</h3>
              {kundali.dashas.map((dasha, i) => {
                const now = new Date();
                const start = new Date(dasha.startDate);
                const end = new Date(dasha.endDate);
                const isCurrent = now >= start && now <= end;
                const isPast = now > end;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className={`glass-card rounded-xl p-5 ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark'}`} />
                        <span className="text-gold-light font-semibold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{dasha.planetName[locale]}</span>
                        {isCurrent && <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-xs rounded-full">{tTip('currentPeriod')}</span>}
                      </div>
                      <span className="text-text-secondary text-sm font-mono">{dasha.startDate} &rarr; {dasha.endDate}</span>
                    </div>
                    {isCurrent && dasha.subPeriods && (
                      <div className="mt-4 pl-6 border-l border-gold-primary/20 space-y-2">
                        {dasha.subPeriods.map((sub, j) => {
                          const subStart = new Date(sub.startDate);
                          const subEnd = new Date(sub.endDate);
                          const isSubCurrent = now >= subStart && now <= subEnd;
                          return (
                            <div key={j} className={`flex items-center justify-between text-sm py-1 ${isSubCurrent ? 'text-gold-light' : 'text-text-secondary'}`}>
                              <span className="flex items-center gap-2">
                                {isSubCurrent && <span className="w-2 h-2 rounded-full bg-gold-primary" />}
                                <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{sub.planetName[locale]}</span>
                              </span>
                              <span className="font-mono text-xs">{sub.startDate} &rarr; {sub.endDate}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ===== ASHTAKAVARGA TAB ===== */}
          {activeTab === 'ashtakavarga' && kundali.ashtakavarga && (
            <AshtakavargaTab ashtakavarga={kundali.ashtakavarga} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} t={t} />
          )}

          {/* ===== TIPPANNI TAB ===== */}
          {activeTab === 'tippanni' && <TippanniTab kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tTip={tTip} />}
        </motion.div>
      )}
    </div>
  );
}

function AshtakavargaTab({ ashtakavarga, locale, isDevanagari, headingFont, t }: {
  ashtakavarga: AshtakavargaData; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; t: (key: string) => string;
}) {
  const [viewMode, setViewMode] = useState<'sav' | 'bpi'>('sav');

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{t('ashtakavarga')}</h3>

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => setViewMode('sav')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'sav' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          {t('sarvashtakavarga')}
        </button>
        <button onClick={() => setViewMode('bpi')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'bpi' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          {t('bhinnashtakavarga')}
        </button>
      </div>

      {viewMode === 'sav' ? (
        <div className="glass-card rounded-xl p-6 overflow-x-auto">
          <h4 className="text-gold-light text-lg font-semibold mb-4" style={headingFont}>{t('sarvashtakavarga')}</h4>
          <p className="text-text-secondary text-xs mb-4">
            {locale === 'en' ? 'Total bindu points per sign from all 7 planets. Houses with 28+ points are strong.' : 'सभी 7 ग्रहों के कुल बिन्दु प्रति राशि। 28+ बिन्दु वाले भाव बलवान हैं।'}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {RASHIS.map((r, i) => {
              const val = ashtakavarga.savTable[i];
              const strong = val >= 28;
              const weak = val < 22;
              return (
                <motion.div key={r.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-xl p-3 text-center border ${strong ? 'border-emerald-500/30 bg-emerald-500/10' : weak ? 'border-red-500/20 bg-red-500/5' : 'border-gold-primary/10 bg-bg-tertiary/30'}`}
                >
                  <RashiIconById id={r.id} size={24} />
                  <div className="text-[10px] text-text-secondary mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{r.name[locale]}</div>
                  <div className={`text-xl font-bold mt-1 ${strong ? 'text-emerald-400' : weak ? 'text-red-400' : 'text-gold-light'}`}>{val}</div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center text-text-secondary text-xs mt-4">
            {t('totalBindu')}: {ashtakavarga.savTable.reduce((a, b) => a + b, 0)}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 overflow-x-auto">
          <h4 className="text-gold-light text-lg font-semibold mb-4" style={headingFont}>{t('bhinnashtakavarga')}</h4>
          <p className="text-text-secondary text-xs mb-4">
            {locale === 'en' ? 'Individual planet bindu points per sign (max 8 per cell).' : 'प्रत्येक ग्रह के बिन्दु प्रति राशि (अधिकतम 8 प्रति कक्ष)।'}
          </p>
          <div className="min-w-[700px]">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gold-dark text-xs p-2">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                  {RASHIS.map(r => (
                    <th key={r.id} className="text-center p-1">
                      <div className="flex flex-col items-center">
                        <RashiIconById id={r.id} size={16} />
                        <span className="text-[9px] text-text-secondary/60 mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{r.name[locale].slice(0, 3)}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center text-gold-dark text-xs p-2">{locale === 'en' ? 'Total' : 'कुल'}</th>
                </tr>
              </thead>
              <tbody>
                {ashtakavarga.bpiTable.map((row, pi) => {
                  const graha = GRAHAS[pi];
                  const total = row.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={pi} className="border-t border-gold-primary/5">
                      <td className="p-2">
                        <div className="flex items-center gap-1.5">
                          <GrahaIconById id={pi} size={20} />
                          <span className="text-xs font-medium" style={{ color: graha.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>{graha.name[locale]}</span>
                        </div>
                      </td>
                      {row.map((val, si) => (
                        <td key={si} className="text-center p-1">
                          <span className={`text-xs font-mono ${val >= 5 ? 'text-emerald-400' : val <= 2 ? 'text-red-400/70' : 'text-text-secondary'}`}>{val}</span>
                        </td>
                      ))}
                      <td className="text-center p-2 font-bold text-gold-light text-xs">{total}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gold-primary/20">
                  <td className="p-2 font-bold text-gold-dark text-xs">SAV</td>
                  {ashtakavarga.savTable.map((val, si) => (
                    <td key={si} className="text-center p-1">
                      <span className={`text-xs font-bold ${val >= 28 ? 'text-emerald-400' : val < 22 ? 'text-red-400' : 'text-gold-light'}`}>{val}</span>
                    </td>
                  ))}
                  <td className="text-center p-2 font-bold text-gold-primary text-sm">{ashtakavarga.savTable.reduce((a, b) => a + b, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function YearPredictionsSection({ tip, locale, isDevanagari, headingFont, tTip }: {
  tip: TippanniContent; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; tTip: (key: string) => string;
}) {
  const [expandedRemedyIdx, setExpandedRemedyIdx] = useState<number | null>(null);
  const yp = tip.yearPredictions;

  const impactColors: Record<string, string> = {
    favorable: 'bg-emerald-500',
    mixed: 'bg-amber-500',
    challenging: 'bg-red-500',
  };
  const impactBadge: Record<string, string> = {
    favorable: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    mixed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    challenging: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const impactLabel = (impact: string) => tTip(impact);

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="text-center">
        <h3 className="text-2xl text-gold-gradient font-bold" style={headingFont}>
          {yp.year} {tTip('yearPredictions')}
        </h3>
      </div>

      {/* Overview card */}
      <div className="glass-card rounded-xl p-6 sm:p-8 border-2 border-gold-primary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-primary/0 via-gold-primary to-gold-primary/0" />
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('yearOverview')}</h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.overview}
        </p>
      </div>

      {/* Events timeline */}
      {yp.events.length > 0 && (
        <div className="glass-card rounded-xl p-6 sm:p-8">
          <h4 className="text-gold-light text-lg font-semibold mb-6" style={headingFont}>{tTip('majorEvents')}</h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-gold-primary/40 via-gold-primary/20 to-gold-primary/5" />

            <div className="space-y-6">
              {yp.events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-9"
                >
                  {/* Impact dot */}
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${impactColors[event.impact]} flex items-center justify-center`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h5 className="text-gold-light font-semibold text-sm flex-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {event.title}
                      </h5>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-text-secondary/60 text-xs font-mono">{event.period}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge[event.impact]}`}>
                          {impactLabel(event.impact)}
                        </span>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {event.description}
                    </p>

                    {event.remedies && (
                      <div>
                        <button
                          onClick={() => setExpandedRemedyIdx(expandedRemedyIdx === i ? null : i)}
                          className="text-amber-400 text-xs hover:text-amber-300 transition-colors"
                        >
                          {expandedRemedyIdx === i ? tTip('hideRemedies') : tTip('showRemedies')}
                        </button>
                        <AnimatePresence>
                          {expandedRemedyIdx === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                  {event.remedies}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quarterly forecast grid */}
      <div className="glass-card rounded-xl p-6 sm:p-8">
        <h4 className="text-gold-light text-lg font-semibold mb-6" style={headingFont}>{tTip('quarterlyOutlook')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {yp.quarters.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${
                q.outlook === 'favorable' ? 'border-emerald-500/20 bg-emerald-500/5'
                : q.outlook === 'challenging' ? 'border-red-500/20 bg-red-500/5'
                : 'border-amber-500/20 bg-amber-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light text-sm font-semibold">{q.quarter}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge[q.outlook]}`}>
                  {impactLabel(q.outlook)}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {q.summary}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key advice */}
      <div className="glass-card rounded-xl p-6 sm:p-8 border border-gold-primary/25 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('keyAdvice')}</h4>
        <p className="text-gold-light text-sm leading-relaxed font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.keyAdvice}
        </p>
      </div>
    </section>
  );
}

function ClassicalReferencesBlock({ refs, locale, isDevanagari }: {
  refs: TippanniContent['planetInsights'][0]['classicalReferences'];
  locale: Locale;
  isDevanagari: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!refs) return null;

  const confidenceColors: Record<string, string> = {
    high: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };

  return (
    <div className="mt-3 p-3 rounded-lg border-2 border-amber-600/20 bg-gradient-to-br from-amber-900/10 to-amber-800/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-400 text-xs uppercase tracking-wider font-semibold">
            {locale === 'en' ? 'Classical References' : locale === 'hi' ? 'शास्त्रीय सन्दर्भ' : 'शास्त्रीयसन्दर्भाः'}
          </span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${confidenceColors[refs.confidence]}`}>
          {refs.confidence}
        </span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {refs.summary}
      </p>
      {refs.citations.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-400/70 text-xs hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {expanded
              ? (locale === 'en' ? 'Hide citations' : 'सन्दर्भ छुपाएँ')
              : (locale === 'en' ? `View ${refs.citations.length} citation${refs.citations.length > 1 ? 's' : ''}` : `${refs.citations.length} सन्दर्भ देखें`)
            }
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2">
                  {refs.citations.map((cite, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-bg-primary/40 border border-amber-600/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 text-xs font-bold">{cite.textName}</span>
                        {cite.verseRange && <span className="text-text-secondary/50 text-[10px] font-mono">{cite.verseRange}</span>}
                      </div>
                      {cite.sanskritExcerpt && (
                        <p className="text-amber-200/60 text-xs italic mb-1" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                          {cite.sanskritExcerpt}
                        </p>
                      )}
                      <p className="text-text-secondary text-xs leading-relaxed">{cite.translationExcerpt}</p>
                      {cite.relevanceNote && (
                        <p className="text-amber-500/50 text-[10px] mt-1 italic">{cite.relevanceNote}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function TippanniTab({ kundali, locale, isDevanagari, headingFont, tTip }: {
  kundali: KundaliData; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; tTip: (key: string) => string;
}) {
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);
  const [expandedYoga, setExpandedYoga] = useState<number | null>(null);

  // Client-side base tippanni (renders immediately, memoized)
  const baseTip = useMemo(() => generateTippanni(kundali, locale), [kundali, locale]);

  // Server-side RAG-enhanced tippanni (loads async)
  const [ragTip, setRagTip] = useState<TippanniContent | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  // Stable key for useCallback dependency (avoid object reference issues)
  const kundaliKey = useMemo(
    () => `${kundali.ascendant.sign}-${kundali.planets.map(p => `${p.planet.id}:${p.house}:${p.sign}`).join(',')}`,
    [kundali]
  );

  const fetchRagTippanni = useCallback(async () => {
    setRagLoading(true);
    try {
      const res = await fetch('/api/tippanni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kundali, locale, ragEnabled: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ragEnabled) {
          setRagTip(data);
        }
      }
    } catch (err) {
      console.error('RAG tippanni fetch failed:', err);
    }
    setRagLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kundaliKey, locale]);

  useEffect(() => {
    fetchRagTippanni();
  }, [fetchRagTippanni]);

  // Use RAG-enhanced data if available, otherwise fall back to base
  const tip = ragTip || baseTip;

  const severityColors: Record<string, string> = {
    severe: 'bg-red-500/20 text-red-400',
    moderate: 'bg-orange-500/20 text-orange-400',
    mild: 'bg-yellow-500/20 text-yellow-400',
    none: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{tTip('title')}</h2>

      {/* RAG status indicator */}
      {tip.ragEnabled && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-400/60 text-xs">
            {locale === 'en' ? 'Enhanced with classical Jyotish text references' : 'शास्त्रीय ज्योतिष ग्रन्थ सन्दर्भों से समृद्ध'}
          </span>
        </div>
      )}
      {ragLoading && !tip.ragEnabled && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-amber-400/40 text-xs">
            {locale === 'en' ? 'Loading classical references...' : 'शास्त्रीय सन्दर्भ लोड हो रहे हैं...'}
          </span>
        </div>
      )}

      {/* ===== YEAR PREDICTIONS (at top — most immediately relevant) ===== */}
      <YearPredictionsSection tip={tip} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tTip={tTip} />

      <GoldDivider />

      {/* ===== PERSONALITY PROFILE ===== */}
      <section className="glass-card rounded-xl p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('personality')}</h3>
        <div className="space-y-6">
          {[tip.personality.lagna, tip.personality.moonSign, tip.personality.sunSign].map((block, i) => (
            block.content && (
              <div key={i} className="border-l-2 border-gold-primary/20 pl-4">
                <h4 className="text-gold-primary font-semibold mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{block.title}</h4>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{block.content}</div>
                {block.implications && (
                  <div className="mt-3 p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10">
                    <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Implications & Prognosis' : 'प्रभाव और पूर्वानुमान'}</p>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{block.implications}</div>
                  </div>
                )}
              </div>
            )
          ))}
          {tip.personality.summary && (
            <div className="p-4 bg-gold-primary/10 rounded-lg border border-gold-primary/20">
              <p className="text-gold-light text-sm font-medium leading-relaxed">{tip.personality.summary}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== PLANET PLACEMENT ANALYSIS ===== */}
      <section className="glass-card rounded-xl p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
          {locale === 'en' ? 'Planet Placement Analysis' : locale === 'hi' ? 'ग्रह स्थिति विश्लेषण' : 'ग्रहस्थितिविश्लेषणम्'}
        </h3>
        <div className="space-y-3">
          {tip.planetInsights.map((pi) => (
            <div key={pi.planetId}>
              <motion.div
                onClick={() => setExpandedPlanet(expandedPlanet === pi.planetId ? null : pi.planetId)}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:border-gold-primary/25 cursor-pointer transition-all"
                whileHover={{ scale: 1.005 }}
              >
                <GrahaIconById id={pi.planetId} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: pi.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>{pi.planetName}</span>
                    <span className="text-text-secondary/50 text-xs">
                      {locale === 'en' ? `House ${pi.house}` : `भाव ${pi.house}`} &middot; {pi.signName}
                    </span>
                    {pi.dignity && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{pi.dignity.split(' ')[2] === '—' ? '' : pi.dignity.includes('exalted') || pi.dignity.includes('उच्च') ? (locale === 'en' ? 'Exalted' : 'उच्च') : pi.dignity.includes('debilitated') || pi.dignity.includes('नीच') ? (locale === 'en' ? 'Debilitated' : 'नीच') : (locale === 'en' ? 'Own Sign' : 'स्वगृह')}</span>}
                    {pi.retrogradeEffect && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">R</span>}
                  </div>
                </div>
                <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${expandedPlanet === pi.planetId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
              <AnimatePresence>
                {expandedPlanet === pi.planetId && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 ml-11 space-y-3 border-l border-gold-primary/10">
                      <p className="text-text-secondary text-sm leading-relaxed">{pi.description}</p>
                      {pi.dignity && (
                        <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                          <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Dignity Status' : 'गरिमा स्थिति'}</p>
                          <p className="text-text-secondary text-sm">{pi.dignity}</p>
                        </div>
                      )}
                      {pi.retrogradeEffect && (
                        <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                          <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Retrograde Effect' : 'वक्री प्रभाव'}</p>
                          <p className="text-text-secondary text-sm">{pi.retrogradeEffect}</p>
                        </div>
                      )}
                      {pi.implications && (
                        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10">
                          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Practical Implications' : 'व्यावहारिक प्रभाव'}</p>
                          <p className="text-text-secondary text-sm">{pi.implications}</p>
                        </div>
                      )}
                      {pi.prognosis && (
                        <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                          <p className="text-indigo-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Life Prognosis' : 'जीवन पूर्वानुमान'}</p>
                          <p className="text-text-secondary text-sm">{pi.prognosis}</p>
                        </div>
                      )}
                      {pi.classicalReferences ? (
                        <ClassicalReferencesBlock refs={pi.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
                      ) : ragLoading ? (
                        <div className="mt-3 p-3 rounded-lg border border-amber-600/10 bg-amber-900/5 flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                          <span className="text-amber-400/50 text-xs">{locale === 'en' ? 'Loading classical references...' : 'शास्त्रीय सन्दर्भ लोड हो रहे हैं...'}</span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== YOGAS ===== */}
      <section className="glass-card rounded-xl p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('yogas')}</h3>
        <div className="space-y-3">
          {tip.yogas.map((yoga, i) => (
            <div key={i}>
              <motion.div
                onClick={() => setExpandedYoga(expandedYoga === i ? null : i)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${yoga.present ? 'border-green-500/20 bg-green-500/5 hover:border-green-500/30' : 'border-gold-primary/5 bg-bg-primary/30 hover:border-gold-primary/15'}`}
                whileHover={{ scale: 1.005 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gold-light font-semibold">{yoga.name}</span>
                  <div className="flex items-center gap-2">
                    {yoga.present && <span className={`text-xs px-2 py-0.5 rounded-full ${yoga.strength === 'Strong' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{yoga.strength}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${yoga.present ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {yoga.present ? tTip('present') : tTip('absent')}
                    </span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">{yoga.description}</p>
              </motion.div>
              <AnimatePresence>
                {expandedYoga === i && yoga.present && yoga.implications && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-2">
                      <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                        <p className="text-green-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'What This Means For You' : 'आपके लिए इसका अर्थ'}</p>
                        <p className="text-text-secondary text-sm">{yoga.implications}</p>
                      </div>
                      {yoga.classicalReferences && (
                        <ClassicalReferencesBlock refs={yoga.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DOSHAS ===== */}
      <section className="glass-card rounded-xl p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('doshas')}</h3>
        <div className="space-y-4">
          {tip.doshas.map((dosha, i) => (
            <div key={i} className={`p-4 rounded-lg border ${dosha.present ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/10 bg-bg-primary/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light font-semibold">{dosha.name}</span>
                <div className="flex items-center gap-2">
                  {dosha.present && <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[dosha.severity]}`}>{dosha.severity}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.present ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {dosha.present ? tTip('present') : tTip('absent')}
                  </span>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{dosha.description}</p>
              {dosha.present && dosha.remedies && (
                <div className="mt-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                  <p className="text-amber-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Remedial Measures' : 'उपचारात्मक उपाय'}</p>
                  <p className="text-text-secondary text-sm">{dosha.remedies}</p>
                </div>
              )}
              {dosha.classicalReferences && (
                <ClassicalReferencesBlock refs={dosha.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== LIFE AREA PROGNOSIS ===== */}
      <section className="glass-card rounded-xl p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
          {locale === 'en' ? 'Life Area Prognosis' : locale === 'hi' ? 'जीवन क्षेत्र पूर्वानुमान' : 'जीवनक्षेत्रपूर्वानुमानम्'}
        </h3>
        <div className="space-y-4">
          {(['career', 'wealth', 'marriage', 'health', 'education'] as const).map((key) => {
            const area = tip.lifeAreas[key];
            return (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/30 border border-gold-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gold-primary font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{area.label}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < area.rating ? 'bg-gold-primary' : 'bg-gold-primary/10'}`} />
                    ))}
                    <span className="text-gold-light text-xs ml-1 font-mono">{area.rating}/10</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{area.summary}</p>
                {area.details && <p className="text-text-secondary/70 text-xs leading-relaxed">{area.details}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== DASHA INSIGHT ===== */}
      {tip.dashaInsight.currentMaha && (
        <section className="glass-card rounded-xl p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('dashaAnalysis')}</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gold-primary/5 border border-gold-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-gold-primary animate-pulse" />
                <span className="text-gold-light font-semibold">{tip.dashaInsight.currentMaha}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{tip.dashaInsight.currentMahaAnalysis}</p>
            </div>
            {tip.dashaInsight.currentAntar && (
              <div className="p-4 rounded-lg bg-bg-primary/40 border border-gold-primary/10 ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-gold-primary" />
                  <span className="text-gold-light font-medium text-sm">{tip.dashaInsight.currentAntar}</span>
                </div>
                <p className="text-text-secondary text-sm">{tip.dashaInsight.currentAntarAnalysis}</p>
              </div>
            )}
            {tip.dashaInsight.upcoming && (
              <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 ml-4">
                <p className="text-indigo-400 text-xs uppercase tracking-wider mb-1">{tTip('upcoming')}</p>
                <p className="text-text-secondary text-sm">{tip.dashaInsight.upcoming}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== PLANETARY STRENGTH ===== */}
      {tip.strengthOverview.length > 0 && (
        <section className="glass-card rounded-xl p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
            {locale === 'en' ? 'Planetary Strength (Shadbala)' : locale === 'hi' ? 'ग्रह बल (षड्बल)' : 'ग्रहबलम् (षड्बलम्)'}
          </h3>
          <div className="space-y-3">
            {tip.strengthOverview.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-20 text-right font-medium" style={{ color: s.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>{s.planetName}</span>
                <div className="flex-1 bg-bg-primary/40 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.strength}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.planetColor, opacity: 0.7 }}
                  />
                </div>
                <span className={`text-xs w-16 ${s.strength >= 60 ? 'text-green-400' : s.strength >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {s.strength}% — {s.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== REMEDIES ===== */}
      {(tip.remedies.gemstones.length > 0 || tip.remedies.mantras.length > 0) && (
        <section className="glass-card rounded-xl p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('remedies')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tip.remedies.gemstones.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' ? 'Gemstones' : 'रत्न'}</h4>
                <div className="space-y-2">
                  {tip.remedies.gemstones.map((g, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold">{g.name}</p>
                      <p className="text-text-secondary/50 text-xs">{locale === 'en' ? 'For' : 'के लिए'}: {g.planet}</p>
                      <p className="text-text-secondary text-xs mt-1">{g.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tip.remedies.mantras.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' ? 'Mantras' : 'मन्त्र'}</h4>
                <div className="space-y-2">
                  {tip.remedies.mantras.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{m.name}</p>
                      <p className="text-text-secondary/50 text-xs">{locale === 'en' ? 'For' : 'के लिए'}: {m.planet}</p>
                      <p className="text-text-secondary text-xs mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tip.remedies.practices.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' ? 'Charitable Practices' : 'दानशील कार्य'}</h4>
                <div className="space-y-2">
                  {tip.remedies.practices.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold">{p.name}</p>
                      <p className="text-text-secondary text-xs mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

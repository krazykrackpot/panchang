'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import BirthForm from '@/components/kundali/BirthForm';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import ShareButton from '@/components/ui/ShareButton';
import { Download } from 'lucide-react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { KundaliData, BirthData, ChartStyle, PlanetPosition, AshtakavargaData, DivisionalChart, GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { Locale } from '@/types/panchang';
import { useBirthDataStore } from '@/stores/birth-data-store';
import ChartChatTab from '@/components/kundali/ChartChatTab';
import { generateVargaTippanni, type VargaChartTippanni, type VargaSynthesis } from '@/lib/tippanni/varga-tippanni';

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
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'ashtakavarga' | 'tippanni' | 'varga' | 'chat' | 'jaimini' | 'graha' | 'yogas' | 'shadbala' | 'bhavabala'>('chart');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<string>('D1');
  const [dashaSystem, setDashaSystem] = useState('vimshottari');
  const [showTransits, setShowTransits] = useState(false);
  const [transitData, setTransitData] = useState<{ planets: { id: number; name: { en: string; hi: string; sa: string }; rashi: number; longitude: number; isRetrograde: boolean }[] } | null>(null);

  // Fetch current transits when toggled on
  useEffect(() => {
    if (showTransits && !transitData) {
      fetch('/api/panchang').then(r => r.json()).then(data => {
        if (data.planets) setTransitData({ planets: data.planets });
      }).catch(() => {});
    }
  }, [showTransits, transitData]);

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
      // Persist Moon nakshatra & rashi for Chandrabalam/Tarabalam on panchang page
      if (data.planets) {
        const moon = data.planets.find((p: { planet: { id: number }; sign: number; nakshatra: number }) => p.planet.id === 1);
        if (moon) {
          useBirthDataStore.getState().setBirthData(moon.nakshatra, moon.sign, birthData.name || '');
        }
      }
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
            {/* Export & Share */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={async () => {
                  const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
                  exportKundaliPDF(kundali, locale as Locale);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                aria-label="Download PDF report"
              >
                <Download className="w-4 h-4" />
                PDF Report
              </button>
              <ShareButton
                title={`Kundali — ${kundali.birthData.name}`}
                text={`Vedic birth chart for ${kundali.birthData.name} generated on Jyotish Panchang`}
              />
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
              { key: 'varga' as const, label: locale === 'en' ? 'Varga Analysis' : 'वर्ग विश्लेषण' },
              { key: 'chat' as const, label: locale === 'en' ? 'Chat' : 'चैट' },
              { key: 'graha' as const, label: locale === 'en' ? 'Graha' : 'ग्रह' },
              { key: 'yogas' as const, label: locale === 'en' ? 'Yogas' : 'योग' },
              { key: 'shadbala' as const, label: locale === 'en' ? 'Shadbala' : 'षड्बल' },
              { key: 'bhavabala' as const, label: locale === 'en' ? 'Bhavabala' : 'भावबल' },
              { key: 'jaimini' as const, label: locale === 'en' ? 'Jaimini' : 'जैमिनी' },
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
              {/* Chart type selector — all Parashara vargas */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {([
                  { key: 'D1', label: locale === 'en' ? 'D1 Rashi' : 'D1 राशि' },
                  { key: 'bhav_chalit', label: locale === 'en' ? 'BC' : 'भा.च.' },
                  { key: 'D9', label: locale === 'en' ? 'D9 Navamsha' : 'D9 नवांश' },
                  ...(kundali.divisionalCharts ? Object.entries(kundali.divisionalCharts).map(([key, dc]) => ({
                    key,
                    label: `${key}`,
                  })) : []),
                ]).map(c => (
                  <button key={c.key} onClick={() => setActiveChart(c.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      activeChart === c.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Chart meaning description */}
              {activeChart !== 'D1' && activeChart !== 'bhav_chalit' && activeChart !== 'D9' && kundali.divisionalCharts?.[activeChart] && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{kundali.divisionalCharts[activeChart].label[locale as Locale]}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{(kundali.divisionalCharts[activeChart] as DivisionalChart & { meaning?: { en: string; hi: string } }).meaning?.[locale === 'hi' ? 'hi' : 'en'] || ''}</span>
                </div>
              )}
              {activeChart === 'D9' && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{t('navamsha')}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{locale === 'en' ? 'Marriage, dharma & inner self — the most important divisional chart' : 'विवाह, धर्म एवं आंतरिक स्वरूप — सर्वाधिक महत्वपूर्ण वर्ग चार्ट'}</span>
                </div>
              )}
              {activeChart === 'bhav_chalit' && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{t('bhavChalit')}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{locale === 'en' ? 'Mid-cusp house system — planets may shift houses compared to D1' : 'मध्य-शिखर भाव पद्धति — D1 की तुलना में ग्रह भाव बदल सकते हैं'}</span>
                </div>
              )}

              {/* Style toggle */}
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setChartStyle('north')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('north')}
                </button>
                <button onClick={() => setChartStyle('south')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('south')}
                </button>
              </div>

              <div className="flex justify-center gap-3 mb-4 flex-wrap">
                <button onClick={() => setShowTransits(!showTransits)}
                  className={`px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${showTransits ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
                  <span className={`w-2 h-2 rounded-full ${showTransits ? 'bg-emerald-400' : 'bg-text-secondary/30'}`} />
                  {locale === 'en' ? 'Show Current Transits' : 'वर्तमान गोचर दिखाएं'}
                </button>
              </div>
              {showTransits && (
                <div className="mb-4">
                  <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-3">
                    <div className="text-emerald-400 text-xs font-medium mb-1">{locale === 'en' ? 'Current Transit Positions' : 'वर्तमान गोचर स्थितियाँ'}</div>
                    <div className="text-text-tertiary text-[10px]">{locale === 'en' ? `As of ${new Date().toLocaleDateString()}` : `${new Date().toLocaleDateString('hi-IN')}`}</div>
                  </div>
                  {transitData && (
                    <div className="glass-card rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                        {transitData.planets?.map((p: { id: number; name: { en: string; hi: string; sa: string }; rashi: number; longitude: number; isRetrograde: boolean }, i: number) => {
                          const rashiName = RASHIS[p.rashi - 1]?.name[locale as Locale] || '';
                          const natalPlanet = kundali.planets.find(np => np.planet.id === p.id);
                          const isSameSign = natalPlanet && natalPlanet.sign === p.rashi;
                          return (
                            <div key={i} className={`text-center p-2 rounded-lg ${isSameSign ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-bg-secondary/50'}`}>
                              <div className="text-gold-light text-xs font-bold">{p.name[locale as Locale]}</div>
                              <div className="text-emerald-400 text-[10px] font-medium mt-0.5">{rashiName}</div>
                              {p.isRetrograde && <div className="text-red-400 text-[9px]">℞</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
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

              {/* ── Inline Chart Commentary ── */}
              {(() => {
                const vargaData = generateVargaTippanni(kundali, locale as Locale);
                const chartInsight = vargaData.vargaInsights.find(v =>
                  v.chart === activeChart || (activeChart === 'bhav_chalit' && v.chart === 'BC')
                );
                if (!chartInsight) return null;
                const isHi = locale === 'hi';
                const sC: Record<string, string> = { strong: 'border-emerald-500/20', moderate: 'border-amber-500/20', weak: 'border-red-500/20' };
                const sL: Record<string, string> = { strong: isHi ? 'बलवान' : 'Strong', moderate: isHi ? 'मध्यम' : 'Moderate', weak: isHi ? 'दुर्बल' : 'Weak' };
                const sClr: Record<string, string> = { strong: 'text-emerald-400', moderate: 'text-amber-400', weak: 'text-red-400' };
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeChart}
                    className={`mt-8 glass-card rounded-2xl p-5 border ${sC[chartInsight.strength]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gold-light font-bold text-sm" style={headingFont}>
                        {chartInsight.chart} — {isHi ? chartInsight.meaning.hi : chartInsight.meaning.en}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sC[chartInsight.strength]} ${sClr[chartInsight.strength]}`}>
                        {sL[chartInsight.strength]}
                      </span>
                    </div>

                    {/* Overall Commentary */}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3 whitespace-pre-line">
                      {isHi ? chartInsight.overallCommentary.hi : chartInsight.overallCommentary.en}
                    </div>

                    {/* Key Findings */}
                    {chartInsight.keyFindings.length > 0 && (
                      <div className="mb-3">
                        <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1.5">
                          {isHi ? 'प्रमुख निष्कर्ष' : 'Key Findings'}
                        </div>
                        <div className="space-y-1">
                          {chartInsight.keyFindings.map((f, j) => (
                            <div key={j} className="text-text-secondary text-xs leading-relaxed flex gap-2">
                              <span className="text-gold-dark mt-0.5 shrink-0">•</span>
                              <span>{isHi ? f.hi : f.en}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prognosis */}
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                      <div className="text-indigo-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                        {isHi ? '1-2 वर्ष की प्रगति' : '1-2 Year Prognosis'}
                      </div>
                      <div className="text-text-secondary text-xs leading-relaxed">
                        {isHi ? chartInsight.prognosis.hi : chartInsight.prognosis.en}
                      </div>
                    </div>
                  </motion.div>
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
              {/* Dasha system selector */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {[
                  { key: 'vimshottari', label: locale === 'en' ? 'Vimshottari (120yr)' : 'विंशोत्तरी' },
                  ...(kundali.yoginiDashas ? [{ key: 'yogini', label: locale === 'en' ? 'Yogini (36yr)' : 'योगिनी' }] : []),
                  ...(kundali.ashtottariDashas ? [{ key: 'ashtottari', label: locale === 'en' ? 'Ashtottari (108yr)' : 'अष्टोत्तरी' }] : []),
                ].map(dt => (
                  <button key={dt.key} onClick={() => setDashaSystem(dt.key)}
                    className={`px-4 py-1.5 rounded-lg text-xs transition-all ${dashaSystem === dt.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>
                    {dt.label}
                  </button>
                ))}
              </div>
              <h3 className="text-gold-gradient text-xl font-bold mb-6 text-center" style={headingFont}>{t('dashaTimeline')}</h3>
              {(dashaSystem === 'yogini' ? kundali.yoginiDashas : dashaSystem === 'ashtottari' ? kundali.ashtottariDashas : kundali.dashas)?.map((dasha, i) => {
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

          {/* ===== VARGA ANALYSIS TAB ===== */}
          {activeTab === 'varga' && (
            <VargaAnalysisTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
          )}

          {/* ===== GRAHA TAB ===== */}
          {activeTab === 'graha' && kundali.grahaDetails && (
            <GrahaTab grahaDetails={kundali.grahaDetails} upagrahas={kundali.upagrahas || []} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
          )}

          {/* ===== YOGAS TAB ===== */}
          {activeTab === 'yogas' && kundali.yogasComplete && (
            <YogasTab yogas={kundali.yogasComplete} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
          )}

          {/* ===== SHADBALA TAB ===== */}
          {activeTab === 'shadbala' && kundali.fullShadbala && (
            <ShadbalaTab shadbala={kundali.fullShadbala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
          )}

          {/* ===== BHAVABALA TAB ===== */}
          {activeTab === 'bhavabala' && kundali.bhavabala && (
            <BhavabalaTab bhavabala={kundali.bhavabala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
          )}

          {/* ===== CHAT TAB ===== */}
          {activeTab === 'chat' && (
            <ChartChatTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
          )}

          {/* ===== JAIMINI TAB ===== */}
          {activeTab === 'jaimini' && kundali.jaimini && (
            <div className="space-y-8">
              {/* Chara Karakas */}
              <div>
                <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                  {locale === 'en' ? 'Chara Karakas (Variable Significators)' : 'चर कारक'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {kundali.jaimini.charaKarakas.map((ck, i) => (
                    <div key={i} className={`glass-card rounded-xl p-4 ${i === 0 ? 'border-gold-primary/30 bg-gold-primary/5' : ''}`}>
                      <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">{ck.karaka}</div>
                      <div className="text-gold-light font-bold text-lg" style={headingFont}>{ck.planetName[locale]}</div>
                      <div className="text-text-secondary text-xs mt-1">{ck.karakaName[locale]}</div>
                      <div className="text-text-tertiary text-[10px] mt-1">{ck.degree.toFixed(2)}° {locale === 'en' ? 'in sign' : 'अंश'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Karakamsha */}
              <div className="text-center">
                <div className="inline-block glass-card rounded-2xl p-6 border border-gold-primary/20">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">{locale === 'en' ? 'Karakamsha' : 'कारकांश'}</div>
                  <div className="text-gold-light font-bold text-2xl" style={headingFont}>{kundali.jaimini.karakamsha.signName[locale]}</div>
                  <div className="text-text-secondary text-xs mt-2">{locale === 'en' ? 'Navamsha sign of Atmakaraka — key to soul purpose' : 'आत्मकारक का नवांश — आत्मा के उद्देश्य की कुंजी'}</div>
                </div>
              </div>

              {/* Arudha Padas */}
              <div>
                <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                  {locale === 'en' ? 'Arudha Padas (Image Points)' : 'आरूढ़ पद'}
                </h3>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-gold-primary/10">
                    {kundali.jaimini.arudhaPadas.map((ap, i) => (
                      <div key={i} className={`p-3 text-center ${i === 0 ? 'bg-gold-primary/5' : ''}`}>
                        <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">A{ap.house}</div>
                        <div className="text-gold-light font-bold text-sm mt-1" style={headingFont}>{ap.signName[locale]}</div>
                        <div className="text-text-tertiary text-[9px] mt-1 leading-tight">{ap.label[locale]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chara Dasha */}
              <div>
                <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                  {locale === 'en' ? 'Chara Dasha (Sign-Based Periods)' : 'चर दशा (राशि आधारित)'}
                </h3>
                <div className="space-y-2">
                  {kundali.jaimini.charaDasha.map((cd, i) => {
                    const now = new Date();
                    const start = new Date(cd.startDate);
                    const end = new Date(cd.endDate);
                    const isCurrent = now >= start && now <= end;
                    const isPast = now > end;
                    return (
                      <div key={i} className={`glass-card rounded-xl p-4 flex items-center justify-between ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-40' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/50'}`} />
                          <span className="text-gold-light font-bold" style={headingFont}>{cd.signName[locale]}</span>
                          <span className="text-text-tertiary text-xs">{cd.years} {locale === 'en' ? 'years' : 'वर्ष'}</span>
                        </div>
                        <span className="text-text-secondary text-xs font-mono">{cd.startDate} → {cd.endDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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

function VargaAnalysisTab({ kundali, locale, headingFont }: {
  kundali: KundaliData; locale: Locale; headingFont: React.CSSProperties;
}) {
  const synthesis = useMemo(() => generateVargaTippanni(kundali, locale), [kundali, locale]);
  const isHi = locale === 'hi';
  const sC: Record<string, string> = { strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20', weak: 'text-red-400 bg-red-500/10 border-red-500/20' };
  const sL: Record<string, { en: string; hi: string }> = { strong: { en: 'Strong', hi: 'बलवान' }, moderate: { en: 'Moderate', hi: 'मध्यम' }, weak: { en: 'Weak', hi: 'दुर्बल' } };

  return (
    <div className="space-y-8">
      {/* Overall Synthesis */}
      <div className="glass-card rounded-2xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
          {isHi ? 'वर्ग संश्लेषण — समस्त विभागीय चार्ट' : 'Varga Synthesis — All Divisional Charts'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{isHi ? synthesis.overall.hi : synthesis.overall.en}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {synthesis.strongAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{isHi ? 'बलवान क्षेत्र' : 'Strong Areas'}</div>
              {synthesis.strongAreas.map((a, i) => (
                <div key={i} className="text-emerald-300 text-xs mb-1">+ {isHi ? a.hi : a.en}</div>
              ))}
            </div>
          )}
          {synthesis.weakAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
              <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-2">{isHi ? 'ध्यान देने योग्य' : 'Needs Attention'}</div>
              {synthesis.weakAreas.map((a, i) => (
                <div key={i} className="text-red-300 text-xs mb-1">- {isHi ? a.hi : a.en}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strength grid */}
      <div>
        <h3 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>
          {isHi ? 'वर्ग बल अवलोकन' : 'Varga Strength Overview'}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
          {synthesis.vargaInsights.map((v, i) => (
            <div key={i} className={`rounded-lg p-2 border text-center ${sC[v.strength]}`}>
              <div className="font-bold text-xs">{v.chart}</div>
              <div className="text-[8px] text-text-tertiary leading-tight mt-0.5">{isHi ? v.meaning.hi : v.meaning.en}</div>
              <div className="text-[10px] font-medium mt-0.5">{isHi ? sL[v.strength].hi : sL[v.strength].en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-chart detailed commentary */}
      <div>
        <h3 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>
          {isHi ? 'प्रति-चार्ट विस्तृत टिप्पणी' : 'Detailed Per-Chart Commentary'}
        </h3>
        <div className="space-y-4">
          {synthesis.vargaInsights.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl overflow-hidden">
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b border-gold-primary/10 ${sC[v.strength].split(' ').slice(1).join(' ')}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gold-light font-bold text-lg">{v.chart}</span>
                  <span className="text-text-secondary text-xs">{isHi ? v.label.hi : v.label.en}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sC[v.strength]}`}>
                  {isHi ? sL[v.strength].hi : sL[v.strength].en}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Overall Commentary */}
                <div>
                  <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'समग्र टिप्पणी' : 'Overall Commentary'}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
                    {isHi ? v.overallCommentary.hi : v.overallCommentary.en}
                  </div>
                </div>

                {/* Key Findings */}
                {v.keyFindings.length > 0 && (
                  <div>
                    <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
                      {isHi ? 'प्रमुख निष्कर्ष' : 'Key Findings'}
                    </div>
                    <div className="space-y-1">
                      {v.keyFindings.map((f, j) => (
                        <div key={j} className="text-text-secondary text-xs leading-relaxed flex gap-2">
                          <span className="text-gold-dark mt-0.5 shrink-0">•</span>
                          <span>{isHi ? f.hi : f.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prognosis */}
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                  <div className="text-indigo-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                    {isHi ? '1-2 वर्ष की प्रगति' : '1-2 Year Prognosis'}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    {isHi ? v.prognosis.hi : v.prognosis.en}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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

// ===== GRAHA TAB COMPONENT =====
function GrahaTab({ grahaDetails, upagrahas, locale, isDevanagari, headingFont }: {
  grahaDetails: GrahaDetail[];
  upagrahas: UpagrahaPosition[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' ? 'Graha Details' : 'ग्रह विवरण'}
      </h3>

      {/* Graha Table */}
      <div className="glass-card rounded-xl p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' ? 'Graha' : 'ग्रह'}</th>
              <th className="text-center py-3 px-1">R</th>
              <th className="text-center py-3 px-1">C</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' ? 'Longitude' : 'भोगांश'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' ? 'Nakshatra / Swami' : 'नक्षत्र / स्वामी'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Raw L.' : 'कच्चा अं.'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Latitude' : 'अक्षांश'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'R.A.' : 'विषु.अं.'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Declination' : 'क्रान्ति'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Speed °/day' : 'गति °/दि'}</th>
            </tr>
          </thead>
          <tbody>
            {grahaDetails.map((g) => (
              <tr key={g.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <GrahaIconById id={g.planetId} size={20} />
                    <span className="text-gold-light font-medium" style={bodyFont}>{g.planetName[locale]}</span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isRetrograde && <span className="text-red-400 font-bold text-xs">R</span>}
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isCombust && <span className="text-orange-400 font-bold text-xs">C</span>}
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary">{g.signName[locale]}</span>
                  <span className="text-text-secondary ml-1">{g.signDegree}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary" style={bodyFont}>{g.nakshatraName[locale]}</span>
                  <span className="text-gold-dark ml-1 text-xs">P{g.nakshatraPada}</span>
                  <span className="text-text-secondary/60 ml-1 text-xs">/ {g.nakshatraLord[locale]}</span>
                </td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.longitude.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.latitude.toFixed(4)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.rightAscension.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.declination.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right font-mono text-xs">
                  <span className={g.speed < 0 ? 'text-red-400' : 'text-text-secondary'}>{g.speed.toFixed(4)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upagrahas */}
      {upagrahas.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gold-gradient text-center mb-4" style={headingFont}>
            {locale === 'en' ? 'Upagraha Positions' : 'उपग्रह स्थिति'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {upagrahas.map((u, i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-center">
                <p className="text-gold-light font-bold text-sm mb-1" style={bodyFont}>{u.name[locale]}</p>
                <RashiIconById id={u.sign} size={28} />
                <p className="text-text-primary text-sm mt-1" style={bodyFont}>{u.signName[locale]} {u.degree}</p>
                <p className="text-text-secondary/60 text-xs mt-0.5" style={bodyFont}>{u.nakshatra[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== YOGAS TAB COMPONENT =====
function YogasTab({ yogas, locale, isDevanagari, headingFont }: {
  yogas: YogaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const [filter, setFilter] = useState<'all' | 'present' | 'auspicious' | 'inauspicious'>('all');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);

  const filtered = yogas.filter(y => {
    if (filter === 'present') return y.present;
    if (filter === 'auspicious') return y.isAuspicious;
    if (filter === 'inauspicious') return !y.isAuspicious;
    return true;
  });

  const presentCount = yogas.filter(y => y.present).length;
  const auspiciousPresent = yogas.filter(y => y.present && y.isAuspicious).length;
  const inauspiciousPresent = yogas.filter(y => y.present && !y.isAuspicious).length;

  const CATEGORY_LABELS: Record<string, { en: string; hi: string }> = {
    dosha: { en: 'Doshas', hi: 'दोष' },
    mahapurusha: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष' },
    moon_based: { en: 'Moon-Based Yogas', hi: 'चन्द्र आधारित योग' },
    sun_based: { en: 'Sun-Based Yogas', hi: 'सूर्य आधारित योग' },
    raja: { en: 'Raja Yogas', hi: 'राजयोग' },
    wealth: { en: 'Wealth Yogas', hi: 'धनयोग' },
    inauspicious: { en: 'Inauspicious Yogas', hi: 'अशुभ योग' },
    other: { en: 'Other Yogas', hi: 'अन्य योग' },
  };

  const categories = ['dosha', 'mahapurusha', 'moon_based', 'sun_based', 'raja', 'wealth', 'inauspicious', 'other'];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' ? 'Yogas Analysis' : 'योग विश्लेषण'}
      </h3>

      {/* Summary badges */}
      <div className="flex justify-center gap-4 text-sm">
        <span className="px-3 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20">
          {locale === 'en' ? `${presentCount} Present` : `${presentCount} उपस्थित`}
        </span>
        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          {locale === 'en' ? `${auspiciousPresent} Auspicious` : `${auspiciousPresent} शुभ`}
        </span>
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {locale === 'en' ? `${inauspiciousPresent} Inauspicious` : `${inauspiciousPresent} अशुभ`}
        </span>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 flex-wrap">
        {([
          { key: 'all' as const, label: locale === 'en' ? 'All' : 'सभी' },
          { key: 'present' as const, label: locale === 'en' ? 'Present' : 'उपस्थित' },
          { key: 'auspicious' as const, label: locale === 'en' ? 'Auspicious' : 'शुभ' },
          { key: 'inauspicious' as const, label: locale === 'en' ? 'Inauspicious' : 'अशुभ' },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Yogas grouped by category */}
      {categories.map(cat => {
        const catYogas = filtered.filter(y => y.category === cat);
        if (catYogas.length === 0) return null;
        const catLabel = CATEGORY_LABELS[cat] || { en: cat, hi: cat };
        return (
          <div key={cat}>
            <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-3 font-bold" style={bodyFont}>
              {catLabel[locale === 'sa' ? 'hi' : locale]}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {catYogas.map(y => (
                <div key={y.id}
                  className={`rounded-xl p-3 border transition-all cursor-pointer ${
                    y.present
                      ? 'border-gold-primary/30 bg-gold-primary/5'
                      : 'border-gold-primary/5 bg-bg-primary/20 opacity-50'
                  }`}
                  onClick={() => setExpandedYoga(expandedYoga === y.id ? null : y.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-light font-medium text-sm" style={bodyFont}>{y.name[locale]}</span>
                      {y.present && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          y.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                          y.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {y.strength}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        y.isAuspicious ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {y.isAuspicious ? (locale === 'en' ? 'Auspicious' : 'शुभ') : (locale === 'en' ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${y.present ? 'bg-gold-primary/20 text-gold-light' : 'bg-bg-primary/50 text-text-secondary/50'}`}>
                        {y.present ? (locale === 'en' ? 'Present' : 'है') : (locale === 'en' ? 'Absent' : 'नहीं')}
                      </span>
                    </div>
                  </div>
                  {expandedYoga === y.id && (
                    <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                      <p className="text-text-secondary text-xs" style={bodyFont}>{y.description[locale]}</p>
                      <p className="text-gold-dark text-[10px] italic" style={bodyFont}>
                        {locale === 'en' ? 'Rule' : 'नियम'}: {y.formationRule[locale]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== SHADBALA TAB COMPONENT =====
function ShadbalaTab({ shadbala, locale, isDevanagari, headingFont }: {
  shadbala: ShadBalaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const PLANET_LABELS: Record<string, { en: string; hi: string }> = {
    Sun: { en: 'Sun', hi: 'सूर्य' }, Moon: { en: 'Moon', hi: 'चन्द्र' },
    Mars: { en: 'Mars', hi: 'मंगल' }, Mercury: { en: 'Mercury', hi: 'बुध' },
    Jupiter: { en: 'Jupiter', hi: 'बृहस्पति' }, Venus: { en: 'Venus', hi: 'शुक्र' },
    Saturn: { en: 'Saturn', hi: 'शनि' },
  };

  const ROW_LABELS: { key: string; en: string; hi: string }[] = [
    { key: 'rank', en: 'Relative Rank', hi: 'सापेक्ष क्रम' },
    { key: 'sthana', en: 'Sthana Bala', hi: 'स्थान बल' },
    { key: 'disha', en: 'Dig Bala', hi: 'दिग्बल' },
    { key: 'kala', en: 'Kala Bala', hi: 'कालबल' },
    { key: 'chesta', en: 'Chesta Bala', hi: 'चेष्टाबल' },
    { key: 'naisargika', en: 'Naisargika Bala', hi: 'नैसर्गिक बल' },
    { key: 'drishti', en: 'Drik Bala', hi: 'दृक्बल' },
    { key: 'divider1', en: '', hi: '' },
    { key: 'total', en: 'Total Pinda', hi: 'कुल पिण्ड' },
    { key: 'rupas', en: 'Rupas', hi: 'रूप' },
    { key: 'minReq', en: 'Min. Required', hi: 'न्यूनतम' },
    { key: 'ratio', en: 'Strength Ratio', hi: 'बल अनुपात' },
    { key: 'divider2', en: '', hi: '' },
    { key: 'ishta', en: 'Ishta Phala', hi: 'इष्ट फल' },
    { key: 'kashta', en: 'Kashta Phala', hi: 'कष्ट फल' },
  ];

  function getValue(s: ShadBalaComplete, key: string): string {
    switch (key) {
      case 'rank': return String(s.rank);
      case 'sthana': return s.sthanaBala.toFixed(2);
      case 'disha': return s.digBala.toFixed(2);
      case 'kala': return s.kalaBala.toFixed(2);
      case 'chesta': return s.cheshtaBala.toFixed(2);
      case 'naisargika': return s.naisargikaBala.toFixed(2);
      case 'drishti': return (s.drikBala >= 0 ? '+' : '') + s.drikBala.toFixed(2);
      case 'total': return s.totalPinda.toFixed(2);
      case 'rupas': return s.rupas.toFixed(2);
      case 'minReq': return s.minRequired.toFixed(2);
      case 'ratio': return s.strengthRatio.toFixed(4);
      case 'ishta': return s.ishtaPhala.toFixed(2);
      case 'kashta': return s.kashtaPhala.toFixed(2);
      default: return '';
    }
  }

  function getColor(s: ShadBalaComplete, key: string): string {
    if (key === 'ratio') {
      return s.strengthRatio >= 1.5 ? 'text-green-400' : s.strengthRatio >= 1.0 ? 'text-gold-light' : 'text-red-400';
    }
    if (key === 'drishti') return s.drikBala >= 0 ? 'text-green-400' : 'text-red-400';
    if (key === 'rank') return s.rank <= 2 ? 'text-green-400 font-bold' : 'text-text-secondary';
    return 'text-text-secondary';
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' ? 'Shadbala — Six-Fold Strength' : 'षड्बल — छह प्रकार का बल'}
      </h3>
      <p className="text-text-secondary text-xs text-center max-w-2xl mx-auto" style={bodyFont}>
        {locale === 'en'
          ? 'Classical six-component planetary strength calculation. Values in Shashtiamshas (60ths of a Rupa). Strength Ratio above 1.0 indicates adequate strength.'
          : 'शास्त्रीय षड्बल गणना। मान षष्ट्यंशों में। बल अनुपात 1.0 से अधिक पर्याप्त बल दर्शाता है।'}
      </p>

      <div className="glass-card rounded-xl p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-left py-3 px-2 text-text-secondary text-xs" style={bodyFont}></th>
              {shadbala.map(s => {
                const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
                return (
                  <th key={s.planetId} className="text-center py-3 px-2 min-w-[70px]">
                    <GrahaIconById id={s.planetId} size={20} />
                    <p className="text-gold-light text-xs font-medium mt-1" style={bodyFont}>{label[locale === 'sa' ? 'hi' : locale]}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map(row => {
              if (row.key.startsWith('divider')) {
                return <tr key={row.key}><td colSpan={8} className="py-1"><div className="border-t border-gold-primary/15" /></td></tr>;
              }
              const isSummary = ['total', 'rupas', 'ratio'].includes(row.key);
              return (
                <tr key={row.key} className={isSummary ? 'bg-gold-primary/5' : 'hover:bg-gold-primary/3'}>
                  <td className={`py-2 px-2 text-xs ${isSummary ? 'text-gold-light font-bold' : 'text-text-secondary'}`} style={bodyFont}>
                    {row[locale === 'sa' ? 'hi' : locale]}
                  </td>
                  {shadbala.map(s => (
                    <td key={s.planetId} className={`py-2 px-2 text-center font-mono text-xs ${isSummary ? 'font-bold ' : ''}${getColor(s, row.key)}`}>
                      {getValue(s, row.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Strength Ratio Bar Chart */}
      <div className="glass-card rounded-xl p-6">
        <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-4 font-bold text-center" style={bodyFont}>
          {locale === 'en' ? 'Strength Ratio (Min. Required = 1.0)' : 'बल अनुपात (न्यूनतम = 1.0)'}
        </h4>
        <div className="space-y-3">
          {shadbala.map(s => {
            const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
            const pct = Math.min(100, (s.strengthRatio / 2) * 100);
            const color = s.strengthRatio >= 1.5 ? '#4ade80' : s.strengthRatio >= 1.0 ? '#d4a853' : '#f87171';
            return (
              <div key={s.planetId} className="flex items-center gap-3">
                <div className="w-20 text-right text-xs text-gold-light" style={bodyFont}>{label[locale === 'sa' ? 'hi' : locale]}</div>
                <div className="flex-1 bg-bg-primary/60 rounded-full h-5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="w-14 text-right text-xs font-mono" style={{ color }}>{s.strengthRatio.toFixed(2)}</div>
              </div>
            );
          })}
          {/* Min line indicator */}
          <div className="relative mt-1">
            <div className="absolute left-[calc(50%+40px)] top-0 w-px h-3 bg-red-400/50" />
            <p className="text-center text-[10px] text-red-400/50 ml-20">{locale === 'en' ? '1.0 = minimum adequate' : '1.0 = पर्याप्त'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== BHAVABALA TAB COMPONENT =====
function BhavabalaTab({ bhavabala, locale, isDevanagari, headingFont }: {
  bhavabala: BhavaBalaResult[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const HOUSE_NAMES: Record<number, { en: string; hi: string }> = {
    1: { en: 'Self / Lagna', hi: 'तनु / लग्न' },
    2: { en: 'Wealth / Dhana', hi: 'धन' },
    3: { en: 'Siblings / Sahaja', hi: 'सहज' },
    4: { en: 'Mother / Sukha', hi: 'सुख / मातृ' },
    5: { en: 'Children / Putra', hi: 'पुत्र / संतान' },
    6: { en: 'Enemies / Ripu', hi: 'रिपु / शत्रु' },
    7: { en: 'Spouse / Yuvati', hi: 'युवती / जाया' },
    8: { en: 'Longevity / Randhra', hi: 'रन्ध्र / आयु' },
    9: { en: 'Fortune / Dharma', hi: 'धर्म / भाग्य' },
    10: { en: 'Career / Karma', hi: 'कर्म / राज्य' },
    11: { en: 'Gains / Labha', hi: 'लाभ' },
    12: { en: 'Loss / Vyaya', hi: 'व्यय' },
  };

  const maxTotal = Math.max(...bhavabala.map(b => b.total));

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' ? 'Bhavabala — House Strength' : 'भावबल — भाव शक्ति'}
      </h3>

      <div className="glass-card rounded-xl p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' ? 'Bhava' : 'भाव'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' ? 'Signification' : 'कारकत्व'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' ? 'Lord' : 'स्वामी'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Lord Bala' : 'स्वामी बल'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Dig Bala' : 'दिग्बल'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Drishti' : 'दृष्टि'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' ? 'Total' : 'कुल'}</th>
              <th className="text-right py-3 px-2">%</th>
            </tr>
          </thead>
          <tbody>
            {bhavabala.map(b => {
              const houseName = HOUSE_NAMES[b.bhava] || { en: `House ${b.bhava}`, hi: `भाव ${b.bhava}` };
              const pct = b.strengthPercent;
              const color = pct >= 120 ? 'text-green-400' : pct >= 90 ? 'text-gold-light' : 'text-red-400';
              return (
                <tr key={b.bhava} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                  <td className="py-2.5 px-2 text-gold-light font-bold">{b.bhava}</td>
                  <td className="py-2.5 px-2 text-text-secondary text-xs" style={bodyFont}>{houseName[locale === 'sa' ? 'hi' : locale]}</td>
                  <td className="py-2.5 px-2">
                    {b.lordId <= 6 && <GrahaIconById id={b.lordId} size={16} />}
                    <span className="text-text-primary text-xs ml-1">{b.lordName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavadhipatiBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavaDigBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    <span className={b.bhavaDrishtiBala >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {b.bhavaDrishtiBala >= 0 ? '+' : ''}{b.bhavaDrishtiBala.toFixed(0)}
                    </span>
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{b.total.toFixed(0)}</td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual bar chart */}
      <div className="glass-card rounded-xl p-6">
        <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-4 font-bold text-center" style={bodyFont}>
          {locale === 'en' ? 'House Strength Distribution' : 'भाव बल वितरण'}
        </h4>
        <div className="space-y-2">
          {bhavabala.map(b => {
            const pct = Math.min(100, (b.total / maxTotal) * 100);
            const color = b.strengthPercent >= 120 ? '#4ade80' : b.strengthPercent >= 90 ? '#d4a853' : '#f87171';
            const houseName = HOUSE_NAMES[b.bhava] || { en: `H${b.bhava}`, hi: `भा${b.bhava}` };
            return (
              <div key={b.bhava} className="flex items-center gap-3">
                <div className="w-6 text-right text-xs text-gold-light font-bold">{b.bhava}</div>
                <div className="w-20 text-right text-[10px] text-text-secondary truncate" style={bodyFont}>{houseName[locale === 'sa' ? 'hi' : locale]}</div>
                <div className="flex-1 bg-bg-primary/60 rounded-full h-4 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="w-12 text-right text-xs font-mono" style={{ color }}>{b.strengthPercent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
